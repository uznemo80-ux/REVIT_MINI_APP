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
    description: "Gazobeton, pishgan g'isht, penoblok, keramzit blok, shlakoblok, silikat va monolit temir-beton",
    sort_order: 1
  },
  {
    name: "Tabiiy va sun'iy toshlar",
    slug: "tosh-materiallari",
    icon: "🪨",
    scope: "both",
    description: "Travertin, granit, marmar, bazalt, oniks, kvartsit va sun'iy aglomerat toshlar",
    sort_order: 2
  },
  {
    name: "Devor tekislash va quruq qorishmalar",
    slug: "tekislash-qorishmalar",
    icon: "🧴",
    scope: "both",
    description: "Gipsli va sementli suvoq (Rotband), start/finish shpaklyovka (Satengips), betonokontakt",
    sort_order: 3
  },
  {
    name: "Yog‘och va yog‘och plitalar",
    slug: "yogoch-plitalar",
    icon: "🪵",
    scope: "interior",
    description: "Fanera, OSB-3, tabiiy brus, doska, shpon va yog'och karkas elementlari",
    sort_order: 4
  },
  {
    name: "Gipsokarton va quruq qurilish",
    slug: "gipsokarton-quruq",
    icon: "🧩",
    scope: "interior",
    description: "GKL standart, GKLV namga chidamli, GKLO olovbardosh, Knauf metall karkas profillari",
    sort_order: 5
  },
  {
    name: "Pol qoplamalari",
    slug: "pol-materiallari",
    icon: "🪜",
    scope: "interior",
    description: "SPC kvars-vinil, keramogranit, klassik laminat, tabiiy parket, quyma o'zi tekislanuvchi pol",
    sort_order: 6
  },
  {
    name: "Devor va patalok qoplamalari",
    slug: "devor-patalok-qoplamalari",
    icon: "🏢",
    scope: "interior",
    description: "Cho'ziluvchan patalok (svetovye liniyali), gipsokarton osma patalok, Grilyato, Armstrong, reykali patalok va MDF panellar",
    sort_order: 7
  },
  {
    name: "Bo‘yoq va dekorativ qoplamalar",
    slug: "boyoq-dekor",
    icon: "🎨",
    scope: "both",
    description: "Yuviladigan mot bo'yoqlar, lateks, fasad bo'yoqlari, gruntovka va mikrotsement",
    sort_order: 8
  },
  {
    name: "Oyna va shisha tizimlari",
    slug: "oyna-shisha",
    icon: "🪟",
    scope: "both",
    description: "Low-E energiya tejovchi shishapaketlar, temperlangan shisha, triplex, dush to'siqlari",
    sort_order: 9
  },
  {
    name: "Metall va armatura",
    slug: "metall-materiallar",
    icon: "🔩",
    scope: "architecture",
    description: "Armatura A500C, profil trubalar, dvutavr balka, po'lat shveller, kladochnaya to'r",
    sort_order: 10
  },
  {
    name: "Tom materiallari",
    slug: "tom-materiallari",
    icon: "🏠",
    scope: "architecture",
    description: "Metallocherepitsa Monterrey, profnastil PK-35, bitumli egiluvchan cherepitsa, sendvich panellar",
    sort_order: 11
  },
  {
    name: "Gidroizolyatsiya",
    slug: "gidroizolyatsiya",
    icon: "💧",
    scope: "both",
    description: "Bikrost HPP/TKP, bitumli mastika, penetratsion kristalli qorishma, superdiffuzion membrana",
    sort_order: 12
  },
  {
    name: "Issiqlik izolyatsiyasi",
    slug: "issiqlik-izolyatsiyasi",
    icon: "🌡️",
    scope: "both",
    description: "XPS penopolistirol (Penopleks), bazalt tosh paxta mineral vata, penoplast EPS",
    sort_order: 13
  },
  {
    name: "Akustika va ovoz yutish",
    slug: "akustik-materiallar",
    icon: "🔇",
    scope: "interior",
    description: "Akustik gipsokarton Knauf Silent, PET akustik panellar, perforatsiyalangan yog'och panellar",
    sort_order: 14
  },
  {
    name: "Eshik va deraza tizimlari",
    slug: "eshik-deraza",
    icon: "🚪",
    scope: "both",
    description: "Yashirin montaj eshigi (Invisible), emal MDF eshiklar, termoalyuminiy va PVX derazalar",
    sort_order: 15
  },
  {
    name: "Yelim, germetik va montaj",
    slug: "yelim-germetik",
    icon: "🧰",
    scope: "both",
    description: "Ceresit CM 11 Plus, CM 17 Super Flexible, montaj ko'pigi, sanitar silikon, Knauf Perlfix",
    sort_order: 16
  },
  {
    name: "Elektr va interyer yoritish",
    slug: "elektr-yoritish",
    icon: "💡",
    scope: "interior",
    description: "Magnit trek tizimi 48V, anti-glare chuqur LED spotlar, COB LED lenta, VVG-P ng kabel",
    sort_order: 17
  },
  {
    name: "Santexnika va quvurlar",
    slug: "santexnika-sanuzel",
    icon: "🚿",
    scope: "both",
    description: "PPR suv quvurlari, Geberit devor ichi installyatsiya, osma rimless unitaz",
    sort_order: 18
  },
  {
    name: "Oshxona, mebel va plitalar",
    slug: "oshxona-mebel",
    icon: "🍽️",
    scope: "interior",
    description: "EGGER LDSP 18mm, AGT MDF Supramat panellar, HPL kompakt laminat, akril sun'iy tosh",
    sort_order: 19
  },
  {
    name: "Fasad tizimlari",
    slug: "fasad-materiallari",
    icon: "🏗️",
    scope: "architecture",
    description: "Ventfasad alyuminiy kompozit (Alukobond), klinker fasad g'ishti, travertin fasad",
    sort_order: 20
  },
  {
    name: "Landshaft va obodonlashtirish",
    slug: "landshaft-tashqi",
    icon: "🌿",
    scope: "architecture",
    description: "Vibropresslangan trotuar bruschatkasi, granit bordyur, deking WPC taxtasi",
    sort_order: 21
  },
  {
    name: "Yong‘in xavfsizligi materiallari",
    slug: "yongin-xavfsizligi",
    icon: "🔥",
    scope: "both",
    description: "GKLO olovbardosh gipsokarton, yong'inga qarshi bo'yoqlar, bazalt to'siqlar",
    sort_order: 22
  },
  {
    name: "Dekorativ elementlar",
    slug: "dekorativ-materiallar",
    icon: "🖼️",
    scope: "interior",
    description: "Poliuretan moldinglar, shift bagetlari, yashirin plintus, reykalar",
    sort_order: 23
  },
  {
    name: "Maxsus arxitektura materiallari",
    slug: "maxsus-arxitektura",
    icon: "🏭",
    scope: "both",
    description: "Soya chokli Kraab/EuroKraab profili, dilatatsion choklar, geotekstil",
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
    description: "Gipsokarton, quruq qorishmalar va profillar bo'yicha yetakchi jahon brendi"
  },
  {
    name: "EGGER",
    slug: "egger",
    logo: "https://lh3.googleusercontent.com/d/1_egger_logo",
    website: "https://www.egger.com",
    country: "Avstriya / Germaniya",
    description: "Premium LDSP, MDF va mebel plitalari ishlab chiqaruvchisi"
  },
  {
    name: "Technonicol",
    slug: "technonicol",
    logo: "https://lh3.googleusercontent.com/d/1_technonicol_logo",
    website: "https://www.tn.ru",
    country: "Rossiya / Xalqaro",
    description: "Tom yopish, gidroizolyatsiya, XPS va mineral tosh paxta yetakchisi"
  },
  {
    name: "Ceresit (Henkel)",
    slug: "ceresit",
    logo: "https://lh3.googleusercontent.com/d/1_ceresit_logo",
    website: "https://www.ceresit.com",
    country: "Germaniya",
    description: "Professional plitka yelimlari va qurilish kimyosi"
  },
  {
    name: "Arka Gazobeton",
    slug: "arka-gazobeton",
    logo: "https://lh3.googleusercontent.com/d/1_arka_logo",
    website: "https://arkagazobeton.uz",
    country: "O'zbekiston",
    description: "Nemis Wehrhahn texnologiyasidagi D500 avtoklav gazobeton bloklari"
  },
  {
    name: "Akfa / Engelberg",
    slug: "akfa",
    logo: "https://lh3.googleusercontent.com/d/1_akfa_logo",
    website: "https://akfa.uz",
    country: "O'zbekiston",
    description: "Termoalyuminiy va PVX oyna-eshik romlari hamda kompozit panellar"
  },
  {
    name: "Tikkurila",
    slug: "tikkurila",
    logo: "https://lh3.googleusercontent.com/d/1_tikkurila_logo",
    website: "https://tikkurila.uz",
    country: "Finlyandiya",
    description: "Yuviladigan premium toifadagi interyer va fasad bo'yoqlari"
  },
  {
    name: "Geberit",
    slug: "geberit",
    logo: "https://lh3.googleusercontent.com/d/1_geberit_logo",
    website: "https://www.geberit.com",
    country: "Shveytsariya",
    description: "Yashirin santexnika installyatsiyalari va muhandislik tizimlari"
  }
];

