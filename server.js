require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { verifyInitData } = require('./verifyTelegram');
const { bot, notifyAdmin } = require('./bot');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

async function getOrCreateUser(initData) {
  const tgUser = verifyInitData(initData, process.env.BOT_TOKEN);
  if (!tgUser) return null;

  const { rows } = await pool.query(
    `INSERT INTO users (telegram_id, first_name, username)
     VALUES ($1, $2, $3)
     ON CONFLICT (telegram_id) DO UPDATE SET first_name = $2, username = $3
     RETURNING *`,
    [tgUser.id, tgUser.first_name, tgUser.username]
  );
  return rows[0];
}

function hasAccess(user) {
  return user.access_until && new Date(user.access_until) > new Date();
}

app.post('/api/auth', async (req, res) => {
  const user = await getOrCreateUser(req.body.initData);
  if (!user) return res.status(401).json({ error: 'Tekshirishdan o‘tmadi' });
  res.json({
    telegram_id: user.telegram_id.toString(),
    first_name: user.first_name,
    has_access: hasAccess(user),
    access_until: user.access_until
  });
});

app.post('/api/content', async (req, res) => {
  const user = await getOrCreateUser(req.body.initData);
  if (!user) return res.status(401).json({ error: 'Tekshirishdan o‘tmadi' });
  const unlocked = hasAccess(user);

  const modules = (await pool.query('SELECT * FROM modules ORDER BY order_index')).rows;
  const lessons = (await pool.query('SELECT * FROM lessons ORDER BY order_index')).rows;
  const results = (await pool.query('SELECT * FROM module_results WHERE user_id = $1', [user.id])).rows;

  const passedModuleIds = new Set(results.filter(r => r.passed).map(r => r.module_id));

  const data = modules.map((m, idx) => {
    const moduleUnlocked = idx === 0 || passedModuleIds.has(modules[idx - 1].id);
    return {
      id: m.id,
      title: m.title,
      unlocked: moduleUnlocked,
      passed_test: passedModuleIds.has(m.id),
      lessons: lessons
        .filter(l => l.module_id === m.id)
        .map(l => ({
          id: l.id,
          title: l.title,
          is_free: l.is_free,
          task_text: l.task_text,
          available: l.is_free || (unlocked && moduleUnlocked)
        }))
    };
  });

  res.json({
    has_access: unlocked,
    access_until: user.access_until,
    telegram_id: user.telegram_id.toString(),
    first_name: user.first_name,
    modules: data
  });
});

app.post('/api/lesson/:id', async (req, res) => {
  const user = await getOrCreateUser(req.body.initData);
  if (!user) return res.status(401).json({ error: 'Tekshirishdan o‘tmadi' });

  const lessonRes = await pool.query('SELECT * FROM lessons WHERE id = $1', [req.params.id]);
  const lesson = lessonRes.rows[0];
  if (!lesson) return res.status(404).json({ error: 'Dars topilmadi' });

  if (!lesson.is_free && !hasAccess(user)) {
    return res.status(403).json({ error: 'locked', message: 'Bu dars uchun to‘lov qilinishi kerak' });
  }

  const files = (await pool.query('SELECT file_name, file_url FROM lesson_files WHERE lesson_id = $1', [lesson.id])).rows;

  await pool.query(
    `INSERT INTO progress (user_id, lesson_id, watched) VALUES ($1, $2, true)
     ON CONFLICT (user_id, lesson_id) DO UPDATE SET watched = true`,
    [user.id, lesson.id]
  );

  res.json({
    id: lesson.id,
    title: lesson.title,
    youtube_url: lesson.youtube_url,
    task_text: lesson.task_text,
    files
  });
});

app.post('/api/module/:id/test', async (req, res) => {
  const user = await getOrCreateUser(req.body.initData);
  if (!user) return res.status(401).json({ error: 'Tekshirishdan o‘tmadi' });

  const questions = (await pool.query(
    'SELECT id, question, options, order_index FROM module_tests WHERE module_id = $1 ORDER BY order_index',
    [req.params.id]
  )).rows;
  res.json({ questions });
});

app.post('/api/module/:id/submit', async (req, res) => {
  const user = await getOrCreateUser(req.body.initData);
  if (!user) return res.status(401).json({ error: 'Tekshirishdan o‘tmadi' });

  const { answers } = req.body;
  const questions = (await pool.query(
    'SELECT id, correct_index FROM module_tests WHERE module_id = $1', [req.params.id]
  )).rows;

  let correct = 0;
  for (const q of questions) {
    if (answers[q.id] === q.correct_index) correct++;
  }
  const score = Math.round((correct / questions.length) * 100);
  const passed = score >= 70;

  await pool.query(
    `INSERT INTO module_results (user_id, module_id, passed, score)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, module_id) DO UPDATE SET passed = $3, score = $4, attempted_at = now()`,
    [user.id, req.params.id, passed, score]
  );

  res.json({ score, passed });
});

app.post('/api/request-access', async (req, res) => {
  const user = await getOrCreateUser(req.body.initData);
  if (!user) return res.status(401).json({ error: 'Tekshirishdan o‘tmadi' });

  await pool.query('INSERT INTO payment_requests (user_id) VALUES ($1)', [user.id]);
  await notifyAdmin(
    `💰 Yangi to'lov so'rovi!\n` +
    `Ism: ${user.first_name} (@${user.username || 'username yo‘q'})\n` +
    `Telegram ID: ${user.telegram_id}\n\n` +
    `Tasdiqlash uchun: /approve ${user.telegram_id}`
  );
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ${PORT}-portda ishga tushdi`));
