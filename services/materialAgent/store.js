'use strict';
/**
 * MaterialAgent — ma'lumotlar bazasi qatlami.
 *
 * Muhim: AI topgan, hali tasdiqlanmagan materiallar `materials` jadvaliga YOZILMAYDI.
 * Ular `material_ai_candidates` jadvalida turadi va faqat admin "Joylash" bosgandan keyin
 * `materials` ga published holatda o'tadi. Sabab: /api/materials/list so'rovi status'ni
 * mijozdan qabul qiladi, shuning uchun draft yozuvlar ochiq ko'rinib qolishi mumkin edi.
 */
var config = require('./config');

var LOCK_KEY = 778201; // pg_advisory lock — bir vaqtda faqat bitta pipeline ishlaydi

async function migrate(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS material_ai_candidates (
      id               SERIAL PRIMARY KEY,
      status           VARCHAR(30) NOT NULL DEFAULT 'searching',
      stage            VARCHAR(30),
      category_slug    VARCHAR(100),
      product_name     VARCHAR(500),
      brand            VARCHAR(255),
      product_url      TEXT,
      dedup_key        VARCHAR(500),
      data             JSONB NOT NULL DEFAULT '{}',
      images           JSONB NOT NULL DEFAULT '[]',
      rejected_image_urls JSONB NOT NULL DEFAULT '[]',
      uz               JSONB NOT NULL DEFAULT '{}',
      checks           JSONB NOT NULL DEFAULT '{}',
      rework_count     INT NOT NULL DEFAULT 0,
      rework_focus     VARCHAR(20),
      last_error       TEXT,
      review_chat_id   TEXT,
      review_message_ids JSONB NOT NULL DEFAULT '[]',
      material_id      INT,
      reviewed_by      BIGINT,
      reviewed_at      TIMESTAMPTZ,
      created_at       TIMESTAMPTZ DEFAULT NOW(),
      updated_at       TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query('CREATE INDEX IF NOT EXISTS idx_mat_ai_cand_status ON material_ai_candidates(status, created_at)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_mat_ai_cand_dedup ON material_ai_candidates(dedup_key)');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS material_ai_runs (
      run_date    DATE PRIMARY KEY,
      started_at  TIMESTAMPTZ DEFAULT NOW(),
      finished_at TIMESTAMPTZ,
      result      TEXT
    )
  `);

  // Telegram yopiq kanalda saqlangan rasmlar (Mini App /api/media/tg/:id orqali ko'rsatadi)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tg_media (
      id             SERIAL PRIMARY KEY,
      file_id        TEXT NOT NULL,
      file_unique_id TEXT,
      chat_id        TEXT,
      message_id     BIGINT,
      kind           VARCHAR(20) DEFAULT 'photo',
      mime           VARCHAR(50),
      width          INT,
      height         INT,
      size_bytes     INT,
      source_url     TEXT,
      is_public      BOOLEAN NOT NULL DEFAULT FALSE,
      created_at     TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // "O'zbekistonda mavjud" belgisi uchun (mavjud materiallarga ta'sir qilmaydi — default NULL)
  await pool.query('ALTER TABLE materials ADD COLUMN IF NOT EXISTS uz_available BOOLEAN');
  await pool.query('ALTER TABLE materials ADD COLUMN IF NOT EXISTS uz_dealer_url TEXT');
  await pool.query('ALTER TABLE materials ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT FALSE');
}

// ---------- vaqt (Toshkent, UTC+5) ----------
function tashkentNow(now) {
  var d = now ? new Date(now) : new Date();
  return new Date(d.getTime() + config.TZ_OFFSET_MIN * 60000); // UTC maydonlari = Toshkent vaqti
}
function tashkentDateStr(now) {
  return tashkentNow(now).toISOString().slice(0, 10);
}
/** Joriy haftaning dushanba 00:00 (Toshkent) vaqti — UTC Date sifatida */
function weekStartUtc(now) {
  var t = tashkentNow(now);
  var dow = (t.getUTCDay() + 6) % 7; // dushanba = 0
  var mondayLocal = Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate() - dow);
  return new Date(mondayLocal - config.TZ_OFFSET_MIN * 60000);
}

async function weeklyCount(pool, now) {
  var r = await pool.query(
    "SELECT COUNT(*)::int AS n FROM material_ai_candidates WHERE created_at >= $1 AND status NOT IN ('rejected','failed')",
    [weekStartUtc(now)]
  );
  return r.rows[0].n;
}

/** Bugungi ishga tushishni "egallaydi". true → shu jarayon ishlaydi, false → bugun allaqachon bajarilgan */
async function claimRun(pool, now) {
  var r = await pool.query(
    'INSERT INTO material_ai_runs (run_date) VALUES ($1) ON CONFLICT (run_date) DO NOTHING RETURNING run_date',
    [tashkentDateStr(now)]
  );
  return r.rowCount === 1;
}
async function finishRun(pool, result, now) {
  await pool.query('UPDATE material_ai_runs SET finished_at = NOW(), result = $2 WHERE run_date = $1', [tashkentDateStr(now), String(result || '').slice(0, 2000)]);
}

async function withLock(pool, fn) {
  var client = await pool.connect();
  try {
    var got = await client.query('SELECT pg_try_advisory_lock($1) AS ok', [LOCK_KEY]);
    if (!got.rows[0].ok) return { skipped: true, reason: 'locked' };
    try {
      return await fn();
    } finally {
      await client.query('SELECT pg_advisory_unlock($1)', [LOCK_KEY]).catch(function () {});
    }
  } finally {
    client.release();
  }
}

// ---------- kategoriyalar va dublikat ----------
async function listCategories(pool) {
  var r = await pool.query(`
    SELECT c.id, c.slug, c.name, c.description, COALESCE(c.scope, 'both') AS scope,
           (SELECT COUNT(*)::int FROM materials m WHERE m.category_id = c.id AND m.status = 'published') AS published_count,
           (SELECT COUNT(*)::int FROM material_ai_candidates a WHERE a.category_slug = c.slug AND a.created_at > NOW() - INTERVAL '21 days') AS recent_ai
    FROM material_categories c
    WHERE COALESCE(c.is_active, true) = true
    ORDER BY c.sort_order, c.id
  `);
  return r.rows;
}

/** Eng kam to'ldirilgan va yaqinda AI tegmagan kategoriyani tanlaydi */
function pickCategory(categories, exclude) {
  var list = categories.filter(function (c) { return !(exclude || []).includes(c.slug); });
  if (!list.length) list = categories.slice();
  list.sort(function (a, b) {
    return (a.recent_ai - b.recent_ai) || (a.published_count - b.published_count) || (a.id - b.id);
  });
  return list[0] || null;
}

async function subcategoriesOf(pool, categoryId) {
  var r = await pool.query(
    "SELECT subcategory_name, COUNT(*)::int AS n FROM materials WHERE category_id = $1 AND COALESCE(subcategory_name,'') <> '' GROUP BY 1 ORDER BY 2 DESC LIMIT 25",
    [categoryId]
  );
  return r.rows.map(function (x) { return x.subcategory_name; });
}

/** Kategoriyadagi mavjud nomlar (AI ularni takrorlamasligi uchun) */
async function existingNames(pool, categoryId, limit) {
  var r = await pool.query(`
    SELECT name FROM (
      SELECT COALESCE(m.name_ru, m.name) AS name, m.id AS sort_id FROM materials m WHERE m.category_id = $1
      UNION ALL
      SELECT a.product_name, 1000000000 + a.id FROM material_ai_candidates a
        WHERE a.category_slug = (SELECT slug FROM material_categories WHERE id = $1) AND a.product_name IS NOT NULL
    ) t ORDER BY sort_id DESC LIMIT $2
  `, [categoryId, limit || 120]);
  return r.rows.map(function (x) { return x.name; }).filter(Boolean);
}

function dedupKey(brand, productName) {
  return (String(brand || '') + ' ' + String(productName || ''))
    .toLowerCase().replace(/ё/g, 'е').replace(/[^a-zа-я0-9]+/gi, ' ').replace(/\s+/g, ' ').trim().slice(0, 480);
}

/** Bu mahsulot oldin taklif qilingan yoki bazada bormi */
async function isDuplicate(pool, brand, productName, productUrl, excludeCandidateId) {
  var key = dedupKey(brand, productName);
  var c = await pool.query(
    'SELECT id FROM material_ai_candidates WHERE (dedup_key = $1 OR product_url = $2) AND id <> $3 LIMIT 1',
    [key, productUrl || '__none__', excludeCandidateId || 0]
  );
  if (c.rows.length) return { duplicate: true, where: 'candidate#' + c.rows[0].id };
  var nameOnly = dedupKey('', productName);
  var m = await pool.query(`
    SELECT id FROM materials
    WHERE lower(regexp_replace(COALESCE(name_ru, name, ''), '[^a-zA-Zа-яА-Я0-9]+', ' ', 'g')) = $1
       OR lower(regexp_replace(COALESCE(name_en, ''), '[^a-zA-Zа-яА-Я0-9]+', ' ', 'g')) = $1
       OR ($2 <> '' AND (COALESCE(manufacturer_url,'') = $2 OR COALESCE(source_url,'') = $2 OR COALESCE(image_source_url,'') = $2))
    LIMIT 1
  `, [nameOnly, productUrl || '']);
  if (m.rows.length) return { duplicate: true, where: 'material#' + m.rows[0].id };
  return { duplicate: false };
}

// ---------- nomzodlar ----------
async function createCandidate(pool, fields) {
  var r = await pool.query(
    `INSERT INTO material_ai_candidates (status, stage, category_slug, product_name, brand, product_url, dedup_key, data)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [fields.status || 'searching', fields.stage || 'discover', fields.category_slug, fields.product_name || null, fields.brand || null,
      fields.product_url || null, dedupKey(fields.brand, fields.product_name), JSON.stringify(fields.data || {})]
  );
  return r.rows[0];
}

