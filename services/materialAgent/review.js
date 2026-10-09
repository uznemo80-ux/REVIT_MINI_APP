'use strict';
/**
 * 5-bosqich: nomzodni Admin botga tekshirish uchun yuborish.
 * Xabar: rasmlar albomi + karta matni + tugmalar (✅ Joylash · 🔁 Qayta ishlash · ❌ Rad etish).
 */
var config = require('./config');
var store = require('./store');

function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function cut(s, n) {
  s = String(s || '');
  return s.length > n ? s.slice(0, n - 1).trim() + '…' : s;
}

function mainKeyboard(cand) {
  var row = [{ text: '✅ Joylash', callback_data: 'mai:ok:' + cand.id }];
  if ((cand.rework_count || 0) < config.MAX_REWORKS) row.push({ text: '🔁 Qayta ishlash', callback_data: 'mai:rw:' + cand.id });
  row.push({ text: '❌ Rad etish', callback_data: 'mai:no:' + cand.id });
  return { inline_keyboard: [row] };
}

function reworkKeyboard(cand) {
  return {
    inline_keyboard: [
      [{ text: '🖼 Rasm mos emas', callback_data: 'mai:rr:' + cand.id + ':images' }],
      [{ text: '📝 Matn mos emas', callback_data: 'mai:rr:' + cand.id + ':text' }],
      [{ text: '📊 Ma\'lumot mos emas', callback_data: 'mai:rr:' + cand.id + ':data' }],
      [{ text: '↩️ Orqaga', callback_data: 'mai:back:' + cand.id }]
    ]
  };
}

function cardText(cand, categoryName) {
  var d = cand.data || {}, uz = cand.uz || {}, ch = cand.checks || {};
  var lines = [];
  lines.push('🤖 <b>Yangi material — #' + cand.id + '</b>' + (cand.rework_count ? '  (qayta ishlangan ' + cand.rework_count + '/' + config.MAX_REWORKS + ')' : ''));
  lines.push('📂 ' + esc(categoryName || cand.category_slug) + (d.subcategory_name ? ' › ' + esc(d.subcategory_name) : ''));
  lines.push('');
  lines.push('🏷 <b>' + esc(d.name_uz) + '</b>');
  lines.push('<i>' + esc(d.name_ru) + ' · ' + esc(d.name_en) + '</i>');
  lines.push('🏭 ' + esc(cand.brand) + (d.manufacturer_country ? ' (' + esc(d.manufacturer_country) + ')' : '') + (d.product_code ? ' · art. ' + esc(d.product_code) : ''));
  lines.push('🔗 <a href="' + esc(cand.product_url) + '">Rasmiy sahifa</a>');
  if (uz.available) {
    lines.push('🇺🇿 O\'zbekistonda: ✅ <a href="' + esc(uz.dealer_url) + '">' + esc(cut(uz.dealer_title || 'sotuvchi', 60)) + '</a>');
  } else {
    lines.push('🇺🇿 O\'zbekistonda: topilmadi (belgi ko\'rsatilmaydi)');
  }
  lines.push('');
  lines.push('📝 ' + esc(cut(d.short_description_uz, 300)));
  lines.push('');
  lines.push(esc(cut(d.description_uz, 900)));
  if ((d.specifications || []).length) {
    lines.push('');
    lines.push('📊 <b>Texnik ko\'rsatkichlar</b> (sahifada tasdiqlangan):');
    d.specifications.slice(0, 8).forEach(function (s) {
      lines.push('• ' + esc(s.label_uz || s.label_ru || s.parameter) + ': ' + esc(s.value) + (s.unit && String(s.value).indexOf(s.unit) === -1 ? ' ' + esc(s.unit) : ''));
    });
  }
  lines.push('');
  lines.push('🔎 Tekshiruv: rasm ' + (ch.images_match ? '✓' : '⚠️') + ' · matn ' + (ch.text_matches ? '✓' : '⚠️') +
    ' · kategoriya ' + (ch.category_matches ? '✓' : '⚠️') + ' · rasmlar: ' + (cand.images || []).length + ' ta' +
    (ch.specs_dropped ? ' · tasdiqlanmagan ' + ch.specs_dropped + ' ta ko\'rsatkich olib tashlandi' : ''));
  if (ch.issues && ch.issues.length) lines.push('⚠️ ' + esc(cut(ch.issues.join('; '), 300)));
  if (cand.last_error) lines.push('⚠️ Oxirgi xato: ' + esc(cut(cand.last_error, 300)));
  return cut(lines.join('\n'), 4000);
}

async function categoryName(pool, slug) {
  var r = await pool.query('SELECT name FROM material_categories WHERE slug = $1', [slug]);
  return r.rows[0] ? r.rows[0].name : slug;
}

async function sendForReview(pool, bot, cand) {
  var chatId = config.adminId;
  var messageIds = [];
  var mediaRows = [];
  for (var i = 0; i < (cand.images || []).length; i++) {
    var m = await store.getMedia(pool, cand.images[i].media_id);
    if (m) mediaRows.push(m);
  }
  if (mediaRows.length) {
    try {
      var allPhotos = mediaRows.every(function (m) { return (m.kind || 'photo') === 'photo'; });
      if (allPhotos && mediaRows.length > 1) {
        var sent = await bot.telegram.sendMediaGroup(chatId, mediaRows.map(function (m) { return { type: 'photo', media: m.file_id }; }));
        sent.forEach(function (s) { messageIds.push(s.message_id); });
      } else {
        // Telegram albomida photo va document aralashmaydi — alohida yuboramiz
        for (var j = 0; j < mediaRows.length; j++) {
          var one = (mediaRows[j].kind || 'photo') === 'photo'
            ? await bot.telegram.sendPhoto(chatId, mediaRows[j].file_id)
            : await bot.telegram.sendDocument(chatId, mediaRows[j].file_id);
          messageIds.push(one.message_id);
        }
      }
    } catch (e) {
      console.warn('MaterialAgent review album:', e.message);
    }
  }
  var msg = await bot.telegram.sendMessage(chatId, cardText(cand, await categoryName(pool, cand.category_slug)), {
    parse_mode: 'HTML', disable_web_page_preview: true, reply_markup: mainKeyboard(cand)
  });
  messageIds.push(msg.message_id);
  await store.updateCandidate(pool, cand.id, { review_chat_id: String(chatId), review_message_ids: messageIds });
  return msg;
}

async function notifyAdmin(bot, html) {
  try {
    await bot.telegram.sendMessage(config.adminId, html, { parse_mode: 'HTML', disable_web_page_preview: true });
  } catch (e) {
    console.warn('MaterialAgent notifyAdmin:', e.message);
  }
}

module.exports = {
  esc: esc, cardText: cardText, mainKeyboard: mainKeyboard, reworkKeyboard: reworkKeyboard,
  sendForReview: sendForReview, notifyAdmin: notifyAdmin, categoryName: categoryName
};
