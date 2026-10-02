// scripts/build_all_processes.js
const fs = require('fs');
const path = require('path');

// 1. DESIGN PROCESS (9 steps)
const DESIGN_STEPS = [
  {
    step_number: '01',
    slug: '01-boshlangich-malumotlar-tz',
    title: 'Boshlang‘ich ma\'lumotlar va Texnik topshiriq (ТЗ)',
    short_title: 'Boshlang‘ich ma\'lumotlar',
    lead: 'Mijoz talablarini chuqur o‘rganish, texnik topshiriq (ТЗ) tuzish va boshlang‘ich arxiv hujjatlarini to‘plash.',
    purpose: 'Mijoz va dizayner o‘rtasidagi tushunmovchiliklarni 100% yo‘qotish, kelajakdagi barcha dizayn va moliyaviy qarorlarga aniq yuridik hamda texnik asos yaratish.',
    when_to_do: 'Loyiha boshlanishining eng birinchi kuni, hech qanday eskiz yoki chizma chizishdan oldin.',
    checklist_title: 'ТЗ tarkibida aniqlanadigan asosiy bandlar:',
    sections: [
      {
        heading: '1. Texnik topshiriq (ТЗ) tarkibi',
        icon: '📋',
        items: [
          'Obyekt turi (kvartira, hovli, ofis, tijorat maydoni)',
          'Obyekt umumiy maydoni va xonalar soni',
          'Har bir xonaning aniq vazifasi va kelajakdagi funksiyasi',
          'Doimiy foydalanuvchilar (yoshi, qiziqishlari, bolalar, uy hayvonlari)',
          'Mijozning uslubiy talablari (Neoklassika, Minimalizm, Japandi, Zamonaviy)',
          'Yoqqan va mutlaqo yoqmagan ranglar gammasi',
          'Loyiha uchun umumiy ta\'mirlash budjeti (ekonom, biznes, premium)',
          'Ob\'yektni topshirish va ko‘chib o‘tish muddatlari',
          'Mebel talablari (tayyor sotib olinadigan yoki buyurtma asosidagi mebellar)',
          'Maishiy va iqlim texnikalari ro‘yxati (muzlatgich, duxovka, konditsionerlar)',
          'Yoritish ssenariylari (asosiy, yordamchi, kechki dekorativ, aqlli uy)',
          'Santexnika jihozlari talablari (vanna, dush trapi, gigiyenik dush, bide)',
          'Saqlash joylari (garderob, krovat osti, nishalar, kirxona)',
          'Maxsus talablar (akustika, seyf, ibodat burchagi, trenajyor zonasi)'
        ]
      },
      {
        heading: '2. Kerakli boshlang‘ich hujjatlar',
        icon: '📁',
        items: [
          'Bino quruvchisidan (zastroyshchik) olingan loyiha rejasi',
          'BTI / Kadastr pasporti nusxasi',
          'Binoning muhandislik tarmoqlari sxemasi (risyerlar, elektr kiritish, gaz)',
          'Obyektning dastlabki foto va video arxivi',
          'Mavjud to‘siqlar va yuk ko‘taruvchi ustunlar haqida texnik xulosa'
        ]
      },
      {
        heading: '3. Bosqich yakuniy natijasi',
        icon: '🎯',
        items: [
          'Mijoz tomonidan to‘liq imzolangan rasmiy Texnik Topshiriq (ТЗ)',
          'Ob\'yektning to‘liq boshlang‘ich arxiv ma\'lumotlar paketi',
          'Keyingi obmer (o‘lchov) bosqichiga o‘tish uchun ruxsat'
        ]
      }
    ],
    mistakes: [
      'Mijoz budjetini oldindan aniqlashtirmasdan qimmat materiallarni loyihalash',
      'Yozma ТЗ tuzmasdan, og‘zaki suhbat asosida ish boshlash',
      'Oila a\'zolarining maxsus ehtiyojlarini (masalan, bolalar xavfsizligi) hisobga olmaslik'
    ],
    next_step: '02-olchov-obmerniy-plan',
    next_title: '02 — O‘lchov (Обмерный план)'
  },
  {
    step_number: '02',
    slug: '02-olchov-obmerniy-plan',
    title: 'Обмерный план / O‘lchov olish',
    short_title: 'O‘lchov',
    lead: 'Ob’yektning har bir burchagi, balandligi, muhandislik nuqtalari va konstruktiv elementlarini lazerda aniq o‘lchash.',
    purpose: 'Haqiqiy ob’yektning millimetrik aniqlikdagi raqamli 2D/3D obmer planini yaratish, kelgusida mebel va devorlar sig‘may qolishini oldini olish.',
    when_to_do: 'ТЗ tasdiqlangach darhol, ob’yekt bo‘sh bo‘lgan vaqtda.',
    checklist_title: 'O‘lchov jarayonida qat\'iy qayd etiladigan parametrlar:',
    sections: [
      {
        heading: '1. O‘lchanadigan asosiy elementlar',
        icon: '📏',
        items: [
          'Barcha xonalarning perimetr devor uzunliklari',
          'Xonalarning qarama-qarshi diagonallari (devorlar perpendikulyarligini tekshirish)',
          'Shift balandliklari (turli nuqtalarda, pol qiyaligini aniqlash)',
          'Eshik va deraza o‘rni kengligi, balandligi va chekka devorlargacha masofalar',
          'Deraza tokchasi (podokonnik) balandligi va radiator qalinliklari',
          'Monolit ustunlar (kolonnalar) va rigellarning aniq gabaritlari',
          'Ventilyatsiya shaxtalari va mo‘rilarning haqiqiy o‘lchami',
          'Kanalizatsiya va suv ta\'minoti stoyaklarining joylashuv koordinatalari',
          'Gaz hisoblagich, elektr kiritish qalqoni va domofon nuqtalari',
          'Konditsioner teshiklari va mavjud drenaj trassalari'
        ]
      },
      {
        heading: '2. Foto va video qayd qilish (Fiksatsiya)',
        icon: '📸',
        items: [
          'Har bir xonani 360 gradus burchak ostida umumiy foto olish',
          'Barcha risyer va kranlar tugunini yaqindan suratga olish',
          'Derazalardan tashqi ko‘rinish va tabiiy yorug‘lik tushish yo‘nalishini qayd etish',
          'Devor va poldagi mavjud yoriq yoki nuqsonlarni fiksatsiya qilish'
        ]
      },
      {
        heading: '3. Bosqich yakuniy natijasi',
        icon: '📐',
        items: [
          'Revit / AutoCAD dasturida tayyorlangan to‘liq Obmer Chizmasi (Обмерный план)',
          'Eksplikatsiya (har bir xonaning haqiqiy o‘lchangan maydoni)',
          'Ob’yektning to‘liq foto-arxivi'
        ]
      }
    ],
    mistakes: [
      'Diagonallarni o‘lchamaslik natijasida burchaklarning 90 gradus emasligi mebel o‘rnatishda fosh bo‘lishi',
      'Deraza tokchasi balandligini o‘lchamasdan, ostiga oshxona stoleshnitsasini rejalashtirish',
      'Rigellarning balandligini hisobga olmasdan shift karkasini chizish'
    ],
    next_step: '03-rejalashtirish-planirovka',
    next_title: '03 — Rejalashtirish (Планировочное решение)'
  },
  {
    step_number: '03',
    slug: '03-rejalashtirish-planirovka',
    title: 'Планировочное решение / Rejalashtirish',
    short_title: 'Rejalashtirish',
    lead: 'Xonadonni funksional zonalarga ajratish, mebellar va o‘tish yo‘laklarini ergonomika qoidalariga muvofiq joylashtirish.',
    purpose: 'Har bir kvadrat metrdan oqilona foydalanish, yashash uchun maksimal qulaylik, erkin harakatlanish va qonuniy qayta rejalashtirishni ta\'minlash.',
    when_to_do: 'Obmer plani tayyor bo‘lgach, 3D modellashtirishdan oldin.',
    checklist_title: 'Rejalashtirishda tekshiriladigan asosiy jihatlar:',
    sections: [
      {
        heading: '1. Funksional zonalash va mebel joylashuvi',
        icon: '🛋️',
        items: [
          'Umumiy (mehmonxona, oshxona) va shaxsiy (yotoqxona, bolalar xonasi) zonalarni ajratish',
          'Mebel gabaritlarini standartlarga moslab xonaga joylashtirish',
          'Kirish zonasi (dahliz): poyabzal, kiyim ilish va ko‘zgu ergonomikasi',
          'Oshxona ish uchburchagi: Muzlatgich → Rakovina → Plita ketma-ketligi',
          'Yotoqxona: Krovat atrofidagi minimal o‘tish masofasi (kamida 70-80 sm)',
          'Sanuzel: Unitaz, rakovina va dush o‘rtasidagi foydalanish radiuslari',
          'Garderob va saqlash tizimlari chuqurligi (kiyim ilgich uchun kamida 60 sm)'
        ]
      },
      {
        heading: '2. Ergonomika va harakatlanish nazorati',
        icon: '🚶',
        items: [
          'Asosiy yo‘laklar kengligi kamida 90-100 sm bo‘lishi',
          'Eshiklar ochilganda mebellarga yoki boshqa eshiklarga urilmasligi',
          'Shkaflar va tortmalarning to‘liq ochilishiga xalaqit beruvchi to‘siqlar yo‘qligi',
          'Tabiiy yorug‘lik manbalari (derazalar) ish va yashash joylarini to‘g‘ri yoritishi'
        ]
      },
      {
        heading: '3. Variantlar va Natija',
        icon: '🎯',
        items: [
          'Mijozga taqdim etiladigan 2-3 xil konseptual rejalashtirish varianti (Variant 01, Variant 02, Variant 03)',
          'Eng ma\'qul variantni tanlash va yakuniy tasdiqlash',
          'Tasdiqlangan rejalashtirish chizmasi (Утвержденный план расстановки мебели)'
        ]
      }
    ],
    mistakes: [
      'Standart bo‘lmagan mebel o‘lchamlarini ko‘rsatib, hayotda sig‘may qolishiga sabab bo‘lish',
      'Nam zonalarni (sanuzel, oshxona) qonunchilikka zid ravishda qo‘shnining yashash xonasi ustiga ko‘chirish',
      'O‘tish yo‘laklarini tor (60 sm dan kam) qilib qo‘yish'
    ],
    next_step: '04-konsepsiya-moodboard',
    next_title: '04 — Konsepsiya va Moodboard'
  },
  {
    step_number: '04',
    slug: '04-konsepsiya-moodboard',
    title: 'Концепция интерьера / Moodboard',
    short_title: 'Konsepsiya',
    lead: 'Bo‘lajak interyerning vizual uslubi, ranglar gammasi, materiallar xarakteri va kayfiyatini ifodalovchi kollaj.',
    purpose: '3D vizualizatsiyaga kirishishdan oldin mijoz bilan interyerning umumiy ruhiyati va estetikasini aniq kelishib olish.',
    when_to_do: 'Rejalashtirish yechimi tasdiqlangandan so‘ng darhol.',
    checklist_title: 'Moodboard tarkibiy qismlari:',
    sections: [
      {
        heading: '1. Moodboard (Kayfiyat doskasi) elementlari',
        icon: '🎨',
        items: [
          'Tanlangan arxitektura uslubi (Minimalizm, Neoklassika, Skandinaviya, Wabi-Sabi)',
          'Asosiy rang palitrasi (60% asosiy fon, 30% ikkilamchi rang, 10% yorqin aksent)',
          'Materiallar fakturalari: tabiiy yog‘och, marmar, metall, shisha, beton, tekstil',
          'Mebellarning shakl va silueti (yumaloq, qat\'iy to‘g‘ri burchakli, oyoqli)',
          'Yoritish uslubi va moslamalar ko‘rinishi (lustra, spotlar, yashirin chiziqlar)',
          'Dekorativ san\'at va tekstil namunalari (pardalar, gilam, rasmlar)'
        ]
      },
      {
        heading: '2. Xonalararo uyg‘unlik',
        icon: '✨',
        items: [
          'Dahlizdan boshlab yotoqxona va sanuzelgacha bitta umumiy uslubiy chiziqni saqlash',
          'Materiallar va eshiklarning bir-biriga kontrast yoki mutanosib bo‘lishi',
          'Atmosfera: issiq va shinam, yoki salqin va qat\'iy zamonaviy'
        ]
      },
      {
        heading: '3. Bosqich yakuniy natijasi',
        icon: '🖼️',
        items: [
          'Har bir xona uchun alohida tasdiqlangan Moodboard albomi',
          'Mijoz bilan rang va teksturalar bo‘yicha to‘liq kelishuv bayonnomasi'
        ]
      }
    ],
    mistakes: [
      'Bitta xonadonda 4-5 xil bir-biriga mos kelmaydigan uslublarni aralashtirib yuborish',
      'Haqiqiy bozorda topilmaydigan material va ranglarni moodboardga kiritish',
      'Yoritish harorati (Kelvin) kontrastini e\'tibordan qochirish'
    ],
    next_step: '05-material-va-ranglar',
    next_title: '05 — Material va ranglar tanlovi'
  },
  {
    step_number: '05',
    slug: '05-material-va-ranglar',
    title: 'Materiallar va ranglar tanlovi',
    short_title: 'Material va ranglar',
    lead: 'Devor, pol, shift, profillar va dekorativ yuzalar uchun aniq pardozlash materiallarini tanlash va spetsifikatsiya qilish.',
    purpose: 'Dizaynni mavhum rasmdan real qurilish do‘konlarida sotiladigan sertifikatlangan materiallarga bog‘lash.',
    when_to_do: 'Konsepsiya tasdiqlangach, 3D modelga teksturalar yuklashdan oldin.',
    checklist_title: 'Tanlanadigan materiallar guruhlari:',
    sections: [
      {
        heading: '1. Devor pardozlash materiallari',
        icon: '🧱',
        items: [
          'Suv asosli premium mat bo‘yoqlar (Tikkurila, Benjamin Moore, Flugger)',
          'To‘qimali va yuviladigan oboylar, frelizinli asoslar',
          'Dekorativ suvoqlar: mikrotsement, travertin, ipak effekti',
          'MDF va yog‘och devor panellari, akustik shponli reyka panellar',
          'Keramogranit va tabiiy tosh plitalari (aksent devorlar uchun)'
        ]
      },
      {
        heading: '2. Pol va shift materiallari',
        icon: '🪵',
        items: [
          'Pol qoplamalari: muhandislik parketi, SPC vinil, laminat (33-sinf), keramogranit',
          'Shift qoplamalari: GKL KNAUF tizimlari, soya profillari (EuroKraab), bo‘yoq',
          'Yordamchi profillar: теневой плинтус, ajratuvchi profillar, LED chiziqlari',
          'Mini App "Materiallar Kutubxonasi"dagi haqiqiy xususiyatlar bilan solishtirish'
        ]
      },
      {
        heading: '3. Bosqich yakuniy natijasi',
        icon: '📦',
        items: [
          'Pardozlash materiallarining dastlabki vedomosti (artikul, brend, rang kodi)',
          'Buyurtmachi bilan ko‘rgazma zallarida jonli namunalar (samplar)ni tekshirish'
        ]
      }
    ],
    mistakes: [
      'Nam xonalar uchun namlikka chidamsiz materiallarni (oddiy laminat, standart GKL) tanlash',
      'Materiallar qalinligini hisobga olmasdan pol tutashmalarini (choklarni) loyihalash',
      'Do‘kondagi sun\'iy chiroqda material rangini ko‘rib, ob’yektda mutlaqo boshqa tus olishi'
    ],
    next_step: '06-3d-model-revit-bim',
    next_title: '06 — 3D Model (BIM / Revit)'
  },
  {
    step_number: '06',
    slug: '06-3d-model-revit-bim',
    title: '3D BIM Model yaratish (Revit)',
    short_title: '3D model',
    lead: 'Tasdiqlangan reja va materiallar asosida obyektning to‘liq parametrik 3D axborot modelini (BIM) qurish.',
    purpose: 'Geometrik xatoliklarni 3D fazoda ko‘rish, chizmalar va vizualizatsiya uchun yagona aniq ma\'lumotlar bazasini yaratish.',
    when_to_do: 'Reja va materiallar tanlangach, render qilishdan oldin.',
    checklist_title: 'Revit model tarkibiga kiruvchi asosiy toifalar:',
    sections: [
      {
        heading: '1. Model elementlari ierarxiyasi',
        icon: '🏛️',
        items: [
          'Sathlar (Levels) va Koordinata o‘qlari (Grids)',
          'Devorlar: ko‘p qatlamli (shtukaturka + g‘isht/gazoblok + pardozlash qatlami)',
          'Eshiklar va Derazalar: haqiqiy gabaritlar va furnituralari bilan',
          'Pol konstruktsiyasi: qora beton + izolyatsiya + styajka + toza qoplama',
          'Shift konstruksiyasi: karkas, GKL varaqlari, karniz nishalari, tushirilgan zonalar',
          'Oshxona garnituri va o‘rnatma mebellar parametrik oilalari (Families)',
          'Sanitariya jihozlari: unitaz, rakovina, smesitel, vanna, dush trapi',
          'Yoritgichlar va elektr jihozlari: spotlar, lyustralar, rozetka va kalitlar',
          'Xonalar (Rooms): aniq maydon va perimetr hisob-kitoblari bilan'
        ]
      },
      {
        heading: '2. Fazoviy to‘qnashuvlarni (Clash Detection) tekshirish',
        icon: '🔍',
        items: [
          'Kanalizatsiya quvuri va mebel tortmalarining to‘qnashuvini tekshirish',
          'Shift nishalari va ventilyatsiya trubalarining kesishmasligi',
          'Eshik ochilganda yoritgich yoki rozetkaga tegmasligi'
        ]
      },
      {
        heading: '3. Bosqich yakuniy natijasi',
        icon: '💻',
        items: [
          'To‘liq yig‘ilgan Revit / 3D BIM modeli (.rvt fayl)',
          'Vizualizatsiya dasturlariga (3ds Max, Corona, Enscape, Lumion) eksport qilishga tayyor baza'
        ]
      }
    ],
    mistakes: [
      'Modelda material qalinliklarini nol qilib ko‘rsatish',
      'Mebel oilalarini haqiqiy o‘lchamdan farqli qilib masshtablash',
      'Shift balandliklarini muhandislik kommunikatsiyalarini hisobga olmasdan tushirish'
    ],
    next_step: '07-3d-vizualizatsiya',
    next_title: '07 — 3D Vizualizatsiya'
  },
  {
    step_number: '07',
    slug: '07-3d-vizualizatsiya',
    title: '3D Vizualizatsiya va Fotorealistik Render',
    short_title: '3D vizualizatsiya',
    lead: 'Interyerni fotorealistik sifatda render qilish, yorug‘lik, tekstura va dekorlarni jonli ko‘rsatish.',
    purpose: 'Mijozga bo‘lajak uyi qanday ko‘rinishini 100% tushunarli, jozibador va real his qilish imkonini berish.',
    when_to_do: '3D model tayyor bo‘lgach, ishchi hujjatlarni rasmiylashtirishdan oldin.',
    checklist_title: 'Vizualizatsiya jarayoni bosqichlari:',
    sections: [
      {
        heading: '1. Sahna sozlamalari va Kompozitsiya',
        icon: '📷',
        items: [
          'Kamera rakurslarini inson ko‘zi balandligida (120-150 sm) o‘rnatish',
          'Perspektiva buzilishlarini to‘g‘rilash (Vertical tilt correction)',
          'Tabiiy quyosh yorug‘ligi (Sun/Sky yoki HDRI karta)',
          'Sun\'iy yoritgichlarning aniq rang harorati (2700K - 4000K) va yorug‘lik oqimi (Lm)',
          'PBR materiallar: g‘adir-budurlik (Roughness), aks etish (Reflection), relyef (Bump/Normal)',
          'Dekoratsiyalar: kitoblar, idishlar, o‘simliklar, tekstil va shinamlik detallari'
        ]
      },
      {
        heading: '2. Render va Post-processing',
        icon: '🖥️',
        items: [
          'Corona Renderer / V-Ray yoki real-vaqtli dvijoklarda yuqori aniqlikdagi render (4K)',
          'Photoshop orqali rang balansi va kontrastni yakuniy to‘g‘rilash',
          'Har bir asosiy xona uchun 3-5 tadan turli rakursdagi rasmlar'
        ]
      },
      {
        heading: '3. Bosqich yakuniy natijasi',
        icon: '🖼️',
        items: [
          'Mijozga taqdim etiladigan to‘liq 3D Vizualizatsiya albomi (PDF / JPG)',
          'Fotorealistik panoramik 360° virtual sayohat (zarur hollarda)'
        ]
      }
    ],
    mistakes: [
      'Haqiqatda mavjud bo‘lmagan nur manbalarini sun\'iy ravishda ko‘paytirib yuborish',
      'Kamera burchagini haddan tashqari keng (Fish-eye) qilib, xonani sun\'iy katta ko‘rsatish',
      'Materiallar shkalasini (UV map) noto‘g‘ri berib, marmar yoki parketni bahaybat ko‘rsatish'
    ],
    next_step: '08-mijoz-bilan-tasdiqlash',
    next_title: '08 — Mijoz bilan tasdiqlash'
  },
  {
    step_number: '08',
    slug: '08-mijoz-bilan-tasdiqlash',
    title: 'Mijoz bilan tasdiqlash jarayoni',
    short_title: 'Tasdiqlash',
    lead: 'Tayyor dizayn va renderlarni buyurtmachiga taqdim etish, mulohazalarni qabul qilish va loyihani yakuniy tasdiqlash.',
    purpose: 'Barcha g‘oyalar buyurtmachi xohishiga to‘liq mos kelganini hujjatlashtirish va qurilish chizmalariga o‘tishga rozilik olish.',
    when_to_do: '3D vizualizatsiya yakunlangach, rabochka chizmalarini boshlashdan avval.',
    checklist_title: 'Tasdiqlash bosqichlari:',
    sections: [
      {
        heading: '1. Taqdimot va Tekshiruv',
        icon: '🤝',
        items: [
          'Loyiha konsepsiyasi, reja va 3D renderlarni buyurtmachiga shaxsan yoki onlayn taqdim etish',
          'Mebel va materiallarning qulayligi, narxi va mavjudligini qayta ko‘rib chiqish',
          'Yoritish va elektr nuqtalarining mijoz turmush tarziga mosligini tekshirish'
        ]
      },
      {
        heading: '2. Tuzatishlar kiritish (Iteratsiya)',
        icon: '🔄',
        items: [
          'Mijozning asosli taklif va o‘zgartirishlarini yozma ravishda qayd etish',
          '3D model va renderlarga 1-2 bosqichli tuzatishlarni kiritish',
          'Qayta ko‘rsatish va kelishuvga erishish'
        ]
      },
      {
        heading: '3. Bosqich yakuniy natijasi',
        icon: '✍️',
        items: [
          'Buyurtmachi tomonidan imzolangan Yakuniy Dizayn Tasdiqlov Dalolatnomasi',
          'MUHIM: Tasdiqlanmagan dizayn asosida rabochka chizmalarini boshlash qat\'iyan tavsiya etilmaydi!'
        ]
      }
    ],
    mistakes: [
      'Mijoz tasdiqlamasdan turib qurilish chizmalarini chizishga kirishish (qayta ishlashga olib keladi)',
      'O‘zgarishlarni yozma qayd etmasdan, keyin kim nima deganini isbotlay olmaslik'
    ],
    next_step: '09-rabochkaga-tayyorlash',
    next_title: '09 — Rabochaya dokumentatsiyaga tayyorlash'
  },
  {
    step_number: '09',
    slug: '09-rabochkaga-tayyorlash',
    title: 'Rabochaya dokumentatsiyaga tayyorlash',
    short_title: 'Rabochkaga tayyorlash',
    lead: 'Tasdiqlangan dizayn modelini qurilish ishchi hujjatlari (rabochka) ishlab chiqish uchun to‘liq sinxronlash va tekshirish.',
    purpose: 'Dizayndan qurilish bosqichiga xatosiz o‘tishni ta\'minlash, barcha mebel va texnikalarning yakuniy gabaritlarini qotirish.',
    when_to_do: 'Dizayn tasdiqlangach, qurilish chizmalari albomini shakllantirishdan oldin.',
    checklist_title: 'Tekshiriladigan yakuniy parametrlar:',
    sections: [
      {
        heading: '1. Model va Chizmalar Sinxronizatsiyasi',
        icon: '⚙️',
        items: [
          'BIM modeldagi barcha devorlar, nishalar va oraliqlar yakuniy tasdiq bilan solishtirilgan',
          'Sotib olinadigan mebel va texnikalarning aniq pasportlari yuklangan',
          'Santexnika va elektr tugunlarining bog‘lamalari tekshirilgan',
          'Loyiha endi to‘liq "INTERYER RABOCHKA QILISH JARAYONI"ga o‘tishga tayyor'
        ]
      },
      {
        heading: '2. Bosqich yakuniy natijasi',
        icon: '🚀',
        items: [
          'Qurilish chizmalari uchun 100% tayyor parametrik raqamli zamin',
          'Interyer rabochka bo‘limiga yo‘naltirish'
        ]
      }
    ],
    mistakes: [
      'Haqiqiy texnika pasportini olmasdan, taxminiy o‘lchamlar bilan rabochkaga o‘tish'
    ],
    next_step: 'rabochka-hub',
    next_title: 'Interyer Rabochka Qilish Jarayoniga O‘tish →'
  }
];

