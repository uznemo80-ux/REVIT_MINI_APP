'use strict';
/**
 * YOSHUZBEKK — AI Material Agent sozlamalari.
 * Barcha qiymatlar Railway → Variables orqali o'zgartiriladi, kodga tegish shart emas.
 */

function envInt(name, def) {
  var v = parseInt(process.env[name], 10);
  return Number.isFinite(v) ? v : def;
}

function envBool(name, def) {
  var v = String(process.env[name] || '').trim().toLowerCase();
  if (!v) return def;
  return v === '1' || v === 'true' || v === 'yes' || v === 'on';
}

module.exports = {
  // Kalit bo'lmasa agent umuman ishga tushmaydi
  get apiKey() { return (process.env.GEMINI_API_KEY || '').trim(); },
  get enabled() { return envBool('MATERIAL_AGENT_ENABLED', true) && !!this.apiKey && !!this.botToken; },

  // Model: bo'sh qolsa, mavjud modellar ro'yxatidan avtomatik tanlanadi
  get modelOverride() { return (process.env.GEMINI_MODEL || '').trim(); },
  MODEL_PREFERENCE: ['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-2.5-flash'],

  // Jadval: har kuni soat 12:00 (Toshkent), haftasiga 2 ta material
  TIMEZONE: 'Asia/Tashkent',
  TZ_OFFSET_MIN: 5 * 60, // Toshkentda yozgi vaqt yo'q — UTC+5 doimiy
  get runHour() { return envInt('MATERIAL_AGENT_HOUR', 12); },
  get weeklyLimit() { return envInt('MATERIAL_AGENT_WEEKLY_LIMIT', 2); },
  TICK_MS: 10 * 60 * 1000,

  // Bitta ishga tushishda nechta material nomzodini sinab ko'radi (topilmasa)
  MAX_DISCOVERY_ATTEMPTS: 3,
  MAX_REWORKS: 2,

  // Rasmlar
  MIN_IMAGES: 2,
  MAX_IMAGES: 3,
  MIN_IMAGE_SIDE: 400,
  MAX_IMAGE_BYTES: 8 * 1024 * 1024,
  MAX_IMAGE_CANDIDATES: 10,
  MIN_IMAGE_SCORE: 6,

  // Telegram yopiq kanal (rasm ombori). Bo'sh bo'lsa admin chatiga saqlanadi.
  get mediaChannelId() { return (process.env.MATERIAL_MEDIA_CHANNEL_ID || '').trim(); },
  get adminId() { return Number(process.env.ADMIN_TELEGRAM_ID || '8043641301'); },
  get botToken() { return (process.env.BOT_TOKEN || '').trim(); }
};
