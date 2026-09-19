require('dotenv').config();

var crypto = require('crypto');
var express = require('express');
var cors = require('cors');
var pgModule = require('pg');
var Pool = pgModule.Pool;

var verifyModule = require('./verifyTelegram');
var verifyInitData = verifyModule.verifyInitData;
var botModule = require('./bot');
var notifyAdmin = botModule.notifyAdmin;

var app = express();

// ======================================================
// CONFIG
// ======================================================

var PORT = process.env.PORT || 3000;

var ADMIN_TELEGRAM_ID = String(
  process.env.ADMIN_TELEGRAM_ID || '8043641301'
).trim();

console.log('ADMIN TELEGRAM ID: ' + ADMIN_TELEGRAM_ID);

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());

app.use(express.json({ limit: '10mb' }));

app.use(express.static('public', {
  etag: false,
  lastModified: false,
  setHeaders: function (res) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  }
}));

// ======================================================
// DATABASE
// ======================================================

var pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', function (error) {
  console.error('DATABASE POOL ERROR:', error);
});

// Xavfsiz avto-migratsiya (agar jadvallar yoki ustunlar yo'q bo'lsa avtomatik yaratiladi)
const MODULE2_TEST_SEED = [
  { q: "Revit-da ishchi loyiha faylining asosiy formati qaysi?", options: ["RTE", "RVT", "RFA", "RFT"], correct: 1 },
  { q: "Yangi loyiha boshlash uchun ishlatiladigan, birliklar va standartlar sozlangan shablon fayli formati qaysi?", options: ["RFA", "RFT", "RTE", "RVT"], correct: 2 },
  { q: "Tashqaridan loyihaga yuklanadigan komponentlar (eshik, deraza, mebel) qaysi fayl formatida bo'ladi?", options: ["RFA", "RVT", "RTE", "RFT"], correct: 0 },
  { q: "Vitraj (Curtain Wall) elementi Revit-da qaysi bazaviy kategoriya asosida chiziladi?", options: ["Okno (Deraza)", "Ograzhdeniye (To'siq)", "Karkas nesushchiy", "Stena (Devor)"], correct: 3 },
  { q: "Vitraj paneliga standart eshik o'rnatish uchun qanday ketma-ketlik bajariladi?", options: ["Eshik komandasini tanlab, vitraj oynasiga keltirib bosiladi", "Vitraj panelini tanlab, unpin qilinadi va maxsus vitraj eshik family-si tanlanadi", "Vitraj balandligini kamida 4 metrga oshirish kerak", "Vitraj paneli o'chirib tashlanib, o'rniga oddiy devor chiziladi"], correct: 1 },
  { q: "Loyihadagi mavjud (obmer), buziladigan (demontaj) va yangi quriladigan (montaj) elementlarni ajratish uchun Revit-da qaysi funksiya ishlatiladi?", options: ["Worksets", "Design Options", "View Range", "Phasing (Stadiya)"], correct: 3 },
  { q: "Phasing sozlamalariga ko'ra demontaj rejasida (Plan demontaj) buziladigan devor va elementlar odatda qaysi rangda ko'rsatiladi?", options: ["Qizil", "Yashil", "Ko'k", "Sariq"], correct: 0 },
  { q: "Plan etaj ko'rinishida qavat rejasini hosil qilish uchun kesim tekisligi (Cut plane) poldan odatda qancha balandlikda o'tkaziladi?", options: ["500 mm", "2500 mm", "1200 mm", "3000 mm"], correct: 2 },
  { q: "Plan patalog (Reflected Ceiling Plan) ko'rinishining Plan etajdan asosiy farqi nimada?", options: ["Kesim tekisligidan pastga emas, tepaga qaraladi", "Kesim tekisligi poldan 0 mm balandlikda o'tkaziladi", "Faqat 3D ko'rinishda ishlaydi", "Elementlar qizil rangda ko'rsatiladi"], correct: 0 },
  { q: "2-qavat rejasini yaratishda 1-qavat vididan shunchaki Copy detalizatsiya olish nima uchun noto'g'ri hisoblanadi?", options: ["Fayl hajmi 10 baravar oshib ketadi", "Revit dasturi kutilmaganda yopilib ketadi", "Barcha devorlar avtomatik ravishda o'chib ketadi", "Yangi vid 1-qavat balandligi (Level 1) bilan bog'liq bo'lib qoladi va Sekushchiy diapazon xato ishlaydi"], correct: 3 },
  { q: "Revit-da barcha vidlar, spesifikatsiyalar, listlar va family-lar mundarijasi joylashgan oyna qanday nomlanadi?", options: ["Svoystva (Properties)", "Ribbon", "Dispetcher proyekt (Project Browser)", "Navigatsiya paneli"], correct: 2 },
  { q: "Tanlangan elementning balandligi, materiali, o'lchamlari kabi xususiyatlarini ko'rish va o'zgartirish uchun qaysi oyna ishlatiladi?", options: ["Svoystva (Properties)", "Dispetcher proyekt (Project Browser)", "Phasing menyusi", "View Range oyna"], correct: 0 },
  { q: "AutoCAD faylini (DWG) Revit-ga \"Svyaz SAPR\" (Link CAD) orqali olib kirishning \"Import SAPR\"dan asosiy afzalligi nimada?", options: ["3D modelni avtomatik ravishda yaratib beradi", "DWG fayli AutoCAD-da o'zgarganda Revit-dagi chizma ham avtomatik yangilanadi", "Fayl hajmini 0 MB ga tushiradi", "Devorlarni avtomatik ravishda bo'yab beradi"], correct: 1 },
  { q: "Nima uchun interyer loyihalarida devorlar uchun oddiy GKL o'rniga namlikka chidamli GKLV gipsokarton ishlatish tavsiya etiladi?", options: ["GKLV faqat qizil rangda bo'ladi", "GKLV devor og'irligini 5 baravar kamaytiradi", "Boyash va gruntovka jarayonida qog'oz qatlamida to'lqin (valna) hosil bo'lishining oldini oladi", "GKLV narxi oddiy GKLdan 10 baravar arzon"], correct: 2 },
  { q: "Revit-da yuqori versiyada (masalan, Revit 2025) saqlangan loyiha faylini pastki versiyada (masalan, Revit 2023) ochish mumkinmi?", options: ["Ha, Save As menyusidan versiyani pasaytirib saqlash kerak", "Ha, faqat AutoCAD orqali o'tkazilsa ochiladi", "Yo'q, Revit-da versiyani pasaytirib saqlash imkoniyati yo'q va pastki versiya yuqori versiyani ocholmaydi", "Ha, fayl kengaytmasini .DWG ga o'zgartirilsa ochiladi"], correct: 2 },
  { q: "Bir nechta vidlarda grafik sozlamalarni (mashtab, detalizatsiya, filtrlar) bir xil holatda saqlash va markazlashgan holda boshqarish uchun qaysi vositadan foydalaniladi?", options: ["Filter (Filtr)", "View Range", "Phasing", "Shablon vid (View Template)"], correct: 3 },
  { q: "Elementlarga muayyan mantiqiy qoida (masalan, Kommentariy k tiporazmeru = GKLV) bo'yicha alohida grafik va rang berish uchun qaysi vosita ishlatiladi?", options: ["Filter (Filtr)", "Worksets", "Design Options", "Material Editor"], correct: 0 },
  { q: "Devol, Pol, Potolok, Krysha kabi loyihaning ichida mavjud bo'lib, tashqaridan RFA fayli sifatida yuklab bo'lmaydigan family-lar qanday nomlanadi?", options: ["Loadable Families (Yuklanadigan)", "System Families (Tizimli)", "In-Place Families (Kontekstdagi)", "Annotation Families"], correct: 1 },
  { q: "Eshik, deraza va mebel kabi tashqaridan loyihaga RFA formatida yuklanadigan parametrik modellar qanday nomlanadi?", options: ["System Families", "In-Place Families", "Loadable Families (Yuklanadigan)", "Internal Templates"], correct: 2 },
  { q: "Bevosita loyiha ichida (Model in Place) yaratiladigan family-larning asosiy kamchiligi nimada?", options: ["Ularni spesifikatsiyaga qo'shib bo'lmaydi", "Ular faqat 2D ko'rinishda ko'rinadi", "Ularning rangini o'zgartirib bo'lmaydi", "Boshqa loyihalarga RFA sifatida o'tkazib bo'lmaydi va ko'p ishlatilsa loyihani og'irlashtiradi"], correct: 3 },
  { q: "Devor chizishda \"Tsep\" (Chain) funksiyasi o'chirib qo'yilsa nima sodir bo'ladi?", options: ["Har bir devor segmenti chizilgach, komanda to'xtaydi va keyingi segment avtomatik ulanmaydi", "Devorlar umuman chizilmaydi", "Devorlar shaffof bo'lib qoladi", "Devor balandligi 0 ga tushib qoladi"], correct: 0 },
  { q: "Loyihani saqlashda har safar qo'shimcha zaxira fayllari (0001, 0002) ko'payib ketmasligi uchun saqlash parametrlarida nima sozlanadi?", options: ["Fayl nomi o'zgartiriladi", "Maksimum bakkaplar (Maximum backups) soni 1 ga tushiriladi", "Revit dasturi qayta o'rnatiladi", "AutoCAD marshruti o'chiriladi"], correct: 1 },
  { q: "Arxitektura va interyer loyihalarida 0.000 sathi (marka) sifatida qaysi pol darajasi qabul qilinadi?", options: ["Poydevor tubi", "Chernovoy pol (beton/monolit plita)", "Chistovoy pol (yakuniy toza tayyor pol sathi)", "Ko'cha asfaltdagi sathi"], correct: 2 },
  { q: "Chernovoy pol (monolit plita) odatda Chistovoy poldan qancha masofa pastda joylashadi?", options: ["10-20 mm", "300-400 mm", "1000 mm", "80-100 mm (8-10 sm)"], correct: 3 },
  { q: "Revit-ning standart ruscha kutubxonasi (Russian Libraries) kompyuterda qaysi papkada joylashadi?", options: ["C:\\Program Files\\Autodesk\\Revit", "C:\\ProgramData\\Autodesk\\RVT 2024\\Libraries\\Russian", "C:\\Windows\\System32", "C:\\Users\\Public\\Desktop"], correct: 1 },
  { q: "Listda (Sheet) proyekt parametrlariga bog'langan va avtomatik o'zgaradigan matn bloki nima deb ataladi?", options: ["Tekst (Text)", "Shtamp", "Metka (Label)", "Annotatsiya"], correct: 2 },
  { q: "Devor chizishda Space (Probel) tugmasi bosilsa nima sodir bo'ladi?", options: ["Devor o'chib ketadi", "Devor balandligi ikki baravar ortadi", "Devor vitrajga aylanadi", "Devorning joylashish yo'nalishi va tarafi (privyazkasi) qarama-qarshisiga o'zgaradi"], correct: 3 },
  { q: "Devor balandligini qavat balandligiga (Level) bog'lab chizishning asosiy afzalligi nimada?", options: ["Qavat balandligi o'zgarganda devorlar balandligi ham avtomatik moslashib o'zgaradi", "Devor avtomatik bo'yaladi", "Devor materiali o'zgarmaydi", "Devor faqat 3D-da ko'rinadi"], correct: 0 },
  { q: "Revit-da AutoCAD-dagidek \"Sloy\" (Layer) tushunchasi o'rniga elementlar ko'rinishi va grafikasi nima orqali boshqariladi?", options: ["Faqat ranglar palitrasi orqali", "Vidlar va Kategoriyalar (Visibility/Graphics) orqali", "Faqat teksturalar orqali", "Faqat bloklar orqali"], correct: 1 },
  { q: "Model elementlari (devor, eshik, mebel) va Anotatsion elementlar (tekst, o'lcham, chiziq) orasidagi asosiy grafik farq nimada?", options: ["Model elementlari faqat 2D-da, Anotatsion elementlar esa 3D-da ko'rinadi", "Anotatsion elementlar avtomatik ravishda 3D modelga aylanadi", "Model elementlari barcha vidlarda ko'rinadi, Anotatsion elementlar faqat o'zi chizilgan vidda ko'rinadi", "Ularning orasida hech qanday farq yo'q"], correct: 2 }
];

