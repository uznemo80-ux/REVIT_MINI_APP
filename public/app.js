// ======================================================
// YOSHUZBEKK Academy — Telegram Mini App Frontend
// Single Page Application (SPA) Engine
// ======================================================

const tg = window.Telegram?.WebApp || {
  ready: () => {},
  expand: () => {},
  initData: "",
  initDataUnsafe: {},
  HapticFeedback: { impactOccurred: () => {} },
  showAlert: (msg) => alert(msg),
  openTelegramLink: (url) => window.open(url, "_blank")
};

try {
  tg.ready();
  tg.expand();
} catch (e) {
  console.warn("Telegram WebApp API topilmadi yoki browserda ochildi", e);
}

const initData = tg.initData || "";
const app = document.getElementById("app");

// ======================================================
// HTML & JS ESCAPE UTILITIES
// ======================================================

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeJsString(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n")
    .replace(/</g, "\\u003C")
    .replace(/>/g, "\\u003E");
}

// ======================================================
// THEME HANDLING (Apple Dark / Light)
// ======================================================

let currentTheme = localStorage.getItem("theme") || "dark";

function applyTheme(theme) {
  document.documentElement.classList.toggle("light", theme === "light");
}

applyTheme(currentTheme);

function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", currentTheme);
  applyTheme(currentTheme);
  haptic("light");
  render();
}

// ======================================================
// HAPTIC FEEDBACK & NOTIFICATIONS
// ======================================================

function haptic(style = "light") {
  try {
    tg.HapticFeedback?.impactOccurred(style);
  } catch (e) {}
}

function showAlert(message) {
  try {
    tg.showAlert(String(message || ""));
  } catch (e) {
    alert(String(message || ""));
  }
}

function showToast(message, duration = 2800) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>🔔</span> ${escapeHtml(message)}`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translate(-50%, -20px)";
    toast.style.transition = "all 0.25s ease";
    setTimeout(() => toast.remove(), 260);
  }, duration);
}

function showConfirm(title, message, confirmLabel, onConfirm) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal-card">
      <div class="modal-title">${escapeHtml(title)}</div>
      <div class="modal-msg">${escapeHtml(message)}</div>
      <div class="modal-actions">
        <button type="button" class="modal-btn cancel">Bekor qilish</button>
        <button type="button" class="modal-btn confirm">${escapeHtml(confirmLabel)}</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector(".cancel")?.addEventListener("click", () => {
    haptic();
    overlay.remove();
  });

  overlay.querySelector(".confirm")?.addEventListener("click", async () => {
    haptic("medium");
    overlay.remove();
    try {
      await onConfirm();
    } catch (error) {
      console.error("CONFIRM ERROR:", error);
      showAlert(error.message || "Amalni bajarishda xatolik yuz berdi.");
    }
  });
}

// ======================================================
// GLOBAL STATE
// ======================================================

let state = {
  has_access: false,
  modules: [],
  courses: [],
  faqs: [],
  settings: {
    contact_telegram: "yoshuzbekk",
    contact_phone: "+998900000000",
    admin_photo_url: "/admin.jpg"
  },
  access_until: null,
  first_name: "",
  last_name: "",
  phone: "",
  telegram_id: "",
  username: "",
  registered: false,
  is_admin: false,
  admin_role: null,
  last_lesson: null
};

let activeTab = "home";
let selectedCourseId = null;
let currentView = null;
let aboutOpen = false;
window._answers = {};

// ======================================================
// API CLIENT
// ======================================================

async function api(path, body = {}) {
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      initData,
      ...body
    })
  });

  let data;
  try {
    data = await res.json();
  } catch (error) {
    throw new Error("Serverdan noto'g'ri javob keldi.");
  }

  if (!res.ok) {
    throw new Error(data.message || data.error || "Server xatosi");
  }

  return data;
}

// ======================================================
// AUTH & DATA LOADING
// ======================================================

async function loadAuth() {
  try {
    const data = await api("/api/auth");
    state = {
      ...state,
      ...data,
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      phone: data.phone || "",
      telegram_id: data.telegram_id || "",
      username: data.username || "",
      registered: Boolean(data.registered),
      has_access: Boolean(data.has_access),
      is_admin: Boolean(data.is_admin),
      admin_role: data.admin_role || null
    };
    return data;
  } catch (error) {
    console.error("AUTH ERROR:", error);
    state.is_admin = false;
    state.admin_role = null;
    throw error;
  }
}

async function loadContent() {
  try {
    const data = await api("/api/content");
    state = {
      ...state,
      ...data,
      first_name: data.first_name ?? state.first_name ?? "",
      last_name: data.last_name ?? state.last_name ?? "",
      phone: data.phone ?? state.phone ?? "",
      telegram_id: data.telegram_id ?? state.telegram_id ?? "",
      registered: data.registered ?? state.registered ?? false,
      is_admin: state.is_admin,
      admin_role: state.admin_role,
      last_lesson: data.last_lesson || null,
      courses: Array.isArray(data.courses) ? data.courses : [],
      faqs: Array.isArray(data.faqs) ? data.faqs : [],
      settings: data.settings || state.settings
    };
    render();
  } catch (error) {
    console.error("CONTENT LOAD ERROR:", error);
    if (app) {
      app.innerHTML = `
        <div class="page">
          <div class="empty-box">
            Ma'lumotlarni yuklashda xatolik yuz berdi.<br><br>
            <button class="btn" onclick="location.reload()">
              🔄 Qayta urinish
            </button>
          </div>
        </div>
      `;
    }
  }
}

// ======================================================
// DATE FORMATTER
// ======================================================

function fmtDate(d) {
  if (!d) return null;
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("uz-UZ", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

// ======================================================
// REGISTRATION
// ======================================================

function renderRegistration() {
  const tgUser = tg.initDataUnsafe?.user || {};
  const firstName = state.first_name || tgUser.first_name || "";
  const lastName = state.last_name || tgUser.last_name || "";

  currentView = {
    html: `
      <div class="apple-registration">
        <div class="apple-registration-brand">
          <div class="apple-registration-logo">Y</div>
          <div class="apple-registration-brand-name">YOSHUZBEKK Academy</div>
        </div>

        <div class="apple-registration-content">
          <div class="apple-registration-icon">👋</div>
          <h1>Xush kelibsiz!</h1>
          <p class="apple-registration-description">
            Kursdan foydalanishni boshlash uchun ma'lumotlaringizni kiriting.
          </p>

          <div class="apple-registration-form">
            <div class="apple-registration-field">
              <label>Ism</label>
              <input id="register-first-name" type="text" placeholder="Ismingiz" value="${escapeHtml(firstName)}">
            </div>

            <div class="apple-registration-field">
              <label>Familiya</label>
              <input id="register-last-name" type="text" placeholder="Familiyangiz" value="${escapeHtml(lastName)}">
            </div>

            <div class="apple-registration-field">
              <label>Telefon raqam</label>
              <div class="apple-phone-input">
                <span>+998</span>
                <input id="register-phone" type="tel" inputmode="numeric" placeholder="90 123 45 67">
              </div>
            </div>

            <button id="registration-submit" class="btn" onclick="submitRegistration()">
              Davom etish →
            </button>
          </div>

          <div class="apple-registration-note">
            Ma'lumotlaringiz faqat kursdan foydalanish va siz bilan bog'lanish uchun xavfsiz saqlanadi.
          </div>
        </div>
      </div>
    `
  };
  render();
}

async function submitRegistration() {
  const firstName = document.getElementById("register-first-name")?.value.trim();
  const lastName = document.getElementById("register-last-name")?.value.trim();
  const phone = document.getElementById("register-phone")?.value.trim();

  if (!firstName) return showAlert("Iltimos, ismingizni kiriting.");
  if (!lastName) return showAlert("Iltimos, familiyangizni kiriting.");
  if (!phone) return showAlert("Iltimos, telefon raqamingizni kiriting.");

  const phoneDigits = phone.replace(/[^\d]/g, "");
  if (phoneDigits.length < 9) return showAlert("Telefon raqamini to'g'ri kiriting.");

  const button = document.getElementById("registration-submit");
  if (button) {
    button.disabled = true;
    button.innerText = "Saqlanmoqda...";
  }

  try {
    haptic("medium");
    const result = await api("/api/register", {
      first_name: firstName,
      last_name: lastName,
      phone
    });

    state = {
      ...state,
      ...(result.user || {}),
      first_name: result.user?.first_name || firstName,
      last_name: result.user?.last_name || lastName,
      phone: result.user?.phone || phone,
      registered: true
    };

    showToast("Ro'yxatdan o'tish muvaffaqiyatli yakunlandi!");
    currentView = null;
    await loadContent();
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    showAlert(error.message || "Ro'yxatdan o'tishda xatolik yuz berdi.");
    if (button) {
      button.disabled = false;
      button.innerText = "Davom etish →";
    }
  }
}

// ======================================================
// PROFILE EDIT
// ======================================================

function openEditProfile() {
  haptic("light");
  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="closeDetail()">← Profilga qaytish</div>
        <div class="page-title">Profilni tahrirlash</div>

        <div class="apple-registration-form" style="background: var(--bg-surface); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border);">
          <div class="apple-registration-field">
            <label>Ism</label>
            <input id="edit-first-name" type="text" value="${escapeHtml(state.first_name)}">
          </div>

          <div class="apple-registration-field">
            <label>Familiya</label>
            <input id="edit-last-name" type="text" value="${escapeHtml(state.last_name)}">
          </div>

          <div class="apple-registration-field">
            <label>Telefon raqam</label>
            <div class="apple-phone-input">
              <span>+998</span>
              <input id="edit-phone" type="tel" inputmode="numeric" value="${escapeHtml(state.phone?.replace(/^\+?998/, '') || '')}">
            </div>
          </div>

          <button id="edit-profile-btn" class="btn" onclick="submitProfileEdit()">
            💾 Saqlash
          </button>
        </div>
      </div>
    `
  };
  render();
}

