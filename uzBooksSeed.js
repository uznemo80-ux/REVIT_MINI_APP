// ======================================================
// O'zbek tilidagi bepul o'quv kitoblari (Arxitektura, Interyer, Ergonomika, Chizmachilik, Qurilish, Normativ)
// Har bir PDF havolasi 2026-10-24 da tekshirilgan: HTTP 200/206, application/pdf, "%PDF-" imzosi,
// birinchi sahifadagi nom, muallif va yil qo'lda solishtirilgan.
// Manbalar: ZiyoNET (davlat ta'lim tarmog'i), Ziyouz kutubxonasi, OTM kutubxonalari, mc.uz (Qurilish vazirligi).
// Seed idempotent: kitob nomi yoki PDF havolasi bazada bo'lsa qayta qo'shilmaydi, admin tahriri buzilmaydi.
// ======================================================

const UZ_ARCH_BOOKS_SEED = [
  {
    order: 1,
    title: "Arxitektura ashyoshunosligi",
    author: "E. Qosimov",
    publication_year: "2016",
    page_count: 121,
    categories: ["Arxitektura", "Materiallar"],
    tags: ["arxitektura", "qurilish materiallari", "pardozlash", "darslik"],
    pdf_url: "https://api.ziyonet.uz/uploads/books/719417/5891b87994724.pdf",
    short_description: "Kasb-hunar kollejlari va akademik litseylar uchun darslik (Toshkent, «Noshir», 2016). Arxitekturada qo'llaniladigan zamonaviy qurilish va pardozlash ashyolari, ularning xossalari va tanlash qoidalari yoritilgan. Manba: ZiyoNET.",
    what_you_learn: [
      "Arxitekturada ishlatiladigan tabiiy va sun'iy qurilish ashyolari",
      "Pardozlash materiallarining xossalari va qo'llanish sohalari",
      "Material tanlashda mustahkamlik, issiqlik va namlikka chidamlilik",
      "Zamonaviy pardozlash texnologiyalari bilan tanishuv"
    ]
  },
  {
    order: 2,
    title: "Kompyuter dasturlari yordamida arxitektura muhitlari ob'yektlarini tasvirlash",
    author: "Samarqand davlat arxitektura-qurilish instituti, «Landshaft dizayni va interyer» kafedrasi",
    publication_year: "2020",
    page_count: 40,
    categories: ["Interyer", "Dizayn"],
    tags: ["interyer", "dizayn", "arxitekturaviy grafika", "3ds max", "sketchup", "autocad", "uslubiy ko'rsatma"],
    pdf_url: "https://api.ziyonet.uz/uploads/books/251467/5fa91bf3df2b5.pdf",
    short_description: "«Arxitekturaviy grafika» fanidan kurs ishi bo'yicha uslubiy ko'rsatma (5150900 – Dizayn: arxitektura muhitlari dizayni). Photoshop, CorelDRAW, AutoCAD, Lumion, 3ds Max, SketchUp yordamida interyer va muhit ob'yektlarini tasvirlash. Manba: ZiyoNET.",
    what_you_learn: [
      "Arxitekturaviy va kompyuter grafikasi turlari",
      "Interyer va muhit ob'yektlarini dasturlarda tasvirlash bosqichlari",
      "Badiiy-kompozitsion yechim va me'yoriy talablar",
      "Kurs loyihasini grafik rasmiylashtirish namunalari"
    ]
  },
  {
    order: 3,
    title: "«Loyihalash» fanidan «Stilizatsiya» kurs ishi uchun uslubiy ko'rsatma",
    author: "Samarqand davlat arxitektura-qurilish instituti, «Landshaft dizayni va interyer» kafedrasi",
    publication_year: "2015",
    page_count: 28,
    categories: ["Interyer", "Dizayn"],
    tags: ["dizayn", "interyer", "stilizatsiya", "kompozitsiya", "uslubiy ko'rsatma"],
    pdf_url: "https://api.ziyonet.uz/uploads/books/697320/5affb0bacef62.pdf",
    short_description: "Dizayn va Arxitektura yo'nalishlari talabalari uchun «Stilizatsiya» mavzusidagi kurs ishini bajarish bo'yicha uslubiy ko'rsatma (Samarqand, 2015). Shakl, naqsh va kompozitsiyani stilizatsiyalash usullari. Manba: ZiyoNET.",
    what_you_learn: [
      "Stilizatsiya tushunchasi va dizayndagi o'rni",
      "Tabiiy va tarixiy shakllarni soddalashtirish usullari",
      "Kompozitsiya va rang bilan ishlash",
      "Kurs ishini bosqichma-bosqich bajarish tartibi"
    ]
  },
  {
    order: 4,
    title: "Ergonomika",
    author: "B.I. G'oyibov",
    publication_year: "2013",
    page_count: 200,
    categories: ["Ergonomika", "Interyer", "Dizayn"],
    tags: ["ergonomika", "antropometriya", "dizayn", "interyer", "o'quv qo'llanma"],
    pdf_url: "https://www.ziyouz.com/books/kollej_va_otm_darsliklari/texnika_va_texnologiya/Ergonomika%20(B.G%27oyibov).pdf",
    short_description: "Oliy va o'rta maxsus ta'lim vazirligi tavsiya etgan o'quv qo'llanma (Toshkent, «Tafakkur bo'stoni», 2013). Inson o'lchamlari (antropometriya), ish o'rni, mebel va jihozlarni qulay loyihalash qonuniyatlari. Manba: Ziyouz kutubxonasi.",
    what_you_learn: [
      "Antropometrik, biomexanik va psixofiziologik omillar",
      "Ish o'rni, o'rindiq va jihozlar o'lchamlarini belgilash",
      "Yorug'lik, rang va shovqinning inson faoliyatiga ta'siri",
      "Ergonomika — dizayn va interyer loyihalashning tabiiy asosi"
    ]
  },
  {
    order: 5,
    title: "Chizmachilik (geometrik va proyeksion chizmachilik)",
    author: "M.K. Xalimov",
    publication_year: "2013",
    page_count: 180,
    categories: ["Chizma", "Chizmachilik"],
    tags: ["chizmachilik", "proyeksiya", "aksonometriya", "qirqim", "kesim", "o'quv qo'llanma"],
    pdf_url: "https://n.ziyouz.com/books/kollej_va_otm_darsliklari/matematika/Chizmachilik.%20Geometrik%20va%20proyeksion%20chizmachilik%20(M.Xalimov).pdf",
    short_description: "Oliy va o'rta maxsus ta'lim vazirligi tavsiya etgan o'quv qo'llanma (Toshkent, 2013). Shriftlar, tutashmalar, ko'rinishlar, qirqim va kesimlar, aksonometrik proyeksiyalar, eskiz va texnik rasm. Manba: Ziyouz kutubxonasi.",
    what_you_learn: [
      "Chizma shriftlari, chiziq turlari va tutashmalar",
      "Ko'rinishlar, qirqim va kesimlarni to'g'ri bajarish",
      "Aksonometrik proyeksiyalar va texnik rasm",
      "Sirtlarning o'zaro kesishuvi"
    ]
  },
  {
    order: 6,
    title: "Chizma geometriya",
    author: "Sh. Murodov, L. Hakimov, A. Xolmurzayev",
    publication_year: "2008",
    page_count: 296,
    categories: ["Chizma", "Chizma geometriya"],
    tags: ["chizma geometriya", "proyeksiya", "perspektiva", "darslik"],
    pdf_url: "https://api.ziyonet.uz/uploads/books/251467/5fc9ec6d04ebd.pdf",
    short_description: "Oliy o'quv yurtlari talabalari uchun darslik (Toshkent, «Iqtisod-Moliya», 2008, prof. Sh. Murodov umumiy tahririda). Nuqta, to'g'ri chiziq va tekislik proyeksiyalari, sirtlar, perspektiva. Manba: ZiyoNET.",
    what_you_learn: [
      "Ortogonal proyeksiyalash asoslari (Monj usuli)",
      "Nuqta, to'g'ri chiziq va tekislikning o'zaro vaziyati",
      "Egri chiziqlar va sirtlar, ularning kesishuvi",
      "Perspektiva va soya yasash"
    ]
  },
  {
    order: 7,
    title: "Chizma geometriya va injenerlik grafikasi",
    author: "Hikmat Abidov",
    publication_year: "2015",
    page_count: 211,
    categories: ["Chizma", "Arxitektura"],
    tags: ["chizma geometriya", "injenerlik grafikasi", "arxitektura", "qurilish", "o'quv qo'llanma"],
    pdf_url: "https://api.ziyonet.uz/uploads/books/335941/5a12530169e2e.pdf",
    short_description: "Arxitektura va qurilish yo'nalishlari talabalariga mo'ljallangan o'quv qo'llanma (Toshkent, 2015). Mavzular davlat standartlari asosida qisqa va aniq berilgan. Manba: ZiyoNET.",
    what_you_learn: [
      "Chizma geometriya va injenerlik grafikasi asoslari",
      "Qurilish chizmalarini standart bo'yicha bajarish",
      "Proyeksion bog'lanish va ko'rinishlar",
      "Arxitektura-qurilish chizmalarida o'lcham qo'yish"
    ]
  },
  {
    order: 8,
    title: "Bino va inshootlar konstruksiyasi",
    author: "N.J. To'ychiyev",
    publication_year: "2010",
    page_count: 240,
    categories: ["Qurilish", "Konstruksiya"],
    tags: ["konstruksiya", "poydevor", "zilzilabardoshlik", "olovbardoshlik", "darslik"],
    pdf_url: "https://lib.utu-ranch.uz/media/files/2024/08/29/%D0%91%D0%B8%D0%BD%D0%BE_%D0%B2%D0%B0_%D0%B8%D0%BD%D1%88%D0%BE%D0%BE%D1%82%D0%BB%D0%B0%D1%80_%D0%BA%D0%BE%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%86%D0%B8%D1%8F%D1%81%D0%B8_2010.pdf",
    short_description: "Oliy o'quv yurtlari talabalari uchun darslik (Toshkent, «Voris nashriyot», 2010). Bino va inshootlar turlari, olovbardoshlik va zilzilabardoshlik sinflari, poydevorlar va konstruktiv yechimlar. Manba: OTM elektron kutubxonasi.",
    what_you_learn: [
      "Bino va inshootlarning tasnifi va konstruktiv elementlari",
      "Olovbardoshlik va zilzilabardoshlik darajalari",
      "Poydevor turlari va ularni loyihalash amaliyoti",
      "Turli materiallardan konstruktiv yechimlar"
    ]
  },
  {
    order: 9,
    title: "Bino va inshootlarni barpo etish texnologiyasi (2-qism)",
    author: "N. Bozorboev, X.I. Yusupov, R.A. Narov va boshq.",
    publication_year: "2014",
    page_count: 150,
    categories: ["Qurilish", "Konstruksiya"],
    tags: ["qurilish texnologiyasi", "monolit", "yig'ma konstruksiya", "temirbeton", "darslik"],
    pdf_url: "https://api.ziyonet.uz/uploads/books/335941/5aed4101a6df5.pdf",
    short_description: "Qurilish oliy o'quv yurtlari uchun darslik, 2-qism (Toshkent arxitektura-qurilish instituti, 2014). Yig'ma konstruksiyalardan, monolit temirbetondan va noqulay sharoitlarda bino barpo etish texnologiyasi. Manba: ZiyoNET.",
    what_you_learn: [
      "Yig'ma konstruksiyalardan bino barpo etish",
      "Monolit temirbeton binolar qurish texnologiyasi",
      "Qishki va noqulay sharoitlarda qurilish ishlari",
      "Qurilish jarayonini tashkil etish"
    ]
  },
  {
    order: 10,
    title: "ShNQ 1.03.04-22 «Namunaviy loyiha hujjatlari»",
    author: "O'zbekiston Respublikasi Qurilish vazirligi",
    publication_year: "2022",
    page_count: 13,
    categories: ["Normativ", "Chizma"],
    tags: ["shnq", "normativ", "loyiha hujjatlari", "namunaviy loyiha", "gost 21.101"],
    pdf_url: "https://mc.uz/uploads/mcuz_99811688333360.pdf",
    short_description: "Qurilish vazirining 2022-yil 19-apreldagi 69-son buyrug'i bilan tasdiqlangan, Adliya vazirligida 2022-yil 25-aprelda 78-raqam bilan ro'yxatga olingan shaharsozlik normalari. Namunaviy loyiha hujjatlarini ishlab chiqish, kelishish va qo'llash tartibi. Manba: mc.uz (rasmiy).",
    what_you_learn: [
      "Namunaviy loyiha hujjatlari qanday ishlab chiqiladi",
      "Bir va ikki bosqichli loyihalash (xavf-xatar toifasiga qarab)",
      "GOST 21.101, 21.501 va boshqa standartlarga muvofiqlik",
      "Bosh muhandis (bosh arxitektor) vazifalari"
    ]
  }
];

