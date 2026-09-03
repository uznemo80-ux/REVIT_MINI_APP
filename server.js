require('dotenv').config();

const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const { verifyInitData } = require('./verifyTelegram');
const { notifyAdmin } = require('./bot');

const app = express();

// ======================================================
// CONFIG
// ======================================================

const PORT = process.env.PORT || 3000;

const ADMIN_TELEGRAM_ID =
  process.env.ADMIN_TELEGRAM_ID || '8043641301';

console.log(
  `ADMIN TELEGRAM ID: ${ADMIN_TELEGRAM_ID}`
);

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());

app.use(
  express.json({
    limit: '10mb'
  })
);

app.use(
  express.static('public', {
    etag: false,
    lastModified: false,

    setHeaders: (res) => {
      res.set(
        'Cache-Control',
        'no-store, no-cache, must-revalidate'
      );
    }
  })
);

// ======================================================
// DATABASE
// ======================================================

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', (error) => {
  console.error(
    'DATABASE POOL ERROR:',
    error
  );
});

// ======================================================
// BUNNY STREAM
// ======================================================

function generateBunnyToken(
  videoId,
  expiresAt
) {
  const securityKey =
    process.env.BUNNY_TOKEN_AUTH_KEY;

  if (!securityKey) {
    throw new Error(
      'BUNNY_TOKEN_AUTH_KEY topilmadi'
    );
  }

  const hashableString =
    securityKey +
    videoId +
    expiresAt;

  return crypto
    .createHash('sha256')
    .update(hashableString)
    .digest('hex');
}


function generateBunnyPlayerUrl(
  libraryId,
  videoId
) {
  const expiresAt =
    Math.floor(Date.now() / 1000) +
    2 * 60 * 60;

  const token =
    generateBunnyToken(
      videoId,
      expiresAt
    );

  return (
    `https://iframe.mediadelivery.net/embed/` +
    `${libraryId}/${videoId}` +
    `?token=${token}&expires=${expiresAt}`
  );
}

// ======================================================
// YOUTUBE
// ======================================================

function getYouTubeVideoId(url) {

  if (!url) {
    return null;
  }

  try {

    const parsedUrl =
      new URL(url);

    const hostname =
      parsedUrl.hostname.toLowerCase();

    // ----------------------------------------------
    // youtu.be
    // ----------------------------------------------

    if (
      hostname === 'youtu.be'
    ) {

      return (
        parsedUrl.pathname
          .replace(/^\/+/, '')
          .split('/')[0]
          .trim() || null
      );

    }

    // ----------------------------------------------
    // youtube.com
    // ----------------------------------------------

    if (
      hostname === 'youtube.com' ||
      hostname === 'www.youtube.com' ||
      hostname === 'm.youtube.com'
    ) {

      // youtube.com/watch?v=XXXXX

      const videoId =
        parsedUrl.searchParams.get('v');

      if (videoId) {
        return videoId;
      }

      // youtube.com/embed/XXXXX

      const embedMatch =
        parsedUrl.pathname.match(
          /^\/embed\/([^/]+)/
        );

      if (embedMatch) {
        return embedMatch[1];
      }

      // youtube.com/shorts/XXXXX

      const shortsMatch =
        parsedUrl.pathname.match(
          /^\/shorts\/([^/]+)/
        );

      if (shortsMatch) {
        return shortsMatch[1];
      }

    }

    return null;

  } catch (error) {

    console.error(
      'YOUTUBE URL ERROR:',
      error.message
    );

    return null;
  }
}


function generateYouTubePlayerUrl(
  youtubeUrl
) {

  const videoId =
    getYouTubeVideoId(
      youtubeUrl
    );

  if (!videoId) {
    return null;
  }

  return (
    `https://www.youtube.com/embed/` +
    `${videoId}` +
    `?rel=0&modestbranding=1`
  );
}

// ======================================================
// ACCESS
// ======================================================

function hasAccess(user) {

  if (!user) {
    return false;
  }

  if (!user.access_until) {
    return false;
  }

  return (
    new Date(user.access_until) >
    new Date()
  );
}

// ======================================================
// GET / CREATE TELEGRAM USER
// ======================================================

