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
// THEME
// ======================================================

function applyTheme(theme) {
  document.documentElement.classList.toggle(
    "light",
    theme === "light"
  );
}

let currentTheme =
  localStorage.getItem("theme") || "dark";

applyTheme(currentTheme);

function toggleTheme() {

  currentTheme =
    currentTheme === "dark"
      ? "light"
      : "dark";

  localStorage.setItem(
    "theme",
    currentTheme
  );

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

  const cancelButton =
    overlay.querySelector(".cancel");

  const confirmButton =
    overlay.querySelector(".confirm");

  if (cancelButton) {

    cancelButton.onclick = () => {

      haptic();

      overlay.remove();

    };

  }

  if (confirmButton) {

    confirmButton.onclick = async () => {

      haptic("medium");

      overlay.remove();

      try {

        await onConfirm();

      } catch (error) {

        console.error(
          "CONFIRM ERROR:",
          error
        );

      }

    };

  }

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


// ======================================================
// API
// ======================================================

async function api(path, body = {}) {

  const res =
    await fetch(
      path,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          initData,
          ...body
        })

      }
    );

  let data;

  try {

    data =
      await res.json();

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

    if (!data) {

      throw new Error(
        "Autentifikatsiya ma'lumotlari olinmadi."
      );

    }

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

  if (!app) return;

  app.innerHTML = `

    <div class="screen">

      <div class="page registration-page">

        <div class="registration-card">

          <div class="registration-icon">
            👋
          </div>

          <div class="page-title">
            Xush kelibsiz!
          </div>

          <div class="registration-subtitle">

            Ilovadan foydalanishni boshlash uchun
            ma'lumotlaringizni kiriting.

          </div>


          <div class="admin-form">

            <label>
              Ismingiz
            </label>

            <input
              id="register-first-name"
              type="text"
              autocomplete="given-name"
              placeholder="Masalan: Abdulloh"
            >


            <label>
              Familiyangiz
            </label>

            <input
              id="register-last-name"
              type="text"
              autocomplete="family-name"
              placeholder="Masalan: Karimov"
            >


            <label>
              Telefon raqamingiz
            </label>

            <input
              id="register-phone"
              type="tel"
              inputmode="tel"
              autocomplete="tel"
              placeholder="+998 90 123 45 67"
            >


            <button
              id="register-submit-btn"
              class="btn"
              onclick="submitRegistration()"
            >

              Davom etish

            </button>

          </div>


          <div class="registration-note">

            🔒 Sizning ma'lumotlaringiz faqat
            kurs platformasidan foydalanish va
            siz bilan bog'lanish uchun ishlatiladi.

          </div>

        </div>

      </div>

    </div>

  `;

}


// ======================================================
// SUBMIT REGISTRATION
// ======================================================

async function submitRegistration() {

  const firstName =
    document.getElementById(
      "register-first-name"
    )?.value
      ?.trim();

  const lastName =
    document.getElementById(
      "register-last-name"
    )?.value
      ?.trim();

  const phone =
    document.getElementById(
      "register-phone"
    )?.value
      ?.trim();


  if (!firstName) {

    tg.showAlert(
      "Iltimos, ismingizni kiriting."
    );

    return;

  }


  if (!lastName) {

    tg.showAlert(
      "Iltimos, familiyangizni kiriting."
    );

    return;

  }


  if (!phone) {

    tg.showAlert(
      "Iltimos, telefon raqamingizni kiriting."
    );

    return;

  }


  const phoneDigits =
    phone.replace(/[^\d]/g, "");

  if (phoneDigits.length < 9) {

    tg.showAlert(
      "Telefon raqamini to‘g‘ri kiriting."
    );

    return;

  }


  const button =
    document.getElementById(
      "register-submit-btn"
    );

  if (button) {

    button.disabled = true;

    button.textContent =
      "Saqlanmoqda...";

  }


  try {

    haptic("medium");

    const result =
      await api(
        "/api/register",
        {
          first_name:
            firstName,

          last_name:
            lastName,

          phone:
            phone
        }
      );


    if (!result || !result.ok) {

      throw new Error(
        result?.message ||
        result?.error ||
        "Ro‘yxatdan o‘tishda xatolik yuz berdi."
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

      registered:
        true

    };


    haptic("medium");

    tg.showAlert(
      "✅ Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi!"
    );


    await loadContent();

  } catch (error) {

    console.error(
      "REGISTRATION ERROR:",
      error
    );

    tg.showAlert(
      error.message ||
      "Ro‘yxatdan o‘tishda xatolik yuz berdi."
    );

    if (button) {

      button.disabled = false;

      button.textContent =
        "Davom etish";

    }

  }

}


// ======================================================
// DATE
// ======================================================

function fmtDate(d) {

  if (!d) return null;

  return new Date(d).toLocaleDateString(
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

    if (!data) {

      throw new Error(
        "Kontent topilmadi."
      );

    }

    /*
      Muhim:
      state = data qilish admin ma'lumotlarini o'chirib yuboradi.
      Shuning uchun merge qilamiz.
    */

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

      registered:
        data.registered ??
        state.registered ??
        false,

      telegram_id:
        data.telegram_id ??
        state.telegram_id ??
        "",

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

      tg.showAlert(
        error.message ||
        "Ma'lumotlarni yuklashda xatolik yuz berdi."
      );

    } catch (e) {}

  }

}


