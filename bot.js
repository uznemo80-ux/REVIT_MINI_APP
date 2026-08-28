require('dotenv').config();
const { Telegraf } = require('telegraf');
const { Pool } = require('pg');

const bot = new Telegraf(process.env.BOT_TOKEN);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const ADMIN_ID = Number(process.env.ADMIN_TELEGRAM_ID);
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

// --- /start: Mini App'ni ochish tugmasi ---
bot.start((ctx) => {
  ctx.reply(
    "Assalomu alaykum! Revit darslariga xush kelibsiz 👋\n\nDarslarni ko'rish uchun quyidagi tugmani bosing:",
    {
      reply_markup: {
        inline_keyboard: [[
          { text: "📚 Darslarni ochish", web_app: { url: process.env.APP_URL } }
        ]]
      }
    }
  );
});

// --- Faqat admin ishlata oladigan buyruq: /approve <telegram_id> ---
bot.command('approve', async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return; // admin bo'lmasa jim turadi

  const parts = ctx.message.text.split(' ');
  const targetId = Number(parts[1]);
  if (!targetId) return ctx.reply("To'g'ri format: /approve 123456789");

  const accessUntil = new Date(Date.now() + ONE_YEAR_MS);

  await pool.query(
    `UPDATE users SET access_until = $1 WHERE telegram_id = $2`,
    [accessUntil, targetId]
  );
  await pool.query(
    `UPDATE payment_requests SET status = 'approved', approved_at = now(), approved_by = $1
     WHERE user_id = (SELECT id FROM users WHERE telegram_id = $2) AND status = 'pending'`,
    [ADMIN_ID, targetId]
  );

  ctx.reply(`✅ ${targetId} uchun 1 yillik ruxsat berildi (${accessUntil.toDateString()} gacha).`);

  try {
    await bot.telegram.sendMessage(
      targetId,
      "🎉 To'lovingiz tasdiqlandi! Endi barcha darslarga 1 yil davomida kirish huquqingiz bor. Mini App'ni qayta oching."
    );
  } catch (e) { /* foydalanuvchi botni bloklagan bo'lishi mumkin */ }
});

// --- Adminga xabar yuborish (server.js dan chaqiriladi) ---
async function notifyAdmin(text) {
  try {
    await bot.telegram.sendMessage(ADMIN_ID, text);
  } catch (e) {
    console.error("Adminga xabar yuborilmadi:", e.message);
  }
}

bot.launch();
console.log("Bot ishga tushdi ✅");

module.exports = { bot, notifyAdmin };
