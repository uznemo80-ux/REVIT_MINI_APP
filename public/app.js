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
  access_until: null,
  first_name: "",
  last_name: "",
  phone: "",
  telegram_id: "",
  username: "",
  registered: false,
  is_admin: false,
  admin_role: null
};

let activeTab = "home";
let currentView = null;
let openFaq = null;
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
      admin_role: state.admin_role
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
// STATIC DATA (Academy & Course)
// ======================================================

const ABOUT_TEXT = `
Assalomu alaykum! Men Abdulloh — arxitektura va BIM yo'nalishida faoliyat yurituvchi mutaxassisman.

Men Autodesk Revit dasturini real interyer va arxitektura loyihalarini yaratish, ishchi chizmalar tayyorlash va loyiha jarayonini tizimli tashkil qilish vositasi sifatida o'rganib, amaliyotda 4 yildan beri qo'llab kelmoqdaman.

Shu tajribalarimni boshqalar bilan professional tarzda bo'lishish maqsadida YOSHUZBEKK Academy platformasini yaratdim.
`;

const ABOUT_SHORT = `
Assalomu alaykum! Men Abdulloh — arxitektura va BIM yo'nalishida faoliyat yurituvchi mutaxassisman. Revit dasturida professional interyer loyihalashni amaliyotda o'rgataman.
`;

const COURSE = {
  title: "INTPRO — Revit dasturida interyer loyihalash",
  price: "1 500 000 so'm",
  totalModules: 11,
  totalLessons: 140
};

const TESTIMONIALS = [
  { text: "Kurs juda tushunarli va amaliy. Revitda ishlash tezligim 2 barobar oshdi!", name: "Jasur R." },
  { text: "Har bir dars eng kichik detallarigacha professional tushuntirilgan.", name: "Madina K." },
  { text: "Vazifalar orqali real loyiha chizishni o'rganib oldim.", name: "Sardor B." }
];

const FAQ = [
  {
    q: "Kursga qanday to'lov qilaman?",
    a: "Pastki 'Chat' bo'limiga o'ting va 'Kursga kirish uchun murojaat' tugmasini bosing. So'rovingiz adminga yetib boradi va admin to'lov tafsilotlarini taqdim etadi."
  },
  {
    q: "Kirish huquqi qancha muddatga beriladi?",
    a: "To'lov tasdiqlangandan so'ng kurs darslariga 1 yil (365 kun) davomida to'liq va cheksiz kirish huquqi taqdim etiladi."
  },
  {
    q: "Namuna darslarni ko'ra olamanmi?",
    a: "Ha, 1-modul va ba'zi belgilangan namuna darslar hammaga bepul ochiq. Ularni darslar bo'limida 'Namuna' belgisi bilan ko'rishingiz mumkin."
  },
  {
    q: "Dars materiallari qanday yuklanadi?",
    a: "Har bir dars sahifasida o'sha dars uchun Revit oilalari (families), chizmalar yoki shablonlar yuklab olish tugmasi orqali bevosita ochiladi."
  }
];

function toggleAbout() {
  aboutOpen = !aboutOpen;
  render();
}

// ======================================================
// TAB RENDERERS
// ======================================================

