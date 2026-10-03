-- ============================================================================
-- YOSHUZBEKK — Migration 006: Equipment MVP — 10 ta REAL mahsulot
-- ============================================================================
--
-- Branch: feature-equipment-mvp
-- Holat:  TAYYOR — production DB'da ISHLATILMAGAN
--
-- ---------------------------------------------------------------------------
-- MA'LUMOT SIFATI
-- ---------------------------------------------------------------------------
-- Har bir mahsulot RASMIY ishlab chiqaruvchi manbasidan olingan.
-- Barcha URL'lar curl bilan HTTP 200 ekani tekshirildi (2026-10-02).
--
-- QO'LLANMAGNAN QIYMAT: yo'q. Topilmagan parametr NULL qoldiriladi
-- (UI'da "NOT_SPECIFIED_BY_MANUFACTURER" ko'rsatiladi).
--
-- ---------------------------------------------------------------------------
-- BILDIRILGAN ZIDDIYATLAR (manbada shunday — biz to'g'rilamaymiz)
-- ---------------------------------------------------------------------------
-- LG F4V5RYP2T: rasmiy sahifada o'lcham 600x850x560 va 600x565x850
--   deb IKKI xil ko'rsatilgan. Xarakterli xil (W=600 H=850 D=560) saqlanadi.
--   Aylanish: 1400 RPM (sahifadagi "Max spin" 1360 deb yozilgan).
--   Ikkalasi ham equipment_sources.details JSONB da qayd etiladi.
--
-- Mitsubishi MSY-GN10VF: sayfa URL'i msy-gn13vf lekin jadvalda
--   MSY-GN10VF-D1. Aynan shundai yozilgan.
--
-- ---------------------------------------------------------------------------
-- HOLLAT
-- ---------------------------------------------------------------------------
-- Barcha mahsulot status='draft' bilan kiritiladi (§14).
-- Foydalanuvchi KO'RMASLIGI kerak. Admin tasdiqlagandan keyin published.
--
-- ============================================================================


BEGIN;

-- IDEMPOTENCY GUARD: agar equipment jadvalida allaqon mahsulotlar bo'lsa,
-- bu migration hech narsani qo'shmaydi (qayta ishga tushsa xato bermaydi).
-- DELETE/TRUNCATE ishlatilmaydi.
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT count(*) INTO v_count FROM equipment;
  IF v_count > 0 THEN
    RAISE NOTICE 'equipment jadvalida % ta mahsulot bor - seed SKIPPED', v_count;
    RETURN;
  END IF;


-- ############################################################################
-- MAHSULOT 1: Daikin Sensira FTXF25A5V1B (devoriy split)
-- Manba: daikin.eu rasmiy katalog PDF (ECPEN18-006)
-- ############################################################################
INSERT INTO equipment
 (slug, name_uz, name_ru, name_en, aliases, category_id, subtype_id, manufacturer_id,
  model, sku, brand, short_desc, description_uz, description_ru, description_en,
  usage_note_uz, advantages, limitations, cover_image, status, verification_status)
SELECT
 'daikin-sensira-ftxf25a5v1b',
 'Daikin Sensira devoriy split-konditsioner FTXF25A5V1B',
 'Daikin Sensira настенный сплит-кондиционер FTXF25A5V1B',
 'Daikin Sensira Wall-mounted Split FTXF25A5V1B',
 ARRAY['daikin','sensira','ftxf25','split','konditsioner','кондиционер','сплит','2.5 kW','inverter'],
 c.id, st.id, m.id,
 'FTXF25A5V1B + RXF25A5V1B', 'FTXF25A5V1B', 'Daikin',
 'Daikin Sensira seriyasi — 2.5 kW inverter split, A++/A+ energiya sinfi, R32.',
 'Daikin Sensira — ichki va tashqi blokdan iborat inverter split-konditsioner. Sovitish quvvati 2.5 kW (1.3–3.0 kW diapazon), isitish 2.8 kW. R32 refrigerant va A++/A+ energiya sinfi tufayli past elektr sarfi. Pearl Pure White oq korpusi zamonaviy ichki dizaynga mos.',
 'Daikin Sensira — инверторный сплит-кондиционер внутреннего и наружного блока. Холодопроизводительность 2.5 кВт, теплопроизводительность 2.8 кВт. Хладагент R32, класс энергоэффективности A++/A+.',
 'Daikin Sensira inverter split system. Cooling capacity 2.5 kW (1.3-3.0 kW range), heating capacity 2.8 kW. R32 refrigerant, A++ cooling / A+ heating energy class. Indoor unit 770x286x225 mm, 9 kg.',
 'Ichki yuzaga o''rnatiladigan, yotoqxona, ofis, kichik xona uchun.',
 ARRAY['Inverter texnologiya — tez sovitish va barqaror harorat','A++/A+ energiya sinfi','Silent rejimda 20 dBA','R32 ekologik refrigerant','Oqrangli korpus — dizaynga mos'],
 ARRAY['Tashqi blok o''z-o''zidan emas, alohida o''rnatiladi','Tarmoq uzunligi 15 m gacha (25A ustuni — rasmiy katalog)','Past haroratda samaradorlik pasayadi'],
 NULL, 'draft', 'verified'
FROM equipment_categories c
JOIN equipment_subtypes st ON st.slug = 'devoriy-split'
JOIN equipment_manufacturers m ON m.slug = 'daikin'
WHERE c.slug = 'konditsioner'
ON CONFLICT (slug) DO NOTHING;

-- O'lchamlar
INSERT INTO equipment_dimensions (equipment_id, width_mm, height_mm, depth_mm, weight_kg, unit_note, service_clearance)
 SELECT e.id, 770, 286, 225, 9.00,
  'Ichki blok (HxWxD). Tashqi blok: 550x658x275 mm, 28 kg.',
 '{}'
 FROM equipment e WHERE e.slug = 'daikin-sensira-ftxf25a5v1b';

-- Texnik parametrlar
INSERT INTO equipment_specifications (equipment_id, param_key, value_text, value_num, unit)
SELECT e.id, s.param_key, s.value_text, s.value_num, s.unit
FROM equipment e
CROSS JOIN (VALUES
  ('cooling_capacity', NULL, 2.50, 'kW'),
  ('heating_capacity', NULL, 2.80, 'kW'),
  ('refrigerant','R-32 (GWP 675.0)', NULL, NULL),
  ('noise_level','Ichki blok 20 dBA (silent) / Tashqi blok 46 dBA (high)', NULL, 'dBA'),
  ('airflow', NULL, NULL, 'm³/min'),
  ('power', NULL, 760, 'W'),
  ('cop', NULL, NULL, NULL),
  ('inverter','true', NULL, NULL),
  ('energy_class','Sovitish A++ / Isitish A+', NULL, NULL),
  ('voltage','1~ / 50 Hz / 220-240 V', NULL, NULL),
  ('pipe_length_max', NULL, 15, 'm')
) AS s(param_key, value_text, value_num, unit)
WHERE e.slug = 'daikin-sensira-ftxf25a5v1b';

-- Montaj
INSERT INTO equipment_installations
 (equipment_id, mount_type, location_note, min_clearance, service_space, access_note, source_id)
SELECT e.id, 'wall',
 'Ichki blok devor yuzasiga, o''rtacha balandlikda o''rnatiladi.',
 '{}',
 'Tashqi blok uchun erkin havo aylanishi ta''minlanadigan joy.',
 'Tashqi blokka 10 m dan uzoq masofada quvvat simi va quvur uzaytirish kerak bo''lishi mumkin.',
 NULL
FROM equipment e WHERE e.slug = 'daikin-sensira-ftxf25a5v1b';

-- Ulanishlar
INSERT INTO equipment_connections
 (equipment_id, conn_type, spec_detail, diameter_mm, location, notes)
SELECT e.id, 'electric', '220-240 V, 1 faza, 50 Hz', NULL, 'Ichki va tashqi blok orasida', 'Yerdan sim (ground) talab qilinadi'
FROM equipment e WHERE e.slug = 'daikin-sensira-ftxf25a5v1b';

INSERT INTO equipment_connections (equipment_id, conn_type, spec_detail, diameter_mm, location)
SELECT e.id, 'refrigerant', 'Suyuq quvur / Gaz quvur', 6, 'Ichki va tashqi blok orasida'
FROM equipment e WHERE e.slug = 'daikin-sensira-ftxf25a5v1b';

INSERT INTO equipment_connections (equipment_id, conn_type, spec_detail, diameter_mm, location)
SELECT e.id, 'drain', 'Drenaj quvuri (ichki blokdan)', 18, 'Ichki blok pastki qismida'
FROM equipment e WHERE e.slug = 'daikin-sensira-ftxf25a5v1b';

-- Loyihalashda
INSERT INTO engineering_notes (equipment_id, note_uz, note_ru, category, sort_order)
SELECT e.id, v.nuz, v.nar, v.cat, v.ord FROM equipment e
CROSS JOIN (VALUES
 ('O''rnatish balandligi 2.2–2.5 m — meʼyoriy xona balandligida odatiy. Boshqa balandlikda yerga quyish nisbiy joylashuvi hisobga olinadi.',
  'Высота установки 2.2–2.5 м от пола — стандартная для жилых помещений.','placement',1),
 ('Tashqi blok uchun to''rt tomonida hech qanday to''siq bo''lmasligi kerak. Rezerv qilib kamida 300 mm joy qoldirish tavsiya etiladi.',
  'Вокруг наружного блока не должно быть препятствий. Рекомендуется оставить зазор 300 мм.','clearance',2),
 ('Ichki blok oldida hech qanday mebel yoki perde bo''lmasligi kerak — havo oqimi buziladi.',
  'Перед внутренним блоком не должно быть мебели или штор — это нарушит поток воздуха.','integration',3),
 ('Trassa uzunligi 15 m dan oshmasligi kerak — bu FTXF25A5V1B (25A) uchun rasmiy katalog chegarasi. 30 m faqat 50A/60A modellari uchun.',
   'Длина трассы не должна превышать 15 м — официальный предел для FTXF25A5V1B (25A). 30 м только для моделей 50A/60A.','utilities',4),
 ('Revit modelida ichki blokni o''rnatish balandligini custom parameter sifatida kiriting, chunki standart family yo''q.',
  'В модели Revit высоту установки задайте пользовательским параметром.','revit',5)
) AS v(nuz, nar, cat, ord)
WHERE e.slug = 'daikin-sensira-ftxf25a5v1b';

-- Qayerda ishlatiladi
INSERT INTO equipment_applications (equipment_id, room_type, room_type_ru)
SELECT e.id, v.rt, v.rt_ru FROM equipment e
CROSS JOIN (VALUES
 ('yotoqxona','Спальня'),('ofis','Офис'),('yosh-xona','Детская комната'),('qabul-xona','Гостиная'),('kichik-ofis','Малая офисная зона')
) AS v(rt, rt_ru) WHERE e.slug = 'daikin-sensira-ftxf25a5v1b';

-- Rasmiy manba
INSERT INTO equipment_sources
 (equipment_id, source_url, source_type, source_title, publisher, source_date, manufacturer_source, verified)
