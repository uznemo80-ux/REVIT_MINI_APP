-- ============================================================================
-- YOSHUZBEKK — Migration 005: Equipment MVP seed (kategoriya + subtype + parametr)
-- ============================================================================
--
-- Branch: feature-equipment-mvp
-- Holat:  TAYYOR — production DB'da ISHLATILMAGAN
--
-- Scope: 3 kategoriya (MVP)
--   1. ❄️ Konditsionerlar
--   2. 🧺 Kir yuvish va quritish
--   3. 🍳 Oshxona texnikalari
--
-- ---------------------------------------------------------------------------
-- NIMA QILINADI
-- ---------------------------------------------------------------------------
--   equipment_categories        — 3 ta kategoriya
--   equipment_subtypes           — 34 ta aniq tur
--   equipment_manufacturers      — 3 ta ishlab chiqaruvchi
--   equipment_parameter_defs     — kategoriya bo'yicha DINAMIK parametrlar
--
-- ---------------------------------------------------------------------------
-- NIMA QILINMAYDI
-- ---------------------------------------------------------------------------
--   ❌ equipment jadvaliga MAHSULOT kiritilmaydi — alohida 006_seed_products.sql
--   ❌ Uydirma o'lcham/parametr — FAQAT tanlangan (real) parametrlar
--   ❌ materials / library_* / construction_materials — tegilmaydi
--   ❌ Faqat equipment_* jadvallarga INSERT
--
-- ============================================================================


BEGIN;

-- ############################################################################
-- 1. KATEGORIYALAR
-- ############################################################################
INSERT INTO equipment_categories (slug, name_uz, name_ru, name_en, icon, description_uz, order_index)
VALUES
  ('konditsioner', 'Konditsionerlar', 'Кондиционеры', 'Air Conditioners', '❄️',
   'Split, kanalli, kasseta va boshqa turdagi konditsionerlar', 1),
  ('kir-yuvish', 'Kir yuvish va quritish', 'Стиральные и сушильные машины', 'Laundry', '🧺',
   'Kir yuvish mashinalari, quritish mashinalari va komplekslar', 2),
  ('oshxona', 'Oshxona texnikalari', 'Кухонная техника', 'Kitchen Appliances', '🍳',
   'Pishirish uskunalari, duxovkalar, mikroto''lqinli pechlar va sovutish', 3)
ON CONFLICT (slug) DO NOTHING;

-- ############################################################################
-- 2. SUBTYPES — kategoriya ichidagi ANIQ TURLAR
-- ############################################################################
-- Konditsioner
INSERT INTO equipment_subtypes (category_id, slug, name_uz, name_ru, name_en, order_index)
SELECT c.id, s.slug, s.name_uz, s.name_ru, s.name_en, s.ord
FROM (VALUES
  ('konditsioner','devoriy-split','Devoriy split-konditsioner','Настенный сплит-кондиционер','Wall-mounted split',1),
  ('konditsioner','inverter-split','Inverter split','Инверторный сплит','Inverter split',2),
  ('konditsioner','multi-split','Multi-split','Мульти-сплит','Multi-split',3),
  ('konditsioner','kanalli','Duct / Kanalli konditsioner','Канальный кондиционер','Ducted',4),
  ('konditsioner','kasseta','Cassette / Kasseta','Кассетный','Cassette',5),
  ('konditsioner','floor-ceiling','Floor-ceiling','Напольно-потолочный','Floor-ceiling',6),
  ('konditsioner','kolonali','Kolonali','Колонный','Column',7),
  ('konditsioner','vrf-vrv','VRF / VRV','VRF/VRV','VRF/VRV',8),
  ('konditsioner','fancoil','Fan Coil','Фанкойл','Fan coil',9)
) AS s(cat, slug, name_uz, name_ru, name_en, ord)
JOIN equipment_categories c ON c.slug = s.cat
ON CONFLICT (slug) DO NOTHING;

-- Kir yuvish
INSERT INTO equipment_subtypes (category_id, slug, name_uz, name_ru, name_en, order_index)
SELECT c.id, s.slug, s.name_uz, s.name_ru, s.name_en, s.ord
FROM (VALUES
  ('kir-yuvish','kir-yuvish-mashinasi','Kir yuvish mashinasi','Стиральная машина','Washing machine',1),
  ('kir-yuvish','front-load','Front-load washing machine','Машина с фронтальной загрузкой','Front-load',2),
  ('kir-yuvish','top-load','Top-load washing machine','Машина с вертикальной загрузкой','Top-load',3),
  ('kir-yuvish','quritish-mashinasi','Quritish mashinasi','Сушильная машина','Dryer',4),
  ('kir-yuvish','washer-dryer','Washer + Dryer 2-in-1','Машина с сушкой','Washer-dryer',5),
  ('kir-yuvish','built-in-kir-yuvish','Built-in washing machine','Встраиваемая стиральная машина','Built-in washer',6)
) AS s(cat, slug, name_uz, name_ru, name_en, ord)
JOIN equipment_categories c ON c.slug = s.cat
ON CONFLICT (slug) DO NOTHING;

