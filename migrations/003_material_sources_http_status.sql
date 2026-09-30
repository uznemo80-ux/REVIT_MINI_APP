-- ============================================================================
-- YOSHUZBEKK — Migration 003: material_sources http_status va boshqa ustunlar
-- ============================================================================
--
-- Branch: integrate-material-approval
-- Holat:  TAYYOR — production DB'da ISHLATILMAGAN
--
-- ---------------------------------------------------------------------------
-- MUAMMO
-- ---------------------------------------------------------------------------
-- Deploy logida:
--   ❌ MATERIALS INIT ERROR: column "http_status" of relation "material_sources"
--      does not exist
--   at /app/materialsData.js:384
--
-- Sabab: materialsData.js da `CREATE TABLE IF NOT EXISTS material_sources`
-- bajariladi (materialsData.js:160). Production'da jadval ALLAQACH mavjud
-- (schema.sql:292) va u boshqa sxemaga ega — `http_status` ustuni yo'q.
-- `IF NOT EXISTS` sababli hech narsa yaratilmaydi, keyin INSERT xato beradi.
--
-- ---------------------------------------------------------------------------
-- YECHIM: KOD EMAS, SCHEMA
-- ---------------------------------------------------------------------------
-- materialsData.js va server.js ikkalasi ham ushbu ustunlarni ishlatadi:
--   materialsData.js:386  http_status, content_matched, sort_order
--   server.js:8219       s.http_status === 200  (link validator)
--   server.js:8264+      material_sources audit ro'yxati
--
-- server.js butunlay production sxemasiga mos (document_name, publisher,
-- is_primary). Shuning uchun materialsData.js ni o'zgartirish emas,
-- jadvalga yetishmayotgan ustunlarni qo'shish to'g'ri yechim.
--
-- ---------------------------------------------------------------------------
-- NIMA UCHUN DEFAULT ALOHIDA QO'YILADI (MUHIM)
-- ---------------------------------------------------------------------------
-- PostgreSQL 11+ da `ADD COLUMN ... DEFAULT 200`:
--   - jadvalni QAYTA YOZMAYDI (tez, xavfsiz)
--   - lekin mavjud qatorlarda ustun DEFAULT qiymatni QAYTARADI
--     (SELECT da 200 ko'rinadi, garchi saqlanmagan bo'lsa ham)
--
-- Bu bizning talabimizga ZID: mavjud material_sources qatorlari NULL
-- qolishi kerak — chunki ular hali link validator orqali tekshirilmagan.
-- 200 yozib qo'yish ularni "tekshirilgan" deb ko'rsatardi (noto'g'ri).
--
-- SHU SABAB: ustun avval NULLSIZ (nullable, default'siz) qo'shiladi,
-- keyin DEFAULT alohida o'rnatiladi:
--   1) ADD COLUMN ... (nullable, default'siz)  → mavjud qatorlar NULL
--   2) ALTER COLUMN ... SET DEFAULT ...        → yangi INSERTlar uchun
--
-- Natija:
--   mavjud qatorlar  → NULL  (hali tekshirilmagan — to'g'ri)
--   yangi INSERTlar  → default qiymat (ishlaydi)
--
-- ---------------------------------------------------------------------------
-- XAVFSIZLIK
-- ---------------------------------------------------------------------------
--   ❌ DROP / DELETE / TRUNCATE / UPDATE — umuman yo'q
--   ❌ NOT NULL — umuman yo'q (mavjud qatorlar NULL qolishi uchun majburiy)
--   ❌ Mavjud ma'lumot o'zgarishi — yo'q
--   ✅ ADD COLUMN IF NOT EXISTS — qayta ishga tushirilsa xato bermaydi
--   ✅ ALTER COLUMN SET DEFAULT — mavjud qatorlarga ta'sir qilmaydi
--   ✅ Transaction ichida (BEGIN/COMMIT)
--
-- ---------------------------------------------------------------------------
-- ALMASHUV YO'Q
-- ---------------------------------------------------------------------------
--   materials.status / review_notes / published_at — tegilmaydi
--   library_books / library_resources / construction_materials — tegilmaydi
--   material_likes / material_saves — tegilmaydi
--
-- ============================================================================


BEGIN;


-- ############################################################################
-- QADAM 1: http_status — link validator natijasi
-- ############################################################################
-- materialsData.js:389  → s.http_status || 200
-- server.js:8219        → s.status === 'verified' || s.http_status === 200
-- server.js:8264+       → audit ro'yxatida ko'rsatiladi
--
-- NULL = hali tekshirilmagan (mavjud qatorlar shunday qoladi)
-- 200  = muvaffaqiyatli, 404/500 = xato (FAQAT yangi INSERTlarda)
ALTER TABLE material_sources
  ADD COLUMN IF NOT EXISTS http_status INT;

