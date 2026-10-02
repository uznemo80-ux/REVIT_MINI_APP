// rabochkaProcessData.js
// 21 ta bosqichdan iborat Interyer Rabochka Qilish Jarayoni (Рабочая документация) ma'lumotlar bazasi

const RABOCHKA_PROCESS_STEPS = [
  {
    "step_number": "01",
    "slug": "01-umumiy-malumotlar-titul",
    "title": "Umumiy ma'lumotlar va Titul varag‘i",
    "lead": "Ishchi loyiha (Рабочая документация) albomining mundarijasi, shartli belgilar, tushuntirish xati va qonuniy me'yorlari.",
    "content_summary": "Bu varaq quruvchi, usta va buyurtmachi uchun loyihaning pasporti hisoblanadi. Chizmalarni qanday o‘qish, masshtablar, xonalar eksplikatsiyasi va barcha belgilashlar shu yerda jamlanadi.",
    "sheets": [
      "Titul varag‘i (Лист обложки)",
      "Chizmalar ro‘yxati (Ведомость чертежей)",
      "Tushuntirish xati (Пояснительная записка)",
      "Xonalar eksplikatsiyasi (Экспликация помещений)",
      "Shartli belgilar (Условные обозначения)"
    ],
    "rules": [
      "Barcha chizmalar millimetrda (mm) berilishi qat'iy shart.",
      "Nisbiy 0.000 sathi sifatida birinchi qavat toza pol sathi qabul qilinadi.",
      "Har qanday tafovut aniqlanganda, usta o‘zboshimchalik qilmasdan loyiha muallifiga murojaat qilishi shart."
    ]
  },
  {
    "step_number": "02",
    "slug": "02-obmer-mavjud-holat",
    "title": "Обмер / Mavjud holat chizmasi",
    "lead": "Ob’yektning ta'mirdan oldingi haqiqiy geometriyasi, mavjud devorlari, balandliklari va muhandislik shaxtalari.",
    "content_summary": "Qurilish boshlanishida nima borligini ko‘rsatuvchi tayanch chizma. Barcha yangi chizmalar aynan shu mavjud holat ustiga quriladi.",
    "sheets": [
      "Mavjud holat rejasi (Обмерный план)",
      "Balandliklar va rigellar sxemasi",
      "Mavjud kommunikatsiyalar bog‘lamasi"
    ],
    "rules": [
      "Devorlarning qalinligi va materiali (g‘isht, monolit, gazoblok) alohida shtrixovka bilan ko‘rsatiladi.",
      "Ventilyatsiya va kanalizatsiya stoyaklarining aniq o‘lchamlari va ularga bog‘lanishlar beriladi."
    ]
  },
  {
    "step_number": "03",
    "slug": "03-demontaj-rejasi",
    "title": "Demontaj rejasi (План демонтажа)",
    "lead": "Buzilishi, olib tashlanishi va kengaytirilishi kerak bo‘lgan eski devorlar, eshik o‘rinlari va to‘siqlar chizmasi.",
    "content_summary": "Ustalar qaysi devorni buzish kerakligini adashtirmasligi uchun demontaj qilinadigan barcha elementlar qizil rang yoki maxsus shtrix bilan aniq ko‘rsatiladi.",
    "sheets": [
      "Demontaj qilinadigan devorlar rejasi",
      "Demontaj qilinadigan eshik va deraza bloklari",
      "Chiqindi hajmi spetsifikatsiyasi"
    ],
    "rules": [
      "Yuk ko‘taruvchi (monolit) devor va kolonnalarni buzish qat'iyan taqiqlanadi deb qizil ramkada yozilishi shart.",
      "Buziladigan qismlarning balandligi va hajmi (m³) ko‘rsatiladi."
    ]
  },
  {
    "step_number": "04",
    "slug": "04-montaj-rejasi",
    "title": "Montaj rejasi (План монтажа перегородок)",
    "lead": "Yangi quriladigan oraliq devorlar, GKL to‘siqlar, dekorativ nishalar va yangi eshik o‘rinlari chizmasi.",
    "content_summary": "Devor ustalari uchun asosiy yo‘riqnoma. Har bir yangi devor qaysi materialdan (gazoblok 100mm, gipsokarton 100mm, g‘isht) qurilishi aniq ko‘rsatiladi.",
    "sheets": [
      "Yangi devorlar montaj rejasi",
      "GKL karkas va nishalar konstruksiyasi kesimlari",
      "Eshik o‘rni parametrlar jadvali"
    ],
    "rules": [
      "Eshik o‘rni kengligi eshik polotnosidan 80-100 mm kengroq bo‘lishi shart.",
      "Devorlarning bir-biri bilan 90° burchak hosil qilishi kerak bo‘lgan zonalari maxsus belgi bilan ajratiladi."
    ]
  },
  {
    "step_number": "05",
    "slug": "05-olchamlar-rejasi",
    "title": "O‘lchamlar rejasi (Кладочный / Размерочный план)",
    "lead": "Yangi qurilgan xonalarning barcha devorlari, burchaklari va oraliqlarining to‘liq zanjirsimon o‘lchamlari.",
    "content_summary": "Har bir xonaning ichki toza o‘lchamlari, mebellar uchun ajratilgan nishalar kengligi va umumiy gabarit o‘lchamlar.",
    "sheets": [
      "Xonalar o‘lchamlari rejasi",
      "Nishalar va dekorativ bo‘rtmalar bog‘lamasi",
      "Tozalangan xonalar eksplikatsiyasi"
    ],
    "rules": [
      "O‘lcham zanjirlari uzluksiz bo‘lishi va umumiy xona o‘lchamiga teng kelishi kerak.",
      "Pardozlash qatlami qalinligi (shtukaturka 15-20 mm) hisobga olingan yoki olinmaganligi izohda yoziladi."
    ]
  },
  {
    "step_number": "06",
    "slug": "06-pol-rejasi",
    "title": "Pol qoplamalari rejasi (План полов)",
    "lead": "Pol materiallari turlari, yotqizish yo‘nalishi, tutashma choklari, sath farqlari va plintuslar.",
    "content_summary": "Laminat, parket, kafel va vinilning qayerda tugab qayerda boshlanishi, eshik ostidagi tutashma chiziqlari aniq ko‘rsatiladi.",
    "sheets": [
      "Pol materiallari rejasi",
      "Pol sathlari va qalinliklari kesimi (Пирог пола)",
      "Tutashma profillari va deformatsion choklar sxemasi"
    ],
    "rules": [
      "Turli materiallar tutashmasi eshik polotnosi yopilganda uning ostida qolishi shart.",
      "Plintus va теневой профиль pol materiali sifatida emas, alohida chizma elementi sifatida beriladi."
    ]
  },
  {
    "step_number": "07",
    "slug": "07-shift-rejasi",
    "title": "Shift konstruksiyalari rejasi (План потолков)",
    "lead": "Shift balandliklari, GKL karkas pog‘onalari, karniz nishalari, soya profillari va revizion lyuklar.",
    "content_summary": "Shift ustalari uchun reja: qayerda shift qancha pastga tushadi, parda nishasi qayerda joylashadi, yashirin chiziqlar qanday o‘rnatiladi.",
    "sheets": [
      "Shift sathi va materiallari rejasi",
      "Shift kesimlari va karkas detallari",
      "Parda nishasi va karniz tugunlari"
    ],
    "rules": [
      "Har bir zona uchun toza pol sathidan shiftgacha bo‘lgan aniq balandlik (masalan: +2750 mm) ko‘rsatiladi.",
      "Parda nishasi kengligi kamida 180-200 mm bo‘lishi shart (radiator va deraza tokchasini hisobga olgan holda)."
    ]
  },
  {
    "step_number": "08",
    "slug": "08-pardozlash-rejasi",
    "title": "Pardozlash rejasi (План отделки помещений)",
    "lead": "Har bir devor va xonaning pardozlash turi: bo‘yoq kodi, oboy artikuli, dekorativ panellar va plitkalar.",
    "content_summary": "Xona devorlari qanday material bilan qoplanishi kodlar bilan ko‘rsatiladi (masalan: С-01 - Tikkurila F484, С-02 - MDF panel).",
    "sheets": [
      "Xonalar bo‘yicha devor pardozlash rejasi",
      "Pardozlash materiallari shifrlari jadvali",
      "Ranglar palitrasi kartasi"
    ],
    "rules": [
      "Har bir material kodi albomdagi materiallar spetsifikatsiyasi bilan 100% mos kelishi shart."
    ]
  },
  {
    "step_number": "09",
    "slug": "09-devor-razvertkalari",
    "title": "Devor razvertkalari (Развертки стен)",
    "lead": "Barcha muhim xonalar (oshxona, sanuzel, yotoqxona, zal) devorlarining to‘liq frontal yoyilmasi.",
    "content_summary": "Har bir devor alohida ko‘rinishda chiziladi: plitka choklari, rozetkalar balandligi, mebel balandligi, ko‘zgu va chiroqlar koordinatalari.",
    "sheets": [
      "Sanuzel devorlari razvertkalari (plitka choklari bilan)",
      "Oshxona ishchi devori razvertkasi (fartuk va rozetkalar)",
      "Mehmonxona TV-zona va yotoqxona spinka razvertkalari"
    ],
    "rules": [
      "Rozetkalar va kalitlar mebel yoki dekorativ moldinglar bilan kesishmasligi aniq ko‘rsatiladi.",
      "Plitka kesimlari (podrezkalar) ko‘zga tashlanmaydigan burchaklarga yashiriladi."
    ]
  },
  {
    "step_number": "10",
    "slug": "10-elektr-va-rozetkalar",
    "title": "Elektr jihozlari va Rozetkalar rejasi",
    "lead": "Barcha 220V rozetkalar, USB, TV, internet nuqtalari, ularning aniq balandliklari va o‘qlari.",
    "content_summary": "Elektrchilar uchun asosiy chizma. Har bir rozetkaning devor burchagidan masofasi va poldan balandligi (h=+300, h=+900, h=+1100).",
    "sheets": [
      "Kuchlanish rozetkalari rejasi",
      "Past kuchlanishli tarmoqlar (TV, Internet, Wi-Fi, Domofon, Smart Home)",
      "Oshxona maishiy texnikasi rozetkalar sxemasi"
    ],
    "rules": [
      "Muzlatgich, duxovka, idish yuvish mashinasi rozetkalari texnika ortida emas, yonidagi shkafda (h=+100 mm) bo‘lishi lozim.",
      "Sanuzel rozetkalari suv manbalaridan kamida 600 mm uzoqda va IP44 himoyalangan bo‘lishi shart."
    ]
  },
  {
    "step_number": "11",
    "slug": "11-santexnika-rejasi",
    "title": "Santexnika va Suv ta'minoti rejasi",
    "lead": "Suv va kanalizatsiya chiqish nuqtalari, vodorozetkalar balandligi, traplar va revizion lyuklar joylashuvi.",
    "content_summary": "Santexniklar uchun chizma: rakovina, unitaz, dush, vanna, kir yuvish va idish yuvish mashinalarining ulanish o‘qlari.",
    "sheets": [
      "Santexnika nuqtalari bog‘lamasi rejasi",
      "Suv taqsimlash kollektori va filtrlar tuguni sxemasi",
      "Kanalizatsiya trassalari va traplar qiyaligi"
    ],
    "rules": [
      "Gidroizolyatsiya chegaralari va trap qiyaligi qat'iy ko‘rsatiladi.",
      "Suv rozetkalari oraliq masofasi (smesitel uchun) aniq 150 mm bo‘lishi shart."
    ]
  },
  {
    "step_number": "12",
    "slug": "12-ventilyatsiya-va-konditsioner",
    "title": "Klimat va Ventilyatsiya rejasi (ОВиК)",
    "lead": "Konditsioner ichki va tashqi bloklari, freon trassalari, drenaj yo‘nalishlari va ventilyatsiya panjaralari.",
    "content_summary": "Konditsioner ustalari uchun ko‘rsatma: split-tizimlar qayerga osiladi, drenaj qayerga oqiziladi (kanalizatsiyaga quruq sifon orqali).",
    "sheets": [
      "Konditsioner va shamollatish rejasi",
      "Freon va drenaj trassalari sxemasi",
      "Ventilyatsiya kanallari va diffuzorlar"
    ],
    "rules": [
      "Konditsioner havosi to‘g‘ridan-to‘g‘ri krovat yoki divanda o‘tirgan odamga urilmasligi kerak.",
      "Drenaj trubasining o‘z-o‘zidan oqish nishabligi kamida 1 metrga 1-2 sm bo‘lishi shart."
    ]
  },
  {
    "step_number": "13",
    "slug": "13-oshxona-chizmasi",
    "title": "Oshxona mebeli va kommunikatsiyalari chizmasi",
    "lead": "Oshxona garnituri modullari, stoleshnitsa, fartuk, o‘rnatma texnika va ularning muhandislik bog‘lamalari.",
    "content_summary": "Oshxona ustalari va montajchilar uchun maxsus varaq: pastki/yuqori shkaflar, penal, vityajka va rozetkalar joylashuvi.",
    "sheets": [
      "Oshxona modullari rejasi va fasadlari",
      "Oshxona kommunikatsiyalari (suv, elektr, ventilyatsiya) bog‘lamasi",
      "Oshxona fartuki razvertkasi"
    ],
    "rules": [
      "Vityajka rozetkasi va havo trubasi aniq o‘qda bo‘lishi kerak.",
      "Idish yuvish mashinasi (posudomoyka) rakovinaga yaqin (1 metr ichida) joylashishi shart."
    ]
  },
  {
    "step_number": "14",
    "slug": "14-individual-mebel-chizmalari",
    "title": "Individual mebellar texnik chizmalari",
    "lead": "Buyurtma asosida tayyorlanadigan shkaflar, krovat, TV-zona, dahliz mebeli va stollarning texnik loyihasi.",
    "content_summary": "Mebel sexiga topshiriladigan chizmalar: Шкаф №01, Тумба №01, ТВ-зона №01, tashqi ko‘rinishi, ichki polkalari, gabaritlari va materiallari.",
    "sheets": [
      "Garderob va o‘rnatma shkaflar ichki tuzilishi",
      "Vanna xonasi mebellari va rakovina tagliklari",
      "TV-zona dekorativ konstruktsiyasi kesimlari"
    ],
    "rules": [
      "Kiyim ilish bo‘limining toza balandligi uzun kiyimlar uchun kamida 1400-1500 mm bo‘lishi kerak.",
      "Shkaf sokoli (tagligi) balandligi devor plintusi balandligidan kam bo‘lmasligi lozim."
    ]
  },
  {
    "step_number": "15",
    "slug": "15-eshiklar-vedomosti",
    "title": "Eshiklar va O‘rinlar vedomosti",
    "lead": "Barcha xonalararo eshiklar o‘lchami, ochilish yo‘nalishi (chap/o‘ng), polotno turi, qulf va tutqichlar.",
    "content_summary": "Eshik sotuvchilari va o‘rnatuvchilar uchun jadval: har bir eshikning modeli, o‘lchami (masalan: 800x2000 mm), qutisi va ochilish yo‘nalishi.",
    "sheets": [
      "Eshiklar joylashuvi va ochilish yo‘nalishlari rejasi",
      "Eshiklar spetsifikatsiyasi jadvali",
      "Yashirin eshiklar (Invisible) montaj tugunlari"
    ],
    "rules": [
      "Sanuzel eshigi qoidaga ko‘ra tashqariga ochilishi kerak (xavfsizlik talabi).",
      "Yashirin eshiklar devor shpaklyovka qilinishidan oldin, qora ish paytida o‘rnatiladi."
    ]
  },
  {
    "step_number": "16",
    "slug": "16-yoritish-guruhi-va-kalitlar",
    "title": "Yoritish guruhlari va Boshqarish sxemasi",
    "lead": "Chiroqlar joylashuvi, yoritish guruhlari, 1-2 klavishli kalitlar, prokhodnoy (o‘tuvchi) kalitlar va dimmerlar.",
    "content_summary": "Qaysi kalit qaysi chiroqni yoqishini ko‘rsatuvchi mantiqiy bog‘lovchi chizma chiziqlari.",
    "sheets": [
      "Yoritgichlar joylashuvi rejasi",
      "Kalitlar bog‘lamasi va boshqaruv guruhlari sxemasi",
      "Yoritish ssenariylari jadvali"
    ],
    "rules": [
      "Kalitlar xonaga kirishda eshik tutqichi tomonidan 900 mm balandlikda bo‘lishi lozim.",
      "Yotoqxonada krovat yonida va dahliz boshida o‘tuvchi (prokhodnoy) kalitlar ko‘zda tutiladi."
    ]
  },
  {
    "step_number": "17",
    "slug": "17-yoritish-spetsifikatsiyasi",
    "title": "Yoritgichlar spetsifikatsiyasi",
    "lead": "Loyiha uchun tanlangan barcha chiroqlar, lyustralar, spotlar va LED tasmalarning to‘liq katalogi.",
    "content_summary": "Har bir chiroq kodi (L-01, L-02), modeli, quvvati, rang harorati (3000K), gabarit o‘lchami va soni ko‘rsatilgan jadval.",
    "sheets": [
      "Yoritgichlar to‘liq spetsifikatsiyasi",
      "LED lenta quvvat bloklari va kontrollerlar hisobi"
    ],
    "rules": [
      "Bitta xonadagi asosiy yoritishning rang harorati bir xil (masalan: 3000K iliq oq) bo‘lishi lozim."
    ]
  },
  {
    "step_number": "18",
    "slug": "18-materiallar-spetsifikatsiyasi",
    "title": "Pardozlash materiallari vedomosti",
    "lead": "Laminat, parket, kafel, plitka, bo‘yoq, oboy va boshqa pardozlash materiallarining aniq hisob-kitobi.",
    "content_summary": "Smetachilar va xarid bo‘limi uchun jadval: qaysi materialdan qancha kvadrat metr (m²) yoki dona kerakligi, 10-15% zaxira (zapas) bilan hisoblangan.",
    "sheets": [
      "Pol materiallari sarf miqdori jadvali",
      "Devor pardozlash materiallari vedomosti",
      "Mini App Materiallar kutubxonasi havolalari"
    ],
    "rules": [
      "Plitka va pol qoplamalari diagonali yoki murakkab terilishida kamida 10-15% qiyqim (podrezka) zaxirasi qo‘shiladi."
    ]
  },
  {
    "step_number": "19",
    "slug": "19-jihozlar-spetsifikatsiyasi",
    "title": "Santexnika va Mebellar vedomosti",
    "lead": "Unitaz, vanna, smesitellar, maishiy texnikalar va tayyor mebellarning to‘liq ro‘yxati.",
    "content_summary": "Xarid qilinadigan barcha tayyor buyumlar: modeli, ishlab chiqaruvchisi, o‘lchamlari, narxi va do‘kon havolalari.",
    "sheets": [
      "Santexnika jihozlari spetsifikatsiyasi",
      "Maishiy texnikalar spetsifikatsiyasi",
      "Tayyor mebel va dekor buyumlari jadvali"
    ],
    "rules": [
      "Santexnika jihozlarining montaj sxemalari ilova qilinishi shart."
    ]
  },
  {
    "step_number": "20",
    "slug": "20-yakuniy-tekshiruv-checklist",
    "title": "Yakuniy tekshiruv (QC Checklist)",
    "lead": "Chizmalar albomini buyurtmachi va quruvchiga topshirishdan oldin sifat nazorati (QA/QC) tekshiruv ro‘yxati.",
    "content_summary": "Dizayner albomni chop etishdan oldin 14 ta asosiy nomuvofiqlikni tekshirib chiqadi.",
    "sheets": [
      "Loyiha mualliflik nazorati chek-varag‘i",
      "Barcha bo‘limlararo to‘qnashuvlarni tekshirish jadvali"
    ],
    "checklist_items": [
      "Plan va 3D vizualizatsiyaning 100% mosligi tekshirildi",
      "Plan va devor razvertkalari o‘lchamlari o‘zaro solishtirildi",
      "Rozetkalar va mebellar to‘qnashuvi yo‘qligi tasdiqlandi",
      "Elektr kalitlari va yoritish guruhlari to‘g‘ri bog‘landi",
      "Santexnika chiqishlari va mebellar mosligi tekshirildi",
      "Shift nishalari va yoritgichlar o‘lchami solishtirildi",
      "Pol tutashmalari eshik polotnolari ostiga to‘g‘ri tushdi",
      "Barcha material kodlari (С-01, П-01) vedomost bilan mos",
      "Barcha chizmalarda zanjirli o‘lchamlar to‘liq qo‘yildi",
      "Markirovka va shartli belgilar to‘liq tushuntirildi",
      "Spetsifikatsiya miqdorlari chizmadagi maydonlar bilan teng",
      "Varaqlar raqamlanishi va mundarija to‘g‘ri tuzildi",
      "Chizma masshtablari va ramka shtamplari to‘ldirildi",
      "Loyiha me'moriy va muhandislik normalariga (SHNQ) muvofiq"
    ]
  },
  {
    "step_number": "21",
    "slug": "21-pdf-albom-yakuniy-loyha",
    "title": "PDF Albom / Yakuniy ishchi loyiha",
    "lead": "Chop etish va qurilish maydoniga taqdim etish uchun to‘liq yig‘ilgan A3 formatdagi ishchi loyiha albomi.",
    "content_summary": "Loyiha yakuni! 21 ta bo‘limdan iborat to‘liq professional ishchi hujjatlar to‘plami PDF formatida eksport qilinadi.",
    "sheets": [
      "01 — Titul va umumiy ma'lumotlar",
      "02 — Obmer (Mavjud holat rejasi)",
      "03 — Demontaj rejasi",
      "04 — Montaj rejasi",
      "05 — O‘lchamlar rejasi",
      "06 — Pol qoplamalari rejasi",
      "07 — Shift konstruksiyalari rejasi",
      "08 — Pardozlash rejasi",
      "09 — Devor razvertkalari",
      "10 — Elektr va rozetkalar rejasi",
      "11 — Santexnika nuqtalari rejasi",
      "12 — Ventilyatsiya va konditsioner rejasi",
      "13 — Oshxona mebeli va kommunikatsiyalari",
      "14 — Individual mebel chizmalari",
      "15 — Eshiklar vedomosti",
      "16 — Yoritish guruhlari va kalitlar sxemasi",
      "17 — Yoritgichlar spetsifikatsiyasi",
      "18 — Materiallar vedomosti",
      "19 — Mebel va jihozlar spetsifikatsiyasi",
      "20 — Yakuniy tekshiruv dalolatnomasi",
      "21 — Albom yakuni va mualliflik muhri"
    ],
    "rules": [
      "Albom A3 gorizontal formatda, o‘qilishi oson shriftlar bilan chiqariladi.",
      "Qurilish maydonida kamida 2 nusxa (biri brigada uchun, biri nazorat uchun) bo‘lishi lozim."
    ]
  }
];

function getRabochkaSteps() {
  return RABOCHKA_PROCESS_STEPS;
}

function getRabochkaStep(slugOrNum) {
  if (!slugOrNum) return null;
  var s = String(slugOrNum).toLowerCase().trim();
  return RABOCHKA_PROCESS_STEPS.find(function (step) {
    return step.slug === s || String(step.step_number) === s;
  }) || null;
}

module.exports = {
  RABOCHKA_PROCESS_STEPS,
  getRabochkaSteps,
  getRabochkaStep
};
