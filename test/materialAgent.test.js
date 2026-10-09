'use strict';
/**
 * MaterialAgent testlari.
 *   npm run test:material-agent                      — unit testlar
 *   TEST_DATABASE_URL=postgres://... npm run test:material-agent — + to'liq integratsiya (soxta Gemini, soxta veb, soxta Telegram)
 * Integratsiya testi ALOHIDA test bazasida ishlashi kerak (prod bazaga ulamang).
 */
var test = require('node:test');
var assert = require('node:assert/strict');
var zlib = require('zlib');

process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'test-key';
process.env.ADMIN_TELEGRAM_ID = '111';
process.env.BOT_TOKEN = 'TEST:TOKEN';
process.env.MATERIAL_MEDIA_CHANNEL_ID = '-1001234567890';
process.env.MATERIAL_AGENT_SEARCH = 'google'; // bu fayl A variantni (Google qidiruv) tekshiradi
delete process.env.GEMINI_MODEL;

var imageInfo = require('../services/materialAgent/imageInfo');
var gemini = require('../services/materialAgent/gemini');
var web = require('../services/materialAgent/web');
var stages = require('../services/materialAgent/stages');
var store = require('../services/materialAgent/store');

// ---------- yordamchi: haqiqiy PNG yaratish ----------
function crcChunk(type, data) {
  var len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  var td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  var crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(td) >>> 0);
  return Buffer.concat([len, td, crc]);
}
function makePng(w, h, seed) {
  var ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  var raw = Buffer.alloc((w * 3 + 1) * h);
  for (var y = 0; y < h; y++) {
    raw[y * (w * 3 + 1)] = 0;
    for (var x = 0; x < w * 3; x++) raw[y * (w * 3 + 1) + 1 + x] = (x * seed + y) & 0xff;
  }
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), crcChunk('IHDR', ihdr), crcChunk('IDAT', zlib.deflateSync(raw)), crcChunk('IEND', Buffer.alloc(0))]);
}
function makeJpegHeader(w, h) {
  // SOI + APP0 + SOF0 (faqat o'lcham o'qish uchun yetarli)
  var app0 = Buffer.from([0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00]);
  var sof = Buffer.from([0xff, 0xc0, 0x00, 0x11, 0x08, (h >> 8) & 0xff, h & 0xff, (w >> 8) & 0xff, w & 0xff, 0x03, 0x01, 0x22, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01]);
  return Buffer.concat([Buffer.from([0xff, 0xd8]), app0, sof, Buffer.alloc(16)]);
}

// ======================================================
// UNIT
// ======================================================
test('imageInfo: PNG, JPEG, WEBP o\'lchamlari', function () {
  var p = imageInfo.info(makePng(640, 480, 3));
  assert.equal(p.mime, 'image/png'); assert.equal(p.width, 640); assert.equal(p.height, 480);
  var j = imageInfo.info(makeJpegHeader(1200, 900));
  assert.equal(j.mime, 'image/jpeg'); assert.equal(j.width, 1200); assert.equal(j.height, 900);
  var webp = Buffer.alloc(40); webp.write('RIFF', 0, 'ascii'); webp.write('WEBP', 8, 'ascii'); webp.write('VP8X', 12, 'ascii');
  webp.writeUIntLE(1023, 24, 3); webp.writeUIntLE(767, 27, 3);
  var w = imageInfo.info(webp);
  assert.equal(w.mime, 'image/webp'); assert.equal(w.width, 1024); assert.equal(w.height, 768);
  assert.equal(imageInfo.info(Buffer.from('<html>not an image</html> padding padding')), null);
});

test('gemini.extractJson: fence, prose, nested', function () {
  assert.deepEqual(gemini.extractJson('```json\n{"a":1}\n```'), { a: 1 });
  assert.deepEqual(gemini.extractJson('Mana natija: {"a": {"b": "}"}, "c": [1,2]} tamom'), { a: { b: '}' }, c: [1, 2] });
  assert.throws(function () { gemini.extractJson('json yo\'q'); });
});

