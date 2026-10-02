// designProcessData.js
// 9 ta asosiy bosqichdan iborat Interyer Dizayn Qilish Jarayoni ma'lumotlar bazasi

const DESIGN_PROCESS_STEPS = [
  {
    "step_number": "01",
    "slug": "01-boshlangich-malumotlar-tz",
    "title": "Boshlang‘ich ma'lumotlar va Texnik topshiriq (ТЗ)",
    "short_title": "Boshlang‘ich ma'lumotlar",
    "lead": "Mijoz talablarini chuqur o‘rganish, texnik topshiriq (ТЗ) tuzish va boshlang‘ich arxiv hujjatlarini to‘plash.",
    "purpose": "Mijoz va dizayner o‘rtasidagi tushunmovchiliklarni 100% yo‘qotish, kelajakdagi barcha dizayn va moliyaviy qarorlarga aniq yuridik hamda texnik asos yaratish.",
    "when_to_do": "Loyiha boshlanishining eng birinchi kuni, hech qanday eskiz yoki chizma chizishdan oldin.",
    "checklist_title": "ТЗ tarkibida aniqlanadigan asosiy bandlar:",
    "sections": [
      {
        "heading": "1. Texnik topshiriq (ТЗ) tarkibi",
        "icon": "📋",
        "items": [
          "Obyekt turi (kvartira, hovli, ofis, tijorat maydoni)",
          "Obyekt umumiy maydoni va xonalar soni",
          "Har bir xonaning aniq vazifasi va kelajakdagi funksiyasi",
          "Doimiy foydalanuvchilar (yoshi, qiziqishlari, bolalar, uy hayvonlari)",
          "Mijozning uslubiy talablari (Neoklassika, Minimalizm, Japandi, Zamonaviy)",
          "Yoqqan va mutlaqo yoqmagan ranglar gammasi",
          "Loyiha uchun umumiy ta'mirlash budjeti (ekonom, biznes, premium)",
          "Ob'yektni topshirish va ko‘chib o‘tish muddatlari",
          "Mebel talablari (tayyor sotib olinadigan yoki buyurtma asosidagi mebellar)",
          "Maishiy va iqlim texnikalari ro‘yxati (muzlatgich, duxovka, konditsionerlar)",
          "Yoritish ssenariylari (asosiy, yordamchi, kechki dekorativ, aqlli uy)",
          "Santexnika jihozlari talablari (vanna, dush trapi, gigiyenik dush, bide)",
          "Saqlash joylari (garderob, krovat osti, nishalar, kirxona)",
          "Maxsus talablar (akustika, seyf, ibodat burchagi, trenajyor zonasi)"
        ]
      },
      {
        "heading": "2. Kerakli boshlang‘ich hujjatlar",
        "icon": "📁",
        "items": [
          "Bino quruvchisidan (zastroyshchik) olingan loyiha rejasi",
          "BTI / Kadastr pasporti nusxasi",
          "Binoning muhandislik tarmoqlari sxemasi (risyerlar, elektr kiritish, gaz)",
          "Obyektning dastlabki foto va video arxivi",
          "Mavjud to‘siqlar va yuk ko‘taruvchi ustunlar haqida texnik xulosa"
        ]
      },
      {
        "heading": "3. Bosqich yakuniy natijasi",
        "icon": "🎯",
        "items": [
          "Mijoz tomonidan to‘liq imzolangan rasmiy Texnik Topshiriq (ТЗ)",
          "Ob'yektning to‘liq boshlang‘ich arxiv ma'lumotlar paketi",
          "Keyingi obmer (o‘lchov) bosqichiga o‘tish uchun ruxsat"
        ]
      }
    ],
    "mistakes": [
      "Mijoz budjetini oldindan aniqlashtirmasdan qimmat materiallarni loyihalash",
      "Yozma ТЗ tuzmasdan, og‘zaki suhbat asosida ish boshlash",
      "Oila a'zolarining maxsus ehtiyojlarini (masalan, bolalar xavfsizligi) hisobga olmaslik"
    ],
    "next_step": "02-olchov-obmerniy-plan",
    "next_title": "02 — O‘lchov (Обмерный план)"
  },
  {
    "step_number": "02",
    "slug": "02-olchov-obmerniy-plan",
    "title": "Обмерный план / O‘lchov olish",
    "short_title": "O‘lchov",
    "lead": "Ob’yektning har bir burchagi, balandligi, muhandislik nuqtalari va konstruktiv elementlarini lazerda aniq o‘lchash.",
    "purpose": "Haqiqiy ob’yektning millimetrik aniqlikdagi raqamli 2D/3D obmer planini yaratish, kelgusida mebel va devorlar sig‘may qolishini oldini olish.",
    "when_to_do": "ТЗ tasdiqlangach darhol, ob’yekt bo‘sh bo‘lgan vaqtda.",
    "checklist_title": "O‘lchov jarayonida qat'iy qayd etiladigan parametrlar:",
    "sections": [
      {
        "heading": "1. O‘lchanadigan asosiy elementlar",
        "icon": "📏",
        "items": [
          "Barcha xonalarning perimetr devor uzunliklari",
          "Xonalarning qarama-qarshi diagonallari (devorlar perpendikulyarligini tekshirish)",
          "Shift balandliklari (turli nuqtalarda, pol qiyaligini aniqlash)",
          "Eshik va deraza o‘rni kengligi, balandligi va chekka devorlargacha masofalar",
          "Deraza tokchasi (podokonnik) balandligi va radiator qalinliklari",
          "Monolit ustunlar (kolonnalar) va rigellarning aniq gabaritlari",
          "Ventilyatsiya shaxtalari va mo‘rilarning haqiqiy o‘lchami",
          "Kanalizatsiya va suv ta'minoti stoyaklarining joylashuv koordinatalari",
          "Gaz hisoblagich, elektr kiritish qalqoni va domofon nuqtalari",
          "Konditsioner teshiklari va mavjud drenaj trassalari"
        ]
      },
      {
        "heading": "2. Foto va video qayd qilish (Fiksatsiya)",
        "icon": "📸",
        "items": [
          "Har bir xonani 360 gradus burchak ostida umumiy foto olish",
          "Barcha risyer va kranlar tugunini yaqindan suratga olish",
          "Derazalardan tashqi ko‘rinish va tabiiy yorug‘lik tushish yo‘nalishini qayd etish",
          "Devor va poldagi mavjud yoriq yoki nuqsonlarni fiksatsiya qilish"
        ]
      },
      {
        "heading": "3. Bosqich yakuniy natijasi",
        "icon": "📐",
        "items": [
          "Revit / AutoCAD dasturida tayyorlangan to‘liq Obmer Chizmasi (Обмерный план)",
          "Eksplikatsiya (har bir xonaning haqiqiy o‘lchangan maydoni)",
          "Ob’yektning to‘liq foto-arxivi"
        ]
      }
    ],
    "mistakes": [
      "Diagonallarni o‘lchamaslik natijasida burchaklarning 90 gradus emasligi mebel o‘rnatishda fosh bo‘lishi",
      "Deraza tokchasi balandligini o‘lchamasdan, ostiga oshxona stoleshnitsasini rejalashtirish",
      "Rigellarning balandligini hisobga olmasdan shift karkasini chizish"
    ],
    "next_step": "03-rejalashtirish-planirovka",
    "next_title": "03 — Rejalashtirish (Планировочное решение)"
  },
  {
    "step_number": "03",
    "slug": "03-rejalashtirish-planirovka",
    "title": "Планировочное решение / Rejalashtirish",
    "short_title": "Rejalashtirish",
    "lead": "Xonadonni funksional zonalarga ajratish, mebellar va o‘tish yo‘laklarini ergonomika qoidalariga muvofiq joylashtirish.",
    "purpose": "Har bir kvadrat metrdan oqilona foydalanish, yashash uchun maksimal qulaylik, erkin harakatlanish va qonuniy qayta rejalashtirishni ta'minlash.",
    "when_to_do": "Obmer plani tayyor bo‘lgach, 3D modellashtirishdan oldin.",
    "checklist_title": "Rejalashtirishda tekshiriladigan asosiy jihatlar:",
    "sections": [
      {
        "heading": "1. Funksional zonalash va mebel joylashuvi",
        "icon": "🛋️",
        "items": [
          "Umumiy (mehmonxona, oshxona) va shaxsiy (yotoqxona, bolalar xonasi) zonalarni ajratish",
          "Mebel gabaritlarini standartlarga moslab xonaga joylashtirish",
          "Kirish zonasi (dahliz): poyabzal, kiyim ilish va ko‘zgu ergonomikasi",
          "Oshxona ish uchburchagi: Muzlatgich → Rakovina → Plita ketma-ketligi",
          "Yotoqxona: Krovat atrofidagi minimal o‘tish masofasi (kamida 70-80 sm)",
          "Sanuzel: Unitaz, rakovina va dush o‘rtasidagi foydalanish radiuslari",
          "Garderob va saqlash tizimlari chuqurligi (kiyim ilgich uchun kamida 60 sm)"
        ]
      },
      {
        "heading": "2. Ergonomika va harakatlanish nazorati",
        "icon": "🚶",
        "items": [
          "Asosiy yo‘laklar kengligi kamida 90-100 sm bo‘lishi",
          "Eshiklar ochilganda mebellarga yoki boshqa eshiklarga urilmasligi",
          "Shkaflar va tortmalarning to‘liq ochilishiga xalaqit beruvchi to‘siqlar yo‘qligi",
          "Tabiiy yorug‘lik manbalari (derazalar) ish va yashash joylarini to‘g‘ri yoritishi"
        ]
      },
      {
        "heading": "3. Variantlar va Natija",
        "icon": "🎯",
        "items": [
          "Mijozga taqdim etiladigan 2-3 xil konseptual rejalashtirish varianti (Variant 01, Variant 02, Variant 03)",
          "Eng ma'qul variantni tanlash va yakuniy tasdiqlash",
          "Tasdiqlangan rejalashtirish chizmasi (Утвержденный план расстановки мебели)"
        ]
      }
    ],
    "mistakes": [
      "Standart bo‘lmagan mebel o‘lchamlarini ko‘rsatib, hayotda sig‘may qolishiga sabab bo‘lish",
      "Nam zonalarni (sanuzel, oshxona) qonunchilikka zid ravishda qo‘shnining yashash xonasi ustiga ko‘chirish",
      "O‘tish yo‘laklarini tor (60 sm dan kam) qilib qo‘yish"
    ],
    "next_step": "04-konsepsiya-moodboard",
    "next_title": "04 — Konsepsiya va Moodboard"
  },
  {
    "step_number": "04",
    "slug": "04-konsepsiya-moodboard",
    "title": "Концепция интерьера / Moodboard",
    "short_title": "Konsepsiya",
    "lead": "Bo‘lajak interyerning vizual uslubi, ranglar gammasi, materiallar xarakteri va kayfiyatini ifodalovchi kollaj.",
    "purpose": "3D vizualizatsiyaga kirishishdan oldin mijoz bilan interyerning umumiy ruhiyati va estetikasini aniq kelishib olish.",
    "when_to_do": "Rejalashtirish yechimi tasdiqlangandan so‘ng darhol.",
    "checklist_title": "Moodboard tarkibiy qismlari:",
    "sections": [
      {
        "heading": "1. Moodboard (Kayfiyat doskasi) elementlari",
        "icon": "🎨",
        "items": [
          "Tanlangan arxitektura uslubi (Minimalizm, Neoklassika, Skandinaviya, Wabi-Sabi)",
          "Asosiy rang palitrasi (60% asosiy fon, 30% ikkilamchi rang, 10% yorqin aksent)",
          "Materiallar fakturalari: tabiiy yog‘och, marmar, metall, shisha, beton, tekstil",
          "Mebellarning shakl va silueti (yumaloq, qat'iy to‘g‘ri burchakli, oyoqli)",
          "Yoritish uslubi va moslamalar ko‘rinishi (lustra, spotlar, yashirin chiziqlar)",
          "Dekorativ san'at va tekstil namunalari (pardalar, gilam, rasmlar)"
        ]
      },
      {
        "heading": "2. Xonalararo uyg‘unlik",
        "icon": "✨",
        "items": [
          "Dahlizdan boshlab yotoqxona va sanuzelgacha bitta umumiy uslubiy chiziqni saqlash",
          "Materiallar va eshiklarning bir-biriga kontrast yoki mutanosib bo‘lishi",
          "Atmosfera: issiq va shinam, yoki salqin va qat'iy zamonaviy"
        ]
      },
      {
        "heading": "3. Bosqich yakuniy natijasi",
        "icon": "🖼️",
        "items": [
          "Har bir xona uchun alohida tasdiqlangan Moodboard albomi",
          "Mijoz bilan rang va teksturalar bo‘yicha to‘liq kelishuv bayonnomasi"
        ]
      }
    ],
    "mistakes": [
      "Bitta xonadonda 4-5 xil bir-biriga mos kelmaydigan uslublarni aralashtirib yuborish",
      "Haqiqiy bozorda topilmaydigan material va ranglarni moodboardga kiritish",
      "Yoritish harorati (Kelvin) kontrastini e'tibordan qochirish"
    ],
    "next_step": "05-material-va-ranglar",
    "next_title": "05 — Material va ranglar tanlovi"
  },
  {
    "step_number": "05",
    "slug": "05-material-va-ranglar",
    "title": "Materiallar va ranglar tanlovi",
    "short_title": "Material va ranglar",
    "lead": "Devor, pol, shift, profillar va dekorativ yuzalar uchun aniq pardozlash materiallarini tanlash va spetsifikatsiya qilish.",
    "purpose": "Dizaynni mavhum rasmdan real qurilish do‘konlarida sotiladigan sertifikatlangan materiallarga bog‘lash.",
    "when_to_do": "Konsepsiya tasdiqlangach, 3D modelga teksturalar yuklashdan oldin.",
    "checklist_title": "Tanlanadigan materiallar guruhlari:",
    "sections": [
      {
        "heading": "1. Devor pardozlash materiallari",
        "icon": "🧱",
        "items": [
          "Suv asosli premium mat bo‘yoqlar (Tikkurila, Benjamin Moore, Flugger)",
          "To‘qimali va yuviladigan oboylar, frelizinli asoslar",
          "Dekorativ suvoqlar: mikrotsement, travertin, ipak effekti",
          "MDF va yog‘och devor panellari, akustik shponli reyka panellar",
          "Keramogranit va tabiiy tosh plitalari (aksent devorlar uchun)"
        ]
      },
      {
        "heading": "2. Pol va shift materiallari",
        "icon": "🪵",
        "items": [
          "Pol qoplamalari: muhandislik parketi, SPC vinil, laminat (33-sinf), keramogranit",
          "Shift qoplamalari: GKL KNAUF tizimlari, soya profillari (EuroKraab), bo‘yoq",
          "Yordamchi profillar: теневой плинтус, ajratuvchi profillar, LED chiziqlari",
          "Mini App \"Materiallar Kutubxonasi\"dagi haqiqiy xususiyatlar bilan solishtirish"
        ]
      },
      {
        "heading": "3. Bosqich yakuniy natijasi",
        "icon": "📦",
        "items": [
          "Pardozlash materiallarining dastlabki vedomosti (artikul, brend, rang kodi)",
          "Buyurtmachi bilan ko‘rgazma zallarida jonli namunalar (samplar)ni tekshirish"
        ]
      }
    ],
    "mistakes": [
      "Nam xonalar uchun namlikka chidamsiz materiallarni (oddiy laminat, standart GKL) tanlash",
      "Materiallar qalinligini hisobga olmasdan pol tutashmalarini (choklarni) loyihalash",
      "Do‘kondagi sun'iy chiroqda material rangini ko‘rib, ob’yektda mutlaqo boshqa tus olishi"
    ],
    "next_step": "06-3d-model-revit-bim",
    "next_title": "06 — 3D Model (BIM / Revit)"
  },
  {
    "step_number": "06",
    "slug": "06-3d-model-revit-bim",
    "title": "3D BIM Model yaratish (Revit)",
    "short_title": "3D model",
    "lead": "Tasdiqlangan reja va materiallar asosida obyektning to‘liq parametrik 3D axborot modelini (BIM) qurish.",
    "purpose": "Geometrik xatoliklarni 3D fazoda ko‘rish, chizmalar va vizualizatsiya uchun yagona aniq ma'lumotlar bazasini yaratish.",
    "when_to_do": "Reja va materiallar tanlangach, render qilishdan oldin.",
    "checklist_title": "Revit model tarkibiga kiruvchi asosiy toifalar:",
    "sections": [
      {
        "heading": "1. Model elementlari ierarxiyasi",
        "icon": "🏛️",
        "items": [
          "Sathlar (Levels) va Koordinata o‘qlari (Grids)",
          "Devorlar: ko‘p qatlamli (shtukaturka + g‘isht/gazoblok + pardozlash qatlami)",
          "Eshiklar va Derazalar: haqiqiy gabaritlar va furnituralari bilan",
          "Pol konstruktsiyasi: qora beton + izolyatsiya + styajka + toza qoplama",
          "Shift konstruksiyasi: karkas, GKL varaqlari, karniz nishalari, tushirilgan zonalar",
          "Oshxona garnituri va o‘rnatma mebellar parametrik oilalari (Families)",
          "Sanitariya jihozlari: unitaz, rakovina, smesitel, vanna, dush trapi",
          "Yoritgichlar va elektr jihozlari: spotlar, lyustralar, rozetka va kalitlar",
          "Xonalar (Rooms): aniq maydon va perimetr hisob-kitoblari bilan"
        ]
      },
      {
        "heading": "2. Fazoviy to‘qnashuvlarni (Clash Detection) tekshirish",
        "icon": "🔍",
        "items": [
          "Kanalizatsiya quvuri va mebel tortmalarining to‘qnashuvini tekshirish",
          "Shift nishalari va ventilyatsiya trubalarining kesishmasligi",
          "Eshik ochilganda yoritgich yoki rozetkaga tegmasligi"
        ]
      },
      {
        "heading": "3. Bosqich yakuniy natijasi",
        "icon": "💻",
        "items": [
          "To‘liq yig‘ilgan Revit / 3D BIM modeli (.rvt fayl)",
          "Vizualizatsiya dasturlariga (3ds Max, Corona, Enscape, Lumion) eksport qilishga tayyor baza"
        ]
      }
    ],
    "mistakes": [
      "Modelda material qalinliklarini nol qilib ko‘rsatish",
      "Mebel oilalarini haqiqiy o‘lchamdan farqli qilib masshtablash",
      "Shift balandliklarini muhandislik kommunikatsiyalarini hisobga olmasdan tushirish"
    ],
    "next_step": "07-3d-vizualizatsiya",
    "next_title": "07 — 3D Vizualizatsiya"
  },
  {
    "step_number": "07",
    "slug": "07-3d-vizualizatsiya",
    "title": "3D Vizualizatsiya va Fotorealistik Render",
    "short_title": "3D vizualizatsiya",
    "lead": "Interyerni fotorealistik sifatda render qilish, yorug‘lik, tekstura va dekorlarni jonli ko‘rsatish.",
    "purpose": "Mijozga bo‘lajak uyi qanday ko‘rinishini 100% tushunarli, jozibador va real his qilish imkonini berish.",
    "when_to_do": "3D model tayyor bo‘lgach, ishchi hujjatlarni rasmiylashtirishdan oldin.",
    "checklist_title": "Vizualizatsiya jarayoni bosqichlari:",
    "sections": [
      {
        "heading": "1. Sahna sozlamalari va Kompozitsiya",
        "icon": "📷",
        "items": [
          "Kamera rakurslarini inson ko‘zi balandligida (120-150 sm) o‘rnatish",
          "Perspektiva buzilishlarini to‘g‘rilash (Vertical tilt correction)",
          "Tabiiy quyosh yorug‘ligi (Sun/Sky yoki HDRI karta)",
          "Sun'iy yoritgichlarning aniq rang harorati (2700K - 4000K) va yorug‘lik oqimi (Lm)",
          "PBR materiallar: g‘adir-budurlik (Roughness), aks etish (Reflection), relyef (Bump/Normal)",
          "Dekoratsiyalar: kitoblar, idishlar, o‘simliklar, tekstil va shinamlik detallari"
        ]
      },
      {
        "heading": "2. Render va Post-processing",
        "icon": "🖥️",
        "items": [
          "Corona Renderer / V-Ray yoki real-vaqtli dvijoklarda yuqori aniqlikdagi render (4K)",
          "Photoshop orqali rang balansi va kontrastni yakuniy to‘g‘rilash",
          "Har bir asosiy xona uchun 3-5 tadan turli rakursdagi rasmlar"
        ]
      },
      {
        "heading": "3. Bosqich yakuniy natijasi",
        "icon": "🖼️",
        "items": [
          "Mijozga taqdim etiladigan to‘liq 3D Vizualizatsiya albomi (PDF / JPG)",
          "Fotorealistik panoramik 360° virtual sayohat (zarur hollarda)"
        ]
      }
    ],
    "mistakes": [
      "Haqiqatda mavjud bo‘lmagan nur manbalarini sun'iy ravishda ko‘paytirib yuborish",
      "Kamera burchagini haddan tashqari keng (Fish-eye) qilib, xonani sun'iy katta ko‘rsatish",
      "Materiallar shkalasini (UV map) noto‘g‘ri berib, marmar yoki parketni bahaybat ko‘rsatish"
    ],
    "next_step": "08-mijoz-bilan-tasdiqlash",
    "next_title": "08 — Mijoz bilan tasdiqlash"
  },
  {
    "step_number": "08",
    "slug": "08-mijoz-bilan-tasdiqlash",
    "title": "Mijoz bilan tasdiqlash jarayoni",
    "short_title": "Tasdiqlash",
    "lead": "Tayyor dizayn va renderlarni buyurtmachiga taqdim etish, mulohazalarni qabul qilish va loyihani yakuniy tasdiqlash.",
    "purpose": "Barcha g‘oyalar buyurtmachi xohishiga to‘liq mos kelganini hujjatlashtirish va qurilish chizmalariga o‘tishga rozilik olish.",
    "when_to_do": "3D vizualizatsiya yakunlangach, rabochka chizmalarini boshlashdan avval.",
    "checklist_title": "Tasdiqlash bosqichlari:",
    "sections": [
      {
        "heading": "1. Taqdimot va Tekshiruv",
        "icon": "🤝",
        "items": [
          "Loyiha konsepsiyasi, reja va 3D renderlarni buyurtmachiga shaxsan yoki onlayn taqdim etish",
          "Mebel va materiallarning qulayligi, narxi va mavjudligini qayta ko‘rib chiqish",
          "Yoritish va elektr nuqtalarining mijoz turmush tarziga mosligini tekshirish"
        ]
      },
      {
        "heading": "2. Tuzatishlar kiritish (Iteratsiya)",
        "icon": "🔄",
        "items": [
          "Mijozning asosli taklif va o‘zgartirishlarini yozma ravishda qayd etish",
          "3D model va renderlarga 1-2 bosqichli tuzatishlarni kiritish",
          "Qayta ko‘rsatish va kelishuvga erishish"
        ]
      },
      {
        "heading": "3. Bosqich yakuniy natijasi",
        "icon": "✍️",
        "items": [
          "Buyurtmachi tomonidan imzolangan Yakuniy Dizayn Tasdiqlov Dalolatnomasi",
          "MUHIM: Tasdiqlanmagan dizayn asosida rabochka chizmalarini boshlash qat'iyan tavsiya etilmaydi!"
        ]
      }
    ],
    "mistakes": [
      "Mijoz tasdiqlamasdan turib qurilish chizmalarini chizishga kirishish (qayta ishlashga olib keladi)",
      "O‘zgarishlarni yozma qayd etmasdan, keyin kim nima deganini isbotlay olmaslik"
    ],
    "next_step": "09-rabochkaga-tayyorlash",
    "next_title": "09 — Rabochaya dokumentatsiyaga tayyorlash"
  },
  {
    "step_number": "09",
    "slug": "09-rabochkaga-tayyorlash",
    "title": "Rabochaya dokumentatsiyaga tayyorlash",
    "short_title": "Rabochkaga tayyorlash",
    "lead": "Tasdiqlangan dizayn modelini qurilish ishchi hujjatlari (rabochka) ishlab chiqish uchun to‘liq sinxronlash va tekshirish.",
    "purpose": "Dizayndan qurilish bosqichiga xatosiz o‘tishni ta'minlash, barcha mebel va texnikalarning yakuniy gabaritlarini qotirish.",
    "when_to_do": "Dizayn tasdiqlangach, qurilish chizmalari albomini shakllantirishdan oldin.",
    "checklist_title": "Tekshiriladigan yakuniy parametrlar:",
    "sections": [
      {
        "heading": "1. Model va Chizmalar Sinxronizatsiyasi",
        "icon": "⚙️",
        "items": [
          "BIM modeldagi barcha devorlar, nishalar va oraliqlar yakuniy tasdiq bilan solishtirilgan",
          "Sotib olinadigan mebel va texnikalarning aniq pasportlari yuklangan",
          "Santexnika va elektr tugunlarining bog‘lamalari tekshirilgan",
          "Loyiha endi to‘liq \"INTERYER RABOCHKA QILISH JARAYONI\"ga o‘tishga tayyor"
        ]
      },
      {
        "heading": "2. Bosqich yakuniy natijasi",
        "icon": "🚀",
        "items": [
          "Qurilish chizmalari uchun 100% tayyor parametrik raqamli zamin",
          "Interyer rabochka bo‘limiga yo‘naltirish"
        ]
      }
    ],
    "mistakes": [
      "Haqiqiy texnika pasportini olmasdan, taxminiy o‘lchamlar bilan rabochkaga o‘tish"
    ],
    "next_step": "rabochka-hub",
    "next_title": "Interyer Rabochka Qilish Jarayoniga O‘tish →"
  }
];

function getDesignSteps() {
  return DESIGN_PROCESS_STEPS;
}

function getDesignStep(slugOrNum) {
  if (!slugOrNum) return null;
  var s = String(slugOrNum).toLowerCase().trim();
  return DESIGN_PROCESS_STEPS.find(function (step) {
    return step.slug === s || String(step.step_number) === s;
  }) || null;
}

module.exports = {
  DESIGN_PROCESS_STEPS,
  getDesignSteps,
  getDesignStep
};
