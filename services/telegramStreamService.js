const { Readable } = require('stream');

/**
 * Yoshuzbekk Academy - Telegram Video Streaming Service
 * Resolves Telegram file IDs and proxies video streams with HTTP Range (206) support.
 */

/**
 * Extract file object from Telegram message
 */
function extractMediaFile(msg) {
  if (!msg) return null;
  if (msg.video) return { file_id: msg.video.file_id, size: msg.video.file_size, mime: msg.video.mime_type || 'video/mp4' };
  if (msg.document && (!msg.document.mime_type || msg.document.mime_type.startsWith('video/'))) {
    return { file_id: msg.document.file_id, size: msg.document.file_size, mime: msg.document.mime_type || 'video/mp4' };
  }
  if (msg.animation) return { file_id: msg.animation.file_id, size: msg.animation.file_size, mime: 'video/mp4' };
  return null;
}

/**
 * Resolves and caches the Telegram file_id for a lesson.
 */
async function resolveTelegramFileId(pool, tgApi, adminChatId, lesson) {
  if (lesson.telegram_file_id && String(lesson.telegram_file_id).trim()) {
    return lesson.telegram_file_id.trim();
  }

  if (!lesson.telegram_chat_id || !lesson.telegram_message_id) {
    return null;
  }

  const chatId = String(lesson.telegram_chat_id).trim();
  const messageId = parseInt(lesson.telegram_message_id, 10);

  // 0. Check if file_id is already in tg_file_index
  try {
    const idxRes = await pool.query(
      'SELECT file_id FROM tg_file_index WHERE chat_id = $1 AND message_id = $2 AND file_id IS NOT NULL LIMIT 1',
      [chatId, messageId]
    );
    if (idxRes.rows.length && idxRes.rows[0].file_id) {
      const fId = idxRes.rows[0].file_id;
      pool.query('UPDATE lessons SET telegram_file_id = $1 WHERE id = $2', [fId, lesson.id]).catch(() => {});
      return fId;
    }
  } catch (idxErr) {}

  try {
    // 1. Forward the message to the admin chat to get the message metadata
    const r = await tgApi('forwardMessage', {
      chat_id: adminChatId,
      from_chat_id: chatId,
      message_id: messageId
    });

    if (r && r.ok && r.result) {
      const forwardedMsg = r.result;
      const media = extractMediaFile(forwardedMsg);

      // Clean up the forwarded message in admin chat immediately
      try {
        await tgApi('deleteMessage', {
          chat_id: adminChatId,
          message_id: forwardedMsg.message_id
        });
      } catch (delErr) {
        // Non-critical cleanup error
      }

      if (media && media.file_id) {
        // Cache the file_id in the database to avoid forwarding next time
        try {
          await pool.query(
            'UPDATE lessons SET telegram_file_id = $1 WHERE id = $2',
            [media.file_id, lesson.id]
          );
        } catch (dbErr) {
          console.error('[TG_STREAM] DB update file_id error:', dbErr.message);
        }

        return media.file_id;
      }
    } else {
      console.warn('[TG_STREAM] forwardMessage failed:', r ? r.description : 'no response');
    }
  } catch (err) {
    console.error('[TG_STREAM] resolveTelegramFileId error:', err.message);
  }

  return null;
}

/**
 * Retrieves the direct download/stream URL for a file_id from Telegram Bot API.
 */
async function getTelegramFileStreamUrl(tgApi, fileId) {
  if (!fileId) return null;

  const res = await tgApi('getFile', { file_id: fileId });
  if (!res || !res.ok || !res.result || !res.result.file_path) {
    console.warn('[TG_STREAM] getFile error:', res ? res.description : 'no result');
    return null;
  }

  const token = process.env.BOT_TOKEN;
  if (!token) return null;

  const root = process.env.BOT_API_ROOT || 'https://api.telegram.org';
  return `${root}/file/bot${token}/${res.result.file_path}`;
}

/**
 * Stream video to client with HTTP 206 Partial Content (Range) support.
 */
async function proxyStreamRange(req, res, targetUrl) {
  const rangeHeader = req.headers.range;
  const upstreamHeaders = {};

  if (rangeHeader) {
    upstreamHeaders['Range'] = rangeHeader;
  }

  const abortController = new AbortController();
  req.on('close', () => {
    abortController.abort();
  });

  try {
    const upstreamRes = await fetch(targetUrl, {
      method: 'GET',
      headers: upstreamHeaders,
      signal: abortController.signal
    });

    if (!upstreamRes.ok && upstreamRes.status !== 206) {
      console.warn('[TG_STREAM] Upstream error status:', upstreamRes.status);
      return res.status(upstreamRes.status).send('Video oqimini yuklashda xatolik yuz berdi');
    }

    const contentType = upstreamRes.headers.get('content-type') || 'video/mp4';
    const contentLength = upstreamRes.headers.get('content-length');
    const contentRange = upstreamRes.headers.get('content-range');
    const acceptRanges = upstreamRes.headers.get('accept-ranges') || 'bytes';

    const responseHeaders = {
      'Content-Type': contentType,
      'Accept-Ranges': acceptRanges,
      'Cache-Control': 'private, no-cache, no-store, must-revalidate'
    };

    if (contentLength) responseHeaders['Content-Length'] = contentLength;
    if (contentRange) responseHeaders['Content-Range'] = contentRange;

    res.writeHead(upstreamRes.status, responseHeaders);

    if (upstreamRes.body) {
      const nodeStream = Readable.fromWeb(upstreamRes.body);
      nodeStream.pipe(res);
      nodeStream.on('error', (err) => {
        if (!res.headersSent) {
          res.status(500).end();
        }
      });
    } else {
      res.end();
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      // Client closed connection, normal for video player scrubbing
      return;
    }
    console.error('[TG_STREAM] Proxy streaming error:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Video oqimida xatolik' });
    }
  }
}

module.exports = {
  resolveTelegramFileId,
  getTelegramFileStreamUrl,
  proxyStreamRange
};