async function submitProfileEdit() {
  const firstName = document.getElementById("edit-first-name")?.value.trim();
  const lastName = document.getElementById("edit-last-name")?.value.trim();
  const phone = document.getElementById("edit-phone")?.value.trim();

  if (!firstName) return showAlert("Ismni kiriting.");
  if (!lastName) return showAlert("Familiyani kiriting.");
  if (!phone) return showAlert("Telefon raqamini kiriting.");

  const btn = document.getElementById("edit-profile-btn");
  if (btn) {
    btn.disabled = true;
    btn.innerText = "Saqlanmoqda...";
  }

  try {
    haptic("medium");
    const result = await api("/api/profile/update", {
      first_name: firstName,
      last_name: lastName,
      phone
    });

    state.first_name = result.user?.first_name || firstName;
    state.last_name = result.user?.last_name || lastName;
    state.phone = result.user?.phone || phone;

    showToast("Profil muvaffaqiyatli yangilandi!");
    closeDetail();
  } catch (error) {
    console.error("PROFILE EDIT ERROR:", error);
    showAlert(error.message || "Profilni yangilashda xato yuz berdi.");
    if (btn) {
      btn.disabled = false;
      btn.innerText = "💾 Saqlash";
    }
  }
}

// ======================================================
// STATIC DATA & AUTHOR INFO
// ======================================================

const ABOUT_TEXT = `
Assalomu alaykum! Men Abdulloh — arxitektura va BIM yo'nalishida faoliyat yurituvchi mutaxassisman.

Men Autodesk Revit dasturini real interyer va arxitektura loyihalarini yaratish, ishchi chizmalar tayyorlash va loyiha jarayonini tizimli tashkil qilish vositasi sifatida o'rganib, amaliyotda 4 yildan beri qo'llab kelmoqdaman.

Shu tajribalarimni boshqalar bilan professional tarzda bo'lishish maqsadida YOSHUZBEKK Academy platformasini yaratdim.
`;

const ABOUT_SHORT = `
Assalomu alaykum! Men Abdulloh — arxitektura va BIM yo'nalishida faoliyat yurituvchi mutaxassisman. Revit dasturida professional interyer loyihalashni amaliyotda o'rgataman.
`;

const TESTIMONIALS = [
  { text: "Kurs juda tushunarli va amaliy. Revitda ishlash tezligim 2 barobar oshdi!", name: "Jasur R." },
  { text: "Har bir dars eng kichik detallarigacha professional tushuntirilgan.", name: "Madina K." },
  { text: "Vazifalar orqali real loyiha chizishni o'rganib oldim.", name: "Sardor B." }
];

function toggleAbout() {
  aboutOpen = !aboutOpen;
  render();
}

// ======================================================
// TAB 1: HOME PAGE (Talab 1 & Talab 2)
// ======================================================

