require('dotenv').config();

const { Telegraf } = require('telegraf');
const { Pool } = require('pg');

// ======================================================
// ENV & CONFIG
// ======================================================

if (!process.env.BOT_TOKEN) {
  console.error('❌ BOT_TOKEN topilmadi! Railway Environment Variables ni tekshiring.');
}

const ADMIN_ID = Number(
  process.env.ADMIN_TELEGRAM_ID || '8043641301'
);

const APP_URL = (process.env.APP_URL || '').trim();

console.log('==========================================');
console.log('🤖 TELEGRAM BOT CONFIG');
console.log('==========================================');
console.log('👤 Admin ID:', ADMIN_ID);
console.log('🌐 APP URL:', APP_URL || '(Kiritilmagan - default rejim)');
console.log('==========================================');

// ======================================================
// BOT INSTANCE
// ======================================================

const bot = new Telegraf(process.env.BOT_TOKEN || '');

// ======================================================
// DATABASE
// ======================================================

let pool = null;
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });
  pool.on('error', function (error) {
    console.error('PostgreSQL pool error:', error.message);
  });
} else {
  console.warn('⚠️ DATABASE_URL topilmadi');
}

// ======================================================
// CONSTANTS & HELPERS
// ======================================================

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

function getFreshAppUrl() {
  if (!APP_URL) return '';
  return APP_URL + (APP_URL.includes('?') ? '&' : '?') + 'v=' + Date.now();
}

// ======================================================
// SET TELEGRAM MENU BUTTON
// ======================================================

async function setupMenuButton() {
  if (!APP_URL) {
    console.warn('⚠️ APP_URL kiritilmagan, Menu tugmasi sozlanmadi.');
    return;
  }
  try {
    await bot.telegram.callApi('setChatMenuButton', {
      menu_button: {
        type: 'web_app',
        text: '🏛 Platformani ochish',
        web_app: { url: APP_URL }
      }
    });
    console.log('✅ Telegram Menu tugmasi muvaffaqiyatli sozlandi.');
  } catch (error) {
    console.warn('⚠️ Menu tugmasini sozlashda ogohlantirish:', error.message);
  }
}

// ======================================================
// /START COMMAND
// ======================================================

bot.start(async function (ctx) {
  try {
    const freshUrl = getFreshAppUrl();
    const replyMarkup = freshUrl ? {
      inline_keyboard: [
        [{ text: '🏛 Platformani ochish', web_app: { url: freshUrl } }]
      ]
    } : undefined;

    await ctx.reply(
      'Assalomu alaykum! INTPRO Academy — Arxitektura, BIM & 3D Dizayn taʼlim va resurslar platformasiga xush kelibsiz 👋\n\n' +
      'Platformada siz quyidagi imkoniyatlarga ega bo‘lasiz:\n' +
      '• Autodesk Revit — Professional BIM va interyer loyihalash\n' +
      '• 3ds Max + Corona — Fotorealistik vizualizatsiya & interyer modellash\n' +
      '• Twinmotion & D5 Render — Tezkor animatsiya & interaktiv render\n' +
      '• Professional Revit shablonlari (RTE) va tayyor 3D modellar bazasi\n\n' +
      'Kurs darslari va resurslarni ko‘rish uchun quyidagi tugmani bosing:',
      {
        reply_markup: replyMarkup
      }
    );
    console.log('✅ /start bosildi: ' + ctx.from.id);
  } catch (error) {
    console.error('❌ /start ERROR:', error.message);
    try {
      await ctx.reply('Assalomu alaykum! Darslarni ko‘rish uchun pastdagi Menu tugmasini bosing.');
    } catch (e) {}
  }
});

// ======================================================
// /APPROVE COMMAND
// ======================================================

