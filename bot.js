require('dotenv').config();

const { Telegraf } = require('telegraf');
const { Pool } = require('pg');

// ======================================================
// ENVIRONMENT
// ======================================================

if (!process.env.BOT_TOKEN) {
  throw new Error('❌ BOT_TOKEN topilmadi!');
}

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL topilmadi!');
}

const ADMIN_ID = Number(
  process.env.ADMIN_TELEGRAM_ID
);

if (!ADMIN_ID) {
  throw new Error(
    '❌ ADMIN_TELEGRAM_ID topilmadi yoki noto‘g‘ri!'
  );
}

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
  connectionString:
    process.env.DATABASE_URL
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
// /START
// ======================================================

bot.start(async (ctx) => {
  try {
    const appUrl =
      process.env.APP_URL;

    if (!appUrl) {
      throw new Error(
        'APP_URL topilmadi!'
      );
    }

    const freshUrl =
      `${appUrl}?v=${Date.now()}`;

    await ctx.reply(
      "Assalomu alaykum! Revit darslariga xush kelibsiz 👋\n\n" +
      "Darslarni ko‘rish uchun quyidagi tugmani bosing:",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text:
                  "📚 Darslarni ochish",

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
      '❌ START ERROR:',
      error
    );

    try {
      await ctx.reply(
        "❌ Mini App'ni ochishda xatolik yuz berdi."
      );
    } catch (replyError) {
      console.error(
        'START REPLY ERROR:',
        replyError.message
      );
    }
  }
});

// ======================================================
// /APPROVE
// QO‘LDA RUXSAT BERISH
//
// /approve 123456789
// ======================================================

bot.command(
  'approve',
  async (ctx) => {

    // --------------------------------------------------
    // ADMIN TEKSHIRISH
    // --------------------------------------------------

    if (
      ctx.from.id !== ADMIN_ID
    ) {
      return;
    }

    try {

      const parts =
        ctx.message.text
          .trim()
          .split(/\s+/);

      const targetId =
        Number(parts[1]);

      if (!targetId) {

        await ctx.reply(
          "❌ To‘g‘ri format:\n\n/approve 123456789"
        );

        return;
      }

      // --------------------------------------------------
      // USERNI TOPISH VA ACCESS BERISH
      // --------------------------------------------------

      const accessUntil =
        new Date(
          Date.now() +
          ONE_YEAR_MS
        );

      const userResult =
        await pool.query(
          `
          UPDATE users

          SET access_until = $1

          WHERE telegram_id = $2

          RETURNING
            id,
            telegram_id,
            first_name,
            username
          `,
          [
            accessUntil,
            targetId
          ]
        );

      if (
        userResult.rows.length === 0
      ) {

        await ctx.reply(
          `❌ ${targetId} Telegram ID bo‘yicha foydalanuvchi topilmadi.`
        );

        return;
      }

      const user =
        userResult.rows[0];

      // --------------------------------------------------
      // PAYMENT REQUESTNI APPROVED QILISH
      // --------------------------------------------------

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

      // --------------------------------------------------
      // ADMIN XABARI
      // --------------------------------------------------

      await ctx.reply(
        "✅ RUXSAT BERILDI\n\n" +

        `👤 Ism: ${
          user.first_name ||
          "Noma'lum"
        }\n` +

        `📱 Username: @${
          user.username ||
          "username yo‘q"
        }\n` +

        `🆔 Telegram ID: ${
          user.telegram_id
        }\n\n` +

        "📅 Kirish muddati:\n" +

        `${accessUntil.toLocaleDateString(
          'uz-UZ'
        )}\n\n` +

        "🔓 1 yillik kursga kirish faollashtirildi."
      );

      // --------------------------------------------------
      // USERGA XABAR
      // --------------------------------------------------

      try {

        await bot.telegram.sendMessage(
          targetId,

          "🎉 To‘lovingiz tasdiqlandi!\n\n" +

          "✅ Kursga kirish huquqi berildi.\n" +

          "📚 Barcha darslarga 1 yil davomida kirishingiz mumkin.\n\n" +

          "Mini App’ni qayta oching va darslarni boshlang."
        );

      } catch (error) {

        console.error(
          "❌ USER NOTIFICATION ERROR:",
          error.message
        );

      }

    } catch (error) {

      console.error(
        "❌ APPROVE COMMAND ERROR:",
        error
      );

      await ctx.reply(
        "❌ Ruxsat berishda xatolik yuz berdi."
      );
    }
  }
);

