// ======================================================
// YOSHUZBEKK Academy — Normatives & Practical Solutions
// Schema, Database Migrations, Seeding & API Service
// ======================================================

// Tekshirilgan hujjatlar va yo'riqnomalar alohida fayllarda (har bir raqam lex.uz dagi rasmiy matn bilan solishtirilgan)
const { VERIFIED_NORMATIVES, NORMATIVE_RENAMES, applyTopicVerification } = require('./normativesVerified');
const { SEED_PRACTICAL_CASES } = require('./normativeCasesData');
const SEED_NORMATIVES = VERIFIED_NORMATIVES;

// ======================================================
// DATABASE INITIALIZATION & ROBUST UPSERT SEED
// ======================================================

// Seed xatolari (oxirgi 20 tasi) — /api/normatives/diagnostic orqali ko'rinadi
const seedErrors = [];
function noteSeedError(where, err) {
  seedErrors.push({ where, error: String(err && err.message || err).slice(0, 300), at: new Date().toISOString() });
  if (seedErrors.length > 20) seedErrors.shift();
}
function getNormativeSeedErrors() { return seedErrors.slice(); }

// To'liq upsert yiqilganda: faqat har qanday sxemada mavjud asosiy ustunlar bilan yangilash/qo'shish
async function seedDocCoreFallback(pool, item) {
  const vals = [
    item.document_number, item.title, item.status || 'AMALDA',
    item.official_source_url || null, item.pdf_url || null,
    item.adopted_date || null, item.effective_date || null, item.repealed_date || null,
    item.issuing_authority || null, item.description || null
  ];
  const upd = await pool.query(`
    UPDATE normative_documents SET
      title = $2::text, status = $3::text, official_source_url = $4::text, pdf_url = $5::text,
      adopted_date = $6::date, effective_date = $7::date, repealed_date = $8::date,
      issuing_authority = $9::text, description = COALESCE($10::text, description),
      last_verified_at = NOW(), updated_at = NOW()
    WHERE document_number = $1::text AND is_admin_edited IS NOT TRUE
  `, vals);
  if (upd.rowCount > 0) return 'updated';
  const ins = await pool.query(`
    INSERT INTO normative_documents (
      document_number, title, status, official_source_url, pdf_url,
      adopted_date, effective_date, repealed_date, issuing_authority, description,
      document_type, category, is_system_seed, last_verified_at
    )
    SELECT $1::text, $2::text, $3::text, $4::text, $5::text, $6::date, $7::date, $8::date, $9::text, $10::text, $11::text, $12::text, true, NOW()
    WHERE NOT EXISTS (SELECT 1 FROM normative_documents WHERE document_number = $1::text)
  `, vals.concat([item.document_type || 'SHNQ', item.category || 'Loyihalash']));
  return ins.rowCount > 0 ? 'inserted' : 'skipped';
}

