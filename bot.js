```javascript
require('dotenv').config();

const { Telegraf } = require('telegraf');
const { Pool } = require('pg');

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

// ======================================================
// ADMIN
// ======================================================

const ADMIN_ID =
  Number(process.env.ADMIN_TELEGRAM_ID);

// 1 yil
const ONE_YEAR_MS =
  365 * 24 * 60 * 60 * 1000;

// ======================================================
// /START
// ======================================================

bot.start(async (ctx) => {

  try {

    const freshUrl =
      `${process.env.APP_URL}?v=${Date.now()}`;

    await ctx.reply(

      "Assalomu alaykum! Revit darslariga xush kelibsiz 👋\n\n" +

      "Darslarni ko'rish uchun quyidagi tugmani bosing:",

      {
        reply_markup: {

          inline_keyboard: [

            [
              {
                text:
                  "📚 Darslarni ochish",

                web_app: {
                  url:
                    freshUrl
                }
              }
            ]

          ]
        }
      }
    );

  } catch (error) {

    console.error(
      "START ERROR:",
      error
    );

  }

});

// ======================================================
// /APPROVE
// Qo'lda ruxsat berish
// /approve 123456789
// ======================================================

bot.command(
  'approve',
  async (ctx) => {

    if (
      ctx.from.id !==
      ADMIN_ID
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

        return ctx.reply(
          "To'g'ri format:\n/approve 123456789"
        );

      }

      const accessUntil =
        new Date(
          Date.now() +
          ONE_YEAR_MS
        );

      // --------------------------------------------------
      // USER ACCESS
      // --------------------------------------------------

      const userResult =
        await pool.query(

          `UPDATE users
           SET access_until = $1
           WHERE telegram_id = $2
           RETURNING id,
                     telegram_id,
                     first_name,
                     username`,

          [
            accessUntil,
            targetId
          ]

        );

      if (
        userResult.rows.length === 0
      ) {

        return ctx.reply(

          `❌ ${targetId} Telegram ID bo'yicha foydalanuvchi topilmadi.`

        );

      }

      const user =
        userResult.rows[0];

      // --------------------------------------------------
      // PAYMENT REQUEST
      // --------------------------------------------------

      await pool.query(

        `UPDATE payment_requests
         SET status = 'approved',
             approved_at = now(),
             approved_by = $1
         WHERE user_id = $2
           AND status = 'pending'`,

        [
          ADMIN_ID,
          user.id
        ]

      );

      // --------------------------------------------------
      // ADMIN
      // --------------------------------------------------

      await ctx.reply(

        `✅ RUXSAT BERILDI\n\n` +

        `👤 Ism: ${
          user.first_name ||
          "Noma'lum"
        }\n` +

        `🆔 Telegram ID: ${
          user.telegram_id
        }\n\n` +

        `📅 Kirish muddati:\n` +

        `${accessUntil.toLocaleDateString(
          'uz-UZ'
        )}\n\n` +

        `🔓 1 yillik kursga kirish faollashtirildi.`

      );

      // --------------------------------------------------
      // USER NOTIFICATION
      // --------------------------------------------------

      try {

        await bot.telegram.sendMessage(

          targetId,

          "🎉 To'lovingiz tasdiqlandi!\n\n" +

          "✅ Kursga kirish huquqi berildi.\n" +

          "📚 Barcha darslarga 1 yil davomida kirishingiz mumkin.\n\n" +

          "Mini App'ni qayta oching va darslarni boshlang."

        );

      } catch (error) {

        console.error(

          "User notification error:",

          error.message

        );

      }

    } catch (error) {

      console.error(
        "APPROVE COMMAND ERROR:",
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
      ctx.from.id !==
      ADMIN_ID
    ) {

      await ctx.answerCbQuery(

        "❌ Sizda ruxsat yo'q.",

        {
          show_alert:
            true
        }

      );

      return;
    }

    const targetId =
      Number(
        ctx.match[1]
      );

    try {

      await ctx.answerCbQuery(
        "⏳ Ruxsat berilmoqda..."
      );

      // --------------------------------------------------
      // USER
      // --------------------------------------------------

      const userResult =
        await pool.query(

          `SELECT
             id,
             telegram_id,
             first_name,
             username
           FROM users
           WHERE telegram_id = $1`,

          [
            targetId
          ]

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
      // ACCESS 1 YEAR
      // --------------------------------------------------

      const accessUntil =
        new Date(
          Date.now() +
          ONE_YEAR_MS
        );

      await pool.query(

        `UPDATE users
         SET access_until = $1
         WHERE telegram_id = $2`,

        [
          accessUntil,
          targetId
        ]

      );

      // --------------------------------------------------
      // PAYMENT STATUS
      // --------------------------------------------------

      await pool.query(

        `UPDATE payment_requests
         SET status = 'approved',
             approved_at = now(),
             approved_by = $1
         WHERE user_id = $2
           AND status = 'pending'`,

        [
          ADMIN_ID,
          user.id
        ]

      );

      // --------------------------------------------------
      // ADMIN XABARINI YANGILASH
      // --------------------------------------------------

      await ctx.editMessageText(

        `✅ RUXSAT BERILDI\n\n` +

        `👤 Ism: ${
          user.first_name ||
          "Noma'lum"
        }\n` +

        `📱 Username: @${
          user.username ||
          "username yo'q"
        }\n` +

        `🆔 Telegram ID: ${
          user.telegram_id
        }\n\n` +

        `📅 Kirish muddati:\n` +

        `${accessUntil.toLocaleDateString(
          'uz-UZ'
        )}\n\n` +

        `🔓 1 yillik kursga kirish faollashtirildi.`

      );

      // --------------------------------------------------
      // USERGA XABAR
      // --------------------------------------------------

      try {

        await bot.telegram.sendMessage(

          targetId,

          "🎉 To'lovingiz tasdiqlandi!\n\n" +

          "✅ Kursga kirish huquqi berildi.\n" +

          "📚 Barcha darslarga 1 yil davomida kirishingiz mumkin.\n\n" +

          "Mini App'ni qayta oching va darslarni boshlang."

        );

      } catch (error) {

        console.error(

          "User notification error:",

          error.message

        );

      }

    } catch (error) {

      console.error(

        "APPROVE BUTTON ERROR:",

        error

      );

      try {

        await ctx.answerCbQuery(

          "❌ Xatolik yuz berdi.",

          {
            show_alert:
              true
          }

        );

      } catch (e) {}

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
      ctx.from.id !==
      ADMIN_ID
    ) {

      await ctx.answerCbQuery(

        "❌ Sizda ruxsat yo'q.",

        {
          show_alert:
            true
        }

      );

      return;
    }

    const targetId =
      Number(
        ctx.match[1]
      );

    try {

      await ctx.answerCbQuery(
        "⏳ So'rov rad etilmoqda..."
      );

      // --------------------------------------------------
      // USER
      // --------------------------------------------------

      const userResult =
        await pool.query(

          `SELECT
             id,
             telegram_id,
             first_name,
             username
           FROM users
           WHERE telegram_id = $1`,

          [
            targetId
          ]

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
      // REJECT PAYMENT
      // --------------------------------------------------

      await pool.query(

        `UPDATE payment_requests
         SET status = 'rejected',
             approved_at = now(),
             approved_by = $1
         WHERE user_id = $2
           AND status = 'pending'`,

        [
          ADMIN_ID,
          user.id
        ]

      );

      // --------------------------------------------------
      // ADMIN
      // --------------------------------------------------

      await ctx.editMessageText(

        `❌ SO'ROV RAD ETILDI\n\n` +

        `👤 Ism: ${
          user.first_name ||
          "Noma'lum"
        }\n` +

        `📱 Username: @${
          user.username ||
          "username yo'q"
        }\n` +

        `🆔 Telegram ID: ${
          user.telegram_id
        }\n\n` +

        `Admin tomonidan rad etildi.`

      );

      // --------------------------------------------------
      // USER
      // --------------------------------------------------

      try {

        await bot.telegram.sendMessage(

          targetId,

          "❌ Kursga kirish so'rovingiz rad etildi.\n\n" +

          "Agar to'lov qilgan bo'lsangiz, administrator bilan bog'laning."

        );

      } catch (error) {

        console.error(

          "Reject notification error:",

          error.message

        );

      }

    } catch (error) {

      console.error(

        "REJECT BUTTON ERROR:",

        error

      );

      try {

        await ctx.answerCbQuery(

          "❌ Xatolik yuz berdi.",

          {
            show_alert:
              true
          }

        );

      } catch (e) {}

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

    let replyMarkup;

    // --------------------------------------------------
    // TUGMALAR
    // --------------------------------------------------

    if (
      telegramId
    ) {

      replyMarkup = {

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
    // ADMIN XABARI
    // --------------------------------------------------

    await bot.telegram.sendMessage(

      ADMIN_ID,

      text,

      {
        reply_markup:
          replyMarkup
      }

    );

  } catch (error) {

    console.error(

      "Adminga xabar yuborilmadi:",

      error.message

    );

    throw error;

  }

}

// ======================================================
// BOTNI ISHGA TUSHIRISH
// ======================================================

bot.launch()

  .then(() => {

    console.log(
      "Telegram bot ishga tushdi ✅"
    );

  })

  .catch((error) => {

    console.error(
      "BOT LAUNCH ERROR:",
      error
    );

  });

// ======================================================
// STOP
// ======================================================

process.once(
  'SIGINT',
  () => bot.stop('SIGINT')
);

process.once(
  'SIGTERM',
  () => bot.stop('SIGTERM')
);

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  bot,
  notifyAdmin
};
```