bot.command('approve', async function (ctx) {
  try {
    if (ctx.from.id !== ADMIN_ID) {
      return ctx.reply('❌ Sizda bu komandani ishlatish huquqi yo‘q.');
    }

    const parts = ctx.message.text.trim().split(/\s+/);
    if (parts.length < 2) {
      return ctx.reply('❗ Foydalanuvchi Telegram ID sini kiriting.\n\nMisol:\n/approve 123456789');
    }

    const telegramId = Number(parts[1]);
    if (!telegramId || Number.isNaN(telegramId)) {
      return ctx.reply('❌ Telegram ID noto‘g‘ri.');
    }

    if (!pool) return ctx.reply('❌ Maʼlumotlar bazasiga ulanmagan.');

    const userResult = await pool.query(
      'SELECT * FROM users WHERE telegram_id = $1 LIMIT 1',
      [telegramId]
    );

    if (userResult.rows.length === 0) {
      return ctx.reply('❌ Bu Telegram ID bilan foydalanuvchi topilmadi.');
    }

    const user = userResult.rows[0];
    const wasAlreadyActive = user.access_until && new Date(user.access_until) > new Date();
    const accessUntil = new Date(Date.now() + ONE_YEAR_MS);

    await pool.query(
      'UPDATE users SET access_until = $1 WHERE telegram_id = $2',
      [accessUntil, telegramId]
    );

    await pool.query(
      "UPDATE payment_requests SET status = 'approved', approved_at = NOW(), approved_by = $1 WHERE user_id = $2 AND status = 'pending'",
      [ADMIN_ID, user.id]
    );

    await ctx.reply(
      '✅ Ruxsat berildi!\n\n' +
      '👤 ' + (user.first_name || 'Nomaʼlum') + '\n' +
      '🆔 ' + telegramId + '\n\n' +
      '📅 Amal qilish muddati: ' + accessUntil.toLocaleDateString('uz-UZ')
    );

    await sendAccessGrantedMessage(telegramId, accessUntil, wasAlreadyActive);
  } catch (error) {
    console.error('❌ /approve ERROR:', error);
    try { await ctx.reply('❌ Ruxsat berishda xatolik yuz berdi.'); } catch (e) {}
  }
});

// ======================================================
// SEND ACCESS GRANTED MESSAGE
// ======================================================

async function sendAccessGrantedMessage(telegramId, accessUntil, isRenewal) {
  try {
    var dateStr = accessUntil ? accessUntil.toLocaleDateString('uz-UZ') : '';
    var headerLine = isRenewal
      ? '🎉 Tabriklaymiz! Kirish huquqingiz muddati uzaytirildi!'
      : '🎉 Tabriklaymiz! To‘lovingiz tasdiqlandi!';
    var bodyLine = isRenewal
      ? '✅ Kursga kirish muddatingiz muvaffaqiyatli uzaytirildi.\n'
      : '✅ Kursga to‘liq kirish huquqi berildi.\n📚 Endi barcha darslarni ko‘rishingiz mumkin.\n';

    await bot.telegram.sendMessage(
      telegramId,
      headerLine + '\n\n' +
      bodyLine +
      (dateStr ? ('📅 Kirish huquqi muddati: ' + dateStr + ' sanasigacha\n') : '') +
      '\n⚠️ Muhim ogohlantirish: darslik va materiallarni boshqa shaxslarga yuborish, tarqatish yoki sotish qatiyan taqiqlanadi. Bu sizning shaxsiy foydalanishingiz uchun berilgan omonat.\n\n' +
      'Savol bo\'lsa admin bilan bog\'lanishingiz mumkin: @texnikuzb\n\n' +
      'Mini Appni ochish uchun pastdagi «📚 Darslarni ochish» tugmasini bosing.'
    );
    console.log('✅ Userga ruxsat xabari yuborildi: ' + telegramId);
  } catch (error) {
    console.error('Userga xabar yuborilmadi ' + telegramId + ':', error.message);
  }
}

async function sendAccessLimitedMessage(telegramId) {
  try {
    await bot.telegram.sendMessage(
      telegramId,
      '⏸️ Diqqat!\n\n' +
      'Kurslarga kirish huquqingiz administrator tomonidan cheklandi yoki tugatildi.\n\n' +
      'Agar bu xato deb hisoblasangiz yoki muddatni uzaytirmoqchi bo\'lsangiz, administrator bilan bog\'laning: @texnikuzb'
    );
    console.log('⏸️ Userga cheklash xabari yuborildi: ' + telegramId);
  } catch (error) {
    console.error('Userga cheklash xabari yuborilmadi ' + telegramId + ':', error.message);
  }
}

// ======================================================
// APPROVE BUTTON (CALLBACK)
// ======================================================

