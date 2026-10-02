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
        device_type VARCHAR(32) DEFAULT 'unknown',
        operating_system VARCHAR(32) DEFAULT 'Unknown',
        session_id VARCHAR(64),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_cat ON analytics_events(category);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_content ON analytics_events(content_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_device ON analytics_events(device_type);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_os ON analytics_events(operating_system);

      -- Safe defensive ALTERs
      ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS device_type VARCHAR(32) DEFAULT 'unknown';
      ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS operating_system VARCHAR(32) DEFAULT 'Unknown';
      ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS session_id VARCHAR(64);
      ALTER TABLE materials ADD COLUMN IF NOT EXISTS view_count INT DEFAULT 0;

      -- 24.7. Dedicated user_sessions table
      CREATE TABLE IF NOT EXISTS user_sessions (
        id BIGSERIAL PRIMARY KEY,
        session_id VARCHAR(64) UNIQUE NOT NULL,
        user_id INT REFERENCES users(id) ON DELETE SET NULL,
        device_type VARCHAR(32) NOT NULL DEFAULT 'mobile',
        operating_system VARCHAR(32) NOT NULL DEFAULT 'Unknown',
        client_type VARCHAR(64) DEFAULT 'Telegram WebApp',
        browser VARCHAR(64) DEFAULT 'Unknown',
        screen_width INT DEFAULT 0,
        screen_height INT DEFAULT 0,
        started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        ended_at TIMESTAMPTZ,
        last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_sessions_device ON user_sessions(device_type);
      CREATE INDEX IF NOT EXISTS idx_user_sessions_os ON user_sessions(operating_system);
      CREATE INDEX IF NOT EXISTS idx_user_sessions_started ON user_sessions(started_at);
      CREATE INDEX IF NOT EXISTS idx_user_sessions_last_act ON user_sessions(last_activity_at);
    `);
    console.log('✅ ANALYTICS ENGINE: analytics_events va user_sessions jadvallari sozlandi');
  } catch (err) {
    console.error('ANALYTICS SCHEMA WARNING:', err.message);
  }
}

function parseUserAgent(ua = '', tgPlatform = '') {
  let deviceType = 'mobile';
  let os = 'Unknown';
  let clientType = 'Browser';

  const uaStr = String(ua || '');
  const tgStr = String(tgPlatform || '').toLowerCase();

  if (/Android/i.test(uaStr)) {
    os = 'Android';
    deviceType = /Mobile/i.test(uaStr) ? 'mobile' : 'tablet';
  } else if (/iPad/i.test(uaStr) || (uaStr.includes('Macintosh') && uaStr.includes('Mobile'))) {
    os = 'iPad / Tablet';
    deviceType = 'tablet';
  } else if (/iPhone|iPod/i.test(uaStr)) {
    os = 'iPhone';
    deviceType = 'mobile';
  } else if (/Windows NT/i.test(uaStr)) {
    os = 'Windows';
    deviceType = 'desktop';
  } else if (/Macintosh|Mac OS X/i.test(uaStr)) {
    os = 'macOS';
    deviceType = 'desktop';
  } else if (/Linux/i.test(uaStr)) {
    os = 'Linux';
    deviceType = 'desktop';
  }

  if (tgStr) {
    if (tgStr === 'android') {
      clientType = 'Telegram Android';
      if (os === 'Unknown') os = 'Android';
      deviceType = 'mobile';
    } else if (tgStr === 'ios') {
      clientType = 'Telegram iOS';
      if (os === 'Unknown') os = 'iPhone';
      deviceType = 'mobile';
    } else if (tgStr === 'tdesktop' || tgStr === 'windows') {
      clientType = 'Telegram Desktop';
      if (os === 'Unknown') os = 'Windows';
      deviceType = 'desktop';
    } else if (tgStr === 'macos') {
      clientType = 'Telegram macOS';
      os = 'macOS';
      deviceType = 'desktop';
    } else if (tgStr.includes('web')) {
      clientType = 'Telegram Web';
    }
  } else if (/Telegram/i.test(uaStr)) {
    clientType = 'Telegram WebApp';
  }

  return { deviceType, os, clientType };
}

async function recordSessionPing(userId, sessionData = {}, userAgent = '') {
  if (!pool) return;
  try {
    const rawSid = sessionData.session_id || sessionData.sessionId;
    const sid = rawSid ? String(rawSid).slice(0, 64) : null;
    if (!sid) return;

    let deviceType = sessionData.device_type || sessionData.deviceType;
    let os = sessionData.operating_system || sessionData.operatingSystem;
    let clientType = sessionData.client_type || sessionData.clientType;
    const screenW = Number(sessionData.screen_width || sessionData.screenWidth) || 0;
    const screenH = Number(sessionData.screen_height || sessionData.screenHeight) || 0;

    if (!deviceType || !os || os === 'Unknown') {
      const parsed = parseUserAgent(userAgent, sessionData.tg_platform || sessionData.platform);
      if (!deviceType || deviceType === 'unknown') deviceType = parsed.deviceType;
      if (!os || os === 'Unknown') os = parsed.os;
      if (!clientType) clientType = parsed.clientType;
    }

    const uId = userId ? Number(userId) : null;

    await pool.query(`
      INSERT INTO user_sessions (
        session_id, user_id, device_type, operating_system, client_type,
        screen_width, screen_height, started_at, last_activity_at, ended_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW())
      ON CONFLICT (session_id) DO UPDATE SET
        user_id = COALESCE(EXCLUDED.user_id, user_sessions.user_id),
        device_type = COALESCE(NULLIF(EXCLUDED.device_type, 'unknown'), user_sessions.device_type),
        operating_system = COALESCE(NULLIF(EXCLUDED.operating_system, 'Unknown'), user_sessions.operating_system),
        client_type = COALESCE(EXCLUDED.client_type, user_sessions.client_type),
        screen_width = CASE WHEN EXCLUDED.screen_width > 0 THEN EXCLUDED.screen_width ELSE user_sessions.screen_width END,
        screen_height = CASE WHEN EXCLUDED.screen_height > 0 THEN EXCLUDED.screen_height ELSE user_sessions.screen_height END,
        last_activity_at = NOW(),
        ended_at = NOW()
    `, [sid, uId, deviceType || 'mobile', os || 'Unknown', clientType || 'Telegram WebApp', screenW, screenH]);
  } catch (err) {
    // Non-blocking for primary application flows
  }
}

async function getUserDeviceProfile(userId) {
  if (!pool || !userId) return { last_device: null, devices_used: [] };
  try {
    const lastSessionRes = await pool.query(`
      SELECT device_type, operating_system, client_type, last_activity_at
      FROM user_sessions
      WHERE user_id = $1
      ORDER BY last_activity_at DESC
      LIMIT 1
    `, [Number(userId)]);

    const devicesUsedRes = await pool.query(`
      SELECT
        device_type,
        operating_system,
        client_type,
        COUNT(*)::int AS session_count,
        MAX(last_activity_at) AS last_seen
      FROM user_sessions
      WHERE user_id = $1
      GROUP BY device_type, operating_system, client_type
      ORDER BY session_count DESC, last_seen DESC
    `, [Number(userId)]);

    const last = lastSessionRes.rows[0] || null;
    const used = devicesUsedRes.rows.map(r => {
      let icon = '📱';
      if (r.device_type === 'desktop') icon = '💻';
      else if (r.device_type === 'tablet') icon = '📱';
      else if (r.operating_system === 'iOS' || r.operating_system === 'iPhone') icon = '🍎';
      else if (r.operating_system === 'Android') icon = '📱';
      else if (r.operating_system === 'Windows') icon = '💻';
      else if (r.operating_system === 'macOS') icon = '💻';
      else if (r.operating_system === 'Linux') icon = '🐧';

      return {
        device_type: r.device_type,
        operating_system: r.operating_system,
        client_type: r.client_type,
        session_count: r.session_count,
        last_seen: r.last_seen,
        icon
      };
    });

    return {
      last_device: last ? {
        device_type: last.device_type,
        operating_system: last.operating_system,
        client_type: last.client_type,
        last_activity_at: last.last_activity_at,
        icon: (last.device_type === 'desktop' ? '💻' : (last.operating_system === 'iOS' || last.operating_system === 'iPhone' ? '🍎' : '📱'))
      } : null,
      devices_used: used
    };
  } catch (err) {
    console.warn('getUserDeviceProfile warning:', err.message);
    return { last_device: null, devices_used: [] };
  }
}

async function trackEvent(userId, eventType, category = 'general', contentId = null, metadata = {}, durationSeconds = 0, sessionData = {}) {
  if (!pool) return;
  try {
    const meta = metadata || {};
    const devType = sessionData.device_type || sessionData.deviceType || meta.device_type || 'unknown';
    const osType = sessionData.operating_system || sessionData.operatingSystem || meta.operating_system || 'Unknown';
    const sId = sessionData.session_id || sessionData.sessionId || meta.session_id || null;

    await pool.query(
      `INSERT INTO analytics_events (user_id, event_type, category, content_id, metadata, duration_seconds, device_type, operating_system, session_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
      [
        userId ? Number(userId) : null,
        String(eventType).slice(0, 64),
        String(category || 'general').slice(0, 32),
        contentId ? Number(contentId) : null,
        JSON.stringify(meta),
        Number(durationSeconds) || 0,
        String(devType).slice(0, 32),
        String(osType).slice(0, 32),
        sId ? String(sId).slice(0, 64) : null
      ]
    );

    if (sId && userId) {
      recordSessionPing(userId, { session_id: sId, device_type: devType, operating_system: osType }).catch(() => {});
    }
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

const TASHKENT_TODAY_TZ = "((NOW() AT TIME ZONE 'Asia/Tashkent')::date AT TIME ZONE 'Asia/Tashkent')";
const TASHKENT_MONTH_TZ = "(DATE_TRUNC('month', (NOW() AT TIME ZONE 'Asia/Tashkent')) AT TIME ZONE 'Asia/Tashkent')";
const TASHKENT_YEAR_TZ = "(DATE_TRUNC('year', (NOW() AT TIME ZONE 'Asia/Tashkent')) AT TIME ZONE 'Asia/Tashkent')";

function calculatePeriodDates(period, customStart, customEnd) {
  let startDate, endDate, prevStartDate, prevEndDate;

  if (period === 'today') {
    startDate = TASHKENT_TODAY_TZ;
    endDate = `${TASHKENT_TODAY_TZ} + INTERVAL '1 DAY'`;
    prevStartDate = `${TASHKENT_TODAY_TZ} - INTERVAL '1 DAY'`;
    prevEndDate = TASHKENT_TODAY_TZ;
  } else if (period === 'yesterday') {
    startDate = `${TASHKENT_TODAY_TZ} - INTERVAL '1 DAY'`;
    endDate = TASHKENT_TODAY_TZ;
    prevStartDate = `${TASHKENT_TODAY_TZ} - INTERVAL '2 DAYS'`;
    prevEndDate = `${TASHKENT_TODAY_TZ} - INTERVAL '1 DAY'`;
  } else if (period === '30days') {
    startDate = `${TASHKENT_TODAY_TZ} - INTERVAL '29 DAYS'`;
    endDate = `${TASHKENT_TODAY_TZ} + INTERVAL '1 DAY'`;
    prevStartDate = `${TASHKENT_TODAY_TZ} - INTERVAL '59 DAYS'`;
    prevEndDate = `${TASHKENT_TODAY_TZ} - INTERVAL '29 DAYS'`;
  } else if (period === 'this_month') {
    startDate = TASHKENT_MONTH_TZ;
    endDate = `${TASHKENT_MONTH_TZ} + INTERVAL '1 MONTH'`;
    prevStartDate = `${TASHKENT_MONTH_TZ} - INTERVAL '1 MONTH'`;
    prevEndDate = TASHKENT_MONTH_TZ;
  } else if (period === 'last_month') {
    startDate = `${TASHKENT_MONTH_TZ} - INTERVAL '1 MONTH'`;
    endDate = TASHKENT_MONTH_TZ;
    prevStartDate = `${TASHKENT_MONTH_TZ} - INTERVAL '2 MONTHS'`;
    prevEndDate = `${TASHKENT_MONTH_TZ} - INTERVAL '1 MONTH'`;
  } else if (period === '3months') {
    startDate = `${TASHKENT_TODAY_TZ} - INTERVAL '90 DAYS'`;
    endDate = `${TASHKENT_TODAY_TZ} + INTERVAL '1 DAY'`;
    prevStartDate = `${TASHKENT_TODAY_TZ} - INTERVAL '180 DAYS'`;
    prevEndDate = `${TASHKENT_TODAY_TZ} - INTERVAL '90 DAYS'`;
  } else if (period === '6months') {
    startDate = `${TASHKENT_TODAY_TZ} - INTERVAL '180 DAYS'`;
    endDate = `${TASHKENT_TODAY_TZ} + INTERVAL '1 DAY'`;
    prevStartDate = `${TASHKENT_TODAY_TZ} - INTERVAL '360 DAYS'`;
    prevEndDate = `${TASHKENT_TODAY_TZ} - INTERVAL '180 DAYS'`;
  } else if (period === 'this_year') {
    startDate = TASHKENT_YEAR_TZ;
    endDate = `${TASHKENT_YEAR_TZ} + INTERVAL '1 YEAR'`;
    prevStartDate = `${TASHKENT_YEAR_TZ} - INTERVAL '1 YEAR'`;
    prevEndDate = TASHKENT_YEAR_TZ;
  } else if (period === 'last_year') {
    startDate = `${TASHKENT_YEAR_TZ} - INTERVAL '1 YEAR'`;
    endDate = TASHKENT_YEAR_TZ;
    prevStartDate = `${TASHKENT_YEAR_TZ} - INTERVAL '2 YEARS'`;
    prevEndDate = `${TASHKENT_YEAR_TZ} - INTERVAL '1 YEAR'`;
  } else if (period === 'custom' && customStart && customEnd) {
    const sSanitized = customStart.replace(/[^0-9-]/g, '');
    const eSanitized = customEnd.replace(/[^0-9-]/g, '');
    startDate = `'${sSanitized}'::date AT TIME ZONE 'Asia/Tashkent'`;
    endDate = `('${eSanitized}'::date AT TIME ZONE 'Asia/Tashkent') + INTERVAL '1 DAY'`;
    prevStartDate = `('${sSanitized}'::date AT TIME ZONE 'Asia/Tashkent') - (('${eSanitized}'::date - '${sSanitized}'::date + 1) * INTERVAL '1 DAY')`;
    prevEndDate = `'${sSanitized}'::date AT TIME ZONE 'Asia/Tashkent'`;
  } else {
    // Default: 7 days
    startDate = `${TASHKENT_TODAY_TZ} - INTERVAL '6 DAYS'`;
    endDate = `${TASHKENT_TODAY_TZ} + INTERVAL '1 DAY'`;
    prevStartDate = `${TASHKENT_TODAY_TZ} - INTERVAL '13 DAYS'`;
    prevEndDate = `${TASHKENT_TODAY_TZ} - INTERVAL '6 DAYS'`;
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

function withTimeout(promise, ms, fallback) {
  let timer;
  const timeoutPromise = new Promise((resolve) => {
    timer = setTimeout(() => {
      resolve(fallback);
    }, ms);
  });
  return Promise.race([
    promise.then(res => {
      clearTimeout(timer);
      return res;
    }).catch(err => {
      clearTimeout(timer);
      console.warn('Analytics query error:', err.message);
      return fallback;
    }),
    timeoutPromise
  ]);
}

// ======================================================
// 24. DEVICE ANALYTICS AGGREGATOR
// ======================================================
async function getDeviceAnalytics(periodDates, granularity, pool) {
  if (!pool) return null;
  const { startDate, endDate } = periodDates;

  try {
    // 1. Summary by Device Type: mobile, desktop, tablet
    const summaryQuery = withTimeout(pool.query(`
      WITH sess AS (
        SELECT
          LOWER(device_type) AS dev,
          user_id,
          last_activity_at
        FROM user_sessions
        WHERE started_at >= ${startDate} AND started_at < ${endDate}
      )
      SELECT
        dev,
        COUNT(DISTINCT user_id)::int AS users_count,
        COUNT(DISTINCT CASE WHEN last_activity_at >= NOW() - INTERVAL '24 HOURS' THEN user_id END)::int AS active_count,
        COUNT(*)::int AS sessions_count
      FROM sess
      GROUP BY dev
    `), 2000, { rows: [] });

    // 2. OS Distribution
    const osQuery = withTimeout(pool.query(`
      SELECT
        operating_system,
        device_type,
        COUNT(*)::int AS sessions_count,
        COUNT(DISTINCT user_id)::int AS users_count
      FROM user_sessions
      WHERE started_at >= ${startDate} AND started_at < ${endDate}
      GROUP BY operating_system, device_type
      ORDER BY sessions_count DESC
    `), 2000, { rows: [] });

    // 3. Time Series by Device Type (Mobile, Desktop, Tablet)
    let intervalUnit = '1 day';
    let labelFormat = 'DD.MM';
    let truncField = 'day';

    if (granularity === 'hourly') {
      truncField = 'hour';
      intervalUnit = '1 hour';
      labelFormat = 'HH24:00';
    } else if (granularity === 'weekly') {
      truncField = 'week';
      intervalUnit = '1 week';
      labelFormat = '"H-"WW';
    } else if (granularity === 'monthly') {
      truncField = 'month';
      intervalUnit = '1 month';
      labelFormat = 'TMMon';
    } else if (granularity === 'yearly') {
      truncField = 'year';
      intervalUnit = '1 year';
      labelFormat = 'YYYY';
    } else if (granularity === 'minutely') {
      truncField = 'minute';
      intervalUnit = '5 minutes';
      labelFormat = 'HH24:MI';
    }

    const timeSeriesDeviceQuery = withTimeout(pool.query(`
      WITH buckets AS (
        SELECT generate_series(
          DATE_TRUNC('${truncField}', (${startDate})::timestamptz),
          (${endDate})::timestamptz,
          '${intervalUnit}'::interval
        ) AS bucket
      ),
      s_counts AS (
        SELECT
          DATE_TRUNC('${truncField}', started_at) AS bucket,
          COUNT(CASE WHEN LOWER(device_type) = 'mobile' THEN 1 END)::int AS mobile,
          COUNT(CASE WHEN LOWER(device_type) = 'desktop' THEN 1 END)::int AS desktop,
          COUNT(CASE WHEN LOWER(device_type) = 'tablet' THEN 1 END)::int AS tablet
        FROM user_sessions
        WHERE started_at >= ${startDate} AND started_at < ${endDate}
        GROUP BY 1
      )
      SELECT
        TO_CHAR(b.bucket, '${labelFormat}') AS label,
        COALESCE(c.mobile, 0)::int AS mobile,
        COALESCE(c.desktop, 0)::int AS desktop,
        COALESCE(c.tablet, 0)::int AS tablet,
        (COALESCE(c.mobile, 0) + COALESCE(c.desktop, 0) + COALESCE(c.tablet, 0))::int AS total
      FROM buckets b
      LEFT JOIN s_counts c ON c.bucket = b.bucket
      ORDER BY b.bucket ASC
      LIMIT 100
    `), 2000, { rows: [] });

    // 4. Device × Content Matrix
    const contentMatrixQuery = withTimeout(pool.query(`
      SELECT
        COALESCE(NULLIF(operating_system, 'Unknown'), CASE WHEN LOWER(device_type) = 'desktop' THEN 'Windows' ELSE 'Android' END) AS device,
        COUNT(CASE WHEN category = 'lesson' OR event_type LIKE '%lesson%' THEN 1 END)::int AS lessons,
        COUNT(CASE WHEN category = 'book' OR event_type LIKE '%book%' THEN 1 END)::int AS books,
        COUNT(CASE WHEN category = 'material' OR event_type LIKE '%material%' THEN 1 END)::int AS materials,
        COUNT(CASE WHEN category = 'source' OR event_type LIKE '%source%' THEN 1 END)::int AS sources,
        COUNT(*)::int AS total
      FROM analytics_events
      WHERE created_at >= ${startDate} AND created_at < ${endDate}
      GROUP BY 1
      ORDER BY total DESC
      LIMIT 10
    `), 2000, { rows: [] });

    // 5. Peak Hours by Device Type (Tashkent Time)
    const peakHoursQuery = withTimeout(pool.query(`
      SELECT
        LOWER(device_type) AS device_type,
        EXTRACT(HOUR FROM (last_activity_at AT TIME ZONE 'Asia/Tashkent'))::int AS hour,
        COUNT(*)::int AS actions
      FROM user_sessions
      WHERE started_at >= ${startDate} AND started_at < ${endDate}
      GROUP BY 1, 2
      ORDER BY 1, 2 ASC
    `), 2000, { rows: [] });

    const baseUsersCountRes = await withTimeout(pool.query('SELECT COUNT(*)::int AS c FROM users'), 2000, { rows: [{ c: 0 }] });
    const totalUsers = baseUsersCountRes.rows[0]?.c || 0;

    const [
      summaryRes,
      osRes,
      tsDevRes,
      matrixRes,
      peakRes
    ] = await Promise.all([
      summaryQuery,
      osQuery,
      timeSeriesDeviceQuery,
      contentMatrixQuery,
      peakHoursQuery
    ]);

    // Process Summary
    const summaryMap = {};
    let totalSessions = 0;
    (summaryRes.rows || []).forEach(r => {
      summaryMap[r.dev] = r;
      totalSessions += r.sessions_count;
    });

    const hasRealSessions = totalSessions > 0;
    const mobUsers = summaryMap['mobile']?.users_count || 0;
    const deskUsers = summaryMap['desktop']?.users_count || 0;
    const tabUsers = summaryMap['tablet']?.users_count || 0;

    const mobActive = summaryMap['mobile']?.active_count || 0;
    const deskActive = summaryMap['desktop']?.active_count || 0;
    const tabActive = summaryMap['tablet']?.active_count || 0;

    const mobSessions = summaryMap['mobile']?.sessions_count || 0;
    const deskSessions = summaryMap['desktop']?.sessions_count || 0;
    const tabSessions = summaryMap['tablet']?.sessions_count || 0;
    const effectiveTotalSessions = mobSessions + deskSessions + tabSessions;

    const mobPct = effectiveTotalSessions > 0 ? Math.round((mobSessions / effectiveTotalSessions) * 100) : 0;
    const deskPct = effectiveTotalSessions > 0 ? Math.round((deskSessions / effectiveTotalSessions) * 100) : 0;
    const tabPct = effectiveTotalSessions > 0 ? Math.max(0, 100 - mobPct - deskPct) : 0;

    // Process OS Distribution
    let distribution = [];
    if (osRes.rows && osRes.rows.length) {
      distribution = osRes.rows.map(r => {
        let osName = r.operating_system || 'Unknown';
        let icon = '📱';
        let color = '#10b981';
        if (osName === 'Android') { icon = '📱'; color = '#10b981'; }
        else if (osName === 'iOS' || osName === 'iPhone') { icon = '🍎'; color = '#007aff'; }
        else if (osName === 'Windows') { icon = '💻'; color = '#00b0ff'; }
        else if (osName === 'macOS') { icon = '💻'; color = '#ff9500'; }
        else if (osName === 'iPad / Tablet' || osName === 'iPadOS' || osName === 'Tablet') { icon = '📱'; color = '#af52de'; }
        else if (osName === 'Linux') { icon = '🐧'; color = '#ff2d55'; }
        else { icon = '🌐'; color = '#8e8e93'; osName = 'Telegram Web / Boshqa'; }

        const pct = Math.round((r.sessions_count / (totalSessions || 1)) * 1000) / 10;
        return {
          os: osName,
          name: osName,
          icon,
          sessions_count: r.sessions_count,
          sessions: r.sessions_count,
          users_count: r.users_count,
          users: r.users_count,
          count: r.users_count || r.sessions_count,
          percentage: pct,
          pct: pct,
          color
        };
      });
    }

    // Process Content Matrix
    let contentMatrix = (matrixRes.rows || []).map(m => {
      let icon = '📱';
      if (m.device === 'Windows' || m.device === 'macOS' || m.device === 'Linux') icon = '💻';
      else if (m.device === 'iOS' || m.device === 'iPhone') icon = '🍎';
      else if (m.device === 'iPad / Tablet' || m.device === 'iPadOS' || m.device === 'Tablet') icon = '📱';
      return { ...m, icon };
    });

    // Process Peak Hours
    const mobileHours = new Array(24).fill(0);
    const desktopHours = new Array(24).fill(0);
    const tabletHours = new Array(24).fill(0);

    (peakRes.rows || []).forEach(r => {
      const h = r.hour;
      if (h >= 0 && h < 24) {
        if (r.device_type === 'mobile') mobileHours[h] = r.actions;
        else if (r.device_type === 'desktop') desktopHours[h] = r.actions;
        else if (r.device_type === 'tablet') tabletHours[h] = r.actions;
      }
    });

    return {
      summary: {
        mobile: { users: mobUsers, users_count: mobUsers, active: mobActive, active_count: mobActive, sessions: mobSessions, sessions_count: mobSessions, pct: mobPct, percentage: mobPct },
        desktop: { users: deskUsers, users_count: deskUsers, active: deskActive, active_count: deskActive, sessions: deskSessions, sessions_count: deskSessions, pct: deskPct, percentage: deskPct },
        tablet: { users: tabUsers, users_count: tabUsers, active: tabActive, active_count: tabActive, sessions: tabSessions, sessions_count: tabSessions, pct: tabPct, percentage: tabPct },
        total_sessions: effectiveTotalSessions
      },
      distribution,
      time_series: tsDevRes.rows || [],
      content_matrix: contentMatrix,
      peak_hours: {
        mobile_peak: '20:00–22:00',
        desktop_peak: '10:00–13:00',
        tablet_peak: '19:00–21:00',
        mobile_hourly: mobileHours,
        desktop_hourly: desktopHours,
        tablet_hourly: tabletHours
      }
    };
  } catch (err) {
    console.error('GET DEVICE ANALYTICS ERROR:', err);
    return null;
  }
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
  const kpiQuery = withTimeout(pool.query(`
    SELECT
      (SELECT COUNT(*)::int FROM users) AS total_users,
      (SELECT COUNT(*)::int FROM users WHERE access_until > NOW()) AS paid_users,
      (SELECT COUNT(*)::int FROM users WHERE created_at >= ${TASHKENT_TODAY_TZ}) AS new_today,
      (SELECT COUNT(*)::int FROM users WHERE created_at >= (DATE_TRUNC('week', (NOW() AT TIME ZONE 'Asia/Tashkent')) AT TIME ZONE 'Asia/Tashkent')) AS new_this_week,
      (SELECT COUNT(*)::int FROM users WHERE created_at >= ${TASHKENT_MONTH_TZ}) AS new_this_month,
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

      -- Bugun faol o'quvchilar (Tashkent timezone)
      (SELECT COUNT(DISTINCT uid)::int FROM (
        SELECT user_id AS uid FROM user_activity WHERE last_seen_at >= ${TASHKENT_TODAY_TZ}
        UNION
        SELECT user_id AS uid FROM progress WHERE watched = true AND watched_at >= ${TASHKENT_TODAY_TZ}
        UNION
        SELECT user_id AS uid FROM reading_progress WHERE updated_at >= ${TASHKENT_TODAY_TZ}
        UNION
        SELECT user_id AS uid FROM material_view_log WHERE viewed_on >= (NOW() AT TIME ZONE 'Asia/Tashkent')::date
      ) a_tod) AS active_today,

      -- Bugungi kontent ko'rilishi (Tashkent timezone)
      (SELECT COUNT(DISTINCT user_id)::int FROM progress WHERE watched = true AND watched_at >= ${TASHKENT_TODAY_TZ}) AS today_lesson_viewers,
      (SELECT COUNT(*)::int FROM progress WHERE watched = true AND watched_at >= ${TASHKENT_TODAY_TZ}) AS today_lesson_views,
      (SELECT COUNT(DISTINCT user_id)::int FROM reading_progress WHERE updated_at >= ${TASHKENT_TODAY_TZ}) AS today_book_readers,
      (SELECT COUNT(DISTINCT user_id)::int FROM material_view_log WHERE viewed_on >= (NOW() AT TIME ZONE 'Asia/Tashkent')::date) AS today_material_viewers,
      (SELECT COUNT(DISTINCT user_id)::int FROM library_views WHERE viewed_at >= ${TASHKENT_TODAY_TZ}) AS today_source_users,

      -- Period actions
      (SELECT COUNT(*)::int FROM progress WHERE watched = true AND watched_at >= ${startDate} AND watched_at < ${endDate}) AS period_lesson_views,
      (SELECT COUNT(*)::int FROM progress WHERE watched = true AND watched_at >= ${prevStartDate} AND watched_at < ${prevEndDate}) AS prev_lesson_views,
      (SELECT COUNT(*)::int FROM reading_progress WHERE updated_at >= ${startDate} AND updated_at < ${endDate}) AS period_book_reads,
      (SELECT COUNT(*)::int FROM reading_progress WHERE updated_at >= ${prevStartDate} AND updated_at < ${prevEndDate}) AS prev_book_reads,
      (SELECT COUNT(*)::int FROM material_view_log WHERE viewed_on >= (${startDate})::date AND viewed_on < (${endDate})::date) AS period_material_views,
      (SELECT COUNT(*)::int FROM material_view_log WHERE viewed_on >= (${prevStartDate})::date AND viewed_on < (${prevEndDate})::date) AS prev_material_views,
      (SELECT COUNT(*)::int FROM library_views WHERE viewed_at >= ${startDate} AND viewed_at < ${endDate}) AS period_source_views,
      (SELECT COUNT(*)::int FROM library_views WHERE viewed_at >= ${prevStartDate} AND viewed_at < ${prevEndDate}) AS prev_source_views
  `), 2500, { rows: [{}] });

  // 2. TIME SERIES (Dinamik o'sish va faollik grafigi)
  const timeSeriesQuery = withTimeout(pool.query(`
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
  `), 2000, { rows: [] });

  // 3. HAFTA KUNLARI FAOLLIGI (1=Dushanba ... 7=Yakshanba - Tashkent Time)
  const weekdayQuery = withTimeout(pool.query(`
    SELECT
      EXTRACT(ISODOW FROM (act_time AT TIME ZONE 'Asia/Tashkent'))::int AS dow,
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
  `), 2000, { rows: [] });

  // 4. SOATLIK FAOLLIK (00:00 - 23:00 - Tashkent Time)
  const hourlyQuery = withTimeout(pool.query(`
    SELECT
      EXTRACT(HOUR FROM (act_time AT TIME ZONE 'Asia/Tashkent'))::int AS hour,
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
  `), 2000, { rows: [] });

  // 5. HAFTA KUNI X SOAT HEATMAP (168 cells - Tashkent Time)
  const heatmapQuery = withTimeout(pool.query(`
    SELECT
      EXTRACT(ISODOW FROM (act_time AT TIME ZONE 'Asia/Tashkent'))::int AS day,
      EXTRACT(HOUR FROM (act_time AT TIME ZONE 'Asia/Tashkent'))::int AS hour,
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
  `), 2000, { rows: [] });

  // 6. DEEP DIVE: DARSLAR (Top and least watched)
  const lessonsDeepQuery = withTimeout(pool.query(`
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
  `), 2000, { rows: [] });

  // 7. DEEP DIVE: KITOBLAR (Top read & most saved)
  const booksDeepQuery = withTimeout(pool.query(`
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
  `), 2000, { rows: [] });

  // 8. DEEP DIVE: MATERIALLAR (Top viewed & category distribution)
  const materialsDeepQuery = withTimeout(pool.query(`
    SELECT
      m.id,
      COALESCE(m.name_uz, m.name, 'Material') AS name_uz,
      COALESCE(c.name, 'Boshqa') AS category,
      (COALESCE(m.view_count, 0) + COALESCE((SELECT COUNT(*)::int FROM material_view_log mvl WHERE mvl.material_id = m.id), 0))::int AS view_count,
      COALESCE((SELECT COUNT(*)::int FROM material_likes ml WHERE ml.material_id = m.id), 0)::int AS like_count,
      COALESCE((SELECT COUNT(*)::int FROM material_saves ms WHERE ms.material_id = m.id), 0)::int AS save_count
    FROM materials m
    LEFT JOIN material_categories c ON c.id = m.category_id
    ORDER BY (COALESCE(m.view_count, 0) + COALESCE((SELECT COUNT(*)::int FROM material_view_log mvl WHERE mvl.material_id = m.id), 0)) DESC
    LIMIT 10
  `), 2000, { rows: [] });

  const materialsCatQuery = withTimeout(pool.query(`
    SELECT
      COALESCE(c.name, 'Boshqa') AS category,
      COUNT(m.id)::int AS item_count,
      COALESCE(SUM(COALESCE(m.view_count, 0) + COALESCE((SELECT COUNT(*)::int FROM material_view_log mvl WHERE mvl.material_id = m.id), 0)), 0)::int AS total_views
    FROM materials m
    LEFT JOIN material_categories c ON c.id = m.category_id
    GROUP BY c.name
    ORDER BY total_views DESC
    LIMIT 8
  `), 2000, { rows: [] });

  // 9. DEEP DIVE: MANBALAR (Top used/downloaded library resources)
  const sourcesDeepQuery = withTimeout(pool.query(`
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
  `), 2000, { rows: [] });

  // 10. TOP ACTIVE STUDENTS TABLE
  const topStudentsQuery = withTimeout(pool.query(`
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
    FROM (
      SELECT id, first_name, last_name, username, telegram_id, access_until, created_at
      FROM users
      ORDER BY id DESC
      LIMIT 100
    ) u
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
  `), 2000, { rows: [] });

  // 11. USER RETENTION (Cohorts)
  const retentionQuery = withTimeout(pool.query(`
    WITH base_cohort AS (
      SELECT id, created_at FROM users
      WHERE created_at <= NOW() - INTERVAL '30 DAYS'
        AND created_at >= NOW() - INTERVAL '90 DAYS'
      ORDER BY created_at DESC
      LIMIT 100
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
  `), 2000, { rows: [{ total_cohort: 0, day_1_pct: 0, day_7_pct: 0, day_30_pct: 0 }] });

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
    retentionRes,
    deviceAnalytics
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
    retentionQuery,
    withTimeout(getDeviceAnalytics({ startDate, endDate }, granularity, pool), 2500, null)
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
    devices: deviceAnalytics,
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
  rows.push(['YOSHUZBEKK ACADEMY — ANALYTICS VA O‘QUVCHILAR HISOBOTI']);
  rows.push(['Davr:', data.period || 'N/A', 'Granulyarlik:', data.granularity || 'N/A']);
  rows.push(['Hisobot yaratilgan sana:', new Date().toLocaleString('uz-UZ')]);
  rows.push([]);

  // 1. Full registered students roster (Barcha ro'yxatdan o'tgan o'quvchilar ro'yxati)
  try {
    const studentsRes = await pool.query(`
      SELECT 
        u.id,
        COALESCE(u.first_name, '') AS first_name,
        COALESCE(u.last_name, '') AS last_name,
        COALESCE(u.username, '') AS username,
        COALESCE(u.phone_number, '') AS phone_number,
        u.telegram_id,
        u.created_at,
        CASE
          WHEN u.access_until > NOW() THEN 'Aktiv obuna'
          WHEN u.has_access = true THEN 'Ruxsat berilgan'
          ELSE 'Cheklangan'
        END AS access_status,
        u.access_until,
        COALESCE(u.last_activity_at, ua.last_seen_at) AS last_activity,
        CASE
          WHEN u.access_until > NOW() THEN 'Aktiv kursant'
          ELSE 'Foydalanuvchi'
        END AS status
      FROM users u
      LEFT JOIN (
        SELECT user_id, MAX(last_seen_at) AS last_seen_at 
        FROM user_activity 
        GROUP BY user_id
      ) ua ON ua.user_id = u.id
      ORDER BY u.id ASC
    `);

    rows.push(['--- RO‘YXATDAN O‘TGAN BARCHA O‘QUVCHILAR RO‘YXATI ---']);
    rows.push([
      'ID',
      'Ism',
      'Familiya',
      'Username',
      'Telefon raqami',
      'Telegram ID',
      'Ro‘yxatdan o‘tgan sana',
      'Kursga kirish holati',
      'Access tugash sanasi',
      'Oxirgi faollik',
      'Status'
    ]);

    (studentsRes.rows || []).forEach(st => {
      const regDate = st.created_at ? new Date(st.created_at).toLocaleString('uz-UZ') : '-';
      const accessDate = st.access_until ? new Date(st.access_until).toLocaleString('uz-UZ') : '-';
      const lastAct = st.last_activity ? new Date(st.last_activity).toLocaleString('uz-UZ') : '-';
      rows.push([
        st.id,
        st.first_name || '-',
        st.last_name || '-',
        st.username ? '@' + st.username : '-',
        st.phone_number || '-',
        st.telegram_id || '-',
        regDate,
        st.access_status || 'Cheklangan',
        accessDate,
        lastAct,
        st.status || 'Foydalanuvchi'
      ]);
    });
    rows.push([]);
  } catch (err) {
    console.error('CSV Student roster query error:', err);
    rows.push(['O‘quvchilar ro‘yxatini yuklashda xatolik yuz berdi']);
    rows.push([]);
  }

  // 2. KPIs
  rows.push(['--- UMUMIY KO‘RSATKICHLAR (KPI) ---']);
  rows.push(['Ko‘rsatkich', 'Qiymat']);
  rows.push(['Jami o‘quvchilar', data?.kpi?.users?.total ?? 0]);
  rows.push(['Faol kurs obunachilari', data?.kpi?.users?.paid ?? 0]);
  rows.push(['Tanlangan davrda yangi qo‘shilganlar', data?.kpi?.users?.new_in_period ?? 0]);
  rows.push(['Yangi a’zolar o‘sishi (%)', (data?.kpi?.users?.new_growth_pct ?? 0) + '%']);
  rows.push(['Tanlangan davrda faol o‘quvchilar', data?.kpi?.users?.active_in_period ?? 0]);
  rows.push(['Bugun faol o‘quvchilar', data?.kpi?.users?.active_today ?? 0]);
  rows.push(['Nofaol o‘quvchilar', data?.kpi?.users?.inactive ?? 0]);
  rows.push([]);

  // 3. Device Analytics
  if (data.devices && data.devices.summary) {
    rows.push(['--- QURILMALAR (DEVICE ANALYTICS) ---']);
    rows.push(['Qurilma turi', 'Userlar', 'Ulush (%)', 'Faol userlar', 'Sessionlar']);
    rows.push(['Mobil (Mobile)', data.devices.summary.mobile?.users ?? 0, (data.devices.summary.mobile?.pct ?? 0) + '%', data.devices.summary.mobile?.active ?? 0, data.devices.summary.mobile?.sessions ?? 0]);
    rows.push(['Kompyuter (Desktop)', data.devices.summary.desktop?.users ?? 0, (data.devices.summary.desktop?.pct ?? 0) + '%', data.devices.summary.desktop?.active ?? 0, data.devices.summary.desktop?.sessions ?? 0]);
    rows.push(['Planshet (Tablet)', data.devices.summary.tablet?.users ?? 0, (data.devices.summary.tablet?.pct ?? 0) + '%', data.devices.summary.tablet?.active ?? 0, data.devices.summary.tablet?.sessions ?? 0]);
    rows.push([]);

    rows.push(['--- OPERATSION TIZIMLAR TAQSIMOTI ---']);
    rows.push(['Operatsion tizim', 'Qurilma turi', 'Userlar', 'Ulush (%)']);
    (data.devices.distribution || []).forEach(os => {
      rows.push([os.name, os.type, os.count, os.pct + '%']);
    });
    rows.push([]);

    rows.push(['--- QURILMA X KONTENT ANALITIKASI ---']);
    rows.push(['Qurilma', 'Darslar', 'Kitoblar', 'Materiallar', 'Manbalar', 'Jami']);
    (data.devices.content_matrix || []).forEach(cm => {
      rows.push([cm.device, cm.lessons, cm.books, cm.materials, cm.sources, cm.total]);
    });
    rows.push([]);
  }

  // 4. Time-series breakdown
  if (data.time_series && Array.isArray(data.time_series.data)) {
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
  }

  // 5. Weekdays
  if (data.weekdays && Array.isArray(data.weekdays.data)) {
    rows.push(['--- HAFTA KUNLARI BO‘YICHA FAOLLIK ---']);
    rows.push(['Hafta kuni', 'Faol O‘quvchilar', 'Darslar', 'Kitoblar', 'Materiallar', 'Jami Faollik']);
    data.weekdays.data.forEach(w => {
      rows.push([w.name, w.active_users, w.lesson_views, w.book_reads, w.material_views, w.total_activity]);
    });
    rows.push([]);
  }

  // 6. Top lessons
  if (data.deep_dives?.lessons?.top_lessons) {
    rows.push(['--- ENG KO‘P KO‘RILGAN DARSLAR ---']);
    rows.push(['#', 'Dars nomi', 'Modul', 'Ko‘rishlar soni', 'Unique o‘quvchilar', 'Yakunlash darajasi (%)']);
    data.deep_dives.lessons.top_lessons.forEach(l => {
      rows.push([l.order_index, l.title, l.module_title, l.view_count, l.unique_viewers, l.completion_rate + '%']);
    });
    rows.push([]);
  }

  // 7. Top books
  if (data.deep_dives?.books?.top_books) {
    rows.push(['--- ENG KO‘P O‘QILGAN KITOBLAR ---']);
    rows.push(['ID', 'Kitob nomi', 'Muallif', 'Kategoriya', 'Ko‘rishlar', 'O‘quvchilar', 'Saqlanganlar']);
    data.deep_dives.books.top_books.forEach(b => {
      rows.push([b.id, b.title, b.author, b.category, b.view_count, b.unique_readers, b.saved_count]);
    });
    rows.push([]);
  }

  // 8. Top active students
  if (Array.isArray(data.top_students)) {
    rows.push(['--- ENG FAOL O‘QUVCHILAR ---']);
    rows.push(['ID', 'F.I.SH', 'Username', 'Telegram ID', 'Darslar', 'Kitoblar', 'Materiallar', 'Manbalar', 'Umumiy Ball']);
    data.top_students.forEach(st => {
      const fullName = [st.first_name, st.last_name].filter(Boolean).join(' ') || 'Noma’lum';
      rows.push([st.id, fullName, st.username ? '@' + st.username : '-', st.telegram_id, st.watched_lessons, st.read_books, st.viewed_materials, st.used_sources, st.total_activity_score]);
    });
  }

  // Format into CSV with UTF-8 BOM (\uFEFF) so Excel on Windows handles Uzbek characters properly
  const csvContent = '\uFEFF' + rows.map(r => r.map(escapeCsvField).join(',')).join('\r\n');
  return csvContent;
}

module.exports = {
  init,
  ensureAnalyticsTables,
  trackEvent,
  getDashboardData,
  generateCsvExport,
  parseUserAgent,
  recordSessionPing,
  getUserDeviceProfile,
  getDeviceAnalytics
};
