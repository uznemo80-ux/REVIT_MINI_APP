require('dotenv').config();

var crypto = require('crypto');
var express = require('express');
var cors = require('cors');
var pgModule = require('pg');
var Pool = pgModule.Pool;

var verifyModule = require('./verifyTelegram');
var verifyInitData = verifyModule.verifyInitData;
var botModule = require('./bot');
var notifyAdmin = botModule.notifyAdmin;

var app = express();

// ======================================================
// CONFIG
// ======================================================

var PORT = process.env.PORT || 3000;

var ADMIN_TELEGRAM_ID = String(
  process.env.ADMIN_TELEGRAM_ID || '8043641301'
).trim();

console.log('ADMIN TELEGRAM ID: ' + ADMIN_TELEGRAM_ID);

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());

app.use(express.json({ limit: '10mb' }));

app.use(express.static('public', {
  etag: false,
  lastModified: false,
  setHeaders: function (res) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  }
}));

// ======================================================
// DATABASE
// ======================================================

var pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', function (error) {
  console.error('DATABASE POOL ERROR:', error);
});

// ======================================================
// BUNNY STREAM
// ======================================================

function generateBunnyToken(videoId, expiresAt) {
  var securityKey = process.env.BUNNY_TOKEN_AUTH_KEY;
  if (!securityKey) {
    throw new Error('BUNNY_TOKEN_AUTH_KEY topilmadi');
  }
  var hashableString = securityKey + videoId + expiresAt;
  return crypto.createHash('sha256').update(hashableString).digest('hex');
}

function generateBunnyPlayerUrl(libraryId, videoId) {
  var expiresAt = Math.floor(Date.now() / 1000) + 2 * 60 * 60;
  var token = generateBunnyToken(videoId, expiresAt);
  return 'https://iframe.mediadelivery.net/embed/' + libraryId + '/' + videoId + '?token=' + token + '&expires=' + expiresAt;
}

// ======================================================
// YOUTUBE
// ======================================================

function getYouTubeVideoId(url) {
  if (!url) return null;
  try {
    var parsedUrl = new URL(url);
    var hostname = parsedUrl.hostname.toLowerCase();
    if (hostname === 'youtu.be') {
      return parsedUrl.pathname.replace(/^\/+/, '').split('/')[0].trim() || null;
    }
    if (hostname === 'youtube.com' || hostname === 'www.youtube.com' || hostname === 'm.youtube.com') {
      var videoId = parsedUrl.searchParams.get('v');
      if (videoId) return videoId;
      var embedMatch = parsedUrl.pathname.match(/^\/embed\/([^/]+)/);
      if (embedMatch) return embedMatch[1];
      var shortsMatch = parsedUrl.pathname.match(/^\/shorts\/([^/]+)/);
      if (shortsMatch) return shortsMatch[1];
    }
    return null;
  } catch (error) {
    console.error('YOUTUBE URL ERROR:', error.message);
    return null;
  }
}

function generateYouTubePlayerUrl(youtubeUrl) {
  var videoId = getYouTubeVideoId(youtubeUrl);
  if (!videoId) return null;
  return 'https://www.youtube.com/embed/' + videoId + '?rel=0&modestbranding=1';
}

// ======================================================
// ACCESS
// ======================================================

function hasAccess(user) {
  if (!user) return false;
  if (!user.access_until) return false;
  return new Date(user.access_until) > new Date();
}

// ======================================================
// GET / CREATE TELEGRAM USER
// ======================================================

async function getOrCreateUser(initData) {
  if (!initData) {
    console.error('GET USER ERROR: initData mavjud emas');
    return null;
  }
  var tgUser = verifyInitData(initData, process.env.BOT_TOKEN);
  if (!tgUser) {
    console.error('GET USER ERROR: Telegram initData notogri');
    return null;
  }
  var result = await pool.query(
    'INSERT INTO users (telegram_id, first_name, last_name, username) VALUES ($1, $2, $3, $4) ON CONFLICT (telegram_id) DO UPDATE SET first_name = CASE WHEN users.first_name IS NULL OR TRIM(users.first_name) = \'\' THEN EXCLUDED.first_name ELSE users.first_name END, last_name = CASE WHEN users.last_name IS NULL OR TRIM(users.last_name) = \'\' THEN EXCLUDED.last_name ELSE users.last_name END, username = EXCLUDED.username RETURNING *',
    [tgUser.id, tgUser.first_name || '', tgUser.last_name || null, tgUser.username || null]
  );
  return result.rows[0];
}

// ======================================================
// ADMIN FUNCTIONS
// ======================================================

async function getAdminByTelegramId(telegramId) {
  var result = await pool.query(
    'SELECT id, telegram_id, first_name, role, created_at FROM admins WHERE telegram_id = $1 LIMIT 1',
    [telegramId]
  );
  return result.rows[0] || null;
}

// ======================================================
// ADMIN AUTH MIDDLEWARE
// ======================================================

async function requireAdmin(req, res, next) {
  try {
    var initData = (req.body && req.body.initData) || req.headers['x-telegram-init-data'];
    if (!initData) {
      return res.status(401).json({ error: 'Telegram initData yuborilmagan' });
    }
    var user = await getOrCreateUser(initData);
    if (!user) {
      return res.status(401).json({ error: 'Telegram foydalanuvchisi tekshirilmadi' });
    }
    var telegramId = String(user.telegram_id);
    if (telegramId === String(ADMIN_TELEGRAM_ID)) {
      req.user = user;
      req.admin = {
        id: null,
        telegram_id: telegramId,
        first_name: user.first_name || 'Super Admin',
        role: 'super_admin',
        created_at: null
      };
      console.log('MAIN SUPER ADMIN ACCESS: ' + telegramId);
      return next();
    }
    var admin = await getAdminByTelegramId(user.telegram_id);
    if (!admin) {
      console.warn('ADMIN ACCESS DENIED: ' + telegramId);
      return res.status(403).json({ error: 'Sizda admin huquqi mavjud emas' });
    }
    req.user = user;
    req.admin = admin;
    console.log('ADMIN ACCESS: ' + telegramId + ' | ROLE: ' + admin.role);
    next();
  } catch (error) {
    console.error('ADMIN AUTH ERROR:', error);
    return res.status(500).json({ error: 'Admin tekshirishda server xatosi' });
  }
}