async function initExtendedTables() {
  try {
    await pool.query('ALTER TABLE progress ADD COLUMN IF NOT EXISTS watched_at TIMESTAMPTZ DEFAULT NOW()');
    await pool.query('ALTER TABLE modules ADD COLUMN IF NOT EXISTS description TEXT');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS active_device_id TEXT');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS device_last_seen TIMESTAMPTZ');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS banned_reason TEXT');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS banned_at TIMESTAMPTZ');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_is_banned ON users(is_banned)');
    await pool.query('ALTER TABLE payment_requests ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()');
    await pool.query('ALTER TABLE payment_requests ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ');
    await pool.query('ALTER TABLE payment_requests ADD COLUMN IF NOT EXISTS approved_by BIGINT');
    await pool.query('ALTER TABLE modules ADD COLUMN IF NOT EXISTS course_id INT REFERENCES courses(id) ON DELETE SET NULL');
    await pool.query("ALTER TABLE courses ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Boshqa'");
    await pool.query("ALTER TABLE courses ADD COLUMN IF NOT EXISTS categories TEXT[]");
    await pool.query("ALTER TABLE courses ADD COLUMN IF NOT EXISTS discount_price VARCHAR(100)");
    await pool.query("ALTER TABLE courses ADD COLUMN IF NOT EXISTS discount_until TIMESTAMPTZ");
    await pool.query("ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false");

    // Bosh sahifa yangiliklari (rasm + matn, rejalashtirilgan chop etish vaqti bilan)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        body TEXT NOT NULL,
        image_url TEXT,
        publish_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await pool.query(`
      UPDATE courses
      SET categories = ARRAY[category]
      WHERE (categories IS NULL OR array_length(categories, 1) IS NULL) AND category IS NOT NULL
    `);

    // Eski modullarni (course_id bo'lmagan) birinchi kursga bog'lab qo'yamiz, ma'lumot yo'qolmasligi uchun
    var orphanModulesResult = await pool.query('SELECT COUNT(*)::int AS count FROM modules WHERE course_id IS NULL');
    if (orphanModulesResult.rows[0].count > 0) {
      var firstCourseResult = await pool.query('SELECT id FROM courses ORDER BY order_index ASC, id ASC LIMIT 1');
      if (firstCourseResult.rows[0]) {
        await pool.query('UPDATE modules SET course_id = $1 WHERE course_id IS NULL', [firstCourseResult.rows[0].id]);
        console.log('MIGRATION: eski modullar birinchi kursga bogolandi');
      }
    }
    
    // Sozlamalar jadvali (telefon, telegram link, admin rasm, bepul mini kurs)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS academy_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT
      )
    `);

    // Jonli faollik kuzatish jadvali (user_activity)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_activity (
        user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(30) NOT NULL DEFAULT 'online',
        current_page VARCHAR(100),
        lesson_id INT REFERENCES lessons(id) ON DELETE SET NULL,
        video_progress INT DEFAULT 0,
        video_duration INT DEFAULT 0,
        video_status VARCHAR(20) DEFAULT 'watching',
        module_id INT REFERENCES modules(id) ON DELETE SET NULL,
        quiz_question_current INT DEFAULT 0,
        quiz_question_total INT DEFAULT 0,
        last_heartbeat_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        started_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await pool.query('CREATE INDEX IF NOT EXISTS idx_user_activity_last_heartbeat ON user_activity(last_heartbeat_at)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_user_activity_status ON user_activity(status)');

    // Tarixiy analitika voqealari (activity_events)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activity_events (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        event_type VARCHAR(50) NOT NULL,
        details JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await pool.query('CREATE INDEX IF NOT EXISTS idx_activity_events_type_created ON activity_events(event_type, created_at)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_activity_events_user_id ON activity_events(user_id)');

    // Shablonlar va 3D modellar do'koni (market_products)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS market_products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        software VARCHAR(100) NOT NULL,
        price VARCHAR(100),
        description TEXT,
        preview_url TEXT,
        file_format VARCHAR(50),
        is_available BOOLEAN DEFAULT TRUE,
        order_index INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await pool.query('CREATE INDEX IF NOT EXISTS idx_market_products_available ON market_products(is_available, order_index)');

    // Kurslar jadvali (Talab 3)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        price VARCHAR(100),
        total_modules INT DEFAULT 0,
        total_lessons INT DEFAULT 0,
        release_date VARCHAR(100),
        cover_url TEXT,
        status VARCHAR(50) DEFAULT 'active',
        order_index INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // FAQ savol-javoblar jadvali (Talab 2)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        author VARCHAR(255) DEFAULT 'Admin',
        order_index INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Amaliy vazifa topshiriqlari (Practice)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS practice_submissions (
        id SERIAL PRIMARY KEY,
        lesson_id INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        submission_url TEXT NOT NULL,
        comment TEXT,
        status VARCHAR(30) NOT NULL DEFAULT 'submitted',
        admin_comment TEXT,
        submitted_at TIMESTAMPTZ DEFAULT NOW(),
        reviewed_at TIMESTAMPTZ,
        UNIQUE(lesson_id, user_id)
      )
    `);

    // Admin tomonidan o'quvchiga alohida modulga (ketma-ketlikdan tashqari) beriladigan ruxsat
    await pool.query(`
      CREATE TABLE IF NOT EXISTS module_access_grants (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        module_id INT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
        granted_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, module_id)
      )
    `);

    // Kursni to'liq tugatgani (barcha testlardan o'tgani) haqida bir martalik tabrik xabari yuborilganini kuzatish
    await pool.query(`
      CREATE TABLE IF NOT EXISTS course_completions (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        notified_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, course_id)
      )
    `);

    // Darslar bo'yicha savol-javoblar (Q&A) jadvali
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lesson_questions (
        id SERIAL PRIMARY KEY,
        lesson_id INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        question TEXT NOT NULL,
        answer TEXT,
        status VARCHAR(30) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        answered_at TIMESTAMPTZ,
        answered_by BIGINT
      )
    `);
    await pool.query('CREATE INDEX IF NOT EXISTS idx_lesson_questions_lesson_id ON lesson_questions(lesson_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_lesson_questions_user_id ON lesson_questions(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_lesson_questions_status ON lesson_questions(status)');
    await pool.query('ALTER TABLE lesson_questions ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT false');

    // Kurs mentorlari — har bir kursga biriktirilgan javobgar shaxs, ish kunlari va soatlari bilan
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mentors (
        id SERIAL PRIMARY KEY,
        course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        telegram_username VARCHAR(255),
        work_days TEXT[] NOT NULL DEFAULT '{}',
        work_hours_start VARCHAR(10),
        work_hours_end VARCHAR(10),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await pool.query("ALTER TABLE mentors ADD COLUMN IF NOT EXISTS specialization TEXT[] DEFAULT '{}'");

    // Default kurs mavjudligini tekshiramiz
    var cCount = await pool.query('SELECT COUNT(*)::int AS count FROM courses');
    if (cCount.rows[0].count === 0) {
      await pool.query(`
        INSERT INTO courses (title, subtitle, price, total_modules, total_lessons, release_date, cover_url, status, order_index)
        VALUES (
          'INTPRO — Revit dasturida interyer loyihalash',
          'Interyer Loyihalash & BIM Modellashtirish',
          '1 500 000 so''m',
          11,
          140,
          'Faol kurs',
          '',
          'active',
          1
        )
      `);
    }

    // Default FAQ lar
    var fCount = await pool.query('SELECT COUNT(*)::int AS count FROM faqs');
    if (fCount.rows[0].count === 0) {
      await pool.query(`
        INSERT INTO faqs (question, answer, author, order_index) VALUES
        ('Kursga qanday to''lov qilaman?', 'Chat bo''limidan adminga murojaat qiling yoki Telegram orqali to''g''ridan-to''g''ri bog''laning.', 'Admin', 1),
        ('Kirish huquqi qancha muddatga beriladi?', 'To''lov tasdiqlangandan so''ng darslarga 1 yil (365 kun) davomida to''liq kirish huquqi beriladi.', 'Admin', 2),
        ('Namuna darslarni ko''ra olamanmi?', 'Ha, ba''zi darslar hammaga bepul ochiq — Namuna belgisi bilan ko''rsatilgan.', 'Admin', 3)
      `);
    }

    // Default aloqa sozlamalari
    await pool.query(`
      INSERT INTO academy_settings (key, value) VALUES
      ('contact_telegram', 'texnikuzb'),
      ('contact_phone', '+998900000000'),
      ('admin_photo_url', '/admin.jpg')
      ON CONFLICT (key) DO NOTHING
    `);

    // Eski standart qiymatni ('yoshuzbekk') haqiqiy admin nikiga bir martalik yangilash
    await pool.query(`
      UPDATE academy_settings
      SET value = 'texnikuzb'
      WHERE key = 'contact_telegram' AND (value = 'yoshuzbekk' OR value = '' OR value IS NULL)
    `);

    // Bepul mini-kurs sozlamalari (Talab 3)
    await pool.query(`
      INSERT INTO academy_settings (key, value) VALUES
      ('free_course_title', 'REVIT 0 DAN'),
      ('free_course_subtitle', 'Revit dasturini birinchi marta o‘rganayotganlar uchun bepul mini-kurs'),
      ('free_course_badge', '🎁 6 ta bepul dars'),
      ('free_course_features', '["Revit nima ekanini tushunasiz", "Birinchi loyihani yaratasiz", "Devor, eshik, deraza chizasiz", "Birinchi 3D modelingizni yaratasiz"]'),
      ('free_course_enabled', 'true'),
      ('market_enabled', 'false')
      ON CONFLICT (key) DO NOTHING
    `);

    // Boshlang'ich shablon va modellar (Market Products)
    var pCount = await pool.query('SELECT COUNT(*)::int AS count FROM market_products');
    if (pCount.rows[0].count === 0) {
      await pool.query(`
        INSERT INTO market_products (title, category, software, price, description, preview_url, file_format, order_index)
        VALUES
        ('INTPRO Master Template v2.5', 'Shablon', 'Revit', '450 000 so''m', 'Interyer va arxitektura uchun to''liq sozlangan professional Revit shabloni (Gost standartlari, barcha vidlar, spesifikatsiyalar va materiallar tayyor)', '', 'RTE (Revit 2024)', 1),
        ('Parametrik Oshxona & Mebel Oilalari Paketi', 'BIM Family', 'Revit', '350 000 so''m', '80+ parametrik zamonaviy oshxona shkaflari, jihozlari va furnituralari to''plami', '', 'RFA', 2),
        ('Zamonaviy Mehmonxona (Living Room) Sahna & Render', '3D Model', '3ds Max', '290 000 so''m', 'Corona Render uchun to''liq sozlangan yorug''lik, materiallar va yuqori poligonli modellar sahasi', '', 'MAX, Corona', 3)
      `);
    }

    // 2-Modul uchun test savollarini bir martalik joylash (agar hali test kiritilmagan bo'lsa)
    try {
      var m2Result = await pool.query(`
        SELECT m.id FROM modules m
        JOIN courses c ON c.id = m.course_id
        WHERE m.order_index = 2 AND c.title ILIKE '%revit%'
        ORDER BY m.id ASC
      `);

      if (m2Result.rows.length === 1) {
        var module2Id = m2Result.rows[0].id;
        var existingM2TestCount = await pool.query(
          'SELECT COUNT(*)::int AS c FROM module_tests WHERE module_id = $1',
          [module2Id]
        );

        if (existingM2TestCount.rows[0].c === 0) {
          for (var qi = 0; qi < MODULE2_TEST_SEED.length; qi++) {
            var qItem = MODULE2_TEST_SEED[qi];
            await pool.query(
              'INSERT INTO module_tests (module_id, question, options, correct_index, order_index) VALUES ($1, $2, $3, $4, $5)',
              [module2Id, qItem.q, JSON.stringify(qItem.options), qItem.correct, qi + 1]
            );
          }
          console.log('✅ 2-MODUL TEST SEED: ' + MODULE2_TEST_SEED.length + ' ta savol module_id=' + module2Id + ' ga joylandi');
        }
      } else if (m2Result.rows.length > 1) {
        console.warn('⚠️ 2-MODUL TEST SEED: bir nechta mos modul topildi (' + m2Result.rows.length + ' ta), aniqlik uchun avtomatik joylanmadi');
      } else {
        console.warn('⚠️ 2-MODUL TEST SEED: mos modul topilmadi (order_index=2, Revit kursi)');
      }
    } catch (seedError) {
      console.error('2-MODUL TEST SEED ERROR:', seedError.message);
    }

    console.log('✅ DATABASE AVTO-MIGRATSIYA MUVAFFAQIYATLI YAKUNLANDI');
  } catch (err) {
    console.warn('⚠️ AVTO-MIGRATSIYA OGOHLANTIRISH:', err.message);
  }
}

initExtendedTables().then(unbanAllAdmins);


// ======================================================
// BUNNY STREAM
// ======================================================

function generateBunnyToken(videoId, expiresAt) {
  var securityKey = process.env.BUNNY_TOKEN_AUTH_KEY;
  if (!securityKey) {
    throw new Error('BUNNY_TOKEN_AUTH_KEY topilmadi');
  }
  var hashableString = securityKey + videoId + expiresAt;
  return crypto.createHash('sha256').update(hashableString).digest('hex');
}

function generateBunnyPlayerUrl(libraryId, videoId) {
  var expiresAt = Math.floor(Date.now() / 1000) + 2 * 60 * 60;
  var token = generateBunnyToken(videoId, expiresAt);
  return 'https://iframe.mediadelivery.net/embed/' + libraryId + '/' + videoId + '?token=' + token + '&expires=' + expiresAt;
}

// ======================================================
// YOUTUBE
// ======================================================

function getYouTubeVideoId(url) {
  if (!url) return null;
  try {
    var parsedUrl = new URL(url);
    var hostname = parsedUrl.hostname.toLowerCase();
    if (hostname === 'youtu.be') {
      return parsedUrl.pathname.replace(/^\/+/, '').split('/')[0].trim() || null;
    }
    if (hostname === 'youtube.com' || hostname === 'www.youtube.com' || hostname === 'm.youtube.com') {
      var videoId = parsedUrl.searchParams.get('v');
      if (videoId) return videoId;
      var embedMatch = parsedUrl.pathname.match(/^\/embed\/([^/]+)/);
      if (embedMatch) return embedMatch[1];
      var shortsMatch = parsedUrl.pathname.match(/^\/shorts\/([^/]+)/);
      if (shortsMatch) return shortsMatch[1];
      var liveMatch = parsedUrl.pathname.match(/^\/live\/([^/]+)/);
      if (liveMatch) return liveMatch[1];
    }
    return null;
  } catch (error) {
    console.error('YOUTUBE URL ERROR:', error.message);
    return null;
  }
}

function generateYouTubePlayerUrl(youtubeUrl) {
  var videoId = getYouTubeVideoId(youtubeUrl);
  if (!videoId) return null;
  return 'https://www.youtube.com/embed/' + videoId + '?rel=0&modestbranding=1';
}

// ======================================================
// ACCESS
// ======================================================

function hasAccess(user) {
  if (!user) return false;
  // Asosiy admin har doim barcha darslarga to'liq kirisha oladi
  if (String(user.telegram_id) === String(ADMIN_TELEGRAM_ID)) return true;
  if (!user.access_until) return false;
  return new Date(user.access_until) > new Date();
}

// Hech qachon kirish huquqi berilmagan (hali to'lov qilmagan / yangi) foydalanuvchimi?
// Bunday foydalanuvchiga 1-modul bepul namuna sifatida ochiq bo'ladi.
// Lekin agar admin avval ruxsat berib, keyin bekor qilgan/tugatgan bo'lsa (access_until mavjud, lekin o'tgan),
// bu endi "yangi mehmon" hisoblanmaydi va 1-modul ham yopiladi.
function isNeverPaidUser(user) {
  return !user || !user.access_until;
}

// Bitta hisob — bitta faol qurilma nazorati.
// Agar hisobga boshqa qurilmadan (10 daqiqa ichida faol bo'lgan) kirilgan bo'lsa, video berilmaydi.
var DEVICE_LOCK_MINUTES = 10;

async function checkDeviceLock(user, deviceId) {
  if (!deviceId) return null; // eski frontend versiyasi bilan orqaga moslik uchun bloklanmaydi

  var lastSeen = user.device_last_seen ? new Date(user.device_last_seen) : null;
  var isStale = !lastSeen || (Date.now() - lastSeen.getTime()) > DEVICE_LOCK_MINUTES * 60 * 1000;

  if (user.active_device_id && user.active_device_id !== deviceId && !isStale) {
    return {
      error: 'device_locked',
      message: 'Ushbu hisob hozir boshqa qurilmada faol. Bir hisobdan faqat bitta qurilmada video ko\'rish mumkin. Bir necha daqiqadan so\'ng qayta urinib ko\'ring yoki administrator bilan bog\'laning: @texnikuzb'
    };
  }

  await pool.query(
    'UPDATE users SET active_device_id = $1, device_last_seen = NOW() WHERE id = $2',
    [deviceId, user.id]
  );
  return null;
}

// ======================================================
// GET / CREATE TELEGRAM USER
// ======================================================

async function getOrCreateUser(initData) {
  if (!initData) {
    console.error('GET USER ERROR: initData mavjud emas');
    return null;
  }
  var tgUser = verifyInitData(initData, process.env.BOT_TOKEN);
  if (!tgUser) {
    console.error('GET USER ERROR: Telegram initData notogri');
    return null;
  }
  var result = await pool.query(
    'INSERT INTO users (telegram_id, first_name, last_name, username) VALUES ($1, $2, $3, $4) ON CONFLICT (telegram_id) DO UPDATE SET first_name = CASE WHEN users.first_name IS NULL OR TRIM(users.first_name) = \'\' THEN EXCLUDED.first_name ELSE users.first_name END, last_name = CASE WHEN users.last_name IS NULL OR TRIM(users.last_name) = \'\' THEN EXCLUDED.last_name ELSE users.last_name END, username = EXCLUDED.username RETURNING *',
    [tgUser.id, tgUser.first_name || '', tgUser.last_name || null, tgUser.username || null]
  );
  return result.rows[0];
}

// ======================================================
// ADMIN FUNCTIONS
// ======================================================

async function getAdminByTelegramId(telegramId) {
  var result = await pool.query(
    'SELECT id, telegram_id, first_name, role, created_at FROM admins WHERE telegram_id = $1 LIMIT 1',
    [telegramId]
  );
  return result.rows[0] || null;
}

// Admin (asosiy Super Admin yoki admins jadvalidagi istalgan admin) ekanini tekshirish
async function isAdminTelegramId(telegramId) {
  if (String(telegramId) === String(ADMIN_TELEGRAM_ID)) return true;
  var r = await pool.query('SELECT 1 FROM admins WHERE telegram_id = $1 LIMIT 1', [telegramId]);
  return r.rows.length > 0;
}

// Adminlar hech qachon qora ro'yxatda turmasligi uchun ularni blokdan chiqaradi
async function unbanAllAdmins() {
  try {
    await pool.query(
      "UPDATE users SET is_banned = false, banned_reason = NULL, banned_at = NULL " +
      "WHERE is_banned = true AND (telegram_id::text = $1 OR telegram_id IN (SELECT telegram_id FROM admins))",
      [String(ADMIN_TELEGRAM_ID)]
    );
  } catch (e) {
    console.warn('UNBAN ADMINS WARNING:', e.message);
  }
}

// ======================================================
// ADMIN AUTH MIDDLEWARE
// ======================================================

async function requireAdmin(req, res, next) {
  try {
    var initData = (req.body && req.body.initData) || req.headers['x-telegram-init-data'];
    if (!initData) {
      return res.status(401).json({ error: 'Telegram initData yuborilmagan' });
    }
    var user = await getOrCreateUser(initData);
    if (!user) {
      return res.status(401).json({ error: 'Telegram foydalanuvchisi tekshirilmadi' });
    }
    var telegramId = String(user.telegram_id);
    if (telegramId === String(ADMIN_TELEGRAM_ID)) {
      req.user = user;
      req.admin = {
        id: null,
        telegram_id: telegramId,
        first_name: user.first_name || 'Super Admin',
        role: 'super_admin',
        created_at: null
      };
      console.log('MAIN SUPER ADMIN ACCESS: ' + telegramId);
      return next();
    }
    var admin = await getAdminByTelegramId(user.telegram_id);
    if (!admin) {
      console.warn('ADMIN ACCESS DENIED: ' + telegramId);
      return res.status(403).json({ error: 'Sizda admin huquqi mavjud emas' });
    }
    req.user = user;
    req.admin = admin;
    console.log('ADMIN ACCESS: ' + telegramId + ' | ROLE: ' + admin.role);
    next();
  } catch (error) {
    console.error('ADMIN AUTH ERROR:', error);
    return res.status(500).json({ error: 'Admin tekshirishda server xatosi' });
  }
}

// ======================================================
// SUPER ADMIN AUTH
// ======================================================

async function requireSuperAdmin(req, res, next) {
  try {
    if (!req.admin) {
      return res.status(403).json({ error: 'Admin huquqi kerak' });
    }
    var currentTelegramId = String(req.admin.telegram_id);
    var mainAdminId = String(ADMIN_TELEGRAM_ID);
    var isMainAdmin = currentTelegramId === mainAdminId;
    var isSuperAdmin = String(req.admin.role) === 'super_admin';
    if (!isMainAdmin && !isSuperAdmin) {
      console.warn('SUPER ADMIN ACCESS DENIED: ' + currentTelegramId);
      return res.status(403).json({ error: 'Faqat super admin bu amalni bajarishi mumkin' });
    }
    console.log('SUPER ADMIN ACCESS: ' + currentTelegramId);
    next();
  } catch (error) {
    console.error('SUPER ADMIN AUTH ERROR:', error);
    return res.status(500).json({ error: 'Super admin tekshirishda xato' });
  }
}

// ======================================================
// REGISTER
// ======================================================

app.post('/api/register', async function (req, res) {
  try {
    var initData = req.body && req.body.initData;
    var firstName = String(req.body && req.body.first_name || '').trim();
    var lastName = String(req.body && req.body.last_name || '').trim();
    var phone = String(req.body && req.body.phone || '').trim();
    if (!initData) return res.status(401).json({ error: 'Telegram initData yuborilmagan' });
    if (!firstName) return res.status(400).json({ error: 'Ismni kiriting' });
    if (!lastName) return res.status(400).json({ error: 'Familiyani kiriting' });
    if (!phone) return res.status(400).json({ error: 'Telefon raqamini kiriting' });

    var tgUser = verifyInitData(initData, process.env.BOT_TOKEN);
    if (!tgUser) return res.status(401).json({ error: 'Telegram malumotlari notogri' });

    var normalizedPhone = phone.replace(/[^\d+]/g, '').trim();
    if (normalizedPhone.length < 9) {
      return res.status(400).json({ error: 'Telefon raqamini togri kiriting' });
    }

    var result = await pool.query(
      'INSERT INTO users (telegram_id, first_name, last_name, phone, username) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (telegram_id) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, phone = EXCLUDED.phone, username = EXCLUDED.username RETURNING *',
      [tgUser.id, firstName, lastName, normalizedPhone, tgUser.username || null]
    );

    var user = result.rows[0];
    console.log('USER REGISTERED: ' + user.telegram_id + ' ' + user.first_name + ' ' + user.last_name);

    return res.json({
      ok: true, registered: true,
      message: 'Royxatdan otish muvaffaqiyatli yakunlandi',
      user: {
        id: user.id, telegram_id: user.telegram_id.toString(),
        first_name: user.first_name || '', last_name: user.last_name || '',
        phone: user.phone || '', username: user.username || null,
        has_access: hasAccess(user), access_until: user.access_until || null
      }
    });
  } catch (error) {
    console.error('REGISTRATION ERROR:', error);
    return res.status(500).json({ error: 'Royxatdan otishda server xatosi' });
  }
});

// ======================================================
// AUTH
// ======================================================

app.post('/api/auth', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Telegram foydalanuvchisi tekshirilmadi' });

    if (user.is_banned) {
      return res.status(403).json({
        error: 'banned',
        is_banned: true,
        banned_reason: user.banned_reason || 'Qoidabuzarlik sababli hisobingiz bloklangan',
        message: 'Sizning hisobingiz platforma qoidalarini buzganlik sababli cheklandi. Administrator bilan bog\'laning: @texnikuzb'
      });
    }

    var admin = await getAdminByTelegramId(user.telegram_id);
    var isMainAdmin = String(user.telegram_id) === String(ADMIN_TELEGRAM_ID);

    return res.json({
      telegram_id: user.telegram_id.toString(),
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
      username: user.username || '',
      registered: Boolean(user.first_name && user.last_name && user.phone),
      has_access: hasAccess(user),
      access_until: user.access_until || null,
      is_banned: Boolean(user.is_banned),
      is_admin: Boolean(admin || isMainAdmin),
      admin_role: isMainAdmin ? 'super_admin' : (admin ? admin.role : null)
    });
  } catch (error) {
    console.error('AUTH ERROR:', error);
    return res.status(500).json({ error: 'Server xatosi' });
  }
});

// ======================================================
// PROFILE UPDATE
// ======================================================

app.post('/api/profile/update', async function (req, res) {
  try {
    var initData = req.body && req.body.initData;
    if (!initData) return res.status(401).json({ error: 'Telegram initData yuborilmagan' });

    var tgUser = verifyInitData(initData, process.env.BOT_TOKEN);
    if (!tgUser) return res.status(401).json({ error: 'Telegram malumotlari notogri' });

    var firstName = String(req.body.first_name || '').trim();
    var lastName = String(req.body.last_name || '').trim();
    var phone = String(req.body.phone || '').trim();

    if (!firstName) return res.status(400).json({ error: 'Ismni kiriting' });
    if (!lastName) return res.status(400).json({ error: 'Familiyani kiriting' });
    if (!phone) return res.status(400).json({ error: 'Telefon raqamini kiriting' });

    var normalizedPhone = phone.replace(/[^\d+]/g, '').trim();
    if (normalizedPhone.length < 9) {
      return res.status(400).json({ error: 'Telefon raqamini togri kiriting' });
    }

    var result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, phone = $3 WHERE telegram_id = $4 RETURNING *',
      [firstName, lastName, normalizedPhone, tgUser.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
    }

    var user = result.rows[0];

    // Admin jadvalidagi ismni ham yangilaymiz
    await pool.query(
      'UPDATE admins SET first_name = $1 WHERE telegram_id = $2',
      [firstName, tgUser.id]
    );

    console.log('PROFILE UPDATED: ' + user.telegram_id);

    return res.json({
      ok: true,
      user: {
        id: user.id, telegram_id: user.telegram_id.toString(),
        first_name: user.first_name || '', last_name: user.last_name || '',
        phone: user.phone || '', username: user.username || null,
        has_access: hasAccess(user), access_until: user.access_until || null
      }
    });
  } catch (error) {
    console.error('PROFILE UPDATE ERROR:', error);
    return res.status(500).json({ error: 'Profilni yangilashda xato' });
  }
});

// ======================================================
// CONTENT
// ======================================================

app.post('/api/content', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Telegram foydalanuvchisi tekshirilmadi' });

    if (user.is_banned) {
      return res.status(403).json({
        error: 'banned',
        is_banned: true,
        banned_reason: user.banned_reason || 'Qoidabuzarlik sababli hisobingiz bloklangan',
        message: 'Sizning hisobingiz platforma qoidalarini buzganlik sababli cheklandi. Administrator bilan bog\'laning: @texnikuzb'
      });
    }

    var userHasAccess = hasAccess(user);

    var modulesResult = await pool.query(
      'SELECT id, title, order_index FROM modules ORDER BY order_index ASC, id ASC'
    );
    var modules = modulesResult.rows;

    var lessonsResult = await pool.query(
      'SELECT id, module_id, title, order_index, youtube_url, task_text, is_free FROM lessons ORDER BY module_id ASC, order_index ASC, id ASC'
    );
    var lessons = lessonsResult.rows;

    var progressResult = await pool.query(
      'SELECT lesson_id FROM progress WHERE user_id = $1 AND watched = true',
      [user.id]
    );
    var watchedSet = new Set(progressResult.rows.map(function (r) { return r.lesson_id; }));

    var firstModuleId = modules.length ? modules[0].id : null;

    var data = modules.map(function (mod) {
      var isFirstModule = mod.id === firstModuleId;
      var moduleUnlocked = isFirstModule || userHasAccess;
      var moduleLessons = lessons.filter(function (l) { return l.module_id === mod.id; });
      var watchedCount = 0;

      var mappedLessons = moduleLessons.map(function (lesson) {
        var available = Boolean(lesson.is_free) || moduleUnlocked;
        var watched = watchedSet.has(lesson.id);
        if (watched) watchedCount++;
        return {
          id: lesson.id, title: lesson.title, is_free: Boolean(lesson.is_free),
          task_text: lesson.task_text, available: available, watched: watched
        };
      });

      return {
        id: mod.id, title: mod.title, order_index: mod.order_index,
        unlocked: moduleUnlocked, lessons: mappedLessons,
        watched_count: watchedCount, total_count: moduleLessons.length
      };
    });

    var lastLesson = null;
    try {
      var lastLessonResult = await pool.query(
        'SELECT p.lesson_id, l.title AS lesson_title, l.order_index AS lesson_order, m.id AS module_id, m.title AS module_title, c.id AS course_id, c.title AS course_title FROM progress p JOIN lessons l ON l.id = p.lesson_id JOIN modules m ON m.id = l.module_id LEFT JOIN courses c ON c.id = m.course_id WHERE p.user_id = $1 AND p.watched = true ORDER BY p.id DESC LIMIT 1',
        [user.id]
      );
      lastLesson = lastLessonResult.rows[0] || null;
    } catch (llError) {
      console.warn('LAST LESSON QUERY WARNING:', llError.message);
    }

    var admin = await getAdminByTelegramId(user.telegram_id);
    var isMainAdmin = String(user.telegram_id) === String(ADMIN_TELEGRAM_ID);
    var isAdminUser = Boolean(admin || isMainAdmin);

    // Kurslar ro'yxati (Talab 3)
    var courses = [];
    try {
      var coursesQuery = isAdminUser
        ? 'SELECT * FROM courses ORDER BY order_index ASC, id ASC'
        : "SELECT * FROM courses WHERE status = 'active' ORDER BY order_index ASC, id ASC";
      var coursesRes = await pool.query(coursesQuery);
      courses = coursesRes.rows.map(function (c) {
        var isDiscountActive = Boolean(c.discount_price) && c.discount_until && new Date(c.discount_until) > new Date();
        return Object.assign({}, c, {
          is_discount_active: isDiscountActive,
          original_price: c.price,
          display_price: isDiscountActive ? c.discount_price : c.price
        });
      });
    } catch (cErr) {
      console.warn('COURSES QUERY WARNING:', cErr.message);
    }

    // FAQ savol-javoblar (Talab 2)
    var faqs = [];
    try {
      var faqsRes = await pool.query('SELECT * FROM faqs ORDER BY order_index ASC, id ASC');
      faqs = faqsRes.rows;
    } catch (fErr) {
      console.warn('FAQS QUERY WARNING:', fErr.message);
    }

    // Bosh sahifa yangiliklari — faqat chop etish vaqti kelganlari
    var announcements = [];
    try {
      var annRes = await pool.query(
        'SELECT id, title, body, image_url, publish_at FROM announcements WHERE publish_at <= NOW() ORDER BY publish_at DESC LIMIT 10'
      );
      announcements = annRes.rows;
    } catch (aErr) {
      console.warn('ANNOUNCEMENTS QUERY WARNING:', aErr.message);
    }

    // Shablon va modellar (Marketplace)
    var products = [];
    try {
      var prodRes = await pool.query(
        "SELECT id, title, category, software, price, description, preview_url, file_format, order_index FROM market_products WHERE is_available = true ORDER BY order_index ASC, id ASC"
      );
      products = prodRes.rows;
    } catch (pErr) {
      console.warn('PRODUCTS QUERY WARNING:', pErr.message);
    }

    // Akademiya sozlamalari (aloqa, admin rasmi, bepul mini-kurs) — key/value obyektga yig'iladi
    var settings = {};
    try {
      var setRes = await pool.query('SELECT key, value FROM academy_settings');
      setRes.rows.forEach(function (r) { settings[r.key] = r.value; });
    } catch (sErr) {
      console.warn('SETTINGS QUERY WARNING:', sErr.message);
    }

    // Shablon & 3D modellar bo'limi qoralamada bo'lsa, o'quvchilarga umuman yuborilmaydi
    if (settings.market_enabled !== 'true') {
      products = [];
    }

    var freeCourseFeatures = [];
    try {
      if (settings.free_course_features) {
        freeCourseFeatures = JSON.parse(settings.free_course_features);
      }
    } catch (e) {
      freeCourseFeatures = [
        "Revit nima ekanini tushunasiz",
        "Birinchi loyihani yaratasiz",
        "Devor, eshik, deraza chizasiz",
        "Birinchi 3D modelingizni yaratasiz"
      ];
    }

    var freeCourse = {
      title: settings.free_course_title || 'REVIT 0 DAN',
      subtitle: settings.free_course_subtitle || 'Revit dasturini birinchi marta o‘rganayotganlar uchun bepul mini-kurs',
      badge: settings.free_course_badge || '🎁 6 ta bepul dars',
      features: freeCourseFeatures,
      enabled: settings.free_course_enabled !== 'false'
    };

    return res.json({
      has_access: userHasAccess, access_until: user.access_until || null,
      telegram_id: user.telegram_id.toString(),
      first_name: user.first_name || '', last_name: user.last_name || '',
      phone: user.phone || '', username: user.username || '',
      registered: Boolean(user.first_name && user.last_name && user.phone),
      is_banned: Boolean(user.is_banned),
      modules: data,
      last_lesson: lastLesson,
      courses: courses,
      faqs: faqs,
      announcements: announcements,
      settings: settings,
      products: products,
      free_course: freeCourse
    });
  } catch (error) {
    console.error('CONTENT ERROR:', error);
    return res.status(500).json({ error: 'Server xatosi: ' + error.message });
  }
});

// ======================================================
// COURSE MODULES (bitta kursga tegishli modul/darslar)
// ======================================================

app.post('/api/course/:id/modules', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Telegram foydalanuvchisi tekshirilmadi' });

    var courseId = Number(req.params.id);
    var courseResult = await pool.query('SELECT * FROM courses WHERE id = $1 LIMIT 1', [courseId]);
    var course = courseResult.rows[0];
    if (!course) return res.status(404).json({ error: 'Kurs topilmadi' });

    var userHasAccess = hasAccess(user);
    var isMainAdminUser = String(user.telegram_id) === String(ADMIN_TELEGRAM_ID);
    var adminUser = await getAdminByTelegramId(user.telegram_id);
    var isAdmin = Boolean(isMainAdminUser || adminUser);

    if (course.status !== 'active' && !isAdmin) {
      return res.status(403).json({ error: 'Ushbu kurs hali sotuvga chiqmagan yoki tayyorlanmoqda' });
    }

    var modulesResult = await pool.query(
      'SELECT id, title, order_index FROM modules WHERE course_id = $1 ORDER BY order_index ASC, id ASC',
      [courseId]
    );
    var modules = modulesResult.rows;
    var moduleIds = modules.map(function (m) { return m.id; });

    var lessons = [];
    if (moduleIds.length) {
      var lessonsResult = await pool.query(
        'SELECT id, module_id, title, order_index, youtube_url, task_text, is_free FROM lessons WHERE module_id = ANY($1) ORDER BY order_index ASC, id ASC',
        [moduleIds]
      );
      lessons = lessonsResult.rows;
    }

    var progressResult = await pool.query(
      'SELECT lesson_id FROM progress WHERE user_id = $1 AND watched = true',
      [user.id]
    );
    var watchedSet = new Set(progressResult.rows.map(function (r) { return r.lesson_id; }));

    var grantedModuleIds = new Set();
    if (moduleIds.length) {
      var grantsResult = await pool.query(
        'SELECT module_id FROM module_access_grants WHERE user_id = $1 AND module_id = ANY($2)',
        [user.id, moduleIds]
      );
      grantsResult.rows.forEach(function (r) { grantedModuleIds.add(r.module_id); });
    }

    // Modul testlaridan o'tish holati: keyingi modulga o'tish uchun oldingi modul testidan (agar mavjud bo'lsa) 65%+ ball kerak
    var passedModulesSet = new Set();
    var modulesWithTestsSet = new Set();
    var retakeAvailableAtMap = {};
    if (moduleIds.length) {
      var testResultsResult = await pool.query(
        'SELECT module_id, passed, attempted_at FROM module_results WHERE user_id = $1 AND module_id = ANY($2)',
        [user.id, moduleIds]
      );
      testResultsResult.rows.forEach(function (r) {
        if (r.passed) {
          passedModulesSet.add(r.module_id);
          var retakeDate = new Date(new Date(r.attempted_at).getTime() + 15 * 24 * 60 * 60 * 1000);
          retakeAvailableAtMap[r.module_id] = retakeDate;
        }
      });

      var modulesWithTestsResult = await pool.query(
        'SELECT DISTINCT module_id FROM module_tests WHERE module_id = ANY($1)',
        [moduleIds]
      );
      modulesWithTestsResult.rows.forEach(function (r) { modulesWithTestsSet.add(r.module_id); });
    }

    var firstModuleId = modules.length ? modules[0].id : null;

    // Kurs bo'yicha darslarni modul tartibida "tekislab" chiqamiz — ketma-ket ochilish shu tartibga asoslanadi
    var flatLessons = [];
    modules.forEach(function (mod) {
      lessons.filter(function (l) { return l.module_id === mod.id; }).forEach(function (l) {
        flatLessons.push(l);
      });
    });

    // Har bir darsning "ketma-ketlikda ochiqmi" holatini hisoblaymiz:
    // birinchi dars har doim ochiq, keyingisi — oldingisi ko'rilgandan keyingina ochiladi;
    // modul chegarasidan o'tishda esa oldingi modul testi (bo'lsa) 65%+ o'tilgan bo'lishi shart
    var sequentialUnlockedSet = new Set();
    var chainOpen = true;
    var prevModuleId = null;
    flatLessons.forEach(function (l) {
      if (chainOpen && prevModuleId !== null && l.module_id !== prevModuleId) {
        if (modulesWithTestsSet.has(prevModuleId) && !passedModulesSet.has(prevModuleId)) {
          chainOpen = false;
        }
      }
      if (chainOpen) {
        sequentialUnlockedSet.add(l.id);
        if (!watchedSet.has(l.id)) chainOpen = false;
      }
      prevModuleId = l.module_id;
    });

    var data = modules.map(function (mod) {
      var isFirstModule = mod.id === firstModuleId;
      var isGranted = grantedModuleIds.has(mod.id);
      var moduleUnlocked = (isFirstModule && isNeverPaidUser(user)) || userHasAccess || isGranted || isMainAdminUser;
      var moduleLessons = lessons.filter(function (l) { return l.module_id === mod.id; });
      var watchedCount = 0;

      var mappedLessons = moduleLessons.map(function (lesson) {
        var available = Boolean(lesson.is_free) || isMainAdminUser || isGranted ||
          (isNeverPaidUser(user) && isFirstModule) ||
          (userHasAccess && sequentialUnlockedSet.has(lesson.id));
        var watched = watchedSet.has(lesson.id);
        if (watched) watchedCount++;
        return {
          id: lesson.id, title: lesson.title, is_free: Boolean(lesson.is_free),
          task_text: lesson.task_text, available: available, watched: watched
        };
      });

      return {
        id: mod.id, title: mod.title, order_index: mod.order_index,
        unlocked: moduleUnlocked, lessons: mappedLessons,
        watched_count: watchedCount, total_count: moduleLessons.length,
        has_test: modulesWithTestsSet.has(mod.id), test_passed: passedModulesSet.has(mod.id),
        retake_available_at: retakeAvailableAtMap[mod.id] || null
      };
    });

    return res.json({ ok: true, course: course, modules: data });
  } catch (error) {
    console.error('COURSE MODULES ERROR:', error);
    return res.status(500).json({ error: 'Kurs modullarini olishda xato' });
  }
});

// ======================================================
// LESSON
// ======================================================

app.post('/api/lesson/:id', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Telegram foydalanuvchisi tekshirilmadi' });

    if (user.is_banned) {
      return res.status(403).json({
        error: 'banned',
        is_banned: true,
        message: 'Sizning hisobingiz qoidabuzarlik sababli cheklandi'
      });
    }

    var lessonResult = await pool.query(
      'SELECT id, module_id, title, order_index, youtube_url, task_text, is_free, bunny_video_id, warning_text FROM lessons WHERE id = $1 LIMIT 1',
      [req.params.id]
    );
    var lesson = lessonResult.rows[0];
    if (!lesson) return res.status(404).json({ error: 'Dars topilmadi' });

    try {
      await pool.query(
        "INSERT INTO activity_events (user_id, event_type, details, created_at) VALUES ($1, 'lesson_view', $2, NOW())",
        [user.id, JSON.stringify({ lesson_id: lesson.id, title: lesson.title })]
      );
    } catch (aeErr) {}

    var moduleResult = await pool.query(
      'SELECT id, title, order_index, course_id FROM modules WHERE id = $1 LIMIT 1',
      [lesson.module_id]
    );
    var mod = moduleResult.rows[0];
    if (!mod) return res.status(404).json({ error: 'Darsga tegishli modul topilmadi' });

    var userHasAccess = hasAccess(user);
    var isMainAdminUser = String(user.telegram_id) === String(ADMIN_TELEGRAM_ID);

    var firstModuleResult = await pool.query(
      'SELECT id FROM modules WHERE course_id = $1 ORDER BY order_index ASC, id ASC LIMIT 1',
      [mod.course_id]
    );
    var firstModule = firstModuleResult.rows[0];
    var isFirstModule = firstModule && Number(firstModule.id) === Number(mod.id);

    var isGranted = false;
    try {
      var grantCheck = await pool.query(
        'SELECT 1 FROM module_access_grants WHERE user_id = $1 AND module_id = $2 LIMIT 1',
        [user.id, mod.id]
      );
      isGranted = grantCheck.rows.length > 0;
    } catch (grantError) {
      console.error('MODULE GRANT CHECK ERROR:', grantError);
    }

    var lessonAvailable = Boolean(lesson.is_free) || isMainAdminUser || isGranted || (isNeverPaidUser(user) && isFirstModule);

    if (!lessonAvailable && userHasAccess) {
      // Ketma-ket ochilish tekshiruvi: shu kursdagi barcha darslarni tartib bilan tekshiramiz
      var courseModulesResult = await pool.query(
        'SELECT id FROM modules WHERE course_id = $1 ORDER BY order_index ASC, id ASC',
        [mod.course_id]
      );
      var courseModuleIds = courseModulesResult.rows.map(function (r) { return r.id; });

      var courseLessonsResult = await pool.query(
        'SELECT id, module_id FROM lessons WHERE module_id = ANY($1) ORDER BY order_index ASC, id ASC',
        [courseModuleIds]
      );
      var flatLessonsForCheck = [];
      courseModuleIds.forEach(function (mid) {
        courseLessonsResult.rows.filter(function (l) { return l.module_id === mid; }).forEach(function (l) {
          flatLessonsForCheck.push(l);
        });
      });

      var watchedForCheckResult = await pool.query(
        'SELECT lesson_id FROM progress WHERE user_id = $1 AND watched = true',
        [user.id]
      );
      var watchedForCheckSet = new Set(watchedForCheckResult.rows.map(function (r) { return r.lesson_id; }));

      var passedModulesForCheckSet = new Set();
      var modulesWithTestsForCheckSet = new Set();
      if (courseModuleIds.length) {
        var testResultsForCheckResult = await pool.query(
          'SELECT module_id, passed FROM module_results WHERE user_id = $1 AND module_id = ANY($2)',
          [user.id, courseModuleIds]
        );
        testResultsForCheckResult.rows.forEach(function (r) { if (r.passed) passedModulesForCheckSet.add(r.module_id); });

        var modulesWithTestsForCheckResult = await pool.query(
          'SELECT DISTINCT module_id FROM module_tests WHERE module_id = ANY($1)',
          [courseModuleIds]
        );
        modulesWithTestsForCheckResult.rows.forEach(function (r) { modulesWithTestsForCheckSet.add(r.module_id); });
      }

      var chainOpenForCheck = true;
      var prevModuleIdForCheck = null;
      for (var i = 0; i < flatLessonsForCheck.length; i++) {
        var l = flatLessonsForCheck[i];
        if (!chainOpenForCheck) break;
        if (prevModuleIdForCheck !== null && l.module_id !== prevModuleIdForCheck) {
          if (modulesWithTestsForCheckSet.has(prevModuleIdForCheck) && !passedModulesForCheckSet.has(prevModuleIdForCheck)) {
            chainOpenForCheck = false;
            break;
          }
        }
        if (Number(l.id) === Number(lesson.id)) { lessonAvailable = true; break; }
        if (!watchedForCheckSet.has(l.id)) { chainOpenForCheck = false; }
        prevModuleIdForCheck = l.module_id;
      }
    }

    if (!lessonAvailable) {
      return res.status(403).json({ error: 'locked', message: 'Bu dars hali yopiq. Avvalgi darslarni ketma-ket tugatishingiz kerak, yoki kursga kirish uchun tolov qilishingiz kerak.' });
    }

    // Bitta hisob — bitta qurilma nazorati (faqat haqiqiy to'lovchi o'quvchilar uchun, admin bundan mustasno)
    if (userHasAccess && !isMainAdminUser) {
      var deviceLockResult = await checkDeviceLock(user, req.body.device_id);
      if (deviceLockResult) {
        return res.status(403).json(deviceLockResult);
      }
    }

    var files = [];
    try {
      var filesResult = await pool.query(
        'SELECT id, file_name, file_url FROM lesson_files WHERE lesson_id = $1 ORDER BY id ASC',
        [lesson.id]
      );
      files = filesResult.rows;
    } catch (fileError) {
      console.error('LESSON FILES ERROR:', fileError);
    }

    var mySubmission = null;
    try {
      var submissionResult = await pool.query(
        'SELECT id, submission_url, comment, status, admin_comment, submitted_at, reviewed_at FROM practice_submissions WHERE lesson_id = $1 AND user_id = $2 LIMIT 1',
        [lesson.id, user.id]
      );
      mySubmission = submissionResult.rows[0] || null;
    } catch (submissionError) {
      console.error('MY SUBMISSION ERROR:', submissionError);
    }

    var isWatched = false;
    try {
      var watchedResult = await pool.query(
        'SELECT watched FROM progress WHERE lesson_id = $1 AND user_id = $2 LIMIT 1',
        [lesson.id, user.id]
      );
      isWatched = Boolean(watchedResult.rows[0] && watchedResult.rows[0].watched);
    } catch (watchedError) {
      console.error('LESSON WATCHED CHECK ERROR:', watchedError);
    }

    try {
      await pool.query(
        'INSERT INTO progress (user_id, lesson_id, watched) VALUES ($1, $2, true) ON CONFLICT (user_id, lesson_id) DO UPDATE SET watched = true',
        [user.id, lesson.id]
      );
    } catch (progressError) {
      console.error('PROGRESS ERROR:', progressError.message);
    }

    var defaultWarning = 'Ushbu darslik va undagi materiallar sizga faqat shaxsiy foydalanishingiz uchun berilgan OMONATdir.\n\nDarsliklarni boshqa shaxslarga yuborish, tarqatish, nusxalash, sotish yoki internetga joylashtirish qatiyan taqiqlanadi.\n\nIltimos, sizga berilgan ushbu omonatni asrang va boshqalarga tarqatmang.';
    var warningText = (lesson.warning_text && lesson.warning_text.trim()) ? lesson.warning_text : defaultWarning;

    var questions = [];
    var canAskQuestion = false;
    try {
      var adminForQA = await getAdminByTelegramId(user.telegram_id);
      var isAdminForQA = Boolean(adminForQA || isMainAdminUser);
      canAskQuestion = Boolean(userHasAccess || isAdminForQA);

      var qRes;
      if (isAdminForQA) {
        qRes = await pool.query(
          `SELECT lq.id, lq.lesson_id, lq.user_id, lq.question, lq.answer, lq.status, lq.is_public, lq.created_at, lq.answered_at,
                  u.first_name, u.last_name, u.username,
                  (lq.user_id = $2) AS is_mine
           FROM lesson_questions lq
           JOIN users u ON u.id = lq.user_id
           WHERE lq.lesson_id = $1
           ORDER BY lq.created_at DESC`,
          [lesson.id, user.id]
        );
      } else if (canAskQuestion) {
        qRes = await pool.query(
          `SELECT lq.id, lq.lesson_id, lq.user_id, lq.question, lq.answer, lq.status, lq.is_public, lq.created_at, lq.answered_at,
                  u.first_name, u.last_name, u.username,
                  (lq.user_id = $2) AS is_mine
           FROM lesson_questions lq
           JOIN users u ON u.id = lq.user_id
           WHERE lq.lesson_id = $1 AND (lq.user_id = $2 OR lq.is_public = true)
           ORDER BY lq.created_at DESC`,
          [lesson.id, user.id]
        );
      } else {
        qRes = { rows: [] };
      }
      questions = qRes.rows;
    } catch (qErr) {
      console.error('LESSON QUESTIONS QUERY ERROR:', qErr);
    }

    var youtubePlayerUrl = generateYouTubePlayerUrl(lesson.youtube_url);

    if (youtubePlayerUrl) {
      return res.json({
        id: lesson.id, title: lesson.title, video_type: 'youtube',
        youtube_url: lesson.youtube_url, youtube_player_url: youtubePlayerUrl,
        task_text: lesson.task_text || '', warning_text: warningText, files: files, my_submission: mySubmission, watched: isWatched,
        questions: questions, can_ask: canAskQuestion
      });
    }

    if (lesson.bunny_video_id && process.env.BUNNY_LIBRARY_ID) {
      var bunnyPlayerUrl = generateBunnyPlayerUrl(process.env.BUNNY_LIBRARY_ID, lesson.bunny_video_id);
      return res.json({
        id: lesson.id, title: lesson.title, video_type: 'bunny',
        bunny_video_id: lesson.bunny_video_id, bunny_library_id: process.env.BUNNY_LIBRARY_ID,
        bunny_player_url: bunnyPlayerUrl,
        task_text: lesson.task_text || '', warning_text: warningText, files: files, my_submission: mySubmission, watched: isWatched,
        questions: questions, can_ask: canAskQuestion
      });
    }

    return res.json({
      id: lesson.id, title: lesson.title, video_type: null,
      task_text: lesson.task_text || '', warning_text: warningText, files: files, my_submission: mySubmission, watched: isWatched,
      questions: questions, can_ask: canAskQuestion
    });
  } catch (error) {
    console.error('LESSON ERROR:', error);
    return res.status(500).json({ error: 'Darsni ochishda server xatosi' });
  }
});

// ======================================================
// PRACTICE — VAZIFA TOPSHIRISH
// ======================================================

app.post('/api/practice/:lessonId/submit', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Telegram foydalanuvchisi tekshirilmadi' });

    var lessonId = Number(req.params.lessonId);
    var submissionUrl = String(req.body.submission_url || '').trim();
    var comment = String(req.body.comment || '').trim();

    if (!submissionUrl) return res.status(400).json({ error: 'Ishingiz linki kiritilishi shart' });

    var lessonResult = await pool.query('SELECT id, title FROM lessons WHERE id = $1 LIMIT 1', [lessonId]);
    var lesson = lessonResult.rows[0];
    if (!lesson) return res.status(404).json({ error: 'Dars topilmadi' });

    var result = await pool.query(
      `INSERT INTO practice_submissions (lesson_id, user_id, submission_url, comment, status, admin_comment, submitted_at, reviewed_at)
       VALUES ($1, $2, $3, $4, 'submitted', NULL, NOW(), NULL)
       ON CONFLICT (lesson_id, user_id)
       DO UPDATE SET submission_url = $3, comment = $4, status = 'submitted', admin_comment = NULL, submitted_at = NOW(), reviewed_at = NULL
       RETURNING *`,
      [lessonId, user.id, submissionUrl, comment || null]
    );

    var studentName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || ('ID ' + user.telegram_id);
    await notifyAdmin(
      `📥 Yangi vazifa topshirildi!\n\n👤 ${studentName}\n📚 Dars: ${lesson.title}\n🔗 ${submissionUrl}${comment ? `\n💬 ${comment}` : ''}`,
      user.telegram_id.toString()
    );

    return res.json({ ok: true, message: 'Vazifa muvaffaqiyatli yuborildi', submission: result.rows[0] });
  } catch (error) {
    console.error('PRACTICE SUBMIT ERROR:', error);
    return res.status(500).json({ error: 'Vazifani yuborishda xatolik' });
  }
});

app.post('/api/admin/practice/submissions', requireAdmin, async function (req, res) {
  try {
    var statusFilter = req.body.status;
    var query = `
      SELECT ps.id, ps.lesson_id, ps.submission_url, ps.comment, ps.status, ps.admin_comment, ps.submitted_at, ps.reviewed_at,
             l.title AS lesson_title, u.telegram_id, u.first_name, u.last_name, u.username
      FROM practice_submissions ps
      JOIN lessons l ON l.id = ps.lesson_id
      JOIN users u ON u.id = ps.user_id
    `;
    var params = [];
    if (statusFilter) {
      query += ' WHERE ps.status = $1';
      params.push(statusFilter);
    }
    query += ' ORDER BY ps.submitted_at DESC';

    var result = await pool.query(query, params);
    return res.json({ ok: true, submissions: result.rows });
  } catch (error) {
    console.error('ADMIN PRACTICE LIST ERROR:', error);
    return res.status(500).json({ error: 'Vazifalarni olishda xatolik' });
  }
});

app.post('/api/admin/practice/:id/review', requireAdmin, async function (req, res) {
  try {
    var status = String(req.body.status || '').trim();
    var adminComment = String(req.body.admin_comment || '').trim();

    if (!['approved', 'needs_revision'].includes(status)) {
      return res.status(400).json({ error: 'Status notogri (approved yoki needs_revision bolishi kerak)' });
    }

    var result = await pool.query(
      `UPDATE practice_submissions SET status = $1, admin_comment = $2, reviewed_at = NOW()
       WHERE id = $3 RETURNING *`,
      [status, adminComment || null, Number(req.params.id)]
    );
    var submission = result.rows[0];
    if (!submission) return res.status(404).json({ error: 'Topshiriq topilmadi' });

    var lessonResult = await pool.query('SELECT title FROM lessons WHERE id = $1', [submission.lesson_id]);
    var userResult = await pool.query('SELECT telegram_id FROM users WHERE id = $1', [submission.user_id]);
    var lessonTitle = lessonResult.rows[0] ? lessonResult.rows[0].title : 'Dars';
    var telegramId = userResult.rows[0] ? userResult.rows[0].telegram_id : null;

    if (telegramId) {
      var statusText = status === 'approved' ? '✅ Vazifangiz qabul qilindi!' : '🔁 Vazifangiz qayta ko\'rib chiqish uchun qaytarildi.';
      var msg = `${statusText}\n\n📚 Dars: ${lessonTitle}${adminComment ? `\n💬 Izoh: ${adminComment}` : ''}`;
      try {
        await botModule.bot.telegram.sendMessage(telegramId, msg);
      } catch (notifyError) {
        console.warn('Practice review xabari yuborilmadi:', notifyError.message);
      }
    }

    return res.json({ ok: true, message: 'Baholandi', submission: submission });
  } catch (error) {
    console.error('ADMIN PRACTICE REVIEW ERROR:', error);
    return res.status(500).json({ error: 'Baholashda xatolik' });
  }
});

// ======================================================
// LESSON Q&A (SAVOL-JAVOBLAR TIZIMI)
// ======================================================

// O'quvchi dars bo'yicha savol yuborishi
app.post('/api/lesson/:id/question', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Telegram foydalanuvchisi tekshirilmadi' });

    var isMainAdminForAsk = String(user.telegram_id) === String(ADMIN_TELEGRAM_ID);
    var adminCheckForAsk = await getAdminByTelegramId(user.telegram_id);
    if (!hasAccess(user) && !isMainAdminForAsk && !adminCheckForAsk) {
      return res.status(403).json({ error: 'Savol berish faqat kursga toʻlov qilib, kirish huquqi berilgan oʻquvchilar uchun ochiq.' });
    }

    var lessonId = Number(req.params.id);
    var questionText = String(req.body.question || '').trim();
    if (!questionText) {
      return res.status(400).json({ error: 'Savol matni kiritilishi shart' });
    }

    var lessonRes = await pool.query(
      `SELECT l.id, l.title AS lesson_title, m.title AS module_title, c.title AS course_title
       FROM lessons l
       JOIN modules m ON m.id = l.module_id
       LEFT JOIN courses c ON c.id = m.course_id
       WHERE l.id = $1 LIMIT 1`,
      [lessonId]
    );
    var lessonInfo = lessonRes.rows[0];
    if (!lessonInfo) return res.status(404).json({ error: 'Dars topilmadi' });

    var result = await pool.query(
      `INSERT INTO lesson_questions (lesson_id, user_id, question, status, created_at)
       VALUES ($1, $2, $3, 'pending', NOW())
       RETURNING *`,
      [lessonId, user.id, questionText]
    );
    var newQuestion = result.rows[0];

    // Telegram Bot orqali adminga zudlik bilan bildirishnoma yuborish
    try {
      var studentName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Noma‘lum';
      var studentUsername = user.username ? `@${user.username}` : 'mavjud emas';
      var studentPhone = user.phone || 'yo‘q';
      var adminNotice =
        `❓ <b>Yangi dars savoli keldi!</b>\n\n` +
        `👤 <b>O'quvchi:</b> ${studentName} (${studentUsername})\n` +
        `📱 <b>Tel:</b> ${studentPhone}\n` +
        `📚 <b>Kurs:</b> ${lessonInfo.course_title || 'Kurs'}\n` +
        `📑 <b>Modul:</b> ${lessonInfo.module_title || ''}\n` +
        `🎬 <b>Dars:</b> ${lessonInfo.lesson_title}\n\n` +
        `💬 <b>Savol:</b>\n<i>"${questionText}"</i>\n\n` +
        `<i>Mini App ichidagi "Chat" bo‘limidan javob qaytarishingiz mumkin.</i>`;
      await notifyAdmin(adminNotice);
    } catch (notifErr) {
      console.warn('ADMIN Q NOTIFY WARNING:', notifErr.message);
    }

    return res.json({
      ok: true,
      message: 'Savolingiz adminga yuborildi. Ustoz javob bergach xabar beramiz!',
      question: Object.assign({}, newQuestion, {
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        is_mine: true
      })
    });
  } catch (error) {
    console.error('SUBMIT QUESTION ERROR:', error);
    return res.status(500).json({ error: 'Savolni yuborishda xatolik yuz berdi' });
  }
});

