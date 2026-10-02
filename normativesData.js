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
    content_type: "normative",
    source_type: "ministry",
    source_title: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi",
    description: "Yakka tartibdagi va ko'p xonadonli turar joy binolarini loyihalash, xonalar o'lchamlari, balandliklari, yoritilishi va muhandislik jihozlariga qo'yiladigan asosiy davlat shaharsozlik talablari.",
    requirements: "Turar joy xonalarining balandligi toza pol sathidan shiftgacha kamida 2.5 m (turar joy qavatlarida) bo'lishi shart. Bitta xonali kvartiralar maydoni kamida 28 kv.m, 2 xonali kamida 44 kv.m. Oshxona kengligi kamida 1.9 m, maydoni kamida 8 kv.m (alohida oshxona uchun). Xonalarda tabiiy yorug'lik KEO koeffitsienti me'yorlariga javob berishi zarur.",
    target_audience: "Arxitektorlar, loyihachilar, quruvchi-pudratchilar, buyurtmachilar",
    application_scope: "Yangi turar joy binolarini loyihalash, yakka tartibdagi uylar, ko'p qavatli turar joy majmualari, rekonstruksiya va kapital ta'mirlash",
    status: "AMALDA",
    adopted_date: "2024-08-14",
    effective_date: "2024-09-01",
    issuing_authority: "O'zbekiston Respublikasi Qurilish va uy-joy kommunal xo'jaligi vazirligi",
    official_source_url: "https://mc.uz/",
    pdf_url: "https://lex.uz/uz/search/nat?number=SHNQ%202.08.01-24",
    sources: [
      { title: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi (mc.uz)", type: "ministry", url: "https://mc.uz/", note: "Amaldagi rasmiy normativ hujjat tahriri" },
      { title: "Lex.uz — Qonunchilik milliy bazasi", type: "lex", url: "https://lex.uz/docs/7084512", note: "Davlat ro'yxatiga olingan rasmiy matn" },
      { title: "Kutubxona kitobi: «Fuqaro va sanoat binolari arxitekturasi» (2021)", type: "book", note: "O'quv manbasi: xonalar proporsiyasi va ergonomikasi" }
    ],
    practical_example: `Berilgan:
- 2 xonali kvartira (umumiy loyihaviy maydon: 54 m²)
- Xonalar: Mehmonxona, yotoqxona, alohida oshxona, sanuzel, koridor.

Loyiha holati:
Xonalar maydonini me'yoriy talablar bilan moslashtirish.

Normativ talab (SHNQ 2.08.01-24, 3.4-band):
- Asosiy zal: kamida 14-16 m²
- Yotoqxona: kamida 10-12 m²
- Oshxona: kamida 8 m² (eni kamida 1.9 m)
- Shift balandligi: kamida 2.5 m (toza poldan)

Hisob va natija:
- Mehmonxona: 3.40 × 5.00 = 17.0 m² (me'yordan ortiq, a'lo)
- Yotoqxona: 3.20 × 4.00 = 12.8 m² (2 kishilik karavot va shkaf erkin sig'adi)
- Oshxona: 2.40 × 3.60 = 8.64 m² (eni 2.4 m > 1.9 m, to'liq mos)
- Sanuzel: 1.80 × 2.20 = 3.96 m²
- Koridor va dahliz: 11.6 m²
Jami toza maydon: 54.0 m² — Loyiha to'liq davlat ekspertizasi me'yoriga javob beradi.`,
    book_reference: "«Fuqaro va sanoat binolari arxitekturasi» (Muallif: Q.Q. Qosimov, Toshkent, 2021-yil, 3-bob, 48-bet) — amaliy rejalashtirish bo'yicha o'quv qo'llanma.",
    old_edition_note: "SHNQ 2.08.01-19 o'rniga qabul qilingan. Yangi tahrirda energiya tejamkorlik, ovoz izolyatsiyasi va zamonaviy xonadon rejalashtirish talablari kuchaytirildi.",
    new_edition_note: "2024-yil avgust oyida tasdiqlangan amaldagi bosh tahrir.",
    change_date: "2024-08-14",
    tags: ["turar joy", "uy", "kvartira", "xona o'lchamlari", "shift balandligi", "oshxona", "shnq", "zinapoya", "interyer"]
  },
  {
    document_number: "SHNQ 2.08.01-19",
    title: "Turar joy binolari (2019-yil eski tahriri)",
    document_type: "SHNQ",
    category: "Loyihalash",
    content_type: "normative",
    source_type: "lex",
    source_title: "Lex.uz (Tarixiy arxiv)",
    description: "Turar joy binolari bo'yicha 2019-2024 yillarda amalda bo'lgan va hozirda o'z kuchini yo'qotgan shaharsozlik me'yori.",
    requirements: "Eski tahrir bo'yicha talablar.",
    target_audience: "Arxitektorlar, sud ekspertlari (qurilgan eski binolarni tekshirishda)",
    application_scope: "2024-yil sentyabrgacha loyihalangan va qurilgan binolar",
    status: "KUCHINI YO‘QOTGAN",
    adopted_date: "2019-02-15",
    effective_date: "2019-03-01",
    repealed_date: "2024-09-01",
    issuing_authority: "Qurilish vazirligi",
    official_source_url: "https://lex.uz/",
    sources: [
      { title: "Lex.uz — Davlat ro'yxati arxivi", type: "lex", url: "https://lex.uz/", note: "Kuchini yo'qotgan hujjat" }
    ],
    old_edition_note: "DIQQAT: Ushbu me'yor SHNQ 2.08.01-24 qabul qilinishi munosabati bilan o'z kuchini YO'QOTGAN. Loyihalashda yangi SHNQ 2.08.01-24 me'yorlaridan foydalanilsin!",
    tags: ["turar joy", "eski tahrir", "shnq", "kuchini yo'qotgan"]
  },

  // 2. Seysmik va konstruktiv talablar
  {
    document_number: "QMQ 2.01.03-19",
    title: "Zilzilabardosh binolarni loyihalash",
    document_type: "QMQ",
    category: "Konstruksiya",
    content_type: "normative",
    source_type: "ministry",
    source_title: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi",
    description: "O'zbekiston hududidagi seysmik (7, 8, 9 ball) hududlarda poydevor, temir-beton karkas, monolit va g'ishtli binolarni seysmik hisoblash hamda konstruktiv mustahkamlash qoidalari.",
    requirements: "Zilzila kuchi 7, 8 va 9 ball bo'lgan zonalarda poydevorlar monolit tasmali yoki yaxlit plita shaklida loyihalashtiriladi. G'ishtli devorlarda antseysmik belbog'lar (seysmopoyas) har bir qavat oralig'ida uzluksiz o'rnatilishi shart. Ustun va rigellarning tutashuv joylari seysmik hisob bo'yicha kuchaytirilgan armatura to'ri bilan mustahkamlanadi.",
    target_audience: "Konstruktor-muhandislar, bosh konstruktorlar, loyiha bosh muhandislari (GIP)",
    application_scope: "Barcha turdagi bino va inshootlarning poydevori, karkasi va yuk ko'taruvchi konstruksiyalarini loyihalash",
    status: "AMALDA",
    adopted_date: "2019-06-20",
    effective_date: "2019-07-01",
    issuing_authority: "Qurilish vazirligi",
    official_source_url: "https://mc.uz/",
    pdf_url: "https://lex.uz/uz/search/nat?number=QMQ%202.01.03-19",
    sources: [
      { title: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi", type: "ministry", url: "https://mc.uz/", note: "Rasmiy tasdiqlangan qurilish normativi" },
      { title: "Lex.uz — Qonunchilik milliy bazasi", type: "lex", url: "https://lex.uz/docs/4425687", note: "Rasmiy elektron matn" },
      { title: "Kutubxona kitobi: «Zilzilabardosh inshootlar hisobi» (2020)", type: "book", note: "O'quv adabiyoti: seysmik karkas hisoblash usullari" }
    ],
    practical_example: `Berilgan:
- Bino: 2 qavatli yakka tartibdagi uy (Toshkent shahri, 8 balli seysmik zona)
- Konstruktiv sxema: G'isht devorli, monolit orayopmali

Loyiha holati:
Seysmopoyas (antseysmik belbog') parametrlarini tanlash.

Normativ talab (QMQ 2.01.03-19, 3.4-band):
- 8 balli hududda yuk ko'taruvchi g'isht devorlar ustidan uzluksiz temir-beton belbog' o'rnatilishi shart.
- Belbog' balandligi kamida 150 mm, eni devor qalinligiga teng (yoki kamida 250 mm).
- Armaturasi kamida 4 dona d=12 mm (A400 sinf) bo'ylama sterjenlar.

Hisob va natija:
- Devor qalinligi 380 mm (1.5 g'isht).
- Seysmopoyas kesimi: 380 × 200 mm.
- Armaturalash: 4 dona ∅12 mm A400, xomutlar ∅6 mm har 150 mm qadamda.
- Beton sinfi: kamida B15 (M200).
Natija: Orayopma plitalari seysmopoyasga kamida 120 mm chuqurlikda tayanadi va seysmik xavfsizlik to'liq ta'minlanadi.`,
    book_reference: "«Zilzilabardosh binolar konstruksiyalari» (Muallif: A.A. Asqarov, Toshkent, 2020-yil, 5-bob, 112-bet) — amaliy konstruktiv hisoblash o'quv manbasi.",
    new_edition_note: "Amaldagi me'yoriy hujjat. Zamonaviy BIM hisoblash dasturlari (LIRA-SAPR, SCAD, ETABS) uchun tavsiyalar kiritilgan.",
    tags: ["seysmika", "zilzila", "konstruksiya", "poydevor", "armatura", "beton", "seysmopoyas", "qmq"]
  },

  // 3. Shaharsozlik va rejalashtirish
  {
    document_number: "SHNQ 2.07.01-03*",
    title: "Shaharsozlik. Shahar va qishloq aholi punktlarini rejalashtirish va qurish",
    document_type: "SHNQ",
    category: "Shaharsozlik",
    content_type: "normative",
    source_type: "ministry",
    source_title: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi",
    description: "Yer uchastkasida binolarni joylashtirish, qo'shni yer chegarasigacha masofalar, qizil chiziqlar, yo'llar, avtoturargohlar va hudud zichligi me'yorlari.",
    requirements: "Yakka tartibdagi uy-joy binosidan qo'shni yer chegarasigacha masofa kamida 3 metr bo'lishi shart. Yordamchi binolar (garaj, oshxona, ombor)dan qo'shni chegaragacha kamida 1 metr masofa qoldirilishi ruxsat etiladi. Ko'chaning qizil chizig'idan bino fasadiga qadar masofa kamida 5 metr, o'tish yo'llaridan (proezd) kamida 3 metr bo'lishi talab qilinadi.",
    target_audience: "Bosh rejachilar, shaharsozlar, arxitektorlar, yer kadastri mutaxassislari",
    application_scope: "Bosh reja tuzish, yer uchastkasida uyni joylashtirish (sitplan), posyolka va massivlar loyihalash",
    status: "O‘ZGARTIRILGAN",
    adopted_date: "2003-11-20",
    effective_date: "2004-01-01",
    issuing_authority: "Davlat arxitektura va qurilish qo'mitasi / Qurilish vazirligi",
    official_source_url: "https://mc.uz/",
    pdf_url: "https://lex.uz/docs/1344820",
    sources: [
      { title: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi", type: "ministry", url: "https://mc.uz/", note: "Texnik me'yorlash markazi rasmiy amaldagi tahriri" },
      { title: "Lex.uz — Qonunchilik milliy bazasi", type: "lex", url: "https://lex.uz/docs/1344820", note: "O'zgartirish va qo'shimchalari bilan rasmiy matn" },
      { title: "Kutubxona kitobi: «Shaharsozlik asoslari va landshaft arxitekturasi» (2022)", type: "book", note: "O'quv qo'llanma: Bosh reja va masofalar tahlili" }
    ],
    practical_example: `Berilgan:
- Yer uchastkasi o'lchami: 20 × 30 metr (6 sotix)
- Ko'cha: 12 metrli turar joy o'tish yo'li (qizil chiziq belgilangan)
- Qo'shnilar: Ikki yon tomonida va orqa tomonda qo'shni hovlilar bor.

Loyiha holati:
2 qavatli kottej (12×10 m) va garaj (4×6 m) joylashtirish sitplanini tuzish.

Normativ talab (SHNQ 2.07.01-03*, 4.12-band):
- Asosiy uy devoridan qo'shni chegarasigacha: kamida 3.0 m
- Garaj devoridan qo'shni chegarasigacha: kamida 1.0 m
- Ko'chaning qizil chizig'idan uy fasadigacha: kamida 5.0 m

Hisob va natija:
- Ko'cha tomondan oraliq: 5.5 m (me'yor kamida 5.0 m — to'liq mos).
- O'ng qo'shnigacha masofa: 3.2 m (kamida 3.0 m — to'liq mos).
- Chap qo'shnigacha (garaj qo'yilgan): Garaj orasi 1.2 m (kamida 1.0 m — to'liq mos).
- Orqa hovli chegarasigacha: 8.5 m (yashil hudud va bog' uchun).
Natija: Sitplan Davlat xizmatlari (APZ) va shaharsozlik kengashi tekshiruvidan to'siqsiz o'tadi.`,
    book_reference: "«Shaharsozlik asoslari» (Muallif: S.R. Mansurov, 2022-yil, 2-bob, 34-bet) — o'quv metodik manba.",
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
    content_type: "normative",
    source_type: "official",
    source_title: "O'zbekiston FVV / Qurilish vazirligi",
    description: "Binolarning o'tga chidamlilik darajasi, yong'inga qarshi to'siqlar, devorlar, evakuatsiya yo'llari va chiqish eshiklari parametrlarini belgilovchi bosh hujjat.",
    requirements: "Evakuatsiya chiqish yo'laklarining minimal kengligi 1.2 m dan, eshiklar kengligi 0.9 m dan kam bo'lmasligi kerak. Zinapoya kataklariga tabiiy yorug'lik tushishi shart. Zinapoyalar yong'inga chidamliligi kamida 1 soat (REI 60) bo'lgan materiallardan quriladi. Ko'p qavatli binolarda tutunga qarshi shlyuzlar va tutun chiqarish klapanlari o'rnatiladi.",
    target_audience: "Arxitektorlar, konstruktorlar, yong'in xavfsizligi ekspertlari",
    application_scope: "Barcha jamoat, turar joy, sanoat va savdo obyektlari loyihalarida majburiy",
    status: "AMALDA",
    adopted_date: "2004-04-12",
    effective_date: "2004-07-01",
    issuing_authority: "Qurilish vazirligi va Favqulodda vaziyatlar vazirligi (FVV)",
    official_source_url: "https://mc.uz/",
    pdf_url: "https://lex.uz/uz/search/nat?number=SHNQ%202.01.02-04",
    sources: [
      { title: "Favqulodda vaziyatlar vazirligi (FVV) yong'in nazorati", type: "official", url: "https://fvv.uz/", note: "Yong'in xavfsizligi davlat nazorati talablari" },
      { title: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi", type: "ministry", url: "https://mc.uz/", note: "Shaharsozlik normativ hujjati" },
      { title: "Lex.uz — Qonunchilik milliy bazasi", type: "lex", url: "https://lex.uz/docs/1512410", note: "Rasmiy matn" },
      { title: "Kutubxona kitobi: «Binolarning yong'in xavfsizligi asoslari» (2021)", type: "book", note: "O'quv manbasi: evakuatsiya hisobi metodikasi" }
    ],
    practical_example: `Berilgan:
- Bino: 3 qavatli savdo-ofis markazi
- Qavatdagi odamlar soni: 80 nafar xodim va mijoz
- Koridor uzunligi: 24 metr

Loyiha holati:
Evakuatsiya yo'li va chiqish eshiklari kengligini hisoblash.

Normativ talab (SHNQ 2.01.02-04, 4.2 va 4.5-bandlar):
- 50 kishidan ortiq bo'lganda kamida 2 ta mustaqil evakuatsiya chiqishi shart.
- Umumiy koridor kengligi kamida 1.5 m.
- Evakuatsiya eshigi toza kengligi kamida 0.9 m, ochilishi FAQAT TASHQARIGA (evakuatsiya yo'nalishi tomon).

Hisob va natija:
- Koridor kengligi 1.80 m loyihalandi (me'yordan kengroq, a'lo).
- Binoning qarama-qarshi ikki chetiga 2 ta alohida L1 toifali zinapoya katagi o'rnatildi.
- Chiqish eshiklari 1000×2100 mm (toza o'tish eni 900 mm), eshiklar 'Antipanika' tutqichi bilan jihozlandi.
Natija: Yong'in ekspertizasi va FVV talablariga 100% mos.`,
    book_reference: "«Binolarning yong'in xavfsizligi» (Muallif: M.T. To'laganov, 2021-yil, 4-bob, 76-bet) — o'quv qo'llanma.",
    tags: ["yong'in", "evakuatsiya", "chiqish yo'li", "eshik kengligi", "zinapoya", "tutun", "shnq"]
  },

  // 5. Jamoat binolari
  {
    document_number: "SHNQ 2.08.02-19",
    title: "Jamoat binolari va inshootlari",
    document_type: "SHNQ",
    category: "Loyihalash",
    content_type: "normative",
    source_type: "ministry",
    source_title: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi",
    description: "Ofislar, biznes markazlar, maktablar, o'quv markazlari, banklar va ma'muriy binolarni loyihalash bo'yicha kompleks me'yorlar.",
    requirements: "Ofis xonalarida har bir xodim uchun kamida 4.5 - 6.0 kv.m foydali maydon ta'minlanishi shart. Koridor kengligi asosiy o'tish joylarida kamida 1.5 - 1.8 m bo'lishi kerak. Binoga kirish qismida pandus yoki ko'targich o'rnatilishi zarur. Binoda kamida ikkita mustaqil evakuatsiya chiqishi nazarda tutilishi shart.",
    target_audience: "Bosh loyihachilar, arxitektorlar, ofis va tijorat binosi buyurtmachilari",
    application_scope: "Biznes markazlar, kovorkinglar, banklar, o'quv muassasalari, ma'muriy binolar",
    status: "AMALDA",
    adopted_date: "2019-11-15",
    effective_date: "2020-01-01",
    issuing_authority: "Qurilish vazirligi",
    official_source_url: "https://mc.uz/",
    pdf_url: "https://lex.uz/docs/4648512",
    sources: [
      { title: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi", type: "ministry", url: "https://mc.uz/", note: "Jamoat binolari bo'yicha amaldagi shaharsozlik normasi" },
      { title: "Lex.uz — Qonunchilik milliy bazasi", type: "lex", url: "https://lex.uz/docs/4648512", note: "Rasmiy matn" },
      { title: "Kutubxona kitobi: «Jamoat binolari arxitekturasi» (2020)", type: "book", note: "O'quv manbasi: ofislar va maktablar tipologiyasi" }
    ],
    practical_example: `Berilgan:
- Open-space ofis zali: 120 m² toza maydon
- Rejalashtirilayotgan xodimlar soni: 20 kishi kompyuterli ish o'rni bilan

Loyiha holati:
Zal sig'imini va ish o'rinlari joylashuvini me'yorlar bo'yicha tekshirish.

Normativ talab (SHNQ 2.08.02-19, 3.14-band):
- 1 nafar kompyuterli xodim uchun minimal maydon: kamida 4.5 m² (optimal 6.0 m²)
- Koridor va stollar oralig'i: kamida 1.2 m

Hisob va natija:
- Talab qilinadigan minimal maydon: 20 × 4.5 = 90 m²
- Haqiqiy maydon: 120 m² (kishi boshiga 6.0 m² to'g'ri keladi — ideal ergonomik sharoit).
- Stollar qatorlari oralig'i: 1.4 m (harakatlanish erkin).
Natija: Sanitariya va mehnat muhofazasi talablariga to'liq javob beradi.`,
    book_reference: "«Jamoat binolari arxitekturasi» (Muallif: R.A. Akromov, 2020-yil, 6-bob, 94-bet) — o'quv qo'llanma.",
    tags: ["ofis", "jamoat binosi", "biznes markaz", "koridor", "evakuatsiya", "xodim maydoni", "shnq"]
  },

  // 6. Imkoniyati cheklanganlar (Inklusivlik & Accessibility)
  {
    document_number: "SHNQ 2.01.18-23",
    title: "Aholining imkoniyati cheklangan (nogironlar) guruhlari uchun yashash muhiti qulayligini ta'minlash",
    document_type: "SHNQ",
    category: "O‘lchamlar va standartlar",
    content_type: "normative",
    source_type: "ministry",
    source_title: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi",
    description: "Nogironlar aravachasi, ko'zi ojiz va harakati cheklangan insonlar uchun panduslar, eshik ostonalari, liftlar, taktil plitkalar va maxsus sanuzellar bo'yicha zamonaviy talablar.",
    requirements: "Pandus qiyaligi 1:12 (8%) dan oshmasligi shart (maksimal ko'tarilish 0.8 m bo'lganda). Pandus kengligi bir tomonlama harakat uchun kamida 1.0 m, ikki tomonlama uchun 1.5 m. Pandus ikki tomonida 0.7 m va 0.9 m balandlikda tutqichlar (perila) o'rnatiladi. Eshik ostonasi (porog) balandligi 14 mm (1.4 sm) dan oshmasligi kerak. Universal nogironlar sanuzeli minimal o'lchami 2.20 x 1.60 m bo'lishi shart.",
    target_audience: "Arxitektorlar, interyer dizaynerlar, shaharsozlar, ekspertiza tashkilotlari",
    application_scope: "Barcha jamoat, savdo, turar joy kirish zonalari va infratuzilma obyektlarida majburiy",
    status: "AMALDA",
    adopted_date: "2023-09-08",
    effective_date: "2023-11-01",
    issuing_authority: "Qurilish va uy-joy kommunal xo'jaligi vazirligi",
    official_source_url: "https://mc.uz/",
    pdf_url: "https://lex.uz/docs/6625890",
    sources: [
      { title: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi", type: "ministry", url: "https://mc.uz/", note: "Inklyuziv shaharsozlik standarti" },
      { title: "Lex.uz — Qonunchilik milliy bazasi", type: "lex", url: "https://lex.uz/docs/6625890", note: "Rasmiy tasdiqlangan hujjat matni" },
      { title: "Kutubxona kitobi: «Inklyuziv arxitektura va universal dizayn» (2023)", type: "book", note: "O'quv qo'llanma: to'siqsiz muhit loyihalash qoidalari" }
    ],
    practical_example: `Berilgan:
- Bino krilsosi balandligi: H = 0.60 m (60 sm, 4 ta zinapoya pog'onasi)
- Bosh kirish eshigi kengligi: 1.0 m

Loyiha holati:
Aravachada harakatlanuvchi insonlar uchun kirish pandusi va universal sanuzel o'lchami hisobi.

Normativ talab (SHNQ 2.01.18-23, 3.2 va 3.10-bandlar):
- Pandus maksimal qiyaligi: 1:12 (8% yoki 4.76°)
- Pandus kengligi: kamida 1.0 m (tutqichlar orasi)
- Universal sanuzel o'lchami: kamida 2.20 × 1.60 m

Hisob va natija:
- Pandus uzunligi: L = H × 12 = 0.60 × 12 = 7.2 metr.
- Pandus boshida va oxirida 1.5×1.5 m gorizontal burilish maydonchasi qoldirildi.
- Ikki tomoniga 70 sm va 90 sm balandlikda tutqichlar o'rnatildi, chetiga 5 sm li himoya bortigi qilindi.
- Sanuzel 2.30 × 1.80 m (4.14 m²) loyihalandi, ichiga otkidnoy tutqich va 90 sm li tashqariga ochiladigan eshik qo'yildi.
Natija: To'siqsiz inklyuziv muhit talablariga 100% javob beradi.`,
    book_reference: "«Inklyuziv arxitektura asoslari» (Muallif: F.H. Yo'ldoshev, 2023-yil, 2-bob, 28-bet) — amaliy o'quv manbasi.",
    tags: ["nogironlar", "pandus", "accessibility", "taktil", "sanuzel", "eshik kengligi", "shnq", "standart"]
  },

  // 7. HVAC / Ventilyatsiya va Isitish
  {
    document_number: "QMQ 2.04.05-18",
    title: "Isitish, shamollatish va havoni tozalash (HVAC)",
    document_type: "QMQ",
    category: "O‘lchamlar va standartlar",
    content_type: "normative",
    source_type: "ministry",
    source_title: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi",
    description: "Turar joy, ofis va jamoat binolarida mikroklimat, toza havo almashinuvi, radiatorlar joylashuvi va ventilyatsiya shaxtalarini loyihalash qoidalari.",
    requirements: "Turar joylarda toza havo kiritish miqdori kishi boshiga kamida 30 m3/soat yoki 1 m2 maydonga 3 m3/soat deb olinadi. Oshxonalarda 4 konforkali gaz plitasi bo'lganda tabiiy yoki majburiy tortish quvvati kamida 90 m3/soat, sanuzellarda 25 m3/soat bo'lishi shart. Ventilyatsiya shaxtalari o'tga chidamli materiallardan alohida kanal ko'rinishida tom ustiga chiqariladi.",
    target_audience: "HVAC muhandislari, OViK loyihachilari, arxitektorlar",
    application_scope: "Barcha turar joy va jamoat binolari mikroklimat tizimlari",
    status: "AMALDA",
    adopted_date: "2018-05-10",
    effective_date: "2018-07-01",
    issuing_authority: "Qurilish vazirligi",
    official_source_url: "https://mc.uz/",
    pdf_url: "https://lex.uz/docs/3784125",
    sources: [
      { title: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi", type: "ministry", url: "https://mc.uz/", note: "HVAC bo'yicha bosh amaldagi qurilish normativi" },
      { title: "Lex.uz — Qonunchilik milliy bazasi", type: "lex", url: "https://lex.uz/docs/3784125", note: "Rasmiy matn" },
      { title: "Kutubxona kitobi: «Binolarning isitish va ventilyatsiya tizimlari» (2019)", type: "book", note: "O'quv qo'llanma: havoni hisoblash formulalari" }
    ],
    practical_example: `Berilgan:
- 3 xonali kvartira (yashash maydoni 42 m², 4 kishi istiqomat qiladi)
- Oshxona: 4 konforkali gaz plitasi bilan
- Sanuzel: Birlashgan (vanna + unitaz)

Loyiha holati:
Kvartira uchun zarur toza havo oqimi va tortish kanallari quvvatini hisoblash.

Normativ talab (QMQ 2.04.05-18, 4.15 va 4.20-bandlar):
- Yashash xonalari oqimi: L1 = S_yashash × 3 m³/soat = 42 × 3 = 126 m³/soat
- Odamlar bo'yicha: L2 = N × 30 m³/soat = 4 × 30 = 120 m³/soat. Boshlang'ich oqim: 126 m³/soat.
- Oshxona tortish normasi: kamida 90 m³/soat
- Birlashgan sanuzel tortish: kamida 50 m³/soat (alohida bo'lsa 25+25 m³/soat)
- Jami chiqariladigan havo: 90 + 50 = 140 m³/soat.

Natija:
- Havoni muvozanatlash uchun yashash xonalariga deraza klapanlari orqali kamida 140 m³/soat toza havo kirishi ta'minlanadi.
- Oshxonada 140×140 mm g'ishtli vertikal shaxta, sanuzelda 140×140 mm mustaqil shaxta loyihalandi. Havo balansi to'liq saqlanadi.`,
    book_reference: "«Isitish va ventilyatsiya» (Muallif: O.Q. Qodirov, 2019-yil, 3-bob, 52-bet) — o'quv metodik manbasi.",
    tags: ["ventilyatsiya", "isitish", "hvac", "havo almashinuvi", "oshxona havosi", "radiator", "qmq"]
  },

  // 8. Suv ta'minoti va kanalizatsiya (VK)
  {
    document_number: "QMQ 2.04.01-98",
    title: "Binolarning ichki suv quvuri va kanalizatsiyasi",
    document_type: "QMQ",
    category: "O‘lchamlar va standartlar",
    content_type: "normative",
    source_type: "ministry",
    source_title: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi",
    description: "Binolar ichidagi sovuq va issiq suv tizimi, kanalizatsiya quvurlari diametrlari, nishabliklari va montaj talablari.",
    requirements: "Ichki kanalizatsiya quvurlari minimal nishabligi d=50 mm bo'lganda 0.03 (1 metrga 3 sm), d=100 mm bo'lganda 0.02 (1 metrga 2 sm) bo'lishi shart. Unitazning kanalizatsiya tik quvuriga (stoyak) ulanish masofasi 1 metrdan oshmasligi tavsiya etiladi. Suv quvurlari bosimi sanitar asboblarda 0.45 MPa dan oshmasligi lozim.",
    target_audience: "VK muhandislari, santexnika mutaxassislari, interyer arxitektorlari",
    application_scope: "Turar joy, kottej, ofis va sanoat obyektlarining ichki muhandislik tarmoqlari",
    status: "AMALDA",
    adopted_date: "1998-10-14",
    effective_date: "1999-01-01",
    issuing_authority: "Qurilish vazirligi",
    official_source_url: "https://mc.uz/",
    pdf_url: "https://lex.uz/docs/984120",
    sources: [
      { title: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi", type: "ministry", url: "https://mc.uz/", note: "Ichki suv va kanalizatsiya amaldagi normativi" },
      { title: "Lex.uz — Qonunchilik milliy bazasi", type: "lex", url: "https://lex.uz/docs/984120", note: "Rasmiy matn" },
      { title: "Kutubxona kitobi: «Suv ta'minoti va oqova suv tizimlari» (2020)", type: "book", note: "O'quv qo'llanma: nishabliklar va gidravlika hisoblari" }
    ],
    practical_example: `Berilgan:
- Rakovinadan stoyakkacha masofa: L = 3.2 metr (quvur d=50 mm)
- Dush trapidan stoyakkacha: L = 1.5 metr (quvur d=50 mm)
- Unitazdan stoyakkacha: L = 0.8 metr (quvur d=110 mm)

Loyiha holati:
Pol stajkasi ostidagi quvurlar nishabligini va zarur stajka qalinligini hisoblash.

Normativ talab (QMQ 2.04.01-98, 3.2-band):
- d=50 mm truba uchun minimal nishablik: 0.03 (1 metrga 3 sm)
- d=110 mm truba uchun minimal nishablik: 0.02 (1 metrga 2 sm)

Hisob va natija:
- Rakovina trubasining tushishi: 3.2 m × 3 sm/m = 9.6 sm (kamida 10 sm pasayish zarur).
- Dush trapining tushishi: 1.5 m × 3 sm/m = 4.5 sm pasayish.
- Unitaz tushishi: 0.8 m × 2 sm/m = 1.6 sm pasayish.
Natija: Stajka qalinligi kamida 11-12 sm bo'lishi yoki rakovina quvuri devor ichidan shtroba orqali tortilishi rejalashtirildi. Suv to'xtovsiz oqishi kafolatlanadi.`,
    book_reference: "«Suv ta'minoti va kanalizatsiya» (Muallif: Sh.A. Alimov, 2020-yil, 4-bob, 68-bet) — o'quv manbasi.",
    tags: ["suv", "kanalizatsiya", "santexnika", "nishablik", "truba", "quvur diametri", "qmq"]
  },

  // 9. Qurilish materiallari standarti
  {
    document_number: "O'z DSt 3524:2021",
    title: "Qurilish materiallari va buyumlari. Tasniflash va umumiy xavfsizlik talablari",
    document_type: "O‘z DSt",
    category: "Qurilish materiallari",
    content_type: "normative",
    source_type: "official",
    source_title: "O‘zstandart agentligi / O‘zbekiston texnik jihatdan tartibga solish agentligi",
    description: "G'isht, beton, armatura, issiqlik izolyatsiyasi, quruq qorishmalar va pardozlash materiallarining radiatsiyaviy, ekologik hamda mustahkamlik me'yorlari.",
    requirements: "Turar joy va jamoat binolarida qo'llaniladigan materiallarning tabiiy radionuklidlar solishtirma samarali faolligi (Aeff) 370 Bk/kg dan oshmasligi shart (I toifa). Barcha yuk ko'taruvchi konstruksiya materiallari muvofiqlik sertifikatiga ega bo'lishi talab qilinadi.",
    target_audience: "Laboratoriya mutaxassislari, texnik nazorat muhandislari, smetachilar, ta'minotchilar",
    application_scope: "O'zbekistonda ishlab chiqariladigan va import qilinadigan barcha qurilish mahsulotlari",
    status: "AMALDA",
    adopted_date: "2021-04-16",
    effective_date: "2021-06-01",
    issuing_authority: "O'zbekiston texnik jihatdan tartibga solish agentligi (Standart.uz)",
    official_source_url: "https://standart.uz/",
    sources: [
      { title: "O‘zbekiston texnik jihatdan tartibga solish agentligi (Standart.uz)", type: "official", url: "https://standart.uz/", note: "Davlat standarti rasmiy reyestri" },
      { title: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi", type: "ministry", url: "https://mc.uz/", note: "Sertifikatlangan materiallar katalogi" },
      { title: "Kutubxona kitobi: «Qurilish materialshunosligi» (2021)", type: "book", note: "O'quv manbasi: materiallar xususiyatlari va laboratoriya sinovlari" }
    ],
    practical_example: `Berilgan:
- Ob'yekt: 9 qavatli turar joy binosi
- Material: Fasadni izolyatsiya qilish uchun mineral bazalt vata va ichki pardoz uchun gipsokarton plitalari

Loyiha holati:
Materiallarning yong'in xavfsizligi va ekologik toifasini normaga tekshirish.

Normativ talab (O'z DSt 3524:2021, 5-bob):
- Tashqi fasad issiqlik izolyatsiyasi: Yonmaydigan (NG - Negoryuchiy) toifasida bo'lishi shart.
- Ichki xonalar pardozlash plitalari: Formaldegid emissiyasi E1 toifasidan oshmasligi shart.

Hisob va natija:
- Fasadga 100 mm qalinlikdagi, zichligi 130 kg/m³ bo'lgan NG toifali bazalt plitalari tanlandi.
- Ichki to'siqlarga Knauf GKL va nam xonalarga GKLV (E1 ekologik sertifikatli) ko'zda tutildi.
Natija: Davlat qurilish nazorati inspeksiyasi tomonidan to'liq qabul qilinadi.`,
    book_reference: "«Qurilish materiallari va buyumlari» (Muallif: B.A. Ergashev, 2021-yil, 2-bob, 40-bet) — o'quv qo'llanma.",
    tags: ["material", "gost", "standart", "sertifikat", "g'isht", "beton", "ekologiya", "dst"]
  },

  // 10. Smeta va loyiha qiymati
  {
    document_number: "SHNQ 1.04.03-20",
    title: "Loyiha-qidiruv ishlari qiymatini aniqlash va smeta tuzish tartibi",
    document_type: "SHNQ",
    category: "Smeta va qurilish iqtisodiyoti",
    content_type: "normative",
    source_type: "ministry",
    source_title: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi",
    description: "Qurilish obyektlarida arxitektura-loyihalash xizmatlari qiymatini hisoblash, resurs usulida smeta hujjatlarini shakllantirish me'yorlari.",
    requirements: "Loyiha-smeta hujjatlari narxi davlat buyurtmalari uchun tasdiqlangan bazaviy narxlar to'plami va resurs ko'rsatkichlari asosida chiqariladi. Smeta hisob-kitoblarida to'g'ridan-to'g'ri xarajatlar, ustama xarajatlar va rejaviy foyda normativ foizlarda ko'rsatilishi shart.",
    target_audience: "Smetachilar, loyiha institutlari iqtisodchilari, tender mutaxassislari",
    application_scope: "Davlat va xususiy investitsiya loyihalarining smetasini tuzish",
    status: "AMALDA",
    adopted_date: "2020-03-02",
    effective_date: "2020-04-01",
    issuing_authority: "Qurilish vazirligi",
    official_source_url: "https://mc.uz/",
    pdf_url: "https://lex.uz/docs/4785210",
    sources: [
      { title: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi", type: "ministry", url: "https://mc.uz/", note: "Smeta me'yorlari va narxlar katalogi" },
      { title: "Lex.uz — Qonunchilik milliy bazasi", type: "lex", url: "https://lex.uz/docs/4785210", note: "Rasmiy matn" },
      { title: "Kutubxona kitobi: «Qurilish iqtisodiyoti va smeta ishi» (2022)", type: "book", note: "O'quv qo'llanma: resurs usulida smeta tuzish metodikasi" }
    ],
    practical_example: `Berilgan:
- Qurilish-montaj ishlari bazaviy narxi: 1 000 000 000 so'm (1 mlrd so'm)
- Loyiha bosqichlari: Arxitektura konsepsiyasi, Ishchi loyiha (AR, KJ, VK, OV, EO)

Loyiha holati:
Loyiha-qidiruv ishlari me'yoriy narxini hisoblash.

Normativ talab (SHNQ 1.04.03-20):
- Fuqaro binolari uchun loyihalash xizmati qurilish-montaj narxining 2.5% dan 4.5% igacha bo'lgan foiz me'yorida hisoblanadi.

Hisob va natija:
- 1 000 000 000 × 3.5% = 35 000 000 so'm (bazaviy loyihalash qiymati).
- Bunga seysmik hisoblar va ekspertiza to'lovlari qo'shiladi.
Natija: Tender va shartnoma qiymatini asoslovchi rasmiy smeta tuziladi.`,
    book_reference: "«Qurilishda smeta ishi» (Muallif: D.N. Nazarov, 2022-yil, 1-bob, 18-bet) — o'quv manbasi.",
    tags: ["smeta", "narx", "loyiha narxi", "tender", "iqtisodiyot", "shnq"]
  },

  // 11. Hujjat rasmiylashtirish / Ruxsatnomalar (VMQ)
  {
    document_number: "VMQ-370",
    title: "Arxitektura-shaharsozlik hujjatlarini ishlab chiqish va kelishish bo'yicha davlat xizmatlari ko'rsatish ma'muriy reglamenti",
    document_type: "Qaror",
    category: "Qurilish uchun kerakli hujjatlar",
    content_type: "normative",
    source_type: "lex",
    source_title: "Lex.uz / Vazirlar Mahkamasi qarori",
    description: "APZ (Arxitektura-rejalashtirish topshirig'i) olish, loyihani kelishish, Davlat xizmatlari markazi yoki my.gov.uz orqali ruxsatnoma rasmiylashtirish tartibi.",
    requirements: "APZ olish uchun arizani elektron tarzda Davlat xizmatlari portali orqali yuboriladi. 1-toifadagi murakkab bo'lmagan obyektlar (yakka tartibdagi uylar) uchun APZ 3 ish kunida, kelishuv 5 ish kunida ko'rib chiqiladi. Qurilish loyihasi tasdiqlangan bosh rejaga muvofiq bo'lishi shart.",
    target_audience: "Buyurtmachilar, yer egalari, arxitektorlar, yuridik shaxslar",
    application_scope: "O'zbekistonda barcha yangi qurilish, rekonstruksiya va bino funksiyasini o'zgartirish jarayonlari",
    status: "AMALDA",
    adopted_date: "2019-05-18",
    effective_date: "2019-06-01",
    issuing_authority: "O'zbekiston Respublikasi Vazirlar Mahkamasi",
    official_source_url: "https://lex.uz/docs/4343166",
    sources: [
      { title: "Lex.uz — Qonunchilik milliy bazasi", type: "lex", url: "https://lex.uz/docs/4343166", note: "Vazirlar Mahkamasining 370-son qarori rasmiy matni" },
      { title: "My.gov.uz — Yagona interaktiv davlat xizmatlari portali", type: "official", url: "https://my.gov.uz/", note: "APZ va ruxsatnomalar elektron arizasi" },
      { title: "Kutubxona kitobi: «Shaharsozlik qonunchiligi va amaliyoti» (2021)", type: "book", note: "O'quv manbasi: ruxsatnoma olish bosqichlari" }
    ],
    practical_example: `Berilgan:
- Obyekt: Toshkent viloyatida 2 qavatli yakka tartibdagi uy qurilishi
- Mulkdor: Jismoniy shaxs, kadastr hujjati mavjud

Loyiha holati:
Qurilishni boshlash uchun bosqichma-bosqich ruxsatnoma olish.

Normativ tartib (VMQ-370):
1. My.gov.uz orqali APZ (Arxitektura-rejalashtirish topshirig'i)ga ariza topshirish (3 ish kuni).
2. Litsenziyaga ega arxitektor tomonidan loyiha ishlab chiqilishi.
3. Loyihani tuman qurilish bo'limi bilan kelishish (5 ish kuni).
4. Qurilish inspeksiyasiga xabarnoma yuborish.

Natija: Hech qanday jarimasiz, qonuniy va xavfsiz qurilishni boshlash ta'minlanadi.`,
    book_reference: "«Shaharsozlik huquqi» (Muallif: A.V. Vohidov, 2021-yil, 2-bob, 44-bet) — amaliy yuridik o'quv manbasi.",
    tags: ["apz", "ruxsatnoma", "davlat xizmatlari", "shaharsozlik kengashi", "hujjatlar", "vmq", "uy qurish"]
  },

  // 12. Qurilishni boshlash haqida xabarnoma (VMQ)
  {
    document_number: "VMQ-200",
    title: "Qurilish-montaj ishlarini boshlash haqida xabarnoma yuborish va davlat ro'yxatidan o'tkazish tartibi",
    document_type: "Qaror",
    category: "Qurilish uchun kerakli hujjatlar",
    content_type: "normative",
    source_type: "lex",
    source_title: "Lex.uz / Vazirlar Mahkamasi qarori",
    description: "Qurilish obyektini ro'yxatdan o'tkazish, Shaffof qurilish milliy axborot tizimida inspeksiya nazoratiga qo'yish reglamenti.",
    requirements: "Qurilishni boshlashdan oldin Qurilish sohasida hududiy nazorat inspeksiyasiga xabarnoma yuborish majburiydir. Yakka tartibdagi uylar (2 qavatgacha va 12 metrgacha) uchun ekspertiza va inspeksiya ro'yxatidan o'tish soddalashtirilgan tartibda amalga oshiriladi.",
    target_audience: "Pudratchilar, buyurtmachilar, texnik nazoratchilar",
    application_scope: "Qurilish ishlarini amalda boshlash bosqichi",
    status: "AMALDA",
    adopted_date: "2022-04-20",
    effective_date: "2022-05-01",
    issuing_authority: "Vazirlar Mahkamasi",
    official_source_url: "https://lex.uz/docs/5978120",
    sources: [
      { title: "Lex.uz — Qonunchilik milliy bazasi", type: "lex", url: "https://lex.uz/docs/5978120", note: "VMQ-200 rasmiy matni" },
      { title: "Shaffof Qurilish — Milliy axborot tizimi", type: "official", url: "https://shaffofqurilish.uz/", note: "Qurilish obyektlari davlat reyestri" }
    ],
    practical_example: `Berilgan:
- Obyekt: Do'kon va maishiy xizmat ko'rsatish shoxobchasi (300 m²)
- Tasdiqlangan loyiha va ekspertiza xulosasi mavjud

Loyiha holati:
Qurilish ishlarini boshlashni qonuniy ro'yxatga qo'yish.

Normativ talab (VMQ-200):
- Qurilish maydonida birinchi g'isht qo'yishdan oldin Shaffof qurilish tizimi orqali inspeksiyaga elektron xabarnoma yuboriladi.
- Inspeksiya 3 ish kunida obyektni ro'yxatga olib, nazorat reja-grafigini shakllantiradi.

Natija: Noqonuniy qurilish jarimasidan (BHMning 50 baravari) saqlanadi va qurilish davlat kafolati ostida amalga oshiriladi.`,
    tags: ["inspeksiya", "shaffof qurilish", "qurilishni boshlash", "xabarnoma", "nazorat", "vmq"]
  },

  // 13. Umumiy ovqatlanish (Restoran, Kafe)
  {
    document_number: "SHNQ 2.08.03-12",
    title: "Umumiy ovqatlanish korxonalari (Restoran, kafe va oshxonalar)",
    document_type: "SHNQ",
    category: "Loyihalash",
    content_type: "normative",
    source_type: "ministry",
    source_title: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi",
    description: "Restoran, kafe, oshxona va kofeynyalarni loyihalash, oshxona texnologik zonalari, zallar sig'imi va sanitariya oqimlari me'yorlari.",
    requirements: "Oshxonada xomashyo va tayyor taom oqimlari bir-biri bilan kesishmasligi (pototochnost) qat'iy talab qilinadi. Mehmonlar zali uchun 1 o'ringa kamida: restoranda 1.8 - 2.0 kv.m, kafeda 1.4 - 1.6 kv.m maydon ajratiladi. Oshxona uchun alohida texnologik ventilyatsiya tizimi (gidrofiltr va yog' ushlagich bilan) o'rnatilishi shart.",
    target_audience: "Restoran loyihachilari, arxitektorlar, texnolog-muhandislar, interyer dizaynerlari",
    application_scope: "Barcha umumiy ovqatlanish maskanlari, kafe, bar va restoranlar",
    status: "AMALDA",
    adopted_date: "2012-08-20",
    effective_date: "2012-10-01",
    issuing_authority: "Qurilish vazirligi",
    official_source_url: "https://mc.uz/",
    pdf_url: "https://lex.uz/docs/2056124",
    sources: [
      { title: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi", type: "ministry", url: "https://mc.uz/", note: "Restoran va kafe loyihalash amaldagi me'yori" },
      { title: "Lex.uz — Qonunchilik milliy bazasi", type: "lex", url: "https://lex.uz/docs/2056124", note: "Rasmiy matn" },
      { title: "Kutubxona kitobi: «Umumiy ovqatlanish korxonalari texnologik loyihasi» (2021)", type: "book", note: "O'quv qo'llanma: sexlar va oqimlar hisobi" }
    ],
    practical_example: `Berilgan:
- Yangi ochilayotgan restoran: 80 o'rinli mehmonlar zali
- Format: Yevropa va milliy taomlar to'liq siklli oshxonasi

Loyiha holati:
Zal va ishlab chiqarish oshxona sexlari maydonini hisoblash.

Normativ talab (SHNQ 2.08.03-12, 3.2 va 3.4-bandlar):
- Mehmonlar zali: 80 o'rin × 1.8 m²/o'rin = kamida 144 m² (raqs maydoni bilan 160-180 m²).
- Oshxona maydoni zalning kamida 40-50% ini tashkil qilishi shart.
- Xomashyo va pishgan taom yo'li kesishmasligi shart (potochnost).

Hisob va natija:
- Mehmonlar zali: 165 m² loyihalandi.
- Oshxona bloki: 85 m² (issiq sex 28 m², sovuq sex 14 m², go'sht-baliq sexi 12 m², idish yuvish 10 m², omborlar 21 m²).
- Chiqindi suvlari uchun moykalar ostiga gidrofiltr va yog' ushlagich o'rnatildi.
Natija: Sanitariya-epidemiologiya xizmati (SES) va yong'in inspeksiyasi talablariga to'liq javob beradi.`,
    book_reference: "«Restoran va kafelarni loyihalash» (Muallif: K.M. Mirzayev, 2021-yil, 3-bob, 55-bet) — o'quv qo'llanma.",
    tags: ["restoran", "kafe", "oshxona", "ovqatlanish", "texnologiya", "zal sig'imi", "ventilyatsiya", "interyer", "shnq"]
  },

  // 14. Mehmonxona va turar joy komplekslari
  {
    document_number: "SHNQ 2.08.06-18",
    title: "Mehmonxona va turar joy komplekslarini loyihalash me'yorlari",
    document_type: "SHNQ",
    category: "Loyihalash",
    content_type: "normative",
    source_type: "ministry",
    source_title: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi",
    description: "Mehmonxona binolari, xonalar klassifikatsiyasi, yulduzlik talablari va xizmat ko'rsatish infratuzilmasi me'yorlari.",
    requirements: "1 o'rinli xona minimal maydoni kamida 12 kv.m, 2 o'rinli 16 kv.m bo'lishi shart. Har bir mehmonxona xonasida to'liq sanuzel (vanna yoki dush, unitaz, rakovina) nazarda tutiladi. 3 qavatdan baland mehmonxonalarda yo'lovchi liftlari o'rnatilishi shart. Barcha xonalarda ovoz izolyatsiyasi normativ ko'rsatkichlarga javob berishi zarur.",
    target_audience: "Arxitektorlar, mehmonxona egalari, loyihachilar",
    application_scope: "Mehmonxonalar, motellar, xostellar va turizm komplekslari",
    status: "AMALDA",
    adopted_date: "2018-09-12",
    effective_date: "2018-11-01",
    issuing_authority: "Qurilish vazirligi va Turizm qo'mitasi",
    official_source_url: "https://mc.uz/",
    pdf_url: "https://lex.uz/docs/4012589",
    sources: [
      { title: "Qurilish va uy-joy kommunal xo‘jaligi vazirligi", type: "ministry", url: "https://mc.uz/", note: "Mehmonxona binolari me'yori" },
      { title: "Turizm qo'mitasi rasmiy tasnifi", type: "official", url: "https://motac.uz/", note: "Mehmonxona yulduzlik sertifikatsiyasi talablari" },
      { title: "Lex.uz — Qonunchilik milliy bazasi", type: "lex", url: "https://lex.uz/docs/4012589", note: "Rasmiy matn" },
      { title: "Kutubxona kitobi: «Mehmonxona va turizm komplekslari arxitekturasi» (2020)", type: "book", note: "O'quv qo'llanma: xonalar dizayni va akustikasi" }
    ],
    practical_example: `Berilgan:
- 4 qavatli mehmonxona (3 yulduzli standart)
- Standart 2 o'rinli (Double / Twin) xonalar bloki

Loyiha holati:
Mehmonxona nomeri o'lchamlari va kirish tamburi rejasini tuzish.

Normativ talab (SHNQ 2.08.06-18, 4.2-band):
- 2 o'rinli yashash xonasi maydoni: kamida 16 m² (sanuzelsiz)
- Individual sanuzel: kamida 3.8 - 4.0 m²
- Kirish dahlizi (garderob bilan): kamida 2.5 m²
- Qavatlararo ovoz izolyatsiyasi: kamida 52 dB

Hisob va natija:
- Xona toza o'lchami: 3.6 × 4.6 m = 16.56 m² (ikki krovat va ish stoli bemalol sig'adi).
- Sanuzel: 1.8 × 2.2 m = 3.96 m² (dush walk-in, osma unitaz, rakovina).
- Dahliz: 1.4 × 2.0 m = 2.8 m² (kiyim shkafi va mini-bar bilan).
Jami xona bloki: 23.3 m².
Natija: 3-4 yulduzli xalqaro mehmonxona sertifikatiga to'liq javob beradi.`,
    book_reference: "«Mehmonxonalar arxitekturasi» (Muallif: T.R. Rasulov, 2020-yil, 5-bob, 88-bet) — o'quv qo'llanma.",
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

    // 3b. Orqaga mos migratsiya: admin tahriri himoyasi, havola tekshiruvi natijalari, saqlash/like, manbalar tizimi va amaliy misollar
    try {
      await pool.query(`
        ALTER TABLE normative_documents ADD COLUMN IF NOT EXISTS is_admin_edited BOOLEAN DEFAULT false;
        ALTER TABLE normative_documents ADD COLUMN IF NOT EXISTS pdf_check JSONB;
        ALTER TABLE normative_documents ADD COLUMN IF NOT EXISTS official_check JSONB;
        ALTER TABLE normative_documents ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'normative';
        ALTER TABLE normative_documents ADD COLUMN IF NOT EXISTS source_type VARCHAR(50) DEFAULT 'lex';
        ALTER TABLE normative_documents ADD COLUMN IF NOT EXISTS source_title VARCHAR(255) DEFAULT 'Lex.uz';
        ALTER TABLE normative_documents ADD COLUMN IF NOT EXISTS sources JSONB DEFAULT '[]'::jsonb;
        ALTER TABLE normative_documents ADD COLUMN IF NOT EXISTS practical_example TEXT;
        ALTER TABLE normative_documents ADD COLUMN IF NOT EXISTS book_reference TEXT;

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

    // 3c. Create normative_topics table (Me'yoriy ma'lumotnoma — per-topic reference entries)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS normative_topics (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(200) NOT NULL,
        category VARCHAR(100) NOT NULL,
        subcategory VARCHAR(200),
        data_type VARCHAR(20) NOT NULL DEFAULT 'norma',
        normative_value VARCHAR(500),
        unit VARCHAR(100),
        building_type VARCHAR(200),
        room_type VARCHAR(200),
        condition TEXT,
        formula TEXT,
        calculation_example TEXT,
        practical_note TEXT,
        architect_note TEXT,
        source_document_number VARCHAR(100),
        source_band VARCHAR(200),
        source_table VARCHAR(200),
        keywords TEXT[] DEFAULT '{}',
        related_document_id INT,
        status VARCHAR(50) DEFAULT 'AMALDA',
        order_index INT DEFAULT 0,
        view_count INT DEFAULT 0,
        is_system_seed BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_norm_topics_cat ON normative_topics(category);
      CREATE INDEX IF NOT EXISTS idx_norm_topics_type ON normative_topics(data_type);
      CREATE INDEX IF NOT EXISTS idx_norm_topics_status ON normative_topics(status);
    `);

    // Ensure unique slug on normative_topics
    try {
      await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_norm_topics_slug_uq ON normative_topics(slug);
      `);
    } catch (e) {
      console.warn('normative_topics unique slug index notice:', e.message);
    }

    // Add multi-source and practical example columns to normative_topics BEFORE seeding
    try {
      await pool.query(`
        ALTER TABLE normative_topics ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'normative';
        ALTER TABLE normative_topics ADD COLUMN IF NOT EXISTS source_type VARCHAR(50) DEFAULT 'ministry';
        ALTER TABLE normative_topics ADD COLUMN IF NOT EXISTS source_title VARCHAR(255) DEFAULT 'Qurilish va uy-joy kommunal xo‘jaligi vazirligi';
        ALTER TABLE normative_topics ADD COLUMN IF NOT EXISTS source_url TEXT;
        ALTER TABLE normative_topics ADD COLUMN IF NOT EXISTS sources JSONB DEFAULT '[]'::jsonb;
        ALTER TABLE normative_topics ADD COLUMN IF NOT EXISTS practical_example TEXT;
        ALTER TABLE normative_topics ADD COLUMN IF NOT EXISTS book_reference TEXT;
      `);
    } catch (e) {
      console.warn('normative_topics columns notice:', e.message);
    }

    // Seed normative_topics from batch files (if available)
    try {
      var allTopics = [];
      try { allTopics = allTopics.concat(require('./seedTopicsBatch1').SEED_TOPICS_BATCH1 || []); } catch(e) {}
      try { allTopics = allTopics.concat(require('./seedTopicsBatch2').SEED_TOPICS_BATCH2 || []); } catch(e) {}
      try { allTopics = allTopics.concat(require('./seedTopicsBatch3').SEED_TOPICS_BATCH3 || []); } catch(e) {}
      try { allTopics = allTopics.concat(require('./seedTopicsBatch4').SEED_TOPICS_BATCH4 || []); } catch(e) {}

      var insertedTopics = 0;
      var updatedTopics = 0;
      for (var ti = 0; ti < allTopics.length; ti++) {
        var t = allTopics[ti];
        if (!t || !t.slug || !t.title) continue;
        try {
          // Link to normative_documents if source_document_number matches
          var relDocId = null;
          if (t.source_document_number) {
            var docLookup = await pool.query(
              'SELECT id FROM normative_documents WHERE document_number ILIKE $1 LIMIT 1',
              [t.source_document_number.trim()]
            );
            if (docLookup.rows.length) relDocId = docLookup.rows[0].id;
          }

          // Compute smart source metadata and content_type
          var cType = t.content_type || (t.data_type === 'hisoblash' ? 'practical_example' : (t.data_type === 'tavsiya' ? 'practical_example' : 'normative'));
          var sType = t.source_type;
          if (!sType) {
            var docNum = String(t.source_document_number || '').toUpperCase();
            if (docNum.includes('SHNQ') || docNum.includes('QMQ')) sType = 'ministry';
            else if (docNum.includes('VMQ') || docNum.includes('O\'RQ') || docNum.includes('PF')) sType = 'lex';
            else if (docNum.includes('DST') || docNum.includes('GOST') || docNum.includes('SANPIN')) sType = 'official';
            else if (t.data_type === 'tavsiya') sType = 'book';
            else sType = 'ministry';
          }

          var sTitle = t.source_title;
          if (!sTitle) {
            if (sType === 'ministry') sTitle = 'Qurilish va uy-joy kommunal xo‘jaligi vazirligi';
            else if (sType === 'lex') sTitle = 'Lex.uz — Qonunchilik milliy bazasi';
            else if (sType === 'official') sTitle = 'Rasmiy davlat standarti / Texnik meʼyor';
            else if (sType === 'book') sTitle = 'Kitob / O‘quv adabiyoti va amaliy tajriba';
            else sTitle = 'Qurilish va uy-joy kommunal xo‘jaligi vazirligi';
          }

          var sUrl = t.source_url || (sType === 'lex' ? 'https://lex.uz/' : 'https://mc.uz/');

          var tSources = t.sources && Array.isArray(t.sources) ? t.sources : [];
          if (tSources.length === 0) {
            if (t.source_document_number) {
              tSources.push({
                title: sTitle,
                type: sType,
                url: sUrl,
                note: t.source_document_number + (t.source_band ? ' (' + t.source_band + ')' : '')
              });
              tSources.push({
                title: 'Lex.uz — Qonunchilik milliy bazasi',
                type: 'lex',
                url: 'https://lex.uz/',
                note: 'Rasmiy me\'yoriy hujjat matni'
              });
            }
            if (t.data_type === 'tavsiya' || t.practical_note) {
              tSources.push({
                title: 'Arxitektura va loyihalash o‘quv adabiyoti',
                type: 'book',
                note: 'O‘quv adabiyoti / Amaliy tavsiya (majburiy norma emas)'
              });
            }
          }

          var pEx = t.practical_example || null;
          if (!pEx && (t.calculation_example || t.formula)) {
            var parts = [];
            if (t.condition) parts.push('Loyiha holati:\n' + t.condition);
            if (t.formula) parts.push('Hisoblash formulasi:\n' + t.formula);
            if (t.calculation_example) parts.push('Hisoblash misoli:\n' + t.calculation_example);
            if (t.normative_value) parts.push('Normativ talab:\n' + t.normative_value + (t.unit ? ' ' + t.unit : ''));
            pEx = parts.join('\n\n');
          }

          var bRef = t.book_reference || (t.data_type === 'tavsiya' ? 'Arxitektura va interyerni loyihalash o‘quv qo‘llanmasi (Amaliy tavsiya)' : null);

          var topicQ = await pool.query(`
            INSERT INTO normative_topics (
              title, slug, category, subcategory, data_type,
              normative_value, unit, building_type, room_type, condition,
              formula, calculation_example, practical_note, architect_note,
              source_document_number, source_band, source_table,
              keywords, related_document_id, status, order_index, is_system_seed,
              content_type, source_type, source_title, source_url, sources, practical_example, book_reference
            ) VALUES (
              $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21, true,
              $22,$23,$24,$25,$26,$27,$28
            )
            ON CONFLICT (slug) DO UPDATE SET
              title = EXCLUDED.title,
              category = EXCLUDED.category,
              subcategory = EXCLUDED.subcategory,
              data_type = EXCLUDED.data_type,
              normative_value = EXCLUDED.normative_value,
              unit = EXCLUDED.unit,
              building_type = EXCLUDED.building_type,
              room_type = EXCLUDED.room_type,
              condition = EXCLUDED.condition,
              formula = EXCLUDED.formula,
              calculation_example = EXCLUDED.calculation_example,
              practical_note = EXCLUDED.practical_note,
              architect_note = EXCLUDED.architect_note,
              source_document_number = EXCLUDED.source_document_number,
              source_band = EXCLUDED.source_band,
              source_table = EXCLUDED.source_table,
              keywords = EXCLUDED.keywords,
              related_document_id = EXCLUDED.related_document_id,
              status = EXCLUDED.status,
              order_index = EXCLUDED.order_index,
              content_type = EXCLUDED.content_type,
              source_type = EXCLUDED.source_type,
              source_title = EXCLUDED.source_title,
              source_url = EXCLUDED.source_url,
              sources = EXCLUDED.sources,
              practical_example = EXCLUDED.practical_example,
              book_reference = EXCLUDED.book_reference,
              updated_at = NOW()
            RETURNING (xmax = 0) AS was_inserted;
          `, [
            t.title, t.slug, t.category, t.subcategory || null, t.data_type || 'norma',
            t.normative_value || null, t.unit || null, t.building_type || null, t.room_type || null, t.condition || null,
            t.formula || null, t.calculation_example || null, t.practical_note || null, t.architect_note || null,
            t.source_document_number || null, t.source_band || null, t.source_table || null,
            t.keywords || [], relDocId, t.status || 'AMALDA', t.order_index || (ti + 1),
            cType, sType, sTitle, sUrl, JSON.stringify(tSources), pEx, bRef
          ]);
          if (topicQ.rows[0]?.was_inserted) insertedTopics++;
          else updatedTopics++;
        } catch (topicErr) {
          console.error('Error upserting topic ' + t.slug + ':', topicErr.message);
        }
      }
      if (allTopics.length > 0) {
        console.log('📋 NORMATIVE TOPICS: ' + allTopics.length + ' total (inserted: ' + insertedTopics + ', updated: ' + updatedTopics + ')');
      }
    } catch (topicsSeedErr) {
      console.warn('normative_topics seed notice:', topicsSeedErr.message);
    }

    // 4. Kutubxona bo'limlari: Faqat "Normativlar" asosiy bo'lim (Amaliy ishlar alohida bo'lim bo'lmaydi, Normativlar ichida filter bo'ladi)
    try {
      await pool.query(`
        INSERT INTO library_sections (slug, name, subtitle, icon, description, order_index, is_active, is_visible)
        VALUES (
          'normatives',
          'Normativlar',
          'SHNQ, QMQ, standartlar va amaliy yechimlar',
          '📋',
          'Arxitektura, qurilish va loyihalash uchun normativ hujjatlar, standartlar va amaliy hisoblar',
          5,
          true,
          true
        )
        ON CONFLICT (slug) DO UPDATE SET 
          is_active = true, 
          is_visible = true,
          subtitle = 'SHNQ, QMQ, standartlar va amaliy yechimlar';
      `);

      // "Amaliy yechimlar" alohida asosiy tile bo'lmasligi uchun is_visible=false qilamiz
      await pool.query(`
        UPDATE library_sections
        SET is_visible = false, is_active = false
        WHERE slug IN ('amaliy_yechimlar', 'cases', 'amaliy');
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
          change_date, tags, last_verified_at, is_system_seed,
          content_type, source_type, source_title, sources, practical_example, book_reference
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10, $11, $12, $13, $14, $15, $16, $17,
          $18, $19, NOW(), true,
          $20, $21, $22, $23, $24, $25
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
          content_type = EXCLUDED.content_type,
          source_type = EXCLUDED.source_type,
          source_title = EXCLUDED.source_title,
          sources = EXCLUDED.sources,
          practical_example = EXCLUDED.practical_example,
          book_reference = EXCLUDED.book_reference,
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
          item.change_date || null, item.tags || [],
          item.content_type || 'normative', item.source_type || 'lex', item.source_title || 'Lex.uz',
          JSON.stringify(item.sources || []), item.practical_example || null, item.book_reference || null
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
    const [cntDocs, cntCases, cntLinks, cntTopics] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS cnt FROM normative_documents'),
      pool.query('SELECT COUNT(*)::int AS cnt FROM practical_cases'),
      pool.query('SELECT COUNT(*)::int AS cnt FROM case_documents'),
      pool.query('SELECT COUNT(*)::int AS cnt FROM normative_topics').catch(() => ({ rows: [{ cnt: 0 }] }))
    ]);

    console.log('==================================================');
    console.log('📋 NORMATIVES DB VERIFICATION:');
    console.log(`- normative_documents: ${cntDocs.rows[0]?.cnt || 0} records (inserted: ${insertedDocs}, updated: ${updatedDocs})`);
    console.log(`- practical_cases: ${cntCases.rows[0]?.cnt || 0} records (seeded: ${seededCases})`);
    console.log(`- case_documents: ${cntLinks.rows[0]?.cnt || 0} links`);
    console.log(`- normative_topics: ${cntTopics.rows[0]?.cnt || 0} topics`);
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
    content_type,
    source_type,
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

  if (content_type && content_type !== 'all' && content_type !== 'Barchasi') {
    if (content_type === 'normative') {
      conditions.push(`(content_type = 'normative' OR content_type IS NULL)`);
    } else if (content_type === 'practical_example') {
      conditions.push(`(content_type = 'practical_example' OR practical_example IS NOT NULL)`);
    }
  }

  if (source_type && source_type !== 'all' && source_type !== 'Barchasi') {
    conditions.push(`(source_type = $${idx} OR EXISTS(SELECT 1 FROM jsonb_array_elements(COALESCE(sources, '[]'::jsonb)) src WHERE src->>'type' = $${idx}))`);
    values.push(source_type);
    idx++;
  }

  if (search && search.trim()) {
    const q = `%${search.trim().toLowerCase()}%`;
    conditions.push(`(
      LOWER(title) LIKE $${idx} OR
      LOWER(document_number) LIKE $${idx} OR
      LOWER(description) LIKE $${idx} OR
      LOWER(requirements) LIKE $${idx} OR
      LOWER(category) LIKE $${idx} OR
      LOWER(COALESCE(source_title, '')) LIKE $${idx} OR
      LOWER(COALESCE(practical_example, '')) LIKE $${idx} OR
      LOWER(COALESCE(book_reference, '')) LIKE $${idx} OR
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
        d.content_type, d.source_type, d.source_title, d.sources, d.practical_example, d.book_reference,
        COALESCE((SELECT COUNT(*)::int FROM norm_reactions r WHERE r.item_kind = 'doc' AND r.item_id = d.id AND r.reaction = 'like'), 0) AS like_count,
        COALESCE((SELECT COUNT(*)::int FROM norm_reactions r WHERE r.item_kind = 'doc' AND r.item_id = d.id AND r.reaction = 'save'), 0) AS save_count,
        EXISTS(SELECT 1 FROM norm_reactions r WHERE r.item_kind = 'doc' AND r.item_id = d.id AND r.reaction = 'like' AND r.user_id = $${uidIdx}) AS is_liked,
        EXISTS(SELECT 1 FROM norm_reactions r WHERE r.item_kind = 'doc' AND r.item_id = d.id AND r.reaction = 'save' AND r.user_id = $${uidIdx}) AS is_saved,
        (COALESCE(d.view_count, 0)
          + 3 * COALESCE((SELECT COUNT(*)::int FROM norm_reactions r WHERE r.item_kind = 'doc' AND r.item_id = d.id AND r.reaction = 'like'), 0)
          + 5 * COALESCE((SELECT COUNT(*)::int FROM norm_reactions r WHERE r.item_kind = 'doc' AND r.item_id = d.id AND r.reaction = 'save'), 0)) AS pop_score
      FROM normative_documents d
      ${whereClause.replace(/\b(title|document_number|description|requirements|category|tags|document_type|status|content_type|source_type|source_title|sources|practical_example|book_reference)\b/g, 'd.$1')}
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

// ======================================================
// NORMATIVE TOPICS (ME'YORIY MA'LUMOTNOMA) QUERIES
// ======================================================

async function getNormativeTopicsList(pool, options = {}) {
  const {
    category,
    data_type,
    content_type,
    source_type,
    search,
    limit = 200,
    offset = 0,
    sort = 'order'
  } = options;

  let conditions = [];
  let values = [];
  let idx = 1;

  if (category && category !== 'all' && category !== 'Barchasi') {
    conditions.push(`category = $${idx++}`);
    values.push(category);
  }

  if (data_type && data_type !== 'all' && data_type !== 'Barchasi') {
    conditions.push(`data_type = $${idx++}`);
    values.push(data_type);
  }

  if (content_type && content_type !== 'all' && content_type !== 'Barchasi') {
    if (content_type === 'normative') {
      conditions.push(`(data_type = 'norma' AND (content_type IS NULL OR content_type = 'normative'))`);
    } else if (content_type === 'practical_example') {
      conditions.push(`(data_type = 'hisoblash' OR data_type = 'tavsiya' OR content_type = 'practical_example' OR calculation_example IS NOT NULL OR practical_example IS NOT NULL)`);
    }
  }

  if (source_type && source_type !== 'all' && source_type !== 'Barchasi') {
    conditions.push(`(source_type = $${idx} OR EXISTS(SELECT 1 FROM jsonb_array_elements(COALESCE(sources, '[]'::jsonb)) src WHERE src->>'type' = $${idx}))`);
    values.push(source_type);
    idx++;
  }

  if (search && search.trim()) {
    const q = `%${search.trim().toLowerCase()}%`;
    conditions.push(`(
      LOWER(title) LIKE $${idx} OR
      LOWER(category) LIKE $${idx} OR
      LOWER(subcategory) LIKE $${idx} OR
      LOWER(normative_value) LIKE $${idx} OR
      LOWER(room_type) LIKE $${idx} OR
      LOWER(building_type) LIKE $${idx} OR
      LOWER(source_document_number) LIKE $${idx} OR
      LOWER(condition) LIKE $${idx} OR
      LOWER(practical_note) LIKE $${idx} OR
      LOWER(COALESCE(source_title, '')) LIKE $${idx} OR
      LOWER(COALESCE(practical_example, '')) LIKE $${idx} OR
      LOWER(COALESCE(book_reference, '')) LIKE $${idx} OR
      $${idx + 1} = ANY(keywords)
    )`);
    values.push(q);
    values.push(search.trim().toLowerCase());
    idx += 2;
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  let orderBy = 'order_index ASC, id ASC';
  if (sort === 'popular') orderBy = 'view_count DESC, id ASC';
  else if (sort === 'title') orderBy = 'title ASC';
  else if (sort === 'newest') orderBy = 'id DESC';

  const countQuery = `SELECT COUNT(*)::int AS total FROM normative_topics ${whereClause}`;
  const totalRes = await pool.query(countQuery, values);
  const total = totalRes.rows[0]?.total || 0;

  const dataQuery = `
    SELECT
      id, title, slug, category, subcategory, data_type,
      normative_value, unit, building_type, room_type, condition,
      formula, calculation_example, practical_note, architect_note,
      source_document_number, source_band, source_table,
      keywords, related_document_id, status, order_index, view_count,
      content_type, source_type, source_title, source_url, sources, practical_example, book_reference
    FROM normative_topics
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT $${idx++} OFFSET $${idx++}
  `;

  values.push(Math.min(limit, 500));
  values.push(offset);

  const res = await pool.query(dataQuery, values);

  // Get unique categories for filter UI
  const catsRes = await pool.query(
    'SELECT DISTINCT category FROM normative_topics ORDER BY category ASC'
  );
  const categories = catsRes.rows.map(r => r.category);

  return { items: res.rows, total, limit, offset, categories };
}

async function getNormativeTopicDetail(pool, idOrSlug) {
  let query = 'SELECT * FROM normative_topics WHERE ';
  let param;
  if (isNaN(Number(idOrSlug))) {
    query += 'slug = $1';
    param = idOrSlug;
  } else {
    query += 'id = $1';
    param = Number(idOrSlug);
  }

  const topicRes = await pool.query(query, [param]);
  if (!topicRes.rows.length) return null;
  const topic = topicRes.rows[0];

  // Increment view count
  pool.query('UPDATE normative_topics SET view_count = view_count + 1 WHERE id = $1', [topic.id]).catch(() => {});

  // If has related_document_id, fetch linked document
  let relatedDocument = null;
  if (topic.related_document_id) {
    const relRes = await pool.query(
      'SELECT id, title, document_number, document_type, status, official_source_url, pdf_url FROM normative_documents WHERE id = $1',
      [topic.related_document_id]
    );
    if (relRes.rows.length) relatedDocument = relRes.rows[0];
  }

  // Find related topics in the same category (up to 6)
  const relatedTopics = await pool.query(
    'SELECT id, title, slug, data_type, normative_value, unit FROM normative_topics WHERE category = $1 AND id != $2 ORDER BY order_index ASC LIMIT 6',
    [topic.category, topic.id]
  );

  return { topic, relatedDocument, relatedTopics: relatedTopics.rows };
}

async function getNormativeTopicCategories(pool) {
  const res = await pool.query(`
    SELECT category, COUNT(*)::int AS count, 
           array_agg(DISTINCT data_type) AS data_types
    FROM normative_topics 
    GROUP BY category 
    ORDER BY MIN(order_index) ASC
  `);
  return res.rows;
}

module.exports = {
  SEED_NORMATIVES,
  SEED_PRACTICAL_CASES,
  initNormativesTables,
  getNormativesList,
  getNormativeDetail,
  getPracticalCasesList,
  getPracticalCaseDetail,
  getNormativesStats,
  getNormativeTopicsList,
  getNormativeTopicDetail,
  getNormativeTopicCategories
};