// ======================================================
// SUPER ADMIN AUTH
// ======================================================

async function requireSuperAdmin(req, res, next) {
  try {
    if (!req.admin) {
      return res.status(403).json({ error: 'Admin huquqi kerak' });
    }
    var currentTelegramId = String(req.admin.telegram_id);
    var mainAdminId = String(ADMIN_TELEGRAM_ID);
    var isMainAdmin = currentTelegramId === mainAdminId;
    var isSuperAdmin = String(req.admin.role) === 'super_admin';
    if (!isMainAdmin && !isSuperAdmin) {
      console.warn('SUPER ADMIN ACCESS DENIED: ' + currentTelegramId);
      return res.status(403).json({ error: 'Faqat super admin bu amalni bajarishi mumkin' });
    }
    console.log('SUPER ADMIN ACCESS: ' + currentTelegramId);
    next();
  } catch (error) {
    console.error('SUPER ADMIN AUTH ERROR:', error);
    return res.status(500).json({ error: 'Super admin tekshirishda xato' });
  }
}

// ======================================================
// REGISTER
// ======================================================

app.post('/api/register', async function (req, res) {
  try {
    var initData = req.body && req.body.initData;
    var firstName = String(req.body && req.body.first_name || '').trim();
    var lastName = String(req.body && req.body.last_name || '').trim();
    var phone = String(req.body && req.body.phone || '').trim();
    if (!initData) return res.status(401).json({ error: 'Telegram initData yuborilmagan' });
    if (!firstName) return res.status(400).json({ error: 'Ismni kiriting' });
    if (!lastName) return res.status(400).json({ error: 'Familiyani kiriting' });
    if (!phone) return res.status(400).json({ error: 'Telefon raqamini kiriting' });

    var tgUser = verifyInitData(initData, process.env.BOT_TOKEN);
    if (!tgUser) return res.status(401).json({ error: 'Telegram malumotlari notogri' });

    var normalizedPhone = phone.replace(/[^\d+]/g, '').trim();
    if (normalizedPhone.length < 9) {
      return res.status(400).json({ error: 'Telefon raqamini togri kiriting' });
    }

    var result = await pool.query(
      'INSERT INTO users (telegram_id, first_name, last_name, phone, username) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (telegram_id) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, phone = EXCLUDED.phone, username = EXCLUDED.username RETURNING *',
      [tgUser.id, firstName, lastName, normalizedPhone, tgUser.username || null]
    );

    var user = result.rows[0];
    console.log('USER REGISTERED: ' + user.telegram_id + ' ' + user.first_name + ' ' + user.last_name);

    return res.json({
      ok: true, registered: true,
      message: 'Royxatdan otish muvaffaqiyatli yakunlandi',
      user: {
        id: user.id, telegram_id: user.telegram_id.toString(),
        first_name: user.first_name || '', last_name: user.last_name || '',
        phone: user.phone || '', username: user.username || null,
        has_access: hasAccess(user), access_until: user.access_until || null
      }
    });
  } catch (error) {
    console.error('REGISTRATION ERROR:', error);
    return res.status(500).json({ error: 'Royxatdan otishda server xatosi' });
  }
});

// ======================================================
// AUTH
// ======================================================

app.post('/api/auth', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Telegram foydalanuvchisi tekshirilmadi' });

    var admin = await getAdminByTelegramId(user.telegram_id);
    var isMainAdmin = String(user.telegram_id) === String(ADMIN_TELEGRAM_ID);

    return res.json({
      telegram_id: user.telegram_id.toString(),
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
      username: user.username || '',
      registered: Boolean(user.first_name && user.last_name && user.phone),
      has_access: hasAccess(user),
      access_until: user.access_until || null,
      is_admin: Boolean(admin || isMainAdmin),
      admin_role: isMainAdmin ? 'super_admin' : (admin ? admin.role : null)
    });
  } catch (error) {
    console.error('AUTH ERROR:', error);
    return res.status(500).json({ error: 'Server xatosi' });
  }
});

// ======================================================
// PROFILE UPDATE
// ======================================================

app.post('/api/profile/update', async function (req, res) {
  try {
    var initData = req.body && req.body.initData;
    if (!initData) return res.status(401).json({ error: 'Telegram initData yuborilmagan' });

    var tgUser = verifyInitData(initData, process.env.BOT_TOKEN);
    if (!tgUser) return res.status(401).json({ error: 'Telegram malumotlari notogri' });

    var firstName = String(req.body.first_name || '').trim();
    var lastName = String(req.body.last_name || '').trim();
    var phone = String(req.body.phone || '').trim();

    if (!firstName) return res.status(400).json({ error: 'Ismni kiriting' });
    if (!lastName) return res.status(400).json({ error: 'Familiyani kiriting' });
    if (!phone) return res.status(400).json({ error: 'Telefon raqamini kiriting' });

    var normalizedPhone = phone.replace(/[^\d+]/g, '').trim();
    if (normalizedPhone.length < 9) {
      return res.status(400).json({ error: 'Telefon raqamini togri kiriting' });
    }

    var result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, phone = $3 WHERE telegram_id = $4 RETURNING *',
      [firstName, lastName, normalizedPhone, tgUser.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
    }

    var user = result.rows[0];

    // Admin jadvalidagi ismni ham yangilaymiz
    await pool.query(
      'UPDATE admins SET first_name = $1 WHERE telegram_id = $2',
      [firstName, tgUser.id]
    );

    console.log('PROFILE UPDATED: ' + user.telegram_id);

    return res.json({
      ok: true,
      user: {
        id: user.id, telegram_id: user.telegram_id.toString(),
        first_name: user.first_name || '', last_name: user.last_name || '',
        phone: user.phone || '', username: user.username || null,
        has_access: hasAccess(user), access_until: user.access_until || null
      }
    });
  } catch (error) {
    console.error('PROFILE UPDATE ERROR:', error);
    return res.status(500).json({ error: 'Profilni yangilashda xato' });
  }
});