// ======================================================
// LAYOUT
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
    document.querySelector(".about-more");

  if (aboutButton) {

    aboutButton.addEventListener(
      "click",
      toggleAbout
    );

  }

}


// ======================================================
// NAVIGATION
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

  if (activeTab === "home") {
    return renderHome();
  }

  if (activeTab === "lessons") {
    return renderLessons();
  }

  if (activeTab === "tasks") {
    return renderTasks();
  }

  if (activeTab === "chat") {
    return renderChat();
  }

  if (activeTab === "profile") {
    return renderProfile();
  }

  return "";

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

Men Revit'ni real loyihalarni ishlab chiqish va ishchi chizmalar tayyorlashda amaliyotda qo'llab kelaman.
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
      "Har bir dars qadam-baqadam tushuntirilgan, hech qanday savol qolmaydi.",
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
      "Darslarga kirish qulflanadi. Yana 1 yilga uzaytirish uchun \"Chat\" orqali admin bilan bog'laning."
  },

  {
    q:
      "Namuna darslarni ko'ra olamanmi?",

    a:
      "Ha, ba'zi darslar hammaga bepul ochiq — \"Darslar\" bo'limida \"Namuna\" belgisi bilan ko'rsatilgan."
  }

];

let openFaq = null;

let aboutOpen = false;


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

      (a, m) =>

        a +
        (
          Array.isArray(m.lessons)
            ? m.lessons.filter(
                l => l.available
              ).length
            : 0
        ),

      0

    );

  const myTotal =
    modules.reduce(

      (a, m) =>

        a +
        (
          Array.isArray(m.lessons)
            ? m.lessons.length
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
            class="faq-item"
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
                +
              </span>

            </div>

            <div
              class="faq-a"
              style="display:none;"
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

  const clickedItem =
    document.querySelector(
      `.faq-item[data-faq="${i}"]`
    );

  if (!clickedItem) return;

  const clickedAnswer =
    clickedItem.querySelector(".faq-a");

  const clickedPlus =
    clickedItem.querySelector(".faq-plus");

  if (
    !clickedAnswer ||
    !clickedPlus
  ) {
    return;
  }

  const isAlreadyOpen =
    clickedItem.classList.contains("open");

  document
    .querySelectorAll(".faq-item.open")
    .forEach(item => {

      item.classList.remove("open");

      const answer =
        item.querySelector(".faq-a");

      const plus =
        item.querySelector(".faq-plus");

      if (answer) {
        answer.style.display = "none";
      }

      if (plus) {
        plus.textContent = "+";
      }

    });

  if (!isAlreadyOpen) {

    clickedItem.classList.add("open");

    clickedAnswer.style.display =
      "block";

    clickedPlus.textContent =
      "−";

  }

  haptic();

}


// ======================================================
// LESSONS
// ======================================================

function renderLessons() {

  let html = `

    <div class="page">

      <div class="page-title">
        Darslar
      </div>

  `;

  const modules =
    Array.isArray(state.modules)
      ? state.modules
      : [];

  modules.forEach(
    (m, i) => {

      const moduleLessons =
        Array.isArray(m.lessons)
          ? m.lessons
          : [];

      html += `

        <div
          class="module ${
            m.unlocked
              ? ""
              : "locked"
          }"
        >

          <div
            class="module-head"
            onclick="toggleModule(${m.id})"
          >

            <div>

              <span class="idx">

                ${String(i + 1)
                  .padStart(2, "0")}

              </span>

              ${escapeHtml(m.title)}

            </div>

            <div
              class="tag ${
                m.passed_test
                  ? "passed"
                  : ""
              }"
            >

              ${
                m.unlocked
                  ? (
                      m.passed_test
                        ? "Test topshirilgan"
                        : "Ochiq"
                    )
                  : "Qulflangan"
              }

            </div>

          </div>


          <div
            class="lesson-list"
            id="mod-${m.id}"
          >

            ${moduleLessons.map(
              l => `

                <div
                  class="lesson ${
                    l.available
                      ? ""
                      : "disabled"
                  }"

                  onclick="${
                    l.available
                      ? `openLesson(${l.id})`
                      : "showLockedInfo()"
                  }"
                >

                  <span>
                    ${escapeHtml(l.title)}
                  </span>

                  ${
                    l.is_free
                      ? `
                        <span class="free-badge">
                          Namuna
                        </span>
                      `
                      : (
                          l.available
                            ? ""
                            : "🔒"
                        )
                  }

                </div>

              `
            ).join("")}

          </div>

        </div>

      `;

    }
  );

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


