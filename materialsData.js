// ======================================================
// YOSHUZBEKK Academy — Materials Knowledge Base
// Professional Qurilish va Interyer Materiallari Bazasi
// ======================================================

// 24 ta To'liq Qurilish va Interyer Kategoriyalari
const SEED_CATEGORIES = [
  {
    name: "Devor va konstruksiya materiallari",
    slug: "devor-konstruksiya",
    icon: "🧱",
    scope: "architecture",
    description: "Keramzit blok, gazobeton, penoblok, shlakoblok, g'isht, silikat, beton va monolit konstruksiyalar",
    sort_order: 1
  },
  {
    name: "Tabiiy va sun'iy toshlar",
    slug: "tosh-materiallari",
    icon: "🪨",
    scope: "both",
    description: "Marmar, granit, travertin, ohaktosh, oniks, bazalt, slanets, kvartsit, kvarts aglomerat va sun'iy tosh",
    sort_order: 2
  },
  {
    name: "Devor tekislash va quruq qorishmalar",
    slug: "tekislash-qorishmalar",
    icon: "🧴",
    scope: "both",
    description: "Gipsli va sementli suvoq, start/finish shpaklyovka, polimer aralashmalar, o'z-o'zidan tekislanuvchi quyma pol",
    sort_order: 3
  },
  {
    name: "Yog‘och va yog‘och plitalar",
    slug: "yogoch-plitalar",
    icon: "🪵",
    scope: "interior",
    description: "Massiv yog'och, fanera, MDF, HDF, DSP, LDSP, OSB, shpon, bambuk, reykalar va mebel taxtalari",
    sort_order: 4
  },
  {
    name: "Gipsokarton va quruq qurilish tizimlari",
    slug: "gipsokarton-quruq",
    icon: "🧩",
    scope: "interior",
    description: "GKL, GKLV, GKLO, akustik gipsokarton, gipsovolokno, UD/CD/CW/UW karkas profillari va lentalar",
    sort_order: 5
  },
  {
    name: "Pol qoplamalari",
    slug: "pol-materiallari",
    icon: "🪜",
    scope: "interior",
    description: "Keramik plitka, keramogranit, laminat, parket, muhandislik taxtasi, SPC, LVT, linoleum, kovrolin, epoksi pol, mikrobeton",
    sort_order: 6
  },
  {
    name: "Devor va fasad qoplamalari",
    slug: "devor-fasad-qoplamalari",
    icon: "🏢",
    scope: "both",
    description: "Klinker plitka, dekorativ suvoq, mikrobeton, dekorativ g'isht, HPL, PVC, 3D panellar, kompozit panellar",
    sort_order: 7
  },
  {
    name: "Bo‘yoq va dekorativ qoplamalar",
    slug: "boyoq-dekor",
    icon: "🎨",
    scope: "both",
    description: "Akril, lateks, suv-emulsion, silikon, silikat, fasad, metall va yog'och bo'yoqlari, emal, venetsian suvoq, mikrocement",
    sort_order: 8
  },
  {
    name: "Oyna va shisha materiallari",
    slug: "oyna-shisha",
    icon: "🪟",
    scope: "both",
    description: "Oddiy float, temperlangan (zakalyonniy), triplex, low-E energiya tejovchi, reflektiv, mat, smart glass, shishapaketlar",
    sort_order: 9
  },
  {
    name: "Metall materiallar",
    slug: "metall-materiallar",
    icon: "🔩",
    scope: "architecture",
    description: "Konstruktiv po‘lat, zanglamaydigan po‘lat, alyuminiy, mis, armatura, shveller, burchaklik, kvadrat profil, truba, setka",
    sort_order: 10
  },
  {
    name: "Tom materiallari",
    slug: "tom-materiallari",
    icon: "🏠",
    scope: "architecture",
    description: "Metallocherepitsa, profnastil, bitumli shifer, ondulin, keramik cherepitsa, PVC/TPO membrana, ruberoid",
    sort_order: 11
  },
  {
    name: "Gidroizolyatsiya",
    slug: "gidroizolyatsiya",
    icon: "💧",
    scope: "both",
    description: "Bitumli va polimer mastika, rulonli gidroizolyatsiya, suyuq rezina, penetratsion kristalli qorishma, gidroizolyatsion lenta",
    sort_order: 12
  },
  {
    name: "Issiqlik izolyatsiyasi",
    slug: "issiqlik-izolyatsiyasi",
    icon: "🌡",
    scope: "both",
    description: "Bazalt tosh paxtasi, mineral paxta, shisha paxta, penoplast (EPS), ekstrudirlangan penopolistirol (XPS), PIR, PUR",
    sort_order: 13
  },
  {
    name: "Akustik materiallar",
    slug: "akustik-materiallar",
    icon: "🔇",
    scope: "interior",
    description: "Akustik mineral paxta, PET akustik panel, perforatsiyalangan MDF, akustik gipsokarton, ovoz yutuvchi ko‘pik",
    sort_order: 14
  },
  {
    name: "Eshik va deraza materiallari",
    slug: "eshik-deraza",
    icon: "🚪",
    scope: "both",
    description: "PVC profil, termoalyuminiy profil, yog'och profil, MDF, shponlangan, massiv, shisha va metall eshiklar, sirpanma tizimlar",
    sort_order: 15
  },
  {
    name: "Yelim, germetik va montaj materiallari",
    slug: "yelim-germetik",
    icon: "🧰",
    scope: "both",
    description: "Kuchaytirilgan plitka yelimi, montaj ko‘pigi, silikon, akril, poliuretan germetik, epoksi yelim, suyuq mix, gruntovka",
    sort_order: 16
  },
  {
    name: "Elektr va yoritish materiallari",
    slug: "elektr-yoritish",
    icon: "💡",
    scope: "interior",
    description: "Mis quvvat kabeli (VVGng), kabel-kanal, gofra, podrozetnik, elektr shchit, LED lenta, alyuminiy LED profil, magnet trek tizimi",
    sort_order: 17
  },
  {
    name: "Santexnika va sanuzel materiallari",
    slug: "santexnika-sanuzel",
    icon: "🚿",
    scope: "both",
    description: "PPR quvur, PVC kanalizatsiya, PEX iliq pol trubasi, sanitariya keramikasi (farfor/fayans), akril, quyma marmar vanna",
    sort_order: 18
  },
  {
    name: "Oshxona va interyer mebellari",
    slug: "oshxona-mebel",
    icon: "🍽",
    scope: "interior",
    description: "LDSP, MDF, HPL kompakt plita, akril fasad, PET panel, tabiiy shpon, sun'iy kvarts stolusti, akril tosh, sintered stone",
    sort_order: 19
  },
  {
    name: "Fasad materiallari",
    slug: "fasad-materiallari",
    icon: "🏗",
    scope: "architecture",
    description: "Ventilyatsiyalanuvchi fasad, alyumokompozit, fasad HPL, fibrosement plita, terrakota, fasad klinkeri, tabiiy travertin",
    sort_order: 20
  },
  {
    name: "Landshaft va tashqi obodonlashtirish",
    slug: "landshaft-tashqi",
    icon: "🌿",
    scope: "architecture",
    description: "Trotuar plitkasi, vibropresslangan bruschatka, granit bordyur, drenaj toshi, WPC deking taxtasi, sun'iy maysazor",
    sort_order: 21
  },
  {
    name: "Yong‘in xavfsizligi materiallari",
    slug: "yongin-xavfsizligi",
    icon: "🔥",
    scope: "both",
    description: "Olovbardosh GKLO, yong'inga qarshi intumescent bo‘yoq, bazalt yong'in to'siqlari, yong'inga chidamli germetik va fire-stop",
    sort_order: 22
  },
  {
    name: "Dekorativ interyer materiallari",
    slug: "dekorativ-materiallar",
    icon: "🖼",
    scope: "interior",
    description: "Gips va poliuretan molding, shift bagetlari, 3D gips panellar, reykali yog'och panellar, metall va oyna dekorlari",
    sort_order: 23
  },
  {
    name: "Maxsus arxitektura materiallari",
    slug: "maxsus-arxitektura",
    icon: "🏭",
    scope: "both",
    description: "Grilyato kassetali shift, Armstrong mineral shift, cho'ziluvchan shift (stretch ceiling), Dekton, Neolith, Corian, UHPC, GRC",
    sort_order: 24
  }
];

