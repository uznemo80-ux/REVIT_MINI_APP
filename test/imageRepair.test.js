'use strict';
/**
 * Rasm tuzatuvchi testlari (soxta Gemini, soxta Wikimedia, soxta Telegram, haqiqiy PostgreSQL).
 *   TEST_DATABASE_URL=postgres://... npm run test:material-agent
 * Test bazasi seed materiallar bilan to'ldirilgan bo'lishi kerak (server bir marta ishga tushirilgan).
 */
var test = require('node:test');
var assert = require('node:assert/strict');
var zlib = require('zlib');

process.env.GEMINI_API_KEY = 'test-key';
process.env.ADMIN_TELEGRAM_ID = '111';
process.env.BOT_TOKEN = 'TEST:TOKEN';
delete process.env.MATERIAL_MEDIA_CHANNEL_ID;
delete process.env.GEMINI_MODEL;

var gemini = require('../services/materialAgent/gemini');
var web = require('../services/materialAgent/web');
var commons = require('../services/materialAgent/commons');
var imageRepair = require('../services/materialAgent/imageRepair');

function crcChunk(type, data) {
  var len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  var td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  var crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(td) >>> 0);
  return Buffer.concat([len, td, crc]);
}
function makePng(w, h, seed) {
  var ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  var raw = Buffer.alloc((w * 3 + 1) * h);
  for (var y = 0; y < h; y++) for (var x = 0; x < w * 3; x++) raw[y * (w * 3 + 1) + 1 + x] = (x * seed + y) & 0xff;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), crcChunk('IHDR', ihdr), crcChunk('IDAT', zlib.deflateSync(raw)), crcChunk('IEND', Buffer.alloc(0))]);
}

test('placeholder va rasmiy sahifa aniqlash', function () {
  var I = imageRepair._internals;
  assert.equal(I.isPlaceholder('/img/materials/devor/bambukovaya-panel_1.svg'), true);
  assert.equal(I.isPlaceholder('/img/materials/eurokraab_1.webp'), false);
  assert.equal(I.officialPage({ manufacturer_url: 'https://standart.uz', source_url: 'https://mc.uz' }), '');
  assert.equal(I.officialPage({ manufacturer_url: 'https://quick-step.com' }), '', 'bosh sahifa mahsulot sahifasi emas');
  assert.equal(I.officialPage({ manufacturer_url: 'https://brand.com/products/x-100' }), 'https://brand.com/products/x-100');
  assert.equal(I.isLatin('Shadow Gap Profile'), true);
  assert.equal(I.isLatin('Бамбуковая панель'), false);
});

test('commons.search: faqat erkin litsenziya va yetarli o\'lcham', async function () {
  commons.setFetcher(async function () {
    return { query: { pages: [
      { index: 2, title: 'File:Bamboo panel wall.jpg', imageinfo: [{ thumburl: 'https://upload.wikimedia.org/a.jpg', descriptionurl: 'https://commons.wikimedia.org/wiki/File:Bamboo_panel_wall.jpg', thumbwidth: 1280, thumbheight: 960, mime: 'image/jpeg', extmetadata: { LicenseShortName: { value: 'CC BY-SA 4.0' }, Artist: { value: '<a href="x">Jane Doe</a>' } } }] },
      { index: 1, title: 'File:Nonfree.jpg', imageinfo: [{ thumburl: 'https://upload.wikimedia.org/b.jpg', thumbwidth: 1280, thumbheight: 960, mime: 'image/jpeg', extmetadata: { LicenseShortName: { value: 'All rights reserved' } } }] },
      { index: 3, title: 'File:Tiny.png', imageinfo: [{ thumburl: 'https://upload.wikimedia.org/c.png', thumbwidth: 200, thumbheight: 150, mime: 'image/png', extmetadata: { LicenseShortName: { value: 'CC0' } } }] },
      { index: 4, title: 'File:Diagram.svg', imageinfo: [{ thumburl: 'https://upload.wikimedia.org/d.png', thumbwidth: 1280, thumbheight: 900, mime: 'image/svg+xml', extmetadata: { LicenseShortName: { value: 'Public domain' } } }] }
    ] } };
  });
  try {
    var r = await commons.search('bamboo wall panel', 10);
    assert.equal(r.length, 1);
    assert.equal(r[0].artist, 'Jane Doe');
    assert.equal(r[0].license, 'CC BY-SA 4.0');
  } finally { commons.setFetcher(null); }
});

