'use strict';
/**
 * Admin bot tugmalari (6- va 7-bosqich):
 *   ✅ Joylash        → materials ga published holatda yoziladi
 *   🔁 Qayta ishlash  → sabab so'raladi: 🖼 Rasm / 📝 Matn / 📊 Ma'lumot → o'sha qism qaytadan ishlanadi
 *   ❌ Rad etish      → nomzod yopiladi (haftalik limitdan chiqadi, keyingi kun yangisi topiladi)
 * Buyruq: /matagent — holat va "Hozir ishga tushirish" tugmasi.
 * Barcha holat o'zgarishlari atomik (store.transition) — tugma ikki marta bosilsa ham bir marta bajariladi.
 */
var config = require('./config');
var store = require('./store');
var review = require('./review');
var pipeline = require('./pipeline');
var gemini = require('./gemini');

var FOCUS_LABEL = { images: '🖼 Rasm mos emas', text: '📝 Matn mos emas', data: '📊 Ma\'lumot mos emas' };

function isAdmin(ctx) { return ctx.from && Number(ctx.from.id) === config.adminId; }

async function editCard(ctx, html, keyboard) {
  try {
    await ctx.editMessageText(html, { parse_mode: 'HTML', disable_web_page_preview: true, reply_markup: keyboard || { inline_keyboard: [] } });
  } catch (e) {
    if (!/message is not modified/i.test(e.message)) console.warn('MaterialAgent editCard:', e.message);
  }
}

async function statusText(pool) {
  var lines = ['🧱 <b>Material agent</b>'];
  lines.push('Holat: ' + (config.enabled ? '✅ yoqilgan' : '⛔️ o\'chirilgan (GEMINI_API_KEY yoki MATERIAL_AGENT_ENABLED)'));
  if (config.enabled) {
    try { lines.push('Model: ' + review.esc(await gemini.resolveModel())); } catch (e) { lines.push('Model: ⚠️ ' + review.esc(e.message).slice(0, 200)); }
  }
  lines.push('Jadval: har kuni ' + String(config.runHour).padStart(2, '0') + ':00 (Toshkent), haftasiga ' + config.weeklyLimit + ' ta');
  lines.push('Rasm ombori: ' + (config.mediaChannelId ? 'yopiq kanal ' + review.esc(config.mediaChannelId) : '⚠️ kanal ulanmagan (MATERIAL_MEDIA_CHANNEL_ID) — admin chatiga saqlanmoqda'));
  if (pool) {
    lines.push('Bu hafta: ' + (await store.weeklyCount(pool)) + ' / ' + config.weeklyLimit);
    var r = await pool.query("SELECT id, status, brand, product_name FROM material_ai_candidates WHERE status IN ('pending_review','reworking','processing','searching') ORDER BY id DESC LIMIT 5");
    if (r.rows.length) {
      lines.push('');
      lines.push('Jarayonda:');
      r.rows.forEach(function (c) { lines.push('• #' + c.id + ' ' + c.status + ' — ' + review.esc((c.brand || '') + ' ' + (c.product_name || ''))); });
    }
    var last = await pool.query('SELECT run_date, result FROM material_ai_runs ORDER BY run_date DESC LIMIT 1');
    if (last.rows.length) lines.push('\nOxirgi ishga tushish: ' + String(last.rows[0].run_date).slice(0, 15) + ' — ' + review.esc(String(last.rows[0].result || '...').slice(0, 300)));
  }
  return lines.join('\n');
}

