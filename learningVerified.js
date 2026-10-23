// ======================================================
// ARXITEKTURA VA RD O'RGANISH MARKAZI — TEKSHIRILGAN MAZMUN (2026-10-24)
// Har bir bosqich uchun ilova ichida o'qiladigan darslar (lessons) va manbalar.
// Manba havolalari qidiruv sahifasiga emas, aynan hujjat yoki nashriyot sahifasiga olib boradi.
// Har bir standart/normativ uchun: chiqqan yili, hozir amaldami, O'zbekistonda qaysi hujjat unga havola qiladi.
// ======================================================

const WS = n => "https://ru.wikisource.org/wiki/" + encodeURIComponent(n.replace(/ /g, "_"));
const LEX = id => `https://lex.uz/uz/docs/-${id}`;

const SRC = {
  gost2301: { title: "ГОСТ 2.301-68 «Форматы»", url: WS("ГОСТ 2.301—68"), status: "Amalda (davlatlararo ESKD standarti)" },
  gost2302: { title: "ГОСТ 2.302-68 «Масштабы»", url: WS("ГОСТ 2.302—68"), status: "Amalda; 01.01.1971 dan, 3-o'zgartirish 2006-yil" },
  gost2303: { title: "ГОСТ 2.303-68 «Линии»", url: WS("ГОСТ 2.303—68"), status: "Amalda (davlatlararo ESKD standarti)" },
  gost2304: { title: "ГОСТ 2.304-81 «Шрифты чертёжные»", url: WS("ГОСТ 2.304—81"), status: "Amalda (davlatlararo ESKD standarti)" },
  gost21201: { title: "ГОСТ 21.201-2011 «Условные графические изображения элементов зданий»", url: WS("ГОСТ 21.201—2011"), status: "Amalda; 01.05.2013 dan (davlatlararo SPDS)" },
  gost211101: { title: "ГОСТ Р 21.1101-2013 «Основные требования к проектной и рабочей документации»", url: WS("ГОСТ Р 21.1101—2013"), status: "O'zbekistonda SHNQ 1.03.03-23 (10-band) shu standartga havola qiladi. Rossiyada 01.01.2021 dan ГОСТ Р 21.101-2020 bilan almashtirilgan" },
  gost21501: { title: "ГОСТ 21.501-2018 «Правила выполнения рабочей документации архитектурных и конструктивных решений»", url: "https://meganorm.ru/Index/70/70538.htm", status: "Rossiyada 01.06.2019 dan amalda (21.501-2011 o'rniga). O'zbekistondagi ShNQ 1.03.04-22 hali GOST 21.501-93 ga havola qiladi — qaysi tahrir qo'llanishini ekspertiza/buyurtmachi bilan kelishing" },
  gost21101_97: { title: "ГОСТ 21.101-97 «Основные требования к проектной и рабочей документации»", url: "https://meganorm.ru/Data1/5/5180/index.htm", status: "O'zbekistondagi ShNQ 1.03.04-22 (7-band) unga havola qiladi. Rossiyada 2010 dan amal qilmaydi" },
  shnq10303: { title: "SHNQ 1.03.03-23 «Qurilish obyektlarini loyihalashtirish»", url: LEX(6905975), status: "Amalda; buyruq 01/2-6, 26.03.2024; Adliya vazirligida 29.04.2024 da 247-raqam. SHNQ 1.03.01-16 o'rniga" },
  shnq10304: { title: "ShNQ 1.03.04-22 «Namunaviy loyiha hujjatlari»", url: "https://mc.uz/uploads/mcuz_99811688333360.pdf", status: "Amalda; buyruq 69-son, 19.04.2022; Adliya vazirligida 25.04.2022 da 78-raqam" },
  shnq20801: { title: "SHNQ 2.08.01-24 «Turar joy obyektlarini loyihalash»", url: LEX(7121730), status: "Amalda; 25.09.2024 dan; 21.01.2026 da o'zgartirish kiritilgan" },
  shnq20802: { title: "SHNQ 2.08.02-23 «Jamoat binolari va inshootlari»", url: LEX(6920040), status: "Amalda; 07.08.2024 dan" },
  shnq10402: { title: "ShNQ 1.04.02-22 «Turar joy obyektlarini mukammal ta'mirlash va rekonstruksiya qilish»", url: LEX(7034724), status: "Amalda; 22.07.2024 dan" },
  shnq20105: { title: "SHNQ 2.01.05-24 «Tabiiy va sun'iy yoritish»", url: LEX(7218587), status: "Amalda; 25.10.2024 dan; QMQ 2.01.05-19 o'rniga" },
  revitHelp: { title: "Autodesk Revit — rasmiy yordam (Help)", url: "https://help.autodesk.com/view/RVT/2025/ENU/", status: "Rasmiy hujjat (ingliz tilida), Revit 2025" }
};

