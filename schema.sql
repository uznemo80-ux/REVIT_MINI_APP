-- Revit Mini App — Database Schema (PostgreSQL)

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  first_name TEXT,
  username TEXT,
  access_until TIMESTAMP,          -- NULL = hech qachon to'lov qilmagan
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS modules (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  order_index INT NOT NULL
);

CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  module_id INT REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INT NOT NULL,
  youtube_url TEXT,
  task_text TEXT,                  -- vazifa matni
  is_free BOOLEAN DEFAULT false    -- namuna dars sifatida hammaga ochiqmi
);

CREATE TABLE IF NOT EXISTS lesson_files (
  id SERIAL PRIMARY KEY,
  lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL           -- Telegram file_id yoki tashqi link
);

CREATE TABLE IF NOT EXISTS module_tests (
  id SERIAL PRIMARY KEY,
  module_id INT REFERENCES modules(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,          -- ["A variant","B variant","C variant","D variant"]
  correct_index INT NOT NULL,      -- 0-based index
  order_index INT NOT NULL
);

CREATE TABLE IF NOT EXISTS progress (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
  watched BOOLEAN DEFAULT false,
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS module_results (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  module_id INT REFERENCES modules(id) ON DELETE CASCADE,
  passed BOOLEAN DEFAULT false,
  score INT,
  attempted_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, module_id)
);

CREATE TABLE IF NOT EXISTS payment_requests (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',   -- pending | approved | rejected
  requested_at TIMESTAMP DEFAULT now(),
  approved_at TIMESTAMP,
  approved_by BIGINT               -- admin telegram_id
);