// ======================================================
// 🟢 RUXSAT BERISH TUGMASI
// ======================================================

bot.action(
  /^approve_(\d+)$/,
  async (ctx) => {

    // --------------------------------------------------
    // ADMIN TEKSHIRISH
    // --------------------------------------------------

    if (
      ctx.from.id !== ADMIN_ID
    ) {

      await ctx.answerCbQuery(
        "❌ Sizda ruxsat yo‘q.",
        {
          show_alert: true
        }
      );

      return;
    }

    const targetId =
      Number(ctx.match[1]);

    try {

      await ctx.answerCbQuery(
        "⏳ Ruxsat berilmoqda..."
      );

      // --------------------------------------------------
      // USERNI TOPISH
      // --------------------------------------------------

      const userResult =
        await pool.query(
          `
          SELECT
            id,
            telegram_id,
            first_name,
            username

          FROM users

          WHERE telegram_id = $1
          `,
          [targetId]
        );

      if (
        userResult.rows.length === 0
      ) {

        await ctx.editMessageText(
          "❌ Foydalanuvchi topilmadi."
        );

        return;
      }

      const user =
        userResult.rows[0];

      // --------------------------------------------------
      // 1 YILLIK ACCESS
      // --------------------------------------------------

      const accessUntil =
        new Date(
          Date.now() +
          ONE_YEAR_MS
        );

      await pool.query(
        `
        UPDATE users

        SET access_until = $1

        WHERE telegram_id = $2
        `,
        [
          accessUntil,
          targetId
        ]
      );

      // --------------------------------------------------
      // PAYMENT REQUEST
      // --------------------------------------------------

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

      // --------------------------------------------------
      // ADMIN XABARINI YANGILASH
      // --------------------------------------------------

      await ctx.editMessageText(

        "✅ RUXSAT BERILDI\n\n" +

        `👤 Ism: ${
          user.first_name ||
          "Noma'lum"
        }\n` +

        `📱 Username: @${
          user.username ||
          "username yo‘q"
        }\n` +

        `🆔 Telegram ID: ${
          user.telegram_id
        }\n\n` +

        "📅 Kirish muddati:\n" +

        `${accessUntil.toLocaleDateString(
          'uz-UZ'
        )}\n\n` +

        "🔓 1 yillik kursga kirish faollashtirildi."
      );

      // --------------------------------------------------
      // USERGA XABAR
      // --------------------------------------------------

      try {

        await bot.telegram.sendMessage(
          targetId,

          "🎉 To‘lovingiz tasdiqlandi!\n\n" +

          "✅ Kursga kirish huquqi berildi.\n" +

          "📚 Barcha darslarga 1 yil davomida kirishingiz mumkin.\n\n" +

          "Mini App’ni qayta oching va darslarni boshlang."
        );

      } catch (error) {

        console.error(
          "❌ USER NOTIFICATION ERROR:",
          error.message
        );

      }

    } catch (error) {

      console.error(
        "❌ APPROVE BUTTON ERROR:",
        error
      );

      try {

        await ctx.answerCbQuery(
          "❌ Xatolik yuz berdi.",
          {
            show_alert: true
          }
        );

      } catch (e) {
        // callback allaqachon javoblangan bo‘lishi mumkin
      }
    }
  }
);

// ======================================================
// 🔴 RAD ETISH TUGMASI
// ======================================================