// ======================================================
// MODULE
// ======================================================

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

  tg.showAlert(
    "Bu dars uchun to'lov qilish kerak. \"Chat\" bo'limidan admin bilan bog'laning."
  );

}


// ======================================================
// TASKS
// ======================================================

function renderTasks() {

  let html = `

    <div class="page">

      <div class="page-title">
        Vazifalar
      </div>

  `;

  const modules =
    Array.isArray(state.modules)
      ? state.modules
      : [];

  const allLessons =
    modules.flatMap(

      m =>

        (
          Array.isArray(m.lessons)
            ? m.lessons
            : []
        ).map(

          l => ({
            ...l,
            moduleTitle: m.title
          })

        )

    );

  const withTasks =
    allLessons.filter(
      l =>
        l.available &&
        l.task_text
    );

  const lockedCount =
    allLessons.filter(
      l => !l.available
    ).length;

  if (!withTasks.length) {

    html += `

      <div class="empty-box">

        Hozircha ochiq vazifalar yo'q.

      </div>

    `;

  } else {

    withTasks.forEach(
      l => {

        html += `

          <div
            class="task-card"
            onclick="openLesson(${l.id})"
          >

            <div class="task-module">
              ${escapeHtml(l.moduleTitle)}
            </div>

            <div class="task-title">
              ${escapeHtml(l.title)}
            </div>

            <div class="task-text">

              ${escapeHtml(
                l.task_text
              ).replace(
                /\n/g,
                "<br>"
              )}

            </div>

          </div>

        `;

      }
    );

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
                (${fmtDate(
                  state.access_until
                )} gacha).

                Muddatni uzaytirish yoki savolingiz bo'lsa,
                admin bilan bog'laning.

              </p>

            `
            : `

              <p>

                To'liq kirish uchun to'lovni tashqarida
                (admin bilan kelishilgan holda) amalga oshirasiz.

                Quyidagi tugmani bosing — so'rovingiz adminga yuboriladi,
                u siz bilan bog'lanadi.

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
// ADMIN REQUEST
// ======================================================

async function requestAccess() {

  showConfirm(

    "So'rov yuborilsin?",

    "Adminga to'liq kirish uchun so'rov yuboriladi. U tez orada siz bilan bog'lanadi.",

    "Yuborish",

    async () => {

      try {

        if (!initData) {

          tg.showAlert(
            "❌ Telegram ma'lumotlari topilmadi. Mini App'ni Telegram ichidan oching."
          );

          return;

        }

        const buttons =
          document.querySelectorAll(".btn");

        buttons.forEach(
          button => {
            button.disabled = true;
          }
        );

        const result =
          await api(
            "/api/request-access"
          );

        if (result.already_pending) {

          haptic("medium");

          tg.showAlert(
            "ℹ️ So‘rovingiz adminga yuborilgan."
          );

          return;

        }

        if (result.ok) {

          haptic("medium");

          tg.showAlert(
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

        tg.showAlert(
          "❌ So‘rov yuborishda xatolik.\n\n" +
          (
            error.message ||
            "Server bilan bog‘lanib bo‘lmadi."
          )
        );

      } finally {

        document
          .querySelectorAll(".btn")
          .forEach(
            button => {
              button.disabled = false;
            }
          );

      }

    }

  );

}


// ======================================================
// ADMIN BUTTON
// ======================================================

function renderAdminButton() {

  if (!state.is_admin) {
    return "";
  }

  return `

    <button
      class="btn admin-panel-btn"
      onclick="openAdminPanel()"
    >

      👑 Admin Panel

    </button>

  `;

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

          ${
            escapeHtml(
              fullName ||
              "Foydalanuvchi"
            )
          }

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
          ? renderAdminButton()
          : ""
      }


      <div class="info-row">

        <span>
          Telefon
        </span>

        <span>

          ${
            escapeHtml(
              state.phone ||
              "Kiritilmagan"
            )
          }

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

                ${fmtDate(
                  state.access_until
                )}

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

          <div
            class="apple-toggle-knob"
          ></div>

        </div>

      </div>


      ${
        !state.has_access
          ? `

            <button
              class="btn"
              onclick="setTab('chat')"
            >

              To'liq kirish uchun murojaat

            </button>

          `
          : `

            <button
              class="btn secondary"
              onclick="setTab('chat')"
            >

              Muddatni uzaytirish uchun murojaat

            </button>

          `
      }

    </div>

  `;

}


// ======================================================
// DETAIL VIEW
// ======================================================

function renderDetailView() {

  return currentView
    ? currentView.html
    : "";

}


// ======================================================
// DEFAULT WARNING
// ======================================================

const DEFAULT_LESSON_WARNING = `
⚠️ MUHIM OGOHLANTIRISH

Ushbu darslik va undagi materiallar sizga faqat shaxsiy foydalanishingiz uchun berilgan OMONATdir.

Darsliklarni boshqa shaxslarga yuborish, tarqatish, nusxalash, sotish yoki internetga joylashtirish qat'iyan taqiqlanadi.

Iltimos, sizga berilgan ushbu omonatni asrang va boshqalarga tarqatmang.
`;


// ======================================================
// WARNING
// ======================================================

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
// FILES
// ======================================================

function renderLessonFiles(files) {

  if (
    !Array.isArray(files) ||
    files.length === 0
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

        ${
          files.map(
            file => {

              const fileName =
                escapeHtml(
                  file.file_name ||
                  "Dars materiali"
                );

              const fileUrl =
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
                      ${fileName}
                    </div>

                  </div>


                  ${
                    file.file_url
                      ? `

                        <a
                          class="download-file-btn"
                          href="${fileUrl}"
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

            }
          ).join("")
        }

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
        `/api/lesson/${id}`
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

      return tg.showAlert(
        lesson.message ||
        "Darsni ochishda xatolik yuz berdi."
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

    }

    else if (
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
              gyroscope;
              autoplay;
              encrypted-media;
              picture-in-picture;
            "
            allowfullscreen
            loading="lazy"
          ></iframe>

        </div>

      `;

    }

    else if (
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

    }

    else if (
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

    }

    else {

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


    const filesHtml =
      renderLessonFiles(
        lesson.files
      );


    const warningHtml =
      renderLessonWarning(
        lesson.warning_text
      );


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


          ${filesHtml}


          ${warningHtml}

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

    tg.showAlert(
      error.message ||
      "Darsni ochishda server bilan bog'lanib bo'lmadi."
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

    const {
      questions
    } = await api(
      `/api/module/${moduleId}/test`
    );

    if (
      !questions ||
      !questions.length
    ) {

      return tg.showAlert(
        "Bu modul uchun test hali qo'shilmagan."
      );

    }

    window._answers = {};

    currentView = {

      html: `

        <div
          class="back-btn"
          onclick="closeDetail()"
        >

          ← Orqaga

        </div>


        <div class="section-title">
          Modul testi
        </div>


        <div id="test-body">

          ${
            questions
              .map(
                q => `

                  <div
                    class="test-question"
                  >

                    <p>
                      ${escapeHtml(
                        q.question
                      )}
                    </p>


                    ${
                      Array.isArray(q.options)
                        ? q.options
                            .map(
                              (opt, i) => `

                                <div
                                  class="option"
                                  data-q="${q.id}"
                                  data-i="${i}"
                                  onclick="selectOption(${q.id}, ${i})"
                                >

                                  ${escapeHtml(
                                    opt
                                  )}

                                </div>

                              `
                            )
                            .join("")
                        : ""
                    }

                  </div>

                `
              )
              .join("")
          }

        </div>


        <button
          class="btn"
          onclick="submitTest(${moduleId})"
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

    tg.showAlert(
      "Testni yuklashda xatolik yuz berdi."
    );

  }

}


