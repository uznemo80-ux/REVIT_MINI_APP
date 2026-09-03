require('dotenv').config();

const { Telegraf } = require('telegraf');
const { Pool } = require('pg');

// ======================================================
// ENV
// ======================================================

if (!process.env.BOT_TOKEN) {
  throw new Error('❌ BOT_TOKEN topilmadi!');
}

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL topilmadi!');
}

if (!process.env.APP_URL) {
  throw new Error('❌ APP_URL topilmadi!');
}

const ADMIN_ID = Number(
  process.env.ADMIN_TELEGRAM_ID || '8043641301'
);

if (!ADMIN_ID || Number.isNaN(ADMIN_ID)) {
  throw new Error('❌ ADMIN_TELEGRAM_ID noto‘g‘ri!');
}

const APP_URL = process.env.APP_URL.trim();

console.log('==========================================');
console.log('🤖 BOT CONFIG');
console.log('==========================================');
console.log('👤 Admin ID:', ADMIN_ID);
console.log('🌐 APP URL:', APP_URL);
console.log('==========================================');

// ======================================================
// BOT
// ======================================================

const bot = new Telegraf(
  process.env.BOT_TOKEN
);

// ======================================================
// DATABASE
// ======================================================

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', (error) => {
  console.error(
    '❌ PostgreSQL pool error:',
    error
  );
});

// ======================================================
// CONSTANTS
// ======================================================

const ONE_YEAR_MS =
  365 * 24 * 60 * 60 * 1000;

// ======================================================
// MINI APP URL
// ======================================================

function getFreshAppUrl() {
  return `${APP_URL}?v=${Date.now()}`;
}

// ======================================================
// SET TELEGRAM MENU BUTTON
// ======================================================
//
// Bot chatining pastki Menu tugmasi orqali
// Mini App ochiladi.
//
// ======================================================

async function setupMenuButton() {

  try {

    await bot.telegram.callApi(
      'setChatMenuButton',
      {
        menu_button: {
          type: 'web_app',
          text: '📚 Darslarni ochish',
          web_app: {
            url: APP_URL
          }
        }
      }
    );

    console.log(
      '✅ Telegram Menu tugmasi sozlandi.'
    );

  } catch (error) {

    console.error(
      '❌ Menu tugmasini sozlashda xatolik:',
      error.message
    );

  }

}

// ======================================================
// /START
// ======================================================

bot.start(async (ctx) => {

  try {

    const freshUrl =
      getFreshAppUrl();

    await ctx.reply(
      'Assalomu alaykum! Revit darslariga xush kelibsiz 👋\n\n' +
      'Darslarni ko‘rish uchun quyidagi tugmani bosing:',
      {
        reply_markup: {

          inline_keyboard: [

            [
              {
                text: '📚 Darslarni ochish',
                web_app: {
                  url: freshUrl
                }
              }
            ]

          ]

        }
      }
    );

    console.log(
      `✅ /start: ${ctx.from.id}`
    );

  } catch (error) {

    console.error(
      '❌ /start ERROR:',
      error
    );

    try {

      await ctx.reply(
        '❌ Mini Appni ochishda xatolik yuz berdi.'
      );

    } catch {}

  }

});

// ======================================================
// /APPROVE COMMAND
// Masalan:
// /approve 123456789
// ======================================================

