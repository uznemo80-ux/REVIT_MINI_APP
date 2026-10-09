'use strict';
/**
 * Rasm tuzatuvchi — Kutubxona → Materiallar'dagi mavjud materiallar rasmlarini tekshiradi va almashtiradi.
 *
 * Muammo: seed materiallarning ko'pchiligida haqiqiy foto o'rniga shablon SVG kartochka turibdi
 * ("✓ VERIFIED ASSET" yozuvi bilan), ba'zi haqiqiy rasmlar esa boshqa mahsulotni ko'rsatadi.
 *
 * Har bir material uchun:
 *   1. SVG shablon → almashtirish kerak. Haqiqiy rasm → Gemini vision "shu materialmi?" deb tekshiradi.
 *   2. Yangi rasm: (a) rasmiy mahsulot sahifasi, (b) Wikimedia Commons (CC0/PD/CC BY/CC BY-SA, muallif saqlanadi).
 *   3. Har bir nomzod rasm AI tomonidan tekshiriladi; faqat mos kelganlari qo'yiladi (Telegram omboriga yuklanadi).
 *   4. Topilmasa: soxta "Tekshirilgan" belgisi olib tashlanadi (image_verified = false).
 *   5. Eski qiymatlar material_image_repairs jadvalida saqlanadi — /rasmqaytar <id> bilan qaytariladi.
 * Soatiga kichik partiya, kunlik limit bilan (Gemini bepul tarif limiti uchun).
 */
var fs = require('fs');
var path = require('path');
var config = require('./config');
var gemini = require('./gemini');
var web = require('./web');
var commons = require('./commons');
var media = require('./media');
var stages = require('./stages');

var LOCK_KEY = 778202;
var PUBLIC_DIR = path.join(__dirname, '..', '..', 'public');
var COMMONS_UA = 'YoshUzbekkMaterialBot/1.0 (https://t.me/Yosh_uzbekk; materials library image check)';
var JUNK_SOURCE = /^https?:\/\/(www\.)?(standart\.uz|mc\.uz)(\/|$)/i;

function envInt(name, def) { var v = parseInt(process.env[name], 10); return Number.isFinite(v) ? v : def; }
function batchSize() { return envInt('MATERIAL_IMAGE_REPAIR_BATCH', 12); }
function dailyCap() { return envInt('MATERIAL_IMAGE_REPAIR_DAILY', 120); }

