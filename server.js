require('dotenv').config();

var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
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
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT false');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ');
    await pool.query('ALTER TABLE payment_requests ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()');
    await pool.query('ALTER TABLE payment_requests ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ');
    await pool.query('ALTER TABLE payment_requests ADD COLUMN IF NOT EXISTS approved_by BIGINT');
    await pool.query('ALTER TABLE modules ADD COLUMN IF NOT EXISTS course_id INT REFERENCES courses(id) ON DELETE SET NULL');
    await pool.query("ALTER TABLE courses ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Boshqa'");
    await pool.query("ALTER TABLE courses ADD COLUMN IF NOT EXISTS categories TEXT[]");
    await pool.query("ALTER TABLE courses ADD COLUMN IF NOT EXISTS discount_price VARCHAR(100)");
    await pool.query("ALTER TABLE courses ADD COLUMN IF NOT EXISTS discount_until TIMESTAMPTZ");
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
    
    // Sozlamalar jadvali (telefon, telegram link, admin rasm)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS academy_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT
      )
    `);

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

    await pool.query(`
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS show_on_home BOOLEAN DEFAULT false;
    `);

    // Testimonials (O'quvchilar fikri) jadvali (Talab 5)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        role VARCHAR(255) DEFAULT 'O''quvchi',
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

    // Default aloqa va ijtimoiy tarmoq sozlamalari
    await pool.query(`
      INSERT INTO academy_settings (key, value) VALUES
      ('contact_telegram', 'texnikuzb'),
      ('contact_phone', '+998900000000'),
      ('admin_photo_url', '/admin.jpg'),
      ('social_telegram', 'https://t.me/yoshuzbekk'),
      ('social_instagram', 'https://instagram.com/yoshuzbekk'),
      ('social_youtube', 'https://youtube.com/@yoshuzbekk'),
      ('social_channel', 'https://t.me/yoshuzbekk_academy')
      ON CONFLICT (key) DO NOTHING
    `);

    // Testimonials default yozuvlari
    var tCount = await pool.query('SELECT COUNT(*)::int AS count FROM testimonials');
    if (tCount.rows[0].count === 0) {
      await pool.query(`
        INSERT INTO testimonials (name, text, role, order_index) VALUES
        ('Sardor M.', 'Darslar juda tushunarli va amaliy. Revitda loyiha chizishni 0 dan o''rgandim.', 'Arxitektor', 1),
        ('Malika K.', 'Revit shablonlari va ishchi chizmalar tayyorlash bo''yicha eng zo''r akademiya!', 'Dizayner', 2),
        ('Jasur B.', 'Har bir darsda yangi qulayliklar bor. Oilalar va materiallar kutubxonasi juda asqotdi.', 'BIM Modeler', 3)
      `);
    }

    // Kamida 1 ta kurs bosh sahifada ko'rinishini ta'minlash
    try {
      var featCheck = await pool.query('SELECT COUNT(*)::int AS c FROM courses WHERE show_on_home = true');
      if (featCheck.rows[0].c === 0) {
        await pool.query('UPDATE courses SET show_on_home = true WHERE id = (SELECT id FROM courses ORDER BY id ASC LIMIT 1)');
      }
    } catch (fErr) {
      console.warn('FEATURED COURSE SEED WARNING:', fErr.message);
    }

    // Eski standart qiymatni ('yoshuzbekk') haqiqiy admin nikiga bir martalik yangilash
    await pool.query(`
      UPDATE academy_settings
      SET value = 'texnikuzb'
      WHERE key = 'contact_telegram' AND (value = 'yoshuzbekk' OR value = '' OR value IS NULL)
    `);

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

    // 1. O'QUVCHILAR NATIJALARI & RABOCHKA LOYIHALAR SLAYDERI (Talab 3)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS course_showcases (
        id SERIAL PRIMARY KEY,
        course_id INT REFERENCES courses(id) ON DELETE SET NULL,
        course_title VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        student_name VARCHAR(255),
        description TEXT,
        pdf_url TEXT NOT NULL,
        preview_image_url TEXT,
        discount_badge TEXT,
        order_index INT DEFAULT 0,
        selected_pages TEXT DEFAULT '1, 2, 3, 4, 5',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await pool.query(`
      ALTER TABLE course_showcases ADD COLUMN IF NOT EXISTS selected_pages TEXT DEFAULT '1, 2, 3, 4, 5';
    `);

    // Eski dummy/namunaviy soxta chizmalarni o'chirib tozalash
    await pool.query("DELETE FROM course_showcases WHERE pdf_url LIKE '%sample%' OR preview_image_url LIKE '%unsplash%'");

    // 2. KUTUBXONA ERKIN MANBALARI VA TESTLARI (Talab 2)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS library_open_resources (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        description TEXT,
        link_url TEXT,
        test_data JSONB DEFAULT '[]',
        icon VARCHAR(50),
        order_index INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    var lrCount = await pool.query('SELECT COUNT(*)::int AS c FROM library_open_resources');
    if (lrCount.rows[0].c === 0) {
      // Standart ochiq kitoblar va manbalar
      await pool.query(`
        INSERT INTO library_open_resources (type, title, category, description, link_url, icon, order_index)
        VALUES
        (
          'book',
          'Revit 2024: Rasmiy qo''llanma va BIM standartlari (PDF)',
          'Adabiyotlar',
          'Revit interfeysi, modellashtirish prinsiplari, listlar va shablonlar bo''yicha to''liq o''zbekcha va ruscha qo''llanma kitobi.',
          'https://drive.google.com/file/d/1_Revit_Guide_Book/preview',
          '📚',
          1
        ),
        (
          'book',
          'Arxitektura va bino loyihalash me''yorlari (ShNQ & KMK to''plami)',
          'Normativlar',
          'O''zbekiston Respublikasi shaharsozlik normalari va qoidalari: turar-joy va jamoat binolari talablari, xonalar minimal balandligi va maydonlari.',
          'https://drive.google.com/file/d/1_ShNQ_KMK_Standards/preview',
          '📐',
          2
        ),
        (
          'book',
          'Interyer dizaynerlari uchun ergonomika va o''lchamlar (Noifert)',
          'Ergonomika',
          'Mebel joylashuvi, o''tish masofalari, eshik va deraza me''yorlari, oshxona va sanuzel ergonomikasi bo''yicha asosiy spravochnik.',
          'https://drive.google.com/file/d/1_Ergonomika_Noifert/preview',
          '📏',
          3
        ),
        (
          'video',
          'Revit-da 0 dan boshlab xonadon rejasini chizish (Master-klass)',
          'Video dars',
          'Ochiq video darslik: devorlarni to''g''ri darajalarga (Levels) bog''lash, eshik-derazalar o''rnatish va o''lcham zanjirlarini qo''yish.',
          'https://youtu.be/dQw4w9WgXcQ',
          '🎬',
          4
        ),
        (
          'source',
          'Revit Professional Oilalari (Families) Kutubxonasi',
          'Ochiq manba',
          'O''zbekiston interyerlariga mos eshiklar, zamonaviy derazalar, santexnika jihozlari va mebel oilalari to''plami.',
          'https://t.me/texnikuzb',
          '📦',
          5
        )
      `);

      // Erkin sinov testlari
      var freeRevitQuestions = [
        { q: "Revit-da ishchi loyiha faylining asosiy formati qaysi?", options: ["RTE", "RVT", "RFA", "RFT"], correct: 1 },
        { q: "Revit-da yangi qavat balandligini belgilash uchun qaysi elementdan foydalaniladi?", options: ["Grid (O'q)", "Level (Daraja)", "Scope Box", "Section"], correct: 1 },
        { q: "Devor chizilayotganda uning yo'nalishi va ichki/tashqi tomonini tez almashtirish tugmasi qaysi?", options: ["Tab", "Enter", "Space (Probel)", "Shift"], correct: 2 },
        { q: "AutoCAD chizmasini Revit-ga yangilanib turadigan havola sifatida olib kirish qaysi buyruq orqali bajariladi?", options: ["Import CAD", "Link CAD (Svyaz SAPR)", "Open CAD", "Attach CAD"], correct: 1 },
        { q: "Chizmadagi barcha eshik va derazalarning avtomatik hisob-kitob jadvali nima deb ataladi?", options: ["Plan vid", "Spetsifikatsiya (Schedule/Quantities)", "List (Sheet)", "Shablon vid"], correct: 1 }
      ];

      var freeArchQuestions = [
        { q: "Standart turar-joy binolarida polning toza sathi qanday belgi bilan ko'rsatiladi?", options: ["±0.000", "+3.000", "-0.150", "100%"], correct: 0 },
        { q: "Xonadondagi standart kirish eshigining minimal kengligi qancha bo'lishi tavsiya etiladi?", options: ["600 mm", "700 mm", "900 mm", "1200 mm"], correct: 2 },
        { q: "Interyer loyihalashda 'Demontaj rejasi' nima maqsadda chiziladi?", options: ["Yangi quriladigan devorlarni ko'rsatish", "Buziladigan mavjud devor va konstruksiyalarni aniq ko'rsatish", "Mebel sotib olish uchun", "Bo'yoq rangini tanlash uchun"], correct: 1 },
        { q: "Oshxona ishchi yuzasi (stol usti) balandligi standart bo'yicha necha sm bo'lishi maqbul hisoblanadi?", options: ["60 sm", "85-90 sm", "110 sm", "130 sm"], correct: 1 }
      ];

      await pool.query(`
        INSERT INTO library_open_resources (type, title, category, description, test_data, icon, order_index)
        VALUES
        (
          'test',
          'Revit Bazaviy Bilim Testi (Erkin Sinov)',
          'Sinov Testi',
          'Revit dasturidagi asosiy terminlar, fayl turlari va modellashtirish qoidalarini tekshirish uchun bepul test sinovi.',
          $1,
          '🎯',
          6
        ),
        (
          'test',
          'Arxitektura va Chizmachilik Savodxonligi Testi',
          'Sinov Testi',
          'Loyiha chizmalari, o''lchamlar, eshik-deraza standartlari va shaharsozlik me''yorlari bo''yicha erkin sinov testi.',
          $2,
          '📝',
          7
        )
      `, [JSON.stringify(freeRevitQuestions), JSON.stringify(freeArchQuestions)]);
    }

    // 3. QURILISH VA REMONT MATERIALLARI BAZASI (MARKETPLACE / ENSIKLOPEDIYA) (Talab 6)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS construction_materials (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        sub_category VARCHAR(100) NOT NULL,
        image_url TEXT,
        short_desc TEXT,
        what_is_it TEXT,
        dimensions TEXT,
        history TEXT,
        usage_area TEXT,
        pros TEXT,
        cons TEXT,
        uzbekistan_sources TEXT,
        bim_tips TEXT,
        order_index INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    var matCount = await pool.query('SELECT COUNT(*)::int AS c FROM construction_materials');
    if (matCount.rows[0].c === 0) {
      var seedMaterials = [
        {
          title: "LDSP (Laminatsiyalangan DSP)",
          category: "Mebel",
          sub_category: "LDSP",
          image_url: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80",
          short_desc: "Mebel korpuslari, javonlar va shkaflar uchun eng ommabop laminat qoplangan yog'och qirindili plita.",
          what_is_it: "LDSP — yuqori bosim va harorat ostida qatronlar bilan presslangan yog'och qirindilari (DSP) ustiga melamin smolasi shimdirilgan qog'oz plyonka qoplab tayyorlanadigan mebel plitasi. U turli xil yog'och fakturalari, matoviy va glyanets ranglarga ega.",
          dimensions: "Standart formatlar: 2800 x 2070 mm, 2750 x 1830 mm. Qalinliklari: 16 mm (asosiy mebel korpusi), 18 mm, 22 mm, 25 mm.",
          history: "DSP ilk bor 1930-yillarda Germaniyada yog'och chiqindilarini tejash maqsadida yaratilgan. Melamin qoplamali LDSP esa 1960-yillardan boshlab butun dunyo mebel sanoatining asosiy materialiga aylangan.",
          usage_area: "Oshxona garniturlari karkasi, shkaf-kupe, yotoqxona va bolalar xonasi mebellari, ofis stollari, kiyim javonlari.",
          pros: "✅ Hamyonbop narx; Ranglar va fakturalar xilma-xilligi; Mexanik yuklamalarga chidamlilik; Oson kesilishi va yig'ilishi.",
          cons: "❌ Namlikka o'ta ta'sirchan (suv tegsa shishib ketadi); Egiluvchan emas (faqat to'g'ri chiziqli mebellar); Formaldegid smolalari mavjudligi tufayli chetlariga (kromka) sifatli PVX yopishtirilishi shart.",
          uzbekistan_sources: "O'zbekistondagi manbalar: Egger, Kastamonu, Kronospan, Yildiz Entegre dilerlari. Bozorlar: O'rikzor bozori 'Mebelchilar' qatori, Chilonzor 'Kastamonu' rasmiy do'koni, Toshkent halqa yo'lidagi mebel furnitura markazlari.",
          bim_tips: "Revitda mebel oilalarida Material parametri sifatida 'Wood - LDSP Egger' qilib biriktiriladi. 3ds Maxda CoronaPhysicalMtl orqali Diffuse va yengil Roughness (0.4-0.6) kartasi beriladi.",
          order_index: 1
        },
        {
          title: "MDF (O'rta zichlikdagi yog'och tolali plita)",
          category: "Mebel",
          sub_category: "MDF",
          image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
          short_desc: "Frezalash, bo'yash va profilli fasadlar tayyorlash uchun ideal zich va ekologik toza mebel plitasi.",
          what_is_it: "MDF (Medium Density Fibreboard) — mayda yog'och tolalarini tabiiy lignin va parafin bilan yuqori bosimda qizdirib tayyorlanadigan monolit material. Qirindi o'rniga nozik changsimon tolalardan iborat bo'lgani sababli g'ovaksiz va o'ta silliq yuzaga ega.",
          dimensions: "Plita o'lchami: 2800 x 2070 mm, 2440 x 1220 mm. Qalinliklari: 6, 8, 10, 16, 18, 19, 22, 25, 30 mm.",
          history: "1965 yilda AQSHning Nyu-York shtatida birinchi MDF zavodi ishga tushirilgan. 1980-yillardan boshlab frezalangan oshxona fasadlari uchun standart materialga aylangan.",
          usage_area: "Oshxona fasadlari, profilli va klassik naqshli eshiklar, devor panellari (reyka va MDF reykalar), kornizlar, plintuslar.",
          pros: "✅ Chuqur 3D frezalash (ornament, profil) qilish imkoni; Emal bo'yoq bilan mukammal silliq bo'yalishi; Ekologik toza (smolasiz); Zichligi yuqori va namlikka LDSPga qaraganda ancha chidamli.",
          cons: "❌ LDSPga qaraganda 1.5-2 baravar qimmatroq; Yuqori og'irlik (og'ir mebel qismlari); Bo'yalgan yuzasi o'tkir tirnalishlarga sezgir.",
          uzbekistan_sources: "Kastamonu Uzbekistan, AGT dilerlik markazlari, Bek To'pi bozori, O'rikzor mebel do'konlari.",
          bim_tips: "Revitda fasad oilalarida profil chizilib Sweep komandasi bilan chiqariladi. 3ds Maxda bo'yalgan emal effekti uchun yuqori Glossiness va minimal bump beriladi.",
          order_index: 2
        },
        {
          title: "Gazoblok (Avtoklav gazobeton D500)",
          category: "Devor",
          sub_category: "Gazoblok",
          image_url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=80",
          short_desc: "Tashqi devorlar va xonalararo to'siqlar uchun engil, issiq va geometrik aniq qurilish bloki.",
          what_is_it: "Gazoblok — kvars qumi, sement, ohak, suv va alyuminiy kukuni aralashmasidan tayyorlanib, avtoklavda 12 atmosfera bosimi va 190°C bug' ostida pishiriladigan g'ovakli sun'iy tosh.",
          dimensions: "Uzunligi: 600 mm, Balandligi: 200, 250, 300 mm. Qalinligi: 100, 120, 150 mm (pardevor), 200, 250, 300, 400 mm (tashqi devor).",
          history: "1924 yilda shved arxitektori Aksel Eriksson tomonidan patentlangan va 'Ytong' brendi ostida ommalashgan. O'zbekistonda so'nggi 7 yilda eng ommabop qurilish materialiga aylandi.",
          usage_area: "Monolit-karkasli ko'p qavatli binolar to'ldiruvchi tashqi devorlari, kottedjlar va xonalararo pardevorlar.",
          pros: "✅ A'lo darajadagi issiqlik izolyatsiyasi (g'ishtdan 3 baravar issiq); Yengil og'irlik (poydevorga kam yuk); Geometrik o'lcham xatosi 1-2 mm (yupqa kley bilan teriladi); Oson arralanadi va shtroba qilinadi.",
          cons: "❌ To'g'ridan-to'g'ri suv va namlikka uzoq turishi mumkin emas (suvoq va gidroizolyatsiya talab etiladi); Mo'rtroq (og'ir ankerlar uchun maxsus dyubel kerak).",
          uzbekistan_sources: "O'zbekistonda ishlab chiqaruvchilar: Arton Gazobeton, EkoGazobeton, Drenaj, Jomiy qurilish bozori, Chilonzor qurilish materiallari bozori.",
          bim_tips: "Revitda 'Basic Wall - Gazoblok D500 200mm' oilasi yaratiladi va material termal xususiyatlariga issiqlik o'tkazuvchanlik 0.12 W/mK kiritiladi.",
          order_index: 3
        },
        {
          title: "Penoblok (Ko'pikli beton blok)",
          category: "Devor",
          sub_category: "Penoblok",
          image_url: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=800&auto=format&fit=crop&q=80",
          short_desc: "Sement va ko'pik aralashmasidan tabiiy sharoitda quriydigan issiqlik saqlovchi blok.",
          what_is_it: "Penoblok — sement-qum qorishmasiga organik yoki sintetik ko'pikturgich qo'shib, avtoklavsiz tabiiy qotish orqali ishlab chiqariladigan engil beton bloki.",
          dimensions: "600 x 300 x 200 mm, 600 x 300 x 100 mm.",
          history: "XIX asr oxirida ixtiro qilingan, avtoklav talab qilmasligi tufayli kichik sexlarda ishlab chiqarish osonligi bilan keng tarqalgan.",
          usage_area: "Xonalararo to'siq devorlari, omborxonalar, kottejlar va issiqlik izolyatsiyasi qatlamlari.",
          pros: "✅ Arzon narx; Yaxshi tovush va issiqlik yutuvchanlik; Yonmaydi va chirimaydi.",
          cons: "❌ Gazoblokka qaraganda geometriyasi noaniqroq (qalinroq qorishma talab qiladi); Siqilishga chidamliligi pastroq va yoriq berish ehtimoli bor.",
          uzbekistan_sources: "Sergeli qurilish bozori, Rohat bozori, viloyat mahalliy ishlab chiqaruvchi sexlari.",
          bim_tips: "Revitda devor qalinligi 100mm yoki 200mm bo'lgan ichki devor turi sifatida kiritiladi.",
          order_index: 4
        },
        {
          title: "Pishgan g'isht (M100 - M150 Qizil g'isht)",
          category: "Devor",
          sub_category: "G'isht",
          image_url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80",
          short_desc: "Asrlar davomida sinovdan o'tgan mustahkam, uzoq umr ko'ruvchi loy pishig'i.",
          what_is_it: "Tabiiy loy mineral xomashyosini qoliplab, pechlarda 1000°C yuqori haroratda kuydirish orqali olinadigan to'liq yoki teshikli an'anaviy qurilish toshi.",
          dimensions: "O'zbekiston standarti: 250 x 120 x 65 mm (yakka g'isht), 250 x 120 x 88 mm (bir yarimtalik g'isht).",
          history: "Miloddan avvalgi 3000-yillardan beri qadimiy Shumer, Bobil va O'rta Osiyo me'morchiligida ishlatib kelinmoqda.",
          usage_area: "Yuk ko'taruvchi asosiy devorlar, sanuzel va ho'l xonalar to'siqlari, zaminlar va devor qoplamalari.",
          pros: "✅ O'ta yuqori mustahkamlik (M125-M150); 100% namlikka chidamlilik (sanuzellarda devor sifatida birinchi raqamli tanlov); Yuqori tovush izolyatsiyasi; 100+ yil xizmat muddati.",
          cons: "❌ Og'ir vazn; Issiqlikni gazoblokka nisbatan tezroq o'tkazadi (qalinroq terish yoki izolyatsiya kerak); Terish jarayoni ko'p mehnat va vaqt talab qiladi.",
          uzbekistan_sources: "Bekobod, Qibray, Bo'stonliq g'isht zavodlari, Toshkentdagi barcha qurilish mollari bozorlari.",
          bim_tips: "Revitda 'Wall - Pishgan g'isht 120mm' va '250mm' qilib chiziladi. Sanuzel devorlari doim pishgan g'ishtdan olinadi.",
          order_index: 5
        },
        {
          title: "Gipsokarton GKLV (Namlikka chidamli)",
          category: "Shift",
          sub_category: "Gipsokarton",
          image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
          short_desc: "Shiftlar, figuriy pataloklar va pardevorlar uchun yashil rangli namlikka chidamli list.",
          what_is_it: "GKLV — ikki qavat maxsus ishlov berilgan karton orasiga gidrofob qo'shimchalar qo'shilgan gips yadrosi joylashtirilgan list. Rangi doimo och yashil bo'ladi.",
          dimensions: "Standart o'lcham: 2500 x 1200 mm (maydoni 3 m²), Qalinliklari: 9.5 mm (shift uchun yengil), 12.5 mm (devor va pardevor uchun).",
          history: "1894 yilda Ogustin Sekett tomonidan AQSHda ixtiro qilingan. Knauf kompaniyasi orqali dunyo standartiga aylandi.",
          usage_area: "Oshxona va sanuzel shiftlari, ikki sathli gipsokarton pataloklar, korniz nishalari, devorlarni tekislash.",
          pros: "✅ Tez va toza montaj; Har qanday egri chiziqli shakllarni yasash imkoni; Yashil karton qatlami zamburug' va mog'orga chidamli; Bo'yash yoki kafel yopishtirishga tayyor tekis yuza.",
          cons: "❌ Metall karkas (profil) talab qiladi; Kuchli zarbaga chidamliligi g'ishtdan past.",
          uzbekistan_sources: "Knauf Gips Buxoro, Akfa Gipsokarton dilerlari, Jomiy va O'rikzor bozorlari.",
          bim_tips: "Revitda patalok planida (Reflected Ceiling Plan) 'Compound Ceiling - GKLV 12.5mm' sifatida chiziladi va svetilniklar joylanadi.",
          order_index: 6
        },
        {
          title: "Ottocento (Ipak effektli dekorativ bo'yoq)",
          category: "Bezak",
          sub_category: "Ottocento",
          image_url: "https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?w=800&auto=format&fit=crop&q=80",
          short_desc: "Devorlarda tovlanuvchi baxmal va tabiiy ipak matosi ko'rinishini hosil qiluvchi premium qoplama.",
          what_is_it: "Ottocento — maxsus metallashgan va marvaridli pigmentlar hamda suvli akril dispersiyasidan iborat nozik pardozlash bo'yog'i. Yorug'lik tushish burchagiga qarab rangi tovlanadi.",
          dimensions: "1 litr, 2.5 litr, 5 litr bankalarda sotiladi. 1 litr bilan o'rtacha 7-9 m² devor qoplanadi.",
          history: "Italiyaning Oikos kompaniyasi tomonidan Qadimgi Rim ipak matolari sharafiga yaratilgan va interyer dizaynida klassik va neoklassika uslubining timsoliga aylangan.",
          usage_area: "Mehmonxona, yotoqxona devorlari, TV-zona orqa foni, restoran va mehmonxona zallari.",
          pros: "✅ Vizual o'ta hashamatli va qimmatbaho ko'rinish; Choksiz (monolit) yuza; Ekologik toza, hid chiqarmaydi; Uzoq yillar rangini yo'qotmaydi.",
          cons: "❌ Devor yuzasi shpaklyovka orqali oynadek silliq bo'lishi shart; Surkaydigan ustaning yuqori mahorati talab etiladi.",
          uzbekistan_sources: "Oikos Uzbekistan rasmiy saloni, San Marco, Novacolor do'konlari, Parkent qurilish mollari bozori.",
          bim_tips: "Revitda Material qatlamiga 'Paint - Ottocento Pearl' deb nomlanadi. 3ds Maxda CoronaMtl Fresnel IOR=1.6 va Ipak falloff xaritasi bilan teksturalanadi.",
          order_index: 7
        },
        {
          title: "Keramogranit plita (60x120 sm)",
          category: "Pol",
          sub_category: "Keramogranit",
          image_url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80",
          short_desc: "Pol va devorlar uchun mustahkam, tirnalmaydigan marmar va beton fakturali yirik plita.",
          what_is_it: "Keramogranit — loy, dala shpati, kvars va tabiiy pigmentlarni 450 kg/sm² bosimda presslab, 1300°C da monolit qilib eritib olinadigan sun'iy tosh. Suv shimish darajasi deyarli 0% (0.05%).",
          dimensions: "60 x 120 sm, 80 x 80 sm, 80 x 160 sm. Qalinligi: 9 mm - 11 mm.",
          history: "1970-yillarda Italiyaning Sassuolo shahrida kafelning mustahkam muqobili sifatida yaratilgan.",
          usage_area: "Xonadon yo'lagi (prixojka), oshxona poli, sanuzel devor va pollari, dush kabinalari, issiq pol (tyoply pol) usti.",
          pros: "✅ Suv, namlik va kimyoviy vositalarga 100% chidamli; Tirnalmaydi, to'kilmaydi; Issiq pol uchun eng samarali issiqlik o'tkazuvchi material; Yirik o'lchami tufayli oraliq choklar juda kam bo'ladi.",
          cons: "❌ Yalangoyoq yurganda sovuq (issiq pol tavsiya etiladi); Kesish va teshik ochish uchun olmosli maxsus uskuna kerak.",
          uzbekistan_sources: "Kerasun, Modern Keramika, O'zbekistondagi Eko-Kafel do'konlari, Jomiy plitka bozori, Parkent bozori.",
          bim_tips: "Revitda 'Floor - Keramogranit 60x120 + Kley' qilib chiziladi va Pattern orqali 600x1200 model setkasi qo'yiladi.",
          order_index: 8
        },
        {
          title: "Laminat (33-klass, Faskali suvga chidamli)",
          category: "Pol",
          sub_category: "Laminat",
          image_url: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&auto=format&fit=crop&q=80",
          short_desc: "Yotoqxona va mehmonxonalar uchun tabiiy yog'och ko'rinishidagi qulay va iliq pol qoplamasi.",
          what_is_it: "Laminat — yuqori zichlikdagi HDF plitasi asosida tayyorlangan, ustiga yog'och rasmi tushirilgan va korund (olmos changi) qo'shilgan mustahkam himoya qatlami qoplangan pol materiali.",
          dimensions: "1380 x 193 mm, 1285 x 192 mm. Qalinliklari: 8 mm, 10 mm, 12 mm.",
          history: "1977 yilda Shvetsiyaning Perstorp kompaniyasi tomonidan ishlab chiqilgan va tezda parketning eng yaxshi hamyonbop o'rnini egalladi.",
          usage_area: "Yotoqxona, bolalar xonasi, mehmonxona, kabinet va ofislar.",
          pros: "✅ Oson va tez qulflanuvchi (Click) montaj; Tabiiy yog'ochga o'xshash iliq his; Ranglar va teksturalar xilma-xilligi; Qayta ko'chirish mumkinligi.",
          cons: "❌ Suv to'kilib uzoq qolsa choklaridan shishishi mumkin; Tagiga to'g'ri podlojka to'shalishi shart.",
          uzbekistan_sources: "Tarkett Uzbekistan, Egger, Kronotex dilerlari, O'rikzor va Bek To'pi pol qoplamalari qatori.",
          bim_tips: "Revitda zamin qatlami qalinligi 8-10 mm qilib kiritiladi va 'Floor finish' sifatida hisoblanadi.",
          order_index: 9
        },
        {
          title: "Polipropilen truba va fitinglar (PPR PN25)",
          category: "Santexnika",
          sub_category: "Trubalar",
          image_url: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80",
          short_desc: "Ichki issiq va sovuq suv ta'minoti hamda isitish tizimi uchun chidamli plastik quvurlar.",
          what_is_it: "Random kopolimer polipropilendan tayyorlangan, ichida shisha tolali (fiberglass) yoki alyuminiy folga armatura qatlami bo'lgan, issiq ta'sirida erib payvandlanadigan suv quvuri.",
          dimensions: "Diametrlari: 20 mm, 25 mm, 32 mm, 40 mm, 50 mm. Standart uzunligi: 4 metr.",
          history: "1980-yillardan boshlab po'lat va cho'yan quvurlar o'rnini egallagan va zanglamaslik xususiyati bilan inqilob qilgan.",
          usage_area: "Kvartira ichki vodoprovodi, dush va vanna tarmoqlari, radiatorli isitish va kombi tizimlari.",
          pros: "✅ Zanglamaydi, chirimaydi, ichida cho'kindi yig'ilmaydi; Diffuzion payvandlash tufayli ulanish joyi monolit bo'ladi; 50 yil xizmat muddati.",
          cons: "❌ Devor ichiga ko'milishidan oldin bosim ostida gidravlik sinovdan (opressovka) o'tkazilishi shart; O'rnatish uchun maxsus payvandlagich (dazmol) kerak.",
          uzbekistan_sources: "Firat, Kalde, Akfa Plastik, Grand Santexnika do'konlari, O'rikzor santexnika bozori, Jomiy bozori.",
          bim_tips: "Revit MEP da 'Pipe - Polypropylene PPR' tizimida chiziladi va diametrlari avtomatik hisoblanadi.",
          order_index: 10
        },
        {
          title: "Elektr kabeli VVGng-LS (Mis sim)",
          category: "Elektr",
          sub_category: "Kabellar",
          image_url: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&auto=format&fit=crop&q=80",
          short_desc: "Xonadon elektr montaji uchun yong'inga xavfsiz va tutun chiqarmaydigan monolit mis kabel.",
          what_is_it: "VVGng-LS — har bir tomiri alohida PVX izolyatsiyalangan va umumiy yonishni tarqatmaydigan (ng) hamda tutun ajratmaydigan (LS - Low Smoke) qobiqqa o'ralgan yaxlit mis kabel.",
          dimensions: "Rozetkalar uchun: 3 x 2.5 mm²; Yoritish (lyustra, svetilnik) uchun: 3 x 1.5 mm²; Plita va konditsioner uchun: 3 x 4 mm² yoki 3 x 6 mm².",
          history: "Davlat GOST standartlari bo'yicha turar-joy binolarida xavfsizlik maqsadida alyuminiy simlar taqiqlanib, mis VVGng-LS standarti joriy qilingan.",
          usage_area: "Barcha xonalarning devor ichidagi elektr provodkasi, shchitok avtomatlari va rozetkalar.",
          pros: "✅ 100% yonishni davom ettirmaydi; Yuqori elektr o'tkazuvchanlik va qizib ketmaslik; Mexanik mustahkamlik; 30+ yil xizmat kafolati.",
          cons: "❌ Qalbaki va kesimi ingichkaroq qilingan nusxalari ko'p (faqat GOST sertifikatli kabel tanlash shart).",
          uzbekistan_sources: "Uzkabel, Andijankabel dilerlari, Chilonzor elektrobozori, Jomiy va Yangi Bozor elektrotovar do'konlari.",
          bim_tips: "Revit Electrical bo'limida yuklamalar quvvati (Katta kVt) hisoblanib, qaysi guruhga qanday kabel ketishi avtomatik chiqariladi.",
          order_index: 11
        }
      ];

      for (var mi = 0; mi < seedMaterials.length; mi++) {
        var mat = seedMaterials[mi];
        await pool.query(`
          INSERT INTO construction_materials
          (title, category, sub_category, image_url, short_desc, what_is_it, dimensions, history, usage_area, pros, cons, uzbekistan_sources, bim_tips, order_index)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        `, [
          mat.title, mat.category, mat.sub_category, mat.image_url, mat.short_desc,
          mat.what_is_it, mat.dimensions, mat.history, mat.usage_area, mat.pros, mat.cons,
          mat.uzbekistan_sources, mat.bim_tips, mat.order_index
        ]);
      }
      console.log('✅ QURILISH MATERIALLARI BAZASI: ' + seedMaterials.length + ' ta toliq material kiritildi');
    }

    // 4. DONAT VA QO'LLAB-QUVVATLASH SOZLAMALARI (Talab 5)
    await pool.query(`
      INSERT INTO academy_settings (key, value) VALUES
      ('donate_card_number', '8600 5304 1234 5678'),
      ('donate_card_holder', 'Abdulloh S. (YOSHUZBEKK)'),
      ('donate_description', 'Akademiyamiz darslari, ochiq manbalar va bepul testlar rivoji uchun ixtiyoriy moliyaviy qo''llab-quvvatlash (ehson/donat).')
      ON CONFLICT (key) DO NOTHING
    `);

    // ======================================================
    // 5. SUPPORT CARDS (QO'LLAB-QUVVATLASH KARTALARI BAZASI)
    // ======================================================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS support_cards (
        id SERIAL PRIMARY KEY,
        card_type VARCHAR(50) NOT NULL,
        card_number VARCHAR(100) NOT NULL,
        cardholder_name VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    var scCount = await pool.query('SELECT COUNT(*)::int AS count FROM support_cards');
    if (scCount.rows[0].count === 0) {
      await pool.query(`
        INSERT INTO support_cards (card_type, card_number, cardholder_name, is_active) VALUES
        ('UZCARD', '8600 5304 1234 5678', 'ABDULLOH TANGIRBERGANOV', true),
        ('HUMO', '9860 1234 5678 9012', 'ABDULLOH TANGIRBERGANOV', true)
      `);
      console.log('✅ SUPPORT CARDS: Standart UZCARD va HUMO kartalari kiritildi');
    }

    // =================== KUTUBXONA V2: Jadvallar ensureLibraryV2Tables() orqali to'liq sozlanadi ===================
  } catch (error) {
    console.error('INIT EXTENDED TABLES ERROR:', error);
  }
}

// =================== LIVE ACTIVITY & ANALYTICS SCHEMA SETUP ===================
async function ensureUserActivityTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_activity (
        user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Check if column last_seen exists and rename to last_seen_at
    try {
      await pool.query(`
        DO $$
        BEGIN
          IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'user_activity' AND column_name = 'last_seen'
          ) AND NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'user_activity' AND column_name = 'last_seen_at'
          ) THEN
            ALTER TABLE user_activity RENAME COLUMN last_seen TO last_seen_at;
          END IF;
        END $$;
      `);
    } catch (e) {
      console.warn('user_activity rename check:', e.message);
    }

    var uaCols = [
      'ALTER TABLE user_activity ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ DEFAULT NOW()',
      "ALTER TABLE user_activity ADD COLUMN IF NOT EXISTS current_tab VARCHAR(50) DEFAULT 'home'",
      "ALTER TABLE user_activity ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'online'",
      'ALTER TABLE user_activity ADD COLUMN IF NOT EXISTS lesson_id INT',
      'ALTER TABLE user_activity ADD COLUMN IF NOT EXISTS lesson_title VARCHAR(500)',
      'ALTER TABLE user_activity ADD COLUMN IF NOT EXISTS module_title VARCHAR(500)',
      'ALTER TABLE user_activity ADD COLUMN IF NOT EXISTS course_title VARCHAR(500)',
      'ALTER TABLE user_activity ADD COLUMN IF NOT EXISTS video_progress INT DEFAULT 0',
      'ALTER TABLE user_activity ADD COLUMN IF NOT EXISTS video_duration INT DEFAULT 0',
      "ALTER TABLE user_activity ADD COLUMN IF NOT EXISTS video_status VARCHAR(30) DEFAULT 'watching'",
      'ALTER TABLE user_activity ADD COLUMN IF NOT EXISTS module_id INT',
      'ALTER TABLE user_activity ADD COLUMN IF NOT EXISTS test_question_index INT DEFAULT 0',
      'ALTER TABLE user_activity ADD COLUMN IF NOT EXISTS test_total_questions INT DEFAULT 0',
      'ALTER TABLE user_activity ADD COLUMN IF NOT EXISTS device_info VARCHAR(100)',
      'ALTER TABLE user_activity ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()'
    ];

    for (var sql of uaCols) {
      try {
        await pool.query(sql);
      } catch (colErr) {
        console.warn('user_activity col add:', colErr.message);
      }
    }

    try {
      await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id)');
    } catch (uErr) {
      console.warn('idx_user_activity_user_id:', uErr.message);
    }

    try {
      await pool.query('CREATE INDEX IF NOT EXISTS idx_user_activity_last_seen ON user_activity(last_seen_at)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_user_activity_status ON user_activity(status)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_user_activity_lesson ON user_activity(lesson_id)');
    } catch (idxErr) {
      console.warn('user_activity indexes:', idxErr.message);
    }

    // activity_history table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activity_history (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        activity_type VARCHAR(50) NOT NULL,
        lesson_id INT,
        module_id INT,
        duration_seconds INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    var histCols = [
      'ALTER TABLE activity_history ADD COLUMN IF NOT EXISTS activity_type VARCHAR(50)',
      'ALTER TABLE activity_history ADD COLUMN IF NOT EXISTS lesson_id INT',
      'ALTER TABLE activity_history ADD COLUMN IF NOT EXISTS module_id INT',
      'ALTER TABLE activity_history ADD COLUMN IF NOT EXISTS duration_seconds INT DEFAULT 0',
      'ALTER TABLE activity_history ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()'
    ];
    for (var hSql of histCols) {
      try {
        await pool.query(hSql);
      } catch (hErr) {
        console.warn('activity_history col add:', hErr.message);
      }
    }

    try {
      await pool.query('CREATE INDEX IF NOT EXISTS idx_activity_history_created ON activity_history(created_at)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_activity_history_type ON activity_history(activity_type)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_activity_history_user ON activity_history(user_id)');
    } catch (hIdxErr) {
      console.warn('activity_history indexes:', hIdxErr.message);
    }

    console.log('✅ LIVE ACTIVITY: user_activity va activity_history muvaffaqiyatli tekshirildi/sozlandi');
  } catch (err) {
    console.error('ensureUserActivityTable xatosi:', err.message);
  }
}

// =================== DEDICATED LIBRARY BOOKS SCHEMA ===================
let libraryBooksTableReady = false;

async function ensureLibraryBooksTable() {
  try {
    // 1. Ko'p hisobli Google Drive manbalari jadvali
    await pool.query(`
      CREATE TABLE IF NOT EXISTS drive_sources (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        provider VARCHAR(50) NOT NULL DEFAULT 'google_drive',
        root_folder_id VARCHAR(255) NOT NULL,
        api_key TEXT,
        credentials_reference TEXT,
        is_active BOOLEAN DEFAULT true,
        last_sync_at TIMESTAMPTZ,
        last_sync_stats JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // 2. Kitoblar asosiy jadvali
    await pool.query(`
      CREATE TABLE IF NOT EXISTS library_books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL DEFAULT '',
        author VARCHAR(255),
        short_description TEXT NOT NULL DEFAULT '',
        what_you_learn TEXT NOT NULL DEFAULT '',
        categories TEXT[] DEFAULT '{}',
        pdf_url TEXT NOT NULL DEFAULT '',
        cover_url TEXT,
        generated_cover_url TEXT,
        page_count INT DEFAULT 0,
        reading_time_minutes INT DEFAULT 0,
        access_type VARCHAR(20) DEFAULT 'free',
        is_recommended BOOLEAN DEFAULT false,
        status VARCHAR(30) DEFAULT 'published',
        view_count INT DEFAULT 0,
        download_count INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        published_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    var cols = [
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS title VARCHAR(500) NOT NULL DEFAULT ''",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS author VARCHAR(255)",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS short_description TEXT NOT NULL DEFAULT ''",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS what_you_learn TEXT NOT NULL DEFAULT ''",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}'",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS pdf_url TEXT NOT NULL DEFAULT ''",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS cover_url TEXT",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS generated_cover_url TEXT",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS page_count INT DEFAULT 0",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS reading_time_minutes INT DEFAULT 0",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS access_type VARCHAR(20) DEFAULT 'free'",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN DEFAULT false",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'published'",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS view_count INT DEFAULT 0",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS download_count INT DEFAULT 0",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NOW()",
      // Google Drive va AI maydonlari
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS drive_source_id INT REFERENCES drive_sources(id) ON DELETE SET NULL",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS drive_file_id VARCHAR(255)",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS drive_file_name VARCHAR(500)",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS drive_web_view_url TEXT",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS drive_mime_type VARCHAR(100) DEFAULT 'application/pdf'",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS drive_file_size BIGINT DEFAULT 0",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS language VARCHAR(50) DEFAULT 'uz'",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS publication_year VARCHAR(20)",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT false",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS admin_approved BOOLEAN DEFAULT false",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS sync_error TEXT",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS retry_count INT DEFAULT 0",
      "ALTER TABLE library_books ADD COLUMN IF NOT EXISTS last_attempt_at TIMESTAMPTZ"
    ];

    for (var colSql of cols) {
      try {
        await pool.query(colSql);
      } catch (colErr) {
        // ignore if already exists
      }
    }

    try { await pool.query('CREATE INDEX IF NOT EXISTS idx_library_books_status ON library_books(status)'); } catch(e){}
    try { await pool.query('CREATE INDEX IF NOT EXISTS idx_library_books_recommended ON library_books(is_recommended)'); } catch(e){}
    try { await pool.query('CREATE INDEX IF NOT EXISTS idx_library_books_categories ON library_books USING GIN(categories)'); } catch(e){}
    try { await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_library_books_drive_file_id ON library_books(drive_file_id) WHERE drive_file_id IS NOT NULL'); } catch(e){}
    try { await pool.query('CREATE INDEX IF NOT EXISTS idx_library_books_drive_source_id ON library_books(drive_source_id)'); } catch(e){}

    // Default Google Drive manbasi agar mavjud bo'lmasa yaratib qo'yish
    var dsCount = await pool.query('SELECT COUNT(*)::int AS c FROM drive_sources');
    if (dsCount.rows[0].c === 0) {
      await pool.query(`
        INSERT INTO drive_sources (name, provider, root_folder_id, is_active)
        VALUES ('Asosiy Kitoblar (Google Drive)', 'google_drive', '', true)
      `);
    }

    libraryBooksTableReady = true;
    console.log('✅ LIBRARY BOOKS TABLE: library_books va drive_sources jadvallari to\'liq tekshirildi');
  } catch (err) {
    console.error('ensureLibraryBooksTable error:', err.message);
  }
}

// =================== KUTUBXONA 2.0 & SUPPORT SCHEMA SETUP ===================
async function ensureLibraryV2Tables() {
  try {
    // 0. library_views table (MUST exist)
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS library_views (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL,
          resource_id INT NOT NULL,
          viewed_at TIMESTAMPTZ DEFAULT NOW()
        )
      `);
      await pool.query('ALTER TABLE library_views ADD COLUMN IF NOT EXISTS user_id INT');
      await pool.query('ALTER TABLE library_views ADD COLUMN IF NOT EXISTS resource_id INT');
      await pool.query('ALTER TABLE library_views ADD COLUMN IF NOT EXISTS viewed_at TIMESTAMPTZ DEFAULT NOW()');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_library_views_user ON library_views(user_id)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_library_views_resource ON library_views(resource_id)');
    } catch (lvErr) {
      console.warn('ensure library_views:', lvErr.message);
    }

    // 0.1 library_bookmarks table (MUST exist and have resource_id)
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS library_bookmarks (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL,
          resource_id INT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `);
      await pool.query('ALTER TABLE library_bookmarks ADD COLUMN IF NOT EXISTS user_id INT');
      await pool.query('ALTER TABLE library_bookmarks ADD COLUMN IF NOT EXISTS resource_id INT');
      await pool.query('ALTER TABLE library_bookmarks ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_library_bookmarks_user ON library_bookmarks(user_id)');
      
      // If old column exists, migrate values
      await pool.query(`
        DO $$
        BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'library_bookmarks' AND column_name = 'open_resource_id') THEN
            UPDATE library_bookmarks SET resource_id = open_resource_id WHERE resource_id IS NULL;
          END IF;
          IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'library_bookmarks' AND column_name = 'item_id') THEN
            UPDATE library_bookmarks SET resource_id = item_id WHERE resource_id IS NULL;
          END IF;
        END $$;
      `);
    } catch (bmErr) {
      console.warn('ensure library_bookmarks:', bmErr.message);
    }

    // 1. library_sections table
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS library_sections (
          id SERIAL PRIMARY KEY,
          slug VARCHAR(100) NOT NULL UNIQUE,
          name VARCHAR(255) NOT NULL,
          subtitle TEXT,
          icon VARCHAR(50) DEFAULT '📁',
          description TEXT,
          order_index INT DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          is_visible BOOLEAN DEFAULT true,
          settings JSONB DEFAULT '{}',
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `);
      await pool.query('ALTER TABLE library_sections ADD COLUMN IF NOT EXISTS subtitle TEXT');
      await pool.query('ALTER TABLE library_sections ADD COLUMN IF NOT EXISTS icon VARCHAR(50) DEFAULT \'📁\'');
      await pool.query('ALTER TABLE library_sections ADD COLUMN IF NOT EXISTS description TEXT');
      await pool.query('ALTER TABLE library_sections ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0');
      await pool.query('ALTER TABLE library_sections ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true');
      await pool.query('ALTER TABLE library_sections ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true');
      await pool.query('ALTER TABLE library_sections ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT \'{}\'');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_library_sections_order ON library_sections(order_index)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_library_sections_slug ON library_sections(slug)');

      // Seed default 4 sections
      await pool.query(`
        INSERT INTO library_sections (slug, name, subtitle, icon, description, order_index) VALUES
        ('books', 'Kitoblar', 'Kitoblar va o''quv qo''llanmalar', '📚', 'Arxitektura, BIM, interyer va qurilish bo''yicha professional adabiyotlar', 1),
        ('sources', 'Manbalar', 'RVT, RFA, DWG va boshqa fayllar', '📦', 'Revit oilalari, shablonlar, chizmalar va 3D modellar', 2),
        ('tests', 'Testlar', 'Bilimingizni tekshiring', '✓', 'Kurs va darslar bo''yicha interaktiv sinov testlari', 3),
        ('materials', 'Materiallar', 'Qurilish materiallari haqida', '🧱', 'Qurilish va pardozlash materiallari ensiklopediyasi', 4)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          subtitle = EXCLUDED.subtitle,
          icon = EXCLUDED.icon,
          order_index = EXCLUDED.order_index
      `);
    } catch (secErr) {
      console.warn('ensure library_sections:', secErr.message);
    }

    // 2. library_categories with order_index and section_slug
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS library_categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          section_slug VARCHAR(100) DEFAULT 'books',
          icon VARCHAR(50) DEFAULT '📁',
          order_index INT DEFAULT 0,
          parent_id INT,
          is_active BOOLEAN DEFAULT true
        )
      `);
      await pool.query('ALTER TABLE library_categories ADD COLUMN IF NOT EXISTS section_slug VARCHAR(100) DEFAULT \'books\'');
      await pool.query('ALTER TABLE library_categories ADD COLUMN IF NOT EXISTS icon VARCHAR(50) DEFAULT \'📁\'');
      await pool.query('ALTER TABLE library_categories ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0');
      await pool.query('ALTER TABLE library_categories ADD COLUMN IF NOT EXISTS parent_id INT');
      await pool.query('ALTER TABLE library_categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_library_categories_section ON library_categories(section_slug)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_library_categories_order ON library_categories(order_index)');

      // Seed categories for each section if missing
      var catSeeds = [
        // Books
        { section: 'books', name: 'Barchasi', icon: '🌐', order: 0 },
        { section: 'books', name: 'Arxitektura', icon: '📐', order: 1 },
        { section: 'books', name: 'Revit / BIM', icon: '💻', order: 2 },
        { section: 'books', name: 'Interyer', icon: '🏠', order: 3 },
        { section: 'books', name: 'Qurilish', icon: '🏗️', order: 4 },
        { section: 'books', name: 'Loyihalash', icon: '📏', order: 5 },
        { section: 'books', name: 'Normativ', icon: '📋', order: 6 },
        { section: 'books', name: 'Boshqa', icon: '📚', order: 7 },
        // Sources
        { section: 'sources', name: 'Barchasi', icon: '🌐', order: 0 },
        { section: 'sources', name: 'Revit', icon: '📦', order: 1 },
        { section: 'sources', name: 'Families', icon: '🪑', order: 2 },
        { section: 'sources', name: 'DWG', icon: '📐', order: 3 },
        { section: 'sources', name: 'CAD', icon: '📏', order: 4 },
        { section: 'sources', name: 'BIM', icon: '💻', order: 5 },
        { section: 'sources', name: '3D Models', icon: '🧊', order: 6 },
        { section: 'sources', name: 'Textures', icon: '🎨', order: 7 },
        { section: 'sources', name: 'Details', icon: '🔍', order: 8 },
        { section: 'sources', name: 'Templates', icon: '📑', order: 9 },
        { section: 'sources', name: 'Blocks', icon: '🧱', order: 10 },
        { section: 'sources', name: 'Catalogs', icon: '📖', order: 11 },
        { section: 'sources', name: 'Other', icon: '📁', order: 12 },
        // Tests
        { section: 'tests', name: 'Barchasi', icon: '🌐', order: 0 },
        { section: 'tests', name: 'Revit Asoslari', icon: '💻', order: 1 },
        { section: 'tests', name: 'BIM Standartlar', icon: '📐', order: 2 },
        { section: 'tests', name: 'Konstruktsiya', icon: '🏗️', order: 3 },
        { section: 'tests', name: 'Interyer Dizayn', icon: '🏠', order: 4 },
        // Materials
        { section: 'materials', name: 'Barchasi', icon: '🌐', order: 0 },
        { section: 'materials', name: 'Devor', icon: '🧱', order: 1 },
        { section: 'materials', name: 'Pol', icon: '🪵', order: 2 },
        { section: 'materials', name: 'Potolok', icon: '⬜', order: 3 },
        { section: 'materials', name: 'Mebel', icon: '🛋️', order: 4 },
        { section: 'materials', name: 'Fasad', icon: '🏢', order: 5 },
        { section: 'materials', name: 'Izolyatsiya', icon: '🛡️', order: 6 },
        { section: 'materials', name: 'Elektr', icon: '💡', order: 7 },
        { section: 'materials', name: 'Sanitary', icon: '🚿', order: 8 },
        { section: 'materials', name: 'Dekor', icon: '🖼️', order: 9 },
        { section: 'materials', name: 'Konstruktsiya', icon: '🏗️', order: 10 }
      ];

      for (var cs of catSeeds) {
        try {
          var existCat = await pool.query(
            'SELECT id FROM library_categories WHERE section_slug = $1 AND name = $2',
            [cs.section, cs.name]
          );
          if (existCat.rows.length === 0) {
            await pool.query(
              'INSERT INTO library_categories (section_slug, name, icon, order_index, is_active) VALUES ($1, $2, $3, $4, true)',
              [cs.section, cs.name, cs.icon, cs.order]
            );
          }
        } catch (catErr) {}
      }
    } catch (catSetupErr) {
      console.warn('ensure library_categories:', catSetupErr.message);
    }

    // 3. Ensure ALL Columns on library_resources exist (Defensive Alteration)
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS library_resources (
          id SERIAL PRIMARY KEY,
          title VARCHAR(500) NOT NULL DEFAULT '',
          type VARCHAR(50) DEFAULT 'book',
          section_slug VARCHAR(100) DEFAULT 'books',
          order_index INT DEFAULT 0,
          status VARCHAR(30) DEFAULT 'published'
        )
      `);

      var lrCols = [
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'book'",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS section_slug VARCHAR(100) DEFAULT 'books'",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS title VARCHAR(500) DEFAULT ''",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS subtitle TEXT",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS description TEXT",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Boshqa'",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS sub_category VARCHAR(100)",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS content_url TEXT",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'pdf'",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS content_data JSONB",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS preview_image_url TEXT",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS storage_provider VARCHAR(50) DEFAULT 'url'",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS storage_id TEXT",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS author VARCHAR(255)",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS file_size VARCHAR(50)",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS page_count INT",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'uz'",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'published'",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS view_count INT DEFAULT 0",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS download_count INT DEFAULT 0",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS course_id INT",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS version VARCHAR(50)",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS versions JSONB DEFAULT '[]'",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS source_label VARCHAR(255)",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS difficulty VARCHAR(50) DEFAULT 'medium'",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS time_limit_min INT DEFAULT 15",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()",
        "ALTER TABLE library_resources ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()"
      ];

      for (var cSql of lrCols) {
        try {
          await pool.query(cSql);
        } catch (cErr) {
          console.warn('library_resources col add:', cErr.message);
        }
      }

      await pool.query('CREATE INDEX IF NOT EXISTS idx_library_resources_type ON library_resources(type)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_library_resources_section ON library_resources(section_slug)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_library_resources_category ON library_resources(category)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_library_resources_status ON library_resources(status)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_library_resources_order ON library_resources(order_index)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_library_resources_featured ON library_resources(is_featured)');
    } catch (resSetupErr) {
      console.warn('ensure library_resources setup:', resSetupErr.message);
    }

    // 4. Update section_slug on existing rows if not set
    try {
      await pool.query(`
        UPDATE library_resources SET section_slug = 'books' WHERE (type = 'book' OR type = 'normative' OR type = 'guide') AND (section_slug IS NULL OR section_slug = '');
        UPDATE library_resources SET section_slug = 'sources' WHERE type IN ('source', 'family_pack', 'family', 'video', 'file', 'dwg', 'rfa', 'rvt') AND (section_slug IS NULL OR section_slug = '');
        UPDATE library_resources SET section_slug = 'tests' WHERE type = 'test' AND (section_slug IS NULL OR section_slug = '');
        UPDATE library_resources SET section_slug = 'materials' WHERE type = 'material' AND (section_slug IS NULL OR section_slug = '');
        UPDATE library_resources SET section_slug = 'books' WHERE section_slug IS NULL OR section_slug = '';
        UPDATE library_resources SET type = 'book' WHERE type IS NULL OR type = '';
        UPDATE library_resources SET order_index = 0 WHERE order_index IS NULL;
        UPDATE library_resources SET is_featured = false WHERE is_featured IS NULL;
      `);
    } catch (updErr) {
      console.warn('update library_resources section_slug:', updErr.message);
    }

    // 5. PRESERVE & SEED THE 3 CORE BOOKS
    var book1 = await pool.query("SELECT id FROM library_resources WHERE title LIKE '%Revit 2024: Rasmiy qo%'");
    if (book1.rows.length === 0) {
      await pool.query(`
        INSERT INTO library_resources (
          type, section_slug, title, subtitle, description, category, author, file_size, page_count, language,
          content_url, content_type, content_data, is_featured, order_index, status
        ) VALUES (
          'book', 'books', 'Revit 2024: Rasmiy qo''llanma va BIM standartlari (PDF)',
          'Autodesk rasmiy o''quv qo''llanmasi',
          'Revit interfeysi, modellashtirish prinsiplari, listlar va shablonlar bo''yicha to''liq o''zbekcha va ruscha qo''llanma kitobi.',
          'Revit / BIM', 'Autodesk & BIM Experts', '45 MB', 320, 'uz',
          'https://drive.google.com/file/d/1_Revit_Guide_Book/preview', 'pdf',
          $1, true, 1, 'published'
        )
      `, [JSON.stringify({
        what_you_learn: [
          "Revit parametrli elementlar va oilalar (Families) bilan ishlash",
          "BIM 360 va jamoaviy loyihalash asoslari",
          "Ishchi chizmalar va spetsifikatsiyalarni avtomatlashtirish",
          "Xalqaro BIM standartlar va LOD talablari"
        ],
        year: 2024,
        format: "PDF",
        level: "Boshlang'ich va Professional"
      })]);
    } else {
      await pool.query("UPDATE library_resources SET section_slug = 'books', author = COALESCE(author, 'Autodesk & BIM Experts'), file_size = COALESCE(file_size, '45 MB'), page_count = COALESCE(page_count, 320), language = COALESCE(language, 'uz') WHERE id = $1", [book1.rows[0].id]);
    }

    var book2 = await pool.query("SELECT id FROM library_resources WHERE title LIKE '%Arxitektura va bino loyihalash me%'");
    if (book2.rows.length === 0) {
      await pool.query(`
        INSERT INTO library_resources (
          type, section_slug, title, subtitle, description, category, author, file_size, page_count, language,
          content_url, content_type, content_data, is_featured, order_index, status
        ) VALUES (
          'book', 'books', 'Arxitektura va bino loyihalash me''yorlari (ShNQ & KMK to''plami)',
          'O''zbekiston Respublikasi shaharsozlik normalari va qoidalari',
          'O''zbekiston Respublikasi shaharsozlik normalari va qoidalari: turar-joy va jamoat binolari talablari, xonalar minimal balandligi va maydonlari.',
          'Normativ', 'O''zbekiston Qurilish Vazirligi', '28 MB', 215, 'uz',
          'https://drive.google.com/file/d/1_ShNQ_KMK_Standards/preview', 'pdf',
          $1, true, 2, 'published'
        )
      `, [JSON.stringify({
        what_you_learn: [
          "O'zbekiston shaharsozlik qonun-qoidalari (KMK va ShNQ)",
          "Yong'in xavfsizligi va evakuatsiya talablari",
          "Turar-joy xonalari insolyatsiyasi va minimal gabaritlari",
          "Ekspertizadan o'tish talablari va ruxsatnomalar"
        ],
        year: 2023,
        format: "PDF",
        level: "Barcha darajalar"
      })]);
    } else {
      await pool.query("UPDATE library_resources SET section_slug = 'books', author = COALESCE(author, 'O''zbekiston Qurilish Vazirligi'), file_size = COALESCE(file_size, '28 MB'), page_count = COALESCE(page_count, 215), language = COALESCE(language, 'uz') WHERE id = $1", [book2.rows[0].id]);
    }

    var book3 = await pool.query("SELECT id FROM library_resources WHERE title LIKE '%Interyer dizaynerlari uchun ergonomika%'");
    if (book3.rows.length === 0) {
      await pool.query(`
        INSERT INTO library_resources (
          type, section_slug, title, subtitle, description, category, author, file_size, page_count, language,
          content_url, content_type, content_data, is_featured, order_index, status
        ) VALUES (
          'book', 'books', 'Interyer dizaynerlari uchun ergonomika va o''lchamlar (Noifert)',
          'Arxitektura va interyer ergonomikasi ensiklopediyasi',
          'Mebel joylashuvi, o''tish masofalari, eshik va deraza me''yorlari, oshxona va sanuzel ergonomikasi bo''yicha asosiy spravochnik.',
          'Interyer', 'Ernst Neufert', '62 MB', 480, 'ru',
          'https://drive.google.com/file/d/1_Ergonomika_Noifert/preview', 'pdf',
          $1, true, 3, 'published'
        )
      `, [JSON.stringify({
        what_you_learn: [
          "Odam antropometriyasi va bino fazoviy ergonomikasi",
          "Oshxona, yotoqxona va sanuzel funksional zonalari",
          "Eshik va dahliz o'tish kengliklari qoidalari",
          "Mebel o'lchamlari va qulaylik standartlari"
        ],
        year: 2022,
        format: "PDF",
        level: "Arxitektor va Dizaynerlar"
      })]);
    } else {
      await pool.query("UPDATE library_resources SET section_slug = 'books', author = COALESCE(author, 'Ernst Neufert'), file_size = COALESCE(file_size, '62 MB'), page_count = COALESCE(page_count, 480), language = COALESCE(language, 'ru') WHERE id = $1", [book3.rows[0].id]);
    }

    // 6. SEED SAMPLE MANBALAR (SOURCES)
    var sCount = await pool.query("SELECT COUNT(*)::int AS c FROM library_resources WHERE section_slug = 'sources'");
    if (sCount.rows[0].c === 0) {
      await pool.query(`
        INSERT INTO library_resources (
          type, section_slug, title, subtitle, description, category, file_size, version, versions,
          content_url, content_type, content_data, is_featured, order_index, status
        ) VALUES
        (
          'source', 'sources', 'Oshxona Mebellari RFA To''plami (Kitchen Family 2024-2026)',
          'Parametrli oshxona shkaflari, jihozlari va fasadlari',
          'To''liq parametrli Revit oilalari: o''lchamlari erkin o''zgaradi, fasad turlari va materiallari almashtiriladi.',
          'Families', '24.5 MB', 'Revit 2024 / 2025 / 2026',
          'https://drive.google.com/uc?export=download&id=1_Kitchen_Family_Pack', 'file',
          $1, true, 1, 'published'
        ),
        (
          'source', 'sources', 'Ko''p Qavatli Turar Joy Binosi Arxitektura Shablon (RVT)',
          'ShNQ talablariga mos tayyor listlar, vidlar va spetsifikatsiyalar',
          'O''zbekiston qurilish me''yorlariga moslashtirilgan to''liq arxitektura shabloni (Template).',
          'Templates', '118 MB', 'Revit 2025',
          'https://drive.google.com/uc?export=download&id=1_Building_Template', 'file',
          $2, true, 2, 'published'
        ),
        (
          'source', 'sources', 'Bosh Reja (Genplan) Chizmasi Standart DWG Bloklari',
          'Daraxtlar, yo''llar, avtomobillar va ko''kalamzorlashtirish belgilari',
          'AutoCAD va Revit uchun toza chizilgan genplan va obodonlashtirish DWG bloklari to''plami.',
          'DWG', '16.2 MB', 'AutoCAD 2024',
          'https://drive.google.com/uc?export=download&id=1_Genplan_DWG', 'file',
          $3, false, 3, 'published'
        )
      `, [
        JSON.stringify([
          { version: 'Revit 2024', format: 'RFA', url: 'https://drive.google.com/uc?export=download&id=1_Kitchen_2024' },
          { version: 'Revit 2025', format: 'RFA', url: 'https://drive.google.com/uc?export=download&id=1_Kitchen_2025' },
          { version: 'Revit 2026', format: 'RFA', url: 'https://drive.google.com/uc?export=download&id=1_Kitchen_2026' }
        ]),
        JSON.stringify([
          { version: 'Revit 2025', format: 'RVT', url: 'https://drive.google.com/uc?export=download&id=1_Building_Template' }
        ]),
        JSON.stringify([
          { version: 'AutoCAD 2024', format: 'DWG', url: 'https://drive.google.com/uc?export=download&id=1_Genplan_DWG' }
        ])
      ]);
    }

    // 7. SEED INTERACTIVE TEST (TESTLAR)
    var tCount = await pool.query("SELECT COUNT(*)::int AS c FROM library_resources WHERE section_slug = 'tests'");
    if (tCount.rows[0].c === 0) {
      await pool.query(`
        INSERT INTO library_resources (
          type, section_slug, title, subtitle, description, category, source_label, difficulty, time_limit_min,
          content_type, content_data, is_featured, order_index, status
        ) VALUES (
          'test', 'tests', 'Revit & BIM Boshlang''ich Daraja Sinov Testi',
          '10 ta saralangan interaktiv savol',
          'Revit dasturining asosiy interfeysi, element turlari, vidlar va chizmalar tayyorlash bo''yicha bilimingizni sinab ko''ring.',
          'Revit Asoslari', 'INTPRO Kursi / 1-Modul', 'medium', 15,
          'quiz_json', $1, true, 1, 'published'
        )
      `, [JSON.stringify([
        {
          q: "Revit-da 'Family' (Oila) nima?",
          options: [
            "Faqat tashqi ko'rinish uchun rasm",
            "Parametrli xususiyatlarga va o'lchamlarga ega 3D/2D model elementi",
            "Faqat chizma listi",
            "AutoCAD faylini import qilish usuli"
          ],
          correct: 1,
          explanation: "Revit-da hamma narsa Family hisoblanadi (devor, eshik, mebel). Ular parametrli bo'lib, o'lcham va xususiyatlari erkin o'zgaradi."
        },
        {
          q: "Devor balandligini qavat balandligiga (Level) bog'lab chizishning asosiy afzalligi nimada?",
          options: [
            "Qavat balandligi o'zgarganda devorlar balandligi ham avtomatik moslashib o'zgaradi",
            "Devor rangi avtomatik o'zgaradi",
            "Devor materiali o'zgarmaydi",
            "Devor faqat 3D vidda ko'rinadi"
          ],
          correct: 0,
          explanation: "Devor Level'ga bog'langanda, agar arxitektor qavat balandligini 3.00m dan 3.30m ga o'zgartirsa, barcha devorlar avtomatik uzayadi."
        },
        {
          q: "Revit-da View Template nima uchun ishlatiladi?",
          options: [
            "Loyiha faylini zip arxiv qilish uchun",
            "Chizmalar grafikasi, masshtabi va filtrlarini bir xil standartda saqlash va boshqarish uchun",
            "Faqat render qilish tezligini oshirish uchun",
            "Kompyuter xotirasini tozalash uchun"
          ],
          correct: 1,
          explanation: "View Template vidlarning ko'rinishi, filtrlari, chiziq qalinliklari va masshtablarini barcha qavatlarda bir xil standartda ushlab turadi."
        },
        {
          q: "Chizmadagi barcha eshik va derazalarning avtomatik hisob-kitob jadvali nima deb ataladi?",
          options: [
            "Plan vid",
            "Spetsifikatsiya (Schedule/Quantities)",
            "List (Sheet)",
            "Shablon vid"
          ],
          correct: 1,
          explanation: "Schedule/Quantities orqali Revit barcha elementlarni soni, o'lchamlari va material sarfini soniyalar ichida avtomatik hisoblab beradi."
        }
      ])]);
    }

    // 8. SEED KNOWLEDGE MATERIALS (MATERIALLAR)
    var mCount = await pool.query("SELECT COUNT(*)::int AS c FROM library_resources WHERE section_slug = 'materials'");
    if (mCount.rows[0].c === 0) {
      await pool.query(`
        INSERT INTO library_resources (
          type, section_slug, title, subtitle, description, category, sub_category,
          content_type, content_data, is_featured, order_index, status
        ) VALUES
        (
          'material', 'materials', 'LDSP (Laminatsiyalangan Yog''och-Qipirli Plita)',
          'Ламинированная древесно-стружечная плита (ЛДСП)',
          'Mebel korpuslari, javonlar va ichki pardozlashda eng keng tarqalgan, tejamkor va qulay material.',
          'Mebel', 'Plita materiallari',
          'material_spec', $1, true, 1, 'published'
        ),
        (
          'material', 'materials', 'MDF (O''rta Zichlikdagi Tolali Plita)',
          'Древесноволокнистая плита средней плотности (MDF)',
          'Frezalash (naqsh o''yish) va bo''yash uchun mukammal tekis sirtga ega bo''lgan sifatli material.',
          'Mebel', 'Plita materiallari',
          'material_spec', $2, true, 2, 'published'
        ),
        (
          'material', 'materials', 'Keramogranit (Katta Formatli Plitka)',
          'Керамогранит крупноформатный',
          'Yuqori mustahkamlik, namlikka chidamlilik va estetik jozibaga ega pol va fasad qoplamasi.',
          'Pol', 'Plitka va Tosh',
          'material_spec', $3, true, 3, 'published'
        ),
        (
          'material', 'materials', 'Gipsokarton (GKL / GKLV / GKLO)',
          'Гипсокартонный лист',
          'Ichki devorlar, peregorodkalar va to''xtatilgan shiftlar qurish uchun asosiy quruq qurilish materiali.',
          'Devor', 'Quruq qurilish',
          'material_spec', $4, false, 4, 'published'
        )
      `, [
        JSON.stringify({
          russian_name: "Ламинированная древесно-стружечная плита (ЛДСП)",
          english_name: "Melamine Faced Chipboard (MFC)",
          usage: ["Mebel korpuslari va javonlar", "Oshxona karkaslari", "Ofis mebellari", "Shkaf-kupe devorlari"],
          dimensions: "2750 x 1830 mm, 2800 x 2070 mm",
          thickness: "16 mm, 18 mm, 25 mm",
          density: "650 - 750 kg/m³",
          advantages: ["Hamyonbop narx", "Ranglar va teksturalar xilma-xilligi", "Ishlov berish qulayligi", "O'lchamlar barqarorligi"],
          disadvantages: ["Suvga uzoq turmaslik (chetlari bo'rtishi mumkin)", "Murakkab naqshli frezalash qilib bo'lmasligi"],
          related_materials: ["MDF", "HPL Plastik", "Fanera"],
          catalog_link: "https://kastamonu.uz"
        }),
        JSON.stringify({
          russian_name: "Древесноволокнистая плита средней плотности (МДФ)",
          english_name: "Medium Density Fiberboard (MDF)",
          usage: ["Oshxona fasadlari", "Emal va shpon bilan qoplash", "Eshik polotnolari", "Devor panellari (Reika)"],
          dimensions: "2800 x 2070 mm",
          thickness: "6, 8, 10, 16, 18, 22 mm",
          density: "720 - 850 kg/m³",
          advantages: ["Bir jinsli zich tuzilma", "Frezalash va bo'yash uchun ideal", "Yuqori mexanik mustahkamlik"],
          disadvantages: ["LDSP ga nisbatan og'irroq va qimmatroq"],
          related_materials: ["LDSP", "Shpon", "Emal"],
          catalog_link: "https://egger.com"
        }),
        JSON.stringify({
          russian_name: "Керамогранит 600x1200 / 1200x2400",
          english_name: "Porcelain Stoneware Slab",
          usage: ["Zallar va sanuzellar poli", "Devor panellari", "Stoleshnitsalar", "Ventfasad"],
          dimensions: "600x600, 600x1200, 1200x2400 mm",
          thickness: "9 mm, 11 mm, 6 mm (Slim)",
          density: "2400 kg/m³",
          advantages: ["Suv singishi 0.05% dan kam (ayozga va namga chidamli)", "Tirnalishga o'ta chidamli", "Issiq pollar uchun ideal"],
          disadvantages: ["Kesish va o'rnatish uchun maxsus usta talab qiladi", "Og'ir vazn"],
          related_materials: ["Marmar", "Granit", "Kafel"],
          catalog_link: ""
        }),
        JSON.stringify({
          russian_name: "Гипсокартонный лист (ГКЛ / ГКЛВ)",
          english_name: "Gypsum Plasterboard",
          usage: ["Xonalararo peregorodkalar", "Ko'p bosqichli shiftlar", "Quvurlarni yashirish qutilari"],
          dimensions: "2500 x 1200 mm, 3000 x 1200 mm",
          thickness: "9.5 mm (shift uchun), 12.5 mm (devor uchun)",
          density: "800 kg/m³",
          advantages: ["Tez va oson montaj", "Ekologik toza va yonmaydi", "Mukammal tekis yuza"],
          disadvantages: ["Zarbaga nisbatan nozik", "Og'ir yuklarni to'g'ridan-to'g'ri osmab bo'lmaydi (zakladnoy kerak)"],
          related_materials: ["Gips", "Profil Knauf", "Shpatlyovka"],
          catalog_link: ""
        })
      ]);
    }

    // 9. SEED ACADEMY SETTINGS FOR SUPPORT / DONATION
    var donSettings = [
      ["support_title", "Akademiyani qo'llab-quvvatlash"],
      ["support_subtitle", "YOSHUZBEKK platformasini rivojlantirishga o'z hissangizni qo'shing"],
      ["support_description", "Akademiyamiz darslari, ochiq manbalar, BIM standartlari va erkin testlar rivoji uchun ixtiyoriy moliyaviy qo'llab-quvvatlash."],
      ["donate_card_number", "8600 5304 1234 5678"],
      ["donate_card_holder", "Abdulloh S. (YOSHUZBEKK)"],
      ["donate_payment_type", "UZCARD / HUMO"],
      ["support_telegram_contact", "@yoshuzbekk_admin"]
    ];
    for (var ds of donSettings) {
      await pool.query(`
        INSERT INTO academy_settings (key, value) VALUES ($1, $2)
        ON CONFLICT (key) DO NOTHING
      `, [ds[0], ds[1]]);
    }

    // 10. SYNC MODULE TESTS (INTPRO & barcha kurslar modul testlarini library_resources ga ulash)
    try {
      var moduleTestsAgg = await pool.query(`
        SELECT m.id AS module_id, m.title AS module_title, m.course_id, c.title AS course_title,
               json_agg(json_build_object(
                 'id', mt.id,
                 'question', mt.question,
                 'options', CASE WHEN jsonb_typeof(mt.options::jsonb) = 'array' THEN mt.options::jsonb ELSE jsonb_build_array() END,
                 'correct_index', mt.correct_index,
                 'correct', mt.correct_index
               ) ORDER BY mt.order_index ASC, mt.id ASC) AS questions
        FROM modules m
        JOIN module_tests mt ON mt.module_id = m.id
        LEFT JOIN courses c ON c.id = m.course_id
        GROUP BY m.id, m.title, m.course_id, c.title
      `);

      for (var mRow of moduleTestsAgg.rows) {
        var testTitle = mRow.module_title + ' (Sinov Testi)';
        var existingTest = await pool.query(
          "SELECT id FROM library_resources WHERE section_slug = 'tests' AND (course_id = $1 OR title = $2) AND title = $2 LIMIT 1",
          [mRow.course_id, testTitle]
        );
        if (existingTest.rows.length === 0) {
          await pool.query(`
            INSERT INTO library_resources (
              section_slug, type, title, subtitle, description, category,
              content_type, content_data, course_id, status, is_featured, order_index
            ) VALUES (
              'tests', 'test', $1, $2, $3, 'Kurs Testi',
              'quiz_json', $4, $5, 'published', true, 10
            )
          `, [
            testTitle,
            (mRow.course_title || 'Kurs') + ' amaliy sinov testi',
            mRow.module_title + ' bo‘yicha o‘zlashtirgan bilimlaringizni sinash uchun mo‘ljallangan amaliy test savollari.',
            JSON.stringify(mRow.questions),
            mRow.course_id
          ]);
        }
      }
    } catch (testSyncErr) {
      console.warn('MODULE TESTS AUTO-SYNC WARNING:', testSyncErr.message);
    }

    // 8. DEDICATED LIBRARY BOOKS TABLE & AUTO-MIGRATION
    try {
      await ensureLibraryBooksTable();

      // Mavjud kitoblarni library_resources dan library_books ga xavfsiz ko'chirish
      await pool.query(`
        INSERT INTO library_books (
          title, author, short_description, what_you_learn, categories,
          pdf_url, cover_url, generated_cover_url, page_count, reading_time_minutes,
          access_type, is_recommended, status, created_at, updated_at
        )
        SELECT
          title,
          COALESCE(author, ''),
          COALESCE(description, subtitle, ''),
          CASE
            WHEN content_data IS NOT NULL AND content_data->'what_you_learn' IS NOT NULL THEN
              CASE
                WHEN jsonb_typeof(content_data->'what_you_learn') = 'array' THEN
                  array_to_string(ARRAY(SELECT jsonb_array_elements_text(content_data->'what_you_learn')), E'\n• ')
                ELSE content_data->>'what_you_learn'
              END
            ELSE ''
          END,
          CASE
            WHEN tags IS NOT NULL AND array_length(tags, 1) > 0 THEN tags
            WHEN category IS NOT NULL AND category != '' AND category != 'Boshqa' THEN ARRAY[category]
            ELSE '{}'
          END,
          COALESCE(content_url, ''),
          preview_image_url,
          preview_image_url,
          COALESCE(page_count, 0),
          CASE WHEN page_count IS NOT NULL AND page_count > 0 THEN page_count * 2 ELSE 30 END,
          'free',
          COALESCE(is_featured, false),
          COALESCE(status, 'published'),
          created_at,
          updated_at
        FROM library_resources
        WHERE (section_slug = 'books' OR type = 'book')
          AND NOT EXISTS (SELECT 1 FROM library_books WHERE library_books.title = library_resources.title)
      `);
      console.log('✅ LIBRARY BOOKS: library_books jadvali va mavjud kitoblar migratsiyasi muvaffaqiyatli tekshirildi');
    } catch (bkErr) {
      console.warn('ensure library_books table warning:', bkErr.message);
    }

    console.log("✅ KUTUBXONA 2.0 & SUPPORT: Barcha jadvallar, 4 bo'lim, 3 kitob va kategoriyalar muvaffaqiyatli tekshirildi/sozlandi");
  } catch (err) {
    console.error('ensureLibraryV2Tables xatosi:', err.message);
  }
}

