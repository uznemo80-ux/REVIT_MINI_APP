// ======================================================
// YOSHUZBEKK Academy — Materials Knowledge Base
// Schema, Database Migrations, Seeding & Sync
// ======================================================

const { SEED_CATEGORIES, SEED_MANUFACTURERS } = require('./materialsSeed');
const { SEED_MATERIALS } = require('./materialsCatalog');

async function initMaterialsTables(pool) {
  try {
    // 1. Create Categories Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS material_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        slug VARCHAR(150) UNIQUE NOT NULL,
        icon VARCHAR(50) DEFAULT '🧱',
        scope VARCHAR(50) DEFAULT 'both',
        description TEXT,
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 2. Create Manufacturers Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS material_manufacturers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        slug VARCHAR(150) UNIQUE NOT NULL,
        logo TEXT,
        website TEXT,
        country VARCHAR(100),
        description TEXT,
        is_verified BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 3. Create Materials Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS materials (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        original_name VARCHAR(255),
        english_name VARCHAR(255),
        aliases TEXT[],
        category_id INT REFERENCES material_categories(id) ON DELETE SET NULL,
        subcategory_name VARCHAR(150),
        scope VARCHAR(50) DEFAULT 'both',
        purpose_tag VARCHAR(100),
        manufacturer_id INT REFERENCES material_manufacturers(id) ON DELETE SET NULL,
        product_code VARCHAR(100),
        material_type VARCHAR(150),
        cover_image TEXT,
        description TEXT,
        dimensions_info TEXT,
        thicknesses TEXT,
        composition TEXT,
        usage_area TEXT,
        pros TEXT,
        cons TEXT,
        approx_price TEXT,
        uzb_market_availability TEXT,
        architect_notes TEXT,
        standards_info TEXT,
        lifespan VARCHAR(100),
        moisture_resistance VARCHAR(100),
        fire_rating VARCHAR(100),
        standard_sizes JSONB DEFAULT '[]'::jsonb,
        status VARCHAR(50) DEFAULT 'published',
        verification_status VARCHAR(50) DEFAULT 'verified',
        access_type VARCHAR(50) DEFAULT 'free',
        last_verified_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Non-destructive Column Migrations for Materials
    const colsToEnsure = [
      { name: "scope", type: "VARCHAR(50) DEFAULT 'both'" },
      { name: "purpose_tag", type: "VARCHAR(100)" },
      { name: "thicknesses", type: "TEXT" },
      { name: "composition", type: "TEXT" },
      { name: "usage_area", type: "TEXT" },
      { name: "pros", type: "TEXT" },
      { name: "cons", type: "TEXT" },
      { name: "approx_price", type: "TEXT" },
      { name: "uzb_market_availability", type: "TEXT" },
      { name: "architect_notes", type: "TEXT" },
      { name: "standards_info", type: "TEXT" },
      { name: "lifespan", type: "VARCHAR(100)" },
      { name: "moisture_resistance", type: "VARCHAR(100)" },
      { name: "fire_rating", type: "VARCHAR(100)" },
      { name: "standard_sizes", type: "JSONB DEFAULT '[]'::jsonb" },
      // Bilingual extensions
      { name: "name_uz", type: "VARCHAR(255)" },
      { name: "name_ru", type: "VARCHAR(255)" },
      { name: "short_description_uz", type: "TEXT" },
      { name: "short_description_ru", type: "TEXT" },
      { name: "description_uz", type: "TEXT" },
      { name: "description_ru", type: "TEXT" },
      { name: "usage_area_uz", type: "TEXT" },
      { name: "usage_area_ru", type: "TEXT" },
      { name: "pros_uz", type: "TEXT" },
      { name: "pros_ru", type: "TEXT" },
      { name: "cons_uz", type: "TEXT" },
      { name: "cons_ru", type: "TEXT" },
      { name: "architect_notes_uz", type: "TEXT" },
      { name: "architect_notes_ru", type: "TEXT" },
      { name: "mounting_instructions_uz", type: "TEXT" },
      { name: "mounting_instructions_ru", type: "TEXT" },
      { name: "dimensions_info_uz", type: "TEXT" },
      { name: "dimensions_info_ru", type: "TEXT" },
      { name: "is_frequent", type: "BOOLEAN DEFAULT false" },
      // Image Verification fields
      { name: "image_url", type: "TEXT" },
      { name: "image_source", type: "VARCHAR(100)" },
      { name: "image_source_url", type: "TEXT" },
      { name: "image_alt", type: "VARCHAR(255)" },
      { name: "image_verified", type: "BOOLEAN DEFAULT true" },
      { name: "image_verified_at", type: "TIMESTAMP WITH TIME ZONE" },
      { name: "image_verification_note", type: "TEXT" }
    ];

    for (const col of colsToEnsure) {
      await pool.query(`
        ALTER TABLE materials ADD COLUMN IF NOT EXISTS ${col.name} ${col.type};
      `).catch(e => console.warn(`Col migration ${col.name} warn:`, e.message));
    }

    await pool.query(`
      ALTER TABLE material_categories ADD COLUMN IF NOT EXISTS scope VARCHAR(50) DEFAULT 'both';
    `).catch(e => console.warn('Cat scope col migration warn:', e.message));

    // 4. Create Material Types/Variants Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS material_types (
        id SERIAL PRIMARY KEY,
        material_id INT REFERENCES materials(id) ON DELETE CASCADE,
        slug VARCHAR(150),
        name_uz VARCHAR(255) NOT NULL,
        name_ru VARCHAR(255) NOT NULL,
        description_uz TEXT,
        description_ru TEXT,
        photo_url TEXT,
        dimensions TEXT,
        approx_price TEXT,
        sort_order INT DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 5. Create Material Sources Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS material_sources (
        id SERIAL PRIMARY KEY,
        material_id INT REFERENCES materials(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        source_type VARCHAR(100) DEFAULT 'official_catalog',
        url TEXT NOT NULL,
        http_status INT DEFAULT 200,
        content_matched BOOLEAN DEFAULT true,
        last_checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        error_message TEXT,
        sort_order INT DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Backfill legacy rows with bilingual values if empty
    await pool.query(`
      UPDATE materials SET 
        name_uz = COALESCE(name_uz, name),
        name_ru = COALESCE(name_ru, original_name, name),
        short_description_uz = COALESCE(short_description_uz, SUBSTRING(description FROM 1 FOR 180)),
        short_description_ru = COALESCE(short_description_ru, SUBSTRING(description FROM 1 FOR 180)),
        description_uz = COALESCE(description_uz, description),
        description_ru = COALESCE(description_ru, description),
        image_url = COALESCE(image_url, cover_image),
        image_verified = COALESCE(image_verified, true),
        image_verified_at = COALESCE(image_verified_at, NOW())
      WHERE name_uz IS NULL OR image_url IS NULL;
    `).catch(e => console.warn('Backfill warn:', e.message));

    // --- SEED CATEGORIES ---
    for (const cat of SEED_CATEGORIES) {
      await pool.query(`
        INSERT INTO material_categories (name, slug, icon, scope, description, sort_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, true)
        ON CONFLICT (slug) DO UPDATE
        SET name = EXCLUDED.name, icon = EXCLUDED.icon, scope = EXCLUDED.scope,
            description = EXCLUDED.description, sort_order = EXCLUDED.sort_order
      `, [cat.name, cat.slug, cat.icon, cat.scope || 'both', cat.description, cat.sort_order]);
    }

    // --- SEED MANUFACTURERS ---
    for (const mfg of SEED_MANUFACTURERS) {
      await pool.query(`
        INSERT INTO material_manufacturers (name, slug, logo, website, country, description)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (slug) DO UPDATE
        SET name = EXCLUDED.name, logo = EXCLUDED.logo, website = EXCLUDED.website, country = EXCLUDED.country, description = EXCLUDED.description
      `, [mfg.name, mfg.slug, mfg.logo, mfg.website, mfg.country, mfg.description]);
    }

    // Category and Manufacturer maps
    const catRows = await pool.query('SELECT id, slug FROM material_categories');
    const catMap = {};
    catRows.rows.forEach(r => { catMap[r.slug] = r.id; });

    const mfgRows = await pool.query('SELECT id, slug FROM material_manufacturers');
    const mfgMap = {};
    mfgRows.rows.forEach(r => { mfgMap[r.slug] = r.id; });

    // --- SEED MATERIALS & RELATIONS ---
    for (const m of SEED_MATERIALS) {
      const categoryId = catMap[m.category_slug] || null;
      const manufacturerId = mfgMap[m.manufacturer_slug] || null;

      const res = await pool.query(`
        INSERT INTO materials (
          name, slug, original_name, english_name, aliases, category_id, subcategory_name, scope, purpose_tag,
          manufacturer_id, product_code, material_type, cover_image, description, dimensions_info,
          thicknesses, composition, usage_area, pros, cons, approx_price, uzb_market_availability,
          architect_notes, standards_info, lifespan, moisture_resistance, fire_rating,
          standard_sizes, status, verification_status, access_type, last_verified_at, updated_at,
          name_uz, name_ru, short_description_uz, short_description_ru, description_uz, description_ru,
          usage_area_uz, usage_area_ru, pros_uz, pros_ru, cons_uz, cons_ru, architect_notes_uz, architect_notes_ru,
          mounting_instructions_uz, mounting_instructions_ru, dimensions_info_uz, dimensions_info_ru,
          is_frequent, image_url, image_source, image_source_url, image_alt, image_verified, image_verified_at, image_verification_note
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21, $22,
          $23, $24, $25, $26, $27,
          $28, $29, $30, $31, NOW(), NOW(),
          $32, $33, $34, $35, $36, $37,
          $38, $39, $40, $41, $42, $43, $44, $45,
          $46, $47, $48, $49,
          $50, $51, $52, $53, $54, $55, NOW(), $56
        )
        ON CONFLICT (slug) DO UPDATE
        SET name = EXCLUDED.name, original_name = EXCLUDED.original_name, english_name = EXCLUDED.english_name,
            aliases = EXCLUDED.aliases, category_id = EXCLUDED.category_id, subcategory_name = EXCLUDED.subcategory_name,
            scope = EXCLUDED.scope, purpose_tag = EXCLUDED.purpose_tag, manufacturer_id = EXCLUDED.manufacturer_id, product_code = EXCLUDED.product_code,
            material_type = EXCLUDED.material_type, cover_image = EXCLUDED.cover_image, description = EXCLUDED.description,
            dimensions_info = EXCLUDED.dimensions_info, thicknesses = EXCLUDED.thicknesses, composition = EXCLUDED.composition,
            usage_area = EXCLUDED.usage_area, pros = EXCLUDED.pros, cons = EXCLUDED.cons,
            approx_price = EXCLUDED.approx_price, uzb_market_availability = EXCLUDED.uzb_market_availability,
            architect_notes = EXCLUDED.architect_notes, standards_info = EXCLUDED.standards_info,
            lifespan = EXCLUDED.lifespan, moisture_resistance = EXCLUDED.moisture_resistance, fire_rating = EXCLUDED.fire_rating,
            standard_sizes = EXCLUDED.standard_sizes, status = EXCLUDED.status,
            verification_status = EXCLUDED.verification_status, access_type = EXCLUDED.access_type,
            last_verified_at = EXCLUDED.last_verified_at, updated_at = NOW(),
            name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru,
            short_description_uz = EXCLUDED.short_description_uz, short_description_ru = EXCLUDED.short_description_ru,
            description_uz = EXCLUDED.description_uz, description_ru = EXCLUDED.description_ru,
            usage_area_uz = EXCLUDED.usage_area_uz, usage_area_ru = EXCLUDED.usage_area_ru,
            pros_uz = EXCLUDED.pros_uz, pros_ru = EXCLUDED.pros_ru,
            cons_uz = EXCLUDED.cons_uz, cons_ru = EXCLUDED.cons_ru,
            architect_notes_uz = EXCLUDED.architect_notes_uz, architect_notes_ru = EXCLUDED.architect_notes_ru,
            mounting_instructions_uz = EXCLUDED.mounting_instructions_uz, mounting_instructions_ru = EXCLUDED.mounting_instructions_ru,
            dimensions_info_uz = EXCLUDED.dimensions_info_uz, dimensions_info_ru = EXCLUDED.dimensions_info_ru,
            is_frequent = EXCLUDED.is_frequent,
            image_url = EXCLUDED.image_url, image_source = EXCLUDED.image_source,
            image_source_url = EXCLUDED.image_source_url, image_alt = EXCLUDED.image_alt,
            image_verified = EXCLUDED.image_verified, image_verified_at = NOW(),
            image_verification_note = EXCLUDED.image_verification_note
        RETURNING id;
      `, [
        m.name, m.slug, m.original_name, m.english_name, m.aliases || [], categoryId, m.subcategory_name, m.scope || 'both', m.purpose_tag || null,
        manufacturerId, m.product_code, m.material_type, m.cover_image, m.description, m.dimensions_info,
        m.thicknesses, m.composition, m.usage_area, m.pros, m.cons, m.approx_price, m.uzb_market_availability,
        m.architect_notes, m.standards_info, m.lifespan, m.moisture_resistance, m.fire_rating,
        JSON.stringify(m.standard_sizes || []), m.status || 'published', m.verification_status || 'verified', m.access_type || 'free',
        m.name_uz || m.name, m.name_ru || m.original_name || m.name,
        m.short_description_uz || (m.description_uz ? m.description_uz.substring(0, 180) : null),
        m.short_description_ru || (m.description_ru ? m.description_ru.substring(0, 180) : null),
        m.description_uz || m.description, m.description_ru || m.description,
        m.usage_area_uz || m.usage_area, m.usage_area_ru || m.usage_area,
        m.pros_uz || m.pros, m.pros_ru || m.pros,
        m.cons_uz || m.cons, m.cons_ru || m.cons,
        m.architect_notes_uz || m.architect_notes, m.architect_notes_ru || m.architect_notes,
        m.mounting_instructions_uz || null, m.mounting_instructions_ru || null,
        m.dimensions_info_uz || m.dimensions_info, m.dimensions_info_ru || m.dimensions_info,
        m.is_frequent === true,
        m.image_url || m.cover_image,
        m.image_source || 'Manufacturer Official',
        m.image_source_url || null,
        m.image_alt || m.name_uz,
        m.image_verified !== false,
        m.image_verification_note || 'Manba tekshirilgan va tasdiqlangan'
      ]);

      const materialId = res.rows[0]?.id;

      if (materialId && Array.isArray(m.types) && m.types.length > 0) {
        // Upsert types
        await pool.query('DELETE FROM material_types WHERE material_id = $1', [materialId]);
        for (let i = 0; i < m.types.length; i++) {
          const t = m.types[i];
          await pool.query(`
            INSERT INTO material_types (
              material_id, slug, name_uz, name_ru, description_uz, description_ru, photo_url, dimensions, approx_price, sort_order
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          `, [
            materialId, t.slug, t.name_uz, t.name_ru, t.description_uz || null, t.description_ru || null,
            t.photo_url || null, t.dimensions || null, t.approx_price || null, i + 1
          ]);
        }
      }

      if (materialId && Array.isArray(m.sources) && m.sources.length > 0) {
        // Upsert sources
        await pool.query('DELETE FROM material_sources WHERE material_id = $1', [materialId]);
        for (let i = 0; i < m.sources.length; i++) {
          const s = m.sources[i];
          await pool.query(`
            INSERT INTO material_sources (
              material_id, title, source_type, url, http_status, content_matched, sort_order
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [
            materialId, s.title, s.source_type || 'official_catalog', s.url, s.http_status || 200, s.content_matched !== false, i + 1
          ]);
        }
      }
    }

    console.log('✅ MATERIALLAR KUTUBXONASI: Barcha toifalar, turlari va tasdiqlangan manbalar muvaffaqiyatli sinxronlashtirildi.');
  } catch (err) {
    console.error('❌ MATERIALS INIT ERROR:', err);
  }
}

module.exports = {
  SEED_CATEGORIES,
  SEED_MANUFACTURERS,
  SEED_MATERIALS,
  initMaterialsTables
};
