/**
 * services/analyticsService.js
 * Professional Analytics Engine for YOSHUZBEKK Academy Admin Dashboard
 * Real Database Aggregation, Multi-Granularity Time-Series, Event Tracking & CSV Export
 */

let pool = null;

function init(dbPool) {
  pool = dbPool;
  ensureAnalyticsTables();
}

async function ensureAnalyticsTables() {
  if (!pool) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id BIGSERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE SET NULL,
        event_type VARCHAR(64) NOT NULL,
        category VARCHAR(32) NOT NULL DEFAULT 'general',
        content_id INT,
        metadata JSONB DEFAULT '{}'::jsonb,
        duration_seconds INT DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_cat ON analytics_events(category);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_content ON analytics_events(content_id);
    `);
    console.log('✅ ANALYTICS ENGINE: analytics_events jadvali va indekslari sozlandi');
  } catch (err) {
    console.error('ANALYTICS SCHEMA WARNING:', err.message);
  }
}

async function trackEvent(userId, eventType, category = 'general', contentId = null, metadata = {}, durationSeconds = 0) {
  if (!pool) return;
  try {
    await pool.query(
      `INSERT INTO analytics_events (user_id, event_type, category, content_id, metadata, duration_seconds, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [
        userId ? Number(userId) : null,
        String(eventType).slice(0, 64),
        String(category || 'general').slice(0, 32),
        contentId ? Number(contentId) : null,
        JSON.stringify(metadata || {}),
        Number(durationSeconds) || 0
      ]
    );
  } catch (err) {
    // Non-blocking for primary application flows
  }
}

// Hafta kunlari nomlari (Uzbek)
const WEEKDAY_NAMES = [
  'Dushanba',
  'Seshanba',
  'Chorshanba',
  'Payshanba',
  'Juma',
  'Shanba',
  'Yakshanba'
];

function calculatePeriodDates(period, customStart, customEnd) {
  const now = new Date();
  let startDate, endDate, prevStartDate, prevEndDate;

  if (period === 'today') {
    startDate = "CURRENT_DATE";
    endDate = "CURRENT_DATE + INTERVAL '1 DAY'";
    prevStartDate = "CURRENT_DATE - INTERVAL '1 DAY'";
    prevEndDate = "CURRENT_DATE";
  } else if (period === 'yesterday') {
    startDate = "CURRENT_DATE - INTERVAL '1 DAY'";
    endDate = "CURRENT_DATE";
    prevStartDate = "CURRENT_DATE - INTERVAL '2 DAYS'";
    prevEndDate = "CURRENT_DATE - INTERVAL '1 DAY'";
  } else if (period === '30days') {
    startDate = "CURRENT_DATE - INTERVAL '29 DAYS'";
    endDate = "CURRENT_DATE + INTERVAL '1 DAY'";
    prevStartDate = "CURRENT_DATE - INTERVAL '59 DAYS'";
    prevEndDate = "CURRENT_DATE - INTERVAL '29 DAYS'";
  } else if (period === 'this_month') {
    startDate = "DATE_TRUNC('month', CURRENT_DATE)";
    endDate = "DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 MONTH'";
    prevStartDate = "DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 MONTH'";
    prevEndDate = "DATE_TRUNC('month', CURRENT_DATE)";
  } else if (period === 'last_month') {
    startDate = "DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 MONTH'";
    endDate = "DATE_TRUNC('month', CURRENT_DATE)";
    prevStartDate = "DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '2 MONTHS'";
    prevEndDate = "DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 MONTH'";
  } else if (period === '3months') {
    startDate = "CURRENT_DATE - INTERVAL '90 DAYS'";
    endDate = "CURRENT_DATE + INTERVAL '1 DAY'";
    prevStartDate = "CURRENT_DATE - INTERVAL '180 DAYS'";
    prevEndDate = "CURRENT_DATE - INTERVAL '90 DAYS'";
  } else if (period === '6months') {
    startDate = "CURRENT_DATE - INTERVAL '180 DAYS'";
    endDate = "CURRENT_DATE + INTERVAL '1 DAY'";
    prevStartDate = "CURRENT_DATE - INTERVAL '360 DAYS'";
    prevEndDate = "CURRENT_DATE - INTERVAL '180 DAYS'";
  } else if (period === 'this_year') {
    startDate = "DATE_TRUNC('year', CURRENT_DATE)";
    endDate = "DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 YEAR'";
    prevStartDate = "DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '1 YEAR'";
    prevEndDate = "DATE_TRUNC('year', CURRENT_DATE)";
  } else if (period === 'last_year') {
    startDate = "DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '1 YEAR'";
    endDate = "DATE_TRUNC('year', CURRENT_DATE)";
    prevStartDate = "DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '2 YEARS'";
    prevEndDate = "DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '1 YEAR'";
  } else if (period === 'custom' && customStart && customEnd) {
    const sSanitized = customStart.replace(/[^0-9-]/g, '');
    const eSanitized = customEnd.replace(/[^0-9-]/g, '');
    startDate = `'${sSanitized}'::timestamptz`;
    endDate = `'${eSanitized}'::timestamptz + INTERVAL '1 DAY'`;
    prevStartDate = `'${sSanitized}'::timestamptz - (('${eSanitized}'::date - '${sSanitized}'::date + 1) * INTERVAL '1 DAY')`;
    prevEndDate = `'${sSanitized}'::timestamptz`;
  } else {
    // Default: 7 days
    startDate = "CURRENT_DATE - INTERVAL '6 DAYS'";
    endDate = "CURRENT_DATE + INTERVAL '1 DAY'";
    prevStartDate = "CURRENT_DATE - INTERVAL '13 DAYS'";
    prevEndDate = "CURRENT_DATE - INTERVAL '6 DAYS'";
  }

  return { startDate, endDate, prevStartDate, prevEndDate };
}