initExtendedTables();
ensureUserActivityTable();
ensureLibraryV2Tables();


// ======================================================
// BUNNY STREAM
// ======================================================

function generateBunnyToken(videoId, expiresAt) {
  var securityKey = process.env.BUNNY_TOKEN_AUTH_KEY;
  if (!securityKey) {
    return null;
  }
  var hashableString = securityKey + videoId + expiresAt;
  return crypto.createHash('sha256').update(hashableString).digest('hex');
}

function generateBunnyPlayerUrl(libraryId, videoId) {
  var securityKey = process.env.BUNNY_TOKEN_AUTH_KEY;
  if (securityKey) {
    var expiresAt = Math.floor(Date.now() / 1000) + 2 * 60 * 60;
    var token = generateBunnyToken(videoId, expiresAt);
    if (token) {
      return 'https://iframe.mediadelivery.net/embed/' + libraryId + '/' + videoId + '?token=' + token + '&expires=' + expiresAt;
    }
  }
  return 'https://iframe.mediadelivery.net/embed/' + libraryId + '/' + videoId;
}

// ======================================================
// YOUTUBE
// ======================================================

function getYouTubeVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    var clean = url.trim();
    // If it's an iframe tag, extract the src attribute
    var srcMatch = clean.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) clean = srcMatch[1];

    // If it's just an 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;

    // 1. Check youtu.be/VIDEO_ID
    var youtuMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
    if (youtuMatch && youtuMatch[1]) return youtuMatch[1];

    // 2. Check /live/VIDEO_ID (YouTube Stream / Jonli Efir)
    var liveMatch = clean.match(/(?:youtube\.com|youtube-nocookie\.com)\/live\/([a-zA-Z0-9_-]{11})/i);
    if (liveMatch && liveMatch[1]) return liveMatch[1];

    // 3. Check /embed/VIDEO_ID
    var embedMatch = clean.match(/(?:youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9_-]{11})/i);
    if (embedMatch && embedMatch[1]) return embedMatch[1];

    // 4. Check /shorts/VIDEO_ID
    var shortsMatch = clean.match(/(?:youtube\.com|youtube-nocookie\.com)\/shorts\/([a-zA-Z0-9_-]{11})/i);
    if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

    // 5. Check watch?v=VIDEO_ID
    var vMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
    if (vMatch && vMatch[1]) return vMatch[1];

    // 6. Generic regex fallback for any youtube URL
    var genMatch = clean.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
    if (genMatch && genMatch[1]) return genMatch[1];

    return null;
  } catch (error) {
    console.error('YOUTUBE URL ERROR:', error.message);
    return null;
  }
}

