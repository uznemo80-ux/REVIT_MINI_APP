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
    description: "GKL standart, GKLV namga chidamli, GKLO olovbardosh, Akvapanel, Knauf metall profillari",
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
    description: "Cho'ziluvchan patalok, gipsokarton osma patalok, Grilyato, Armstrong, reykali patalok va MDF panellar",
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
    name: "Santexnika va vannalar",
    slug: "santexnika-sanuzel",
    icon: "🚿",
    scope: "both",
    description: "Akril vanna, cho'yan vanna, quyma marmar vanna, dush trapi, Geberit installyatsiya, osma unitaz",
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

// O'quvchi, arxitektor va interyer dizaynerlari uchun to'liq materiallar katalogi
const SEED_MATERIALS = [
  // ==============================================================
  // 1. GIPSOKARTON VA QURUQ QURILISH (KNAUF TO'LIQ KATALOGI)
  // ==============================================================
  {
    name: "Knauf GKL Standart Gipsokarton 12.5mm",
    slug: "knauf-gkl-standart-12-5mm",
    original_name: "КНАУФ-лист ГСП-А (ГКЛ) 2500х1200х12.5 мм",
    category_slug: "gipsokarton-quruq",
    manufacturer_slug: "knauf",
    purpose_tag: "gipsokarton",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80",
    description: "Klassik kulrang gipsokarton plitasi. Normal namlikdagi xonalarda devorlarni qoplash va to'siqlar qurish uchun asosiy quruq qurilish materiali.",
    dimensions_info: "1200 x 2500 mm (maydoni 3.0 m²)",
    thicknesses: "12.5 mm",
    composition: "Tabiiy gips yadrosi, ikki tomonlama mustahkam qurilish kartoni",
    usage_area: "Yashash xonalari devorlari, koridorlar, ofislar, quruq xonalar to'siq devorlari",
    pros: "Ideal tekis yuzaga ega, ekologik sof, tez montaj qilinadi, ichiga kabel va quvurlarni yashirish oson",
    cons: "Suvga chidamsiz (nam joylarda faqat GKLV kerak), og'ir mebel osishda karkasga profil qo'yish shart",
    approx_price: "42 000 - 52 000 UZS / list (3 m²)",
    uzb_market_availability: "O'zbekistonda (Knauf Buxoro zavodi) to'liq ishlab chiqariladi va barcha bozorlarda bor",
    architect_notes: "Xonalararo to'siq devorlarda kamida 2 qatlam gipsokarton (2 x 12.5mm) va o'rtasida 50mm mineral vata loyihalanishi tovush izolyatsiyasini 48 dB ga yetkazadi.",
    standards_info: "GOST 32614-2012, KMK 2.08.01-97",
    lifespan: "30+ yil",
    moisture_resistance: "Oddiy (namlik < 70%)",
    fire_rating: "G1 / KM2",
    standard_sizes: ["1200x2500x12.5mm", "1200x3000x12.5mm"]
  },
  {
    name: "Knauf GKL 9.5mm Shift Gipsokartoni",
    slug: "knauf-gkl-shift-9-5mm",
    original_name: "КНАУФ-лист потолочный облегченный 9.5 мм",
    category_slug: "gipsokarton-quruq",
    manufacturer_slug: "knauf",
    purpose_tag: "gipsokarton",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    description: "Yengillashtirilgan 9.5 mm gipsokarton plitasi. Osma shiftlar karkasiga yuklamani kamaytirish va bir necha sathli shiftlar yasash uchun.",
    dimensions_info: "1200 x 2500 mm (maydoni 3.0 m²)",
    thicknesses: "9.5 mm",
    composition: "Yengillashtirilgan gips massasi, karton qoplama",
    usage_area: "Bir va ko'p sathli osma shiftlar, korniz nishlari, yashirin chiroq qutilari",
    pros: "Yengil vazn (22 kg/list), shift karkasini ortiqcha og'irlashtirmaydi, oson ko'tariladi",
    cons: "Devorga ishlatilmaydi (zarbaga chidami past), faqat shift konstruksiyalari uchun",
    approx_price: "39 000 - 48 000 UZS / list",
    uzb_market_availability: "O'zbekistonda mavjud (Knauf)",
    architect_notes: "Shift karkasida PP 60x27 profillari qadami 400 mm dan oshmasligi kerak, aks holda 9.5mm plita vaqt o'tishi bilan osilib (sagging) qolishi mumkin.",
    standards_info: "GOST 32614-2012",
    lifespan: "30+ yil",
    moisture_resistance: "Oddiy quruq xonalar uchun",
    fire_rating: "G1 / KM2",
    standard_sizes: ["1200x2500x9.5mm"]
  },
  {
    name: "Knauf GKLV Namlikka Chidamli Gipsokarton (Yashil)",
    slug: "knauf-gklv-namlikka-chidamli",
    original_name: "КНАУФ-лист влагостойкий ГСП-Н2 (ГКЛВ) 12.5 мм",
    category_slug: "gipsokarton-quruq",
    manufacturer_slug: "knauf",
    purpose_tag: "gipsokarton",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
    description: "Yashil rangli gidrofob qo'shimchali gipsokarton. Hammom, sanuzel, oshxona va namligi yuqori bo'lgan xonalar devori va kafel tagi uchun.",
    dimensions_info: "1200 x 2500 mm (maydoni 3.0 m²)",
    thicknesses: "12.5 mm",
    composition: "Gidrofob va zamburug'ga qarshi antiseptik qo'shimchali gips, yashil karton",
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
  {
    name: "Knauf GKLO Olovga Chidamli Gipsokarton (Pushti)",
    slug: "knauf-gklo-olovbardosh",
    original_name: "КНАУФ-лист огнестойкий ГСП-DF (ГКЛО) 12.5 мм",
    category_slug: "yongin-xavfsizligi",
    manufacturer_slug: "knauf",
    purpose_tag: "gipsokarton",
    scope: "both",
    cover_image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80",
    description: "Pushti rangli armaturalangan gipsokarton plitasi. Yong'in xavfsizligi yuqori talab qilinadigan xonalar va evakuatsiya yo'llari uchun.",
    dimensions_info: "1200 x 2500 mm x 12.5 mm",
    thicknesses: "12.5 mm, 15.0 mm",
    composition: "Shisha tola (fiberglass) bilan armaturalangan gips yadrosi, maxsus olovbardosh karton",
    usage_area: "Qozonxonalar (kotelniy), server xonalari, shamollatish va kabel shaxtalari, kamin atrofidagi devorlar",
    pros: "Olov ta'sirida gips parchalanib ketmaydi (shisha tola ushlab turadi), 45-60 daqiqa yong'in to'sig'i (EI 45 / EI 60)",
    cons: "Og'irroq, kesishda maxsus pichoq kerak",
    approx_price: "58 000 - 70 000 UZS / list",
    uzb_market_availability: "O'zbekistonda mavjud (Knauf)",
    architect_notes: "Jamoat binolarida evakuatsiya yo'laklari devorlariga 2 qatlam GKLO (EI 90) talab qilinadi.",
    standards_info: "GOST 32614-2012, SHNQ 2.01.02-04",
    lifespan: "30+ yil",
    moisture_resistance: "Oddiy",
    fire_rating: "KM1 (Yong'inga chidamli, olovbardosh)",
    standard_sizes: ["1200x2500x12.5mm"]
  },
  {
    name: "Knauf GKLVO Nam va Olovga Chidamli Gipsokarton",
    slug: "knauf-gklvo-nam-olovbardosh",
    original_name: "КНАУФ-лист влаго-огнестойкий ГСП-DFH2 (ГКЛВО) 12.5 мм",
    category_slug: "gipsokarton-quruq",
    manufacturer_slug: "knauf",
    purpose_tag: "gipsokarton",
    scope: "both",
    cover_image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
    description: "Ham namlikka, ham ochiq olovga chidamli universal maxsus gipsokarton plitasi (yashil karton, qizil yozuvli).",
    dimensions_info: "1200 x 2500 mm x 12.5 mm",
    thicknesses: "12.5 mm",
    composition: "Shisha tola va gidrofob qo'shimchalar bilan to'yintirilgan zich gips yadrosi",
    usage_area: "Restoran oshxonalari (issiq sexlar), saunalar old xonasi, texnik qavatlar, sanoat laboratoriyalari",
    pros: "Ikki tomonlama himoya: suv o'tkazmaslik + yong'inbardoshlik (EI 60)",
    cons: "Yuqori narx",
    approx_price: "68 000 - 82 000 UZS / list",
    uzb_market_availability: "O'zbekistonda buyurtmaga mavjud (Knauf)",
    architect_notes: "Katta quvvatli gaz plitalari va qozonlar o'rnatilgan tijoriy oshxonalarda aynan GKLVO loyihalanishi SHNQ me'yorlariga to'liq javob beradi.",
    standards_info: "GOST 32614-2012, SHNQ 2.01.02-04",
    lifespan: "30+ yil",
    moisture_resistance: "Yuqori (suv shimishi < 10%)",
    fire_rating: "KM1",
    standard_sizes: ["1200x2500x12.5mm"]
  },
  {
    name: "Knauf Akvapanel Indoor (Sement Plita 12.5mm)",
    slug: "knauf-akvapanel-indoor",
    original_name: "КНАУФ АКВАПАНЕЛЬ Внутренняя цементная плита 12.5 мм",
    category_slug: "gipsokarton-quruq",
    manufacturer_slug: "knauf",
    purpose_tag: "gipsokarton",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80",
    description: "Portlandsiment va yengil mineral to'ldiruvchilar asosidagi, shisha to'r bilan armaturalangan 100% suvga chidamli sement plita. Suvda mutlaqo erimaydi va shishmaydi.",
    dimensions_info: "1200 x 2400 mm, 900 x 1200 mm",
    thicknesses: "12.5 mm",
    composition: "Portlandsiment yadrosi, perlit, har ikki tomonidan shisha tola to'r armaturasi",
    usage_area: "Basseynlar, jamoat hammomlari, avtomoykalar, doimiy suv oqadigan dush zonalari",
    pros: "100% namlikda ham mustahkamligini yo'qotmaydi, chirimaydi, 1 metr radiusgacha quruq egilishi mumkin, og'ir plitkalarni ko'taradi (50 kg/m²)",
    cons: "Og'irroq (15 kg/m²), kesishda olmos disk kerak, maxsus Akvapanel shuruplari talab qilinadi",
    approx_price: "160 000 - 210 000 UZS / list",
    uzb_market_availability: "O'zbekistonda mavjud (Knauf Aquapanel)",
    architect_notes: "Basseyn va akvapark loyihalarida gipsokarton mutlaqo taqiqlanadi, faqat Akvapanel Indoor sement plitalari va zanglamas metall karkas ishlatilishi shart.",
    standards_info: "EN 12467, GOST 32614-2012",
    lifespan: "50+ yil",
    moisture_resistance: "Mutlaq 100% suv o'tkazmaydi (suvda shishish 0%)",
    fire_rating: "NG (Yonmaydi, KM0)",
    standard_sizes: ["1200x2400x12.5mm", "900x1200x12.5mm"]
  },
  {
    name: "Knauf Silent / Diamant (Zarbaga va Tovushga Chidamli)",
    slug: "knauf-silent-diamant",
    original_name: "КНАУФ-лист Сейфборд / Диамант высокопрочный акустический",
    category_slug: "akustik-materiallar",
    manufacturer_slug: "knauf",
    purpose_tag: "gipsokarton",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    description: "Yuqori zichlikdagi (1000 kg/m³) og'ir gipsokarton. Xonadonlar orasidagi shovqinni yutadi va devorga og'ir televizor va javonlarni bemalol osishga imkon beradi.",
    dimensions_info: "1200 x 2500 mm x 12.5 mm",
    thicknesses: "12.5 mm, 15.0 mm",
    composition: "O'ta zichlashtirilgan gips, mustahkam polimerlar va shisha tola",
    usage_area: "Kvartiralararo to'siq devorlar, bolalar xonalari, sport zallari, kinoteatrlar",
    pros: "Shovqinni 55-58 dB gacha pasaytiradi, zarbaga o'ta mustahkam (odam suyansa ham sinmaydi), oddiy dyubel bilan 35 kg yukni ko'taradi",
    cons: "Og'ir (13 kg/m²), montajda mustahkamlangan profillar kerak",
    approx_price: "95 000 - 135 000 UZS / list",
    uzb_market_availability: "O'zbekistonda Knauf salonlarida mavjud",
    architect_notes: "Kvartirada qo'shnilar bilan chegaradosh devorga 2 qatlam Knauf Silent o'rnatilsa, qo'shnining baland ovozi va musiqa shovqini deyarli yo'qoladi.",
    standards_info: "GOST 32614-2012, SHNQ 2.01.08-96",
    lifespan: "40+ yil",
    moisture_resistance: "Namga chidamli modifikatsiyasi mavjud",
    fire_rating: "KM1",
    standard_sizes: ["1200x2500x12.5mm"]
  },
  {
    name: "Knauf Cleaneo Akustik (Teshikli Ovoz Yutuvchi)",
    slug: "knauf-cleaneo-akustik",
    original_name: "КНАУФ-Акустика Клеанео перфорированный гипсокартон",
    category_slug: "akustik-materiallar",
    manufacturer_slug: "knauf",
    purpose_tag: "gipsokarton",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    description: "Maxsus dumaloq yoki kvadrat teshikli (perforatsiya) akustik shift va devor plitasi. Rezonans va exoni yo'qotadi hamda zeolit moddasi orqali xona havosini tozalaydi.",
    dimensions_info: "1200 x 2000 mm x 12.5 mm (teshiklar 8-12 mm)",
    thicknesses: "12.5 mm",
    composition: "Teshikli gips yadrosi, orqa tomonida akustik mato, havo tozalovchi tabiiy zeolit",
    usage_area: "Konferens-zallar, ma'ruza teatrlari, restoranlar, ochiq ofislar (open-space), maktab sinfxonalari",
    pros: "Exoni butunlay yo'qotadi (nutq ravshanligi 95%), zamonaviy dizaynerlik naqshi, yoqimsiz hidlarni yutadi",
    cons: "Montajda teshiklar qatorini mikronigacha to'g'irlash uchun maxsus shablon kerak",
    approx_price: "180 000 - 290 000 UZS / list",
    uzb_market_availability: "O'zbekistonda buyurtmaga mavjud (Knauf)",
    architect_notes: "Katta ofis va restoranlarda devor va shiftning 40% maydoni Cleaneo bilan qoplansa, g'ovur-g'uvur va shovqin darajasi 3 barobarga kamayadi.",
    standards_info: "ISO 354 (NRC 0.75 - 0.85), EN 14190",
    lifespan: "30+ yil",
    moisture_resistance: "Oddiy xonalar uchun",
    fire_rating: "KM1",
    standard_sizes: ["1200x2000x12.5mm (dumaloq teshikli)", "1200x2400x12.5mm (kvadrat teshikli)"]
  },
  {
    name: "Knauf Egiluvchan Arka Gipsokartoni 6mm",
    slug: "knauf-arka-gipsokarton-6mm",
    original_name: "КНАУФ-лист арочный гибкий 6.0 мм",
    category_slug: "gipsokarton-quruq",
    manufacturer_slug: "knauf",
    purpose_tag: "gipsokarton",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=80",
    description: "Yupqa 6mm, ichi ko'ndalang shisha tola bilan to'qilgan o'ta egiluvchan gipsokarton. Suvlamasdan va ignali roliksiz mayda arkalar va to'lqinsimon gumbazlar yasash uchun.",
    dimensions_info: "1200 x 2500 mm x 6.0 mm",
    thicknesses: "6.0 mm",
    composition: "Elastik polimerlar va shisha tola bilan armaturalangan yuqori egiluvchan gips",
    usage_area: "Eshik va deraza arkalari, spiral zinalar osti, to'lqinsimon ko'p sathli shiftlar, radial devorlar",
    pros: "Suvlamasdan quruq holatda 30 sm radiusgacha egiladi, yorilmaydi va sinmaydi",
    cons: "Konstruksiya mustahkam bo'lishi uchun odatda 2 qatlam (2 x 6mm) bosilishi shart",
    approx_price: "55 000 - 70 000 UZS / list",
    uzb_market_availability: "O'zbekistonda Knauf do'konlarida mavjud",
    architect_notes: "Klassik sharqona yoki zamonaviy bionik arkalar loyihalashda 6mm arka gipsokartoni metall egiluvchan profil bilan birgalikda eng tezkor natijani beradi.",
    standards_info: "GOST 32614-2012",
    lifespan: "30+ yil",
    moisture_resistance: "Oddiy",
    fire_rating: "G1 / KM2",
    standard_sizes: ["1200x2500x6.0mm"]
  },

  // ==============================================================
  // 2. SANTEXNIKA VA VANNALAR (TURLARI, SHAKLLARI, O'LCHAMLARI)
  // ==============================================================
  {
    name: "Akril Vanna (100% PMMA Quyma Sanitariya Akrili)",
    slug: "akril-vanna-quyma-pmma",
    original_name: "Ванна акриловая прямоугольная / асимметричная 100% литьевой акрил",
    category_slug: "santexnika-sanuzel",
    purpose_tag: "santexnika_vanna",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
    description: "Yuqori sifatli 100% toza sanitariya akrilidan (PMMA) vakuum usulida qoliplangan, orqasi shisha tola va smola bilan mustahkamlangan zamonaviy vanna.",
    dimensions_info: "To'g'ri burchakli: 150x70, 160x70, 170x70, 170x75, 180x80 sm. Burchakli: 150x100, 160x105 sm",
    thicknesses: "Akril qatlami 4.0 - 5.0 mm, tubi DSP va metall karkas bilan kuchaytirilgan",
    composition: "100% polimetilmetakrilat (PMMA Lucite/Altuglas), shisha tola armatura, sirlangan oq antibakterial qoplama",
    usage_area: "Kvartiralar, kottejlar, mehmonxonalar vannaxonalari",
    pros: "Sirti iliq (tanaga yoqimli), suvni uzoq vaqt issiq saqlaydi, yengil vazn (25-35 kg), sarg'aymaydi va tirnalsa oson silliqlanadi",
    cons: "O'rnatishda to'liq metall karkas va oyoqlar bilan mustahkam qotirilishi shart, abraziv kukunlar bilan yuvilmaydi",
    approx_price: "1 200 000 - 3 400 000 UZS (karkas va sifoni bilan)",
    uzb_market_availability: "O'zbekistonning barcha santexnika salonlarida juda keng assortimentda mavjud (Roca, Cersanit, Radomir, Kolpa-San)",
    architect_notes: "Vanna montajidan so'ng kafel vannaning ustiga tushishi (plitka pod bortik) loyihalanishi kerak, bu esa devor va vanna orasidan suv sizishini 100% bartaraf etadi.",
    standards_info: "EN 14516, GOST 30266-95",
    lifespan: "20-25 yil",
    moisture_resistance: "Mutlaq 100% suv o'tkazmaydi",
    fire_rating: "KM3",
    standard_sizes: ["170x70x42 sm", "170x75x44 sm", "150x70x40 sm", "180x80x45 sm"]
  },
  {
    name: "Cho'yan Vanna (Klassik Emallangan Quyma Temir)",
    slug: "choyan-vanna-emallangan",
    original_name: "Ванна чугунная эмалированная повышенной прочности",
    category_slug: "santexnika-sanuzel",
    purpose_tag: "santexnika_vanna",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&auto=format&fit=crop&q=80",
    description: "Og'ir quyma cho'yandan yasalgan, qalin titanli oq emal bilan qoplangan abadiy klassik vanna. Mutlaqo tebranmaydi va shovqinsiz.",
    dimensions_info: "Standart o'lchamlar: 150x70, 160x70, 170x70, 170x75 sm. Chuqurligi: 42 sm",
    thicknesses: "Cho'yan qalinligi 5.5 - 7.0 mm, titan emal qatlami 1.2 - 1.5 mm",
    composition: "Kulrang quyma cho'yan (chugun), yuqori haroratda pishirilgan titan emali",
    usage_area: "Kvartiralar, klassik interyerlar, uzoq yillik xizmat talab qilinadigan uylar",
    pros: "50+ yil xizmat qiladi, mutlaqo qimirlamaydi va tebranmaydi, suv tushganda shovqin chiqarmaydi, emali juda qattiq",
    cons: "O'ta og'ir vazn (95-130 kg), qavatga olib chiqish qiyin, dastlabki tegishda sovuq bo'ladi",
    approx_price: "2 800 000 - 6 500 000 UZS (Roca, Novokuznetsk, Zibo)",
    uzb_market_availability: "O'zbekistonda mavjud (Roca Continental, Malibu, Rossiya cho'yan vannalari)",
    architect_notes: "Og'ir vazni sababli bino orayopma plitasiga nuqtaviy yuklama tushadi (130 kg vanna + 200 kg suv + 80 kg odam = 410 kg), buni orayopma hisobida inobatga oling.",
    standards_info: "GOST 18297-96, EN 14516 (Class 1)",
    lifespan: "50+ yil",
    moisture_resistance: "100% suvga chidamli emal",
    fire_rating: "NG (Yonmaydi)",
    standard_sizes: ["170x70x42 sm", "170x75x42 sm", "150x70x42 sm"]
  },
  {
    name: "Quyma Tosh / Sun'iy Marmar Vanna (Mustaqil Turuvchi)",
    slug: "quyma-tosh-vanna-mustaqil",
    original_name: "Ванна отдельностоящая из литьевого мрамора / искусственного камня",
    category_slug: "santexnika-sanuzel",
    purpose_tag: "santexnika_vanna",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&auto=format&fit=crop&q=80",
    description: "Tabiiy marmar kukuni va kompozit qatronlardan monolit quyilgan, hashamatli mustaqil turuvchi (freestanding) premium toifadagi dizaynerlik vannasi.",
    dimensions_info: "Oval va to'g'ri burchakli: 160x75, 170x80, 180x85 sm. Balandligi: 58-65 sm",
    thicknesses: "Monolit devor qalinligi: 18 - 25 mm",
    composition: "80% maydalangan tabiiy kalsit/marmar, 20% to'yinmagan poliefir qatroni, himoya gelkout qatlami",
    usage_area: "Keng elita vannaxonalari, premium apartamentlar, master-bedroom, panoramali villalar",
    pros: "Hashamatli haykaltaroshlik shakli, mutlaq barqarorlik (og'irligi 100-140 kg), mukammal tovush yutish, ipakdek silliq mat yoki yaltiroq sirt",
    cons: "Qimmat narx, pol ostidan alohida drenaj trap va polga o'rnatiladigan baland smesitel talab qiladi",
    approx_price: "6 500 000 - 18 000 000 UZS",
    uzb_market_availability: "O'zbekistonning premium salonlarida buyurtma va mavjudlikda bor (Salini, Esse, Riho)",
    architect_notes: "Mustaqil turuvchi vanna uchun drenaj quvuri pol qatlamiga aniq kiritilishi va polga qotiriladigan tik turuvchi mikser (napolniy smesitel) uchun suv quvurlari oldindan chiqarilishi shart.",
    standards_info: "EN 14516, ISO 9001",
    lifespan: "35+ yil",
    moisture_resistance: "100% g'ovaksiz tosh kompozit",
    fire_rating: "KM2",
    standard_sizes: ["170x80x60 sm oval", "180x85x62 sm to'rtburchak"]
  },
  {
    name: "Chiziqli Zanglamas Dush Trapi (Lotok 60-90 sm)",
    slug: "chiziqli-zanglamas-dush-trapi",
    original_name: "Душевой лоток щелевой из нержавеющей стали с сухим затвором",
    category_slug: "santexnika-sanuzel",
    purpose_tag: "santexnika_vanna",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
    description: "Poldan suvni tez va chiroyli oqizib yuboruvchi, zanglamas po'lat panjarali chiziqli trap. Zamonaviy to'siqsiz dush zonalari asosi.",
    dimensions_info: "Uzunligi: 600 mm, 700 mm, 800 mm, 900 mm. Eni: 65 mm. O'rnatish balandligi: 62 - 85 mm",
    thicknesses: "Zanglamas po'lat 1.5 mm, gardishli gidroizolyatsion tasma",
    composition: "Zanglamaydigan oziq-ovqat po'lati AISI 304, polipropilen korpus, quruq va ho'l birlashgan kombinatsiyalangan klapan (dry siphon)",
    usage_area: "Poddonsiz dush zonalari, hammomlar, SPA, fitnes-klublar",
    pros: "Suv o'tkazish qobiliyati yuqori (daqiqasiga 40-50 litr), hid qaytarmaydi (iliq polda suv qurisa ham quruq klapan yopiladi), pol bilan bir tekis chiroyli chok",
    cons: "Pol quyishdan (styajka) oldin o'rnatilishi va 1-2% nishablik aniq qilinishi shart",
    approx_price: "450 000 - 1 400 000 UZS (Alcaplast, Pestan, Viega, TECE)",
    uzb_market_availability: "O'zbekistonda mavjud (Chexiya, Serbiya, Germaniya va Turkiya)",
    architect_notes: "Dush zonasida keramogranit plitasini trap tomon kamida 1.5-2 sm nishab (uklon) bilan loyihalashtiring, aks holda suv ko'lmak bo'lib qoladi.",
    standards_info: "EN 1253, DIN 1986",
    lifespan: "30+ yil",
    moisture_resistance: "100% zanglamas metall",
    fire_rating: "NG",
    standard_sizes: ["600x65mm", "700x65mm", "800x65mm", "900x65mm"]
  },
  {
    name: "Yashirin Montaj Dush Tizimi (Termostatli Mikser)",
    slug: "yashirin-dush-tizimi-termostatli",
    original_name: "Душевая система скрытого монтажа с термостатом и тропическим душем",
    category_slug: "santexnika-sanuzel",
    purpose_tag: "santexnika_vanna",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&auto=format&fit=crop&q=80",
    description: "Devor ichiga kiruvchi (iBox) blokli, shiftga o'rnatiluvchi 30-40 sm yirik tropik yomg'ir dush va termostatli suv aralashtirgich tizimi.",
    dimensions_info: "Shift dushi: Ø300mm yoki 300x300mm. Devor plastinasi: 150x200mm",
    thicknesses: "Devor ichi montaj chuqurligi: 70 - 100 mm",
    composition: "DGB toza jez (latun) korpus, keramika kartrij, PVD qoplamali (xrom / mot qora / cho'tkalangan oltin)",
    usage_area: "Zamonaviy dush kabinalari, vanna zonalari, elita kvartiralar",
    pros: "Tashqarida faqat nozik dush va knopkalar qoladi (ortiqcha trubalar yo'q), termostat bolalarni qaynoq suvdan kuymaydi (38°C fiksatsiya)",
    cons: "Devorni 8-10 sm chuqurlikda o'yish (shtroba) yoki gipsokartonda karkas orqasiga o'rnatish talab etiladi",
    approx_price: "2 200 000 - 6 500 000 UZS (Grohe, Hansgrohe, Bravat, Gappo)",
    uzb_market_availability: "O'zbekistonda mavjud",
    architect_notes: "Gipsokarton devor ichiga o'rnatilayotganda iBox blokini orqasiga metall karkas mustahkamlovchi profil qo'yilishi shart, shunda klavishlar tebranmaydi.",
    standards_info: "EN 1111 (Termostatik smesitellar), ISO 3822",
    lifespan: "20+ yil",
    moisture_resistance: "100% korroziyasiz latun",
    fire_rating: "NG",
    standard_sizes: ["Yomg'ir dushi 300mm", "Yomg'ir dushi 400mm"]
  },

  // ==============================================================
  // 3. QURILISH — DEVOR BLOKLARI, G'ISHT VA MONOLIT
  // ==============================================================
  {
    name: "Monolit Temir-beton B25 (M350)",
    slug: "monolit-temir-beton-b25",
    original_name: "Товарный бетон Б25 М350",
    category_slug: "tekislash-qorishmalar",
    purpose_tag: "poydevor_karkas",
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
    standard_sizes: ["m³ hajmda"]
  },
  {
    name: "Pishgan Qizil G'isht (Standart M125)",
    slug: "pishgan-qizil-gisht-m125",
    original_name: "Кирпич керамический полнотелый М125",
    category_slug: "devor-konstruksiya",
    purpose_tag: "devor",
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
  {
    name: "Gazobeton Blok D500 (Arka Wehrhahn)",
    slug: "gazobeton-blok-d500",
    original_name: "Газобетон автоклавный D500 B2.5",
    category_slug: "devor-konstruksiya",
    manufacturer_slug: "arka-gazobeton",
    purpose_tag: "devor",
    scope: "architecture",
    cover_image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=600&auto=format&fit=crop&q=80",
    description: "Avtoklavlangan aniq geometriyali gazosilikat devor bloklari. Yengil, mukammal issiqlik saqlovchi zamonaviy devor materiali.",
    dimensions_info: "600 x 300 x 200 mm, 600 x 300 x 100 mm, 600 x 300 x 150 mm",
    thicknesses: "Tashqi devorlar uchun 300-400mm, xonalararo to'siqlar uchun 100-150mm",
    composition: "Kvars qumi, portlandsement, ohak, gips, alyuminiy kukuni",
    usage_area: "Monolit karkasli ko'p qavatli binolar to'ldirish devorlari, kottejlar tashqi va ichki devorlari",
    pros: "Yengil vazn (fundamentga yuk kam), tez teriladi, yuqori issiqlik izolyatsiyasi (λ=0.12 Vt/m·K), yong'inbardosh",
    cons: "Namlikni tez shimadi (suvoqdan oldin gruntovka shart), mustahkam ankerlar talab qiladi",
    approx_price: "680 000 - 780 000 UZS / m³",
    uzb_market_availability: "O'zbekistonda mavjud (Arka, Ekogazobeton, Arton)",
    architect_notes: "Monolit ustunlar va orayopma plitalar orasidagi tutashuvda deformatsion chok (20mm montaj ko'pigi) qoldirilishi shart, aks holda devor yorilishi mumkin.",
    standards_info: "GOST 31360-2007, KMK 2.01.04-18",
    lifespan: "70+ yil",
    moisture_resistance: "O'rtacha",
    fire_rating: "NG (Yonmaydi, KM0)",
    standard_sizes: ["600x300x200 mm", "600x300x100 mm", "600x300x150 mm"]
  },
  {
    name: "Penoblok D600 (Penobeton Devor Bloki)",
    slug: "penoblok-d600",
    original_name: "Пеноблок стеновой D600",
    category_slug: "devor-konstruksiya",
    purpose_tag: "devor",
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
    moisture_resistance: "Yaxshi",
    fire_rating: "NG (Yonmaydi)",
    standard_sizes: ["600x300x200 mm", "600x300x100 mm"]
  },
  {
    name: "Keramzit Blok (Yengil Devor Toshi)",
    slug: "keramzit-blok",
    original_name: "Керамзитобетонный блок стеновой",
    category_slug: "devor-konstruksiya",
    purpose_tag: "devor",
    scope: "architecture",
    cover_image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=600&auto=format&fit=crop&q=80",
    description: "Kuygan gil granulalari (keramzit) va sement aralashmasidan tayyorlangan ekologik, yengil va issiq devor bloki.",
    dimensions_info: "390 x 190 x 190 mm (standart 4-teshikli)",
    thicknesses: "190mm, 390mm",
    composition: "Keramzit shag'ali, portlandsement M400, qum, suv",
    usage_area: "Uy-joy tashqi devorlari, kottejlar, to'siq devorlar",
    pros: "Bug' o'tkazuvchan (devor nafas oladi), g'ishtdan 2.5 barobar yengil, ekologik sof",
    cons: "Mexanik kesishda maxsus disk talab qiladi, yuzasi g'adir-budur",
    approx_price: "4 800 - 6 500 UZS / dona",
    uzb_market_availability: "O'zbekistonda mavjud",
    architect_notes: "O'zbekistonning issiq iqlimida keramzit bloklar yuqori issiqlik inersiyasiga ega, bino ichida yoqimli mikroklimat saqlaydi.",
    standards_info: "GOST 6133-99",
    lifespan: "75+ yil",
    moisture_resistance: "Yuqori",
    fire_rating: "NG (Yonmaydi)",
    standard_sizes: ["390x190x190 mm"]
  },
  {
    name: "Shlakoblok (Devor va Panjara Bloklari)",
    slug: "shlakoblok-standart",
    original_name: "Шлакоблок стеновой",
    category_slug: "devor-konstruksiya",
    purpose_tag: "devor",
    scope: "architecture",
    cover_image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80",
    description: "Vibropress usulida metallurgiya shlaki yoki maydalangan tosh va sementdan tayyorlangan mustahkam arzon devor materiali.",
    dimensions_info: "390 x 190 x 188 mm",
    thicknesses: "190mm, 390mm",
    composition: "Sement M400, maydalangan tosh/shlak, qum",
    usage_area: "Hududiy o'rab olish devorlari (zabor), omborxonalar, sanoat binolari, poydevor qismi",
    pros: "O'ta arzon narx, yuqori mexanik mustahkamlik, o'g'irlikka va buzishga chidamli",
    cons: "Og'ir, issiqlik izolyatsiyasi past (sovuq o'tkazuvchan)",
    approx_price: "3 200 - 4 200 UZS / dona",
    uzb_market_availability: "O'zbekistonning barcha bozorlarida doimiy mavjud",
    architect_notes: "Turar-joy xonalari uchun faqat tashqi tomondan kamida 100mm izolyatsiya qilinganda tavsiya etiladi. Zabor va garajlar uchun ideal.",
    standards_info: "GOST 6133-99",
    lifespan: "50+ yil",
    moisture_resistance: "O'rtacha",
    fire_rating: "NG (Yonmaydi)",
    standard_sizes: ["390x190x188 mm"]
  },
  {
    name: "Po'lat Armatura A500C (12mm, 14mm, 16mm, 20mm)",
    slug: "armatura-a500c",
    original_name: "Арматура строительная рифленая А500С",
    category_slug: "metall-materiallar",
    purpose_tag: "poydevor_karkas",
    scope: "architecture",
    cover_image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80",
    description: "Issiq prokatlangan davriy profilli termomexanik mustahkamlangan armatura po'lati. Monolit temir-beton karkasining asosiy kuchi.",
    dimensions_info: "Ø12, Ø14, Ø16, Ø20 mm. Standart uzunligi: 11.7 metr",
    thicknesses: "Ø12-Ø25mm",
    composition: "Kam uglerodli legirlangan po'lat",
    usage_area: "Monolit ustunlar, rigellar, orayopma plitalari, poydevor karkaslari, seysmik poyaslar",
    pros: "A'lo darajada payvandlanuvchanlik (C indeksi), egilishga chidamli, beton bilan maksimal yopishuv",
    cons: "Ochiq havoda korroziyaga moyil, beton himoya qatlami kamida 25-35mm bo'lishi shart",
    approx_price: "8 200 000 - 9 400 000 UZS / tonna",
    uzb_market_availability: "O'zbekistonda mavjud (O'zmetkombinat Bekobod)",
    architect_notes: "Revit karkas modelingida armaturaning beton himoya qatlami ustunlarda 30-35mm, plitalarda 20mm dan kam bo'lmasligini belgilang.",
    standards_info: "GOST 52544-2006, SHNQ 2.03.01-96",
    lifespan: "100+ yil",
    moisture_resistance: "Beton ichida yuqori",
    fire_rating: "NG (Yonmaydi)",
    standard_sizes: ["Ø12mm x 11.7m", "Ø16mm x 11.7m", "Ø20mm x 11.7m"]
  },

  // ==============================================================
  // 4. POL QOPLAMALARI
  // ==============================================================
  {
    name: "Kvars-vinil SPC Laminat 4mm + IXPE Taglikli",
    slug: "kvars-vinil-spc-laminat-4mm",
    original_name: "Кварц-винил SPC ламинат 4 мм с подложкой",
    category_slug: "pol-materiallari",
    purpose_tag: "pol",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600&auto=format&fit=crop&q=80",
    description: "Ohaktosh toshi va PVX dan iborat monolit tosh-polimer pol qoplamasi. 100% suv o'tkazmaydi va geometrik barqaror.",
    dimensions_info: "1220 x 180 mm plitalar",
    thicknesses: "4.0 mm (+1.0 mm IXPE podlozhka)",
    composition: "75% maydalangan tabiiy ohaktosh (CaCO3), 25% toza PVX",
    usage_area: "Oshxona, dahliz, mehmonxona, bolalar xonasi, ofislar",
    pros: "100% suvga chidamli, iliq pol bilan 100% mos (28°C gacha), sinf 33/34 tirnalishga chidamli",
    cons: "Asos (styajka) o'ta tekis bo'lishi shart",
    approx_price: "160 000 - 290 000 UZS / m²",
    uzb_market_availability: "O'zbekistonda mavjud",
    architect_notes: "Katta xonalarda eshik tagida kompensatsion choklar qoldirilishi va devor chetlarida 8-10 mm oraliq saqlanishi shart.",
    standards_info: "EN 16511, GOST 32304-2013",
    lifespan: "25+ yil",
    moisture_resistance: "Mutlaq 100% suvga chidamli",
    fire_rating: "KM2",
    standard_sizes: ["1220x180x4mm"]
  },
  {
    name: "Keramogranit 600x1200mm (Katta Format Marmar)",
    slug: "keramogranit-600x1200mm",
    original_name: "Керамогранит крупноформатный 60x120 см ректификат",
    category_slug: "pol-materiallari",
    purpose_tag: "pol",
    scope: "both",
    cover_image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80",
    description: "Rektifikatsiyalangan katta formatli sirlangan keramogranit. Premium interyer pol va devorlarida choksiz hashamatli marmar effekti.",
    dimensions_info: "600 x 1200 mm (aniq kalibrlangan, rektifikat)",
    thicknesses: "9.0 mm, 10.0 mm",
    composition: "Oq gil, kvars qumi, dala shpati, 1250°C da 500 bar bosimda pishirilgan",
    usage_area: "Zal pollari, hammom devor va pollari, oshxona, dahliz",
    pros: "Minimal chok (1-1.5mm), tirnalishga mutlaq chidamli (PEI IV/V), suv shimishi < 0.05%",
    cons: "Og'ir va mo'rt, C2TE S1 toifadagi elastik yelim talab qiladi",
    approx_price: "150 000 - 450 000 UZS / m²",
    uzb_market_availability: "O'zbekistonda juda keng tarqalgan",
    architect_notes: "Katta format plitalarni yotqizishda SVP tizimidan foydalanish va orqa tomoniga ham, polga ham ikki tomonlama kley surtish shart.",
    standards_info: "ISO 13006, GOST 6787-2001",
    lifespan: "50+ yil",
    moisture_resistance: "Mutlaq suv shimmaslik",
    fire_rating: "NG (Yonmaydi)",
    standard_sizes: ["600x1200x9mm"]
  },
  {
    name: "Klassik Laminat 33-sinf 8mm (V-faskali Eman)",
    slug: "klassik-laminat-33-sinf-8mm",
    original_name: "Ламинат 33 класс 8 мм с фаской",
    category_slug: "pol-materiallari",
    purpose_tag: "pol",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    description: "Yuqori zichlikdagi HDF plita asosidagi yog'och teksturali qulflanuvchi laminat. Yotoqxona va mehmonxonalar uchun iliq shinam pol.",
    dimensions_info: "1380 x 193 mm doskalar, 4V mikro-faska",
    thicknesses: "8.0 mm, 10.0 mm",
    composition: "HDF zichligi 880-920 kg/m³, dekorativ qatlam, overlay himoya qatlami",
    usage_area: "Yotoqxona, bolalar xonasi, mehmonxona, kabinet",
    pros: "Oyoq ostida iliq va tabiiy yog'och hissi, arzon narx, oson click-qulf",
    cons: "Suv toshqiniga chidamsiz, tagiga podlozhka shart",
    approx_price: "95 000 - 180 000 UZS / m²",
    uzb_market_availability: "O'zbekistonda to'liq mavjud",
    architect_notes: "Iliq pol ustiga o'rnatilganda harorat 27°C dan oshmasligi zarur.",
    standards_info: "EN 13329 (Class 33 / AC5)",
    lifespan: "15-20 yil",
    moisture_resistance: "O'rtacha",
    fire_rating: "KM3",
    standard_sizes: ["1380x193x8mm"]
  },

  // ==============================================================
  // 5. PATALOK TURLARI
  // ==============================================================
  {
    name: "Cho'ziluvchan Patalok (Matoviy PVX + Svetovye Liniyali)",
    slug: "choziluvchan-patalok-matoviy",
    original_name: "Натяжной потолок матовый со световыми линиями",
    category_slug: "devor-patalok-qoplamalari",
    purpose_tag: "patalok",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=80",
    description: "Choksiz matoviy PVX yoki matoli cho'ziluvchan shift. Ichiga zamonaviy magnit treklar va yashirin svetovye liniyalar o'rnatish imkoniyati bilan.",
    dimensions_info: "Eni 3.2 m dan 5.5 m gacha choksiz",
    thicknesses: "0.20 mm",
    composition: "Plastifikatsiyalangan PVX plyonka",
    usage_area: "Kvartiralar, ofislar, hammom va oshxonalar shifti",
    pros: "Ideal silliq sirt, 1 kunda changsiz montaj, tepadan suv toshganda suvni ushlab qoladi",
    cons: "O'tkir jism tegsa yirtilishi mumkin",
    approx_price: "60 000 - 140 000 UZS / m²",
    uzb_market_availability: "O'zbekistonning barcha shaharlarida mavjud",
    architect_notes: "Zamonaviy dizaynda devor bilan shift tutashgan joyda EuroKraab soya choki profilini qo'llash tavsiya etiladi.",
    standards_info: "EN 14716",
    lifespan: "20+ yil",
    moisture_resistance: "100% suv o'tkazmaydi",
    fire_rating: "KM2",
    standard_sizes: ["Eni 3.2m", "Eni 5.0m"]
  },
  {
    name: "Grilyato Alyuminiy Panjarali Patalok (100x100mm)",
    slug: "grilyato-alyuminiy-panjarali-patalok",
    original_name: "Потолок Грильято ячеистый алюминиевый 100x100",
    category_slug: "devor-patalok-qoplamalari",
    purpose_tag: "patalok",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80",
    description: "U-shaklidagi alyuminiy chiziqlardan tashkil topgan panjarali osma shift tizimi. Shamollatish va yong'in o'chirish tizimlarini yashirmaydi.",
    dimensions_info: "Katakcha: 100x100 mm, profil balandligi 40 mm",
    thicknesses: "0.40 mm",
    composition: "Korroziyaga chidamli emallangan alyuminiy",
    usage_area: "Savdo markazlari, aeroportlar, avtosalonlar, restoranlar, biznes markazlar",
    pros: "100% yong'inga xavfsiz (NG), ventilyatsiya va tutun chiqarishga to'sqinlik qilmaydi",
    cons: "Shift orqasidagi kommunikatsiyalar qora bo'yalishi kerak",
    approx_price: "85 000 - 150 000 UZS / m²",
    uzb_market_availability: "O'zbekistonda mavjud",
    architect_notes: "Shift orqasidagi barcha truba va kabellar mat qora rangga bo'yalganda ajoyib estetika hosil bo'ladi.",
    standards_info: "GOST R 58153-2018",
    lifespan: "30+ yil",
    moisture_resistance: "100%",
    fire_rating: "NG (Yonmaydi)",
    standard_sizes: ["100x100mm katak", "50x50mm katak"]
  },
  {
    name: "Armstrong Akustik Osma Patalok (600x600 Plitali)",
    slug: "armstrong-akustik-osma-patalok",
    original_name: "Потолок подвесной Armstrong 600x600 минеральное волокно",
    category_slug: "devor-patalok-qoplamalari",
    purpose_tag: "patalok",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80",
    description: "Mineral tola asosidagi kassetali osma shift tizimi. Ofislar, maktablar va shifoxonalarda shovqinni yutish va simlarga oson kirish uchun.",
    dimensions_info: "Plitalar: 600 x 600 mm, T-24 karkas",
    thicknesses: "12 mm, 15 mm",
    composition: "Mineral tosh tolalari, perlit, loy bog'lovchi",
    usage_area: "Ofislar, konferens-zallar, ta'lim muassasalari, klinikalar",
    pros: "Yuqori tovush yutish (NRC 0.6-0.8), plitalarni olib ta'mirlash juda oson",
    cons: "Suv tushsa plitalar egilib qoladi",
    approx_price: "45 000 - 95 000 UZS / m²",
    uzb_market_availability: "O'zbekistonda juda keng tarqalgan",
    architect_notes: "Tibbiyot xonalariga antibakterial 'Bioguard' qoplamasi tanlanishi kerak.",
    standards_info: "EN 13964",
    lifespan: "20+ yil",
    moisture_resistance: "RH 90%",
    fire_rating: "KM1",
    standard_sizes: ["600x600x12mm"]
  },

  // ==============================================================
  // 6. TOM VA FASAD TIZIMLARI
  // ==============================================================
  {
    name: "Metallocherepitsa Monterrey (0.45mm / 0.50mm)",
    slug: "metallocherepitsa-monterrey",
    original_name: "Металлочерепица Монтеррей 0.45/0.50 мм",
    category_slug: "tom-materiallari",
    purpose_tag: "tom",
    scope: "architecture",
    cover_image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&auto=format&fit=crop&q=80",
    description: "Sifatli ruxlangan va polimer qoplangan po'lat tunukadan yasalgan Monterrey to'lqinli eng ommabop yengil tom yopish materiali.",
    dimensions_info: "Foydali eni: 1100 mm, to'liq eni: 1180 mm",
    thicknesses: "0.45 mm, 0.50 mm",
    composition: "Ruxlangan po'lat list (Zn 140-275 g/m²), poliester bo'yoq (25 mkm)",
    usage_area: "Xususiy kottejlar tomi, turar-joy qiya tomlari",
    pros: "Yengil vazn (4.5 kg/m²), tez va oson montaj, chiroyli ko'rinish",
    cons: "Yomg'ir paytida shovqinli (tagiga izolatsiya shart)",
    approx_price: "55 000 - 85 000 UZS / m²",
    uzb_market_availability: "O'zbekistonda to'liq mavjud",
    architect_notes: "Tom qiyaligi kamida 14° bo'lishi va ostiga gidroizolyatsiya membranasi qo'yilishi shart.",
    standards_info: "GOST R 58153-2018",
    lifespan: "30-50 yil",
    moisture_resistance: "100% suv o'tkazmaydi",
    fire_rating: "G1",
    standard_sizes: ["Eni 1.18m"]
  },
  {
    name: "Tabiiy Travertin (1-sort Eron va Nurota)",
    slug: "tabiiy-travertin-1-sort",
    original_name: "Травертин натуральный плитка",
    category_slug: "tosh-materiallari",
    purpose_tag: "fasad",
    scope: "both",
    cover_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
    description: "Tabiiy ohaktoshli g'ovak tosh plita. Sharqona va zamonaviy arxitekturada fasad va ichki bezakning eng nufuzli materiali.",
    dimensions_info: "Plitalar: 300x600 mm, 400x800 mm",
    thicknesses: "18 mm, 20 mm",
    composition: "Tabiiy kaltsiy karbonat cho'kindi tosh",
    usage_area: "Bino fasadlari, ventfasad, ustunlar qoplamasi, vestibyul",
    pros: "Betakror tabiiy go'zallik, sovuqqa va quyosh nuriga chidamli",
    cons: "O'rnatilgach gidrofobizator bilan qoplanishi kerak",
    approx_price: "180 000 - 450 000 UZS / m²",
    uzb_market_availability: "O'zbekistonda keng tarqalgan",
    architect_notes: "Balandligi 3 qavatdan oshganda metall anker-klyammerlar bilan mahkamlash shart.",
    standards_info: "GOST 9479-2011",
    lifespan: "80+ yil",
    moisture_resistance: "Himoya qoplami bilan yuqori",
    fire_rating: "NG (Yonmaydi)",
    standard_sizes: ["300x600x20mm", "400x800x20mm"]
  },
  {
    name: "Technonicol Bikrost HPP / TKP (Gidroizolyatsiya)",
    slug: "bikrost-hpp-tkp-gidroizolyatsiya",
    original_name: "Бикрост ХПП / ТКП наплавляемая гидроизоляция",
    category_slug: "gidroizolyatsiya",
    manufacturer_slug: "technonicol",
    purpose_tag: "izolyatsiya",
    scope: "architecture",
    cover_image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80",
    description: "Gaz gorelkasi yordamida eritib yopishtiriladigan rulonli bitumli tom va poydevor gidroizolyatsiya materiali.",
    dimensions_info: "Rulon: 10m x 1m. Maydoni: 10 m²",
    thicknesses: "3.0 mm - 4.2 mm",
    composition: "Shisha xolst asosi, oksidланган bitum qatlamlari, tosh kukun",
    usage_area: "Yassi tomlar, poydevorlar, podvallar",
    pros: "Ishonchli va sinovdan o'tgan texnologiya, arzon tannarx, 100% suv o'tkazmaslik",
    cons: "Olov bilan ishlashda xavfsizlik choralari shart",
    approx_price: "18 000 - 28 000 UZS / m²",
    uzb_market_availability: "O'zbekistonda eng keng tarqalgan",
    architect_notes: "Yassi tomlarda 2 qatlam qo'llaniladi: HPP va ustki TKP.",
    standards_info: "GOST 30547-97",
    lifespan: "15-20 yil",
    moisture_resistance: "Mutlaq 100% suv o'tkazmaydi",
    fire_rating: "G4",
    standard_sizes: ["Rulon 10x1m"]
  },
  {
    name: "Technonicol XPS Carbon Eco (Penopleks 50mm)",
    slug: "technonicol-xps-carbon-eco",
    original_name: "Экструдированный пенополистирол XPS Carbon Eco",
    category_slug: "issiqlik-izolyatsiyasi",
    manufacturer_slug: "technonicol",
    purpose_tag: "izolyatsiya",
    scope: "architecture",
    cover_image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600&auto=format&fit=crop&q=80",
    description: "Uglerod nano-zarrachalari bilan mustahkamlangan ekstrudirlangan penopolistirol plitalar. Poydevor, sokol va pol osti uchun eng mustahkam issiqlik izolyatsiyasi.",
    dimensions_info: "1180 x 580 mm, L-simon qirrali",
    thicknesses: "30 mm, 50 mm, 100 mm",
    composition: "Ekstruziya qilingan polistirol, nano-uglerod",
    usage_area: "Poydevorlar, beton pol osti, podval devorlari, teskari yassi tomlar",
    pros: "Suvni mutlaqo shimamaydi (0.2%), juda yuqori siqilish mustahkamligi (250-400 kPa)",
    cons: "Quyosh ultrabinafshasidan himoya qilinishi shart",
    approx_price: "45 000 - 68 000 UZS / m²",
    uzb_market_availability: "O'zbekistonda mavjud",
    architect_notes: "Iliq pol ostiga va poydevorga eng to'g'ri tanlov.",
    standards_info: "GOST 32310-2012",
    lifespan: "50+ yil",
    moisture_resistance: "Mutlaq suv o'tkazmaydi",
    fire_rating: "G3 / G4",
    standard_sizes: ["1180x580x50mm"]
  },

  // ==============================================================
  // 7. ESHIKLAR, MEBEL VA YELIMLAR
  // ==============================================================
  {
    name: "Yashirin Montaj Eshigi (Invisible Doors)",
    slug: "yashirin-montaj-eshigi-invisible",
    original_name: "Двери скрытого монтажа Invisible под покраску",
    category_slug: "eshik-deraza",
    purpose_tag: "eshik_deraza",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    description: "Devor bilan bir tekislikda turuvchi, nalichniksiz, yashirin oshiq-moshiqlar bilan o'rnatiladigan va devor kabi bo'yaladigan eshik.",
    dimensions_info: "2000x800mm, 2100x800mm, shiftgacha 2700mm",
    thicknesses: "40-50 mm",
    composition: "Alyuminiy yashirin korobka, namga chidamli gruntlangan MDF",
    usage_area: "Zamonaviy minimalist interyerlar, devor bilan bir xil bo'yaluvchi eshiklar",
    pros: "Nalichniksiz toza chiziqlar, devor kabi bir xil bo'yash imkoniyati",
    cons: "Gipsokarton va suvoq bosqichida rom o'rnatilishi shart",
    approx_price: "1 800 000 - 3 800 000 UZS / komplekt",
    uzb_market_availability: "O'zbekistonda mavjud",
    architect_notes: "Ochilish yo'nalishini (Inside yoki Outside) oldindan aniq belgilang.",
    standards_info: "GOST 475-2016",
    lifespan: "25+ yil",
    moisture_resistance: "Gruntlangan MDF namga chidamli",
    fire_rating: "G1",
    standard_sizes: ["2000x800mm", "2100x800mm"]
  },
  {
    name: "EGGER LDSP 18mm (Avstriya Mebel Plitalari)",
    slug: "egger-ldsp-18mm",
    original_name: "ЛДСП EGGER 18 мм структура древесины",
    category_slug: "oshxona-mebel",
    manufacturer_slug: "egger",
    purpose_tag: "mebel",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&auto=format&fit=crop&q=80",
    description: "Yevropa E1 ekologik standarti bo'yicha tayyorlangan premium laminatsiyalangan yog'och qirindili plita. O'ta mustahkam va chuqur sinhron yog'och poralariga ega.",
    dimensions_info: "2800 x 2070 mm (maydoni 5.8 m²)",
    thicknesses: "18.0 mm",
    composition: "Toza yog'och qirindisi, melamin qoplama, past formaldegid (E1)",
    usage_area: "Oshxona korpuslari, garderoblar, mebellar, devor panellari",
    pros: "Hidsiz, mustahkam shurup ushlaydi, tirnalishga chidamli",
    cons: "Qirralariga 1-2mm PVX kromka yopishtirilishi shart",
    approx_price: "680 000 - 850 000 UZS / list",
    uzb_market_availability: "O'zbekistonda mavjud",
    architect_notes: "Arxitektura standartida oraliqlar egilmasligi uchun 18mm LDSP belgilanishi shart.",
    standards_info: "EN 14322",
    lifespan: "20+ yil",
    moisture_resistance: "Kromka bilan namga chidamli",
    fire_rating: "KM3",
    standard_sizes: ["2800x2070x18mm"]
  },
  {
    name: "HPL Kompakt Laminat 12mm (Namga va Tirnalishga 100% Chidamli)",
    slug: "hpl-kompakt-laminat-12mm",
    original_name: "Компакт-ламинат HPL 12 мм монолитная плита",
    category_slug: "oshxona-mebel",
    purpose_tag: "mebel",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&auto=format&fit=crop&q=80",
    description: "Monolitik qattiq qatronli presslangan plita. Suvda mutlaqo erimaydigan va shishmaydigan, o'ta yupqa minimalist stol usti (stoleshnitsa) materiali.",
    dimensions_info: "4100 x 1300 mm, 3050 x 1300 mm",
    thicknesses: "12.0 mm",
    composition: "Termoreaktiv qatronli sellyuloza qatlamlari, monolit blok",
    usage_area: "Oshxona stoleshnitsasi, orolcha, vanna stolusti, sanuzel to'siqlari",
    pros: "Suvga 100% chidamli, o'ta nafis 12mm qalinlik, issiq idishlarga bardoshli",
    cons: "O'ta qattiq (olmos disk bilan kesiladi)",
    approx_price: "1 200 000 - 2 400 000 UZS / m²",
    uzb_market_availability: "O'zbekistonda mavjud",
    architect_notes: "Tagiga osma moyka (podstolniy montaj) o'rnatishga to'liq imkon beradi.",
    standards_info: "EN 438",
    lifespan: "30+ yil",
    moisture_resistance: "Mutlaq 100% suv o'tkazmaydi",
    fire_rating: "KM1",
    standard_sizes: ["4100x1300x12mm"]
  },
  {
    name: "Ceresit CM 11 Plus (Keramika Plitka Sement Yelimi)",
    slug: "ceresit-cm-11-plus",
    original_name: "Клей для плитки Ceresit CM 11 Plus",
    category_slug: "yelim-germetik",
    manufacturer_slug: "ceresit",
    purpose_tag: "yelim",
    scope: "both",
    cover_image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600&auto=format&fit=crop&q=80",
    description: "Ichki va tashqi ishlarda keramik plitkalar va kichik formatli toshlarni devor va polga yopishtirish uchun standart tsementli kley.",
    dimensions_info: "Qopda 25 kg",
    thicknesses: "2 mm dan 10 mm gacha",
    composition: "Portlandsement, kvars qumi, polimer qo'shimchalar",
    usage_area: "Hammom, oshxona, dahliz, ayvon devor va poliga kafel yopishtirish",
    pros: "Ishonchli sement asos, siljishga chidamli, tejamkor narx",
    cons: "Faqat 40x40 sm gacha plitkalarga mos, iliq polga CM 17 kerak",
    approx_price: "36 000 - 45 000 UZS / qop",
    uzb_market_availability: "O'zbekistonda doimiy mavjud",
    architect_notes: "Format 50x50sm dan katta bo'lsa elastik CM 17 belgilanishi shart.",
    standards_info: "GOST 31357-2007, EN 12004 (C1T)",
    lifespan: "30+ yil",
    moisture_resistance: "Suvga chidamli",
    fire_rating: "NG (Yonmaydi)",
    standard_sizes: ["Qop 25 kg"]
  },
  {
    name: "Ceresit CM 17 Super Flexible (Katta Format Plitka Yelimi)",
    slug: "ceresit-cm-17-super-flexible",
    original_name: "Клей эластичный для керамогранита Ceresit CM 17 Super Flexible",
    category_slug: "yelim-germetik",
    manufacturer_slug: "ceresit",
    purpose_tag: "yelim",
    scope: "both",
    cover_image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600&auto=format&fit=crop&q=80",
    description: "O'ta elastik (S1 toifali) tolalar bilan mustahkamlangan tsementli kley. Katta format keramogranit (60x120), fasad va iliq pollar uchun eng kuchli yelim.",
    dimensions_info: "Qopda 25 kg",
    thicknesses: "2 mm dan 10 mm gacha",
    composition: "Yuqori markali sement, polimer elastifikatorlar, mikrotolalar (Fibre Force)",
    usage_area: "600x1200mm keramogranit, iliq pollar, fasadlar, basseynlar, gipsokartonga plitka yopishtirish",
    pros: "Deformatsiyalarni zararsiz yutadi (S1 elastiklik), ko'chib ketish xavfi 0%, suv va muzga mutlaq chidamli",
    cons: "Oddiy kleylarga nisbatan qimmatroq",
    approx_price: "115 000 - 145 000 UZS / qop",
    uzb_market_availability: "O'zbekistonda mavjud",
    architect_notes: "Katta format plitalar va fasadlar uchun loyihada faqat C2TE S1 sinfidagi elastik yelim belgilanishi shart.",
    standards_info: "EN 12004 (C2TE S1)",
    lifespan: "50+ yil",
    moisture_resistance: "Mutlaq suv va muzga chidamli",
    fire_rating: "NG (Yonmaydi)",
    standard_sizes: ["Qop 25 kg"]
  },
  {
    name: "Magnitli Trek Yoritish Tizimi (Magnetic Track 48V)",
    slug: "magnitli-trek-yoritish-tizimi",
    original_name: "Магнитная трековая система 48В встраиваемая",
    category_slug: "elektr-yoritish",
    purpose_tag: "elektr",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=80",
    description: "Shiftga yashirin yoki ustma-ust o'rnatiladigan 48V past kuchlanishli magnitli rels tizimi. Chiroqlarni istalgan joyga qo'lda oson ko'chirish mumkin.",
    dimensions_info: "Shina: 1m, 2m, 3m. Kesimi: 25x50mm",
    thicknesses: "Shift ichiga kirishi: 40-50 mm",
    composition: "Alyuminiy korpus, mis shinalar, neodim magnitlar",
    usage_area: "Mehmonxona, oshxona, galereyalar, zamonaviy ofislar",
    pros: "Chiroqlarni asboblarsiz qo'lda surish mumkin, xavfsiz 48V kuchlanish, nafis dizayn",
    cons: "48V blok pitaniya talab etiladi",
    approx_price: "120 000 - 280 000 UZS / metr",
    uzb_market_availability: "O'zbekistonda mavjud",
    architect_notes: "Blok pitaniyani revizion lyuk yoki elektr shit ichiga o'rnatish lozim.",
    standards_info: "IEC 60598",
    lifespan: "50 000 soat",
    moisture_resistance: "IP20",
    fire_rating: "KM1",
    standard_sizes: ["1 metr shina", "2 metr shina"]
  },
  {
    name: "Geberit Duofix O'rnatish Tizimi (Yashirin Installyatsiya)",
    slug: "geberit-duofix-installyatsiya",
    original_name: "Инсталляция для подвесного унитаза Geberit Duofix 112 см",
    category_slug: "santexnika-sanuzel",
    manufacturer_slug: "geberit",
    purpose_tag: "santexnika_vanna",
    scope: "interior",
    cover_image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
    description: "Devor ichiga yashiriladigan mustahkam po'lat karkas va choksiz quyilgan plastik bak. Osma unitazni polga tegmasdan havoda ushlab turadi.",
    dimensions_info: "Balandligi: 112 sm, Kengligi: 50 sm, Chuqurligi: 12 sm",
    thicknesses: "Po'lat karkas 40x40 mm, qalinligi 2.0 mm",
    composition: "Po'lat ramka, choksiz HDPE bak",
    usage_area: "Zamonaviy hammomlar, mehmonxonalar, xonadonlar sanuzellari",
    pros: "400 kg gacha og'irlikni ko'taradi, pol toza va bo'sh qoladi, sokin suv to'lishi",
    cons: "Devor ichiga oldindan rejalashtirish shart",
    approx_price: "1 900 000 - 3 200 000 UZS / komplekt",
    uzb_market_availability: "O'zbekistonda doimiy mavjud",
    architect_notes: "Chistovoy pol belgisini 1 metr balandlikdagi ramka chizig'iga aniq to'g'irlash kerak.",
    standards_info: "EN 14055",
    lifespan: "50+ yil",
    moisture_resistance: "100% suvga chidamli",
    fire_rating: "KM2",
    standard_sizes: ["112x50x12 sm"]
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
        purpose_tag VARCHAR(100),
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
      { name: "purpose_tag", type: "VARCHAR(100)" },
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

    // CLEANUP: Purge legacy materials with outdated developer photos or legacy slugs
    await pool.query(`
      DELETE FROM materials 
      WHERE slug IN ('knauf-aquapanel-indoor', 'knauf-gklv', 'egger-mdf', 'keramogranit-600x1200-italon', 'ceresit-cm-17', 'soundguard-standart')
         OR cover_image LIKE '%1581094794329%'
         OR cover_image LIKE '%1534528741775%'
         OR cover_image LIKE '%1507003211169%';
    `).catch(err => console.warn('Legacy clean warn:', err.message));

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
          name, slug, original_name, english_name, aliases, category_id, subcategory_name, scope, purpose_tag,
          manufacturer_id, product_code, material_type, cover_image, description, dimensions_info,
          thicknesses, composition, usage_area, pros, cons, approx_price, uzb_market_availability,
          architect_notes, standards_info, lifespan, moisture_resistance, fire_rating,
          standard_sizes, status, verification_status, access_type, last_verified_at, updated_at
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21, $22,
          $23, $24, $25, $26, $27,
          $28, $29, $30, $31, NOW(), NOW()
        )
        ON CONFLICT (slug) DO UPDATE
        SET name = EXCLUDED.name, original_name = EXCLUDED.original_name, english_name = EXCLUDED.english_name,
            aliases = EXCLUDED.aliases, category_id = EXCLUDED.category_id, subcategory_name = EXCLUDED.subcategory_name,
            scope = EXCLUDED.scope, purpose_tag = EXCLUDED.purpose_tag, manufacturer_id = EXCLUDED.manufacturer_id, product_code = EXCLUDED.product_code,
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
        m.name, m.slug, m.original_name, m.english_name, m.aliases || [], categoryId, m.subcategory_name, m.scope || 'both', m.purpose_tag || null,
        manufacturerId, m.product_code, m.material_type, m.cover_image, m.description, m.dimensions_info,
        m.thicknesses, m.composition, m.usage_area, m.pros, m.cons, m.approx_price, m.uzb_market_availability,
        m.architect_notes, m.standards_info, m.lifespan, m.moisture_resistance, m.fire_rating,
        JSON.stringify(m.standard_sizes || []), m.status || 'published', m.verification_status || 'verified', m.access_type || 'free'
      ]);
    }

    console.log('✅ MATERIALLAR KUTUBXONASI: Barcha toifalar va to‘liq materiallar muvaffaqiyatli sinxronlashtirildi.');
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
