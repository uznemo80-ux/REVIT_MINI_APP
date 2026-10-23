// ======================================================
// NORMATIVLAR — TEKSHIRILGAN MA'LUMOTLAR (2026-10-24)
// Har bir hujjatning raqami, nomi, buyruq sanasi, Adliya vazirligi ro'yxat raqami va amal qilish holati
// lex.uz dagi rasmiy sahifadan solishtirildi. Raqamli talablar shu hujjat matnidagi band raqami bilan keltirilgan.
// Havolalar qidiruv sahifasiga emas, aynan hujjatning o'ziga (lex.uz/docs/-ID yoki mc.uz/uploads/*.pdf) olib boradi.
// ======================================================

const MINISTRY = "O'zbekiston Respublikasi Qurilish va uy-joy kommunal xo'jaligi vazirligi";
const CHECKED = "2026-10-24";

function lex(id) { return `https://lex.uz/uz/docs/-${id}`; }
function lexSrc(id, note) { return { title: "Lex.uz — rasmiy matn", type: "lex", url: lex(id), note: note || `Tekshirildi: ${CHECKED}` }; }

const VERIFIED_NORMATIVES = [
  // ---------------- TURAR JOY ----------------
  {
    document_number: "SHNQ 2.08.01-24",
    title: "Turar joy obyektlarini loyihalash",
    document_type: "SHNQ",
    category: "Turar joy",
    content_type: "normative",
    source_type: "lex",
    source_title: "Lex.uz",
    description: "Balandligi 50 m gacha va 16 qavatgacha (16-qavat ham kiradi) bo'lgan turar joy binolari va kvartiralarni loyihalashning asosiy davlat talablari: kvartira va xonalar maydoni, eni, balandligi, oshxona, sanuzel, dahliz, zinapoya va liftlar.",
    requirements: `• Kvartiraning minimal maydoni (34-band, 1-jadval): 1 xonali — 28 m², 2 xonali — 48 m², 3 xonali — 64 m², 4 xonali — 80 m², 5 xonali — 96 m², 6 xonali — 114 m².
• Xonalar maydoni (35-band): 1 xonali kvartirada yashash xonasi — 14 m²; 2 va undan ortiq xonali kvartirada umumiy xona — 16 m²; yotoqxona — 8 m² (2 kishilik — 12 m²); oshxona — 6 m² (2+ xonali kvartirada 8 m²); dahliz — 4 m²; sanitariya xonasi (vanna + hojatxona) — 4 m².
• Xonalar eni (36-band): yotoqxona — kamida 2,4 m; umumiy xona — kamida 3 m.
• Balandlik (38-band): yashash xonalari va oshxona poldan shiftgacha kamida 2,7 m; yordamchi xonalar — kamida 2,4 m.
• Oshxona eni (39-band): jihozlar bir tomonda — kamida 1,7 m; ikki tomonda — kamida 2,2 m.
• Dahliz va yo'laklar (40-band): dahliz eni — 1,4 m; yashash xonalariga yo'lak — 1,1 m; yordamchi xonalarga yo'lak — 0,9 m.
• Zinapoya (178-band, 8-jadval): marshda 3 tadan 18 tagacha pog'ona; marsh eni 2+ qavatli seksiyali binoda — 1,05 m, koridorli binoda — 1,2 m, kvartira ichida — 0,9 m.
• Lift (222-band): yuqori qavat sathi yer sathidan 13 m va undan baland bo'lsa lift majburiy.`,
    target_audience: "Arxitektorlar, interyer dizaynerlari, loyihachilar, ekspertlar, buyurtmachilar",
    application_scope: "Yangi turar joy binolari, ko'p xonadonli uylar, kvartiralarni loyihalash va qayta loyihalash",
    status: "AMALDA",
    adopted_date: "2024-08-14",
    effective_date: "2024-09-25",
    issuing_authority: MINISTRY + " (buyruq 01/2-57, 14.08.2024; Adliya vazirligida 25.09.2024 da 293-raqam bilan ro'yxatga olingan)",
    official_source_url: lex(7121730),
    pdf_url: null,
    sources: [
      lexSrc(7121730, "Buyruq 01/2-57 va ShNQ to'liq matni"),
      { title: "O'zgartirish: buyruq 01/2-2, 21.01.2026", type: "lex", url: lex(8029374), note: "ShNQ 2.08.01-24 ga o'zgartirish va qo'shimchalar" }
    ],
    practical_example: `Vazifa: 2 xonali kvartira (umumiy xona + yotoqxona) rejasini tekshirish.

Normativ talab (SHNQ 2.08.01-24):
- Kvartira maydoni kamida 48 m² (34-band, 1-jadval)
- Umumiy xona kamida 16 m², eni kamida 3 m (35, 36-band)
- Yotoqxona kamida 8 m² (2 kishilik — 12 m²), eni kamida 2,4 m
- Oshxona kamida 8 m², eni kamida 1,7 m (jihoz bir tomonda)
- Shift balandligi kamida 2,7 m (38-band)

Loyiha:
- Umumiy xona 3,4 × 5,0 = 17,0 m² ✅
- Yotoqxona 3,0 × 4,2 = 12,6 m² ✅ (2 kishilik uchun ham yetadi)
- Oshxona 2,4 × 3,5 = 8,4 m² ✅
- Dahliz 4,2 m², eni 1,4 m ✅; sanuzel 4,1 m² ✅
- Jami 50,3 m² ≥ 48 m² ✅

❌ Keng tarqalgan xato: shift balandligini 2,5 m deb olish. Amaldagi me'yor yashash xonalari uchun 2,7 m.`,
    old_edition_note: "SHNQ 2.08.01-19 «Turar joy binolari» o'rniga qabul qilingan (u 25.09.2024 dan kuchini yo'qotgan).",
    new_edition_note: "2026-yil 21-yanvardagi 01/2-2-son buyruq bilan o'zgartirish va qo'shimchalar kiritilgan — loyihalashda lex.uz dagi joriy tahrirdan foydalaning.",
    change_date: "2026-01-21",
    tags: ["turar joy", "kvartira", "xona maydoni", "shift balandligi", "oshxona", "sanuzel", "dahliz", "zinapoya", "lift", "interyer"]
  },
  {
    document_number: "SHNQ 2.08.01-19",
    title: "Turar joy binolari (eski tahrir)",
    document_type: "SHNQ",
    category: "Turar joy",
    content_type: "normative",
    source_type: "lex",
    source_title: "Lex.uz",
    description: "2019-2024-yillarda amalda bo'lgan turar joy binolari normasi. Hozir kuchini yo'qotgan — faqat 2024-yil sentabrigacha loyihalangan binolarni tekshirishda ma'lumot uchun.",
    requirements: "Yangi loyihalarda qo'llanmaydi. Amaldagi talablar: SHNQ 2.08.01-24.",
    target_audience: "Ekspertlar, eski loyihalarni tekshiruvchilar",
    application_scope: "Faqat tarixiy ma'lumot",
    status: "KUCHINI YO‘QOTGAN",
    adopted_date: "2019-10-15",
    effective_date: "2019-10-15",
    repealed_date: "2024-09-25",
    issuing_authority: "O'zbekiston Respublikasi Qurilish vazirligi (buyruq 480-son, 15.10.2019)",
    official_source_url: lex(5894699),
    pdf_url: null,
    sources: [lexSrc(5894699, "Lex.uz: «Hujjat kuchini yo'qotgan 25.09.2024»")],
    old_edition_note: "DIQQAT: 01/2-57-son buyruq (14.08.2024) bilan SHNQ 2.08.01-24 tasdiqlanishi munosabati bilan 25.09.2024 dan kuchini yo'qotgan.",
    new_edition_note: "O'rniga: SHNQ 2.08.01-24 «Turar joy obyektlarini loyihalash».",
    change_date: "2024-09-25",
    tags: ["turar joy", "eski tahrir", "kuchini yo'qotgan"]
  },
  {
    document_number: "ShNQ 1.04.02-22",
    title: "Turar joy obyektlarini mukammal ta'mirlash va rekonstruksiya qilish. Loyihalash talablari",
    document_type: "SHNQ",
    category: "Ta'mirlash va qayta rejalashtirish",
    content_type: "normative",
    source_type: "lex",
    source_title: "Lex.uz",
    description: "Turar joy binolari va kvartiralarni mukammal ta'mirlash, rekonstruksiya va qayta rejalashtirishni loyihalash talablari. Interyer dizayneri uchun eng muhim hujjatlardan biri: nima buzish mumkin, nima taqiqlangan.",
    requirements: `• Devor ochish yoki xonani kengaytirish faqat yuk ko'taruvchi devorlar shikastlanmasa mumkin (10-band).
• Qo'shni kvartiralarni birlashtirish yuk ko'taruvchi konstruksiyaga ta'sir qilmasa mumkin; tutashtiruvchi o'yiq eni 0,9 m, balandligi 2,1 m dan oshmasin va dahliz, yo'lak yoki oshxona to'sig'ida bo'lsin (26-band).
• Gazli oshxona va vannaxonani yashash xonasi ustiga yoki ostiga joylashtirish mumkin emas (29-band).
• Hojatxona va vannaxonani yashash xonasi yoki oshxona ustiga joylashtirish mumkin emas (ikki sathli kvartiradan tashqari) (30-band).
• Uzunligi 6 m dan ortiq xona faqat so'rma ventilyatsiya va me'yoriy tabiiy yoritilganlik bo'lsa ruxsat etiladi (27-band).
• Tabiiy yorug'liksiz oshxona faqat yorug' xona bilan birlashtirilsa va to'siqning kamida 30% i oynavand bo'lsa saqlanadi (31-band).
• Bir kvartiradan chiqqan havo boshqa kvartiraga vertikal yo'naltirilmaydi; foydalanilmaydigan ventilyatsiya ulanishlari germetik yopiladi (61–62-band).`,
    target_audience: "Interyer dizaynerlari, arxitektorlar, kvartira egalari, ta'mirlash loyihachilari",
    application_scope: "Kvartirani qayta rejalashtirish (pereplanirovka), mukammal ta'mirlash, rekonstruksiya",
    status: "AMALDA",
    adopted_date: "2024-07-09",
    effective_date: "2024-07-22",
    issuing_authority: MINISTRY + " (buyruq 01/2-26, 09.07.2024; Adliya vazirligida 22.07.2024 da 264-raqam bilan ro'yxatga olingan)",
    official_source_url: lex(7034724),
    pdf_url: null,
    sources: [lexSrc(7034724, "Buyruq 01/2-26 va ShNQ to'liq matni")],
    practical_example: `Vazifa: kvartirada oshxonani mehmonxona bilan birlashtirish va sanuzelni kattalashtirish.

✅ To'g'ri:
- Oshxona va xona orasidagi yuk ko'tarmaydigan (peregorodka) devorni olib tashlash.
- Sanuzelni koridor yoki omborxona hisobiga kengaytirish.
- Oshxona derazasiz bo'lsa — uni yorug' xona bilan birlashtirish, to'siqning ≥30% ini oynavand qilish (31-band).

❌ Noto'g'ri:
- Yuk ko'taruvchi devorda ruxsatsiz o'yiq ochish (10-band).
- Vanna yoki hojatxonani pastdagi qo'shnining yashash xonasi ustiga ko'chirish (30-band).
- Gaz plitali oshxonani yashash xonasi ustiga ko'chirish (29-band).
- Ventilyatsiya shaxtasini mebel uchun qisqartirish yoki yopish (61–62-band).`,
    old_edition_note: "ShNQ 1.04.02-05 «Turar joy binolarini kapital ta'mirlash. Loyihalash me'yorlari» o'rniga qabul qilingan.",
    new_edition_note: "Amaldagi tahrir.",
    change_date: "2024-07-22",
    tags: ["qayta rejalashtirish", "pereplanirovka", "ta'mirlash", "rekonstruksiya", "yuk ko'taruvchi devor", "ho'l zona", "ventilyatsiya", "interyer"]
  },

  // ---------------- JAMOAT VA MA'MURIY BINOLAR ----------------
  {
    document_number: "SHNQ 2.08.02-23",
    title: "Jamoat binolari va inshootlari",
    document_type: "SHNQ",
    category: "Jamoat binolari",
    content_type: "normative",
    source_type: "lex",
    source_title: "Lex.uz",
    description: "Balandligi 50 m gacha bo'lgan jamoat bino va inshootlarini loyihalash talablari: xonalar balandligi, yo'laklar, zinapoyalar, chiqishlar, liftlar, sanitariya jihozlari, umumiy ovqatlanish (restoran, kafe, bar) bo'limi.",
    requirements: `• Jamoat xonalari balandligi poldan shiftgacha kamida 3,0 m (8-band); 30 kishigacha bo'lgan xonalar, turar joy binosi ichidagi do'kon va kafelar — 2,8 m (10-band).
• Ichki yo'laklar eni kamida 1,8 m (28-band); faqat xizmat yo'laklari — uzunligiga qarab 1,2 yoki 1,6 m (29-band).
• Xonadan chiqish eshigi eni kamida 0,9 m (97-band); 50 kishidan ortiq zallarda chiqish kamida 1,2 m (100-band).
• Zinapoya marshi eni: F1 binolar va 100 kishidan ortiq bo'lsa — 1,35 m; 5 kishigacha xizmat qiladigan zinapoya — 0,9 m (24-band). Maydoncha eni marsh enidan kam emas (25-band).
• Zinapoya qiyaligi yer usti qismida 1:2 dan oshmasin (20-band). Pandus qiyaligi ichkarida 1:6, tashqarida 1:8 (23-band, zinapoya qo'yib bo'lmagan joyda).
• Tomosha zallarida qatorlar orasi kamida 0,45 m, suyanchiqlar orasi kamida 0,9 m (30-band).
• Kamida ikkita yo'lovchi lifti (131-band).
• Kafe: 50 o'rindan kam bo'lsa mijoz va xodim uchun bitta umumiy kirish ruxsat etiladi.`,
    target_audience: "Arxitektorlar, interyer dizaynerlari, bosh loyihachilar, restoran va ofis buyurtmachilari",
    application_scope: "Do'kon, kafe, restoran, ofis, madaniyat, sport va boshqa jamoat binolarini loyihalash va qayta jihozlash",
    status: "AMALDA",
    adopted_date: "2024-04-02",
    effective_date: "2024-08-07",
    issuing_authority: MINISTRY + " (buyruq 01/2-7, 02.04.2024; Adliya vazirligida 06.05.2024 da 249-raqam bilan ro'yxatga olingan)",
    official_source_url: lex(6920040),
    pdf_url: null,
    sources: [lexSrc(6920040, "Buyruq 01/2-7 va ShNQ to'liq matni (rasmiy e'londan 3 oy o'tib kuchga kirgan)")],
    practical_example: `Vazifa: turar joy binosining 1-qavatida 40 o'rinli kafe interyeri.

Normativ talab (SHNQ 2.08.02-23):
- Shift balandligi: turar joy binosi ichidagi kafe uchun kamida 2,8 m (10-band)
- Zaldan chiqish eshigi: kamida 0,9 m (97-band); 50 kishidan ortiq bo'lsa — 1,2 m (100-band)
- 50 o'rindan kam — mijoz va xodim uchun bitta kirish ruxsat etiladi

✅ To'g'ri: shift 2,85 m, chiqish eshigi 1,0 m, bitta umumiy kirish (40 o'rin < 50).
❌ Noto'g'ri: osma shift tufayli toza balandlikni 2,6 m ga tushirib qo'yish.`,
    old_edition_note: "ShNQ 2.08.02-09 «Jamoat binolari va inshootlari» o'rniga qabul qilingan.",
    new_edition_note: "Amaldagi tahrir (lex.uz da keyingi tahrirlar sanasi ko'rsatiladi).",
    change_date: "2024-08-07",
    tags: ["jamoat binosi", "kafe", "restoran", "do'kon", "yo'lak eni", "eshik eni", "shift balandligi", "zinapoya", "pandus", "lift"]
  },
  {
    document_number: "SHNQ 2.08.04-22",
    title: "Ma'muriy binolar",
    document_type: "SHNQ",
    category: "Jamoat binolari",
    content_type: "normative",
    source_type: "lex",
    source_title: "Lex.uz",
    description: "Ofis va boshqa ma'muriy binolarni loyihalash talablari: xodim ish o'rni maydoni, majlislar zali, yo'laklar, sanitariya xonalari, ovqatlanish joyi.",
    requirements: `• Ish o'rni maydoni: kompyuter yoki chizmachilik stoli bilan — 6 m² (56-band); oddiy stol bilan — 4 m² (57-band).
• Yo'lak va evakuatsiya yo'llari eni kamida 1,5 m (16-band); nogironlar aravachasi harakatlanadigan joyda — 1,8 m (iloji bo'lmasa 1,6 m).
• Yo'lak va hollarning toza balandligi kamida 2,4 m (14-band).
• Majlislar zali: stol bilan — 2 m² / o'rin; qator o'rindiqlar — 0,8–1,0 m² / o'rin (63-band).
• Tashrif buyuruvchilar kutish joyi — 1,5–2 m² / kishi (42-band).
• Hujjat shkaflari — 0,1 m² / xodim (62-band).
• Sanitariya: 15 xodimgacha — 1 unitaz va 1 qo'l yuvgich; erkaklar uchun 50 kishiga 1 unitaz va 1 pissuar; ayollar uchun 25–30 kishiga 1 unitaz (78, 81-band).`,
    target_audience: "Arxitektorlar, ofis interyeri dizaynerlari, biznes buyurtmachilari",
    application_scope: "Ofis, biznes markaz, ma'muriy binolar va ularning interyerlari",
    status: "AMALDA",
    adopted_date: "2024-08-14",
    effective_date: "2024-09-25",
    issuing_authority: MINISTRY + " (buyruq 01/2-56, 14.08.2024; Adliya vazirligida 25.09.2024 da 294-raqam bilan ro'yxatga olingan)",
    official_source_url: lex(7114475),
    pdf_url: null,
    sources: [lexSrc(7114475, "Buyruq 01/2-56 va ShNQ to'liq matni")],
    practical_example: `Vazifa: 24 xodimli dizayn byurosi (hammasi kompyuterda ishlaydi).

Hisob (SHNQ 2.08.04-22):
- Ish zonasi: 24 × 6 m² = 144 m² (56-band)
- 12 o'rinli majlislar xonasi (stol bilan): 12 × 2 m² = 24 m² (63-band)
- Hujjat shkaflari: 24 × 0,1 = 2,4 m² (62-band)
- Yo'lak eni: kamida 1,5 m (16-band)

✅ To'g'ri: ochiq ofis 150 m², majlis xonasi 25 m², yo'lak 1,6 m.
❌ Noto'g'ri: 24 kishini 100 m² ga joylashtirish (4,2 m² / kishi — kompyuterli ish o'rni uchun kam).`,
    old_edition_note: "QMQ 2.08.04-04 «Ma'muriy binolar» o'rniga qabul qilingan.",
    new_edition_note: "Amaldagi tahrir.",
    change_date: "2024-09-25",
    tags: ["ofis", "ma'muriy bino", "ish o'rni", "majlislar zali", "sanuzel soni", "interyer"]
  },
  {
    document_number: "SHNQ 2.08.06-23",
    title: "Ta'lim tashkilotlari. Loyihalash talablari",
    document_type: "SHNQ",
    category: "Jamoat binolari",
    content_type: "normative",
    source_type: "lex",
    source_title: "Lex.uz",
    description: "Maktabgacha ta'lim, umumiy o'rta, professional, oliy va maktabdan tashqari ta'lim muassasalari, internatlar va nogironligi bo'lgan bolalar uchun ixtisoslashtirilgan muassasalarni loyihalash talablari.",
    requirements: "Bog'cha, maktab, o'quv markazi va OTM binolarining xonalar tarkibi, maydonlari, yoritilganlik, ventilyatsiya va xavfsizlik talablari. Aniq qiymatlar uchun lex.uz dagi joriy tahrirdan foydalaning (2026-yilda o'zgartirishlar kiritilgan).",
    target_audience: "Arxitektorlar, ta'lim muassasalari buyurtmachilari, interyer dizaynerlari",
    application_scope: "Yangi qurilayotgan va rekonstruksiya qilinayotgan ta'lim muassasalari",
    status: "AMALDA",
    adopted_date: "2024-10-22",
    effective_date: "2024-11-16",
    issuing_authority: MINISTRY + " (buyruq 01/2-78, 22.10.2024; Adliya vazirligida 16.11.2024 da 313-raqam bilan ro'yxatga olingan)",
    official_source_url: lex(7337908),
    pdf_url: null,
    sources: [lexSrc(7337908, "Joriy tahrir: 02.07.2026 dagi 01/2-26-son buyruq bilan o'zgartirilgan")],
    new_edition_note: "2026-yil 2-iyuldagi 01/2-26-son buyruq bilan o'zgartirishlar kiritilgan (25.07.2026 holatiga tahrir).",
    change_date: "2026-07-25",
    tags: ["maktab", "bog'cha", "ta'lim", "o'quv markazi", "jamoat binosi"]
  },
  {
    document_number: "SHNQ 2.08.05-23",
    title: "Tibbiyot tashkilotlari. Loyihalash talablari",
    document_type: "SHNQ",
    category: "Jamoat binolari",
    content_type: "normative",
    source_type: "lex",
    source_title: "Lex.uz",
    description: "Davlat va nodavlat tibbiyot tashkilotlari (klinika, poliklinika, kasalxona, stomatologiya) binolarini yangi qurish va rekonstruksiya qilishni loyihalash talablari.",
    requirements: "Tibbiyot xonalarining tarkibi, maydonlari, sanitariya va muhandislik talablari. Klinika yoki stomatologiya interyerini loyihalashda shu hujjatning joriy tahriri asos bo'ladi.",
    target_audience: "Arxitektorlar, tibbiyot muassasalari buyurtmachilari, interyer dizaynerlari",
    application_scope: "Klinika, poliklinika, kasalxona, stomatologiya va boshqa tibbiyot obyektlari",
    status: "AMALDA",
    adopted_date: "2024-10-22",
    effective_date: "2024-11-20",
    issuing_authority: MINISTRY + " (buyruq 01/2-79, 22.10.2024; Adliya vazirligida 20.11.2024 da 315-raqam bilan ro'yxatga olingan)",
    official_source_url: lex(7282249),
    pdf_url: null,
    sources: [lexSrc(7282249, "Joriy tahrir: 30.10.2025 va 25.07.2026 holatiga o'zgartirishlar bilan")],
    new_edition_note: "2025 va 2026-yillarda o'zgartirishlar kiritilgan.",
    change_date: "2026-07-25",
    tags: ["klinika", "tibbiyot", "stomatologiya", "kasalxona", "jamoat binosi"]
  },

  // ---------------- SHAHARSOZLIK ----------------
  {
    document_number: "SHNQ 2.07.01-23",
    title: "Aholi punktlarining hududlarini rivojlantirish va qurishni shaharsozlik jihatidan rejalashtirish",
    document_type: "SHNQ",
    category: "Shaharsozlik",
    content_type: "normative",
    source_type: "lex",
    source_title: "Lex.uz",
    description: "Shahar va qishloqlarni rejalashtirish, turar joy hududlari, ijtimoiy obyektlar, ko'kalamzorlashtirish, transport va avtoturargohlar soni bo'yicha asosiy shaharsozlik normasi.",
    requirements: `• Hisob uchun bir kishiga yashash maydoni kamida 16 m² (61-band).
• Shahardagi turar joy binolari uchun qavatlar umumiy maydonining uchastka maydoniga nisbati 4,5 dan oshmasin (66-band).
• Turar joy zonalari maydoni 1000 aholiga: shahar chetidagi hovli uylar — 20–25 ga, o'rta va ko'p qavatli uylar — 7–8 ga (62-band).
• Avtoturargoh joylari soni shu hujjat bo'yicha hisoblanadi (SHNQ 2.05.07-24 unga havola qiladi).`,
    target_audience: "Shaharsozlar, arxitektorlar, bosh reja loyihachilari, hokimliklar",
    application_scope: "Bosh reja, batafsil rejalashtirish loyihasi, mahalla va turar joy majmualarini joylashtirish",
    status: "AMALDA",
    adopted_date: "2024-05-20",
    effective_date: "2024-06-24",
    issuing_authority: MINISTRY + " (buyruq 01/2-20, 20.05.2024; Adliya vazirligida 24.06.2024 da 261-raqam bilan ro'yxatga olingan)",
    official_source_url: lex(7024185),
    pdf_url: null,
    sources: [
      lexSrc(7024185, "Buyruq 01/2-20 va ShNQ to'liq matni"),
      { title: "O'zgartirish: buyruq 01/2-42, 09.12.2025", type: "lex", url: lex(7954120), note: "SHNQ 2.07.01-23 ga o'zgartirish va qo'shimchalar" }
    ],
    old_edition_note: "SHNQ 2.07.01-03* o'rniga qabul qilingan (u 24.06.2024 dan kuchini yo'qotgan).",
    new_edition_note: "2025-yil 9-dekabrdagi 01/2-42-son buyruq bilan o'zgartirishlar kiritilgan.",
    change_date: "2025-12-09",
    tags: ["shaharsozlik", "bosh reja", "mahalla", "turar joy hududi", "avtoturargoh", "ko'kalamzorlashtirish"]
  },
  {
    document_number: "SHNQ 2.07.01-03*",
    title: "Shaharsozlik. Shahar va qishloq aholi punktlari hududlarini rivojlantirish va qurilishini rejalashtirish (eski tahrir)",
    document_type: "SHNQ",
    category: "Shaharsozlik",
    content_type: "normative",
    source_type: "lex",
    source_title: "Lex.uz",
    description: "Ko'p yillar asosiy shaharsozlik normasi bo'lgan hujjat. Hozir kuchini yo'qotgan.",
    requirements: "Yangi loyihalarda qo'llanmaydi. Amaldagi talablar: SHNQ 2.07.01-23.",
    target_audience: "Ekspertlar, eski loyihalarni tekshiruvchilar",
    application_scope: "Faqat tarixiy ma'lumot",
    status: "KUCHINI YO‘QOTGAN",
    adopted_date: "2009-12-23",
    repealed_date: "2024-06-24",
    issuing_authority: "Davlat arxitektura va qurilish qo'mitasi",
    official_source_url: lex(4444163),
    pdf_url: null,
    sources: [lexSrc(4444163, "Lex.uz: «Hujjat kuchini yo'qotgan 24.06.2024»")],
    old_edition_note: "DIQQAT: 01/2-20-son buyruq (20.05.2024) bilan SHNQ 2.07.01-23 tasdiqlanishi munosabati bilan 24.06.2024 dan kuchini yo'qotgan.",
    new_edition_note: "O'rniga: SHNQ 2.07.01-23.",
    change_date: "2024-06-24",
    tags: ["shaharsozlik", "eski tahrir", "kuchini yo'qotgan"]
  },
  {
    document_number: "SHNQ 2.07.02-24",
    title: "Qurilish obyektlarini nogironligi bo'lgan va hayot faoliyati cheklangan shaxslar hamda keksalar ehtiyojini inobatga olgan holda loyihalashtirish",
    document_type: "SHNQ",
    category: "Inklyuziv muhit",
    content_type: "normative",
    source_type: "lex",
    source_title: "Lex.uz",
    description: "Bino va hududlarni nogironligi bo'lgan, harakatlanishi cheklangan shaxslar va keksalar uchun qulay (to'siqsiz) qilib loyihalash talablari: pandus, eshik, ostona, yo'lak, sanuzel, tutqichlar, taktil yo'laklar.",
    requirements: `• Pandus bo'ylama qiyaligi ko'pi bilan 1:12,5 (8%), ko'ndalang qiyalik 1:50; bir marshning ko'tarilishi 0,8 m dan oshmasin (42-band).
• Pandus eni kamida 1,0 m (42-band); maydonchalar uzunligi kamida 1,5 m, burilishda eni kamida 1,5 m (44-band).
• Eshik toza eni: 15 kishigacha xona — kamida 0,9 m; o'tish joylari — 1,5 m (87-band); surma eshik — 1,2 m (111-band).
• Ostona balandligi 0,014 m (14 mm) dan oshmasin (58-band).
• Aravachada burilish uchun diametri kamida 1,5 m bo'sh joy (110-band).
• Yotoqxona yonidagi moslashtirilgan sanuzel kamida 2,2 × 2,2 m (118-band).
• Tutqichlar balandligi 0,7–0,9 m (bolalar muassasalarida 0,5 m ham) (35, 43-band).
• Ichki yo'laklar eni kamida 1,5 m; piyoda yo'laklari turar joy hududida 2,0 m, gavjum joylarda 2,4 m (16, 19-band).
• Mehmonxona xonalarining 5–8% i aravachadagilar uchun (115-band).`,
    target_audience: "Arxitektorlar, interyer dizaynerlari, obodonlashtirish loyihachilari, ekspertlar",
    application_scope: "Barcha jamoat binolari, turar joy kirishlari, hududlar, kafe va do'konlar, mehmonxonalar",
    status: "AMALDA",
    adopted_date: "2025-01-08",
    effective_date: "2025-01-27",
    issuing_authority: MINISTRY + " (buyruq 01/2-1, 08.01.2025; Adliya vazirligida 27.01.2025 da 331-raqam bilan ro'yxatga olingan)",
    official_source_url: lex(7346244),
    pdf_url: null,
    sources: [lexSrc(7346244, "Buyruq 01/2-1 va ShNQ to'liq matni; 30.05.2025 dagi 01/2-34-son buyruq bilan o'zgartirilgan")],
    practical_example: `Vazifa: kafe kirishida 0,45 m balandlikdagi pog'onalar o'rniga pandus.

Hisob (SHNQ 2.07.02-24, 42-band):
- Maksimal qiyalik 1:12,5 → uzunlik = 0,45 × 12,5 = 5,63 m
- Bir marsh ko'tarilishi 0,8 m dan kam → bitta marsh yetarli
- Eni kamida 1,0 m; boshi va oxirida maydoncha ≥ 1,5 m (44-band)

✅ To'g'ri: 5,7 m uzunlikdagi, 1,2 m enli pandus, ikki tomonda 0,7 va 0,9 m tutqich.
❌ Noto'g'ri: joy tejash uchun 2,5 m li pandus (qiyalik 1:5,5 — aravachada ko'tarilib bo'lmaydi).`,
    old_edition_note: "SHNQ 2.07.02-22 (185-son buyruq, 26.10.2022) o'rniga qabul qilingan.",
    new_edition_note: "2025-yil 30-maydagi 01/2-34-son buyruq bilan o'zgartirish kiritilgan.",
    change_date: "2025-05-30",
    tags: ["inklyuziv", "nogironlar", "pandus", "eshik eni", "ostona", "sanuzel", "tutqich", "to'siqsiz muhit"]
  },
  {
    document_number: "SHNQ 2.05.07-24",
    title: "Avtoturargohlar",
    document_type: "SHNQ",
    category: "Shaharsozlik",
    content_type: "normative",
    source_type: "lex",
    source_title: "Lex.uz",
    description: "Aholi punktlari, tog'li hududlar, suv havzalari yaqini va turistik joylarda avtoturargohlarni (ochiq, yer osti, ko'p qavatli) loyihalash talablari.",
    requirements: "Avtoturargoh joylari soni SHNQ 2.07.01-23 bo'yicha hisoblanadi; nogironlar uchun joylar SHNQ 2.07.01-23 va SHNQ 2.07.02-24 talablariga muvofiq loyihalanadi.",
    target_audience: "Arxitektorlar, bosh reja loyihachilari, ko'chmas mulk quruvchilari",
    application_scope: "Turar joy majmualari, savdo markazlari, ofislar uchun avtoturargohlar",
    status: "AMALDA",
    adopted_date: "2025-01-24",
    effective_date: "2025-02-24",
    issuing_authority: MINISTRY + " (buyruq 01/2-6, 24.01.2025; Adliya vazirligida 24.02.2025 da 335-raqam bilan ro'yxatga olingan)",
    official_source_url: lex(7396504),
    pdf_url: null,
    sources: [lexSrc(7396504, "Joriy tahrir: 11.08.2026 dagi 01/2-32-son buyruq bilan o'zgartirilgan")],
    new_edition_note: "2026-yilda o'zgartirishlar kiritilgan (01/2-32-son buyruq).",
    change_date: "2026-08-11",
    tags: ["avtoturargoh", "parking", "shaharsozlik"]
  },

  // ---------------- YORITISH, ENERGIYA, MUHANDISLIK ----------------
  {
    document_number: "SHNQ 2.01.05-24",
    title: "Tabiiy va sun'iy yoritish",
    document_type: "SHNQ",
    category: "Yoritish",
    content_type: "normative",
    source_type: "lex",
    source_title: "Lex.uz",
    description: "Turar joy, jamoat va sanoat binolari xonalarining tabiiy yoritilganlik koeffitsienti (TYOK/KEO) va sun'iy yoritilganlik (lyuks) me'yorlari. Interyer yoritish loyihasining asosiy hujjati.",
    requirements: `• Turar joy va jamoat binolari xonalari uchun yoritilganlik 1-ilova, 2-jadvalda ko'rish ishining aniqlik toifasi (A, B, V, G, D, E, J) bo'yicha beriladi. Masalan: A1 — 500 lk, B1 — 300 lk, B2 — 200 lk, V1 — 150 lk, V2 — 100 lk, J1 — 75 lk, J2 — 50 lk.
• Tabiiy yoritilganlikning me'yoriy qiymati e = eₙ · m formula bilan aniqlanadi, natija bir xona aniqlikkacha yaxlitlanadi (18-band).
• Yorug'lik iqlimi koeffitsienti m deraza yo'nalishiga bog'liq (1-jadval): shimol, shimoli-sharq, shimoli-g'arb — 0,7; g'arb, janubi-g'arb, sharq, janubi-sharq — 0,65.
• Asosiy yashash xonalarida TYOK me'yori pol sathida ta'minlanishi kerak (19-band).`,
    target_audience: "Interyer dizaynerlari, yoritish loyihachilari, arxitektorlar, elektriklar",
    application_scope: "Xonalarni yoritish loyihasi, deraza o'lchamini tekshirish, ofis va o'quv xonalari yoritilishi",
    status: "AMALDA",
    adopted_date: "2024-09-26",
    effective_date: "2024-10-25",
    issuing_authority: MINISTRY + " (buyruq 1/2-68, 26.09.2024; Adliya vazirligida 25.10.2024 da 309-raqam bilan ro'yxatga olingan)",
    official_source_url: lex(7218587),
    pdf_url: null,
    sources: [lexSrc(7218587, "Buyruq 1/2-68 va ShNQ to'liq matni; xonalar bo'yicha qiymatlar 1 va 10-ilovalarda")],
    practical_example: `Vazifa: shimolga qaragan derazali xonada tabiiy yoritilganlikni hisoblash.

Formula (18-band): e = eₙ · m
- m = 0,7 (shimol, 1-jadval)
- eₙ — xona turiga qarab 1-ilovadan olinadi
- Natija bir xona aniqlikkacha yaxlitlanadi

✅ To'g'ri: avval xona turini va ko'rish ishining toifasini aniqlash, keyin 2-jadvaldan lyuks qiymatini olish.
❌ Noto'g'ri: hamma xonaga bir xil «300 lk» qo'yish — koridor va yashash xonasi uchun me'yor turlicha.`,
    old_edition_note: "QMQ 2.01.05-19 «Tabiiy va sun'iy yoritish» (561-son buyruq, 23.12.2019) o'rniga qabul qilingan.",
    new_edition_note: "Amaldagi tahrir.",
    change_date: "2024-10-25",
    tags: ["yoritish", "lyuks", "KEO", "TYOK", "deraza", "interyer", "chiroq"]
  },
  {
    document_number: "SHNQ 2.01.18-24",
    title: "Binolar va inshootlarni isitish, shamollatish va konditsiyalashtirish uchun energiya sarfi normalari",
    document_type: "SHNQ",
    category: "Muhandislik tizimlari",
    content_type: "normative",
    source_type: "lex",
    source_title: "Lex.uz",
    description: "Bino va inshootlarni loyihalashda isitish, shamollatish va konditsiyalash uchun ruxsat etilgan energiya sarfi me'yorlari (energiya samaradorligi).",
    requirements: "Binoning issiqlik himoyasi va HVAC tizimlari loyihasi shu hujjatdagi solishtirma energiya sarfi me'yorlaridan oshmasligi kerak. Noyob tajribaviy, vaqtinchalik va ko'chma binolarga qo'llanmaydi.",
    target_audience: "Arxitektorlar, HVAC muhandislari, energiya auditorlari",
    application_scope: "Yangi bino loyihasi, isitish-shamollatish tizimini tanlash, energiya samaradorligini tekshirish",
    status: "AMALDA",
    adopted_date: "2025-01-14",
    effective_date: "2025-01-27",
    issuing_authority: MINISTRY + " (buyruq 01/2-4, 14.01.2025; Adliya vazirligida 27.01.2025 da 330-raqam bilan ro'yxatga olingan)",
    official_source_url: lex(7340715),
    pdf_url: null,
    sources: [lexSrc(7340715, "Buyruq 01/2-4 va ShNQ to'liq matni")],
    old_edition_note: "QMQ 2.01.18-2018 (311-son buyruq, 07.12.2018) o'rniga qabul qilingan.",
    new_edition_note: "Amaldagi tahrir. Isitish, ventilyatsiya va konditsiyalash tizimlarining o'zi SHNQ 2.04.05-22 bo'yicha loyihalanadi (boshqa amaldagi ShNQ larda shunday havola qilinadi).",
    change_date: "2025-01-27",
    tags: ["energiya", "isitish", "shamollatish", "konditsioner", "HVAC", "energiya samaradorligi"]
  },
  {
    document_number: "SHNQ 2.04.01-22",
    title: "Binolarning ichki suv ta'minoti va oqova suvlarni chiqarib yuborish",
    document_type: "SHNQ",
    category: "Muhandislik tizimlari",
    content_type: "normative",
    source_type: "lex",
    source_title: "Lex.uz",
    description: "Binolarning ichki sovuq va issiq suv ta'minoti, kanalizatsiya, ichki yong'inga qarshi suv quvuri tizimlarini loyihalash talablari.",
    requirements: `• Suv olish nuqtalarida issiq suv harorati kamida 50 °C, ko'pi bilan 75 °C (15-band).
• Bog'cha, maktab va bolalar muassasalarida dush va qo'l yuvgichlarda issiq suv 37 °C dan oshmasin (16-band).
• Sanitariya jihozlari oldida issiq suv bosimi 0,6 MPa dan oshmasin (75-band).
• Yong'in krani va jo'mragi poldan 1,35 m balandlikda o'rnatiladi (101-band).
• Bino ichidagi quvurlarda suv tezligi 3 m/s dan oshmasin (sprinkler tizimlarida — 10 m/s) (118-band).`,
    target_audience: "Santexnika muhandislari, arxitektorlar, interyer dizaynerlari (sanuzel va oshxona joylashuvi uchun)",
    application_scope: "Turar joy va jamoat binolarining ichki suv va kanalizatsiya tizimlari",
    status: "AMALDA",
    adopted_date: "2024-08-22",
    effective_date: "2024-10-02",
    issuing_authority: MINISTRY + " (buyruq 01/2-59, 22.08.2024; Adliya vazirligida 02.10.2024 da 299-raqam bilan ro'yxatga olingan)",
    official_source_url: lex(7244052),
    pdf_url: null,
    sources: [lexSrc(7244052, "Buyruq 01/2-59 va ShNQ to'liq matni")],
    old_edition_note: "QMQ 2.04.01-98 «Binolar ichki vodoprovodi va kanalizatsiyasi» (2006-yilgi o'zgartirishlari bilan) o'rniga qabul qilingan.",
    new_edition_note: "Amaldagi tahrir.",
    change_date: "2024-10-02",
    tags: ["suv ta'minoti", "kanalizatsiya", "santexnika", "issiq suv", "sanuzel", "yong'in krani"]
  },
  {
    document_number: "QMQ 2.04.01-98",
    title: "Binolar ichki vodoprovodi va kanalizatsiyasi (eski tahrir)",
    document_type: "QMQ",
    category: "Muhandislik tizimlari",
    content_type: "normative",
    source_type: "lex",
    source_title: "Lex.uz",
    description: "1998-yildan 2024-yilgacha amalda bo'lgan ichki suv quvuri va kanalizatsiya normasi. Hozir kuchini yo'qotgan.",
    requirements: "Yangi loyihalarda qo'llanmaydi. Amaldagi talablar: SHNQ 2.04.01-22.",
    target_audience: "Ekspertlar, eski loyihalarni tekshiruvchilar",
    application_scope: "Faqat tarixiy ma'lumot",
    status: "KUCHINI YO‘QOTGAN",
    adopted_date: "1998-01-07",
    repealed_date: "2024-10-02",
    issuing_authority: "Davlat arxitektura va qurilish qo'mitasi (buyruq 2-son, 07.01.1998)",
    official_source_url: lex(7244052),
    pdf_url: null,
    sources: [lexSrc(7244052, "SHNQ 2.04.01-22 ni tasdiqlagan buyruq — QMQ 2.04.01-98 ni kuchini yo'qotgan deb topgan")],
    old_edition_note: "DIQQAT: 01/2-59-son buyruq (22.08.2024) bilan kuchini yo'qotgan deb topilgan (02.10.2024 dan).",
    new_edition_note: "O'rniga: SHNQ 2.04.01-22.",
    change_date: "2024-10-02",
    tags: ["suv ta'minoti", "kanalizatsiya", "eski tahrir", "kuchini yo'qotgan"]
  },

  // ---------------- XAVFSIZLIK VA KONSTRUKSIYA ----------------
  {
    document_number: "SHNQ 2.01.02-04",
    title: "Bino va inshootlarning yong'in xavfsizligi",
    document_type: "SHNQ",
    category: "Yong‘in xavfsizligi",
    content_type: "normative",
    source_type: "lex",
    source_title: "Lex.uz",
    description: "Bino va inshootlarning yong'in xavfsizligi bo'yicha asosiy norma: olovbardoshlik darajasi, yong'in bo'linmalari, evakuatsiya yo'llari, tutunsiz zonalar, pardozlash materiallarining yonuvchanligi. Boshqa ShNQ lar (masalan SHNQ 2.08.02-23) bino balandligi va yong'in sinfini shu hujjatga bog'laydi.",
    requirements: `• 2026-yil 18-martdagi qo'shimcha (6.191-band): yonuvchanlik sinfi YO1–YO4 bo'lgan materiallarni quyidagilarda qo'llash cheklanadi:
  – balandligi 28 m gacha binolar fasadida — YO2–YO4;
  – 28 m va undan baland binolar fasadida — YO1–YO4;
  – ta'lim va tibbiyot muassasalari fasadida (balandlikdan qat'i nazar) — YO1–YO4;
  – barcha binolarda evakuatsiya yo'llari, vestibyul, zinapoya kataklari, lift hollari, yo'laklar, foye, podval devor va shiftlarida hamda osma shiftlarda — YO1–YO4.`,
    target_audience: "Arxitektorlar, interyer dizaynerlari (pardozlash materiali tanlashda), yong'in xavfsizligi mutaxassislari",
    application_scope: "Barcha bino va inshootlar; fasad va interyer pardozlash materiallarini tanlash",
    status: "AMALDA",
    adopted_date: null,
    effective_date: null,
    issuing_authority: "Davlat arxitektura va qurilish qo'mitasi; qo'shimcha — " + MINISTRY + " (buyruq 01/2-11, 18.03.2026; Adliya vazirligida 27.03.2026 da 391-raqam bilan ro'yxatga olingan)",
    official_source_url: lex(4440792),
    pdf_url: null,
    sources: [
      lexSrc(4440792, "ShNQ 2.01.02-04 asosiy matni"),
      { title: "Qo'shimcha: buyruq 01/2-11, 18.03.2026", type: "lex", url: lex(8107278), note: "6.191-band — fasad va interyer materiallarining yonuvchanligi" }
    ],
    practical_example: `Vazifa: ofis binosi koridori va lift holli uchun pardozlash materiali tanlash.

Normativ talab (SHNQ 2.01.02-04, 6.191-band, 2026-yil qo'shimchasi):
- Evakuatsiya yo'llari, lift hollari, yo'laklar devor va shiftlarida hamda osma shiftlarda YO1–YO4 yonuvchanlik sinfidagi materiallar cheklangan.

✅ To'g'ri: yonmaydigan (YoM) materiallar — gipsli suvoq, mineral plitali osma shift, keramogranit.
❌ Noto'g'ri: koridor devorini yog'och reyka, MDF panel yoki yonuvchan plastik panel bilan qoplash.`,
    new_edition_note: "2026-yil 18-martdagi 01/2-11-son buyruq bilan 6.191-band qo'shilgan.",
    change_date: "2026-03-18",
    tags: ["yong'in xavfsizligi", "evakuatsiya", "yonuvchanlik", "pardozlash", "fasad", "osma shift", "interyer"]
  },
  {
    document_number: "QMQ 2.01.03-19",
    title: "Seysmik hududlarda qurilish",
    document_type: "QMQ",
    category: "Konstruksiya",
    content_type: "normative",
    source_type: "ministry",
    source_title: "Qurilish vazirligi (rasmiy nashr)",
    description: "Hisobiy seysmikligi 7, 8, 9 va undan yuqori ball bo'lgan maydonlarda bino va inshootlarni qurish, rekonstruksiya qilish, kuchaytirish va tiklash loyihalariga qo'yiladigan talablar.",
    requirements: `• Hisobiy seysmiklik 7, 8, 9 va undan ortiq ball bo'lgan maydonlarda qo'llanadi (1.1-band).
• Qurilish maydonining seysmikligi muhandislik-geologik izlanishlar tarkibidagi seysmik mikrohududlashtirish asosida aniqlanadi (SHNQ 1.02.09-21 talabi).
• Amaldagi boshqa ShNQ lar (SHNQ 2.08.01-24 ning 2026-yilgi tahriri, SHNQ 1.04.01-23, SHNQ 2.07.07-24) konstruktiv hisobni shu hujjatga muvofiq bajarishni talab qiladi.`,
    target_audience: "Konstruktor muhandislar, bosh loyihachilar, arxitektorlar",
    application_scope: "Barcha bino va inshootlarning yuk ko'taruvchi konstruksiyalarini loyihalash",
    status: "AMALDA",
    adopted_date: null,
    issuing_authority: "O'zbekiston Respublikasi Qurilish vazirligi (rasmiy nashr, Toshkent, 2019)",
    official_source_url: null,
    pdf_url: null,
    sources: [
      { title: "Rasmiy nashr nusxasi (rus tilida), 111 bet", type: "ministry", url: "http://lib.tiet.uz/file/20240219072553.pdf", note: "Muqovada: «Издание официальное. Министерство строительства РУз, Ташкент 2019»" },
      { title: "SHNQ 1.02.09-21 (unda QMQ 2.01.03-19 ga havola)", type: "lex", url: lex(7206078), note: "Amaldagi normada havola qilinishi — hujjat amalda ekanini ko'rsatadi" }
    ],
    old_edition_note: "KMK 2.01.03-96 o'rniga qabul qilingan.",
    new_edition_note: "Amaldagi tahrir. Adabiyotlarda «QMQ» va «ShNQ» belgilari, «Zilzilaviy hududlarda qurilish» nomi ham uchraydi — bu bitta hujjat.",
    tags: ["seysmik", "zilzila", "konstruksiya", "karkas", "poydevor"]
  },
  {
    document_number: "SHNQ 2.02.01-24",
    title: "Bino va inshootlarning zaminlari",
    document_type: "SHNQ",
    category: "Konstruksiya",
    content_type: "normative",
    source_type: "lex",
    source_title: "Lex.uz",
    description: "Yangi qurilayotgan va rekonstruksiya qilinayotgan bino va inshootlarning zaminlarini (poydevor ostidagi grunt) loyihalash talablari.",
    requirements: "Gidrotexnik va transport inshootlari, dinamik yukli mashina poydevorlari va chuqur poydevorlarga qo'llanmaydi. Poydevor turi va o'lchami muhandislik-geologik izlanish natijalari asosida tanlanadi.",
    target_audience: "Konstruktorlar, geotexniklar, bosh loyihachilar",
    application_scope: "Poydevor va zaminlarni loyihalash",
    status: "AMALDA",
    adopted_date: "2025-02-26",
    effective_date: "2025-04-09",
    issuing_authority: MINISTRY + " (buyruq 01/2-15, 26.02.2025; Adliya vazirligida 09.04.2025 da 341-raqam bilan ro'yxatga olingan)",
    official_source_url: lex(7480344),
    pdf_url: null,
    sources: [lexSrc(7480344, "Buyruq 01/2-15 va ShNQ to'liq matni")],
    old_edition_note: "SHNQ 2.02.01-19 «Bino va inshootlar asoslari» (8-son buyruq, 07.01.2020) o'rniga qabul qilingan.",
    new_edition_note: "Amaldagi tahrir.",
    change_date: "2025-04-09",
    tags: ["zamin", "poydevor", "grunt", "konstruksiya"]
  },

  // ---------------- TASHKILIY VA LOYIHA HUJJATLARI ----------------
  {
    document_number: "SHNQ 1.04.03-23",
    title: "Bino va inshootlarni qurish, rekonstruksiya qilish, ta'mirlash va ularga texnik xizmat ko'rsatishni tashkil etish",
    document_type: "SHNQ",
    category: "Ta'mirlash va qayta rejalashtirish",
    content_type: "normative",
    source_type: "lex",
    source_title: "Lex.uz",
    description: "Turar joy, fuqaro va sanoat binolarini qurish, rekonstruksiya qilish, mukammal va joriy ta'mirlash hamda texnik xizmat ko'rsatishni tashkil etish talablari.",
    requirements: "Ta'mirlash turlari (joriy, mukammal), rekonstruksiya va texnik xizmat ko'rsatish tartibi. Ko'p xonadonli uylarda xonalarni qayta uskunalash bo'yicha eski ShNQ 1.04.05-20 ham shu hujjat bilan bekor qilingan.",
    target_audience: "Quruvchi-pudratchilar, ta'mirlash tashkilotlari, uy-joy mulkdorlari shirkatlari",
    application_scope: "Qurilish va ta'mirlash ishlarini tashkil etish, binolarga texnik xizmat",
    status: "AMALDA",
    adopted_date: "2024-01-18",
    effective_date: "2024-02-07",
    issuing_authority: MINISTRY + " (buyruq 14-son, 18.01.2024; Adliya vazirligida 07.02.2024 da 232-raqam bilan ro'yxatga olingan)",
    official_source_url: lex(6793117),
    pdf_url: null,
    sources: [lexSrc(6793117, "Buyruq 14-son va ShNQ to'liq matni")],
    old_edition_note: "Kuchini yo'qotgan deb topilganlar: SHNQ 1.04.03-05, QMQ 3.01.08-99 va SHNQ 1.04.05-20 («Ko'p xonadonli uylarda xonalarni rekonstruksiya qilish, o'zgartirish va qayta uskunalash bo'yicha binolar xavfsizligini ta'minlash qoidalari»).",
    new_edition_note: "Amaldagi tahrir.",
    change_date: "2024-02-07",
    tags: ["ta'mirlash", "rekonstruksiya", "texnik xizmat", "qurilishni tashkil etish"]
  },
  {
    document_number: "SHNQ 1.04.01-23",
    title: "Bino va inshootlarning texnik holatini o'rganish va monitoring qilish tartibi",
    document_type: "SHNQ",
    category: "Ta'mirlash va qayta rejalashtirish",
    content_type: "normative",
    source_type: "lex",
    source_title: "Lex.uz",
    description: "Mavjud bino va inshootlarning texnik holatini tekshirish (obsledovaniye) va monitoring qilish tartibi. Qayta rejalashtirish yoki rekonstruksiyadan oldin binoni tekshirish shu hujjat bo'yicha bajariladi.",
    requirements: "Seysmik hududlarda foydalanilayotgan bino va inshootlarning konstruktiv hisobi QMQ 2.01.03-19 ga muvofiq bajariladi.",
    target_audience: "Konstruktorlar, ekspertlar, rekonstruksiya loyihachilari",
    application_scope: "Rekonstruksiya va qayta rejalashtirishdan oldingi texnik tekshiruv",
    status: "AMALDA",
    adopted_date: "2024-05-16",
    issuing_authority: MINISTRY + " (buyruq 01/2-19, 16.05.2024)",
    official_source_url: lex(6998488),
    pdf_url: null,
    sources: [lexSrc(6998488, "Buyruq 01/2-19 va ShNQ to'liq matni")],
    tags: ["texnik holat", "monitoring", "obsledovaniye", "rekonstruksiya"]
  },
  {
    document_number: "ShNQ 1.03.04-22",
    title: "Namunaviy loyiha hujjatlari",
    document_type: "SHNQ",
    category: "Loyiha hujjatlari",
    content_type: "normative",
    source_type: "ministry",
    source_title: "Qurilish vazirligi (mc.uz)",
    description: "Fuqaroviy, turar joy va ishlab chiqarish bino va inshootlari uchun namunaviy loyiha hujjatlarini ishlab chiqish, kelishish, tasdiqlash va qo'llash tartibi.",
    requirements: `• Namunaviy loyiha hujjatlari ushbu ShNQ, GOST 21.101-97, GOST 21.114-95, GOST 21.501-93, GOST 2.105-95 talablariga muvofiq ishlab chiqiladi (7-band).
• Har bir namunaviy loyihaga xos raqam beriladi; loyiha bosh muhandisi (bosh arxitektori) tayinlanadi (8–9-band).
• I–II xavf-xatar toifasidagi obyektlar — bir bosqichda (ishchi loyiha); III–IV toifadagilar — ikki bosqichda (10-band).`,
    target_audience: "Loyiha tashkilotlari, bosh arxitektorlar (GAP), bosh muhandislar (GIP)",
    application_scope: "Namunaviy loyihalarni ishlab chiqish va qo'llash",
    status: "AMALDA",
    adopted_date: "2022-04-19",
    effective_date: "2022-04-25",
    issuing_authority: "O'zbekiston Respublikasi Qurilish vazirligi (buyruq 69-son, 19.04.2022; Adliya vazirligida 25.04.2022 da 78-raqam bilan ro'yxatga olingan)",
    official_source_url: null,
    pdf_url: "https://mc.uz/uploads/mcuz_99811688333360.pdf",
    sources: [{ title: "mc.uz — rasmiy PDF (13 bet)", type: "ministry", url: "https://mc.uz/uploads/mcuz_99811688333360.pdf", note: "Buyruq va ShNQ to'liq matni" }],
    tags: ["loyiha hujjatlari", "namunaviy loyiha", "GOST 21.101", "bosqichlar"]
  }
];