-- Oshxona
INSERT INTO equipment_subtypes (category_id, slug, name_uz, name_ru, name_en, order_index)
SELECT c.id, s.slug, s.name_uz, s.name_ru, s.name_en, s.ord
FROM (VALUES
  ('oshxona','induktsion-plita','Induksion plita','Индукционная плита','Induction hob',1),
  ('oshxona','elektr-karamika-plita','Elekr keramika plita','Электрическая стеклокерамическая плита','Electric ceramic hob',2),
  ('oshxona','gaz-plita','Gaz plita','Газовая плита','Gas hob',3),
  ('oshxona','built-in-duxovka','Built-in duxovka','Встроенный духовой шкаф','Built-in oven',4),
  ('oshxona','steam-oven','Steam oven','Паровой духовой шкаф','Steam oven',5),
  ('oshxona','mikroto-lqinli','Mikroto''lqinli pech','Микроволновая печь','Microwave',6),
  ('oshxona','built-in-mikroto-lqinli','Built-in microwave','Встраиваемая микроволновая печь','Built-in microwave',7),
  ('oshxona','havo-tortish','Havo tortish','Вытяжка','Extractor hood',8),
  ('oshxona','muzlatgich','Muzlatgich','Холодильник','Refrigerator',9),
  ('oshxona','dishwasher','Idish yuvish mashinasi','Посудомоечная машина','Dishwasher',10)
) AS s(cat, slug, name_uz, name_ru, name_en, ord)
JOIN equipment_categories c ON c.slug = s.cat
ON CONFLICT (slug) DO NOTHING;


-- ############################################################################
-- 3. ISHLAB CHIQUVCILAR
-- ############################################################################
INSERT INTO equipment_manufacturers (name, slug, country, website, order_index)
VALUES
  ('Daikin', 'daikin', 'Yaponiya', 'https://www.daikin.eu/', 1),
  ('Mitsubishi Electric', 'mitsubishi', 'Yaponiya', 'https://www.mitsubishielectric.com/', 2),
  ('Hisense', 'hisense', 'Xitoy', 'https://www.hisense.com/', 3),
  ('LG Electronics', 'lg', 'Janubiy Koreya', 'https://www.lg.com/', 4),
  ('Bosch', 'bosch', 'Germaniya', 'https://www.bosch-home.com/', 5),
  ('Samsung Electronics', 'samsung', 'Janubiy Koreya', 'https://www.samsung.com/', 6)
ON CONFLICT (slug) DO NOTHING;


-- ############################################################################
-- 4. DINAMIK PARAMETRLAR — equipment_parameter_defs
-- ############################################################################
-- category_id NULL → barcha kategoriyalar uchun umumiy
-- filterable=true → frontendda dinamik filtr
-- FAQAT rasmiy kataloglarda uchraydigan parametrlar

-- UMUMIY (category_id = NULL)
INSERT INTO equipment_parameter_defs
  (category_id, param_key, label_uz, label_ru, unit, data_type, enum_values, filterable, sort_order)
VALUES
  (NULL,'power','Quvvat sarfi','Потребляемая мощность','W','number',NULL,false,10),
  (NULL,'voltage','Kuchlanish','Напряжение','V/Hz','text',NULL,false,11),
  (NULL,'energy_class','Energiya sinfi','Класс энергоэффективности',NULL,'text',NULL,true,12),
  (NULL,'weight','Og''irlik','Вес','kg','number',NULL,false,13),
  (NULL,'install_type','O''rnatish turi','Тип установки',NULL,'enum',
    ARRAY['built_in','freestanding','wall','ceiling','floor','recessed'],true,14),
  (NULL,'color','Rang','Цвет',NULL,'text',NULL,false,15),
  (NULL,'warranty_years','Kafolat muddati','Срок гарантии','yil','number',NULL,false,16)
ON CONFLICT DO NOTHING;

-- KONDITSIONER
INSERT INTO equipment_parameter_defs
  (category_id, param_key, label_uz, label_ru, unit, data_type, enum_values, filterable, sort_order)
