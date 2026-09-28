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
  {
    name: "Knauf",
    slug: "knauf",
    logo: "https://lh3.googleusercontent.com/d/1_knauf_logo",
    website: "https://www.knauf.uz",
    country: "Germaniya / O'zbekiston",
    description: "Gipsokarton plitalari, quruq qorishmalar va profillar bo'yicha jahon yetakchisi"
  },
  {
    name: "Kraab Systems",
    slug: "kraab-systems",
    logo: "https://lh3.googleusercontent.com/d/1_kraab_logo",
    website: "https://kraab-systems.com",
    country: "Rossiya / Germaniya",
    description: "EuroKraab va Kraab innovatsion tenevoy (soya chokli) profil tizimlari yaratuvchisi"
  },
  {
    name: "EGGER",
    slug: "egger",
    logo: "https://lh3.googleusercontent.com/d/1_egger_logo",
    website: "https://www.egger.com",
    country: "Avstriya / Germaniya",
    description: "Premium toifadagi LDSP, MDF va arxitekturaviy mebel plitalari ishlab chiqaruvchisi"
  },
  {
    name: "Technonicol",
    slug: "technonicol",
    logo: "https://lh3.googleusercontent.com/d/1_technonicol_logo",
    website: "https://www.tn.ru",
    country: "Xalqaro / Rossiya",
    description: "Gidroizolyatsiya, issiqlik izolyatsiyasi (XPS) va tom yopish materiallari yetakchisi"
  },
  {
    name: "Ceresit (Henkel)",
    slug: "ceresit",
    logo: "https://lh3.googleusercontent.com/d/1_ceresit_logo",
    website: "https://www.ceresit.com",
    country: "Germaniya",
    description: "Professional plitka yelimlari, gidroizolyatsiya va qurilish kimyosi"
  },
  {
    name: "Arton Gazobeton",
    slug: "arka-gazobeton",
    logo: "https://lh3.googleusercontent.com/d/1_arka_logo",
    website: "https://arkagazobeton.uz",
    country: "O'zbekiston",
    description: "Germaniya Wehrhahn avtomatlashtirilgan liniyasidagi avtoklav gazobeton bloklari"
  },
  {
    name: "Geberit",
    slug: "geberit",
    logo: "https://lh3.googleusercontent.com/d/1_geberit_logo",
    website: "https://www.geberit.com",
    country: "Shveytsariya",
    description: "Premium yashirin montaj installyatsiyalari va sanuzel texnologiyalari"
  },
  {
    name: "Italon Keramika",
    slug: "italon",
    logo: "https://lh3.googleusercontent.com/d/1_italon_logo",
    website: "https://www.italonceramica.ru",
    country: "Italiya / Rossiya",
    description: "Italiya texnologiyasidagi arxitekturaviy yirik formatli keramogranit plitalari"
  },
  {
    name: "Kastamonu",
    slug: "kastamonu",
    logo: "https://lh3.googleusercontent.com/d/1_kastamonu_logo",
    website: "https://www.kastamonu.uz",
    country: "Turkiya / O'zbekiston",
    description: "Laminat pol qoplamalari, MDF va mebel panellari ishlab chiqaruvchisi"
  },
  {
    name: "LumFer",
    slug: "lumfer",
    logo: "https://lh3.googleusercontent.com/d/1_lumfer_logo",
    website: "https://lumfer.ru",
    country: "Germaniya",
    description: "Shiftga integratsiyalashgan yashirin korniz va nishali alyuminiy profillar"
  }
];

module.exports = {
  SEED_CATEGORIES,
  SEED_MANUFACTURERS
};
