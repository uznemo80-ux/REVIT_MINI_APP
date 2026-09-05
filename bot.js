require('dotenv').config();

const { Telegraf } = require('telegraf');
const { Pool } = require('pg');

// ======================================================
// ENV
// ======================================================

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN topilmadi!');
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL topilmadi!');
}

if (!process.env.APP_URL) {
  throw new Error('APP_URL topilmadi!');
}

const ADMIN_ID = Number(
  process.env.ADMIN_TELEGRAM_ID || '8043641301'
);

if (!ADMIN_ID || Number.isNaN(ADMIN_ID)) {
  throw new Error('ADMIN_TELEGRAM_ID notogri!');
}

const APP_URL = process.env.APP_URL.trim();

console.log('==========================================');
console.log('BOT CONFIG');
console.log('==========================================');
console.log('Admin ID:', ADMIN_ID);
console.log('APP URL:', APP_URL);
console.log('==========================================');

// ======================================================
// BOT
// ======================================================

const bot = new Telegraf(process.env.BOT_TOKEN);

// ======================================================
// DATABASE
// ======================================================

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', function (error) {
  console.error('PostgreSQL pool error:', error);
});

// ======================================================
// CONSTANTS
// ======================================================

var ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

// ======================================================
// MINI APP URL
// ======================================================

function getFreshAppUrl() {
  return APP_URL + '?v=' + Date.now();
}

// ======================================================
// SET TELEGRAM MENU BUTTON
// ======================================================

async function setupMenuButton() {
  try {
    await bot.telegram.callApi('setChatMenuButton', {
      menu_button: {
        type: 'web_app',
        text: 'Darslarni ochish',
        web_app: { url: APP_URL }
      }
    });
    console.log('Telegram Menu tugmasi sozlandi.');
  } catch (error) {
    console.error('Menu tugmasini sozlashda xatolik:', error.message);
  }
}

// ======================================================
// /START
// ======================================================

bot.start(async function (ctx) {
  try {
    var freshUrl = getFreshAppUrl();
    await ctx.reply(
      'Assalomu alaykum! Revit darslariga xush kelibsiz!\n\nDarslarni korish uchun quyidagi tugmani bosing:',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Darslarni ochish', web_app: { url: freshUrl } }]
          ]
        }
      }
    );
    console.log('/start: ' + ctx.from.id);
  } catch (error) {
    console.error('/start ERROR:', error);
    try { await ctx.reply('Mini Appni ochishda xatolik yuz berdi.'); } catch (e) { void e; }
  }
});

// ======================================================
// /APPROVE COMMAND
// ======================================================

bot.command('approve', async function (ctx) {
  try {
    if (ctx.from.id !== ADMIN_ID) {
      return ctx.reply('Sizda bu komandani ishlatish huquqi yoq.');
    }

    var parts = ctx.message.text.trim().split(/\s+/);
    if (parts.length < 2) {
      return ctx.reply('Foydalanuvchi Telegram ID sini kiriting.\n\nMisol:\n/approve 123456789');
    }

    var telegramId = Number(parts[1]);
    if (!telegramId || Number.isNaN(telegramId)) {
      return ctx.reply('Telegram ID notogri.');
    }

    var userResult = await pool.query(
      'SELECT * FROM users WHERE telegram_id = $1 LIMIT 1',
      [telegramId]
    );

    if (userResult.rows.length === 0) {
      return ctx.reply('Bu Telegram ID bilan foydalanuvchi topilmadi.');
    }

    var user = userResult.rows[0];
    var accessUntil = new Date(Date.now() + ONE_YEAR_MS);

    await pool.query(
      'UPDATE users SET access_until = $1 WHERE telegram_id = $2',
      [accessUntil, telegramId]
    );

    await pool.query(
      "UPDATE payment_requests SET status = 'approved', approved_at = NOW(), approved_by = $1 WHERE user_id = $2 AND status = 'pending'",
      [ADMIN_ID, user.id]
    );

    await ctx.reply(
      'Ruxsat berildi!\n\n' +
      (user.first_name || 'Nomalum') + '\n' +
      'ID: ' + telegramId + '\n\n' +
      'Amal qilish muddati: ' + accessUntil.toLocaleDateString('uz-UZ')
    );

    await sendAccessGrantedMessage(telegramId);
  } catch (error) {
    console.error('/approve ERROR:', error);
    try { await ctx.reply('Ruxsat berishda xatolik yuz berdi.'); } catch (e) { void e; }
  }
});