function register(bot, getPool) {
  bot.command('matagent', async function (ctx) {
    if (!isAdmin(ctx)) return;
    var pool = getPool();
    try {
      await ctx.reply(await statusText(pool), {
        parse_mode: 'HTML', disable_web_page_preview: true,
        reply_markup: { inline_keyboard: [[{ text: '▶️ Hozir ishga tushirish', callback_data: 'mai:run:0' }]] }
      });
    } catch (e) {
      await ctx.reply('Material agent holatini olishda xato: ' + e.message);
    }
  });

  bot.action(/^mai:(ok|rw|no|rr|back|run):(\d+)(?::(images|text|data))?$/, async function (ctx) {
    if (!isAdmin(ctx)) return ctx.answerCbQuery('❌ Siz admin emassiz.', { show_alert: true });
    var pool = getPool();
    var action = ctx.match[1], id = Number(ctx.match[2]), focus = ctx.match[3];
    try {
      if (action === 'run') {
        if (!pipeline.ready()) return ctx.answerCbQuery('Agent o\'chirilgan yoki hali tayyor emas', { show_alert: true });
        await ctx.answerCbQuery('⏳ Ishga tushirildi — natija shu chatga keladi');
        pipeline.runDaily({ manual: true }).then(function (r) {
          return review.notifyAdmin(bot, '🧱 Material agent: ' + review.esc((r && r.result) || 'tugadi'));
        }).catch(function (e) { review.notifyAdmin(bot, '⚠️ Material agent xatosi: ' + review.esc(e.message)); });
        return;
      }

      var cand = await store.getCandidate(pool, id);
      if (!cand) return ctx.answerCbQuery('Nomzod topilmadi', { show_alert: true });
      var catName = await review.categoryName(pool, cand.category_slug);

      if (action === 'rw') {
        if (cand.status !== 'pending_review') return ctx.answerCbQuery('Bu nomzod allaqachon ko\'rib chiqilgan', { show_alert: true });
        if ((cand.rework_count || 0) >= config.MAX_REWORKS) return ctx.answerCbQuery('Qayta ishlash limiti tugadi — Joylash yoki Rad etish', { show_alert: true });
        await ctx.answerCbQuery('Nima mos emas?');
        return editCard(ctx, review.cardText(cand, catName) + '\n\n🔁 <b>Nima mos emas?</b>', review.reworkKeyboard(cand));
      }

      if (action === 'back') {
        await ctx.answerCbQuery();
        if (cand.status !== 'pending_review') return;
        return editCard(ctx, review.cardText(cand, catName), review.mainKeyboard(cand));
      }

      if (action === 'rr') {
        if ((cand.rework_count || 0) >= config.MAX_REWORKS) return ctx.answerCbQuery('Qayta ishlash limiti tugadi', { show_alert: true });
        var moved = await store.transition(pool, id, ['pending_review'], 'reworking', {
          rework_count: (cand.rework_count || 0) + 1, rework_focus: focus, reviewed_by: ctx.from.id
        });
        if (!moved) return ctx.answerCbQuery('Bu nomzod allaqachon ko\'rib chiqilgan', { show_alert: true });
        await ctx.answerCbQuery('🔁 Qayta ishlanmoqda');
        await editCard(ctx, review.cardText(cand, catName) + '\n\n🔁 <b>Qayta ishlanmoqda:</b> ' + FOCUS_LABEL[focus] + '\nYangi variant tayyor bo\'lgach shu chatga keladi.');
        pipeline.rework(id).catch(function (e) { review.notifyAdmin(bot, '⚠️ #' + id + ' qayta ishlash xatosi: ' + review.esc(e.message)); });
        return;
      }

      if (action === 'no') {
        var rej = await store.transition(pool, id, ['pending_review'], 'rejected', { reviewed_by: ctx.from.id, reviewed_at: new Date() });
        if (!rej) return ctx.answerCbQuery('Bu nomzod allaqachon ko\'rib chiqilgan', { show_alert: true });
        await ctx.answerCbQuery('❌ Rad etildi');
        return editCard(ctx, review.cardText(cand, catName) + '\n\n❌ <b>Rad etildi.</b> Keyingi kun yangi material qidiriladi.');
      }

      if (action === 'ok') {
        var lock = await store.transition(pool, id, ['pending_review'], 'publishing', { reviewed_by: ctx.from.id });
        if (!lock) return ctx.answerCbQuery('Bu nomzod allaqachon ko\'rib chiqilgan', { show_alert: true });
        await ctx.answerCbQuery('⏳ Joylanmoqda...');
        try {
          var materialId = await store.publishCandidate(pool, lock, ctx.from.id);
          return editCard(ctx, review.cardText(cand, catName) + '\n\n✅ <b>Kutubxonaga joylandi</b> — Materiallar › ' + review.esc(catName) + ' (material #' + materialId + ')');
        } catch (e) {
          await store.transition(pool, id, ['publishing'], 'pending_review', { last_error: 'Joylashda xato: ' + e.message });
          var fresh = await store.getCandidate(pool, id);
          return editCard(ctx, review.cardText(fresh, catName) + '\n\n⚠️ <b>Joylashda xato:</b> ' + review.esc(e.message).slice(0, 300), review.mainKeyboard(fresh));
        }
      }
    } catch (e) {
      console.error('MaterialAgent callback error:', e);
      try { await ctx.answerCbQuery('Xato: ' + String(e.message).slice(0, 150), { show_alert: true }); } catch (x) {}
    }
  });
}

module.exports = { register: register, statusText: statusText };