async function initNormativesTables(pool) {
  if (!pool) return;
  try {
    // 1. Create normative_documents table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS normative_documents (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        document_number VARCHAR(100) NOT NULL,
        document_type VARCHAR(50) NOT NULL DEFAULT 'SHNQ',
        category VARCHAR(100) NOT NULL DEFAULT 'Loyihalash',
        description TEXT,
        requirements TEXT,
        target_audience VARCHAR(255),
        application_scope TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'AMALDA',
        adopted_date DATE,
        effective_date DATE,
        repealed_date DATE,
        issuing_authority VARCHAR(255),
        official_source_url TEXT,
        pdf_url TEXT,
        old_edition_note TEXT,
        new_edition_note TEXT,
        change_date DATE,
        supersedes_document_id INT,
        replaced_by_document_id INT,
        tags TEXT[] DEFAULT '{}',
        view_count INT DEFAULT 0,
        last_verified_at TIMESTAMPTZ DEFAULT NOW(),
        is_system_seed BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_normative_docs_cat ON normative_documents(category);
      CREATE INDEX IF NOT EXISTS idx_normative_docs_type ON normative_documents(document_type);
      CREATE INDEX IF NOT EXISTS idx_normative_docs_status ON normative_documents(status);
      CREATE INDEX IF NOT EXISTS idx_normative_docs_number ON normative_documents(document_number);
    `);

    // Ensure unique constraint on document_number for safe idempotent UPSERTs
    try {
      await pool.query(`
        DO $$
        BEGIN
          DELETE FROM normative_documents a USING normative_documents b
          WHERE a.id < b.id AND a.document_number = b.document_number;
        EXCEPTION WHEN OTHERS THEN
          NULL;
        END $$;
        CREATE UNIQUE INDEX IF NOT EXISTS idx_normative_docs_num_uq ON normative_documents(document_number);
      `);
    } catch (e) {
      console.warn('normative_documents unique index notice:', e.message);
    }

    // 2. Create practical_cases table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS practical_cases (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(100) NOT NULL,
        icon VARCHAR(50) DEFAULT '🏠',
        category VARCHAR(100) NOT NULL,
        subtitle VARCHAR(255),
        description TEXT,
        target_user VARCHAR(150),
        checklist JSONB DEFAULT '[]'::jsonb,
        order_index INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        view_count INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_practical_cases_cat ON practical_cases(category);
      CREATE INDEX IF NOT EXISTS idx_practical_cases_order ON practical_cases(order_index);
      CREATE UNIQUE INDEX IF NOT EXISTS idx_practical_cases_slug_uq ON practical_cases(slug);
    `);

    // 3. Create case_documents linking table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS case_documents (
        id SERIAL PRIMARY KEY,
        case_id INT NOT NULL REFERENCES practical_cases(id) ON DELETE CASCADE,
        document_id INT NOT NULL REFERENCES normative_documents(id) ON DELETE CASCADE,
        stage_name VARCHAR(255),
        notes TEXT,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_case_docs_case ON case_documents(case_id);
    `);

    // Ensure unique index for case_documents
    try {
      await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_case_docs_unique ON case_documents(case_id, document_id, stage_name);
      `);
    } catch (e) {
      console.warn('case_documents unique index notice:', e.message);
    }

    // 3b. Orqaga mos migratsiya: admin tahriri himoyasi, havola tekshiruvi natijalari, saqlash/like, manbalar tizimi va amaliy misollar
    try {
      await pool.query(`
        ALTER TABLE normative_documents ADD COLUMN IF NOT EXISTS is_admin_edited BOOLEAN DEFAULT false;
        ALTER TABLE normative_documents ADD COLUMN IF NOT EXISTS pdf_check JSONB;
        ALTER TABLE normative_documents ADD COLUMN IF NOT EXISTS official_check JSONB;
        ALTER TABLE normative_documents ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'normative';
        ALTER TABLE normative_documents ADD COLUMN IF NOT EXISTS source_type VARCHAR(50) DEFAULT 'lex';
        ALTER TABLE normative_documents ADD COLUMN IF NOT EXISTS source_title VARCHAR(255) DEFAULT 'Lex.uz';
        ALTER TABLE normative_documents ADD COLUMN IF NOT EXISTS sources JSONB DEFAULT '[]'::jsonb;
        ALTER TABLE normative_documents ADD COLUMN IF NOT EXISTS practical_example TEXT;
        ALTER TABLE normative_documents ADD COLUMN IF NOT EXISTS book_reference TEXT;

        ALTER TABLE practical_cases ADD COLUMN IF NOT EXISTS is_admin_edited BOOLEAN DEFAULT false;

        CREATE TABLE IF NOT EXISTS norm_reactions (
          user_id INT NOT NULL,
          item_kind VARCHAR(10) NOT NULL,
          item_id INT NOT NULL,
          reaction VARCHAR(10) NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          PRIMARY KEY (user_id, item_kind, item_id, reaction)
        );
        CREATE INDEX IF NOT EXISTS idx_norm_reactions_item ON norm_reactions(item_kind, item_id);
      `);
    } catch (e) {
      console.warn('normatives migration notice:', e.message);
    }

    // 3c. Create normative_topics table (Me'yoriy ma'lumotnoma — per-topic reference entries)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS normative_topics (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(200) NOT NULL,
        category VARCHAR(100) NOT NULL,
        subcategory VARCHAR(200),
        data_type VARCHAR(20) NOT NULL DEFAULT 'norma',
        normative_value VARCHAR(500),
        unit VARCHAR(100),
        building_type VARCHAR(200),
        room_type VARCHAR(200),
        condition TEXT,
        formula TEXT,
        calculation_example TEXT,
        practical_note TEXT,
        architect_note TEXT,
        source_document_number VARCHAR(100),
        source_band VARCHAR(200),
        source_table VARCHAR(200),
        keywords TEXT[] DEFAULT '{}',
        related_document_id INT,
        status VARCHAR(50) DEFAULT 'AMALDA',
        order_index INT DEFAULT 0,
        view_count INT DEFAULT 0,
        is_system_seed BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_norm_topics_cat ON normative_topics(category);
      CREATE INDEX IF NOT EXISTS idx_norm_topics_type ON normative_topics(data_type);
      CREATE INDEX IF NOT EXISTS idx_norm_topics_status ON normative_topics(status);
    `);

    // Ensure unique slug on normative_topics
    try {
      await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_norm_topics_slug_uq ON normative_topics(slug);
      `);
    } catch (e) {
      console.warn('normative_topics unique slug index notice:', e.message);
    }

    // Add multi-source and practical example columns to normative_topics BEFORE seeding
    try {
      await pool.query(`
        ALTER TABLE normative_topics ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'normative';
        ALTER TABLE normative_topics ADD COLUMN IF NOT EXISTS source_type VARCHAR(50) DEFAULT 'ministry';
        ALTER TABLE normative_topics ADD COLUMN IF NOT EXISTS source_title VARCHAR(255) DEFAULT 'Qurilish va uy-joy kommunal xo‘jaligi vazirligi';
        ALTER TABLE normative_topics ADD COLUMN IF NOT EXISTS source_url TEXT;
        ALTER TABLE normative_topics ADD COLUMN IF NOT EXISTS sources JSONB DEFAULT '[]'::jsonb;
        ALTER TABLE normative_topics ADD COLUMN IF NOT EXISTS practical_example TEXT;
        ALTER TABLE normative_topics ADD COLUMN IF NOT EXISTS book_reference TEXT;
      `);
    } catch (e) {
      console.warn('normative_topics columns notice:', e.message);
    }

    // Seed normative_topics from batch files (if available)
    try {
      var allTopics = [];
      try { allTopics = allTopics.concat(require('./seedTopicsBatch1').SEED_TOPICS_BATCH1 || []); } catch(e) {}
      try { allTopics = allTopics.concat(require('./seedTopicsBatch2').SEED_TOPICS_BATCH2 || []); } catch(e) {}
      try { allTopics = allTopics.concat(require('./seedTopicsBatch3').SEED_TOPICS_BATCH3 || []); } catch(e) {}
      try { allTopics = allTopics.concat(require('./seedTopicsBatch4').SEED_TOPICS_BATCH4 || []); } catch(e) {}
      // Rasmiy band bilan tekshirilmagan qiymatlar "tavsiya" ga o'tadi, tekshirilganlari tuzatiladi
      allTopics = applyTopicVerification(allTopics);

      // Hujjat raqami -> aynan o'sha hujjatning rasmiy sahifasi (lex.uz bosh sahifasi emas)
      var verifiedDocUrl = {};
      SEED_NORMATIVES.forEach(function (d) {
        var u = d.official_source_url || d.pdf_url;
        if (u) verifiedDocUrl[String(d.document_number).trim().toLowerCase()] = u;
      });

      var insertedTopics = 0;
      var updatedTopics = 0;
      for (var ti = 0; ti < allTopics.length; ti++) {
        var t = allTopics[ti];
        if (!t || !t.slug || !t.title) continue;
        try {
          // Link to normative_documents if source_document_number matches
          var relDocId = null;
          if (t.source_document_number) {
            var docLookup = await pool.query(
              'SELECT id FROM normative_documents WHERE document_number ILIKE $1 LIMIT 1',
              [t.source_document_number.trim()]
            );
            if (docLookup.rows.length) relDocId = docLookup.rows[0].id;
          }

          // Compute smart source metadata and content_type
          var cType = t.content_type || (t.data_type === 'hisoblash' ? 'practical_example' : (t.data_type === 'tavsiya' ? 'practical_example' : 'normative'));
          var sType = t.source_type;
          if (!sType) {
            var docNum = String(t.source_document_number || '').toUpperCase();
            if (docNum.includes('SHNQ') || docNum.includes('QMQ')) sType = 'ministry';
            else if (docNum.includes('VMQ') || docNum.includes('O\'RQ') || docNum.includes('PF')) sType = 'lex';
            else if (docNum.includes('DST') || docNum.includes('GOST') || docNum.includes('SANPIN')) sType = 'official';
            else if (t.data_type === 'tavsiya') sType = 'book';
            else sType = 'ministry';
          }

          var sTitle = t.source_title;
          if (!sTitle) {
            if (sType === 'ministry') sTitle = 'Qurilish va uy-joy kommunal xo‘jaligi vazirligi';
            else if (sType === 'lex') sTitle = 'Lex.uz — Qonunchilik milliy bazasi';
            else if (sType === 'official') sTitle = 'Rasmiy davlat standarti / Texnik meʼyor';
            else if (sType === 'book') sTitle = 'Kitob / O‘quv adabiyoti va amaliy tajriba';
            else sTitle = 'Qurilish va uy-joy kommunal xo‘jaligi vazirligi';
          }

          var docUrl = t.source_document_number ? verifiedDocUrl[String(t.source_document_number).trim().toLowerCase()] : null;
          var sUrl = t.source_url || docUrl || null;

          var tSources = t.sources && Array.isArray(t.sources) ? t.sources : [];
          if (tSources.length === 0) {
            if (t.source_document_number) {
              tSources.push({
                title: t.source_document_number + (docUrl ? ' — rasmiy matn' : ''),
                type: docUrl && docUrl.indexOf('lex.uz') !== -1 ? 'lex' : sType,
                url: docUrl || undefined,
                note: t.source_band ? t.source_band : (t.data_type === 'norma' ? 'Rasmiy hujjat' : 'Mavzuga oid amaldagi hujjat')
              });
            }
            if (t.data_type === 'tavsiya' || t.practical_note) {
              tSources.push({
                title: 'Arxitektura va loyihalash o‘quv adabiyoti',
                type: 'book',
                note: 'O‘quv adabiyoti / Amaliy tavsiya (majburiy norma emas)'
              });
            }
          }

          var pEx = t.practical_example || null;
          if (!pEx && (t.calculation_example || t.formula)) {
            var parts = [];
            if (t.condition) parts.push('Loyiha holati:\n' + t.condition);
            if (t.formula) parts.push('Hisoblash formulasi:\n' + t.formula);
            if (t.calculation_example) parts.push('Hisoblash misoli:\n' + t.calculation_example);
            if (t.normative_value) parts.push('Normativ talab:\n' + t.normative_value + (t.unit ? ' ' + t.unit : ''));
            pEx = parts.join('\n\n');
          }

          var bRef = t.book_reference || (t.data_type === 'tavsiya' ? 'Arxitektura va interyerni loyihalash o‘quv qo‘llanmasi (Amaliy tavsiya)' : null);

          var topicQ = await pool.query(`
            INSERT INTO normative_topics (
              title, slug, category, subcategory, data_type,
              normative_value, unit, building_type, room_type, condition,
              formula, calculation_example, practical_note, architect_note,
              source_document_number, source_band, source_table,
              keywords, related_document_id, status, order_index, is_system_seed,
              content_type, source_type, source_title, source_url, sources, practical_example, book_reference
            ) VALUES (
              $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21, true,
              $22,$23,$24,$25,$26,$27,$28
            )
            ON CONFLICT (slug) DO UPDATE SET
              title = EXCLUDED.title,
              category = EXCLUDED.category,
              subcategory = EXCLUDED.subcategory,
              data_type = EXCLUDED.data_type,
              normative_value = EXCLUDED.normative_value,
              unit = EXCLUDED.unit,
              building_type = EXCLUDED.building_type,
              room_type = EXCLUDED.room_type,
              condition = EXCLUDED.condition,
              formula = EXCLUDED.formula,
              calculation_example = EXCLUDED.calculation_example,
              practical_note = EXCLUDED.practical_note,
              architect_note = EXCLUDED.architect_note,
              source_document_number = EXCLUDED.source_document_number,
              source_band = EXCLUDED.source_band,
              source_table = EXCLUDED.source_table,
              keywords = EXCLUDED.keywords,
              related_document_id = EXCLUDED.related_document_id,
              status = EXCLUDED.status,
              order_index = EXCLUDED.order_index,
              content_type = EXCLUDED.content_type,
              source_type = EXCLUDED.source_type,
              source_title = EXCLUDED.source_title,
              source_url = EXCLUDED.source_url,
              sources = EXCLUDED.sources,
              practical_example = EXCLUDED.practical_example,
              book_reference = EXCLUDED.book_reference,
              updated_at = NOW()
            RETURNING (xmax = 0) AS was_inserted;
          `, [
            t.title, t.slug, t.category, t.subcategory || null, t.data_type || 'norma',
            t.normative_value || null, t.unit || null, t.building_type || null, t.room_type || null, t.condition || null,
            t.formula || null, t.calculation_example || null, t.practical_note || null, t.architect_note || null,
            t.source_document_number || null, t.source_band || null, t.source_table || null,
            t.keywords || [], relDocId, t.status || 'AMALDA', t.order_index || (ti + 1),
            cType, sType, sTitle, sUrl, JSON.stringify(tSources), pEx, bRef
          ]);
          if (topicQ.rows[0]?.was_inserted) insertedTopics++;
          else updatedTopics++;
        } catch (topicErr) {
          console.error('Error upserting topic ' + t.slug + ':', topicErr.message);
        }
      }
      if (allTopics.length > 0) {
        console.log('📋 NORMATIVE TOPICS: ' + allTopics.length + ' total (inserted: ' + insertedTopics + ', updated: ' + updatedTopics + ')');
      }
    } catch (topicsSeedErr) {
      console.warn('normative_topics seed notice:', topicsSeedErr.message);
    }

    // 4. Kutubxona bo'limlari: Faqat "Normativlar" asosiy bo'lim (Amaliy ishlar alohida bo'lim bo'lmaydi, Normativlar ichida filter bo'ladi)
    try {
      await pool.query(`
        INSERT INTO library_sections (slug, name, subtitle, icon, description, order_index, is_active, is_visible)
        VALUES (
          'normatives',
          'Normativlar',
          'SHNQ, QMQ, standartlar va amaliy yechimlar',
          '📋',
          'Arxitektura, qurilish va loyihalash uchun normativ hujjatlar, standartlar va amaliy hisoblar',
          5,
          true,
          true
        )
        ON CONFLICT (slug) DO UPDATE SET 
          is_active = true, 
          is_visible = true,
          subtitle = 'SHNQ, QMQ, standartlar va amaliy yechimlar';
      `);

      // "Amaliy yechimlar" alohida asosiy tile bo'lmasligi uchun is_visible=false qilamiz
      await pool.query(`
        UPDATE library_sections
        SET is_visible = false, is_active = false
        WHERE slug IN ('amaliy_yechimlar', 'cases', 'amaliy');
      `);
    } catch (e) {
      console.warn('normatives library section seed warn:', e.message);
    }

    // 5a. Ilgari noto'g'ri raqam bilan seed qilingan hujjatlar amaldagi raqamga ko'chiriladi
    // (satr o'chirilmaydi, id va like/saqlashlar saqlanadi; admin tahrir qilgan satrlarga tegilmaydi)
    for (const oldNum of Object.keys(NORMATIVE_RENAMES)) {
      const newNum = NORMATIVE_RENAMES[oldNum];
      try {
        await pool.query(`
          UPDATE normative_documents SET document_number = $2, updated_at = NOW()
          WHERE document_number = $1
            AND is_system_seed IS TRUE
            AND is_admin_edited IS NOT TRUE
            AND NOT EXISTS (SELECT 1 FROM normative_documents WHERE document_number = $2)
        `, [oldNum, newNum]);
      } catch (err) {
        console.warn(`Normative rename ${oldNum} -> ${newNum}:`, err.message);
      }
    }

    // 5. IDEMPOTENT UPSERT SEED FOR NORMATIVE DOCUMENTS
    let insertedDocs = 0;
    let updatedDocs = 0;

    for (const item of SEED_NORMATIVES) {
      const q = `
        INSERT INTO normative_documents (
          title, document_number, document_type, category, description,
          requirements, target_audience, application_scope, status,
          adopted_date, effective_date, repealed_date, issuing_authority,
          official_source_url, pdf_url, old_edition_note, new_edition_note,
          change_date, tags, last_verified_at, is_system_seed,
          content_type, source_type, source_title, sources, practical_example, book_reference
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10, $11, $12, $13, $14, $15, $16, $17,
          $18, $19, NOW(), true,
          $20, $21, $22, $23, $24, $25
        )
        ON CONFLICT (document_number) DO UPDATE SET
          title = EXCLUDED.title,
          document_type = EXCLUDED.document_type,
          category = EXCLUDED.category,
          description = EXCLUDED.description,
          requirements = EXCLUDED.requirements,
          target_audience = EXCLUDED.target_audience,
          application_scope = EXCLUDED.application_scope,
          status = EXCLUDED.status,
          adopted_date = EXCLUDED.adopted_date,
          effective_date = EXCLUDED.effective_date,
          repealed_date = EXCLUDED.repealed_date,
          issuing_authority = EXCLUDED.issuing_authority,
          official_source_url = EXCLUDED.official_source_url,
          pdf_url = EXCLUDED.pdf_url,
          old_edition_note = EXCLUDED.old_edition_note,
          new_edition_note = EXCLUDED.new_edition_note,
          change_date = EXCLUDED.change_date,
          tags = EXCLUDED.tags,
          last_verified_at = EXCLUDED.last_verified_at,
          content_type = EXCLUDED.content_type,
          source_type = EXCLUDED.source_type,
          source_title = EXCLUDED.source_title,
          sources = EXCLUDED.sources,
          practical_example = EXCLUDED.practical_example,
          book_reference = EXCLUDED.book_reference,
          updated_at = NOW()
        WHERE normative_documents.is_admin_edited IS NOT TRUE
        RETURNING (xmax = 0) AS was_inserted;
      `;

      try {
        const r = await pool.query(q, [
          item.title, item.document_number, item.document_type, item.category, item.description,
          item.requirements, item.target_audience, item.application_scope, item.status,
          item.adopted_date || null, item.effective_date || null, item.repealed_date || null, item.issuing_authority || null,
          item.official_source_url || null, item.pdf_url || null, item.old_edition_note || null, item.new_edition_note || null,
          item.change_date || null, item.tags || [],
          item.content_type || 'normative', item.source_type || 'lex', item.source_title || 'Lex.uz',
          JSON.stringify(item.sources || []), item.practical_example || null, item.book_reference || null
        ]);
        if (r.rows[0]?.was_inserted) insertedDocs++;
        else updatedDocs++;
      } catch (err) {
        console.error(`Error upserting doc ${item.document_number}:`, err.message);
        noteSeedError('upsert ' + item.document_number, err);
        // Zaxira: eski bazada ustun turi/indeks mos kelmasa ham asosiy maydonlar (havola, nom, holat) yangilansin
        try {
          const fb = await seedDocCoreFallback(pool, item);
          if (fb === 'inserted') insertedDocs++;
          else if (fb === 'updated') updatedDocs++;
        } catch (err2) {
          console.error(`Fallback upsert failed ${item.document_number}:`, err2.message);
          noteSeedError('fallback ' + item.document_number, err2);
        }
      }
    }

    // 6. IDEMPOTENT UPSERT SEED FOR PRACTICAL CASES
    let seededCases = 0;
    for (const cs of SEED_PRACTICAL_CASES) {
      try {
        const ins = await pool.query(`
          INSERT INTO practical_cases (
            title, slug, icon, category, subtitle, description, target_user, checklist, order_index, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
          ON CONFLICT (slug) DO UPDATE SET
            title = EXCLUDED.title,
            icon = EXCLUDED.icon,
            category = EXCLUDED.category,
            subtitle = EXCLUDED.subtitle,
            description = EXCLUDED.description,
            target_user = EXCLUDED.target_user,
            checklist = EXCLUDED.checklist,
            order_index = EXCLUDED.order_index,
            is_active = true,
            updated_at = NOW()
          WHERE practical_cases.is_admin_edited IS NOT TRUE
          RETURNING id;
        `, [
          cs.title, cs.slug, cs.icon, cs.category, cs.subtitle, cs.description, cs.target_user,
          JSON.stringify(cs.checklist), cs.order_index
        ]);

        let caseId = ins.rows[0] && ins.rows[0].id;
        if (!caseId) {
          // Admin tahrir qilgan vaziyat: seed uni o'zgartirmadi, faqat bog'lanishlar tekshiriladi
          const ex = await pool.query('SELECT id FROM practical_cases WHERE slug = $1', [cs.slug]);
          caseId = ex.rows[0] && ex.rows[0].id;
        }
        if (!caseId) continue;
        seededCases++;

        // Seed yangilagan vaziyatlarda eski (noto'g'ri raqamli) hujjat bog'lanishlarini tozalab, qaytadan bog'laymiz
        if (ins.rows[0]) {
          await pool.query('DELETE FROM case_documents WHERE case_id = $1', [caseId]).catch(() => {});
        }

        // 7. Link documents mentioned in checklist
        for (const chItem of cs.checklist) {
          if (chItem.document_numbers && Array.isArray(chItem.document_numbers)) {
            for (const docNum of chItem.document_numbers) {
              const docRes = await pool.query('SELECT id FROM normative_documents WHERE document_number ILIKE $1 LIMIT 1', [docNum.trim()]);
              if (docRes.rows.length) {
                await pool.query(`
                  INSERT INTO case_documents (case_id, document_id, stage_name, notes, sort_order)
                  VALUES ($1, $2, $3, $4, $5)
                  ON CONFLICT (case_id, document_id, stage_name) DO NOTHING;
                `, [caseId, docRes.rows[0].id, chItem.title, chItem.law_basis, chItem.step_order || 0]).catch(e => {
                  // Fallback without target if index name differs
                  return pool.query(`
                    INSERT INTO case_documents (case_id, document_id, stage_name, notes, sort_order)
                    SELECT $1, $2, $3, $4, $5
                    WHERE NOT EXISTS (
                      SELECT 1 FROM case_documents WHERE case_id = $1 AND document_id = $2 AND stage_name = $3
                    );
                  `, [caseId, docRes.rows[0].id, chItem.title, chItem.law_basis, chItem.step_order || 0]);
                });
              }
            }
          }
        }
      } catch (err) {
        console.error(`Error upserting case ${cs.slug}:`, err.message);
      }
    }

    // 8. FINAL DIAGNOSTIC & LOG REPORT
    const [cntDocs, cntCases, cntLinks, cntTopics] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS cnt FROM normative_documents'),
      pool.query('SELECT COUNT(*)::int AS cnt FROM practical_cases'),
      pool.query('SELECT COUNT(*)::int AS cnt FROM case_documents'),
      pool.query('SELECT COUNT(*)::int AS cnt FROM normative_topics').catch(() => ({ rows: [{ cnt: 0 }] }))
    ]);

    console.log('==================================================');
    console.log('📋 NORMATIVES DB VERIFICATION:');
    console.log(`- normative_documents: ${cntDocs.rows[0]?.cnt || 0} records (inserted: ${insertedDocs}, updated: ${updatedDocs})`);
    console.log(`- practical_cases: ${cntCases.rows[0]?.cnt || 0} records (seeded: ${seededCases})`);
    console.log(`- case_documents: ${cntLinks.rows[0]?.cnt || 0} links`);
    console.log(`- normative_topics: ${cntTopics.rows[0]?.cnt || 0} topics`);
    console.log('==================================================');


  } catch (err) {
    console.error('ERROR INITIALIZING NORMATIVES TABLES:', err);
  }
}

