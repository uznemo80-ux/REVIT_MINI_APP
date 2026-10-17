// ======================================================
// YOSHUZBEKK Academy — Materials Knowledge Base
// SEED DATA: KATEGORIYALAR, ISHLAB CHIQARUVCHILAR VA MATERIALLAR
// ======================================================

const SEED_CATEGORIES = [
  {
    name: "Profillar (Soya, Karniz va Montaj)",
    slug: "profillar",
    icon: "📐",
    scope: "both",
    description: "Tenevoy profil, razdelitelniy, tenevoy plintus, yashirin karniz, LED profil, uglovoy va montaj profillari",
    sort_order: 1
  },
  {
    name: "Devor va pardozlash",
    slug: "devor-konstruksiya",
    icon: "🧱",
    scope: "both",
    description: "Gazobeton, pishgan g'isht, penoblok, keramzit blok, shlakoblok, gipsli va sementli pardozlash",
    sort_order: 2
  },
  {
    name: "Shift tizimlari",
    slug: "shift",
    icon: "☁️",
    scope: "interior",
    description: "Gipsokarton osma shift, cho'ziluvchan shiftlar, Grilyato panjarali va Armstrong akustik shiftlar",
    sort_order: 3
  },
  {
    name: "Pol qoplamalari",
    slug: "pol-materiallari",
    icon: "🪜",
    scope: "interior",
    description: "SPC kvars-vinil, keramogranit, klassik laminat, parket, quyma o'zi tekislanuvchi pol qoplamalari",
    sort_order: 4
  },
  {
    name: "Gipsokarton va quruq qurilish",
    slug: "gipsokarton-quruq",
    icon: "🧩",
    scope: "interior",
    description: "Knauf GKL standart, GKLV namga chidamli, GKLO olovbardosh, Akvapanel, Silent akustik plitalar",
    sort_order: 5
  },
  {
    name: "Yog‘och, MDF va mebel plitalari",
    slug: "yogoch-plitalar",
    icon: "🪵",
    scope: "interior",
    description: "EGGER LDSP 18mm, Kastamonu MDF panellar, HPL kompakt laminat, fanera va tabiiy shpon",
    sort_order: 6
  },
  {
    name: "Santexnika va vannalar",
    slug: "santexnika-sanuzel",
    icon: "🚿",
    scope: "both",
    description: "Akril vanna, cho'yan vanna, quyma marmar vanna, chiziqli dush trapi, Geberit installyatsiya, osma unitaz",
    sort_order: 7
  },
  {
    name: "Tabiiy va sun'iy toshlar",
    slug: "tosh-materiallari",
    icon: "🪨",
    scope: "both",
    description: "Travertin, granit, marmar, bazalt, oniks, kvartsit va sun'iy aglomerat toshlar",
    sort_order: 8
  },
  {
    name: "Bo‘yoq va suvoq qoplamalari",
    slug: "boyoq-dekor",
    icon: "🎨",
    scope: "both",
    description: "Tikkurila yuviladigan mot bo'yoqlar, fasad bo'yoqlari, Rotband suvoq, Satengips shpaklyovka",
    sort_order: 9
  },
  {
    name: "Issiqlik izolyatsiyasi",
    slug: "issiqlik-izolyatsiyasi",
    icon: "🛡️",
    scope: "both",
    description: "XPS penopolistirol (Penopleks), bazalt tosh paxta mineral vata, penoplast EPS",
    sort_order: 10
  },
  {
    name: "Gidroizolyatsiya",
    slug: "gidroizolyatsiya",
    icon: "💧",
    scope: "both",
    description: "Bikrost HPP/TKP, bitumli mastika, penetratsion kristalli qorishma, superdiffuzion membrana",
    sort_order: 11
  },
  {
    name: "Metall va armatura",
    slug: "metall-materiallar",
    icon: "⛓️",
    scope: "architecture",
    description: "Armatura A500C, profil trubalar, dvutavr balka, po'lat shveller, kladochnaya to'r",
    sort_order: 12
  },
  {
    name: "Tom materiallari",
    slug: "tom-materiallari",
    icon: "🏠",
    scope: "architecture",
    description: "Metallocherepitsa Monterrey, profnastil PK-35, bitumli egiluvchan cherepitsa, sendvich panellar",
    sort_order: 13
  },
  {
    name: "Oyna va shisha tizimlari",
    slug: "oyna-shisha",
    icon: "🪟",
    scope: "both",
    description: "Low-E energiya tejovchi shishapaketlar, temperlangan shisha, triplex, dush to'siqlari",
    sort_order: 14
  },
  {
    name: "Eshik va fasad",
    slug: "eshik-deraza",
    icon: "🚪",
    scope: "both",
    description: "Yashirin montaj eshigi (Invisible), termoalyuminiy derazalar, ventfasad kompozit panellar",
    sort_order: 15
  },
  {
    name: "Yelim, germetik va montaj",
    slug: "yelim-germetik",
    icon: "🧴",
    scope: "both",
    description: "Ceresit CM 11 Plus, CM 17 Super Flexible, montaj ko'pigi, neytral silikon germetik",
    sort_order: 16
  },
  {
    name: "Yoritish uchun profillar va elektr",
    slug: "yoritish-elektr",
    icon: "💡",
    scope: "interior",
    description: "Magnitli 48V trek tizimlari, chiziqli LED profillar, svetovye liniyalar, VVG-P ng kabel",
    sort_order: 17
  },
  {
    name: "Akustika va ovoz yutish",
    slug: "akustik-materiallar",
    icon: "🔇",
    scope: "interior",
    description: "Knauf Silent akustik gipsokarton, SoundGuard pardevorlar, PET akustik panellar",
    sort_order: 18
  },
  {
    name: "Fasad tizimlari",
    slug: "fasad-materiallari",
    icon: "🏢",
    scope: "architecture",
    description: "Ventfasad alyuminiy kompozit, klinker fasad g'ishti, travertin fasad qoplamasi",
    sort_order: 19
  },
  {
    name: "Dekorativ elementlar",
    slug: "dekorativ-materiallar",
    icon: "🖼️",
    scope: "interior",
    description: "Poliuretan moldinglar, shift karnizlari, yashirin plintus va dekorativ reykalar",
    sort_order: 20
  }
];

