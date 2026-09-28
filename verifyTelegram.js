const crypto = require('crypto');

/**
 * Telegram WebApp initData ni tekshiradi.
 *
 * @param {string} initData — Telegram WebApp'dan kelgan initData string
 * @param {string} botToken — Bot token (.env dan)
 * @returns {object|null} — Tekshirilgan user object yoki null
 */
function verifyInitData(initData, botToken) {
  try {
    const token = botToken || process.env.BOT_TOKEN;
    if (!initData || !token) {
      return null;
    }

    const params = new URLSearchParams(initData);
    const hash = params.get('hash');

    if (!hash) {
      return null;
    }

    // 2-TALAB: Telegram initData muddati tekshiruvi (24 soat = 86400 soniya)
    const authDateStr = params.get('auth_date');
    if (authDateStr) {
      const authDate = parseInt(authDateStr, 10);
      const now = Math.floor(Date.now() / 1000);
      const MAX_AGE = 86400; // 24 soat
      if (now - authDate > MAX_AGE) {
        console.warn('VERIFY TELEGRAM: initData muddati o‘tgan (24 soatdan ko‘p)');
        return null;
      }
    }

    params.delete('hash');

    const sortedEntries = Array.from(params.entries()).sort(
      (a, b) => a[0].localeCompare(b[0])
    );

    const dataCheckString = sortedEntries
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(token)
      .digest();

    const computedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (computedHash !== hash) {
      console.warn('VERIFY TELEGRAM: Hash mismatch');
      return null;
    }

    const userStr = params.get('user');

    if (!userStr) {
      return null;
    }

    const user = JSON.parse(userStr);

    if (!user || !user.id) {
      return null;
    }

    return user;

  } catch (error) {
    console.error('VERIFY TELEGRAM ERROR:', error.message);
    return null;
  }
}

module.exports = { verifyInitData };