// ======================================================
// QUERY HELPERS
// ======================================================

async function getNormativesList(pool, options = {}) {
  const {
    category,
    document_type,
    status,
    content_type,
    source_type,
    search,
    limit = 100,
    offset = 0,
    sort = 'newest',
    userId = 0
  } = options;

  let conditions = [];
  let values = [];
  let idx = 1;

  if (category && category !== 'all' && category !== 'Barchasi') {
    conditions.push(`category ILIKE $${idx++}`);
    values.push(`%${category}%`);
  }

  if (document_type && document_type !== 'all' && document_type !== 'Barchasi') {
    conditions.push(`document_type ILIKE $${idx++}`);
    values.push(document_type);
  }

  if (status && status !== 'all' && status !== 'Barchasi') {
    conditions.push(`status = $${idx++}`);
    values.push(status);
  }

  if (content_type && content_type !== 'all' && content_type !== 'Barchasi') {
    if (content_type === 'normative') {
      conditions.push(`(content_type = 'normative' OR content_type IS NULL)`);
    } else if (content_type === 'practical_example') {
      conditions.push(`(content_type = 'practical_example' OR practical_example IS NOT NULL)`);
    }
  }

  if (source_type && source_type !== 'all' && source_type !== 'Barchasi') {
    conditions.push(`(source_type = $${idx} OR EXISTS(SELECT 1 FROM jsonb_array_elements(COALESCE(sources, '[]'::jsonb)) src WHERE src->>'type' = $${idx}))`);
    values.push(source_type);
    idx++;
  }

  if (search && search.trim()) {
    const q = `%${search.trim().toLowerCase()}%`;
    conditions.push(`(
      LOWER(title) LIKE $${idx} OR
      LOWER(document_number) LIKE $${idx} OR
      LOWER(description) LIKE $${idx} OR
      LOWER(requirements) LIKE $${idx} OR
      LOWER(category) LIKE $${idx} OR
      LOWER(COALESCE(source_title, '')) LIKE $${idx} OR
      LOWER(COALESCE(practical_example, '')) LIKE $${idx} OR
      LOWER(COALESCE(book_reference, '')) LIKE $${idx} OR
      $${idx + 1} = ANY(tags)
    )`);
    values.push(q);
    values.push(search.trim().toLowerCase());
    idx += 2;
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  let orderBy = 'id ASC';
  if (sort === 'popular') orderBy = 'pop_score DESC, id ASC';
  else if (sort === 'number') orderBy = 'document_number ASC';
  else if (sort === 'adopted') orderBy = 'adopted_date DESC NULLS LAST';
  else if (sort === 'newest') orderBy = 'id ASC';

  const countQuery = `SELECT COUNT(*)::int AS total FROM normative_documents ${whereClause}`;
  const totalRes = await pool.query(countQuery, values);
  const total = totalRes.rows[0]?.total || 0;

  const uidIdx = idx++;
  const dataQuery = `
    SELECT * FROM (
      SELECT
        d.id, d.title, d.document_number, d.document_type, d.category,
        d.description, d.requirements, d.target_audience, d.application_scope,
        d.status, d.adopted_date, d.effective_date, d.repealed_date,
        d.issuing_authority, d.official_source_url, d.pdf_url,
        d.old_edition_note, d.new_edition_note, d.change_date,
        d.tags, d.view_count, d.last_verified_at, d.created_at, d.is_admin_edited,
        d.pdf_check, d.official_check,
        d.content_type, d.source_type, d.source_title, d.sources, d.practical_example, d.book_reference,
        COALESCE((SELECT COUNT(*)::int FROM norm_reactions r WHERE r.item_kind = 'doc' AND r.item_id = d.id AND r.reaction = 'like'), 0) AS like_count,
        COALESCE((SELECT COUNT(*)::int FROM norm_reactions r WHERE r.item_kind = 'doc' AND r.item_id = d.id AND r.reaction = 'save'), 0) AS save_count,
        EXISTS(SELECT 1 FROM norm_reactions r WHERE r.item_kind = 'doc' AND r.item_id = d.id AND r.reaction = 'like' AND r.user_id = $${uidIdx}) AS is_liked,
        EXISTS(SELECT 1 FROM norm_reactions r WHERE r.item_kind = 'doc' AND r.item_id = d.id AND r.reaction = 'save' AND r.user_id = $${uidIdx}) AS is_saved,
        (COALESCE(d.view_count, 0)
          + 3 * COALESCE((SELECT COUNT(*)::int FROM norm_reactions r WHERE r.item_kind = 'doc' AND r.item_id = d.id AND r.reaction = 'like'), 0)
          + 5 * COALESCE((SELECT COUNT(*)::int FROM norm_reactions r WHERE r.item_kind = 'doc' AND r.item_id = d.id AND r.reaction = 'save'), 0)) AS pop_score
      FROM normative_documents d
      ${whereClause.replace(/\b(title|document_number|description|requirements|category|tags|document_type|status|content_type|source_type|source_title|sources|practical_example|book_reference)\b/g, 'd.$1')}
    ) x
    ORDER BY ${orderBy.replace(/\b(view_count|document_number|adopted_date|id)\b/g, 'x.$1')}
    LIMIT $${idx++} OFFSET $${idx++}
  `;

  values.splice(uidIdx - 1, 0, Number(userId) || 0);
  values.push(Math.min(limit, 1000));
  values.push(offset);

  const res = await pool.query(dataQuery, values);
  return { items: res.rows, documents: res.rows, total, limit, offset };
}

async function getNormativeDetail(pool, id, userId) {
  const docRes = await pool.query(`
    SELECT * FROM normative_documents WHERE id = $1
  `, [Number(id)]);

  if (!docRes.rows.length) return null;
  const doc = docRes.rows[0];

  pool.query('UPDATE normative_documents SET view_count = view_count + 1 WHERE id = $1', [doc.id]).catch(() => {});

  // Bitta vaziyatning bir nechta bosqichi shu hujjatga bog'langan bo'lishi mumkin — vaziyat ro'yxatda bir marta chiqadi
  const casesRes = await pool.query(`
    SELECT id, title, slug, icon, category, stage_name FROM (
      SELECT DISTINCT ON (pc.id) pc.id, pc.title, pc.slug, pc.icon, pc.category, pc.order_index, cd.stage_name
      FROM case_documents cd
      JOIN practical_cases pc ON pc.id = cd.case_id
      WHERE cd.document_id = $1 AND pc.is_active IS NOT FALSE
      ORDER BY pc.id, cd.sort_order ASC
    ) x
    ORDER BY x.order_index ASC, x.id ASC
  `, [doc.id]);

  const st = await pool.query(`
    SELECT
      COALESCE(SUM((reaction = 'like')::int), 0)::int AS like_count,
      COALESCE(SUM((reaction = 'save')::int), 0)::int AS save_count,
      COALESCE(BOOL_OR(reaction = 'like' AND user_id = $2), false) AS is_liked,
      COALESCE(BOOL_OR(reaction = 'save' AND user_id = $2), false) AS is_saved
    FROM norm_reactions WHERE item_kind = 'doc' AND item_id = $1
  `, [doc.id, Number(userId) || 0]).catch(() => ({ rows: [{}] }));
  Object.assign(doc, st.rows[0] || {});

  return { document: doc, cases: casesRes.rows };
}

async function getPracticalCasesList(pool, options = {}) {
  const { category, search, userId = 0 } = options;
  let conditions = ['c.is_active = true'];
  let values = [Number(userId) || 0];
  let idx = 2;

  if (category && category !== 'all' && category !== 'Barchasi') {
    conditions.push(`c.category ILIKE $${idx++}`);
    values.push(`%${category}%`);
  }

  if (search && search.trim()) {
    conditions.push(`(
      LOWER(c.title) LIKE $${idx} OR
      LOWER(c.description) LIKE $${idx} OR
      LOWER(c.subtitle) LIKE $${idx} OR
      LOWER(c.category) LIKE $${idx} OR
      LOWER(c.checklist::text) LIKE $${idx}
    )`);
    values.push(`%${search.trim().toLowerCase()}%`);
    idx++;
  }

  const res = await pool.query(`
    SELECT
      c.id, c.title, c.slug, c.icon, c.category, c.subtitle,
      c.description, c.target_user, c.checklist, c.order_index, c.view_count, c.created_at,
      jsonb_array_length(COALESCE(c.checklist, '[]'::jsonb)) AS step_count,
      COALESCE((SELECT json_agg(json_build_object('id', nd.id, 'document_number', nd.document_number, 'title', nd.title) ORDER BY nd.id)
                FROM (SELECT DISTINCT document_id FROM case_documents WHERE case_id = c.id) cdx
                JOIN normative_documents nd ON nd.id = cdx.document_id), '[]'::json) AS related_documents,
      COALESCE((SELECT COUNT(*)::int FROM norm_reactions r WHERE r.item_kind = 'case' AND r.item_id = c.id AND r.reaction = 'like'), 0) AS like_count,
      COALESCE((SELECT COUNT(*)::int FROM norm_reactions r WHERE r.item_kind = 'case' AND r.item_id = c.id AND r.reaction = 'save'), 0) AS save_count,
      EXISTS(SELECT 1 FROM norm_reactions r WHERE r.item_kind = 'case' AND r.item_id = c.id AND r.reaction = 'like' AND r.user_id = $1) AS is_liked,
      EXISTS(SELECT 1 FROM norm_reactions r WHERE r.item_kind = 'case' AND r.item_id = c.id AND r.reaction = 'save' AND r.user_id = $1) AS is_saved
    FROM practical_cases c
    WHERE ${conditions.join(' AND ')}
    ORDER BY c.order_index ASC, c.id ASC
  `, values);

  return res.rows.map(function (r) {
    r.pop_score = (Number(r.view_count) || 0) + 3 * (Number(r.like_count) || 0) + 5 * (Number(r.save_count) || 0);
    return r;
  });
}

async function getPracticalCaseDetail(pool, idOrSlug) {
  let query = 'SELECT * FROM practical_cases WHERE is_active = true AND ';
  let param;
  if (isNaN(Number(idOrSlug))) {
    query += 'slug = $1';
    param = idOrSlug;
  } else {
    query += 'id = $1';
    param = Number(idOrSlug);
  }

  const caseRes = await pool.query(query, [param]);
  if (!caseRes.rows.length) return null;
  const cs = caseRes.rows[0];

  pool.query('UPDATE practical_cases SET view_count = view_count + 1 WHERE id = $1', [cs.id]).catch(() => {});

  // Fetch all associated normative documents
  const docsRes = await pool.query(`
    SELECT
      nd.id, nd.title, nd.document_number, nd.document_type,
      nd.status, nd.adopted_date, nd.official_source_url, nd.pdf_url,
      cd.stage_name, cd.notes, cd.sort_order
    FROM case_documents cd
    JOIN normative_documents nd ON nd.id = cd.document_id
    WHERE cd.case_id = $1
    ORDER BY cd.sort_order ASC, nd.id ASC
  `, [cs.id]);

  cs.documents = docsRes.rows;

  // Bosqichlardagi hujjat raqamlari case_documents'da bo'lmasa ham (admin keyin qo'shgan), to'g'ridan-to'g'ri bazadan topiladi
  let steps = cs.checklist;
  if (typeof steps === 'string') { try { steps = JSON.parse(steps); } catch (e) { steps = []; } }
  const known = new Set(cs.documents.map(d => String(d.document_number || '').trim().toLowerCase()));
  const wanted = [];
  (Array.isArray(steps) ? steps : []).forEach(st => (st.document_numbers || []).forEach(n => {
    const k = String(n || '').trim().toLowerCase();
    if (k && !known.has(k) && !wanted.includes(k)) wanted.push(k);
  }));
  if (wanted.length) {
    const extra = await pool.query(`
      SELECT id, title, document_number, document_type, status, adopted_date, official_source_url, pdf_url
      FROM normative_documents WHERE LOWER(TRIM(document_number)) = ANY($1::text[])
    `, [wanted]).catch(() => ({ rows: [] }));
    extra.rows.forEach(d => cs.documents.push(Object.assign({ stage_name: null, notes: null, sort_order: 999 }, d)));
  }
  return cs;
}

async function getNormativesStats(pool) {
  const [totalRes, inForceRes, amendedRes, repealedRes, casesRes, linksRes] = await Promise.all([
    pool.query('SELECT COUNT(*)::int AS count FROM normative_documents'),
    pool.query("SELECT COUNT(*)::int AS count FROM normative_documents WHERE status = 'AMALDA'"),
    pool.query("SELECT COUNT(*)::int AS count FROM normative_documents WHERE status = 'O‘ZGARTIRILGAN' OR status = 'OZGARTIRILGAN'"),
    pool.query("SELECT COUNT(*)::int AS count FROM normative_documents WHERE status = 'KUCHINI YO‘QOTGAN' OR status = 'KUCHINI YOQOTGAN'"),
    pool.query('SELECT COUNT(*)::int AS count FROM practical_cases WHERE is_active = true'),
    pool.query('SELECT COUNT(*)::int AS count FROM case_documents')
  ]);

  return {
    total_documents: totalRes.rows[0]?.count || 0,
    in_force: inForceRes.rows[0]?.count || 0,
    amended: amendedRes.rows[0]?.count || 0,
    repealed: repealedRes.rows[0]?.count || 0,
    total_cases: casesRes.rows[0]?.count || 0,
    total_links: linksRes.rows[0]?.count || 0
  };
}

// ======================================================
// NORMATIVE TOPICS (ME'YORIY MA'LUMOTNOMA) QUERIES
// ======================================================

async function getNormativeTopicsList(pool, options = {}) {
  const {
    category,
    data_type,
    content_type,
    source_type,
    search,
    limit = 200,
    offset = 0,
    sort = 'order'
  } = options;

  let conditions = [];
  let values = [];
  let idx = 1;

  if (category && category !== 'all' && category !== 'Barchasi') {
    conditions.push(`category = $${idx++}`);
    values.push(category);
  }

  if (data_type && data_type !== 'all' && data_type !== 'Barchasi') {
    conditions.push(`data_type = $${idx++}`);
    values.push(data_type);
  }

  if (content_type && content_type !== 'all' && content_type !== 'Barchasi') {
    if (content_type === 'normative') {
      conditions.push(`(data_type = 'norma' AND (content_type IS NULL OR content_type = 'normative'))`);
    } else if (content_type === 'practical_example') {
      conditions.push(`(data_type = 'hisoblash' OR data_type = 'tavsiya' OR content_type = 'practical_example' OR calculation_example IS NOT NULL OR practical_example IS NOT NULL)`);
    }
  }

  if (source_type && source_type !== 'all' && source_type !== 'Barchasi') {
    conditions.push(`(source_type = $${idx} OR EXISTS(SELECT 1 FROM jsonb_array_elements(COALESCE(sources, '[]'::jsonb)) src WHERE src->>'type' = $${idx}))`);
    values.push(source_type);
    idx++;
  }

  if (search && search.trim()) {
    const q = `%${search.trim().toLowerCase()}%`;
    conditions.push(`(
      LOWER(title) LIKE $${idx} OR
      LOWER(category) LIKE $${idx} OR
      LOWER(subcategory) LIKE $${idx} OR
      LOWER(normative_value) LIKE $${idx} OR
      LOWER(room_type) LIKE $${idx} OR
      LOWER(building_type) LIKE $${idx} OR
      LOWER(source_document_number) LIKE $${idx} OR
      LOWER(condition) LIKE $${idx} OR
      LOWER(practical_note) LIKE $${idx} OR
      LOWER(COALESCE(source_title, '')) LIKE $${idx} OR
      LOWER(COALESCE(practical_example, '')) LIKE $${idx} OR
      LOWER(COALESCE(book_reference, '')) LIKE $${idx} OR
      $${idx + 1} = ANY(keywords)
    )`);
    values.push(q);
    values.push(search.trim().toLowerCase());
    idx += 2;
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  let orderBy = 'order_index ASC, id ASC';
  if (sort === 'popular') orderBy = 'view_count DESC, id ASC';
  else if (sort === 'title') orderBy = 'title ASC';
  else if (sort === 'newest') orderBy = 'id DESC';

  const countQuery = `SELECT COUNT(*)::int AS total FROM normative_topics ${whereClause}`;
  const totalRes = await pool.query(countQuery, values);
  const total = totalRes.rows[0]?.total || 0;

  const dataQuery = `
    SELECT
      id, title, slug, category, subcategory, data_type,
      normative_value, unit, building_type, room_type, condition,
      formula, calculation_example, practical_note, architect_note,
      source_document_number, source_band, source_table,
      keywords, related_document_id, status, order_index, view_count,
      content_type, source_type, source_title, source_url, sources, practical_example, book_reference
    FROM normative_topics
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT $${idx++} OFFSET $${idx++}
  `;

  values.push(Math.min(limit, 500));
  values.push(offset);

  const res = await pool.query(dataQuery, values);

  // Get unique categories for filter UI
  const catsRes = await pool.query(
    'SELECT DISTINCT category FROM normative_topics ORDER BY category ASC'
  );
  const categories = catsRes.rows.map(r => r.category);

  return { items: res.rows, total, limit, offset, categories };
}

async function getNormativeTopicDetail(pool, idOrSlug) {
  let query = 'SELECT * FROM normative_topics WHERE ';
  let param;
  if (isNaN(Number(idOrSlug))) {
    query += 'slug = $1';
    param = idOrSlug;
  } else {
    query += 'id = $1';
    param = Number(idOrSlug);
  }

  const topicRes = await pool.query(query, [param]);
  if (!topicRes.rows.length) return null;
  const topic = topicRes.rows[0];

  // Increment view count
  pool.query('UPDATE normative_topics SET view_count = view_count + 1 WHERE id = $1', [topic.id]).catch(() => {});

  // If has related_document_id, fetch linked document
  let relatedDocument = null;
  if (topic.related_document_id) {
    const relRes = await pool.query(
      'SELECT id, title, document_number, document_type, status, official_source_url, pdf_url FROM normative_documents WHERE id = $1',
      [topic.related_document_id]
    );
    if (relRes.rows.length) relatedDocument = relRes.rows[0];
  }

  // Find related topics in the same category (up to 6)
  const relatedTopics = await pool.query(
    'SELECT id, title, slug, data_type, normative_value, unit FROM normative_topics WHERE category = $1 AND id != $2 ORDER BY order_index ASC LIMIT 6',
    [topic.category, topic.id]
  );

  return { topic, relatedDocument, relatedTopics: relatedTopics.rows };
}

async function getNormativeTopicCategories(pool) {
  const res = await pool.query(`
    SELECT category, COUNT(*)::int AS count, 
           array_agg(DISTINCT data_type) AS data_types
    FROM normative_topics 
    GROUP BY category 
    ORDER BY MIN(order_index) ASC
  `);
  return res.rows;
}

module.exports = {
  SEED_NORMATIVES,
  SEED_PRACTICAL_CASES,
  initNormativesTables,
  getNormativeSeedErrors,
  getNormativesList,
  getNormativeDetail,
  getPracticalCasesList,
  getPracticalCaseDetail,
  getNormativesStats,
  getNormativeTopicsList,
  getNormativeTopicDetail,
  getNormativeTopicCategories
};