test('web.extractImageUrls: og:image, srcset, logo filtri', function () {
  var html = '<meta property="og:image" content="/img/main.jpg">' +
    '<img src="/assets/logo.png"><img data-src="/gallery/a.webp"><img srcset="/g/b-300.jpg 300w, /g/b-1200.jpg 1200w">' +
    '<img src="/icons/arrow.svg"><a href="/zoom/c.png">zoom</a>';
  var urls = web.extractImageUrls(html, 'https://brand.test/product/x');
  assert.equal(urls[0], 'https://brand.test/img/main.jpg');
  assert.ok(urls.includes('https://brand.test/gallery/a.webp'));
  assert.ok(urls.includes('https://brand.test/g/b-1200.jpg'));
  assert.ok(urls.includes('https://brand.test/zoom/c.png'));
  assert.ok(!urls.some(function (u) { return /logo|arrow/.test(u); }));
});

var PAGE_TEXT = 'Brandex AquaShield 300 — полимерная гидроизоляционная мембрана для влажных помещений. ' +
  'Толщина 1,5 мм. Плотность 1200 кг/м3. Ширина рулона 1000 мм. Артикул AQS-300. ' +
  'Применяется в ванных комнатах, душевых, на балконах и террасах. Наносится шпателем в два слоя. '.repeat(3);

function goodData(extra) {
  var longUz = "Brandex AquaShield 300 — ho'l xonalar uchun polimer gidroizolyatsiya membranasi. Vannaxona, dush va balkonlarda devor va pol yuzalarini namlikdan himoya qiladi. Ikki qatlam qilib shpatel bilan suriladi va plitka ostida ishlatiladi. Loyihada qatlam qalinligi ko'rsatiladi.";
  var longRu = 'Brandex AquaShield 300 — полимерная гидроизоляционная мембрана для влажных помещений. Защищает стены и пол ванных комнат, душевых и балконов от влаги. Наносится шпателем в два слоя, используется под плитку. В проекте указывается толщина слоя.';
  var longEn = 'Brandex AquaShield 300 is a polymer waterproofing membrane for wet rooms. It protects walls and floors in bathrooms, showers and balconies from moisture. Applied with a trowel in two coats and used under tiles. Drawings should state the layer thickness.';
  return Object.assign({
    name_uz: 'Brandex AquaShield 300 gidroizolyatsiya membranasi', name_ru: 'Гидроизоляционная мембрана Brandex AquaShield 300', name_en: 'Brandex AquaShield 300 waterproofing membrane',
    short_description_uz: "Ho'l xonalar uchun plitka ostiga suriladigan polimer gidroizolyatsiya.", short_description_ru: 'Полимерная гидроизоляция под плитку для влажных помещений.', short_description_en: 'Polymer under-tile waterproofing for wet rooms and balconies.',
    description_uz: longUz, description_ru: longRu, description_en: longEn,
    usage_area_uz: 'Vannaxona, dush, balkon', usage_area_ru: 'Ванные, душевые, балконы', usage_area_en: 'Bathrooms, showers, balconies',
    pros_uz: "• Elastik\n• Plitka ostiga mos", pros_ru: '• Эластичная\n• Под плитку', pros_en: '• Elastic\n• Tile-ready',
    cons_uz: "• Asosni tayyorlash talab etiladi", cons_ru: '• Требует подготовки основания', cons_en: '• Needs substrate preparation',
    architect_notes_uz: "Kesimda 1,5 mm qatlamni ko'rsating", architect_notes_ru: 'Укажите слой 1,5 мм в разрезе', architect_notes_en: 'Show the 1.5 mm layer in sections',
    subcategory_name: 'Обмазочная гидроизоляция', material_type: 'Гидроизоляционная мембрана', scope: 'interior', product_code: 'AQS-300',
    specifications: [
      { parameter: 'thickness', label_uz: 'Qalinlik', label_ru: 'Толщина', value: '1,5', unit: 'мм' },
      { parameter: 'density', label_uz: 'Zichlik', label_ru: 'Плотность', value: '1200', unit: 'кг/м3' },
      { parameter: 'frost', label_uz: 'Sovuqqa chidamlilik', label_ru: 'Морозостойкость', value: '300', unit: 'циклов' }
    ]
  }, extra || {});
}

