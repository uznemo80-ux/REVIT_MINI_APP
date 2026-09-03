const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const initData = tg.initData || "";
const app = document.getElementById("app");


// ======================================================
// HTML ESCAPE
// ======================================================

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// ======================================================
// JS STRING ESCAPE
// ======================================================

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
// THEME
// ======================================================

let currentTheme =
  localStorage.getItem("theme") || "dark";

function applyTheme(theme) {
  document.documentElement.classList.toggle(
    "light",
    theme === "light"
  );
}

applyTheme(currentTheme);

function toggleTheme() {
  currentTheme =
    currentTheme === "dark"
      ? "light"
      : "dark";

  localStorage.setItem("theme", currentTheme);

  haptic();
  render();
}


// ======================================================
// HAPTIC
// ======================================================

function haptic(style = "light") {
  try {
    tg.HapticFeedback.impactOccurred(style);
  } catch (e) {}
}


// ======================================================
// TELEGRAM ALERT
// ======================================================

function showAlert(message) {
  try {
    tg.showAlert(String(message || ""));
  } catch (e) {
    alert(String(message || ""));
  }
}


// ======================================================
// CONFIRM
// ======================================================

function showConfirm(
  title,
  message,
  confirmLabel,
  onConfirm
) {
  const overlay =
    document.createElement("div");

  overlay.className =
    "modal-overlay";

  overlay.innerHTML = `
    <div class="modal-card">

      <div class="modal-title">
        ${escapeHtml(title)}
      </div>

      <div class="modal-msg">
        ${escapeHtml(message)}
      </div>

      <div class="modal-actions">

        <button class="modal-btn cancel">
          Bekor qilish
        </button>

        <button class="modal-btn confirm">
          ${escapeHtml(confirmLabel)}
        </button>

      </div>

    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector(".cancel")?.addEventListener(
    "click",
    () => {
      haptic();
      overlay.remove();
    }
  );

  overlay.querySelector(".confirm")?.addEventListener(
    "click",
    async () => {
      haptic("medium");
      overlay.remove();

      try {
        await onConfirm();
      } catch (error) {
        console.error("CONFIRM ERROR:", error);
        showAlert(
          error.message ||
          "Amalni bajarishda xatolik."
        );
      }
    }
  );
}


// ======================================================
// STATE
// ======================================================

let state = {
  has_access: false,
  modules: [],
  access_until: null,

  first_name: "",
  last_name: "",
  phone: "",
  telegram_id: "",

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
// API
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
    throw new Error(
      "Serverdan noto‘g‘ri javob keldi."
    );
  }

  if (!res.ok) {
    throw new Error(
      data.message ||
      data.error ||
      "Server xatosi"
    );
  }

  return data;
}


// ======================================================
// AUTH
// ======================================================

async function loadAuth() {
  try {
    if (!initData) {
      throw new Error(
        "Telegram ma'lumotlari topilmadi. Mini App'ni Telegram ichidan oching."
      );
    }

    const data =
      await api("/api/auth");

    state = {
      ...state,
      ...data,

      first_name:
        data.first_name || "",

      last_name:
        data.last_name || "",

      phone:
        data.phone || "",

      telegram_id:
        data.telegram_id || "",

      registered:
        data.registered === true,

      has_access:
        data.has_access === true,

      is_admin:
        data.is_admin === true,

      admin_role:
        data.admin_role || null
    };

    return data;

  } catch (error) {

    console.error(
      "AUTH ERROR:",
      error
    );

    state.is_admin = false;
    state.admin_role = null;

    throw error;
  }
}


// ======================================================
// REGISTRATION
// ======================================================

function renderRegistration() {

  const tgUser =
    tg.initDataUnsafe?.user || {};

  const firstName =
    state.first_name ||
    tgUser.first_name ||
    "";

  const lastName =
    state.last_name ||
    tgUser.last_name ||
    "";

  currentView = {
    html: `
      <div class="apple-registration">

        <div class="apple-registration-brand">

          <div class="apple-registration-logo">
            Y
          </div>

          <div class="apple-registration-brand-name">
            YOSHUZBEKK Academy
          </div>

        </div>


        <div class="apple-registration-content">

          <div class="apple-registration-icon">
            👋
          </div>

          <h1>
            Xush kelibsiz!
          </h1>

          <p class="apple-registration-description">
            Kursdan foydalanishni boshlash uchun
            ma’lumotlaringizni kiriting.
          </p>


          <div class="apple-registration-form">

            <div class="apple-registration-field">

              <label>
                Ism
              </label>

              <input
                id="register-first-name"
                type="text"
                autocomplete="given-name"
                placeholder="Ismingiz"
                value="${escapeHtml(firstName)}"
              >

            </div>


            <div class="apple-registration-field">

              <label>
                Familiya
              </label>

              <input
                id="register-last-name"
                type="text"
                autocomplete="family-name"
                placeholder="Familiyangiz"
                value="${escapeHtml(lastName)}"
              >

            </div>


            <div class="apple-registration-field">

              <label>
                Telefon raqam
              </label>

              <div class="apple-phone-input">

                <span>
                  +998
                </span>

                <input
                  id="register-phone"
                  type="tel"
                  inputmode="numeric"
                  autocomplete="tel"
                  placeholder="90 123 45 67"
                >

              </div>

            </div>


            <button
              id="registration-submit"
              class="apple-registration-button"
              onclick="submitRegistration()"
            >

              Davom etish

              <span>
                →
              </span>

            </button>

          </div>


          <div class="apple-registration-note">

            Ma’lumotlaringiz faqat kursdan foydalanish
            va siz bilan bog‘lanish uchun ishlatiladi.

          </div>

        </div>

      </div>
    `
  };

  render();
}


// ======================================================
// SUBMIT REGISTRATION
// ======================================================

async function submitRegistration() {

  const firstName =
    document.getElementById(
      "register-first-name"
    )?.value.trim();

  const lastName =
    document.getElementById(
      "register-last-name"
    )?.value.trim();

  const phone =
    document.getElementById(
      "register-phone"
    )?.value.trim();


  if (!firstName) {
    showAlert(
      "Iltimos, ismingizni kiriting."
    );
    return;
  }


  if (!lastName) {
    showAlert(
      "Iltimos, familiyangizni kiriting."
    );
    return;
  }


  if (!phone) {
    showAlert(
      "Iltimos, telefon raqamingizni kiriting."
    );
    return;
  }


  const phoneDigits =
    phone.replace(/[^\d]/g, "");

  if (phoneDigits.length < 9) {
    showAlert(
      "Telefon raqamini to‘g‘ri kiriting."
    );
    return;
  }


  const button =
    document.getElementById(
      "registration-submit"
    );

  if (button) {
    button.disabled = true;
    button.innerHTML =
      "Saqlanmoqda...";
  }


  try {

    haptic("medium");

    const result =
      await api(
        "/api/register",
        {
          first_name: firstName,
          last_name: lastName,
          phone
        }
      );


    if (!result?.ok) {
      throw new Error(
        result?.message ||
        result?.error ||
        "Ro‘yxatdan o‘tishda xatolik."
      );
    }


    state = {
      ...state,

      ...(result.user || {}),

      first_name:
        result.user?.first_name ||
        firstName,

      last_name:
        result.user?.last_name ||
        lastName,

      phone:
        result.user?.phone ||
        phone,

      registered: true
    };


    showAlert(
      "✅ Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi!"
    );


    await loadContent();

  } catch (error) {

    console.error(
      "REGISTRATION ERROR:",
      error
    );

    showAlert(
      error.message ||
      "Ro‘yxatdan o‘tishda xatolik yuz berdi."
    );


    if (button) {
      button.disabled = false;
      button.innerHTML =
        `Davom etish <span>→</span>`;
    }
  }
}


// ======================================================
// DATE
// ======================================================

function fmtDate(d) {

  if (!d) return null;

  const date =
    new Date(d);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString(
    "uz-UZ",
    {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }
  );
}


// ======================================================
// CONTENT
// ======================================================

async function loadContent() {

  try {

    const data =
      await api("/api/content");


    state = {
      ...state,
      ...data,

      first_name:
        data.first_name ??
        state.first_name ??
        "",

      last_name:
        data.last_name ??
        state.last_name ??
        "",

      phone:
        data.phone ??
        state.phone ??
        "",

      telegram_id:
        data.telegram_id ??
        state.telegram_id ??
        "",

      registered:
        data.registered ??
        state.registered ??
        false,

      is_admin:
        state.is_admin,

      admin_role:
        state.admin_role
    };


    render();

  } catch (error) {

    console.error(
      "CONTENT LOAD ERROR:",
      error
    );

    if (app) {

      app.innerHTML = `
        <div class="page">

          <div class="empty-box">

            Ma'lumotlarni yuklashda
            xatolik yuz berdi.

            <br><br>

            <button
              class="btn"
              onclick="location.reload()"
            >
              🔄 Qayta urinish
            </button>

          </div>

        </div>
      `;
    }

    try {
      showAlert(
        error.message ||
        "Ma'lumotlarni yuklashda xatolik."
      );
    } catch (e) {}
  }
}


// ======================================================
// RENDER
// ======================================================

function render() {

  if (!app) return;

  const body =
    currentView
      ? renderDetailView()
      : renderTab();


  app.innerHTML = `
    <div class="screen">
      ${body}
    </div>

    ${
      !currentView
        ? renderNav()
        : ""
    }
  `;


  const aboutButton =
    document.querySelector(
      ".about-more"
    );


  if (aboutButton) {
    aboutButton.addEventListener(
      "click",
      toggleAbout
    );
  }
}


// ======================================================
// NAV
// ======================================================

function renderNav() {

  const tabs = [
    {
      id: "home",
      label: "Bosh sahifa",
      icon: "⌂"
    },

    {
      id: "lessons",
      label: "Darslar",
      icon: "▤"
    },

    {
      id: "tasks",
      label: "Vazifalar",
      icon: "✎"
    },

    {
      id: "chat",
      label: "Chat",
      icon: "◈"
    },

    {
      id: "profile",
      label: "Profil",
      icon: "◍"
    }
  ];


  return `
    <div class="nav">

      ${tabs.map(t => `
        <div
          class="nav-item ${
            activeTab === t.id
              ? "active"
              : ""
          }"
          onclick="setTab('${t.id}')"
        >

          <div class="nav-icon">
            ${t.icon}
          </div>

          <div class="nav-label">
            ${t.label}
          </div>

        </div>
      `).join("")}

    </div>
  `;
}


function setTab(id) {

  haptic();

  activeTab = id;
  currentView = null;

  render();

  requestAnimationFrame(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  });
}


function renderTab() {

  switch (activeTab) {

    case "home":
      return renderHome();

    case "lessons":
      return renderLessons();

    case "tasks":
      return renderTasks();

    case "chat":
      return renderChat();

    case "profile":
      return renderProfile();

    default:
      return renderHome();
  }
}


// ======================================================
// STATIC CONTENT
// ======================================================

const ABOUT_TEXT = `
Assalomu alaykum! Men Abdulloh — arxitektura va BIM yo'nalishida faoliyat yurituvchi, asosiy ish jarayonida Autodesk Revit dasturidan foydalanadigan mutaxassisman.

Men Revit'ni shunchaki dastur sifatida emas, balki real loyihalarni ishlab chiqish, ishchi chizmalar tayyorlash va loyiha jarayonini tizimli tashkil qilish vositasi sifatida o'rganib, amaliyotda qo'llab kelaman.

Faoliyatim davomida arxitektura va interyer loyihalari, Revit modellashtirish, ishchi chizmalar, spetsifikatsiyalar va loyiha hujjatlari bilan ishlash bo'yicha tajriba orttirganman. Bu sohada 4 yildan beri ishlayman.

Shu tajribalarimni boshqalar bilan bo'lishish maqsadida YOSHUZBEKK Academy loyihasini yo'lga qo'ydim.
`;

const ABOUT_SHORT = `
Assalomu alaykum! Men Abdulloh — arxitektura va BIM yo'nalishida faoliyat yurituvchi, asosiy ish jarayonida Autodesk Revit dasturidan foydalanadigan mutaxassisman.

Men Revit'ni real loyihalarni ishlab chiqish va ishchi chizmalar tayyorlashda amaliyotda qo'llayman.
`;

const COURSE = {
  title:
    "INTPRO — Revit dasturida interyer loyihalash",

  price:
    "1 500 000 so'm",

  totalModules:
    11,

  totalLessons:
    140,

  cover:
    "course-cover.jpg"
};


const TESTIMONIALS = [

  {
    text:
      "Kurs juda tushunarli va amaliy, ishimda darhol qo'llay boshladim.",
    name:
      "O'quvchi ismi"
  },

  {
    text:
      "Har bir dars qadam-baqadam tushuntirilgan.",
    name:
      "O'quvchi ismi"
  },

  {
    text:
      "Vazifalar orqali bilim mustahkam o'rnashib qoldi.",
    name:
      "O'quvchi ismi"
  }

];


const FAQ = [

  {
    q:
      "Kursga qanday to'lov qilaman?",

    a:
      "\"Chat\" bo'limidan \"Adminga murojaat yuborish\" tugmasini bosing, men siz bilan bog'lanib to'lov usulini aytaman."
  },

  {
    q:
      "Kirish huquqi qancha muddatga beriladi?",

    a:
      "To'lov tasdiqlangandan so'ng darslarga 1 yil davomida kirish huquqi beriladi."
  },

  {
    q:
      "Muddatim tugasa nima bo'ladi?",

    a:
      "Darslarga kirish qulflanadi. Yana 1 yilga uzaytirish uchun Chat orqali admin bilan bog'laning."
  },

  {
    q:
      "Namuna darslarni ko'ra olamanmi?",

    a:
      "Ha, ba'zi darslar hammaga bepul ochiq — Darslar bo'limida Namuna belgisi bilan ko'rsatilgan."
  }

];


// ======================================================
// ABOUT
// ======================================================

function toggleAbout() {

  aboutOpen =
    !aboutOpen;

  const shortText =
    document.querySelector(
      ".about-short"
    );

  const fullText =
    document.querySelector(
      ".about-full"
    );

  const button =
    document.querySelector(
      ".about-more"
    );


  if (
    !shortText ||
    !fullText ||
    !button
  ) {
    return;
  }


  if (aboutOpen) {

    shortText.style.display =
      "none";

    fullText.style.display =
      "block";

    button.textContent =
      "Yashirish ↑";

  } else {

    shortText.style.display =
      "block";

    fullText.style.display =
      "none";

    button.textContent =
      "Batafsil ↓";
  }

  haptic();
}


// ======================================================
// HOME
// ======================================================

function renderHome() {

  const modules =
    Array.isArray(state.modules)
      ? state.modules
      : [];


  const myAvailable =
    modules.reduce(
      (total, module) =>
        total +
        (
          Array.isArray(module.lessons)
            ? module.lessons.filter(
                lesson => lesson.available
              ).length
            : 0
        ),
      0
    );


  const myTotal =
    modules.reduce(
      (total, module) =>
        total +
        (
          Array.isArray(module.lessons)
            ? module.lessons.length
            : 0
        ),
      0
    );


  const pct =
    myTotal
      ? Math.round(
          (myAvailable / myTotal) * 100
        )
      : 0;


  return `
    <div class="page">

      <div class="welcome-hero">

        <div class="welcome-title">
          Xush kelibsiz${
            state.first_name
              ? ", " +
                escapeHtml(
                  state.first_name
                )
              : ""
          }
        </div>

        <div class="welcome-sub">
          Revit dasturi bo'yicha darsliklar
        </div>

      </div>


      ${
        myTotal
          ? `
            <div class="progress-wrap">

              <div class="progress-labels">

                <span>
                  Sizning progressingiz
                </span>

                <span>
                  ${pct}%
                </span>

              </div>

              <div class="progress-track">

                <div
                  class="progress-fill"
                  style="width:${pct}%"
                ></div>

              </div>

            </div>
          `
          : ""
      }


      <div class="about-card">

        <div class="about-photo-wrap">

          <img
            class="about-photo"
            src="/admin.jpg?v=2"
            alt="Abdulloh"
          >

        </div>


        <div class="about-text about-short">
          ${ABOUT_SHORT.replace(
            /\n/g,
            "<br><br>"
          )}
        </div>


        <div
          class="about-text about-full"
          style="display:none;"
        >
          ${ABOUT_TEXT.replace(
            /\n/g,
            "<br><br>"
          )}
        </div>


        <div class="about-more">

          ${
            aboutOpen
              ? "Yashirish ↑"
              : "Batafsil ↓"
          }

        </div>

      </div>


      <div class="section-title">
        Kurslar
      </div>


      <div class="course-card">

        <img
          class="course-cover"
          src="${escapeHtml(COURSE.cover)}"
          onerror="this.style.display='none'"
          alt="${escapeHtml(COURSE.title)}"
        >

        <div class="course-body">

          <div class="course-title">
            ${escapeHtml(COURSE.title)}
          </div>

          <div class="course-meta">
            ${COURSE.totalModules}
            modul ·
            ${COURSE.totalLessons}
            dars
          </div>

          <div class="course-price">
            ${escapeHtml(COURSE.price)}
          </div>

          <button
            class="btn"
            onclick="setTab('chat')"
          >
            Kursni sotib olish
          </button>

        </div>

      </div>


      <div class="section-title">
        Bepul darslar
      </div>


      <div
        class="quick-item"
        onclick="setTab('lessons')"
      >

        <span>
          ▶ Namuna darslarni bepul ko'rish
        </span>

        <span>
          →
        </span>

      </div>


      <div class="section-title">
        O'quvchilar fikri
      </div>


      <div class="testi-scroll">

        ${TESTIMONIALS.map(t => `
          <div class="testi-card">

            <div class="testi-text">
              "${escapeHtml(t.text)}"
            </div>

            <div class="testi-name">
              — ${escapeHtml(t.name)}
            </div>

          </div>
        `).join("")}

      </div>


      <div class="section-title">
        Ko'p beriladigan savollar
      </div>


      <div class="faq-list">

        ${FAQ.map((f, i) => `
          <div
            class="faq-item ${
              openFaq === i
                ? "open"
                : ""
            }"
            data-faq="${i}"
          >

            <div
              class="faq-q"
              onclick="toggleFaq(${i})"
            >

              <span>
                ${escapeHtml(f.q)}
              </span>

              <span class="faq-plus">
                ${
                  openFaq === i
                    ? "−"
                    : "+"
                }
              </span>

            </div>

            <div
              class="faq-a"
              style="${
                openFaq === i
                  ? "display:block;"
                  : "display:none;"
              }"
            >
              ${escapeHtml(f.a)}
            </div>

          </div>
        `).join("")}

      </div>

    </div>
  `;
}


// ======================================================
// FAQ
// ======================================================

function toggleFaq(i) {

  if (openFaq === i) {
    openFaq = null;
  } else {
    openFaq = i;
  }

  haptic();
  render();
}


// ======================================================
// LESSONS
// ======================================================

function renderLessons() {

  const modules =
    Array.isArray(state.modules)
      ? state.modules
      : [];


  let html = `
    <div class="page">

      <div class="page-title">
        Darslar
      </div>
  `;


  modules.forEach((module, index) => {

    const lessons =
      Array.isArray(module.lessons)
        ? module.lessons
        : [];


    html += `
      <div
        class="module ${
          module.unlocked
            ? ""
            : "locked"
        }"
      >

        <div
          class="module-head"
          onclick="toggleModule(${module.id})"
        >

          <div>

            <span class="idx">
              ${String(index + 1).padStart(2, "0")}
            </span>

            ${escapeHtml(module.title)}

          </div>


          <div
            class="tag ${
              module.passed_test
                ? "passed"
                : ""
            }"
          >

            ${
              module.unlocked
                ? (
                    module.passed_test
                      ? "Test topshirilgan"
                      : "Ochiq"
                  )
                : "Qulflangan"
            }

          </div>

        </div>


        <div
          class="lesson-list"
          id="mod-${module.id}"
        >

          ${
            lessons.length
              ? lessons.map(lesson => `

                <div
                  class="lesson ${
                    lesson.available
                      ? ""
                      : "disabled"
                  }"
                  onclick="${
                    lesson.available
                      ? `openLesson(${Number(lesson.id)})`
                      : "showLockedInfo()"
                  }"
                >

                  <span>
                    ${escapeHtml(lesson.title)}
                  </span>


                  ${
                    lesson.is_free
                      ? `
                        <span class="free-badge">
                          Namuna
                        </span>
                      `
                      : (
                          lesson.available
                            ? ""
                            : "🔒"
                        )
                  }

                </div>

              `).join("")
              : `
                <div class="empty-box">
                  Bu modulda hali darslar yo'q.
                </div>
              `
          }

        </div>

      </div>
    `;
  });


  if (!modules.length) {

    html += `
      <div class="empty-box">
        Hozircha darslar qo'shilmagan.
      </div>
    `;
  }


  if (!state.has_access) {

    html += `
      <button
        class="btn"
        onclick="setTab('chat')"
      >
        To'liq kirish uchun murojaat qilish
      </button>
    `;
  }


  html += `</div>`;

  return html;
}


function toggleModule(id) {

  const el =
    document.getElementById(
      `mod-${id}`
    );

  if (el) {
    el.classList.toggle("open");
  }
}


function showLockedInfo() {

  haptic();

  showAlert(
    "Bu dars uchun to'lov qilish kerak. \"Chat\" bo'limidan admin bilan bog'laning."
  );
}


// ======================================================
// TASKS
// ======================================================

function renderTasks() {

  const modules =
    Array.isArray(state.modules)
      ? state.modules
      : [];


  const allLessons =
    modules.flatMap(module =>
      (
        Array.isArray(module.lessons)
          ? module.lessons
          : []
      ).map(lesson => ({
        ...lesson,
        moduleTitle:
          module.title
      }))
    );


  const withTasks =
    allLessons.filter(
      lesson =>
        lesson.available &&
        lesson.task_text
    );


  const lockedCount =
    allLessons.filter(
      lesson =>
        !lesson.available
    ).length;


  let html = `
    <div class="page">

      <div class="page-title">
        Vazifalar
      </div>
  `;


  if (!withTasks.length) {

    html += `
      <div class="empty-box">
        Hozircha ochiq vazifalar yo'q.
      </div>
    `;

  } else {

    withTasks.forEach(lesson => {

      html += `
        <div
          class="task-card"
          onclick="openLesson(${Number(lesson.id)})"
        >

          <div class="task-module">
            ${escapeHtml(lesson.moduleTitle)}
          </div>

          <div class="task-title">
            ${escapeHtml(lesson.title)}
          </div>

          <div class="task-text">
            ${escapeHtml(
              lesson.task_text
            ).replace(/\n/g, "<br>")}
          </div>

        </div>
      `;
    });
  }


  if (lockedCount > 0) {

    html += `
      <div class="empty-box">

        🔒 Yana
        ${lockedCount}
        ta vazifa
        to'lovdan keyin ochiladi

      </div>
    `;
  }


  html += `</div>`;

  return html;
}


// ======================================================
// CHAT
// ======================================================

function renderChat() {

  return `
    <div class="page">

      <div class="page-title">
        Chat
      </div>


      <div class="chat-box">

        ${
          state.has_access
            ? `
              <p>
                Obunangiz faol
                ${
                  fmtDate(state.access_until)
                    ? `(${escapeHtml(
                        fmtDate(state.access_until)
                      )} gacha).`
                    : "."
                }
              </p>
            `
            : `
              <p>
                To'liq kirish uchun to'lovni
                admin bilan kelishilgan holda amalga oshirasiz.
              </p>

              <p>
                Quyidagi tugmani bosing —
                so'rovingiz adminga yuboriladi.
              </p>
            `
        }

      </div>


      <button
        class="btn"
        onclick="requestAccess()"
      >
        Adminga murojaat yuborish
      </button>

    </div>
  `;
}


// ======================================================
// REQUEST ACCESS
// ======================================================

async function requestAccess() {

  showConfirm(

    "So'rov yuborilsin?",

    "Adminga to'liq kirish uchun so'rov yuboriladi.",

    "Yuborish",

    async () => {

      try {

        const result =
          await api(
            "/api/request-access"
          );


        if (result.already_pending) {

          showAlert(
            "ℹ️ So‘rovingiz adminga yuborilgan."
          );

          return;
        }


        if (result.ok) {

          haptic("medium");

          showAlert(
            "✅ So‘rovingiz adminga yuborildi!"
          );

          return;
        }


        throw new Error(
          result.error ||
          result.message ||
          "Server noma'lum javob qaytardi."
        );

      } catch (error) {

        console.error(
          "REQUEST ACCESS ERROR:",
          error
        );

        showAlert(
          error.message ||
          "So‘rov yuborishda xatolik."
        );
      }

    }

  );
}


// ======================================================
// PROFILE
// ======================================================

function renderProfile() {

  const fullName = [
    state.first_name || "",
    state.last_name || ""
  ]
    .filter(Boolean)
    .join(" ");


  return `
    <div class="page">

      <div class="page-title">
        Profil
      </div>


      <div class="profile-card">

        <div class="profile-avatar">

          ${
            (
              state.first_name ||
              "?"
            )[0].toUpperCase()
          }

        </div>


        <div class="profile-name">

          ${escapeHtml(
            fullName ||
            "Foydalanuvchi"
          )}

        </div>


        <div class="profile-id">

          ID:
          ${escapeHtml(
            state.telegram_id
          )}

        </div>

      </div>


      ${
        state.is_admin
          ? `
            <button
              class="btn admin-panel-btn"
              onclick="openAdminPanel()"
            >
              👑 Admin Panel
            </button>
          `
          : ""
      }


      <div class="info-row">

        <span>
          Telefon
        </span>

        <span>
          ${escapeHtml(
            state.phone ||
            "Kiritilmagan"
          )}
        </span>

      </div>


      <div class="info-row">

        <span>
          Obuna holati
        </span>

        <span
          class="${
            state.has_access
              ? "ok"
              : "warn"
          }"
        >

          ${
            state.has_access
              ? "Faol"
              : "Yo'q"
          }

        </span>

      </div>


      ${
        state.has_access
          ? `
            <div class="info-row">

              <span>
                Muddat tugash sanasi
              </span>

              <span>
                ${
                  escapeHtml(
                    fmtDate(
                      state.access_until
                    ) || "-"
                  )
                }
              </span>

            </div>
          `
          : ""
      }


      <div class="info-row">

        <span>
          Kunduzgi rejim
        </span>


        <div
          class="apple-toggle ${
            currentTheme === "light"
              ? "on"
              : ""
          }"
          onclick="toggleTheme()"
        >

          <div class="apple-toggle-knob"></div>

        </div>

      </div>


      <button
        class="btn ${
          state.has_access
            ? "secondary"
            : ""
        }"
        onclick="setTab('chat')"
      >

        ${
          state.has_access
            ? "Muddatni uzaytirish uchun murojaat"
            : "To'liq kirish uchun murojaat"
        }

      </button>

    </div>
  `;
}


// ======================================================
// DETAIL
// ======================================================

function renderDetailView() {
  return currentView
    ? currentView.html
    : "";
}


// ======================================================
// WARNING
// ======================================================

const DEFAULT_LESSON_WARNING = `
⚠️ MUHIM OGOHLANTIRISH