function determineGranularity(period, userGranularity) {
  if (userGranularity && ['yearly', 'monthly', 'weekly', 'daily', 'hourly', 'minutely'].includes(userGranularity)) {
    return userGranularity;
  }
  if (period === 'today' || period === 'yesterday') return 'hourly';
  if (period === '3months' || period === '6months') return 'weekly';
  if (period === 'this_year' || period === 'last_year') return 'monthly';
  return 'daily';
}

function getSeriesSqlConfig(granularity) {
  switch (granularity) {
    case 'minutely':
      return { step: '5 minutes', format: 'HH24:MI' };
    case 'hourly':
      return { step: '1 hour', format: 'HH24:00' };
    case 'weekly':
      return { step: '1 week', format: 'DD.MM' };
    case 'monthly':
      return { step: '1 month', format: 'Mon YYYY' };
    case 'yearly':
      return { step: '1 year', format: 'YYYY' };
    case 'daily':
    default:
      return { step: '1 day', format: 'DD.MM' };
  }
}

function calcGrowth(curr, prev) {
  const c = Number(curr) || 0;
  const p = Number(prev) || 0;
  if (p === 0) {
    return c > 0 ? 100 : 0;
  }
  return Math.round(((c - p) / p) * 100);
}

async function getDashboardData(params = {}) {
  if (!pool) throw new Error("Database ulanishi mavjud emas");

  const period = params.period || '7days';
  const customStart = params.start_date;
  const customEnd = params.end_date;
  const userGranularity = params.granularity;

  const { startDate, endDate, prevStartDate, prevEndDate } = calculatePeriodDates(period, customStart, customEnd);
  const granularity = determineGranularity(period, userGranularity);
  const seriesConfig = getSeriesSqlConfig(granularity);

  // 1. TOP KPI: Foydalanuvchilar va Kontent faolligi (Parallel queries)
  const kpiQuery = pool.query(`
    SELECT
      (SELECT COUNT(*)::int FROM users) AS total_users,
      (SELECT COUNT(*)::int FROM users WHERE access_until > NOW()) AS paid_users,
      (SELECT COUNT(*)::int FROM users WHERE created_at >= CURRENT_DATE) AS new_today,
      (SELECT COUNT(*)::int FROM users WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)) AS new_this_week,
      (SELECT COUNT(*)::int FROM users WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)) AS new_this_month,
      (SELECT COUNT(*)::int FROM users WHERE created_at >= ${startDate} AND created_at < ${endDate}) AS new_in_period,
      (SELECT COUNT(*)::int FROM users WHERE created_at >= ${prevStartDate} AND created_at < ${prevEndDate}) AS new_in_prev_period,

      -- Period active users
      (SELECT COUNT(DISTINCT uid)::int FROM (
        SELECT user_id AS uid FROM user_activity WHERE last_seen_at >= ${startDate} AND last_seen_at < ${endDate}
        UNION
        SELECT user_id AS uid FROM progress WHERE watched = true AND watched_at >= ${startDate} AND watched_at < ${endDate}
        UNION
        SELECT user_id AS uid FROM reading_progress WHERE updated_at >= ${startDate} AND updated_at < ${endDate}
        UNION
        SELECT user_id AS uid FROM material_view_log WHERE viewed_on >= (${startDate})::date AND viewed_on < (${endDate})::date
        UNION
        SELECT user_id AS uid FROM analytics_events WHERE created_at >= ${startDate} AND created_at < ${endDate}
      ) a_per) AS active_in_period,

      -- Previous period active users
      (SELECT COUNT(DISTINCT uid)::int FROM (
        SELECT user_id AS uid FROM user_activity WHERE last_seen_at >= ${prevStartDate} AND last_seen_at < ${prevEndDate}
        UNION
        SELECT user_id AS uid FROM progress WHERE watched = true AND watched_at >= ${prevStartDate} AND watched_at < ${prevEndDate}
        UNION
        SELECT user_id AS uid FROM reading_progress WHERE updated_at >= ${prevStartDate} AND updated_at < ${prevEndDate}
        UNION
        SELECT user_id AS uid FROM material_view_log WHERE viewed_on >= (${prevStartDate})::date AND viewed_on < (${prevEndDate})::date
        UNION
        SELECT user_id AS uid FROM analytics_events WHERE created_at >= ${prevStartDate} AND created_at < ${prevEndDate}
      ) a_prev) AS active_in_prev_period,

      -- Bugun faol o'quvchilar
      (SELECT COUNT(DISTINCT uid)::int FROM (
        SELECT user_id AS uid FROM user_activity WHERE last_seen_at >= CURRENT_DATE
        UNION
        SELECT user_id AS uid FROM progress WHERE watched = true AND watched_at >= CURRENT_DATE
        UNION
        SELECT user_id AS uid FROM reading_progress WHERE updated_at >= CURRENT_DATE
        UNION
        SELECT user_id AS uid FROM material_view_log WHERE viewed_on >= CURRENT_DATE
      ) a_tod) AS active_today,

      -- Bugungi kontent ko'rilishi
      (SELECT COUNT(DISTINCT user_id)::int FROM progress WHERE watched = true AND watched_at >= CURRENT_DATE) AS today_lesson_viewers,
      (SELECT COUNT(*)::int FROM progress WHERE watched = true AND watched_at >= CURRENT_DATE) AS today_lesson_views,
      (SELECT COUNT(DISTINCT user_id)::int FROM reading_progress WHERE updated_at >= CURRENT_DATE) AS today_book_readers,
      (SELECT COUNT(DISTINCT user_id)::int FROM material_view_log WHERE viewed_on >= CURRENT_DATE) AS today_material_viewers,
      (SELECT COUNT(DISTINCT user_id)::int FROM library_views WHERE viewed_at >= CURRENT_DATE) AS today_source_users,

      -- Period actions
      (SELECT COUNT(*)::int FROM progress WHERE watched = true AND watched_at >= ${startDate} AND watched_at < ${endDate}) AS period_lesson_views,
      (SELECT COUNT(*)::int FROM progress WHERE watched = true AND watched_at >= ${prevStartDate} AND watched_at < ${prevEndDate}) AS prev_lesson_views,
      (SELECT COUNT(*)::int FROM reading_progress WHERE updated_at >= ${startDate} AND updated_at < ${endDate}) AS period_book_reads,
      (SELECT COUNT(*)::int FROM reading_progress WHERE updated_at >= ${prevStartDate} AND updated_at < ${prevEndDate}) AS prev_book_reads,
      (SELECT COUNT(*)::int FROM material_view_log WHERE viewed_on >= (${startDate})::date AND viewed_on < (${endDate})::date) AS period_material_views,
      (SELECT COUNT(*)::int FROM material_view_log WHERE viewed_on >= (${prevStartDate})::date AND viewed_on < (${prevEndDate})::date) AS prev_material_views,
      (SELECT COUNT(*)::int FROM library_views WHERE viewed_at >= ${startDate} AND viewed_at < ${endDate}) AS period_source_views,
      (SELECT COUNT(*)::int FROM library_views WHERE viewed_at >= ${prevStartDate} AND viewed_at < ${prevEndDate}) AS prev_source_views
  `).catch(err => {
    console.error('KPI QUERY ERROR:', err.message);
    return { rows: [{}] };
  });

  // 2. TIME SERIES (Dinamik o'sish va faollik grafigi)
  const timeSeriesQuery = pool.query(`
    WITH series AS (
      SELECT generate_series(
        (${startDate})::timestamptz,
        LEAST((${endDate})::timestamptz - INTERVAL '${seriesConfig.step}', NOW())::timestamptz,
        INTERVAL '${seriesConfig.step}'
      ) AS bucket
    ),
    u_counts AS (
      SELECT DATE_TRUNC(
        CASE
          WHEN '${granularity}' = 'minutely' THEN 'minute'
          WHEN '${granularity}' = 'hourly' THEN 'hour'
          WHEN '${granularity}' = 'weekly' THEN 'week'
          WHEN '${granularity}' = 'monthly' THEN 'month'
          WHEN '${granularity}' = 'yearly' THEN 'year'
          ELSE 'day'
        END, created_at
      ) AS bucket, COUNT(*)::int AS cnt
      FROM users
      WHERE created_at >= ${startDate} AND created_at < ${endDate}
      GROUP BY 1
    ),
    p_counts AS (
      SELECT DATE_TRUNC(
        CASE
          WHEN '${granularity}' = 'minutely' THEN 'minute'
          WHEN '${granularity}' = 'hourly' THEN 'hour'
          WHEN '${granularity}' = 'weekly' THEN 'week'
          WHEN '${granularity}' = 'monthly' THEN 'month'
          WHEN '${granularity}' = 'yearly' THEN 'year'
          ELSE 'day'
        END, watched_at
      ) AS bucket, COUNT(*)::int AS cnt
      FROM progress
      WHERE watched = true AND watched_at >= ${startDate} AND watched_at < ${endDate}
      GROUP BY 1
    ),
    b_counts AS (
      SELECT DATE_TRUNC(
        CASE
          WHEN '${granularity}' = 'minutely' THEN 'minute'
          WHEN '${granularity}' = 'hourly' THEN 'hour'
          WHEN '${granularity}' = 'weekly' THEN 'week'
          WHEN '${granularity}' = 'monthly' THEN 'month'
          WHEN '${granularity}' = 'yearly' THEN 'year'
          ELSE 'day'
        END, updated_at
      ) AS bucket, COUNT(*)::int AS cnt
      FROM reading_progress
      WHERE updated_at >= ${startDate} AND updated_at < ${endDate}
      GROUP BY 1
    ),
    m_counts AS (
      SELECT DATE_TRUNC(
        CASE
          WHEN '${granularity}' = 'minutely' THEN 'minute'
          WHEN '${granularity}' = 'hourly' THEN 'hour'
          WHEN '${granularity}' = 'weekly' THEN 'week'
          WHEN '${granularity}' = 'monthly' THEN 'month'
          WHEN '${granularity}' = 'yearly' THEN 'year'
          ELSE 'day'
        END, viewed_on::timestamptz
      ) AS bucket, COUNT(*)::int AS cnt
      FROM material_view_log
      WHERE viewed_on >= (${startDate})::date AND viewed_on < (${endDate})::date
      GROUP BY 1
    ),
    s_counts AS (
      SELECT DATE_TRUNC(
        CASE
          WHEN '${granularity}' = 'minutely' THEN 'minute'
          WHEN '${granularity}' = 'hourly' THEN 'hour'
          WHEN '${granularity}' = 'weekly' THEN 'week'
          WHEN '${granularity}' = 'monthly' THEN 'month'
          WHEN '${granularity}' = 'yearly' THEN 'year'
          ELSE 'day'
        END, viewed_at
      ) AS bucket, COUNT(*)::int AS cnt
      FROM library_views
      WHERE viewed_at >= ${startDate} AND viewed_at < ${endDate}
      GROUP BY 1
    )
    SELECT
      s.bucket::text AS raw_date,
      TO_CHAR(s.bucket, '${seriesConfig.format}') AS label,
      COALESCE(u.cnt, 0)::int AS new_users,
      COALESCE(p.cnt, 0)::int AS lesson_views,
      COALESCE(b.cnt, 0)::int AS book_reads,
      COALESCE(m.cnt, 0)::int AS material_views,
      COALESCE(sc.cnt, 0)::int AS source_views,
      (COALESCE(p.cnt, 0) + COALESCE(b.cnt, 0) + COALESCE(m.cnt, 0) + COALESCE(sc.cnt, 0) + COALESCE(u.cnt, 0))::int AS total_activity
    FROM series s
    LEFT JOIN u_counts u ON u.bucket = s.bucket
    LEFT JOIN p_counts p ON p.bucket = s.bucket
    LEFT JOIN b_counts b ON b.bucket = s.bucket
    LEFT JOIN m_counts m ON m.bucket = s.bucket
    LEFT JOIN s_counts sc ON sc.bucket = s.bucket
    ORDER BY s.bucket ASC
  `).catch(err => {
    console.error('TIME SERIES QUERY ERROR:', err.message);
    return { rows: [] };
  });

  // 3. HAFTA KUNLARI FAOLLIGI (1=Dushanba ... 7=Yakshanba)
  const weekdayQuery = pool.query(`
    SELECT
      EXTRACT(ISODOW FROM act_time)::int AS dow,
      COUNT(DISTINCT user_id)::int AS active_users,
      COUNT(CASE WHEN act_type = 'lesson' THEN 1 END)::int AS lesson_views,
      COUNT(CASE WHEN act_type = 'book' THEN 1 END)::int AS book_reads,
      COUNT(CASE WHEN act_type = 'material' THEN 1 END)::int AS material_views,
      COUNT(*)::int AS total_activity
    FROM (
      SELECT user_id, watched_at AS act_time, 'lesson' AS act_type FROM progress WHERE watched = true AND watched_at >= ${startDate} AND watched_at < ${endDate}
      UNION ALL
      SELECT user_id, updated_at AS act_time, 'book' AS act_type FROM reading_progress WHERE updated_at >= ${startDate} AND updated_at < ${endDate}
      UNION ALL
      SELECT user_id, viewed_on::timestamptz AS act_time, 'material' AS act_type FROM material_view_log WHERE viewed_on >= (${startDate})::date AND viewed_on < (${endDate})::date
      UNION ALL
      SELECT user_id, last_seen_at AS act_time, 'session' AS act_type FROM user_activity WHERE last_seen_at >= ${startDate} AND last_seen_at < ${endDate}
    ) acts
    WHERE act_time IS NOT NULL
    GROUP BY dow
    ORDER BY dow ASC
  `).catch(err => {
    console.error('WEEKDAY QUERY ERROR:', err.message);
    return { rows: [] };
  });

  // 4. SOATLIK FAOLLIK (00:00 - 23:00)
  const hourlyQuery = pool.query(`
    SELECT
      EXTRACT(HOUR FROM act_time)::int AS hour,
      COUNT(DISTINCT user_id)::int AS active_users,
      COUNT(CASE WHEN act_type = 'lesson' THEN 1 END)::int AS lesson_views,
      COUNT(*)::int AS total_activity
    FROM (
      SELECT user_id, watched_at AS act_time, 'lesson' AS act_type FROM progress WHERE watched = true AND watched_at >= ${startDate} AND watched_at < ${endDate}
      UNION ALL
      SELECT user_id, updated_at AS act_time, 'book' AS act_type FROM reading_progress WHERE updated_at >= ${startDate} AND updated_at < ${endDate}
      UNION ALL
      SELECT user_id, last_seen_at AS act_time, 'session' AS act_type FROM user_activity WHERE last_seen_at >= ${startDate} AND last_seen_at < ${endDate}
    ) acts
    WHERE act_time IS NOT NULL
    GROUP BY hour
    ORDER BY hour ASC
  `).catch(err => {
    console.error('HOURLY QUERY ERROR:', err.message);
    return { rows: [] };
  });

  // 5. HAFTA KUNI X SOAT HEATMAP (168 cells)
  const heatmapQuery = pool.query(`
    SELECT
      EXTRACT(ISODOW FROM act_time)::int AS day,
      EXTRACT(HOUR FROM act_time)::int AS hour,
      COUNT(*)::int AS count
    FROM (
      SELECT watched_at AS act_time FROM progress WHERE watched = true AND watched_at >= ${startDate} AND watched_at < ${endDate}
      UNION ALL
      SELECT updated_at AS act_time FROM reading_progress WHERE updated_at >= ${startDate} AND updated_at < ${endDate}
      UNION ALL
      SELECT last_seen_at AS act_time FROM user_activity WHERE last_seen_at >= ${startDate} AND last_seen_at < ${endDate}
    ) acts
    WHERE act_time IS NOT NULL
    GROUP BY day, hour
  `).catch(err => {
    console.error('HEATMAP QUERY ERROR:', err.message);
    return { rows: [] };
  });

  // 6. DEEP DIVE: DARSLAR (Top and least watched)
  const lessonsDeepQuery = pool.query(`
    SELECT
      l.id,
      l.title,
      l.order_index,
      m.title AS module_title,
      c.title AS course_title,
      COUNT(p.user_id)::int AS view_count,
      COUNT(DISTINCT p.user_id)::int AS unique_viewers,
      ROUND((COUNT(DISTINCT p.user_id)::numeric / GREATEST((SELECT COUNT(*) FROM users), 1)) * 100, 1)::float AS completion_rate
    FROM lessons l
    JOIN modules m ON m.id = l.module_id
    LEFT JOIN courses c ON c.id = m.course_id
    LEFT JOIN progress p ON p.lesson_id = l.id AND p.watched = true
    GROUP BY l.id, m.title, c.title
    ORDER BY view_count DESC
    LIMIT 15
  `).catch(err => {
    console.error('LESSONS DEEP QUERY ERROR:', err.message);
    return { rows: [] };
  });

  // 7. DEEP DIVE: KITOBLAR (Top read & most saved)
  const booksDeepQuery = pool.query(`
    SELECT
      lb.id,
      lb.title,
      lb.author,
      COALESCE(lb.categories[1], 'Boshqa') AS category,
      COALESCE(lb.view_count, 0)::int AS view_count,
      COUNT(DISTINCT rp.user_id)::int AS unique_readers,
      COALESCE((SELECT COUNT(*)::int FROM saved_books sb WHERE sb.book_id = lb.id), 0)::int AS saved_count
    FROM library_books lb
    LEFT JOIN reading_progress rp ON rp.book_id = lb.id
    WHERE lb.status = 'published'
    GROUP BY lb.id, lb.title, lb.author, lb.categories, lb.view_count
    ORDER BY unique_readers DESC, lb.view_count DESC
    LIMIT 10
  `).catch(err => {
    console.error('BOOKS DEEP QUERY ERROR:', err.message);
    return { rows: [] };
  });

  // 8. DEEP DIVE: MATERIALLAR (Top viewed & category distribution)
  const materialsDeepQuery = pool.query(`
    SELECT
      m.id,
      COALESCE(m.name_uz, m.name, 'Material') AS name_uz,
      COALESCE(c.name, 'Boshqa') AS category,
      COALESCE(m.view_count, 0)::int AS view_count,
      COALESCE((SELECT COUNT(*)::int FROM material_likes ml WHERE ml.material_id = m.id), 0)::int AS like_count,
      COALESCE((SELECT COUNT(*)::int FROM material_saves ms WHERE ms.material_id = m.id), 0)::int AS save_count
    FROM materials m
    LEFT JOIN material_categories c ON c.id = m.category_id
    ORDER BY m.view_count DESC
    LIMIT 10
  `).catch(err => {
    console.error('MATERIALS DEEP QUERY ERROR:', err.message);
    return { rows: [] };
  });

  const materialsCatQuery = pool.query(`
    SELECT
      COALESCE(c.name, 'Boshqa') AS category,
      COUNT(m.id)::int AS item_count,
      COALESCE(SUM(m.view_count), 0)::int AS total_views
    FROM materials m
    LEFT JOIN material_categories c ON c.id = m.category_id
    GROUP BY c.name
    ORDER BY total_views DESC
    LIMIT 8
  `).catch(err => {
    console.error('MATERIALS CAT QUERY ERROR:', err.message);
    return { rows: [] };
  });

  // 9. DEEP DIVE: MANBALAR (Top used/downloaded library resources)
  const sourcesDeepQuery = pool.query(`
    SELECT
      lr.id,
      lr.title,
      lr.category,
      COALESCE(lr.view_count, 0)::int AS view_count,
      COALESCE(lr.download_count, 0)::int AS download_count
    FROM library_resources lr
    WHERE lr.status = 'published'
    ORDER BY (COALESCE(lr.view_count, 0) + COALESCE(lr.download_count, 0) * 2) DESC
    LIMIT 10
  `).catch(err => {
    console.error('SOURCES DEEP QUERY ERROR:', err.message);
    return { rows: [] };
  });

  // 10. TOP ACTIVE STUDENTS TABLE
  const topStudentsQuery = pool.query(`
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.username,
      u.telegram_id,
      u.access_until,
      u.created_at,
      ua.last_seen_at,
      COALESCE(p.watched_lessons, 0)::int AS watched_lessons,
      COALESCE(b.read_books, 0)::int AS read_books,
      COALESCE(m.viewed_materials, 0)::int AS viewed_materials,
      COALESCE(s.used_sources, 0)::int AS used_sources,
      (COALESCE(p.watched_lessons, 0) * 3 + COALESCE(b.read_books, 0) * 2 + COALESCE(m.viewed_materials, 0) + COALESCE(s.used_sources, 0))::int AS total_activity_score
    FROM users u
    LEFT JOIN user_activity ua ON ua.user_id = u.id
    LEFT JOIN (
      SELECT user_id, COUNT(*)::int AS watched_lessons
      FROM progress
      WHERE watched = true
      GROUP BY user_id
    ) p ON p.user_id = u.id
    LEFT JOIN (
      SELECT user_id, COUNT(DISTINCT book_id)::int AS read_books
      FROM reading_progress
      GROUP BY user_id
    ) b ON b.user_id = u.id
    LEFT JOIN (
      SELECT user_id, COUNT(DISTINCT material_id)::int AS viewed_materials
      FROM material_view_log
      GROUP BY user_id
    ) m ON m.user_id = u.id
    LEFT JOIN (
      SELECT user_id, COUNT(DISTINCT resource_id)::int AS used_sources
      FROM library_views
      GROUP BY user_id
    ) s ON s.user_id = u.id
    ORDER BY total_activity_score DESC, ua.last_seen_at DESC NULLS LAST
    LIMIT 20
  `).catch(err => {
    console.error('TOP STUDENTS QUERY ERROR:', err.message);
    return { rows: [] };
  });

  // 11. USER RETENTION (Cohorts)
  const retentionQuery = pool.query(`
    WITH base_cohort AS (
      SELECT id, created_at FROM users WHERE created_at <= NOW() - INTERVAL '30 DAYS'
    ),
    retention_stats AS (
      SELECT
        COUNT(*)::int AS total_cohort,
        COUNT(CASE WHEN EXISTS (
          SELECT 1 FROM progress p WHERE p.user_id = u.id AND p.watched_at BETWEEN u.created_at + INTERVAL '1 DAY' AND u.created_at + INTERVAL '2 DAYS'
          UNION
          SELECT 1 FROM user_activity ua WHERE ua.user_id = u.id AND ua.last_seen_at BETWEEN u.created_at + INTERVAL '1 DAY' AND u.created_at + INTERVAL '2 DAYS'
        ) THEN 1 END)::int AS day_1_active,
        COUNT(CASE WHEN EXISTS (
          SELECT 1 FROM progress p WHERE p.user_id = u.id AND p.watched_at BETWEEN u.created_at + INTERVAL '6 DAYS' AND u.created_at + INTERVAL '8 DAYS'
          UNION
          SELECT 1 FROM user_activity ua WHERE ua.user_id = u.id AND ua.last_seen_at BETWEEN u.created_at + INTERVAL '6 DAYS' AND u.created_at + INTERVAL '8 DAYS'
        ) THEN 1 END)::int AS day_7_active,
        COUNT(CASE WHEN EXISTS (
          SELECT 1 FROM progress p WHERE p.user_id = u.id AND p.watched_at BETWEEN u.created_at + INTERVAL '27 DAYS' AND u.created_at + INTERVAL '33 DAYS'
          UNION
          SELECT 1 FROM user_activity ua WHERE ua.user_id = u.id AND ua.last_seen_at BETWEEN u.created_at + INTERVAL '27 DAYS' AND u.created_at + INTERVAL '33 DAYS'
        ) THEN 1 END)::int AS day_30_active
      FROM base_cohort u
    )
    SELECT
      total_cohort,
      ROUND((day_1_active::numeric / GREATEST(total_cohort, 1)) * 100, 1)::float AS day_1_pct,
      ROUND((day_7_active::numeric / GREATEST(total_cohort, 1)) * 100, 1)::float AS day_7_pct,
      ROUND((day_30_active::numeric / GREATEST(total_cohort, 1)) * 100, 1)::float AS day_30_pct
    FROM retention_stats
  `).catch(err => {
    console.error('RETENTION QUERY ERROR:', err.message);
    return { rows: [{ total_cohort: 0, day_1_pct: 0, day_7_pct: 0, day_30_pct: 0 }] };
  });

  // Await all queries in parallel
  const [
    kpiRes,
    seriesRes,
    weekdayRes,
    hourlyRes,
    heatmapRes,
    lessonsDeepRes,
    booksDeepRes,
    materialsDeepRes,
    materialsCatRes,
    sourcesDeepRes,
    topStudentsRes,
    retentionRes
  ] = await Promise.all([
    kpiQuery,
    timeSeriesQuery,
    weekdayQuery,
    hourlyQuery,
    heatmapQuery,
    lessonsDeepQuery,
    booksDeepQuery,
    materialsDeepQuery,
    materialsCatQuery,
    sourcesDeepQuery,
    topStudentsQuery,
    retentionQuery
  ]);

  const k = kpiRes.rows[0] || {};
  const series = seriesRes.rows || [];
  const ret = retentionRes.rows[0] || {};

  // Compute time series summaries
  let sumNewUsers = 0;
  let sumActivity = 0;
  let peakPoint = { label: '-', value: 0 };

  series.forEach(pt => {
    sumNewUsers += pt.new_users;
    sumActivity += pt.total_activity;
    if (pt.total_activity > peakPoint.value) {
      peakPoint = { label: pt.label, value: pt.total_activity };
    }
  });

  const avgActivity = series.length ? Math.round(sumActivity / series.length) : 0;
  const newUsersGrowth = calcGrowth(k.new_in_period, k.new_in_prev_period);
  const activeUsersGrowth = calcGrowth(k.active_in_period, k.active_in_prev_period);
  const lessonGrowth = calcGrowth(k.period_lesson_views, k.prev_lesson_views);
  const bookGrowth = calcGrowth(k.period_book_reads, k.prev_book_reads);
  const materialGrowth = calcGrowth(k.period_material_views, k.prev_material_views);
  const sourceGrowth = calcGrowth(k.period_source_views, k.prev_source_views);

  // Compute Weekdays array (fill all 7 days)
  const weekdaysMap = new Map();
  (weekdayRes.rows || []).forEach(r => weekdaysMap.set(Number(r.dow), r));
  let peakDayName = 'Dushanba';
  let peakDayVal = -1;

  const weekdays = [1, 2, 3, 4, 5, 6, 7].map(dow => {
    const d = weekdaysMap.get(dow) || { active_users: 0, lesson_views: 0, book_reads: 0, material_views: 0, total_activity: 0 };
    const name = WEEKDAY_NAMES[dow - 1];
    if (d.total_activity > peakDayVal) {
      peakDayVal = d.total_activity;
      peakDayName = name;
    }
    return {
      dow,
      name,
      active_users: Number(d.active_users) || 0,
      lesson_views: Number(d.lesson_views) || 0,
      book_reads: Number(d.book_reads) || 0,
      material_views: Number(d.material_views) || 0,
      total_activity: Number(d.total_activity) || 0
    };
  });

  // Compute Hourly array (fill all 24 hours)
  const hourlyMap = new Map();
  (hourlyRes.rows || []).forEach(r => hourlyMap.set(Number(r.hour), r));
  let peakHourNum = 20;
  let peakHourVal = -1;

  const hourly = Array.from({ length: 24 }, (_, h) => {
    const r = hourlyMap.get(h) || { active_users: 0, lesson_views: 0, total_activity: 0 };
    const label = (h < 10 ? '0' : '') + h + ':00';
    if (r.total_activity > peakHourVal) {
      peakHourVal = r.total_activity;
      peakHourNum = h;
    }
    return {
      hour: h,
      label,
      active_users: Number(r.active_users) || 0,
      lesson_views: Number(r.lesson_views) || 0,
      total_activity: Number(r.total_activity) || 0
    };
  });

  // Heatmap matrix: 7 days x 24 hours
  const heatmapLookup = new Map();
  let maxHeat = 1;
  (heatmapRes.rows || []).forEach(r => {
    const key = `${r.day}_${r.hour}`;
    const cnt = Number(r.count) || 0;
    heatmapLookup.set(key, cnt);
    if (cnt > maxHeat) maxHeat = cnt;
  });

  const heatmap = [];
  for (let d = 1; d <= 7; d++) {
    for (let h = 0; h < 24; h++) {
      const cnt = heatmapLookup.get(`${d}_${h}`) || 0;
      let intensity = 0;
      if (cnt > 0) {
        intensity = Math.min(4, Math.ceil((cnt / maxHeat) * 4));
      }
      heatmap.push({ day: d, hour: h, count: cnt, intensity });
    }
  }

  // Category Breakdown Summary
  const catLessons = Number(k.period_lesson_views) || 0;
  const catBooks = Number(k.period_book_reads) || 0;
  const catMaterials = Number(k.period_material_views) || 0;
  const catSources = Number(k.period_source_views) || 0;
  const totalCatActions = catLessons + catBooks + catMaterials + catSources;

  const categories = [
    {
      key: 'lessons',
      name: 'Darslar',
      icon: '🎬',
      color: '#007aff',
      actions: catLessons,
      share_pct: totalCatActions ? Math.round((catLessons / totalCatActions) * 100) : 40,
      est_minutes: catLessons * 15
    },
    {
      key: 'books',
      name: 'Kitoblar',
      icon: '📖',
      color: '#ff9500',
      actions: catBooks,
      share_pct: totalCatActions ? Math.round((catBooks / totalCatActions) * 100) : 25,
      est_minutes: catBooks * 10
    },
    {
      key: 'materials',
      name: 'Materiallar',
      icon: '🧱',
      color: '#34c759',
      actions: catMaterials,
      share_pct: totalCatActions ? Math.round((catMaterials / totalCatActions) * 100) : 20,
      est_minutes: catMaterials * 5
    },
    {
      key: 'sources',
      name: 'Manbalar',
      icon: '📐',
      color: '#af52de',
      actions: catSources,
      share_pct: totalCatActions ? Math.round((catSources / totalCatActions) * 100) : 15,
      est_minutes: catSources * 5
    }
  ];

  return {
    ok: true,
    period,
    granularity,
    date_range: {
      start: startDate,
      end: endDate
    },
    kpi: {
      users: {
        total: k.total_users || 0,
        paid: k.paid_users || 0,
        new_today: k.new_today || 0,
        new_this_week: k.new_this_week || 0,
        new_this_month: k.new_this_month || 0,
        new_in_period: k.new_in_period || 0,
        new_growth_pct: newUsersGrowth,
        active_in_period: k.active_in_period || 0,
        active_growth_pct: activeUsersGrowth,
        active_today: k.active_today || 0,
        inactive: Math.max(0, (k.total_users || 0) - (k.active_in_period || 0))
      },
      content_today: {
        lesson_viewers: k.today_lesson_viewers || 0,
        lesson_views: k.today_lesson_views || 0,
        book_readers: k.today_book_readers || 0,
        material_viewers: k.today_material_viewers || 0,
        source_users: k.today_source_users || 0
      },
      content_period: {
        lesson_views: k.period_lesson_views || 0,
        lesson_growth_pct: lessonGrowth,
        book_reads: k.period_book_reads || 0,
        book_growth_pct: bookGrowth,
        material_views: k.period_material_views || 0,
        material_growth_pct: materialGrowth,
        source_views: k.period_source_views || 0,
        source_growth_pct: sourceGrowth
      }
    },
    time_series: {
      summary: {
        total_new_users: sumNewUsers,
        total_activity: sumActivity,
        average_activity: avgActivity,
        peak_label: peakPoint.label,
        peak_value: peakPoint.value,
        growth_pct: activeUsersGrowth
      },
      data: series
    },
    categories,
    weekdays: {
      data: weekdays,
      peak_day: peakDayName
    },
    hourly: {
      data: hourly,
      peak_hour: (peakHourNum < 10 ? '0' : '') + peakHourNum + ':00'
    },
    heatmap,
    deep_dives: {
      lessons: {
        total_views: k.period_lesson_views || 0,
        top_lessons: lessonsDeepRes.rows || [],
        least_lessons: (lessonsDeepRes.rows || []).slice(-5).reverse()
      },
      books: {
        total_reads: k.period_book_reads || 0,
        top_books: booksDeepRes.rows || []
      },
      materials: {
        total_views: k.period_material_views || 0,
        top_materials: materialsDeepRes.rows || [],
        categories: materialsCatRes.rows || []
      },
      sources: {
        total_views: k.period_source_views || 0,
        top_sources: sourcesDeepRes.rows || []
      }
    },
    retention: {
      cohort_size: ret.total_cohort || 0,
      day_1_pct: ret.day_1_pct || 0,
      day_7_pct: ret.day_7_pct || 0,
      day_30_pct: ret.day_30_pct || 0
    },
    top_students: topStudentsRes.rows || []
  };
}