test('validateData: sahifada yo\'q ko\'rsatkich olib tashlanadi, kirill uz rad etiladi', function () {
  var v = stages.validateData(goodData(), PAGE_TEXT);
  assert.equal(v.ok, true, v.errors.join('; '));
  assert.deepEqual(v.data.specifications.map(function (s) { return s.parameter; }), ['thickness', 'density']);
  assert.equal(v.data.dropped_specs.length, 1);
  assert.equal(v.data.product_code, 'AQS-300');

  var bad = stages.validateData(goodData({ description_uz: 'Бу кирилл ёзувидаги узбекча матн, лотин бўлиши керак эди. '.repeat(5), product_code: 'FAKE-999' }), PAGE_TEXT);
  assert.equal(bad.ok, false);
  assert.ok(bad.errors.some(function (e) { return /description_uz kirill/.test(e); }));
  assert.equal(bad.data.product_code, '');
});

test('store: Toshkent haftasi dushanbadan boshlanadi', function () {
  // 2026-10-09 juma 12:30 Toshkent = 07:30 UTC
  var ws = store.weekStartUtc(new Date('2026-10-09T07:30:00Z'));
  assert.equal(ws.toISOString(), '2026-10-04T19:00:00.000Z'); // dushanba 00:00 Toshkent
  // yakshanba 23:30 Toshkent hali o'sha hafta
  assert.equal(store.weekStartUtc(new Date('2026-10-11T18:30:00Z')).toISOString(), '2026-10-04T19:00:00.000Z');
  // dushanba 00:10 Toshkent — yangi hafta
  assert.equal(store.weekStartUtc(new Date('2026-10-11T19:10:00Z')).toISOString(), '2026-10-11T19:00:00.000Z');
  assert.equal(store.tashkentDateStr(new Date('2026-10-09T20:00:00Z')), '2026-10-10');
});

test('store.slugify: kirill/lotin', function () {
  assert.equal(store.slugify('Мембрана Brandex AquaShield 300'), 'membrana-brandex-aquashield-300');
  assert.equal(store.slugify("O'zbek g‘isht"), 'ozbek-gisht');
});

// ======================================================
// INTEGRATSIYA
// ======================================================
var DB = process.env.TEST_DATABASE_URL;

