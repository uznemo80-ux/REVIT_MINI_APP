// ======================================================
// YOSHUZBEKK Academy — Materials Knowledge Base
// Professional Qurilish va Interyer Materiallari Bazasi
// ======================================================

const SEED_CATEGORIES = [
  {
    name: "Devor",
    slug: "devor",
    icon: "🧱",
    description: "Tashqi va ichki devorlar, orato'siqlar uchun g'isht, blok va panellar",
    sort_order: 1
  },
  {
    name: "Yog‘och va yog‘och plitalar",
    slug: "yogoch",
    icon: "🪵",
    description: "Tabiiy yog'och, brus, fanera, MDF, DSP, OSB va muhandislik taxtalari",
    sort_order: 2
  },
  {
    name: "Plitalar",
    slug: "plitalar",
    icon: "🧩",
    description: "Gipsokarton (GKL), Akvapanel, sement-qirindili plitalar (SSP)",
    sort_order: 3
  },
  {
    name: "Izolyatsiya",
    slug: "izolyatsiya",
    icon: "🧊",
    description: "Issiqlik, namlik va gidroizolyatsiya materiallari (XPS, mineral vata)",
    sort_order: 4
  },
  {
    name: "Pardozlash",
    slug: "pardozlash",
    icon: "🎨",
    description: "Shpaklyovka, suvoq, bo'yoqlar, dekorativ qoplamalar va gulqog'ozlar",
    sort_order: 5
  },
  {
    name: "Tosh",
    slug: "tosh",
    icon: "🪨",
    description: "Marmar, granit, travertin, kvars agregati va sun'iy toshlar",
    sort_order: 6
  },
  {
    name: "Beton",
    slug: "beton",
    icon: "🏗",
    description: "Monolit beton, temir-beton konstruksiyalar va quruq beton qorishmalari",
    sort_order: 7
  },
  {
    name: "Metall",
    slug: "metall",
    icon: "🔩",
    description: "Po'lat profillar, armatura, metall karkaslar, burchakliklar va listlar",
    sort_order: 8
  },
  {
    name: "Oyna va fasad",
    slug: "oyna-fasad",
    icon: "🪟",
    description: "Shishapaketlar, tripleks, vitrajlar, alyuminiy fasad va kompozit panellar",
    sort_order: 9
  },
  {
    name: "Eshik va derazalar",
    slug: "eshik",
    icon: "🚪",
    description: "Kirish va ichki xonalararo eshiklar, yashirin eshiklar, oynaband eshiklar",
    sort_order: 10
  },
  {
    name: "Tom",
    slug: "tom",
    icon: "🏠",
    description: "Tom yopish materiallari, metallocherepitsa, yumshoq tom, profnastil",
    sort_order: 11
  },
  {
    name: "Santexnika",
    slug: "santexnika",
    icon: "🚿",
    description: "Quvurlar, fittinglar, vanna, unitaz, trap va drenaj tizimlari",
    sort_order: 12
  },
  {
    name: "Elektr",
    slug: "elektr",
    icon: "⚡",
    description: "Kabellar, gofra, avtomatlar, elektr shitlari va ulanish qutilari",
    sort_order: 13
  },
  {
    name: "Yoritish",
    slug: "yoritish",
    icon: "💡",
    description: "Trek tizimlari, diod tasmalar (LED), nuqtali va osma chiroqlar",
    sort_order: 14
  },
  {
    name: "Pol",
    slug: "pol",
    icon: "🧱",
    description: "Keramogranit, kafel, parket, laminat, SPC va quyma pollar",
    sort_order: 15
  },
  {
    name: "Yong‘in himoyasi",
    slug: "yongin-himoyasi",
    icon: "🔥",
    description: "Olovbardosh bo'yoqlar, yong'inga chidamli to'siqlar, klapanlar",
    sort_order: 16
  },
  {
    name: "Akustika",
    slug: "akustika",
    icon: "🔊",
    description: "Shovqin yutuvchi panellar, akustik membranalar va vibratsiyaga qarshi tagliklar",
    sort_order: 17
  },
  {
    name: "Qurilish kimyosi",
    slug: "qurilish-kimyosi",
    icon: "🧪",
    description: "Plitka yelimlari, gruntovka, germetiklar, silikon va gidrofobizatorlar",
    sort_order: 18
  },
  {
    name: "Mahkamlash materiallari",
    slug: "mahkamlash",
    icon: "🧰",
    description: "Samorezlar, dyubellar, anker boltlar, osqichlar va profil tutqichlari",
    sort_order: 19
  }
];

const SEED_MANUFACTURERS = [
  {
    name: "Knauf",
    slug: "knauf",
    logo: "https://lh3.googleusercontent.com/d/1_knauf_logo",
    website: "https://www.knauf.uz",
    country: "Germaniya / O'zbekiston",
    description: "Gips va sement asosidagi quruq qorishmalar, gipsokarton va akvapanel tizimlarida jahon yetakchisi"
  },
  {
    name: "EGGER",
    slug: "egger",
    logo: "https://lh3.googleusercontent.com/d/1_egger_logo",
    website: "https://www.egger.com",
    country: "Avstriya",
    description: "Mebel sanoati va interyer dizayni uchun yuqori sifatli MDF, DSP va laminat ishlab chiqaruvchisi"
  },
  {
    name: "Technonicol",
    slug: "technonicol",
    logo: "https://lh3.googleusercontent.com/d/1_technonicol_logo",
    website: "https://www.tn.ru",
    country: "Rossiya / Xalqaro",
    description: "Tom yopish, gidroizolyatsiya, XPS va mineral paxta issiqlik izolyatsiyasi bo'yicha yirik ishlab chiqaruvchi"
  },
  {
    name: "Italon",
    slug: "italon",
    logo: "https://lh3.googleusercontent.com/d/1_italon_logo",
    website: "https://www.italonceramica.ru",
    country: "Italiya / Rossiya (Gruppo Concorde)",
    description: "Italiya texnologiyasi asosida professional arxitekturaviy keramogranit va kafel plitalari"
  },
  {
    name: "Ceresit (Henkel)",
    slug: "ceresit",
    logo: "https://lh3.googleusercontent.com/d/1_ceresit_logo",
    website: "https://www.ceresit.com",
    country: "Germaniya",
    description: "Plitka yelimlari, fasad izolyatsiya tizimlari (SFTO) va professional qurilish kimyosi"
  },
  {
    name: "Arka Gazobeton",
    slug: "arka-gazobeton",
    logo: "https://lh3.googleusercontent.com/d/1_arka_logo",
    website: "https://arkagazobeton.uz",
    country: "O'zbekiston",
    description: "Nemis Wehrhahn texnologiyasida tayyorlanadigan energiya tejamkor avtoklav gazobeton bloklari"
  },
  {
    name: "SoundGuard",
    slug: "soundguard",
    logo: "https://lh3.googleusercontent.com/d/1_soundguard_logo",
    website: "https://soundguard.ru",
    country: "Rossiya / Germaniya",
    description: "Professional tovush izolyatsiyasi panellari, membranalar va akustik tizimlar"
  }
];

