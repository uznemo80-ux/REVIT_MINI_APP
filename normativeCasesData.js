// ======================================================
// YO'RIQNOMALAR (amaliy vaziyatlar) — "nima qilinsa to'g'ri, nima qilinsa noto'g'ri"
// Har bir bosqichdagi majburiy raqamlar normativesVerified.js dagi tekshirilgan hujjat bandlaridan olingan.
// "💡 Tavsiya" deb belgilangan fikrlar — amaliy (ergonomik) maslahat, majburiy norma emas.
// Qadam maydonlari: title, description, document_numbers, law_basis, correct[], wrong[], example
// ======================================================

const SEED_PRACTICAL_CASES = [
  {
    title: "Kvartirani qayta rejalashtirish (pereplanirovka)",
    slug: "kvartira-interyeri",
    icon: "🛋️",
    category: "Interyer",
    subtitle: "Qaysi devorni buzish mumkin, ho'l zonani qayerga ko'chirish taqiqlangan",
    description: "Kvartirada devor olib tashlash, xonalarni birlashtirish, sanuzel va oshxonani ko'chirishda amaldagi ShNQ talablari: ruxsat etilgan va taqiqlangan ishlar misollar bilan.",
    target_user: "Interyer dizaynerlari, kvartira egalari, ta'mirlash ustalari",
    order_index: 1,
    checklist: [
      {
        step_order: 1,
        title: "1. Avval binoning texnik holatini aniqlang",
        description: "Qaysi devor yuk ko'taruvchi ekanini taxmin bilan emas, binoning loyiha hujjatlari yoki texnik tekshiruv (obsledovaniye) xulosasi bilan aniqlang. Rekonstruksiya loyihasi muhandislik izlanishlari va aynan shu binoni tekshirish natijasiga asoslanadi (ShNQ 1.04.02-22, 34-band).",
        is_mandatory: true,
        document_numbers: ["SHNQ 1.04.01-23", "ShNQ 1.04.02-22"],
        law_basis: "ShNQ 1.04.02-22, 34-band; SHNQ 1.04.01-23",
        correct: ["Uy-joy shirkati yoki arxivdan bino loyihasini (AR, KJ) olish", "Shubhali devor uchun konstruktor xulosasini olish"],
        wrong: ["Devorni «taqillatib» yoki qalinligiga qarab yuk ko'taruvchi emas deb hisoblash", "Qo'shnilar ham buzgan, demak mumkin, deb ish boshlash"]
      },
      {
        step_order: 2,
        title: "2. Yuk ko'taruvchi devorlarga tegmang",
        description: "Devor ochish yoki xonani kengaytirish faqat yuk ko'taruvchi devorlar shikastlanmasa ruxsat etiladi (10-band). Qo'shni kvartiralarni birlashtirishda tutashtiruvchi o'yiq eni 0,9 m, balandligi 2,1 m dan oshmasligi va dahliz, yo'lak yoki oshxona to'sig'ida bo'lishi kerak (26-band).",
        is_mandatory: true,
        document_numbers: ["ShNQ 1.04.02-22", "QMQ 2.01.03-19"],
        law_basis: "ShNQ 1.04.02-22, 10 va 26-band",
        correct: ["Oshxona va xona orasidagi yengil to'siq (peregorodka)ni olib tashlash", "Ikki kvartirani dahliz to'sig'ida 0,9 × 2,1 m o'yiq bilan birlashtirish"],
        wrong: ["Monolit diafragma yoki panel devorda 2 m li arka ochish", "Ustun yoki rigelni «ko'rinmasin» deb kesish"],
        example: "Panel uyda mehmonxona va yotoqxona orasidagi 160 mm li devor — odatda yuk ko'taruvchi panel. Uni olib tashlash o'rniga eshik o'yig'ini kattalashtirish ham konstruktor ruxsatisiz mumkin emas."
      },
      {
        step_order: 3,
        title: "3. Ho'l zonalarni yashash xonasi ustiga ko'chirmang",
        description: "Hojatxona va vannaxonani pastdagi qo'shnining yashash xonasi yoki oshxonasi ustiga joylashtirish mumkin emas — ikki sathli kvartiradan tashqari (30-band). Gazli oshxona va vannaxonani yashash xonasi ustiga yoki ostiga joylashtirish ham mumkin emas (29-band).",
        is_mandatory: true,
        document_numbers: ["ShNQ 1.04.02-22"],
        law_basis: "ShNQ 1.04.02-22, 29–30-band",
        correct: ["Sanuzelni koridor yoki omborxona hisobiga kengaytirish", "Vannani o'z sanuzeli ichida joyini almashtirish"],
        wrong: ["Yotoqxonaning bir qismini dush xonasiga aylantirish (pastda qo'shnining yotoqxonasi)", "Gaz plitali oshxonani mehmonxona o'rniga ko'chirish"]
      },
      {
        step_order: 4,
        title: "4. Ventilyatsiya va tabiiy yorug'likni saqlang",
        description: "Bir kvartiradan chiqqan havo boshqa kvartiraga vertikal yo'naltirilmaydi; foydalanilmaydigan ventilyatsiya ulanishlari germetik yopiladi (61–62-band). Uzunligi 6 m dan ortiq xona faqat so'rma ventilyatsiya va me'yoriy tabiiy yorug'lik bo'lsa ruxsat etiladi (27-band). Derazasiz oshxona faqat yorug' xona bilan birlashtirilsa va to'siqning kamida 30% i oynavand bo'lsa saqlanadi (31-band).",
        is_mandatory: true,
        document_numbers: ["ShNQ 1.04.02-22", "SHNQ 2.01.05-24"],
        law_basis: "ShNQ 1.04.02-22, 27, 31, 61–62-band",
        correct: ["Studiya: derazasiz oshxonani mehmonxona bilan ochiq birlashtirish", "Oshxona va xona orasiga 30% dan ortiq oynali to'siq qo'yish"],
        wrong: ["Ventilyatsiya shaxtasini shkaf uchun qisqartirish yoki kesish", "Oshxona vytyajkasini umumiy shaxtaga emas, qo'shni kvartira kanaliga ulash"]
      }
    ]
  },
  {
    title: "Kvartira rejasini me'yorga tekshirish",
    slug: "kvartira-rejasi-tekshiruv",
    icon: "📐",
    category: "Loyihalash",
    subtitle: "Xonalar maydoni, eni va shift balandligi — SHNQ 2.08.01-24 bo'yicha",
    description: "Yangi turar joy binosidagi kvartira rejasini amaldagi SHNQ 2.08.01-24 talablariga tekshirish: kvartira umumiy maydoni, xonalar maydoni va eni, shift balandligi, dahliz va yo'laklar.",
    target_user: "Arxitektorlar, loyihachilar, talabalar, buyurtmachilar",
    order_index: 2,
    checklist: [
      {
        step_order: 1,
        title: "1. Kvartiraning umumiy maydoni",
        description: "Minimal maydon (34-band, 1-jadval): 1 xonali — 28 m², 2 xonali — 48 m², 3 xonali — 64 m², 4 xonali — 80 m², 5 xonali — 96 m², 6 xonali — 114 m². Me'yoriy maydonga yozgi xonalar (balkon, lodjiya) va isitilmaydigan xo'jalik xonalari kirmaydi.",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.01-24"],
        law_basis: "SHNQ 2.08.01-24, 34-band, 1-jadval",
        correct: ["2 xonali kvartira: 49,5 m² (balkonsiz)"],
        wrong: ["2 xonali kvartira: 44 m² — eski ma'lumot, amaldagi me'yordan kam", "Lodjiya maydonini qo'shib 48 m² ga «yetkazish»"]
      },
      {
        step_order: 2,
        title: "2. Xonalar maydoni va eni",
        description: "35-band: 1 xonali kvartirada yashash xonasi — 14 m²; 2+ xonali kvartirada umumiy xona — 16 m²; yotoqxona — 8 m² (2 kishilik — 12 m²); oshxona — 6 m² (2+ xonali kvartirada 8 m²); dahliz — 4 m²; sanitariya xonasi — 4 m². 36-band: yotoqxona eni kamida 2,4 m, umumiy xona eni kamida 3 m.",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.01-24"],
        law_basis: "SHNQ 2.08.01-24, 35–36-band",
        correct: ["Umumiy xona 3,3 × 5,1 m = 16,8 m²", "Bolalar xonasi 2,7 × 3,2 m = 8,6 m²"],
        wrong: ["Yotoqxona 2,2 × 4,0 m — maydoni 8,8 m² bo'lsa ham eni 2,4 m dan kam", "Umumiy xona 2,8 m enli «koridor-zal»"]
      },
      {
        step_order: 3,
        title: "3. Shift balandligi",
        description: "Yashash xonalari va oshxonalar balandligi poldan shiftgacha kamida 2,7 m; yordamchi xonalar (dahliz, sanuzel, omborxona) — kamida 2,4 m (38-band).",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.01-24"],
        law_basis: "SHNQ 2.08.01-24, 38-band",
        correct: ["Yashash xonasida toza balandlik 2,75 m, dahlizda osma shift bilan 2,45 m"],
        wrong: ["Yashash xonasida 2,5 m — bu eski ko'rsatkich, amaldagi me'yor 2,7 m", "Yotoqxonada osma shift bilan balandlikni 2,6 m ga tushirish"]
      },
      {
        step_order: 4,
        title: "4. Dahliz, yo'laklar va oshxona eni",
        description: "Dahliz eni kamida 1,4 m; yashash xonalariga olib boradigan ichki yo'laklar — 1,1 m; yordamchi xonalarga — 0,9 m (40-band). Oshxona eni: jihozlar bir tomonda — 1,7 m, ikki tomonda — 2,2 m (39-band).",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.01-24"],
        law_basis: "SHNQ 2.08.01-24, 39–40-band",
        correct: ["Ikki qatorli oshxona: eni 2,3 m", "Yotoqxonalarga yo'lak: 1,15 m"],
        wrong: ["Ikki qatorli oshxona: eni 1,9 m (ikki tomonda jihoz — kamida 2,2 m)", "Yotoqxonaga 0,9 m li yo'lak (yashash xonasiga — kamida 1,1 m)"]
      }
    ]
  },
  {
    title: "Oshxona loyihalash",
    slug: "oshxona-loyihalash",
    icon: "🍳",
    category: "Interyer",
    subtitle: "Maydon, en, derazasiz oshxona va ergonomika",
    description: "Kvartira oshxonasini loyihalashda majburiy me'yorlar (maydon, en) va ergonomik tavsiyalar (ish stoli balandligi, ish uchburchagi). Majburiy va tavsiya alohida belgilangan.",
    target_user: "Interyer dizaynerlari, mebel loyihachilari, kvartira egalari",
    order_index: 3,
    checklist: [
      {
        step_order: 1,
        title: "1. Maydon va en (majburiy)",
        description: "Oshxona kamida 6 m², 2 va undan ortiq xonali kvartirada kamida 8 m²; bir xonali kvartirada 5 m² oshxona-nisha ruxsat etiladi (35-band). Eni: jihozlar bir tomonda — 1,7 m, ikki tomonda — 2,2 m (39-band). Balandligi kamida 2,7 m (38-band).",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.01-24"],
        law_basis: "SHNQ 2.08.01-24, 35, 38–39-band",
        correct: ["Chiziqli oshxona 1,8 × 4,6 m = 8,3 m²", "P shaklli oshxona eni 2,4 m"],
        wrong: ["Ikki qatorli mebel 2,0 m enli oshxonada", "3 xonali kvartirada 7 m² li oshxona"]
      },
      {
        step_order: 2,
        title: "2. Derazasiz oshxona va studiya",
        description: "Tabiiy yorug'liksiz oshxona faqat yorug' xona bilan birlashtirilsa va to'siqning kamida 30% i oynavand bo'lsa saqlanadi (ShNQ 1.04.02-22, 31-band). Gazli oshxonani yashash xonasi ustiga yoki ostiga ko'chirish mumkin emas (29-band).",
        is_mandatory: true,
        document_numbers: ["ShNQ 1.04.02-22"],
        law_basis: "ShNQ 1.04.02-22, 29 va 31-band",
        correct: ["Oshxona-mehmonxona studiyasi: ochiq birlashtirish", "Oynali surma to'siq (yuzasining 40% i shisha)"],
        wrong: ["Derazasiz oshxonani to'liq gipsokarton devor bilan yopish", "Gaz plitasini sobiq yotoqxonaga ko'chirish"]
      },
      {
        step_order: 3,
        title: "3. Ergonomika (💡 tavsiya)",
        description: "💡 Amaliy tavsiya, normativ emas: ish stoli balandligi 85–90 sm, chuqurligi 60 sm; osma shkaflar chuqurligi 30–35 sm, fartuk balandligi 55–60 sm; muzlatgich — rakovina — plita «ish uchburchagi» perimetri taxminan 4–7 m. Ergonomika asoslari: B.I. G'oyibov, «Ergonomika» (Kutubxonada bor).",
        is_mandatory: false,
        document_numbers: [],
        law_basis: "Ergonomik tavsiya (majburiy norma emas)",
        correct: ["Bo'yi 160–175 sm bo'lgan foydalanuvchi uchun ish stoli 88 sm", "Plita va rakovina orasida kamida 60–80 sm ish yuzasi"],
        wrong: ["Plitani deraza tokchasi yoniga, parda ostiga qo'yish", "Muzlatgichni plita bilan yonma-yon, orasiz qo'yish"]
      }
    ]
  },
  {
    title: "Sanuzel va vannaxona",
    slug: "sanuzel-loyihalash",
    icon: "🛁",
    category: "Interyer",
    subtitle: "Maydon, en, joylashuv va issiq suv harorati",
    description: "Kvartira sanuzeli va vannaxonasini loyihalash: minimal maydon va en, birlashtirilgan sanuzel qachon mumkin, ho'l zonani ko'chirish cheklovlari va issiq suv talablari.",
    target_user: "Interyer dizaynerlari, santexnika ustalari, kvartira egalari",
    order_index: 4,
    checklist: [
      {
        step_order: 1,
        title: "1. Maydon va en (majburiy)",
        description: "Sanitariya xonasi (vannaxona va hojatxona) kamida 4 m² (35-band). Qo'l yuvish jihozli hojatxona eni kamida 1,6 m, birlashtirilgan sanuzel eni kamida 2,2 m (43-band). Bir xonali kvartiralarda birlashtirilgan sanuzel ruxsat etiladi (44-band). Kir yuvish mashinasi uchun 0,45 × 0,75 m joy ko'zda tutiladi (45-band).",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.01-24"],
        law_basis: "SHNQ 2.08.01-24, 35, 43–45-band",
        correct: ["Birlashtirilgan sanuzel 2,2 × 1,9 m = 4,2 m², kir mashinasi joyi bilan"],
        wrong: ["1,7 m enli birlashtirilgan sanuzel", "Kir yuvish mashinasi uchun joy qoldirmaslik"]
      },
      {
        step_order: 2,
        title: "2. Joylashuv cheklovlari",
        description: "Hojatxona va vannaxonani yashash xonasi yoki oshxona ustiga joylashtirish mumkin emas (ikki sathli kvartiradan tashqari) (ShNQ 1.04.02-22, 30-band). Aravachadagi foydalanuvchi uchun hojatxona oshxona yoki yashash xonasidan to'g'ridan-to'g'ri ochilmasin (yotoqxonadan tashqari) (SHNQ 2.08.01-24, 46-band).",
        is_mandatory: true,
        document_numbers: ["ShNQ 1.04.02-22", "SHNQ 2.08.01-24"],
        law_basis: "ShNQ 1.04.02-22, 30-band; SHNQ 2.08.01-24, 46-band",
        correct: ["Sanuzelni koridor hisobiga 0,6 m kengaytirish"],
        wrong: ["Mehmonxonadan to'g'ridan-to'g'ri hojatxonaga eshik ochish", "Dush xonasini pastdagi qo'shnining zali ustiga qurish"]
      },
      {
        step_order: 3,
        title: "3. Issiq suv va ventilyatsiya",
        description: "Suv olish nuqtalarida issiq suv harorati 50–75 °C; bolalar muassasalarida dush va qo'l yuvgichlarda ko'pi bilan 37 °C (SHNQ 2.04.01-22, 15–16-band). Sanitariya xonalarida havo almashinuvi eshik ostidagi tirqish yoki panjara orqali ta'minlanadi (SHNQ 2.08.01-24, 48-band).",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.04.01-22", "SHNQ 2.08.01-24"],
        law_basis: "SHNQ 2.04.01-22, 15–16-band; SHNQ 2.08.01-24, 48-band",
        correct: ["Sanuzel eshigi ostida ventilyatsiya tirqishi yoki panjara"],
        wrong: ["Eshikni polga zich, tirqishsiz o'rnatish va ventilyatsiya panjarasini plitka bilan yopish"]
      }
    ]
  },
  {
    title: "Kafe va restoran interyeri",
    slug: "restoran-loyihalash",
    icon: "🍽️",
    category: "Interyer",
    subtitle: "Shift balandligi, chiqishlar, kirish, pandus va materiallar",
    description: "Kafe yoki restoran interyerini loyihalashda SHNQ 2.08.02-23 (jamoat binolari), SHNQ 2.07.02-24 (inklyuziv muhit) va SHNQ 2.01.02-04 (yong'in xavfsizligi) talablari.",
    target_user: "Restoratorlar, interyer dizaynerlari, arxitektorlar",
    order_index: 5,
    checklist: [
      {
        step_order: 1,
        title: "1. Shift balandligi va kirish",
        description: "Jamoat xonalari balandligi kamida 3,0 m; turar joy binosi ichidagi kafe va do'konlar — 2,8 m (SHNQ 2.08.02-23, 8, 10-band). 50 o'rindan kam kafeda mijoz va xodim uchun bitta umumiy kirish ruxsat etiladi.",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.02-23"],
        law_basis: "SHNQ 2.08.02-23, 8 va 10-band",
        correct: ["Turar joy binosi 1-qavatidagi kafe: toza balandlik 2,85 m"],
        wrong: ["Osma shift va havo quvurlari tufayli toza balandlikni 2,6 m ga tushirish"]
      },
      {
        step_order: 2,
        title: "2. Chiqish eshiklari",
        description: "Xonadan chiqish eshigi eni kamida 0,9 m (97-band); 50 kishidan ortiq zallarda chiqish kamida 1,2 m (100-band).",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.02-23"],
        law_basis: "SHNQ 2.08.02-23, 97 va 100-band",
        correct: ["80 o'rinli zal: 1,2 m enli chiqish eshigi"],
        wrong: ["80 o'rinli zalda yagona 0,9 m li eshik", "Chiqish yo'liga dekorativ to'siq yoki mebel qo'yish"]
      },
      {
        step_order: 3,
        title: "3. Pandus va eshik (inklyuziv)",
        description: "Pandus qiyaligi ko'pi bilan 1:12,5, eni kamida 1,0 m, maydonchalar kamida 1,5 m (SHNQ 2.07.02-24, 42, 44-band). Ostona 14 mm dan baland bo'lmasin (58-band). Jamoat binosi sig'imining 5% i miqdorida aravachadagilar uchun joy (91-band).",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.07.02-24"],
        law_basis: "SHNQ 2.07.02-24, 42, 44, 58, 91-band",
        correct: ["40 o'rinli kafe: aravachadagilar uchun 2 ta joy, 1,2 m li pandus"],
        wrong: ["Kirishda 3 ta pog'ona va pandus yo'q", "Eshik oldida 3 sm li dekorativ ostona"]
      },
      {
        step_order: 4,
        title: "4. Pardozlash materiallari",
        description: "Evakuatsiya yo'llari, vestibyul, yo'laklar, foye devor va shiftlarida hamda osma shiftlarda YO1–YO4 yonuvchanlik sinfidagi materiallar cheklangan (SHNQ 2.01.02-04, 6.191-band, 2026-yil qo'shimchasi).",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.01.02-04"],
        law_basis: "SHNQ 2.01.02-04, 6.191-band",
        correct: ["Kirish holli: dekorativ suvoq va mineral plitali shift; zal ichida (evakuatsiya yo'li emas) yog'och panel"],
        wrong: ["Chiqish yo'lagi devor va shiftini yog'och reyka yoki yonuvchan PVX panel bilan qoplash"]
      }
    ]
  },
  {
    title: "Ofis interyeri",
    slug: "ofis-loyihalash",
    icon: "🏢",
    category: "Loyihalash",
    subtitle: "Ish o'rni maydoni, majlis xonasi, yo'laklar, sanuzellar soni",
    description: "Ofis va ma'muriy binolar interyerini SHNQ 2.08.04-22 bo'yicha hisoblash: xodim soniga qarab maydon, majlis xonasi, yo'lak eni va sanitariya jihozlari soni.",
    target_user: "Ofis interyeri dizaynerlari, arxitektorlar, kompaniya rahbarlari",
    order_index: 6,
    checklist: [
      {
        step_order: 1,
        title: "1. Ish o'rni maydoni",
        description: "Kompyuter yoki chizmachilik stoli bilan ishlovchi xodim uchun 6 m² (56-band); oddiy stol bilan — 4 m² (57-band).",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.04-22"],
        law_basis: "SHNQ 2.08.04-22, 56–57-band",
        correct: ["20 dizayner: 20 × 6 = 120 m² ish zonasi"],
        wrong: ["20 kishilik kompyuterli ofisni 80 m² ga joylashtirish (4 m² / kishi)"]
      },
      {
        step_order: 2,
        title: "2. Majlis xonasi va kutish joyi",
        description: "Majlis xonasi: stol bilan — 2 m² / o'rin; qator o'rindiqlar — 0,8–1,0 m² / o'rin (63-band). Tashrif buyuruvchilar kutish joyi — 1,5–2 m² / kishi (42-band).",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.04-22"],
        law_basis: "SHNQ 2.08.04-22, 42 va 63-band",
        correct: ["10 o'rinli stolli majlis xonasi — 20 m²"],
        wrong: ["10 o'rinli stolli majlis xonasi — 12 m²"]
      },
      {
        step_order: 3,
        title: "3. Yo'laklar va sanitariya",
        description: "Yo'lak va evakuatsiya yo'llari eni kamida 1,5 m; aravacha harakatlanadigan joyda — 1,8 m (16-band); toza balandlik kamida 2,4 m (14-band). 15 xodimgacha — 1 unitaz va 1 qo'l yuvgich; erkaklar uchun 50 kishiga 1 unitaz va 1 pissuar; ayollar uchun 25–30 kishiga 1 unitaz (78, 81-band).",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.04-22"],
        law_basis: "SHNQ 2.08.04-22, 14, 16, 78, 81-band",
        correct: ["1,6 m enli yo'lak, 12 xodimga 1 ta sanuzel"],
        wrong: ["Ish stollari orasidagi 1,0 m li o'tishni evakuatsiya yo'li deb hisoblash"]
      }
    ]
  },
  {
    title: "Kirish guruhi va pandus (inklyuziv muhit)",
    slug: "pandus-inklyuziv",
    icon: "♿",
    category: "Inklyuziv muhit",
    subtitle: "Pandus qiyaligi, eni, maydoncha, eshik va ostona",
    description: "Binoga kirish va ichki muhitni nogironligi bo'lgan shaxslar va keksalar uchun qulay qilish: SHNQ 2.07.02-24 dagi raqamlar va hisob misoli.",
    target_user: "Arxitektorlar, interyer dizaynerlari, obodonlashtirish loyihachilari",
    order_index: 7,
    checklist: [
      {
        step_order: 1,
        title: "1. Pandus qiyaligi va uzunligi",
        description: "Bo'ylama qiyalik ko'pi bilan 1:12,5, ko'ndalang — 1:50; bir marsh ko'tarilishi 0,8 m dan oshmasin (42-band). Uzunlik = balandlik × 12,5.",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.07.02-24"],
        law_basis: "SHNQ 2.07.02-24, 42-band",
        correct: ["0,45 m balandlik → kamida 5,63 m uzunlikdagi pandus"],
        wrong: ["0,45 m balandlik uchun 2,5 m li pandus (qiyalik 1:5,5)"],
        example: "Balandlik 0,9 m → bitta marsh 0,8 m dan oshmasligi kerak, shuning uchun ikki marsh va oraliq maydoncha (≥1,5 m) kerak: 2 × (0,45 × 12,5) = 2 × 5,63 m."
      },
      {
        step_order: 2,
        title: "2. Eni, maydonchalar va tutqichlar",
        description: "Pandus eni kamida 1,0 m (42-band); maydonchalar uzunligi kamida 1,5 m, burilishda eni ham 1,5 m (44-band); tutqichlar 0,7–0,9 m balandlikda (35, 43-band).",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.07.02-24"],
        law_basis: "SHNQ 2.07.02-24, 35, 42–44-band",
        correct: ["1,2 m enli pandus, ikki tomonda 0,7 va 0,9 m li tutqich"],
        wrong: ["Faqat bir tomonda tutqich, burilish maydonchasi 1,0 m"]
      },
      {
        step_order: 3,
        title: "3. Eshik, ostona va burilish joyi",
        description: "Eshik toza eni 15 kishigacha xonalar uchun kamida 0,9 m (87-band); surma eshik — 1,2 m (111-band). Ostona 14 mm dan baland bo'lmasin (58-band). Aravachada burilish uchun diametri kamida 1,5 m bo'sh joy (110-band). Yotoqxona yonidagi moslashtirilgan sanuzel kamida 2,2 × 2,2 m (118-band).",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.07.02-24"],
        law_basis: "SHNQ 2.07.02-24, 58, 87, 110–111, 118-band",
        correct: ["Ostonasiz kirish, 1,0 m li eshik, eshik oldida 1,5 m doira"],
        wrong: ["0,8 m li eshik va 3 sm li ostona"]
      }
    ]
  },
  {
    title: "Zinapoya loyihalash",
    slug: "zinapoya-loyihalash",
    icon: "🪜",
    category: "O‘lchamlar va standartlar",
    subtitle: "Marsh eni, pog'onalar soni, qiyalik — turar joy va jamoat binolarida",
    description: "Turar joy (SHNQ 2.08.01-24) va jamoat binolari (SHNQ 2.08.02-23) zinapoyalarining majburiy o'lchamlari hamda qulay pog'ona bo'yicha tavsiya.",
    target_user: "Arxitektorlar, interyer dizaynerlari, kottej loyihachilari",
    order_index: 8,
    checklist: [
      {
        step_order: 1,
        title: "1. Turar joy binolarida",
        description: "Bir marshda 3 tadan 18 tagacha pog'ona (178-band). Marsh eni: 2+ qavatli seksiyali binolarda — 1,05 m; koridorli binolarda — 1,2 m; podval va kvartira ichidagi zinapoyalar — 0,9 m (8-jadval). Qiyalik: 3+ qavatli va koridorli binolarda — 1:1,75; kvartira ichidagi — 1:1,25 gacha.",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.01-24"],
        law_basis: "SHNQ 2.08.01-24, 178–179-band, 8-jadval",
        correct: ["Ikki sathli kvartira ichki zinapoyasi: eni 0,95 m, 15 pog'ona"],
        wrong: ["Bir marshda 20 ta pog'ona", "Ko'p qavatli uy podyezdida 1,0 m li marsh"]
      },
      {
        step_order: 2,
        title: "2. Jamoat binolarida",
        description: "Marsh eni: F1 binolar va 100 kishidan ortiq bo'lsa — 1,35 m; 5 kishigacha xizmat qiladigan — 0,9 m (SHNQ 2.08.02-23, 24-band). Maydoncha eni marsh enidan kam emas, to'g'ri marshlardagi oraliq maydoncha kamida 1 m (25-band). Yer usti zinapoyasi qiyaligi 1:2 dan oshmasin (20-band).",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.02-23"],
        law_basis: "SHNQ 2.08.02-23, 20, 24–25-band",
        correct: ["Ofis binosi zinapoyasi: 1,35 m marsh, 1,4 m maydoncha"],
        wrong: ["Maydoncha marshdan tor (marsh 1,35 m, maydoncha 1,1 m)"]
      },
      {
        step_order: 3,
        title: "3. Qulay pog'ona (💡 tavsiya)",
        description: "💡 Amaliy tavsiya: qadam formulasi 2h + b ≈ 600–640 mm (h — pog'ona balandligi, b — kengligi). Masalan, h = 165 mm, b = 290 mm → 2 × 165 + 290 = 620 mm. Bitta marshdagi barcha pog'onalar bir xil bo'lishi kerak.",
        is_mandatory: false,
        document_numbers: [],
        law_basis: "Ergonomik tavsiya (Blondel formulasi)",
        correct: ["h = 160–170 mm, b = 280–300 mm"],
        wrong: ["Birinchi va oxirgi pog'onani boshqalardan balandroq qilish (qoqilish xavfi)"]
      }
    ]
  },
  {
    title: "Xonalarni yoritish loyihasi",
    slug: "yoritish-loyihasi",
    icon: "💡",
    category: "Interyer",
    subtitle: "Lyuks me'yorlari, tabiiy yorug'lik koeffitsienti va deraza yo'nalishi",
    description: "Interyer yoritish loyihasini SHNQ 2.01.05-24 «Tabiiy va sun'iy yoritish» bo'yicha qanday tekshirish: ko'rish ishining toifasi, lyuks qiymati va tabiiy yorug'lik hisobi.",
    target_user: "Interyer dizaynerlari, yoritish loyihachilari, elektriklar",
    order_index: 9,
    checklist: [
      {
        step_order: 1,
        title: "1. Ko'rish ishining toifasini aniqlang",
        description: "Turar joy va jamoat binolari xonalari uchun yoritilganlik 1-ilova, 2-jadvalda ko'rish ishining aniqlik toifasi bo'yicha beriladi: A1 — 500 lk, A2 — 400 lk, B1 — 300 lk, B2 — 200 lk, V1 — 150 lk, V2 — 100 lk, J1 — 75 lk, J2 — 50 lk. Xonalar bo'yicha qiymatlar 1 va 10-ilovalarda.",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.01.05-24"],
        law_basis: "SHNQ 2.01.05-24, 1-ilova 2-jadval",
        correct: ["Chizmachilik xonasi uchun yuqori aniqlik toifasini olish va xonalar jadvalidan tekshirish"],
        wrong: ["Hamma xonaga bir xil 300 lk qo'yish", "Faqat «chiroyli» dekorativ chiroqlar bilan cheklanish"]
      },
      {
        step_order: 2,
        title: "2. Tabiiy yorug'lik (TYOK / KEO)",
        description: "Me'yoriy qiymat e = eₙ · m (18-band); m — yorug'lik iqlimi koeffitsienti: shimol, shimoli-sharq, shimoli-g'arb — 0,7; g'arb, janubi-g'arb, sharq, janubi-sharq — 0,65 (1-jadval). Asosiy yashash xonalarida me'yor pol sathida ta'minlanadi (19-band).",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.01.05-24"],
        law_basis: "SHNQ 2.01.05-24, 18–19-band, 1-jadval",
        correct: ["Shimolga qaragan xonada m = 0,7 ni hisobga olib derazani kattaroq olish"],
        wrong: ["Deraza oldiga to'liq shkaf qo'yib, xonani tabiiy yorug'liksiz qoldirish"]
      }
    ]
  },
  {
    title: "Pardozlash materiallarini yong'in talabiga ko'ra tanlash",
    slug: "yongin-xavfsizligi",
    icon: "🔥",
    category: "Yong‘in xavfsizligi",
    subtitle: "2026-yil qo'shimchasi: fasad va evakuatsiya yo'llaridagi materiallar",
    description: "SHNQ 2.01.02-04 ga 2026-yil 18-martda qo'shilgan 6.191-band bo'yicha fasad va interyer pardozlash materiallarini to'g'ri tanlash.",
    target_user: "Interyer dizaynerlari, arxitektorlar, quruvchilar",
    order_index: 10,
    checklist: [
      {
        step_order: 1,
        title: "1. Fasad",
        description: "Balandligi 28 m gacha binolar fasadida YO2–YO4 sinfidagi, 28 m va undan baland binolarda YO1–YO4 sinfidagi materiallar cheklanadi. Ta'lim va tibbiyot muassasalari fasadida balandlikdan qat'i nazar YO1–YO4 cheklanadi.",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.01.02-04"],
        law_basis: "SHNQ 2.01.02-04, 6.191-band",
        correct: ["Maktab fasadi: yonmaydigan fibrotsement yoki tosh plita"],
        wrong: ["Maktab yoki klinika fasadini yonuvchan kompozit panel bilan qoplash"]
      },
      {
        step_order: 2,
        title: "2. Evakuatsiya yo'llari va osma shiftlar",
        description: "Barcha binolarda evakuatsiya yo'llari, vestibyul, zinapoya kataklari, lift hollari, yo'laklar, hollar, foye, podval va yarim podvallar devor va shiftlarida hamda osma shiftlarda YO1–YO4 sinfidagi materiallar cheklanadi.",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.01.02-04"],
        law_basis: "SHNQ 2.01.02-04, 6.191-band",
        correct: ["Lift holli: keramogranit, gipsli suvoq, metall yoki mineral osma shift"],
        wrong: ["Ko'p qavatli uy podyezdini MDF panel va yog'och reyka bilan bezash", "Yo'lakda yonuvchan plastik osma shift"]
      }
    ]
  },
  {
    title: "Yakka tartibdagi uy loyihasi",
    slug: "2-qavatli-uy-qurish",
    icon: "🏠",
    category: "Qurilish uchun kerakli hujjatlar",
    subtitle: "Loyihaga qo'yiladigan asosiy texnik talablar va kerakli normativlar",
    description: "2 qavatli yakka tartibdagi uy loyihasida qaysi normativlar asos bo'ladi: xonalar o'lchami, seysmik talablar, zamin va poydevor. Ruxsat va kelishish tartibi Shaharsozlik kodeksi asosida mahalliy qurilish bo'limida aniqlanadi.",
    target_user: "Uy qurmoqchi bo'lgan fuqarolar, arxitektorlar, prorablar",
    order_index: 11,
    checklist: [
      {
        step_order: 1,
        title: "1. Ruxsat va kelishish",
        description: "Qurilishga ruxsat, loyihani kelishish va foydalanishga qabul qilish tartibi O'zbekiston Respublikasining Shaharsozlik kodeksi (22.02.2021) asosida belgilanadi. Uchastka uchun shaharsozlik talablari (qizil chiziq, balandlik, chekinishlar) mahalliy hokimlik qurilish bo'limidan olinadi — ularni taxmin qilmang.",
        is_mandatory: true,
        document_numbers: [],
        law_basis: "O'zbekiston Respublikasining Shaharsozlik kodeksi — lex.uz/docs/-5307951",
        correct: ["Loyihani boshlashdan oldin uchastka uchun rasmiy shaharsozlik talablarini olish"],
        wrong: ["Internetdagi «qo'shnidan 3 m» kabi umumiy raqamlarga tayanib uyni joylashtirish"]
      },
      {
        step_order: 2,
        title: "2. Xonalar va balandliklar",
        description: "Yashash xonalari va oshxona balandligi kamida 2,7 m, yordamchi xonalar — 2,4 m (SHNQ 2.08.01-24, 38-band). Yotoqxona kamida 8 m² (2 kishilik — 12 m²), eni 2,4 m; umumiy xona eni 3 m (35–36-band). Uy ichidagi zinapoya marshi kamida 0,9 m (8-jadval).",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.01-24"],
        law_basis: "SHNQ 2.08.01-24, 35–38-band, 8-jadval",
        correct: ["1-qavat 3,0 m, 2-qavat 2,8 m qavat balandligi (toza balandlik ≥ 2,7 m)"],
        wrong: ["Mansardada yotoqxona shiftini butunlay 2,3 m qilish"]
      },
      {
        step_order: 3,
        title: "3. Seysmik talablar va poydevor",
        description: "Hisobiy seysmikligi 7 balldan yuqori hududlarda konstruksiyalar QMQ 2.01.03-19 bo'yicha hisoblanadi. Zamin va poydevor SHNQ 2.02.01-24 va muhandislik-geologik izlanish natijalari asosida tanlanadi.",
        is_mandatory: true,
        document_numbers: ["QMQ 2.01.03-19", "SHNQ 2.02.01-24"],
        law_basis: "QMQ 2.01.03-19; SHNQ 2.02.01-24",
        correct: ["Geologik izlanish o'tkazib, poydevorni konstruktor hisobi bilan tanlash"],
        wrong: ["Qo'shnining poydevori qanday bo'lsa, shunday qilish", "Seysmik belbog'siz g'isht devor"]
      }
    ]
  },
  {
    title: "Bolalar xonasi va yotoqxona",
    slug: "yotoqxona-bolalar-xonasi",
    icon: "🛏️",
    category: "Interyer",
    subtitle: "Majburiy maydon va en, mebel joylashuvi bo'yicha tavsiyalar",
    description: "Yotoqxona va bolalar xonasini loyihalash: SHNQ 2.08.01-24 dagi majburiy o'lchamlar va mebel atrofidagi bo'sh joy bo'yicha amaliy tavsiyalar.",
    target_user: "Interyer dizaynerlari, mebel loyihachilari, ota-onalar",
    order_index: 12,
    checklist: [
      {
        step_order: 1,
        title: "1. Majburiy o'lchamlar",
        description: "Yotoqxona kamida 8 m², ikki kishilik — 12 m² (35-band); eni kamida 2,4 m (36-band); balandligi kamida 2,7 m (38-band).",
        is_mandatory: true,
        document_numbers: ["SHNQ 2.08.01-24"],
        law_basis: "SHNQ 2.08.01-24, 35, 36, 38-band",
        correct: ["Ikki bolali xona: 3,2 × 3,9 m = 12,5 m²"],
        wrong: ["Ikki bola uchun 9 m² li xona", "2,2 m enli «qalam quti» xona"]
      },
      {
        step_order: 2,
        title: "2. Mebel atrofidagi bo'sh joy (💡 tavsiya)",
        description: "💡 Amaliy tavsiya, normativ emas: ikki kishilik karavot atrofida har tomondan kamida 70 sm o'tish; shkaf oldida eshik ochilishi uchun 80–90 sm; ish stoli derazaga yaqin, yorug'lik chapdan tushadigan qilib (o'ng qo'l bilan yozuvchilar uchun).",
        is_mandatory: false,
        document_numbers: [],
        law_basis: "Ergonomik tavsiya (majburiy norma emas)",
        correct: ["Ish stolini deraza yoniga, karavotni eshikdan uzoqroq qo'yish"],
        wrong: ["Karavotni radiator yoki konditsioner oqimi ostiga qo'yish", "Shkaf eshigi karavotga tegib ochilmaydigan joylashuv"]
      }
    ]
  }
];

module.exports = { SEED_PRACTICAL_CASES };
