'use strict';
/**
 * Admin → Statistika (sodda ko'rinish) uchun hisob-kitoblar.
 *
 * Manbalar (hammasi real ma'lumot, o'ylab topilgan raqam yo'q):
 *  - user_activity        : har bir foydalanuvchining oxirgi heartbeat'i (hozir platformada kim va nima qilyapti)
 *  - user_daily_activity  : kunlik faollik (heartbeat bilan to'ldiriladi; eski kunlar mavjud jadvallardan bir marta to'ldirilgan)
 *  - users                : jami o'quvchilar, yangi o'quvchilar
 *
 * "Hozir platformada" = oxirgi LIVE_WINDOW_SECONDS soniya ichida heartbeat yuborgan va ilovasi yashirilmagan (status != 'idle')
 * foydalanuvchilar. Heartbeat har 25 soniyada yuboriladi (ilova ochiq paytda), shuning uchun 90 soniyalik oyna ishonchli.
 * Admin akkauntlari o'quvchi hisobiga kirmaydi.
 */

const geoCountry = require('./geoCountry');

const TZ = 'Asia/Tashkent';
const LIVE_WINDOW_SECONDS = 90;
const SECTION_WHITELIST = ['home', 'lessons', 'books', 'materials', 'normatives', 'sources', 'tests', 'process', 'equipment', 'library', 'chat', 'profile', 'learning', 'other'];

const TODAY_SQL = `((NOW() AT TIME ZONE '${TZ}')::date)`;

function normalizeSection(raw) {
  const v = String(raw || '').trim().toLowerCase().slice(0, 40);
  return SECTION_WHITELIST.indexOf(v) !== -1 ? v : null;
}

