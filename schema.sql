-- ======================================================
-- YOSHUZBEKK Academy — PostgreSQL Schema
-- ======================================================

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  telegram_id   BIGINT UNIQUE NOT NULL,
  first_name    VARCHAR(255),
  last_name     VARCHAR(255),
  username      VARCHAR(255),
  phone         VARCHAR(50),
  access_until  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ADMINS
CREATE TABLE IF NOT EXISTS admins (
  id            SERIAL PRIMARY KEY,
  telegram_id   BIGINT UNIQUE NOT NULL,
  first_name    VARCHAR(255),
  role          VARCHAR(50) DEFAULT 'admin',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- MODULES
CREATE TABLE IF NOT EXISTS modules (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(500) NOT NULL,
  description   TEXT,
  order_index   INT NOT NULL DEFAULT 0
);

-- LESSONS
CREATE TABLE IF NOT EXISTS lessons (
  id              SERIAL PRIMARY KEY,
  module_id       INT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title           VARCHAR(500) NOT NULL,
  order_index     INT NOT NULL DEFAULT 0,
  youtube_url     TEXT,
  bunny_video_id  VARCHAR(255),
  task_text       TEXT,
  warning_text    TEXT,
  is_free         BOOLEAN DEFAULT FALSE
);

-- LESSON FILES
CREATE TABLE IF NOT EXISTS lesson_files (
  id          SERIAL PRIMARY KEY,
  lesson_id   INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  file_name   VARCHAR(500) NOT NULL,
  file_url    TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- PROGRESS
CREATE TABLE IF NOT EXISTS progress (
  id          SERIAL PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id   INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  watched     BOOLEAN DEFAULT FALSE,
  watched_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- MODULE TESTS
CREATE TABLE IF NOT EXISTS module_tests (
  id              SERIAL PRIMARY KEY,
  module_id       INT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  question        TEXT NOT NULL,
  options         JSONB NOT NULL DEFAULT '[]',
  correct_index   INT NOT NULL DEFAULT 0,
  order_index     INT NOT NULL DEFAULT 0
);

-- MODULE RESULTS
CREATE TABLE IF NOT EXISTS module_results (
  id            SERIAL PRIMARY KEY,
  user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id     INT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  score         INT DEFAULT 0,
  passed        BOOLEAN DEFAULT FALSE,
  attempted_at  TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- PAYMENT REQUESTS
CREATE TABLE IF NOT EXISTS payment_requests (
  id            SERIAL PRIMARY KEY,
  user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status        VARCHAR(50) DEFAULT 'pending',
  approved_at   TIMESTAMPTZ,
  approved_by   BIGINT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- LESSON QUESTIONS & ANSWERS (Q&A)
CREATE TABLE IF NOT EXISTS lesson_questions (
  id            SERIAL PRIMARY KEY,
  lesson_id     INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question      TEXT NOT NULL,
  answer        TEXT,
  status        VARCHAR(30) NOT NULL DEFAULT 'pending',
  is_public     BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  answered_at   TIMESTAMPTZ,
  answered_by   BIGINT
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_admins_telegram_id ON admins(telegram_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lesson_files_lesson_id ON lesson_files(lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson_id ON progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_module_tests_module_id ON module_tests(module_id);
CREATE INDEX IF NOT EXISTS idx_module_results_user_id ON module_results(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_user_id ON payment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_questions_lesson_id ON lesson_questions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_questions_user_id ON lesson_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_questions_status ON lesson_questions(status);
CREATE INDEX IF NOT EXISTS idx_lesson_questions_is_public ON lesson_questions(is_public);

-- COURSE SHOWCASES / PORTFOLIO (PDF & RESULT SLIDER)
CREATE TABLE IF NOT EXISTS course_showcases (
  id                SERIAL PRIMARY KEY,
  course_id         INT REFERENCES courses(id) ON DELETE SET NULL,
  course_title      VARCHAR(255),
  title             VARCHAR(255) NOT NULL,
  student_name      VARCHAR(255),
  description       TEXT,
  pdf_url           TEXT NOT NULL,
  preview_image_url TEXT,
  discount_badge    TEXT,
  order_index       INT DEFAULT 0,
  selected_pages    TEXT DEFAULT '1, 2, 3, 4, 5',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- LIBRARY OPEN RESOURCES (ERKIN TESTLAR, KITOB VA OCHIQ MANBALAR)
CREATE TABLE IF NOT EXISTS library_open_resources (
  id                SERIAL PRIMARY KEY,
  type              VARCHAR(50) NOT NULL, -- 'book', 'source', 'video', 'test'
  title             VARCHAR(255) NOT NULL,
  category          VARCHAR(100),
  description       TEXT,
  link_url          TEXT,
  test_data         JSONB DEFAULT '[]',
  icon              VARCHAR(50),
  order_index       INT DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- CONSTRUCTION & RENOVATION MATERIALS (MARKETPLACE / ENSIKLOPEDIYA)
CREATE TABLE IF NOT EXISTS construction_materials (
  id                SERIAL PRIMARY KEY,
  title             VARCHAR(255) NOT NULL,
  category          VARCHAR(100) NOT NULL,
  sub_category      VARCHAR(100) NOT NULL,
  image_url         TEXT,
  short_desc        TEXT,
  what_is_it        TEXT,
  dimensions        TEXT,
  history           TEXT,
  usage_area        TEXT,
  pros              TEXT,
  cons              TEXT,
  uzbekistan_sources TEXT,
  bim_tips          TEXT,
  order_index       INT DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_course_showcases_course_id ON course_showcases(course_id);
CREATE INDEX IF NOT EXISTS idx_construction_materials_category ON construction_materials(category);
CREATE INDEX IF NOT EXISTS idx_library_open_resources_type ON library_open_resources(type);

-- ======================================================
-- LEARNING CENTER (ARXITEKTURA VA ISHCHI HUJJATLAR KNOWLEDGE BASE)
-- ======================================================

-- 01..09 O'RGANISH BOSQICHLARI (ROADMAP)
CREATE TABLE IF NOT EXISTS learning_stages (
  id            SERIAL PRIMARY KEY,
  stage_number  INT NOT NULL UNIQUE,
  title         VARCHAR(255) NOT NULL,
  subtitle      VARCHAR(500),
  description   TEXT,
  topics        JSONB NOT NULL DEFAULT '[]',
  order_index   INT NOT NULL DEFAULT 0,
  is_pro        BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- KITOBLAR, QO'LLANMALAR, STANDARTLAR VA REAL PROYEKTLAR RESURSLARI
CREATE TABLE IF NOT EXISTS learning_resources (
  id                  SERIAL PRIMARY KEY,
  stage_id            INT REFERENCES learning_stages(id) ON DELETE SET NULL,
  title               VARCHAR(500) NOT NULL,
  author              VARCHAR(255),
  year                VARCHAR(50),
  language            VARCHAR(50) DEFAULT 'uz',
  topic               VARCHAR(255),
  benefit_description TEXT,
  resource_type       VARCHAR(50) NOT NULL,
  pdf_url             TEXT,
  web_url             TEXT,
  is_free             BOOLEAN DEFAULT TRUE,
  is_pro              BOOLEAN DEFAULT FALSE,
  order_index         INT NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- MAXSUS JADVALLAR (NORMATIVLAR, TOP 10, CHECKLISTLAR)
CREATE TABLE IF NOT EXISTS learning_tables (
  id          SERIAL PRIMARY KEY,
  table_key   VARCHAR(100) NOT NULL UNIQUE,
  title       VARCHAR(255) NOT NULL,
  subtitle    TEXT,
  columns     JSONB NOT NULL DEFAULT '[]',
  rows        JSONB NOT NULL DEFAULT '[]',
  order_index INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- FOYDALANUVCHILARNING O'RGANISH PROGRESSI (TUGATILGAN BOSQICHLAR)
CREATE TABLE IF NOT EXISTS learning_progress (
  id            SERIAL PRIMARY KEY,
  user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stage_id      INT NOT NULL REFERENCES learning_stages(id) ON DELETE CASCADE,
  completed_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, stage_id)
);

CREATE INDEX IF NOT EXISTS idx_learning_stages_order ON learning_stages(order_index, stage_number);
CREATE INDEX IF NOT EXISTS idx_learning_resources_stage ON learning_resources(stage_id, resource_type);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON learning_progress(user_id);

-- ======================================================
-- MATERIALLAR KUTUBXONASI (MATERIALS KNOWLEDGE BASE)
-- ======================================================

CREATE TABLE IF NOT EXISTS material_categories (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  icon        VARCHAR(50) DEFAULT '🧱',
  description TEXT,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS material_manufacturers (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  logo        VARCHAR(500),
  website     VARCHAR(500),
  country     VARCHAR(100),
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS materials (
  id                  SERIAL PRIMARY KEY,
  name                VARCHAR(255) NOT NULL,
  slug                VARCHAR(255) NOT NULL UNIQUE,
  original_name       VARCHAR(255),
  english_name        VARCHAR(255),
  aliases             TEXT[] DEFAULT '{}',
  category_id         INT REFERENCES material_categories(id) ON DELETE SET NULL,
  subcategory_name    VARCHAR(255),
  manufacturer_id     INT REFERENCES material_manufacturers(id) ON DELETE SET NULL,
  product_code        VARCHAR(100),
  material_type       VARCHAR(255),
  cover_image         VARCHAR(500),
  gallery             JSONB DEFAULT '[]',
  description         TEXT,
  dimensions_info     TEXT,
  status              VARCHAR(50) DEFAULT 'published',
  verification_status VARCHAR(50) DEFAULT 'verified',
  access_type         VARCHAR(50) DEFAULT 'free',
  last_verified_at    TIMESTAMPTZ DEFAULT NOW(),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS material_sources (
  id               SERIAL PRIMARY KEY,
  material_id      INT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  source_type      VARCHAR(50) NOT NULL,
  title            VARCHAR(500) NOT NULL,
  url              TEXT NOT NULL,
  publisher        VARCHAR(255),
  document_name    VARCHAR(255),
  document_version VARCHAR(100),
  published_date   VARCHAR(100),
  retrieved_at     TIMESTAMPTZ DEFAULT NOW(),
  last_checked_at  TIMESTAMPTZ DEFAULT NOW(),
  status           VARCHAR(50) DEFAULT 'verified',
  is_primary       BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS material_specifications (
  id                    SERIAL PRIMARY KEY,
  material_id           INT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  parameter             VARCHAR(100) NOT NULL,
  parameter_label       VARCHAR(255) NOT NULL,
  value                 VARCHAR(255) NOT NULL,
  unit                  VARCHAR(50),
  source_id             INT REFERENCES material_sources(id) ON DELETE SET NULL,
  source_document_page  VARCHAR(50),
  confidence            NUMERIC(3,2) DEFAULT 1.0,
  verified_at           TIMESTAMPTZ DEFAULT NOW(),
  order_index           INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS material_documents (
  id              SERIAL PRIMARY KEY,
  material_id     INT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  title           VARCHAR(500) NOT NULL,
  document_type   VARCHAR(50) NOT NULL,
  url             TEXT NOT NULL,
  file_url        TEXT,
  version         VARCHAR(100),
  language        VARCHAR(50) DEFAULT 'uz',
  published_date  VARCHAR(100),
  order_index     INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS material_applications (
  id                SERIAL PRIMARY KEY,
  material_id       INT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  application_type  VARCHAR(50) NOT NULL,
  title             VARCHAR(255),
  description       TEXT NOT NULL,
  source_id         INT REFERENCES material_sources(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS material_requirements (
  id                SERIAL PRIMARY KEY,
  material_id       INT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  requirement_type  VARCHAR(50) NOT NULL,
  title             VARCHAR(255),
  description       TEXT NOT NULL,
  step_number       INT,
  source_id         INT REFERENCES material_sources(id) ON DELETE SET NULL,
  order_index       INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS material_version_history (
  id                SERIAL PRIMARY KEY,
  material_id       INT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  parameter         VARCHAR(100) NOT NULL,
  old_value         TEXT,
  new_value         TEXT,
  change_difference TEXT,
  source_document   VARCHAR(255),
  source_id         INT REFERENCES material_sources(id) ON DELETE SET NULL,
  changed_by        INT REFERENCES users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS material_audit_logs (
  id          SERIAL PRIMARY KEY,
  material_id INT REFERENCES materials(id) ON DELETE SET NULL,
  admin_id    INT REFERENCES users(id) ON DELETE SET NULL,
  admin_name  VARCHAR(255),
  action      VARCHAR(100) NOT NULL,
  details     JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category_id, status);
CREATE INDEX IF NOT EXISTS idx_materials_mfg ON materials(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_materials_slug ON materials(slug);
CREATE INDEX IF NOT EXISTS idx_material_specs_mat ON material_specifications(material_id);
CREATE INDEX IF NOT EXISTS idx_material_sources_mat ON material_sources(material_id);
CREATE INDEX IF NOT EXISTS idx_material_docs_mat ON material_documents(material_id);
CREATE INDEX IF NOT EXISTS idx_material_apps_mat ON material_applications(material_id);
CREATE INDEX IF NOT EXISTS idx_material_reqs_mat ON material_requirements(material_id);