bot.action(/^approve_(\d+)$/, async function (ctx) {
  try {
    if (ctx.from.id !== ADMIN_ID) {
      await ctx.answerCbQuery('❌ Siz admin emassiz.', { show_alert: true });
      return;
    }

    const telegramId = Number(ctx.match[1]);
    console.log('🟢 APPROVE: ' + telegramId);

    if (!pool) return ctx.answerCbQuery('Baza xatosi');

    const userResult = await pool.query(
      'SELECT * FROM users WHERE telegram_id = $1 LIMIT 1',
      [telegramId]
    );

    if (userResult.rows.length === 0) {
      await ctx.answerCbQuery('❌ Foydalanuvchi topilmadi.', { show_alert: true });
      return;
    }

    const user = userResult.rows[0];
    const wasAlreadyActive = user.access_until && new Date(user.access_until) > new Date();
    const accessUntil = new Date(Date.now() + ONE_YEAR_MS);

    await pool.query(
      'UPDATE users SET access_until = $1 WHERE telegram_id = $2',
      [accessUntil, telegramId]
    );

    await pool.query(
      "UPDATE payment_requests SET status = 'approved', approved_at = NOW(), approved_by = $1 WHERE user_id = $2 AND status = 'pending'",
      [ADMIN_ID, user.id]
    );

    await ctx.answerCbQuery('✅ Ruxsat berildi!');

    try {
      await ctx.editMessageText(
        '🟢 TO‘LOV TASDIQLANDI\n\n' +
        '👤 Ism: ' + (user.first_name || 'Nomaʼlum') + '\n' +
        '📱 Username: @' + (user.username || 'username yo‘q') + '\n' +
        '🆔 Telegram ID: ' + telegramId + '\n\n' +
        '📅 Kirish muddati: ' + accessUntil.toLocaleDateString('uz-UZ') + '\n\n' +
        '✅ Foydalanuvchiga to‘liq kirish huquqi berildi.'
      );
    } catch (error) {
      console.warn('Admin message edit warning:', error.message);
    }

    await sendAccessGrantedMessage(telegramId, accessUntil, wasAlreadyActive);
  } catch (error) {
    console.error('❌ APPROVE ERROR:', error);
    try { await ctx.answerCbQuery('Xatolik yuz berdi.', { show_alert: true }); } catch (e) {}
  }
});

// ======================================================
// REJECT BUTTON (CALLBACK)
// ======================================================

bot.action(/^reject_(\d+)$/, async function (ctx) {
  try {
    if (ctx.from.id !== ADMIN_ID) {
      await ctx.answerCbQuery('❌ Siz admin emassiz.', { show_alert: true });
      return;
    }

    const telegramId = Number(ctx.match[1]);
    console.log('🔴 REJECT: ' + telegramId);

    if (!pool) return ctx.answerCbQuery('Baza xatosi');

    const userResult = await pool.query(
      'SELECT * FROM users WHERE telegram_id = $1 LIMIT 1',
      [telegramId]
    );

    if (userResult.rows.length === 0) {
      await ctx.answerCbQuery('❌ Foydalanuvchi topilmadi.', { show_alert: true });
      return;
    }

    const user = userResult.rows[0];

    await pool.query(
      "UPDATE payment_requests SET status = 'rejected' WHERE user_id = $1 AND status = 'pending'",
      [user.id]
    );

    await ctx.answerCbQuery('🔴 So‘rov rad etildi.');

    try {
      await ctx.editMessageText(
        '🔴 TO‘LOV SO‘ROVI RAD ETILDI\n\n' +
        '👤 Ism: ' + (user.first_name || 'Nomaʼlum') + '\n' +
        '📱 Username: @' + (user.username || 'username yo‘q') + '\n' +
        '🆔 Telegram ID: ' + telegramId + '\n\n' +
        '❌ Ruxsat berilmadi.'
      );
    } catch (error) {
      console.warn('Reject message edit warning:', error.message);
    }

    try {
      await bot.telegram.sendMessage(
        telegramId,
        '❌ Afsuski, to‘lov so‘rovingiz rad etildi.\n\nAgar bu xato deb hisoblasangiz, administrator bilan bog‘laning: @texnikuzb'
      );
    } catch (error) {
      console.warn('Userga rad xabari bormadi:', error.message);
    }
  } catch (error) {
    console.error('❌ REJECT ERROR:', error);
    try { await ctx.answerCbQuery('Xatolik yuz berdi.', { show_alert: true }); } catch (e) {}
  }
});

// ======================================================
// NOTIFY ADMIN
// ======================================================

async function notifyAdmin(text, telegramId = null) {
  try {
    console.log('📤 ADMINGA XABAR YUBORILMOQDA...');
    const messageOptions = {};

    if (telegramId) {
      messageOptions.reply_markup = {
        inline_keyboard: [
          [{ text: '🟢 Ruxsat berish', callback_data: 'approve_' + telegramId }],
          [{ text: '🔴 Rad etish', callback_data: 'reject_' + telegramId }]
        ]
      };
    }

    const result = await bot.telegram.sendMessage(ADMIN_ID, text, messageOptions);
    console.log('✅ ADMINGA XABAR YUBORILDI, Message ID:', result.message_id);
    return result;
  } catch (error) {
    console.error('❌ ADMINGA XABAR YUBORILMADI:', error.message);
    return null;
  }
}

