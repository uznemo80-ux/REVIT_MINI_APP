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
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    var scCount = await pool.query('SELECT COUNT(*)::int AS c FROM course_showcases');
    if (scCount.rows[0].c === 0) {
      await pool.query(`
        INSERT INTO course_showcases (course_id, course_title, title, student_name, description, pdf_url, preview_image_url, discount_badge, order_index)
        VALUES
        (
          1,
          'INTPRO — Revit dasturida interyer loyihalash',
          '3 xonali zamonaviy xonadon to''liq ishchi loyihasi (42 list)',
          'Azizbek Toshpo''latov',
          'INTPRO kursi bitiruvchisi tomonidan tayyorlangan to''liq interyer rabochkasi: obmer, demontaj, montaj, santexnika, elektr, pol, patalok, razvyortkalar va spesifikatsiyalar.',
          'https://drive.google.com/file/d/1B_sample_rabochka_revit/preview',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
          '🔥 25% Chegirma: 1 125 000 so''m',
          1
        ),
        (
          1,
          'INTPRO — Revit dasturida interyer loyihalash',
          '2 qavatli hovli uyi arxitektura ishchi chizmalari (AR bo''limi)',
          'Malika Karimova',
          'Revit Architecture bo''yicha tayyorlangan to''liq ishchi loyiha: fasadlar, kesimlar, listlar, konstruktiv uzellar va fasad pasporti.',
          'https://drive.google.com/file/d/1C_sample_house_revit/preview',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
          '🔥 Maxsus chegirma narxi',
          2
        ),
        (
          1,
          'INTPRO — Revit dasturida interyer loyihalash',
          'Loft uslubidagi restoran va qahvaxona loyiha albomi',
          'Sardorbek Aliyev',
          'Jamoat binosi interyer loyihalash amaliy natijasi: mebel spetsifikatsiyalari, vitrajlar va yoritish zonalari.',
          'https://drive.google.com/file/d/1D_sample_cafe_revit/preview',
          'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
          null,
          3
        )
      `);
    }

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
  } catch (error) {
    console.error('INIT EXTENDED TABLES ERROR:', error);
  }
}

initExtendedTables();


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

    return res.json({
      has_access: userHasAccess, access_until: user.access_until || null,
      telegram_id: user.telegram_id.toString(),
      first_name: user.first_name || '', last_name: user.last_name || '',
      phone: user.phone || '', username: user.username || '',
      registered: Boolean(user.first_name && user.last_name && user.phone),
      modules: data,
      last_lesson: lastLesson,
      courses: courses,
      faqs: faqs,
      settings: settings,
      testimonials: testimonials,
      showcases: showcases,
      open_resources: openResources,
      materials: materials
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

    var youtubePlayerUrl = generateYouTubePlayerUrl(lesson.youtube_url);

    if (youtubePlayerUrl) {
      return res.json({
        id: lesson.id, title: lesson.title, video_type: 'youtube',
        youtube_url: lesson.youtube_url, youtube_player_url: youtubePlayerUrl,
        task_text: lesson.task_text || '', warning_text: warningText, files: files, my_submission: mySubmission, watched: isWatched,
        questions: questions
      });
    }

    if (lesson.bunny_video_id && process.env.BUNNY_LIBRARY_ID) {
      var bunnyPlayerUrl = generateBunnyPlayerUrl(process.env.BUNNY_LIBRARY_ID, lesson.bunny_video_id);
      return res.json({
        id: lesson.id, title: lesson.title, video_type: 'bunny',
        bunny_video_id: lesson.bunny_video_id, bunny_library_id: process.env.BUNNY_LIBRARY_ID,
        bunny_player_url: bunnyPlayerUrl,
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
        pending_renewal: pendingRenewalResult.rows[0].c
      }
    });
  } catch (error) {
    console.error('ADMIN STATS ERROR:', error);
    return res.status(500).json({ error: 'Statistikani olishda xato' });
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

    return res.json({ ok: true, message: 'Sozlamalar saqlandi' });
  } catch (error) {
    console.error('SETTINGS UPDATE ERROR:', error);
    return res.status(500).json({ error: 'Sozlamalarni saqlashda xato' });
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

app.post('/api/admin/showcases/add', requireAdmin, async function (req, res) {
  try {
    var courseId = req.body.course_id ? Number(req.body.course_id) : null;
    var courseTitle = req.body.course_title ? String(req.body.course_title).trim() : '';
    var title = req.body.title ? String(req.body.title).trim() : '';
    var studentName = req.body.student_name ? String(req.body.student_name).trim() : '';
    var description = req.body.description ? String(req.body.description).trim() : '';
    var pdfUrl = req.body.pdf_url ? String(req.body.pdf_url).trim() : '';
    var previewImageUrl = req.body.preview_image_url ? String(req.body.preview_image_url).trim() : '';
    var discountBadge = req.body.discount_badge ? String(req.body.discount_badge).trim() : null;
    var orderIndex = req.body.order_index ? Number(req.body.order_index) : 0;

    if (!title || !pdfUrl) {
      return res.status(400).json({ error: 'Loyiha nomi va PDF linki kiritilishi shart' });
    }

    var result = await pool.query(`
      INSERT INTO course_showcases
      (course_id, course_title, title, student_name, description, pdf_url, preview_image_url, discount_badge, order_index)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [courseId, courseTitle, title, studentName, description, pdfUrl, previewImageUrl, discountBadge, orderIndex]);

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
    var title = req.body.title ? String(req.body.title).trim() : '';
    var studentName = req.body.student_name ? String(req.body.student_name).trim() : '';
    var description = req.body.description ? String(req.body.description).trim() : '';
    var pdfUrl = req.body.pdf_url ? String(req.body.pdf_url).trim() : '';
    var previewImageUrl = req.body.preview_image_url ? String(req.body.preview_image_url).trim() : '';
    var discountBadge = req.body.discount_badge ? String(req.body.discount_badge).trim() : null;
    var orderIndex = req.body.order_index ? Number(req.body.order_index) : 0;

    if (!title || !pdfUrl) {
      return res.status(400).json({ error: 'Loyiha nomi va PDF linki kiritilishi shart' });
    }

    var result = await pool.query(`
      UPDATE course_showcases
      SET course_id = $1, course_title = $2, title = $3, student_name = $4, description = $5,
          pdf_url = $6, preview_image_url = $7, discount_badge = $8, order_index = $9
      WHERE id = $10
      RETURNING *
    `, [courseId, courseTitle, title, studentName, description, pdfUrl, previewImageUrl, discountBadge, orderIndex, id]);

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