function generateYouTubePlayerUrl(youtubeUrl) {
  var videoId = getYouTubeVideoId(youtubeUrl);
  if (!videoId) return null;
  return 'https://www.youtube.com/embed/' + videoId + '?rel=0&modestbranding=1&enablejsapi=1&playsinline=1&controls=1&iv_load_policy=3&showinfo=0';
}

// Google Drive va boshqa rasm linklarini to'g'ridan-to'g'ri rasm CDN formatiga o'tkazish
function formatDirectImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  var cleanUrl = url.trim();
  if (!cleanUrl) return '';

  var driveMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return 'https://lh3.googleusercontent.com/d/' + driveMatch[1];
  }

  var driveIdMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (cleanUrl.indexOf('drive.google.com') !== -1 && driveIdMatch && driveIdMatch[1]) {
    return 'https://lh3.googleusercontent.com/d/' + driveIdMatch[1];
  }

  if (cleanUrl.indexOf('dropbox.com') !== -1) {
    return cleanUrl.replace(/[?&]dl=0/, '').concat(cleanUrl.indexOf('?') !== -1 ? '&raw=1' : '?raw=1');
  }

  return cleanUrl;
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
      is_admin: Boolean(admin || isMainAdmin),
      admin_role: isMainAdmin ? 'super_admin' : (admin ? admin.role : null),
      terms_accepted: Boolean(user.terms_accepted),
      terms_accepted_at: user.terms_accepted_at || null
    });
  } catch (error) {
    console.error('AUTH ERROR:', error);
    return res.status(500).json({ error: 'Server xatosi' });
  }
});