// ======================================================
// CONTENT
// ======================================================

app.post('/api/content', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Telegram foydalanuvchisi tekshirilmadi' });

    var userHasAccess = hasAccess(user);

    var modulesResult = await pool.query(
      'SELECT id, title, order_index FROM modules ORDER BY order_index ASC, id ASC'
    );
    var modules = modulesResult.rows;

    var lessonsResult = await pool.query(
      'SELECT id, module_id, title, order_index, youtube_url, task_text, is_free FROM lessons ORDER BY module_id ASC, order_index ASC, id ASC'
    );
    var lessons = lessonsResult.rows;

    var progressResult = await pool.query(
      'SELECT lesson_id FROM progress WHERE user_id = $1 AND watched = true',
      [user.id]
    );
    var watchedSet = new Set(progressResult.rows.map(function (r) { return r.lesson_id; }));

    var firstModuleId = modules.length ? modules[0].id : null;

    var data = modules.map(function (mod) {
      var isFirstModule = mod.id === firstModuleId;
      var moduleUnlocked = isFirstModule || userHasAccess;
      var moduleLessons = lessons.filter(function (l) { return l.module_id === mod.id; });
      var watchedCount = 0;

      var mappedLessons = moduleLessons.map(function (lesson) {
        var available = Boolean(lesson.is_free) || moduleUnlocked;
        var watched = watchedSet.has(lesson.id);
        if (watched) watchedCount++;
        return {
          id: lesson.id, title: lesson.title, is_free: Boolean(lesson.is_free),
          task_text: lesson.task_text, available: available, watched: watched
        };
      });

      return {
        id: mod.id, title: mod.title, order_index: mod.order_index,
        unlocked: moduleUnlocked, lessons: mappedLessons,
        watched_count: watchedCount, total_count: moduleLessons.length
      };
    });

    return res.json({
      has_access: userHasAccess, access_until: user.access_until || null,
      telegram_id: user.telegram_id.toString(),
      first_name: user.first_name || '', last_name: user.last_name || '',
      phone: user.phone || '', username: user.username || '',
      registered: Boolean(user.first_name && user.last_name && user.phone),
      modules: data
    });
  } catch (error) {
    console.error('CONTENT ERROR:', error);
    return res.status(500).json({ error: 'Server xatosi' });
  }
});

// ======================================================
// LESSON
// ======================================================

app.post('/api/lesson/:id', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Telegram foydalanuvchisi tekshirilmadi' });

    var lessonResult = await pool.query(
      'SELECT id, module_id, title, order_index, youtube_url, task_text, is_free, bunny_video_id, warning_text FROM lessons WHERE id = $1 LIMIT 1',
      [req.params.id]
    );
    var lesson = lessonResult.rows[0];
    if (!lesson) return res.status(404).json({ error: 'Dars topilmadi' });

    var moduleResult = await pool.query(
      'SELECT id, title, order_index FROM modules WHERE id = $1 LIMIT 1',
      [lesson.module_id]
    );
    var mod = moduleResult.rows[0];
    if (!mod) return res.status(404).json({ error: 'Darsga tegishli modul topilmadi' });

    var userHasAccess = hasAccess(user);
    var firstModuleResult = await pool.query(
      'SELECT id FROM modules ORDER BY order_index ASC, id ASC LIMIT 1'
    );
    var firstModule = firstModuleResult.rows[0];
    var isFirstModule = firstModule && Number(firstModule.id) === Number(mod.id);
    var lessonAvailable = Boolean(lesson.is_free) || isFirstModule || userHasAccess;

    if (!lessonAvailable) {
      return res.status(403).json({ error: 'locked', message: 'Bu dars yopiq. Kursga kirish uchun tolov qilishingiz kerak.' });
    }

    var files = [];
    try {
      var filesResult = await pool.query(
        'SELECT id, file_name, file_url FROM lesson_files WHERE lesson_id = $1 ORDER BY id ASC',
        [lesson.id]
      );
      files = filesResult.rows;
    } catch (fileError) {
      console.error('LESSON FILES ERROR:', fileError);
    }

    try {
      await pool.query(
        'INSERT INTO progress (user_id, lesson_id, watched) VALUES ($1, $2, true) ON CONFLICT (user_id, lesson_id) DO UPDATE SET watched = true, watched_at = NOW()',
        [user.id, lesson.id]
      );
    } catch (progressError) {
      console.error('PROGRESS ERROR:', progressError);
    }

    var defaultWarning = 'Ushbu darslik va undagi materiallar sizga faqat shaxsiy foydalanishingiz uchun berilgan OMONATdir.\n\nDarsliklarni boshqa shaxslarga yuborish, tarqatish, nusxalash, sotish yoki internetga joylashtirish qatiyan taqiqlanadi.\n\nIltimos, sizga berilgan ushbu omonatni asrang va boshqalarga tarqatmang.';
    var warningText = (lesson.warning_text && lesson.warning_text.trim()) ? lesson.warning_text : defaultWarning;

    var youtubePlayerUrl = generateYouTubePlayerUrl(lesson.youtube_url);

    if (youtubePlayerUrl) {
      return res.json({
        id: lesson.id, title: lesson.title, video_type: 'youtube',
        youtube_url: lesson.youtube_url, youtube_player_url: youtubePlayerUrl,
        task_text: lesson.task_text || '', warning_text: warningText, files: files
      });
    }

    if (lesson.bunny_video_id && process.env.BUNNY_LIBRARY_ID) {
      var bunnyPlayerUrl = generateBunnyPlayerUrl(process.env.BUNNY_LIBRARY_ID, lesson.bunny_video_id);
      return res.json({
        id: lesson.id, title: lesson.title, video_type: 'bunny',
        bunny_video_id: lesson.bunny_video_id, bunny_library_id: process.env.BUNNY_LIBRARY_ID,
        bunny_player_url: bunnyPlayerUrl,
        task_text: lesson.task_text || '', warning_text: warningText, files: files
      });
    }

    return res.json({
      id: lesson.id, title: lesson.title, video_type: null,
      task_text: lesson.task_text || '', warning_text: warningText, files: files
    });
  } catch (error) {
    console.error('LESSON ERROR:', error);
    return res.status(500).json({ error: 'Darsni ochishda server xatosi' });
  }
});

