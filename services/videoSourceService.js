const crypto = require('crypto');

/**
 * Yoshuzbekk Academy - Video Source Resolution Service
 * Handles multi-source video resolution (YouTube, Telegram, Bunny),
 * secure HMAC streaming token generation and validation, and graceful fallbacks.
 */

function getSecretKey(customSecret) {
  return customSecret || process.env.BOT_TOKEN || process.env.JWT_SECRET || 'yoshuzbekk_video_secret_key_2026';
}

/**
 * Sign a video streaming token for a specific user and lesson.
 * Token expires after durationMs (default: 6 hours).
 */
function signVideoToken(payload, durationMs = 6 * 3600 * 1000, customSecret) {
  const secret = getSecretKey(customSecret);
  const data = {
    user_id: payload.user_id,
    lesson_id: payload.lesson_id,
    exp: Date.now() + durationMs,
    iat: Date.now()
  };

  const jsonStr = JSON.stringify(data);
  const b64Data = Buffer.from(jsonStr).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(b64Data).digest('base64url');

  return `${b64Data}.${signature}`;
}

/**
 * Verify a video streaming token.
 * Returns { valid: true, payload } or { valid: false, error: string }
 */
function verifyVideoToken(token, customSecret) {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Token mavjud emas' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: "Token formati noto'g'ri" };
  }

  const [b64Data, signature] = parts;
  const secret = getSecretKey(customSecret);
  const expectedSig = crypto.createHmac('sha256', secret).update(b64Data).digest('base64url');

  if (signature !== expectedSig) {
    return { valid: false, error: "Token imzosi noto'g'ri" };
  }

  try {
    const jsonStr = Buffer.from(b64Data, 'base64url').toString('utf8');
    const payload = JSON.parse(jsonStr);

    if (!payload.exp || Date.now() > payload.exp) {
      return { valid: false, error: "Tokenning amal qilish muddati tugagan" };
    }

    return { valid: true, payload };
  } catch (err) {
    return { valid: false, error: "Tokenni o'qib bo'lmadi" };
  }
}

/**
 * Parse any Telegram channel/chat post link or ID.
 */
function parseTelegramVideoSource(input) {
  if (!input) return null;
  const str = String(input).trim();

  // 1. web.telegram.org: https://web.telegram.org/a/#-1001234567890_45 or web.telegram.org/k/#-1001234567890_45
  let m = str.match(/web\.telegram\.org\/[ak]\/#(-?\d+)_(\d+)/i);
  if (m) {
    let cid = m[1];
    if (!cid.startsWith('-100') && !cid.startsWith('-')) cid = '-100' + cid;
    return { chat_id: cid, message_id: parseInt(m[2], 10) };
  }

  // 2. tg://privatepost?channel=1234567890&post=45
  m = str.match(/tg:\/\/privatepost\?channel=(\d+)&post=(\d+)/i);
  if (m) {
    return { chat_id: '-100' + m[1], message_id: parseInt(m[2], 10) };
  }

  // 3. https://t.me/c/1234567890/45 or t.me/c/1234567890/99/45 (forum topic)
  m = str.match(/(?:t\.me|telegram\.me)\/c\/(\d+)(?:\/\d+)?\/(\d+)/i);
  if (m) {
    return { chat_id: '-100' + m[1], message_id: parseInt(m[2], 10) };
  }

  // 4. https://t.me/channel_username/123
  m = str.match(/(?:t\.me|telegram\.me)\/([A-Za-z][A-Za-z0-9_]{3,})(?:\/\d+)?\/(\d+)/i);
  if (m) {
    return { chat_id: '@' + m[1], message_id: parseInt(m[2], 10) };
  }

  // 5. -1001234567890/45 or -1001234567890:45 or 1234567890/45
  m = str.match(/^(-100\d+|\d+)[:\/](\d+)$/);
  if (m) {
    let cid = m[1];
    if (!cid.startsWith('-100')) cid = '-100' + cid;
    return { chat_id: cid, message_id: parseInt(m[2], 10) };
  }

  // 6. Direct file_id: BAACAgIAAxkBAAI... (min 20 chars without slashes)
  if (/^[A-Za-z0-9_-]{20,}$/.test(str)) {
    return { file_id: str };
  }

  return null;
}

/**
 * Determine which video source to serve to the student based on:
 * 1. Student personal preference (`user.video_platform`)
 * 2. System default preference (`defaultPlatform`, fallback: 'youtube')
 * 3. Availability of the sources with graceful fallback hierarchy
 */
function resolveLessonVideoSource(lesson, user, defaultPlatform = 'youtube') {
  const hasYouTube = Boolean(lesson && lesson.youtube_url && String(lesson.youtube_url).trim());
  const hasTelegram = Boolean(
    lesson && (
      (lesson.telegram_chat_id && lesson.telegram_message_id) ||
      lesson.telegram_file_id
    )
  );
  const hasBunny = Boolean(lesson && lesson.bunny_video_id && String(lesson.bunny_video_id).trim());

  const availableSources = {
    youtube: hasYouTube,
    telegram: hasTelegram,
    bunny: hasBunny
  };

  // User preference: 'youtube' | 'telegram' | 'bunny' | null / 'default'
  let preferredPlatform = (user && user.video_platform && user.video_platform !== 'default')
    ? String(user.video_platform).toLowerCase().trim()
    : String(defaultPlatform || 'youtube').toLowerCase().trim();

  if (!['youtube', 'telegram', 'bunny'].includes(preferredPlatform)) {
    preferredPlatform = 'youtube';
  }

  let chosenPlatform = null;

  // 1. Try preferred platform
  if (preferredPlatform === 'telegram' && hasTelegram) {
    chosenPlatform = 'telegram';
  } else if (preferredPlatform === 'bunny' && hasBunny) {
    chosenPlatform = 'bunny';
  } else if (preferredPlatform === 'youtube' && hasYouTube) {
    chosenPlatform = 'youtube';
  }

  // 2. Fallback hierarchy if preferred platform is missing
  if (!chosenPlatform) {
    if (preferredPlatform === 'telegram') {
      if (hasYouTube) chosenPlatform = 'youtube';
      else if (hasBunny) chosenPlatform = 'bunny';
    } else if (preferredPlatform === 'bunny') {
      if (hasYouTube) chosenPlatform = 'youtube';
      else if (hasTelegram) chosenPlatform = 'telegram';
    } else {
      // Preferred was youtube
      if (hasBunny) chosenPlatform = 'bunny';
      else if (hasTelegram) chosenPlatform = 'telegram';
    }
  }

  return {
    chosenPlatform,
    preferredPlatform,
    availableSources
  };
}

module.exports = {
  signVideoToken,
  verifyVideoToken,
  parseTelegramVideoSource,
  resolveLessonVideoSource
};
