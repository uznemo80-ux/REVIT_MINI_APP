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
    category: "shnq",
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
    tags: ["turar joy", "uy", "kvartira", "xona o'lchamlari", "shift balandligi", "oshxona", "shnq"]
  },
  {
    document_number: "SHNQ 2.08.01-19",
    title: "Turar joy binolari (2019-yil tahriri)",
    document_type: "SHNQ",
    category: "shnq",
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
    category: "structure",
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
    category: "urban_planning",
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
    category: "fire_safety",
    description: "Binolarning o'tga chidamlilik darajasi, yong'inga qarshi to'siqlar, devorlar, evakuatsiya yo'llari va chiqish eshiklari parametrlarini belgilovchi bosh hujjat.",
    requirements: "Evakuatsiya chiqish yo'laklarining minimal kengligi 1.2 m dan, eshiklar kengligi 0.9 m dan kam bo'lmasligi kerak. Zinapoya kataklariga tabiiy yorug'lik tushishi shart. Zinapoyalar yong'inga chidamliligi kamida 1 soat (REI 60) bo'lgan materiallardan quriladi. Ko'p qavatli binolarda tutunga qarshi shlyuzlar va tutun chiqarish klapanlari o'rnatiladi.",
    target_audience: "Arxitektorlar, konstruktorlar, yong'in xavfsizligi ekspertlari",
    application_scope: "Barcha jamoat, turar joy, sanoat va savdo obyektlari loyihalarida majburiy",
    status: "AMALDA",
    adopted_date: "2004-04-12",
    effective_date: "2004-07-01",
    issuing_authority: "Davlat arxitektura va qurilish qo'mitasi / FVV",
    official_source_url: "https://lex.uz/docs/1245600",
    pdf_url: "https://lex.uz/uz/search/nat?number=SHNQ%202.01.02-04",
    tags: ["yong'in", "evakuatsiya", "o'tga chidamlilik", "zinapoya", "favqulodda chiqish", "shnq"]
  },

  // 5. Jamoat binolari va ofislar
  {
    document_number: "SHNQ 2.08.02-19",
    title: "Jamoat binolari va inshootlari",
    document_type: "SHNQ",
    category: "design",
    description: "Ma'muriy binolar, biznes markazlar, savdo majmualari, sport va dam olish inshootlarini loyihalash normalari.",
    requirements: "Bitta ofis xodimi uchun ish joyining minimal maydoni kamida 4.5 kv.m (kompyuterli ish o'rni uchun 6.0 kv.m) bo'lishi lozim. Qavat balandligi kamida 3.0 m qilib belgilanadi. Jamoat binolarida sanitariya uzellari har 100 kishiga 1 ta unitaz va 1 ta yuvinish chanog'i hisobidan taqsimlanadi.",
    target_audience: "Arxitektorlar, interyer dizaynerlari, tijorat binosi buyurtmachilari",
    application_scope: "Ofislar, savdo markazlari, banklar, madaniyat va xizmat ko'rsatish binolari",
    status: "AMALDA",
    adopted_date: "2019-09-10",
    effective_date: "2019-10-01",
    issuing_authority: "Qurilish vazirligi",
    official_source_url: "https://lex.uz/docs/4561230",
    pdf_url: "https://lex.uz/uz/search/nat?number=SHNQ%202.08.02-19",
    tags: ["jamoat binosi", "ofis", "biznes markaz", "savdo", "ish joyi me'yori", "shnq"]
  },

  // 6. Accessibility / Imkoniyati cheklangan shaxslar
  {
    document_number: "SHNQ 2.01.18-23",
    title: "Aholining imkoniyati cheklangan (nogironlar) guruhlari uchun yashash muhiti qulayligini ta'minlash",
    document_type: "SHNQ",
    category: "dimensions_standards",
    description: "Nogironlar va keksalar uchun panduslar, to'siqsiz kirish yo'llari, maxsus liftlar, taktil plitkalar va moslashtirilgan sanuzellar talablari.",
    requirements: "Binolarga kirish pandusining qiyalik burchagi 1:12 (8%) dan oshmasligi, kengligi kamida 1.0 metr bo'lishi shart. Pandus boshida va oxirida diametri 1.5 metrli aylanib olish maydonchasi qoldiriladi. Maxsus sanuzel o'lchami kamida 2.2 x 2.2 metr bo'lib, unga burilish radiusi 1.4 m bo'lgan aravacha erkin kira olishi zarur.",
    target_audience: "Arxitektorlar, bosh loyihachilar, davlat ekspertizasi",
    application_scope: "Barcha yangi qurilayotgan va rekonstruksiya qilinayotgan jamoat va turar joy binolari",
    status: "AMALDA",
    adopted_date: "2023-04-10",
    effective_date: "2023-05-01",
    issuing_authority: "Qurilish va uy-joy kommunal xo'jaligi vazirligi",
    official_source_url: "https://lex.uz/docs/6451290",
    pdf_url: "https://lex.uz/uz/search/nat?number=SHNQ%202.01.18-23",
    new_edition_note: "2023-yilda qabul qilingan zamonaviy to'siqsiz shaharsozlik standarti.",
    tags: ["nogironlar", "pandus", "accessibility", "to'siqsiz muhit", "lift", "sanuzel", "shnq"]
  },

  // 7. Isitish, shamollatish va ventilyatsiya
  {
    document_number: "QMQ 2.04.05-18",
    title: "Isitish, shamollatish va havoni tozalash (HVAC)",
    document_type: "QMQ",
    category: "dimensions_standards",
    description: "Binolarda qulay mikroiqlim yaratish, tabiiy va majburiy havo almashinuvi, radiatorlar va ventkanal parametrlarini hisoblash.",
    requirements: "Turar joy xonalarida havo almashinuv me'yori: yashash xonalari uchun soatiga 1 kishiga kamida 30 kub metr toza havo; oshxonalarda (gaz plitasi bo'lsa) soatiga kamida 90 kub metr; sanuzel va vannaxonalar uchun soatiga kamida 25-50 kub metr chiqarish ventilyatsiyasi talab qilinadi.",
    target_audience: "Muhandis-loyihachilar (OViK / HVAC), arxitektorlar",
    application_scope: "Barcha turar joy, jamoat va ishlab chiqarish binolari",
    status: "AMALDA",
    adopted_date: "2018-12-14",
    effective_date: "2019-01-01",
    issuing_authority: "Qurilish vazirligi",
    official_source_url: "https://lex.uz/docs/4123560",
    pdf_url: "https://lex.uz/uz/search/nat?number=QMQ%202.04.05-18",
    tags: ["ventilyatsiya", "isitish", "havo almashishi", "ovik", "hvac", "qmq"]
  },

  // 8. Suv ta'minoti va kanalizatsiya
  {
    document_number: "QMQ 2.04.01-98",
    title: "Binolarning ichki suv quvuri va kanalizatsiyasi",
    document_type: "QMQ",
    category: "dimensions_standards",
    description: "Ichki sovuq va issiq suv ta'minoti tarmoqlari, kanalizatsiya quvurlari diametrlari va oqova suvlarni chiqarish me'yorlari.",
    requirements: "Kanalizatsiya quvurlarining minimal qiyaligi: diametri 50 mm bo'lgan quvurlar uchun 0.03 (1 metrda 3 sm), diametri 110 mm bo'lgan unitaz quvurlari uchun 0.02 (1 metrda 2 sm) bo'lishi shart. Suv bosimi eng yuqori nuqtadagi kran uchun kamida 0.5-1.0 bar (atmosfera) bo'lishi kerak.",
    target_audience: "Muhandis-santexniklar (VK), arxitektorlar, montajchilar",
    application_scope: "Bino ichki muhandislik tarmoqlari loyihalash va montaj qilish",
    status: "AMALDA",
    adopted_date: "1998-05-10",
    effective_date: "1998-07-01",
    issuing_authority: "Davlat arxitektura va qurilish qo'mitasi",
    official_source_url: "https://lex.uz/docs/1156890",
    tags: ["santexnika", "suv", "kanalizatsiya", "quvur qiyaligi", "qmq"]
  },

  // 9. Qurilish materiallari standarti
  {
    document_number: "O'z DSt 3524:2021",
    title: "Qurilish materiallari va buyumlari. Tasniflash va umumiy xavfsizlik talablari",
    document_type: "O'z DSt",
    category: "materials",
    description: "O'zbekistonda ishlab chiqariladigan va import qilinadigan g'isht, beton, gazoblok, armatura, quruq qorishmalar va pardozlash materiallarining sifat va sertifikatlash talablari.",
    requirements: "Yuk ko'taruvchi devorlar uchun M75, M100, M125 markali pishiq g'isht yoki kamida D600 B2.5 klassli avtoklav gazobeton bloklari ishlatilishi lozim. Beton mustahkamligi poydevor uchun kamida B15 (M200), seysmik karkas ustun va rigellari uchun kamida B20 (M250) bo'lishi shart.",
    target_audience: "Quruvchilar, konstruktorlar, smetachilar, texnik nazoratchilar",
    application_scope: "Qurilish materiallarini tanlash, xarid qilish, sifatini nazorat qilish va sertifikatlash",
    status: "AMALDA",
    adopted_date: "2021-11-15",
    effective_date: "2022-01-01",
    issuing_authority: "O'zbekiston Standartlashtirish agentligi (O'zstandart)",
    official_source_url: "https://lex.uz/docs/5751280",
    tags: ["material", "standart", "g'isht", "beton", "gazoblok", "sertifikat", "ozdst"]
  },

  // 10. Smeta va loyiha qiymatini aniqlash
  {
    document_number: "SHNQ 1.04.03-20",
    title: "Loyiha-qidiruv ishlari qiymatini aniqlash va smeta tuzish tartibi",
    document_type: "SHNQ",
    category: "estimation_economics",
    description: "Qurilish obyektlarida loyiha qiymatini, resurs usulida smeta hisob-kitoblarini shakllantirish, ish haqi va mashina-mexanizmlar xarajatlarini hisoblash me'yorlari.",
    requirements: "Smeta hujjatlari resurs usulida (joriy bozor narxlarida) shakllantiriladi. Loyiha-smeta hujjatlariga kutilmagan xarajatlar zaxirasi turar joy binolari uchun 2%, murakkab muhandislik inshootlari uchun 3% gacha kiritiladi.",
    target_audience: "Smeta muhandislari, iqtisodchilar, buyurtmachi tashkilotlar",
    application_scope: "Davlat va xususiy investitsiya loyihalarida smeta tuzish va ekspertizadan o'tkazish",
    status: "AMALDA",
    adopted_date: "2020-04-20",
    effective_date: "2020-05-01",
    issuing_authority: "Qurilish vazirligi",
    official_source_url: "https://lex.uz/docs/4812300",
    tags: ["smeta", "narx", "resurs usuli", "iqtisodiyot", "xarajat", "shnq"]
  },

  // 11. Qurilish ruxsatnomalari va ma'muriy reglament (VMQ-370)
  {
    document_number: "VMQ-370",
    title: "Arxitektura-shaharsozlik hujjatlarini ishlab chiqish va kelishish bo'yicha davlat xizmatlari ko'rsatish ma'muriy reglamenti",
    document_type: "Qaror",
    category: "construction_docs",
    description: "APZ (Arxitektura-rejalashtirish topshirig'i) olish, loyiha hujjatlarini shaharsozlik kengashida kelishish va qurilishga ruxsatnomalar rasmiylashtirishning rasmiy davlat tartibi.",
    requirements: "APZ olish uchun arizalar Yagona interaktiv davlat xizmatlari portali (my.gov.uz) yoki Davlat xizmatlari markazlari orqali yuboriladi. APZ vakolatli organ tomonidan 10 ish kuni ichida tayyorlanadi. Tayyorlangan loyiha-smeta hujjatlari hududiy qurilish bosh boshqarmasi bilan kelishiladi.",
    target_audience: "Buyurtmachilar, yer egalari, arxitektorlar, yuridik va jismoniy shaxslar",
    application_scope: "O'zbekistonda har qanday bino qurish, rekonstruksiya qilish va fasadni o'zgartirish jarayonlarida",
    status: "AMALDA",
    adopted_date: "2018-05-18",
    effective_date: "2018-06-01",
    issuing_authority: "O'zbekiston Respublikasi Vazirlar Mahkamasi",
    official_source_url: "https://lex.uz/docs/3741804",
    pdf_url: "https://lex.uz/uz/search/nat?number=370&date=18.05.2018",
    new_edition_note: "O'zbekiston Respublikasi Prezidentining PF-5963 va keyingi qarorlari bilan elektronlashtirilgan tahriri amalda.",
    tags: ["apz", "ruxsatnoma", "mygov", "qaror", "qurilish hujjati", "davlat xizmati", "vmq"]
  },

  // 12. Qurilish-montaj ishlarini boshlash haqida xabarnoma (VMQ-200)
  {
    document_number: "VMQ-200",
    title: "Qurilish-montaj ishlarini boshlash haqida xabarnoma yuborish va davlat ro'yxatidan o'tkazish tartibi",
    document_type: "Qaror",
    category: "construction_docs",
    description: "Qurilish boshlanishidan oldin Qurilish sohasida hududiy nazorat inspeksiyasiga (GASK) elektron xabarnoma yuborish va obyektni ro'yxatdan o'tkazish tartibi.",
    requirements: "Qurilish ishlarini boshlashdan kamida 3 ish kuni oldin my.gov.uz orqali inspeksiyaga elektron xabarnoma yuboriladi. Xabarnomaga: yer huquqi, APZ, tasdiqlangan loyiha, ekspertiza xulosasi (agar talab etilsa) va mualliflik/texnik nazorat shartnomalari biriktiriladi. Xabarnoma yubormasdan qurilish qilish noqonuniy hisoblanadi va ma'muriy javobgarlikka sabab bo'ladi.",
    target_audience: "Quruvchi tashkilotlar, buyurtmachilar, yakka tartibdagi quruvchilar",
    application_scope: "Qurilish maydonida poydevor qazish va montaj ishlarini rasmiy boshlashdan oldin",
    status: "AMALDA",
    adopted_date: "2022-04-20",
    effective_date: "2022-05-01",
    issuing_authority: "O'zbekiston Respublikasi Vazirlar Mahkamasi",
    official_source_url: "https://lex.uz/docs/5971485",
    pdf_url: "https://lex.uz/uz/search/nat?number=200&date=20.04.2022",
    tags: ["gask", "xabarnoma", "qurilish boshlash", "nazorat inspeksiyasi", "ruxsatnoma", "qaror", "vmq"]
  },

  // 13. Restoranlar va umumiy ovqatlanish
  {
    document_number: "SHNQ 2.08.03-12",
    title: "Umumiy ovqatlanish korxonalari (Restoran, kafe va oshxonalar)",
    document_type: "SHNQ",
    category: "interior",
    description: "Restoran, kafe, oshxona va kofeynyalar loyihalash, oshxona texnologik zonasi, ovqat zallari, ventilyatsiya va sanitariya qoidalari.",
    requirements: "Ovqatlanish zalida bitta mijoz o'rindig'i uchun minimal maydon: restoranda kamida 1.8-2.0 kv.m, kafeda kamida 1.4-1.6 kv.m, tez tayyorlanadigan oshxonalarda kamida 1.2 kv.m. Oshxona ishlab chiqarish xonalari (issiq sex, sovuq sex, idish yuvish) bir-biridan texnologik ketma-ketlik asosida ajratilishi va xomashyo bilan tayyor taom oqimi kesishmasligi (potochnost) shart.",
    target_audience: "Arxitektorlar, interyer dizaynerlari, restoran egalari",
    application_scope: "Yangi restoran va kafelar qurish yoki binolarni umumiy ovqatlanishga moslashtirish",
    status: "AMALDA",
    adopted_date: "2012-07-16",
    effective_date: "2012-09-01",
    issuing_authority: "Davlat arxitektura va qurilish qo'mitasi / Sanitariya xizmati",
    official_source_url: "https://lex.uz/docs/2156890",
    tags: ["restoran", "kafe", "oshxona", "umumiy ovqatlanish", "interyer", "texnologik zanjir", "shnq"]
  },

  // 14. Mehmonxonalar
  {
    document_number: "SHNQ 2.08.06-18",
    title: "Mehmonxona va turar joy komplekslarini loyihalash me'yorlari",
    document_type: "SHNQ",
    category: "design",
    description: "Mehmonxonalar, xostellar, motellar va dam olish maskanlari me'moriy rejalashtirish talablari va toifalari (yulduzlari).",
    requirements: "1 o'rinli standart mehmonxona xonasi (nomer) minimal maydoni kamida 12 kv.m (sanuzelsiz), 2 o'rinli xona kamida 14-16 kv.m bo'lishi shart. Har bir nomerda alohida sanuzel (dush/vanna, unitaz, rakovina) ko'zda tutilishi va xonalararo tovush izolyatsiyasi kamida 50 dB bo'lishi talab qilinadi.",
    target_audience: "Arxitektorlar, loyihachilar, turizm investorlari",
    application_scope: "Mehmonxona, apart-otel, xostel va dam olish maskanlarini loyihalash",
    status: "AMALDA",
    adopted_date: "2018-08-25",
    effective_date: "2018-09-15",
    issuing_authority: "Qurilish vazirligi / Turizm qo'mitasi",
    official_source_url: "https://lex.uz/docs/3891230",
    tags: ["mehmonxona", "otel", "xostel", "nomer", "ovoz izolyatsiyasi", "shnq"]
  }
];

