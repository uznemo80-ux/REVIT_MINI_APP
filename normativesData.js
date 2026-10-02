// ======================================================
// YOSHUZBEKK Academy — Normatives & Practical Solutions
// Schema, Database Migrations, Seeding & API Service
// ======================================================

const SEED_NORMATIVES = [
  // 1. Turar joy obyektlari loyihalash
  {
    document_number: "SHNQ 2.08.01-24",
    title: "Turar joy binolari. Loyihalashtirish me'yorlari",
    document_type: "SHNQ",
    category: "Loyihalash",
    description: "Yakka tartibdagi va ko'p xonadonli turar joy binolarini loyihalash, xonalar o'lchamlari, balandliklari, yoritilishi va muhandislik jihozlariga qo'yiladigan asosiy davlat shaharsozlik talablari.",
    requirements: "Turar joy xonalarining balandligi toza pol sathidan shiftgacha kamida 2.5 m (turar joy qavatlarida) bo'lishi shart. Bitta xonali kvartiralar maydoni kamida 28 kv.m, 2 xonali kamida 44 kv.m. Oshxona kengligi kamida 1.9 m, maydoni kamida 8 kv.m (alohida oshxona uchun). Xonalarda tabiiy yorug'lik KEO koeffitsienti me'yorlariga javob berishi zarur.",
    target_audience: "Arxitektorlar, loyihachilar, quruvchi-pudratchilar, buyurtmachilar",
    application_scope: "Yangi turar joy binolarini loyihalash, yakka tartibdagi uylar, ko'p qavatli turar joy majmualari, rekonstruksiya va kapital ta'mirlash",
    status: "AMALDA",
    adopted_date: "2024-08-14",
    effective_date: "2024-09-01",
    issuing_authority: "O'zbekiston Respublikasi Qurilish va uy-joy kommunal xo'jaligi vazirligi",
    official_source_url: "https://lex.uz/docs/7084512",
    pdf_url: "https://lex.uz/uz/search/nat?number=SHNQ%202.08.01-24",
    old_edition_note: "SHNQ 2.08.01-19 o'rniga qabul qilingan. Yangi tahrirda energiya tejamkorlik, ovoz izolyatsiyasi va zamonaviy xonadon rejalashtirish talablari kuchaytirildi.",
    new_edition_note: "2024-yil avgust oyida tasdiqlangan amaldagi bosh tahrir.",
    change_date: "2024-08-14",
    tags: ["turar joy", "uy", "kvartira", "xona o'lchamlari", "shift balandligi", "oshxona", "shnq", "zinapoya", "interyer"]
  },
  {
    document_number: "SHNQ 2.08.01-19",
    title: "Turar joy binolari (2019-yil tahriri)",
    document_type: "SHNQ",
    category: "Loyihalash",
    description: "Turar joy binolari bo'yicha 2019-2024 yillarda amalda bo'lgan shaharsozlik me'yori.",
    requirements: "Turar joy xonalari o'lchamlari va sanitariya-gigiyena talablari.",
    target_audience: "Arxitektorlar, ekspertlar (tarixiy tahlil uchun)",
    application_scope: "2024-yil sentyabrgacha loyihalangan va qurilgan binolar",
    status: "KUCHINI YO‘QOTGAN",
    adopted_date: "2019-02-15",
    effective_date: "2019-03-01",
    repealed_date: "2024-09-01",
    issuing_authority: "Qurilish vazirligi",
    official_source_url: "https://lex.uz/",
    old_edition_note: "Ushbu me'yor SHNQ 2.08.01-24 qabul qilinishi munosabati bilan o'z kuchini yo'qotgan.",
    tags: ["turar joy", "eski tahrir", "shnq"]
  },

  // 2. Seysmik va konstruktiv talablar
  {
    document_number: "QMQ 2.01.03-19",
    title: "Zilzilabardosh binolarni loyihalash",
    document_type: "QMQ",
    category: "Konstruksiya",
    description: "O'zbekiston hududidagi seysmik (7, 8, 9 ball) hududlarda poydevor, temir-beton karkas, monolit va g'ishtli binolarni seysmik hisoblash hamda konstruktiv mustahkamlash qoidalari.",
    requirements: "Zilzila kuchi 7, 8 va 9 ball bo'lgan zonalarda poydevorlar monolit tasmali yoki yaxlit plita shaklida loyihalashtiriladi. G'ishtli devorlarda antseysmik belbog'lar (seysmopoyas) har bir qavat oralig'ida uzluksiz o'rnatilishi shart. Ustun va rigellarning tutashuv joylari seysmik hisob bo'yicha kuchaytirilgan armatura to'ri bilan mustahkamlanadi.",
    target_audience: "Konstruktor-muhandislar, bosh konstruktorlar, loyiha bosh muhandislari (GIP)",
    application_scope: "Barcha turdagi bino va inshootlarning poydevori, karkasi va yuk ko'taruvchi konstruksiyalarini loyihalash",
    status: "AMALDA",
    adopted_date: "2019-06-20",
    effective_date: "2019-07-01",
    issuing_authority: "Qurilish vazirligi",
    official_source_url: "https://lex.uz/docs/4425687",
    pdf_url: "https://lex.uz/uz/search/nat?number=QMQ%202.01.03-19",
    new_edition_note: "Amaldagi me'yoriy hujjat. Zamonaviy BIM hisoblash dasturlari (LIRA-SAPR, SCAD, ETABS) uchun tavsiyalar kiritilgan.",
    tags: ["seysmika", "zilzila", "konstruksiya", "poydevor", "armatura", "beton", "seysmopoyas", "qmq"]
  },

  // 3. Shaharsozlik va rejalashtirish
  {
    document_number: "SHNQ 2.07.01-03*",
    title: "Shaharsozlik. Shahar va qishloq aholi punktlarini rejalashtirish va qurish",
    document_type: "SHNQ",
    category: "Shaharsozlik",
    description: "Yer uchastkasida binolarni joylashtirish, qo'shni yer chegarasigacha masofalar, qizil chiziqlar, yo'llar, avtoturargohlar va hudud zichligi me'yorlari.",
    requirements: "Yakka tartibdagi uy-joy binosidan qo'shni yer chegarasigacha masofa kamida 3 metr bo'lishi shart. Yordamchi binolar (garaj, oshxona, ombor)dan qo'shni chegaragacha kamida 1 metr masofa qoldirilishi ruxsat etiladi. Ko'chaning qizil chizig'idan bino fasadiga qadar masofa kamida 5 metr, o'tish yo'llaridan (proezd) kamida 3 metr bo'lishi talab qilinadi.",
    target_audience: "Bosh rejachilar, shaharsozlar, arxitektorlar, yer kadastri mutaxassislari",
    application_scope: "Bosh reja tuzish, yer uchastkasida uyni joylashtirish (sitplan), posyolka va massivlar loyihalash",
    status: "O‘ZGARTIRILGAN",
    adopted_date: "2003-11-20",
    effective_date: "2004-01-01",
    issuing_authority: "Davlat arxitektura va qurilish qo'mitasi",
    official_source_url: "https://lex.uz/docs/1344820",
    old_edition_note: "Dastlab 2003-yilda qabul qilingan.",
    new_edition_note: "Bir necha bor o'zgartirish va qo'shimchalar kiritilgan (yulduzcha belgisi bilan amalda). Avtoturargoh o'rinlari va yashil maydonlar bo'yicha me'yorlar qayta tasdiqlangan.",
    change_date: "2023-05-18",
    tags: ["shaharsozlik", "masofalar", "qizil chiziq", "qo'shni chegara", "sitplan", "avtoturargoh", "shnq"]
  },

  // 4. Yong'in xavfsizligi
  {
    document_number: "SHNQ 2.01.02-04",
    title: "Binolar va inshootlarning yong'in xavfsizligi",
    document_type: "SHNQ",
    category: "Yong‘in xavfsizligi",
    description: "Binolarning o'tga chidamlilik darajasi, yong'inga qarshi to'siqlar, devorlar, evakuatsiya yo'llari va chiqish eshiklari parametrlarini belgilovchi bosh hujjat.",
    requirements: "Evakuatsiya chiqish yo'laklarining minimal kengligi 1.2 m dan, eshiklar kengligi 0.9 m dan kam bo'lmasligi kerak. Zinapoya kataklariga tabiiy yorug'lik tushishi shart. Zinapoyalar yong'inga chidamliligi kamida 1 soat (REI 60) bo'lgan materiallardan quriladi. Ko'p qavatli binolarda tutunga qarshi shlyuzlar va tutun chiqarish klapanlari o'rnatiladi.",
    target_audience: "Arxitektorlar, konstruktorlar, yong'in xavfsizligi ekspertlari",
    application_scope: "Barcha jamoat, turar joy, sanoat va savdo obyektlari loyihalarida majburiy",
    status: "AMALDA",
    adopted_date: "2004-04-12",
    effective_date: "2004-07-01",
    issuing_authority: "Qurilish vazirligi",
    official_source_url: "https://lex.uz/docs/1512410",
    pdf_url: "https://lex.uz/uz/search/nat?number=SHNQ%202.01.02-04",
    tags: ["yong'in", "evakuatsiya", "chiqish yo'li", "eshik kengligi", "zinapoya", "tutun", "shnq"]
  },

  // 5. Jamoat binolari
  {
    document_number: "SHNQ 2.08.02-19",
    title: "Jamoat binolari va inshootlari",
    document_type: "SHNQ",
    category: "Loyihalash",
    description: "Ofislar, biznes markazlar, maktablar, o'quv markazlari, banklar va ma'muriy binolarni loyihalash bo'yicha kompleks me'yorlar.",
    requirements: "Ofis xonalarida har bir xodim uchun kamida 4.5 - 6.0 kv.m foydali maydon ta'minlanishi shart. Koridor kengligi asosiy o'tish joylarida kamida 1.5 - 1.8 m bo'lishi kerak. Binoga kirish qismida pandus yoki ko'targich o'rnatilishi zarur. Binoda kamida ikkita mustaqil evakuatsiya chiqishi nazarda tutilishi shart.",
    target_audience: "Bosh loyihachilar, arxitektorlar, ofis va tijorat binosi buyurtmachilari",
    application_scope: "Biznes markazlar, kovorkinglar, banklar, o'quv muassasalari, ma'muriy binolar",
    status: "AMALDA",
    adopted_date: "2019-11-15",
    effective_date: "2020-01-01",
    issuing_authority: "Qurilish vazirligi",
    official_source_url: "https://lex.uz/docs/4648512",
    tags: ["ofis", "jamoat binosi", "biznes markaz", "koridor", "evakuatsiya", "xodim maydoni", "shnq"]
  },

  // 6. Imkoniyati cheklanganlar (Inklusivlik & Accessibility)
  {
    document_number: "SHNQ 2.01.18-23",
    title: "Aholining imkoniyati cheklangan (nogironlar) guruhlari uchun yashash muhiti qulayligini ta'minlash",
    document_type: "SHNQ",
    category: "O‘lchamlar va standartlar",
    description: "Nogironlar aravachasi, ko'zi ojiz va harakati cheklangan insonlar uchun panduslar, eshik ostonalari, liftlar, taktil plitkalar va maxsus sanuzellar bo'yicha zamonaviy talablar.",
    requirements: "Pandus qiyaligi 1:12 (8%) dan oshmasligi shart (maksimal ko'tarilish 0.8 m bo'lganda). Pandus kengligi bir tomonlama harakat uchun kamida 1.0 m, ikki tomonlama uchun 1.5 m. Pandus ikki tomonida 0.7 m va 0.9 m balandlikda tutqichlar (perila) o'rnatiladi. Eshik ostonasi (porog) balandligi 14 mm (1.4 sm) dan oshmasligi kerak. Universal nogironlar sanuzeli minimal o'lchami 2.20 x 1.60 m bo'lishi shart.",
    target_audience: "Arxitektorlar, interyer dizaynerlar, shaharsozlar, ekspertiza tashkilotlari",
    application_scope: "Barcha jamoat, savdo, turar joy kirish zonalari va infratuzilma obyektlarida majburiy",
    status: "AMALDA",
    adopted_date: "2023-09-08",
    effective_date: "2023-11-01",
    issuing_authority: "Qurilish va uy-joy kommunal xo'jaligi vazirligi",
    official_source_url: "https://lex.uz/docs/6625890",
    tags: ["nogironlar", "pandus", "accessibility", "taktil", "sanuzel", "eshik kengligi", "shnq", "standart"]
  },

  // 7. HVAC / Ventilyatsiya va Isitish
  {
    document_number: "QMQ 2.04.05-18",
    title: "Isitish, shamollatish va havoni tozalash (HVAC)",
    document_type: "QMQ",
    category: "O‘lchamlar va standartlar",
    description: "Turar joy, ofis va jamoat binolarida mikroklimat, toza havo almashinuvi, radiatorlar joylashuvi va ventilyatsiya shaxtalarini loyihalash qoidalari.",
    requirements: "Turar joylarda toza havo kiritish miqdori kishi boshiga kamida 30 m3/soat yoki 1 m2 maydonga 3 m3/soat deb olinadi. Oshxonalarda 4 konforkali gaz plitasi bo'lganda tabiiy yoki majburiy tortish quvvati kamida 90 m3/soat, sanuzellarda 25 m3/soat bo'lishi shart. Ventilyatsiya shaxtalari o'tga chidamli materiallardan alohida kanal ko'rinishida tom ustiga chiqariladi.",
    target_audience: "HVAC muhandislari, OViK loyihachilari, arxitektorlar",
    application_scope: "Barcha turar joy va jamoat binolari mikroklimat tizimlari",
    status: "AMALDA",
    adopted_date: "2018-05-10",
    effective_date: "2018-07-01",
    issuing_authority: "Qurilish vazirligi",
    official_source_url: "https://lex.uz/docs/3784125",
    tags: ["ventilyatsiya", "isitish", "hvac", "havo almashinuvi", "oshxona havosi", "radiator", "qmq"]
  },

  // 8. Suv ta'minoti va kanalizatsiya (VK)
  {
    document_number: "QMQ 2.04.01-98",
    title: "Binolarning ichki suv quvuri va kanalizatsiyasi",
    document_type: "QMQ",
    category: "O‘lchamlar va standartlar",
    description: "Binolar ichidagi sovuq va issiq suv tizimi, kanalizatsiya quvurlari diametrlari, nishabliklari va montaj talablari.",
    requirements: "Ichki kanalizatsiya quvurlari minimal nishabligi d=50 mm bo'lganda 0.03 (1 metrga 3 sm), d=100 mm bo'lganda 0.02 (1 metrga 2 sm) bo'lishi shart. Unitazning kanalizatsiya tik quvuriga (stoyak) ulanish masofasi 1 metrdan oshmasligi tavsiya etiladi. Suv quvurlari bosimi sanitar asboblarda 0.45 MPa dan oshmasligi lozim.",
    target_audience: "VK muhandislari, santexnika mutaxassislari, interyer arxitektorlari",
    application_scope: "Turar joy, kottej, ofis va sanoat obyektlarining ichki muhandislik tarmoqlari",
    status: "AMALDA",
    adopted_date: "1998-10-14",
    effective_date: "1999-01-01",
    issuing_authority: "Davlat arxitektura va qurilish qo'mitasi",
    official_source_url: "https://lex.uz/docs/984120",
    tags: ["suv", "kanalizatsiya", "santexnika", "nishablik", "truba", "quvur diametri", "qmq"]
  },

  // 9. Qurilish materiallari standarti
  {
    document_number: "O'z DSt 3524:2021",
    title: "Qurilish materiallari va buyumlari. Tasniflash va umumiy xavfsizlik talablari",
    document_type: "O‘z DSt",
    category: "Qurilish materiallari",
    description: "G'isht, beton, armatura, issiqlik izolyatsiyasi, quruq qorishmalar va pardozlash materiallarining radiatsiyaviy, ekologik hamda mustahkamlik me'yorlari.",
    requirements: "Turar joy va jamoat binolarida qo'llaniladigan materiallarning tabiiy radionuklidlar solishtirma samarali faolligi (Aeff) 370 Bk/kg dan oshmasligi shart (I toifa). Barcha yuk ko'taruvchi konstruksiya materiallari muvofiqlik sertifikatiga ega bo'lishi talab qilinadi.",
    target_audience: "Laboratoriya mutaxassislari, texnik nazorat muhandislari, smetachilar, ta'minotchilar",
    application_scope: "O'zbekistonda ishlab chiqariladigan va import qilinadigan barcha qurilish mahsulotlari",
    status: "AMALDA",
    adopted_date: "2021-04-16",
    effective_date: "2021-06-01",
    issuing_authority: "O'zbekiston texnik jihatdan tartibga solish agentligi",
    official_source_url: "https://standart.uz/",
    tags: ["material", "gost", "standart", "sertifikat", "g'isht", "beton", "ekologiya", "dst"]
  },

  // 10. Smeta va loyiha qiymati
  {
    document_number: "SHNQ 1.04.03-20",
    title: "Loyiha-qidiruv ishlari qiymatini aniqlash va smeta tuzish tartibi",
    document_type: "SHNQ",
    category: "Smeta va qurilish iqtisodiyoti",
    description: "Qurilish obyektlarida arxitektura-loyihalash xizmatlari qiymatini hisoblash, resurs usulida smeta hujjatlarini shakllantirish me'yorlari.",
    requirements: "Loyiha-smeta hujjatlari narxi davlat buyurtmalari uchun tasdiqlangan bazaviy narxlar to'plami va resurs ko'rsatkichlari asosida chiqariladi. Smeta hisob-kitoblarida to'g'ridan-to'g'ri xarajatlar, ustama xarajatlar va rejaviy foyda normativ foizlarda ko'rsatilishi shart.",
    target_audience: "Smetachilar, loyiha institutlari iqtisodchilari, tender mutaxassislari",
    application_scope: "Davlat va xususiy investitsiya loyihalarining smetasini tuzish",
    status: "AMALDA",
    adopted_date: "2020-03-02",
    effective_date: "2020-04-01",
    issuing_authority: "Qurilish vazirligi",
    official_source_url: "https://lex.uz/docs/4785210",
    tags: ["smeta", "narx", "loyiha narxi", "tender", "iqtisodiyot", "shnq"]
  },

  // 11. Hujjat rasmiylashtirish / Ruxsatnomalar (VMQ)
  {
    document_number: "VMQ-370",
    title: "Arxitektura-shaharsozlik hujjatlarini ishlab chiqish va kelishish bo'yicha davlat xizmatlari ko'rsatish ma'muriy reglamenti",
    document_type: "Qaror",
    category: "Qurilish uchun kerakli hujjatlar",
    description: "APZ (Arxitektura-rejalashtirish topshirig'i) olish, loyihani kelishish, Davlat xizmatlari markazi yoki my.gov.uz orqali ruxsatnoma rasmiylashtirish tartibi.",
    requirements: "APZ olish uchun arizani elektron tarzda Davlat xizmatlari portali orqali yuboriladi. 1-toifadagi murakkab bo'lmagan obyektlar (yakka tartibdagi uylar) uchun APZ 3 ish kunida, kelishuv 5 ish kunida ko'rib chiqiladi. Qurilish loyihasi tasdiqlangan bosh rejaga muvofiq bo'lishi shart.",
    target_audience: "Buyurtmachilar, yer egalari, arxitektorlar, yuridik shaxslar",
    application_scope: "O'zbekistonda barcha yangi qurilish, rekonstruksiya va bino funksiyasini o'zgartirish jarayonlari",
    status: "AMALDA",
    adopted_date: "2019-05-18",
    effective_date: "2019-06-01",
    issuing_authority: "O'zbekiston Respublikasi Vazirlar Mahkamasi",
    official_source_url: "https://lex.uz/docs/4343166",
    tags: ["apz", "ruxsatnoma", "davlat xizmatlari", "shaharsozlik kengashi", "hujjatlar", "vmq", "uy qurish"]
  },

  // 12. Qurilishni boshlash haqida xabarnoma (VMQ)
  {
    document_number: "VMQ-200",
    title: "Qurilish-montaj ishlarini boshlash haqida xabarnoma yuborish va davlat ro'yxatidan o'tkazish tartibi",
    document_type: "Qaror",
    category: "Qurilish uchun kerakli hujjatlar",
    description: "Qurilish obyektini ro'yxatdan o'tkazish, Shaffof qurilish milliy axborot tizimida inspeksiya nazoratiga qo'yish reglamenti.",
    requirements: "Qurilishni boshlashdan oldin Qurilish sohasida hududiy nazorat inspeksiyasiga xabarnoma yuborish majburiydir. Yakka tartibdagi uylar (2 qavatgacha va 12 metrgacha) uchun ekspertiza va inspeksiya ro'yxatidan o'tish soddalashtirilgan tartibda amalga oshiriladi.",
    target_audience: "Pudratchilar, buyurtmachilar, texnik nazoratchilar",
    application_scope: "Qurilish ishlarini amalda boshlash bosqichi",
    status: "AMALDA",
    adopted_date: "2022-04-20",
    effective_date: "2022-05-01",
    issuing_authority: "Vazirlar Mahkamasi",
    official_source_url: "https://lex.uz/docs/5978120",
    tags: ["inspeksiya", "shaffof qurilish", "qurilishni boshlash", "xabarnoma", "nazorat", "vmq"]
  },

  // 13. Umumiy ovqatlanish (Restoran, Kafe)
  {
    document_number: "SHNQ 2.08.03-12",
    title: "Umumiy ovqatlanish korxonalari (Restoran, kafe va oshxonalar)",
    document_type: "SHNQ",
    category: "Loyihalash",
    description: "Restoran, kafe, oshxona va kofeynyalarni loyihalash, oshxona texnologik zonalari, zallar sig'imi va sanitariya oqimlari me'yorlari.",
    requirements: "Oshxonada xomashyo va tayyor taom oqimlari bir-biri bilan kesishmasligi (pototochnost) qat'iy talab qilinadi. Mehmonlar zali uchun 1 o'ringa kamida: restoranda 1.8 - 2.0 kv.m, kafeda 1.4 - 1.6 kv.m maydon ajratiladi. Oshxona uchun alohida texnologik ventilyatsiya tizimi (gidrofiltr va yog' ushlagich bilan) o'rnatilishi shart.",
    target_audience: "Restoran loyihachilari, arxitektorlar, texnolog-muhandislar, interyer dizaynerlari",
    application_scope: "Barcha umumiy ovqatlanish maskanlari, kafe, bar va restoranlar",
    status: "AMALDA",
    adopted_date: "2012-08-20",
    effective_date: "2012-10-01",
    issuing_authority: "Qurilish vazirligi",
    official_source_url: "https://lex.uz/docs/2056124",
    tags: ["restoran", "kafe", "oshxona", "ovqatlanish", "texnologiya", "zal sig'imi", "ventilyatsiya", "interyer", "shnq"]
  },

  // 14. Mehmonxona va turar joy komplekslari
  {
    document_number: "SHNQ 2.08.06-18",
    title: "Mehmonxona va turar joy komplekslarini loyihalash me'yorlari",
    document_type: "SHNQ",
    category: "Loyihalash",
    description: "Mehmonxona binolari, xonalar klassifikatsiyasi, yulduzlik talablari va xizmat ko'rsatish infratuzilmasi me'yorlari.",
    requirements: "1 o'rinli xona minimal maydoni kamida 12 kv.m, 2 o'rinli 16 kv.m bo'lishi shart. Har bir mehmonxona xonasida to'liq sanuzel (vanna yoki dush, unitaz, rakovina) nazarda tutiladi. 3 qavatdan baland mehmonxonalarda yo'lovchi liftlari o'rnatilishi shart. Barcha xonalarda ovoz izolyatsiyasi normativ ko'rsatkichlarga javob berishi zarur.",
    target_audience: "Arxitektorlar, mehmonxona egalari, loyihachilar",
    application_scope: "Mehmonxonalar, motellar, xostellar va turizm komplekslari",
    status: "AMALDA",
    adopted_date: "2018-09-12",
    effective_date: "2018-11-01",
    issuing_authority: "Qurilish vazirligi",
    official_source_url: "https://lex.uz/docs/4012589",
    tags: ["mehmonxona", "hotel", "xona o'lchami", "lift", "sanuzel", "turizm", "shnq"]
  }
];