var DB = process.env.TEST_DATABASE_URL;

test('integratsiya: SVG → Commons foto, noto\'g\'ri rasm, to\'g\'ri rasm, qaytarish, limit', { skip: !DB && 'TEST_DATABASE_URL berilmagan' }, async function () {
  var Pool = require('pg').Pool;
  var pool = new Pool({ connectionString: DB });
  var Telegraf = require('telegraf').Telegraf;
  var TelegramCls = require('telegraf').Telegram;
  var origCallApi = TelegramCls.prototype.callApi;
  var bot = new Telegraf('TEST:TOKEN');
  bot.botInfo = { id: 999, is_bot: true, username: 'test_bot', first_name: 'Test' };
  var sent = [], fileSeq = 0;
  TelegramCls.prototype.callApi = async function (method, payload) {
    sent.push({ method: method, payload: payload });
    if (method === 'sendPhoto') { var fid = 'r' + (++fileSeq); return { message_id: fileSeq, photo: [{ file_id: fid, file_unique_id: 'u' + fid, width: 1280, height: 960 }] }; }
    if (method === 'sendMessage') return { message_id: 9000 + sent.length };
    if (method === 'editMessageText' || method === 'answerCallbackQuery') return true;
    throw new Error('kutilmagan: ' + method);
  };

  // Wikimedia: har bir so'rovga 3 ta foto (bittasi bambuk emas — AI rad etadi)
  var THUMBS = {
    'https://upload.wikimedia.org/bamboo1.jpg': makePng(1280, 960, 3),
    'https://upload.wikimedia.org/bamboo2.jpg': makePng(1280, 900, 5),
    'https://upload.wikimedia.org/forest.jpg': makePng(1280, 960, 9)
  };
  commons.setFetcher(async function (url) {
    var q = decodeURIComponent(url.split('gsrsearch=')[1].split('&')[0]);
    if (!/bamboo/i.test(q)) return { query: { pages: [] } };
    return { query: { pages: Object.keys(THUMBS).map(function (u, i) {
      return { index: i + 1, title: 'File:' + u.split('/').pop(), imageinfo: [{ thumburl: u, descriptionurl: 'https://commons.wikimedia.org/wiki/File:' + u.split('/').pop(), thumbwidth: 1280, thumbheight: 960, mime: 'image/jpeg', extmetadata: { LicenseShortName: { value: i === 1 ? 'CC0' : 'CC BY-SA 4.0' }, Artist: { value: 'Author ' + i } } }] };
    }) } };
  });
  var wikiUAs = [];
  web.setFetcher(async function (url, opts) {
    if (THUMBS[url]) { wikiUAs.push(opts.userAgent); return { ok: true, status: 200, finalUrl: url, contentType: 'image/png', body: THUMBS[url] }; }
    return { ok: false, status: 404, finalUrl: url, body: null, error: 'http_404' };
  });

  var limitHit = false;
  gemini.setTransport(async function (method, url, body) {
    if (method === 'GET') return { status: 200, json: { models: [{ name: 'models/gemini-3.5-flash', supportedGenerationMethods: ['generateContent'] }] } };
    assert.equal(body.tools, undefined, 'Google Search ishlatilmaydi');
    var p = body.contents[0].parts[0].text;
    var n = body.contents[0].parts.length - 1;
    var reply;
    if (limitHit) return { status: 429, json: { error: { message: 'Resource exhausted' } } };
    if (/Building-materials library card/.test(p)) {
      if (/Разделительный профиль для потолка/.test(p)) reply = { images: Array.from({ length: n }, function (_, i) { return { index: i, shows_material: false, note: 'this is a shadow-gap profile' }; }) };
      else if (/Теневой плинтус скрытого/.test(p)) reply = { images: Array.from({ length: n }, function (_, i) { return { index: i, shows_material: i === 0 }; }) };
      else reply = { images: Array.from({ length: n }, function (_, i) { return { index: i, shows_material: true }; }) };
    } else if (/English search queries/.test(p)) {
      reply = { queries: /Бамбук/i.test(p) ? ['bamboo wall panel', 'bamboo panel'] : ['ceiling profile'] };
    } else if (/strict photo editor/.test(p)) {
      // 3-chi rasm (forest) — bambuk paneli emas
      reply = { images: Array.from({ length: n }, function (_, i) { return { index: i, shows_product: i !== 2, kind: ['product', 'installed', 'other'][i % 3], quality: 8, watermark_or_text: false }; }) };
    } else throw new Error('kutilmagan prompt: ' + p.slice(0, 60));
    return { status: 200, json: { candidates: [{ content: { parts: [{ text: JSON.stringify(reply) }] } }] } };
  });

  try {
    await pool.query('DROP TABLE IF EXISTS material_image_repairs, material_agent_state');
    await require('../services/materialAgent/store').migrate(pool);
    await imageRepair.migrate(pool);
    async function mat(id) { return (await pool.query('SELECT * FROM materials WHERE id = $1', [id])).rows[0]; }

    // 1) To'g'ri rasmlar — tegilmaydi
    var m1 = await mat(1);
    var r1 = await imageRepair.processMaterial(pool, bot, m1);
    assert.equal(r1.status, 'ok');
    assert.deepEqual((await mat(1)).gallery_images, m1.gallery_images);

    // 2) Hamma rasm noto'g'ri, o'rniga foto yo'q → rasm o'zgarmaydi, "tekshirilgan" belgisi olinadi
    var r2 = await imageRepair.processMaterial(pool, bot, await mat(2));
    assert.equal(r2.status, 'not_found');
    assert.equal((await mat(2)).image_verified, false);

    // 3) 1 ta to'g'ri, 2 ta noto'g'ri, yangi foto yo'q → faqat to'g'risi qoladi
    var r3 = await imageRepair.processMaterial(pool, bot, await mat(3));
    assert.equal(r3.status, 'replaced');
    assert.deepEqual((await mat(3)).gallery_images, ['/img/materials/tenevoy_plintus_1.webp']);

    // 4) SVG shablon (bambuk paneli) → Commons'dan 2 ta mos foto, uchinchisi (o'rmon) rad etiladi
    var bamboo = (await pool.query("SELECT * FROM materials WHERE name_ru = 'Бамбуковая панель' LIMIT 1")).rows[0];
    var oldGallery = bamboo.gallery_images.slice();
    assert.ok(oldGallery.every(function (u) { return /\.svg$/.test(u); }));
    var r4 = await imageRepair.processMaterial(pool, bot, bamboo);
    assert.equal(r4.status, 'replaced', r4.reason);
    var b2 = await mat(bamboo.id);
    assert.equal(b2.gallery_images.length, 2);
    assert.ok(b2.gallery_images.every(function (u) { return /^\/api\/media\/tg\/\d+$/.test(u); }));
    assert.equal(b2.image_url, b2.gallery_images[0]);
    assert.equal(b2.image_verified, true);
    assert.ok(/^Wikimedia Commons \(/.test(b2.image_source), b2.image_source);
    assert.ok(/commons\.wikimedia\.org\/wiki\/File:/.test(b2.image_source_url));
    var lic = (await pool.query("SELECT title, url FROM material_sources WHERE material_id = $1 AND source_type = 'image_license'", [bamboo.id])).rows;
    assert.equal(lic.length, 2, 'har bir Commons rasmi uchun atributsiya');
    assert.ok(lic.some(function (l) { return /Author 0 — CC BY-SA 4.0/.test(l.title); }));
    var pub = (await pool.query('SELECT COUNT(*)::int AS n FROM tg_media WHERE is_public')).rows[0].n;
    assert.equal(pub, 2, 'yangi rasmlar Mini App\'da ochiq bo\'lishi kerak');
    assert.ok(wikiUAs.every(function (u) { return /YoshUzbekkMaterialBot/.test(u); }), 'Wikimedia uchun tushunarli User-Agent');
    assert.ok(sent.filter(function (s) { return s.method === 'sendPhoto'; }).every(function (s) { return String(s.payload.chat_id) === '111'; }));

    // 5) Qaytarish
    var rv = await imageRepair.revert(pool, bamboo.id);
    assert.equal(rv.ok, true);
    var b3 = await mat(bamboo.id);
    assert.deepEqual(b3.gallery_images, oldGallery);
    assert.equal((await pool.query("SELECT COUNT(*)::int AS n FROM material_sources WHERE material_id = $1 AND source_type = 'image_license'", [bamboo.id])).rows[0].n, 0);

    // 6) Partiya: allaqachon tekshirilganlar qayta olinmaydi; Gemini limiti → to'xtaydi, xato deb belgilanmaydi
    var before = (await imageRepair.summary(pool)).remaining;
    var b = await imageRepair.runBatch(pool, bot, 3);
    assert.equal(b.processed, 3);
    assert.equal((await imageRepair.summary(pool)).remaining, before - 3);
    limitHit = true;
    var q = await imageRepair.runBatch(pool, bot, 3);
    assert.equal(q.quota, true);
    assert.equal(q.errors, 0);
    assert.equal((await imageRepair.summary(pool)).remaining, before - 3, 'limitda material o\'tkazib yuborilmasligi kerak');
    limitHit = false;

    // 7) tick: o'chirilgan holatda hech narsa qilmaydi; yoqilganda partiya + birinchi hisobot
    var msgs = [];
    await imageRepair.tick(pool, bot, async function (h) { msgs.push(h); });
    assert.equal(msgs.length, 0);
    process.env.MATERIAL_IMAGE_REPAIR_BATCH = '2';
    await imageRepair.setState(pool, { running: true });
    await imageRepair.tick(pool, bot, async function (h) { msgs.push(h); });
    assert.equal(msgs.length, 1);
    assert.ok(/ta material tekshirildi/.test(msgs[0]));
    var st = await imageRepair.getState(pool);
    assert.equal(st.day_count, 2);
    // 50 daqiqa o'tmaguncha keyingi partiya yo'q
    await imageRepair.tick(pool, bot, async function (h) { msgs.push(h); });
    assert.equal((await imageRepair.getState(pool)).day_count, 2);

    // 8) Admin bot: /rasmlar, boshlash/to'xtatish tugmalari, /rasmqaytar
    var materialAgent = require('../services/materialAgent');
    var pipeline = require('../services/materialAgent/pipeline');
    pipeline.init(pool, bot);
    materialAgent.registerBot(bot, function () { return pool; });
    await bot.handleUpdate({ update_id: 1, message: { message_id: 1, date: 1, chat: { id: 111, type: 'private' }, from: { id: 111, is_bot: false, first_name: 'A' }, text: '/rasmlar', entities: [{ type: 'bot_command', offset: 0, length: 8 }] } });
    var card = sent.filter(function (s) { return s.method === 'sendMessage'; }).pop();
    assert.ok(/Materiallar rasmini tuzatish/.test(card.payload.text));
    assert.equal(card.payload.reply_markup.inline_keyboard[0][0].callback_data, 'mir:pause');
    await bot.handleUpdate({ update_id: 2, callback_query: { id: 'c', from: { id: 111, is_bot: false, first_name: 'A' }, chat_instance: '1', data: 'mir:pause', message: { message_id: 5, date: 1, chat: { id: 111, type: 'private' }, text: 'x' } } });
    assert.equal((await imageRepair.getState(pool)).running, false);
    await bot.handleUpdate({ update_id: 3, message: { message_id: 2, date: 1, chat: { id: 111, type: 'private' }, from: { id: 111, is_bot: false, first_name: 'A' }, text: '/rasmqaytar 3', entities: [{ type: 'bot_command', offset: 0, length: 11 }] } });
    assert.deepEqual((await mat(3)).gallery_images, m1 && (await pool.query('SELECT old_gallery FROM material_image_repairs WHERE material_id = 3')).rows[0].old_gallery);
    // Admin bo'lmagan — buyruq ishlamaydi
    var n0 = sent.length;
    await bot.handleUpdate({ update_id: 4, message: { message_id: 3, date: 1, chat: { id: 222, type: 'private' }, from: { id: 222, is_bot: false, first_name: 'X' }, text: '/rasmlar', entities: [{ type: 'bot_command', offset: 0, length: 8 }] } });
    assert.equal(sent.length, n0);
  } finally {
    commons.setFetcher(null);
    web.setFetcher(null);
    gemini.setTransport(null);
    TelegramCls.prototype.callApi = origCallApi;
    await pool.end();
  }
});