// ======================================================
// PROGRESS MARK
// ======================================================

app.post('/api/progress/mark', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Telegram foydalanuvchisi tekshirilmadi' });

    var lessonId = req.body.lesson_id;
    if (!lessonId) return res.status(400).json({ error: 'lesson_id majburiy' });

    await pool.query(
      'INSERT INTO progress (user_id, lesson_id, watched) VALUES ($1, $2, true) ON CONFLICT (user_id, lesson_id) DO UPDATE SET watched = true, watched_at = NOW()',
      [user.id, lessonId]
    );

    return res.json({ ok: true });
  } catch (error) {
    console.error('PROGRESS MARK ERROR:', error);
    return res.status(500).json({ error: 'Server xatosi' });
  }
});

// ======================================================
// MODULE TEST
// ======================================================

app.post('/api/module/:id/test', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Telegram foydalanuvchisi tekshirilmadi' });

    var questionsResult = await pool.query(
      'SELECT id, question, options, order_index FROM module_tests WHERE module_id = $1 ORDER BY order_index ASC, id ASC',
      [req.params.id]
    );

    return res.json({ questions: questionsResult.rows });
  } catch (error) {
    console.error('TEST ERROR:', error);
    return res.status(500).json({ error: 'Server xatosi' });
  }
});

// ======================================================
// SUBMIT TEST
// ======================================================

app.post('/api/module/:id/submit', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Telegram foydalanuvchisi tekshirilmadi' });

    var answers = req.body.answers || {};
    var questionsResult = await pool.query(
      'SELECT id, correct_index FROM module_tests WHERE module_id = $1 ORDER BY id ASC',
      [req.params.id]
    );
    var questions = questionsResult.rows;
    var correct = 0;
    for (var i = 0; i < questions.length; i++) {
      if (Number(answers[questions[i].id]) === Number(questions[i].correct_index)) {
        correct++;
      }
    }
    var score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    var passed = score >= 70;

    await pool.query(
      'INSERT INTO module_results (user_id, module_id, passed, score) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, module_id) DO UPDATE SET passed = $3, score = $4, attempted_at = now()',
      [user.id, req.params.id, passed, score]
    );

    return res.json({ score: score, passed: passed });
  } catch (error) {
    console.error('SUBMIT TEST ERROR:', error);
    return res.status(500).json({ error: 'Server xatosi' });
  }
});

// ======================================================
// REQUEST ACCESS
// ======================================================

app.post('/api/request-access', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ ok: false, error: 'Telegram foydalanuvchisi aniqlanmadi' });

    if (hasAccess(user)) {
      return res.json({ ok: true, message: 'Sizda allaqachon kursga kirish huquqi mavjud' });
    }

    var fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Nomalum';

    var existingResult = await pool.query(
      "SELECT id FROM payment_requests WHERE user_id = $1 AND status = 'pending' LIMIT 1",
      [user.id]
    );

    if (existingResult.rows.length > 0) {
      var adminMsg1 = 'TOLOV SOROVI!\n\nIsm: ' + fullName + '\nTelefon: ' + (user.phone || 'Telefon yoq') + '\nUsername: @' + (user.username || 'username yoq') + '\nTelegram ID: ' + user.telegram_id + '\n\nBu foydalanuvchi oldin ham sorov yuborgan.';
      await notifyAdmin(adminMsg1, user.telegram_id.toString());
      return res.json({ ok: true, already_pending: true, message: 'Sorovingiz adminga yuborildi' });
    }

    await pool.query(
      "INSERT INTO payment_requests (user_id, status) VALUES ($1, 'pending')",
      [user.id]
    );

    var adminMsg2 = 'YANGI TOLOV SOROVI!\n\nIsm: ' + fullName + '\nTelefon: ' + (user.phone || 'Telefon yoq') + '\nUsername: @' + (user.username || 'username yoq') + '\nTelegram ID: ' + user.telegram_id + '\n\nKursga kirish uchun sorov yuborildi.';
    await notifyAdmin(adminMsg2, user.telegram_id.toString());

    return res.json({ ok: true, already_pending: false, message: 'Sorov adminga yuborildi' });
  } catch (error) {
    console.error('REQUEST ACCESS ERROR:', error);
    return res.status(500).json({ ok: false, error: 'Adminga murojaat yuborishda xatolik: ' + error.message });
  }
});

// ======================================================
// ADMIN API
// ======================================================

app.post('/api/admin/auth', requireAdmin, async function (req, res) {
  return res.json({
    ok: true,
    admin: {
      id: req.admin.id, telegram_id: req.admin.telegram_id.toString(),
      first_name: req.admin.first_name || '', role: req.admin.role
    }
  });
});

// ======================================================
// ADMIN STATS
// ======================================================

app.post('/api/admin/stats', requireAdmin, async function (req, res) {
  try {
    var totalResult = await pool.query('SELECT COUNT(*)::int AS total FROM users');
    var paidResult = await pool.query('SELECT COUNT(*)::int AS paid FROM users WHERE access_until > NOW()');
    var unpaidResult = await pool.query('SELECT COUNT(*)::int AS unpaid FROM users WHERE access_until IS NULL OR access_until <= NOW()');
    var activeResult = await pool.query('SELECT COUNT(DISTINCT user_id)::int AS active FROM progress WHERE watched = true');
    var lessonsResult = await pool.query('SELECT COUNT(*)::int AS total FROM lessons');
    var modulesResult = await pool.query('SELECT COUNT(*)::int AS total FROM modules');

    return res.json({
      ok: true,
      stats: {
        total_students: totalResult.rows[0].total,
        paid_students: paidResult.rows[0].paid,
        unpaid_students: unpaidResult.rows[0].unpaid,
        active_students: activeResult.rows[0].active,
        total_lessons: lessonsResult.rows[0].total,
        total_modules: modulesResult.rows[0].total
      }
    });
  } catch (error) {
    console.error('ADMIN STATS ERROR:', error);
    return res.status(500).json({ error: 'Statistikani olishda xato' });
  }
});