// ======================================================
// PRACTICAL CASES (AMALIY VAZIYATLAR & CHECKLISTS)
// ======================================================

const SEED_PRACTICAL_CASES = [
  {
    title: "2 qavatli yakka tartibdagi uy qurish",
    slug: "2-qavatli-uy-qurish",
    icon: "🏠",
    category: "Qurilish uchun kerakli hujjatlar",
    subtitle: "Yakka tartibdagi 2 qavatli uy-joy uchun zarur barcha qonuniy bosqichlar va hujjatlar",
    description: "O'zbekistonda yakka tartibdagi yer uchastkasida 2 qavatli shaxsiy uy qurish uchun yer ajratishdan to foydalanishga topshirishgacha bo'lgan barcha rasmiy davlat hujjatlari, me'yorlar va qadam-baqadam yo'l xaritasi.",
    target_user: "Uy qurmoqchi bo'lgan fuqarolar, shaxsiy arxitektorlar, prorablar",
    order_index: 1,
    checklist: [
      {
        step_order: 1,
        title: "1. Yer uchastkasiga oid hujjatlar",
        description: "Yerga bo'lgan mulk yoki egalik huquqini tasdiqlovchi davlat reyestridan ko'chirma va yer chegaralari kadastr pasporti. Yer noqonuniy egallanmagan bo'lishi va toifasi yakka tartibda uy-joy qurish uchun mo'ljallangan bo'lishi shart.",
        is_mandatory: true,
        document_numbers: ["VMQ-370"],
        law_basis: "Yer kodeksi va Vazirlar Mahkamasining 370-son qarori"
      },
      {
        step_order: 2,
        title: "2. Arxitektura-rejalashtirish topshirig'i (APZ)",
        description: "Tuman/shahar qurilish bo'limi orqali Davlat xizmatlari markazi yoki my.gov.uz portali orqali olinadi. APZ da uyni qizil chiziqdan qancha orqada qurish, bino balandligi va muhandislik tarmoqlariga ulanish talablari beriladi.",
        is_mandatory: true,
        document_numbers: ["VMQ-370", "SHNQ 2.07.01-03*"],
        law_basis: "VMQ-370 ma'muriy reglamenti"
      },
      {
        step_order: 3,
        title: "3. Shaharsozlik me'yorlariga mos bosh reja (Sitplan)",
        description: "Uyni yer uchastkasida joylashtirish: qo'shni devoridan kamida 3 metr, yordamchi binodan kamida 1 metr, ko'chaning qizil chizig'idan kamida 5 metr masofa qoldirish qat'iy tekshiriladi.",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.07.01-03*"],
        law_basis: "SHNQ 2.07.01-03* Shaharsozlik me'yorlari 4-bob"
      },
      {
        step_order: 4,
        title: "4. Arxitektura va konstruktiv loyiha (AR + KJ)",
        description: "Litsenziyaga ega loyihachi tomonidan ishlab chiqilgan uy loyihasi: qavat rejalari, fasadlar, kesimlar va seysmik mustahkamlik hisobi. Shift balandligi kamida 2.5 m, seysmopoyas va monolit poydevor talablari.",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.01-24", "QMQ 2.01.03-19"],
        law_basis: "SHNQ 2.08.01-24 Turar joy obyektlarini loyihalash"
      },
      {
        step_order: 5,
        title: "5. Loyihani arxitektura bo'limi bilan kelishish",
        description: "Tayyor loyiha davlat xizmatlari orqali tuman arxitektura bo'limi bilan elektron kelishiladi. Kelishuvdan so'ng arxitektura loyihaga QR-kodli elektron ma'qullash beradi.",
        is_mandatory: true,
        document_numbers: ["VMQ-370"],
        law_basis: "Shaharsozlik kodeksi 45-modda"
      },
      {
        step_order: 6,
        title: "6. Qurilish-montaj ishlarini boshlash haqida xabarnoma",
        description: "Qurilish sohasida hududiy nazorat inspeksiyasiga Davlat xizmatlari orqali xabarnoma yuboriladi va obyekt davlat ro'yxatiga kiritiladi. Shundan so'ng poydevor qazish va qurilishni boshlash qonuniy hisoblanadi.",
        is_mandatory: true,
        document_numbers: ["VMQ-200"],
        law_basis: "Vazirlar Mahkamasining 200-son qarori"
      },
      {
        step_order: 7,
        title: "7. Qurilish tugagach foydalanishga qabul qilish va kadastr",
        description: "Uy qurib bitkazilgach, kadastr organi kelib haqiqiy o'lchamlarni oladi, texnik pasport shakllantiriladi va ko'chmas mulk davlat reyestridan mulk huquqi ro'yxatdan o'tkaziladi.",
        is_mandatory: true,
        document_numbers: ["VMQ-370"],
        law_basis: "Ko'chmas mulk obyektlarini davlat ro'yxatidan o'tkazish tartibi"
      }
    ]
  },
  {
    title: "Ofis va biznes markaz loyihalash",
    slug: "ofis-loyihalash",
    icon: "🏢",
    category: "Loyihalash",
    subtitle: "A va B toifadagi zamonaviy ofis binolariga qo'yiladigan talablar",
    description: "Jamoat va ofis binolarini loyihalashda xodimlar soniga nisbatan maydon taqsimoti, yong'in evakuatsiyasi, toza havo aylanishi va imkoniyati cheklanganlar uchun qulaylik yaratish standartlari.",
    target_user: "Bosh loyihachilar, arxitektorlar, tijorat buyurtmachilari",
    order_index: 2,
    checklist: [
      {
        step_order: 1,
        title: "1. Xodim maydoni me'yorlari",
        description: "Bitta ofis xodimi uchun kamida 4.5 - 6.0 kv.m toza maydon ajratilishi shart. Rahbariyat xonasi kamida 12-15 kv.m.",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.02-19"],
        law_basis: "SHNQ 2.08.02-19 Jamoat binolari"
      },
      {
        step_order: 2,
        title: "2. Yong'in xavfsizligi va evakuatsiya yo'llari",
        description: "Koridor kengligi kamida 1.5 - 1.8 m. Har bir qavatda kamida 2 ta bir-biridan mustaqil yong'inga qarshi chiqish eshigi.",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.01.02-04"],
        law_basis: "SHNQ 2.01.02-04 Yong'in xavfsizligi"
      },
      {
        step_order: 3,
        title: "3. Ventilyatsiya va toza havo",
        description: "Bir xodimga soatiga kamida 30-40 m3 yangi havo kiritilishi va majburiy tortish ventilyatsiyasi o'rnatilishi zarur.",
        is_mandatory: true,
        document_numbers: ["QMQ 2.04.05-18"],
        law_basis: "QMQ 2.04.05-18 HVAC"
      },
      {
        step_order: 4,
        title: "4. Pandus va inklyuzivlik talablari",
        description: "Bino kirishida qiyaligi 1:12 bo'lgan pandus, taktil yo'laklar va 1-qavatda nogironlar uchun moslashtirilgan sanuzel.",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.01.18-23"],
        law_basis: "SHNQ 2.01.18-23 Inklyuziv muhit"
      }
    ]
  },
  {
    title: "Restoran va umumiy ovqatlanish maskani",
    slug: "restoran-loyihalash",
    icon: "🍽️",
    category: "Interyer",
    subtitle: "Oshxona texnologik zonalari, zallar va sanitariya qoidalari",
    description: "Restoran, kafe yoki kofeynya ochishda oshxonada xomashyo va pishgan taom oqimlari kesishmasligi, gidrofiltrli ventilyatsiya va zal o'rinlari me'yori.",
    target_user: "Restoratorlar, interyer dizaynerlari, texnolog-arxitektorlar",
    order_index: 3,
    checklist: [
      {
        step_order: 1,
        title: "1. Zal maydoni va mebel joylashuvi",
        description: "Restoranda bitta mehmonga kamida 1.8 - 2.0 kv.m, kafeda 1.4 - 1.6 kv.m maydon ajratiladi. Asosiy o'tish yo'lagi kamida 1.5 m.",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.03-12"],
        law_basis: "SHNQ 2.08.03-12 Umumiy ovqatlanish"
      },
      {
        step_order: 2,
        title: "2. Oshxona oqimlari (Pototochnost)",
        description: "Go'sht-baliq tozalash, sabzavot sexi, issiq sex va idish yuvish zonalari ajratiladi. Xomashyo kirishi bilan tayyor taom chiqishi bir eshikdan o'tishi taqiqlanadi.",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.03-12"],
        law_basis: "SanQvaN sanitariya qoidalari"
      },
      {
        step_order: 3,
        title: "3. Yog' ushlagich va maxsus ventilyatsiya",
        description: "Issiq sex ventilyatsiyasi umumiy bino ventilyatsiyasiga ulanmaydi. Oshxona chiqindi suviga jirovulovitel o'rnatiladi.",
        is_mandatory: true,
        document_numbers: ["QMQ 2.04.05-18", "QMQ 2.04.01-98"],
        law_basis: "QMQ 2.04.05-18"
      }
    ]
  },
  {
    title: "Kvartira interyeri va qayta rejalashtirish (Pereplanirovka)",
    slug: "kvartira-interyeri",
    icon: "🛋️",
    category: "Interyer",
    subtitle: "Kvartirada devor buzish va xonalarni ko'chirishdagi taqiqlar va ruxsatlar",
    description: "Kvartirada ta'mirlash va interyer dizayni qilishda qaysi devorlarni buzish mumkin, ho'l nuqtalarni (sanuzel va oshxona) ko'chirishdagi qonuniy cheklovlar.",
    target_user: "Interyer dizaynerlari, kvartira egalari, me'morlar",
    order_index: 4,
    checklist: [
      {
        step_order: 1,
        title: "1. Yuk ko'taruvchi (Nesushchiy) devorlar daxlsizligi",
        description: "Monolit ustunlar, diafragmalar va ko'p qavatli binolarning yuk ko'taruvchi devorlarini buzish yoki ularda ruxsatsiz katta o'yiq ochish qat'iyan man etiladi.",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.01-24", "QMQ 2.01.03-19"],
        law_basis: "QMQ 2.01.03-19 Seysmik talablar"
      },
      {
        step_order: 2,
        title: "2. Ho'l nuqtalarni yashash xonasi ustiga ko'chirish taqiqi",
        description: "Sanuzel yoki dush xonasini pastki qavatdagi qo'shnining yashash xonasi (spalnya, zal) ustiga ko'chirish qonunan taqiqlanadi. Faqat koridor yoki omborxona hisobiga kengaytirish mumkin.",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.01-24"],
        law_basis: "SHNQ 2.08.01-24 5-bob"
      },
      {
        step_order: 3,
        title: "3. Ventilyatsiya shaxtalarini kesmaslik",
        description: "Oshxona va sanuzeldagi umumiy vertikal bino ventilyatsiya shaxtasini qisqartirish, toraytirish yoki mebel o'rnatish uchun buzish qat'iyan taqiqlanadi.",
        is_mandatory: true,
        document_numbers: ["QMQ 2.04.05-18"],
        law_basis: "Qurilish nazorati qoidalari"
      }
    ]
  },
  {
    title: "Zinapoya va evakuatsiya yo'llari loyihalash",
    slug: "zinapoya-loyihalash",
    icon: "🪜",
    category: "O‘lchamlar va standartlar",
    subtitle: "Pillapoyalar o'lchami, balandligi, eni va qiyaligi standartlari",
    description: "Binolarda qavatlararo zinapoyalarni loyihalashda xavfsizlik formulalari (2h + b = 60-64 sm), minimal eni va to'siq balandligi.",
    target_user: "Arxitektorlar, interyerchilar, 3D modelerlar",
    order_index: 5,
    checklist: [
      {
        step_order: 1,
        title: "1. Bosqich o'lchamlari (Podstupenok va Prostupi)",
        description: "Pillapoya balandligi (h) 15-18 sm, kengligi (b) 28-30 sm. Formula: 2h + b = 62-64 sm. Yakka tartibdagi uylarda balandlik 19 sm gacha ruxsat etiladi.",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.01-24"],
        law_basis: "SHNQ 2.08.01-24 3.12-band"
      },
      {
        step_order: 2,
        title: "2. Zinapoya marshining minimal eni",
        description: "Turar joy binolarida kamida 1.05 - 1.20 m, yakka tartibdagi uyda kamida 0.9 m bo'lishi shart.",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.01.02-04"],
        law_basis: "SHNQ 2.01.02-04 Evakuatsiya talablari"
      },
      {
        step_order: 3,
        title: "3. Perila (tutqich) balandligi",
        description: "Kattalar uchun tutqich balandligi kamida 0.9 m, bolalar muassasalarida qo'shimcha 0.5 - 0.7 m da o'rnatiladi. Vertikal tayanchlar orasi 12 sm dan oshmasligi kerak.",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.02-19"],
        law_basis: "SHNQ 2.08.02-19 Xavfsizlik talablari"
      }
    ]
  },
  {
    title: "Yong'in xavfsizligi va to'siqlar",
    slug: "yongin-xavfsizligi",
    icon: "🔥",
    category: "Yong‘in xavfsizligi",
    subtitle: "Binolarda o'tga chidamlilik va yong'inga qarshi to'siqlar",
    description: "Binolarning qavatliligi va maydoniga qarab yong'inga qarshi devorlar (brandmauer), yong'in eshiklari va o't o'chirish gidrantlari me'yorlari.",
    target_user: "Bosh muhandislar, arxitektorlar, yong'in nazorati mutaxassislari",
    order_index: 6,
    checklist: [
      {
        step_order: 1,
        title: "1. 1-toifali yong'inga qarshi devor (REI 150)",
        description: "Katta maydonli binolarni yong'in bo'linmalariga (pojarotsek) ajratish devorlari kamida 2.5 soat olovga chidamli monolit yoki g'ishtdan quriladi.",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.01.02-04"],
        law_basis: "SHNQ 2.01.02-04 2-bob"
      },
      {
        step_order: 2,
        title: "2. Evakuatsiya eshigi ochilish yo'nalishi",
        description: "15 kishidan ortiq odam bo'lgan barcha xonalar va evakuatsiya eshiklari faqat chiqish yo'nalishi (tashqariga) tomon ochilishi qat'iy shart.",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.01.02-04"],
        law_basis: "Yong'in xavfsizligi qoidalari"
      }
    ]
  }
];