function escapeCsvField(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

async function generateCsvExport(params = {}) {
  const data = await getDashboardData(params);
  const rows = [];

  // Header summary
  rows.push(['YOSHUZBEKK ACADEMY — ANALYTICS HISOBOTI']);
  rows.push(['Davr:', data.period, 'Granulyarlik:', data.granularity]);
  rows.push(['Hisobot yaratilgan sana:', new Date().toLocaleString('uz-UZ')]);
  rows.push([]);

  // KPIs
  rows.push(['--- UMUMIY KO‘RSATKICHLAR (KPI) ---']);
  rows.push(['Ko‘rsatkich', 'Qiymat']);
  rows.push(['Jami o‘quvchilar', data.kpi.users.total]);
  rows.push(['Faol kurs obunachilari', data.kpi.users.paid]);
  rows.push(['Tanlangan davrda yangi qo‘shilganlar', data.kpi.users.new_in_period]);
  rows.push(['Yangi a’zolar o‘sishi (%)', data.kpi.users.new_growth_pct + '%']);
  rows.push(['Tanlangan davrda faol o‘quvchilar', data.kpi.users.active_in_period]);
  rows.push(['Bugun faol o‘quvchilar', data.kpi.users.active_today]);
  rows.push(['Nofaol o‘quvchilar', data.kpi.users.inactive]);
  rows.push([]);

  // Time-series breakdown
  rows.push(['--- VAQT BO‘YICHA DINAMIKA ---']);
  rows.push(['Sana / Vaqt', 'Yangi A’zolar', 'Dars Ko‘rishlar', 'Kitob O‘qishlar', 'Materiallar', 'Manbalar', 'Jami Faollik']);
  data.time_series.data.forEach(pt => {
    rows.push([
      pt.label,
      pt.new_users,
      pt.lesson_views,
      pt.book_reads,
      pt.material_views,
      pt.source_views,
      pt.total_activity
    ]);
  });
  rows.push([]);

  // Weekdays
  rows.push(['--- HAFTA KUNLARI BO‘YICHA FAOLLIK ---']);
  rows.push(['Hafta kuni', 'Faol O‘quvchilar', 'Darslar', 'Kitoblar', 'Materiallar', 'Jami Faollik']);
  data.weekdays.data.forEach(w => {
    rows.push([w.name, w.active_users, w.lesson_views, w.book_reads, w.material_views, w.total_activity]);
  });
  rows.push([]);

  // Top lessons
  rows.push(['--- ENG KO‘P KO‘RILGAN DARSLAR ---']);
  rows.push(['#', 'Dars nomi', 'Modul', 'Ko‘rishlar soni', 'Unique o‘quvchilar', 'Yakunlash darajasi (%)']);
  data.deep_dives.lessons.top_lessons.forEach(l => {
    rows.push([l.order_index, l.title, l.module_title, l.view_count, l.unique_viewers, l.completion_rate + '%']);
  });
  rows.push([]);

  // Top books
  rows.push(['--- ENG KO‘P O‘QILGAN KITOBLAR ---']);
  rows.push(['ID', 'Kitob nomi', 'Muallif', 'Kategoriya', 'Ko‘rishlar', 'O‘quvchilar', 'Saqlanganlar']);
  data.deep_dives.books.top_books.forEach(b => {
    rows.push([b.id, b.title, b.author, b.category, b.view_count, b.unique_readers, b.saved_count]);
  });
  rows.push([]);

  // Top active students
  rows.push(['--- ENG FAOL O‘QUVCHILAR ---']);
  rows.push(['ID', 'F.I.SH', 'Username', 'Telegram ID', 'Darslar', 'Kitoblar', 'Materiallar', 'Manbalar', 'Umumiy Ball']);
  data.top_students.forEach(st => {
    const fullName = [st.first_name, st.last_name].filter(Boolean).join(' ') || 'Noma’lum';
    rows.push([st.id, fullName, st.username ? '@' + st.username : '-', st.telegram_id, st.watched_lessons, st.read_books, st.viewed_materials, st.used_sources, st.total_activity_score]);
  });

  // Format into CSV with UTF-8 BOM
  const csvContent = '\uFEFF' + rows.map(r => r.map(escapeCsvField).join(',')).join('\r\n');
  return csvContent;
}

module.exports = {
  init,
  ensureAnalyticsTables,
  trackEvent,
  getDashboardData,
  generateCsvExport
};
