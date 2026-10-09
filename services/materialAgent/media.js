'use strict';
/**
 * Rasmlar ombori: Telegram yopiq kanal.
 *  - upload: rasm kanalga yuboriladi, file_id `tg_media` jadvaliga yoziladi
 *  - GET /api/media/tg/:id — Mini App rasmni server orqali oladi (bot tokeni brauzerga chiqmaydi)
 * Faqat nashr qilingan materiallarning rasmlari (is_public = true) ochiq beriladi.
 */
var config = require('./config');
var store = require('./store');

function storageChatId() {
  return config.mediaChannelId || String(config.adminId);
}

/**
 * @param {import('telegraf').Telegraf} bot
 * @param {object} img  {buffer, mime, ext, width, height, url}
 * @param {string} caption
 * @returns {Promise<number>} tg_media.id
 */
async function uploadImage(pool, bot, img, caption) {
  var chatId = storageChatId();
  var source = { source: img.buffer, filename: 'material.' + (img.ext || 'jpg') };
  var msg, kind = 'photo', fileId, fileUniqueId, w = img.width, h = img.height, size = img.buffer.length, mime = img.mime;
  try {
    msg = await bot.telegram.sendPhoto(chatId, source, { caption: caption, disable_notification: true });
    var best = msg.photo[msg.photo.length - 1];
    fileId = best.file_id; fileUniqueId = best.file_unique_id; w = best.width; h = best.height; size = best.file_size || size; mime = 'image/jpeg';
  } catch (e) {
    // WebP va boshqa holatlar: hujjat sifatida saqlaymiz (asl format)
    msg = await bot.telegram.sendDocument(chatId, source, { caption: caption, disable_notification: true });
    kind = 'document'; fileId = msg.document.file_id; fileUniqueId = msg.document.file_unique_id;
  }
  return store.insertMedia(pool, {
    file_id: fileId, file_unique_id: fileUniqueId, chat_id: chatId, message_id: msg.message_id, kind: kind,
    mime: mime, width: w, height: h, size_bytes: size, source_url: img.url
  });
}

// ---------- proxy ----------
var bytesCache = new Map();  // media id → {buf, mime}
var bytesCacheTotal = 0;
var BYTES_CACHE_MAX = 40 * 1024 * 1024;

function cachePut(id, buf, mime) {
  if (buf.length > 5 * 1024 * 1024) return;
  if (bytesCache.has(id)) return;
  bytesCache.set(id, { buf: buf, mime: mime });
  bytesCacheTotal += buf.length;
  while (bytesCacheTotal > BYTES_CACHE_MAX && bytesCache.size) {
    var firstKey = bytesCache.keys().next().value;
    bytesCacheTotal -= bytesCache.get(firstKey).buf.length;
    bytesCache.delete(firstKey);
  }
}

async function telegramFileBytes(fileId) {
  var token = config.botToken;
  var r = await fetch('https://api.telegram.org/bot' + token + '/getFile?file_id=' + encodeURIComponent(fileId));
  var j = await r.json();
  if (!j.ok || !j.result || !j.result.file_path) throw new Error('getFile: ' + (j.description || 'no path'));
  var f = await fetch('https://api.telegram.org/file/bot' + token + '/' + j.result.file_path);
  if (!f.ok) throw new Error('file download HTTP ' + f.status);
  return Buffer.from(await f.arrayBuffer());
}

function makeMediaHandler(pool) {
  return async function (req, res) {
    var id = parseInt(req.params.id, 10);
    if (!id || id < 1) return res.status(400).end();
    try {
      var hit = bytesCache.get(id);
      if (!hit) {
        var m = await store.getMedia(pool, id);
        if (!m || !m.is_public) return res.status(404).end();
        var buf = await telegramFileBytes(m.file_id);
        hit = { buf: buf, mime: /^image\/(jpeg|png|webp)$/.test(m.mime || '') ? m.mime : 'image/jpeg' };
        cachePut(id, buf, hit.mime);
      }
      res.setHeader('Content-Type', hit.mime);
      res.setHeader('Content-Length', hit.buf.length);
      res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      return res.end(hit.buf);
    } catch (e) {
      console.warn('MEDIA PROXY ERROR', id, e.message);
      return res.status(502).end();
    }
  };
}

module.exports = { uploadImage: uploadImage, makeMediaHandler: makeMediaHandler, telegramFileBytes: telegramFileBytes, storageChatId: storageChatId, _caches: { bytesCache: bytesCache } };