// O'quvchi o'zining barcha savollari va javoblarini ko'rishi (Chat bo'limi uchun)
app.post('/api/chat/my-questions', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Telegram foydalanuvchisi tekshirilmadi' });

    var result = await pool.query(
      `SELECT lq.id, lq.lesson_id, lq.question, lq.answer, lq.status, lq.created_at, lq.answered_at,
              l.title AS lesson_title, m.title AS module_title, c.title AS course_title, c.id AS course_id
       FROM lesson_questions lq
       JOIN lessons l ON l.id = lq.lesson_id
       JOIN modules m ON m.id = l.module_id
       LEFT JOIN courses c ON c.id = m.course_id
       WHERE lq.user_id = $1
       ORDER BY lq.created_at DESC`,
      [user.id]
    );

    return res.json({ ok: true, questions: result.rows });
  } catch (error) {
    console.error('MY QUESTIONS ERROR:', error);
    return res.status(500).json({ error: 'Savollarni yuklashda xatolik' });
  }
});

// Admin barcha o'quvchilar savollarini ko'rishi (Chat bo'limidagi Admin Hub)
app.post('/api/admin/questions', requireAdmin, async function (req, res) {
  try {
    var courseIdFilter = req.body.course_id ? Number(req.body.course_id) : null;
    var query = `SELECT lq.id, lq.lesson_id, lq.user_id, lq.question, lq.answer, lq.status, lq.is_public, lq.created_at, lq.answered_at,
              u.first_name, u.last_name, u.username, u.phone, u.telegram_id,
              l.title AS lesson_title, m.title AS module_title, c.title AS course_title, c.id AS course_id
       FROM lesson_questions lq
       JOIN users u ON u.id = lq.user_id
       JOIN lessons l ON l.id = lq.lesson_id
       JOIN modules m ON m.id = l.module_id
       LEFT JOIN courses c ON c.id = m.course_id`;
    var params = [];
    if (courseIdFilter) {
      query += ' WHERE c.id = $1';
      params.push(courseIdFilter);
    }
    query += ' ORDER BY (CASE WHEN lq.status = \'pending\' THEN 0 ELSE 1 END) ASC, lq.created_at DESC';

    var result = await pool.query(query, params);

    return res.json({ ok: true, questions: result.rows });
  } catch (error) {
    console.error('ADMIN QUESTIONS LIST ERROR:', error);
    return res.status(500).json({ error: 'Savollar ro‘yxatini olishda xatolik' });
  }
});

