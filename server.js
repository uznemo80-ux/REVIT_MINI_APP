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
  String(
    process.env.ADMIN_TELEGRAM_ID || '8043641301'
  ).trim();

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

    if (
      hostname === 'youtube.com' ||
      hostname === 'www.youtube.com' ||
      hostname === 'm.youtube.com'
    ) {
      const videoId =
        parsedUrl.searchParams.get('v');

      if (videoId) {
        return videoId;
      }

      const embedMatch =
        parsedUrl.pathname.match(
          /^\/embed\/([^/]+)/
        );

      if (embedMatch) {
        return embedMatch[1];
      }

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
        last_name,
        username
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
        telegram_id
      )

      DO UPDATE SET

        first_name =
          CASE
            WHEN users.first_name IS NULL
              OR TRIM(users.first_name) = ''
            THEN EXCLUDED.first_name
            ELSE users.first_name
          END,

        last_name =
          CASE
            WHEN users.last_name IS NULL
              OR TRIM(users.last_name) = ''
            THEN EXCLUDED.last_name
            ELSE users.last_name
          END,

        username =
          EXCLUDED.username

      RETURNING *
      `,
      [
        tgUser.id,
        tgUser.first_name || '',
        tgUser.last_name || null,
        tgUser.username || null
      ]
    );

  return result.rows[0];
}

// ======================================================
// ADMIN FUNCTIONS
// ======================================================

async function getAdminByTelegramId(
  telegramId
) {
  const result =
    await pool.query(
      `
      SELECT
        id,
        telegram_id,
        first_name,
        role,
        created_at

      FROM admins

      WHERE telegram_id = $1

      LIMIT 1
      `,
      [telegramId]
    );

  return result.rows[0] || null;
}

// ======================================================
// ADMIN AUTH
// ======================================================
//
// MUHIM:
// Asosiy Super Admin ADMIN_TELEGRAM_ID orqali
// admins jadvalida bo‘lmasa ham kirishi mumkin.
//

async function requireAdmin(
  req,
  res,
  next
) {
  try {
    const initData =
      req.body?.initData ||
      req.headers['x-telegram-init-data'];

    if (!initData) {
      return res
        .status(401)
        .json({
          error:
            'Telegram initData yuborilmagan'
        });
    }

    const user =
      await getOrCreateUser(
        initData
      );

    if (!user) {
      return res
        .status(401)
        .json({
          error:
            'Telegram foydalanuvchisi tekshirilmadi'
        });
    }

    const telegramId =
      String(
        user.telegram_id
      );

    // ==================================================
    // ASOSIY SUPER ADMIN
    // ==================================================

    if (
      telegramId ===
      String(
        ADMIN_TELEGRAM_ID
      )
    ) {
      req.user =
        user;

      req.admin = {
        id: null,

        telegram_id:
          telegramId,

        first_name:
          user.first_name ||
          'Super Admin',

        role:
          'super_admin',

        created_at:
          null
      };

      console.log(
        `👑 MAIN SUPER ADMIN ACCESS: ${telegramId}`
      );

      return next();
    }

    // ==================================================
    // DATABASEDAN ADMINNI QIDIRISH
    // ==================================================

    const admin =
      await getAdminByTelegramId(
        user.telegram_id
      );

    if (!admin) {
      console.warn(
        `ADMIN ACCESS DENIED: ${telegramId}`
      );

      return res
        .status(403)
        .json({
          error:
            'Sizda admin huquqi mavjud emas'
        });
    }

    req.user =
      user;

    req.admin =
      admin;

    console.log(
      `✅ ADMIN ACCESS: ${telegramId} | ROLE: ${admin.role}`
    );

    next();

  } catch (error) {
    console.error(
      'ADMIN AUTH ERROR:',
      error
    );

    return res
      .status(500)
      .json({
        error:
          'Admin tekshirishda server xatosi'
      });
  }
}

// ======================================================
// SUPER ADMIN AUTH
// ======================================================

async function requireSuperAdmin(
  req,
  res,
  next
) {
  try {
    if (!req.admin) {
      return res
        .status(403)
        .json({
          error:
            'Admin huquqi kerak'
        });
    }

    const currentTelegramId =
      String(
        req.admin.telegram_id
      );

    const mainAdminId =
      String(
        ADMIN_TELEGRAM_ID
      );

    const isMainAdmin =
      currentTelegramId ===
      mainAdminId;

    const isSuperAdmin =
      String(
        req.admin.role
      ) ===
      'super_admin';

    if (
      !isMainAdmin &&
      !isSuperAdmin
    ) {
      console.warn(
        `SUPER ADMIN ACCESS DENIED: ${currentTelegramId}`
      );

      return res
        .status(403)
        .json({
          error:
            'Faqat super admin bu amalni bajarishi mumkin'
        });
    }

    console.log(
      `👑 SUPER ADMIN ACCESS: ${currentTelegramId}`
    );

    next();

  } catch (error) {
    console.error(
      'SUPER ADMIN AUTH ERROR:',
      error
    );

    return res
      .status(500)
      .json({
        error:
          'Super admin tekshirishda xato'
      });
  }
}

// ======================================================
// REGISTER
// ======================================================

app.post(
  '/api/register',
  async (req, res) => {
    try {
      const initData =
        req.body?.initData;

      const firstName =
        String(
          req.body?.first_name || ''
        ).trim();

      const lastName =
        String(
          req.body?.last_name || ''
        ).trim();

      const phone =
        String(
          req.body?.phone || ''
        ).trim();

      if (!initData) {
        return res
          .status(401)
          .json({
            error:
              'Telegram initData yuborilmagan'
          });
      }

      if (!firstName) {
        return res
          .status(400)
          .json({
            error:
              'Ismni kiriting'
          });
      }

      if (!lastName) {
        return res
          .status(400)
          .json({
            error:
              'Familiyani kiriting'
          });
      }

      if (!phone) {
        return res
          .status(400)
          .json({
            error:
              'Telefon raqamini kiriting'
          });
      }

      const tgUser =
        verifyInitData(
          initData,
          process.env.BOT_TOKEN
        );

      if (!tgUser) {
        return res
          .status(401)
          .json({
            error:
              'Telegram maʼlumotlari noto‘g‘ri'
          });
      }

      const normalizedPhone =
        phone
          .replace(/[^\d+]/g, '')
          .trim();

      if (
        normalizedPhone.length < 9
      ) {
        return res
          .status(400)
          .json({
            error:
              'Telefon raqamini to‘g‘ri kiriting'
          });
      }

      const result =
        await pool.query(
          `
          INSERT INTO users
          (
            telegram_id,
            first_name,
            last_name,
            phone,
            username
          )

          VALUES
          (
            $1,
            $2,
            $3,
            $4,
            $5
          )

          ON CONFLICT
          (
            telegram_id
          )

          DO UPDATE SET

            first_name =
              EXCLUDED.first_name,

            last_name =
              EXCLUDED.last_name,

            phone =
              EXCLUDED.phone,

            username =
              EXCLUDED.username

          RETURNING *
          `,
          [
            tgUser.id,
            firstName,
            lastName,
            normalizedPhone,
            tgUser.username || null
          ]
        );

      const user =
        result.rows[0];

      console.log(
        '========================================'
      );

      console.log(
        '✅ USER REGISTERED'
      );

      console.log(
        '🆔 TELEGRAM ID:',
        user.telegram_id.toString()
      );

      console.log(
        '👤 NAME:',
        user.first_name,
        user.last_name
      );

      console.log(
        '📱 PHONE:',
        user.phone
      );

      console.log(
        '========================================'
      );

      return res.json({
        ok: true,

        registered: true,

        message:
          'Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi',

        user: {
          id:
            user.id,

          telegram_id:
            user.telegram_id.toString(),

          first_name:
            user.first_name || '',

          last_name:
            user.last_name || '',

          phone:
            user.phone || '',

          username:
            user.username || null,

          has_access:
            hasAccess(user),

          access_until:
            user.access_until || null
        }
      });

    } catch (error) {
      console.error(
        'REGISTRATION ERROR:',
        error
      );

      return res
        .status(500)
        .json({
          error:
            'Ro‘yxatdan o‘tishda server xatosi'
        });
    }
  }
);

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

      const admin =
        await getAdminByTelegramId(
          user.telegram_id
        );

      const isMainAdmin =
        String(
          user.telegram_id
        ) ===
        String(
          ADMIN_TELEGRAM_ID
        );

      return res.json({
        telegram_id:
          user.telegram_id.toString(),

        first_name:
          user.first_name || '',

        last_name:
          user.last_name || '',

        phone:
          user.phone || '',

        registered:
          Boolean(
            user.first_name &&
            user.last_name &&
            user.phone
          ),

        has_access:
          hasAccess(user),

        access_until:
          user.access_until || null,

        is_admin:
          Boolean(
            admin ||
            isMainAdmin
          ),

        admin_role:
          isMainAdmin
            ? 'super_admin'
            : admin?.role || null
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
              'Telegram foydalanuvchisi tekshirilmadi'
          });
      }

      const userHasAccess =
        hasAccess(user);

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

      const firstModuleId =
        modules.length
          ? modules[0].id
          : null;

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

      return res.json({
        has_access:
          userHasAccess,

        access_until:
          user.access_until || null,

        telegram_id:
          user.telegram_id.toString(),

        first_name:
          user.first_name || '',

        last_name:
          user.last_name || '',

        phone:
          user.phone || '',

        registered:
          Boolean(
            user.first_name &&
            user.last_name &&
            user.phone
          ),

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
              'Telegram foydalanuvchisi tekshirilmadi'
          });
      }

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

      const userHasAccess =
        hasAccess(user);

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

      const lessonAvailable =
        Boolean(lesson.is_free) ||
        isFirstModule ||
        userHasAccess;

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

        files = [];
      }

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
        user.first_name,
        user.last_name
      );

      console.log(
        '📱 PHONE:',
        user.phone
      );

      console.log(
        '📱 USERNAME:',
        user.username
      );

      if (hasAccess(user)) {

        return res.json({
          ok: true,

          message:
            'Sizda allaqachon kursga kirish huquqi mavjud'
        });
      }

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

      if (
        existingResult.rows.length > 0
      ) {

        console.log(
          '⚠️ PENDING SO‘ROV ALLAQACHON BOR'
        );

        const adminMessage =
          `💰 TO'LOV SO'ROVI!\n\n` +

          `👤 Ism: ${
            [
              user.first_name,
              user.last_name
            ]
              .filter(Boolean)
              .join(' ') ||
            "Noma'lum"
          }\n` +

          `📱 Telefon: ${
            user.phone ||
            "Telefon yo‘q"
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

      const adminMessage =
        `💰 YANGI TO'LOV SO'ROVI!\n\n` +

        `👤 Ism: ${
          [
            user.first_name,
            user.last_name
          ]
            .filter(Boolean)
            .join(' ') ||
          "Noma'lum"
        }\n` +

        `📱 Telefon: ${
          user.phone ||
          "Telefon yo‘q"
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
// ADMIN API
// ======================================================

// ======================================================
// ADMIN AUTH
// ======================================================

app.post(
  '/api/admin/auth',
  requireAdmin,
  async (req, res) => {

    return res.json({
      ok: true,

      admin: {

        id:
          req.admin.id,

        telegram_id:
          req.admin.telegram_id.toString(),

        first_name:
          req.admin.first_name || '',

        role:
          req.admin.role

      }
    });
  }
);

// ======================================================
// ADMIN STATS
// ======================================================

app.post(
  '/api/admin/stats',
  requireAdmin,
  async (req, res) => {

    try {

      const totalResult =
        await pool.query(
          `
          SELECT
            COUNT(*)::int AS total

          FROM users
          `
        );

      const paidResult =
        await pool.query(
          `
          SELECT
            COUNT(*)::int AS paid

          FROM users

          WHERE access_until > NOW()
          `
        );

      const unpaidResult =
        await pool.query(
          `
          SELECT
            COUNT(*)::int AS unpaid

          FROM users

          WHERE
            access_until IS NULL
            OR access_until <= NOW()
          `
        );

      const activeResult =
        await pool.query(
          `
          SELECT
            COUNT(
              DISTINCT user_id
            )::int AS active

          FROM progress

          WHERE watched = true
          `
        );

      const lessonsResult =
        await pool.query(
          `
          SELECT
            COUNT(*)::int AS total

          FROM lessons
          `
        );

      const modulesResult =
        await pool.query(
          `
          SELECT
            COUNT(*)::int AS total

          FROM modules
          `
        );

      return res.json({

        ok: true,

        stats: {

          total_students:
            totalResult.rows[0].total,

          paid_students:
            paidResult.rows[0].paid,

          unpaid_students:
            unpaidResult.rows[0].unpaid,

          active_students:
            activeResult.rows[0].active,

          total_lessons:
            lessonsResult.rows[0].total,

          total_modules:
            modulesResult.rows[0].total

        }

      });

    } catch (error) {

      console.error(
        'ADMIN STATS ERROR:',
        error
      );

      return res
        .status(500)
        .json({
          error:
            'Statistikani olishda xato'
        });
    }
  }
);

// ======================================================
// ADMIN STUDENTS
// ======================================================

app.post(
  '/api/admin/students',
  requireAdmin,
  async (req, res) => {

    try {

      const result =
        await pool.query(
          `
          SELECT

            u.id,

            u.telegram_id,

            u.first_name,

            u.last_name,

            u.phone,

            u.username,

            u.access_until,

            u.created_at,

            COUNT(
              DISTINCT
              CASE
                WHEN p.watched = true
                THEN p.lesson_id
              END
            )::int AS watched_lessons,

            (
              SELECT
                COUNT(*)::int

              FROM lessons
            ) AS total_lessons

          FROM users u

          LEFT JOIN progress p
            ON p.user_id = u.id

          GROUP BY
            u.id

          ORDER BY
            u.created_at DESC
          `
        );

      const students =
        result.rows.map(
          student => ({

            id:
              student.id,

            telegram_id:
              student.telegram_id.toString(),

            first_name:
              student.first_name || '',

            last_name:
              student.last_name || '',

            phone:
              student.phone || null,

            username:
              student.username || null,

            access_until:
              student.access_until || null,

            created_at:
              student.created_at,

            watched_lessons:
              student.watched_lessons,

            total_lessons:
              student.total_lessons,

            has_access:
              student.access_until &&
              new Date(
                student.access_until
              ) > new Date()

          })
        );

      return res.json({

        ok: true,

        students:
          students

      });

    } catch (error) {

      console.error(
        'ADMIN STUDENTS ERROR:',
        error
      );

      return res
        .status(500)
        .json({
          error:
            'O‘quvchilarni olishda xato'
        });
    }
  }
);

// ======================================================
// ADMIN STUDENT DETAIL / PROGRESS
// ======================================================

app.post(
  '/api/admin/student/:id',
  requireAdmin,
  async (req, res) => {

    try {

      const studentResult =
        await pool.query(
          `
          SELECT
            id,
            telegram_id,
            first_name,
            last_name,
            phone,
            username,
            access_until,
            created_at

          FROM users

          WHERE id = $1

          LIMIT 1
          `,
          [req.params.id]
        );

      const student =
        studentResult.rows[0];

      if (!student) {

        return res
          .status(404)
          .json({
            error:
              'O‘quvchi topilmadi'
          });
      }

      const progressResult =
        await pool.query(
          `
          SELECT

            m.id AS module_id,

            m.title AS module_title,

            m.order_index AS module_order,

            l.id AS lesson_id,

            l.title AS lesson_title,

            l.order_index AS lesson_order,

            COALESCE(
              p.watched,
              false
            ) AS watched

          FROM modules m

          LEFT JOIN lessons l
            ON l.module_id = m.id

          LEFT JOIN progress p
            ON p.lesson_id = l.id
            AND p.user_id = $1

          ORDER BY
            m.order_index ASC,
            l.order_index ASC,
            l.id ASC
          `,
          [student.id]
        );

      const testResult =
        await pool.query(
          `
          SELECT

            mr.module_id,

            m.title AS module_title,

            mr.passed,

            mr.score,

            mr.attempted_at

          FROM module_results mr

          JOIN modules m
            ON m.id = mr.module_id

          WHERE mr.user_id = $1

          ORDER BY
            m.order_index ASC
          `,
          [student.id]
        );

      return res.json({

        ok: true,

        student: {

          id:
            student.id,

          telegram_id:
            student.telegram_id.toString(),

          first_name:
            student.first_name || '',

          last_name:
            student.last_name || '',

          phone:
            student.phone || null,

          username:
            student.username || null,

          access_until:
            student.access_until || null,

          created_at:
            student.created_at

        },

        progress:
          progressResult.rows,

        tests:
          testResult.rows

      });

    } catch (error) {

      console.error(
        'ADMIN STUDENT DETAIL ERROR:',
        error
      );

      return res
        .status(500)
        .json({
          error:
            'O‘quvchi ma’lumotlarini olishda xato'
        });
    }
  }
);

// ======================================================
// ADMIN MODULES
// ======================================================

app.post(
  '/api/admin/modules',
  requireAdmin,
  async (req, res) => {

    try {

      const result =
        await pool.query(
          `
          SELECT

            m.id,

            m.title,

            m.order_index,

            COUNT(l.id)::int AS lesson_count

          FROM modules m

          LEFT JOIN lessons l
            ON l.module_id = m.id

          GROUP BY
            m.id

          ORDER BY
            m.order_index ASC,
            m.id ASC
          `
        );

      return res.json({

        ok: true,

        modules:
          result.rows

      });

    } catch (error) {

      console.error(
        'ADMIN MODULES ERROR:',
        error
      );

      return res
        .status(500)
        .json({
          error:
            'Modullarni olishda xato'
        });
    }
  }
);

// ======================================================
// ADMIN LESSON LIST
// ======================================================

app.post(
  '/api/admin/module/:id/lessons',
  requireAdmin,
  async (req, res) => {

    try {

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
          [req.params.id]
        );

      if (
        moduleResult.rows.length === 0
      ) {

        return res
          .status(404)
          .json({
            error:
              'Modul topilmadi'
          });
      }

      const result =
        await pool.query(
          `
          SELECT

            l.id,

            l.module_id,

            l.title,

            l.order_index,

            l.youtube_url,

            l.task_text,

            l.is_free,

            l.bunny_video_id,

            l.warning_text,

            COUNT(
              lf.id
            )::int AS file_count

          FROM lessons l

          LEFT JOIN lesson_files lf
            ON lf.lesson_id = l.id

          WHERE
            l.module_id = $1

          GROUP BY
            l.id

          ORDER BY
            l.order_index ASC,
            l.id ASC
          `,
          [req.params.id]
        );

      return res.json({

        ok: true,

        module:
          moduleResult.rows[0],

        lessons:
          result.rows

      });

    } catch (error) {

      console.error(
        'ADMIN MODULE LESSONS ERROR:',
        error
      );

      return res
        .status(500)
        .json({
          error:
            'Darslarni olishda xato'
        });
    }
  }
);

// ======================================================
// CREATE LESSON
// ======================================================

app.post(
  '/api/admin/lesson',
  requireAdmin,
  async (req, res) => {

    try {

      const {
        module_id,
        title,
        order_index,
        youtube_url,
        task_text,
        is_free,
        bunny_video_id,
        warning_text
      } = req.body;

      if (
        !module_id ||
        !title ||
        order_index === undefined
      ) {

        return res
          .status(400)
          .json({
            error:
              'module_id, title va order_index majburiy'
          });
      }

      const moduleResult =
        await pool.query(
          `
          SELECT
            id

          FROM modules

          WHERE id = $1

          LIMIT 1
          `,
          [module_id]
        );

      if (
        moduleResult.rows.length === 0
      ) {

        return res
          .status(404)
          .json({
            error:
              'Modul topilmadi'
          });
      }

      const duplicateResult =
        await pool.query(
          `
          SELECT
            id

          FROM lessons

          WHERE
            module_id = $1
            AND order_index = $2

          LIMIT 1
          `,
          [
            module_id,
            Number(order_index)
          ]
        );

      if (
        duplicateResult.rows.length > 0
      ) {

        return res
          .status(400)
          .json({
            error:
              'Bu modulda ushbu dars raqami allaqachon mavjud'
          });
      }

      const result =
        await pool.query(
          `
          INSERT INTO lessons
          (
            module_id,
            title,
            order_index,
            youtube_url,
            task_text,
            is_free,
            bunny_video_id,
            warning_text
          )

          VALUES
          (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8
          )

          RETURNING *
          `,
          [
            Number(module_id),
            title.trim(),
            Number(order_index),
            youtube_url || null,
            task_text || null,
            Boolean(is_free),
            bunny_video_id || null,
            warning_text || null
          ]
        );

      return res.json({

        ok: true,

        message:
          'Dars muvaffaqiyatli yaratildi',

        lesson:
          result.rows[0]

      });

    } catch (error) {

      console.error(
        'CREATE LESSON ERROR:',
        error
      );

      return res
        .status(500)
        .json({
          error:
            'Dars yaratishda server xatosi'
        });
    }
  }
);

// ======================================================
// UPDATE LESSON
// ======================================================

app.post(
  '/api/admin/lesson/:id/update',
  requireAdmin,
  async (req, res) => {

    try {

      const {
        module_id,
        title,
        order_index,
        youtube_url,
        task_text,
        is_free,
        bunny_video_id,
        warning_text
      } = req.body;

      if (
        !module_id ||
        !title ||
        order_index === undefined
      ) {

        return res
          .status(400)
          .json({
            error:
              'module_id, title va order_index majburiy'
          });
      }

      const existingResult =
        await pool.query(
          `
          SELECT
            id

          FROM lessons

          WHERE id = $1

          LIMIT 1
          `,
          [req.params.id]
        );

      if (
        existingResult.rows.length === 0
      ) {

        return res
          .status(404)
          .json({
            error:
              'Dars topilmadi'
          });
      }

      const duplicateResult =
        await pool.query(
          `
          SELECT
            id

          FROM lessons

          WHERE
            module_id = $1
            AND order_index = $2
            AND id <> $3

          LIMIT 1
          `,
          [
            Number(module_id),
            Number(order_index),
            Number(req.params.id)
          ]
        );

      if (
        duplicateResult.rows.length > 0
      ) {

        return res
          .status(400)
          .json({
            error:
              'Bu modulda ushbu dars raqami allaqachon mavjud'
          });
      }

      const result =
        await pool.query(
          `
          UPDATE lessons

          SET
            module_id = $1,
            title = $2,
            order_index = $3,
            youtube_url = $4,
            task_text = $5,
            is_free = $6,
            bunny_video_id = $7,
            warning_text = $8

          WHERE id = $9

          RETURNING *
          `,
          [
            Number(module_id),
            title.trim(),
            Number(order_index),
            youtube_url || null,
            task_text || null,
            Boolean(is_free),
            bunny_video_id || null,
            warning_text || null,
            Number(req.params.id)
          ]
        );

      return res.json({

        ok: true,

        message:
          'Dars muvaffaqiyatli yangilandi',

        lesson:
          result.rows[0]

      });

    } catch (error) {

      console.error(
        'UPDATE LESSON ERROR:',
        error
      );

      return res
        .status(500)
        .json({
          error:
            'Darsni yangilashda xato'
        });
    }
  }
);

// ======================================================
// DELETE LESSON
// ======================================================

app.post(
  '/api/admin/lesson/:id/delete',
  requireAdmin,
  async (req, res) => {

    try {

      const lessonId =
        Number(req.params.id);

      const lessonResult =
        await pool.query(
          `
          SELECT
            id

          FROM lessons

          WHERE id = $1

          LIMIT 1
          `,
          [lessonId]
        );

      if (
        lessonResult.rows.length === 0
      ) {

        return res
          .status(404)
          .json({
            error:
              'Dars topilmadi'
          });
      }

      await pool.query(
        'DELETE FROM progress WHERE lesson_id = $1',
        [lessonId]
      );

      await pool.query(
        'DELETE FROM lesson_files WHERE lesson_id = $1',
        [lessonId]
      );

      await pool.query(
        'DELETE FROM lessons WHERE id = $1',
        [lessonId]
      );

      return res.json({

        ok: true,

        message:
          'Dars o‘chirildi'

      });

    } catch (error) {

      console.error(
        'DELETE LESSON ERROR:',
        error
      );

      return res
        .status(500)
        .json({
          error:
            'Darsni o‘chirishda xato'
        });
    }
  }
);

// ======================================================
// GET LESSON FILES
// ======================================================

app.post(
  '/api/admin/lesson/:id/files',
  requireAdmin,
  async (req, res) => {

    try {

      const lessonResult =
        await pool.query(
          `
          SELECT
            id,
            title

          FROM lessons

          WHERE id = $1

          LIMIT 1
          `,
          [req.params.id]
        );

      if (
        lessonResult.rows.length === 0
      ) {

        return res
          .status(404)
          .json({
            error:
              'Dars topilmadi'
          });
      }

      const result =
        await pool.query(
          `
          SELECT
            id,
            lesson_id,
            file_name,
            file_url

          FROM lesson_files

          WHERE lesson_id = $1

          ORDER BY id ASC
          `,
          [req.params.id]
        );

      return res.json({

        ok: true,

        lesson:
          lessonResult.rows[0],

        files:
          result.rows

      });

    } catch (error) {

      console.error(
        'GET FILES ERROR:',
        error
      );

      return res
        .status(500)
        .json({
          error:
            'Materiallarni olishda xato'
        });
    }
  }
);

// ======================================================
// ADD LESSON FILE
// ======================================================

app.post(
  '/api/admin/lesson/:id/files/add',
  requireAdmin,
  async (req, res) => {

    try {

      const {
        file_name,
        file_url
      } = req.body;

      if (
        !file_name ||
        !file_url
      ) {

        return res
          .status(400)
          .json({
            error:
              'file_name va file_url majburiy'
          });
      }

      const lessonResult =
        await pool.query(
          `
          SELECT
            id

          FROM lessons

          WHERE id = $1

          LIMIT 1
          `,
          [req.params.id]
        );

      if (
        lessonResult.rows.length === 0
      ) {

        return res
          .status(404)
          .json({
            error:
              'Dars topilmadi'
          });
      }

      const result =
        await pool.query(
          `
          INSERT INTO lesson_files
          (
            lesson_id,
            file_name,
            file_url
          )

          VALUES
          (
            $1,
            $2,
            $3
          )

          RETURNING *
          `,
          [
            Number(req.params.id),
            file_name.trim(),
            file_url.trim()
          ]
        );

      return res.json({

        ok: true,

        message:
          'Material qo‘shildi',

        file:
          result.rows[0]

      });

    } catch (error) {

      console.error(
        'ADD FILE ERROR:',
        error
      );

      return res
        .status(500)
        .json({
          error:
            'Material qo‘shishda xato'
        });
    }
  }
);

// ======================================================
// UPDATE LESSON FILE
// ======================================================

app.post(
  '/api/admin/file/:id/update',
  requireAdmin,
  async (req, res) => {

    try {

      const {
        file_name,
        file_url
      } = req.body;

      if (
        !file_name ||
        !file_url
      ) {

        return res
          .status(400)
          .json({
            error:
              'file_name va file_url majburiy'
          });
      }

      const result =
        await pool.query(
          `
          UPDATE lesson_files

          SET
            file_name = $1,
            file_url = $2

          WHERE id = $3

          RETURNING *
          `,
          [
            file_name.trim(),
            file_url.trim(),
            Number(req.params.id)
          ]
        );

      if (
        result.rows.length === 0
      ) {

        return res
          .status(404)
          .json({
            error:
              'Material topilmadi'
          });
      }

      return res.json({

        ok: true,

        message:
          'Material yangilandi',

        file:
          result.rows[0]

      });

    } catch (error) {

      console.error(
        'UPDATE FILE ERROR:',
        error
      );

      return res
        .status(500)
        .json({
          error:
            'Materialni yangilashda xato'
        });
    }
  }
);

// ======================================================
// DELETE LESSON FILE
// ======================================================

app.post(
  '/api/admin/file/:id/delete',
  requireAdmin,
  async (req, res) => {

    try {

      const result =
        await pool.query(
          `
          DELETE FROM lesson_files

          WHERE id = $1

          RETURNING id
          `,
          [Number(req.params.id)]
        );

      if (
        result.rows.length === 0
      ) {

        return res
          .status(404)
          .json({
            error:
              'Material topilmadi'
          });
      }

      return res.json({

        ok: true,

        message:
          'Material o‘chirildi'

      });

    } catch (error) {

      console.error(
        'DELETE FILE ERROR:',
        error
      );

      return res
        .status(500)
        .json({
          error:
            'Materialni o‘chirishda xato'
        });
    }
  }
);

// ======================================================
// ADMIN LIST
// ======================================================

app.post(
  '/api/admin/admins',
  requireSuperAdmin,
  async (req, res) => {

    try {

      const result =
        await pool.query(
          `
          SELECT
            id,
            telegram_id,
            first_name,
            role,
            created_at

          FROM admins

          ORDER BY
            created_at ASC NULLS FIRST,
            id ASC
          `
        );

      const admins =
        result.rows.map(
          admin => ({

            id:
              admin.id,

            telegram_id:
              admin.telegram_id.toString(),

            first_name:
              admin.first_name || '',

            role:
              admin.role,

            created_at:
              admin.created_at

          })
        );

      // ==================================================
      // ASOSIY SUPER ADMIN DATABASEDA BO‘LMASA
      // RO‘YXATGA VIRTUAL QO‘SHAMIZ
      // ==================================================

      const mainAdminExists =
        admins.some(
          admin =>
            String(
              admin.telegram_id
            ) ===
            String(
              ADMIN_TELEGRAM_ID
            )
        );

      if (!mainAdminExists) {

        admins.unshift({

          id:
            null,

          telegram_id:
            String(
              ADMIN_TELEGRAM_ID
            ),

          first_name:
            'Super Admin',

          role:
            'super_admin',

          created_at:
            null

        });
      }

      return res.json({

        ok: true,

        admins:
          admins

      });

    } catch (error) {

      console.error(
        'ADMIN LIST ERROR:',
        error
      );

      return res
        .status(500)
        .json({
          error:
            'Adminlarni olishda xato'
        });
    }
  }
);

// ======================================================
// ADD ADMIN
// ======================================================

app.post(
  '/api/admin/admins/add',
  requireSuperAdmin,
  async (req, res) => {

    try {

      const telegramId =
        String(
          req.body?.telegram_id || ''
        ).trim();

      const firstName =
        String(
          req.body?.first_name || ''
        ).trim();

      const requestedRole =
        String(
          req.body?.role || 'admin'
        ).trim();

      // ==================================================
      // TELEGRAM ID MAJBURIY
      // ==================================================

      if (!telegramId) {

        return res
          .status(400)
          .json({
            error:
              'Telegram ID majburiy'
          });
      }

      // ==================================================
      // TELEGRAM ID FAQAT RAQAMLAR
      // ==================================================

      if (
        !/^\d+$/.test(
          telegramId
        )
      ) {

        return res
          .status(400)
          .json({
            error:
              'Telegram ID faqat raqamlardan iborat bo‘lishi kerak'
          });
      }

      // ==================================================
      // ROLE
      // ==================================================

      const selectedRole =
        requestedRole ===
        'super_admin'
          ? 'super_admin'
          : 'admin';

      // ==================================================
      // ASOSIY SUPER ADMINNI QAYTA QO‘SHISH YO‘Q
      // ==================================================

      if (
        telegramId ===
        String(
          ADMIN_TELEGRAM_ID
        )
      ) {

        return res
          .status(400)
          .json({
            error:
              'Bu Telegram ID allaqachon asosiy Super Admin hisoblanadi'
          });
      }

      // ==================================================
      // DATABASE
      // ==================================================

      const result =
        await pool.query(
          `
          INSERT INTO admins
          (
            telegram_id,
            first_name,
            role
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

            first_name =
              EXCLUDED.first_name,

            role =
              EXCLUDED.role

          RETURNING
            id,
            telegram_id,
            first_name,
            role,
            created_at
          `,
          [
            telegramId,
            firstName,
            selectedRole
          ]
        );

      const admin =
        result.rows[0];

      console.log(
        '========================================'
      );

      console.log(
        '👑 ADMIN ADDED / UPDATED'
      );

      console.log(
        '🆔 Telegram ID:',
        admin.telegram_id.toString()
      );

      console.log(
        '👤 Name:',
        admin.first_name
      );

      console.log(
        '🔐 Role:',
        admin.role
      );

      console.log(
        '========================================'
      );

      return res.json({

        ok: true,

        message:
          'Admin muvaffaqiyatli qo‘shildi',

        admin: {

          id:
            admin.id,

          telegram_id:
            admin.telegram_id.toString(),

          first_name:
            admin.first_name || '',

          role:
            admin.role,

          created_at:
            admin.created_at

        }

      });

    } catch (error) {

      console.error(
        'ADD ADMIN ERROR:',
        error
      );

      // ==================================================
      // UNIQUE CONSTRAINT
      // ==================================================

      if (
        error.code ===
        '23505'
      ) {

        return res
          .status(400)
          .json({
            error:
              'Bu Telegram ID bilan admin allaqachon mavjud'
          });
      }

      return res
        .status(500)
        .json({
          error:
            'Admin qo‘shishda xato: ' +
            error.message
        });
    }
  }
);

// ======================================================
// DELETE ADMIN
// ======================================================

app.post(
  '/api/admin/admins/:id/delete',
  requireSuperAdmin,
  async (req, res) => {

    try {

      const adminId =
        Number(
          req.params.id
        );

      if (
        !Number.isInteger(adminId) ||
        adminId <= 0
      ) {

        return res
          .status(400)
          .json({
            error:
              'Admin ID noto‘g‘ri'
          });
      }

      const targetResult =
        await pool.query(
          `
          SELECT
            id,
            telegram_id,
            first_name,
            role

          FROM admins

          WHERE id = $1

          LIMIT 1
          `,
          [adminId]
        );

      const target =
        targetResult.rows[0];

      if (!target) {

        return res
          .status(404)
          .json({
            error:
              'Admin topilmadi'
          });
      }

      const targetTelegramId =
        String(
          target.telegram_id
        );

      // ==================================================
      // ASOSIY SUPER ADMINNI O‘CHIRISH MUMKIN EMAS
      // ==================================================

      if (
        targetTelegramId ===
        String(
          ADMIN_TELEGRAM_ID
        )
      ) {

        return res
          .status(400)
          .json({
            error:
              'Asosiy Super Adminni o‘chirib bo‘lmaydi'
          });
      }

      // ==================================================
      // SUPER ADMINNI O‘CHIRISH MUMKIN EMAS
      // ==================================================

      if (
        target.role ===
        'super_admin'
      ) {

        return res
          .status(400)
          .json({
            error:
              'Super Adminni o‘chirib bo‘lmaydi'
          });
      }

      await pool.query(
        `
        DELETE FROM admins

        WHERE id = $1
        `,
        [adminId]
      );

      console.log(
        `🗑 ADMIN DELETED: ${targetTelegramId}`
      );

      return res.json({

        ok: true,

        message:
          'Admin o‘chirildi'

      });

    } catch (error) {

      console.error(
        'DELETE ADMIN ERROR:',
        error
      );

      return res
        .status(500)
        .json({
          error:
            'Adminni o‘chirishda xato'
        });
    }
  }
);

// ======================================================
// ADMIN TEST
// ======================================================

app.post(
  '/api/admin-test',
  requireAdmin,
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
        `👤 So‘rov yuborgan admin: ${
          req.admin.first_name ||
          'Noma’lum'
        }\n\n` +
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