Ushbu darslik va undagi materiallar sizga faqat shaxsiy foydalanishingiz uchun berilgan OMONATdir.

Darsliklarni boshqa shaxslarga yuborish, tarqatish, nusxalash, sotish yoki internetga joylashtirish qat'iyan taqiqlanadi.

Iltimos, sizga berilgan ushbu omonatni asrang va boshqalarga tarqatmang.
`;


function renderLessonWarning(warningText) {

  const text =
    warningText &&
    String(warningText).trim()
      ? warningText
      : DEFAULT_LESSON_WARNING;


  return `
    <div class="lesson-warning">

      <div class="lesson-warning-title">
        ⚠️ MUHIM OGOHLANTIRISH
      </div>

      <div class="lesson-warning-text">

        ${escapeHtml(text).replace(
          /\n/g,
          "<br>"
        )}

      </div>

    </div>
  `;
}


// ======================================================
// LESSON FILES RENDER
// ======================================================

function renderLessonFiles(files) {

  if (
    !Array.isArray(files) ||
    !files.length
  ) {
    return "";
  }


  return `
    <div class="lesson-section">

      <div class="section-title">
        📥 Kerakli manba
      </div>


      <div class="files-description">

        Ushbu darsda ishlatilgan fayllarni
        quyidagi tugma orqali yuklab olishingiz mumkin.

      </div>


      <div class="lesson-files">

        ${files.map(file => {

          const name =
            escapeHtml(
              file.file_name ||
              "Dars materiali"
            );


          const url =
            escapeHtml(
              file.file_url ||
              "#"
            );


          return `
            <div class="lesson-file">

              <div class="lesson-file-info">

                <div class="lesson-file-icon">
                  📦
                </div>

                <div class="lesson-file-name">
                  ${name}
                </div>

              </div>


              ${
                file.file_url
                  ? `
                    <a
                      class="download-file-btn"
                      href="${url}"
                      target="_blank"
                      rel="noopener noreferrer"
                      onclick="haptic('light')"
                    >
                      📥 Yuklab olish
                    </a>
                  `
                  : `
                    <button
                      class="download-file-btn"
                      disabled
                    >
                      Fayl mavjud emas
                    </button>
                  `
              }

            </div>
          `;
        }).join("")}

      </div>

    </div>
  `;
}


// ======================================================
// OPEN LESSON
// ======================================================

async function openLesson(id) {

  try {

    haptic("light");


    currentView = {
      html: `
        <div class="lesson-loading">

          <div class="spinner"></div>

          <div>
            Dars yuklanmoqda...
          </div>

        </div>
      `
    };


    render();


    const lesson =
      await api(
        `/api/lesson/${Number(id)}`
      );


    if (
      lesson.error === "locked"
    ) {

      currentView = null;

      render();

      return showLockedInfo();
    }


    if (lesson.error) {

      currentView = null;

      render();

      return showAlert(
        lesson.message ||
        "Darsni ochishda xatolik."
      );
    }


    let videoHtml = "";


    if (
      lesson.video_type === "youtube" &&
      lesson.youtube_player_url
    ) {

      videoHtml = `
        <div class="video-container">

          <iframe
            src="${escapeHtml(
              lesson.youtube_player_url
            )}"
            title="${escapeHtml(
              lesson.title
            )}"
            allow="
              accelerometer;
              autoplay;
              clipboard-write;
              encrypted-media;
              gyroscope;
              picture-in-picture;
              web-share
            "
            allowfullscreen
            loading="lazy"
          ></iframe>

        </div>
      `;

    } else if (
      lesson.video_type === "bunny" &&
      lesson.bunny_player_url
    ) {

      videoHtml = `
        <div class="video-container">

          <iframe
            src="${escapeHtml(
              lesson.bunny_player_url
            )}"
            title="${escapeHtml(
              lesson.title
            )}"
            allow="
              accelerometer;
              autoplay;
              encrypted-media;
              gyroscope;
              picture-in-picture
            "
            allowfullscreen
            loading="lazy"
          ></iframe>

        </div>
      `;

    } else if (
      lesson.youtube_player_url
    ) {

      videoHtml = `
        <div class="video-container">

          <iframe
            src="${escapeHtml(
              lesson.youtube_player_url
            )}"
            title="${escapeHtml(
              lesson.title
            )}"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      `;

    } else if (
      lesson.bunny_player_url
    ) {

      videoHtml = `
        <div class="video-container">

          <iframe
            src="${escapeHtml(
              lesson.bunny_player_url
            )}"
            title="${escapeHtml(
              lesson.title
            )}"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      `;

    } else {

      videoHtml = `
        <div class="lesson-no-video">
          🎬 Ushbu dars uchun video mavjud emas.
        </div>
      `;
    }


    const taskHtml =
      lesson.task_text &&
      String(
        lesson.task_text
      ).trim()
        ? `
          <div class="lesson-section">

            <div class="section-title">
              📋 Vazifa
            </div>

            <div class="task-box">

              ${escapeHtml(
                lesson.task_text
              ).replace(
                /\n/g,
                "<br>"
              )}

            </div>

          </div>
        `
        : "";


    currentView = {

      html: `
        <div class="lesson-detail">

          <div
            class="back-btn"
            onclick="closeDetail()"
          >
            ← Orqaga
          </div>


          ${videoHtml}


          <h2 class="lesson-detail-title">

            ${escapeHtml(
              lesson.title
            )}

          </h2>


          ${taskHtml}


          ${renderLessonFiles(
            lesson.files
          )}


          ${renderLessonWarning(
            lesson.warning_text
          )}

        </div>
      `
    };


    render();


    requestAnimationFrame(() => {

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
      });

    });

  } catch (error) {

    console.error(
      "OPEN LESSON ERROR:",
      error
    );

    currentView = null;

    render();

    showAlert(
      error.message ||
      "Darsni ochishda xatolik."
    );
  }
}