app.post('/api/admin/questions/:id/delete', requireAdmin, async function (req, res) {
  try {
    var result = await pool.query('DELETE FROM lesson_questions WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Savol topilmadi' });
    return res.json({ ok: true, message: 'Savol o‘chirildi' });
  } catch (error) {
    console.error('DELETE QUESTION ERROR:', error);
    return res.status(500).json({ error: 'Savolni o‘chirishda xatolik' });
  }
});

// ======================================================
// MENTORLAR
// ======================================================

app.post('/api/mentors', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Telegram foydalanuvchisi tekshirilmadi' });

    var courseId = req.body.course_id ? Number(req.body.course_id) : null;
    var query = 'SELECT id, course_id, name, telegram_username, specialization, work_days, work_hours_start, work_hours_end FROM mentors';
    var params = [];
    if (courseId) {
      query += ' WHERE course_id = $1';
      params.push(courseId);
    }
    query += ' ORDER BY id ASC';

    var result = await pool.query(query, params);
    return res.json({ ok: true, mentors: result.rows });
  } catch (error) {
    console.error('MENTORS LIST ERROR:', error);
    return res.status(500).json({ error: 'Mentorlarni olishda xatolik' });
  }
});

app.post('/api/admin/mentors', requireAdmin, async function (req, res) {
  try {
    var result = await pool.query(
      `SELECT mt.id, mt.course_id, mt.name, mt.telegram_username, mt.specialization, mt.work_days, mt.work_hours_start, mt.work_hours_end, c.title AS course_title
       FROM mentors mt LEFT JOIN courses c ON c.id = mt.course_id
       ORDER BY mt.id ASC`
    );
    return res.json({ ok: true, mentors: result.rows });
  } catch (error) {
    console.error('ADMIN MENTORS LIST ERROR:', error);
    return res.status(500).json({ error: 'Mentorlarni olishda xatolik' });
  }
});

app.post('/api/admin/mentors/add', requireAdmin, async function (req, res) {
  try {
    var courseId = Number(req.body.course_id);
    var name = String(req.body.name || '').trim();
    var telegramUsername = String(req.body.telegram_username || '').trim().replace(/^@/, '');
    var workDays = Array.isArray(req.body.work_days) ? req.body.work_days.map(function (d) { return String(d).trim(); }) : [];
    var workHoursStart = String(req.body.work_hours_start || '').trim();
    var workHoursEnd = String(req.body.work_hours_end || '').trim();
    var specialization = Array.isArray(req.body.specialization) ? req.body.specialization.map(function (s) { return String(s).trim(); }).filter(Boolean) : [];

    if (!courseId || !name) return res.status(400).json({ error: 'Kurs va mentor ismi majburiy' });

    var result = await pool.query(
      'INSERT INTO mentors (course_id, name, telegram_username, specialization, work_days, work_hours_start, work_hours_end) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [courseId, name, telegramUsername || null, specialization, workDays, workHoursStart || null, workHoursEnd || null]
    );

    return res.json({ ok: true, message: 'Mentor qoshildi', mentor: result.rows[0] });
  } catch (error) {
    console.error('ADD MENTOR ERROR:', error);
    return res.status(500).json({ error: 'Mentor qoshishda xatolik' });
  }
});

app.post('/api/admin/mentors/:id/update', requireAdmin, async function (req, res) {
  try {
    var name = String(req.body.name || '').trim();
    var telegramUsername = String(req.body.telegram_username || '').trim().replace(/^@/, '');
    var workDays = Array.isArray(req.body.work_days) ? req.body.work_days.map(function (d) { return String(d).trim(); }) : [];
    var workHoursStart = String(req.body.work_hours_start || '').trim();
    var workHoursEnd = String(req.body.work_hours_end || '').trim();

    var specialization = Array.isArray(req.body.specialization) ? req.body.specialization.map(function (s) { return String(s).trim(); }).filter(Boolean) : [];

    if (!name) return res.status(400).json({ error: 'Mentor ismi majburiy' });

    var result = await pool.query(
      'UPDATE mentors SET name = $1, telegram_username = $2, specialization = $3, work_days = $4, work_hours_start = $5, work_hours_end = $6 WHERE id = $7 RETURNING *',
      [name, telegramUsername || null, specialization, workDays, workHoursStart || null, workHoursEnd || null, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Mentor topilmadi' });

    return res.json({ ok: true, message: 'Mentor yangilandi', mentor: result.rows[0] });
  } catch (error) {
    console.error('UPDATE MENTOR ERROR:', error);
    return res.status(500).json({ error: 'Mentorni yangilashda xatolik' });
  }
});

app.post('/api/admin/mentors/:id/delete', requireAdmin, async function (req, res) {
  try {
    await pool.query('DELETE FROM mentors WHERE id = $1', [req.params.id]);
    return res.json({ ok: true, message: 'Mentor ochirildi' });
  } catch (error) {
    console.error('DELETE MENTOR ERROR:', error);
    return res.status(500).json({ error: 'Mentorni ochirishda xatolik' });
  }
});

// Admin o'quvchi savoliga Mini App ichida javob berishi
app.post('/api/admin/questions/:id/reply', requireAdmin, async function (req, res) {
  try {
    var questionId = Number(req.params.id);
    var answerText = String(req.body.answer || '').trim();
    var makePublic = Boolean(req.body.is_public);
    if (!answerText) {
      return res.status(400).json({ error: 'Javob matni bo‘sh bo‘lishi mumkin emas' });
    }

    var result = await pool.query(
      `UPDATE lesson_questions
       SET answer = $1, status = 'answered', answered_at = NOW(), answered_by = $2, is_public = $4
       WHERE id = $3
       RETURNING *`,
      [answerText, req.user.telegram_id, questionId, makePublic]
    );
    var updated = result.rows[0];
    if (!updated) return res.status(404).json({ error: 'Savol topilmadi' });

    // O'quvchining Telegram botiga avtomatik xabar yuborish
    try {
      var detailsRes = await pool.query(
        `SELECT u.telegram_id, l.title AS lesson_title, c.title AS course_title
         FROM users u
         JOIN lesson_questions lq ON lq.user_id = u.id
         JOIN lessons l ON l.id = lq.lesson_id
         JOIN modules m ON m.id = l.module_id
         LEFT JOIN courses c ON c.id = m.course_id
         WHERE lq.id = $1 LIMIT 1`,
        [questionId]
      );
      var details = detailsRes.rows[0];
      if (details && details.telegram_id) {
        var replyMsg =
          `💬 <b>Ustoz savolingizga javob berdi!</b>\n\n` +
          `📚 <b>Dars:</b> ${details.lesson_title}\n` +
          `❓ <b>Sizning savolingiz:</b>\n<i>"${updated.question}"</i>\n\n` +
          `✅ <b>Ustoz javobi:</b>\n${answerText}\n\n` +
          `<i>Mini Appga kirib dars materiallarini ko‘rishingiz mumkin.</i>`;
        await botModule.bot.telegram.sendMessage(details.telegram_id, replyMsg, { parse_mode: 'HTML' });
      }
    } catch (notifErr) {
      console.warn('STUDENT REPLY NOTIFY WARNING:', notifErr.message);
    }

    return res.json({ ok: true, message: 'Javob saqlandi va o‘quvchiga yuborildi', question: updated });
  } catch (error) {
    console.error('REPLY QUESTION ERROR:', error);
    return res.status(500).json({ error: 'Javobni yuborishda xatolik yuz berdi' });
  }
});

app.post('/api/admin/questions/:id/toggle-public', requireAdmin, async function (req, res) {
  try {
    var result = await pool.query(
      'UPDATE lesson_questions SET is_public = NOT is_public WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Savol topilmadi' });
    return res.json({ ok: true, question: result.rows[0] });
  } catch (error) {
    console.error('TOGGLE PUBLIC QUESTION ERROR:', error);
    return res.status(500).json({ error: 'Holatni ozgartirishda xatolik' });
  }
});

// ======================================================
// PROGRESS MARK
// ======================================================

app.post('/api/progress/mark', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Telegram foydalanuvchisi tekshirilmadi' });

    var lessonId = req.body.lesson_id;
    if (!lessonId) return res.status(400).json({ error: 'lesson_id majburiy' });

    await pool.query(
      'INSERT INTO progress (user_id, lesson_id, watched) VALUES ($1, $2, true) ON CONFLICT (user_id, lesson_id) DO UPDATE SET watched = true',
      [user.id, lessonId]
    );

    return res.json({ ok: true });
  } catch (error) {
    console.error('PROGRESS MARK ERROR:', error);
    return res.status(500).json({ error: 'Server xatosi' });
  }
});

// ======================================================
// MODULE TEST
// ======================================================