// ======================================================
// ADMIN STUDENTS
// ======================================================

app.post('/api/admin/students', requireAdmin, async function (req, res) {
  try {
    var result = await pool.query(
      'SELECT u.id, u.telegram_id, u.first_name, u.last_name, u.phone, u.username, u.access_until, u.created_at, COUNT(DISTINCT CASE WHEN p.watched = true THEN p.lesson_id END)::int AS watched_lessons, (SELECT COUNT(*)::int FROM lessons) AS total_lessons FROM users u LEFT JOIN progress p ON p.user_id = u.id GROUP BY u.id ORDER BY u.created_at DESC'
    );

    var students = result.rows.map(function (s) {
      return {
        id: s.id, telegram_id: s.telegram_id.toString(),
        first_name: s.first_name || '', last_name: s.last_name || '',
        phone: s.phone || null, username: s.username || null,
        access_until: s.access_until || null, created_at: s.created_at,
        watched_lessons: s.watched_lessons, total_lessons: s.total_lessons,
        has_access: s.access_until && new Date(s.access_until) > new Date()
      };
    });

    return res.json({ ok: true, students: students });
  } catch (error) {
    console.error('ADMIN STUDENTS ERROR:', error);
    return res.status(500).json({ error: 'Oquvchilarni olishda xato' });
  }
});

// ======================================================
// ADMIN STUDENT DETAIL
// ======================================================

app.post('/api/admin/student/:id', requireAdmin, async function (req, res) {
  try {
    var studentResult = await pool.query(
      'SELECT id, telegram_id, first_name, last_name, phone, username, access_until, created_at FROM users WHERE id = $1 LIMIT 1',
      [req.params.id]
    );
    var student = studentResult.rows[0];
    if (!student) return res.status(404).json({ error: 'Oquvchi topilmadi' });

    var progressResult = await pool.query(
      'SELECT m.id AS module_id, m.title AS module_title, m.order_index AS module_order, l.id AS lesson_id, l.title AS lesson_title, l.order_index AS lesson_order, COALESCE(p.watched, false) AS watched FROM modules m LEFT JOIN lessons l ON l.module_id = m.id LEFT JOIN progress p ON p.lesson_id = l.id AND p.user_id = $1 ORDER BY m.order_index ASC, l.order_index ASC, l.id ASC',
      [student.id]
    );

    var testResult = await pool.query(
      'SELECT mr.module_id, m.title AS module_title, mr.passed, mr.score, mr.attempted_at FROM module_results mr JOIN modules m ON m.id = mr.module_id WHERE mr.user_id = $1 ORDER BY m.order_index ASC',
      [student.id]
    );

    return res.json({
      ok: true,
      student: {
        id: student.id, telegram_id: student.telegram_id.toString(),
        first_name: student.first_name || '', last_name: student.last_name || '',
        phone: student.phone || null, username: student.username || null,
        access_until: student.access_until || null, created_at: student.created_at,
        has_access: student.access_until && new Date(student.access_until) > new Date()
      },
      progress: progressResult.rows,
      tests: testResult.rows
    });
  } catch (error) {
    console.error('ADMIN STUDENT DETAIL ERROR:', error);
    return res.status(500).json({ error: 'Oquvchi malumotlarini olishda xato' });
  }
});

// ======================================================
// ADMIN STUDENT ACCESS
// ======================================================

app.post('/api/admin/student/:id/access', requireAdmin, async function (req, res) {
  try {
    var accessUntil = req.body.access_until;
    if (!accessUntil) return res.status(400).json({ error: 'access_until majburiy' });

    var studentResult = await pool.query(
      'SELECT id FROM users WHERE id = $1 LIMIT 1',
      [req.params.id]
    );
    if (studentResult.rows.length === 0) return res.status(404).json({ error: 'Oquvchi topilmadi' });

    await pool.query(
      'UPDATE users SET access_until = $1 WHERE id = $2',
      [new Date(accessUntil), req.params.id]
    );

    await pool.query(
      "UPDATE payment_requests SET status = 'approved', approved_at = NOW() WHERE user_id = $1 AND status = 'pending'",
      [req.params.id]
    );

    console.log('STUDENT ACCESS GRANTED: user_id=' + req.params.id);
    return res.json({ ok: true, message: 'Kirish huquqi berildi' });
  } catch (error) {
    console.error('ADMIN STUDENT ACCESS ERROR:', error);
    return res.status(500).json({ error: 'Kirish huquqini berishda xato' });
  }
});

// ======================================================
// ADMIN MODULES
// ======================================================

app.post('/api/admin/modules', requireAdmin, async function (req, res) {
  try {
    var result = await pool.query(
      'SELECT m.id, m.title, m.description, m.order_index, COUNT(l.id)::int AS lesson_count FROM modules m LEFT JOIN lessons l ON l.module_id = m.id GROUP BY m.id ORDER BY m.order_index ASC, m.id ASC'
    );
    return res.json({ ok: true, modules: result.rows });
  } catch (error) {
    console.error('ADMIN MODULES ERROR:', error);
    return res.status(500).json({ error: 'Modullarni olishda xato' });
  }
});

// ======================================================
// ADD MODULE
// ======================================================