// ======================================================
// SELECT OPTION
// ======================================================

function selectOption(qId, i) {

  if (!window._answers) {

    window._answers = {};

  }

  window._answers[qId] = i;

  document
    .querySelectorAll(
      `.option[data-q="${qId}"]`
    )
    .forEach(
      el => {

        el.classList.remove(
          "selected"
        );

      }
    );

  const selected =
    document.querySelector(
      `.option[data-q="${qId}"][data-i="${i}"]`
    );

  if (selected) {

    selected.classList.add(
      "selected"
    );

  }

  haptic("light");

}


// ======================================================
// SUBMIT TEST
// ======================================================

async function submitTest(moduleId) {

  try {

    const result =
      await api(
        `/api/module/${moduleId}/submit`,
        {
          answers:
            window._answers || {}
        }
      );

    if (result.passed) {

      tg.showAlert(
        `Tabriklaymiz! Natija: ${result.score}%. Keyingi modul ochildi.`
      );

    } else {

      tg.showAlert(
        `Natija: ${result.score}%. O'tish uchun kamida 70% kerak. Qayta urinib ko'ring.`
      );

    }

    closeDetail();

    await loadContent();

  } catch (error) {

    console.error(
      "SUBMIT TEST ERROR:",
      error
    );

    tg.showAlert(
      "Test natijasini yuborishda xatolik yuz berdi."
    );

  }

}