app.post('/api/module/:id/test', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Telegram foydalanuvchisi tekshirilmadi' });
    if (user.is_banned) {
      return res.status(403).json({ error: 'banned', is_banned: true, message: 'Hisobingiz cheklangan' });
    }

    var isMainAdminForTest = String(user.telegram_id) === String(ADMIN_TELEGRAM_ID);
    if (!hasAccess(user) && !isMainAdminForTest) {
      return res.status(403).json({ error: 'locked', message: 'Testlar faqat kursga toʻlov qilib, kirish huquqi berilgan oʻquvchilar uchun ochiq.' });
    }

    if (!isMainAdminForTest) {
      var prevResultCheck = await pool.query(
        'SELECT passed, attempted_at FROM module_results WHERE user_id = $1 AND module_id = $2 LIMIT 1',
        [user.id, req.params.id]
      );
      var prevResult = prevResultCheck.rows[0];
      if (prevResult && prevResult.passed) {
        var daysSincePass = (Date.now() - new Date(prevResult.attempted_at).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSincePass < 15) {
          var daysLeftForRetake = Math.ceil(15 - daysSincePass);
          return res.status(403).json({
            error: 'cooldown',
            message: 'Siz bu testdan allaqachon muvaffaqiyatli o\'tgansiz. Qayta topshirish uchun yana ' + daysLeftForRetake + ' kun kutishingiz kerak.',
            days_left: daysLeftForRetake
          });
        }
      }
    }

    var questionsResult = await pool.query(
      'SELECT id, question, options, order_index FROM module_tests WHERE module_id = $1 ORDER BY order_index ASC, id ASC',
      [req.params.id]
    );

    return res.json({ questions: questionsResult.rows });
  } catch (error) {
    console.error('TEST ERROR:', error);
    return res.status(500).json({ error: 'Server xatosi' });
  }
});

// ======================================================
// SUBMIT TEST
// ======================================================

app.post('/api/module/:id/submit', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Telegram foydalanuvchisi tekshirilmadi' });
    if (user.is_banned) {
      return res.status(403).json({ error: 'banned', is_banned: true, message: 'Hisobingiz cheklangan' });
    }

    var isMainAdminForSubmit = String(user.telegram_id) === String(ADMIN_TELEGRAM_ID);
    if (!hasAccess(user) && !isMainAdminForSubmit) {
      return res.status(403).json({ error: 'locked', message: 'Testlar faqat kursga toʻlov qilib, kirish huquqi berilgan oʻquvchilar uchun ochiq.' });
    }

    var answers = req.body.answers || {};
    var questionsResult = await pool.query(
      'SELECT id, question, options, correct_index FROM module_tests WHERE module_id = $1 ORDER BY order_index ASC, id ASC',
      [req.params.id]
    );
    var questions = questionsResult.rows;
    var correct = 0;
    var breakdown = [];
    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      var userAnswerIdx = (answers[q.id] !== undefined && answers[q.id] !== null) ? Number(answers[q.id]) : null;
      var correctIdx = Number(q.correct_index);
      var isCorrect = userAnswerIdx !== null && userAnswerIdx === correctIdx;
      if (isCorrect) correct++;
      breakdown.push({
        question: q.question,
        options: q.options,
        your_answer_index: userAnswerIdx,
        correct_index: correctIdx,
        is_correct: isCorrect
      });
    }
    var score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    var passed = score >= 65;

    await pool.query(
      'INSERT INTO module_results (user_id, module_id, passed, score) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, module_id) DO UPDATE SET passed = $3, score = $4, attempted_at = now()',
      [user.id, req.params.id, passed, score]
    );

    // Activity event qayd etish
    try {
      await pool.query(
        "INSERT INTO activity_events (user_id, event_type, details, created_at) VALUES ($1, 'test_attempt', $2, NOW())",
        [user.id, JSON.stringify({ module_id: req.params.id, score: score, passed: passed })]
      );
    } catch (aeErr) {}

    // Agar shu urinishda o'tgan bo'lsa — shu modul tegishli kursning BARCHA testlaridan o'tganmi tekshiramiz
    if (passed) {
      try {
        var moduleInfoResult = await pool.query('SELECT course_id FROM modules WHERE id = $1', [req.params.id]);
        var courseId = moduleInfoResult.rows[0] ? moduleInfoResult.rows[0].course_id : null;

        if (courseId) {
          var courseModuleIdsResult = await pool.query('SELECT id FROM modules WHERE course_id = $1', [courseId]);
          var courseModuleIds = courseModuleIdsResult.rows.map(function (r) { return r.id; });

          var modulesWithTestsResult = await pool.query(
            'SELECT DISTINCT module_id FROM module_tests WHERE module_id = ANY($1)',
            [courseModuleIds]
          );
          var moduleIdsWithTests = modulesWithTestsResult.rows.map(function (r) { return r.module_id; });

          var allPassed = true;
          if (moduleIdsWithTests.length > 0) {
            var passedResultsResult = await pool.query(
              'SELECT module_id FROM module_results WHERE user_id = $1 AND module_id = ANY($2) AND passed = true',
              [user.id, moduleIdsWithTests]
            );
            var passedModuleIdSet = new Set(passedResultsResult.rows.map(function (r) { return r.module_id; }));
            allPassed = moduleIdsWithTests.every(function (mid) { return passedModuleIdSet.has(mid); });
          }

          // Kursning BARCHA darslari ko'rilganmi (nafaqat test bor modullar, balki hamma modullar)?
          var courseLessonsResult = await pool.query('SELECT id FROM lessons WHERE module_id = ANY($1)', [courseModuleIds]);
          var courseLessonIds = courseLessonsResult.rows.map(function (r) { return r.id; });
          var allLessonsWatched = false;
          if (courseLessonIds.length > 0) {
            var watchedCountResult = await pool.query(
              'SELECT COUNT(*)::int AS c FROM progress WHERE user_id = $1 AND lesson_id = ANY($2) AND watched = true',
              [user.id, courseLessonIds]
            );
            allLessonsWatched = watchedCountResult.rows[0].c === courseLessonIds.length;
          }

          if (allPassed && allLessonsWatched && courseLessonIds.length > 0) {
            var insertCompletionResult = await pool.query(
              'INSERT INTO course_completions (user_id, course_id) VALUES ($1, $2) ON CONFLICT (user_id, course_id) DO NOTHING RETURNING id',
              [user.id, courseId]
            );
            if (insertCompletionResult.rows.length > 0) {
              var courseTitleResult = await pool.query('SELECT title FROM courses WHERE id = $1', [courseId]);
              var courseTitle = courseTitleResult.rows[0] ? courseTitleResult.rows[0].title : 'Kurs';
              try {
                await botModule.bot.telegram.sendMessage(
                  user.telegram_id,
                  '🎉🎓 TABRIKLAYMIZ!\n\n' +
                  '"' + courseTitle + '" kursini muvaffaqiyatli yakunladingiz — barcha darslar va testlardan muvaffaqiyatli o\'tdingiz!\n\n' +
                  '👏 Bilim va mehnatingiz uchun tabriklaymiz. Sizni yangi kurslarimizda ham kutamiz!\n\n' +
                  'Yangiliklardan xabardor bo\'lish uchun kanalimizga obuna bo\'ling: @Yosh_uzbekk'
                );
              } catch (notifyErr) {
                console.warn('Kurs tugatish xabari yuborilmadi:', notifyErr.message);
              }
            }
          }
        }
      } catch (completionError) {
        console.error('COURSE COMPLETION CHECK ERROR:', completionError);
      }
    }

    return res.json({ score: score, passed: passed, breakdown: breakdown });
  } catch (error) {
    console.error('SUBMIT TEST ERROR:', error);
    return res.status(500).json({ error: 'Server xatosi' });
  }
});

// ======================================================
// ACCOUNT RESET (O'quvchi o'zi hisobini "o'chiradi" — yangi o'quvchi holatiga qaytaradi)
// ======================================================

app.post('/api/account/reset', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Telegram foydalanuvchisi tekshirilmadi' });

    await pool.query(
      'UPDATE users SET access_until = NULL, active_device_id = NULL, device_last_seen = NULL WHERE id = $1',
      [user.id]
    );
    await pool.query('DELETE FROM progress WHERE user_id = $1', [user.id]);
    await pool.query('DELETE FROM module_results WHERE user_id = $1', [user.id]);
    await pool.query('DELETE FROM module_access_grants WHERE user_id = $1', [user.id]);
    await pool.query('DELETE FROM practice_submissions WHERE user_id = $1', [user.id]);
    await pool.query(
      "UPDATE payment_requests SET status = 'cancelled' WHERE user_id = $1 AND status = 'pending'",
      [user.id]
    );

    console.log('ACCOUNT RESET: user_id=' + user.id);
    return res.json({ ok: true, message: 'Hisobingiz tozalandi' });
  } catch (error) {
    console.error('ACCOUNT RESET ERROR:', error);
    return res.status(500).json({ error: 'Hisobni ochirishda xatolik' });
  }
});

// ======================================================
// REQUEST ACCESS
// ======================================================

app.post('/api/request-access', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ ok: false, error: 'Telegram foydalanuvchisi aniqlanmadi' });

    var fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Nomalum';

    var courseLine = '';
    if (req.body.course_id) {
      try {
        var courseResult = await pool.query('SELECT title FROM courses WHERE id = $1 LIMIT 1', [Number(req.body.course_id)]);
        if (courseResult.rows[0]) {
          courseLine = '\nKurs: ' + courseResult.rows[0].title;
        }
      } catch (courseError) {
        console.error('REQUEST ACCESS COURSE LOOKUP ERROR:', courseError);
      }
    }

    var isRenewal = hasAccess(user);

    var existingResult = await pool.query(
      "SELECT id FROM payment_requests WHERE user_id = $1 AND status = 'pending' LIMIT 1",
      [user.id]
    );

    if (existingResult.rows.length > 0) {
      var adminMsg1 = (isRenewal ? 'MUDDATNI UZAYTIRISH SOROVI!' : 'TOLOV SOROVI!') +
        '\n\nIsm: ' + fullName + '\nTelefon: ' + (user.phone || 'Telefon yoq') + '\nUsername: @' + (user.username || 'username yoq') + '\nTelegram ID: ' + user.telegram_id + courseLine +
        '\n\nBu foydalanuvchi oldin ham sorov yuborgan.';
      await notifyAdmin(adminMsg1, user.telegram_id.toString());
      return res.json({ ok: true, already_pending: true, message: 'Sorovingiz adminga yuborildi' });
    }

    await pool.query(
      "INSERT INTO payment_requests (user_id, status) VALUES ($1, 'pending')",
      [user.id]
    );

    var adminMsg2 = (isRenewal ? 'MUDDATNI UZAYTIRISH SOROVI!' : 'YANGI TOLOV SOROVI!') +
      '\n\nIsm: ' + fullName + '\nTelefon: ' + (user.phone || 'Telefon yoq') + '\nUsername: @' + (user.username || 'username yoq') + '\nTelegram ID: ' + user.telegram_id + courseLine +
      (isRenewal
        ? ('\nJoriy muddat: ' + new Date(user.access_until).toLocaleDateString('uz-UZ') + ' sanasigacha\n\nO\'quvchi kirish muddatini uzaytirishni soramoqda.')
        : '\n\nKursga kirish uchun sorov yuborildi.');
    await notifyAdmin(adminMsg2, user.telegram_id.toString());

    return res.json({ ok: true, already_pending: false, message: 'Sorov adminga yuborildi' });
  } catch (error) {
    console.error('REQUEST ACCESS ERROR:', error);
    return res.status(500).json({ ok: false, error: 'Adminga murojaat yuborishda xatolik: ' + error.message });
  }
});

// ======================================================
// USER CHAT MESSAGE TO ADMIN
// ======================================================

app.post('/api/chat/send', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ ok: false, error: 'Foydalanuvchi aniqlanmadi' });

    var text = String(req.body.text || '').trim();
    if (!text) return res.status(400).json({ ok: false, error: 'Xabar matnini kiriting' });

    var fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Foydalanuvchi';
    var tgUserLink = user.username ? '@' + user.username : 'ID: ' + user.telegram_id;

    var adminMsg = '💬 CHATDAN YANGI XABAR!\n\n' +
      '👤 Kimdan: ' + fullName + ' (' + tgUserLink + ')\n' +
      '📱 Telefon: ' + (user.phone || 'Kiritilmagan') + '\n' +
      '🆔 Telegram ID: ' + user.telegram_id + '\n\n' +
      '📝 Xabar:\n' + text;

    await notifyAdmin(adminMsg);

    console.log('CHAT MESSAGE SENT TO ADMIN from: ' + user.telegram_id);
    return res.json({ ok: true, message: 'Xabaringiz adminga yetkazildi!' });
  } catch (error) {
    console.error('CHAT SEND ERROR:', error);
    return res.status(500).json({ ok: false, error: 'Xabarni yuborishda server xatosi' });
  }
});

// ======================================================
// ACTIVITY TRACKING & HEARTBEAT (USER)
// ======================================================

app.post('/api/activity/heartbeat', async function (req, res) {
  try {
    var initData = (req.body && req.body.initData) || req.headers['x-telegram-init-data'];
    if (!initData) return res.status(401).json({ error: 'Telegram initData yuborilmagan' });

    var user = await getOrCreateUser(initData);
    if (!user) return res.status(401).json({ error: 'Foydalanuvchi tekshirilmadi' });
    if (user.is_banned) {
      return res.status(403).json({
        error: 'banned',
        is_banned: true,
        message: 'Sizning hisobingiz qoidabuzarlik sababli cheklandi'
      });
    }

    var status = String(req.body.status || 'online').trim().toLowerCase();
    if (!['online', 'watching', 'test_active', 'idle'].includes(status)) {
      status = 'online';
    }

    var currentPage = req.body.current_page ? String(req.body.current_page).slice(0, 100) : null;
    var lessonId = req.body.lesson_id ? Number(req.body.lesson_id) : null;
    var videoProgress = Math.max(0, Math.floor(Number(req.body.video_progress) || 0));
    var videoDuration = Math.max(0, Math.floor(Number(req.body.video_duration) || 0));
    var videoStatus = req.body.video_status ? String(req.body.video_status).slice(0, 20) : 'watching';
    var moduleId = req.body.module_id ? Number(req.body.module_id) : null;
    var quizQuestionCurrent = Math.max(0, Math.floor(Number(req.body.quiz_question_current) || 0));
    var quizQuestionTotal = Math.max(0, Math.floor(Number(req.body.quiz_question_total) || 0));

    // UPSERT into user_activity
    await pool.query(`
      INSERT INTO user_activity (
        user_id, status, current_page, lesson_id, video_progress, video_duration,
        video_status, module_id, quiz_question_current, quiz_question_total,
        last_heartbeat_at, started_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        status = EXCLUDED.status,
        current_page = EXCLUDED.current_page,
        lesson_id = EXCLUDED.lesson_id,
        video_progress = EXCLUDED.video_progress,
        video_duration = EXCLUDED.video_duration,
        video_status = EXCLUDED.video_status,
        module_id = EXCLUDED.module_id,
        quiz_question_current = EXCLUDED.quiz_question_current,
        quiz_question_total = EXCLUDED.quiz_question_total,
        last_heartbeat_at = NOW()
    `, [
      user.id, status, currentPage, lessonId, videoProgress, videoDuration,
      videoStatus, moduleId, quizQuestionCurrent, quizQuestionTotal
    ]);

    // Update device_last_seen
    await pool.query('UPDATE users SET device_last_seen = NOW() WHERE id = $1', [user.id]);

    // Record daily visit in activity_events (once per calendar day)
    var todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    await pool.query(`
      INSERT INTO activity_events (user_id, event_type, details, created_at)
      SELECT $1, 'visit', '{"source": "heartbeat"}', NOW()
      WHERE NOT EXISTS (
        SELECT 1 FROM activity_events
        WHERE user_id = $1 AND event_type = 'visit' AND created_at >= $2
      )
    `, [user.id, todayStart]);

    return res.json({ ok: true, timestamp: Date.now() });
  } catch (error) {
    console.error('HEARTBEAT ERROR:', error);
    return res.status(500).json({ error: 'Heartbeat server xatosi' });
  }
});

// ======================================================
// MARKETPLACE / RESURSLAR & SHABLONLAR (USER API)
// ======================================================

async function isMarketEnabled() {
  try {
    var r = await pool.query("SELECT value FROM academy_settings WHERE key = 'market_enabled' LIMIT 1");
    return r.rows.length > 0 && r.rows[0].value === 'true';
  } catch (e) {
    return false;
  }
}

async function getAvailableProducts(req, res) {
  try {
    if (!(await isMarketEnabled())) {
      return res.json({ ok: true, products: [], market_enabled: false });
    }
    var result = await pool.query(
      'SELECT id, title, category, software, price, description, preview_url, file_format, order_index FROM market_products WHERE is_available = true ORDER BY order_index ASC, id ASC'
    );
    return res.json({ ok: true, products: result.rows });
  } catch (error) {
    console.error('GET PRODUCTS ERROR:', error);
    return res.status(500).json({ error: 'Mahsulotlarni olishda server xatosi' });
  }
}

app.get('/api/products', getAvailableProducts);
app.post('/api/products', getAvailableProducts);

// ======================================================
// ADMIN API
// ======================================================

app.post('/api/admin/auth', requireAdmin, async function (req, res) {
  return res.json({
    ok: true,
    admin: {
      id: req.admin.id, telegram_id: req.admin.telegram_id.toString(),
      first_name: req.admin.first_name || '', role: req.admin.role
    }
  });
});

// ======================================================
// ADMIN STATS
// ======================================================

app.post('/api/admin/stats', requireAdmin, async function (req, res) {
  try {
    var totalResult = await pool.query('SELECT COUNT(*)::int AS total FROM users');
    var paidResult = await pool.query('SELECT COUNT(*)::int AS paid FROM users WHERE access_until > NOW()');
    var unpaidResult = await pool.query('SELECT COUNT(*)::int AS unpaid FROM users WHERE access_until IS NULL OR access_until <= NOW()');
    var activeResult = await pool.query('SELECT COUNT(DISTINCT user_id)::int AS active FROM progress WHERE watched = true');
    var lessonsResult = await pool.query('SELECT COUNT(*)::int AS total FROM lessons');
    var modulesResult = await pool.query('SELECT COUNT(*)::int AS total FROM modules');
    var pendingNewResult = await pool.query(
      "SELECT COUNT(*)::int AS c FROM payment_requests pr JOIN users u ON u.id = pr.user_id WHERE pr.status = 'pending' AND u.access_until IS NULL"
    );
    var pendingRenewalResult = await pool.query(
      "SELECT COUNT(*)::int AS c FROM payment_requests pr JOIN users u ON u.id = pr.user_id WHERE pr.status = 'pending' AND u.access_until IS NOT NULL"
    );

    // Live online, watching va testing (oxirgi 60 soniya)
    var onlineResult = await pool.query(
      "SELECT COUNT(*)::int AS c FROM user_activity WHERE last_heartbeat_at >= NOW() - INTERVAL '60 seconds'"
    );
    var watchingResult = await pool.query(
      "SELECT COUNT(*)::int AS c FROM user_activity WHERE status = 'watching' AND lesson_id IS NOT NULL AND last_heartbeat_at >= NOW() - INTERVAL '60 seconds'"
    );
    var testingResult = await pool.query(
      "SELECT COUNT(*)::int AS c FROM user_activity WHERE status = 'test_active' AND last_heartbeat_at >= NOW() - INTERVAL '60 seconds'"
    );

    // Bugungi statistika
    var todayActiveResult = await pool.query(`
      SELECT COUNT(DISTINCT uid)::int AS c FROM (
        SELECT user_id AS uid FROM activity_events WHERE created_at >= CURRENT_DATE
        UNION
        SELECT user_id AS uid FROM user_activity WHERE last_heartbeat_at >= CURRENT_DATE
        UNION
        SELECT id AS uid FROM users WHERE device_last_seen >= CURRENT_DATE
      ) t
    `);
    var todayViewsResult = await pool.query(
      "SELECT COUNT(*)::int AS c FROM progress WHERE watched_at >= CURRENT_DATE"
    );
    var todayTestsResult = await pool.query(
      "SELECT COUNT(*)::int AS c FROM module_results WHERE attempted_at >= CURRENT_DATE"
    );
    var bannedResult = await pool.query(
      "SELECT COUNT(*)::int AS c FROM users WHERE is_banned = true"
    );
    var productsResult = await pool.query(
      "SELECT COUNT(*)::int AS c FROM market_products WHERE is_available = true"
    );

    return res.json({
      ok: true,
      stats: {
        total_students: totalResult.rows[0].total,
        paid_students: paidResult.rows[0].paid,
        unpaid_students: unpaidResult.rows[0].unpaid,
        active_students: activeResult.rows[0].active,
        total_lessons: lessonsResult.rows[0].total,
        total_modules: modulesResult.rows[0].total,
        pending_new: pendingNewResult.rows[0].c,
        pending_renewal: pendingRenewalResult.rows[0].c,
        // Live ko'rsatkichlar
        online_now: onlineResult.rows[0].c,
        watching_now: watchingResult.rows[0].c,
        testing_now: testingResult.rows[0].c,
        // Bugungi ko'rsatkichlar
        today_active: todayActiveResult.rows[0].c,
        today_lesson_views: todayViewsResult.rows[0].c,
        today_test_attempts: todayTestsResult.rows[0].c,
        banned_students: bannedResult.rows[0].c,
        total_products: productsResult.rows[0].c
      }
    });
  } catch (error) {
    console.error('ADMIN STATS ERROR:', error);
    return res.status(500).json({ error: 'Statistikani olishda xato' });
  }
});

