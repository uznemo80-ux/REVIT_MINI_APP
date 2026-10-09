'use strict';
/**
 * MaterialAgent — B variant (bepul, Google qidiruvisiz) testlari.
 *   TEST_DATABASE_URL=postgres://... npm run test:material-agent
 * Brend sayti → robots.txt → sitemap → AI sahifa tanlaydi → ma'lumot/rasmlar → admin → joylash.
 */
var test = require('node:test');
var assert = require('node:assert/strict');
var zlib = require('zlib');

process.env.GEMINI_API_KEY = 'test-key';
process.env.ADMIN_TELEGRAM_ID = '111';
process.env.BOT_TOKEN = 'TEST:TOKEN';
delete process.env.MATERIAL_MEDIA_CHANNEL_ID; // kanal yo'q — rasmlar admin chatiga saqlanadi
delete process.env.MATERIAL_AGENT_SEARCH;     // default: bepul rejim
delete process.env.GEMINI_MODEL;

var gemini = require('../services/materialAgent/gemini');
var web = require('../services/materialAgent/web');
var store = require('../services/materialAgent/store');
var sources = require('../services/materialAgent/sources');
var config = require('../services/materialAgent/config');

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

test('config: default rejim — bepul (off)', function () {
  assert.equal(config.searchMode, 'off');
  process.env.MATERIAL_AGENT_SEARCH = 'google';
  assert.equal(config.searchMode, 'google');
  delete process.env.MATERIAL_AGENT_SEARCH;
});

test('sources.sitemapPageUrls: robots → index → gzip sitemap, yangilik/kontakt filtrlanadi', async function () {
  var productXml = '<urlset><url><loc>https://site.uz/catalog/paints/silk-matt-7</loc></url><url><loc>https://site.uz/catalog/</loc></url>' +
    '<url><loc>https://site.uz/news/2026/new-shop</loc></url><url><loc>https://site.uz/contacts/tashkent</loc></url>' +
    '<url><loc>https://other.com/catalog/x/y</loc></url><url><loc>https://site.uz/files/catalog/a.pdf</loc></url></urlset>';
  var map = {
    'https://site.uz/robots.txt': 'User-agent: *\nSitemap: https://site.uz/sitemap_index.xml\n',
    'https://site.uz/sitemap_index.xml': '<sitemapindex><sitemap><loc>https://site.uz/news-sitemap.xml</loc></sitemap><sitemap><loc>https://site.uz/product-sitemap.xml.gz</loc></sitemap></sitemapindex>',
    'https://site.uz/product-sitemap.xml.gz': zlib.gzipSync(Buffer.from(productXml))
  };
  web.setFetcher(async function (url) {
    if (!map[url]) return { ok: false, status: 404, finalUrl: url, body: null, error: 'http_404' };
    return { ok: true, status: 200, finalUrl: url, contentType: 'text/xml', body: Buffer.isBuffer(map[url]) ? map[url] : Buffer.from(map[url]) };
  });
  try {
    var urls = await sources.sitemapPageUrls('https://site.uz');
    assert.deepEqual(urls, ['https://site.uz/catalog/paints/silk-matt-7']);
  } finally { web.setFetcher(null); }
});

var DB = process.env.TEST_DATABASE_URL;