// ======================================================
// CLOSE DETAIL
// ======================================================

function closeDetail() {

  currentView = null;

  render();

  requestAnimationFrame(() => {

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });

  });
}


// ======================================================
// TEST
// ======================================================

async function openTest(moduleId) {

  try {

    const data =
      await api(
        `/api/module/${Number(moduleId)}/test`
      );


    const questions =
      Array.isArray(data.questions)
        ? data.questions
        : [];


    if (!questions.length) {

      showAlert(
        "Bu modul uchun test hali qo'shilmagan."
      );

      return;
    }


    window._answers = {};


    currentView = {

      html: `
        <div class="back-btn"
          onclick="closeDetail()"
        >
          ← Orqaga
        </div>


        <div class="section-title">
          Modul testi
        </div>


        <div id="test-body">

          ${questions.map(q => `

            <div class="test-question">

              <p>
                ${escapeHtml(
                  q.question
                )}
              </p>


              ${
                Array.isArray(q.options)
                  ? q.options.map(
                      (option, index) => `
                        <div
                          class="option"
                          data-q="${Number(q.id)}"
                          data-i="${index}"
                          onclick="selectOption(${Number(q.id)}, ${index})"
                        >
                          ${escapeHtml(
                            option
                          )}
                        </div>
                      `
                    ).join("")
                  : ""
              }

            </div>

          `).join("")}

        </div>


        <button
          class="btn"
          onclick="submitTest(${Number(moduleId)})"
        >
          Yuborish
        </button>
      `
    };


    render();

  } catch (error) {

    console.error(
      "OPEN TEST ERROR:",
      error
    );

    showAlert(
      error.message ||
      "Testni yuklashda xatolik."
    );
  }
}