// ======================================================
// SEND ACCESS GRANTED MESSAGE
// ======================================================

async function sendAccessGrantedMessage(telegramId) {
  try {
    await bot.telegram.sendMessage(
      telegramId,
      'Tolovingiz tasdiqlandi!\n\nRevit kursiga kirish huquqi berildi.\nEndi darslarni korishingiz mumkin.\n\nBotdagi "Darslarni ochish" tugmasini bosing.'
    );
    console.log('Userga ruxsat xabari yuborildi: ' + telegramId);
  } catch (error) {
    console.error('Userga xabar yuborilmadi ' + telegramId + ':', error.message);
  }
}

// ======================================================
// APPROVE BUTTON
// ======================================================

bot.action(/^approve_(\d+)$/, async function (ctx) {
  try {
    if (ctx.from.id !== ADMIN_ID) {
      await ctx.answerCbQuery('Siz admin emassiz.', { show_alert: true });
      return;
    }

    var telegramId = Number(ctx.match[1]);
    console.log('APPROVE: ' + telegramId);

    var userResult = await pool.query(
      'SELECT * FROM users WHERE telegram_id = $1 LIMIT 1',
      [telegramId]
    );

    if (userResult.rows.length === 0) {
      await ctx.answerCbQuery('Foydalanuvchi topilmadi.', { show_alert: true });
      return;
    }

    var user = userResult.rows[0];
    var accessUntil = new Date(Date.now() + ONE_YEAR_MS);

    await pool.query(
      'UPDATE users SET access_until = $1 WHERE telegram_id = $2',
      [accessUntil, telegramId]
    );

    await pool.query(
      "UPDATE payment_requests SET status = 'approved', approved_at = NOW(), approved_by = $1 WHERE user_id = $2 AND status = 'pending'",
      [ADMIN_ID, user.id]
    );

    await ctx.answerCbQuery('Ruxsat berildi!');

    try {
      await ctx.editMessageText(
        'TOLOV TASDIQLANDI\n\n' +
        'Ism: ' + (user.first_name || 'Nomalum') + '\n' +
        'Username: @' + (user.username || 'username yoq') + '\n' +
        'Telegram ID: ' + telegramId + '\n\n' +
        'Kirish muddati: ' + accessUntil.toLocaleDateString('uz-UZ') + '\n\n' +
        'Foydalanuvchiga kirish huquqi berildi.'
      );
    } catch (error) {
      console.error('Admin message edit error:', error.message);
    }

    await sendAccessGrantedMessage(telegramId);
  } catch (error) {
    console.error('APPROVE ERROR:', error);
    try { await ctx.answerCbQuery('Xatolik yuz berdi.', { show_alert: true }); } catch (e) { void e; }
  }
});

// ======================================================
// REJECT BUTTON
// ======================================================