// ======================================================
// DATABASE INITIALIZATION & ROBUST UPSERT SEED
// ======================================================

async function initNormativesTables(pool) {
  if (!pool) return;
  try {
    // 1. Create normative_documents table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS normative_documents (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        document_number VARCHAR(100) NOT NULL,
        document_type VARCHAR(50) NOT NULL DEFAULT 'SHNQ',
        category VARCHAR(100) NOT NULL DEFAULT 'Loyihalash',
        description TEXT,
        requirements TEXT,
        target_audience VARCHAR(255),
        application_scope TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'AMALDA',
        adopted_date DATE,
        effective_date DATE,
        repealed_date DATE,
        issuing_authority VARCHAR(255),
        official_source_url TEXT,
        pdf_url TEXT,
        old_edition_note TEXT,
        new_edition_note TEXT,
        change_date DATE,
        supersedes_document_id INT,
        replaced_by_document_id INT,
        tags TEXT[] DEFAULT '{}',
        view_count INT DEFAULT 0,
        last_verified_at TIMESTAMPTZ DEFAULT NOW(),
        is_system_seed BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_normative_docs_cat ON normative_documents(category);
      CREATE INDEX IF NOT EXISTS idx_normative_docs_type ON normative_documents(document_type);
      CREATE INDEX IF NOT EXISTS idx_normative_docs_status ON normative_documents(status);
      CREATE INDEX IF NOT EXISTS idx_normative_docs_number ON normative_documents(document_number);
    `);

    // Ensure unique constraint on document_number for safe idempotent UPSERTs
    try {
      await pool.query(`
        DO $$
        BEGIN
          DELETE FROM normative_documents a USING normative_documents b
          WHERE a.id < b.id AND a.document_number = b.document_number;
        EXCEPTION WHEN OTHERS THEN
          NULL;
        END $$;
        CREATE UNIQUE INDEX IF NOT EXISTS idx_normative_docs_num_uq ON normative_documents(document_number);
      `);
    } catch (e) {
      console.warn('normative_documents unique index notice:', e.message);
    }

    // 2. Create practical_cases table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS practical_cases (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(100) NOT NULL,
        icon VARCHAR(50) DEFAULT '🏠',
        category VARCHAR(100) NOT NULL,
        subtitle VARCHAR(255),
        description TEXT,
        target_user VARCHAR(150),
        checklist JSONB DEFAULT '[]'::jsonb,
        order_index INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        view_count INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_practical_cases_cat ON practical_cases(category);
      CREATE INDEX IF NOT EXISTS idx_practical_cases_order ON practical_cases(order_index);
      CREATE UNIQUE INDEX IF NOT EXISTS idx_practical_cases_slug_uq ON practical_cases(slug);
    `);

    // 3. Create case_documents linking table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS case_documents (
        id SERIAL PRIMARY KEY,
        case_id INT NOT NULL REFERENCES practical_cases(id) ON DELETE CASCADE,
        document_id INT NOT NULL REFERENCES normative_documents(id) ON DELETE CASCADE,
        stage_name VARCHAR(255),
        notes TEXT,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_case_docs_case ON case_documents(case_id);
    `);

    // Ensure unique index for case_documents
    try {
      await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_case_docs_unique ON case_documents(case_id, document_id, stage_name);
      `);
    } catch (e) {
      console.warn('case_documents unique index notice:', e.message);
    }

    // 3b. Orqaga mos migratsiya: admin tahriri himoyasi, havola tekshiruvi natijalari, saqlash/like
    try {
      await pool.query(`
        ALTER TABLE normative_documents ADD COLUMN IF NOT EXISTS is_admin_edited BOOLEAN DEFAULT false;
        ALTER TABLE normative_documents ADD COLUMN IF NOT EXISTS pdf_check JSONB;
        ALTER TABLE normative_documents ADD COLUMN IF NOT EXISTS official_check JSONB;
        ALTER TABLE practical_cases ADD COLUMN IF NOT EXISTS is_admin_edited BOOLEAN DEFAULT false;
        CREATE TABLE IF NOT EXISTS norm_reactions (
          user_id INT NOT NULL,
          item_kind VARCHAR(10) NOT NULL,
          item_id INT NOT NULL,
          reaction VARCHAR(10) NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          PRIMARY KEY (user_id, item_kind, item_id, reaction)
        );
        CREATE INDEX IF NOT EXISTS idx_norm_reactions_item ON norm_reactions(item_kind, item_id);
      `);
    } catch (e) {
      console.warn('normatives migration notice:', e.message);
    }

    // 4. Kutubxona bo'limlari: "Normativlar" va "Amaliy yechimlar" alohida bo'lim (admin tahrir qilgan nomlar saqlanadi)
    try {
      await pool.query(`
        INSERT INTO library_sections (slug, name, subtitle, icon, description, order_index, is_active, is_visible)
        VALUES (
          'normatives',
          'Normativlar',
          'SHNQ, QMQ, standartlar',
          '📋',
          'Arxitektura, qurilish va loyihalash uchun normativ hujjatlar va standartlar',
          5,
          true,
          true
        )
        ON CONFLICT (slug) DO UPDATE SET is_active = true, is_visible = true;
      `);
      // Eski standart nom bo'lsa — bir martalik, buzmasdan yangilanadi (admin o'zgartirgan nom saqlanadi)
      await pool.query(`
        UPDATE library_sections
        SET name = 'Normativlar',
            subtitle = 'SHNQ, QMQ, standartlar',
            description = 'Arxitektura, qurilish va loyihalash uchun normativ hujjatlar va standartlar'
        WHERE slug = 'normatives' AND name = 'Normativlar va amaliy yechimlar';
      `);
      await pool.query(`
        INSERT INTO library_sections (slug, name, subtitle, icon, description, order_index, is_active, is_visible)
        VALUES (
          'amaliy_yechimlar',
          'Amaliy yechimlar',
          'Vaziyatlar bo''yicha yo''riqnomalar',
          '🛠️',
          'Vaziyatlar bo''yicha bosqichma-bosqich yechimlar va ularning normativ asoslari',
          6,
          true,
          true
        )
        ON CONFLICT (slug) DO NOTHING;
      `);
    } catch (e) {
      console.warn('normatives library section seed warn:', e.message);
    }

    // 5. IDEMPOTENT UPSERT SEED FOR NORMATIVE DOCUMENTS
    let insertedDocs = 0;
    let updatedDocs = 0;

    for (const item of SEED_NORMATIVES) {
      const q = `
        INSERT INTO normative_documents (
          title, document_number, document_type, category, description,
          requirements, target_audience, application_scope, status,
          adopted_date, effective_date, repealed_date, issuing_authority,
          official_source_url, pdf_url, old_edition_note, new_edition_note,
          change_date, tags, last_verified_at, is_system_seed
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10, $11, $12, $13, $14, $15, $16, $17,
          $18, $19, NOW(), true
        )
        ON CONFLICT (document_number) DO UPDATE SET
          title = EXCLUDED.title,
          document_type = EXCLUDED.document_type,
          category = EXCLUDED.category,
          description = EXCLUDED.description,
          requirements = EXCLUDED.requirements,
          target_audience = EXCLUDED.target_audience,
          application_scope = EXCLUDED.application_scope,
          status = EXCLUDED.status,
          adopted_date = EXCLUDED.adopted_date,
          effective_date = EXCLUDED.effective_date,
          repealed_date = EXCLUDED.repealed_date,
          issuing_authority = EXCLUDED.issuing_authority,
          official_source_url = EXCLUDED.official_source_url,
          pdf_url = EXCLUDED.pdf_url,
          old_edition_note = EXCLUDED.old_edition_note,
          new_edition_note = EXCLUDED.new_edition_note,
          change_date = EXCLUDED.change_date,
          tags = EXCLUDED.tags,
          last_verified_at = EXCLUDED.last_verified_at,
          updated_at = NOW()
        WHERE normative_documents.is_admin_edited IS NOT TRUE
        RETURNING (xmax = 0) AS was_inserted;
      `;

      try {
        const r = await pool.query(q, [
          item.title, item.document_number, item.document_type, item.category, item.description,
          item.requirements, item.target_audience, item.application_scope, item.status,
          item.adopted_date || null, item.effective_date || null, item.repealed_date || null, item.issuing_authority || null,
          item.official_source_url || null, item.pdf_url || null, item.old_edition_note || null, item.new_edition_note || null,
          item.change_date || null, item.tags || []
        ]);
        if (r.rows[0]?.was_inserted) insertedDocs++;
        else updatedDocs++;
      } catch (err) {
        console.error(`Error upserting doc ${item.document_number}:`, err.message);
      }
    }

    // 6. IDEMPOTENT UPSERT SEED FOR PRACTICAL CASES
    let seededCases = 0;
    for (const cs of SEED_PRACTICAL_CASES) {
      try {
        const ins = await pool.query(`
          INSERT INTO practical_cases (
            title, slug, icon, category, subtitle, description, target_user, checklist, order_index, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
          ON CONFLICT (slug) DO UPDATE SET
            title = EXCLUDED.title,
            icon = EXCLUDED.icon,
            category = EXCLUDED.category,
            subtitle = EXCLUDED.subtitle,
            description = EXCLUDED.description,
            target_user = EXCLUDED.target_user,
            checklist = EXCLUDED.checklist,
            order_index = EXCLUDED.order_index,
            is_active = true,
            updated_at = NOW()
          WHERE practical_cases.is_admin_edited IS NOT TRUE
          RETURNING id;
        `, [
          cs.title, cs.slug, cs.icon, cs.category, cs.subtitle, cs.description, cs.target_user,
          JSON.stringify(cs.checklist), cs.order_index
        ]);

        let caseId = ins.rows[0] && ins.rows[0].id;
        if (!caseId) {
          // Admin tahrir qilgan vaziyat: seed uni o'zgartirmadi, faqat bog'lanishlar tekshiriladi
          const ex = await pool.query('SELECT id FROM practical_cases WHERE slug = $1', [cs.slug]);
          caseId = ex.rows[0] && ex.rows[0].id;
        }
        if (!caseId) continue;
        seededCases++;

        // 7. Link documents mentioned in checklist
        for (const chItem of cs.checklist) {
          if (chItem.document_numbers && Array.isArray(chItem.document_numbers)) {
            for (const docNum of chItem.document_numbers) {
              const docRes = await pool.query('SELECT id FROM normative_documents WHERE document_number ILIKE $1 LIMIT 1', [docNum.trim()]);
              if (docRes.rows.length) {
                await pool.query(`
                  INSERT INTO case_documents (case_id, document_id, stage_name, notes, sort_order)
                  VALUES ($1, $2, $3, $4, $5)
                  ON CONFLICT (case_id, document_id, stage_name) DO NOTHING;
                `, [caseId, docRes.rows[0].id, chItem.title, chItem.law_basis, chItem.step_order || 0]).catch(e => {
                  // Fallback without target if index name differs
                  return pool.query(`
                    INSERT INTO case_documents (case_id, document_id, stage_name, notes, sort_order)
                    SELECT $1, $2, $3, $4, $5
                    WHERE NOT EXISTS (
                      SELECT 1 FROM case_documents WHERE case_id = $1 AND document_id = $2 AND stage_name = $3
                    );
                  `, [caseId, docRes.rows[0].id, chItem.title, chItem.law_basis, chItem.step_order || 0]);
                });
              }
            }
          }
        }
      } catch (err) {
        console.error(`Error upserting case ${cs.slug}:`, err.message);
      }
    }

    // 8. FINAL DIAGNOSTIC & LOG REPORT
    const [cntDocs, cntCases, cntLinks] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS cnt FROM normative_documents'),
      pool.query('SELECT COUNT(*)::int AS cnt FROM practical_cases'),
      pool.query('SELECT COUNT(*)::int AS cnt FROM case_documents')
    ]);

    console.log('==================================================');
    console.log('📋 NORMATIVES DB VERIFICATION:');
    console.log(`- normative_documents: ${cntDocs.rows[0]?.cnt || 0} records (inserted: ${insertedDocs}, updated: ${updatedDocs})`);
    console.log(`- practical_cases: ${cntCases.rows[0]?.cnt || 0} records (seeded: ${seededCases})`);
    console.log(`- case_documents: ${cntLinks.rows[0]?.cnt || 0} links`);
    console.log('==================================================');

  } catch (err) {
    console.error('ERROR INITIALIZING NORMATIVES TABLES:', err);
  }
}