// ======================================================
// SELECT OPTION
// ======================================================

function selectOption(qId, index) {

  if (!window._answers) {
    window._answers = {};
  }


  window._answers[qId] =
    index;


  document
    .querySelectorAll(
      `.option[data-q="${qId}"]`
    )
    .forEach(el => {

      el.classList.remove(
        "selected"
      );

    });


  document
    .querySelector(
      `.option[data-q="${qId}"][data-i="${index}"]`
    )
    ?.classList.add(
      "selected"
    );


  haptic("light");
}


// ======================================================
// SUBMIT TEST
// ======================================================

async function submitTest(moduleId) {

  try {

    const result =
      await api(
        `/api/module/${Number(moduleId)}/submit`,
        {
          answers:
            window._answers || {}
        }
      );


    if (result.passed) {

      showAlert(
        `Tabriklaymiz! Natija: ${result.score}%. Keyingi modul ochildi.`
      );

    } else {

      showAlert(
        `Natija: ${result.score}%. O'tish uchun kamida 70% kerak.`
      );
    }


    closeDetail();

    await loadContent();

  } catch (error) {

    console.error(
      "SUBMIT TEST ERROR:",
      error
    );

    showAlert(
      error.message ||
      "Test natijasini yuborishda xatolik."
    );
  }
}


// ======================================================
// ADMIN
// ======================================================

let adminView = "dashboard";

let adminData = {
  stats: null,
  students: [],
  modules: [],
  admins: []
};


// ======================================================
// ADMIN API
// ======================================================

async function adminApi(
  path,
  body = {}
) {

  if (!state.is_admin) {

    throw new Error(
      "Sizda admin huquqi mavjud emas."
    );
  }


  return await api(
    path,
    body
  );
}


// ======================================================
// OPEN ADMIN
// ======================================================