const SEED_PRACTICAL_CASES = [
  {
    title: "2 qavatli yakka tartibdagi uy qurish",
    slug: "2-qavatli-uy",
    icon: "🏠",
    category: "construction_docs",
    subtitle: "Yakka tartibdagi uy-joy uchun zarur barcha hujjatlar, ruxsatnomalar va normativlar",
    description: "O'zbekistonda 2 qavatli yakka tartibdagi xususiy turar joy binosini qurishda talab etiladigan rasmiy davlat hujjatlari, arxitektura me'yorlari va bosqichma-bosqich yo'riqnoma.",
    target_user: "Buyurtmachi, yer egasi, xususiy uy loyihachi arxitektori",
    checklist: [
      {
        step: 1,
        title: "1. Yer uchastkasiga egalik huquqi",
        description: "Yerga bo'lgan huquqni tasdiqlovchi hujjat (Auksion bayonnomasi, meros, hadya yoki oldi-sotdi shartnomasi asosidagi davlat kadastr ko'chirmasi).",
        law_basis: "O'zbekiston Respublikasi Yer kodeksi, VMQ-370",
        document_numbers: ["VMQ-370"]
      },
      {
        step: 2,
        title: "2. APZ (Arxitektura-rejalashtirish topshirig'i) olish",
        description: "my.gov.uz portali orqali tuman/shahar qurilish bo'limidan APZ olinadi. Unda qizil chiziq, maksimal qavatlilik, ko'chadan chekinish masofasi va muhandislik shartlari ko'rsatiladi.",
        law_basis: "Vazirlar Mahkamasining 370-son qarori (10 ish kuni ichida)",
        document_numbers: ["VMQ-370", "SHNQ 2.07.01-03*"]
      },
      {
        step: 3,
        title: "3. Loyiha-smeta hujjatlarini ishlab chiqish",
        description: "Litsenziyaga ega arxitektura byurosi tomonidan SHNQ 2.08.01-24 va QMQ 2.01.03-19 asosida AR (Arxitektura yechimlari) va KJ (Konstruktiv chizmalar) ishlab chiqiladi.",
        law_basis: "SHNQ 2.08.01-24, QMQ 2.01.03-19",
        document_numbers: ["SHNQ 2.08.01-24", "QMQ 2.01.03-19"]
      },
      {
        step: 4,
        title: "4. Qo'shni chegara va masofalarga rioya qilish",
        description: "Uyni joylashtirishda qo'shni yer chegarasigacha kamida 3 metr, ko'cha qizil chizig'idan kamida 5 metr, qo'shni uy bilan yong'in oraliq masofasi kamida 6-10 metr saqlanishi shart.",
        law_basis: "SHNQ 2.07.01-03*, SHNQ 2.01.02-04",
        document_numbers: ["SHNQ 2.07.01-03*", "SHNQ 2.01.02-04"]
      },
      {
        step: 5,
        title: "5. Muhandislik tarmoqlari ulanishi (Texnik shartlar)",
        description: "Elektr energiyasi (Hududiy elektr tarmoqlari), Ichimlik suvi va gaz tarmoqlariga ulanish bo'yicha texnik shartlar (TU) olinadi.",
        law_basis: "QMQ 2.04.01-98, QMQ 2.04.05-18",
        document_numbers: ["QMQ 2.04.01-98", "QMQ 2.04.05-18"]
      },
      {
        step: 6,
        title: "6. Qurilish boshlanishi haqida xabarnoma yuborish",
        description: "Poydevor quyishdan oldin my.gov.uz orqali Qurilish nazorati inspeksiyasiga (GASK) elektron xabarnoma yuboriladi va ro'yxatdan o'tkaziladi.",
        law_basis: "Vazirlar Mahkamasining 200-son qarori",
        document_numbers: ["VMQ-200"]
      },
      {
        step: 7,
        title: "7. Qurilishni yakunlash va kadastrga kiritish",
        description: "Uy bitgach, tuman kadastr bo'limi mutaxassisi joyiga chiqib o'lchov qiladi va bino kadastr pasporti hamda foydalanishga topshirish dalolatnomasi rasmiylashtiriladi.",
        law_basis: "Yer kodeksi va Davlat kadastrlari palatasi reglamenti",
        document_numbers: ["VMQ-370"]
      }
    ],
    order_index: 1
  },
  {
    title: "Ofis va biznes markaz loyihalash",
    slug: "ofis-loyihalash",
    icon: "🏢",
    category: "design",
    subtitle: "Zamonaviy ofis binolari, open-space, xodimlar normasi va yong'in xavfsizligi",
    description: "A va B toifadagi ofislar, kovorkinglar va biznes markazlarni loyihalashtirishda xodimlar soniga nisbatan maydon, liftlar soni, sanitariya uzellari va ventilyatsiya talablari.",
    target_user: "Bosh arxitektorlar, interyer dizaynerlari, tijorat ko'chmas mulk developerlari",
    checklist: [
      {
        step: 1,
        title: "1. Ishchi o'rni maydoni me'yori",
        description: "Bitta kompyuterli ofis xodimi uchun kamida 6.0 kv.m toza maydon (Open Space sharoitida kamida 4.5 kv.m) bo'lishi shart.",
        law_basis: "SHNQ 2.08.02-19",
        document_numbers: ["SHNQ 2.08.02-19"]
      },
      {
        step: 2,
        title: "2. Evakuatsiya yo'llari va zinalar",
        description: "Yo'laklarning kengligi kamida 1.4-1.8 m, barcha chiqish eshiklari tashqariga qarab ochilishi va avtomatik tutun chiqarish klapanlari bo'lishi kerak.",
        law_basis: "SHNQ 2.01.02-04",
        document_numbers: ["SHNQ 2.01.02-04"]
      },
      {
        step: 3,
        title: "3. Toza havo va ventilyatsiya (HVAC)",
        description: "Har bir xodim uchun soatiga kamida 40-60 kub metr toza havo oqimi va markaziy chiller-fankoyl tizimi ko'zda tutiladi.",
        law_basis: "QMQ 2.04.05-18",
        document_numbers: ["QMQ 2.04.05-18"]
      },
      {
        step: 4,
        title: "4. To'siqsiz muhit (Inclusion / Accessibility)",
        description: "Kirishda pandus (1:12 qiyalik), aravacha sig'adigan lift va 1-qavatda maxsus 2.2x2.2 m o'lchamli sanuzel bo'lishi majburiy.",
        law_basis: "SHNQ 2.01.18-23",
        document_numbers: ["SHNQ 2.01.18-23"]
      }
    ],
    order_index: 2
  },
  {
    title: "Restoran va umumiy ovqatlanish maskani",
    slug: "restoran-kafe",
    icon: "🍽️",
    category: "interior",
    subtitle: "Oshxona texnologik zonasi, zallar, sanitariya va havoni tortish me'yorlari",
    description: "Restoran va kafelarni loyihalashda xomashyo va tayyor taom oqimlari kesishmasligi (potochnost), yuqori quvvatli gidrofiltrli ventilyatsiya va sanitariya zonalari talablari.",
    target_user: "Interyer arxitektorlari, restoran egalari, oshxona texnologlari",
    checklist: [
      {
        step: 1,
        title: "1. Zal va o'rindiq maydonlari",
        description: "Restoranda bitta mijoz uchun 1.8-2.0 kv.m, kafeda 1.4-1.6 kv.m maydon taqsimlanadi.",
        law_basis: "SHNQ 2.08.03-12",
        document_numbers: ["SHNQ 2.08.03-12"]
      },
      {
        step: 2,
        title: "2. Oshxona texnologik zonalari (Potochnost)",
        description: "Xom go'sht/sabzavot qabul qilish, issiq sex, sovuq sex va tarqatish zonalari bir yo'nalishda bo'lib, kirlangan idishlar oqimi toza taomlar bilan kesishmasligi shart.",
        law_basis: "SHNQ 2.08.03-12",
        document_numbers: ["SHNQ 2.08.03-12"]
      },
      {
        step: 3,
        title: "3. Alohida oshxona ventilyatsiyasi",
        description: "Oshxona va mangal dudburonlari bino umumiy ventilyatsiyasiga ulanmaydi, alohida tomgacha chiqarilib, gidrofiltr va yog' ushlagichlar o'rnatiladi.",
        law_basis: "QMQ 2.04.05-18",
        document_numbers: ["QMQ 2.04.05-18", "SHNQ 2.01.02-04"]
      }
    ],
    order_index: 3
  },
  {
    title: "Kvartira interyeri va qayta rejalashtirish (Pereplanirovka)",
    slug: "kvartira-interyeri",
    icon: "🛋️",
    category: "interior",
    subtitle: "Ruxsat etilgan va taqiqlangan o'zgarishlar, nam zonalar va yuk ko'taruvchi devorlar",
    description: "Ko'p qavatli uyda kvartirani qayta loyihalashda qat'iyan man etilgan holatlar, balkonni xonaga qo'shish va sanuzelni ko'chirish qoidalari.",
    target_user: "Interyer dizaynerlari, kvartira egalari, ta'mir ustalari",
    checklist: [
      {
        step: 1,
        title: "1. Yuk ko'taruvchi (Nesushiy) devorlar daxlsizligi",
        description: "Monolit ustunlar, diafragmalar va ko'p qavatli uylarning yuk ko'taruvchi temir-beton devorlarini buzish qat'iyan man etiladi.",
        law_basis: "QMQ 2.01.03-19, SHNQ 2.08.01-24",
        document_numbers: ["QMQ 2.01.03-19", "SHNQ 2.08.01-24"]
      },
      {
        step: 2,
        title: "2. Nam zonalarni (Sanuzel va oshxona) ko'chirish cheklovi",
        description: "Pastki qavatdagi qo'shnining yotoqxonasi yoki mehmonxonasi ustiga sanuzel yoki oshxona ko'chirish taqiqlanadi (faqat 1-qavatda yoki pastda noturar joy bo'lsa ruxsat etiladi).",
        law_basis: "SHNQ 2.08.01-24, QMQ 2.04.01-98",
        document_numbers: ["SHNQ 2.08.01-24", "QMQ 2.04.01-98"]
      },
      {
        step: 3,
        title: "3. Ventilyatsiya shaxtalarini kesmaslik",
        description: "Bino umumiy ventilyatsiya bloklarini (korob) buzish yoki toraytirish qat'iyan man etiladi.",
        law_basis: "QMQ 2.04.05-18",
        document_numbers: ["QMQ 2.04.05-18"]
      }
    ],
    order_index: 4
  },
  {
    title: "Zinapoya va evakuatsiya yo'llari loyihalash",
    slug: "zinapoya-loyihalash",
    icon: "🪜",
    category: "dimensions_standards",
    subtitle: "Zina balandligi, eni, qiyaligi va yong'inga qarshi to'siqlar",
    description: "Turar joy va jamoat binolarida odamlarning erkin va xavfsiz harakatlanishi uchun zina qadamlari (15x30 sm qoidasi), burilish maydonchalari va panjaralar balandligi me'yorlari.",
    target_user: "Arxitektorlar, konstruktorlar, interyer ustalari",
    checklist: [
      {
        step: 1,
        title: "1. Zina pog'onasi o'lchamlari (2h + b = 60-64 sm)",
        description: "Zina balandligi (podstupenok) 15-17 sm, eni (prostup) 28-30 sm bo'lishi eng qulay hisoblanadi. Turar joylarda maksimal balandlik 18 sm dan oshmasligi kerak.",
        law_basis: "SHNQ 2.08.01-24, SHNQ 2.08.02-19",
        document_numbers: ["SHNQ 2.08.01-24", "SHNQ 2.08.02-19"]
      },
      {
        step: 2,
        title: "2. Zina marshining minimal kengligi",
        description: "Yakka tartibdagi uyda kamida 0.9 m, ko'p xonadonli uyda kamida 1.05-1.2 m, jamoat binosida kamida 1.35-1.5 m bo'lishi shart.",
        law_basis: "SHNQ 2.01.02-04",
        document_numbers: ["SHNQ 2.01.02-04"]
      },
      {
        step: 3,
        title: "3. Panjara (Perila) balandligi",
        description: "Zina tutqichi balandligi toza zinadan kamida 90 sm, bolalar muassasalari va 3 qavatdan baland atriumlarda kamida 110-120 sm bo'lishi zarur.",
        law_basis: "SHNQ 2.08.02-19",
        document_numbers: ["SHNQ 2.08.02-19"]
      }
    ],
    order_index: 5
  },
  {
    title: "Yong'in xavfsizligi va to'siqlar",
    slug: "yongin-xavfsizligi",
    icon: "🔥",
    category: "fire_safety",
    subtitle: "Binolarning o'tga chidamliligi, yong'in devorlari va tutun chiqarish",
    description: "Qurilish obyektlarida yong'in tarqalishining oldini oluvchi devorlar (brandmauer), yong'inga qarshi eshiklar (EI 60) va gidrantlar joylashuvi.",
    target_user: "Bosh loyiha muhandislari, yong'in nazorati mutaxassislari",
    checklist: [
      {
        step: 1,
        title: "1. O'tga chidamlilik darajasi (I - V daraja)",
        description: "Ko'p qavatli binolar I yoki II darajali o'tga chidamli bo'lib, karkasi va orayopma plitalari kamida 90-120 daqiqa olovga bardosh berishi kerak.",
        law_basis: "SHNQ 2.01.02-04",
        document_numbers: ["SHNQ 2.01.02-04"]
      },
      {
        step: 2,
        title: "2. Yong'inga qarshi eshiklar (EI 30, EI 60)",
        description: "Zinapoya kataklariga, qozonxona va texnik xonalarga o'rnatiladigan eshiklar yong'inga qarshi sertifikatga ega bo'lishi shart.",
        law_basis: "SHNQ 2.01.02-04",
        document_numbers: ["SHNQ 2.01.02-04"]
      }
    ],
    order_index: 6
  }
];

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
        category VARCHAR(100) NOT NULL DEFAULT 'design',
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
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_normative_docs_cat ON normative_documents(category);
      CREATE INDEX IF NOT EXISTS idx_normative_docs_type ON normative_documents(document_type);
      CREATE INDEX IF NOT EXISTS idx_normative_docs_status ON normative_documents(status);
      CREATE INDEX IF NOT EXISTS idx_normative_docs_number ON normative_documents(document_number);
    `);

    // 2. Create practical_cases table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS practical_cases (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE,
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

    // 4. Ensure normatives section exists in library_sections
    try {
      await pool.query(`
        INSERT INTO library_sections (slug, name, subtitle, icon, description, order_index, is_active, is_visible)
        VALUES (
          'normatives',
          'Normativlar va amaliy yechimlar',
          'SHNQ, QMQ, standartlar va yo''riqnomalar',
          '📋',
          'Arxitektura, qurilish me''yorlari, SHNQ, QMQ va tayyor vaziyatlar tahlili',
          5,
          true,
          true
        )
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          subtitle = EXCLUDED.subtitle,
          icon = EXCLUDED.icon,
          description = EXCLUDED.description,
          order_index = 5,
          is_active = true,
          is_visible = true;
      `);
    } catch (e) {
      console.warn('normatives library section seed warn:', e.message);
    }

    // 5. Seed initial normatives if table is empty
    const checkCount = await pool.query('SELECT COUNT(*)::int AS cnt FROM normative_documents');
    if (checkCount.rows[0].cnt === 0) {
      console.log('Seeding authentic Uzbek normative documents...');
      for (const item of SEED_NORMATIVES) {
        await pool.query(`
          INSERT INTO normative_documents (
            title, document_number, document_type, category, description,
            requirements, target_audience, application_scope, status,
            adopted_date, effective_date, repealed_date, issuing_authority,
            official_source_url, pdf_url, old_edition_note, new_edition_note,
            change_date, tags, last_verified_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9,
            $10, $11, $12, $13, $14, $15, $16, $17,
            $18, $19, NOW()
          )
        `, [
          item.title, item.document_number, item.document_type, item.category, item.description,
          item.requirements, item.target_audience, item.application_scope, item.status,
          item.adopted_date || null, item.effective_date || null, item.repealed_date || null, item.issuing_authority || null,
          item.official_source_url || null, item.pdf_url || null, item.old_edition_note || null, item.new_edition_note || null,
          item.change_date || null, item.tags || [],
        ]);
      }
    }

    // 6. Seed initial practical cases if table is empty
    const checkCaseCount = await pool.query('SELECT COUNT(*)::int AS cnt FROM practical_cases');
    if (checkCaseCount.rows[0].cnt === 0) {
      console.log('Seeding authentic practical cases...');
      for (const cs of SEED_PRACTICAL_CASES) {
        const ins = await pool.query(`
          INSERT INTO practical_cases (
            title, slug, icon, category, subtitle, description, target_user, checklist, order_index
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id
        `, [
          cs.title, cs.slug, cs.icon, cs.category, cs.subtitle, cs.description, cs.target_user,
          JSON.stringify(cs.checklist), cs.order_index
        ]);

        const caseId = ins.rows[0].id;

        // Link documents mentioned in checklist
        for (const chItem of cs.checklist) {
          if (chItem.document_numbers && Array.isArray(chItem.document_numbers)) {
            for (const docNum of chItem.document_numbers) {
              const docRes = await pool.query('SELECT id FROM normative_documents WHERE document_number ILIKE $1 LIMIT 1', [docNum.trim()]);
              if (docRes.rows.length) {
                await pool.query(`
                  INSERT INTO case_documents (case_id, document_id, stage_name, notes)
                  VALUES ($1, $2, $3, $4)
                  ON CONFLICT DO NOTHING
                `, [caseId, docRes.rows[0].id, chItem.title, chItem.law_basis]);
              }
            }
          }
        }
      }
    }

    console.log('Normatives module initialized successfully.');
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
    limit = 50,
    offset = 0,
    sort = 'newest'
  } = options;

  let conditions = [];
  let values = [];
  let idx = 1;

  if (category && category !== 'all' && category !== 'Barchasi') {
    conditions.push(`category = $${idx++}`);
    values.push(category);
  }

  if (document_type && document_type !== 'all') {
    conditions.push(`document_type = $${idx++}`);
    values.push(document_type);
  }

  if (status && status !== 'all') {
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
      $${idx + 1} = ANY(tags)
    )`);
    values.push(q);
    values.push(search.trim().toLowerCase());
    idx += 2;
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  let orderBy = 'id DESC';
  if (sort === 'popular') orderBy = 'view_count DESC, id DESC';
  else if (sort === 'number') orderBy = 'document_number ASC';
  else if (sort === 'adopted') orderBy = 'adopted_date DESC NULLS LAST';

  const countQuery = `SELECT COUNT(*)::int AS total FROM normative_documents ${whereClause}`;
  const totalRes = await pool.query(countQuery, values);
  const total = totalRes.rows[0]?.total || 0;

  const dataQuery = `
    SELECT
      id, title, document_number, document_type, category,
      description, requirements, target_audience, application_scope,
      status, adopted_date, effective_date, repealed_date,
      issuing_authority, official_source_url, pdf_url,
      old_edition_note, new_edition_note, change_date,
      tags, view_count, last_verified_at, created_at
    FROM normative_documents
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT $${idx++} OFFSET $${idx++}
  `;

  values.push(Math.min(limit, 100));
  values.push(offset);

  const res = await pool.query(dataQuery, values);
  return { items: res.rows, total, limit, offset };
}