// ---------------- BOSQICH DARSLARI ----------------
const STAGE_LESSONS = {
  1: [
    {
      heading: "Plan, fasad va kesim — nima farqi bor?",
      text: "Arxitektura chizmasi ortogonal proyeksiyaga asoslanadi. Plan — binoning deraza o'yiqlari sathidan o'tkazilgan gorizontal kesimi: kesim tekisligi kesib o'tgan devorlar qalin chiziq bilan, undan pastda ko'rinadiganlari ingichka chiziq bilan chiziladi. Fasad — binoning tashqi ko'rinishi. Kesim (razrez) — vertikal tekislik bilan kesilgan ko'rinish; u qavat balandliklari, orayopma, zinapoya va tom qurilmasini ko'rsatadi.",
      points: [
        "Kesim tekisligi odatda zinapoya kataklari va eshik-deraza o'yiqlari orqali o'tkaziladi — shunda eng ko'p ma'lumot ko'rinadi.",
        "Kesim yo'nalishi planlarda ochiq (razomknutaya) chiziq va strelka bilan ko'rsatiladi.",
        "Fasad koordinatsion o'qlarning chetki o'qlari bilan belgilanadi (masalan «1–7 o'qlar bo'yicha fasad»)."
      ],
      correct: ["Kesim tekisligini zinapoya marshlaridan biri orqali o'tkazish", "Planda kesilgan devorni qalin, ko'rinib turgan mebel va pol chizig'ini ingichka chizish"],
      wrong: ["Planda hamma chiziqni bir xil qalinlikda chizish", "Kesimni hech narsa ko'rinmaydigan yaxlit devor bo'ylab o'tkazish"],
      source: SRC.gost21501
    },
    {
      heading: "Masshtablar (GOST 2.302-68)",
      text: "Chizmada faqat standartda ruxsat etilgan masshtablar ishlatiladi. Kichraytirish masshtablari: 1:2; 1:2,5; 1:4; 1:5; 1:10; 1:15; 1:20; 1:25; 1:40; 1:50; 1:75; 1:100; 1:200; 1:400; 1:500; 1:800; 1:1000. Bosh rejalar uchun 1:2000, 1:5000, 1:10000 va undan kichik masshtablar ham ruxsat etiladi. Kattalashtirish: 2:1; 2,5:1; 4:1; 5:1; 10:1; 20:1; 40:1; 50:1; 100:1.",
      table: {
        columns: ["Chizma turi", "Odatdagi masshtab (amaliyot)"],
        rows: [
          ["Bosh reja / vaziyat rejasi", "1:500, 1:1000"],
          ["Qavat planlari, fasadlar, kesimlar", "1:100, 1:50"],
          ["Interyer planlari, devor yoyilmalari", "1:50, 1:25, 1:20"],
          ["Tugunlar (uzellar), detallar", "1:20, 1:10, 1:5"]
        ]
      },
      correct: ["1:75 — ro'yxatda bor, ishlatish mumkin", "Tugun uchun 1:10 yoki 1:5"],
      wrong: ["1:30 yoki 1:150 — GOST 2.302-68 ro'yxatida yo'q", "Bitta listdagi turli chizmalarga masshtabni yozmaslik"],
      source: SRC.gost2302
    },
    {
      heading: "Sathlar va balandlik belgilari",
      text: "Binoda 1-qavat toza polining sathi shartli ravishda 0,000 deb olinadi; undan yuqori sathlar «+», pastki sathlar «−» ishorasi bilan metrda, uch xona aniqlikda yoziladi (masalan +3,300; −0,450). Bosh rejada 0,000 ga mos keladigan mutlaq (Boltiq tizimidagi) balandlik ko'rsatiladi.",
      correct: ["+2,700 (shift), +3,300 (2-qavat toza poli)"],
      wrong: ["«2.7 m» yoki «270 sm» deb yozish", "Har qavat polini alohida 0,000 deb olish"],
      source: SRC.gost21501
    }
  ],
  2: [
    {
      heading: "Chiziq turlari va qalinliklari (GOST 2.303-68)",
      text: "Asosiy yaxlit qalin chiziq qalinligi s = 0,5–1,4 mm (chizma kattaligi va murakkabligiga qarab). Ingichka yaxlit chiziq — s/3 dan s/2 gacha. Bir chizmada bir xil turdagi chiziqlar bir xil qalinlikda bo'lishi shart.",
      table: {
        columns: ["Chiziq", "Qalinlik", "Qayerda ishlatiladi"],
        rows: [
          ["Yaxlit qalin (asosiy)", "s", "Ko'rinadigan kontur, kesimdagi devorlar"],
          ["Yaxlit ingichka", "s/3 – s/2", "O'lcham va chiqarish chiziqlari, shtrixovka, belgilar"],
          ["Shtrix (punktir)", "s/3 – s/2", "Ko'rinmaydigan kontur"],
          ["Shtrix-punktir ingichka", "s/3 – s/2", "O'q va markaz chiziqlari"],
          ["Ochiq (razomknutaya)", "s – 1,5 s", "Kesim tekisligi chiziqlari"],
          ["Siniq ingichka", "s/3 – s/2", "Uzun uzilish chiziqlari"]
        ]
      },
      correct: ["Kesimdagi devor 0,6–0,7 mm, o'lcham chiziqlari 0,18–0,25 mm"],
      wrong: ["O'lcham chizig'ini devor bilan bir xil qalin chizish", "Koordinatsion o'qni yaxlit chiziq bilan chizish"],
      source: SRC.gost2303
    },
    {
      heading: "Chizma shriftlari (GOST 2.304-81)",
      text: "Shrift o'lchami bosh harf balandligi (mm) bilan belgilanadi: (1,8); 2,5; 3,5; 5; 7; 10; 14; 20; 28; 40. A va B turdagi shriftlar, to'g'ri yoki 75° qiyalikda. Bitta chizmada bir xil vazifadagi yozuvlar bir xil o'lchamda bo'ladi.",
      correct: ["O'lcham raqamlari 2,5 yoki 3,5 mm; chizma nomlari 5 yoki 7 mm"],
      wrong: ["Har bir yozuvga tasodifiy o'lcham va dekorativ shrift tanlash"],
      source: SRC.gost2304
    },
    {
      heading: "Materiallarning shartli belgilari (GOST 21.201-2011)",
      text: "Devor, ustun, plita, o'yiq, nisha, zinapoya va panduslarning shartli grafik tasvirlari GOST 21.201-2011 da beriladi. Kesimdagi materiallar (g'isht, beton, temirbeton, issiqlik izolyatsiyasi, grunt va h.k.) bir loyiha ichida bir xil shtrixovka bilan ko'rsatiladi; nostandart belgi bo'lsa, «Umumiy ma'lumotlar» varag'ida izoh beriladi.",
      correct: ["Barcha listlarda g'isht uchun bitta shtrixovka turini ishlatish"],
      wrong: ["Har bir listda bir material uchun boshqa-boshqa shtrixovka"],
      source: SRC.gost21201
    }
  ],
  3: [
    {
      heading: "Formatlar (GOST 2.301-68) va ramka",
      text: "Asosiy formatlar: A0 — 841×1189, A1 — 594×841, A2 — 420×594, A3 — 297×420, A4 — 210×297 mm. Ramka chizig'i varaq chetidan chapda 20 mm (tikish uchun), qolgan tomonlarda 5 mm masofada chiziladi. Asosiy yozuv (shtamp) pastki o'ng burchakka joylashtiriladi; chizma listlari uchun shtamp o'lchami 185×55 mm.",
      correct: ["Interyer albomi uchun A3 gorizontal, hamma listlar bir formatda"],
      wrong: ["Ramka chetidan 20 mm ni o'ng tomonga qo'yish", "Shtampni varaqning yuqori qismiga joylashtirish"],
      source: SRC.gost2301
    },
    {
      heading: "Listni joylashtirish (komponovka) — 💡 amaliy qoidalar",
      text: "💡 Tavsiya (standart talabi emas): proyeksion bog'liq chizmalarni (plan va uning ustidagi fasad yoki kesim) o'qlar bo'yicha bir chiziqda joylang; asosiy chizma listning optik markaziga yaqin, jadvallar va izohlar shtamp ustida ustun ko'rinishida bo'lsin; chizmalar orasida yetarli bo'sh joy qoldiring.",
      correct: ["Plan ostida o'qlar bo'yicha tekislangan kesim", "Izohlarni shtamp ustiga 185 mm enli ustunga yozish"],
      wrong: ["Listni chetigacha to'ldirish, chizmalarni bir-biriga tegizib qo'yish"]
    }
  ],
  4: [
    {
      heading: "O'zbekistonda qaysi standart qo'llanadi?",
      text: "SHNQ 1.03.03-23 «Qurilish obyektlarini loyihalashtirish» (10-band) chizmalarni GOST 21.1101-2013 talablari bo'yicha bajarishni va bu haqda «Umumiy ma'lumotlar» varag'ida qayd qilishni talab qiladi. ShNQ 1.03.04-22 «Namunaviy loyiha hujjatlari» (7-band) GOST 21.101-97, GOST 21.114-95, GOST 21.501-93 va GOST 2.105-95 ga havola qiladi. Rossiyada bu standartlarning yangi tahrirlari (ГОСТ Р 21.101-2020, ГОСТ 21.501-2018) qabul qilingan — loyiha qaysi tahrir bo'yicha bajarilishini topshiriqda (TZ) yozib qo'ying.",
      correct: ["«Umumiy ma'lumotlar» listida qo'llangan standartlar ro'yxatini yozish"],
      wrong: ["Hech qaysi standartga havola qilmasdan albom chiqarish"],
      source: SRC.shnq10303
    },
    {
      heading: "Loyihalash bosqichlari (SHNQ 1.03.03-23, 9-band)",
      text: "Loyihalash quyidagicha bajarilishi mumkin: 1) alohida bosqich — texnik-iqtisodiy asoslash, eskiz yoki konsepsiya, interyer, eksteryer va hududning 3D tasvirlari; 2) alohida bosqichlar — loyiha, ishchi loyiha va ishchi hujjatlar; 3) texnik jihatdan oddiy obyektlar va namunaviy loyihalar uchun — bitta bosqich (ishchi loyiha).",
      points: [
        "Turar joy va fuqaro binolari loyihasi bo'limlari (2-ilova): umumiy tushuntirish xati; arxitektura-qurilish yechimlari; texnologik yechimlar; muhandislik jihozlari yechimlari; asosiy chizmalar; qurilishni tashkil etish; qurilish qiymati.",
        "Ishchi loyihada «Energiya samaradorligi» bo'limi majburiy (31-band).",
        "Normadan chetga chiqilsa, kompensatsiya choralari bilan maxsus texnik shartlar ishlab chiqiladi (11-band)."
      ],
      source: SRC.shnq10303
    },
    {
      heading: "Asosiy to'plam markalari (GOST 21.1101-2013 bo'yicha)",
      table: {
        columns: ["Marka", "To'plam"],
        rows: [
          ["GP", "Bosh reja"],
          ["AR", "Arxitektura yechimlari"],
          ["AS", "Arxitektura-qurilish yechimlari"],
          ["AI", "Interyerlar"],
          ["KJ", "Temirbeton konstruksiyalar"],
          ["KM", "Metall konstruksiyalar"],
          ["VK", "Ichki suv ta'minoti va kanalizatsiya"],
          ["OV", "Isitish, ventilyatsiya va konditsiyalash"],
          ["EO / EM", "Elektr yoritish / elektr jihozlari"]
        ]
      },
      source: SRC.gost211101
    }
  ],
  5: [
    {
      heading: "Vedomost va spetsifikatsiyalar nima uchun kerak?",
      text: "Ishchi albomdagi jadvallar quruvchi va ta'minotchiga «nima, qancha va qayerga» degan savolga javob beradi. Arxitektura yechimlari to'plamida odatda xonalar eksplikatsiyasi, pollar va pardozlash vedomostlari, eshik va derazalar spetsifikatsiyasi beriladi; shakllari GOST 21.501 ilovalarida keltirilgan. Uskunalar, buyumlar va materiallar spetsifikatsiyasi GOST 21.110-2013 bo'yicha tuziladi.",
      points: [
        "Har bir pozitsiya chizmadagi marka bilan bir xil bo'lsin (masalan D-1 eshik plan, fasad va jadvalda bir xil).",
        "Maydonlar m² da, ikki xona aniqlikda; pardozlash materiallari uchun xarid zaxirasini izohda alohida ko'rsating.",
        "Interyer albomida mebel, yoritgich va santexnika spetsifikatsiyasiga artikul, ishlab chiqaruvchi va soni yoziladi."
      ],
      correct: ["Eshiklar jadvali: marka, o'lcham, ochilish tomoni, soni, izoh"],
      wrong: ["Chizmada D-3 bor, jadvalda yo'q", "Pardozlash vedomostida xona raqamlari plan bilan mos kelmasligi"],
      source: SRC.gost21501
    }
  ],
  6: [
    {
      heading: "Amaldagi asosiy normativlar (2026-yil oktabr holatiga)",
      text: "Quyidagi hujjatlar lex.uz dagi rasmiy sahifadan tekshirildi. To'liq ma'lumot, band raqamlari va amaliy misollar «Normativlar» bo'limida.",
      table: {
        columns: ["Hujjat", "Nomi", "Holati"],
        rows: [
          ["SHNQ 2.08.01-24", "Turar joy obyektlarini loyihalash", "AMALDA (25.09.2024 dan)"],
          ["SHNQ 2.08.01-19", "Turar joy binolari", "KUCHINI YO‘QOTGAN (25.09.2024)"],
          ["SHNQ 2.08.02-23", "Jamoat binolari va inshootlari", "AMALDA (07.08.2024 dan)"],
          ["SHNQ 2.08.04-22", "Ma'muriy binolar", "AMALDA (25.09.2024 dan)"],
          ["SHNQ 2.07.01-23", "Aholi punktlari hududlarini rejalashtirish", "AMALDA (24.06.2024 dan)"],
          ["SHNQ 2.07.01-03*", "Shaharsozlik (eski)", "KUCHINI YO‘QOTGAN (24.06.2024)"],
          ["SHNQ 2.07.02-24", "Nogironlar va keksalar ehtiyojini inobatga olib loyihalash", "AMALDA (27.01.2025 dan)"],
          ["SHNQ 2.01.05-24", "Tabiiy va sun'iy yoritish", "AMALDA (25.10.2024 dan)"],
          ["QMQ 2.01.05-19", "Tabiiy va sun'iy yoritish (eski)", "KUCHINI YO‘QOTGAN"],
          ["ShNQ 1.04.02-22", "Turar joyni mukammal ta'mirlash va rekonstruksiya", "AMALDA (22.07.2024 dan)"],
          ["SHNQ 1.03.03-23", "Qurilish obyektlarini loyihalashtirish", "AMALDA (2024)"],
          ["QMQ 2.01.03-19", "Seysmik hududlarda qurilish", "AMALDA"]
        ]
      },
      source: SRC.shnq20801
    },
    {
      heading: "Eng ko'p xato qilinadigan raqamlar",
      text: "Internetda eski tahrirdagi raqamlar ko'p tarqalgan. Amaldagi SHNQ 2.08.01-24 bo'yicha:",
      correct: [
        "Yashash xonasi va oshxona balandligi — kamida 2,7 m (38-band)",
        "2 xonali kvartira — kamida 48 m², 3 xonali — 64 m² (1-jadval)",
        "Yotoqxona — kamida 8 m², eni 2,4 m; umumiy xona eni — 3 m",
        "Dahliz eni — 1,4 m; yashash xonalariga yo'lak — 1,1 m"
      ],
      wrong: [
        "«Shift balandligi 2,5 m» — eski ma'lumot",
        "«2 xonali kvartira 44 m²» — eski ma'lumot",
        "SHNQ 2.07.01-03* ni amaldagi deb ko'rsatish — 24.06.2024 dan kuchini yo'qotgan"
      ],
      source: SRC.shnq20801
    }
  ],
  7: [
    {
      heading: "Ishchi albom qanday tuziladi?",
      text: "Har bir to'plam (AR, AI va h.k.) «Umumiy ma'lumotlar» varag'i bilan boshlanadi. Unda: ishchi chizmalar vedomosti (listlar ro'yxati), havola qilingan va ilova qilingan hujjatlar vedomosti, asosiy ko'rsatkichlar va umumiy ko'rsatmalar (qo'llangan normalar, 0,000 sathi va h.k.) bo'ladi. Keyin planlar, kesimlar, fasadlar, tugunlar va spetsifikatsiyalar keladi.",
      points: [
        "AR to'plami taxminiy tartibi: umumiy ma'lumotlar → qavat planlari → tom plani → kesimlar → fasadlar → tugunlar → eshik/deraza spetsifikatsiyasi.",
        "AI (interyer) to'plami: o'lchov rejasi → demontaj → montaj → mebel joylashuvi → santexnika → pollar → shiftlar → yoritish → o'chirgichlar → rozetkalar → devor yoyilmalari → spetsifikatsiyalar.",
        "Listlar ketma-ket raqamlanadi; o'zgartirish kiritilsa shtampdagi o'zgartirishlar jadvali to'ldiriladi."
      ],
      correct: ["Har bir listda shtamp, list raqami va jami listlar soni"],
      wrong: ["Listlarni turli formatda va turli shtamp bilan aralash chiqarish", "«Umumiy ma'lumotlar» varag'isiz albom topshirish"],
      source: SRC.gost211101
    },
    {
      heading: "Qurilish maydonida uchraydigan tipik xatolar",
      correct: ["Santexnika nuqtalari toza pol va tayyor devordan o'lchab beriladi", "Rozetka balandligi har bir rozetka uchun aniq ko'rsatiladi"],
      wrong: ["O'lchamlar qora (pardozsiz) devordan berilgan — mebel sig'maydi", "Shift rejasida yoritgichlar o'qlarga bog'lanmagan", "Demontaj rejasida yuk ko'taruvchi devor buzish uchun belgilangan (ShNQ 1.04.02-22, 10-band)"],
      source: SRC.shnq10402
    }
  ],
  8: [
    {
      heading: "Revit'da hujjat chiqarish mantig'i",
      text: "Revit'da chizma qo'lda chizilmaydi — model ko'rinishlari (Views) list (Sheet) ga Viewport sifatida qo'yiladi. Jadvallar (Schedules) model elementlaridan avtomatik hisoblanadi, shuning uchun eshik yoki xona o'zgarsa jadval ham o'zgaradi. Bir xil grafik ko'rinish uchun View Template ishlatiladi.",
      points: [
        "Bir View faqat bitta Sheet ga qo'yiladi — boshqa listga kerak bo'lsa Duplicate qiling.",
        "Room va Area elementlaridan xonalar eksplikatsiyasini Schedule orqali chiqaring.",
        "Phasing (Existing / Demolished / New) bilan o'lchov, demontaj va montaj rejalarini bitta modeldan oling."
      ],
      correct: ["Barcha planlar uchun bitta View Template", "Eshik jadvalini Door Schedule dan avtomatik olish"],
      wrong: ["Jadvalni Excelda qo'lda yozib, rasmini listga qo'yish", "Model elementini Detail Line bilan «chizib» qo'yish"],
      source: SRC.revitHelp
    }
  ],
  9: [
    {
      heading: "Albomni topshirishdan oldin o'z-o'zini tekshirish",
      correct: [
        "Har bir listda shtamp, masshtab va list raqami bor",
        "Plan, kesim va fasaddagi sathlar va o'lchamlar bir-biriga mos",
        "Barcha markalar (D-1, OK-1 va h.k.) jadvallarda bor",
        "Normativ raqamlar amaldagi tahrir bo'yicha (masalan SHNQ 2.08.01-24)",
        "«Umumiy ma'lumotlar» da qo'llangan standartlar ro'yxati yozilgan"
      ],
      wrong: [
        "Kuchini yo'qotgan normaga havola (SHNQ 2.08.01-19, SHNQ 2.07.01-03*)",
        "GOST 2.302 ro'yxatida yo'q masshtab (1:30, 1:150)",
        "PDF ga chiqarishda chiziq qalinliklari yo'qolishi (Print settings tekshirilmagan)"
      ],
      source: SRC.shnq10303
    }
  ]
};

