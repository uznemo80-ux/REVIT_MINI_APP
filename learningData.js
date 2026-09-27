// ======================================================
// YOSHUZBEKK Academy — Architecture & Interior Learning Center
// Knowledge Base & Seed Data (100% Preserved Research Data)
// ======================================================

const SEED_STAGES = [
  {
    stage_number: 1,
    title: "01 — Arxitektura chizmasi",
    subtitle: "Bino proyeksiyalari, ortogonal chizmalar, masshtab va qirqimlar asoslari",
    description: "Arxitekturaviy loyihalashning poydevori: bino planlari, fasadlari va qirqimlari qanday hosil bo'lishi, gorizontal qirqim tekisligining to'g'ri o'tkazilishi hamda qat'iy standart masshtablarni qo'llash qoidalari.",
    topics: [
      "Gorizontal qirqim tekisligi (odatda toza poldan +1.000...+1.200 m balandlikdan o'tishi)",
      "Bino qavat rejalari (Планы этажей) va ularning vazifasi",
      "Bino fasadlari va ularning koordinatsion o'qlar bilan bog'liqligi",
      "Bino kesimlari (Разрезы) — bo'ylama va ko'ndalang qirqimlar",
      "Zinapoyalar bo'ylab qirqim yasashning qat'iy qoidalari",
      "Standart arxitektura masshtablari (1:20, 1:25, 1:50, 1:100, 1:200, 1:500)",
      "Nisbiy va mutlaq sathlar (0.000 toza pol darajasi va Baltika balandlik tizimi)"
    ],
    order_index: 1,
    is_pro: false
  },
  {
    stage_number: 2,
    title: "02 — Grafik rasmiylashtirish",
    subtitle: "Chiziq qalinliklari madaniyati, shriftlar, o'lchamlar va shartli grafik belgilar",
    description: "Professional chizmaning ko'rkamligi uning grafik iyerarxiyasiga bog'liq: qalin, o'rtacha va ingichka chiziqlar balansi, GOST shriftlari, o'lcham zanjirlari hamda materiallarning shartli grafik tasvirlari.",
    topics: [
      "Chiziq qalinliklari (0.5-0.7 mm yuk ko'taruvchi devorlar; 0.3-0.4 mm to'siqlar; 0.1-0.18 mm o'lcham va hatch)",
      "GOST 2.304-81 bo'yicha shriftlar (Type B, ISOCPEUR: 2.5, 3.5, 5.0, 7.0, 10.0 mm)",
      "O'lcham qo'yish qoidalari (zanjir, zasechka, o'qlar va devor teshiklariga bog'lanish)",
      "Koordinatsion o'qlar doiralari (diametri 8-10 mm) va ularni harf/raqamlar bilan belgilash",
      "Balandlik belgilari (Planlarda to'rtburchakda +0.000; fasad va kesimlarda 45° strelka)",
      "Xonalar nomlari va raqamlarini to'g'ri joylashtirish",
      "Materiallar grafik tasvirlari va hatch shtrixovkalari (GOST 21.201-2011)",
      "Tugun va detal ko'rsatkichlari (Uzel bayroqchalari va silka doiralari)"
    ],
    order_index: 2,
    is_pro: false
  },
  {
    stage_number: 3,
    title: "03 — Komponovka va List Layout",
    subtitle: "Professional drawing sheet composition, chizmalarni listga joylashtirish san'ati",
    description: "Chizmalarni qog'oz formatiga tartibli, vizual muvozanatli va estetik joylashtirish qoidalari: formatlar tanlash, o'qlar bo'yicha proyeksion bog'liqlik va bo'sh joylardan unumli foydalanish.",
    topics: [
      "Formatlar tanlash (A3: 297x420, A2: 420x594, A1: 594x841 va karrali formatlar — GOST 2.301-68)",
      "Optik markaz va bo'shliq balansi (White Space — 60-70% to'liqlik, 30-40% nafas olish maydoni)",
      "Proyeksion bog'liqlik (Plan ustiga razrez yoki fasadni o'qlar bo'yicha to'g'rilab joylashtirish)",
      "Chizmalar, jadvallar va yozuvlar orasidagi masofalar (kamida 30-50 mm bo'shliq)",
      "Grafik iyerarxiya va ko'zning o'qish yo'nalishi (chap yuqoridan o'ng pastga)",
      "Asosiy yozuv (Shtamp) joylashuvi (pastki o'ng burchak, 185x55 mm; tikish uchun chapdan 20 mm)",
      "Eslatmalar va spetsifikatsiyalarni shtamp ustiga kolonka ko'rinishida joylashtirish"
    ],
    order_index: 3,
    is_pro: false
  },
  {
    stage_number: 4,
    title: "04 — СПДС / GOST Standartlari",
    subtitle: "Loyiha va ishchi hujjatlarning me'yoriy asosi, markalar va asosiy yozuv shakllari",
    description: "MDH va O'zbekiston amaliyotida qo'llaniladigan СПДС davlatlararo standartlari: loyiha albomi qonuniyati, shtamplar shakllari, to'plam markalari va hujjatlarni ekspertizaga tayyorlash.",
    topics: [
      "ГОСТ 21.101-97 / ГОСТ Р 21.101-2020 / ГОСТ 21.1101-2013 (Asosiy talablar tizimi)",
      "ГОСТ 21.501-2018 (AR va AS ishchi chizmalarini bajarish qoidalari)",
      "Asosiy yozuv shakllari: Forma 3 (chizma listlari), Forma 4 (titul/1-varaq), Forma 5 (keyingi matn varaqlar)",
      "Loyiha to'plamlari markirovkasi: AR (Me'moriy), AS (Me'moriy-qurilish), AI (Interyer), KJ, KM, VK, OV, EG",
      "Titul varag'i va 'Общие данные' (Umumiy ma'lumotlar) varag'ining qat'iy strukturasi",
      "Loyiha varaqlarini raqamlash va o'zgartirishlar kiritish (Izmeneniya) jadvali qoidalari"
    ],
    order_index: 4,
    is_pro: false
  },
  {
    stage_number: 5,
    title: "05 — Spetsifikatsiya va Vedomostlar",
    subtitle: "Arxitektura va qurilish hisob-kitob jadvallari, eksplikatsiyalar va buyumlar ro'yxati",
    description: "Loyihani oddiy chizmadan aniq muhandislik-iqtisodiy hujjatga aylantiruvchi vedomostlar: xonalar toza maydonlari, eshik-derazalar, pol qatlamlari va pardozlash materiallari hajmlari hisob-kitobi.",
    topics: [
      "Xonalar eksplikatsiyasi (Экспликация помещений — Forma 2: raqami, nomi, maydoni m², toifasi)",
      "Pol qatlamlari vedomosti (Ведомость полов — Forma 5: xona raqami, tipi, qatlamlar chizmasi, maydoni)",
      "Xonalar pardozlash vedomosti (Ведомость отделки помещений — Forma 6: shift, devor, sokol pardozi)",
      "Elementlar va buyumlar spetsifikatsiyasi (Forma 7: pozitsiya/marka, standart kodi, nomi, soni, massasi)",
      "Eshik va deraza bloklari vedomosti va spetsifikatsiyasi (OK-1, D-1, o'lchamlari, ochilish yo'nalishi)",
      "Mebel, sanitariya jihozlari va yoritgichlar spetsifikatsiyasini tuzish qoidalari"
    ],
    order_index: 5,
    is_pro: false
  },
  {
    stage_number: 6,
    title: "06 — O‘zbekiston ShNQ / QMQ Normativlari",
    subtitle: "Milliy shaharsozlik normalari, davlat ekspertizasi va xavfsizlik talablari",
    description: "O'zbekiston Respublikasi Qurilish vazirligi tomonidan tasdiqlangan amaldagi me'yoriy hujjatlar: bino xavfsizligi, seysmik talablar, xonalar o'lchamlari va davlat ekspertizasidan o'tish shartlari.",
    topics: [
      "ShNQ 1.03.01-16 / ShNQ 1.03.03-23 (Loyiha hujjatlarining tarkibi va tasdiqlanishi tartibi)",
      "QMQ 2.08.01-19 / ShNQ 2.08.01-24 (Turar-joy obyektlarini loyihalash: balandlik, minimal maydonlar)",
      "ShNQ 2.08.02-20 / ShNQ 2.08.02-23 (Jamoat binolari va inshootlari: evakuatsiya, zinalar, sanuzellar)",
      "QMQ 2.01.03-19 (Zilzilaviy hududlarda qurilish: 7, 8, 9 ballik talablar, antiseysmik choklar va karkas)",
      "O'z DSt 734 va 735:2023 (Loyiha hujjatlarini rasmiylashtirish va muhandislik milliy standartlari)",
      "ShNQ 2.01.05-19 (Tabiiy va sun'iy yoritish me'yorlari — KEO, deraza proporsiyalari)",
      "Amaldagi yangi ShNQ va QMQ normalaridan to'g'ri foydalanish"
    ],
    order_index: 6,
    is_pro: false
  },
  {
    stage_number: 7,
    title: "07 — Real Loyiha Albomlarini Tahlil Qilish",
    subtitle: "Haqiqiy ishlab chiqarishdagi АР, АС va Interyer albomlari PDF namunalari",
    description: "Nazariy bilimlarni real qurilish amaliyoti bilan bog'lash: davlat ekspertizasidan o'tgan ko'p qavatli binolar, xususiy kottejlar va premium interyer dizayn loyihalari PDF albomlarini tahlil qilish.",
    topics: [
      "Ko'p qavatli turar-joy binosi АР ishchi loyihasi (~45 list) strukturaviy tahlili",
      "Kottej va yakka tartibdagi turar-joy binosi АС ishchi loyihasi (~22 list) tahlili",
      "Zamonaviy kvartira interyeri ishchi hujjatlari (Neapol Design / Rudakova — 35-40 list)",
      "Jamoat binosi davlat ekspertizasi loyiha to'plami (П + АР bo'limlari)",
      "Listlar ketma-ketligi mantig'i: Tituldan to yakuniy uzel va spetsifikatsiyalargacha",
      "Qurilish maydonida yuzaga keladigan real xatolar va ularning loyiha orqali oldini olish"
    ],
    order_index: 7,
    is_pro: false
  },
  {
    stage_number: 8,
    title: "08 — Revit’da Professional Documentation",
    subtitle: "BIM muhitida avtomatlashtirilgan ishchi chizmalar va spetsifikatsiyalar chiqarish",
    description: "Revit dasturida chizmachilik emas, balki axborot modelidan (BIM) to'liq avtomatik, bir-biriga bog'langan professional ishchi hujjatlar to'plamini (Sheets & Schedules) tayyorlash.",
    topics: [
      "Sheets, Views va Viewports tizimini to'g'ri tashkil qilish",
      "View Templates (Ko'rinish shablonlari) va Visibility/Graphics filtrlaridan foydalanish",
      "Phasing (Bosqichlar): Obmer, Demontaj va Yangi montaj rejalarini avtomatik ajratish",
      "Schedules va Material Takeoff (Forma 2, 5, 6, 7 jadvallarini modeldan avtomatik hisoblash)",
      "Keynotes, Tags va Annotatsiyalar (Room Tag, Door/Window Tag, Material Tag)",
      "Detail Components (1:5, 1:10 2D uzel elementlari va parametrik oilalar)",
      "Project Browser arxitekturasi va Sheet organization tartibi",
      "Autodesk Community CIS (ADSK) BIM-standart 2.0 va СПДС shablonlaridan foydalanish"
    ],
    order_index: 8,
    is_pro: false
  },
  {
    stage_number: 9,
    title: "09 — Mustaqil To‘liq Loyiha Albomini Yig‘ish",
    subtitle: "Noldan ekspertiza darajasidagi to'liq АР yoki Interyer ishchi albomini chiqarish",
    description: "Barcha bosqichlarda o'rganilgan bilim, me'yor va dasturiy vositalarni birlashtirgan holda mustaqil ravishda to'liq me'moriy yoki interyer ishchi albomini yig'ish va self-check ekspertizasi.",
    topics: [
      "Topshiriq (TZ) va me'moriy dasturni shakllantirish",
      "Obmer (o'lchov) chizmasi va vaziyat rejasini tayyorlash",
      "Kladochniy va planirovochniy rejalarni to'liq o'lchamlar bilan chizish",
      "Kesim va fasadlarni qavat planlari bilan proyeksion bog'lash",
      "Pol, shift, elektr, santexnika va pardozlash rejalarini yig'ish",
      "Barcha spetsifikatsiyalar va vedomostlarni to'liq xatolarsiz bog'lash",
      "Ekspertiza nazorati (Self-Check checklist) va bosmaga (PDF) chiqarish"
    ],
    order_index: 9,
    is_pro: false
  }
];