// Ilgari bazaga noto'g'ri raqam yoki tekshirilmagan ma'lumot bilan tushgan hujjatlar.
// Satr o'chirilmaydi — raqami amaldagi hujjatga almashtiriladi (like/saqlashlar saqlanib qoladi),
// so'ng yuqoridagi to'g'ri ma'lumot bilan yangilanadi. Faqat tizim seedi va admin tahrir qilmagan satrlarga tegadi.
const NORMATIVE_RENAMES = {
  "SHNQ 2.08.02-19": "SHNQ 2.08.02-23",
  "SHNQ 2.01.18-23": "SHNQ 2.07.02-24",
  "QMQ 2.04.05-18": "SHNQ 2.01.18-24",
  "SHNQ 1.04.03-20": "SHNQ 1.04.03-23",
  "VMQ-370": "SHNQ 2.08.04-22",
  "VMQ-200": "ShNQ 1.04.02-22",
  "SHNQ 2.08.03-12": "SHNQ 2.08.06-23",
  "SHNQ 2.08.06-18": "SHNQ 2.08.05-23",
  "O'z DSt 3524:2021": "SHNQ 2.01.05-24"
};

// ======================================================
// ME'YORIY MA'LUMOTNOMA (topics) — tekshiruv
// ======================================================
// Rasmiy matndan so'zma-so'z tekshirilgan qiymatlar: title -> tuzatish
const TOPIC_VERIFIED_FIXES = {
  "1 xonali kvartirada umumiy yashash xonasi minimal maydoni": { normative_value: "14", unit: "m²", source_document_number: "SHNQ 2.08.01-24", source_band: "35-band" },
  "Ko'p xonali kvartirada umumiy mehmonxona (zal) minimal maydoni": { normative_value: "16", unit: "m²", source_document_number: "SHNQ 2.08.01-24", source_band: "35-band" },
  "2 va undan ortiq xonali kvartirada asosiy yotoqxona minimal maydoni": { normative_value: "12 (2 kishilik)", unit: "m²", source_document_number: "SHNQ 2.08.01-24", source_band: "35-band", condition: "Yotoqxona kamida 8 m², ikki kishilik yotoqxona kamida 12 m². Yotoqxona eni kamida 2,4 m (36-band)." },
  "1 kishilik ikkinchi yotoqxona (bolalar xonasi) minimal maydoni": { normative_value: "8", unit: "m²", source_document_number: "SHNQ 2.08.01-24", source_band: "35-band", condition: "Bir kishilik yotoqxona kamida 8 m², eni kamida 2,4 m (36-band)." },
  "Alohida oshxona xonasi minimal maydoni": { normative_value: "8 (2+ xonali kvartirada)", unit: "m²", source_document_number: "SHNQ 2.08.01-24", source_band: "35, 39-band", condition: "Oshxona kamida 6 m², ikki va undan ortiq xonali kvartiralarda kamida 8 m². Eni: jihozlar bir tomonda — 1,7 m, ikki tomonda — 2,2 m (39-band)." },
  "Oshxona-nisha (kuhnya-nisha) minimal maydoni va kengligi": { normative_value: "5", unit: "m²", source_document_number: "SHNQ 2.08.01-24", source_band: "35-band", condition: "Bir xonali kvartirada kamida 5 m² oshxona yoki oshxona-nisha ruxsat etiladi." },
  "Kvartira ichki koridori minimal kengligi": { normative_value: "1.1", unit: "m", source_document_number: "SHNQ 2.08.01-24", source_band: "40-band", condition: "Dahliz eni kamida 1,4 m; yashash xonalariga olib boradigan ichki yo'laklar — 1,1 m; yordamchi xonalarga — 0,9 m." },
  "Turar joy xonalarida toza pol sathidan shiftgacha minimal balandlik": { normative_value: "2.7", unit: "m", source_document_number: "SHNQ 2.08.01-24", source_band: "38-band", condition: "Yashash xonalari va oshxonalar balandligi poldan shiftgacha kamida 2,7 m; yordamchi xonalar — kamida 2,4 m." },
  "1 xonali kvartiraning umumiy minimal maydoni": { normative_value: "28", unit: "m²", source_document_number: "SHNQ 2.08.01-24", source_band: "34-band, 1-jadval" },
  "2 xonali kvartiraning umumiy minimal maydoni": { normative_value: "48", unit: "m²", source_document_number: "SHNQ 2.08.01-24", source_band: "34-band, 1-jadval", condition: "Me'yoriy maydonga yashash va yordamchi xonalar kiradi; yozgi xonalar va isitilmaydigan xo'jalik xonalari kirmaydi." },
  "3 xonali kvartiraning umumiy minimal maydoni": { normative_value: "64", unit: "m²", source_document_number: "SHNQ 2.08.01-24", source_band: "34-band, 1-jadval", condition: "4 xonali — 80 m², 5 xonali — 96 m², 6 xonali — 114 m²." },
  "Birlashgan sanuzel (vanna + unitaz + rakovina) minimal maydoni": { normative_value: "4.0", unit: "m²", source_document_number: "SHNQ 2.08.01-24", source_band: "35, 43-band", condition: "Sanitariya xonasi (vannaxona va hojatxona) kamida 4 m²; birlashtirilgan sanuzel eni kamida 2,2 m (43-band). Bir xonali kvartiralarda birlashtirilgan sanuzel ruxsat etiladi (44-band)." },
  "Turar joy binosi zinapoya marshining minimal toza kengligi": { normative_value: "1.05", unit: "m", source_document_number: "SHNQ 2.08.01-24", source_band: "178–179-band, 8-jadval", condition: "2 va undan ortiq qavatli seksiyali binolarda — 1,05 m; koridorli binolarda — 1,2 m; podval va kvartira ichidagi zinapoyalar — 0,9 m." },
  "Yakka tartibdagi hovli va kottejlar ichki zinapoyasining minimal kengligi": { normative_value: "0.9", unit: "m", source_document_number: "SHNQ 2.08.01-24", source_band: "8-jadval", condition: "Kvartira ichidagi va podvalga tushadigan zinapoyalar uchun marsh eni 0,9 m, qiyaligi 1:1,25 gacha." },
  "Bitta zinapoya marshidagi pog'onalar sonining minimal va maksimal chegarasi": { normative_value: "3 – 18", unit: "dona pog'ona", source_document_number: "SHNQ 2.08.01-24", source_band: "178-band" },
  "Panoramali polgacha (Fransuzcha) derazalarda majburiy himoya to'sig'i": { normative_value: "1.2", unit: "m", source_document_number: "SHNQ 2.08.01-24", source_band: "208-band", condition: "Balkon yoki lodjiyaga chiqmaydigan panoramali derazalarda qo'shimcha to'siq kamida 1,2 m." },
  "Kvartiralarda ho'l nuqtalarni (sanuzel va vanna) ko'chirish bo'yicha qonuniy taqiq": { source_document_number: "ShNQ 1.04.02-22", source_band: "29–30-band", condition: "Hojatxona va vannaxonani yashash xonasi yoki oshxona ustiga joylashtirish mumkin emas (ikki sathli kvartiradan tashqari) — 30-band. Gazli oshxona va vannaxonani yashash xonasi ustiga yoki ostiga joylashtirish mumkin emas — 29-band." }
};