// ======================================================
// TERMS OF USE ACCEPTANCE (FOYDALANISH QOIDALARINI QABUL QILISH)
// ======================================================

app.post('/api/user/accept-terms', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body && req.body.initData);
    if (!user) return res.status(401).json({ error: 'Telegram foydalanuvchisi tekshirilmadi' });

    var now = new Date();
    await pool.query(
      'UPDATE users SET terms_accepted = true, terms_accepted_at = $1 WHERE id = $2',
      [now, user.id]
    );

    return res.json({
      success: true,
      terms_accepted: true,
      terms_accepted_at: now
    });
  } catch (error) {
    console.error('ACCEPT TERMS ERROR:', error);
    return res.status(500).json({ error: 'Server xatosi: ' + error.message });
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

    var userHasAccess = hasAccess(user);

    var modulesResult = await pool.query(
      'SELECT id, course_id, title, order_index FROM modules ORDER BY order_index ASC, id ASC'
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
        id: mod.id, course_id: mod.course_id || 1, title: mod.title, order_index: mod.order_index,
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
        : "SELECT * FROM courses WHERE (status != 'hidden' AND status != 'archived') OR status IS NULL ORDER BY order_index ASC, id ASC";
      var coursesRes = await pool.query(coursesQuery);
      courses = coursesRes.rows.map(function (c) {
        var isDiscountActive = Boolean(c.discount_price) && c.discount_until && new Date(c.discount_until) > new Date();
        return Object.assign({}, c, {
          cover_url: formatDirectImageUrl(c.cover_url),
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

    // Sozlamalar (Talab 1 & 5)
    var settings = {};
    try {
      var setRes = await pool.query('SELECT key, value FROM academy_settings');
      setRes.rows.forEach(function (r) {
        settings[r.key] = r.value;
      });
      if (settings.admin_photo_url) {
        settings.admin_photo_url = formatDirectImageUrl(settings.admin_photo_url);
      }
    } catch (sErr) {
      console.warn('SETTINGS QUERY WARNING:', sErr.message);
    }

    // O'quvchilar fikri (Talab 5)
    var testimonials = [];
    try {
      var tRes = await pool.query('SELECT * FROM testimonials ORDER BY order_index ASC, id ASC');
      testimonials = tRes.rows;
    } catch (tErr) {
      console.warn('TESTIMONIALS QUERY WARNING:', tErr.message);
    }

    // O'quvchilar natijalari va rabochka loyihalar karuseli (Talab 3)
    var showcases = [];
    try {
      var scRes = await pool.query('SELECT * FROM course_showcases ORDER BY order_index ASC, id ASC');
      showcases = scRes.rows;
    } catch (scErr) {
      console.warn('SHOWCASES QUERY WARNING:', scErr.message);
    }

    // Kutubxona ochiq manbalari va erkin testlar (Talab 2)
    var openResources = [];
    try {
      var orRes = await pool.query('SELECT * FROM library_open_resources ORDER BY order_index ASC, id ASC');
      openResources = orRes.rows;
    } catch (orErr) {
      console.warn('OPEN RESOURCES QUERY WARNING:', orErr.message);
    }

    // Qurilish va remont materiallari bazasi (Talab 6)
    var materials = [];
    try {
      var matRes = await pool.query('SELECT * FROM construction_materials ORDER BY order_index ASC, id ASC');
      materials = matRes.rows;
    } catch (matErr) {
      console.warn('MATERIALS QUERY WARNING:', matErr.message);
    }

    // Platformani qo'llab-quvvatlash kartalari (faqat faol kartalar)
    var supportCards = [];
    try {
      var scRes = await pool.query('SELECT id, card_type, card_number, cardholder_name, is_active FROM support_cards WHERE is_active = true ORDER BY id ASC');
      supportCards = scRes.rows;
    } catch (scErr) {
      console.warn('SUPPORT CARDS QUERY WARNING:', scErr.message);
    }

    return res.json({
      has_access: userHasAccess, access_until: user.access_until || null,
      telegram_id: user.telegram_id.toString(),
      first_name: user.first_name || '', last_name: user.last_name || '',
      phone: user.phone || '', username: user.username || '',
      registered: Boolean(user.first_name && user.last_name && user.phone),
      terms_accepted: Boolean(user.terms_accepted),
      terms_accepted_at: user.terms_accepted_at || null,
      modules: data,
      last_lesson: lastLesson,
      courses: courses,
      faqs: faqs,
      settings: settings,
      testimonials: testimonials,
      showcases: showcases,
      open_resources: openResources,
      materials: materials,
      support_cards: supportCards
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

    if ((course.status === 'hidden' || course.status === 'archived') && !isAdmin) {
      return res.status(403).json({ error: 'Ushbu kurs hozirda mavjud emas' });
    }

    var isFreeCourse = Boolean(
      !course.price || course.price === '0' || course.price.includes('0 so') ||
      (course.title && /marafon|марафон|stream|jonli|efir|vebinar|7/i.test(course.title))
    );

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
      var isStreamCourseOrModule = isFreeCourse ||
        /marafon|марафон|stream|jonli|efir|vebinar|7/i.test(mod.title || '') ||
        (course.title && /marafon|марафон|stream|jonli|efir|vebinar|7/i.test(course.title));
      var moduleUnlocked = isStreamCourseOrModule || (isFirstModule && isNeverPaidUser(user)) || userHasAccess || isGranted || isMainAdminUser;
      var moduleLessons = lessons.filter(function (l) { return l.module_id === mod.id; });
      var watchedCount = 0;

      var mappedLessons = moduleLessons.map(function (lesson) {
        var isStreamLesson = isStreamCourseOrModule ||
          /marafon|марафон|stream|jonli|efir|vebinar/i.test(lesson.title || '');
        var available = Boolean(lesson.is_free) || isStreamLesson || isMainAdminUser || isGranted ||
          (isNeverPaidUser(user) && isFirstModule) ||
          userHasAccess ||
          sequentialUnlockedSet.has(lesson.id);
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

    if (course && course.cover_url) {
      course.cover_url = formatDirectImageUrl(course.cover_url);
    }

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

    var lessonResult = await pool.query(
      'SELECT id, module_id, title, order_index, youtube_url, task_text, is_free, bunny_video_id, warning_text FROM lessons WHERE id = $1 LIMIT 1',
      [req.params.id]
    );
    var lesson = lessonResult.rows[0];
    if (!lesson) return res.status(404).json({ error: 'Dars topilmadi' });

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

    var courseRes = await pool.query('SELECT * FROM courses WHERE id = $1 LIMIT 1', [mod.course_id]);
    var courseData = courseRes.rows[0];
    var isFreeCourse = Boolean(
      courseData && (!courseData.price || courseData.price === '0' || courseData.price.includes('0 so') || (courseData.title && /marafon|марафон|stream|jonli|efir|vebinar|7/i.test(courseData.title)))
    );
    var isStreamLesson = isFreeCourse ||
      /marafon|марафон|stream|jonli|efir|vebinar/i.test(lesson.title || '') ||
      (courseData && /marafon|марафон|stream|jonli|efir|vebinar|7/i.test(courseData.title || '')) ||
      /marafon|марафон|stream|jonli|efir|vebinar|7/i.test(mod.title || '');

    var lessonAvailable = Boolean(lesson.is_free) || isStreamLesson || isMainAdminUser || isGranted || userHasAccess || (isNeverPaidUser(user) && isFirstModule);

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
    try {
      var qRes = await pool.query(
        `SELECT lq.id, lq.lesson_id, lq.user_id, lq.question, lq.answer, lq.status, lq.created_at, lq.answered_at,
                u.first_name, u.last_name, u.username,
                (lq.user_id = $2) AS is_mine
         FROM lesson_questions lq
         JOIN users u ON u.id = lq.user_id
         WHERE lq.lesson_id = $1
         ORDER BY lq.created_at DESC`,
        [lesson.id, user.id]
      );
      questions = qRes.rows;
    } catch (qErr) {
      console.error('LESSON QUESTIONS QUERY ERROR:', qErr);
    }

    var rawVideoUrl = (lesson.youtube_url || '').trim();
    if (!rawVideoUrl && lesson.bunny_video_id && /^https?:\/\//i.test(lesson.bunny_video_id.trim())) {
      rawVideoUrl = lesson.bunny_video_id.trim();
    }
    if (!rawVideoUrl && files && files.length > 0) {
      var streamFile = files.find(f => /youtube|youtu\.be|mediadelivery|bunny|drive\.google|\.mp4/i.test(f.file_url || ''));
      if (streamFile) {
        rawVideoUrl = streamFile.file_url.trim();
      }
    }
    var youtubePlayerUrl = generateYouTubePlayerUrl(rawVideoUrl);

    if (youtubePlayerUrl) {
      return res.json({
        id: lesson.id, title: lesson.title, video_type: 'youtube',
        youtube_url: isMainAdminUser ? rawVideoUrl : null,
        youtube_player_url: youtubePlayerUrl,
        task_text: lesson.task_text || '', warning_text: warningText, files: files, my_submission: mySubmission, watched: isWatched,
        questions: questions
      });
    }

    if (lesson.bunny_video_id && (process.env.BUNNY_LIBRARY_ID || lesson.bunny_video_id.includes('/'))) {
      var libId = process.env.BUNNY_LIBRARY_ID || 'library';
      var bunnyPlayerUrl = generateBunnyPlayerUrl(libId, lesson.bunny_video_id);
      return res.json({
        id: lesson.id, title: lesson.title, video_type: 'bunny',
        bunny_video_id: lesson.bunny_video_id, bunny_library_id: libId,
        bunny_player_url: bunnyPlayerUrl,
        task_text: lesson.task_text || '', warning_text: warningText, files: files, my_submission: mySubmission, watched: isWatched,
        questions: questions
      });
    }

    // Bunny to'g'ridan-to'g'ri embed yoki stream havolasi
    if (/mediadelivery\.net|bunnycdn\.com/i.test(rawVideoUrl)) {
      return res.json({
        id: lesson.id, title: lesson.title, video_type: 'bunny',
        bunny_player_url: rawVideoUrl,
        task_text: lesson.task_text || '', warning_text: warningText, files: files, my_submission: mySubmission, watched: isWatched,
        questions: questions
      });
    }

    // Google Drive video havolasi (stream / preview orqali o'ynatish)
    var driveVidMatch = rawVideoUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || rawVideoUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (/drive\.google\.com/i.test(rawVideoUrl) && driveVidMatch && driveVidMatch[1]) {
      return res.json({
        id: lesson.id, title: lesson.title, video_type: 'drive',
        bunny_player_url: 'https://drive.google.com/file/d/' + driveVidMatch[1] + '/preview',
        task_text: lesson.task_text || '', warning_text: warningText, files: files, my_submission: mySubmission, watched: isWatched,
        questions: questions
      });
    }

    // Har qanday boshqa to'g'ridan-to'g'ri video yoki ochiq stream havolasi
    if (/^https?:\/\//i.test(rawVideoUrl)) {
      return res.json({
        id: lesson.id, title: lesson.title, video_type: 'stream',
        bunny_player_url: rawVideoUrl,
        task_text: lesson.task_text || '', warning_text: warningText, files: files, my_submission: mySubmission, watched: isWatched,
        questions: questions
      });
    }

    return res.json({
      id: lesson.id, title: lesson.title, video_type: null,
      task_text: lesson.task_text || '', warning_text: warningText, files: files, my_submission: mySubmission, watched: isWatched,
      questions: questions
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
    var result = await pool.query(
      `SELECT lq.id, lq.lesson_id, lq.user_id, lq.question, lq.answer, lq.status, lq.created_at, lq.answered_at,
              u.first_name, u.last_name, u.username, u.phone, u.telegram_id,
              l.title AS lesson_title, m.title AS module_title, c.title AS course_title, c.id AS course_id
       FROM lesson_questions lq
       JOIN users u ON u.id = lq.user_id
       JOIN lessons l ON l.id = lq.lesson_id
       JOIN modules m ON m.id = l.module_id
       LEFT JOIN courses c ON c.id = m.course_id
       ORDER BY (CASE WHEN lq.status = 'pending' THEN 0 ELSE 1 END) ASC, lq.created_at DESC`
    );

    return res.json({ ok: true, questions: result.rows });
  } catch (error) {
    console.error('ADMIN QUESTIONS LIST ERROR:', error);
    return res.status(500).json({ error: 'Savollar ro‘yxatini olishda xatolik' });
  }
});

// Admin o'quvchi savoliga Mini App ichida javob berishi
app.post('/api/admin/questions/:id/reply', requireAdmin, async function (req, res) {
  try {
    var questionId = Number(req.params.id);
    var answerText = String(req.body.answer || '').trim();
    if (!answerText) {
      return res.status(400).json({ error: 'Javob matni bo‘sh bo‘lishi mumkin emas' });
    }

    var result = await pool.query(
      `UPDATE lesson_questions
       SET answer = $1, status = 'answered', answered_at = NOW(), answered_by = $2
       WHERE id = $3
       RETURNING *`,
      [answerText, req.user.telegram_id, questionId]
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
// LIVE ACTIVITY & HEARTBEAT
// ======================================================

app.post('/api/activity/heartbeat', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) {
      return res.status(401).json({ error: 'Autentifikatsiya xatosi' });
    }

    var b = req.body || {};
    var currentTab = (b.current_tab || 'home').slice(0, 50);
    var status = (b.status || 'online').slice(0, 50);
    var lessonId = b.lesson_id ? parseInt(b.lesson_id) : null;
    var lessonTitle = b.lesson_title ? String(b.lesson_title).slice(0, 500) : null;
    var moduleTitle = b.module_title ? String(b.module_title).slice(0, 500) : null;
    var courseTitle = b.course_title ? String(b.course_title).slice(0, 500) : null;
    var videoProgress = Math.max(0, parseInt(b.video_progress) || 0);
    var videoDuration = Math.max(0, parseInt(b.video_duration) || 0);
    var videoStatus = (b.video_status || 'watching').slice(0, 30);
    var moduleId = b.module_id ? parseInt(b.module_id) : null;
    var testQuestionIndex = Math.max(0, parseInt(b.test_question_index) || 0);
    var testTotalQuestions = Math.max(0, parseInt(b.test_total_questions) || 0);
    var deviceInfo = (b.device_info || '').slice(0, 100);

    if (lessonId && videoStatus === 'watching') {
      status = 'watching';
    } else if (moduleId && status === 'testing') {
      status = 'testing';
    }

    await pool.query(`
      INSERT INTO user_activity (
        user_id, last_seen_at, current_tab, status,
        lesson_id, lesson_title, module_title, course_title,
        video_progress, video_duration, video_status,
        module_id, test_question_index, test_total_questions,
        device_info, updated_at
      ) VALUES (
        $1, NOW(), $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW()
      )
      ON CONFLICT (user_id) DO UPDATE SET
        last_seen_at = NOW(),
        current_tab = EXCLUDED.current_tab,
        status = EXCLUDED.status,
        lesson_id = EXCLUDED.lesson_id,
        lesson_title = EXCLUDED.lesson_title,
        module_title = EXCLUDED.module_title,
        course_title = EXCLUDED.course_title,
        video_progress = EXCLUDED.video_progress,
        video_duration = EXCLUDED.video_duration,
        video_status = EXCLUDED.video_status,
        module_id = EXCLUDED.module_id,
        test_question_index = EXCLUDED.test_question_index,
        test_total_questions = EXCLUDED.test_total_questions,
        device_info = EXCLUDED.device_info,
        updated_at = NOW()
    `, [
      user.id, currentTab, status,
      lessonId, lessonTitle, moduleTitle, courseTitle,
      videoProgress, videoDuration, videoStatus,
      moduleId, testQuestionIndex, testTotalQuestions,
      deviceInfo
    ]);

    await pool.query('UPDATE users SET device_last_seen = NOW() WHERE id = $1', [user.id]);

    return res.json({ ok: true, server_time: new Date() });
  } catch (error) {
    console.error('HEARTBEAT ERROR:', error.message);
    if (error.message && (error.message.includes('column') || error.message.includes('relation') || error.message.includes('does not exist'))) {
      ensureUserActivityTable().catch(function(e) { console.error('Auto repair error:', e.message); });
    }
    return res.status(500).json({ error: 'Heartbeat xatosi' });
  }
});

// ======================================================
// ADMIN STATS & LIVE ANALYTICS
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

    // Live counts (safe query with fallback)
    var la = { online_now: 0, watching_now: 0, testing_now: 0, today_active: 0 };
    try {
      var liveResult = await pool.query(`
        SELECT
          COUNT(CASE WHEN last_seen_at >= NOW() - INTERVAL '75 SECONDS' THEN 1 END)::int AS online_now,
          COUNT(CASE WHEN last_seen_at >= NOW() - INTERVAL '75 SECONDS' AND (status = 'watching' OR video_status = 'watching') THEN 1 END)::int AS watching_now,
          COUNT(CASE WHEN last_seen_at >= NOW() - INTERVAL '75 SECONDS' AND status = 'testing' THEN 1 END)::int AS testing_now,
          COUNT(DISTINCT CASE WHEN last_seen_at >= CURRENT_DATE THEN user_id END)::int AS today_active
        FROM user_activity
      `);
      if (liveResult.rows[0]) {
        la = liveResult.rows[0];
      }
    } catch (liveErr) {
      console.error('LIVE STATS QUERY WARNING:', liveErr.message);
      ensureUserActivityTable().catch(function(e) { console.error('Auto repair error:', e.message); });
    }

    var todayProgressResult = await pool.query(`
      SELECT COUNT(*)::int AS today_views FROM progress WHERE watched = true AND watched_at >= CURRENT_DATE
    `);
    var todayTestsResult = await pool.query(`
      SELECT COUNT(*)::int AS today_tests FROM module_results WHERE attempted_at >= CURRENT_DATE
    `);

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
        online_now: la.online_now || 0,
        watching_now: la.watching_now || 0,
        testing_now: la.testing_now || 0,
        today_active: Math.max(la.today_active || 0, la.online_now || 0),
        today_lesson_views: todayProgressResult.rows[0]?.today_views || 0,
        today_test_attempts: todayTestsResult.rows[0]?.today_tests || 0
      }
    });
  } catch (error) {
    console.error('ADMIN STATS ERROR:', error);
    return res.status(500).json({ error: 'Statistikani olishda xato' });
  }
});

app.post('/api/admin/live-activity', requireAdmin, async function (req, res) {
  try {
    var liveStatsPromise = pool.query(`
      SELECT
        COUNT(*)::int AS total_students,
        COUNT(CASE WHEN access_until > NOW() THEN 1 END)::int AS paid_students,
        COUNT(CASE WHEN access_until IS NULL OR access_until <= NOW() THEN 1 END)::int AS unpaid_students
      FROM users
    `).catch(function(e) {
      console.warn('liveStatsPromise warn:', e.message);
      return { rows: [{ total_students: 0, paid_students: 0, unpaid_students: 0 }] };
    });

    var liveActivityPromise = pool.query(`
      SELECT
        COUNT(CASE WHEN last_seen_at >= NOW() - INTERVAL '75 SECONDS' THEN 1 END)::int AS online_now,
        COUNT(CASE WHEN last_seen_at >= NOW() - INTERVAL '75 SECONDS' AND (status = 'watching' OR video_status = 'watching') THEN 1 END)::int AS watching_now,
        COUNT(CASE WHEN last_seen_at >= NOW() - INTERVAL '75 SECONDS' AND status = 'testing' THEN 1 END)::int AS testing_now,
        COUNT(DISTINCT CASE WHEN last_seen_at >= CURRENT_DATE THEN user_id END)::int AS today_active
      FROM user_activity
    `).catch(function(e) {
      console.warn('liveActivityPromise warn:', e.message);
      ensureUserActivityTable().catch(function(err) { console.error('Auto repair error:', err.message); });
      return { rows: [{ online_now: 0, watching_now: 0, testing_now: 0, today_active: 0 }] };
    });

    var todayProgressPromise = pool.query(`
      SELECT COUNT(*)::int AS today_lesson_views
      FROM progress
      WHERE watched = true AND watched_at >= CURRENT_DATE
    `).catch(function() { return { rows: [{ today_lesson_views: 0 }] }; });

    var todayTestsPromise = pool.query(`
      SELECT
        COUNT(*)::int AS today_test_attempts,
        COUNT(CASE WHEN passed = true THEN 1 END)::int AS today_test_passed
      FROM module_results
      WHERE attempted_at >= CURRENT_DATE
    `).catch(function() { return { rows: [{ today_test_attempts: 0, today_test_passed: 0 }] }; });

    var activeUsersPromise = pool.query(`
      SELECT
        ua.user_id, ua.last_seen_at, ua.current_tab, ua.status,
        ua.lesson_id, ua.lesson_title, ua.module_title, ua.course_title,
        ua.video_progress, ua.video_duration, ua.video_status,
        ua.module_id, ua.test_question_index, ua.test_total_questions,
        ua.device_info, ua.updated_at,
        u.telegram_id, u.first_name, u.last_name, u.username, u.phone, u.access_until
      FROM user_activity ua
      JOIN users u ON u.id = ua.user_id
      WHERE ua.last_seen_at >= NOW() - INTERVAL '20 MINUTES'
      ORDER BY ua.last_seen_at DESC
      LIMIT 60
    `).catch(function(e) {
      console.warn('activeUsersPromise warn:', e.message);
      ensureUserActivityTable().catch(function(err) { console.error('Auto repair error:', err.message); });
      return { rows: [] };
    });

    var [liveStatsRes, liveActRes, todayProgRes, todayTestsRes, activeUsersRes] = await Promise.all([
      liveStatsPromise,
      liveActivityPromise,
      todayProgressPromise,
      todayTestsPromise,
      activeUsersPromise
    ]);

    var ls = liveStatsRes.rows[0] || {};
    var la = liveActRes.rows[0] || {};
    var tp = todayProgRes.rows[0] || {};
    var tt = todayTestsRes.rows[0] || {};

    return res.json({
      ok: true,
      stats: {
        total_students: ls.total_students || 0,
        paid_students: ls.paid_students || 0,
        unpaid_students: ls.unpaid_students || 0,
        online_now: la.online_now || 0,
        watching_now: la.watching_now || 0,
        testing_now: la.testing_now || 0,
        today_active: Math.max(la.today_active || 0, la.online_now || 0),
        today_lesson_views: tp.today_lesson_views || 0,
        today_test_attempts: tt.today_test_attempts || 0,
        today_test_passed: tt.today_test_passed || 0
      },
      active_users: activeUsersRes.rows || []
    });
  } catch (error) {
    console.error('LIVE ACTIVITY ERROR:', error);
    return res.status(500).json({ error: 'Live statistikalarni olishda xato' });
  }
});

app.post('/api/admin/analytics/history', requireAdmin, async function (req, res) {
  try {
    var period = req.body.period || '7days';
    var startDateSql = "CURRENT_DATE - INTERVAL '6 DAYS'";
    var endDateSql = "CURRENT_DATE + INTERVAL '1 DAY'";

    if (period === 'today') {
      startDateSql = "CURRENT_DATE";
      endDateSql = "CURRENT_DATE + INTERVAL '1 DAY'";
    } else if (period === 'yesterday') {
      startDateSql = "CURRENT_DATE - INTERVAL '1 DAY'";
      endDateSql = "CURRENT_DATE";
    } else if (period === '30days') {
      startDateSql = "CURRENT_DATE - INTERVAL '29 DAYS'";
      endDateSql = "CURRENT_DATE + INTERVAL '1 DAY'";
    }

    var summaryPromise = pool.query(`
      SELECT
        (SELECT COUNT(*)::int FROM users WHERE created_at >= ${startDateSql} AND created_at < ${endDateSql}) AS new_users,
        (SELECT COUNT(DISTINCT user_id)::int FROM user_activity WHERE last_seen_at >= ${startDateSql} AND last_seen_at < ${endDateSql}) AS active_users,
        (SELECT COUNT(*)::int FROM progress WHERE watched = true AND watched_at >= ${startDateSql} AND watched_at < ${endDateSql}) AS lesson_views,
        (SELECT COUNT(*)::int FROM module_results WHERE attempted_at >= ${startDateSql} AND attempted_at < ${endDateSql}) AS test_attempts,
        (SELECT COUNT(*)::int FROM module_results WHERE passed = true AND attempted_at >= ${startDateSql} AND attempted_at < ${endDateSql}) AS passed_tests
    `).catch(function(e) {
      console.warn('summaryPromise error:', e.message);
      ensureUserActivityTable().catch(function(err) { console.error('Auto repair error:', err.message); });
      return { rows: [{ new_users: 0, active_users: 0, lesson_views: 0, test_attempts: 0, passed_tests: 0 }] };
    });

    var dailyPromise = pool.query(`
      WITH dates AS (
        SELECT generate_series(
          (${startDateSql})::date,
          (LEAST((${endDateSql})::date - INTERVAL '1 DAY', CURRENT_DATE))::date,
          '1 day'::interval
        )::date AS day
      )
      SELECT
        d.day::text AS date,
        TO_CHAR(d.day, 'DD.MM') AS label,
        COALESCE(u.cnt, 0)::int AS new_users,
        COALESCE(p.cnt, 0)::int AS lesson_views,
        COALESCE(t.cnt, 0)::int AS test_attempts
      FROM dates d
      LEFT JOIN (
        SELECT created_at::date AS day, COUNT(*) AS cnt FROM users GROUP BY day
      ) u ON u.day = d.day
      LEFT JOIN (
        SELECT watched_at::date AS day, COUNT(*) AS cnt FROM progress WHERE watched = true GROUP BY day
      ) p ON p.day = d.day
      LEFT JOIN (
        SELECT attempted_at::date AS day, COUNT(*) AS cnt FROM module_results GROUP BY day
      ) t ON t.day = d.day
      ORDER BY d.day ASC
    `);

    var [summaryRes, dailyRes] = await Promise.all([summaryPromise, dailyPromise]);
    var summary = summaryRes.rows[0] || {};

    return res.json({
      ok: true,
      period: period,
      summary: {
        new_users: summary.new_users || 0,
        active_users: Math.max(summary.active_users || 0, summary.new_users || 0),
        lesson_views: summary.lesson_views || 0,
        test_attempts: summary.test_attempts || 0,
        passed_tests: summary.passed_tests || 0
      },
      daily: dailyRes.rows
    });
  } catch (error) {
    console.error('ANALYTICS HISTORY ERROR:', error);
    return res.status(500).json({ error: 'Tarixiy tahlillarni olishda xato' });
  }
});

app.post('/api/admin/student/:id/live-dossier', requireAdmin, async function (req, res) {
  try {
    var userId = parseInt(req.params.id);
    var uRes = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (!uRes.rows.length) return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });

    var user = uRes.rows[0];
    var actRes = await pool.query('SELECT * FROM user_activity WHERE user_id = $1', [userId]);
    var activity = actRes.rows[0] || null;

    var progRes = await pool.query('SELECT COUNT(*)::int AS watched FROM progress WHERE user_id = $1 AND watched = true', [userId]);
    var totalLessRes = await pool.query('SELECT COUNT(*)::int AS total FROM lessons');
    var testsRes = await pool.query(`
      SELECT mr.*, m.title AS module_title
      FROM module_results mr
      JOIN modules m ON m.id = mr.module_id
      WHERE mr.user_id = $1
      ORDER BY mr.attempted_at DESC
    `, [userId]);

    return res.json({
      ok: true,
      student: {
        id: user.id,
        telegram_id: user.telegram_id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        phone: user.phone,
        access_until: user.access_until,
        created_at: user.created_at,
        watched_lessons: progRes.rows[0].watched || 0,
        total_lessons: totalLessRes.rows[0].total || 0,
        activity: activity,
        tests: testsRes.rows
      }
    });
  } catch (error) {
    console.error('STUDENT LIVE DOSSIER ERROR:', error);
    return res.status(500).json({ error: 'O\'quvchi ma\'lumotlarini olishda xato' });
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
      'SELECT id, telegram_id, first_name, last_name, phone, username, access_until, created_at FROM users WHERE id = $1 LIMIT 1',
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
        has_access: student.access_until && new Date(student.access_until) > new Date()
      },
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
    var coverUrl = formatDirectImageUrl(String(req.body.cover_url || '').trim());
    var status = String(req.body.status || 'draft').trim();
    if (status !== 'active' && status !== 'draft') status = 'draft';
    var categories = Array.isArray(req.body.categories) && req.body.categories.length
      ? req.body.categories.map(function (c) { return String(c).trim(); }).filter(Boolean)
      : ['Boshqa'];
    var category = categories[0];
    var discountPrice = req.body.discount_price ? String(req.body.discount_price).trim() : null;
    var discountUntil = req.body.discount_until ? new Date(req.body.discount_until) : null;

    if (!title) return res.status(400).json({ error: 'Kurs nomi majburiy' });

    var result = await pool.query(
      'INSERT INTO courses (title, subtitle, price, total_modules, total_lessons, release_date, cover_url, status, category, categories, discount_price, discount_until, order_index) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, (SELECT COALESCE(MAX(order_index), 0) + 1 FROM courses)) RETURNING *',
      [title, subtitle, price, totalModules, totalLessons, releaseDate, coverUrl, status, category, categories, discountPrice || null, discountUntil]
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
    var coverUrl = formatDirectImageUrl(String(req.body.cover_url || '').trim());
    var status = String(req.body.status || 'draft').trim();
    if (status !== 'active' && status !== 'draft') status = 'draft';
    var categories = Array.isArray(req.body.categories) && req.body.categories.length
      ? req.body.categories.map(function (c) { return String(c).trim(); }).filter(Boolean)
      : ['Boshqa'];
    var category = categories[0];
    var discountPrice = req.body.discount_price ? String(req.body.discount_price).trim() : null;
    var discountUntil = req.body.discount_until ? new Date(req.body.discount_until) : null;

    if (!title) return res.status(400).json({ error: 'Kurs nomi majburiy' });

    var result = await pool.query(
      'UPDATE courses SET title = $1, subtitle = $2, price = $3, total_modules = $4, total_lessons = $5, release_date = $6, cover_url = $7, status = $8, category = $9, categories = $10, discount_price = $11, discount_until = $12 WHERE id = $13 RETURNING *',
      [title, subtitle, price, totalModules, totalLessons, releaseDate, coverUrl, status, category, categories, discountPrice || null, discountUntil, Number(req.params.id)]
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

app.post('/api/admin/courses/:id/delete', requireAdmin, async function (req, res) {
  try {
    await pool.query('DELETE FROM courses WHERE id = $1', [Number(req.params.id)]);
    return res.json({ ok: true, message: 'Kurs o‘chirildi' });
  } catch (error) {
    console.error('DELETE COURSE ERROR:', error);
    return res.status(500).json({ error: 'Kursni o‘chirishda xato' });
  }
});

app.post('/api/admin/courses/:id/toggle-home', requireAdmin, async function (req, res) {
  try {
    var id = Number(req.params.id);
    var courseRes = await pool.query('SELECT show_on_home FROM courses WHERE id = $1', [id]);
    if (courseRes.rows.length === 0) return res.status(404).json({ error: 'Kurs topilmadi' });
    var newState = !courseRes.rows[0].show_on_home;
    var result = await pool.query('UPDATE courses SET show_on_home = $1 WHERE id = $2 RETURNING *', [newState, id]);
    return res.json({ ok: true, course: result.rows[0] });
  } catch (error) {
    console.error('TOGGLE COURSE HOME ERROR:', error);
    return res.status(500).json({ error: 'Bosh sahifa holatini o‘zgartirishda xato' });
  }
});

// ======================================================
// ADMIN SETTINGS (Talab 1 & 5: Aloqa, Ijtimoiy Tarmoqlar & Rasm)
// ======================================================

app.post('/api/admin/settings/update', requireAdmin, async function (req, res) {
  try {
    var contactTelegram = String(req.body.contact_telegram || '').trim().replace(/^@/, '');
    var contactPhone = String(req.body.contact_phone || '').trim();
    var adminPhotoUrl = String(req.body.admin_photo_url || '').trim();
    var socialTelegram = String(req.body.social_telegram || '').trim();
    var socialInstagram = String(req.body.social_instagram || '').trim();
    var socialYoutube = String(req.body.social_youtube || '').trim();
    var socialChannel = String(req.body.social_channel || '').trim();

    if (adminPhotoUrl) {
      adminPhotoUrl = formatDirectImageUrl(adminPhotoUrl);
      await pool.query('INSERT INTO academy_settings (key, value) VALUES (\'admin_photo_url\', $1) ON CONFLICT (key) DO UPDATE SET value = $1', [adminPhotoUrl]);
    }
    if (contactTelegram) {
      await pool.query('INSERT INTO academy_settings (key, value) VALUES (\'contact_telegram\', $1) ON CONFLICT (key) DO UPDATE SET value = $1', [contactTelegram]);
    }
    if (contactPhone) {
      await pool.query('INSERT INTO academy_settings (key, value) VALUES (\'contact_phone\', $1) ON CONFLICT (key) DO UPDATE SET value = $1', [contactPhone]);
    }
    if (socialTelegram) {
      await pool.query('INSERT INTO academy_settings (key, value) VALUES (\'social_telegram\', $1) ON CONFLICT (key) DO UPDATE SET value = $1', [socialTelegram]);
    }
    if (socialInstagram) {
      await pool.query('INSERT INTO academy_settings (key, value) VALUES (\'social_instagram\', $1) ON CONFLICT (key) DO UPDATE SET value = $1', [socialInstagram]);
    }
    if (socialYoutube) {
      await pool.query('INSERT INTO academy_settings (key, value) VALUES (\'social_youtube\', $1) ON CONFLICT (key) DO UPDATE SET value = $1', [socialYoutube]);
    }
    if (socialChannel) {
      await pool.query('INSERT INTO academy_settings (key, value) VALUES (\'social_channel\', $1) ON CONFLICT (key) DO UPDATE SET value = $1', [socialChannel]);
    }

    if (req.body.free_minicourse_title !== undefined) {
      await pool.query('INSERT INTO academy_settings (key, value) VALUES (\'free_minicourse_title\', $1) ON CONFLICT (key) DO UPDATE SET value = $1', [String(req.body.free_minicourse_title).trim()]);
    }
    if (req.body.free_minicourse_subtitle !== undefined) {
      await pool.query('INSERT INTO academy_settings (key, value) VALUES (\'free_minicourse_subtitle\', $1) ON CONFLICT (key) DO UPDATE SET value = $1', [String(req.body.free_minicourse_subtitle).trim()]);
    }
    if (req.body.free_minicourse_points !== undefined) {
      await pool.query('INSERT INTO academy_settings (key, value) VALUES (\'free_minicourse_points\', $1) ON CONFLICT (key) DO UPDATE SET value = $1', [String(req.body.free_minicourse_points).trim()]);
    }
    if (req.body.free_minicourse_lesson_ids !== undefined) {
      await pool.query('INSERT INTO academy_settings (key, value) VALUES (\'free_minicourse_lesson_ids\', $1) ON CONFLICT (key) DO UPDATE SET value = $1', [String(req.body.free_minicourse_lesson_ids).trim()]);
    }

    return res.json({ ok: true, message: 'Sozlamalar saqlandi' });
  } catch (error) {
    console.error('SETTINGS UPDATE ERROR:', error);
    return res.status(500).json({ error: 'Sozlamalarni saqlashda xato' });
  }
});

// ======================================================
// SUPPORT CARDS API (FOYDALANUVCHILAR VA ADMIN BOSHQARUVI)
// ======================================================

// Ommaviy / Foydalanuvchi: Faol kartalar ro'yxati
app.get('/api/support-cards', async function (req, res) {
  try {
    var result = await pool.query(
      'SELECT id, card_type, card_number, cardholder_name, is_active FROM support_cards WHERE is_active = true ORDER BY id ASC'
    );
    return res.json({ success: true, cards: result.rows });
  } catch (error) {
    console.error('SUPPORT CARDS GET ERROR:', error);
    return res.status(500).json({ error: 'Server xatosi' });
  }
});

// Admin: Barcha kartalar ro'yxati (faol va nofaol)
app.post('/api/admin/support-cards/list', requireAdmin, async function (req, res) {
  try {
    var result = await pool.query('SELECT * FROM support_cards ORDER BY id ASC');
    return res.json({ success: true, cards: result.rows });
  } catch (error) {
    console.error('ADMIN SUPPORT CARDS LIST ERROR:', error);
    return res.status(500).json({ error: 'Server xatosi' });
  }
});

// Admin: Yangi karta qo'shish
app.post('/api/admin/support-cards/add', requireAdmin, async function (req, res) {
  try {
    var cardType = String(req.body.card_type || 'UZCARD').trim().toUpperCase();
    var cardNumber = String(req.body.card_number || '').trim();
    var cardholderName = String(req.body.cardholder_name || '').trim().toUpperCase();
    var isActive = req.body.is_active !== undefined ? Boolean(req.body.is_active) : true;

    if (!cardNumber) return res.status(400).json({ error: 'Karta raqamini kiriting' });
    if (!cardholderName) return res.status(400).json({ error: 'Karta egasini kiriting' });

    var result = await pool.query(
      'INSERT INTO support_cards (card_type, card_number, cardholder_name, is_active) VALUES ($1, $2, $3, $4) RETURNING *',
      [cardType, cardNumber, cardholderName, isActive]
    );
    return res.json({ success: true, card: result.rows[0] });
  } catch (error) {
    console.error('ADMIN SUPPORT CARDS ADD ERROR:', error);
    return res.status(500).json({ error: 'Server xatosi' });
  }
});

// Admin: Karta ma'lumotlarini tahrirlash / saqlash
app.post('/api/admin/support-cards/:id/update', requireAdmin, async function (req, res) {
  try {
    var id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'ID notogri' });

    var cardType = String(req.body.card_type || 'UZCARD').trim().toUpperCase();
    var cardNumber = String(req.body.card_number || '').trim();
    var cardholderName = String(req.body.cardholder_name || '').trim().toUpperCase();
    var isActive = req.body.is_active !== undefined ? Boolean(req.body.is_active) : true;

    if (!cardNumber) return res.status(400).json({ error: 'Karta raqamini kiriting' });
    if (!cardholderName) return res.status(400).json({ error: 'Karta egasini kiriting' });

    var result = await pool.query(
      'UPDATE support_cards SET card_type = $1, card_number = $2, cardholder_name = $3, is_active = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [cardType, cardNumber, cardholderName, isActive, id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Karta topilmadi' });
    return res.json({ success: true, card: result.rows[0] });
  } catch (error) {
    console.error('ADMIN SUPPORT CARDS UPDATE ERROR:', error);
    return res.status(500).json({ error: 'Server xatosi' });
  }
});

// Admin: Karta faolligini yoqish / o'chirish (Toggle)
app.post('/api/admin/support-cards/:id/toggle', requireAdmin, async function (req, res) {
  try {
    var id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'ID notogri' });

    var result = await pool.query(
      'UPDATE support_cards SET is_active = NOT is_active, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Karta topilmadi' });
    return res.json({ success: true, card: result.rows[0] });
  } catch (error) {
    console.error('ADMIN SUPPORT CARDS TOGGLE ERROR:', error);
    return res.status(500).json({ error: 'Server xatosi' });
  }
});