async function getOrCreateUser(
  initData
) {

  if (!initData) {

    console.error(
      'GET USER ERROR: initData mavjud emas'
    );

    return null;
  }

  const tgUser =
    verifyInitData(
      initData,
      process.env.BOT_TOKEN
    );

  if (!tgUser) {

    console.error(
      'GET USER ERROR: Telegram initData noto‘g‘ri'
    );

    return null;
  }

  const result =
    await pool.query(
      `
      INSERT INTO users
      (
        telegram_id,
        first_name,
        username
      )

      VALUES
      (
        $1,
        $2,
        $3
      )

      ON CONFLICT
      (
        telegram_id
      )

      DO UPDATE SET
        first_name = $2,
        username = $3

      RETURNING *
      `,
      [
        tgUser.id,
        tgUser.first_name || '',
        tgUser.username || null
      ]
    );

  return result.rows[0];
}

// ======================================================
// AUTH
// ======================================================

app.post(
  '/api/auth',
  async (req, res) => {

    try {

      const user =
        await getOrCreateUser(
          req.body.initData
        );

      if (!user) {

        return res
          .status(401)
          .json({
            error:
              'Telegram foydalanuvchisi tekshirilmadi'
          });

      }

      return res.json({

        telegram_id:
          user.telegram_id.toString(),

        first_name:
          user.first_name || '',

        has_access:
          hasAccess(user),

        access_until:
          user.access_until || null

      });

    } catch (error) {

      console.error(
        'AUTH ERROR:',
        error
      );

      return res
        .status(500)
        .json({
          error:
            'Server xatosi'
        });
    }
  }
);

// ======================================================
// CONTENT
// ======================================================

app.post(
  '/api/content',
  async (req, res) => {

    try {

      // ==================================================
      // USER
      // ==================================================

      const user =
        await getOrCreateUser(
          req.body.initData
        );

      if (!user) {

        return res
          .status(401)
          .json({
            error:
              'Telegram foydalanuvchisi tekshirilmadi'
          });
      }

      // ==================================================
      // ACCESS
      // ==================================================

      const userHasAccess =
        hasAccess(user);

      // ==================================================
      // MODULES
      // ==================================================

      const modulesResult =
        await pool.query(
          `
          SELECT
            id,
            title,
            order_index

          FROM modules

          ORDER BY
            order_index ASC,
            id ASC
          `
        );

      const modules =
        modulesResult.rows;

      // ==================================================
      // LESSONS
      // ==================================================

      const lessonsResult =
        await pool.query(
          `
          SELECT
            id,
            module_id,
            title,
            order_index,
            youtube_url,
            task_text,
            is_free

          FROM lessons

          ORDER BY
            module_id ASC,
            order_index ASC,
            id ASC
          `
        );

      const lessons =
        lessonsResult.rows;

      // ==================================================
      // FIRST MODULE
      // ==================================================

      const firstModuleId =
        modules.length
          ? modules[0].id
          : null;

      // ==================================================
      // BUILD MODULE DATA
      // ==================================================

      const data =
        modules.map(
          (module) => {

            const isFirstModule =
              module.id ===
              firstModuleId;

            const moduleUnlocked =
              isFirstModule ||
              userHasAccess;

            return {

              id:
                module.id,

              title:
                module.title,

              order_index:
                module.order_index,

              unlocked:
                moduleUnlocked,

              lessons:
                lessons
                  .filter(
                    lesson =>
                      lesson.module_id ===
                      module.id
                  )
                  .map(
                    lesson => {

                      const available =
                        Boolean(
                          lesson.is_free
                        ) ||
                        moduleUnlocked;

                      return {

                        id:
                          lesson.id,

                        title:
                          lesson.title,

                        is_free:
                          Boolean(
                            lesson.is_free
                          ),

                        task_text:
                          lesson.task_text,

                        available:
                          available

                      };

                    }
                  )

            };

          }
        );

      // ==================================================
      // RESPONSE
      // ==================================================

      return res.json({

        has_access:
          userHasAccess,

        access_until:
          user.access_until || null,

        telegram_id:
          user.telegram_id.toString(),

        first_name:
          user.first_name || '',

        modules:
          data

      });

    } catch (error) {

      console.error(
        'CONTENT ERROR:',
        error
      );

      return res
        .status(500)
        .json({
          error:
            'Server xatosi'
        });
    }
  }
);

// ======================================================
// LESSON
// ======================================================