const SEED_MATERIALS = [
  // 1. KNAUF AQUAPANEL INDOOR
  {
    name: "Knauf Aquapanel Indoor",
    slug: "knauf-aquapanel-indoor",
    original_name: "АКВАПАНЕЛЬ Внутренняя (Knauf Aquapanel Cement Board Indoor)",
    english_name: "Knauf Aquapanel Cement Board Indoor",
    aliases: ["Aquapanel", "Аквапанель", "Akvapanel", "Akvapanel indoor", "Knauf sement plita", "Кнауф Аквапанель"],
    category_slug: "plitalar",
    subcategory_name: "Sement asosidagi plitalar",
    manufacturer_slug: "knauf",
    product_code: "KNAUF-AQ-IN-12.5",
    material_type: "Sement asosidagi namlikka 100% chidamli qurilish plitasi",
    cover_image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
    description: "Knauf Aquapanel Indoor — yengil sement va mineral to'ldirgichlar aralashmasidan tayyorlangan, ikki tomoni shisha tolali to'r bilan armaturalangan mustahkam plita. 100% suv va namlikka chidamli bo'lib, sanuzel, dush xonalari, basseyinlar va yuqori namlikka ega ichki devorlarda karkas tizimlariga o'rnatiladi.",
    dimensions_info: "Standart o'lcham: 1200 × 900 mm. Qalinligi: 12.5 mm. Variantlar: 2400 × 1200 × 12.5 mm, 2800 × 1200 × 12.5 mm.",
    status: "published",
    verification_status: "verified",
    access_type: "free",
    last_verified_at: "2026-09-28T00:00:00Z",

    sources: [
      {
        source_type: "technical_datasheet",
        title: "Knauf Aquapanel Cement Board Indoor — Technical Data Sheet (TDS v3.4)",
        url: "https://www.knauf.com/en/p/product/aquapanel-cement-board-indoor-125-mm-10020_0006",
        publisher: "Knauf Aquapanel GmbH",
        document_name: "Aquapanel Indoor TDS v3.4",
        document_version: "v3.4 (2024)",
        published_date: "2024-01-15",
        status: "verified",
        is_primary: true
      },
      {
        source_type: "installation_guide",
        title: "Knauf Aquapanel Vnutrennyaya — Montajnaya instruktsiya i tekhnicheskiy albom",
        url: "https://www.knauf.ru/catalog/find-products-and-systems/akvapanel-vnutrennjaja.html",
        publisher: "ООО КНАУФ ГИПС",
        document_name: "Albom rabochikh chertezhey Knauf Aquapanel",
        document_version: "Seriya 1.041",
        published_date: "2023-09-10",
        status: "verified",
        is_primary: false
      }
    ],

    specifications: [
      { parameter: "length", parameter_label: "Uzunligi", value: "1200", unit: "mm", document_page: "2", confidence: 1.0 },
      { parameter: "width", parameter_label: "Kengligi", value: "900", unit: "mm", document_page: "2", confidence: 1.0 },
      { parameter: "thickness", parameter_label: "Qalinligi", value: "12.5", unit: "mm", document_page: "2", confidence: 1.0 },
      { parameter: "weight", parameter_label: "Vazni (yuzasi bo'yicha)", value: "approx. 11.0", unit: "kg/m²", document_page: "2", confidence: 1.0 },
      { parameter: "density", parameter_label: "Zichligi", value: "approx. 1050", unit: "kg/m³", document_page: "2", confidence: 1.0 },
      { parameter: "bending_strength", parameter_label: "Egilishdagi mustahkamligi", value: "≥ 6.0", unit: "MPa (N/mm²)", document_page: "2", confidence: 1.0 },
      { parameter: "elastic_modulus", parameter_label: "Elastiklik moduli", value: "approx. 3800", unit: "MPa", document_page: "3", confidence: 0.98 },
      { parameter: "fire_rating", parameter_label: "Yong'inga chidamlilik klassi", value: "A1 (Yonmaydigan — Non-combustible / НГ)", unit: "EN 13501-1", document_page: "2", confidence: 1.0 },
      { parameter: "thermal_conductivity", parameter_label: "Issiqlik o'tkazuvchanligi (λ)", value: "0.27", unit: "W/(m·K)", document_page: "3", confidence: 1.0 },
      { parameter: "ph_value", parameter_label: "Ishqoriylik darajasi (pH)", value: "approx. 12", unit: "pH", document_page: "3", confidence: 1.0 },
      { parameter: "moisture_resistance", parameter_label: "Namlikka chidamliligi", value: "100% suvda erimaydi, chirish va mog'orga immunitet", unit: "standart", document_page: "1", confidence: 1.0 }
    ],

    documents: [
      {
        title: "Knauf Aquapanel Indoor — Rasmiy Texnik Pasport (TDS PDF)",
        document_type: "technical_datasheet",
        url: "https://www.knauf.com/en/p/product/aquapanel-cement-board-indoor-125-mm-10020_0006",
        version: "3.4",
        language: "en",
        published_date: "2024"
      },
      {
        title: "Knauf Aquapanel Montaj va Qo'llash Qo'llanmasi (PDF)",
        document_type: "installation_guide",
        url: "https://www.knauf.ru/catalog/find-products-and-systems/akvapanel-vnutrennjaja.html",
        version: "2023",
        language: "ru",
        published_date: "2023"
      }
    ],

    applications: [
      { application_type: "recommended", title: "Dush va vanna xonalari", description: "Suv to'g'ridan-to'g'ri oqadigan nam zonalarda plitka osti poydevori sifatida mukammal." },
      { application_type: "recommended", title: "Yopiq basseyinlar va saunalar", description: "Doimiy 90%+ havoning nisbiy namligi va xlorli muhitda shaklini yo'qotmaydi." },
      { application_type: "recommended", title: "Jamoat sanuzellari va oshxonalar", description: "Restoran, shifoxona va maktablarning sernam xo'jalik bloklarida." },
      { application_type: "not_recommended", title: "Tashqi ochiq fasadlar", description: "Indoor seriyasi faqat ichki xonalar uchun mo'ljallangan. Tashqi fasad uchun 'Aquapanel Outdoor' plitalari ishlatilishi shart." },
      { application_type: "not_recommended", title: "Yog'och karkas ustiga to'g'ridan-to'g'ri tikuvsiz yelimlash", description: "Yog'och qisqarishi natijasida choklar yorilmasligi uchun metall karkas tavsiya etiladi." }
    ],

    requirements: [
      { requirement_type: "surface_prep", title: "Karkas talabi", description: "Metall profillar qadami (oraliq masofasi) 600 mm dan oshmasligi, og'ir plitkalar yotqizilganda esa 300-400 mm qilib o'rnatilishi shart." },
      { requirement_type: "installation_step", title: "1. Karkasni tekshirish", description: "Metall yo'naltiruvchi va tirgak profillari vertikal sathini (lazer urven) tekshirish.", step_number: 1 },
      { requirement_type: "installation_step", title: "2. Kesish", description: "Plitani maxsus pichoq bilan ikki tomonlama shisha to'rini kesib, sindirib o'lchamga keltirish.", step_number: 2 },
      { requirement_type: "installation_step", title: "3. Mahkamlash", description: "Knauf Maxi Screw korroziyaga qarshi samorezlari yordamida har 250 mm oraliqda karkasga qotirish.", step_number: 3 },
      { requirement_type: "installation_step", title: "4. Choklarni yelimlash", description: "Plitalar tutashuviga Knauf Aquapanel Joint Adhesive polimer yelimi qo'llash.", step_number: 4 },
      { requirement_type: "installation_step", title: "5. Gidroizolyatsiya", description: "Burchaklar va quvur chiqishlariga Knauf Flachendicht elastik lentasi va mastikasi surtish.", step_number: 5 },
      { requirement_type: "required_material", title: "Mahkamlash", description: "Knauf Aquapanel Maxi Screw SN 39 yoki SN 25 zanglamas samorezlari." },
      { requirement_type: "required_material", title: "Chok materiali", description: "Knauf Aquapanel Fugenkleber (Joint Adhesive) chok yelimi." },
      { requirement_type: "required_tool", title: "Asboblar", description: "Shurupovyort (momentli), pichoq (trapeziya tig'li), metall qoida (pravilo), lazer sath o'lchagich, ruletka." },
      { requirement_type: "pro", title: "100% Namlikka chidamli", description: "Suv shimib shishib ketmaydi, qatlanmaydi va chirimaydi." },
      { requirement_type: "pro", title: "A1 Yong'in xavfsizligi", description: "Yonmaydigan toza noorganik material." },
      { requirement_type: "pro", title: "Egiluvchanlik radiusi", description: "Quruq holda 1 metr radiusgacha bukiladi, arkalar va doirasimon devorlar uchun qulay." },
      { requirement_type: "con", title: "Og'irligi", description: "Standart gipsokartonga nisbatan og'irroq (~11 kg/m²), ko'tarishda ikki kishi talab qilinadi." },
      { requirement_type: "con", title: "Maxsus samorez talabi", description: "Oddiy qora samorez sement tarkibidagi ishqordan zanglab ketadi, faqat korroziyaga qarshi qoplamali Maxi Screw ishlatiladi." },
      { requirement_type: "storage", title: "Saqlash qoidalari", description: "Quruq joyda, tekis tagliklar ustida gorizontal holatda saqlanishi kerak." },
      { requirement_type: "lifespan", title: "Xizmat muddati", description: "Ishlab chiqaruvchi tomonidan to'g'ri montaj qilinganda 50 yildan ortiq xizmat muddati ko'rsatilgan." }
    ]
  },

  // 2. KNAUF GKLV (Namlikka chidamli gipsokarton)
  {
    name: "Knauf GKLV (Namlikka chidamli gipsokarton)",
    slug: "knauf-gklv",
    original_name: "КНАУФ-лист влагостойкий (ГСП-Н2 / ГКЛВ)",
    english_name: "Knauf Moisture Resistant Gypsum Board",
    aliases: ["GKLV", "ГКЛВ", "Gipsokarton", "Yashil gipsokarton", "Влагостойкий гипсокартон", "Knauf green board"],
    category_slug: "plitalar",
    subcategory_name: "Gipsokarton plitalari",
    manufacturer_slug: "knauf",
    product_code: "KNAUF-GKLV-12.5",
    material_type: "Gips asosidagi namlikdan himoyalangan pardozlash plitasi",
    cover_image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    description: "Knauf GKLV — yadrosi maxsus gidrofob qo'shimchalar bilan to'yintirilgan va sirti yashil rangli zich karton bilan qoplangan to'g'rito'rtburchak pardozlash plitasi. Oddiy GKLga nisbatan suv shimuvchanligi 10 barobarga past bo'lib, me'yordagi namlikka ega xonalar devori va shiftini qoplashda ishlatiladi.",
    dimensions_info: "Standart: 2500 × 1200 × 12.5 mm. Og'irligi: ~8.8 kg/m². Variantlar: 3000 × 1200 × 12.5 mm, 2500 × 1200 × 9.5 mm (shift uchun).",
    status: "published",
    verification_status: "verified",
    access_type: "free",
    last_verified_at: "2026-09-28T00:00:00Z",

    sources: [
      {
        source_type: "technical_datasheet",
        title: "Knauf-list GKLV — GOST 32614-2012 / GOST 6266-97 rasmiy texnik hujjati",
        url: "https://www.knauf.uz/uz/katalog/mahsulotlar/knauf-list-namlikka-chidamli-gklv.html",
        publisher: "Knauf Gips Buxoro / Knauf International",
        document_name: "GOST 32614-2012 (EN 520)",
        document_version: "2023 nashri",
        published_date: "2023-05-12",
        status: "verified",
        is_primary: true
      }
    ],

    specifications: [
      { parameter: "length", parameter_label: "Uzunligi", value: "2500", unit: "mm", document_page: "1", confidence: 1.0 },
      { parameter: "width", parameter_label: "Kengligi", value: "1200", unit: "mm", document_page: "1", confidence: 1.0 },
      { parameter: "thickness", parameter_label: "Qalinligi", value: "12.5", unit: "mm", document_page: "1", confidence: 1.0 },
      { parameter: "weight", parameter_label: "Og'irligi (m²)", value: "approx. 8.8", unit: "kg/m²", document_page: "1", confidence: 1.0 },
      { parameter: "water_absorption", parameter_label: "Suv shimishi (gidrofob)", value: "≤ 10%", unit: "massa bo'yicha", document_page: "2", confidence: 1.0 },
      { parameter: "fire_rating", parameter_label: "Yonuvchanlik guruhi", value: "G1 (Kam yonuvchan) / V2 / D1 / T1", unit: "GOST 30244-94", document_page: "2", confidence: 1.0 },
      { parameter: "thermal_conductivity", parameter_label: "Issiqlik o'tkazuvchanligi", value: "0.22", unit: "W/(m·K)", document_page: "2", confidence: 1.0 },
      { parameter: "edge_type", parameter_label: "Yon qirra shakli", value: "PLUK (Yarim doirasimon yupqalashgan qirra)", unit: "standart", document_page: "1", confidence: 1.0 }
    ],

    documents: [
      {
        title: "Knauf GKLV Texnik Ma'lumotlar Varaqasi (PDF)",
        document_type: "technical_datasheet",
        url: "https://www.knauf.uz/uz/katalog/mahsulotlar/knauf-list-namlikka-chidamli-gklv.html",
        version: "2023",
        language: "uz",
        published_date: "2023"
      }
    ],

    applications: [
      { application_type: "recommended", title: "Oshxonalar va oraliq koridorlar", description: "Vaqti-vaqti bilan bug'lanish va namlik ko'tariladigan xonalar devori va shiftlari." },
      { application_type: "recommended", title: "Shamolli sanuzellar (gidroizolyatsiya bilan)", description: "Sirtiga Knauf Flachendicht surtilgandan keyin plitka terish mumkin." },
      { application_type: "not_recommended", title: "Doimiy suv oqadigan ochiq dush kabinalari", description: "Doimiy to'g'ridan-to'g'ri suv oqimida GKLV emas, Aquapanel sement plitasi ishlatilishi shart." }
    ],

    requirements: [
      { requirement_type: "surface_prep", title: "Profil o'rnatish", description: "Devorlarda 600 mm yoki 400 mm qadamli profil karkas." },
      { requirement_type: "installation_step", title: "1. Karkas o'rnatish", description: "PS va PN profillardan tekis karkas yasash.", step_number: 1 },
      { requirement_type: "installation_step", title: "2. Varaqni qotirish", description: "TN 25/35 samorezlari bilan 250 mm oraliqda qotirish.", step_number: 2 },
      { requirement_type: "installation_step", title: "3. Choklarni to'ldirish", description: "Knauf Fugen Hydro yoki Uniflott shpaklyovkasi va qog'oz lenta bilan choklarni yopish.", step_number: 3 },
      { requirement_type: "required_material", title: "Mahkamlash", description: "Gipsokarton uchun o'tkir samorezlar TN 25 (metall profil 0.6 mm uchun)." },
      { requirement_type: "required_tool", title: "Asboblar", description: "Qurilish pichog'i, shurupovyort, lazer urven, qirindi randasi (surpank)." },
      { requirement_type: "pro", title: "Tez va quruq montaj", description: "Suvoqsiz mukammal tekis devor hosil qiladi." },
      { requirement_type: "pro", title: "Ekologik toza", description: "Xona namligini o'ziga yutib, quruq paytda chiqarib beruvchi mikroiqlim xususiyati." },
      { requirement_type: "con", title: "Cheklangan suv chidamliligi", description: "Suv tagida qolsa karton va gips zaiflashishi mumkin." },
      { requirement_type: "storage", title: "Saqlash", description: "Quruq, yopiq xonada gorizontal holatda taglik ustida saqlansin." }
    ]
  },

  // 3. EGGER PERFECTSENSE / MDF
  {
    name: "EGGER MDF (Medium Density Fibreboard)",
    slug: "egger-mdf",
    original_name: "МДФ плита EGGER (E1E05 TSCA)",
    english_name: "EGGER Medium Density Fibreboard (MDF)",
    aliases: ["MDF", "МДФ", "EGGER MDF", "Medium Density Fibreboard", "MDF doska", "Egger plita"],
    category_slug: "yogoch",
    subcategory_name: "Yog'och-tolali plitalar",
    manufacturer_slug: "egger",
    product_code: "EGGER-MDF-ST-E1",
    material_type: "Yuqori zichlikdagi silliqlangan yog'och-tolali mebel va interyer plitasi",
    cover_image: "https://images.unsplash.com/photo-1540518614846-7ede433c4570?w=800&auto=format&fit=crop&q=80",
    description: "EGGER MDF — maydalangan yog'och tolalarini sintetik qatronlar bilan yuqori bosim va haroratda presslash orqali ishlab chiqariladigan bir jinsli yog'och plitasi. Uning qirralari va sirti zich bo'lib, frezerlash, bo'yash, shponlash va interyer panellarini tayyorlash uchun jahon standarti hisoblanadi.",
    dimensions_info: "Standart format: 2800 × 2070 mm. Qalinliklar: 8, 10, 12, 16, 18, 19, 22, 25, 28, 38 mm.",
    status: "published",
    verification_status: "verified",
    access_type: "free",
    last_verified_at: "2026-09-28T00:00:00Z",

    sources: [
      {
        source_type: "technical_datasheet",
        title: "EGGER MDF Technical Data Sheet — EN 622-5 / CE Standard",
        url: "https://www.egger.com/en/furniture-interior-design/products/raw-boards/mdf",
        publisher: "Fritz EGGER GmbH & Co. OG",
        document_name: "EGGER Raw MDF Datasheet EN 622-5",
        document_version: "Revision 14 (2024)",
        published_date: "2024-02-01",
        status: "verified",
        is_primary: true
      }
    ],

    specifications: [
      { parameter: "standard_format", parameter_label: "Standart varaq o'lchami", value: "2800 × 2070", unit: "mm", document_page: "1", confidence: 1.0 },
      { parameter: "density", parameter_label: "Zichligi", value: "720 – 760", unit: "kg/m³", document_page: "1", confidence: 1.0 },
      { parameter: "internal_bond", parameter_label: "Ichki yopishish mustahkamligi", value: "≥ 0.60", unit: "N/mm²", document_page: "2", confidence: 1.0 },
      { parameter: "bending_strength", parameter_label: "Egilish mustahkamligi", value: "≥ 22", unit: "N/mm²", document_page: "2", confidence: 1.0 },
      { parameter: "elastic_modulus", parameter_label: "Elastiklik moduli", value: "≥ 2500", unit: "N/mm²", document_page: "2", confidence: 1.0 },
      { parameter: "formaldehyde_emission", parameter_label: "Formaldegid emissiya klassi", value: "E1E05 / CARB 2 / TSCA Title VI (≤ 0.05 ppm)", unit: "EN 717-1", document_page: "1", confidence: 1.0 },
      { parameter: "moisture_swelling", parameter_label: "Qalinlik bo'yicha shishish (24 soat)", value: "≤ 12%", unit: "EN 317", document_page: "2", confidence: 1.0 },
      { parameter: "fire_rating", parameter_label: "Yong'in klassi", value: "D-s2, d0 (O'rtacha yonuvchan yog'och plita)", unit: "EN 13501-1", document_page: "2", confidence: 1.0 }
    ],

    documents: [
      {
        title: "EGGER MDF Official Product Datasheet (PDF)",
        document_type: "technical_datasheet",
        url: "https://www.egger.com/en/furniture-interior-design/products/raw-boards/mdf",
        version: "2024",
        language: "en",
        published_date: "2024"
      }
    ],

    applications: [
      { application_type: "recommended", title: "Mebel fasadlari va korpuslari", description: "Oshxona, yotoqxona va shkaflar fasadini CNC frezerlash va emal bilan bo'yash." },
      { application_type: "recommended", title: "Dekorativ devor panellari (Wall panels)", description: "Yashirin eshiklar, reyka panellari va akustik shponli devorlar." },
      { application_type: "not_recommended", title: "Ochiq tashqi atmosfera (outdoor)", description: "Yomg'ir va quyosh nuri ostida shishadi va qoplamasi ko'chadi." },
      { application_type: "not_recommended", title: "Doimiy nam pol osti qatlami", description: "Gidroizolyatsiyasiz zax joylarga to'shash man etiladi." }
    ],

    requirements: [
      { requirement_type: "surface_prep", title: "Aklimatizatsiya", description: "Plitalar ishlatishdan oldin 48 soat davomida montaj qilinadigan xona harorati (18-22°C)da saqlanishi kerak." },
      { requirement_type: "required_tool", title: "Asboblar", description: "Formatli arralash stanogi (skoring pichoqli), CNC frezer stanogi, shlifovka mashinasi." },
      { requirement_type: "pro", title: "Ideal silliq sirt", description: "G'ovaklari yo'qligi sababli lak va bo'yoq bir tekisda yotadi." },
      { requirement_type: "pro", title: "Toza frezerlanish", description: "Qirralari uqalanib ketmaydi, 3D relef va frezerli tutqichlar chiqarish mumkin." },
      { requirement_type: "con", title: "Oddiy holatda suvdan shishish", description: "Standart MDF namlikdan himoyalanmagan bo'lsa, qirralari nam tortganda shishadi." },
      { requirement_type: "storage", title: "Saqlash", description: "Mutlaqo gorizontal holatda, yerdan kamida 100 mm baland palletlar ustida quruq saqlansin." }
    ]
  },

  // 4. TECHNONICOL XPS CARBON ECO
  {
    name: "Technonicol XPS CARBON ECO",
    slug: "technonicol-xps-carbon-eco",
    original_name: "Экструзионный пенополистирол ТЕХНОНИКОЛЬ CARBON ECO",
    english_name: "Technonicol XPS Carbon Eco Extruded Polystyrene",
    aliases: ["XPS", "Penopolistirol", "Ekstrudirovanniy penoplast", "Carbon Eco", "Technonicol XPS", "Пеноплекс"],
    category_slug: "izolyatsiya",
    subcategory_name: "Issiqlik izolyatsiyasi",
    manufacturer_slug: "technonicol",
    product_code: "TN-XPS-CE-50",
    material_type: "Uglerod nanozarrachalari bilan mustahkamlangan ekstruzion penopolistirol plitasi",
    cover_image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
    description: "Technonicol XPS CARBON ECO — zamonaviy nanouglerod zarralari kiritilgan, yopiq mayda g'ovakli ekstruzion penopolistirol. U yuqori issiqlik tejash qobiliyati, nolga yaqin suv shimishi va juda yuqori siqilish mustahkamligiga ega. Poydevor, sokol, pol va tomlarda ishlatiladi.",
    dimensions_info: "Standart o'lcham: 1180 × 580 mm. Qalinligi: 50 mm (shuningdek 20, 30, 40, 100 mm variantlari mavjud). Qirrasi L-shaklli (choksiz tutashuv).",
    status: "published",
    verification_status: "verified",
    access_type: "free",
    last_verified_at: "2026-09-28T00:00:00Z",

    sources: [
      {
        source_type: "technical_datasheet",
        title: "Texnicheskiy list No. 1.01 — Ekstruzionniy penopolistirol TEKHNONIKOL CARBON ECO",
        url: "https://www.tn.ru/catalogue/ekstruzionnyj-penopolistirol/tehnonikol-carbon-eco/",
        publisher: "Kompaniya TekhnoNIKOL",
        document_name: "STOB 72746455-3.3.1-2012 / GOST 32310-2012",
        document_version: "Ver. 2024",
        published_date: "2024-03-10",
        status: "verified",
        is_primary: true
      }
    ],

    specifications: [
      { parameter: "length", parameter_label: "Uzunligi", value: "1180", unit: "mm", document_page: "1", confidence: 1.0 },
      { parameter: "width", parameter_label: "Kengligi", value: "580", unit: "mm", document_page: "1", confidence: 1.0 },
      { parameter: "thickness", parameter_label: "Qalinligi", value: "50", unit: "mm", document_page: "1", confidence: 1.0 },
      { parameter: "thermal_conductivity", parameter_label: "Issiqlik o'tkazuvchanligi (λD)", value: "0.029 – 0.034", unit: "W/(m·K)", document_page: "1", confidence: 1.0 },
      { parameter: "compressive_strength", parameter_label: "Siqilishdagi mustahkamligi (10% deformatsiya)", value: "≥ 250", unit: "kPa (25 t/m²)", document_page: "1", confidence: 1.0 },
      { parameter: "water_absorption", parameter_label: "Suv shimishi (28 kun to'liq suvda)", value: "≤ 0.4%", unit: "hajm bo'yicha", document_page: "1", confidence: 1.0 },
      { parameter: "temperature_range", parameter_label: "Ishchi harorat oralig'i", value: "-70 dan +75 gacha", unit: "°C", document_page: "2", confidence: 1.0 },
      { parameter: "fire_rating", parameter_label: "Yonuvchanlik guruhi", value: "G4 (Standart) / G3", unit: "GOST 30244", document_page: "2", confidence: 1.0 }
    ],

    documents: [
      {
        title: "Technonicol Carbon Eco Texnik Pasporti (PDF)",
        document_type: "technical_datasheet",
        url: "https://www.tn.ru/catalogue/ekstruzionnyj-penopolistirol/tehnonikol-carbon-eco/",
        version: "2024",
        language: "ru",
        published_date: "2024"
      }
    ],

    applications: [
      { application_type: "recommended", title: "Pol osti va issiq pollar izolyatsiyasi", description: "Poydevor plitasi yoki beton stiajka ostiga qo'yilib, issiqlikni erga ketishini to'sadi." },
      { application_type: "recommended", title: "Poydevor va sokol gidroizolyatsiyasi himoyasi", description: "Tuproq bosimi va zaxdan poydevorni ishonchli asraydi." },
      { application_type: "not_recommended", title: "Ventilyatsiyalanadigan fasadlar (Ventfasad)", description: "Yonuvchanligi G4 bo'lganligi sababli baland binolar ochiq fasadida yong'in qoidasiga ko'ra man etiladi (u yerda mineral vata kerak)." }
    ],

    requirements: [
      { requirement_type: "surface_prep", title: "Asos tekisligi", description: "Beton yuzasi tekis bo'lishi kerak. O'tkir toshlar va notekisliklar olib tashlanadi." },
      { requirement_type: "installation_step", title: "1. Plitalarni joylashtirish", description: "L-qirralari yordamida choklarni jips kiygizib terish.", step_number: 1 },
      { requirement_type: "installation_step", title: "2. Yelimlash", description: "Bitum yoki poliuretan yelim-ko'pik (Technonicol 500) bilan mahkamlash.", step_number: 2 },
      { requirement_type: "pro", title: "Eng past issiqlik o'tkazuvchanlik", description: "0.029 Vt/mK ko'rsatkichi bilan energiyani 40% gacha tejaydi." },
      { requirement_type: "pro", title: "Nolga yaqin suv shimuvchanlik", description: "Yer osti suvlari va botqoq tuproqda ham xususiyatini yo'qotmaydi." },
      { requirement_type: "con", title: "Erituvchilarga ta'sirchanlik", description: "Atseton, benzin va agressiv erituvchilar tegsa eriydi." },
      { requirement_type: "storage", title: "Saqlash", description: "To'g'ridan-to'g'ri quyosh nuri (UV)dan himoyalangan soyada saqlansin." },
      { requirement_type: "lifespan", title: "Xizmat muddati", description: "Konstruksiya ichida 50 yildan ortiq xizmat qiladi." }
    ]
  },

  // 5. GAZOBETON BLOK D500
  {
    name: "Avtoklav Gazobeton Blok D500",
    slug: "gazobeton-blok-d500",
    original_name: "Газобетонный блок D500 / B2.5 (Автоклавный газобетон)",
    english_name: "Autoclaved Aerated Concrete Block (AAC D500)",
    aliases: ["Gazoblok", "Газоблок", "Gazobeton", "AAC", "Gazosilikat", "D500 blok", "Автоклавный газобетон"],
    category_slug: "devor",
    subcategory_name: "Konstruktiv devor bloklari",
    manufacturer_slug: "arka-gazobeton",
    product_code: "ARKA-AAC-D500-600x300x200",
    material_type: "Avtoklavda bug'lantirilgan g'ovakli beton devor bloki",
    cover_image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&auto=format&fit=crop&q=80",
    description: "Avtoklav gazobeton D500 — kvars qumi, sement, ohak va suv aralashmasiga alyuminiy kukuni qo'shib ko'pirtirilgan, so'ng 12 bar bosim va 190°C bug' kamerasida pishirilgan baquvvat devor bloki. Quruq, geometrik jihatdan juda aniq va ajoyib issiqlik izolyatsiyasiga ega.",
    dimensions_info: "Standart gabarit: 600 × 300 × 200 mm (Uzunlik × Kenglik × Balandlik). Shuningdek to'siq devorlar uchun 600 × 100 × 200 mm, 600 × 150 × 200 mm.",
    status: "published",
    verification_status: "verified",
    access_type: "free",
    last_verified_at: "2026-09-28T00:00:00Z",

    sources: [
      {
        source_type: "standard",
        title: "GOST 31360-2007 / GOST 31359-2007 — Izdeliya stenovye nearmironovannye iz avtoklavnogo gazobetona",
        url: "https://allgosts.ru/91/100/gost_31360-2007",
        publisher: "Gosstandart / Standartlashtirish agentligi",
        document_name: "GOST 31360-2007",
        document_version: "Amaldagi standart",
        published_date: "2008-01-01",
        status: "verified",
        is_primary: true
      }
    ],

    specifications: [
      { parameter: "length", parameter_label: "Uzunligi", value: "600", unit: "mm", document_page: "1", confidence: 1.0 },
      { parameter: "width", parameter_label: "Devor qalinligi (kenglik)", value: "300", unit: "mm", document_page: "1", confidence: 1.0 },
      { parameter: "height", parameter_label: "Balandligi", value: "200", unit: "mm", document_page: "1", confidence: 1.0 },
      { parameter: "density", parameter_label: "Hajmiy zichligi", value: "D500 (500)", unit: "kg/m³", document_page: "2", confidence: 1.0 },
      { parameter: "compressive_strength", parameter_label: "Siqilishdagi mustahkamlik klassi", value: "B2.5 (M35 ga teng)", unit: "MPa", document_page: "2", confidence: 1.0 },
      { parameter: "thermal_conductivity", parameter_label: "Issiqlik o'tkazuvchanligi (quruq holatda)", value: "0.12", unit: "W/(m·K)", document_page: "3", confidence: 1.0 },
      { parameter: "frost_resistance", parameter_label: "Sovuqqa chidamliligi", value: "F100 (100 tsikl)", unit: "tsikl", document_page: "3", confidence: 1.0 },
      { parameter: "fire_rating", parameter_label: "Yong'inga chidamlilik", value: "REI 240 (Yonmaydigan — A1 / НГ)", unit: "standart", document_page: "3", confidence: 1.0 }
    ],

    documents: [
      {
        title: "Avtoklav Gazobeton GOST Standarti va Loyihalash Bo'yicha Qo'llanma (PDF)",
        document_type: "standard",
        url: "https://allgosts.ru/91/100/gost_31360-2007",
        version: "GOST 31360-2007",
        language: "ru",
        published_date: "2008"
      }
    ],

    applications: [
      { application_type: "recommended", title: "Karkasli binolarning tashqi to'ldiruvchi devorlari", description: "Temir-beton karkasli ko'p qavatli binolarda yuk ko'tarmas tashqi devorlar uchun eng ommabop yechim." },
      { application_type: "recommended", title: "Kam qavatli kottejlar (3 qavatgacha)", description: "B2.5 klassli bloklar antiseysmik poyas bilan 3 qavatgacha yuk ko'taruvchi devor bo'la oladi." },
      { application_type: "not_recommended", title: "Poydevor va zax yerto'la devorlari", description: "G'ovakli bo'lganligi sababli yer ostida doimiy namlikda ishlatish qat'iyan taqiqlanadi." }
    ],

    requirements: [
      { requirement_type: "surface_prep", title: "Birinchi qator", description: "Birinchi qator sement-qum qorishmasiga, gidroizolyatsiya ustiga mukammal nolda teriladi." },
      { requirement_type: "installation_step", title: "1. Yelim bilan terish", description: "Keyingi qatorlar yupqa qatlamli (2-3 mm) maxsus gazobeton yelimi bilan tishli shpatelda teriladi.", step_number: 1 },
      { requirement_type: "installation_step", title: "2. Armaturalash", description: "Har 3-4 qatorda devor burchaklari va deraza osti shtrobalanib, d8 mm armatura bilan to'ldiriladi.", step_number: 2 },
      { requirement_type: "required_tool", title: "Asboblar", description: "Gazoblok arrasi, tishli kovsh (yelim uchun), shtroborez, rezina bolg'a, qirg'ich (tyorka)." },
      { requirement_type: "pro", title: "Ajoyib issiqlik izolatsiyasi", description: "Pishgan g'ishtga nisbatan 3 barobar issiq, devor qalinligini kamaytirish imkoni." },
      { requirement_type: "pro", title: "Mukammal geometriya", description: "Blok o'lchamlari aniqligi ±1 mm, ichki suvoq sarfini keskin kamaytiradi." },
      { requirement_type: "con", title: "Namlikni tez shimishi", description: "Fasadga yomg'ir to'g'ridan-to'g'ri tegmasligi uchun bug' o'tkazuvchan gidrofob pardoz kerak." }
    ]
  },

  // 6. KERAMOGRANIT 600x1200 mm (Italon)
  {
    name: "Keramogranit 600×1200 mm (Italon)",
    slug: "keramogranit-600x1200-italon",
    original_name: "Керамогранит ректифицированный 60×120 см (Italon Porcelain Stoneware)",
    english_name: "Rectified Porcelain Stoneware 600x1200 mm",
    aliases: ["Keramogranit", "Керамогранит", "Plitka", "Kafel", "Porcelain tile", "Italon plitka", "Katta formatli kafel"],
    category_slug: "pol",
    subcategory_name: "Keramogranit va tosh plitalar",
    manufacturer_slug: "italon",
    product_code: "IT-PORC-60120-RET",
    material_type: "Rektifikatsiyalangan to'liq massali gres-keramogranit plitasi",
    cover_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
    description: "Italon keramograniti — oq loy, kvars qumi, dala shpati va tabiiy bo'yoqlardan 500 kg/sm² bosim ostida presslanib, 1250°C haroratda kuydirilgan g'ovaksiz tosh qoplama. Rektifikatsiyalangan qirralari tufayli 1-1.5 mm minimal chok bilan monolit tekislikda yotqiziladi.",
    dimensions_info: "Standart format: 600 × 1200 mm. Qalinligi: 9.0 mm (ba'zi kolleksiyalarda 10 mm va 20 mm tashqi terassalar uchun).",
    status: "published",
    verification_status: "verified",
    access_type: "free",
    last_verified_at: "2026-09-28T00:00:00Z",

    sources: [
      {
        source_type: "technical_datasheet",
        title: "Italon Technical Specification — EN 14411 Group BIa / ISO 13006",
        url: "https://www.italonceramica.ru/ru/kollektsii/",
        publisher: "JSC Keramagranit Italon (Concorde Group)",
        document_name: "Italon Technical Catalog EN 14411",
        document_version: "Edition 2024",
        published_date: "2024-01-20",
        status: "verified",
        is_primary: true
      }
    ],

    specifications: [
      { parameter: "length", parameter_label: "Uzunligi", value: "1198 (nominal 1200)", unit: "mm", document_page: "1", confidence: 1.0 },
      { parameter: "width", parameter_label: "Kengligi", value: "598 (nominal 600)", unit: "mm", document_page: "1", confidence: 1.0 },
      { parameter: "thickness", parameter_label: "Qalinligi", value: "9.0", unit: "mm", document_page: "1", confidence: 1.0 },
      { parameter: "water_absorption", parameter_label: "Suv shimishi", value: "≤ 0.05% (juda past)", unit: "ISO 10545-3", document_page: "2", confidence: 1.0 },
      { parameter: "bending_strength", parameter_label: "Egilish mustahkamligi", value: "≥ 45", unit: "N/mm²", document_page: "2", confidence: 1.0 },
      { parameter: "slip_resistance", parameter_label: "Sirpanishga qarshi klass", value: "R10 / A+B (Matoviy sirt)", unit: "DIN 51130", document_page: "2", confidence: 1.0 },
      { parameter: "abrasion_resistance", parameter_label: "Yeyilishga chidamlilik", value: "PEI IV / PEI V (Yuqori o'tish zonalari)", unit: "ISO 10545-7", document_page: "2", confidence: 1.0 },
      { parameter: "frost_resistance", parameter_label: "Sovuqqa chidamlilik", value: "Muzlamaydi (100% chidamli)", unit: "ISO 10545-12", document_page: "2", confidence: 1.0 }
    ],

    documents: [
      {
        title: "Italon Keramogranit Rasmiy Texnik Katalogi (PDF)",
        document_type: "technical_datasheet",
        url: "https://www.italonceramica.ru/ru/kollektsii/",
        version: "2024",
        language: "ru",
        published_date: "2024"
      }
    ],

    applications: [
      { application_type: "recommended", title: "Kvartira va uylarning pol qoplamasi", description: "Mehmonxona, oshxona, dahliz va sanuzellarda toza va uzoq umr ko'ruvchi yuzalar." },
      { application_type: "recommended", title: "Tijoriy markazlar va ofislar", description: "Katta odam oqimiga ega bo'lgan savdo markazlari va aeroport zallari." },
      { application_type: "not_recommended", title: "Oddiy arzon gipsli yelimga yotqizish", description: "Suv shimishi deyarli nol bo'lgani uchun oddiy sementli arzon yelim tutmaydi, faqat C2TE S1 klassli yuqori polimerli yelim kerak." }
    ],

    requirements: [
      { requirement_type: "surface_prep", title: "Asos tekisligi", description: "Stiajka sathidagi og'ish 2 metrli qoidada 2 mm dan oshmasligi shart (samonivelir tavsiya)." },
      { requirement_type: "installation_step", title: "1. Ikki tomonlama yelim surtish", description: "Yelim ham polga, ham plitkaning orqa tomoniga tishli shpatelda surtiladi (100% kontakt).", step_number: 1 },
      { requirement_type: "installation_step", title: "2. SVP tizimi", description: "Plitkalarni tekislash uchun maxsus SVP qisqichlari (1.5 mm) qo'llaniladi.", step_number: 2 },
      { requirement_type: "required_material", title: "Yelim talabi", description: "Ceresit CM 14 / CM 16 / CM 17 kabi elastik C2 sinfidagi yelimlar." },
      { requirement_type: "required_tool", title: "Asboblar", description: "Suvli elektr plitkarez (1200 mm), vakuumli ushlagichlar, tishli shpatel (10 mm), rezina bolg'a, SVP." },
      { requirement_type: "pro", title: "Chidamlilik va mustahkamlik", description: "Tirnalmaydi, to'kilmaydi, kimyoviy tozalash vositalaridan dog' qolmaydi." },
      { requirement_type: "pro", title: "Issiq pollar uchun ideal", description: "Yuqori issiqlik o'tkazuvchanligi sababli issiq pol tizimlari bilan eng yaxshi ishlaydi." }
    ]
  },

  // 7. CERESIT CM 17 SUPER FLEXIBLE
  {
    name: "Ceresit CM 17 Super Flexible",
    slug: "ceresit-cm-17",
    original_name: "Высокоэластичный клей для плитки Ceresit CM 17 Super Flex (C2TE S1)",
    english_name: "Ceresit CM 17 Highly Flexible Tile Adhesive",
    aliases: ["Ceresit CM 17", "CM 17", "Plitka yelimi", "Клей CM 17", "Kley kafel", "C2TE S1 yelim"],
    category_slug: "qurilish-kimyosi",
    subcategory_name: "Plitka yelimlari va qorishmalar",
    manufacturer_slug: "ceresit",
    product_code: "HENKEL-CM17-25KG",
    material_type: "Katta formatli plitalar va deformatsiyalanuvchi asoslar uchun yuqori elastik plitka yelimi",
    cover_image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80",
    description: "Ceresit CM 17 — eng murakkab va mas'uliyatli yuzalar (gipsokarton, OSB, deformatsiyalanuvchi karkaslar, issiq pollar, basseynlar va fasadlar) uchun maxsus ishlab chiqilgan, tolalar bilan kuchaytirilgan (Fibre Force) S1 sinfidagi yuqori elastik sementli yelim.",
    dimensions_info: "Qadoqlash: 25 kg qog'oz qop. Sarf miqdori: 1.5 – 4.2 kg/m² (shpatel tish o'lchamiga qarab).",
    status: "published",
    verification_status: "verified",
    access_type: "free",
    last_verified_at: "2026-09-28T00:00:00Z",

    sources: [
      {
        source_type: "technical_datasheet",
        title: "Ceresit CM 17 Super Flexible — Technical Data Sheet (EN 12004 C2TE S1)",
        url: "https://www.ceresit.com/en/products/tile-fixing/tile-adhesives/cm-17-super-flexible.html",
        publisher: "Henkel Bautechnik",
        document_name: "Ceresit CM 17 TDS EN 12004",
        document_version: "2024 Release",
        published_date: "2024-02-15",
        status: "verified",
        is_primary: true
      }
    ],

    specifications: [
      { parameter: "standard_classification", parameter_label: "Yevropa klassifikatsiyasi", value: "C2 TE S1 (Yuqori yopishuvchi, siljimaydigan, elastik)", unit: "EN 12004", document_page: "1", confidence: 1.0 },
      { parameter: "adhesion_strength", parameter_label: "Yopishish mustahkamligi (adgeziya)", value: "≥ 1.5", unit: "N/mm² (MPa)", document_page: "2", confidence: 1.0 },
      { parameter: "transverse_deformation", parameter_label: "Ko'ndalang deformatsiyalanishi (Elastiklik)", value: "≥ 2.5 mm (S1 sinf)", unit: "EN 12002", document_page: "2", confidence: 1.0 },
      { parameter: "open_time", parameter_label: "Ochiq vaqt (ishlash vaqti)", value: "kamida 30", unit: "daqiqa", document_page: "2", confidence: 1.0 },
      { parameter: "walkable_after", parameter_label: "Ustidan yurish mumkin bo'lgan vaqt", value: "24", unit: "soat", document_page: "2", confidence: 1.0 },
      { parameter: "temperature_resistance", parameter_label: "Haroratga chidamliligi", value: "-50 dan +70 gacha", unit: "°C", document_page: "2", confidence: 1.0 }
    ],

    documents: [
      {
        title: "Ceresit CM 17 Texnik Varaqasi (TDS PDF)",
        document_type: "technical_datasheet",
        url: "https://www.ceresit.com/en/products/tile-fixing/tile-adhesives/cm-17-super-flexible.html",
        version: "2024",
        language: "en",
        published_date: "2024"
      }
    ],

    applications: [
      { application_type: "recommended", title: "Katta formatli keramogranit (120×120, 120×240 sm)", description: "Vazni va maydoni katta plitalarni siljitmay mustahkam ushlab turadi." },
      { application_type: "recommended", title: "Suvli issiq pollar va elektr matlar", description: "Harorat o'zgarishi natijasida kengayish va qisqarish choklarini elastik kompensatsiya qiladi." },
      { application_type: "recommended", title: "Gipsokarton, DSP va OSB asoslar", description: "Biroz tebranuvchan va qisqaruvchi karkasli asoslar uchun xavfsiz." }
    ],

    requirements: [
      { requirement_type: "surface_prep", title: "Gruntovka", description: "Asos changdan tozalanishi va Ceresit CT 17 gruntovkasi bilan to'liq to'yintirilishi shart." },
      { requirement_type: "installation_step", title: "1. Qorishtirish", description: "25 kg qopga 7.0-7.5 litr toza suv qo'shib mikser bilan 5 daqiqa qorishtirish va 5 daqiqa tindirish.", step_number: 1 },
      { requirement_type: "required_tool", title: "Asboblar", description: "Past aylanmali qurilish mikseri, zanglamas tishli shpatel, chelak, sath o'lchagich." },
      { requirement_type: "pro", title: "Fibre Force tolasi", description: "Ichki mikrotolalar kuchli yuklama ostida ham yelim qatlamining sinishini oldini oladi." },
      { requirement_type: "storage", title: "Saqlash muddati", description: "Zavod qadog'ida quruq xonada 12 oy." }
    ]
  }
];

