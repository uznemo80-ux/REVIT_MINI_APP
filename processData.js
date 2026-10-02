// ======================================================
// YOSHUZBEKK Academy — Interyer va Remont Bosqichlari ("Jarayon") Bilimlar Bazasi
// To'liq 23 kategoriya va 220 ta professional jarayon elementlari
// ======================================================


const PROCESS_CATEGORIES = [
  {
    "id": 1,
    "code": "01",
    "slug": "01-loyihalash-va-tayyorgarlik",
    "title": "Loyihalash va tayyorgarlik",
    "icon": "📐",
    "filter": "Loyihalash",
    "description": "Texnik topshiriq, o‘lchov, dizayn-loyiha, ishchi chizmalar va smetani shakllantirish bosqichi.",
    "order_index": 1,
    "is_active": true
  },
  {
    "id": 2,
    "code": "02",
    "slug": "02-demontaj-ishlari",
    "title": "Demontaj ishlari",
    "icon": "🔨",
    "filter": "Demontaj",
    "description": "Eski mebel, qoplama, santexnika, elektr va to‘siqlarni xavfsiz buzish hamda ob’yektni tozalash.",
    "order_index": 2,
    "is_active": true
  },
  {
    "id": 3,
    "code": "03",
    "slug": "03-qurilish-va-rejalashtirish",
    "title": "Qurilish va rejalashtirish ishlari",
    "icon": "🧱",
    "filter": "Qurilish",
    "description": "Yangi oraliq devorlarni terish, GKL to‘siqlar, eshik o‘rinlari va shaxtalarni tiklash.",
    "order_index": 3,
    "is_active": true
  },
  {
    "id": 4,
    "code": "04",
    "slug": "04-elektr-montaj",
    "title": "Elektr montaj",
    "icon": "⚡",
    "filter": "Elektr",
    "description": "Kabel yo‘nalishlari, shtroblash, podrozetniklar, kuch va yoritish liniyalari hamda taqsimlash qalqoni.",
    "order_index": 4,
    "is_active": true
  },
  {
    "id": 5,
    "code": "05",
    "slug": "05-santexnika-va-kanalizatsiya",
    "title": "Santexnika va kanalizatsiya",
    "icon": "🚰",
    "filter": "Santexnika",
    "description": "Suv taqsimoti, kanalizatsiya quvurlari, kollektor, filtrlar, traplar va gidravlik sinovlar.",
    "order_index": 5,
    "is_active": true
  },
  {
    "id": 6,
    "code": "06",
    "slug": "06-klimat-va-ventilyatsiya",
    "title": "Klimat va ventilyatsiya",
    "icon": "❄️",
    "filter": "HVAC",
    "description": "Konditsioner freon va drenaj trassalari, ventilyatsiya kanallari va shamollatish tizimlari.",
    "order_index": 6,
    "is_active": true
  },
  {
    "id": 7,
    "code": "07",
    "slug": "07-oyna-va-eshiklar",
    "title": "Oyna va eshiklar",
    "icon": "🚪",
    "filter": "Qurilish",
    "description": "Deraza bloklari montaji, otkoslar, balkon bloki va asosiy kirish temir eshigi.",
    "order_index": 7,
    "is_active": true
  },
  {
    "id": 8,
    "code": "08",
    "slug": "08-polni-tayyorlash",
    "title": "Polni tayyorlash",
    "icon": "🪵",
    "filter": "Pol",
    "description": "Pol sathini tekshirish, issiq pol, shumo/gidroizolyatsiya, yarim quruq yoki quruq styajka.",
    "order_index": 8,
    "is_active": true
  },
  {
    "id": 9,
    "code": "09",
    "slug": "09-devorlarni-qora-ishga-tayyorlash",
    "title": "Devorlarni qora ishga tayyorlash",
    "icon": "🧱",
    "filter": "Devor",
    "description": "Gruntovka, mayaklar bo‘yicha shtukaturka qilish, 90° burchaklar va quritish.",
    "order_index": 9,
    "is_active": true
  },
  {
    "id": 10,
    "code": "10",
    "slug": "10-shift",
    "title": "Shift",
    "icon": "🏛️",
    "filter": "Shift",
    "description": "GKL karkas tizimlari, tushirilgan shiftlar, turlicha nishalar, karniz va yashirin profillar.",
    "order_index": 10,
    "is_active": true
  },
  {
    "id": 11,
    "code": "11",
    "slug": "11-santexnika-gidroizolyatsiya",
    "title": "Santexnika xonalarining gidroizolyatsiyasi",
    "icon": "🛡️",
    "filter": "Santexnika",
    "description": "Hammom va sanuzel pol hamda devorlarining to‘liq choksiz gidroizolyatsiyasi va sinovi.",
    "order_index": 11,
    "is_active": true
  },
  {
    "id": 12,
    "code": "12",
    "slug": "12-keramik-plitka",
    "title": "Keramik plitka",
    "icon": "🟧",
    "filter": "Plitka",
    "description": "Kafel, keramogranit, choklarni tekislash (SVP), 45° burchaklar va to‘ldirish (zavirka).",
    "order_index": 12,
    "is_active": true
  },
  {
    "id": 13,
    "code": "13",
    "slug": "13-shpaklyovka-va-boyoq",
    "title": "Shpaklyovka va bo‘yoq",
    "icon": "🎨",
    "filter": "Bo‘yoq",
    "description": "Shpaklyovka qatlamlari, stekloxolst, silliqlash va yuqori sifatli bo‘yash.",
    "order_index": 13,
    "is_active": true
  },
  {
    "id": 14,
    "code": "14",
    "slug": "14-pol-qoplamalari",
    "title": "Pol qoplamalari",
    "icon": "🪵",
    "filter": "Pol",
    "description": "Laminat, parket, SPC/vinil yotqizish, deformatsion choklar va plintus montaji.",
    "order_index": 14,
    "is_active": true
  },
  {
    "id": 15,
    "code": "15",
    "slug": "15-ichki-eshiklar",
    "title": "Ichki eshiklar",
    "icon": "🚪",
    "filter": "Mebel",
    "description": "Xonalararo eshik bloklari, yashirin eshiklar (invisible), qulflar va tutqichlar montaji.",
    "order_index": 15,
    "is_active": true
  },
  {
    "id": 16,
    "code": "16",
    "slug": "16-oshxona-va-builtin-mebel",
    "title": "Oshxona va built-in mebel",
    "icon": "🍳",
    "filter": "Mebel",
    "description": "Oshxona garnituri, stoleshnitsa, fartuk, o‘rnatma maishiy texnika va shkaflar.",
    "order_index": 16,
    "is_active": true
  },
  {
    "id": 17,
    "code": "17",
    "slug": "17-sanitary-jihozlar",
    "title": "Sanitary jihozlar",
    "icon": "🛁",
    "filter": "Santexnika",
    "description": "Unitaz, vanna, dush pardasi, smesitellar, rakovina va aksessuarlarning yakuniy montaji.",
    "order_index": 17,
    "is_active": true
  },
  {
    "id": 18,
    "code": "18",
    "slug": "18-elektr-jihozlarini-yakuniy-ornatish",
    "title": "Elektr jihozlarini yakuniy o‘rnatish",
    "icon": "💡",
    "filter": "Elektr",
    "description": "Rozetka mexanizmlari, ramkalar, lyustra, spotlar, LED tasmalar va qalqon kommutatsiyasi.",
    "order_index": 18,
    "is_active": true
  },
  {
    "id": 19,
    "code": "19",
    "slug": "19-klimat-jihozlari",
    "title": "Klimat jihozlari",
    "icon": "🌡️",
    "filter": "HVAC",
    "description": "Konditsioner ichki bloklarini ilish, vakuumlash, ishga tushirish va termostatlar.",
    "order_index": 19,
    "is_active": true
  },
  {
    "id": 20,
    "code": "20",
    "slug": "20-dekor-va-interyerni-yakunlash",
    "title": "Dekor va interyerni yakunlash",
    "icon": "🖼️",
    "filter": "Dekor",
    "description": "Pardalar, gilamlar, oynalar, rasmlar, dekorativ yoritish va yumshoq mebellarni joylashtirish.",
    "order_index": 20,
    "is_active": true
  },
  {
    "id": 21,
    "code": "21",
    "slug": "21-yakuniy-tozalash",
    "title": "Yakuniy tozalash",
    "icon": "🧹",
    "filter": "Topshirish",
    "description": "Qurilish changlarini professional tozalash, oyna, santexnika va mebellarni artish.",
    "order_index": 21,
    "is_active": true
  },
  {
    "id": 22,
    "code": "22",
    "slug": "22-qa-qc-sifat-nazorati",
    "title": "QA/QC — sifat nazorati",
    "icon": "🔍",
    "filter": "Sifat nazorati",
    "description": "Geometriya, sath, elektr, santexnika, mebel va choklarning nazorat ro‘yxati (defektlar dalolatnomasi).",
    "order_index": 22,
    "is_active": true
  },
  {
    "id": 23,
    "code": "23",
    "slug": "23-obyektni-topshirish",
    "title": "Obyektni topshirish",
    "icon": "🔑",
    "filter": "Topshirish",
    "description": "Yakuniy qabul-topshirish dalolatnomasi, as-built chizmalar, kafolatlar va kalitlarni berish.",
    "order_index": 23,
    "is_active": true
  }
];

const PROCESS_ITEMS = [
  {
    "category_id": 1,
    "category_code": "01",
    "category_slug": "01-loyihalash-va-tayyorgarlik",
    "category_title": "Loyihalash va tayyorgarlik",
    "category_icon": "📐",
    "slug": "01-texnik-topshiriq-тз-tuzish",
    "title": "Texnik topshiriq (ТЗ) tuzish",
    "short_description": "Texnik topshiriq (ТЗ) tuzish — ta'mirlash loyihasining boshlang‘ich poydevori bo‘lib, kelgusi barcha qurilish-montaj ishlarining aniqligi va byudjetini belgilab beradi.",
    "purpose": "Xatolarni qurilish maydonida emas, qog‘oz va raqamli modelda oldindan ko‘rib bartaraf etish, buyurtmachi va ustalar o‘rtasida aniq texnik kelishuvga erishish.",
    "when_to_do": "Ta'mirlash boshlanishidan oldin, har qanday jismoniy buzish yoki qurish ishlariga kirishmasdan avval.",
    "before_start": "Ob’yektga to‘liq kirish imkoni, mavjud texnik pasport nusxasi va buyurtmachining asosiy talablar ro‘yxati.",
    "step_by_step": [
      "Dastlabki ma'lumotlarni yig‘ish va buyurtmachi bilan suhbat o‘tkazish.",
      "Ob’yektda barcha o‘lchovlarni lazerli va mexanik asboblar bilan olish.",
      "Olingan ma'lumotlarni BIM yoki SAPR dasturiga (Revit, AutoCAD) kiritish.",
      "Muhandislik tarmoqlari va konstruktiv cheklovlarni tahlil qilish.",
      "Chizmalarni loyiha standartlariga muvofiq rasmiylashtirish va tasdiqlash."
    ],
    "rules": [
      "Barcha o‘lchamlar millimetrda (mm) olinishi va qayd etilishi shart.",
      "Yuk ko‘taruvchi devorlar va ventilyatsiya shaxtalariga aralashish qat'iyan man etiladi.",
      "Mahalliy qurilish normalari (SHNQ) va yong‘in xavfsizligi qoidalariga amal qilinadi."
    ],
    "important_notes": "Har qanday noaniqlik keyingi bosqichlarda o‘nlab barobar qimmatroqqa tushadi. Loyiha qanchalik batafsil bo‘lsa, usta bilan tushunmovchilik shunchalik kam bo‘ladi.",
    "common_mistakes": [
      "Mavjud devorlarning qalinligi va vertikalligini hisobga olmaslik.",
      "Kommunikatsiya shaxtalari va risyerlarning joylashuvini e'tibordan chetda qoldirish.",
      "Mebelning haqiqiy gabarit o‘lchamlarini hisobga olmasdan joylashtirish."
    ],
    "quality_control": "Chizmadagi nazorat o‘lchamlarini ob’yektda qayta tekshirish, umumiy perimetr xatoligi 10 mm dan oshmasligi lozim.",
    "materials": [
      "Chizmachilik qog‘ozi",
      "Markerlar",
      "Eskiz daftari"
    ],
    "tools": [
      "Lazerli masofa o‘lchagich (Dalnomer)",
      "Lazerli sath (Nivelir)",
      "Ruletka 5-10m",
      "Burchak o‘lchagich (Uglomer)",
      "Planshet/noutbuk"
    ],
    "checklist": [
      {
        "text": "O‘lchamlar 3 marta turli nuqtalarda solishtirildi",
        "required": true
      },
      {
        "text": "Shaxta va risyerlar koordinatalari belgilandi",
        "required": true
      },
      {
        "text": "Buyurtmachi bilan barcha yozma talablar kelishildi",
        "required": true
      },
      {
        "text": "Foto va video fiksatsiya to‘liq arxivlandi",
        "required": false
      }
    ],
    "related_topics": [
      "Ob’yektni o‘lchash",
      "Ishchi loyiha / рабочая документация",
      "Funksional zonalash"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 1
  },
  {
    "category_id": 1,
    "category_code": "01",
    "category_slug": "01-loyihalash-va-tayyorgarlik",
    "category_title": "Loyihalash va tayyorgarlik",
    "category_icon": "📐",
    "slug": "01-obyektni-olchash",
    "title": "Ob’yektni o‘lchash",
    "short_description": "Ob’yektni o‘lchash — ta'mirlash loyihasining boshlang‘ich poydevori bo‘lib, kelgusi barcha qurilish-montaj ishlarining aniqligi va byudjetini belgilab beradi.",
    "purpose": "Xatolarni qurilish maydonida emas, qog‘oz va raqamli modelda oldindan ko‘rib bartaraf etish, buyurtmachi va ustalar o‘rtasida aniq texnik kelishuvga erishish.",
    "when_to_do": "Ta'mirlash boshlanishidan oldin, har qanday jismoniy buzish yoki qurish ishlariga kirishmasdan avval.",
    "before_start": "Ob’yektga to‘liq kirish imkoni, mavjud texnik pasport nusxasi va buyurtmachining asosiy talablar ro‘yxati.",
    "step_by_step": [
      "Dastlabki ma'lumotlarni yig‘ish va buyurtmachi bilan suhbat o‘tkazish.",
      "Ob’yektda barcha o‘lchovlarni lazerli va mexanik asboblar bilan olish.",
      "Olingan ma'lumotlarni BIM yoki SAPR dasturiga (Revit, AutoCAD) kiritish.",
      "Muhandislik tarmoqlari va konstruktiv cheklovlarni tahlil qilish.",
      "Chizmalarni loyiha standartlariga muvofiq rasmiylashtirish va tasdiqlash."
    ],
    "rules": [
      "Barcha o‘lchamlar millimetrda (mm) olinishi va qayd etilishi shart.",
      "Yuk ko‘taruvchi devorlar va ventilyatsiya shaxtalariga aralashish qat'iyan man etiladi.",
      "Mahalliy qurilish normalari (SHNQ) va yong‘in xavfsizligi qoidalariga amal qilinadi."
    ],
    "important_notes": "Har qanday noaniqlik keyingi bosqichlarda o‘nlab barobar qimmatroqqa tushadi. Loyiha qanchalik batafsil bo‘lsa, usta bilan tushunmovchilik shunchalik kam bo‘ladi.",
    "common_mistakes": [
      "Mavjud devorlarning qalinligi va vertikalligini hisobga olmaslik.",
      "Kommunikatsiya shaxtalari va risyerlarning joylashuvini e'tibordan chetda qoldirish.",
      "Mebelning haqiqiy gabarit o‘lchamlarini hisobga olmasdan joylashtirish."
    ],
    "quality_control": "Chizmadagi nazorat o‘lchamlarini ob’yektda qayta tekshirish, umumiy perimetr xatoligi 10 mm dan oshmasligi lozim.",
    "materials": [
      "Chizmachilik qog‘ozi",
      "Markerlar",
      "Eskiz daftari"
    ],
    "tools": [
      "Lazerli masofa o‘lchagich (Dalnomer)",
      "Lazerli sath (Nivelir)",
      "Ruletka 5-10m",
      "Burchak o‘lchagich (Uglomer)",
      "Planshet/noutbuk"
    ],
    "checklist": [
      {
        "text": "O‘lchamlar 3 marta turli nuqtalarda solishtirildi",
        "required": true
      },
      {
        "text": "Shaxta va risyerlar koordinatalari belgilandi",
        "required": true
      },
      {
        "text": "Buyurtmachi bilan barcha yozma talablar kelishildi",
        "required": true
      },
      {
        "text": "Foto va video fiksatsiya to‘liq arxivlandi",
        "required": false
      }
    ],
    "related_topics": [
      "Ob’yektni o‘lchash",
      "Ishchi loyiha / рабочая документация",
      "Funksional zonalash"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 2
  },
  {
    "category_id": 1,
    "category_code": "01",
    "category_slug": "01-loyihalash-va-tayyorgarlik",
    "category_title": "Loyihalash va tayyorgarlik",
    "category_icon": "📐",
    "slug": "01-mavjud-holatni-foto-video-qayd-qilish",
    "title": "Mavjud holatni foto/video qayd qilish",
    "short_description": "Mavjud holatni foto/video qayd qilish — ta'mirlash loyihasining boshlang‘ich poydevori bo‘lib, kelgusi barcha qurilish-montaj ishlarining aniqligi va byudjetini belgilab beradi.",
    "purpose": "Xatolarni qurilish maydonida emas, qog‘oz va raqamli modelda oldindan ko‘rib bartaraf etish, buyurtmachi va ustalar o‘rtasida aniq texnik kelishuvga erishish.",
    "when_to_do": "Ta'mirlash boshlanishidan oldin, har qanday jismoniy buzish yoki qurish ishlariga kirishmasdan avval.",
    "before_start": "Ob’yektga to‘liq kirish imkoni, mavjud texnik pasport nusxasi va buyurtmachining asosiy talablar ro‘yxati.",
    "step_by_step": [
      "Dastlabki ma'lumotlarni yig‘ish va buyurtmachi bilan suhbat o‘tkazish.",
      "Ob’yektda barcha o‘lchovlarni lazerli va mexanik asboblar bilan olish.",
      "Olingan ma'lumotlarni BIM yoki SAPR dasturiga (Revit, AutoCAD) kiritish.",
      "Muhandislik tarmoqlari va konstruktiv cheklovlarni tahlil qilish.",
      "Chizmalarni loyiha standartlariga muvofiq rasmiylashtirish va tasdiqlash."
    ],
    "rules": [
      "Barcha o‘lchamlar millimetrda (mm) olinishi va qayd etilishi shart.",
      "Yuk ko‘taruvchi devorlar va ventilyatsiya shaxtalariga aralashish qat'iyan man etiladi.",
      "Mahalliy qurilish normalari (SHNQ) va yong‘in xavfsizligi qoidalariga amal qilinadi."
    ],
    "important_notes": "Har qanday noaniqlik keyingi bosqichlarda o‘nlab barobar qimmatroqqa tushadi. Loyiha qanchalik batafsil bo‘lsa, usta bilan tushunmovchilik shunchalik kam bo‘ladi.",
    "common_mistakes": [
      "Mavjud devorlarning qalinligi va vertikalligini hisobga olmaslik.",
      "Kommunikatsiya shaxtalari va risyerlarning joylashuvini e'tibordan chetda qoldirish.",
      "Mebelning haqiqiy gabarit o‘lchamlarini hisobga olmasdan joylashtirish."
    ],
    "quality_control": "Chizmadagi nazorat o‘lchamlarini ob’yektda qayta tekshirish, umumiy perimetr xatoligi 10 mm dan oshmasligi lozim.",
    "materials": [
      "Chizmachilik qog‘ozi",
      "Markerlar",
      "Eskiz daftari"
    ],
    "tools": [
      "Lazerli masofa o‘lchagich (Dalnomer)",
      "Lazerli sath (Nivelir)",
      "Ruletka 5-10m",
      "Burchak o‘lchagich (Uglomer)",
      "Planshet/noutbuk"
    ],
    "checklist": [
      {
        "text": "O‘lchamlar 3 marta turli nuqtalarda solishtirildi",
        "required": true
      },
      {
        "text": "Shaxta va risyerlar koordinatalari belgilandi",
        "required": true
      },
      {
        "text": "Buyurtmachi bilan barcha yozma talablar kelishildi",
        "required": true
      },
      {
        "text": "Foto va video fiksatsiya to‘liq arxivlandi",
        "required": false
      }
    ],
    "related_topics": [
      "Ob’yektni o‘lchash",
      "Ishchi loyiha / рабочая документация",
      "Funksional zonalash"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 3
  },
  {
    "category_id": 1,
    "category_code": "01",
    "category_slug": "01-loyihalash-va-tayyorgarlik",
    "category_title": "Loyihalash va tayyorgarlik",
    "category_icon": "📐",
    "slug": "01-mavjud-reja-chizmasini-tayyorlash",
    "title": "Mavjud reja chizmasini tayyorlash",
    "short_description": "Mavjud reja chizmasini tayyorlash — ta'mirlash loyihasining boshlang‘ich poydevori bo‘lib, kelgusi barcha qurilish-montaj ishlarining aniqligi va byudjetini belgilab beradi.",
    "purpose": "Xatolarni qurilish maydonida emas, qog‘oz va raqamli modelda oldindan ko‘rib bartaraf etish, buyurtmachi va ustalar o‘rtasida aniq texnik kelishuvga erishish.",
    "when_to_do": "Ta'mirlash boshlanishidan oldin, har qanday jismoniy buzish yoki qurish ishlariga kirishmasdan avval.",
    "before_start": "Ob’yektga to‘liq kirish imkoni, mavjud texnik pasport nusxasi va buyurtmachining asosiy talablar ro‘yxati.",
    "step_by_step": [
      "Dastlabki ma'lumotlarni yig‘ish va buyurtmachi bilan suhbat o‘tkazish.",
      "Ob’yektda barcha o‘lchovlarni lazerli va mexanik asboblar bilan olish.",
      "Olingan ma'lumotlarni BIM yoki SAPR dasturiga (Revit, AutoCAD) kiritish.",
      "Muhandislik tarmoqlari va konstruktiv cheklovlarni tahlil qilish.",
      "Chizmalarni loyiha standartlariga muvofiq rasmiylashtirish va tasdiqlash."
    ],
    "rules": [
      "Barcha o‘lchamlar millimetrda (mm) olinishi va qayd etilishi shart.",
      "Yuk ko‘taruvchi devorlar va ventilyatsiya shaxtalariga aralashish qat'iyan man etiladi.",
      "Mahalliy qurilish normalari (SHNQ) va yong‘in xavfsizligi qoidalariga amal qilinadi."
    ],
    "important_notes": "Har qanday noaniqlik keyingi bosqichlarda o‘nlab barobar qimmatroqqa tushadi. Loyiha qanchalik batafsil bo‘lsa, usta bilan tushunmovchilik shunchalik kam bo‘ladi.",
    "common_mistakes": [
      "Mavjud devorlarning qalinligi va vertikalligini hisobga olmaslik.",
      "Kommunikatsiya shaxtalari va risyerlarning joylashuvini e'tibordan chetda qoldirish.",
      "Mebelning haqiqiy gabarit o‘lchamlarini hisobga olmasdan joylashtirish."
    ],
    "quality_control": "Chizmadagi nazorat o‘lchamlarini ob’yektda qayta tekshirish, umumiy perimetr xatoligi 10 mm dan oshmasligi lozim.",
    "materials": [
      "Chizmachilik qog‘ozi",
      "Markerlar",
      "Eskiz daftari"
    ],
    "tools": [
      "Lazerli masofa o‘lchagich (Dalnomer)",
      "Lazerli sath (Nivelir)",
      "Ruletka 5-10m",
      "Burchak o‘lchagich (Uglomer)",
      "Planshet/noutbuk"
    ],
    "checklist": [
      {
        "text": "O‘lchamlar 3 marta turli nuqtalarda solishtirildi",
        "required": true
      },
      {
        "text": "Shaxta va risyerlar koordinatalari belgilandi",
        "required": true
      },
      {
        "text": "Buyurtmachi bilan barcha yozma talablar kelishildi",
        "required": true
      },
      {
        "text": "Foto va video fiksatsiya to‘liq arxivlandi",
        "required": false
      }
    ],
    "related_topics": [
      "Ob’yektni o‘lchash",
      "Ishchi loyiha / рабочая документация",
      "Funksional zonalash"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 4
  },
  {
    "category_id": 1,
    "category_code": "01",
    "category_slug": "01-loyihalash-va-tayyorgarlik",
    "category_title": "Loyihalash va tayyorgarlik",
    "category_icon": "📐",
    "slug": "01-devor-pol-va-shift-holatini-tekshirish",
    "title": "Devor, pol va shift holatini tekshirish",
    "short_description": "Devor, pol va shift holatini tekshirish — ta'mirlash loyihasining boshlang‘ich poydevori bo‘lib, kelgusi barcha qurilish-montaj ishlarining aniqligi va byudjetini belgilab beradi.",
    "purpose": "Xatolarni qurilish maydonida emas, qog‘oz va raqamli modelda oldindan ko‘rib bartaraf etish, buyurtmachi va ustalar o‘rtasida aniq texnik kelishuvga erishish.",
    "when_to_do": "Ta'mirlash boshlanishidan oldin, har qanday jismoniy buzish yoki qurish ishlariga kirishmasdan avval.",
    "before_start": "Ob’yektga to‘liq kirish imkoni, mavjud texnik pasport nusxasi va buyurtmachining asosiy talablar ro‘yxati.",
    "step_by_step": [
      "Dastlabki ma'lumotlarni yig‘ish va buyurtmachi bilan suhbat o‘tkazish.",
      "Ob’yektda barcha o‘lchovlarni lazerli va mexanik asboblar bilan olish.",
      "Olingan ma'lumotlarni BIM yoki SAPR dasturiga (Revit, AutoCAD) kiritish.",
      "Muhandislik tarmoqlari va konstruktiv cheklovlarni tahlil qilish.",
      "Chizmalarni loyiha standartlariga muvofiq rasmiylashtirish va tasdiqlash."
    ],
    "rules": [
      "Barcha o‘lchamlar millimetrda (mm) olinishi va qayd etilishi shart.",
      "Yuk ko‘taruvchi devorlar va ventilyatsiya shaxtalariga aralashish qat'iyan man etiladi.",
      "Mahalliy qurilish normalari (SHNQ) va yong‘in xavfsizligi qoidalariga amal qilinadi."
    ],
    "important_notes": "Har qanday noaniqlik keyingi bosqichlarda o‘nlab barobar qimmatroqqa tushadi. Loyiha qanchalik batafsil bo‘lsa, usta bilan tushunmovchilik shunchalik kam bo‘ladi.",
    "common_mistakes": [
      "Mavjud devorlarning qalinligi va vertikalligini hisobga olmaslik.",
      "Kommunikatsiya shaxtalari va risyerlarning joylashuvini e'tibordan chetda qoldirish.",
      "Mebelning haqiqiy gabarit o‘lchamlarini hisobga olmasdan joylashtirish."
    ],
    "quality_control": "Chizmadagi nazorat o‘lchamlarini ob’yektda qayta tekshirish, umumiy perimetr xatoligi 10 mm dan oshmasligi lozim.",
    "materials": [
      "Chizmachilik qog‘ozi",
      "Markerlar",
      "Eskiz daftari"
    ],
    "tools": [
      "Lazerli masofa o‘lchagich (Dalnomer)",
      "Lazerli sath (Nivelir)",
      "Ruletka 5-10m",
      "Burchak o‘lchagich (Uglomer)",
      "Planshet/noutbuk"
    ],
    "checklist": [
      {
        "text": "O‘lchamlar 3 marta turli nuqtalarda solishtirildi",
        "required": true
      },
      {
        "text": "Shaxta va risyerlar koordinatalari belgilandi",
        "required": true
      },
      {
        "text": "Buyurtmachi bilan barcha yozma talablar kelishildi",
        "required": true
      },
      {
        "text": "Foto va video fiksatsiya to‘liq arxivlandi",
        "required": false
      }
    ],
    "related_topics": [
      "Ob’yektni o‘lchash",
      "Ishchi loyiha / рабочая документация",
      "Funksional zonalash"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 5
  },
  {
    "category_id": 1,
    "category_code": "01",
    "category_slug": "01-loyihalash-va-tayyorgarlik",
    "category_title": "Loyihalash va tayyorgarlik",
    "category_icon": "📐",
    "slug": "01-kommunikatsiyalarni-aniqlash",
    "title": "Kommunikatsiyalarni aniqlash",
    "short_description": "Kommunikatsiyalarni aniqlash — ta'mirlash loyihasining boshlang‘ich poydevori bo‘lib, kelgusi barcha qurilish-montaj ishlarining aniqligi va byudjetini belgilab beradi.",
    "purpose": "Xatolarni qurilish maydonida emas, qog‘oz va raqamli modelda oldindan ko‘rib bartaraf etish, buyurtmachi va ustalar o‘rtasida aniq texnik kelishuvga erishish.",
    "when_to_do": "Ta'mirlash boshlanishidan oldin, har qanday jismoniy buzish yoki qurish ishlariga kirishmasdan avval.",
    "before_start": "Ob’yektga to‘liq kirish imkoni, mavjud texnik pasport nusxasi va buyurtmachining asosiy talablar ro‘yxati.",
    "step_by_step": [
      "Dastlabki ma'lumotlarni yig‘ish va buyurtmachi bilan suhbat o‘tkazish.",
      "Ob’yektda barcha o‘lchovlarni lazerli va mexanik asboblar bilan olish.",
      "Olingan ma'lumotlarni BIM yoki SAPR dasturiga (Revit, AutoCAD) kiritish.",
      "Muhandislik tarmoqlari va konstruktiv cheklovlarni tahlil qilish.",
      "Chizmalarni loyiha standartlariga muvofiq rasmiylashtirish va tasdiqlash."
    ],
    "rules": [
      "Barcha o‘lchamlar millimetrda (mm) olinishi va qayd etilishi shart.",
      "Yuk ko‘taruvchi devorlar va ventilyatsiya shaxtalariga aralashish qat'iyan man etiladi.",
      "Mahalliy qurilish normalari (SHNQ) va yong‘in xavfsizligi qoidalariga amal qilinadi."
    ],
    "important_notes": "Har qanday noaniqlik keyingi bosqichlarda o‘nlab barobar qimmatroqqa tushadi. Loyiha qanchalik batafsil bo‘lsa, usta bilan tushunmovchilik shunchalik kam bo‘ladi.",
    "common_mistakes": [
      "Mavjud devorlarning qalinligi va vertikalligini hisobga olmaslik.",
      "Kommunikatsiya shaxtalari va risyerlarning joylashuvini e'tibordan chetda qoldirish.",
      "Mebelning haqiqiy gabarit o‘lchamlarini hisobga olmasdan joylashtirish."
    ],
    "quality_control": "Chizmadagi nazorat o‘lchamlarini ob’yektda qayta tekshirish, umumiy perimetr xatoligi 10 mm dan oshmasligi lozim.",
    "materials": [
      "Chizmachilik qog‘ozi",
      "Markerlar",
      "Eskiz daftari"
    ],
    "tools": [
      "Lazerli masofa o‘lchagich (Dalnomer)",
      "Lazerli sath (Nivelir)",
      "Ruletka 5-10m",
      "Burchak o‘lchagich (Uglomer)",
      "Planshet/noutbuk"
    ],
    "checklist": [
      {
        "text": "O‘lchamlar 3 marta turli nuqtalarda solishtirildi",
        "required": true
      },
      {
        "text": "Shaxta va risyerlar koordinatalari belgilandi",
        "required": true
      },
      {
        "text": "Buyurtmachi bilan barcha yozma talablar kelishildi",
        "required": true
      },
      {
        "text": "Foto va video fiksatsiya to‘liq arxivlandi",
        "required": false
      }
    ],
    "related_topics": [
      "Ob’yektni o‘lchash",
      "Ishchi loyiha / рабочая документация",
      "Funksional zonalash"
    ],
    "order_index": 6,
    "is_published": true,
    "id": 6
  },
  {
    "category_id": 1,
    "category_code": "01",
    "category_slug": "01-loyihalash-va-tayyorgarlik",
    "category_title": "Loyihalash va tayyorgarlik",
    "category_icon": "📐",
    "slug": "01-mebel-joylashuvini-dastlabki-rejalashtirish",
    "title": "Mebel joylashuvini dastlabki rejalashtirish",
    "short_description": "Mebel joylashuvini dastlabki rejalashtirish — ta'mirlash loyihasining boshlang‘ich poydevori bo‘lib, kelgusi barcha qurilish-montaj ishlarining aniqligi va byudjetini belgilab beradi.",
    "purpose": "Xatolarni qurilish maydonida emas, qog‘oz va raqamli modelda oldindan ko‘rib bartaraf etish, buyurtmachi va ustalar o‘rtasida aniq texnik kelishuvga erishish.",
    "when_to_do": "Ta'mirlash boshlanishidan oldin, har qanday jismoniy buzish yoki qurish ishlariga kirishmasdan avval.",
    "before_start": "Ob’yektga to‘liq kirish imkoni, mavjud texnik pasport nusxasi va buyurtmachining asosiy talablar ro‘yxati.",
    "step_by_step": [
      "Dastlabki ma'lumotlarni yig‘ish va buyurtmachi bilan suhbat o‘tkazish.",
      "Ob’yektda barcha o‘lchovlarni lazerli va mexanik asboblar bilan olish.",
      "Olingan ma'lumotlarni BIM yoki SAPR dasturiga (Revit, AutoCAD) kiritish.",
      "Muhandislik tarmoqlari va konstruktiv cheklovlarni tahlil qilish.",
      "Chizmalarni loyiha standartlariga muvofiq rasmiylashtirish va tasdiqlash."
    ],
    "rules": [
      "Barcha o‘lchamlar millimetrda (mm) olinishi va qayd etilishi shart.",
      "Yuk ko‘taruvchi devorlar va ventilyatsiya shaxtalariga aralashish qat'iyan man etiladi.",
      "Mahalliy qurilish normalari (SHNQ) va yong‘in xavfsizligi qoidalariga amal qilinadi."
    ],
    "important_notes": "Har qanday noaniqlik keyingi bosqichlarda o‘nlab barobar qimmatroqqa tushadi. Loyiha qanchalik batafsil bo‘lsa, usta bilan tushunmovchilik shunchalik kam bo‘ladi.",
    "common_mistakes": [
      "Mavjud devorlarning qalinligi va vertikalligini hisobga olmaslik.",
      "Kommunikatsiya shaxtalari va risyerlarning joylashuvini e'tibordan chetda qoldirish.",
      "Mebelning haqiqiy gabarit o‘lchamlarini hisobga olmasdan joylashtirish."
    ],
    "quality_control": "Chizmadagi nazorat o‘lchamlarini ob’yektda qayta tekshirish, umumiy perimetr xatoligi 10 mm dan oshmasligi lozim.",
    "materials": [
      "Chizmachilik qog‘ozi",
      "Markerlar",
      "Eskiz daftari"
    ],
    "tools": [
      "Lazerli masofa o‘lchagich (Dalnomer)",
      "Lazerli sath (Nivelir)",
      "Ruletka 5-10m",
      "Burchak o‘lchagich (Uglomer)",
      "Planshet/noutbuk"
    ],
    "checklist": [
      {
        "text": "O‘lchamlar 3 marta turli nuqtalarda solishtirildi",
        "required": true
      },
      {
        "text": "Shaxta va risyerlar koordinatalari belgilandi",
        "required": true
      },
      {
        "text": "Buyurtmachi bilan barcha yozma talablar kelishildi",
        "required": true
      },
      {
        "text": "Foto va video fiksatsiya to‘liq arxivlandi",
        "required": false
      }
    ],
    "related_topics": [
      "Ob’yektni o‘lchash",
      "Ishchi loyiha / рабочая документация",
      "Funksional zonalash"
    ],
    "order_index": 7,
    "is_published": true,
    "id": 7
  },
  {
    "category_id": 1,
    "category_code": "01",
    "category_slug": "01-loyihalash-va-tayyorgarlik",
    "category_title": "Loyihalash va tayyorgarlik",
    "category_icon": "📐",
    "slug": "01-funksional-zonalash",
    "title": "Funksional zonalash",
    "short_description": "Funksional zonalash — ta'mirlash loyihasining boshlang‘ich poydevori bo‘lib, kelgusi barcha qurilish-montaj ishlarining aniqligi va byudjetini belgilab beradi.",
    "purpose": "Xatolarni qurilish maydonida emas, qog‘oz va raqamli modelda oldindan ko‘rib bartaraf etish, buyurtmachi va ustalar o‘rtasida aniq texnik kelishuvga erishish.",
    "when_to_do": "Ta'mirlash boshlanishidan oldin, har qanday jismoniy buzish yoki qurish ishlariga kirishmasdan avval.",
    "before_start": "Ob’yektga to‘liq kirish imkoni, mavjud texnik pasport nusxasi va buyurtmachining asosiy talablar ro‘yxati.",
    "step_by_step": [
      "Dastlabki ma'lumotlarni yig‘ish va buyurtmachi bilan suhbat o‘tkazish.",
      "Ob’yektda barcha o‘lchovlarni lazerli va mexanik asboblar bilan olish.",
      "Olingan ma'lumotlarni BIM yoki SAPR dasturiga (Revit, AutoCAD) kiritish.",
      "Muhandislik tarmoqlari va konstruktiv cheklovlarni tahlil qilish.",
      "Chizmalarni loyiha standartlariga muvofiq rasmiylashtirish va tasdiqlash."
    ],
    "rules": [
      "Barcha o‘lchamlar millimetrda (mm) olinishi va qayd etilishi shart.",
      "Yuk ko‘taruvchi devorlar va ventilyatsiya shaxtalariga aralashish qat'iyan man etiladi.",
      "Mahalliy qurilish normalari (SHNQ) va yong‘in xavfsizligi qoidalariga amal qilinadi."
    ],
    "important_notes": "Har qanday noaniqlik keyingi bosqichlarda o‘nlab barobar qimmatroqqa tushadi. Loyiha qanchalik batafsil bo‘lsa, usta bilan tushunmovchilik shunchalik kam bo‘ladi.",
    "common_mistakes": [
      "Mavjud devorlarning qalinligi va vertikalligini hisobga olmaslik.",
      "Kommunikatsiya shaxtalari va risyerlarning joylashuvini e'tibordan chetda qoldirish.",
      "Mebelning haqiqiy gabarit o‘lchamlarini hisobga olmasdan joylashtirish."
    ],
    "quality_control": "Chizmadagi nazorat o‘lchamlarini ob’yektda qayta tekshirish, umumiy perimetr xatoligi 10 mm dan oshmasligi lozim.",
    "materials": [
      "Chizmachilik qog‘ozi",
      "Markerlar",
      "Eskiz daftari"
    ],
    "tools": [
      "Lazerli masofa o‘lchagich (Dalnomer)",
      "Lazerli sath (Nivelir)",
      "Ruletka 5-10m",
      "Burchak o‘lchagich (Uglomer)",
      "Planshet/noutbuk"
    ],
    "checklist": [
      {
        "text": "O‘lchamlar 3 marta turli nuqtalarda solishtirildi",
        "required": true
      },
      {
        "text": "Shaxta va risyerlar koordinatalari belgilandi",
        "required": true
      },
      {
        "text": "Buyurtmachi bilan barcha yozma talablar kelishildi",
        "required": true
      },
      {
        "text": "Foto va video fiksatsiya to‘liq arxivlandi",
        "required": false
      }
    ],
    "related_topics": [
      "Ob’yektni o‘lchash",
      "Ishchi loyiha / рабочая документация",
      "Funksional zonalash"
    ],
    "order_index": 8,
    "is_published": true,
    "id": 8
  },
  {
    "category_id": 1,
    "category_code": "01",
    "category_slug": "01-loyihalash-va-tayyorgarlik",
    "category_title": "Loyihalash va tayyorgarlik",
    "category_icon": "📐",
    "slug": "01-uslub-va-konsepsiyani-tanlash",
    "title": "Uslub va konsepsiyani tanlash",
    "short_description": "Uslub va konsepsiyani tanlash — ta'mirlash loyihasining boshlang‘ich poydevori bo‘lib, kelgusi barcha qurilish-montaj ishlarining aniqligi va byudjetini belgilab beradi.",
    "purpose": "Xatolarni qurilish maydonida emas, qog‘oz va raqamli modelda oldindan ko‘rib bartaraf etish, buyurtmachi va ustalar o‘rtasida aniq texnik kelishuvga erishish.",
    "when_to_do": "Ta'mirlash boshlanishidan oldin, har qanday jismoniy buzish yoki qurish ishlariga kirishmasdan avval.",
    "before_start": "Ob’yektga to‘liq kirish imkoni, mavjud texnik pasport nusxasi va buyurtmachining asosiy talablar ro‘yxati.",
    "step_by_step": [
      "Dastlabki ma'lumotlarni yig‘ish va buyurtmachi bilan suhbat o‘tkazish.",
      "Ob’yektda barcha o‘lchovlarni lazerli va mexanik asboblar bilan olish.",
      "Olingan ma'lumotlarni BIM yoki SAPR dasturiga (Revit, AutoCAD) kiritish.",
      "Muhandislik tarmoqlari va konstruktiv cheklovlarni tahlil qilish.",
      "Chizmalarni loyiha standartlariga muvofiq rasmiylashtirish va tasdiqlash."
    ],
    "rules": [
      "Barcha o‘lchamlar millimetrda (mm) olinishi va qayd etilishi shart.",
      "Yuk ko‘taruvchi devorlar va ventilyatsiya shaxtalariga aralashish qat'iyan man etiladi.",
      "Mahalliy qurilish normalari (SHNQ) va yong‘in xavfsizligi qoidalariga amal qilinadi."
    ],
    "important_notes": "Har qanday noaniqlik keyingi bosqichlarda o‘nlab barobar qimmatroqqa tushadi. Loyiha qanchalik batafsil bo‘lsa, usta bilan tushunmovchilik shunchalik kam bo‘ladi.",
    "common_mistakes": [
      "Mavjud devorlarning qalinligi va vertikalligini hisobga olmaslik.",
      "Kommunikatsiya shaxtalari va risyerlarning joylashuvini e'tibordan chetda qoldirish.",
      "Mebelning haqiqiy gabarit o‘lchamlarini hisobga olmasdan joylashtirish."
    ],
    "quality_control": "Chizmadagi nazorat o‘lchamlarini ob’yektda qayta tekshirish, umumiy perimetr xatoligi 10 mm dan oshmasligi lozim.",
    "materials": [
      "Chizmachilik qog‘ozi",
      "Markerlar",
      "Eskiz daftari"
    ],
    "tools": [
      "Lazerli masofa o‘lchagich (Dalnomer)",
      "Lazerli sath (Nivelir)",
      "Ruletka 5-10m",
      "Burchak o‘lchagich (Uglomer)",
      "Planshet/noutbuk"
    ],
    "checklist": [
      {
        "text": "O‘lchamlar 3 marta turli nuqtalarda solishtirildi",
        "required": true
      },
      {
        "text": "Shaxta va risyerlar koordinatalari belgilandi",
        "required": true
      },
      {
        "text": "Buyurtmachi bilan barcha yozma talablar kelishildi",
        "required": true
      },
      {
        "text": "Foto va video fiksatsiya to‘liq arxivlandi",
        "required": false
      }
    ],
    "related_topics": [
      "Ob’yektni o‘lchash",
      "Ishchi loyiha / рабочая документация",
      "Funksional zonalash"
    ],
    "order_index": 9,
    "is_published": true,
    "id": 9
  },
  {
    "category_id": 1,
    "category_code": "01",
    "category_slug": "01-loyihalash-va-tayyorgarlik",
    "category_title": "Loyihalash va tayyorgarlik",
    "category_icon": "📐",
    "slug": "01-rang-va-materiallar-konsepsiyasi",
    "title": "Rang va materiallar konsepsiyasi",
    "short_description": "Rang va materiallar konsepsiyasi — ta'mirlash loyihasining boshlang‘ich poydevori bo‘lib, kelgusi barcha qurilish-montaj ishlarining aniqligi va byudjetini belgilab beradi.",
    "purpose": "Xatolarni qurilish maydonida emas, qog‘oz va raqamli modelda oldindan ko‘rib bartaraf etish, buyurtmachi va ustalar o‘rtasida aniq texnik kelishuvga erishish.",
    "when_to_do": "Ta'mirlash boshlanishidan oldin, har qanday jismoniy buzish yoki qurish ishlariga kirishmasdan avval.",
    "before_start": "Ob’yektga to‘liq kirish imkoni, mavjud texnik pasport nusxasi va buyurtmachining asosiy talablar ro‘yxati.",
    "step_by_step": [
      "Dastlabki ma'lumotlarni yig‘ish va buyurtmachi bilan suhbat o‘tkazish.",
      "Ob’yektda barcha o‘lchovlarni lazerli va mexanik asboblar bilan olish.",
      "Olingan ma'lumotlarni BIM yoki SAPR dasturiga (Revit, AutoCAD) kiritish.",
      "Muhandislik tarmoqlari va konstruktiv cheklovlarni tahlil qilish.",
      "Chizmalarni loyiha standartlariga muvofiq rasmiylashtirish va tasdiqlash."
    ],
    "rules": [
      "Barcha o‘lchamlar millimetrda (mm) olinishi va qayd etilishi shart.",
      "Yuk ko‘taruvchi devorlar va ventilyatsiya shaxtalariga aralashish qat'iyan man etiladi.",
      "Mahalliy qurilish normalari (SHNQ) va yong‘in xavfsizligi qoidalariga amal qilinadi."
    ],
    "important_notes": "Har qanday noaniqlik keyingi bosqichlarda o‘nlab barobar qimmatroqqa tushadi. Loyiha qanchalik batafsil bo‘lsa, usta bilan tushunmovchilik shunchalik kam bo‘ladi.",
    "common_mistakes": [
      "Mavjud devorlarning qalinligi va vertikalligini hisobga olmaslik.",
      "Kommunikatsiya shaxtalari va risyerlarning joylashuvini e'tibordan chetda qoldirish.",
      "Mebelning haqiqiy gabarit o‘lchamlarini hisobga olmasdan joylashtirish."
    ],
    "quality_control": "Chizmadagi nazorat o‘lchamlarini ob’yektda qayta tekshirish, umumiy perimetr xatoligi 10 mm dan oshmasligi lozim.",
    "materials": [
      "Chizmachilik qog‘ozi",
      "Markerlar",
      "Eskiz daftari"
    ],
    "tools": [
      "Lazerli masofa o‘lchagich (Dalnomer)",
      "Lazerli sath (Nivelir)",
      "Ruletka 5-10m",
      "Burchak o‘lchagich (Uglomer)",
      "Planshet/noutbuk"
    ],
    "checklist": [
      {
        "text": "O‘lchamlar 3 marta turli nuqtalarda solishtirildi",
        "required": true
      },
      {
        "text": "Shaxta va risyerlar koordinatalari belgilandi",
        "required": true
      },
      {
        "text": "Buyurtmachi bilan barcha yozma talablar kelishildi",
        "required": true
      },
      {
        "text": "Foto va video fiksatsiya to‘liq arxivlandi",
        "required": false
      }
    ],
    "related_topics": [
      "Ob’yektni o‘lchash",
      "Ishchi loyiha / рабочая документация",
      "Funksional zonalash"
    ],
    "order_index": 10,
    "is_published": true,
    "id": 10
  },
  {
    "category_id": 1,
    "category_code": "01",
    "category_slug": "01-loyihalash-va-tayyorgarlik",
    "category_title": "Loyihalash va tayyorgarlik",
    "category_icon": "📐",
    "slug": "01-3d-interyer-dizayn",
    "title": "3D/interyer dizayn",
    "short_description": "3D/interyer dizayn — ta'mirlash loyihasining boshlang‘ich poydevori bo‘lib, kelgusi barcha qurilish-montaj ishlarining aniqligi va byudjetini belgilab beradi.",
    "purpose": "Xatolarni qurilish maydonida emas, qog‘oz va raqamli modelda oldindan ko‘rib bartaraf etish, buyurtmachi va ustalar o‘rtasida aniq texnik kelishuvga erishish.",
    "when_to_do": "Ta'mirlash boshlanishidan oldin, har qanday jismoniy buzish yoki qurish ishlariga kirishmasdan avval.",
    "before_start": "Ob’yektga to‘liq kirish imkoni, mavjud texnik pasport nusxasi va buyurtmachining asosiy talablar ro‘yxati.",
    "step_by_step": [
      "Dastlabki ma'lumotlarni yig‘ish va buyurtmachi bilan suhbat o‘tkazish.",
      "Ob’yektda barcha o‘lchovlarni lazerli va mexanik asboblar bilan olish.",
      "Olingan ma'lumotlarni BIM yoki SAPR dasturiga (Revit, AutoCAD) kiritish.",
      "Muhandislik tarmoqlari va konstruktiv cheklovlarni tahlil qilish.",
      "Chizmalarni loyiha standartlariga muvofiq rasmiylashtirish va tasdiqlash."
    ],
    "rules": [
      "Barcha o‘lchamlar millimetrda (mm) olinishi va qayd etilishi shart.",
      "Yuk ko‘taruvchi devorlar va ventilyatsiya shaxtalariga aralashish qat'iyan man etiladi.",
      "Mahalliy qurilish normalari (SHNQ) va yong‘in xavfsizligi qoidalariga amal qilinadi."
    ],
    "important_notes": "Har qanday noaniqlik keyingi bosqichlarda o‘nlab barobar qimmatroqqa tushadi. Loyiha qanchalik batafsil bo‘lsa, usta bilan tushunmovchilik shunchalik kam bo‘ladi.",
    "common_mistakes": [
      "Mavjud devorlarning qalinligi va vertikalligini hisobga olmaslik.",
      "Kommunikatsiya shaxtalari va risyerlarning joylashuvini e'tibordan chetda qoldirish.",
      "Mebelning haqiqiy gabarit o‘lchamlarini hisobga olmasdan joylashtirish."
    ],
    "quality_control": "Chizmadagi nazorat o‘lchamlarini ob’yektda qayta tekshirish, umumiy perimetr xatoligi 10 mm dan oshmasligi lozim.",
    "materials": [
      "Chizmachilik qog‘ozi",
      "Markerlar",
      "Eskiz daftari"
    ],
    "tools": [
      "Lazerli masofa o‘lchagich (Dalnomer)",
      "Lazerli sath (Nivelir)",
      "Ruletka 5-10m",
      "Burchak o‘lchagich (Uglomer)",
      "Planshet/noutbuk"
    ],
    "checklist": [
      {
        "text": "O‘lchamlar 3 marta turli nuqtalarda solishtirildi",
        "required": true
      },
      {
        "text": "Shaxta va risyerlar koordinatalari belgilandi",
        "required": true
      },
      {
        "text": "Buyurtmachi bilan barcha yozma talablar kelishildi",
        "required": true
      },
      {
        "text": "Foto va video fiksatsiya to‘liq arxivlandi",
        "required": false
      }
    ],
    "related_topics": [
      "Ob’yektni o‘lchash",
      "Ishchi loyiha / рабочая документация",
      "Funksional zonalash"
    ],
    "order_index": 11,
    "is_published": true,
    "id": 11
  },
  {
    "category_id": 1,
    "category_code": "01",
    "category_slug": "01-loyihalash-va-tayyorgarlik",
    "category_title": "Loyihalash va tayyorgarlik",
    "category_icon": "📐",
    "slug": "01-mebel-va-jihozlar-tanlovi",
    "title": "Mebel va jihozlar tanlovi",
    "short_description": "Mebel va jihozlar tanlovi — ta'mirlash loyihasining boshlang‘ich poydevori bo‘lib, kelgusi barcha qurilish-montaj ishlarining aniqligi va byudjetini belgilab beradi.",
    "purpose": "Xatolarni qurilish maydonida emas, qog‘oz va raqamli modelda oldindan ko‘rib bartaraf etish, buyurtmachi va ustalar o‘rtasida aniq texnik kelishuvga erishish.",
    "when_to_do": "Ta'mirlash boshlanishidan oldin, har qanday jismoniy buzish yoki qurish ishlariga kirishmasdan avval.",
    "before_start": "Ob’yektga to‘liq kirish imkoni, mavjud texnik pasport nusxasi va buyurtmachining asosiy talablar ro‘yxati.",
    "step_by_step": [
      "Dastlabki ma'lumotlarni yig‘ish va buyurtmachi bilan suhbat o‘tkazish.",
      "Ob’yektda barcha o‘lchovlarni lazerli va mexanik asboblar bilan olish.",
      "Olingan ma'lumotlarni BIM yoki SAPR dasturiga (Revit, AutoCAD) kiritish.",
      "Muhandislik tarmoqlari va konstruktiv cheklovlarni tahlil qilish.",
      "Chizmalarni loyiha standartlariga muvofiq rasmiylashtirish va tasdiqlash."
    ],
    "rules": [
      "Barcha o‘lchamlar millimetrda (mm) olinishi va qayd etilishi shart.",
      "Yuk ko‘taruvchi devorlar va ventilyatsiya shaxtalariga aralashish qat'iyan man etiladi.",
      "Mahalliy qurilish normalari (SHNQ) va yong‘in xavfsizligi qoidalariga amal qilinadi."
    ],
    "important_notes": "Har qanday noaniqlik keyingi bosqichlarda o‘nlab barobar qimmatroqqa tushadi. Loyiha qanchalik batafsil bo‘lsa, usta bilan tushunmovchilik shunchalik kam bo‘ladi.",
    "common_mistakes": [
      "Mavjud devorlarning qalinligi va vertikalligini hisobga olmaslik.",
      "Kommunikatsiya shaxtalari va risyerlarning joylashuvini e'tibordan chetda qoldirish.",
      "Mebelning haqiqiy gabarit o‘lchamlarini hisobga olmasdan joylashtirish."
    ],
    "quality_control": "Chizmadagi nazorat o‘lchamlarini ob’yektda qayta tekshirish, umumiy perimetr xatoligi 10 mm dan oshmasligi lozim.",
    "materials": [
      "Chizmachilik qog‘ozi",
      "Markerlar",
      "Eskiz daftari"
    ],
    "tools": [
      "Lazerli masofa o‘lchagich (Dalnomer)",
      "Lazerli sath (Nivelir)",
      "Ruletka 5-10m",
      "Burchak o‘lchagich (Uglomer)",
      "Planshet/noutbuk"
    ],
    "checklist": [
      {
        "text": "O‘lchamlar 3 marta turli nuqtalarda solishtirildi",
        "required": true
      },
      {
        "text": "Shaxta va risyerlar koordinatalari belgilandi",
        "required": true
      },
      {
        "text": "Buyurtmachi bilan barcha yozma talablar kelishildi",
        "required": true
      },
      {
        "text": "Foto va video fiksatsiya to‘liq arxivlandi",
        "required": false
      }
    ],
    "related_topics": [
      "Ob’yektni o‘lchash",
      "Ishchi loyiha / рабочая документация",
      "Funksional zonalash"
    ],
    "order_index": 12,
    "is_published": true,
    "id": 12
  },
  {
    "category_id": 1,
    "category_code": "01",
    "category_slug": "01-loyihalash-va-tayyorgarlik",
    "category_title": "Loyihalash va tayyorgarlik",
    "category_icon": "📐",
    "slug": "01-ishchi-loyiha-рабочая-документация",
    "title": "Ishchi loyiha / рабочая документация",
    "short_description": "Ishchi loyiha / рабочая документация — ta'mirlash loyihasining boshlang‘ich poydevori bo‘lib, kelgusi barcha qurilish-montaj ishlarining aniqligi va byudjetini belgilab beradi.",
    "purpose": "Xatolarni qurilish maydonida emas, qog‘oz va raqamli modelda oldindan ko‘rib bartaraf etish, buyurtmachi va ustalar o‘rtasida aniq texnik kelishuvga erishish.",
    "when_to_do": "Ta'mirlash boshlanishidan oldin, har qanday jismoniy buzish yoki qurish ishlariga kirishmasdan avval.",
    "before_start": "Ob’yektga to‘liq kirish imkoni, mavjud texnik pasport nusxasi va buyurtmachining asosiy talablar ro‘yxati.",
    "step_by_step": [
      "Dastlabki ma'lumotlarni yig‘ish va buyurtmachi bilan suhbat o‘tkazish.",
      "Ob’yektda barcha o‘lchovlarni lazerli va mexanik asboblar bilan olish.",
      "Olingan ma'lumotlarni BIM yoki SAPR dasturiga (Revit, AutoCAD) kiritish.",
      "Muhandislik tarmoqlari va konstruktiv cheklovlarni tahlil qilish.",
      "Chizmalarni loyiha standartlariga muvofiq rasmiylashtirish va tasdiqlash."
    ],
    "rules": [
      "Barcha o‘lchamlar millimetrda (mm) olinishi va qayd etilishi shart.",
      "Yuk ko‘taruvchi devorlar va ventilyatsiya shaxtalariga aralashish qat'iyan man etiladi.",
      "Mahalliy qurilish normalari (SHNQ) va yong‘in xavfsizligi qoidalariga amal qilinadi."
    ],
    "important_notes": "Har qanday noaniqlik keyingi bosqichlarda o‘nlab barobar qimmatroqqa tushadi. Loyiha qanchalik batafsil bo‘lsa, usta bilan tushunmovchilik shunchalik kam bo‘ladi.",
    "common_mistakes": [
      "Mavjud devorlarning qalinligi va vertikalligini hisobga olmaslik.",
      "Kommunikatsiya shaxtalari va risyerlarning joylashuvini e'tibordan chetda qoldirish.",
      "Mebelning haqiqiy gabarit o‘lchamlarini hisobga olmasdan joylashtirish."
    ],
    "quality_control": "Chizmadagi nazorat o‘lchamlarini ob’yektda qayta tekshirish, umumiy perimetr xatoligi 10 mm dan oshmasligi lozim.",
    "materials": [
      "Chizmachilik qog‘ozi",
      "Markerlar",
      "Eskiz daftari"
    ],
    "tools": [
      "Lazerli masofa o‘lchagich (Dalnomer)",
      "Lazerli sath (Nivelir)",
      "Ruletka 5-10m",
      "Burchak o‘lchagich (Uglomer)",
      "Planshet/noutbuk"
    ],
    "checklist": [
      {
        "text": "O‘lchamlar 3 marta turli nuqtalarda solishtirildi",
        "required": true
      },
      {
        "text": "Shaxta va risyerlar koordinatalari belgilandi",
        "required": true
      },
      {
        "text": "Buyurtmachi bilan barcha yozma talablar kelishildi",
        "required": true
      },
      {
        "text": "Foto va video fiksatsiya to‘liq arxivlandi",
        "required": false
      }
    ],
    "related_topics": [
      "Ob’yektni o‘lchash",
      "Ishchi loyiha / рабочая документация",
      "Funksional zonalash"
    ],
    "order_index": 13,
    "is_published": true,
    "id": 13
  },
  {
    "category_id": 1,
    "category_code": "01",
    "category_slug": "01-loyihalash-va-tayyorgarlik",
    "category_title": "Loyihalash va tayyorgarlik",
    "category_icon": "📐",
    "slug": "01-smeta-va-materiallar-royxati",
    "title": "Smeta va materiallar ro‘yxati",
    "short_description": "Smeta va materiallar ro‘yxati — ta'mirlash loyihasining boshlang‘ich poydevori bo‘lib, kelgusi barcha qurilish-montaj ishlarining aniqligi va byudjetini belgilab beradi.",
    "purpose": "Xatolarni qurilish maydonida emas, qog‘oz va raqamli modelda oldindan ko‘rib bartaraf etish, buyurtmachi va ustalar o‘rtasida aniq texnik kelishuvga erishish.",
    "when_to_do": "Ta'mirlash boshlanishidan oldin, har qanday jismoniy buzish yoki qurish ishlariga kirishmasdan avval.",
    "before_start": "Ob’yektga to‘liq kirish imkoni, mavjud texnik pasport nusxasi va buyurtmachining asosiy talablar ro‘yxati.",
    "step_by_step": [
      "Dastlabki ma'lumotlarni yig‘ish va buyurtmachi bilan suhbat o‘tkazish.",
      "Ob’yektda barcha o‘lchovlarni lazerli va mexanik asboblar bilan olish.",
      "Olingan ma'lumotlarni BIM yoki SAPR dasturiga (Revit, AutoCAD) kiritish.",
      "Muhandislik tarmoqlari va konstruktiv cheklovlarni tahlil qilish.",
      "Chizmalarni loyiha standartlariga muvofiq rasmiylashtirish va tasdiqlash."
    ],
    "rules": [
      "Barcha o‘lchamlar millimetrda (mm) olinishi va qayd etilishi shart.",
      "Yuk ko‘taruvchi devorlar va ventilyatsiya shaxtalariga aralashish qat'iyan man etiladi.",
      "Mahalliy qurilish normalari (SHNQ) va yong‘in xavfsizligi qoidalariga amal qilinadi."
    ],
    "important_notes": "Har qanday noaniqlik keyingi bosqichlarda o‘nlab barobar qimmatroqqa tushadi. Loyiha qanchalik batafsil bo‘lsa, usta bilan tushunmovchilik shunchalik kam bo‘ladi.",
    "common_mistakes": [
      "Mavjud devorlarning qalinligi va vertikalligini hisobga olmaslik.",
      "Kommunikatsiya shaxtalari va risyerlarning joylashuvini e'tibordan chetda qoldirish.",
      "Mebelning haqiqiy gabarit o‘lchamlarini hisobga olmasdan joylashtirish."
    ],
    "quality_control": "Chizmadagi nazorat o‘lchamlarini ob’yektda qayta tekshirish, umumiy perimetr xatoligi 10 mm dan oshmasligi lozim.",
    "materials": [
      "Chizmachilik qog‘ozi",
      "Markerlar",
      "Eskiz daftari"
    ],
    "tools": [
      "Lazerli masofa o‘lchagich (Dalnomer)",
      "Lazerli sath (Nivelir)",
      "Ruletka 5-10m",
      "Burchak o‘lchagich (Uglomer)",
      "Planshet/noutbuk"
    ],
    "checklist": [
      {
        "text": "O‘lchamlar 3 marta turli nuqtalarda solishtirildi",
        "required": true
      },
      {
        "text": "Shaxta va risyerlar koordinatalari belgilandi",
        "required": true
      },
      {
        "text": "Buyurtmachi bilan barcha yozma talablar kelishildi",
        "required": true
      },
      {
        "text": "Foto va video fiksatsiya to‘liq arxivlandi",
        "required": false
      }
    ],
    "related_topics": [
      "Ob’yektni o‘lchash",
      "Ishchi loyiha / рабочая документация",
      "Funksional zonalash"
    ],
    "order_index": 14,
    "is_published": true,
    "id": 14
  },
  {
    "category_id": 1,
    "category_code": "01",
    "category_slug": "01-loyihalash-va-tayyorgarlik",
    "category_title": "Loyihalash va tayyorgarlik",
    "category_icon": "📐",
    "slug": "01-ish-jadvali",
    "title": "Ish jadvali",
    "short_description": "Ish jadvali — ta'mirlash loyihasining boshlang‘ich poydevori bo‘lib, kelgusi barcha qurilish-montaj ishlarining aniqligi va byudjetini belgilab beradi.",
    "purpose": "Xatolarni qurilish maydonida emas, qog‘oz va raqamli modelda oldindan ko‘rib bartaraf etish, buyurtmachi va ustalar o‘rtasida aniq texnik kelishuvga erishish.",
    "when_to_do": "Ta'mirlash boshlanishidan oldin, har qanday jismoniy buzish yoki qurish ishlariga kirishmasdan avval.",
    "before_start": "Ob’yektga to‘liq kirish imkoni, mavjud texnik pasport nusxasi va buyurtmachining asosiy talablar ro‘yxati.",
    "step_by_step": [
      "Dastlabki ma'lumotlarni yig‘ish va buyurtmachi bilan suhbat o‘tkazish.",
      "Ob’yektda barcha o‘lchovlarni lazerli va mexanik asboblar bilan olish.",
      "Olingan ma'lumotlarni BIM yoki SAPR dasturiga (Revit, AutoCAD) kiritish.",
      "Muhandislik tarmoqlari va konstruktiv cheklovlarni tahlil qilish.",
      "Chizmalarni loyiha standartlariga muvofiq rasmiylashtirish va tasdiqlash."
    ],
    "rules": [
      "Barcha o‘lchamlar millimetrda (mm) olinishi va qayd etilishi shart.",
      "Yuk ko‘taruvchi devorlar va ventilyatsiya shaxtalariga aralashish qat'iyan man etiladi.",
      "Mahalliy qurilish normalari (SHNQ) va yong‘in xavfsizligi qoidalariga amal qilinadi."
    ],
    "important_notes": "Har qanday noaniqlik keyingi bosqichlarda o‘nlab barobar qimmatroqqa tushadi. Loyiha qanchalik batafsil bo‘lsa, usta bilan tushunmovchilik shunchalik kam bo‘ladi.",
    "common_mistakes": [
      "Mavjud devorlarning qalinligi va vertikalligini hisobga olmaslik.",
      "Kommunikatsiya shaxtalari va risyerlarning joylashuvini e'tibordan chetda qoldirish.",
      "Mebelning haqiqiy gabarit o‘lchamlarini hisobga olmasdan joylashtirish."
    ],
    "quality_control": "Chizmadagi nazorat o‘lchamlarini ob’yektda qayta tekshirish, umumiy perimetr xatoligi 10 mm dan oshmasligi lozim.",
    "materials": [
      "Chizmachilik qog‘ozi",
      "Markerlar",
      "Eskiz daftari"
    ],
    "tools": [
      "Lazerli masofa o‘lchagich (Dalnomer)",
      "Lazerli sath (Nivelir)",
      "Ruletka 5-10m",
      "Burchak o‘lchagich (Uglomer)",
      "Planshet/noutbuk"
    ],
    "checklist": [
      {
        "text": "O‘lchamlar 3 marta turli nuqtalarda solishtirildi",
        "required": true
      },
      {
        "text": "Shaxta va risyerlar koordinatalari belgilandi",
        "required": true
      },
      {
        "text": "Buyurtmachi bilan barcha yozma talablar kelishildi",
        "required": true
      },
      {
        "text": "Foto va video fiksatsiya to‘liq arxivlandi",
        "required": false
      }
    ],
    "related_topics": [
      "Ob’yektni o‘lchash",
      "Ishchi loyiha / рабочая документация",
      "Funksional zonalash"
    ],
    "order_index": 15,
    "is_published": true,
    "id": 15
  },
  {
    "category_id": 2,
    "category_code": "02",
    "category_slug": "02-demontaj-ishlari",
    "category_title": "Demontaj ishlari",
    "category_icon": "🔨",
    "slug": "02-eski-mebellarni-chiqarish",
    "title": "Eski mebellarni chiqarish",
    "short_description": "Eski mebellarni chiqarish — eski konstruksiyalarni xavfsiz va ehtiyotkorlik bilan olib tashlash, yangi qurilishga zamin tayyorlash jarayoni.",
    "purpose": "Qayta ta'mirlanadigan xonani begona, eskirgan yoki xalaqit beruvchi elementlardan tozalash, saqlab qolinishi kerak bo‘lgan qismlarga zarar yetkazmaslik.",
    "when_to_do": "Ta'mirlashning birinchi jismoniy bosqichi, loyiha tasdiqlangandan so‘ng darhol.",
    "before_start": "Elektr tokini va suv kirish kranlarini to‘liq o‘chirish, qo‘shnilarni ogohlantirish, chiqindi qoplari va xavfsizlik vositalarini tayyorlash.",
    "step_by_step": [
      "Kommunikatsiyalarni (elektr, gaz, suv) xavfsiz uzish va tekshirish.",
      "Saqlanib qoladigan deraza, eshik va oynalarni himoya plyonkasi bilan qoplash.",
      "Yuqoridan pastga qarab bosqichma-bosqich demontajni amalga oshirish.",
      "Buzilgan qismlarni maxsus qurilish qoplariga joylash.",
      "Qurilish chiqindilarini maxsus transport orqali poligonlarga olib chiqish."
    ],
    "rules": [
      "Yuk ko‘taruvchi (nesushiy) devorlarni, ustunlarni va rigellarni buzish qat'iyan man etiladi.",
      "Shovqinli ishlarni qonunchilikda belgilangan soatlarda (09:00 - 18:00) olib borish lozim.",
      "Shaxsiy himoya vositalari (respirator, kaska, qo‘lqop, ko‘zoynak) majburiy."
    ],
    "important_notes": "Binoning umumiy muhandislik shaxtalari va qo‘shnilar bilan chegaradosh qismlariga zarba tebranishini minimal darajada ushlab turish kerak.",
    "common_mistakes": [
      "Elektr simini kuchlanish ostida qoldirib buzish.",
      "Chiqindilarni oraliq yopmalarga (perekritiyaga) haddan tashqari ko‘p og‘irlik bilan to‘plash.",
      "Umumiy kanalizatsiya risyerini tiqib qo‘yish yoki sindirish."
    ],
    "quality_control": "Xonada begona qoldiqlar qolmaganligi, asosiy konstruksiyalarga zarar yetmaganligi ko‘zdan kechiriladi.",
    "materials": [
      "Mustahkam qurilish qoplari (polipropilen)",
      "Himoya plyonkasi",
      "Qurilish skochi",
      "Respiratorlar (FFP2/FFP3)"
    ],
    "tools": [
      "Perforator / Otboynik",
      "Bolgarka (USHM)",
      "Lom / Kirka",
      "Bolg‘a va zubilo",
      "Supurgi va qurilish changyutgichi"
    ],
    "checklist": [
      {
        "text": "Elektr va suv tarmoqlari o‘chirilganligi tekshirildi",
        "required": true
      },
      {
        "text": "Yuk ko‘taruvchi konstruksiyalarga daxl qilinmadi",
        "required": true
      },
      {
        "text": "Chiqindilar xaltalarga qadoqlandi va chiqarildi",
        "required": true
      },
      {
        "text": "Xona pol va devorlari changdan tozalandi",
        "required": false
      }
    ],
    "related_topics": [
      "Keraksiz devorlarni buzish",
      "Qurilish chiqindilarini chiqarish",
      "Ob’yektni tozalash"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 16
  },
  {
    "category_id": 2,
    "category_code": "02",
    "category_slug": "02-demontaj-ishlari",
    "category_title": "Demontaj ishlari",
    "category_icon": "🔨",
    "slug": "02-eski-santexnika-jihozlarini-demontaj-qilish",
    "title": "Eski santexnika jihozlarini demontaj qilish",
    "short_description": "Eski santexnika jihozlarini demontaj qilish — eski konstruksiyalarni xavfsiz va ehtiyotkorlik bilan olib tashlash, yangi qurilishga zamin tayyorlash jarayoni.",
    "purpose": "Qayta ta'mirlanadigan xonani begona, eskirgan yoki xalaqit beruvchi elementlardan tozalash, saqlab qolinishi kerak bo‘lgan qismlarga zarar yetkazmaslik.",
    "when_to_do": "Ta'mirlashning birinchi jismoniy bosqichi, loyiha tasdiqlangandan so‘ng darhol.",
    "before_start": "Elektr tokini va suv kirish kranlarini to‘liq o‘chirish, qo‘shnilarni ogohlantirish, chiqindi qoplari va xavfsizlik vositalarini tayyorlash.",
    "step_by_step": [
      "Kommunikatsiyalarni (elektr, gaz, suv) xavfsiz uzish va tekshirish.",
      "Saqlanib qoladigan deraza, eshik va oynalarni himoya plyonkasi bilan qoplash.",
      "Yuqoridan pastga qarab bosqichma-bosqich demontajni amalga oshirish.",
      "Buzilgan qismlarni maxsus qurilish qoplariga joylash.",
      "Qurilish chiqindilarini maxsus transport orqali poligonlarga olib chiqish."
    ],
    "rules": [
      "Yuk ko‘taruvchi (nesushiy) devorlarni, ustunlarni va rigellarni buzish qat'iyan man etiladi.",
      "Shovqinli ishlarni qonunchilikda belgilangan soatlarda (09:00 - 18:00) olib borish lozim.",
      "Shaxsiy himoya vositalari (respirator, kaska, qo‘lqop, ko‘zoynak) majburiy."
    ],
    "important_notes": "Binoning umumiy muhandislik shaxtalari va qo‘shnilar bilan chegaradosh qismlariga zarba tebranishini minimal darajada ushlab turish kerak.",
    "common_mistakes": [
      "Elektr simini kuchlanish ostida qoldirib buzish.",
      "Chiqindilarni oraliq yopmalarga (perekritiyaga) haddan tashqari ko‘p og‘irlik bilan to‘plash.",
      "Umumiy kanalizatsiya risyerini tiqib qo‘yish yoki sindirish."
    ],
    "quality_control": "Xonada begona qoldiqlar qolmaganligi, asosiy konstruksiyalarga zarar yetmaganligi ko‘zdan kechiriladi.",
    "materials": [
      "Mustahkam qurilish qoplari (polipropilen)",
      "Himoya plyonkasi",
      "Qurilish skochi",
      "Respiratorlar (FFP2/FFP3)"
    ],
    "tools": [
      "Perforator / Otboynik",
      "Bolgarka (USHM)",
      "Lom / Kirka",
      "Bolg‘a va zubilo",
      "Supurgi va qurilish changyutgichi"
    ],
    "checklist": [
      {
        "text": "Elektr va suv tarmoqlari o‘chirilganligi tekshirildi",
        "required": true
      },
      {
        "text": "Yuk ko‘taruvchi konstruksiyalarga daxl qilinmadi",
        "required": true
      },
      {
        "text": "Chiqindilar xaltalarga qadoqlandi va chiqarildi",
        "required": true
      },
      {
        "text": "Xona pol va devorlari changdan tozalandi",
        "required": false
      }
    ],
    "related_topics": [
      "Keraksiz devorlarni buzish",
      "Qurilish chiqindilarini chiqarish",
      "Ob’yektni tozalash"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 17
  },
  {
    "category_id": 2,
    "category_code": "02",
    "category_slug": "02-demontaj-ishlari",
    "category_title": "Demontaj ishlari",
    "category_icon": "🔨",
    "slug": "02-eski-elektr-jihozlarini-demontaj-qilish",
    "title": "Eski elektr jihozlarini demontaj qilish",
    "short_description": "Eski elektr jihozlarini demontaj qilish — eski konstruksiyalarni xavfsiz va ehtiyotkorlik bilan olib tashlash, yangi qurilishga zamin tayyorlash jarayoni.",
    "purpose": "Qayta ta'mirlanadigan xonani begona, eskirgan yoki xalaqit beruvchi elementlardan tozalash, saqlab qolinishi kerak bo‘lgan qismlarga zarar yetkazmaslik.",
    "when_to_do": "Ta'mirlashning birinchi jismoniy bosqichi, loyiha tasdiqlangandan so‘ng darhol.",
    "before_start": "Elektr tokini va suv kirish kranlarini to‘liq o‘chirish, qo‘shnilarni ogohlantirish, chiqindi qoplari va xavfsizlik vositalarini tayyorlash.",
    "step_by_step": [
      "Kommunikatsiyalarni (elektr, gaz, suv) xavfsiz uzish va tekshirish.",
      "Saqlanib qoladigan deraza, eshik va oynalarni himoya plyonkasi bilan qoplash.",
      "Yuqoridan pastga qarab bosqichma-bosqich demontajni amalga oshirish.",
      "Buzilgan qismlarni maxsus qurilish qoplariga joylash.",
      "Qurilish chiqindilarini maxsus transport orqali poligonlarga olib chiqish."
    ],
    "rules": [
      "Yuk ko‘taruvchi (nesushiy) devorlarni, ustunlarni va rigellarni buzish qat'iyan man etiladi.",
      "Shovqinli ishlarni qonunchilikda belgilangan soatlarda (09:00 - 18:00) olib borish lozim.",
      "Shaxsiy himoya vositalari (respirator, kaska, qo‘lqop, ko‘zoynak) majburiy."
    ],
    "important_notes": "Binoning umumiy muhandislik shaxtalari va qo‘shnilar bilan chegaradosh qismlariga zarba tebranishini minimal darajada ushlab turish kerak.",
    "common_mistakes": [
      "Elektr simini kuchlanish ostida qoldirib buzish.",
      "Chiqindilarni oraliq yopmalarga (perekritiyaga) haddan tashqari ko‘p og‘irlik bilan to‘plash.",
      "Umumiy kanalizatsiya risyerini tiqib qo‘yish yoki sindirish."
    ],
    "quality_control": "Xonada begona qoldiqlar qolmaganligi, asosiy konstruksiyalarga zarar yetmaganligi ko‘zdan kechiriladi.",
    "materials": [
      "Mustahkam qurilish qoplari (polipropilen)",
      "Himoya plyonkasi",
      "Qurilish skochi",
      "Respiratorlar (FFP2/FFP3)"
    ],
    "tools": [
      "Perforator / Otboynik",
      "Bolgarka (USHM)",
      "Lom / Kirka",
      "Bolg‘a va zubilo",
      "Supurgi va qurilish changyutgichi"
    ],
    "checklist": [
      {
        "text": "Elektr va suv tarmoqlari o‘chirilganligi tekshirildi",
        "required": true
      },
      {
        "text": "Yuk ko‘taruvchi konstruksiyalarga daxl qilinmadi",
        "required": true
      },
      {
        "text": "Chiqindilar xaltalarga qadoqlandi va chiqarildi",
        "required": true
      },
      {
        "text": "Xona pol va devorlari changdan tozalandi",
        "required": false
      }
    ],
    "related_topics": [
      "Keraksiz devorlarni buzish",
      "Qurilish chiqindilarini chiqarish",
      "Ob’yektni tozalash"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 18
  },
  {
    "category_id": 2,
    "category_code": "02",
    "category_slug": "02-demontaj-ishlari",
    "category_title": "Demontaj ishlari",
    "category_icon": "🔨",
    "slug": "02-eski-eshiklarni-demontaj-qilish",
    "title": "Eski eshiklarni demontaj qilish",
    "short_description": "Eski eshiklarni demontaj qilish — eski konstruksiyalarni xavfsiz va ehtiyotkorlik bilan olib tashlash, yangi qurilishga zamin tayyorlash jarayoni.",
    "purpose": "Qayta ta'mirlanadigan xonani begona, eskirgan yoki xalaqit beruvchi elementlardan tozalash, saqlab qolinishi kerak bo‘lgan qismlarga zarar yetkazmaslik.",
    "when_to_do": "Ta'mirlashning birinchi jismoniy bosqichi, loyiha tasdiqlangandan so‘ng darhol.",
    "before_start": "Elektr tokini va suv kirish kranlarini to‘liq o‘chirish, qo‘shnilarni ogohlantirish, chiqindi qoplari va xavfsizlik vositalarini tayyorlash.",
    "step_by_step": [
      "Kommunikatsiyalarni (elektr, gaz, suv) xavfsiz uzish va tekshirish.",
      "Saqlanib qoladigan deraza, eshik va oynalarni himoya plyonkasi bilan qoplash.",
      "Yuqoridan pastga qarab bosqichma-bosqich demontajni amalga oshirish.",
      "Buzilgan qismlarni maxsus qurilish qoplariga joylash.",
      "Qurilish chiqindilarini maxsus transport orqali poligonlarga olib chiqish."
    ],
    "rules": [
      "Yuk ko‘taruvchi (nesushiy) devorlarni, ustunlarni va rigellarni buzish qat'iyan man etiladi.",
      "Shovqinli ishlarni qonunchilikda belgilangan soatlarda (09:00 - 18:00) olib borish lozim.",
      "Shaxsiy himoya vositalari (respirator, kaska, qo‘lqop, ko‘zoynak) majburiy."
    ],
    "important_notes": "Binoning umumiy muhandislik shaxtalari va qo‘shnilar bilan chegaradosh qismlariga zarba tebranishini minimal darajada ushlab turish kerak.",
    "common_mistakes": [
      "Elektr simini kuchlanish ostida qoldirib buzish.",
      "Chiqindilarni oraliq yopmalarga (perekritiyaga) haddan tashqari ko‘p og‘irlik bilan to‘plash.",
      "Umumiy kanalizatsiya risyerini tiqib qo‘yish yoki sindirish."
    ],
    "quality_control": "Xonada begona qoldiqlar qolmaganligi, asosiy konstruksiyalarga zarar yetmaganligi ko‘zdan kechiriladi.",
    "materials": [
      "Mustahkam qurilish qoplari (polipropilen)",
      "Himoya plyonkasi",
      "Qurilish skochi",
      "Respiratorlar (FFP2/FFP3)"
    ],
    "tools": [
      "Perforator / Otboynik",
      "Bolgarka (USHM)",
      "Lom / Kirka",
      "Bolg‘a va zubilo",
      "Supurgi va qurilish changyutgichi"
    ],
    "checklist": [
      {
        "text": "Elektr va suv tarmoqlari o‘chirilganligi tekshirildi",
        "required": true
      },
      {
        "text": "Yuk ko‘taruvchi konstruksiyalarga daxl qilinmadi",
        "required": true
      },
      {
        "text": "Chiqindilar xaltalarga qadoqlandi va chiqarildi",
        "required": true
      },
      {
        "text": "Xona pol va devorlari changdan tozalandi",
        "required": false
      }
    ],
    "related_topics": [
      "Keraksiz devorlarni buzish",
      "Qurilish chiqindilarini chiqarish",
      "Ob’yektni tozalash"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 19
  },
  {
    "category_id": 2,
    "category_code": "02",
    "category_slug": "02-demontaj-ishlari",
    "category_title": "Demontaj ishlari",
    "category_icon": "🔨",
    "slug": "02-eski-plitkalarni-demontaj-qilish",
    "title": "Eski plitkalarni demontaj qilish",
    "short_description": "Eski plitkalarni demontaj qilish — eski konstruksiyalarni xavfsiz va ehtiyotkorlik bilan olib tashlash, yangi qurilishga zamin tayyorlash jarayoni.",
    "purpose": "Qayta ta'mirlanadigan xonani begona, eskirgan yoki xalaqit beruvchi elementlardan tozalash, saqlab qolinishi kerak bo‘lgan qismlarga zarar yetkazmaslik.",
    "when_to_do": "Ta'mirlashning birinchi jismoniy bosqichi, loyiha tasdiqlangandan so‘ng darhol.",
    "before_start": "Elektr tokini va suv kirish kranlarini to‘liq o‘chirish, qo‘shnilarni ogohlantirish, chiqindi qoplari va xavfsizlik vositalarini tayyorlash.",
    "step_by_step": [
      "Kommunikatsiyalarni (elektr, gaz, suv) xavfsiz uzish va tekshirish.",
      "Saqlanib qoladigan deraza, eshik va oynalarni himoya plyonkasi bilan qoplash.",
      "Yuqoridan pastga qarab bosqichma-bosqich demontajni amalga oshirish.",
      "Buzilgan qismlarni maxsus qurilish qoplariga joylash.",
      "Qurilish chiqindilarini maxsus transport orqali poligonlarga olib chiqish."
    ],
    "rules": [
      "Yuk ko‘taruvchi (nesushiy) devorlarni, ustunlarni va rigellarni buzish qat'iyan man etiladi.",
      "Shovqinli ishlarni qonunchilikda belgilangan soatlarda (09:00 - 18:00) olib borish lozim.",
      "Shaxsiy himoya vositalari (respirator, kaska, qo‘lqop, ko‘zoynak) majburiy."
    ],
    "important_notes": "Binoning umumiy muhandislik shaxtalari va qo‘shnilar bilan chegaradosh qismlariga zarba tebranishini minimal darajada ushlab turish kerak.",
    "common_mistakes": [
      "Elektr simini kuchlanish ostida qoldirib buzish.",
      "Chiqindilarni oraliq yopmalarga (perekritiyaga) haddan tashqari ko‘p og‘irlik bilan to‘plash.",
      "Umumiy kanalizatsiya risyerini tiqib qo‘yish yoki sindirish."
    ],
    "quality_control": "Xonada begona qoldiqlar qolmaganligi, asosiy konstruksiyalarga zarar yetmaganligi ko‘zdan kechiriladi.",
    "materials": [
      "Mustahkam qurilish qoplari (polipropilen)",
      "Himoya plyonkasi",
      "Qurilish skochi",
      "Respiratorlar (FFP2/FFP3)"
    ],
    "tools": [
      "Perforator / Otboynik",
      "Bolgarka (USHM)",
      "Lom / Kirka",
      "Bolg‘a va zubilo",
      "Supurgi va qurilish changyutgichi"
    ],
    "checklist": [
      {
        "text": "Elektr va suv tarmoqlari o‘chirilganligi tekshirildi",
        "required": true
      },
      {
        "text": "Yuk ko‘taruvchi konstruksiyalarga daxl qilinmadi",
        "required": true
      },
      {
        "text": "Chiqindilar xaltalarga qadoqlandi va chiqarildi",
        "required": true
      },
      {
        "text": "Xona pol va devorlari changdan tozalandi",
        "required": false
      }
    ],
    "related_topics": [
      "Keraksiz devorlarni buzish",
      "Qurilish chiqindilarini chiqarish",
      "Ob’yektni tozalash"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 20
  },
  {
    "category_id": 2,
    "category_code": "02",
    "category_slug": "02-demontaj-ishlari",
    "category_title": "Demontaj ishlari",
    "category_icon": "🔨",
    "slug": "02-eski-pol-qoplamalarini-olib-tashlash",
    "title": "Eski pol qoplamalarini olib tashlash",
    "short_description": "Eski pol qoplamalarini olib tashlash — eski konstruksiyalarni xavfsiz va ehtiyotkorlik bilan olib tashlash, yangi qurilishga zamin tayyorlash jarayoni.",
    "purpose": "Qayta ta'mirlanadigan xonani begona, eskirgan yoki xalaqit beruvchi elementlardan tozalash, saqlab qolinishi kerak bo‘lgan qismlarga zarar yetkazmaslik.",
    "when_to_do": "Ta'mirlashning birinchi jismoniy bosqichi, loyiha tasdiqlangandan so‘ng darhol.",
    "before_start": "Elektr tokini va suv kirish kranlarini to‘liq o‘chirish, qo‘shnilarni ogohlantirish, chiqindi qoplari va xavfsizlik vositalarini tayyorlash.",
    "step_by_step": [
      "Kommunikatsiyalarni (elektr, gaz, suv) xavfsiz uzish va tekshirish.",
      "Saqlanib qoladigan deraza, eshik va oynalarni himoya plyonkasi bilan qoplash.",
      "Yuqoridan pastga qarab bosqichma-bosqich demontajni amalga oshirish.",
      "Buzilgan qismlarni maxsus qurilish qoplariga joylash.",
      "Qurilish chiqindilarini maxsus transport orqali poligonlarga olib chiqish."
    ],
    "rules": [
      "Yuk ko‘taruvchi (nesushiy) devorlarni, ustunlarni va rigellarni buzish qat'iyan man etiladi.",
      "Shovqinli ishlarni qonunchilikda belgilangan soatlarda (09:00 - 18:00) olib borish lozim.",
      "Shaxsiy himoya vositalari (respirator, kaska, qo‘lqop, ko‘zoynak) majburiy."
    ],
    "important_notes": "Binoning umumiy muhandislik shaxtalari va qo‘shnilar bilan chegaradosh qismlariga zarba tebranishini minimal darajada ushlab turish kerak.",
    "common_mistakes": [
      "Elektr simini kuchlanish ostida qoldirib buzish.",
      "Chiqindilarni oraliq yopmalarga (perekritiyaga) haddan tashqari ko‘p og‘irlik bilan to‘plash.",
      "Umumiy kanalizatsiya risyerini tiqib qo‘yish yoki sindirish."
    ],
    "quality_control": "Xonada begona qoldiqlar qolmaganligi, asosiy konstruksiyalarga zarar yetmaganligi ko‘zdan kechiriladi.",
    "materials": [
      "Mustahkam qurilish qoplari (polipropilen)",
      "Himoya plyonkasi",
      "Qurilish skochi",
      "Respiratorlar (FFP2/FFP3)"
    ],
    "tools": [
      "Perforator / Otboynik",
      "Bolgarka (USHM)",
      "Lom / Kirka",
      "Bolg‘a va zubilo",
      "Supurgi va qurilish changyutgichi"
    ],
    "checklist": [
      {
        "text": "Elektr va suv tarmoqlari o‘chirilganligi tekshirildi",
        "required": true
      },
      {
        "text": "Yuk ko‘taruvchi konstruksiyalarga daxl qilinmadi",
        "required": true
      },
      {
        "text": "Chiqindilar xaltalarga qadoqlandi va chiqarildi",
        "required": true
      },
      {
        "text": "Xona pol va devorlari changdan tozalandi",
        "required": false
      }
    ],
    "related_topics": [
      "Keraksiz devorlarni buzish",
      "Qurilish chiqindilarini chiqarish",
      "Ob’yektni tozalash"
    ],
    "order_index": 6,
    "is_published": true,
    "id": 21
  },
  {
    "category_id": 2,
    "category_code": "02",
    "category_slug": "02-demontaj-ishlari",
    "category_title": "Demontaj ishlari",
    "category_icon": "🔨",
    "slug": "02-eski-plintuslarni-olib-tashlash",
    "title": "Eski plintuslarni olib tashlash",
    "short_description": "Eski plintuslarni olib tashlash — eski konstruksiyalarni xavfsiz va ehtiyotkorlik bilan olib tashlash, yangi qurilishga zamin tayyorlash jarayoni.",
    "purpose": "Qayta ta'mirlanadigan xonani begona, eskirgan yoki xalaqit beruvchi elementlardan tozalash, saqlab qolinishi kerak bo‘lgan qismlarga zarar yetkazmaslik.",
    "when_to_do": "Ta'mirlashning birinchi jismoniy bosqichi, loyiha tasdiqlangandan so‘ng darhol.",
    "before_start": "Elektr tokini va suv kirish kranlarini to‘liq o‘chirish, qo‘shnilarni ogohlantirish, chiqindi qoplari va xavfsizlik vositalarini tayyorlash.",
    "step_by_step": [
      "Kommunikatsiyalarni (elektr, gaz, suv) xavfsiz uzish va tekshirish.",
      "Saqlanib qoladigan deraza, eshik va oynalarni himoya plyonkasi bilan qoplash.",
      "Yuqoridan pastga qarab bosqichma-bosqich demontajni amalga oshirish.",
      "Buzilgan qismlarni maxsus qurilish qoplariga joylash.",
      "Qurilish chiqindilarini maxsus transport orqali poligonlarga olib chiqish."
    ],
    "rules": [
      "Yuk ko‘taruvchi (nesushiy) devorlarni, ustunlarni va rigellarni buzish qat'iyan man etiladi.",
      "Shovqinli ishlarni qonunchilikda belgilangan soatlarda (09:00 - 18:00) olib borish lozim.",
      "Shaxsiy himoya vositalari (respirator, kaska, qo‘lqop, ko‘zoynak) majburiy."
    ],
    "important_notes": "Binoning umumiy muhandislik shaxtalari va qo‘shnilar bilan chegaradosh qismlariga zarba tebranishini minimal darajada ushlab turish kerak.",
    "common_mistakes": [
      "Elektr simini kuchlanish ostida qoldirib buzish.",
      "Chiqindilarni oraliq yopmalarga (perekritiyaga) haddan tashqari ko‘p og‘irlik bilan to‘plash.",
      "Umumiy kanalizatsiya risyerini tiqib qo‘yish yoki sindirish."
    ],
    "quality_control": "Xonada begona qoldiqlar qolmaganligi, asosiy konstruksiyalarga zarar yetmaganligi ko‘zdan kechiriladi.",
    "materials": [
      "Mustahkam qurilish qoplari (polipropilen)",
      "Himoya plyonkasi",
      "Qurilish skochi",
      "Respiratorlar (FFP2/FFP3)"
    ],
    "tools": [
      "Perforator / Otboynik",
      "Bolgarka (USHM)",
      "Lom / Kirka",
      "Bolg‘a va zubilo",
      "Supurgi va qurilish changyutgichi"
    ],
    "checklist": [
      {
        "text": "Elektr va suv tarmoqlari o‘chirilganligi tekshirildi",
        "required": true
      },
      {
        "text": "Yuk ko‘taruvchi konstruksiyalarga daxl qilinmadi",
        "required": true
      },
      {
        "text": "Chiqindilar xaltalarga qadoqlandi va chiqarildi",
        "required": true
      },
      {
        "text": "Xona pol va devorlari changdan tozalandi",
        "required": false
      }
    ],
    "related_topics": [
      "Keraksiz devorlarni buzish",
      "Qurilish chiqindilarini chiqarish",
      "Ob’yektni tozalash"
    ],
    "order_index": 7,
    "is_published": true,
    "id": 22
  },
  {
    "category_id": 2,
    "category_code": "02",
    "category_slug": "02-demontaj-ishlari",
    "category_title": "Demontaj ishlari",
    "category_icon": "🔨",
    "slug": "02-eski-oboy-boyoq-qatlamlarini-olib-tashlash",
    "title": "Eski oboy/bo‘yoq qatlamlarini olib tashlash",
    "short_description": "Eski oboy/bo‘yoq qatlamlarini olib tashlash — eski konstruksiyalarni xavfsiz va ehtiyotkorlik bilan olib tashlash, yangi qurilishga zamin tayyorlash jarayoni.",
    "purpose": "Qayta ta'mirlanadigan xonani begona, eskirgan yoki xalaqit beruvchi elementlardan tozalash, saqlab qolinishi kerak bo‘lgan qismlarga zarar yetkazmaslik.",
    "when_to_do": "Ta'mirlashning birinchi jismoniy bosqichi, loyiha tasdiqlangandan so‘ng darhol.",
    "before_start": "Elektr tokini va suv kirish kranlarini to‘liq o‘chirish, qo‘shnilarni ogohlantirish, chiqindi qoplari va xavfsizlik vositalarini tayyorlash.",
    "step_by_step": [
      "Kommunikatsiyalarni (elektr, gaz, suv) xavfsiz uzish va tekshirish.",
      "Saqlanib qoladigan deraza, eshik va oynalarni himoya plyonkasi bilan qoplash.",
      "Yuqoridan pastga qarab bosqichma-bosqich demontajni amalga oshirish.",
      "Buzilgan qismlarni maxsus qurilish qoplariga joylash.",
      "Qurilish chiqindilarini maxsus transport orqali poligonlarga olib chiqish."
    ],
    "rules": [
      "Yuk ko‘taruvchi (nesushiy) devorlarni, ustunlarni va rigellarni buzish qat'iyan man etiladi.",
      "Shovqinli ishlarni qonunchilikda belgilangan soatlarda (09:00 - 18:00) olib borish lozim.",
      "Shaxsiy himoya vositalari (respirator, kaska, qo‘lqop, ko‘zoynak) majburiy."
    ],
    "important_notes": "Binoning umumiy muhandislik shaxtalari va qo‘shnilar bilan chegaradosh qismlariga zarba tebranishini minimal darajada ushlab turish kerak.",
    "common_mistakes": [
      "Elektr simini kuchlanish ostida qoldirib buzish.",
      "Chiqindilarni oraliq yopmalarga (perekritiyaga) haddan tashqari ko‘p og‘irlik bilan to‘plash.",
      "Umumiy kanalizatsiya risyerini tiqib qo‘yish yoki sindirish."
    ],
    "quality_control": "Xonada begona qoldiqlar qolmaganligi, asosiy konstruksiyalarga zarar yetmaganligi ko‘zdan kechiriladi.",
    "materials": [
      "Mustahkam qurilish qoplari (polipropilen)",
      "Himoya plyonkasi",
      "Qurilish skochi",
      "Respiratorlar (FFP2/FFP3)"
    ],
    "tools": [
      "Perforator / Otboynik",
      "Bolgarka (USHM)",
      "Lom / Kirka",
      "Bolg‘a va zubilo",
      "Supurgi va qurilish changyutgichi"
    ],
    "checklist": [
      {
        "text": "Elektr va suv tarmoqlari o‘chirilganligi tekshirildi",
        "required": true
      },
      {
        "text": "Yuk ko‘taruvchi konstruksiyalarga daxl qilinmadi",
        "required": true
      },
      {
        "text": "Chiqindilar xaltalarga qadoqlandi va chiqarildi",
        "required": true
      },
      {
        "text": "Xona pol va devorlari changdan tozalandi",
        "required": false
      }
    ],
    "related_topics": [
      "Keraksiz devorlarni buzish",
      "Qurilish chiqindilarini chiqarish",
      "Ob’yektni tozalash"
    ],
    "order_index": 8,
    "is_published": true,
    "id": 23
  },
  {
    "category_id": 2,
    "category_code": "02",
    "category_slug": "02-demontaj-ishlari",
    "category_title": "Demontaj ishlari",
    "category_icon": "🔨",
    "slug": "02-keraksiz-gipsokarton-konstruksiyalarini-demontaj-qilish",
    "title": "Keraksiz gipsokarton konstruksiyalarini demontaj qilish",
    "short_description": "Keraksiz gipsokarton konstruksiyalarini demontaj qilish — eski konstruksiyalarni xavfsiz va ehtiyotkorlik bilan olib tashlash, yangi qurilishga zamin tayyorlash jarayoni.",
    "purpose": "Qayta ta'mirlanadigan xonani begona, eskirgan yoki xalaqit beruvchi elementlardan tozalash, saqlab qolinishi kerak bo‘lgan qismlarga zarar yetkazmaslik.",
    "when_to_do": "Ta'mirlashning birinchi jismoniy bosqichi, loyiha tasdiqlangandan so‘ng darhol.",
    "before_start": "Elektr tokini va suv kirish kranlarini to‘liq o‘chirish, qo‘shnilarni ogohlantirish, chiqindi qoplari va xavfsizlik vositalarini tayyorlash.",
    "step_by_step": [
      "Kommunikatsiyalarni (elektr, gaz, suv) xavfsiz uzish va tekshirish.",
      "Saqlanib qoladigan deraza, eshik va oynalarni himoya plyonkasi bilan qoplash.",
      "Yuqoridan pastga qarab bosqichma-bosqich demontajni amalga oshirish.",
      "Buzilgan qismlarni maxsus qurilish qoplariga joylash.",
      "Qurilish chiqindilarini maxsus transport orqali poligonlarga olib chiqish."
    ],
    "rules": [
      "Yuk ko‘taruvchi (nesushiy) devorlarni, ustunlarni va rigellarni buzish qat'iyan man etiladi.",
      "Shovqinli ishlarni qonunchilikda belgilangan soatlarda (09:00 - 18:00) olib borish lozim.",
      "Shaxsiy himoya vositalari (respirator, kaska, qo‘lqop, ko‘zoynak) majburiy."
    ],
    "important_notes": "Binoning umumiy muhandislik shaxtalari va qo‘shnilar bilan chegaradosh qismlariga zarba tebranishini minimal darajada ushlab turish kerak.",
    "common_mistakes": [
      "Elektr simini kuchlanish ostida qoldirib buzish.",
      "Chiqindilarni oraliq yopmalarga (perekritiyaga) haddan tashqari ko‘p og‘irlik bilan to‘plash.",
      "Umumiy kanalizatsiya risyerini tiqib qo‘yish yoki sindirish."
    ],
    "quality_control": "Xonada begona qoldiqlar qolmaganligi, asosiy konstruksiyalarga zarar yetmaganligi ko‘zdan kechiriladi.",
    "materials": [
      "Mustahkam qurilish qoplari (polipropilen)",
      "Himoya plyonkasi",
      "Qurilish skochi",
      "Respiratorlar (FFP2/FFP3)"
    ],
    "tools": [
      "Perforator / Otboynik",
      "Bolgarka (USHM)",
      "Lom / Kirka",
      "Bolg‘a va zubilo",
      "Supurgi va qurilish changyutgichi"
    ],
    "checklist": [
      {
        "text": "Elektr va suv tarmoqlari o‘chirilganligi tekshirildi",
        "required": true
      },
      {
        "text": "Yuk ko‘taruvchi konstruksiyalarga daxl qilinmadi",
        "required": true
      },
      {
        "text": "Chiqindilar xaltalarga qadoqlandi va chiqarildi",
        "required": true
      },
      {
        "text": "Xona pol va devorlari changdan tozalandi",
        "required": false
      }
    ],
    "related_topics": [
      "Keraksiz devorlarni buzish",
      "Qurilish chiqindilarini chiqarish",
      "Ob’yektni tozalash"
    ],
    "order_index": 9,
    "is_published": true,
    "id": 24
  },
  {
    "category_id": 2,
    "category_code": "02",
    "category_slug": "02-demontaj-ishlari",
    "category_title": "Demontaj ishlari",
    "category_icon": "🔨",
    "slug": "02-keraksiz-devorlarni-buzish",
    "title": "Keraksiz devorlarni buzish",
    "short_description": "Keraksiz devorlarni buzish — eski konstruksiyalarni xavfsiz va ehtiyotkorlik bilan olib tashlash, yangi qurilishga zamin tayyorlash jarayoni.",
    "purpose": "Qayta ta'mirlanadigan xonani begona, eskirgan yoki xalaqit beruvchi elementlardan tozalash, saqlab qolinishi kerak bo‘lgan qismlarga zarar yetkazmaslik.",
    "when_to_do": "Ta'mirlashning birinchi jismoniy bosqichi, loyiha tasdiqlangandan so‘ng darhol.",
    "before_start": "Elektr tokini va suv kirish kranlarini to‘liq o‘chirish, qo‘shnilarni ogohlantirish, chiqindi qoplari va xavfsizlik vositalarini tayyorlash.",
    "step_by_step": [
      "Kommunikatsiyalarni (elektr, gaz, suv) xavfsiz uzish va tekshirish.",
      "Saqlanib qoladigan deraza, eshik va oynalarni himoya plyonkasi bilan qoplash.",
      "Yuqoridan pastga qarab bosqichma-bosqich demontajni amalga oshirish.",
      "Buzilgan qismlarni maxsus qurilish qoplariga joylash.",
      "Qurilish chiqindilarini maxsus transport orqali poligonlarga olib chiqish."
    ],
    "rules": [
      "Yuk ko‘taruvchi (nesushiy) devorlarni, ustunlarni va rigellarni buzish qat'iyan man etiladi.",
      "Shovqinli ishlarni qonunchilikda belgilangan soatlarda (09:00 - 18:00) olib borish lozim.",
      "Shaxsiy himoya vositalari (respirator, kaska, qo‘lqop, ko‘zoynak) majburiy."
    ],
    "important_notes": "Binoning umumiy muhandislik shaxtalari va qo‘shnilar bilan chegaradosh qismlariga zarba tebranishini minimal darajada ushlab turish kerak.",
    "common_mistakes": [
      "Elektr simini kuchlanish ostida qoldirib buzish.",
      "Chiqindilarni oraliq yopmalarga (perekritiyaga) haddan tashqari ko‘p og‘irlik bilan to‘plash.",
      "Umumiy kanalizatsiya risyerini tiqib qo‘yish yoki sindirish."
    ],
    "quality_control": "Xonada begona qoldiqlar qolmaganligi, asosiy konstruksiyalarga zarar yetmaganligi ko‘zdan kechiriladi.",
    "materials": [
      "Mustahkam qurilish qoplari (polipropilen)",
      "Himoya plyonkasi",
      "Qurilish skochi",
      "Respiratorlar (FFP2/FFP3)"
    ],
    "tools": [
      "Perforator / Otboynik",
      "Bolgarka (USHM)",
      "Lom / Kirka",
      "Bolg‘a va zubilo",
      "Supurgi va qurilish changyutgichi"
    ],
    "checklist": [
      {
        "text": "Elektr va suv tarmoqlari o‘chirilganligi tekshirildi",
        "required": true
      },
      {
        "text": "Yuk ko‘taruvchi konstruksiyalarga daxl qilinmadi",
        "required": true
      },
      {
        "text": "Chiqindilar xaltalarga qadoqlandi va chiqarildi",
        "required": true
      },
      {
        "text": "Xona pol va devorlari changdan tozalandi",
        "required": false
      }
    ],
    "related_topics": [
      "Keraksiz devorlarni buzish",
      "Qurilish chiqindilarini chiqarish",
      "Ob’yektni tozalash"
    ],
    "order_index": 10,
    "is_published": true,
    "id": 25
  },
  {
    "category_id": 2,
    "category_code": "02",
    "category_slug": "02-demontaj-ishlari",
    "category_title": "Demontaj ishlari",
    "category_icon": "🔨",
    "slug": "02-kerakli-konstruksiyalarni-saqlab-qolish",
    "title": "Kerakli konstruksiyalarni saqlab qolish",
    "short_description": "Kerakli konstruksiyalarni saqlab qolish — eski konstruksiyalarni xavfsiz va ehtiyotkorlik bilan olib tashlash, yangi qurilishga zamin tayyorlash jarayoni.",
    "purpose": "Qayta ta'mirlanadigan xonani begona, eskirgan yoki xalaqit beruvchi elementlardan tozalash, saqlab qolinishi kerak bo‘lgan qismlarga zarar yetkazmaslik.",
    "when_to_do": "Ta'mirlashning birinchi jismoniy bosqichi, loyiha tasdiqlangandan so‘ng darhol.",
    "before_start": "Elektr tokini va suv kirish kranlarini to‘liq o‘chirish, qo‘shnilarni ogohlantirish, chiqindi qoplari va xavfsizlik vositalarini tayyorlash.",
    "step_by_step": [
      "Kommunikatsiyalarni (elektr, gaz, suv) xavfsiz uzish va tekshirish.",
      "Saqlanib qoladigan deraza, eshik va oynalarni himoya plyonkasi bilan qoplash.",
      "Yuqoridan pastga qarab bosqichma-bosqich demontajni amalga oshirish.",
      "Buzilgan qismlarni maxsus qurilish qoplariga joylash.",
      "Qurilish chiqindilarini maxsus transport orqali poligonlarga olib chiqish."
    ],
    "rules": [
      "Yuk ko‘taruvchi (nesushiy) devorlarni, ustunlarni va rigellarni buzish qat'iyan man etiladi.",
      "Shovqinli ishlarni qonunchilikda belgilangan soatlarda (09:00 - 18:00) olib borish lozim.",
      "Shaxsiy himoya vositalari (respirator, kaska, qo‘lqop, ko‘zoynak) majburiy."
    ],
    "important_notes": "Binoning umumiy muhandislik shaxtalari va qo‘shnilar bilan chegaradosh qismlariga zarba tebranishini minimal darajada ushlab turish kerak.",
    "common_mistakes": [
      "Elektr simini kuchlanish ostida qoldirib buzish.",
      "Chiqindilarni oraliq yopmalarga (perekritiyaga) haddan tashqari ko‘p og‘irlik bilan to‘plash.",
      "Umumiy kanalizatsiya risyerini tiqib qo‘yish yoki sindirish."
    ],
    "quality_control": "Xonada begona qoldiqlar qolmaganligi, asosiy konstruksiyalarga zarar yetmaganligi ko‘zdan kechiriladi.",
    "materials": [
      "Mustahkam qurilish qoplari (polipropilen)",
      "Himoya plyonkasi",
      "Qurilish skochi",
      "Respiratorlar (FFP2/FFP3)"
    ],
    "tools": [
      "Perforator / Otboynik",
      "Bolgarka (USHM)",
      "Lom / Kirka",
      "Bolg‘a va zubilo",
      "Supurgi va qurilish changyutgichi"
    ],
    "checklist": [
      {
        "text": "Elektr va suv tarmoqlari o‘chirilganligi tekshirildi",
        "required": true
      },
      {
        "text": "Yuk ko‘taruvchi konstruksiyalarga daxl qilinmadi",
        "required": true
      },
      {
        "text": "Chiqindilar xaltalarga qadoqlandi va chiqarildi",
        "required": true
      },
      {
        "text": "Xona pol va devorlari changdan tozalandi",
        "required": false
      }
    ],
    "related_topics": [
      "Keraksiz devorlarni buzish",
      "Qurilish chiqindilarini chiqarish",
      "Ob’yektni tozalash"
    ],
    "order_index": 11,
    "is_published": true,
    "id": 26
  },
  {
    "category_id": 2,
    "category_code": "02",
    "category_slug": "02-demontaj-ishlari",
    "category_title": "Demontaj ishlari",
    "category_icon": "🔨",
    "slug": "02-qurilish-chiqindilarini-chiqarish",
    "title": "Qurilish chiqindilarini chiqarish",
    "short_description": "Qurilish chiqindilarini chiqarish — eski konstruksiyalarni xavfsiz va ehtiyotkorlik bilan olib tashlash, yangi qurilishga zamin tayyorlash jarayoni.",
    "purpose": "Qayta ta'mirlanadigan xonani begona, eskirgan yoki xalaqit beruvchi elementlardan tozalash, saqlab qolinishi kerak bo‘lgan qismlarga zarar yetkazmaslik.",
    "when_to_do": "Ta'mirlashning birinchi jismoniy bosqichi, loyiha tasdiqlangandan so‘ng darhol.",
    "before_start": "Elektr tokini va suv kirish kranlarini to‘liq o‘chirish, qo‘shnilarni ogohlantirish, chiqindi qoplari va xavfsizlik vositalarini tayyorlash.",
    "step_by_step": [
      "Kommunikatsiyalarni (elektr, gaz, suv) xavfsiz uzish va tekshirish.",
      "Saqlanib qoladigan deraza, eshik va oynalarni himoya plyonkasi bilan qoplash.",
      "Yuqoridan pastga qarab bosqichma-bosqich demontajni amalga oshirish.",
      "Buzilgan qismlarni maxsus qurilish qoplariga joylash.",
      "Qurilish chiqindilarini maxsus transport orqali poligonlarga olib chiqish."
    ],
    "rules": [
      "Yuk ko‘taruvchi (nesushiy) devorlarni, ustunlarni va rigellarni buzish qat'iyan man etiladi.",
      "Shovqinli ishlarni qonunchilikda belgilangan soatlarda (09:00 - 18:00) olib borish lozim.",
      "Shaxsiy himoya vositalari (respirator, kaska, qo‘lqop, ko‘zoynak) majburiy."
    ],
    "important_notes": "Binoning umumiy muhandislik shaxtalari va qo‘shnilar bilan chegaradosh qismlariga zarba tebranishini minimal darajada ushlab turish kerak.",
    "common_mistakes": [
      "Elektr simini kuchlanish ostida qoldirib buzish.",
      "Chiqindilarni oraliq yopmalarga (perekritiyaga) haddan tashqari ko‘p og‘irlik bilan to‘plash.",
      "Umumiy kanalizatsiya risyerini tiqib qo‘yish yoki sindirish."
    ],
    "quality_control": "Xonada begona qoldiqlar qolmaganligi, asosiy konstruksiyalarga zarar yetmaganligi ko‘zdan kechiriladi.",
    "materials": [
      "Mustahkam qurilish qoplari (polipropilen)",
      "Himoya plyonkasi",
      "Qurilish skochi",
      "Respiratorlar (FFP2/FFP3)"
    ],
    "tools": [
      "Perforator / Otboynik",
      "Bolgarka (USHM)",
      "Lom / Kirka",
      "Bolg‘a va zubilo",
      "Supurgi va qurilish changyutgichi"
    ],
    "checklist": [
      {
        "text": "Elektr va suv tarmoqlari o‘chirilganligi tekshirildi",
        "required": true
      },
      {
        "text": "Yuk ko‘taruvchi konstruksiyalarga daxl qilinmadi",
        "required": true
      },
      {
        "text": "Chiqindilar xaltalarga qadoqlandi va chiqarildi",
        "required": true
      },
      {
        "text": "Xona pol va devorlari changdan tozalandi",
        "required": false
      }
    ],
    "related_topics": [
      "Keraksiz devorlarni buzish",
      "Qurilish chiqindilarini chiqarish",
      "Ob’yektni tozalash"
    ],
    "order_index": 12,
    "is_published": true,
    "id": 27
  },
  {
    "category_id": 2,
    "category_code": "02",
    "category_slug": "02-demontaj-ishlari",
    "category_title": "Demontaj ishlari",
    "category_icon": "🔨",
    "slug": "02-obyektni-tozalash",
    "title": "Ob’yektni tozalash",
    "short_description": "Ob’yektni tozalash — eski konstruksiyalarni xavfsiz va ehtiyotkorlik bilan olib tashlash, yangi qurilishga zamin tayyorlash jarayoni.",
    "purpose": "Qayta ta'mirlanadigan xonani begona, eskirgan yoki xalaqit beruvchi elementlardan tozalash, saqlab qolinishi kerak bo‘lgan qismlarga zarar yetkazmaslik.",
    "when_to_do": "Ta'mirlashning birinchi jismoniy bosqichi, loyiha tasdiqlangandan so‘ng darhol.",
    "before_start": "Elektr tokini va suv kirish kranlarini to‘liq o‘chirish, qo‘shnilarni ogohlantirish, chiqindi qoplari va xavfsizlik vositalarini tayyorlash.",
    "step_by_step": [
      "Kommunikatsiyalarni (elektr, gaz, suv) xavfsiz uzish va tekshirish.",
      "Saqlanib qoladigan deraza, eshik va oynalarni himoya plyonkasi bilan qoplash.",
      "Yuqoridan pastga qarab bosqichma-bosqich demontajni amalga oshirish.",
      "Buzilgan qismlarni maxsus qurilish qoplariga joylash.",
      "Qurilish chiqindilarini maxsus transport orqali poligonlarga olib chiqish."
    ],
    "rules": [
      "Yuk ko‘taruvchi (nesushiy) devorlarni, ustunlarni va rigellarni buzish qat'iyan man etiladi.",
      "Shovqinli ishlarni qonunchilikda belgilangan soatlarda (09:00 - 18:00) olib borish lozim.",
      "Shaxsiy himoya vositalari (respirator, kaska, qo‘lqop, ko‘zoynak) majburiy."
    ],
    "important_notes": "Binoning umumiy muhandislik shaxtalari va qo‘shnilar bilan chegaradosh qismlariga zarba tebranishini minimal darajada ushlab turish kerak.",
    "common_mistakes": [
      "Elektr simini kuchlanish ostida qoldirib buzish.",
      "Chiqindilarni oraliq yopmalarga (perekritiyaga) haddan tashqari ko‘p og‘irlik bilan to‘plash.",
      "Umumiy kanalizatsiya risyerini tiqib qo‘yish yoki sindirish."
    ],
    "quality_control": "Xonada begona qoldiqlar qolmaganligi, asosiy konstruksiyalarga zarar yetmaganligi ko‘zdan kechiriladi.",
    "materials": [
      "Mustahkam qurilish qoplari (polipropilen)",
      "Himoya plyonkasi",
      "Qurilish skochi",
      "Respiratorlar (FFP2/FFP3)"
    ],
    "tools": [
      "Perforator / Otboynik",
      "Bolgarka (USHM)",
      "Lom / Kirka",
      "Bolg‘a va zubilo",
      "Supurgi va qurilish changyutgichi"
    ],
    "checklist": [
      {
        "text": "Elektr va suv tarmoqlari o‘chirilganligi tekshirildi",
        "required": true
      },
      {
        "text": "Yuk ko‘taruvchi konstruksiyalarga daxl qilinmadi",
        "required": true
      },
      {
        "text": "Chiqindilar xaltalarga qadoqlandi va chiqarildi",
        "required": true
      },
      {
        "text": "Xona pol va devorlari changdan tozalandi",
        "required": false
      }
    ],
    "related_topics": [
      "Keraksiz devorlarni buzish",
      "Qurilish chiqindilarini chiqarish",
      "Ob’yektni tozalash"
    ],
    "order_index": 13,
    "is_published": true,
    "id": 28
  },
  {
    "category_id": 3,
    "category_code": "03",
    "category_slug": "03-qurilish-va-rejalashtirish",
    "category_title": "Qurilish va rejalashtirish ishlari",
    "category_icon": "🧱",
    "slug": "03-yangi-devorlar-ornini-belgilash",
    "title": "Yangi devorlar o‘rnini belgilash",
    "short_description": "Yangi devorlar o‘rnini belgilash — xonalarni rejalashtirish bo‘yicha yangi to‘siqlar va arxitektura shakllarini mustahkam qad rostlashi.",
    "purpose": "Loyiha rejasidagi xonalarni aniq geometriya, tovush izolyatsiyasi va mebel o‘lchamlariga mos ravishda ajratish.",
    "when_to_do": "Demontaj yakunlanib, zamin tozalanib gruntovkalanib bo‘lingach, kommunikatsiyalar tortilishidan oldin.",
    "before_start": "Pol yuzasidagi to‘liq tozalik, lazerli tekislagich bilan o‘qlarni polga va shiftga chizib olish.",
    "step_by_step": [
      "Loyiha bo‘yicha devor o‘qlarini lazer bilan pol, devor va shiftga belgilash.",
      "Zamin bilan birinchi qator orasiga gidro/shumoizolyatsiya lentasini (dempfer) qo‘yish.",
      "G‘isht, gazoblok yoki GKL karkasni bosqichma-bosqich o‘rnatish.",
      "Har 2-3 qatorda asosiy devorlar bilan bog‘lovchi armatura/ankerni o‘rnatish.",
      "Eshik va nisha o‘rinlarini loyiha o‘lchamiga muvofiq mustahkamlangan peremichkalar bilan ochish."
    ],
    "rules": [
      "Devorlarning vertikalligi va 90° burchaklar (ayniqsa oshxona va sanuzelda) qat'iy nazorat qilinadi.",
      "Shift bilan yangi devor orasida 2-3 sm deformatsion tirqish qoldirilib, montaj ko‘pigi bilan to‘ldiriladi.",
      "Gipsokarton devorlarda oraliq profillar qadami 40 yoki 60 sm bo‘lishi shart."
    ],
    "important_notes": "Eshik o‘rni kengligi eshik polotnosidan 8-10 sm kengroq, balandligi esa toza poldan 206-208 sm bo‘lishi lozim.",
    "common_mistakes": [
      "Toza pol balandligini hisobga olmasdan eshik o‘rnini past qoldirish.",
      "Oshxona mebeli keladigan burchakni 90 gradus qilib terilmasligi.",
      "Asosiy devor bilan bog‘lovchi ankerlar qo‘yilmasligi oqibatida yoriqlar paydo bo‘lishi."
    ],
    "quality_control": "2 metrli qoida (pravilo) qo‘yilganda tirqish 2 mm dan oshmasligi, vertikaldan og‘ish 1 metrga 1.5 mm dan oshmasligi tekshiriladi.",
    "materials": [
      "Gazobeton bloklar / G‘isht",
      "Maxsus yelim (Kley)",
      "Armatura to‘ri / Ankerlar",
      "Montaj ko‘pigi",
      "Dempfer lenta"
    ],
    "tools": [
      "Lazerli 360° nivelir",
      "2 metrli qoida (Pravilo)",
      "Rezinli bolg‘a (Kiyanka)",
      "Tishli molga",
      "Miksyer va idish"
    ],
    "checklist": [
      {
        "text": "O‘qlar va 90 gradus burchaklar lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Eshik o‘lchamlari standartga muvofiq qoldirildi",
        "required": true
      },
      {
        "text": "Bog‘lovchi ankerlar har 2-3 qatorda o‘rnatildi",
        "required": true
      },
      {
        "text": "Shift oralig‘iga kompensatsion chok qoldirildi",
        "required": true
      }
    ],
    "related_topics": [
      "Devorlarni g‘isht/blokdan qurish",
      "Eshik o‘rinlarini tayyorlash",
      "Santexnika shaxtalarini tashkil qilish"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 29
  },
  {
    "category_id": 3,
    "category_code": "03",
    "category_slug": "03-qurilish-va-rejalashtirish",
    "category_title": "Qurilish va rejalashtirish ishlari",
    "category_icon": "🧱",
    "slug": "03-devorlarni-gisht-blokdan-qurish",
    "title": "Devorlarni g‘isht/blokdan qurish",
    "short_description": "Devorlarni g‘isht/blokdan qurish — xonalarni rejalashtirish bo‘yicha yangi to‘siqlar va arxitektura shakllarini mustahkam qad rostlashi.",
    "purpose": "Loyiha rejasidagi xonalarni aniq geometriya, tovush izolyatsiyasi va mebel o‘lchamlariga mos ravishda ajratish.",
    "when_to_do": "Demontaj yakunlanib, zamin tozalanib gruntovkalanib bo‘lingach, kommunikatsiyalar tortilishidan oldin.",
    "before_start": "Pol yuzasidagi to‘liq tozalik, lazerli tekislagich bilan o‘qlarni polga va shiftga chizib olish.",
    "step_by_step": [
      "Loyiha bo‘yicha devor o‘qlarini lazer bilan pol, devor va shiftga belgilash.",
      "Zamin bilan birinchi qator orasiga gidro/shumoizolyatsiya lentasini (dempfer) qo‘yish.",
      "G‘isht, gazoblok yoki GKL karkasni bosqichma-bosqich o‘rnatish.",
      "Har 2-3 qatorda asosiy devorlar bilan bog‘lovchi armatura/ankerni o‘rnatish.",
      "Eshik va nisha o‘rinlarini loyiha o‘lchamiga muvofiq mustahkamlangan peremichkalar bilan ochish."
    ],
    "rules": [
      "Devorlarning vertikalligi va 90° burchaklar (ayniqsa oshxona va sanuzelda) qat'iy nazorat qilinadi.",
      "Shift bilan yangi devor orasida 2-3 sm deformatsion tirqish qoldirilib, montaj ko‘pigi bilan to‘ldiriladi.",
      "Gipsokarton devorlarda oraliq profillar qadami 40 yoki 60 sm bo‘lishi shart."
    ],
    "important_notes": "Eshik o‘rni kengligi eshik polotnosidan 8-10 sm kengroq, balandligi esa toza poldan 206-208 sm bo‘lishi lozim.",
    "common_mistakes": [
      "Toza pol balandligini hisobga olmasdan eshik o‘rnini past qoldirish.",
      "Oshxona mebeli keladigan burchakni 90 gradus qilib terilmasligi.",
      "Asosiy devor bilan bog‘lovchi ankerlar qo‘yilmasligi oqibatida yoriqlar paydo bo‘lishi."
    ],
    "quality_control": "2 metrli qoida (pravilo) qo‘yilganda tirqish 2 mm dan oshmasligi, vertikaldan og‘ish 1 metrga 1.5 mm dan oshmasligi tekshiriladi.",
    "materials": [
      "Gazobeton bloklar / G‘isht",
      "Maxsus yelim (Kley)",
      "Armatura to‘ri / Ankerlar",
      "Montaj ko‘pigi",
      "Dempfer lenta"
    ],
    "tools": [
      "Lazerli 360° nivelir",
      "2 metrli qoida (Pravilo)",
      "Rezinli bolg‘a (Kiyanka)",
      "Tishli molga",
      "Miksyer va idish"
    ],
    "checklist": [
      {
        "text": "O‘qlar va 90 gradus burchaklar lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Eshik o‘lchamlari standartga muvofiq qoldirildi",
        "required": true
      },
      {
        "text": "Bog‘lovchi ankerlar har 2-3 qatorda o‘rnatildi",
        "required": true
      },
      {
        "text": "Shift oralig‘iga kompensatsion chok qoldirildi",
        "required": true
      }
    ],
    "related_topics": [
      "Devorlarni g‘isht/blokdan qurish",
      "Eshik o‘rinlarini tayyorlash",
      "Santexnika shaxtalarini tashkil qilish"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 30
  },
  {
    "category_id": 3,
    "category_code": "03",
    "category_slug": "03-qurilish-va-rejalashtirish",
    "category_title": "Qurilish va rejalashtirish ishlari",
    "category_icon": "🧱",
    "slug": "03-gipsokarton-konstruksiyalarini-ornatish",
    "title": "Gipsokarton konstruksiyalarini o‘rnatish",
    "short_description": "Gipsokarton konstruksiyalarini o‘rnatish — xonalarni rejalashtirish bo‘yicha yangi to‘siqlar va arxitektura shakllarini mustahkam qad rostlashi.",
    "purpose": "Loyiha rejasidagi xonalarni aniq geometriya, tovush izolyatsiyasi va mebel o‘lchamlariga mos ravishda ajratish.",
    "when_to_do": "Demontaj yakunlanib, zamin tozalanib gruntovkalanib bo‘lingach, kommunikatsiyalar tortilishidan oldin.",
    "before_start": "Pol yuzasidagi to‘liq tozalik, lazerli tekislagich bilan o‘qlarni polga va shiftga chizib olish.",
    "step_by_step": [
      "Loyiha bo‘yicha devor o‘qlarini lazer bilan pol, devor va shiftga belgilash.",
      "Zamin bilan birinchi qator orasiga gidro/shumoizolyatsiya lentasini (dempfer) qo‘yish.",
      "G‘isht, gazoblok yoki GKL karkasni bosqichma-bosqich o‘rnatish.",
      "Har 2-3 qatorda asosiy devorlar bilan bog‘lovchi armatura/ankerni o‘rnatish.",
      "Eshik va nisha o‘rinlarini loyiha o‘lchamiga muvofiq mustahkamlangan peremichkalar bilan ochish."
    ],
    "rules": [
      "Devorlarning vertikalligi va 90° burchaklar (ayniqsa oshxona va sanuzelda) qat'iy nazorat qilinadi.",
      "Shift bilan yangi devor orasida 2-3 sm deformatsion tirqish qoldirilib, montaj ko‘pigi bilan to‘ldiriladi.",
      "Gipsokarton devorlarda oraliq profillar qadami 40 yoki 60 sm bo‘lishi shart."
    ],
    "important_notes": "Eshik o‘rni kengligi eshik polotnosidan 8-10 sm kengroq, balandligi esa toza poldan 206-208 sm bo‘lishi lozim.",
    "common_mistakes": [
      "Toza pol balandligini hisobga olmasdan eshik o‘rnini past qoldirish.",
      "Oshxona mebeli keladigan burchakni 90 gradus qilib terilmasligi.",
      "Asosiy devor bilan bog‘lovchi ankerlar qo‘yilmasligi oqibatida yoriqlar paydo bo‘lishi."
    ],
    "quality_control": "2 metrli qoida (pravilo) qo‘yilganda tirqish 2 mm dan oshmasligi, vertikaldan og‘ish 1 metrga 1.5 mm dan oshmasligi tekshiriladi.",
    "materials": [
      "Gazobeton bloklar / G‘isht",
      "Maxsus yelim (Kley)",
      "Armatura to‘ri / Ankerlar",
      "Montaj ko‘pigi",
      "Dempfer lenta"
    ],
    "tools": [
      "Lazerli 360° nivelir",
      "2 metrli qoida (Pravilo)",
      "Rezinli bolg‘a (Kiyanka)",
      "Tishli molga",
      "Miksyer va idish"
    ],
    "checklist": [
      {
        "text": "O‘qlar va 90 gradus burchaklar lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Eshik o‘lchamlari standartga muvofiq qoldirildi",
        "required": true
      },
      {
        "text": "Bog‘lovchi ankerlar har 2-3 qatorda o‘rnatildi",
        "required": true
      },
      {
        "text": "Shift oralig‘iga kompensatsion chok qoldirildi",
        "required": true
      }
    ],
    "related_topics": [
      "Devorlarni g‘isht/blokdan qurish",
      "Eshik o‘rinlarini tayyorlash",
      "Santexnika shaxtalarini tashkil qilish"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 31
  },
  {
    "category_id": 3,
    "category_code": "03",
    "category_slug": "03-qurilish-va-rejalashtirish",
    "category_title": "Qurilish va rejalashtirish ishlari",
    "category_icon": "🧱",
    "slug": "03-eshik-orinlarini-tayyorlash",
    "title": "Eshik o‘rinlarini tayyorlash",
    "short_description": "Eshik o‘rinlarini tayyorlash — xonalarni rejalashtirish bo‘yicha yangi to‘siqlar va arxitektura shakllarini mustahkam qad rostlashi.",
    "purpose": "Loyiha rejasidagi xonalarni aniq geometriya, tovush izolyatsiyasi va mebel o‘lchamlariga mos ravishda ajratish.",
    "when_to_do": "Demontaj yakunlanib, zamin tozalanib gruntovkalanib bo‘lingach, kommunikatsiyalar tortilishidan oldin.",
    "before_start": "Pol yuzasidagi to‘liq tozalik, lazerli tekislagich bilan o‘qlarni polga va shiftga chizib olish.",
    "step_by_step": [
      "Loyiha bo‘yicha devor o‘qlarini lazer bilan pol, devor va shiftga belgilash.",
      "Zamin bilan birinchi qator orasiga gidro/shumoizolyatsiya lentasini (dempfer) qo‘yish.",
      "G‘isht, gazoblok yoki GKL karkasni bosqichma-bosqich o‘rnatish.",
      "Har 2-3 qatorda asosiy devorlar bilan bog‘lovchi armatura/ankerni o‘rnatish.",
      "Eshik va nisha o‘rinlarini loyiha o‘lchamiga muvofiq mustahkamlangan peremichkalar bilan ochish."
    ],
    "rules": [
      "Devorlarning vertikalligi va 90° burchaklar (ayniqsa oshxona va sanuzelda) qat'iy nazorat qilinadi.",
      "Shift bilan yangi devor orasida 2-3 sm deformatsion tirqish qoldirilib, montaj ko‘pigi bilan to‘ldiriladi.",
      "Gipsokarton devorlarda oraliq profillar qadami 40 yoki 60 sm bo‘lishi shart."
    ],
    "important_notes": "Eshik o‘rni kengligi eshik polotnosidan 8-10 sm kengroq, balandligi esa toza poldan 206-208 sm bo‘lishi lozim.",
    "common_mistakes": [
      "Toza pol balandligini hisobga olmasdan eshik o‘rnini past qoldirish.",
      "Oshxona mebeli keladigan burchakni 90 gradus qilib terilmasligi.",
      "Asosiy devor bilan bog‘lovchi ankerlar qo‘yilmasligi oqibatida yoriqlar paydo bo‘lishi."
    ],
    "quality_control": "2 metrli qoida (pravilo) qo‘yilganda tirqish 2 mm dan oshmasligi, vertikaldan og‘ish 1 metrga 1.5 mm dan oshmasligi tekshiriladi.",
    "materials": [
      "Gazobeton bloklar / G‘isht",
      "Maxsus yelim (Kley)",
      "Armatura to‘ri / Ankerlar",
      "Montaj ko‘pigi",
      "Dempfer lenta"
    ],
    "tools": [
      "Lazerli 360° nivelir",
      "2 metrli qoida (Pravilo)",
      "Rezinli bolg‘a (Kiyanka)",
      "Tishli molga",
      "Miksyer va idish"
    ],
    "checklist": [
      {
        "text": "O‘qlar va 90 gradus burchaklar lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Eshik o‘lchamlari standartga muvofiq qoldirildi",
        "required": true
      },
      {
        "text": "Bog‘lovchi ankerlar har 2-3 qatorda o‘rnatildi",
        "required": true
      },
      {
        "text": "Shift oralig‘iga kompensatsion chok qoldirildi",
        "required": true
      }
    ],
    "related_topics": [
      "Devorlarni g‘isht/blokdan qurish",
      "Eshik o‘rinlarini tayyorlash",
      "Santexnika shaxtalarini tashkil qilish"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 32
  },
  {
    "category_id": 3,
    "category_code": "03",
    "category_slug": "03-qurilish-va-rejalashtirish",
    "category_title": "Qurilish va rejalashtirish ishlari",
    "category_icon": "🧱",
    "slug": "03-arka-nisha-konstruktiv-elementlar",
    "title": "Arka/nisha/konstruktiv elementlar",
    "short_description": "Arka/nisha/konstruktiv elementlar — xonalarni rejalashtirish bo‘yicha yangi to‘siqlar va arxitektura shakllarini mustahkam qad rostlashi.",
    "purpose": "Loyiha rejasidagi xonalarni aniq geometriya, tovush izolyatsiyasi va mebel o‘lchamlariga mos ravishda ajratish.",
    "when_to_do": "Demontaj yakunlanib, zamin tozalanib gruntovkalanib bo‘lingach, kommunikatsiyalar tortilishidan oldin.",
    "before_start": "Pol yuzasidagi to‘liq tozalik, lazerli tekislagich bilan o‘qlarni polga va shiftga chizib olish.",
    "step_by_step": [
      "Loyiha bo‘yicha devor o‘qlarini lazer bilan pol, devor va shiftga belgilash.",
      "Zamin bilan birinchi qator orasiga gidro/shumoizolyatsiya lentasini (dempfer) qo‘yish.",
      "G‘isht, gazoblok yoki GKL karkasni bosqichma-bosqich o‘rnatish.",
      "Har 2-3 qatorda asosiy devorlar bilan bog‘lovchi armatura/ankerni o‘rnatish.",
      "Eshik va nisha o‘rinlarini loyiha o‘lchamiga muvofiq mustahkamlangan peremichkalar bilan ochish."
    ],
    "rules": [
      "Devorlarning vertikalligi va 90° burchaklar (ayniqsa oshxona va sanuzelda) qat'iy nazorat qilinadi.",
      "Shift bilan yangi devor orasida 2-3 sm deformatsion tirqish qoldirilib, montaj ko‘pigi bilan to‘ldiriladi.",
      "Gipsokarton devorlarda oraliq profillar qadami 40 yoki 60 sm bo‘lishi shart."
    ],
    "important_notes": "Eshik o‘rni kengligi eshik polotnosidan 8-10 sm kengroq, balandligi esa toza poldan 206-208 sm bo‘lishi lozim.",
    "common_mistakes": [
      "Toza pol balandligini hisobga olmasdan eshik o‘rnini past qoldirish.",
      "Oshxona mebeli keladigan burchakni 90 gradus qilib terilmasligi.",
      "Asosiy devor bilan bog‘lovchi ankerlar qo‘yilmasligi oqibatida yoriqlar paydo bo‘lishi."
    ],
    "quality_control": "2 metrli qoida (pravilo) qo‘yilganda tirqish 2 mm dan oshmasligi, vertikaldan og‘ish 1 metrga 1.5 mm dan oshmasligi tekshiriladi.",
    "materials": [
      "Gazobeton bloklar / G‘isht",
      "Maxsus yelim (Kley)",
      "Armatura to‘ri / Ankerlar",
      "Montaj ko‘pigi",
      "Dempfer lenta"
    ],
    "tools": [
      "Lazerli 360° nivelir",
      "2 metrli qoida (Pravilo)",
      "Rezinli bolg‘a (Kiyanka)",
      "Tishli molga",
      "Miksyer va idish"
    ],
    "checklist": [
      {
        "text": "O‘qlar va 90 gradus burchaklar lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Eshik o‘lchamlari standartga muvofiq qoldirildi",
        "required": true
      },
      {
        "text": "Bog‘lovchi ankerlar har 2-3 qatorda o‘rnatildi",
        "required": true
      },
      {
        "text": "Shift oralig‘iga kompensatsion chok qoldirildi",
        "required": true
      }
    ],
    "related_topics": [
      "Devorlarni g‘isht/blokdan qurish",
      "Eshik o‘rinlarini tayyorlash",
      "Santexnika shaxtalarini tashkil qilish"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 33
  },
  {
    "category_id": 3,
    "category_code": "03",
    "category_slug": "03-qurilish-va-rejalashtirish",
    "category_title": "Qurilish va rejalashtirish ishlari",
    "category_icon": "🧱",
    "slug": "03-santexnika-shaxtalarini-tashkil-qilish",
    "title": "Santexnika shaxtalarini tashkil qilish",
    "short_description": "Santexnika shaxtalarini tashkil qilish — xonalarni rejalashtirish bo‘yicha yangi to‘siqlar va arxitektura shakllarini mustahkam qad rostlashi.",
    "purpose": "Loyiha rejasidagi xonalarni aniq geometriya, tovush izolyatsiyasi va mebel o‘lchamlariga mos ravishda ajratish.",
    "when_to_do": "Demontaj yakunlanib, zamin tozalanib gruntovkalanib bo‘lingach, kommunikatsiyalar tortilishidan oldin.",
    "before_start": "Pol yuzasidagi to‘liq tozalik, lazerli tekislagich bilan o‘qlarni polga va shiftga chizib olish.",
    "step_by_step": [
      "Loyiha bo‘yicha devor o‘qlarini lazer bilan pol, devor va shiftga belgilash.",
      "Zamin bilan birinchi qator orasiga gidro/shumoizolyatsiya lentasini (dempfer) qo‘yish.",
      "G‘isht, gazoblok yoki GKL karkasni bosqichma-bosqich o‘rnatish.",
      "Har 2-3 qatorda asosiy devorlar bilan bog‘lovchi armatura/ankerni o‘rnatish.",
      "Eshik va nisha o‘rinlarini loyiha o‘lchamiga muvofiq mustahkamlangan peremichkalar bilan ochish."
    ],
    "rules": [
      "Devorlarning vertikalligi va 90° burchaklar (ayniqsa oshxona va sanuzelda) qat'iy nazorat qilinadi.",
      "Shift bilan yangi devor orasida 2-3 sm deformatsion tirqish qoldirilib, montaj ko‘pigi bilan to‘ldiriladi.",
      "Gipsokarton devorlarda oraliq profillar qadami 40 yoki 60 sm bo‘lishi shart."
    ],
    "important_notes": "Eshik o‘rni kengligi eshik polotnosidan 8-10 sm kengroq, balandligi esa toza poldan 206-208 sm bo‘lishi lozim.",
    "common_mistakes": [
      "Toza pol balandligini hisobga olmasdan eshik o‘rnini past qoldirish.",
      "Oshxona mebeli keladigan burchakni 90 gradus qilib terilmasligi.",
      "Asosiy devor bilan bog‘lovchi ankerlar qo‘yilmasligi oqibatida yoriqlar paydo bo‘lishi."
    ],
    "quality_control": "2 metrli qoida (pravilo) qo‘yilganda tirqish 2 mm dan oshmasligi, vertikaldan og‘ish 1 metrga 1.5 mm dan oshmasligi tekshiriladi.",
    "materials": [
      "Gazobeton bloklar / G‘isht",
      "Maxsus yelim (Kley)",
      "Armatura to‘ri / Ankerlar",
      "Montaj ko‘pigi",
      "Dempfer lenta"
    ],
    "tools": [
      "Lazerli 360° nivelir",
      "2 metrli qoida (Pravilo)",
      "Rezinli bolg‘a (Kiyanka)",
      "Tishli molga",
      "Miksyer va idish"
    ],
    "checklist": [
      {
        "text": "O‘qlar va 90 gradus burchaklar lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Eshik o‘lchamlari standartga muvofiq qoldirildi",
        "required": true
      },
      {
        "text": "Bog‘lovchi ankerlar har 2-3 qatorda o‘rnatildi",
        "required": true
      },
      {
        "text": "Shift oralig‘iga kompensatsion chok qoldirildi",
        "required": true
      }
    ],
    "related_topics": [
      "Devorlarni g‘isht/blokdan qurish",
      "Eshik o‘rinlarini tayyorlash",
      "Santexnika shaxtalarini tashkil qilish"
    ],
    "order_index": 6,
    "is_published": true,
    "id": 34
  },
  {
    "category_id": 3,
    "category_code": "03",
    "category_slug": "03-qurilish-va-rejalashtirish",
    "category_title": "Qurilish va rejalashtirish ishlari",
    "category_icon": "🧱",
    "slug": "03-izolyatsiya-zarur-bolgan-joylarni-tayyorlash",
    "title": "Izolyatsiya zarur bo‘lgan joylarni tayyorlash",
    "short_description": "Izolyatsiya zarur bo‘lgan joylarni tayyorlash — xonalarni rejalashtirish bo‘yicha yangi to‘siqlar va arxitektura shakllarini mustahkam qad rostlashi.",
    "purpose": "Loyiha rejasidagi xonalarni aniq geometriya, tovush izolyatsiyasi va mebel o‘lchamlariga mos ravishda ajratish.",
    "when_to_do": "Demontaj yakunlanib, zamin tozalanib gruntovkalanib bo‘lingach, kommunikatsiyalar tortilishidan oldin.",
    "before_start": "Pol yuzasidagi to‘liq tozalik, lazerli tekislagich bilan o‘qlarni polga va shiftga chizib olish.",
    "step_by_step": [
      "Loyiha bo‘yicha devor o‘qlarini lazer bilan pol, devor va shiftga belgilash.",
      "Zamin bilan birinchi qator orasiga gidro/shumoizolyatsiya lentasini (dempfer) qo‘yish.",
      "G‘isht, gazoblok yoki GKL karkasni bosqichma-bosqich o‘rnatish.",
      "Har 2-3 qatorda asosiy devorlar bilan bog‘lovchi armatura/ankerni o‘rnatish.",
      "Eshik va nisha o‘rinlarini loyiha o‘lchamiga muvofiq mustahkamlangan peremichkalar bilan ochish."
    ],
    "rules": [
      "Devorlarning vertikalligi va 90° burchaklar (ayniqsa oshxona va sanuzelda) qat'iy nazorat qilinadi.",
      "Shift bilan yangi devor orasida 2-3 sm deformatsion tirqish qoldirilib, montaj ko‘pigi bilan to‘ldiriladi.",
      "Gipsokarton devorlarda oraliq profillar qadami 40 yoki 60 sm bo‘lishi shart."
    ],
    "important_notes": "Eshik o‘rni kengligi eshik polotnosidan 8-10 sm kengroq, balandligi esa toza poldan 206-208 sm bo‘lishi lozim.",
    "common_mistakes": [
      "Toza pol balandligini hisobga olmasdan eshik o‘rnini past qoldirish.",
      "Oshxona mebeli keladigan burchakni 90 gradus qilib terilmasligi.",
      "Asosiy devor bilan bog‘lovchi ankerlar qo‘yilmasligi oqibatida yoriqlar paydo bo‘lishi."
    ],
    "quality_control": "2 metrli qoida (pravilo) qo‘yilganda tirqish 2 mm dan oshmasligi, vertikaldan og‘ish 1 metrga 1.5 mm dan oshmasligi tekshiriladi.",
    "materials": [
      "Gazobeton bloklar / G‘isht",
      "Maxsus yelim (Kley)",
      "Armatura to‘ri / Ankerlar",
      "Montaj ko‘pigi",
      "Dempfer lenta"
    ],
    "tools": [
      "Lazerli 360° nivelir",
      "2 metrli qoida (Pravilo)",
      "Rezinli bolg‘a (Kiyanka)",
      "Tishli molga",
      "Miksyer va idish"
    ],
    "checklist": [
      {
        "text": "O‘qlar va 90 gradus burchaklar lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Eshik o‘lchamlari standartga muvofiq qoldirildi",
        "required": true
      },
      {
        "text": "Bog‘lovchi ankerlar har 2-3 qatorda o‘rnatildi",
        "required": true
      },
      {
        "text": "Shift oralig‘iga kompensatsion chok qoldirildi",
        "required": true
      }
    ],
    "related_topics": [
      "Devorlarni g‘isht/blokdan qurish",
      "Eshik o‘rinlarini tayyorlash",
      "Santexnika shaxtalarini tashkil qilish"
    ],
    "order_index": 7,
    "is_published": true,
    "id": 35
  },
  {
    "category_id": 4,
    "category_code": "04",
    "category_slug": "04-elektr-montaj",
    "category_title": "Elektr montaj",
    "category_icon": "⚡",
    "slug": "04-elektr-nuqtalarini-belgilash",
    "title": "Elektr nuqtalarini belgilash",
    "short_description": "Elektr nuqtalarini belgilash — elektr xavfsizligi, ergonomik qulaylik va kelajakdagi maishiy texnikalarning uzluksiz ishlashini ta'minlovchi muhandislik tarmog‘i.",
    "purpose": "Xonadondagi barcha elektr yuklamalarini to‘g‘ri taqsimlash, zamonaviy avtomatika bilan himoyalash va yoritish ssenariylarini amalga oshirish.",
    "when_to_do": "Devorlar terilib, shtukaturka qilingandan so‘ng yoki qora devor paytida, pardozlash ishlaridan oldin.",
    "before_start": "Aniq mebel rejasiga bog‘langan elektr ishchi loyihasi, barcha texnika quvvatlari ro‘yxati.",
    "step_by_step": [
      "Devorlarga rozetka, kalit va chiroq koordinatalarini lazer yordamida chizish.",
      "Shtroborez yordamida faqat vertikal yo‘nalishda shtrobalar ochish.",
      "Gofra quvurida mis kabelni (VVG-ng-LS) tortish va qisqichlar bilan mahkamlash.",
      "Podrozetniklar uchun koronka bilan o‘rin ochish va gips/qorishma bilan qotirish.",
      "Taqsimlash qutilarida (yoki podrozetnik ichida) payvandlash yoki klemmalar bilan ulash.",
      "Elektr qalqonini (shchit) yig‘ish, UZO va difavtomatlarni o‘rnatish.",
      "Liniyalarni megommetr va multimetr bilan sinovdan o‘tkazish."
    ],
    "rules": [
      "Kabel yo‘nalishlari faqat vertikal va gorizontal bo‘lishi shart, diagonal yurgizish qat'iyan taqiqlanadi.",
      "Rozetkalar uchun kamida 3x2.5 mm² mis kabel, yoritish uchun 3x1.5 mm² kabel ishlatiladi.",
      "Nam xonalar (sanuzel, oshxona) uchun 10-30 mA sezgirlikdagi UZO/AVDT o‘rnatilishi shart."
    ],
    "important_notes": "Har bir quvvatli jihoz (konditsioner, duxovka, kir yuvish mashinasi, boyler) uchun qalqondan alohida to‘g‘ridan-to‘g‘ri kabel liniyasi tortiladi.",
    "common_mistakes": [
      "Kabelni gorizontal holda yuk ko‘taruvchi devor bo‘ylab chuqur shtroblash.",
      "Yoritish va rozetka liniyalarini bitta avtomatga ulab yuborish.",
      "Yerga ulash (Zazemleniye - PE) o‘tkazgichini ulamaslik yoki nolga qo‘shib yuborish."
    ],
    "quality_control": "Har bir liniyaning izolyatsiya qarshiligi tekshiriladi, faza/nol/yerlash ketma-ketligi tester bilan sinovdan o‘tkaziladi.",
    "materials": [
      "Mis kabel VVG-ng-LS (3x1.5, 3x2.5, 3x4, 3x6)",
      "Gofra truba (NG)",
      "Plastik podrozetniklar",
      "Taqsimlash qalqoni",
      "Avtomat o‘chirgichlar (B/C sinf)"
    ],
    "tools": [
      "Shtroborez changyutgich bilan",
      "Perforator va olmos koronka",
      "Kabel tozalovchi (Stripper)",
      "Multimetr / Indikator",
      "Lazer nivelir"
    ],
    "checklist": [
      {
        "text": "Kabel kesimi loyihaga mos (Rozetka 2.5, Chiroq 1.5)",
        "required": true
      },
      {
        "text": "Shtrobalar faqat vertikal va gorizontal o‘tkazildi",
        "required": true
      },
      {
        "text": "Podrozetniklar chuqurligi tekislandi va mustahkamlandi",
        "required": true
      },
      {
        "text": "Barcha liniyalar qisqa tutashuvga sinovdan o‘tkazildi",
        "required": true
      }
    ],
    "related_topics": [
      "Rozetkalar joylashuvini aniqlash",
      "Kalitlar joylashuvini aniqlash",
      "Elektr щitini tashkil qilish"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 36
  },
  {
    "category_id": 4,
    "category_code": "04",
    "category_slug": "04-elektr-montaj",
    "category_title": "Elektr montaj",
    "category_icon": "⚡",
    "slug": "04-rozetkalar-joylashuvini-aniqlash",
    "title": "Rozetkalar joylashuvini aniqlash",
    "short_description": "Rozetkalar joylashuvini aniqlash — elektr xavfsizligi, ergonomik qulaylik va kelajakdagi maishiy texnikalarning uzluksiz ishlashini ta'minlovchi muhandislik tarmog‘i.",
    "purpose": "Xonadondagi barcha elektr yuklamalarini to‘g‘ri taqsimlash, zamonaviy avtomatika bilan himoyalash va yoritish ssenariylarini amalga oshirish.",
    "when_to_do": "Devorlar terilib, shtukaturka qilingandan so‘ng yoki qora devor paytida, pardozlash ishlaridan oldin.",
    "before_start": "Aniq mebel rejasiga bog‘langan elektr ishchi loyihasi, barcha texnika quvvatlari ro‘yxati.",
    "step_by_step": [
      "Devorlarga rozetka, kalit va chiroq koordinatalarini lazer yordamida chizish.",
      "Shtroborez yordamida faqat vertikal yo‘nalishda shtrobalar ochish.",
      "Gofra quvurida mis kabelni (VVG-ng-LS) tortish va qisqichlar bilan mahkamlash.",
      "Podrozetniklar uchun koronka bilan o‘rin ochish va gips/qorishma bilan qotirish.",
      "Taqsimlash qutilarida (yoki podrozetnik ichida) payvandlash yoki klemmalar bilan ulash.",
      "Elektr qalqonini (shchit) yig‘ish, UZO va difavtomatlarni o‘rnatish.",
      "Liniyalarni megommetr va multimetr bilan sinovdan o‘tkazish."
    ],
    "rules": [
      "Kabel yo‘nalishlari faqat vertikal va gorizontal bo‘lishi shart, diagonal yurgizish qat'iyan taqiqlanadi.",
      "Rozetkalar uchun kamida 3x2.5 mm² mis kabel, yoritish uchun 3x1.5 mm² kabel ishlatiladi.",
      "Nam xonalar (sanuzel, oshxona) uchun 10-30 mA sezgirlikdagi UZO/AVDT o‘rnatilishi shart."
    ],
    "important_notes": "Har bir quvvatli jihoz (konditsioner, duxovka, kir yuvish mashinasi, boyler) uchun qalqondan alohida to‘g‘ridan-to‘g‘ri kabel liniyasi tortiladi.",
    "common_mistakes": [
      "Kabelni gorizontal holda yuk ko‘taruvchi devor bo‘ylab chuqur shtroblash.",
      "Yoritish va rozetka liniyalarini bitta avtomatga ulab yuborish.",
      "Yerga ulash (Zazemleniye - PE) o‘tkazgichini ulamaslik yoki nolga qo‘shib yuborish."
    ],
    "quality_control": "Har bir liniyaning izolyatsiya qarshiligi tekshiriladi, faza/nol/yerlash ketma-ketligi tester bilan sinovdan o‘tkaziladi.",
    "materials": [
      "Mis kabel VVG-ng-LS (3x1.5, 3x2.5, 3x4, 3x6)",
      "Gofra truba (NG)",
      "Plastik podrozetniklar",
      "Taqsimlash qalqoni",
      "Avtomat o‘chirgichlar (B/C sinf)"
    ],
    "tools": [
      "Shtroborez changyutgich bilan",
      "Perforator va olmos koronka",
      "Kabel tozalovchi (Stripper)",
      "Multimetr / Indikator",
      "Lazer nivelir"
    ],
    "checklist": [
      {
        "text": "Kabel kesimi loyihaga mos (Rozetka 2.5, Chiroq 1.5)",
        "required": true
      },
      {
        "text": "Shtrobalar faqat vertikal va gorizontal o‘tkazildi",
        "required": true
      },
      {
        "text": "Podrozetniklar chuqurligi tekislandi va mustahkamlandi",
        "required": true
      },
      {
        "text": "Barcha liniyalar qisqa tutashuvga sinovdan o‘tkazildi",
        "required": true
      }
    ],
    "related_topics": [
      "Rozetkalar joylashuvini aniqlash",
      "Kalitlar joylashuvini aniqlash",
      "Elektr щitini tashkil qilish"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 37
  },
  {
    "category_id": 4,
    "category_code": "04",
    "category_slug": "04-elektr-montaj",
    "category_title": "Elektr montaj",
    "category_icon": "⚡",
    "slug": "04-kalitlar-joylashuvini-aniqlash",
    "title": "Kalitlar joylashuvini aniqlash",
    "short_description": "Kalitlar joylashuvini aniqlash — elektr xavfsizligi, ergonomik qulaylik va kelajakdagi maishiy texnikalarning uzluksiz ishlashini ta'minlovchi muhandislik tarmog‘i.",
    "purpose": "Xonadondagi barcha elektr yuklamalarini to‘g‘ri taqsimlash, zamonaviy avtomatika bilan himoyalash va yoritish ssenariylarini amalga oshirish.",
    "when_to_do": "Devorlar terilib, shtukaturka qilingandan so‘ng yoki qora devor paytida, pardozlash ishlaridan oldin.",
    "before_start": "Aniq mebel rejasiga bog‘langan elektr ishchi loyihasi, barcha texnika quvvatlari ro‘yxati.",
    "step_by_step": [
      "Devorlarga rozetka, kalit va chiroq koordinatalarini lazer yordamida chizish.",
      "Shtroborez yordamida faqat vertikal yo‘nalishda shtrobalar ochish.",
      "Gofra quvurida mis kabelni (VVG-ng-LS) tortish va qisqichlar bilan mahkamlash.",
      "Podrozetniklar uchun koronka bilan o‘rin ochish va gips/qorishma bilan qotirish.",
      "Taqsimlash qutilarida (yoki podrozetnik ichida) payvandlash yoki klemmalar bilan ulash.",
      "Elektr qalqonini (shchit) yig‘ish, UZO va difavtomatlarni o‘rnatish.",
      "Liniyalarni megommetr va multimetr bilan sinovdan o‘tkazish."
    ],
    "rules": [
      "Kabel yo‘nalishlari faqat vertikal va gorizontal bo‘lishi shart, diagonal yurgizish qat'iyan taqiqlanadi.",
      "Rozetkalar uchun kamida 3x2.5 mm² mis kabel, yoritish uchun 3x1.5 mm² kabel ishlatiladi.",
      "Nam xonalar (sanuzel, oshxona) uchun 10-30 mA sezgirlikdagi UZO/AVDT o‘rnatilishi shart."
    ],
    "important_notes": "Har bir quvvatli jihoz (konditsioner, duxovka, kir yuvish mashinasi, boyler) uchun qalqondan alohida to‘g‘ridan-to‘g‘ri kabel liniyasi tortiladi.",
    "common_mistakes": [
      "Kabelni gorizontal holda yuk ko‘taruvchi devor bo‘ylab chuqur shtroblash.",
      "Yoritish va rozetka liniyalarini bitta avtomatga ulab yuborish.",
      "Yerga ulash (Zazemleniye - PE) o‘tkazgichini ulamaslik yoki nolga qo‘shib yuborish."
    ],
    "quality_control": "Har bir liniyaning izolyatsiya qarshiligi tekshiriladi, faza/nol/yerlash ketma-ketligi tester bilan sinovdan o‘tkaziladi.",
    "materials": [
      "Mis kabel VVG-ng-LS (3x1.5, 3x2.5, 3x4, 3x6)",
      "Gofra truba (NG)",
      "Plastik podrozetniklar",
      "Taqsimlash qalqoni",
      "Avtomat o‘chirgichlar (B/C sinf)"
    ],
    "tools": [
      "Shtroborez changyutgich bilan",
      "Perforator va olmos koronka",
      "Kabel tozalovchi (Stripper)",
      "Multimetr / Indikator",
      "Lazer nivelir"
    ],
    "checklist": [
      {
        "text": "Kabel kesimi loyihaga mos (Rozetka 2.5, Chiroq 1.5)",
        "required": true
      },
      {
        "text": "Shtrobalar faqat vertikal va gorizontal o‘tkazildi",
        "required": true
      },
      {
        "text": "Podrozetniklar chuqurligi tekislandi va mustahkamlandi",
        "required": true
      },
      {
        "text": "Barcha liniyalar qisqa tutashuvga sinovdan o‘tkazildi",
        "required": true
      }
    ],
    "related_topics": [
      "Rozetkalar joylashuvini aniqlash",
      "Kalitlar joylashuvini aniqlash",
      "Elektr щitini tashkil qilish"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 38
  },
  {
    "category_id": 4,
    "category_code": "04",
    "category_slug": "04-elektr-montaj",
    "category_title": "Elektr montaj",
    "category_icon": "⚡",
    "slug": "04-yoritish-nuqtalarini-aniqlash",
    "title": "Yoritish nuqtalarini aniqlash",
    "short_description": "Yoritish nuqtalarini aniqlash — elektr xavfsizligi, ergonomik qulaylik va kelajakdagi maishiy texnikalarning uzluksiz ishlashini ta'minlovchi muhandislik tarmog‘i.",
    "purpose": "Xonadondagi barcha elektr yuklamalarini to‘g‘ri taqsimlash, zamonaviy avtomatika bilan himoyalash va yoritish ssenariylarini amalga oshirish.",
    "when_to_do": "Devorlar terilib, shtukaturka qilingandan so‘ng yoki qora devor paytida, pardozlash ishlaridan oldin.",
    "before_start": "Aniq mebel rejasiga bog‘langan elektr ishchi loyihasi, barcha texnika quvvatlari ro‘yxati.",
    "step_by_step": [
      "Devorlarga rozetka, kalit va chiroq koordinatalarini lazer yordamida chizish.",
      "Shtroborez yordamida faqat vertikal yo‘nalishda shtrobalar ochish.",
      "Gofra quvurida mis kabelni (VVG-ng-LS) tortish va qisqichlar bilan mahkamlash.",
      "Podrozetniklar uchun koronka bilan o‘rin ochish va gips/qorishma bilan qotirish.",
      "Taqsimlash qutilarida (yoki podrozetnik ichida) payvandlash yoki klemmalar bilan ulash.",
      "Elektr qalqonini (shchit) yig‘ish, UZO va difavtomatlarni o‘rnatish.",
      "Liniyalarni megommetr va multimetr bilan sinovdan o‘tkazish."
    ],
    "rules": [
      "Kabel yo‘nalishlari faqat vertikal va gorizontal bo‘lishi shart, diagonal yurgizish qat'iyan taqiqlanadi.",
      "Rozetkalar uchun kamida 3x2.5 mm² mis kabel, yoritish uchun 3x1.5 mm² kabel ishlatiladi.",
      "Nam xonalar (sanuzel, oshxona) uchun 10-30 mA sezgirlikdagi UZO/AVDT o‘rnatilishi shart."
    ],
    "important_notes": "Har bir quvvatli jihoz (konditsioner, duxovka, kir yuvish mashinasi, boyler) uchun qalqondan alohida to‘g‘ridan-to‘g‘ri kabel liniyasi tortiladi.",
    "common_mistakes": [
      "Kabelni gorizontal holda yuk ko‘taruvchi devor bo‘ylab chuqur shtroblash.",
      "Yoritish va rozetka liniyalarini bitta avtomatga ulab yuborish.",
      "Yerga ulash (Zazemleniye - PE) o‘tkazgichini ulamaslik yoki nolga qo‘shib yuborish."
    ],
    "quality_control": "Har bir liniyaning izolyatsiya qarshiligi tekshiriladi, faza/nol/yerlash ketma-ketligi tester bilan sinovdan o‘tkaziladi.",
    "materials": [
      "Mis kabel VVG-ng-LS (3x1.5, 3x2.5, 3x4, 3x6)",
      "Gofra truba (NG)",
      "Plastik podrozetniklar",
      "Taqsimlash qalqoni",
      "Avtomat o‘chirgichlar (B/C sinf)"
    ],
    "tools": [
      "Shtroborez changyutgich bilan",
      "Perforator va olmos koronka",
      "Kabel tozalovchi (Stripper)",
      "Multimetr / Indikator",
      "Lazer nivelir"
    ],
    "checklist": [
      {
        "text": "Kabel kesimi loyihaga mos (Rozetka 2.5, Chiroq 1.5)",
        "required": true
      },
      {
        "text": "Shtrobalar faqat vertikal va gorizontal o‘tkazildi",
        "required": true
      },
      {
        "text": "Podrozetniklar chuqurligi tekislandi va mustahkamlandi",
        "required": true
      },
      {
        "text": "Barcha liniyalar qisqa tutashuvga sinovdan o‘tkazildi",
        "required": true
      }
    ],
    "related_topics": [
      "Rozetkalar joylashuvini aniqlash",
      "Kalitlar joylashuvini aniqlash",
      "Elektr щitini tashkil qilish"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 39
  },
  {
    "category_id": 4,
    "category_code": "04",
    "category_slug": "04-elektr-montaj",
    "category_title": "Elektr montaj",
    "category_icon": "⚡",
    "slug": "04-tv-internet-nuqtalari",
    "title": "TV/internet nuqtalari",
    "short_description": "TV/internet nuqtalari — elektr xavfsizligi, ergonomik qulaylik va kelajakdagi maishiy texnikalarning uzluksiz ishlashini ta'minlovchi muhandislik tarmog‘i.",
    "purpose": "Xonadondagi barcha elektr yuklamalarini to‘g‘ri taqsimlash, zamonaviy avtomatika bilan himoyalash va yoritish ssenariylarini amalga oshirish.",
    "when_to_do": "Devorlar terilib, shtukaturka qilingandan so‘ng yoki qora devor paytida, pardozlash ishlaridan oldin.",
    "before_start": "Aniq mebel rejasiga bog‘langan elektr ishchi loyihasi, barcha texnika quvvatlari ro‘yxati.",
    "step_by_step": [
      "Devorlarga rozetka, kalit va chiroq koordinatalarini lazer yordamida chizish.",
      "Shtroborez yordamida faqat vertikal yo‘nalishda shtrobalar ochish.",
      "Gofra quvurida mis kabelni (VVG-ng-LS) tortish va qisqichlar bilan mahkamlash.",
      "Podrozetniklar uchun koronka bilan o‘rin ochish va gips/qorishma bilan qotirish.",
      "Taqsimlash qutilarida (yoki podrozetnik ichida) payvandlash yoki klemmalar bilan ulash.",
      "Elektr qalqonini (shchit) yig‘ish, UZO va difavtomatlarni o‘rnatish.",
      "Liniyalarni megommetr va multimetr bilan sinovdan o‘tkazish."
    ],
    "rules": [
      "Kabel yo‘nalishlari faqat vertikal va gorizontal bo‘lishi shart, diagonal yurgizish qat'iyan taqiqlanadi.",
      "Rozetkalar uchun kamida 3x2.5 mm² mis kabel, yoritish uchun 3x1.5 mm² kabel ishlatiladi.",
      "Nam xonalar (sanuzel, oshxona) uchun 10-30 mA sezgirlikdagi UZO/AVDT o‘rnatilishi shart."
    ],
    "important_notes": "Har bir quvvatli jihoz (konditsioner, duxovka, kir yuvish mashinasi, boyler) uchun qalqondan alohida to‘g‘ridan-to‘g‘ri kabel liniyasi tortiladi.",
    "common_mistakes": [
      "Kabelni gorizontal holda yuk ko‘taruvchi devor bo‘ylab chuqur shtroblash.",
      "Yoritish va rozetka liniyalarini bitta avtomatga ulab yuborish.",
      "Yerga ulash (Zazemleniye - PE) o‘tkazgichini ulamaslik yoki nolga qo‘shib yuborish."
    ],
    "quality_control": "Har bir liniyaning izolyatsiya qarshiligi tekshiriladi, faza/nol/yerlash ketma-ketligi tester bilan sinovdan o‘tkaziladi.",
    "materials": [
      "Mis kabel VVG-ng-LS (3x1.5, 3x2.5, 3x4, 3x6)",
      "Gofra truba (NG)",
      "Plastik podrozetniklar",
      "Taqsimlash qalqoni",
      "Avtomat o‘chirgichlar (B/C sinf)"
    ],
    "tools": [
      "Shtroborez changyutgich bilan",
      "Perforator va olmos koronka",
      "Kabel tozalovchi (Stripper)",
      "Multimetr / Indikator",
      "Lazer nivelir"
    ],
    "checklist": [
      {
        "text": "Kabel kesimi loyihaga mos (Rozetka 2.5, Chiroq 1.5)",
        "required": true
      },
      {
        "text": "Shtrobalar faqat vertikal va gorizontal o‘tkazildi",
        "required": true
      },
      {
        "text": "Podrozetniklar chuqurligi tekislandi va mustahkamlandi",
        "required": true
      },
      {
        "text": "Barcha liniyalar qisqa tutashuvga sinovdan o‘tkazildi",
        "required": true
      }
    ],
    "related_topics": [
      "Rozetkalar joylashuvini aniqlash",
      "Kalitlar joylashuvini aniqlash",
      "Elektr щitini tashkil qilish"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 40
  },
  {
    "category_id": 4,
    "category_code": "04",
    "category_slug": "04-elektr-montaj",
    "category_title": "Elektr montaj",
    "category_icon": "⚡",
    "slug": "04-konditsioner-liniyalari",
    "title": "Konditsioner liniyalari",
    "short_description": "Konditsioner liniyalari — elektr xavfsizligi, ergonomik qulaylik va kelajakdagi maishiy texnikalarning uzluksiz ishlashini ta'minlovchi muhandislik tarmog‘i.",
    "purpose": "Xonadondagi barcha elektr yuklamalarini to‘g‘ri taqsimlash, zamonaviy avtomatika bilan himoyalash va yoritish ssenariylarini amalga oshirish.",
    "when_to_do": "Devorlar terilib, shtukaturka qilingandan so‘ng yoki qora devor paytida, pardozlash ishlaridan oldin.",
    "before_start": "Aniq mebel rejasiga bog‘langan elektr ishchi loyihasi, barcha texnika quvvatlari ro‘yxati.",
    "step_by_step": [
      "Devorlarga rozetka, kalit va chiroq koordinatalarini lazer yordamida chizish.",
      "Shtroborez yordamida faqat vertikal yo‘nalishda shtrobalar ochish.",
      "Gofra quvurida mis kabelni (VVG-ng-LS) tortish va qisqichlar bilan mahkamlash.",
      "Podrozetniklar uchun koronka bilan o‘rin ochish va gips/qorishma bilan qotirish.",
      "Taqsimlash qutilarida (yoki podrozetnik ichida) payvandlash yoki klemmalar bilan ulash.",
      "Elektr qalqonini (shchit) yig‘ish, UZO va difavtomatlarni o‘rnatish.",
      "Liniyalarni megommetr va multimetr bilan sinovdan o‘tkazish."
    ],
    "rules": [
      "Kabel yo‘nalishlari faqat vertikal va gorizontal bo‘lishi shart, diagonal yurgizish qat'iyan taqiqlanadi.",
      "Rozetkalar uchun kamida 3x2.5 mm² mis kabel, yoritish uchun 3x1.5 mm² kabel ishlatiladi.",
      "Nam xonalar (sanuzel, oshxona) uchun 10-30 mA sezgirlikdagi UZO/AVDT o‘rnatilishi shart."
    ],
    "important_notes": "Har bir quvvatli jihoz (konditsioner, duxovka, kir yuvish mashinasi, boyler) uchun qalqondan alohida to‘g‘ridan-to‘g‘ri kabel liniyasi tortiladi.",
    "common_mistakes": [
      "Kabelni gorizontal holda yuk ko‘taruvchi devor bo‘ylab chuqur shtroblash.",
      "Yoritish va rozetka liniyalarini bitta avtomatga ulab yuborish.",
      "Yerga ulash (Zazemleniye - PE) o‘tkazgichini ulamaslik yoki nolga qo‘shib yuborish."
    ],
    "quality_control": "Har bir liniyaning izolyatsiya qarshiligi tekshiriladi, faza/nol/yerlash ketma-ketligi tester bilan sinovdan o‘tkaziladi.",
    "materials": [
      "Mis kabel VVG-ng-LS (3x1.5, 3x2.5, 3x4, 3x6)",
      "Gofra truba (NG)",
      "Plastik podrozetniklar",
      "Taqsimlash qalqoni",
      "Avtomat o‘chirgichlar (B/C sinf)"
    ],
    "tools": [
      "Shtroborez changyutgich bilan",
      "Perforator va olmos koronka",
      "Kabel tozalovchi (Stripper)",
      "Multimetr / Indikator",
      "Lazer nivelir"
    ],
    "checklist": [
      {
        "text": "Kabel kesimi loyihaga mos (Rozetka 2.5, Chiroq 1.5)",
        "required": true
      },
      {
        "text": "Shtrobalar faqat vertikal va gorizontal o‘tkazildi",
        "required": true
      },
      {
        "text": "Podrozetniklar chuqurligi tekislandi va mustahkamlandi",
        "required": true
      },
      {
        "text": "Barcha liniyalar qisqa tutashuvga sinovdan o‘tkazildi",
        "required": true
      }
    ],
    "related_topics": [
      "Rozetkalar joylashuvini aniqlash",
      "Kalitlar joylashuvini aniqlash",
      "Elektr щitini tashkil qilish"
    ],
    "order_index": 6,
    "is_published": true,
    "id": 41
  },
  {
    "category_id": 4,
    "category_code": "04",
    "category_slug": "04-elektr-montaj",
    "category_title": "Elektr montaj",
    "category_icon": "⚡",
    "slug": "04-oshxona-texnikasi-liniyalari",
    "title": "Oshxona texnikasi liniyalari",
    "short_description": "Oshxona texnikasi liniyalari — elektr xavfsizligi, ergonomik qulaylik va kelajakdagi maishiy texnikalarning uzluksiz ishlashini ta'minlovchi muhandislik tarmog‘i.",
    "purpose": "Xonadondagi barcha elektr yuklamalarini to‘g‘ri taqsimlash, zamonaviy avtomatika bilan himoyalash va yoritish ssenariylarini amalga oshirish.",
    "when_to_do": "Devorlar terilib, shtukaturka qilingandan so‘ng yoki qora devor paytida, pardozlash ishlaridan oldin.",
    "before_start": "Aniq mebel rejasiga bog‘langan elektr ishchi loyihasi, barcha texnika quvvatlari ro‘yxati.",
    "step_by_step": [
      "Devorlarga rozetka, kalit va chiroq koordinatalarini lazer yordamida chizish.",
      "Shtroborez yordamida faqat vertikal yo‘nalishda shtrobalar ochish.",
      "Gofra quvurida mis kabelni (VVG-ng-LS) tortish va qisqichlar bilan mahkamlash.",
      "Podrozetniklar uchun koronka bilan o‘rin ochish va gips/qorishma bilan qotirish.",
      "Taqsimlash qutilarida (yoki podrozetnik ichida) payvandlash yoki klemmalar bilan ulash.",
      "Elektr qalqonini (shchit) yig‘ish, UZO va difavtomatlarni o‘rnatish.",
      "Liniyalarni megommetr va multimetr bilan sinovdan o‘tkazish."
    ],
    "rules": [
      "Kabel yo‘nalishlari faqat vertikal va gorizontal bo‘lishi shart, diagonal yurgizish qat'iyan taqiqlanadi.",
      "Rozetkalar uchun kamida 3x2.5 mm² mis kabel, yoritish uchun 3x1.5 mm² kabel ishlatiladi.",
      "Nam xonalar (sanuzel, oshxona) uchun 10-30 mA sezgirlikdagi UZO/AVDT o‘rnatilishi shart."
    ],
    "important_notes": "Har bir quvvatli jihoz (konditsioner, duxovka, kir yuvish mashinasi, boyler) uchun qalqondan alohida to‘g‘ridan-to‘g‘ri kabel liniyasi tortiladi.",
    "common_mistakes": [
      "Kabelni gorizontal holda yuk ko‘taruvchi devor bo‘ylab chuqur shtroblash.",
      "Yoritish va rozetka liniyalarini bitta avtomatga ulab yuborish.",
      "Yerga ulash (Zazemleniye - PE) o‘tkazgichini ulamaslik yoki nolga qo‘shib yuborish."
    ],
    "quality_control": "Har bir liniyaning izolyatsiya qarshiligi tekshiriladi, faza/nol/yerlash ketma-ketligi tester bilan sinovdan o‘tkaziladi.",
    "materials": [
      "Mis kabel VVG-ng-LS (3x1.5, 3x2.5, 3x4, 3x6)",
      "Gofra truba (NG)",
      "Plastik podrozetniklar",
      "Taqsimlash qalqoni",
      "Avtomat o‘chirgichlar (B/C sinf)"
    ],
    "tools": [
      "Shtroborez changyutgich bilan",
      "Perforator va olmos koronka",
      "Kabel tozalovchi (Stripper)",
      "Multimetr / Indikator",
      "Lazer nivelir"
    ],
    "checklist": [
      {
        "text": "Kabel kesimi loyihaga mos (Rozetka 2.5, Chiroq 1.5)",
        "required": true
      },
      {
        "text": "Shtrobalar faqat vertikal va gorizontal o‘tkazildi",
        "required": true
      },
      {
        "text": "Podrozetniklar chuqurligi tekislandi va mustahkamlandi",
        "required": true
      },
      {
        "text": "Barcha liniyalar qisqa tutashuvga sinovdan o‘tkazildi",
        "required": true
      }
    ],
    "related_topics": [
      "Rozetkalar joylashuvini aniqlash",
      "Kalitlar joylashuvini aniqlash",
      "Elektr щitini tashkil qilish"
    ],
    "order_index": 7,
    "is_published": true,
    "id": 42
  },
  {
    "category_id": 4,
    "category_code": "04",
    "category_slug": "04-elektr-montaj",
    "category_title": "Elektr montaj",
    "category_icon": "⚡",
    "slug": "04-kir-yuvish-mashinasi-liniyasi",
    "title": "Kir yuvish mashinasi liniyasi",
    "short_description": "Kir yuvish mashinasi liniyasi — elektr xavfsizligi, ergonomik qulaylik va kelajakdagi maishiy texnikalarning uzluksiz ishlashini ta'minlovchi muhandislik tarmog‘i.",
    "purpose": "Xonadondagi barcha elektr yuklamalarini to‘g‘ri taqsimlash, zamonaviy avtomatika bilan himoyalash va yoritish ssenariylarini amalga oshirish.",
    "when_to_do": "Devorlar terilib, shtukaturka qilingandan so‘ng yoki qora devor paytida, pardozlash ishlaridan oldin.",
    "before_start": "Aniq mebel rejasiga bog‘langan elektr ishchi loyihasi, barcha texnika quvvatlari ro‘yxati.",
    "step_by_step": [
      "Devorlarga rozetka, kalit va chiroq koordinatalarini lazer yordamida chizish.",
      "Shtroborez yordamida faqat vertikal yo‘nalishda shtrobalar ochish.",
      "Gofra quvurida mis kabelni (VVG-ng-LS) tortish va qisqichlar bilan mahkamlash.",
      "Podrozetniklar uchun koronka bilan o‘rin ochish va gips/qorishma bilan qotirish.",
      "Taqsimlash qutilarida (yoki podrozetnik ichida) payvandlash yoki klemmalar bilan ulash.",
      "Elektr qalqonini (shchit) yig‘ish, UZO va difavtomatlarni o‘rnatish.",
      "Liniyalarni megommetr va multimetr bilan sinovdan o‘tkazish."
    ],
    "rules": [
      "Kabel yo‘nalishlari faqat vertikal va gorizontal bo‘lishi shart, diagonal yurgizish qat'iyan taqiqlanadi.",
      "Rozetkalar uchun kamida 3x2.5 mm² mis kabel, yoritish uchun 3x1.5 mm² kabel ishlatiladi.",
      "Nam xonalar (sanuzel, oshxona) uchun 10-30 mA sezgirlikdagi UZO/AVDT o‘rnatilishi shart."
    ],
    "important_notes": "Har bir quvvatli jihoz (konditsioner, duxovka, kir yuvish mashinasi, boyler) uchun qalqondan alohida to‘g‘ridan-to‘g‘ri kabel liniyasi tortiladi.",
    "common_mistakes": [
      "Kabelni gorizontal holda yuk ko‘taruvchi devor bo‘ylab chuqur shtroblash.",
      "Yoritish va rozetka liniyalarini bitta avtomatga ulab yuborish.",
      "Yerga ulash (Zazemleniye - PE) o‘tkazgichini ulamaslik yoki nolga qo‘shib yuborish."
    ],
    "quality_control": "Har bir liniyaning izolyatsiya qarshiligi tekshiriladi, faza/nol/yerlash ketma-ketligi tester bilan sinovdan o‘tkaziladi.",
    "materials": [
      "Mis kabel VVG-ng-LS (3x1.5, 3x2.5, 3x4, 3x6)",
      "Gofra truba (NG)",
      "Plastik podrozetniklar",
      "Taqsimlash qalqoni",
      "Avtomat o‘chirgichlar (B/C sinf)"
    ],
    "tools": [
      "Shtroborez changyutgich bilan",
      "Perforator va olmos koronka",
      "Kabel tozalovchi (Stripper)",
      "Multimetr / Indikator",
      "Lazer nivelir"
    ],
    "checklist": [
      {
        "text": "Kabel kesimi loyihaga mos (Rozetka 2.5, Chiroq 1.5)",
        "required": true
      },
      {
        "text": "Shtrobalar faqat vertikal va gorizontal o‘tkazildi",
        "required": true
      },
      {
        "text": "Podrozetniklar chuqurligi tekislandi va mustahkamlandi",
        "required": true
      },
      {
        "text": "Barcha liniyalar qisqa tutashuvga sinovdan o‘tkazildi",
        "required": true
      }
    ],
    "related_topics": [
      "Rozetkalar joylashuvini aniqlash",
      "Kalitlar joylashuvini aniqlash",
      "Elektr щitini tashkil qilish"
    ],
    "order_index": 8,
    "is_published": true,
    "id": 43
  },
  {
    "category_id": 4,
    "category_code": "04",
    "category_slug": "04-elektr-montaj",
    "category_title": "Elektr montaj",
    "category_icon": "⚡",
    "slug": "04-elektr-pech-liniyasi",
    "title": "Elektr pech liniyasi",
    "short_description": "Elektr pech liniyasi — elektr xavfsizligi, ergonomik qulaylik va kelajakdagi maishiy texnikalarning uzluksiz ishlashini ta'minlovchi muhandislik tarmog‘i.",
    "purpose": "Xonadondagi barcha elektr yuklamalarini to‘g‘ri taqsimlash, zamonaviy avtomatika bilan himoyalash va yoritish ssenariylarini amalga oshirish.",
    "when_to_do": "Devorlar terilib, shtukaturka qilingandan so‘ng yoki qora devor paytida, pardozlash ishlaridan oldin.",
    "before_start": "Aniq mebel rejasiga bog‘langan elektr ishchi loyihasi, barcha texnika quvvatlari ro‘yxati.",
    "step_by_step": [
      "Devorlarga rozetka, kalit va chiroq koordinatalarini lazer yordamida chizish.",
      "Shtroborez yordamida faqat vertikal yo‘nalishda shtrobalar ochish.",
      "Gofra quvurida mis kabelni (VVG-ng-LS) tortish va qisqichlar bilan mahkamlash.",
      "Podrozetniklar uchun koronka bilan o‘rin ochish va gips/qorishma bilan qotirish.",
      "Taqsimlash qutilarida (yoki podrozetnik ichida) payvandlash yoki klemmalar bilan ulash.",
      "Elektr qalqonini (shchit) yig‘ish, UZO va difavtomatlarni o‘rnatish.",
      "Liniyalarni megommetr va multimetr bilan sinovdan o‘tkazish."
    ],
    "rules": [
      "Kabel yo‘nalishlari faqat vertikal va gorizontal bo‘lishi shart, diagonal yurgizish qat'iyan taqiqlanadi.",
      "Rozetkalar uchun kamida 3x2.5 mm² mis kabel, yoritish uchun 3x1.5 mm² kabel ishlatiladi.",
      "Nam xonalar (sanuzel, oshxona) uchun 10-30 mA sezgirlikdagi UZO/AVDT o‘rnatilishi shart."
    ],
    "important_notes": "Har bir quvvatli jihoz (konditsioner, duxovka, kir yuvish mashinasi, boyler) uchun qalqondan alohida to‘g‘ridan-to‘g‘ri kabel liniyasi tortiladi.",
    "common_mistakes": [
      "Kabelni gorizontal holda yuk ko‘taruvchi devor bo‘ylab chuqur shtroblash.",
      "Yoritish va rozetka liniyalarini bitta avtomatga ulab yuborish.",
      "Yerga ulash (Zazemleniye - PE) o‘tkazgichini ulamaslik yoki nolga qo‘shib yuborish."
    ],
    "quality_control": "Har bir liniyaning izolyatsiya qarshiligi tekshiriladi, faza/nol/yerlash ketma-ketligi tester bilan sinovdan o‘tkaziladi.",
    "materials": [
      "Mis kabel VVG-ng-LS (3x1.5, 3x2.5, 3x4, 3x6)",
      "Gofra truba (NG)",
      "Plastik podrozetniklar",
      "Taqsimlash qalqoni",
      "Avtomat o‘chirgichlar (B/C sinf)"
    ],
    "tools": [
      "Shtroborez changyutgich bilan",
      "Perforator va olmos koronka",
      "Kabel tozalovchi (Stripper)",
      "Multimetr / Indikator",
      "Lazer nivelir"
    ],
    "checklist": [
      {
        "text": "Kabel kesimi loyihaga mos (Rozetka 2.5, Chiroq 1.5)",
        "required": true
      },
      {
        "text": "Shtrobalar faqat vertikal va gorizontal o‘tkazildi",
        "required": true
      },
      {
        "text": "Podrozetniklar chuqurligi tekislandi va mustahkamlandi",
        "required": true
      },
      {
        "text": "Barcha liniyalar qisqa tutashuvga sinovdan o‘tkazildi",
        "required": true
      }
    ],
    "related_topics": [
      "Rozetkalar joylashuvini aniqlash",
      "Kalitlar joylashuvini aniqlash",
      "Elektr щitini tashkil qilish"
    ],
    "order_index": 9,
    "is_published": true,
    "id": 44
  },
  {
    "category_id": 4,
    "category_code": "04",
    "category_slug": "04-elektr-montaj",
    "category_title": "Elektr montaj",
    "category_icon": "⚡",
    "slug": "04-suv-isitgich-liniyasi",
    "title": "Suv isitgich liniyasi",
    "short_description": "Suv isitgich liniyasi — elektr xavfsizligi, ergonomik qulaylik va kelajakdagi maishiy texnikalarning uzluksiz ishlashini ta'minlovchi muhandislik tarmog‘i.",
    "purpose": "Xonadondagi barcha elektr yuklamalarini to‘g‘ri taqsimlash, zamonaviy avtomatika bilan himoyalash va yoritish ssenariylarini amalga oshirish.",
    "when_to_do": "Devorlar terilib, shtukaturka qilingandan so‘ng yoki qora devor paytida, pardozlash ishlaridan oldin.",
    "before_start": "Aniq mebel rejasiga bog‘langan elektr ishchi loyihasi, barcha texnika quvvatlari ro‘yxati.",
    "step_by_step": [
      "Devorlarga rozetka, kalit va chiroq koordinatalarini lazer yordamida chizish.",
      "Shtroborez yordamida faqat vertikal yo‘nalishda shtrobalar ochish.",
      "Gofra quvurida mis kabelni (VVG-ng-LS) tortish va qisqichlar bilan mahkamlash.",
      "Podrozetniklar uchun koronka bilan o‘rin ochish va gips/qorishma bilan qotirish.",
      "Taqsimlash qutilarida (yoki podrozetnik ichida) payvandlash yoki klemmalar bilan ulash.",
      "Elektr qalqonini (shchit) yig‘ish, UZO va difavtomatlarni o‘rnatish.",
      "Liniyalarni megommetr va multimetr bilan sinovdan o‘tkazish."
    ],
    "rules": [
      "Kabel yo‘nalishlari faqat vertikal va gorizontal bo‘lishi shart, diagonal yurgizish qat'iyan taqiqlanadi.",
      "Rozetkalar uchun kamida 3x2.5 mm² mis kabel, yoritish uchun 3x1.5 mm² kabel ishlatiladi.",
      "Nam xonalar (sanuzel, oshxona) uchun 10-30 mA sezgirlikdagi UZO/AVDT o‘rnatilishi shart."
    ],
    "important_notes": "Har bir quvvatli jihoz (konditsioner, duxovka, kir yuvish mashinasi, boyler) uchun qalqondan alohida to‘g‘ridan-to‘g‘ri kabel liniyasi tortiladi.",
    "common_mistakes": [
      "Kabelni gorizontal holda yuk ko‘taruvchi devor bo‘ylab chuqur shtroblash.",
      "Yoritish va rozetka liniyalarini bitta avtomatga ulab yuborish.",
      "Yerga ulash (Zazemleniye - PE) o‘tkazgichini ulamaslik yoki nolga qo‘shib yuborish."
    ],
    "quality_control": "Har bir liniyaning izolyatsiya qarshiligi tekshiriladi, faza/nol/yerlash ketma-ketligi tester bilan sinovdan o‘tkaziladi.",
    "materials": [
      "Mis kabel VVG-ng-LS (3x1.5, 3x2.5, 3x4, 3x6)",
      "Gofra truba (NG)",
      "Plastik podrozetniklar",
      "Taqsimlash qalqoni",
      "Avtomat o‘chirgichlar (B/C sinf)"
    ],
    "tools": [
      "Shtroborez changyutgich bilan",
      "Perforator va olmos koronka",
      "Kabel tozalovchi (Stripper)",
      "Multimetr / Indikator",
      "Lazer nivelir"
    ],
    "checklist": [
      {
        "text": "Kabel kesimi loyihaga mos (Rozetka 2.5, Chiroq 1.5)",
        "required": true
      },
      {
        "text": "Shtrobalar faqat vertikal va gorizontal o‘tkazildi",
        "required": true
      },
      {
        "text": "Podrozetniklar chuqurligi tekislandi va mustahkamlandi",
        "required": true
      },
      {
        "text": "Barcha liniyalar qisqa tutashuvga sinovdan o‘tkazildi",
        "required": true
      }
    ],
    "related_topics": [
      "Rozetkalar joylashuvini aniqlash",
      "Kalitlar joylashuvini aniqlash",
      "Elektr щitini tashkil qilish"
    ],
    "order_index": 10,
    "is_published": true,
    "id": 45
  },
  {
    "category_id": 4,
    "category_code": "04",
    "category_slug": "04-elektr-montaj",
    "category_title": "Elektr montaj",
    "category_icon": "⚡",
    "slug": "04-elektr-щitini-tashkil-qilish",
    "title": "Elektr щitini tashkil qilish",
    "short_description": "Elektr щitini tashkil qilish — elektr xavfsizligi, ergonomik qulaylik va kelajakdagi maishiy texnikalarning uzluksiz ishlashini ta'minlovchi muhandislik tarmog‘i.",
    "purpose": "Xonadondagi barcha elektr yuklamalarini to‘g‘ri taqsimlash, zamonaviy avtomatika bilan himoyalash va yoritish ssenariylarini amalga oshirish.",
    "when_to_do": "Devorlar terilib, shtukaturka qilingandan so‘ng yoki qora devor paytida, pardozlash ishlaridan oldin.",
    "before_start": "Aniq mebel rejasiga bog‘langan elektr ishchi loyihasi, barcha texnika quvvatlari ro‘yxati.",
    "step_by_step": [
      "Devorlarga rozetka, kalit va chiroq koordinatalarini lazer yordamida chizish.",
      "Shtroborez yordamida faqat vertikal yo‘nalishda shtrobalar ochish.",
      "Gofra quvurida mis kabelni (VVG-ng-LS) tortish va qisqichlar bilan mahkamlash.",
      "Podrozetniklar uchun koronka bilan o‘rin ochish va gips/qorishma bilan qotirish.",
      "Taqsimlash qutilarida (yoki podrozetnik ichida) payvandlash yoki klemmalar bilan ulash.",
      "Elektr qalqonini (shchit) yig‘ish, UZO va difavtomatlarni o‘rnatish.",
      "Liniyalarni megommetr va multimetr bilan sinovdan o‘tkazish."
    ],
    "rules": [
      "Kabel yo‘nalishlari faqat vertikal va gorizontal bo‘lishi shart, diagonal yurgizish qat'iyan taqiqlanadi.",
      "Rozetkalar uchun kamida 3x2.5 mm² mis kabel, yoritish uchun 3x1.5 mm² kabel ishlatiladi.",
      "Nam xonalar (sanuzel, oshxona) uchun 10-30 mA sezgirlikdagi UZO/AVDT o‘rnatilishi shart."
    ],
    "important_notes": "Har bir quvvatli jihoz (konditsioner, duxovka, kir yuvish mashinasi, boyler) uchun qalqondan alohida to‘g‘ridan-to‘g‘ri kabel liniyasi tortiladi.",
    "common_mistakes": [
      "Kabelni gorizontal holda yuk ko‘taruvchi devor bo‘ylab chuqur shtroblash.",
      "Yoritish va rozetka liniyalarini bitta avtomatga ulab yuborish.",
      "Yerga ulash (Zazemleniye - PE) o‘tkazgichini ulamaslik yoki nolga qo‘shib yuborish."
    ],
    "quality_control": "Har bir liniyaning izolyatsiya qarshiligi tekshiriladi, faza/nol/yerlash ketma-ketligi tester bilan sinovdan o‘tkaziladi.",
    "materials": [
      "Mis kabel VVG-ng-LS (3x1.5, 3x2.5, 3x4, 3x6)",
      "Gofra truba (NG)",
      "Plastik podrozetniklar",
      "Taqsimlash qalqoni",
      "Avtomat o‘chirgichlar (B/C sinf)"
    ],
    "tools": [
      "Shtroborez changyutgich bilan",
      "Perforator va olmos koronka",
      "Kabel tozalovchi (Stripper)",
      "Multimetr / Indikator",
      "Lazer nivelir"
    ],
    "checklist": [
      {
        "text": "Kabel kesimi loyihaga mos (Rozetka 2.5, Chiroq 1.5)",
        "required": true
      },
      {
        "text": "Shtrobalar faqat vertikal va gorizontal o‘tkazildi",
        "required": true
      },
      {
        "text": "Podrozetniklar chuqurligi tekislandi va mustahkamlandi",
        "required": true
      },
      {
        "text": "Barcha liniyalar qisqa tutashuvga sinovdan o‘tkazildi",
        "required": true
      }
    ],
    "related_topics": [
      "Rozetkalar joylashuvini aniqlash",
      "Kalitlar joylashuvini aniqlash",
      "Elektr щitini tashkil qilish"
    ],
    "order_index": 11,
    "is_published": true,
    "id": 46
  },
  {
    "category_id": 4,
    "category_code": "04",
    "category_slug": "04-elektr-montaj",
    "category_title": "Elektr montaj",
    "category_icon": "⚡",
    "slug": "04-kabel-yonalishlarini-belgilash",
    "title": "Kabel yo‘nalishlarini belgilash",
    "short_description": "Kabel yo‘nalishlarini belgilash — elektr xavfsizligi, ergonomik qulaylik va kelajakdagi maishiy texnikalarning uzluksiz ishlashini ta'minlovchi muhandislik tarmog‘i.",
    "purpose": "Xonadondagi barcha elektr yuklamalarini to‘g‘ri taqsimlash, zamonaviy avtomatika bilan himoyalash va yoritish ssenariylarini amalga oshirish.",
    "when_to_do": "Devorlar terilib, shtukaturka qilingandan so‘ng yoki qora devor paytida, pardozlash ishlaridan oldin.",
    "before_start": "Aniq mebel rejasiga bog‘langan elektr ishchi loyihasi, barcha texnika quvvatlari ro‘yxati.",
    "step_by_step": [
      "Devorlarga rozetka, kalit va chiroq koordinatalarini lazer yordamida chizish.",
      "Shtroborez yordamida faqat vertikal yo‘nalishda shtrobalar ochish.",
      "Gofra quvurida mis kabelni (VVG-ng-LS) tortish va qisqichlar bilan mahkamlash.",
      "Podrozetniklar uchun koronka bilan o‘rin ochish va gips/qorishma bilan qotirish.",
      "Taqsimlash qutilarida (yoki podrozetnik ichida) payvandlash yoki klemmalar bilan ulash.",
      "Elektr qalqonini (shchit) yig‘ish, UZO va difavtomatlarni o‘rnatish.",
      "Liniyalarni megommetr va multimetr bilan sinovdan o‘tkazish."
    ],
    "rules": [
      "Kabel yo‘nalishlari faqat vertikal va gorizontal bo‘lishi shart, diagonal yurgizish qat'iyan taqiqlanadi.",
      "Rozetkalar uchun kamida 3x2.5 mm² mis kabel, yoritish uchun 3x1.5 mm² kabel ishlatiladi.",
      "Nam xonalar (sanuzel, oshxona) uchun 10-30 mA sezgirlikdagi UZO/AVDT o‘rnatilishi shart."
    ],
    "important_notes": "Har bir quvvatli jihoz (konditsioner, duxovka, kir yuvish mashinasi, boyler) uchun qalqondan alohida to‘g‘ridan-to‘g‘ri kabel liniyasi tortiladi.",
    "common_mistakes": [
      "Kabelni gorizontal holda yuk ko‘taruvchi devor bo‘ylab chuqur shtroblash.",
      "Yoritish va rozetka liniyalarini bitta avtomatga ulab yuborish.",
      "Yerga ulash (Zazemleniye - PE) o‘tkazgichini ulamaslik yoki nolga qo‘shib yuborish."
    ],
    "quality_control": "Har bir liniyaning izolyatsiya qarshiligi tekshiriladi, faza/nol/yerlash ketma-ketligi tester bilan sinovdan o‘tkaziladi.",
    "materials": [
      "Mis kabel VVG-ng-LS (3x1.5, 3x2.5, 3x4, 3x6)",
      "Gofra truba (NG)",
      "Plastik podrozetniklar",
      "Taqsimlash qalqoni",
      "Avtomat o‘chirgichlar (B/C sinf)"
    ],
    "tools": [
      "Shtroborez changyutgich bilan",
      "Perforator va olmos koronka",
      "Kabel tozalovchi (Stripper)",
      "Multimetr / Indikator",
      "Lazer nivelir"
    ],
    "checklist": [
      {
        "text": "Kabel kesimi loyihaga mos (Rozetka 2.5, Chiroq 1.5)",
        "required": true
      },
      {
        "text": "Shtrobalar faqat vertikal va gorizontal o‘tkazildi",
        "required": true
      },
      {
        "text": "Podrozetniklar chuqurligi tekislandi va mustahkamlandi",
        "required": true
      },
      {
        "text": "Barcha liniyalar qisqa tutashuvga sinovdan o‘tkazildi",
        "required": true
      }
    ],
    "related_topics": [
      "Rozetkalar joylashuvini aniqlash",
      "Kalitlar joylashuvini aniqlash",
      "Elektr щitini tashkil qilish"
    ],
    "order_index": 12,
    "is_published": true,
    "id": 47
  },
  {
    "category_id": 4,
    "category_code": "04",
    "category_slug": "04-elektr-montaj",
    "category_title": "Elektr montaj",
    "category_icon": "⚡",
    "slug": "04-shtroblash",
    "title": "Shtroblash",
    "short_description": "Shtroblash — elektr xavfsizligi, ergonomik qulaylik va kelajakdagi maishiy texnikalarning uzluksiz ishlashini ta'minlovchi muhandislik tarmog‘i.",
    "purpose": "Xonadondagi barcha elektr yuklamalarini to‘g‘ri taqsimlash, zamonaviy avtomatika bilan himoyalash va yoritish ssenariylarini amalga oshirish.",
    "when_to_do": "Devorlar terilib, shtukaturka qilingandan so‘ng yoki qora devor paytida, pardozlash ishlaridan oldin.",
    "before_start": "Aniq mebel rejasiga bog‘langan elektr ishchi loyihasi, barcha texnika quvvatlari ro‘yxati.",
    "step_by_step": [
      "Devorlarga rozetka, kalit va chiroq koordinatalarini lazer yordamida chizish.",
      "Shtroborez yordamida faqat vertikal yo‘nalishda shtrobalar ochish.",
      "Gofra quvurida mis kabelni (VVG-ng-LS) tortish va qisqichlar bilan mahkamlash.",
      "Podrozetniklar uchun koronka bilan o‘rin ochish va gips/qorishma bilan qotirish.",
      "Taqsimlash qutilarida (yoki podrozetnik ichida) payvandlash yoki klemmalar bilan ulash.",
      "Elektr qalqonini (shchit) yig‘ish, UZO va difavtomatlarni o‘rnatish.",
      "Liniyalarni megommetr va multimetr bilan sinovdan o‘tkazish."
    ],
    "rules": [
      "Kabel yo‘nalishlari faqat vertikal va gorizontal bo‘lishi shart, diagonal yurgizish qat'iyan taqiqlanadi.",
      "Rozetkalar uchun kamida 3x2.5 mm² mis kabel, yoritish uchun 3x1.5 mm² kabel ishlatiladi.",
      "Nam xonalar (sanuzel, oshxona) uchun 10-30 mA sezgirlikdagi UZO/AVDT o‘rnatilishi shart."
    ],
    "important_notes": "Har bir quvvatli jihoz (konditsioner, duxovka, kir yuvish mashinasi, boyler) uchun qalqondan alohida to‘g‘ridan-to‘g‘ri kabel liniyasi tortiladi.",
    "common_mistakes": [
      "Kabelni gorizontal holda yuk ko‘taruvchi devor bo‘ylab chuqur shtroblash.",
      "Yoritish va rozetka liniyalarini bitta avtomatga ulab yuborish.",
      "Yerga ulash (Zazemleniye - PE) o‘tkazgichini ulamaslik yoki nolga qo‘shib yuborish."
    ],
    "quality_control": "Har bir liniyaning izolyatsiya qarshiligi tekshiriladi, faza/nol/yerlash ketma-ketligi tester bilan sinovdan o‘tkaziladi.",
    "materials": [
      "Mis kabel VVG-ng-LS (3x1.5, 3x2.5, 3x4, 3x6)",
      "Gofra truba (NG)",
      "Plastik podrozetniklar",
      "Taqsimlash qalqoni",
      "Avtomat o‘chirgichlar (B/C sinf)"
    ],
    "tools": [
      "Shtroborez changyutgich bilan",
      "Perforator va olmos koronka",
      "Kabel tozalovchi (Stripper)",
      "Multimetr / Indikator",
      "Lazer nivelir"
    ],
    "checklist": [
      {
        "text": "Kabel kesimi loyihaga mos (Rozetka 2.5, Chiroq 1.5)",
        "required": true
      },
      {
        "text": "Shtrobalar faqat vertikal va gorizontal o‘tkazildi",
        "required": true
      },
      {
        "text": "Podrozetniklar chuqurligi tekislandi va mustahkamlandi",
        "required": true
      },
      {
        "text": "Barcha liniyalar qisqa tutashuvga sinovdan o‘tkazildi",
        "required": true
      }
    ],
    "related_topics": [
      "Rozetkalar joylashuvini aniqlash",
      "Kalitlar joylashuvini aniqlash",
      "Elektr щitini tashkil qilish"
    ],
    "order_index": 13,
    "is_published": true,
    "id": 48
  },
  {
    "category_id": 4,
    "category_code": "04",
    "category_slug": "04-elektr-montaj",
    "category_title": "Elektr montaj",
    "category_icon": "⚡",
    "slug": "04-kabel-tortish",
    "title": "Kabel tortish",
    "short_description": "Kabel tortish — elektr xavfsizligi, ergonomik qulaylik va kelajakdagi maishiy texnikalarning uzluksiz ishlashini ta'minlovchi muhandislik tarmog‘i.",
    "purpose": "Xonadondagi barcha elektr yuklamalarini to‘g‘ri taqsimlash, zamonaviy avtomatika bilan himoyalash va yoritish ssenariylarini amalga oshirish.",
    "when_to_do": "Devorlar terilib, shtukaturka qilingandan so‘ng yoki qora devor paytida, pardozlash ishlaridan oldin.",
    "before_start": "Aniq mebel rejasiga bog‘langan elektr ishchi loyihasi, barcha texnika quvvatlari ro‘yxati.",
    "step_by_step": [
      "Devorlarga rozetka, kalit va chiroq koordinatalarini lazer yordamida chizish.",
      "Shtroborez yordamida faqat vertikal yo‘nalishda shtrobalar ochish.",
      "Gofra quvurida mis kabelni (VVG-ng-LS) tortish va qisqichlar bilan mahkamlash.",
      "Podrozetniklar uchun koronka bilan o‘rin ochish va gips/qorishma bilan qotirish.",
      "Taqsimlash qutilarida (yoki podrozetnik ichida) payvandlash yoki klemmalar bilan ulash.",
      "Elektr qalqonini (shchit) yig‘ish, UZO va difavtomatlarni o‘rnatish.",
      "Liniyalarni megommetr va multimetr bilan sinovdan o‘tkazish."
    ],
    "rules": [
      "Kabel yo‘nalishlari faqat vertikal va gorizontal bo‘lishi shart, diagonal yurgizish qat'iyan taqiqlanadi.",
      "Rozetkalar uchun kamida 3x2.5 mm² mis kabel, yoritish uchun 3x1.5 mm² kabel ishlatiladi.",
      "Nam xonalar (sanuzel, oshxona) uchun 10-30 mA sezgirlikdagi UZO/AVDT o‘rnatilishi shart."
    ],
    "important_notes": "Har bir quvvatli jihoz (konditsioner, duxovka, kir yuvish mashinasi, boyler) uchun qalqondan alohida to‘g‘ridan-to‘g‘ri kabel liniyasi tortiladi.",
    "common_mistakes": [
      "Kabelni gorizontal holda yuk ko‘taruvchi devor bo‘ylab chuqur shtroblash.",
      "Yoritish va rozetka liniyalarini bitta avtomatga ulab yuborish.",
      "Yerga ulash (Zazemleniye - PE) o‘tkazgichini ulamaslik yoki nolga qo‘shib yuborish."
    ],
    "quality_control": "Har bir liniyaning izolyatsiya qarshiligi tekshiriladi, faza/nol/yerlash ketma-ketligi tester bilan sinovdan o‘tkaziladi.",
    "materials": [
      "Mis kabel VVG-ng-LS (3x1.5, 3x2.5, 3x4, 3x6)",
      "Gofra truba (NG)",
      "Plastik podrozetniklar",
      "Taqsimlash qalqoni",
      "Avtomat o‘chirgichlar (B/C sinf)"
    ],
    "tools": [
      "Shtroborez changyutgich bilan",
      "Perforator va olmos koronka",
      "Kabel tozalovchi (Stripper)",
      "Multimetr / Indikator",
      "Lazer nivelir"
    ],
    "checklist": [
      {
        "text": "Kabel kesimi loyihaga mos (Rozetka 2.5, Chiroq 1.5)",
        "required": true
      },
      {
        "text": "Shtrobalar faqat vertikal va gorizontal o‘tkazildi",
        "required": true
      },
      {
        "text": "Podrozetniklar chuqurligi tekislandi va mustahkamlandi",
        "required": true
      },
      {
        "text": "Barcha liniyalar qisqa tutashuvga sinovdan o‘tkazildi",
        "required": true
      }
    ],
    "related_topics": [
      "Rozetkalar joylashuvini aniqlash",
      "Kalitlar joylashuvini aniqlash",
      "Elektr щitini tashkil qilish"
    ],
    "order_index": 14,
    "is_published": true,
    "id": 49
  },
  {
    "category_id": 4,
    "category_code": "04",
    "category_slug": "04-elektr-montaj",
    "category_title": "Elektr montaj",
    "category_icon": "⚡",
    "slug": "04-podrozetniklarni-ornatish",
    "title": "Podrozetniklarni o‘rnatish",
    "short_description": "Podrozetniklarni o‘rnatish — elektr xavfsizligi, ergonomik qulaylik va kelajakdagi maishiy texnikalarning uzluksiz ishlashini ta'minlovchi muhandislik tarmog‘i.",
    "purpose": "Xonadondagi barcha elektr yuklamalarini to‘g‘ri taqsimlash, zamonaviy avtomatika bilan himoyalash va yoritish ssenariylarini amalga oshirish.",
    "when_to_do": "Devorlar terilib, shtukaturka qilingandan so‘ng yoki qora devor paytida, pardozlash ishlaridan oldin.",
    "before_start": "Aniq mebel rejasiga bog‘langan elektr ishchi loyihasi, barcha texnika quvvatlari ro‘yxati.",
    "step_by_step": [
      "Devorlarga rozetka, kalit va chiroq koordinatalarini lazer yordamida chizish.",
      "Shtroborez yordamida faqat vertikal yo‘nalishda shtrobalar ochish.",
      "Gofra quvurida mis kabelni (VVG-ng-LS) tortish va qisqichlar bilan mahkamlash.",
      "Podrozetniklar uchun koronka bilan o‘rin ochish va gips/qorishma bilan qotirish.",
      "Taqsimlash qutilarida (yoki podrozetnik ichida) payvandlash yoki klemmalar bilan ulash.",
      "Elektr qalqonini (shchit) yig‘ish, UZO va difavtomatlarni o‘rnatish.",
      "Liniyalarni megommetr va multimetr bilan sinovdan o‘tkazish."
    ],
    "rules": [
      "Kabel yo‘nalishlari faqat vertikal va gorizontal bo‘lishi shart, diagonal yurgizish qat'iyan taqiqlanadi.",
      "Rozetkalar uchun kamida 3x2.5 mm² mis kabel, yoritish uchun 3x1.5 mm² kabel ishlatiladi.",
      "Nam xonalar (sanuzel, oshxona) uchun 10-30 mA sezgirlikdagi UZO/AVDT o‘rnatilishi shart."
    ],
    "important_notes": "Har bir quvvatli jihoz (konditsioner, duxovka, kir yuvish mashinasi, boyler) uchun qalqondan alohida to‘g‘ridan-to‘g‘ri kabel liniyasi tortiladi.",
    "common_mistakes": [
      "Kabelni gorizontal holda yuk ko‘taruvchi devor bo‘ylab chuqur shtroblash.",
      "Yoritish va rozetka liniyalarini bitta avtomatga ulab yuborish.",
      "Yerga ulash (Zazemleniye - PE) o‘tkazgichini ulamaslik yoki nolga qo‘shib yuborish."
    ],
    "quality_control": "Har bir liniyaning izolyatsiya qarshiligi tekshiriladi, faza/nol/yerlash ketma-ketligi tester bilan sinovdan o‘tkaziladi.",
    "materials": [
      "Mis kabel VVG-ng-LS (3x1.5, 3x2.5, 3x4, 3x6)",
      "Gofra truba (NG)",
      "Plastik podrozetniklar",
      "Taqsimlash qalqoni",
      "Avtomat o‘chirgichlar (B/C sinf)"
    ],
    "tools": [
      "Shtroborez changyutgich bilan",
      "Perforator va olmos koronka",
      "Kabel tozalovchi (Stripper)",
      "Multimetr / Indikator",
      "Lazer nivelir"
    ],
    "checklist": [
      {
        "text": "Kabel kesimi loyihaga mos (Rozetka 2.5, Chiroq 1.5)",
        "required": true
      },
      {
        "text": "Shtrobalar faqat vertikal va gorizontal o‘tkazildi",
        "required": true
      },
      {
        "text": "Podrozetniklar chuqurligi tekislandi va mustahkamlandi",
        "required": true
      },
      {
        "text": "Barcha liniyalar qisqa tutashuvga sinovdan o‘tkazildi",
        "required": true
      }
    ],
    "related_topics": [
      "Rozetkalar joylashuvini aniqlash",
      "Kalitlar joylashuvini aniqlash",
      "Elektr щitini tashkil qilish"
    ],
    "order_index": 15,
    "is_published": true,
    "id": 50
  },
  {
    "category_id": 4,
    "category_code": "04",
    "category_slug": "04-elektr-montaj",
    "category_title": "Elektr montaj",
    "category_icon": "⚡",
    "slug": "04-himoya-avtomatlari-rcd-va-boshqa-himoya-qurilmalarini-ornatish",
    "title": "Himoya avtomatlari/RCD va boshqa himoya qurilmalarini o‘rnatish",
    "short_description": "Himoya avtomatlari/RCD va boshqa himoya qurilmalarini o‘rnatish — elektr xavfsizligi, ergonomik qulaylik va kelajakdagi maishiy texnikalarning uzluksiz ishlashini ta'minlovchi muhandislik tarmog‘i.",
    "purpose": "Xonadondagi barcha elektr yuklamalarini to‘g‘ri taqsimlash, zamonaviy avtomatika bilan himoyalash va yoritish ssenariylarini amalga oshirish.",
    "when_to_do": "Devorlar terilib, shtukaturka qilingandan so‘ng yoki qora devor paytida, pardozlash ishlaridan oldin.",
    "before_start": "Aniq mebel rejasiga bog‘langan elektr ishchi loyihasi, barcha texnika quvvatlari ro‘yxati.",
    "step_by_step": [
      "Devorlarga rozetka, kalit va chiroq koordinatalarini lazer yordamida chizish.",
      "Shtroborez yordamida faqat vertikal yo‘nalishda shtrobalar ochish.",
      "Gofra quvurida mis kabelni (VVG-ng-LS) tortish va qisqichlar bilan mahkamlash.",
      "Podrozetniklar uchun koronka bilan o‘rin ochish va gips/qorishma bilan qotirish.",
      "Taqsimlash qutilarida (yoki podrozetnik ichida) payvandlash yoki klemmalar bilan ulash.",
      "Elektr qalqonini (shchit) yig‘ish, UZO va difavtomatlarni o‘rnatish.",
      "Liniyalarni megommetr va multimetr bilan sinovdan o‘tkazish."
    ],
    "rules": [
      "Kabel yo‘nalishlari faqat vertikal va gorizontal bo‘lishi shart, diagonal yurgizish qat'iyan taqiqlanadi.",
      "Rozetkalar uchun kamida 3x2.5 mm² mis kabel, yoritish uchun 3x1.5 mm² kabel ishlatiladi.",
      "Nam xonalar (sanuzel, oshxona) uchun 10-30 mA sezgirlikdagi UZO/AVDT o‘rnatilishi shart."
    ],
    "important_notes": "Har bir quvvatli jihoz (konditsioner, duxovka, kir yuvish mashinasi, boyler) uchun qalqondan alohida to‘g‘ridan-to‘g‘ri kabel liniyasi tortiladi.",
    "common_mistakes": [
      "Kabelni gorizontal holda yuk ko‘taruvchi devor bo‘ylab chuqur shtroblash.",
      "Yoritish va rozetka liniyalarini bitta avtomatga ulab yuborish.",
      "Yerga ulash (Zazemleniye - PE) o‘tkazgichini ulamaslik yoki nolga qo‘shib yuborish."
    ],
    "quality_control": "Har bir liniyaning izolyatsiya qarshiligi tekshiriladi, faza/nol/yerlash ketma-ketligi tester bilan sinovdan o‘tkaziladi.",
    "materials": [
      "Mis kabel VVG-ng-LS (3x1.5, 3x2.5, 3x4, 3x6)",
      "Gofra truba (NG)",
      "Plastik podrozetniklar",
      "Taqsimlash qalqoni",
      "Avtomat o‘chirgichlar (B/C sinf)"
    ],
    "tools": [
      "Shtroborez changyutgich bilan",
      "Perforator va olmos koronka",
      "Kabel tozalovchi (Stripper)",
      "Multimetr / Indikator",
      "Lazer nivelir"
    ],
    "checklist": [
      {
        "text": "Kabel kesimi loyihaga mos (Rozetka 2.5, Chiroq 1.5)",
        "required": true
      },
      {
        "text": "Shtrobalar faqat vertikal va gorizontal o‘tkazildi",
        "required": true
      },
      {
        "text": "Podrozetniklar chuqurligi tekislandi va mustahkamlandi",
        "required": true
      },
      {
        "text": "Barcha liniyalar qisqa tutashuvga sinovdan o‘tkazildi",
        "required": true
      }
    ],
    "related_topics": [
      "Rozetkalar joylashuvini aniqlash",
      "Kalitlar joylashuvini aniqlash",
      "Elektr щitini tashkil qilish"
    ],
    "order_index": 16,
    "is_published": true,
    "id": 51
  },
  {
    "category_id": 4,
    "category_code": "04",
    "category_slug": "04-elektr-montaj",
    "category_title": "Elektr montaj",
    "category_icon": "⚡",
    "slug": "04-elektr-tizimini-tekshirish",
    "title": "Elektr tizimini tekshirish",
    "short_description": "Elektr tizimini tekshirish — elektr xavfsizligi, ergonomik qulaylik va kelajakdagi maishiy texnikalarning uzluksiz ishlashini ta'minlovchi muhandislik tarmog‘i.",
    "purpose": "Xonadondagi barcha elektr yuklamalarini to‘g‘ri taqsimlash, zamonaviy avtomatika bilan himoyalash va yoritish ssenariylarini amalga oshirish.",
    "when_to_do": "Devorlar terilib, shtukaturka qilingandan so‘ng yoki qora devor paytida, pardozlash ishlaridan oldin.",
    "before_start": "Aniq mebel rejasiga bog‘langan elektr ishchi loyihasi, barcha texnika quvvatlari ro‘yxati.",
    "step_by_step": [
      "Devorlarga rozetka, kalit va chiroq koordinatalarini lazer yordamida chizish.",
      "Shtroborez yordamida faqat vertikal yo‘nalishda shtrobalar ochish.",
      "Gofra quvurida mis kabelni (VVG-ng-LS) tortish va qisqichlar bilan mahkamlash.",
      "Podrozetniklar uchun koronka bilan o‘rin ochish va gips/qorishma bilan qotirish.",
      "Taqsimlash qutilarida (yoki podrozetnik ichida) payvandlash yoki klemmalar bilan ulash.",
      "Elektr qalqonini (shchit) yig‘ish, UZO va difavtomatlarni o‘rnatish.",
      "Liniyalarni megommetr va multimetr bilan sinovdan o‘tkazish."
    ],
    "rules": [
      "Kabel yo‘nalishlari faqat vertikal va gorizontal bo‘lishi shart, diagonal yurgizish qat'iyan taqiqlanadi.",
      "Rozetkalar uchun kamida 3x2.5 mm² mis kabel, yoritish uchun 3x1.5 mm² kabel ishlatiladi.",
      "Nam xonalar (sanuzel, oshxona) uchun 10-30 mA sezgirlikdagi UZO/AVDT o‘rnatilishi shart."
    ],
    "important_notes": "Har bir quvvatli jihoz (konditsioner, duxovka, kir yuvish mashinasi, boyler) uchun qalqondan alohida to‘g‘ridan-to‘g‘ri kabel liniyasi tortiladi.",
    "common_mistakes": [
      "Kabelni gorizontal holda yuk ko‘taruvchi devor bo‘ylab chuqur shtroblash.",
      "Yoritish va rozetka liniyalarini bitta avtomatga ulab yuborish.",
      "Yerga ulash (Zazemleniye - PE) o‘tkazgichini ulamaslik yoki nolga qo‘shib yuborish."
    ],
    "quality_control": "Har bir liniyaning izolyatsiya qarshiligi tekshiriladi, faza/nol/yerlash ketma-ketligi tester bilan sinovdan o‘tkaziladi.",
    "materials": [
      "Mis kabel VVG-ng-LS (3x1.5, 3x2.5, 3x4, 3x6)",
      "Gofra truba (NG)",
      "Plastik podrozetniklar",
      "Taqsimlash qalqoni",
      "Avtomat o‘chirgichlar (B/C sinf)"
    ],
    "tools": [
      "Shtroborez changyutgich bilan",
      "Perforator va olmos koronka",
      "Kabel tozalovchi (Stripper)",
      "Multimetr / Indikator",
      "Lazer nivelir"
    ],
    "checklist": [
      {
        "text": "Kabel kesimi loyihaga mos (Rozetka 2.5, Chiroq 1.5)",
        "required": true
      },
      {
        "text": "Shtrobalar faqat vertikal va gorizontal o‘tkazildi",
        "required": true
      },
      {
        "text": "Podrozetniklar chuqurligi tekislandi va mustahkamlandi",
        "required": true
      },
      {
        "text": "Barcha liniyalar qisqa tutashuvga sinovdan o‘tkazildi",
        "required": true
      }
    ],
    "related_topics": [
      "Rozetkalar joylashuvini aniqlash",
      "Kalitlar joylashuvini aniqlash",
      "Elektr щitini tashkil qilish"
    ],
    "order_index": 17,
    "is_published": true,
    "id": 52
  },
  {
    "category_id": 5,
    "category_code": "05",
    "category_slug": "05-santexnika-va-kanalizatsiya",
    "category_title": "Santexnika va kanalizatsiya",
    "category_icon": "🚰",
    "slug": "05-suv-kirish-nuqtalarini-aniqlash",
    "title": "Suv kirish nuqtalarini aniqlash",
    "short_description": "Suv kirish nuqtalarini aniqlash — suv ta'minoti va kanalizatsiyaning xavfsiz, oqishlarsiz, gidrozarbalarsiz va uzoq yillar xizmat qiladigan tizimi.",
    "purpose": "Toza suvni kerakli bosimda har bir nuqtaga yetkazish va chiqindi suvlarni shovqinsiz va hid tarqalmasdan chiqarib yuborish.",
    "when_to_do": "Devorlar tayyor bo‘lgach, pol styajkasi va gidroizolyatsiya ishlaridan oldin.",
    "before_start": "Aniq santexnika moslamalari o‘lchamlari va ularning pasportlari (o‘qlari va balandliklari).",
    "step_by_step": [
      "Suv kirish tugunini yig‘ish: kran, qaytarilmas klapan, loy tozalovchi, hisoblagich, reduktor va 100 mkm filtr.",
      "Kollektorli (nurli) yoki ketma-ket tarqatish tizimini devor ichiga joylash.",
      "Kanalizatsiya quvurlarini qat'iy nishablik (gradus) bilan yotqizish.",
      "Suv rozetkalarini (vodorozetka) tekis plastinkaga o‘rnatib, devor yuzasiga qotirish.",
      "Oqishga qarshi datchiklar (Gidrolok, Neptun) tizimini o‘rnatish.",
      "Tizimni kamida 10-12 bar bosim ostida oпрессовка (gidravlik sinov) qilish."
    ],
    "rules": [
      "Kanalizatsiya qiyaligi: d50 mm quvur uchun 1 metrga 3 sm, d110 mm quvur uchun 1 metrga 2 sm bo‘lishi shart.",
      "Sovuq suv doimo o‘ngda, issiq suv esa chapda joylashtiriladi.",
      "Bosimni kamaytiruvchi reduktor bosimni 3-3.5 bar darajasida barqarorlashtirishi zarur."
    ],
    "important_notes": "Barcha yashirin ulanmalar (devor yoki pol ichida) faqat press-fiting yoki payvandlangan polipropilen bo‘lishi lozim, rezbali ulanmalarni devor ichiga ko‘mish qat'iyan taqiqlanadi.",
    "common_mistakes": [
      "Kanalizatsiya nishabligini haddan tashqari tik yoki teskari qilib qo‘yish (tiqilib qolishga olib keladi).",
      "Gidravlik sinov o‘tkazmasdan turib quvurlarni betonlab yuborish.",
      "Kollektor tuguniga xizmat ko‘rsatish uchun revizion lyuk qoldirmaslik."
    ],
    "quality_control": "Bosim nasosi bilan 10 bar bosim beriladi va 24 soat davomida bosim tushishi tekshiriladi (ruxsat etilgan og‘ish 0.1 bar dan oshmasligi kerak).",
    "materials": [
      "Tikilgan polietilen (PEX) yoki PP-R quvurlar",
      "Press-fitinglar",
      "Kollektorlar",
      "Shovqinsiz kanalizatsiya quvurlari (Ostendorf)",
      "Issiqlik izolyatsiyasi (Energofleks)"
    ],
    "tools": [
      "Gidravlik opressovshik",
      "Press-qisqichlar (PEX uchun)",
      "Quvur kesgich",
      "Lazerli burchak o‘lchagich",
      "Kalitlar to‘plami"
    ],
    "checklist": [
      {
        "text": "Kanalizatsiya nishabliklari lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Issiq chapda, sovuq o‘ngda qoidasiga amal qilindi",
        "required": true
      },
      {
        "text": "Opressovka 10 bar ostida 24 soat ushlab turildi",
        "required": true
      },
      {
        "text": "Quvurlar issiqlik izolyatsiyasiga o‘raldi",
        "required": true
      }
    ],
    "related_topics": [
      "Sovuq suv quvurlari",
      "Kanalizatsiya quvurlari",
      "Bosim va germetiklikni tekshirish"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 53
  },
  {
    "category_id": 5,
    "category_code": "05",
    "category_slug": "05-santexnika-va-kanalizatsiya",
    "category_title": "Santexnika va kanalizatsiya",
    "category_icon": "🚰",
    "slug": "05-kanalizatsiya-nuqtalarini-aniqlash",
    "title": "Kanalizatsiya nuqtalarini aniqlash",
    "short_description": "Kanalizatsiya nuqtalarini aniqlash — suv ta'minoti va kanalizatsiyaning xavfsiz, oqishlarsiz, gidrozarbalarsiz va uzoq yillar xizmat qiladigan tizimi.",
    "purpose": "Toza suvni kerakli bosimda har bir nuqtaga yetkazish va chiqindi suvlarni shovqinsiz va hid tarqalmasdan chiqarib yuborish.",
    "when_to_do": "Devorlar tayyor bo‘lgach, pol styajkasi va gidroizolyatsiya ishlaridan oldin.",
    "before_start": "Aniq santexnika moslamalari o‘lchamlari va ularning pasportlari (o‘qlari va balandliklari).",
    "step_by_step": [
      "Suv kirish tugunini yig‘ish: kran, qaytarilmas klapan, loy tozalovchi, hisoblagich, reduktor va 100 mkm filtr.",
      "Kollektorli (nurli) yoki ketma-ket tarqatish tizimini devor ichiga joylash.",
      "Kanalizatsiya quvurlarini qat'iy nishablik (gradus) bilan yotqizish.",
      "Suv rozetkalarini (vodorozetka) tekis plastinkaga o‘rnatib, devor yuzasiga qotirish.",
      "Oqishga qarshi datchiklar (Gidrolok, Neptun) tizimini o‘rnatish.",
      "Tizimni kamida 10-12 bar bosim ostida oпрессовка (gidravlik sinov) qilish."
    ],
    "rules": [
      "Kanalizatsiya qiyaligi: d50 mm quvur uchun 1 metrga 3 sm, d110 mm quvur uchun 1 metrga 2 sm bo‘lishi shart.",
      "Sovuq suv doimo o‘ngda, issiq suv esa chapda joylashtiriladi.",
      "Bosimni kamaytiruvchi reduktor bosimni 3-3.5 bar darajasida barqarorlashtirishi zarur."
    ],
    "important_notes": "Barcha yashirin ulanmalar (devor yoki pol ichida) faqat press-fiting yoki payvandlangan polipropilen bo‘lishi lozim, rezbali ulanmalarni devor ichiga ko‘mish qat'iyan taqiqlanadi.",
    "common_mistakes": [
      "Kanalizatsiya nishabligini haddan tashqari tik yoki teskari qilib qo‘yish (tiqilib qolishga olib keladi).",
      "Gidravlik sinov o‘tkazmasdan turib quvurlarni betonlab yuborish.",
      "Kollektor tuguniga xizmat ko‘rsatish uchun revizion lyuk qoldirmaslik."
    ],
    "quality_control": "Bosim nasosi bilan 10 bar bosim beriladi va 24 soat davomida bosim tushishi tekshiriladi (ruxsat etilgan og‘ish 0.1 bar dan oshmasligi kerak).",
    "materials": [
      "Tikilgan polietilen (PEX) yoki PP-R quvurlar",
      "Press-fitinglar",
      "Kollektorlar",
      "Shovqinsiz kanalizatsiya quvurlari (Ostendorf)",
      "Issiqlik izolyatsiyasi (Energofleks)"
    ],
    "tools": [
      "Gidravlik opressovshik",
      "Press-qisqichlar (PEX uchun)",
      "Quvur kesgich",
      "Lazerli burchak o‘lchagich",
      "Kalitlar to‘plami"
    ],
    "checklist": [
      {
        "text": "Kanalizatsiya nishabliklari lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Issiq chapda, sovuq o‘ngda qoidasiga amal qilindi",
        "required": true
      },
      {
        "text": "Opressovka 10 bar ostida 24 soat ushlab turildi",
        "required": true
      },
      {
        "text": "Quvurlar issiqlik izolyatsiyasiga o‘raldi",
        "required": true
      }
    ],
    "related_topics": [
      "Sovuq suv quvurlari",
      "Kanalizatsiya quvurlari",
      "Bosim va germetiklikni tekshirish"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 54
  },
  {
    "category_id": 5,
    "category_code": "05",
    "category_slug": "05-santexnika-va-kanalizatsiya",
    "category_title": "Santexnika va kanalizatsiya",
    "category_icon": "🚰",
    "slug": "05-sovuq-suv-quvurlari",
    "title": "Sovuq suv quvurlari",
    "short_description": "Sovuq suv quvurlari — suv ta'minoti va kanalizatsiyaning xavfsiz, oqishlarsiz, gidrozarbalarsiz va uzoq yillar xizmat qiladigan tizimi.",
    "purpose": "Toza suvni kerakli bosimda har bir nuqtaga yetkazish va chiqindi suvlarni shovqinsiz va hid tarqalmasdan chiqarib yuborish.",
    "when_to_do": "Devorlar tayyor bo‘lgach, pol styajkasi va gidroizolyatsiya ishlaridan oldin.",
    "before_start": "Aniq santexnika moslamalari o‘lchamlari va ularning pasportlari (o‘qlari va balandliklari).",
    "step_by_step": [
      "Suv kirish tugunini yig‘ish: kran, qaytarilmas klapan, loy tozalovchi, hisoblagich, reduktor va 100 mkm filtr.",
      "Kollektorli (nurli) yoki ketma-ket tarqatish tizimini devor ichiga joylash.",
      "Kanalizatsiya quvurlarini qat'iy nishablik (gradus) bilan yotqizish.",
      "Suv rozetkalarini (vodorozetka) tekis plastinkaga o‘rnatib, devor yuzasiga qotirish.",
      "Oqishga qarshi datchiklar (Gidrolok, Neptun) tizimini o‘rnatish.",
      "Tizimni kamida 10-12 bar bosim ostida oпрессовка (gidravlik sinov) qilish."
    ],
    "rules": [
      "Kanalizatsiya qiyaligi: d50 mm quvur uchun 1 metrga 3 sm, d110 mm quvur uchun 1 metrga 2 sm bo‘lishi shart.",
      "Sovuq suv doimo o‘ngda, issiq suv esa chapda joylashtiriladi.",
      "Bosimni kamaytiruvchi reduktor bosimni 3-3.5 bar darajasida barqarorlashtirishi zarur."
    ],
    "important_notes": "Barcha yashirin ulanmalar (devor yoki pol ichida) faqat press-fiting yoki payvandlangan polipropilen bo‘lishi lozim, rezbali ulanmalarni devor ichiga ko‘mish qat'iyan taqiqlanadi.",
    "common_mistakes": [
      "Kanalizatsiya nishabligini haddan tashqari tik yoki teskari qilib qo‘yish (tiqilib qolishga olib keladi).",
      "Gidravlik sinov o‘tkazmasdan turib quvurlarni betonlab yuborish.",
      "Kollektor tuguniga xizmat ko‘rsatish uchun revizion lyuk qoldirmaslik."
    ],
    "quality_control": "Bosim nasosi bilan 10 bar bosim beriladi va 24 soat davomida bosim tushishi tekshiriladi (ruxsat etilgan og‘ish 0.1 bar dan oshmasligi kerak).",
    "materials": [
      "Tikilgan polietilen (PEX) yoki PP-R quvurlar",
      "Press-fitinglar",
      "Kollektorlar",
      "Shovqinsiz kanalizatsiya quvurlari (Ostendorf)",
      "Issiqlik izolyatsiyasi (Energofleks)"
    ],
    "tools": [
      "Gidravlik opressovshik",
      "Press-qisqichlar (PEX uchun)",
      "Quvur kesgich",
      "Lazerli burchak o‘lchagich",
      "Kalitlar to‘plami"
    ],
    "checklist": [
      {
        "text": "Kanalizatsiya nishabliklari lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Issiq chapda, sovuq o‘ngda qoidasiga amal qilindi",
        "required": true
      },
      {
        "text": "Opressovka 10 bar ostida 24 soat ushlab turildi",
        "required": true
      },
      {
        "text": "Quvurlar issiqlik izolyatsiyasiga o‘raldi",
        "required": true
      }
    ],
    "related_topics": [
      "Sovuq suv quvurlari",
      "Kanalizatsiya quvurlari",
      "Bosim va germetiklikni tekshirish"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 55
  },
  {
    "category_id": 5,
    "category_code": "05",
    "category_slug": "05-santexnika-va-kanalizatsiya",
    "category_title": "Santexnika va kanalizatsiya",
    "category_icon": "🚰",
    "slug": "05-issiq-suv-quvurlari",
    "title": "Issiq suv quvurlari",
    "short_description": "Issiq suv quvurlari — suv ta'minoti va kanalizatsiyaning xavfsiz, oqishlarsiz, gidrozarbalarsiz va uzoq yillar xizmat qiladigan tizimi.",
    "purpose": "Toza suvni kerakli bosimda har bir nuqtaga yetkazish va chiqindi suvlarni shovqinsiz va hid tarqalmasdan chiqarib yuborish.",
    "when_to_do": "Devorlar tayyor bo‘lgach, pol styajkasi va gidroizolyatsiya ishlaridan oldin.",
    "before_start": "Aniq santexnika moslamalari o‘lchamlari va ularning pasportlari (o‘qlari va balandliklari).",
    "step_by_step": [
      "Suv kirish tugunini yig‘ish: kran, qaytarilmas klapan, loy tozalovchi, hisoblagich, reduktor va 100 mkm filtr.",
      "Kollektorli (nurli) yoki ketma-ket tarqatish tizimini devor ichiga joylash.",
      "Kanalizatsiya quvurlarini qat'iy nishablik (gradus) bilan yotqizish.",
      "Suv rozetkalarini (vodorozetka) tekis plastinkaga o‘rnatib, devor yuzasiga qotirish.",
      "Oqishga qarshi datchiklar (Gidrolok, Neptun) tizimini o‘rnatish.",
      "Tizimni kamida 10-12 bar bosim ostida oпрессовка (gidravlik sinov) qilish."
    ],
    "rules": [
      "Kanalizatsiya qiyaligi: d50 mm quvur uchun 1 metrga 3 sm, d110 mm quvur uchun 1 metrga 2 sm bo‘lishi shart.",
      "Sovuq suv doimo o‘ngda, issiq suv esa chapda joylashtiriladi.",
      "Bosimni kamaytiruvchi reduktor bosimni 3-3.5 bar darajasida barqarorlashtirishi zarur."
    ],
    "important_notes": "Barcha yashirin ulanmalar (devor yoki pol ichida) faqat press-fiting yoki payvandlangan polipropilen bo‘lishi lozim, rezbali ulanmalarni devor ichiga ko‘mish qat'iyan taqiqlanadi.",
    "common_mistakes": [
      "Kanalizatsiya nishabligini haddan tashqari tik yoki teskari qilib qo‘yish (tiqilib qolishga olib keladi).",
      "Gidravlik sinov o‘tkazmasdan turib quvurlarni betonlab yuborish.",
      "Kollektor tuguniga xizmat ko‘rsatish uchun revizion lyuk qoldirmaslik."
    ],
    "quality_control": "Bosim nasosi bilan 10 bar bosim beriladi va 24 soat davomida bosim tushishi tekshiriladi (ruxsat etilgan og‘ish 0.1 bar dan oshmasligi kerak).",
    "materials": [
      "Tikilgan polietilen (PEX) yoki PP-R quvurlar",
      "Press-fitinglar",
      "Kollektorlar",
      "Shovqinsiz kanalizatsiya quvurlari (Ostendorf)",
      "Issiqlik izolyatsiyasi (Energofleks)"
    ],
    "tools": [
      "Gidravlik opressovshik",
      "Press-qisqichlar (PEX uchun)",
      "Quvur kesgich",
      "Lazerli burchak o‘lchagich",
      "Kalitlar to‘plami"
    ],
    "checklist": [
      {
        "text": "Kanalizatsiya nishabliklari lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Issiq chapda, sovuq o‘ngda qoidasiga amal qilindi",
        "required": true
      },
      {
        "text": "Opressovka 10 bar ostida 24 soat ushlab turildi",
        "required": true
      },
      {
        "text": "Quvurlar issiqlik izolyatsiyasiga o‘raldi",
        "required": true
      }
    ],
    "related_topics": [
      "Sovuq suv quvurlari",
      "Kanalizatsiya quvurlari",
      "Bosim va germetiklikni tekshirish"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 56
  },
  {
    "category_id": 5,
    "category_code": "05",
    "category_slug": "05-santexnika-va-kanalizatsiya",
    "category_title": "Santexnika va kanalizatsiya",
    "category_icon": "🚰",
    "slug": "05-kanalizatsiya-quvurlari",
    "title": "Kanalizatsiya quvurlari",
    "short_description": "Kanalizatsiya quvurlari — suv ta'minoti va kanalizatsiyaning xavfsiz, oqishlarsiz, gidrozarbalarsiz va uzoq yillar xizmat qiladigan tizimi.",
    "purpose": "Toza suvni kerakli bosimda har bir nuqtaga yetkazish va chiqindi suvlarni shovqinsiz va hid tarqalmasdan chiqarib yuborish.",
    "when_to_do": "Devorlar tayyor bo‘lgach, pol styajkasi va gidroizolyatsiya ishlaridan oldin.",
    "before_start": "Aniq santexnika moslamalari o‘lchamlari va ularning pasportlari (o‘qlari va balandliklari).",
    "step_by_step": [
      "Suv kirish tugunini yig‘ish: kran, qaytarilmas klapan, loy tozalovchi, hisoblagich, reduktor va 100 mkm filtr.",
      "Kollektorli (nurli) yoki ketma-ket tarqatish tizimini devor ichiga joylash.",
      "Kanalizatsiya quvurlarini qat'iy nishablik (gradus) bilan yotqizish.",
      "Suv rozetkalarini (vodorozetka) tekis plastinkaga o‘rnatib, devor yuzasiga qotirish.",
      "Oqishga qarshi datchiklar (Gidrolok, Neptun) tizimini o‘rnatish.",
      "Tizimni kamida 10-12 bar bosim ostida oпрессовка (gidravlik sinov) qilish."
    ],
    "rules": [
      "Kanalizatsiya qiyaligi: d50 mm quvur uchun 1 metrga 3 sm, d110 mm quvur uchun 1 metrga 2 sm bo‘lishi shart.",
      "Sovuq suv doimo o‘ngda, issiq suv esa chapda joylashtiriladi.",
      "Bosimni kamaytiruvchi reduktor bosimni 3-3.5 bar darajasida barqarorlashtirishi zarur."
    ],
    "important_notes": "Barcha yashirin ulanmalar (devor yoki pol ichida) faqat press-fiting yoki payvandlangan polipropilen bo‘lishi lozim, rezbali ulanmalarni devor ichiga ko‘mish qat'iyan taqiqlanadi.",
    "common_mistakes": [
      "Kanalizatsiya nishabligini haddan tashqari tik yoki teskari qilib qo‘yish (tiqilib qolishga olib keladi).",
      "Gidravlik sinov o‘tkazmasdan turib quvurlarni betonlab yuborish.",
      "Kollektor tuguniga xizmat ko‘rsatish uchun revizion lyuk qoldirmaslik."
    ],
    "quality_control": "Bosim nasosi bilan 10 bar bosim beriladi va 24 soat davomida bosim tushishi tekshiriladi (ruxsat etilgan og‘ish 0.1 bar dan oshmasligi kerak).",
    "materials": [
      "Tikilgan polietilen (PEX) yoki PP-R quvurlar",
      "Press-fitinglar",
      "Kollektorlar",
      "Shovqinsiz kanalizatsiya quvurlari (Ostendorf)",
      "Issiqlik izolyatsiyasi (Energofleks)"
    ],
    "tools": [
      "Gidravlik opressovshik",
      "Press-qisqichlar (PEX uchun)",
      "Quvur kesgich",
      "Lazerli burchak o‘lchagich",
      "Kalitlar to‘plami"
    ],
    "checklist": [
      {
        "text": "Kanalizatsiya nishabliklari lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Issiq chapda, sovuq o‘ngda qoidasiga amal qilindi",
        "required": true
      },
      {
        "text": "Opressovka 10 bar ostida 24 soat ushlab turildi",
        "required": true
      },
      {
        "text": "Quvurlar issiqlik izolyatsiyasiga o‘raldi",
        "required": true
      }
    ],
    "related_topics": [
      "Sovuq suv quvurlari",
      "Kanalizatsiya quvurlari",
      "Bosim va germetiklikni tekshirish"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 57
  },
  {
    "category_id": 5,
    "category_code": "05",
    "category_slug": "05-santexnika-va-kanalizatsiya",
    "category_title": "Santexnika va kanalizatsiya",
    "category_icon": "🚰",
    "slug": "05-filtrlar-reduktorlar",
    "title": "Filtrlar/reduktorlar",
    "short_description": "Filtrlar/reduktorlar — suv ta'minoti va kanalizatsiyaning xavfsiz, oqishlarsiz, gidrozarbalarsiz va uzoq yillar xizmat qiladigan tizimi.",
    "purpose": "Toza suvni kerakli bosimda har bir nuqtaga yetkazish va chiqindi suvlarni shovqinsiz va hid tarqalmasdan chiqarib yuborish.",
    "when_to_do": "Devorlar tayyor bo‘lgach, pol styajkasi va gidroizolyatsiya ishlaridan oldin.",
    "before_start": "Aniq santexnika moslamalari o‘lchamlari va ularning pasportlari (o‘qlari va balandliklari).",
    "step_by_step": [
      "Suv kirish tugunini yig‘ish: kran, qaytarilmas klapan, loy tozalovchi, hisoblagich, reduktor va 100 mkm filtr.",
      "Kollektorli (nurli) yoki ketma-ket tarqatish tizimini devor ichiga joylash.",
      "Kanalizatsiya quvurlarini qat'iy nishablik (gradus) bilan yotqizish.",
      "Suv rozetkalarini (vodorozetka) tekis plastinkaga o‘rnatib, devor yuzasiga qotirish.",
      "Oqishga qarshi datchiklar (Gidrolok, Neptun) tizimini o‘rnatish.",
      "Tizimni kamida 10-12 bar bosim ostida oпрессовка (gidravlik sinov) qilish."
    ],
    "rules": [
      "Kanalizatsiya qiyaligi: d50 mm quvur uchun 1 metrga 3 sm, d110 mm quvur uchun 1 metrga 2 sm bo‘lishi shart.",
      "Sovuq suv doimo o‘ngda, issiq suv esa chapda joylashtiriladi.",
      "Bosimni kamaytiruvchi reduktor bosimni 3-3.5 bar darajasida barqarorlashtirishi zarur."
    ],
    "important_notes": "Barcha yashirin ulanmalar (devor yoki pol ichida) faqat press-fiting yoki payvandlangan polipropilen bo‘lishi lozim, rezbali ulanmalarni devor ichiga ko‘mish qat'iyan taqiqlanadi.",
    "common_mistakes": [
      "Kanalizatsiya nishabligini haddan tashqari tik yoki teskari qilib qo‘yish (tiqilib qolishga olib keladi).",
      "Gidravlik sinov o‘tkazmasdan turib quvurlarni betonlab yuborish.",
      "Kollektor tuguniga xizmat ko‘rsatish uchun revizion lyuk qoldirmaslik."
    ],
    "quality_control": "Bosim nasosi bilan 10 bar bosim beriladi va 24 soat davomida bosim tushishi tekshiriladi (ruxsat etilgan og‘ish 0.1 bar dan oshmasligi kerak).",
    "materials": [
      "Tikilgan polietilen (PEX) yoki PP-R quvurlar",
      "Press-fitinglar",
      "Kollektorlar",
      "Shovqinsiz kanalizatsiya quvurlari (Ostendorf)",
      "Issiqlik izolyatsiyasi (Energofleks)"
    ],
    "tools": [
      "Gidravlik opressovshik",
      "Press-qisqichlar (PEX uchun)",
      "Quvur kesgich",
      "Lazerli burchak o‘lchagich",
      "Kalitlar to‘plami"
    ],
    "checklist": [
      {
        "text": "Kanalizatsiya nishabliklari lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Issiq chapda, sovuq o‘ngda qoidasiga amal qilindi",
        "required": true
      },
      {
        "text": "Opressovka 10 bar ostida 24 soat ushlab turildi",
        "required": true
      },
      {
        "text": "Quvurlar issiqlik izolyatsiyasiga o‘raldi",
        "required": true
      }
    ],
    "related_topics": [
      "Sovuq suv quvurlari",
      "Kanalizatsiya quvurlari",
      "Bosim va germetiklikni tekshirish"
    ],
    "order_index": 6,
    "is_published": true,
    "id": 58
  },
  {
    "category_id": 5,
    "category_code": "05",
    "category_slug": "05-santexnika-va-kanalizatsiya",
    "category_title": "Santexnika va kanalizatsiya",
    "category_icon": "🚰",
    "slug": "05-suv-hisoblagichlari",
    "title": "Suv hisoblagichlari",
    "short_description": "Suv hisoblagichlari — suv ta'minoti va kanalizatsiyaning xavfsiz, oqishlarsiz, gidrozarbalarsiz va uzoq yillar xizmat qiladigan tizimi.",
    "purpose": "Toza suvni kerakli bosimda har bir nuqtaga yetkazish va chiqindi suvlarni shovqinsiz va hid tarqalmasdan chiqarib yuborish.",
    "when_to_do": "Devorlar tayyor bo‘lgach, pol styajkasi va gidroizolyatsiya ishlaridan oldin.",
    "before_start": "Aniq santexnika moslamalari o‘lchamlari va ularning pasportlari (o‘qlari va balandliklari).",
    "step_by_step": [
      "Suv kirish tugunini yig‘ish: kran, qaytarilmas klapan, loy tozalovchi, hisoblagich, reduktor va 100 mkm filtr.",
      "Kollektorli (nurli) yoki ketma-ket tarqatish tizimini devor ichiga joylash.",
      "Kanalizatsiya quvurlarini qat'iy nishablik (gradus) bilan yotqizish.",
      "Suv rozetkalarini (vodorozetka) tekis plastinkaga o‘rnatib, devor yuzasiga qotirish.",
      "Oqishga qarshi datchiklar (Gidrolok, Neptun) tizimini o‘rnatish.",
      "Tizimni kamida 10-12 bar bosim ostida oпрессовка (gidravlik sinov) qilish."
    ],
    "rules": [
      "Kanalizatsiya qiyaligi: d50 mm quvur uchun 1 metrga 3 sm, d110 mm quvur uchun 1 metrga 2 sm bo‘lishi shart.",
      "Sovuq suv doimo o‘ngda, issiq suv esa chapda joylashtiriladi.",
      "Bosimni kamaytiruvchi reduktor bosimni 3-3.5 bar darajasida barqarorlashtirishi zarur."
    ],
    "important_notes": "Barcha yashirin ulanmalar (devor yoki pol ichida) faqat press-fiting yoki payvandlangan polipropilen bo‘lishi lozim, rezbali ulanmalarni devor ichiga ko‘mish qat'iyan taqiqlanadi.",
    "common_mistakes": [
      "Kanalizatsiya nishabligini haddan tashqari tik yoki teskari qilib qo‘yish (tiqilib qolishga olib keladi).",
      "Gidravlik sinov o‘tkazmasdan turib quvurlarni betonlab yuborish.",
      "Kollektor tuguniga xizmat ko‘rsatish uchun revizion lyuk qoldirmaslik."
    ],
    "quality_control": "Bosim nasosi bilan 10 bar bosim beriladi va 24 soat davomida bosim tushishi tekshiriladi (ruxsat etilgan og‘ish 0.1 bar dan oshmasligi kerak).",
    "materials": [
      "Tikilgan polietilen (PEX) yoki PP-R quvurlar",
      "Press-fitinglar",
      "Kollektorlar",
      "Shovqinsiz kanalizatsiya quvurlari (Ostendorf)",
      "Issiqlik izolyatsiyasi (Energofleks)"
    ],
    "tools": [
      "Gidravlik opressovshik",
      "Press-qisqichlar (PEX uchun)",
      "Quvur kesgich",
      "Lazerli burchak o‘lchagich",
      "Kalitlar to‘plami"
    ],
    "checklist": [
      {
        "text": "Kanalizatsiya nishabliklari lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Issiq chapda, sovuq o‘ngda qoidasiga amal qilindi",
        "required": true
      },
      {
        "text": "Opressovka 10 bar ostida 24 soat ushlab turildi",
        "required": true
      },
      {
        "text": "Quvurlar issiqlik izolyatsiyasiga o‘raldi",
        "required": true
      }
    ],
    "related_topics": [
      "Sovuq suv quvurlari",
      "Kanalizatsiya quvurlari",
      "Bosim va germetiklikni tekshirish"
    ],
    "order_index": 7,
    "is_published": true,
    "id": 59
  },
  {
    "category_id": 5,
    "category_code": "05",
    "category_slug": "05-santexnika-va-kanalizatsiya",
    "category_title": "Santexnika va kanalizatsiya",
    "category_icon": "🚰",
    "slug": "05-unitaz-nuqtasi",
    "title": "Unitaz nuqtasi",
    "short_description": "Unitaz nuqtasi — suv ta'minoti va kanalizatsiyaning xavfsiz, oqishlarsiz, gidrozarbalarsiz va uzoq yillar xizmat qiladigan tizimi.",
    "purpose": "Toza suvni kerakli bosimda har bir nuqtaga yetkazish va chiqindi suvlarni shovqinsiz va hid tarqalmasdan chiqarib yuborish.",
    "when_to_do": "Devorlar tayyor bo‘lgach, pol styajkasi va gidroizolyatsiya ishlaridan oldin.",
    "before_start": "Aniq santexnika moslamalari o‘lchamlari va ularning pasportlari (o‘qlari va balandliklari).",
    "step_by_step": [
      "Suv kirish tugunini yig‘ish: kran, qaytarilmas klapan, loy tozalovchi, hisoblagich, reduktor va 100 mkm filtr.",
      "Kollektorli (nurli) yoki ketma-ket tarqatish tizimini devor ichiga joylash.",
      "Kanalizatsiya quvurlarini qat'iy nishablik (gradus) bilan yotqizish.",
      "Suv rozetkalarini (vodorozetka) tekis plastinkaga o‘rnatib, devor yuzasiga qotirish.",
      "Oqishga qarshi datchiklar (Gidrolok, Neptun) tizimini o‘rnatish.",
      "Tizimni kamida 10-12 bar bosim ostida oпрессовка (gidravlik sinov) qilish."
    ],
    "rules": [
      "Kanalizatsiya qiyaligi: d50 mm quvur uchun 1 metrga 3 sm, d110 mm quvur uchun 1 metrga 2 sm bo‘lishi shart.",
      "Sovuq suv doimo o‘ngda, issiq suv esa chapda joylashtiriladi.",
      "Bosimni kamaytiruvchi reduktor bosimni 3-3.5 bar darajasida barqarorlashtirishi zarur."
    ],
    "important_notes": "Barcha yashirin ulanmalar (devor yoki pol ichida) faqat press-fiting yoki payvandlangan polipropilen bo‘lishi lozim, rezbali ulanmalarni devor ichiga ko‘mish qat'iyan taqiqlanadi.",
    "common_mistakes": [
      "Kanalizatsiya nishabligini haddan tashqari tik yoki teskari qilib qo‘yish (tiqilib qolishga olib keladi).",
      "Gidravlik sinov o‘tkazmasdan turib quvurlarni betonlab yuborish.",
      "Kollektor tuguniga xizmat ko‘rsatish uchun revizion lyuk qoldirmaslik."
    ],
    "quality_control": "Bosim nasosi bilan 10 bar bosim beriladi va 24 soat davomida bosim tushishi tekshiriladi (ruxsat etilgan og‘ish 0.1 bar dan oshmasligi kerak).",
    "materials": [
      "Tikilgan polietilen (PEX) yoki PP-R quvurlar",
      "Press-fitinglar",
      "Kollektorlar",
      "Shovqinsiz kanalizatsiya quvurlari (Ostendorf)",
      "Issiqlik izolyatsiyasi (Energofleks)"
    ],
    "tools": [
      "Gidravlik opressovshik",
      "Press-qisqichlar (PEX uchun)",
      "Quvur kesgich",
      "Lazerli burchak o‘lchagich",
      "Kalitlar to‘plami"
    ],
    "checklist": [
      {
        "text": "Kanalizatsiya nishabliklari lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Issiq chapda, sovuq o‘ngda qoidasiga amal qilindi",
        "required": true
      },
      {
        "text": "Opressovka 10 bar ostida 24 soat ushlab turildi",
        "required": true
      },
      {
        "text": "Quvurlar issiqlik izolyatsiyasiga o‘raldi",
        "required": true
      }
    ],
    "related_topics": [
      "Sovuq suv quvurlari",
      "Kanalizatsiya quvurlari",
      "Bosim va germetiklikni tekshirish"
    ],
    "order_index": 8,
    "is_published": true,
    "id": 60
  },
  {
    "category_id": 5,
    "category_code": "05",
    "category_slug": "05-santexnika-va-kanalizatsiya",
    "category_title": "Santexnika va kanalizatsiya",
    "category_icon": "🚰",
    "slug": "05-rakovina-nuqtasi",
    "title": "Rakovina nuqtasi",
    "short_description": "Rakovina nuqtasi — suv ta'minoti va kanalizatsiyaning xavfsiz, oqishlarsiz, gidrozarbalarsiz va uzoq yillar xizmat qiladigan tizimi.",
    "purpose": "Toza suvni kerakli bosimda har bir nuqtaga yetkazish va chiqindi suvlarni shovqinsiz va hid tarqalmasdan chiqarib yuborish.",
    "when_to_do": "Devorlar tayyor bo‘lgach, pol styajkasi va gidroizolyatsiya ishlaridan oldin.",
    "before_start": "Aniq santexnika moslamalari o‘lchamlari va ularning pasportlari (o‘qlari va balandliklari).",
    "step_by_step": [
      "Suv kirish tugunini yig‘ish: kran, qaytarilmas klapan, loy tozalovchi, hisoblagich, reduktor va 100 mkm filtr.",
      "Kollektorli (nurli) yoki ketma-ket tarqatish tizimini devor ichiga joylash.",
      "Kanalizatsiya quvurlarini qat'iy nishablik (gradus) bilan yotqizish.",
      "Suv rozetkalarini (vodorozetka) tekis plastinkaga o‘rnatib, devor yuzasiga qotirish.",
      "Oqishga qarshi datchiklar (Gidrolok, Neptun) tizimini o‘rnatish.",
      "Tizimni kamida 10-12 bar bosim ostida oпрессовка (gidravlik sinov) qilish."
    ],
    "rules": [
      "Kanalizatsiya qiyaligi: d50 mm quvur uchun 1 metrga 3 sm, d110 mm quvur uchun 1 metrga 2 sm bo‘lishi shart.",
      "Sovuq suv doimo o‘ngda, issiq suv esa chapda joylashtiriladi.",
      "Bosimni kamaytiruvchi reduktor bosimni 3-3.5 bar darajasida barqarorlashtirishi zarur."
    ],
    "important_notes": "Barcha yashirin ulanmalar (devor yoki pol ichida) faqat press-fiting yoki payvandlangan polipropilen bo‘lishi lozim, rezbali ulanmalarni devor ichiga ko‘mish qat'iyan taqiqlanadi.",
    "common_mistakes": [
      "Kanalizatsiya nishabligini haddan tashqari tik yoki teskari qilib qo‘yish (tiqilib qolishga olib keladi).",
      "Gidravlik sinov o‘tkazmasdan turib quvurlarni betonlab yuborish.",
      "Kollektor tuguniga xizmat ko‘rsatish uchun revizion lyuk qoldirmaslik."
    ],
    "quality_control": "Bosim nasosi bilan 10 bar bosim beriladi va 24 soat davomida bosim tushishi tekshiriladi (ruxsat etilgan og‘ish 0.1 bar dan oshmasligi kerak).",
    "materials": [
      "Tikilgan polietilen (PEX) yoki PP-R quvurlar",
      "Press-fitinglar",
      "Kollektorlar",
      "Shovqinsiz kanalizatsiya quvurlari (Ostendorf)",
      "Issiqlik izolyatsiyasi (Energofleks)"
    ],
    "tools": [
      "Gidravlik opressovshik",
      "Press-qisqichlar (PEX uchun)",
      "Quvur kesgich",
      "Lazerli burchak o‘lchagich",
      "Kalitlar to‘plami"
    ],
    "checklist": [
      {
        "text": "Kanalizatsiya nishabliklari lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Issiq chapda, sovuq o‘ngda qoidasiga amal qilindi",
        "required": true
      },
      {
        "text": "Opressovka 10 bar ostida 24 soat ushlab turildi",
        "required": true
      },
      {
        "text": "Quvurlar issiqlik izolyatsiyasiga o‘raldi",
        "required": true
      }
    ],
    "related_topics": [
      "Sovuq suv quvurlari",
      "Kanalizatsiya quvurlari",
      "Bosim va germetiklikni tekshirish"
    ],
    "order_index": 9,
    "is_published": true,
    "id": 61
  },
  {
    "category_id": 5,
    "category_code": "05",
    "category_slug": "05-santexnika-va-kanalizatsiya",
    "category_title": "Santexnika va kanalizatsiya",
    "category_icon": "🚰",
    "slug": "05-dush-vanna-nuqtasi",
    "title": "Dush/vanna nuqtasi",
    "short_description": "Dush/vanna nuqtasi — suv ta'minoti va kanalizatsiyaning xavfsiz, oqishlarsiz, gidrozarbalarsiz va uzoq yillar xizmat qiladigan tizimi.",
    "purpose": "Toza suvni kerakli bosimda har bir nuqtaga yetkazish va chiqindi suvlarni shovqinsiz va hid tarqalmasdan chiqarib yuborish.",
    "when_to_do": "Devorlar tayyor bo‘lgach, pol styajkasi va gidroizolyatsiya ishlaridan oldin.",
    "before_start": "Aniq santexnika moslamalari o‘lchamlari va ularning pasportlari (o‘qlari va balandliklari).",
    "step_by_step": [
      "Suv kirish tugunini yig‘ish: kran, qaytarilmas klapan, loy tozalovchi, hisoblagich, reduktor va 100 mkm filtr.",
      "Kollektorli (nurli) yoki ketma-ket tarqatish tizimini devor ichiga joylash.",
      "Kanalizatsiya quvurlarini qat'iy nishablik (gradus) bilan yotqizish.",
      "Suv rozetkalarini (vodorozetka) tekis plastinkaga o‘rnatib, devor yuzasiga qotirish.",
      "Oqishga qarshi datchiklar (Gidrolok, Neptun) tizimini o‘rnatish.",
      "Tizimni kamida 10-12 bar bosim ostida oпрессовка (gidravlik sinov) qilish."
    ],
    "rules": [
      "Kanalizatsiya qiyaligi: d50 mm quvur uchun 1 metrga 3 sm, d110 mm quvur uchun 1 metrga 2 sm bo‘lishi shart.",
      "Sovuq suv doimo o‘ngda, issiq suv esa chapda joylashtiriladi.",
      "Bosimni kamaytiruvchi reduktor bosimni 3-3.5 bar darajasida barqarorlashtirishi zarur."
    ],
    "important_notes": "Barcha yashirin ulanmalar (devor yoki pol ichida) faqat press-fiting yoki payvandlangan polipropilen bo‘lishi lozim, rezbali ulanmalarni devor ichiga ko‘mish qat'iyan taqiqlanadi.",
    "common_mistakes": [
      "Kanalizatsiya nishabligini haddan tashqari tik yoki teskari qilib qo‘yish (tiqilib qolishga olib keladi).",
      "Gidravlik sinov o‘tkazmasdan turib quvurlarni betonlab yuborish.",
      "Kollektor tuguniga xizmat ko‘rsatish uchun revizion lyuk qoldirmaslik."
    ],
    "quality_control": "Bosim nasosi bilan 10 bar bosim beriladi va 24 soat davomida bosim tushishi tekshiriladi (ruxsat etilgan og‘ish 0.1 bar dan oshmasligi kerak).",
    "materials": [
      "Tikilgan polietilen (PEX) yoki PP-R quvurlar",
      "Press-fitinglar",
      "Kollektorlar",
      "Shovqinsiz kanalizatsiya quvurlari (Ostendorf)",
      "Issiqlik izolyatsiyasi (Energofleks)"
    ],
    "tools": [
      "Gidravlik opressovshik",
      "Press-qisqichlar (PEX uchun)",
      "Quvur kesgich",
      "Lazerli burchak o‘lchagich",
      "Kalitlar to‘plami"
    ],
    "checklist": [
      {
        "text": "Kanalizatsiya nishabliklari lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Issiq chapda, sovuq o‘ngda qoidasiga amal qilindi",
        "required": true
      },
      {
        "text": "Opressovka 10 bar ostida 24 soat ushlab turildi",
        "required": true
      },
      {
        "text": "Quvurlar issiqlik izolyatsiyasiga o‘raldi",
        "required": true
      }
    ],
    "related_topics": [
      "Sovuq suv quvurlari",
      "Kanalizatsiya quvurlari",
      "Bosim va germetiklikni tekshirish"
    ],
    "order_index": 10,
    "is_published": true,
    "id": 62
  },
  {
    "category_id": 5,
    "category_code": "05",
    "category_slug": "05-santexnika-va-kanalizatsiya",
    "category_title": "Santexnika va kanalizatsiya",
    "category_icon": "🚰",
    "slug": "05-gigiyenik-dush",
    "title": "Gigiyenik dush",
    "short_description": "Gigiyenik dush — suv ta'minoti va kanalizatsiyaning xavfsiz, oqishlarsiz, gidrozarbalarsiz va uzoq yillar xizmat qiladigan tizimi.",
    "purpose": "Toza suvni kerakli bosimda har bir nuqtaga yetkazish va chiqindi suvlarni shovqinsiz va hid tarqalmasdan chiqarib yuborish.",
    "when_to_do": "Devorlar tayyor bo‘lgach, pol styajkasi va gidroizolyatsiya ishlaridan oldin.",
    "before_start": "Aniq santexnika moslamalari o‘lchamlari va ularning pasportlari (o‘qlari va balandliklari).",
    "step_by_step": [
      "Suv kirish tugunini yig‘ish: kran, qaytarilmas klapan, loy tozalovchi, hisoblagich, reduktor va 100 mkm filtr.",
      "Kollektorli (nurli) yoki ketma-ket tarqatish tizimini devor ichiga joylash.",
      "Kanalizatsiya quvurlarini qat'iy nishablik (gradus) bilan yotqizish.",
      "Suv rozetkalarini (vodorozetka) tekis plastinkaga o‘rnatib, devor yuzasiga qotirish.",
      "Oqishga qarshi datchiklar (Gidrolok, Neptun) tizimini o‘rnatish.",
      "Tizimni kamida 10-12 bar bosim ostida oпрессовка (gidravlik sinov) qilish."
    ],
    "rules": [
      "Kanalizatsiya qiyaligi: d50 mm quvur uchun 1 metrga 3 sm, d110 mm quvur uchun 1 metrga 2 sm bo‘lishi shart.",
      "Sovuq suv doimo o‘ngda, issiq suv esa chapda joylashtiriladi.",
      "Bosimni kamaytiruvchi reduktor bosimni 3-3.5 bar darajasida barqarorlashtirishi zarur."
    ],
    "important_notes": "Barcha yashirin ulanmalar (devor yoki pol ichida) faqat press-fiting yoki payvandlangan polipropilen bo‘lishi lozim, rezbali ulanmalarni devor ichiga ko‘mish qat'iyan taqiqlanadi.",
    "common_mistakes": [
      "Kanalizatsiya nishabligini haddan tashqari tik yoki teskari qilib qo‘yish (tiqilib qolishga olib keladi).",
      "Gidravlik sinov o‘tkazmasdan turib quvurlarni betonlab yuborish.",
      "Kollektor tuguniga xizmat ko‘rsatish uchun revizion lyuk qoldirmaslik."
    ],
    "quality_control": "Bosim nasosi bilan 10 bar bosim beriladi va 24 soat davomida bosim tushishi tekshiriladi (ruxsat etilgan og‘ish 0.1 bar dan oshmasligi kerak).",
    "materials": [
      "Tikilgan polietilen (PEX) yoki PP-R quvurlar",
      "Press-fitinglar",
      "Kollektorlar",
      "Shovqinsiz kanalizatsiya quvurlari (Ostendorf)",
      "Issiqlik izolyatsiyasi (Energofleks)"
    ],
    "tools": [
      "Gidravlik opressovshik",
      "Press-qisqichlar (PEX uchun)",
      "Quvur kesgich",
      "Lazerli burchak o‘lchagich",
      "Kalitlar to‘plami"
    ],
    "checklist": [
      {
        "text": "Kanalizatsiya nishabliklari lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Issiq chapda, sovuq o‘ngda qoidasiga amal qilindi",
        "required": true
      },
      {
        "text": "Opressovka 10 bar ostida 24 soat ushlab turildi",
        "required": true
      },
      {
        "text": "Quvurlar issiqlik izolyatsiyasiga o‘raldi",
        "required": true
      }
    ],
    "related_topics": [
      "Sovuq suv quvurlari",
      "Kanalizatsiya quvurlari",
      "Bosim va germetiklikni tekshirish"
    ],
    "order_index": 11,
    "is_published": true,
    "id": 63
  },
  {
    "category_id": 5,
    "category_code": "05",
    "category_slug": "05-santexnika-va-kanalizatsiya",
    "category_title": "Santexnika va kanalizatsiya",
    "category_icon": "🚰",
    "slug": "05-kir-yuvish-mashinasi",
    "title": "Kir yuvish mashinasi",
    "short_description": "Kir yuvish mashinasi — suv ta'minoti va kanalizatsiyaning xavfsiz, oqishlarsiz, gidrozarbalarsiz va uzoq yillar xizmat qiladigan tizimi.",
    "purpose": "Toza suvni kerakli bosimda har bir nuqtaga yetkazish va chiqindi suvlarni shovqinsiz va hid tarqalmasdan chiqarib yuborish.",
    "when_to_do": "Devorlar tayyor bo‘lgach, pol styajkasi va gidroizolyatsiya ishlaridan oldin.",
    "before_start": "Aniq santexnika moslamalari o‘lchamlari va ularning pasportlari (o‘qlari va balandliklari).",
    "step_by_step": [
      "Suv kirish tugunini yig‘ish: kran, qaytarilmas klapan, loy tozalovchi, hisoblagich, reduktor va 100 mkm filtr.",
      "Kollektorli (nurli) yoki ketma-ket tarqatish tizimini devor ichiga joylash.",
      "Kanalizatsiya quvurlarini qat'iy nishablik (gradus) bilan yotqizish.",
      "Suv rozetkalarini (vodorozetka) tekis plastinkaga o‘rnatib, devor yuzasiga qotirish.",
      "Oqishga qarshi datchiklar (Gidrolok, Neptun) tizimini o‘rnatish.",
      "Tizimni kamida 10-12 bar bosim ostida oпрессовка (gidravlik sinov) qilish."
    ],
    "rules": [
      "Kanalizatsiya qiyaligi: d50 mm quvur uchun 1 metrga 3 sm, d110 mm quvur uchun 1 metrga 2 sm bo‘lishi shart.",
      "Sovuq suv doimo o‘ngda, issiq suv esa chapda joylashtiriladi.",
      "Bosimni kamaytiruvchi reduktor bosimni 3-3.5 bar darajasida barqarorlashtirishi zarur."
    ],
    "important_notes": "Barcha yashirin ulanmalar (devor yoki pol ichida) faqat press-fiting yoki payvandlangan polipropilen bo‘lishi lozim, rezbali ulanmalarni devor ichiga ko‘mish qat'iyan taqiqlanadi.",
    "common_mistakes": [
      "Kanalizatsiya nishabligini haddan tashqari tik yoki teskari qilib qo‘yish (tiqilib qolishga olib keladi).",
      "Gidravlik sinov o‘tkazmasdan turib quvurlarni betonlab yuborish.",
      "Kollektor tuguniga xizmat ko‘rsatish uchun revizion lyuk qoldirmaslik."
    ],
    "quality_control": "Bosim nasosi bilan 10 bar bosim beriladi va 24 soat davomida bosim tushishi tekshiriladi (ruxsat etilgan og‘ish 0.1 bar dan oshmasligi kerak).",
    "materials": [
      "Tikilgan polietilen (PEX) yoki PP-R quvurlar",
      "Press-fitinglar",
      "Kollektorlar",
      "Shovqinsiz kanalizatsiya quvurlari (Ostendorf)",
      "Issiqlik izolyatsiyasi (Energofleks)"
    ],
    "tools": [
      "Gidravlik opressovshik",
      "Press-qisqichlar (PEX uchun)",
      "Quvur kesgich",
      "Lazerli burchak o‘lchagich",
      "Kalitlar to‘plami"
    ],
    "checklist": [
      {
        "text": "Kanalizatsiya nishabliklari lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Issiq chapda, sovuq o‘ngda qoidasiga amal qilindi",
        "required": true
      },
      {
        "text": "Opressovka 10 bar ostida 24 soat ushlab turildi",
        "required": true
      },
      {
        "text": "Quvurlar issiqlik izolyatsiyasiga o‘raldi",
        "required": true
      }
    ],
    "related_topics": [
      "Sovuq suv quvurlari",
      "Kanalizatsiya quvurlari",
      "Bosim va germetiklikni tekshirish"
    ],
    "order_index": 12,
    "is_published": true,
    "id": 64
  },
  {
    "category_id": 5,
    "category_code": "05",
    "category_slug": "05-santexnika-va-kanalizatsiya",
    "category_title": "Santexnika va kanalizatsiya",
    "category_icon": "🚰",
    "slug": "05-idish-yuvish-mashinasi",
    "title": "Idish yuvish mashinasi",
    "short_description": "Idish yuvish mashinasi — suv ta'minoti va kanalizatsiyaning xavfsiz, oqishlarsiz, gidrozarbalarsiz va uzoq yillar xizmat qiladigan tizimi.",
    "purpose": "Toza suvni kerakli bosimda har bir nuqtaga yetkazish va chiqindi suvlarni shovqinsiz va hid tarqalmasdan chiqarib yuborish.",
    "when_to_do": "Devorlar tayyor bo‘lgach, pol styajkasi va gidroizolyatsiya ishlaridan oldin.",
    "before_start": "Aniq santexnika moslamalari o‘lchamlari va ularning pasportlari (o‘qlari va balandliklari).",
    "step_by_step": [
      "Suv kirish tugunini yig‘ish: kran, qaytarilmas klapan, loy tozalovchi, hisoblagich, reduktor va 100 mkm filtr.",
      "Kollektorli (nurli) yoki ketma-ket tarqatish tizimini devor ichiga joylash.",
      "Kanalizatsiya quvurlarini qat'iy nishablik (gradus) bilan yotqizish.",
      "Suv rozetkalarini (vodorozetka) tekis plastinkaga o‘rnatib, devor yuzasiga qotirish.",
      "Oqishga qarshi datchiklar (Gidrolok, Neptun) tizimini o‘rnatish.",
      "Tizimni kamida 10-12 bar bosim ostida oпрессовка (gidravlik sinov) qilish."
    ],
    "rules": [
      "Kanalizatsiya qiyaligi: d50 mm quvur uchun 1 metrga 3 sm, d110 mm quvur uchun 1 metrga 2 sm bo‘lishi shart.",
      "Sovuq suv doimo o‘ngda, issiq suv esa chapda joylashtiriladi.",
      "Bosimni kamaytiruvchi reduktor bosimni 3-3.5 bar darajasida barqarorlashtirishi zarur."
    ],
    "important_notes": "Barcha yashirin ulanmalar (devor yoki pol ichida) faqat press-fiting yoki payvandlangan polipropilen bo‘lishi lozim, rezbali ulanmalarni devor ichiga ko‘mish qat'iyan taqiqlanadi.",
    "common_mistakes": [
      "Kanalizatsiya nishabligini haddan tashqari tik yoki teskari qilib qo‘yish (tiqilib qolishga olib keladi).",
      "Gidravlik sinov o‘tkazmasdan turib quvurlarni betonlab yuborish.",
      "Kollektor tuguniga xizmat ko‘rsatish uchun revizion lyuk qoldirmaslik."
    ],
    "quality_control": "Bosim nasosi bilan 10 bar bosim beriladi va 24 soat davomida bosim tushishi tekshiriladi (ruxsat etilgan og‘ish 0.1 bar dan oshmasligi kerak).",
    "materials": [
      "Tikilgan polietilen (PEX) yoki PP-R quvurlar",
      "Press-fitinglar",
      "Kollektorlar",
      "Shovqinsiz kanalizatsiya quvurlari (Ostendorf)",
      "Issiqlik izolyatsiyasi (Energofleks)"
    ],
    "tools": [
      "Gidravlik opressovshik",
      "Press-qisqichlar (PEX uchun)",
      "Quvur kesgich",
      "Lazerli burchak o‘lchagich",
      "Kalitlar to‘plami"
    ],
    "checklist": [
      {
        "text": "Kanalizatsiya nishabliklari lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Issiq chapda, sovuq o‘ngda qoidasiga amal qilindi",
        "required": true
      },
      {
        "text": "Opressovka 10 bar ostida 24 soat ushlab turildi",
        "required": true
      },
      {
        "text": "Quvurlar issiqlik izolyatsiyasiga o‘raldi",
        "required": true
      }
    ],
    "related_topics": [
      "Sovuq suv quvurlari",
      "Kanalizatsiya quvurlari",
      "Bosim va germetiklikni tekshirish"
    ],
    "order_index": 13,
    "is_published": true,
    "id": 65
  },
  {
    "category_id": 5,
    "category_code": "05",
    "category_slug": "05-santexnika-va-kanalizatsiya",
    "category_title": "Santexnika va kanalizatsiya",
    "category_icon": "🚰",
    "slug": "05-oshxona-rakovinasi",
    "title": "Oshxona rakovinasi",
    "short_description": "Oshxona rakovinasi — suv ta'minoti va kanalizatsiyaning xavfsiz, oqishlarsiz, gidrozarbalarsiz va uzoq yillar xizmat qiladigan tizimi.",
    "purpose": "Toza suvni kerakli bosimda har bir nuqtaga yetkazish va chiqindi suvlarni shovqinsiz va hid tarqalmasdan chiqarib yuborish.",
    "when_to_do": "Devorlar tayyor bo‘lgach, pol styajkasi va gidroizolyatsiya ishlaridan oldin.",
    "before_start": "Aniq santexnika moslamalari o‘lchamlari va ularning pasportlari (o‘qlari va balandliklari).",
    "step_by_step": [
      "Suv kirish tugunini yig‘ish: kran, qaytarilmas klapan, loy tozalovchi, hisoblagich, reduktor va 100 mkm filtr.",
      "Kollektorli (nurli) yoki ketma-ket tarqatish tizimini devor ichiga joylash.",
      "Kanalizatsiya quvurlarini qat'iy nishablik (gradus) bilan yotqizish.",
      "Suv rozetkalarini (vodorozetka) tekis plastinkaga o‘rnatib, devor yuzasiga qotirish.",
      "Oqishga qarshi datchiklar (Gidrolok, Neptun) tizimini o‘rnatish.",
      "Tizimni kamida 10-12 bar bosim ostida oпрессовка (gidravlik sinov) qilish."
    ],
    "rules": [
      "Kanalizatsiya qiyaligi: d50 mm quvur uchun 1 metrga 3 sm, d110 mm quvur uchun 1 metrga 2 sm bo‘lishi shart.",
      "Sovuq suv doimo o‘ngda, issiq suv esa chapda joylashtiriladi.",
      "Bosimni kamaytiruvchi reduktor bosimni 3-3.5 bar darajasida barqarorlashtirishi zarur."
    ],
    "important_notes": "Barcha yashirin ulanmalar (devor yoki pol ichida) faqat press-fiting yoki payvandlangan polipropilen bo‘lishi lozim, rezbali ulanmalarni devor ichiga ko‘mish qat'iyan taqiqlanadi.",
    "common_mistakes": [
      "Kanalizatsiya nishabligini haddan tashqari tik yoki teskari qilib qo‘yish (tiqilib qolishga olib keladi).",
      "Gidravlik sinov o‘tkazmasdan turib quvurlarni betonlab yuborish.",
      "Kollektor tuguniga xizmat ko‘rsatish uchun revizion lyuk qoldirmaslik."
    ],
    "quality_control": "Bosim nasosi bilan 10 bar bosim beriladi va 24 soat davomida bosim tushishi tekshiriladi (ruxsat etilgan og‘ish 0.1 bar dan oshmasligi kerak).",
    "materials": [
      "Tikilgan polietilen (PEX) yoki PP-R quvurlar",
      "Press-fitinglar",
      "Kollektorlar",
      "Shovqinsiz kanalizatsiya quvurlari (Ostendorf)",
      "Issiqlik izolyatsiyasi (Energofleks)"
    ],
    "tools": [
      "Gidravlik opressovshik",
      "Press-qisqichlar (PEX uchun)",
      "Quvur kesgich",
      "Lazerli burchak o‘lchagich",
      "Kalitlar to‘plami"
    ],
    "checklist": [
      {
        "text": "Kanalizatsiya nishabliklari lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Issiq chapda, sovuq o‘ngda qoidasiga amal qilindi",
        "required": true
      },
      {
        "text": "Opressovka 10 bar ostida 24 soat ushlab turildi",
        "required": true
      },
      {
        "text": "Quvurlar issiqlik izolyatsiyasiga o‘raldi",
        "required": true
      }
    ],
    "related_topics": [
      "Sovuq suv quvurlari",
      "Kanalizatsiya quvurlari",
      "Bosim va germetiklikni tekshirish"
    ],
    "order_index": 14,
    "is_published": true,
    "id": 66
  },
  {
    "category_id": 5,
    "category_code": "05",
    "category_slug": "05-santexnika-va-kanalizatsiya",
    "category_title": "Santexnika va kanalizatsiya",
    "category_icon": "🚰",
    "slug": "05-suv-sizib-chiqishiga-qarshi-tizim",
    "title": "Suv sizib chiqishiga qarshi tizim",
    "short_description": "Suv sizib chiqishiga qarshi tizim — suv ta'minoti va kanalizatsiyaning xavfsiz, oqishlarsiz, gidrozarbalarsiz va uzoq yillar xizmat qiladigan tizimi.",
    "purpose": "Toza suvni kerakli bosimda har bir nuqtaga yetkazish va chiqindi suvlarni shovqinsiz va hid tarqalmasdan chiqarib yuborish.",
    "when_to_do": "Devorlar tayyor bo‘lgach, pol styajkasi va gidroizolyatsiya ishlaridan oldin.",
    "before_start": "Aniq santexnika moslamalari o‘lchamlari va ularning pasportlari (o‘qlari va balandliklari).",
    "step_by_step": [
      "Suv kirish tugunini yig‘ish: kran, qaytarilmas klapan, loy tozalovchi, hisoblagich, reduktor va 100 mkm filtr.",
      "Kollektorli (nurli) yoki ketma-ket tarqatish tizimini devor ichiga joylash.",
      "Kanalizatsiya quvurlarini qat'iy nishablik (gradus) bilan yotqizish.",
      "Suv rozetkalarini (vodorozetka) tekis plastinkaga o‘rnatib, devor yuzasiga qotirish.",
      "Oqishga qarshi datchiklar (Gidrolok, Neptun) tizimini o‘rnatish.",
      "Tizimni kamida 10-12 bar bosim ostida oпрессовка (gidravlik sinov) qilish."
    ],
    "rules": [
      "Kanalizatsiya qiyaligi: d50 mm quvur uchun 1 metrga 3 sm, d110 mm quvur uchun 1 metrga 2 sm bo‘lishi shart.",
      "Sovuq suv doimo o‘ngda, issiq suv esa chapda joylashtiriladi.",
      "Bosimni kamaytiruvchi reduktor bosimni 3-3.5 bar darajasida barqarorlashtirishi zarur."
    ],
    "important_notes": "Barcha yashirin ulanmalar (devor yoki pol ichida) faqat press-fiting yoki payvandlangan polipropilen bo‘lishi lozim, rezbali ulanmalarni devor ichiga ko‘mish qat'iyan taqiqlanadi.",
    "common_mistakes": [
      "Kanalizatsiya nishabligini haddan tashqari tik yoki teskari qilib qo‘yish (tiqilib qolishga olib keladi).",
      "Gidravlik sinov o‘tkazmasdan turib quvurlarni betonlab yuborish.",
      "Kollektor tuguniga xizmat ko‘rsatish uchun revizion lyuk qoldirmaslik."
    ],
    "quality_control": "Bosim nasosi bilan 10 bar bosim beriladi va 24 soat davomida bosim tushishi tekshiriladi (ruxsat etilgan og‘ish 0.1 bar dan oshmasligi kerak).",
    "materials": [
      "Tikilgan polietilen (PEX) yoki PP-R quvurlar",
      "Press-fitinglar",
      "Kollektorlar",
      "Shovqinsiz kanalizatsiya quvurlari (Ostendorf)",
      "Issiqlik izolyatsiyasi (Energofleks)"
    ],
    "tools": [
      "Gidravlik opressovshik",
      "Press-qisqichlar (PEX uchun)",
      "Quvur kesgich",
      "Lazerli burchak o‘lchagich",
      "Kalitlar to‘plami"
    ],
    "checklist": [
      {
        "text": "Kanalizatsiya nishabliklari lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Issiq chapda, sovuq o‘ngda qoidasiga amal qilindi",
        "required": true
      },
      {
        "text": "Opressovka 10 bar ostida 24 soat ushlab turildi",
        "required": true
      },
      {
        "text": "Quvurlar issiqlik izolyatsiyasiga o‘raldi",
        "required": true
      }
    ],
    "related_topics": [
      "Sovuq suv quvurlari",
      "Kanalizatsiya quvurlari",
      "Bosim va germetiklikni tekshirish"
    ],
    "order_index": 15,
    "is_published": true,
    "id": 67
  },
  {
    "category_id": 5,
    "category_code": "05",
    "category_slug": "05-santexnika-va-kanalizatsiya",
    "category_title": "Santexnika va kanalizatsiya",
    "category_icon": "🚰",
    "slug": "05-bosim-va-germetiklikni-tekshirish",
    "title": "Bosim va germetiklikni tekshirish",
    "short_description": "Bosim va germetiklikni tekshirish — suv ta'minoti va kanalizatsiyaning xavfsiz, oqishlarsiz, gidrozarbalarsiz va uzoq yillar xizmat qiladigan tizimi.",
    "purpose": "Toza suvni kerakli bosimda har bir nuqtaga yetkazish va chiqindi suvlarni shovqinsiz va hid tarqalmasdan chiqarib yuborish.",
    "when_to_do": "Devorlar tayyor bo‘lgach, pol styajkasi va gidroizolyatsiya ishlaridan oldin.",
    "before_start": "Aniq santexnika moslamalari o‘lchamlari va ularning pasportlari (o‘qlari va balandliklari).",
    "step_by_step": [
      "Suv kirish tugunini yig‘ish: kran, qaytarilmas klapan, loy tozalovchi, hisoblagich, reduktor va 100 mkm filtr.",
      "Kollektorli (nurli) yoki ketma-ket tarqatish tizimini devor ichiga joylash.",
      "Kanalizatsiya quvurlarini qat'iy nishablik (gradus) bilan yotqizish.",
      "Suv rozetkalarini (vodorozetka) tekis plastinkaga o‘rnatib, devor yuzasiga qotirish.",
      "Oqishga qarshi datchiklar (Gidrolok, Neptun) tizimini o‘rnatish.",
      "Tizimni kamida 10-12 bar bosim ostida oпрессовка (gidravlik sinov) qilish."
    ],
    "rules": [
      "Kanalizatsiya qiyaligi: d50 mm quvur uchun 1 metrga 3 sm, d110 mm quvur uchun 1 metrga 2 sm bo‘lishi shart.",
      "Sovuq suv doimo o‘ngda, issiq suv esa chapda joylashtiriladi.",
      "Bosimni kamaytiruvchi reduktor bosimni 3-3.5 bar darajasida barqarorlashtirishi zarur."
    ],
    "important_notes": "Barcha yashirin ulanmalar (devor yoki pol ichida) faqat press-fiting yoki payvandlangan polipropilen bo‘lishi lozim, rezbali ulanmalarni devor ichiga ko‘mish qat'iyan taqiqlanadi.",
    "common_mistakes": [
      "Kanalizatsiya nishabligini haddan tashqari tik yoki teskari qilib qo‘yish (tiqilib qolishga olib keladi).",
      "Gidravlik sinov o‘tkazmasdan turib quvurlarni betonlab yuborish.",
      "Kollektor tuguniga xizmat ko‘rsatish uchun revizion lyuk qoldirmaslik."
    ],
    "quality_control": "Bosim nasosi bilan 10 bar bosim beriladi va 24 soat davomida bosim tushishi tekshiriladi (ruxsat etilgan og‘ish 0.1 bar dan oshmasligi kerak).",
    "materials": [
      "Tikilgan polietilen (PEX) yoki PP-R quvurlar",
      "Press-fitinglar",
      "Kollektorlar",
      "Shovqinsiz kanalizatsiya quvurlari (Ostendorf)",
      "Issiqlik izolyatsiyasi (Energofleks)"
    ],
    "tools": [
      "Gidravlik opressovshik",
      "Press-qisqichlar (PEX uchun)",
      "Quvur kesgich",
      "Lazerli burchak o‘lchagich",
      "Kalitlar to‘plami"
    ],
    "checklist": [
      {
        "text": "Kanalizatsiya nishabliklari lazerda tekshirildi",
        "required": true
      },
      {
        "text": "Issiq chapda, sovuq o‘ngda qoidasiga amal qilindi",
        "required": true
      },
      {
        "text": "Opressovka 10 bar ostida 24 soat ushlab turildi",
        "required": true
      },
      {
        "text": "Quvurlar issiqlik izolyatsiyasiga o‘raldi",
        "required": true
      }
    ],
    "related_topics": [
      "Sovuq suv quvurlari",
      "Kanalizatsiya quvurlari",
      "Bosim va germetiklikni tekshirish"
    ],
    "order_index": 16,
    "is_published": true,
    "id": 68
  },
  {
    "category_id": 6,
    "category_code": "06",
    "category_slug": "06-klimat-va-ventilyatsiya",
    "category_title": "Klimat va ventilyatsiya",
    "category_icon": "❄️",
    "slug": "06-konditsioner-joylarini-belgilash",
    "title": "Konditsioner joylarini belgilash",
    "short_description": "Konditsioner joylarini belgilash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Klimat va ventilyatsiya",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 69
  },
  {
    "category_id": 6,
    "category_code": "06",
    "category_slug": "06-klimat-va-ventilyatsiya",
    "category_title": "Klimat va ventilyatsiya",
    "category_icon": "❄️",
    "slug": "06-tashqi-blok-joylashuvi",
    "title": "Tashqi blok joylashuvi",
    "short_description": "Tashqi blok joylashuvi — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Klimat va ventilyatsiya",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 70
  },
  {
    "category_id": 6,
    "category_code": "06",
    "category_slug": "06-klimat-va-ventilyatsiya",
    "category_title": "Klimat va ventilyatsiya",
    "category_icon": "❄️",
    "slug": "06-freon-trassalari",
    "title": "Freon trassalari",
    "short_description": "Freon trassalari — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Klimat va ventilyatsiya",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 71
  },
  {
    "category_id": 6,
    "category_code": "06",
    "category_slug": "06-klimat-va-ventilyatsiya",
    "category_title": "Klimat va ventilyatsiya",
    "category_icon": "❄️",
    "slug": "06-drenaj-trassalari",
    "title": "Drenaj trassalari",
    "short_description": "Drenaj trassalari — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Klimat va ventilyatsiya",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 72
  },
  {
    "category_id": 6,
    "category_code": "06",
    "category_slug": "06-klimat-va-ventilyatsiya",
    "category_title": "Klimat va ventilyatsiya",
    "category_icon": "❄️",
    "slug": "06-ventilyatsiya-kanallari",
    "title": "Ventilyatsiya kanallari",
    "short_description": "Ventilyatsiya kanallari — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Klimat va ventilyatsiya",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 73
  },
  {
    "category_id": 6,
    "category_code": "06",
    "category_slug": "06-klimat-va-ventilyatsiya",
    "category_title": "Klimat va ventilyatsiya",
    "category_icon": "❄️",
    "slug": "06-oshxona-вытяжка-kanali",
    "title": "Oshxona вытяжка kanali",
    "short_description": "Oshxona вытяжка kanali — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Klimat va ventilyatsiya",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 6,
    "is_published": true,
    "id": 74
  },
  {
    "category_id": 6,
    "category_code": "06",
    "category_slug": "06-klimat-va-ventilyatsiya",
    "category_title": "Klimat va ventilyatsiya",
    "category_icon": "❄️",
    "slug": "06-ventilyatsiya-panjaralari",
    "title": "Ventilyatsiya panjaralari",
    "short_description": "Ventilyatsiya panjaralari — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Klimat va ventilyatsiya",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 7,
    "is_published": true,
    "id": 75
  },
  {
    "category_id": 6,
    "category_code": "06",
    "category_slug": "06-klimat-va-ventilyatsiya",
    "category_title": "Klimat va ventilyatsiya",
    "category_icon": "❄️",
    "slug": "06-tizimlarni-tekshirish",
    "title": "Tizimlarni tekshirish",
    "short_description": "Tizimlarni tekshirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Klimat va ventilyatsiya",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 8,
    "is_published": true,
    "id": 76
  },
  {
    "category_id": 7,
    "category_code": "07",
    "category_slug": "07-oyna-va-eshiklar",
    "category_title": "Oyna va eshiklar",
    "category_icon": "🚪",
    "slug": "07-oyna-bloklarini-ornatish-almashtirish",
    "title": "Oyna bloklarini o‘rnatish/almashtirish",
    "short_description": "Oyna bloklarini o‘rnatish/almashtirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Oyna va eshiklar",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 77
  },
  {
    "category_id": 7,
    "category_code": "07",
    "category_slug": "07-oyna-va-eshiklar",
    "category_title": "Oyna va eshiklar",
    "category_icon": "🚪",
    "slug": "07-oyna-откослари",
    "title": "Oyna откослари",
    "short_description": "Oyna откослари — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Oyna va eshiklar",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 78
  },
  {
    "category_id": 7,
    "category_code": "07",
    "category_slug": "07-oyna-va-eshiklar",
    "category_title": "Oyna va eshiklar",
    "category_icon": "🚪",
    "slug": "07-balkon-eshigi",
    "title": "Balkon eshigi",
    "short_description": "Balkon eshigi — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Oyna va eshiklar",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 79
  },
  {
    "category_id": 7,
    "category_code": "07",
    "category_slug": "07-oyna-va-eshiklar",
    "category_title": "Oyna va eshiklar",
    "category_icon": "🚪",
    "slug": "07-kirish-eshigi",
    "title": "Kirish eshigi",
    "short_description": "Kirish eshigi — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Oyna va eshiklar",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 80
  },
  {
    "category_id": 7,
    "category_code": "07",
    "category_slug": "07-oyna-va-eshiklar",
    "category_title": "Oyna va eshiklar",
    "category_icon": "🚪",
    "slug": "07-ichki-eshiklar-uchun-olchamlarni-tayyorlash",
    "title": "Ichki eshiklar uchun o‘lchamlarni tayyorlash",
    "short_description": "Ichki eshiklar uchun o‘lchamlarni tayyorlash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Oyna va eshiklar",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 81
  },
  {
    "category_id": 8,
    "category_code": "08",
    "category_slug": "08-polni-tayyorlash",
    "category_title": "Polni tayyorlash",
    "category_icon": "🪵",
    "slug": "08-pol-asosini-tekshirish",
    "title": "Pol asosini tekshirish",
    "short_description": "Pol asosini tekshirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Polni tayyorlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 82
  },
  {
    "category_id": 8,
    "category_code": "08",
    "category_slug": "08-polni-tayyorlash",
    "category_title": "Polni tayyorlash",
    "category_icon": "🪵",
    "slug": "08-gidroizolyatsiya-kerakli-zonalarda",
    "title": "Gidroizolyatsiya — kerakli zonalarda",
    "short_description": "Gidroizolyatsiya — kerakli zonalarda — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Polni tayyorlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 83
  },
  {
    "category_id": 8,
    "category_code": "08",
    "category_slug": "08-polni-tayyorlash",
    "category_title": "Polni tayyorlash",
    "category_icon": "🪵",
    "slug": "08-shumoizolyatsiya-kerakli-zonalarda",
    "title": "Shumoizolyatsiya — kerakli zonalarda",
    "short_description": "Shumoizolyatsiya — kerakli zonalarda — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Polni tayyorlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 84
  },
  {
    "category_id": 8,
    "category_code": "08",
    "category_slug": "08-polni-tayyorlash",
    "category_title": "Polni tayyorlash",
    "category_icon": "🪵",
    "slug": "08-issiq-pol-konturlarini-ornatish",
    "title": "Issiq pol konturlarini o‘rnatish",
    "short_description": "Issiq pol konturlarini o‘rnatish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Polni tayyorlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 85
  },
  {
    "category_id": 8,
    "category_code": "08",
    "category_slug": "08-polni-tayyorlash",
    "category_title": "Polni tayyorlash",
    "category_icon": "🪵",
    "slug": "08-polni-tekislash",
    "title": "Polni tekislash",
    "short_description": "Polni tekislash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Polni tayyorlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 86
  },
  {
    "category_id": 8,
    "category_code": "08",
    "category_slug": "08-polni-tayyorlash",
    "category_title": "Polni tayyorlash",
    "category_icon": "🪵",
    "slug": "08-стяжка",
    "title": "Стяжка",
    "short_description": "Стяжка — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Polni tayyorlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 6,
    "is_published": true,
    "id": 87
  },
  {
    "category_id": 8,
    "category_code": "08",
    "category_slug": "08-polni-tayyorlash",
    "category_title": "Polni tayyorlash",
    "category_icon": "🪵",
    "slug": "08-quritish",
    "title": "Quritish",
    "short_description": "Quritish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Polni tayyorlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 7,
    "is_published": true,
    "id": 88
  },
  {
    "category_id": 8,
    "category_code": "08",
    "category_slug": "08-polni-tayyorlash",
    "category_title": "Polni tayyorlash",
    "category_icon": "🪵",
    "slug": "08-gruntovka",
    "title": "Gruntovka",
    "short_description": "Gruntovka — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Polni tayyorlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 8,
    "is_published": true,
    "id": 89
  },
  {
    "category_id": 8,
    "category_code": "08",
    "category_slug": "08-polni-tayyorlash",
    "category_title": "Polni tayyorlash",
    "category_icon": "🪵",
    "slug": "08-pol-qoplamasi-uchun-tayyorlash",
    "title": "Pol qoplamasi uchun tayyorlash",
    "short_description": "Pol qoplamasi uchun tayyorlash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Polni tayyorlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 9,
    "is_published": true,
    "id": 90
  },
  {
    "category_id": 9,
    "category_code": "09",
    "category_slug": "09-devorlarni-qora-ishga-tayyorlash",
    "category_title": "Devorlarni qora ishga tayyorlash",
    "category_icon": "🧱",
    "slug": "09-devorlarni-gruntovkalash",
    "title": "Devorlarni gruntovkalash",
    "short_description": "Devorlarni gruntovkalash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Devorlarni qora ishga tayyorlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 91
  },
  {
    "category_id": 9,
    "category_code": "09",
    "category_slug": "09-devorlarni-qora-ishga-tayyorlash",
    "category_title": "Devorlarni qora ishga tayyorlash",
    "category_icon": "🧱",
    "slug": "09-devorlarni-маяк-boyicha-tekislash",
    "title": "Devorlarni маяк bo‘yicha tekislash",
    "short_description": "Devorlarni маяк bo‘yicha tekislash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Devorlarni qora ishga tayyorlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 92
  },
  {
    "category_id": 9,
    "category_code": "09",
    "category_slug": "09-devorlarni-qora-ishga-tayyorlash",
    "category_title": "Devorlarni qora ishga tayyorlash",
    "category_icon": "🧱",
    "slug": "09-shtukaturka",
    "title": "Shtukaturka",
    "short_description": "Shtukaturka — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Devorlarni qora ishga tayyorlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 93
  },
  {
    "category_id": 9,
    "category_code": "09",
    "category_slug": "09-devorlarni-qora-ishga-tayyorlash",
    "category_title": "Devorlarni qora ishga tayyorlash",
    "category_icon": "🧱",
    "slug": "09-quritish",
    "title": "Quritish",
    "short_description": "Quritish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Devorlarni qora ishga tayyorlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 94
  },
  {
    "category_id": 9,
    "category_code": "09",
    "category_slug": "09-devorlarni-qora-ishga-tayyorlash",
    "category_title": "Devorlarni qora ishga tayyorlash",
    "category_icon": "🧱",
    "slug": "09-qayta-gruntovka",
    "title": "Qayta gruntovka",
    "short_description": "Qayta gruntovka — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Devorlarni qora ishga tayyorlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 95
  },
  {
    "category_id": 9,
    "category_code": "09",
    "category_slug": "09-devorlarni-qora-ishga-tayyorlash",
    "category_title": "Devorlarni qora ishga tayyorlash",
    "category_icon": "🧱",
    "slug": "09-shpaklyovka",
    "title": "Shpaklyovka",
    "short_description": "Shpaklyovka — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Devorlarni qora ishga tayyorlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 6,
    "is_published": true,
    "id": 96
  },
  {
    "category_id": 9,
    "category_code": "09",
    "category_slug": "09-devorlarni-qora-ishga-tayyorlash",
    "category_title": "Devorlarni qora ishga tayyorlash",
    "category_icon": "🧱",
    "slug": "09-silliqlash",
    "title": "Silliqlash",
    "short_description": "Silliqlash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Devorlarni qora ishga tayyorlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 7,
    "is_published": true,
    "id": 97
  },
  {
    "category_id": 9,
    "category_code": "09",
    "category_slug": "09-devorlarni-qora-ishga-tayyorlash",
    "category_title": "Devorlarni qora ishga tayyorlash",
    "category_icon": "🧱",
    "slug": "09-yoriqlarni-tuzatish",
    "title": "Yoriqlarni tuzatish",
    "short_description": "Yoriqlarni tuzatish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Devorlarni qora ishga tayyorlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 8,
    "is_published": true,
    "id": 98
  },
  {
    "category_id": 9,
    "category_code": "09",
    "category_slug": "09-devorlarni-qora-ishga-tayyorlash",
    "category_title": "Devorlarni qora ishga tayyorlash",
    "category_icon": "🧱",
    "slug": "09-devorlarni-yakuniy-tekislash",
    "title": "Devorlarni yakuniy tekislash",
    "short_description": "Devorlarni yakuniy tekislash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Devorlarni qora ishga tayyorlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 9,
    "is_published": true,
    "id": 99
  },
  {
    "category_id": 10,
    "category_code": "10",
    "category_slug": "10-shift",
    "category_title": "Shift",
    "category_icon": "🏛️",
    "slug": "10-shiftni-tekislash",
    "title": "Shiftni tekislash",
    "short_description": "Shiftni tekislash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Shift",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 100
  },
  {
    "category_id": 10,
    "category_code": "10",
    "category_slug": "10-shift",
    "category_title": "Shift",
    "category_icon": "🏛️",
    "slug": "10-gipsokarton-karkas",
    "title": "Gipsokarton karkas",
    "short_description": "Gipsokarton karkas — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Shift",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 101
  },
  {
    "category_id": 10,
    "category_code": "10",
    "category_slug": "10-shift",
    "category_title": "Shift",
    "category_icon": "🏛️",
    "slug": "10-gipsokarton-ornatish",
    "title": "Gipsokarton o‘rnatish",
    "short_description": "Gipsokarton o‘rnatish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Shift",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 102
  },
  {
    "category_id": 10,
    "category_code": "10",
    "category_slug": "10-shift",
    "category_title": "Shift",
    "category_icon": "🏛️",
    "slug": "10-karniz-nisha-tenevoy-profil-konstruksiyalari",
    "title": "Karniz/nisha/tenevoy profil konstruksiyalari",
    "short_description": "Karniz/nisha/tenevoy profil konstruksiyalari — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Shift",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 103
  },
  {
    "category_id": 10,
    "category_code": "10",
    "category_slug": "10-shift",
    "category_title": "Shift",
    "category_icon": "🏛️",
    "slug": "10-yoritish-uchun-yashirin-joylar",
    "title": "Yoritish uchun yashirin joylar",
    "short_description": "Yoritish uchun yashirin joylar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Shift",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 104
  },
  {
    "category_id": 10,
    "category_code": "10",
    "category_slug": "10-shift",
    "category_title": "Shift",
    "category_icon": "🏛️",
    "slug": "10-gruntovka",
    "title": "Gruntovka",
    "short_description": "Gruntovka — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Shift",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 6,
    "is_published": true,
    "id": 105
  },
  {
    "category_id": 10,
    "category_code": "10",
    "category_slug": "10-shift",
    "category_title": "Shift",
    "category_icon": "🏛️",
    "slug": "10-shpaklyovka",
    "title": "Shpaklyovka",
    "short_description": "Shpaklyovka — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Shift",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 7,
    "is_published": true,
    "id": 106
  },
  {
    "category_id": 10,
    "category_code": "10",
    "category_slug": "10-shift",
    "category_title": "Shift",
    "category_icon": "🏛️",
    "slug": "10-silliqlash",
    "title": "Silliqlash",
    "short_description": "Silliqlash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Shift",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 8,
    "is_published": true,
    "id": 107
  },
  {
    "category_id": 10,
    "category_code": "10",
    "category_slug": "10-shift",
    "category_title": "Shift",
    "category_icon": "🏛️",
    "slug": "10-boyashga-tayyorlash",
    "title": "Bo‘yashga tayyorlash",
    "short_description": "Bo‘yashga tayyorlash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Shift",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 9,
    "is_published": true,
    "id": 108
  },
  {
    "category_id": 11,
    "category_code": "11",
    "category_slug": "11-santexnika-gidroizolyatsiya",
    "category_title": "Santexnika xonalarining gidroizolyatsiyasi",
    "category_icon": "🛡️",
    "slug": "11-polni-tayyorlash",
    "title": "Polni tayyorlash",
    "short_description": "Polni tayyorlash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Santexnika xonalarining gidroizolyatsiyasi",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 109
  },
  {
    "category_id": 11,
    "category_code": "11",
    "category_slug": "11-santexnika-gidroizolyatsiya",
    "category_title": "Santexnika xonalarining gidroizolyatsiyasi",
    "category_icon": "🛡️",
    "slug": "11-devorlarning-kerakli-qismlarini-tayyorlash",
    "title": "Devorlarning kerakli qismlarini tayyorlash",
    "short_description": "Devorlarning kerakli qismlarini tayyorlash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Santexnika xonalarining gidroizolyatsiyasi",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 110
  },
  {
    "category_id": 11,
    "category_code": "11",
    "category_slug": "11-santexnika-gidroizolyatsiya",
    "category_title": "Santexnika xonalarining gidroizolyatsiyasi",
    "category_icon": "🛡️",
    "slug": "11-gidroizolyatsiya",
    "title": "Gidroizolyatsiya",
    "short_description": "Gidroizolyatsiya — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Santexnika xonalarining gidroizolyatsiyasi",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 111
  },
  {
    "category_id": 11,
    "category_code": "11",
    "category_slug": "11-santexnika-gidroizolyatsiya",
    "category_title": "Santexnika xonalarining gidroizolyatsiyasi",
    "category_icon": "🛡️",
    "slug": "11-burchak-va-choklarni-mustahkamlash",
    "title": "Burchak va choklarni mustahkamlash",
    "short_description": "Burchak va choklarni mustahkamlash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Santexnika xonalarining gidroizolyatsiyasi",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 112
  },
  {
    "category_id": 11,
    "category_code": "11",
    "category_slug": "11-santexnika-gidroizolyatsiya",
    "category_title": "Santexnika xonalarining gidroizolyatsiyasi",
    "category_icon": "🛡️",
    "slug": "11-gidroizolyatsiya-qatlamini-tekshirish",
    "title": "Gidroizolyatsiya qatlamini tekshirish",
    "short_description": "Gidroizolyatsiya qatlamini tekshirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Santexnika xonalarining gidroizolyatsiyasi",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 113
  },
  {
    "category_id": 11,
    "category_code": "11",
    "category_slug": "11-santexnika-gidroizolyatsiya",
    "category_title": "Santexnika xonalarining gidroizolyatsiyasi",
    "category_icon": "🛡️",
    "slug": "11-plitka-uchun-asos-tayyorlash",
    "title": "Plitka uchun asos tayyorlash",
    "short_description": "Plitka uchun asos tayyorlash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Santexnika xonalarining gidroizolyatsiyasi",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 6,
    "is_published": true,
    "id": 114
  },
  {
    "category_id": 12,
    "category_code": "12",
    "category_slug": "12-keramik-plitka",
    "category_title": "Keramik plitka",
    "category_icon": "🟧",
    "slug": "12-plitka-sxemasini-tekshirish",
    "title": "Plitka sxemasini tekshirish",
    "short_description": "Plitka sxemasini tekshirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Keramik plitka",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 115
  },
  {
    "category_id": 12,
    "category_code": "12",
    "category_slug": "12-keramik-plitka",
    "category_title": "Keramik plitka",
    "category_icon": "🟧",
    "slug": "12-oqlarni-belgilash",
    "title": "O‘qlarni belgilash",
    "short_description": "O‘qlarni belgilash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Keramik plitka",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 116
  },
  {
    "category_id": 12,
    "category_code": "12",
    "category_slug": "12-keramik-plitka",
    "category_title": "Keramik plitka",
    "category_icon": "🟧",
    "slug": "12-devor-plitkasini-yotqizish",
    "title": "Devor plitkasini yotqizish",
    "short_description": "Devor plitkasini yotqizish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Keramik plitka",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 117
  },
  {
    "category_id": 12,
    "category_code": "12",
    "category_slug": "12-keramik-plitka",
    "category_title": "Keramik plitka",
    "category_icon": "🟧",
    "slug": "12-pol-plitkasini-yotqizish",
    "title": "Pol plitkasini yotqizish",
    "short_description": "Pol plitkasini yotqizish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Keramik plitka",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 118
  },
  {
    "category_id": 12,
    "category_code": "12",
    "category_slug": "12-keramik-plitka",
    "category_title": "Keramik plitka",
    "category_icon": "🟧",
    "slug": "12-dekor-nisha-profil",
    "title": "Dekor/nisha/profil",
    "short_description": "Dekor/nisha/profil — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Keramik plitka",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 119
  },
  {
    "category_id": 12,
    "category_code": "12",
    "category_slug": "12-keramik-plitka",
    "category_title": "Keramik plitka",
    "category_icon": "🟧",
    "slug": "12-tashqi-va-ichki-burchaklar",
    "title": "Tashqi va ichki burchaklar",
    "short_description": "Tashqi va ichki burchaklar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Keramik plitka",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 6,
    "is_published": true,
    "id": 120
  },
  {
    "category_id": 12,
    "category_code": "12",
    "category_slug": "12-keramik-plitka",
    "category_title": "Keramik plitka",
    "category_icon": "🟧",
    "slug": "12-choklarni-toldirish",
    "title": "Choklarni to‘ldirish",
    "short_description": "Choklarni to‘ldirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Keramik plitka",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 7,
    "is_published": true,
    "id": 121
  },
  {
    "category_id": 12,
    "category_code": "12",
    "category_slug": "12-keramik-plitka",
    "category_title": "Keramik plitka",
    "category_icon": "🟧",
    "slug": "12-silikon-choklar",
    "title": "Silikon choklar",
    "short_description": "Silikon choklar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Keramik plitka",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 8,
    "is_published": true,
    "id": 122
  },
  {
    "category_id": 12,
    "category_code": "12",
    "category_slug": "12-keramik-plitka",
    "category_title": "Keramik plitka",
    "category_icon": "🟧",
    "slug": "12-plitkani-tozalash",
    "title": "Plitkani tozalash",
    "short_description": "Plitkani tozalash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Keramik plitka",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 9,
    "is_published": true,
    "id": 123
  },
  {
    "category_id": 13,
    "category_code": "13",
    "category_slug": "13-shpaklyovka-va-boyoq",
    "category_title": "Shpaklyovka va bo‘yoq",
    "category_icon": "🎨",
    "slug": "13-devor-yakuniy-shpaklyovkasi",
    "title": "Devor yakuniy shpaklyovkasi",
    "short_description": "Devor yakuniy shpaklyovkasi — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Shpaklyovka va bo‘yoq",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 124
  },
  {
    "category_id": 13,
    "category_code": "13",
    "category_slug": "13-shpaklyovka-va-boyoq",
    "category_title": "Shpaklyovka va bo‘yoq",
    "category_icon": "🎨",
    "slug": "13-silliqlash",
    "title": "Silliqlash",
    "short_description": "Silliqlash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Shpaklyovka va bo‘yoq",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 125
  },
  {
    "category_id": 13,
    "category_code": "13",
    "category_slug": "13-shpaklyovka-va-boyoq",
    "category_title": "Shpaklyovka va bo‘yoq",
    "category_icon": "🎨",
    "slug": "13-gruntovka",
    "title": "Gruntovka",
    "short_description": "Gruntovka — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Shpaklyovka va bo‘yoq",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 126
  },
  {
    "category_id": 13,
    "category_code": "13",
    "category_slug": "13-shpaklyovka-va-boyoq",
    "category_title": "Shpaklyovka va bo‘yoq",
    "category_icon": "🎨",
    "slug": "13-boyoqning-birinchi-qatlami",
    "title": "Bo‘yoqning birinchi qatlami",
    "short_description": "Bo‘yoqning birinchi qatlami — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Shpaklyovka va bo‘yoq",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 127
  },
  {
    "category_id": 13,
    "category_code": "13",
    "category_slug": "13-shpaklyovka-va-boyoq",
    "category_title": "Shpaklyovka va bo‘yoq",
    "category_icon": "🎨",
    "slug": "13-nuqsonlarni-tekshirish",
    "title": "Nuqsonlarni tekshirish",
    "short_description": "Nuqsonlarni tekshirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Shpaklyovka va bo‘yoq",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 128
  },
  {
    "category_id": 13,
    "category_code": "13",
    "category_slug": "13-shpaklyovka-va-boyoq",
    "category_title": "Shpaklyovka va bo‘yoq",
    "category_icon": "🎨",
    "slug": "13-boyoqning-ikkinchi-qatlami",
    "title": "Bo‘yoqning ikkinchi qatlami",
    "short_description": "Bo‘yoqning ikkinchi qatlami — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Shpaklyovka va bo‘yoq",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 6,
    "is_published": true,
    "id": 129
  },
  {
    "category_id": 13,
    "category_code": "13",
    "category_slug": "13-shpaklyovka-va-boyoq",
    "category_title": "Shpaklyovka va bo‘yoq",
    "category_icon": "🎨",
    "slug": "13-yakuniy-vizual-nazorat",
    "title": "Yakuniy vizual nazorat",
    "short_description": "Yakuniy vizual nazorat — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Shpaklyovka va bo‘yoq",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 7,
    "is_published": true,
    "id": 130
  },
  {
    "category_id": 14,
    "category_code": "14",
    "category_slug": "14-pol-qoplamalari",
    "category_title": "Pol qoplamalari",
    "category_icon": "🪵",
    "slug": "14-laminat",
    "title": "Laminat",
    "short_description": "Laminat — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Pol qoplamalari",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 131
  },
  {
    "category_id": 14,
    "category_code": "14",
    "category_slug": "14-pol-qoplamalari",
    "category_title": "Pol qoplamalari",
    "category_icon": "🪵",
    "slug": "14-parket",
    "title": "Parket",
    "short_description": "Parket — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Pol qoplamalari",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 132
  },
  {
    "category_id": 14,
    "category_code": "14",
    "category_slug": "14-pol-qoplamalari",
    "category_title": "Pol qoplamalari",
    "category_icon": "🪵",
    "slug": "14-vinil-spc",
    "title": "Vinil/SPC",
    "short_description": "Vinil/SPC — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Pol qoplamalari",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 133
  },
  {
    "category_id": 14,
    "category_code": "14",
    "category_slug": "14-pol-qoplamalari",
    "category_title": "Pol qoplamalari",
    "category_icon": "🪵",
    "slug": "14-linoleum-loyiha-boyicha",
    "title": "Linoleum — loyiha bo‘yicha",
    "short_description": "Linoleum — loyiha bo‘yicha — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Pol qoplamalari",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 134
  },
  {
    "category_id": 14,
    "category_code": "14",
    "category_slug": "14-pol-qoplamalari",
    "category_title": "Pol qoplamalari",
    "category_icon": "🪵",
    "slug": "14-plintus",
    "title": "Plintus",
    "short_description": "Plintus — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Pol qoplamalari",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 135
  },
  {
    "category_id": 14,
    "category_code": "14",
    "category_slug": "14-pol-qoplamalari",
    "category_title": "Pol qoplamalari",
    "category_icon": "🪵",
    "slug": "14-tenevoy-profil",
    "title": "Tenevoy profil",
    "short_description": "Tenevoy profil — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Pol qoplamalari",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 6,
    "is_published": true,
    "id": 136
  },
  {
    "category_id": 14,
    "category_code": "14",
    "category_slug": "14-pol-qoplamalari",
    "category_title": "Pol qoplamalari",
    "category_icon": "🪵",
    "slug": "14-deformatsion-choklar",
    "title": "Deformatsion choklar",
    "short_description": "Deformatsion choklar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Pol qoplamalari",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 7,
    "is_published": true,
    "id": 137
  },
  {
    "category_id": 14,
    "category_code": "14",
    "category_slug": "14-pol-qoplamalari",
    "category_title": "Pol qoplamalari",
    "category_icon": "🪵",
    "slug": "14-polni-yakuniy-tekshirish",
    "title": "Polni yakuniy tekshirish",
    "short_description": "Polni yakuniy tekshirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Pol qoplamalari",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 8,
    "is_published": true,
    "id": 138
  },
  {
    "category_id": 15,
    "category_code": "15",
    "category_slug": "15-ichki-eshiklar",
    "category_title": "Ichki eshiklar",
    "category_icon": "🚪",
    "slug": "15-eshik-bloklarini-ornatish",
    "title": "Eshik bloklarini o‘rnatish",
    "short_description": "Eshik bloklarini o‘rnatish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Ichki eshiklar",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 139
  },
  {
    "category_id": 15,
    "category_code": "15",
    "category_slug": "15-ichki-eshiklar",
    "category_title": "Ichki eshiklar",
    "category_icon": "🚪",
    "slug": "15-korobka",
    "title": "Korobka",
    "short_description": "Korobka — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Ichki eshiklar",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 140
  },
  {
    "category_id": 15,
    "category_code": "15",
    "category_slug": "15-ichki-eshiklar",
    "category_title": "Ichki eshiklar",
    "category_icon": "🚪",
    "slug": "15-polotno",
    "title": "Polotno",
    "short_description": "Polotno — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Ichki eshiklar",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 141
  },
  {
    "category_id": 15,
    "category_code": "15",
    "category_slug": "15-ichki-eshiklar",
    "category_title": "Ichki eshiklar",
    "category_icon": "🚪",
    "slug": "15-nalichnik",
    "title": "Nalichnik",
    "short_description": "Nalichnik — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Ichki eshiklar",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 142
  },
  {
    "category_id": 15,
    "category_code": "15",
    "category_slug": "15-ichki-eshiklar",
    "category_title": "Ichki eshiklar",
    "category_icon": "🚪",
    "slug": "15-furnitura",
    "title": "Furnitura",
    "short_description": "Furnitura — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Ichki eshiklar",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 143
  },
  {
    "category_id": 15,
    "category_code": "15",
    "category_slug": "15-ichki-eshiklar",
    "category_title": "Ichki eshiklar",
    "category_icon": "🚪",
    "slug": "15-eshiklarni-sozlash",
    "title": "Eshiklarni sozlash",
    "short_description": "Eshiklarni sozlash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Ichki eshiklar",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 6,
    "is_published": true,
    "id": 144
  },
  {
    "category_id": 16,
    "category_code": "16",
    "category_slug": "16-oshxona-va-builtin-mebel",
    "category_title": "Oshxona va built-in mebel",
    "category_icon": "🍳",
    "slug": "16-oshxona-olchovini-olish",
    "title": "Oshxona o‘lchovini olish",
    "short_description": "Oshxona o‘lchovini olish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Oshxona va built-in mebel",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 145
  },
  {
    "category_id": 16,
    "category_code": "16",
    "category_slug": "16-oshxona-va-builtin-mebel",
    "category_title": "Oshxona va built-in mebel",
    "category_icon": "🍳",
    "slug": "16-korpuslarni-ornatish",
    "title": "Korpuslarni o‘rnatish",
    "short_description": "Korpuslarni o‘rnatish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Oshxona va built-in mebel",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 146
  },
  {
    "category_id": 16,
    "category_code": "16",
    "category_slug": "16-oshxona-va-builtin-mebel",
    "category_title": "Oshxona va built-in mebel",
    "category_icon": "🍳",
    "slug": "16-fasadlar",
    "title": "Fasadlar",
    "short_description": "Fasadlar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Oshxona va built-in mebel",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 147
  },
  {
    "category_id": 16,
    "category_code": "16",
    "category_slug": "16-oshxona-va-builtin-mebel",
    "category_title": "Oshxona va built-in mebel",
    "category_icon": "🍳",
    "slug": "16-stoleshnitsa",
    "title": "Stoleshnitsa",
    "short_description": "Stoleshnitsa — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Oshxona va built-in mebel",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 148
  },
  {
    "category_id": 16,
    "category_code": "16",
    "category_slug": "16-oshxona-va-builtin-mebel",
    "category_title": "Oshxona va built-in mebel",
    "category_icon": "🍳",
    "slug": "16-fartuk",
    "title": "Fartuk",
    "short_description": "Fartuk — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Oshxona va built-in mebel",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 149
  },
  {
    "category_id": 16,
    "category_code": "16",
    "category_slug": "16-oshxona-va-builtin-mebel",
    "category_title": "Oshxona va built-in mebel",
    "category_icon": "🍳",
    "slug": "16-rakovina",
    "title": "Rakovina",
    "short_description": "Rakovina — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Oshxona va built-in mebel",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 6,
    "is_published": true,
    "id": 150
  },
  {
    "category_id": 16,
    "category_code": "16",
    "category_slug": "16-oshxona-va-builtin-mebel",
    "category_title": "Oshxona va built-in mebel",
    "category_icon": "🍳",
    "slug": "16-aralashgich",
    "title": "Aralashgich",
    "short_description": "Aralashgich — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Oshxona va built-in mebel",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 7,
    "is_published": true,
    "id": 151
  },
  {
    "category_id": 16,
    "category_code": "16",
    "category_slug": "16-oshxona-va-builtin-mebel",
    "category_title": "Oshxona va built-in mebel",
    "category_icon": "🍳",
    "slug": "16-built-in-texnika",
    "title": "Built-in texnika",
    "short_description": "Built-in texnika — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Oshxona va built-in mebel",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 8,
    "is_published": true,
    "id": 152
  },
  {
    "category_id": 16,
    "category_code": "16",
    "category_slug": "16-oshxona-va-builtin-mebel",
    "category_title": "Oshxona va built-in mebel",
    "category_icon": "🍳",
    "slug": "16-garderoblar",
    "title": "Garderoblar",
    "short_description": "Garderoblar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Oshxona va built-in mebel",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 9,
    "is_published": true,
    "id": 153
  },
  {
    "category_id": 16,
    "category_code": "16",
    "category_slug": "16-oshxona-va-builtin-mebel",
    "category_title": "Oshxona va built-in mebel",
    "category_icon": "🍳",
    "slug": "16-tv-zonasi",
    "title": "TV zonasi",
    "short_description": "TV zonasi — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Oshxona va built-in mebel",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 10,
    "is_published": true,
    "id": 154
  },
  {
    "category_id": 16,
    "category_code": "16",
    "category_slug": "16-oshxona-va-builtin-mebel",
    "category_title": "Oshxona va built-in mebel",
    "category_icon": "🍳",
    "slug": "16-boshqa-custom-mebellar",
    "title": "Boshqa custom mebellar",
    "short_description": "Boshqa custom mebellar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Oshxona va built-in mebel",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 11,
    "is_published": true,
    "id": 155
  },
  {
    "category_id": 17,
    "category_code": "17",
    "category_slug": "17-sanitary-jihozlar",
    "category_title": "Sanitary jihozlar",
    "category_icon": "🛁",
    "slug": "17-unitaz",
    "title": "Unitaz",
    "short_description": "Unitaz — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Sanitary jihozlar",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 156
  },
  {
    "category_id": 17,
    "category_code": "17",
    "category_slug": "17-sanitary-jihozlar",
    "category_title": "Sanitary jihozlar",
    "category_icon": "🛁",
    "slug": "17-rakovina",
    "title": "Rakovina",
    "short_description": "Rakovina — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Sanitary jihozlar",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 157
  },
  {
    "category_id": 17,
    "category_code": "17",
    "category_slug": "17-sanitary-jihozlar",
    "category_title": "Sanitary jihozlar",
    "category_icon": "🛁",
    "slug": "17-aralashgichlar",
    "title": "Aralashgichlar",
    "short_description": "Aralashgichlar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Sanitary jihozlar",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 158
  },
  {
    "category_id": 17,
    "category_code": "17",
    "category_slug": "17-sanitary-jihozlar",
    "category_title": "Sanitary jihozlar",
    "category_icon": "🛁",
    "slug": "17-dush-tizimi",
    "title": "Dush tizimi",
    "short_description": "Dush tizimi — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Sanitary jihozlar",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 159
  },
  {
    "category_id": 17,
    "category_code": "17",
    "category_slug": "17-sanitary-jihozlar",
    "category_title": "Sanitary jihozlar",
    "category_icon": "🛁",
    "slug": "17-vanna",
    "title": "Vanna",
    "short_description": "Vanna — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Sanitary jihozlar",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 160
  },
  {
    "category_id": 17,
    "category_code": "17",
    "category_slug": "17-sanitary-jihozlar",
    "category_title": "Sanitary jihozlar",
    "category_icon": "🛁",
    "slug": "17-dush-shisha-konstruksiyasi",
    "title": "Dush shisha konstruksiyasi",
    "short_description": "Dush shisha konstruksiyasi — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Sanitary jihozlar",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 6,
    "is_published": true,
    "id": 161
  },
  {
    "category_id": 17,
    "category_code": "17",
    "category_slug": "17-sanitary-jihozlar",
    "category_title": "Sanitary jihozlar",
    "category_icon": "🛁",
    "slug": "17-gigiyenik-dush",
    "title": "Gigiyenik dush",
    "short_description": "Gigiyenik dush — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Sanitary jihozlar",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 7,
    "is_published": true,
    "id": 162
  },
  {
    "category_id": 17,
    "category_code": "17",
    "category_slug": "17-sanitary-jihozlar",
    "category_title": "Sanitary jihozlar",
    "category_icon": "🛁",
    "slug": "17-aksessuarlar",
    "title": "Aksessuarlar",
    "short_description": "Aksessuarlar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Sanitary jihozlar",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 8,
    "is_published": true,
    "id": 163
  },
  {
    "category_id": 17,
    "category_code": "17",
    "category_slug": "17-sanitary-jihozlar",
    "category_title": "Sanitary jihozlar",
    "category_icon": "🛁",
    "slug": "17-germetiklikni-tekshirish",
    "title": "Germetiklikni tekshirish",
    "short_description": "Germetiklikni tekshirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Sanitary jihozlar",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 9,
    "is_published": true,
    "id": 164
  },
  {
    "category_id": 18,
    "category_code": "18",
    "category_slug": "18-elektr-jihozlarini-yakuniy-ornatish",
    "category_title": "Elektr jihozlarini yakuniy o‘rnatish",
    "category_icon": "💡",
    "slug": "18-rozetkalar",
    "title": "Rozetkalar",
    "short_description": "Rozetkalar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Elektr jihozlarini yakuniy o‘rnatish",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 165
  },
  {
    "category_id": 18,
    "category_code": "18",
    "category_slug": "18-elektr-jihozlarini-yakuniy-ornatish",
    "category_title": "Elektr jihozlarini yakuniy o‘rnatish",
    "category_icon": "💡",
    "slug": "18-kalitlar",
    "title": "Kalitlar",
    "short_description": "Kalitlar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Elektr jihozlarini yakuniy o‘rnatish",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 166
  },
  {
    "category_id": 18,
    "category_code": "18",
    "category_slug": "18-elektr-jihozlarini-yakuniy-ornatish",
    "category_title": "Elektr jihozlarini yakuniy o‘rnatish",
    "category_icon": "💡",
    "slug": "18-dimmerlar",
    "title": "Dimmerlar",
    "short_description": "Dimmerlar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Elektr jihozlarini yakuniy o‘rnatish",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 167
  },
  {
    "category_id": 18,
    "category_code": "18",
    "category_slug": "18-elektr-jihozlarini-yakuniy-ornatish",
    "category_title": "Elektr jihozlarini yakuniy o‘rnatish",
    "category_icon": "💡",
    "slug": "18-ramkalar",
    "title": "Ramkalar",
    "short_description": "Ramkalar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Elektr jihozlarini yakuniy o‘rnatish",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 168
  },
  {
    "category_id": 18,
    "category_code": "18",
    "category_slug": "18-elektr-jihozlarini-yakuniy-ornatish",
    "category_title": "Elektr jihozlarini yakuniy o‘rnatish",
    "category_icon": "💡",
    "slug": "18-lyustralar",
    "title": "Lyustralar",
    "short_description": "Lyustralar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Elektr jihozlarini yakuniy o‘rnatish",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 169
  },
  {
    "category_id": 18,
    "category_code": "18",
    "category_slug": "18-elektr-jihozlarini-yakuniy-ornatish",
    "category_title": "Elektr jihozlarini yakuniy o‘rnatish",
    "category_icon": "💡",
    "slug": "18-spotlar",
    "title": "Spotlar",
    "short_description": "Spotlar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Elektr jihozlarini yakuniy o‘rnatish",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 6,
    "is_published": true,
    "id": 170
  },
  {
    "category_id": 18,
    "category_code": "18",
    "category_slug": "18-elektr-jihozlarini-yakuniy-ornatish",
    "category_title": "Elektr jihozlarini yakuniy o‘rnatish",
    "category_icon": "💡",
    "slug": "18-led-lenta",
    "title": "LED lenta",
    "short_description": "LED lenta — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Elektr jihozlarini yakuniy o‘rnatish",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 7,
    "is_published": true,
    "id": 171
  },
  {
    "category_id": 18,
    "category_code": "18",
    "category_slug": "18-elektr-jihozlarini-yakuniy-ornatish",
    "category_title": "Elektr jihozlarini yakuniy o‘rnatish",
    "category_icon": "💡",
    "slug": "18-profil",
    "title": "Profil",
    "short_description": "Profil — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Elektr jihozlarini yakuniy o‘rnatish",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 8,
    "is_published": true,
    "id": 172
  },
  {
    "category_id": 18,
    "category_code": "18",
    "category_slug": "18-elektr-jihozlarini-yakuniy-ornatish",
    "category_title": "Elektr jihozlarini yakuniy o‘rnatish",
    "category_icon": "💡",
    "slug": "18-dekorativ-yoritish",
    "title": "Dekorativ yoritish",
    "short_description": "Dekorativ yoritish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Elektr jihozlarini yakuniy o‘rnatish",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 9,
    "is_published": true,
    "id": 173
  },
  {
    "category_id": 18,
    "category_code": "18",
    "category_slug": "18-elektr-jihozlarini-yakuniy-ornatish",
    "category_title": "Elektr jihozlarini yakuniy o‘rnatish",
    "category_icon": "💡",
    "slug": "18-elektr-щitining-yakuniy-yigilishi",
    "title": "Elektr щitining yakuniy yig‘ilishi",
    "short_description": "Elektr щitining yakuniy yig‘ilishi — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Elektr jihozlarini yakuniy o‘rnatish",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 10,
    "is_published": true,
    "id": 174
  },
  {
    "category_id": 18,
    "category_code": "18",
    "category_slug": "18-elektr-jihozlarini-yakuniy-ornatish",
    "category_title": "Elektr jihozlarini yakuniy o‘rnatish",
    "category_icon": "💡",
    "slug": "18-barcha-liniyalarni-tekshirish",
    "title": "Barcha liniyalarni tekshirish",
    "short_description": "Barcha liniyalarni tekshirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Elektr jihozlarini yakuniy o‘rnatish",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 11,
    "is_published": true,
    "id": 175
  },
  {
    "category_id": 19,
    "category_code": "19",
    "category_slug": "19-klimat-jihozlari",
    "category_title": "Klimat jihozlari",
    "category_icon": "🌡️",
    "slug": "19-konditsioner-ichki-bloklari",
    "title": "Konditsioner ichki bloklari",
    "short_description": "Konditsioner ichki bloklari — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Klimat jihozlari",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 176
  },
  {
    "category_id": 19,
    "category_code": "19",
    "category_slug": "19-klimat-jihozlari",
    "category_title": "Klimat jihozlari",
    "category_icon": "🌡️",
    "slug": "19-tashqi-bloklar",
    "title": "Tashqi bloklar",
    "short_description": "Tashqi bloklar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Klimat jihozlari",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 177
  },
  {
    "category_id": 19,
    "category_code": "19",
    "category_slug": "19-klimat-jihozlari",
    "category_title": "Klimat jihozlari",
    "category_icon": "🌡️",
    "slug": "19-drenaj",
    "title": "Drenaj",
    "short_description": "Drenaj — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Klimat jihozlari",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 178
  },
  {
    "category_id": 19,
    "category_code": "19",
    "category_slug": "19-klimat-jihozlari",
    "category_title": "Klimat jihozlari",
    "category_icon": "🌡️",
    "slug": "19-ventilyatsiya-panjaralari",
    "title": "Ventilyatsiya panjaralari",
    "short_description": "Ventilyatsiya panjaralari — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Klimat jihozlari",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 179
  },
  {
    "category_id": 19,
    "category_code": "19",
    "category_slug": "19-klimat-jihozlari",
    "category_title": "Klimat jihozlari",
    "category_icon": "🌡️",
    "slug": "19-termostat-boshqaruv-elementlari",
    "title": "Termostat/boshqaruv elementlari",
    "short_description": "Termostat/boshqaruv elementlari — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Klimat jihozlari",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 180
  },
  {
    "category_id": 20,
    "category_code": "20",
    "category_slug": "20-dekor-va-interyerni-yakunlash",
    "category_title": "Dekor va interyerni yakunlash",
    "category_icon": "🖼️",
    "slug": "20-pardalar-karnizlar",
    "title": "Pardalar/karnizlar",
    "short_description": "Pardalar/karnizlar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Dekor va interyerni yakunlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 181
  },
  {
    "category_id": 20,
    "category_code": "20",
    "category_slug": "20-dekor-va-interyerni-yakunlash",
    "category_title": "Dekor va interyerni yakunlash",
    "category_icon": "🖼️",
    "slug": "20-oyna-dekorlari",
    "title": "Oyna dekorlari",
    "short_description": "Oyna dekorlari — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Dekor va interyerni yakunlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 182
  },
  {
    "category_id": 20,
    "category_code": "20",
    "category_slug": "20-dekor-va-interyerni-yakunlash",
    "category_title": "Dekor va interyerni yakunlash",
    "category_icon": "🖼️",
    "slug": "20-mebel",
    "title": "Mebel",
    "short_description": "Mebel — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Dekor va interyerni yakunlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 183
  },
  {
    "category_id": 20,
    "category_code": "20",
    "category_slug": "20-dekor-va-interyerni-yakunlash",
    "category_title": "Dekor va interyerni yakunlash",
    "category_icon": "🖼️",
    "slug": "20-gilam",
    "title": "Gilam",
    "short_description": "Gilam — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Dekor va interyerni yakunlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 184
  },
  {
    "category_id": 20,
    "category_code": "20",
    "category_slug": "20-dekor-va-interyerni-yakunlash",
    "category_title": "Dekor va interyerni yakunlash",
    "category_icon": "🖼️",
    "slug": "20-dekorativ-panellar",
    "title": "Dekorativ panellar",
    "short_description": "Dekorativ panellar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Dekor va interyerni yakunlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 185
  },
  {
    "category_id": 20,
    "category_code": "20",
    "category_slug": "20-dekor-va-interyerni-yakunlash",
    "category_title": "Dekor va interyerni yakunlash",
    "category_icon": "🖼️",
    "slug": "20-rasmlar",
    "title": "Rasmlar",
    "short_description": "Rasmlar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Dekor va interyerni yakunlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 6,
    "is_published": true,
    "id": 186
  },
  {
    "category_id": 20,
    "category_code": "20",
    "category_slug": "20-dekor-va-interyerni-yakunlash",
    "category_title": "Dekor va interyerni yakunlash",
    "category_icon": "🖼️",
    "slug": "20-oynalar",
    "title": "Oynalar",
    "short_description": "Oynalar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Dekor va interyerni yakunlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 7,
    "is_published": true,
    "id": 187
  },
  {
    "category_id": 20,
    "category_code": "20",
    "category_slug": "20-dekor-va-interyerni-yakunlash",
    "category_title": "Dekor va interyerni yakunlash",
    "category_icon": "🖼️",
    "slug": "20-dekorativ-buyumlar",
    "title": "Dekorativ buyumlar",
    "short_description": "Dekorativ buyumlar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Dekor va interyerni yakunlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 8,
    "is_published": true,
    "id": 188
  },
  {
    "category_id": 20,
    "category_code": "20",
    "category_slug": "20-dekor-va-interyerni-yakunlash",
    "category_title": "Dekor va interyerni yakunlash",
    "category_icon": "🖼️",
    "slug": "20-yumshoq-mebel",
    "title": "Yumshoq mebel",
    "short_description": "Yumshoq mebel — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Dekor va interyerni yakunlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 9,
    "is_published": true,
    "id": 189
  },
  {
    "category_id": 20,
    "category_code": "20",
    "category_slug": "20-dekor-va-interyerni-yakunlash",
    "category_title": "Dekor va interyerni yakunlash",
    "category_icon": "🖼️",
    "slug": "20-yotoq-aksessuarlari",
    "title": "Yotoq aksessuarlari",
    "short_description": "Yotoq aksessuarlari — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Dekor va interyerni yakunlash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 10,
    "is_published": true,
    "id": 190
  },
  {
    "category_id": 21,
    "category_code": "21",
    "category_slug": "21-yakuniy-tozalash",
    "category_title": "Yakuniy tozalash",
    "category_icon": "🧹",
    "slug": "21-qurilish-chiqindilarini-olib-chiqish",
    "title": "Qurilish chiqindilarini olib chiqish",
    "short_description": "Qurilish chiqindilarini olib chiqish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Yakuniy tozalash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 191
  },
  {
    "category_id": 21,
    "category_code": "21",
    "category_slug": "21-yakuniy-tozalash",
    "category_title": "Yakuniy tozalash",
    "category_icon": "🧹",
    "slug": "21-changdan-tozalash",
    "title": "Changdan tozalash",
    "short_description": "Changdan tozalash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Yakuniy tozalash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 192
  },
  {
    "category_id": 21,
    "category_code": "21",
    "category_slug": "21-yakuniy-tozalash",
    "category_title": "Yakuniy tozalash",
    "category_icon": "🧹",
    "slug": "21-oyna-va-fasadlarni-tozalash",
    "title": "Oyna va fasadlarni tozalash",
    "short_description": "Oyna va fasadlarni tozalash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Yakuniy tozalash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 193
  },
  {
    "category_id": 21,
    "category_code": "21",
    "category_slug": "21-yakuniy-tozalash",
    "category_title": "Yakuniy tozalash",
    "category_icon": "🧹",
    "slug": "21-plitkalarni-tozalash",
    "title": "Plitkalarni tozalash",
    "short_description": "Plitkalarni tozalash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Yakuniy tozalash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 194
  },
  {
    "category_id": 21,
    "category_code": "21",
    "category_slug": "21-yakuniy-tozalash",
    "category_title": "Yakuniy tozalash",
    "category_icon": "🧹",
    "slug": "21-mebelni-tozalash",
    "title": "Mebelni tozalash",
    "short_description": "Mebelni tozalash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Yakuniy tozalash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 195
  },
  {
    "category_id": 21,
    "category_code": "21",
    "category_slug": "21-yakuniy-tozalash",
    "category_title": "Yakuniy tozalash",
    "category_icon": "🧹",
    "slug": "21-polni-tozalash",
    "title": "Polni tozalash",
    "short_description": "Polni tozalash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Yakuniy tozalash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 6,
    "is_published": true,
    "id": 196
  },
  {
    "category_id": 21,
    "category_code": "21",
    "category_slug": "21-yakuniy-tozalash",
    "category_title": "Yakuniy tozalash",
    "category_icon": "🧹",
    "slug": "21-sanitariya-jihozlarini-tozalash",
    "title": "Sanitariya jihozlarini tozalash",
    "short_description": "Sanitariya jihozlarini tozalash — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Yakuniy tozalash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 7,
    "is_published": true,
    "id": 197
  },
  {
    "category_id": 21,
    "category_code": "21",
    "category_slug": "21-yakuniy-tozalash",
    "category_title": "Yakuniy tozalash",
    "category_icon": "🧹",
    "slug": "21-yakuniy-professional-cleaning",
    "title": "Yakuniy professional cleaning",
    "short_description": "Yakuniy professional cleaning — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Yakuniy tozalash",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 8,
    "is_published": true,
    "id": 198
  },
  {
    "category_id": 22,
    "category_code": "22",
    "category_slug": "22-qa-qc-sifat-nazorati",
    "category_title": "QA/QC — sifat nazorati",
    "category_icon": "🔍",
    "slug": "22-devorlarning-geometriyasini-tekshirish",
    "title": "Devorlarning geometriyasini tekshirish",
    "short_description": "Devorlarning geometriyasini tekshirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "QA/QC — sifat nazorati",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 199
  },
  {
    "category_id": 22,
    "category_code": "22",
    "category_slug": "22-qa-qc-sifat-nazorati",
    "category_title": "QA/QC — sifat nazorati",
    "category_icon": "🔍",
    "slug": "22-pol-sathlarini-tekshirish",
    "title": "Pol sathlarini tekshirish",
    "short_description": "Pol sathlarini tekshirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "QA/QC — sifat nazorati",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 200
  },
  {
    "category_id": 22,
    "category_code": "22",
    "category_slug": "22-qa-qc-sifat-nazorati",
    "category_title": "QA/QC — sifat nazorati",
    "category_icon": "🔍",
    "slug": "22-shiftlarni-tekshirish",
    "title": "Shiftlarni tekshirish",
    "short_description": "Shiftlarni tekshirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "QA/QC — sifat nazorati",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 201
  },
  {
    "category_id": 22,
    "category_code": "22",
    "category_slug": "22-qa-qc-sifat-nazorati",
    "category_title": "QA/QC — sifat nazorati",
    "category_icon": "🔍",
    "slug": "22-plitka-choklarini-tekshirish",
    "title": "Plitka choklarini tekshirish",
    "short_description": "Plitka choklarini tekshirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "QA/QC — sifat nazorati",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 202
  },
  {
    "category_id": 22,
    "category_code": "22",
    "category_slug": "22-qa-qc-sifat-nazorati",
    "category_title": "QA/QC — sifat nazorati",
    "category_icon": "🔍",
    "slug": "22-eshiklarni-tekshirish",
    "title": "Eshiklarni tekshirish",
    "short_description": "Eshiklarni tekshirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "QA/QC — sifat nazorati",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 203
  },
  {
    "category_id": 22,
    "category_code": "22",
    "category_slug": "22-qa-qc-sifat-nazorati",
    "category_title": "QA/QC — sifat nazorati",
    "category_icon": "🔍",
    "slug": "22-mebelni-tekshirish",
    "title": "Mebelni tekshirish",
    "short_description": "Mebelni tekshirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "QA/QC — sifat nazorati",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 6,
    "is_published": true,
    "id": 204
  },
  {
    "category_id": 22,
    "category_code": "22",
    "category_slug": "22-qa-qc-sifat-nazorati",
    "category_title": "QA/QC — sifat nazorati",
    "category_icon": "🔍",
    "slug": "22-rozetkalarni-tekshirish",
    "title": "Rozetkalarni tekshirish",
    "short_description": "Rozetkalarni tekshirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "QA/QC — sifat nazorati",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 7,
    "is_published": true,
    "id": 205
  },
  {
    "category_id": 22,
    "category_code": "22",
    "category_slug": "22-qa-qc-sifat-nazorati",
    "category_title": "QA/QC — sifat nazorati",
    "category_icon": "🔍",
    "slug": "22-yoritishni-tekshirish",
    "title": "Yoritishni tekshirish",
    "short_description": "Yoritishni tekshirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "QA/QC — sifat nazorati",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 8,
    "is_published": true,
    "id": 206
  },
  {
    "category_id": 22,
    "category_code": "22",
    "category_slug": "22-qa-qc-sifat-nazorati",
    "category_title": "QA/QC — sifat nazorati",
    "category_icon": "🔍",
    "slug": "22-santexnikani-tekshirish",
    "title": "Santexnikani tekshirish",
    "short_description": "Santexnikani tekshirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "QA/QC — sifat nazorati",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 9,
    "is_published": true,
    "id": 207
  },
  {
    "category_id": 22,
    "category_code": "22",
    "category_slug": "22-qa-qc-sifat-nazorati",
    "category_title": "QA/QC — sifat nazorati",
    "category_icon": "🔍",
    "slug": "22-kanalizatsiyani-tekshirish",
    "title": "Kanalizatsiyani tekshirish",
    "short_description": "Kanalizatsiyani tekshirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "QA/QC — sifat nazorati",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 10,
    "is_published": true,
    "id": 208
  },
  {
    "category_id": 22,
    "category_code": "22",
    "category_slug": "22-qa-qc-sifat-nazorati",
    "category_title": "QA/QC — sifat nazorati",
    "category_icon": "🔍",
    "slug": "22-konditsionerlarni-tekshirish",
    "title": "Konditsionerlarni tekshirish",
    "short_description": "Konditsionerlarni tekshirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "QA/QC — sifat nazorati",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 11,
    "is_published": true,
    "id": 209
  },
  {
    "category_id": 22,
    "category_code": "22",
    "category_slug": "22-qa-qc-sifat-nazorati",
    "category_title": "QA/QC — sifat nazorati",
    "category_icon": "🔍",
    "slug": "22-barcha-nuqsonlarni-royxatga-olish",
    "title": "Barcha nuqsonlarni ro‘yxatga olish",
    "short_description": "Barcha nuqsonlarni ro‘yxatga olish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "QA/QC — sifat nazorati",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 12,
    "is_published": true,
    "id": 210
  },
  {
    "category_id": 22,
    "category_code": "22",
    "category_slug": "22-qa-qc-sifat-nazorati",
    "category_title": "QA/QC — sifat nazorati",
    "category_icon": "🔍",
    "slug": "22-nuqsonlarni-bartaraf-qilish",
    "title": "Nuqsonlarni bartaraf qilish",
    "short_description": "Nuqsonlarni bartaraf qilish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "QA/QC — sifat nazorati",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 13,
    "is_published": true,
    "id": 211
  },
  {
    "category_id": 22,
    "category_code": "22",
    "category_slug": "22-qa-qc-sifat-nazorati",
    "category_title": "QA/QC — sifat nazorati",
    "category_icon": "🔍",
    "slug": "22-qayta-tekshirish",
    "title": "Qayta tekshirish",
    "short_description": "Qayta tekshirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "QA/QC — sifat nazorati",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 14,
    "is_published": true,
    "id": 212
  },
  {
    "category_id": 23,
    "category_code": "23",
    "category_slug": "23-obyektni-topshirish",
    "category_title": "Obyektni topshirish",
    "category_icon": "🔑",
    "slug": "23-yakuniy-foto-video",
    "title": "Yakuniy foto/video",
    "short_description": "Yakuniy foto/video — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Obyektni topshirish",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 1,
    "is_published": true,
    "id": 213
  },
  {
    "category_id": 23,
    "category_code": "23",
    "category_slug": "23-obyektni-topshirish",
    "category_title": "Obyektni topshirish",
    "category_icon": "🔑",
    "slug": "23-qurilgan-holatni-loyiha-bilan-solishtirish",
    "title": "Qurilgan holatni loyiha bilan solishtirish",
    "short_description": "Qurilgan holatni loyiha bilan solishtirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Obyektni topshirish",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 2,
    "is_published": true,
    "id": 214
  },
  {
    "category_id": 23,
    "category_code": "23",
    "category_slug": "23-obyektni-topshirish",
    "category_title": "Obyektni topshirish",
    "category_icon": "🔑",
    "slug": "23-as-built-chizmalar-zarur-bolsa",
    "title": "As-built chizmalar — zarur bo‘lsa",
    "short_description": "As-built chizmalar — zarur bo‘lsa — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Obyektni topshirish",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 3,
    "is_published": true,
    "id": 215
  },
  {
    "category_id": 23,
    "category_code": "23",
    "category_slug": "23-obyektni-topshirish",
    "category_title": "Obyektni topshirish",
    "category_icon": "🔑",
    "slug": "23-jihozlar-boyicha-instruktsiyalar",
    "title": "Jihozlar bo‘yicha instruktsiyalar",
    "short_description": "Jihozlar bo‘yicha instruktsiyalar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Obyektni topshirish",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 4,
    "is_published": true,
    "id": 216
  },
  {
    "category_id": 23,
    "category_code": "23",
    "category_slug": "23-obyektni-topshirish",
    "category_title": "Obyektni topshirish",
    "category_icon": "🔑",
    "slug": "23-kafolat-hujjatlari",
    "title": "Kafolat hujjatlari",
    "short_description": "Kafolat hujjatlari — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Obyektni topshirish",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 5,
    "is_published": true,
    "id": 217
  },
  {
    "category_id": 23,
    "category_code": "23",
    "category_slug": "23-obyektni-topshirish",
    "category_title": "Obyektni topshirish",
    "category_icon": "🔑",
    "slug": "23-materiallar-boyicha-malumotlar",
    "title": "Materiallar bo‘yicha ma’lumotlar",
    "short_description": "Materiallar bo‘yicha ma’lumotlar — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Obyektni topshirish",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 6,
    "is_published": true,
    "id": 218
  },
  {
    "category_id": 23,
    "category_code": "23",
    "category_slug": "23-obyektni-topshirish",
    "category_title": "Obyektni topshirish",
    "category_icon": "🔑",
    "slug": "23-kalitlarni-topshirish",
    "title": "Kalitlarni topshirish",
    "short_description": "Kalitlarni topshirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Obyektni topshirish",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 7,
    "is_published": true,
    "id": 219
  },
  {
    "category_id": 23,
    "category_code": "23",
    "category_slug": "23-obyektni-topshirish",
    "category_title": "Obyektni topshirish",
    "category_icon": "🔑",
    "slug": "23-obyektni-buyurtmachiga-topshirish",
    "title": "Obyektni buyurtmachiga topshirish",
    "short_description": "Obyektni buyurtmachiga topshirish — qurilish-ta'mirlash jarayonining yuqori texnologik va sifatli bajarilishi shart bo‘lgan muhim bosqichi.",
    "purpose": "Materiallarning texnik xususiyatlaridan to‘liq foydalangan holda uzoq muddatli, mustahkam va estetik jihatdan mukammal natijaga erishish.",
    "when_to_do": "Oldingi tayyorgarlik ishlari to‘liq qabul qilinib, texnologik quritish me'yorlariga rioya etilgandan so‘ng.",
    "before_start": "Sath va o‘lchamlarni qayta tekshirish, ish joyini chang va kirlardan tozalash, zarur material va asboblarni shay qilish.",
    "step_by_step": [
      "Sirtni tayyorlash, nuqsonlarni bartaraf etish va gruntovka qilish.",
      "Lazerli va o‘lchov asboblari yordamida o‘qlarni aniq belgilash.",
      "Material ishlab chiqaruvchisining texnik xaritasiga (TDS) asosan montaj qilish.",
      "Har bir qavat va elementni daraja (uroven) va qoida (pravilo) bilan nazorat qilib borish.",
      "Texnologik qotish va quritish vaqtiga qat'iy amal qilish.",
      "Yakuniy qabul qilish va yashirin ishlar dalolatnomasini rasmiylashtirish."
    ],
    "rules": [
      "Xonada tavsiya etilgan harorat (+18°C dan +24°C gacha) va namlik (60% dan oshmagan) ta'minlanishi shart.",
      "Skvoznyak (yelvizak) va to‘g‘ridan-to‘g‘ri quyosh nuri tushishiga yo‘l qo‘yilmaydi.",
      "Amaldagi qurilish me'yorlari (SHNQ) va texnik reglamentlarga to‘liq rioya etiladi."
    ],
    "important_notes": "Hech qachon bir qatlam to‘liq qurimasdan turib keyingi qatlamga o‘tish mumkin emas, bu delaminatsiya (ko‘chish) va yoriqlarga sabab bo‘ladi.",
    "common_mistakes": [
      "Gruntovka qilinmasdan ish boshlash natijasida adgeziyaning (yopishish) pasayishi.",
      "Quritish vaqtini sun'iy ravishda issiqlik to‘plari bilan tezlashtirish (yoriqlar keltirib chiqaradi).",
      "O‘lchov asboblaridagi xatolikni tekshirmasdan montaj qilish."
    ],
    "quality_control": "Lazerli sath, burchak o‘lchagich va 2 metrli qoida bilan tekshiriladi; yuzadagi maksimal og‘ish me'yordan oshmasligi lozim.",
    "materials": [
      "Sertifikatlangan montaj qorishmalari",
      "Gruntovka (chuqur kiruvchi)",
      "Armatura/to‘r",
      "Fiksatrlar va mahkamlagichlar"
    ],
    "tools": [
      "Lazer nivelir",
      "2m alyuminiy qoida",
      "Elektr mikser",
      "Shpatel va molgalar",
      "Himoya vositalari"
    ],
    "checklist": [
      {
        "text": "Sirt tozalandi va chuqur kiruvchi gruntovka surildi",
        "required": true
      },
      {
        "text": "Lazer orqali vertikal va gorizontal tekshirildi",
        "required": true
      },
      {
        "text": "Ishlab chiqaruvchi yo‘riqnomasiga to‘liq rioya qilindi",
        "required": true
      },
      {
        "text": "Quritish me'yorlari buzilmasligi ta'minlandi",
        "required": true
      }
    ],
    "related_topics": [
      "Obyektni topshirish",
      "QA/QC — sifat nazorati",
      "Obyektni topshirish"
    ],
    "order_index": 8,
    "is_published": true,
    "id": 220
  }
];

// In-memory data store cache for fast synchronous & fallback querying
let _memCategories = [...PROCESS_CATEGORIES];
let _memItems = [...PROCESS_ITEMS];

/**
 * Initialize Postgres tables and seed initial categories and items if not present
 */
async function initProcessDatabase(pool) {
  if (!pool || typeof pool.query !== 'function') {
    console.log('[PROCESS] Running in memory mode (no DB pool)');
    return;
  }

  try {
    // 1. Categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS process_categories (
        id SERIAL PRIMARY KEY,
        code VARCHAR(10) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        icon VARCHAR(50) DEFAULT '⚡',
        filter VARCHAR(100),
        description TEXT,
        order_index INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_proc_cat_order ON process_categories(order_index);
      CREATE INDEX IF NOT EXISTS idx_proc_cat_slug ON process_categories(slug);
    `);

    // 2. Items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS process_items (
        id SERIAL PRIMARY KEY,
        category_id INT,
        category_code VARCHAR(10),
        category_slug VARCHAR(100),
        category_title VARCHAR(255),
        category_icon VARCHAR(50),
        slug VARCHAR(150) NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        short_description TEXT,
        purpose TEXT,
        when_to_do TEXT,
        before_start TEXT,
        step_by_step JSONB DEFAULT '[]',
        rules JSONB DEFAULT '[]',
        important_notes TEXT,
        common_mistakes JSONB DEFAULT '[]',
        quality_control TEXT,
        materials JSONB DEFAULT '[]',
        tools JSONB DEFAULT '[]',
        checklist JSONB DEFAULT '[]',
        related_topics JSONB DEFAULT '[]',
        order_index INT DEFAULT 0,
        is_published BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_proc_item_cat ON process_items(category_slug);
      CREATE INDEX IF NOT EXISTS idx_proc_item_order ON process_items(order_index);
      CREATE INDEX IF NOT EXISTS idx_proc_item_slug ON process_items(slug);
    `);

    // 3. User process activity (viewed items, checklists, saved bookmarks)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_process_activity (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        item_id INT NOT NULL,
        is_viewed BOOLEAN DEFAULT false,
        is_saved BOOLEAN DEFAULT false,
        completed_checklist JSONB DEFAULT '[]',
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, item_id)
      );
      CREATE INDEX IF NOT EXISTS idx_user_proc_user ON user_process_activity(user_id);
    `);

    // Seed Categories
    for (const cat of PROCESS_CATEGORIES) {
      await pool.query(`
        INSERT INTO process_categories (code, slug, title, icon, filter, description, order_index, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          icon = EXCLUDED.icon,
          filter = EXCLUDED.filter,
          description = EXCLUDED.description,
          order_index = EXCLUDED.order_index,
          is_active = EXCLUDED.is_active;
      `, [cat.code, cat.slug, cat.title, cat.icon, cat.filter, cat.description, cat.order_index, cat.is_active]);
    }

    // Seed Items (Check count)
    const countRes = await pool.query('SELECT COUNT(*) FROM process_items');
    const existingCount = parseInt(countRes.rows[0].count, 10);
    if (existingCount < PROCESS_ITEMS.length) {
      console.log(`[PROCESS] Seeding ${PROCESS_ITEMS.length} process items into DB...`);
      for (const it of PROCESS_ITEMS) {
        await pool.query(`
          INSERT INTO process_items (
            category_id, category_code, category_slug, category_title, category_icon,
            slug, title, short_description, purpose, when_to_do, before_start,
            step_by_step, rules, important_notes, common_mistakes, quality_control,
            materials, tools, checklist, related_topics, order_index, is_published
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
          ON CONFLICT (slug) DO UPDATE SET
            title = EXCLUDED.title,
            short_description = EXCLUDED.short_description,
            purpose = EXCLUDED.purpose,
            when_to_do = EXCLUDED.when_to_do,
            before_start = EXCLUDED.before_start,
            step_by_step = EXCLUDED.step_by_step,
            rules = EXCLUDED.rules,
            important_notes = EXCLUDED.important_notes,
            common_mistakes = EXCLUDED.common_mistakes,
            quality_control = EXCLUDED.quality_control,
            materials = EXCLUDED.materials,
            tools = EXCLUDED.tools,
            checklist = EXCLUDED.checklist,
            related_topics = EXCLUDED.related_topics,
            order_index = EXCLUDED.order_index,
            is_published = EXCLUDED.is_published;
        `, [
          it.category_id, it.category_code, it.category_slug, it.category_title, it.category_icon,
          it.slug, it.title, it.short_description, it.purpose, it.when_to_do, it.before_start,
          JSON.stringify(it.step_by_step), JSON.stringify(it.rules), it.important_notes,
          JSON.stringify(it.common_mistakes), it.quality_control, JSON.stringify(it.materials),
          JSON.stringify(it.tools), JSON.stringify(it.checklist), JSON.stringify(it.related_topics),
          it.order_index, it.is_published
        ]);
      }
      console.log('[PROCESS] Seeding process items completed successfully.');
    }
  } catch (err) {
    console.error('[PROCESS] Database init error (falling back to memory):', err.message);
  }
}

async function getProcessCategories(pool) {
  if (pool && typeof pool.query === 'function') {
    try {
      const res = await pool.query(`
        SELECT c.*, COUNT(i.id)::int as items_count
        FROM process_categories c
        LEFT JOIN process_items i ON i.category_slug = c.slug AND i.is_published = true
        WHERE c.is_active = true
        GROUP BY c.id
        ORDER BY c.order_index ASC, c.id ASC
      `);
      if (res.rows && res.rows.length) {
        return res.rows;
      }
    } catch (e) {
      console.warn('[PROCESS] DB getCategories failed, using memory:', e.message);
    }
  }

  // Memory fallback
  return _memCategories.map(c => {
    const count = _memItems.filter(i => (i.category_slug === c.slug || i.category_id === c.id) && i.is_published !== false).length;
    return { ...c, items_count: count };
  });
}

async function getProcessCategory(pool, idOrSlug) {
  if (pool && typeof pool.query === 'function') {
    try {
      const isNum = !isNaN(Number(idOrSlug));
      const res = isNum
        ? await pool.query('SELECT * FROM process_categories WHERE id = $1', [Number(idOrSlug)])
        : await pool.query('SELECT * FROM process_categories WHERE slug = $1', [String(idOrSlug)]);
      if (res.rows && res.rows[0]) return res.rows[0];
    } catch (e) {}
  }
  return _memCategories.find(c => String(c.id) === String(idOrSlug) || c.slug === String(idOrSlug)) || null;
}

async function getProcessItems(pool, options = {}) {
  const { category_id, category_slug, search, limit = 300, offset = 0 } = options;

  if (pool && typeof pool.query === 'function') {
    try {
      let query = 'SELECT * FROM process_items WHERE is_published = true';
      const params = [];
      let pIdx = 1;

      if (category_slug) {
        query += ` AND category_slug = $${pIdx++}`;
        params.push(category_slug);
      } else if (category_id) {
        query += ` AND (category_id = $${pIdx++} OR category_slug = (SELECT slug FROM process_categories WHERE id = $${pIdx - 1}))`;
        params.push(category_id);
      }

      if (search && search.trim()) {
        query += ` AND (LOWER(title) LIKE $${pIdx} OR LOWER(short_description) LIKE $${pIdx} OR LOWER(purpose) LIKE $${pIdx})`;
        params.push(`%${search.trim().toLowerCase()}%`);
        pIdx++;
      }

      query += ' ORDER BY order_index ASC, id ASC';
      if (limit) {
        query += ` LIMIT $${pIdx++} OFFSET $${pIdx++}`;
        params.push(limit, offset);
      }

      const res = await pool.query(query, params);
      return res.rows || [];
    } catch (e) {
      console.warn('[PROCESS] DB getItems failed, using memory:', e.message);
    }
  }

  // Memory fallback
  let list = _memItems.filter(i => i.is_published !== false);
  if (category_slug) {
    list = list.filter(i => i.category_slug === category_slug);
  } else if (category_id) {
    const cat = _memCategories.find(c => String(c.id) === String(category_id));
    const slug = cat ? cat.slug : '';
    list = list.filter(i => i.category_id === Number(category_id) || i.category_slug === slug);
  }
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(i => 
      (i.title || '').toLowerCase().includes(q) ||
      (i.short_description || '').toLowerCase().includes(q) ||
      (i.purpose || '').toLowerCase().includes(q)
    );
  }
  return list.slice(offset, offset + limit);
}

async function getProcessItemDetail(pool, idOrSlug) {
  if (pool && typeof pool.query === 'function') {
    try {
      const isNum = !isNaN(Number(idOrSlug));
      const res = isNum
        ? await pool.query('SELECT * FROM process_items WHERE id = $1', [Number(idOrSlug)])
        : await pool.query('SELECT * FROM process_items WHERE slug = $1', [String(idOrSlug)]);
      if (res.rows && res.rows[0]) return res.rows[0];
    } catch (e) {}
  }
  return _memItems.find(i => String(i.id) === String(idOrSlug) || i.slug === String(idOrSlug)) || null;
}

// Admin helper functions
async function saveProcessCategory(pool, data) {
  if (data.id) {
    const idx = _memCategories.findIndex(c => Number(c.id) === Number(data.id));
    if (idx !== -1) _memCategories[idx] = { ..._memCategories[idx], ...data };
  } else {
    data.id = _memCategories.length + 1;
    _memCategories.push(data);
  }
  if (pool && typeof pool.query === 'function') {
    try {
      if (data.id) {
        await pool.query(`
          UPDATE process_categories SET
            title = $1, icon = $2, filter = $3, description = $4, order_index = $5, is_active = $6, updated_at = NOW()
          WHERE id = $7
        `, [data.title, data.icon, data.filter, data.description, data.order_index, data.is_active, data.id]);
      } else {
        const res = await pool.query(`
          INSERT INTO process_categories (code, slug, title, icon, filter, description, order_index, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
        `, [data.code, data.slug, data.title, data.icon, data.filter, data.description, data.order_index, data.is_active]);
        data.id = res.rows[0].id;
      }
    } catch (e) {
      console.error('[PROCESS] saveCategory error:', e.message);
    }
  }
  return data;
}

async function deleteProcessCategory(pool, id) {
  _memCategories = _memCategories.filter(c => Number(c.id) !== Number(id));
  if (pool && typeof pool.query === 'function') {
    try {
      await pool.query('DELETE FROM process_categories WHERE id = $1', [Number(id)]);
    } catch (e) {
      console.error('[PROCESS] deleteCategory error:', e.message);
    }
  }
  return true;
}

async function saveProcessItem(pool, data) {
  if (data.id) {
    const idx = _memItems.findIndex(i => Number(i.id) === Number(data.id));
    if (idx !== -1) _memItems[idx] = { ..._memItems[idx], ...data };
  } else {
    data.id = _memItems.length + 1;
    _memItems.push(data);
  }
  if (pool && typeof pool.query === 'function') {
    try {
      if (data.id) {
        await pool.query(`
          UPDATE process_items SET
            title = $1, short_description = $2, purpose = $3, when_to_do = $4, before_start = $5,
            step_by_step = $6, rules = $7, important_notes = $8, common_mistakes = $9,
            quality_control = $10, materials = $11, tools = $12, checklist = $13,
            related_topics = $14, order_index = $15, is_published = $16, updated_at = NOW()
          WHERE id = $17
        `, [
          data.title, data.short_description, data.purpose, data.when_to_do, data.before_start,
          JSON.stringify(data.step_by_step || []), JSON.stringify(data.rules || []), data.important_notes,
          JSON.stringify(data.common_mistakes || []), data.quality_control, JSON.stringify(data.materials || []),
          JSON.stringify(data.tools || []), JSON.stringify(data.checklist || []), JSON.stringify(data.related_topics || []),
          data.order_index, data.is_published, data.id
        ]);
      } else {
        const res = await pool.query(`
          INSERT INTO process_items (
            category_id, category_code, category_slug, category_title, category_icon,
            slug, title, short_description, purpose, when_to_do, before_start,
            step_by_step, rules, important_notes, common_mistakes, quality_control,
            materials, tools, checklist, related_topics, order_index, is_published
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
          RETURNING id
        `, [
          data.category_id, data.category_code, data.category_slug, data.category_title, data.category_icon,
          data.slug, data.title, data.short_description, data.purpose, data.when_to_do, data.before_start,
          JSON.stringify(data.step_by_step || []), JSON.stringify(data.rules || []), data.important_notes,
          JSON.stringify(data.common_mistakes || []), data.quality_control, JSON.stringify(data.materials || []),
          JSON.stringify(data.tools || []), JSON.stringify(data.checklist || []), JSON.stringify(data.related_topics || []),
          data.order_index, data.is_published
        ]);
        data.id = res.rows[0].id;
      }
    } catch (e) {
      console.error('[PROCESS] saveItem error:', e.message);
    }
  }
  return data;
}

async function deleteProcessItem(pool, id) {
  _memItems = _memItems.filter(i => Number(i.id) !== Number(id));
  if (pool && typeof pool.query === 'function') {
    try {
      await pool.query('DELETE FROM process_items WHERE id = $1', [Number(id)]);
    } catch (e) {
      console.error('[PROCESS] deleteItem error:', e.message);
    }
  }
  return true;
}

module.exports = {
  PROCESS_CATEGORIES,
  PROCESS_ITEMS,
  initProcessDatabase,
  getProcessCategories,
  getProcessCategory,
  getProcessItems,
  getProcessItemDetail,
  saveProcessCategory,
  deleteProcessCategory,
  saveProcessItem,
  deleteProcessItem
};