test('integratsiya: topish → admin → qayta ishlash → joylash → proxy', { skip: !DB && 'TEST_DATABASE_URL berilmagan' }, async function () {
  var Pool = require('pg').Pool;
  var pool = new Pool({ connectionString: DB });
  var Telegraf = require('telegraf').Telegraf;
  var express = require('express');

  // ---- soxta veb ----
  var IMGS = {
    'https://brandex.test/img/aqs-main.png': makePng(900, 700, 3),
    'https://brandex.test/img/aqs-wall.png': makePng(800, 600, 5),
    'https://brandex.test/img/aqs-pack.png': makePng(700, 700, 7),
    'https://brandex.test/img/aqs-extra.png': makePng(1000, 800, 11),
    'https://brandex.test/img/tiny.png': makePng(120, 90, 2)
  };
  var productHtml = '<html><head><title>Brandex AquaShield 300 — мембрана</title>' +
    '<meta property="og:image" content="/img/aqs-main.png"></head><body><h1>Brandex AquaShield 300</h1>' +
    '<p>' + PAGE_TEXT + '</p><img src="/img/aqs-wall.png"><img src="/img/aqs-pack.png"><img src="/img/aqs-extra.png"><img src="/img/tiny.png"><img src="/img/logo.png"></body></html>';
  var dealerHtml = '<html><head><title>Brandex в Ташкенте — официальный дилер</title></head><body>Купить Brandex AquaShield в Ташкенте. ' + 'x'.repeat(500) + '</body></html>';
  var pages = { 'https://brandex.test/product/aquashield-300': productHtml, 'https://dealer.uz/brandex': dealerHtml };
  web.setFetcher(async function (url) {
    if (pages[url]) return { ok: true, status: 200, finalUrl: url, contentType: 'text/html', body: Buffer.from(pages[url]) };
    if (IMGS[url]) return { ok: true, status: 200, finalUrl: url, contentType: 'image/png', body: IMGS[url] };
    return { ok: false, status: 404, finalUrl: url, contentType: '', body: null, error: 'http_404' };
  });

  // ---- soxta Gemini ----
  var calls = { discover: 0, enrich: 0, vision: 0, qa: 0, uz: 0 };
  var reworkTextMode = false;
  gemini.setTransport(async function (method, url, body) {
    if (method === 'GET') return { status: 200, json: { models: [{ name: 'models/gemini-3.5-flash', supportedGenerationMethods: ['generateContent'] }, { name: 'models/gemini-1.5-flash', supportedGenerationMethods: ['generateContent'] }] } };
    assert.ok(/gemini-3\.5-flash:generateContent$/.test(url), 'model avtomatik tanlanishi kerak: ' + url);
    var prompt = body.contents[0].parts[0].text;
    var reply, grounding = {};
    if (/research agent/.test(prompt)) {
      calls.discover++;
      assert.deepEqual(body.tools, [{ google_search: {} }]);
      reply = { product_name: 'AquaShield 300', brand: 'Brandex', product_code: 'AQS-300', product_url: 'https://brandex.test/product/aquashield-300', manufacturer_website: 'https://brandex.test', manufacturer_country: 'Germaniya' };
      grounding = { groundingChunks: [{ web: { uri: 'https://vertexaisearch.example/redirect/abc', title: 'brandex.test' } }] };
    } else if (/You fill a material card/.test(prompt)) {
      calls.enrich++;
      assert.ok(prompt.indexOf('Толщина 1,5 мм') !== -1, 'sahifa matni promptga uzatilishi kerak');
      reply = reworkTextMode ? goodData({ short_description_uz: "Qayta yozilgan: ho'l xonalar uchun plitka osti gidroizolyatsiyasi." }) : goodData();
      if (reworkTextMode) assert.ok(/Admin: the text is not suitable/.test(prompt));
    } else if (/strict photo editor/.test(prompt)) {
      calls.vision++;
      var n = body.contents[0].parts.length - 1;
      reply = { images: Array.from({ length: n }, function (_, i) { return { index: i, shows_product: true, kind: ['product', 'installed', 'package', 'texture'][i % 4], quality: 9 - i, watermark_or_text: false }; }) };
    } else if (/Final QA/.test(prompt)) {
      calls.qa++;
      reply = { images_match: true, bad_image_indexes: [], text_matches: true, category_matches: true, issues: [] };
    } else if (/sold in Uzbekistan/.test(prompt)) {
      calls.uz++;
      reply = { available: true, evidence: [{ url: 'https://dealer.uz/brandex', title: 'Brandex Tashkent' }], note_uz: "Toshkentda rasmiy diler orqali sotiladi." };
    } else if (/OTHER official web pages/.test(prompt)) {
      reply = { urls: [] };
    } else {
      throw new Error('kutilmagan prompt: ' + prompt.slice(0, 80));
    }
    return { status: 200, json: { candidates: [{ content: { parts: [{ text: '```json\n' + JSON.stringify(reply) + '\n```' }] }, groundingMetadata: grounding }] } };
  });

  // ---- soxta Telegram ----
  var TelegramCls = require('telegraf').Telegram;
  var origCallApi = TelegramCls.prototype.callApi;
  var bot = new Telegraf('TEST:TOKEN');
  bot.botInfo = { id: 999, is_bot: true, username: 'test_bot', first_name: 'Test' };
  var sent = [], files = {}, msgId = 100, fileSeq = 0;
  // Telegraf har bir update uchun yangi Telegram obyekt yaratadi — prototipni almashtiramiz
  TelegramCls.prototype.callApi = async function (method, payload) {
    sent.push({ method: method, payload: payload });
    if (method === 'sendPhoto' || method === 'sendDocument') {
      var key = method === 'sendPhoto' ? 'photo' : 'document';
      var src = payload[key];
      var fid = typeof src === 'string' ? src : 'file' + (++fileSeq);
      if (typeof src !== 'string') files[fid] = src.source;
      var res = { message_id: ++msgId, chat: { id: payload.chat_id } };
      if (key === 'photo') res.photo = [{ file_id: fid + '_s', file_unique_id: 'u' + fid + 's', width: 90, height: 90 }, { file_id: fid, file_unique_id: 'u' + fid, width: 800, height: 600, file_size: 1234 }];
      else res.document = { file_id: fid, file_unique_id: 'u' + fid };
      return res;
    }
    if (method === 'sendMediaGroup') return payload.media.map(function () { return { message_id: ++msgId }; });
    if (method === 'sendMessage') return { message_id: ++msgId, chat: { id: payload.chat_id }, text: payload.text };
    if (method === 'editMessageText' || method === 'answerCallbackQuery') return true;
    throw new Error('kutilmagan Telegram metodi: ' + method);
  };

  var materialAgent = require('../services/materialAgent');
  var pipeline = require('../services/materialAgent/pipeline');
  materialAgent.registerBot(bot, function () { return pool; });

  async function press(data) {
    await bot.handleUpdate({
      update_id: Math.floor(Math.random() * 1e9),
      callback_query: { id: 'cb' + Math.random(), from: { id: 111, is_bot: false, first_name: 'Admin' }, chat_instance: '1', data: data,
        message: { message_id: 5, date: 1, chat: { id: 111, type: 'private' }, text: 'card' } }
    });
  }
  async function waitStatus(id, status) {
    for (var i = 0; i < 100; i++) {
      var c = await store.getCandidate(pool, id);
      if (c && c.status === status) return c;
      await new Promise(function (r) { setTimeout(r, 100); });
    }
    throw new Error('#' + id + ' holati ' + status + ' bo\'lmadi');
  }

  try {
    await pool.query('DROP TABLE IF EXISTS material_ai_candidates, material_ai_runs, tg_media');
    await materialAgent.start({ pool: pool, bot: bot });
    var before = (await pool.query('SELECT COUNT(*)::int AS n FROM materials')).rows[0].n;

    // ---- 1-5: kunlik ishga tushish ----
    var r1 = await pipeline.runDaily({});
    assert.equal(r1.ok, true, r1.result);
    var cand = await store.getCandidate(pool, r1.candidate_id);
    assert.equal(cand.status, 'pending_review');
    assert.equal(cand.product_url, 'https://brandex.test/product/aquashield-300');
    assert.equal(cand.images.length, 3, 'MAX 3 ta rasm');
    assert.ok(!cand.images.some(function (i) { return /tiny|logo/.test(i.source_url); }), 'kichik rasm va logo o\'tmasligi kerak');
    assert.equal(cand.uz.available, true);
    assert.equal(cand.uz.dealer_url, 'https://dealer.uz/brandex');
    assert.equal(cand.data.specifications.length, 2);
    assert.equal(cand.checks.specs_dropped, 1);
    var uploads = sent.filter(function (s) { return s.method === 'sendPhoto' && s.payload.chat_id === '-1001234567890'; });
    assert.equal(uploads.length, 3, 'rasmlar yopiq kanalga yuklanishi kerak');
    var card = sent.filter(function (s) { return s.method === 'sendMessage'; }).pop();
    assert.equal(card.payload.chat_id, 111);
    assert.deepEqual(card.payload.reply_markup.inline_keyboard[0].map(function (b) { return b.callback_data; }), ['mai:ok:' + cand.id, 'mai:rw:' + cand.id, 'mai:no:' + cand.id]);
    assert.ok(sent.some(function (s) { return s.method === 'sendMediaGroup' && s.payload.chat_id === 111; }), 'admin rasmlar albomini ko\'rishi kerak');

    // Draft materials jadvalida ko'rinmasligi kerak
    assert.equal((await pool.query('SELECT COUNT(*)::int AS n FROM materials')).rows[0].n, before);

    // Rasm hali ochiq emas (is_public = false) → proxy 404
    var app = express();
    app.get('/api/media/tg/:id', materialAgent.mediaHandler(pool));
    var srv = app.listen(0);
    var port = srv.address().port;
    var realFetch = global.fetch;
    global.fetch = async function (u, o) {
      u = String(u);
      if (u.indexOf('https://api.telegram.org/botTEST:TOKEN/getFile') === 0) {
        var fid = decodeURIComponent(u.split('file_id=')[1]);
        return new Response(JSON.stringify({ ok: true, result: { file_path: 'photos/' + fid + '.jpg' } }));
      }
      if (u.indexOf('https://api.telegram.org/file/botTEST:TOKEN/photos/') === 0) {
        var f = u.split('/photos/')[1].replace(/\.jpg$/, '');
        return new Response(files[f]);
      }
      return realFetch(u, o);
    };
    try {
      var r404 = await realFetch('http://127.0.0.1:' + port + '/api/media/tg/' + cand.images[0].media_id);
      assert.equal(r404.status, 404, 'tasdiqlanmagan rasm ochiq bo\'lmasligi kerak');

      // ---- 7: qayta ishlash (matn) ----
      await press('mai:rw:' + cand.id);
      var edit = sent.filter(function (s) { return s.method === 'editMessageText'; }).pop();
      assert.equal(edit.payload.reply_markup.inline_keyboard.length, 4, 'sabab tugmalari ko\'rinishi kerak');
      reworkTextMode = true;
      var uploadsBefore = sent.filter(function (s) { return s.method === 'sendPhoto' && s.payload.chat_id === '-1001234567890'; }).length;
      await press('mai:rr:' + cand.id + ':text');
      var reworked = await waitStatus(cand.id, 'pending_review');
      assert.equal(reworked.rework_count, 1);
      assert.ok(/^Qayta yozilgan/.test(reworked.data.short_description_uz));
      assert.equal(sent.filter(function (s) { return s.method === 'sendPhoto' && s.payload.chat_id === '-1001234567890'; }).length, uploadsBefore, 'matn qayta ishlanganda rasmlar qayta yuklanmasligi kerak');
      reworkTextMode = false;

      // ---- qayta ishlash (rasm) — eski rasmlar chiqarib tashlanadi ----
      await press('mai:rw:' + reworked.id);
      await press('mai:rr:' + reworked.id + ':images');
      var rw2 = await waitStatus(cand.id, 'pending_review');
      assert.equal(rw2.rework_count, 2);
      assert.ok(rw2.last_error, 'boshqa mos rasm yo\'q — xato yozilishi va eski variant saqlanishi kerak');
      assert.equal(rw2.images.length, 3);
      var lastCard = sent.filter(function (s) { return s.method === 'sendMessage' && s.payload.reply_markup; }).pop();
      assert.equal(lastCard.payload.reply_markup.inline_keyboard[0].length, 2, 'limit tugagach faqat Joylash/Rad etish qoladi');

      // ---- 6: Joylash (ikki marta bosish — bir marta bajariladi) ----
      await Promise.all([press('mai:ok:' + cand.id), press('mai:ok:' + cand.id)]);
      var pub = await store.getCandidate(pool, cand.id);
      assert.equal(pub.status, 'published');
      assert.equal((await pool.query('SELECT COUNT(*)::int AS n FROM materials')).rows[0].n, before + 1);
      var mat = (await pool.query('SELECT m.*, c.slug AS cat FROM materials m JOIN material_categories c ON c.id = m.category_id WHERE m.id = $1', [pub.material_id])).rows[0];
      assert.equal(mat.status, 'published');
      assert.equal(mat.cat, cand.category_slug);
      assert.equal(mat.name_uz, 'Brandex AquaShield 300 gidroizolyatsiya membranasi');
      assert.equal(mat.name_en, 'Brandex AquaShield 300 waterproofing membrane');
      assert.equal(mat.uz_available, true);
      assert.equal(mat.uz_dealer_url, 'https://dealer.uz/brandex');
      assert.equal(mat.gallery_images.length, 3);
      assert.ok(/^\/api\/media\/tg\/\d+$/.test(mat.image_url));
      assert.equal(mat.manufacturer_url, 'https://brandex.test/product/aquashield-300');
      var srcs = (await pool.query('SELECT source_type, url, is_primary FROM material_sources WHERE material_id = $1 ORDER BY id', [mat.id])).rows;
      assert.deepEqual(srcs.map(function (s) { return s.source_type; }), ['official_product_page', 'uz_dealer']);
      var specs = (await pool.query('SELECT value FROM material_specifications WHERE material_id = $1 ORDER BY order_index', [mat.id])).rows;
      assert.deepEqual(specs.map(function (s) { return s.value; }), ['1,5', '1200']);
      var tr = (await pool.query('SELECT language_code FROM material_translations WHERE material_id = $1 ORDER BY 1', [mat.id])).rows;
      assert.deepEqual(tr.map(function (t) { return t.language_code; }), ['en', 'ru', 'uz']);
      var mfg = (await pool.query('SELECT name, website FROM material_manufacturers WHERE id = $1', [mat.manufacturer_id])).rows[0];
      assert.equal(mfg.name, 'Brandex');

      // Proxy endi rasmni beradi
      var img = await realFetch('http://127.0.0.1:' + port + mat.image_url);
      assert.equal(img.status, 200);
      assert.equal(img.headers.get('content-type'), 'image/jpeg');
      assert.ok(/immutable/.test(img.headers.get('cache-control')));
      assert.ok(Buffer.from(await img.arrayBuffer()).length > 100);
    } finally {
      global.fetch = realFetch;
      srv.close();
    }

    // ---- Haftalik limit: 2-material, keyin 3-chisi bloklanadi ----
    // Dublikat himoyasi: o'sha mahsulot qayta taklif qilinsa rad etiladi
    var r2 = await pipeline.runDaily({});
    assert.equal(r2.ok, false, 'bir xil mahsulot dublikat sifatida rad etilishi kerak');
    assert.ok(/Dublikat/.test(r2.result));
    assert.ok(sent.some(function (s) { return s.method === 'sendMessage' && /bugun mos material topilmadi/.test(s.payload.text); }));

    await pool.query("INSERT INTO material_ai_candidates (status, category_slug, product_name, brand) VALUES ('pending_review', 'shift', 'Test 2', 'X')");
    var r3 = await pipeline.runDaily({});
    assert.ok(/Haftalik limit/.test(r3.result), r3.result);

    // ---- Kunlik jadval: bir kunda faqat bir marta ----
    assert.equal(await store.claimRun(pool, new Date('2030-01-01T08:00:00Z')), true);
    assert.equal(await store.claimRun(pool, new Date('2030-01-01T09:00:00Z')), false);

    // ---- Rad etish ----
    var c3 = (await pool.query("SELECT id FROM material_ai_candidates WHERE product_name = 'Test 2'")).rows[0].id;
    await press('mai:no:' + c3);
    assert.equal((await store.getCandidate(pool, c3)).status, 'rejected');
    assert.equal(await store.weeklyCount(pool), 1, 'rad etilgan limitdan chiqadi');

    // Admin bo'lmagan foydalanuvchi tugma bosa olmaydi
    await bot.handleUpdate({ update_id: 1, callback_query: { id: 'x', from: { id: 222, is_bot: false, first_name: 'X' }, chat_instance: '1', data: 'mai:ok:' + c3, message: { message_id: 5, date: 1, chat: { id: 222, type: 'private' }, text: 'x' } } });
    assert.equal((await store.getCandidate(pool, c3)).status, 'rejected');

    assert.ok(calls.discover >= 2 && calls.enrich >= 2 && calls.vision >= 1 && calls.qa >= 1 && calls.uz >= 1);
  } finally {
    web.setFetcher(null);
    gemini.setTransport(null);
    TelegramCls.prototype.callApi = origCallApi;
    await pool.end();
  }
});