async function ensureTables(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_daily_activity (
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      day DATE NOT NULL,
      first_seen_at TIMESTAMPTZ DEFAULT NOW(),
      last_seen_at TIMESTAMPTZ DEFAULT NOW(),
      had_lesson BOOLEAN DEFAULT false,
      had_book BOOLEAN DEFAULT false,
      had_material BOOLEAN DEFAULT false,
      had_normative BOOLEAN DEFAULT false,
      PRIMARY KEY (user_id, day)
    );
    CREATE INDEX IF NOT EXISTS idx_user_daily_activity_day ON user_daily_activity(day);
    ALTER TABLE user_activity ADD COLUMN IF NOT EXISTS current_section VARCHAR(40);
    CREATE TABLE IF NOT EXISTS user_geo (
      user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      country_code CHAR(2) NOT NULL,
      first_seen_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_user_geo_country ON user_geo(country_code);
  `);
}

// Bir martalik: mavjud yozuvlardan o'tgan kunlar uchun kunlik faollikni to'ldirish (faqat aniq vaqtli yozuvlar)
async function backfillOnce(pool) {
  const has = await pool.query('SELECT 1 FROM user_daily_activity LIMIT 1');
  if (has.rows.length) return { skipped: true };
  const run = async (label, sql) => {
    try { await pool.query(sql); } catch (e) { console.warn('[STATS BACKFILL] ' + label + ':', e.message); }
  };
  const D = (col) => `((${col} AT TIME ZONE '${TZ}')::date)`;
  await run('sessions', `
    INSERT INTO user_daily_activity (user_id, day, first_seen_at, last_seen_at)
    SELECT user_id, day, MIN(ts), MAX(ts) FROM (
      SELECT user_id, ${D('started_at')} AS day, started_at AS ts FROM user_sessions WHERE user_id IS NOT NULL
      UNION ALL
      SELECT user_id, ${D('last_activity_at')} AS day, last_activity_at AS ts FROM user_sessions WHERE user_id IS NOT NULL
    ) x GROUP BY user_id, day
    ON CONFLICT (user_id, day) DO NOTHING`);
  await run('lessons-progress', `
    INSERT INTO user_daily_activity (user_id, day, first_seen_at, last_seen_at, had_lesson)
    SELECT user_id, ${D('watched_at')}, MIN(watched_at), MAX(watched_at), true FROM progress
    WHERE watched_at IS NOT NULL GROUP BY user_id, ${D('watched_at')}
    ON CONFLICT (user_id, day) DO UPDATE SET had_lesson = true`);
  await run('analytics-events', `
    INSERT INTO user_daily_activity (user_id, day, first_seen_at, last_seen_at, had_lesson, had_book, had_material)
    SELECT user_id, ${D('created_at')}, MIN(created_at), MAX(created_at),
           BOOL_OR(event_type = 'lesson_opened'), BOOL_OR(event_type = 'book_opened'), BOOL_OR(event_type = 'material_opened')
    FROM analytics_events WHERE user_id IS NOT NULL GROUP BY user_id, ${D('created_at')}
    ON CONFLICT (user_id, day) DO UPDATE SET
      had_lesson = user_daily_activity.had_lesson OR EXCLUDED.had_lesson,
      had_book = user_daily_activity.had_book OR EXCLUDED.had_book,
      had_material = user_daily_activity.had_material OR EXCLUDED.had_material`);
  await run('reading', `
    INSERT INTO user_daily_activity (user_id, day, first_seen_at, last_seen_at, had_book)
    SELECT user_id, ${D('updated_at')}, MIN(updated_at), MAX(updated_at), true FROM reading_progress
    WHERE updated_at IS NOT NULL GROUP BY user_id, ${D('updated_at')}
    ON CONFLICT (user_id, day) DO UPDATE SET had_book = true`);
  await run('materials', `
    INSERT INTO user_daily_activity (user_id, day, had_material)
    SELECT user_id, viewed_on, true FROM material_view_log
    ON CONFLICT (user_id, day) DO UPDATE SET had_material = true`);
  return { skipped: false };
}

// Heartbeat paytida chaqiriladi (fonda; xato asosiy oqimni to'xtatmaydi)
async function recordDaily(pool, userId, flags) {
  flags = flags || {};
  await pool.query(`
    INSERT INTO user_daily_activity (user_id, day, first_seen_at, last_seen_at, had_lesson, had_book, had_material, had_normative)
    VALUES ($1, ${TODAY_SQL}, NOW(), NOW(), $2, $3, $4, $5)
    ON CONFLICT (user_id, day) DO UPDATE SET
      last_seen_at = NOW(),
      had_lesson = user_daily_activity.had_lesson OR EXCLUDED.had_lesson,
      had_book = user_daily_activity.had_book OR EXCLUDED.had_book,
      had_material = user_daily_activity.had_material OR EXCLUDED.had_material,
      had_normative = user_daily_activity.had_normative OR EXCLUDED.had_normative
  `, [userId, !!flags.lesson, !!flags.book, !!flags.material, !!flags.normative]);
}

// Davlatni heartbeat paytida yozish: IP saqlanmaydi, faqat 2 harfli kod. Xotirada throttle (o'zgarmasa 6 soatda bir marta)
const geoCache = new Map();
const GEO_REFRESH_MS = 6 * 60 * 60 * 1000;
async function recordGeo(pool, userId, ip) {
  const found = geoCountry.lookupCountry(ip);
  if (!found) return false;
  const prev = geoCache.get(userId);
  const now = Date.now();
  if (prev && prev.code === found.code && now - prev.ts < GEO_REFRESH_MS) return false;
  await pool.query(`
    INSERT INTO user_geo (user_id, country_code) VALUES ($1, $2)
    ON CONFLICT (user_id) DO UPDATE SET country_code = EXCLUDED.country_code, updated_at = NOW()
  `, [userId, found.code]);
  geoCache.set(userId, { code: found.code, ts: now });
  if (geoCache.size > 20000) geoCache.clear();
  return true;
}

async function getAdminTelegramIds(pool, mainAdminId) {
  const ids = new Set();
  if (mainAdminId) ids.add(String(mainAdminId));
  try {
    const r = await pool.query('SELECT telegram_id FROM admins');
    r.rows.forEach(function (x) { if (x.telegram_id != null) ids.add(String(x.telegram_id)); });
  } catch (e) {}
  return Array.from(ids);
}

// ---------- HOZIR PLATFORMADA ----------
const LIVE_CATEGORY_SQL = `
  CASE
    WHEN ua.status = 'testing' OR ua.lesson_id IS NOT NULL THEN 'lessons'
    WHEN ua.current_section = 'books' THEN 'books'
    WHEN ua.current_section = 'materials' THEN 'materials'
    WHEN ua.current_section = 'normatives' THEN 'normatives'
    WHEN ua.current_section = 'sources' THEN 'sources'
    ELSE 'other'
  END`;

async function getLive(pool, excludeTelegramIds) {
  const excl = excludeTelegramIds || [];
  const r = await pool.query(`
    SELECT ua.user_id, ua.last_seen_at, ua.current_tab, ua.current_section, ua.status,
           ua.lesson_title, ua.module_title, ua.course_title,
           u.first_name, u.last_name, u.username,
           ${LIVE_CATEGORY_SQL} AS category
    FROM user_activity ua
    JOIN users u ON u.id = ua.user_id
    WHERE ua.last_seen_at >= NOW() - INTERVAL '${LIVE_WINDOW_SECONDS} seconds'
      AND COALESCE(ua.status, 'online') <> 'idle'
      AND u.telegram_id::text <> ALL($1::text[])
    ORDER BY ua.last_seen_at DESC
    LIMIT 500
  `, [excl]);
  const live = { online: 0, lessons: 0, books: 0, materials: 0, normatives: 0, sources: 0, other: 0 };
  const users = [];
  r.rows.forEach(function (row) {
    live.online++;
    live[row.category] = (live[row.category] || 0) + 1;
    if (users.length < 50) {
      users.push({
        user_id: row.user_id,
        name: ([row.first_name, row.last_name].filter(Boolean).join(' ') || (row.username ? '@' + row.username : 'Foydalanuvchi')).trim(),
        category: row.category,
        detail: row.category === 'lessons' ? (row.lesson_title || row.module_title || (row.status === 'testing' ? 'Modul testi' : '')) : '',
        seen_seconds_ago: Math.max(0, Math.round((Date.now() - new Date(row.last_seen_at).getTime()) / 1000))
      });
    }
  });
  live.window_seconds = LIVE_WINDOW_SECONDS;
  return { live: live, users: users };
}

// ---------- BUGUN ----------
async function getToday(pool, excludeTelegramIds) {
  const r = await pool.query(`
    SELECT
      COUNT(*)::int AS active,
      COUNT(*) FILTER (WHERE d.had_lesson)::int AS lesson_viewers,
      COUNT(*) FILTER (WHERE d.had_book)::int AS book_readers,
      COUNT(*) FILTER (WHERE d.had_material)::int AS material_viewers,
      COUNT(*) FILTER (WHERE d.had_normative)::int AS normative_viewers
    FROM user_daily_activity d
    JOIN users u ON u.id = d.user_id
    WHERE d.day = ${TODAY_SQL} AND u.telegram_id::text <> ALL($1::text[])
  `, [excludeTelegramIds || []]);
  return r.rows[0] || { active: 0, lesson_viewers: 0, book_readers: 0, material_viewers: 0, normative_viewers: 0 };
}

// ---------- JAMI O'QUVCHILAR ----------
async function getTotals(pool, days, excludeTelegramIds) {
  const excl = excludeTelegramIds || [];
  const r = await pool.query(`
    SELECT
      COUNT(*)::int AS students,
      COUNT(*) FILTER (WHERE (u.created_at AT TIME ZONE '${TZ}')::date > ${TODAY_SQL} - $2::int)::int AS new_in_period,
      COUNT(*) FILTER (WHERE (u.created_at AT TIME ZONE '${TZ}')::date <= ${TODAY_SQL} - $2::int
                         AND (u.created_at AT TIME ZONE '${TZ}')::date > ${TODAY_SQL} - ($2::int * 2))::int AS new_prev_period
    FROM users u
    WHERE u.telegram_id::text <> ALL($1::text[])
  `, [excl, days]);
  return r.rows[0] || { students: 0, new_in_period: 0, new_prev_period: 0 };
}

// ---------- KUNLAR BO'YICHA FAOLLIK ----------
async function getSeries(pool, days, excludeTelegramIds) {
  const r = await pool.query(`
    SELECT to_char(g.day, 'YYYY-MM-DD') AS day,
           COUNT(d.user_id)::int AS visitors,
           COUNT(*) FILTER (WHERE d.had_lesson)::int AS lesson_viewers,
           COUNT(*) FILTER (WHERE d.had_book)::int AS book_readers
    FROM (SELECT (${TODAY_SQL} - gs.i) AS day FROM generate_series($1::int - 1, 0, -1) AS gs(i)) g
    LEFT JOIN (
      SELECT x.* FROM user_daily_activity x JOIN users u ON u.id = x.user_id
      WHERE u.telegram_id::text <> ALL($2::text[])
    ) d ON d.day = g.day
    GROUP BY g.day
    ORDER BY g.day ASC
  `, [days, excludeTelegramIds || []]);
  return r.rows;
}

// ---------- QAYERDAN KIRGAN (davlatlar) ----------
// Tanlangan davrda faol bo'lgan o'quvchilar, ularning oxirgi aniqlangan davlati bo'yicha
async function getGeo(pool, days, excludeTelegramIds) {
  const r = await pool.query(`
    SELECT COALESCE(g.country_code, '') AS code, COUNT(*)::int AS cnt
    FROM (
      SELECT DISTINCT d.user_id FROM user_daily_activity d
      JOIN users u ON u.id = d.user_id
      WHERE d.day > ${TODAY_SQL} - $1::int AND u.telegram_id::text <> ALL($2::text[])
    ) a
    LEFT JOIN user_geo g ON g.user_id = a.user_id
    GROUP BY 1
  `, [days, excludeTelegramIds || []]);
  const total = r.rows.reduce((s, x) => s + x.cnt, 0);
  const unknown = (r.rows.find(x => x.code === '') || { cnt: 0 }).cnt;
  const rows = r.rows.filter(x => x.code !== '').sort((a, b) => b.cnt - a.cnt || a.code.localeCompare(b.code));
  const TOP = 7;
  const top = rows.slice(0, TOP);
  const restCnt = rows.slice(TOP).reduce((s, x) => s + x.cnt, 0);
  const pct = c => total ? Math.round((c / total) * 1000) / 10 : 0;
  const countries = top.map(x => ({ code: x.code, name: geoCountry.countryName(x.code), flag: geoCountry.flagEmoji(x.code), count: x.cnt, pct: pct(x.cnt) }));
  if (restCnt) countries.push({ code: 'OTHER', name: 'Boshqa davlatlar', flag: '🌍', count: restCnt, pct: pct(restCnt) });
  if (unknown) countries.push({ code: 'UNKNOWN', name: 'Aniqlanmagan', flag: '❔', count: unknown, pct: pct(unknown) });
  return { total: total, located: total - unknown, unknown: unknown, countries: countries };
}

async function getOverview(pool, days, excludeTelegramIds) {
  days = [3, 7, 30].indexOf(Number(days)) !== -1 ? Number(days) : 7;
  const [liveRes, today, totals, series, geoRes] = await Promise.all([
    getLive(pool, excludeTelegramIds),
    getToday(pool, excludeTelegramIds),
    getTotals(pool, days, excludeTelegramIds),
    getSeries(pool, days, excludeTelegramIds),
    getGeo(pool, days, excludeTelegramIds)
  ]);
  return {
    ok: true,
    period_days: days,
    generated_at: new Date().toISOString(),
    totals: totals,
    live: liveRes.live,
    live_users: liveRes.users,
    today: today,
    series: series,
    geo: geoRes
  };
}

module.exports = { ensureTables, backfillOnce, recordDaily, recordGeo, getGeo, getAdminTelegramIds, getLive, getToday, getTotals, getSeries, getOverview, normalizeSection, LIVE_WINDOW_SECONDS };