// ======================================================
// ADMIN TESTIMONIALS (O'quvchilar fikri CRUD)
// ======================================================

app.post('/api/admin/testimonials/add', requireAdmin, async function (req, res) {
  try {
    var name = req.body.name ? String(req.body.name).trim() : '';
    var text = req.body.text ? String(req.body.text).trim() : '';
    var role = req.body.role ? String(req.body.role).trim() : 'O\'quvchi';

    if (!name || !text) {
      return res.status(400).json({ error: 'Ism va fikr matni kiritilishi shart' });
    }

    var result = await pool.query(
      'INSERT INTO testimonials (name, text, role) VALUES ($1, $2, $3) RETURNING *',
      [name, text, role]
    );

    return res.json({ ok: true, testimonial: result.rows[0] });
  } catch (error) {
    console.error('ADD TESTIMONIAL ERROR:', error);
    return res.status(500).json({ error: 'Fikr qo‘shishda xato: ' + error.message });
  }
});

app.post('/api/admin/testimonials/:id/update', requireAdmin, async function (req, res) {
  try {
    var id = Number(req.params.id);
    var name = req.body.name ? String(req.body.name).trim() : '';
    var text = req.body.text ? String(req.body.text).trim() : '';
    var role = req.body.role ? String(req.body.role).trim() : 'O\'quvchi';

    if (!name || !text) {
      return res.status(400).json({ error: 'Ism va fikr matni kiritilishi shart' });
    }

    var result = await pool.query(
      'UPDATE testimonials SET name = $1, text = $2, role = $3 WHERE id = $4 RETURNING *',
      [name, text, role, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Fikr topilmadi' });
    return res.json({ ok: true, testimonial: result.rows[0] });
  } catch (error) {
    console.error('UPDATE TESTIMONIAL ERROR:', error);
    return res.status(500).json({ error: 'Fikrni yangilashda xato: ' + error.message });
  }
});

app.post('/api/admin/testimonials/:id/delete', requireAdmin, async function (req, res) {
  try {
    var id = Number(req.params.id);
    await pool.query('DELETE FROM testimonials WHERE id = $1', [id]);
    return res.json({ ok: true, message: 'Fikr o‘chirildi' });
  } catch (error) {
    console.error('DELETE TESTIMONIAL ERROR:', error);
    return res.status(500).json({ error: 'Fikrni o‘chirishda xato' });
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
// COURSE SHOWCASES / PORTFOLIO API (Talab 3)
// ======================================================

app.all(['/api/showcases'], async function (req, res) {
  try {
    var result = await pool.query('SELECT * FROM course_showcases ORDER BY order_index ASC, id ASC');
    return res.json({ ok: true, showcases: result.rows });
  } catch (error) {
    console.error('GET SHOWCASES ERROR:', error);
    return res.status(500).json({ error: 'Natijalar ro‘yxatini olishda xatolik' });
  }
});

function extractGoogleDriveId(rawUrl) {
  if (!rawUrl) return null;
  var str = String(rawUrl).trim();
  var match = str.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  match = str.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  match = str.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9_-]{20,}$/.test(str)) return str;
  return null;
}

// PDF fayllarni frontend uchun CORS, Range streaming (206) va disk kesh bilan proxy qilish
var pdfCacheDir = path.join(__dirname, '.cache', 'pdf');
try {
  if (!fs.existsSync(pdfCacheDir)) {
    fs.mkdirSync(pdfCacheDir, { recursive: true });
  }
} catch (cErr) {
  console.warn('PDF cache dir init warning:', cErr.message);
}

function streamPdfFromLocalFile(filePath, req, res) {
  try {
    var stat = fs.statSync(filePath);
    var fileSize = stat.size;
    var range = req.headers.range;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=604800');

    if (range) {
      var parts = range.replace(/bytes=/, '').split('-');
      var start = parseInt(parts[0], 10);
      var end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      if (isNaN(start) || start >= fileSize) {
        res.setHeader('Content-Range', 'bytes */' + fileSize);
        return res.status(416).send('Requested range not satisfiable');
      }
      if (end >= fileSize) end = fileSize - 1;
      var chunksize = (end - start) + 1;
      res.status(206);
      res.setHeader('Content-Range', 'bytes ' + start + '-' + end + '/' + fileSize);
      res.setHeader('Content-Length', chunksize);
      var fileStream = fs.createReadStream(filePath, { start: start, end: end });
      return fileStream.pipe(res);
    } else {
      res.setHeader('Content-Length', fileSize);
      var fileStream = fs.createReadStream(filePath);
      return fileStream.pipe(res);
    }
  } catch (stErr) {
    console.error('STREAM CACHED PDF ERROR:', stErr.message);
    return res.status(500).json({ error: 'Faylni o\'qishda xatolik' });
  }
}

app.get('/api/pdf-proxy', async function (req, res) {
  try {
    var rawUrl = req.query.url ? String(req.query.url).trim() : '';
    var fileId = req.query.id ? String(req.query.id).trim() : extractGoogleDriveId(rawUrl);

    if (!fileId && (!rawUrl || !/^https?:\/\//i.test(rawUrl))) {
      return res.status(400).json({ error: 'Fayl manzili ko‘rsatilmadi' });
    }

    var cacheKey = crypto.createHash('md5').update(fileId || rawUrl).digest('hex');
    var cacheFile = path.join(pdfCacheDir, cacheKey + '.pdf');

    // 1. Agar keshda mavjud bo'lsa va hajmi > 1024 bayt bo'lsa — bir zumda keshdan uzatish
    if (fs.existsSync(cacheFile)) {
      try {
        var stat = fs.statSync(cacheFile);
        if (stat.size > 1024) {
          return streamPdfFromLocalFile(cacheFile, req, res);
        }
      } catch (checkErr) {}
    }

    // 2. Keshda yo'q bo'lsa, manbadan yuklab olib keshga yozish
    var targetUrl = '';
    if (fileId) {
      targetUrl = 'https://drive.usercontent.google.com/download?id=' + encodeURIComponent(fileId) + '&export=download&confirm=t';
    } else {
      targetUrl = rawUrl;
    }

    var fetchRes = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      redirect: 'follow'
    });

    var cType = (fetchRes.headers.get('content-type') || '').toLowerCase();
    if (!fetchRes.ok || cType.includes('text/html')) {
      if (fileId) {
        var fbUrl = 'https://drive.google.com/uc?export=download&id=' + encodeURIComponent(fileId) + '&confirm=t';
        var fbRes = await fetch(fbUrl, {
          method: 'GET',
          headers: { 'User-Agent': 'Mozilla/5.0' },
          redirect: 'follow'
        });
        var fbType = (fbRes.headers.get('content-type') || '').toLowerCase();
        if (fbRes.ok && !fbType.includes('text/html')) {
          fetchRes = fbRes;
        } else {
          var html = await fbRes.text();
          var confirmMatch = html.match(/confirm=([0-9a-zA-Z_-]+)/) || html.match(/name="confirm"\s+value="([0-9a-zA-Z_-]+)"/);
          if (confirmMatch && confirmMatch[1]) {
            var confirmedUrl = 'https://drive.usercontent.google.com/download?id=' + encodeURIComponent(fileId) + '&export=download&confirm=' + confirmMatch[1];
            var confRes = await fetch(confirmedUrl, {
              method: 'GET',
              headers: { 'User-Agent': 'Mozilla/5.0' },
              redirect: 'follow'
            });
            if (confRes.ok) {
              fetchRes = confRes;
            }
          }
        }
      }
    }

    if (!fetchRes.ok) {
      return res.status(502).json({ error: 'PDF faylni manbadan yuklab bo‘lmadi (' + fetchRes.status + ')' });
    }

    var arrayBuffer = await fetchRes.arrayBuffer();
    var buffer = Buffer.from(arrayBuffer);

    // Keshga saqlash
    try {
      fs.writeFileSync(cacheFile, buffer);
      return streamPdfFromLocalFile(cacheFile, req, res);
    } catch (saveErr) {
      console.warn('PDF cache save error:', saveErr.message);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
      return res.send(buffer);
    }
  } catch (error) {
    console.error('PDF PROXY ERROR:', error);
    return res.status(500).json({ error: 'PDF faylni yuklashda xatolik yuz berdi' });
  }
});

// Admin uchun Google Drive PDF listlarini o'qish va tahlil qilish
app.post('/api/admin/showcases/inspect-pdf', requireAdmin, async function (req, res) {
  try {
    var rawUrl = req.body.pdf_url ? String(req.body.pdf_url).trim() : '';
    if (!rawUrl) {
      return res.status(400).json({ error: 'PDF havolasi kiritilmadi' });
    }
    var fileId = extractGoogleDriveId(rawUrl);
    var downloadUrl = fileId
      ? 'https://drive.usercontent.google.com/download?id=' + encodeURIComponent(fileId) + '&export=download'
      : rawUrl;

    var response = await fetch(downloadUrl, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      redirect: 'follow'
    });

    if (!response.ok && fileId) {
      downloadUrl = 'https://drive.google.com/uc?export=download&id=' + encodeURIComponent(fileId);
      response = await fetch(downloadUrl, {
        method: 'GET',
        headers: { 'User-Agent': 'Mozilla/5.0' },
        redirect: 'follow'
      });
    }

    if (!response.ok) {
      return res.status(400).json({
        ok: false,
        error: 'Google Drive faylini avtomatik yuklab bo‘lmadi (' + response.status + '). Havola "Hammaga ochiq" (Anyone with the link) ekanini tekshiring yoki listlar sonini qo‘lda belgilang.'
      });
    }

    var buffer = Buffer.from(await response.arrayBuffer());
    var str = buffer.toString('latin1');

    var pageCount = 0;
    var pageMatches = str.match(/\/Type\s*\/Page[^s]/g);
    if (pageMatches && pageMatches.length > 0) {
      pageCount = pageMatches.length;
    } else {
      var countMatches = str.match(/\/Count\s+(\d+)/g);
      if (countMatches) {
        var max = 0;
        for (var i = 0; i < countMatches.length; i++) {
          var num = parseInt(countMatches[i].replace(/[^0-9]/g, ''), 10);
          if (num > max) max = num;
        }
        if (max > 0) pageCount = max;
      }
    }

    if (!pageCount || pageCount < 1) {
      pageCount = 10;
    }

    return res.json({
      ok: true,
      file_id: fileId,
      total_pages: pageCount,
      message: 'PDF muvaffaqiyatli o‘qildi: jami ' + pageCount + ' ta list aniqlandi.'
    });
  } catch (error) {
    console.error('INSPECT PDF ERROR:', error);
    return res.status(500).json({ ok: false, error: 'PDF tahlilida xatolik: ' + error.message });
  }
});

app.post('/api/admin/showcases/add', requireAdmin, async function (req, res) {
  try {
    var courseId = req.body.course_id ? Number(req.body.course_id) : null;
    var courseTitle = req.body.course_title ? String(req.body.course_title).trim() : '';
    var title = req.body.title ? String(req.body.title).trim() : (courseTitle ? courseTitle + ' loyihasi' : 'Revit kursi natijasi');
    var studentName = req.body.student_name ? String(req.body.student_name).trim() : '';
    var description = req.body.description ? String(req.body.description).trim() : '';
    var pdfUrl = req.body.pdf_url ? String(req.body.pdf_url).trim() : '';
    var previewImageUrl = req.body.preview_image_url ? String(req.body.preview_image_url).trim() : '';
    var discountBadge = req.body.discount_badge ? String(req.body.discount_badge).trim() : null;
    var orderIndex = req.body.order_index ? Number(req.body.order_index) : 0;
    var selectedPages = req.body.selected_pages ? String(req.body.selected_pages).trim() : '1, 2, 3, 4, 5';

    if (!pdfUrl) {
      return res.status(400).json({ error: 'PDF linki kiritilishi shart' });
    }

    var result = await pool.query(`
      INSERT INTO course_showcases
      (course_id, course_title, title, student_name, description, pdf_url, preview_image_url, discount_badge, order_index, selected_pages)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [courseId, courseTitle, title, studentName, description, pdfUrl, previewImageUrl, discountBadge, orderIndex, selectedPages]);

    return res.json({ ok: true, showcase: result.rows[0] });
  } catch (error) {
    console.error('ADD SHOWCASE ERROR:', error);
    return res.status(500).json({ error: 'Natija qo‘shishda xatolik: ' + error.message });
  }
});

app.post('/api/admin/showcases/:id/update', requireAdmin, async function (req, res) {
  try {
    var id = Number(req.params.id);
    var courseId = req.body.course_id ? Number(req.body.course_id) : null;
    var courseTitle = req.body.course_title ? String(req.body.course_title).trim() : '';
    var title = req.body.title ? String(req.body.title).trim() : (courseTitle ? courseTitle + ' loyihasi' : 'Revit kursi natijasi');
    var studentName = req.body.student_name ? String(req.body.student_name).trim() : '';
    var description = req.body.description ? String(req.body.description).trim() : '';
    var pdfUrl = req.body.pdf_url ? String(req.body.pdf_url).trim() : '';
    var previewImageUrl = req.body.preview_image_url ? String(req.body.preview_image_url).trim() : '';
    var discountBadge = req.body.discount_badge ? String(req.body.discount_badge).trim() : null;
    var orderIndex = req.body.order_index ? Number(req.body.order_index) : 0;
    var selectedPages = req.body.selected_pages ? String(req.body.selected_pages).trim() : '1, 2, 3, 4, 5';

    if (!pdfUrl) {
      return res.status(400).json({ error: 'PDF linki kiritilishi shart' });
    }

    var result = await pool.query(`
      UPDATE course_showcases
      SET course_id = $1, course_title = $2, title = $3, student_name = $4, description = $5,
          pdf_url = $6, preview_image_url = $7, discount_badge = $8, order_index = $9, selected_pages = $10
      WHERE id = $11
      RETURNING *
    `, [courseId, courseTitle, title, studentName, description, pdfUrl, previewImageUrl, discountBadge, orderIndex, selectedPages, id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Natija topilmadi' });
    return res.json({ ok: true, showcase: result.rows[0] });
  } catch (error) {
    console.error('UPDATE SHOWCASE ERROR:', error);
    return res.status(500).json({ error: 'Natijani yangilashda xatolik: ' + error.message });
  }
});

app.post('/api/admin/showcases/:id/delete', requireAdmin, async function (req, res) {
  try {
    var id = Number(req.params.id);
    await pool.query('DELETE FROM course_showcases WHERE id = $1', [id]);
    return res.json({ ok: true, message: 'Natija o‘chirildi' });
  } catch (error) {
    console.error('DELETE SHOWCASE ERROR:', error);
    return res.status(500).json({ error: 'Natijani o‘chirishda xatolik' });
  }
});

// ======================================================
// LIBRARY OPEN RESOURCES API (Talab 2)
// ======================================================

app.all(['/api/library/open-resources'], async function (req, res) {
  try {
    var result = await pool.query('SELECT * FROM library_open_resources ORDER BY order_index ASC, id ASC');
    return res.json({ ok: true, resources: result.rows });
  } catch (error) {
    console.error('GET OPEN RESOURCES ERROR:', error);
    return res.status(500).json({ error: 'Ochiq manbalarni olishda xatolik' });
  }
});

app.post('/api/admin/library/resources/add', requireAdmin, async function (req, res) {
  try {
    var type = req.body.type ? String(req.body.type).trim() : 'book';
    var title = req.body.title ? String(req.body.title).trim() : '';
    var category = req.body.category ? String(req.body.category).trim() : '';
    var description = req.body.description ? String(req.body.description).trim() : '';
    var linkUrl = req.body.link_url ? String(req.body.link_url).trim() : '';
    var testData = req.body.test_data ? (typeof req.body.test_data === 'string' ? req.body.test_data : JSON.stringify(req.body.test_data)) : '[]';
    var icon = req.body.icon ? String(req.body.icon).trim() : '📚';
    var orderIndex = req.body.order_index ? Number(req.body.order_index) : 0;

    if (!title) return res.status(400).json({ error: 'Sarlavha kiritilishi shart' });

    var result = await pool.query(`
      INSERT INTO library_open_resources (type, title, category, description, link_url, test_data, icon, order_index)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [type, title, category, description, linkUrl, testData, icon, orderIndex]);

    return res.json({ ok: true, resource: result.rows[0] });
  } catch (error) {
    console.error('ADD RESOURCE ERROR:', error);
    return res.status(500).json({ error: 'Manba qo‘shishda xatolik: ' + error.message });
  }
});

app.post('/api/admin/library/resources/:id/update', requireAdmin, async function (req, res) {
  try {
    var id = Number(req.params.id);
    var type = req.body.type ? String(req.body.type).trim() : 'book';
    var title = req.body.title ? String(req.body.title).trim() : '';
    var category = req.body.category ? String(req.body.category).trim() : '';
    var description = req.body.description ? String(req.body.description).trim() : '';
    var linkUrl = req.body.link_url ? String(req.body.link_url).trim() : '';
    var testData = req.body.test_data ? (typeof req.body.test_data === 'string' ? req.body.test_data : JSON.stringify(req.body.test_data)) : '[]';
    var icon = req.body.icon ? String(req.body.icon).trim() : '📚';
    var orderIndex = req.body.order_index ? Number(req.body.order_index) : 0;

    if (!title) return res.status(400).json({ error: 'Sarlavha kiritilishi shart' });

    var result = await pool.query(`
      UPDATE library_open_resources
      SET type = $1, title = $2, category = $3, description = $4, link_url = $5,
          test_data = $6, icon = $7, order_index = $8
      WHERE id = $9
      RETURNING *
    `, [type, title, category, description, linkUrl, testData, icon, orderIndex, id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Manba topilmadi' });
    return res.json({ ok: true, resource: result.rows[0] });
  } catch (error) {
    console.error('UPDATE RESOURCE ERROR:', error);
    return res.status(500).json({ error: 'Manbani yangilashda xatolik: ' + error.message });
  }
});

app.post('/api/admin/library/resources/:id/delete', requireAdmin, async function (req, res) {
  try {
    var id = Number(req.params.id);
    await pool.query('DELETE FROM library_open_resources WHERE id = $1', [id]);
    return res.json({ ok: true, message: 'Manba o‘chirildi' });
  } catch (error) {
    console.error('DELETE RESOURCE ERROR:', error);
    return res.status(500).json({ error: 'Manbani o‘chirishda xatolik' });
  }
});

// ======================================================
// CONSTRUCTION MATERIALS MARKETPLACE API (Talab 6)
// ======================================================

app.all(['/api/materials'], async function (req, res) {
  try {
    var result = await pool.query('SELECT * FROM construction_materials ORDER BY order_index ASC, id ASC');
    return res.json({ ok: true, materials: result.rows });
  } catch (error) {
    console.error('GET MATERIALS ERROR:', error);
    return res.status(500).json({ error: 'Materiallarni olishda xatolik' });
  }
});

app.post('/api/admin/materials/add', requireAdmin, async function (req, res) {
  try {
    var title = req.body.title ? String(req.body.title).trim() : '';
    var category = req.body.category ? String(req.body.category).trim() : 'Devor';
    var subCategory = req.body.sub_category ? String(req.body.sub_category).trim() : 'Boshqa';
    var imageUrl = req.body.image_url ? String(req.body.image_url).trim() : '';
    var shortDesc = req.body.short_desc ? String(req.body.short_desc).trim() : '';
    var whatIsIt = req.body.what_is_it ? String(req.body.what_is_it).trim() : '';
    var dimensions = req.body.dimensions ? String(req.body.dimensions).trim() : '';
    var history = req.body.history ? String(req.body.history).trim() : '';
    var usageArea = req.body.usage_area ? String(req.body.usage_area).trim() : '';
    var pros = req.body.pros ? String(req.body.pros).trim() : '';
    var cons = req.body.cons ? String(req.body.cons).trim() : '';
    var uzbSources = req.body.uzbekistan_sources ? String(req.body.uzbekistan_sources).trim() : '';
    var bimTips = req.body.bim_tips ? String(req.body.bim_tips).trim() : '';
    var orderIndex = req.body.order_index ? Number(req.body.order_index) : 0;

    if (!title) return res.status(400).json({ error: 'Material nomi kiritilishi shart' });

    var result = await pool.query(`
      INSERT INTO construction_materials
      (title, category, sub_category, image_url, short_desc, what_is_it, dimensions, history, usage_area, pros, cons, uzbekistan_sources, bim_tips, order_index)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [title, category, subCategory, imageUrl, shortDesc, whatIsIt, dimensions, history, usageArea, pros, cons, uzbSources, bimTips, orderIndex]);

    return res.json({ ok: true, material: result.rows[0] });
  } catch (error) {
    console.error('ADD MATERIAL ERROR:', error);
    return res.status(500).json({ error: 'Material qo‘shishda xatolik: ' + error.message });
  }
});

app.post('/api/admin/materials/:id/update', requireAdmin, async function (req, res) {
  try {
    var id = Number(req.params.id);
    var title = req.body.title ? String(req.body.title).trim() : '';
    var category = req.body.category ? String(req.body.category).trim() : 'Devor';
    var subCategory = req.body.sub_category ? String(req.body.sub_category).trim() : 'Boshqa';
    var imageUrl = req.body.image_url ? String(req.body.image_url).trim() : '';
    var shortDesc = req.body.short_desc ? String(req.body.short_desc).trim() : '';
    var whatIsIt = req.body.what_is_it ? String(req.body.what_is_it).trim() : '';
    var dimensions = req.body.dimensions ? String(req.body.dimensions).trim() : '';
    var history = req.body.history ? String(req.body.history).trim() : '';
    var usageArea = req.body.usage_area ? String(req.body.usage_area).trim() : '';
    var pros = req.body.pros ? String(req.body.pros).trim() : '';
    var cons = req.body.cons ? String(req.body.cons).trim() : '';
    var uzbSources = req.body.uzbekistan_sources ? String(req.body.uzbekistan_sources).trim() : '';
    var bimTips = req.body.bim_tips ? String(req.body.bim_tips).trim() : '';
    var orderIndex = req.body.order_index ? Number(req.body.order_index) : 0;

    if (!title) return res.status(400).json({ error: 'Material nomi kiritilishi shart' });

    var result = await pool.query(`
      UPDATE construction_materials
      SET title = $1, category = $2, sub_category = $3, image_url = $4, short_desc = $5,
          what_is_it = $6, dimensions = $7, history = $8, usage_area = $9, pros = $10,
          cons = $11, uzbekistan_sources = $12, bim_tips = $13, order_index = $14
      WHERE id = $15
      RETURNING *
    `, [title, category, subCategory, imageUrl, shortDesc, whatIsIt, dimensions, history, usageArea, pros, cons, uzbSources, bimTips, orderIndex, id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Material topilmadi' });
    return res.json({ ok: true, material: result.rows[0] });
  } catch (error) {
    console.error('UPDATE MATERIAL ERROR:', error);
    return res.status(500).json({ error: 'Materialni yangilashda xatolik: ' + error.message });
  }
});

app.post('/api/admin/materials/:id/delete', requireAdmin, async function (req, res) {
  try {
    var id = Number(req.params.id);
    await pool.query('DELETE FROM construction_materials WHERE id = $1', [id]);
    return res.json({ ok: true, message: 'Material o‘chirildi' });
  } catch (error) {
    console.error('DELETE MATERIAL ERROR:', error);
    return res.status(500).json({ error: 'Materialni o‘chirishda xatolik' });
  }
});

// ======================================================
// ADMIN ALL LESSON FILES / LIBRARY MANAGEMENT (Talab 4)
// ======================================================

app.post('/api/admin/library/all-files', requireAdmin, async function (req, res) {
  try {
    var result = await pool.query(`
      SELECT lf.id, lf.lesson_id, lf.file_name, lf.file_url, lf.created_at,
             l.title AS lesson_title, l.module_id, m.title AS module_title,
             c.id AS course_id, c.title AS course_title
      FROM lesson_files lf
      JOIN lessons l ON l.id = lf.lesson_id
      JOIN modules m ON m.id = l.module_id
      LEFT JOIN courses c ON c.id = m.course_id
      ORDER BY lf.id DESC
    `);
    return res.json({ ok: true, files: result.rows });
  } catch (error) {
    console.error('GET ALL FILES ERROR:', error);
    return res.status(500).json({ error: 'Dars materiallarini olishda xatolik' });
  }
});


// ======================================================
// KUTUBXONA V2: STUDENT & PUBLIC API
// ======================================================

// Kutubxona bo'limlari (Kitoblar, Manbalar, Testlar, Materiallar va yangi dinamik bo'limlar)
app.all(['/api/library/v2/sections'], async function (req, res) {
  try {
    var result = await pool.query(`
      SELECT * FROM library_sections
      WHERE is_active = true AND is_visible = true
      ORDER BY order_index ASC, id ASC
    `);
    return res.json({ ok: true, sections: result.rows });
  } catch (err) {
    console.error('LIBRARY SECTIONS ERROR:', err.message);
    return res.status(500).json({ error: 'Bo\'limlarni yuklashda xatolik' });
  }
});

// Tavsiya etilgan resurslar
app.post('/api/library/v2/recommended', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Autentifikatsiya xatosi' });

    var section = req.body.section || req.body.section_slug || null;
    var conds = ["status = 'published'", "is_featured = true"];
    var params = [];
    if (section && section !== 'all') {
      conds.push('section_slug = $1');
      params.push(section);
    }
    var result = await pool.query(
      'SELECT * FROM library_resources WHERE ' + conds.join(' AND ') + ' ORDER BY order_index ASC, id DESC LIMIT 10',
      params
    );
    return res.json({ ok: true, resources: result.rows });
  } catch (err) {
    console.error('LIBRARY RECOMMENDED ERROR:', err.message);
    return res.status(500).json({ error: 'Tavsiyalarni yuklashda xatolik' });
  }
});

// Kurslar ro'yxati (Test filter dropdown uchun)
app.all(['/api/library/v2/courses'], async function (req, res) {
  try {
    var result = await pool.query("SELECT id, title FROM courses WHERE (status != 'hidden' AND status != 'archived') OR status IS NULL ORDER BY order_index ASC, id ASC");
    return res.json({ ok: true, courses: result.rows });
  } catch (err) {
    console.error('LIBRARY COURSES ERROR:', err.message);
    return res.json({ ok: true, courses: [] });
  }
});

// Qo'llab-quvvatlash (Support / Donation) ma'lumotlari
app.all(['/api/support/info'], async function (req, res) {
  try {
    var result = await pool.query("SELECT key, value FROM academy_settings WHERE key LIKE 'support_%' OR key LIKE 'donate_%'");
    var settings = {};
    for (var r of result.rows) {
      settings[r.key] = r.value;
    }
    return res.json({
      ok: true,
      support: {
        title: settings.support_title || 'Qo‘llab-quvvatlash',
        subtitle: settings.support_subtitle || 'Platforma rivojiga o‘z xohishingiz bilan hissa qo‘shishingiz mumkin.',
        description: settings.support_description || 'Platforma rivojiga o‘z xohishingiz bilan hissa qo‘shishingiz mumkin.',
        card_number: settings.donate_card_number || settings.support_card_number || '8600 5304 1234 5678',
        card_holder: settings.donate_card_holder || settings.support_card_holder || 'Abdulloh S.',
        first_name: settings.support_first_name || '',
        last_name: settings.support_last_name || '',
        payment_type: settings.donate_payment_type || settings.support_payment_type || 'UZCARD / HUMO',
        telegram_contact: settings.support_telegram_contact || '@texnikuzb'
      }
    });
  } catch (err) {
    console.error('SUPPORT INFO ERROR:', err.message);
    return res.status(500).json({ error: 'Qo\'llab-quvvatlash ma\'lumotlarini olishda xatolik' });
  }
});

// Kutubxona resurslari (bo'lim, filter, search, course_id, pagination)
app.post('/api/library/v2/resources', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Autentifikatsiya xatosi' });

    var section = req.body.section || req.body.section_slug || null;
    var type = req.body.type || null;
    var category = req.body.category || null;
    var search = req.body.search || '';
    var courseId = req.body.course_id ? parseInt(req.body.course_id) : null;
    var page = parseInt(req.body.page) || 1;
    var limit = Math.min(parseInt(req.body.limit) || 24, 60);
    var offset = (page - 1) * limit;
    var sort = req.body.sort || 'newest';

    var conditions = ["status = 'published'"];
    var params = [];
    var paramIdx = 1;

    if (section && section !== 'all') {
      conditions.push('section_slug = $' + paramIdx);
      params.push(section);
      paramIdx++;
    }
    if (type) {
      conditions.push('type = $' + paramIdx);
      params.push(type);
      paramIdx++;
    }
    if (category && category !== 'Barchasi') {
      conditions.push('category = $' + paramIdx);
      params.push(category);
      paramIdx++;
    }
    if (courseId) {
      conditions.push('course_id = $' + paramIdx);
      params.push(courseId);
      paramIdx++;
    }
    if (search.trim()) {
      var sTerm = '%' + search.trim().toLowerCase() + '%';
      conditions.push('(LOWER(title) LIKE $' + paramIdx + ' OR LOWER(COALESCE(description, \'\')) LIKE $' + paramIdx + ' OR LOWER(COALESCE(category, \'\')) LIKE $' + paramIdx + ' OR LOWER(COALESCE(author, \'\')) LIKE $' + paramIdx + ' OR LOWER(COALESCE(content_data::text, \'\')) LIKE $' + paramIdx + ')');
      params.push(sTerm);
      paramIdx++;
    }

    var whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    var orderClause = sort === 'popular' ? 'ORDER BY view_count DESC, order_index ASC' :
                      sort === 'alphabetical' ? 'ORDER BY title ASC' :
                      'ORDER BY is_featured DESC, order_index ASC, id DESC';

    var countResult = await pool.query('SELECT COUNT(*)::int AS total FROM library_resources ' + whereClause, params);
    var total = countResult.rows[0].total;

    params.push(limit);
    params.push(offset);
    var dataResult = await pool.query(
      'SELECT library_resources.*, (SELECT title FROM courses WHERE id = library_resources.course_id) AS course_title FROM library_resources ' + whereClause + ' ' + orderClause + ' LIMIT $' + paramIdx + ' OFFSET $' + (paramIdx + 1),
      params
    );

    // Kategoriya hisoblagichlari (shu bo'lim bo'yicha)
    var catWhere = "WHERE status = 'published'";
    var catParams = [];
    if (section && section !== 'all') {
      catWhere += ' AND section_slug = $1';
      catParams.push(section);
    }
    var catResult = await pool.query(
      'SELECT category, COUNT(*)::int AS count FROM library_resources ' + catWhere + ' GROUP BY category ORDER BY count DESC',
      catParams
    );

    return res.json({
      ok: true,
      resources: dataResult.rows,
      total: total,
      page: page,
      totalPages: Math.ceil(total / limit),
      categories: catResult.rows
    });
  } catch (error) {
    console.error('LIBRARY V2 RESOURCES ERROR:', error);
    return res.status(500).json({ error: 'Kutubxona resurslarini yuklashda xatolik' });
  }
});

// Yagona resurs detail
app.post('/api/library/v2/resource/:id', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Autentifikatsiya xatosi' });

    var resourceId = parseInt(req.params.id);
    var result = await pool.query('SELECT * FROM library_resources WHERE id = $1', [resourceId]);
    var isFromBooksTable = false;
    if (!result.rows.length) {
      // library_books jadvalidan izlash
      var bookRes = await pool.query('SELECT * FROM library_books WHERE id = $1', [resourceId]);
      if (bookRes.rows.length) {
        var bRow = bookRes.rows[0];
        isFromBooksTable = true;
        result = {
          rows: [{
            id: bRow.id,
            type: 'book',
            section_slug: 'books',
            title: bRow.title,
            subtitle: bRow.author ? ('Muallif: ' + bRow.author) : '',
            description: bRow.short_description,
            category: (bRow.categories && bRow.categories[0]) || 'Arxitektura',
            tags: bRow.categories || [],
            content_url: bRow.pdf_url,
            content_type: 'pdf',
            content_data: {
              what_you_learn: bRow.what_you_learn,
              reading_time_minutes: bRow.reading_time_minutes,
              access_type: bRow.access_type
            },
            preview_image_url: bRow.cover_url || bRow.generated_cover_url,
            author: bRow.author,
            page_count: bRow.page_count,
            status: bRow.status,
            view_count: bRow.view_count || 0
          }]
        };
      } else {
        return res.status(404).json({ error: 'Resurs topilmadi' });
      }
    }

    // Bookmark holati
    var bmResult = await pool.query('SELECT id FROM library_bookmarks WHERE user_id = $1 AND resource_id = $2', [user.id, resourceId]);
    var isBookmarked = bmResult.rows.length > 0;

    // Ko'rish qayd qilish
    try {
      await pool.query('INSERT INTO library_views (user_id, resource_id) VALUES ($1, $2)', [user.id, resourceId]);
      if (isFromBooksTable) {
        await pool.query('UPDATE library_books SET view_count = view_count + 1 WHERE id = $1', [resourceId]);
      } else {
        await pool.query('UPDATE library_resources SET view_count = view_count + 1 WHERE id = $1', [resourceId]);
      }
    } catch (vErr) {}

    // O'xshash resurslar (same category, limit 4)
    var relatedResult = await pool.query(
      "SELECT id, type, title, category, preview_image_url, view_count FROM library_resources WHERE category = $1 AND id != $2 AND status = 'published' ORDER BY view_count DESC LIMIT 4",
      [result.rows[0].category, resourceId]
    );

    return res.json({
      ok: true,
      resource: result.rows[0],
      is_bookmarked: isBookmarked,
      related: relatedResult.rows
    });
  } catch (error) {
    console.error('LIBRARY V2 RESOURCE DETAIL ERROR:', error);
    return res.status(500).json({ error: 'Resurs ma\'lumotlarini olishda xatolik' });
  }
});

// Bookmark toggle
app.post('/api/library/v2/bookmark/toggle', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Autentifikatsiya xatosi' });

    var resourceId = parseInt(req.body.resource_id);
    if (!resourceId) return res.status(400).json({ error: 'resource_id majburiy' });

    var existing = await pool.query('SELECT id FROM library_bookmarks WHERE user_id = $1 AND resource_id = $2', [user.id, resourceId]);

    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM library_bookmarks WHERE user_id = $1 AND resource_id = $2', [user.id, resourceId]);
      return res.json({ ok: true, bookmarked: false, message: 'Sevimlilardan olib tashlandi' });
    } else {
      await pool.query('INSERT INTO library_bookmarks (user_id, resource_id) VALUES ($1, $2)', [user.id, resourceId]);
      return res.json({ ok: true, bookmarked: true, message: 'Sevimlilarga saqlandi' });
    }
  } catch (error) {
    console.error('LIBRARY V2 BOOKMARK ERROR:', error);
    return res.status(500).json({ error: 'Bookmark xatosi' });
  }
});

// Bookmarklar ro'yxati
app.post('/api/library/v2/bookmarks', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Autentifikatsiya xatosi' });

    var result = await pool.query(`
      SELECT lr.* FROM library_resources lr
      JOIN library_bookmarks lb ON lb.resource_id = lr.id
      WHERE lb.user_id = $1 AND lr.status = 'published'
      ORDER BY lb.created_at DESC
    `, [user.id]);

    return res.json({ ok: true, resources: result.rows });
  } catch (error) {
    console.error('LIBRARY V2 BOOKMARKS ERROR:', error);
    return res.status(500).json({ error: 'Sevimlilarni yuklashda xatolik' });
  }
});

// Yaqinda ko'rilganlar
app.post('/api/library/v2/recent', async function (req, res) {
  try {
    var user = await getOrCreateUser(req.body.initData);
    if (!user) return res.status(401).json({ error: 'Autentifikatsiya xatosi' });

    var result = await pool.query(`
      SELECT DISTINCT ON (lr.id) lr.*, lv.viewed_at
      FROM library_resources lr
      JOIN library_views lv ON lv.resource_id = lr.id
      WHERE lv.user_id = $1 AND lr.status = 'published'
      ORDER BY lr.id, lv.viewed_at DESC
    `, [user.id]);

    // Sort by most recent view
    var sorted = result.rows.sort(function(a, b) {
      return new Date(b.viewed_at) - new Date(a.viewed_at);
    }).slice(0, 10);

    return res.json({ ok: true, resources: sorted });
  } catch (error) {
    console.error('LIBRARY V2 RECENT ERROR:', error);
    return res.status(500).json({ error: 'Yaqinda ko\'rilganlarni yuklashda xatolik' });
  }
});

// Kategoriyalar ro'yxati
app.post('/api/library/v2/categories', async function (req, res) {
  try {
    var result = await pool.query('SELECT * FROM library_categories WHERE is_active = true ORDER BY order_index ASC');
    return res.json({ ok: true, categories: result.rows });
  } catch (error) {
    console.error('LIBRARY V2 CATEGORIES ERROR:', error);
    return res.status(500).json({ error: 'Kategoriyalarni yuklashda xatolik' });
  }
});

// ======================================================
// KUTUBXONA V2: ADMIN API
// ======================================================

// Admin: Bo'limlar ro'yxati (Sections)
app.post('/api/admin/library/sections', requireAdmin, async function (req, res) {
  try {
    var result = await pool.query('SELECT * FROM library_sections ORDER BY order_index ASC, id ASC');
    return res.json({ ok: true, sections: result.rows });
  } catch (error) {
    console.error('ADMIN LIBRARY SECTIONS ERROR:', error);
    return res.status(500).json({ error: 'Bo\'limlarni yuklashda xatolik' });
  }
});

// Admin: Yangi bo'lim qo'shish (Sections Add)
app.post('/api/admin/library/section/add', requireAdmin, async function (req, res) {
  try {
    var b = req.body;
    var name = (b.name || '').trim();
    var slug = (b.slug || name.toLowerCase().replace(/[^a-z0-9]/g, '_')).trim();
    var subtitle = (b.subtitle || '').trim();
    var icon = (b.icon || '📁').trim();
    var description = (b.description || '').trim();

    if (!name || !slug) return res.status(400).json({ error: 'Bo\'lim nomi va slugi majburiy' });

    var maxOrder = await pool.query('SELECT COALESCE(MAX(order_index), 0) + 1 AS next FROM library_sections');
    var result = await pool.query(`
      INSERT INTO library_sections (slug, name, subtitle, icon, description, order_index, is_active, is_visible)
      VALUES ($1, $2, $3, $4, $5, $6, true, true)
      RETURNING *
    `, [slug, name, subtitle, icon, description, maxOrder.rows[0].next]);

    // Also add "Barchasi" category for this new section
    try {
      await pool.query('INSERT INTO library_categories (section_slug, name, icon, order_index) VALUES ($1, $2, $3, 0)', [slug, 'Barchasi', '🌐']);
    } catch(e) {}

    return res.json({ ok: true, section: result.rows[0], message: 'Yangi bo\'lim qo\'shildi' });
  } catch (error) {
    if (error.code === '23505') return res.status(400).json({ error: 'Bunday identifikatorli (slug) bo\'lim allaqachon mavjud' });
    console.error('ADMIN LIBRARY SECTION ADD ERROR:', error);
    return res.status(500).json({ error: 'Bo\'lim qo\'shishda xatolik: ' + error.message });
  }
});

// Admin: Bo'limni tahrirlash (Section Update)
app.post('/api/admin/library/section/:id/update', requireAdmin, async function (req, res) {
  try {
    var sectionId = parseInt(req.params.id);
    var b = req.body;

    var result = await pool.query(`
      UPDATE library_sections SET
        name = COALESCE($1, name),
        subtitle = COALESCE($2, subtitle),
        icon = COALESCE($3, icon),
        description = COALESCE($4, description),
        order_index = COALESCE($5, order_index),
        is_active = COALESCE($6, is_active),
        is_visible = COALESCE($7, is_visible)
      WHERE id = $8
      RETURNING *
    `, [b.name, b.subtitle, b.icon, b.description, b.order_index, b.is_active, b.is_visible, sectionId]);

    if (!result.rows.length) return res.status(404).json({ error: 'Bo\'lim topilmadi' });
    return res.json({ ok: true, section: result.rows[0], message: 'Bo\'lim muvaffaqiyatli yangilandi' });
  } catch (error) {
    console.error('ADMIN LIBRARY SECTION UPDATE ERROR:', error);
    return res.status(500).json({ error: 'Bo\'limni yangilashda xatolik' });
  }
});

// Admin: Bo'limni o'chirish / arxivlash
app.post('/api/admin/library/section/:id/delete', requireAdmin, async function (req, res) {
  try {
    var sectionId = parseInt(req.params.id);
    var secRes = await pool.query('SELECT slug FROM library_sections WHERE id = $1', [sectionId]);
    if (!secRes.rows.length) return res.status(404).json({ error: 'Bo\'lim topilmadi' });

    var slug = secRes.rows[0].slug;
    if (['books', 'sources', 'tests', 'materials'].includes(slug)) {
      // 4 ta asosiy tizimli bo'limni o'chirib yubormaslik, faqat yashirish
      await pool.query('UPDATE library_sections SET is_visible = false WHERE id = $1', [sectionId]);
      return res.json({ ok: true, message: 'Asosiy bo\'lim yashirildi (arxivlandi)' });
    }

    await pool.query('DELETE FROM library_categories WHERE section_slug = $1', [slug]);
    await pool.query('DELETE FROM library_sections WHERE id = $1', [sectionId]);
    return res.json({ ok: true, message: 'Bo\'lim muvaffaqiyatli o\'chirildi' });
  } catch (error) {
    console.error('ADMIN LIBRARY SECTION DELETE ERROR:', error);
    return res.status(500).json({ error: 'Bo\'limni o\'chirishda xatolik' });
  }
});

// Admin: Bo'limlar tartibini o'zgartirish (Reorder)
app.post('/api/admin/library/sections/reorder', requireAdmin, async function (req, res) {
  try {
    var ids = req.body.ids || [];
    for (var i = 0; i < ids.length; i++) {
      await pool.query('UPDATE library_sections SET order_index = $1 WHERE id = $2', [i + 1, parseInt(ids[i])]);
    }
    return res.json({ ok: true, message: 'Bo\'limlar tartibi saqlandi' });
  } catch (error) {
    console.error('ADMIN LIBRARY SECTIONS REORDER ERROR:', error);
    return res.status(500).json({ error: 'Tartibni saqlashda xatolik' });
  }
});

// Admin: barcha resurslar (ixtiyoriy bo'lim filtri bilan)
app.post('/api/admin/library-v2/resources', requireAdmin, async function (req, res) {
  try {
    var section = req.body.section || req.body.section_slug || null;
    var query = 'SELECT * FROM library_resources';
    var params = [];
    if (section && section !== 'all') {
      query += ' WHERE section_slug = $1';
      params.push(section);
    }
    query += ' ORDER BY order_index ASC, id DESC';
    var result = await pool.query(query, params);
    return res.json({ ok: true, resources: result.rows });
  } catch (error) {
    console.error('ADMIN LIBRARY V2 LIST ERROR:', error);
    return res.status(500).json({ error: 'Resurslar ro\'yxatini yuklashda xatolik' });
  }
});

// Admin: resurs qo'shish (Kitob, Manba, Test, Material)
app.post('/api/admin/library-v2/resource/add', requireAdmin, async function (req, res) {
  try {
    var b = req.body;
    if (!b.title || !b.type) return res.status(400).json({ error: 'Nomi va turi majburiy' });

    var section_slug = b.section_slug || (b.type === 'book' ? 'books' : b.type === 'test' ? 'tests' : b.type === 'material' ? 'materials' : 'sources');

    var result = await pool.query(`
      INSERT INTO library_resources (
        type, section_slug, title, subtitle, description, category, sub_category, tags,
        content_url, content_type, content_data, preview_image_url, storage_provider, storage_id,
        author, file_size, page_count, language, version, versions, course_id, source_label,
        difficulty, time_limit_min, status, order_index, is_featured
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,
        $9,$10,$11,$12,$13,$14,
        $15,$16,$17,$18,$19,$20,$21,$22,
        $23,$24,$25,$26,$27
      )
      RETURNING *
    `, [
      b.type, section_slug, b.title, b.subtitle || null, b.description || null,
      b.category || 'Boshqa', b.sub_category || null, b.tags || '{}',
      b.content_url || null, b.content_type || null,
      b.content_data ? (typeof b.content_data === 'string' ? b.content_data : JSON.stringify(b.content_data)) : null,
      b.preview_image_url ? formatDirectImageUrl(b.preview_image_url) : null,
      b.storage_provider || 'url', b.storage_id || null,
      b.author || null, b.file_size || null, b.page_count || null,
      b.language || 'uz', b.version || null,
      b.versions ? (typeof b.versions === 'string' ? b.versions : JSON.stringify(b.versions)) : '[]',
      b.course_id || null, b.source_label || null,
      b.difficulty || 'medium', b.time_limit_min || 15,
      b.status || 'published', b.order_index || 0, b.is_featured || false
    ]);

    return res.json({ ok: true, resource: result.rows[0], message: 'Resurs muvaffaqiyatli qo\'shildi' });
  } catch (error) {
    console.error('ADMIN LIBRARY V2 ADD ERROR:', error);
    return res.status(500).json({ error: 'Resurs qo\'shishda xatolik: ' + error.message });
  }
});

// Admin: resurs tahrirlash
app.post('/api/admin/library-v2/resource/:id/update', requireAdmin, async function (req, res) {
  try {
    var resourceId = parseInt(req.params.id);
    var b = req.body;

    var result = await pool.query(`
      UPDATE library_resources SET
        type = COALESCE($1, type),
        section_slug = COALESCE($2, section_slug),
        title = COALESCE($3, title),
        subtitle = $4,
        description = $5,
        category = COALESCE($6, category),
        sub_category = $7,
        tags = COALESCE($8, tags),
        content_url = $9,
        content_type = $10,
        content_data = $11,
        preview_image_url = $12,
        author = $13,
        file_size = $14,
        page_count = $15,
        language = COALESCE($16, language),
        version = $17,
        versions = $18,
        course_id = $19,
        source_label = $20,
        difficulty = COALESCE($21, difficulty),
        time_limit_min = COALESCE($22, time_limit_min),
        status = COALESCE($23, status),
        order_index = COALESCE($24, order_index),
        is_featured = COALESCE($25, is_featured),
        updated_at = NOW()
      WHERE id = $26
      RETURNING *
    `, [
      b.type, b.section_slug, b.title, b.subtitle || null, b.description || null,
      b.category, b.sub_category || null, b.tags || '{}',
      b.content_url || null, b.content_type || null,
      b.content_data ? (typeof b.content_data === 'string' ? b.content_data : JSON.stringify(b.content_data)) : null,
      b.preview_image_url ? formatDirectImageUrl(b.preview_image_url) : null,
      b.author || null, b.file_size || null, b.page_count || null,
      b.language, b.version || null,
      b.versions ? (typeof b.versions === 'string' ? b.versions : JSON.stringify(b.versions)) : '[]',
      b.course_id || null, b.source_label || null,
      b.difficulty, b.time_limit_min,
      b.status, b.order_index, b.is_featured,
      resourceId
    ]);

    if (!result.rows.length) return res.status(404).json({ error: 'Resurs topilmadi' });
    return res.json({ ok: true, resource: result.rows[0], message: 'Resurs yangilandi' });
  } catch (error) {
    console.error('ADMIN LIBRARY V2 UPDATE ERROR:', error);
    return res.status(500).json({ error: 'Resursni yangilashda xatolik: ' + error.message });
  }
});

// Admin: tavsiya holatini o'zgartirish (Toggle Recommend)
app.post('/api/admin/library-v2/resource/:id/toggle-recommend', requireAdmin, async function (req, res) {
  try {
    var resourceId = parseInt(req.params.id);
    var cur = await pool.query('SELECT is_featured FROM library_resources WHERE id = $1', [resourceId]);
    if (!cur.rows.length) return res.status(404).json({ error: 'Resurs topilmadi' });

    var nextFeatured = !cur.rows[0].is_featured;
    await pool.query('UPDATE library_resources SET is_featured = $1, updated_at = NOW() WHERE id = $2', [nextFeatured, resourceId]);
    return res.json({ ok: true, is_featured: nextFeatured, message: nextFeatured ? 'Tavsiya etilganlarga qo\'shildi' : 'Tavsiyalardan olindi' });
  } catch (error) {
    console.error('ADMIN LIBRARY V2 TOGGLE RECOMMEND ERROR:', error);
    return res.status(500).json({ error: 'Tavsiya holatini o\'zgartirishda xatolik' });
  }
});

// Admin: resurs o'chirish
app.post('/api/admin/library-v2/resource/:id/delete', requireAdmin, async function (req, res) {
  try {
    var resourceId = parseInt(req.params.id);
    await pool.query('DELETE FROM library_bookmarks WHERE resource_id = $1', [resourceId]);
    await pool.query('DELETE FROM library_views WHERE resource_id = $1', [resourceId]);
    var result = await pool.query('DELETE FROM library_resources WHERE id = $1 RETURNING id', [resourceId]);
    if (!result.rows.length) return res.status(404).json({ error: 'Resurs topilmadi' });
    return res.json({ ok: true, message: 'Resurs o\'chirildi' });
  } catch (error) {
    console.error('ADMIN LIBRARY V2 DELETE ERROR:', error);
    return res.status(500).json({ error: 'Resursni o\'chirishda xatolik' });
  }
});

// Admin: resurs status o'zgartirish
app.post('/api/admin/library-v2/resource/:id/status', requireAdmin, async function (req, res) {
  try {
    var resourceId = parseInt(req.params.id);
    var status = req.body.status || 'published';
    var result = await pool.query('UPDATE library_resources SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [status, resourceId]);
    if (!result.rows.length) return res.status(404).json({ error: 'Resurs topilmadi' });
    return res.json({ ok: true, resource: result.rows[0], message: 'Status yangilandi: ' + status });
  } catch (error) {
    console.error('ADMIN LIBRARY V2 STATUS ERROR:', error);
    return res.status(500).json({ error: 'Status o\'zgartirishda xatolik' });
  }
});

// Admin: kategoriyalar (bo'lim bo'yicha)
app.post('/api/admin/library-v2/categories', requireAdmin, async function (req, res) {
  try {
    var section = req.body.section || req.body.section_slug || null;
    var query = 'SELECT * FROM library_categories';
    var params = [];
    if (section && section !== 'all') {
      query += ' WHERE section_slug = $1';
      params.push(section);
    }
    query += ' ORDER BY order_index ASC, id ASC';
    var result = await pool.query(query, params);
    return res.json({ ok: true, categories: result.rows });
  } catch (error) {
    console.error('ADMIN LIBRARY V2 CATEGORIES ERROR:', error);
    return res.status(500).json({ error: 'Kategoriyalarni yuklashda xatolik' });
  }
});

app.post('/api/admin/library-v2/category/add', requireAdmin, async function (req, res) {
  try {
    var name = (req.body.name || '').trim();
    var icon = (req.body.icon || '📁').trim();
    var section_slug = (req.body.section_slug || req.body.section || 'books').trim();
    if (!name) return res.status(400).json({ error: 'Kategoriya nomi majburiy' });

    var maxOrder = await pool.query('SELECT COALESCE(MAX(order_index), 0) + 1 AS next FROM library_categories WHERE section_slug = $1', [section_slug]);
    var result = await pool.query(
      'INSERT INTO library_categories (name, icon, section_slug, order_index) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, icon, section_slug, maxOrder.rows[0].next]
    );
    return res.json({ ok: true, category: result.rows[0], message: 'Kategoriya qo\'shildi' });
  } catch (error) {
    if (error.code === '23505') return res.status(400).json({ error: 'Ushbu bo\'limda bunday kategoriya mavjud' });
    console.error('ADMIN LIBRARY V2 CAT ADD ERROR:', error);
    return res.status(500).json({ error: 'Kategoriya qo\'shishda xatolik' });
  }
});

app.post('/api/admin/library-v2/category/:id/delete', requireAdmin, async function (req, res) {
  try {
    var catId = parseInt(req.params.id);
    await pool.query('DELETE FROM library_categories WHERE id = $1', [catId]);
    return res.json({ ok: true, message: 'Kategoriya o\'chirildi' });
  } catch (error) {
    console.error('ADMIN LIBRARY V2 CAT DELETE ERROR:', error);
    return res.status(500).json({ error: 'Kategoriya o\'chirishda xatolik' });
  }
});

// Admin: Qo'llab-quvvatlash sozlamalarini yangilash (Support / Donation update)
app.post('/api/admin/support/update', requireAdmin, async function (req, res) {
  try {
    var b = req.body;
    var firstName = (b.first_name || b.support_first_name || '').trim();
    var lastName = (b.last_name || b.support_last_name || '').trim();
    var holder = (b.card_holder || b.support_card_holder || [firstName, lastName].filter(Boolean).join(' ') || 'Abdulloh S.').trim();
    var cardNum = (b.card_number || b.donate_card_number || b.support_card_number || '8600 5304 1234 5678').trim();
    var paymentType = (b.payment_type || b.donate_payment_type || b.support_payment_type || 'UZCARD / HUMO').trim();
    var tgContact = (b.telegram_contact || b.support_telegram_contact || b.support_contact || '@texnikuzb').trim();
    if (tgContact && !tgContact.startsWith('@') && !tgContact.startsWith('http')) {
      tgContact = '@' + tgContact;
    }
    var title = (b.title || b.support_title || 'Qo‘llab-quvvatlash').trim();
    var desc = (b.description || b.subtitle || b.support_description || b.support_subtitle || 'Platforma rivojiga o‘z xohishingiz bilan hissa qo‘shishingiz mumkin.').trim();

    var keys = [
      ['support_title', title],
      ['support_subtitle', desc],
      ['support_description', desc],
      ['donate_card_number', cardNum],
      ['support_card_number', cardNum],
      ['support_first_name', firstName],
      ['support_last_name', lastName],
      ['donate_card_holder', holder],
      ['support_card_holder', holder],
      ['donate_payment_type', paymentType],
      ['support_payment_type', paymentType],
      ['support_telegram_contact', tgContact]
    ];

    for (var k of keys) {
      await pool.query(`
        INSERT INTO academy_settings (key, value) VALUES ($1, $2)
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
      `, [k[0], k[1]]);
    }

    return res.json({ ok: true, message: 'Qo\'llab-quvvatlash sozlamalari muvaffaqiyatli saqlandi' });
  } catch (error) {
    console.error('ADMIN SUPPORT UPDATE ERROR:', error);
    return res.status(500).json({ error: 'Sozlamalarni saqlashda xatolik' });
  }
});

// ======================================================
// ADMIN BOOKS & LIBRARY INSPECT API
// ======================================================

function formatReadingTime(minutes) {
  if (!minutes || minutes <= 0) return '30 daqiqa';
  var h = Math.floor(minutes / 60);
  var m = minutes % 60;
  if (h > 0 && m > 0) return '~' + h + ' soat ' + m + ' daqiqa';
  if (h > 0) return '~' + h + ' soat';
  return '~' + m + ' daqiqa';
}

app.post('/api/admin/library/inspect-pdf', requireAdmin, async function (req, res) {
  try {
    var pdfUrl = (req.body.pdf_url || req.body.url || '').trim();
    var coverUrl = (req.body.cover_url || '').trim();
    if (!pdfUrl) {
      return res.status(400).json({ error: 'PDF havolasi kiritilmadi' });
    }

    var driveId = null;
    var m = pdfUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (m && m[1]) driveId = m[1];
    if (!driveId) {
      m = pdfUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (m && m[1]) driveId = m[1];
    }
    if (!driveId) {
      m = pdfUrl.match(/drive\.google\.com\/thumbnail\?id=([a-zA-Z0-9_-]+)/);
      if (m && m[1]) driveId = m[1];
    }

    var generatedCover = coverUrl;
    if (!generatedCover && driveId) {
      generatedCover = 'https://drive.google.com/thumbnail?id=' + driveId + '&sz=w800';
    }

    var pageCount = parseInt(req.body.page_count) || 0;
    var readingMinutes = pageCount > 0 ? pageCount * 2 : 30;
    var readingTimeFormatted = formatReadingTime(readingMinutes);

    return res.json({
      ok: true,
      drive_id: driveId,
      page_count: pageCount,
      reading_time_minutes: readingMinutes,
      reading_time_formatted: readingTimeFormatted,
      generated_cover_url: generatedCover
    });
  } catch (err) {
    console.error('INSPECT PDF ERROR:', err);
    return res.status(500).json({ error: 'PDF tekshirishda xatolik: ' + err.message });
  }
});

// ======================================================
// GOOGLE DRIVE SCANNER & AI METADATA HELPER FUNCTIONS
// ======================================================

function extractGoogleDriveFolderId(raw) {
  if (!raw || typeof raw !== 'string') return null;
  var str = raw.trim();
  if (/^[a-zA-Z0-9_-]{20,}$/.test(str) && !str.includes('/') && !str.includes('.')) {
    return str;
  }
  var m = str.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (m && m[1]) return m[1];
  m = str.match(/id=([a-zA-Z0-9_-]+)/);
  if (m && m[1]) return m[1];
  return null;
}

async function scanGoogleDriveFolder(folderId, apiKey, sourceName) {
  var results = [];
  var visited = new Set();

  async function traverse(fId, currentCategory, depth) {
    if (depth > 4 || visited.has(fId)) return;
    visited.add(fId);

    // 1. Agar API Key mavjud bo'lsa (Google Drive REST API v3)
    if (apiKey) {
      try {
        var query = encodeURIComponent(`'${fId}' in parents and trashed = false`);
        var apiUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,size,webViewLink,parents)&pageSize=1000&key=${encodeURIComponent(apiKey)}`;
        var res = await fetch(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (res.ok) {
          var data = await res.json();
          var files = data.files || [];
          for (var item of files) {
            if (item.mimeType === 'application/vnd.google-apps.folder') {
              var catName = item.name.trim();
              await traverse(item.id, catName, depth + 1);
            } else if (item.mimeType === 'application/pdf' || (item.name && item.name.toLowerCase().endsWith('.pdf'))) {
              results.push({
                id: item.id,
                name: item.name,
                size: parseInt(item.size) || 0,
                mimeType: item.mimeType || 'application/pdf',
                webViewLink: item.webViewLink || `https://drive.google.com/file/d/${item.id}/view`,
                category: currentCategory || 'Boshqa'
              });
            }
          }
          return;
        }
      } catch (apiErr) {
        console.warn('Drive API v3 fetch warning:', apiErr.message);
      }
    }

    // 2. Web payload fallback (Ochiq papkalar uchun)
    try {
      var folderWebUrl = `https://drive.google.com/drive/folders/${fId}`;
      var webRes = await fetch(folderWebUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (webRes.ok) {
        var html = await webRes.text();
        var idNameRegex = /\["([a-zA-Z0-9_-]{25,})",\s*\["([^"]+\.pdf)"/gi;
        var match;
        while ((match = idNameRegex.exec(html)) !== null) {
          var fFileId = match[1];
          var fFileName = match[2];
          if (!results.some(r => r.id === fFileId)) {
            results.push({
              id: fFileId,
              name: fFileName,
              size: 0,
              mimeType: 'application/pdf',
              webViewLink: `https://drive.google.com/file/d/${fFileId}/view`,
              category: currentCategory || 'Boshqa'
            });
          }
        }
        var subfolderRegex = /\["([a-zA-Z0-9_-]{25,})",\s*\["([^"]+)",\s*"application\/vnd\.google-apps\.folder"/gi;
        while ((match = subfolderRegex.exec(html)) !== null) {
          var subId = match[1];
          var subName = match[2];
          await traverse(subId, subName, depth + 1);
        }
      }
    } catch (webErr) {
      console.warn('Drive web scraper fallback warning:', webErr.message);
    }
  }

  await traverse(folderId, sourceName || '', 0);
  return results;
}

async function generateBookAiMetadata(book) {
  var fileName = book.drive_file_name || book.title || '';
  var rawCategory = (Array.isArray(book.categories) ? book.categories[0] : book.category) || 'Arxitektura';
  var apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (apiKey && process.env.GEMINI_API_KEY) {
    try {
      var prompt = `Siz arxitektura, qurilish va Revit BIM sohasi bo'yicha professional kutubxonachisiz.
Ushbu kitob fayli haqidagi ma'lumotni tahlil qiling va o'zbek tilida toza JSON formatida metadata tayyorlang:
Fayl nomi: "${fileName}"
Dastlabki kategoriya: "${rawCategory}"

Qat'iy faqat quyidagi JSON formatida javob bering, ortiqcha belgisiz:
{
  "title": "Toza kitob nomi (.pdf va belgilar olinadi)",
  "author": "Muallif yoki tashkilot (aniq bo'lmasa 'Autodesk BIM & Architecture')",
  "short_description": "Kitob mazmuni haqida o'zbek tilida 2-3 ta ixcham, tushunarli va qiziqarli gap",
  "what_you_learn": [
    "Ushbu kitobdan o'rganiladigan 1-amaliy bilim",
    "Ushbu kitobdan o'rganiladigan 2-amaliy bilim",
    "Ushbu kitobdan o'rganiladigan 3-amaliy bilim",
    "Ushbu kitobdan o'rganiladigan 4-amaliy bilim"
  ],
  "category": "Quyidagilardan eng mos bittasi: Arxitektura, Interyer, Revit, BIM, Qurilish, Dizayn, Mebel, Yoritish, Normativ hujjatlar, Materiallar, Terminlar, Loyihalash, Boshqa",
  "tags": ["3-5 ta kichik harflarda teglar"],
  "language": "uz",
  "publication_year": "2023"
}`;

      var geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      var aiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });
      if (aiRes.ok) {
        var aiData = await aiRes.json();
        var txt = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (txt) {
          var parsed = JSON.parse(txt.trim());
          if (parsed && parsed.title) {
            return {
              title: parsed.title,
              author: parsed.author || 'Autodesk BIM & Architecture',
              short_description: parsed.short_description || '',
              what_you_learn: Array.isArray(parsed.what_you_learn) ? parsed.what_you_learn : [],
              category: parsed.category || rawCategory,
              tags: Array.isArray(parsed.tags) ? parsed.tags : [],
              language: parsed.language || 'uz',
              publication_year: parsed.publication_year ? String(parsed.publication_year) : null,
              ai_generated: true
            };
          }
        }
      }
    } catch (gErr) {
      console.warn('Gemini API call warning:', gErr.message);
    }
  }

  // 100% ishonchli offline heuristik algoritm
  var cleanTitle = fileName
    .replace(/\.pdf$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\([^\)]*\)/g, '')
    .replace(/^\d+[\s.-]+/, '')
    .trim();
  if (!cleanTitle) cleanTitle = 'Arxitektura va BIM Qo‘llanmasi';

  var lang = 'uz';
  if (/[а-яёА-ЯЁ]/.test(cleanTitle)) {
    lang = 'ru';
  } else if (/architect|design|building|guide|manual|revit|bim|interior|construction/i.test(cleanTitle)) {
    lang = 'en';
  }

  var detectedCat = rawCategory || 'Arxitektura';
  var lower = cleanTitle.toLowerCase();
  if (lower.includes('interyer') || lower.includes('interior')) detectedCat = 'Interyer';
  else if (lower.includes('revit')) detectedCat = 'Revit';
  else if (lower.includes('bim')) detectedCat = 'BIM';
  else if (lower.includes('qurilish') || lower.includes('stroy') || lower.includes('construction') || lower.includes('beton')) detectedCat = 'Qurilish';
  else if (lower.includes('mebel') || lower.includes('furniture')) detectedCat = 'Mebel';
  else if (lower.includes('yoritish') || lower.includes('lighting')) detectedCat = 'Yoritish';
  else if (lower.includes('shnq') || lower.includes('kmk') || lower.includes('standart') || lower.includes('snip') || lower.includes('gost')) detectedCat = 'Normativ hujjatlar';
  else if (lower.includes('loyiha') || lower.includes('design') || lower.includes('project')) detectedCat = 'Loyihalash';

  var shortDesc = `${cleanTitle} — ${detectedCat.toLowerCase()} sohasida nazariy va amaliy bilimlarni chuqurlashtirish uchun maxsus qo'llanma. Loyihalash jarayonida professional usullardan foydalanish va xalqaro standartlarni o'rganishga mo'ljallangan.`;
  var whatLearn = [
    `${detectedCat} sohasidagi zamonaviy tamoyillar va ilg'or metodikalar`,
    `Amaliy loyihalash jarayonida uchraydigan texnik vazifalar yechimi`,
    `Chizmalar va hujjatlarni standartlarga mos rasmiylashtirish tartibi`,
    `Ish unumdorligini oshiruvchi samarali usullar va tavsiyalar`
  ];

  return {
    title: cleanTitle,
    author: 'Autodesk BIM & Architecture',
    short_description: shortDesc,
    what_you_learn: whatLearn,
    category: detectedCat,
    tags: [detectedCat.toLowerCase(), 'arxitektura', 'kutubxona', lang],
    language: lang,
    publication_year: new Date().getFullYear().toString(),
    ai_generated: true
  };
}

// Admin: Kitoblar ro'yxati (kengaytirilgan filtrlar va statistika bilan)
app.post('/api/admin/books/list', requireAdmin, async function (req, res) {
  try {
    if (!libraryBooksTableReady) {
      await ensureLibraryBooksTable();
    }
    var search = (req.body.search || '').trim().toLowerCase();
    var filter = req.body.filter || 'all';
    var category = req.body.category || null;

    var conditions = [];
    var params = [];
    var pIdx = 1;

    if (search) {
      conditions.push('(LOWER(title) LIKE $' + pIdx + ' OR LOWER(COALESCE(author, \'\')) LIKE $' + pIdx + ' OR LOWER(COALESCE(short_description, \'\')) LIKE $' + pIdx + ' OR LOWER(COALESCE(drive_file_name, \'\')) LIKE $' + pIdx + ' OR array_to_string(categories, \' \') ILIKE $' + pIdx + ')');
      params.push('%' + search + '%');
      pIdx++;
    }

    if (filter === 'needs_review' || filter === 'pending') {
      conditions.push("(status IN ('NEEDS_REVIEW', 'needs_review', 'pending', 'draft'))");
    } else if (filter === 'published') {
      conditions.push("status = 'published'");
    } else if (filter === 'discovered') {
      conditions.push("status IN ('DISCOVERED', 'discovered')");
    } else if (filter === 'failed') {
      conditions.push("status IN ('FAILED', 'failed')");
    } else if (filter === 'archived') {
      conditions.push("status IN ('ARCHIVED', 'archived')");
    } else if (filter === 'free') {
      conditions.push("access_type = 'free'");
    } else if (filter === 'pro') {
      conditions.push("access_type = 'pro'");
    } else if (filter === 'recommended') {
      conditions.push("is_recommended = true");
    } else if (filter === 'uncategorized') {
      conditions.push("(categories IS NULL OR cardinality(categories) = 0)");
    }

    if (category && category !== 'Barchasi') {
      conditions.push('$' + pIdx + ' = ANY(categories)');
      params.push(category);
      pIdx++;
    }

    var where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    var q = 'SELECT * FROM library_books ' + where + ' ORDER BY is_recommended DESC, id DESC';
    var result = await pool.query(q, params);

    // Umumiy statistika hisoblash
    var statsResult = await pool.query(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(CASE WHEN status = 'published' THEN 1 END)::int AS published,
        COUNT(CASE WHEN status IN ('NEEDS_REVIEW', 'needs_review', 'pending', 'draft') THEN 1 END)::int AS needs_review,
        COUNT(CASE WHEN status IN ('DISCOVERED', 'discovered') THEN 1 END)::int AS discovered,
        COUNT(CASE WHEN status IN ('PROCESSING', 'processing') THEN 1 END)::int AS processing,
        COUNT(CASE WHEN status IN ('FAILED', 'failed') THEN 1 END)::int AS failed,
        COUNT(CASE WHEN status IN ('ARCHIVED', 'archived') THEN 1 END)::int AS archived
      FROM library_books
    `);

    // Drive manbalarini ham jo'natish
    var sourcesResult = await pool.query('SELECT * FROM drive_sources ORDER BY id ASC');

    return res.json({
      ok: true,
      books: result.rows,
      stats: statsResult.rows[0] || {},
      sources: sourcesResult.rows
    });
  } catch (err) {
    console.error('ADMIN BOOKS LIST ERROR:', err);
    return res.status(500).json({ error: 'Kitoblar ro\'yxatini yuklashda xatolik' });
  }
});

// Admin: Google Drive papkasini skanerlash va yangi kitoblarni import qilish (Incremental Sync)
app.post('/api/admin/books/sync-drive', requireAdmin, async function (req, res) {
  try {
    if (!libraryBooksTableReady) {
      await ensureLibraryBooksTable();
    }

    var folderIdInput = (req.body.folder_id || req.body.root_folder_id || '').trim();
    var sourceId = req.body.source_id ? parseInt(req.body.source_id) : null;
    var apiKey = (req.body.api_key || process.env.GOOGLE_DRIVE_API_KEY || '').trim();
    var sourceName = 'Google Drive';

    if (sourceId) {
      var sRes = await pool.query('SELECT * FROM drive_sources WHERE id = $1', [sourceId]);
      if (sRes.rows.length) {
        var src = sRes.rows[0];
        if (!folderIdInput) folderIdInput = src.root_folder_id;
        if (!apiKey) apiKey = src.api_key || '';
        sourceName = src.name;
      }
    }

    var targetFolderId = extractGoogleDriveFolderId(folderIdInput);
    if (!targetFolderId) {
      return res.status(400).json({ error: 'Google Drive papka ID si yoki havolasi kiritilmadi' });
    }

    console.log(`[DRIVE SYNC START] Folder: ${targetFolderId} (Source: ${sourceName})`);
    var scannedFiles = await scanGoogleDriveFolder(targetFolderId, apiKey, sourceName);
    console.log(`[DRIVE SYNC FILES FOUND] Total: ${scannedFiles.length}`);

    var stats = {
      found: scannedFiles.length,
      new: 0,
      existing: 0,
      failed: 0
    };

    for (var file of scannedFiles) {
      try {
        var existing = await pool.query(
          'SELECT id, title, drive_file_id FROM library_books WHERE drive_file_id = $1 OR pdf_url LIKE $2 LIMIT 1',
          [file.id, '%' + file.id + '%']
        );

        if (existing.rows.length) {
          stats.existing++;
          // Agar drive_file_id bo'lmasa biriktirib qo'yish
          if (!existing.rows[0].drive_file_id) {
            await pool.query(
              'UPDATE library_books SET drive_file_id = $1, drive_source_id = $2, drive_file_name = $3, drive_file_size = $4 WHERE id = $5',
              [file.id, sourceId, file.name, file.size, existing.rows[0].id]
            );
          }
        } else {
          // Yangi kitobni yaratish (DISCOVERED / NEEDS_REVIEW holatida)
          var cleanName = (file.name || 'Yangi Kitob')
            .replace(/\.pdf$/i, '')
            .replace(/[_-]+/g, ' ')
            .trim();
          var coverThumb = `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`;
          var viewUrl = `https://drive.google.com/file/d/${file.id}/view`;
          var category = file.category && file.category !== 'Boshqa' ? file.category : 'Arxitektura';

          await pool.query(`
            INSERT INTO library_books (
              title, author, short_description, what_you_learn, categories,
              pdf_url, cover_url, generated_cover_url, page_count, reading_time_minutes,
              access_type, is_recommended, status, drive_source_id, drive_file_id,
              drive_file_name, drive_web_view_url, drive_file_size, language,
              ai_generated, admin_approved, created_at
            ) VALUES (
              $1, 'Autodesk BIM & Architecture', $2, $3, $4,
              $5, $6, $6, 0, 30,
              'free', false, 'NEEDS_REVIEW', $7, $8,
              $9, $10, $11, 'uz',
              false, false, NOW()
            )
          `, [
            cleanName,
            cleanName + " bo'yicha batafsil qo'llanma va o'quv materiali.",
            JSON.stringify([
              "Loyiha chizmalarini professional rasmiylashtirish",
              "Arxitektura va BIM standartlariga mos ishlash",
              "Amaliy tajriba va ilg'or usullar"
            ]),
            [category],
            viewUrl,
            coverThumb,
            sourceId,
            file.id,
            file.name,
            viewUrl,
            file.size
          ]);

          stats.new++;
        }
      } catch (itemErr) {
        console.warn(`[DRIVE SYNC ITEM ERROR] ${file.name}:`, itemErr.message);
        stats.failed++;
      }
    }

    // Source ning last_sync parametrlarini yangilash
    if (sourceId) {
      await pool.query(
        'UPDATE drive_sources SET last_sync_at = NOW(), last_sync_stats = $1, root_folder_id = $2 WHERE id = $3',
        [JSON.stringify(stats), targetFolderId, sourceId]
      );
    }

    console.log(`[DRIVE SYNC FINISHED] New: ${stats.new}, Existing: ${stats.existing}, Failed: ${stats.failed}`);

    return res.json({
      ok: true,
      stats: stats,
      message: `Sinxronizatsiya yakunlandi: ${stats.new} ta yangi kitob topildi, ${stats.existing} ta avvaldan mavjud.`
    });
  } catch (err) {
    console.error('DRIVE SYNC ERROR:', err);
    return res.status(500).json({ error: 'Google Drive sinxronizatsiyasida xatolik: ' + err.message });
  }
});