async function getNormativeDetail(pool, id) {
  const docRes = await pool.query(`
    SELECT * FROM normative_documents WHERE id = $1
  `, [id]);

  if (!docRes.rows.length) return null;
  const doc = docRes.rows[0];

  // Increment view count asynchronously
  pool.query('UPDATE normative_documents SET view_count = view_count + 1 WHERE id = $1', [id]).catch(() => {});

  // Fetch linked practical cases
  const casesRes = await pool.query(`
    SELECT pc.id, pc.title, pc.slug, pc.icon, cd.stage_name
    FROM case_documents cd
    JOIN practical_cases pc ON pc.id = cd.case_id
    WHERE cd.document_id = $1
  `, [id]);

  doc.linked_cases = casesRes.rows;
  return doc;
}

async function getPracticalCasesList(pool, options = {}) {
  const { category, search } = options;
  let conditions = ['is_active = true'];
  let values = [];
  let idx = 1;

  if (category && category !== 'all' && category !== 'Barchasi') {
    conditions.push(`category = $${idx++}`);
    values.push(category);
  }

  if (search && search.trim()) {
    conditions.push(`(
      LOWER(title) LIKE $${idx} OR
      LOWER(description) LIKE $${idx} OR
      LOWER(subtitle) LIKE $${idx}
    )`);
    values.push(`%${search.trim().toLowerCase()}%`);
    idx++;
  }

  const res = await pool.query(`
    SELECT
      id, title, slug, icon, category, subtitle,
      description, target_user, checklist, order_index, view_count
    FROM practical_cases
    WHERE ${conditions.join(' AND ')}
    ORDER BY order_index ASC, id ASC
  `, values);

  return res.rows;
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
      cd.stage_name, cd.notes
    FROM case_documents cd
    JOIN normative_documents nd ON nd.id = cd.document_id
    WHERE cd.case_id = $1
    ORDER BY cd.sort_order ASC, nd.id ASC
  `, [cs.id]);

  cs.documents = docsRes.rows;
  return cs;
}

async function getNormativesStats(pool) {
  const statsRes = await pool.query(`
    SELECT
      COUNT(*)::int AS total_documents,
      COUNT(CASE WHEN status = 'AMALDA' THEN 1 END)::int AS active_count,
      COUNT(CASE WHEN status = 'O‘ZGARTIRILGAN' THEN 1 END)::int AS modified_count,
      COUNT(CASE WHEN status = 'KUCHINI YO‘QOTGAN' THEN 1 END)::int AS repealed_count,
      COUNT(CASE WHEN document_type = 'SHNQ' THEN 1 END)::int AS shnq_count,
      COUNT(CASE WHEN document_type = 'QMQ' THEN 1 END)::int AS qmq_count,
      (SELECT COUNT(*)::int FROM practical_cases WHERE is_active = true) AS cases_count
    FROM normative_documents
  `);
  return statsRes.rows[0] || {};
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