app.post(
  '/api/lesson/:id',
  async (req, res) => {

    try {

      // ==================================================
      // USER
      // ==================================================

      const user =
        await getOrCreateUser(
          req.body.initData
        );

      if (!user) {

        return res
          .status(401)
          .json({
            error:
              'Telegram foydalanuvchisi tekshirilmadi'
          });
      }

      // ==================================================
      // LESSON
      // ==================================================

      const lessonResult =
        await pool.query(
          `
          SELECT
            id,
            module_id,
            title,
            order_index,
            youtube_url,
            task_text,
            is_free,
            bunny_video_id,
            warning_text

          FROM lessons

          WHERE id = $1

          LIMIT 1
          `,
          [req.params.id]
        );

      const lesson =
        lessonResult.rows[0];

      if (!lesson) {

        return res
          .status(404)
          .json({
            error:
              'Dars topilmadi'
          });
      }

      // ==================================================
      // MODULE
      // ==================================================

      const moduleResult =
        await pool.query(
          `
          SELECT
            id,
            title,
            order_index

          FROM modules

          WHERE id = $1

          LIMIT 1
          `,
          [lesson.module_id]
        );

      const module =
        moduleResult.rows[0];

      if (!module) {

        return res
          .status(404)
          .json({
            error:
              'Darsga tegishli modul topilmadi'
          });
      }

      // ==================================================
      // ACCESS
      // ==================================================

      const userHasAccess =
        hasAccess(user);

      // ==================================================
      // FIRST MODULE
      // ==================================================

      const firstModuleResult =
        await pool.query(
          `
          SELECT
            id

          FROM modules

          ORDER BY
            order_index ASC,
            id ASC

          LIMIT 1
          `
        );

      const firstModule =
        firstModuleResult.rows[0];

      const isFirstModule =
        firstModule &&
        Number(firstModule.id) ===
        Number(module.id);

      // ==================================================
      // LESSON ACCESS
      // ==================================================

      const lessonAvailable =
        Boolean(lesson.is_free) ||
        isFirstModule ||
        userHasAccess;

      // ==================================================
      // LOCK
      // ==================================================

      if (!lessonAvailable) {

        return res
          .status(403)
          .json({

            error:
              'locked',

            message:
              'Bu dars yopiq. Kursga kirish uchun to‘lov qilishingiz kerak.'

          });
      }

      // ==================================================
      // LESSON FILES
      // ==================================================

      let files = [];

      try {

        const filesResult =
          await pool.query(
            `
            SELECT
              id,
              file_name,
              file_url

            FROM lesson_files

            WHERE lesson_id = $1

            ORDER BY
              id ASC
            `,
            [lesson.id]
          );

        files =
          filesResult.rows;

      } catch (fileError) {

        console.error(
          'LESSON FILES ERROR:',
          fileError
        );

        /*
         * Fayllar jadvalida muammo bo‘lsa,
         * darsning o‘zi baribir ochiladi.
         */

        files = [];
      }

      // ==================================================
      // PROGRESS
      // ==================================================

      try {

        await pool.query(
          `
          INSERT INTO progress
          (
            user_id,
            lesson_id,
            watched
          )

          VALUES
          (
            $1,
            $2,
            true
          )

          ON CONFLICT
          (
            user_id,
            lesson_id
          )

          DO UPDATE SET
            watched = true
          `,
          [
            user.id,
            lesson.id
          ]
        );

      } catch (progressError) {

        console.error(
          'PROGRESS ERROR:',
          progressError
        );

      }

      // ==================================================
      // WARNING TEXT
      // ==================================================

      const defaultWarning =
        `⚠️ MUHIM OGOHLANTIRISH

Ushbu darslik va undagi materiallar sizga faqat shaxsiy foydalanishingiz uchun berilgan OMONATdir.

Darsliklarni boshqa shaxslarga yuborish, tarqatish, nusxalash, sotish yoki internetga joylashtirish qat'iyan taqiqlanadi.

Iltimos, sizga berilgan ushbu omonatni asrang va boshqalarga tarqatmang.`;

      const warningText =
        lesson.warning_text &&
        lesson.warning_text.trim()
          ? lesson.warning_text
          : defaultWarning;

      // ==================================================
      // YOUTUBE
      // ==================================================

      const youtubePlayerUrl =
        generateYouTubePlayerUrl(
          lesson.youtube_url
        );

      if (youtubePlayerUrl) {

        return res.json({

          id:
            lesson.id,

          title:
            lesson.title,

          video_type:
            'youtube',

          youtube_url:
            lesson.youtube_url,

          youtube_player_url:
            youtubePlayerUrl,

          task_text:
            lesson.task_text || '',

          warning_text:
            warningText,

          files:
            files

        });
      }

      // ==================================================
      // BUNNY
      // ==================================================

      if (
        lesson.bunny_video_id &&
        process.env.BUNNY_LIBRARY_ID
      ) {

        const bunnyPlayerUrl =
          generateBunnyPlayerUrl(
            process.env.BUNNY_LIBRARY_ID,
            lesson.bunny_video_id
          );

        return res.json({

          id:
            lesson.id,

          title:
            lesson.title,

          video_type:
            'bunny',

          bunny_video_id:
            lesson.bunny_video_id,

          bunny_library_id:
            process.env.BUNNY_LIBRARY_ID,

          bunny_player_url:
            bunnyPlayerUrl,

          task_text:
            lesson.task_text || '',

          warning_text:
            warningText,

          files:
            files

        });
      }

      // ==================================================
      // VIDEO NOT FOUND
      // ==================================================

      return res.json({

        id:
          lesson.id,

        title:
          lesson.title,

        video_type:
          null,

        task_text:
          lesson.task_text || '',

        warning_text:
          warningText,

        files:
          files

      });

    } catch (error) {

      console.error(
        'LESSON ERROR:',
        error
      );

      return res
        .status(500)
        .json({

          error:
            'Darsni ochishda server xatosi'

        });
    }
  }
);