// Admin: AI orqali kitoblarga metadata yaratish (Batch yoki tanlanganlar)
app.post('/api/admin/books/generate-ai-metadata', requireAdmin, async function (req, res) {
  try {
    if (!libraryBooksTableReady) {
      await ensureLibraryBooksTable();
    }

    var bookIds = Array.isArray(req.body.book_ids) ? req.body.book_ids.map(Number).filter(Boolean) : [];
    var allNeedsReview = !!req.body.all_needs_review;
    var batchSize = Math.min(50, Math.max(1, parseInt(req.body.batch_size) || 25));

    var query = '';
    var params = [];

    if (bookIds.length > 0) {
      query = 'SELECT * FROM library_books WHERE id = ANY($1) ORDER BY id ASC LIMIT $2';
      params = [bookIds, batchSize];
    } else if (allNeedsReview) {
      query = "SELECT * FROM library_books WHERE (status IN ('NEEDS_REVIEW', 'DISCOVERED', 'needs_review', 'discovered') OR ai_generated = false) AND status != 'published' ORDER BY id ASC LIMIT $1";
      params = [batchSize];
    } else {
      return res.status(400).json({ error: 'Qayta ishlanadigan kitoblar tanlanmadi' });
    }

    var booksRes = await pool.query(query, params);
    var targetBooks = booksRes.rows;

    if (!targetBooks.length) {
      return res.json({ ok: true, processed_count: 0, failed_count: 0, message: 'AI qayta ishlashi uchun kitob topilmadi' });
    }

    var processed = 0;
    var failed = 0;

    for (var book of targetBooks) {
      try {
        var meta = await generateBookAiMetadata(book);
        var whatLearnStr = Array.isArray(meta.what_you_learn)
          ? meta.what_you_learn.join('\n')
          : String(meta.what_you_learn || '');

        await pool.query(`
          UPDATE library_books SET
            title = $1,
            author = $2,
            short_description = $3,
            what_you_learn = $4,
            categories = $5,
            tags = $6,
            language = $7,
            publication_year = $8,
            ai_generated = true,
            status = 'NEEDS_REVIEW',
            updated_at = NOW()
          WHERE id = $9
        `, [
          meta.title,
          meta.author,
          meta.short_description,
          whatLearnStr,
          [meta.category],
          meta.tags,
          meta.language,
          meta.publication_year,
          book.id
        ]);

        processed++;
      } catch (aiErr) {
        console.warn(`[AI METADATA ERROR] Book ID ${book.id}:`, aiErr.message);
        await pool.query('UPDATE library_books SET sync_error = $1, retry_count = retry_count + 1 WHERE id = $2', [aiErr.message, book.id]);
        failed++;
      }
    }

    return res.json({
      ok: true,
      processed_count: processed,
      failed_count: failed,
      message: `${processed} ta kitob uchun AI metadata muvaffaqiyatli tayyorlandi`
    });
  } catch (err) {
    console.error('AI GENERATE METADATA ERROR:', err);
    return res.status(500).json({ error: 'AI metadata yaratishda xatolik: ' + err.message });
  }
});