// ======================================================
// BOT ERROR HANDLER & FALLBACK
// ======================================================

bot.use(async function (ctx, next) {
  if (ctx.from) {
    console.log('📨 BOTGA XABAR KELDI:', ctx.updateType, 'from:', ctx.from.id, ctx.from.username || '');
    if (pool) {
      try {
        const banCheck = await pool.query(
          'SELECT is_banned, banned_reason FROM users WHERE telegram_id = $1 LIMIT 1',
          [ctx.from.id]
        );
        if (banCheck.rows[0] && banCheck.rows[0].is_banned) {
          const reason = banCheck.rows[0].banned_reason || 'Qoidabuzarlik';
          await ctx.reply(
            '⛔️ DIQQAT!\n\n' +
            'Sizning hisobingiz platformadan foydalanish qoidalarini buzganlik sababli cheklandi va botdan foydalanish to\'xtatildi.\n\n' +
            'Sabab: ' + reason + '\n\n' +
            'Administrator bilan bog\'lanish: @texnikuzb'
          );
          return;
        }
      } catch (dbErr) {
        console.warn('Bot ban check warning:', dbErr.message);
      }
    }
  }
  return next();
});

bot.catch(function (error, ctx) {
  console.error('❌ BOT ERROR [' + (ctx?.updateType || 'unknown') + ']:', error.message);
});

// Oddiy xabarlarga ham javob berish
bot.on('text', async function (ctx) {
  if (ctx.message.text.startsWith('/')) return; // Komandalar alohida ishlaydi
  try {
    const freshUrl = getFreshAppUrl();
    await ctx.reply(
      'Assalomu alaykum! INTPRO Academy darslari va resurslarini ko‘rish uchun quyidagi tugmani bosing:',
      freshUrl ? {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🏛 Platformani ochish', web_app: { url: freshUrl } }]
          ]
        }
      } : undefined
    );
  } catch (e) {
    console.warn('Fallback reply error:', e.message);
  }
});

// ======================================================
// SAFE LAUNCH BOT
// ======================================================

let botStarted = false;

async function startBot() {
  if (botStarted) return;
  if (!process.env.BOT_TOKEN) {
    console.error('❌ BOT_TOKEN yo‘q! Bot ishga tushirilmadi.');
    return;
  }

  try {
    console.log('🤖 Telegram bot ishga tushirilmoqda...');

    // 1. Agar oldin webhook qolib ketgan bo'lsa, uni o'chiramiz (aks holda polling ishlamaydi!)
    try {
      await bot.telegram.deleteWebhook({ drop_pending_updates: true });
      console.log('🧹 Eski webhook tozalandi.');
    } catch (whErr) {
      console.warn('Webhook tozalashda ogohlantirish:', whErr.message);
    }

    // 2. Menu tugmasini sozlash
    await setupMenuButton();

    // 3. Botni ishga tushirish (dropPendingUpdates: true)
    // Telegraf 4.x da launch() polling to'xtaguncha qaytmaydi, shuning uchun
    // "tayyor" logi onLaunch callback ichida yoziladi.
    await bot.launch({ dropPendingUpdates: true }, function () {
      botStarted = true;
      console.log('==========================================');
      console.log('🤖 TELEGRAM BOT ISHGA TUSHDI VA TAYYOR ✅');
      console.log('==========================================');
    });
  } catch (error) {
    console.error('❌ BOT LAUNCH ERROR:', error.message);
    if (error.message && error.message.includes('409')) {
      console.error('⚠️ 409 CONFLICT: Bot boshqa joyda ham ishlayapti (eski deploy yoki lokal kompyuter).');
    }
    // Server tirik qolib, bot o'lik bo'lib qolmasligi uchun jarayonni yopamiz —
    // Railway uni avtomatik qayta ishga tushiradi.
    console.error('🔁 10 soniyadan keyin jarayon qayta ishga tushiriladi...');
    setTimeout(function () { process.exit(1); }, 10000);
  }
}

// Avtomatik xavfsiz start
startBot();

// Graceful shutdown
process.once('SIGINT', () => { bot.stop('SIGINT'); });
process.once('SIGTERM', () => { bot.stop('SIGTERM'); });

module.exports = { bot, notifyAdmin, startBot, sendAccessGrantedMessage, sendAccessLimitedMessage };