ALTER TABLE material_sources
  ALTER COLUMN http_status SET DEFAULT 200;


-- ############################################################################
-- QADAM 2: content_matched — URL haqiqiy materialga mos kelganmi
-- ############################################################################
-- materialsData.js:389  → s.content_matched !== false
-- NULL = hali tekshirilmagan (mavjud qatorlar shunday qoladi)
ALTER TABLE material_sources
  ADD COLUMN IF NOT EXISTS content_matched BOOLEAN;

ALTER TABLE material_sources
  ALTER COLUMN content_matched SET DEFAULT true;


-- ############################################################################
-- QADAM 3: sort_order — manbalar tartibi
-- ############################################################################
-- materialsData.js:389  → i + 1
-- NULL = belgilanmagan (mavjud qatorlar shunday qoladi)
ALTER TABLE material_sources
  ADD COLUMN IF NOT EXISTS sort_order INT;

ALTER TABLE material_sources
  ALTER COLUMN sort_order SET DEFAULT 1;


-- ############################################################################
-- QADAM 4: error_message — validator xatoligi
-- ############################################################################
-- materialsData.js:169 da CREATE TABLE da bor, lekin INSERT da
-- ishlatilmaydi. Kelajakda validator xatolarini saqlash uchun.
--
-- Oddiy nullable column — DEFAULT kerak emas (NULL = xato yo'q),
-- shuning uchun hech narsa o'rnatilmaydi.
ALTER TABLE material_sources
  ADD COLUMN IF NOT EXISTS error_message TEXT;


-- ############################################################################
-- QADAM 5: TEKSHIRUV (faqat SELECT)
-- ############################################################################
--
-- KUTILAYOTGAN:
--   total       — o'zgarmagan
--   verified    — o'zgarmagan
--   broken      — o'zgarmagan
--   *_null      — mavjud qatorlar soniga teng bo'lishi KERAK
--                 (yangi ustunlar default'siz qo'shilgani uchun)
--
-- total, verified, broken O'ZGARMASLIGI kerak — migration hech qanday
-- UPDATE/DELETE qilmaydi, faqat ustun qo'shadi va DEFAULT o'rnatadi.

SELECT
  COUNT(*)                                                          AS total,
  COUNT(*) FILTER (WHERE status = 'verified')                       AS verified,
  COUNT(*) FILTER (WHERE status = 'broken_unavailable')             AS broken,
  COUNT(*) FILTER (WHERE http_status IS NULL)                       AS http_status_null,
  COUNT(*) FILTER (WHERE content_matched IS NULL)                   AS content_matched_null,
  COUNT(*) FILTER (WHERE sort_order IS NULL)                        AS sort_order_null,
  COUNT(*) FILTER (WHERE error_message IS NULL)                     AS error_message_null
FROM material_sources;

-- Yangi ustunlar tekshiruvi
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'material_sources'
  AND column_name IN (
    'http_status', 'content_matched', 'sort_order', 'error_message',
    'publisher', 'document_name', 'is_primary', 'status'
  )
ORDER BY column_name;

-- KUTILAYOTGAN (8 ta qator):
-- | column_name     | data_type | is_nullable | column_default |
-- |-----------------|-----------|-------------|----------------|
-- | content_matched | boolean   | YES         | true           |  ← yangi
-- | document_name   | varchar   | YES         | NULL           |  ← mavjud
-- | error_message   | text      | YES         | NULL           |  ← yangi
-- | http_status     | integer   | YES         | 200            |  ← yangi
-- | is_primary      | boolean   | YES         | false          |  ← mavjud
-- | publisher       | varchar   | YES         | NULL           |  ← mavjud
-- | sort_order      | integer   | YES         | 1              |  ← yangi
-- | status          | varchar   | YES         | 'verified'     |  ← mavjud


COMMIT;

-- ============================================================================
-- ROLLBACK (kerak bo'lsa)
-- ============================================================================
-- ALTER TABLE material_sources DROP COLUMN IF EXISTS http_status;
-- ALTER TABLE material_sources DROP COLUMN IF EXISTS content_matched;
-- ALTER TABLE material_sources DROP COLUMN IF EXISTS sort_order;
-- ALTER TABLE material_sources DROP COLUMN IF EXISTS error_message;
--
-- ESLATMA: rollback bu 4 ta ustunni butunlay o'chiradi. materialsData.js
-- va server.js:8219 yana xato beradi — shuning uchun rollback tavsiya
-- etilmaydi. Tavsiya: oldingi versiyaga qaytish (git revert).
-- ============================================================================