async function openAdminPanel() {

  if (!state.is_admin) {

    showAlert(
      "Sizda admin huquqi mavjud emas."
    );

    return;
  }


  haptic("medium");


  currentView = {
    html: `
      <div class="page">

        <div class="lesson-loading">

          <div class="spinner"></div>

          <div>
            Admin panel yuklanmoqda...
          </div>

        </div>

      </div>
    `
  };


  render();


  try {

    await loadAdminStats();

    adminView =
      "dashboard";

    renderAdminPanel();

  } catch (error) {

    console.error(
      "ADMIN PANEL ERROR:",
      error
    );

    showAlert(
      error.message ||
      "Admin panelni yuklashda xatolik."
    );

    closeDetail();
  }
}


// ======================================================
// ADMIN LOAD
// ======================================================

async function loadAdminStats() {

  const data =
    await adminApi(
      "/api/admin/stats"
    );

  adminData.stats =
    data;
}


async function loadAdminStudents() {

  const data =
    await adminApi(
      "/api/admin/students"
    );

  adminData.students =
    Array.isArray(data.students)
      ? data.students
      : [];
}


async function loadAdminModules() {

  const data =
    await adminApi(
      "/api/admin/modules"
    );

  adminData.modules =
    Array.isArray(data.modules)
      ? data.modules
      : [];
}


async function loadAdmins() {

  const data =
    await adminApi(
      "/api/admin/admins"
    );

  adminData.admins =
    Array.isArray(data.admins)
      ? data.admins
      : [];
}


// ======================================================
// ADMIN PANEL
// ======================================================

function renderAdminPanel() {

  currentView = {

    html: `
      <div class="admin-page">

        <div
          class="back-btn"
          onclick="closeDetail()"
        >
          ← Orqaga
        </div>


        <div class="admin-header">

          <div class="admin-title">
            👑 Admin Panel
          </div>

          <div class="admin-role">

            ${
              state.admin_role === "super_admin"
                ? "Super Admin"
                : "Admin"
            }

          </div>

        </div>


        <div class="admin-tabs">

          <button
            class="${
              adminView === "dashboard"
                ? "active"
                : ""
            }"
            onclick="adminOpenDashboard()"
          >
            📊 Statistika
          </button>


          <button
            class="${
              adminView === "students"
                ? "active"
                : ""
            }"
            onclick="adminOpenStudents()"
          >
            👨‍🎓 O'quvchilar
          </button>


          <button
            class="${
              adminView === "lessons"
                ? "active"
                : ""
            }"
            onclick="adminOpenLessons()"
          >
            📚 Darslar
          </button>


          ${
            state.admin_role === "super_admin"
              ? `
                <button
                  class="${
                    adminView === "admins"
                      ? "active"
                      : ""
                  }"
                  onclick="adminOpenAdmins()"
                >
                  👥 Adminlar
                </button>
              `
              : ""
          }

        </div>


        <div class="admin-content">

          ${
            adminView === "dashboard"
              ? renderAdminDashboard()
              : ""
          }

          ${
            adminView === "students"
              ? renderAdminStudents()
              : ""
          }

          ${
            adminView === "lessons"
              ? renderAdminLessons()
              : ""
          }

          ${
            adminView === "admins"
              ? renderAdminAdmins()
              : ""
          }

        </div>

      </div>
    `
  };


  render();
}


// ======================================================
// DASHBOARD
// ======================================================

function renderAdminDashboard() {

  const s =
    adminData.stats || {};


  return `
    <div class="admin-stats-grid">

      <div class="admin-stat-card">
        <div class="admin-stat-icon">
          👨‍🎓
        </div>

        <div class="admin-stat-value">
          ${Number(s.total_students || 0)}
        </div>

        <div class="admin-stat-label">
          Jami o'quvchilar
        </div>
      </div>


      <div class="admin-stat-card">
        <div class="admin-stat-icon">
          💳
        </div>

        <div class="admin-stat-value">
          ${Number(s.paid_students || 0)}
        </div>

        <div class="admin-stat-label">
          To'lov qilganlar
        </div>
      </div>


      <div class="admin-stat-card">
        <div class="admin-stat-icon">
          ✅
        </div>

        <div class="admin-stat-value">
          ${Number(s.active_students || 0)}
        </div>

        <div class="admin-stat-label">
          Faol o'quvchilar
        </div>
      </div>


      <div class="admin-stat-card">
        <div class="admin-stat-icon">
          📚
        </div>

        <div class="admin-stat-value">
          ${Number(s.total_lessons || 0)}
        </div>

        <div class="admin-stat-label">
          Jami darslar
        </div>
      </div>


      <div class="admin-stat-card">
        <div class="admin-stat-icon">
          📦
        </div>

        <div class="admin-stat-value">
          ${Number(s.total_modules || 0)}
        </div>

        <div class="admin-stat-label">
          Jami modullar
        </div>
      </div>

    </div>


    <button
      class="btn"
      onclick="adminOpenDashboard()"
    >
      🔄 Yangilash
    </button>
  `;
}


async function adminOpenDashboard() {

  adminView =
    "dashboard";

  try {

    await loadAdminStats();

    renderAdminPanel();

  } catch (error) {

    showAlert(
      error.message ||
      "Statistikani yuklashda xatolik."
    );
  }
}


// ======================================================
// STUDENTS
// ======================================================

async function adminOpenStudents() {

  try {

    await loadAdminStudents();

    adminView =
      "students";

    renderAdminPanel();

  } catch (error) {

    showAlert(
      error.message ||
      "O'quvchilarni yuklashda xatolik."
    );
  }
}


function renderAdminStudents() {

  const students =
    adminData.students || [];


  if (!students.length) {

    return `
      <div class="empty-box">
        Hozircha o'quvchilar yo'q.
      </div>
    `;
  }


  return `
    <div class="admin-list">

      ${students.map(student => `

        <div
          class="admin-student-card"
          onclick="openAdminStudent(${Number(student.id)})"
        >

          <div class="admin-student-avatar">

            ${
              escapeHtml(
                (
                  student.first_name ||
                  "?"
                )[0]
              ).toUpperCase()
            }

          </div>


          <div class="admin-student-info">

            <div class="admin-student-name">

              ${escapeHtml(
                [
                  student.first_name || "",
                  student.last_name || ""
                ]
                  .filter(Boolean)
                  .join(" ") ||
                "Foydalanuvchi"
              )}

            </div>


            <div class="admin-student-username">

              ${
                student.username
                  ? "@" +
                    escapeHtml(
                      student.username
                    )
                  : "Telegram username yo'q"
              }

            </div>


            ${
              student.phone
                ? `
                  <div class="admin-student-username">
                    📞 ${escapeHtml(
                      student.phone
                    )}
                  </div>
                `
                : ""
            }


            <div class="admin-student-progress">

              Progress:
              ${Number(student.watched_lessons || 0)}
              /
              ${Number(student.total_lessons || 0)}

            </div>

          </div>


          <div>
            ${
              student.has_access
                ? "🟢"
                : "🔴"
            }
          </div>

        </div>

      `).join("")}

    </div>
  `;
}


// ======================================================
// STUDENT DETAIL
// ======================================================

async function openAdminStudent(id) {

  try {

    const data =
      await adminApi(
        `/api/admin/student/${Number(id)}`
      );


    const student =
      data.student || {};


    const fullName = [
      student.first_name || "",
      student.last_name || ""
    ]
      .filter(Boolean)
      .join(" ");


    currentView = {

      html: `
        <div class="admin-page">

          <div
            class="back-btn"
            onclick="adminOpenStudents()"
          >
            ← O'quvchilar
          </div>


          <div class="admin-header">

            <div class="admin-title">

              👨‍🎓 ${
                escapeHtml(
                  fullName ||
                  "O'quvchi"
                )
              }

            </div>

          </div>


          <div class="admin-student-detail">

            <div class="info-row">
              <span>Ism</span>
              <span>
                ${escapeHtml(
                  student.first_name ||
                  "-"
                )}
              </span>
            </div>


            <div class="info-row">
              <span>Familiya</span>
              <span>
                ${escapeHtml(
                  student.last_name ||
                  "-"
                )}
              </span>
            </div>


            <div class="info-row">
              <span>Telefon</span>
              <span>
                ${escapeHtml(
                  student.phone ||
                  "-"
                )}
              </span>
            </div>


            <div class="info-row">
              <span>Telegram ID</span>
              <span>
                ${escapeHtml(
                  String(
                    student.telegram_id ||
                    ""
                  )
                )}
              </span>
            </div>


            <div class="info-row">
              <span>Username</span>
              <span>
                ${
                  student.username
                    ? "@" +
                      escapeHtml(
                        student.username
                      )
                    : "-"
                }
              </span>
            </div>


            <div class="info-row">
              <span>Kirish</span>
              <span>
                ${
                  student.has_access
                    ? "🟢 Faol"
                    : "🔴 Faol emas"
                }
              </span>
            </div>


            ${renderStudentProgress(data)}

          </div>

        </div>
      `
    };


    render();

  } catch (error) {

    showAlert(
      error.message ||
      "O'quvchini yuklashda xatolik."
    );
  }
}


// ======================================================
// STUDENT PROGRESS
// ======================================================