const SEED_MANUFACTURERS = [
  {
    name: "Knauf",
    slug: "knauf",
    logo: "https://lh3.googleusercontent.com/d/1_knauf_logo",
    website: "https://www.knauf.uz",
    country: "Germaniya / O'zbekiston",
    description: "Gips va sement asosidagi quruq qorishmalar, gipsokarton, akvapanel va metall profil tizimlarida jahon yetakchisi"
  },
  {
    name: "EGGER",
    slug: "egger",
    logo: "https://lh3.googleusercontent.com/d/1_egger_logo",
    website: "https://www.egger.com",
    country: "Avstriya / Germaniya",
    description: "Mebel va interyer dizayni uchun yuqori zichlikdagi LDSP, MDF, Evogloss va mukammal pol qoplamalari"
  },
  {
    name: "Technonicol",
    slug: "technonicol",
    logo: "https://lh3.googleusercontent.com/d/1_technonicol_logo",
    website: "https://www.tn.ru",
    country: "Rossiya / Xalqaro",
    description: "Tom yopish, gidroizolyatsiya, XPS va tosh paxta mineral izolyatsiyasi bo'yicha global yetkazib beruvchi"
  },
  {
    name: "Italon",
    slug: "italon",
    logo: "https://lh3.googleusercontent.com/d/1_italon_logo",
    website: "https://www.italonceramica.ru",
    country: "Italiya (Gruppo Concorde)",
    description: "Italiya texnologiyasi asosida professional arxitekturaviy keramogranit va fasad plitalari"
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
    name: "Ekopen",
    slug: "ekopen",
    logo: "https://lh3.googleusercontent.com/d/1_ekopen_logo",
    website: "https://ekopen.uz",
    country: "O'zbekiston",
    description: "Zamonaviy PVX va alyuminiy oyna-eshik profillari hamda polimer quvurlar tizimlari"
  },
  {
    name: "Tikkurila",
    slug: "tikkurila",
    logo: "https://lh3.googleusercontent.com/d/1_tikkurila_logo",
    website: "https://tikkurila.uz",
    country: "Finlyandiya",
    description: "Premium toifadagi ekologik xavfsiz ichki va fasad bo'yoqlari hamda dekorativ suvoqlar"
  },
  {
    name: "Caesarstone",
    slug: "caesarstone",
    logo: "https://lh3.googleusercontent.com/d/1_caesarstone_logo",
    website: "https://www.caesarstone.com",
    country: "Isroil / AQSH",
    description: "Oshxona stoleshnitsalari va interyer uchun yuqori texnologiyali tabiiy kvarts aglomerat toshlari"
  },
  {
    name: "Armstrong Ceiling",
    slug: "armstrong",
    logo: "https://lh3.googleusercontent.com/d/1_armstrong_logo",
    website: "https://www.knaufceiling.com",
    country: "AQSH / Germaniya",
    description: "Akustik va kassetali osma shift tizimlari bo'yicha dunyodagi eng mashhur brend"
  }
];

