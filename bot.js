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
// TELEGRAM FAYL INDEKSI (kanal/guruh postlaridagi fayl hajmini eslab qolish)
// ======================================================
if (pool) {
  pool.query(`CREATE TABLE IF NOT EXISTS tg_file_index (
    chat_id TEXT NOT NULL,
    message_id BIGINT NOT NULL,
    chat_username TEXT,
    file_name TEXT,
    file_size BIGINT,
    file_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (chat_id, message_id)
  )`).then(function () {
    return pool.query('ALTER TABLE tg_file_index ADD COLUMN IF NOT EXISTS file_id TEXT');
  }).catch(function (e) { console.warn('tg_file_index:', e.message); });
}

bot.on(['channel_post', 'edited_channel_post', 'message'], async function (ctx, next) {
  try {
    var msg = ctx.channelPost || ctx.editedChannelPost || ctx.message;
    if (pool && msg && msg.chat && msg.chat.type !== 'private') {
      var f = msg.document || msg.video || msg.audio || msg.animation ||
        (msg.photo && msg.photo.length ? msg.photo[msg.photo.length - 1] : null);
      if (f && (f.file_size || f.file_id)) {
        await pool.query(
          `INSERT INTO tg_file_index (chat_id, message_id, chat_username, file_name, file_size, file_id)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (chat_id, message_id) DO UPDATE SET file_name = EXCLUDED.file_name, file_size = EXCLUDED.file_size, file_id = COALESCE(EXCLUDED.file_id, tg_file_index.file_id)`,
          [String(msg.chat.id), msg.message_id, msg.chat.username ? msg.chat.username.toLowerCase() : null, f.file_name || f.title || null, f.file_size || 0, f.file_id || null]
        );
      }
    }
  } catch (e) { console.warn('tg index:', e.message); }
  return next();
});

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
        text: '📚 Darslarni ochish',
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
        [{ text: '📚 Darslarni ochish', web_app: { url: freshUrl } }]
      ]
    } : undefined;

    await ctx.reply(
      'Assalomu alaykum! YOSHUZBEKK Academy — Revit darslariga xush kelibsiz 👋\n\n' +
      'Kurs darslarini ko‘rish uchun quyidagi tugmani bosing:',
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

// Admin shaxsiy chatda botga video yuborsa, uning File ID sini beradi
bot.on(['message:video', 'message:document'], async function (ctx, next) {
  try {
    var senderId = String(ctx.from && ctx.from.id);
    var isAdminUser = (senderId === String(ADMIN_ID));
    if (isAdminUser && ctx.chat && ctx.chat.type === 'private') {
      var v = ctx.message.video || ctx.message.document;
      if (v && v.file_id) {
        var mb = v.file_size ? (v.file_size / (1024 * 1024)).toFixed(1) + ' MB' : '';
        return ctx.reply(
          `🎬 <b>Video File ID olindi! (${mb})</b>\n\n` +
          `Ushbu ID ni Mini App'da dars tahrirlash oynasidagi <b>Telegram Video</b> maydoniga qo'yishingiz mumkin:\n\n` +
          `<code>${v.file_id}</code>\n\n` +
          `<i>(Nusxalash uchun kod ustiga bir marta bosing)</i>`,
          { parse_mode: 'HTML' }
        );
      }
    }
  } catch (err) {
    console.error('ADMIN VIDEO DM ERROR:', err);
  }
  return next();
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
// BOT RESTRICTION MIDDLEWARE & FALLBACK
// ======================================================

bot.use(async function (ctx, next) {
  if (ctx.from) {
    const telegramId = Number(ctx.from.id);
    console.log('📨 BOTGA XABAR KELDI:', ctx.updateType, 'from:', telegramId, ctx.from.username || '');

    // Bosh admin hech qachon bloklanmaydi
    if (telegramId === ADMIN_ID) {
      return next();
    }

    if (pool) {
      try {
        const banRes = await pool.query(`
          SELECT r.* FROM user_restrictions r
          JOIN users u ON u.id = r.user_id
          WHERE u.telegram_id = $1 AND r.is_active = true
          ORDER BY r.id DESC LIMIT 1
        `, [telegramId]);

        if (banRes.rows.length > 0) {
          const r = banRes.rows[0];

          // Muddati tugaganligini tekshiramiz
          if (!r.is_permanent && r.expires_at) {
            if (new Date(r.expires_at) <= new Date()) {
              // Avtomatik muddat tugashi: is_active = false qilamiz
              await pool.query('UPDATE user_restrictions SET is_active = false WHERE id = $1', [r.id]);
              return next();
            }
          }

          // Foydalanuvchi hozirda bloklangan!
          const expText = r.is_permanent
            ? 'Doimiy'
            : new Date(r.expires_at).toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent', hour12: false });

          const restrictionMsg =
            '⚠️ <b>Sizning platformadan foydalanishingiz cheklangan.</b>\n\n' +
            '📋 <b>Sabab:</b>\n' + (r.reason || 'Qoidabuzarlik') +
            (r.admin_note ? '\n<i>Izoh: ' + r.admin_note + '</i>' : '') + '\n\n' +
            '⏳ <b>Taqiq muddati:</b> ' + expText + '\n\n' +
            'Agar xato deb hisoblasangiz, administrator bilan bog‘laning.';

          if (ctx.callbackQuery) {
            try {
              await ctx.answerCbQuery('Platformadan foydalanishingiz cheklangan', { show_alert: true });
            } catch (e) {}
          }
          await ctx.reply(restrictionMsg, { parse_mode: 'HTML' });
          return; // Keyingi bot komandalari va xabarlar ishlamaydi
        }
      } catch (err) {
        console.error('BOT RESTRICTION CHECK ERROR:', err.message);
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
      'Assalomu alaykum! Kurs darslarini ko‘rish uchun quyidagi tugmani bosing:',
      freshUrl ? {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📚 Darslarni ochish', web_app: { url: freshUrl } }]
          ]
        }
      } : undefined
    );
  } catch (e) {
    console.warn('Fallback reply error:', e.message);
  }
});

// ======================================================
// BAN & UNBAN NOTIFICATIONS
// ======================================================

async function sendBanNotification(telegramId, restriction) {
  if (!telegramId) return;
  try {
    const isPermanent = Boolean(restriction.is_permanent);
    const expText = isPermanent
      ? 'Doimiy'
      : new Date(restriction.expires_at).toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent', hour12: false });

    const msg =
      '🔒 <b>Platformadan foydalanish cheklangan</b>\n\n' +
      (isPermanent
        ? 'Sizning akkauntingizdan foydalanish muddatsiz (doimiy) cheklandi.\n\n'
        : 'Sizning akkauntingiz vaqtincha bloklandi.\n\n') +
      '📋 <b>Sabab:</b> ' + (restriction.reason || 'Platforma qoidalarini buzish') + '\n' +
      (restriction.admin_note ? '<i>Izoh: ' + restriction.admin_note + '</i>\n' : '') +
      '⏳ <b>' + (isPermanent ? 'Blok muddati:' : 'Blok tugaydi:') + '</b> ' + expText + '\n\n' +
      'Agar xato deb hisoblasangiz, administrator bilan bog‘lanishingiz mumkin.';

    await bot.telegram.sendMessage(telegramId, msg, { parse_mode: 'HTML' });
    console.log('✅ BAN NOTIFICATION SENT to:', telegramId);
  } catch (err) {
    console.warn('⚠️ Ban notification yuborishda xato:', err.message);
  }
}

async function sendUnbanNotification(telegramId) {
  if (!telegramId) return;
  try {
    const freshUrl = getFreshAppUrl();
    const replyMarkup = freshUrl ? {
      inline_keyboard: [
        [{ text: '📚 Darslarni ochish', web_app: { url: freshUrl } }]
      ]
    } : undefined;

    const msg =
      '✅ <b>Platformadan foydalanish qayta tiklandi</b>\n\n' +
      'Sizning akkauntingizdan foydalanishga qo‘yilgan cheklov bekor qilindi. Endi Mini App va botdan erkin foydalanishingiz mumkin.';

    await bot.telegram.sendMessage(telegramId, msg, {
      parse_mode: 'HTML',
      reply_markup: replyMarkup
    });
    console.log('✅ UNBAN NOTIFICATION SENT to:', telegramId);
  } catch (err) {
    console.warn('⚠️ Unban notification yuborishda xato:', err.message);
  }
}

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
    await bot.launch({
      dropPendingUpdates: true
    });

    botStarted = true;
    console.log('==========================================');
    console.log('🤖 TELEGRAM BOT ISHGA TUSHDI VA TAYYOR ✅');
    console.log('==========================================');
  } catch (error) {
    console.error('❌ BOT LAUNCH ERROR:', error.message);
    if (error.message && error.message.includes('409')) {
      console.error('⚠️ 409 CONFLICT: Bot boshqa jarayonda ishlab turibdi. Railway qayta ishga tushganda o‘zi to‘g‘rilanadi.');
    }
  }
}

// Avtomatik xavfsiz start
startBot();

// Graceful shutdown
process.once('SIGINT', () => { bot.stop('SIGINT'); });
process.once('SIGTERM', () => { bot.stop('SIGTERM'); });

module.exports = {
  bot,
  notifyAdmin,
  startBot,
  sendAccessGrantedMessage,
  sendAccessLimitedMessage,
  sendBanNotification,
  sendUnbanNotification
};
