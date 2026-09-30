-- ============================================================================
-- YOSHUZBEKK — Migration 002: materials approval workflow
-- ============================================================================
--
-- Branch: integrate-material-approval
-- Holat:  TAYYOR — production DB'da ISHLATILMAGAN
--
-- MAQSAD:
--   Yangi yaratiladigan materiallar avtomatik DRAFT bo'lishi va admin
--   tasdiqlagandan keyin PUBLISH qilinishi. Rad etilganda sabab
--   (review_notes) saqlanishi.
--
-- ---------------------------------------------------------------------------
-- LOYIHA CONVENTION
-- ---------------------------------------------------------------------------
--   Bu loyihada `migrations/` papkasi YO'Q. Baza o'zgarishlari:
--     - schema.sql (to'liq sxema hujjati)
--     - server.js ichida idempotent ALTER TABLE ... ADD COLUMN IF NOT EXISTS
--   Bu migration server.js ga QO'SHILMAYDI — mustaqil fayl sifatida,
--   production'ga qo'lda ishga tushirish uchun saqlanadi.
--   Agar server.js ichiga ko'chirish kerak bo'lsa, u yerda
--   `ALTER TABLE ... IF NOT EXISTS` shaklida bo'lishi SHART.
--
-- ---------------------------------------------------------------------------
-- NIMA QILINMAYDI (MUHIM)
-- ---------------------------------------------------------------------------
--   ❌ Mavcut materiallarning status'i O'ZGARTIRILMAYDI
--   ❌ Mavcut published materiallar draft'ga O'TKAZILMAYDI
--   ❌ verification_status ga tegilmaydi (alohida o'zgaruvchi qoladi)
--   ❌ materials jadvalidagi boshqa ustunlar o'zgarmaydi
--
--   Faqat: (a) DEFAULT qiymati, (b) yangi review_notes ustuni.
--   Shuning uchun `UPDATE` yo'q — migration to'liq xavfsiz.
--
-- ---------------------------------------------------------------------------
-- XAVFSIZLIK
-- ---------------------------------------------------------------------------
--   ADD COLUMN IF NOT EXISTS → qayta ishga tushirilsa xato bermaydi
--   SET DEFAULT              → mavjud qatorlarga ta'sir qilmaydi
--   Yangi material INSERT    → status avtomatik 'draft' bo'ladi
--   Mavdalar (materials)     → o'z statusida qoladi
--
-- ============================================================================


BEGIN;


-- ############################################################################
-- QADAM 1: Yangi materiallar uchun status DEFAULT = 'draft'
-- ############################################################################
--
-- Sabab: hozirgi DEFAULT 'published' (schema.sql:283). Bu sababli admin
-- yangi material qo'shganda u DARHOL foydalanuvchilar katalogida ko'rinadi —
-- tasdiqlashdan oldin. Bu workflow maqsadiga zid.
--
-- DEFAULT ni o'zgartirish mavjud qatorlarga ta'sir QILMAYDI —
-- Postgres DEFAULT faqat yangi INSERT larda qo'llaniladi.
--
-- Eslatma: 'pending_review' ham qabul qilinadi (stats endpoint'i hisoblaydi,
-- schema'da mavjud) lekin yangi materiallar uchun standart 'draft'.

ALTER TABLE materials
  ALTER COLUMN status SET DEFAULT 'draft';


-- ############################################################################
-- QADAM 2: review_notes — rad etish sababi
-- ############################################################################
--
-- Admin materialni rad etganda yozgan izoh. Faqat admin ko'radi —
-- user-facing endpoint'larda qaytarilmaydi (server.js da alohida
-- SELECT ro'yxatida kiritilgan).
--
-- IF NOT EXISTS → migration qayta ishga tushirilsa xato bermaydi.

ALTER TABLE materials
  ADD COLUMN IF NOT EXISTS review_notes TEXT DEFAULT NULL;


-- ############################################################################
-- QADAM 3: published_at — nashr sanasi
-- ############################################################################
--
-- materials jadvalida yo'q edi. Approve qilganda qo'yiladi.
-- Mavcut materiallarda NULL qoladi (published_at ni o'zgartirmaymiz) —
-- ular allaqach published, tarixiy sana mavjud emas.
--
-- IF NOT EXISTS → idempotent.

ALTER TABLE materials
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NULL;


-- ############################################################################
-- QADAM 4: Indeks — user catalog filtri tezlashtirish
-- ############################################################################
--
-- /api/materials/list har safar `WHERE m.status = 'published'` bilan
-- filtrlaydi (server.js /api/materials/list). Bu indekssiz ketma-ket
-- to'liq skan bo'ladi.
--
-- IF NOT EXISTS → idempotent.

CREATE INDEX IF NOT EXISTS idx_materials_status
  ON materials(status);


-- ############################################################################
-- QADAM 5: TEKSHIRUV
-- ############################################################################
--
-- KUTILAYOTGAN NATIJA:
--   total        — o'zgarmagan (mavcut materiallar soni)
--   published    — o'zgarmagan
--   draft        — o'zgarmagan (mavsumdan)
--   default_draft — 'draft'  ← YANGILANDI
--   review_notes_col = 1       ← YANGILANDI
--   published_at_col   = 1     ← YANGILANDI
--
-- total va published O'ZGARMASLIGI kerak — migration hech qanday
-- UPDATE qilmaydi, faqat DEFAULT va yangi ustunlar qo'shadi.

SELECT
  COUNT(*)                                                      AS total,
  COUNT(*) FILTER (WHERE status = 'published')                  AS published,
  COUNT(*) FILTER (WHERE status = 'draft')                      AS draft,
  COUNT(*) FILTER (WHERE status = 'pending_review')             AS pending_review,
  COUNT(*) FILTER (WHERE status = 'archived')                   AS archived
FROM materials;

-- Ustunlar tekshiruvi
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'materials'
  AND column_name IN ('status', 'review_notes', 'published_at', 'verification_status')
ORDER BY column_name;

-- KUTILAYOTGAN (4 ta qator):
-- | column_name        | data_type | is_nullable | column_default        |
-- |--------------------|-----------|-------------|-----------------------|
-- | published_at       | timestamptz | YES       | NULL                  |  ← yangi
-- | review_notes       | text      | YES         | NULL                  |  ← yangi
-- | status             | character varying | NO | 'draft'::character varying |  ← o'zgaradi
-- | verification_status | character varying | NO | 'verified'::character varying |  ← tegilmaydi


COMMIT;

-- ============================================================================
-- ROLLBACK (kerak bo'lsa)
-- ============================================================================
-- ALTER TABLE materials ALTER COLUMN status SET DEFAULT 'published';
-- DROP INDEX IF EXISTS idx_materials_status;
-- ALTER TABLE materials DROP COLUMN IF EXISTS review_notes;
-- ALTER TABLE materials DROP COLUMN IF EXISTS published_at;
--
-- ESLATMA: rollback review_notes va published_at ustunlarini butunlay
-- o'chiradi. O'sha ustunlarda ma'lumot bo'lsa — yo'qoladi.
-- Mavjud materiallarning status'i rollback'dan KEYIN ham o'zgarmaydi
-- (faqat DEFAULT o'zgaradi).
-- ============================================================================
