# YOSHUZBEKK MINI APP — TELEFON + KOMPYUTER INTERFEYSI UCHUN DOIMIY UI/UX QONUN-QOIDALARI

Ushbu qoidalar butun loyiha davomida barcha ishlab chiquvchilar va AI agentlar uchun qat'iy majburiy hisoblanadi.
Har qanday yangi funksiya, sahifa, modal, tugma, karta, admin panel yoki komponent yaratishda ushbu qoidalarga amal qilinadi.

==================================================
1. ASOSIY PRINSIP
==================================================
Mini App ikkita asosiy muhitda ishlaydi:
- 📱 MOBILE — Telegram ichidagi telefon interfeysi
- 🖥 DESKTOP — Telegram Desktop yoki brauzer orqali kompyuter interfeysi

Ular bir xil ma'lumot va funksiyalardan foydalanadi, lekin boshqaruv usuli bir xil emas.
SHUNING UCHUN: Mobile ≠ Desktop.
Desktop dizaynini shunchaki kichraytirib Mobile qilma.
Mobile uchun:
* touch
* barmoq
* kichik ekran
* bir qo‘l bilan foydalanish
* vertical layout
Desktop uchun:
* mouse
* keyboard
* hover
* katta ekran
* keng layout

==================================================
2. ENG MUHIM QOIDA — MAVJUD ARXITEKTURANI BUZMA
==================================================
Yangi UI qo‘shayotganda:
❌ mavjud navigationni buzma
❌ mavjud route'larni o‘zgartirma
❌ mavjud componentlarni sababsiz almashtirma
❌ mavjud CSS global qoidalarini buzma
❌ mavjud database strukturasini sababsiz o‘zgartirma
❌ ishlayotgan funksiyani yangi funksiya sababli buzma

Avval mavjud tizimni tushun. Keyin faqat kerakli joyga o‘zgartirish kirit.

==================================================
3. MOBILE FIRST, LEKIN DESKTOPNI HAM ALOHIDA TEKSHIR
==================================================
Har bir yangi interfeys uchun ikkita alohida test qil:
📱 MOBILE TEST: 320px, 360px, 390px, 430px
🖥 DESKTOP TEST: 1024px, 1280px, 1440px, 1920px

Interfeys hech birida:
❌ horizontal scroll
❌ kesilib qolgan tugma
❌ ekran tashqarisiga chiqib ketgan modal
❌ ustma-ust tushgan element
❌ o‘qib bo‘lmaydigan matn
❌ bosib bo‘lmaydigan tugma
bo‘lmasligi kerak.

==================================================
4. MOBILE TOUCH QOIDALARI
==================================================
Barcha asosiy interactive elementlar barmoq bilan qulay bosiladigan bo‘lsin.
Tugma/touch target:
- minimum: 44 × 44 px
- ideal: 48 × 48 px
Kichik iconlarni: ❌ 20×20 clickable area qilma.
Icon kichik bo‘lsa ham uning tashqi clickable area katta bo‘lsin.
Misol: ❌ faqat icon bosiladi -> ✅ icon joylashgan 44–48px touch area bosiladi.

==================================================
5. MOBILE'DA HOVERGA TAYANMA
==================================================
Mobile'da hover mavjud emas. Shuning uchun funksiyani "foydalanuvchi ustiga olib kelganda chiqadi" mexanizmiga bog‘lama.
Desktop: hover → mumkin.
Mobile: tap → kerak.
Agar hover'da chiqadigan ma'lumot muhim bo‘lsa, Mobile'da: tap → tooltip/popover/modal ko‘rinishida ishlasin.

==================================================
6. DESKTOP MOUSE QOIDALARI
==================================================
Desktop'da: hover feedback, pointer cursor, active state, focus state, tooltip ishlatilishi mumkin.
Interactive element ustiga mouse olib borilganda foydalanuvchi uning interactive ekanini tushunsin.
Lekin: ❌ hover animatsiyasi funksiyani ishga tushirmasin. Hover faqat feedback bo‘lsin. Click/tap haqiqiy action bo‘lsin.

==================================================
7. HOVER ANIMATSIYASI
==================================================
Desktop'da karta yoki tugma ustiga mouse olib borilganda:
* juda kichik scale (transform: scale(1.02) atrofida)
* shadow
* background change
* icon movement
Lekin: ❌ katta zoom, ❌ karta sakrashi, ❌ layout o‘zgarishi, ❌ boshqa elementlarni siljitish bo‘lmasin.

==================================================
8. CLICK / TAP QOIDASI
==================================================
Har bir action uchun: Idle ↓ Hover (desktop) ↓ Pressed ↓ Loading ↓ Success / Error holatlari bo‘lishi kerak.
Foydalanuvchi tugmani bosganda hech qanday feedbacksiz qolmasin.
Agar serverga request ketayotgan bo‘lsa: Loading state ko‘rsat ("Saqlash" -> "Saqlanmoqda..." -> "Saqlangan").