var JSON_COLS = ['data', 'images', 'rejected_image_urls', 'uz', 'checks', 'review_message_ids'];
var ALLOWED_COLS = ['status', 'stage', 'category_slug', 'product_name', 'brand', 'product_url', 'dedup_key', 'data', 'images',
  'rejected_image_urls', 'uz', 'checks', 'rework_count', 'rework_focus', 'last_error', 'review_chat_id', 'review_message_ids',
  'material_id', 'reviewed_by', 'reviewed_at'];

async function updateCandidate(pool, id, patch) {
  patch = Object.assign({}, patch);
  if (patch.brand !== undefined && patch.product_name !== undefined && patch.dedup_key === undefined) {
    patch.dedup_key = dedupKey(patch.brand, patch.product_name);
  }
  var sets = [], vals = [], i = 1;
  Object.keys(patch).forEach(function (k) {
    if (ALLOWED_COLS.indexOf(k) === -1) throw new Error('updateCandidate: ruxsatsiz ustun ' + k);
    sets.push(k + ' = $' + (i++));
    vals.push(JSON_COLS.indexOf(k) !== -1 ? JSON.stringify(patch[k]) : patch[k]);
  });
  sets.push('updated_at = NOW()');
  vals.push(id);
  var r = await pool.query('UPDATE material_ai_candidates SET ' + sets.join(', ') + ' WHERE id = $' + i + ' RETURNING *', vals);
  return r.rows[0];
}