bot.action(
  /^reject_(\d+)$/,
  async (ctx) => {

    // --------------------------------------------------
    // ADMIN TEKSHIRISH
    // --------------------------------------------------

    if (
      ctx.from.id !== ADMIN_ID
    ) {

      await ctx.answerCbQuery(
        "❌ Sizda ruxsat yo‘q.",
        {
          show_alert: true
        }
      );

      return;
    }

    const targetId =
      Number(ctx.match[1]);

    try {

      await ctx.answerCbQuery(
        "⏳ So‘rov rad etilmoqda..."
      );

      // --------------------------------------------------
      // USERNI TOPISH
      // --------------------------------------------------

      const userResult =
        await pool.query(
          `
          SELECT
            id,
            telegram_id,
            first_name,
            username

          FROM users

          WHERE telegram_id = $1
          `,
          [targetId]
        );

      if (
        userResult.rows.length === 0
      ) {

        await ctx.editMessageText(
          "❌ Foydalanuvchi topilmadi."
        );

        return;
      }

      const user =
        userResult.rows[0];

      // --------------------------------------------------
      // PAYMENTNI RAD ETISH
      // --------------------------------------------------

      const rejectResult =
        await pool.query(
          `
          UPDATE payment_requests

          SET
            status = 'rejected',
            approved_at = NOW(),
            approved_by = $1

          WHERE user_id = $2
            AND status = 'pending'

          RETURNING id
          `,
          [
            ADMIN_ID,
            user.id
          ]
        );

      // --------------------------------------------------
      // ADMIN XABARI
      // --------------------------------------------------

      await ctx.editMessageText(

        "❌ SO‘ROV RAD ETILDI\n\n" +

        `👤 Ism: ${
          user.first_name ||
          "Noma'lum"
        }\n` +

        `📱 Username: @${
          user.username ||
          "username yo‘q"
        }\n` +

        `🆔 Telegram ID: ${
          user.telegram_id
        }\n\n` +

        (
          rejectResult.rows.length > 0
            ? "Admin tomonidan rad etildi."
            : "⚠️ Ushbu so‘rov allaqachon ko‘rib chiqilgan."
        )
      );

      // --------------------------------------------------
      // USERGA XABAR
      // --------------------------------------------------

      try {

        await bot.telegram.sendMessage(
          targetId,

          "❌ Kursga kirish so‘rovingiz rad etildi.\n\n" +

          "Agar to‘lov qilgan bo‘lsangiz, administrator bilan bog‘laning."
        );

      } catch (error) {

        console.error(
          "❌ REJECT NOTIFICATION ERROR:",
          error.message
        );

      }

    } catch (error) {

      console.error(
        "❌ REJECT BUTTON ERROR:",
        error
      );

      try {

        await ctx.answerCbQuery(
          "❌ Xatolik yuz berdi.",
          {
            show_alert: true
          }
        );

      } catch (e) {
        // ignore
      }
    }
  }
);

// ======================================================
// NOTIFY ADMIN
// server.js DAN CHAQIRILADI
// ======================================================

async function notifyAdmin(
  text,
  telegramId = null
) {

  try {

    // --------------------------------------------------
    // MESSAGE OPTIONS
    // --------------------------------------------------

    const messageOptions = {};

    // --------------------------------------------------
    // APPROVE / REJECT TUGMALARI
    // --------------------------------------------------

    if (telegramId) {

      messageOptions.reply_markup = {

        inline_keyboard: [

          [
            {
              text:
                "🟢 Ruxsat berish",

              callback_data:
                `approve_${telegramId}`
            }
          ],

          [
            {
              text:
                "🔴 Rad etish",

              callback_data:
                `reject_${telegramId}`
            }
          ]

        ]
      };
    }

    // --------------------------------------------------
    // ADMINGA YUBORISH
    // --------------------------------------------------

    await bot.telegram.sendMessage(
      ADMIN_ID,
      text,
      messageOptions
    );

    console.log(
      "✅ Adminga xabar yuborildi"
    );

  } catch (error) {

    console.error(
      "❌ ADMINGA XABAR YUBORILMADI:",
      error.message
    );

    throw error;
  }
}

// ======================================================
// BOT START
// ======================================================

bot.launch()
  .then(() => {

    console.log(
      "================================="
    );

    console.log(
      "🤖 Telegram bot ishga tushdi ✅"
    );

    console.log(
      `👤 Admin ID: ${ADMIN_ID}`
    );

    console.log(
      "================================="
    );

  })
  .catch((error) => {

    console.error(
      "❌ BOT LAUNCH ERROR:"
    );

    console.error(
      error
    );

  });

// ======================================================
// GRACEFUL STOP
// ======================================================

process.once(
  'SIGINT',
  () => {

    console.log(
      "🛑 Bot SIGINT orqali to‘xtatilmoqda..."
    );

    bot.stop('SIGINT');
  }
);

process.once(
  'SIGTERM',
  () => {

    console.log(
      "🛑 Bot SIGTERM orqali to‘xtatilmoqda..."
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