// ======================================================
// MODULE TEST
// ======================================================

app.post(
  '/api/module/:id/test',
  async (req, res) => {

    try {

      const user =
        await getOrCreateUser(
          req.body.initData
        );

      if (!user) {

        return res
          .status(401)
          .json({
            error:
              'Telegram foydalanuvchisi tekshirilmadi'
          });
      }

      const questionsResult =
        await pool.query(
          `
          SELECT
            id,
            question,
            options,
            order_index

          FROM module_tests

          WHERE module_id = $1

          ORDER BY
            order_index ASC,
            id ASC
          `,
          [req.params.id]
        );

      return res.json({

        questions:
          questionsResult.rows

      });

    } catch (error) {

      console.error(
        'TEST ERROR:',
        error
      );

      return res
        .status(500)
        .json({

          error:
            'Server xatosi'

        });
    }
  }
);

// ======================================================
// SUBMIT TEST
// ======================================================

app.post(
  '/api/module/:id/submit',
  async (req, res) => {

    try {

      const user =
        await getOrCreateUser(
          req.body.initData
        );

      if (!user) {

        return res
          .status(401)
          .json({
            error:
              'Telegram foydalanuvchisi tekshirilmadi'
          });
      }

      const answers =
        req.body.answers || {};

      const questionsResult =
        await pool.query(
          `
          SELECT
            id,
            correct_index

          FROM module_tests

          WHERE module_id = $1

          ORDER BY
            id ASC
          `,
          [req.params.id]
        );

      const questions =
        questionsResult.rows;

      let correct = 0;

      for (
        const question of questions
      ) {

        if (
          Number(
            answers[question.id]
          ) ===
          Number(
            question.correct_index
          )
        ) {

          correct++;

        }

      }

      const score =
        questions.length > 0
          ? Math.round(
              (
                correct /
                questions.length
              ) * 100
            )
          : 0;

      const passed =
        score >= 70;

      await pool.query(
        `
        INSERT INTO module_results
        (
          user_id,
          module_id,
          passed,
          score
        )

        VALUES
        (
          $1,
          $2,
          $3,
          $4
        )

        ON CONFLICT
        (
          user_id,
          module_id
        )

        DO UPDATE SET
          passed = $3,
          score = $4,
          attempted_at = now()
        `,
        [
          user.id,
          req.params.id,
          passed,
          score
        ]
      );

      return res.json({

        score,

        passed

      });

    } catch (error) {

      console.error(
        'SUBMIT TEST ERROR:',
        error
      );

      return res
        .status(500)
        .json({

          error:
            'Server xatosi'

        });
    }
  }
);

// ======================================================
// REQUEST ACCESS
// ======================================================

