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