// ======================================================
// ======================================================
// ADMIN PANEL
// ======================================================
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

    tg.showAlert(
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

    tg.showAlert(
      error.message ||
      "Admin panelni yuklashda xatolik."
    );

    closeDetail();

  }

}


// ======================================================
// ADMIN STATS
// ======================================================

async function loadAdminStats() {

  const data =
    await adminApi(
      "/api/admin/stats"
    );

  adminData.stats =
    data;

}


// ======================================================
// ADMIN STUDENTS
// ======================================================

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


// ======================================================
// ADMIN MODULES
// ======================================================

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


// ======================================================
// ADMINS LIST
// ======================================================

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
// ADMIN PANEL RENDER
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

          ${s.total_students || 0}

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

          ${s.paid_students || 0}

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

          ${s.active_students || 0}

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

          ${s.total_lessons || 0}

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

          ${s.total_modules || 0}

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


// ======================================================
// DASHBOARD OPEN
// ======================================================

async function adminOpenDashboard() {

  adminView =
    "dashboard";

  try {

    await loadAdminStats();

    renderAdminPanel();

  } catch (error) {

    tg.showAlert(
      error.message
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

    tg.showAlert(
      error.message
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

      ${
        students.map(
          student => `

            <div
              class="admin-student-card"
              onclick="openAdminStudent(${student.id})"
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

                  ${
                    escapeHtml(
                      [
                        student.first_name || "",
                        student.last_name || ""
                      ]
                        .filter(Boolean)
                        .join(" ") ||
                      "Foydalanuvchi"
                    )
                  }

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
                        📞 ${escapeHtml(student.phone)}
                      </div>
                    `
                    : ""
                }


                <div class="admin-student-progress">

                  Progress:
                  ${
                    student.watched_lessons || 0
                  }
                  /
                  ${
                    student.total_lessons || 0
                  }

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

          `
        ).join("")
      }

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
        `/api/admin/student/${id}`
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

              <span>
                Ism
              </span>

              <span>

                ${
                  escapeHtml(
                    student.first_name ||
                    "-"
                  )
                }

              </span>

            </div>


            <div class="info-row">

              <span>
                Familiya
              </span>

              <span>

                ${
                  escapeHtml(
                    student.last_name ||
                    "-"
                  )
                }

              </span>

            </div>


            <div class="info-row">

              <span>
                Telefon
              </span>

              <span>

                ${
                  escapeHtml(
                    student.phone ||
                    "-"
                  )
                }

              </span>

            </div>


            <div class="info-row">

              <span>
                Telegram ID
              </span>

              <span>

                ${
                  escapeHtml(
                    String(
                      student.telegram_id ||
                      ""
                    )
                  )
                }

              </span>

            </div>


            <div class="info-row">

              <span>
                Username
              </span>

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

              <span>
                Kirish
              </span>

              <span>

                ${
                  student.has_access
                    ? "🟢 Faol"
                    : "🔴 Faol emas"
                }

              </span>

            </div>


            ${
              renderStudentProgress(
                data
              )
            }

          </div>

        </div>

      `

    };

    render();

  } catch (error) {

    tg.showAlert(
      error.message
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


  return modules.map(
    module => `

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

                      ${
                        escapeHtml(
                          lesson.title ||
                          ""
                        )
                      }

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

    `
  ).join("");

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
      "ADMIN MODULE ERROR:",
      error
    );

    try {

      const data =
        await api("/api/content");

      adminData.modules =
        Array.isArray(data.modules)
          ? data.modules
          : [];

      adminView =
        "lessons";

      renderAdminPanel();

    } catch (secondError) {

      tg.showAlert(
        error.message
      );

    }

  }

}


// ======================================================
// LESSON LIST
// ======================================================

function renderAdminLessons() {

  const modules =
    adminData.modules || [];

  return `

    <div class="admin-section-header">

      <div class="admin-section-title">
        📚 Modullar va darslar
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
            module => `

              <div class="admin-module-card">

                <div class="admin-module-title">

                  ${escapeHtml(
                    module.title ||
                    ""
                  )}

                </div>


                ${
                  Array.isArray(
                    module.lessons
                  )

                    ? module.lessons.map(
                        lesson => `

                          <div class="admin-lesson-row">

                            <div>

                              <div class="admin-lesson-title">

                                ${
                                  escapeHtml(
                                    lesson.title ||
                                    ""
                                  )
                                }

                              </div>

                              <div class="admin-lesson-meta">

                                ${
                                  lesson.is_free
                                    ? "🟢 Namuna"
                                    : "🔒 Pullik"
                                }

                                ${
                                  lesson.bunny_video_id
                                    ? " · 🐰 Bunny"
                                    : lesson.youtube_url
                                      ? " · ▶️ YouTube"
                                      : " · 🎬 Video yo'q"
                                }

                              </div>

                            </div>


                            <div class="admin-lesson-actions">

                              <button
                                onclick="openEditLessonForm(${lesson.id})"
                              >
                                ✏️
                              </button>

                              <button
                                onclick="openLessonFiles(${lesson.id}, '${escapeHtml(lesson.title || "")}')"
                              >
                                📥
                              </button>

                              <button
                                onclick="deleteAdminLesson(${lesson.id})"
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

            `
          ).join("")

        : `

          <div class="empty-box">

            Modullar topilmadi.

          </div>

        `
    }

  `;

}


// ======================================================
// LESSON FORM
// ======================================================

function openAddLessonForm() {

  const modules =
    adminData.modules || [];

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

          <label>
            Modul
          </label>

          <select id="lesson-module-id">

            <option value="">
              Modulni tanlang
            </option>

            ${
              modules.map(
                m => `

                  <option value="${m.id}">

                    ${escapeHtml(
                      m.title
                    )}

                  </option>

                `
              ).join("")
            }

          </select>


          <label>
            Dars raqami
          </label>

          <input
            id="lesson-order"
            type="number"
            min="1"
            placeholder="Masalan: 2"
          >


          <label>
            Dars nomi
          </label>

          <input
            id="lesson-title"
            type="text"
            placeholder="Masalan: Dars 2 — Devor chizish"
          >


          <label>
            YouTube URL
          </label>

          <input
            id="lesson-youtube"
            type="text"
            placeholder="https://youtube.com/..."
          >


          <label>
            Bunny Video ID
          </label>

          <input
            id="lesson-bunny"
            type="text"
            placeholder="Bunny Video ID (ixtiyoriy)"
          >


          <label>
            Vazifa
          </label>

          <textarea
            id="lesson-task"
            rows="5"
            placeholder="Darsdan keyingi vazifa..."
          ></textarea>


          <label>
            Ogohlantirish
          </label>

          <textarea
            id="lesson-warning"
            rows="7"
            placeholder="Bo'sh qoldirsangiz standart ogohlantirish chiqadi."
          >${escapeHtml(
            DEFAULT_LESSON_WARNING
          )}</textarea>


          <label class="admin-checkbox-label">

            <input
              id="lesson-free"
              type="checkbox"
            >

            🟢 Namuna dars — bepul

          </label>


          <button
            class="btn"
            onclick="createAdminLesson()"
          >

            💾 Darsni saqlash

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
      "lesson-module-id"
    )?.value;

  const orderIndex =
    document.getElementById(
      "lesson-order"
    )?.value;

  const title =
    document.getElementById(
      "lesson-title"
    )?.value
      ?.trim();

  const youtubeUrl =
    document.getElementById(
      "lesson-youtube"
    )?.value
      ?.trim();

  const bunnyVideoId =
    document.getElementById(
      "lesson-bunny"
    )?.value
      ?.trim();

  const taskText =
    document.getElementById(
      "lesson-task"
    )?.value
      ?.trim();

  const warningText =
    document.getElementById(
      "lesson-warning"
    )?.value
      ?.trim();

  const isFree =
    document.getElementById(
      "lesson-free"
    )?.checked;


  if (!moduleId) {

    tg.showAlert(
      "Modulni tanlang."
    );

    return;

  }

  if (!orderIndex) {

    tg.showAlert(
      "Dars raqamini kiriting."
    );

    return;

  }

  if (!title) {

    tg.showAlert(
      "Dars nomini kiriting."
    );

    return;

  }


  try {

    await adminApi(
      "/api/admin/lesson",
      {

        module_id:
          Number(moduleId),

        title:
          title,

        order_index:
          Number(orderIndex),

        youtube_url:
          youtubeUrl || null,

        task_text:
          taskText || null,

        is_free:
          isFree,

        bunny_video_id:
          bunnyVideoId || null,

        warning_text:
          warningText || null

      }
    );


    tg.showAlert(
      "✅ Dars muvaffaqiyatli qo'shildi."
    );


    await adminOpenLessons();

  } catch (error) {

    tg.showAlert(
      error.message
    );

  }

}


// ======================================================
// EDIT LESSON
// ======================================================

async function openEditLessonForm(id) {

  try {

    const lesson =
      await api(
        `/api/lesson/${id}`
      );


    const modules =
      adminData.modules || [];


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

            <label>
              Modul
            </label>

            <select id="edit-lesson-module">

              ${
                modules.map(
                  m => `

                    <option
                      value="${m.id}"
                      ${
                        Number(m.id) ===
                        Number(lesson.module_id)
                          ? "selected"
                          : ""
                      }
                    >

                      ${escapeHtml(
                        m.title
                      )}

                    </option>

                  `
                ).join("")
              }

            </select>


            <label>
              Dars raqami
            </label>

            <input
              id="edit-lesson-order"
              type="number"
              min="1"
              value="${escapeHtml(
                lesson.order_index ||
                ""
              )}"
            >


            <label>
              Dars nomi
            </label>

            <input
              id="edit-lesson-title"
              type="text"
              value="${escapeHtml(
                lesson.title ||
                ""
              )}"
            >


            <label>
              YouTube URL
            </label>

            <input
              id="edit-lesson-youtube"
              type="text"
              value="${escapeHtml(
                lesson.youtube_url ||
                ""
              )}"
            >


            <label>
              Bunny Video ID
            </label>

            <input
              id="edit-lesson-bunny"
              type="text"
              value="${escapeHtml(
                lesson.bunny_video_id ||
                ""
              )}"
            >


            <label>
              Vazifa
            </label>

            <textarea
              id="edit-lesson-task"
              rows="5"
            >${escapeHtml(
              lesson.task_text ||
              ""
            )}</textarea>


            <label>
              Ogohlantirish
            </label>

            <textarea
              id="edit-lesson-warning"
              rows="7"
            >${escapeHtml(
              lesson.warning_text ||
              DEFAULT_LESSON_WARNING
            )}</textarea>


            <label class="admin-checkbox-label">

              <input
                id="edit-lesson-free"
                type="checkbox"
                ${
                  lesson.is_free
                    ? "checked"
                    : ""
                }
              >

              🟢 Namuna dars — bepul

            </label>


            <button
              class="btn"
              onclick="updateAdminLesson(${id})"
            >

              💾 Saqlash

            </button>


            <button
              class="btn secondary"
              onclick="openLessonFiles(${id}, '${escapeHtml(lesson.title || "")}')"
            >

              📥 Dars materiallari

            </button>

          </div>

        </div>

      `

    };

    render();

  } catch (error) {

    tg.showAlert(
      error.message
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
    )?.value
      ?.trim();

  const youtubeUrl =
    document.getElementById(
      "edit-lesson-youtube"
    )?.value
      ?.trim();

  const bunnyVideoId =
    document.getElementById(
      "edit-lesson-bunny"
    )?.value
      ?.trim();

  const taskText =
    document.getElementById(
      "edit-lesson-task"
    )?.value
      ?.trim();

  const warningText =
    document.getElementById(
      "edit-lesson-warning"
    )?.value
      ?.trim();

  const isFree =
    document.getElementById(
      "edit-lesson-free"
    )?.checked;


  if (!moduleId || !orderIndex || !title) {

    tg.showAlert(
      "Modul, dars raqami va dars nomini to'ldiring."
    );

    return;

  }


  try {

    await adminApi(
      `/api/admin/lesson/${id}/update`,
      {

        module_id:
          Number(moduleId),

        title:
          title,

        order_index:
          Number(orderIndex),

        youtube_url:
          youtubeUrl || null,

        task_text:
          taskText || null,

        is_free:
          isFree,

        bunny_video_id:
          bunnyVideoId || null,

        warning_text:
          warningText || null

      }
    );


    tg.showAlert(
      "✅ Dars yangilandi."
    );


    await adminOpenLessons();

  } catch (error) {

    tg.showAlert(
      error.message
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
          `/api/admin/lesson/${id}/delete`
        );


        tg.showAlert(
          "✅ Dars o'chirildi."
        );


        await adminOpenLessons();

      } catch (error) {

        tg.showAlert(
          error.message
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
        `/api/lesson/${lessonId}`
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
              type="text"
              placeholder="Fayl nomi"
            >


            <input
              id="new-file-url"
              type="text"
              placeholder="Google Drive linki"
            >


            <button
              class="btn"
              onclick="addLessonFile(${lessonId})"
            >

              ➕ Material qo'shish

            </button>

          </div>


          <div class="admin-files-list">

            ${
              files.length

                ? files.map(
                    file => `

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
                            onclick="editLessonFile(
                              ${file.id},
                              ${lessonId},
                              '${escapeHtml(file.file_name || "")}',
                              '${escapeHtml(file.file_url || "")}'
                            )"
                          >

                            ✏️

                          </button>


                          <button
                            onclick="deleteLessonFile(${file.id}, ${lessonId})"
                          >

                            🗑️

                          </button>

                        </div>

                      </div>

                    `
                  ).join("")

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

    tg.showAlert(
      error.message
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
    )?.value
      ?.trim();

  const fileUrl =
    document.getElementById(
      "new-file-url"
    )?.value
      ?.trim();


  if (!fileName) {

    tg.showAlert(
      "Fayl nomini kiriting."
    );

    return;

  }


  if (!fileUrl) {

    tg.showAlert(
      "Fayl linkini kiriting."
    );

    return;

  }


  try {

    await adminApi(
      `/api/admin/lesson/${lessonId}/files/add`,
      {

        file_name:
          fileName,

        file_url:
          fileUrl

      }
    );


    tg.showAlert(
      "✅ Material qo'shildi."
    );


    await openLessonFiles(
      lessonId
    );

  } catch (error) {

    tg.showAlert(
      error.message
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
          onclick="openLessonFiles(${lessonId})"
        >

          ← Materiallar

        </div>


        <div class="admin-title">

          ✏️ Materialni tahrirlash

        </div>


        <div class="admin-form">

          <input
            id="edit-file-name"
            type="text"
            value="${escapeHtml(oldName)}"
            placeholder="Fayl nomi"
          >


          <input
            id="edit-file-url"
            type="text"
            value="${escapeHtml(oldUrl)}"
            placeholder="Google Drive linki"
          >


          <button
            class="btn"
            onclick="updateLessonFile(${fileId}, ${lessonId})"
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
    )?.value
      ?.trim();

  const fileUrl =
    document.getElementById(
      "edit-file-url"
    )?.value
      ?.trim();


  if (!fileName || !fileUrl) {

    tg.showAlert(
      "Fayl nomi va linkini kiriting."
    );

    return;

  }


  try {

    await adminApi(
      `/api/admin/file/${fileId}/update`,
      {

        file_name:
          fileName,

        file_url:
          fileUrl

      }
    );


    tg.showAlert(
      "✅ Material yangilandi."
    );


    await openLessonFiles(
      lessonId
    );

  } catch (error) {

    tg.showAlert(
      error.message
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
          `/api/admin/file/${fileId}/delete`
        );


        tg.showAlert(
          "✅ Material o'chirildi."
        );


        await openLessonFiles(
          lessonId
        );

      } catch (error) {

        tg.showAlert(
          error.message
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

    tg.showAlert(
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

    tg.showAlert(
      error.message
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
        adminData.admins.map(
          admin => `

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
                  ${
                    escapeHtml(
                      String(
                        admin.telegram_id
                      )
                    )
                  }

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
                String(
                  admin.telegram_id
                ) !==
                "8043641301"

                  ? `

                    <button
                      class="admin-delete-btn"
                      onclick="deleteAdmin(${admin.id})"
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

          `
        ).join("")
      }

    </div>

  `;

}


// ======================================================
// ADD ADMIN FORM
// ======================================================

function openAddAdminForm() {

  if (
    state.admin_role !==
    "super_admin"
  ) {

    tg.showAlert(
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

          <label>
            Telegram ID
          </label>

          <input
            id="new-admin-telegram-id"
            type="number"
            placeholder="Masalan: 123456789"
          >


          <label>
            Ism
          </label>

          <input
            id="new-admin-name"
            type="text"
            placeholder="Admin ismi"
          >


          <label>
            Huquq
          </label>

          <select id="new-admin-role">

            <option value="admin">
              🛡️ Admin
            </option>

            <option value="super_admin">
              👑 Super Admin
            </option>

          </select>


          <button
            class="btn"
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
    )?.value
      ?.trim();

  const firstName =
    document.getElementById(
      "new-admin-name"
    )?.value
      ?.trim();

  const role =
    document.getElementById(
      "new-admin-role"
    )?.value;


  if (!telegramId) {

    tg.showAlert(
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

        role:
          role

      }
    );


    tg.showAlert(
      "✅ Admin qo'shildi."
    );


    await adminOpenAdmins();

  } catch (error) {

    tg.showAlert(
      error.message
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
          `/api/admin/admins/${id}/delete`
        );


        tg.showAlert(
          "✅ Admin o'chirildi."
        );


        await adminOpenAdmins();

      } catch (error) {

        tg.showAlert(
          error.message
        );

      }

    }

  );

}


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


    /*
      ADMIN:
      Registration talab qilinmaydi.
    */

    if (
      !authData.registered &&
      !authData.is_admin
    ) {

      currentView = null;

      activeTab = "home";

      renderRegistration();

      return;

    }


    /*
      Oddiy foydalanuvchi ro'yxatdan o'tgan
      yoki admin bo'lsa — kontentni yuklaymiz.
    */

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

      tg.showAlert(
        error.message ||
        "Ilovani ishga tushirishda xatolik yuz berdi."
      );

    } catch (e) {}

  }

}


startApp();