bot.command(
  'approve',
  async (ctx) => {

    try {

      // ----------------------------------------------
      // ADMIN CHECK
      // ----------------------------------------------

      if (ctx.from.id !== ADMIN_ID) {

        return ctx.reply(
          '❌ Sizda bu komandani ishlatish huquqi yo‘q.'
        );

      }

      // ----------------------------------------------
      // COMMAND DATA
      // ----------------------------------------------

      const parts =
        ctx.message.text
          .trim()
          .split(/\s+/);

      if (parts.length < 2) {

        return ctx.reply(
          '❗ Foydalanuvchi Telegram ID sini kiriting.\n\n' +
          'Misol:\n' +
          '/approve 123456789'
        );

      }

      const telegramId =
        Number(parts[1]);

      if (
        !telegramId ||
        Number.isNaN(telegramId)
      ) {

        return ctx.reply(
          '❌ Telegram ID noto‘g‘ri.'
        );

      }

      // ----------------------------------------------
      // FIND USER
      // ----------------------------------------------

      const userResult =
        await pool.query(
          `
          SELECT *
          FROM users
          WHERE telegram_id = $1
          LIMIT 1
          `,
          [telegramId]
        );

      if (
        userResult.rows.length === 0
      ) {

        return ctx.reply(
          '❌ Bu Telegram ID bilan foydalanuvchi topilmadi.'
        );

      }

      const user =
        userResult.rows[0];

      // ----------------------------------------------
      // ACCESS UNTIL
      // ----------------------------------------------

      const accessUntil =
        new Date(
          Date.now() + ONE_YEAR_MS
        );

      // ----------------------------------------------
      // GIVE ACCESS
      // ----------------------------------------------

      await pool.query(
        `
        UPDATE users
        SET access_until = $1
        WHERE telegram_id = $2
        `,
        [
          accessUntil,
          telegramId
        ]
      );

      // ----------------------------------------------
      // APPROVE PAYMENT REQUEST
      // ----------------------------------------------

      await pool.query(
        `
        UPDATE payment_requests
        SET
          status = 'approved',
          approved_at = NOW(),
          approved_by = $1
        WHERE user_id = $2
          AND status = 'pending'
        `,
        [
          ADMIN_ID,
          user.id
        ]
      );

      // ----------------------------------------------
      // ADMIN RESPONSE
      // ----------------------------------------------

      await ctx.reply(
        '✅ Ruxsat berildi!\n\n' +
        `👤 ${user.first_name || 'Nomaʼlum'}\n` +
        `🆔 ${telegramId}\n\n` +
        `📅 Amal qilish muddati: ${accessUntil.toLocaleDateString('uz-UZ')}`
      );

      // ----------------------------------------------
      // USER NOTIFICATION
      // ----------------------------------------------

      await sendAccessGrantedMessage(
        telegramId
      );

    } catch (error) {

      console.error(
        '❌ /approve ERROR:',
        error
      );

      try {

        await ctx.reply(
          '❌ Ruxsat berishda xatolik yuz berdi.'
        );

      } catch {}

    }

  }
);

// ======================================================
// SEND ACCESS GRANTED MESSAGE
// ======================================================

async function sendAccessGrantedMessage(
  telegramId
) {

  try {

    await bot.telegram.sendMessage(
      telegramId,

      '🎉 To‘lovingiz tasdiqlandi!\n\n' +
      '✅ Revit kursiga kirish huquqi berildi.\n' +
      '📚 Endi darslarni ko‘rishingiz mumkin.\n\n' +
      'Botdagi «📚 Darslarni ochish» tugmasini bosing.'
    );

    console.log(
      `✅ Userga ruxsat xabari yuborildi: ${telegramId}`
    );

  } catch (error) {

    console.error(
      `❌ Userga xabar yuborilmadi ${telegramId}:`,
      error.message
    );

  }

}

// ======================================================
// APPROVE BUTTON
// ======================================================

bot.action(
  /^approve_(\d+)$/,
  async (ctx) => {

    try {

      // ----------------------------------------------
      // ADMIN CHECK
      // ----------------------------------------------

      if (
        ctx.from.id !== ADMIN_ID
      ) {

        await ctx.answerCbQuery(
          '❌ Siz admin emassiz.',
          {
            show_alert: true
          }
        );

        return;

      }

      const telegramId =
        Number(ctx.match[1]);

      console.log(
        `🟢 APPROVE: ${telegramId}`
      );

      // ----------------------------------------------
      // FIND USER
      // ----------------------------------------------

      const userResult =
        await pool.query(
          `
          SELECT *
          FROM users
          WHERE telegram_id = $1
          LIMIT 1
          `,
          [telegramId]
        );

      if (
        userResult.rows.length === 0
      ) {

        await ctx.answerCbQuery(
          '❌ Foydalanuvchi topilmadi.',
          {
            show_alert: true
          }
        );

        return;

      }

      const user =
        userResult.rows[0];

      // ----------------------------------------------
      // ACCESS UNTIL
      // ----------------------------------------------

      const accessUntil =
        new Date(
          Date.now() + ONE_YEAR_MS
        );

      // ----------------------------------------------
      // GIVE ACCESS
      // ----------------------------------------------

      await pool.query(
        `
        UPDATE users
        SET access_until = $1
        WHERE telegram_id = $2
        `,
        [
          accessUntil,
          telegramId
        ]
      );

      // ----------------------------------------------
      // PAYMENT APPROVED
      // ----------------------------------------------

      await pool.query(
        `
        UPDATE payment_requests
        SET
          status = 'approved',
          approved_at = NOW(),
          approved_by = $1
        WHERE user_id = $2
          AND status = 'pending'
        `,
        [
          ADMIN_ID,
          user.id
        ]
      );

      // ----------------------------------------------
      // CALLBACK RESPONSE
      // ----------------------------------------------

      await ctx.answerCbQuery(
        '✅ Ruxsat berildi!'
      );

      // ----------------------------------------------
      // UPDATE ADMIN MESSAGE
      // ----------------------------------------------

      try {

        await ctx.editMessageText(

          '🟢 TO‘LOV TASDIQLANDI\n\n' +

          `👤 Ism: ${user.first_name || 'Nomaʼlum'}\n` +

          `📱 Username: @${user.username || 'username yo‘q'}\n` +

          `🆔 Telegram ID: ${telegramId}\n\n` +

          `📅 Kirish muddati: ${accessUntil.toLocaleDateString('uz-UZ')}\n\n` +

          '✅ Foydalanuvchiga kirish huquqi berildi.'

        );

      } catch (error) {

        console.error(
          '⚠️ Admin message edit error:',
          error.message
        );

      }

      // ----------------------------------------------
      // USER NOTIFICATION
      // ----------------------------------------------

      await sendAccessGrantedMessage(
        telegramId
      );

    } catch (error) {

      console.error(
        '❌ APPROVE ERROR:',
        error
      );

      try {

        await ctx.answerCbQuery(
          '❌ Xatolik yuz berdi.',
          {
            show_alert: true
          }
        );

      } catch {}

    }

  }
);

