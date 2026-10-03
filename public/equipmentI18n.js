/* ======================================================
   YOSHUZBEKK — EQUIPMENT i18n (5 til: uz/ru/en/tr/ar)
   ======================================================
   Alohida modul — app.js / i18n.js ga tegilmaydi.

   Nima uchun alohida lug'at:
     • Loyihaning asosiy I18N tizimi tarjimalarni DB dan oladi
       (I18N.t('kalit')). Equipment o'z lug'ati bilan ishlaydi va
       mavjud tizimga QO'SHILADI — uni almashtirmaydi.
     • DB da equipment kalitlari yo'q; shu sababli lug'at kodda
       saqlanadi va har doim to'g'ri ishlaydi.
     • window.t() mavjud bo'lsa Equipment matnlari ham o'sha
       tizim orqali qayta tarjima qilinishi mumkin (i18n.js
       DOM observer'i orqali) — biz esa har render'da T() orqali
       aniq tarjimani qo'yamiz.

   Foydalanish:
     ET('equipment.title')            → 'Jihozlar'
     ET('equipment.search', {n: 3})   → '3 ta jihoz'
     var lang = ELang();              → 'uz' | 'ru' | 'en' | 'tr' | 'ar'
   ====================================================== */
(function () {
  'use strict';

  // Til nomlari — i18n.js dagi LANGS bilan bir xil
  var LANGS = ['uz', 'ru', 'en', 'tr', 'ar'];

  // ======================================================
  // LUG'AT
  // ======================================================
  // har bir kalit: [uz, ru, en, tr, ar]
  var DICT = {
    // --- Bo'lim nomlari ---
    'equipment.title':        ['Jihozlar', 'Оборудование', 'Equipment', 'Ekipmanlar', 'المعدات'],
    'equipment.subtitle':     ["Arxitekt va loyihachilar uchun texnik jihozlar ma'lumotlar bazasi",
                                'База технических данных оборудования для архитекторов и проектировщиков',
                                'Technical equipment database for architects and designers',
                                'Mimarlar ve tasarımcılar için teknik ekipman veritabanı',
                                'قاعدة بيانات المعدات التقنية للمعماريين والمصممين'],

    // --- Navigatsiya ---
    'equipment.back':         ['Orqaga', 'Назад', 'Back', 'Geri', 'رجوع'],
    'equipment.all':          ['Barchasi', 'Все', 'All', 'Tümü', 'الكل'],
    'equipment.loading':      ['Yuklanmoqda…', 'Загрузка…', 'Loading…', 'Yükleniyor…', 'جارٍ التحميل…'],
    'equipment.loadMore':     ['Yana yuklash', 'Загрузить ещё', 'Load more', 'Daha fazla yükle', 'تحميل المزيد'],

    // --- Search ---
    'equipment.search':       ['Qidirish…', 'Поиск…', 'Search…', 'Ara…', 'بحث…'],
    'equipment.searchPh':     ['Nomi, model, brend, SKU…', 'Название, модель, бренд, SKU…',
                                'Name, model, brand, SKU…', 'Ad, model, marka, SKU…', 'الاسم، الموديل، العلامة، SKU…'],
    'equipment.found':        ['ta jihoz', 'оборудования', 'items', 'ürün', 'جهاز'],
    'equipment.type':         ['tur', 'тип', 'type', 'tür', 'نوع'],
    'equipment.filters':      ['filter', 'фильтр', 'filter', 'filtre', 'مرشّح'],
    'equipment.clearFilters': ['Filtrlarni tozalash', 'Сбросить фильтры', 'Clear filters',
                                'Filtreleri temizle', 'مسح المرشحات'],

    // --- Card / list ---
    'equipment.noImage':      ["Rasm yo'q", 'Нет фото', 'No image', 'Görsel yok', 'لا توجد صورة'],
    'equipment.sources':      ['manba', 'источник', 'sources', 'kaynak', 'مصدر'],
    'equipment.saved':        ['Saqlangan jihozlar', 'Сохранённое оборудование', 'Saved equipment',
                                'Kaydedilen ekipman', 'المعدات المحفوظة'],
    'equipment.notFound':     ['Jihoz topilmadi', 'Оборудование не найдено', 'Equipment not found',
                                'Ekipman bulunamadı', 'لم يتم العثور على المعدات'],
    'equipment.notFoundHint': ['Bu kategoriyada hali mahsulot qo‘shilmagan.',
                                'В этой категории пока нет товаров.',
                                'No products in this category yet.',
                                'Bu kategoride henüz ürün yok.',
                                'لا توجد منتجات في هذه الفئة بعد.'],
    'equipment.searchEmpty':  ['bo‘yicha hech narsa topilmadi.', 'ничего не найдено по запросу.',
                                'nothing found for this search.', 'aramasında hiçbir şey bulunamadı.',
                                'لم يتم العثور على شيء لهذا البحث.'],

    // --- Detail sarlavhalari ---
    'equipment.dimensions':   ["O'lchamlar", 'Размеры', 'Dimensions', 'Ölçüler', 'الأبعاد'],
    'equipment.specs':        ['Texnik xususiyatlar', 'Технические характеристики', 'Specifications',
                                'Teknik özellikler', 'المواصفات الفنية'],
    'equipment.connections':  ['Ulanishlar', 'Подключения', 'Connections', 'Bağlantılar', 'الاتصالات'],
    'equipment.installation': ['Montaj talablari', 'Требования монтажа', 'Installation requirements',
                                'Montaj gereksinimleri', 'متطلبات التركيب'],
    'equipment.applications': ["Qo'llanish sohasi", 'Область применения', 'Applications',
                                'Kullanım alanları', 'مجالات الاستخدام'],
    'engineering.notes':      ['Muhandislik izohlari', 'Инженерные примечания', 'Engineering notes',
                                'Mühendislik notları', 'ملاحظات هندسية'],
    'equipment.archAdvice':   ['Arxitekt tavsiyasi', 'Рекомендация архитектора', 'Architect recommendation',
                                'Mimar önerisi', 'توصية المعماري'],
    'equipment.documents':    ['Hujjatlar', 'Документы', 'Documents', 'Belgeler', 'المستندات'],
    'equipment.sourcesList':  ['Rasmiy manbalar', 'Официальные источники', 'Official sources',
                                'Resmi kaynaklar', 'المصادر الرسمية'],
    'equipment.advantages':   ['Afzalliklar', 'Преимущества', 'Advantages', 'Avantajlar', 'المزايا'],
    'equipment.limitations':  ['Cheklovlar', 'Ограничения', 'Limitations', 'Sınırlamalar', 'القيود'],

    // --- Tarkibiy maydonlar ---
    'equipment.width':        ['En', 'Ширина', 'Width', 'Genişlik', 'العرض'],
    'equipment.height':       ['Balandlik', 'Высота', 'Height', 'Yükseklik', 'الارتفاع'],
    'equipment.depth':        ['Chuqurlik', 'Глубина', 'Depth', 'Derinlik', 'العمق'],
    'equipment.weight':       ['Og‘irlik', 'Вес', 'Weight', 'Ağırlık', 'الوزن'],
    'equipment.manufacturer': ['Ishlab chiqaruvchi', 'Производитель', 'Manufacturer', 'Üretici', 'الشركة المصنعة'],
    'equipment.mount':        ["O'rnatish turi", 'Тип установки', 'Installation type', 'Montaj tipi', 'نوع التركيب'],
    'equipment.location':     ['Joylashuv', 'Расположение', 'Location', 'Konum', 'الموقع'],
    'equipment.service':      ['Serviz', 'Обслуживание', 'Service', 'Servis', 'الصيانة'],
    'equipment.clearance':    ["Minimal bo'shliq (rasmiy)", 'Минимальный зазор (официально)',
                                'Minimum clearance (official)', 'Minimum boşluk (resmî)',
                                'الخلاصة الدنيا (رسمي)'],
    'equipment.notSpecified': ["Ishlab chiqaruvchi tomonidan ko'rsatilmagan",
                                'Не указан производителем', 'Not specified by manufacturer',
                                'Üretici tarafından belirtilmemiş', 'غير محدد من الشركة المصنعة'],
    'equipment.notInSource':  ["Rasmiy manbada ko'rsatilmagan", 'Не указано в официальном источнике',
                                'Not stated in the official source', 'Resmî kaynakta belirtilmemiş',
                                'غير مذكور في المصدر الرسمي'],
    'equipment.official':     ['Rasmiy ishlab chiqaruvchi', 'Официальный производитель', 'Official manufacturer',
                                'Resmî üretici', 'الشركة المصنعة الرسمية'],
    'equipment.verified':     ['tekshirilgan', 'проверено', 'verified', 'doğrulandı', 'موثق'],
    'equipment.unverified':   ['tekshirilmagan', 'не проверено', 'not verified', 'doğrulanmamış', 'غير موثق'],

    // --- Amallar ---
    'equipment.like':         ['Like', 'Нравится', 'Like', 'Beğen', 'إعجاب'],
    'equipment.save':         ['Saqlash', 'Сохранить', 'Save', 'Kaydet', 'حفظ'],
    'equipment.savedBtn':     ['Saqlanganlar', 'Сохранённые', 'Saved', 'Kaydedilenler', 'المحفوظات'],
    'equipment.retry':        ['Qayta urinish', 'Повторить', 'Try again', 'Tekrar dene', 'إعادة المحاولة'],
    'equipment.errorTitle':   ['Xatolik yuz berdi', 'Произошла ошибка', 'Something went wrong',
                                'Bir hata oluştu', 'حدث خطأ ما'],
    'equipment.errorNet':     ['Tarmoq xatosi. Internetni tekshirib, qayta urinib ko‘ring.',
                                'Ошибка сети. Проверьте интернет и повторите.',
                                'Network error. Check your connection and try again.',
                                'Ağ hatası. Bağlantınızı kontrol edip tekrar deneyin.',
                                'خطأ في الشبكة. تحقق من اتصالك وحاول مرة أخرى.'],
    'equipment.errorGeneric': ['Xatolik yuz berdi', 'Произошла ошибка', 'Something went wrong',
                                'Bir hata oluştu', 'حدث خطأ ما'],
    'equipment.delete':       ['Bu jihoz mavjud emas yoki olib tashlangan.',
                                'Это оборудование не существует или удалено.',
                                'This equipment does not exist or was removed.',
                                'Bu ekipman mevcut değil veya kaldırıldı.',
                                'هذا المعدات غير موجود أو تم حذفه.'],

    // --- Ulanish turlari ---
    'conn.electric':          ['Elektr', 'Электричество', 'Electric', 'Elektrik', 'كهرباء'],
    'conn.water_in':          ['Suv kirishi', 'Подача воды', 'Water inlet', 'Su girişi', 'مدخل الماء'],
    'conn.water_out':         ['Suv chiqishi', 'Слив воды', 'Water outlet', 'Su çıkışı', 'منفذ الماء'],
    'conn.drain':             ['Drenaj / kanalizatsiya', 'Дренаж / канализация', 'Drain / sewer',
                                'Drenaj / kanalizasyon', 'الصرف / المجاري'],
    'conn.gas':               ['Gaz', 'Газ', 'Gas', 'Gaz', 'غاز'],
    'conn.ventilation':       ['Ventilyatsiya', 'Вентиляция', 'Ventilation', 'Havalandırma', 'التهوية'],
    'conn.refrigerant':       ['Freon trassasi', 'Трасса фреона', 'Refrigerant line', 'Freon hattı', 'خط Refrigerant'],
    'conn.duct':              ['Havo kanali', 'Воздуховод', 'Duct', 'Hava kanalı', 'مجرى الهواء'],
    'conn.coaxial':           ['Koaksial trassa', 'Коаксиальная трасса', 'Coaxial line',
                                'Koaksiyel hat', 'خط coaxial']
  };

  // ======================================================
  // YORDAMCHILAR
  // ======================================================
  function normLang(l) {
    l = String(l || '').toLowerCase();
    return LANGS.indexOf(l) >= 0 ? l : 'uz';
  }

  function currentLang() {
    // 1) I18N tizimi (i18n.js)
    try { if (window.I18N && window.I18N.lang) return normLang(window.I18N.lang); } catch (e) {}
    // 2) <html lang="...">
    try {
      var el = document.documentElement;
      if (el && el.getAttribute('lang')) return normLang(el.getAttribute('lang'));
    } catch (e) {}
    // 3) localStorage
    try {
      var v = window.localStorage.getItem('app_lang');
      if (v) return normLang(v);
    } catch (e) {}
    return 'uz';
  }

  function index(l) {
    var i = LANGS.indexOf(l);
    return i < 0 ? 0 : i;
  }

  function interpolate(s, params) {
    if (!params) return s;
    return String(s).replace(/\{(\w+)\}/g, function (m, k) {
      return params[k] != null ? String(params[k]) : m;
    });
  }

  // ======================================================
  // ASOSIY API
  // ======================================================
  // ET('equipment.title') / ET('equipment.found', {n: 3})
  function ET(key, params) {
    var row = DICT[key];
    if (!row) return key;                    // kalit topilmasa — kalitni qaytaradi
    var v = row[index(currentLang())];
    if (v == null || v === '') v = row[0];   // bo'sh bo'lsa o'zbekchaga
    return interpolate(v, params);
  }

  window.EquipmentI18n = {
    t: ET,
    lang: currentLang,
    isRTL: function () { return currentLang() === 'ar'; },
    // Til o'zgarganda UI qayta chizilishi uchun hodisa
    onChange: function (fn) {
      window.addEventListener('equipmentI18n:change', function () { try { fn(); } catch (e) {} });
    }
  };
  window.ET = ET;
  window.ELang = currentLang;
})();