function renderStudentProgress(data) {

  const modules =
    Array.isArray(data.modules)
      ? data.modules
      : [];


  if (!modules.length) {

    return `
      <div class="empty-box">
        Progress ma'lumotlari yo'q.
      </div>
    `;
  }


  return modules.map(module => `

    <div class="admin-progress-module">

      <div class="admin-progress-module-title">

        ${escapeHtml(
          module.title ||
          ""
        )}

      </div>


      ${
        Array.isArray(module.lessons)
          ? module.lessons.map(
              lesson => `

                <div
                  class="admin-progress-lesson"
                >

                  <span>
                    ${escapeHtml(
                      lesson.title ||
                      ""
                    )}
                  </span>

                  <span>
                    ${
                      lesson.watched
                        ? "✅"
                        : "⬜"
                    }
                  </span>

                </div>

              `
            ).join("")
          : ""
      }

    </div>

  `).join("");
}


// ======================================================
// ADMIN LESSONS
// ======================================================

async function adminOpenLessons() {

  try {

    await loadAdminModules();

    adminView =
      "lessons";

    renderAdminPanel();

  } catch (error) {

    console.error(
      "ADMIN LESSONS ERROR:",
      error
    );

    showAlert(
      error.message ||
      "Darslarni yuklashda xatolik."
    );
  }
}


// ======================================================
// RENDER ADMIN LESSONS
// ======================================================

function renderAdminLessons() {

  const modules =
    Array.isArray(adminData.modules)
      ? adminData.modules
      : [];


  return `

    <div class="admin-section-header">

      <div class="admin-section-title">
        📚 Kurs darslari
      </div>


      <button
        class="admin-small-btn"
        onclick="openAddLessonForm()"
      >
        ➕ Dars
      </button>

    </div>


    ${
      modules.length
        ? modules.map(
            (module, moduleIndex) => {

              const lessons =
                Array.isArray(module.lessons)
                  ? module.lessons
                  : [];


              return `
                <div class="admin-module-card">

                  <div class="admin-module-title">

                    ${String(
                      moduleIndex + 1
                    ).padStart(2, "0")}.
                    ${escapeHtml(
                      module.title
                    )}

                  </div>


                  ${
                    lessons.length
                      ? lessons.map(
                          lesson => `

                            <div
                              class="admin-lesson-card"
                            >

                              <div class="admin-lesson-info">

                                <div class="admin-lesson-number">

                                  ${
                                    escapeHtml(
                                      lesson.order_index ??
                                      ""
                                    )
                                  }

                                </div>


                                <div>

                                  <div class="admin-lesson-title">

                                    ${escapeHtml(
                                      lesson.title ||
                                      ""
                                    )}

                                  </div>


                                  <div class="admin-lesson-meta">

                                    ${
                                      lesson.is_free
                                        ? "🟢 Namuna"
                                        : "🔒 Pullik"
                                    }

                                    ${
                                      lesson.video_type
                                        ? " · " +
                                          escapeHtml(
                                            lesson.video_type
                                          )
                                        : ""
                                    }

                                  </div>

                                </div>

                              </div>


                              <div class="admin-lesson-actions">

                                <button
                                  type="button"
                                  onclick="event.stopPropagation(); openAdminLessonEdit(${Number(lesson.id)})"
                                >
                                  ✏️
                                </button>


                                <button
                                  type="button"
                                  onclick="event.stopPropagation(); deleteAdminLesson(${Number(lesson.id)})"
                                >
                                  🗑️
                                </button>

                              </div>

                            </div>

                          `
                        ).join("")
                      : `
                        <div class="empty-box">
                          Bu modulda dars yo'q.
                        </div>
                      `
                  }

                </div>
              `;
            }
          ).join("")
        : `
          <div class="empty-box">
            Hozircha modullar topilmadi.
          </div>
        `
    }

  `;
}


// ======================================================
// ADD LESSON FORM
// ======================================================

function openAddLessonForm() {

  const modules =
    Array.isArray(adminData.modules)
      ? adminData.modules
      : [];


  if (!modules.length) {

    showAlert(
      "Avval modul yaratilgan bo‘lishi kerak."
    );

    return;
  }


  currentView = {

    html: `
      <div class="admin-page">

        <div
          class="back-btn"
          onclick="adminOpenLessons()"
        >
          ← Darslar
        </div>


        <div class="admin-title">
          ➕ Yangi dars qo'shish
        </div>


        <div class="admin-form">

          <div class="apple-field">

            <label>
              Modul
            </label>

            <select
              id="new-lesson-module"
              class="apple-input"
            >

              ${modules.map(
                (module, index) => `

                  <option
                    value="${Number(module.id)}"
                  >

                    ${index + 1}.
                    ${escapeHtml(
                      module.title
                    )}

                  </option>

                `
              ).join("")}

            </select>

          </div>


          <div class="apple-field">

            <label>
              Dars raqami
            </label>

            <input
              id="new-lesson-order"
              class="apple-input"
              type="number"
              min="1"
              placeholder="Masalan: 1"
            >

          </div>


          <div class="apple-field">

            <label>
              Dars nomi
            </label>

            <input
              id="new-lesson-title"
              class="apple-input"
              type="text"
              placeholder="Masalan: Revit interfeysi"
            >

          </div>


          <div class="apple-field">

            <label>
              YouTube video
            </label>

            <input
              id="new-lesson-youtube"
              class="apple-input"
              type="url"
              placeholder="YouTube link"
            >

          </div>


          <div class="apple-field">

            <label>
              Bunny Video ID
            </label>

            <input
              id="new-lesson-bunny"
              class="apple-input"
              type="text"
              placeholder="Bunny Video ID"
            >

          </div>


          <div class="apple-field">

            <label>
              Vazifa
            </label>

            <textarea
              id="new-lesson-task"
              class="apple-input apple-textarea"
              placeholder="Dars vazifasi..."
            ></textarea>

          </div>


          <div class="apple-field">

            <label>
              Ogohlantirish
            </label>

            <textarea
              id="new-lesson-warning"
              class="apple-input apple-textarea"
            >${escapeHtml(
              DEFAULT_LESSON_WARNING
            )}</textarea>

          </div>


          <label class="apple-check-row">

            <input
              id="new-lesson-free"
              type="checkbox"
            >

            <div>

              <div class="apple-check-title">
                Namuna dars
              </div>

              <div class="apple-check-text">
                Bu dars hammaga bepul ochiladi.
              </div>

            </div>

          </label>


          <button
            class="apple-save-button"
            onclick="createAdminLesson()"
          >
            ➕ Darsni qo'shish
          </button>

        </div>

      </div>
    `
  };


  render();
}


// ======================================================
// CREATE LESSON
// ======================================================

async function createAdminLesson() {

  const moduleId =
    document.getElementById(
      "new-lesson-module"
    )?.value;


  const orderIndex =
    document.getElementById(
      "new-lesson-order"
    )?.value;


  const title =
    document.getElementById(
      "new-lesson-title"
    )?.value.trim();


  const youtubeUrl =
    document.getElementById(
      "new-lesson-youtube"
    )?.value.trim();


  const bunnyVideoId =
    document.getElementById(
      "new-lesson-bunny"
    )?.value.trim();


  const taskText =
    document.getElementById(
      "new-lesson-task"
    )?.value.trim();


  const warningText =
    document.getElementById(
      "new-lesson-warning"
    )?.value.trim();


  const isFree =
    document.getElementById(
      "new-lesson-free"
    )?.checked === true;


  if (!moduleId) {

    showAlert(
      "Modulni tanlang."
    );

    return;
  }


  if (!orderIndex) {

    showAlert(
      "Dars raqamini kiriting."
    );

    return;
  }


  if (!title) {

    showAlert(
      "Dars nomini kiriting."
    );

    return;
  }


  try {

    await adminApi(
      "/api/admin/lesson/add",
      {
        module_id:
          Number(moduleId),

        order_index:
          Number(orderIndex),

        title,

        youtube_url:
          youtubeUrl || null,

        bunny_video_id:
          bunnyVideoId || null,

        task_text:
          taskText || null,

        warning_text:
          warningText || null,

        is_free:
          isFree
      }
    );


    showAlert(
      "✅ Dars qo'shildi."
    );


    await adminOpenLessons();

  } catch (error) {

    console.error(
      "CREATE LESSON ERROR:",
      error
    );

    showAlert(
      error.message ||
      "Dars qo'shishda xatolik."
    );
  }
}


// ======================================================
// EDIT LESSON
// ======================================================

