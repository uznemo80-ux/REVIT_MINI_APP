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

// Har bir qurilma uchun doimiy identifikator (bitta hisob = bitta faol qurilma nazorati uchun)
function getDeviceId() {
  try {
    let id = localStorage.getItem("revit_device_id");
    if (!id) {
      id = (crypto.randomUUID ? crypto.randomUUID() : "dev-" + Date.now() + "-" + Math.random().toString(16).slice(2));
      localStorage.setItem("revit_device_id", id);
    }
    return id;
  } catch (e) {
    return "dev-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  }
}
const deviceId = getDeviceId();

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

// Narx maydonlari uchun: faqat raqam qoldiradi va har 3 xonadan keyin bo'shliq qo'yadi (1500000 -> 1 500 000)
function formatPriceInput(el) {
  const digits = el.value.replace(/\D/g, "").slice(0, 12);
  el.value = digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function extractPriceDigits(rawValue) {
  return String(rawValue || "").replace(/\D/g, "");
}

function formatPriceDigitsForDisplay(rawValue) {
  const digits = extractPriceDigits(rawValue);
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Fayl nomi kengaytmasiga qarab mos ikonka qaytaradi (resurs kartalarida)
function getResourceIcon(fileName) {
  const ext = String(fileName || "").split(".").pop().toLowerCase();
  const map = {
    rvt: "📐", rfa: "📐", rte: "📐",
    pdf: "📄",
    dwg: "📐", dxf: "📐",
    zip: "📦", rar: "📦", "7z": "📦",
    xlsx: "📊", xls: "📊", csv: "📊",
    doc: "📃", docx: "📃",
    jpg: "🖼️", jpeg: "🖼️", png: "🖼️"
  };
  return map[ext] || "📁";
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

  const closeOverlay = () => {
    overlay.classList.add("closing");
    setTimeout(() => overlay.remove(), 180);
  };

  overlay.querySelector(".cancel")?.addEventListener("click", () => {
    haptic();
    closeOverlay();
  });

  overlay.querySelector(".confirm")?.addEventListener("click", async () => {
    haptic("medium");
    closeOverlay();
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
let courseModulesData = null;
let courseSearchQuery = "";
let selectedCourseCategory = "Barchasi";
const COURSE_CATEGORIES = ["Revit", "AutoCAD", "3ds Max", "BIM", "Interyer", "Arxitektura", "Boshqa"];
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
      device_id: deviceId,
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

      ${state.last_lesson ? `
        <div class="section-title">Davom ettirish</div>
        <div class="continue-card" onclick="resumeLastLesson()">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:11.5px; color:var(--text-secondary); font-weight:650; margin-bottom:4px;">
                ${escapeHtml(state.last_lesson.course_title || "")} · ${escapeHtml(state.last_lesson.module_title || "")}
              </div>
              <div style="font-weight:750; font-size:15px;">${escapeHtml(state.last_lesson.lesson_title || "")}</div>
            </div>
            <div style="font-size:22px;">▶</div>
          </div>
        </div>
      ` : ""}

      <div class="section-title">
        <span>Mavjud Kurslar</span>
        <span style="font-size:13px; color:var(--accent); cursor:pointer;" onclick="setTab('lessons')">Barchasi →</span>
      </div>

      ${(state.courses || []).slice(0, 3).map(course => `
        <div class="course-card" onclick="openCourseCatalog(${Number(course.id)})">
          <div class="course-card-header">
            ${course.cover_url ? `<img src="${escapeHtml(course.cover_url)}" style="width:100%; height:100%; object-fit:cover;" />` : ""}
            <div class="course-banner-text" style="${course.cover_url ? 'background:rgba(0,0,0,0.5);' : ''}">
              <h3>${escapeHtml(course.title)}</h3>
              <p>${escapeHtml(course.subtitle || '')}</p>
            </div>
          </div>
          <div class="course-body">
            <div class="course-title">${escapeHtml(course.title)}</div>
            <div class="course-meta">
              <span>📚 ${course.total_modules || 0} Modul</span>
              <span>🎬 ${course.total_lessons || 0} Dars</span>
            </div>
            <div class="course-price-wrap">
              ${renderCoursePriceBlock(course)}
              <button class="btn" style="width: auto; margin-bottom: 0; padding: 10px 20px;" onclick="event.stopPropagation(); setTab('chat')">
                ${state.has_access ? "Kirish faol ✅" : "Sotib olish 💳"}
              </button>
            </div>
          </div>
        </div>
      `).join("") || `<div class="empty-box">Hozircha kurslar mavjud emas.</div>`}

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

function renderCoursePriceBlock(course) {
  if (course.is_discount_active && course.discount_price) {
    return `
      <div>
        <div style="display:flex; align-items:baseline; gap:8px;">
          <div class="course-price" style="color:var(--danger);">${escapeHtml(course.discount_price)}</div>
          <div style="font-size:13px; color:var(--text-secondary); text-decoration:line-through;">${escapeHtml(course.original_price || course.price || '')}</div>
        </div>
        <div class="discount-countdown" data-until="${escapeHtml(course.discount_until || '')}" style="font-size:11px; color:var(--danger); font-weight:700;">🔥 Hisoblanmoqda...</div>
      </div>
    `;
  }
  return `<div class="course-price">${escapeHtml(course.price || '')}</div>`;
}

// Kurslar ro'yxati va Admin uchun "Yangi Kurs Qo'shish" (Talab 3)
function renderCoursesList() {
  const allCourses = state.courses && state.courses.length ? state.courses : [
    {
      id: 1,
      title: "INTPRO — Revit dasturida interyer loyihalash",
      subtitle: "Interyer Loyihalash & BIM Modellashtirish",
      price: "1 500 000 so'm",
      category: "Revit",
      total_modules: 11,
      total_lessons: 140,
      status: "active",
      release_date: "Faol kurs",
      cover_url: ""
    }
  ];

  const q = courseSearchQuery.trim().toLowerCase();
  const coursesList = allCourses.filter(c => {
    const courseCats = Array.isArray(c.categories) && c.categories.length ? c.categories : [c.category || "Boshqa"];
    const matchesCategory = selectedCourseCategory === "Barchasi" || courseCats.includes(selectedCourseCategory);
    const matchesSearch = !q || (c.title || "").toLowerCase().includes(q) || (c.subtitle || "").toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const categoryChips = ["Barchasi", ...COURSE_CATEGORIES];

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

      <input
        class="apple-input"
        style="margin-bottom:12px;"
        type="text"
        placeholder="🔍 Kurs qidirish..."
        value="${escapeHtml(courseSearchQuery)}"
        oninput="setCourseSearch(this.value)"
      >

      <div class="category-chips" style="display:flex; gap:8px; overflow-x:auto; margin-bottom:16px; padding-bottom:4px;">
        ${categoryChips.map(cat => `
          <div class="chip ${selectedCourseCategory === cat ? "active" : ""}" onclick="setCourseCategory('${escapeJsString(cat)}')">
            ${escapeHtml(cat)}
          </div>
        `).join("")}
      </div>

      ${coursesList.length ? coursesList.map(course => `
        <div class="course-card" onclick="openCourseCatalog(${Number(course.id)})" style="cursor:pointer; position:relative;">
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
                ${course.is_discount_active && course.discount_price ? `
                  <span style="color:var(--danger);">${escapeHtml(course.discount_price)}</span>
                  <span style="font-size:12px; color:var(--text-secondary); text-decoration:line-through; margin-left:4px;">${escapeHtml(course.original_price || course.price || '')}</span>
                ` : escapeHtml(course.price || '')}
              </div>
            </div>
            ${course.is_discount_active && course.discount_until ? `
              <div class="discount-countdown" data-until="${escapeHtml(course.discount_until)}" style="font-size:11px; color:var(--danger); font-weight:700; margin-bottom:8px;">
                🔥 Hisoblanmoqda...
              </div>
            ` : ""}
            <div class="course-meta" style="margin-bottom:12px;">
              <span>🏷️ ${escapeHtml((Array.isArray(course.categories) && course.categories.length ? course.categories : [course.category || 'Boshqa']).join(', '))}</span>
              <span>📚 ${course.total_modules || 0} Modul</span>
              <span>🎬 ${course.total_lessons || 0} Dars</span>
              ${course.release_date ? `<span>⏱️ ${escapeHtml(course.release_date)}</span>` : ""}
            </div>
            <button class="btn" style="margin-bottom:0; padding:10px 16px;">
              ${course.status === 'active' ? 'Darslarni ochish →' : 'Tez kunda chiqadi ⏳'}
            </button>
          </div>
        </div>
      `).join("") : `<div class="empty-box">Hech narsa topilmadi. Boshqa so'z yoki kategoriya bilan sinab ko'ring.</div>`}
    </div>
  `;
}

function setCourseSearch(value) {
  courseSearchQuery = value;
  render();
}

function setCourseCategory(cat) {
  haptic("light");
  selectedCourseCategory = cat;
  render();
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
            <label>Kurs narxi (so'mda, faqat raqam)</label>
            <input id="c-price" class="apple-input" placeholder="1 500 000" type="text" inputmode="numeric" oninput="formatPriceInput(this)">
          </div>
          <div class="apple-field">
            <label>Chegirma narxi (ixtiyoriy, faqat raqam)</label>
            <input id="c-discount-price" class="apple-input" placeholder="990 000" type="text" inputmode="numeric" oninput="formatPriceInput(this)">
          </div>
          <div class="apple-field">
            <label>Chegirma qachongacha (ixtiyoriy)</label>
            <input id="c-discount-until" class="apple-input" type="date">
          </div>
          <div class="apple-field">
            <label>Kategoriyalar (bir nechtasini tanlash mumkin)</label>
            <div class="category-checkbox-group">
              ${COURSE_CATEGORIES.map(cat => `
                <label class="category-checkbox">
                  <input type="checkbox" name="c-category-cb" value="${escapeHtml(cat)}">
                  <span>${escapeHtml(cat)}</span>
                </label>
              `).join("")}
            </div>
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
  const priceDigits = document.getElementById("c-price")?.value.trim();
  const discountPriceDigits = document.getElementById("c-discount-price")?.value.trim();
  const discountUntil = document.getElementById("c-discount-until")?.value;
  const category = Array.from(document.querySelectorAll('input[name="c-category-cb"]:checked')).map(el => el.value);
  const mod = document.getElementById("c-mod")?.value;
  const less = document.getElementById("c-less")?.value;
  const rel = document.getElementById("c-rel")?.value.trim();
  const cover = document.getElementById("c-cover")?.value.trim();

  if (!title) return showAlert("Kurs nomi kiritilishi shart!");

  const price = priceDigits ? `${priceDigits} so'm` : "";
  const discountPrice = discountPriceDigits ? `${discountPriceDigits} so'm` : "";

  try {
    haptic("medium");
    await adminApi("/api/admin/courses/add", {
      title,
      subtitle: sub,
      price,
      discount_price: discountPrice || null,
      discount_until: discountUntil || null,
      categories: category,
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
            <label>Kurs narxi (so'mda, faqat raqam)</label>
            <input id="ec-price" class="apple-input" value="${formatPriceDigitsForDisplay(course.price)}" type="text" inputmode="numeric" oninput="formatPriceInput(this)">
          </div>
          <div class="apple-field">
            <label>Chegirma narxi (ixtiyoriy, bo'sh qoldirsangiz chegirma o'chadi)</label>
            <input id="ec-discount-price" class="apple-input" value="${formatPriceDigitsForDisplay(course.discount_price)}" placeholder="990 000" type="text" inputmode="numeric" oninput="formatPriceInput(this)">
          </div>
          <div class="apple-field">
            <label>Chegirma qachongacha</label>
            <input id="ec-discount-until" class="apple-input" type="date" value="${course.discount_until ? new Date(course.discount_until).toISOString().split('T')[0] : ''}">
          </div>
          <div class="apple-field">
            <label>Kategoriyalar (bir nechtasini tanlash mumkin)</label>
            <div class="category-checkbox-group">
              ${COURSE_CATEGORIES.map(cat => {
                const isChecked = Array.isArray(course.categories) ? course.categories.includes(cat) : course.category === cat;
                return `
                  <label class="category-checkbox">
                    <input type="checkbox" name="ec-category-cb" value="${escapeHtml(cat)}" ${isChecked ? "checked" : ""}>
                    <span>${escapeHtml(cat)}</span>
                  </label>
                `;
              }).join("")}
            </div>
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
  const priceDigits = document.getElementById("ec-price")?.value.trim();
  const discountPriceDigits = document.getElementById("ec-discount-price")?.value.trim();
  const discountUntil = document.getElementById("ec-discount-until")?.value;
  const category = Array.from(document.querySelectorAll('input[name="ec-category-cb"]:checked')).map(el => el.value);
  const mod = document.getElementById("ec-mod")?.value;
  const less = document.getElementById("ec-less")?.value;
  const rel = document.getElementById("ec-rel")?.value.trim();
  const cover = document.getElementById("ec-cover")?.value.trim();

  if (!title) return showAlert("Kurs nomi majburiy!");

  const price = priceDigits ? `${priceDigits} so'm` : "";
  const discountPrice = discountPriceDigits ? `${discountPriceDigits} so'm` : "";

  try {
    haptic("medium");
    await adminApi(`/api/admin/courses/${Number(id)}/update`, {
      title,
      subtitle: sub,
      price,
      discount_price: discountPrice || null,
      discount_until: discountUntil || null,
      categories: category,
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

function goToCourseManagement() {
  haptic("light");
  selectedCourseId = null;
  courseModulesData = null;
  activeTab = "lessons";
  currentView = null;
  render();
}

async function openCourseCatalog(courseId) {
  haptic("light");
  if (Number(courseId) !== Number(selectedCourseId)) {
    expandedModuleIds = new Set();
  }
  selectedCourseId = Number(courseId);
  activeTab = "lessons";
  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="backToCoursesList()">← Kurslar katalogiga qaytish</div>
        <div class="loading-state" style="padding:60px 0; text-align:center;">
          <div class="spinner"></div>
          <div>Modullar yuklanmoqda...</div>
        </div>
      </div>
    `
  };
  render();

  try {
    const data = await api(`/api/course/${Number(courseId)}/modules`);
    courseModulesData = data;
    currentView = null;
    render();
  } catch (error) {
    showAlert(error.message || "Kurs modullarini yuklashda xatolik.");
    backToCoursesList();
  }
}

function backToCoursesList() {
  haptic("light");
  selectedCourseId = null;
  courseModulesData = null;
  expandedModuleIds = new Set();
  currentView = null;
  render();
}

async function reloadCourseModules() {
  if (!selectedCourseId) return;
  try {
    const data = await api(`/api/course/${Number(selectedCourseId)}/modules`);
    courseModulesData = data;
    render();
  } catch (error) {
    showAlert(error.message || "Yangilashda xatolik.");
  }
}

function renderCourseModules() {
  if (!courseModulesData) {
    return `<div class="page"><div class="loading-state" style="padding:60px 0; text-align:center;"><div class="spinner"></div></div></div>`;
  }

  const course = courseModulesData.course || {};
  const modules = Array.isArray(courseModulesData.modules) ? courseModulesData.modules : [];

  let html = `
    <div class="page">
      <div class="back-btn" onclick="backToCoursesList()">← Kurslar katalogiga qaytish</div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; gap:10px;">
        <div class="page-title" style="margin-bottom:0;">${escapeHtml(course.title || "Kurs")}</div>
      </div>
      <p style="color:var(--text-secondary); font-size:13px; margin-bottom:14px;">
        ${modules.length} ta modul · Kerakli modulni tanlang va darslarni boshlang:
      </p>

      ${state.is_admin ? `
        <button class="admin-small-btn" style="margin-bottom:16px;" onclick="openAddModuleModal(${Number(course.id)})">
          ➕ Yangi Modul Qo'shish
        </button>
      ` : ""}
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
            <div style="display:flex; align-items:center; gap:8px;">
              ${state.is_admin ? `
                <button class="admin-small-btn" style="padding:4px 8px; font-size:11px;" onclick="event.stopPropagation(); openEditModuleModal(${Number(mod.id)})">✏️</button>
                <button class="admin-small-btn" style="padding:4px 8px; font-size:11px; background:rgba(235,59,59,0.8);" onclick="event.stopPropagation(); deleteModuleConfirm(${Number(mod.id)})">🗑️</button>
              ` : ""}
              <div class="tag ${mod.unlocked ? "" : "locked-tag"}">
                ${mod.unlocked ? "Ochiq" : "🔒 Qulflangan"}
              </div>
              <span class="module-chevron">⌄</span>
            </div>
          </div>

          <div class="lesson-list ${expandedModuleIds.has(Number(mod.id)) ? "open" : ""}" id="mod-${Number(mod.id)}">
            ${lessons.length ? lessons.map(lesson => `
              <div class="lesson ${lesson.available ? "" : "disabled"}" onclick="${lesson.available ? `openLesson(${Number(lesson.id)})` : `showLockedInfo()`}">
                <div class="lesson-left">
                  <span class="lesson-status-icon">${lesson.watched ? "✅" : (lesson.available ? "▶" : "🔒")}</span>
                  <span>${escapeHtml(lesson.title)}</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                  ${lesson.is_free ? `<span class="free-badge">Namuna</span>` : ""}
                  ${state.is_admin ? `<button class="admin-small-btn" style="padding:3px 7px; font-size:10.5px;" onclick="event.stopPropagation(); openEditLessonView(${Number(lesson.id)})">✏️</button>` : ""}
                </div>
              </div>
            `).join("") : `<div class="empty-box">Bu modulda darslar hali yuklanmagan.</div>`}

            <div style="padding: 12px 18px; border-top: 1px solid var(--border); display:flex; flex-direction:column; gap:8px;">
              ${state.is_admin ? `
                <button class="btn secondary" style="margin-bottom: 0; padding: 10px;" onclick="event.stopPropagation(); openAddLessonView(${Number(mod.id)})">
                  ➕ Dars Qo'shish
                </button>
              ` : ""}
              ${mod.has_test && (state.has_access || state.is_admin) ? `
                <div style="font-size:12px; color:${mod.test_passed ? "var(--success)" : "var(--text-secondary)"}; text-align:center;">
                  ${mod.test_passed ? "✅ Test topshirilgan — keyingi modul ochiq" : "⚠️ Keyingi modulga o'tish uchun testdan 65%+ ball kerak"}
                </div>
              ` : ""}
              ${state.has_access || state.is_admin ? `
                <button class="btn secondary" style="margin-bottom: 0; padding: 10px;" onclick="event.stopPropagation(); openTest(${Number(mod.id)})">
                  📝 Modul bo'yicha test topshirish
                </button>
              ` : `
                <div style="font-size:12px; color:var(--text-secondary); text-align:center; padding:6px 0;">
                  🔒 Testlar faqat kursga kirish huquqi bor o'quvchilar uchun
                </div>
              `}
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

// ==== MODUL QO'SHISH / TAHRIRLASH / O'CHIRISH ====

function openAddModuleModal(courseId) {
  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="closeDetail()">← Ortga qaytish</div>
        <div class="page-title">Yangi Modul Qo'shish</div>
        <div class="admin-form">
          <div class="apple-field">
            <label>Modul nomi *</label>
            <input id="new-mod-title" class="apple-input" type="text" placeholder="Masalan: 1-Modul. Revit asoslari">
          </div>
          <div class="apple-field">
            <label>Modul tavsifi (ixtiyoriy)</label>
            <textarea id="new-mod-desc" class="apple-input apple-textarea" placeholder="Qisqacha izoh..."></textarea>
          </div>
          <button class="btn" onclick="submitCreateModule(${Number(courseId)})">
            💾 Modulni saqlash
          </button>
        </div>
      </div>
    `
  };
  render();
}

async function submitCreateModule(courseId) {
  const title = document.getElementById("new-mod-title")?.value.trim();
  const description = document.getElementById("new-mod-desc")?.value.trim();
  if (!title) return showAlert("Modul nomi kiritilishi shart!");

  try {
    haptic("medium");
    await adminApi("/api/admin/modules/add", {
      course_id: Number(courseId),
      title,
      description: description || null
    });
    showToast("Modul muvaffaqiyatli qo'shildi!");
    currentView = null;
    await reloadCourseModules();
  } catch (error) {
    showAlert(error.message || "Modul qo'shishda xatolik.");
  }
}

function openEditModuleModal(moduleId) {
  const modules = (courseModulesData && courseModulesData.modules) || [];
  const mod = modules.find(m => Number(m.id) === Number(moduleId));
  if (!mod) return showAlert("Modul topilmadi.");

  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="closeDetail()">← Ortga qaytish</div>
        <div class="page-title">Modulni Tahrirlash</div>
        <div class="admin-form">
          <div class="apple-field">
            <label>Modul nomi *</label>
            <input id="edit-mod-title" class="apple-input" type="text" value="${escapeHtml(mod.title)}">
          </div>
          <div class="apple-field">
            <label>Tartib raqami *</label>
            <input id="edit-mod-order" class="apple-input" type="number" value="${Number(mod.order_index || 1)}">
          </div>
          <button class="btn" onclick="submitUpdateModule(${Number(moduleId)})">
            💾 O'zgarishlarni saqlash
          </button>
        </div>
      </div>
    `
  };
  render();
}

async function submitUpdateModule(moduleId) {
  const title = document.getElementById("edit-mod-title")?.value.trim();
  const orderIndex = document.getElementById("edit-mod-order")?.value;
  if (!title) return showAlert("Modul nomi kiritilishi shart!");

  try {
    haptic("medium");
    await adminApi(`/api/admin/modules/${Number(moduleId)}/update`, {
      title,
      order_index: Number(orderIndex)
    });
    showToast("Modul yangilandi!");
    currentView = null;
    await reloadCourseModules();
  } catch (error) {
    showAlert(error.message || "Modulni yangilashda xatolik.");
  }
}

function deleteModuleConfirm(moduleId) {
  showConfirm(
    "Modul o'chirilsinmi?",
    "Ushbu modul va undagi barcha darslar butunlay o'chiriladi.",
    "Ha, o'chirish",
    async () => {
      await adminApi(`/api/admin/modules/${Number(moduleId)}/delete`);
      showToast("Modul o'chirildi!");
      await reloadCourseModules();
    }
  );
}

let expandedModuleIds = new Set();

function toggleModule(id) {
  haptic("light");
  const numId = Number(id);
  if (expandedModuleIds.has(numId)) {
    expandedModuleIds.delete(numId);
  } else {
    expandedModuleIds.add(numId);
  }
  const el = document.getElementById(`mod-${numId}`);
  if (el) el.classList.toggle("open");
}

function showLockedInfo() {
  haptic();
  showAlert("Ushbu dars qulflangan. Kursga to'liq kirish uchun 'Chat' bo'limi orqali adminga murojaat qiling.");
}

// ======================================================
// LESSON DETAIL
// ======================================================

async function resumeLastLesson() {
  if (!state.last_lesson) return;
  const courseId = state.last_lesson.course_id;
  if (courseId) {
    selectedCourseId = Number(courseId);
    activeTab = "lessons";
    try {
      const data = await api(`/api/course/${Number(courseId)}/modules`);
      courseModulesData = data;
    } catch (error) {
      // sokin xato — baribir darsni ochishga urinamiz
    }
  }
  openLesson(state.last_lesson.lesson_id);
}

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

    const currentCourse = (state.courses || []).find(c => Number(c.id) === Number(selectedCourseId));
    const currentModuleData = courseModulesData && Array.isArray(courseModulesData.modules)
      ? courseModulesData.modules.find(m => (m.lessons || []).some(l => Number(l.id) === Number(lesson.id)))
      : null;

    if (currentModuleData) {
      expandedModuleIds.add(Number(currentModuleData.id));
    }

    state.last_lesson = {
      lesson_id: lesson.id,
      lesson_title: lesson.title,
      module_title: currentModuleData ? currentModuleData.title : (state.last_lesson?.module_title || null),
      course_id: selectedCourseId || state.last_lesson?.course_id || null,
      course_title: currentCourse ? currentCourse.title : (state.last_lesson?.course_title || null)
    };

    const watermarkText = `${state.first_name || ""} · ID ${escapeHtml(String(state.telegram_id || ""))}`.trim();
    const watermarkHtml = `
      <div class="video-watermark">
        <span>${watermarkText}</span>
        <span>${watermarkText}</span>
      </div>
    `;

    let videoHtml = "";
    if (lesson.youtube_player_url) {
      videoHtml = `
        <div class="video-container">
          <iframe src="${escapeHtml(lesson.youtube_player_url)}" title="${escapeHtml(lesson.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          ${watermarkHtml}
        </div>
      `;
    } else if (lesson.bunny_player_url) {
      videoHtml = `
        <div class="video-container">
          <iframe src="${escapeHtml(lesson.bunny_player_url)}" title="${escapeHtml(lesson.title)}" allowfullscreen></iframe>
          ${watermarkHtml}
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
              ${renderPracticeBox(lesson.id, lesson.my_submission)}
            ` : ""}

            ${renderLessonFiles(lesson.files)}
            ${renderLessonWarning(lesson.warning_text)}

            <button class="btn" style="margin-top: 18px; ${lesson.watched ? 'opacity:0.6;' : ''}" onclick="${lesson.watched ? '' : `markLessonWatched(${Number(lesson.id)})`}">
              ${lesson.watched ? "✅ Tugallangan" : "✅ Darsni tugatdim, keyingisiga o'tish"}
            </button>

            ${renderLessonNavButtons(lesson.id)}

            <button class="btn secondary" style="margin-top: 10px;" onclick="openLessonDrawer(${Number(lesson.id)})">
              📚 Darslar ro'yxati
            </button>

            <button class="btn secondary" style="margin-top: 10px;" onclick="closeDetail()">
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

const PRACTICE_STATUS_META = {
  submitted: { label: "🕓 Tekshirilmoqda", cls: "" },
  approved: { label: "✅ Qabul qilindi", cls: "passed" },
  needs_revision: { label: "🔁 Qayta ishlash kerak", cls: "locked-tag" }
};

function renderPracticeBox(lessonId, submission) {
  if (!submission) {
    return `
      <div class="task-box" style="margin-top:12px;">
        <div class="task-box-title">📤 Vazifani Topshirish</div>
        <div class="apple-field" style="margin-top:10px;">
          <label>Ishingiz linki (Google Drive, Dropbox...) *</label>
          <input id="practice-url-${Number(lessonId)}" class="apple-input" type="url" placeholder="https://drive.google.com/...">
        </div>
        <div class="apple-field">
          <label>Izoh (ixtiyoriy)</label>
          <textarea id="practice-comment-${Number(lessonId)}" class="apple-input apple-textarea" placeholder="Qo'shimcha izoh..."></textarea>
        </div>
        <button class="btn secondary" style="margin-bottom:0;" onclick="submitPractice(${Number(lessonId)})">
          📤 Vazifani yuborish
        </button>
      </div>
    `;
  }

  const meta = PRACTICE_STATUS_META[submission.status] || PRACTICE_STATUS_META.submitted;
  const canResubmit = submission.status !== "approved";

  return `
    <div class="task-box" style="margin-top:12px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <div class="task-box-title" style="margin:0;">📤 Sizning Topshiriqingiz</div>
        <div class="tag ${meta.cls}">${meta.label}</div>
      </div>
      <div style="font-size:13.5px; margin-bottom:6px;">
        🔗 <a href="${escapeHtml(submission.submission_url)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent);">${escapeHtml(submission.submission_url)}</a>
      </div>
      ${submission.comment ? `<div style="font-size:13px; color:var(--text-secondary); margin-bottom:6px;">💬 ${escapeHtml(submission.comment)}</div>` : ""}
      ${submission.admin_comment ? `<div style="font-size:13px; color:var(--accent); margin-top:8px; padding-top:8px; border-top:1px solid var(--border);">👨‍🏫 Admin izohi: ${escapeHtml(submission.admin_comment)}</div>` : ""}

      ${canResubmit ? `
        <div style="margin-top:14px; padding-top:14px; border-top:1px solid var(--border);">
          <div class="apple-field">
            <label>Qayta topshirish (yangi link)</label>
            <input id="practice-url-${Number(lessonId)}" class="apple-input" type="url" placeholder="https://drive.google.com/...">
          </div>
          <div class="apple-field">
            <label>Izoh (ixtiyoriy)</label>
            <textarea id="practice-comment-${Number(lessonId)}" class="apple-input apple-textarea" placeholder="Qo'shimcha izoh..."></textarea>
          </div>
          <button class="btn secondary" style="margin-bottom:0;" onclick="submitPractice(${Number(lessonId)})">
            🔁 Qayta yuborish
          </button>
        </div>
      ` : ""}
    </div>
  `;
}

async function submitPractice(lessonId) {
  const urlInput = document.getElementById(`practice-url-${Number(lessonId)}`);
  const commentInput = document.getElementById(`practice-comment-${Number(lessonId)}`);
  const url = urlInput?.value.trim();
  const comment = commentInput?.value.trim();

  if (!url) return showAlert("Ishingiz linkini kiriting!");

  try {
    haptic("medium");
    await api(`/api/practice/${Number(lessonId)}/submit`, {
      submission_url: url,
      comment: comment || ""
    });
    showToast("Vazifa muvaffaqiyatli yuborildi!");
    openLesson(lessonId);
  } catch (error) {
    showAlert(error.message || "Vazifani yuborishda xatolik.");
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
              <span class="lesson-file-icon">${getResourceIcon(f.file_name)}</span>
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
  const courses = state.courses || [];

  if (!selectedCourseId || !courseModulesData) {
    return `
      <div class="page">
        <div class="page-title">Vazifalar va Testlar</div>
        <p style="color:var(--text-secondary); margin-bottom:14px; font-size:13px;">
          Avval qaysi kurs bo'yicha vazifa va testlarni ko'rmoqchi ekaningizni tanlang:
        </p>
        <select class="apple-input" style="margin-bottom:14px;" onchange="selectTasksCourse(this.value)">
          <option value="">— Kursni tanlang —</option>
          ${courses.map(c => `<option value="${Number(c.id)}">${escapeHtml(c.title)}</option>`).join("")}
        </select>
      </div>
    `;
  }

  const course = courseModulesData.course || {};
  const modules = Array.isArray(courseModulesData.modules) ? courseModulesData.modules : [];

  return `
    <div class="page">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <div class="page-title" style="margin-bottom:0;">Vazifalar va Testlar</div>
        ${state.is_admin ? `
          <button class="admin-small-btn" onclick="openAddTestModal()">
            ➕ Test Qo'shish
          </button>
        ` : ""}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
        <p style="color:var(--text-secondary); font-size:13px; margin:0;">
          ${escapeHtml(course.title || "")}
        </p>
        <div class="chip" onclick="selectedCourseId = null; courseModulesData = null; render();">
          🔄 Boshqa kurs
        </div>
      </div>

      ${modules.length ? modules.map((mod, idx) => {
        const tasks = (mod.lessons || []).filter(l => l.task_text && l.task_text.trim());

        return `
          <div class="card" style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid var(--border); padding-bottom:10px;">
              <div>
                <span class="idx">${String(idx + 1).padStart(2, "0")}</span>
                <span style="font-weight:750; font-size:15px; margin-left:6px;">${escapeHtml(mod.title)}</span>
              </div>
              ${state.has_access || state.is_admin ? `
                <button class="admin-small-btn" style="padding:6px 12px; font-size:11.5px;" onclick="openTest(${Number(mod.id)})">
                  📝 Test Topshirish
                </button>
              ` : `
                <span style="font-size:11px; color:var(--text-secondary);">🔒 Kirish huquqi kerak</span>
              `}
            </div>

            ${tasks.length ? tasks.map(t => `
              <div class="task-card" style="margin-bottom:10px;" onclick="${t.available ? `openLesson(${Number(t.id)})` : `showLockedInfo()`}">
                <div class="task-title" style="font-size:14.5px;">${escapeHtml(t.title)}</div>
                <div class="task-text">${escapeHtml(t.task_text).replace(/\n/g, "<br>")}</div>
              </div>
            `).join("") : `<div style="font-size:13px; color:var(--text-secondary); padding:6px 0;">Ushbu modulda alohida dars vazifalari belgilanmagan. Modul testi orqali bilimingizni sinab ko'ring.</div>`}
          </div>
        `;
      }).join("") : `<div class="empty-box">Bu kursda hozircha modullar kiritilmagan.</div>`}
    </div>
  `;
}

async function selectTasksCourse(courseId) {
  if (!courseId) return;
  try {
    haptic("light");
    const data = await api(`/api/course/${Number(courseId)}/modules`);
    courseModulesData = data;
    selectedCourseId = Number(courseId);
    render();
  } catch (error) {
    showAlert(error.message || "Kursni yuklashda xatolik.");
  }
}

function openAddTestModal() {
  const modules = (courseModulesData && courseModulesData.modules) || [];
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
  const contactTg = state.settings?.contact_telegram || "texnikuzb";
  const rawPhone = state.settings?.contact_phone || "";
  const hasPhone = rawPhone.trim() !== "" && rawPhone.trim() !== "+998900000000";
  const contactPhone = rawPhone;

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

      ${hasPhone ? `
      <a href="tel:${escapeHtml(contactPhone)}" class="btn secondary" style="text-decoration:none; margin-bottom:18px;">
        📞 Telefon orqali qo'ng'iroq qilish (${escapeHtml(contactPhone)})
      </a>
      ` : ""}

      <!-- To'lov so'rovi yuborish -->
      ${(state.courses && state.courses.length) ? `
        <div class="apple-field" style="margin-bottom:10px;">
          <label>Qaysi kurs bo'yicha so'rov yubormoqchisiz?</label>
          <select id="request-course-select" class="apple-input">
            ${state.courses.map(c => `<option value="${Number(c.id)}" ${selectedCourseId === c.id ? "selected" : ""}>${escapeHtml(c.title)}</option>`).join("")}
          </select>
        </div>
      ` : ""}
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

function getAdjacentLessons(lessonId) {
  if (!courseModulesData || !Array.isArray(courseModulesData.modules)) return { prev: null, next: null };
  const flat = [];
  courseModulesData.modules.forEach(m => (m.lessons || []).forEach(l => flat.push(l)));
  const idx = flat.findIndex(l => Number(l.id) === Number(lessonId));
  if (idx === -1) return { prev: null, next: null };
  return { prev: flat[idx - 1] || null, next: flat[idx + 1] || null };
}

function renderLessonNavButtons(lessonId) {
  const { prev, next } = getAdjacentLessons(lessonId);
  if (!prev && !next) return "";

  return `
    <div style="display:flex; gap:10px; margin-top:10px;">
      ${prev ? `
        <button class="btn secondary" style="margin-bottom:0; flex:1;" onclick="openLesson(${Number(prev.id)})">
          ← Oldingi dars
        </button>
      ` : `<div style="flex:1;"></div>`}
      ${next ? `
        <button class="btn secondary" style="margin-bottom:0; flex:1;" onclick="${next.available ? `openLesson(${Number(next.id)})` : "showLockedInfo()"}">
          Keyingi dars →
        </button>
      ` : `<div style="flex:1;"></div>`}
    </div>
  `;
}

function openLessonDrawer(lessonId) {
  if (!courseModulesData) return showAlert("Kurs ma'lumotlari topilmadi.");

  const course = courseModulesData.course || {};
  const modules = courseModulesData.modules || [];
  const currentModule = modules.find(m => (m.lessons || []).some(l => Number(l.id) === Number(lessonId)));
  if (!currentModule) return;

  const overlay = document.createElement("div");
  overlay.className = "drawer-overlay";
  overlay.innerHTML = `
    <div class="drawer-panel">
      <div class="drawer-header">
        <div>
          <div class="drawer-course">${escapeHtml(course.title || "")}</div>
          <div class="drawer-module">${escapeHtml(currentModule.title || "")}</div>
        </div>
        <div class="drawer-close">✕</div>
      </div>
      <div class="drawer-lessons">
        ${(currentModule.lessons || []).map(l => `
          <div class="drawer-lesson-item ${Number(l.id) === Number(lessonId) ? "current" : ""} ${!l.available ? "locked" : ""}" data-lesson-id="${Number(l.id)}" data-available="${l.available ? "1" : "0"}">
            <span>${l.watched ? "✅" : (l.available ? "▶" : "🔒")}</span>
            <span>${escapeHtml(l.title)}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const closeDrawer = () => {
    overlay.classList.add("closing");
    setTimeout(() => overlay.remove(), 220);
  };

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeDrawer();
  });
  overlay.querySelector(".drawer-close")?.addEventListener("click", closeDrawer);

  overlay.querySelectorAll(".drawer-lesson-item").forEach(item => {
    item.addEventListener("click", () => {
      const id = Number(item.dataset.lessonId);
      const available = item.dataset.available === "1";
      overlay.remove();
      if (available) {
        haptic("light");
        openLesson(id);
      } else {
        showLockedInfo();
      }
    });
  });
}

async function markLessonWatched(lessonId) {
  try {
    haptic("medium");
    await api("/api/progress/mark", { lesson_id: Number(lessonId) });
    showToast("Dars tugallandi! Keyingi dars ochildi ✅");
    if (selectedCourseId) {
      const data = await api(`/api/course/${Number(selectedCourseId)}/modules`);
      courseModulesData = data;
    }
    openLesson(lessonId);
  } catch (error) {
    showAlert(error.message || "Belgilashda xatolik.");
  }
}

async function requestAccess() {
  const courseSelect = document.getElementById("request-course-select");
  const chosenCourseId = courseSelect ? Number(courseSelect.value) : (selectedCourseId || null);
  const chosenCourse = (state.courses || []).find(c => Number(c.id) === Number(chosenCourseId));
  const courseName = chosenCourse ? chosenCourse.title : null;

  showConfirm(
    "So'rov yuborilsinmi?",
    courseName
      ? `"${courseName}" kursi bo'yicha adminga xabar yuboriladi.`
      : "Adminga to'lovni tasdiqlash uchun xabar yuboriladi.",
    "Ha, yuborish",
    async () => {
      try {
        const result = await api("/api/request-access", { course_id: chosenCourseId });
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
          <button class="btn" style="margin-bottom: 0; padding: 10px;" onclick="resumeLastLesson()">
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

      <button class="btn danger" style="margin-top:24px;" onclick="confirmDeleteAccount()">
        🗑️ Hisobni o'chirish
      </button>
    </div>
  `;
}

function confirmDeleteAccount() {
  showConfirm(
    "Hisobni o'chirmoqchimisiz?",
    "Bu amal orqali sizning barcha darslar progressingiz, test natijalaringiz va kursga kirish huquqingiz butunlay o'chiriladi. Agar to'lov qilgan bo'lsangiz ham, qayta kirganingizda yangi o'quvchi sifatida boshlaysiz va darslar hamda testlarga kirish uchun qaytadan ruxsat so'rashingiz kerak bo'ladi. Bu amalni ortga qaytarib bo'lmaydi.",
    "Ha, hisobni o'chirish",
    async () => {
      try {
        await api("/api/account/reset");
        showToast("Hisobingiz tozalandi.");
        await loadContent();
        setTab("home");
      } catch (error) {
        showAlert(error.message || "Hisobni o'chirishda xatolik yuz berdi.");
      }
    }
  );
}

// ======================================================
// TESTS SYSTEM
// ======================================================

const QUIZ_PREV_LOCK_SECONDS = 15;

async function openTest(moduleId) {
  try {
    haptic("light");
    const data = await api(`/api/module/${Number(moduleId)}/test`);
    const questions = Array.isArray(data.questions) ? data.questions : [];

    if (!questions.length) {
      return showAlert("Ushbu modul uchun test savollari hali kiritilmagan.");
    }

    window._quizState = {
      moduleId: Number(moduleId),
      questions: questions.map(q => {
        let opts = q.options;
        if (typeof opts === "string") {
          try { opts = JSON.parse(opts); } catch (e) { opts = []; }
        }
        if (!Array.isArray(opts)) opts = [];
        return { id: q.id, question: q.question, options: opts };
      }),
      currentIndex: 0,
      answers: {},
      canGoBack: true,
      lockTimer: null
    };

    renderQuizQuestion();
  } catch (error) {
    console.error("OPEN TEST ERROR:", error);
    showAlert(error.message || "Testni yuklashda xatolik.");
  }
}

function renderQuizQuestion() {
  const qs = window._quizState;
  if (!qs) return;

  const total = qs.questions.length;
  const idx = qs.currentIndex;
  const q = qs.questions[idx];
  const isLast = idx === total - 1;
  const selectedAnswer = qs.answers[q.id];

  qs.canGoBack = true;
  if (qs.lockTimer) clearTimeout(qs.lockTimer);
  qs.lockTimer = setTimeout(() => {
    qs.canGoBack = false;
    const prevBtn = document.getElementById("quiz-prev-btn");
    if (prevBtn) {
      prevBtn.disabled = true;
      prevBtn.classList.add("quiz-nav-locked");
    }
  }, QUIZ_PREV_LOCK_SECONDS * 1000);

  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="closeDetail()">← Testdan chiqish</div>
        <div class="page-title" style="margin-bottom:4px;">Modul Testi</div>
        <p style="color:var(--text-secondary); font-size:13px; margin-bottom:14px;">Savol ${idx + 1} / ${total}</p>

        <div class="quiz-timer-track">
          <div class="quiz-timer-bar" id="quiz-timer-bar" style="animation: quizTimerShrink ${QUIZ_PREV_LOCK_SECONDS}s linear forwards;"></div>
        </div>
        <p style="font-size:11px; color:var(--text-secondary); margin-bottom:16px;">
          ⏱️ Avvalgi savolga qaytish uchun ${QUIZ_PREV_LOCK_SECONDS} soniyangiz bor
        </p>

        <div class="test-question">
          <p>${idx + 1}. ${escapeHtml(q.question)}</p>
          ${q.options.map((opt, oIdx) => `
            <div class="option ${selectedAnswer === oIdx ? "selected" : ""}" data-qid="${Number(q.id)}" data-idx="${oIdx}" onclick="selectTestOption(${Number(q.id)}, ${oIdx})">
              ${escapeHtml(opt)}
            </div>
          `).join("")}
        </div>

        <div style="display:flex; gap:10px; margin-top:18px;">
          <button id="quiz-prev-btn" class="btn secondary" style="margin-bottom:0; flex:1;" ${idx === 0 ? "disabled" : ""} onclick="quizGoPrev()">
            ← Oldingi
          </button>
          <button class="btn" style="margin-bottom:0; flex:1;" onclick="${isLast ? `submitModuleTest(${qs.moduleId})` : "quizGoNext()"}">
            ${isLast ? "✅ Yakunlash" : "Keyingi →"}
          </button>
        </div>
      </div>
    `
  };
  render();
  window.scrollTo(0, 0);
}

function quizGoNext() {
  const qs = window._quizState;
  if (!qs) return;
  haptic("light");
  if (qs.currentIndex < qs.questions.length - 1) {
    qs.currentIndex++;
    renderQuizQuestion();
  }
}

function quizGoPrev() {
  const qs = window._quizState;
  if (!qs || !qs.canGoBack) {
    return showAlert(`Vaqt tugagani uchun avvalgi savolga qaytib bo'lmaydi.`);
  }
  haptic("light");
  if (qs.currentIndex > 0) {
    qs.currentIndex--;
    renderQuizQuestion();
  }
}

function selectTestOption(qId, idx) {
  haptic("light");
  const qs = window._quizState;
  if (qs) qs.answers[qId] = idx;
  document.querySelectorAll(`.option[data-qid="${Number(qId)}"]`).forEach(el => {
    el.classList.remove("selected");
  });
  document.querySelector(`.option[data-qid="${Number(qId)}"][data-idx="${Number(idx)}"]`)?.classList.add("selected");
}

async function submitModuleTest(moduleId) {
  try {
    haptic("medium");
    const qs = window._quizState;
    const result = await api(`/api/module/${Number(moduleId)}/submit`, {
      answers: (qs && qs.answers) || {}
    });

    window._quizState = null;

    if (selectedCourseId) {
      try {
        const data = await api(`/api/course/${Number(selectedCourseId)}/modules`);
        courseModulesData = data;
      } catch (e) {}
    }
    await loadContent();

    renderQuizResults(moduleId, result);
  } catch (error) {
    showAlert(error.message || "Test natijasini yuborishda xatolik.");
  }
}

function renderQuizResults(moduleId, result) {
  const breakdown = Array.isArray(result.breakdown) ? result.breakdown : [];
  const correctCount = breakdown.filter(b => b.is_correct).length;

  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="closeDetail()">← Darslarga qaytish</div>
        <div class="page-title" style="margin-bottom:6px;">Test Natijasi</div>

        <div class="card" style="text-align:center; margin-bottom:18px; background:${result.passed ? "var(--success-soft)" : "var(--danger-soft)"};">
          <div style="font-size:32px; font-weight:800; color:${result.passed ? "var(--success)" : "var(--danger)"};">
            ${result.score}%
          </div>
          <div style="font-size:14px; font-weight:700; margin-top:4px;">
            ${result.passed ? "🎉 Tabriklaymiz, o'tdingiz!" : "😔 O'tish chegarasiga yetmadingiz (kerak: 65%)"}
          </div>
          <div style="font-size:12.5px; color:var(--text-secondary); margin-top:4px;">
            ${correctCount} / ${breakdown.length} savolga to'g'ri javob berdingiz
          </div>
        </div>

        <div class="section-title">Savollar bo'yicha natija</div>

        ${breakdown.map((b, i) => {
          let opts = b.options;
          if (typeof opts === "string") { try { opts = JSON.parse(opts); } catch (e) { opts = []; } }
          if (!Array.isArray(opts)) opts = [];

          return `
            <div class="card" style="margin-bottom:10px; border-left: 3px solid ${b.is_correct ? "var(--success)" : "var(--danger)"};">
              <div style="display:flex; justify-content:space-between; gap:8px; margin-bottom:8px;">
                <div style="font-size:13.5px; font-weight:650;">${i + 1}. ${escapeHtml(b.question)}</div>
                <div style="font-size:16px;">${b.is_correct ? "✅" : "❌"}</div>
              </div>
              ${opts.map((opt, oIdx) => {
                let style = "";
                let icon = "";
                if (oIdx === b.correct_index) {
                  style = "background:var(--success-soft); color:var(--success); font-weight:700;";
                  icon = " ✓";
                } else if (oIdx === b.your_answer_index && !b.is_correct) {
                  style = "background:var(--danger-soft); color:var(--danger); font-weight:700;";
                  icon = " ✗";
                }
                return `<div style="padding:8px 10px; border-radius:8px; font-size:12.5px; margin-bottom:4px; ${style}">${escapeHtml(opt)}${icon}</div>`;
              }).join("")}
              ${b.your_answer_index === null ? `<div style="font-size:11.5px; color:var(--text-secondary); margin-top:4px;">Siz bu savolga javob bermagansiz</div>` : ""}
            </div>
          `;
        }).join("")}

        <button class="btn" style="margin-top:10px;" onclick="closeDetail()">
          Darslarga qaytish
        </button>
        ${!result.passed ? `
          <button class="btn secondary" onclick="openTest(${Number(moduleId)})">
            🔁 Testni qayta topshirish
          </button>
        ` : ""}
      </div>
    `
  };
  render();
  window.scrollTo(0, 0);
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
          <button class="${adminView === "lessons" ? "active" : ""}" onclick="goToCourseManagement()">
            🎬 Darslar
          </button>
          <button class="${adminView === "practice" ? "active" : ""}" onclick="adminSetTab('practice')">
            📤 Vazifalar
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
          ${adminView === "practice" ? renderAdminPractice() : ""}
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
    } else if (tab === "practice") {
      const data = await adminApi("/api/admin/practice/submissions", { status: adminData.practiceFilter || "" });
      adminData.practice = data.submissions || [];
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
      <div class="admin-stat-card" style="cursor:pointer;" onclick="openStudentsDetailList('active', 'Faol Obunachilar')">
        <div class="admin-stat-icon">💳</div>
        <div class="admin-stat-value">${s.paid_students || 0}</div>
        <div class="admin-stat-label">Faol Obunachilar →</div>
      </div>
      <div class="admin-stat-card" style="cursor:pointer;" onclick="openStudentsDetailList('expired', 'Muddati Tugaganlar')">
        <div class="admin-stat-icon">⏳</div>
        <div class="admin-stat-value">${s.unpaid_students || 0}</div>
        <div class="admin-stat-label">Muddati Tugaganlar →</div>
      </div>
      <div class="admin-stat-card" style="cursor:pointer;" onclick="openStudentsDetailList('pending_new', 'Yangi Kirish So\\'ragan')">
        <div class="admin-stat-icon">🆕</div>
        <div class="admin-stat-value">${s.pending_new || 0}</div>
        <div class="admin-stat-label">Yangi So'rovlar →</div>
      </div>
      <div class="admin-stat-card" style="cursor:pointer;" onclick="openStudentsDetailList('pending_renewal', 'Muddat Uzaytirish So\\'ragan')">
        <div class="admin-stat-icon">🔄</div>
        <div class="admin-stat-value">${s.pending_renewal || 0}</div>
        <div class="admin-stat-label">Uzaytirish So'rovlari →</div>
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

async function openStudentsDetailList(filter, title) {
  try {
    haptic("light");
    currentView = {
      html: `<div class="page"><div class="back-btn" onclick="adminSetTab('dashboard')">← Ortga</div><div class="loading-state" style="padding:60px 0; text-align:center;"><div class="spinner"></div></div></div>`
    };
    render();

    const data = await adminApi("/api/admin/students/detail-list", { filter });
    const students = data.students || [];

    currentView = {
      html: `
        <div class="page">
          <div class="back-btn" onclick="adminSetTab('dashboard')">← Ortga qaytish</div>
          <div class="page-title">${escapeHtml(title)}</div>
          <p style="color:var(--text-secondary); font-size:13px; margin-bottom:14px;">${students.length} ta natija</p>

          ${students.length ? students.map(st => {
            const fullName = [st.first_name, st.last_name].filter(Boolean).join(" ") || "Nomalum";
            return `
              <div class="card card-clickable" style="margin-bottom:10px;" onclick="openAdminStudentModal(${Number(st.id)})">
                <div style="font-weight:700; font-size:14.5px; margin-bottom:6px;">${escapeHtml(fullName)}</div>
                <div style="font-size:12.5px; color:var(--text-secondary);">
                  ${st.username ? "@" + escapeHtml(st.username) : "ID: " + escapeHtml(st.telegram_id)}
                </div>
                ${st.requested_at ? `<div style="font-size:12.5px; margin-top:6px;">📨 So'rov yuborgan: ${escapeHtml(fmtDate(st.requested_at) || '')}</div>` : ""}
                ${st.approved_at ? `<div style="font-size:12.5px;">✅ Ruxsat berilgan: ${escapeHtml(fmtDate(st.approved_at) || '')}</div>` : ""}
                ${st.access_until ? `<div style="font-size:12.5px;">📅 Muddati: ${escapeHtml(fmtDate(st.access_until) || '')}</div>` : ""}
              </div>
            `;
          }).join("") : `<div class="empty-box">Hech kim topilmadi.</div>`}
        </div>
      `
    };
    render();
  } catch (error) {
    showAlert(error.message || "Ro'yxatni yuklashda xatolik.");
  }
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
              ${st.current_position ? `<br>📍 ${escapeHtml(st.current_position.course_title || '')} — ${escapeHtml(st.current_position.module_title || '')} / ${escapeHtml(st.current_position.lesson_title || '')}` : ""}
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
    const progress = Array.isArray(data.progress) ? data.progress : [];
    const courses = Array.isArray(data.courses) ? data.courses : [];
    const modules = Array.isArray(data.modules) ? data.modules : [];
    const grantedModuleIds = (data.granted_module_ids || []).map(Number);

    const fullName = [st.first_name, st.last_name].filter(Boolean).join(" ") || "O'quvchi";

    // "Hozirgi holati" — eng oxirgi ko'rilgan darsdan keyingisi (yoki eng oxirgi ko'rilgani, agar hammasi tugagan bo'lsa)
    const watchedRows = progress.filter(p => p.watched);
    const lastWatched = watchedRows.length ? watchedRows[watchedRows.length - 1] : null;
    const nextIndex = lastWatched ? progress.findIndex(p => p.lesson_id === lastWatched.lesson_id) + 1 : 0;
    const currentRow = progress[nextIndex] || lastWatched;

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
            <div class="info-row">
              <span class="info-label">📍 Hozirgi holati</span>
              <span class="info-val">
                ${currentRow ? `${escapeHtml(currentRow.module_title)} — ${escapeHtml(currentRow.lesson_title)}` : "Hali boshlamagan"}
              </span>
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

          <div class="apple-registration-form" style="background: var(--bg-surface); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border); margin-bottom: 18px;">
            <label style="font-size: 13px; font-weight: 700; display: block; margin-bottom: 8px;">
              🔑 Modullarga alohida kirish huquqi (ketma-ketlikdan tashqari)
            </label>
            <p style="font-size:12px; color:var(--text-secondary); margin-bottom:10px;">
              Kursni tanlang, so'ng shu o'quvchiga ochiq bo'lishi kerak bo'lgan modullarni belgilang. Bu ketma-ket ochilish tartibini chetlab o'tadi.
            </p>
            <select id="grant-module-course" class="apple-input" style="margin-bottom:10px;" onchange="renderStudentModuleGrantList(${Number(st.id)})">
              <option value="">— Kursni tanlang —</option>
              ${courses.map(c => `<option value="${Number(c.id)}">${escapeHtml(c.title)}</option>`).join("")}
            </select>
            <div id="grant-module-list"></div>
          </div>
        </div>
      `
    };
    window.__studentGrantData = { modules, grantedModuleIds };
    render();
  } catch (error) {
    showAlert(error.message || "O'quvchi ma'lumotlarini yuklashda xato.");
  }
}

function renderStudentModuleGrantList(studentId) {
  const courseId = Number(document.getElementById("grant-module-course")?.value);
  const container = document.getElementById("grant-module-list");
  if (!container) return;

  if (!courseId) {
    container.innerHTML = "";
    return;
  }

  const { modules, grantedModuleIds } = window.__studentGrantData || { modules: [], grantedModuleIds: [] };
  const courseModules = modules.filter(m => Number(m.course_id) === courseId);

  if (!courseModules.length) {
    container.innerHTML = `<div class="empty-box">Bu kursda modullar mavjud emas.</div>`;
    return;
  }

  container.innerHTML = `
    <div class="category-checkbox-group" style="margin-bottom:10px;">
      ${courseModules.map(m => `
        <label class="category-checkbox">
          <input type="checkbox" name="grant-mod-cb" value="${Number(m.id)}" ${grantedModuleIds.includes(Number(m.id)) ? "checked" : ""}>
          <span>${escapeHtml(m.title)}</span>
        </label>
      `).join("")}
    </div>
    <button class="btn secondary" style="margin-bottom:0;" onclick="saveStudentModuleGrants(${Number(studentId)}, ${courseId})">
      💾 Ruxsatlarni saqlash
    </button>
  `;
}

async function saveStudentModuleGrants(studentId, courseId) {
  const checked = Array.from(document.querySelectorAll('input[name="grant-mod-cb"]:checked')).map(el => Number(el.value));
  try {
    haptic("medium");
    await adminApi("/api/admin/module-access/set", {
      user_id: Number(studentId),
      course_id: Number(courseId),
      module_ids: checked
    });
    showToast("Modul ruxsatlari saqlandi!");
    openAdminStudentModal(studentId);
  } catch (error) {
    showAlert(error.message || "Saqlashda xatolik.");
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

function openAddLessonView(moduleId) {
  const modules = (courseModulesData && courseModulesData.modules) || [];
  if (!modules.length) return showAlert("Avval modul mavjud bo'lishi kerak!");

  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="closeDetail()">← Ortga qaytish</div>
        <div class="page-title">Yangi Dars Qo'shish</div>

        <div class="admin-form">
          <div class="apple-field">
            <label>Qaysi modulga qo'shiladi? *</label>
            <select id="new-l-module" class="apple-input">
              ${modules.map(m => `<option value="${Number(m.id)}" ${Number(m.id) === Number(moduleId) ? "selected" : ""}>${escapeHtml(m.title)}</option>`).join("")}
            </select>
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
  const title = document.getElementById("new-l-title")?.value.trim();
  const ytUrl = document.getElementById("new-l-yt")?.value.trim();
  const bunnyId = document.getElementById("new-l-bunny")?.value.trim();
  const fileName = document.getElementById("new-l-filename")?.value.trim();
  const fileUrl = document.getElementById("new-l-fileurl")?.value.trim();
  const task = document.getElementById("new-l-task")?.value.trim();
  const warning = document.getElementById("new-l-warning")?.value.trim();
  const isFree = document.getElementById("new-l-free")?.checked;

  if (!moduleId || !title) {
    return showAlert("Modul va dars nomi kiritilishi shart!");
  }

  try {
    haptic("medium");
    await adminApi("/api/admin/lesson", {
      module_id: Number(moduleId),
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
    currentView = null;
    await reloadCourseModules();
  } catch (error) {
    showAlert(error.message || "Dars yaratishda xatolik.");
  }
}

// 6-TALAB: DARSNI TAHRIRLASH (Modul, dars nomi, raqami, linki, manbalar)
async function openEditLessonView(lessonId) {
  try {
    haptic("light");
    const lessonData = await adminApi(`/api/admin/lesson/${Number(lessonId)}`);
    const lesson = lessonData.lesson || {};
    const filesData = await adminApi(`/api/admin/lesson/${Number(lessonId)}/files`);
    const files = filesData.files || [];
    const modules = (courseModulesData && courseModulesData.modules) || [];

    currentView = {
      html: `
        <div class="page">
          <div class="back-btn" onclick="closeDetail()">← Ortga qaytish</div>
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
                  <span>${getResourceIcon(f.file_name)}</span>
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
    currentView = null;
    await reloadCourseModules();
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
      currentView = null;
      await reloadCourseModules();
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

// Admin Practice (vazifa topshiriqlari)
const PRACTICE_FILTERS = [
  { key: "", label: "Barchasi" },
  { key: "submitted", label: "🕓 Tekshirilmoqda" },
  { key: "approved", label: "✅ Qabul qilingan" },
  { key: "needs_revision", label: "🔁 Qaytarilgan" }
];

function renderAdminPractice() {
  const submissions = adminData.practice || [];
  const activeFilter = adminData.practiceFilter || "";

  return `
    <div>
      <div class="category-chips" style="display:flex; gap:8px; overflow-x:auto; margin-bottom:16px; padding-bottom:4px;">
        ${PRACTICE_FILTERS.map(f => `
          <div class="chip ${activeFilter === f.key ? "active" : ""}" onclick="setPracticeFilter('${f.key}')">
            ${f.label}
          </div>
        `).join("")}
      </div>

      ${submissions.length ? submissions.map(s => {
        const meta = PRACTICE_STATUS_META[s.status] || PRACTICE_STATUS_META.submitted;
        const studentName = [s.first_name, s.last_name].filter(Boolean).join(" ") || s.username || ("ID " + s.telegram_id);
        return `
          <div class="card" style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
              <div>
                <div style="font-weight:700; font-size:14.5px;">${escapeHtml(studentName)}</div>
                <div style="font-size:12.5px; color:var(--text-secondary); margin-top:2px;">${escapeHtml(s.lesson_title)}</div>
              </div>
              <div class="tag ${meta.cls}">${meta.label}</div>
            </div>
            <div style="font-size:13px; margin-bottom:6px;">
              🔗 <a href="${escapeHtml(s.submission_url)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent);">${escapeHtml(s.submission_url)}</a>
            </div>
            ${s.comment ? `<div style="font-size:12.5px; color:var(--text-secondary); margin-bottom:8px;">💬 ${escapeHtml(s.comment)}</div>` : ""}
            ${s.admin_comment ? `<div style="font-size:12.5px; color:var(--accent); margin-bottom:8px;">👨‍🏫 ${escapeHtml(s.admin_comment)}</div>` : ""}

            ${s.status === "submitted" ? `
              <div class="apple-field" style="margin-top:6px;">
                <textarea id="review-comment-${Number(s.id)}" class="apple-input apple-textarea" placeholder="Izoh (ixtiyoriy)..." style="min-height:60px;"></textarea>
              </div>
              <div style="display:flex; gap:8px;">
                <button class="btn" style="margin:0; padding:9px;" onclick="reviewPractice(${Number(s.id)}, 'approved')">
                  ✅ Qabul qilish
                </button>
                <button class="btn danger" style="margin:0; padding:9px;" onclick="reviewPractice(${Number(s.id)}, 'needs_revision')">
                  🔁 Qaytarish
                </button>
              </div>
            ` : ""}
          </div>
        `;
      }).join("") : `<div class="empty-box">Hozircha topshiriqlar yo'q.</div>`}
    </div>
  `;
}

function setPracticeFilter(status) {
  haptic("light");
  adminData.practiceFilter = status;
  adminSetTab("practice");
}

async function reviewPractice(submissionId, status) {
  const commentInput = document.getElementById(`review-comment-${Number(submissionId)}`);
  const comment = commentInput?.value.trim();

  try {
    haptic("medium");
    await adminApi(`/api/admin/practice/${Number(submissionId)}/review`, {
      status,
      admin_comment: comment || ""
    });
    showToast(status === "approved" ? "Vazifa qabul qilindi!" : "Vazifa qaytarildi!");
    adminSetTab("practice");
  } catch (error) {
    showAlert(error.message || "Baholashda xatolik.");
  }
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

const NAV_ICONS = {
  home: {
    outline: `<path d="M4 11.5 12 4l8 7.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10v8.2c0 .44.36.8.8.8H10a.8.8 0 0 0 .8-.8v-3.4c0-.44.36-.8.8-.8h1c.44 0 .8.36.8.8V18.2c0 .44.36.8.8.8h3.2c.44 0 .8-.36.8-.8V10" stroke-linecap="round" stroke-linejoin="round"/>`,
    filled: `<path d="M12 3.2 3 11.2c-.4.35-.13 1 .4 1h1.6v6.9c0 .6.49 1.1 1.1 1.1H9.5a.9.9 0 0 0 .9-.9v-3.9c0-.5.4-.9.9-.9h1.4c.5 0 .9.4.9.9v3.9c0 .5.4.9.9.9h3.4c.61 0 1.1-.5 1.1-1.1v-6.9h1.6c.53 0 .8-.65.4-1L12 3.2Z"/>`
  },
  lessons: {
    outline: `<path d="M4 5.2c2.2-.9 4.9-.9 8 0v13.6c-3.1-.9-5.8-.9-8 0V5.2Z" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 5.2c-2.2-.9-4.9-.9-8 0v13.6c3.1-.9 5.8-.9 8 0V5.2Z" stroke-linecap="round" stroke-linejoin="round"/>`,
    filled: `<path d="M3.4 4.6c2.5-.9 5.4-.85 8.1.2v14.1c-2.6-1-5.5-1-8.1-.15a.75.75 0 0 1-1-.7V5.3c0-.32.2-.6.5-.7Z"/><path d="M20.6 4.6c-2.5-.9-5.4-.85-8.1.2v14.1c2.6-1 5.5-1 8.1-.15.44.14 1-.15 1-.7V5.3c0-.32-.2-.6-.5-.7Z"/>`
  },
  tasks: {
    outline: `<rect x="5" y="3.6" width="14" height="16.8" rx="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.4 8.6h7.2M8.4 12h7.2M8.4 15.4h4.6" stroke-linecap="round"/>`,
    filled: `<rect x="4.4" y="3" width="15.2" height="18" rx="2.8" opacity="0.22"/><rect x="7.4" y="7.4" width="9.2" height="1.8" rx="0.9"/><rect x="7.4" y="11" width="9.2" height="1.8" rx="0.9"/><rect x="7.4" y="14.6" width="5.8" height="1.8" rx="0.9"/>`
  },
  chat: {
    outline: `<path d="M4 6.4A2.4 2.4 0 0 1 6.4 4h11.2A2.4 2.4 0 0 1 20 6.4v8a2.4 2.4 0 0 1-2.4 2.4H9.6L5.2 20v-3.6H6.4A2.4 2.4 0 0 1 4 14V6.4Z" stroke-linecap="round" stroke-linejoin="round"/>`,
    filled: `<path d="M4 6.6A2.6 2.6 0 0 1 6.6 4h10.8A2.6 2.6 0 0 1 20 6.6v7.6a2.6 2.6 0 0 1-2.6 2.6H9.9L5 20.6v-3.9a2.6 2.6 0 0 1-1-2V6.6Z"/>`
  },
  profile: {
    outline: `<circle cx="12" cy="8.2" r="3.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.8 19.6c1.1-3.4 4-5.1 7.2-5.1s6.1 1.7 7.2 5.1" stroke-linecap="round" stroke-linejoin="round"/>`,
    filled: `<circle cx="12" cy="7.8" r="3.8"/><path d="M4.4 20.2c1-3.9 4.1-6 7.6-6s6.6 2.1 7.6 6c.13.5-.25 1-.8 1H5.2c-.55 0-.93-.5-.8-1Z"/>`
  }
};

function renderNav() {
  const tabs = [
    { id: "home", label: "Bosh sahifa" },
    { id: "lessons", label: "Darslar" },
    { id: "tasks", label: "Vazifalar" },
    { id: "chat", label: "Chat" },
    { id: "profile", label: "Profil" }
  ];

  return `
    <div class="nav">
      ${tabs.map(t => {
        const isActive = activeTab === t.id;
        const icon = NAV_ICONS[t.id];
        const svgInner = isActive ? icon.filled : icon.outline;
        const strokeProps = isActive ? "" : `fill="none" stroke="currentColor" stroke-width="1.6"`;
        return `
        <div class="nav-item ${isActive ? "active" : ""}" onclick="setTab('${t.id}')">
          <div class="nav-icon">
            <svg width="23" height="23" viewBox="0 0 24 24" ${isActive ? 'fill="currentColor"' : strokeProps}>${svgInner}</svg>
          </div>
          <div class="nav-label">${t.label}</div>
        </div>
      `;
      }).join("")}
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

// Chegirma muddati uchun jonli sanoq (har soniyada barcha .discount-countdown elementlarini yangilaydi)
setInterval(() => {
  document.querySelectorAll(".discount-countdown").forEach(el => {
    const until = el.dataset.until ? new Date(el.dataset.until) : null;
    if (!until || isNaN(until.getTime())) return;
    const diff = until.getTime() - Date.now();
    if (diff <= 0) {
      el.textContent = "⏰ Chegirma muddati tugadi";
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, "0");
    el.textContent = days > 0
      ? `🔥 Chegirma tugashiga: ${days} kun ${pad(hours)}:${pad(mins)}:${pad(secs)}`
      : `🔥 Chegirma tugashiga: ${pad(hours)}:${pad(mins)}:${pad(secs)}`;
  });
}, 1000);

function closeDetail() {
  haptic("light");
  if (window._quizState) {
    if (window._quizState.lockTimer) clearTimeout(window._quizState.lockTimer);
    window._quizState = null;
  }
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
