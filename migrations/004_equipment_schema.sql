-- ============================================================================
-- YOSHUZBEKK — Migration 004: Equipment (Jihozlar) — MVP
-- ============================================================================
--
-- Branch: feature-equipment-mvp
-- Holat:  TAYYOR — production DB'da ISHLATILMAGAN
--
-- Scope: MVP — 3 kategoriya
--   1. ❄️ Konditsionerlar
--   2. 🧺 Kir yuvish va quritish
--   3. 🍳 Oshxona texnikalari
--
-- ---------------------------------------------------------------------------
-- ARXITEKTURA QARORI
-- ---------------------------------------------------------------------------
-- materials jadvali KO'CHIRILMAYDI. Equipment uchun alohida,
-- o'z nomlari bilan tuzilma. Sabab: materials — qurilish materiallari
-- uchun (og'irlik/zichlik/standart), equipment — texnik uskunalar
-- uchun (quvvat/montaj/ulanish). Semantika boshqacha.
--
-- DINAMIK PARAMETRLAR (sizning talab: "50 ta NULL ustun yomon schema"):
--   equipment_specifications  — EAV (parameter/value/unit/source)
--   equipment_parameter_defs  — kategoriya bo'yicha parametrlar + filterable
--   Shuning uchun yangi kategoriya qo'shish = FAQAT seed qo'shish,
--   schema o'zgarishsiz.
--
-- XAVFSIZLIK:
--   ❌ DROP / DELETE / TRUNCATE / UPDATE — umuman yo'q
--   ❌ Mavjud jadvallarga ALTER — yo'q
--   ❌ construction_materials / materials / library_* — tegilmaydi
--   ✅ Faqat YANGI equipment_* jadvallar
--   ✅ IF NOT EXISTS — qayta ishga tushirilsa xato bermaydi
--   ✅ Transaction ichida
--   ✅ likes/saves CHECK constraint bilan (orphan profilaktkasi)
--
-- ============================================================================


BEGIN;

-- ############################################################################
-- 1. equipment_categories — kategoriya ierarxiyasi
-- ############################################################################
-- parent_id → ichki kategoriyalar (MVP uchun 2 daraja yetarli)
CREATE TABLE IF NOT EXISTS equipment_categories (
  id          SERIAL PRIMARY KEY,
  slug        VARCHAR(150) NOT NULL UNIQUE,
  name_uz     VARCHAR(255) NOT NULL,
  name_ru     VARCHAR(255),
  name_en     VARCHAR(255),
  icon        VARCHAR(16),
  parent_id   INT REFERENCES equipment_categories(id) ON DELETE SET NULL,
  description_uz TEXT,
  order_index INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_equipment_categories_parent
  ON equipment_categories(parent_id, order_index);


-- ############################################################################
-- 2. equipment_subtypes — kategoriya ichidagi ANIQ TURLAR
-- ############################################################################
-- "Devoriy split", "Inverter split", "Front-load" va h.k.
CREATE TABLE IF NOT EXISTS equipment_subtypes (
  id          SERIAL PRIMARY KEY,
  category_id INT NOT NULL REFERENCES equipment_categories(id) ON DELETE CASCADE,
  slug        VARCHAR(150) NOT NULL UNIQUE,
  name_uz     VARCHAR(255) NOT NULL,
  name_ru     VARCHAR(255),
  name_en     VARCHAR(255),
  order_index INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_equipment_subtypes_category
  ON equipment_subtypes(category_id, order_index);


-- ############################################################################
-- 3. equipment_manufacturers
-- ############################################################################
CREATE TABLE IF NOT EXISTS equipment_manufacturers (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(255) NOT NULL,
  slug         VARCHAR(255) NOT NULL UNIQUE,
  country      VARCHAR(100),
  website      TEXT,
  support_url  TEXT,
  logo_url     TEXT,
  description  TEXT,
  order_index  INT DEFAULT 0,
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);


-- ############################################################################
-- 4. equipment_parameter_defs — DINAMIK parametrlar ta'rifi
-- ############################################################################
-- category_id NULL = barcha kategoriyalar uchun umumiy parametrlar
-- filterable = true → frontendda dinamik filtr sifatida chiqadi
CREATE TABLE IF NOT EXISTS equipment_parameter_defs (
  id          SERIAL PRIMARY KEY,
  category_id INT REFERENCES equipment_categories(id) ON DELETE CASCADE,
  param_key   VARCHAR(100) NOT NULL,
  label_uz    VARCHAR(255) NOT NULL,
  label_ru    VARCHAR(255),
  unit        VARCHAR(50),
  data_type   VARCHAR(20) DEFAULT 'text',  -- text|number|enum|bool
  enum_values TEXT[],                      -- data_type='enum' uchun
  filterable  BOOLEAN DEFAULT false,
  sort_order  INT DEFAULT 0,

  -- M2: 'range' turi ataylab yo'q: equipment_specifications da faqat
  -- value_num (bitta raqam) bor, diapazon uchun maydon yo'q.
  -- Kelajakda alohida migration bilan value_num_min/max qo'shiladi.
  CONSTRAINT eq_dtype_check
    CHECK (data_type IN ('text','number','enum','bool'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_equipment_param_defs_key
  ON equipment_parameter_defs(COALESCE(category_id, 0), param_key);


-- ############################################################################
-- 5. equipment — ASOSIY ENTITY
-- ############################################################################
CREATE TABLE IF NOT EXISTS equipment (
  id                SERIAL PRIMARY KEY,
  slug              VARCHAR(255) NOT NULL UNIQUE,

  -- nomlar
  name_uz           VARCHAR(255) NOT NULL,
  name_ru           VARCHAR(255),
  name_en           VARCHAR(255),
  aliases           TEXT[] DEFAULT '{}',

  -- tasniflash
  category_id       INT NOT NULL REFERENCES equipment_categories(id) ON DELETE RESTRICT,
  subtype_id        INT REFERENCES equipment_subtypes(id) ON DELETE SET NULL,
  manufacturer_id   INT REFERENCES equipment_manufacturers(id) ON DELETE SET NULL,
  model             VARCHAR(255),
  sku               VARCHAR(150),
  brand             VARCHAR(150),

  -- tavsif
  short_desc        TEXT,
  description_uz    TEXT,
  description_ru    TEXT,
  description_en    TEXT,
  usage_note_uz     TEXT,   -- "nima uchun ishlatiladi"
  advantages        TEXT[], -- afzalliklar
  limitations       TEXT[], -- cheklovlar

  -- rasm
  cover_image       TEXT,
  gallery           JSONB DEFAULT '[]',   -- {type,url,alt}[]

  -- holat
  status                VARCHAR(30) DEFAULT 'draft',       -- draft|pending_review|published|archived
  verification_status   VARCHAR(30) DEFAULT 'pending',     -- pending|verified|failed
  review_notes          TEXT,
  published_at          TIMESTAMPTZ,
  order_index           INT DEFAULT 0,                    -- katalog saralash
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),

  -- M1: status va verification_status ni CHECK bilan cheklash.
  -- SQL izohi majburlash kuchiga ega emas: noto'g'ri status yozilsa,
  -- public filtr (WHERE status='published') mahsulotni yashirib qo'yadi
  -- va sabab topib bo'lmaydi. Rasmiy DB da sinovdan o'tgan.
  CONSTRAINT eq_status_check
    CHECK (status IN ('draft','pending_review','published','archived')),
  CONSTRAINT eq_verif_check
    CHECK (verification_status IN ('pending','verified','failed'))
);

-- Foydalanuvchi endpoint'i shu indeksni ishlatadi
CREATE INDEX IF NOT EXISTS idx_equipment_status_cat
  ON equipment(status, category_id, order_index);
CREATE INDEX IF NOT EXISTS idx_equipment_subtype   ON equipment(subtype_id);
CREATE INDEX IF NOT EXISTS idx_equipment_manuf     ON equipment(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_equipment_search    ON equipment USING GIN (
  to_tsvector('simple',
    coalesce(name_uz,'') || ' ' || coalesce(name_ru,'') || ' ' ||
    coalesce(name_en,'') || ' ' || coalesce(model,'')  || ' ' ||
    coalesce(sku,'')    || ' ' || coalesce(brand,''))
);
CREATE INDEX IF NOT EXISTS idx_equipment_aliases ON equipment USING GIN(aliases);


-- ############################################################################
-- 6. equipment_dimensions — o'lchamlar + SERVIS BO'SHLIG'I
-- ############################################################################
-- service_clearance JSONB: {"left_mm":..,"right_mm":..,"top_mm":..,"front_mm":..}
-- Arxitektur uchun eng muhim maydon (§17)
CREATE TABLE IF NOT EXISTS equipment_dimensions (
  id                SERIAL PRIMARY KEY,
  equipment_id      INT NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  width_mm          INT,
  height_mm         INT,
  depth_mm          INT,
  diameter_mm       INT,
  weight_kg         NUMERIC(8,2),
  unit_note         TEXT,          -- "ishlab chiqaruvchiga qarab farq qiladi"
  service_clearance JSONB DEFAULT '{}',
  source_id         INT,
  UNIQUE(equipment_id)
);


-- ############################################################################
-- 7. equipment_specifications — DINAMIK texnik parametrlar (EAV)
-- ############################################################################
CREATE TABLE IF NOT EXISTS equipment_specifications (
  id           SERIAL PRIMARY KEY,
  equipment_id INT NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  param_id     INT REFERENCES equipment_parameter_defs(id) ON DELETE CASCADE,
  param_key    VARCHAR(100) NOT NULL,   -- FKsiz ham saqlanadi (import mosligi)
  value_text   TEXT,
  value_num    NUMERIC(14,3),
  unit         VARCHAR(50),
  source_id    INT,
  UNIQUE(equipment_id, param_key)
);

CREATE INDEX IF NOT EXISTS idx_equipment_specs_key
  ON equipment_specifications(param_key, value_text);
CREATE INDEX IF NOT EXISTS idx_equipment_specs_num
  ON equipment_specifications(param_key, value_num);


-- ############################################################################
-- 8. equipment_installations — montaj ma'lumotlari (§4)
-- ############################################################################
CREATE TABLE IF NOT EXISTS equipment_installations (
  id                SERIAL PRIMARY KEY,
  equipment_id      INT NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  mount_type        VARCHAR(50),   -- built_in|freestanding|wall|ceiling|floor|recessed
  location_note     TEXT,
  min_clearance     JSONB DEFAULT '{}',  -- chap/o'ng/yuqori/orqa mm
  service_space     TEXT,               -- texnik xizmat uchun joy
  door_swing        TEXT,               -- eshik ochilish maydoni
  access_note       TEXT,
  source_id         INT,
  UNIQUE(equipment_id)
);


-- ############################################################################
-- 9. equipment_connections — muhandislik ulanishlari (§5)
-- ############################################################################
CREATE TABLE IF NOT EXISTS equipment_connections (
  id            SERIAL PRIMARY KEY,
  equipment_id  INT NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  conn_type     VARCHAR(50) NOT NULL,  -- electric|water_in|water_out|drain|gas|ventilation|refrigerant|duct|coaxial
  spec_detail   VARCHAR(150),         -- masalan "220-240V, 50Hz"
  diameter_mm   INT,
  location      VARCHAR(100),         -- "orqa panel, o'ng tomonda"
  height_mm     INT,
  min_distance  VARCHAR(150),         -- talab qilinadigan masofa
  notes         TEXT,
  source_id     INT,

  -- M3: bir mahsulot uchun bir xil ulanish turi takrorlanmasin.
  CONSTRAINT eq_conn_u UNIQUE (equipment_id, conn_type)
);

CREATE INDEX IF NOT EXISTS idx_equipment_conn_equipment
  ON equipment_connections(equipment_id);


-- ############################################################################
-- 10. equipment_applications — "Qayerda ishlatiladi" (§7)
-- ############################################################################
CREATE TABLE IF NOT EXISTS equipment_applications (
  id           SERIAL PRIMARY KEY,
  equipment_id INT NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  room_type    VARCHAR(100) NOT NULL,  -- yotoqxona|oshxona|ofis|...
  room_type_ru VARCHAR(100),
  note         TEXT,
  UNIQUE(equipment_id, room_type)
);


-- ############################################################################
-- 11. engineering_notes — "Loyihalashda e'tibor berish" (§6)
-- ############################################################################
-- materials jadvalida bunday blok YO'Q — alohida jadval qilindi
CREATE TABLE IF NOT EXISTS engineering_notes (
  id           SERIAL PRIMARY KEY,
  equipment_id INT NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  note_uz      TEXT NOT NULL,
  note_ru      TEXT,
  category     VARCHAR(100),  -- 'placement'|'clearance'|'integration'|'revit'|'utilities'
  sort_order   INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_engineering_notes_equipment
  ON engineering_notes(equipment_id, sort_order);


-- ############################################################################
-- 12. equipment_sources — RASMIY MANBA + VERIFIKATSIYA (§18)
-- ############################################################################
-- manufacturer_source = true → rasmiy ishlab chiqaruvchi
-- verified = false → admin hali tekshirmagan
CREATE TABLE IF NOT EXISTS equipment_sources (
  id                  SERIAL PRIMARY KEY,
  equipment_id        INT NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  source_url          TEXT NOT NULL,
  source_type         VARCHAR(50) NOT NULL,
    -- official_product_page|official_datasheet|official_catalog|
    -- installation_manual|official_distributor|manufacturer_site
  source_title        VARCHAR(500),
  publisher           VARCHAR(255),
  source_date         VARCHAR(100),
  manufacturer_source BOOLEAN DEFAULT false,
  verified            BOOLEAN DEFAULT false,
  verified_at         TIMESTAMPTZ,
  verified_by         BIGINT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_equipment_sources_equipment
  ON equipment_sources(equipment_id);


-- ############################################################################
-- 13. equipment_documents — hujjatlar (§8)
-- ############################################################################
CREATE TABLE IF NOT EXISTS equipment_documents (
  id           SERIAL PRIMARY KEY,
  equipment_id INT NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  doc_type     VARCHAR(50) NOT NULL,
    -- product_page|datasheet|installation_manual|user_manual|
    -- catalog|specification|dwg|dxf|bim|revit_rfa|3d_model|step|sat|pdf
  title        VARCHAR(500),
  url          TEXT NOT NULL,
  file_format  VARCHAR(20),
  file_size_kb INT,
  verified     BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW(),

  -- M3: bir xil hujjat bir mahsulotga ikki marta qo'shilmasin.
  CONSTRAINT eq_doc_u UNIQUE (equipment_id, doc_type, url)
);

CREATE INDEX IF NOT EXISTS idx_equipment_docs_equipment
  ON equipment_documents(equipment_id);


-- ############################################################################
-- 14. equipment_images — 5 xil rasm (§9)
-- ############################################################################
CREATE TABLE IF NOT EXISTS equipment_images (
  id           SERIAL PRIMARY KEY,
  equipment_id INT NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  image_type   VARCHAR(30) NOT NULL,
    -- cover|product|dimensions|installation|technical
  url          TEXT NOT NULL,
  alt_text     VARCHAR(255),
  source_id    INT,
  sort_order   INT DEFAULT 0,

  -- M3: bir mahsulot uchun bir xil rasm turi bir marta.
  -- Materials modulida aynan shu yo'qligi uchun duplicate guruh yig'ilgan
  -- edi. Bu UNIQUE shuni oldindan to'sadi.
  CONSTRAINT eq_img_u UNIQUE (equipment_id, image_type)
);

CREATE INDEX IF NOT EXISTS idx_equipment_images_equipment
  ON equipment_images(equipment_id, image_type);


-- ############################################################################
-- 15. equipment_likes / equipment_saves
-- ############################################################################
-- materials dagi kabi, lekin orphan profilaktkasi bilan
CREATE TABLE IF NOT EXISTS equipment_likes (
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  equipment_id INT NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, equipment_id)
);

CREATE TABLE IF NOT EXISTS equipment_saves (
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  equipment_id INT NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, equipment_id)
);


-- ############################################################################
-- 16. equipment_audit_logs
-- ############################################################################
CREATE TABLE IF NOT EXISTS equipment_audit_logs (
  id          SERIAL PRIMARY KEY,
  equipment_id INT REFERENCES equipment(id) ON DELETE SET NULL,
  admin_id    BIGINT,
  admin_name  VARCHAR(255),
  action      VARCHAR(100) NOT NULL,
  details     JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_equipment_audit_equipment
  ON equipment_audit_logs(equipment_id, created_at DESC);


-- ############################################################################
-- 17. equipment_saved_buckets — "Saqlangan jihozlar" (profil uchun, §15)
-- ############################################################################
CREATE TABLE IF NOT EXISTS equipment_saved_buckets (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);


COMMIT;

-- ============================================================================
-- TEKSHIRUV (faqat SELECT)
-- ============================================================================
SELECT COUNT(*) AS equipment_tables
FROM information_schema.tables
WHERE table_name LIKE 'equipment_%' OR table_name = 'engineering_notes';

-- KUTILAYOTGAN: 16
-- (15 equipment_* + engineering_notes)

-- ============================================================================
-- ROLLBACK (kerak bo'lsa) — faqat equipment_* jadvallar
-- ============================================================================
-- DROP TABLE IF EXISTS equipment_saved_buckets, equipment_audit_logs,
--   equipment_images, equipment_documents, equipment_sources,
--   engineering_notes, equipment_applications, equipment_connections,
--   equipment_installations, equipment_specifications, equipment_dimensions,
--   equipment, equipment_parameter_defs, equipment_manufacturers,
--   equipment_subtypes, equipment_categories CASCADE;
--
-- ESLATMA: Rollback FAQAT equipment_* jadvallarga tegadi.
-- materials, library_books, library_resources, construction_materials —
-- umuman tegilmaydi.
-- ============================================================================
