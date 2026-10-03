-- ============================================================================
-- YOSHUZBEKK — Migration 007: Equipment rasmlari — FAQAT 3 TA ACCEPT
-- ============================================================================
--
-- Branch: feature-equipment-mvp
-- Holat:  TAYYOR — production DB'da ISHLATILMAGAN
--
-- ---------------------------------------------------------------------------
-- HOKIMAT
-- ---------------------------------------------------------------------------
-- Rasm auditidan o'tgan va ALMASHUVCHI RAZM TASDIQLANGAN 3 ta mahsulotga
-- FAQAT rasmlar yoziladi:
--
--   1. Bosch PXV875DV1E  — rasmda model kodi "PXV875DV1" ko'rinadi
--   2. LG F4V5RYP2T      — rasmda "Direct Drive 10.5 kg" ko'rinadi
--   3. LG WF-DT90VW      — rasmda "Heat Pump 9 kg" + "DUAL INVERTER"
--
-- ---------------------------------------------------------------------------
-- QOLGAN 7 TA MAHSULOT — RASM YO'Q, NULL QOLADI
-- ---------------------------------------------------------------------------
-- Samsung DW60A8060BB/EU ....... UNCERTAIN (rasmda model kodi yo'q)
-- Samsung MS22M8254AK ......... UNCERTAIN (vision 429, vizual tekshirilmadi)
-- Hisense AP0819CR1W .......... UNCERTAIN (model sahifasi 404, katalogdan olib tashlangan)
-- Daikin FTXF25A5V1B .......... REJECT   (oilaviy rasm — 8 ta modelga bir xil)
-- Mitsubishi MSY-GN10VF-D1 ... REJECT   (faqat banner va sayt logotipi)
-- Bosch HBG6764S1 ............. UNCERTAIN (asset nomi boshqa model — HBG636BS1)
-- Bosch WGA2341SIN ............ UNCERTAIN (rasm topilmadi / topilgani boshqa asset)
--
-- NOTO'G'RI rasm qo'shishdan ko'ra NULL yaxshi.
--
-- ---------------------------------------------------------------------------
-- XAVFSIZLIK
-- ---------------------------------------------------------------------------
-- ❌ DROP / DELETE / TRUNCATE — umuman yo'q
-- ❌ Mavsud jadvallarga ALTER — yo'q
-- ❌ materials / library_books / library_resources / construction_materials
-- ❌ equipment product/specification/dimension/installations/data — tegilmaydi
--   (faqat cover_image maydoni yangilanadi, boshqa hech narsa)
-- ✅ Faqat equipment va equipment_images + equipment_sources
--
-- ============================================================================


BEGIN;

-- ############################################################################
-- IDEMPOTENCY — HAR BIR STATEMENT MUSTAQIL HIMOYALANGAN
-- ############################################################################
-- OLDINGI "global count" guard OLIB TASHLANDI (2026-10-02 audit).
--
-- SABAB: DO $$ ... IF count >= 3 THEN RETURN; END IF; END $$; yozimi
-- NOTO'G'RI ISHLARDI. PL/pgSQL ichidagi RETURN faqat o'sha DO blokidan
-- chiqadi — keyingi INSERT/UPDATE statement'lari ODDIY DAVOM ETTIRILADI.
-- Ya'ni guard hech qachon skip qilmasdi, faqat "seed SKIPPED" xabari
-- chiqarib, kodda mavjud bo'lmagan himoya haqida xato ishonch yaratardi.
-- Bu M1 (status CHECK) dagi xato turi: hujjatlashtirilgan himoya amalda yo'q.
--
-- HOZIRGI HIMOYALAR (migration to'liq idempotent):
--   equipment_sources   → AND NOT EXISTS (... source_url ...)  — 3 ta INSERT
--   equipment_images    → AND NOT EXISTS (... image_type='cover')
--                      + CONSTRAINT eq_img_u UNIQUE (equipment_id, image_type)
--   equipment.cover_image → WHERE cover_image IS NULL OR cover_image <> '...'
--   equipment.gallery     → WHERE gallery IS NULL OR gallery = '[]'::jsonb
--
-- Qayta ishga tushirilganda har bir statement o'z shartini tekshiradi va
-- mavjud to'g'ri qiymatni O'ZGARTIRMAYDI (CASE A-H auditdan o'tgan).
-- ############################################################################


-- ############################################################################
-- 1. RASMIY RASM MANBAZLARI (equipment_sources)
-- ############################################################################
-- source_type = 'manufacturer_cdn' — rasm ishlab chiqaruvchining o'z CDN ida.
-- manufacturer_source = true — rasmiy ishlab chiqaruvchi resursi
-- verified = true — HTTP 200 + image/* + content-type tekshirildi
--
-- ---------------------------------------------------------------------------
-- `verified = false` XATTI-HARA KATI — HUJJATLASH (2026-10-02 audit)
-- ---------------------------------------------------------------------------
-- Agar shu source_url bilan manba OLDINDAN mavjud bo'lsa va uning
-- `verified` maydoni `false` bo'lsa, shu migration uni:
--   * UPDATE qilib `verified = true` qilMAYDI
--   * ustidan o'tib ketadi (NOT EXISTS sharti bajarilmaydi)
--   * mavjud qatori O'ZGARTIRILMASDAN qoldiradi
--
-- SABAB: `verified = false` degani "admin bu manbani hali tekshirmagan"
-- degani. Seed migration ma'lumotni QO'SHMAYDIGAN holda tekshirilgan deb
-- belgilashi noto'g'ri bo'lardi — bu tasdiqlash huquqini seed'ga
-- ko'chirish bo'lardi. Bu M1/M8 dagi tamoyil bilan bir xil:
-- faqat tekshirilgan ma'lumot "verified" bo'ladi.
--
-- Shuning uchun NOT EXISTS sharti FAQAT source_url bo'yicha ishlaydi va
-- eski qatori saqlanadi. Admin qarorini o'zgartirmoqchi bo'lsa, qo'lda
-- UPDATE qiladi.
-- ---------------------------------------------------------------------------

INSERT INTO equipment_sources
  (equipment_id, source_url, source_type, source_title, publisher, manufacturer_source, verified, verified_at)
SELECT e.id,
  'https://media3.bsh-group.com/Product_Shots/MCSA01741770_PXV875DV1E_ElectricHob_Bosch_STP_def.webp',
  'manufacturer_cdn',
  'Bosch PXV875DV1E rasmiy product shot (rasmda model kodi "PXV875DV1" ko''rinadi)',
  'BSH Hausgeräte GmbH (Bosch)', true, true, NOW()
FROM equipment e
WHERE e.slug = 'bosch-pxv875dv1e-induction'
  AND NOT EXISTS (SELECT 1 FROM equipment_sources s WHERE s.equipment_id = e.id
                   AND s.source_url = 'https://media3.bsh-group.com/Product_Shots/MCSA01741770_PXV875DV1E_ElectricHob_Bosch_STP_def.webp');

INSERT INTO equipment_sources
  (equipment_id, source_url, source_type, source_title, publisher, manufacturer_source, verified, verified_at)
SELECT e.id,
  'https://www.lg.com/content/dam/channel/wcms/za/images/washing-machines/f4v5ryp2t_assqesa_efsa_za_c/gallery/D-01-V1.jpg',
  'manufacturer_cdn',
  'LG F4V5RYP2T rasmiy gallery rasm (rasmda "Direct Drive 10.5 kg" yozuvi mavjud)',
  'LG Electronics', true, true, NOW()
FROM equipment e
WHERE e.slug = 'lg-f4v5ryp2t-washer'
  AND NOT EXISTS (SELECT 1 FROM equipment_sources s WHERE s.equipment_id = e.id
                   AND s.source_url = 'https://www.lg.com/content/dam/channel/wcms/za/images/washing-machines/f4v5ryp2t_assqesa_efsa_za_c/gallery/D-01-V1.jpg');

INSERT INTO equipment_sources
  (equipment_id, source_url, source_type, source_title, publisher, manufacturer_source, verified, verified_at)
SELECT e.id,
  'https://www.lg.com/content/dam/channel/wcms/hk_en/images/washer-dryer/wf-dt90vw_abwpehk_echk_hk_en_c/gallery/large01.jpg',
  'manufacturer_cdn',
  'LG WF-DT90VW rasmiy gallery rasm (rasmda "Heat Pump 9 kg" va "DUAL INVERTER" yozuvlari)',
  'LG Electronics', true, true, NOW()
FROM equipment e
WHERE e.slug = 'lg-wf-dt90vw-dryer'
  AND NOT EXISTS (SELECT 1 FROM equipment_sources s WHERE s.equipment_id = e.id
                   AND s.source_url = 'https://www.lg.com/content/dam/channel/wcms/hk_en/images/washer-dryer/wf-dt90vw_abwpehk_echk_hk_en_c/gallery/large01.jpg');


-- ############################################################################
-- 2. RASM YOZUVLARI (equipment_images)
-- ############################################################################
-- image_type = 'cover'
-- source_id  = equipment_sources dagi tegishli manba id (FK orqali bog'lanadi)

INSERT INTO equipment_images (equipment_id, image_type, url, alt_text, source_id, sort_order)
SELECT e.id, 'cover',
  'https://media3.bsh-group.com/Product_Shots/MCSA01741770_PXV875DV1E_ElectricHob_Bosch_STP_def.webp',
  'Bosch PXV875DV1E — 80 sm induksion hob (Series 8, FlexInduction, 5 zona)',
  s.id, 0
FROM equipment e
JOIN equipment_sources s ON s.equipment_id = e.id
  AND s.source_url = 'https://media3.bsh-group.com/Product_Shots/MCSA01741770_PXV875DV1E_ElectricHob_Bosch_STP_def.webp'
WHERE e.slug = 'bosch-pxv875dv1e-induction'
  AND NOT EXISTS (SELECT 1 FROM equipment_images i
                   WHERE i.equipment_id = e.id AND i.image_type = 'cover');

INSERT INTO equipment_images (equipment_id, image_type, url, alt_text, source_id, sort_order)
SELECT e.id, 'cover',
  'https://www.lg.com/content/dam/channel/wcms/za/images/washing-machines/f4v5ryp2t_assqesa_efsa_za_c/gallery/D-01-V1.jpg',
  'LG F4V5RYP2T — front-load kir yuvish mashinasi 10.5 kg, Inverter Direct Drive',
  s.id, 0
FROM equipment e
JOIN equipment_sources s ON s.equipment_id = e.id
  AND s.source_url = 'https://www.lg.com/content/dam/channel/wcms/za/images/washing-machines/f4v5ryp2t_assqesa_efsa_za_c/gallery/D-01-V1.jpg'
WHERE e.slug = 'lg-f4v5ryp2t-washer'
  AND NOT EXISTS (SELECT 1 FROM equipment_images i
                   WHERE i.equipment_id = e.id AND i.image_type = 'cover');

INSERT INTO equipment_images (equipment_id, image_type, url, alt_text, source_id, sort_order)
SELECT e.id, 'cover',
  'https://www.lg.com/content/dam/channel/wcms/hk_en/images/washer-dryer/wf-dt90vw_abwpehk_echk_hk_en_c/gallery/large01.jpg',
  'LG WF-DT90VW — heat pump quritish mashinasi 9 kg, Dual Inverter',
  s.id, 0
FROM equipment e
JOIN equipment_sources s ON s.equipment_id = e.id
  AND s.source_url = 'https://www.lg.com/content/dam/channel/wcms/hk_en/images/washer-dryer/wf-dt90vw_abwpehk_echk_hk_en_c/gallery/large01.jpg'
WHERE e.slug = 'lg-wf-dt90vw-dryer'
  AND NOT EXISTS (SELECT 1 FROM equipment_images i
                   WHERE i.equipment_id = e.id AND i.image_type = 'cover');


-- ############################################################################
-- 3. equipment.cover_image — FAQAT 3 TA
-- ############################################################################
-- Muhim: boshqa 7 ta mahsulotning cover_image NULL qoladi (hech qanday
-- UPDATE ularga tegilmaydi). WHERE sharti faqat 3 ta slug'ga ishora qiladi.
--
-- Idempotent: ON CONFLICT yo'q (bu UPDATE), lekin WHERE bilan himoyalangan —
-- agar cover_image allaqachon to'g'ri qiymatda bo'lsa, yangilanmaydi.
UPDATE equipment e
SET cover_image = 'https://media3.bsh-group.com/Product_Shots/MCSA01741770_PXV875DV1E_ElectricHob_Bosch_STP_def.webp'
WHERE e.slug = 'bosch-pxv875dv1e-induction'
  AND (e.cover_image IS NULL
       OR e.cover_image <> 'https://media3.bsh-group.com/Product_Shots/MCSA01741770_PXV875DV1E_ElectricHob_Bosch_STP_def.webp');

UPDATE equipment e
SET cover_image = 'https://www.lg.com/content/dam/channel/wcms/za/images/washing-machines/f4v5ryp2t_assqesa_efsa_za_c/gallery/D-01-V1.jpg'
WHERE e.slug = 'lg-f4v5ryp2t-washer'
  AND (e.cover_image IS NULL
       OR e.cover_image <> 'https://www.lg.com/content/dam/channel/wcms/za/images/washing-machines/f4v5ryp2t_assqesa_efsa_za_c/gallery/D-01-V1.jpg');

UPDATE equipment e
SET cover_image = 'https://www.lg.com/content/dam/channel/wcms/hk_en/images/washer-dryer/wf-dt90vw_abwpehk_echk_hk_en_c/gallery/large01.jpg'
WHERE e.slug = 'lg-wf-dt90vw-dryer'
  AND (e.cover_image IS NULL
       OR e.cover_image <> 'https://www.lg.com/content/dam/channel/wcms/hk_en/images/washer-dryer/wf-dt90vw_abwpehk_echk_hk_en_c/gallery/large01.jpg');


-- ############################################################################
-- 4. gallery JSONB — FAQAT 3 TA
-- ############################################################################
-- equipment.gallery = [{type,url,alt}] shaklida (004 da shunday belgilangan)
UPDATE equipment e
SET gallery = jsonb_build_array(
      jsonb_build_object(
        'type', 'cover',
        'url',  'https://media3.bsh-group.com/Product_Shots/MCSA01741770_PXV875DV1E_ElectricHob_Bosch_STP_def.webp',
        'alt',  'Bosch PXV875DV1E — 80 sm induksion hob (Series 8, FlexInduction)')
    )
WHERE e.slug = 'bosch-pxv875dv1e-induction'
  AND (e.gallery IS NULL OR e.gallery = '[]'::jsonb);

UPDATE equipment e
SET gallery = jsonb_build_array(
      jsonb_build_object(
        'type', 'cover',
        'url',  'https://www.lg.com/content/dam/channel/wcms/za/images/washing-machines/f4v5ryp2t_assqesa_efsa_za_c/gallery/D-01-V1.jpg',
        'alt',  'LG F4V5RYP2T — front-load kir yuvish mashinasi 10.5 kg')
    )
WHERE e.slug = 'lg-f4v5ryp2t-washer'
  AND (e.gallery IS NULL OR e.gallery = '[]'::jsonb);

UPDATE equipment e
SET gallery = jsonb_build_array(
      jsonb_build_object(
        'type', 'cover',
        'url',  'https://www.lg.com/content/dam/channel/wcms/hk_en/images/washer-dryer/wf-dt90vw_abwpehk_echk_hk_en_c/gallery/large01.jpg',
        'alt',  'LG WF-DT90VW — heat pump quritish mashinasi 9 kg')
    )
WHERE e.slug = 'lg-wf-dt90vw-dryer'
  AND (e.gallery IS NULL OR e.gallery = '[]'::jsonb);


COMMIT;

-- ============================================================================
-- TEKSHIRUV (faqat SELECT)
-- ============================================================================
SELECT e.id, e.slug, e.model,
       CASE WHEN e.cover_image IS NULL THEN 'NULL'
            WHEN e.cover_image LIKE '%PXV875DV1E%' THEN 'Bosch PXV875DV1E'
            WHEN e.cover_image LIKE '%f4v5ryp2t%'     THEN 'LG F4V5RYP2T'
            WHEN e.cover_image LIKE '%wf-dt90vw%'     THEN 'LG WF-DT90VW'
            ELSE '???' END AS rasm
FROM equipment e ORDER BY (e.cover_image IS NULL), e.id;

-- KUTILAYOTGAN:
--   3 qatorda model nomi (Bosch PXV875DV1E / LG F4V5RYP2T / LG WF-DT90VW)
--   7 qatorda NULL

SELECT count(*) AS jami_rasm FROM equipment_images;
-- KUTILAYOTGAN: 3

SELECT count(*) AS rasm_manbasi
FROM equipment_sources WHERE source_type = 'manufacturer_cdn' AND verified AND manufacturer_source;
-- KUTILAYOTGAN: 3

SELECT count(*) AS duplicate_image
FROM (SELECT equipment_id, image_type FROM equipment_images
      GROUP BY 1,2 HAVING count(*) > 1) x;
-- KUTILAYOTGAN: 0

-- ============================================================================
-- ROLLBACK (kerak bo'lsa) — FAQAT equipment_* jadvallar
-- ============================================================================
-- UPDATE equipment SET cover_image = NULL, gallery = '[]'::jsonb
--  WHERE slug IN ('bosch-pxv875dv1e-induction','lg-f4v5ryp2t-washer','lg-wf-dt90vw-dryer');
-- DELETE FROM equipment_images WHERE image_type = 'cover'
--   AND equipment_id IN (SELECT id FROM equipment
--     WHERE slug IN ('bosch-pxv875dv1e-induction','lg-f4v5ryp2t-washer','lg-wf-dt90vw-dryer'));
-- DELETE FROM equipment_sources WHERE source_type = 'manufacturer_cdn';
--
-- ESLATMA: Rollback FAQAT equipment_* ga tegadi. materials, library_books,
-- library_resources, construction_materials, users — umuman tegilmaydi.
-- ============================================================================