// ======================================================
// ADMIN LIVE ACTIVITY (REAL-TIME POLLING: ONLINE, WATCHING, TESTING)
// ======================================================

app.post('/api/admin/live-activity', requireAdmin, async function (req, res) {
  try {
    // 60 soniya ichida faol bo'lganlar
    var threshold = new Date(Date.now() - 60 * 1000);

    var activeUsersRes = await pool.query(`
      SELECT
        ua.user_id,
        ua.status,
        ua.current_page,
        ua.lesson_id,
        ua.video_progress,
        ua.video_duration,
        ua.video_status,
        ua.module_id,
        ua.quiz_question_current,
        ua.quiz_question_total,
        ua.last_heartbeat_at,
        ROUND(EXTRACT(EPOCH FROM (NOW() - ua.last_heartbeat_at)))::int AS seconds_ago,
        u.telegram_id,
        u.first_name,
        u.last_name,
        u.username,
        u.phone,
        u.access_until,
        u.is_banned,
        u.banned_reason,
        u.created_at AS user_created_at,
        l.title AS lesson_title,
        l.order_index AS lesson_order,
        m.title AS module_title,
        m.order_index AS module_order,
        qm.title AS quiz_module_title,
        qm.order_index AS quiz_module_order
      FROM user_activity ua
      JOIN users u ON u.id = ua.user_id
      LEFT JOIN lessons l ON l.id = ua.lesson_id
      LEFT JOIN modules m ON m.id = l.module_id
      LEFT JOIN modules qm ON qm.id = ua.module_id
      WHERE ua.last_heartbeat_at >= $1
      ORDER BY ua.last_heartbeat_at DESC
      LIMIT 100
    `, [threshold]);

    var activeList = activeUsersRes.rows;
    var onlineNow = activeList.length;
    var watchingNow = activeList.filter(function (u) { return u.status === 'watching' && u.lesson_id; }).length;
    var testingNow = activeList.filter(function (u) { return u.status === 'test_active'; }).length;

    // Oxirgi 10 ta faol foydalanuvchilar (umuman oxirgi kirganlar)
    var recentUsersRes = await pool.query(`
      SELECT u.id, u.telegram_id, u.first_name, u.last_name, u.username, u.phone,
             u.device_last_seen, ua.last_heartbeat_at, ua.status, ua.current_page,
             ROUND(EXTRACT(EPOCH FROM (NOW() - COALESCE(ua.last_heartbeat_at, u.device_last_seen, u.created_at))))::int AS seconds_ago
      FROM users u
      LEFT JOIN user_activity ua ON ua.user_id = u.id
      ORDER BY COALESCE(ua.last_heartbeat_at, u.device_last_seen, u.created_at) DESC
      LIMIT 10
    `);

    return res.json({
      ok: true,
      timestamp: Date.now(),
      summary: {
        online_now: onlineNow,
        watching_now: watchingNow,
        testing_now: testingNow
      },
      users: activeList,
      recent_users: recentUsersRes.rows
    });
  } catch (error) {
    console.error('LIVE ACTIVITY ERROR:', error);
    return res.status(500).json({ error: 'Jonli faollikni yuklashda xato: ' + error.message });
  }
});

// ======================================================
// ADMIN ANALYTICS HISTORY (TODAY, YESTERDAY, 7 DAYS, 30 DAYS)
// ======================================================