// O'quvchi, arxitektor va interyer dizaynerlari uchun mukammal materiallar bazasi
const SEED_MATERIALS = [
  // 1. LDSP (EGGER 18mm) — INTERYER / MEBEL
  {
    name: "EGGER LDSP 18mm (Laminatsiyalangan DSP)",
    slug: "egger-ldsp-18mm",
    category_slug: "oshxona-mebel",
    scope: "interior",
    original_name: "EGGER Eurodekor Melamine Faced Chipboard MFC",
    english_name: "EGGER Melamine Faced Chipboard 18mm",
    aliases: ["LDSP", "ЛДСП", "DSP", "Egger", "Mebel plitasi", "Melamin"],
    subcategory_name: "Mebel karkas va fasad plitalari",
    manufacturer_slug: "egger",
    product_code: "EGG-MFC-18-H3303",
    material_type: "Laminatsiyalangan yog'och-qirindi plita",
    cover_image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&auto=format&fit=crop&q=80",
    description: "Mebel sanoati, shkaflar, oshxona karkaslari va interyer dekoratsiyasi uchun mo'ljallangan nozik qirindili yuqori zichlikdagi laminatsiyalangan plita.",
    dimensions_info: "2800 x 2070 x 18 mm. Har bir list maydoni: 5.796 m².",
    standard_sizes: ["2800 x 2070 mm", "2750 x 1830 mm"],
    thicknesses: "10 mm, 16 mm, 18 mm, 22 mm, 25 mm",
    composition: "90% tabiiy ignabargli yog'och qirindilari, termoset sintetik qatronlar, termik bosimda qoplangan melamin himoya plyonkasi.",
    usage_area: "Oshxona va yotoqxona mebellari karkasi, kiyinish xonalari (garderob), kitob javonlari, ofis mebellari, ichki qoplamalar.",
    pros: "Yuqori sirt mustahkamligi, chizilish va maishiy kimyoga chidamlilik, boy tabiiy yog'och fakturalari (Feelwood), E1 ekologik tozalik klassi, oson kesilish.",
    cons: "Qirralari kantlanmasa namlikdan tez shishadi, bevosita olov yoki dush zonasida ishlatib bo'lmaydi, o'z-o'zidan yuk ko'taruvchi konstruksiya bo'lolmaydi.",
    approx_price: "420,000 – 620,000 so‘m / list (dekori va tuzilishiga qarab)",
    uzb_market_availability: "Keng tarqalgan, Toshkent va viloyat omborlarida doimiy mavjud",
    standards_info: "EN 14322, GOST 32289-2013, Formaldegid emissiyasi: E1 (<= 0.05 ppm)",
    lifespan: "15 – 25 yil (normal nisbiy namlik 40-65% bo'lganda)",
    moisture_resistance: "O'rtacha namlik (qirralari to'liq ABS lenta bilan germetik yopilishi shart)",
    fire_rating: "G4 (Yonuvchan material, ochiq olovdan kamida 50 sm masofa talab qilinadi)",
    status: "published",
    verification_status: "verified",
    access_type: "free",
    architect_notes: "📐 Revit/BIM modellashda panel qalinligini aniq 18 mm deb oling. Oshxona stoleshnitsasi uchun LDSP tavsiya etilmaydi (namlikdan shishadi), uning o'rniga 38 mm HPL yoki kvarts aglomerat tanlang. Barcha ochiq qirralar uchun kamida 1.0-2.0 mm ABS kant talab qiling.",
    specifications: [
      { parameter: "density", parameter_label: "Zichligi", value: "660 - 680", unit: "kg/m³", document_page: "Sahifa 4", confidence: 1.0 },
      { parameter: "thickness", parameter_label: "Nominal qalinlik", value: "18.0", unit: "mm", document_page: "Sahifa 2", confidence: 1.0 },
      { parameter: "bending_strength", parameter_label: "Egilishdagi mustahkamlik", value: ">= 11.0", unit: "MPa", document_page: "Sahifa 6", confidence: 0.98 },
      { parameter: "surface_soundness", parameter_label: "Sirt qoplamasi yopishqoqligi", value: ">= 0.8", unit: "N/mm²", document_page: "Sahifa 7", confidence: 0.99 },
      { parameter: "formaldehyde_emission", parameter_label: "Formaldegid emissiya klassi", value: "E1 (0.05)", unit: "ppm", document_page: "Sahifa 3", confidence: 1.0 }
    ],
    sources: [
      { source_type: "technical_datasheet", title: "EGGER Eurodekor Technical Data Sheet 2024", url: "https://www.egger.com/technical-datasheet-mfc.pdf", publisher: "Fritz EGGER GmbH & Co.", is_primary: true }
    ],
    documents: [
      { title: "EGGER Eurodekor Texnik Pasporti va Sertifikati", document_type: "datasheet", url: "https://www.egger.com/technical-datasheet-mfc.pdf", language: "ru" }
    ]
  },

  // 2. MDF (EGGER / Kronospan 16mm/18mm) — INTERYER / FASAD
  {
    name: "MDF Plitasi 16mm/18mm (Medium Density Fibreboard)",
    slug: "mdf-plita-16-18mm",
    category_slug: "yogoch-plitalar",
    scope: "interior",
    original_name: "Medium Density Fibreboard MDF E1",
    english_name: "MDF Board 16mm/18mm",
    aliases: ["MDF", "МДФ", "Frezerovka MDF", "Kraska MDF", "Fasad plita"],
    subcategory_name: "Frezalanuvchi va bo'yaluvchi zich plitalar",
    manufacturer_slug: "egger",
    product_code: "MDF-STD-18",
    material_type: "O'rta zichlikdagi mayda yog'och tolali plita",
    cover_image: "https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=600&auto=format&fit=crop&q=80",
    description: "Chuqur relyefli 3D frezerovka, emal bo'yoq bilan bo'yash, shponlash va membranali plyonka bosish uchun ideal silliq strukturaga ega plita.",
    dimensions_info: "2800 x 2070 mm va 2440 x 1220 mm. Qalinligi: 16 va 18 mm.",
    standard_sizes: ["2800 x 2070 mm", "2440 x 1220 mm"],
    thicknesses: "6 mm, 8 mm, 10 mm, 12 mm, 16 mm, 18 mm, 22 mm, 25 mm, 30 mm",
    composition: "Yupqa bug'langan yog'och tolalari, sintetik karbamid bog'lovchilar, parafin gidrofobizatori.",
    usage_area: "Klassik va zamonaviy oshxona fasadlari, dekorativ devor panellari, xonalararo eshik karkaslari, yashirin eshiklar, karnizlar.",
    pros: "Bir jinsli zich struktura (bo'shliqlar yo'q), har qanday murakkablikdagi CNC frezerovkaga mos, yuzasi shishadek silliq bo'yaladi, DSP dan 2 barobar mustahkam.",
    cons: "DSP ga nisbatan og'irroq, maxsus gruntovkasiz bo'yoqni ko'p shimib oladi, namlikka uzoq vaqt ta'sir etsa qalinlashadi (shishadi).",
    approx_price: "480,000 – 750,000 so‘m / list",
    uzb_market_availability: "Doimiy mavjud (Yashnobod, Chilonzor, Bekto'pi mebel bozorlarida)",
    standards_info: "EN 622-5, GOST 32274-2013",
    lifespan: "20 – 30 yil",
    moisture_resistance: "Emal yoki PVX plyonka bilan qoplanganda namlikka juda chidamli",
    fire_rating: "G3 / G4 (Oddiy MDF yonuvchan; maxsus qizil olovbardosh turlari mavjud)",
    status: "published",
    verification_status: "verified",
    access_type: "free",
    architect_notes: "📐 Agar loyihada devor panellari yoki shponlangan reykalar rejalashtirilsa, MDF eng to'g'ri tanlov. Frezerovka qilinganda qirralari uvalanib ketmaydi. Nam zonalarda (vanna mebellarida) faqat yashil rangli namga chidamli (MDF Hydro) turini ko'rsating.",
    specifications: [
      { parameter: "density", parameter_label: "Zichligi", value: "720 - 780", unit: "kg/m³", document_page: "Sahifa 3", confidence: 1.0 },
      { parameter: "swelling_24h", parameter_label: "24 soatda suvda shishishi", value: "<= 12", unit: "%", document_page: "Sahifa 5", confidence: 0.97 },
      { parameter: "internal_bond", parameter_label: "Tolalararo ichki mustahkamlik", value: ">= 0.60", unit: "N/mm²", document_page: "Sahifa 4", confidence: 0.98 }
    ],
    sources: [
      { source_type: "technical_datasheet", title: "EGGER MDF Technical Datasheet", url: "https://www.egger.com/mdf-datasheet.pdf", publisher: "EGGER Group", is_primary: true }
    ],
    documents: [
      { title: "MDF Standart Texnik Ko'rsatkichlari", document_type: "datasheet", url: "https://www.egger.com/mdf-datasheet.pdf", language: "ru" }
    ]
  },

  // 3. KNAUF GKLV 12.5mm — INTERYER / QURUQ QURILISH
  {
    name: "Knauf GKLV Namlikka Chidamli Gipsokarton 12.5mm",
    slug: "knauf-gklv-12-5mm",
    category_slug: "gipsokarton-quruq",
    scope: "interior",
    original_name: "КНАУФ-лист влагостойкий (ГСП-Н2)",
    english_name: "Knauf Moisture Resistant Gypsum Board 12.5mm",
    aliases: ["GKLV", "ГКЛВ", "Yashil gipsokarton", "Vlagostoykiy gipsokarton", "Knauf"],
    subcategory_name: "Nam xonalar uchun quruq pardozlash plitalari",
    manufacturer_slug: "knauf",
    product_code: "KNF-GKLV-2500-1200-12.5",
    material_type: "Gips-kartonli namga chidamli qurilish plitasi",
    cover_image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80",
    description: "Oshxona, hammom, sanuzel va deraza otkoslari kabi namlik darajasi yuqori bo'lgan xonalarda orato'siq devor va osma shiftlar yasash uchun mo'ljallangan yashil gipsokarton.",
    dimensions_info: "2500 x 1200 x 12.5 mm. 1 ta list maydoni: 3.00 m².",
    standard_sizes: ["2500 x 1200 mm", "3000 x 1200 mm"],
    thicknesses: "9.5 mm (shift uchun), 12.5 mm (devor va orato'siqlar uchun)",
    composition: "Gips o'zagi (G-4), silikonli gidrofob qo'shimchalar, antifungal (zamburug'ga qarshi) moddalar, maxsus yashil mustahkam karton qoplama.",
    usage_area: "Hammom va dushxona devorlari, oshxona fartugi asosi, orato'siq devorlar, fasad oldi sovuq zonalar, deraza yonbag'irlari (otkos).",
    pros: "Suv shimishi 10% dan kam, plitka yopishtirish uchun mukammal tekis baza, montaj tezligi yuqori, ekologik sof (PH inson terisiga teng), tovush izolyatsiyasi yaxshi.",
    cons: "To'g'ridan-to'g'ri dush oqimi tushadigan joylarda gidroizolyatsiya (Knauf Flahendicht) surtish shart, og'ir mebel osish uchun maxsus metall anker (Molly) talab qiladi.",
    approx_price: "48,000 – 62,000 so‘m / list",
    uzb_market_availability: "O'zbekiston bo'ylab barcha qurilish bozorlarida 100% mavjud (Buxoro Knauf zavodida ishlab chiqariladi)",
    standards_info: "GOST 32614-2012 (EN 520:2009), Turi H2",
    lifespan: "25 – 40 yil",
    moisture_resistance: "Yuqori namlik (nisbiy namlik 85% gacha bo'lgan xonalarga ruxsat berilgan)",
    fire_rating: "G1 (Kam yonuvchan, alangalanmaydi), V1, D1, T1",
    status: "published",
    verification_status: "verified",
    access_type: "free",
    architect_notes: "📐 Devorlarda plitka yopishtiriladigan bo'lsa, qat'iy ravishda 2 qavat GKLV (12.5 + 12.5 mm) o'rnating yoki karkas CD/CW profillari qadamini 600 mm dan 400 mm ga qisqartiring. Plitka yelimi og'irligidan 1 qavatli gipsokarton egilishi mumkin.",
    specifications: [
      { parameter: "density", parameter_label: "Zichligi", value: "~800", unit: "kg/m³", document_page: "Sahifa 2", confidence: 1.0 },
      { parameter: "water_absorption", parameter_label: "Suv yutishi", value: "<= 10", unit: "%", document_page: "Sahifa 3", confidence: 1.0 },
      { parameter: "breaking_load_transverse", parameter_label: "Ko'ndalang sindiruvchi yuk", value: ">= 210", unit: "N", document_page: "Sahifa 4", confidence: 0.98 }
    ],
    sources: [
      { source_type: "technical_datasheet", title: "Knauf GKLV Rasmiy Texnik Varaqasi 2024", url: "https://www.knauf.uz/products/drywall/knauf-gklv.html", publisher: "Knauf Gips Buxoro", is_primary: true }
    ],
    documents: [
      { title: "Knauf GKLV Muvofiqlik Sertifikati", document_type: "certificate", url: "https://www.knauf.uz/certificates/gklv.pdf", language: "uz" }
    ]
  },

  // 4. GAZOBETON BLOK D500 — ARXITEKTURA / DEVOR
  {
    name: "Gazobeton Blok D500 (Avtoklav blok)",
    slug: "gazobeton-blok-d500",
    category_slug: "devor-konstruksiya",
    scope: "architecture",
    original_name: "Блок газобетонный автоклавный D500 B2.5",
    english_name: "Autoclaved Aerated Concrete Block AAC D500",
    aliases: ["Gazoblok", "Газобетон", "Gazoblok D500", "Penoblok", "Arka"],
    subcategory_name: "Energiya tejovchi yuk ko'taruvchi va orato'siq bloklar",
    manufacturer_slug: "arka-gazobeton",
    product_code: "AAC-D500-600-300-200",
    material_type: "G'ovakli avtoklav beton bloki",
    cover_image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=600&auto=format&fit=crop&q=80",
    description: "Karkasli ko'p qavatli binolarning tashqi devorlari va xonadonlararo orato'siqlari uchun a'lo darajadagi issiqlik va tovush izolyatsiyasini ta'minlovchi engil qurilish bloki.",
    dimensions_info: "600 x 300 x 200 mm, 600 x 200 x 100 mm (orato'siq). 1 m³ da 27.7 dona.",
    standard_sizes: ["600 x 300 x 200 mm", "600 x 250 x 200 mm", "600 x 200 x 100 mm"],
    thicknesses: "100 mm (xonaaro), 150 mm, 200 mm, 300 mm (tashqi fasad), 400 mm",
    composition: "Portlandsifatli sement, kvars qumi, ohak, gips, suv va alyuminiy kukuni (gaz hosil qiluvchi). Avtoklavda 12 bar bug' bosimida pishiriladi.",
    usage_area: "Monolit karkasli uylarning tashqi fasad devorlari, kottejlar devorlari, xonadonlararo shovqinsiz orato'siqlar.",
    pros: "Issiqlik o'tkazuvchanligi juda past (g'ishtdan 3 barobar issiq), geometrik aniqlik (xatolik < 1mm), engil vazn (poydevorga yuk kam), yong'inga mutlaqo yonmaydi (KM0).",
    cons: "Gigroskopik (yomg'irdan himoyalovchi fasad suvoq talab qiladi), egilishga nisbatan mo'rt (har 3 qatorda armatura tortish shart), oddiy mix ushlamaydi (maxsus spiral dyubel kerak).",
    approx_price: "650,000 – 780,000 so‘m / 1 m³ (dona hisobida ~24,000 – 28,000 so‘m)",
    uzb_market_availability: "O'zbekistonda juda keng tarqalgan (Arka, DSK, Ekoton zavodlari)",
    standards_info: "GOST 31360-2007, QMQ 2.03.01-96, B2.5 klass",
    lifespan: "70 – 100 yil",
    moisture_resistance: "O'rtacha (tashqi tomondan gidrofob bug' o'tkazuvchi suvoq talab etiladi)",
    fire_rating: "KM0 (Mutlaqo yonmaydi - NG, olovga 4 soat bardosh beradi)",
    status: "published",
    verification_status: "verified",
    access_type: "free",
    architect_notes: "📐 Loyihada gazobeton terishda oddiy sement-qum qorishmasidan emas, maxsus yupqa chokli gazoblok kleyidan (2-3 mm qalinlikda) foydalanishni talab qiling. Sement qorishmasi bilan terilsa 'sovuqlik ko'prigi' hosil bo'lib, uyning issiqligi 25% ga yo'qoladi. Deraza va eshik osti qatorlari d=8mm armatura bilan armaturalanishi shart.",
    specifications: [
      { parameter: "density", parameter_label: "Quruq holatdagi zichlik", value: "500", unit: "kg/m³", document_page: "1-jadval", confidence: 1.0 },
      { parameter: "compressive_strength", parameter_label: "Siqilishdagi mustahkamlik klassi", value: "B2.5 (3.5 MPa)", unit: "MPa", document_page: "2-jadval", confidence: 1.0 },
      { parameter: "thermal_conductivity", parameter_label: "Issiqlik o'tkazuvchanlik", value: "0.12", unit: "Vt/(m·°C)", document_page: "4-jadval", confidence: 0.99 },
      { parameter: "frost_resistance", parameter_label: "Sovuqqa chidamliligi", value: "F50", unit: "tsikl", document_page: "3-jadval", confidence: 0.95 }
    ],
    sources: [
      { source_type: "normative_document", title: "GOST 31360-2007 Avtoklav g'ovakli beton bloklari", url: "https://docs.cntd.ru/document/1200062497", publisher: "Davlat Standarti", is_primary: true }
    ],
    documents: [
      { title: "Gazobeton Bloklari Loyihalash va Montaj Qoidasi", document_type: "manual", url: "https://arkagazobeton.uz/manual.pdf", language: "uz" }
    ]
  },

  // 5. KERAMOGRANIT 600x1200mm — ARXITEKTURA & INTERYER (BOTH)
  {
    name: "Keramogranit 600x1200mm Katta Formatli Plita",
    slug: "keramogranit-600x1200",
    category_slug: "pol-materiallari",
    scope: "both",
    original_name: "Gres Porcellanato 600x1200 Rectified",
    english_name: "Porcelain Stoneware Tile 600x1200mm",
    aliases: ["Keramogranit", "Kafel", "Plitka", "Granit plitka", "Italon", "Marmar plita"],
    subcategory_name: "Rektifikatsiyalangan qattiq chinni plitalar",
    manufacturer_slug: "italon",
    product_code: "ITA-CHARME-60120",
    material_type: "Gress chinni tosh plitasi",
    cover_image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80",
    description: "Marmar va tabiiy tosh teksturali, suvni umuman shimib olmaydigan, pol va devorlar hamda ventilyatsiyalanuvchi fasadlar uchun rektifikatsiyalangan katta formatli plita.",
    dimensions_info: "1200 x 600 x 9 mm. 1 ta qutida: 2 dona (1.44 m²).",
    standard_sizes: ["600 x 600 mm", "600 x 1200 mm", "800 x 1600 mm", "1200 x 2780 mm"],
    thicknesses: "6 mm (yupqa devor/fasad), 9 mm (standart pol/devor), 20 mm (tashqi landshaft)",
    composition: "Oq kaolin gili, kvars qumi, dala shpati va tabiiy mineral pigmentlar. 1250°C haroratda 500 bar bosimda pishiriladi.",
    usage_area: "Mehmonxona, zal va koridor pol qoplamalari, sanuzellar va dush zonalari, oshxona pol va devorlari, ventfasadlar, zinapoyalar.",
    pros: "Suv shimilishi amalda nol (< 0.05%), muzlashga mutlaqo bardoshli, tirnalmaydi (Mox shkalasi 7-8), kimyoviy dog' qoldirmaydi, rektifikatsiyalangan (choksiz 1.5mm terish imkoniyati).",
    cons: "Og'ir va qattiq (kesish uchun professional suvli plitkarez kerak), maxsus yuqori elastiklikdagi C2TE S1 yelim talab qiladi, o'z holicha sovuq yuzaga ega (iliq pol tavsiya etiladi).",
    approx_price: "160,000 – 380,000 so‘m / 1 m² (brendi va qoplamasiga qarab)",
    uzb_market_availability: "Keng tanlovda mavjud (Kafel bozorlari, Jomiy, Usta Shirin, O'rikzor)",
    standards_info: "ISO 13006 (G Guruhi, Bla toifasi), GOST 13996-2019",
    lifespan: "50+ yil",
    moisture_resistance: "100% suv o'tkazmaydi (Suv yutishi < 0.05%)",
    fire_rating: "KM0 (Mutlaqo yonmaydi)",
    status: "published",
    verification_status: "verified",
    access_type: "free",
    architect_notes: "📐 600x1200 formatli keramogranitni terishda faqat SVP (plitalarni tekislovchi qisqichlar) ishlatilishini shart qilib belgilang. Yelim qatlamini faqat taroq (10 mm) bilan ikki tomonlama (plitka orqasiga ham) surting. Issiq pol bor joyda chok kengligi kamida 1.5 - 2.0 mm bo'lishi kerak.",
    specifications: [
      { parameter: "water_absorption", parameter_label: "Suv yutishi", value: "<= 0.05", unit: "%", document_page: "Sahifa 2", confidence: 1.0 },
      { parameter: "scratch_hardness", parameter_label: "Qattiqligi (Mohs)", value: "7 - 8", unit: "Mohs", document_page: "Sahifa 3", confidence: 0.98 },
      { parameter: "breaking_strength", parameter_label: "Buzuvchi kuch", value: ">= 2000", unit: "N", document_page: "Sahifa 4", confidence: 0.99 },
      { parameter: "slip_resistance", parameter_label: "Sirpanish qarshiligi", value: "R10 (Matoviy)", unit: "R", document_page: "Sahifa 5", confidence: 0.95 }
    ],
    sources: [
      { source_type: "technical_datasheet", title: "Italon Charme Deluxe Texnik Hujjati", url: "https://www.italonceramica.ru/tech-data.pdf", publisher: "Italon SpA", is_primary: true }
    ],
    documents: [
      { title: "Keramogranit Plitkalari Sertifikati", document_type: "certificate", url: "https://www.italonceramica.ru/cert.pdf", language: "ru" }
    ]
  },

  // 6. SPC LAMINAT 4mm — INTERYER / POL
  {
    name: "SPC Vinil Laminat 4mm + IXPE Podlozhka (Stone Plastic Composite)",
    slug: "spc-laminat-4mm",
    category_slug: "pol-materiallari",
    scope: "interior",
    original_name: "Stone Plastic Composite Rigid Core Flooring 4mm",
    english_name: "SPC Vinyl Flooring 4mm with IXPE Underlayment",
    aliases: ["SPC", "Kvars vinil", "Laminat", "Suvga chidamli laminat", "Vinil pol"],
    subcategory_name: "100% Suvga chidamli zamonaviy qulflangan pollar",
    manufacturer_slug: "egger",
    product_code: "SPC-OAK-40-IXPE",
    material_type: "Tosh-polimer kompozit pol qoplamasi",
    cover_image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600&auto=format&fit=crop&q=80",
    description: "70% maydalangan tabiiy marmar va 30% polimerdan tarkib topgan, suvdan zarracha qo'rqmaydigan, iliq pol bilan 100% mos 43-klassli mustahkam pol qoplamasi.",
    dimensions_info: "1220 x 180 x 4.0 mm (+1.0 mm orqasiga yopishtirilgan IXPE akustik taglik).",
    standard_sizes: ["1220 x 180 mm", "1520 x 228 mm"],
    thicknesses: "3.5 mm, 4.0 mm, 4.5 mm, 5.0 mm (+1mm podlozhka)",
    composition: "70% mikrokalsit (tosh uni), 30% birlamchi PVX, dekorativ HD tekstura plyonkasi, 0.5 mm polimer himoya qatlami, UV himoya laki.",
    usage_area: "Kvartira va uylarning barcha xonalari: mehmonxona, yotoqxona, oshxona, koridor, hatto sanuzel va balkon pollarida.",
    pros: "100% suvga chidamli (suv toshsa ham shishmaydi), oddiy laminatdan 3 barobar zich (2000 kg/m³), geometrik kengayishi minimal, tirnalish va uy hayvonlari tirnog'iga chidamli, qulflari (Click) qulay.",
    cons: "Asosiy beton pol o'ta tekis bo'lishini talab qiladi (2 metrda farq 2 mm dan oshmasligi kerak), quyoshning haddan tashqari to'g'ridan-to'g'ri issig'ida (+60°C) qizib ketishi mumkin.",
    approx_price: "135,000 – 210,000 so‘m / 1 m²",
    uzb_market_availability: "Keng tarqalgan, eng ommabop zamonaviy pol qoplamalaridan biri",
    standards_info: "EN 16511, 43-ekspluatatsiya klassi (tijorat va turar-joy)",
    lifespan: "25 – 35 yil",
    moisture_resistance: "100% mutlaq suvga chidamli",
    fire_rating: "KM2 (B1-S1, olovni tarqatmaydi)",
    status: "published",
    verification_status: "verified",
    access_type: "free",
    architect_notes: "📐 SPC laminatni butun xonadon bo'ylab xonalararo ostonasiz (porogisiz) 100-120 m² gacha uzluksiz yotqizish mumkin. Ammo devor perimetri bo'ylab kamida 8-10 mm kompensatsion tirqish (dilyatatsiya choki) qoldirish shart, aks holda yozda pol ko'tarilib qoladi. Asos ostiga qo'shimcha yumshoq podlozhka solish qat'iyan man etiladi!",
    specifications: [
      { parameter: "density", parameter_label: "Zichligi", value: "1950 - 2050", unit: "kg/m³", document_page: "Sahifa 2", confidence: 1.0 },
      { parameter: "wear_layer", parameter_label: "Himoya qatlami qalinligi", value: "0.50", unit: "mm", document_page: "Sahifa 2", confidence: 1.0 },
      { parameter: "thermal_resistance", parameter_label: "Issiqlik qarshiligi", value: "0.039", unit: "m²·K/W", document_page: "Sahifa 3", confidence: 0.96 }
    ],
    sources: [
      { source_type: "technical_datasheet", title: "SPC Flooring Specification Sheet", url: "https://spc-flooring.com/specs.pdf", publisher: "International Vinyl Institute", is_primary: true }
    ],
    documents: [
      { title: "SPC Qoplama Yotqizish Qoidalari", document_type: "manual", url: "https://spc-flooring.com/manual.pdf", language: "ru" }
    ]
  },

  // 7. TABIIY TRAVERTIN 1-SORT — ARXITEKTURA & FASAD
  {
    name: "Tabiiy Travertin Tosh 1-sort (Navoiy / Eron)",
    slug: "tabiiy-travertin-1-sort",
    category_slug: "tosh-materiallari",
    scope: "both",
    original_name: "Natural Travertine Stone Classic Light",
    english_name: "Natural Classic Travertine Stone Slabs",
    aliases: ["Travertin", "Травертин", "Fasad tosh", "Navoiy travertin", "Rim toshi"],
    subcategory_name: "Tabiiy bezak va fasad toshlari",
    manufacturer_slug: "arka-gazobeton",
    product_code: "TRV-NAT-LIGHT-20",
    material_type: "Tabiiy karbonatli g'ovak tosh",
    cover_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
    description: "Issiq qaymoqrang va bej tusdagi, O'zbekiston iqlimiga to'liq mos keladigan, kottejlar va ko'p qavatli binolar fasadini hashamatli qoplash uchun tabiiy tog' toshi.",
    dimensions_info: "Plitalar: 600 x 300 x 20 mm, 800 x 400 x 20 mm yoki buyurtmaga sleyblar.",
    standard_sizes: ["600 x 300 mm", "800 x 400 mm", "Sleyblar 2400 x 1400 mm"],
    thicknesses: "15 mm, 20 mm (fasad uchun standart), 30 mm (zinapoyalar)",
    composition: "100% tabiiy mineral kalsiy karbonat (CaCO3), tabiiy mineral g'ovaklar.",
    usage_area: "Bino fasadlari (ho'l va ventfasad uslubida), ustunlar, karnizlar, interyer devor pannosi, kamin atroflari.",
    pros: "Tabiiy nafis ko'rinish, quyoshda rangini yo'qotmaydi, O'zbekistonning yozgi issig'i va qishki sovuqlariga chidamli, oson arralanadi va qayta ishlanadi.",
    cons: "G'ovakli tosh bo'lgani sababli chang va nam shimadi (montajdan keyin gidrofobizator bilan singdirish shart), og'ir material (konstruksiyaga qo'shimcha yuk).",
    approx_price: "180,000 – 350,000 so‘m / 1 m² (qalinligi va ishloviga qarab)",
    uzb_market_availability: "O'zbekistonda eng ommabop fasad toshi (Navoiy, Zarafshon konlari)",
    standards_info: "GOST 9479-2011, QMQ 2.01.03-96",
    lifespan: "70 – 100+ yil",
    moisture_resistance: "O'rtacha (yuzasiga gidrofob suyuqlik surtish majburiy)",
    fire_rating: "KM0 (Yong'inga mutlaqo yonmaydi)",
    status: "published",
    verification_status: "verified",
    access_type: "free",
    architect_notes: "📐 Fasadga travertin o'rnatilganda, agar bino balandligi 2 qavatdan oshsa, xavfsizlik nuqtai nazaridan toshni faqat yelimga yopishtirmasdan, orqasiga metall sim yoki zanglamas po'latdan anker (klammalar) bilan mexanik bog'lang. Fasad bitgach, 2 qatlam suv qochiruvchi silikon gidrofobizator purkash shart.",
    specifications: [
      { parameter: "density", parameter_label: "Zichligi", value: "2300 - 2450", unit: "kg/m³", document_page: "Sahifa 1", confidence: 1.0 },
      { parameter: "compressive_strength", parameter_label: "Siqilishdagi mustahkamlik", value: "45 - 65", unit: "MPa", document_page: "Sahifa 2", confidence: 0.95 },
      { parameter: "water_absorption", parameter_label: "Suv yutishi", value: "1.2 - 2.5", unit: "%", document_page: "Sahifa 2", confidence: 0.95 }
    ],
    sources: [
      { source_type: "normative_document", title: "GOST 9479-2011 Qoplama tosh bloklari", url: "https://docs.cntd.ru/document/1200093845", publisher: "Davlat Standarti", is_primary: true }
    ],
    documents: [
      { title: "Tabiiy Toshlarni Loyihalash Me'yorlari", document_type: "standard", url: "https://docs.cntd.ru/document/1200093845", language: "ru" }
    ]
  },

  // 8. TECHNONICOL XPS CARBON ECO 50mm — ARXITEKTURA / IZOLYATSIYA
  {
    name: "Technonicol XPS Carbon Eco 50mm (Ekstrudirlangan Penopolistirol)",
    slug: "technonicol-xps-carbon-eco-50mm",
    category_slug: "issiqlik-izolyatsiyasi",
    scope: "both",
    original_name: "ТЕХНОНИКОЛЬ XPS CARBON ECO 50мм",
    english_name: "Technonicol Extruded Polystyrene XPS 50mm",
    aliases: ["XPS", "Penopleks", "Ekstrudat", "Penopolistirol", "Teploizolyatsiya"],
    subcategory_name: "Poydevor, pol va yassi tomlar issiqlik izolyatsiyasi",
    manufacturer_slug: "technonicol",
    product_code: "TN-XPS-CARB-50",
    material_type: "Ekstrudirlangan polistirol ko'pigi",
    cover_image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    description: "Nanouglerod zarrachalari bilan mustahkamlangan, suvni deyarli mutlaqo shimib olmaydigan, poydevor, sokol va erga tegib turuvchi pollar uchun eng mustahkam issiqlik izolyatori.",
    dimensions_info: "1180 x 580 x 50 mm. Qirralari L-simon (sovuqlik ko'prigini yo'qotadi).",
    standard_sizes: ["1180 x 580 mm"],
    thicknesses: "20 mm, 30 mm, 50 mm (eng ko'p qo'llaniladi), 100 mm",
    composition: "Ekstrudirlangan polistirol granulalari, uglerod (karbon) nanozarrachalari, freonsiz xavfsiz gaz.",
    usage_area: "Poydevor devorlari izolyatsiyasi, sokol qismi, erga tushadigan birinchi qavat pol osti, yassi ekspluatatsiya qilinadigan tomlar, invert tomlar.",
    pros: "Suv shimishi 0.2% dan kam (nam tuproqda 50 yil chirimaydi), bosimga o'ta mustahkam (250 kPa - ustidan yuk mashinasi yursa ham ezilmaydi), issiqlik o'tkazuvchanligi juda past (0.029).",
    cons: "Quyoshning ultrabinafsha nurlari (UV) ostida ochiq qolsa yemiriladi (ustidan qoplanishi shart), organik erituvchilar (benzin, atseton) ta'sirida eriydi.",
    approx_price: "42,000 – 58,000 so‘m / dona (1 list maydoni: 0.684 m²)",
    uzb_market_availability: "O'zbekistonda barcha yirik qurilish bozorlarida doimiy mavjud",
    standards_info: "GOST 32310-2012 (EN 13164:2008), QMQ 2.01.04-97",
    lifespan: "50+ yil",
    moisture_resistance: "Mutlaq namlikka chidamli (0.2%)",
    fire_rating: "G4 / G3 (Yong'inga qarshi antipirenlar qo'shilgan turi mavjud)",
    status: "published",
    verification_status: "verified",
    access_type: "free",
    architect_notes: "📐 Er osti poydevori yoki erga yotqiziladigan pol izolyatsiyasida oddiy oq penoplast (EPS) yoki mineral paxta ishlatmang — ular tuproq namini shimib, 2 yilda izolyatsiya xususiyatini yo'qotadi. Faqat XPS Carbon Eco ko'rsatilishi shart. Plitalarni o'rnatishda bitum mastika erituvchisiz (suv asosli) bo'lishi kerak.",
    specifications: [
      { parameter: "thermal_conductivity", parameter_label: "Issiqlik o'tkazuvchanlik", value: "0.029", unit: "Vt/(m·°C)", document_page: "Sahifa 2", confidence: 1.0 },
      { parameter: "compressive_strength", parameter_label: "10% deformatsiyadagi mustahkamlik", value: ">= 250", unit: "kPa", document_page: "Sahifa 2", confidence: 1.0 },
      { parameter: "water_absorption_28d", parameter_label: "28 kunda to'liq suvga botganda shimilishi", value: "<= 0.4", unit: "hajmiy %", document_page: "Sahifa 3", confidence: 0.99 }
    ],
    sources: [
      { source_type: "technical_datasheet", title: "Technonicol XPS Texnik Pasporti", url: "https://www.tn.ru/catalog/xps/carbon-eco.pdf", publisher: "Technonicol", is_primary: true }
    ],
    documents: [
      { title: "Poydevor va Tom Izolyatsiyasi Qo'llanmasi", document_type: "manual", url: "https://www.tn.ru/manual-xps.pdf", language: "ru" }
    ]
  },

  // 9. METALLOCHEREPITSA MONTERREY 0.45mm — ARXITEKTURA / TOM
  {
    name: "Metallocherepitsa Monterrey 0.45mm (Sinklangan polimer)",
    slug: "metallocherepitsa-monterrey-0-45mm",
    category_slug: "tom-materiallari",
    scope: "architecture",
    original_name: "Металлочерепица Монтеррей 0.45мм Полиэстер",
    english_name: "Metal Roofing Tile Monterrey Profile 0.45mm",
    aliases: ["Cherepitsa", "Tom yopish", "Profnastil", "Tom tunukasi", "Monterrey"],
    subcategory_name: "Qiya tomlar uchun polimer qoplamali tunukalar",
    manufacturer_slug: "arka-gazobeton",
    product_code: "MET-MONT-045-RAL7024",
    material_type: "Polimer qoplamali sovuq prokat po'lat list",
    cover_image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&auto=format&fit=crop&q=80",
    description: "Klassik cherepitsa to'lqin shakliga ega, yengil, zanglashga qarshi ikki tomonlama sink va poliester bo'yoq bilan qoplangan, zamonaviy qiya tomlar uchun eng ommabop material.",
    dimensions_info: "Eni to'liq: 1180 mm (foydali eni: 1100 mm). Uzunligi: 500 mm dan 6000 mm gacha buyurtmaga kesiladi.",
    standard_sizes: ["Uzunligi buyurtmaga 1.5m dan 6.0m gacha"],
    thicknesses: "0.40 mm, 0.45 mm (standart), 0.50 mm (premium qalin)",
    composition: "Konstruktsion po'lat list, 140 g/m² rux (sink) himoya qatlami, passivatsiya, gruntovka va 25 mikron poliester (PE) polimer qoplama.",
    usage_area: "Xususiy kottejlar, dala hovlilar, ko'p qavatli binolarning nishabli tomlari, ayvonlar.",
    pros: "Yengil vazn (1 m² = ~4.5 kg, to'sinlarga yuk kam), uzoq xizmat muddati, yong'inga mutlaqo yonmaydi, ranglar xilma-xilligi (RAL palitrasi bo'yicha), montaj tezligi.",
    cons: "Yomg'ir yoqqanda tovush chiqaradi (tovush izolyatsiyasi minvata bilan to'g'ri qilinishi kerak), murakkab ko'p burchakli tomlarda qiyqim chiqindisi ko'p bo'ladi.",
    approx_price: "68,000 – 95,000 so‘m / 1 m²",
    uzb_market_availability: "O'zbekistonning barcha viloyatlarida metall kesish sexlarida 1 kunda tayyorlanadi",
    standards_info: "GOST 58153-2018, QMQ 2.03.10-95",
    lifespan: "25 – 40 yil",
    moisture_resistance: "100% suv o'tkazmaydi",
    fire_rating: "KM0 (Yonmaydigan material)",
    status: "published",
    verification_status: "verified",
    access_type: "free",
    architect_notes: "📐 Tomning minimal nishablik burchagi kamida 14° bo'lishi kerak. Metallocherepitsa tagiga qat'iy ravishda superdiffuzion gidro-himoya membranasi (Tyvek / Izospan) va 50 mm kontrobreshetka o'rnatilishi shart, aks holda tunuka ostida kondensat to'planib, yog'och konstruksiya 5 yilda chiriydi.",
    specifications: [
      { parameter: "steel_thickness", parameter_label: "Metall qalinligi", value: "0.45", unit: "mm", document_page: "Sahifa 1", confidence: 1.0 },
      { parameter: "zinc_coating", parameter_label: "Rux qoplami massasi", value: "140", unit: "g/m²", document_page: "Sahifa 2", confidence: 0.98 },
      { parameter: "polymer_thickness", parameter_label: "Polimer qoplama qalinligi", value: "25", unit: "mkm", document_page: "Sahifa 2", confidence: 0.99 }
    ],
    sources: [
      { source_type: "normative_document", title: "GOST 58153-2018 Metallocherepitsa Standarti", url: "https://docs.cntd.ru/document/1200159345", publisher: "Davlat Standarti", is_primary: true }
    ],
    documents: [
      { title: "Tom Yopish va Montaj Texnologiyasi", document_type: "manual", url: "https://tn.ru/roof-manual.pdf", language: "ru" }
    ]
  },

  // 10. ARALASHMA VA YELIM: CERESIT CM 17 — ARXITEKTURA & INTERYER (BOTH)
  {
    name: "Ceresit CM 17 Super Flexible Plitka Yelimi",
    slug: "ceresit-cm-17-super-flexible",
    category_slug: "yelim-germetik",
    scope: "both",
    original_name: "Ceresit CM 17 Super Flexible C2TE S1",
    english_name: "Ceresit CM 17 Highly Flexible Tile Adhesive",
    aliases: ["Kley", "Plitka kley", "Ceresit", "CM17", "Seresit", "Elastik kley"],
    subcategory_name: "Katta formatli plitalar va deformatsiyalanuvchi asoslar yelimi",
    manufacturer_slug: "ceresit",
    product_code: "CER-CM17-25KG",
    material_type: "Yuqori polimerli elastik sementli yelim",
    cover_image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&auto=format&fit=crop&q=80",
    description: "Katta formatli keramogranit (1200x600 va undan katta), tabiiy tosh, qizdiriladigan iliq pollar va fasadlar uchun deformatsiyaga o'ta bardoshli S1 toifasidagi yelim.",
    dimensions_info: "25 kg qop. Sarfi: 1 m² ga 2.0 - 4.5 kg (taroq o'lchamiga qarab).",
    standard_sizes: ["25 kg qop"],
    thicknesses: "Chok qalinligi: 2 mm dan 10 mm gacha",
    composition: "Yuqori markali sement, saralangan kvars qumi, maxsus mustahkamlovchi tolalar (Fibre Force) va sintetik polimer modifikatorlar.",
    usage_area: "Katta formatli keramogranit, fasad qoplamalari, basseynlar, iliq pollar, terassalar, balkonlar, gipsokartonga plitka yopishtirish.",
    pros: "Aql bovar qilmas darajadagi yopishqoqlik (adgeziya >= 1.5 MPa), elastik (harorat o'zgarishida plitka ko'chib ketmaydi), vertikal yuzada sirpanmaydi (< 0.5 mm), sovuqqa va suvga mutlaqo chidamli.",
    cons: "Oddiy arzon kleylarga nisbatan narxi yuqoriroq, qotgandan keyin qirib tozalash juda qiyin.",
    approx_price: "155,000 – 185,000 so‘m / 25 kg qop",
    uzb_market_availability: "Rasmiy dilerlarda va yirik qurilish gipermarketlarida mavjud",
    standards_info: "EN 12004 bo'yicha C2TE S1 klassi, GOST R 56387-2018",
    lifespan: "50 yil",
    moisture_resistance: "100% suvga chidamli (basseynlarda suv ostida ishlatiladi)",
    fire_rating: "KM0 (Yonmaydi)",
    status: "published",
    verification_status: "verified",
    access_type: "free",
    architect_notes: "📐 Agar loyihada 600x1200 mm va undan katta plitalar yoki fasad/hovli terassasi ko'rsatilgan bo'lsa, oddiy CM 9 yoki CM 11 yelimlarini ishlatish fojiaga olib keladi (birinchi qishdayoq plitka ko'chadi). Spetsifikatsiyada qat'iy ravishda C2TE S1 elastiklik sinfiga ega yelimni ko'rsatish shart.",
    specifications: [
      { parameter: "adhesion_concrete", parameter_label: "Betonga yopishish kuchi", value: ">= 1.5", unit: "MPa", document_page: "Sahifa 2", confidence: 1.0 },
      { parameter: "transverse_deformation", parameter_label: "Ko'ndalang elastik deformatsiya", value: ">= 2.5", unit: "mm (S1)", document_page: "Sahifa 3", confidence: 1.0 },
      { parameter: "open_time", parameter_label: "Ochiq qolish vaqti", value: ">= 30", unit: "daqiqa", document_page: "Sahifa 2", confidence: 0.98 }
    ],
    sources: [
      { source_type: "technical_datasheet", title: "Ceresit CM 17 Technical Sheet", url: "https://www.ceresit.com/cm17-tds.pdf", publisher: "Henkel Ceresit", is_primary: true }
    ],
    documents: [
      { title: "Ceresit CM 17 Pasporti", document_type: "datasheet", url: "https://www.ceresit.com/cm17.pdf", language: "ru" }
    ]
  },

  // 11. OYNA VA SHISHA: TRIPLEX VA LOW-E STAKLOPAKET — BOTH
  {
    name: "Low-E Energiya Tejovchi Ikki Kamerali Steklopaket 36mm",
    slug: "low-e-steklopaket-36mm",
    category_slug: "oyna-shisha",
    scope: "both",
    original_name: "Double Glazed Unit 4LowE-12Ar-4-12Ar-4 36mm",
    english_name: "Energy Efficient Triple Glazed Low-E Unit 36mm",
    aliases: ["Steklopaket", "Low-E oyna", "Energiya tejovchi oyna", "Deraza oynasi", "Vitraj"],
    subcategory_name: "Issiqlik va quyoshdan himoyalovchi shisha paketlar",
    manufacturer_slug: "ekopen",
    product_code: "GLS-LOWE-4-12-4-12-4",
    material_type: "Argon gazli ko'p qatlamli shishapaket",
    cover_image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=600&auto=format&fit=crop&q=80",
    description: "Kumush ionli yupqa qatlam bilan qoplangan, qishda xona issiqligini tashqariga chiqarmaydigan, yozda esa jazirama quyosh nurlarini qaytaruvchi innovatsion oyna tizimi.",
    dimensions_info: "Buyurtma bo'yicha: 3000 x 2000 mm gacha. Qalinligi: 36 mm (4-12-4-12-4).",
    standard_sizes: ["Buyurtma bo'yicha fasad va derazalar uchun"],
    thicknesses: "24 mm (bir kamerali), 32 mm, 36 mm, 40 mm",
    composition: "4 mm Low-E shisha + 12 mm argon gazli masofa plankasi + 4 mm float shisha + 12 mm argon + 4 mm shisha.",
    usage_area: "Kvartira va villalarning panoramali derazalari, fasad vitrajlari, qishki bog'lar, vitrinalar.",
    pros: "Oddiy oynaga qaraganda issiqlikni 2 barobar yaxshi saqlaydi, kondensat (terlash) hosil bo'lmaydi, mebellarni quyoshda o'chib ketishdan (UV) himoyalaydi, shovqinni 38 dB gacha pasaytiradi.",
    cons: "Oddiy shishapaketga qaraganda 35-50% qimmatroq, og'ir vaznga ega (baquvvat deraza furniturasi talab etiladi).",
    approx_price: "420,000 – 680,000 so‘m / 1 m²",
    uzb_market_availability: "O'zbekistonda zamonaviy oyna zavodlarida (Imzo, Ekopen, Glass Expo) buyurtmaga tayyorlanadi",
    standards_info: "GOST 24866-2014, QMQ 2.01.04-97",
    lifespan: "30 – 50 yil",
    moisture_resistance: "100% germetik ikkilamchi butil/polisulfid plomba",
    fire_rating: "G1 / KM1",
    status: "published",
    verification_status: "verified",
    access_type: "free",
    architect_notes: "📐 Janub va g'arbga qaragan panoramali katta derazalar uchun faqat Low-E emas, 'Solar Control' (quyoshdan himoyalovchi multifunksional) oynalarni loyihalang. Aks holda yozda xonada parnik effekti hosil bo'lib, konditsioner quvvati yetmaydi.",
    specifications: [
      { parameter: "heat_transfer_resistance", parameter_label: "Issiqlik o'tkazuvchanlikka qarshilik", value: "0.78", unit: "m²·°C/Vt", document_page: "Sahifa 2", confidence: 1.0 },
      { parameter: "light_transmission", parameter_label: "Yorug'lik o'tkazuvchanligi", value: "72", unit: "%", document_page: "Sahifa 3", confidence: 0.98 },
      { parameter: "sound_insulation", parameter_label: "Tovush izolyatsiyasi", value: "36 - 38", unit: "dB", document_page: "Sahifa 4", confidence: 0.96 }
    ],
    sources: [
      { source_type: "normative_document", title: "GOST 24866-2014 Steklopaketlar Standarti", url: "https://docs.cntd.ru/document/1200115003", publisher: "Davlat Standarti", is_primary: true }
    ],
    documents: [
      { title: "Energiya Tejovchi Oynalar Sertifikati", document_type: "certificate", url: "https://docs.cntd.ru/cert.pdf", language: "ru" }
    ]
  },

  // 12. BO'YOQ: TIKKURILA EURO POWER 7 — INTERYER / BO'YOQ
  {
    name: "Tikkurila Euro Power 7 Matoviy Yuviluvchi Bo'yoq",
    slug: "tikkurila-euro-power-7",
    category_slug: "boyoq-dekor",
    scope: "interior",
    original_name: "Tikkurila Euro Power 7 Washable Interior Paint",
    english_name: "Tikkurila Euro Power 7 Washable Acrylic Paint",
    aliases: ["Bo'yoq", "Kraska", "Emulsiya", "Tikkurila", "Matovaya kraska", "Yuviladigan kraska"],
    subcategory_name: "Ichki devor va shiftlar uchun yuqori darajada yuviluvchi bo'yoq",
    manufacturer_slug: "tikkurila",
    product_code: "TIK-EUR7-09L",
    material_type: "Suv-dispersiyali sof akril bo'yoq",
    cover_image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80",
    description: "Bolalar xonalari, oshxona, zal va koridorlar uchun chidamli, 10,000 martagacha cho'tka bilan yuvishga bardosh beradigan ekologik ipakdek mat bo'yoq.",
    dimensions_info: "Paqirlar: 0.9L, 2.7L, 9.0L. Sarfi: 1 litr bilan 10-12 m² bir qatlamda bo'yaladi.",
    standard_sizes: ["0.9 L", "2.7 L", "9.0 L"],
    thicknesses: "2 qatlamda purkash/valik bilan surtish tavsiya etiladi",
    composition: "Suvli akril sopolimer dispersiyasi, titan dioksidi (oq pigment), kalsit to'ldiruvchi, xavfsiz funktsional qo'shimchalar.",
    usage_area: "Mehmonxona, yotoqxona, bolalar xonasi, oshxona, maktab va ofis devorlari.",
    pros: "1-toifali namli tozalashga chidamlilik (DIN EN 13300), hidsiz, tez quriydi (2 soat), 20,000 dan ortiq ranglarga kompyuterda aniq tuslanadi (kolerovka), sarg'aymaydi.",
    cons: "Devor yuzasi mukammal darajada Q4 sifatda shpaklyovka qilinishi kerak (har qanday chuqurcha ko'rinadi), noldan past haroratda saqlash mumkin emas.",
    approx_price: "420,000 – 540,000 so‘m / 9 litrlik paqir",
    uzb_market_availability: "O'zbekistonda barcha Tikkurila rasmiy do'konlarida mavjud",
    standards_info: "ISO 9001, DIN EN 13300 bo'yicha 1-klass",
    lifespan: "10 – 15 yil",
    moisture_resistance: "Yuqori (to'liq yuviladi, maishiy yuvish vositalariga chidamli)",
    fire_rating: "KM1 (Yong'in xavfsizligi bo'yicha sertifikatlangan)",
    status: "published",
    verification_status: "verified",
    access_type: "free",
    architect_notes: "📐 Shiftlar uchun yuviluvchi Power 7 emas, butunlay nurni yutuvchi chuqur mat bo'yoq (Tikkurila Euro White yoki Siro Himmea) tanlang. Devorlar uchun esa Power 7 ayni muddao. Bo'yashdan oldin qat'iy ravishda Tikkurila Euro Primer chuqur singuvchi gruntovka surilishi shart.",
    specifications: [
      { parameter: "scrub_resistance", parameter_label: "Namli ishqalanishga chidamlilik", value: "1-klass (> 10000 tsikl)", unit: "tsikl", document_page: "Sahifa 2", confidence: 1.0 },
      { parameter: "drying_time", parameter_label: "Qurish vaqti (+20°C da)", value: "2", unit: "soat", document_page: "Sahifa 2", confidence: 0.98 },
      { parameter: "voc_content", parameter_label: "Uchuvchi organik birikmalar (VOC)", value: "< 30", unit: "g/l", document_page: "Sahifa 3", confidence: 0.99 }
    ],
    sources: [
      { source_type: "technical_datasheet", title: "Tikkurila Euro Power 7 Texnik Pasporti", url: "https://tikkurila.uz/power7.pdf", publisher: "Tikkurila O'zbekiston", is_primary: true }
    ],
    documents: [
      { title: "Tikkurila Bo'yoqlari Ekologik Sertifikati", document_type: "certificate", url: "https://tikkurila.uz/cert.pdf", language: "ru" }
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
        scope VARCHAR(50) DEFAULT 'both',
        description TEXT,
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Ensure scope column in categories
    await pool.query(`
      ALTER TABLE material_categories ADD COLUMN IF NOT EXISTS scope VARCHAR(50) DEFAULT 'both';
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
        scope VARCHAR(50) DEFAULT 'both',
        manufacturer_id INT REFERENCES material_manufacturers(id) ON DELETE SET NULL,
        product_code VARCHAR(100),
        material_type VARCHAR(255),
        cover_image VARCHAR(500),
        gallery JSONB DEFAULT '[]',
        description TEXT,
        dimensions_info TEXT,
        thicknesses VARCHAR(255),
        composition TEXT,
        usage_area TEXT,
        pros TEXT,
        cons TEXT,
        approx_price VARCHAR(255),
        uzb_market_availability VARCHAR(255),
        architect_notes TEXT,
        standards_info VARCHAR(255),
        lifespan VARCHAR(100),
        moisture_resistance VARCHAR(255),
        fire_rating VARCHAR(255),
        standard_sizes JSONB DEFAULT '[]',
        status VARCHAR(50) DEFAULT 'published',
        verification_status VARCHAR(50) DEFAULT 'verified',
        access_type VARCHAR(50) DEFAULT 'free',
        last_verified_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Ensure all rich columns exist via ALTER TABLE
    await pool.query(`
      ALTER TABLE materials ADD COLUMN IF NOT EXISTS scope VARCHAR(50) DEFAULT 'both';
      ALTER TABLE materials ADD COLUMN IF NOT EXISTS thicknesses VARCHAR(255);
      ALTER TABLE materials ADD COLUMN IF NOT EXISTS composition TEXT;
      ALTER TABLE materials ADD COLUMN IF NOT EXISTS usage_area TEXT;
      ALTER TABLE materials ADD COLUMN IF NOT EXISTS pros TEXT;
      ALTER TABLE materials ADD COLUMN IF NOT EXISTS cons TEXT;
      ALTER TABLE materials ADD COLUMN IF NOT EXISTS approx_price VARCHAR(255);
      ALTER TABLE materials ADD COLUMN IF NOT EXISTS uzb_market_availability VARCHAR(255);
      ALTER TABLE materials ADD COLUMN IF NOT EXISTS architect_notes TEXT;
      ALTER TABLE materials ADD COLUMN IF NOT EXISTS standards_info VARCHAR(255);
      ALTER TABLE materials ADD COLUMN IF NOT EXISTS lifespan VARCHAR(100);
      ALTER TABLE materials ADD COLUMN IF NOT EXISTS moisture_resistance VARCHAR(255);
      ALTER TABLE materials ADD COLUMN IF NOT EXISTS fire_rating VARCHAR(255);
      ALTER TABLE materials ADD COLUMN IF NOT EXISTS standard_sizes JSONB DEFAULT '[]';
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
      CREATE INDEX IF NOT EXISTS idx_materials_scope ON materials(scope);
      CREATE INDEX IF NOT EXISTS idx_material_specs_mat ON material_specifications(material_id);
      CREATE INDEX IF NOT EXISTS idx_material_sources_mat ON material_sources(material_id);
      CREATE INDEX IF NOT EXISTS idx_material_docs_mat ON material_documents(material_id);
      CREATE INDEX IF NOT EXISTS idx_material_apps_mat ON material_applications(material_id);
      CREATE INDEX IF NOT EXISTS idx_material_reqs_mat ON material_requirements(material_id);
    `);

    // --- SEED CATEGORIES ---
    for (const cat of SEED_CATEGORIES) {
      await pool.query(`
        INSERT INTO material_categories (name, slug, icon, scope, description, sort_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, true)
        ON CONFLICT (slug) DO UPDATE
        SET name = EXCLUDED.name, icon = EXCLUDED.icon, scope = EXCLUDED.scope,
            description = EXCLUDED.description, sort_order = EXCLUDED.sort_order
      `, [cat.name, cat.slug, cat.icon, cat.scope || 'both', cat.description, cat.sort_order]);
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
        INSERT INTO materials (
          name, slug, original_name, english_name, aliases, category_id, subcategory_name, scope,
          manufacturer_id, product_code, material_type, cover_image, description, dimensions_info,
          thicknesses, composition, usage_area, pros, cons, approx_price, uzb_market_availability,
          architect_notes, standards_info, lifespan, moisture_resistance, fire_rating,
          standard_sizes, status, verification_status, access_type, last_verified_at, updated_at
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14,
          $15, $16, $17, $18, $19, $20, $21,
          $22, $23, $24, $25, $26,
          $27, $28, $29, $30, NOW(), NOW()
        )
        ON CONFLICT (slug) DO UPDATE
        SET name = EXCLUDED.name, original_name = EXCLUDED.original_name, english_name = EXCLUDED.english_name,
            aliases = EXCLUDED.aliases, category_id = EXCLUDED.category_id, subcategory_name = EXCLUDED.subcategory_name,
            scope = EXCLUDED.scope, manufacturer_id = EXCLUDED.manufacturer_id, product_code = EXCLUDED.product_code,
            material_type = EXCLUDED.material_type, cover_image = EXCLUDED.cover_image, description = EXCLUDED.description,
            dimensions_info = EXCLUDED.dimensions_info, thicknesses = EXCLUDED.thicknesses, composition = EXCLUDED.composition,
            usage_area = EXCLUDED.usage_area, pros = EXCLUDED.pros, cons = EXCLUDED.cons,
            approx_price = EXCLUDED.approx_price, uzb_market_availability = EXCLUDED.uzb_market_availability,
            architect_notes = EXCLUDED.architect_notes, standards_info = EXCLUDED.standards_info,
            lifespan = EXCLUDED.lifespan, moisture_resistance = EXCLUDED.moisture_resistance, fire_rating = EXCLUDED.fire_rating,
            standard_sizes = EXCLUDED.standard_sizes, status = EXCLUDED.status,
            verification_status = EXCLUDED.verification_status, access_type = EXCLUDED.access_type,
            last_verified_at = EXCLUDED.last_verified_at, updated_at = NOW()
        RETURNING id
      `, [
        m.name, m.slug, m.original_name, m.english_name, m.aliases || [], categoryId, m.subcategory_name, m.scope || 'both',
        manufacturerId, m.product_code, m.material_type, m.cover_image, m.description, m.dimensions_info,
        m.thicknesses, m.composition, m.usage_area, m.pros, m.cons, m.approx_price, m.uzb_market_availability,
        m.architect_notes, m.standards_info, m.lifespan, m.moisture_resistance, m.fire_rating,
        JSON.stringify(m.standard_sizes || []), m.status || 'published', m.verification_status || 'verified', m.access_type || 'free'
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
          `, [materialId, s.source_type, s.title, s.url, s.publisher, s.document_name, s.document_version, s.published_date, s.status || 'verified', s.is_primary || false]);
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
          `, [materialId, doc.title, doc.document_type, doc.url, doc.version, doc.language || 'ru', doc.published_date, dIdx++]);
        }
      }
    }

    console.log('✅ MATERIALLAR KUTUBXONASI: 24 ta kategoriya va Arxitektura/Interyer segmentlari muvaffaqiyatli sinxronlashtirildi.');
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