function renderHome() {
  const modules = Array.isArray(state.modules) ? state.modules : [];
  const myTotal = modules.reduce((tot, m) => tot + (m.lessons?.length || 0), 0);
  const myWatched = modules.reduce((tot, m) => tot + (m.watched_count || 0), 0);
  const pct = myTotal ? Math.round((myWatched / myTotal) * 100) : 0;

  // Talab 1: Admin rasmi
  const adminPhoto = state.settings?.admin_photo_url || "/admin.jpg";
  const faqsList = state.faqs && state.faqs.length ? state.faqs : [];

  return `
    <div class="page">
      <div class="welcome-hero">
        <div class="welcome-badge">✨ YOSHUZBEKK Academy</div>
        <div class="welcome-title">
          Xush kelibsiz${state.first_name ? ", " + escapeHtml(state.first_name) : ""}!
        </div>
        <div class="welcome-sub">Revit dasturida interyer loyihalash professional akademiyasi</div>
      </div>

      ${myTotal ? `
        <div class="progress-wrap">
          <div class="progress-labels">
            <span>O'quv progressi</span>
            <span>${myWatched} / ${myTotal} dars (${pct}%)</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${pct}%"></div>
          </div>
        </div>
      ` : ""}

      <!-- 1-TALAB: O'ZIM HAQIMDA (Mobil telefonda 100% ko'rinadigan rasm) -->
      <div class="about-card">
        <div class="about-photo-wrap" style="display:flex; align-items:center; gap:14px; margin-bottom:14px;">
          <div style="position:relative; width:64px; height:64px; flex-shrink:0;">
            <img
              src="${escapeHtml(adminPhoto)}"
              alt="Abdulloh"
              class="about-photo"
              style="width:64px; height:64px; border-radius:50%; object-fit:cover; display:block; border:2px solid var(--accent); box-shadow:0 4px 14px var(--accent-glow);"
              onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=Abdulloh&background=2979ff&color=fff&size=128&bold=true';"
            />
            ${state.is_admin ? `
              <div onclick="openAdminSettingsModal()" title="Rasmni o'zgartirish" style="position:absolute; bottom:-2px; right:-2px; background:var(--accent); color:#fff; border-radius:50%; width:22px; height:22px; display:flex; align-items:center; justify-content:center; font-size:11px; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.3);">
                📷
              </div>
            ` : ""}
          </div>
          <div>
            <div class="about-author-name" style="font-size:16.5px; font-weight:750;">Abdulloh</div>
            <div class="about-author-role" style="font-size:12px; color:var(--text-secondary);">BIM & Revit Instruktor · YOSHUZBEKK</div>
          </div>
        </div>
        <div class="about-text">
          ${aboutOpen ? ABOUT_TEXT.replace(/\n/g, "<br>") : ABOUT_SHORT.replace(/\n/g, "<br>")}
        </div>
        <div class="about-more" onclick="toggleAbout()">
          ${aboutOpen ? "Yashirish ↑" : "Batafsil ma'lumot ↓"}
        </div>
      </div>

      <div class="section-title">
        <span>Mavjud Kurslar</span>
        <span style="font-size:13px; color:var(--accent); cursor:pointer;" onclick="setTab('lessons')">Barchasi →</span>
      </div>

      <div class="course-card" onclick="openCourseCatalog('intpro')">
        <div class="course-card-header">
          <div class="course-banner-text">
            <h3>INTPRO Revit</h3>
            <p>Interyer Loyihalash & BIM Modellashtirish</p>
          </div>
        </div>
        <div class="course-body">
          <div class="course-title">INTPRO — Revit dasturida interyer loyihalash</div>
          <div class="course-meta">
            <span>📚 11 Modul</span>
            <span>🎬 140 Dars</span>
            <span>⏱️ 1 Yil kirish</span>
          </div>
          <div class="course-price-wrap">
            <div class="course-price">1 500 000 so'm</div>
            <button class="btn" style="width: auto; margin-bottom: 0; padding: 10px 20px;" onclick="event.stopPropagation(); setTab('chat')">
              ${state.has_access ? "Kirish faol ✅" : "Sotib olish 💳"}
            </button>
          </div>
        </div>
      </div>

      <div class="section-title">Namuna Darslar</div>
      <div class="quick-item" onclick="openCourseCatalog('intpro')">
        <span>▶ Bepul namuna darslarni ko'rish</span>
        <span>→</span>
      </div>

      <div class="section-title">O'quvchilar fikri</div>
      <div class="testi-scroll">
        ${TESTIMONIALS.map(t => `
          <div class="testi-card">
            <div class="testi-text">"${escapeHtml(t.text)}"</div>
            <div class="testi-name">— ${escapeHtml(t.name)}</div>
          </div>
        `).join("")}
      </div>

      <!-- 2-TALAB: KO'P BERILADIGAN SAVOLLAR (SILLIQ AKKORDEON VA ADMIN BOSHQARUVI) -->
      <div class="section-title" style="margin-top:24px;">
        <span>Ko'p beriladigan savollar</span>
        ${state.is_admin ? `
          <button class="admin-small-btn" onclick="openAddFaqModal()" style="font-size:11px; padding:6px 10px;">
            ➕ Yangi savol
          </button>
        ` : ""}
      </div>

      <div class="faq-list">
        ${faqsList.map((f, i) => `
          <div class="faq-item" data-faq="${i}">
            <div class="faq-q" onclick="toggleFaq(${i})">
              <span>${escapeHtml(f.question)}</span>
              <div style="display:flex; align-items:center; gap:8px;">
                ${state.is_admin ? `
                  <span onclick="event.stopPropagation(); openEditFaqModal(${Number(f.id)}, '${escapeJsString(f.question)}', '${escapeJsString(f.answer)}', '${escapeJsString(f.author || 'Admin')}')" title="Tahrirlash" style="font-size:13px; opacity:0.8;">✏️</span>
                  <span onclick="event.stopPropagation(); deleteFaqItem(${Number(f.id)})" title="O'chirish" style="font-size:13px; opacity:0.8;">🗑️</span>
                ` : ""}
                <span class="faq-plus">+</span>
              </div>
            </div>
            <div class="faq-a">
              <div class="faq-a-inner">
                ${escapeHtml(f.answer)}
                ${f.author ? `<div style="font-size:11px; color:var(--text-muted); margin-top:6px;">— Muallif: ${escapeHtml(f.author)}</div>` : ""}
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

// 2-TALAB: SILLIQ OCHILADIGAN FAQ (DOM qayta chizilmaydi, otilib ochilmaydi!)
function toggleFaq(index) {
  haptic("light");
  const item = document.querySelector(`.faq-item[data-faq="${index}"]`);
  if (!item) return;

  const wasOpen = item.classList.contains("open");
  // Barcha ochiqlarni yopamiz
  document.querySelectorAll(".faq-item").forEach(el => el.classList.remove("open"));

  // Agar yopiq bo'lgan bo'lsa ochamiz
  if (!wasOpen) {
    item.classList.add("open");
  }
}

// Admin uchun FAQ boshqaruvi
function openAddFaqModal() {
  const q = prompt("Savolni kiriting:");
  if (!q || !q.trim()) return;
  const a = prompt("Ushbu savolga to'liq javobni kiriting:");
  if (!a || !a.trim()) return;
  const author = prompt("Muallif / Kim yozgan (masalan: Admin):", "Admin") || "Admin";

  adminApi("/api/admin/faq/add", {
    question: q.trim(),
    answer: a.trim(),
    author: author.trim()
  }).then(() => {
    showToast("Savol muvaffaqiyatli qo'shildi!");
    loadContent();
  }).catch(err => showAlert(err.message));
}

function openEditFaqModal(id, oldQ, oldA, oldAuthor) {
  const q = prompt("Savolni tahrirlang:", oldQ);
  if (!q || !q.trim()) return;
  const a = prompt("Javobni tahrirlang:", oldA);
  if (!a || !a.trim()) return;
  const author = prompt("Muallif:", oldAuthor) || "Admin";

  adminApi(`/api/admin/faq/${Number(id)}/update`, {
    question: q.trim(),
    answer: a.trim(),
    author: author.trim()
  }).then(() => {
    showToast("Savol yangilandi!");
    loadContent();
  }).catch(err => showAlert(err.message));
}

function deleteFaqItem(id) {
  showConfirm("Savol o'chirilsinmi?", "Ushbu savol-javob ro'yxatdan o'chiriladi.", "O'chirish", async () => {
    await adminApi(`/api/admin/faq/${Number(id)}/delete`);
    showToast("Savol o'chirildi!");
    loadContent();
  });
}

// ======================================================
// TAB 2: LESSONS & COURSES CATALOG (Talab 3)
// ======================================================

function renderLessons() {
  if (!selectedCourseId) {
    return renderCoursesList();
  }
  return renderCourseModules();
}

// Kurslar ro'yxati va Admin uchun "Yangi Kurs Qo'shish" (Talab 3)
function renderCoursesList() {
  const coursesList = state.courses && state.courses.length ? state.courses : [
    {
      id: 1,
      title: "INTPRO — Revit dasturida interyer loyihalash",
      subtitle: "Interyer Loyihalash & BIM Modellashtirish",
      price: "1 500 000 so'm",
      total_modules: 11,
      total_lessons: 140,
      status: "active",
      release_date: "Faol kurs",
      cover_url: ""
    }
  ];

  return `
    <div class="page">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div class="page-title" style="margin-bottom:0;">Kurslar Katalogi</div>
        ${state.is_admin ? `
          <button class="admin-small-btn" onclick="openAddCourseModal()">
            ➕ Yangi Kurs
          </button>
        ` : ""}
      </div>

      <p style="color:var(--text-secondary); margin-bottom:18px; font-size:13.5px;">
        O'rganmoqchi bo'lgan kursingizni tanlang va darslarni boshlang:
      </p>

      ${coursesList.map(course => `
        <div class="course-card" onclick="openCourseCatalog('intpro')" style="cursor:pointer; position:relative;">
          ${state.is_admin ? `
            <div style="position:absolute; top:12px; right:12px; z-index:10; display:flex; gap:6px;">
              <button class="admin-small-btn" style="padding:4px 8px; font-size:11px; background:rgba(0,0,0,0.6);" onclick="event.stopPropagation(); openEditCourseModal(${Number(course.id)})">✏️ Tahrirlash</button>
              <button class="admin-small-btn" style="padding:4px 8px; font-size:11px; background:rgba(235,59,59,0.8);" onclick="event.stopPropagation(); deleteCourseModal(${Number(course.id)})">🗑️</button>
            </div>
          ` : ""}

          <div class="course-card-header" style="aspect-ratio: 16/7; background: linear-gradient(135deg, #0d47a1, #1976d2);">
            ${course.cover_url ? `<img src="${escapeHtml(course.cover_url)}" style="width:100%; height:100%; object-fit:cover;" />` : ""}
            <div class="course-banner-text" style="${course.cover_url ? 'background:rgba(0,0,0,0.5);' : ''}">
              <h3>${escapeHtml(course.title)}</h3>
              <p>${escapeHtml(course.subtitle || '')}</p>
            </div>
          </div>
          <div class="course-body">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <div class="tag ${course.status === 'active' ? 'passed' : ''}">
                ${course.status === 'active' ? 'Faol Kurs' : 'Tez Kunda'}
              </div>
              <div style="font-weight:750; color:var(--accent); font-size:15px;">
                ${escapeHtml(course.price || '')}
              </div>
            </div>
            <div class="course-meta" style="margin-bottom:12px;">
              <span>📚 ${course.total_modules || 0} Modul</span>
              <span>🎬 ${course.total_lessons || 0} Dars</span>
              ${course.release_date ? `<span>⏱️ ${escapeHtml(course.release_date)}</span>` : ""}
            </div>
            <button class="btn" style="margin-bottom:0; padding:10px 16px;">
              ${course.status === 'active' ? 'Darslarni ochish →' : 'Tez kunda chiqadi ⏳'}
            </button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

// Kurs qo'shish va tahrirlash (Talab 3)
function openAddCourseModal() {
  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="closeDetail()">← Ortga qaytish</div>
        <div class="page-title">Yangi Kurs Qo'shish</div>

        <div class="admin-form">
          <div class="apple-field">
            <label>Kurs nomi *</label>
            <input id="c-title" class="apple-input" placeholder="Masalan: Revit Interyer Masterclass" type="text">
          </div>
          <div class="apple-field">
            <label>Qisqa tavsif</label>
            <input id="c-sub" class="apple-input" placeholder="BIM loyihalash va vizualizatsiya" type="text">
          </div>
          <div class="apple-field">
            <label>Kurs narxi</label>
            <input id="c-price" class="apple-input" placeholder="1 500 000 so'm" type="text">
          </div>
          <div class="apple-field">
            <label>Jami modullar soni</label>
            <input id="c-mod" class="apple-input" placeholder="11" type="number">
          </div>
          <div class="apple-field">
            <label>Jami darslar soni</label>
            <input id="c-less" class="apple-input" placeholder="140" type="number">
          </div>
          <div class="apple-field">
            <label>Chiqish sanasi / Holati</label>
            <input id="c-rel" class="apple-input" placeholder="Masalan: Faol kurs yoki 15-sentabr" type="text">
          </div>
          <div class="apple-field">
            <label>Obloshka (muqova) rasm linki</label>
            <input id="c-cover" class="apple-input" placeholder="https://... rasm havolasi" type="url">
          </div>

          <button class="btn" onclick="submitCreateCourse()">
            💾 Kursni saqlash
          </button>
        </div>
      </div>
    `
  };
  render();
}

async function submitCreateCourse() {
  const title = document.getElementById("c-title")?.value.trim();
  const sub = document.getElementById("c-sub")?.value.trim();
  const price = document.getElementById("c-price")?.value.trim();
  const mod = document.getElementById("c-mod")?.value;
  const less = document.getElementById("c-less")?.value;
  const rel = document.getElementById("c-rel")?.value.trim();
  const cover = document.getElementById("c-cover")?.value.trim();

  if (!title) return showAlert("Kurs nomi kiritilishi shart!");

  try {
    haptic("medium");
    await adminApi("/api/admin/courses/add", {
      title,
      subtitle: sub,
      price,
      total_modules: Number(mod) || 0,
      total_lessons: Number(less) || 0,
      release_date: rel,
      cover_url: cover
    });
    showToast("Yangi kurs muvaffaqiyatli qo'shildi!");
    closeDetail();
    loadContent();
  } catch (err) {
    showAlert(err.message || "Kurs qo'shishda xato.");
  }
}

async function openEditCourseModal(id) {
  const course = state.courses.find(c => Number(c.id) === Number(id));
  if (!course) return;

  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="closeDetail()">← Ortga qaytish</div>
        <div class="page-title">Kursni Tahrirlash</div>

        <div class="admin-form">
          <div class="apple-field">
            <label>Kurs nomi *</label>
            <input id="ec-title" class="apple-input" value="${escapeHtml(course.title)}" type="text">
          </div>
          <div class="apple-field">
            <label>Qisqa tavsif</label>
            <input id="ec-sub" class="apple-input" value="${escapeHtml(course.subtitle || '')}" type="text">
          </div>
          <div class="apple-field">
            <label>Kurs narxi</label>
            <input id="ec-price" class="apple-input" value="${escapeHtml(course.price || '')}" type="text">
          </div>
          <div class="apple-field">
            <label>Modullar soni</label>
            <input id="ec-mod" class="apple-input" value="${Number(course.total_modules || 0)}" type="number">
          </div>
          <div class="apple-field">
            <label>Darslar soni</label>
            <input id="ec-less" class="apple-input" value="${Number(course.total_lessons || 0)}" type="number">
          </div>
          <div class="apple-field">
            <label>Chiqish sanasi / Holati</label>
            <input id="ec-rel" class="apple-input" value="${escapeHtml(course.release_date || '')}" type="text">
          </div>
          <div class="apple-field">
            <label>Obloshka (muqova) rasm linki</label>
            <input id="ec-cover" class="apple-input" value="${escapeHtml(course.cover_url || '')}" type="url">
          </div>

          <button class="btn" onclick="submitUpdateCourse(${Number(id)})">
            💾 O'zgarishlarni saqlash
          </button>
        </div>
      </div>
    `
  };
  render();
}

async function submitUpdateCourse(id) {
  const title = document.getElementById("ec-title")?.value.trim();
  const sub = document.getElementById("ec-sub")?.value.trim();
  const price = document.getElementById("ec-price")?.value.trim();
  const mod = document.getElementById("ec-mod")?.value;
  const less = document.getElementById("ec-less")?.value;
  const rel = document.getElementById("ec-rel")?.value.trim();
  const cover = document.getElementById("ec-cover")?.value.trim();

  if (!title) return showAlert("Kurs nomi majburiy!");

  try {
    haptic("medium");
    await adminApi(`/api/admin/courses/${Number(id)}/update`, {
      title,
      subtitle: sub,
      price,
      total_modules: Number(mod) || 0,
      total_lessons: Number(less) || 0,
      release_date: rel,
      cover_url: cover
    });
    showToast("Kurs muvaffaqiyatli yangilandi!");
    closeDetail();
    loadContent();
  } catch (err) {
    showAlert(err.message || "Kursni yangilashda xato.");
  }
}

function deleteCourseModal(id) {
  showConfirm("Kurs o'chirilsinmi?", "Ushbu kurs kartasi o'chiriladi.", "O'chirish", async () => {
    await adminApi(`/api/admin/courses/${Number(id)}/delete`);
    showToast("Kurs o'chirildi!");
    loadContent();
  });
}

function openCourseCatalog(courseId) {
  haptic("light");
  selectedCourseId = courseId;
  activeTab = "lessons";
  currentView = null;
  render();
}

function backToCoursesList() {
  haptic("light");
  selectedCourseId = null;
  render();
}

function renderCourseModules() {
  const modules = Array.isArray(state.modules) ? state.modules : [];

  let html = `
    <div class="page">
      <div class="back-btn" onclick="backToCoursesList()">← Kurslar katalogiga qaytish</div>
      <div class="page-title" style="margin-bottom:6px;">INTPRO — Revit Darslari</div>
      <p style="color:var(--text-secondary); font-size:13px; margin-bottom:18px;">
        Kerakli modulni tanlang va darslarni boshlang:
      </p>
  `;

  if (!modules.length) {
    html += `<div class="empty-box">Hozircha modullar mavjud emas.</div>`;
  } else {
    modules.forEach((mod, idx) => {
      const lessons = Array.isArray(mod.lessons) ? mod.lessons : [];
      const watched = lessons.filter(l => l.watched).length;

      html += `
        <div class="module ${mod.unlocked ? "" : "locked"}">
          <div class="module-head" onclick="toggleModule(${Number(mod.id)})">
            <div class="module-head-left">
              <span class="idx">${String(idx + 1).padStart(2, "0")}</span>
              <div>
                <div>${escapeHtml(mod.title)}</div>
                <div style="font-size: 11.5px; color: var(--text-secondary); font-weight: 500; margin-top: 2px;">
                  ${watched}/${lessons.length} dars bajarildi
                </div>
              </div>
            </div>
            <div class="tag ${mod.unlocked ? "" : "locked-tag"}">
              ${mod.unlocked ? "Ochiq" : "🔒 Qulflangan"}
            </div>
          </div>

          <div class="lesson-list" id="mod-${Number(mod.id)}">
            ${lessons.length ? lessons.map(lesson => `
              <div class="lesson ${lesson.available ? "" : "disabled"}" onclick="${lesson.available ? `openLesson(${Number(lesson.id)})` : `showLockedInfo()`}">
                <div class="lesson-left">
                  <span class="lesson-status-icon">${lesson.watched ? "✅" : (lesson.available ? "▶" : "🔒")}</span>
                  <span>${escapeHtml(lesson.title)}</span>
                </div>
                ${lesson.is_free ? `<span class="free-badge">Namuna</span>` : ""}
              </div>
            `).join("") : `<div class="empty-box">Bu modulda darslar hali yuklanmagan.</div>`}
            
            <div style="padding: 12px 18px; border-top: 1px solid var(--border);">
              <button class="btn secondary" style="margin-bottom: 0; padding: 10px;" onclick="event.stopPropagation(); openTest(${Number(mod.id)})">
                📝 Modul bo'yicha test topshirish
              </button>
            </div>
          </div>
        </div>
      `;
    });
  }

  if (!state.has_access) {
    html += `
      <div style="margin-top: 18px;">
        <button class="btn" onclick="setTab('chat')">
          🔓 Kursga to'liq kirish huquqini olish
        </button>
      </div>
    `;
  }

  html += `</div>`;
  return html;
}

function toggleModule(id) {
  haptic("light");
  const el = document.getElementById(`mod-${Number(id)}`);
  if (el) el.classList.toggle("open");
}

function showLockedInfo() {
  haptic();
  showAlert("Ushbu dars qulflangan. Kursga to'liq kirish uchun 'Chat' bo'limi orqali adminga murojaat qiling.");
}

// ======================================================
// LESSON DETAIL
// ======================================================

async function openLesson(id) {
  try {
    haptic("light");
    currentView = {
      html: `
        <div class="lesson-loading">
          <div class="spinner"></div>
          <div>Dars ma'lumotlari yuklanmoqda...</div>
        </div>
      `
    };
    render();

    const lesson = await api(`/api/lesson/${Number(id)}`);

    if (lesson.error === "locked") {
      currentView = null;
      render();
      return showLockedInfo();
    }

    state.last_lesson = {
      lesson_id: lesson.id,
      lesson_title: lesson.title
    };

    let videoHtml = "";
    if (lesson.youtube_player_url) {
      videoHtml = `
        <div class="video-container">
          <iframe src="${escapeHtml(lesson.youtube_player_url)}" title="${escapeHtml(lesson.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      `;
    } else if (lesson.bunny_player_url) {
      videoHtml = `
        <div class="video-container">
          <iframe src="${escapeHtml(lesson.bunny_player_url)}" title="${escapeHtml(lesson.title)}" allowfullscreen></iframe>
        </div>
      `;
    } else {
      videoHtml = `
        <div class="lesson-no-video">
          🎬 Ushbu dars uchun video hozircha joylashtirilmagan.
        </div>
      `;
    }

    currentView = {
      html: `
        <div class="lesson-detail">
          <div class="back-btn" onclick="closeDetail()">← Darslar ro'yxatiga qaytish</div>
          ${videoHtml}

          <div class="lesson-detail-body">
            <h2 class="lesson-detail-title">${escapeHtml(lesson.title)}</h2>

            ${lesson.task_text ? `
              <div class="task-box">
                <div class="task-box-title">📋 Dars Vazifasi</div>
                <div class="task-box-content">${escapeHtml(lesson.task_text).replace(/\n/g, "<br>")}</div>
              </div>
            ` : ""}

            ${renderLessonFiles(lesson.files)}
            ${renderLessonWarning(lesson.warning_text)}

            <button class="btn secondary" style="margin-top: 18px;" onclick="closeDetail()">
              ← Barcha darslarga qaytish
            </button>
          </div>
        </div>
      `
    };
    render();
    window.scrollTo(0, 0);
  } catch (error) {
    console.error("OPEN LESSON ERROR:", error);
    currentView = null;
    render();
    showAlert(error.message || "Darsni ochishda xatolik yuz berdi.");
  }
}

function renderLessonFiles(files) {
  if (!Array.isArray(files) || !files.length) return "";
  return `
    <div class="lesson-section">
      <div class="section-title" style="margin-left:0; margin-right:0;">📥 Dars Materiallari</div>
      <div class="files-description">Ushbu darsga biriktirilgan manbalar va ishchi fayllarni yuklab oling:</div>
      <div class="lesson-files">
        ${files.map(f => `
          <div class="lesson-file">
            <div class="lesson-file-info">
              <span class="lesson-file-icon">📁</span>
              <span class="lesson-file-name">${escapeHtml(f.file_name || "Material")}</span>
            </div>
            <a class="download-file-btn" href="${escapeHtml(f.file_url)}" target="_blank" rel="noopener noreferrer">
              Yuklab olish 📥
            </a>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderLessonWarning(warningText) {
  const text = (warningText || "").trim();
  if (!text) return "";
  return `
    <div class="lesson-warning">
      <div class="lesson-warning-title">⚠️ DIQQAT VA OGOHLANTIRISH</div>
      <div class="lesson-warning-text">${escapeHtml(text).replace(/\n/g, "<br>")}</div>
    </div>
  `;
}

// ======================================================
// TAB 3: TASKS & TESTS MANAGEMENT (Talab 4)
// ======================================================

function renderTasks() {
  const modules = Array.isArray(state.modules) ? state.modules : [];

  return `
    <div class="page">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div class="page-title" style="margin-bottom:0;">Vazifalar va Testlar</div>
        ${state.is_admin ? `
          <button class="admin-small-btn" onclick="openAddTestModal()">
            ➕ Test Qo'shish
          </button>
        ` : ""}
      </div>

      <p style="color:var(--text-secondary); margin-bottom:18px; font-size:13px;">
        Har bir modul bo'yicha berilgan amaliy vazifalar va bilimni tekshirish testlari:
      </p>

      ${modules.length ? modules.map((mod, idx) => {
        const tasks = (mod.lessons || []).filter(l => l.task_text && l.task_text.trim());

        return `
          <div class="card" style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid var(--border); padding-bottom:10px;">
              <div>
                <span class="idx">${String(idx + 1).padStart(2, "0")}</span>
                <span style="font-weight:750; font-size:15px; margin-left:6px;">${escapeHtml(mod.title)}</span>
              </div>
              <button class="admin-small-btn" style="padding:6px 12px; font-size:11.5px;" onclick="openTest(${Number(mod.id)})">
                📝 Test Topshirish
              </button>
            </div>

            ${tasks.length ? tasks.map(t => `
              <div class="task-card" style="margin-bottom:10px;" onclick="${t.available ? `openLesson(${Number(t.id)})` : `showLockedInfo()`}">
                <div class="task-title" style="font-size:14.5px;">${escapeHtml(t.title)}</div>
                <div class="task-text">${escapeHtml(t.task_text).replace(/\n/g, "<br>")}</div>
              </div>
            `).join("") : `<div style="font-size:13px; color:var(--text-secondary); padding:6px 0;">Ushbu modulda alohida dars vazifalari belgilanmagan. Modul testi orqali bilimingizni sinab ko'ring.</div>`}
          </div>
        `;
      }).join("") : `<div class="empty-box">Hozircha modullar kiritilmagan.</div>`}
    </div>
  `;
}

function openAddTestModal() {
  const modules = state.modules || [];
  if (!modules.length) return showAlert("Avval modul yarating!");

  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="closeDetail()">← Ortga qaytish</div>
        <div class="page-title">Yangi Test Savoli Qo'shish</div>

        <div class="admin-form">
          <div class="apple-field">
            <label>Modulni tanlang *</label>
            <select id="t-mod" class="apple-input">
              ${modules.map(m => `<option value="${Number(m.id)}">${escapeHtml(m.title)}</option>`).join("")}
            </select>
          </div>
          <div class="apple-field">
            <label>Savol matni *</label>
            <textarea id="t-q" class="apple-input apple-textarea" placeholder="Savol matnini kiriting..."></textarea>
          </div>
          <div class="apple-field">
            <label>Variant A (to'g'ri bo'lishi mumkin)</label>
            <input id="t-opt-0" class="apple-input" placeholder="Variant 1" type="text">
          </div>
          <div class="apple-field">
            <label>Variant B</label>
            <input id="t-opt-1" class="apple-input" placeholder="Variant 2" type="text">
          </div>
          <div class="apple-field">
            <label>Variant C</label>
            <input id="t-opt-2" class="apple-input" placeholder="Variant 3" type="text">
          </div>
          <div class="apple-field">
            <label>Variant D</label>
            <input id="t-opt-3" class="apple-input" placeholder="Variant 4" type="text">
          </div>
          <div class="apple-field">
            <label>To'g'ri javob qaysi biri?</label>
            <select id="t-correct" class="apple-input">
              <option value="0">Variant A</option>
              <option value="1">Variant B</option>
              <option value="2">Variant C</option>
              <option value="3">Variant D</option>
            </select>
          </div>

          <button class="btn" onclick="submitCreateTest()">
            💾 Test savolini saqlash
          </button>
        </div>
      </div>
    `
  };
  render();
}

async function submitCreateTest() {
  const modId = document.getElementById("t-mod")?.value;
  const q = document.getElementById("t-q")?.value.trim();
  const o0 = document.getElementById("t-opt-0")?.value.trim();
  const o1 = document.getElementById("t-opt-1")?.value.trim();
  const o2 = document.getElementById("t-opt-2")?.value.trim();
  const o3 = document.getElementById("t-opt-3")?.value.trim();
  const correct = document.getElementById("t-correct")?.value;

  if (!modId || !q || !o0 || !o1) {
    return showAlert("Savol va kamida 2 ta javob varianti majburiy!");
  }

  const options = [o0, o1, o2, o3].filter(Boolean);

  try {
    haptic("medium");
    await adminApi("/api/admin/tests/add", {
      module_id: Number(modId),
      question: q,
      options: options,
      correct_index: Number(correct) || 0
    });
    showToast("Test savoli muvaffaqiyatli qo'shildi!");
    closeDetail();
  } catch (err) {
    showAlert(err.message || "Test qo'shishda xato.");
  }
}

// ======================================================
// TAB 4: CHAT & DIRECT LICHKA (Talab 5)
// ======================================================

function renderChat() {
  const contactTg = state.settings?.contact_telegram || "yoshuzbekk";
  const contactPhone = state.settings?.contact_phone || "+998900000000";

  return `
    <div class="page">
      <div class="page-title">Admin Bilan Aloqa</div>

      <div class="chat-box">
        <div class="chat-box-icon">💬</div>
        <div class="chat-box-title">
          ${state.has_access ? "Obunangiz faol holatda!" : "Revit kursi bo'yicha savol yoki to'lov"}
        </div>
        <p>
          ${state.has_access
            ? `Kirish muddati: <b>${escapeHtml(fmtDate(state.access_until) || "Muddatsiz")}</b> gacha.`
            : "Savol, to'lov yoki texnik masalalar bo'yicha to'g'ridan-to'g'ri adminning shaxsiy chatiga yozing yoki telefon orqali bog'laning."}
        </p>
      </div>

      <!-- 5-TALAB: SHAXSIY CHATGA YO'NALTIRISH VA TELEFON RAQAMI -->
      <button class="btn" style="background:linear-gradient(135deg, #0088cc 0%, #2979ff 100%); margin-bottom:14px;" onclick="openDirectAdminTelegram('${escapeJsString(contactTg)}')">
        💬 Admin bilan Telegramda shaxsiy chat ochish
      </button>

      <a href="tel:${escapeHtml(contactPhone)}" class="btn secondary" style="text-decoration:none; margin-bottom:18px;">
        📞 Telefon orqali qo'ng'iroq qilish (${escapeHtml(contactPhone)})
      </a>

      <!-- To'lov so'rovi yuborish -->
      <button class="btn secondary" style="margin-bottom:18px;" onclick="requestAccess()">
        ${state.has_access ? "🔄 Muddatni uzaytirish so'rovi" : "💳 Kursga kirish so'rovini yuborish"}
      </button>

      ${state.is_admin ? `
        <button class="btn secondary" style="border-style:dashed;" onclick="openAdminSettingsModal()">
          ⚙️ Aloqa ma'lumotlarini (Telegram, Tel, Rasm) sozlash
        </button>
      ` : ""}
    </div>
  `;
}

function openDirectAdminTelegram(username) {
  haptic("light");
  const cleanUser = username.replace(/^@/, "").trim();
  const url = `https://t.me/${cleanUser}`;
  try {
    tg.openTelegramLink(url);
  } catch (e) {
    window.open(url, "_blank");
  }
}

// Admin Sozlamalar oynasi (Talab 1 & Talab 5)
function openAdminSettingsModal() {
  const s = state.settings || {};
  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="closeDetail()">← Ortga qaytish</div>
        <div class="page-title">Aloqa va Rasm Sozlamalari</div>

        <div class="admin-form">
          <div class="apple-field">
            <label>Admin Telegram Usernamesi (shaxsiy lichka)</label>
            <input id="set-tg" class="apple-input" value="${escapeHtml(s.contact_telegram || '')}" placeholder="yoshuzbekk (boshida @ siz)" type="text">
          </div>
          <div class="apple-field">
            <label>Admin Telefon Raqami (qo'ng'iroq qilish uchun)</label>
            <input id="set-phone" class="apple-input" value="${escapeHtml(s.contact_phone || '')}" placeholder="+998901234567" type="tel">
          </div>
          <div class="apple-field">
            <label>Admin Rasm Linki (bosh sahifada ko'rinishi uchun)</label>
            <input id="set-photo" class="apple-input" value="${escapeHtml(s.admin_photo_url || '')}" placeholder="/admin.jpg yoki https://... rasm havolasi" type="url">
          </div>

          <button class="btn" onclick="submitAdminSettings()">
            💾 Sozlamalarni saqlash
          </button>
        </div>
      </div>
    `
  };
  render();
}

async function submitAdminSettings() {
  const tgVal = document.getElementById("set-tg")?.value.trim();
  const phoneVal = document.getElementById("set-phone")?.value.trim();
  const photoVal = document.getElementById("set-photo")?.value.trim();

  try {
    haptic("medium");
    await adminApi("/api/admin/settings/update", {
      contact_telegram: tgVal,
      contact_phone: phoneVal,
      admin_photo_url: photoVal
    });
    showToast("Aloqa va rasm sozlamalari saqlandi!");
    closeDetail();
    loadContent();
  } catch (err) {
    showAlert(err.message || "Sozlamalarni saqlashda xato.");
  }
}

async function requestAccess() {
  showConfirm(
    "So'rov yuborilsinmi?",
    "Adminga to'lovni tasdiqlash uchun xabar yuboriladi.",
    "Ha, yuborish",
    async () => {
      try {
        const result = await api("/api/request-access");
        if (result.ok) {
          showAlert(result.message || "So'rovingiz adminga muvaffaqiyatli yuborildi!");
        } else {
          showAlert(result.error || "Xatolik yuz berdi.");
        }
      } catch (error) {
        showAlert(error.message || "So'rov yuborishda xatolik.");
      }
    }
  );
}

// ======================================================
// TAB 5: PROFILE
// ======================================================

function renderProfile() {
  const fullName = [state.first_name, state.last_name].filter(Boolean).join(" ") || "Foydalanuvchi";
  const lastLesson = state.last_lesson;

  return `
    <div class="page">
      <div class="page-title">Foydalanuvchi Profili</div>

      <div class="profile-card">
        <div class="profile-avatar">
          ${(state.first_name || "Y")[0].toUpperCase()}
        </div>
        <div class="profile-name">${escapeHtml(fullName)}</div>
        <div class="profile-id">Telegram ID: ${escapeHtml(state.telegram_id)}</div>
      </div>

      <!-- Oxirgi ko'rilgan dars kartasi -->
      ${state.has_access && lastLesson ? `
        <div class="card" style="background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-elevated) 100%); border: 1px solid var(--accent-glow); margin-bottom: 18px; padding: 18px; border-radius: var(--radius-md);">
          <div style="font-size: 11.5px; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
            ▶ Qayerda to'xtagan edingiz:
          </div>
          <div style="font-size: 15.5px; font-weight: 750; margin-bottom: 4px;">
            ${escapeHtml(lastLesson.lesson_title || "Dars")}
          </div>
          ${lastLesson.module_title ? `
            <div style="font-size: 12.5px; color: var(--text-secondary); margin-bottom: 14px;">
              Modul: ${escapeHtml(lastLesson.module_title)}
            </div>
          ` : ""}
          <button class="btn" style="margin-bottom: 0; padding: 10px;" onclick="openLesson(${Number(lastLesson.lesson_id)})">
            Darsni davom ettirish ▶
          </button>
        </div>
      ` : ""}

      ${state.is_admin ? `
        <button class="btn admin-panel-btn" onclick="openAdminPanel()">
          👑 Admin Panelga o'tish
        </button>
      ` : ""}

      <div class="info-card">
        <div class="info-row">
          <span class="info-label">Telefon</span>
          <span class="info-val">${escapeHtml(state.phone || "Kiritilmagan")}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Telegram Username</span>
          <span class="info-val">${state.username ? "@" + escapeHtml(state.username) : "Yo'q"}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Kursga kirish holati</span>
          <span class="info-val ${state.has_access ? "ok" : "warn"}">
            ${state.has_access ? "🟢 Faol" : "🔴 Faol emas"}
          </span>
        </div>
        ${state.has_access ? `
          <div class="info-row">
            <span class="info-label">Kirish tugash sanasi</span>
            <span class="info-val">${escapeHtml(fmtDate(state.access_until) || "-")}</span>
          </div>
        ` : ""}
        <div class="info-row">
          <span class="info-label">Kunduzgi rejim (Light)</span>
          <div class="apple-toggle ${currentTheme === "light" ? "on" : ""}" onclick="toggleTheme()">
            <div class="apple-toggle-knob"></div>
          </div>
        </div>
      </div>

      <button class="btn secondary" onclick="openEditProfile()">
        ✏️ Profil ma'lumotlarini tahrirlash
      </button>
    </div>
  `;
}

// ======================================================
// TESTS SYSTEM
// ======================================================

async function openTest(moduleId) {
  try {
    haptic("light");
    const data = await api(`/api/module/${Number(moduleId)}/test`);
    const questions = Array.isArray(data.questions) ? data.questions : [];

    if (!questions.length) {
      return showAlert("Ushbu modul uchun test savollari hali kiritilmagan.");
    }

    window._answers = {};

    currentView = {
      html: `
        <div class="page">
          <div class="back-btn" onclick="closeDetail()">← Ortga qaytish</div>
          <div class="page-title">Modul Testi</div>

          <div id="test-questions">
            ${questions.map((q, qIdx) => {
              let opts = q.options;
              if (typeof opts === "string") {
                try { opts = JSON.parse(opts); } catch (e) { opts = []; }
              }
              if (!Array.isArray(opts)) opts = [];

              return `
                <div class="test-question">
                  <p>${qIdx + 1}. ${escapeHtml(q.question)}</p>
                  ${opts.map((opt, oIdx) => `
                    <div class="option" data-qid="${Number(q.id)}" data-idx="${oIdx}" onclick="selectTestOption(${Number(q.id)}, ${oIdx})">
                      ${escapeHtml(opt)}
                    </div>
                  `).join("")}
                </div>
              `;
            }).join("")}
          </div>

          <button class="btn" onclick="submitModuleTest(${Number(moduleId)})">
            Natijani tekshirish 📊
          </button>
        </div>
      `
    };
    render();
    window.scrollTo(0, 0);
  } catch (error) {
    console.error("OPEN TEST ERROR:", error);
    showAlert(error.message || "Testni yuklashda xatolik.");
  }
}

function selectTestOption(qId, idx) {
  haptic("light");
  window._answers[qId] = idx;
  document.querySelectorAll(`.option[data-qid="${Number(qId)}"]`).forEach(el => {
    el.classList.remove("selected");
  });
  document.querySelector(`.option[data-qid="${Number(qId)}"][data-idx="${Number(idx)}"]`)?.classList.add("selected");
}

async function submitModuleTest(moduleId) {
  try {
    haptic("medium");
    const result = await api(`/api/module/${Number(moduleId)}/submit`, {
      answers: window._answers || {}
    });

    if (result.passed) {
      showAlert(`🎉 Tabriklaymiz! Siz testdan o'tdingiz!\nNatijangiz: ${result.score}%`);
    } else {
      showAlert(`Afsuski, o'tish chegarasiga yetmadingiz.\nNatijangiz: ${result.score}%\n(Minimal: 70%)`);
    }

    closeDetail();
    await loadContent();
  } catch (error) {
    showAlert(error.message || "Test natijasini yuborishda xatolik.");
  }
}

// ======================================================
// ADMIN PANEL (Talab 6: Darslar va Fayllar, Talab 7: Modullar o'chirilgan)
// ======================================================

let adminView = "dashboard";
let adminData = {
  stats: null,
  students: [],
  modules: [],
  admins: []
};

async function adminApi(path, body = {}) {
  if (!state.is_admin) throw new Error("Sizda admin huquqi yo'q.");
  return await api(path, body);
}

async function openAdminPanel() {
  if (!state.is_admin) return showAlert("Sizda admin huquqi yo'q.");
  haptic("medium");

  currentView = {
    html: `
      <div class="lesson-loading">
        <div class="spinner"></div>
        <div>Admin panel yuklanmoqda...</div>
      </div>
    `
  };
  render();

  try {
    const data = await adminApi("/api/admin/stats");
    adminData.stats = data.stats || {};
    adminView = "dashboard";
    renderAdminPanel();
  } catch (error) {
    console.error("ADMIN OPEN ERROR:", error);
    showAlert(error.message || "Admin panelni yuklashda xatolik.");
    closeDetail();
  }
}

// 7-TALAB: "MODULLAR" QATORI BUTUNLAY OLIB TASHLANDI
function renderAdminPanel() {
  currentView = {
    html: `
      <div class="admin-page">
        <div class="back-btn" onclick="closeDetail()">← Ilovaga qaytish</div>

        <div class="admin-header">
          <div class="admin-title">👑 Boshqaruv Paneli</div>
          <div class="admin-role">${state.admin_role === "super_admin" ? "Super Admin" : "Admin"}</div>
        </div>

        <div class="admin-tabs">
          <button class="${adminView === "dashboard" ? "active" : ""}" onclick="adminSetTab('dashboard')">
            📊 Statistika
          </button>
          <button class="${adminView === "students" ? "active" : ""}" onclick="adminSetTab('students')">
            👨‍🎓 O'quvchilar
          </button>
          <button class="${adminView === "lessons" ? "active" : ""}" onclick="adminSetTab('lessons')">
            🎬 Darslar
          </button>
          ${state.admin_role === "super_admin" ? `
            <button class="${adminView === "admins" ? "active" : ""}" onclick="adminSetTab('admins')">
              👥 Adminlar
            </button>
          ` : ""}
        </div>

        <div class="page" style="padding-top: 0;">
          ${adminView === "dashboard" ? renderAdminDashboard() : ""}
          ${adminView === "students" ? renderAdminStudents() : ""}
          ${adminView === "lessons" ? renderAdminLessons() : ""}
          ${adminView === "admins" ? renderAdminAdmins() : ""}
        </div>
      </div>
    `
  };
  render();
}

async function adminSetTab(tab) {
  haptic("light");
  adminView = tab;

  try {
    if (tab === "dashboard") {
      const data = await adminApi("/api/admin/stats");
      adminData.stats = data.stats || {};
    } else if (tab === "students") {
      const data = await adminApi("/api/admin/students");
      adminData.students = data.students || [];
    } else if (tab === "lessons") {
      const data = await adminApi("/api/admin/modules");
      adminData.modules = data.modules || [];
    } else if (tab === "admins") {
      const data = await adminApi("/api/admin/admins");
      adminData.admins = data.admins || [];
    }
    renderAdminPanel();
  } catch (error) {
    showAlert(error.message || "Ma'lumotlarni yuklashda xatolik.");
  }
}

// Admin Dashboard
function renderAdminDashboard() {
  const s = adminData.stats || {};
  return `
    <div class="admin-stats-grid">
      <div class="admin-stat-card">
        <div class="admin-stat-icon">👥</div>
        <div class="admin-stat-value">${s.total_students || 0}</div>
        <div class="admin-stat-label">Jami O'quvchilar</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-icon">💳</div>
        <div class="admin-stat-value">${s.paid_students || 0}</div>
        <div class="admin-stat-label">Faol Obunachilar</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-icon">⏳</div>
        <div class="admin-stat-value">${s.unpaid_students || 0}</div>
        <div class="admin-stat-label">Muddati Tugaganlar</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-icon">🎬</div>
        <div class="admin-stat-value">${s.total_lessons || 0}</div>
        <div class="admin-stat-label">Jami Darslar</div>
      </div>
    </div>
    <button class="btn secondary" onclick="adminSetTab('dashboard')">
      🔄 Statistikani yangilash
    </button>
  `;
}

// Admin Students
function renderAdminStudents() {
  const students = adminData.students || [];
  if (!students.length) return `<div class="empty-box">O'quvchilar ro'yxati bo'sh.</div>`;

  return `
    <div class="admin-list">
      ${students.map(st => `
        <div class="admin-student-card" onclick="openAdminStudentModal(${Number(st.id)})">
          <div class="admin-student-avatar">
            ${(st.first_name || "O")[0].toUpperCase()}
          </div>
          <div class="admin-student-info">
            <div class="admin-student-name">
              ${escapeHtml([st.first_name, st.last_name].filter(Boolean).join(" "))}
            </div>
            <div class="admin-student-username">
              ${st.phone ? escapeHtml(st.phone) : "Tel yo'q"} · ${st.username ? "@" + escapeHtml(st.username) : "ID: " + st.telegram_id}
            </div>
            <div class="admin-student-progress">
              Darslar: ${st.watched_lessons || 0} / ${st.total_lessons || 0}
            </div>
          </div>
          <div>${st.has_access ? "🟢" : "🔴"}</div>
        </div>
      `).join("")}
    </div>
  `;
}

async function openAdminStudentModal(id) {
  try {
    haptic("light");
    const data = await adminApi(`/api/admin/student/${Number(id)}`);
    const st = data.student || {};

    const fullName = [st.first_name, st.last_name].filter(Boolean).join(" ") || "O'quvchi";

    currentView = {
      html: `
        <div class="page">
          <div class="back-btn" onclick="adminSetTab('students')">← O'quvchilar ro'yxatiga qaytish</div>
          <div class="page-title">${escapeHtml(fullName)}</div>

          <div class="info-card">
            <div class="info-row">
              <span class="info-label">Telegram ID</span>
              <span class="info-val">${escapeHtml(st.telegram_id)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Telefon</span>
              <span class="info-val">${escapeHtml(st.phone || "-")}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Username</span>
              <span class="info-val">${st.username ? "@" + escapeHtml(st.username) : "-"}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Obuna holati</span>
              <span class="info-val ${st.has_access ? "ok" : "warn"}">
                ${st.has_access ? "🟢 Faol" : "🔴 Faol emas"}
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">Amal qilish muddati</span>
              <span class="info-val">${escapeHtml(fmtDate(st.access_until) || "Belgilanmagan")}</span>
            </div>
          </div>

          <div class="apple-registration-form" style="background: var(--bg-surface); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border); margin-bottom: 18px;">
            <label style="font-size: 13px; font-weight: 700; display: block; margin-bottom: 8px;">
              🗓️ Kirish muddatini belgilash / uzaytirish:
            </label>
            <input id="grant-access-date" class="apple-input" type="date" value="${st.access_until ? new Date(st.access_until).toISOString().split('T')[0] : ''}">
            <button class="btn" style="margin-top: 12px;" onclick="grantStudentAccess(${Number(st.id)})">
              ✅ Saqlash va Ruxsat berish
            </button>
          </div>
        </div>
      `
    };
    render();
  } catch (error) {
    showAlert(error.message || "O'quvchi ma'lumotlarini yuklashda xato.");
  }
}

async function grantStudentAccess(id) {
  const dateVal = document.getElementById("grant-access-date")?.value;
  if (!dateVal) return showAlert("Iltimos, sanani tanlang.");

  try {
    haptic("medium");
    await adminApi(`/api/admin/student/${Number(id)}/access`, {
      access_until: dateVal
    });
    showToast("Kirish muddati muvaffaqiyatli saqlandi!");
    adminSetTab("students");
  } catch (error) {
    showAlert(error.message || "Kirish muddatini saqlashda xato.");
  }
}

// 6-TALAB: DARSLAR QATORIDA YANGI DARS QO'SHISH YOKI BOR DARSNI TAHRIRLASH
function renderAdminLessons() {
  const modules = adminData.modules || [];

  return `
    <div class="admin-section-header">
      <div class="admin-section-title">Barcha Darslar</div>
      <button class="admin-small-btn" onclick="openAddLessonView()">➕ Yangi Dars Qo'shish</button>
    </div>

    ${modules.length ? modules.map((m, idx) => `
      <div class="admin-module-card">
        <div class="admin-module-title" style="cursor:pointer;" onclick="loadModuleLessonsForAdmin(${Number(m.id)})">
          <span>${idx + 1}. ${escapeHtml(m.title)}</span>
          <span style="font-size:12px; color:var(--accent);">Darslarni ko'rish / yashirish ↓</span>
        </div>
        <div id="admin-module-lessons-${Number(m.id)}" style="display:none;"></div>
      </div>
    `).join("") : `<div class="empty-box">Dars qo'shishdan oldin modul mavjudligiga ishonch hosil qiling.</div>`}
  `;
}

async function loadModuleLessonsForAdmin(moduleId) {
  const container = document.getElementById(`admin-module-lessons-${Number(moduleId)}`);
  if (!container) return;

  if (container.style.display === "block") {
    container.style.display = "none";
    return;
  }

  container.innerHTML = `<div style="padding:14px; text-align:center;">Darslar yuklanmoqda...</div>`;
  container.style.display = "block";

  try {
    const data = await adminApi(`/api/admin/module/${Number(moduleId)}/lessons`);
    const lessons = data.lessons || [];

    if (!lessons.length) {
      container.innerHTML = `<div class="empty-box" style="padding:16px;">Bu modulda hali darslar yo'q.</div>`;
      return;
    }

    container.innerHTML = lessons.map(l => `
      <div class="admin-lesson-card">
        <div class="admin-lesson-info">
          <span class="admin-lesson-number">#${l.order_index}</span>
          <div>
            <div class="admin-lesson-title">${escapeHtml(l.title)}</div>
            <div class="admin-lesson-meta">
              ${l.is_free ? "🟢 Namuna dars" : "🔒 Pullik"} · Fayllar: ${l.file_count || 0}
            </div>
          </div>
        </div>
        <div class="admin-lesson-actions">
          <button onclick="openEditLessonView(${Number(l.id)})" title="Tahrirlash">✏️</button>
          <button onclick="deleteAdminLesson(${Number(l.id)}, ${Number(moduleId)})" title="O'chirish">🗑️</button>
        </div>
      </div>
    `).join("");
  } catch (error) {
    container.innerHTML = `<div class="empty-box">${escapeHtml(error.message)}</div>`;
  }
}