bot.action(/^reject_(\d+)$/, async function (ctx) {
  try {
    if (ctx.from.id !== ADMIN_ID) {
      await ctx.answerCbQuery('Siz admin emassiz.', { show_alert: true });
      return;
    }

    var telegramId = Number(ctx.match[1]);
    console.log('REJECT: ' + telegramId);

    var userResult = await pool.query(
      'SELECT * FROM users WHERE telegram_id = $1 LIMIT 1',
      [telegramId]
    );

    if (userResult.rows.length === 0) {
      await ctx.answerCbQuery('Foydalanuvchi topilmadi.', { show_alert: true });
      return;
    }

    var user = userResult.rows[0];

    await pool.query(
      "UPDATE payment_requests SET status = 'rejected' WHERE user_id = $1 AND status = 'pending'",
      [user.id]
    );

    await ctx.answerCbQuery('Sorov rad etildi.');

    try {
      await ctx.editMessageText(
        'TOLOV SOROVI RAD ETILDI\n\n' +
        'Ism: ' + (user.first_name || 'Nomalum') + '\n' +
        'Username: @' + (user.username || 'username yoq') + '\n' +
        'Telegram ID: ' + telegramId + '\n\n' +
        'Ruxsat berilmadi.'
      );
    } catch (error) {
      console.error('Reject message edit error:', error.message);
    }

    try {
      await bot.telegram.sendMessage(
        telegramId,
        'Afsuski, tolov sorovingiz rad etildi.\n\nAgar bu xato deb hisoblasangiz, administrator bilan boglaning.'
      );
    } catch (error) {
      console.error('Userga rad javobi yuborilmadi ' + telegramId + ':', error.message);
    }
  } catch (error) {
    console.error('REJECT ERROR:', error);
    try { await ctx.answerCbQuery('Xatolik yuz berdi.', { show_alert: true }); } catch (e) { void e; }
  }
});

// ======================================================
// NOTIFY ADMIN
// ======================================================

async function notifyAdmin(text, telegramId) {
  try {
    console.log('ADMINGA XABAR YUBORILMOQDA...');
    console.log('ADMIN ID:', ADMIN_ID);

    var messageOptions = {};

    if (telegramId) {
      messageOptions.reply_markup = {
        inline_keyboard: [
          [{ text: 'Ruxsat berish', callback_data: 'approve_' + telegramId }],
          [{ text: 'Rad etish', callback_data: 'reject_' + telegramId }]
        ]
      };
    }

    var result = await bot.telegram.sendMessage(ADMIN_ID, text, messageOptions);
    console.log('ADMINGA XABAR YUBORILDI');
    console.log('Message ID:', result.message_id);
    return result;
  } catch (error) {
    console.error('ADMINGA XABAR YUBORILMADI');
    console.error('XATO:', error.message);

    if (error.message && error.message.includes('409')) {
      console.error('TELEGRAM 409 CONFLICT! Bot boshqa processda ishlayapti.');
    }

    throw error;
  }
}

// ======================================================
// BOT ERROR HANDLER
// ======================================================

bot.catch(function (error, ctx) {
  console.error('BOT ERROR [' + ctx.updateType + ']:', error);
});

// ======================================================
// LAUNCH BOT
// ======================================================

async function startBot() {
  try {
    console.log('');
    console.log('Telegram bot ishga tushmoqda...');
    console.log('Admin ID:', ADMIN_ID);
    console.log('Mini App URL:', APP_URL);

    await setupMenuButton();
    await bot.launch();

    console.log('');
    console.log('==========================================');
    console.log('TELEGRAM BOT ISHGA TUSHDI');
    console.log('Mini App Menu tugmasi tayyor');
    console.log('==========================================');
    console.log('');
  } catch (error) {
    console.error('BOT LAUNCH ERROR:', error);
    if (error.message && error.message.includes('409')) {
      console.error('TELEGRAM 409 CONFLICT');
    }
    throw error;
  }
}

// ======================================================
// START
// ======================================================

startBot();

// ======================================================
// GRACEFUL SHUTDOWN
// ======================================================

process.once('SIGINT', function () {
  console.log('SIGINT: bot toxtatilmoqda...');
  bot.stop('SIGINT');
});

process.once('SIGTERM', function () {
  console.log('SIGTERM: bot toxtatilmoqda...');
  bot.stop('SIGTERM');
});

// ======================================================
// EXPORT
// ======================================================

module.exports = { bot: bot, notifyAdmin: notifyAdmin };