test('integratsiya (bepul rejim): sitemap → admin chat → joylash', { skip: !DB && 'TEST_DATABASE_URL berilmagan' }, async function () {
  var Pool = require('pg').Pool;
  var pool = new Pool({ connectionString: DB });
  var Telegraf = require('telegraf').Telegraf;
  var TelegramCls = require('telegraf').Telegram;
  var origCallApi = TelegramCls.prototype.callApi;

  var PAGE = 'UzBrand Silk Matt 7 — ichki devorlar uchun shoyi-mat akril bo\'yoq. Матовая акриловая краска для стен и потолков. ' +
    'Расход 120 мл/м2. Время высыхания 2 часа. Фасовка 9 л. Моющаяся, для жилых и общественных помещений. '.repeat(4);
  var IMGS = {
    'https://uzbrand.uz/upload/silk-1.png': makePng(900, 900, 3),
    'https://uzbrand.uz/upload/silk-2.png': makePng(800, 600, 5),
    'https://uzbrand.uz/upload/silk-3.png': makePng(700, 900, 7)
  };
  var html = '<html><head><title>UzBrand Silk Matt 7 — краска</title><meta property="og:image" content="/upload/silk-1.png"></head><body><h1>Silk Matt 7</h1><p>' + PAGE + '</p>' +
    '<img src="/upload/silk-2.png"><img src="/upload/silk-3.png"></body></html>';
  var map = {
    'https://uzbrand.uz/robots.txt': 'Sitemap: https://uzbrand.uz/sitemap.xml',
    'https://uzbrand.uz/sitemap.xml': '<urlset><url><loc>https://uzbrand.uz/catalog/paints/silk-matt-7</loc></url><url><loc>https://uzbrand.uz/catalog/paints/primer-g1</loc></url><url><loc>https://uzbrand.uz/about/history</loc></url></urlset>',
    'https://uzbrand.uz/catalog/paints/silk-matt-7': html
  };
  web.setFetcher(async function (url) {
    if (map[url]) return { ok: true, status: 200, finalUrl: url, contentType: /\.xml$|robots/.test(url) ? 'text/xml' : 'text/html', body: Buffer.from(map[url]) };
    if (IMGS[url]) return { ok: true, status: 200, finalUrl: url, contentType: 'image/png', body: IMGS[url] };
    return { ok: false, status: 404, finalUrl: url, contentType: '', body: null, error: 'http_404' };
  });

  var prompts = [];
  gemini.setTransport(async function (method, url, body) {
    if (method === 'GET') return { status: 200, json: { models: [{ name: 'models/gemini-3.5-flash', supportedGenerationMethods: ['generateContent'] }] } };
    assert.equal(body.tools, undefined, 'bepul rejimda Google Search ishlatilmasligi kerak');
    var prompt = body.contents[0].parts[0].text;
    prompts.push(prompt.slice(0, 40));
    var reply;
    if (/page URLs from the official website/.test(prompt)) {
      assert.ok(prompt.indexOf('https://uzbrand.uz/about/history') === -1, 'about sahifasi filtrlanishi kerak');
      reply = { urls: ['https://evil.test/hack', 'https://uzbrand.uz/catalog/paints/silk-matt-7'] };
    } else if (/Look at this web page/.test(prompt)) {
      reply = { is_single_product_page: true, fits_category: true, product_name: 'Silk Matt 7', brand: 'UzBrand', product_code: '', manufacturer_country: "O'zbekiston" };
    } else if (/You fill a material card/.test(prompt)) {
      var uz = "UzBrand Silk Matt 7 — ichki devor va shiftlar uchun shoyi-mat akril bo'yoq. Turar-joy va jamoat binolarida ishlatiladi, yuviladigan qoplama hosil qiladi. Sarfi kvadrat metrga 120 ml, ikki soatda quriydi. Chizmalarda pardoz turini ko'rsatish kerak.";
      var ru = 'UzBrand Silk Matt 7 — шелковисто-матовая акриловая краска для стен и потолков внутри помещений. Применяется в жилых и общественных зданиях, образует моющееся покрытие. Расход 120 мл на квадратный метр, высыхает за два часа.';
      var en = 'UzBrand Silk Matt 7 is a silk-matt acrylic paint for interior walls and ceilings. It is used in residential and public buildings and forms a washable finish. Consumption is 120 ml per square metre and it dries in two hours.';
      reply = {
        name_uz: "UzBrand Silk Matt 7 akril bo'yoq", name_ru: 'Акриловая краска UzBrand Silk Matt 7', name_en: 'UzBrand Silk Matt 7 acrylic paint',
        short_description_uz: "Ichki devor va shiftlar uchun yuviladigan shoyi-mat akril bo'yoq.", short_description_ru: 'Моющаяся шелковисто-матовая краска для стен и потолков.', short_description_en: 'Washable silk-matt acrylic paint for interior walls and ceilings.',
        description_uz: uz, description_ru: ru, description_en: en,
        usage_area_uz: 'Yashash xonalari, ofislar', usage_area_ru: 'Жилые комнаты, офисы', usage_area_en: 'Living rooms, offices',
        pros_uz: '• Yuviladi', pros_ru: '• Моющаяся', pros_en: '• Washable', cons_uz: '• Tayyor asos kerak', cons_ru: '• Нужна подготовка', cons_en: '• Needs primer',
        subcategory_name: 'Краска', material_type: 'Акриловая краска', scope: 'interior',
        specifications: [{ parameter: 'consumption', label_uz: 'Sarf', label_ru: 'Расход', value: '120', unit: 'мл/м2' }, { parameter: 'drying', label_uz: 'Qurish', label_ru: 'Время высыхания', value: '2', unit: 'часа' }]
      };
    } else if (/strict photo editor/.test(prompt)) {
      var n = body.contents[0].parts.length - 1;
      reply = { images: Array.from({ length: n }, function (_, i) { return { index: i, shows_product: true, kind: ['package', 'installed', 'texture'][i % 3], quality: 8, watermark_or_text: false }; }) };
    } else if (/Final QA/.test(prompt)) {
      reply = { images_match: true, bad_image_indexes: [], text_matches: true, category_matches: true, issues: [] };
    } else {
      throw new Error('kutilmagan prompt (bepul rejimda): ' + prompt.slice(0, 80));
    }
    return { status: 200, json: { candidates: [{ content: { parts: [{ text: JSON.stringify(reply) }] } }] } };
  });

  var bot = new Telegraf('TEST:TOKEN');
  bot.botInfo = { id: 999, is_bot: true, username: 'test_bot', first_name: 'Test' };
  var sent = [], msgId = 500, fileSeq = 0;
  TelegramCls.prototype.callApi = async function (method, payload) {
    sent.push({ method: method, payload: payload });
    if (method === 'sendPhoto') {
      var fid = typeof payload.photo === 'string' ? payload.photo : 'free' + (++fileSeq);
      return { message_id: ++msgId, photo: [{ file_id: fid, file_unique_id: 'u' + fid, width: 800, height: 800 }] };
    }
    if (method === 'sendMediaGroup') return payload.media.map(function () { return { message_id: ++msgId }; });
    if (method === 'sendMessage') return { message_id: ++msgId };
    if (method === 'editMessageText' || method === 'answerCallbackQuery') return true;
    throw new Error('kutilmagan Telegram metodi: ' + method);
  };

  var materialAgent = require('../services/materialAgent');
  var pipeline = require('../services/materialAgent/pipeline');
  materialAgent.registerBot(bot, function () { return pool; });

  try {
    await pool.query('DROP TABLE IF EXISTS material_ai_candidates, material_ai_runs, tg_media');
    // Faqat bitta brend sayti qoldiramiz (qolganlari test muhitida ochilmaydi)
    await pool.query('UPDATE material_manufacturers SET website = NULL');
    await pool.query("INSERT INTO material_manufacturers (name, slug, website, country) VALUES ('UzBrand', 'uzbrand', 'https://uzbrand.uz', 'O''zbekiston') ON CONFLICT (slug) DO UPDATE SET website = EXCLUDED.website");
    await materialAgent.start({ pool: pool, bot: bot });

    var r = await pipeline.runDaily({});
    assert.equal(r.ok, true, r.result);
    var cand = await store.getCandidate(pool, r.candidate_id);
    assert.equal(cand.status, 'pending_review');
    assert.equal(cand.product_url, 'https://uzbrand.uz/catalog/paints/silk-matt-7');
    assert.equal(cand.brand, 'UzBrand');
    assert.equal(cand.images.length, 3);
    assert.equal(cand.uz.available, true, '.uz rasmiy sayt — O\'zbekistonda mavjud');
    assert.equal(cand.uz.method, 'domain');
    // Kanal yo'q — rasmlar admin chatiga (111) saqlanadi
    var uploads = sent.filter(function (s) { return s.method === 'sendPhoto' && typeof s.payload.photo !== 'string'; });
    assert.equal(uploads.length, 3);
    assert.ok(uploads.every(function (u) { return String(u.payload.chat_id) === '111'; }));
    assert.ok(!prompts.some(function (p) { return /research agent/.test(p); }));

    await bot.handleUpdate({ update_id: 7, callback_query: { id: 'c1', from: { id: 111, is_bot: false, first_name: 'A' }, chat_instance: '1', data: 'mai:ok:' + cand.id, message: { message_id: 5, date: 1, chat: { id: 111, type: 'private' }, text: 'x' } } });
    var pub = await store.getCandidate(pool, cand.id);
    assert.equal(pub.status, 'published');
    var mat = (await pool.query('SELECT * FROM materials WHERE id = $1', [pub.material_id])).rows[0];
    assert.equal(mat.uz_available, true);
    assert.equal(mat.uz_dealer_url, 'https://uzbrand.uz/catalog/paints/silk-matt-7');
    assert.equal(mat.name_ru, 'Акриловая краска UzBrand Silk Matt 7');

    // Ikkinchi ishga tushish: o'sha sahifa qayta tanlanmaydi (sitemap'da yangi mos sahifa yo'q)
    var r2 = await pipeline.runDaily({});
    assert.equal(r2.ok, false);
    assert.ok(/mos material topilmadi|Dublikat/.test(r2.result), r2.result);
  } finally {
    web.setFetcher(null);
    gemini.setTransport(null);
    TelegramCls.prototype.callApi = origCallApi;
    await pool.end();
  }
});