==================================================
9. DOUBLE CLICK / DOUBLE TAP HIMOYASI
==================================================
Bitta actionni ikki marta bajarish mumkin bo‘lgan joylarda himoya qo‘sh ("Delete", "Save", "Submit", "Payment").
Foydalanuvchi tez-tez ikki marta bossa: ❌ ikki marta request ketmasin. Action birinchi request tugamaguncha disabled/loading bo‘lsin.

==================================================
10. DESTRUCTIVE ACTION
==================================================
Delete, Remove, Reset, Logout yoki muhim ma'lumotni o‘zgartiradigan actionlarda confirmation kerak.
Lekin oddiy: Open, Back, Next, Save uchun ortiqcha confirmation so‘rama.

==================================================
11. MOBILE NAVIGATION
==================================================
Mobile'da navigation: aniq, qisqa, bir xil joyda, barmoq uchun qulay bo‘lsin.
Bottom Navigation: Bosh sahifa, Darslar, Kutubxona, Chat, Profil kabi asosiy bo‘limlar joylashuvi o‘zgarmasin.
Yangi funksiya sababli asosiy navigationni ko‘paytirib yuborma.

==================================================
12. DESKTOP NAVIGATION
==================================================
Desktop'da mavjud navigation: sidebar yoki yuqori navigation ko‘rinishida bo‘lishi mumkin.
Katta ekran bo‘shlig‘idan unumli foydalan. Lekin: ❌ juda keng sidebar, ❌ ortiqcha katta navigation, ❌ asosiy kontentni siqib qo‘yish mumkin emas.

==================================================
13. MODAL QOIDALARI
==================================================
Mobile modal: ekranga sig‘sin, safe area'ni hisobga olsin, pastki qismdan foydalanish mumkin bo'lsin, keyboard ochilganda modal buzilmasin.
Desktop modal: markazlashtirilgan, maksimal kenglikka ega (max-width), kontentdan katta bo‘lmasin.
Modal: ❌ ekran tashqarisiga chiqmasin, ❌ yopish tugmasi yo‘qolmasin, ❌ background scroll nazoratsiz qolmasin.

==================================================
14. BACK BUTTON
==================================================
Telegram Mini App'da foydalanuvchi qayerdan kelganini tushunishi kerak.
Har bir ichki sahifada: "← Orqaga" yoki mavjud Telegram back navigation bilan mos ishlash kerak.
Back bosilganda: ❌ app bosh sahifaga tasodifan qaytib ketmasin. Foydalanuvchi real navigation history bo‘yicha qaytsin.

==================================================
15. FORMALAR
==================================================
Inputlar: yetarlicha katta, label aniq, placeholder yordamchi, error xabari tushunarli bo‘lsin.
Error: ❌ "Invalid input" emas -> ✅ "Telefon raqami noto‘g‘ri kiritildi." Xatoni aynan qaysi fieldda ekanini ko‘rsat.

==================================================
16. KEYBOARD MUAMMOSI
==================================================
Mobile'da input bosilganda keyboard ochiladi.
Keyboard: ❌ inputni yopmasin, ❌ Submit tugmasini yashirmasin, ❌ modalni ekran tashqarisiga chiqarmasin.
Keyboard ochilganda layout moslashsin, yopilganda original holatga qaytsin.

==================================================
17. SCROLL
==================================================
Har bir sahifada scroll aniq bo‘lsin. ❌ Nested scrollni keraksiz ishlatma (page scroll + modal scroll + card scroll).
Foydalanuvchi qaysi joyni scroll qilayotganini tushunishi kerak.

==================================================
18. TABLELAR
==================================================
Desktop'da table normal ko‘rinishda bo‘lishi mumkin.
Mobile'da katta table: ❌ butun ekranni siqmasin. Horizontal scroll, card layout yoki accordion ishlat.

==================================================
19. TEXT
==================================================
Mobile: juda kichik text ishlatma, asosiy text o‘qilishi oson bo‘lsin, uzun paragraphlarni bo‘lib ber.
Desktop: juda katta text ishlatma, uzun qatorlar o‘qishni qiyinlashtirmasin. Content width haddan tashqari keng bo‘lmasin.

==================================================
20. ICON
==================================================
Iconlar: bir xil visual style, bir xil stroke weight, tushunarli, kerak bo‘lsa label bilan.
Iconning o‘zi tushunarsiz bo‘lsa: icon + text ishlat. Muhim actionlarni faqat icon bilan yashirma.

==================================================
21. LOADING
==================================================
Server request vaqtida foydalanuvchi nima bo‘layotganini bilishi kerak: ⏳ Yuklanmoqda...
Skeleton loading mavjud joylarda ishlatilishi mumkin. Loading: ❌ cheksiz davom etmasin, timeout/error holati bo‘lsin.