function openAddLessonView() {
  const modules = adminData.modules || [];
  if (!modules.length) return showAlert("Avval modul mavjud bo'lishi kerak!");

  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="adminSetTab('lessons')">← Darslarga qaytish</div>
        <div class="page-title">Yangi Dars Qo'shish</div>

        <div class="admin-form">
          <div class="apple-field">
            <label>Qaysi modulga qo'shiladi? *</label>
            <select id="new-l-module" class="apple-input">
              ${modules.map(m => `<option value="${Number(m.id)}">${escapeHtml(m.title)}</option>`).join("")}
            </select>
          </div>

          <div class="apple-field">
            <label>Dars tartib raqami (nomeri) *</label>
            <input id="new-l-order" class="apple-input" type="number" placeholder="Masalan: 1">
          </div>

          <div class="apple-field">
            <label>Dars nomi *</label>
            <input id="new-l-title" class="apple-input" type="text" placeholder="Masalan: 1-Dars. Revit interfeysi">
          </div>

          <div class="apple-field">
            <label>Dars video linki (YouTube Unlisted / Embed)</label>
            <input id="new-l-yt" class="apple-input" type="url" placeholder="https://youtu.be/... yoki https://youtube.com/embed/...">
          </div>

          <div class="apple-field">
            <label>Yoki Bunny Stream Video ID (ixtiyoriy)</label>
            <input id="new-l-bunny" class="apple-input" type="text" placeholder="Video ID">
          </div>

          <!-- Darsga tegishli manba / fayl (Talab 6) -->
          <div style="background:var(--bg-surface-elevated); border:1px solid var(--border); padding:14px; border-radius:var(--radius-sm); margin-bottom:16px;">
            <div style="font-weight:700; font-size:13px; margin-bottom:8px; color:var(--accent);">
              📥 Darsga tegishli kerakli manba / fayl (ixtiyoriy):
            </div>
            <input id="new-l-filename" class="apple-input" type="text" placeholder="Fayl nomi (masalan: 1-dars_materiallari.rar)" style="margin-bottom:8px;">
            <input id="new-l-fileurl" class="apple-input" type="url" placeholder="Yuklab olish linki (Google Drive, Dropbox...)">
          </div>

          <div class="apple-field">
            <label>Dars vazifasi (amaliy topshiriq)</label>
            <textarea id="new-l-task" class="apple-input apple-textarea" placeholder="O'quvchi uchun amaliy topshiriq matni..."></textarea>
          </div>

          <div class="apple-field">
            <label>⚠️ Eslatma / Ogohlantirish matni</label>
            <textarea id="new-l-warning" class="apple-input apple-textarea" placeholder="⚠️ Ushbu darslik faqat shaxsiy foydalanish uchun omonatdir..."></textarea>
          </div>

          <label class="apple-check-row">
            <input id="new-l-free" type="checkbox">
            <div>
              <div class="apple-check-title">🟢 Namuna dars (Bepul ochiq)</div>
              <div class="apple-check-text">Ushbu darsni kursni sotib olmagan foydalanuvchilar ham ko'ra oladi</div>
            </div>
          </label>

          <button class="btn" onclick="submitCreateLesson()">
            💾 Darsni saqlash va joylash
          </button>
        </div>
      </div>
    `
  };
  render();
}

async function submitCreateLesson() {
  const moduleId = document.getElementById("new-l-module")?.value;
  const orderIndex = document.getElementById("new-l-order")?.value;
  const title = document.getElementById("new-l-title")?.value.trim();
  const ytUrl = document.getElementById("new-l-yt")?.value.trim();
  const bunnyId = document.getElementById("new-l-bunny")?.value.trim();
  const fileName = document.getElementById("new-l-filename")?.value.trim();
  const fileUrl = document.getElementById("new-l-fileurl")?.value.trim();
  const task = document.getElementById("new-l-task")?.value.trim();
  const warning = document.getElementById("new-l-warning")?.value.trim();
  const isFree = document.getElementById("new-l-free")?.checked;

  if (!moduleId || !orderIndex || !title) {
    return showAlert("Modul, tartib raqami va dars nomi kiritilishi shart!");
  }

  try {
    haptic("medium");
    await adminApi("/api/admin/lesson", {
      module_id: Number(moduleId),
      order_index: Number(orderIndex),
      title,
      youtube_url: ytUrl || null,
      bunny_video_id: bunnyId || null,
      file_name: fileName || null,
      file_url: fileUrl || null,
      task_text: task || null,
      warning_text: warning || null,
      is_free: isFree
    });

    showToast("Dars muvaffaqiyatli yaratildi!");
    adminSetTab("lessons");
  } catch (error) {
    showAlert(error.message || "Dars yaratishda xatolik.");
  }
}

// 6-TALAB: DARSNI TAHRIRLASH (Modul, dars nomi, raqami, linki, manbalar)
async function openEditLessonView(lessonId) {
  try {
    haptic("light");
    const lesson = await api(`/api/lesson/${Number(lessonId)}`);
    const filesData = await adminApi(`/api/admin/lesson/${Number(lessonId)}/files`);
    const files = filesData.files || [];
    const modules = adminData.modules || [];

    currentView = {
      html: `
        <div class="page">
          <div class="back-btn" onclick="adminSetTab('lessons')">← Darslar ro'yxatiga qaytish</div>
          <div class="page-title">Darsni tahrirlash</div>

          <div class="admin-form">
            <div class="apple-field">
              <label>Qaysi modulga tegishli?</label>
              <select id="edit-l-module" class="apple-input">
                ${modules.map(m => `
                  <option value="${Number(m.id)}" ${Number(m.id) === Number(lesson.module_id) ? "selected" : ""}>
                    ${escapeHtml(m.title)}
                  </option>
                `).join("")}
              </select>
            </div>

            <div class="apple-field">
              <label>Dars tartib raqami (nomeri) *</label>
              <input id="edit-l-order" class="apple-input" type="number" value="${Number(lesson.order_index || 1)}">
            </div>

            <div class="apple-field">
              <label>Dars nomi *</label>
              <input id="edit-l-title" class="apple-input" type="text" value="${escapeHtml(lesson.title)}">
            </div>

            <div class="apple-field">
              <label>YouTube Video Link</label>
              <input id="edit-l-yt" class="apple-input" type="url" value="${escapeHtml(lesson.youtube_url || '')}">
            </div>

            <div class="apple-field">
              <label>Bunny Stream Video ID</label>
              <input id="edit-l-bunny" class="apple-input" type="text" value="${escapeHtml(lesson.bunny_video_id || '')}">
            </div>

            <label class="apple-check-row">
              <input id="edit-l-free" type="checkbox" ${lesson.is_free ? "checked" : ""}>
              <div>
                <div class="apple-check-title">🟢 Namuna dars (Bepul ochiq)</div>
                <div class="apple-check-text">Bu dars hammaga ochiq bo'ladi</div>
              </div>
            </label>

            <div class="apple-field">
              <label>Dars vazifasi (amaliy topshiriq)</label>
              <textarea id="edit-l-task" class="apple-input apple-textarea">${escapeHtml(lesson.task_text || '')}</textarea>
            </div>

            <div class="apple-field">
              <label>⚠️ Eslatma / Ogohlantirish matni</label>
              <textarea id="edit-l-warning" class="apple-input apple-textarea">${escapeHtml(lesson.warning_text || '')}</textarea>
            </div>

            <button class="btn" onclick="submitUpdateLesson(${Number(lessonId)})">
              💾 Dars o'zgarishlarini saqlash
            </button>
          </div>

          <!-- Dars Materiallari / Manbalari boshqaruvi -->
          <div class="section-title" style="margin-top:24px;">📁 Kerakli Manbalar va Fayllar</div>
          <div class="lesson-files">
            ${files.map(f => `
              <div class="lesson-file">
                <div class="lesson-file-info">
                  <span>📄</span>
                  <span>${escapeHtml(f.file_name)}</span>
                </div>
                <button class="btn danger" style="width:auto; margin:0; padding:6px 12px; font-size:12px;" onclick="deleteLessonFile(${Number(f.id)}, ${Number(lessonId)})">
                  O'chirish 🗑️
                </button>
              </div>
            `).join("")}
          </div>

          <div class="apple-registration-form" style="background:var(--bg-surface); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border); margin-top:14px;">
            <div style="font-weight:700; font-size:13.5px; margin-bottom:10px; color:var(--accent);">
              ➕ Yangi fayl / manba biriktirish:
            </div>
            <input id="new-file-name" class="apple-input" type="text" placeholder="Fayl nomi (masalan: 2-dars_material.rar)" style="margin-bottom:8px;">
            <input id="new-file-url" class="apple-input" type="url" placeholder="Yuklab olish linki (Google Drive, Dropbox...)" style="margin-bottom:10px;">
            <button class="btn secondary" style="margin:0;" onclick="submitAddLessonFile(${Number(lessonId)})">
              📥 Faylni qo'shish
            </button>
          </div>
        </div>
      `
    };
    render();
  } catch (error) {
    showAlert(error.message || "Darsni yuklashda xato.");
  }
}

async function submitUpdateLesson(lessonId) {
  const moduleId = document.getElementById("edit-l-module")?.value;
  const orderIndex = document.getElementById("edit-l-order")?.value;
  const title = document.getElementById("edit-l-title")?.value.trim();
  const ytUrl = document.getElementById("edit-l-yt")?.value.trim();
  const bunnyId = document.getElementById("edit-l-bunny")?.value.trim();
  const isFree = document.getElementById("edit-l-free")?.checked;
  const task = document.getElementById("edit-l-task")?.value.trim();
  const warning = document.getElementById("edit-l-warning")?.value.trim();

  if (!title) return showAlert("Dars nomi majburiy!");

  try {
    haptic("medium");
    await adminApi(`/api/admin/lesson/${Number(lessonId)}/update`, {
      module_id: Number(moduleId),
      order_index: Number(orderIndex),
      title,
      youtube_url: ytUrl || null,
      bunny_video_id: bunnyId || null,
      task_text: task || null,
      warning_text: warning || null,
      is_free: isFree
    });
    showToast("Dars muvaffaqiyatli yangilandi!");
    adminSetTab("lessons");
  } catch (error) {
    showAlert(error.message || "Darsni yangilashda xatolik.");
  }
}

function deleteAdminLesson(lessonId, moduleId) {
  showConfirm(
    "Dars o'chirilsinmi?",
    "Ushbu dars va unga tegishli barcha materiallar butunlay o'chiriladi.",
    "Ha, o'chirish",
    async () => {
      await adminApi(`/api/admin/lesson/${Number(lessonId)}/delete`);
      showToast("Dars o'chirildi!");
      loadModuleLessonsForAdmin(moduleId);
    }
  );
}

async function submitAddLessonFile(lessonId) {
  const name = document.getElementById("new-file-name")?.value.trim();
  const url = document.getElementById("new-file-url")?.value.trim();
  if (!name || !url) return showAlert("Fayl nomi va yuklab olish linki kiritilishi shart!");

  try {
    haptic("medium");
    await adminApi(`/api/admin/lesson/${Number(lessonId)}/files/add`, {
      file_name: name,
      file_url: url
    });
    showToast("Material muvaffaqiyatli biriktirildi!");
    openEditLessonView(lessonId);
  } catch (error) {
    showAlert(error.message || "Fayl qo'shishda xato.");
  }
}

async function deleteLessonFile(fileId, lessonId) {
  showConfirm(
    "Fayl o'chirilsinmi?",
    "Ushbu manba darsdan olib tashlanadi.",
    "O'chirish",
    async () => {
      await adminApi(`/api/admin/file/${Number(fileId)}/delete`);
      showToast("Material o'chirildi!");
      openEditLessonView(lessonId);
    }
  );
}

// Admin Admins
function renderAdminAdmins() {
  const admins = adminData.admins || [];

  return `
    <div class="admin-section-header">
      <div class="admin-section-title">Adminlar Tizimi (${admins.length})</div>
      <button class="admin-small-btn" onclick="openAddAdminModal()">➕ Admin Qo'shish</button>
    </div>

    <div class="admin-list">
      ${admins.map(adm => `
        <div class="admin-student-card" style="cursor:default;">
          <div class="admin-student-avatar" style="background:var(--accent); color:#fff;">👑</div>
          <div class="admin-student-info">
            <div class="admin-student-name">${escapeHtml(adm.first_name || "Admin")}</div>
            <div class="admin-student-username">Telegram ID: ${escapeHtml(adm.telegram_id)}</div>
            <div class="admin-student-progress" style="color:var(--accent); font-weight:700;">
              Rol: ${adm.role === "super_admin" ? "Super Admin" : "Admin"}
            </div>
          </div>
          ${adm.id ? `
            <button class="btn danger" style="width:auto; margin:0; padding:6px 12px; font-size:12px;" onclick="deleteAdmin(${Number(adm.id)})">
              O'chirish
            </button>
          ` : `<span style="font-size:12px; color:var(--text-muted);">Asosiy</span>`}
        </div>
      `).join("")}
    </div>
  `;
}

function openAddAdminModal() {
  const tgId = prompt("Yangi adminning Telegram ID sini kiriting (faqat raqamlar):");
  if (!tgId || !tgId.trim()) return;

  if (!/^\d+$/.test(tgId.trim())) return showAlert("Telegram ID faqat raqamlardan iborat bo'lishi kerak!");

  const name = prompt("Admin ismini kiriting:", "Admin");
  const isSuper = confirm("Ushbu adminga Super Admin huquqi berilsinmi?");

  adminApi("/api/admin/admins/add", {
    telegram_id: tgId.trim(),
    first_name: (name || "Admin").trim(),
    role: isSuper ? "super_admin" : "admin"
  }).then(() => {
    showToast("Admin muvaffaqiyatli qo'shildi!");
    adminSetTab("admins");
  }).catch(err => showAlert(err.message));
}

function deleteAdmin(adminId) {
  showConfirm(
    "Admin huquqi bekor qilinsinmi?",
    "Ushbu foydalanuvchi admin paneldan chiqarib yuboriladi.",
    "Ha, o'chirish",
    async () => {
      await adminApi(`/api/admin/admins/${Number(adminId)}/delete`);
      showToast("Admin o'chirildi!");
      adminSetTab("admins");
    }
  );
}

// ======================================================
// CORE NAVIGATION & RENDER
// ======================================================

function renderNav() {
  const tabs = [
    { id: "home", label: "Bosh sahifa", icon: "⌂" },
    { id: "lessons", label: "Darslar", icon: "▤" },
    { id: "tasks", label: "Vazifalar", icon: "✎" },
    { id: "chat", label: "Chat", icon: "◈" },
    { id: "profile", label: "Profil", icon: "◍" }
  ];

  return `
    <div class="nav">
      ${tabs.map(t => `
        <div class="nav-item ${activeTab === t.id ? "active" : ""}" onclick="setTab('${t.id}')">
          <div class="nav-icon">${t.icon}</div>
          <div class="nav-label">${t.label}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function setTab(id) {
  haptic("light");
  activeTab = id;
  currentView = null;
  render();
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function closeDetail() {
  haptic("light");
  currentView = null;
  render();
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function renderTab() {
  switch (activeTab) {
    case "home": return renderHome();
    case "lessons": return renderLessons();
    case "tasks": return renderTasks();
    case "chat": return renderChat();
    case "profile": return renderProfile();
    default: return renderHome();
  }
}

function render() {
  if (!app) return;
  const body = currentView ? currentView.html : renderTab();
  app.innerHTML = `
    <div class="screen">
      ${body}
    </div>
    ${!currentView ? renderNav() : ""}
  `;
}

// ======================================================
// APPLICATION INITIALIZATION
// ======================================================

(async () => {
  try {
    await loadAuth();
    if (!state.registered && !state.is_admin) {
      renderRegistration();
      return;
    }
    await loadContent();
  } catch (error) {
    console.error("APP START ERROR:", error);
    if (app) {
      app.innerHTML = `
        <div class="page" style="padding-top: 60px; text-align: center;">
          <div class="splash-logo" style="margin: 0 auto 16px;">!</div>
          <h3>Bog'lanishda xatolik</h3>
          <p style="color: var(--text-secondary); margin: 10px 0 20px;">
            ${escapeHtml(error.message || "Mini App faqat Telegram ichida ishlaydi.")}
          </p>
          <button class="btn" style="max-width: 240px; margin: 0 auto;" onclick="location.reload()">
            🔄 Qayta yuklash
          </button>
        </div>
      `;
    }
  }
})();