app.post('/api/admin/modules/add', requireAdmin, async function (req, res) {
  try {
    var title = String(req.body.title || '').trim();
    var description = String(req.body.description || '').trim();
    var orderIndex = req.body.order_index;

    if (!title) return res.status(400).json({ error: 'Modul nomi majburiy' });
    if (orderIndex === undefined || orderIndex === null) return res.status(400).json({ error: 'Tartib raqami majburiy' });

    var result = await pool.query(
      'INSERT INTO modules (title, description, order_index) VALUES ($1, $2, $3) RETURNING *',
      [title, description || null, Number(orderIndex)]
    );

    console.log('MODULE ADDED: ' + result.rows[0].id);
    return res.json({ ok: true, message: 'Modul qoshildi', module: result.rows[0] });
  } catch (error) {
    console.error('ADD MODULE ERROR:', error);
    return res.status(500).json({ error: 'Modul qoshishda xato' });
  }
});

// ======================================================
// UPDATE MODULE
// ======================================================

app.post('/api/admin/modules/:id/update', requireAdmin, async function (req, res) {
  try {
    var title = String(req.body.title || '').trim();
    var description = String(req.body.description || '').trim();
    var orderIndex = req.body.order_index;

    if (!title) return res.status(400).json({ error: 'Modul nomi majburiy' });
    if (orderIndex === undefined || orderIndex === null) return res.status(400).json({ error: 'Tartib raqami majburiy' });

    var result = await pool.query(
      'UPDATE modules SET title = $1, description = $2, order_index = $3 WHERE id = $4 RETURNING *',
      [title, description || null, Number(orderIndex), req.params.id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Modul topilmadi' });

    return res.json({ ok: true, message: 'Modul yangilandi', module: result.rows[0] });
  } catch (error) {
    console.error('UPDATE MODULE ERROR:', error);
    return res.status(500).json({ error: 'Modulni yangilashda xato' });
  }
});

// ======================================================
// DELETE MODULE
// ======================================================

app.post('/api/admin/modules/:id/delete', requireAdmin, async function (req, res) {
  try {
    var moduleId = Number(req.params.id);
    var moduleResult = await pool.query('SELECT id FROM modules WHERE id = $1 LIMIT 1', [moduleId]);
    if (moduleResult.rows.length === 0) return res.status(404).json({ error: 'Modul topilmadi' });

    // Delete all related data
    var lessonsResult = await pool.query('SELECT id FROM lessons WHERE module_id = $1', [moduleId]);
    var lessonIds = lessonsResult.rows.map(function (r) { return r.id; });

    if (lessonIds.length > 0) {
      await pool.query('DELETE FROM progress WHERE lesson_id = ANY($1)', [lessonIds]);
      await pool.query('DELETE FROM lesson_files WHERE lesson_id = ANY($1)', [lessonIds]);
      await pool.query('DELETE FROM lessons WHERE module_id = $1', [moduleId]);
    }

    await pool.query('DELETE FROM module_tests WHERE module_id = $1', [moduleId]);
    await pool.query('DELETE FROM module_results WHERE module_id = $1', [moduleId]);
    await pool.query('DELETE FROM modules WHERE id = $1', [moduleId]);

    console.log('MODULE DELETED: ' + moduleId);
    return res.json({ ok: true, message: 'Modul ochirildi' });
  } catch (error) {
    console.error('DELETE MODULE ERROR:', error);
    return res.status(500).json({ error: 'Modulni ochirishda xato' });
  }
});

// ======================================================
// ADMIN MODULE LESSONS
// ======================================================

app.post('/api/admin/module/:id/lessons', requireAdmin, async function (req, res) {
  try {
    var moduleResult = await pool.query(
      'SELECT id, title, order_index FROM modules WHERE id = $1 LIMIT 1',
      [req.params.id]
    );
    if (moduleResult.rows.length === 0) return res.status(404).json({ error: 'Modul topilmadi' });

    var result = await pool.query(
      'SELECT l.id, l.module_id, l.title, l.order_index, l.youtube_url, l.task_text, l.is_free, l.bunny_video_id, l.warning_text, COUNT(lf.id)::int AS file_count FROM lessons l LEFT JOIN lesson_files lf ON lf.lesson_id = l.id WHERE l.module_id = $1 GROUP BY l.id ORDER BY l.order_index ASC, l.id ASC',
      [req.params.id]
    );

    return res.json({ ok: true, module: moduleResult.rows[0], lessons: result.rows });
  } catch (error) {
    console.error('ADMIN MODULE LESSONS ERROR:', error);
    return res.status(500).json({ error: 'Darslarni olishda xato' });
  }
});

// ======================================================
// CREATE LESSON
// ======================================================

app.post('/api/admin/lesson', requireAdmin, async function (req, res) {
  try {
    var moduleId = req.body.module_id;
    var title = req.body.title;
    var orderIndex = req.body.order_index;

    if (!moduleId || !title || orderIndex === undefined) {
      return res.status(400).json({ error: 'module_id, title va order_index majburiy' });
    }

    var moduleResult = await pool.query('SELECT id FROM modules WHERE id = $1 LIMIT 1', [moduleId]);
    if (moduleResult.rows.length === 0) return res.status(404).json({ error: 'Modul topilmadi' });

    var duplicateResult = await pool.query(
      'SELECT id FROM lessons WHERE module_id = $1 AND order_index = $2 LIMIT 1',
      [moduleId, Number(orderIndex)]
    );
    if (duplicateResult.rows.length > 0) {
      return res.status(400).json({ error: 'Bu modulda ushbu dars raqami allaqachon mavjud' });
    }

    var result = await pool.query(
      'INSERT INTO lessons (module_id, title, order_index, youtube_url, task_text, is_free, bunny_video_id, warning_text) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [Number(moduleId), title.trim(), Number(orderIndex), req.body.youtube_url || null, req.body.task_text || null, Boolean(req.body.is_free), req.body.bunny_video_id || null, req.body.warning_text || null]
    );

    return res.json({ ok: true, message: 'Dars muvaffaqiyatli yaratildi', lesson: result.rows[0] });
  } catch (error) {
    console.error('CREATE LESSON ERROR:', error);
    return res.status(500).json({ error: 'Dars yaratishda server xatosi' });
  }
});

// ======================================================
// UPDATE LESSON
// ======================================================

app.post('/api/admin/lesson/:id/update', requireAdmin, async function (req, res) {
  try {
    var moduleId = req.body.module_id;
    var title = req.body.title;
    var orderIndex = req.body.order_index;

    if (!moduleId || !title || orderIndex === undefined) {
      return res.status(400).json({ error: 'module_id, title va order_index majburiy' });
    }

    var existingResult = await pool.query('SELECT id FROM lessons WHERE id = $1 LIMIT 1', [req.params.id]);
    if (existingResult.rows.length === 0) return res.status(404).json({ error: 'Dars topilmadi' });

    var duplicateResult = await pool.query(
      'SELECT id FROM lessons WHERE module_id = $1 AND order_index = $2 AND id <> $3 LIMIT 1',
      [Number(moduleId), Number(orderIndex), Number(req.params.id)]
    );
    if (duplicateResult.rows.length > 0) {
      return res.status(400).json({ error: 'Bu modulda ushbu dars raqami allaqachon mavjud' });
    }

    var result = await pool.query(
      'UPDATE lessons SET module_id = $1, title = $2, order_index = $3, youtube_url = $4, task_text = $5, is_free = $6, bunny_video_id = $7, warning_text = $8 WHERE id = $9 RETURNING *',
      [Number(moduleId), title.trim(), Number(orderIndex), req.body.youtube_url || null, req.body.task_text || null, Boolean(req.body.is_free), req.body.bunny_video_id || null, req.body.warning_text || null, Number(req.params.id)]
    );

    return res.json({ ok: true, message: 'Dars muvaffaqiyatli yangilandi', lesson: result.rows[0] });
  } catch (error) {
    console.error('UPDATE LESSON ERROR:', error);
    return res.status(500).json({ error: 'Darsni yangilashda xato' });
  }
});

// ======================================================
// DELETE LESSON
// ======================================================

app.post('/api/admin/lesson/:id/delete', requireAdmin, async function (req, res) {
  try {
    var lessonId = Number(req.params.id);
    var lessonResult = await pool.query('SELECT id FROM lessons WHERE id = $1 LIMIT 1', [lessonId]);
    if (lessonResult.rows.length === 0) return res.status(404).json({ error: 'Dars topilmadi' });

    await pool.query('DELETE FROM progress WHERE lesson_id = $1', [lessonId]);
    await pool.query('DELETE FROM lesson_files WHERE lesson_id = $1', [lessonId]);
    await pool.query('DELETE FROM lessons WHERE id = $1', [lessonId]);

    return res.json({ ok: true, message: 'Dars ochirildi' });
  } catch (error) {
    console.error('DELETE LESSON ERROR:', error);
    return res.status(500).json({ error: 'Darsni ochirishda xato' });
  }
});

// ======================================================
// GET LESSON FILES
// ======================================================

app.post('/api/admin/lesson/:id/files', requireAdmin, async function (req, res) {
  try {
    var lessonResult = await pool.query('SELECT id, title FROM lessons WHERE id = $1 LIMIT 1', [req.params.id]);
    if (lessonResult.rows.length === 0) return res.status(404).json({ error: 'Dars topilmadi' });

    var result = await pool.query(
      'SELECT id, lesson_id, file_name, file_url FROM lesson_files WHERE lesson_id = $1 ORDER BY id ASC',
      [req.params.id]
    );

    return res.json({ ok: true, lesson: lessonResult.rows[0], files: result.rows });
  } catch (error) {
    console.error('GET FILES ERROR:', error);
    return res.status(500).json({ error: 'Materiallarni olishda xato' });
  }
});

// ======================================================
// ADD LESSON FILE
// ======================================================

app.post('/api/admin/lesson/:id/files/add', requireAdmin, async function (req, res) {
  try {
    var fileName = req.body.file_name;
    var fileUrl = req.body.file_url;
    if (!fileName || !fileUrl) return res.status(400).json({ error: 'file_name va file_url majburiy' });

    var lessonResult = await pool.query('SELECT id FROM lessons WHERE id = $1 LIMIT 1', [req.params.id]);
    if (lessonResult.rows.length === 0) return res.status(404).json({ error: 'Dars topilmadi' });

    var result = await pool.query(
      'INSERT INTO lesson_files (lesson_id, file_name, file_url) VALUES ($1, $2, $3) RETURNING *',
      [Number(req.params.id), fileName.trim(), fileUrl.trim()]
    );

    return res.json({ ok: true, message: 'Material qoshildi', file: result.rows[0] });
  } catch (error) {
    console.error('ADD FILE ERROR:', error);
    return res.status(500).json({ error: 'Material qoshishda xato' });
  }
});

// ======================================================
// UPDATE LESSON FILE
// ======================================================

app.post('/api/admin/file/:id/update', requireAdmin, async function (req, res) {
  try {
    var fileName = req.body.file_name;
    var fileUrl = req.body.file_url;
    if (!fileName || !fileUrl) return res.status(400).json({ error: 'file_name va file_url majburiy' });

    var result = await pool.query(
      'UPDATE lesson_files SET file_name = $1, file_url = $2 WHERE id = $3 RETURNING *',
      [fileName.trim(), fileUrl.trim(), Number(req.params.id)]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Material topilmadi' });

    return res.json({ ok: true, message: 'Material yangilandi', file: result.rows[0] });
  } catch (error) {
    console.error('UPDATE FILE ERROR:', error);
    return res.status(500).json({ error: 'Materialni yangilashda xato' });
  }
});

// ======================================================
// DELETE LESSON FILE
// ======================================================

app.post('/api/admin/file/:id/delete', requireAdmin, async function (req, res) {
  try {
    var result = await pool.query(
      'DELETE FROM lesson_files WHERE id = $1 RETURNING id',
      [Number(req.params.id)]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Material topilmadi' });

    return res.json({ ok: true, message: 'Material ochirildi' });
  } catch (error) {
    console.error('DELETE FILE ERROR:', error);
    return res.status(500).json({ error: 'Materialni ochirishda xato' });
  }
});

// ======================================================
// ADMIN LIST
// ======================================================

app.post('/api/admin/admins', requireAdmin, requireSuperAdmin, async function (req, res) {
  try {
    var result = await pool.query(
      'SELECT id, telegram_id, first_name, role, created_at FROM admins ORDER BY created_at ASC NULLS FIRST, id ASC'
    );

    var admins = result.rows.map(function (admin) {
      return {
        id: admin.id, telegram_id: admin.telegram_id.toString(),
        first_name: admin.first_name || '', role: admin.role, created_at: admin.created_at
      };
    });

    var mainAdminExists = admins.some(function (admin) {
      return String(admin.telegram_id) === String(ADMIN_TELEGRAM_ID);
    });

    if (!mainAdminExists) {
      admins.unshift({
        id: null, telegram_id: String(ADMIN_TELEGRAM_ID),
        first_name: 'Super Admin', role: 'super_admin', created_at: null
      });
    }

    return res.json({ ok: true, admins: admins });
  } catch (error) {
    console.error('ADMIN LIST ERROR:', error);
    return res.status(500).json({ error: 'Adminlarni olishda xato' });
  }
});

// ======================================================
// ADD ADMIN
// ======================================================

app.post('/api/admin/admins/add', requireAdmin, requireSuperAdmin, async function (req, res) {
  try {
    var telegramId = String(req.body.telegram_id || '').trim();
    var firstName = String(req.body.first_name || '').trim();
    var requestedRole = String(req.body.role || 'admin').trim();

    if (!telegramId) return res.status(400).json({ error: 'Telegram ID majburiy' });
    if (!/^\d+$/.test(telegramId)) return res.status(400).json({ error: 'Telegram ID faqat raqamlardan iborat bolishi kerak' });

    var selectedRole = requestedRole === 'super_admin' ? 'super_admin' : 'admin';

    if (telegramId === String(ADMIN_TELEGRAM_ID)) {
      return res.status(400).json({ error: 'Bu Telegram ID allaqachon asosiy Super Admin hisoblanadi' });
    }

    var result = await pool.query(
      'INSERT INTO admins (telegram_id, first_name, role) VALUES ($1, $2, $3) ON CONFLICT (telegram_id) DO UPDATE SET first_name = EXCLUDED.first_name, role = EXCLUDED.role RETURNING id, telegram_id, first_name, role, created_at',
      [telegramId, firstName, selectedRole]
    );

    var admin = result.rows[0];
    console.log('ADMIN ADDED/UPDATED: ' + admin.telegram_id + ' ROLE: ' + admin.role);

    return res.json({
      ok: true, message: 'Admin muvaffaqiyatli qoshildi',
      admin: {
        id: admin.id, telegram_id: admin.telegram_id.toString(),
        first_name: admin.first_name || '', role: admin.role, created_at: admin.created_at
      }
    });
  } catch (error) {
    console.error('ADD ADMIN ERROR:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Bu Telegram ID bilan admin allaqachon mavjud' });
    }
    return res.status(500).json({ error: 'Admin qoshishda xato: ' + error.message });
  }
});

// ======================================================
// DELETE ADMIN
// ======================================================

app.post('/api/admin/admins/:id/delete', requireAdmin, requireSuperAdmin, async function (req, res) {
  try {
    var adminId = Number(req.params.id);
    if (!Number.isInteger(adminId) || adminId <= 0) {
      return res.status(400).json({ error: 'Admin ID notogri' });
    }

    var targetResult = await pool.query(
      'SELECT id, telegram_id, first_name, role FROM admins WHERE id = $1 LIMIT 1',
      [adminId]
    );
    var target = targetResult.rows[0];
    if (!target) return res.status(404).json({ error: 'Admin topilmadi' });

    var targetTelegramId = String(target.telegram_id);
    if (targetTelegramId === String(ADMIN_TELEGRAM_ID)) {
      return res.status(400).json({ error: 'Asosiy Super Adminni ochirib bolmaydi' });
    }
    if (target.role === 'super_admin') {
      return res.status(400).json({ error: 'Super Adminni ochirib bolmaydi' });
    }

    await pool.query('DELETE FROM admins WHERE id = $1', [adminId]);
    console.log('ADMIN DELETED: ' + targetTelegramId);

    return res.json({ ok: true, message: 'Admin ochirildi' });
  } catch (error) {
    console.error('DELETE ADMIN ERROR:', error);
    return res.status(500).json({ error: 'Adminni ochirishda xato' });
  }
});

// ======================================================
// ADMIN TEST NOTIFICATION
// ======================================================

app.post('/api/admin-test', requireAdmin, async function (req, res) {
  try {
    await notifyAdmin(
      'TEST XABARI\n\nTelegram Admin ID: ' + ADMIN_TELEGRAM_ID + '\n\nSorov yuborgan admin: ' + (req.admin.first_name || 'Nomalum') + '\n\nMini App serveridan test xabari.'
    );
    return res.json({ ok: true, message: 'Admin Telegramiga test xabari yuborildi' });
  } catch (error) {
    console.error('ADMIN TEST ERROR:', error);
    return res.status(500).json({ ok: false, error: error.message });
  }
});

// ======================================================
// HEALTH CHECK
// ======================================================

app.get('/api/health', async function (req, res) {
  try {
    await pool.query('SELECT 1');
    return res.json({
      ok: true, message: 'Server ishlayapti',
      database: 'connected', admin_telegram_id: ADMIN_TELEGRAM_ID
    });
  } catch (error) {
    console.error('HEALTH DATABASE ERROR:', error);
    return res.status(500).json({
      ok: false, message: 'Server ishlayapti, lekin database bilan aloqa yoq', database: 'error'
    });
  }
});

// ======================================================
// SERVER START
// ======================================================

app.listen(PORT, function () {
  console.log('==========================================');
  console.log('Server ' + PORT + '-portda ishga tushdi');
  console.log('Admin Telegram ID: ' + ADMIN_TELEGRAM_ID);
  console.log('==========================================');
});