async function seedUzArchBooks(pool) {
  let added = 0;
  for (const b of UZ_ARCH_BOOKS_SEED) {
    try {
      const r = await pool.query(`
        INSERT INTO library_books (
          title, author, short_description, what_you_learn, categories, tags,
          pdf_url, page_count, reading_time_minutes, access_type, is_recommended,
          status, language, publication_year, admin_approved, created_at, updated_at, published_at
        )
        SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, 'free', true, 'published', 'uz', $10, true,
               NOW() - ($11 || ' seconds')::interval, NOW(), NOW()
        WHERE NOT EXISTS (SELECT 1 FROM library_books WHERE title = $1 OR pdf_url = $7)
        RETURNING id
      `, [
        b.title, b.author, b.short_description, JSON.stringify(b.what_you_learn), b.categories, b.tags,
        b.pdf_url, b.page_count, Math.max(10, b.page_count * 2), b.publication_year,
        // Yangi qo'shilganlar ro'yxatida tartib saqlanishi uchun: 1-kitob eng yangi bo'lib ko'rinadi
        String(b.order)
      ]);
      if (r.rows.length) added++;
    } catch (e) {
      console.warn('UZ BOOKS SEED warn (' + b.title + '):', e.message);
    }
  }
  if (added) console.log('📚 UZ ARCH BOOKS: ' + added + ' ta yangi kitob qo‘shildi');
}

module.exports = { UZ_ARCH_BOOKS_SEED, seedUzArchBooks };
