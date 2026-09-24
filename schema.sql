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