==================================================
22. ERROR
==================================================
Har bir API request uchun: SUCCESS, ERROR, LOADING, EMPTY holatlarini ko‘zda tut.
Error: ❌ oq ekran, ❌ console error, ❌ "Something went wrong" bilan tugamasin.
Foydalanuvchiga: "Nimadir noto‘g‘ri ketdi. Qayta urinib ko‘ring." kabi tushunarli feedback ber.

==================================================
23. EMPTY STATE
==================================================
Ma'lumot yo‘q bo‘lsa: ❌ bo‘sh oq ekran ko‘rsatma.
"📚 Hozircha bu bo‘limda ma'lumot mavjud emas." kabi chiroyli empty state ber.

==================================================
24. RESPONSIVE BREAKPOINT
==================================================
Kamida 3 ta holat: Mobile (< 768px), Tablet (768px - 1024px), Desktop (> 1024px).
Desktop layoutni 400px ekraniga majburan siqma. Mobile layoutni 1920px ekranida kattalashtirib qo‘yma.

==================================================
25. SAFE AREA
==================================================
Telegram Mini App Mobile'da: top safe area, bottom safe area, Telegram navigation area hisobga olinsin.
Muhim tugma ekranning eng past qismiga yopishib qolmasin (safe-area-inset-bottom).

==================================================
26. PERFORMANCE
==================================================
UI tez ochilsin, ortiqcha animation bo‘lmasin, katta image lazy load, uzun list pagination/infinite scroll, keraksiz API requestlarni kamaytirish.

==================================================
27. ANIMATION
==================================================
Smooth, short, purposeful. Default duration: 150–300ms. Mobile'da: ❌ og‘ir parallax, ❌ katta scale, ❌ uzun transition ishlatma.

==================================================
28. ACCESSIBILITY
==================================================
Interactive elementlar keyboard bilan boshqarilsin (Tab, Enter, Escape), focus state, readable contrast, aria-label.

==================================================
29. ADMIN PANEL
==================================================
Desktop: zichroq, ko‘proq ma'lumot, table, filter, search, bulk action.
Mobile: card, accordion, bottom sheet, responsive action menu. Desktop dizaynini Mobile'ga siqib qo‘yma.

==================================================
30. ADMIN ACTIONLARDA XATO QILISHNI OLDINI OLISH
==================================================
Delete: confirmation. Save: double submit protection. Edit: unsaved changes warning. Bulk delete: aniq nechta element o‘chishini ko‘rsat.

==================================================
31. HOVER VS TOUCH
==================================================
DESKTOP: hover → visual feedback.
MOBILE: tap → visual feedback.
Biror muhim funksiyani faqat hoverga bog‘lama.

==================================================
32. DESKTOPDA MOUSE CURSOR
==================================================
Clickable: cursor: pointer. Text: default. Disabled: not-allowed.

==================================================
33. MOBILEDA PRESS FEEDBACK
==================================================
Foydalanuvchi tugmani bosganda opacity, background, juda kichik scale (transform: scale(0.98)) bilan yengil pressed effect ber.

==================================================
34. Z-INDEX
==================================================
Modal, dropdown, tooltip, bottom sheet, toast bir-birini yopib yubormasligi uchun yagona z-index hierarchy ishlat. Tasodifiy `z-index: 99999` ko‘paytirib ketma.

==================================================
35. GLOBAL CSS
==================================================
Yangi modul uchun `body`, `html`, `button`, `input`, `*` global stylelarni sababsiz o‘zgartirma. Scoped class ishlat.

==================================================
36. BROWSER / TELEGRAM TEST
==================================================
Tekshiruv ekranlari: 360px, 390px, 430px, 768px, 1024px, 1280px, 1440px.

==================================================
37. REGRESSION TEST
==================================================
Bosh sahifa, Darslar, Kutubxona, Kitoblar, Materiallar, Chat, Profil, Admin, Search, Reader, Navigation doimo 100% ishlashi shart.

==================================================
38. UI O‘ZGARTIRISHDAN OLDIN
==================================================
Avval mavjud component, CSS, responsive logic, route, API, state management, design tokens tekshirilsin. Duplicate yaratilmasin.

==================================================
39. AI MUSTAQIL ISHLASH QOIDASI
==================================================
Har bir mayda o‘zgarish uchun so‘rama. Kodni tekshir, aniqla, xavfsiz implement qil, test qil.
Faqat ma'lumot o‘chishi, prod DB xavfi, qaytarib bo‘lmas holatlarda so‘ra.

==================================================
40. YAKUNIY TASDIQLASH
======================
Barcha UI ishlarini tugat, test qil, regression test qil, Mobile va Desktopni tekshir.
Faqat shundan keyin yakuniy commit/push qilishdan oldin bir marta so‘ra.
