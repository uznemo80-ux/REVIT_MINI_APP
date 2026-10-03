// ======================================================
// YOSHUZBEKK — EQUIPMENT (JIHOZLAR) API MODULE
// ======================================================
// Mavjud server.js arxitekturasi bo'yicha yozilgan:
//   - DB: pg Pool (server.js dagi `pool` parametr sifatida beriladi)
//   - Auth: getOrCreateUser (initData) + requireAdmin (server.js dan olinadi)
//   - Error: { ok:false, error:'...' } (mavjud materials/library patterni)
//   - Route: app.all(...) public, app.post(..., requireAdmin, ...) admin
//   - Query: faqat parameterized ($1,$2) — string concatenation yo'q
//
// Bu modul server.js ga require qilinadi va mount qilinadi:
//   require('./equipmentApi')(app, { pool, requireAdmin, getOrCreateUser, ADMIN_TELEGRAM_ID })
//
// Hech narsa o'zgartirilmaydi — bu yangi, alohida modul.

module.exports = function mountEquipmentApi(app, deps) {
  var pool = deps.pool;
  var requireAdmin = deps.requireAdmin;
  var getOrCreateUser = deps.getOrCreateUser;

  // ======================================================
  // YORDAMCHILAR
  // ======================================================

  function fail(res, code, message, extra) {
    var body = { ok: false, error: message };
    if (code) body.code = code;
    if (extra) for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) body[k] = extra[k];
    return res.status(code && code >= 400 && code < 600 ? code : 400).json(body);
  }

  // Pagination: default 20, max 100 (spesifikatsiya bo'yicha)
  function parsePaging(b) {
    var limit = parseInt(b.limit, 10);
    if (!limit || isNaN(limit) || limit < 1) limit = 20;
    if (limit > 100) limit = 100;
    var page = parseInt(b.page, 10);
    if (!page || isNaN(page) || page < 1) page = 1;
    var offset = (page - 1) * limit;
    return { limit: limit, page: page, offset: offset };
  }

  // Sizning xavfsizlik talabingiz: id/slug validatsiyasi
  function validId(v) {
    var n = parseInt(v, 10);
    return (n && n > 0) ? n : null;
  }
  function validSlug(v) {
    if (!v) return null;
    var s = String(v).trim().toLowerCase();
    return /^[a-z0-9][a-z0-9\-_]{1,180}$/.test(s) ? s : null;
  }

  // version_history jadvali 004 da yo'q (M4 tuzatishi repo ga tushmagan).
  // Migration faylini HECH QACHON tegmasim — API runtime'da idempotent
  // yaratadi. Bu mavjud ensureMatStats() patterni bilan bir xil.
  var eqVerHistReady = null;
  function ensureEquipmentVersionHistory() {
    if (!eqVerHistReady) {
      eqVerHistReady = (async function () {
        try {
          await pool.query(`CREATE TABLE IF NOT EXISTS equipment_version_history (
            id           SERIAL PRIMARY KEY,
            equipment_id INT NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
            changed_by   BIGINT,
            admin_name   VARCHAR(255),
            changes      JSONB NOT NULL,
            created_at   TIMESTAMPTZ DEFAULT NOW())`);
          await pool.query(`CREATE INDEX IF NOT EXISTS idx_eq_verhist_equipment
            ON equipment_version_history(equipment_id, created_at DESC)`);
        } catch (e) {
          console.warn('ensureEquipmentVersionHistory:', e.message);
          eqVerHistReady = null;
        }
      })();
    }
    return eqVerHistReady;
  }

  async function currentUser(req) {
    try { return await getOrCreateUser(req.body && req.body.initData); } catch (e) { return null; }
  }

  // ======================================================
  // PUBLIC: KATEGORIYALAR
  // ======================================================
  // GET/POST /api/equipment/categories
  // Kategoriya + subkategoriya + tur strukturasini qaytaradi.
  // Dynamic filter uchun: har kategoriya o'z filterable parametrlarini oladi.
  app.post('/api/equipment/categories', async function (req, res) {
    try {
      var b = Object.assign({}, req.query, req.body);

      var catRes = await pool.query(
        `SELECT c.id, c.slug, c.name_uz, c.name_ru, c.name_en, c.icon,
                c.description_uz, c.order_index
         FROM equipment_categories c
         WHERE c.is_active = true
         ORDER BY c.order_index, c.name_uz`
      );

      var subRes = await pool.query(
        `SELECT s.id, s.category_id, s.slug, s.name_uz, s.name_ru, s.name_en, s.order_index
         FROM equipment_subtypes s
         WHERE s.is_active = true
         ORDER BY s.category_id, s.order_index, s.name_uz`
      );

      // Dinamik filter ta'riflari — faqat filterable bo'lganlar
      var defRes = await pool.query(
        `SELECT d.id, d.category_id, d.param_key, d.label_uz, d.label_ru,
                d.unit, d.data_type, d.enum_values, d.filterable, d.sort_order
         FROM equipment_parameter_defs d
         WHERE d.filterable = true
         ORDER BY d.sort_order`
      );

      var brandRes = await pool.query(
        `SELECT m.id, m.name, m.slug, m.country FROM equipment_manufacturers m
         WHERE m.is_active = true ORDER BY m.order_index, m.name`
      );

      // Faqat PUBLISHED mahsulotlarda mavjud bo'lgan installation_type
      var instRes = await pool.query(
        `SELECT DISTINCT s.value_text AS value
         FROM equipment_specifications s
         JOIN equipment e ON e.id = s.equipment_id
         WHERE s.param_key = 'install_type'
           AND e.status = 'published'
           AND s.value_text IS NOT NULL
         ORDER BY 1`
      );

      var subByCat = {};
      subRes.rows.forEach(function (s) {
        if (!subByCat[s.category_id]) subByCat[s.category_id] = [];
        subByCat[s.category_id].push({
          id: s.id, slug: s.slug, name_uz: s.name_uz, name_ru: s.name_ru, name_en: s.name_en
        });
      });

      var defsByCat = {};
      defRes.rows.forEach(function (d) {
        var key = d.category_id === null ? '_common' : d.category_id;
        if (!defsByCat[key]) defsByCat[key] = [];
        defsByCat[key].push({
          param_key: d.param_key, label_uz: d.label_uz, label_ru: d.label_ru,
          unit: d.unit, data_type: d.data_type, enum_values: d.enum_values
        });
      });

      var items = catRes.rows.map(function (c) {
        return {
          id: c.id, slug: c.slug,
          name_uz: c.name_uz, name_ru: c.name_ru, name_en: c.name_en,
          icon: c.icon, description_uz: c.description_uz, order_index: c.order_index,
          subcategories: subByCat[c.id] || [],
          // Har kategoriya uchun FAQAT o'sha kategoriyaga tegishli filterlar.
          // Umumiy (category_id IS NULL) parametrlar ham qo'shiladi.
          filters: (defsByCat[c.id] || []).concat(defsByCat._common || [])
        };
      });

      return res.json({
        ok: true,
        categories: items,
        brands: brandRes.rows,
        manufacturers: brandRes.rows,
        installation_types: instRes.rows.map(function (r) { return r.value; }),
        common_filters: defsByCat._common || []
      });
    } catch (e) {
      console.error('EQUIPMENT CATEGORIES ERROR:', e.message);
      return fail(res, 500, 'Kategoriyalarni yuklashda server xatosi');
    }
  });

  // ======================================================
  // PUBLIC: RO'YXAT (list)
  // ======================================================
  // GET/POST /api/equipment
  // Muhim: faqat status='published' qaytariladi.
  app.post('/api/equipment', async function (req, res) {
    try {
      var b = Object.assign({}, req.query, req.body);
      var paging = parsePaging(b);
      var search = String(b.search || '').trim();
      var category = validSlug(b.category);
      var subcategory = validSlug(b.subcategory);
      var type = validSlug(b.type);
      var brand = validSlug(b.brand || b.manufacturer);
      var installationType = String(b.installation_type || '').trim();
      var sort = String(b.sort || 'newest').trim();

      var where = ["e.status = 'published'"];   // draft/pending_review/archived YASHIRIN
      var params = [];
      var i = 1;

      // Xavfsizlik: agar filter qiymati berilgan bo'lsa lekin validatsiyadan
      // o'tmagan bo'lsa — 0 natija qaytaramiz (butun ro'yxatni emas).
      // Aks holda noto'g'ri filter butun katalogni ochib qo'yadi.
      var REJECT_FILTER = false;
      function useFilter(raw, valid) {
        if (!raw) return;
        if (!valid) { REJECT_FILTER = true; return; }
      }
      useFilter(b.category, category);
      useFilter(b.subcategory, subcategory);
      useFilter(b.type, type);
      useFilter(b.brand || b.manufacturer, brand);

      if (REJECT_FILTER) {
        return res.json({ ok: true, items: [], pagination: { page: paging.page, limit: paging.limit, total: 0, total_pages: 0 } });
      }

      if (category) { where.push('c.slug = $' + (i++)); params.push(category); }
      if (subcategory) { where.push('st.slug = $' + (i++)); params.push(subcategory); }
      if (type) { where.push('st.slug = $' + (i++)); params.push(type); }
      if (brand) { where.push('mf.slug = $' + (i++)); params.push(brand); }

      if (installationType) {
        where.push("EXISTS (SELECT 1 FROM equipment_specifications s WHERE s.equipment_id = e.id AND s.param_key = 'install_type' AND s.value_text = $" + (i++) + ")");
        params.push(installationType);
      }

      // Ko'p tilli search: UZ/RU/EN nom, aliases, brand, manufacturer, model, SKU
      // ILIKE — case-insensitive. Aliases = TEXT[] -> EXISTS bilan.
      if (search) {
        var like = '%' + search.toLowerCase() + '%';
        var base = i;
        where.push(`(
          LOWER(COALESCE(e.name_uz,'')) LIKE $${base}
          OR LOWER(COALESCE(e.name_ru,'')) LIKE $${base}
          OR LOWER(COALESCE(e.name_en,'')) LIKE $${base}
          OR LOWER(COALESCE(e.model,''))  LIKE $${base}
          OR LOWER(COALESCE(e.sku,''))    LIKE $${base}
          OR LOWER(COALESCE(e.brand,''))  LIKE $${base}
          OR LOWER(COALESCE(mf.name,''))  LIKE $${base}
          OR LOWER(COALESCE(c.name_uz,'')) LIKE $${base}
          OR LOWER(COALESCE(st.name_uz,'')) LIKE $${base}
          OR LOWER(COALESCE(e.short_desc,'')) LIKE $${base}
          OR EXISTS (SELECT 1 FROM unnest(COALESCE(e.aliases,'{}'::text[])) al WHERE LOWER(al) LIKE $${base})
        )`);
        params.push(like);
        i++;
      }

      // Dinamik parametrlar bo'yicha filter (?f_<param_key>=value)
      for (var key in b) {
        if (key.indexOf('f_') !== 0) continue;
        var pk = key.slice(2);
        if (!/^[a-z0-9_]{1,100}$/.test(pk)) continue;
        var pv = String(b[key] || '').trim();
        if (!pv) continue;
        where.push('EXISTS (SELECT 1 FROM equipment_specifications s WHERE s.equipment_id = e.id AND s.param_key = $' + (i++) + ' AND (s.value_text = $' + i + ' OR s.value_num::text = $' + i + '))');
        params.push(pk);
        var j = i;
        params.push(pv);
        i++;
      }

      var whereSql = where.join(' AND ');

      // Sort — hech qanday foydalanuvchi qiymati to'g'ridan-to'g'ri SQL ga kirmaydi
      var orderSql = 'e.order_index DESC, e.id DESC';
      if (sort === 'name_asc') orderSql = 'e.name_uz ASC';
      else if (sort === 'name_desc') orderSql = 'e.name_uz DESC';
      else if (sort === 'oldest') orderSql = 'e.published_at ASC NULLS LAST, e.id ASC';
      else if (sort === 'newest') orderSql = 'e.published_at DESC NULLS LAST, e.id DESC';

      var countRes = await pool.query(
        `SELECT COUNT(*)::int AS total FROM equipment e
         JOIN equipment_categories c ON c.id = e.category_id
         LEFT JOIN equipment_subtypes st ON st.id = e.subtype_id
         LEFT JOIN equipment_manufacturers mf ON mf.id = e.manufacturer_id
         WHERE ` + whereSql,
        params
      );
      var total = countRes.rows[0].total;

      var rowsRes = await pool.query(
        `SELECT e.id, e.slug, e.name_uz, e.name_ru, e.name_en,
                e.brand, e.model, e.sku,
                e.short_desc, e.cover_image,
                c.slug AS category_slug, c.name_uz AS category_name, c.icon AS category_icon,
                st.slug AS subtype_slug, st.name_uz AS subtype_name,
                mf.name AS manufacturer, mf.slug AS manufacturer_slug,
                d.width_mm, d.height_mm, d.depth_mm, d.weight_kg,
                (SELECT COUNT(*)::int FROM equipment_sources s WHERE s.equipment_id = e.id) AS source_count
         FROM equipment e
         JOIN equipment_categories c ON c.id = e.category_id
         LEFT JOIN equipment_subtypes st ON st.id = e.subtype_id
         LEFT JOIN equipment_manufacturers mf ON mf.id = e.manufacturer_id
         LEFT JOIN equipment_dimensions d ON d.equipment_id = e.id
         WHERE ` + whereSql + `
         ORDER BY ` + orderSql + `
         LIMIT $` + (i++) + ` OFFSET $` + i,
        params.concat([paging.limit, paging.offset])
      );

      return res.json({
        ok: true,
        items: rowsRes.rows,
        pagination: {
          page: paging.page,
          limit: paging.limit,
          total: total,
          total_pages: Math.ceil(total / paging.limit)
        }
      });
    } catch (e) {
      console.error('EQUIPMENT LIST ERROR:', e.message);
      return fail(res, 500, 'Jihozlar ro\'yxatini yuklashda server xatosi');
    }
  });

  // ======================================================
  // LIKE / SAVE — mavjud materials patterni bo'yicha
  // ======================================================
  // DIQQAT: bu blok '/api/equipment/:slug' ROUTE DAN KEYIN joylashtirilgan
  // bo'lishi mumkin. Express route'larni qo'yilish tartibida ishlaydi —
  // agar ':slug' birinchi bo'lsa, '/toggle-like' uning ostiga tushib ketadi.
  // Shuning uchun bu route'lar :slug dan OLDIN bo'lishi SHART.
  async function toggleEquipmentFlag(req, res, table) {
    try {
      var user = await currentUser(req);
      if (!user) return fail(res, 401, 'Avtorizatsiya kerak');
      var eid = validId(req.body && req.body.id);
      if (!eid) return fail(res, 400, 'Jihoz ID kerak');

      if (isNaN(parseInt(req.body && req.body.id, 10))) return fail(res, 400, 'Jihoz ID kerak');
      // Faqat PUBLISHED jihozga like/save — draft ko'rinmasin
      var chk = await pool.query("SELECT 1 FROM equipment WHERE id = $1 AND status = 'published'", [eid]);
      if (chk.rows.length === 0) return fail(res, 404, 'Jihoz topilmadi');

      // Jadvallar nomi — boshqa hech narsa emas
      var ex = await pool.query(
        'SELECT 1 FROM ' + table + ' WHERE user_id = $1 AND equipment_id = $2',
        [user.id, eid]
      );
      var on;
      if (ex.rows.length) {
        await pool.query('DELETE FROM ' + table + ' WHERE user_id = $1 AND equipment_id = $2', [user.id, eid]);
        on = false;
      } else {
        await pool.query(
          'INSERT INTO ' + table + ' (user_id, equipment_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [user.id, eid]
        );
        on = true;
      }
      var c = await pool.query('SELECT COUNT(*)::int AS c FROM ' + table + ' WHERE equipment_id = $1', [eid]);
      return res.json({ ok: true, active: on, count: c.rows[0].c });
    } catch (e) {
      console.error('EQUIPMENT TOGGLE ERROR:', e.message);
      return fail(res, 500, 'Saqlashda xatolik');
    }
  }

  app.post('/api/equipment/toggle-like', function (req, res) { return toggleEquipmentFlag(req, res, 'equipment_likes'); });
  app.post('/api/equipment/toggle-save', function (req, res) { return toggleEquipmentFlag(req, res, 'equipment_saves'); });

  // GET/POST /api/equipment/my-state — frontend bitta so'rovda oladi
  app.post('/api/equipment/my-state', async function (req, res) {
    try {
      var user = await currentUser(req);
      if (!user) return res.json({ ok: true, liked_ids: [], saved_ids: [] });
      var l = await pool.query('SELECT equipment_id FROM equipment_likes WHERE user_id = $1', [user.id]);
      var sv = await pool.query('SELECT equipment_id FROM equipment_saves WHERE user_id = $1', [user.id]);
      return res.json({
        ok: true,
        liked_ids: l.rows.map(function (r) { return r.equipment_id; }),
        saved_ids: sv.rows.map(function (r) { return r.equipment_id; })
      });
    } catch (e) {
      return res.json({ ok: true, liked_ids: [], saved_ids: [] });
    }
  });

  // GET/POST /api/equipment/saved — "Saqlangan jihozlar" (profil uchun)
  app.post('/api/equipment/saved', async function (req, res) {
    try {
      var user = await currentUser(req);
      if (!user) return fail(res, 401, 'Avtorizatsiya kerak');
      var b = Object.assign({}, req.query, req.body);
      var paging = parsePaging(b);
      var rows = await pool.query(
        `SELECT e.id, e.slug, e.name_uz, e.name_ru, e.name_en, e.brand, e.model,
                e.cover_image, c.slug AS category_slug, c.icon AS category_icon
         FROM equipment_saves s
         JOIN equipment e ON e.id = s.equipment_id
         JOIN equipment_categories c ON c.id = e.category_id
         WHERE s.user_id = $1 AND e.status = 'published'
         ORDER BY s.created_at DESC
         LIMIT $2 OFFSET $3`,
        [user.id, paging.limit, paging.offset]
      );
      var cnt = await pool.query(
        `SELECT COUNT(*)::int AS total FROM equipment_saves s
         JOIN equipment e ON e.id = s.equipment_id
         WHERE s.user_id = $1 AND e.status = 'published'`,
        [user.id]
      );
      return res.json({
        ok: true, items: rows.rows,
        pagination: { page: paging.page, limit: paging.limit,
                      total: cnt.rows[0].total, total_pages: Math.ceil(cnt.rows[0].total / paging.limit) }
      });
    } catch (e) {
      console.error('EQUIPMENT SAVED ERROR:', e.message);
      return fail(res, 500, 'Saqlangan jihozlarni yuklashda server xatosi');
    }
  });

  // ======================================================
  // ADMIN
  // ======================================================

  app.post('/api/admin/equipment/list', requireAdmin, async function (req, res) {
    try {
      var b = Object.assign({}, req.query, req.body);
      var paging = parsePaging(b);
      var status = String(b.status || 'all').trim();
      var search = String(b.search || '').trim();
      var where = ['1=1'];
      var params = [];
      var i = 1;
      if (status !== 'all') { where.push('e.status = $' + (i++)); params.push(status); }
      if (search) {
        var like = '%' + search.toLowerCase() + '%';
        where.push("(LOWER(COALESCE(e.name_uz,'')) LIKE $" + i + " OR LOWER(COALESCE(e.model,'')) LIKE $" + i + ")");
        params.push(like); i++;
      }
      var w = where.join(' AND ');
      var cnt = await pool.query('SELECT COUNT(*)::int AS total FROM equipment e WHERE ' + w, params);
      var rows = await pool.query(
        `SELECT e.id, e.slug, e.name_uz, e.name_ru, e.name_en, e.brand, e.model, e.sku,
                e.status, e.verification_status, e.cover_image, e.published_at, e.created_at, e.updated_at,
                c.slug AS category_slug, c.name_uz AS category_name,
                mf.name AS manufacturer,
                (SELECT COUNT(*)::int FROM equipment_sources s WHERE s.equipment_id = e.id) AS source_count,
                (SELECT COUNT(*)::int FROM equipment_images i WHERE i.equipment_id = e.id) AS image_count
         FROM equipment e
         JOIN equipment_categories c ON c.id = e.category_id
         LEFT JOIN equipment_manufacturers mf ON mf.id = e.manufacturer_id
         WHERE ` + w + `
         ORDER BY e.updated_at DESC, e.id DESC
         LIMIT $` + i + ' OFFSET $' + (i + 1),
        params.concat([paging.limit, paging.offset])
      );
      return res.json({
        ok: true, items: rows.rows,
        pagination: { page: paging.page, limit: paging.limit,
                      total: cnt.rows[0].total, total_pages: Math.ceil(cnt.rows[0].total / paging.limit) }
      });
    } catch (e) {
      console.error('ADMIN EQUIPMENT LIST ERROR:', e.message);
      return fail(res, 500, 'Admin ro\'yxatida server xatosi');
    }
  });

  app.post('/api/admin/equipment/stats', requireAdmin, async function (req, res) {
    try {
      var r = await pool.query(
        `SELECT e.status, e.verification_status, COUNT(*)::int AS n
         FROM equipment e GROUP BY 1,2 ORDER BY 1,2`
      );
      var img = await pool.query(
        `SELECT COUNT(*)::int AS images,
                COUNT(*) FILTER (WHERE s.verified AND s.manufacturer_source)::int AS verified_images
         FROM equipment_images i JOIN equipment_sources s ON s.id = i.source_id`
      );
      var cat = await pool.query(
        `SELECT c.slug, c.name_uz, COUNT(e.id)::int AS n
         FROM equipment_categories c LEFT JOIN equipment e ON e.category_id = c.id
         GROUP BY c.slug, c.name_uz, c.order_index ORDER BY c.order_index`
      );
      return res.json({ ok: true, by_status: r.rows, images: img.rows[0], by_category: cat.rows });
    } catch (e) {
      console.error('ADMIN EQUIPMENT STATS ERROR:', e.message);
      return fail(res, 500, 'Statistikada server xatosi');
    }
  });

  // Validation layer: published qilishdan oldin tekshiriladi
  async function validateForPublish(id) {
    var miss = [];
    var r = await pool.query(
      `SELECT e.name_uz, e.name_ru, e.description_uz, e.short_desc, e.cover_image, e.model
       FROM equipment e WHERE e.id = $1`, [id]
    );
    if (r.rows.length === 0) return { error: 'NOT_FOUND' };
    var e = r.rows[0];
    if (!e.name_uz) miss.push("O'zbekcha nom");
    if (!e.name_ru) miss.push('Ruscha nom');
    if (!e.short_desc && !e.description_uz) miss.push('Tavsif');
    if (!e.model) miss.push('Model');

    var s = await pool.query(
      'SELECT COUNT(*)::int AS c FROM equipment_sources WHERE equipment_id = $1 AND manufacturer_source AND verified',
      [id]
    );
    if ((s.rows[0].c || 0) === 0) miss.push('Kamida 1 ta tekshirilgan rasmiy manba');

    var d = await pool.query('SELECT COUNT(*)::int AS c FROM equipment_dimensions WHERE equipment_id = $1', [id]);
    if ((d.rows[0].c || 0) === 0) miss.push("O'lchamlar");

    return { missing: miss };
  }

  app.post('/api/admin/equipment/validate-publish', requireAdmin, async function (req, res) {
    try {
      var id = validId(req.body.id);
      if (!id) return fail(res, 400, 'ID kerak');
      var v = await validateForPublish(id);
      if (v.error === 'NOT_FOUND') return fail(res, 404, 'Jihoz topilmadi');
      return res.json({ ok: true, missing: v.missing, ready: v.missing.length === 0 });
    } catch (e) {
      return fail(res, 500, 'Tekshiruvda server xatosi');
    }
  });

  // Create / Update
  app.post('/api/admin/equipment/save', requireAdmin, async function (req, res) {
    try {
      await ensureEquipmentVersionHistory();
      var b = req.body || {};
      var id = validId(b.id);
      var adminUser = req.user || {};
      var adminName = (req.admin && (req.admin.first_name || req.admin.name)) || adminUser.first_name || 'Admin';

      // Slug — validatsiya + uniqueness.
      // UPDATE da slug ixtiyoriy (o'zgartirmaslik mumkin);
      // CREATE da majburiy.
      var slug = validSlug(b.slug);
      if (b.slug !== undefined && b.slug !== null && String(b.slug).trim() && !slug) {
        return fail(res, 400, 'Noto\'g\'ri slug');
      }
      if (!id && !slug) return fail(res, 400, 'Slug majburiy');

      var cat = validSlug(b.category_slug);
      var sub = validSlug(b.subtype_slug);

      var catRes = cat ? await pool.query('SELECT id FROM equipment_categories WHERE slug = $1', [cat]) : { rows: [] };
      if (cat && catRes.rows.length === 0) return fail(res, 400, 'Kategoriya topilmadi');
      var subRes = sub ? await pool.query('SELECT id, category_id FROM equipment_subtypes WHERE slug = $1', [sub]) : { rows: [] };
      if (sub && subRes.rows.length === 0) return fail(res, 400, 'Subkategoriya topilmadi');

      var fields = [
        'slug', 'name_uz', 'name_ru', 'name_en', 'short_desc',
        'description_uz', 'description_ru', 'description_en', 'usage_note_uz',
        'model', 'sku', 'brand', 'cover_image', 'order_index'
      ];

      if (id) {
        // --- UPDATE: avval eski qiymatni olamiz (version_history uchun) ---
        var oldRes = await pool.query(
          'SELECT ' + fields.join(', ') + ' FROM equipment WHERE id = $1', [id]
        );
        if (oldRes.rows.length === 0) return fail(res, 404, 'Jihoz topilmadi', { code: 'EQUIPMENT_NOT_FOUND' });
        var old = oldRes.rows[0];

        var sets = [], params2 = [], k = 1;
        fields.forEach(function (f) {
          if (b[f] !== undefined) { sets.push(f + ' = $' + (k++)); params2.push(b[f]); }
        });
        if (catRes.rows.length) { sets.push('category_id = $' + (k++)); params2.push(catRes.rows[0].id); }
        if (subRes.rows.length) { sets.push('subtype_id = $' + (k++)); params2.push(subRes.rows[0].id); }
        if (b.manufacturer_id !== undefined) { sets.push('manufacturer_id = $' + (k++)); params2.push(validId(b.manufacturer_id)); }
        if (b.advantages !== undefined) { sets.push('advantages = $' + (k++)); params2.push(b.advantages); }
        if (b.limitations !== undefined) { sets.push('limitations = $' + (k++)); params2.push(b.limitations); }
        if (b.aliases !== undefined) { sets.push('aliases = $' + (k++)); params2.push(b.aliases); }
        if (b.gallery !== undefined) { sets.push('gallery = $' + (k++)); params2.push(JSON.stringify(b.gallery)); }
        sets.push('updated_at = NOW()');
        params2.push(id);

        await pool.query('UPDATE equipment SET ' + sets.join(', ') + ' WHERE id = $' + k, params2);

        // --- VERSION HISTORY ---
        // Faqat o'zgargan maydonlar. Sensitive ma'lumot (token/secret)
        // bu ro'yxatga hech qachon kirmaydi — quyidagi fields ro'yxati
        // oq safga faqat ommaviy katalog maydonlarini qabul qiladi.
        var changes = {};
        fields.forEach(function (f) {
          if (b[f] === undefined) return;
          var ov = old[f] === null ? '' : String(old[f]);
          var nv = b[f] === null ? '' : String(b[f]);
          if (ov !== nv) changes[f] = { old: ov, new: nv };
        });
        if (Object.keys(changes).length > 0) {
          await pool.query(
            `INSERT INTO equipment_version_history (equipment_id, changed_by, admin_name, changes)
             VALUES ($1, $2, $3, $4)`,
            [id, adminUser.id || null, adminName, JSON.stringify(changes)]
          );
        }

        return res.json({ ok: true, id: id, message: 'Jihoz yangilandi', changes_recorded: Object.keys(changes).length });
      }

      // --- CREATE ---
      if (!catRes.rows.length) return fail(res, 400, 'Kategoriya majburiy');
      if (!b.name_uz) return fail(res, 400, "O'zbekcha nom majburiy");

      var cols = [], vals = [], m = 1;
      function add(col, val) { cols.push(col); vals.push(val); m++; }
      add('slug', slug);
      add('name_uz', b.name_uz || null);
      add('name_ru', b.name_ru || null);
      add('name_en', b.name_en || null);
      add('category_id', catRes.rows[0].id);
      if (subRes.rows.length) add('subtype_id', subRes.rows[0].id);
      if (validId(b.manufacturer_id)) add('manufacturer_id', validId(b.manufacturer_id));
      add('model', b.model || null);
      add('sku', b.sku || null);
      add('brand', b.brand || null);
      add('short_desc', b.short_desc || null);
      add('description_uz', b.description_uz || null);
      add('description_ru', b.description_ru || null);
      add('description_en', b.description_en || null);
      add('usage_note_uz', b.usage_note_uz || null);
      add('cover_image', b.cover_image || null);
      // Default — har yangi jihoz DRAFT bilan yaratiladi
      add('status', 'draft');
      add('verification_status', 'pending');
      if (b.advantages) add('advantages', b.advantages);
      if (b.limitations) add('limitations', b.limitations);
      if (b.aliases) add('aliases', b.aliases);
      if (b.gallery) add('gallery', JSON.stringify(b.gallery));
      if (b.order_index !== undefined) add('order_index', parseInt(b.order_index, 10) || 0);

      var ph = [];
      for (var p = 1; p < m; p++) ph.push('$' + p);
      var ins = await pool.query(
        'INSERT INTO equipment (' + cols.join(', ') + ') VALUES (' + ph.join(', ') + ') RETURNING id',
        vals
      );
      return res.json({ ok: true, id: ins.rows[0].id, message: 'Jihoz yaratildi (draft)' });
    } catch (e) {
      if (e.code === '23505') return fail(res, 409, 'Bu slug band qilingan');
      console.error('ADMIN EQUIPMENT SAVE ERROR:', e.message);
      return fail(res, 500, 'Saqlashda server xatosi');
    }
  });

  // Status + verification
  app.post('/api/admin/equipment/status', requireAdmin, async function (req, res) {
    try {
      var b = req.body || {};
      var id = validId(b.id);
      if (!id) return fail(res, 400, 'ID kerak');
      var status = String(b.status || '').trim();
      var vstatus = String(b.verification_status || '').trim();
      var reviewNotes = b.review_notes !== undefined && b.review_notes !== null
        ? String(b.review_notes).trim() : null;

      var ALLOWED_STATUS = ['draft', 'pending_review', 'published', 'archived'];
      var ALLOWED_VERIF = ['pending', 'verified', 'failed'];
      if (status && ALLOWED_STATUS.indexOf(status) === -1) return fail(res, 400, "Noma'lum status: " + status);
      if (vstatus && ALLOWED_VERIF.indexOf(vstatus) === -1) return fail(res, 400, "Noma'lum verification: " + vstatus);

      var prev = await pool.query('SELECT status, verification_status FROM equipment WHERE id = $1', [id]);
      if (prev.rows.length === 0) return fail(res, 404, 'Jihoz topilmadi');

      // Pre-publish validation
      if (status === 'published') {
        var v = await validateForPublish(id);
        if (v.error === 'NOT_FOUND') return fail(res, 404, 'Jihoz topilmadi');
        if (v.missing.length > 0) {
          return fail(res, 400, 'Nashr qilish bloklandi: ' + v.missing.join(', '));
        }
      }

      var sets = [], params = [], p = 1;
      if (status) {
        sets.push('status = $' + (p++)); params.push(status);
        if (status === 'published') sets.push('published_at = NOW()');
      }
      if (vstatus) { sets.push('verification_status = $' + (p++)); params.push(vstatus); }
      if (reviewNotes !== null) { sets.push('review_notes = $' + (p++)); params.push(reviewNotes); }
      sets.push('updated_at = NOW()');
      params.push(id);

      await pool.query('UPDATE equipment SET ' + sets.join(', ') + ' WHERE id = $' + p, params);

      // Audit log
      await pool.query(
        `INSERT INTO equipment_audit_logs (equipment_id, admin_id, admin_name, action, details)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, (req.user && req.user.id) || null,
         (req.admin && req.admin.first_name) || 'Admin', 'status_change',
         JSON.stringify({ from: prev.rows[0].status, to: status,
                          verification_from: prev.rows[0].verification_status, verification_to: vstatus,
                          review_notes: reviewNotes })]
      );

      return res.json({ ok: true, message: 'Holat yangilandi' });
    } catch (e) {
      console.error('ADMIN EQUIPMENT STATUS ERROR:', e.message);
      return fail(res, 500, 'Holatni yangilashda server xatosi');
    }
  });

  // Archive — destructive DELETE emas
  app.post('/api/admin/equipment/archive', requireAdmin, async function (req, res) {
    try {
      var id = validId(req.body && req.body.id);
      if (!id) return fail(res, 400, 'ID kerak');
      var r = await pool.query('UPDATE equipment SET status = $1, updated_at = NOW() WHERE id = $2', ['archived', id]);
      if (r.rowCount === 0) return fail(res, 404, 'Jihoz topilmadi');
      await pool.query(
        `INSERT INTO equipment_audit_logs (equipment_id, admin_id, admin_name, action, details)
         VALUES ($1,$2,$3,'archive','{}')`,
        [id, (req.user && req.user.id) || null, (req.admin && req.admin.first_name) || 'Admin']
      );
      return res.json({ ok: true, message: 'Arxivlandi' });
    } catch (e) {
      console.error('ADMIN EQUIPMENT ARCHIVE ERROR:', e.message);
      return fail(res, 500, 'Arxivlashda server xatosi');
    }
  });

  // Version history — read
  app.post('/api/admin/equipment/history', requireAdmin, async function (req, res) {
    try {
      await ensureEquipmentVersionHistory();
      var id = validId(req.body && req.body.id);
      if (!id) return fail(res, 400, 'ID kerak');
      var r = await pool.query(
        `SELECT id, admin_name, changes, created_at
         FROM equipment_version_history WHERE equipment_id = $1
         ORDER BY created_at DESC, id DESC LIMIT 100`, [id]
      );
      return res.json({ ok: true, items: r.rows });
    } catch (e) {
      return fail(res, 500, 'Tarixni yuklashda server xatosi');
    }
  });

  // Categories / manufacturers — admin boshqaruvi
  app.post('/api/admin/equipment/category/save', requireAdmin, async function (req, res) {
    try {
      var b = req.body || {};
      var slug = validSlug(b.slug);
      if (!slug) return fail(res, 400, "Noto'g'ri slug");
      if (!b.name_uz) return fail(res, 400, "O'zbekcha nom majburiy");
      var r = await pool.query(
        `INSERT INTO equipment_categories (slug, name_uz, name_ru, name_en, icon, description_uz, order_index)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (slug) DO UPDATE SET
           name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru,
           name_en = EXCLUDED.name_en, icon = EXCLUDED.icon,
           description_uz = EXCLUDED.description_uz, order_index = EXCLUDED.order_index
         RETURNING id`,
        [slug, b.name_uz, b.name_ru || null, b.name_en || null,
         b.icon || null, b.description_uz || null, parseInt(b.order_index, 10) || 0]
      );
      return res.json({ ok: true, id: r.rows[0].id, message: 'Kategoriya saqlandi' });
    } catch (e) {
      return fail(res, 500, 'Kategoriya saqlashda server xatosi');
    }
  });

  app.post('/api/admin/equipment/subtype/save', requireAdmin, async function (req, res) {
    try {
      var b = req.body || {};
      var slug = validSlug(b.slug);
      if (!slug) return fail(res, 400, "Noto'g'ri slug");
      if (!b.name_uz) return fail(res, 400, "O'zbekcha nom majburiy");
      var catId = validId(b.category_id);
      if (!catId) return fail(res, 400, 'category_id kerak');
      var r = await pool.query(
        `INSERT INTO equipment_subtypes (category_id, slug, name_uz, name_ru, name_en, order_index)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (slug) DO UPDATE SET
           category_id = EXCLUDED.category_id, name_uz = EXCLUDED.name_uz,
           name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en,
           order_index = EXCLUDED.order_index
         RETURNING id`,
        [catId, slug, b.name_uz, b.name_ru || null, b.name_en || null, parseInt(b.order_index, 10) || 0]
      );
      return res.json({ ok: true, id: r.rows[0].id, message: 'Subkategoriya saqlandi' });
    } catch (e) {
      return fail(res, 500, 'Subkategoriya saqlashda server xatosi');
    }
  });

  app.post('/api/admin/equipment/manufacturer/save', requireAdmin, async function (req, res) {
    try {
      var b = req.body || {};
      var slug = validSlug(b.slug);
      if (!slug) return fail(res, 400, "Noto'g'ri slug");
      if (!b.name) return fail(res, 400, 'Nomi majburiy');
      var r = await pool.query(
        `INSERT INTO equipment_manufacturers (name, slug, country, website, support_url, order_index)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (slug) DO UPDATE SET
           name = EXCLUDED.name, country = EXCLUDED.country,
           website = EXCLUDED.website, support_url = EXCLUDED.support_url,
           order_index = EXCLUDED.order_index
         RETURNING id`,
        [b.name, slug, b.country || null, b.website || null, b.support_url || null,
         parseInt(b.order_index, 10) || 0]
      );
      return res.json({ ok: true, id: r.rows[0].id, message: 'Ishlab chiqaruvchi saqlandi' });
    } catch (e) {
      return fail(res, 500, 'Ishlab chiqaruvchi saqlashda server xatosi');
    }
  });

  // ======================================================
  // PUBLIC: DETAIL
  // ======================================================
  // GET/POST /api/equipment/:slug
  //
  // DIQQAT: bu route :slug — '/api/equipment/toggle-like' kabi aniq
  // path'larni SHADOW qilishi mumkin. Aniq path'lar yuqorida
  // (/toggle-like, /toggle-save, /my-state, /saved) allaqon ro'yxatga
  // olingan va Express ularni BIRINCHI bo'lib qaytaradi.
  // Quyidagi RESERVED tekshiruv esa ikkinchi qatlam himoyasi.
  app.post('/api/equipment/:slug', async function (req, res) {
    try {
      // Muhim: '/api/equipment/toggle-like', '/api/equipment/my-state',
      // '/api/equipment/saved' — bular ham :slug ostiga tushib ketishi mumkin.
      // Aniq path'larni oldindan chiqarib yuboramiz.
      var RESERVED = ['toggle-like', 'toggle-save', 'my-state', 'saved'];
      var rawSlug = String(req.params.slug || '').toLowerCase();
      if (RESERVED.indexOf(rawSlug) !== -1) {
        return fail(res, 404, 'Jihoz topilmadi', { code: 'EQUIPMENT_NOT_FOUND' });
      }
      var slug = validSlug(rawSlug);
      if (!slug) return fail(res, 400, 'Noto\'g\'ri slug');

      // Muhim: draft/pending_review/archived PUBLIC dan chiqmaydi
      var base = await pool.query(
        `SELECT e.*, c.slug AS category_slug, c.name_uz AS category_name, c.name_ru AS category_name_ru,
                c.icon AS category_icon,
                st.slug AS subtype_slug, st.name_uz AS subtype_name, st.name_ru AS subtype_name_ru,
                mf.id AS manufacturer_id_ref, mf.name AS manufacturer, mf.slug AS manufacturer_slug,
                mf.country AS manufacturer_country
         FROM equipment e
         JOIN equipment_categories c ON c.id = e.category_id
         LEFT JOIN equipment_subtypes st ON st.id = e.subtype_id
         LEFT JOIN equipment_manufacturers mf ON mf.id = e.manufacturer_id
         WHERE e.slug = $1 AND e.status = 'published'`,
        [slug]
      );
      if (base.rows.length === 0) {
        return fail(res, 404, 'Jihoz topilmadi', { code: 'EQUIPMENT_NOT_FOUND' });
      }
      var e = base.rows[0];

      // --- Dynamic specifications ---
      // equipment_parameter_defs + equipment_specifications birlashuvi.
      // Hardcode qilingan universal table YO'Q. Missing value = NULL ->
      // frontend "NOT_SPECIFIED_BY_MANUFACTURER" ko'rsatadi.
      var specRes = await pool.query(
        `SELECT s.param_key, s.value_text, s.value_num, s.unit,
                COALESCE(dcat.label_uz, dcom.label_uz) AS label_uz,
                COALESCE(dcat.label_ru, dcom.label_ru) AS label_ru,
                COALESCE(dcat.data_type, dcom.data_type) AS data_type
         FROM equipment_specifications s
         LEFT JOIN equipment_parameter_defs dcat
                ON dcat.param_key = s.param_key AND dcat.category_id = $2
         LEFT JOIN equipment_parameter_defs dcom
                ON dcom.param_key = s.param_key AND dcom.category_id IS NULL
         WHERE s.equipment_id = $1
         ORDER BY s.param_key`,
        [e.id, e.category_id]
      );

      // Xuddi shu param_key uchun bir nechta def bo'lsa (umumiy + kategoriya),
      // bittasini tanlaymiz. Oddiy aggregate bilan xavfsizlashtiramiz.
      var specMap = {};
      specRes.rows.forEach(function (r) {
        if (specMap[r.param_key]) return;
        specMap[r.param_key] = {
          key: r.param_key,
          label_uz: r.label_uz,
          label_ru: r.label_ru,
          data_type: r.data_type,
          unit: r.unit,
          value: r.value_num !== null && r.value_num !== undefined ? Number(r.value_num) : (r.value_text || null)
        };
      });
      var specifications = Object.keys(specMap).map(function (k) { return specMap[k]; });
      specifications.sort(function (a, b) {
        return String(a.label_uz || a.key).localeCompare(String(b.label_uz || b.key));
      });

      // --- Dimensions + clearances ---
      var dimRes = await pool.query(
        `SELECT d.width_mm, d.height_mm, d.depth_mm, d.diameter_mm, d.weight_kg,
                d.unit_note, d.service_clearance
         FROM equipment_dimensions d WHERE d.equipment_id = $1`,
        [e.id]
      );
      var dim = dimRes.rows[0] || null;

      // --- Minimum clearances (faqat rasmiy JSONB qiymatlar) ---
      var instRes = await pool.query(
        `SELECT i.mount_type, i.location_note, i.min_clearance, i.service_space,
                i.door_swing, i.access_note
         FROM equipment_installations i WHERE i.equipment_id = $1`,
        [e.id]
      );
      var inst = instRes.rows[0] || null;

      // --- Connections ---
      var connRes = await pool.query(
        `SELECT conn_type, spec_detail, diameter_mm, location, height_mm, min_distance, notes
         FROM equipment_connections WHERE equipment_id = $1 ORDER BY id`,
        [e.id]
      );

      // --- Applications ("Qayerda ishlatiladi") ---
      var appRes = await pool.query(
        `SELECT room_type, room_type_ru, note FROM equipment_applications
         WHERE equipment_id = $1 ORDER BY id`,
        [e.id]
      );

      // --- Engineering notes ("Loyihalashda e'tibor berish") ---
      var noteRes = await pool.query(
        `SELECT note_uz, note_ru, category, sort_order
         FROM engineering_notes WHERE equipment_id = $1 ORDER BY sort_order, id`,
        [e.id]
      );

      // --- Sources (rasmiy manba) ---
      var srcRes = await pool.query(
        `SELECT id, source_url, source_type, source_title, publisher, source_date,
                manufacturer_source, verified
         FROM equipment_sources WHERE equipment_id = $1
         ORDER BY manufacturer_source DESC, verified DESC, id`,
        [e.id]
      );

      // --- Documents ---
      var docRes = await pool.query(
        `SELECT id, doc_type, title, url, file_format, verified
         FROM equipment_documents WHERE equipment_id = $1 ORDER BY id`,
        [e.id]
      );

      // --- Images: FAQAT verified + rasmiy ishlab chiqaruvchi manbasi ---
      var imgRes = await pool.query(
        `SELECT i.id, i.image_type, i.url, i.alt_text, i.source_id,
                s.manufacturer_source, s.verified AS source_verified, s.source_type
         FROM equipment_images i
         JOIN equipment_sources s ON s.id = i.source_id
         WHERE i.equipment_id = $1
           AND s.verified = true
           AND s.manufacturer_source = true
         ORDER BY i.image_type, i.sort_order, i.id`,
        [e.id]
      );

      return res.json({
        ok: true,
        item: {
          id: e.id, slug: e.slug,
          name_uz: e.name_uz, name_ru: e.name_ru, name_en: e.name_en,
          aliases: e.aliases || [],
          brand: e.brand, model: e.model, sku: e.sku,
          category: { slug: e.category_slug, name_uz: e.category_name,
                      name_ru: e.category_name_ru, icon: e.category_icon },
          subtype: e.subtype_slug ? { slug: e.subtype_slug, name_uz: e.subtype_name,
                                       name_ru: e.subtype_name_ru } : null,
          manufacturer: e.manufacturer ? { name: e.manufacturer, slug: e.manufacturer_slug,
                                           country: e.manufacturer_country } : null,
          short_desc: e.short_desc,
          description_uz: e.description_uz,
          description_ru: e.description_ru,
          description_en: e.description_en,
          purpose: e.usage_note_uz,
          advantages: e.advantages || [],
          limitations: e.limitations || [],
          dimensions: dim ? {
            width_mm: dim.width_mm, height_mm: dim.height_mm,
            depth_mm: dim.depth_mm, diameter_mm: dim.diameter_mm,
            weight_kg: dim.weight_kg === null ? null : Number(dim.weight_kg),
            unit_note: dim.unit_note
          } : null,
          specifications: specifications,
          connections: connRes.rows,
          installation: inst ? {
            mount_type: inst.mount_type,
            location_note: inst.location_note,
            min_clearance: inst.min_clearance,     // faqat RASMIY qiymatlar
            service_space: inst.service_space,
            door_swing: inst.door_swing,
            access_note: inst.access_note
          } : null,
          applications: appRes.rows,
          engineering_notes: noteRes.rows,
          documents: docRes.rows,
          sources: srcRes.rows,
          images: imgRes.rows.map(function (r) {
            return {
              id: r.id, image_type: r.image_type, url: r.url, alt: r.alt_text,
              source_id: r.source_id, source_type: r.source_type,
              verified: r.source_verified, manufacturer_source: r.manufacturer_source
            };
          }),
          gallery: e.gallery || [],
          cover_image: e.cover_image,
          // Xavfsiz status maydonlari (review_notes ICHIDA QOLMAYDI)
          status: e.status,
          verification_status: e.verification_status,
          published_at: e.published_at
        }
      });
    } catch (e) {
      console.error('EQUIPMENT DETAIL ERROR:', e.message);
      return fail(res, 500, 'Jihoz ma\'lumotlarini yuklashda server xatosi');
    }
  });

  console.log('  [OK] Equipment API yuklandi (/api/equipment/*, /api/admin/equipment/*)');
};