// O'quvchi, arxitektor va interyer dizaynerlari uchun mukammal materiallar bazasi (36 ta asosiy material)
const SEED_MATERIALS = [
  // 1. QURILISH — MONOLIT TEMIR-BETON
  {
    name: "Monolit Temir-beton B25 (M350)",
    slug: "monolit-temir-beton-b25",
    original_name: "Товарный бетон Б25 М350",
    category_slug: "tekislash-qorishmalar",
    scope: "architecture",
    cover_image: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80",
    description: "Ko'p qavatli binolar, monolit karkaslar, poydevor va orayopma plitalari uchun yuqori mustahkamlikdagi konstruktiv tovar betoni.",
    dimensions_info: "Tayyor suyuq qorishma, avtobetonosmesitel orqali yetkaziladi",
    thicknesses: "Poydevor plitasi 300-800mm, orayopma 160-220mm, ustunlar 400x400mm+",
    composition: "Portlandsement M500, yuvilgan granit shag'ali (fraksiya 5-20mm), kvars qumi, plastifikatorlar, suv",
    usage_area: "Yuk ko'taruvchi monolit ustunlar, rigellar, fundament plitalari, orayopma monolit plitalar",
    pros: "O'ta yuqori siqilishga chidamlilik (25 MPa), seysmik xavfsizlik (9 ballgacha), uzoq umr (100+ yil)",
    cons: "Opalubka va karkas to'qish mehnattalab, qotish muddati 28 kun, harorat nazorati zarur",
    approx_price: "680 000 - 750 000 UZS / m³",
    uzb_market_availability: "O'zbekistonning barcha viloyatlarida beton zavodlaridan mavjud",
    architect_notes: "BIM modelda B25 sinf beton uchun armaturalash foizi va qoliplar oralig'ini to'g'ri hisoblang. Issiq havoda (30°C+) beton quyilganda parvarish (suv sepish va plyonka) shart.",
    standards_info: "GOST 7473-2010, SHNQ 2.03.01-96",
    lifespan: "100+ yil",
    moisture_resistance: "W6 - W8 suv o'tkazmaslik",
    fire_rating: "NG (Yonmaydi)",
    standard_sizes: ["Tovarskiy beton kub metrda (m³)"]
  },

  // 2. QURILISH — PISHGAN QIZIL G'ISHT
  {
    name: "Pishgan Qizil G'isht (Standart M125)",
    slug: "pishgan-qizil-gisht-m125",
    original_name: "Кирпич керамический полнотелый М125",
    category_slug: "devor-konstruksiya",
    scope: "architecture",
    cover_image: "https://images.unsplash.com/photo-1584463699042-3e28c46dfc09?w=600&auto=format&fit=crop&q=80",
    description: "Klassik pishirilgan keramik to'liq (polnotely) va teshikli (pustotely) pishgan g'isht. Bino yuk ko'taruvchi va to'siq devorlari asosi.",
    dimensions_info: "250 x 120 x 65 mm (1NF bir kornat g'isht)",
    thicknesses: "Devor qalinligi: 120mm (yarim g'isht), 250mm (bir g'isht), 380mm (bir yarim g'isht)",
    composition: "Tozalangan tabiiy gil (loy), 1000°C da pishirilgan keramik massa",
    usage_area: "Bino yuk ko'taruvchi devorlari, ventilyatsiya shaxtalari, tsokol qavati, to'siq devorlar",
    pros: "Ekologik 100% toza, yuqori issiqlik sig'imi, tovush izolyatsiyasi, namlikka o'ta chidamli",
    cons: "Og'ir vazn (3.5-3.8 kg/dona), terish sekin va mehnattalab, qo'shimcha fasad izolatsiyasi talab qiladi",
    approx_price: "950 - 1 400 UZS / dona",
    uzb_market_availability: "O'zbekistonning barcha tuman va g'isht zavodlarida mavjud",
    architect_notes: "Toshkent va viloyatlardagi seysmik me'yorlarga ko'ra, g'ishtli devorlarda har 3-4 qatorda kladochnaya to'r va seysmik monolit poyas loyihalashtirilishi shart.",
    standards_info: "GOST 530-2012, SHNQ 2.01.03-96",
    lifespan: "100+ yil",
    moisture_resistance: "Yuqori (suv shimish 8-12%)",
    fire_rating: "NG (Yonmaydi, 4 soat olovbardosh)",
    standard_sizes: ["250x120x65 mm (1 NF)", "250x120x88 mm (1.4 NF)"]
  },

  // 3. QURILISH — GAZOBETON BLOK D500
  {
    name: "Gazobeton Blok D500 (Arka Wehrhahn)",
    slug: "gazobeton-blok-d500",
    original_name: "Газобетон автоклавный D500 B2.5",
    category_slug: "devor-konstruksiya",
    manufacturer_slug: "arka-gazobeton",
    scope: "architecture",
    cover_image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=600&auto=format&fit=crop&q=80",
    description: "Avtoklavlangan aniq geometriyali gazosilikat devor bloklari. Yengil, mukammal issiqlik saqlovchi zamonaviy devor materiali.",
    dimensions_info: "600 x 300 x 200 mm, 600 x 300 x 100 mm, 600 x 300 x 150 mm",
    thicknesses: "Tashqi devorlar uchun 300-400mm, xonalararo to'siqlar uchun 100-150mm",
    composition: "Kvars qumi, portlandsement, ohak, gips, alyuminiy kukuni (gazoobrazovatel)",
    usage_area: "Monolit karkasli ko'p qavatli binolar to'ldirish devorlari, kottejlar tashqi va ichki devorlari",
    pros: "Yengil vazn (fundamentga yuk kam), tez teriladi, yuqori issiqlik izolyatsiyasi (λ=0.12 Vt/m·K), yong'inbardosh",
    cons: "Namlikni tez shimadi (suvoqdan oldin gruntovka shart), mustahkam ankerlar talab qiladi",
    approx_price: "680 000 - 780 000 UZS / m³",
    uzb_market_availability: "O'zbekistonda mavjud (Arka, Ekogazobeton, Arton)",
    architect_notes: "Monolit ustunlar va orayopma plitalar orasidagi tutashuvda deformatsion chok (20mm montaj ko'pigi) qoldirilishi shart, aks holda devor yorilishi mumkin.",
    standards_info: "GOST 31360-2007, KMK 2.01.04-18",
    lifespan: "70+ yil",
    moisture_resistance: "O'rtacha (gidrofobizatsiya tavsiya etiladi)",
    fire_rating: "NG (Yonmaydi, KM0)",
    standard_sizes: ["600x300x200 mm", "600x300x100 mm", "600x300x150 mm", "600x300x400 mm"]
  },

  // 4. QURILISH — PENOBLOK D600
  {
    name: "Penoblok D600 (Penobeton Devor Bloki)",
    slug: "penoblok-d600",
    original_name: "Пеноблок стеновой D600",
    category_slug: "devor-konstruksiya",
    scope: "architecture",
    cover_image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80",
    description: "G'ovakli yengil penobeton devor toshi. Yopiq g'ovakli tuzilishi tufayli gazobetonga nisbatan namlikni kamroq shimadi.",
    dimensions_info: "600 x 300 x 200 mm, 600 x 300 x 100 mm",
    thicknesses: "200mm, 300mm",
    composition: "Sement, qum, penoobrazovatel, suv",
    usage_area: "To'siq devorlar, xususiy uylar, omborxonalar va xo'jalik binolari devori",
    pros: "Arzon narx, yengil, namlikka gazobetondan ko'ra chidamliroq",
    cons: "Geometriyasida chetlanishlar bo'lishi mumkin, qalinroq suvoq qatlami talab qiladi",
    approx_price: "520 000 - 600 000 UZS / m³",
    uzb_market_availability: "O'zbekistonning ko'plab xususiy korxonalarida ishlab chiqariladi",
    architect_notes: "Karkassiz binolarda faqat 1-2 qavatgacha ruxsat beriladi. Qavatlararo monolit temir-beton poyas quyish majburiy.",
    standards_info: "GOST 25485-89",
    lifespan: "50+ yil",
    moisture_resistance: "Yaxshi (yopiq porali tuzilma)",
    fire_rating: "NG (Yonmaydi)",
    standard_sizes: ["600x300x200 mm", "600x300x100 mm"]
  },

  // 5. QURILISH — KERAMZIT BLOK
  {
    name: "Keramzit Blok (Yengil Devor Toshi)",
    slug: "keramzit-blok",
    original_name: "Керамзитобетонный блок стеновой",
    category_slug: "devor-konstruksiya",
    scope: "architecture",
    cover_image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=600&auto=format&fit=crop&q=80",
    description: "Kuygan gil granulalari (keramzit) va sement aralashmasidan tayyorlangan ekologik, yengil va issiq devor bloki.",
    dimensions_info: "390 x 190 x 190 mm (standart 4-teshikli)",
    thicknesses: "190mm (yarim blok), 390mm (to'liq devor)",
    composition: "Keramzit shag'ali, portlandsement M400, qum, suv",
    usage_area: "Uy-joy tashqi devorlari, kottejlar, to'siq devorlar",
    pros: "Bug' o'tkazuvchan (devor nafas oladi), g'ishtdan 2.5 barobar yengil, ekologik sof",
    cons: "Mexanik kesishda maxsus disk talab qiladi, yuzasi g'adir-budur",
    approx_price: "4 800 - 6 500 UZS / dona",
    uzb_market_availability: "O'zbekistonda mavjud (Navoiy, Toshkent viloyati keramzit korxonalari)",
    architect_notes: "O'zbekistonning issiq iqlimida keramzit bloklar yuqori issiqlik inersiyasiga ega, bino ichida yoqimli mikroklimat saqlaydi.",
    standards_info: "GOST 6133-99",
    lifespan: "75+ yil",
    moisture_resistance: "Yuqori",
    fire_rating: "NG (Yonmaydi)",
    standard_sizes: ["390x190x190 mm", "390x120x190 mm"]
  },

  // 6. QURILISH — SHLAKOBLOK
  {
    name: "Shlakoblok (Devor va Panjara Bloklari)",
    slug: "shlakoblok-standart",
    original_name: "Шлакоблок стеновой",
    category_slug: "devor-konstruksiya",
    scope: "architecture",
    cover_image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80",
    description: "Vibropress usulida metallurgiya shlaki yoki maydalangan tosh va sementdan tayyorlangan mustahkam arzon devor materiali.",
    dimensions_info: "390 x 190 x 188 mm",
    thicknesses: "190mm, 390mm",
    composition: "Sement M400, maydalangan tosh/shlak, qum",
    usage_area: "Hududiy o'rab olish devorlari (zabor), omborxonalar, sanoat binolari, poydevor qismi",
    pros: "O'ta arzon narx, yuqori mexanik mustahkamlik, o'g'irlikka va buzishga chidamli",
    cons: "Og'ir, issiqlik izolyatsiyasi past (sovuq o'tkazuvchan), radiatsion nazoratdan o'tgan bo'lishi kerak",
    approx_price: "3 200 - 4 200 UZS / dona",
    uzb_market_availability: "O'zbekistonning barcha bozorlarida doimiy mavjud",
    architect_notes: "Turar-joy xonalari uchun faqat tashqi tomondan kamida 100mm izolyatsiya qilinganda tavsiya etiladi. Zabor va garajlar uchun ideal.",
    standards_info: "GOST 6133-99",
    lifespan: "50+ yil",
    moisture_resistance: "O'rtacha",
    fire_rating: "NG (Yonmaydi)",
    standard_sizes: ["390x190x188 mm"]
  },

  // 7. QURILISH — ARMATURA A500C
  {
    name: "Po'lat Armatura A500C (12mm, 14mm, 16mm, 20mm)",
    slug: "armatura-a500c",
    original_name: "Арматура строительная рифленая А500С",
    category_slug: "metall-materiallar",
    scope: "architecture",
    cover_image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80",
    description: "Issiq prokatlangan davriy profilli termomexanik mustahkamlangan armatura po'lati. Monolit temir-beton karkasining asosiy kuchi.",
    dimensions_info: "Diametrlari: 10, 12, 14, 16, 18, 20, 22, 25, 28, 32 mm. Standart uzunligi: 11.7 metr",
    thicknesses: "Ø12mm (plitka va setkalar), Ø16-Ø25mm (kolonnalar va rigellar)",
    composition: "Kam uglerodli legirlangan po'lat (uglerod ekvivalenti < 0.50%)",
    usage_area: "Monolit ustunlar, rigellar, orayopma plitalari, poydevor karkaslari, seysmik poyaslar",
    pros: "A'lo darajada payvandlanuvchanlik (C indeksi), egilishga chidamli, beton bilan maksimal yopishuv",
    cons: "Ochiq havoda korroziyaga moyil, beton himoya qatlami kamida 25-35mm bo'lishi shart",
    approx_price: "8 200 000 - 9 400 000 UZS / tonna",
    uzb_market_availability: "O'zbekistonda mavjud (O'zmetkombinat Bekobod, xususiy prokat zavodlari)",
    architect_notes: "Revit karkas modelingida armaturaning beton himoya qatlami (protective concrete cover) ustunlarda 30-35mm, plitalarda 20mm dan kam bo'lmasligini belgilang.",
    standards_info: "GOST 52544-2006, SHNQ 2.03.01-96",
    lifespan: "100+ yil",
    moisture_resistance: "Beton ichida yuqori korroziya himoyasi",
    fire_rating: "NG (Yonmaydi, 500°C gacha mustahkamlikni saqlaydi)",
    standard_sizes: ["Ø12mm x 11.7m", "Ø14mm x 11.7m", "Ø16mm x 11.7m", "Ø20mm x 11.7m"]
  },

  // 8. QURILISH — PROFIL TRUBA
  {
    name: "Po'lat Profil Truba (40x40, 60x40, 80x80, 100x100mm)",
    slug: "polat-profil-truba",
    original_name: "Труба профильная стальная квадратная/прямоугольная",
    category_slug: "metall-materiallar",
    scope: "architecture",
    cover_image: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=600&auto=format&fit=crop&q=80",
    description: "Kvadrat va to'g'ri burchakli elektr payvandlangan po'lat quvurlar. Metall karkaslar, fermalar, kanopi va tom konstruksiyalari uchun.",
    dimensions_info: "Kesimi: 40x40, 60x40, 80x80, 100x100, 120x120 mm. Uzunligi: 6m va 12m",
    thicknesses: "Devor qalinligi: 1.5mm, 2.0mm, 3.0mm, 4.0mm, 5.0mm",
    composition: "Konstruktsion po'lat St3sp / St08ps",
    usage_area: "Tom fermalari, naveslar, fasad podkonstruksiyalari, zinapoyalar, panjaralar",
    pros: "Yengil vazn bilan yuqori bukilish qarshiligi, montaj va payvandlash qulayligi",
    cons: "Ichki bo'shlig'i korroziyaga moyil (qopqoq bilan yopilishi yoki bo'yalishi kerak)",
    approx_price: "8 800 000 - 10 200 000 UZS / tonna",
    uzb_market_availability: "O'zbekiston metall bozorlarida to'liq assortimentda mavjud",
    architect_notes: "Katta oraliqli naveslar loyihalashda bukilish deformatsiyasini hisoblang. Bo'yashdan oldin gruntovka GF-021 bilan kamida 2 qatlam qoplanishi shart.",
    standards_info: "GOST 8639-82, GOST 8645-68",
    lifespan: "50+ yil",
    moisture_resistance: "Bo'yoq yoki ruxlanganda yuqori",
    fire_rating: "NG (Yonmaydi)",
    standard_sizes: ["40x40x2mm", "60x40x2.5mm", "80x80x3mm", "100x100x4mm"]
  },

  // 9. QURILISH — METALLOCHEREPITSA
  {
    name: "Metallocherepitsa Monterrey (0.45mm / 0.50mm)",
    slug: "metallocherepitsa-monterrey",
    original_name: "Металлочерепица Монтеррей 0.45/0.50 мм",
    category_slug: "tom-materiallari",
    scope: "architecture",
    cover_image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&auto=format&fit=crop&q=80",
    description: "Sifatli ruxlangan va polimer qoplangan po'lat tunukadan yasalgan Monterrey to'lqinli eng ommabop yengil tom yopish materiali.",
    dimensions_info: "Foydali eni: 1100 mm, to'liq eni: 1180 mm. Qadam: 350 mm. Uzunlik buyurtmaga (0.5 - 6.5 m)",
    thicknesses: "0.45 mm, 0.50 mm (standart kafolatli qalinlik)",
    composition: "Ruxlangan sovuq prokat po'lat list (Zn 140-275 g/m²), passivatsiya, gruntovka, poliester (25 mkm)",
    usage_area: "Xususiy kottejlar tomi, ko'p xonadonli turar-joy qiya tomlari, ma'muriy binolar",
    pros: "Yengil vazn (4.5 kg/m²), tez va oson montaj, chiroyli tashqi ko'rinish, 20+ xil RAL ranglari",
    cons: "Yomg'ir paytida shovqinli (tagiga tovush izolyatsiyasi zarur), montajda kesilgan qirralari zanglashi mumkin",
    approx_price: "55 000 - 85 000 UZS / m²",
    uzb_market_availability: "O'zbekistonning barcha tom markazlarida 1 kunda buyurtma bilan kesib beriladi",
    architect_notes: "Tom qiyaligi kamida 14° bo'lishi kerak. Shamol va qor yuklarini inobatga olgan holda tom tagiga gidroizolyatsion membrana va qadam 350mm obreshetka loyihalanadi.",
    standards_info: "GOST R 58153-2018, KMK 2.01.07-97",
    lifespan: "30-50 yil",
    moisture_resistance: "100% suv o'tkazmaydi",
    fire_rating: "G1 (Olov tarqatmaydi)",
    standard_sizes: ["Eni 1.18m x Buyurtma uzunlik", "To'lqin qadami 350mm"]
  },

  // 10. QURILISH — PROFNASTIL PK-35
  {
    name: "Profnastil PK-35 / PS-20 (Tom va To'siq)",
    slug: "profnastil-pk-35-ps-20",
    original_name: "Профнастил кровельный ПК-35 / стеновой ПС-20",
    category_slug: "tom-materiallari",
    scope: "architecture",
    cover_image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=600&auto=format&fit=crop&q=80",
    description: "Trapetsiya shaklida profillangan ruxlangan po'lat tunuka. Sanoat binolari tomi, angarlar va mustahkam himoya devorlari uchun.",
    dimensions_info: "PK-35: Eni 1060mm (foydali 1000mm). PS-20: Eni 1150mm (foydali 1100mm)",
    thicknesses: "0.45 mm, 0.50 mm, 0.70 mm",
    composition: "Issiq ruxlangan po'lat, polimer bo'yoq qoplamasi",
    usage_area: "Sanoat omborxonalari tomi, naveslar, to'siq zaborlar, fasad qoplamalari",
    pros: "Yuqori yuk ko'tarish qobiliyati (qovurg'ali profili evaziga), arzon va chidamli",
    cons: "Estetik jihatdan oddiy, sanoat uslubiga ko'proq mos",
    approx_price: "48 000 - 75 000 UZS / m²",
    uzb_market_availability: "O'zbekiston bo'ylab to'liq mavjud",
    architect_notes: "Kichik qiyalikli tomlarda (8-12°) PK-35 profili ishlatilishi qor va suv bosimiga bardosh berish uchun qat'iy tavsiya etiladi.",
    standards_info: "GOST 24045-2016",
    lifespan: "30-40 yil",
    moisture_resistance: "100% suv o'tkazmaydi",
    fire_rating: "NG (Yonmaydi)",
    standard_sizes: ["PK-35 (balandligi 35mm)", "PS-20 (balandligi 20mm)"]
  },

  // 11. QURILISH — TABIIY TRAVERTIN
  {
    name: "Tabiiy Travertin (1-sort Eron va Nurota)",
    slug: "tabiiy-travertin-1-sort",
    original_name: "Травертин натуральный плитка",
    category_slug: "tosh-materiallari",
    scope: "both",
    cover_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
    description: "Tabiiy ohaktoshli g'ovak tosh plita. Sharqona va zamonaviy arxitekturada fasad va ichki bezakning eng nufuzli materiali.",
    dimensions_info: "Plitalar: 300x600 mm, 400x800 mm, 600x1200 mm. Sleblar: 2400x1400 mm",
    thicknesses: "18 mm, 20 mm, 30 mm",
    composition: "Tabiiy kaltsiy karbonat (CaCO3) cho'kindi tog' jinsi",
    usage_area: "Bino fasadlari, ventfasad, devorlar, ustunlar qoplamasi, kaminlar, zal va vestibyul",
    pros: "Betakror tabiiy go'zallik, sovuqqa va quyosh nuriga chidamli, yengil ishlov beriladi",
    cons: "G'ovakli bo'lgani uchun fasadga o'rnatilgach gidrofobizator (himoya laki) surtish shart",
    approx_price: "180 000 - 450 000 UZS / m²",
    uzb_market_availability: "O'zbekistonda juda keng tarqalgan (Nurota konlari va Eron importi)",
    architect_notes: "Balandligi 3 qavatdan oshgan binolarda fasadga travertin o'rnatishda faqat yelim emas, balki zanglamas metall anker-klyammerlar bilan mahkamlash SHNQ talabidir.",
    standards_info: "GOST 9479-2011, SHNQ 2.01.03-96",
    lifespan: "80+ yil",
    moisture_resistance: "Himoya qoplami bilan yuqori",
    fire_rating: "NG (Yonmaydi, KM0)",
    standard_sizes: ["300x600x20mm", "400x800x20mm", "Sleb 2400x1200mm"]
  },

  // 12. QURILISH — BIKROST GIDROIZOLYATSIYA
  {
    name: "Technonicol Bikrost HPP / TKP (Gidroizolyatsiya)",
    slug: "bikrost-hpp-tkp-gidroizolyatsiya",
    original_name: "Бикрост ХПП / ТКП наплавляемая гидроизоляция",
    category_slug: "gidroizolyatsiya",
    manufacturer_slug: "technonicol",
    scope: "architecture",
    cover_image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80",
    description: "Gaz gorelkasi yordamida eritib yopishtiriladigan rulonli bitumli tom va poydevor gidroizolyatsiya materiali.",
    dimensions_info: "Rulon: 10m x 1m. Maydoni: 10 m². Og'irligi: 3.5 - 4.5 kg/m²",
    thicknesses: "3.0 mm - 4.2 mm",
    composition: "Shisha xolst (H) yoki shisha mato (T) asosi, oksidланган bitum qatlamlari, polimer plyonka / slanets kukun",
    usage_area: "Yassi tomlar (ploskaya krovlya), poydevorlar, podvallar, gidrotexnik inshootlar",
    pros: "Ishonchli va sinovdan o'tgan texnologiya, arzon tannarx, 100% suv o'tkazmaslik",
    cons: "Olov bilan ishlashda xavfsizlik choralari shart, sovuqda egiluvchanligi pasayadi",
    approx_price: "18 000 - 28 000 UZS / m²",
    uzb_market_availability: "O'zbekistonda eng keng tarqalgan rulonli gidroizolyatsiya",
    architect_notes: "Yassi tomlarda odatda 2 qatlam qo'llaniladi: pastki qatlam Bikrost HPP (plyonka bilan), ustki qatlam Bikrost TKP (quyosh nurlaridan himoya qiluvchi tosh kukunli).",
    standards_info: "GOST 30547-97",
    lifespan: "15-20 yil",
    moisture_resistance: "Mutlaq 100% suv o'tkazmaydi (bosim 0.2 MPa)",
    fire_rating: "G4 (Yonuvchan bitum)",
    standard_sizes: ["Rulon 10x1m (10 m²)", "Rulon 15x1m (15 m²)"]
  },

  // 13. QURILISH — XPS CARBON ECO (PENOPLEKS)
  {
    name: "Technonicol XPS Carbon Eco (Penopleks 50mm)",
    slug: "technonicol-xps-carbon-eco",
    original_name: "Экструдированный пенополистирол XPS Carbon Eco",
    category_slug: "issiqlik-izolyatsiyasi",
    manufacturer_slug: "technonicol",
    scope: "architecture",
    cover_image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600&auto=format&fit=crop&q=80",
    description: "Uglerod nano-zarrachalari bilan mustahkamlangan ekstrudirlangan penopolistirol plitalar. Poydevor, sokol va pol osti uchun eng mustahkam issiqlik izolyatsiyasi.",
    dimensions_info: "1180 x 580 mm, L-simon qirrali (teplo-zamok)",
    thicknesses: "30 mm, 50 mm, 100 mm",
    composition: "Ekstruziya qilingan polistirol, nano-uglerod qo'shimchalari",
    usage_area: "Poydevorlar, beton pol osti, ko'milgan podval devorlari, teskari yassi tomlar",
    pros: "Suvni mutlaqo shimamaydi (0.2%), juda yuqori siqilish mustahkamligi (250-400 kPa), past issiqlik o'tkazuvchanlik (0.029 Vt/m·K)",
    cons: "Ultrabinafsha quyosh nuridan himoya qilinishi shart, shamollatiluvchi fasad ichiga tavsiya etilmaydi",
    approx_price: "45 000 - 68 000 UZS / m² (50mm qalinlik)",
    uzb_market_availability: "O'zbekistonda barcha bozorlarda to'liq mavjud",
    architect_notes: "Tuproq ostidagi poydevorlarda va iliq pol ostiga XPS eng to'g'ri tanlovdir, chunki mineral vata namlik ta'sirida o'z xususiyatini yo'qotadi, XPS esa yo'qotmaydi.",
    standards_info: "GOST 32310-2012, KMK 2.01.04-18",
    lifespan: "50+ yil",
    moisture_resistance: "Mutlaq suv o'tkazmaydi (0.2%)",
    fire_rating: "G3 / G4",
    standard_sizes: ["1180x580x50mm", "1180x580x30mm", "1180x580x100mm"]
  },

  // 14. INTERYER — KVARTS-VINIL SPC LAMINAT
  {
    name: "Kvars-vinil SPC Laminat 4mm + IXPE Taglikli",
    slug: "kvars-vinil-spc-laminat-4mm",
    original_name: "Кварц-винил SPC ламинат 4 мм с подложкой",
    category_slug: "pol-materiallari",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600&auto=format&fit=crop&q=80",
    description: "Ohaktosh toshi va PVX dan iborat monolit tosh-polimer pol qoplamasi. 100% suv o'tkazmaydi va geometrik barqaror.",
    dimensions_info: "1220 x 180 mm, 1220 x 150 mm plitalar",
    thicknesses: "4.0 mm, 4.5 mm, 5.0 mm (+1.0 mm o'rnatilgan IXPE akustik taglik)",
    composition: "70-75% maydalangan tabiiy ohaktosh (CaCO3), 20-25% toza PVX, UV himoya qatlami (0.3-0.5 mm)",
    usage_area: "Oshxona, dahliz, mehmonxona, bolalar xonasi, ofislar, kottejlar",
    pros: "100% suvga chidamli (namlikda shishmaydi), iliq pol bilan 100% mos (28°C gacha), sinf 33/34 tirnalishga chidamli",
    cons: "Asos (styajka) o'ta tekis bo'lishi shart (farq 2 metrda 2mm dan oshmasligi kerak)",
    approx_price: "160 000 - 290 000 UZS / m²",
    uzb_market_availability: "O'zbekistonda mavjud (Tarkett, Alpine Floor, Moduleo, Xitoy va Rossiya brendlari)",
    architect_notes: "Katta xonalarda (80 m² dan yuqori) eshik tagida kompensatsion choklar qoldirilishi va devor chetlarida 8-10 mm oraliq saqlanishi shart.",
    standards_info: "EN 16511, GOST 32304-2013",
    lifespan: "25+ yil",
    moisture_resistance: "Mutlaq 100% suvga chidamli",
    fire_rating: "KM2 (Kam tutunli, olov tarqatmaydi)",
    standard_sizes: ["1220x180x4mm", "1220x150x5mm"]
  },

  // 15. INTERYER — KERAMOGRANIT 600x1200MM
  {
    name: "Keramogranit 600x1200mm (Katta Format Marmar)",
    slug: "keramogranit-600x1200mm",
    original_name: "Керамогранит крупноформатный 60x120 см ректификат",
    category_slug: "pol-materiallari",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80",
    description: "Rektifikatsiyalangan katta formatli sirlangan keramogranit. Premium interyer pol va devorlarida choksiz hashamatli marmar effekti.",
    dimensions_info: "600 x 1200 mm (aniq kalibrlangan, rektifikat)",
    thicknesses: "9.0 mm, 10.0 mm, 11.0 mm",
    composition: "Oq gil, kvars qumi, dala shpati, 1250°C da 500 bar bosimda pishirilgan",
    usage_area: "Zal pollari, hammom devor va pollari, oshxona, dahliz, savdo markazlari zallari",
    pros: "Minimal chok (1-1.5mm), tirnalishga mutlaq chidamli (PEI IV/V), suv shimishi < 0.05%, iliq pol uchun eng yaxshi issiqlik o'tkazgich",
    cons: "Og'ir va mo'rt (kesishda professional plitkarez kerak), C2TE S1 toifadagi elastik yelim talab qiladi",
    approx_price: "150 000 - 450 000 UZS / m²",
    uzb_market_availability: "O'zbekistonning barcha koshin markazlarida juda katta assortimentda mavjud",
    architect_notes: "Katta format plitalarni yotqizishda SVP (tizim tekislash) tizimidan foydalanish va orqa tomoniga ham, polga ham ikki tomonlama kley surtish (dual-spread) shart.",
    standards_info: "ISO 13006 / EN 14411 (Group BIa), GOST 6787-2001",
    lifespan: "50+ yil",
    moisture_resistance: "Mutlaq suv shimmaslik (E <= 0.05%)",
    fire_rating: "NG (Yonmaydi, KM0)",
    standard_sizes: ["600x1200x9mm", "800x800x10mm"]
  },

  // 16. INTERYER — KLASSIK LAMINAT 33-SINF
  {
    name: "Klassik Laminat 33-sinf 8mm (V-faskali Eman)",
    slug: "klassik-laminat-33-sinf-8mm",
    original_name: "Ламинат 33 класс 8 мм с фаской",
    category_slug: "pol-materiallari",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    description: "Yuqori zichlikdagi HDF plita asosidagi yog'och teksturali qulflanuvchi laminat. Yotoqxona va mehmonxonalar uchun iliq shinam pol.",
    dimensions_info: "1380 x 193 mm doskalar, 4 tomonlama 4V mikro-faska",
    thicknesses: "8.0 mm, 10.0 mm, 12.0 mm",
    composition: "HDF zichligi 880-920 kg/m³, dekorativ qatlam, korundli overlay himoya qatlami",
    usage_area: "Yotoqxona, bolalar xonasi, mehmonxona, kabinet",
    pros: "Oyoq ostida iliq va tabiiy yog'och hissi, arzon narx, oson va tez bosiladigan click-qulf",
    cons: "Suv toshqiniga chidamsiz (uproq suv to'kilsa chetlari bo'rtishi mumkin), tagiga podlozhka shart",
    approx_price: "95 000 - 180 000 UZS / m²",
    uzb_market_availability: "O'zbekistonda to'liq mavjud",
    architect_notes: "Iliq pol ustiga o'rnatilganda harorat 27°C dan oshmasligi va maxsus teshikli laminat podlozhkasi ishlatilishi zarur.",
    standards_info: "EN 13329 (Class 33 / AC5), GOST 32304-2013",
    lifespan: "15-20 yil",
    moisture_resistance: "O'rtacha",
    fire_rating: "KM3 / B2",
    standard_sizes: ["1380x193x8mm", "1380x193x10mm"]
  },

  // 17. INTERYER — CHO'ZILUVCHAN PATALOK
  {
    name: "Cho'ziluvchan Patalok (Matoviy PVX + Svetovye Liniyali)",
    slug: "choziluvchan-patalok-matoviy",
    original_name: "Натяжной потолок матовый со световыми линиями",
    category_slug: "devor-patalok-qoplamalari",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=80",
    description: "Choksiz matoviy PVX yoki matoli cho'ziluvchan shift. Ichiga zamonaviy magnit treklar va yashirin svetovye liniyalar o'rnatish imkoniyati bilan.",
    dimensions_info: "Eni 3.2 m dan 5.5 m gacha (choksiz yopiladi)",
    thicknesses: "0.18 - 0.25 mm (plenka qalinligi)",
    composition: "Plastifikatsiyalangan polivinilxlorid (PVX) yoki poliuretan shimdirilgan mato",
    usage_area: "Kvartiralar, ofislar, hammom va oshxonalar shifti",
    pros: "Ideal silliq sirt, 1 kunda changsiz montaj, tepadan suv toshganda 100 litrgacha suvni ushlab qoladi",
    cons: "O'tkir jism tegsa yirtilishi mumkin, issiq gaz pushkasi bilan tortiladi",
    approx_price: "60 000 - 140 000 UZS / m²",
    uzb_market_availability: "O'zbekistonning barcha shaharlarida 1 kunda montaj bilan mavjud",
    architect_notes: "Zamonaviy dizaynda devor bilan shift tutashgan joyda rezina plintus o'rniga EuroKraab soya choki (shadow gap profil) qo'llash tavsiya etiladi.",
    standards_info: "EN 14716, SanPiN RUz",
    lifespan: "20+ yil",
    moisture_resistance: "100% suv o'tkazmaydi",
    fire_rating: "KM2 / KM3",
    standard_sizes: ["Eni 3.2m", "Eni 5.0m choksiz"]
  },

  // 18. INTERYER — GIPSOKARTON OSMA PATALOK
  {
    name: "Gipsokarton Osma Patalok (Soya Chokli Kraab Profilli)",
    slug: "gipsokarton-osma-patalok-kraab",
    original_name: "Подвесной потолок из ГКЛ с теневым профилем Kraab",
    category_slug: "devor-patalok-qoplamalari",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    description: "Knauf gipsokartoni va alyuminiy Kraab/EuroKraab profillari asosidagi minimalist osma shift tizimi. Devordan 6mm soya choki qoldiradi.",
    dimensions_info: "Plitalar 1200x2500x9.5mm / 12.5mm, metall karkas PP 60x27",
    thicknesses: "Bir qatlamli 9.5mm yoki ikki qatlamli 2 x 9.5mm",
    composition: "Gipsli o'zak, karton qoplama, ruxlangan karkas profili, alyuminiy soya profili",
    usage_area: "Zamonaviy minimalist kvartiralar, kottejlar, studiyalar, yashirin kornizli zonalar",
    pros: "Monolitik mustahkamlik, devor va shift yorilishlariga barqaror (mustaqil osilgan karkas), chiroyli 6mm qora soya choki",
    cons: "Balandlikdan kamida 6-10 sm oladi, suvoq va bo'yash ishlari talab qiladi",
    approx_price: "90 000 - 160 000 UZS / m²",
    uzb_market_availability: "O'zbekistonda Knauf va Kraab tizimlari to'liq mavjud",
    architect_notes: "Choklar yorilmasligi uchun qog'oz lenta (Knauf Kurt) va Fugen / Uniflott shpaklyovkasi bilan armaturalanishi shart.",
    standards_info: "GOST 32614-2012, KMK 2.08.01-97",
    lifespan: "30+ yil",
    moisture_resistance: "GKLV bilan yuqori",
    fire_rating: "KM1 / G1",
    standard_sizes: ["GKL 1200x2500x9.5mm", "EuroKraab profil 2.0m"]
  },

  // 19. INTERYER — GRILYATO PANJARALI PATALOK
  {
    name: "Grilyato Alyuminiy Panjarali Patalok (100x100mm)",
    slug: "grilyato-alyuminiy-panjarali-patalok",
    original_name: "Потолок Грильято ячеистый алюминиевый 100x100",
    category_slug: "devor-patalok-qoplamalari",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80",
    description: "U-shaklidagi alyuminiy chiziqlardan tashkil topgan panjarali osma shift tizimi. Shamollatish va yong'in o'chirish tizimlarini yashirmaydi.",
    dimensions_info: "Katakcha o'lchamlari: 50x50, 75x75, 100x100, 150x150 mm. Profil balandligi: 30-40 mm",
    thicknesses: "Alyuminiy qalinligi: 0.32 - 0.45 mm",
    composition: "Korroziyaga chidamli emallangan alyuminiy lenta",
    usage_area: "Savdo markazlari, aeroportlar, avtosalonlar, restoranlar, sport zallari, biznes markazlar",
    pros: "100% yong'inga xavfsiz (NG), ventilyatsiya va tutun chiqarishga to'sqinlik qilmaydi, yengil vazn",
    cons: "Shift orqasidagi qora beton va kommunikatsiyalar qisman ko'rinadi (ularni oldindan qora bo'yash kerak)",
    approx_price: "85 000 - 150 000 UZS / m²",
    uzb_market_availability: "O'zbekistonda mavjud (Akfa va import brendlar)",
    architect_notes: "Grilyato o'rnatishdan oldin uning ustidagi barcha truba, kabel va havo quvurlari mat qora rangga bo'yalishi kerak, shunda shift estetik ko'rinadi.",
    standards_info: "KMK 2.01.02-04, GOST R 58153-2018",
    lifespan: "30+ yil",
    moisture_resistance: "100% (alyuminiy zanglamaydi)",
    fire_rating: "NG (Yonmaydi, KM0)",
    standard_sizes: ["100x100mm katak", "50x50mm katak"]
  },

  // 20. INTERYER — ARMSTRONG AKUSTIK PATALOK
  {
    name: "Armstrong Akustik Osma Patalok (600x600 Plitali)",
    slug: "armstrong-akustik-osma-patalok",
    original_name: "Потолок подвесной Armstrong 600x600 минеральное волокно",
    category_slug: "devor-patalok-qoplamalari",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80",
    description: "Mineral tola asosidagi kassetali osma shift tizimi. Ofislar, maktablar va shifoxonalarda shovqinni yutish va kommunikatsiyalarga oson kirish uchun.",
    dimensions_info: "Plitalar: 600 x 600 mm, T-24 / T-15 osma metall karkas tizimi",
    thicknesses: "12 mm, 15 mm, 19 mm",
    composition: "Mineral paxta tolalari, perlit, loy, kraxmal bog'lovchi",
    usage_area: "Ofislar, konferens-zallar, ta'lim muassasalari, klinikalar",
    pros: "Yuqori tovush yutish (akustika koeffitsiyenti NRC 0.6-0.9), har qanday plitani olib sim va ventilyatsiyani ta'mirlash oson",
    cons: "Namlik to'g'ridan-to'g'ri tegsa plitalar egilib qoladi, dizayni standart ofis uslubida",
    approx_price: "45 000 - 95 000 UZS / m²",
    uzb_market_availability: "O'zbekistonda juda keng tarqalgan",
    architect_notes: "Shifoxona va laboratoriyalar uchun antibakterial qoplamali 'Armstrong Bioguard' plitalari tanlanishi tavsiya etiladi.",
    standards_info: "EN 13964, GOST 30244-94",
    lifespan: "20+ yil",
    moisture_resistance: "RH 90-95% gacha",
    fire_rating: "KM1 (Kam xavfli)",
    standard_sizes: ["600x600x12mm", "600x600x15mm"]
  },

  // 21. INTERYER — KNAUF GKL STANDART 12.5MM
  {
    name: "Knauf GKL Standart Gipsokarton 12.5mm",
    slug: "knauf-gkl-standart-12-5mm",
    original_name: "КНАУФ-лист ГСП-А (ГКЛ) 2500х1200х12.5 мм",
    category_slug: "gipsokarton-quruq",
    manufacturer_slug: "knauf",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80",
    description: "Klassik kulrang gipsokarton plitasi. Normal namlikdagi xonalarda devorlarni qoplash va to'siqlar qurish uchun asosiy quruq qurilish materiali.",
    dimensions_info: "1200 x 2500 mm (maydoni 3.0 m²)",
    thicknesses: "12.5 mm (devorlar uchun), 9.5 mm (shift uchun)",
    composition: "Tabiiy gips yadrosi, ikki tomonlama mustahkam qurilish kartoni",
    usage_area: "Yashash xonalari devorlari, koridorlar, ofislar, shiftlar",
    pros: "Ideal tekis yuzaga ega, ekologik sof, tez montaj qilinadi, ichiga kabel va quvurlarni yashirish oson",
    cons: "Suvga chidamsiz (nam joylarda faqat GKLV kerak), og'ir mebel osishda karkasga profil qo'yish shart",
    approx_price: "42 000 - 52 000 UZS / list (3 m²)",
    uzb_market_availability: "O'zbekistonda (Knauf Buxoro zavodi) to'liq ishlab chiqariladi va barcha bozorlarda bor",
    architect_notes: "Xonalararo to'siq devorlarda kamida 2 qatlam gipsokarton (2 x 12.5mm) va o'rtasida 50mm mineral vata loyihalanishi tovush izolyatsiyasini 48 dB ga yetkazadi.",
    standards_info: "GOST 32614-2012, KMK 2.08.01-97",
    lifespan: "30+ yil",
    moisture_resistance: "Oddiy (namlik < 70%)",
    fire_rating: "G1 / KM2",
    standard_sizes: ["1200x2500x12.5mm", "1200x2500x9.5mm"]
  },

  // 22. INTERYER — KNAUF GKLV NAMGA CHIDAMLI (YASHIL)
  {
    name: "Knauf GKLV Namlikka Chidamli Gipsokarton (Yashil)",
    slug: "knauf-gklv-namlikka-chidamli",
    original_name: "КНАУФ-лист влагостойкий ГСП-Н2 (ГКЛВ) 12.5 мм",
    category_slug: "gipsokarton-quruq",
    manufacturer_slug: "knauf",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
    description: "Yashil rangli gidrofob qo'shimchali gipsokarton. Hammom, sanuzel, oshxona va namligi yuqori bo'lgan xonalar uchun.",
    dimensions_info: "1200 x 2500 mm (maydoni 3.0 m²)",
    thicknesses: "12.5 mm",
    composition: "Gidrofob va zamburug'ga qarshi (antiseptik) qo'shimchali gips, maxsus ishlov berilgan yashil karton",
    usage_area: "Hammomlar, dush xonalari, oshxonalar, kafel va plitka osti devorlari",
    pros: "Suv shimishi 10% dan kam, mog'or va zamburug' hosil bo'lmaydi, ustidan to'g'ridan-to'g'ri kafel yopishtirish mumkin",
    cons: "Oddiy GKL dan biroz qimmatroq",
    approx_price: "54 000 - 65 000 UZS / list (3 m²)",
    uzb_market_availability: "O'zbekistonda mavjud (Knauf)",
    architect_notes: "Plitka yopishtirishdan oldin GKLV yuzasi kamida 2 qatlam gidroizolyatsion polimer mastika (Knauf Flahendicht) va burchaklarga gidroizolyatsion lenta bilan ishlanishi shart.",
    standards_info: "GOST 32614-2012, KMK 2.04.01-98",
    lifespan: "30+ yil",
    moisture_resistance: "Yuqori (suv shimishi < 10%)",
    fire_rating: "G1 / KM2",
    standard_sizes: ["1200x2500x12.5mm"]
  },

  // 23. INTERYER — KNAUF METALL KARKAS PROFILLARI
  {
    name: "Knauf Metall Karkas Profillari (PS, PN, PP 0.6mm)",
    slug: "knauf-metall-karkas-profillari",
    original_name: "Профиль металлический KNAUF 0.6 мм оцинкованный",
    category_slug: "gipsokarton-quruq",
    manufacturer_slug: "knauf",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80",
    description: "Sovuq prokat usulida ruxlangan po'lat lentadan tayyorlangan yupqa devorli karkas profillari. Gipsokarton konstruksiyalarining suyagi.",
    dimensions_info: "PP 60x27 (shift), PPN 28x27 (yo'naltiruvchi), PS 50/75/100 (stoika), PN 50/75/100 (napravlyayushchiy). Uzunligi: 3m va 4m",
    thicknesses: "0.60 mm (haqiqiy Knauf standarti)",
    composition: "Ruxlangan korroziyaga chidamli po'lat list (Zn 140 g/m²)",
    usage_area: "Gipsokarton to'siq devorlari, qoplamalar va osma shift karkaslari",
    pros: "0.6mm qalinlik shuruplarning aylanib ketmasligini ta'minlaydi, korroziyaga chidamli, aniq geometriya",
    cons: "Bozorda 0.35-0.45mm qalbaki yupqa profillar ko'p, faqat 0.6mm sertifikatlisi tanlanishi shart",
    approx_price: "18 000 - 38 000 UZS / dona (3 metr)",
    uzb_market_availability: "O'zbekistonda Knauf zavodidan to'liq mavjud",
    architect_notes: "Devor balandligi 3 metrdan oshganda PS 75 yoki PS 100 profillari 400 mm qadam bilan o'rnatilishi zarur.",
    standards_info: "GOST 11474-76, TU 1121-012-04001508-2011",
    lifespan: "50+ yil",
    moisture_resistance: "Yuqori ruxlangan",
    fire_rating: "NG (Yonmaydi)",
    standard_sizes: ["PP 60x27x3000mm", "PS 75x50x3000mm", "PN 75x40x3000mm"]
  },

  // 24. INTERYER — KNAUF ROTBAND VA SATENGIPS
  {
    name: "Knauf Rotband Gipsli Suvoq va Satengips Shpaklyovka",
    slug: "knauf-rotband-satengips",
    original_name: "Штукатурка гипсовая КНАУФ-Ротбанд и Сатенгипс",
    category_slug: "tekislash-qorishmalar",
    manufacturer_slug: "knauf",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80",
    description: "Polimer qo'shimchali universal gips suvoq qorishmasi va bo'yash ostiga oyna kabi silliq saten pardoz shpaklyovkasi.",
    dimensions_info: "Qopda 25 kg va 30 kg kukun aralashmasi",
    thicknesses: "Rotband qatlami: 5 mm dan 50 mm gacha. Satengips: 0.5 mm dan 2 mm gacha",
    composition: "Tabiiy gips bog'lovchi, yengil to'ldiruvchi perlit, polimer yopishqoq moddalar",
    usage_area: "G'isht, beton, gazobeton devorlarini tekislash va bo'yash ostiga pardozlash",
    pros: "Yorilmaydi (perlitli), ekologik qulay mikroiqlim yaratadi (namlikni o'ziga olib chiqaradi), oq va silliq",
    cons: "Faqat ichki quruq ishlar uchun, tashqi fasadda erib ketadi",
    approx_price: "42 000 - 58 000 UZS / qop (30 kg)",
    uzb_market_availability: "O'zbekistonning barcha qurilish do'konlarida eng mashhur mahsulot",
    architect_notes: "Beton devor va orayopmalarga Rotband surtishdan oldin majburiy tartibda 'Betonokontakt' gruntovkasi surtilishi shart, aks holda gips betondan ko'chib tushadi.",
    standards_info: "GOST 31377-2008, GOST 31387-2008",
    lifespan: "40+ yil",
    moisture_resistance: "Oddiy xonalar uchun",
    fire_rating: "NG (Yonmaydi)",
    standard_sizes: ["Qop 30 kg", "Qop 25 kg"]
  },

  // 25. INTERYER — TIKKURILA EURO POWER 7 BO'YOQ
  {
    name: "Tikkurila Euro Power 7 (Yuviladigan Chuqur Mot Bo'yoq)",
    slug: "tikkurila-euro-power-7",
    original_name: "Краска моющаяся матовая Tikkurila Euro Power 7",
    category_slug: "boyoq-dekor",
    manufacturer_slug: "tikkurila",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80",
    description: "Yuqori darajada yuviladigan (10 000 marta cho'tkada yuvishga chidamli) akrilat asosidagi chuqur mat interyer devor bo'yog'i.",
    dimensions_info: "Idishlar: 0.9L, 2.7L, 9.0L paqir. Sarfi: 1 litr 10-12 m² ga (1 qatlam)",
    thicknesses: "2 qatlam mikron darajasidagi yupqa elastik plyonka",
    composition: "Suvli akril dispersiya, titan dioksidi (oq pigment), kalsiy karbonat, mumiya qo'shimchalar",
    usage_area: "Zallar, bolalar xonasi, dahliz, oshxona, kafelar va yuqori namlikdagi devorlar",
    pros: "Dog'larni yuvib tozalash oson, hidsiz va ekologik xavfsiz (bolalar xonasiga tavsiya etiladi), 20 000+ rangga kolerovka qilinadi",
    cons: "Devor yuzasi Q4 sifat darajasida (ideal tekis) tayyorlangan bo'lishi shart",
    approx_price: "320 000 - 950 000 UZS / paqir (9 litr)",
    uzb_market_availability: "O'zbekistonda rasmiy Tikkurila do'konlarida mavjud",
    architect_notes: "Spetsifikatsiyada RAL yoki NCS rang kodini aniq yozing. Bo'yashdan oldin Knauf Tiefengrund chuqur singuvchi gruntovka surtilsa bo'yoq sarfi 20% ga kamayadi.",
    standards_info: "ISO 11998 (1-toifa yuvilish), GOST 32491-2013",
    lifespan: "10-15 yil",
    moisture_resistance: "Yuqori yuviluvchanlik",
    fire_rating: "KM1 (Yong'inga xavfsiz)",
    standard_sizes: ["0.9L", "2.7L", "9.0L"]
  },

  // 26. INTERYER — YASHIRIN MONTAJ ESHIGI INVISIBLE
  {
    name: "Yashirin Montaj Eshigi (Invisible Doors Alyuminiy Romli)",
    slug: "yashirin-montaj-eshigi-invisible",
    original_name: "Двери скрытого монтажа Invisible под покраску",
    category_slug: "eshik-deraza",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    description: "Devor bilan bir tekislikda turuvchi, nalichniksiz, yashirin oshiq-moshiqlar bilan o'rnatiladigan va devor kabi bo'yaladigan eshik.",
    dimensions_info: "Standart: 2000x800mm, 2000x700mm. Shiftgacha baland: 2400-2800x800mm",
    thicknesses: "Polotno qalinligi: 40-50 mm",
    composition: "Anodlangan alyuminiy yashirin korobka, LVL brus karkas, namga chidamli MDF, polimer gruntovka",
    usage_area: "Zamonaviy minimalist interyerlar, devor panellari bilan yashiriladigan yotoqxona va sanuzellar",
    pros: "Nalichniksiz toza me'moriy chiziqlar, devor bilan bir xil bo'yoq yoki devor qog'ozi surtish imkoniyati",
    cons: "Gipsokarton va suvoq bosqichida rom montaj qilinishi kerak, kechiktirilsa o'rnatib bo'lmaydi",
    approx_price: "1 800 000 - 3 800 000 UZS / komplekt",
    uzb_market_availability: "O'zbekistonda mavjud (ProfilDoors, Invisible Doors Tashkent)",
    architect_notes: "Arxitektor chizmada ochilish yo'nalishini (Inside yoki Outside) qat'iy belgilashi kerak, chunki alyuminiy rom profili bunga qarab farq qiladi.",
    standards_info: "GOST 475-2016",
    lifespan: "25+ yil",
    moisture_resistance: "Gruntovka qilingan MDF namlikka chidamli",
    fire_rating: "G1 / KM2",
    standard_sizes: ["2000x800mm", "2100x800mm", "Shiftgacha 2700x800mm"]
  },

  // 27. INTERYER — ALYUMINIY TERMOROM DERAZALAR
  {
    name: "Alyuminiy Termoromli Derazalar (Akfa Thermo 78 / Engelberg)",
    slug: "alyuminiy-termorom-deraza-akfa",
    original_name: "Оконные системы термоалюминий Akfa Thermo 78",
    category_slug: "eshik-deraza",
    manufacturer_slug: "akfa",
    scope: "both",
    cover_image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
    description: "Poliamid termoko'prikli (termo-razriv) yuqori qattiqlikdagi alyuminiy profil tizimi. Katta panoramali derazalar va vitrajlar uchun.",
    dimensions_info: "Profil montaj kengligi: 65mm, 70mm, 78mm. Maksimal stvorka balandligi: 3.0 metr",
    thicknesses: "Alyuminiy devor qalinligi 1.8 - 2.0 mm",
    composition: "Alyuminiy qotishmasi AlMgSi 0.5, 34mm poliamid shisha tola mustahkamlangan termoko'prik",
    usage_area: "Katta vitrajlar, panoramali slayd eshiklar, fasadlar, zamonaviy villalar",
    pros: "Ulkan oynalarni (og'irligi 300 kg gacha) osongina ko'taradi, deyarli abadiy metall, nozik ingichka ramkalar",
    cons: "PVX plastik romlarga nisbatan 2.5 - 3 barobar qimmatroq",
    approx_price: "1 400 000 - 2 800 000 UZS / m²",
    uzb_market_availability: "O'zbekistonda mavjud (Akfa, Engelberg, Alumil, Schüco)",
    architect_notes: "Termoromlarda issiqlik o'tkazuvchanlik qarshiligi R=0.85 m²·°C/Vt ga yetadi, bu O'zbekistonning qattiq qishida ham kondensat oqmasligini kafolatlaydi.",
    standards_info: "GOST 21519-2003, KMK 2.01.04-18",
    lifespan: "50+ yil",
    moisture_resistance: "100% ob-havoga chidamli",
    fire_rating: "NG (Alyuminiy yonmaydi)",
    standard_sizes: ["Balandligi 3000mm gacha buyurtmaga"]
  },

  // 28. INTERYER — EGGER LDSP 18MM
  {
    name: "EGGER LDSP 18mm (Avstriya Mebel Plitalari)",
    slug: "egger-ldsp-18mm",
    original_name: "ЛДСП EGGER 18 мм структура древесины",
    category_slug: "oshxona-mebel",
    manufacturer_slug: "egger",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&auto=format&fit=crop&q=80",
    description: "Yevropa E1 ekologik standarti bo'yicha tayyorlangan premium laminatsiyalangan yog'och qirindili plita. O'ta mustahkam va chuqur sinhron yog'och poralariga ega.",
    dimensions_info: "2800 x 2070 mm (maydoni 5.796 m²)",
    thicknesses: "18.0 mm (asosiy), 16.0 mm, 25.0 mm",
    composition: "Katta fraksiyali toza yog'och qirindisi, termoaktiv melamin qatron qoplamasi, past formaldegid (E1/Carb2)",
    usage_area: "Oshxona korpuslari, garderob xonalari, mebellar, devor panellari",
    pros: "Formaldegid hidi yo'q (sog'liq uchun xavfsiz), shurupni a'lo darajada ushlaydi, yuzasi tirnalish va issiqqa chidamli",
    cons: "Ochiq qirralariga 1-2mm PVX kromka yopishtirilishi shart, aks holda namlik kirishi mumkin",
    approx_price: "680 000 - 850 000 UZS / list (5.8 m²)",
    uzb_market_availability: "O'zbekistonda rasmiy dilerlar orqali to'liq mavjud",
    architect_notes: "O'zbekistonda ko'p mebelchilar 16mm DSP ishlatadi, lekin arxitektura standartida mustahkamlik va oraliq egilmasligi uchun 18mm LDSP loyihalashtirilishi kerak.",
    standards_info: "EN 14322, EN 312, GOST 32289-2013",
    lifespan: "20+ yil",
    moisture_resistance: "Kromkasi PUR-kley bilan yopishtirilganda namga chidamli",
    fire_rating: "KM3 / B2",
    standard_sizes: ["2800x2070x18mm", "2800x2070x16mm"]
  },

  // 29. INTERYER — HPL KOMPAKT LAMINAT 12MM
  {
    name: "HPL Kompakt Laminat 12mm (Namga va Tirnalishga 100% Chidamli)",
    slug: "hpl-kompakt-laminat-12mm",
    original_name: "Компакт-ламинат HPL 12 мм монолитная плита",
    category_slug: "oshxona-mebel",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&auto=format&fit=crop&q=80",
    description: "Monolitik qattiq qatronli presslangan plita. Suvda mutlaqo erimaydigan va shishmaydigan, o'ta yupqa minimalist stol usti (stoleshnitsa) materiali.",
    dimensions_info: "4100 x 1300 mm, 3050 x 1300 mm",
    thicknesses: "12.0 mm (stoleshnitsa), 6-8 mm (fasad va to'siqlar)",
    composition: "Termoreaktiv qatronlar bilan to'yintirilgan sellyuloza qog'oz qatlamlari, 150°C va 10 MPa bosimda qotirilgan monolit",
    usage_area: "Oshxona stoleshnitsasi, orolcha (island), vanna stol usti, sanuzel to'siqlari, restoran stollari",
    pros: "Suvga 100% chidamli (haftalab suvda yotsa ham o'zgarmaydi), 12mm o'ta nafis zamonaviy qalinlik, issiq idishlarga bardoshli",
    cons: "O'ta qattiq (kesish uchun olmos disklar kerak), og'ir vazn",
    approx_price: "1 200 000 - 2 400 000 UZS / m²",
    uzb_market_availability: "O'zbekistonda mavjud (Egger Compact, Fundermax, Gentas)",
    architect_notes: "Kompakt laminat tagiga taglik (podlozhka) kerak emas. Tagiga osma moyka (podstolniy montaj) qilishga to'liq imkon beradi.",
    standards_info: "EN 438, ISO 4586",
    lifespan: "30+ yil",
    moisture_resistance: "Mutlaq 100% suv o'tkazmaydi",
    fire_rating: "B1 / KM1 (Qiyin yonuvchan)",
    standard_sizes: ["4100x1300x12mm", "3050x1300x12mm"]
  },

  // 30. INTERYER & QURILISH — CERESIT CM 11 PLUS
  {
    name: "Ceresit CM 11 Plus (Keramika Plitka Sement Yelimi)",
    slug: "ceresit-cm-11-plus",
    original_name: "Клей для плитки Ceresit CM 11 Plus",
    category_slug: "yelim-germetik",
    manufacturer_slug: "ceresit",
    scope: "both",
    cover_image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
    description: "Ichki va tashqi ishlarda keramik plitkalar va kichik formatli toshlarni devor va polga yopishtirish uchun standart tsementli kley.",
    dimensions_info: "Qog'oz qopda 25 kg",
    thicknesses: "Yelim qatlami qalinligi: 2 mm dan 10 mm gacha",
    composition: "Portlandsement, saralangan fraksiyali kvars qumi, modifikatsiyalovchi polimer qo'shimchalar",
    usage_area: "Hammom, oshxona, dahliz, ayvon devor va poliga kafel yopishtirish",
    pros: "Ishonchli sement asos, siljishga chidamli (plitka sirpanib tushmaydi), tejamkor narx",
    cons: "Faqat 40x40 sm gacha bo'lgan plitkalarga mos, iliq pol va katta formatga CM 17 kerak",
    approx_price: "36 000 - 45 000 UZS / qop (25 kg)",
    uzb_market_availability: "O'zbekistonning barcha bozorlarida mavjud (Ceresit Henkel)",
    architect_notes: "Format 50x50sm dan katta bo'lsa yoki iliq pol ustiga yotqizilsa, CM 11 o'rniga elastik CM 16 yoki CM 17 belgilanishi shart.",
    standards_info: "GOST 31357-2007, EN 12004 (Class C1T)",
    lifespan: "30+ yil",
    moisture_resistance: "Suvga chidamli",
    fire_rating: "NG (Yonmaydi)",
    standard_sizes: ["Qop 25 kg"]
  },

  // 31. INTERYER & QURILISH — CERESIT CM 17 SUPER FLEXIBLE
  {
    name: "Ceresit CM 17 Super Flexible (Katta Format Plitka Yelimi)",
    slug: "ceresit-cm-17-super-flexible",
    original_name: "Клей эластичный для керамогранита Ceresit CM 17 Super Flexible",
    category_slug: "yelim-germetik",
    manufacturer_slug: "ceresit",
    scope: "both",
    cover_image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600&auto=format&fit=crop&q=80",
    description: "O'ta elastik (S1 toifali) tolalar bilan mustahkamlangan tsementli kley. Katta format keramogranit (60x120), fasad va iliq pollar uchun eng kuchli yelim.",
    dimensions_info: "Qog'oz qopda 25 kg",
    thicknesses: "2 mm dan 10 mm gacha",
    composition: "Yuqori markali sement, polimer elastifikatorlar, mikrotolalar (Fibre Force texnologiyasi)",
    usage_area: "600x1200mm keramogranit, iliq pollar, bino tashqi fasadlari, basseynlar, gipsokartonga plitka yopishtirish",
    pros: "Harorat o'zgarishi va deformatsiyalarni zararsiz yutadi (S1 egiluvchanlik), ko'chib ketish xavfi 0%, suv va muzga mutlaq chidamli",
    cons: "Oddiy kleylarga qaraganda narxi yuqori",
    approx_price: "115 000 - 145 000 UZS / qop (25 kg)",
    uzb_market_availability: "O'zbekistonda rasmiy Ceresit do'konlarida mavjud",
    architect_notes: "Katta format (600x1200mm va undan katta) plitalar va fasadlar uchun loyihada faqat C2TE S1 sinfidagi elastik yelim belgilanishi SHNQ talabidir.",
    standards_info: "EN 12004 (Class C2TE S1), GOST R 56387-2018",
    lifespan: "50+ yil",
    moisture_resistance: "Mutlaq suv va muzga chidamli (F100)",
    fire_rating: "NG (Yonmaydi)",
    standard_sizes: ["Qop 25 kg"]
  },

  // 32. INTERYER & QURILISH — MONTAJ KO'PIGI SOUDAL
  {
    name: "Professional Poliuretan Montaj Ko'pigi (Soudal / Tytan 65)",
    slug: "montaj-kopigi-professional",
    original_name: "Монтажная пена профессиональная пистолетная",
    category_slug: "yelim-germetik",
    scope: "both",
    cover_image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80",
    description: "Pistolet yordamida sepiladigan yuqori unumdorlikdagi poliuretan montaj ko'pigi. Eshik, deraza va oraliq choklarni issiq va tovushdan to'liq germetiklaydi.",
    dimensions_info: "Ballon 850-1000 ml (chiqishi 65-70 litr tayyor ko'pik)",
    thicknesses: "Chok qalinligi 20 mm dan 80 mm gacha",
    composition: "Poliuretan prepolimer, izotsianat, suyultirilgan gaz aralashmasi",
    usage_area: "Deraza va eshik bloklarini devorga mahkamlash, quvurlar atrofini germetiklash, bo'shliqlarni to'ldirish",
    pros: "Past ikkilamchi kengayish (romlarni qiyshaytirib qo'ymaydi), ajoyib issiqlik va tovush izolyatsiyasi, tez qotadi",
    cons: "Ultrabinafsha quyosh nurida sarg'ayib uvalanadi (suvoq yoki namelik bilan yopilishi shart)",
    approx_price: "45 000 - 65 000 UZS / ballon",
    uzb_market_availability: "O'zbekistonning barcha bozorlarida mavjud (Soudal, Tytan, Penosil)",
    architect_notes: "Deraza montajida GOST talablariga binoan ko'pik tashqi tomondan bug' o'tkazuvchi lenta (PSUL), ichki tomondan esa bug' to'siq lenta bilan himoyalanishi shart.",
    standards_info: "GOST 30971-2012, EN 1366-4",
    lifespan: "25+ yil (quyoshdan yopilganda)",
    moisture_resistance: "Suv o'tkazmaydi",
    fire_rating: "B2 / B3",
    standard_sizes: ["Ballon 850ml", "Ballon 1000ml"]
  },

  // 33. INTERYER — MAGNITLI TREK 48V
  {
    name: "Magnitli Trek Yoritish Tizimi (Magnetic Track 48V)",
    slug: "magnitli-trek-yoritish-tizimi",
    original_name: "Магнитная трековая система 48В встраиваемая",
    category_slug: "elektr-yoritish",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=80",
    description: "Shiftga yashirin yoki ustma-ust o'rnatiladigan 48V past kuchlanishli magnitli rels tizimi. Chiroqlarni istalgan joyga qo'lda oson ko'chirish mumkin.",
    dimensions_info: "Shina uzunligi: 1m, 2m, 3m. Kesimi: 25x50mm, 35x50mm",
    thicknesses: "Shift ichiga kiruvchi chuqurlik: 40-50 mm",
    composition: "Ekstrudirlangan alyuminiy korpus, mis tok o'tkazuvchi shinalar, neodim magnitlar",
    usage_area: "Mehmonxona, oshxona, san'at galereyalari, zamonaviy ofis va do'konlar",
    pros: "Chiroqlarni asboblarsiz shunchaki qo'l bilan chiqarib o'rnini o'zgartirish mumkin, xavfsiz 48V kuchlanish, o'ta nafis premium dizayn",
    cons: "Tizim uchun 48V blok pitaniya talab etiladi, boshqa chiroqlarga qaraganda qimmatroq",
    approx_price: "120 000 - 280 000 UZS / metr (chiroqlar alohida)",
    uzb_market_availability: "O'zbekistonda barcha yoritish salonlarida mavjud",
    architect_notes: "Blok pitaniyani (transformator) shift orqasida qoldirmasdan, revizion lyuk yoki elektr shit ichiga o'rnatish lozim, shunda kuyganda oson almashtiriladi.",
    standards_info: "IEC 60598, GOST R MEK 60598-1-2011",
    lifespan: "50 000 soat (15+ yil)",
    moisture_resistance: "IP20 (quruq xonalar)",
    fire_rating: "KM1",
    standard_sizes: ["1 metr shina", "2 metr shina"]
  },

  // 34. INTERYER & QURILISH — MIS KABEL VVG-P ng-LS
  {
    name: "VVG-P ng-LS Mis Elektr Kabeli (3x2.5, 3x1.5)",
    slug: "vvg-p-ng-ls-mis-kabeli",
    original_name: "Кабель силовой медный ВВГ-П нг(А)-LS",
    category_slug: "elektr-yoritish",
    scope: "both",
    cover_image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    description: "Yonishni tarqatmaydigan va tutun chiqarmaydigan (ng-LS) yaxlit mis tolali yassi kuchlanish kabeli. Zamonaviy bino simlari standarti.",
    dimensions_info: "Kesimi: 3x1.5 mm² (yoritish), 3x2.5 mm² (rozetkalar), 3x4 mm² / 3x6 mm² (plitka va konditsioner)",
    thicknesses: "Yassi profil eni 10-12 mm",
    composition: "100% elektrotexnik toza mis (1-klass), olovbardosh kam tutunli PVX izolatsiya va qobiq",
    usage_area: "Kvartiralar va uylarning barcha yashirin elektr simlari, shchitlar, rozetka va yoritgichlar",
    pros: "Olovni tarqatmaydi (ng), tutun va zaharli gaz chiqarmaydi (LS), 100% xavfsiz sof mis",
    cons: "Aluminiy kabeldan qimmat, lekin xavfsizlik uchun faqat mis ruxsat etiladi",
    approx_price: "8 500 - 15 000 UZS / metr",
    uzb_market_availability: "O'zbekistonda mavjud (Uzkabel, Andijankabel, Hayat)",
    architect_notes: "Loyihada rozetkalar guruhi uchun qat'iy 3x2.5mm² kabel va 16A avtomat, yoritish uchun 3x1.5mm² va 10A avtomat belgilanishi shart.",
    standards_info: "GOST 31996-2012, PUE 7",
    lifespan: "30+ yil",
    moisture_resistance: "Izolyatsiyalangan",
    fire_rating: "ng-LS (Olov tarqatmaydi, kam tutunli)",
    standard_sizes: ["3x1.5mm² (100m buxta)", "3x2.5mm² (100m buxta)"]
  },

  // 35. INTERYER & QURILISH — PPR SUV QUVURLARI
  {
    name: "Polipropilen PPR Quvurlar va Fitinglar (Kalde / FV-Plast)",
    slug: "ppr-quvurlar-fitinglar-kalde",
    original_name: "Трубы полипропиленовые армированные стекловолокном PPR",
    category_slug: "santexnika-sanuzel",
    scope: "both",
    cover_image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80",
    description: "Shisha tola yoki alyuminiy folga bilan mustahkamlangan polipropilen quvurlar. Issiq va sovuq ichimlik suvi hamda isitish tizimlari uchun.",
    dimensions_info: "Tashqi diametri: Ø20mm, Ø25mm, Ø32mm, Ø40mm, Ø50mm. Uzunligi: 4 metr",
    thicknesses: "Devor qalinligi: PN20 (2.8-3.4mm), PN25 (3.5-5.4mm)",
    composition: "Tasodifiy kopolimer polipropilen (PPR 100 / PP-RCT), shisha tola mustahkamlovchi o'zak qatlam",
    usage_area: "Ichki suv ta'minoti, radiatorli isitish, xonadonlararo magistral trubalar",
    pros: "Zanglamaydi va tiqilib qolmaydi, payvandlanganda monolit bo'lib ulanadi (oqish xavfi 0%), 25 bar bosimga chidamli",
    cons: "Issiq suvda uzayadi (shisha tolali turlari tanlanishi kerak), payvandlashda tajribali usta shart",
    approx_price: "9 000 - 24 000 UZS / metr",
    uzb_market_availability: "O'zbekistonda juda keng tarqalgan (Kalde, Firat, Ekopen, FV-Plast)",
    architect_notes: "Issiq suv magistrallarida harorat kengayishini hisobga olgan holda U-shaklidagi kompensatorlar va devor ichiga gofra quvurda kiritish loyihalanadi.",
    standards_info: "GOST 32415-2013, DIN 8077/8078",
    lifespan: "50+ yil",
    moisture_resistance: "100% korroziyasiz",
    fire_rating: "G4",
    standard_sizes: ["Ø20mm x 4m", "Ø25mm x 4m", "Ø32mm x 4m"]
  },

  // 36. INTERYER — GEBERIT O'RNATISH TIZIMI
  {
    name: "Geberit Duofix O'rnatish Tizimi (Yashirin Installyatsiya)",
    slug: "geberit-duofix-installyatsiya",
    original_name: "Инсталляция для подвесного унитаза Geberit Duofix 112 см",
    category_slug: "santexnika-sanuzel",
    manufacturer_slug: "geberit",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
    description: "Devor ichiga yashiriladigan mustahkam po'lat karkas va choksiz quyilgan plastik bak. Osma unitazni polga tegmasdan havoda ushlab turadi.",
    dimensions_info: "Balandligi: 112 sm, Kengligi: 50 sm, Chuqurligi: 12 sm",
    thicknesses: "Po'lat ramka profili 40x40 mm, qalinligi 2.0 mm",
    composition: "Kukunli bo'yoq bilan qoplangan po'lat ramka, choksiz yaxlit polietilen (HDPE) bak",
    usage_area: "Zamonaviy hammomlar, mehmonxonalar, biznes markazlar va xonadonlar sanuzellari",
    pros: "400 kg gacha og'irlikni ko'taradi, pol toza va bo'sh qoladi (tozalash juda oson), shovqinsiz suv to'lishi",
    cons: "Devor ichiga o'rnatiladi, oldindan to'g'ri balandlikda rejalashtirish shart",
    approx_price: "1 900 000 - 3 200 000 UZS / komplekt",
    uzb_market_availability: "O'zbekistonda rasmiy dilerlarda doimiy mavjud (Geberit, Grohe, Tece)",
    architect_notes: "Arxitektor installyatsiyani montaj qilishda toza pol sathi (chistovoy pol) belgisini 1 metr balandlikdagi ramka chizig'iga aniq to'g'irlashi kerak.",
    standards_info: "EN 14055, DIN 1986-100",
    lifespan: "50+ yil (ehtiyot qismlari kafolati 25 yil)",
    moisture_resistance: "100% suvga chidamli yaxlit bak",
    fire_rating: "KM2",
    standard_sizes: ["112x50x12 sm (Delta / Sigma)"]
  }
];