app.post('/api/admin/analytics/history', requireAdmin, async function (req, res) {
  try {
    var range = String(req.body.range || '7days').trim();
    var days = 7;
    var startDate = new Date();

    if (range === 'today') {
      days = 1;
      startDate.setHours(0, 0, 0, 0);
    } else if (range === 'yesterday') {
      days = 2;
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
    } else if (range === '30days') {
      days = 30;
      startDate.setDate(startDate.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
    } else {
      // default: 7days
      days = 7;
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
    }

    // Yangi foydalanuvchilar soni
    var newUsersRes = await pool.query(
      'SELECT COUNT(*)::int AS c FROM users WHERE created_at >= $1',
      [startDate]
    );

    // Darslar ko'rilishi soni
    var lessonViewsRes = await pool.query(
      'SELECT COUNT(*)::int AS c FROM progress WHERE watched_at >= $1',
      [startDate]
    );

    // Test urinishlari soni
    var testAttemptsRes = await pool.query(
      'SELECT COUNT(*)::int AS c FROM module_results WHERE attempted_at >= $1',
      [startDate]
    );

    // Faol foydalanuvchilar (unikal)
    var activeUsersRes = await pool.query(`
      SELECT COUNT(DISTINCT uid)::int AS c FROM (
        SELECT user_id AS uid FROM activity_events WHERE created_at >= $1
        UNION
        SELECT user_id AS uid FROM user_activity WHERE last_heartbeat_at >= $1
        UNION
        SELECT user_id AS uid FROM progress WHERE watched_at >= $1
      ) t
    `, [startDate]);

    // Kunlik grafik taqsimoti (chart data)
    var chartQuery = `
      WITH date_series AS (
        SELECT generate_series(
          DATE_TRUNC('day', $1::timestamptz),
          DATE_TRUNC('day', NOW()),
          '1 day'::interval
        )::date AS day
      )
      SELECT
        ds.day::text AS date,
        COALESCE(u.new_users, 0)::int AS new_users,
        COALESCE(p.lesson_views, 0)::int AS lesson_views,
        COALESCE(t.test_attempts, 0)::int AS test_attempts
      FROM date_series ds
      LEFT JOIN (
        SELECT DATE_TRUNC('day', created_at)::date AS day, COUNT(*) AS new_users
        FROM users
        WHERE created_at >= $1
        GROUP BY 1
      ) u ON u.day = ds.day
      LEFT JOIN (
        SELECT DATE_TRUNC('day', watched_at)::date AS day, COUNT(*) AS lesson_views
        FROM progress
        WHERE watched_at >= $1
        GROUP BY 1
      ) p ON p.day = ds.day
      LEFT JOIN (
        SELECT DATE_TRUNC('day', attempted_at)::date AS day, COUNT(*) AS test_attempts
        FROM module_results
        WHERE attempted_at >= $1
        GROUP BY 1
      ) t ON t.day = ds.day
      ORDER BY ds.day ASC
    `;
    var chartRes = await pool.query(chartQuery, [startDate]);

    return res.json({
      ok: true,
      range: range,
      metrics: {
        new_users: newUsersRes.rows[0].c,
        active_users: activeUsersRes.rows[0].c,
        lesson_views: lessonViewsRes.rows[0].c,
        test_attempts: testAttemptsRes.rows[0].c
      },
      chart_data: chartRes.rows
    });
  } catch (error) {
    console.error('ANALYTICS HISTORY ERROR:', error);
    return res.status(500).json({ error: 'Tarixiy statistikani olishda xato: ' + error.message });
  }
});

// ======================================================
// BLACKLIST / QORA RO'YXAT ADMIN ENDPOINTS
// ======================================================

app.post('/api/admin/blacklist', requireAdmin, async function (req, res) {
  try {
    var result = await pool.query(`
      SELECT id, telegram_id, first_name, last_name, username, phone,
             is_banned, banned_reason, banned_at, created_at
      FROM users
      WHERE is_banned = true
      ORDER BY banned_at DESC NULLS LAST
    `);
    return res.json({ ok: true, banned_users: result.rows });
  } catch (error) {
    console.error('BLACKLIST ERROR:', error);
    return res.status(500).json({ error: 'Qora ro\'yxatni yuklashda xato' });
  }
});

app.post('/api/admin/student/:id/ban', requireAdmin, async function (req, res) {
  try {
    var studentId = Number(req.params.id);
    var reason = String(req.body.reason || 'Dars materiallarini tarqatish yoki qoidalarni buzish').trim();

    var userRes = await pool.query('SELECT id, telegram_id, first_name FROM users WHERE id = $1 LIMIT 1', [studentId]);
    if (userRes.rows.length === 0) return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
    var targetUser = userRes.rows[0];

    if (await isAdminTelegramId(targetUser.telegram_id)) {
      return res.status(403).json({ error: 'Adminlarni qora ro‘yxatga kiritib bo‘lmaydi' });
    }

    await pool.query(
      'UPDATE users SET is_banned = true, banned_reason = $1, banned_at = NOW(), access_until = NULL WHERE id = $2',
      [reason, studentId]
    );

    // User activity'ni ham tozalaymiz
    await pool.query('DELETE FROM user_activity WHERE user_id = $1', [studentId]);

    try {
      await botModule.bot.telegram.sendMessage(
        targetUser.telegram_id,
        '⛔️ DIQQAT!\n\n' +
        'Sizning hisobingiz platformadan foydalanish qoidalarini buzganlik sababli bloklandi va barcha ruxsatlar bekor qilindi.\n\n' +
        'Sabab: ' + reason + '\n\n' +
        'Savollar bo‘lsa administrator bilan bog‘laning: @texnikuzb'
      );
    } catch (msgErr) {
      console.warn('BAN NOTIFICATION WARNING:', msgErr.message);
    }

    console.log('USER BANNED: ' + targetUser.telegram_id + ' | Reason: ' + reason);
    return res.json({ ok: true, message: 'Foydalanuvchi muvaffaqiyatli qora ro\'yxatga kiritildi' });
  } catch (error) {
    console.error('BAN ERROR:', error);
    return res.status(500).json({ error: 'Qora ro\'yxatga kiritishda xato' });
  }
});

app.post('/api/admin/student/:id/unban', requireAdmin, async function (req, res) {
  try {
    var studentId = Number(req.params.id);
    var userRes = await pool.query('SELECT id, telegram_id, first_name FROM users WHERE id = $1 LIMIT 1', [studentId]);
    if (userRes.rows.length === 0) return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
    var targetUser = userRes.rows[0];

    await pool.query(
      'UPDATE users SET is_banned = false, banned_reason = NULL, banned_at = NULL WHERE id = $1',
      [studentId]
    );

    try {
      await botModule.bot.telegram.sendMessage(
        targetUser.telegram_id,
        '✅ Xushxabar!\n\n' +
        'Sizning hisobingiz administrator tomonidan qora ro\'yxatdan chiqarildi va faollashtirildi.\n\n' +
        'Mini Appni ochish uchun «📚 Darslarni ochish» tugmasini bosing.'
      );
    } catch (msgErr) {
      console.warn('UNBAN NOTIFICATION WARNING:', msgErr.message);
    }

    console.log('USER UNBANNED: ' + targetUser.telegram_id);
    return res.json({ ok: true, message: 'Foydalanuvchi qora ro\'yxatdan chiqarildi' });
  } catch (error) {
    console.error('UNBAN ERROR:', error);
    return res.status(500).json({ error: 'Qora ro\'yxatdan chiqarishda xato' });
  }
});

// ======================================================
// MARKET PRODUCTS (SHABLONLAR VA MODELLAR) ADMIN ENDPOINTS
// ======================================================

app.post('/api/admin/products', requireAdmin, async function (req, res) {
  try {
    var result = await pool.query('SELECT * FROM market_products ORDER BY order_index ASC, id ASC');
    return res.json({ ok: true, products: result.rows, market_enabled: await isMarketEnabled() });
  } catch (error) {
    console.error('ADMIN PRODUCTS ERROR:', error);
    return res.status(500).json({ error: 'Mahsulotlarni yuklashda xato' });
  }
});

app.post('/api/admin/market/status', requireAdmin, async function (req, res) {
  try {
    var enabled = req.body.enabled === true || req.body.enabled === 'true';
    await pool.query(
      "INSERT INTO academy_settings (key, value) VALUES ('market_enabled', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
      [enabled ? 'true' : 'false']
    );
    return res.json({ ok: true, market_enabled: enabled });
  } catch (error) {
    console.error('MARKET STATUS ERROR:', error);
    return res.status(500).json({ error: 'Bo‘lim holatini saqlashda xato' });
  }
});

app.post('/api/admin/products/add', requireAdmin, async function (req, res) {
  try {
    var title = String(req.body.title || '').trim();
    var category = String(req.body.category || 'Shablon').trim();
    var software = String(req.body.software || 'Revit').trim();
    var price = String(req.body.price || '').trim();
    var description = String(req.body.description || '').trim();
    var previewUrl = String(req.body.preview_url || '').trim();
    var fileFormat = String(req.body.file_format || '').trim();
    var orderIndex = Number(req.body.order_index) || 0;

    if (!title) return res.status(400).json({ error: 'Mahsulot nomini kiriting' });

    var result = await pool.query(`
      INSERT INTO market_products (title, category, software, price, description, preview_url, file_format, order_index)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [title, category, software, price, description, previewUrl, fileFormat, orderIndex]);

    return res.json({ ok: true, product: result.rows[0] });
  } catch (error) {
    console.error('PRODUCT ADD ERROR:', error);
    return res.status(500).json({ error: 'Mahsulot qo\'shishda xato' });
  }
});

app.post('/api/admin/products/:id/update', requireAdmin, async function (req, res) {
  try {
    var productId = Number(req.params.id);
    var title = String(req.body.title || '').trim();
    var category = String(req.body.category || 'Shablon').trim();
    var software = String(req.body.software || 'Revit').trim();
    var price = String(req.body.price || '').trim();
    var description = String(req.body.description || '').trim();
    var previewUrl = String(req.body.preview_url || '').trim();
    var fileFormat = String(req.body.file_format || '').trim();
    var isAvailable = req.body.is_available !== undefined ? Boolean(req.body.is_available) : true;
    var orderIndex = Number(req.body.order_index) || 0;

    var result = await pool.query(`
      UPDATE market_products
      SET title = $1, category = $2, software = $3, price = $4, description = $5,
          preview_url = $6, file_format = $7, is_available = $8, order_index = $9
      WHERE id = $10
      RETURNING *
    `, [title, category, software, price, description, previewUrl, fileFormat, isAvailable, orderIndex, productId]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Mahsulot topilmadi' });
    return res.json({ ok: true, product: result.rows[0] });
  } catch (error) {
    console.error('PRODUCT UPDATE ERROR:', error);
    return res.status(500).json({ error: 'Mahsulotni yangilashda xato' });
  }
});

app.post('/api/admin/products/:id/delete', requireAdmin, async function (req, res) {
  try {
    var productId = Number(req.params.id);
    await pool.query('DELETE FROM market_products WHERE id = $1', [productId]);
    return res.json({ ok: true, message: 'Mahsulot o\'chirildi' });
  } catch (error) {
    console.error('PRODUCT DELETE ERROR:', error);
    return res.status(500).json({ error: 'Mahsulotni o\'chirishda xato' });
  }
});

app.post('/api/admin/students/detail-list', requireAdmin, async function (req, res) {
  try {
    var filter = req.body.filter;
    var query = '';
    var params = [];

    if (filter === 'active') {
      query = `
        SELECT u.id, u.telegram_id, u.first_name, u.last_name, u.username, u.access_until,
               lr.created_at AS requested_at, lr.approved_at
        FROM users u
        LEFT JOIN LATERAL (
          SELECT created_at, approved_at FROM payment_requests
          WHERE user_id = u.id AND status = 'approved'
          ORDER BY approved_at DESC NULLS LAST LIMIT 1
        ) lr ON true
        WHERE u.access_until > NOW()
        ORDER BY u.access_until DESC
      `;
    } else if (filter === 'expired') {
      query = `
        SELECT u.id, u.telegram_id, u.first_name, u.last_name, u.username, u.access_until,
               lr.created_at AS requested_at, lr.approved_at
        FROM users u
        LEFT JOIN LATERAL (
          SELECT created_at, approved_at FROM payment_requests
          WHERE user_id = u.id AND status = 'approved'
          ORDER BY approved_at DESC NULLS LAST LIMIT 1
        ) lr ON true
        WHERE u.access_until IS NULL OR u.access_until <= NOW()
        ORDER BY u.access_until DESC NULLS LAST
      `;
    } else if (filter === 'pending_new') {
      query = `
        SELECT u.id, u.telegram_id, u.first_name, u.last_name, u.username, u.access_until,
               pr.created_at AS requested_at, NULL::timestamptz AS approved_at
        FROM payment_requests pr
        JOIN users u ON u.id = pr.user_id
        WHERE pr.status = 'pending' AND u.access_until IS NULL
        ORDER BY pr.created_at DESC
      `;
    } else if (filter === 'pending_renewal') {
      query = `
        SELECT u.id, u.telegram_id, u.first_name, u.last_name, u.username, u.access_until,
               pr.created_at AS requested_at, NULL::timestamptz AS approved_at
        FROM payment_requests pr
        JOIN users u ON u.id = pr.user_id
        WHERE pr.status = 'pending' AND u.access_until IS NOT NULL
        ORDER BY pr.created_at DESC
      `;
    } else {
      return res.status(400).json({ error: 'Notogri filter' });
    }

    var result = await pool.query(query, params);
    return res.json({ ok: true, students: result.rows });
  } catch (error) {
    console.error('ADMIN STUDENTS DETAIL LIST ERROR:', error);
    return res.status(500).json({ error: 'Royxatni olishda xato' });
  }
});

// ======================================================
// ADMIN STUDENTS
// ======================================================

app.post('/api/admin/students', requireAdmin, async function (req, res) {
  try {
    var result = await pool.query(
      'SELECT u.id, u.telegram_id, u.first_name, u.last_name, u.phone, u.username, u.access_until, u.created_at, COUNT(DISTINCT CASE WHEN p.watched = true THEN p.lesson_id END)::int AS watched_lessons, (SELECT COUNT(*)::int FROM lessons) AS total_lessons FROM users u LEFT JOIN progress p ON p.user_id = u.id GROUP BY u.id ORDER BY u.created_at DESC'
    );

    var lastPositionResult = await pool.query(`
      SELECT DISTINCT ON (p.user_id) p.user_id, l.title AS lesson_title, m.title AS module_title, c.title AS course_title, p.watched_at
      FROM progress p
      JOIN lessons l ON l.id = p.lesson_id
      JOIN modules m ON m.id = l.module_id
      LEFT JOIN courses c ON c.id = m.course_id
      WHERE p.watched = true
      ORDER BY p.user_id, p.watched_at DESC
    `);
    var lastPositionMap = {};
    lastPositionResult.rows.forEach(function (r) { lastPositionMap[r.user_id] = r; });

    var students = result.rows.map(function (s) {
      var pos = lastPositionMap[s.id];
      return {
        id: s.id, telegram_id: s.telegram_id.toString(),
        first_name: s.first_name || '', last_name: s.last_name || '',
        phone: s.phone || null, username: s.username || null,
        access_until: s.access_until || null, created_at: s.created_at,
        watched_lessons: s.watched_lessons, total_lessons: s.total_lessons,
        has_access: s.access_until && new Date(s.access_until) > new Date(),
        current_position: pos ? { course_title: pos.course_title, module_title: pos.module_title, lesson_title: pos.lesson_title, watched_at: pos.watched_at } : null
      };
    });

    return res.json({ ok: true, students: students });
  } catch (error) {
    console.error('ADMIN STUDENTS ERROR:', error);
    return res.status(500).json({ error: 'Oquvchilarni olishda xato' });
  }
});

// ======================================================
// ADMIN STUDENT DETAIL
// ======================================================

app.post('/api/admin/student/:id', requireAdmin, async function (req, res) {
  try {
    var studentResult = await pool.query(
      'SELECT id, telegram_id, first_name, last_name, phone, username, access_until, is_banned, banned_reason, banned_at, device_last_seen, created_at FROM users WHERE id = $1 LIMIT 1',
      [req.params.id]
    );
    var student = studentResult.rows[0];
    if (!student) return res.status(404).json({ error: 'Oquvchi topilmadi' });

    var progressResult = await pool.query(
      'SELECT m.id AS module_id, m.title AS module_title, m.order_index AS module_order, m.course_id AS course_id, l.id AS lesson_id, l.title AS lesson_title, l.order_index AS lesson_order, COALESCE(p.watched, false) AS watched FROM modules m LEFT JOIN lessons l ON l.module_id = m.id LEFT JOIN progress p ON p.lesson_id = l.id AND p.user_id = $1 ORDER BY m.order_index ASC, l.order_index ASC, l.id ASC',
      [student.id]
    );

    var testResult = await pool.query(
      'SELECT mr.module_id, m.title AS module_title, mr.passed, mr.score, mr.attempted_at FROM module_results mr JOIN modules m ON m.id = mr.module_id WHERE mr.user_id = $1 ORDER BY m.order_index ASC',
      [student.id]
    );

    var activityResult = await pool.query(`
      SELECT ua.*,
             l.title AS lesson_title, m.title AS module_title,
             qm.title AS quiz_module_title,
             ROUND(EXTRACT(EPOCH FROM (NOW() - ua.last_heartbeat_at)))::int AS seconds_ago
      FROM user_activity ua
      LEFT JOIN lessons l ON l.id = ua.lesson_id
      LEFT JOIN modules m ON m.id = l.module_id
      LEFT JOIN modules qm ON qm.id = ua.module_id
      WHERE ua.user_id = $1
      LIMIT 1
    `, [student.id]);

    var coursesResult = await pool.query('SELECT id, title FROM courses ORDER BY order_index ASC, id ASC');
    var modulesForGrantResult = await pool.query('SELECT id, course_id, title, order_index FROM modules ORDER BY order_index ASC, id ASC');
    var grantsResult = await pool.query('SELECT module_id FROM module_access_grants WHERE user_id = $1', [student.id]);
    var grantedModuleIds = grantsResult.rows.map(function (r) { return r.module_id; });

    return res.json({
      ok: true,
      student: {
        id: student.id, telegram_id: student.telegram_id.toString(),
        first_name: student.first_name || '', last_name: student.last_name || '',
        phone: student.phone || null, username: student.username || null,
        access_until: student.access_until || null, created_at: student.created_at,
        has_access: student.access_until && new Date(student.access_until) > new Date(),
        is_banned: Boolean(student.is_banned),
        banned_reason: student.banned_reason || null,
        banned_at: student.banned_at || null,
        device_last_seen: student.device_last_seen || null
      },
      activity: activityResult.rows[0] || null,
      progress: progressResult.rows,
      tests: testResult.rows,
      courses: coursesResult.rows,
      modules: modulesForGrantResult.rows,
      granted_module_ids: grantedModuleIds
    });
  } catch (error) {
    console.error('ADMIN STUDENT DETAIL ERROR:', error);
    return res.status(500).json({ error: 'Oquvchi malumotlarini olishda xato' });
  }
});

// ======================================================
// ADMIN STUDENT ACCESS
// ======================================================

app.post('/api/admin/student/:id/access', requireAdmin, async function (req, res) {
  try {
    var accessUntil = req.body.access_until;
    if (!accessUntil) return res.status(400).json({ error: 'access_until majburiy' });

    var studentResult = await pool.query(
      'SELECT id, telegram_id, access_until FROM users WHERE id = $1 LIMIT 1',
      [req.params.id]
    );
    if (studentResult.rows.length === 0) return res.status(404).json({ error: 'Oquvchi topilmadi' });

    var wasAlreadyActive = studentResult.rows[0].access_until && new Date(studentResult.rows[0].access_until) > new Date();
    var newAccessUntil = new Date(accessUntil);
    var isGrantingOrExtending = newAccessUntil > new Date();

    var studentTelegramId = studentResult.rows[0].telegram_id;

    if (isGrantingOrExtending) {
      await pool.query(
        'UPDATE users SET access_until = $1 WHERE id = $2',
        [newAccessUntil, req.params.id]
      );

      await pool.query(
        "UPDATE payment_requests SET status = 'approved', approved_at = NOW() WHERE user_id = $1 AND status = 'pending'",
        [req.params.id]
      );
      console.log('STUDENT ACCESS GRANTED: user_id=' + req.params.id);

      if (studentTelegramId) {
        botModule.sendAccessGrantedMessage(studentTelegramId, newAccessUntil, wasAlreadyActive).catch(function (e) {
          console.warn('Access granted xabari yuborilmadi:', e.message);
        });
      }
    } else {
      // Kirish huquqi cheklansa/tugatilsa — o'quvchi boshidagi ("yangi o'quvchi") holatiga to'liq qaytariladi:
      // muddat, progress, test natijalari, alohida modul ruxsatlari va qurilma bog'lanishi tozalanadi
      await pool.query(
        'UPDATE users SET access_until = NULL, active_device_id = NULL, device_last_seen = NULL WHERE id = $1',
        [req.params.id]
      );
      await pool.query('DELETE FROM progress WHERE user_id = $1', [req.params.id]);
      await pool.query('DELETE FROM module_results WHERE user_id = $1', [req.params.id]);
      await pool.query('DELETE FROM module_access_grants WHERE user_id = $1', [req.params.id]);
      await pool.query('DELETE FROM practice_submissions WHERE user_id = $1', [req.params.id]);
      await pool.query('DELETE FROM course_completions WHERE user_id = $1', [req.params.id]);
      await pool.query(
        "UPDATE payment_requests SET status = 'cancelled' WHERE user_id = $1 AND status = 'pending'",
        [req.params.id]
      );

      console.log('STUDENT ACCESS LIMITED (full reset): user_id=' + req.params.id);

      if (studentTelegramId) {
        botModule.sendAccessLimitedMessage(studentTelegramId).catch(function (e) {
          console.warn('Access limited xabari yuborilmadi:', e.message);
        });
      }
    }

    return res.json({ ok: true, message: isGrantingOrExtending ? 'Kirish huquqi berildi' : 'Kirish huquqi cheklandi va oquvchi boshlangich holatga qaytarildi' });
  } catch (error) {
    console.error('ADMIN STUDENT ACCESS ERROR:', error);
    return res.status(500).json({ error: 'Kirish huquqini berishda xato' });
  }
});

// ======================================================
// ADMIN MODULE ACCESS GRANTS (ketma-ketlikdan tashqari alohida ruxsat)
// ======================================================

app.post('/api/admin/module-access/set', requireAdmin, async function (req, res) {
  try {
    var userId = Number(req.body.user_id);
    var moduleIds = Array.isArray(req.body.module_ids) ? req.body.module_ids.map(Number) : [];

    if (!userId) return res.status(400).json({ error: 'user_id majburiy' });

    var courseId = req.body.course_id ? Number(req.body.course_id) : null;

    if (courseId) {
      // Faqat shu kursga tegishli grantlarni almashtiramiz, boshqa kurslarnikiga tegmaymiz
      await pool.query(
        'DELETE FROM module_access_grants WHERE user_id = $1 AND module_id IN (SELECT id FROM modules WHERE course_id = $2)',
        [userId, courseId]
      );
    } else {
      await pool.query('DELETE FROM module_access_grants WHERE user_id = $1', [userId]);
    }

    for (var i = 0; i < moduleIds.length; i++) {
      await pool.query(
        'INSERT INTO module_access_grants (user_id, module_id) VALUES ($1, $2) ON CONFLICT (user_id, module_id) DO NOTHING',
        [userId, moduleIds[i]]
      );
    }

    return res.json({ ok: true, message: 'Modul ruxsatlari yangilandi' });
  } catch (error) {
    console.error('MODULE ACCESS SET ERROR:', error);
    return res.status(500).json({ error: 'Modul ruxsatlarini saqlashda xato' });
  }
});

// ======================================================
// ADMIN MODULES
// ======================================================

app.post('/api/admin/modules', requireAdmin, async function (req, res) {
  try {
    var courseId = req.body.course_id;
    var query = 'SELECT m.id, m.title, m.description, m.order_index, m.course_id, COUNT(l.id)::int AS lesson_count FROM modules m LEFT JOIN lessons l ON l.module_id = m.id';
    var params = [];
    if (courseId) {
      query += ' WHERE m.course_id = $1';
      params.push(Number(courseId));
    }
    query += ' GROUP BY m.id ORDER BY m.order_index ASC, m.id ASC';
    var result = await pool.query(query, params);
    return res.json({ ok: true, modules: result.rows });
  } catch (error) {
    console.error('ADMIN MODULES ERROR:', error);
    return res.status(500).json({ error: 'Modullarni olishda xato' });
  }
});

// ======================================================
// ADD MODULE
// ======================================================

app.post('/api/admin/modules/add', requireAdmin, async function (req, res) {
  try {
    var courseId = req.body.course_id;
    var title = String(req.body.title || '').trim();
    var description = String(req.body.description || '').trim();

    if (!courseId) return res.status(400).json({ error: 'Kurs tanlanishi majburiy' });
    if (!title) return res.status(400).json({ error: 'Modul nomi majburiy' });

    var courseCheck = await pool.query('SELECT id FROM courses WHERE id = $1 LIMIT 1', [Number(courseId)]);
    if (courseCheck.rows.length === 0) return res.status(404).json({ error: 'Kurs topilmadi' });

    var result = await pool.query(
      'INSERT INTO modules (course_id, title, description, order_index) VALUES ($1, $2, $3, (SELECT COALESCE(MAX(order_index), 0) + 1 FROM modules WHERE course_id = $1)) RETURNING *',
      [Number(courseId), title, description || null]
    );

    console.log('MODULE ADDED: ' + result.rows[0].id);
    return res.json({ ok: true, message: 'Modul qoshildi', module: result.rows[0] });
  } catch (error) {
    console.error('ADD MODULE ERROR:', error);
    return res.status(500).json({ error: 'Modul qoshishda xato' });
  }
});

// ======================================================
// UPDATE MODULE
// ======================================================

app.post('/api/admin/modules/:id/update', requireAdmin, async function (req, res) {
  try {
    var title = String(req.body.title || '').trim();
    var orderIndex = req.body.order_index;
    var hasDescription = req.body.description !== undefined;
    var description = hasDescription ? String(req.body.description || '').trim() : null;

    if (!title) return res.status(400).json({ error: 'Modul nomi majburiy' });
    if (orderIndex === undefined || orderIndex === null) return res.status(400).json({ error: 'Tartib raqami majburiy' });

    var result = hasDescription
      ? await pool.query(
          'UPDATE modules SET title = $1, description = $2, order_index = $3 WHERE id = $4 RETURNING *',
          [title, description || null, Number(orderIndex), req.params.id]
        )
      : await pool.query(
          'UPDATE modules SET title = $1, order_index = $2 WHERE id = $3 RETURNING *',
          [title, Number(orderIndex), req.params.id]
        );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Modul topilmadi' });

    return res.json({ ok: true, message: 'Modul yangilandi', module: result.rows[0] });
  } catch (error) {
    console.error('UPDATE MODULE ERROR:', error);
    return res.status(500).json({ error: 'Modulni yangilashda xato' });
  }
});

// ======================================================
// DELETE MODULE
// ======================================================

app.post('/api/admin/modules/:id/delete', requireAdmin, async function (req, res) {
  try {
    var moduleId = Number(req.params.id);
    var moduleResult = await pool.query('SELECT id FROM modules WHERE id = $1 LIMIT 1', [moduleId]);
    if (moduleResult.rows.length === 0) return res.status(404).json({ error: 'Modul topilmadi' });

    // Delete all related data
    var lessonsResult = await pool.query('SELECT id FROM lessons WHERE module_id = $1', [moduleId]);
    var lessonIds = lessonsResult.rows.map(function (r) { return r.id; });

    if (lessonIds.length > 0) {
      await pool.query('DELETE FROM progress WHERE lesson_id = ANY($1)', [lessonIds]);
      await pool.query('DELETE FROM lesson_files WHERE lesson_id = ANY($1)', [lessonIds]);
      await pool.query('DELETE FROM lessons WHERE module_id = $1', [moduleId]);
    }

    await pool.query('DELETE FROM module_tests WHERE module_id = $1', [moduleId]);
    await pool.query('DELETE FROM module_results WHERE module_id = $1', [moduleId]);
    await pool.query('DELETE FROM modules WHERE id = $1', [moduleId]);

    console.log('MODULE DELETED: ' + moduleId);
    return res.json({ ok: true, message: 'Modul ochirildi' });
  } catch (error) {
    console.error('DELETE MODULE ERROR:', error);
    return res.status(500).json({ error: 'Modulni ochirishda xato' });
  }
});

// ======================================================
// ADMIN MODULE LESSONS
// ======================================================

app.post('/api/admin/module/:id/lessons', requireAdmin, async function (req, res) {
  try {
    var moduleResult = await pool.query(
      'SELECT id, title, order_index FROM modules WHERE id = $1 LIMIT 1',
      [req.params.id]
    );
    if (moduleResult.rows.length === 0) return res.status(404).json({ error: 'Modul topilmadi' });

    var result = await pool.query(
      'SELECT l.id, l.module_id, l.title, l.order_index, l.youtube_url, l.task_text, l.is_free, l.bunny_video_id, l.warning_text, COUNT(lf.id)::int AS file_count FROM lessons l LEFT JOIN lesson_files lf ON lf.lesson_id = l.id WHERE l.module_id = $1 GROUP BY l.id ORDER BY l.order_index ASC, l.id ASC',
      [req.params.id]
    );

    return res.json({ ok: true, module: moduleResult.rows[0], lessons: result.rows });
  } catch (error) {
    console.error('ADMIN MODULE LESSONS ERROR:', error);
    return res.status(500).json({ error: 'Darslarni olishda xato' });
  }
});

// ======================================================
// CREATE LESSON
// ======================================================

app.post('/api/admin/lesson', requireAdmin, async function (req, res) {
  try {
    var moduleId = req.body.module_id;
    var title = req.body.title;
    var fileName = req.body.file_name;
    var fileUrl = req.body.file_url;

    if (!moduleId || !title) {
      return res.status(400).json({ error: 'Modul va dars nomi majburiy' });
    }

    var moduleResult = await pool.query('SELECT id FROM modules WHERE id = $1 LIMIT 1', [moduleId]);
    if (moduleResult.rows.length === 0) return res.status(404).json({ error: 'Modul topilmadi' });

    // Tartib raqami avtomatik: shu moduldagi eng oxirgi dars raqamidan keyingisi
    var maxOrderResult = await pool.query(
      'SELECT COALESCE(MAX(order_index), 0) AS max_order FROM lessons WHERE module_id = $1',
      [moduleId]
    );
    var orderIndex = Number(maxOrderResult.rows[0].max_order) + 1;

    var result = await pool.query(
      'INSERT INTO lessons (module_id, title, order_index, youtube_url, task_text, is_free, bunny_video_id, warning_text) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [Number(moduleId), title.trim(), orderIndex, req.body.youtube_url || null, req.body.task_text || null, Boolean(req.body.is_free), req.body.bunny_video_id || null, req.body.warning_text || null]
    );

    var createdLesson = result.rows[0];

    // Agar dars yaratilayotganda fayl ham berilgan bo'lsa, birdaniga biriktiramiz
    if (fileName && fileUrl && String(fileName).trim() && String(fileUrl).trim()) {
      await pool.query(
        'INSERT INTO lesson_files (lesson_id, file_name, file_url) VALUES ($1, $2, $3)',
        [createdLesson.id, String(fileName).trim(), String(fileUrl).trim()]
      );
    }

    return res.json({ ok: true, message: 'Dars muvaffaqiyatli yaratildi', lesson: createdLesson });
  } catch (error) {
    console.error('CREATE LESSON ERROR:', error);
    return res.status(500).json({ error: 'Dars yaratishda server xatosi: ' + error.message });
  }
});

// ======================================================
// UPDATE LESSON
// ======================================================

app.post('/api/admin/lesson/:id/update', requireAdmin, async function (req, res) {
  try {
    var existingResult = await pool.query('SELECT * FROM lessons WHERE id = $1 LIMIT 1', [req.params.id]);
    if (existingResult.rows.length === 0) return res.status(404).json({ error: 'Dars topilmadi' });
    var existing = existingResult.rows[0];

    var moduleId = req.body.module_id !== undefined ? Number(req.body.module_id) : existing.module_id;
    var title = req.body.title ? String(req.body.title).trim() : existing.title;
    var orderIndex = req.body.order_index !== undefined ? Number(req.body.order_index) : existing.order_index;
    var youtubeUrl = req.body.youtube_url !== undefined ? (req.body.youtube_url || null) : existing.youtube_url;
    var bunnyVideoId = req.body.bunny_video_id !== undefined ? (req.body.bunny_video_id || null) : existing.bunny_video_id;
    var taskText = req.body.task_text !== undefined ? (req.body.task_text || null) : existing.task_text;
    var warningText = req.body.warning_text !== undefined ? (req.body.warning_text || null) : existing.warning_text;
    var isFree = req.body.is_free !== undefined ? Boolean(req.body.is_free) : existing.is_free;

    var duplicateResult = await pool.query(
      'SELECT id FROM lessons WHERE module_id = $1 AND order_index = $2 AND id <> $3 LIMIT 1',
      [moduleId, orderIndex, Number(req.params.id)]
    );
    if (duplicateResult.rows.length > 0) {
      return res.status(400).json({ error: 'Bu modulda ushbu tartib raqamli boshqa dars mavjud' });
    }

    var result = await pool.query(
      'UPDATE lessons SET module_id = $1, title = $2, order_index = $3, youtube_url = $4, task_text = $5, is_free = $6, bunny_video_id = $7, warning_text = $8 WHERE id = $9 RETURNING *',
      [moduleId, title, orderIndex, youtubeUrl, taskText, isFree, bunnyVideoId, warningText, Number(req.params.id)]
    );

    // Agar yangilayotganda yangi fayl ham kiritilgan bo'lsa
    var fileName = req.body.file_name;
    var fileUrl = req.body.file_url;
    if (fileName && fileUrl && String(fileName).trim() && String(fileUrl).trim()) {
      await pool.query(
        'INSERT INTO lesson_files (lesson_id, file_name, file_url) VALUES ($1, $2, $3)',
        [Number(req.params.id), String(fileName).trim(), String(fileUrl).trim()]
      );
    }

    return res.json({ ok: true, message: 'Dars muvaffaqiyatli yangilandi', lesson: result.rows[0] });
  } catch (error) {
    console.error('UPDATE LESSON ERROR:', error);
    return res.status(500).json({ error: 'Darsni yangilashda xato: ' + error.message });
  }
});

// ======================================================
// DELETE LESSON
// ======================================================

app.post('/api/admin/lesson/:id/delete', requireAdmin, async function (req, res) {
  try {
    var lessonId = Number(req.params.id);
    var lessonResult = await pool.query('SELECT id FROM lessons WHERE id = $1 LIMIT 1', [lessonId]);
    if (lessonResult.rows.length === 0) return res.status(404).json({ error: 'Dars topilmadi' });

    await pool.query('DELETE FROM progress WHERE lesson_id = $1', [lessonId]);
    await pool.query('DELETE FROM lesson_files WHERE lesson_id = $1', [lessonId]);
    await pool.query('DELETE FROM lessons WHERE id = $1', [lessonId]);

    return res.json({ ok: true, message: 'Dars ochirildi' });
  } catch (error) {
    console.error('DELETE LESSON ERROR:', error);
    return res.status(500).json({ error: 'Darsni ochirishda xato' });
  }
});

// ======================================================
// GET LESSON FILES
// ======================================================

app.post('/api/admin/lesson/:id', requireAdmin, async function (req, res) {
  try {
    var result = await pool.query(
      'SELECT id, module_id, title, order_index, youtube_url, bunny_video_id, task_text, warning_text, is_free FROM lessons WHERE id = $1 LIMIT 1',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Dars topilmadi' });
    return res.json({ ok: true, lesson: result.rows[0] });
  } catch (error) {
    console.error('ADMIN LESSON DETAIL ERROR:', error);
    return res.status(500).json({ error: 'Darsni olishda xato' });
  }
});

app.post('/api/admin/lesson/:id/files', requireAdmin, async function (req, res) {
  try {
    var lessonResult = await pool.query('SELECT id, title FROM lessons WHERE id = $1 LIMIT 1', [req.params.id]);
    if (lessonResult.rows.length === 0) return res.status(404).json({ error: 'Dars topilmadi' });

    var result = await pool.query(
      'SELECT id, lesson_id, file_name, file_url FROM lesson_files WHERE lesson_id = $1 ORDER BY id ASC',
      [req.params.id]
    );

    return res.json({ ok: true, lesson: lessonResult.rows[0], files: result.rows });
  } catch (error) {
    console.error('GET FILES ERROR:', error);
    return res.status(500).json({ error: 'Materiallarni olishda xato' });
  }
});

// ======================================================
// ADD LESSON FILE
// ======================================================

app.post('/api/admin/lesson/:id/files/add', requireAdmin, async function (req, res) {
  try {
    var fileName = req.body.file_name;
    var fileUrl = req.body.file_url;
    if (!fileName || !fileUrl) return res.status(400).json({ error: 'file_name va file_url majburiy' });

    var lessonResult = await pool.query('SELECT id FROM lessons WHERE id = $1 LIMIT 1', [req.params.id]);
    if (lessonResult.rows.length === 0) return res.status(404).json({ error: 'Dars topilmadi' });

    var result = await pool.query(
      'INSERT INTO lesson_files (lesson_id, file_name, file_url) VALUES ($1, $2, $3) RETURNING *',
      [Number(req.params.id), fileName.trim(), fileUrl.trim()]
    );

    return res.json({ ok: true, message: 'Material qoshildi', file: result.rows[0] });
  } catch (error) {
    console.error('ADD FILE ERROR:', error);
    return res.status(500).json({ error: 'Material qoshishda xato' });
  }
});

// ======================================================
// UPDATE LESSON FILE
// ======================================================

app.post('/api/admin/file/:id/update', requireAdmin, async function (req, res) {
  try {
    var fileName = req.body.file_name;
    var fileUrl = req.body.file_url;
    if (!fileName || !fileUrl) return res.status(400).json({ error: 'file_name va file_url majburiy' });

    var result = await pool.query(
      'UPDATE lesson_files SET file_name = $1, file_url = $2 WHERE id = $3 RETURNING *',
      [fileName.trim(), fileUrl.trim(), Number(req.params.id)]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Material topilmadi' });

    return res.json({ ok: true, message: 'Material yangilandi', file: result.rows[0] });
  } catch (error) {
    console.error('UPDATE FILE ERROR:', error);
    return res.status(500).json({ error: 'Materialni yangilashda xato' });
  }
});

// ======================================================
// DELETE LESSON FILE
// ======================================================

app.post('/api/admin/file/:id/delete', requireAdmin, async function (req, res) {
  try {
    var result = await pool.query(
      'DELETE FROM lesson_files WHERE id = $1 RETURNING id',
      [Number(req.params.id)]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Material topilmadi' });

    return res.json({ ok: true, message: 'Material ochirildi' });
  } catch (error) {
    console.error('DELETE FILE ERROR:', error);
    return res.status(500).json({ error: 'Materialni ochirishda xato' });
  }
});

// ======================================================
// ADMIN LIST
// ======================================================

app.post('/api/admin/admins', requireAdmin, requireSuperAdmin, async function (req, res) {
  try {
    var result = await pool.query(
      'SELECT id, telegram_id, first_name, role, created_at FROM admins ORDER BY created_at ASC NULLS FIRST, id ASC'
    );

    var admins = result.rows.map(function (admin) {
      return {
        id: admin.id, telegram_id: admin.telegram_id.toString(),
        first_name: admin.first_name || '', role: admin.role, created_at: admin.created_at
      };
    });

    var mainAdminExists = admins.some(function (admin) {
      return String(admin.telegram_id) === String(ADMIN_TELEGRAM_ID);
    });

    if (!mainAdminExists) {
      admins.unshift({
        id: null, telegram_id: String(ADMIN_TELEGRAM_ID),
        first_name: 'Super Admin', role: 'super_admin', created_at: null
      });
    }

    return res.json({ ok: true, admins: admins });
  } catch (error) {
    console.error('ADMIN LIST ERROR:', error);
    return res.status(500).json({ error: 'Adminlarni olishda xato' });
  }
});

// ======================================================
// ADD ADMIN
// ======================================================

app.post('/api/admin/admins/add', requireAdmin, requireSuperAdmin, async function (req, res) {
  try {
    var telegramId = String(req.body.telegram_id || '').trim();
    var firstName = String(req.body.first_name || '').trim();
    var requestedRole = String(req.body.role || 'admin').trim();

    if (!telegramId) return res.status(400).json({ error: 'Telegram ID majburiy' });
    if (!/^\d+$/.test(telegramId)) return res.status(400).json({ error: 'Telegram ID faqat raqamlardan iborat bolishi kerak' });

    var selectedRole = requestedRole === 'super_admin' ? 'super_admin' : 'admin';

    if (telegramId === String(ADMIN_TELEGRAM_ID)) {
      return res.status(400).json({ error: 'Bu Telegram ID allaqachon asosiy Super Admin hisoblanadi' });
    }

    var result = await pool.query(
      'INSERT INTO admins (telegram_id, first_name, role) VALUES ($1, $2, $3) ON CONFLICT (telegram_id) DO UPDATE SET first_name = EXCLUDED.first_name, role = EXCLUDED.role RETURNING id, telegram_id, first_name, role, created_at',
      [telegramId, firstName, selectedRole]
    );

    var admin = result.rows[0];
    await unbanAllAdmins();
    console.log('ADMIN ADDED/UPDATED: ' + admin.telegram_id + ' ROLE: ' + admin.role);

    return res.json({
      ok: true, message: 'Admin muvaffaqiyatli qoshildi',
      admin: {
        id: admin.id, telegram_id: admin.telegram_id.toString(),
        first_name: admin.first_name || '', role: admin.role, created_at: admin.created_at
      }
    });
  } catch (error) {
    console.error('ADD ADMIN ERROR:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Bu Telegram ID bilan admin allaqachon mavjud' });
    }
    return res.status(500).json({ error: 'Admin qoshishda xato: ' + error.message });
  }
});

// ======================================================
// DELETE ADMIN
// ======================================================

app.post('/api/admin/admins/:id/delete', requireAdmin, requireSuperAdmin, async function (req, res) {
  try {
    var adminId = Number(req.params.id);
    if (!Number.isInteger(adminId) || adminId <= 0) {
      return res.status(400).json({ error: 'Admin ID notogri' });
    }

    var targetResult = await pool.query(
      'SELECT id, telegram_id, first_name, role FROM admins WHERE id = $1 LIMIT 1',
      [adminId]
    );
    var target = targetResult.rows[0];
    if (!target) return res.status(404).json({ error: 'Admin topilmadi' });

    var targetTelegramId = String(target.telegram_id);
    if (targetTelegramId === String(ADMIN_TELEGRAM_ID)) {
      return res.status(400).json({ error: 'Asosiy Super Adminni ochirib bolmaydi' });
    }
    if (target.role === 'super_admin') {
      return res.status(400).json({ error: 'Super Adminni ochirib bolmaydi' });
    }

    await pool.query('DELETE FROM admins WHERE id = $1', [adminId]);
    console.log('ADMIN DELETED: ' + targetTelegramId);

    return res.json({ ok: true, message: 'Admin ochirildi' });
  } catch (error) {
    console.error('DELETE ADMIN ERROR:', error);
    return res.status(500).json({ error: 'Adminni ochirishda xato: ' + error.message });
  }
});

// ======================================================
// ADMIN FAQS CRUD (Talab 2)
// ======================================================

app.post('/api/admin/faq/add', requireAdmin, async function (req, res) {
  try {
    var question = String(req.body.question || '').trim();
    var answer = String(req.body.answer || '').trim();
    var author = String(req.body.author || 'Admin').trim();

    if (!question || !answer) return res.status(400).json({ error: 'Savol va javob majburiy' });

    var result = await pool.query(
      'INSERT INTO faqs (question, answer, author, order_index) VALUES ($1, $2, $3, (SELECT COALESCE(MAX(order_index), 0) + 1 FROM faqs)) RETURNING *',
      [question, answer, author]
    );

    return res.json({ ok: true, faq: result.rows[0] });
  } catch (error) {
    console.error('ADD FAQ ERROR:', error);
    return res.status(500).json({ error: 'Savol qo‘shishda xatolik' });
  }
});

app.post('/api/admin/faq/:id/update', requireAdmin, async function (req, res) {
  try {
    var question = String(req.body.question || '').trim();
    var answer = String(req.body.answer || '').trim();
    var author = String(req.body.author || 'Admin').trim();

    if (!question || !answer) return res.status(400).json({ error: 'Savol va javob majburiy' });

    var result = await pool.query(
      'UPDATE faqs SET question = $1, answer = $2, author = $3 WHERE id = $4 RETURNING *',
      [question, answer, author, Number(req.params.id)]
    );

    return res.json({ ok: true, faq: result.rows[0] });
  } catch (error) {
    console.error('UPDATE FAQ ERROR:', error);
    return res.status(500).json({ error: 'Savolni yangilashda xato' });
  }
});

app.post('/api/admin/faq/:id/delete', requireAdmin, async function (req, res) {
  try {
    await pool.query('DELETE FROM faqs WHERE id = $1', [Number(req.params.id)]);
    return res.json({ ok: true, message: 'Savol o‘chirildi' });
  } catch (error) {
    console.error('DELETE FAQ ERROR:', error);
    return res.status(500).json({ error: 'Savolni o‘chirishda xato' });
  }
});

// ======================================================
// ADMIN COURSES CRUD (Talab 3)
// ======================================================

app.post('/api/admin/courses/add', requireAdmin, async function (req, res) {
  try {
    var title = String(req.body.title || '').trim();
    var subtitle = String(req.body.subtitle || '').trim();
    var price = String(req.body.price || '1 500 000 so‘m').trim();
    var totalModules = Number(req.body.total_modules) || 0;
    var totalLessons = Number(req.body.total_lessons) || 0;
    var releaseDate = String(req.body.release_date || 'Qoralama').trim();
    var coverUrl = String(req.body.cover_url || '').trim();
    var status = String(req.body.status || 'draft').trim();
    if (status !== 'active' && status !== 'draft') status = 'draft';
    var categories = Array.isArray(req.body.categories) && req.body.categories.length
      ? req.body.categories.map(function (c) { return String(c).trim(); }).filter(Boolean)
      : ['Boshqa'];
    var category = categories[0];
    var discountPrice = req.body.discount_price ? String(req.body.discount_price).trim() : null;
    var discountUntil = req.body.discount_until ? new Date(req.body.discount_until) : null;
    var isFeatured = Boolean(req.body.is_featured);

    if (!title) return res.status(400).json({ error: 'Kurs nomi majburiy' });

    var result = await pool.query(
      'INSERT INTO courses (title, subtitle, price, total_modules, total_lessons, release_date, cover_url, status, category, categories, discount_price, discount_until, is_featured, order_index) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, (SELECT COALESCE(MAX(order_index), 0) + 1 FROM courses)) RETURNING *',
      [title, subtitle, price, totalModules, totalLessons, releaseDate, coverUrl, status, category, categories, discountPrice || null, discountUntil, isFeatured]
    );

    return res.json({ ok: true, course: result.rows[0] });
  } catch (error) {
    console.error('ADD COURSE ERROR:', error);
    return res.status(500).json({ error: 'Kurs qo‘shishda xato' });
  }
});

app.post('/api/admin/courses/:id/update', requireAdmin, async function (req, res) {
  try {
    var title = String(req.body.title || '').trim();
    var subtitle = String(req.body.subtitle || '').trim();
    var price = String(req.body.price || '').trim();
    var totalModules = Number(req.body.total_modules) || 0;
    var totalLessons = Number(req.body.total_lessons) || 0;
    var releaseDate = String(req.body.release_date || '').trim();
    var coverUrl = String(req.body.cover_url || '').trim();
    var status = String(req.body.status || 'draft').trim();
    if (status !== 'active' && status !== 'draft') status = 'draft';
    var categories = Array.isArray(req.body.categories) && req.body.categories.length
      ? req.body.categories.map(function (c) { return String(c).trim(); }).filter(Boolean)
      : ['Boshqa'];
    var category = categories[0];
    var discountPrice = req.body.discount_price ? String(req.body.discount_price).trim() : null;
    var discountUntil = req.body.discount_until ? new Date(req.body.discount_until) : null;
    var isFeatured = Boolean(req.body.is_featured);

    if (!title) return res.status(400).json({ error: 'Kurs nomi majburiy' });

    var result = await pool.query(
      'UPDATE courses SET title = $1, subtitle = $2, price = $3, total_modules = $4, total_lessons = $5, release_date = $6, cover_url = $7, status = $8, category = $9, categories = $10, discount_price = $11, discount_until = $12, is_featured = $13 WHERE id = $14 RETURNING *',
      [title, subtitle, price, totalModules, totalLessons, releaseDate, coverUrl, status, category, categories, discountPrice || null, discountUntil, isFeatured, Number(req.params.id)]
    );

    return res.json({ ok: true, course: result.rows[0] });
  } catch (error) {
    console.error('UPDATE COURSE ERROR:', error);
    return res.status(500).json({ error: 'Kursni yangilashda xato' });
  }
});

app.post('/api/admin/courses/:id/status', requireAdmin, async function (req, res) {
  try {
    var courseId = Number(req.params.id);
    var status = String(req.body.status || 'draft').trim();
    if (status !== 'active' && status !== 'draft') {
      status = 'draft';
    }
    var result = await pool.query(
      'UPDATE courses SET status = $1 WHERE id = $2 RETURNING *',
      [status, courseId]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Kurs topilmadi' });
    }
    return res.json({ ok: true, course: result.rows[0] });
  } catch (error) {
    console.error('UPDATE COURSE STATUS ERROR:', error);
    return res.status(500).json({ error: 'Kurs holatini o‘zgartirishda xato' });
  }
});

app.post('/api/admin/courses/:id/toggle-featured', requireAdmin, async function (req, res) {
  try {
    var result = await pool.query(
      'UPDATE courses SET is_featured = NOT COALESCE(is_featured, false) WHERE id = $1 RETURNING *',
      [Number(req.params.id)]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Kurs topilmadi' });
    return res.json({ ok: true, course: result.rows[0] });
  } catch (error) {
    console.error('TOGGLE FEATURED ERROR:', error);
    return res.status(500).json({ error: 'Holatni ozgartirishda xato' });
  }
});

// ======================================================
// YANGILIKLAR (bosh sahifa e'lonlari)
// ======================================================

app.post('/api/admin/announcements', requireAdmin, async function (req, res) {
  try {
    var result = await pool.query('SELECT * FROM announcements ORDER BY publish_at DESC');
    return res.json({ ok: true, announcements: result.rows });
  } catch (error) {
    console.error('ADMIN ANNOUNCEMENTS LIST ERROR:', error);
    return res.status(500).json({ error: 'Yangiliklarni olishda xato' });
  }
});

app.post('/api/admin/announcements/add', requireAdmin, async function (req, res) {
  try {
    var title = String(req.body.title || '').trim();
    var body = String(req.body.body || '').trim();
    var imageUrl = String(req.body.image_url || '').trim();
    var publishAt = req.body.publish_at ? new Date(req.body.publish_at) : new Date();

    if (!body) return res.status(400).json({ error: 'Yangilik matni majburiy' });

    var result = await pool.query(
      'INSERT INTO announcements (title, body, image_url, publish_at) VALUES ($1, $2, $3, $4) RETURNING *',
      [title || null, body, imageUrl || null, publishAt]
    );

    return res.json({ ok: true, message: 'Yangilik saqlandi', announcement: result.rows[0] });
  } catch (error) {
    console.error('ADD ANNOUNCEMENT ERROR:', error);
    return res.status(500).json({ error: 'Yangilik qoshishda xato' });
  }
});

app.post('/api/admin/announcements/:id/update', requireAdmin, async function (req, res) {
  try {
    var title = String(req.body.title || '').trim();
    var body = String(req.body.body || '').trim();
    var imageUrl = String(req.body.image_url || '').trim();
    var publishAt = req.body.publish_at ? new Date(req.body.publish_at) : new Date();

    if (!body) return res.status(400).json({ error: 'Yangilik matni majburiy' });

    var result = await pool.query(
      'UPDATE announcements SET title = $1, body = $2, image_url = $3, publish_at = $4 WHERE id = $5 RETURNING *',
      [title || null, body, imageUrl || null, publishAt, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Yangilik topilmadi' });

    return res.json({ ok: true, message: 'Yangilik yangilandi', announcement: result.rows[0] });
  } catch (error) {
    console.error('UPDATE ANNOUNCEMENT ERROR:', error);
    return res.status(500).json({ error: 'Yangilikni yangilashda xato' });
  }
});

app.post('/api/admin/announcements/:id/delete', requireAdmin, async function (req, res) {
  try {
    await pool.query('DELETE FROM announcements WHERE id = $1', [req.params.id]);
    return res.json({ ok: true, message: 'Yangilik ochirildi' });
  } catch (error) {
    console.error('DELETE ANNOUNCEMENT ERROR:', error);
    return res.status(500).json({ error: 'Yangilikni ochirishda xato' });
  }
});

app.post('/api/admin/courses/:id/delete', requireAdmin, async function (req, res) {
  try {
    await pool.query('DELETE FROM courses WHERE id = $1', [Number(req.params.id)]);
    return res.json({ ok: true, message: 'Kurs o‘chirildi' });
  } catch (error) {
    console.error('DELETE COURSE ERROR:', error);
    return res.status(500).json({ error: 'Kursni o‘chirishda xato' });
  }
});

// ======================================================
// ADMIN SETTINGS (Talab 1 & 5: Aloqa & Rasm)
// ======================================================

app.post('/api/admin/settings/update', requireAdmin, async function (req, res) {
  try {
    var contactTelegram = String(req.body.contact_telegram || '').trim().replace(/^@/, '');
    var contactPhone = String(req.body.contact_phone || '').trim();
    var adminPhotoUrl = String(req.body.admin_photo_url || '').trim();

    if (contactTelegram) {
      await pool.query('INSERT INTO academy_settings (key, value) VALUES (\'contact_telegram\', $1) ON CONFLICT (key) DO UPDATE SET value = $1', [contactTelegram]);
    }
    if (contactPhone) {
      await pool.query('INSERT INTO academy_settings (key, value) VALUES (\'contact_phone\', $1) ON CONFLICT (key) DO UPDATE SET value = $1', [contactPhone]);
    }
    if (adminPhotoUrl) {
      await pool.query('INSERT INTO academy_settings (key, value) VALUES (\'admin_photo_url\', $1) ON CONFLICT (key) DO UPDATE SET value = $1', [adminPhotoUrl]);
    }

    return res.json({ ok: true, message: 'Sozlamalar saqlandi' });
  } catch (error) {
    console.error('SETTINGS UPDATE ERROR:', error);
    return res.status(500).json({ error: 'Sozlamalarni saqlashda xato' });
  }
});

// ======================================================
// ADMIN TESTS CRUD (Talab 4)
// ======================================================

app.post('/api/admin/tests/add', requireAdmin, async function (req, res) {
  try {
    var moduleId = Number(req.body.module_id);
    var question = String(req.body.question || '').trim();
    var options = req.body.options;
    var correctIndex = Number(req.body.correct_index) || 0;

    if (!moduleId || !question || !options) {
      return res.status(400).json({ error: 'Modul, savol va variantlar majburiy' });
    }

    var optionsJson = typeof options === 'string' ? options : JSON.stringify(options);

    var result = await pool.query(
      'INSERT INTO module_tests (module_id, question, options, correct_index, order_index) VALUES ($1, $2, $3, $4, (SELECT COALESCE(MAX(order_index), 0) + 1 FROM module_tests WHERE module_id = $1)) RETURNING *',
      [moduleId, question, optionsJson, correctIndex]
    );

    return res.json({ ok: true, test: result.rows[0] });
  } catch (error) {
    console.error('ADD TEST ERROR:', error);
    return res.status(500).json({ error: 'Test qo‘shishda xato' });
  }
});

app.post('/api/admin/test/:id/delete', requireAdmin, async function (req, res) {
  try {
    await pool.query('DELETE FROM module_tests WHERE id = $1', [Number(req.params.id)]);
    return res.json({ ok: true, message: 'Test o‘chirildi' });
  } catch (error) {
    console.error('DELETE TEST ERROR:', error);
    return res.status(500).json({ error: 'Testni o‘chirishda xato' });
  }
});


// ======================================================
// ADMIN TEST NOTIFICATION
// ======================================================

app.post('/api/admin-test', requireAdmin, async function (req, res) {
  try {
    await notifyAdmin(
      'TEST XABARI\n\nTelegram Admin ID: ' + ADMIN_TELEGRAM_ID + '\n\nSorov yuborgan admin: ' + (req.admin.first_name || 'Nomalum') + '\n\nMini App serveridan test xabari.'
    );
    return res.json({ ok: true, message: 'Admin Telegramiga test xabari yuborildi' });
  } catch (error) {
    console.error('ADMIN TEST ERROR:', error);
    return res.status(500).json({ ok: false, error: error.message });
  }
});

// ======================================================
// HEALTH CHECK
// ======================================================

app.get('/api/health', async function (req, res) {
  try {
    await pool.query('SELECT 1');
    return res.json({
      ok: true, message: 'Server ishlayapti',
      database: 'connected', admin_telegram_id: ADMIN_TELEGRAM_ID
    });
  } catch (error) {
    console.error('HEALTH DATABASE ERROR:', error);
    return res.status(500).json({
      ok: false, message: 'Server ishlayapti, lekin database bilan aloqa yoq', database: 'error'
    });
  }
});

// ======================================================
// SERVER START
// ======================================================

app.listen(PORT, function () {
  console.log('==========================================');
  console.log('Server ' + PORT + '-portda ishga tushdi');
  console.log('Admin Telegram ID: ' + ADMIN_TELEGRAM_ID);
  console.log('==========================================');
});
