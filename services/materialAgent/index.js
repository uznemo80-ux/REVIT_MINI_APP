'use strict';
/**
 * YOSHUZBEKK — AI Material Agent (Kutubxona → Materiallar uchun avtomatik material qo'shish).
 *
 * Ulanish:
 *   bot.js    → materialAgent.registerBot(bot, () => pool)        // admin tugmalari va /matagent
 *   server.js → materialAgent.start({ pool, bot })                  // migratsiya + kunlik jadval
 *               app.get('/api/media/tg/:id', materialAgent.mediaHandler(pool))
 *
 * Env: GEMINI_API_KEY (majburiy), MATERIAL_MEDIA_CHANNEL_ID, GEMINI_MODEL, MATERIAL_AGENT_ENABLED,
 *      MATERIAL_AGENT_HOUR (12), MATERIAL_AGENT_WEEKLY_LIMIT (2)
 */
var config = require('./config');
var store = require('./store');
var pipeline = require('./pipeline');
var media = require('./media');
var adminBot = require('./adminBot');

var timer = null;
var running = false;

async function tick(pool) {
  if (running || !pipeline.ready()) return;
  var now = store.tashkentNow();
  if (now.getUTCHours() < config.runHour) return;
  running = true;
  try {
    // Kuniga bir marta (bir nechta server nusxasi bo'lsa ham) — material_ai_runs da sana egallanadi
    var claimed = await store.claimRun(pool);
    if (!claimed) return;
    var res = await pipeline.runDaily({});
    await store.finishRun(pool, (res && res.result) || 'done');
    console.log('🧱 MaterialAgent kunlik natija:', res && res.result);
  } catch (e) {
    console.error('🧱 MaterialAgent tick xato:', e.message);
    await store.finishRun(pool, 'Xato: ' + e.message).catch(function () {});
  } finally {
    running = false;
  }
}

async function start(opts) {
  var pool = opts.pool, bot = opts.bot;
  if (!pool) { console.warn('🧱 MaterialAgent: DATABASE_URL yo\'q — ishlamaydi'); return; }
  try {
    await store.migrate(pool);
  } catch (e) {
    console.error('🧱 MaterialAgent migratsiya xatosi:', e.message);
    return;
  }
  // Server qayta ishga tushganda "processing" holatida qolib ketganlarni yopamiz
  await pool.query(
    "UPDATE material_ai_candidates SET status = 'failed', last_error = COALESCE(last_error, 'Server qayta ishga tushdi') WHERE status IN ('searching','processing') AND updated_at < NOW() - INTERVAL '30 minutes'"
  ).catch(function () {});
  await pool.query("UPDATE material_ai_candidates SET status = 'pending_review' WHERE status = 'publishing' AND updated_at < NOW() - INTERVAL '10 minutes'").catch(function () {});
  pipeline.init(pool, bot);
  // "reworking" holatida qolib ketgan nomzodlarni davom ettiramiz
  pool.query("SELECT id FROM material_ai_candidates WHERE status = 'reworking'").then(function (r) {
    r.rows.forEach(function (row) { pipeline.rework(row.id).catch(function () {}); });
  }).catch(function () {});

  if (!config.enabled) {
    console.log('🧱 MaterialAgent: o\'chirilgan (GEMINI_API_KEY yo\'q yoki MATERIAL_AGENT_ENABLED=false)');
    return;
  }
  if (timer) clearInterval(timer);
  timer = setInterval(function () { tick(pool); }, config.TICK_MS);
  if (timer.unref) timer.unref();
  var first = setTimeout(function () { tick(pool); }, 60 * 1000); // ishga tushgandan 1 daqiqa keyin birinchi tekshiruv
  if (first.unref) first.unref();
  console.log('🧱 MaterialAgent: yoqildi — har kuni ' + config.runHour + ':00 (Toshkent), haftasiga ' + config.weeklyLimit + ' ta');
}

module.exports = {
  start: start,
  registerBot: adminBot.register,
  mediaHandler: media.makeMediaHandler,
  _tick: tick
};