// 2. RABOCHKA PROCESS (21 steps)
const RABOCHKA_STEPS = [
  {
    step_number: '01',
    slug: '01-umumiy-malumotlar-titul',
    title: 'Umumiy ma\'lumotlar va Titul varag‘i',
    lead: 'Ishchi loyiha (Рабочая документация) albomining mundarijasi, shartli belgilar, tushuntirish xati va qonuniy me\'yorlari.',
    content_summary: 'Bu varaq quruvchi, usta va buyurtmachi uchun loyihaning pasporti hisoblanadi. Chizmalarni qanday o‘qish, masshtablar, xonalar eksplikatsiyasi va barcha belgilashlar shu yerda jamlanadi.',
    sheets: ['Titul varag‘i (Лист обложки)', 'Chizmalar ro‘yxati (Ведомость чертежей)', 'Tushuntirish xati (Пояснительная записка)', 'Xonalar eksplikatsiyasi (Экспликация помещений)', 'Shartli belgilar (Условные обозначения)'],
    rules: [
      'Barcha chizmalar millimetrda (mm) berilishi qat\'iy shart.',
      'Nisbiy 0.000 sathi sifatida birinchi qavat toza pol sathi qabul qilinadi.',
      'Har qanday tafovut aniqlanganda, usta o‘zboshimchalik qilmasdan loyiha muallifiga murojaat qilishi shart.'
    ]
  },
  {
    step_number: '02',
    slug: '02-obmer-mavjud-holat',
    title: 'Обмер / Mavjud holat chizmasi',
    lead: 'Ob’yektning ta\'mirdan oldingi haqiqiy geometriyasi, mavjud devorlari, balandliklari va muhandislik shaxtalari.',
    content_summary: 'Qurilish boshlanishida nima borligini ko‘rsatuvchi tayanch chizma. Barcha yangi chizmalar aynan shu mavjud holat ustiga quriladi.',
    sheets: ['Mavjud holat rejasi (Обмерный план)', 'Balandliklar va rigellar sxemasi', 'Mavjud kommunikatsiyalar bog‘lamasi'],
    rules: [
      'Devorlarning qalinligi va materiali (g‘isht, monolit, gazoblok) alohida shtrixovka bilan ko‘rsatiladi.',
      'Ventilyatsiya va kanalizatsiya stoyaklarining aniq o‘lchamlari va ularga bog‘lanishlar beriladi.'
    ]
  },
  {
    step_number: '03',
    slug: '03-demontaj-rejasi',
    title: 'Demontaj rejasi (План демонтажа)',
    lead: 'Buzilishi, olib tashlanishi va kengaytirilishi kerak bo‘lgan eski devorlar, eshik o‘rinlari va to‘siqlar chizmasi.',
    content_summary: 'Ustalar qaysi devorni buzish kerakligini adashtirmasligi uchun demontaj qilinadigan barcha elementlar qizil rang yoki maxsus shtrix bilan aniq ko‘rsatiladi.',
    sheets: ['Demontaj qilinadigan devorlar rejasi', 'Demontaj qilinadigan eshik va deraza bloklari', 'Chiqindi hajmi spetsifikatsiyasi'],
    rules: [
      'Yuk ko‘taruvchi (monolit) devor va kolonnalarni buzish qat\'iyan taqiqlanadi deb qizil ramkada yozilishi shart.',
      'Buziladigan qismlarning balandligi va hajmi (m³) ko‘rsatiladi.'
    ]
  },
  {
    step_number: '04',
    slug: '04-montaj-rejasi',
    title: 'Montaj rejasi (План монтажа перегородок)',
    lead: 'Yangi quriladigan oraliq devorlar, GKL to‘siqlar, dekorativ nishalar va yangi eshik o‘rinlari chizmasi.',
    content_summary: 'Devor ustalari uchun asosiy yo‘riqnoma. Har bir yangi devor qaysi materialdan (gazoblok 100mm, gipsokarton 100mm, g‘isht) qurilishi aniq ko‘rsatiladi.',
    sheets: ['Yangi devorlar montaj rejasi', 'GKL karkas va nishalar konstruksiyasi kesimlari', 'Eshik o‘rni parametrlar jadvali'],
    rules: [
      'Eshik o‘rni kengligi eshik polotnosidan 80-100 mm kengroq bo‘lishi shart.',
      'Devorlarning bir-biri bilan 90° burchak hosil qilishi kerak bo‘lgan zonalari maxsus belgi bilan ajratiladi.'
    ]
  },
  {
    step_number: '05',
    slug: '05-olchamlar-rejasi',
    title: 'O‘lchamlar rejasi (Кладочный / Размерочный план)',
    lead: 'Yangi qurilgan xonalarning barcha devorlari, burchaklari va oraliqlarining to‘liq zanjirsimon o‘lchamlari.',
    content_summary: 'Har bir xonaning ichki toza o‘lchamlari, mebellar uchun ajratilgan nishalar kengligi va umumiy gabarit o‘lchamlar.',
    sheets: ['Xonalar o‘lchamlari rejasi', 'Nishalar va dekorativ bo‘rtmalar bog‘lamasi', 'Tozalangan xonalar eksplikatsiyasi'],
    rules: [
      'O‘lcham zanjirlari uzluksiz bo‘lishi va umumiy xona o‘lchamiga teng kelishi kerak.',
      'Pardozlash qatlami qalinligi (shtukaturka 15-20 mm) hisobga olingan yoki olinmaganligi izohda yoziladi.'
    ]
  },
  {
    step_number: '06',
    slug: '06-pol-rejasi',
    title: 'Pol qoplamalari rejasi (План полов)',
    lead: 'Pol materiallari turlari, yotqizish yo‘nalishi, tutashma choklari, sath farqlari va plintuslar.',
    content_summary: 'Laminat, parket, kafel va vinilning qayerda tugab qayerda boshlanishi, eshik ostidagi tutashma chiziqlari aniq ko‘rsatiladi.',
    sheets: ['Pol materiallari rejasi', 'Pol sathlari va qalinliklari kesimi (Пирог пола)', 'Tutashma profillari va deformatsion choklar sxemasi'],
    rules: [
      'Turli materiallar tutashmasi eshik polotnosi yopilganda uning ostida qolishi shart.',
      'Plintus va теневой профиль pol materiali sifatida emas, alohida chizma elementi sifatida beriladi.'
    ]
  },
  {
    step_number: '07',
    slug: '07-shift-rejasi',
    title: 'Shift konstruksiyalari rejasi (План потолков)',
    lead: 'Shift balandliklari, GKL karkas pog‘onalari, karniz nishalari, soya profillari va revizion lyuklar.',
    content_summary: 'Shift ustalari uchun reja: qayerda shift qancha pastga tushadi, parda nishasi qayerda joylashadi, yashirin chiziqlar qanday o‘rnatiladi.',
    sheets: ['Shift sathi va materiallari rejasi', 'Shift kesimlari va karkas detallari', 'Parda nishasi va karniz tugunlari'],
    rules: [
      'Har bir zona uchun toza pol sathidan shiftgacha bo‘lgan aniq balandlik (masalan: +2750 mm) ko‘rsatiladi.',
      'Parda nishasi kengligi kamida 180-200 mm bo‘lishi shart (radiator va deraza tokchasini hisobga olgan holda).'
    ]
  },
  {
    step_number: '08',
    slug: '08-pardozlash-rejasi',
    title: 'Pardozlash rejasi (План отделки помещений)',
    lead: 'Har bir devor va xonaning pardozlash turi: bo‘yoq kodi, oboy artikuli, dekorativ panellar va plitkalar.',
    content_summary: 'Xona devorlari qanday material bilan qoplanishi kodlar bilan ko‘rsatiladi (masalan: С-01 - Tikkurila F484, С-02 - MDF panel).',
    sheets: ['Xonalar bo‘yicha devor pardozlash rejasi', 'Pardozlash materiallari shifrlari jadvali', 'Ranglar palitrasi kartasi'],
    rules: [
      'Har bir material kodi albomdagi materiallar spetsifikatsiyasi bilan 100% mos kelishi shart.'
    ]
  },
  {
    step_number: '09',
    slug: '09-devor-razvertkalari',
    title: 'Devor razvertkalari (Развертки стен)',
    lead: 'Barcha muhim xonalar (oshxona, sanuzel, yotoqxona, zal) devorlarining to‘liq frontal yoyilmasi.',
    content_summary: 'Har bir devor alohida ko‘rinishda chiziladi: plitka choklari, rozetkalar balandligi, mebel balandligi, ko‘zgu va chiroqlar koordinatalari.',
    sheets: ['Sanuzel devorlari razvertkalari (plitka choklari bilan)', 'Oshxona ishchi devori razvertkasi (fartuk va rozetkalar)', 'Mehmonxona TV-zona va yotoqxona spinka razvertkalari'],
    rules: [
      'Rozetkalar va kalitlar mebel yoki dekorativ moldinglar bilan kesishmasligi aniq ko‘rsatiladi.',
      'Plitka kesimlari (podrezkalar) ko‘zga tashlanmaydigan burchaklarga yashiriladi.'
    ]
  },
  {
    step_number: '10',
    slug: '10-elektr-va-rozetkalar',
    title: 'Elektr jihozlari va Rozetkalar rejasi',
    lead: 'Barcha 220V rozetkalar, USB, TV, internet nuqtalari, ularning aniq balandliklari va o‘qlari.',
    content_summary: 'Elektrchilar uchun asosiy chizma. Har bir rozetkaning devor burchagidan masofasi va poldan balandligi (h=+300, h=+900, h=+1100).',
    sheets: ['Kuchlanish rozetkalari rejasi', 'Past kuchlanishli tarmoqlar (TV, Internet, Wi-Fi, Domofon, Smart Home)', 'Oshxona maishiy texnikasi rozetkalar sxemasi'],
    rules: [
      'Muzlatgich, duxovka, idish yuvish mashinasi rozetkalari texnika ortida emas, yonidagi shkafda (h=+100 mm) bo‘lishi lozim.',
      'Sanuzel rozetkalari suv manbalaridan kamida 600 mm uzoqda va IP44 himoyalangan bo‘lishi shart.'
    ]
  },
  {
    step_number: '11',
    slug: '11-santexnika-rejasi',
    title: 'Santexnika va Suv ta\'minoti rejasi',
    lead: 'Suv va kanalizatsiya chiqish nuqtalari, vodorozetkalar balandligi, traplar va revizion lyuklar joylashuvi.',
    content_summary: 'Santexniklar uchun chizma: rakovina, unitaz, dush, vanna, kir yuvish va idish yuvish mashinalarining ulanish o‘qlari.',
    sheets: ['Santexnika nuqtalari bog‘lamasi rejasi', 'Suv taqsimlash kollektori va filtrlar tuguni sxemasi', 'Kanalizatsiya trassalari va traplar qiyaligi'],
    rules: [
      'Gidroizolyatsiya chegaralari va trap qiyaligi qat\'iy ko‘rsatiladi.',
      'Suv rozetkalari oraliq masofasi (smesitel uchun) aniq 150 mm bo‘lishi shart.'
    ]
  },
  {
    step_number: '12',
    slug: '12-ventilyatsiya-va-konditsioner',
    title: 'Klimat va Ventilyatsiya rejasi (ОВиК)',
    lead: 'Konditsioner ichki va tashqi bloklari, freon trassalari, drenaj yo‘nalishlari va ventilyatsiya panjaralari.',
    content_summary: 'Konditsioner ustalari uchun ko‘rsatma: split-tizimlar qayerga osiladi, drenaj qayerga oqiziladi (kanalizatsiyaga quruq sifon orqali).',
    sheets: ['Konditsioner va shamollatish rejasi', 'Freon va drenaj trassalari sxemasi', 'Ventilyatsiya kanallari va diffuzorlar'],
    rules: [
      'Konditsioner havosi to‘g‘ridan-to‘g‘ri krovat yoki divanda o‘tirgan odamga urilmasligi kerak.',
      'Drenaj trubasining o‘z-o‘zidan oqish nishabligi kamida 1 metrga 1-2 sm bo‘lishi shart.'
    ]
  },
  {
    step_number: '13',
    slug: '13-oshxona-chizmasi',
    title: 'Oshxona mebeli va kommunikatsiyalari chizmasi',
    lead: 'Oshxona garnituri modullari, stoleshnitsa, fartuk, o‘rnatma texnika va ularning muhandislik bog‘lamalari.',
    content_summary: 'Oshxona ustalari va montajchilar uchun maxsus varaq: pastki/yuqori shkaflar, penal, vityajka va rozetkalar joylashuvi.',
    sheets: ['Oshxona modullari rejasi va fasadlari', 'Oshxona kommunikatsiyalari (suv, elektr, ventilyatsiya) bog‘lamasi', 'Oshxona fartuki razvertkasi'],
    rules: [
      'Vityajka rozetkasi va havo trubasi aniq o‘qda bo‘lishi kerak.',
      'Idish yuvish mashinasi (posudomoyka) rakovinaga yaqin (1 metr ichida) joylashishi shart.'
    ]
  },
  {
    step_number: '14',
    slug: '14-individual-mebel-chizmalari',
    title: 'Individual mebellar texnik chizmalari',
    lead: 'Buyurtma asosida tayyorlanadigan shkaflar, krovat, TV-zona, dahliz mebeli va stollarning texnik loyihasi.',
    content_summary: 'Mebel sexiga topshiriladigan chizmalar: Шкаф №01, Тумба №01, ТВ-зона №01, tashqi ko‘rinishi, ichki polkalari, gabaritlari va materiallari.',
    sheets: ['Garderob va o‘rnatma shkaflar ichki tuzilishi', 'Vanna xonasi mebellari va rakovina tagliklari', 'TV-zona dekorativ konstruktsiyasi kesimlari'],
    rules: [
      'Kiyim ilish bo‘limining toza balandligi uzun kiyimlar uchun kamida 1400-1500 mm bo‘lishi kerak.',
      'Shkaf sokoli (tagligi) balandligi devor plintusi balandligidan kam bo‘lmasligi lozim.'
    ]
  },
  {
    step_number: '15',
    slug: '15-eshiklar-vedomosti',
    title: 'Eshiklar va O‘rinlar vedomosti',
    lead: 'Barcha xonalararo eshiklar o‘lchami, ochilish yo‘nalishi (chap/o‘ng), polotno turi, qulf va tutqichlar.',
    content_summary: 'Eshik sotuvchilari va o‘rnatuvchilar uchun jadval: har bir eshikning modeli, o‘lchami (masalan: 800x2000 mm), qutisi va ochilish yo‘nalishi.',
    sheets: ['Eshiklar joylashuvi va ochilish yo‘nalishlari rejasi', 'Eshiklar spetsifikatsiyasi jadvali', 'Yashirin eshiklar (Invisible) montaj tugunlari'],
    rules: [
      'Sanuzel eshigi qoidaga ko‘ra tashqariga ochilishi kerak (xavfsizlik talabi).',
      'Yashirin eshiklar devor shpaklyovka qilinishidan oldin, qora ish paytida o‘rnatiladi.'
    ]
  },
  {
    step_number: '16',
    slug: '16-yoritish-guruhi-va-kalitlar',
    title: 'Yoritish guruhlari va Boshqarish sxemasi',
    lead: 'Chiroqlar joylashuvi, yoritish guruhlari, 1-2 klavishli kalitlar, prokhodnoy (o‘tuvchi) kalitlar va dimmerlar.',
    content_summary: 'Qaysi kalit qaysi chiroqni yoqishini ko‘rsatuvchi mantiqiy bog‘lovchi chizma chiziqlari.',
    sheets: ['Yoritgichlar joylashuvi rejasi', 'Kalitlar bog‘lamasi va boshqaruv guruhlari sxemasi', 'Yoritish ssenariylari jadvali'],
    rules: [
      'Kalitlar xonaga kirishda eshik tutqichi tomonidan 900 mm balandlikda bo‘lishi lozim.',
      'Yotoqxonada krovat yonida va dahliz boshida o‘tuvchi (prokhodnoy) kalitlar ko‘zda tutiladi.'
    ]
  },
  {
    step_number: '17',
    slug: '17-yoritish-spetsifikatsiyasi',
    title: 'Yoritgichlar spetsifikatsiyasi',
    lead: 'Loyiha uchun tanlangan barcha chiroqlar, lyustralar, spotlar va LED tasmalarning to‘liq katalogi.',
    content_summary: 'Har bir chiroq kodi (L-01, L-02), modeli, quvvati, rang harorati (3000K), gabarit o‘lchami va soni ko‘rsatilgan jadval.',
    sheets: ['Yoritgichlar to‘liq spetsifikatsiyasi', 'LED lenta quvvat bloklari va kontrollerlar hisobi'],
    rules: [
      'Bitta xonadagi asosiy yoritishning rang harorati bir xil (masalan: 3000K iliq oq) bo‘lishi lozim.'
    ]
  },
  {
    step_number: '18',
    slug: '18-materiallar-spetsifikatsiyasi',
    title: 'Pardozlash materiallari vedomosti',
    lead: 'Laminat, parket, kafel, plitka, bo‘yoq, oboy va boshqa pardozlash materiallarining aniq hisob-kitobi.',
    content_summary: 'Smetachilar va xarid bo‘limi uchun jadval: qaysi materialdan qancha kvadrat metr (m²) yoki dona kerakligi, 10-15% zaxira (zapas) bilan hisoblangan.',
    sheets: ['Pol materiallari sarf miqdori jadvali', 'Devor pardozlash materiallari vedomosti', 'Mini App Materiallar kutubxonasi havolalari'],
    rules: [
      'Plitka va pol qoplamalari diagonali yoki murakkab terilishida kamida 10-15% qiyqim (podrezka) zaxirasi qo‘shiladi.'
    ]
  },
  {
    step_number: '19',
    slug: '19-jihozlar-spetsifikatsiyasi',
    title: 'Santexnika va Mebellar vedomosti',
    lead: 'Unitaz, vanna, smesitellar, maishiy texnikalar va tayyor mebellarning to‘liq ro‘yxati.',
    content_summary: 'Xarid qilinadigan barcha tayyor buyumlar: modeli, ishlab chiqaruvchisi, o‘lchamlari, narxi va do‘kon havolalari.',
    sheets: ['Santexnika jihozlari spetsifikatsiyasi', 'Maishiy texnikalar spetsifikatsiyasi', 'Tayyor mebel va dekor buyumlari jadvali'],
    rules: [
      'Santexnika jihozlarining montaj sxemalari ilova qilinishi shart.'
    ]
  },
  {
    step_number: '20',
    slug: '20-yakuniy-tekshiruv-checklist',
    title: 'Yakuniy tekshiruv (QC Checklist)',
    lead: 'Chizmalar albomini buyurtmachi va quruvchiga topshirishdan oldin sifat nazorati (QA/QC) tekshiruv ro‘yxati.',
    content_summary: 'Dizayner albomni chop etishdan oldin 14 ta asosiy nomuvofiqlikni tekshirib chiqadi.',
    sheets: ['Loyiha mualliflik nazorati chek-varag‘i', 'Barcha bo‘limlararo to‘qnashuvlarni tekshirish jadvali'],
    checklist_items: [
      'Plan va 3D vizualizatsiyaning 100% mosligi tekshirildi',
      'Plan va devor razvertkalari o‘lchamlari o‘zaro solishtirildi',
      'Rozetkalar va mebellar to‘qnashuvi yo‘qligi tasdiqlandi',
      'Elektr kalitlari va yoritish guruhlari to‘g‘ri bog‘landi',
      'Santexnika chiqishlari va mebellar mosligi tekshirildi',
      'Shift nishalari va yoritgichlar o‘lchami solishtirildi',
      'Pol tutashmalari eshik polotnolari ostiga to‘g‘ri tushdi',
      'Barcha material kodlari (С-01, П-01) vedomost bilan mos',
      'Barcha chizmalarda zanjirli o‘lchamlar to‘liq qo‘yildi',
      'Markirovka va shartli belgilar to‘liq tushuntirildi',
      'Spetsifikatsiya miqdorlari chizmadagi maydonlar bilan teng',
      'Varaqlar raqamlanishi va mundarija to‘g‘ri tuzildi',
      'Chizma masshtablari va ramka shtamplari to‘ldirildi',
      'Loyiha me\'moriy va muhandislik normalariga (SHNQ) muvofiq'
    ]
  },
  {
    step_number: '21',
    slug: '21-pdf-albom-yakuniy-loyha',
    title: 'PDF Albom / Yakuniy ishchi loyiha',
    lead: 'Chop etish va qurilish maydoniga taqdim etish uchun to‘liq yig‘ilgan A3 formatdagi ishchi loyiha albomi.',
    content_summary: 'Loyiha yakuni! 21 ta bo‘limdan iborat to‘liq professional ishchi hujjatlar to‘plami PDF formatida eksport qilinadi.',
    sheets: [
      '01 — Titul va umumiy ma\'lumotlar',
      '02 — Obmer (Mavjud holat rejasi)',
      '03 — Demontaj rejasi',
      '04 — Montaj rejasi',
      '05 — O‘lchamlar rejasi',
      '06 — Pol qoplamalari rejasi',
      '07 — Shift konstruksiyalari rejasi',
      '08 — Pardozlash rejasi',
      '09 — Devor razvertkalari',
      '10 — Elektr va rozetkalar rejasi',
      '11 — Santexnika nuqtalari rejasi',
      '12 — Ventilyatsiya va konditsioner rejasi',
      '13 — Oshxona mebeli va kommunikatsiyalari',
      '14 — Individual mebel chizmalari',
      '15 — Eshiklar vedomosti',
      '16 — Yoritish guruhlari va kalitlar sxemasi',
      '17 — Yoritgichlar spetsifikatsiyasi',
      '18 — Materiallar vedomosti',
      '19 — Mebel va jihozlar spetsifikatsiyasi',
      '20 — Yakuniy tekshiruv dalolatnomasi',
      '21 — Albom yakuni va mualliflik muhri'
    ],
    rules: [
      'Albom A3 gorizontal formatda, o‘qilishi oson shriftlar bilan chiqariladi.',
      'Qurilish maydonida kamida 2 nusxa (biri brigada uchun, biri nazorat uchun) bo‘lishi lozim.'
    ]
  }
];

// Write designProcessData.js
const designCode = `// designProcessData.js
// 9 ta asosiy bosqichdan iborat Interyer Dizayn Qilish Jarayoni ma'lumotlar bazasi

const DESIGN_PROCESS_STEPS = ${JSON.stringify(DESIGN_STEPS, null, 2)};

module.exports = {
  DESIGN_PROCESS_STEPS
};
`;

fs.writeFileSync(path.join(__dirname, '..', 'designProcessData.js'), designCode, 'utf8');
console.log('Successfully created designProcessData.js');

// Write rabochkaProcessData.js
const rabochkaCode = `// rabochkaProcessData.js
// 21 ta bosqichdan iborat Interyer Rabochka Qilish Jarayoni (Рабочая документация) ma'lumotlar bazasi

const RABOCHKA_PROCESS_STEPS = ${JSON.stringify(RABOCHKA_STEPS, null, 2)};

module.exports = {
  RABOCHKA_PROCESS_STEPS
};
`;

fs.writeFileSync(path.join(__dirname, '..', 'rabochkaProcessData.js'), rabochkaCode, 'utf8');
console.log('Successfully created rabochkaProcessData.js');