async function migrate(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS material_image_repairs (
      material_id      INT PRIMARY KEY,
      status           VARCHAR(20) NOT NULL,
      reason           TEXT,
      old_image_url    TEXT,
      old_cover_image  TEXT,
      old_gallery      JSONB,
      old_source       TEXT,
      old_source_url   TEXT,
      old_verified     BOOLEAN,
      new_gallery      JSONB,
      attempts         INT NOT NULL DEFAULT 0,
      checked_at       TIMESTAMPTZ DEFAULT NOW(),
      updated_at       TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS material_agent_state (
      key        VARCHAR(50) PRIMARY KEY,
      value      JSONB NOT NULL DEFAULT '{}',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

async function getState(pool) {
  var r = await pool.query("SELECT value FROM material_agent_state WHERE key = 'image_repair'");
  return r.rows[0] ? r.rows[0].value : { running: false };
}
async function setState(pool, patch) {
  var cur = await getState(pool);
  var next = Object.assign({}, cur, patch);
  await pool.query(
    "INSERT INTO material_agent_state (key, value, updated_at) VALUES ('image_repair', $1, NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()",
    [JSON.stringify(next)]
  );
  return next;
}

function galleryOf(m) {
  var g = Array.isArray(m.gallery_images) && m.gallery_images.length ? m.gallery_images : [m.image_url || m.cover_image];
  return g.filter(Boolean).filter(function (u, i, a) { return a.indexOf(u) === i; });
}
function isPlaceholder(url) { return /\.svg(\?|$)/i.test(String(url || '')); }

function isLatin(s) { return /^[\x20-\x7E]+$/.test(String(s || '').trim()) && /[a-z]{3}/i.test(s || ''); }

/** Mavjud rasm baytlarini olish: /img/... (diskdan), /api/media/tg/:id (Telegram), http(s) (tarmoq) */
async function loadImage(pool, url) {
  var u = String(url || '');
  try {
    if (u.indexOf('/img/') === 0) {
      var p = path.normalize(path.join(PUBLIC_DIR, decodeURIComponent(u.split('?')[0])));
      if (p.indexOf(PUBLIC_DIR + path.sep) !== 0 || !fs.existsSync(p)) return null;
      var buf = fs.readFileSync(p);
      var inf = require('./imageInfo').info(buf);
      return inf ? { url: u, buffer: buf, mime: inf.mime, width: inf.width, height: inf.height } : null;
    }
    var tg = u.match(/^\/api\/media\/tg\/(\d+)$/);
    if (tg) {
      var row = (await pool.query('SELECT file_id, mime FROM tg_media WHERE id = $1', [Number(tg[1])])).rows[0];
      if (!row) return null;
      var b = await media.telegramFileBytes(row.file_id);
      return { url: u, buffer: b, mime: row.mime || 'image/jpeg' };
    }
    if (/^https?:\/\//i.test(u)) {
      var img = await web.fetchImage(u, config.MAX_IMAGE_BYTES);
      return img.ok ? img : null;
    }
  } catch (e) { /* o'qib bo'lmadi */ }
  return null;
}

function describe(m) {
  return [m.name_ru || m.name, m.english_name && m.english_name !== m.name_ru ? '(' + m.english_name + ')' : '',
    m.brand && !/^(standart|не указано)$/i.test(m.brand) ? '— brand ' + m.brand : '',
    m.material_type ? '— type: ' + m.material_type : '', m.subcategory_name ? '— subcategory: ' + m.subcategory_name : ''].filter(Boolean).join(' ');
}

/** Mavjud (SVG bo'lmagan) rasmlar materialga mosmi */
async function auditExisting(m, imgs) {
  var r = await gemini.generateJson({
    prompt: [
      'Building-materials library card: ' + describe(m),
      'Short description: ' + String(m.short_description_ru || m.short_description_uz || '').slice(0, 300),
      'You get ' + imgs.length + ' images (index 0..' + (imgs.length - 1) + ').',
      'For each image: does it clearly show THIS material/product (the material itself, its texture, package, or the material installed)?',
      'Answer false for a different product type (e.g. a shadow-gap profile shown for an LED profile or a divider profile), a generic room photo where the material is not visible, logos, diagrams with only text.',
      'Return ONLY JSON: {"images": [{"index": 0, "shows_material": true, "note": "short"}]}'
    ].join('\n'),
    images: imgs.map(function (i) { return { mime: i.mime, data: i.buffer }; }),
    json: true, temperature: 0
  });
  var out = imgs.map(function () { return false; });
  ((r.data && r.data.images) || []).forEach(function (v) { if (out[Number(v.index)] !== undefined) out[Number(v.index)] = v.shows_material === true; });
  return out;
}

async function searchQueries(m) {
  var qs = [];
  if (isLatin(m.english_name)) qs.push(m.english_name);
  if (isLatin(m.name_en) && qs.indexOf(m.name_en) === -1) qs.push(m.name_en);
  if (qs.length < 2) {
    var r = await gemini.generateJson({
      prompt: 'Give 2 short English search queries (2-4 words, generic material type, no brand names unless essential) to find a PHOTO of this building material on Wikimedia Commons: ' +
        describe(m) + '\nReturn ONLY JSON: {"queries": ["...", "..."]}',
      json: true, temperature: 0
    });
    ((r.data && r.data.queries) || []).forEach(function (q) { q = String(q || '').trim(); if (q && qs.indexOf(q) === -1) qs.push(q); });
  }
  return qs.slice(0, 3);
}

/** Rasmiy mahsulot sahifasi (bosh sahifa yoki soxta seed manzil emas) */
function officialPage(m) {
  var cands = [m.manufacturer_url, m.source_url, m.image_source_url];
  for (var i = 0; i < cands.length; i++) {
    var u = String(cands[i] || '').trim();
    if (!/^https?:\/\//i.test(u) || JUNK_SOURCE.test(u)) continue;
    try {
      var p = new URL(u);
      if (p.hostname === 'commons.wikimedia.org') continue;
      if (p.pathname.split('/').filter(Boolean).length >= 2) return u;
    } catch (e) { /* noto'g'ri URL */ }
  }
  return '';
}

async function findReplacements(m, need, excludeUrls) {
  var cands = []; // {url, source}
  var page = officialPage(m);
  if (page) {
    var pg = await web.fetchPage(page);
    if (pg.ok) {
      web.extractImageUrls(pg.html, pg.finalUrl).slice(0, 8).forEach(function (u) {
        cands.push({ url: u, source: { type: 'official', pageUrl: pg.finalUrl, label: (m.brand || web.hostOf(pg.finalUrl)) + ' — rasmiy sayt' } });
      });
    }
  }
  var queries = await searchQueries(m);
  for (var qi = 0; qi < queries.length && cands.length < 20; qi++) {
    var res = await commons.search(queries[qi], 10);
    res.forEach(function (c) {
      cands.push({ url: c.url, source: { type: 'commons', pageUrl: c.pageUrl, artist: c.artist, license: c.license, label: 'Wikimedia Commons' } });
    });
  }
  var seen = new Set(excludeUrls || []);
  cands = cands.filter(function (c) { if (seen.has(c.url)) return false; seen.add(c.url); return true; });

  // Yuklab olish + o'lcham filtri
  var imgs = [], hashes = new Set();
  for (var i = 0; i < cands.length && imgs.length < 8; i++) {
    var img = await web.fetchImage(cands[i].url, config.MAX_IMAGE_BYTES, cands[i].source.type === 'commons' ? COMMONS_UA : undefined);
    if (!img.ok || Math.min(img.width, img.height) < config.MIN_IMAGE_SIDE) continue;
    var ratio = img.width / img.height;
    if (ratio > 3 || ratio < 0.33) continue;
    var h = require('crypto').createHash('sha1').update(img.buffer).digest('hex');
    if (hashes.has(h)) continue;
    hashes.add(h);
    img.hash = h;
    img.source = cands[i].source;
    imgs.push(img);
  }
  if (!imgs.length) return { picked: [], queries: queries, candidates: cands.length };
  var picked = await stages._internals.rankImages({
    brand: m.brand && !/^(standart|не указано)$/i.test(m.brand) ? m.brand : '',
    product_name: (m.name_ru || m.name) + (m.english_name && m.english_name !== m.name_ru ? ' / ' + m.english_name : ''),
    material_type: m.material_type || m.subcategory_name || ''
  }, imgs);
  return { picked: picked.slice(0, need), queries: queries, candidates: cands.length };
}

function sourceLabel(picked) {
  var first = picked[0].source;
  if (first.type === 'official') return first.label.slice(0, 100);
  var lic = Array.from(new Set(picked.filter(function (p) { return p.source.type === 'commons'; }).map(function (p) { return p.source.license; })));
  return ('Wikimedia Commons (' + lic.join(', ') + ')').slice(0, 100);
}

/** Bitta materialni tekshirish va kerak bo'lsa tuzatish. @returns {Promise<{status:string, reason:string}>} */
async function processMaterial(pool, bot, m) {
  var gallery = galleryOf(m);
  var placeholders = gallery.filter(isPlaceholder);
  var real = gallery.filter(function (u) { return !isPlaceholder(u); });

  // 1. Haqiqiy rasmlarni tekshirish
  var keep = [], bad = placeholders.slice(), reason = [];
  if (placeholders.length) reason.push(placeholders.length + ' ta SVG shablon');
  if (real.length) {
    var loaded = [];
    for (var i = 0; i < real.length; i++) {
      var li = await loadImage(pool, real[i]);
      if (li && li.buffer.length <= 4 * 1024 * 1024) loaded.push(li); else bad.push(real[i]);
    }
    if (loaded.length) {
      var verdict = await auditExisting(m, loaded);
      loaded.forEach(function (li, idx) { if (verdict[idx]) keep.push(li.url); else bad.push(li.url); });
      var wrong = loaded.length - keep.length;
      if (wrong) reason.push(wrong + ' ta rasm materialga mos emas');
    }
  }
  var record = {
    material_id: m.id, old_image_url: m.image_url, old_cover_image: m.cover_image, old_gallery: gallery,
    old_source: m.image_source, old_source_url: m.image_source_url, old_verified: m.image_verified
  };
  if (!bad.length) {
    await saveRecord(pool, record, 'ok', 'Rasmlar materialga mos', gallery);
    return { status: 'ok', reason: 'Rasmlar mos' };
  }

  // 2. O'rniga yangi rasm topish
  var need = Math.max(1, config.MAX_IMAGES - keep.length);
  var found = await findReplacements(m, need, gallery);
  var picked = found.picked;

  if (!picked.length) {
    if (keep.length) {
      // Mos rasmlar bor — faqat mos kelmaganlarini olib tashlaymiz
      await pool.query(
        'UPDATE materials SET gallery_images = $2, image_url = $3, cover_image = $4, updated_at = NOW() WHERE id = $1',
        [m.id, keep, keep[0], keep[0]]
      );
      await saveRecord(pool, record, 'replaced', reason.join('; ') + ' → mos kelmaganlari olib tashlandi', keep);
      return { status: 'replaced', reason: reason.join('; ') };
    }
    // Hech narsa topilmadi — soxta "tekshirilgan" belgisini olib tashlaymiz, rasmni o'zgartirmaymiz
    await pool.query(
      "UPDATE materials SET image_verified = false, image_source = $2, image_verification_note = $3, updated_at = NOW() WHERE id = $1",
      [m.id, placeholders.length === gallery.length ? 'Sxematik illyustratsiya' : (m.image_source || ''),
        'Rasm tuzatuvchi: mos foto topilmadi (' + (found.queries.join(' | ') || '-') + ')']
    );
    await saveRecord(pool, record, 'not_found', reason.join('; ') + ' → mos foto topilmadi', gallery);
    return { status: 'not_found', reason: reason.join('; ') };
  }

  // 3. Yangi rasmlarni omborga yuklash va materialni yangilash
  var newUrls = [];
  for (var pi = 0; pi < picked.length; pi++) {
    var p = picked[pi];
    var caption = '#MATERIAL_RASM m' + m.id + ' — ' + (m.name_ru || m.name) + '\n' + (p.source.pageUrl || p.url) +
      (p.source.type === 'commons' ? '\n' + p.source.artist + ', ' + p.source.license : '');
    var mediaId = await media.uploadImage(pool, bot, p, caption.slice(0, 1000));
    await pool.query('UPDATE tg_media SET is_public = TRUE WHERE id = $1', [mediaId]);
    newUrls.push('/api/media/tg/' + mediaId);
  }
  var finalGallery = keep.concat(newUrls).slice(0, config.MAX_IMAGES);
  var client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`
      UPDATE materials SET gallery_images = $2, image_url = $3, cover_image = $7,
        image_source = $4, image_source_url = $5, image_verified = true, image_verified_at = NOW(),
        image_verification_note = $6, updated_at = NOW()
      WHERE id = $1
    `, [m.id, finalGallery, finalGallery[0], keep.length ? (m.image_source || sourceLabel(picked)) : sourceLabel(picked),
      keep.length ? m.image_source_url : picked[0].source.pageUrl,
      'Rasm tuzatuvchi: AI vision tekshiruvi (' + new Date().toISOString().slice(0, 10) + ')', finalGallery[0]]);
    // Litsenziya atributsiyasi — har bir Commons rasmi manbalar ro'yxatida
    var srcCols = (await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'material_sources'")).rows.map(function (x) { return x.column_name; });
    for (var si = 0; si < picked.length; si++) {
      var s = picked[si].source;
      if (s.type !== 'commons') continue;
      var row = { material_id: m.id, source_type: 'image_license', title: ('Rasm: ' + s.artist + ' — ' + s.license).slice(0, 250), url: s.pageUrl, publisher: 'Wikimedia Commons', status: 'verified', is_primary: false };
      var keys = Object.keys(row).filter(function (k) { return srcCols.indexOf(k) !== -1; });
      await client.query('INSERT INTO material_sources (' + keys.join(', ') + ') VALUES (' + keys.map(function (_, i) { return '$' + (i + 1); }).join(', ') + ')', keys.map(function (k) { return row[k]; }));
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK').catch(function () {});
    throw e;
  } finally {
    client.release();
  }
  await saveRecord(pool, record, 'replaced', reason.join('; ') + ' → ' + newUrls.length + ' ta yangi rasm', finalGallery);
  return { status: 'replaced', reason: reason.join('; ') };
}

async function saveRecord(pool, rec, status, reason, newGallery) {
  await pool.query(`
    INSERT INTO material_image_repairs (material_id, status, reason, old_image_url, old_cover_image, old_gallery, old_source, old_source_url, old_verified, new_gallery, attempts, checked_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 1, NOW(), NOW())
    ON CONFLICT (material_id) DO UPDATE SET status = EXCLUDED.status, reason = EXCLUDED.reason, new_gallery = EXCLUDED.new_gallery,
      attempts = material_image_repairs.attempts + 1, checked_at = NOW(), updated_at = NOW()
  `, [rec.material_id, status, String(reason).slice(0, 1000), rec.old_image_url, rec.old_cover_image, JSON.stringify(rec.old_gallery),
    rec.old_source, rec.old_source_url, rec.old_verified, JSON.stringify(newGallery || [])]);
}

async function markError(pool, m, err) {
  await pool.query(`
    INSERT INTO material_image_repairs (material_id, status, reason, old_image_url, old_gallery, old_source, old_source_url, old_verified, attempts)
    VALUES ($1, 'error', $2, $3, $4, $5, $6, $7, 1)
    ON CONFLICT (material_id) DO UPDATE SET status = 'error', reason = EXCLUDED.reason, attempts = material_image_repairs.attempts + 1, updated_at = NOW()
  `, [m.id, String(err.message || err).slice(0, 1000), m.image_url, JSON.stringify(galleryOf(m)), m.image_source, m.image_source_url, m.image_verified]);
}

async function withLock(pool, fn) {
  var client = await pool.connect();
  try {
    var got = await client.query('SELECT pg_try_advisory_lock($1) AS ok', [LOCK_KEY]);
    if (!got.rows[0].ok) return { skipped: true };
    try { return await fn(); } finally { await client.query('SELECT pg_advisory_unlock($1)', [LOCK_KEY]).catch(function () {}); }
  } finally { client.release(); }
}

/** Keyingi partiya. @returns {{processed, ok, replaced, not_found, errors, remaining, quota?}} */
async function runBatch(pool, bot, limit) {
  var res = await withLock(pool, async function () {
    var stats = { processed: 0, ok: 0, replaced: 0, not_found: 0, errors: 0, examples: [] };
    var r = await pool.query(`
      SELECT m.* FROM materials m
      LEFT JOIN material_image_repairs r ON r.material_id = m.id
      WHERE m.status = 'published' AND COALESCE(m.ai_generated, false) = false
        AND (r.material_id IS NULL OR (r.status = 'error' AND r.attempts < 3))
      ORDER BY m.id
      LIMIT $1
    `, [limit]);
    for (var i = 0; i < r.rows.length; i++) {
      var m = r.rows[i];
      try {
        var out = await processMaterial(pool, bot, m);
        stats.processed++;
        stats[out.status]++;
        if (out.status === 'replaced' && stats.examples.length < 5) stats.examples.push('#' + m.id + ' ' + (m.name_uz || m.name));
      } catch (e) {
        if (/HTTP 429|vaqtincha band|quota/i.test(e.message)) { stats.quota = true; break; } // limit — keyinroq davom etadi
        stats.errors++;
        await markError(pool, m, e).catch(function () {});
      }
    }
    stats.remaining = await remaining(pool);
    return stats;
  });
  return res;
}

async function remaining(pool) {
  var r = await pool.query(`
    SELECT COUNT(*)::int AS n FROM materials m LEFT JOIN material_image_repairs r ON r.material_id = m.id
    WHERE m.status = 'published' AND COALESCE(m.ai_generated, false) = false
      AND (r.material_id IS NULL OR (r.status = 'error' AND r.attempts < 3))
  `);
  return r.rows[0].n;
}

async function summary(pool) {
  var r = await pool.query('SELECT status, COUNT(*)::int AS n FROM material_image_repairs GROUP BY 1');
  var s = { ok: 0, replaced: 0, not_found: 0, error: 0 };
  r.rows.forEach(function (x) { s[x.status] = x.n; });
  s.remaining = await remaining(pool);
  return s;
}

/** Eski rasmlarni qaytarish */
async function revert(pool, materialId) {
  var rec = (await pool.query('SELECT * FROM material_image_repairs WHERE material_id = $1', [materialId])).rows[0];
  if (!rec) return { ok: false, error: 'Bu material uchun tuzatish yozuvi yo\'q' };
  await pool.query(`
    UPDATE materials SET gallery_images = $2, image_url = $3, cover_image = $4, image_source = $5, image_source_url = $6,
      image_verified = $7, updated_at = NOW() WHERE id = $1
  `, [materialId, rec.old_gallery || [], rec.old_image_url, rec.old_cover_image || rec.old_image_url, rec.old_source, rec.old_source_url, rec.old_verified]);
  await pool.query("DELETE FROM material_sources WHERE material_id = $1 AND source_type = 'image_license'", [materialId]);
  await pool.query("UPDATE material_image_repairs SET status = 'reverted', updated_at = NOW() WHERE material_id = $1", [materialId]);
  return { ok: true };
}

/** Scheduler'dan chaqiriladi: ishlayotgan bo'lsa, soatiga bir partiya, kunlik limit ichida */
async function tick(pool, bot, notify, now) {
  var st = await getState(pool);
  if (!st.running) return;
  var t = now ? new Date(now) : new Date();
  var today = new Date(t.getTime() + config.TZ_OFFSET_MIN * 60000).toISOString().slice(0, 10);
  if (st.day !== today) st = await setState(pool, { day: today, day_count: 0 });
  if (st.last_batch_at && t - new Date(st.last_batch_at) < 50 * 60 * 1000) return;
  var left = dailyCap() - (st.day_count || 0);
  if (left <= 0) return;
  await setState(pool, { last_batch_at: t.toISOString() });
  var stats = await runBatch(pool, bot, Math.min(batchSize(), left));
  if (!stats || stats.skipped) return;
  st = await setState(pool, { day_count: (st.day_count || 0) + stats.processed });
  var total = await summary(pool);
  var firstReport = !st.first_reported;
  if (firstReport) await setState(pool, { first_reported: true });
  if (stats.remaining === 0) {
    await setState(pool, { running: false, finished_at: t.toISOString() });
    await notify('✅ <b>Rasm tuzatish tugadi.</b>\n' + summaryText(total));
  } else if (firstReport || stats.quota) {
    await notify('🖼 <b>Rasm tuzatish</b>: ' + stats.processed + ' ta material tekshirildi' +
      (stats.examples.length ? '\nAlmashtirilganlar: ' + stats.examples.join(', ') : '') +
      (stats.quota ? '\n⚠️ Gemini limiti — keyingi soatda davom etadi.' : '') + '\n\n' + summaryText(total));
  }
}

function summaryText(s) {
  return '✓ To\'g\'ri: ' + s.ok + '\n🔄 Almashtirildi: ' + s.replaced + '\n✖ Mos foto topilmadi: ' + s.not_found +
    (s.error ? '\n⚠️ Xato: ' + s.error : '') + '\n⏳ Qoldi: ' + s.remaining;
}

module.exports = {
  migrate: migrate, getState: getState, setState: setState, runBatch: runBatch, tick: tick, revert: revert,
  summary: summary, summaryText: summaryText, processMaterial: processMaterial,
  _internals: { isPlaceholder: isPlaceholder, officialPage: officialPage, galleryOf: galleryOf, isLatin: isLatin }
};
