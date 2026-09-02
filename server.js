require('dotenv').config();

const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const { verifyInitData } = require('./verifyTelegram');
const { notifyAdmin } = require('./bot');

const app = express();

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());

app.use(express.json());

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

// ======================================================
// BUNNY STREAM
// ======================================================

function generateBunnyToken(videoId, expiresAt) {
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
  // Video token 2 soat amal qiladi
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
    const parsedUrl = new URL(url);

    // youtu.be
    if (
      parsedUrl.hostname === 'youtu.be'
    ) {
      return (
        parsedUrl.pathname
          .replace('/', '')
          .trim() || null
      );
    }

    // youtube.com
    if (
      parsedUrl.hostname === 'youtube.com' ||
      parsedUrl.hostname === 'www.youtube.com' ||
      parsedUrl.hostname === 'm.youtube.com'
    ) {
      // ?v=VIDEO_ID
      const videoId =
        parsedUrl.searchParams.get('v');

      if (videoId) {
        return videoId;
      }

      // /embed/VIDEO_ID
      const embedMatch =
        parsedUrl.pathname.match(
          /^\/embed\/([^/]+)/
        );

      if (embedMatch) {
        return embedMatch[1];
      }

      // /shorts/VIDEO_ID
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
      error
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
// ACCESS TEKSHIRISH
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
// TELEGRAM USERNI OLISH / YARATISH
// ======================================================

async function getOrCreateUser(initData) {
  const tgUser =
    verifyInitData(
      initData,
      process.env.BOT_TOKEN
    );

  if (!tgUser) {
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
        tgUser.first_name,
        tgUser.username
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
              'Tekshirishdan o‘tmadi'
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
      const user =
        await getOrCreateUser(
          req.body.initData
        );

      if (!user) {
        return res
          .status(401)
          .json({
            error:
              'Tekshirishdan o‘tmadi'
          });
      }

      const unlocked =
        hasAccess(user);

      // --------------------------------------------------
      // MODULES
      // --------------------------------------------------

      const modulesResult =
        await pool.query(
          `
          SELECT *
          FROM modules
          ORDER BY order_index
          `
        );

      const modules =
        modulesResult.rows;

      // --------------------------------------------------
      // LESSONS
      // --------------------------------------------------

      const lessonsResult =
        await pool.query(
          `
          SELECT *
          FROM lessons
          ORDER BY
            module_id,
            order_index
          `
        );

      const lessons =
        lessonsResult.rows;

      // --------------------------------------------------
      // TEST RESULTS
      // --------------------------------------------------

      const resultsResult =
        await pool.query(
          `
          SELECT *
          FROM module_results
          WHERE user_id = $1
          `,
          [user.id]
        );

      const results =
        resultsResult.rows;

      const passedModuleIds =
        new Set(
          results
            .filter(
              result =>
                result.passed
            )
            .map(
              result =>
                result.module_id
            )
        );

      // --------------------------------------------------
      // MODULE DATA
      // --------------------------------------------------

      const data =
        modules.map(
          (module, index) => {

            /*
              1-modul avtomatik ochiq.

              2-modul ochilishi uchun
              1-modul testi o'tilgan bo'lishi kerak.

              3-modul ochilishi uchun
              2-modul testi o'tilgan bo'lishi kerak.
            */

            const moduleUnlocked =
              index === 0 ||
              passedModuleIds.has(
                modules[index - 1].id
              );

            return {
              id:
                module.id,

              title:
                module.title,

              unlocked:
                moduleUnlocked,

              passed_test:
                passedModuleIds.has(
                  module.id
                ),

              lessons:
                lessons
                  .filter(
                    lesson =>
                      lesson.module_id ===
                      module.id
                  )
                  .map(
                    lesson => {

                      /*
                        Bepul dars:
                        is_free = true

                        Pullik dars:
                        access kerak.
                      */

                      const available =
                        lesson.is_free ||
                        (
                          unlocked &&
                          moduleUnlocked
                        );

                      return {
                        id:
                          lesson.id,

                        title:
                          lesson.title,

                        is_free:
                          lesson.is_free,

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

      return res.json({
        has_access:
          unlocked,

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
      const user =
        await getOrCreateUser(
          req.body.initData
        );

      if (!user) {
        return res
          .status(401)
          .json({
            error:
              'Tekshirishdan o‘tmadi'
          });
      }

      // --------------------------------------------------
      // DARS
      // --------------------------------------------------

      const lessonResult =
        await pool.query(
          `
          SELECT *
          FROM lessons
          WHERE id = $1
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

      // --------------------------------------------------
      // ACCESS
      // --------------------------------------------------

      if (
        !lesson.is_free &&
        !hasAccess(user)
      ) {
        return res
          .status(403)
          .json({
            error:
              'locked',

            message:
              'Bu dars uchun to‘lov qilinishi kerak'
          });
      }

      // --------------------------------------------------
      // FILES
      // --------------------------------------------------

      const filesResult =
        await pool.query(
          `
          SELECT
            file_name,
            file_url

          FROM lesson_files

          WHERE lesson_id = $1
          `,
          [lesson.id]
        );

      const files =
        filesResult.rows;

      // --------------------------------------------------
      // PROGRESS
      // --------------------------------------------------

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

      // --------------------------------------------------
      // YOUTUBE
      // --------------------------------------------------

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
            lesson.task_text,

          files:
            files
        });
      }

      // --------------------------------------------------
      // BUNNY
      // --------------------------------------------------

      if (
        !lesson.bunny_video_id ||
        !process.env.BUNNY_LIBRARY_ID
      ) {
        return res
          .status(500)
          .json({
            error:
              'Bu dars uchun video sozlanmagan'
          });
      }

      const bunnyLibraryId =
        process.env.BUNNY_LIBRARY_ID;

      const bunnyVideoId =
        lesson.bunny_video_id;

      const bunnyPlayerUrl =
        generateBunnyPlayerUrl(
          bunnyLibraryId,
          bunnyVideoId
        );

      return res.json({
        id:
          lesson.id,

        title:
          lesson.title,

        video_type:
          'bunny',

        bunny_video_id:
          bunnyVideoId,

        bunny_library_id:
          bunnyLibraryId,

        bunny_player_url:
          bunnyPlayerUrl,

        task_text:
          lesson.task_text,

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
              'Tekshirishdan o‘tmadi'
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

          ORDER BY order_index
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
              'Tekshirishdan o‘tmadi'
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
          answers[question.id] ===
          question.correct_index
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
        score:
          score,

        passed:
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
              'Tekshirishdan o‘tmadi'
          });
      }

      // ==================================================
      // OLDIN PENDING REQUEST BORMI?
      // ==================================================

      const existingResult =
        await pool.query(
          `
          SELECT id

          FROM payment_requests

          WHERE user_id = $1
            AND status = 'pending'

          LIMIT 1
          `,
          [user.id]
        );

      if (
        existingResult.rows.length > 0
      ) {
        return res.json({
          ok:
            true,

          already_pending:
            true
        });
      }

      // ==================================================
      // REQUEST YARATISH
      // ==================================================

      await pool.query(
        `
        INSERT INTO payment_requests
        (
          user_id
        )

        VALUES
        (
          $1
        )
        `,
        [user.id]
      );

      // ==================================================
      // ADMIN TELEGRAM
      // ==================================================

      await notifyAdmin(
        `💰 YANGI TO'LOV SO'ROVI!\n\n` +
        `👤 Ism: ${user.first_name || "Noma'lum"}\n` +
        `📱 Username: @${user.username || "username yo‘q"}\n` +
        `🆔 Telegram ID: ${user.telegram_id}\n\n` +
        `👇 Quyidagi tugmalardan birini tanlang:`,
        user.telegram_id.toString()
      );

      // ==================================================
      // RESPONSE
      // ==================================================

      return res.json({
        ok:
          true
      });

    } catch (error) {
      console.error(
        'REQUEST ACCESS ERROR:',
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
// HEALTH CHECK
// ======================================================

app.get(
  '/api/health',
  (req, res) => {
    res.json({
      ok:
        true,

      message:
        'Server ishlayapti'
    });
  }
);

// ======================================================
// SERVER START
// ======================================================

const PORT =
  process.env.PORT || 3000;

app.listen(
  PORT,
  () => {
    console.log(
      `Server ${PORT}-portda ishga tushdi`
    );
  }
);