// Eski/noto'g'ri raqamli mavzular o'rniga tuzatilgan matnlar
const STAGE_TOPIC_OVERRIDES = {
  6: [
    "SHNQ 1.03.03-23 — Qurilish obyektlarini loyihalashtirish (loyiha bosqichlari va bo'limlari; SHNQ 1.03.01-16 o'rniga)",
    "SHNQ 2.08.01-24 — Turar joy obyektlarini loyihalash (balandlik 2,7 m, kvartira va xona maydonlari)",
    "SHNQ 2.08.02-23 — Jamoat binolari va inshootlari (yo'laklar, chiqishlar, zinapoyalar)",
    "SHNQ 2.08.04-22 — Ma'muriy binolar (ofis ish o'rni maydoni)",
    "QMQ 2.01.03-19 — Seysmik hududlarda qurilish (7, 8, 9 ball)",
    "SHNQ 2.01.05-24 — Tabiiy va sun'iy yoritish (QMQ 2.01.05-19 o'rniga)",
    "Kuchini yo'qotgan normalarni ajratish: SHNQ 2.08.01-19, SHNQ 2.07.01-03*, QMQ 2.04.01-98"
  ],
  7: [
    "Ko'p qavatli turar joy binosi AR ishchi to'plamining tuzilishi",
    "Yakka tartibdagi uy AS to'plamining tuzilishi",
    "Kvartira interyeri AI to'plami: o'lchovdan spetsifikatsiyagacha",
    "«Umumiy ma'lumotlar» varag'i: vedomostlar va umumiy ko'rsatmalar",
    "Listlar ketma-ketligi va o'zgartirishlar kiritish tartibi",
    "Qurilish maydonida uchraydigan real xatolar va ularning oldini olish"
  ]
};

