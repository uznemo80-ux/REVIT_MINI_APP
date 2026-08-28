# Revit Mini App — O'rnatish qo'llanmasi

## 1. Bot yaratish
1. Telegram'da **@BotFather** ga yozing
2. `/newbot` → nom bering → **token** oling, saqlab qo'ying
3. `/mybots` → botingizni tanlang → **Bot Settings → Menu Button** → keyinroq Railway domenini shu yerga qo'yasiz

## 2. Railway'da loyihani ishga tushirish
1. https://railway.app → GitHub bilan kiring
2. Bu papkani (`revit-mini-app`) o'zingizning GitHub repo'ingizga yuklang
3. Railway'da **New Project → Deploy from GitHub repo** → shu repo'ni tanlang
4. **+ New → Database → Add PostgreSQL** bosing — Railway avtomatik `DATABASE_URL` beradi
5. **Variables** bo'limiga kiring va qo'shing:
   - `BOT_TOKEN` — BotFather'dan olgan token
   - `ADMIN_TELEGRAM_ID` — sizning shaxsiy Telegram ID'ingiz (@userinfobot orqali bilib oling)
   - `APP_URL` — Railway bergan domen (masalan `https://revit-mini-app.up.railway.app`)
6. Deploy tugagach, **Settings → Networking → Generate Domain** bosib domen oling, shuni `APP_URL` ga qo'ying va qayta deploy qiling

## 3. Bazani to'ldirish
Railway Postgres'ga ulanib (`psql` yoki Railway'ning ichki "Data" bo'limi orqali):
```sql
-- schema.sql faylini ishga tushiring (jadvallarni yaratadi)
```
Keyin har bir modul/darsni qo'lda yoki kichik skript orqali qo'shasiz:
```sql
INSERT INTO modules (title, order_index) VALUES ('1-modul: Boshlang''ich sozlash', 1);
INSERT INTO lessons (module_id, title, order_index, youtube_url, task_text, is_free)
VALUES (1, '1-dars: Revit interfeysi', 1, 'https://youtu.be/XXXX', 'Interfeysdagi asosiy panellarni toping', true);
```

## 4. BotFather'da Mini App tugmasini ulash
`/newapp` buyrug'i orqali yoki Menu Button orqali `APP_URL`'ni Mini App sifatida bog'lang.

## 5. Sinab ko'rish
Botga `/start` yozing → "📚 Darslarni ochish" tugmasi chiqadi → bosganda Mini App ochiladi.

## Admin qanday ishlaydi
- O'quvchi "To'liq kirish uchun murojaat qilish" tugmasini bosadi → sizga (adminga) bot orqali xabar keladi
- Siz tashqarida to'lovni qabul qilasiz
- Botga shunchaki yozasiz: `/approve 123456789` (o'quvchining Telegram ID'si) → 1 yillik ruxsat avtomatik ochiladi
- Muddat tugasa, tizim avtomatik yana qulflaydi — o'quvchi yana admin bilan bog'lanishi kerak

## Eslatma
- 140 ta darsni qanday modul/tuzilmaga bo'lish sizning ixtiyoringizda — `modules` va `lessons` jadvaliga xohlagancha qo'shishingiz mumkin, kod tomondan cheklov yo'q
- Fayllarni (`lesson_files`) Telegram orqali botga yuborib, `file_id` sifatida ham saqlash mumkin — buni keyinroq avtomatlashtirish mumkin
test