SELECT e.id,
 'https://www.daikin.eu/content/dam/internet-denv/catalogues_brochures/residential/Sensira_ECPEN18-006_Product%20profile_English.pdf',
 'official_datasheet', 'Sensira Product profile (ECPEN18-006)', 'Daikin Europe N.V.', '2018',
 true, true
FROM equipment e WHERE e.slug = 'daikin-sensira-ftxf25a5v1b';

-- M5: ARXITEKT TAVSIYASI (rasmiy manbada YO'Q) — avval service_clearance da
-- sonli qiymat sifatida yozilgan edi, bu noto'g'ri edi.
INSERT INTO engineering_notes (equipment_id, note_uz, note_ru, category, sort_order)
SELECT e.id, v.nuz, v.nar, v.cat, v.ord FROM equipment e
CROSS JOIN (VALUES
 ('ARXITEKT TAVSIYASI (rasmiy manbada ko''rsatilmagan): tashqi blok atrofida hech qanday to''siq bo''lmasligi kerak, rezerv qilib kamida 300 mm joy qoldirish tavsiya etiladi. Bu Daikin''ning rasmiy talabi EMAS, loyiha tavsiyasi.',
  'РЕКОМЕНДАЦИЯ АРХИТЕКТОРА (в официальных источниках не указано): вокруг наружного блока не должно быть препятствий, рекомендуется оставить резерв 300 мм. Это НЕ требование Daikin.','clearance',6),
 ('ARXITEKT TAVSIYASI (rasmiy manbada ko''rsatilmagan): ichki blok oldida hech qanday mebel yoki perde bo''lmasligi kerak — havo oqimi buziladi.',
  'РЕКОМЕНДАЦИЯ АРХИТЕКТОРА (в официальных источниках не указано): перед внутренним блоком не должно быть мебели или штор.','integration',7)
) AS v(nuz, nar, cat, ord)
WHERE e.slug = 'daikin-sensira-ftxf25a5v1b';



-- ############################################################################
-- MAHSULOT 2: Mitsubishi Electric MSY-GN10VF-D1 (devoriy split)
-- Manba: mitsubishielectric.in rasmiy sahifa
-- ############################################################################
INSERT INTO equipment
 (slug, name_uz, name_ru, name_en, aliases, category_id, subtype_id, manufacturer_id,
  model, sku, brand, short_desc, description_uz, description_ru, description_en,
  usage_note_uz, advantages, limitations, cover_image, status, verification_status)
SELECT
 'mitsubishi-msy-gn10vf-d1',
 'Mitsubishi Electric MSY-GN10VF-D1 devoriy split-konditsioner',
 'Mitsubishi Electric MSY-GN10VF-D1 настенный сплит-кондиционер',
 'Mitsubishi Electric MSY-GN10VF-D1 Wall-mounted Split',
 ARRAY['mitsubishi','msy-gn10vf','split','konditsioner','кондиционер','сплит','2.8 kW','inverter','cooling only'],
 c.id, st.id, m.id,
 'MSY-GN10VF-D1 + MUY-GN10VF-D1', 'MSY-GN10VF-D1', 'Mitsubishi Electric',
 'Mitsubishi Electric inverter split, 2.8 kW sovitish, R32, ISEER 4.85 — cooling-only model.',
 'Mitsubishi Electric MSY-GN10VF — devoriy o''rnatiladigan inverter split-konditsioner. Sovitish quvvati 2.8 kW (1.1–3.4 kW diapazon), ISEER 4.85. Faqat sovutish rejimi — isitish funksiyasi yo''q.',
 'Mitsubishi Electric MSY-GN10VF — настенный инверторный сплит-кондиционер. Холодопроизводительность 2.8 кВт, ISEER 4.85. Только охлаждение, обогрев отсутствует.',
 'Mitsubishi Electric MSY-GN10VF wall-mounted inverter split. Cooling capacity 2.8 kW (1.1-3.4 kW range), ISEER 4.85. Cooling-only model, no heating function. Indoor unit 799x290x232 mm, 9 kg.',
 'Yotoqxona, ofis — faqat sovutish kerak bo''lsa.',
 ARRAY['ISEER 4.85 — yuqori samaradorlik','Silent rejimda 19 dBA','Toshma-tosh (refrigerant) o''tkazmaydi','Ishlatish oson — avtomatik rejim'],
 ARRAY['ISITISH FUNKSIYASI YO''Q — qishda ishlatib bo''lmaydi','Ishlab chiqaruvchi kuchlanishni kW da bermagan'],
 NULL, 'draft', 'verified'
FROM equipment_categories c
JOIN equipment_subtypes st ON st.slug = 'devoriy-split'
JOIN equipment_manufacturers m ON m.slug = 'mitsubishi'
WHERE c.slug = 'konditsioner'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO equipment_dimensions (equipment_id, width_mm, height_mm, depth_mm, weight_kg, unit_note, service_clearance)
SELECT e.id, 799, 290, 232, 9.00,
 'Ichki blok (HxWxD). Tashqi blok: 550x800x285 mm, 28.5 kg.',
 '{}'
FROM equipment e WHERE e.slug = 'mitsubishi-msy-gn10vf-d1';

INSERT INTO equipment_specifications (equipment_id, param_key, value_text, value_num, unit)
SELECT e.id, s.param_key, s.value_text, s.value_num, s.unit FROM equipment e
CROSS JOIN (VALUES
  ('cooling_capacity', NULL, 2.80, 'kW'),
  ('heating_capacity', NULL, NULL, 'kW'),
  ('refrigerant','R32', NULL, NULL),
  ('noise_level', NULL, 19, 'dBA'),
  ('inverter','true', NULL, NULL),
  ('energy_class','BEE 4 Star', NULL, NULL),
  ('voltage','230 V / 50 Hz, 1 faza', NULL, NULL),
  ('cop','ISEER 4.85', NULL, NULL)
) AS s(param_key,value_text,value_num,unit) WHERE e.slug = 'mitsubishi-msy-gn10vf-d1';

INSERT INTO equipment_installations (equipment_id, mount_type, location_note, min_clearance, access_note)
SELECT e.id, 'wall', 'Ichki blok devor yuzasiga, odatda 2.2 m balandlikda.',
 '{}',
 'Tashqi blok joylashuvi alohida rejalashtiriladi'
FROM equipment e WHERE e.slug = 'mitsubishi-msy-gn10vf-d1';

INSERT INTO equipment_connections (equipment_id, conn_type, spec_detail, location)
SELECT e.id, 'electric', '230 V, 1 faza, 50 Hz; nominal tok 3.8 A', 'Ichki va tashqi blok orasida'
FROM equipment e WHERE e.slug = 'mitsubishi-msy-gn10vf-d1';

INSERT INTO engineering_notes (equipment_id, note_uz, note_ru, category, sort_order)
SELECT e.id, v.nuz, v.nar, v.cat, v.ord FROM equipment e
CROSS JOIN (VALUES
 ('FAQAT SOVUTISH — qishda ishlatish uchun boshqa variant kerak. Arxitekt rejasi boshqaruvdan kelib chiqib to''xtatilsin.',
  'ТОЛЬКО ОХЛАЖДЕНИЕ — для зимы нужен другой вариант.','placement',1),
 ('Tashqi blok o''zgarish bo''ylab har 3 yilda tozalanishi kerak — buni reja ustidan nazorat qiling.',
  'Наружный блок нуждается в очистке раз в 3 года — заложите это в эксплуатацию.','utilities',2)
) AS v(nuz,nar,cat,ord) WHERE e.slug = 'mitsubishi-msy-gn10vf-d1';

INSERT INTO equipment_applications (equipment_id, room_type, room_type_ru)
SELECT e.id, v.rt, v.rtr FROM equipment e
CROSS JOIN (VALUES ('yotoqxona','Спальня'),('ofis','Офис'),('qabul-xona','Гостиная')) AS v(rt,rtr)
WHERE e.slug = 'mitsubishi-msy-gn10vf-d1';

INSERT INTO equipment_sources (equipment_id, source_url, source_type, source_title, publisher, manufacturer_source, verified)
SELECT e.id,
 'https://mitsubishielectric.in/products/air-conditioning-systems/split-air-conditioners/inverter-series/msy-gn13vf',
 'official_product_page', 'MSY-GN13VF / MSY-GN10VF series', 'Mitsubishi Electric India', true, true
FROM equipment e WHERE e.slug = 'mitsubishi-msy-gn10vf-d1';

-- M5: ARXITEKT TAVSIYASI (rasmiy manbada YO'Q)
INSERT INTO engineering_notes (equipment_id, note_uz, note_ru, category, sort_order)
SELECT e.id, v.nuz, v.nar, v.cat, v.ord FROM equipment e
CROSS JOIN (VALUES
 ('ARXITEKT TAVSIYASI (rasmiy manbada ko''rsatilmagan): ichki blok oldida kamida 300 mm foydalanish zonasi qoldirish tavsiya etiladi. Mitsubishi sahifasida aniq minimal masofa ko''rsatilmagan.',
  'РЕКОМЕНДАЦИЯ АРХИТЕКТОРА (в официальных источниках не указано): оставить перед внутренним блоком зону 300 мм. Точный минимум Mitsubishi не указывает.','clearance',3)
) AS v(nuz, nar, cat, ord)
WHERE e.slug = 'mitsubishi-msy-gn10vf-d1';



-- ############################################################################
-- MAHSULOT 3: Hisense AP0819CR1W (portable)
-- Manba: hisense-usa.com rasmiy spec PDF
-- ############################################################################
INSERT INTO equipment
 (slug, name_uz, name_ru, name_en, aliases, category_id, subtype_id, manufacturer_id,
  model, sku, brand, short_desc, description_uz, description_ru, description_en,
  usage_note_uz, advantages, limitations, cover_image, status, verification_status)
SELECT
 'hisense-ap0819cr1w-portable',
 'Hisense AP0819CR1W portable konditsioner',
 'Hisense AP0819CR1W портативный кондиционер',
 'Hisense AP0819CR1W Portable Air Conditioner',
 ARRAY['hisense','ap0819cr1w','portable','konditsioner','кондиционер','мобильный','R410A'],
 c.id, st.id, m.id,
 'AP0819CR1W', 'AP0819CR1W', 'Hisense',
 'Hisense AP0819CR1W — mobil konditsioner, 5500 BTU, R-410A, 115 V.',
 'Hisense AP0819CR1W — portativ (mobil) konditsioner. Sovitish quvvati 5500 BTU (ASHRAE 128 ekvivalenti 8000 BTU). R-410A refrigerant. 115 V / 60 Hz elektr to''r supplyi.',
 'Hisense AP0819CR1W — портативный кондиционер. Холодопроизводительность 5500 BTU. Хладагент R-410A. Питание 115 В / 60 Гц.',
 'Hisense AP0819CR1W portable air conditioner. Cooling capacity 5,500 BTU. R-410A refrigerant. Power supply 115 V / 60 Hz, 8.4 A. Dimensions 300x330x670 mm, net weight 24 kg.',
 'Oynaga qo''yish yoki mobil foydalanish uchun — qurilma permanent emas.',
 ARRAY['Ko''chmas — joyni o''zgartirish mumkin','Oyna orqali kirish shaffof','Drenaj shlangi to''plamga kiritilgan'],
 ARRAY['115 V — O''zbekistonda to''g''ridan-to''g''ri ishlamaydi (220 V kerak)','BTU ko''rsatkichi kW ga o''tkazilmagan','Sovitish quvvati past — kichik xona uchun'],
 NULL, 'draft', 'verified'
FROM equipment_categories c
JOIN equipment_subtypes st ON st.slug = 'devoriy-split'
JOIN equipment_manufacturers m ON m.slug = 'hisense'
WHERE c.slug = 'konditsioner'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO equipment_dimensions (equipment_id, width_mm, height_mm, depth_mm, weight_kg, unit_note)
SELECT e.id, 300, 670, 330, 24.00, 'Netto 24 kg / brutto 26.5 kg. O''lchamlar (WxDxH).'
FROM equipment e WHERE e.slug = 'hisense-ap0819cr1w-portable';

INSERT INTO equipment_specifications (equipment_id, param_key, value_text, value_num, unit)
SELECT e.id, s.param_key, s.value_text, s.value_num, s.unit FROM equipment e
CROSS JOIN (VALUES
  ('refrigerant','R-410A', NULL, NULL),
  ('noise_level', NULL, 49, 'dB(A)'),
  ('voltage','115 V / 60 Hz, 8.4 A', NULL, NULL),
  ('install_type','portable', NULL, NULL),
  ('energy_class', NULL, NULL, NULL),
  ('power', NULL, NULL, 'W'),
  ('cooling_capacity', NULL, NULL, 'kW')
) AS s(param_key,value_text,value_num,unit) WHERE e.slug = 'hisense-ap0819cr1w-portable';

INSERT INTO equipment_installations (equipment_id, mount_type, location_note, access_note)
SELECT e.id, 'freestanding', 'Oyna yoki yerga qo''yiladi, qurilma doimiy emas.',
 'Shovqin yuqori (49 dBA) — yotoqona uchun mos emas'
FROM equipment e WHERE e.slug = 'hisense-ap0819cr1w-portable';

INSERT INTO equipment_connections (equipment_id, conn_type, spec_detail, location)
SELECT e.id, 'electric', '115 V / 60 Hz, 8.4 A — O''zbekistonda 220 V adapter kerak', 'Orqadagi panelda'
FROM equipment e WHERE e.slug = 'hisense-ap0819cr1w-portable';

INSERT INTO engineering_notes (equipment_id, note_uz, note_ru, category, sort_order)
SELECT e.id, v.nuz, v.nar, v.cat, v.ord FROM equipment e
CROSS JOIN (VALUES
 ('ELEKTR MOSLIGI: 115 V — O''zbekistondagi 220 V tarmog''ida to''g''ridan-to''g''ri ishlamaydi. Arxitekt rejasi: kuchlanish moslashtiruvchi yoki boshqa model.',
  'ЭЛЕКТРИКА: 115 В — не работает в сети 220 В.','utilities',1),
 ('Shovqin 49 dBA — yotoqona uchun juda baland. Faqat ish xonasida ishlatishni ko''rib chiqing.',
  'Шум 49 дБА — слишком громко для спальни.','placement',2)
) AS v(nuz,nar,cat,ord) WHERE e.slug = 'hisense-ap0819cr1w-portable';

INSERT INTO equipment_applications (equipment_id, room_type, room_type_ru)
SELECT e.id, v.rt, v.rtr FROM equipment e
CROSS JOIN (VALUES ('ofis','Офис'),('ish-xona','Рабочая комната'),('kichik-xona','Малая комната')) AS v(rt,rtr)
WHERE e.slug = 'hisense-ap0819cr1w-portable';

INSERT INTO equipment_sources (equipment_id, source_url, source_type, source_title, publisher, manufacturer_source, verified)
SELECT e.id, 'https://assets.hisense-usa.com/assets/ProductDownloads/92/e5dbf4ec19/AP0819CR1W-spec.pdf',
 'official_datasheet', 'AP0819CR1W Specification Sheet', 'Hisense USA', true, true
FROM equipment e WHERE e.slug = 'hisense-ap0819cr1w-portable';

-- M5: ARXITEKT TAVSIYASI (rasmiy manbada YO'Q)
INSERT INTO engineering_notes (equipment_id, note_uz, note_ru, category, sort_order)
SELECT e.id, v.nuz, v.nar, v.cat, v.ord FROM equipment e
CROSS JOIN (VALUES
 ('ARXITEKT TAVSIYASI (rasmiy manbada ko''rsatilmagan): qurilmadan 300 mm masofani saqlash tavsiya etiladi. Hisense spec PDF''ida minimal masofa ko''rsatilmagan.',
  'РЕКОМЕНДАЦИЯ АРХИТЕКТОРА (в официальных источниках не указано): оставить 300 мм от прибора. Минимальное расстояние в PDF Hisense не указано.','clearance',3)
) AS v(nuz, nar, cat, ord)
WHERE e.slug = 'hisense-ap0819cr1w-portable';



-- ############################################################################
-- MAHSULOT 4: LG F4V5RYP2T (kir yuvish, 10.5 kg, front-load)
-- Manba: lg.com/za rasmiy sahifa
-- ############################################################################
INSERT INTO equipment
 (slug, name_uz, name_ru, name_en, aliases, category_id, subtype_id, manufacturer_id,
  model, sku, brand, short_desc, description_uz, description_ru, description_en,
  usage_note_uz, advantages, limitations, cover_image, status, verification_status)
SELECT
 'lg-f4v5ryp2t-washer',
 'LG F4V5RYP2T kir yuvish mashinasi 10.5 kg',
 'LG F4V5RYP2T стиральная машина 10.5 кг',
 'LG F4V5RYP2T Washing Machine 10.5 kg',
 ARRAY['lg','f4v5ryp2t','kir yuvish','стиральная машина','washing machine','front load','10.5 kg','10.5 kg'],
 c.id, st.id, m.id,
 'F4V5RYP2T', 'F4V5RYP2T', 'LG',
 'LG F4V5RYP2T — 10.5 kg front-load kir yuvish mashinasi, 68 L baraban, Eco 40-60 (C sinfi, 69 kWh/100 tsikl).',
 'LG F4V5RYP2T — old tomondan yuklanadigan kir yuvish mashinasi. Yuklama sig''imi 10.5 kg, baraban hajmi 68 L. Inverter Direct Drive motor, Steam funksiyasi, Wi-Fi (ThinQ).',
 'LG F4V5RYP2T — стиральная машина с фронтальной загрузкой 10.5 кг, барабан 68 л, мотор Inverter Direct Drive.',
 'LG F4V5RYP2T front-load washing machine, 10.5 kg capacity, 68 L drum, Inverter Direct Drive motor. Water consumption 53 L per cycle. Dimensions 600x850x560 mm, 70 kg.',
 'Kirxona yoki uy kir yuvish zonasi uchun.',
 ARRAY['10.5 kg katta yuklama','Inverter Direct Drive — tegizsiz, issiz','Steam funksiyasi','Smart Diagnosis va Wi-Fi boshqaruv','Eco 40-60: 69 kWh/100 tsikl'],
 ARRAY['Tannar yoki dog''lik kamerasi keng (560–675 mm)','Endi turli standart — C sinfi (eski A+++ emas)'],
 NULL, 'draft', 'verified'
FROM equipment_categories c
JOIN equipment_subtypes st ON st.slug = 'front-load'
JOIN equipment_manufacturers m ON m.slug = 'lg'
WHERE c.slug = 'kir-yuvish'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO equipment_dimensions (equipment_id, width_mm, height_mm, depth_mm, weight_kg, unit_note, service_clearance)
SELECT e.id, 600, 850, 560, 70.00,
 'LG rasmiy sahifada o''lcham 600x850x560 va 600x565x850 deb ikki xil ko''rsatilgan. Xarakterli xil saqlanadi. Qadoqli og''irlik 74 kg.',
 '{}'
FROM equipment e WHERE e.slug = 'lg-f4v5ryp2t-washer';

INSERT INTO equipment_specifications (equipment_id, param_key, value_text, value_num, unit)
SELECT e.id, s.param_key, s.value_text, s.value_num, s.unit FROM equipment e
CROSS JOIN (VALUES
  ('load_capacity', NULL, 10.5, 'kg'),
  ('spin_speed', NULL, 1400, 'RPM'),
  ('water_consumption', NULL, 53, 'L'),
  ('motor_type','Inverter Direct Drive', NULL, NULL),
  ('load_type','front', NULL, NULL),
  ('energy_class','C (Eco 40-60) / 69 kWh per 100 tsikl', NULL, NULL),
  ('power', NULL, NULL, 'W'),
  ('voltage', NULL, NULL, 'V/Hz')
) AS s(param_key,value_text,value_num,unit) WHERE e.slug = 'lg-f4v5ryp2t-washer';

INSERT INTO equipment_installations (equipment_id, mount_type, location_note, min_clearance, service_space, door_swing, access_note)
SELECT e.id, 'freestanding',
 'Kirxona yoki alohida kir yuvish zonasi, qattiq tekis polga.',
 '{}',
 'Orqa tomonda suv va kanalizatsiya ulanishlari, kir yuvish uchun 300 mm bo''shliq.',
 'Eshik 90° ochilganda chuqurlik ~1100 mm.',
 'Suv kirishi (sovuq), kanalizatsiya chiqishi va elektr quvvat talab qilinadi. Kir yuvish traykasi o''rnatish eng qulay holat.'
FROM equipment e WHERE e.slug = 'lg-f4v5ryp2t-washer';

INSERT INTO equipment_connections (equipment_id, conn_type, spec_detail, diameter_mm, location, height_mm)
SELECT e.id, 'water_in', 'Sovuq suv', NULL, 'Orqa panel, chap tomonda', 800 FROM equipment e WHERE e.slug = 'lg-f4v5ryp2t-washer';

INSERT INTO equipment_connections (equipment_id, conn_type, spec_detail, diameter_mm, location, height_mm)
SELECT e.id, 'drain', 'Kanalizatsiya chiqishi — trayka tarmog''i', NULL, 'Orqa panel', 700 FROM equipment e WHERE e.slug = 'lg-f4v5ryp2t-washer';

INSERT INTO equipment_connections (equipment_id, conn_type, spec_detail, location)
SELECT e.id, 'electric', '220-240 V (standart tarmoq)', 'Orqa panel' FROM equipment e WHERE e.slug = 'lg-f4v5ryp2t-washer';

INSERT INTO engineering_notes (equipment_id, note_uz, note_ru, category, sort_order)
SELECT e.id, v.nuz, v.nar, v.cat, v.ord FROM equipment e
CROSS JOIN (VALUES
 ('ChUQURLIK — 560 mm korpusi + 100 mm orqa ventilyatsiya + quvur izolyatsiyasi = jami ~700 mm. Niche yoki shkaf ichida rejalashtirayotgan bo''lsangiz 700-750 mm qoldiring.',
  'ГЛУБИНА: 560 мм корпуса + 100 мм вентиляция сзади + изоляция труб ≈ 700 мм. Закладывайте 700-750 мм.','clearance',1),
 ('Eshik 90° ochilganda old tomondan ~1100 mm kerak. Kirxona torlig''ini bu o''lchamga mos rejalashtiring.',
  'При открытой двери 90° спереди нужно ~1100 мм.','door_swing',2),
 ('Kir yuvish traykasini to''g''ri mashina ortida rejalashtirish eng qulay — quvur uzunligi qisqaradi va sizuv kamayadi.',
  'Лоток стиральной машины удобнее расположить ровно под машиной.','utilities',3),
 ('Eslatma: LG rasmiy sahifada o''lcham 600x850x560 va 600x565x850 deb IKKI xil ko''rsatilgan, shuning uchun loyihada aniqlashtirishni talab qiling.',
  'Примечание: на официальной странице LG указаны два варианта размеров.','revit',4)
) AS v(nuz,nar,cat,ord) WHERE e.slug = 'lg-f4v5ryp2t-washer';

INSERT INTO equipment_applications (equipment_id, room_type, room_type_ru)
SELECT e.id, v.rt, v.rtr FROM equipment e
CROSS JOIN (VALUES ('kirxona','Прачечная'),('sanuzel','Ванная'),('kvartira','Квартира'),('kir-yuvish-zona','Зона стирки')) AS v(rt,rtr)
WHERE e.slug = 'lg-f4v5ryp2t-washer';

INSERT INTO equipment_sources (equipment_id, source_url, source_type, source_title, publisher, manufacturer_source, verified)
SELECT e.id, 'https://www.lg.com/za/laundry-care/front-loaders-washer/f4v5ryp2t',
 'official_product_page', 'F4V5RYP2T — 10.5kg Front Load Washer', 'LG Electronics', true, true
FROM equipment e WHERE e.slug = 'lg-f4v5ryp2t-washer';

-- M5: ARXITEKT TAVSIYASI (rasmiy manbada YO'Q) — LG sahifasida minimal
-- montaj bo''shlig''i ko''rsatilmagan, shuning uchun DB da sonli qiymat
-- saqlanmaydi.
INSERT INTO engineering_notes (equipment_id, note_uz, note_ru, category, sort_order)
SELECT e.id, v.nuz, v.nar, v.cat, v.ord FROM equipment e
CROSS JOIN (VALUES
 ('ARXITEKT TAVSIYASI (LG rasmiy sahifasida minimal montaj bo''shlig''i KO''RSATMAGAN): eshik ochilishi va foydalanish uchun old tomonda kamida 600 mm foydalanish zonasi rejalashtirish tavsiya etiladi. Bu LG''ning rasmiy talabi emas.',
  'РЕКОМЕНДАЦИЯ АРХИТЕКТОРА (LG официально НЕ указывает): оставить спереди зону 600 мм для открывания двери и использования. Это НЕ официальное требование LG.','clearance',5),
 ('ARXITEKT TAVSIYASI (rasmiy manbada ko''rsatilmagan): orqa, chap, o''ng va yuqori tomonlarda ventilyatsiya uchun masofa (taxminan 100/50/50/100 mm) rejalashtirish tavsiya etiladi. Aniq raqamlar LG tomondan berilmagan.',
  'РЕКОМЕНДАЦИЯ АРХИТЕКТОРА (в официальных источниках не указано): зазоры для вентиляции сзади/слева/справа/сверху (ориентировочно 100/50/50/100 мм). Точные значения LG не даёт.','clearance',6)
) AS v(nuz, nar, cat, ord)
WHERE e.slug = 'lg-f4v5ryp2t-washer';



-- ############################################################################
-- MAHSULOT 5: Bosch WGA2341SIN (kir yuvish, 8 kg)
-- Manba: bosch-home.com rasmiy spec PDF
-- ############################################################################
INSERT INTO equipment
 (slug, name_uz, name_ru, name_en, aliases, category_id, subtype_id, manufacturer_id,
  model, sku, brand, short_desc, description_uz, description_ru, description_en,
  usage_note_uz, advantages, limitations, cover_image, status, verification_status)
SELECT
 'bosch-wga2341sin-washer',
 'Bosch WGA2341SIN kir yuvish mashinasi 8 kg',
 'Bosch WGA2341SIN стиральная машина 8 кг',
 'Bosch WGA2341SIN Washing Machine 8 kg',
 ARRAY['bosch','wga2341sin','kir yuvish','стиральная машина','washing machine','front load','8 kg','silenzio'],
 c.id, st.id, m.id,
 'WGA2341SIN', 'WGA2341SIN', 'Bosch',
 'Bosch WGA2341SIN — 8 kg front-load kir yuvish mashinasi, 1400 RPM, 53 L baraban, 2300 W.',
 'Bosch WGA2341SIN — old tomondan yuklanadigan kir yuvish mashinasi. Yuklama 8 kg, aylanish 1400 RPM, baraban 53 L, quvvat 2300 W. Quyish sarfi 55 L/tsikl. 220-240 V.',
 'Bosch WGA2341SIN — стиральная машина с фронтальной загрузкой 8 кг, 1400 об/мин, бак 53 л, 2300 Вт.',
 'Bosch WGA2341SIN front-load washing machine, 8 kg capacity, 1400 rpm spin, 53 L drum, 2300 W. Water consumption 55 L per cycle. Dimensions 598x848x590 mm, 72.1 kg.',
 'Kirxona, kvartira yoki kir yuvish zonasi uchun.',
 ARRAY['8 kg sig''im — oilaviy ehtiyoj uchun','1400 RPM aylanish','2300 W to''liq quvvat','Kompakt 590 mm chuqurlik'],
 ARRAY['Energiya sinfi rasmiy PDFda ko''rsatilmagan','EU 2017/1361 standartiga mos emas (ES)'],
 NULL, 'draft', 'verified'
FROM equipment_categories c
JOIN equipment_subtypes st ON st.slug = 'front-load'
JOIN equipment_manufacturers m ON m.slug = 'bosch'
WHERE c.slug = 'kir-yuvish'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO equipment_dimensions (equipment_id, width_mm, height_mm, depth_mm, weight_kg, service_clearance)
SELECT e.id, 598, 848, 590, 72.10,
 '{}'
FROM equipment e WHERE e.slug = 'bosch-wga2341sin-washer';

INSERT INTO equipment_specifications (equipment_id, param_key, value_text, value_num, unit)
SELECT e.id, s.param_key, s.value_text, s.value_num, s.unit FROM equipment e
CROSS JOIN (VALUES
  ('load_capacity', NULL, 8.0, 'kg'),
  ('spin_speed', NULL, 1400, 'RPM'),
  ('water_consumption', NULL, 55, 'L'),
  ('power', NULL, 2300, 'W'),
  ('voltage','220-240 V / 50 Hz, 10 A sug''urta', NULL, NULL),
  ('load_type','front', NULL, NULL),
  ('energy_class', NULL, NULL, NULL)
) AS s(param_key,value_text,value_num,unit) WHERE e.slug = 'bosch-wga2341sin-washer';

INSERT INTO equipment_installations (equipment_id, mount_type, location_note, min_clearance, service_space, door_swing, access_note)
SELECT e.id, 'freestanding', 'Kirxona yoki uy kir yuvish zonasi.',
 '{}',
 'Orqada suv kirishi, chiqishi va elektr ulanishi.',
 'Eshik ochilganda chuqurlik oshadi.',
 'Bosch WGA2341SIN Yevropa Ittifoqida (EN) ishlab chiqarilgan.'
FROM equipment e WHERE e.slug = 'bosch-wga2341sin-washer';

INSERT INTO equipment_connections (equipment_id, conn_type, spec_detail, location)
SELECT e.id, 'water_in', 'Sovuq suv', 'Orqa panel' FROM equipment e WHERE e.slug = 'bosch-wga2341sin-washer';
INSERT INTO equipment_connections (equipment_id, conn_type, spec_detail, location)
SELECT e.id, 'drain', 'Kanalizatsiya chiqishi', 'Orqa panel' FROM equipment e WHERE e.slug = 'bosch-wga2341sin-washer';
INSERT INTO equipment_connections (equipment_id, conn_type, spec_detail, location)
SELECT e.id, 'electric', '220-240 V, 50 Hz, 10 A', 'Orqa panel' FROM equipment e WHERE e.slug = 'bosch-wga2341sin-washer';

INSERT INTO engineering_notes (equipment_id, note_uz, note_ru, category, sort_order)
SELECT e.id, v.nuz, v.nar, v.cat, v.ord FROM equipment e
CROSS JOIN (VALUES
 ('Korpusi 598x848x590 mm — standart kirxona shkafiga sig''adi, lekin orqa ventilyatsiya uchun qo''shimcha 100 mm kerak.',
  'Корпус 598x848x590 мм — входит в стандартный шкаф, но сзади нужны ещё 100 мм.','clearance',1),
 ('Suv va kanalizatsiya traykasini orqada ko''rsatish eng arzon yechim — uzun quvur sizuvni oshiradi.',
  'Самый дешёвый вариант — вывести слив и воду сзади.','utilities',2),
 ('48" (1200 mm) quvur uzunligi kerak — ichki kamerada o''lchov buni hisobga oladi.',
  'Требуется длина шланга 48" (1200 мм).','utilities',3)
) AS v(nuz,nar,cat,ord) WHERE e.slug = 'bosch-wga2341sin-washer';

INSERT INTO equipment_applications (equipment_id, room_type, room_type_ru)
SELECT e.id, v.rt, v.rtr FROM equipment e
CROSS JOIN (VALUES ('kirxona','Прачечная'),('kvartira','Квартира'),('kir-yuvish-zona','Зона стирки')) AS v(rt,rtr)
WHERE e.slug = 'bosch-wga2341sin-washer';

INSERT INTO equipment_sources (equipment_id, source_url, source_type, source_title, publisher, manufacturer_source, verified)
SELECT e.id, 'https://media3.bosch-home.com/Documents/specsheet/en-IN/WGA2341SIN.pdf',
 'official_datasheet', 'WGA2341SIN Specification Sheet', 'BSCH Home Appliances', true, true
FROM equipment e WHERE e.slug = 'bosch-wga2341sin-washer';

-- M5: ARXITEKT TAVSIYASI (rasmiy manbada YO'Q)
INSERT INTO engineering_notes (equipment_id, note_uz, note_ru, category, sort_order)
SELECT e.id, v.nuz, v.nar, v.cat, v.ord FROM equipment e
CROSS JOIN (VALUES
 ('ARXITEKT TAVSIYASI (Bosch rasmiy PDF''ida minimal montaj bo''shlig''i KO''RSATMAGAN): old tomonda kamida 600 mm foydalanish zonasi rejalashtirish tavsiya etiladi. Bu Bosch''ning rasmiy talabi emas.',
  'РЕКОМЕНДАЦИЯ АРХИТЕКТОРА (в официальном PDF Bosch НЕ указано): оставить спереди 600 мм. Это НЕ официальное требование Bosch.','clearance',4),
 ('ARXITEKT TAVSIYASI (rasmiy manbada ko''rsatilmagan): orqa va yon tomonlarda ventilyatsiya bo''shlig''i (taxminan 100 mm) rejalashtirish tavsiya etiladi.',
  'РЕКОМЕНДАЦИЯ АРХИТЕКТОРА (в официальных источниках не указано): зазор для вентиляции сзади и по бокам (ориентировочно 100 мм).','clearance',5)
) AS v(nuz, nar, cat, ord)
WHERE e.slug = 'bosch-wga2341sin-washer';



-- ############################################################################
-- MAHSULOT 6: LG WF-DT90VW (quritish mashinasi, heat pump, 9 kg)
-- Manba: lg.com/hk_en rasmiy sahifa
-- ############################################################################
INSERT INTO equipment
 (slug, name_uz, name_ru, name_en, aliases, category_id, subtype_id, manufacturer_id,
  model, sku, brand, short_desc, description_uz, description_ru, description_en,
  usage_note_uz, advantages, limitations, cover_image, status, verification_status)
SELECT
 'lg-wf-dt90vw-dryer',
 'LG WF-DT90VW quritish mashinasi 9 kg (Heat Pump)',
 'LG WF-DT90VW сушильная машина 9 кг (Heat Pump)',
 'LG WF-DT90VW Heat Pump Dryer 9 kg',
 ARRAY['lg','wf-dt90vw','quritish','сушильная машина','dryer','heat pump','9 kg','dual inverter'],
 c.id, st.id, m.id,
 'WF-DT90VW', 'WF-DT90VW', 'LG',
 'LG WF-DT90VW — 9 kg heat pump quritish mashinasi, Dual Inverter, BLDC motor, 600x850x690 mm.',
 'LG WF-DT90VW — heat pump turidagi quritish mashinasi. Sig''im 9 kg. Dual Inverter Heat Pump texnologiyasi, BLDC motor. O''lcham 600x850x690 mm, og''irlik 58 kg.',
 'LG WF-DT90VW — сушильная машина с тепловым насосом, загрузка 9 кг, Dual Inverter.',
 'LG WF-DT90VW heat pump tumble dryer, 9 kg capacity, Dual Inverter with BLDC motor. Dimensions 600x850x690 mm, 58 kg. Condensate drain required.',
 'Kirxona, kvartira yoki kir yuvish zonasi.',
 ARRAY['Heat pump — past haroratda ham quritadi va elektr kamroq','Dual Inverter — sekin va uzoq muddatli','BLDC motor — maxsus ta''mirlash kerak emas','Sensor quritish — kiyim tayyor bo''lishini aniqlaydi'],
 ARRAY['Chuqurligi 690 mm — standart shkafga sig''maydi','Kondensat suvini chiqarish talab qilinadi'],
 NULL, 'draft', 'verified'
FROM equipment_categories c
JOIN equipment_subtypes st ON st.slug = 'quritish-mashinasi'
JOIN equipment_manufacturers m ON m.slug = 'lg'
WHERE c.slug = 'kir-yuvish'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO equipment_dimensions (equipment_id, width_mm, height_mm, depth_mm, weight_kg, service_clearance)
SELECT e.id, 600, 850, 690, 58.00,
 '{}'
FROM equipment e WHERE e.slug = 'lg-wf-dt90vw-dryer';

INSERT INTO equipment_specifications (equipment_id, param_key, value_text, value_num, unit)
SELECT e.id, s.param_key, s.value_text, s.value_num, s.unit FROM equipment e
CROSS JOIN (VALUES
  ('drying_capacity', NULL, 9.0, 'kg'),
  ('motor_type','Dual Inverter Heat Pump, BLDC', NULL, NULL),
  ('energy_class', NULL, NULL, NULL),
  ('power', NULL, NULL, 'W'),
  ('voltage', NULL, NULL, 'V/Hz'),
  ('water_consumption', NULL, NULL, 'L')
) AS s(param_key,value_text,value_num,unit) WHERE e.slug = 'lg-wf-dt90vw-dryer';

INSERT INTO equipment_installations (equipment_id, mount_type, location_note, min_clearance, access_note)
SELECT e.id, 'freestanding', 'Kirxona yoki kir yuvish zonasi.',
 '{}',
 'Kondensat suvini chiqarish quvuri kerak (nasos orqali avtomatik). Kondensat quvuri 1.5 m dan uzoq bo''lsa problem chiqadi.'
FROM equipment e WHERE e.slug = 'lg-wf-dt90vw-dryer';

INSERT INTO equipment_connections (equipment_id, conn_type, spec_detail, location)
SELECT e.id, 'drain', 'Kondensat suvi chiqishi', 'Orqa panel' FROM equipment e WHERE e.slug = 'lg-wf-dt90vw-dryer';
INSERT INTO equipment_connections (equipment_id, conn_type, spec_detail, location)
SELECT e.id, 'electric', 'Standart tarmoq (rasmiy sahifada aniq qiymat ko''rsatilmagan)', 'Orqa panel' FROM equipment e WHERE e.slug = 'lg-wf-dt90vw-dryer';

INSERT INTO engineering_notes (equipment_id, note_uz, note_ru, category, sort_order)
SELECT e.id, v.nuz, v.nar, v.cat, v.ord FROM equipment e
CROSS JOIN (VALUES
 ('CHUQURLIK 690 mm — 600 mm standart nichedan KATTAROQ. Arxitekt uchun muhim: 750 mm chuqurlikdagi niche rejalashtiring, aks holda qurishda muammo chiqadi.',
  'ГЛУБИНА 690 мм — БОЛЬШЕ стандартных 600 мм. Закладывайте нишу 750 мм.','clearance',1),
 ('Kondensat suvi quvurini 1.5 m dan uzoqroq qo''yib bo''lmaydi — nasos quvvati cheklangan.',
  'Трубку слива конденсата нельзя прокладывать длиннее 1.5 м.','utilities',2),
 ('Bu quritish mashinasi ALMASHUVCHISIZ emas — LG F4V5RYP2T kabi washer-dryer emas. Oldindan juft kir yuvish mashinasi rejalashtiring.',
  'Эта сушилка НЕ СУШИТ — нужен отдельный стиральный автомат.','placement',3)
) AS v(nuz,nar,cat,ord) WHERE e.slug = 'lg-wf-dt90vw-dryer';

INSERT INTO equipment_applications (equipment_id, room_type, room_type_ru)
SELECT e.id, v.rt, v.rtr FROM equipment e
CROSS JOIN (VALUES ('kirxona','Прачечная'),('kvartira','Квартира'),('kir-yuvish-zona','Зона стирки')) AS v(rt,rtr)
WHERE e.slug = 'lg-wf-dt90vw-dryer';

INSERT INTO equipment_sources (equipment_id, source_url, source_type, source_title, publisher, manufacturer_source, verified)
SELECT e.id, 'https://www.lg.com/hk_en/laundry/dryer/wf-dt90vw/',
 'official_product_page', 'WF-DT90VW 9kg Heat Pump Dryer', 'LG Electronics', true, true
FROM equipment e WHERE e.slug = 'lg-wf-dt90vw-dryer';

-- M5: ARXITEKT TAVSIYASI (rasmiy manbada YO'Q). 690 mm chuqurlik HAQIQIY
-- (LG sahifasida), lekin "750 mm niche" — mening tavsiyam.
INSERT INTO engineering_notes (equipment_id, note_uz, note_ru, category, sort_order)
SELECT e.id, v.nuz, v.nar, v.cat, v.ord FROM equipment e
CROSS JOIN (VALUES
 ('KORPUS CHUQURLIGI 690 mm — bu rasmiy qiymat (LG sahifasi). Ammo standart 600 mm niche S I G '' M A Y D I. ARXITEKT TAVSIYASI: niche chuqurligini 750 mm qilib rejalashtiring. Bu LG''ning rasmiy talabi emas, balki xavfsizlik zaxirasi.',
  'ГЛУБИНА КОРПУСА 690 мм — официальное значение (сайт LG). Но в стандартную нишу 600 мм НЕ ВЛЕЗЕТ. РЕКОМЕНДАЦИЯ АРХИТЕКТОРА: закладывать нишу глубиной 750 мм. Это НЕ официальное требование LG, а запас прочности.','clearance',4),
 ('ARXITEKT TAVSIYASI (rasmiy manbada ko''rsatilmagan): orqa tomonda kamida 100 mm ventilyatsiya bo''shlig''i qoldirish tavsiya etiladi.',
  'РЕКОМЕНДАЦИЯ АРХИТЕКТОРА (в официальных источниках не указано): оставить сзади не менее 100 мм для вентиляции.','clearance',5)
) AS v(nuz, nar, cat, ord)
WHERE e.slug = 'lg-wf-dt90vw-dryer';



-- ############################################################################
-- MAHSULOT 7: Samsung DW60A8060BB/EU (idish yuvish, 14 to''ldirish, built-in)
-- Manba: samsung.com/uk rasmiy sahifa
-- ############################################################################
INSERT INTO equipment
 (slug, name_uz, name_ru, name_en, aliases, category_id, subtype_id, manufacturer_id,
  model, sku, brand, short_desc, description_uz, description_ru, description_en,
  usage_note_uz, advantages, limitations, cover_image, status, verification_status)
SELECT
 'samsung-dw60a8060bb-eu-dishwasher',
 'Samsung DW60A8060BB/EU idish yuvish mashinasi 14 to''ldirish',
 'Samsung DW60A8060BB/EU посудомоечная машина 14 комплектов',
 'Samsung DW60A8060BB/EU Dishwasher 14 place settings',
 ARRAY['samsung','dw60a8060bb','idish yuvish','посудомоечная машина','dishwasher','built-in','14 place','60 cm'],
 c.id, st.id, m.id,
 'DW60A8060BB/EU', 'DW60A8060BB/EU', 'Samsung',
 'Samsung DW60A8060BB/EU — built-in idish yuvish, 14 to''ldirish, B sinfi, 8.5 L/tsikl suv.',
 'Samsung DW60A8060BB/EU — kichik o''lchamdagi (60 sm) built-in idish yuvish mashinasi. 14 ta to''ldirish, 64.4 kWh/100 tsikl, 8.5 L suv/tsikl, 43 dBA shovqin.',
 'Samsung DW60A8060BB/EU — встраиваемая посудомоечная машина 60 см, 14 комплектов, класс B.',
 'Samsung DW60A8060BB/EU built-in 60 cm dishwasher, 14 place settings, energy class B (64.4 kWh/100 cycles), 8.5 L water per cycle. Dimensions 598x815x550 mm, 43 kg.',
 'Oshxona, 60 sm standart shkaf ichida.',
 ARRAY['14 to''ldirish — katta oila uchun','Faqat 8.5 L suv tsikliga — iqtiqodli','Auto Door Open Dry — eshikni avtomatik qisqartiradi','43 dBA — juda sekin'],
 ARRAY['Brut o''lcham 655x875x645 mm — niche o''lchamiga ehtiyot bo''ling','Balandlik 815 mm — past shkaflarda joylashishi kerak'],
 NULL, 'draft', 'verified'
FROM equipment_categories c
JOIN equipment_subtypes st ON st.slug = 'dishwasher'
JOIN equipment_manufacturers m ON m.slug = 'samsung'
WHERE c.slug = 'oshxona'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO equipment_dimensions (equipment_id, width_mm, height_mm, depth_mm, weight_kg, unit_note, service_clearance)
SELECT e.id, 598, 815, 550, 43.00,
 'Netto 598x815x550 mm. BRUT (qadoqli) 655x875x645 mm — niche o''lcham shu bo''lishi SHART.',
 '{}'
FROM equipment e WHERE e.slug = 'samsung-dw60a8060bb-eu-dishwasher';

INSERT INTO equipment_specifications (equipment_id, param_key, value_text, value_num, unit)
SELECT e.id, s.param_key, s.value_text, s.value_num, s.unit FROM equipment e
CROSS JOIN (VALUES
  ('dishwasher_place_settings', NULL, 14, NULL),
  ('power', NULL, 1800, 'W'),  -- Heater Watts: 1800 W (Samsung UK, Power/Ratings)
  ('circulation_motor_watts', NULL, 95, 'W'),
  ('drain_pump_watts', NULL, 30, 'W'),
  ('energy_class','B (64.4 kWh/100 tsikl)', NULL, NULL),
  ('water_consumption', NULL, 8.5, 'L'),
  ('voltage','220-240 V / 50 Hz', NULL, NULL),
  ('install_type','built_in', NULL, NULL)
) AS s(param_key,value_text,value_num,unit) WHERE e.slug = 'samsung-dw60a8060bb-eu-dishwasher';

INSERT INTO equipment_installations (equipment_id, mount_type, location_note, min_clearance, access_note)
SELECT e.id, 'built_in', '60 sm kenglikdagi oshxona shkafi ichida, ostki modulda.',
 '{}',
 'Suv kirishi va kanalizatsiya shkaf ichida bo''lishi kerak. Eshik old tomondan ochiladi — old tomonda joy qoldiring.'
FROM equipment e WHERE e.slug = 'samsung-dw60a8060bb-eu-dishwasher';

INSERT INTO equipment_connections (equipment_id, conn_type, spec_detail, location, height_mm)
SELECT e.id, 'water_in', 'Sovuq suv', 'Shkaf ichida', NULL FROM equipment e WHERE e.slug = 'samsung-dw60a8060bb-eu-dishwasher';
INSERT INTO equipment_connections (equipment_id, conn_type, spec_detail, location)
SELECT e.id, 'drain', 'Kanalizatsiya chiqishi', 'Shkaf ichida' FROM equipment e WHERE e.slug = 'samsung-dw60a8060bb-eu-dishwasher';
INSERT INTO equipment_connections (equipment_id, conn_type, spec_detail, location)
SELECT e.id, 'electric', '220-240 V / 50 Hz — Heater 1800 W, Circulation Motor 95 W, Drain Pump 30 W (Samsung UK Power/Ratings)', 'Shkaf ichida' FROM equipment e WHERE e.slug = 'samsung-dw60a8060bb-eu-dishwasher';

INSERT INTO engineering_notes (equipment_id, note_uz, note_ru, category, sort_order)
SELECT e.id, v.nuz, v.nar, v.cat, v.ord FROM equipment e
CROSS JOIN (VALUES
 ('Niche BRUT o''lcham 655x875x645 mm bo''lishi SHART. Ko''pchilik shkaflar 600x820x600 — sig''maydi. Shkaf loyihasini 60 sm modul bilan qilib o''lchang.',
  'Ниша должна быть 655x875x645 мм (брутто).','clearance',1),
 ('Suv va kanalizatsiya shkaf ORTIDA bo''lishi kerak — kir yuvish mashinasiga o''xshab orqada emas, balki ostda joylashtiriladi.',
  'Вода и слив должны быть внутри шкафа.','utilities',2),
 ('Eshik balandligi 875 mm — fasad panneli oshxonada baland eshik kerak bo''ladi, aks holda eshik tegmaydi.',
  'Высота дверцы 875 мм — нужна высокая дверь.','door_swing',3)
) AS v(nuz,nar,cat,ord) WHERE e.slug = 'samsung-dw60a8060bb-eu-dishwasher';

INSERT INTO equipment_applications (equipment_id, room_type, room_type_ru)
SELECT e.id, v.rt, v.rtr FROM equipment e
CROSS JOIN (VALUES ('oshxona','Кухня'),('kvartira','Квартира'),('ofis-oshxona','Офисная кухня')) AS v(rt,rtr)
WHERE e.slug = 'samsung-dw60a8060bb-eu-dishwasher';

-- M8 VERIFIED: quvvat qiymatlari rasmiy Samsung UK sahifasining
-- "Power / Ratings" bo'limida: Heater 1800 W, Circulation Motor 95 W,
-- Drain Pump 30 W. Retailer yoki uchinchi tomon manbasi ishlatilmagan.
INSERT INTO equipment_sources (equipment_id, source_url, source_type, source_title, publisher, manufacturer_source, verified)
SELECT e.id, 'https://www.samsung.com/uk/dishwashers/built-in/dw8500am-high-energy-efficiency-14-place-settings-white-dw60a8060bb-eu',
 'official_product_page',
 'DW60A8060BB/EU — 14 place setting Dishwasher. Power/Ratings: Electrical 220-240V / 50Hz; Heater Watts 1800 W; Circulation Motor 95 W; Drain Pump 30 W',
 'Samsung Electronics', true, true
FROM equipment e WHERE e.slug = 'samsung-dw60a8060bb-eu-dishwasher';

INSERT INTO equipment_documents (equipment_id, doc_type, title, url, file_format, verified)
SELECT e.id, 'product_page',
 'DW60A8060BB/EU rasmiy mahsulot sahifasi — Power/Ratings bo''limi (Heater 1800 W, Circulation Motor 95 W, Drain Pump 30 W)',
 'https://www.samsung.com/uk/dishwashers/built-in/dw8500am-high-energy-efficiency-14-place-settings-white-dw60a8060bb-eu',
 'html', true
FROM equipment e WHERE e.slug = 'samsung-dw60a8060bb-eu-dishwasher';

-- M5: ARXITEKT TAVSIYASI (rasmiy manbada YO'Q). BRUT o''lcham 655x875x645 mm
-- rasmiy. "620 mm en" — mening tavsiyam.
INSERT INTO engineering_notes (equipment_id, note_uz, note_ru, category, sort_order)
SELECT e.id, v.nuz, v.nar, v.cat, v.ord FROM equipment e
CROSS JOIN (VALUES
 ('Niche BRUT o''lcham 655x875x645 mm — bu rasmiy qiymat (Samsung sahifasi), shu sababli niche aynan shu o''lchamda bo''lishi SHART. ARXITEKT TAVSIYASI: niche enini 620 mm qilib rejalashtiring. Bu Samsung''ning rasmiy talabi emas.',
  'Ниша БРУТТО 655x875x645 мм — официальное значение (сайт Samsung), ниша должна быть ровно такого размера. РЕКОМЕНДАЦИЯ АРХИТЕКТОРА: закладывать ширину ниши 620 мм. Это НЕ официальное требование Samsung.','clearance',4)
) AS v(nuz, nar, cat, ord)
WHERE e.slug = 'samsung-dw60a8060bb-eu-dishwasher';



-- ############################################################################
-- MAHSULOT 8: Bosch PXV875DV1E (induction hob, 80 sm, FlexInduction)
-- Manba: bosch-home.co.uk rasmiy sahifa + spec PDF
-- ############################################################################
INSERT INTO equipment
 (slug, name_uz, name_ru, name_en, aliases, category_id, subtype_id, manufacturer_id,
  model, sku, brand, short_desc, description_uz, description_ru, description_en,
  usage_note_uz, advantages, limitations, cover_image, status, verification_status)
SELECT
 'bosch-pxv875dv1e-induction',
 'Bosch PXV875DV1E induksion plita (80 sm, FlexInduction)',
 'Bosch PXV875DV1E индукционная плита 80 см (FlexInduction)',
 'Bosch PXV875DV1E Induction Hob 80 cm FlexInduction',
 ARRAY['bosch','pxv875dv1e','induktsion','индукционная','induction hob','flexinduction','80 cm','series 8'],
 c.id, st.id, m.id,
 'PXV875DV1E', 'PXV875DV1E', 'Bosch',
 'Bosch PXV875DV1E — 80 sm induksion hob, 5 ta kuytirish zonasi, 17 quvvat darajasi, 7400 W.',
 'Bosch PXV875DV1E — Series 8 induksion hob. 816 mm en, 5 ta kuytirish zonasi, FlexInduction texnologiyasi, 17 quvvat darajasi, ulangan quvvat 7400 W. Ochiladigan oynasi orqali oshxona bilan bog''lanadi.',
 'Bosch PXV875DV1E — индукционная варочная панель 80 см, 5 зон нагрева, FlexInduction.',
 'Bosch PXV875DV1E Series 8 induction hob, 80 cm, 5 cooking zones with FlexInduction, 17 power levels, 7400 W connected load. Cut-out requirement 51 x 750-780 x 490-500 mm. Dimensions 816x51x527 mm, 18.6 kg.',
 'Katta oilaviy oshxona, 800 mm ish stoli.',
 ARRAY['FlexInduction — turli idish shakllarini aniqlaydi','17 quvvat darajasi — aniq nazorat','5 zona + boost rejimi','Ochiladigan oyna — oshxona bilan yaxlitlanadi','Seriya 8 — premium dizayn'],
 ARRAY['Faqat induction idishlari kerak (temir/ferromagnit)','7400 W — alohida kuchli elektr zaxrasi talab qiladi','Kerakli bo''shliq chuqurligi 51 mm'],
 NULL, 'draft', 'verified'
FROM equipment_categories c
JOIN equipment_subtypes st ON st.slug = 'induktsion-plita'
JOIN equipment_manufacturers m ON m.slug = 'bosch'
WHERE c.slug = 'oshxona'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO equipment_dimensions (equipment_id, width_mm, height_mm, depth_mm, weight_kg, unit_note, service_clearance)
SELECT e.id, 816, 51, 527, 18.60,
 'Korpusi (WxHxD). Minimal bo''shliq ishlab chiqaruvcha talabiga muvof.',
 '{"under_counter_mm":51,"cutout_width_mm":"750-780","cutout_depth_mm":"490-500","note":"Bo''shliq 51 x 750-780 x 490-500 mm — ishlab chiqaruvchi aniq talabi"}'
FROM equipment e WHERE e.slug = 'bosch-pxv875dv1e-induction';

INSERT INTO equipment_specifications (equipment_id, param_key, value_text, value_num, unit)
SELECT e.id, s.param_key, s.value_text, s.value_num, s.unit FROM equipment e
CROSS JOIN (VALUES
  ('hob_zones', NULL, 5, NULL),
  ('power', NULL, 7400, 'W'),
  ('voltage','220-240 V, 50/60 Hz', NULL, NULL),
  ('install_type','built_in', NULL, NULL),
  ('energy_class', NULL, NULL, NULL)
) AS s(param_key,value_text,value_num,unit) WHERE e.slug = 'bosch-pxv875dv1e-induction';

INSERT INTO equipment_installations (equipment_id, mount_type, location_note, min_clearance, access_note)
SELECT e.id, 'built_in', 'Ish stoli ustidagi bo''shliqqa o''rnatiladi.',
 '{"under_counter_mm":51,"cutout_mm":"750-780 x 490-500","note":"Ishlab chiqaruvchi bo''shlig''i: 51 mm chuqurlik, 750-780 mm en, 490-500 mm chuqurlik"}',
 'Elektr quvvat 7400 W — alohida avtomat yoki kuchaytirilgan zaxra kerak bo''lishi mumkin.'
FROM equipment e WHERE e.slug = 'bosch-pxv875dv1e-induction';

INSERT INTO equipment_connections (equipment_id, conn_type, spec_detail, location)
SELECT e.id, 'electric', '220-240 V, 50/60 Hz, 7400 W ulangan', 'Ostki panelda, markazda' FROM equipment e WHERE e.slug = 'bosch-pxv875dv1e-induction';

INSERT INTO engineering_notes (equipment_id, note_uz, note_ru, category, sort_order)
SELECT e.id, v.nuz, v.nar, v.cat, v.ord FROM equipment e
CROSS JOIN (VALUES
 ('BO''SHLIK 51 x 750-780 x 490-500 mm — ishlab chiqaruvchi talabi. Ish stolining o''lchamini shunga muvofiq loyihalang. Bo''shliq kichik bo''lsa panel o''tmaydi.',
  'ПРОЁМ 51 x 750-780 x 490-500 мм — требование производителя.','clearance',1),
 ('7400 W — 16 A kuchli zaxra. Uyim odatiyaviy rozetka yetmaydi; alohida avtomat va kabellar rejalashtirish kerak.',
  '7400 Вт — нужен отдельный автомат 16 А.','utilities',2),
 ('Faqat induction idishi: ferromagnit (temir, po''lat) kerak. Shisha yoki alyuminiy idish ishlamaydi — bu mijozga aytib berish kerak.',
  'Только индукционная посуда: ферромагнитная (сталь).','placement',3),
 ('Ochiladigan oyna — oshxona bilan havo almashuvi saqlanadi, lekin to''rt tomonida to''siq bo''lmasligi SHART.',
  'Откидная крышка требует свободного пространства с четырёх сторон.','integration',4)
) AS v(nuz,nar,cat,ord) WHERE e.slug = 'bosch-pxv875dv1e-induction';

INSERT INTO equipment_applications (equipment_id, room_type, room_type_ru)
SELECT e.id, v.rt, v.rtr FROM equipment e
CROSS JOIN (VALUES ('oshxona','Кухня'),('oshxona-katta','Большая кухня'),('restoran','Ресторан')) AS v(rt,rtr)
WHERE e.slug = 'bosch-pxv875dv1e-induction';

INSERT INTO equipment_sources (equipment_id, source_url, source_type, source_title, publisher, manufacturer_source, verified)
SELECT e.id, 'https://www.bosch-home.co.uk/en/product/PXV875DV1E',
 'official_product_page', 'PXV875DV1E — Induction Hob 80cm', 'BSCH Home Appliances', true, true
FROM equipment e WHERE e.slug = 'bosch-pxv875dv1e-induction';

INSERT INTO equipment_sources (equipment_id, source_url, source_type, source_title, publisher, manufacturer_source, verified)
SELECT e.id, 'https://media3.bosch-home.com/Documents/specsheet/en-IE/PXV875DV1E.pdf',
 'official_datasheet', 'PXV875DV1E Specification Sheet', 'BSCH Home Appliances', true, true
FROM equipment e WHERE e.slug = 'bosch-pxv875dv1e-induction';


-- ############################################################################
-- MAHSULOT 9: Bosch HBG6764S1 (built-in duxovka, 60x60)
-- Manba: bosch-home.co.uk rasmiy sahifa + spec PDF
-- ############################################################################
INSERT INTO equipment
 (slug, name_uz, name_ru, name_en, aliases, category_id, subtype_id, manufacturer_id,
  model, sku, brand, short_desc, description_uz, description_ru, description_en,
  usage_note_uz, advantages, limitations, cover_image, status, verification_status)
SELECT
 'bosch-hbg6764s1-oven',
 'Bosch HBG6764S1 built-in duxovka 60x60 sm',
 'Bosch HBG6764S1 встроенный духовой шкаф 60x60 см',
 'Bosch HBG6764S1 Built-in Oven 60x60 cm',
 ARRAY['bosch','hbg6764s1','duxovka','духовой шкаф','oven','built-in','60x60','series 8','4d hotair'],
 c.id, st.id, m.id,
 'HBG6764S1', 'HBG6764S1', 'Bosch',
 'Bosch HBG6764S1 — built-in duxovka, 13 rejim, 4D Hotair, A+ sinfi, 3600 W.',
 'Bosch HBG6764S1 — Series 8 built-in elektr duxovka. 13 ta isitish/tayyorlash rejimi, jumladan 4D Hotair, Pizza, Grill, Sekin harorat. Energiya sinfi A+, sarfi 0.87 kWh/tsikl. 3600 W, 220-240 V / 16 A.',
 'Bosch HBG6764S1 — встраиваемый духовой шкаф, 13 режимов, 4D Hotair, класс A+.',
 'Bosch HBG6764S1 Series 8 built-in electric oven, 13 cooking modes including 4D HotAir, Pizza and Grill, energy class A+ (0.87 kWh/cycle), 3600 W, 16 A fuse. Required niche size (HxWxD) 585-595 x 560-568 x 550 mm per official datasheet. Dimensions 594x595x548 mm, 38.9 kg.',
 'Oshxona devoridagi 60 sm shkaf ichida.',
 ARRAY['4D Hotair — taxta aylanmasdan tekis pishiradi','13 rejim (pizza, grill, sushish, defrost)','A+ energiya sinfi','AutoPilot (Har 10 daqiqada)','Elektron pan bilan aniq boshqaruv'],
 ARRAY['36.8 kg — baland shkaf kerak','16 A kuchaytirilgan kuchli elektr zaxrasi talab qilinadi','Niche o''lchamiga aniq mos bo''lsin'],
 NULL, 'draft', 'verified'
FROM equipment_categories c
JOIN equipment_subtypes st ON st.slug = 'built-in-duxovka'
JOIN equipment_manufacturers m ON m.slug = 'bosch'
WHERE c.slug = 'oshxona'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO equipment_dimensions (equipment_id, width_mm, height_mm, depth_mm, weight_kg, unit_note, service_clearance)
SELECT e.id, 594, 595, 548, 38.90,
 'Korpusi (WxHxD).',
 '{"niche_height_mm":"585-595","niche_width_mm":"560-568","niche_depth_mm":"550",
  "source":"Bosch rasmiy datasheet: Required niche size (HxWxD) 585-595 x 560-568 x 550 mm",
  "note":"Uchta o''lcham HAM rasmiy: balandlik 585-595 mm, en 560-568 mm, chuqurlik 550 mm"}'
FROM equipment e WHERE e.slug = 'bosch-hbg6764s1-oven';

INSERT INTO equipment_specifications (equipment_id, param_key, value_text, value_num, unit)
SELECT e.id, s.param_key, s.value_text, s.value_num, s.unit FROM equipment e
CROSS JOIN (VALUES
  ('cooking_modes', NULL, 13, NULL),
  ('power', NULL, 3600, 'W'),
  ('voltage','220-240 V, 50/60 Hz (16 A)', NULL, NULL),
  ('energy_class','A+ (EU Nr. 65/2014); 0.87 kWh/tsikl', NULL, NULL),
  ('install_type','built_in', NULL, NULL)
) AS s(param_key,value_text,value_num,unit) WHERE e.slug = 'bosch-hbg6764s1-oven';

INSERT INTO equipment_installations (equipment_id, mount_type, location_note, min_clearance, access_note)
SELECT e.id, 'built_in', '60 sm enli shkaf ichida, balandlik 590-600 mm.',
 '{"niche_height_mm":"585-595","niche_width_mm":"560-568","niche_depth_mm":"550",
  "source":"Bosch rasmiy datasheet: Required niche size (HxWxD) 585-595 x 560-568 x 550 mm",
  "note":"Uchta o''lcham HAM rasmiy talab: balandlik 585-595 mm, en 560-568 mm, chuqurlik 550 mm"}',
 '16 A kuchli zaxra. Orqada ventilyatsiya teshigi bo''lishi kerak — qopiq holda qizdiriladi.'
FROM equipment e WHERE e.slug = 'bosch-hbg6764s1-oven';

INSERT INTO equipment_connections (equipment_id, conn_type, spec_detail, location)
SELECT e.id, 'electric', '220-240 V, 50/60 Hz, 16 A, 3600 W', 'Orqa panelda' FROM equipment e WHERE e.slug = 'bosch-hbg6764s1-oven';

INSERT INTO engineering_notes (equipment_id, note_uz, note_ru, category, sort_order)
SELECT e.id, v.nuz, v.nar, v.cat, v.ord FROM equipment e
CROSS JOIN (VALUES
 ('RASMIY TALAB — niche (HxWxD) 585-595 x 560-568 x 550 mm. Uchala o''lcham ham Bosch datasheetida aniq ko''rsatilgan. Chuqurligi 550 mm dan kam bo''lsa, duxovka orqasidan chiqib ketadi.',
   'ОФИЦИАЛЬНОЕ ТРЕБОВАНИЕ — ниша (HxWxD) 585-595 x 560-568 x 550 мм. Все три размера указаны в datasheet Bosch. Если глубина меньше 550 мм, духовка выступит назад.','clearance',1),
 ('16 A — alohida kuchaytirilgan avtomat. Odatiy 16 A gʻildastak ulanish bir xil bo''lsa boshqa jihozlar bilan ziddiyat chiqishi mumkin.',
  'Нужен отдельный автомат 16 А.','utilities',2),
 ('Ventilyatsiya teshigi SHART — qopiq qurilma qizdiriladi. Shkaf orqasida yoki yon devorda teshik qoldiring.',
  'Обязательна вентиляционная щель — закрытый корпус перегревается.','utilities',3),
 ('Korpusi 595 mm balandlik — boshqa oshxona modullarining balandligi bilan solishtiring, aks holda tekislanmaydi.',
  'Высота корпуса 595 мм — сверьте с остальной мебелью.','revit',4)
) AS v(nuz,nar,cat,ord) WHERE e.slug = 'bosch-hbg6764s1-oven';

INSERT INTO equipment_applications (equipment_id, room_type, room_type_ru)
SELECT e.id, v.rt, v.rtr FROM equipment e
CROSS JOIN (VALUES ('oshxona','Кухня'),('kvartira','Квартира'),('restoran','Ресторан')) AS v(rt,rtr)
WHERE e.slug = 'bosch-hbg6764s1-oven';

INSERT INTO equipment_sources (equipment_id, source_url, source_type, source_title, publisher, manufacturer_source, verified)
SELECT e.id, 'https://www.bosch-home.co.uk/en/product/HBG6764S1',
 'official_product_page', 'HBG6764S1 — Built-in Oven', 'BSCH Home Appliances', true, true
FROM equipment e WHERE e.slug = 'bosch-hbg6764s1-oven';

INSERT INTO equipment_sources (equipment_id, source_url, source_type, source_title, publisher, manufacturer_source, verified)
SELECT e.id, 'https://media3.bosch-home.com/Documents/specsheet/en-IE/HBG6764S1.pdf',
 'official_datasheet', 'HBG6764S1 Specification Sheet', 'BSCH Home Appliances', true, true
FROM equipment e WHERE e.slug = 'bosch-hbg6764s1-oven';


-- ############################################################################
-- MAHSULOT 10: Samsung MS22M8254AK (built-in microwave, 22 L)
-- Manba: samsung.com/uk rasmiy sahifa
-- ############################################################################
INSERT INTO equipment
 (slug, name_uz, name_ru, name_en, aliases, category_id, subtype_id, manufacturer_id,
  model, sku, brand, short_desc, description_uz, description_ru, description_en,
  usage_note_uz, advantages, limitations, cover_image, status, verification_status)
SELECT
 'samsung-ms22m8254ak-microwave',
 'Samsung MS22M8254AK built-in mikroto''lqinli pech 22 L',
 'Samsung MS22M8254AK встраиваемая микроволновая печь 22 л',
 'Samsung MS22M8254AK Built-in Microwave 22L',
 ARRAY['samsung','ms22m8254ak','mikroto''lqinli','микроволновка','microwave','built-in','22 l'],
 c.id, st.id, m.id,
 'MS22M8254AK', 'MS22M8254AK', 'Samsung',
 'Samsung MS22M8254AK — 22 L built-in mikroto''lqinli pech, 800 W quvvat, 6 ta quvvat darajasi.',
 'Samsung MS22M8254AK — 60 sm modulga o''rnatiladigan mikroto''lqinli pech. Hajmi 22 L, chiqish quvvati 800 W (230 V), sarfi 1250 W. 6 ta quvvat darajasi, Auto Cook, ECO rejimi.',
 'Samsung MS22M8254AK — встраиваемая микроволновая печь 22 л, 800 Вт.',
 'Samsung MS22M8254AK built-in solo microwave oven, 22 L capacity, 800 W output at 230 V (1250 W consumption), 6 power levels, Auto Cook and ECO mode. Dimensions 595x380x306 mm, 14.5 kg.',
 'Oshxona yuqori shkafida, 60 sm modul.',
 ARRAY['Built-in — shtrang mebel integratsiyasi','22 L — oilaviy idishlar uchun','ECO rejimi elektr sarfini kamaytiradi','Deodorizatsiya — oshxona hidini yo''q qiladi'],
 ARRAY['Balandlik 380 mm — alohida shkaf qismi kerak','Niche o''lchami Samsung UK sahifasida ko''rsatilmagan — aniqlash shart','Kuchli zaxra (1250 W sarf) talab qilinadi'],
 NULL, 'draft', 'verified'
FROM equipment_categories c
JOIN equipment_subtypes st ON st.slug = 'built-in-mikroto-lqinli'
JOIN equipment_manufacturers m ON m.slug = 'samsung'
WHERE c.slug = 'oshxona'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO equipment_dimensions (equipment_id, width_mm, height_mm, depth_mm, weight_kg, unit_note, service_clearance)
SELECT e.id, 595, 380, 306, 14.50,
 'Tashqi o''lchamlar (WxHxD). Ichki kamera: 330 x 224 x 292 mm.',
 '{"note":"Niche o''lchamlari Samsung UK sahifasida ko''rsatilmagan — NOT_SPECIFIED_BY_MANUFACTURER"}'
FROM equipment e WHERE e.slug = 'samsung-ms22m8254ak-microwave';

INSERT INTO equipment_specifications (equipment_id, param_key, value_text, value_num, unit)
SELECT e.id, s.param_key, s.value_text, s.value_num, s.unit FROM equipment e
CROSS JOIN (VALUES
  ('oven_volume', NULL, 22, 'L'),
  ('microwave_power', NULL, 800, 'W'),  -- CHIQISH quvvati (Output), 230 V
  ('power', NULL, 1250, 'W'),  -- SARFLANGAN quvvat (Power consumption), rasmiy manual p.27
  ('voltage','230 V / 50 Hz', NULL, NULL),
  ('install_type','built_in', NULL, NULL),
  ('energy_class', NULL, NULL, NULL),
  ('cooking_modes', NULL, 6, NULL)
) AS s(param_key,value_text,value_num,unit) WHERE e.slug = 'samsung-ms22m8254ak-microwave';

INSERT INTO equipment_installations (equipment_id, mount_type, location_note, min_clearance, access_note)
SELECT e.id, 'built_in', '60 sm enli yuqori shkaf modulida, balandlik 380 mm.',
 '{}',
 'Ventilyatsiya teshigi kerak. 1250 W sarf — kuchli zaxra kerak.'
FROM equipment e WHERE e.slug = 'samsung-ms22m8254ak-microwave';

INSERT INTO equipment_connections (equipment_id, conn_type, spec_detail, location)
SELECT e.id, 'electric', '230 V / 50 Hz AC — sarflangan quvvat 1250 W (rasmiy manual p.27)', 'Orqa panelda' FROM equipment e WHERE e.slug = 'samsung-ms22m8254ak-microwave';

INSERT INTO engineering_notes (equipment_id, note_uz, note_ru, category, sort_order)
SELECT e.id, v.nuz, v.nar, v.cat, v.ord FROM equipment e
CROSS JOIN (VALUES
 ('Balandlik 380 mm — 60 sm standart yuqori shkaf moduli emas, maxsus past bo''lim kerak. Yoki ostki modulga o''rnatish mumkin.',
  'Высота 380 мм — нужен специальный низкий модуль.','placement',1),
 ('Niche o''lchamlari rasmiy sahifada BERILMAGAN — qurishdan oldin Samsung qo''llab-quvvatlashdan aniq o''lchamni olish SHART.',
  'Размеры ниши не указаны — уточните в поддержке Samsung.','clearance',2),
 ('Ventilyatsiya teshigi majburiy — miktovolnali pech yopiq shkafda qizdiriladi.',
  'Обязательна вентиляционная щель.','utilities',3)
) AS v(nuz,nar,cat,ord) WHERE e.slug = 'samsung-ms22m8254ak-microwave';

INSERT INTO equipment_applications (equipment_id, room_type, room_type_ru)
SELECT e.id, v.rt, v.rtr FROM equipment e
CROSS JOIN (VALUES ('oshxona','Кухня'),('kvartira','Квартира'),('ofis-oshxona','Офисная кухня')) AS v(rt,rtr)
WHERE e.slug = 'samsung-ms22m8254ak-microwave';

INSERT INTO equipment_sources (equipment_id, source_url, source_type, source_title, publisher, source_date, manufacturer_source, verified)
SELECT e.id, 'https://www.samsung.com/uk/microwave-ovens/built-in/built-in-solo-microwave-22l-ms22m8254ak-e3/',
 'official_product_page', 'MS22M8254AK — Built-in Solo Microwave 22L (specs: Power Consumption 1250 W)', 'Samsung Electronics', NULL, true, true
FROM equipment e WHERE e.slug = 'samsung-ms22m8254ak-microwave';

-- M8: rasmiy USER MANUAL — 1250 W quvvat sarfi shu hujjatda,
-- "Technical specifications" sahifasida (PDF 27-bet) ko'rsatilgan.
INSERT INTO equipment_sources (equipment_id, source_url, source_type, source_title, publisher, source_date, manufacturer_source, verified)
SELECT e.id,
 'https://org.downloadcenter.samsung.com/downloadfile/ContentsFile.aspx?CDSite=UNI_UK&OriginYN=N&ModelType=N&ModelName=MS22M8254AK&CttFileID=10072009&CDCttType=UM&VPath=UM%2F202502%2F20250214202233323%2FFull_MS22M8254AK_E3_DE68_04704E_02_EN.pdf',
 'official_datasheet', 'MS22M8254AK User Manual — Technical Specifications, p.27 (Power consumption 1250 W; Power source 230 V ~ 50 Hz AC)',
 'Samsung Electronics', '2025-02-14', true, true
FROM equipment e WHERE e.slug = 'samsung-ms22m8254ak-microwave';

INSERT INTO equipment_documents (equipment_id, doc_type, title, url, file_format, verified)
SELECT e.id, 'user_manual', 'MS22M8254AK User Manual (v0.2, 46 bet) — Technical Specifications p.27',
 'https://org.downloadcenter.samsung.com/downloadfile/ContentsFile.aspx?CDSite=UNI_UK&OriginYN=N&ModelType=N&ModelName=MS22M8254AK&CttFileID=10072009&CDCttType=UM&VPath=UM%2F202502%2F20250214202233323%2FFull_MS22M8254AK_E3_DE68_04704E_02_EN.pdf',
 'pdf', true
FROM equipment e WHERE e.slug = 'samsung-ms22m8254ak-microwave';

-- M5: ARXITEKT TAVSIYASI (rasmiy manbada YO'Q) — Samsung UK specs sahifasida
-- niche o'lchamlari umuman ko'rsatilmagan, shuning uchun DB da sonli qiymat yo'q.
INSERT INTO engineering_notes (equipment_id, note_uz, note_ru, category, sort_order)
SELECT e.id, v.nuz, v.nar, v.cat, v.ord FROM equipment e
CROSS JOIN (VALUES
 ('Niche o''lchamlari rasmiy Samsung UK specs sahifasida KO''RSATMAGAN (SOURCE_UNAVAILABLE). ARXITEKT TAVSIYASI: qurishdan oldin Samsung qo''llab-quvvatlashdan aniq niche o''lchamini oling yoki 600x600 standart modul konvensiyasi bo''yicha loyihalang. Bu Samsung''ning rasmiy talabi emas.',
  'Размеры ниши на официальной странице Samsung UK НЕ УКАЗАНЫ (SOURCE_UNAVAILABLE). РЕКОМЕНДАЦИЯ АРХИТЕКТОРА: уточните в поддержке Samsung или проектируйте по конвенции модуля 600x600. Это НЕ официальное требование Samsung.','clearance',4),
 ('Niche balandligi 380 mm korpus balandligiga mos — standart 60 sm yuqori shkaf moduli emas, maxsus past bo''lim yoki ostki modul kerak.',
  'Высота ниши 380 мм не подходит к стандартному верхнему модулю 60 см — нужен специальный низкий модуль или нижний шкаф.','placement',5)
) AS v(nuz, nar, cat, ord)
WHERE e.slug = 'samsung-ms22m8254ak-microwave';




END $$;
COMMIT;

-- ============================================================================
-- TEKSHIRUV
-- ============================================================================
SELECT c.name_uz AS kategoriya, COUNT(e.id) AS mahsulot
FROM equipment e
JOIN equipment_categories c ON c.id = e.category_id
GROUP BY c.name_uz, c.order_index ORDER BY c.order_index;

-- KUTILAYOTGAN: Konditsionerlar 3 | Kir yuvish va quritish 3 | Oshxona texnikalari 4

SELECT status, COUNT(*) FROM equipment GROUP BY status;
-- KUTILAYOTGAN: draft | 10   (foydalanuvchi KO'RMASLIGI kerak)

SELECT COUNT(*) AS rasmiy_manba FROM equipment_sources WHERE manufacturer_source AND verified;
-- KUTILAYOTGAN: 11 (Bosx mahsulotda 2 tadan: page + datasheet)

SELECT COUNT(*) AS parametrlar FROM equipment_specifications;
-- KUTILAYOTGAN: ~60

SELECT COUNT(*) AS loyiha_izohlari FROM engineering_notes;
-- KUTILAYOTGAN: ~35
-- ============================================================================