const SEED_RESOURCES = [
  // STAGE 1 & 2 BOOKS
  {
    stage_number: 1,
    title: "Строительное черчение",
    author: "Будасов Б.В., Каминский В.П.",
    year: "1990 / 2003",
    language: "ru",
    topic: "Qurilish chizmachiligi, SPDS, plan, kesim, fasad chizish",
    benefit_description: "Chizmaning chiziq qalinliklari, o'qlar, shtamp turlari, zinalar qirqimi va uzellarni chizish bo'yicha MDH hududidagi eng to'liq klassik darslik.",
    resource_type: "book",
    pdf_url: "https://yandex.uz/search/?text=%D0%91%D1%83%D0%B4%D0%B0%D1%81%D0%BE%D0%B2+%D0%9A%D0%B0%D0%BC%D0%B8%D0%BD%D1%81%D0%BA%D0%B8%D0%B9+%D0%A1%D1%82%D1%80%D0%BE%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5+%D1%87%D0%B5%D1%80%D1%87%D0%B5%D0%BD%D0%B8%D0%B5+%D1%81%D0%BA%D0%B0%D1%87%D0%B0%D1%82%D1%8C+pdf",
    web_url: "https://studfile.net/search/?q=%D0%91%D1%83%D0%B4%D0%B0%D1%81%D0%BE%D0%B2+%D0%A1%D1%82%D1%80%D0%BE%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5+%D1%87%D0%B5%D1%80%D1%87%D0%B5%D0%BD%D0%B8%D0%B5",
    is_free: true,
    is_pro: false,
    order_index: 1
  },
  {
    stage_number: 2,
    title: "Правила выполнения архитектурно-строительных чертежей",
    author: "Георгиевский О.В.",
    year: "2005 / 2014",
    language: "ru",
    topic: "SPDS va ESKD qoidalari, grafik standartlar, o'lcham qo'yish",
    benefit_description: "Aynan GOST 21.501 va 21.101 bo'yicha plan, razrez, fasadlarni xatosiz rasmiylashtirish, o'lcham zanjirlari va materiallar shtrixovkasi ma'lumotnomasi.",
    resource_type: "book",
    pdf_url: "https://yandex.uz/search/?text=%D0%93%D0%B5%D0%BE%D1%80%D0%B3%D0%B8%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9+%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0+%D0%B2%D1%8B%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D1%8F+%D0%B0%D1%80%D1%85%D0%B8%D1%82%D0%B5%D0%BA%D1%82%D1%83%D1%80%D0%BD%D0%BE-%D1%81%D1%82%D1%80%D0%BE%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D1%85+%D1%87%D0%B5%D1%80%D1%82%D0%B5%D0%B6%D0%B5%D0%B9+pdf",
    web_url: "https://studfile.net/search/?q=%D0%93%D0%B5%D0%BE%D1%80%D0%B3%D0%B8%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9+%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0+%D0%B2%D1%8B%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D1%8F+%D1%87%D0%B5%D1%80%D1%82%D0%B5%D0%B6%D0%B5%D0%B9",
    is_free: true,
    is_pro: false,
    order_index: 2
  },
  {
    stage_number: 3,
    title: "Архитектурная графика и основы композиции",
    author: "Короев Ю.И.",
    year: "2004 / 2008",
    language: "ru",
    topic: "Kompozitsiya, grafik iyerarxiya, aksonometriya, soya va yorug'lik",
    benefit_description: "Chizmalarni listga joylashtirish (layout), bo'shliqlar balansi, qog'oz yuzasini to'g'ri taqsimlash va grafikani ko'rkam qilish san'ati.",
    resource_type: "book",
    pdf_url: "https://yandex.uz/search/?text=%D0%9A%D0%BE%D1%80%D0%BE%D0%B5%D0%B2+%D0%90%D1%80%D1%85%D0%B8%D1%82%D0%B5%D0%BA%D1%82%D1%83%D1%80%D0%BD%D0%B0%D1%8F+%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%BA%D0%B0+%D0%B8+%D0%BE%D1%81%D0%BD%D0%BE%D0%B2%D1%8B+%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%B7%D0%B8%D1%86%D0%B8%D0%B8+pdf",
    web_url: "https://studfile.net/search/?q=%D0%9A%D0%BE%D1%80%D0%BE%D0%B5%D0%B2+%D0%90%D1%80%D1%85%D0%B8%D1%82%D0%B5%D0%BA%D1%82%D1%83%D1%80%D0%BD%D0%B0%D1%8F+%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%BA%D0%B0",
    is_free: true,
    is_pro: false,
    order_index: 3
  },
  {
    stage_number: 1,
    title: "Arxitekturaviy loyihalash asoslari",
    author: "Qodirov Q.Q., Axmedov M.X.",
    year: "2012",
    language: "uz",
    topic: "Arxitekturaviy grafika, plan, fasad, masshtablar, loyihalash bosqichlari",
    benefit_description: "O'zbek tilida arxitektura atamalari va chizma qoidalarining poydevori. TAQU rasmiy o'quv darsligi.",
    resource_type: "book",
    pdf_url: "https://yandex.uz/search/?text=Arxitekturaviy+loyihalash+asoslari+kitob+pdf",
    web_url: "https://unilibrary.uz/search?query=Arxitekturaviy+loyihalash+asoslari",
    is_free: true,
    is_pro: false,
    order_index: 4
  },
  {
    stage_number: 3,
    title: "Arxitekturaviy kompozitsiya va loyihalash asoslari",
    author: "O'ralov A., Rahimov A., Saidova B.",
    year: "2005 / 2016",
    language: "uz",
    topic: "Kompozitsiya qonuniyatlari, metrika, ritm, listda joylashtirish",
    benefit_description: "Chizmalarning listdagi muvozanati (layout) va vizual iyerarxiyasini o'zbek tilida ilmiy asosda tushunish uchun SamDAQU qo'llanmasi.",
    resource_type: "book",
    pdf_url: "https://yandex.uz/search/?text=Oralov+Arxitekturaviy+kompozitsiya+pdf",
    web_url: "https://unilibrary.uz/search?query=Arxitekturaviy+kompozitsiya",
    is_free: true,
    is_pro: false,
    order_index: 5
  },
  {
    stage_number: 2,
    title: "Qurilish chizmachiligi va arxitektura grafikasi",
    author: "Olimov B.S., Murodov R.X.",
    year: "2015",
    language: "uz",
    topic: "Chizmalarni rasmiylashtirish, o'qlar, o'lcham qo'yish, uzellar",
    benefit_description: "SPDS qoidalarining o'zbek tilidagi talqini, talabalar va amaliyotchi loyihachilar uchun me'moriy grafika darsligi.",
    resource_type: "book",
    pdf_url: "https://yandex.uz/search/?text=Qurilish+chizmachiligi+va+arxitektura+grafikasi+pdf",
    web_url: "https://unilibrary.uz/search?query=Qurilish+chizmachiligi",
    is_free: true,
    is_pro: false,
    order_index: 6
  },
  {
    stage_number: 5,
    title: "Архитектурное конструирование",
    author: "Пономарев В.А.",
    year: "2008 / 2014",
    language: "ru",
    topic: "Fuqaro binolari konstruksiyalari, tugunlar, pol qatlamlari, tomlar",
    benefit_description: "Qirqimlar (razrez) va uzellarni chizishda pol 'pirog'lari, orayopmalar va tomlarning konstruktiv bog'lanishlarini to'g'ri chizish.",
    resource_type: "book",
    pdf_url: "https://yandex.uz/search/?text=%D0%9F%D0%BE%D0%BD%D0%BE%D0%BC%D0%B0%D1%80%D0%B5%D0%B2+%D0%90%D1%80%D1%85%D0%B8%D1%82%D0%B5%D0%BA%D1%82%D1%83%D1%80%D0%BD%D0%BE%D0%B5+%D0%BA%D0%BE%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5+%D1%81%D0%BA%D0%B0%D1%87%D0%B0%D1%82%D1%8C+pdf",
    web_url: "https://studfile.net/search/?q=%D0%9F%D0%BE%D0%BD%D0%BE%D0%BC%D0%B0%D1%80%D0%B5%D0%B2+%D0%90%D1%80%D1%85%D0%B8%D1%82%D0%B5%D0%BA%D1%82%D1%83%D1%80%D0%BD%D0%BE%D0%B5+%D0%BA%D0%BE%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5",
    is_free: true,
    is_pro: false,
    order_index: 7
  },
  {
    stage_number: 5,
    title: "Дизайн интерьера: Рабочая документация",
    author: "Киселева А.В., Митина Н.",
    year: "2017",
    language: "ru",
    topic: "Interyer rabochkasi, demontaj, montaj, svet, rozetka, razvertka",
    benefit_description: "Interyer dizayner uchun mukammal ishchi albom yig'ish ketma-ketligi, mebel spetsifikatsiyalari va xatoliklar tahlili.",
    resource_type: "book",
    pdf_url: "https://yandex.uz/search/?text=%D0%9A%D0%B8%D1%81%D0%B5%D0%BB%D0%B5%D0%B2%D0%B0+%D0%9C%D0%B8%D1%82%D0%B8%D0%BD%D0%B0+%D0%94%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD+%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%8C%D0%B5%D1%80%D0%B0+%D1%80%D0%B0%D0%B1%D0%BE%D1%87%D0%B0%D1%8F+%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%86%D0%B8%D1%8F+pdf",
    web_url: "https://yandex.uz/search/?text=%D0%9A%D0%B8%D1%81%D0%B5%D0%BB%D0%B5%D0%B2%D0%B0+%D0%94%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD+%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%8C%D0%B5%D1%80%D0%B0+%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B0%D1%8F+%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%86%D0%B8%D1%8F",
    is_free: true,
    is_pro: false,
    order_index: 8
  },

  // STANDARDS (STAGE 4 & 6)
  {
    stage_number: 4,
    title: "ГОСТ 21.101-97 / ГОСТ Р 21.101-2020 (ГОСТ 21.1101-2013)",
    author: "МГС / Росстандарт",
    year: "2020",
    language: "ru",
    topic: "СПДС. Основные требования к проектной и рабочей документации",
    benefit_description: "Loyiha albomining asosiy me'yori: shtamp shakllari (Forma 3, 4, 5, 6), formatlar, shifrlar (AR, AS, AI), varaqlar raqamlanishi.",
    resource_type: "standard",
    pdf_url: "https://files.stroyinf.ru/Data2/1/4293754/4293754162.pdf",
    web_url: "https://files.stroyinf.ru/Index2/1/4293754/4293754162.htm",
    is_free: true,
    is_pro: false,
    order_index: 9
  },
  {
    stage_number: 4,
    title: "ГОСТ 21.501-2018",
    author: "МГС (Межгосударственный совет)",
    year: "2018",
    language: "ru",
    topic: "Правила выполнения рабочей документации архитектурных и конструктивных решений",
    benefit_description: "AR va AS chizmalarining barcha qoidalari: planlar, kladochniy plan, fasad, razrez, Forma 5 (pol), Forma 6 (otdelka), Forma 7 (spetsifikatsiya).",
    resource_type: "standard",
    pdf_url: "https://files.stroyinf.ru/Data2/1/4293753/4293753634.pdf",
    web_url: "https://files.stroyinf.ru/Index2/1/4293753/4293753634.htm",
    is_free: true,
    is_pro: false,
    order_index: 10
  },
  {
    stage_number: 4,
    title: "ГОСТ 21.201-2011",
    author: "МГС",
    year: "2011",
    language: "ru",
    topic: "Условные графические изображения элементов зданий, сооружений и конструкций",
    benefit_description: "Devor materiallari shtrixovkalari (g'isht, beton, gazoblok, izolyatsiya), eshik ochilishlari va santexnika grafik belgilari.",
    resource_type: "standard",
    pdf_url: "https://allgosts.ru/01/100/gost_21.201-2011",
    web_url: "https://allgosts.ru/01/100/gost_21.201-2011",
    is_free: true,
    is_pro: false,
    order_index: 11
  },
  {
    stage_number: 6,
    title: "ShNQ 1.03.01-16 / ShNQ 1.03.03-23 (O'zbekiston)",
    author: "O'zbekiston Qurilish vazirligi",
    year: "2016 / 2024",
    language: "uz",
    topic: "Qurilish obyektlarini loyihalashtirish, loyiha hujjatlarining tarkibi va tasdiqlash tartibi",
    benefit_description: "O'zbekistonda loyihalash bosqichlari (Eskiz, P, RD), AR va AS bo'limlari tarkibi hamda davlat ekspertizasi talablari.",
    resource_type: "standard",
    pdf_url: "https://lex.uz/uz/search/all?search_text=SHNQ+1.03.03",
    web_url: "https://lex.uz/uz/search/all?search_text=SHNQ+1.03.03",
    is_free: true,
    is_pro: false,
    order_index: 12
  },
  {
    stage_number: 6,
    title: "QMQ 2.08.01-19 / ShNQ 2.08.01-24 (O'zbekiston)",
    author: "O'zbekiston Qurilish vazirligi",
    year: "2019 / 2024",
    language: "uz",
    topic: "Turar joy obyektlarini loyihalash (Жилые здания)",
    benefit_description: "Xonalar minimal balandligi, deraza yorug'lik nisbatlari (insolyatsiya), xonalar minimal maydonlari, tamburlar va dahlizlar.",
    resource_type: "standard",
    pdf_url: "https://lex.uz/uz/search/all?search_text=SHNQ+2.08.01-24",
    web_url: "https://lex.uz/uz/search/all?search_text=SHNQ+2.08.01-24",
    is_free: true,
    is_pro: false,
    order_index: 13
  },
  {
    stage_number: 6,
    title: "ShNQ 2.08.02-20 / ShNQ 2.08.02-23 (O'zbekiston)",
    author: "O'zbekiston Qurilish vazirligi",
    year: "2020 / 2024",
    language: "uz",
    topic: "Jamoat binolari va inshootlari (Общественные здания и сооружения)",
    benefit_description: "Ofis, savdo, maktab va umumiy ovqatlanish binolarida evakuatsiya yo'llari kengligi, zinalar nishabligi va sanuzellar me'yori.",
    resource_type: "standard",
    pdf_url: "https://lex.uz/uz/search/all?search_text=SHNQ+2.08.02",
    web_url: "https://lex.uz/uz/search/all?search_text=SHNQ+2.08.02",
    is_free: true,
    is_pro: false,
    order_index: 14
  },
  {
    stage_number: 6,
    title: "QMQ 2.01.03-19 (O'zbekiston)",
    author: "O'zbekiston Qurilish vazirligi",
    year: "2019",
    language: "uz",
    topic: "Zilzilaviy hududlarda qurilish (Строительство в сейсмических районах)",
    benefit_description: "O'zbekistonning 7, 8, 9 ballik seysmik zonalarida devorlar, antiseysmik poyaslar, choklar va karkas konstruksiyalar talablari.",
    resource_type: "standard",
    pdf_url: "https://lex.uz/uz/search/all?search_text=QMQ+2.01.03",
    web_url: "https://lex.uz/uz/search/all?search_text=QMQ+2.01.03",
    is_free: true,
    is_pro: false,
    order_index: 15
  },

  // REAL PROJECT ALBUMS (STAGE 7)
  {
    stage_number: 7,
    title: "Ko'p qavatli turar-joy binosi ishchi chizmalari albomi (АР)",
    author: "Professional loyiha instituti",
    year: "2021",
    language: "ru",
    topic: "Многоквартирный жилой дом — Раздел АР (Рабочая документация)",
    benefit_description: "45 listdan iborat real albom: Titul, 'Общие данные', kladochniy plan, tom plani, fasad pasporti, murakkab uzellar, Forma 5 va 6 vedomostlari.",
    resource_type: "project_album",
    pdf_url: "https://yandex.uz/search/?text=%D0%9C%D0%BD%D0%BE%D0%B3%D0%BE%D0%BA%D0%B2%D0%B0%D1%80%D1%82%D0%B8%D1%80%D0%BD%D1%8B%D0%B9+%D0%B6%D0%B8%D0%BB%D0%BE%D0%B9+%D0%B4%D0%BE%D0%BC+%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB+%D0%90%D0%A0+%D1%80%D0%B0%D0%B1%D0%BE%D1%87%D0%B0%D1%8F+%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%86%D0%B8%D1%8F+pdf",
    web_url: "https://dwg.ru/search?q=%D0%9C%D0%BD%D0%BE%D0%B3%D0%BE%D0%BA%D0%B2%D0%B0%D1%80%D1%82%D0%B8%D1%80%D0%BD%D1%8B%D0%B9+%D0%B6%D0%B8%D0%BB%D0%BE%D0%B9+%D0%B4%D0%BE%D0%BC+%D0%90%D0%A0",
    is_free: true,
    is_pro: false,
    order_index: 16
  },
  {
    stage_number: 7,
    title: "2 qavatli yakka tartibdagi uy-joy loyiha albomi (АС)",
    author: "Arxitektura ustaxonasi",
    year: "2022",
    language: "ru",
    topic: "Коттедж — Раздел АС (АР + КР)",
    benefit_description: "22 listdan iborat ixcham to'liq albom: arxitektura va konstruksiyani birlashtirish, poydevor va orayopma bog'lanishi, zinalar chizmasi.",
    resource_type: "project_album",
    pdf_url: "https://yandex.uz/search/?text=%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82+%D0%BA%D0%BE%D1%82%D1%82%D0%B5%D0%B4%D0%B6%D0%B0+%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB+%D0%90%D0%A1+%D1%80%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B5+%D1%87%D0%B5%D1%80%D1%82%D0%B5%D0%B6%D0%B8+pdf",
    web_url: "https://dwg.ru/search?q=%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82+%D0%BA%D0%BE%D1%82%D1%82%D0%B5%D0%B4%D0%B6%D0%B0+%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB+%D0%90%D0%A1",
    is_free: true,
    is_pro: false,
    order_index: 17
  },
  {
    stage_number: 7,
    title: "Zamonaviy kvartira interyeri ishchi dizayn-loyihasi (Neapol Design)",
    author: "Neapol Design studiyasi",
    year: "2023",
    language: "ru",
    topic: "Дизайн-проект интерьера — Полная рабочая документация",
    benefit_description: "38 listdan iborat interyer rabochkasi: Obmer, demontaj, montaj, planirovka, santexnika, potolok, svet, rozetka, razvertka, mebel spetsifikatsiyasi.",
    resource_type: "project_album",
    pdf_url: "https://yandex.uz/search/?text=%D0%94%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD-%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82+%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%8C%D0%B5%D1%80%D0%B0+%D1%80%D0%B0%D0%B1%D0%BE%D1%87%D0%B0%D1%8F+%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%86%D0%B8%D1%8F+%D1%87%D0%B5%D1%80%D1%82%D0%B5%D0%B6%D0%B8+pdf",
    web_url: "https://yandex.uz/search/?text=Neapol+Design+%D1%87%D0%B5%D1%80%D1%82%D0%B5%D0%B6%D0%B8+%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%8C%D0%B5%D1%80%D0%B0",
    is_free: true,
    is_pro: false,
    order_index: 18
  },

  // REVIT GUIDES (STAGE 8)
  {
    stage_number: 8,
    title: "Autodesk Community CIS — BIM-standart 2.0 va СПДС Shablonlari",
    author: "Autodesk Community CIS / BIM2B",
    year: "2022",
    language: "ru",
    topic: "Revit uchun rasmiy ruscha ADSK shablon va SPDS shtamplari",
    benefit_description: "Barcha GOST shriftlari, shtamplar (Forma 3, 4, 5), eshik-deraza vedomostlari va pol eksplikatsiyalari formulalari sozlangan tayyor andoza.",
    resource_type: "revit_guide",
    pdf_url: "https://github.com/BIM2B/BIM-Standards",
    web_url: "https://bim2b.ru/shablony-autodesk-revit-standarta-2-0",
    is_free: true,
    is_pro: false,
    order_index: 19
  },
  {
    stage_number: 8,
    title: "Mastering Autodesk Revit Architecture / Revit Construction Documentation",
    author: "Paul F. Aubin",
    year: "2020",
    language: "en",
    topic: "Professional sheet layout, views, schedules, detail components in Revit",
    benefit_description: "Revit'da kitobiy xalqaro sheet layout, annotatsiya, filtrlar va vedomostlar chiqarish bo'yicha dunyodagi eng nufuzli qo'llanma.",
    resource_type: "revit_guide",
    pdf_url: "https://yandex.uz/search/?text=Paul+F+Aubin+Mastering+Autodesk+Revit+Architecture+pdf",
    web_url: "https://paulaubin.com/books/",
    is_free: true,
    is_pro: false,
    order_index: 20
  }
];