// Database Schema Migrations and Seeding
async function initMaterialsTables(pool) {
  try {
    // 1. Create Categories Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS material_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        slug VARCHAR(150) UNIQUE NOT NULL,
        icon VARCHAR(50),
        scope VARCHAR(50) DEFAULT 'both',
        description TEXT,
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 2. Create Manufacturers Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS material_manufacturers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        slug VARCHAR(150) UNIQUE NOT NULL,
        logo TEXT,
        website TEXT,
        country VARCHAR(100),
        description TEXT,
        is_verified BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 3. Create Materials Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS materials (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        original_name VARCHAR(255),
        english_name VARCHAR(255),
        aliases TEXT[],
        category_id INT REFERENCES material_categories(id) ON DELETE SET NULL,
        subcategory_name VARCHAR(150),
        scope VARCHAR(50) DEFAULT 'both',
        manufacturer_id INT REFERENCES material_manufacturers(id) ON DELETE SET NULL,
        product_code VARCHAR(100),
        material_type VARCHAR(150),
        cover_image TEXT,
        description TEXT,
        dimensions_info TEXT,
        thicknesses TEXT,
        composition TEXT,
        usage_area TEXT,
        pros TEXT,
        cons TEXT,
        approx_price TEXT,
        uzb_market_availability TEXT,
        architect_notes TEXT,
        standards_info TEXT,
        lifespan VARCHAR(100),
        moisture_resistance VARCHAR(100),
        fire_rating VARCHAR(100),
        standard_sizes JSONB DEFAULT '[]'::jsonb,
        status VARCHAR(50) DEFAULT 'published',
        verification_status VARCHAR(50) DEFAULT 'verified',
        access_type VARCHAR(50) DEFAULT 'free',
        last_verified_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Column Migrations
    const colsToEnsure = [
      { name: "scope", type: "VARCHAR(50) DEFAULT 'both'" },
      { name: "thicknesses", type: "TEXT" },
      { name: "composition", type: "TEXT" },
      { name: "usage_area", type: "TEXT" },
      { name: "pros", type: "TEXT" },
      { name: "cons", type: "TEXT" },
      { name: "approx_price", type: "TEXT" },
      { name: "uzb_market_availability", type: "TEXT" },
      { name: "architect_notes", type: "TEXT" },
      { name: "standards_info", type: "TEXT" },
      { name: "lifespan", type: "VARCHAR(100)" },
      { name: "moisture_resistance", type: "VARCHAR(100)" },
      { name: "fire_rating", type: "VARCHAR(100)" },
      { name: "standard_sizes", type: "JSONB DEFAULT '[]'::jsonb" }
    ];

    for (const col of colsToEnsure) {
      await pool.query(`
        ALTER TABLE materials ADD COLUMN IF NOT EXISTS ${col.name} ${col.type};
      `).catch(e => console.warn(`Col migration ${col.name} warn:`, e.message));
    }

    await pool.query(`
      ALTER TABLE material_categories ADD COLUMN IF NOT EXISTS scope VARCHAR(50) DEFAULT 'both';
    `).catch(e => console.warn('Cat scope col migration warn:', e.message));

    // 4. Create Material Sources Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS material_sources (
        id SERIAL PRIMARY KEY,
        material_id INT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
        source_type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        url TEXT,
        publisher VARCHAR(255),
        document_name VARCHAR(255),
        document_version VARCHAR(50),
        published_date DATE,
        status VARCHAR(50) DEFAULT 'verified',
        is_primary BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 5. Create Material Specifications Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS material_specifications (
        id SERIAL PRIMARY KEY,
        material_id INT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
        parameter VARCHAR(100) NOT NULL,
        parameter_label VARCHAR(150) NOT NULL,
        value TEXT NOT NULL,
        unit VARCHAR(50),
        source_id INT REFERENCES material_sources(id) ON DELETE SET NULL,
        source_document_page INT,
        confidence NUMERIC(3,2) DEFAULT 1.0,
        order_index INT DEFAULT 0
      );
    `);

    // 6. Create Material Documents Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS material_documents (
        id SERIAL PRIMARY KEY,
        material_id INT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        document_type VARCHAR(50) DEFAULT 'technical_datasheet',
        url TEXT NOT NULL,
        file_size_kb INT,
        version VARCHAR(50),
        language VARCHAR(10) DEFAULT 'ru',
        published_date DATE,
        order_index INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
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

      await pool.query(`
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
      `, [
        m.name, m.slug, m.original_name, m.english_name, m.aliases || [], categoryId, m.subcategory_name, m.scope || 'both',
        manufacturerId, m.product_code, m.material_type, m.cover_image, m.description, m.dimensions_info,
        m.thicknesses, m.composition, m.usage_area, m.pros, m.cons, m.approx_price, m.uzb_market_availability,
        m.architect_notes, m.standards_info, m.lifespan, m.moisture_resistance, m.fire_rating,
        JSON.stringify(m.standard_sizes || []), m.status || 'published', m.verification_status || 'verified', m.access_type || 'free'
      ]);
    }

    console.log('✅ MATERIALLAR KUTUBXONASI: 24 ta kategoriya va professional materiallar bazasi muvaffaqiyatli sinxronlashtirildi.');
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