// ======================================================
// REJECT BUTTON
// ======================================================

bot.action(
  /^reject_(\d+)$/,
  async (ctx) => {

    try {

      // ----------------------------------------------
      // ADMIN CHECK
      // ----------------------------------------------

      if (
        ctx.from.id !== ADMIN_ID
      ) {

        await ctx.answerCbQuery(
          '❌ Siz admin emassiz.',
          {
            show_alert: true
          }
        );

        return;

      }

      const telegramId =
        Number(ctx.match[1]);

      console.log(
        `🔴 REJECT: ${telegramId}`
      );

      // ----------------------------------------------
      // FIND USER
      // ----------------------------------------------

      const userResult =
        await pool.query(
          `
          SELECT *
          FROM users
          WHERE telegram_id = $1
          LIMIT 1
          `,
          [telegramId]
        );

      if (
        userResult.rows.length === 0
      ) {

        await ctx.answerCbQuery(
          '❌ Foydalanuvchi topilmadi.',
          {
            show_alert: true
          }
        );

        return;

      }

      const user =
        userResult.rows[0];

      // ----------------------------------------------
      // REJECT PAYMENT
      // ----------------------------------------------

      await pool.query(
        `
        UPDATE payment_requests
        SET
          status = 'rejected'
        WHERE user_id = $1
          AND status = 'pending'
        `,
        [user.id]
      );

      // ----------------------------------------------
      // CALLBACK RESPONSE
      // ----------------------------------------------

      await ctx.answerCbQuery(
        '🔴 So‘rov rad etildi.'
      );

      // ----------------------------------------------
      // UPDATE ADMIN MESSAGE
      // ----------------------------------------------

      try {

        await ctx.editMessageText(

          '🔴 TO‘LOV SO‘ROVI RAD ETILDI\n\n' +

          `👤 Ism: ${user.first_name || 'Nomaʼlum'}\n` +

          `📱 Username: @${user.username || 'username yo‘q'}\n` +

          `🆔 Telegram ID: ${telegramId}\n\n` +

          '❌ Ruxsat berilmadi.'

        );

      } catch (error) {

        console.error(
          '⚠️ Reject message edit error:',
          error.message
        );

      }

      // ----------------------------------------------
      // USER NOTIFICATION
      // ----------------------------------------------

      try {

        await bot.telegram.sendMessage(

          telegramId,

          '❌ Afsuski, to‘lov so‘rovingiz rad etildi.\n\n' +

          'Agar bu xato deb hisoblasangiz, administrator bilan bog‘laning.'

        );

        console.log(
          `📨 Rad javobi userga yuborildi: ${telegramId}`
        );

      } catch (error) {

        console.error(
          `❌ USERGA RAD JAVOBI YUBORILMADI ${telegramId}:`,
          error.message
        );

      }

    } catch (error) {

      console.error(
        '❌ REJECT ERROR:',
        error
      );

      try {

        await ctx.answerCbQuery(
          '❌ Xatolik yuz berdi.',
          {
            show_alert: true
          }
        );

      } catch {}

    }

  }
);