async function openAdminLessonEdit(id) {

  try {

    const lesson =
      await api(
        `/api/lesson/${Number(id)}`
      );


    if (
      lesson.error
    ) {

      throw new Error(
        lesson.message ||
        "Dars topilmadi."
      );
    }


    const modules =
      Array.isArray(adminData.modules)
        ? adminData.modules
        : [];


    const safeLessonTitle =
      escapeJsString(
        lesson.title || ""
      );


    currentView = {

      html: `
        <div class="admin-page">

          <div
            class="back-btn"
            onclick="adminOpenLessons()"
          >
            ← Darslar
          </div>


          <div class="admin-title">
            ✏️ Darsni tahrirlash
          </div>


          <div class="admin-form">


            <div class="apple-field">

              <label>
                Modul
              </label>

              <select
                id="edit-lesson-module"
                class="apple-input"
              >

                ${
                  modules.map(
                    (module, index) => `

                      <option
                        value="${Number(module.id)}"
                        ${
                          Number(module.id) ===
                          Number(lesson.module_id)
                            ? "selected"
                            : ""
                        }
                      >

                        ${index + 1}.
                        ${escapeHtml(
                          module.title
                        )}

                      </option>

                    `
                  ).join("")
                }

              </select>

            </div>


            <div class="apple-field">

              <label>
                Dars raqami
              </label>

              <input
                id="edit-lesson-order"
                class="apple-input"
                type="number"
                min="1"
                value="${escapeHtml(
                  lesson.order_index ?? ""
                )}"
              >

            </div>


            <div class="apple-field">

              <label>
                Dars nomi
              </label>

              <input
                id="edit-lesson-title"
                class="apple-input"
                type="text"
                value="${escapeHtml(
                  lesson.title || ""
                )}"
              >

            </div>


            <div class="apple-field">

              <label>
                YouTube video
              </label>

              <input
                id="edit-lesson-youtube"
                class="apple-input"
                type="url"
                value="${escapeHtml(
                  lesson.youtube_url || ""
                )}"
              >

            </div>


            <div class="apple-field">

              <label>
                Bunny Video ID
              </label>

              <input
                id="edit-lesson-bunny"
                class="apple-input"
                type="text"
                value="${escapeHtml(
                  lesson.bunny_video_id || ""
                )}"
              >

            </div>


            <div class="apple-resource-box">

              <div class="apple-resource-icon">
                📎
              </div>

              <div class="apple-resource-info">

                <div class="apple-resource-title">
                  Dars materiallari
                </div>

                <div class="apple-resource-text">
                  Google Drive / boshqa fayl linklarini boshqarish
                </div>

              </div>


              <button
                class="apple-resource-button"
                onclick="openLessonFiles(
                  ${Number(id)},
                  '${safeLessonTitle}'
                )"
              >
                Boshqarish
              </button>

            </div>


            <div class="apple-field">

              <label>
                Vazifa
              </label>

              <textarea
                id="edit-lesson-task"
                class="apple-input apple-textarea"
              >${escapeHtml(
                lesson.task_text || ""
              )}</textarea>

            </div>


            <div class="apple-field">

              <label>
                Ogohlantirish
              </label>

              <textarea
                id="edit-lesson-warning"
                class="apple-input apple-textarea"
              >${escapeHtml(
                lesson.warning_text ||
                DEFAULT_LESSON_WARNING
              )}</textarea>

            </div>


            <label class="apple-check-row">

              <input
                id="edit-lesson-free"
                type="checkbox"
                ${
                  lesson.is_free
                    ? "checked"
                    : ""
                }
              >

              <div>

                <div class="apple-check-title">
                  Namuna dars
                </div>

                <div class="apple-check-text">
                  Dars bepul ko‘rinadi.
                </div>

              </div>

            </label>


            <button
              class="apple-save-button"
              onclick="updateAdminLesson(${Number(id)})"
            >
              💾 O‘zgarishlarni saqlash
            </button>


          </div>

        </div>
      `
    };


    render();

  } catch (error) {

    console.error(
      "EDIT LESSON ERROR:",
      error
    );

    showAlert(
      error.message ||
      "Darsni yuklashda xatolik."
    );
  }
}


// ======================================================
// UPDATE LESSON
// ======================================================

async function updateAdminLesson(id) {

  const moduleId =
    document.getElementById(
      "edit-lesson-module"
    )?.value;


  const orderIndex =
    document.getElementById(
      "edit-lesson-order"
    )?.value;


  const title =
    document.getElementById(
      "edit-lesson-title"
    )?.value.trim();


  const youtubeUrl =
    document.getElementById(
      "edit-lesson-youtube"
    )?.value.trim();


  const bunnyVideoId =
    document.getElementById(
      "edit-lesson-bunny"
    )?.value.trim();


  const taskText =
    document.getElementById(
      "edit-lesson-task"
    )?.value.trim();


  const warningText =
    document.getElementById(
      "edit-lesson-warning"
    )?.value.trim();


  const isFree =
    document.getElementById(
      "edit-lesson-free"
    )?.checked === true;


  if (!moduleId) {

    showAlert(
      "Modulni tanlang."
    );

    return;
  }


  if (!orderIndex) {

    showAlert(
      "Dars raqamini kiriting."
    );

    return;
  }


  if (!title) {

    showAlert(
      "Dars nomini kiriting."
    );

    return;
  }


  try {

    await adminApi(
      `/api/admin/lesson/${Number(id)}/update`,
      {
        module_id:
          Number(moduleId),

        order_index:
          Number(orderIndex),

        title,

        youtube_url:
          youtubeUrl || null,

        bunny_video_id:
          bunnyVideoId || null,

        task_text:
          taskText || null,

        warning_text:
          warningText || null,

        is_free:
          isFree
      }
    );


    showAlert(
      "✅ Dars yangilandi."
    );


    await adminOpenLessons();

  } catch (error) {

    console.error(
      "UPDATE LESSON ERROR:",
      error
    );

    showAlert(
      error.message ||
      "Darsni saqlashda xatolik."
    );
  }
}


// ======================================================
// DELETE LESSON
// ======================================================

function deleteAdminLesson(id) {

  showConfirm(

    "Darsni o'chirish",

    "Bu darsni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.",

    "O'chirish",

    async () => {

      try {

        await adminApi(
          `/api/admin/lesson/${Number(id)}/delete`
        );


        showAlert(
          "✅ Dars o'chirildi."
        );


        await adminOpenLessons();

      } catch (error) {

        showAlert(
          error.message ||
          "Darsni o'chirishda xatolik."
        );
      }
    }

  );
}


// ======================================================
// LESSON FILES
// ======================================================

async function openLessonFiles(
  lessonId,
  lessonTitle = ""
) {

  try {

    const lesson =
      await api(
        `/api/lesson/${Number(lessonId)}`
      );


    const files =
      Array.isArray(lesson.files)
        ? lesson.files
        : [];


    currentView = {

      html: `
        <div class="admin-page">

          <div
            class="back-btn"
            onclick="adminOpenLessons()"
          >
            ← Darslar
          </div>


          <div class="admin-title">
            📥 Materiallar
          </div>


          <div class="admin-subtitle">

            ${escapeHtml(
              lessonTitle ||
              lesson.title ||
              ""
            )}

          </div>


          <div class="admin-form">

            <input
              id="new-file-name"
              class="apple-input"
              type="text"
              placeholder="Fayl nomi"
            >


            <input
              id="new-file-url"
              class="apple-input"
              type="url"
              placeholder="Google Drive linki"
            >


            <button
              class="btn"
              onclick="addLessonFile(${Number(lessonId)})"
            >
              ➕ Material qo'shish
            </button>

          </div>


          <div class="admin-files-list">

            ${
              files.length
                ? files.map(file => {

                    const fileName =
                      escapeJsString(
                        file.file_name || ""
                      );

                    const fileUrl =
                      escapeJsString(
                        file.file_url || ""
                      );

                    return `

                    <div class="admin-file-card">

                      <div>

                        <div class="admin-file-name">

                          📦 ${
                            escapeHtml(
                              file.file_name ||
                              "Material"
                            )
                          }

                        </div>


                        <div class="admin-file-url">

                          ${
                            escapeHtml(
                              file.file_url ||
                              ""
                            )
                          }

                        </div>

                      </div>


                      <div class="admin-file-actions">

                        <button
                          type="button"
                          onclick="editLessonFile(
                            ${Number(file.id)},
                            ${Number(lessonId)},
                            '${fileName}',
                            '${fileUrl}'
                          )"
                        >
                          ✏️
                        </button>


                        <button
                          type="button"
                          onclick="deleteLessonFile(
                            ${Number(file.id)},
                            ${Number(lessonId)}
                          )"
                        >
                          🗑️
                        </button>

                      </div>

                    </div>

                  `;
                  }).join("")
                : `
                  <div class="empty-box">
                    Bu darsga hali material qo'shilmagan.
                  </div>
                `
            }

          </div>

        </div>
      `
    };


    render();

  } catch (error) {

    console.error(
      "OPEN LESSON FILES ERROR:",
      error
    );

    showAlert(
      error.message ||
      "Materiallarni yuklashda xatolik."
    );
  }
}


// ======================================================
// ADD FILE
// ======================================================

async function addLessonFile(
  lessonId
) {

  const fileName =
    document.getElementById(
      "new-file-name"
    )?.value.trim();


  const fileUrl =
    document.getElementById(
      "new-file-url"
    )?.value.trim();


  if (!fileName) {

    showAlert(
      "Fayl nomini kiriting."
    );

    return;
  }


  if (!fileUrl) {

    showAlert(
      "Fayl linkini kiriting."
    );

    return;
  }


  try {

    await adminApi(
      `/api/admin/lesson/${Number(lessonId)}/files/add`,
      {
        file_name:
          fileName,

        file_url:
          fileUrl
      }
    );


    showAlert(
      "✅ Material qo'shildi."
    );


    await openLessonFiles(
      Number(lessonId)
    );

  } catch (error) {

    showAlert(
      error.message ||
      "Material qo'shishda xatolik."
    );
  }
}


// ======================================================
// EDIT FILE
// ======================================================