app.post(
  '/api/request-access',
  async (req, res) => {

    console.log(
      '========================================'
    );

    console.log(
      '📩 REQUEST ACCESS KELDI'
    );

    try {

      const user =
        await getOrCreateUser(
          req.body.initData
        );

      if (!user) {

        console.error(
          '❌ USER ANIQLANMADI'
        );

        return res
          .status(401)
          .json({

            ok: false,

            error:
              'Telegram foydalanuvchisi aniqlanmadi'

          });
      }

      console.log(
        '👤 USER:',
        user.telegram_id.toString()
      );

      console.log(
        '👤 NAME:',
        user.first_name
      );

      console.log(
        '📱 USERNAME:',
        user.username
      );

      // ==================================================
      // ACCESS BOR
      // ==================================================

      if (hasAccess(user)) {

        return res.json({

          ok: true,

          message:
            'Sizda allaqachon kursga kirish huquqi mavjud'

        });
      }

      // ==================================================
      // PENDING REQUEST
      // ==================================================

      const existingResult =
        await pool.query(
          `
          SELECT
            id

          FROM payment_requests

          WHERE user_id = $1

            AND status = 'pending'

          LIMIT 1
          `,
          [user.id]
        );

      // ==================================================
      // OLDIN SO‘ROV YUBORILGAN
      // ==================================================

      if (
        existingResult.rows.length > 0
      ) {

        console.log(
          '⚠️ PENDING SO‘ROV ALLAQACHON BOR'
        );

        const adminMessage =
          `💰 TO'LOV SO'ROVI!\n\n` +

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

          `⚠️ Bu foydalanuvchi oldin ham so‘rov yuborgan.\n\n` +

          `👇 Quyidagi tugmalardan birini tanlang:`;

        await notifyAdmin(
          adminMessage,
          user.telegram_id.toString()
        );

        return res.json({

          ok: true,

          already_pending:
            true,

          message:
            'So‘rovingiz adminga yuborildi'

        });
      }

      // ==================================================
      // CREATE PAYMENT REQUEST
      // ==================================================

      const requestResult =
        await pool.query(
          `
          INSERT INTO payment_requests
          (
            user_id,
            status
          )

          VALUES
          (
            $1,
            'pending'
          )

          RETURNING id
          `,
          [user.id]
        );

      console.log(
        '✅ PAYMENT REQUEST YARATILDI:',
        requestResult.rows[0].id
      );

      // ==================================================
      // ADMIN MESSAGE
      // ==================================================

      const adminMessage =
        `💰 YANGI TO'LOV SO'ROVI!\n\n` +

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

        `💳 Kursga kirish uchun so‘rov yuborildi.\n\n` +

        `👇 Quyidagi tugmalardan birini tanlang:`;

      console.log(
        '📤 ADMINGA XABAR YUBORILMOQDA...'
      );

      console.log(
        '🎯 ADMIN ID:',
        ADMIN_TELEGRAM_ID
      );

      await notifyAdmin(
        adminMessage,
        user.telegram_id.toString()
      );

      console.log(
        '✅ ADMINGA XABAR YUBORILDI'
      );

      return res.json({

        ok: true,

        already_pending:
          false,

        message:
          'So‘rov adminga yuborildi'

      });

    } catch (error) {

      console.error(
        '❌ REQUEST ACCESS ERROR:',
        error
      );

      console.error(
        '❌ ERROR MESSAGE:',
        error.message
      );

      return res
        .status(500)
        .json({

          ok: false,

          error:
            'Adminga murojaat yuborishda xatolik: ' +
            error.message

        });
    }
  }
);

// ======================================================
// ADMIN TEST
// ======================================================

app.get(
  '/api/admin-test',
  async (req, res) => {

    try {

      console.log(
        '🧪 ADMIN TEST'
      );

      console.log(
        'ADMIN ID:',
        ADMIN_TELEGRAM_ID
      );

      await notifyAdmin(
        `🧪 TEST XABARI\n\n` +
        `Telegram Admin ID: ${ADMIN_TELEGRAM_ID}\n\n` +
        `✅ Mini App serveridan test xabari.`
      );

      return res.json({

        ok: true,

        message:
          'Admin Telegramiga test xabari yuborildi'

      });

    } catch (error) {

      console.error(
        'ADMIN TEST ERROR:',
        error
      );

      return res
        .status(500)
        .json({

          ok: false,

          error:
            error.message

        });
    }
  }
);

// ======================================================
// HEALTH CHECK
// ======================================================

app.get(
  '/api/health',
  async (req, res) => {

    try {

      await pool.query(
        'SELECT 1'
      );

      return res.json({

        ok: true,

        message:
          'Server ishlayapti',

        database:
          'connected',

        admin_telegram_id:
          ADMIN_TELEGRAM_ID

      });

    } catch (error) {

      console.error(
        'HEALTH DATABASE ERROR:',
        error
      );

      return res
        .status(500)
        .json({

          ok: false,

          message:
            'Server ishlayapti, lekin database bilan aloqa yo‘q',

          database:
            'error'

        });
    }
  }
);

// ======================================================
// SERVER START
// ======================================================

app.listen(
  PORT,
  () => {

    console.log(
      '========================================'
    );

    console.log(
      `🚀 Server ${PORT}-portda ishga tushdi`
    );

    console.log(
      `🤖 Admin Telegram ID: ${ADMIN_TELEGRAM_ID}`
    );

    console.log(
      '========================================'
    );

  }
);
