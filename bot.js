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

const ADMIN_ID = Number(process.env.ADMIN_TELEGRAM_ID || '8043641301');

if (!ADMIN_ID || Number.isNaN(ADMIN_ID)) {
  throw new Error('❌ ADMIN_TELEGRAM_ID noto‘g‘ri!');
}

console.log('👤 Admin ID:', ADMIN_ID);

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

pool.on('error', (error) => {
  console.error('❌ PostgreSQL pool error:', error);
});

// ======================================================
// CONSTANTS
// ======================================================

const ONE_YEAR_MS =
  365 * 24 * 60 * 60 * 1000;

// ======================================================
// /START
// ======================================================

bot.start(async (ctx) => {
  try {
    const appUrl = process.env.APP_URL;

    if (!appUrl) {
      console.error('❌ APP_URL topilmadi!');
      return ctx.reply(
        '❌ Mini App manzili sozlanmagan.'
      );
    }

    const freshUrl =
      `${appUrl}?v=${Date.now()}`;

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
  }
});

// ======================================================
// /APPROVE COMMAND
// Masalan: /approve 123456789
// ======================================================

bot.command('approve', async (ctx) => {
  try {

    // Faqat admin ishlata oladi
    if (ctx.from.id !== ADMIN_ID) {
      return ctx.reply(
        '❌ Sizda bu komandani ishlatish huquqi yo‘q.'
      );
    }

    const parts =
      ctx.message.text.trim().split(/\s+/);

    if (parts.length < 2) {
      return ctx.reply(
        '❗ Foydalanuvchi Telegram ID sini kiriting.\n\n' +
        'Misol:\n' +
        '/approve 123456789'
      );
    }

    const telegramId =
      Number(parts[1]);

    if (!telegramId) {
      return ctx.reply(
        '❌ Telegram ID noto‘g‘ri.'
      );
    }

    // Userni topamiz
    const userResult = await pool.query(
      `
      SELECT *
      FROM users
      WHERE telegram_id = $1
      LIMIT 1
      `,
      [telegramId]
    );

    if (userResult.rows.length === 0) {
      return ctx.reply(
        '❌ Bu Telegram ID bilan foydalanuvchi topilmadi.'
      );
    }

    const user = userResult.rows[0];

    // 1 yil access
    const accessUntil =
      new Date(Date.now() + ONE_YEAR_MS);

    // Access berish
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

    // Payment requestni approved qilish
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

    // Adminni xabardor qilish
    await ctx.reply(
      '✅ Ruxsat berildi!\n\n' +
      `👤 ${user.first_name || 'Nomaʼlum'}\n` +
      `🆔 ${telegramId}\n\n` +
      `📅 Amal qilish muddati: ${accessUntil.toLocaleDateString('uz-UZ')}`
    );

    // Foydalanuvchiga xabar
    try {

      await bot.telegram.sendMessage(
        telegramId,
        '🎉 To‘lovingiz tasdiqlandi!\n\n' +
        '✅ Revit kursiga kirish huquqi berildi.\n' +
        '📚 Darslarni ko‘rishingiz mumkin.\n\n' +
        'Botdagi «📚 Darslarni ochish» tugmasini bosing.'
      );

      console.log(
        `✅ Userga ruxsat xabari yuborildi: ${telegramId}`
      );

    } catch (error) {

      console.error(
        '❌ Userga xabar yuborilmadi:',
        error.message
      );
    }

  } catch (error) {

    console.error(
      '❌ /approve ERROR:',
      error
    );

    await ctx.reply(
      '❌ Ruxsat berishda xatolik yuz berdi.'
    );
  }
});

// ======================================================
// APPROVE BUTTON
// ======================================================

bot.action(
  /^approve_(\d+)$/,
  async (ctx) => {

    try {

      // Faqat admin
      if (ctx.from.id !== ADMIN_ID) {

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

      // Userni topamiz
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

      if (userResult.rows.length === 0) {

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

      // 1 yil
      const accessUntil =
        new Date(
          Date.now() + ONE_YEAR_MS
        );

      // Access berish
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

      // Payment approved
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

      // Tugmani bosganini tasdiqlash
      await ctx.answerCbQuery(
        '✅ Ruxsat berildi!'
      );

      // Admin xabarini yangilash
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

      // Userga xabar
      try {

        await bot.telegram.sendMessage(
          telegramId,
          '🎉 To‘lovingiz tasdiqlandi!\n\n' +
          '✅ Revit kursiga kirish huquqi berildi.\n\n' +
          '📚 Endi darslarni ko‘rishingiz mumkin.\n\n' +
          'Botdagi «📚 Darslarni ochish» tugmasini bosing.'
        );

        console.log(
          `✅ Userga tasdiq xabari yuborildi: ${telegramId}`
        );

      } catch (error) {

        console.error(
          '❌ USERGA XABAR YUBORILMADI:',
          error.message
        );
      }

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

      // Faqat admin
      if (ctx.from.id !== ADMIN_ID) {

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

      // Userni topamiz
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

      if (userResult.rows.length === 0) {

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

      // Pending requestni rejected qilish
      const result =
        await pool.query(
          `
          UPDATE payment_requests
          SET status = 'rejected'
          WHERE user_id = $1
            AND status = 'pending'
          RETURNING id
          `,
          [user.id]
        );

      await ctx.answerCbQuery(
        '🔴 So‘rov rad etildi.'
      );

      // Admin xabarini yangilash
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

      // Userga xabar
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
          '❌ USERGA RAD JAVOBI YUBORILMADI:',
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

    // Agar user ID berilgan bo‘lsa,
    // approve/reject tugmalarini chiqaramiz
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

    // Telegram 409
    if (
      error.message &&
      error.message.includes('409')
    ) {

      console.error(
        '⚠️ TELEGRAM 409 CONFLICT!'
      );

      console.error(
        '⚠️ Telegram bot boshqa joyda ham ishlayapti.'
      );

      console.error(
        '⚠️ Railway’da eski deployment yoki boshqa bot processini tekshiring.'
      );
    }

    throw error;
  }
}

// ======================================================
// BOT ERROR HANDLER
// ======================================================

bot.catch((error, ctx) => {

  console.error(
    `❌ BOT ERROR [${ctx.updateType}]:`,
    error
  );

});

// ======================================================
// LAUNCH BOT
// ======================================================

async function startBot() {

  try {

    console.log(
      '🤖 Telegram bot ishga tushmoqda...'
    );

    console.log(
      '👤 Admin ID:',
      ADMIN_ID
    );

    await bot.launch();

    console.log(
      '🤖 Telegram bot ishga tushdi ✅'
    );

  } catch (error) {

    console.error(
      '❌ BOT LAUNCH ERROR:',
      error
    );

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
      console.error(
        'Railway’da duplicate deployment/replica borligini tekshiring.'
      );
      console.error(
        '================================================'
      );
      console.error('');
    }

    throw error;
  }
}

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