// Admin: Kitobni tasdiqlash va nashr qilish (Approve & Publish)
app.post('/api/admin/books/:id/approve', requireAdmin, async function (req, res) {
  try {
    var id = parseInt(req.params.id);
    var b = req.body;

    var updateFields = [];
    var params = [];
    var pIdx = 1;

    updateFields.push("status = 'published'");
    updateFields.push("admin_approved = true");
    updateFields.push("published_at = NOW()");
    updateFields.push("updated_at = NOW()");

    if (b.title) {
      updateFields.push('title = $' + pIdx);
      params.push(b.title.trim());
      pIdx++;
    }
    if (b.author !== undefined) {
      updateFields.push('author = $' + pIdx);
      params.push(String(b.author || '').trim());
      pIdx++;
    }
    if (b.short_description) {
      updateFields.push('short_description = $' + pIdx);
      params.push(b.short_description.trim());
      pIdx++;
    }
    if (b.what_you_learn) {
      updateFields.push('what_you_learn = $' + pIdx);
      params.push(b.what_you_learn.trim());
      pIdx++;
    }
    if (Array.isArray(b.categories) && b.categories.length) {
      updateFields.push('categories = $' + pIdx);
      params.push(b.categories);
      pIdx++;
    }
    if (b.access_type) {
      updateFields.push('access_type = $' + pIdx);
      params.push(b.access_type === 'pro' ? 'pro' : 'free');
      pIdx++;
    }
    if (b.cover_url) {
      updateFields.push('cover_url = $' + pIdx);
      params.push(b.cover_url.trim());
      pIdx++;
    }

    params.push(id);
    var query = `UPDATE library_books SET ${updateFields.join(', ')} WHERE id = $${pIdx} RETURNING *`;
    var result = await pool.query(query, params);

    if (!result.rows.length) return res.status(404).json({ error: 'Kitob topilmadi' });
    var book = result.rows[0];

    // library_resources ga ham aks ettirish
    try {
      var primaryCat = (book.categories && book.categories[0]) || 'Arxitektura';
      var contentData = {
        what_you_learn: book.what_you_learn,
        reading_time_minutes: book.reading_time_minutes,
        access_type: book.access_type,
        book_id: book.id
      };
      await pool.query(`
        INSERT INTO library_resources (
          type, section_slug, title, subtitle, description, category, tags,
          content_url, content_type, content_data, preview_image_url,
          author, page_count, status, is_featured, order_index
        ) VALUES (
          'book', 'books', $1, $2, $3, $4, $5,
          $6, 'pdf', $7, $8,
          $9, $10, 'published', $11, 1
        )
        ON CONFLICT DO NOTHING
      `, [
        book.title, book.author ? ('Muallif: ' + book.author) : '', book.short_description, primaryCat, book.categories || [],
        book.pdf_url, JSON.stringify(contentData), book.cover_url || book.generated_cover_url || null,
        book.author, book.page_count, book.is_recommended
      ]);
    } catch (mErr) {}

    return res.json({ ok: true, book: book, message: 'Kitob muvaffaqiyatli tasdiqlandi va nashr qilindi' });
  } catch (err) {
    console.error('BOOK APPROVE ERROR:', err);
    return res.status(500).json({ error: 'Kitobni tasdiqlashda xatolik' });
  }
});