// ======================================================
// NOTIFY ADMIN
// ======================================================

async function notifyAdmin(
  text,
  telegramId = null
) {

  try {

    console.log(
      '📤 ADMINGA XABAR YUBORILMOQDA...'
    );

    console.log(
      '🎯 ADMIN ID:',
      ADMIN_ID
    );

    const messageOptions = {};

    // ----------------------------------------------
    // APPROVE / REJECT BUTTONS
    // ----------------------------------------------

    if (telegramId) {

      messageOptions.reply_markup = {

        inline_keyboard: [

          [
            {
              text: '🟢 Ruxsat berish',
              callback_data:
                `approve_${telegramId}`
            }
          ],

          [
            {
              text: '🔴 Rad etish',
              callback_data:
                `reject_${telegramId}`
            }
          ]

        ]

      };

    }

    // ----------------------------------------------
    // SEND MESSAGE
    // ----------------------------------------------

    const result =
      await bot.telegram.sendMessage(
        ADMIN_ID,
        text,
        messageOptions
      );

    console.log(
      '✅ ADMINGA XABAR YUBORILDI'
    );

    console.log(
      '📨 Message ID:',
      result.message_id
    );

    return result;

  } catch (error) {

    console.error(
      '❌ ADMINGA XABAR YUBORILMADI'
    );

    console.error(
      '❌ XATO:',
      error.message
    );

    // ----------------------------------------------
    // 409 CONFLICT
    // ----------------------------------------------

    if (
      error.message &&
      error.message.includes('409')
    ) {

      console.error('');
      console.error(
        '=========================================='
      );
      console.error(
        '⚠️ TELEGRAM 409 CONFLICT!'
      );
      console.error(
        'Telegram bot boshqa processda ishlayapti.'
      );
      console.error(
        'Railway’da duplicate deployment yoki'
      );
      console.error(
        'bir nechta bot process borligini tekshiring.'
      );
      console.error(
        '=========================================='
      );
      console.error('');

    }

    throw error;

  }

}

// ======================================================
// BOT ERROR HANDLER
// ======================================================

bot.catch(
  (error, ctx) => {

    console.error(
      `❌ BOT ERROR [${ctx.updateType}]:`,
      error
    );

  }
);

// ======================================================
// LAUNCH BOT
// ======================================================

async function startBot() {

  try {

    console.log('');
    console.log(
      '🤖 Telegram bot ishga tushmoqda...'
    );

    console.log(
      '👤 Admin ID:',
      ADMIN_ID
    );

    console.log(
      '🌐 Mini App URL:',
      APP_URL
    );

    // ----------------------------------------------
    // MENU BUTTON
    // ----------------------------------------------

    await setupMenuButton();

    // ----------------------------------------------
    // LAUNCH
    // ----------------------------------------------

    await bot.launch();

    console.log('');
    console.log(
      '=========================================='
    );
    console.log(
      '🤖 TELEGRAM BOT ISHGA TUSHDI ✅'
    );
    console.log(
      '📚 Mini App Menu tugmasi tayyor ✅'
    );
    console.log(
      '=========================================='
    );
    console.log('');

  } catch (error) {

    console.error(
      '❌ BOT LAUNCH ERROR:',
      error
    );

    // ----------------------------------------------
    // 409 CONFLICT
    // ----------------------------------------------

    if (
      error.message &&
      error.message.includes('409')
    ) {

      console.error('');
      console.error(
        '================================================'
      );
      console.error(
        '⚠️ TELEGRAM 409 CONFLICT'
      );
      console.error(
        'Telegram bot boshqa processda ishlayapti.'
      );
      console.error('');
      console.error(
        'Railway’da quyidagilarni tekshiring:'
      );
      console.error(
        '1. Duplicate deployment'
      );
      console.error(
        '2. Bir nechta replica'
      );
      console.error(
        '3. Eski bot processi'
      );
      console.error(
        '4. Boshqa serverda ishlayotgan bot'
      );
      console.error(
        '================================================'
      );
      console.error('');

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

process.once(
  'SIGINT',
  () => {

    console.log(
      '🛑 SIGINT: bot to‘xtatilmoqda...'
    );

    bot.stop('SIGINT');

  }
);

process.once(
  'SIGTERM',
  () => {

    console.log(
      '🛑 SIGTERM: bot to‘xtatilmoqda...'
    );

    bot.stop('SIGTERM');

  }
);

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  bot,
  notifyAdmin
};