const SEED_TABLES = [
  {
    table_key: "top_10_sources",
    title: "ENG MUHIM 10 TA MANBA (TOP-10)",
    subtitle: "Professional arxitektura va ishchi hujjatlar bo'yicha stol usti kutubxonasi",
    columns: ["№", "Manba nomi", "Qaysi mavzuni o'rgatadi", "Nima uchun o'qish kerak", "Qaysi tartibda o'qish lozim", "Havola"],
    rows: [
      ["1", "ГОСТ 21.101 (21.1101) — Asosiy talablar", "Albom strukturasi, shtamplar, formatlar, shifrlar", "Har qanday loyihaning bosh qonuni. Shtampni to'g'ri to'ldirish va listlarni raqamlash asosi.", "1-o'rinda", "https://files.stroyinf.ru/Index2/1/4293754/4293754162.htm"],
      ["2", "ГОСТ 21.501 — AR va AS qoidalari", "Plan, kesim, fasad, kladochniy plan, uzellar, spetsifikatsiyalar", "Arxitektura ishchi chizmalarining barcha grafik qoidalari va jadvallar shakli.", "2-o'rinda", "https://files.stroyinf.ru/Index2/1/4293753/4293753634.htm"],
      ["3", "Будасов Б.В. — «Строительное черчение»", "Grafik rasmiylashtirish, chiziqlar, zinalar, tomlar, konstruksiyalar", "Klassik arxitektura chizmachiligini noldan mukammal o'rgatadi. Hamma narsa illyustratsiyalar bilan.", "3-o'rinda", "https://studfile.net/search/?q=%D0%91%D1%83%D0%B4%D0%B0%D1%81%D0%BE%D0%B2+%D0%A1%D1%82%D1%80%D0%BE%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5+%D1%87%D0%B5%D1%80%D1%87%D0%B5%D0%BD%D0%B8%D0%B5"],
      ["4", "Георгиевский О.В. — «Правила выполнения чертежей»", "SPDS talablariga mos amaliy chizmalar, o'lcham qo'yish, koordinatsion o'qlar", "GOST qoidalarining eng tushunarli, ixcham va ko'rgazmali ma'lumotnomasi.", "4-o'rinda", "https://studfile.net/search/?q=%D0%93%D0%B5%D0%BE%D1%80%D0%B3%D0%B8%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9+%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0+%D0%B2%D1%8B%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D1%8F+%D1%87%D0%B5%D1%80%D1%82%D0%B5%D0%B6%D0%B5%D0%B9"],
      ["5", "ShNQ 1.03.01 / 1.03.03 (O'zbekiston)", "O'zbekistonda loyiha bosqichlari, tasdiqlash, albom tarkibi", "O'zbekiston sharoitida qaysi hujjatlar davlat ekspertizasiga kirishi va qonuniyligi.", "5-o'rinda", "https://lex.uz/uz/search/all?search_text=SHNQ+1.03.03"],
      ["6", "Киселева А., Митина Н. — «Дизайн интерьера: РД»", "Interyer rabochkasi: demontaj, montaj, svet, rozetka, razvertka", "Interyer dizaynida quruvchilar bilan tushunmovchilik bo'lmasligi uchun loyihani 100% to'g'ri tuzish.", "6-o'rinda", "https://yandex.uz/search/?text=%D0%9A%D0%B8%D1%81%D0%B5%D0%BB%D0%B5%D0%B2%D0%B0+%D0%9C%D0%B8%D1%82%D0%B8%D0%BD%D0%B0+%D0%94%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD+%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%8C%D0%B5%D1%80%D0%B0+%D1%80%D0%B0%D0%B1%D0%BE%D1%87%D0%B0%D1%8F+%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%86%D0%B8%D1%8F+pdf"],
      ["7", "Qodirov Q., Axmedov M. — «Arxitekturaviy loyihalash asoslari»", "Mahalliy arxitektura atamalari, loyihalash bosqichlari, binolar tuzilishi", "O'zbekiston sharoitida va o'zbek tilida professional terminologiyani egallash (TAQU darsligi).", "7-o'rinda", "https://unilibrary.uz/search?query=Arxitekturaviy+loyihalash+asoslari"],
      ["8", "Пономарев В.А. — «Архитектурное конструирование»", "Konstruktiv uzellar, pol piroglari, tom qatlamlari, poydevor tutashuvlari", "Reja va kesimlarni chizayotganda materiallar joylashuvini ilmiy va fizik asosda to'g'ri chizish.", "8-o'rinda", "https://studfile.net/search/?q=%D0%9F%D0%BE%D0%BD%D0%BE%D0%BC%D0%B0%D1%80%D0%B5%D0%B2+%D0%90%D1%80%D1%85%D0%B8%D1%82%D0%B5%D0%BA%D1%82%D1%83%D1%80%D0%BD%D0%BE%D0%B5+%D0%BA%D0%BE%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5"],
      ["9", "BIM2B & ADSK Shablon (Revit uchun SPDS shabloni)", "Revit'da avtomatik spetsifikatsiya, shtamp, sheet layout, view templates", "Dastur ichida SPDS standartlarini qo'lda chizmasdan, professional avtomatlashtirish.", "9-o'rinda", "https://bim2b.ru/shablony-autodesk-revit-standarta-2-0"],
      ["10", "Real AR / Interyer Ishchi Albomi (PDF namunalar)", "Haqiqiy ishlab chiqarishdagi loyihalar tajribasi", "Nazariya va qoidalarning real hayotda qanday jamlanganini ko'rib, o'z albomiga andoza olish.", "10-o'rinda", "https://yandex.uz/search/?text=%D0%9C%D0%BD%D0%BE%D0%B3%D0%BE%D0%BA%D0%B2%D0%B0%D1%80%D1%82%D0%B8%D1%80%D0%BD%D1%8B%D0%B9+%D0%B6%D0%B8%D0%BB%D0%BE%D0%B9+%D0%B4%D0%BE%D0%BC+%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB+%D0%90%D0%A0+%D1%80%D0%B0%D0%B1%D0%BE%D1%87%D0%B0%D1%8F+%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%86%D0%B8%D1%8F+pdf"]
    ],
    order_index: 1
  },
  {
    table_key: "uzbekistan_norms",
    title: "O‘zbekiston Normativ Hujjatlari (ShNQ / QMQ / O‘z DSt)",
    subtitle: "O'zbekiston Respublikasi Qurilish vazirligi va lex.uz amaldagi normativ bazasi",
    columns: ["№", "Hujjat kodi", "To'liq nomi", "Yili", "Holati", "Qaysi masalani tartibga soladi", "Rasmiy manba"],
    rows: [
      ["1", "ShNQ 1.03.01 / 1.03.03-23", "Qurilish obyektlarini loyihalashtirish, loyiha hujjatlarining tarkibi va tasdiqlanishi tartibi", "2024", "AMALDA", "Loyiha bosqichlari (Eskiz, P, RD), har bir bo'lim (AR, AS, VK, OV, EG) tarkibi va majburiy listlar ro'yxati.", "https://lex.uz/uz/search/all?search_text=SHNQ+1.03.03"],
      ["2", "QMQ 2.08.01-19 / ShNQ 2.08.01-24", "Turar joy obyektlarini loyihalash (Жилые здания)", "2024", "AMALDA", "Xonalar minimal balandligi, deraza yorug'lik nisbatlari, xonalar minimal maydoni, koridor va tamburlar o'lchamlari.", "https://lex.uz/uz/search/all?search_text=SHNQ+2.08.01-24"],
      ["3", "ShNQ 2.08.02-20 / ShNQ 2.08.02-23", "Jamoat binolari va inshootlari (Общественные здания и сооружения)", "2024", "AMALDA", "Ofis, savdo, maktab, restoran binolarida evakuatsiya yo'llari, zinapoyalar nishabligi, sanuzellar soni va joylashuvi.", "https://lex.uz/uz/search/all?search_text=SHNQ+2.08.02"],
      ["4", "QMQ 2.01.03-19", "Zilzilaviy hududlarda qurilish (Строительство в сейсмических районах)", "2019", "AMALDA", "O'zbekistonning 7, 8, 9 ballik seysmik zonalarida devorlar, antremur, antiseysmik choklar va karkas konstruksiyalar talablari.", "https://lex.uz/uz/search/all?search_text=QMQ+2.01.03"],
      ["5", "O'z DSt 734 / 735:2023", "Loyiha hujjatlarini rasmiylashtirish va muhandislik tarmoqlari standartlari", "2023", "AMALDA", "Loyiha hujjatlarining O'zbekistondagi milliy standartlari (to'g'ridan-to'g'ri GOST 21.101 ga havola qiladi).", "https://lex.uz/uz/search/all?search_text=O%27z+DSt+734"],
      ["6", "ShNQ 2.01.05-19", "Tabiiy va sun'iy yoritish (Естественное и искусственное освещение)", "2019", "AMALDA", "Interyer va me'moriy loyihalarda deraza o'lchamlari, KEO (insolyatsiya) ko'rsatkichlari va yoritish me'yorlari.", "https://lex.uz/uz/search/all?search_text=SHNQ+2.01.05"]
    ],
    order_index: 2
  },
  {
    table_key: "spds_gost_standards",
    title: "СПДС / GOST Standartlari Tizimi",
    subtitle: "Arxitektura va qurilish ishchi hujjatlarini rasmiylashtirish me'yorlari",
    columns: ["№", "Standart kodi", "To'liq nomi", "Nima uchun kerak", "Amaliy ahamiyati", "Ishonchli manba"],
    rows: [
      ["1", "ГОСТ 21.101-97 / ГОСТ Р 21.101-2020", "Система проектной документации для строительства. Основные требования к проектной и рабочей документации", "Loyiha albomining umumiy asosi. Formatlar, shtamp o'lchamlari, listlar shifrlari (AR, AS, VK), o'zgartirishlar kiritish qoidalari.", "Davlat ekspertizasi va qurilish kompaniyalari qabul qilishi uchun majburiy. Forma 3, 4, 5, 6 shtamplari.", "https://files.stroyinf.ru/Index2/1/4293754/4293754162.htm"],
      ["2", "ГОСТ 21.501-2018", "Правила выполнения рабочей документации архитектурных и конструктивных решений", "Aynan AR va AS bo'limi chizmalariga qo'yiladigan maxsus talablar: reja, kesim, fasad, devor klodkasi.", "Rejalarda o'lcham zanjirlari, deraza/eshik belgilari, Forma 5 (pol), Forma 6 (otdelka), Forma 7 (spetsifikatsiya) jadvallari.", "https://files.stroyinf.ru/Index2/1/4293753/4293753634.htm"],
      ["3", "ГОСТ 21.201-2011", "Условные графические изображения элементов зданий, сооружений и конструкций", "Bino konstruktiv elementlari va to'siqlarning shartli grafik belgilari.", "Devor materiallari shtrixovkalari (g'isht, beton, gazoblok, izolyatsiya), eshik ochilishlari va trap belgilari.", "https://allgosts.ru/01/100/gost_21.201-2011"],
      ["4", "ГОСТ 2.301-68", "Единая система конструкторской документации. Форматы", "Chizma qog'oz formatlari qatori.", "A0, A1, A2, A3, A4 va ularning karrali formatlari (A3x3, A4x4) o'lchamlari.", "https://allgosts.ru/01/100/gost_2.301-68"],
      ["5", "ГОСТ 2.302-68", "Масштабы", "Chizmalarda ruxsat etilgan masshtablar qatori.", "1:20, 1:25, 1:50, 1:100, 1:200, 1:500 ruxsat etilgan. 1:30, 1:75 kabi noqonuniy masshtablar taqiqlangan.", "https://allgosts.ru/01/100/gost_2.302-68"],
      ["6", "ГОСТ 2.303-68", "Линии", "Chizmalardagi chiziq turlari va qalinliklari.", "Asosiy tutash (0.5-0.7 mm), ingichka tutash (0.1-0.2 mm), shtrix, shtrix-punktir o'q chiziqlari.", "https://allgosts.ru/01/100/gost_2.303-68"],
      ["7", "ГОСТ 2.304-81", "Шрифты чертежные", "Chizmalardagi yozuv shriftlari qoidalari.", "Tip A va Tip B shriftlari: 2.5, 3.5, 5.0, 7.0, 10.0 mm harf balandliklari.", "https://allgosts.ru/01/100/gost_2.304-81"]
    ],
    order_index: 3
  },
  {
    table_key: "interior_drawings_checklist",
    title: "Interyer Ishchi Hujjatlarining 13 Majburiy Varaqlari (Checklist)",
    subtitle: "Dizayn-loyiha ishchi albomining professional ketma-ketligi va rasmiylashtirish qoidalari",
    columns: ["№", "Varaq nomi", "Ruscha nomi", "Tarkibi va chizish qoidalari", "Ahamiyati va vazifasi"],
    rows: [
      ["1", "O'lchov rejasi", "Обмерный план", "Mavjud xonalarning faktik o'lchamlari, shaxtalar, kanalizatsiya stoyaklari, deraza/eshik o'lchamlari, ship balandligi.", "Barcha keyingi loyihalashning poydevori. Xatolik butun loyihaga ta'sir qiladi."],
      ["2", "Buzish rejasi", "План демонтажа", "Qizil rang yoki qalin shtrix bilan olib tashlanadigan to'siq devorlar, eski eshik o'rinlari va utilizatsiya hajmlari.", "Quruvchiga qaysi devorlarni buzish kerakligini xatosiz ko'rsatish."],
      ["3", "Yangi montaj rejasi", "План монтажа", "Yashil rang yoki qalin chiziqlar bilan yangi tiklanadigan devorlar, gazoblok/GKL materiali, proyomlar va lintellar.", "Yangi orato'siqlarni toza geometriyada barpo etish."],
      ["4", "Mebel joylashtirish", "Планировочное решение", "Mebellarning toza gabarit o'lchamlari, minimal 700-900 mm o'tish yo'laklari, eshik ochilish radiuslari, pozitsiyalar.", "Xonaning ergonomikasi va funksional qulayligini ta'minlash."],
      ["5", "Santexnika bog'lanishi", "План сантехники", "Unitaz, rakovina, trap, dush, vanna, gigiyenik dush markazlarining toza pol va devordan aniq masofalari (privyazkalari).", "Santexnika quvurlarini plitka terilishidan oldin to'g'ri chiqarish."],
      ["6", "Pollar rejasi", "План полов", "Keramogranit, parket, laminat turlari, boshlash nuqtasi (start plitki), xonalar tutashuv choklari (eshik polotnosi ostida).", "Pol qoplamalarini estetik va to'g'ri sarf bilan yotqizish."],
      ["7", "Issiq pollar rejasi", "План теплых полов", "Isitish matlari konturlari, mebel tagiga tushmasligi, devordan 100-150 mm oraliq saqlanishi, termoregulyator balandligi.", "Kabel va matlarning kuyib ketishining oldini olish."],
      ["8", "Shiftlar rejasi", "План потолков", "Gipsokarton sathlari, tortma ship, soya profillari (EuroKRAAB), gardin nishalari, mutlaq balandliklar (+2.800).", "Shift konstruksiyasi va kornizlarni aniq o'rnatish."],
      ["9", "Yoritish jihozlari", "План освещения", "Lyustralar, treklar, nuqtali chiroqlar, LED tasmalar. Shift o'qlariga nisbatan aniq masofalari (privyazkalari).", "Yorug'lik manbalarini shiftga simmetrik va aniq joylashtirish."],
      ["10", "O'chirgichlar bog'lanishi", "План выключателей", "Har bir klavish qaysi chiroqni yoqishi punktir bilan ko'rsatiladi. Balandligi 900 mm, eshik tutqichidan 100-150 mm.", "Yoritishni boshqarish qulayligi va o'tish (prokhodnoy) kalitlar."],
      ["11", "Rozetkalar rejasi", "План розеток", "220V, Internet RJ45, TV, USB. O'rnatilish balandligi (+300, +950, +1200) va kuchli texnikalar uchun alohida liniyalar.", "Mebel va jihozlarga mos rozetkalar joylashuvi."],
      ["12", "Devor yoyilmalari", "Развертки стен", "Har bir xonaning devorlari ko'rinishi (1:25 / 1:50). Bo'yoq, oboy, plitka terish chizmasi, rozetkalar koordinatasi.", "Devorlardagi barcha elementlarning balandlik va kenglik koordinatalari."],
      ["13", "Spetsifikatsiyalar", "Спецификации и ведомости", "Mebel spetsifikatsiyasi, yoritgichlar ro'yxati (artikul, 3000K/4000K) va pardozlash materiallari vedomosti (+10% zapas).", "Xaridlar va smetani aniq shakllantirish."]
    ],
    order_index: 4
  }
];