// Admin: Kitobni rad etish (Reject)
app.post('/api/admin/books/:id/reject', requireAdmin, async function (req, res) {
  try {
    var id = parseInt(req.params.id);
    var result = await pool.query("UPDATE library_books SET status = 'rejected', updated_at = NOW() WHERE id = $1 RETURNING *", [id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Kitob topilmadi' });
    return res.json({ ok: true, book: result.rows[0], message: 'Kitob rad etildi' });
  } catch (err) {
    console.error('BOOK REJECT ERROR:', err);
    return res.status(500).json({ error: 'Kitobni rad etishda xatolik' });
  }
});

// Admin: Bir nechta kitoblarni ommaviy tasdiqlash (Batch Approve)
app.post('/api/admin/books/batch-approve', requireAdmin, async function (req, res) {
  try {
    var ids = Array.isArray(req.body.book_ids) ? req.body.book_ids.map(Number).filter(Boolean) : [];
    if (!ids.length) return res.status(400).json({ error: 'Kitoblar tanlanmadi' });

    var result = await pool.query(`
      UPDATE library_books SET
        status = 'published',
        admin_approved = true,
        published_at = NOW(),
        updated_at = NOW()
      WHERE id = ANY($1)
      RETURNING id, title
    `, [ids]);

    return res.json({
      ok: true,
      approved_count: result.rows.length,
      message: `${result.rows.length} ta kitob nashr qilindi`
    });
  } catch (err) {
    console.error('BATCH APPROVE ERROR:', err);
    return res.status(500).json({ error: 'Ommaviy tasdiqlashda xatolik' });
  }
});

// Admin: Google Drive manbalari (Multi-account CRUD)
app.get('/api/admin/drive-sources', requireAdmin, async function (req, res) {
  try {
    if (!libraryBooksTableReady) await ensureLibraryBooksTable();
    var result = await pool.query('SELECT * FROM drive_sources ORDER BY id ASC');
    return res.json({ ok: true, sources: result.rows });
  } catch (err) {
    return res.status(500).json({ error: 'Manbalarni yuklashda xatolik' });
  }
});

app.post('/api/admin/drive-sources/save', requireAdmin, async function (req, res) {
  try {
    var b = req.body;
    var name = (b.name || '').trim();
    var rootFolderId = extractGoogleDriveFolderId(b.root_folder_id || '');
    if (!name || !rootFolderId) {
      return res.status(400).json({ error: 'Manba nomi va Google Drive papka ID si majburiy' });
    }
    var apiKey = (b.api_key || '').trim();
    var id = b.id ? parseInt(b.id) : null;

    if (id) {
      var updateRes = await pool.query(`
        UPDATE drive_sources SET
          name = $1, root_folder_id = $2, api_key = $3, is_active = $4, updated_at = NOW()
        WHERE id = $5 RETURNING *
      `, [name, rootFolderId, apiKey, b.is_active !== false, id]);
      return res.json({ ok: true, source: updateRes.rows[0], message: 'Manba yangilandi' });
    } else {
      var insertRes = await pool.query(`
        INSERT INTO drive_sources (name, root_folder_id, api_key, is_active)
        VALUES ($1, $2, $3, $4) RETURNING *
      `, [name, rootFolderId, apiKey, b.is_active !== false]);
      return res.json({ ok: true, source: insertRes.rows[0], message: 'Yangi manba qo\'shildi' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Manbani saqlashda xatolik: ' + err.message });
  }
});

app.post('/api/admin/drive-sources/:id/delete', requireAdmin, async function (req, res) {
  try {
    var id = parseInt(req.params.id);
    await pool.query('DELETE FROM drive_sources WHERE id = $1', [id]);
    return res.json({ ok: true, message: 'Manba o\'chirildi' });
  } catch (err) {
    return res.status(500).json({ error: 'Manbani o\'chirishda xatolik' });
  }
});

// Foydalanuvchilar uchun: 500+ kitoblarni qidirish va sahifalab olish (Faqat published)
app.post('/api/library/v2/books/search', async function (req, res) {
  try {
    var search = (req.body.search || '').trim().toLowerCase();
    var category = req.body.category || 'all';
    var accessType = req.body.access_type || 'all'; // all, free, pro
    var page = Math.max(1, parseInt(req.body.page) || 1);
    var limit = Math.min(60, Math.max(6, parseInt(req.body.limit) || 24));
    var offset = (page - 1) * limit;

    var conditions = ["status = 'published'"];
    var params = [];
    var pIdx = 1;

    if (search) {
      conditions.push('(LOWER(title) LIKE $' + pIdx + ' OR LOWER(COALESCE(author, \'\')) LIKE $' + pIdx + ' OR LOWER(COALESCE(short_description, \'\')) LIKE $' + pIdx + ' OR array_to_string(categories, \' \') ILIKE $' + pIdx + ')');
      params.push('%' + search + '%');
      pIdx++;
    }

    if (category && category !== 'all' && category !== 'Barchasi') {
      conditions.push('$' + pIdx + ' = ANY(categories)');
      params.push(category);
      pIdx++;
    }

    if (accessType && accessType !== 'all') {
      conditions.push('access_type = $' + pIdx);
      params.push(accessType);
      pIdx++;
    }

    var where = 'WHERE ' + conditions.join(' AND ');
    var countRes = await pool.query('SELECT COUNT(*)::int AS total FROM library_books ' + where, params);
    var total = countRes.rows[0].total || 0;

    var query = 'SELECT * FROM library_books ' + where + ' ORDER BY is_recommended DESC, id DESC LIMIT $' + pIdx + ' OFFSET $' + (pIdx + 1);
    params.push(limit, offset);

    var booksRes = await pool.query(query, params);

    return res.json({
      ok: true,
      books: booksRes.rows,
      total: total,
      page: page,
      limit: limit,
      total_pages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('BOOKS SEARCH ERROR:', err);
    return res.status(500).json({ error: 'Kitoblarni qidirishda xatolik' });
  }
});

// Admin: Kitob qo'shish (Faqat kitob parametrlari, avtomatik muqova va page count)
app.post('/api/admin/books/add', requireAdmin, async function (req, res) {
  try {
    if (!libraryBooksTableReady) {
      await ensureLibraryBooksTable();
    }
    var b = req.body;
    var title = (b.title || '').trim();
    if (!title) return res.status(400).json({ error: 'Kitob nomi majburiy' });
    var shortDesc = (b.short_description || '').trim();
    if (!shortDesc) return res.status(400).json({ error: 'Qisqa tavsif majburiy' });
    var whatYouLearn = (b.what_you_learn || '').trim();
    if (!whatYouLearn) return res.status(400).json({ error: 'Nima o\'rganiladi maydoni majburiy' });
    var pdfUrl = (b.pdf_url || '').trim();
    if (!pdfUrl) return res.status(400).json({ error: 'PDF fayl yoki havola majburiy' });

    var author = (b.author || '').trim();
    var categories = Array.isArray(b.categories) ? b.categories.filter(Boolean) : [];
    if (!categories.length && b.category) categories = [b.category];

    var pageCount = parseInt(b.page_count) || 0;
    var readingMinutes = parseInt(b.reading_time_minutes) || (pageCount > 0 ? pageCount * 2 : 30);
    var accessType = b.access_type === 'pro' ? 'pro' : 'free';
    var isRecommended = !!b.is_recommended;
    var status = b.status || 'published';
    var coverUrl = (b.cover_url || '').trim();

    // Auto drive thumbnail fallback
    var generatedCover = coverUrl;
    if (!generatedCover) {
      var m = pdfUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || pdfUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (m && m[1]) {
        generatedCover = 'https://drive.google.com/thumbnail?id=' + m[1] + '&sz=w800';
      }
    }

    var insertResult = await pool.query(`
      INSERT INTO library_books (
        title, author, short_description, what_you_learn, categories,
        pdf_url, cover_url, generated_cover_url, page_count, reading_time_minutes,
        access_type, is_recommended, status, published_at
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13, NOW()
      ) RETURNING *
    `, [
      title, author, shortDesc, whatYouLearn, categories,
      pdfUrl, coverUrl || null, generatedCover || null, pageCount, readingMinutes,
      accessType, isRecommended, status
    ]);

    var book = insertResult.rows[0];

    // Mirror to library_resources for Mini App backwards compatibility
    try {
      var primaryCat = categories[0] || 'Arxitektura';
      var contentData = {
        what_you_learn: whatYouLearn,
        reading_time_minutes: readingMinutes,
        access_type: accessType,
        book_id: book.id
      };
      await pool.query(`
        INSERT INTO library_resources (
          type, section_slug, title, subtitle, description, category, tags,
          content_url, content_type, content_data, preview_image_url,
          author, page_count, status, is_featured, order_index
        ) VALUES (
          'book', 'books', $1, $2, $3, $4, $5,
          $6, 'pdf', $7, $8,
          $9, $10, $11, $12, 1
        )
      `, [
        title, author ? ('Muallif: ' + author) : '', shortDesc, primaryCat, categories,
        pdfUrl, JSON.stringify(contentData), coverUrl || generatedCover || null,
        author, pageCount, status, isRecommended
      ]);
    } catch (mirrorErr) {
      console.warn('Mirror book to library_resources warning:', mirrorErr.message);
    }

    return res.json({ ok: true, book: book, message: 'Kitob muvaffaqiyatli saqlandi' });
  } catch (err) {
    console.error('ADMIN BOOKS ADD ERROR:', err);
    return res.status(500).json({ error: 'Kitob qo\'shishda xatolik: ' + err.message });
  }
});

// Admin: Kitob yangilash
app.post('/api/admin/books/:id/update', requireAdmin, async function (req, res) {
  try {
    if (!libraryBooksTableReady) {
      await ensureLibraryBooksTable();
    }
    var id = parseInt(req.params.id);
    var b = req.body;
    var title = (b.title || '').trim();
    if (!title) return res.status(400).json({ error: 'Kitob nomi majburiy' });
    var shortDesc = (b.short_description || '').trim();
    if (!shortDesc) return res.status(400).json({ error: 'Qisqa tavsif majburiy' });
    var whatYouLearn = (b.what_you_learn || '').trim();
    if (!whatYouLearn) return res.status(400).json({ error: 'Nima o\'rganiladi maydoni majburiy' });
    var pdfUrl = (b.pdf_url || '').trim();
    if (!pdfUrl) return res.status(400).json({ error: 'PDF fayl yoki havola majburiy' });

    var author = (b.author || '').trim();
    var categories = Array.isArray(b.categories) ? b.categories.filter(Boolean) : [];
    if (!categories.length && b.category) categories = [b.category];

    var pageCount = parseInt(b.page_count) || 0;
    var readingMinutes = parseInt(b.reading_time_minutes) || (pageCount > 0 ? pageCount * 2 : 30);
    var accessType = b.access_type === 'pro' ? 'pro' : 'free';
    var isRecommended = !!b.is_recommended;
    var status = b.status || 'published';
    var coverUrl = (b.cover_url || '').trim();

    var generatedCover = coverUrl;
    if (!generatedCover) {
      var m = pdfUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || pdfUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (m && m[1]) {
        generatedCover = 'https://drive.google.com/thumbnail?id=' + m[1] + '&sz=w800';
      }
    }

    var updateResult = await pool.query(`
      UPDATE library_books SET
        title = $1, author = $2, short_description = $3, what_you_learn = $4, categories = $5,
        pdf_url = $6, cover_url = $7, generated_cover_url = $8, page_count = $9, reading_time_minutes = $10,
        access_type = $11, is_recommended = $12, status = $13, updated_at = NOW()
      WHERE id = $14
      RETURNING *
    `, [
      title, author, shortDesc, whatYouLearn, categories,
      pdfUrl, coverUrl || null, generatedCover || null, pageCount, readingMinutes,
      accessType, isRecommended, status, id
    ]);

    if (!updateResult.rows.length) return res.status(404).json({ error: 'Kitob topilmadi' });
    var book = updateResult.rows[0];

    // Mirror update to library_resources
    try {
      var primaryCat = categories[0] || 'Arxitektura';
      var contentData = {
        what_you_learn: whatYouLearn,
        reading_time_minutes: readingMinutes,
        access_type: accessType,
        book_id: book.id
      };
      await pool.query(`
        UPDATE library_resources SET
          title = $1, subtitle = $2, description = $3, category = $4, tags = $5,
          content_url = $6, content_data = $7, preview_image_url = $8,
          author = $9, page_count = $10, status = $11, is_featured = $12, updated_at = NOW()
        WHERE (content_data->>'book_id' = $13::text) OR (title = $1 AND section_slug = 'books')
      `, [
        title, author ? ('Muallif: ' + author) : '', shortDesc, primaryCat, categories,
        pdfUrl, JSON.stringify(contentData), coverUrl || generatedCover || null,
        author, pageCount, status, isRecommended, id.toString()
      ]);
    } catch (mErr) {
      console.warn('Mirror book update error:', mErr.message);
    }

    return res.json({ ok: true, book: book, message: 'Kitob muvaffaqiyatli yangilandi' });
  } catch (err) {
    console.error('ADMIN BOOKS UPDATE ERROR:', err);
    return res.status(500).json({ error: 'Kitobni yangilashda xatolik' });
  }
});

// Admin: Kitob statusini nashr qilish / o'zgartirish
app.post('/api/admin/books/:id/publish', requireAdmin, async function (req, res) {
  try {
    var id = parseInt(req.params.id);
    var status = req.body.status || 'published';
    var result = await pool.query(
      'UPDATE library_books SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Kitob topilmadi' });
    var book = result.rows[0];

    await pool.query(
      "UPDATE library_resources SET status = $1, updated_at = NOW() WHERE (content_data->>'book_id' = $2::text) OR (title = $3 AND section_slug = 'books')",
      [status, id.toString(), book.title]
    );

    return res.json({ ok: true, book: book, message: 'Kitob statusi: ' + status });
  } catch (err) {
    console.error('ADMIN BOOKS PUBLISH ERROR:', err);
    return res.status(500).json({ error: 'Status o\'zgartirishda xatolik' });
  }
});

// Admin: Kitobni o'chirish
app.post('/api/admin/books/:id/delete', requireAdmin, async function (req, res) {
  try {
    var id = parseInt(req.params.id);
    var cur = await pool.query('SELECT title FROM library_books WHERE id = $1', [id]);
    var title = cur.rows.length ? cur.rows[0].title : null;

    var result = await pool.query('DELETE FROM library_books WHERE id = $1 RETURNING id', [id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Kitob topilmadi' });

    if (title) {
      await pool.query(
        "DELETE FROM library_resources WHERE (content_data->>'book_id' = $1::text) OR (title = $2 AND section_slug = 'books')",
        [id.toString(), title]
      );
    }

    return res.json({ ok: true, message: 'Kitob o\'chirildi' });
  } catch (err) {
    console.error('ADMIN BOOKS DELETE ERROR:', err);
    return res.status(500).json({ error: 'Kitobni o\'chirishda xatolik' });
  }
});

// Admin: Tavsiya holatini o'zgartirish
app.post('/api/admin/books/:id/toggle-recommend', requireAdmin, async function (req, res) {
  try {
    if (!libraryBooksTableReady) {
      await ensureLibraryBooksTable();
    }
    var id = parseInt(req.params.id);
    var cur = await pool.query('SELECT is_recommended, title FROM library_books WHERE id = $1', [id]);
    if (!cur.rows.length) return res.status(404).json({ error: 'Kitob topilmadi' });

    var nextRec = !cur.rows[0].is_recommended;
    var result = await pool.query(
      'UPDATE library_books SET is_recommended = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [nextRec, id]
    );

    await pool.query(
      "UPDATE library_resources SET is_featured = $1, updated_at = NOW() WHERE (content_data->>'book_id' = $2::text) OR (title = $3 AND section_slug = 'books')",
      [nextRec, id.toString(), cur.rows[0].title]
    );

    return res.json({ ok: true, is_recommended: nextRec, message: nextRec ? 'Tavsiya etildi' : 'Tavsiyalardan olindi' });
  } catch (err) {
    console.error('ADMIN BOOKS TOGGLE RECOMMEND ERROR:', err);
    return res.status(500).json({ error: 'Tavsiya holatini o\'zgartirishda xatolik' });
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