function renderHome() {
  const modules = Array.isArray(state.modules) ? state.modules : [];
  const myTotal = modules.reduce((tot, m) => tot + (m.lessons?.length || 0), 0);
  const myWatched = modules.reduce((tot, m) => tot + (m.watched_count || 0), 0);
  const pct = myTotal ? Math.round((myWatched / myTotal) * 100) : 0;

  return `
    <div class="page">
      <div class="welcome-hero">
        <div class="welcome-badge">✨ Professional Ta'lim</div>
        <div class="welcome-title">
          Xush kelibsiz${state.first_name ? ", " + escapeHtml(state.first_name) : ""}!
        </div>
        <div class="welcome-sub">Revit dasturida interyer loyihalash akademiyasi</div>
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

      <div class="about-card">
        <div class="about-photo-wrap">
          <div class="splash-logo" style="width: 52px; height: 52px; font-size: 22px;">A</div>
          <div>
            <div class="about-author-name">Abdulloh</div>
            <div class="about-author-role">BIM & Revit Instruktor · YOSHUZBEKK</div>
          </div>
        </div>
        <div class="about-text">
          ${aboutOpen ? ABOUT_TEXT.replace(/\n/g, "<br>") : ABOUT_SHORT.replace(/\n/g, "<br>")}
        </div>
        <div class="about-more" onclick="toggleAbout()">
          ${aboutOpen ? "Yashirish ↑" : "Batafsil ma'lumot ↓"}
        </div>
      </div>

      <div class="section-title">Asosiy Kurs</div>

      <div class="course-card">
        <div class="course-card-header">
          <div class="course-banner-text">
            <h3>INTPRO Revit</h3>
            <p>Interyer Loyihalash & BIM Modellashtirish</p>
          </div>
        </div>
        <div class="course-body">
          <div class="course-title">${escapeHtml(COURSE.title)}</div>
          <div class="course-meta">
            <span>📚 ${COURSE.totalModules} Modul</span>
            <span>🎬 ${COURSE.totalLessons} Dars</span>
            <span>⏱️ 1 Yil kirish</span>
          </div>
          <div class="course-price-wrap">
            <div class="course-price">${escapeHtml(COURSE.price)}</div>
            <button class="btn" style="width: auto; margin-bottom: 0; padding: 10px 20px;" onclick="setTab('chat')">
              ${state.has_access ? "Kirish faol ✅" : "Sotib olish 💳"}
            </button>
          </div>
        </div>
      </div>

      <div class="section-title">Namuna Darslar</div>
      <div class="quick-item" onclick="setTab('lessons')">
        <span>▶ Ochiq namuna darslarni ko'rish</span>
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

      <div class="section-title">Ko'p beriladigan savollar</div>
      <div class="faq-list">
        ${FAQ.map((f, i) => `
          <div class="faq-item ${openFaq === i ? "open" : ""}" data-faq="${i}">
            <div class="faq-q" onclick="toggleFaq(${i})">
              <span>${escapeHtml(f.q)}</span>
              <span class="faq-plus">${openFaq === i ? "−" : "+"}</span>
            </div>
            <div class="faq-a" style="${openFaq === i ? 'max-height: 200px; opacity: 1;' : ''}">
              <div class="faq-a-inner">${escapeHtml(f.a)}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function toggleFaq(i) {
  haptic("light");
  openFaq = openFaq === i ? null : i;
  render();
}

// ======================================================
// LESSONS TAB
// ======================================================

function renderLessons() {
  const modules = Array.isArray(state.modules) ? state.modules : [];

  let html = `
    <div class="page">
      <div class="page-title">Kurs Darslari</div>
  `;

  if (!modules.length) {
    html += `<div class="empty-box">Hozircha modullar qo'shilmagan.</div>`;
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
          🔓 To'liq kirish huquqini olish
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
      <div class="files-description">Ushbu darsga biriktirilgan resurslar va ishchi fayllarni yuklab oling:</div>
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
// TASKS TAB
// ======================================================

function renderTasks() {
  const modules = Array.isArray(state.modules) ? state.modules : [];
  const allTasks = [];

  modules.forEach(m => {
    (m.lessons || []).forEach(l => {
      if (l.task_text && l.task_text.trim()) {
        allTasks.push({
          ...l,
          moduleTitle: m.title
        });
      }
    });
  });

  let html = `
    <div class="page">
      <div class="page-title">Amaliy Vazifalar</div>
  `;

  if (!allTasks.length) {
    html += `<div class="empty-box">Hozircha biriktirilgan amaliy vazifalar yo'q.</div>`;
  } else {
    allTasks.forEach(task => {
      html += `
        <div class="task-card" onclick="${task.available ? `openLesson(${Number(task.id)})` : `showLockedInfo()`}">
          <div class="task-module">${escapeHtml(task.moduleTitle)}</div>
          <div class="task-title">${escapeHtml(task.title)}</div>
          <div class="task-text">${escapeHtml(task.task_text).replace(/\n/g, "<br>")}</div>
        </div>
      `;
    });
  }

  html += `</div>`;
  return html;
}

// ======================================================
// CHAT & ACCESS REQUEST TAB
// ======================================================

function renderChat() {
  return `
    <div class="page">
      <div class="page-title">Kursga Kirish & Aloqa</div>

      <div class="chat-box">
        <div class="chat-box-icon">💎</div>
        <div class="chat-box-title">
          ${state.has_access ? "Sizda to'liq kirish huquqi faol!" : "INTPRO Revit kursiga to'liq kirish"}
        </div>
        <p>
          ${state.has_access
            ? `Obunangiz amal qilish muddati: <b>${escapeHtml(fmtDate(state.access_until) || "Muddatsiz")}</b> gacha.`
            : "Kursning barcha 11 ta moduli, 140 ta darsi, barcha oilalar va Revit shablonlariga 1 yillik to'liq kirish imkoniyatiga ega bo'ling."}
        </p>
      </div>

      <button class="btn" onclick="requestAccess()">
        ${state.has_access ? "🔄 Muddatni uzaytirish so'rovi" : "💳 Kursga kirish uchun murojaat yuborish"}
      </button>

      <div class="empty-box" style="padding-top: 10px;">
        Tugmani bosganingizda, adminga bot orqali avtomatik so'rov boradi va siz bilan bog'laniladi.
      </div>
    </div>
  `;
}

async function requestAccess() {
  showConfirm(
    "So'rov yuborilsinmi?",
    "Adminga kursga kirish / tasdiqlash uchun xabar yuboriladi.",
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
// PROFILE TAB
// ======================================================

function renderProfile() {
  const fullName = [state.first_name, state.last_name].filter(Boolean).join(" ") || "Foydalanuvchi";

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
// ADMIN PANEL (Full Management System)
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
          <button class="${adminView === "modules" ? "active" : ""}" onclick="adminSetTab('modules')">
            📦 Modullar
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
          ${adminView === "modules" ? renderAdminModules() : ""}
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
    } else if (tab === "modules" || tab === "lessons") {
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

// ------------------------------------------------------
// Admin Dashboard
// ------------------------------------------------------
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

// ------------------------------------------------------
// Admin Students
// ------------------------------------------------------
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

// ------------------------------------------------------
// Admin Modules CRUD
// ------------------------------------------------------
function renderAdminModules() {
  const modules = adminData.modules || [];

  return `
    <div class="admin-section-header">
      <div class="admin-section-title">Modullar ro'yxati (${modules.length})</div>
      <button class="admin-small-btn" onclick="openAddModuleModal()">➕ Yangi Modul</button>
    </div>

    ${modules.length ? modules.map((m, idx) => `
      <div class="admin-module-card">
        <div class="admin-module-title">
          <span>${idx + 1}. ${escapeHtml(m.title)} (${m.lesson_count || 0} dars)</span>
          <div class="admin-lesson-actions">
            <button onclick="openEditModuleModal(${Number(m.id)}, '${escapeJsString(m.title)}', ${Number(m.order_index)})">✏️</button>
            <button onclick="deleteAdminModule(${Number(m.id)})">🗑️</button>
          </div>
        </div>
      </div>
    `).join("") : `<div class="empty-box">Hozircha modullar yo'q.</div>`}
  `;
}

function openAddModuleModal() {
  const title = prompt("Yangi modul nomini kiriting:");
  if (!title || !title.trim()) return;

  const orderIndex = prompt("Modul tartib raqami (masalan, 1):", String((adminData.modules?.length || 0) + 1));
  if (orderIndex === null) return;

  adminApi("/api/admin/modules/add", {
    title: title.trim(),
    order_index: Number(orderIndex) || 1
  }).then(() => {
    showToast("Modul qo'shildi!");
    adminSetTab("modules");
  }).catch(err => showAlert(err.message));
}

function openEditModuleModal(id, currentTitle, currentOrder) {
  const title = prompt("Modul yangi nomi:", currentTitle);
  if (!title || !title.trim()) return;

  const orderIndex = prompt("Modul tartib raqami:", String(currentOrder));
  if (orderIndex === null) return;

  adminApi(`/api/admin/modules/${Number(id)}/update`, {
    title: title.trim(),
    order_index: Number(orderIndex)
  }).then(() => {
    showToast("Modul yangilandi!");
    adminSetTab("modules");
  }).catch(err => showAlert(err.message));
}

function deleteAdminModule(id) {
  showConfirm(
    "Modul o'chirilsinmi?",
    "DIQQAT: Modul o'chirilsa, uning ichidagi barcha darslar va fayllar ham to'liq o'chiriladi!",
    "Ha, o'chirish",
    async () => {
      await adminApi(`/api/admin/modules/${Number(id)}/delete`);
      showToast("Modul o'chirildi!");
      adminSetTab("modules");
    }
  );
}

// ------------------------------------------------------
// Admin Lessons CRUD
// ------------------------------------------------------
function renderAdminLessons() {
  const modules = adminData.modules || [];

  return `
    <div class="admin-section-header">
      <div class="admin-section-title">Barcha Darslar</div>
      <button class="admin-small-btn" onclick="openAddLessonView()">➕ Yangi Dars</button>
    </div>

    ${modules.length ? modules.map((m, idx) => `
      <div class="admin-module-card">
        <div class="admin-module-title" style="cursor:pointer;" onclick="loadModuleLessonsForAdmin(${Number(m.id)})">
          <span>${idx + 1}. ${escapeHtml(m.title)}</span>
          <span style="font-size:12px; color:var(--accent);">Darslarni ko'rish ↓</span>
        </div>
        <div id="admin-module-lessons-${Number(m.id)}" style="display:none;"></div>
      </div>
    `).join("") : `<div class="empty-box">Dars qo'shishdan oldin modul yarating.</div>`}
  `;
}

async function loadModuleLessonsForAdmin(moduleId) {
  const container = document.getElementById(`admin-module-lessons-${Number(moduleId)}`);
  if (!container) return;

  if (container.style.display === "block") {
    container.style.display = "none";
    return;
  }

  container.innerHTML = `<div style="padding:14px; text-align:center;">Yuklanmoqda...</div>`;
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
              ${l.is_free ? "🟢 Namuna" : "🔒 Pullik"} · Fayllar: ${l.file_count || 0}
            </div>
          </div>
        </div>
        <div class="admin-lesson-actions">
          <button onclick="openEditLessonView(${Number(l.id)})">✏️</button>
          <button onclick="deleteAdminLesson(${Number(l.id)}, ${Number(moduleId)})">🗑️</button>
        </div>
      </div>
    `).join("");
  } catch (error) {
    container.innerHTML = `<div class="empty-box">${escapeHtml(error.message)}</div>`;
  }
}

function openAddLessonView() {
  const modules = adminData.modules || [];
  if (!modules.length) return showAlert("Avval kamida bitta modul yarating.");

  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="adminSetTab('lessons')">← Darslarga qaytish</div>
        <div class="page-title">Yangi Dars Qo'shish</div>

        <div class="admin-form">
          <div class="apple-field">
            <label>Modulni tanlang</label>
            <select id="new-l-module" class="apple-input">
              ${modules.map(m => `<option value="${Number(m.id)}">${escapeHtml(m.title)}</option>`).join("")}
            </select>
          </div>

          <div class="apple-field">
            <label>Dars tartib raqami</label>
            <input id="new-l-order" class="apple-input" type="number" placeholder="Masalan: 1">
          </div>

          <div class="apple-field">
            <label>Dars nomi</label>
            <input id="new-l-title" class="apple-input" type="text" placeholder="Masalan: 1-Dars. Revit interfeysi">
          </div>

          <div class="apple-field">
            <label>YouTube Video Link (Unlisted)</label>
            <input id="new-l-yt" class="apple-input" type="url" placeholder="https://youtu.be/...">
          </div>

          <div class="apple-field">
            <label>Bunny Stream Video ID (ixtiyoriy)</label>
            <input id="new-l-bunny" class="apple-input" type="text" placeholder="Video ID">
          </div>

          <div class="apple-field">
            <label>Dars vazifasi (ixtiyoriy)</label>
            <textarea id="new-l-task" class="apple-input apple-textarea" placeholder="O'quvchi uchun amaliy topshiriq..."></textarea>
          </div>

          <div class="apple-field">
            <label>Ogohlantirish / Warning (ixtiyoriy)</label>
            <textarea id="new-l-warning" class="apple-input apple-textarea" placeholder="⚠️ Ogohlantirish matni..."></textarea>
          </div>

          <label class="apple-check-row">
            <input id="new-l-free" type="checkbox">
            <div>
              <div class="apple-check-title">Ochiq / Bepul namuna dars</div>
              <div class="apple-check-text">Kursni sotib olmagan foydalanuvchilar ham ko'ra oladi</div>
            </div>
          </label>

          <button class="btn" onclick="submitCreateLesson()">
            💾 Darsni saqlash
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
  const task = document.getElementById("new-l-task")?.value.trim();
  const warning = document.getElementById("new-l-warning")?.value.trim();
  const isFree = document.getElementById("new-l-free")?.checked;

  if (!moduleId || !orderIndex || !title) {
    return showAlert("Modul, tartib raqam va dars nomi majburiy!");
  }

  try {
    haptic("medium");
    await adminApi("/api/admin/lesson", {
      module_id: Number(moduleId),
      order_index: Number(orderIndex),
      title,
      youtube_url: ytUrl || null,
      bunny_video_id: bunnyId || null,
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
          <div class="back-btn" onclick="adminSetTab('lessons')">← Ortga qaytish</div>
          <div class="page-title">Darsni tahrirlash</div>

          <div class="admin-form">
            <div class="apple-field">
              <label>Dars nomi</label>
              <input id="edit-l-title" class="apple-input" type="text" value="${escapeHtml(lesson.title)}">
            </div>

            <div class="apple-field">
              <label>YouTube Video Link</label>
              <input id="edit-l-yt" class="apple-input" type="url" value="${escapeHtml(lesson.youtube_url || '')}">
            </div>

            <div class="apple-field">
              <label>Bunny Video ID</label>
              <input id="edit-l-bunny" class="apple-input" type="text" value="${escapeHtml(lesson.bunny_video_id || '')}">
            </div>

            <div class="apple-field">
              <label>Vazifa matni</label>
              <textarea id="edit-l-task" class="apple-input apple-textarea">${escapeHtml(lesson.task_text || '')}</textarea>
            </div>

            <div class="apple-field">
              <label>Ogohlantirish (Warning)</label>
              <textarea id="edit-l-warning" class="apple-input apple-textarea">${escapeHtml(lesson.warning_text || '')}</textarea>
            </div>

            <button class="btn" onclick="submitUpdateLesson(${Number(lessonId)})">
              💾 Darsni yangilash
            </button>
          </div>

          <div class="section-title" style="margin-top:24px;">📁 Dars Materiallari (Fayllar)</div>
          <div class="lesson-files">
            ${files.map(f => `
              <div class="lesson-file">
                <div class="lesson-file-info">
                  <span>📄</span>
                  <span>${escapeHtml(f.file_name)}</span>
                </div>
                <button class="btn danger" style="width:auto; margin:0; padding:6px 12px; font-size:12px;" onclick="deleteLessonFile(${Number(f.id)}, ${Number(lessonId)})">
                  O'chirish
                </button>
              </div>
            `).join("")}
          </div>

          <div class="apple-registration-form" style="background:var(--bg-surface); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border); margin-top:14px;">
            <div style="font-weight:700; font-size:13.5px; margin-bottom:10px;">➕ Yangi fayl biriktirish:</div>
            <input id="new-file-name" class="apple-input" type="text" placeholder="Fayl nomi (masalan: Revit_Shablon.rar)" style="margin-bottom:8px;">
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
  const title = document.getElementById("edit-l-title")?.value.trim();
  const ytUrl = document.getElementById("edit-l-yt")?.value.trim();
  const bunnyId = document.getElementById("edit-l-bunny")?.value.trim();
  const task = document.getElementById("edit-l-task")?.value.trim();
  const warning = document.getElementById("edit-l-warning")?.value.trim();

  if (!title) return showAlert("Dars nomi majburiy!");

  try {
    haptic("medium");
    await adminApi(`/api/admin/lesson/${Number(lessonId)}/update`, {
      module_id: 1, // backend saqlaydi
      order_index: 1,
      title,
      youtube_url: ytUrl || null,
      bunny_video_id: bunnyId || null,
      task_text: task || null,
      warning_text: warning || null,
      is_free: false
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
    "Ushbu dars va unga tegishli barcha materiallar o'chiriladi.",
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
  if (!name || !url) return showAlert("Fayl nomi va linki kiritilishi shart!");

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
    "Ushbu material darsdan olib tashlanadi.",
    "O'chirish",
    async () => {
      await adminApi(`/api/admin/file/${Number(fileId)}/delete`);
      showToast("Material o'chirildi!");
      openEditLessonView(lessonId);
    }
  );
}

// ------------------------------------------------------
// Admin Admins (Super Admin Only)
// ------------------------------------------------------
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