// Noto'g'ri yoki tekshirib bo'lmaydigan hujjat raqamlari -> amaldagi hujjat (faqat havola uchun)
const TOPIC_DOC_REMAP = {
  "SHNQ 2.08.02-19": "SHNQ 2.08.02-23",
  "SHNQ 2.01.18-23": "SHNQ 2.07.02-24",
  "QMQ 2.04.01-98": "SHNQ 2.04.01-22",
  "QMQ 2.01.05-19": "SHNQ 2.01.05-24",
  "SHNQ 2.07.01-03*": "SHNQ 2.07.01-23",
  "QMQ 2.04.05-18": "SHNQ 2.04.05-22",
  "SHNQ 2.08.03-12": "SHNQ 2.08.02-23",
  "SHNQ 2.08.06-18": "SHNQ 2.08.02-23"
};

const UNVERIFIED_NOTE = "⚠️ Bu qiymat rasmiy normativ bandi bilan so'zma-so'z tekshirilmagan — amaliy (ergonomik) tavsiya sifatida foydalaning. Majburiy talabni lex.uz dagi hujjat matnidan tekshiring.";

// Seeddan oldin mavzularni tekshiruv natijasiga moslaydi:
//  1) so'zma-so'z tekshirilgan mavzular — qiymati va band raqami tuzatiladi, "norma" bo'lib qoladi;
//  2) qolganlari — "tavsiya" ga o'tkaziladi, band raqami olib tashlanadi, ogohlantirish qo'shiladi;
//  3) eski / noto'g'ri hujjat raqamlari amaldagisiga almashtiriladi.
function applyTopicVerification(topics) {
  return (topics || []).map(function (t) {
    const out = Object.assign({}, t);
    const fix = TOPIC_VERIFIED_FIXES[String(t.title || "").trim()];
    if (fix) {
      Object.assign(out, fix);
      out.data_type = "norma";
      out.source_type = "lex";
      out.source_title = "Lex.uz";
      return out;
    }
    if (out.source_document_number && TOPIC_DOC_REMAP[out.source_document_number]) {
      out.source_document_number = TOPIC_DOC_REMAP[out.source_document_number];
    }
    if ((out.data_type || "").toLowerCase() === "norma") out.data_type = "tavsiya";
    out.source_band = "";
    out.source_table = "";
    if (out.practical_note && out.practical_note.indexOf("⚠️ Bu qiymat") === -1) out.practical_note = out.practical_note + "\n\n" + UNVERIFIED_NOTE;
    else if (!out.practical_note) out.practical_note = UNVERIFIED_NOTE;
    return out;
  });
}

module.exports = { VERIFIED_NORMATIVES, NORMATIVE_RENAMES, TOPIC_VERIFIED_FIXES, applyTopicVerification };