// Database seeding & synchronization helper
async function initLearningTables(pool) {
  try {
    // 1. Create tables & constraints
    await pool.query(`
      CREATE TABLE IF NOT EXISTS learning_stages (
        id SERIAL PRIMARY KEY,
        stage_number INT NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(500),
        description TEXT,
        topics JSONB NOT NULL DEFAULT '[]',
        order_index INT NOT NULL DEFAULT 0,
        is_pro BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS learning_resources (
        id SERIAL PRIMARY KEY,
        stage_id INT REFERENCES learning_stages(id) ON DELETE SET NULL,
        title VARCHAR(500) NOT NULL,
        author VARCHAR(255),
        year VARCHAR(50),
        language VARCHAR(50) DEFAULT 'uz',
        topic VARCHAR(255),
        benefit_description TEXT,
        resource_type VARCHAR(50) NOT NULL,
        pdf_url TEXT,
        web_url TEXT,
        is_free BOOLEAN DEFAULT TRUE,
        is_pro BOOLEAN DEFAULT FALSE,
        order_index INT NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS learning_tables (
        id SERIAL PRIMARY KEY,
        table_key VARCHAR(100) NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        columns JSONB NOT NULL DEFAULT '[]',
        rows JSONB NOT NULL DEFAULT '[]',
        order_index INT NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS learning_progress (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        stage_id INT NOT NULL REFERENCES learning_stages(id) ON DELETE CASCADE,
        completed_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, stage_id)
      );

      CREATE INDEX IF NOT EXISTS idx_learning_stages_order ON learning_stages(order_index, stage_number);
      CREATE INDEX IF NOT EXISTS idx_learning_resources_stage ON learning_resources(stage_id, resource_type);
      CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON learning_progress(user_id);
    `);

    // 2. Always Sync / Upsert Stages
    for (const s of SEED_STAGES) {
      await pool.query(
        `INSERT INTO learning_stages (stage_number, title, subtitle, description, topics, order_index, is_pro)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (stage_number) DO UPDATE
         SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description,
             topics = EXCLUDED.topics, order_index = EXCLUDED.order_index, is_pro = EXCLUDED.is_pro`,
        [s.stage_number, s.title, s.subtitle, s.description, JSON.stringify(s.topics), s.order_index, s.is_pro]
      );
    }
    console.log('LEARNING CENTER: 9 ta bosqich ma\'lumotlari sinxronlashtirildi.');

    // 3. Always Sync / Upsert Resources with exact, verified URLs
    const stageRows = await pool.query('SELECT id, stage_number FROM learning_stages');
    const stageMap = {};
    stageRows.rows.forEach(r => { stageMap[r.stage_number] = r.id; });

    for (const res of SEED_RESOURCES) {
      const stageId = stageMap[res.stage_number] || null;
      // Match existing by exact title or order_index
      const existing = await pool.query(
        'SELECT id FROM learning_resources WHERE title = $1 OR order_index = $2 LIMIT 1',
        [res.title, res.order_index]
      );

      if (existing.rows[0]) {
        await pool.query(
          `UPDATE learning_resources
           SET stage_id = $1, title = $2, author = $3, year = $4, language = $5, topic = $6,
               benefit_description = $7, resource_type = $8, pdf_url = $9, web_url = $10,
               is_free = $11, is_pro = $12, order_index = $13
           WHERE id = $14`,
          [stageId, res.title, res.author, res.year, res.language, res.topic, res.benefit_description, res.resource_type, res.pdf_url, res.web_url, res.is_free, res.is_pro, res.order_index, existing.rows[0].id]
        );
      } else {
        await pool.query(
          `INSERT INTO learning_resources (stage_id, title, author, year, language, topic, benefit_description, resource_type, pdf_url, web_url, is_free, is_pro, order_index)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          [stageId, res.title, res.author, res.year, res.language, res.topic, res.benefit_description, res.resource_type, res.pdf_url, res.web_url, res.is_free, res.is_pro, res.order_index]
        );
      }
    }
    console.log('LEARNING CENTER: 20 ta resurs to\'g\'ridan-to\'g\'ri ishlovchi havolalar bilan yangilandi.');

    // 4. Always Sync / Upsert Tables
    for (const t of SEED_TABLES) {
      await pool.query(
        `INSERT INTO learning_tables (table_key, title, subtitle, columns, rows, order_index)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (table_key) DO UPDATE
         SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, columns = EXCLUDED.columns, rows = EXCLUDED.rows, order_index = EXCLUDED.order_index`,
        [t.table_key, t.title, t.subtitle, JSON.stringify(t.columns), JSON.stringify(t.rows), t.order_index]
      );
    }
    console.log('LEARNING CENTER: Me\'yoriy jadvallar va standartlar havolalari yangilandi.');
  } catch (err) {
    console.error('LEARNING CENTER INIT ERROR:', err);
  }
}

module.exports = {
  SEED_STAGES,
  SEED_RESOURCES,
  SEED_TABLES,
  initLearningTables
};