// Database Table Initialization & Synchronization
async function initMaterialsTables(pool) {
  try {
    // 1. Create Categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS material_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE,
        icon VARCHAR(50) DEFAULT '🧱',
        description TEXT,
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Create Manufacturers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS material_manufacturers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE,
        logo VARCHAR(500),
        website VARCHAR(500),
        country VARCHAR(100),
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 3. Create Main Materials table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS materials (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        original_name VARCHAR(255),
        english_name VARCHAR(255),
        aliases TEXT[] DEFAULT '{}',
        category_id INT REFERENCES material_categories(id) ON DELETE SET NULL,
        subcategory_name VARCHAR(255),
        manufacturer_id INT REFERENCES material_manufacturers(id) ON DELETE SET NULL,
        product_code VARCHAR(100),
        material_type VARCHAR(255),
        cover_image VARCHAR(500),
        gallery JSONB DEFAULT '[]',
        description TEXT,
        dimensions_info TEXT,
        status VARCHAR(50) DEFAULT 'published',
        verification_status VARCHAR(50) DEFAULT 'verified',
        access_type VARCHAR(50) DEFAULT 'free',
        last_verified_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 4. Create Material Sources table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS material_sources (
        id SERIAL PRIMARY KEY,
        material_id INT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
        source_type VARCHAR(50) NOT NULL,
        title VARCHAR(500) NOT NULL,
        url TEXT NOT NULL,
        publisher VARCHAR(255),
        document_name VARCHAR(255),
        document_version VARCHAR(100),
        published_date VARCHAR(100),
        retrieved_at TIMESTAMPTZ DEFAULT NOW(),
        last_checked_at TIMESTAMPTZ DEFAULT NOW(),
        status VARCHAR(50) DEFAULT 'verified',
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 5. Create Material Specifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS material_specifications (
        id SERIAL PRIMARY KEY,
        material_id INT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
        parameter VARCHAR(100) NOT NULL,
        parameter_label VARCHAR(255) NOT NULL,
        value VARCHAR(255) NOT NULL,
        unit VARCHAR(50),
        source_id INT REFERENCES material_sources(id) ON DELETE SET NULL,
        source_document_page VARCHAR(50),
        confidence NUMERIC(3,2) DEFAULT 1.0,
        verified_at TIMESTAMPTZ DEFAULT NOW(),
        order_index INT DEFAULT 0
      );
    `);

    // 6. Create Material Documents table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS material_documents (
        id SERIAL PRIMARY KEY,
        material_id INT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        document_type VARCHAR(50) NOT NULL,
        url TEXT NOT NULL,
        file_url TEXT,
        version VARCHAR(100),
        language VARCHAR(50) DEFAULT 'uz',
        published_date VARCHAR(100),
        order_index INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 7. Create Material Applications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS material_applications (
        id SERIAL PRIMARY KEY,
        material_id INT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
        application_type VARCHAR(50) NOT NULL,
        title VARCHAR(255),
        description TEXT NOT NULL,
        source_id INT REFERENCES material_sources(id) ON DELETE SET NULL
      );
    `);

    // 8. Create Material Requirements & Recommendations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS material_requirements (
        id SERIAL PRIMARY KEY,
        material_id INT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
        requirement_type VARCHAR(50) NOT NULL,
        title VARCHAR(255),
        description TEXT NOT NULL,
        step_number INT,
        source_id INT REFERENCES material_sources(id) ON DELETE SET NULL,
        order_index INT DEFAULT 0
      );
    `);

    // 9. Create Material Version History table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS material_version_history (
        id SERIAL PRIMARY KEY,
        material_id INT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
        parameter VARCHAR(100) NOT NULL,
        old_value TEXT,
        new_value TEXT,
        change_difference TEXT,
        source_document VARCHAR(255),
        source_id INT REFERENCES material_sources(id) ON DELETE SET NULL,
        changed_by INT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 10. Create Material Audit Logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS material_audit_logs (
        id SERIAL PRIMARY KEY,
        material_id INT REFERENCES materials(id) ON DELETE SET NULL,
        admin_id INT REFERENCES users(id) ON DELETE SET NULL,
        admin_name VARCHAR(255),
        action VARCHAR(100) NOT NULL,
        details JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Indexes for fast searching and filtering
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category_id, status);
      CREATE INDEX IF NOT EXISTS idx_materials_mfg ON materials(manufacturer_id);
      CREATE INDEX IF NOT EXISTS idx_materials_slug ON materials(slug);
      CREATE INDEX IF NOT EXISTS idx_material_specs_mat ON material_specifications(material_id);
      CREATE INDEX IF NOT EXISTS idx_material_sources_mat ON material_sources(material_id);
      CREATE INDEX IF NOT EXISTS idx_material_docs_mat ON material_documents(material_id);
      CREATE INDEX IF NOT EXISTS idx_material_apps_mat ON material_applications(material_id);
      CREATE INDEX IF NOT EXISTS idx_material_reqs_mat ON material_requirements(material_id);
    `);

    // --- SEED CATEGORIES ---
    for (const cat of SEED_CATEGORIES) {
      await pool.query(`
        INSERT INTO material_categories (name, slug, icon, description, sort_order, is_active)
        VALUES ($1, $2, $3, $4, $5, true)
        ON CONFLICT (slug) DO UPDATE
        SET name = EXCLUDED.name, icon = EXCLUDED.icon, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order
      `, [cat.name, cat.slug, cat.icon, cat.description, cat.sort_order]);
    }

    // --- SEED MANUFACTURERS ---
    for (const mfg of SEED_MANUFACTURERS) {
      await pool.query(`
        INSERT INTO material_manufacturers (name, slug, logo, website, country, description)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (slug) DO UPDATE
        SET name = EXCLUDED.name, logo = EXCLUDED.logo, website = EXCLUDED.website, country = EXCLUDED.country, description = EXCLUDED.description
      `, [mfg.name, mfg.slug, mfg.logo, mfg.website, mfg.country, mfg.description]);
    }

    // Category and Manufacturer maps
    const catRows = await pool.query('SELECT id, slug FROM material_categories');
    const catMap = {};
    catRows.rows.forEach(r => { catMap[r.slug] = r.id; });

    const mfgRows = await pool.query('SELECT id, slug FROM material_manufacturers');
    const mfgMap = {};
    mfgRows.rows.forEach(r => { mfgMap[r.slug] = r.id; });

    // --- SEED MATERIALS & RELATIONS ---
    for (const m of SEED_MATERIALS) {
      const categoryId = catMap[m.category_slug] || null;
      const manufacturerId = mfgMap[m.manufacturer_slug] || null;

      const matRes = await pool.query(`
        INSERT INTO materials (name, slug, original_name, english_name, aliases, category_id, subcategory_name, manufacturer_id, product_code, material_type, cover_image, description, dimensions_info, status, verification_status, access_type, last_verified_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW())
        ON CONFLICT (slug) DO UPDATE
        SET name = EXCLUDED.name, original_name = EXCLUDED.original_name, english_name = EXCLUDED.english_name,
            aliases = EXCLUDED.aliases, category_id = EXCLUDED.category_id, subcategory_name = EXCLUDED.subcategory_name,
            manufacturer_id = EXCLUDED.manufacturer_id, product_code = EXCLUDED.product_code, material_type = EXCLUDED.material_type,
            cover_image = EXCLUDED.cover_image, description = EXCLUDED.description, dimensions_info = EXCLUDED.dimensions_info,
            status = EXCLUDED.status, verification_status = EXCLUDED.verification_status, access_type = EXCLUDED.access_type,
            last_verified_at = EXCLUDED.last_verified_at, updated_at = NOW()
        RETURNING id
      `, [
        m.name, m.slug, m.original_name, m.english_name, m.aliases,
        categoryId, m.subcategory_name, manufacturerId, m.product_code,
        m.material_type, m.cover_image, m.description, m.dimensions_info,
        m.status, m.verification_status, m.access_type, m.last_verified_at
      ]);

      const materialId = matRes.rows[0].id;

      // Seed Sources
      const sourceMap = {};
      if (Array.isArray(m.sources)) {
        for (const s of m.sources) {
          const sRes = await pool.query(`
            INSERT INTO material_sources (material_id, source_type, title, url, publisher, document_name, document_version, published_date, status, is_primary)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id
          `, [materialId, s.source_type, s.title, s.url, s.publisher, s.document_name, s.document_version, s.published_date, s.status, s.is_primary]);
          sourceMap[s.source_type] = sRes.rows[0].id;
        }
      }

      const primarySourceId = sourceMap['technical_datasheet'] || Object.values(sourceMap)[0] || null;

      // Seed Specifications
      if (Array.isArray(m.specifications)) {
        await pool.query('DELETE FROM material_specifications WHERE material_id = $1', [materialId]);
        let sIdx = 1;
        for (const spec of m.specifications) {
          await pool.query(`
            INSERT INTO material_specifications (material_id, parameter, parameter_label, value, unit, source_id, source_document_page, confidence, order_index)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `, [materialId, spec.parameter, spec.parameter_label, spec.value, spec.unit, primarySourceId, spec.document_page || null, spec.confidence || 1.0, sIdx++]);
        }
      }

      // Seed Documents
      if (Array.isArray(m.documents)) {
        await pool.query('DELETE FROM material_documents WHERE material_id = $1', [materialId]);
        let dIdx = 1;
        for (const doc of m.documents) {
          await pool.query(`
            INSERT INTO material_documents (material_id, title, document_type, url, version, language, published_date, order_index)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [materialId, doc.title, doc.document_type, doc.url, doc.version, doc.language, doc.published_date, dIdx++]);
        }
      }

      // Seed Applications
      if (Array.isArray(m.applications)) {
        await pool.query('DELETE FROM material_applications WHERE material_id = $1', [materialId]);
        for (const app of m.applications) {
          await pool.query(`
            INSERT INTO material_applications (material_id, application_type, title, description, source_id)
            VALUES ($1, $2, $3, $4, $5)
          `, [materialId, app.application_type, app.title, app.description, primarySourceId]);
        }
      }

      // Seed Requirements
      if (Array.isArray(m.requirements)) {
        await pool.query('DELETE FROM material_requirements WHERE material_id = $1', [materialId]);
        let rIdx = 1;
        for (const req of m.requirements) {
          await pool.query(`
            INSERT INTO material_requirements (material_id, requirement_type, title, description, step_number, source_id, order_index)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [materialId, req.requirement_type, req.title, req.description, req.step_number || null, primarySourceId, rIdx++]);
        }
      }
    }

    console.log('✅ MATERIALLAR KUTUBXONASI: 10 ta jadval, 19 ta kategoriya, 7 ta ishlab chiqaruvchi va batafsil materiallar bazasi muvaffaqiyatli sinxronlashtirildi.');
  } catch (err) {
    console.error('❌ MATERIALS INIT ERROR:', err);
  }
}

module.exports = {
  SEED_CATEGORIES,
  SEED_MANUFACTURERS,
  SEED_MATERIALS,
  initMaterialsTables
};