const SEED_MANUFACTURERS = [
  // 1. Profillar (Soya, Karniz va Montaj)
  {
    name: "Kraab Systems",
    slug: "kraab-systems",
    logo: "https://lh3.googleusercontent.com/d/1_kraab_logo",
    website: "https://kraab-systems.com",
    country: "Rossiya / Germaniya",
    categories: ["profillar", "shift", "yoritish-elektr"],
    description: "EuroKraab va Kraab innovatsion tenevoy (soya chokli) profil tizimlari yaratuvchisi"
  },
  {
    name: "LumFer",
    slug: "lumfer",
    logo: "https://lh3.googleusercontent.com/d/1_lumfer_logo",
    website: "https://lumfer.ru",
    country: "Germaniya / Rossiya",
    categories: ["profillar", "shift", "yoritish-elektr"],
    description: "Shiftga integratsiyalashgan yashirin karniz, trek va nishali alyuminiy profillar"
  },
  {
    name: "Slott (Kraab / Парсек)",
    slug: "slott",
    logo: "",
    website: "https://slott.ru",
    country: "Rossiya",
    categories: ["profillar", "shift", "yoritish-elektr"],
    description: "Dempferli shift tizimlari, chiziqli yoritish va yashirin karniz profillari"
  },
  {
    name: "Flexy",
    slug: "flexy",
    logo: "",
    website: "https://flexy.ru",
    country: "Rossiya",
    categories: ["profillar", "shift", "yoritish-elektr"],
    description: "Cho'ziluvchan va gipsokarton shiftlar uchun soya chokli hamda LED alyuminiy profillar"
  },
  {
    name: "Лука (Luka Prof)",
    slug: "luka-prof",
    logo: "",
    website: "https://lukaprof.ru",
    country: "Rossiya",
    categories: ["profillar", "pol-materiallari", "dekorativ-materiallar"],
    description: "Yashirin plintuslar, soya chokli profillar va pol-devor tutashuv profillari"
  },
  {
    name: "Progress Profiles",
    slug: "progress-profiles",
    logo: "",
    website: "https://www.progressprofiles.com",
    country: "Italiya",
    categories: ["profillar", "pol-materiallari"],
    description: "Plitka, keramogranit va pol qoplamalari uchun arxitekturaviy profillar va deformatsion choklar"
  },
  {
    name: "Schlüter-Systems",
    slug: "schluter-systems",
    logo: "",
    website: "https://www.schluter.com",
    country: "Germaniya",
    categories: ["profillar", "pol-materiallari", "gidroizolyatsiya"],
    description: "Keramika va tosh qoplamalar uchun burchak, tugatish va gidroizolyatsiya profillari"
  },

  // 2. Devor va pardozlash / 5. Gipsokarton va quruq qurilish
  {
    name: "Knauf",
    slug: "knauf",
    logo: "https://lh3.googleusercontent.com/d/1_knauf_logo",
    website: "https://www.knauf.uz",
    country: "Germaniya / O'zbekiston",
    categories: ["gipsokarton-quruq", "devor-konstruksiya", "shift", "boyoq-dekor", "akustik-materiallar", "profillar"],
    description: "Gipsokarton plitalari, quruq qorishmalar, suvoq va profillar bo'yicha jahon yetakchisi"
  },
  {
    name: "Knauf Russia / CIS",
    slug: "knauf-ru",
    logo: "",
    website: "https://www.knauf.ru",
    country: "Germaniya / Rossiya",
    categories: ["gipsokarton-quruq", "devor-konstruksiya", "shift", "boyoq-dekor", "akustik-materiallar", "profillar"],
    description: "Knauf kompleks qurilish tizimlari, GKL, Akvapanel va quruq qorishmalar katalogi"
  },
  {
    name: "Gyproc (Saint-Gobain)",
    slug: "gyproc",
    logo: "",
    website: "https://www.gyproc.ru",
    country: "Fransiya / Rossiya",
    categories: ["gipsokarton-quruq", "devor-konstruksiya", "shift", "akustik-materiallar"],
    description: "Yuqori mustahkamlikdagi Habito, Aku-Line va namga chidamli gipsokarton tizimlari"
  },
  {
    name: "Volma (Волма)",
    slug: "volma",
    logo: "",
    website: "https://www.volma.ru",
    country: "Rossiya",
    categories: ["gipsokarton-quruq", "devor-konstruksiya", "boyoq-dekor"],
    description: "Paz-taroq plitalar (PGP), gipsli suvoqlar, shpaklyovkalar va gipsokarton"
  },
  {
    name: "Arton Gazobeton",
    slug: "arka-gazobeton",
    logo: "https://lh3.googleusercontent.com/d/1_arka_logo",
    website: "https://arton.uz",
    country: "O'zbekiston",
    categories: ["devor-konstruksiya"],
    description: "Germaniya Wehrhahn avtomatlashtirilgan liniyasidagi avtoklav gazobeton bloklari"
  },
  {
    name: "Bonolit",
    slug: "bonolit",
    logo: "",
    website: "https://www.bonolit.ru",
    country: "Rossiya",
    categories: ["devor-konstruksiya"],
    description: "D300–D600 zichlikdagi avtoklav gazobeton bloklari va temir-beton peremichkalar"
  },
  {
    name: "Istkult (Ytong)",
    slug: "istkult",
    logo: "",
    website: "https://istkult.ru",
    country: "Germaniya / Rossiya",
    categories: ["devor-konstruksiya"],
    description: "Energiya samarador avtoklav gazobeton bloklari va devor tizimlari"
  },
  {
    name: "Porotherm (Wienerberger)",
    slug: "porotherm",
    logo: "",
    website: "https://www.wienerberger.ru",
    country: "Avstriya",
    categories: ["devor-konstruksiya", "fasad-materiallari", "tom-materiallari"],
    description: "Yirik formatli issiq keramika bloklari va Terca klinker fasad g'ishtlari"
  },

  // 3. Shift tizimlari / 18. Akustika va ovoz yutish
  {
    name: "Албес (Albes)",
    slug: "albes",
    logo: "",
    website: "https://albes.ru",
    country: "Rossiya",
    categories: ["shift", "fasad-materiallari", "profillar"],
    description: "Grilyato panjarali shiftlar, kassetali va reykali metall shift tizimlari"
  },
  {
    name: "Cesal",
    slug: "cesal",
    logo: "",
    website: "https://cesal.ru",
    country: "Rossiya",
    categories: ["shift"],
    description: "Alyuminiy osma shiftlar, reykali, kassetali va dizaynerlik shift tizimlari"
  },
  {
    name: "Knauf Ceiling Solutions (Armstrong)",
    slug: "armstrong-ceiling",
    logo: "",
    website: "https://www.knaufceilingsolutions.com",
    country: "Germaniya / AQSH",
    categories: ["shift", "akustik-materiallar"],
    description: "Mineral tolali, metall va yog'och akustik osma shift tizimlari"
  },
  {
    name: "Ecophon (Saint-Gobain)",
    slug: "ecophon",
    logo: "",
    website: "https://www.ecophon.com",
    country: "Shvetsiya",
    categories: ["shift", "akustik-materiallar"],
    description: "Ofis, ta'lim va tibbiyot binolari uchun professional akustik shift va devor panellari"
  },
  {
    name: "Rockfon",
    slug: "rockfon",
    logo: "",
    website: "https://www.rockfon.ru",
    country: "Daniya",
    categories: ["shift", "akustik-materiallar"],
    description: "Tosh paxta asosidagi yong'inga chidamli akustik shift panellari va orollari"
  },
  {
    name: "SoundGuard",
    slug: "soundguard",
    logo: "",
    website: "https://soundguard.ru",
    country: "Rossiya",
    categories: ["akustik-materiallar", "gipsokarton-quruq"],
    description: "Ovoz izolyatsiyalovchi panellar, akustik membranalar, dempfer lentalar va vibro-ilgichlar"
  },
  {
    name: "Acoustic Group",
    slug: "acoustic-group",
    logo: "",
    website: "https://www.acoustic.ru",
    country: "Rossiya",
    categories: ["akustik-materiallar", "gipsokarton-quruq", "shift"],
    description: "ZIPPS sendvich-panellar, Шуманет bazalt plitalar, Gypsafon va Dekor Acoustic panellar"
  },
  {
    name: "MaxForte (МаксФорте)",
    slug: "maxforte",
    logo: "",
    website: "https://maxforte.ru",
    country: "Rossiya",
    categories: ["akustik-materiallar"],
    description: "Kvartira va studiyalar uchun yupqa ovoz izolyatsiyasi membranalari va EKOplitalar"
  },

  // 4. Pol qoplamalari
  {
    name: "Italon Keramika",
    slug: "italon",
    logo: "https://lh3.googleusercontent.com/d/1_italon_logo",
    website: "https://www.italonceramica.ru",
    country: "Italiya / Rossiya",
    categories: ["pol-materiallari", "devor-konstruksiya", "fasad-materiallari"],
    description: "Italiya texnologiyasidagi arxitekturaviy yirik formatli keramogranit plitalari"
  },
  {
    name: "KERAMA MARAZZI",
    slug: "kerama-marazzi",
    logo: "",
    website: "https://kerama-marazzi.com",
    country: "Italiya / Rossiya",
    categories: ["pol-materiallari", "devor-konstruksiya", "santexnika-sanuzel"],
    description: "Keramogranit, sopol plitkalar, mozaika, yirik Maksi-formatlar va sanfarfor"
  },
  {
    name: "Estima",
    slug: "estima",
    logo: "",
    website: "https://estima.ru",
    country: "Rossiya",
    categories: ["pol-materiallari", "fasad-materiallari"],
    description: "Tosh, marmar, beton va yog'och fakturali arxitekturaviy keramogranit"
  },
  {
    name: "Atlas Concorde",
    slug: "atlas-concorde",
    logo: "",
    website: "https://www.atlasconcorde.com",
    country: "Italiya",
    categories: ["pol-materiallari", "devor-konstruksiya", "fasad-materiallari"],
    description: "Premium italyan keramograniti va devor keramik plitkalari"
  },
  {
    name: "Laminam",
    slug: "laminam",
    logo: "",
    website: "https://www.laminam.com",
    country: "Italiya",
    categories: ["pol-materiallari", "fasad-materiallari", "yogoch-plitalar"],
    description: "Ultra-yupqa yirik formatli (3000×1000 mm) arxitekturaviy keramogranit slablari"
  },
  {
    name: "Tarkett",
    slug: "tarkett",
    logo: "",
    website: "https://www.tarkett.ru",
    country: "Fransiya / Xalqaro",
    categories: ["pol-materiallari"],
    description: "Parket doskasi, SPC/LVT kvars-vinil, laminat va tijorat linoleum pol qoplamalari"
  },
  {
    name: "Quick-Step",
    slug: "quick-step",
    logo: "",
    website: "https://www.quick-step.ru",
    country: "Belgiya",
    categories: ["pol-materiallari"],
    description: "Suvga chidamli HydroSeal texnologiyali laminat, Alpha Vinyl SPC va parket"
  },
  {
    name: "Alpine Floor",
    slug: "alpine-floor",
    logo: "",
    website: "https://alpinefloor.su",
    country: "Germaniya / Janubiy Koreya",
    categories: ["pol-materiallari"],
    description: "Tosh-polimer SPC laminat, LVT kvars-vinil, archa (herringbone) va muhandislik parketi"
  },
  {
    name: "Fargo",
    slug: "fargo",
    logo: "",
    website: "https://fargo.ru",
    country: "Rossiya / Xitoy",
    categories: ["pol-materiallari"],
    description: "100% suvga chidamli kvars-vinil SPC laminat (Comfort, Classic, Parquet, Stone)"
  },
  {
    name: "Coswick (Косвик)",
    slug: "coswick",
    logo: "",
    website: "https://www.coswick.ru",
    country: "Kanada / Belarus",
    categories: ["pol-materiallari", "yogoch-plitalar", "akustik-materiallar"],
    description: "Tabiiy eman va yong'oqdan muhandislik doskasi, fransuz archasi va modulli parket"
  },
  {
    name: "Finex",
    slug: "finex",
    logo: "",
    website: "https://finexfloors.ru",
    country: "Rossiya / Avstriya",
    categories: ["pol-materiallari"],
    description: "Premium muhandislik parket doskasi, art-parket va massiv eman qoplamalar"
  },

  // 6. Yog'och, MDF va mebel plitalari
  {
    name: "EGGER",
    slug: "egger",
    logo: "https://lh3.googleusercontent.com/d/1_egger_logo",
    website: "https://www.egger.com",
    country: "Avstriya / Germaniya",
    categories: ["yogoch-plitalar", "pol-materiallari"],
    description: "Premium toifadagi LDSP, MDF, PerfectSense laklangan plitalar va kompakt laminat"
  },
  {
    name: "Kastamonu",
    slug: "kastamonu",
    logo: "https://lh3.googleusercontent.com/d/1_kastamonu_logo",
    website: "https://www.kastamonu.ru",
    country: "Turkiya",
    categories: ["yogoch-plitalar", "pol-materiallari"],
    description: "Floorpan laminat, Acrylux va Evogloss yaltiroq/mat MDF panellari, LDSP"
  },
  {
    name: "Kronospan",
    slug: "kronospan",
    logo: "",
    website: "https://kronospan.com",
    country: "Avstriya",
    categories: ["yogoch-plitalar", "pol-materiallari", "fasad-materiallari"],
    description: "LDSP, MDF, HPL kompakt plitalar, OSB-3 va stol usti (stoleshnitsa) plitalari"
  },
  {
    name: "SVEZA (Свеза)",
    slug: "sveza",
    logo: "",
    website: "https://www.sveza.ru",
    country: "Rossiya",
    categories: ["yogoch-plitalar", "devor-konstruksiya"],
    description: "100% qayin shponidan FSF, FK va laminatsiyalangan qurilish hamda mebel fanerasi"
  },
  {
    name: "AGT",
    slug: "agt",
    logo: "",
    website: "https://www.agt.com.tr",
    country: "Turkiya",
    categories: ["yogoch-plitalar", "dekorativ-materiallar", "pol-materiallari"],
    description: "Supramat va High Gloss MDF mebel panellari, 3D devor profillari va laminat"
  },
  {
    name: "Alvic",
    slug: "alvic",
    logo: "",
    website: "https://grup-alvic.com",
    country: "Ispaniya",
    categories: ["yogoch-plitalar"],
    description: "Luxe (yuqori yaltiroq), Zenit (super-mat) va Syncron teksturali MDF plitalar"
  },
  {
    name: "Slotex",
    slug: "slotex",
    logo: "",
    website: "https://www.slotex.ru",
    country: "Rossiya",
    categories: ["yogoch-plitalar", "fasad-materiallari"],
    description: "HPL kompakt-laminat, oshxona stoleshnitsalari va fartuk panellari"
  },

  // 7. Santexnika va vannalar
  {
    name: "Geberit",
    slug: "geberit",
    logo: "https://lh3.googleusercontent.com/d/1_geberit_logo",
    website: "https://www.geberit.ru",
    country: "Shveytsariya",
    categories: ["santexnika-sanuzel"],
    description: "Duofix yashirin montaj installyatsiyalari, Sigma tugmalari va CleanLine dush traplari"
  },
  {
    name: "Grohe",
    slug: "grohe",
    logo: "",
    website: "https://www.grohe.ru",
    country: "Germaniya",
    categories: ["santexnika-sanuzel"],
    description: "SmartControl yashirin dush tizimlari, smesitellar, Rapid SL installyatsiyalar va sanfarfor"
  },
  {
    name: "Hansgrohe",
    slug: "hansgrohe",
    logo: "",
    website: "https://www.hansgrohe.ru",
    country: "Germaniya",
    categories: ["santexnika-sanuzel"],
    description: "iBox universal yashirin dush tizimlari, Raindance dush leykalar va Talis/Metris smesitellar"
  },
  {
    name: "Roca",
    slug: "roca",
    logo: "",
    website: "https://www.roca.ru",
    country: "Ispaniya",
    categories: ["santexnika-sanuzel"],
    description: "Cho'yan, akril va Surfex quyma vannalar, osma unitazlar hamda rakovinalar"
  },
  {
    name: "Cersanit",
    slug: "cersanit",
    logo: "",
    website: "https://cersanit.ru",
    country: "Polsha",
    categories: ["santexnika-sanuzel", "pol-materiallari"],
    description: "Akril vannalar, osma unitazlar, installyatsiya tizimlari va keramogranit"
  },
  {
    name: "AlcaPlast (Alcadrain)",
    slug: "alcaplast",
    logo: "",
    website: "https://www.alcadrain.com",
    country: "Chexiya",
    categories: ["santexnika-sanuzel"],
    description: "Chiziqli pol dush traplari (lotoklar), yashirin installyatsiya va sifon tizimlari"
  },
  {
    name: "Salini",
    slug: "salini",
    logo: "",
    website: "https://salini-srl.com",
    country: "Italiya",
    categories: ["santexnika-sanuzel"],
    description: "S-Stone va S-Sense quyma tosh (marmar) erkin turuvchi vannalar va rakovinalar"
  },

  // 8. Tabiiy va sun'iy toshlar
  {
    name: "White Hills",
    slug: "white-hills",
    logo: "",
    website: "https://whitehills.ru",
    country: "Rossiya",
    categories: ["tosh-materiallari", "fasad-materiallari", "devor-konstruksiya"],
    description: "Arxitekturaviy sun'iy dekorativ tosh, g'isht qoplamasi va fasad klinkeri"
  },
  {
    name: "Kamrock (Камрок)",
    slug: "kamrock",
    logo: "",
    website: "https://kamrock.com",
    country: "Rossiya",
    categories: ["tosh-materiallari", "fasad-materiallari"],
    description: "Fasad va interyer uchun sun'iy tosh, yupqa g'isht va arxitekturaviy dekor"
  },
  {
    name: "Caesarstone",
    slug: "caesarstone",
    logo: "",
    website: "https://www.caesarstone.com",
    country: "Isroil",
    categories: ["tosh-materiallari", "yogoch-plitalar"],
    description: "Stoleshnitsa, orol va devor panellari uchun kvars aglomerat va chinni slablar"
  },
  {
    name: "Avant Quartz",
    slug: "avant-quartz",
    logo: "",
    website: "https://avantquartz.ru",
    country: "Rossiya / Xitoy",
    categories: ["tosh-materiallari"],
    description: "Marmar va granit teksturali kvars aglomerat tosh plitalari (20 mm va 30 mm)"
  },
  {
    name: "Grandex",
    slug: "grandex",
    logo: "",
    website: "https://grandex.ru",
    country: "Janubiy Koreya",
    categories: ["tosh-materiallari"],
    description: "Choksiz biriktiriladigan akril sun'iy tosh plitalari"
  },

  // 9. Bo'yoq va suvoq qoplamalari
  {
    name: "Tikkurila",
    slug: "tikkurila",
    logo: "",
    website: "https://tikkurila.ru",
    country: "Finlandiya",
    categories: ["boyoq-dekor", "fasad-materiallari"],
    description: "Harmony, Joker, Euro Power 7 yuviladigan interyer va fasad bo'yoqlari, gruntovkalar"
  },
  {
    name: "Caparol",
    slug: "caparol",
    logo: "",
    website: "https://www.caparol.ru",
    country: "Germaniya",
    categories: ["boyoq-dekor", "fasad-materiallari", "issiqlik-izolyatsiyasi"],
    description: "Amphibolin, Indeko-plus, Samtex bo'yoqlari, dekorativ suvoqlar va fasad tizimlari"
  },
  {
    name: "Dulux",
    slug: "dulux",
    logo: "",
    website: "https://www.dulux.ru",
    country: "Buyuk Britaniya",
    categories: ["boyoq-dekor"],
    description: "Bindo 7, Ultra Resist, Diamond Matt interyer va nam xonalar uchun bo'yoqlar"
  },
  {
    name: "San Marco",
    slug: "san-marco",
    logo: "",
    website: "https://san-marco.ru",
    country: "Italiya",
    categories: ["boyoq-dekor", "dekorativ-materiallar"],
    description: "Cadoro, Marcopolo, Marmorino, Roxidan italyan dekorativ suvoq va mikro-sement qoplamalari"
  },
  {
    name: "Sheetrock (Danogips)",
    slug: "danogips",
    logo: "",
    website: "https://www.danogips.ru",
    country: "AQSH / Rossiya",
    categories: ["boyoq-dekor", "gipsokarton-quruq"],
    description: "SuperFinish, ProSpray tayyor polimer shpaklyovkalar va burchak himoya lentalari"
  },
  {
    name: "Sobsan",
    slug: "sobsan",
    logo: "",
    website: "https://sobsan.com",
    country: "Ozarbayjon / O'zbekiston",
    categories: ["boyoq-dekor", "fasad-materiallari", "gidroizolyatsiya"],
    description: "O'zbekiston bozorida keng tarqalgan interyer emulsiya bo'yoqlari, laklar va fasad qoplamalari"
  },

  // 10. Issiqlik izolyatsiyasi / 11. Gidroizolyatsiya / 13. Tom materiallari
  {
    name: "Technonicol",
    slug: "technonicol",
    logo: "https://lh3.googleusercontent.com/d/1_technonicol_logo",
    website: "https://www.tn.ru",
    country: "Xalqaro / Rossiya",
    categories: ["gidroizolyatsiya", "issiqlik-izolyatsiyasi", "tom-materiallari", "fasad-materiallari", "akustik-materiallar"],
    description: "Bikrost, Техноэласт gidroizolyatsiya, Carbon XPS, bazalt vata va Shinglas egiluvchan cherepitsa"
  },
  {
    name: "PENOPLEX (Пеноплэкс)",
    slug: "penoplex",
    logo: "",
    website: "https://www.penoplex.ru",
    country: "Rossiya / O'zbekiston",
    categories: ["issiqlik-izolyatsiyasi", "gidroizolyatsiya"],
    description: "Ekstruzion penopolistirol (XPS) issiqlik izolyatsiyasi plitalari (Komfort, Fundament, Krovlya)"
  },
  {
    name: "Rockwool",
    slug: "rockwool",
    logo: "",
    website: "https://www.rockwool.com",
    country: "Daniya",
    categories: ["issiqlik-izolyatsiyasi", "akustik-materiallar", "tom-materiallari", "fasad-materiallari"],
    description: "Yong'inga chidamli bazalt tosh paxta plitalari (Layt Batts, Akustik Batts, Venti Batts)"
  },
  {
    name: "ISOVER (Saint-Gobain)",
    slug: "isover",
    logo: "",
    website: "https://www.isover.ru",
    country: "Fransiya",
    categories: ["issiqlik-izolyatsiyasi", "akustik-materiallar"],
    description: "Mineral va kvars tolali issiqlik hamda ovoz izolyatsiyasi plitalari va rulonlari"
  },
  {
    name: "Пенетрон (Penetron)",
    slug: "penetron",
    logo: "",
    website: "https://penetron.ru",
    country: "AQSH / Rossiya",
    categories: ["gidroizolyatsiya"],
    description: "Beton kapillyarlariga singib kiruvchi penetratsion kristalli gidroizolyatsiya tizimlari"
  },
  {
    name: "Sika",
    slug: "sika",
    logo: "",
    website: "https://rus.sika.com",
    country: "Shveytsariya",
    categories: ["gidroizolyatsiya", "yelim-germetik", "pol-materiallari"],
    description: "Sikalastic, SikaTop Seal gidroizolyatsiya, Sikaflex poliuretan germetiklar va sanoat pollari"
  },
  {
    name: "Grand Line",
    slug: "grand-line",
    logo: "",
    website: "https://www.grandline.ru",
    country: "Rossiya",
    categories: ["tom-materiallari", "fasad-materiallari", "metall-materiallar"],
    description: "Metallocherepitsa, klik-falts tom yopish, profnastil, vodostok va metall sayding"
  },
  {
    name: "Металл Профиль (Metall Profil)",
    slug: "metall-profil",
    logo: "",
    website: "https://metallprofil.ru",
    country: "Rossiya / O'zbekiston",
    categories: ["tom-materiallari", "fasad-materiallari", "metall-materiallar"],
    description: "Monterrey metallocherepitsa, profnastil, uch qatlamli sendvich-panellar va ventfasad kassetalar"
  },
  {
    name: "Döcke (Дёке)",
    slug: "docke",
    logo: "",
    website: "https://www.docke.ru",
    country: "Germaniya / Rossiya",
    categories: ["tom-materiallari", "fasad-materiallari"],
    description: "Bitumli egiluvchan cherepitsa (Pie), fasad panellari va suv oqova (vodostok) tizimlari"
  },

  // 12. Metall va armatura / 14. Oyna va shisha / 15. Eshik va fasad
  {
    name: "AKFA Group",
    slug: "akfa",
    logo: "",
    website: "https://akfagroup.com",
    country: "O'zbekiston",
    categories: ["eshik-deraza", "fasad-materiallari", "metall-materiallar", "profillar"],
    description: "Termoalyuminiy va PVX deraza-eshik profil tizimlari, strukturaviy fasad tizimlari va radiatorlar"
  },
  {
    name: "IMZO",
    slug: "imzo",
    logo: "",
    website: "https://imzo.uz",
    country: "O'zbekiston",
    categories: ["eshik-deraza", "oyna-shisha", "fasad-materiallari"],
    description: "Energiya tejovchi shishapaketlar, Engelberg va Benkam termo-profil deraza-eshik tizimlari"
  },
  {
    name: "REHAU",
    slug: "rehau",
    logo: "",
    website: "https://rhsolutions.ru",
    country: "Germaniya",
    categories: ["eshik-deraza", "santexnika-sanuzel"],
    description: "Blitz, Grazio, Delight, Intelio, Geneo deraza profil tizimlari va Rautitan quvurlari"
  },
  {
    name: "ALUTECH (Алютех)",
    slug: "alutech",
    logo: "",
    website: "https://alutech-group.com",
    country: "Belarus",
    categories: ["eshik-deraza", "fasad-materiallari", "oyna-shisha"],
    description: "ALT F50 vitraj fasad tizimlari, ko'tarma-surma (lift-and-slide) panoramali deraza va darvozalar"
  },
  {
    name: "AGC Glass",
    slug: "agc-glass",
    logo: "",
    website: "https://www.agc-yourglass.com",
    country: "Yaponiya / Yevropa",
    categories: ["oyna-shisha", "fasad-materiallari", "dekorativ-materiallar"],
    description: "Planibel Clearvision ultra-tiniq shisha, Stopray quyoshdan himoya shishasi, Lacobel va Matelac"
  },
  {
    name: "Larta Glass (Guardian)",
    slug: "larta-glass",
    logo: "",
    website: "https://lartaglass.com",
    country: "Rossiya / Xalqaro",
    categories: ["oyna-shisha", "fasad-materiallari"],
    description: "LartaHome Solar va LartaPro quyoshdan himoya hamda energiya tejovchi arxitekturaviy shishalar"
  },
  {
    name: "ProfilDoors",
    slug: "profildoors",
    logo: "",
    website: "https://www.profildoors.ru",
    country: "Rossiya",
    categories: ["eshik-deraza"],
    description: "Invisible yashirin montaj eshiklari (0Z seriya), alyuminiy karkasli va shiftgacha baland eshiklar"
  },
  {
    name: "Sofia (Софья)",
    slug: "sofia-doors",
    logo: "",
    website: "https://sofiadoors.com",
    country: "Rossiya / Italiya",
    categories: ["eshik-deraza", "yogoch-plitalar"],
    description: "Invisible yashirin eshiklar, Roto, Compack va surma peregorodka tizimlari"
  },
  {
    name: "Северсталь (Severstal)",
    slug: "severstal",
    logo: "",
    website: "https://www.severstal.com",
    country: "Rossiya",
    categories: ["metall-materiallar", "tom-materiallari"],
    description: "Armatura A500C, po'lat profil quvurlar, dvutavr balka, shveller va polimer qoplamali po'lat"
  },

  // 16. Yelim, germetik va montaj
  {
    name: "Ceresit (Henkel)",
    slug: "ceresit",
    logo: "https://lh3.googleusercontent.com/d/1_ceresit_logo",
    website: "https://www.ceresit.ru",
    country: "Germaniya / O'zbekiston",
    categories: ["yelim-germetik", "gidroizolyatsiya", "boyoq-dekor", "pol-materiallari", "fasad-materiallari"],
    description: "CM 11, CM 14, CM 16, CM 17 plitka yelimlari, CE 33/CE 40 zatirka, CL 51 gidroizolyatsiya va CN 175"
  },
  {
    name: "LITOKOL",
    slug: "litokol",
    logo: "",
    website: "https://www.litokol.ru",
    country: "Italiya",
    categories: ["yelim-germetik", "gidroizolyatsiya", "pol-materiallari"],
    description: "Starlike EVO epoksid zatirka, Litoflex K80 yirik keramogranit yelimi va Hidroflex gidroizolyatsiya"
  },
  {
    name: "MAPEI",
    slug: "mapei",
    logo: "",
    website: "https://www.mapei.com",
    country: "Italiya",
    categories: ["yelim-germetik", "gidroizolyatsiya", "pol-materiallari"],
    description: "Keraflex Maxi S1, Ultracolor Plus zatirka, Kerapoxy epoksid va Mapelastic gidroizolyatsiya"
  },
  {
    name: "Weber-Vetonit (Saint-Gobain)",
    slug: "weber-vetonit",
    logo: "",
    website: "https://www.ru.weber",
    country: "Fransiya",
    categories: ["yelim-germetik", "boyoq-dekor", "pol-materiallari", "devor-konstruksiya"],
    description: "Vetonit LR+ shpaklyovka, Vetonit 3000/4000 quyma tekislovchi pol va weber.vetonit profi plitka yelimi"
  },
  {
    name: "SOUDAL",
    slug: "soudal",
    logo: "",
    website: "https://www.soudal.ru",
    country: "Belgiya",
    categories: ["yelim-germetik"],
    description: "Fix All гибрид polimer yelim-germetik, Soudaflex poliuretan, sanitar silikon va professional montaj ko'pigi"
  },
  {
    name: "PENOSIL",
    slug: "penosil",
    logo: "",
    website: "https://penosil.com",
    country: "Estoniya",
    categories: ["yelim-germetik"],
    description: "GoldGun 65 montaj ko'pigi, neytral va sanitar silikon germetiklar, suyuq mixlar"
  },
  {
    name: "Tytan Professional (Selena)",
    slug: "tytan",
    logo: "",
    website: "https://tytan-professional.ru",
    country: "Polsha",
    categories: ["yelim-germetik", "gidroizolyatsiya"],
    description: "O2 montaj ko'piklari, gazobeton va gipsokarton ko'pik-yelimi, Classic Fix suyuq mixlar"
  },

  // 17. Yoritish uchun profillar va elektr
  {
    name: "Arlight",
    slug: "arlight",
    logo: "",
    website: "https://arlight.ru",
    country: "Rossiya",
    categories: ["yoritish-elektr", "profillar"],
    description: "Arxitekturaviy LED lentalar, alyuminiy chiziqli yoritish profillari, 48V magnitli treklar va quvvat bloklari"
  },
  {
    name: "Centrsvet",
    slug: "centrsvet",
    logo: "",
    website: "https://www.centrsvet.ru",
    country: "Rossiya",
    categories: ["yoritish-elektr"],
    description: "Infinity va Locus 48V magnitli trek tizimlari, ramkasiz trimless spotlar va chiziqli yoritgichlar"
  },
  {
    name: "Maytoni",
    slug: "maytoni",
    logo: "",
    website: "https://maytoni.ru",
    country: "Germaniya",
    categories: ["yoritish-elektr"],
    description: "Exility magnitli trek tizimlari, texnik spotlar, bra va arxitekturaviy yoritgichlar"
  },
  {
    name: "Schneider Electric (Systeme Electric)",
    slug: "schneider-electric",
    logo: "",
    website: "https://systeme.ru",
    country: "Fransiya / Xalqaro",
    categories: ["yoritish-elektr"],
    description: "AtlasDesign, Glossa, Unica rozetka va viklyuchatellar, Acti9 va Easy9 avtomatika"
  },
  {
    name: "Legrand",
    slug: "legrand",
    logo: "",
    website: "https://legrand.ru",
    country: "Fransiya",
    categories: ["yoritish-elektr"],
    description: "Valena Allure, Valena Life, Inspia, Celiane elektr o'rnatish jihozlari va modulli avtomatika"
  },
  {
    name: "JUNG",
    slug: "jung",
    logo: "",
    website: "https://www.jung.de",
    country: "Germaniya",
    categories: ["yoritish-elektr"],
    description: "LS 990, A Creation, Les Couleurs Le Corbusier premium nemis rozetka, viklyuchatel va KNX aqlli uy tizimlari"
  },

  // 19. Fasad tizimlari / 20. Dekorativ elementlar
  {
    name: "Orac Decor",
    slug: "orac-decor",
    logo: "",
    website: "https://www.oracdecor.com",
    country: "Belgiya",
    categories: ["dekorativ-materiallar", "profillar"],
    description: "Purotouch va Duropolymer zarbaga chidamli 3D devor panellari, moldinglar, karniz va plintuslar"
  },
  {
    name: "Европласт (Europlast)",
    slug: "europlast",
    logo: "",
    website: "https://evroplast.ru",
    country: "Rossiya",
    categories: ["dekorativ-materiallar", "fasad-materiallari"],
    description: "Interyer va fasad poliuretan hamda kompozit moldinglari, karnizlar, plintuslar va 3D panellar"
  },
  {
    name: "Hiwood",
    slug: "hiwood",
    logo: "",
    website: "https://hiwood.ru",
    country: "Janubiy Koreya",
    categories: ["dekorativ-materiallar", "yogoch-plitalar"],
    description: "Yuqori zichlikdagi fitopolimer 3D reykali devor panellari, moldinglar va plintuslar"
  },
  {
    name: "Alucobond (3A Composites)",
    slug: "alucobond",
    logo: "",
    website: "https://www.alucobond.com",
    country: "Germaniya / Shveytsariya",
    categories: ["fasad-materiallari"],
    description: "Alucobond Plus va A2 yong'inga chidamli alyuminiy kompozit ventfasad panellari"
  },
  {
    name: "CEDRAL",
    slug: "cedral",
    logo: "",
    website: "https://www.cedral.world",
    country: "Belgiya",
    categories: ["fasad-materiallari"],
    description: "Yog'och teksturali fibrosement fasad doskalari va ventfasad saydingi"
  },
  {
    name: "Basalt Uzbekistan (Basalt Wool)",
    slug: "basalt-uzbekistan",
    logo: "",
    website: "https://basaltwool.uz",
    country: "O'zbekiston",
    categories: ["issiqlik-izolyatsiyasi", "akustik-materiallar", "fasad-materiallari", "tom-materiallari"],
    description: "O'zbekistonda ishlab chiqariladigan bazalt tosh paxta issiqlik va ovoz izolyatsiyasi plitalari"
  },
  {
    name: "EKOPEN",
    slug: "ekopen",
    logo: "",
    website: "https://ekopen.uz",
    country: "O'zbekiston",
    categories: ["eshik-deraza", "profillar"],
    description: "O'zbekiston iqlimiga moslashtirilgan PVX deraza va eshik profil tizimlari"
  },
  {
    name: "VEKA",
    slug: "veka",
    logo: "",
    website: "https://veka.ru",
    country: "Germaniya",
    categories: ["eshik-deraza", "oyna-shisha"],
    description: "Softline 70, Softline 82, Euroline va WHS A-sinf PVX deraza-eshik profil tizimlari"
  },
  {
    name: "Schüco (Шюко)",
    slug: "schuco",
    logo: "",
    website: "https://www.schueco.com",
    country: "Germaniya",
    categories: ["eshik-deraza", "fasad-materiallari", "oyna-shisha"],
    description: "AWS deraza, ADS eshik, ASS panoramali surma va FWS vitraj alyuminiy fasad tizimlari"
  },
  {
    name: "Bergauf",
    slug: "bergauf",
    logo: "",
    website: "https://www.bergauf.ru",
    country: "Rossiya",
    categories: ["yelim-germetik", "devor-konstruksiya", "boyoq-dekor", "gidroizolyatsiya", "pol-materiallari"],
    description: "Keramik Pro plitka yelimlari, Bau Putz suvoqlar, Boden quyma pol va Hydrostop gidroizolyatsiya"
  },
  {
    name: "Основит (Osnovit)",
    slug: "osnovit",
    logo: "",
    website: "https://www.osnovit.ru",
    country: "Rossiya",
    categories: ["devor-konstruksiya", "boyoq-dekor", "yelim-germetik", "pol-materiallari"],
    description: "Гипсвэлл suvoqlar, Скорлайн quyma tekislovchi pollar, Мастпликс plitka yelimlari va kladochniy qorishmalar"
  },
  {
    name: "Viega",
    slug: "viega",
    logo: "",
    website: "https://www.viega.com",
    country: "Germaniya",
    categories: ["santexnika-sanuzel"],
    description: "Prevista yashirin montaj installyatsiyalari, Advantix Vario chiziqli devor/pol dush traplari"
  },
  {
    name: "Villeroy & Boch",
    slug: "villeroy-boch",
    logo: "",
    website: "https://www.villeroy-boch.ru",
    country: "Germaniya",
    categories: ["santexnika-sanuzel", "pol-materiallari"],
    description: "Quaryl vannalar, Artis/Collaro rakovinalar, DirectFlush osma unitazlar va premium keramika"
  },
  {
    name: "Donolux",
    slug: "donolux",
    logo: "",
    website: "https://www.donolux.ru",
    country: "Rossiya",
    categories: ["yoritish-elektr", "profillar"],
    description: "LED alyuminiy profillar, magnitli trek tizimlari va arxitekturaviy ichki yoritgichlar"
  },
  {
    name: "DKC (ДКС)",
    slug: "dkc",
    logo: "",
    website: "https://www.dkc.ru",
    country: "Rossiya / Italiya",
    categories: ["yoritish-elektr", "metall-materiallar"],
    description: "Kabel lotoklar, gofra quvurlar, elektr shchitlar va sanoat hamda bino kabel kanal tizimlari"
  },
  {
    name: "IEK",
    slug: "iek",
    logo: "",
    website: "https://www.iek.ru",
    country: "Rossiya",
    categories: ["yoritish-elektr"],
    description: "Karat/Armat modulli avtomatika, elektr shchitlar, kabel tizimlari va texnik yoritgichlar"
  },
  {
    name: "Decomaster",
    slug: "decomaster",
    logo: "",
    website: "https://decomaster.su",
    country: "Rossiya / Janubiy Koreya",
    categories: ["dekorativ-materiallar"],
    description: "Yuqori zichlikdagi polimer devor reykalar, moldinglar, karnizlar va 3D dekorativ panellar"
  },
  {
    name: "DoorHan",
    slug: "doorhan",
    logo: "",
    website: "https://doorhan.ru",
    country: "Rossiya",
    categories: ["eshik-deraza", "metall-materiallar", "fasad-materiallari"],
    description: "Sektsion garaj darvozalari, yong'inga qarshi texnik eshiklar, roletlar va sendvich-panellar"
  },
  {
    name: "Волховец (Volhovets)",
    slug: "volhovets",
    logo: "",
    website: "https://www.volhovets.ru",
    country: "Rossiya",
    categories: ["eshik-deraza", "yogoch-plitalar", "dekorativ-materiallar"],
    description: "Tabiiy shpon va emalli xonalararo eshiklar, yashirin eshiklar va devor bo'ylab shpon panellar"
  },
  {
    name: "Vinilam",
    slug: "vinilam",
    logo: "",
    website: "https://vinilam.ru",
    country: "Belgiya",
    categories: ["pol-materiallari"],
    description: "Integratsiyalashgan po'kak taglikli kvars-vinil LVT va SPC pol plitalari"
  },
  {
    name: "URSA",
    slug: "ursa",
    logo: "",
    website: "https://www.ursa.ru",
    country: "Ispaniya / Germaniya",
    categories: ["issiqlik-izolyatsiyasi", "akustik-materiallar"],
    description: "URSA Terra, PureOne mineral issiqlik va ovoz izolyatsiyasi hamda XPS plitalar"
  },
  {
    name: "Onduline (Ондулин)",
    slug: "onduline",
    logo: "",
    website: "https://onduline.ru",
    country: "Fransiya",
    categories: ["tom-materiallari", "gidroizolyatsiya"],
    description: "Onduline Smart to'lqinli tom listlari, Ondutiss bug' va gidroizolyatsion membranalar"
  },
  {
    name: "Kalekim",
    slug: "kalekim",
    logo: "",
    website: "https://www.kalekim.com",
    country: "Turkiya / O'zbekiston",
    categories: ["yelim-germetik", "gidroizolyatsiya", "boyoq-dekor"],
    description: "Technoflex plitka yelimlari, Izolatex gidroizolyatsiya, Fugapool zatirka va Bi'Boya dekorativ qoplamalar"
  }
];

module.exports = {
  SEED_CATEGORIES,
  SEED_MANUFACTURERS
};

