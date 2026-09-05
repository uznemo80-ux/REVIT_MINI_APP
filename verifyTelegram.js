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
    if (!initData || !botToken) {
      return null;
    }

    const params = new URLSearchParams(initData);
    const hash = params.get('hash');

    if (!hash) {
      return null;
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
      .update(botToken)
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