// ======================================================
// QUERY HELPERS
// ======================================================

async function getNormativesList(pool, options = {}) {
  const {
    category,
    document_type,
    status,
    search,
    limit = 100,
    offset = 0,
    sort = 'newest',
    userId = 0
  } = options;

  let conditions = [];
  let values = [];
  let idx = 1;

  if (category && category !== 'all' && category !== 'Barchasi') {
    conditions.push(`category ILIKE $${idx++}`);
    values.push(`%${category}%`);
  }

  if (document_type && document_type !== 'all' && document_type !== 'Barchasi') {
    conditions.push(`document_type ILIKE $${idx++}`);
    values.push(document_type);
  }

  if (status && status !== 'all' && status !== 'Barchasi') {
    conditions.push(`status = $${idx++}`);
    values.push(status);
  }

  if (search && search.trim()) {
    const q = `%${search.trim().toLowerCase()}%`;
    conditions.push(`(
      LOWER(title) LIKE $${idx} OR
      LOWER(document_number) LIKE $${idx} OR
      LOWER(description) LIKE $${idx} OR
      LOWER(requirements) LIKE $${idx} OR
      LOWER(category) LIKE $${idx} OR
      $${idx + 1} = ANY(tags)
    )`);
    values.push(q);
    values.push(search.trim().toLowerCase());
    idx += 2;
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  let orderBy = 'id ASC';
  if (sort === 'popular') orderBy = 'pop_score DESC, id ASC';
  else if (sort === 'number') orderBy = 'document_number ASC';
  else if (sort === 'adopted') orderBy = 'adopted_date DESC NULLS LAST';
  else if (sort === 'newest') orderBy = 'id ASC';

  const countQuery = `SELECT COUNT(*)::int AS total FROM normative_documents ${whereClause}`;
  const totalRes = await pool.query(countQuery, values);
  const total = totalRes.rows[0]?.total || 0;

  const uidIdx = idx++;
  const dataQuery = `
    SELECT * FROM (
      SELECT
        d.id, d.title, d.document_number, d.document_type, d.category,
        d.description, d.requirements, d.target_audience, d.application_scope,
        d.status, d.adopted_date, d.effective_date, d.repealed_date,
        d.issuing_authority, d.official_source_url, d.pdf_url,
        d.old_edition_note, d.new_edition_note, d.change_date,
        d.tags, d.view_count, d.last_verified_at, d.created_at, d.is_admin_edited,
        d.pdf_check, d.official_check,
        COALESCE((SELECT COUNT(*)::int FROM norm_reactions r WHERE r.item_kind = 'doc' AND r.item_id = d.id AND r.reaction = 'like'), 0) AS like_count,
        COALESCE((SELECT COUNT(*)::int FROM norm_reactions r WHERE r.item_kind = 'doc' AND r.item_id = d.id AND r.reaction = 'save'), 0) AS save_count,
        EXISTS(SELECT 1 FROM norm_reactions r WHERE r.item_kind = 'doc' AND r.item_id = d.id AND r.reaction = 'like' AND r.user_id = $${uidIdx}) AS is_liked,
        EXISTS(SELECT 1 FROM norm_reactions r WHERE r.item_kind = 'doc' AND r.item_id = d.id AND r.reaction = 'save' AND r.user_id = $${uidIdx}) AS is_saved,
        (COALESCE(d.view_count, 0)
          + 3 * COALESCE((SELECT COUNT(*)::int FROM norm_reactions r WHERE r.item_kind = 'doc' AND r.item_id = d.id AND r.reaction = 'like'), 0)
          + 5 * COALESCE((SELECT COUNT(*)::int FROM norm_reactions r WHERE r.item_kind = 'doc' AND r.item_id = d.id AND r.reaction = 'save'), 0)) AS pop_score
      FROM normative_documents d
      ${whereClause.replace(/\b(title|document_number|description|requirements|category|tags|document_type|status)\b/g, 'd.$1')}
    ) x
    ORDER BY ${orderBy.replace(/\b(view_count|document_number|adopted_date|id)\b/g, 'x.$1')}
    LIMIT $${idx++} OFFSET $${idx++}
  `;

  values.splice(uidIdx - 1, 0, Number(userId) || 0);
  values.push(Math.min(limit, 1000));
  values.push(offset);

  const res = await pool.query(dataQuery, values);
  return { items: res.rows, documents: res.rows, total, limit, offset };
}

async function getNormativeDetail(pool, id, userId) {
  const docRes = await pool.query(`
    SELECT * FROM normative_documents WHERE id = $1
  `, [Number(id)]);

  if (!docRes.rows.length) return null;
  const doc = docRes.rows[0];

  pool.query('UPDATE normative_documents SET view_count = view_count + 1 WHERE id = $1', [doc.id]).catch(() => {});

  const casesRes = await pool.query(`
    SELECT pc.id, pc.title, pc.slug, pc.icon, pc.category, cd.stage_name
    FROM case_documents cd
    JOIN practical_cases pc ON pc.id = cd.case_id
    WHERE cd.document_id = $1
    ORDER BY pc.order_index ASC
  `, [doc.id]);

  const st = await pool.query(`
    SELECT
      COALESCE(SUM((reaction = 'like')::int), 0)::int AS like_count,
      COALESCE(SUM((reaction = 'save')::int), 0)::int AS save_count,
      COALESCE(BOOL_OR(reaction = 'like' AND user_id = $2), false) AS is_liked,
      COALESCE(BOOL_OR(reaction = 'save' AND user_id = $2), false) AS is_saved
    FROM norm_reactions WHERE item_kind = 'doc' AND item_id = $1
  `, [doc.id, Number(userId) || 0]).catch(() => ({ rows: [{}] }));
  Object.assign(doc, st.rows[0] || {});

  return { document: doc, cases: casesRes.rows };
}

async function getPracticalCasesList(pool, options = {}) {
  const { category, search, userId = 0 } = options;
  let conditions = ['c.is_active = true'];
  let values = [Number(userId) || 0];
  let idx = 2;

  if (category && category !== 'all' && category !== 'Barchasi') {
    conditions.push(`c.category ILIKE $${idx++}`);
    values.push(`%${category}%`);
  }

  if (search && search.trim()) {
    conditions.push(`(
      LOWER(c.title) LIKE $${idx} OR
      LOWER(c.description) LIKE $${idx} OR
      LOWER(c.subtitle) LIKE $${idx} OR
      LOWER(c.category) LIKE $${idx} OR
      LOWER(c.checklist::text) LIKE $${idx}
    )`);
    values.push(`%${search.trim().toLowerCase()}%`);
    idx++;
  }

  const res = await pool.query(`
    SELECT
      c.id, c.title, c.slug, c.icon, c.category, c.subtitle,
      c.description, c.target_user, c.checklist, c.order_index, c.view_count, c.created_at,
      jsonb_array_length(COALESCE(c.checklist, '[]'::jsonb)) AS step_count,
      COALESCE((SELECT json_agg(json_build_object('id', nd.id, 'document_number', nd.document_number, 'title', nd.title) ORDER BY nd.id)
                FROM (SELECT DISTINCT document_id FROM case_documents WHERE case_id = c.id) cdx
                JOIN normative_documents nd ON nd.id = cdx.document_id), '[]'::json) AS related_documents,
      COALESCE((SELECT COUNT(*)::int FROM norm_reactions r WHERE r.item_kind = 'case' AND r.item_id = c.id AND r.reaction = 'like'), 0) AS like_count,
      COALESCE((SELECT COUNT(*)::int FROM norm_reactions r WHERE r.item_kind = 'case' AND r.item_id = c.id AND r.reaction = 'save'), 0) AS save_count,
      EXISTS(SELECT 1 FROM norm_reactions r WHERE r.item_kind = 'case' AND r.item_id = c.id AND r.reaction = 'like' AND r.user_id = $1) AS is_liked,
      EXISTS(SELECT 1 FROM norm_reactions r WHERE r.item_kind = 'case' AND r.item_id = c.id AND r.reaction = 'save' AND r.user_id = $1) AS is_saved
    FROM practical_cases c
    WHERE ${conditions.join(' AND ')}
    ORDER BY c.order_index ASC, c.id ASC
  `, values);

  return res.rows.map(function (r) {
    r.pop_score = (Number(r.view_count) || 0) + 3 * (Number(r.like_count) || 0) + 5 * (Number(r.save_count) || 0);
    return r;
  });
}

async function getPracticalCaseDetail(pool, idOrSlug) {
  let query = 'SELECT * FROM practical_cases WHERE is_active = true AND ';
  let param;
  if (isNaN(Number(idOrSlug))) {
    query += 'slug = $1';
    param = idOrSlug;
  } else {
    query += 'id = $1';
    param = Number(idOrSlug);
  }

  const caseRes = await pool.query(query, [param]);
  if (!caseRes.rows.length) return null;
  const cs = caseRes.rows[0];

  pool.query('UPDATE practical_cases SET view_count = view_count + 1 WHERE id = $1', [cs.id]).catch(() => {});

  // Fetch all associated normative documents
  const docsRes = await pool.query(`
    SELECT
      nd.id, nd.title, nd.document_number, nd.document_type,
      nd.status, nd.adopted_date, nd.official_source_url, nd.pdf_url,
      cd.stage_name, cd.notes, cd.sort_order
    FROM case_documents cd
    JOIN normative_documents nd ON nd.id = cd.document_id
    WHERE cd.case_id = $1
    ORDER BY cd.sort_order ASC, nd.id ASC
  `, [cs.id]);

  cs.documents = docsRes.rows;

  // Bosqichlardagi hujjat raqamlari case_documents'da bo'lmasa ham (admin keyin qo'shgan), to'g'ridan-to'g'ri bazadan topiladi
  let steps = cs.checklist;
  if (typeof steps === 'string') { try { steps = JSON.parse(steps); } catch (e) { steps = []; } }
  const known = new Set(cs.documents.map(d => String(d.document_number || '').trim().toLowerCase()));
  const wanted = [];
  (Array.isArray(steps) ? steps : []).forEach(st => (st.document_numbers || []).forEach(n => {
    const k = String(n || '').trim().toLowerCase();
    if (k && !known.has(k) && !wanted.includes(k)) wanted.push(k);
  }));
  if (wanted.length) {
    const extra = await pool.query(`
      SELECT id, title, document_number, document_type, status, adopted_date, official_source_url, pdf_url
      FROM normative_documents WHERE LOWER(TRIM(document_number)) = ANY($1::text[])
    `, [wanted]).catch(() => ({ rows: [] }));
    extra.rows.forEach(d => cs.documents.push(Object.assign({ stage_name: null, notes: null, sort_order: 999 }, d)));
  }
  return cs;
}

async function getNormativesStats(pool) {
  const [totalRes, inForceRes, amendedRes, repealedRes, casesRes, linksRes] = await Promise.all([
    pool.query('SELECT COUNT(*)::int AS count FROM normative_documents'),
    pool.query("SELECT COUNT(*)::int AS count FROM normative_documents WHERE status = 'AMALDA'"),
    pool.query("SELECT COUNT(*)::int AS count FROM normative_documents WHERE status = 'O‘ZGARTIRILGAN' OR status = 'OZGARTIRILGAN'"),
    pool.query("SELECT COUNT(*)::int AS count FROM normative_documents WHERE status = 'KUCHINI YO‘QOTGAN' OR status = 'KUCHINI YOQOTGAN'"),
    pool.query('SELECT COUNT(*)::int AS count FROM practical_cases WHERE is_active = true'),
    pool.query('SELECT COUNT(*)::int AS count FROM case_documents')
  ]);

  return {
    total_documents: totalRes.rows[0]?.count || 0,
    in_force: inForceRes.rows[0]?.count || 0,
    amended: amendedRes.rows[0]?.count || 0,
    repealed: repealedRes.rows[0]?.count || 0,
    total_cases: casesRes.rows[0]?.count || 0,
    total_links: linksRes.rows[0]?.count || 0
  };
}

module.exports = {
  SEED_NORMATIVES,
  SEED_PRACTICAL_CASES,
  initNormativesTables,
  getNormativesList,
  getNormativeDetail,
  getPracticalCasesList,
  getPracticalCaseDetail,
  getNormativesStats
};