async function getCandidate(pool, id) {
  var r = await pool.query('SELECT * FROM material_ai_candidates WHERE id = $1', [id]);
  return r.rows[0] || null;
}

/** Holatni atomik o'zgartiradi (ikki marta bosilgan tugmadan himoya) */
async function transition(pool, id, fromStatuses, toStatus, extra) {
  var vals = [id, fromStatuses, toStatus];
  var sets = ['status = $3', 'updated_at = NOW()'];
  var i = 4;
  Object.keys(extra || {}).forEach(function (k) {
    if (ALLOWED_COLS.indexOf(k) === -1) throw new Error('transition: ruxsatsiz ustun ' + k);
    sets.push(k + ' = $' + (i++));
    vals.push(JSON_COLS.indexOf(k) !== -1 ? JSON.stringify(extra[k]) : extra[k]);
  });
  var r = await pool.query(
    'UPDATE material_ai_candidates SET ' + sets.join(', ') + ' WHERE id = $1 AND status = ANY($2::text[]) RETURNING *',
    vals
  );
  return r.rows[0] || null;
}

// ---------- tg_media ----------
async function insertMedia(pool, m) {
  var r = await pool.query(
    `INSERT INTO tg_media (file_id, file_unique_id, chat_id, message_id, kind, mime, width, height, size_bytes, source_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
    [m.file_id, m.file_unique_id || null, m.chat_id ? String(m.chat_id) : null, m.message_id || null, m.kind || 'photo', m.mime || null,
      m.width || null, m.height || null, m.size_bytes || null, m.source_url || null]
  );
  return r.rows[0].id;
}

async function getMedia(pool, id) {
  var r = await pool.query('SELECT * FROM tg_media WHERE id = $1', [id]);
  return r.rows[0] || null;
}

// ---------- nashr (materials ga o'tkazish) ----------
function slugify(s) {
  var map = { 'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'x', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': '', 'ы': 'i', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'ў': 'o', 'қ': 'q', 'ғ': 'g', 'ҳ': 'h' };
  return String(s || '').toLowerCase().split('').map(function (ch) { return map[ch] !== undefined ? map[ch] : ch; }).join('')
    .replace(/[‘’ʻʼ`']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120) || 'material';
}

async function uniqueSlug(client, base) {
  var slug = base, n = 1;
  while (true) {
    var r = await client.query('SELECT 1 FROM materials WHERE slug = $1 LIMIT 1', [slug]);
    if (!r.rows.length) return slug;
    n++;
    slug = base.slice(0, 110) + '-' + n;
  }
}

async function upsertManufacturer(client, brand, website, country) {
  var slug = slugify(brand);
  var ex = await client.query('SELECT id FROM material_manufacturers WHERE slug = $1 OR lower(name) = lower($2) LIMIT 1', [slug, brand]);
  if (ex.rows.length) return ex.rows[0].id;
  var r = await client.query(
    'INSERT INTO material_manufacturers (name, slug, website, country) VALUES ($1, $2, $3, $4) RETURNING id',
    [brand, slug, website || null, country || null]
  );
  return r.rows[0].id;
}

async function tableColumns(client, table) {
  var r = await client.query('SELECT column_name, is_nullable, column_default FROM information_schema.columns WHERE table_name = $1', [table]);
  var map = {};
  r.rows.forEach(function (x) { map[x.column_name] = x; });
  return map;
}

/** Faqat jadvalda bor ustunlarga yozadi (prod va lokal sxemalar biroz farq qiladi) */
async function insertDynamic(client, table, row, cols) {
  var keys = Object.keys(row).filter(function (k) { return cols[k] && row[k] !== undefined; });
  var vals = keys.map(function (k) { return row[k]; });
  var ph = keys.map(function (_, i) { return '$' + (i + 1); });
  var r = await client.query('INSERT INTO ' + table + ' (' + keys.join(', ') + ') VALUES (' + ph.join(', ') + ') RETURNING id', vals);
  return r.rows[0].id;
}

/**
 * Tasdiqlangan nomzodni `materials` ga yozadi (tranzaksiyada).
 * @returns {Promise<number>} material id
 */
async function publishCandidate(pool, cand, adminTelegramId) {
  var d = cand.data || {};
  var client = await pool.connect();
  try {
    await client.query('BEGIN');
    var cat = await client.query('SELECT id FROM material_categories WHERE slug = $1', [cand.category_slug]);
    if (!cat.rows.length) throw new Error('Kategoriya topilmadi: ' + cand.category_slug);
    var categoryId = cat.rows[0].id;
    var manufacturerId = await upsertManufacturer(client, cand.brand, d.manufacturer_website, d.manufacturer_country);

    var mediaIds = (cand.images || []).map(function (im) { return im.media_id; }).filter(Boolean);
    if (mediaIds.length < config.MIN_IMAGES) throw new Error('Rasmlar yetarli emas (' + mediaIds.length + ')');
    await client.query('UPDATE tg_media SET is_public = TRUE WHERE id = ANY($1::int[])', [mediaIds]);
    var gallery = mediaIds.map(function (id) { return '/api/media/tg/' + id; });

    var uz = cand.uz || {};
    var matCols = await tableColumns(client, 'materials');
    var slug = await uniqueSlug(client, slugify((cand.brand ? cand.brand + ' ' : '') + (d.name_en || d.name_ru || cand.product_name)));
    var row = {
      name: d.name_uz, slug: slug, original_name: d.name_ru, english_name: d.name_en, aliases: [cand.product_name].filter(Boolean),
      category_id: categoryId, subcategory_name: d.subcategory_name || null, manufacturer_id: manufacturerId,
      product_code: d.product_code || null, article: d.product_code || null, material_type: d.material_type || d.subcategory_name || null,
      scope: ['interior', 'architecture', 'both'].indexOf(d.scope) !== -1 ? d.scope : 'both',
      cover_image: gallery[0], image_url: gallery[0], gallery_images: gallery,
      image_source: cand.brand + ' — rasmiy sayt', image_source_url: cand.product_url, image_alt: d.name_uz,
      image_verified: true, image_verified_at: new Date(), image_verification_note: 'AI agent + admin tasdig\'i',
      description: d.description_uz, dimensions_info: d.dimensions_info_uz || '',
      name_uz: d.name_uz, name_ru: d.name_ru, name_en: d.name_en,
      short_description_uz: d.short_description_uz, short_description_ru: d.short_description_ru, short_description_en: d.short_description_en,
      description_uz: d.description_uz, description_ru: d.description_ru, description_en: d.description_en,
      usage_area_uz: d.usage_area_uz, usage_area_ru: d.usage_area_ru, usage_area_en: d.usage_area_en,
      pros_uz: d.pros_uz, pros_ru: d.pros_ru, pros_en: d.pros_en,
      cons_uz: d.cons_uz, cons_ru: d.cons_ru, cons_en: d.cons_en,
      architect_notes_uz: d.architect_notes_uz, architect_notes_ru: d.architect_notes_ru, architect_notes_en: d.architect_notes_en,
      mounting_instructions_uz: d.mounting_instructions_uz, mounting_instructions_ru: d.mounting_instructions_ru, mounting_instructions_en: d.mounting_instructions_en,
      dimensions_info_uz: d.dimensions_info_uz, dimensions_info_ru: d.dimensions_info_ru, dimensions_info_en: d.dimensions_info_en,
      brand: cand.brand, manufacturer: cand.brand, country: d.manufacturer_country || null,
      manufacturer_url: cand.product_url, source_url: cand.product_url, source_name: cand.brand + ' — rasmiy sayt',
      uzb_market_availability: uz.available ? (uz.note_uz || "O'zbekistonda sotuvda mavjud") : null,
      uz_available: uz.available ? true : null, uz_dealer_url: uz.available ? (uz.dealer_url || null) : null,
      ai_generated: true, is_frequent: false,
      status: 'published', verification_status: 'verified', access_type: 'free',
      last_verified_at: new Date(), created_at: new Date(), updated_at: new Date()
    };
    var materialId = await insertDynamic(client, 'materials', row, matCols);

    // Manbalar: rasmiy sahifa (asosiy) + O'zbekiston diler sahifasi
    var srcCols = await tableColumns(client, 'material_sources');
    await insertDynamic(client, 'material_sources', {
      material_id: materialId, source_type: 'official_product_page', title: (cand.brand + ' — ' + (d.name_en || cand.product_name)).slice(0, 250),
      url: cand.product_url, publisher: cand.brand, status: 'verified', is_primary: true, http_status: 200, content_matched: true, sort_order: 1
    }, srcCols);
    if (uz.available && uz.dealer_url) {
      await insertDynamic(client, 'material_sources', {
        material_id: materialId, source_type: 'uz_dealer', title: (uz.dealer_title || "O'zbekistondagi sotuvchi").slice(0, 250),
        url: uz.dealer_url, publisher: uz.dealer_title || null, status: 'verified', is_primary: false, http_status: 200, content_matched: true, sort_order: 2
      }, srcCols);
    }

    // Texnik ko'rsatkichlar (faqat sahifada tasdiqlanganlari)
    var specCols = await tableColumns(client, 'material_specifications');
    for (var i = 0; i < (d.specifications || []).length; i++) {
      var s = d.specifications[i];
      await insertDynamic(client, 'material_specifications', {
        material_id: materialId, parameter: String(s.parameter || s.label_ru || 'param').slice(0, 95),
        parameter_label: String(s.label_uz || s.label_ru || s.parameter || '').slice(0, 250),
        value: String(s.value).slice(0, 250), unit: s.unit ? String(s.unit).slice(0, 45) : null,
        confidence: 1.0, order_index: i + 1
      }, specCols);
    }

    // Tarjimalar jadvali (mavjud admin saqlash logikasi bilan bir xil)
    var langs = [['uz', d.name_uz, d.short_description_uz, d.description_uz], ['ru', d.name_ru, d.short_description_ru, d.description_ru], ['en', d.name_en, d.short_description_en, d.description_en]];
    for (var j = 0; j < langs.length; j++) {
      if (!langs[j][1]) continue;
      await client.query(`
        INSERT INTO material_translations (material_id, language_code, name, short_description, description, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        ON CONFLICT (material_id, language_code) DO UPDATE
        SET name = EXCLUDED.name, short_description = EXCLUDED.short_description, description = EXCLUDED.description, updated_at = NOW()
      `, [materialId, langs[j][0], langs[j][1], langs[j][2] || '', langs[j][3] || '']);
    }

    await client.query(
      "INSERT INTO material_audit_logs (material_id, admin_name, action, details) VALUES ($1, $2, 'ai_agent_publish', $3)",
      [materialId, 'AI agent (admin ' + adminTelegramId + ')', JSON.stringify({ candidate_id: cand.id, product_url: cand.product_url })]
    );

    await client.query(
      "UPDATE material_ai_candidates SET status = 'published', material_id = $2, reviewed_by = $3, reviewed_at = NOW(), updated_at = NOW() WHERE id = $1",
      [cand.id, materialId, adminTelegramId || null]
    );
    await client.query('COMMIT');
    return materialId;
  } catch (e) {
    await client.query('ROLLBACK').catch(function () {});
    throw e;
  } finally {
    client.release();
  }
}

module.exports = {
  migrate: migrate,
  tashkentNow: tashkentNow,
  tashkentDateStr: tashkentDateStr,
  weekStartUtc: weekStartUtc,
  weeklyCount: weeklyCount,
  claimRun: claimRun,
  finishRun: finishRun,
  withLock: withLock,
  listCategories: listCategories,
  pickCategory: pickCategory,
  subcategoriesOf: subcategoriesOf,
  existingNames: existingNames,
  dedupKey: dedupKey,
  isDuplicate: isDuplicate,
  createCandidate: createCandidate,
  updateCandidate: updateCandidate,
  getCandidate: getCandidate,
  transition: transition,
  insertMedia: insertMedia,
  getMedia: getMedia,
  publishCandidate: publishCandidate,
  slugify: slugify
};