function editLessonFile(
  fileId,
  lessonId,
  oldName,
  oldUrl
) {

  currentView = {

    html: `
      <div class="admin-page">

        <div
          class="back-btn"
          onclick="openLessonFiles(${Number(lessonId)})"
        >
          ← Materiallar
        </div>


        <div class="admin-title">
          ✏️ Materialni tahrirlash
        </div>


        <div class="admin-form">

          <input
            id="edit-file-name"
            class="apple-input"
            type="text"
            value="${escapeHtml(oldName)}"
            placeholder="Fayl nomi"
          >


          <input
            id="edit-file-url"
            class="apple-input"
            type="url"
            value="${escapeHtml(oldUrl)}"
            placeholder="Google Drive linki"
          >


          <button
            class="btn"
            onclick="updateLessonFile(
              ${Number(fileId)},
              ${Number(lessonId)}
            )"
          >
            💾 Saqlash
          </button>

        </div>

      </div>
    `
  };


  render();
}


// ======================================================
// UPDATE FILE
// ======================================================

async function updateLessonFile(
  fileId,
  lessonId
) {

  const fileName =
    document.getElementById(
      "edit-file-name"
    )?.value.trim();


  const fileUrl =
    document.getElementById(
      "edit-file-url"
    )?.value.trim();


  if (!fileName || !fileUrl) {

    showAlert(
      "Fayl nomi va linkini kiriting."
    );

    return;
  }


  try {

    await adminApi(
      `/api/admin/file/${Number(fileId)}/update`,
      {
        file_name:
          fileName,

        file_url:
          fileUrl
      }
    );


    showAlert(
      "✅ Material yangilandi."
    );


    await openLessonFiles(
      Number(lessonId)
    );

  } catch (error) {

    showAlert(
      error.message ||
      "Materialni yangilashda xatolik."
    );
  }
}


// ======================================================
// DELETE FILE
// ======================================================

function deleteLessonFile(
  fileId,
  lessonId
) {

  showConfirm(

    "Materialni o'chirish",

    "Ushbu materialni o'chirmoqchimisiz?",

    "O'chirish",

    async () => {

      try {

        await adminApi(
          `/api/admin/file/${Number(fileId)}/delete`
        );


        showAlert(
          "✅ Material o'chirildi."
        );


        await openLessonFiles(
          Number(lessonId)
        );

      } catch (error) {

        showAlert(
          error.message ||
          "Materialni o'chirishda xatolik."
        );
      }

    }

  );
}


// ======================================================
// ADMINS
// ======================================================

async function adminOpenAdmins() {

  if (
    state.admin_role !==
    "super_admin"
  ) {

    showAlert(
      "Faqat Super Admin bu bo'limdan foydalana oladi."
    );

    return;
  }


  try {

    await loadAdmins();

    adminView =
      "admins";

    renderAdminPanel();

  } catch (error) {

    showAlert(
      error.message ||
      "Adminlarni yuklashda xatolik."
    );
  }
}


function renderAdminAdmins() {

  if (
    state.admin_role !==
    "super_admin"
  ) {
    return "";
  }


  return `

    <div class="admin-section-header">

      <div class="admin-section-title">
        👥 Adminlar
      </div>


      <button
        class="admin-small-btn"
        onclick="openAddAdminForm()"
      >
        ➕ Admin
      </button>

    </div>


    <div class="admin-list">

      ${
        adminData.admins.length
          ? adminData.admins.map(
              admin => {

                const telegramId =
                  String(
                    admin.telegram_id ||
                    ""
                  );

                return `

            <div class="admin-admin-card">

              <div>

                <div class="admin-student-name">

                  ${
                    escapeHtml(
                      admin.first_name ||
                      "Admin"
                    )
                  }

                </div>


                <div class="admin-student-username">

                  ID:
                  ${escapeHtml(
                    telegramId
                  )}

                </div>


                <div class="admin-role">

                  ${
                    admin.role ===
                    "super_admin"
                      ? "👑 Super Admin"
                      : "🛡️ Admin"
                  }

                </div>

              </div>


              ${
                telegramId !==
                "8043641301"
                  ? `
                    <button
                      class="admin-delete-btn"
                      onclick="deleteAdmin(${Number(admin.id)})"
                    >
                      🗑️
                    </button>
                  `
                  : `
                    <div class="admin-protected">
                      🔐 Asosiy
                    </div>
                  `
              }

            </div>

          `;
              }
            ).join("")
          : `
            <div class="empty-box">
              Hozircha boshqa adminlar yo'q.
            </div>
          `
      }

    </div>
  `;
}


// ======================================================
// ADD ADMIN
// ======================================================

function openAddAdminForm() {

  if (
    state.admin_role !==
    "super_admin"
  ) {

    showAlert(
      "Faqat Super Admin admin qo'sha oladi."
    );

    return;
  }


  currentView = {

    html: `
      <div class="admin-page">

        <div
          class="back-btn"
          onclick="adminOpenAdmins()"
        >
          ← Adminlar
        </div>


        <div class="admin-title">
          ➕ Admin qo'shish
        </div>


        <div class="admin-form">

          <div class="apple-field">

            <label>
              Telegram ID
            </label>

            <input
              id="new-admin-telegram-id"
              class="apple-input"
              type="number"
              placeholder="Masalan: 123456789"
            >

          </div>


          <div class="apple-field">

            <label>
              Ism
            </label>

            <input
              id="new-admin-name"
              class="apple-input"
              type="text"
              placeholder="Admin ismi"
            >

          </div>


          <div class="apple-field">

            <label>
              Huquq
            </label>

            <select
              id="new-admin-role"
              class="apple-input"
            >

              <option value="admin">
                🛡️ Admin
              </option>

              <option value="super_admin">
                👑 Super Admin
              </option>

            </select>

          </div>


          <button
            class="apple-save-button"
            onclick="addAdmin()"
          >
            ➕ Admin qo'shish
          </button>

        </div>

      </div>
    `
  };


  render();
}


// ======================================================
// ADD ADMIN
// ======================================================

async function addAdmin() {

  const telegramId =
    document.getElementById(
      "new-admin-telegram-id"
    )?.value.trim();


  const firstName =
    document.getElementById(
      "new-admin-name"
    )?.value.trim();


  const role =
    document.getElementById(
      "new-admin-role"
    )?.value;


  if (!telegramId) {

    showAlert(
      "Telegram ID kiriting."
    );

    return;
  }


  try {

    await adminApi(
      "/api/admin/admins/add",
      {
        telegram_id:
          telegramId,

        first_name:
          firstName,

        role
      }
    );


    showAlert(
      "✅ Admin qo'shildi."
    );


    await adminOpenAdmins();

  } catch (error) {

    showAlert(
      error.message ||
      "Admin qo'shishda xatolik."
    );
  }
}


// ======================================================
// DELETE ADMIN
// ======================================================

function deleteAdmin(id) {

  showConfirm(

    "Adminni o'chirish",

    "Ushbu adminni tizimdan o'chirmoqchimisiz?",

    "O'chirish",

    async () => {

      try {

        await adminApi(
          `/api/admin/admins/${Number(id)}/delete`
        );


        showAlert(
          "✅ Admin o'chirildi."
        );


        await adminOpenAdmins();

      } catch (error) {

        showAlert(
          error.message ||
          "Adminni o'chirishda xatolik."
        );
      }
    }

  );
}


// ======================================================
// GLOBAL ERROR HANDLING
// ======================================================

window.addEventListener(
  "error",
  event => {

    console.error(
      "GLOBAL JS ERROR:",
      event.error ||
      event.message
    );

  }
);


window.addEventListener(
  "unhandledrejection",
  event => {

    console.error(
      "UNHANDLED PROMISE ERROR:",
      event.reason
    );

  }
);


// ======================================================
// START
// ======================================================

console.log(
  "🚀 YOSHUZBEKK Academy Mini App ishga tushdi"
);

console.log(
  "📱 Telegram initData:",
  initData
    ? "MAVJUD"
    : "MAVJUD EMAS"
);


// ======================================================
// START APP
// ======================================================

async function startApp() {

  try {

    if (!initData) {

      throw new Error(
        "Telegram ma'lumotlari topilmadi. Mini App'ni Telegram ichidan oching."
      );
    }


    const authData =
      await loadAuth();


    if (!authData) {

      throw new Error(
        "Autentifikatsiya ma'lumotlari olinmadi."
      );
    }


    // ADMIN uchun registration kerak emas

    if (
      !authData.registered &&
      !authData.is_admin
    ) {

      currentView = null;

      activeTab = "home";

      renderRegistration();

      return;
    }


    await loadContent();

  } catch (error) {

    console.error(
      "START APP ERROR:",
      error
    );


    if (app) {

      app.innerHTML = `
        <div class="page">

          <div class="empty-box">

            Ilovani ishga tushirishda
            xatolik yuz berdi.

            <br><br>

            <small>
              ${escapeHtml(
                error.message ||
                "Noma'lum xatolik"
              )}
            </small>

            <br><br>

            <button
              class="btn"
              onclick="location.reload()"
            >
              🔄 Qayta urinish
            </button>

          </div>

        </div>
      `;
    }


    try {

      showAlert(
        error.message ||
        "Ilovani ishga tushirishda xatolik."
      );

    } catch (e) {}
  }
}


startApp();