SELECT c.id, s.param_key, s.label_uz, s.label_ru, s.unit, s.data_type, s.enum_values::text[], s.filterable, s.sort_order
FROM (VALUES
  ('cooling_capacity','Sovitish quvvati','Холодопроизводительность','kW','number',NULL,true,20),
  ('heating_capacity','Isitish quvvati','Теплопроизводительность','kW','number',NULL,true,21),
  ('refrigerant','Refrigerant','Хладагент',NULL,'text',NULL,false,22),
  ('noise_level','Shovqin darajasi','Уровень шума','dBA','number',NULL,true,23),
  ('airflow','Havo hajm','Объём воздушного потока','m³/min','number',NULL,false,24),
  ('cop','COP (EER)','КОП (ЭЭР)',NULL,'number',NULL,true,25),
  ('inverter','Inverter','Инвертор',NULL,'bool',NULL,true,26),
  ('pipe_length_max','Maks. trassa uzunligi','Макс. длина трассы','m','number',NULL,false,27),
  ('level_diff_max','Maks. balandlik farqi','Макс. перепад высот','m','number',NULL,false,28)
) AS s(param_key,label_uz,label_ru,unit,data_type,enum_values,filterable,sort_order)
JOIN equipment_categories c ON c.slug = 'konditsioner'
ON CONFLICT DO NOTHING;

-- KIR YUVISH
INSERT INTO equipment_parameter_defs
  (category_id, param_key, label_uz, label_ru, unit, data_type, enum_values, filterable, sort_order)
SELECT c.id, s.param_key, s.label_uz, s.label_ru, s.unit, s.data_type, s.enum_values::text[], s.filterable, s.sort_order
FROM (VALUES
  ('load_capacity','Yuklama sig''imi','Загрузка','kg','number',NULL,true,20),
  ('drying_capacity','Quritish sig''imi','Ёмкость сушки','kg','number',NULL,true,21),
  ('spin_speed','Aylanish tezligi','Макс. оборотов','RPM','number',NULL,true,22),
  ('water_consumption','Quyish suvi sarfi','Расход воды','L','number',NULL,false,23),
  ('motor_type','Motor turi','Тип двигателя',NULL,'text',NULL,false,24),
  ('load_type','Yuklash turi','Тип загрузки',NULL,'enum',ARRAY['front','top'],true,25),
  ('programs_count','Dasturlar soni','Количество программ',NULL,'number',NULL,false,26)
) AS s(param_key,label_uz,label_ru,unit,data_type,enum_values,filterable,sort_order)
JOIN equipment_categories c ON c.slug = 'kir-yuvish'
ON CONFLICT DO NOTHING;

-- OSHXONA
INSERT INTO equipment_parameter_defs
  (category_id, param_key, label_uz, label_ru, unit, data_type, enum_values, filterable, sort_order)
SELECT c.id, s.param_key, s.label_uz, s.label_ru, s.unit, s.data_type, s.enum_values::text[], s.filterable, s.sort_order
FROM (VALUES
  ('burners_count','Kuytirgichlar soni','Количество конфорок',NULL,'number',NULL,true,20),
  ('oven_volume','Duxovka hajmi','Объём духовки','L','number',NULL,true,21),
  ('microwave_power','Mikroto''lqin quvvati','Мощность СВЧ','W','number',NULL,false,22),
  ('cooking_modes','Tayyorlash rejimlari','Режимы приготовления',NULL,'number',NULL,true,23),
  ('hob_zones','Kuytirish zonalari','Зоны нагрева',NULL,'number',NULL,true,24),
  ('dishwasher_programs','Dasturlar soni','Количество программ',NULL,'number',NULL,false,25),
  ('dishwasher_place_settings','To''ldirish','Сервизов',NULL,'number',NULL,true,26)
) AS s(param_key,label_uz,label_ru,unit,data_type,enum_values,filterable,sort_order)
JOIN equipment_categories c ON c.slug = 'oshxona'
ON CONFLICT DO NOTHING;


COMMIT;

-- ============================================================================
-- TEKSHIRUV
-- ============================================================================
SELECT c.slug AS category, c.name_uz,
       (SELECT COUNT(*) FROM equipment_subtypes s WHERE s.category_id = c.id) AS subtypes,
       (SELECT COUNT(*) FROM equipment_parameter_defs d
         WHERE d.category_id = c.id OR d.category_id IS NULL) AS params
FROM equipment_categories c
ORDER BY c.order_index;

-- KUTILAYOTGAN:
-- | category      | subtypes | params |
-- |---------------|----------|--------|
-- | konditsioner  | 9        | 16     |  (9 + 7 umumiy)
-- | kir-yuvish    | 6        | 14     |  (7 + 7 umumiy)
-- | oshxona       | 10       | 13     |  (6 + 7 umumiy)
-- | manufacturers | —        | 3 ta   |
-- ============================================================================