// ---------------- MANBALAR (order_index 1–20 bo'yicha eski yozuvlar o'rniga) ----------------
const VERIFIED_RESOURCES = [
  { stage_number: 1, order_index: 1, title: "Chizmachilik (geometrik va proyeksion chizmachilik)", author: "M.K. Xalimov", year: "2013", language: "uz", topic: "Proyeksiyalar, ko'rinishlar, qirqim va kesimlar, aksonometriya", benefit_description: "Plan, fasad va kesim tushunchalarining asosi — proyeksion chizmachilik. O'zbek tilida, OTM uchun tavsiya etilgan qo'llanma.", resource_type: "book", pdf_url: "https://n.ziyouz.com/books/kollej_va_otm_darsliklari/matematika/Chizmachilik.%20Geometrik%20va%20proyeksion%20chizmachilik%20(M.Xalimov).pdf", web_url: "https://www.ziyouz.com/", verification_note: "✅ PDF tekshirildi (180 bet, 2013). Manba: Ziyouz kutubxonasi. Kitob «Kutubxona → Kitoblar» bo'limida ham bor." },
  { stage_number: 2, order_index: 2, title: "Chizma geometriya va injenerlik grafikasi", author: "Hikmat Abidov", year: "2015", language: "uz", topic: "Arxitektura-qurilish chizmalari, standart bo'yicha rasmiylashtirish", benefit_description: "Arxitektura va qurilish talabalari uchun: chizmalarni davlat standartlari asosida bajarish.", resource_type: "book", pdf_url: "https://api.ziyonet.uz/uploads/books/335941/5a12530169e2e.pdf", web_url: "https://ziyonet.uz/", verification_note: "✅ PDF tekshirildi (211 bet, Toshkent, 2015). Manba: ZiyoNET." },
  { stage_number: 3, order_index: 3, title: "Kompyuter dasturlari yordamida arxitektura muhitlari ob'yektlarini tasvirlash", author: "SamDAQI, «Landshaft dizayni va interyer» kafedrasi", year: "2020", language: "uz", topic: "Arxitekturaviy grafika, kurs loyihasini rasmiylashtirish", benefit_description: "Interyer va muhit ob'yektlarini AutoCAD, 3ds Max, SketchUp, Photoshop da tasvirlash va listga chiqarish bo'yicha uslubiy ko'rsatma.", resource_type: "book", pdf_url: "https://api.ziyonet.uz/uploads/books/251467/5fa91bf3df2b5.pdf", web_url: "https://ziyonet.uz/", verification_note: "✅ PDF tekshirildi (40 bet, Samarqand, 2020). Manba: ZiyoNET." },
  { stage_number: 1, order_index: 4, title: "Chizma geometriya", author: "Sh. Murodov, L. Hakimov, A. Xolmurzayev", year: "2008", language: "uz", topic: "Ortogonal proyeksiyalar, sirtlar, perspektiva", benefit_description: "Oliy o'quv yurtlari uchun darslik: Monj usuli, perspektiva va soyalar — arxitektura chizmasining nazariy asosi.", resource_type: "book", pdf_url: "https://api.ziyonet.uz/uploads/books/251467/5fc9ec6d04ebd.pdf", web_url: "https://ziyonet.uz/", verification_note: "✅ PDF tekshirildi (296 bet, «Iqtisod-Moliya», 2008). Manba: ZiyoNET." },
  { stage_number: 3, order_index: 5, title: "«Loyihalash» fanidan «Stilizatsiya» kurs ishi uchun uslubiy ko'rsatma", author: "SamDAQI, «Landshaft dizayni va interyer» kafedrasi", year: "2015", language: "uz", topic: "Kompozitsiya, stilizatsiya, dizayn loyihasi", benefit_description: "Dizayn va arxitektura talabalari uchun kompozitsiya va listni rasmiylashtirish bo'yicha amaliy ko'rsatma.", resource_type: "book", pdf_url: "https://api.ziyonet.uz/uploads/books/697320/5affb0bacef62.pdf", web_url: "https://ziyonet.uz/", verification_note: "✅ PDF tekshirildi (28 bet, Samarqand, 2015). Manba: ZiyoNET." },
  { stage_number: 5, order_index: 6, title: "Arxitektura ashyoshunosligi", author: "E. Qosimov", year: "2016", language: "uz", topic: "Qurilish va pardozlash materiallari", benefit_description: "Pardozlash vedomosti va spetsifikatsiya tuzishda materiallarni to'g'ri nomlash va tanlash uchun.", resource_type: "book", pdf_url: "https://api.ziyonet.uz/uploads/books/719417/5891b87994724.pdf", web_url: "https://ziyonet.uz/", verification_note: "✅ PDF tekshirildi (121 bet, «Noshir», 2016). Manba: ZiyoNET." },
  { stage_number: 5, order_index: 7, title: "Bino va inshootlar konstruksiyasi", author: "N.J. To'ychiyev", year: "2010", language: "uz", topic: "Konstruktiv elementlar, poydevorlar, olovbardoshlik", benefit_description: "Kesim va tugunlarni chizishda konstruksiyalarning to'g'ri tuzilishini tushunish uchun darslik.", resource_type: "book", pdf_url: "https://lib.utu-ranch.uz/media/files/2024/08/29/%D0%91%D0%B8%D0%BD%D0%BE_%D0%B2%D0%B0_%D0%B8%D0%BD%D1%88%D0%BE%D0%BE%D1%82%D0%BB%D0%B0%D1%80_%D0%BA%D0%BE%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%86%D0%B8%D1%8F%D1%81%D0%B8_2010.pdf", web_url: "https://lib.utu-ranch.uz/", verification_note: "✅ PDF tekshirildi (240 bet, «Voris nashriyot», 2010). Manba: OTM elektron kutubxonasi." },
  { stage_number: 5, order_index: 8, title: "Ergonomika", author: "B.I. G'oyibov", year: "2013", language: "uz", topic: "Antropometriya, ish o'rni, mebel o'lchamlari", benefit_description: "Interyer rejasida mebel atrofidagi bo'sh joy va jihozlar o'lchamini asoslash uchun.", resource_type: "book", pdf_url: "https://www.ziyouz.com/books/kollej_va_otm_darsliklari/texnika_va_texnologiya/Ergonomika%20(B.G%27oyibov).pdf", web_url: "https://www.ziyouz.com/", verification_note: "✅ PDF tekshirildi (200 bet, «Tafakkur bo'stoni», 2013). Manba: Ziyouz kutubxonasi." },
  { stage_number: 4, order_index: 9, title: "ГОСТ Р 21.1101-2013 — Основные требования к проектной и рабочей документации", author: "Rosstandart", year: "2013", language: "ru", topic: "Albom tarkibi, «Umumiy ma'lumotlar», shtamplar, markalar", benefit_description: "SHNQ 1.03.03-23 (10-band) chizmalarni aynan shu standart bo'yicha bajarishni talab qiladi.", resource_type: "standard", pdf_url: null, web_url: WS("ГОСТ Р 21.1101—2013"), verification_note: "ℹ️ O'zbekistonda SHNQ 1.03.03-23 havola qiladi. Rossiyada 01.01.2021 dan ГОСТ Р 21.101-2020 bilan almashtirilgan. To'liq matn: Vikiteka." },
  { stage_number: 4, order_index: 10, title: "ГОСТ 21.501-2018 — Правила выполнения рабочей документации архитектурных и конструктивных решений", author: "MGS (davlatlararo kengash)", year: "2018", language: "ru", topic: "AR va KR ishchi chizmalari qoidalari, jadval shakllari", benefit_description: "Planlar, kesimlar, fasadlar, tugunlar va spetsifikatsiya shakllarining batafsil qoidalari.", resource_type: "standard", pdf_url: null, web_url: "https://meganorm.ru/Index/70/70538.htm", verification_note: "ℹ️ Rossiyada 01.06.2019 dan amalda (21.501-2011 o'rniga). O'zbekistondagi ShNQ 1.03.04-22 hali GOST 21.501-93 ga havola qiladi — qaysi tahrir qo'llanishini kelishing." },
  { stage_number: 2, order_index: 11, title: "ГОСТ 21.201-2011 — Условные графические изображения элементов зданий, сооружений и конструкций", author: "MGS", year: "2011", language: "ru", topic: "Devor, o'yiq, zinapoya va materiallarning shartli belgilari", benefit_description: "Plan va kesimdagi shartli belgilarni to'g'ri chizish uchun asosiy standart.", resource_type: "standard", pdf_url: null, web_url: WS("ГОСТ 21.201—2011"), verification_note: "✅ Davlatlararo standart, 01.05.2013 dan amalda. To'liq matn: Vikiteka." },
  { stage_number: 6, order_index: 12, title: "SHNQ 1.03.03-23 — Qurilish obyektlarini loyihalashtirish", author: "Qurilish va uy-joy kommunal xo'jaligi vazirligi", year: "2024", language: "uz", topic: "Loyihalash bosqichlari, loyiha bo'limlari, energiya samaradorligi", benefit_description: "O'zbekistonda loyiha qanday bosqichlarda va qaysi bo'limlar bilan ishlab chiqilishini belgilaydi.", resource_type: "standard", pdf_url: null, web_url: LEX(6905975), verification_note: "✅ Amalda. Buyruq 01/2-6 (26.03.2024), Adliya vazirligida 29.04.2024 da 247-raqam. SHNQ 1.03.01-16 o'rniga." },
  { stage_number: 6, order_index: 13, title: "SHNQ 2.08.01-24 — Turar joy obyektlarini loyihalash", author: "Qurilish va uy-joy kommunal xo'jaligi vazirligi", year: "2024", language: "uz", topic: "Kvartira va xonalar maydoni, balandlik, dahliz, zinapoya", benefit_description: "Kvartira rejasi va interyer loyihasida eng ko'p kerak bo'ladigan hujjat.", resource_type: "standard", pdf_url: null, web_url: LEX(7121730), verification_note: "✅ Amalda (25.09.2024 dan). 21.01.2026 da o'zgartirish kiritilgan. SHNQ 2.08.01-19 o'rniga." },
  { stage_number: 6, order_index: 14, title: "SHNQ 2.08.02-23 — Jamoat binolari va inshootlari", author: "Qurilish va uy-joy kommunal xo'jaligi vazirligi", year: "2024", language: "uz", topic: "Yo'laklar, chiqishlar, zinapoyalar, kafe va do'konlar", benefit_description: "Kafe, do'kon, ofis va boshqa jamoat binolari interyerida asosiy me'yorlar.", resource_type: "standard", pdf_url: null, web_url: LEX(6920040), verification_note: "✅ Amalda (07.08.2024 dan). Buyruq 01/2-7 (02.04.2024). ShNQ 2.08.02-09 o'rniga." },
  { stage_number: 6, order_index: 15, title: "QMQ 2.01.03-19 — Seysmik hududlarda qurilish", author: "O'zbekiston Respublikasi Qurilish vazirligi", year: "2019", language: "ru", topic: "7, 8, 9 ballik hududlarda konstruksiyalar", benefit_description: "Kesim va konstruktiv tugunlarda seysmik talablarni hisobga olish uchun.", resource_type: "standard", pdf_url: null, web_url: "http://lib.tiet.uz/file/20240219072553.pdf", verification_note: "✅ Amalda (2024–2026-yillardagi ShNQ larda havola qilinadi). KMK 2.01.03-96 o'rniga. Havola — rasmiy nashr nusxasi (rus tilida, 111 bet)." },
  { stage_number: 7, order_index: 16, title: "ShNQ 1.03.04-22 — Namunaviy loyiha hujjatlari", author: "O'zbekiston Respublikasi Qurilish vazirligi", year: "2022", language: "uz", topic: "Loyiha hujjatlari tarkibi, bosqichlar, bosh muhandis", benefit_description: "Rasmiy loyiha hujjatlari qanday tarkibda va qaysi standartlar bo'yicha tuzilishini ko'rsatadi.", resource_type: "standard", pdf_url: "https://mc.uz/uploads/mcuz_99811688333360.pdf", web_url: "https://mc.uz/", verification_note: "✅ Amalda. Buyruq 69-son (19.04.2022), Adliya vazirligida 25.04.2022 da 78-raqam. Rasmiy PDF (mc.uz)." },
  { stage_number: 7, order_index: 17, title: "ShNQ 1.04.02-22 — Turar joy obyektlarini mukammal ta'mirlash va rekonstruksiya qilish", author: "Qurilish va uy-joy kommunal xo'jaligi vazirligi", year: "2024", language: "uz", topic: "Qayta rejalashtirish, ho'l zonalar, ventilyatsiya", benefit_description: "Interyer ishchi albomidagi demontaj va montaj rejalari shu hujjatga mos bo'lishi kerak.", resource_type: "standard", pdf_url: null, web_url: LEX(7034724), verification_note: "✅ Amalda (22.07.2024 dan). ShNQ 1.04.02-05 o'rniga." },
  { stage_number: 7, order_index: 18, title: "SHNQ 2.01.05-24 — Tabiiy va sun'iy yoritish", author: "Qurilish va uy-joy kommunal xo'jaligi vazirligi", year: "2024", language: "uz", topic: "Lyuks me'yorlari, TYOK (KEO)", benefit_description: "Interyer yoritish rejasini me'yor bo'yicha tekshirish uchun.", resource_type: "standard", pdf_url: null, web_url: LEX(7218587), verification_note: "✅ Amalda (25.10.2024 dan). QMQ 2.01.05-19 o'rniga." },
  { stage_number: 8, order_index: 19, title: "Autodesk Revit — rasmiy yordam (Help)", author: "Autodesk", year: "2025", language: "en", topic: "Sheets, Views, Schedules, View Templates, Phasing", benefit_description: "Revit'dagi har bir buyruq va hujjat chiqarish jarayonining rasmiy tavsifi.", resource_type: "revit_guide", pdf_url: null, web_url: "https://help.autodesk.com/view/RVT/2025/ENU/", verification_note: "✅ Rasmiy sahifa, bepul (ingliz tilida)." },
  { stage_number: 8, order_index: 20, title: "Paul F. Aubin — Revit bo'yicha kitoblar («Revit Essentials for Architecture», «The Aubin Academy: Revit Architecture»)", author: "Paul F. Aubin", year: "2010-yillar", language: "en", topic: "Revit'da loyiha hujjatlari, oilalar (families), BIM", benefit_description: "Revit'da professional hujjat chiqarishni chuqur o'rganish uchun; muallifning rasmiy sahifasida kitoblar ro'yxati.", resource_type: "revit_guide", pdf_url: null, web_url: "https://paulaubin.com/books/", verification_note: "ℹ️ Pullik kitoblar — bepul PDF yo'q. Havola muallifning rasmiy sahifasiga." }
];

// ---------------- JADVALLAR ----------------
const VERIFIED_TABLES = [
  {
    table_key: "top_10_sources",
    title: "ENG MUHIM 10 TA MANBA (TOP-10)",
    subtitle: "Barcha havolalar tekshirilgan (24.10.2026): hujjat yoki kitobning o'ziga olib boradi",
    columns: ["№", "Manba", "Nimani o'rgatadi", "Holati / izoh", "Havola"],
    rows: [
      ["1", "SHNQ 2.08.01-24", "Kvartira va xonalar me'yorlari", "AMALDA", LEX(7121730)],
      ["2", "SHNQ 1.03.03-23", "Loyihalash bosqichlari va bo'limlari", "AMALDA", LEX(6905975)],
      ["3", "ГОСТ Р 21.1101-2013", "Albom tarkibi, shtamplar, markalar", "SHNQ 1.03.03-23 havola qiladi", WS("ГОСТ Р 21.1101—2013")],
      ["4", "ГОСТ 21.501-2018", "AR/KR ishchi chizmalari qoidalari", "RF da amalda; UZ da 21.501-93 ham uchraydi", "https://meganorm.ru/Index/70/70538.htm"],
      ["5", "ГОСТ 21.201-2011", "Shartli grafik belgilar", "AMALDA", WS("ГОСТ 21.201—2011")],
      ["6", "ГОСТ 2.302-68 / 2.303-68", "Masshtablar va chiziqlar", "AMALDA", WS("ГОСТ 2.302—68")],
      ["7", "ShNQ 1.04.02-22", "Qayta rejalashtirish (interyer)", "AMALDA", LEX(7034724)],
      ["8", "SHNQ 2.01.05-24", "Yoritish me'yorlari", "AMALDA", LEX(7218587)],
      ["9", "M.K. Xalimov — «Chizmachilik»", "Proyeksion chizmachilik (o'zbek tilida)", "PDF, 2013", "https://n.ziyouz.com/books/kollej_va_otm_darsliklari/matematika/Chizmachilik.%20Geometrik%20va%20proyeksion%20chizmachilik%20(M.Xalimov).pdf"],
      ["10", "Autodesk Revit Help", "Revit'da hujjat chiqarish", "Rasmiy, bepul", "https://help.autodesk.com/view/RVT/2025/ENU/"]
    ],
    order_index: 1
  },
  {
    table_key: "uzbekistan_norms",
    title: "O‘zbekiston Normativ Hujjatlari (ShNQ / QMQ)",
    subtitle: "Holati lex.uz dagi rasmiy sahifadan tekshirilgan (24.10.2026)",
    columns: ["№", "Hujjat", "Nomi", "Tasdiqlangan", "Holati", "Rasmiy manba"],
    rows: [
      ["1", "SHNQ 1.03.03-23", "Qurilish obyektlarini loyihalashtirish", "26.03.2024", "AMALDA", LEX(6905975)],
      ["2", "SHNQ 2.08.01-24", "Turar joy obyektlarini loyihalash", "14.08.2024", "AMALDA", LEX(7121730)],
      ["3", "SHNQ 2.08.01-19", "Turar joy binolari", "15.10.2019", "KUCHINI YO‘QOTGAN", LEX(5894699)],
      ["4", "SHNQ 2.08.02-23", "Jamoat binolari va inshootlari", "02.04.2024", "AMALDA", LEX(6920040)],
      ["5", "SHNQ 2.08.04-22", "Ma'muriy binolar", "14.08.2024", "AMALDA", LEX(7114475)],
      ["6", "SHNQ 2.07.01-23", "Aholi punktlari hududlarini rejalashtirish", "20.05.2024", "AMALDA", LEX(7024185)],
      ["7", "SHNQ 2.07.01-03*", "Shaharsozlik (eski tahrir)", "2009", "KUCHINI YO‘QOTGAN", LEX(4444163)],
      ["8", "SHNQ 2.07.02-24", "Nogironlar va keksalar ehtiyojini inobatga olib loyihalash", "08.01.2025", "AMALDA", LEX(7346244)],
      ["9", "SHNQ 2.01.05-24", "Tabiiy va sun'iy yoritish", "26.09.2024", "AMALDA", LEX(7218587)],
      ["10", "ShNQ 1.04.02-22", "Turar joyni mukammal ta'mirlash va rekonstruksiya", "09.07.2024", "AMALDA", LEX(7034724)],
      ["11", "QMQ 2.01.03-19", "Seysmik hududlarda qurilish", "2019", "AMALDA", "http://lib.tiet.uz/file/20240219072553.pdf"]
    ],
    order_index: 2
  },
  {
    table_key: "spds_gost_standards",
    title: "СПДС / GOST Standartlari Tizimi",
    subtitle: "Har bir standart uchun: nima uchun kerak va hozirgi holati",
    columns: ["№", "Standart", "Nomi", "Asosiy qoida", "Holati", "Matn"],
    rows: [
      ["1", "ГОСТ Р 21.1101-2013", "Основные требования к проектной и рабочей документации", "Albom tarkibi, «Umumiy ma'lumotlar», shtamplar, to'plam markalari (AR, AS, AI, KJ, VK, OV, EO)", "UZ: SHNQ 1.03.03-23 havola qiladi; RF: 2021 dan ГОСТ Р 21.101-2020", WS("ГОСТ Р 21.1101—2013")],
      ["2", "ГОСТ 21.501-2018", "Правила выполнения рабочей документации АР и КР", "Planlar, kesimlar, fasadlar, tugunlar va jadval shakllari", "RF: 01.06.2019 dan; UZ ShNQ 1.03.04-22 da 21.501-93", "https://meganorm.ru/Index/70/70538.htm"],
      ["3", "ГОСТ 21.201-2011", "Условные графические изображения элементов зданий", "Devor, o'yiq, zinapoya, materiallarning shartli belgilari", "AMALDA (01.05.2013 dan)", WS("ГОСТ 21.201—2011")],
      ["4", "ГОСТ 2.301-68", "Форматы", "A0 841×1189, A1 594×841, A2 420×594, A3 297×420, A4 210×297 mm", "AMALDA", WS("ГОСТ 2.301—68")],
      ["5", "ГОСТ 2.302-68", "Масштабы", "1:2…1:1000 ro'yxati (1:75 bor, 1:30 yo'q)", "AMALDA", WS("ГОСТ 2.302—68")],
      ["6", "ГОСТ 2.303-68", "Линии", "Asosiy chiziq s = 0,5–1,4 mm; ingichka s/3–s/2", "AMALDA", WS("ГОСТ 2.303—68")],
      ["7", "ГОСТ 2.304-81", "Шрифты чертёжные", "Shrift o'lchamlari: 2,5; 3,5; 5; 7; 10; 14 … mm", "AMALDA", WS("ГОСТ 2.304—81")]
    ],
    order_index: 3
  }
];

module.exports = { STAGE_LESSONS, STAGE_TOPIC_OVERRIDES, VERIFIED_RESOURCES, VERIFIED_TABLES };
