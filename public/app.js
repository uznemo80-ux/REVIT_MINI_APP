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

// Google Drive, Dropbox va boshqa rasm linklarini to'g'ridan-to'g'ri img src formatiga o'tkazuvchi funksiya
function formatImageUrl(url) {
  if (!url || typeof url !== "string") return "";
  let cleanUrl = url.trim();
  if (!cleanUrl) return "";

  // Google Drive: /file/d/FILE_ID
  const driveFileMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
  }

  // Google Drive: id=FILE_ID
  const driveIdMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (cleanUrl.includes("drive.google.com") && driveIdMatch && driveIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
  }

  // Dropbox (dl=0 -> raw=1)
  if (cleanUrl.includes("dropbox.com")) {
    return cleanUrl.replace(/[?&]dl=0/, "").concat(cleanUrl.includes("?") ? "&raw=1" : "?raw=1");
  }

  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://") && !cleanUrl.startsWith("data:")) {
    cleanUrl = "https://" + cleanUrl;
  }

  return cleanUrl;
}

function getDriveFallbackUrl(url) {
  if (!url || typeof url !== "string") return "";
  let cleanUrl = url.trim();
  const driveFileMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${driveFileMatch[1]}&sz=w1200`;
  }
  const driveIdMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (cleanUrl.includes("drive.google.com") && driveIdMatch && driveIdMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${driveIdMatch[1]}&sz=w1200`;
  }
  return "";
}

function extractGoogleDriveId(url) {
  if (!url || typeof url !== "string") return "";
  const clean = url.trim();
  const fileMatch = clean.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) return fileMatch[1];
  const idMatch = clean.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) return idMatch[1];
  return "";
}

function parseSelectedPages(pagesStr) {
  if (!pagesStr || typeof pagesStr !== "string") return [1];
  const parts = pagesStr.split(/[,\s]+/);
  const pages = [];
  for (const part of parts) {
    if (!part) continue;
    if (part.includes("-")) {
      const [start, end] = part.split("-").map(n => parseInt(n.trim(), 10));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let p = Math.max(1, start); p <= Math.min(start + 50, end); p++) {
          if (!pages.includes(p)) pages.push(p);
        }
      }
    } else {
      const p = parseInt(part.trim(), 10);
      if (!isNaN(p) && p > 0 && !pages.includes(p)) {
        pages.push(p);
      }
    }
  }
  return pages.length ? pages : [1];
}

function handleImageError(imgEl) {
  if (!imgEl) return;
  const retry = imgEl.dataset.retry;
  if (retry && imgEl.src !== retry) {
    imgEl.dataset.retry = "";
    imgEl.src = retry;
  } else {
    imgEl.style.display = "none";
  }
}

function updateCourseCoverPreview(val, previewId) {
  const container = document.getElementById(previewId);
  if (!container) return;
  const formatted = formatImageUrl(val);
  if (formatted) {
    container.style.display = "block";
    container.innerHTML = `<img src="${escapeHtml(formatted)}" data-retry="${escapeHtml(getDriveFallbackUrl(val))}" onerror="handleImageError(this)" style="width:100%; height:160px; object-fit:cover; border-radius:10px;" />`;
  } else {
    container.style.display = "none";
    container.innerHTML = "";
  }
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
  last_lesson: null,
  showcases: [],
  open_resources: [],
  materials: []
};

let activeTab = "home";
let selectedCourseId = null;
let courseModulesData = null;
let courseSearchQuery = "";
let selectedCourseCategory = "Barchasi";
const COURSE_CATEGORIES = ["Revit", "AutoCAD", "3ds Max", "BIM", "Interyer", "Arxitektura", "Boshqa"];
let currentView = null;
let savedTabScrolls = {
  home: 0,
  lessons: 0,
  tasks: 0,
  chat: 0,
  profile: 0
};
let lastDetailReturnScroll = 0;

window.addEventListener("scroll", () => {
  if (!currentView) {
    const y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    savedTabScrolls[activeTab] = y;
    lastDetailReturnScroll = y;
  }
}, { passive: true });

let aboutOpen = false;
let adminQuestionsList = null;
let adminQuestionsFilter = "pending";
let studentQuestionsList = null;
window._answers = {};

// Yangi global o'zgaruvchilar (1-6 talablar)
let specDevice = "desktop"; // "desktop" | "laptop"
let specLevel = "recommended"; // "minimal" | "recommended" | "professional"
let showcaseCurrentIndex = 0;
let showcaseAutoTimer = null;
let activeOpenResTab = "all"; // "all" | "book" | "source" | "video" | "test"
let freeQuizState = null;
let marketplaceSearchQuery = "";
let marketplaceCategory = "Barchasi";
let marketplaceSubCategory = "Barchasi";
let selectedMaterialDetail = null;
let adminLibraryFilter = "all";

// KUTUBXONA V2 STATE & SECTIONS
let librarySections = [
  { id: 1, slug: 'books', name: 'Kitoblar', icon: '📚', description: 'Revit, BIM, arxitektura va interyer elektron kitoblari hamda ShNQ normativlari', is_active: true, order_index: 1 },
  { id: 2, slug: 'sources', name: 'Manbalar', icon: '📦', description: 'Revit oilalari (.rfa), shablonlar (.rte), DWG chizmalar va 3D parametrlar', is_active: true, order_index: 2 },
  { id: 3, slug: 'tests', name: 'Testlar', icon: '✓', description: 'Bilimlarni mustahkamlash uchun kurslar va mavzular bo‘yicha interaktiv testlar', is_active: true, order_index: 3 },
  { id: 4, slug: 'materials', name: 'Materiallar', icon: '🧱', description: 'Qurilish va pardozlash materiallari ensiklopediyasi, xususiyatlari va o‘lchamlari', is_active: true, order_index: 4 }
];
let libraryActiveSection = null; // null: Home (4 tiles + recent + recommended) | 'books' | 'sources' | 'tests' | 'materials'
let libraryV2Resources = [];
let libraryV2Categories = [];
let libraryV2RecommendedList = [];
let libraryV2CoursesList = [];
let librarySelectedCourseId = "all";
let librarySectionSearchQuery = "";
let librarySectionSelectedCategory = "Barchasi";
let librarySectionSort = "latest";
let librarySectionSubCategory = "Barchasi";
let libraryV2SearchQuery = "";
let libraryV2SelectedCategory = "Barchasi";
let libraryV2ActiveView = "all"; // "all" | "bookmarks" | "recent"
let libraryV2Bookmarks = new Set();
let libraryV2RecentList = [];
let libraryV2Loading = false;
let libraryV2HasLoaded = false;
let libraryV2SelectedType = "all";
let libraryQuizState = null;

// LIVE ACTIVITY TRACKING STATE
let liveActivityState = {
  status: "online",
  lesson_id: null,
  lesson_title: null,
  module_title: null,
  course_title: null,
  video_progress: 0,
  video_duration: 0,
  video_status: "watching",
  module_id: null,
  test_question_index: 0,
  test_total_questions: 0,
  last_sent_at: 0
};
let heartbeatTimer = null;
let videoProgressTicker = null;
let adminLivePollingTimer = null;

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
// LIVE ACTIVITY TRACKING ENGINE
// ======================================================

function formatSeconds(sec) {
  if (!sec || isNaN(sec) || sec <= 0) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return "Noma'lum";
  const diff = Math.max(0, Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000));
  if (diff < 15) return "Hozirgina";
  if (diff < 60) return `${diff} soniya oldin`;
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins} daqiqa oldin`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} soat oldin`;
  return `${Math.floor(hours / 24)} kun oldin`;
}

function initHeartbeat() {
  if (heartbeatTimer) clearInterval(heartbeatTimer);
  sendHeartbeat();

  // 25 soniyali yengil davriy puls (1000+ user uchun optimal)
  heartbeatTimer = setInterval(() => {
    if (document.visibilityState === "visible") {
      sendHeartbeat();
    }
  }, 25000);

  // Mini App yashirilganda / qayta ochilganda nazorat
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      sendHeartbeat({ status: "idle" });
    } else {
      sendHeartbeat();
    }
  });

  // YouTube / Bunny iframe postMessage tinglovchisi
  window.addEventListener("message", (event) => {
    try {
      const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      if (data && data.event === "infoDelivery" && data.info) {
        if (typeof data.info.currentTime === "number") {
          liveActivityState.video_progress = Math.round(data.info.currentTime);
        }
        if (typeof data.info.duration === "number") {
          liveActivityState.video_duration = Math.round(data.info.duration);
        }
        if (data.info.playerState === 1) { // playing
          liveActivityState.video_status = "watching";
          liveActivityState.status = "watching";
        } else if (data.info.playerState === 2) { // paused
          liveActivityState.video_status = "paused";
        } else if (data.info.playerState === 0) { // ended
          liveActivityState.video_status = "finished";
        }
      }
    } catch (e) {}
  });
}

async function sendHeartbeat(extra = {}) {
  if (!initData) return;
  const payload = {
    current_tab: activeTab || "home",
    status: extra.status || liveActivityState.status,
    lesson_id: liveActivityState.lesson_id,
    lesson_title: liveActivityState.lesson_title,
    module_title: liveActivityState.module_title,
    course_title: liveActivityState.course_title,
    video_progress: liveActivityState.video_progress,
    video_duration: liveActivityState.video_duration,
    video_status: liveActivityState.video_status,
    module_id: liveActivityState.module_id,
    test_question_index: liveActivityState.test_question_index,
    test_total_questions: liveActivityState.test_total_questions,
    device_info: specDevice || "mobile",
    ...extra
  };
  try {
    await fetch("/api/activity/heartbeat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData, device_id: deviceId, ...payload })
    });
    liveActivityState.last_sent_at = Date.now();
  } catch (e) {
    // Heartbeat uchun fon xatoliklari jimgina o'tkazib yuboriladi
  }
}

function setActivityWatchingLesson(lesson, currentModule, currentCourse) {
  liveActivityState.status = "watching";
  liveActivityState.lesson_id = lesson.id;
  liveActivityState.lesson_title = lesson.title;
  liveActivityState.module_title = currentModule ? currentModule.title : null;
  liveActivityState.course_title = currentCourse ? currentCourse.title : null;
  liveActivityState.video_progress = 0;
  liveActivityState.video_duration = 0;
  liveActivityState.video_status = "watching";

  if (videoProgressTicker) clearInterval(videoProgressTicker);
  videoProgressTicker = setInterval(() => {
    if (liveActivityState.status === "watching" && liveActivityState.video_status === "watching") {
      liveActivityState.video_progress++;
    }
  }, 1000);

  sendHeartbeat();
}

function setActivityTesting(moduleId, currentQ, totalQ, moduleTitle) {
  liveActivityState.status = "testing";
  liveActivityState.module_id = moduleId;
  if (moduleTitle) liveActivityState.module_title = moduleTitle;
  liveActivityState.test_question_index = currentQ;
  liveActivityState.test_total_questions = totalQ;
  sendHeartbeat();
}

function clearActivitySpecialState() {
  if (videoProgressTicker) {
    clearInterval(videoProgressTicker);
    videoProgressTicker = null;
  }
  liveActivityState.status = "online";
  liveActivityState.lesson_id = null;
  liveActivityState.lesson_title = null;
  liveActivityState.module_title = null;
  liveActivityState.video_progress = 0;
  liveActivityState.video_duration = 0;
  liveActivityState.video_status = "watching";
  liveActivityState.module_id = null;
  liveActivityState.test_question_index = 0;
  liveActivityState.test_total_questions = 0;
  sendHeartbeat();
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
      admin_role: data.admin_role || null,
      terms_accepted: Boolean(data.terms_accepted),
      terms_accepted_at: data.terms_accepted_at || null
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
  const prevY = !currentView ? (window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0) : lastDetailReturnScroll;
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
      terms_accepted: data.terms_accepted !== undefined ? Boolean(data.terms_accepted) : (state.terms_accepted ?? false),
      terms_accepted_at: data.terms_accepted_at || state.terms_accepted_at || null,
      support_cards: Array.isArray(data.support_cards) ? data.support_cards : (state.support_cards || []),
      is_admin: state.is_admin,
      admin_role: state.admin_role,
      last_lesson: data.last_lesson || null,
      courses: Array.isArray(data.courses) ? data.courses : [],
      faqs: Array.isArray(data.faqs) ? data.faqs : [],
      settings: data.settings || state.settings,
      testimonials: Array.isArray(data.testimonials) && data.testimonials.length ? data.testimonials : (state.testimonials && state.testimonials.length ? state.testimonials : TESTIMONIALS),
      showcases: Array.isArray(data.showcases) && data.showcases.length ? data.showcases : (state.showcases && state.showcases.length ? state.showcases : DEFAULT_SHOWCASES),
      open_resources: Array.isArray(data.open_resources) && data.open_resources.length ? data.open_resources : (state.open_resources && state.open_resources.length ? state.open_resources : DEFAULT_OPEN_RESOURCES),
      materials: Array.isArray(data.materials) && data.materials.length ? data.materials : (state.materials && state.materials.length ? state.materials : DEFAULT_MATERIALS)
    };
    initShowcaseTimer();
    loadLibraryV2Data();
    render();
    if (!currentView && prevY > 0) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: prevY, left: 0, behavior: "instant" });
        setTimeout(() => {
          window.scrollTo({ top: prevY, left: 0, behavior: "instant" });
        }, 30);
      });
    }
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
// TALAB 1: 3DS MAX & REVIT UCHUN KOMPYUTER / NOUTBUK PARAMETRLARI
// ======================================================

const PC_SPECS_DATA = {
  desktop: {
    minimal: {
      title: "Minimal parametrlar (Boshlovchilar / Kichik loyihalar)",
      badge: "🟢 Boshlang'ich",
      cpu: "Intel Core i5 (12400F / 13400F) yoki AMD Ryzen 5 (5600X / 7600)",
      cpu_hint: "Revit uchun bitta yadro chastotasi (Single-core GHz) yuqori bo'lgan protsessor muhim",
      ram: "16 GB DDR4 (3200MHz) yoki DDR5 (4800MHz) Dual Channel",
      ram_hint: "Kamida 2 ta planka (2x8GB) bo'lishi shart",
      gpu: "NVIDIA GeForce RTX 3050 (8GB) yoki GTX 1660 Super (6GB)",
      gpu_hint: "3ds Max Viewporti va Revit 3D ko'rinishi silliq aylanishi uchun",
      ssd: "512 GB M.2 NVMe SSD (O'qish tezligi: 3000+ MB/s)",
      ssd_hint: "Dasturlar va operatsion tizim faqat SSD ga o'rnatilishi zarur",
      screen: "24 dyuym Full HD (1920x1080) IPS matritsa, 75-100Hz",
      screen_hint: "Ko'z toliqmasligi uchun IPS panel tanlang",
      cooling: "600W 80+ Bronze blok pitaniya, yaxshi havo aylanuvchi korpus",
      advice: "Revitda 10-15 xonali oddiy kvartiralar va kichik kottejlarni chizish, 3ds Maxda modellashtirishni o'rganish uchun yetarli. Katta renderlarda biroz kutish talab etiladi."
    },
    recommended: {
      title: "Tavsiya etilgan parametrlar (Professional interyer & BIM)",
      badge: "⚡ Optimal & Professional",
      cpu: "Intel Core i7 (13700F / 14700F) yoki AMD Ryzen 7 (7700X / 7800X3D)",
      cpu_hint: "Revitda murakkab oilalar va 3ds Max Corona Renderda tezkor hisoblash uchun 16-20 yadro",
      ram: "32 GB DDR5 (5600MHz - 6000MHz) Dual Channel",
      ram_hint: "Revitda 100+ MB hajmdagi ishchi loyihalarda qotishning oldini oladi",
      gpu: "NVIDIA GeForce RTX 4060 Ti (8GB / 16GB) yoki RTX 4070 (12GB VRAM)",
      gpu_hint: "RTX nurlari tezlatkichi va sun'iy intellektli Denoiser uchun ideal",
      ssd: "1 TB M.2 NVMe PCIe 4.0 SSD (Tezligi: 5000 - 7000 MB/s)",
      ssd_hint: "Katta teksturalar va kutubxonalar bir zumda ochiladi",
      screen: "27 dyuym 2K QHD (2560x1440) IPS, 99-100% sRGB rang aniqligi",
      screen_hint: "Chizmalardagi mayda detallar va interyer ranglari to'g'ri ko'rinadi",
      cooling: "750W 80+ Gold quvvat bloki, 240mm/360mm suv sovutish tizimi",
      advice: "Revitda to'liq 40-50 listlik ishchi loyiha (Rabochka) albomini chiqarish, 3ds Maxda fotorealistik Corona vizualizatsiyalarini tezkor olish uchun eng optimal tanlov!"
    },
    professional: {
      title: "Maksimal parametrlar (Yirik BIM majmualar & Og'ir 3D sahnalar)",
      badge: "🚀 Render Monster",
      cpu: "Intel Core i9 (13900K / 14900K) yoki AMD Ryzen 9 (7950X / Threadripper)",
      cpu_hint: "24-32 yadro, 5.8-6.0 GHz gacha quvvat, multi-rendering uchun maksimal tezlik",
      ram: "64 GB - 128 GB DDR5 (6000MHz+)",
      ram_hint: "O'n millionlab poligonli va yuzlab yirik teksturali sahnani xotirada ushlaydi",
      gpu: "NVIDIA GeForce RTX 4070 Ti Super / RTX 4080 Super / RTX 4090 (16-24GB VRAM)",
      gpu_hint: "V-Ray GPU, Vantage, Unreal Engine 5 real vaqt renderlari uchun eng kuchli karta",
      ssd: "2 TB Samsung 990 Pro NVMe PCIe 4.0 + 2 TB zaxira loyiha diski",
      ssd_hint: "Katta ma'lumotlar bazasi va arxitektura arxivi uchun",
      screen: "32 dyuym 4K IPS yoki Dual 27 dyuym 2K monitorlar (Delta E < 1.5)",
      screen_hint: "Bir ekranda Revit chizmasi, ikkinchisida 3D model yoki spetsifikatsiyalar",
      cooling: "1000W-1200W 80+ Platinum, 360mm SVO, shovqinsiz katta korpus",
      advice: "Ko'p qavatli turar-joy majmualari, yirik tijoriy ob'ektlar, og'ir animatsiyalar va 4K formatdagi yuqori darajali renderlar uchun cheklovlarsiz quvvat."
    }
  },
  laptop: {
    minimal: {
      title: "Minimal noutbuk (Talabalar va boshlovchilar uchun)",
      badge: "🟢 Boshlang'ich",
      cpu: "Intel Core i5 (12500H / 13500H) yoki AMD Ryzen 5 (6600H / 7535HS)",
      cpu_hint: "H indeksli kuchaytirilgan protsessor bo'lishi shart (U yoki G seriyalar to'g'ri kelmaydi)",
      ram: "16 GB DDR4/DDR5 (3200-4800MHz)",
      ram_hint: "Keyinchalik 32GB ga oshirish uchun bo'sh slot borligini tekshiring",
      gpu: "NVIDIA GeForce RTX 3050 (4GB / 6GB VRAM, TGP 75W+)",
      gpu_hint: "Integratsiyalangan videokartalar (Intel Iris / AMD Vega) bilan cheklanmang",
      ssd: "512 GB M.2 NVMe SSD",
      ssd_hint: "Revit va 3ds Max kutubxonalari uchun yetarli",
      screen: "15.6 dyuym Full HD (1920x1080) IPS, 144Hz",
      screen_hint: "Ko'rish burchagi keng va ko'z toliqmaydigan displey",
      cooling: "2 ta mustaqil ventilatorli gaming korpus (Lenovo LOQ / Asus TUF / Acer Nitro)",
      advice: "Yupqa ofis noutbuklarini aslo xarid qilmang! Ular og'ir yuklamada qizib, tezligini pasaytiradi (trottling). Gaming seriyalarni tanlang."
    },
    recommended: {
      title: "Tavsiya etilgan noutbuk (Ko'chma professional ish uchun)",
      badge: "⚡ Optimal & Ishonchli",
      cpu: "Intel Core i7 (13700H / 14700HX) yoki AMD Ryzen 7 (7745HX / 7840HS)",
      cpu_hint: "Yuqori takt chastotali kuchli noutbuk protsessori",
      ram: "32 GB DDR5 (5200MHz / 5600MHz)",
      ram_hint: "Revitda bir vaqtning o'zida AutoCAD va Photoshop bilan erkin ishlash imkoni",
      gpu: "NVIDIA GeForce RTX 4060 (8GB VRAM, to'liq 115W-140W TGP)",
      gpu_hint: "Zamonaviy DLSS 3 va arxitektura vizualizatsiyasi uchun ideal",
      ssd: "1 TB M.2 NVMe PCIe 4.0 SSD (qo'shimcha 2-chi SSD sloti bilan)",
      ssd_hint: "Tezkor loyihalarni yuklash va saqlash",
      screen: "16 dyuym QHD+ (2560x1600) IPS, 100% sRGB, 165Hz (16:10 format chizma uchun juda qulay)",
      screen_hint: "Vertikal maydon kengroq bo'lib, Ribbon va xususiyatlar paneli sig'adi",
      cooling: "Bug' kamerali (Vapor Chamber) ilg'or sovutish tizimi (Lenovo Legion 5 / Asus ROG Strix)",
      advice: "Ofisdan tashqarida, ob'ektlarda mijozlarga loyihani ko'rsatish va uzoq soatlab barqaror ishlash uchun eng qulay noutbuk!"
    },
    professional: {
      title: "Maksimal mobil stansiya (Mobile Workstation)",
      badge: "🚀 Mobil Superkompyuter",
      cpu: "Intel Core i9 (13980HX / 14900HX) yoki AMD Ryzen 9 (7945HX)",
      cpu_hint: "Stol usti protsessorlariga tenglashadigan 24 yadroli quvvat",
      ram: "64 GB DDR5 5600MHz",
      ram_hint: "Murakkab BIM koordinatsiyasi va katta shaharlar modeli uchun",
      gpu: "NVIDIA GeForce RTX 4080 (12GB) yoki RTX 4090 (16GB VRAM, 175W Full Power)",
      gpu_hint: "Mobil formatdagi eng yuqori grafika quvvati",
      ssd: "2 TB NVMe PCIe 4.0 SSD (7000+ MB/s)",
      ssd_hint: "Gigabaytlab og'ir Revit fayllari soniyalarda ochiladi",
      screen: "16 - 17.3 dyuym Mini-LED yoki 2.5K 240Hz, 100% DCI-P3 rang aniqligi",
      screen_hint: "Ranglarni chop etishga tayyorlash uchun mutlaq aniqlik",
      cooling: "Suyuq metall va katta issiqlik trubkalari (Lenovo Legion Pro 7 / Asus ROG SCAR 16/18)",
      advice: "Stol usti kompyuteridan qolishmaydigan, xohlagan joyda og'ir renderlarni hisoblashga qodir flagman qurilma."
    }
  }
};

// ======================================================
// TALAB 3: O'QUVCHILAR NATIJALARI (SHOWCASES) STANDART BAZASI
// ======================================================

const DEFAULT_SHOWCASES = [];

// ======================================================
// TALAB 2: KUTUBXONA OCHIQ MANBALARI VA ERKIN TESTLAR STANDART BAZASI
// ======================================================

const DEFAULT_OPEN_RESOURCES = [
  {
    id: 1,
    type: "book",
    title: "Revit 2024: Rasmiy qo'llanma va BIM standartlari (PDF)",
    category: "Adabiyotlar",
    description: "Revit interfeysi, modellashtirish prinsiplari, listlar va shablonlar bo'yicha to'liq qo'llanma kitobi.",
    link_url: "https://drive.google.com/file/d/1_Revit_Guide_Book/preview",
    icon: "📚",
    order_index: 1
  },
  {
    id: 2,
    type: "book",
    title: "Arxitektura va bino loyihalash me'yorlari (ShNQ & KMK to'plami)",
    category: "Normativlar",
    description: "O'zbekiston Respublikasi shaharsozlik normalari: xonalar minimal balandligi va maydonlari talablari.",
    link_url: "https://drive.google.com/file/d/1_ShNQ_KMK_Standards/preview",
    icon: "📐",
    order_index: 2
  },
  {
    id: 3,
    type: "book",
    title: "Interyer dizaynerlari uchun ergonomika va o'lchamlar (Noifert)",
    category: "Ergonomika",
    description: "Mebel joylashuvi, o'tish masofalari, eshik va deraza me'yorlari, oshxona va sanuzel ergonomikasi.",
    link_url: "https://drive.google.com/file/d/1_Ergonomika_Noifert/preview",
    icon: "📏",
    order_index: 3
  },
  {
    id: 4,
    type: "video",
    title: "Revit-da 0 dan boshlab xonadon rejasini chizish (Master-klass)",
    category: "Video dars",
    description: "Ochiq video darslik: devorlarni darajalarga bog'lash, eshik-derazalar va o'lcham zanjirlarini qo'yish.",
    link_url: "https://youtu.be/dQw4w9WgXcQ",
    icon: "🎬",
    order_index: 4
  },
  {
    id: 5,
    type: "source",
    title: "Revit Professional Oilalari (Families) Kutubxonasi",
    category: "Ochiq manba",
    description: "O'zbekiston interyerlariga mos eshiklar, zamonaviy derazalar, santexnika jihozlari va mebel oilalari.",
    link_url: "https://t.me/texnikuzb",
    icon: "📦",
    order_index: 5
  },
  {
    id: 6,
    type: "test",
    title: "Revit Bazaviy Bilim Testi (Erkin Sinov)",
    category: "Sinov Testi",
    description: "Revit dasturidagi asosiy terminlar, fayl turlari va modellashtirish qoidalarini tekshirish uchun bepul test sinovi.",
    test_data: [
      { q: "Revit-da ishchi loyiha faylining asosiy formati qaysi?", options: ["RTE", "RVT", "RFA", "RFT"], correct: 1 },
      { q: "Revit-da yangi qavat balandligini belgilash uchun qaysi elementdan foydalaniladi?", options: ["Grid (O'q)", "Level (Daraja)", "Scope Box", "Section"], correct: 1 },
      { q: "Devor chizilayotganda uning yo'nalishi va ichki/tashqi tomonini tez almashtirish tugmasi qaysi?", options: ["Tab", "Enter", "Space (Probel)", "Shift"], correct: 2 },
      { q: "AutoCAD chizmasini Revit-ga yangilanib turadigan havola sifatida olib kirish qaysi buyruq orqali bajariladi?", options: ["Import CAD", "Link CAD (Svyaz SAPR)", "Open CAD", "Attach CAD"], correct: 1 },
      { q: "Chizmadagi barcha eshik va derazalarning avtomatik hisob-kitob jadvali nima deb ataladi?", options: ["Plan vid", "Spetsifikatsiya (Schedule/Quantities)", "List (Sheet)", "Shablon vid"], correct: 1 }
    ],
    icon: "🎯",
    order_index: 6
  },
  {
    id: 7,
    type: "test",
    title: "Arxitektura va Chizmachilik Savodxonligi Testi",
    category: "Sinov Testi",
    description: "Loyiha chizmalari, o'lchamlar, eshik-deraza standartlari va shaharsozlik me'yorlari bo'yicha erkin sinov testi.",
    test_data: [
      { q: "Standart turar-joy binolarida polning toza sathi qanday belgi bilan ko'rsatiladi?", options: ["±0.000", "+3.000", "-0.150", "100%"], correct: 0 },
      { q: "Xonadondagi standart kirish eshigining minimal kengligi qancha bo'lishi tavsiya etiladi?", options: ["600 mm", "700 mm", "900 mm", "1200 mm"], correct: 2 },
      { q: "Interyer loyihalashda 'Demontaj rejasi' nima maqsadda chiziladi?", options: ["Yangi quriladigan devorlarni ko'rsatish", "Buziladigan mavjud devor va konstruksiyalarni aniq ko'rsatish", "Mebel sotib olish uchun", "Bo'yoq rangini tanlash uchun"], correct: 1 },
      { q: "Oshxona ishchi yuzasi (stol usti) balandligi standart bo'yicha necha sm bo'lishi maqbul hisoblanadi?", options: ["60 sm", "85-90 sm", "110 sm", "130 sm"], correct: 1 }
    ],
    icon: "📝",
    order_index: 7
  }
];

// ======================================================
// TALAB 6: QURILISH MATERIALLARI MARKETPLACE STANDART BAZASI
// ======================================================

const DEFAULT_MATERIALS = [
  {
    id: 1,
    title: "LDSP (Laminatsiyalangan DSP)",
    category: "Mebel",
    sub_category: "LDSP",
    image_url: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80",
    short_desc: "Mebel korpuslari, javonlar va shkaflar uchun eng ommabop melamin plyonkali plita.",
    what_is_it: "LDSP — yuqori bosim va harorat ostida qatronlar bilan presslangan yog'och qirindilari (DSP) ustiga melamin smolasi shimdirilgan qog'oz plyonka qoplab tayyorlanadigan mebel plitasi. U turli xil yog'och fakturalari, matoviy va glyanets ranglarga ega.",
    dimensions: "Standart formatlar: 2800 x 2070 mm, 2750 x 1830 mm. Qalinliklari: 16 mm (asosiy mebel korpusi), 18 mm, 22 mm, 25 mm.",
    history: "DSP ilk bor 1930-yillarda Germaniyada yog'och chiqindilarini tejash maqsadida yaratilgan. Melamin qoplamali LDSP esa 1960-yillardan boshlab butun dunyo mebel sanoatining asosiy materialiga aylangan.",
    usage_area: "Oshxona garniturlari karkasi, shkaf-kupe, yotoqxona va bolalar xonasi mebellari, ofis stollari, kiyim javonlari.",
    pros: "✅ Hamyonbop narx; Ranglar va fakturalar xilma-xilligi; Mexanik yuklamalarga chidamlilik; Oson kesilishi va yig'ilishi.",
    cons: "❌ Namlikka o'ta ta'sirchan (suv tegsa shishib ketadi); Egiluvchan emas (faqat to'g'ri chiziqli mebellar); Chetlariga (kromka) sifatli PVX yopishtirilishi shart.",
    uzbekistan_sources: "O'zbekistondagi manbalar: Egger, Kastamonu, Kronospan dilerlari. Bozorlar: O'rikzor bozori 'Mebelchilar' qatori, Chilonzor 'Kastamonu' rasmiy do'koni, Toshkent halqa yo'lidagi mebel furnitura markazlari.",
    bim_tips: "Revitda mebel oilalarida Material parametri sifatida 'Wood - LDSP Egger' qilib biriktiriladi. 3ds Maxda CoronaPhysicalMtl orqali Diffuse va yengil Roughness (0.4-0.6) kartasi beriladi.",
    order_index: 1
  },
  {
    id: 2,
    title: "MDF (O'rta zichlikdagi yog'och tolali plita)",
    category: "Mebel",
    sub_category: "MDF",
    image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
    short_desc: "Frezalash, bo'yash va profilli fasadlar tayyorlash uchun ideal zich va silliq plita.",
    what_is_it: "MDF (Medium Density Fibreboard) — mayda yog'och tolalarini tabiiy lignin va parafin bilan yuqori bosimda qizdirib tayyorlanadigan monolit material. Qirindi o'rniga nozik changsimon tolalardan iborat bo'lgani sababli g'ovaksiz va o'ta silliq yuzaga ega.",
    dimensions: "Plita o'lchami: 2800 x 2070 mm, 2440 x 1220 mm. Qalinliklari: 6, 8, 10, 16, 18, 19, 22, 25, 30 mm.",
    history: "1965 yilda AQSHning Nyu-York shtatida birinchi MDF zavodi ishga tushirilgan. 1980-yillardan boshlab frezalangan oshxona fasadlari uchun standart materialga aylangan.",
    usage_area: "Oshxona fasadlari, profilli va klassik naqshli eshiklar, devor panellari (reyka va MDF reykalar), kornizlar, plintuslar.",
    pros: "✅ Chuqur 3D frezalash (ornament, profil) qilish imkoni; Emal bo'yoq bilan mukammal silliq bo'yalishi; Ekologik toza (smolasiz); Zichligi yuqori va namlikka chidamli.",
    cons: "❌ LDSPga qaraganda 1.5-2 baravar qimmatroq; Yuqori og'irlik; Bo'yalgan yuzasi o'tkir tirnalishlarga sezgir.",
    uzbekistan_sources: "Kastamonu Uzbekistan, AGT dilerlik markazlari, Bek To'pi bozori, O'rikzor mebel do'konlari.",
    bim_tips: "Revitda fasad oilalarida profil chizilib Sweep komandasi bilan chiqariladi. 3ds Maxda bo'yalgan emal effekti uchun yuqori Glossiness beriladi.",
    order_index: 2
  },
  {
    id: 3,
    title: "Gazoblok (Avtoklav gazobeton D500)",
    category: "Devor",
    sub_category: "Gazoblok",
    image_url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=80",
    short_desc: "Tashqi devorlar va xonalararo to'siqlar uchun engil, issiq va aniq qurilish bloki.",
    what_is_it: "Gazoblok — kvars qumi, sement, ohak, suv va alyuminiy kukuni aralashmasidan tayyorlanib, avtoklavda 12 atmosfera bosimi va 190°C bug' ostida pishiriladigan g'ovakli sun'iy tosh.",
    dimensions: "Uzunligi: 600 mm, Balandligi: 200, 250, 300 mm. Qalinligi: 100, 120, 150 mm (pardevor), 200, 250, 300, 400 mm (tashqi devor).",
    history: "1924 yilda shved arxitektori Aksel Eriksson tomonidan patentlangan. O'zbekistonda so'nggi yillarda eng ommabop devor materialiga aylandi.",
    usage_area: "Monolit-karkasli binolar to'ldiruvchi tashqi devorlari, kottedjlar va xonalararo pardevorlar.",
    pros: "✅ A'lo darajadagi issiqlik izolyatsiyasi; Yengil og'irlik (poydevorga kam yuk); Geometrik o'lcham xatosi 1-2 mm (yupqa kley bilan teriladi); Oson arralanadi va shtroba qilinadi.",
    cons: "❌ To'g'ridan-to'g'ri suv va namlikka uzoq turishi mumkin emas (suvoq talab etiladi); Mo'rtroq (og'ir ankerlar uchun maxsus dyubel kerak).",
    uzbekistan_sources: "Arton Gazobeton, EkoGazobeton, Drenaj, Jomiy qurilish bozori, Chilonzor qurilish materiallari bozori.",
    bim_tips: "Revitda 'Basic Wall - Gazoblok D500 200mm' oilasi yaratiladi va issiqlik o'tkazuvchanligi 0.12 W/mK kiritiladi.",
    order_index: 3
  },
  {
    id: 4,
    title: "Penoblok (Ko'pikli beton blok)",
    category: "Devor",
    sub_category: "Penoblok",
    image_url: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=800&auto=format&fit=crop&q=80",
    short_desc: "Sement va ko'pik aralashmasidan tabiiy sharoitda quriydigan issiqlik saqlovchi blok.",
    what_is_it: "Penoblok — sement-qum qorishmasiga organik yoki sintetik ko'pikturgich qo'shib, avtoklavsiz tabiiy qotish orqali ishlab chiqariladigan engil beton bloki.",
    dimensions: "600 x 300 x 200 mm, 600 x 300 x 100 mm.",
    history: "XIX asr oxirida ixtiro qilingan, kichik sexlarda ishlab chiqarish osonligi bilan keng tarqalgan.",
    usage_area: "Xonalararo to'siq devorlari, omborxonalar, kottejlar va issiqlik izolyatsiyasi qatlamlari.",
    pros: "✅ Arzon narx; Yaxshi tovush va issiqlik yutuvchanlik; Yonmaydi va chirimaydi.",
    cons: "❌ Geometriyasi noaniqroq (qalinroq qorishma talab qiladi); Siqilishga chidamliligi pastroq.",
    uzbekistan_sources: "Sergeli qurilish bozori, Rohat bozori, viloyat mahalliy ishlab chiqaruvchi sexlari.",
    bim_tips: "Revitda devor qalinligi 100mm yoki 200mm bo'lgan ichki devor turi sifatida kiritiladi.",
    order_index: 4
  },
  {
    id: 5,
    title: "Pishgan g'isht (M100 - M150 Qizil g'isht)",
    category: "Devor",
    sub_category: "G'isht",
    image_url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80",
    short_desc: "Asrlar davomida sinovdan o'tgan mustahkam, namlikka 100% chidamli loy pishig'i.",
    what_is_it: "Tabiiy loy mineral xomashyosini qoliplab, pechlarda 1000°C yuqori haroratda kuydirish orqali olinadigan to'liq yoki teshikli an'anaviy qurilish toshi.",
    dimensions: "Standart: 250 x 120 x 65 mm (yakka), 250 x 120 x 88 mm (bir yarimtalik).",
    history: "Miloddan avvalgi 3000-yillardan beri O'rta Osiyo me'morchiligida ishlatib kelinmoqda.",
    usage_area: "Yuk ko'taruvchi asosiy devorlar, sanuzel va ho'l xonalar to'siqlari, zaminlar va poydevorlar.",
    pros: "✅ O'ta yuqori mustahkamlik; 100% namlikka chidamlilik (sanuzellarda birinchi tanlov); Yuqori tovush izolyatsiyasi; 100+ yil xizmat muddati.",
    cons: "❌ Og'ir vazn; Issiqlikni tez o'tkazadi; Terish ko'p mehnat talab qiladi.",
    uzbekistan_sources: "Bekobod, Qibray, Bo'stonliq g'isht zavodlari, barcha qurilish mollari bozorlari.",
    bim_tips: "Revitda 'Wall - Pishgan g'isht 120mm' qilib chiziladi. Sanuzel devorlari doim pishgan g'ishtdan belgilanadi.",
    order_index: 5
  },
  {
    id: 6,
    title: "Gipsokarton GKLV (Namlikka chidamli)",
    category: "Shift",
    sub_category: "Gipsokarton",
    image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    short_desc: "Shiftlar, figuriy pataloklar va pardevorlar uchun yashil rangli namlikka chidamli list.",
    what_is_it: "GKLV — ikki qavat maxsus ishlov berilgan karton orasiga gidrofob qo'shimchalar qo'shilgan gips yadrosi joylashtirilgan list. Rangi doimo och yashil bo'ladi.",
    dimensions: "Standart o'lcham: 2500 x 1200 mm (maydoni 3 m²), Qalinliklari: 9.5 mm (shift), 12.5 mm (devor).",
    history: "1894 yilda AQSHda ixtiro qilingan. Knauf kompaniyasi orqali dunyo standartiga aylandi.",
    usage_area: "Oshxona va sanuzel shiftlari, ikki sathli gipsokarton pataloklar, korniz nishalari, devorlarni tekislash.",
    pros: "✅ Tez va toza montaj; Har qanday egri chiziqli shakllarni yasash imkoni; Yashil karton qatlami zamburug' va mog'orga chidamli; Bo'yashga tayyor tekis yuza.",
    cons: "❌ Metall profil karkas talab qiladi; Kuchli zarbaga chidamliligi g'ishtdan past.",
    uzbekistan_sources: "Knauf Gips Buxoro, Akfa Gipsokarton dilerlari, Jomiy va O'rikzor bozorlari.",
    bim_tips: "Revitda patalok planida (Reflected Ceiling Plan) 'Compound Ceiling - GKLV 12.5mm' sifatida chiziladi.",
    order_index: 6
  },
  {
    id: 7,
    title: "Ottocento (Ipak effektli dekorativ bo'yoq)",
    category: "Bezak",
    sub_category: "Ottocento",
    image_url: "https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?w=800&auto=format&fit=crop&q=80",
    short_desc: "Devorlarda tovlanuvchi baxmal va tabiiy ipak matosi ko'rinishini hosil qiluvchi qoplama.",
    what_is_it: "Ottocento — maxsus metallashgan va marvaridli pigmentlar hamda suvli akril dispersiyasidan iborat nozik pardozlash bo'yog'i. Yorug'lik tushish burchagiga qarab rangi tovlanadi.",
    dimensions: "1 litr, 2.5 litr, 5 litr bankalarda sotiladi. 1 litr bilan o'rtacha 7-9 m² devor qoplanadi.",
    history: "Italiyaning Oikos kompaniyasi tomonidan Qadimgi Rim ipak matolari sharafiga yaratilgan.",
    usage_area: "Mehmonxona, yotoqxona devorlari, TV-zona orqa foni, restoran va mehmonxona zallari.",
    pros: "✅ Vizual o'ta hashamatli ko'rinish; Choksiz (monolit) yuza; Ekologik toza, hid chiqarmaydi; Uzoq yillar rangini yo'qotmaydi.",
    cons: "❌ Devor yuzasi oynadek silliq bo'lishi shart; Surkaydigan ustaning yuqori mahorati talab etiladi.",
    uzbekistan_sources: "Oikos Uzbekistan rasmiy saloni, San Marco, Novacolor do'konlari, Parkent qurilish mollari bozori.",
    bim_tips: "3ds Maxda CoronaMtl Fresnel IOR=1.6 va Ipak falloff xaritasi bilan teksturalanadi.",
    order_index: 7
  },
  {
    id: 8,
    title: "Keramogranit plita (60x120 sm)",
    category: "Pol",
    sub_category: "Keramogranit",
    image_url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80",
    short_desc: "Pol va devorlar uchun mustahkam, tirnalmaydigan marmar va beton fakturali yirik plita.",
    what_is_it: "Keramogranit — loy, dala shpati, kvars va tabiiy pigmentlarni 450 kg/sm² bosimda presslab, 1300°C da monolit qilib eritib olinadigan sun'iy tosh. Suv shimish darajasi deyarli 0% (0.05%).",
    dimensions: "60 x 120 sm, 80 x 80 sm, 80 x 160 sm. Qalinligi: 9 mm - 11 mm.",
    history: "1970-yillarda Italiyaning Sassuolo shahrida kafelning mustahkam muqobili sifatida yaratilgan.",
    usage_area: "Xonadon yo'lagi (prixojka), oshxona poli, sanuzel devor va pollari, dush kabinalari, issiq pol (tyoply pol) usti.",
    pros: "✅ Suv, namlik va kimyoviy vositalarga 100% chidamli; Tirnalmaydi; Issiq pol uchun eng samarali issiqlik o'tkazuvchi material; Yirik o'lchami tufayli oraliq choklar kam bo'ladi.",
    cons: "❌ Yalangoyoq yurganda sovuq (issiq pol tavsiya etiladi); Kesish va teshik ochish uchun olmosli maxsus uskuna kerak.",
    uzbekistan_sources: "Kerasun, Modern Keramika, Eko-Kafel do'konlari, Jomiy plitka bozori, Parkent bozori.",
    bim_tips: "Revitda 'Floor - Keramogranit 60x120' qilib chiziladi va Pattern orqali 600x1200 model setkasi qo'yiladi.",
    order_index: 8
  },
  {
    id: 9,
    title: "Laminat (33-klass, Faskali suvga chidamli)",
    category: "Pol",
    sub_category: "Laminat",
    image_url: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&auto=format&fit=crop&q=80",
    short_desc: "Yotoqxona va mehmonxonalar uchun tabiiy yog'och ko'rinishidagi qulay va iliq pol qoplamasi.",
    what_is_it: "Laminat — yuqori zichlikdagi HDF plitasi asosida tayyorlangan, ustiga yog'och rasmi tushirilgan va korund himoya qatlami qoplangan pol materiali.",
    dimensions: "1380 x 193 mm, 1285 x 192 mm. Qalinliklari: 8 mm, 10 mm, 12 mm.",
    history: "1977 yilda Shvetsiyaning Perstorp kompaniyasi tomonidan ishlab chiqilgan.",
    usage_area: "Yotoqxona, bolalar xonasi, mehmonxona, kabinet va ofislar.",
    pros: "✅ Oson va tez qulflanuvchi (Click) montaj; Tabiiy yog'ochga o'xshash iliq his; Ranglar xilma-xilligi; Qayta ko'chirish mumkinligi.",
    cons: "❌ Suv to'kilib uzoq qolsa choklaridan shishishi mumkin; Tagiga to'g'ri podlojka to'shalishi shart.",
    uzbekistan_sources: "Tarkett Uzbekistan, Egger, Kronotex dilerlari, O'rikzor va Bek To'pi pol qoplamalari qatori.",
    bim_tips: "Revitda zamin qatlami qalinligi 8-10 mm qilib kiritiladi va 'Floor finish' sifatida hisoblanadi.",
    order_index: 9
  },
  {
    id: 10,
    title: "Polipropilen truba va fitinglar (PPR PN25)",
    category: "Santexnika",
    sub_category: "Trubalar",
    image_url: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80",
    short_desc: "Ichki issiq va sovuq suv ta'minoti hamda isitish tizimi uchun chidamli plastik quvurlar.",
    what_is_it: "Random kopolimer polipropilendan tayyorlangan, ichida shisha tolali (fiberglass) armatura qatlami bo'lgan suv quvuri.",
    dimensions: "Diametrlari: 20 mm, 25 mm, 32 mm, 40 mm, 50 mm. Standart uzunligi: 4 metr.",
    history: "1980-yillardan boshlab po'lat va cho'yan quvurlar o'rnini egallagan.",
    usage_area: "Kvartira ichki vodoprovodi, dush va vanna tarmoqlari, radiatorli isitish va kombi tizimlari.",
    pros: "✅ Zanglamaydi, chirimaydi, ichida cho'kindi yig'ilmaydi; Diffuzion payvandlash tufayli ulanish joyi monolit bo'ladi; 50 yil xizmat muddati.",
    cons: "❌ Devor ichiga ko'milishidan oldin bosim ostida sinovdan o'tkazilishi shart.",
    uzbekistan_sources: "Firat, Kalde, Akfa Plastik, Grand Santexnika do'konlari, O'rikzor santexnika bozori, Jomiy bozori.",
    bim_tips: "Revit MEP da 'Pipe - Polypropylene PPR' tizimida chiziladi va diametrlari avtomatik hisoblanadi.",
    order_index: 10
  },
  {
    id: 11,
    title: "Elektr kabeli VVGng-LS (Mis sim)",
    category: "Elektr",
    sub_category: "Kabellar",
    image_url: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&auto=format&fit=crop&q=80",
    short_desc: "Xonadon elektr montaji uchun yong'inga xavfsiz va tutun chiqarmaydigan monolit mis kabel.",
    what_is_it: "VVGng-LS — har bir tomiri alohida PVX izolyatsiyalangan va yonishni tarqatmaydigan (ng) hamda tutun ajratmaydigan (LS) yaxlit mis kabel.",
    dimensions: "Rozetkalar: 3 x 2.5 mm²; Yoritish: 3 x 1.5 mm²; Plita va konditsioner: 3 x 4 mm² yoki 3 x 6 mm².",
    history: "Davlat GOST standartlari bo'yicha turar-joy binolarida xavfsizlik maqsadida mis VVGng-LS standarti joriy qilingan.",
    usage_area: "Barcha xonalarning devor ichidagi elektr provodkasi, shchitok avtomatlari va rozetkalar.",
    pros: "✅ 100% yonishni davom ettirmaydi; Yuqori elektr o'tkazuvchanlik; 30+ yil xizmat kafolati.",
    cons: "❌ Faqat GOST sertifikatli original kabel tanlash shart.",
    uzbekistan_sources: "Uzkabel, Andijankabel dilerlari, Chilonzor elektrobozori, Jomiy va Yangi Bozor do'konlari.",
    bim_tips: "Revit Electrical bo'limida yuklamalar quvvati (kW) hisoblanib avtomatik chiqariladi.",
    order_index: 11
  }
];

// ======================================================
// INTERACTIVE LOGIC: PC SPECS & CAROUSEL & MARKETPLACE
// ======================================================

function setSpecDevice(device) {
  haptic("light");
  specDevice = device;
  const block = document.getElementById("pc-specs-wrapper");
  if (block) {
    block.outerHTML = renderPcSpecsBlock();
  } else {
    render();
  }
}

function setSpecLevel(level) {
  haptic("light");
  specLevel = level;
  const block = document.getElementById("pc-specs-wrapper");
  if (block) {
    block.outerHTML = renderPcSpecsBlock();
  } else {
    render();
  }
}

function renderPcSpecsCompactCard() {
  return `
    <div class="card pc-specs-compact-card" onclick="openPcSpecsModal()" style="margin-bottom:18px; border:1px solid var(--border); padding:16px; background:linear-gradient(135deg, rgba(41,121,255,0.08) 0%, rgba(20,20,31,0.6) 100%); border-radius:var(--radius-md); cursor:pointer;">
      <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
        <div style="display:flex; align-items:center; gap:12px; min-width:0;">
          <div style="font-size:28px; width:48px; height:48px; border-radius:12px; background:var(--accent-soft); display:flex; align-items:center; justify-content:center; flex-shrink:0;">💻</div>
          <div style="min-width:0;">
            <div style="font-weight:750; font-size:14.5px; color:var(--text-primary); margin-bottom:2px;">Kompyuter & Noutbuk Parametrlari</div>
            <div style="font-size:11.5px; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">3ds Max & Revit: Minimal, Tavsiya, Pro talablar</div>
          </div>
        </div>
        <button class="btn" style="width:auto; margin:0; padding:8px 14px; font-size:12px; white-space:nowrap; flex-shrink:0;">
          Tanlash ↗
        </button>
      </div>
    </div>
  `;
}

function openPcSpecsModal() {
  haptic("light");
  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="closeDetail()">← Bosh sahifaga qaytish</div>
        ${renderPcSpecsBlock()}
      </div>
    `
  };
  render();
}

function renderPcSpecsBlock() {
  const currentDevData = PC_SPECS_DATA[specDevice] || PC_SPECS_DATA.desktop;
  const spec = currentDevData[specLevel] || currentDevData.recommended;

  return `
    <div id="pc-specs-wrapper" class="specs-section">
      <div class="specs-title-row">
        <div class="specs-main-title">
          <span>💻 Kompyuter & Noutbuk Parametrlari</span>
        </div>
        <div class="chip" style="font-size:11px; padding:4px 10px; background:rgba(41,121,255,0.12); color:var(--accent);">
          3ds Max & Revit
        </div>
      </div>

      <p style="font-size:12px; color:var(--text-secondary); margin-bottom:12px; line-height:1.4;">
        Revit va 3ds Max dasturlarida qotmasdan, qulay ishlash va sifatli render olish uchun texnik talablar:
      </p>

      <!-- Qurilma turi: Kompyuter yoki Noutbuk -->
      <div class="specs-segment-control">
        <button class="spec-tab-btn ${specDevice === "desktop" ? "active" : ""}" onclick="setSpecDevice('desktop')">
          🖥️ Kompyuter (PC / Desktop)
        </button>
        <button class="spec-tab-btn ${specDevice === "laptop" ? "active" : ""}" onclick="setSpecDevice('laptop')">
          💻 Noutbuk (Laptop)
        </button>
      </div>

      <!-- Daraja: Minimal, Tavsiya etilgan, Professional -->
      <div class="spec-level-chips">
        <div class="spec-level-chip ${specLevel === "minimal" ? "active" : ""}" onclick="setSpecLevel('minimal')">
          🟢 Minimal (Boshlovchilar)
        </div>
        <div class="spec-level-chip ${specLevel === "recommended" ? "active" : ""}" onclick="setSpecLevel('recommended')">
          ⚡ Tavsiya etilgan (Optimal)
        </div>
        <div class="spec-level-chip ${specLevel === "professional" ? "active" : ""}" onclick="setSpecLevel('professional')">
          🚀 Professional (Render)
        </div>
      </div>

      <div style="font-weight:750; font-size:14px; margin-bottom:10px; color:var(--text-primary); display:flex; align-items:center; justify-content:space-between;">
        <span>${escapeHtml(spec.title)}</span>
        <span style="font-size:11.5px; color:var(--accent); font-weight:700;">${spec.badge}</span>
      </div>

      <div class="specs-grid">
        <div class="spec-item-row">
          <div class="spec-item-icon">⚙️</div>
          <div class="spec-item-content">
            <div class="spec-item-label">Protsessor (CPU)</div>
            <div class="spec-item-value">${escapeHtml(spec.cpu)}</div>
            <div class="spec-item-hint">${escapeHtml(spec.cpu_hint)}</div>
          </div>
        </div>

        <div class="spec-item-row">
          <div class="spec-item-icon">🧠</div>
          <div class="spec-item-content">
            <div class="spec-item-label">Operativ Xotira (RAM)</div>
            <div class="spec-item-value">${escapeHtml(spec.ram)}</div>
            <div class="spec-item-hint">${escapeHtml(spec.ram_hint)}</div>
          </div>
        </div>

        <div class="spec-item-row">
          <div class="spec-item-icon">🎮</div>
          <div class="spec-item-content">
            <div class="spec-item-label">Videokarta (GPU)</div>
            <div class="spec-item-value">${escapeHtml(spec.gpu)}</div>
            <div class="spec-item-hint">${escapeHtml(spec.gpu_hint)}</div>
          </div>
        </div>

        <div class="spec-item-row">
          <div class="spec-item-icon">💽</div>
          <div class="spec-item-content">
            <div class="spec-item-label">Tezkor Xotira (SSD NVMe)</div>
            <div class="spec-item-value">${escapeHtml(spec.ssd)}</div>
            <div class="spec-item-hint">${escapeHtml(spec.ssd_hint)}</div>
          </div>
        </div>

        <div class="spec-item-row">
          <div class="spec-item-icon">🖥️</div>
          <div class="spec-item-content">
            <div class="spec-item-label">Ekran / Displey</div>
            <div class="spec-item-value">${escapeHtml(spec.screen)}</div>
            <div class="spec-item-hint">${escapeHtml(spec.screen_hint)}</div>
          </div>
        </div>

        <div class="spec-item-row">
          <div class="spec-item-icon">❄️</div>
          <div class="spec-item-content">
            <div class="spec-item-label">Sovutish & Quvvat</div>
            <div class="spec-item-value">${escapeHtml(spec.cooling)}</div>
          </div>
        </div>
      </div>

      <div class="spec-advice-box">
        <span>💡</span>
        <div><strong>Ekspert xulosasi:</strong> ${escapeHtml(spec.advice)}</div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// ----------------------------------------------------
// SHOWCASE / RESULT SLIDER LOGIC (Talab 3)
// ----------------------------------------------------

let showcaseModalReturnContext = "home";

function returnFromShowcaseModal() {
  if (showcaseModalReturnContext === "admin") {
    renderAdminPanel();
  } else {
    adminView = null;
    closeDetail();
  }
}

function getShowcaseSlides() {
  const allSc = state.showcases && state.showcases.length ? state.showcases : [];
  // Dummy / samplelarni chiqarib tashlash
  const realSc = allSc.filter(sc => sc && sc.pdf_url && !sc.pdf_url.includes("sample_"));
  const showcases = realSc.length ? realSc : allSc;
  if (!showcases.length) return [];

  const slides = [];

  showcases.forEach((sc, scIdx) => {
    const driveId = extractGoogleDriveId(sc.pdf_url || "");
    
    // Admin tanlagan listlar raqamlarini ajratib olish
    let pageNumbers = [];
    if (sc.selected_pages) {
      pageNumbers = String(sc.selected_pages)
        .split(/[,\s]+/)
        .map(n => parseInt(n.trim(), 10))
        .filter(n => !isNaN(n) && n > 0);
    }

    if (!pageNumbers.length) {
      pageNumbers = [1, 2, 3, 4, 5];
    }

    pageNumbers.forEach(pageNum => {
      slides.push({
        sc,
        scIdx,
        pageNum,
        driveId,
        pdfUrl: sc.pdf_url || "",
        slideIndex: slides.length
      });
    });
  });

  return slides;
}

// PDF.js orqali listlarni canvasga chizish kesh va funksiyalari
const pdfDocPromiseCache = new Map();

async function renderPdfSlide(canvasId, driveId, rawPdfUrl, pageNum) {
  if (typeof window.pdfjsLib === "undefined") return;
  const canvas = document.getElementById(canvasId);
  if (!canvas || canvas.dataset.rendered === "true") return;

  const proxyUrl = driveId
    ? `/api/pdf-proxy?id=${encodeURIComponent(driveId)}`
    : `/api/pdf-proxy?url=${encodeURIComponent(rawPdfUrl)}`;

  try {
    let docPromise = pdfDocPromiseCache.get(proxyUrl);
    if (!docPromise) {
      docPromise = window.pdfjsLib.getDocument({
        url: proxyUrl,
        cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
        cMapPacked: true
      }).promise;
      pdfDocPromiseCache.set(proxyUrl, docPromise);
    }

    const pdfDoc = await docPromise;
    const actualPageNum = Math.min(Math.max(1, pageNum), pdfDoc.numPages);
    const page = await pdfDoc.getPage(actualPageNum);

    const containerWidth = canvas.parentElement?.clientWidth || 360;
    const unscaledViewport = page.getViewport({ scale: 1 });
    const scale = Math.max(1.2, (containerWidth / unscaledViewport.width) * 1.5);
    const viewport = page.getViewport({ scale });

    const ctx = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: ctx, viewport }).promise;
    canvas.dataset.rendered = "true";

    const spinner = canvas.parentElement?.querySelector(".pdf-sheet-spinner");
    if (spinner) {
      spinner.style.opacity = "0";
      setTimeout(() => { if (spinner) spinner.style.display = "none"; }, 300);
    }
  } catch (err) {
    console.warn("PDF sheet render error:", err);
  }
}

function renderCurrentAndAdjacentPdfSlides(force = false) {
  const slides = getShowcaseSlides();
  if (!slides.length) return;
  const cur = showcaseCurrentIndex;
  const toRender = [cur, (cur + 1) % slides.length, (cur - 1 + slides.length) % slides.length];

  toRender.forEach(idx => {
    const slide = slides[idx];
    if (slide && (slide.driveId || slide.pdfUrl)) {
      if (force) {
        const c = document.getElementById(`pdf-canvas-${idx}`);
        if (c) delete c.dataset.rendered;
      }
      renderPdfSlide(`pdf-canvas-${idx}`, slide.driveId, slide.pdfUrl, slide.pageNum);
    }
  });
}

let _pdfResizeTimer = null;
window.addEventListener("resize", () => {
  if (_pdfResizeTimer) clearTimeout(_pdfResizeTimer);
  _pdfResizeTimer = setTimeout(() => {
    if (activeTab === "home" && !currentView) {
      renderCurrentAndAdjacentPdfSlides(true);
    }
  }, 250);
});

function initShowcaseTimer() {
  if (showcaseAutoTimer) clearInterval(showcaseAutoTimer);
  showcaseAutoTimer = setInterval(() => {
    const slides = getShowcaseSlides();
    if (!slides.length) return;
    showcaseCurrentIndex = (showcaseCurrentIndex + 1) % slides.length;
    updateShowcaseDom();
  }, 5000);
}

function nextShowcaseSlide(e) {
  if (e) e.stopPropagation();
  haptic("light");
  const slides = getShowcaseSlides();
  if (!slides.length) return;
  showcaseCurrentIndex = (showcaseCurrentIndex + 1) % slides.length;
  updateShowcaseDom();
  initShowcaseTimer();
}

function prevShowcaseSlide(e) {
  if (e) e.stopPropagation();
  haptic("light");
  const slides = getShowcaseSlides();
  if (!slides.length) return;
  showcaseCurrentIndex = (showcaseCurrentIndex - 1 + slides.length) % slides.length;
  updateShowcaseDom();
  initShowcaseTimer();
}

function setShowcaseSlide(idx, e) {
  if (e) e.stopPropagation();
  haptic("light");
  showcaseCurrentIndex = idx;
  updateShowcaseDom();
  initShowcaseTimer();
}

function updateShowcaseDom() {
  const container = document.getElementById("showcase-carousel-inner");
  if (!container) return;
  const slides = container.querySelectorAll(".carousel-slide");
  slides.forEach((slide, i) => {
    if (i === showcaseCurrentIndex) {
      slide.classList.add("active");
    } else {
      slide.classList.remove("active");
    }
  });

  const dots = document.querySelectorAll(".carousel-dot");
  dots.forEach((dot, i) => {
    if (i === showcaseCurrentIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });

  renderCurrentAndAdjacentPdfSlides();
}

function renderShowcaseCarousel() {
  const showcases = state.showcases && state.showcases.length ? state.showcases : DEFAULT_SHOWCASES;
  if (!showcases.length) return "";

  const slides = getShowcaseSlides();
  if (!slides.length) return "";

  if (showcaseCurrentIndex >= slides.length) showcaseCurrentIndex = 0;

  setTimeout(renderCurrentAndAdjacentPdfSlides, 80);

  return `
    <div class="showcase-section">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <div class="section-title" style="margin:0;">
          🎓 O'quvchilar natijalari va rabochka loyihalari
        </div>
        ${state.is_admin ? `
          <button class="admin-small-btn" onclick="openAddShowcaseModal()" style="font-size:11px; padding:5px 9px;">
            ➕ Natija qo'shish
          </button>
        ` : ""}
      </div>
      <p style="font-size:12.5px; color:var(--text-secondary); margin-bottom:12px;">
        Kurs bitiruvchilari erishgan natijalar va to'liq tayyorlangan ishchi loyiha chizmalari:
      </p>

      <div class="carousel-wrap">
        <div id="showcase-carousel-inner" class="carousel-track">
          ${slides.map((item, globalIdx) => {
            const isActive = globalIdx === showcaseCurrentIndex;
            const sc = item.sc;

            return `
              <div class="carousel-slide ${isActive ? "active" : ""}" data-idx="${globalIdx}">
                <!-- Faqat Google Drive PDF chizmasi (ortiqcha rasmlarsiz) -->
                <div class="carousel-sheet-card" onclick="openShowcaseFullscreenModal(${globalIdx})" title="Kattalashtirib ko'rish" style="cursor:zoom-in;">
                  <canvas id="pdf-canvas-${globalIdx}" class="carousel-pdf-canvas"></canvas>
                  <div class="pdf-sheet-spinner" id="pdf-spinner-${globalIdx}">
                    <div class="spinner"></div>
                    <span style="font-size:11.5px; color:var(--text-secondary); margin-top:8px;">${item.pageNum}-list ochilmoqda...</span>
                  </div>
                  <div class="sheet-zoom-overlay-hint">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                    <span>Kattalashtirish</span>
                  </div>
                </div>

                <div class="carousel-body">
                  <!-- Faqat qaysi kursdan natija ekanligi va chegirma uyg'un tarzda -->
                  <div class="carousel-badge-row">
                    <span class="carousel-course-tag">🎓 ${escapeHtml(sc.course_title || "Revit kursi")} o'quvchisi natijasi</span>
                    ${sc.discount_badge ? `<span class="carousel-discount-badge">${escapeHtml(sc.discount_badge)}</span>` : ""}
                  </div>

                  ${state.is_admin ? `
                    <div class="carousel-admin-row">
                      <button class="admin-small-btn" onclick="openEditShowcaseModal(${Number(sc.id)})" title="Tahrirlash">
                        ✏️ Tahrirlash
                      </button>
                      <button class="admin-small-btn" style="background:rgba(235,59,59,0.2); color:#eb3b3b;" onclick="deleteShowcaseItem(${Number(sc.id)})" title="O'chirish">
                        🗑️ O'chirish
                      </button>
                    </div>
                  ` : ""}
                </div>
              </div>
            `;
          }).join("")}
        </div>

        <!-- Ikki tarafidagi yozuvsiz piktogrammali (iconli) navigatsiya tugmalari -->
        <div class="carousel-nav-buttons">
          <button class="carousel-arrow-btn" onclick="prevShowcaseSlide(event)" aria-label="Oldingi slayd">
            <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button class="carousel-arrow-btn" onclick="nextShowcaseSlide(event)" aria-label="Keyingi slayd">
            <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        <!-- Nuqtalar (Dots) -->
        <div class="carousel-dots">
          ${slides.map((_, idx) => `
            <div class="carousel-dot ${idx === showcaseCurrentIndex ? "active" : ""}" onclick="setShowcaseSlide(${idx})"></div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// SHOWCASE FULLSCREEN ZOOM VIEWER (Faqat ko'rish, ulashish/tarqatishsiz)
// ----------------------------------------------------
let fullscreenShowcaseIdx = 0;
let fullscreenShowcaseScale = 1.0;

function openShowcaseFullscreenModal(slideIdx) {
  haptic("light");
  if (showcaseAutoTimer) clearInterval(showcaseAutoTimer);
  
  const slides = getShowcaseSlides();
  if (!slides || !slides.length) return;
  fullscreenShowcaseIdx = Math.max(0, Math.min(slideIdx, slides.length - 1));
  fullscreenShowcaseScale = 1.0;

  let modalEl = document.getElementById("showcase-fullscreen-modal");
  if (!modalEl) {
    modalEl = document.createElement("div");
    modalEl.id = "showcase-fullscreen-modal";
    modalEl.className = "showcase-fullscreen-overlay";
    document.body.appendChild(modalEl);
  }

  renderFullscreenModalContent();
  document.body.style.overflow = "hidden";
}

function closeShowcaseFullscreenModal() {
  haptic("light");
  const modalEl = document.getElementById("showcase-fullscreen-modal");
  if (modalEl) modalEl.remove();
  document.body.style.overflow = "";
  initShowcaseTimer();
}

function renderFullscreenModalContent() {
  const modalEl = document.getElementById("showcase-fullscreen-modal");
  if (!modalEl) return;

  const slides = getShowcaseSlides();
  const slide = slides[fullscreenShowcaseIdx];
  if (!slide) return;

  modalEl.innerHTML = `
    <div class="sf-backdrop" onclick="closeShowcaseFullscreenModal()"></div>
    <div class="sf-container">
      <!-- Yuqori boshqaruv paneli -->
      <div class="sf-header">
        <div class="sf-info">
          <div class="sf-title">📄 ${slide.pageNum}-list</div>
          <div class="sf-subtitle">🎓 ${escapeHtml(slide.sc.course_title || "Revit kursi")} bitiruvchi natijasi</div>
        </div>
        <div class="sf-actions">
          <div class="sf-zoom-controls">
            <button class="sf-tool-btn" onclick="zoomFullscreenShowcase(-0.35)" title="Kichiklashtirish">➖</button>
            <button class="sf-tool-btn sf-zoom-label" onclick="resetFullscreenShowcaseZoom()" title="Asl o'lcham (100%)">
              <span id="sf-zoom-text">${Math.round(fullscreenShowcaseScale * 100)}%</span>
            </button>
            <button class="sf-tool-btn" onclick="zoomFullscreenShowcase(0.35)" title="Kattalashtirish">➕</button>
          </div>
          <button class="sf-close-btn" onclick="closeShowcaseFullscreenModal()" title="Yopish">✕</button>
        </div>
      </div>

      <!-- Asosiy chizma ko'rish maydoni -->
      <div class="sf-viewport" id="sf-viewport">
        <div class="sf-canvas-wrap" id="sf-canvas-wrap" style="transform: scale(${fullscreenShowcaseScale});">
          <canvas id="fullscreen-sheet-canvas"></canvas>
          <div id="fullscreen-sheet-spinner" class="pdf-sheet-spinner">
            <div class="spinner"></div>
            <span style="font-size:12.5px; color:#fff; margin-top:10px;">${slide.pageNum}-list yuqori sifatda yuklanmoqda...</span>
          </div>
        </div>
      </div>

      <!-- Chap/O'ng listga o'tish tugmalari -->
      ${slides.length > 1 ? `
        <button class="sf-nav-btn sf-prev" onclick="prevFullscreenSlide(event)" title="Oldingi list">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button class="sf-nav-btn sf-next" onclick="nextFullscreenSlide(event)" title="Keyingi list">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      ` : ""}

      <!-- Pastki ko'rsatkich -->
      <div class="sf-footer">
        <span>${fullscreenShowcaseIdx + 1} / ${slides.length}</span>
      </div>
    </div>
  `;

  renderFullscreenHighResCanvas(slide);
}

function zoomFullscreenShowcase(delta) {
  haptic("light");
  fullscreenShowcaseScale = Math.max(0.6, Math.min(3.5, fullscreenShowcaseScale + delta));
  applyFullscreenTransform();
}

function resetFullscreenShowcaseZoom() {
  haptic("light");
  fullscreenShowcaseScale = 1.0;
  applyFullscreenTransform();
}

function applyFullscreenTransform() {
  const wrap = document.getElementById("sf-canvas-wrap");
  const zoomText = document.getElementById("sf-zoom-text");
  if (wrap) {
    wrap.style.transform = `scale(${fullscreenShowcaseScale})`;
  }
  if (zoomText) {
    zoomText.textContent = `${Math.round(fullscreenShowcaseScale * 100)}%`;
  }
}

function prevFullscreenSlide(e) {
  if (e) e.stopPropagation();
  haptic("light");
  const slides = getShowcaseSlides();
  if (!slides || !slides.length) return;
  fullscreenShowcaseIdx = (fullscreenShowcaseIdx - 1 + slides.length) % slides.length;
  fullscreenShowcaseScale = 1.0;
  renderFullscreenModalContent();
}

function nextFullscreenSlide(e) {
  if (e) e.stopPropagation();
  haptic("light");
  const slides = getShowcaseSlides();
  if (!slides || !slides.length) return;
  fullscreenShowcaseIdx = (fullscreenShowcaseIdx + 1) % slides.length;
  fullscreenShowcaseScale = 1.0;
  renderFullscreenModalContent();
}

async function renderFullscreenHighResCanvas(slide) {
  const canvas = document.getElementById("fullscreen-sheet-canvas");
  const spinner = document.getElementById("fullscreen-sheet-spinner");
  if (!canvas || !slide) return;

  const rawPdfUrl = slide.pdfUrl || "";
  const proxyUrl = slide.driveId
    ? `/api/pdf-proxy?id=${slide.driveId}`
    : `/api/pdf-proxy?url=${encodeURIComponent(rawPdfUrl)}`;

  try {
    let docPromise = pdfDocPromiseCache.get(proxyUrl);
    if (!docPromise) {
      docPromise = window.pdfjsLib.getDocument({
        url: proxyUrl,
        cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
        cMapPacked: true
      }).promise;
      pdfDocPromiseCache.set(proxyUrl, docPromise);
    }

    const pdfDoc = await docPromise;
    const actualPageNum = Math.min(Math.max(1, slide.pageNum), pdfDoc.numPages);
    const page = await pdfDoc.getPage(actualPageNum);

    // High resolution render for zoom clarity
    const viewport = page.getViewport({ scale: 2.2 });
    const ctx = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: ctx, viewport }).promise;

    if (spinner) {
      spinner.style.opacity = "0";
      setTimeout(() => { if (spinner) spinner.style.display = "none"; }, 250);
    }
  } catch (err) {
    console.warn("Fullscreen PDF sheet render error:", err);
    if (spinner) {
      spinner.innerHTML = `<span style="color:#ff6b6b; font-size:12px;">Yuklashda xatolik yuz berdi.</span>`;
    }
  }
}

// ----------------------------------------------------
// ADMIN SHEET SELECTOR & PDF INSPECT STATE & HELPERS
// ----------------------------------------------------
let currentShowcaseTotalSheets = 15;
let currentShowcaseSelectedSheets = new Set([1, 2, 3, 4, 5]);

function initSheetSelector(initialSelectedStr, totalCount) {
  currentShowcaseTotalSheets = totalCount || 15;
  currentShowcaseSelectedSheets = new Set();
  if (initialSelectedStr) {
    String(initialSelectedStr).split(/[,\s]+/).forEach(n => {
      const num = parseInt(n.trim(), 10);
      if (!isNaN(num) && num > 0) currentShowcaseSelectedSheets.add(num);
    });
  }
  if (!currentShowcaseSelectedSheets.size) {
    for (let i = 1; i <= Math.min(5, currentShowcaseTotalSheets); i++) {
      currentShowcaseSelectedSheets.add(i);
    }
  }
  const maxSelected = Math.max(...Array.from(currentShowcaseSelectedSheets), 0);
  if (maxSelected > currentShowcaseTotalSheets) {
    currentShowcaseTotalSheets = maxSelected;
  }
  renderSheetChips();
}

function renderSheetChips() {
  const container = document.getElementById("sheet-chips-container");
  const totalInput = document.getElementById("sc-total-sheets");
  const selectedInput = document.getElementById("sc-selected-pages") || document.getElementById("edit-sc-selected-pages");
  if (!container) return;

  if (totalInput) totalInput.value = currentShowcaseTotalSheets;

  let html = "";
  for (let i = 1; i <= currentShowcaseTotalSheets; i++) {
    const isChecked = currentShowcaseSelectedSheets.has(i);
    html += `
      <div class="sheet-chip ${isChecked ? "active" : ""}" onclick="toggleSheetChip(${i})">
        ${isChecked ? "✓ " : ""}${i}-list
      </div>
    `;
  }
  container.innerHTML = html;

  const sortedList = Array.from(currentShowcaseSelectedSheets).sort((a, b) => a - b);
  if (selectedInput && document.activeElement !== selectedInput) {
    selectedInput.value = sortedList.join(", ");
  }
}

function toggleSheetChip(sheetNum) {
  haptic("light");
  if (currentShowcaseSelectedSheets.has(sheetNum)) {
    currentShowcaseSelectedSheets.delete(sheetNum);
  } else {
    currentShowcaseSelectedSheets.add(sheetNum);
  }
  renderSheetChips();
}

function quickSelectSheets(type) {
  haptic("medium");
  currentShowcaseSelectedSheets.clear();
  if (type === "all") {
    for (let i = 1; i <= currentShowcaseTotalSheets; i++) currentShowcaseSelectedSheets.add(i);
  } else if (type === "first5") {
    for (let i = 1; i <= Math.min(5, currentShowcaseTotalSheets); i++) currentShowcaseSelectedSheets.add(i);
  } else if (type === "first10") {
    for (let i = 1; i <= Math.min(10, currentShowcaseTotalSheets); i++) currentShowcaseSelectedSheets.add(i);
  }
  renderSheetChips();
}

function updateSheetTotalFromInput(val) {
  const num = parseInt(val, 10);
  if (!isNaN(num) && num >= 1 && num <= 100) {
    currentShowcaseTotalSheets = num;
    renderSheetChips();
  }
}

function syncChipsFromTextInput(val) {
  const nums = val.split(/[,\s]+/).map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n) && n > 0);
  currentShowcaseSelectedSheets = new Set(nums);
  const maxN = Math.max(...nums, 0);
  if (maxN > currentShowcaseTotalSheets) {
    currentShowcaseTotalSheets = maxN;
  }
  renderSheetChips();
}

async function inspectShowcasePdf() {
  const pdfInput = document.getElementById("sc-pdf") || document.getElementById("edit-sc-pdf");
  const statusEl = document.getElementById("inspect-pdf-status");
  const btn = document.getElementById("btn-inspect-pdf");
  const url = pdfInput?.value.trim() || "";

  if (!url) {
    showAlert("Avval Google Drive PDF havolasini kiriting!");
    return;
  }

  if (btn) btn.classList.add("btn-loading");
  if (statusEl) {
    statusEl.innerHTML = `<span style="color:var(--accent);">⏳ Google Disk PDF fayli o'qilmoqda va listlar aniqlanmoqda...</span>`;
  }

  try {
    const res = await adminApi("/api/admin/showcases/inspect-pdf", { pdf_url: url });
    if (res && res.total_pages) {
      currentShowcaseTotalSheets = res.total_pages;
      initSheetSelector("", res.total_pages);
      if (statusEl) {
        statusEl.innerHTML = `<span style="color:#00e676;">✅ ${res.message}</span>`;
      }
      showToast(`${res.total_pages} ta list aniqlandi!`);
    } else {
      throw new Error(res.error || "PDF tahlil qilib bo'lmadi");
    }
  } catch (err) {
    try {
      const driveId = extractGoogleDriveId(url);
      if (window.pdfjsLib && driveId) {
        const doc = await window.pdfjsLib.getDocument(`/api/pdf-proxy?id=${driveId}`).promise;
        currentShowcaseTotalSheets = doc.numPages;
        initSheetSelector("", doc.numPages);
        if (statusEl) {
          statusEl.innerHTML = `<span style="color:#00e676;">✅ PDF o'qildi: jami ${doc.numPages} ta list aniqlandi.</span>`;
        }
        showToast(`${doc.numPages} ta list aniqlandi!`);
        return;
      }
    } catch (clientErr) {
      console.warn("Client PDF inspect error:", clientErr);
    }

    if (statusEl) {
      statusEl.innerHTML = `<span style="color:#ffab00;">💡 Listlar sonini quyidagi katakchada belgilab, kerakli listlarni tanlashingiz mumkin.</span>`;
    }
  } finally {
    if (btn) btn.classList.remove("btn-loading");
  }
}

// Admin Showcase Boshqaruvi
function openAddShowcaseModal() {
  showcaseModalReturnContext = (adminView && currentView && currentView.isAdminPanel) ? "admin" : "home";
  const courses = state.courses || [];
  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="returnFromShowcaseModal()">← Ortga qaytish</div>
        <div class="page-title">Yangi Natija Qo'shish</div>

        <div class="admin-form">
          <div class="apple-field">
            <label>Kursni tanlang *</label>
            <select id="sc-course-id" class="apple-input">
              ${courses.map(c => `<option value="${c.id}">${escapeHtml(c.title)}</option>`).join("")}
            </select>
          </div>

          <div class="apple-field">
            <label>Google Drive PDF loyiha havolasi *</label>
            <input id="sc-pdf" class="apple-input" type="url" placeholder="https://drive.google.com/file/d/.../view">
            <button type="button" class="btn btn-secondary" id="btn-inspect-pdf" onclick="inspectShowcasePdf()" style="margin-top:8px; display:flex; align-items:center; justify-content:center; gap:6px;">
              🔍 PDF listlarini o'qish (Hamma listlarni aniqlash)
            </button>
            <div id="inspect-pdf-status" style="font-size:12px; margin-top:6px; color:var(--text-secondary);"></div>
          </div>

          <!-- Slayderda ko'rsatiladigan listlarni tanlash bloki -->
          <div class="sheet-selector-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
              <label style="font-weight:700; font-size:13px; color:var(--text-primary); margin:0;">
                📋 Slayderda ko'rsatiladigan listlar:
              </label>
              <div style="display:flex; gap:6px;">
                <button type="button" class="admin-small-btn" onclick="quickSelectSheets('all')" style="font-size:10.5px; padding:3px 8px;">Hammasi</button>
                <button type="button" class="admin-small-btn" onclick="quickSelectSheets('first5')" style="font-size:10.5px; padding:3px 8px;">Dastlabki 5 ta</button>
                <button type="button" class="admin-small-btn" onclick="quickSelectSheets('first10')" style="font-size:10.5px; padding:3px 8px;">10 ta</button>
                <button type="button" class="admin-small-btn" onclick="quickSelectSheets('clear')" style="font-size:10.5px; padding:3px 8px; color:var(--danger);">Tozalash</button>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
              <span style="font-size:12px; color:var(--text-secondary);">Jami aniqlangan listlar soni:</span>
              <input type="number" id="sc-total-sheets" class="apple-input" style="width:70px; padding:4px 8px; text-align:center; font-weight:700;" value="15" min="1" max="100" onchange="updateSheetTotalFromInput(this.value)">
            </div>

            <div id="sheet-chips-container" class="sheet-chips-grid"></div>

            <div style="margin-top:10px;">
              <span style="font-size:11.5px; color:var(--text-secondary);">Tanlangan listlar raqamlari (vergul bilan):</span>
              <input id="sc-selected-pages" class="apple-input" style="font-size:12px; margin-top:4px;" value="1, 2, 3, 4, 5" placeholder="1, 2, 3, 4, 5" oninput="syncChipsFromTextInput(this.value)">
            </div>
          </div>

          <div class="apple-field" style="margin-top:14px;">
            <label>Chegirma matni (ixtiyoriy, agar kursga chegirma bo'lsa)</label>
            <input id="sc-discount" class="apple-input" type="text" placeholder="Masalan: 🔥 25% Chegirma: 1 125 000 so'm">
          </div>

          <button id="save-sc-btn" class="btn" onclick="submitAddShowcase()" style="margin-top:10px;">
            💾 Saqlash va E'lon qilish
          </button>
        </div>
      </div>
    `
  };
  render();
  setTimeout(() => initSheetSelector("1, 2, 3, 4, 5", 15), 80);
}

async function submitAddShowcase() {
  const courseSelect = document.getElementById("sc-course-id");
  const courseId = courseSelect?.value;
  const courseTitle = courseSelect?.options[courseSelect.selectedIndex]?.text || "";
  const pdfUrl = document.getElementById("sc-pdf")?.value.trim() || "";
  const selectedPages = document.getElementById("sc-selected-pages")?.value.trim() || "1, 2, 3, 4, 5";
  const discount = document.getElementById("sc-discount")?.value.trim();

  if (!pdfUrl) return showAlert("Google Drive PDF havolasini kiriting!");

  const btn = document.getElementById("save-sc-btn");
  if (btn) btn.classList.add("btn-loading");

  try {
    haptic("medium");
    await adminApi("/api/admin/showcases/add", {
      course_id: courseId,
      course_title: courseTitle,
      title: courseTitle ? `${courseTitle} natijasi` : "Revit o'quvchisi natijasi",
      student_name: "",
      pdf_url: pdfUrl,
      selected_pages: selectedPages,
      preview_image_url: pdfUrl,
      discount_badge: discount || null,
      description: ""
    });
    showToast("O'quvchi natijasi saqlandi!");
    await loadContent();
    returnFromShowcaseModal();
  } catch (err) {
    showAlert(err.message || "Saqlashda xatolik.");
  } finally {
    if (btn) btn.classList.remove("btn-loading");
  }
}

function openEditShowcaseModal(id) {
  showcaseModalReturnContext = (adminView && currentView && currentView.isAdminPanel) ? "admin" : "home";
  const item = (state.showcases || []).find(s => Number(s.id) === Number(id));
  if (!item) return showAlert("Ma'lumot topilmadi.");

  const courses = state.courses || [];
  const selectedPagesStr = item.selected_pages || "1, 2, 3, 4, 5";

  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="returnFromShowcaseModal()">← Ortga qaytish</div>
        <div class="page-title">Natijani tahrirlash</div>

        <div class="admin-form">
          <div class="apple-field">
            <label>Kursni tanlang *</label>
            <select id="edit-sc-course" class="apple-input">
              ${courses.map(c => `<option value="${c.id}" ${Number(c.id) === Number(item.course_id) ? "selected" : ""}>${escapeHtml(c.title)}</option>`).join("")}
            </select>
          </div>

          <div class="apple-field">
            <label>Google Drive PDF loyiha havolasi *</label>
            <input id="edit-sc-pdf" class="apple-input" type="url" value="${escapeHtml(item.pdf_url || "")}" placeholder="https://drive.google.com/file/d/.../view">
            <button type="button" class="btn btn-secondary" id="btn-inspect-pdf" onclick="inspectShowcasePdf()" style="margin-top:8px; display:flex; align-items:center; justify-content:center; gap:6px;">
              🔍 PDF listlarini o'qish (Hamma listlarni aniqlash)
            </button>
            <div id="inspect-pdf-status" style="font-size:12px; margin-top:6px; color:var(--text-secondary);"></div>
          </div>

          <!-- Slayderda ko'rsatiladigan listlarni tanlash bloki -->
          <div class="sheet-selector-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
              <label style="font-weight:700; font-size:13px; color:var(--text-primary); margin:0;">
                📋 Slayderda ko'rsatiladigan listlar:
              </label>
              <div style="display:flex; gap:6px;">
                <button type="button" class="admin-small-btn" onclick="quickSelectSheets('all')" style="font-size:10.5px; padding:3px 8px;">Hammasi</button>
                <button type="button" class="admin-small-btn" onclick="quickSelectSheets('first5')" style="font-size:10.5px; padding:3px 8px;">Dastlabki 5 ta</button>
                <button type="button" class="admin-small-btn" onclick="quickSelectSheets('first10')" style="font-size:10.5px; padding:3px 8px;">10 ta</button>
                <button type="button" class="admin-small-btn" onclick="quickSelectSheets('clear')" style="font-size:10.5px; padding:3px 8px; color:var(--danger);">Tozalash</button>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
              <span style="font-size:12px; color:var(--text-secondary);">Jami aniqlangan listlar soni:</span>
              <input type="number" id="sc-total-sheets" class="apple-input" style="width:70px; padding:4px 8px; text-align:center; font-weight:700;" value="15" min="1" max="100" onchange="updateSheetTotalFromInput(this.value)">
            </div>

            <div id="sheet-chips-container" class="sheet-chips-grid"></div>

            <div style="margin-top:10px;">
              <span style="font-size:11.5px; color:var(--text-secondary);">Tanlangan listlar raqamlari (vergul bilan):</span>
              <input id="edit-sc-selected-pages" class="apple-input" style="font-size:12px; margin-top:4px;" value="${escapeHtml(selectedPagesStr)}" placeholder="1, 2, 3, 4, 5" oninput="syncChipsFromTextInput(this.value)">
            </div>
          </div>

          <div class="apple-field" style="margin-top:14px;">
            <label>Chegirma matni</label>
            <input id="edit-sc-discount" class="apple-input" type="text" value="${escapeHtml(item.discount_badge || "")}" placeholder="Masalan: 🔥 25% Chegirma: 1 125 000 so'm">
          </div>

          <button id="update-sc-btn" class="btn" onclick="submitUpdateShowcase(${Number(id)})" style="margin-top:10px;">
            💾 O'zgarishlarni saqlash
          </button>
        </div>
      </div>
    `
  };
  render();
  setTimeout(() => initSheetSelector(selectedPagesStr, 15), 80);
}

async function submitUpdateShowcase(id) {
  const courseSelect = document.getElementById("edit-sc-course");
  const courseId = courseSelect?.value;
  const courseTitle = courseSelect?.options[courseSelect.selectedIndex]?.text || "";
  const pdfUrl = document.getElementById("edit-sc-pdf")?.value.trim() || "";
  const selectedPages = document.getElementById("edit-sc-selected-pages")?.value.trim() || "1, 2, 3, 4, 5";
  const discount = document.getElementById("edit-sc-discount")?.value.trim();

  if (!pdfUrl) return showAlert("Google Drive PDF havolasini kiriting!");

  const btn = document.getElementById("update-sc-btn");
  if (btn) btn.classList.add("btn-loading");

  try {
    haptic("medium");
    await adminApi(`/api/admin/showcases/${Number(id)}/update`, {
      course_id: courseId,
      course_title: courseTitle,
      title: courseTitle ? `${courseTitle} natijasi` : "Revit o'quvchisi natijasi",
      student_name: "",
      pdf_url: pdfUrl,
      selected_pages: selectedPages,
      preview_image_url: pdfUrl,
      discount_badge: discount || null,
      description: ""
    });
    showToast("Muvaffaqiyatli yangilandi!");
    await loadContent();
    returnFromShowcaseModal();
  } catch (err) {
    showAlert(err.message || "Yangilashda xato.");
  } finally {
    if (btn) btn.classList.remove("btn-loading");
  }
}

function deleteShowcaseItem(id) {
  showConfirm(
    "Natija o'chirilsinmi?",
    "Ushbu slayd bosh sahifadagi karuseldan olib tashlanadi.",
    "Ha, o'chirish",
    async () => {
      await adminApi(`/api/admin/showcases/${Number(id)}/delete`);
      showToast("O'chirildi!");
      await loadContent();
      if (adminView === "library") renderAdminPanel();
    }
  );
}

// ----------------------------------------------------
// TALAB 5: DONAT VA QO'LLAB-QUVVATLASH LOGIKASI
// ----------------------------------------------------

// ----------------------------------------------------
// SUPPORT CARDS (QO'LLAB-QUVVATLASH TIZIMI)
// ----------------------------------------------------

function formatCardNumber(num) {
  const digits = String(num || "").replace(/\D/g, "");
  if (!digits) return String(num || "");
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function copySupportCard(cardNumber, btn) {
  haptic("medium");
  const cleanDigits = String(cardNumber || "").replace(/\s+/g, "");

  function onSuccess() {
    if (btn) {
      const origHtml = btn.innerHTML;
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Nusxalandi ✓`;
      btn.style.background = "#10b981";
      setTimeout(() => {
        btn.innerHTML = origHtml;
        btn.style.background = "";
      }, 2000);
    }
    showToast("Karta raqami nusxalandi");
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(cleanDigits).then(onSuccess).catch(() => {
      fallbackCopy(cleanDigits);
      onSuccess();
    });
  } else {
    fallbackCopy(cleanDigits);
    onSuccess();
  }
}

function openSupportCardsModal() {
  haptic("light");
  lastDetailReturnScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

  const rawCards = (state.support_cards && state.support_cards.length)
    ? state.support_cards
    : [
        { card_type: "UZCARD", card_number: "8600 5304 1234 5678", cardholder_name: "ABDULLOH TANGIRBERGANOV", is_active: true },
        { card_type: "HUMO", card_number: "9860 1234 5678 9012", cardholder_name: "ABDULLOH TANGIRBERGANOV", is_active: true }
      ];

  const activeCards = rawCards.filter(c => c.is_active !== false);

  const cardsHtml = activeCards.length ? activeCards.map(c => `
    <div class="support-card-item">
      <div class="support-card-top">
        <span class="support-card-type-badge">${escapeHtml(String(c.card_type || "UZCARD").toUpperCase())}</span>
        <button class="support-card-copy-btn" onclick="copySupportCard('${escapeJsString(c.card_number)}', this)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Nusxalash
        </button>
      </div>

      <div class="support-card-label">Karta raqami</div>
      <div class="support-card-num-box">
        <span class="support-card-num">${escapeHtml(formatCardNumber(c.card_number))}</span>
      </div>

      <div class="support-card-holder-box">
        <span style="color:var(--text-secondary); font-size:12px;">Karta egasi:</span>
        <span class="support-card-holder-name">${escapeHtml(String(c.cardholder_name || "").toUpperCase())}</span>
      </div>
    </div>
  `).join("") : `
    <div class="support-empty-notice">
      Hozircha qo‘llab-quvvatlash uchun karta ma’lumotlari mavjud emas.
    </div>
  `;

  currentView = {
    html: `
      <div class="page support-cards-page">
        <div class="back-btn" onclick="closeDetail()">← Profilga qaytish</div>

        <div class="support-cards-header">
          <div class="support-cards-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            Ehson va Hissa
          </div>
          <div class="support-cards-title">Platformani qo‘llab-quvvatlash</div>
          <div class="support-cards-subtitle">YOSHUZBEKK Academy rivojiga o‘z hissangizni qo‘shmoqchi bo‘lsangiz, quyidagi kartalardan foydalanishingiz mumkin.</div>
        </div>

        <div class="support-cards-list">
          ${cardsHtml}
        </div>
      </div>
    `
  };
  render();
  window.scrollTo(0, 0);
}

// ----------------------------------------------------
// FOYDALANISH QOIDALARI: ONBOARDING GATE
// ----------------------------------------------------

function renderTermsOnboardingHtml() {
  const cardsHtml = PLATFORM_RULES_SECTIONS.map((sec, idx) => `
    <div class="rules-card">
      <div class="rules-card-header">
        <span class="rules-card-num">${idx + 1}</span>
        <span class="rules-card-title">${escapeHtml(sec.title)}</span>
      </div>
      <ul class="rules-list">
        ${sec.items.map(item => `
          <li class="rules-item">
            <span class="rules-item-bullet"></span>
            <span>${escapeHtml(item)}</span>
          </li>
        `).join("")}
      </ul>
    </div>
  `).join("");

  return `
    <div class="page rules-page terms-gate-container">
      <div class="rules-header-card">
        <div class="rules-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          YOSHUZBEKK ACADEMY
        </div>
        <div class="rules-main-title">Foydalanish qoidalari</div>
        <div class="rules-subtitle">Platformadan to‘liq foydalanish uchun quyidagi rasmiy qoidalar bilan tanishib chiqing va ularni qabul qiling.</div>
      </div>

      <div class="rules-content-wrap">
        ${cardsHtml}
      </div>

      <div class="rules-footer">
        <div class="rules-footer-brand">YOSHUZBEKK Academy</div>
        <div class="rules-footer-motto">Bilim &rarr; Amaliyot &rarr; Natija</div>
      </div>

      <div class="terms-accept-bar">
        <button id="terms-accept-btn" class="terms-accept-btn" onclick="acceptPlatformTerms()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Qoidalarni qabul qilaman
        </button>
      </div>
    </div>
  `;
}

async function acceptPlatformTerms() {
  haptic("medium");
  const btn = document.getElementById("terms-accept-btn");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner" style="width:16px;height:16px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:8px;"></span> Qabul qilinmoqda...`;
  }
  try {
    const res = await api("/api/user/accept-terms");
    state.terms_accepted = true;
    state.terms_accepted_at = (res && res.terms_accepted_at) || new Date().toISOString();
    showToast("Foydalanish qoidalari qabul qilindi!");
    render();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  } catch (err) {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Qoidalarni qabul qilaman`;
    }
    showAlert(err.message || "Qoidalarni qabul qilishda xatolik yuz berdi. Qayta urinib ko'ring.");
  }
}

const PLATFORM_RULES_SECTIONS = [
  {
    title: "Umumiy qoidalar",
    items: [
      "Ushbu qoidalar YOSHUZBEKK Academy ta’lim platformasi, uning Telegram Mini App interfeysi, barcha darsliklar, materiallar va xizmatlaridan foydalanish tartibini belgilaydi.",
      "Platformadan ro‘yxatdan o‘tgan yoki undan foydalangan har bir shaxs ushbu qoidalar bilan to‘liq tanishgan va ularga so‘zsiz rozi bo‘lgan hisoblanadi.",
      "Agar foydalanuvchi ushbu qoidalarning biron bir bandiga rozi bo‘lmasa, platformadan foydalanishni darhol to‘xtatishi shart."
    ]
  },
  {
    title: "Foydalanuvchi majburiyatlari",
    items: [
      "Platformadan faqat qonuniy, shaxsiy va ta’lim maqsadlarida foydalanish.",
      "O‘z akkaunti xavfsizligini ta’minlash va unga uchinchi shaxslarning kirishiga yo‘l qo‘ymaslik.",
      "Platformaning ishlashiga xalaqit beruvchi har qanday noqonuniy, zararli yoki ruxsatsiz texnik harakatlarni amalga oshirmaslik.",
      "O‘quv jarayonida, guruhlarda va platforma ichidagi muloqotda etika va o‘zaro hurmat qoidalariga amal qilish."
    ]
  },
  {
    title: "Intellektual mulk huquqlari",
    items: [
      "Platformadagi barcha video darslar, audio materiallar, matnlar, taqdimotlar, Revit oilalari (families), shablonlar, testlar, qo‘llanmalar va boshqa barcha kontentlar YOSHUZBEKK Academy’ning intellektual mulki hisoblanadi.",
      "Foydalanuvchiga taqdim etilgan barcha o‘quv materiallari faqat uning shaxsiy foydalanishi uchun berilgan omonat hisoblanadi.",
      "Materiallarni nusxalash, qayta yozib olish (screen recording), uchinchi shaxslarga yuborish, internetda e’lon qilish, tarqatish, sotish yoki tijoriy maqsadlarda foydalanish qat’iyan man etiladi.",
      "Mualliflik huquqlari buzilgan taqdirda, qonunchilikda belgilangan tartibda javobgarlik choralari ko‘riladi."
    ]
  },
  {
    title: "Yopiq va pullik materiallar tartibi",
    items: [
      "Platformadagi pullik kurslar, yopiq darslar va maxsus materiallarga kirish huquqi faqat to‘lov to‘liq amalga oshirilgandan va ma’muriyat tomonidan tasdiqlangandan so‘ng beriladi.",
      "Berilgan kirish huquqi faqat to‘lov qilgan bitta foydalanuvchiga tegishli bo‘lib, uni boshqa shaxsga o‘tkazish, ulashish yoki bir nechta qurilmadan bir vaqtda suiiste’mol qilish taqiqlanadi.",
      "Qoidalar buzilgan taqdirda, foydalanuvchining pullik materiallarga kirish huquqi to‘lov qaytarilmasdan bekor qilinishi mumkin."
    ]
  },
  {
    title: "Natijalar va kafolatlar bo‘yicha ogohlantirish",
    items: [
      "Platforma har bir o‘quvchiga sifatli, tizimli va amaliy bilim berishga intiladi.",
      "O‘quv natijasi foydalanuvchining shaxsiy mehnati, intizomi, amaliyot hajmi va mustaqil ishlashiga to‘g‘ridan-to‘g‘ri bog‘liqdir.",
      "Shu sababli, platforma foydalanuvchiga 100% natija, ishga joylashish yoki daromad kafolatini bermaydi."
    ]
  },
  {
    title: "Texnik talablar va javobgarlik chegarasi",
    items: [
      "Platforma va unga integratsiya qilingan xizmatlarning barqaror ishlashi uchun barcha texnik choralar ko‘riladi.",
      "Biroq foydalanuvchi tomonidagi internet sifati, qurilma nosozliklari, Telegram yoki boshqa uchinchi tomon xizmatlaridagi uzilishlar tufayli yuzaga kelgan nosozliklar uchun platforma javobgar emas.",
      "Profilaktika yoki texnik yangilanishlar sababli platforma ishlashida qisqa muddatli uzilishlar bo‘lishi mumkin."
    ]
  },
  {
    title: "Akkaunt xavfsizligi va ma’lumotlar daxlsizligi",
    items: [
      "Foydalanuvchining shaxsiy ma’lumotlari (ism, telefon raqami, Telegram ma’lumotlari) faqat ta’lim jarayonini tashkil qilish, foydalanuvchini identifikatsiya qilish va u bilan bog‘lanish maqsadida ishlatiladi.",
      "Platforma foydalanuvchi ma’lumotlarining xavfsizligini ta’minlash choralarini ko‘radi va ularni uchinchi shaxslarga bermaydi (qonunda nazarda tutilgan hollar bundan mustasno).",
      "Foydalanuvchi o‘zining Telegram akkaunti va unga ulangan qurilmalari xavfsizligi uchun shaxsan o‘zi javobgar bo‘ladi."
    ]
  },
  {
    title: "To‘lovlar va xizmatlardan foydalanish",
    items: [
      "Kurslar va xizmatlar uchun to‘lovlar platformada ko‘rsatilgan to‘lov tizimlari yoki rasmiy tasdiqlangan usullar orqali amalga oshiriladi.",
      "Foydalanuvchi to‘lovni amalga oshirishdan oldin kurs dasturi, formati va shartlari bilan to‘liq tanishib chiqishi shart.",
      "Xizmat ko‘rsatish boshlanganidan, darslar ochilganidan yoki materiallar taqdim etilganidan so‘ng, qonunda boshqacha tartib nazarda tutilmagan bo‘lsa, to‘lovlar qaytarilmaydi."
    ]
  },
  {
    title: "Qoidalarni buzganlik uchun choralar",
    items: [
      "Agar foydalanuvchi ushbu qoidalarni buzsa, etika doirasidan chiqsa, kontentni tarqatsa yoki noqonuniy harakatlarni sodir etsa, ma’muriyat quyidagi choralarni qo‘llash huquqiga ega:",
      "– ogohlantirish berish;",
      "– platformadan foydalanishni vaqtincha cheklash;",
      "– akkauntni butunlay bloklash;",
      "– kurslar va materiallarga kirishni to‘xtatish;",
      "– qonunbuzarlik holatlari bo‘yicha vakolatli organlarga murojaat qilish."
    ]
  },
  {
    title: "Nizolarni hal qilish tartibi",
    items: [
      "Platformadan foydalanish jarayonida kelib chiqadigan barcha tushunmovchiliklar va nizolar birinchi navbatda muzokaralar va o‘zaro muloqot yo‘li bilan hal qilinadi.",
      "Foydalanuvchi o‘z e’tirozlarini rasmiy qo‘llab-quvvatlash xizmati orqali ma’muriyatga yuborishi mumkin.",
      "Kelishuvga erishilmagan taqdirda, barcha nizolar O‘zbekiston Respublikasining amaldagi qonunchiligiga muvofiq ko‘rib chiqiladi."
    ]
  },
  {
    title: "Qoidalarga o‘zgartirish kiritish",
    items: [
      "Platforma ma’muriyati ushbu qoidalarga istalgan vaqtda bir tomonlama tartibda o‘zgartirish va qo‘shimchalar kiritish huquqini o‘zida saqlab qoladi.",
      "Yangilangan qoidalar platformada e’lon qilingan paytdan boshlab kuchga kiradi.",
      "Foydalanuvchining yangilanishlardan so‘ng platformadan foydalanishni davom ettirishi uning yangi tahrirdagi qoidalarga rozi ekanligini bildiradi."
    ]
  },
  {
    title: "Yakuniy qoidalar",
    items: [
      "Ushbu qoidalar platforma ma’muriyati va foydalanuvchi o‘rtasidagi rasmiy kelishuv hujjati hisoblanadi.",
      "Savollar, takliflar yoki murojaatlar uchun foydalanuvchi Profil bo‘limidagi rasmiy qo‘llab-quvvatlash aloqa manzillari orqali ma’muriyatga murojaat qilishi mumkin."
    ]
  }
];

function openPlatformRulesModal() {
  haptic("light");
  lastDetailReturnScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

  const cardsHtml = PLATFORM_RULES_SECTIONS.map((sec, idx) => `
    <div class="rules-card">
      <div class="rules-card-header">
        <span class="rules-card-num">${idx + 1}</span>
        <span class="rules-card-title">${escapeHtml(sec.title)}</span>
      </div>
      <ul class="rules-list">
        ${sec.items.map(item => `
          <li class="rules-item">
            <span class="rules-item-bullet"></span>
            <span>${escapeHtml(item)}</span>
          </li>
        `).join("")}
      </ul>
    </div>
  `).join("");

  currentView = {
    html: `
      <div class="page rules-page">
        <div class="back-btn" onclick="closeDetail()">← Profilga qaytish</div>

        <div class="rules-header-card">
          <div class="rules-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Rasmiy hujjat
          </div>
          <div class="rules-main-title">Foydalanish qoidalari</div>
          <div class="rules-subtitle">YOSHUZBEKK Academy platformasidan foydalanish shartlari va tartibi</div>
        </div>

        <div class="rules-content-wrap">
          ${cardsHtml}
        </div>

        <div class="rules-footer">
          <div class="rules-footer-brand">YOSHUZBEKK Academy</div>
          <div class="rules-footer-motto">Bilim &rarr; Amaliyot &rarr; Natija</div>
        </div>
      </div>
    `
  };
  render();
  window.scrollTo(0, 0);
}

// ----------------------------------------------------
// TALAB 6: QURILISH MATERIALLARI MARKETPLACE LOGIKASI
// ----------------------------------------------------

const MATERIAL_CATEGORIES = [
  "Barchasi",
  "Devor",
  "Pol",
  "Mebel",
  "Bezak",
  "Shift",
  "Santexnika",
  "Elektr"
];

const MATERIAL_SUBCATS = {
  Devor: ["Barchasi", "G'isht", "Gazoblok", "Penoblok", "Gipsokarton"],
  Mebel: ["Barchasi", "LDSP", "MDF", "LMDF", "DSP", "Fanera"],
  Pol: ["Barchasi", "Laminat", "Keramogranit", "Parket", "Kafel"],
  Bezak: ["Barchasi", "Ottocento", "Kraska", "Oboy", "Dekorativ shtukaturka"],
  Shift: ["Barchasi", "Gipsokarton", "Natyajnoy", "Armstrong"],
  Santexnika: ["Barchasi", "Trubalar", "Fitinglar", "Dush"],
  Elektr: ["Barchasi", "Kabellar", "Avtomatlar", "Rozetkalar"]
};

function renderMarketplaceBanner() {
  return `
    <div class="marketplace-banner-btn" onclick="openMaterialsMarketplace()">
      <div class="marketplace-banner-left">
        <div class="marketplace-banner-icon">🧱</div>
        <div>
          <div class="marketplace-banner-title">Qurilish & Remont Materiallari Bozori</div>
          <div class="marketplace-banner-sub">LDSP, Gazoblok, G'isht, Ottocento va barcha materiallar ensiklopediyasi →</div>
        </div>
      </div>
      <div style="font-size:24px; color:#fff;">›</div>
    </div>
  `;
}

function openMaterialsMarketplace() {
  haptic("light");
  marketplaceCategory = "Barchasi";
  marketplaceSubCategory = "Barchasi";
  marketplaceSearchQuery = "";
  renderMarketplaceView();
}

function setMarketplaceCategory(cat) {
  haptic("light");
  marketplaceCategory = cat;
  marketplaceSubCategory = "Barchasi";
  renderMarketplaceView();
}

function setMarketplaceSubCategory(subCat) {
  haptic("light");
  marketplaceSubCategory = subCat;
  renderMarketplaceView();
}

function renderMarketplaceGridHtml(filtered) {
  if (!filtered.length) {
    return `
      <div class="empty-box" style="margin-top:20px;">
        Qidiruv bo'yicha mos materiallar topilmadi.
      </div>
    `;
  }
  return `
    <div class="marketplace-grid">
      ${filtered.map(mat => `
        <div class="material-card" onclick="openMaterialDetailSheet(${Number(mat.id)})">
          <img src="${escapeHtml(mat.image_url || 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80')}" alt="${escapeHtml(mat.title)}" class="material-card-img" onerror="this.src='https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80';">
          <div class="material-card-content">
            <div class="material-card-category">${escapeHtml(mat.category)} · ${escapeHtml(mat.sub_category)}</div>
            <div class="material-card-title">${escapeHtml(mat.title)}</div>
            ${mat.dimensions ? `<div class="material-card-dim">📐 ${escapeHtml(mat.dimensions.split('.')[0])}</div>` : ""}
            <div class="material-card-footer">
              <span>Batafsil ko'rish</span>
              <span>→</span>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function setMarketplaceSearch(query) {
  marketplaceSearchQuery = query;
  const gridContainer = document.getElementById("marketplace-grid-container");
  if (gridContainer) {
    const materialsList = state.materials && state.materials.length ? state.materials : DEFAULT_MATERIALS;
    const q = (marketplaceSearchQuery || "").trim().toLowerCase();
    const filtered = materialsList.filter(m => {
      const matchCat = marketplaceCategory === "Barchasi" || m.category === marketplaceCategory;
      const matchSubCat = marketplaceSubCategory === "Barchasi" || m.sub_category === marketplaceSubCategory;
      const matchQuery = !q ||
        (m.title || "").toLowerCase().includes(q) ||
        (m.short_desc || "").toLowerCase().includes(q) ||
        (m.sub_category || "").toLowerCase().includes(q) ||
        (m.what_is_it || "").toLowerCase().includes(q);
      return matchCat && matchSubCat && matchQuery;
    });
    gridContainer.innerHTML = renderMarketplaceGridHtml(filtered);
  } else {
    renderMarketplaceView();
  }
}

function renderMarketplaceView() {
  const materialsList = state.materials && state.materials.length ? state.materials : DEFAULT_MATERIALS;
  const q = (marketplaceSearchQuery || "").trim().toLowerCase();

  const filtered = materialsList.filter(m => {
    const matchCat = marketplaceCategory === "Barchasi" || m.category === marketplaceCategory;
    const matchSubCat = marketplaceSubCategory === "Barchasi" || m.sub_category === marketplaceSubCategory;
    const matchQuery = !q ||
      (m.title || "").toLowerCase().includes(q) ||
      (m.short_desc || "").toLowerCase().includes(q) ||
      (m.sub_category || "").toLowerCase().includes(q) ||
      (m.what_is_it || "").toLowerCase().includes(q);

    return matchCat && matchSubCat && matchQuery;
  });

  const availableSubCats = MATERIAL_SUBCATS[marketplaceCategory] || [];

  currentView = {
    html: `
      <div class="page marketplace-page">
        <div class="back-btn" onclick="closeDetail()">← Kutubxonaga qaytish</div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <div class="page-title" style="margin-bottom:0;">🏪 Materiallar Bozori</div>
          ${state.is_admin ? `
            <button class="admin-small-btn" onclick="openAddMaterialModal()" style="font-size:11px; padding:6px 10px;">
              ➕ Material Qo'shish
            </button>
          ` : ""}
        </div>
        <p style="font-size:12.5px; color:var(--text-secondary); margin-bottom:14px;">
          Qurilish va ta'mirlashda ishlatiladigan barcha materiallar xususiyatlari, o'lchamlari, plyus/minuslari va O'zbekiston bozorlari:
        </p>

        <!-- Qidiruv paneli -->
        <input
          id="marketplace-search-input"
          class="apple-input"
          style="margin-bottom:12px;"
          type="text"
          placeholder="🔍 Nomi, turi yoki xususiyati bo'yicha qidirish..."
          value="${escapeHtml(marketplaceSearchQuery)}"
          oninput="setMarketplaceSearch(this.value)"
        >

        <!-- Asosiy Kategoriyalar (Gorizontal scroll) -->
        <div class="category-chips" style="display:flex; gap:8px; overflow-x:auto; margin-bottom:10px; padding-bottom:4px;">
          ${MATERIAL_CATEGORIES.map(cat => `
            <div class="chip ${marketplaceCategory === cat ? "active" : ""}" onclick="setMarketplaceCategory('${cat}')">
              ${cat}
            </div>
          `).join("")}
        </div>

        <!-- Ichki Sub-kategoriyalar (Sub-filtrlar) -->
        ${availableSubCats.length > 1 ? `
          <div style="display:flex; gap:6px; overflow-x:auto; margin-bottom:14px; padding-bottom:4px;">
            ${availableSubCats.map(sc => `
              <div class="spec-level-chip ${marketplaceSubCategory === sc ? "active" : ""}" onclick="setMarketplaceSubCategory('${sc}')" style="font-size:11px; padding:4px 10px;">
                ${sc}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Mahsulotlar Gridi -->
        <div id="marketplace-grid-container">
          ${renderMarketplaceGridHtml(filtered)}
        </div>
      </div>
    `
  };
  render();
}

function openMaterialDetailSheet(matId) {
  haptic("light");
  const materialsList = state.materials && state.materials.length ? state.materials : DEFAULT_MATERIALS;
  const mat = materialsList.find(m => Number(m.id) === Number(matId));
  if (!mat) return showAlert("Material topilmadi.");

  currentView = {
    html: `
      <div class="page" style="padding-bottom:50px;">
        <div class="back-btn" onclick="renderMarketplaceView()">← Materiallar ro'yxatiga qaytish</div>

        <img src="${escapeHtml(mat.image_url || 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80')}" alt="${escapeHtml(mat.title)}" class="material-detail-hero" onerror="this.src='https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80';">

        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <div>
            <div style="font-size:11.5px; font-weight:700; color:var(--accent); text-transform:uppercase; margin-bottom:4px;">
              ${escapeHtml(mat.category)} · ${escapeHtml(mat.sub_category)}
            </div>
            <div style="font-size:20px; font-weight:800; color:var(--text-primary); line-height:1.3;">
              ${escapeHtml(mat.title)}
            </div>
          </div>
          ${state.is_admin ? `
            <div style="display:flex; gap:6px;">
              <button class="admin-small-btn" onclick="openEditMaterialModal(${Number(mat.id)})" title="Tahrirlash">✏️</button>
              <button class="admin-small-btn" style="background:rgba(235,59,59,0.2); color:#eb3b3b;" onclick="deleteMaterialItem(${Number(mat.id)})" title="O'chirish">🗑️</button>
            </div>
          ` : ""}
        </div>

        <p style="font-size:13.5px; color:var(--text-secondary); line-height:1.45; margin-bottom:16px;">
          ${escapeHtml(mat.short_desc || "")}
        </p>

        <!-- 1. Nima o'zi u? -->
        <div class="material-info-block">
          <div class="material-info-header">📋 Material nima o'zi u?</div>
          <div class="material-info-body">${escapeHtml(mat.what_is_it || "").replace(/\n/g, "<br>")}</div>
        </div>

        <!-- 2. Qachon chiqqan -->
        ${mat.history ? `
          <div class="material-info-block">
            <div class="material-info-header">⏳ Qachon chiqqan va paydo bo'lish tarixi</div>
            <div class="material-info-body">${escapeHtml(mat.history).replace(/\n/g, "<br>")}</div>
          </div>
        ` : ""}

        <!-- 3. Standart o'lchamlari -->
        ${mat.dimensions ? `
          <div class="material-info-block">
            <div class="material-info-header">📐 Standart o'lchamlari va qalinliklari</div>
            <div class="material-info-body">${escapeHtml(mat.dimensions).replace(/\n/g, "<br>")}</div>
          </div>
        ` : ""}

        <!-- 4. Qayerlarga ishlatiladi -->
        ${mat.usage_area ? `
          <div class="material-info-block">
            <div class="material-info-header">🎯 Qayerlarga ishlatiladi (Tavsiya)</div>
            <div class="material-info-body">${escapeHtml(mat.usage_area).replace(/\n/g, "<br>")}</div>
          </div>
        ` : ""}

        <!-- 5. Plyus va minuslari -->
        <div style="margin-top:16px;">
          <div style="font-size:13.5px; font-weight:750; margin-bottom:8px; color:var(--text-primary);">Afzalliklari va Kamchiliklari:</div>
          ${mat.pros ? `<div class="pros-box">${escapeHtml(mat.pros).replace(/\n/g, "<br>")}</div>` : ""}
          ${mat.cons ? `<div class="cons-box">${escapeHtml(mat.cons).replace(/\n/g, "<br>")}</div>` : ""}
        </div>

        <!-- 6. O'zbekistondagi bozorlar va saytlar -->
        ${mat.uzbekistan_sources ? `
          <div class="uzb-market-card">
            <div style="font-weight:750; font-size:13px; color:var(--accent); margin-bottom:6px; display:flex; align-items:center; gap:6px;">
              <span>🇺🇿</span> O'zbekistondagi kerakli saytlar, do'konlar va bozorlar:
            </div>
            <div style="color:var(--text-primary);">${escapeHtml(mat.uzbekistan_sources).replace(/\n/g, "<br>")}</div>
          </div>
        ` : ""}

        <!-- 7. Revit va 3ds Max maslahati -->
        ${mat.bim_tips ? `
          <div class="material-info-block" style="margin-top:14px; border-color:rgba(41,121,255,0.3); background:rgba(41,121,255,0.06);">
            <div class="material-info-header" style="color:var(--accent);">💻 BIM & 3ds Max Tavsiyasi:</div>
            <div class="material-info-body">${escapeHtml(mat.bim_tips).replace(/\n/g, "<br>")}</div>
          </div>
        ` : ""}
      </div>
    `
  };
  render();
}

// Admin Material Qo'shish / Tahrirlash
function openAddMaterialModal() {
  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="adminView === 'library' ? renderAdminPanel() : renderMarketplaceView()">← Ortga qaytish</div>
        <div class="page-title">Yangi Material Qo'shish</div>

        <div class="admin-form">
          <div class="apple-field">
            <label>Material nomi *</label>
            <input id="new-mat-title" class="apple-input" type="text" placeholder="Masalan: Gazoblok D500">
          </div>

          <div class="apple-field">
            <label>Kategoriya</label>
            <select id="new-mat-cat" class="apple-input">
              <option value="Devor">Devor</option>
              <option value="Pol">Pol</option>
              <option value="Mebel">Mebel</option>
              <option value="Bezak">Bezak</option>
              <option value="Shift">Shift</option>
              <option value="Santexnika">Santexnika</option>
              <option value="Elektr">Elektr</option>
            </select>
          </div>

          <div class="apple-field">
            <label>Sub-kategoriya (Turi)</label>
            <input id="new-mat-subcat" class="apple-input" type="text" placeholder="Masalan: Gazoblok, LDSP, Kraska...">
          </div>

          <div class="apple-field">
            <label>Rasm URL linki</label>
            <input id="new-mat-img" class="apple-input" type="url" placeholder="https://... rasm linki">
          </div>

          <div class="apple-field">
            <label>Qisqacha tavsif</label>
            <input id="new-mat-sdesc" class="apple-input" type="text" placeholder="Bir-ikki jumla qisqa ma'lumot">
          </div>

          <div class="apple-field">
            <label>Material nima o'zi u? *</label>
            <textarea id="new-mat-what" class="apple-input apple-textarea" placeholder="To'liq ta'rif, tayyorlanish jarayoni..."></textarea>
          </div>

          <div class="apple-field">
            <label>Standart o'lchamlari va qalinliklari</label>
            <input id="new-mat-dim" class="apple-input" type="text" placeholder="Masalan: 600x300x200mm, 100mm...">
          </div>

          <div class="apple-field">
            <label>Qachon chiqqan va tarixi</label>
            <input id="new-mat-hist" class="apple-input" type="text" placeholder="Ixtiro qilingan yili, tarixi...">
          </div>

          <div class="apple-field">
            <label>Qayerlarga ishlatiladi?</label>
            <textarea id="new-mat-usage" class="apple-input apple-textarea" placeholder="Tavsiya etilgan sohalar..."></textarea>
          </div>

          <div class="apple-field">
            <label>Plyus taraflari (Afzalliklari)</label>
            <textarea id="new-mat-pros" class="apple-input apple-textarea" placeholder="✅ Narxi, mustahkamligi..."></textarea>
          </div>

          <div class="apple-field">
            <label>Minus taraflari (Kamchiliklari)</label>
            <textarea id="new-mat-cons" class="apple-input apple-textarea" placeholder="❌ Namlikka ta'sirchanlik..."></textarea>
          </div>

          <div class="apple-field">
            <label>O'zbekistondagi kerakli saytlar, do'konlar va bozorlar</label>
            <textarea id="new-mat-src" class="apple-input apple-textarea" placeholder="Bozorlar, rasmiy dilerlar, do'konlar va saytlar..."></textarea>
          </div>

          <div class="apple-field">
            <label>BIM & 3ds Max tavsiyasi</label>
            <textarea id="new-mat-bim" class="apple-input apple-textarea" placeholder="Revitda qaysi qatlam, 3ds Maxda qanday teksturalanadi..."></textarea>
          </div>

          <button id="save-mat-btn" class="btn" onclick="submitAddMaterial()">
            💾 Saqlash va E'lon qilish
          </button>
        </div>
      </div>
    `
  };
  render();
}

async function submitAddMaterial() {
  const title = document.getElementById("new-mat-title")?.value.trim();
  const cat = document.getElementById("new-mat-cat")?.value;
  const subcat = document.getElementById("new-mat-subcat")?.value.trim() || "Boshqa";
  let img = document.getElementById("new-mat-img")?.value.trim();
  const sdesc = document.getElementById("new-mat-sdesc")?.value.trim();
  const what = document.getElementById("new-mat-what")?.value.trim();
  const dim = document.getElementById("new-mat-dim")?.value.trim();
  const hist = document.getElementById("new-mat-hist")?.value.trim();
  const usage = document.getElementById("new-mat-usage")?.value.trim();
  const pros = document.getElementById("new-mat-pros")?.value.trim();
  const cons = document.getElementById("new-mat-cons")?.value.trim();
  const src = document.getElementById("new-mat-src")?.value.trim();
  const bim = document.getElementById("new-mat-bim")?.value.trim();

  if (!title) return showAlert("Material nomini kiritish shart!");
  if (img && !img.startsWith("http://") && !img.startsWith("https://")) {
    img = "https://" + img;
  }

  const btn = document.getElementById("save-mat-btn");
  if (btn) btn.classList.add("btn-loading");

  try {
    haptic("medium");
    await adminApi("/api/admin/materials/add", {
      title,
      category: cat,
      sub_category: subcat,
      image_url: img,
      short_desc: sdesc,
      what_is_it: what,
      dimensions: dim,
      history: hist,
      usage_area: usage,
      pros,
      cons,
      uzbekistan_sources: src,
      bim_tips: bim
    });
    showToast("Material qo'shildi!");
    await loadContent();
    if (adminView === "library") renderAdminPanel();
    else renderMarketplaceView();
  } catch (err) {
    showAlert(err.message || "Material qo'shishda xato.");
  } finally {
    if (btn) btn.classList.remove("btn-loading");
  }
}

function openEditMaterialModal(id) {
  const materialsList = state.materials && state.materials.length ? state.materials : DEFAULT_MATERIALS;
  const mat = materialsList.find(m => Number(m.id) === Number(id));
  if (!mat) return showAlert("Material topilmadi.");

  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="adminView === 'library' ? renderAdminPanel() : openMaterialDetailSheet(${Number(id)})">← Ortga qaytish</div>
        <div class="page-title">Materialni tahrirlash</div>

        <div class="admin-form">
          <div class="apple-field">
            <label>Nomi *</label>
            <input id="edit-mat-title" class="apple-input" type="text" value="${escapeHtml(mat.title)}">
          </div>

          <div class="apple-field">
            <label>Kategoriya</label>
            <select id="edit-mat-cat" class="apple-input">
              ${MATERIAL_CATEGORIES.filter(c => c !== "Barchasi").map(c => `
                <option value="${c}" ${c === mat.category ? "selected" : ""}>${c}</option>
              `).join("")}
            </select>
          </div>

          <div class="apple-field">
            <label>Sub-kategoriya</label>
            <input id="edit-mat-subcat" class="apple-input" type="text" value="${escapeHtml(mat.sub_category || "")}">
          </div>

          <div class="apple-field">
            <label>Rasm URL</label>
            <input id="edit-mat-img" class="apple-input" type="url" value="${escapeHtml(mat.image_url || "")}">
          </div>

          <div class="apple-field">
            <label>Qisqacha tavsif</label>
            <input id="edit-mat-sdesc" class="apple-input" type="text" value="${escapeHtml(mat.short_desc || "")}">
          </div>

          <div class="apple-field">
            <label>Nima o'zi u?</label>
            <textarea id="edit-mat-what" class="apple-input apple-textarea">${escapeHtml(mat.what_is_it || "")}</textarea>
          </div>

          <div class="apple-field">
            <label>O'lchamlari</label>
            <input id="edit-mat-dim" class="apple-input" type="text" value="${escapeHtml(mat.dimensions || "")}">
          </div>

          <div class="apple-field">
            <label>Tarixi</label>
            <input id="edit-mat-hist" class="apple-input" type="text" value="${escapeHtml(mat.history || "")}">
          </div>

          <div class="apple-field">
            <label>Qayerlarga ishlatiladi</label>
            <textarea id="edit-mat-usage" class="apple-input apple-textarea">${escapeHtml(mat.usage_area || "")}</textarea>
          </div>

          <div class="apple-field">
            <label>Plyus taraflari</label>
            <textarea id="edit-mat-pros" class="apple-input apple-textarea">${escapeHtml(mat.pros || "")}</textarea>
          </div>

          <div class="apple-field">
            <label>Minus taraflari</label>
            <textarea id="edit-mat-cons" class="apple-input apple-textarea">${escapeHtml(mat.cons || "")}</textarea>
          </div>

          <div class="apple-field">
            <label>O'zbekistondagi manbalar</label>
            <textarea id="edit-mat-src" class="apple-input apple-textarea">${escapeHtml(mat.uzbekistan_sources || "")}</textarea>
          </div>

          <div class="apple-field">
            <label>BIM tavsiyasi</label>
            <textarea id="edit-mat-bim" class="apple-input apple-textarea">${escapeHtml(mat.bim_tips || "")}</textarea>
          </div>

          <button id="update-mat-btn" class="btn" onclick="submitUpdateMaterial(${Number(id)})">
            💾 O'zgarishlarni saqlash
          </button>
        </div>
      </div>
    `
  };
  render();
}

async function submitUpdateMaterial(id) {
  const title = document.getElementById("edit-mat-title")?.value.trim();
  const cat = document.getElementById("edit-mat-cat")?.value;
  const subcat = document.getElementById("edit-mat-subcat")?.value.trim() || "Boshqa";
  let img = document.getElementById("edit-mat-img")?.value.trim();
  const sdesc = document.getElementById("edit-mat-sdesc")?.value.trim();
  const what = document.getElementById("edit-mat-what")?.value.trim();
  const dim = document.getElementById("edit-mat-dim")?.value.trim();
  const hist = document.getElementById("edit-mat-hist")?.value.trim();
  const usage = document.getElementById("edit-mat-usage")?.value.trim();
  const pros = document.getElementById("edit-mat-pros")?.value.trim();
  const cons = document.getElementById("edit-mat-cons")?.value.trim();
  const src = document.getElementById("edit-mat-src")?.value.trim();
  const bim = document.getElementById("edit-mat-bim")?.value.trim();

  if (!title) return showAlert("Material nomi majburiy!");
  if (img && !img.startsWith("http://") && !img.startsWith("https://")) {
    img = "https://" + img;
  }

  const btn = document.getElementById("update-mat-btn");
  if (btn) btn.classList.add("btn-loading");

  try {
    haptic("medium");
    await adminApi(`/api/admin/materials/${Number(id)}/update`, {
      title,
      category: cat,
      sub_category: subcat,
      image_url: img,
      short_desc: sdesc,
      what_is_it: what,
      dimensions: dim,
      history: hist,
      usage_area: usage,
      pros,
      cons,
      uzbekistan_sources: src,
      bim_tips: bim
    });
    showToast("Material yangilandi!");
    await loadContent();
    if (adminView === "library") renderAdminPanel();
    else openMaterialDetailSheet(id);
  } catch (err) {
    showAlert(err.message || "Yangilashda xato.");
  } finally {
    if (btn) btn.classList.remove("btn-loading");
  }
}

function deleteMaterialItem(id) {
  showConfirm(
    "Material o'chirilsinmi?",
    "Ushbu material ma'lumotlar bazasidan butunlay o'chiriladi.",
    "Ha, o'chirish",
    async () => {
      await adminApi(`/api/admin/materials/${Number(id)}/delete`);
      showToast("O'chirildi!");
      await loadContent();
      if (adminView === "library") {
        renderAdminPanel();
      } else {
        renderMarketplaceView();
      }
    }
  );
}

// ----------------------------------------------------
// TALAB 2: KUTUBXONA ERKIN MANBALARI VA TESTLARI LOGIKASI
// ----------------------------------------------------

function setOpenResTab(tab) {
  haptic("light");
  activeOpenResTab = tab;
  render();
}

function renderOpenLibraryResources() {
  const resources = state.open_resources && state.open_resources.length ? state.open_resources : DEFAULT_OPEN_RESOURCES;
  const filtered = resources.filter(r => activeOpenResTab === "all" || r.type === activeOpenResTab);

  return `
    <div style="margin-top:24px; padding-top:16px; border-top:1px solid var(--border);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <div style="font-size:16px; font-weight:800; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
          <span>📖</span> Erkin testlar va ochiq manbalar (Bepul)
        </div>
        ${state.is_admin ? `
          <button class="admin-small-btn" onclick="openAddOpenResourceModal()" style="font-size:11px; padding:5px 9px;">
            ➕ Manba qo'shish
          </button>
        ` : ""}
      </div>
      <p style="font-size:12.5px; color:var(--text-secondary); margin-bottom:12px;">
        Ushbu bo'lim barcha o'quvchilar uchun ochiq. Bu yerdan bepul kitoblar, BIM standartlar, ochiq video darsliklar va erkin testlardan foydalanishingiz mumkin:
      </p>

      <!-- Filtr chiplari -->
      <div style="display:flex; gap:6px; overflow-x:auto; margin-bottom:14px; padding-bottom:4px;">
        <div class="spec-level-chip ${activeOpenResTab === "all" ? "active" : ""}" onclick="setOpenResTab('all')">🌐 Barchasi</div>
        <div class="spec-level-chip ${activeOpenResTab === "test" ? "active" : ""}" onclick="setOpenResTab('test')">🎯 Erkin Testlar</div>
        <div class="spec-level-chip ${activeOpenResTab === "book" ? "active" : ""}" onclick="setOpenResTab('book')">📚 Kitoblar (PDF)</div>
        <div class="spec-level-chip ${activeOpenResTab === "video" ? "active" : ""}" onclick="setOpenResTab('video')">🎬 Video Darslar</div>
        <div class="spec-level-chip ${activeOpenResTab === "source" ? "active" : ""}" onclick="setOpenResTab('source')">📦 Oilalar & Shablonlar</div>
      </div>

      <div class="open-res-grid">
        ${filtered.length ? filtered.map(r => `
          <div class="open-res-card" onclick="handleOpenResourceClick(${Number(r.id)})">
            <div class="open-res-left">
              <div class="open-res-icon">${r.icon || "📄"}</div>
              <div>
                <div style="font-size:10.5px; font-weight:700; color:var(--accent); text-transform:uppercase;">
                  ${r.type === "test" ? "🎯 Bepul Test Sinovi" : (r.category || "Ochiq manba")}
                </div>
                <div class="open-res-title">${escapeHtml(r.title)}</div>
                <div class="open-res-desc">${escapeHtml(r.description || "")}</div>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <div style="font-size:12px; font-weight:750; color:var(--accent); white-space:nowrap;">
                ${r.type === "test" ? "Test yechish ▶" : "Ochish ↗"}
              </div>
              ${state.is_admin ? `
                <span onclick="event.stopPropagation(); deleteOpenResourceItem(${Number(r.id)})" title="O'chirish" style="font-size:13px; color:#eb3b3b; cursor:pointer;">🗑️</span>
              ` : ""}
            </div>
          </div>
        `).join("") : `<div class="empty-box">Ushbu bo'limda hozircha manbalar yo'q.</div>`}
      </div>
    </div>
  `;
}

function handleOpenResourceClick(resId) {
  const resources = state.open_resources && state.open_resources.length ? state.open_resources : DEFAULT_OPEN_RESOURCES;
  const res = resources.find(r => Number(r.id) === Number(resId));
  if (!res) return;

  haptic("light");

  if (res.type === "test") {
    let testData = res.test_data;
    if (typeof testData === "string") {
      try { testData = JSON.parse(testData); } catch (e) { testData = []; }
    }
    if (!Array.isArray(testData) || !testData.length) {
      return showAlert("Ushbu test uchun savollar kiritilmagan.");
    }
    startFreeTest(res.title, testData);
  } else if (res.link_url) {
    if (res.link_url.includes("drive.google.com") || res.link_url.endsWith(".pdf")) {
      openPdfViewerModal(res.link_url, res.title);
    } else {
      window.open(res.link_url, "_blank", "noopener,noreferrer");
    }
  } else {
    showAlert(res.description || res.title);
  }
}

// Bepul / Erkin Test Oynasi
function startFreeTest(testTitle, questions) {
  haptic("medium");
  freeQuizState = {
    title: testTitle,
    questions: questions,
    currentIndex: 0,
    answers: {},
    isFinished: false,
    score: 0
  };
  renderFreeQuiz();
}

function renderFreeQuiz() {
  const qs = freeQuizState;
  if (!qs) return;

  if (qs.isFinished) {
    const total = qs.questions.length;
    const pct = Math.round((qs.score / total) * 100);
    const passed = pct >= 70;

    currentView = {
      html: `
        <div class="page" style="text-align:center; padding:30px 18px;">
          <div style="font-size:54px; margin-bottom:12px;">${passed ? "🎉" : "💪"}</div>
          <div class="page-title" style="margin-bottom:6px;">${escapeHtml(qs.title)}</div>
          <div style="font-size:14px; color:var(--text-secondary); margin-bottom:20px;">
            Test yakunlandi! Natijangiz bilan tanishing:
          </div>

          <div class="card" style="margin-bottom:20px; padding:20px;">
            <div style="font-size:38px; font-weight:800; color:${passed ? "var(--accent)" : "var(--danger)"}; margin-bottom:6px;">
              ${qs.score} / ${total}
            </div>
            <div style="font-size:15px; font-weight:700; color:var(--text-primary); margin-bottom:4px;">
              O'zlashtirish: ${pct}%
            </div>
            <div style="font-size:13px; color:var(--text-secondary);">
              ${passed ? "Ajoyib natija! Siz ushbu mavzuni juda yaxshi tushungansiz." : "Harakat qiling! Kurs darsliklari va manbalarini qayta ko'rib chiqishni tavsiya qilamiz."}
            </div>
          </div>

          <button class="btn" style="margin-bottom:10px;" onclick="closeDetail()">
            Kutubxonaga qaytish ←
          </button>
          <button class="btn secondary" onclick="startFreeTest('${escapeJsString(qs.title)}', freeQuizState.questions)">
            🔄 Testni qayta topshirish
          </button>
        </div>
      `
    };
    render();
    return;
  }

  const total = qs.questions.length;
  const idx = qs.currentIndex;
  const q = qs.questions[idx];
  const isLast = idx === total - 1;
  const selectedAnswer = qs.answers[idx];

  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="closeDetail()">← Testdan chiqish</div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div style="font-size:12px; font-weight:700; color:var(--accent); text-transform:uppercase;">
            ${escapeHtml(qs.title)}
          </div>
          <div style="font-size:13px; font-weight:750; color:var(--text-secondary);">
            ${idx + 1} / ${total}
          </div>
        </div>

        <div class="progress-wrap" style="margin-bottom:16px;">
          <div class="progress-track">
            <div class="progress-fill" style="width:${Math.round(((idx + 1) / total) * 100)}%;"></div>
          </div>
        </div>

        <div class="card" style="margin-bottom:16px;">
          <div style="font-size:15.5px; font-weight:750; color:var(--text-primary); line-height:1.4; margin-bottom:16px;">
            ${idx + 1}. ${escapeHtml(q.q || q.question || "")}
          </div>

          <div style="display:flex; flex-direction:column; gap:8px;">
            ${(q.options || []).map((opt, optIdx) => {
              const isSelected = selectedAnswer === optIdx;
              return `
                <div class="apple-option ${isSelected ? "selected" : ""}" onclick="selectFreeQuizAnswer(${optIdx})">
                  <div class="apple-option-indicator"></div>
                  <div class="apple-option-text">${escapeHtml(opt)}</div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <div style="display:flex; gap:10px;">
          ${idx > 0 ? `
            <button class="btn secondary" style="flex:1; margin:0;" onclick="prevFreeQuizQuestion()">
              ← Oldingisi
            </button>
          ` : ""}
          <button class="btn" style="flex:2; margin:0;" onclick="${isLast ? "finishFreeQuiz()" : "nextFreeQuizQuestion()"}" ${selectedAnswer === undefined ? "disabled" : ""}>
            ${isLast ? "Testni yakunlash ✅" : "Keyingisi →"}
          </button>
        </div>
      </div>
    `
  };
  render();
}

function selectFreeQuizAnswer(optIdx) {
  haptic("light");
  if (!freeQuizState) return;
  freeQuizState.answers[freeQuizState.currentIndex] = optIdx;
  renderFreeQuiz();
}

function nextFreeQuizQuestion() {
  if (!freeQuizState) return;
  if (freeQuizState.currentIndex < freeQuizState.questions.length - 1) {
    freeQuizState.currentIndex++;
    renderFreeQuiz();
  }
}

function prevFreeQuizQuestion() {
  if (!freeQuizState) return;
  if (freeQuizState.currentIndex > 0) {
    freeQuizState.currentIndex--;
    renderFreeQuiz();
  }
}

function finishFreeQuiz() {
  if (!freeQuizState) return;
  haptic("medium");
  let score = 0;
  freeQuizState.questions.forEach((q, i) => {
    if (freeQuizState.answers[i] === q.correct) {
      score++;
    }
  });
  freeQuizState.score = score;
  freeQuizState.isFinished = true;
  renderFreeQuiz();
}

function openAddOpenResourceModal() {
  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="adminView ? renderAdminPanel() : closeDetail()">← Ortga qaytish</div>
        <div class="page-title">Yangi Ochiq Manba Qo'shish</div>

        <div class="admin-form">
          <div class="apple-field">
            <label>Manba turi</label>
            <select id="or-type" class="apple-input">
              <option value="book">📚 Kitob (PDF)</option>
              <option value="video">🎬 Ochiq Video Dars</option>
              <option value="source">📦 Manba / Oila / Shablon</option>
              <option value="test">🎯 Sinov Testi</option>
            </select>
          </div>

          <div class="apple-field">
            <label>Sarlavha *</label>
            <input id="or-title" class="apple-input" type="text" placeholder="Masalan: Revit 2024 qo'llanmasi (PDF)">
          </div>

          <div class="apple-field">
            <label>Kategoriya / Tege</label>
            <input id="or-cat" class="apple-input" type="text" placeholder="Masalan: Adabiyotlar, Standartlar...">
          </div>

          <div class="apple-field">
            <label>Havola linki (Google Drive, YouTube, Telegram...)</label>
            <input id="or-link" class="apple-input" type="url" placeholder="https://...">
          </div>

          <div class="apple-field">
            <label>Qisqacha tavsif</label>
            <textarea id="or-desc" class="apple-input apple-textarea" placeholder="Manba haqida ma'lumot..."></textarea>
          </div>

          <button id="save-or-btn" class="btn" onclick="submitAddOpenResource()">
            💾 Saqlash
          </button>
        </div>
      </div>
    `
  };
  render();
}

async function submitAddOpenResource() {
  const type = document.getElementById("or-type")?.value;
  const title = document.getElementById("or-title")?.value.trim();
  const cat = document.getElementById("or-cat")?.value.trim();
  let link = document.getElementById("or-link")?.value.trim();
  const desc = document.getElementById("or-desc")?.value.trim();

  if (!title) return showAlert("Sarlavha kiritilishi shart!");
  if (link && !link.startsWith("http://") && !link.startsWith("https://")) {
    link = "https://" + link;
  }

  const icons = { book: "📚", video: "🎬", source: "📦", test: "🎯" };

  const btn = document.getElementById("save-or-btn");
  if (btn) btn.classList.add("btn-loading");

  try {
    haptic("medium");
    await adminApi("/api/admin/library/resources/add", {
      type,
      title,
      category: cat || "Ochiq manba",
      description: desc,
      link_url: link,
      icon: icons[type] || "📄"
    });
    showToast("Manba saqlandi!");
    await loadContent();
    if (adminView === "library") renderAdminPanel();
    else closeDetail();
  } catch (err) {
    showAlert(err.message || "Saqlashda xato.");
  } finally {
    if (btn) btn.classList.remove("btn-loading");
  }
}

function deleteOpenResourceItem(id) {
  showConfirm(
    "Manba o'chirilsinmi?",
    "Ushbu resurs kutubxonadan o'chiriladi.",
    "Ha, o'chirish",
    async () => {
      await adminApi(`/api/admin/library/resources/${Number(id)}/delete`);
      showToast("O'chirildi!");
      await loadContent();
      if (adminView === "library") renderAdminPanel();
    }
  );
}


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

function fmtTimeAgo(d) {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return "Hozirgina";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} daqiqa oldin`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} soat oldin`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay} kun oldin`;
  return date.toLocaleDateString("uz-UZ");
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
Assalomu alaykum! Men Abdulloh — arxitektura, BIM, interyer va vizualizatsiya yo'nalishida faoliyat yurituvchi mutaxassisman.

Men real arxitektura, interyer va BIM loyihalarini yaratish, ishchi chizmalar tayyorlash hamda loyiha jarayonini tizimli tashkil qilish vositalarini amaliyotda 4 yildan beri qo'llab kelmoqdaman.

Shu tajribalarimni boshqalar bilan professional tarzda bo'lishish maqsadida YOSHUZBEKK Academy platformasini yaratdim.
`;

const ABOUT_SHORT = `
Assalomu alaykum! Men Abdulloh — arxitektura, BIM, interyer va vizualizatsiya yo'nalishida faoliyat yurituvchi mutaxassisman. Zamonaviy loyihalash va modellashtirishni amaliyotda o'rgataman.
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

function openFreeMiniCourseLessonsModal() {
  haptic("light");
  const modules = Array.isArray(state.modules) ? state.modules : [];
  const s = state.settings || {};
  let fmcLessons = [];
  if (s.free_minicourse_lesson_ids) {
    const ids = s.free_minicourse_lesson_ids.split(",").map(n => parseInt(n.trim(), 10)).filter(Boolean);
    const allL = modules.flatMap(m => (m.lessons || []).map(l => ({ ...l, module_title: m.title })));
    fmcLessons = ids.map(id => allL.find(l => l.id === id)).filter(Boolean);
  }
  if (!fmcLessons.length) {
    fmcLessons = modules.flatMap(m => (m.lessons || []).filter(l => l.is_free).map(l => ({ ...l, module_title: m.title })));
  }
  if (!fmcLessons.length && modules[0]?.lessons?.length) {
    fmcLessons = modules[0].lessons.slice(0, 6).map(l => ({ ...l, module_title: modules[0].title }));
  }

  const freeTitle = s.free_minicourse_title || "REVIT 0 DAN";
  const freeSubtitle = s.free_minicourse_subtitle || "Revit dasturini birinchi marta o‘rganayotganlar uchun bepul mini-kurs";

  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="closeDetail()">← Ortga qaytish</div>
        
        <div style="margin-bottom:18px;">
          <div class="fmc-tag" style="margin-bottom:8px;">✨ Bepul Mini-Kurs</div>
          <div class="page-title" style="margin-bottom:6px;">${escapeHtml(freeTitle)} — Darslar</div>
          <p style="font-size:13px; color:var(--text-secondary); line-height:1.45;">
            ${escapeHtml(freeSubtitle)}. Kerakli darsni tanlab o'rganishni boshlang:
          </p>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:24px;">
          ${fmcLessons.length > 0 ? fmcLessons.map((l, idx) => `
            <div onclick="openLesson(${Number(l.id)})" style="display:flex; justify-content:space-between; align-items:center; padding:14px 16px; background:rgba(255,255,255,0.04); border:1px solid var(--border); border-radius:14px; cursor:pointer; transition:all 0.2s ease;">
              <div style="display:flex; align-items:center; gap:12px;">
                <div style="width:36px; height:36px; border-radius:10px; background:rgba(41,121,255,0.15); color:var(--accent); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:14px; flex-shrink:0;">
                  ${idx + 1}
                </div>
                <div>
                  <div style="font-size:13.5px; font-weight:700; color:var(--text-primary); margin-bottom:2px; line-height:1.35;">
                    ${escapeHtml(l.title)}
                  </div>
                  <div style="font-size:11.5px; color:var(--text-secondary);">
                    ${escapeHtml(l.module_title || "Asosiy modul")} • Bepul dars
                  </div>
                </div>
              </div>
              <div style="background:var(--accent); color:#fff; border-radius:8px; padding:6px 12px; font-size:12px; font-weight:700; display:flex; align-items:center; gap:4px; flex-shrink:0;">
                ▶ Ko'rish
              </div>
            </div>
          `).join("") : `
            <div style="text-align:center; padding:30px; color:var(--text-secondary);">
              Hozircha bepul darslar belgilanmagan.
            </div>
          `}
        </div>

        ${fmcLessons.length > 0 ? `
          <button class="btn" onclick="openLesson(${Number(fmcLessons[0].id)})" style="margin-bottom:12px;">
            🚀 1-darsdan boshlash
          </button>
        ` : ""}
      </div>
    `
  };
  render();
}

function renderFreeMiniCourseCard() {
  const modules = Array.isArray(state.modules) ? state.modules : [];
  const s = state.settings || {};

  const freeTitle = s.free_minicourse_title || "REVIT 0 DAN";
  const freeSubtitle = s.free_minicourse_subtitle || "Revit dasturini birinchi marta o‘rganayotganlar uchun bepul mini-kurs";
  const rawPoints = s.free_minicourse_points || "Revit nima ekanini tushunasiz\nBirinchi loyihani yaratasiz\nDevor, eshik, deraza chizasiz\nBirinchi 3D modelingizni yaratasiz";
  const freePoints = rawPoints.split("\n").map(p => p.trim()).filter(Boolean);

  let fmcLessons = [];
  if (s.free_minicourse_lesson_ids) {
    const ids = s.free_minicourse_lesson_ids.split(",").map(n => parseInt(n.trim(), 10)).filter(Boolean);
    const allL = modules.flatMap(m => (m.lessons || []).map(l => ({ ...l, module_title: m.title })));
    fmcLessons = ids.map(id => allL.find(l => l.id === id)).filter(Boolean);
  }
  if (!fmcLessons.length) {
    fmcLessons = modules.flatMap(m => (m.lessons || []).filter(l => l.is_free).map(l => ({ ...l, module_title: m.title })));
  }
  if (!fmcLessons.length && modules[0]?.lessons?.length) {
    fmcLessons = modules[0].lessons.slice(0, 6).map(l => ({ ...l, module_title: modules[0].title }));
  }

  const countText = fmcLessons.length > 0 ? `${fmcLessons.length} ta bepul dars` : "6 ta bepul dars";

  return `
    <div class="free-minicourse-card">
      <div class="fmc-top">
        <div class="fmc-top-bar">
          <div class="fmc-tag">✨ Bepul Mini-Kurs</div>
          ${state.is_admin ? `
            <button class="admin-small-btn" onclick="openEditFreeMiniCourseModal()" style="font-size:11px; padding:4px 9px;">
              ✏️ Tahrirlash
            </button>
          ` : ""}
        </div>

        <div class="fmc-title">${escapeHtml(freeTitle)}</div>
        <div class="fmc-subtitle">${escapeHtml(freeSubtitle)}</div>

        <div class="fmc-gift-pill">
          🎁 ${countText}
        </div>

        <div>
          <button type="button" class="fmc-start-btn" onclick="openFreeMiniCourseLessonsModal()">
            🚀 BOSHLASH
          </button>
        </div>
      </div>

      <div class="fmc-divider"></div>

      <div class="fmc-bottom">
        <div class="fmc-features-title">Bu mini-kursda siz:</div>
        <div class="fmc-checklist">
          ${freePoints.map(point => `
            <div class="fmc-check-item">
              <span class="fmc-check-icon">✓</span>
              <span>${escapeHtml(point)}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

let fmcActiveCourseFilter = "all";
let fmcSelectedLessonIds = new Set();

function renderFmcLessonsListHtml() {
  const courses = state.courses || [];
  const modules = Array.isArray(state.modules) ? state.modules : [];
  const firstCourseId = courses.length ? courses[0].id : 1;

  const filterCourseId = fmcActiveCourseFilter;
  const filteredCourses = filterCourseId === "all" 
    ? courses 
    : courses.filter(c => String(c.id) === String(filterCourseId));

  if (!filteredCourses.length && modules.length) {
    return modules.map(m => `
      <div style="margin-bottom:12px; background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:10px; padding:10px;">
        <div style="font-size:12.5px; font-weight:750; color:var(--accent); margin-bottom:8px;">📂 ${escapeHtml(m.title)}</div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          ${(m.lessons || []).map(l => {
            const isChecked = fmcSelectedLessonIds.has(Number(l.id));
            return `
              <label style="display:flex; align-items:center; gap:8px; font-size:12px; cursor:pointer;">
                <input type="checkbox" class="fmc-lesson-cb" value="${l.id}" ${isChecked ? "checked" : ""} onchange="onFmcLessonCheckboxChange(${l.id}, this.checked)">
                <span>${escapeHtml(l.title)} ${l.is_free ? '<span style="color:var(--success); font-size:11px;">(Bepul)</span>' : ''}</span>
              </label>
            `;
          }).join("")}
        </div>
      </div>
    `).join("");
  }

  let html = filteredCourses.map(c => {
    const cModules = modules.filter(m => Number(m.course_id || firstCourseId) === Number(c.id));
    if (!cModules.length) return "";

    return `
      <div class="fmc-course-group" style="margin-bottom:14px; background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:12px; padding:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px;">
          <span style="font-size:13px; font-weight:800; color:var(--accent);">🎓 ${escapeHtml(c.title)}</span>
          <button type="button" class="admin-small-btn" onclick="toggleSelectCourseLessons(${c.id})" style="font-size:10px; padding:3px 8px;">
            Ushbu kursni to'liq belgilash
          </button>
        </div>

        ${cModules.map(m => `
          <div style="margin-bottom:10px; padding-left:6px; border-left:2px solid rgba(41,121,255,0.35);">
            <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">
              📂 ${escapeHtml(m.title)}
            </div>
            <div style="display:flex; flex-direction:column; gap:6px; padding-left:4px;">
              ${(m.lessons || []).map(l => {
                const isChecked = fmcSelectedLessonIds.has(Number(l.id));
                return `
                  <label style="display:flex; align-items:center; gap:8px; font-size:12.5px; cursor:pointer;">
                    <input type="checkbox" class="fmc-lesson-cb" data-course-id="${c.id}" value="${l.id}" ${isChecked ? "checked" : ""} onchange="onFmcLessonCheckboxChange(${l.id}, this.checked)">
                    <span>${escapeHtml(l.title)} ${l.is_free ? '<span style="color:var(--success); font-size:11px; font-weight:700;">(Bepul)</span>' : ''}</span>
                  </label>
                `;
              }).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }).join("");

  if (!html.trim()) {
    html = `<div class="empty-box" style="padding:16px 12px; font-size:12.5px;">Ushbu kursda hali darslar mavjud emas. Boshqa kursni tanlang yoki "Barcha kurslar" filtri orqali ko'ring.</div>`;
  }
  return html;
}

function onFmcLessonCheckboxChange(lessonId, checked) {
  if (checked) {
    fmcSelectedLessonIds.add(Number(lessonId));
  } else {
    fmcSelectedLessonIds.delete(Number(lessonId));
  }
}

function onFmcCourseFilterChange(val) {
  fmcActiveCourseFilter = val;
  const container = document.getElementById("fmc-lessons-grouped-container");
  if (container) {
    container.innerHTML = renderFmcLessonsListHtml();
  }
}

function toggleSelectCourseLessons(courseId) {
  haptic("light");
  const modules = Array.isArray(state.modules) ? state.modules : [];
  const courses = state.courses || [];
  const firstCourseId = courses.length ? courses[0].id : 1;
  const cModules = modules.filter(m => Number(m.course_id || firstCourseId) === Number(courseId));
  const lessonIds = cModules.flatMap(m => (m.lessons || []).map(l => Number(l.id)));
  
  const allAlreadySelected = lessonIds.length > 0 && lessonIds.every(id => fmcSelectedLessonIds.has(id));
  if (allAlreadySelected) {
    lessonIds.forEach(id => fmcSelectedLessonIds.delete(id));
  } else {
    lessonIds.forEach(id => fmcSelectedLessonIds.add(id));
  }
  const container = document.getElementById("fmc-lessons-grouped-container");
  if (container) {
    container.innerHTML = renderFmcLessonsListHtml();
  }
}

function selectAllFreeLessons() {
  haptic("medium");
  const modules = Array.isArray(state.modules) ? state.modules : [];
  modules.forEach(m => {
    (m.lessons || []).forEach(l => {
      if (l.is_free) fmcSelectedLessonIds.add(Number(l.id));
    });
  });
  const container = document.getElementById("fmc-lessons-grouped-container");
  if (container) {
    container.innerHTML = renderFmcLessonsListHtml();
  }
}

function clearAllFmcLessons() {
  haptic("light");
  fmcSelectedLessonIds.clear();
  const container = document.getElementById("fmc-lessons-grouped-container");
  if (container) {
    container.innerHTML = renderFmcLessonsListHtml();
  }
}

function openEditFreeMiniCourseModal() {
  haptic("light");
  const s = state.settings || {};
  const currentTitle = s.free_minicourse_title || "REVIT 0 DAN";
  const currentSubtitle = s.free_minicourse_subtitle || "Revit dasturini birinchi marta o‘rganayotganlar uchun bepul mini-kurs";
  const currentPoints = s.free_minicourse_points || "Revit nima ekanini tushunasiz\nBirinchi loyihani yaratasiz\nDevor, eshik, deraza chizasiz\nBirinchi 3D modelingizni yaratasiz";
  const selectedIds = (s.free_minicourse_lesson_ids || "").split(",").map(n => parseInt(n.trim(), 10)).filter(Boolean);

  fmcSelectedLessonIds = new Set(selectedIds);
  fmcActiveCourseFilter = "all";

  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="closeDetail()">← Ortga qaytish</div>
        <div class="page-title">Bepul Mini-Kursni Sozlash</div>

        <div class="admin-form">
          <div class="apple-field">
            <label>Mini-kurs nomi</label>
            <input id="edit-fmc-title" class="apple-input" type="text" value="${escapeHtml(currentTitle)}">
          </div>

          <div class="apple-field">
            <label>Qisqacha ta'rif</label>
            <input id="edit-fmc-subtitle" class="apple-input" type="text" value="${escapeHtml(currentSubtitle)}">
          </div>

          <div class="apple-field">
            <label>O'rganiladigan natijalar (Har bir qatorda bittadan yozing, kartada ✓ bilan chiqadi)</label>
            <textarea id="edit-fmc-points" class="apple-input apple-textarea" rows="4">${escapeHtml(currentPoints)}</textarea>
          </div>

          <div class="apple-field">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
              <label style="font-weight:700; margin:0;">Mini-kurs darslari (kurslar bo'yicha tartiblangan):</label>
              <div style="display:flex; gap:6px;">
                <button type="button" class="admin-small-btn" onclick="selectAllFreeLessons()" style="font-size:10.5px; padding:3px 8px;">
                  Barcha bepul darslar
                </button>
                <button type="button" class="admin-small-btn" onclick="clearAllFmcLessons()" style="font-size:10.5px; padding:3px 8px; color:var(--danger);">
                  Tozalash
                </button>
              </div>
            </div>

            <!-- Kurs bo'yicha saralash filtri -->
            <div style="margin-bottom:10px;">
              <select id="fmc-course-filter" class="apple-input" onchange="onFmcCourseFilterChange(this.value)" style="font-size:12.5px;">
                <option value="all">📁 Barcha kurslar bo'yicha ko'rish</option>
                ${(state.courses || []).map(c => `<option value="${c.id}">🎓 ${escapeHtml(c.title)}</option>`).join("")}
              </select>
            </div>

            <div id="fmc-lessons-grouped-container" style="max-height:280px; overflow-y:auto; border:1px solid var(--border); border-radius:10px; padding:10px; background:var(--bg-surface);">
              ${renderFmcLessonsListHtml()}
            </div>
            <span style="font-size:11.5px; color:var(--text-secondary); margin-top:6px; display:block;">
              💡 Darslar kurslar va modullar bo'yicha tartiblangan. Qaysi darslarni belgilasangiz, o'quvchi boshlash tugmasini bosganda aynan o'sha darslar ro'yxati ochiladi.
            </span>
          </div>

          <button id="save-fmc-btn" class="btn" onclick="submitEditFreeMiniCourse()">
            💾 Saqlash
          </button>
        </div>
      </div>
    `
  };
  render();
}

async function submitEditFreeMiniCourse() {
  const title = document.getElementById("edit-fmc-title")?.value.trim() || "REVIT 0 DAN";
  const subtitle = document.getElementById("edit-fmc-subtitle")?.value.trim() || "";
  const points = document.getElementById("edit-fmc-points")?.value.trim() || "";
  const chosenIds = Array.from(fmcSelectedLessonIds).join(",");

  const btn = document.getElementById("save-fmc-btn");
  if (btn) btn.classList.add("btn-loading");

  try {
    haptic("medium");
    await adminApi("/api/admin/settings/update", {
      free_minicourse_title: title,
      free_minicourse_subtitle: subtitle,
      free_minicourse_points: points,
      free_minicourse_lesson_ids: chosenIds
    });
    showToast("Bepul mini-kurs sozlamalari saqlandi!");
    await loadContent();
    closeDetail();
  } catch (err) {
    showAlert(err.message || "Saqlashda xatolik.");
  } finally {
    if (btn) btn.classList.remove("btn-loading");
  }
}

// ======================================================
// TAB 1: HOME PAGE (Talab 1 & Talab 2)
// ======================================================

function renderHome() {
  const modules = Array.isArray(state.modules) ? state.modules : [];
  const isPayingStudent = Boolean(state.has_access || state.is_admin);

  // 7-TALAB: Yangi o'quvchi uchun bepul darslar progressi, to'lov qilgach barcha pullik darslar qo'shiladi
  let myTotal = 0;
  let myWatched = 0;
  let progressTitle = "O'quv progressi";

  const allFreeLessons = modules.flatMap(m => (m.lessons || []).filter(l => l.is_free).map(l => ({ ...l, module_title: m.title })));
  const sampleFreeList = allFreeLessons.length > 0 ? allFreeLessons : (modules[0]?.lessons || []).slice(0, 4).map(l => ({ ...l, module_title: modules[0].title }));

  if (!isPayingStudent) {
    myTotal = sampleFreeList.length;
    myWatched = sampleFreeList.filter(l => l.watched).length;
    progressTitle = "Bepul namuna darslar progressi";
  } else {
    myTotal = modules.reduce((tot, m) => tot + (m.lessons?.length || 0), 0);
    myWatched = modules.reduce((tot, m) => tot + (m.watched_count || 0), 0);
    progressTitle = "To'liq kurs progressi";
  }
  const pct = myTotal ? Math.round((myWatched / myTotal) * 100) : 0;

  // 6-TALAB: Admin (Abdulloh) rasmi (Google Drive CDN formatlash va zaxira bilan)
  const rawAdminPhoto = state.settings?.admin_photo_url || "/admin.jpg";
  const adminPhoto = formatImageUrl(rawAdminPhoto);
  const retryAdminPhoto = getDriveFallbackUrl(rawAdminPhoto);

  // 2-TALAB: Faqat admin belgilagan kurslarni chiqarish (show_on_home)
  const featuredCourses = (state.courses || []).filter(c => c.show_on_home);
  const coursesToShow = featuredCourses.length > 0 ? featuredCourses : (state.courses || []).slice(0, 1);

  // 5-TALAB: O'quvchilar fikri (Dinamik bazadan)
  const testimonialsList = state.testimonials && state.testimonials.length ? state.testimonials : TESTIMONIALS;

  // 1-TALAB: Ijtimoiy tarmoqlar
  const s = state.settings || {};
  const socialTg = s.social_telegram || "https://t.me/yoshuzbekk";
  const socialInsta = s.social_instagram || "https://instagram.com/yoshuzbekk";
  const socialYt = s.social_youtube || "https://youtube.com/@yoshuzbekk";
  const socialChat = s.social_channel || "https://t.me/yoshuzbekk_academy";
  const faqsList = state.faqs && state.faqs.length ? state.faqs : [];

  return `
    <div class="page">
      <div class="welcome-hero">
        <div class="welcome-badge">✨ YOSHUZBEKK Academy</div>
        <div class="welcome-title">
          Xush kelibsiz${state.first_name ? ", " + escapeHtml(state.first_name) : ""}!
        </div>
        <div class="welcome-sub">${escapeHtml(s.academy_sub || "Arxitektura, BIM, Interyer va Vizualizatsiya akademiyasi")}</div>
      </div>

      <!-- 7-TALAB: O'QUV PROGRESSI (Bepul va pullik o'quvchi uchun moslashuvchan) -->
      ${myTotal ? `
        <div class="progress-wrap">
          <div class="progress-labels">
            <span>${progressTitle}</span>
            <span>${myWatched} / ${myTotal} dars (${pct}%)</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${pct}%"></div>
          </div>
          ${!isPayingStudent ? `
            <div style="font-size:11.5px; color:var(--text-muted); margin-top:6px; display:flex; justify-content:space-between; align-items:center;">
              <span>💡 Kursga to'liq a'zo bo'lgach barcha pullik darslar qo'shiladi</span>
              <span style="color:var(--accent); font-weight:700; cursor:pointer;" onclick="setTab('chat')">A'zo bo'lish ↗</span>
            </div>
          ` : ""}
        </div>
      ` : ""}

      <!-- BEPUL MINI-KURS KARTASI (REVIT 0 DAN) - Admin haqida blokidan oldin -->
      ${renderFreeMiniCourseCard()}

      <!-- 6-TALAB: O'ZIM HAQIMDA (Google Drive rasmlari to'liq ko'rinadigan CDN va zaxira fallback) -->
      <div class="about-card">
        <div class="about-photo-wrap" style="display:flex; align-items:center; gap:14px; margin-bottom:14px;">
          <div style="position:relative; width:64px; height:64px; flex-shrink:0;">
            <img
              src="${escapeHtml(adminPhoto)}"
              data-retry="${escapeHtml(retryAdminPhoto)}"
              alt="Abdulloh"
              class="about-photo"
              style="width:64px; height:64px; border-radius:50%; object-fit:cover; display:block; border:2px solid var(--accent); box-shadow:0 4px 14px var(--accent-glow);"
              onerror="handleImageError(this) || (this.src='https://ui-avatars.com/api/?name=Abdulloh&background=2979ff&color=fff&size=128&bold=true');"
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

      <!-- 2-TALAB: FAQAT ADMIN BELGILAGAN KURS(LAR) KO'RINADI -->
      <div class="section-title">
        <span>Asosiy Kurs</span>
        <span style="font-size:13px; color:var(--accent); cursor:pointer;" onclick="setTab('lessons')">Barcha kurslar (${(state.courses || []).length}) →</span>
      </div>

      ${coursesToShow.map(course => {
        const coverSrc = formatImageUrl(course.cover_url);
        const retrySrc = getDriveFallbackUrl(course.cover_url);
        return `
        <div class="course-card" onclick="openCourseCatalog(${Number(course.id)})">
          <div class="course-card-header">
            ${coverSrc ? `<img src="${escapeHtml(coverSrc)}" data-retry="${escapeHtml(retrySrc)}" onerror="handleImageError(this)" style="width:100%; height:100%; object-fit:cover;" />` : ""}
            <div class="course-banner-text" style="${coverSrc ? 'background:rgba(0,0,0,0.5);' : ''}">
              <h3>${escapeHtml(course.title)}</h3>
              <p>${escapeHtml(course.subtitle || '')}</p>
            </div>
          </div>
          <div class="course-body">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div class="course-title" style="margin-bottom:0;">${escapeHtml(course.title)}</div>
              ${state.is_admin ? `
                <button class="admin-small-btn" onclick="event.stopPropagation(); toggleCourseHome(${Number(course.id)})" style="font-size:10.5px; padding:4px 8px; background:${course.show_on_home ? 'var(--success)' : 'var(--bg-surface)'}; color:${course.show_on_home ? '#fff' : 'var(--text-secondary)'}; border:1px solid var(--border);">
                  ${course.show_on_home ? "⭐ Asosiy" : "☆ Belgilash"}
                </button>
              ` : ""}
            </div>
            <div class="course-meta" style="margin-top:6px;">
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
      `;
      }).join("") || `<div class="empty-box">Hozircha kurslar mavjud emas.</div>`}

      <!-- 3-TALAB: O'QUVCHILAR NATIJALARI VA LOYIHA ALBOM LARI (PDF KARUSEL & ADMIN TAHRIRLASH) -->
      ${renderShowcaseCarousel()}

      <!-- 4-TALAB: KOMPYUTER PARAMETRLARI TUGMA ORQALI (Ixcham ko'rinish va oyna orqali tanlash) -->
      ${renderPcSpecsCompactCard()}

      <!-- 5-TALAB: O'QUVCHILAR FIKRI (ADMIN TAHRIRLAY OLADI) -->
      <div class="section-title" style="margin-top:20px;">
        <span>O'quvchilar fikri</span>
        ${state.is_admin ? `
          <button class="admin-small-btn" onclick="openAddTestimonialModal()" style="font-size:11px; padding:5px 9px;">
            ➕ Fikr qo'shish
          </button>
        ` : ""}
      </div>
      <div class="testi-scroll">
        ${testimonialsList.map(t => `
          <div class="testi-card" style="position:relative;">
            <div class="testi-text">"${escapeHtml(t.text)}"</div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
              <div class="testi-name">— ${escapeHtml(t.name)}</div>
              ${state.is_admin ? `
                <div style="display:flex; gap:6px;">
                  <span onclick="openEditTestimonialModal(${Number(t.id)}, '${escapeJsString(t.name)}', '${escapeJsString(t.text)}', '${escapeJsString(t.role || 'O\'quvchi')}')" title="Tahrirlash" style="font-size:12px; cursor:pointer; opacity:0.8;">✏️</span>
                  <span onclick="deleteTestimonialItem(${Number(t.id)})" title="O'chirish" style="font-size:12px; color:var(--danger); cursor:pointer; opacity:0.8;">🗑️</span>
                </div>
              ` : ""}
            </div>
          </div>
        `).join("")}
      </div>

      <!-- FAQ: KO'P BERILADIGAN SAVOLLAR -->
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

      <!-- 1-TALAB: BIZNI KUZATING (IJTIMOIY TARMOQLAR) -->
      <div class="social-section" style="margin-top:28px; padding-top:20px; border-top:1px solid var(--border); text-align:center;">
        <div style="font-size:15.5px; font-weight:800; color:var(--text-primary); margin-bottom:6px; display:flex; align-items:center; justify-content:center; gap:8px;">
          <span>🌐</span> Bizni ijtimoiy tarmoqlarda kuzating
          ${state.is_admin ? `
            <span onclick="openAdminSettingsModal()" title="Ijtimoiy tarmoq havolalarini tahrirlash" style="font-size:14px; cursor:pointer; opacity:0.85;">✏️</span>
          ` : ""}
        </div>
        <p style="font-size:12px; color:var(--text-secondary); margin-bottom:14px;">
          Yangi darslar, Revit oilalari va loyiha yangiliklaridan xabardor bo'ling:
        </p>

        <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:10px; margin-bottom:16px;">
          <a href="${escapeHtml(socialTg)}" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; gap:10px; padding:11px 12px; background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-primary);">
            <div style="width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg, #229ED9, #1778A8); display:flex; align-items:center; justify-content:center; color:#fff; font-size:16px; flex-shrink:0;">✈️</div>
            <div style="text-align:left; min-width:0;">
              <div style="font-size:12.5px; font-weight:750;">Telegram</div>
              <div style="font-size:10.5px; color:var(--text-secondary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Kanalimiz</div>
            </div>
          </a>

          <a href="${escapeHtml(socialInsta)}" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; gap:10px; padding:11px 12px; background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-primary);">
            <div style="width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); display:flex; align-items:center; justify-content:center; color:#fff; font-size:16px; flex-shrink:0;">📷</div>
            <div style="text-align:left; min-width:0;">
              <div style="font-size:12.5px; font-weight:750;">Instagram</div>
              <div style="font-size:10.5px; color:var(--text-secondary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Sahifamiz</div>
            </div>
          </a>

          <a href="${escapeHtml(socialYt)}" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; gap:10px; padding:11px 12px; background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-primary);">
            <div style="width:32px; height:32px; border-radius:50%; background:#FF0000; display:flex; align-items:center; justify-content:center; color:#fff; font-size:16px; flex-shrink:0;">▶️</div>
            <div style="text-align:left; min-width:0;">
              <div style="font-size:12.5px; font-weight:750;">YouTube</div>
              <div style="font-size:10.5px; color:var(--text-secondary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Video darslar</div>
            </div>
          </a>

          <a href="${escapeHtml(socialChat)}" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; gap:10px; padding:11px 12px; background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-primary);">
            <div style="width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg, #0088cc, #005580); display:flex; align-items:center; justify-content:center; color:#fff; font-size:16px; flex-shrink:0;">💬</div>
            <div style="text-align:left; min-width:0;">
              <div style="font-size:12.5px; font-weight:750;">Guruhimiz</div>
              <div style="font-size:10.5px; color:var(--text-secondary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Savol-javob</div>
            </div>
          </a>
        </div>

        <div style="font-size:11px; color:var(--text-muted); margin-bottom:6px;">
          © ${new Date().getFullYear()} YOSHUZBEKK Academy. Barcha huquqlar himoyalangan.
        </div>
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

// 2-TALAB: Kursni bosh sahifada ko'rsatish/yashirish
async function toggleCourseHome(courseId) {
  try {
    haptic("medium");
    const res = await adminApi(`/api/admin/courses/${Number(courseId)}/toggle-home`);
    showToast(res.course?.show_on_home ? "Kurs bosh sahifaga qo'shildi!" : "Kurs bosh sahifadan olindi");
    await loadContent();
  } catch (err) {
    showAlert(err.message || "Kurs holatini o'zgartirishda xato.");
  }
}

// 5-TALAB: O'quvchilar fikrini boshqarish (CRUD)
function openAddTestimonialModal() {
  const name = prompt("O'quvchi ismi:");
  if (!name || !name.trim()) return;
  const role = prompt("Kasbi / Roli (masalan: Arxitektor, Dizayner, Talaba):", "O'quvchi") || "O'quvchi";
  const text = prompt("O'quvchi fikri / taassuroti:");
  if (!text || !text.trim()) return;

  adminApi("/api/admin/testimonials/add", {
    name: name.trim(),
    role: role.trim(),
    text: text.trim()
  }).then(() => {
    showToast("Fikr muvaffaqiyatli qo'shildi!");
    loadContent();
  }).catch(err => showAlert(err.message));
}

function openEditTestimonialModal(id, oldName, oldText, oldRole) {
  const name = prompt("O'quvchi ismini tahrirlang:", oldName);
  if (!name || !name.trim()) return;
  const role = prompt("Roli / Kasbi:", oldRole) || "O'quvchi";
  const text = prompt("Fikr matnini tahrirlang:", oldText);
  if (!text || !text.trim()) return;

  adminApi(`/api/admin/testimonials/${Number(id)}/update`, {
    name: name.trim(),
    role: role.trim(),
    text: text.trim()
  }).then(() => {
    showToast("Fikr yangilandi!");
    loadContent();
  }).catch(err => showAlert(err.message));
}

function deleteTestimonialItem(id) {
  showConfirm("Fikr o'chirilsinmi?", "Ushbu o'quvchi fikri ro'yxatdan olib tashlanadi.", "O'chirish", async () => {
    await adminApi(`/api/admin/testimonials/${Number(id)}/delete`);
    showToast("Fikr o'chirildi!");
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

function getFilteredCoursesList() {
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
  return allCourses.filter(c => {
    const courseCats = Array.isArray(c.categories) && c.categories.length ? c.categories : [c.category || "Boshqa"];
    const matchesCategory = selectedCourseCategory === "Barchasi" || courseCats.includes(selectedCourseCategory);
    const matchesSearch = !q || (c.title || "").toLowerCase().includes(q) || (c.subtitle || "").toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });
}

function renderCourseCardsListHtml() {
  const coursesList = getFilteredCoursesList();
  if (!coursesList.length) {
    return `<div class="empty-box">Hech narsa topilmadi. Boshqa so'z yoki kategoriya bilan sinab ko'ring.</div>`;
  }

  return coursesList.map(course => {
    const coverSrc = formatImageUrl(course.cover_url);
    const retrySrc = getDriveFallbackUrl(course.cover_url);
    return `
    <div class="course-card" onclick="openCourseCatalog(${Number(course.id)})" style="cursor:pointer; position:relative;">
      ${state.is_admin ? `
        <div style="position:absolute; top:12px; right:12px; z-index:10; display:flex; gap:6px;">
          <button class="admin-small-btn" style="padding:4px 8px; font-size:11px; background:rgba(0,0,0,0.6);" onclick="event.stopPropagation(); openEditCourseModal(${Number(course.id)})">✏️ Tahrirlash</button>
          <button class="admin-small-btn" style="padding:4px 8px; font-size:11px; background:rgba(235,59,59,0.8);" onclick="event.stopPropagation(); deleteCourseModal(${Number(course.id)})">🗑️</button>
        </div>
      ` : ""}

      <div class="course-card-header" style="aspect-ratio: 16/7; background: linear-gradient(135deg, #0d47a1, #1976d2);">
        ${coverSrc ? `<img src="${escapeHtml(coverSrc)}" data-retry="${escapeHtml(retrySrc)}" onerror="handleImageError(this)" style="width:100%; height:100%; object-fit:cover;" />` : ""}
        <div class="course-banner-text" style="${coverSrc ? 'background:rgba(0,0,0,0.5);' : ''}">
          <h3>${escapeHtml(course.title)}</h3>
          <p>${escapeHtml(course.subtitle || '')}</p>
        </div>
      </div>
      <div class="course-body">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div class="tag ${course.status === 'active' ? 'passed' : ''}" style="${course.status !== 'active' && state.is_admin ? 'background:rgba(239,68,68,0.15); color:#ff6b6b; border:1px solid rgba(239,68,68,0.3);' : ''}">
            ${course.status === 'active' ? 'Faol Kurs' : (/marafon|stream|7/i.test(course.title || '') ? '🔥 Marafon' : (state.is_admin ? '🔒 Hali chiqmadi (Qoralama)' : 'Mavjud Kurs'))}
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
          Darslarni ochish →
        </button>
      </div>
    </div>
  `;
  }).join("");
}

// Kurslar ro'yxati va Admin uchun "Yangi Kurs Qo'shish" (Talab 3)
function renderCoursesList() {
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
        id="course-search-input"
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

      <div id="course-cards-list">
        ${renderCourseCardsListHtml()}
      </div>
    </div>
  `;
}

function setCourseSearch(value) {
  courseSearchQuery = value;
  const listEl = document.getElementById("course-cards-list");
  if (listEl) {
    listEl.innerHTML = renderCourseCardsListHtml();
  } else {
    render();
  }
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
            <label>Obloshka (muqova) rasm linki (Google Drive yoki to'g'ridan-to'g'ri rasm)</label>
            <input id="c-cover" class="apple-input" placeholder="https://drive.google.com/file/d/... yoki https://..." type="url" oninput="updateCourseCoverPreview(this.value, 'add-course-cover-preview')">
            <div id="add-course-cover-preview" style="margin-top:8px; border-radius:10px; overflow:hidden; display:none; max-height:160px; border:1px solid var(--border);"></div>
          </div>

          <div class="apple-field" style="margin-top:14px; margin-bottom:18px;">
            <label style="font-weight:750; display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span>Kurs holati (O'quvchilarga ko'rinishi)</span>
              <span id="modal-c-status-badge" class="course-status-badge draft">🔒 Hali chiqmadi</span>
            </label>
            <div style="font-size:12px; color:var(--text-secondary); margin-bottom:10px; line-height:1.4;">
              O'quvchilar chala darslarni ko'rib qolmasligi uchun sukut bo'yicha yopiq turadi.
            </div>
            <input type="hidden" id="c-status" value="draft">
            <div class="status-slide-toggle" id="modal-c-status-toggle" data-status="draft" onclick="handleFormStatusClick(event, 'c-status', 'modal-c-status-toggle', 'modal-c-status-badge')">
              <div class="status-slide-pill"></div>
              <button type="button" class="status-slide-opt" data-val="draft" onclick="event.stopPropagation(); setFormStatus('draft', 'c-status', 'modal-c-status-toggle', 'modal-c-status-badge')">
                <span class="status-slide-opt-title">🔒 Hali chiqmadi</span>
                <span class="status-slide-opt-desc">Qoralama (yopiq)</span>
              </button>
              <button type="button" class="status-slide-opt" data-val="active" onclick="event.stopPropagation(); setFormStatus('active', 'c-status', 'modal-c-status-toggle', 'modal-c-status-badge')">
                <span class="status-slide-opt-title">🚀 Sotuvga chiqish</span>
                <span class="status-slide-opt-desc">Barchaga ochiq</span>
              </button>
            </div>
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
  const cover = formatImageUrl(document.getElementById("c-cover")?.value.trim() || "");
  const status = document.getElementById("c-status")?.value || "draft";

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
      cover_url: cover,
      status: status
    });
    showToast(status === "active" ? "Yangi kurs sotuvda yaratildi!" : "Yangi kurs qoralamada saqlandi (o‘quvchilarga ko‘rinmaydi)!");
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
            <label>Obloshka (muqova) rasm linki (Google Drive yoki to'g'ridan-to'g'ri rasm)</label>
            <input id="ec-cover" class="apple-input" value="${escapeHtml(course.cover_url || '')}" type="url" oninput="updateCourseCoverPreview(this.value, 'edit-course-cover-preview')">
            <div id="edit-course-cover-preview" style="margin-top:8px; border-radius:10px; overflow:hidden; ${course.cover_url ? 'display:block;' : 'display:none;'} max-height:160px; border:1px solid var(--border);">
              ${course.cover_url ? `<img src="${escapeHtml(formatImageUrl(course.cover_url))}" data-retry="${escapeHtml(getDriveFallbackUrl(course.cover_url))}" onerror="handleImageError(this)" style="width:100%; height:160px; object-fit:cover;" />` : ''}
            </div>
          </div>

          <div class="apple-field" style="margin-top:14px; margin-bottom:18px;">
            <label style="font-weight:750; display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span>Kurs holati (O'quvchilarga ko'rinishi)</span>
              <span id="modal-ec-status-badge" class="course-status-badge ${course.status === 'active' ? 'active' : 'draft'}">
                ${course.status === 'active' ? '🚀 Sotuvda (Ommaviy)' : '🔒 Hali chiqmadi (Qoralama)'}
              </span>
            </label>
            <div style="font-size:12px; color:var(--text-secondary); margin-bottom:10px; line-height:1.4;">
              O'quvchilarga ko'rinish holatini o'ngga yoki chapga o'tkazib boshqaring.
            </div>
            <input type="hidden" id="ec-status" value="${course.status || 'draft'}">
            <div class="status-slide-toggle" id="modal-ec-status-toggle" data-status="${course.status || 'draft'}" onclick="handleFormStatusClick(event, 'ec-status', 'modal-ec-status-toggle', 'modal-ec-status-badge')">
              <div class="status-slide-pill"></div>
              <button type="button" class="status-slide-opt" data-val="draft" onclick="event.stopPropagation(); setFormStatus('draft', 'ec-status', 'modal-ec-status-toggle', 'modal-ec-status-badge')">
                <span class="status-slide-opt-title">🔒 Hali chiqmadi</span>
                <span class="status-slide-opt-desc">Qoralama (yopiq)</span>
              </button>
              <button type="button" class="status-slide-opt" data-val="active" onclick="event.stopPropagation(); setFormStatus('active', 'ec-status', 'modal-ec-status-toggle', 'modal-ec-status-badge')">
                <span class="status-slide-opt-title">🚀 Sotuvga chiqish</span>
                <span class="status-slide-opt-desc">Barchaga ochiq</span>
              </button>
            </div>
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
  const cover = formatImageUrl(document.getElementById("ec-cover")?.value.trim() || "");
  const status = document.getElementById("ec-status")?.value || "draft";

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
      cover_url: cover,
      status: status
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

// ======================================================
// COURSE PUBLICATION STATUS CONTROLS
// ======================================================

async function setCourseStatus(courseId, newStatus) {
  haptic("medium");
  const toggles = [
    document.getElementById(`course-status-toggle-${courseId}`),
    document.getElementById(`course-status-toggle-btm-${courseId}`)
  ].filter(Boolean);
  toggles.forEach(t => t.setAttribute("data-status", newStatus));

  const badges = [
    document.getElementById(`course-status-badge-${courseId}`),
    document.getElementById(`course-status-badge-btm-${courseId}`)
  ].filter(Boolean);
  badges.forEach(b => {
    b.className = `course-status-badge ${newStatus === 'active' ? 'active' : 'draft'}`;
    b.innerHTML = newStatus === 'active' ? '🚀 Sotuvda (Ommaviy)' : '🔒 Hali Chiqmadi (Qoralama)';
  });

  const cardEl = document.getElementById(`course-status-card-${courseId}`);
  if (cardEl) {
    cardEl.className = `course-status-card ${newStatus === 'active' ? 'active-mode' : 'draft-mode'}`;
  }
  const hintEl = document.getElementById(`course-status-hint-${courseId}`);
  if (hintEl) {
    hintEl.textContent = newStatus === 'active'
      ? "Ushbu kurs hozir barcha o‘quvchilarga ko‘rinmoqda va sotuvga chiqarilgan."
      : "Ushbu kurs hozircha o‘quvchilarga ko‘rinmaydi. Modullar va darslarni to‘ldirib bo‘lgach, o‘ngga surib sotuvga chiqarishingiz mumkin.";
  }

  try {
    const res = await adminApi(`/api/admin/courses/${Number(courseId)}/status`, { status: newStatus });
    if (res && res.course) {
      if (courseModulesData && courseModulesData.course && Number(courseModulesData.course.id) === Number(courseId)) {
        courseModulesData.course.status = newStatus;
      }
      const existingInState = (state.courses || []).find(c => Number(c.id) === Number(courseId));
      if (existingInState) {
        existingInState.status = newStatus;
      }
    }
    if (newStatus === "active") {
      showToast("🚀 Kurs muvaffaqiyatli sotuvga chiqarildi!");
    } else {
      showToast("🔒 Kurs qoralamaga olindi (o'quvchilarga ko'rinmaydi).");
    }
  } catch (err) {
    showAlert(err.message || "Kurs holatini o'zgartirishda xato yuz berdi.");
    render();
  }
}

function handleCourseStatusClick(e, courseId) {
  const rect = e.currentTarget.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const newStatus = clickX > rect.width / 2 ? "active" : "draft";
  setCourseStatus(courseId, newStatus);
}

function setFormStatus(status, inputId, toggleId, badgeId) {
  haptic("light");
  const input = document.getElementById(inputId);
  if (input) input.value = status;
  const toggle = document.getElementById(toggleId);
  if (toggle) toggle.setAttribute("data-status", status);
  const badge = document.getElementById(badgeId);
  if (badge) {
    badge.className = `course-status-badge ${status === 'active' ? 'active' : 'draft'}`;
    badge.innerHTML = status === 'active' ? '🚀 Sotuvga chiqish' : '🔒 Hali chiqmadi';
  }
}

function handleFormStatusClick(e, inputId, toggleId, badgeId) {
  const rect = e.currentTarget.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const newStatus = clickX > rect.width / 2 ? "active" : "draft";
  setFormStatus(newStatus, inputId, toggleId, badgeId);
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
        <div id="course-status-card-${course.id}" class="course-status-card ${course.status === 'active' ? 'active-mode' : 'draft-mode'}">
          <div class="course-status-header">
            <div class="course-status-title">
              <span>📡 Kurs Ko'rinishi (Status)</span>
            </div>
            <div id="course-status-badge-${course.id}" class="course-status-badge ${course.status === 'active' ? 'active' : 'draft'}">
              ${course.status === 'active' ? '🚀 Sotuvda (Ommaviy)' : '🔒 Hali Chiqmadi (Qoralama)'}
            </div>
          </div>
          <div id="course-status-hint-${course.id}" class="course-status-hint">
            ${course.status === 'active'
              ? "Ushbu kurs hozir barcha o‘quvchilarga ko‘rinmoqda va sotuvga chiqarilgan."
              : "Ushbu kurs hozircha o‘quvchilarga ko‘rinmaydi. Modullar va darslarni to‘ldirib bo‘lgach, o‘ngga surib sotuvga chiqarishingiz mumkin."}
          </div>
          <div class="status-slide-toggle" id="course-status-toggle-${course.id}" data-status="${course.status || 'draft'}" onclick="handleCourseStatusClick(event, ${Number(course.id)})">
            <div class="status-slide-pill"></div>
            <button type="button" class="status-slide-opt" data-val="draft" onclick="event.stopPropagation(); setCourseStatus(${Number(course.id)}, 'draft')">
              <span class="status-slide-opt-title">🔒 Hali chiqmadi</span>
              <span class="status-slide-opt-desc">O'quvchilarga yopiq</span>
            </button>
            <button type="button" class="status-slide-opt" data-val="active" onclick="event.stopPropagation(); setCourseStatus(${Number(course.id)}, 'active')">
              <span class="status-slide-opt-title">🚀 Sotuvga chiqish</span>
              <span class="status-slide-opt-desc">Barchaga ochiq</span>
            </button>
          </div>
        </div>

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
                ${mod.test_passed && mod.retake_available_at ? `
                  <div class="retake-countdown" data-until="${escapeHtml(mod.retake_available_at)}" style="font-size:11px; color:var(--text-secondary); text-align:center;">
                    Hisoblanmoqda...
                  </div>
                ` : ""}
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

  if (state.is_admin) {
    html += `
      <div class="course-bottom-action-bar">
        <div class="course-status-header">
          <div class="course-status-title">
            <span>⚙️ Pastki boshqaruv: Kursni sotuvga chiqarish</span>
          </div>
          <div id="course-status-badge-btm-${course.id}" class="course-status-badge ${course.status === 'active' ? 'active' : 'draft'}">
            ${course.status === 'active' ? '🚀 Sotuvda (Ommaviy)' : '🔒 Hali Chiqmadi (Qoralama)'}
          </div>
        </div>
        <div class="status-slide-toggle" id="course-status-toggle-btm-${course.id}" data-status="${course.status || 'draft'}" onclick="handleCourseStatusClick(event, ${Number(course.id)})">
          <div class="status-slide-pill"></div>
          <button type="button" class="status-slide-opt" data-val="draft" onclick="event.stopPropagation(); setCourseStatus(${Number(course.id)}, 'draft')">
            <span class="status-slide-opt-title">🔒 Hali chiqmadi</span>
            <span class="status-slide-opt-desc">Qoralama (o‘quvchilarga yopiq)</span>
          </button>
          <button type="button" class="status-slide-opt" data-val="active" onclick="event.stopPropagation(); setCourseStatus(${Number(course.id)}, 'active')">
            <span class="status-slide-opt-title">🚀 Sotuvga chiqish</span>
            <span class="status-slide-opt-desc">Faol (barchaga ochiq)</span>
          </button>
        </div>
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

    setActivityWatchingLesson(lesson, currentModuleData, currentCourse);

    const watermarkText = `${state.first_name || ""} · ID ${escapeHtml(String(state.telegram_id || ""))}`.trim();
    const watermarkHtml = `
      <div class="video-watermark">
        <span>${watermarkText}</span>
        <span>${watermarkText}</span>
      </div>
    `;

    function getClientYouTubeEmbed(url) {
      if (!url || typeof url !== "string") return null;
      var clean = url.trim();
      var srcMatch = clean.match(/src=["']([^"']+)["']/i);
      if (srcMatch && srcMatch[1]) clean = srcMatch[1];
      if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
        return `https://www.youtube.com/embed/${clean}?rel=0&modestbranding=1&enablejsapi=1`;
      }
      var m = clean.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
      if (m && m[1]) {
        return `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1&enablejsapi=1`;
      }
      return null;
    }

    const ytEmbed = lesson.youtube_player_url ||
      getClientYouTubeEmbed(lesson.youtube_url) ||
      getClientYouTubeEmbed(lesson.bunny_player_url) ||
      getClientYouTubeEmbed(lesson.bunny_video_id);

    const directStreamUrl = (lesson.youtube_url || lesson.bunny_player_url || lesson.bunny_video_id || "").trim();

    let videoHtml = "";
    if (ytEmbed) {
      videoHtml = `
        <div class="video-container">
          <iframe src="${escapeHtml(ytEmbed)}" title="${escapeHtml(lesson.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          ${watermarkHtml}
        </div>
        ${directStreamUrl && /^https?:\/\//i.test(directStreamUrl) ? `
          <div style="display:flex; justify-content:flex-end; margin-top:8px;">
            <a href="${escapeHtml(directStreamUrl)}" target="_blank" rel="noopener noreferrer" style="font-size:12px; color:var(--accent); text-decoration:none; display:inline-flex; align-items:center; gap:6px; font-weight:600; padding:6px 12px; border-radius:8px; background:rgba(0,122,255,0.08); border:1px solid rgba(0,122,255,0.15);">
              <span>▶ Jonli Efir / YouTube'da ochish ↗</span>
            </a>
          </div>
        ` : ""}
      `;
    } else if (lesson.bunny_player_url && /\.mp4($|\?)/i.test(lesson.bunny_player_url)) {
      videoHtml = `
        <div class="video-container" style="background:#000; display:flex; align-items:center; justify-content:center;">
          <video controls playsinline controlslist="nodownload" preload="metadata" style="width:100%; max-height:420px; border-radius:12px;">
            <source src="${escapeHtml(lesson.bunny_player_url)}" type="video/mp4">
            Brauzeringiz videoni qo'llab-quvvatlamaydi.
          </video>
          ${watermarkHtml}
        </div>
      `;
    } else if (lesson.bunny_player_url) {
      videoHtml = `
        <div class="video-container">
          <iframe src="${escapeHtml(lesson.bunny_player_url)}" title="${escapeHtml(lesson.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          ${watermarkHtml}
        </div>
        ${directStreamUrl && /^https?:\/\//i.test(directStreamUrl) ? `
          <div style="display:flex; justify-content:flex-end; margin-top:8px;">
            <a href="${escapeHtml(directStreamUrl)}" target="_blank" rel="noopener noreferrer" style="font-size:12px; color:var(--accent); text-decoration:none; display:inline-flex; align-items:center; gap:6px; font-weight:600; padding:6px 12px; border-radius:8px; background:rgba(0,122,255,0.08); border:1px solid rgba(0,122,255,0.15);">
              <span>▶ Stream / Videoni to'g'ridan-to'g'ri ochish ↗</span>
            </a>
          </div>
        ` : ""}
      `;
    } else if (lesson.files && lesson.files.length > 0 && lesson.files.some(f => /youtube|youtu\.be|mediadelivery|bunny|drive\.google|\.mp4/i.test(f.file_url || ''))) {
      const vidFile = lesson.files.find(f => /youtube|youtu\.be|mediadelivery|bunny|drive\.google|\.mp4/i.test(f.file_url || ''));
      const embedFromFile = getClientYouTubeEmbed(vidFile.file_url);
      if (embedFromFile) {
        videoHtml = `
          <div class="video-container">
            <iframe src="${escapeHtml(embedFromFile)}" title="${escapeHtml(lesson.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            ${watermarkHtml}
          </div>
          <div style="display:flex; justify-content:flex-end; margin-top:8px;">
            <a href="${escapeHtml(vidFile.file_url)}" target="_blank" rel="noopener noreferrer" style="font-size:12px; color:var(--accent); text-decoration:none; display:inline-flex; align-items:center; gap:6px; font-weight:600; padding:6px 12px; border-radius:8px; background:rgba(0,122,255,0.08); border:1px solid rgba(0,122,255,0.15);">
              <span>▶ Jonli Efir / Video havolasini ochish ↗</span>
            </a>
          </div>
        `;
      } else {
        videoHtml = `
          <div class="video-container">
            <iframe src="${escapeHtml(vidFile.file_url)}" title="${escapeHtml(lesson.title)}" allowfullscreen></iframe>
            ${watermarkHtml}
          </div>
        `;
      }
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
            ${renderLessonQABox(lesson.id, lesson.questions)}

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

function renderLessonQABox(lessonId, questions) {
  const qList = Array.isArray(questions) ? questions : [];

  return `
    <div class="lesson-qa-box" id="lesson-qa-box-${lessonId}">
      <div class="lesson-qa-header">
        <div class="lesson-qa-title">
          <span>💬 Dars Bo'yicha Savol Berish</span>
        </div>
        <span class="tag">${qList.length} ta savol</span>
      </div>
      <div class="lesson-qa-desc">
        Ushbu darsda tushunmagan joyingiz bo‘lsa, savolingizni yozing. Ustoz sizga javob qaytaradi.
      </div>

      <div class="qa-form">
        <textarea
          id="qa-input-${lessonId}"
          class="qa-textarea"
          placeholder="Dars yuzasidan savolingizni aniq yozing..."
        ></textarea>
        <button
          type="button"
          class="qa-submit-btn"
          onclick="submitLessonQuestion(${Number(lessonId)})"
        >
          🚀 Savolni ustozga yuborish
        </button>
      </div>

      <div class="qa-list" id="qa-list-${lessonId}">
        ${qList.length ? qList.map(q => `
          <div class="qa-card ${q.status === 'answered' ? 'answered' : ''}">
            <div class="qa-card-head">
              <span class="qa-author">
                👤 ${escapeHtml([q.first_name, q.last_name].filter(Boolean).join(" ") || "O‘quvchi")}
                ${q.is_mine ? '<span style="font-size:10px; opacity:0.75; color:var(--accent); font-weight:600;">(Siz)</span>' : ''}
              </span>
              <span class="qa-time">${fmtTimeAgo(q.created_at)}</span>
            </div>
            <div class="qa-question-text">${escapeHtml(q.question)}</div>

            ${q.status === 'answered' && q.answer ? `
              <div class="qa-answer-block">
                <div class="qa-answer-title">
                  <span>👑 Ustoz javobi:</span>
                  <span style="font-size:10px; opacity:0.75; font-weight:normal; margin-left:auto;">${fmtTimeAgo(q.answered_at)}</span>
                </div>
                <div class="qa-answer-text">${escapeHtml(q.answer).replace(/\n/g, "<br>")}</div>
              </div>
            ` : `
              <div style="font-size:11.5px; color:var(--warning); display:flex; align-items:center; gap:4px;">
                ⏳ Ustoz ko‘rib chiqmoqda...
              </div>
            `}
          </div>
        `).join("") : `<div style="font-size:12px; color:var(--text-muted); text-align:center; padding:10px 0;">Hozircha savollar yo‘q. Birinchi bo‘lib savol bering!</div>`}
      </div>
    </div>
  `;
}

async function submitLessonQuestion(lessonId) {
  const input = document.getElementById(`qa-input-${lessonId}`);
  const text = input ? input.value.trim() : "";
  if (!text) {
    return showAlert("Iltimos, dars yuzasidan savolingizni yozing!");
  }

  try {
    haptic("medium");
    const res = await api(`/api/lesson/${Number(lessonId)}/question`, { question: text });
    input.value = "";
    showToast(res.message || "Savolingiz adminga yuborildi!");

    // Refresh questions in view
    const updatedLesson = await api(`/api/lesson/${Number(lessonId)}`);
    const qaListEl = document.getElementById(`qa-list-${lessonId}`);
    if (qaListEl && updatedLesson && Array.isArray(updatedLesson.questions)) {
      qaListEl.innerHTML = updatedLesson.questions.map(q => `
        <div class="qa-card ${q.status === 'answered' ? 'answered' : ''}">
          <div class="qa-card-head">
            <span class="qa-author">
              👤 ${escapeHtml([q.first_name, q.last_name].filter(Boolean).join(" ") || "O‘quvchi")}
              ${q.is_mine ? '<span style="font-size:10px; opacity:0.75; color:var(--accent); font-weight:600;">(Siz)</span>' : ''}
            </span>
            <span class="qa-time">${fmtTimeAgo(q.created_at)}</span>
          </div>
          <div class="qa-question-text">${escapeHtml(q.question)}</div>
          ${q.status === 'answered' && q.answer ? `
            <div class="qa-answer-block">
              <div class="qa-answer-title">
                <span>👑 Ustoz javobi:</span>
                <span style="font-size:10px; opacity:0.75; font-weight:normal; margin-left:auto;">${fmtTimeAgo(q.answered_at)}</span>
              </div>
              <div class="qa-answer-text">${escapeHtml(q.answer).replace(/\n/g, "<br>")}</div>
            </div>
          ` : `
            <div style="font-size:11.5px; color:var(--warning); display:flex; align-items:center; gap:4px;">
              ⏳ Ustoz ko‘rib chiqmoqda...
            </div>
          `}
        </div>
      `).join("");
    }
  } catch (err) {
    showAlert(err.message || "Savol yuborishda xatolik yuz berdi.");
  }
}

// ======================================================
// TAB 3: KUTUBXONA 2.0 — ARCHITECTURE, BIM & KNOWLEDGE SYSTEM
// ======================================================

const SECTION_CATEGORIES = {
  books: ["Barchasi", "Arxitektura", "Revit / BIM", "Interyer Dizayn", "Qurilish", "Normativlar", "Ergonomika"],
  sources: ["Barchasi", "Mebel", "Santexnika", "Eshik va Derazalar", "Shablonlar (RTE)", "DWG Chizmalar", "Yoritish"],
  tests: ["Barchasi", "Revit Asoslari", "BIM Standartlari", "Chizmachilik", "Konstruksiya"],
  materials: ["Barchasi", "Devor", "Shift", "Pol", "Mebel", "Bezak", "Santexnika", "Elektr"]
};

const DEFAULT_LIBRARY_CATEGORIES = [
  "Barchasi",
  "Kitoblar & Adabiyotlar",
  "Normativ Hujjatlar",
  "Qo'llanmalar",
  "Revit Oilalar & Shablonlar",
  "Video Darsliklar",
  "Erkin Testlar",
  "Qurilish Materiallari",
  "Terminlar",
  "Arxitektura",
  "Interyer Dizayn",
  "Revit / BIM",
  "Qurilish"
];

// ======================================================
// KUTUBXONA 2.0 & MOTION DESIGN SYSTEM (APPLE-INSPIRED)
// ======================================================

const libIcons = {
  book: (cls = '', size = 20) => `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 2v20"/></svg>`,
  sources: (cls = '', size = 20) => `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>`,
  tests: (cls = '', size = 20) => `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
  materials: (cls = '', size = 20) => `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  search: (cls = '', size = 18) => `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  filter: (cls = '', size = 18) => `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
  bookmark: (cls = '', size = 20, filled = false) => `<svg class="${cls} ${filled ? 'filled' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`,
  chevronRight: (cls = '', size = 16) => `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  back: (cls = '', size = 18) => `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
  download: (cls = '', size = 18) => `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  check: (cls = '', size = 18) => `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
};

function getLibraryTypeBadge(type) {
  switch (type) {
    case "book":
    case "normative":
    case "guide":
      return { label: "KITOB", className: "badge-book", iconSvg: libIcons.book('lib-badge-svg', 12) };
    case "source":
    case "family_pack":
    case "family":
      return { label: "MANBA", className: "badge-source", iconSvg: libIcons.sources('lib-badge-svg', 12) };
    case "test":
      return { label: "TEST", className: "badge-test", iconSvg: libIcons.tests('lib-badge-svg', 12) };
    case "material":
      return { label: "MATERIAL", className: "badge-material", iconSvg: libIcons.materials('lib-badge-svg', 12) };
    case "video":
      return { label: "VIDEO", className: "badge-video", iconSvg: libIcons.sources('lib-badge-svg', 12) };
    default:
      return { label: "MANBA", className: "badge-default", iconSvg: libIcons.sources('lib-badge-svg', 12) };
  }
}

async function toggleLibraryBookmark(resId, e) {
  if (e) e.stopPropagation();
  haptic("light");
  const idNum = Number(resId);
  const isBookmarked = libraryV2Bookmarks.has(idNum);

  if (isBookmarked) {
    libraryV2Bookmarks.delete(idNum);
  } else {
    libraryV2Bookmarks.add(idNum);
  }

  const btn = document.getElementById(`lib-bm-btn-${idNum}`);
  if (btn) {
    btn.classList.toggle("bookmarked", !isBookmarked);
    btn.innerHTML = libIcons.bookmark("lib-bm-svg", 20, !isBookmarked);
    btn.classList.add("anim-pulse");
    setTimeout(() => btn.classList.remove("anim-pulse"), 250);
  }

  try {
    await api("/api/library/v2/bookmark/toggle", { resource_id: idNum }, "POST");
  } catch (err) {
    console.warn("Bookmark toggle error:", err);
  }
}

function handleLibraryDownload(resId, url, filename, e) {
  if (e) e.stopPropagation();
  haptic("medium");
  const btn = document.getElementById(`lib-dl-btn-${resId}`) || (e && e.currentTarget);
  if (btn) {
    btn.classList.add("loading");
    btn.innerHTML = `<span class="lib-spinner"></span> <span>Yuklanmoqda...</span>`;
    setTimeout(() => {
      btn.classList.remove("loading");
      btn.classList.add("success");
      btn.innerHTML = `${libIcons.check('lib-check-svg', 16)} <span>Yuklash boshlandi</span>`;
      setTimeout(() => {
        btn.classList.remove("success");
        btn.innerHTML = `${libIcons.download('lib-dl-svg', 16)} <span>Yuklab olish</span>`;
      }, 2000);
    }, 550);
  }

  if (url) {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    if (filename) a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

async function loadLibraryV2Data(force = false) {
  if (libraryV2Loading) return;
  if (libraryV2HasLoaded && !force) return;
  libraryV2Loading = true;
  try {
    const [sectionsData, resData, recData, coursesData, catsData, bmData, recentData] = await Promise.all([
      api("/api/library/v2/sections").catch(() => ({ sections: [] })),
      api("/api/library/v2/resources", { page: 1, limit: 200 }).catch(() => ({ resources: [] })),
      api("/api/library/v2/recommended").catch(() => ({ resources: [] })),
      api("/api/library/v2/courses").catch(() => ({ courses: [] })),
      api("/api/library/v2/categories").catch(() => ({ categories: [] })),
      api("/api/library/v2/bookmarks").catch(() => ({ resources: [] })),
      api("/api/library/v2/recent").catch(() => ({ resources: [] }))
    ]);

    if (sectionsData && Array.isArray(sectionsData.sections) && sectionsData.sections.length) {
      librarySections = sectionsData.sections;
    }
    if (resData && Array.isArray(resData.resources)) {
      libraryV2Resources = resData.resources;
    }
    if (recData && Array.isArray(recData.resources)) {
      libraryV2RecommendedList = recData.resources;
    }
    if (coursesData && Array.isArray(coursesData.courses)) {
      libraryV2CoursesList = coursesData.courses;
    }
    if (catsData && Array.isArray(catsData.categories) && catsData.categories.length) {
      libraryV2Categories = catsData.categories;
    }
    if (bmData && Array.isArray(bmData.resources)) {
      libraryV2Bookmarks = new Set(bmData.resources.map(r => Number(r.id)));
    }
    if (recentData && Array.isArray(recentData.resources)) {
      libraryV2RecentList = recentData.resources;
    }
    libraryV2HasLoaded = true;

    if (activeTab === "tasks" && !currentView) {
      render();
    }
  } catch (err) {
    console.error("LOAD LIBRARY V2 ERROR:", err);
  } finally {
    libraryV2Loading = false;
  }
}

// ======================================================
// KUTUBXONA NAVIGATION & ROUTING
// ======================================================

function openLibrarySection(slug) {
  haptic("light");
  libraryActiveSection = slug;
  librarySectionSearchQuery = "";
  librarySectionSelectedCategory = "Barchasi";
  librarySectionSort = "latest";
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function closeLibrarySection() {
  haptic("light");
  libraryActiveSection = null;
  librarySectionSearchQuery = "";
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function setLibrarySectionCategory(cat) {
  haptic("light");
  librarySectionSelectedCategory = cat;
  render();
}

function renderActiveSectionItemsHtml() {
  const search = (librarySectionSearchQuery || "").toLowerCase().trim();
  const cat = librarySectionSelectedCategory;

  if (libraryActiveSection === "books") {
    let books = libraryV2Resources.filter(r =>
      r.section_slug === "books" ||
      r.type === "book" ||
      r.type === "normative" ||
      r.type === "guide"
    );

    if (!books.length) {
      books = (state.open_resources || []).filter(r => r.type === "book").map(r => ({
        ...r,
        section_slug: "books",
        author: "Autodesk / O'zbekiston",
        language: "UZ",
        page_count: 240,
        what_you_learn: ["Revit dasturi interfeysi va asosiy tushunchalari", "BIM modellashtirish va listlarni sozlash", "ShNQ va KMK me'yoriy talablari"]
      }));
    }

    if (cat !== "Barchasi") {
      books = books.filter(b => b.category === cat || (cat === "Normativlar" && b.type === "normative"));
    }

    if (search) {
      books = books.filter(b =>
        (b.title && b.title.toLowerCase().includes(search)) ||
        (b.description && b.description.toLowerCase().includes(search)) ||
        (b.author && b.author.toLowerCase().includes(search)) ||
        (b.category && b.category.toLowerCase().includes(search))
      );
    }

    if (librarySectionSort === "popular") {
      books.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    } else {
      books.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return books.length ? books.map(renderBookCardHtml).join("") : `
      <div class="empty-box" style="grid-column: 1 / -1;">
        Kitoblar topilmadi. Qidiruv so'zini tekshirib ko'ring.
      </div>
    `;
  }

  if (libraryActiveSection === "sources") {
    let sources = libraryV2Resources.filter(r =>
      r.section_slug === "sources" ||
      r.type === "source" ||
      r.type === "family" ||
      r.type === "template"
    );

    if (!sources.length) {
      sources = (state.open_resources || []).filter(r => r.type === "source" || r.type === "rfa" || r.type === "family").map(r => ({
        ...r,
        section_slug: "sources",
        version: "Revit 2024+",
        file_size: "18 MB"
      }));
    }

    if (cat !== "Barchasi") {
      sources = sources.filter(s => s.category === cat);
    }

    if (search) {
      sources = sources.filter(s =>
        (s.title && s.title.toLowerCase().includes(search)) ||
        (s.description && s.description.toLowerCase().includes(search)) ||
        (s.category && s.category.toLowerCase().includes(search)) ||
        (s.version && s.version.toLowerCase().includes(search))
      );
    }

    return sources.length ? sources.map(renderSourceCardHtml).join("") : `
      <div class="empty-box" style="grid-column: 1 / -1;">
        Ushbu bo‘limda hozircha manbalar yo‘q. Tez orada yangi Revit oilalari qo‘shiladi!
      </div>
    `;
  }

  if (libraryActiveSection === "materials") {
    let mats = libraryV2Resources.filter(r =>
      r.section_slug === "materials" ||
      r.type === "material"
    );

    if (!mats.length && typeof DEFAULT_MATERIALS !== "undefined" && DEFAULT_MATERIALS.length) {
      mats = DEFAULT_MATERIALS.map(m => ({
        id: Number(m.id) + 1000,
        title: m.title,
        category: m.category,
        sub_category: m.sub_category,
        preview_image_url: m.image_url,
        description: m.short_desc,
        content_data: m
      }));
    }

    if (cat !== "Barchasi") {
      mats = mats.filter(m => m.category === cat);
    }

    if (search) {
      mats = mats.filter(m => {
        const titleMatch = m.title && m.title.toLowerCase().includes(search);
        const descMatch = m.description && m.description.toLowerCase().includes(search);
        const catMatch = m.category && m.category.toLowerCase().includes(search);
        let contentMatch = false;
        if (m.content_data) {
          const cStr = typeof m.content_data === "string" ? m.content_data.toLowerCase() : JSON.stringify(m.content_data).toLowerCase();
          contentMatch = cStr.includes(search);
        }
        return titleMatch || descMatch || catMatch || contentMatch;
      });
    }

    return mats.length ? mats.map(renderMaterialCardHtml).join("") : `
      <div class="empty-box" style="grid-column: 1 / -1;">
        Bunday material topilmadi. Qidiruv so'zini tekshiring.
      </div>
    `;
  }

  return "";
}

function setLibrarySectionSearch(q) {
  librarySectionSearchQuery = q;
  const listEl = document.getElementById("lib-section-list-container");
  if (listEl) {
    listEl.innerHTML = renderActiveSectionItemsHtml();
  }
}

function setLibrarySectionSort(sort) {
  haptic("light");
  librarySectionSort = sort;
  render();
}

function setLibrarySelectedCourse(courseId) {
  haptic("light");
  librarySelectedCourseId = courseId;
  render();
}

// ASOSIY KUTUBXONA VIEW ROUTER
function renderTasks() {
  if (!libraryV2HasLoaded && !libraryV2Loading) {
    loadLibraryV2Data();
  }

  let content = "";
  if (libraryActiveSection === "books") {
    content = renderBooksSectionHtml();
  } else if (libraryActiveSection === "sources") {
    content = renderSourcesSectionHtml();
  } else if (libraryActiveSection === "tests") {
    content = renderTestsSectionHtml();
  } else if (libraryActiveSection === "materials") {
    content = renderMaterialsSectionHtml();
  } else if (libraryActiveSection) {
    content = renderGenericSectionHtml(libraryActiveSection);
  } else {
    content = renderTasksHomeHtml();
  }

  return `<div class="lib-scope">${content}</div>`;
}

// ------------------------------------------------------
// 1. KUTUBXONA HOME (Apple-like 4 Plitka + So'nggi + Tavsiya)
// ------------------------------------------------------
function renderTasksHomeHtml() {
  const sections = librarySections.filter(s => s.is_active !== false);
  const recentList = libraryV2RecentList || [];
  const recommendedList = (libraryV2RecommendedList && libraryV2RecommendedList.length)
    ? libraryV2RecommendedList
    : libraryV2Resources.filter(r => r.is_featured).slice(0, 6);

  // SVG helper for default 4 sections
  function getSectionSvg(slug) {
    switch (slug) {
      case "books": return libIcons.book("lib-sec-svg", 22);
      case "sources": return libIcons.sources("lib-sec-svg", 22);
      case "tests": return libIcons.tests("lib-sec-svg", 22);
      case "materials": return libIcons.materials("lib-sec-svg", 22);
      default: return libIcons.sources("lib-sec-svg", 22);
    }
  }

  return `
    <div class="page lib-container lib-page-enter">
      <!-- HEADER -->
      <div class="lib-main-header">
        <div class="lib-header-top-row">
          <h1 class="lib-main-title">KUTUBXONA</h1>
          ${state.is_admin ? `
            <button class="lib-cms-btn" onclick="adminSetTab('library')" title="Kutubxona CMS">
              ⚙️ CMS Boshqaruv
            </button>
          ` : ""}
        </div>
        <p class="lib-main-subtitle">
          Arxitektura, Revit va qurilish uchun bilimlar bazasi
        </p>
      </div>

      <!-- 4 ASOSIY VIZUAL BO'LIMLAR (2x2 MOBILE / 4-COL DESKTOP) -->
      <div class="library-tiles-grid">
        ${sections.map(sec => `
          <div class="library-tile-card tile-${sec.slug}" onclick="openLibrarySection('${sec.slug}')">
            <div class="library-tile-top">
              <div class="library-tile-icon-box">
                ${getSectionSvg(sec.slug)}
              </div>
              <div class="library-tile-chevron">
                ${libIcons.chevronRight('lib-chevron-svg', 16)}
              </div>
            </div>
            <div class="library-tile-meta">
              <div class="library-tile-name">${escapeHtml(sec.name)}</div>
              <div class="library-tile-desc">${escapeHtml(sec.subtitle || sec.description || "")}</div>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- SO'NGGI KO'RILGANLAR (Horizontal Scroll with Clean Type Badges) -->
      ${recentList.length ? `
        <div class="lib-home-section">
          <div class="lib-section-header-row">
            <div class="lib-section-heading">So‘nggi ko‘rilganlar</div>
          </div>
          <div class="lib-horizontal-scroll">
            ${recentList.map(item => {
              const badge = getLibraryTypeBadge(item.type);
              const cover = formatImageUrl(item.preview_image_url || "");
              return `
                <div class="lib-recent-card" onclick="openLibraryV2ResourceDetail(${Number(item.id)})">
                  <div class="lib-recent-cover">
                    ${cover ? `<img src="${escapeHtml(cover)}" onerror="handleImageError(this)" alt="" />` : `<div style="color:var(--text-muted);">${badge.iconSvg}</div>`}
                    <span class="lib-type-badge ${badge.className}" style="position:absolute; bottom:6px; left:6px;">${badge.label}</span>
                  </div>
                  <div class="lib-recent-title" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</div>
                  <div class="lib-recent-cat">${escapeHtml(item.category || "Manba")}</div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      ` : ""}

      <!-- TAVSIYA ETILGANLAR (Recommended Grid) -->
      <div class="lib-home-section">
        <div class="lib-section-header-row">
          <div class="lib-section-heading">Tavsiya etilgan manbalar</div>
        </div>
        <div class="lib-recommended-grid">
          ${recommendedList.slice(0, 6).map(item => {
            const badge = getLibraryTypeBadge(item.type);
            const cover = formatImageUrl(item.preview_image_url || "");
            return `
              <div class="lib-rec-card" onclick="openLibraryV2ResourceDetail(${Number(item.id)})">
                <div class="lib-rec-thumb">
                  ${cover ? `<img src="${escapeHtml(cover)}" onerror="handleImageError(this)" alt="" />` : `<div style="color:var(--text-muted);">${badge.iconSvg}</div>`}
                  <span class="lib-type-badge ${badge.className}" style="position:absolute; bottom:4px; left:4px; font-size:8.5px; padding:1px 5px;">${badge.label}</span>
                </div>
                <div class="lib-rec-content">
                  <div>
                    <div class="lib-rec-cat">${escapeHtml(item.category || "Tavsiya")}</div>
                    <div class="lib-rec-title">${escapeHtml(item.title)}</div>
                  </div>
                  <div class="lib-rec-meta">
                    <span>${item.view_count || 0} marta ko‘rilgan</span>
                    <span class="lib-rec-btn-text">Ochish →</span>
                  </div>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------------------
// 2. KITOBLAR EKRANI (Books Screen — 2:3 Ratio Grid)
// ------------------------------------------------------
function renderBooksSectionHtml() {
  const cats = SECTION_CATEGORIES.books;
  const search = (librarySectionSearchQuery || "").toLowerCase().trim();
  const cat = librarySectionSelectedCategory;

  let books = libraryV2Resources.filter(r =>
    r.section_slug === "books" ||
    r.type === "book" ||
    r.type === "normative" ||
    r.type === "guide"
  );

  // Standart 3 ta asosiy kitob zaxirasi
  if (!books.length) {
    books = (state.open_resources || []).filter(r => r.type === "book").map(r => ({
      ...r,
      section_slug: "books",
      author: "Autodesk / O'zbekiston",
      language: "UZ",
      page_count: 240,
      what_you_learn: ["Revit dasturi interfeysi va asosiy tushunchalari", "BIM modellashtirish va listlarni sozlash", "ShNQ va KMK me'yoriy talablari"]
    }));
  }

  if (cat !== "Barchasi") {
    books = books.filter(b => b.category === cat || (cat === "Normativlar" && b.type === "normative"));
  }

  if (search) {
    books = books.filter(b =>
      (b.title && b.title.toLowerCase().includes(search)) ||
      (b.description && b.description.toLowerCase().includes(search)) ||
      (b.author && b.author.toLowerCase().includes(search)) ||
      (b.category && b.category.toLowerCase().includes(search))
    );
  }

  if (librarySectionSort === "popular") {
    books.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
  } else {
    books.sort((a, b) => (b.id || 0) - (a.id || 0));
  }

  return `
    <div class="page lib-container lib-page-enter">
      <div class="lib-back-nav" onclick="closeLibrarySection()">
        ${libIcons.back('lib-back-svg', 16)} Kutubxona
      </div>

      <div class="lib-section-title-wrap">
        <h2 class="lib-page-title">Kitoblar va Qo‘llanmalar</h2>
        <p class="lib-page-desc">Revit, BIM standartlari, arxitektura va ShNQ rasmiy qo'llanmalari</p>
      </div>

      <!-- SEARCH & SORT -->
      <div class="lib-filter-bar">
        <div class="lib-search-input-wrap">
          <span class="lib-search-icon">${libIcons.search('lib-search-svg', 16)}</span>
          <input type="text"
                 class="apple-input lib-search-field"
                 placeholder="Kitob, muallif yoki mavzu qidiring..."
                 value="${escapeHtml(librarySectionSearchQuery)}"
                 oninput="setLibrarySectionSearch(this.value)">
        </div>
        <select class="apple-input lib-sort-select" onchange="setLibrarySectionSort(this.value)">
          <option value="latest" ${librarySectionSort === "latest" ? "selected" : ""}>Eng yangi</option>
          <option value="popular" ${librarySectionSort === "popular" ? "selected" : ""}>Ko‘p o‘qilgan</option>
        </select>
      </div>

      <!-- KATEGORIYA CHIPLARI -->
      <div class="category-chips lib-chips-row">
        ${cats.map(c => `
          <div class="chip ${cat === c ? "active" : ""}" onclick="setLibrarySectionCategory('${escapeJsString(c)}')">
            ${escapeHtml(c)}
          </div>
        `).join("")}
      </div>

      <!-- KITOBLAR GRIDI (RATIO 2:3) -->
      <div id="lib-section-list-container" class="lib-books-grid">
        ${books.length ? books.map(renderBookCardHtml).join("") : `
          <div class="empty-box" style="grid-column: 1 / -1;">
            Kitoblar topilmadi. Qidiruv so'zini tekshirib ko'ring.
          </div>
        `}
      </div>
    </div>
  `;
}

function renderBookCardHtml(book) {
  const cover = formatImageUrl(book.preview_image_url || "");
  const badge = getLibraryTypeBadge(book.type || "book");
  const author = book.author || "Autodesk BIM";
  const pages = book.page_count ? `${book.page_count} bet` : "PDF";
  const lang = (book.language || "UZ").toUpperCase();

  return `
    <div class="lib-book-card" onclick="openBookDetail(${Number(book.id)})">
      <div class="lib-book-cover-wrap">
        ${cover ? `<img src="${escapeHtml(cover)}" class="lib-book-cover" onerror="handleImageError(this)" alt="" />` : `
          <div class="lib-book-cover-placeholder">
            ${libIcons.book('lib-cover-svg', 36)}
            <span style="font-size:11px; margin-top:6px; opacity:0.8;">${escapeHtml(book.category || "Kitob")}</span>
          </div>
        `}
        <span class="lib-type-badge ${badge.className}" style="position:absolute; top:8px; left:8px;">${badge.label}</span>
      </div>
      <div class="lib-book-info">
        <div class="lib-book-category">${escapeHtml(book.category || "Arxitektura")}</div>
        <div class="lib-book-title">${escapeHtml(book.title)}</div>
        <div class="lib-book-author">${escapeHtml(author)}</div>
        <div class="lib-book-meta-footer">
          <span>${escapeHtml(pages)} • ${escapeHtml(lang)}</span>
          <span class="lib-book-read-btn">O‘qish →</span>
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------------------
// 3. MANBALAR EKRANI (Sources Screen — File Types Focus)
// ------------------------------------------------------
function renderSourcesSectionHtml() {
  const cats = SECTION_CATEGORIES.sources;
  const search = (librarySectionSearchQuery || "").toLowerCase().trim();
  const cat = librarySectionSelectedCategory;

  let sources = libraryV2Resources.filter(r =>
    r.section_slug === "sources" ||
    r.type === "source" ||
    r.type === "family_pack" ||
    r.type === "family"
  );

  if (cat !== "Barchasi") {
    sources = sources.filter(s => s.category === cat);
  }

  if (search) {
    sources = sources.filter(s =>
      (s.title && s.title.toLowerCase().includes(search)) ||
      (s.description && s.description.toLowerCase().includes(search)) ||
      (s.category && s.category.toLowerCase().includes(search)) ||
      (s.version && s.version.toLowerCase().includes(search))
    );
  }

  return `
    <div class="page lib-container lib-page-enter">
      <div class="lib-back-nav" onclick="closeLibrarySection()">
        ${libIcons.back('lib-back-svg', 16)} Kutubxona
      </div>

      <div class="lib-section-title-wrap">
        <h2 class="lib-page-title">Manbalar va Shablonlar</h2>
        <p class="lib-page-desc">Revit parametrik oilalari (.rfa), loyiha shablonlari (.rte) va DWG bloklar</p>
      </div>

      <!-- SEARCH -->
      <div class="lib-filter-bar">
        <div class="lib-search-input-wrap" style="width:100%;">
          <span class="lib-search-icon">${libIcons.search('lib-search-svg', 16)}</span>
          <input type="text"
                 class="apple-input lib-search-field"
                 placeholder="Oila, mebel, shablon yoki DWG qidirish..."
                 value="${escapeHtml(librarySectionSearchQuery)}"
                 oninput="setLibrarySectionSearch(this.value)">
        </div>
      </div>

      <!-- KATEGORIYA CHIPLARI -->
      <div class="category-chips lib-chips-row">
        ${cats.map(c => `
          <div class="chip ${cat === c ? "active" : ""}" onclick="setLibrarySectionCategory('${escapeJsString(c)}')">
            ${escapeHtml(c)}
          </div>
        `).join("")}
      </div>

      <!-- MANBALAR GRIDI -->
      <div id="lib-section-list-container" class="lib-sources-grid">
        ${sources.length ? sources.map(renderSourceCardHtml).join("") : `
          <div class="empty-box" style="grid-column: 1 / -1;">
            Ushbu bo‘limda hozircha manbalar yo‘q. Tez orada yangi Revit oilalari qo‘shiladi!
          </div>
        `}
      </div>
    </div>
  `;
}

function renderSourceCardHtml(source) {
  const cover = formatImageUrl(source.preview_image_url || "");
  const version = source.version || "Revit 2024+";
  const size = source.file_size || "15 MB";
  const ext = (source.content_url || "").split('.').pop().toUpperCase() || "RFA";

  return `
    <div class="lib-source-card" onclick="openSourceDetail(${Number(source.id)})">
      <div class="lib-source-thumb-wrap">
        ${cover ? `<img src="${escapeHtml(cover)}" class="lib-source-thumb" onerror="handleImageError(this)" alt="" />` : `
          <div class="lib-source-thumb-placeholder">
            ${libIcons.sources('lib-source-svg', 32)}
            <span style="font-size:10px; margin-top:4px; font-weight:700;">.${escapeHtml(ext)}</span>
          </div>
        `}
      </div>
      <div class="lib-source-content">
        <div>
          <div class="lib-source-badges-row">
            <span class="lib-file-badge">${escapeHtml(ext)}</span>
            <span class="lib-version-badge">${escapeHtml(version)}</span>
            <span class="lib-version-badge">• ${escapeHtml(size)}</span>
          </div>
          <div class="lib-source-cat">${escapeHtml(source.category || "Revit Family")}</div>
          <div class="lib-source-title">${escapeHtml(source.title)}</div>
          <div class="lib-source-desc">${escapeHtml(source.description || "")}</div>
        </div>
        <div class="lib-source-footer">
          <span class="lib-source-download-cta">
            ${libIcons.download('lib-dl-cta-svg', 14)} Yuklab olish
          </span>
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------------------
// 4. TESTLAR EKRANI (Tests Screen & Interactive Quiz)
// ------------------------------------------------------
function renderTestsSectionHtml() {
  const search = (librarySectionSearchQuery || "").toLowerCase().trim();
  const courses = libraryV2CoursesList || [];

  let tests = libraryV2Resources.filter(r =>
    r.section_slug === "tests" ||
    r.type === "test" ||
    r.content_type === "test_json" ||
    r.content_type === "quiz_json"
  );

  if (librarySelectedCourseId !== "all") {
    tests = tests.filter(t => Number(t.course_id) === Number(librarySelectedCourseId));
  }

  if (search) {
    tests = tests.filter(t =>
      (t.title && t.title.toLowerCase().includes(search)) ||
      (t.description && t.description.toLowerCase().includes(search))
    );
  }

  return `
    <div class="page lib-container lib-page-enter">
      <div class="lib-back-nav" onclick="closeLibrarySection()">
        ${libIcons.back('lib-back-svg', 16)} Kutubxona
      </div>

      <div class="lib-section-title-wrap">
        <h2 class="lib-page-title">Bilimingizni Tekshiring</h2>
        <p class="lib-page-desc">Revit, BIM va arxitektura bo'yicha interaktiv sinov testlari</p>
      </div>

      <!-- KURS SELEKTORI -->
      <div class="lib-filter-bar">
        <div class="apple-field" style="width:100%; margin:0;">
          <label style="font-size:12px; margin-bottom:4px; display:block; color:var(--text-secondary);">Kurs bo'yicha filtrlash:</label>
          <select class="apple-input lib-sort-select" style="width:100%;" onchange="setLibrarySelectedCourse(this.value)">
            <option value="all" ${librarySelectedCourseId === "all" ? "selected" : ""}>[ Barcha kurslar ▾ ]</option>
            ${courses.map(c => `
              <option value="${Number(c.id)}" ${Number(librarySelectedCourseId) === Number(c.id) ? "selected" : ""}>
                ${escapeHtml(c.title)}
              </option>
            `).join("")}
          </select>
        </div>
      </div>

      <!-- TESTLAR GRIDI -->
      <div id="lib-section-list-container" class="lib-tests-grid" style="margin-top:16px;">
        ${tests.length ? tests.map(renderTestCardHtml).join("") : `
          <div class="empty-box" style="grid-column: 1 / -1;">
            Tanlangan kurs bo'yicha testlar topilmadi.
          </div>
        `}
      </div>
    </div>
  `;
}

function renderTestCardHtml(test) {
  let qCount = 10;
  if (test.content_data) {
    const data = typeof test.content_data === "string" ? JSON.parse(test.content_data) : test.content_data;
    if (Array.isArray(data)) qCount = data.length;
    else if (data && Array.isArray(data.questions)) qCount = data.questions.length;
  }
  const diff = test.difficulty || "O'rta";
  const courseTag = test.course_title || (test.course_id ? "Kurs testi" : "Erkin sinov");

  return `
    <div class="lib-test-card" onclick="startLibraryQuiz(${Number(test.id)})">
      <div class="lib-test-header">
        <span class="lib-test-badge">${escapeHtml(diff)}</span>
        <span class="lib-test-course-tag">${escapeHtml(courseTag)}</span>
      </div>
      <div class="lib-test-title">${escapeHtml(test.title)}</div>
      <div class="lib-test-desc">${escapeHtml(test.description || "Ushbu test orqali o'z bilimlaringizni sinab ko'ring.")}</div>
      <div class="lib-test-footer">
        <span>${qCount} ta savol</span>
        <span class="lib-test-start-cta">Boshlash →</span>
      </div>
    </div>
  `;
}

// ------------------------------------------------------
// 5. MATERIALLAR ENSIKLOPEDIYASI EKRANI (Materials Screen)
// ------------------------------------------------------
function renderMaterialsSectionHtml() {
  const cats = SECTION_CATEGORIES.materials;
  const search = (librarySectionSearchQuery || "").toLowerCase().trim();
  const cat = librarySectionSelectedCategory;

  let mats = libraryV2Resources.filter(r =>
    r.section_slug === "materials" ||
    r.type === "material"
  );

  if (!mats.length && DEFAULT_MATERIALS && DEFAULT_MATERIALS.length) {
    mats = DEFAULT_MATERIALS.map(m => ({
      id: Number(m.id) + 1000,
      title: m.title,
      category: m.category,
      sub_category: m.sub_category,
      preview_image_url: m.image_url,
      description: m.short_desc,
      content_data: m
    }));
  }

  if (cat !== "Barchasi") {
    mats = mats.filter(m => m.category === cat);
  }

  if (search) {
    mats = mats.filter(m => {
      const titleMatch = m.title && m.title.toLowerCase().includes(search);
      const descMatch = m.description && m.description.toLowerCase().includes(search);
      const catMatch = m.category && m.category.toLowerCase().includes(search);
      let contentMatch = false;
      if (m.content_data) {
        const cStr = typeof m.content_data === "string" ? m.content_data.toLowerCase() : JSON.stringify(m.content_data).toLowerCase();
        contentMatch = cStr.includes(search);
      }
      return titleMatch || descMatch || catMatch || contentMatch;
    });
  }

  return `
    <div class="page lib-container lib-page-enter">
      <div class="lib-back-nav" onclick="closeLibrarySection()">
        ${libIcons.back('lib-back-svg', 16)} Kutubxona
      </div>

      <div class="lib-section-title-wrap">
        <h2 class="lib-page-title">Qurilish va Interyer Materiallari</h2>
        <p class="lib-page-desc">Interyer va mebel materiallari ensiklopediyasi, xususiyatlari va tavsiyalari</p>
      </div>

      <!-- SEARCH (Multilingual) -->
      <div class="lib-filter-bar">
        <div class="lib-search-input-wrap" style="width:100%;">
          <span class="lib-search-icon">${libIcons.search('lib-search-svg', 16)}</span>
          <input type="text"
                 class="apple-input lib-search-field"
                 placeholder="Material qidiring (LDSP, MDF, GKL, Gazoblok, Keramogranit...)"
                 value="${escapeHtml(librarySectionSearchQuery)}"
                 oninput="setLibrarySectionSearch(this.value)">
        </div>
      </div>

      <!-- KATEGORIYA CHIPLARI -->
      <div class="category-chips lib-chips-row">
        ${cats.map(c => `
          <div class="chip ${cat === c ? "active" : ""}" onclick="setLibrarySectionCategory('${escapeJsString(c)}')">
            ${escapeHtml(c)}
          </div>
        `).join("")}
      </div>

      <!-- MATERIALLAR GRIDI -->
      <div id="lib-section-list-container" class="lib-materials-grid">
        ${mats.length ? mats.map(renderMaterialCardHtml).join("") : `
          <div class="empty-box" style="grid-column: 1 / -1;">
            Bunday material topilmadi. Qidiruv so'zini tekshiring.
          </div>
        `}
      </div>
    </div>
  `;
}

function renderMaterialCardHtml(mat) {
  let rawData = mat.content_data;
  if (typeof rawData === "string") {
    try { rawData = JSON.parse(rawData); } catch (e) { rawData = {}; }
  }
  const img = formatImageUrl(mat.preview_image_url || rawData?.image_url || "");
  const cat = mat.category || rawData?.category || "Qurilish";
  const subCat = mat.sub_category || rawData?.sub_category || "";

  return `
    <div class="lib-material-card" onclick="openMaterialKnowledgeDetail(${Number(mat.id)})">
      <div class="lib-material-thumb-wrap">
        ${img ? `<img src="${escapeHtml(img)}" class="lib-material-thumb" onerror="handleImageError(this)" alt="" />` : `
          <div class="lib-material-thumb-placeholder">${libIcons.materials('lib-mat-svg', 28)}</div>
        `}
        <span class="lib-type-badge badge-material" style="position:absolute; bottom:4px; left:4px; font-size:8.5px; padding:1px 5px;">MATERIAL</span>
      </div>
      <div class="lib-material-body">
        <div>
          <div class="lib-material-cat">${escapeHtml(cat)} ${subCat ? `• ${escapeHtml(subCat)}` : ""}</div>
          <div class="lib-material-title">${escapeHtml(mat.title)}</div>
          <div class="lib-material-desc">${escapeHtml(mat.description || rawData?.short_desc || "")}</div>
        </div>
        <div class="lib-material-footer">
          <span class="lib-material-cta">Batafsil ma'lumot →</span>
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------------------
// 6. DETAIL VIEWS (Apple-Inspired Sheet & Reader)
// ------------------------------------------------------

let lastPdfReturnView = null;
let lastPdfReturnScroll = 0;

function openPdfViewerModal(pdfUrl, title) {
  haptic("light");
  if (!pdfUrl) return showAlert("Kitob yoki fayl havolasi mavjud emas.");

  lastPdfReturnView = currentView;
  lastPdfReturnScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

  const driveId = extractGoogleDriveId(pdfUrl);
  let embedUrl = "";
  if (driveId) {
    embedUrl = `https://drive.google.com/file/d/${driveId}/preview`;
  } else if (pdfUrl.startsWith("http://") || pdfUrl.startsWith("https://")) {
    embedUrl = `/api/pdf-proxy?url=${encodeURIComponent(pdfUrl)}`;
  } else {
    embedUrl = pdfUrl;
  }

  currentView = {
    html: `
      <div class="page lib-container lib-page-enter" style="padding-bottom: 24px;">
        <div class="lib-detail-top-bar" style="margin-bottom: 12px; display:flex; justify-content:space-between; align-items:center;">
          <div class="lib-back-nav" style="margin:0;" onclick="closePdfViewerModal()">
            ${libIcons.back('lib-back-svg', 16)} Chiqish
          </div>
          <div style="font-size: 13.5px; font-weight: 700; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 60%; text-align: right;">
            ${escapeHtml(title || "Kitob Mutolaasi")}
          </div>
        </div>

        <div class="lib-pdf-container" style="width: 100%; height: calc(100vh - 120px); min-height: 520px; border-radius: 16px; overflow: hidden; background: #1c1c1e; box-shadow: 0 10px 36px rgba(0,0,0,0.35); border: 1px solid var(--border);">
          <iframe
            id="lib-pdf-iframe"
            src="${escapeHtml(embedUrl)}"
            style="width: 100%; height: 100%; border: none; display: block;"
            allow="autoplay"
            allowfullscreen>
          </iframe>
        </div>
      </div>
    `
  };
  render();
  window.scrollTo(0, 0);
}

function closePdfViewerModal() {
  haptic("light");
  if (lastPdfReturnView) {
    currentView = lastPdfReturnView;
    render();
    window.scrollTo(0, lastPdfReturnScroll || 0);
  } else {
    closeDetail();
  }
}

async function openBookDetail(resId) {
  haptic("light");
  lastDetailReturnScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

  let book = libraryV2Resources.find(r => Number(r.id) === Number(resId));
  if (!book && state.open_resources) {
    book = state.open_resources.find(r => Number(r.id) === Number(resId));
  }

  try {
    const detailData = await api(`/api/library/v2/resource/${Number(resId)}`);
    if (detailData && detailData.resource) {
      book = detailData.resource;
    }
  } catch (e) {}

  if (!book) return showAlert("Kitob ma'lumotlari topilmadi.");

  const cover = formatImageUrl(book.preview_image_url || "");
  const author = book.author || "Autodesk BIM & Architecture";
  const pages = book.page_count ? `${book.page_count} bet` : "PDF Kitob";
  const lang = (book.language || "UZ").toUpperCase();
  const isBookmarked = libraryV2Bookmarks.has(Number(book.id));

  let whatLearn = [];
  if (book.content_data) {
    const cd = typeof book.content_data === "string" ? JSON.parse(book.content_data) : book.content_data;
    if (cd && Array.isArray(cd.what_you_learn)) whatLearn = cd.what_you_learn;
  }
  if (!whatLearn.length) {
    whatLearn = [
      "Revit va BIM dasturlarida professional ishlash prinsiplari",
      "Arxitektura va interyer ishchi chizmalarini xalqaro standartda chiqarish",
      "O'zbekiston shaharsozlik normalari (ShNQ & KMK) me'yoriy talablari",
      "Mebel, pardozlash va konstruktiv elementlarni to'g'ri hisoblash"
    ];
  }

  currentView = {
    html: `
      <div class="page lib-container lib-detail-page">
        <div class="lib-detail-top-bar">
          <div class="lib-back-nav" style="margin:0;" onclick="closeDetail()">
            ${libIcons.back('lib-back-svg', 16)} Orqaga
          </div>
          <button id="lib-bm-btn-${Number(book.id)}" class="lib-bookmark-toggle-btn ${isBookmarked ? "bookmarked" : ""}" onclick="toggleLibraryBookmark(${Number(book.id)}, event)" title="Saqlash">
            ${libIcons.bookmark('lib-bm-svg', 20, isBookmarked)}
          </button>
        </div>

        <div class="lib-detail-hero-card">
          <div class="lib-detail-header-flex">
            ${cover ? `
              <div class="lib-detail-cover-box">
                <img src="${escapeHtml(cover)}" class="lib-detail-cover-img" onerror="handleImageError(this)" alt="" />
              </div>
            ` : ""}
            <div class="lib-detail-primary-meta">
              <span class="lib-type-badge badge-book">KUTUBXONA NASHRI</span>
              <h1 class="lib-detail-title">${escapeHtml(book.title)}</h1>
              ${book.subtitle ? `<div class="lib-detail-sub">${escapeHtml(book.subtitle)}</div>` : ""}
              <div class="lib-detail-author">Muallif: <strong>${escapeHtml(author)}</strong></div>

              <div class="lib-specs-table">
                <div class="lib-spec-col">
                  <span class="spec-label">Hajmi</span>
                  <span class="spec-val">${escapeHtml(pages)}</span>
                </div>
                <div class="lib-spec-col">
                  <span class="spec-label">Tili</span>
                  <span class="spec-val">${escapeHtml(lang)}</span>
                </div>
                <div class="lib-spec-col">
                  <span class="spec-label">Formati</span>
                  <span class="spec-val">PDF</span>
                </div>
              </div>
            </div>
          </div>

          <!-- NIMALARNI O'RGANASIZ -->
          <div class="lib-detail-section">
            <div class="lib-detail-section-title">Nimalarni o'rganasiz?</div>
            <ul class="lib-bullet-list">
              ${whatLearn.map(item => `<li><span class="bullet-icon">✓</span> <span>${escapeHtml(item)}</span></li>`).join("")}
            </ul>
          </div>

          <!-- KITOB HAQIDA -->
          <div class="lib-detail-section">
            <div class="lib-detail-section-title">Kitob haqida</div>
            <div class="lib-detail-text">
              ${escapeHtml(book.description || "Ushbu qo'llanma Revit va BIM mutaxassislari uchun maxsus tayyorlangan bo'lib, loyihalash jarayonini sezilarli darajada yengillashtiradi.")}
            </div>
          </div>

          <!-- ACTION BUTTONS: FAQAT O'QISH (ASL MANBA VA ULASHISH YO'Q) -->
          <div class="lib-detail-actions" style="margin-top:24px;">
            ${book.content_url ? `
              <button class="lib-download-btn" style="width:100%;" onclick="openPdfViewerModal('${escapeJsString(book.content_url)}', '${escapeJsString(book.title)}')">
                ${libIcons.book('lib-btn-svg', 18)} O‘QISHNI BOSHLASH
              </button>
            ` : `<button class="lib-download-btn" style="width:100%; opacity:0.6;" disabled>Kitob mutolaa havolasi kiritilmagan</button>`}
          </div>
        </div>
      </div>
    `
  };
  render();
  window.scrollTo(0, 0);
}

async function openSourceDetail(resId) {
  haptic("light");
  lastDetailReturnScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

  let source = libraryV2Resources.find(r => Number(r.id) === Number(resId));
  try {
    const detailData = await api(`/api/library/v2/resource/${Number(resId)}`);
    if (detailData && detailData.resource) source = detailData.resource;
  } catch (e) {}

  if (!source) return showAlert("Manba topilmadi.");

  const cover = formatImageUrl(source.preview_image_url || "");
  const version = source.version || "Revit 2024 / 2025";
  const size = source.file_size || "15 MB";
  const isBookmarked = libraryV2Bookmarks.has(Number(source.id));

  currentView = {
    html: `
      <div class="page lib-container lib-detail-page">
        <div class="lib-detail-top-bar">
          <div class="lib-back-nav" style="margin:0;" onclick="closeDetail()">
            ${libIcons.back('lib-back-svg', 16)} Orqaga
          </div>
          <button id="lib-bm-btn-${Number(source.id)}" class="lib-bookmark-toggle-btn ${isBookmarked ? "bookmarked" : ""}" onclick="toggleLibraryBookmark(${Number(source.id)}, event)" title="Saqlash">
            ${libIcons.bookmark('lib-bm-svg', 20, isBookmarked)}
          </button>
        </div>

        <div class="lib-detail-hero-card">
          ${cover ? `
            <div style="width:100%; max-height:260px; border-radius:14px; overflow:hidden; margin-bottom:18px; border:1px solid var(--border);">
              <img src="${escapeHtml(cover)}" style="width:100%; height:100%; object-fit:cover;" onerror="handleImageError(this)" alt="" />
            </div>
          ` : ""}

          <div style="display:flex; gap:8px; margin-bottom:8px; align-items:center;">
            <span class="lib-type-badge badge-source">REVIT MANBASI</span>
            <span class="lib-version-badge">${escapeHtml(version)}</span>
          </div>

          <h1 class="lib-detail-title" style="margin-top:0;">${escapeHtml(source.title)}</h1>
          <div style="font-size:12.5px; color:var(--text-secondary); margin-bottom:16px;">
            Kategoriya: <strong>${escapeHtml(source.category || "Revit Family")}</strong> • Hajmi: <strong>${escapeHtml(size)}</strong>
          </div>

          <div class="lib-detail-section">
            <div class="lib-detail-section-title">Manba haqida</div>
            <div class="lib-detail-text">
              ${escapeHtml(source.description || "Ushbu manba Revit loyihalarida bevosita foydalanish uchun to'liq optimallashgan va parametrlashtirilgan.")}
            </div>
          </div>

          <div class="lib-detail-actions" style="margin-top:24px;">
            ${source.content_url ? `
              <button id="lib-dl-btn-${Number(source.id)}" class="lib-download-btn" style="width:100%;" onclick="handleLibraryDownload(${Number(source.id)}, '${escapeJsString(source.content_url)}', '${escapeJsString(source.title)}', event)">
                ${libIcons.download('lib-dl-svg', 18)} Yuklab olish (${escapeHtml(size)})
              </button>
            ` : `<button class="lib-download-btn" style="width:100%; opacity:0.6;" disabled>Yuklash havolasi mavjud emas</button>`}
          </div>
        </div>
      </div>
    `
  };
  render();
  window.scrollTo(0, 0);
}

async function openMaterialKnowledgeDetail(matId) {
  haptic("light");
  lastDetailReturnScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

  let mat = libraryV2Resources.find(r => Number(r.id) === Number(matId));
  let data = mat?.content_data;

  if (!mat && DEFAULT_MATERIALS) {
    const raw = DEFAULT_MATERIALS.find(m => Number(m.id) === Number(matId) || (Number(m.id) + 1000) === Number(matId));
    if (raw) {
      mat = { title: raw.title, category: raw.category, preview_image_url: raw.image_url, description: raw.short_desc };
      data = raw;
    }
  }

  if (typeof data === "string") {
    try { data = JSON.parse(data); } catch (e) { data = {}; }
  }
  if (!data) data = {};

  const img = formatImageUrl(mat?.preview_image_url || data.image_url || "");
  const isBookmarked = libraryV2Bookmarks.has(Number(matId));

  currentView = {
    html: `
      <div class="page lib-container lib-detail-page">
        <div class="lib-detail-top-bar">
          <div class="lib-back-nav" style="margin:0;" onclick="closeDetail()">
            ${libIcons.back('lib-back-svg', 16)} Materiallar
          </div>
          <button id="lib-bm-btn-${Number(matId)}" class="lib-bookmark-toggle-btn ${isBookmarked ? "bookmarked" : ""}" onclick="toggleLibraryBookmark(${Number(matId)}, event)" title="Saqlash">
            ${libIcons.bookmark('lib-bm-svg', 20, isBookmarked)}
          </button>
        </div>

        <div class="lib-detail-hero-card">
          ${img ? `
            <div style="width:100%; max-height:280px; border-radius:14px; overflow:hidden; margin-bottom:18px; border:1px solid var(--border);">
              <img src="${escapeHtml(img)}" style="width:100%; height:100%; object-fit:cover;" onerror="handleImageError(this)" alt="" />
            </div>
          ` : ""}

          <div style="margin-bottom:12px;">
            <div class="material-card-category">${escapeHtml(mat?.category || data.category || "Material")} ${data.sub_category ? `• ${escapeHtml(data.sub_category)}` : ""}</div>
            <h1 class="lib-detail-title" style="margin:4px 0 6px 0;">${escapeHtml(mat?.title || data.title)}</h1>
          </div>

          ${(mat?.description || data.short_desc) ? `
            <div class="material-desc-lead" style="font-size:13.5px; color:var(--text-secondary); line-height:1.55; margin-bottom:16px;">
              ${escapeHtml(mat?.description || data.short_desc)}
            </div>
          ` : ""}

          <div class="lib-detail-section">
            <div class="lib-detail-section-title">Material nima o'zi u?</div>
            <div class="lib-detail-text">${escapeHtml(data.what_is_it || "Ushbu material arxitektura va interyer qurilishida keng qo'llaniladi.")}</div>
          </div>

          <div class="lib-detail-section">
            <div class="lib-detail-section-title">Standart o'lchamlari va qalinliklari</div>
            <div class="lib-detail-text">${escapeHtml(data.dimensions || "Standart ishlab chiqarish me'yorlariga muvofiq.")}</div>
          </div>

          <div class="lib-detail-section">
            <div class="lib-detail-section-title">Qayerlarga ishlatiladi (Tavsiya)</div>
            <div class="lib-detail-text">${escapeHtml(data.usage_area || "Ichki va tashqi pardozlash ishlari uchun.")}</div>
          </div>

          ${(data.pros || data.cons) ? `
            <div style="display:grid; grid-template-columns: 1fr; gap:10px; margin-top:16px;">
              ${data.pros ? `
                <div class="lib-quiz-option" style="cursor:default; border-left:3px solid #10b981;">
                  <div>
                    <div style="font-size:12.5px; font-weight:750; color:#10b981; margin-bottom:2px;">Afzalliklari</div>
                    <div style="font-size:12px; color:var(--text-secondary);">${escapeHtml(data.pros)}</div>
                  </div>
                </div>
              ` : ""}
              ${data.cons ? `
                <div class="lib-quiz-option" style="cursor:default; border-left:3px solid #ef4444;">
                  <div>
                    <div style="font-size:12.5px; font-weight:750; color:#ef4444; margin-bottom:2px;">Kamchiliklari</div>
                    <div style="font-size:12px; color:var(--text-secondary);">${escapeHtml(data.cons)}</div>
                  </div>
                </div>
              ` : ""}
            </div>
          ` : ""}

          ${data.uzbekistan_sources ? `
            <div class="lib-detail-section">
              <div class="lib-detail-section-title">O'zbekistondagi bozorlar va manbalar</div>
              <div class="lib-detail-text">${escapeHtml(data.uzbekistan_sources)}</div>
            </div>
          ` : ""}

          ${data.bim_tips ? `
            <div class="lib-detail-section">
              <div class="lib-detail-section-title">BIM & Revit Maslahati</div>
              <div class="lib-detail-text">${escapeHtml(data.bim_tips)}</div>
            </div>
          ` : ""}
        </div>
      </div>
    `
  };
  render();
  window.scrollTo(0, 0);
}

// Router dispatcher for generic card clicks
function openLibraryV2ResourceDetail(resId) {
  const item = libraryV2Resources.find(r => Number(r.id) === Number(resId)) ||
               (state.open_resources || []).find(r => Number(r.id) === Number(resId));

  if (!item) {
    if (state.materials) {
      const mat = state.materials.find(m => Number(m.id) === Number(resId) || (Number(m.id) + 1000) === Number(resId));
      if (mat) return openMaterialKnowledgeDetail(mat.id);
    }
    return showAlert("Resurs topilmadi.");
  }

  if (item.type === "test" || item.content_type === "test_json" || item.content_type === "quiz_json") {
    return startLibraryQuiz(resId);
  } else if (item.type === "material") {
    return openMaterialKnowledgeDetail(resId);
  } else if (item.type === "source" || item.type === "family_pack") {
    return openSourceDetail(resId);
  } else {
    return openBookDetail(resId);
  }
}

// ------------------------------------------------------
// 7. INTERACTIVE QUIZ ENGINE (Smooth Motion & Focused UX)
// ------------------------------------------------------

function startLibraryQuiz(testId) {
  haptic("light");
  lastDetailReturnScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

  const test = libraryV2Resources.find(r => Number(r.id) === Number(testId)) ||
               (state.open_resources || []).find(r => Number(r.id) === Number(testId));

  if (!test) return showAlert("Test topilmadi.");

  let questions = [];
  if (test.content_data) {
    const cd = typeof test.content_data === "string" ? JSON.parse(test.content_data) : test.content_data;
    if (Array.isArray(cd)) questions = cd;
    else if (cd && Array.isArray(cd.questions)) questions = cd.questions;
  } else if (test.test_data) {
    questions = test.test_data;
  }

  if (!questions.length) {
    return showAlert("Ushbu test uchun savollar topilmadi.");
  }

  libraryQuizState = {
    testId: test.id,
    title: test.title,
    questions: questions,
    currentIndex: 0,
    answers: {},
    isSubmitted: false
  };

  renderQuizScreen();
}

function renderQuizScreen() {
  if (!libraryQuizState) return;
  const q = libraryQuizState.questions[libraryQuizState.currentIndex];
  const total = libraryQuizState.questions.length;
  const curIdx = libraryQuizState.currentIndex;
  const selectedOpt = libraryQuizState.answers[curIdx];
  const progressPercent = Math.round(((curIdx + 1) / total) * 100);

  currentView = {
    html: `
      <div class="page lib-container lib-page-enter">
        <div class="lib-back-nav" onclick="closeDetail()">
          ${libIcons.back('lib-back-svg', 16)} Testni to'xtatish
        </div>

        <div class="lib-quiz-card">
          <div class="lib-quiz-header">
            <div class="lib-quiz-title">${escapeHtml(libraryQuizState.title)}</div>
            <div class="lib-quiz-counter">Savol ${curIdx + 1} / ${total}</div>
          </div>

          <div class="lib-quiz-progress-bar">
            <div class="lib-quiz-progress-fill" style="width: ${progressPercent}%;"></div>
          </div>

          <div class="lib-quiz-question-box">
            <div class="lib-quiz-question-text">
              ${escapeHtml(q.q || q.question || "Savol")}
            </div>

            <div class="lib-quiz-options-list">
              ${(q.options || []).map((opt, oIdx) => {
                const letter = String.fromCharCode(65 + oIdx);
                const isChosen = selectedOpt === oIdx;
                return `
                  <div class="lib-quiz-option ${isChosen ? "selected" : ""}" onclick="selectQuizAnswer(${oIdx})">
                    <div class="lib-quiz-letter">${letter}</div>
                    <div class="lib-quiz-opt-text">${escapeHtml(opt)}</div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <div class="lib-quiz-nav-row" style="margin-top:24px; display:flex; justify-content:space-between; gap:10px;">
            <button class="btn secondary" style="width:auto; margin:0; padding:10px 18px;" onclick="prevQuizQuestion()" ${curIdx === 0 ? "disabled" : ""}>
              ← Oldingisi
            </button>

            ${curIdx === total - 1 ? `
              <button class="lib-download-btn" style="width:auto; margin:0; padding:10px 24px;" onclick="finishQuiz()">
                ✓ Natijani ko'rish
              </button>
            ` : `
              <button class="lib-download-btn" style="width:auto; margin:0; padding:10px 24px;" onclick="nextQuizQuestion()">
                Keyingisi →
              </button>
            `}
          </div>
        </div>
      </div>
    `
  };
  render();
  window.scrollTo(0, 0);
}

function selectQuizAnswer(optIdx) {
  haptic("light");
  if (!libraryQuizState) return;
  libraryQuizState.answers[libraryQuizState.currentIndex] = optIdx;
  renderQuizScreen();
}

function prevQuizQuestion() {
  haptic("light");
  if (!libraryQuizState || libraryQuizState.currentIndex <= 0) return;
  libraryQuizState.currentIndex--;
  renderQuizScreen();
}

function nextQuizQuestion() {
  haptic("light");
  if (!libraryQuizState) return;
  if (libraryQuizState.currentIndex < libraryQuizState.questions.length - 1) {
    libraryQuizState.currentIndex++;
    renderQuizScreen();
  }
}

function finishQuiz() {
  haptic("medium");
  if (!libraryQuizState) return;

  const total = libraryQuizState.questions.length;
  let correctCount = 0;

  libraryQuizState.questions.forEach((q, idx) => {
    const userAns = libraryQuizState.answers[idx];
    const correctAns = Number(q.correct !== undefined ? q.correct : (q.correct_index !== undefined ? q.correct_index : q.correct_answer));
    if (userAns !== undefined && Number(userAns) === correctAns) {
      correctCount++;
    }
  });

  const percent = Math.round((correctCount / total) * 100);
  const isPassed = percent >= 70;

  currentView = {
    html: `
      <div class="page lib-container lib-page-enter">
        <div class="lib-back-nav" onclick="closeDetail()">
          ${libIcons.back('lib-back-svg', 16)} Testlar
        </div>

        <div class="lib-quiz-card" style="text-align:center;">
          <div class="lib-quiz-result-score">${percent}%</div>
          <div class="lib-quiz-result-sub">
            ${isPassed ? "Muvaffaqiyatli topshirildi" : "Yana biroz tayyorgarlik talab etiladi"} • ${correctCount} / ${total} to'g'ri javob
          </div>

          <div style="display:flex; justify-content:center; gap:10px; margin-bottom:24px;">
            <button class="btn secondary" style="width:auto; padding:10px 18px;" onclick="startLibraryQuiz(${Number(libraryQuizState.testId)})">
              Qayta topshirish
            </button>
            <button class="lib-download-btn" style="width:auto; padding:10px 22px;" onclick="closeDetail()">
              Tugatish
            </button>
          </div>

          <!-- SAVOLLAR TAHLILI VA IZOHLARI -->
          <div style="text-align:left; border-top:1px solid var(--border); padding-top:18px;">
            <div style="font-size:14px; font-weight:750; margin-bottom:12px; color:var(--text-primary);">
              Savollar tahlili:
            </div>

            ${libraryQuizState.questions.map((q, idx) => {
              const userAns = libraryQuizState.answers[idx];
              const correctAns = Number(q.correct !== undefined ? q.correct : (q.correct_index !== undefined ? q.correct_index : q.correct_answer));
              const isCorrect = userAns !== undefined && Number(userAns) === correctAns;
              const explanation = q.explanation || "Revit va arxitektura standartlariga muvofiq.";

              return `
                <div style="background:var(--bg-surface-elevated); border:1px solid var(--border); border-radius:12px; padding:12px 14px; margin-bottom:10px; border-left:3px solid ${isCorrect ? "#10b981" : "#ef4444"};">
                  <div style="font-size:13px; font-weight:700; color:var(--text-primary); margin-bottom:4px;">
                    ${idx + 1}. ${escapeHtml(q.q || q.question)}
                  </div>
                  <div style="font-size:12px; color:${isCorrect ? "#10b981" : "#ef4444"}; margin-bottom:2px;">
                    Sizning javobingiz: ${userAns !== undefined ? escapeHtml(q.options[userAns]) : "Javob berilmadi"} ${isCorrect ? "✓" : "✗"}
                  </div>
                  ${!isCorrect ? `
                    <div style="font-size:12px; color:#10b981; font-weight:600; margin-bottom:4px;">
                      To'g'ri javob: ${escapeHtml(q.options[correctAns])}
                    </div>
                  ` : ""}
                  <div style="font-size:11.5px; color:var(--text-muted); margin-top:4px;">
                    Izoh: ${escapeHtml(explanation)}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    `
  };
  render();
  window.scrollTo(0, 0);
}

async function selectTasksCourse(courseId) {
  if (!courseId) {
    selectedCourseId = null;
    courseModulesData = null;
    render();
    return;
  }
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

  let contentHtml = "";

  if (state.is_admin) {
    // ADMIN Q&A CENTER
    const allQuestions = adminQuestionsList || [];
    const pendingCount = allQuestions.filter(q => q.status === "pending").length;
    const filteredQuestions = adminQuestionsFilter === "pending"
      ? allQuestions.filter(q => q.status === "pending")
      : allQuestions;

    contentHtml = `
      <div class="admin-qa-center">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div class="page-title" style="margin-bottom:0;">Savollar Markazi</div>
          ${pendingCount > 0 ? `<span class="tag warning">⚡ ${pendingCount} ta kutilmoqda</span>` : '<span class="tag passed">Barchasi javoblangan</span>'}
        </div>
        <p style="color:var(--text-secondary); font-size:13px; margin-bottom:16px;">
          O‘quvchilar darslar ostida qoldirgan savollari. Savolga javob yozsangiz, o‘quvchiga darhol xabar boradi.
        </p>

        <div style="display:flex; gap:8px; margin-bottom:16px;">
          <button class="chip ${adminQuestionsFilter === 'pending' ? 'active' : ''}" onclick="setAdminQuestionsFilter('pending')">
            ⏳ Kutilmoqda (${pendingCount})
          </button>
          <button class="chip ${adminQuestionsFilter === 'all' ? 'active' : ''}" onclick="setAdminQuestionsFilter('all')">
            📋 Barcha savollar (${allQuestions.length})
          </button>
        </div>

        ${filteredQuestions.length ? filteredQuestions.map(q => `
          <div class="admin-qa-item ${q.status === 'pending' ? 'pending' : ''}">
            <div class="admin-qa-item-head">
              <div class="admin-qa-user-info">
                <span class="admin-qa-user-name">
                  👤 ${escapeHtml([q.first_name, q.last_name].filter(Boolean).join(" ") || "O‘quvchi")}
                  ${q.username ? `<span style="font-weight:normal; color:var(--accent); font-size:12px;">@${escapeHtml(q.username)}</span>` : ""}
                </span>
                <span class="admin-qa-user-meta">
                  📞 ${escapeHtml(q.phone || "Telefon yo‘q")} · 🕒 ${fmtTimeAgo(q.created_at)}
                </span>
              </div>
              <div class="tag ${q.status === 'answered' ? 'passed' : 'warning'}">
                ${q.status === 'answered' ? '✅ Javob berilgan' : '⏳ Kutilmoqda'}
              </div>
            </div>

            <div class="admin-qa-lesson-tag" onclick="openLessonFromChat(${Number(q.course_id || 0)}, ${Number(q.lesson_id)})" style="cursor:pointer;">
              📚 ${escapeHtml(q.course_title || "Kurs")} → ${escapeHtml(q.module_title || "Modul")} → <b>${escapeHtml(q.lesson_title || "Dars")}</b> ↗
            </div>

            <div class="admin-qa-bubble">
              <b>Savol:</b> ${escapeHtml(q.question)}
            </div>

            ${q.status === 'answered' && q.answer ? `
              <div class="qa-answer-block" style="margin-bottom:10px;">
                <div class="qa-answer-title">
                  <span>👑 Yuborilgan javobingiz:</span>
                  <span style="font-size:10px; opacity:0.75; font-weight:normal; margin-left:auto;">${fmtTimeAgo(q.answered_at)}</span>
                </div>
                <div class="qa-answer-text">${escapeHtml(q.answer).replace(/\n/g, "<br>")}</div>
              </div>
            ` : ""}

            <div class="admin-reply-box">
              <textarea id="admin-reply-input-${q.id}" class="qa-textarea" placeholder="${q.status === 'answered' ? 'Javobni qayta tahrirlash...' : 'Ushbu o‘quvchiga javob yozing...'}">${escapeHtml(q.answer || '')}</textarea>
              <div class="admin-reply-actions">
                <button class="btn" style="margin-bottom:0; padding:10px 16px;" onclick="submitAdminReply(${Number(q.id)})">
                  💬 ${q.status === 'answered' ? 'Javobni yangilash' : 'Javobni yuborish'}
                </button>
              </div>
            </div>
          </div>
        `).join("") : `
          <div class="empty-box">
            ${adminQuestionsFilter === 'pending' ? 'Hozircha javob kutayotgan savollar yo‘q! Barcha savollarga javob berilgan.' : 'Hozircha hech qanday savollar kelib tushmagan.'}
          </div>
        `}
      </div>
    `;
  } else {
    // STUDENT VIEW
    const myQuestions = studentQuestionsList || [];

    contentHtml = `
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

      <button class="btn" style="background:linear-gradient(135deg, #0088cc 0%, #2979ff 100%); margin-bottom:14px;" onclick="openDirectAdminTelegram('${escapeJsString(contactTg)}')">
        💬 Admin bilan Telegramda shaxsiy chat ochish
      </button>

      ${hasPhone ? `
      <a href="tel:${escapeHtml(contactPhone)}" class="btn secondary" style="text-decoration:none; margin-bottom:18px;">
        📞 Telefon orqali qo'ng'iroq qilish (${escapeHtml(contactPhone)})
      </a>
      ` : ""}

      ${myQuestions.length ? `
        <div style="margin-top:20px; margin-bottom:12px; font-weight:750; font-size:15px; display:flex; justify-content:space-between; align-items:center;">
          <span>📝 Darslardagi savollaringiz</span>
          <span class="tag">${myQuestions.length} ta</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
          ${myQuestions.map(q => `
            <div class="qa-card ${q.status === 'answered' ? 'answered' : ''}">
              <div class="qa-card-head">
                <span class="admin-qa-lesson-tag" style="margin-bottom:0; font-size:11px; cursor:pointer;" onclick="openLessonFromChat(${Number(q.course_id || 0)}, ${Number(q.lesson_id)})">
                  🎬 ${escapeHtml(q.lesson_title || 'Dars')} ↗
                </span>
                <span class="qa-time">${fmtTimeAgo(q.created_at)}</span>
              </div>
              <div class="qa-question-text" style="margin-top:6px;">
                <b>Savol:</b> ${escapeHtml(q.question)}
              </div>
              ${q.status === 'answered' && q.answer ? `
                <div class="qa-answer-block">
                  <div class="qa-answer-title">
                    <span>👑 Ustoz javobi:</span>
                    <span style="font-size:10px; opacity:0.75; font-weight:normal; margin-left:auto;">${fmtTimeAgo(q.answered_at)}</span>
                  </div>
                  <div class="qa-answer-text">${escapeHtml(q.answer).replace(/\n/g, "<br>")}</div>
                </div>
              ` : `
                <div style="font-size:11.5px; color:var(--warning); display:flex; align-items:center; gap:4px; margin-top:4px;">
                  ⏳ Ustoz ko‘rib chiqmoqda...
                </div>
              `}
            </div>
          `).join("")}
        </div>
      ` : ""}

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
    `;
  }

  return `
    <div class="page">
      ${contentHtml}
      ${state.is_admin ? `
        <button class="btn secondary" style="border-style:dashed; margin-top:14px;" onclick="openAdminSettingsModal()">
          ⚙️ Aloqa ma'lumotlarini (Telegram, Tel, Rasm) sozlash
        </button>
      ` : ""}
    </div>
  `;
}

async function openLessonFromChat(courseId, lessonId) {
  if (courseId) {
    selectedCourseId = Number(courseId);
  }
  await openLesson(lessonId);
}

async function loadChatQuestions() {
  try {
    if (state.is_admin) {
      const res = await adminApi("/api/admin/questions");
      if (res && Array.isArray(res.questions)) {
        adminQuestionsList = res.questions;
        if (activeTab === "chat" && !currentView) {
          render();
        }
      }
    } else {
      const res = await api("/api/chat/my-questions");
      if (res && Array.isArray(res.questions)) {
        studentQuestionsList = res.questions;
        if (activeTab === "chat" && !currentView) {
          render();
        }
      }
    }
  } catch (e) {
    console.warn("LOAD CHAT QUESTIONS ERROR:", e);
  }
}

async function submitAdminReply(questionId) {
  const input = document.getElementById(`admin-reply-input-${questionId}`);
  const answer = input ? input.value.trim() : "";
  if (!answer) {
    return showAlert("Iltimos, o‘quvchiga javob matnini yozing!");
  }

  try {
    haptic("medium");
    const res = await adminApi(`/api/admin/questions/${Number(questionId)}/reply`, { answer: answer });
    showToast(res.message || "Javob yuborildi!");
    await loadChatQuestions();
  } catch (err) {
    showAlert(err.message || "Javob yuborishda xato yuz berdi.");
  }
}

function setAdminQuestionsFilter(filter) {
  haptic("light");
  adminQuestionsFilter = filter;
  render();
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
  const currentPhoto = formatImageUrl(s.admin_photo_url || "/admin.jpg");

  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="closeDetail()">← Ortga qaytish</div>
        <div class="page-title">Aloqa, Rasm & Tarmoqlar</div>

        <div class="admin-form">
          <div class="card" style="margin-bottom:14px; padding:14px; border:1px solid var(--border); display:flex; align-items:center; gap:14px;">
            <img
              id="admin-photo-preview"
              src="${escapeHtml(currentPhoto)}"
              alt="Admin"
              style="width:60px; height:60px; border-radius:50%; object-fit:cover; border:2px solid var(--accent); box-shadow:0 4px 12px var(--accent-glow);"
              onerror="handleImageError(this) || (this.src='https://ui-avatars.com/api/?name=Abdulloh&background=2979ff&color=fff&size=128&bold=true');"
            />
            <div>
              <div style="font-weight:750; font-size:14px;">Abdulloh (Admin) Rasmi</div>
              <div style="font-size:11.5px; color:var(--text-secondary); margin-top:2px;">Google Disk yoki to'g'ridan-to'g'ri rasm havolasi</div>
            </div>
          </div>

          <div class="apple-field">
            <label>Admin Rasm Linki (Google Disk yoki URL) *</label>
            <input
              id="set-photo"
              class="apple-input"
              value="${escapeHtml(s.admin_photo_url || '')}"
              placeholder="https://drive.google.com/file/d/.../view yoki https://..."
              type="url"
              oninput="const p = document.getElementById('admin-photo-preview'); if (p) p.src = formatImageUrl(this.value);"
            >
          </div>

          <div class="apple-field">
            <label>Admin Telegram Usernamesi (shaxsiy lichka)</label>
            <input id="set-tg" class="apple-input" value="${escapeHtml(s.contact_telegram || '')}" placeholder="texnikuzb (boshida @ siz)" type="text">
          </div>

          <div class="apple-field">
            <label>Admin Telefon Raqami (qo'ng'iroq qilish uchun)</label>
            <input id="set-phone" class="apple-input" value="${escapeHtml(s.contact_phone || '')}" placeholder="+998901234567" type="tel">
          </div>

          <div style="font-weight:750; font-size:14px; margin:16px 0 8px; color:var(--text-primary);">
            🌐 Ijtimoiy Tarmoq Havolalari ("Bizni kuzating" bloki)
          </div>

          <div class="apple-field">
            <label>Telegram Kanal Havolasi</label>
            <input id="set-social-tg" class="apple-input" value="${escapeHtml(s.social_telegram || 'https://t.me/yoshuzbekk')}" placeholder="https://t.me/yoshuzbekk" type="url">
          </div>

          <div class="apple-field">
            <label>Instagram Sahifa Havolasi</label>
            <input id="set-social-insta" class="apple-input" value="${escapeHtml(s.social_instagram || 'https://instagram.com/yoshuzbekk')}" placeholder="https://instagram.com/yoshuzbekk" type="url">
          </div>

          <div class="apple-field">
            <label>YouTube Kanal Havolasi</label>
            <input id="set-social-yt" class="apple-input" value="${escapeHtml(s.social_youtube || 'https://youtube.com/@yoshuzbekk')}" placeholder="https://youtube.com/@yoshuzbekk" type="url">
          </div>

          <div class="apple-field">
            <label>Telegram Guruh / Forum Havolasi</label>
            <input id="set-social-chat" class="apple-input" value="${escapeHtml(s.social_channel || 'https://t.me/yoshuzbekk_academy')}" placeholder="https://t.me/yoshuzbekk_academy" type="url">
          </div>

          <button class="btn" onclick="submitAdminSettings()" style="margin-top:10px;">
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
  const socialTg = document.getElementById("set-social-tg")?.value.trim();
  const socialInsta = document.getElementById("set-social-insta")?.value.trim();
  const socialYt = document.getElementById("set-social-yt")?.value.trim();
  const socialChat = document.getElementById("set-social-chat")?.value.trim();

  try {
    haptic("medium");
    await adminApi("/api/admin/settings/update", {
      contact_telegram: tgVal,
      contact_phone: phoneVal,
      admin_photo_url: photoVal,
      social_telegram: socialTg,
      social_instagram: socialInsta,
      social_youtube: socialYt,
      social_channel: socialChat
    });
    showToast("Sozlamalar muvaffaqiyatli saqlandi!");
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

      <!-- 1-TALAB: PLATFORMANI QO'LLAB-QUVVATLASH (FAQAT BITTA TUGMA) -->
      <div class="profile-action-row" onclick="openSupportCardsModal()" role="button" tabindex="0">
        <div class="profile-action-left">
          <div class="profile-action-icon" style="color:#ec4899;">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <span class="profile-action-label">Platformani qo‘llab-quvvatlash</span>
        </div>
        <div class="profile-action-chevron">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>

      <!-- 4-TALAB: PLATFORMADAN FOYDALANISH QOIDALARI -->
      <div class="profile-action-row" onclick="openPlatformRulesModal()" role="button" tabindex="0">
        <div class="profile-action-left">
          <div class="profile-action-icon">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <span class="profile-action-label">Foydalanish qoidalari</span>
        </div>
        <div class="profile-action-chevron">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>

      <!-- HISOBNI O'CHIRISH -->
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

  setActivityTesting(qs.moduleId, qs.currentIndex + 1, qs.questions.length);

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

function openAdminLessons() {
  openAdminPanel().then(() => {
    adminSetTab("lessons");
  });
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
  const savedScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
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
          <button class="${adminView === "library" ? "active" : ""}" onclick="adminSetTab('library')">
            📚 Kutubxona
          </button>
          <button class="${adminView === "support_cards" ? "active" : ""}" onclick="adminSetTab('support_cards')">
            💳 Qo‘llab-quvvatlash
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
          ${adminView === "library" ? renderAdminLibrary() : ""}
          ${adminView === "support_cards" ? renderAdminSupportCards() : ""}
          ${adminView === "admins" ? renderAdminAdmins() : ""}
          ${adminView === "practice" ? renderAdminPractice() : ""}
        </div>
      </div>
    `
  };
  render();
  if (savedScroll > 0) {
    window.scrollTo({ top: savedScroll, left: 0, behavior: "instant" });
  }
}

function startAdminLivePolling() {
  stopAdminLivePolling();
  adminLivePollingTimer = setInterval(async () => {
    if (!currentView || (adminView !== "dashboard" && adminView !== "live")) {
      stopAdminLivePolling();
      return;
    }
    try {
      const liveData = await adminApi("/api/admin/live-activity");
      if (liveData && liveData.ok) {
        adminData.stats = liveData.stats || adminData.stats;
        adminData.activeUsers = liveData.active_users || [];
        updateAdminLiveDomElements();
      }
    } catch (e) {}
  }, 6000);
}

function stopAdminLivePolling() {
  if (adminLivePollingTimer) {
    clearInterval(adminLivePollingTimer);
    adminLivePollingTimer = null;
  }
}

function updateAdminLiveDomElements() {
  const s = adminData.stats || {};
  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  setTxt("adm-live-online", s.online_now || 0);
  setTxt("adm-live-watching", s.watching_now || 0);
  setTxt("adm-live-testing", s.testing_now || 0);
  setTxt("adm-live-today-active", s.today_active || 0);
  setTxt("adm-live-today-views", s.today_lesson_views || 0);
  setTxt("adm-live-today-tests", s.today_test_attempts || 0);
  setTxt("adm-live-total-users", s.total_students || 0);

  const listEl = document.getElementById("admin-live-users-rows");
  if (listEl) {
    listEl.innerHTML = renderAdminLiveUsersHtml(adminData.activeUsers || []);
  }
  const countEl = document.getElementById("admin-live-users-count");
  if (countEl) {
    countEl.textContent = `(${adminData.activeUsers ? adminData.activeUsers.length : 0})`;
  }
}

async function adminSetAnalyticsPeriod(period) {
  haptic("light");
  adminData.analyticsPeriod = period;
  try {
    const data = await adminApi("/api/admin/analytics/history", { period });
    adminData.analyticsHistory = data || { summary: {}, daily: [] };
    const container = document.getElementById("admin-analytics-section");
    if (container) {
      container.innerHTML = renderAdminAnalyticsSectionHtml();
    }
  } catch (e) {
    showAlert("Tahlillarni yuklashda xatolik.");
  }
}

async function adminSetTab(tab) {
  haptic("light");
  adminView = tab;

  try {
    if (tab === "dashboard" || tab === "live") {
      const [liveData, historyData] = await Promise.all([
        adminApi("/api/admin/live-activity").catch(() => ({ stats: {}, active_users: [] })),
        adminApi("/api/admin/analytics/history", { period: adminData.analyticsPeriod || "7days" }).catch(() => ({ summary: {}, daily: [] }))
      ]);
      adminData.stats = liveData.stats || {};
      adminData.activeUsers = liveData.active_users || [];
      adminData.analyticsHistory = historyData || { summary: {}, daily: [] };
      startAdminLivePolling();
    } else {
      stopAdminLivePolling();
      if (tab === "students") {
        const data = await adminApi("/api/admin/students");
        adminData.students = data.students || [];
      } else if (tab === "lessons") {
        const data = await adminApi("/api/admin/modules");
        adminData.modules = data.modules || [];
      } else if (tab === "library") {
        try {
          const [filesData, resData] = await Promise.all([
            adminApi("/api/admin/library/all-files").catch(() => ({ files: [] })),
            adminApi("/api/admin/library-v2/resources").catch(() => ({ resources: [] }))
          ]);
          adminData.libraryFiles = filesData.files || [];
          adminData.libraryV2Resources = resData.resources || [];
        } catch (fe) {
          adminData.libraryFiles = [];
          adminData.libraryV2Resources = [];
        }
      } else if (tab === "support_cards") {
        try {
          const scData = await adminApi("/api/admin/support-cards/list");
          adminData.supportCards = scData.cards || [];
        } catch (e) {
          adminData.supportCards = [];
        }
      } else if (tab === "admins") {
        const data = await adminApi("/api/admin/admins");
        adminData.admins = data.admins || [];
      } else if (tab === "practice") {
        const data = await adminApi("/api/admin/practice/submissions", { status: adminData.practiceFilter || "" });
        adminData.practice = data.submissions || [];
      }
    }
    renderAdminPanel();
  } catch (error) {
    showAlert(error.message || "Ma'lumotlarni yuklashda xatolik.");
  }
}

function getTabDisplayLabel(tab) {
  switch (tab) {
    case "home": return "Bosh sahifa";
    case "lessons": return "Darslar";
    case "tasks": return "Kutubxona";
    case "chat": return "Chat";
    case "profile": return "Profil";
    default: return "Platforma";
  }
}

function renderAdminLiveUsersHtml(users) {
  if (!users || !users.length) {
    return `<div class="empty-box" style="padding:24px 0;">Ayni damda faol foydalanuvchilar mavjud emas.</div>`;
  }

  return users.map(u => {
    const isRecent = u.last_seen_at && (Date.now() - new Date(u.last_seen_at).getTime()) < 75000;
    const isWatching = u.status === "watching" || u.video_status === "watching";
    const isTesting = u.status === "testing";
    const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ") || "Noma'lum O'quvchi";
    const progressPercent = u.video_duration > 0 ? Math.min(100, Math.round((u.video_progress / u.video_duration) * 100)) : 0;

    return `
      <div class="live-user-card" onclick="openAdminStudentLiveDossier(${Number(u.user_id)})">
        <div class="live-user-header">
          <div class="live-user-name-wrap">
            <div class="live-user-avatar">
              ${(fullName[0] || "O").toUpperCase()}
              ${isRecent ? `<span class="live-pulse-dot avatar-dot"></span>` : ""}
            </div>
            <div class="live-user-details">
              <div class="live-user-name">${escapeHtml(fullName)}</div>
              <div class="live-user-handle">${u.phone ? escapeHtml(u.phone) : (u.username ? "@" + escapeHtml(u.username) : "ID: " + escapeHtml(u.telegram_id))}</div>
            </div>
          </div>
          <div class="live-user-badge-time">
            ${isRecent ? `<span style="color:#10b981; font-weight:700;">🟢 Online</span><br>` : ""}
            <span>${formatRelativeTime(u.last_seen_at)}</span>
          </div>
        </div>

        <div class="live-activity-box">
          ${isWatching ? `
            <div class="live-activity-title" style="color:#ef4444;">
              <span>▶️</span> Dars ko'rmoqda: <span style="color:var(--text-primary);">${escapeHtml(u.lesson_title || "Dars")}</span>
            </div>
            ${u.course_title ? `<div style="font-size:11px; color:var(--text-muted);">${escapeHtml(u.course_title)} ${u.module_title ? `→ ${escapeHtml(u.module_title)}` : ""}</div>` : ""}
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:var(--text-secondary); margin-top:2px;">
              <span>⏱️ ${formatSeconds(u.video_progress)} / ${formatSeconds(u.video_duration)}</span>
              <span>${progressPercent}%</span>
            </div>
            <div class="live-progress-track">
              <div class="live-progress-fill red" style="width:${progressPercent}%;"></div>
            </div>
          ` : (isTesting ? `
            <div class="live-activity-title" style="color:#8b5cf6;">
              <span>📝</span> Test ishlamoqda: <span style="color:var(--text-primary);">${escapeHtml(u.module_title || "Modul Testi")}</span>
            </div>
            <div style="font-size:11.5px; color:var(--text-secondary); display:flex; justify-content:space-between; align-items:center; margin-top:2px;">
              <span>Savol: <strong>${u.test_question_index || 1} / ${u.test_total_questions || 1}</strong></span>
              <span>${u.test_total_questions > 0 ? Math.round(((u.test_question_index || 1) / u.test_total_questions) * 100) : 0}%</span>
            </div>
            <div class="live-progress-track">
              <div class="live-progress-fill purple" style="width:${u.test_total_questions > 0 ? Math.round(((u.test_question_index || 1) / u.test_total_questions) * 100) : 0}%;"></div>
            </div>
          ` : `
            <div class="live-activity-title" style="color:var(--text-secondary);">
              <span>🌐</span> Sahifa: <span style="color:var(--text-primary);">${getTabDisplayLabel(u.current_tab)}</span>
            </div>
          `)}
        </div>
      </div>
    `;
  }).join("");
}

function renderAdminAnalyticsSectionHtml() {
  const h = adminData.analyticsHistory?.summary || {};
  const daily = adminData.analyticsHistory?.daily || [];
  const period = adminData.analyticsPeriod || "7days";

  // Calculate max for bar chart scaling
  let maxViews = 1;
  daily.forEach(d => {
    if (d.lesson_views > maxViews) maxViews = d.lesson_views;
    if (d.new_users > maxViews) maxViews = d.new_users;
  });

  return `
    <div class="analytics-chart-box">
      <div class="analytics-chart-header">
        <div style="font-weight:750; font-size:14px; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
          <span>📈</span> Tarixiy Tahlil
        </div>
        <div style="display:flex; gap:4px;">
          <button class="chip ${period === "today" ? "active" : ""}" style="padding:4px 8px; font-size:10.5px;" onclick="adminSetAnalyticsPeriod('today')">Bugun</button>
          <button class="chip ${period === "yesterday" ? "active" : ""}" style="padding:4px 8px; font-size:10.5px;" onclick="adminSetAnalyticsPeriod('yesterday')">Kecha</button>
          <button class="chip ${period === "7days" ? "active" : ""}" style="padding:4px 8px; font-size:10.5px;" onclick="adminSetAnalyticsPeriod('7days')">7 kun</button>
          <button class="chip ${period === "30days" ? "active" : ""}" style="padding:4px 8px; font-size:10.5px;" onclick="adminSetAnalyticsPeriod('30days')">30 kun</button>
        </div>
      </div>

      <!-- KURS SUMMARY CARDS -->
      <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:8px; margin-bottom:14px;">
        <div style="background:var(--bg-surface-elevated); padding:8px 10px; border-radius:8px; border:1px solid var(--border);">
          <div style="font-size:10.5px; color:var(--text-muted);">Yangi Ro'yxatdan O'tgan:</div>
          <div style="font-size:16px; font-weight:800; color:var(--text-primary);">${h.new_users || 0}</div>
        </div>
        <div style="background:var(--bg-surface-elevated); padding:8px 10px; border-radius:8px; border:1px solid var(--border);">
          <div style="font-size:10.5px; color:var(--text-muted);">Faol O'quvchilar:</div>
          <div style="font-size:16px; font-weight:800; color:#10b981;">${h.active_users || 0}</div>
        </div>
        <div style="background:var(--bg-surface-elevated); padding:8px 10px; border-radius:8px; border:1px solid var(--border);">
          <div style="font-size:10.5px; color:var(--text-muted);">Ko'rilgan Darslar:</div>
          <div style="font-size:16px; font-weight:800; color:var(--accent);">${h.lesson_views || 0}</div>
        </div>
        <div style="background:var(--bg-surface-elevated); padding:8px 10px; border-radius:8px; border:1px solid var(--border);">
          <div style="font-size:10.5px; color:var(--text-muted);">Topshirilgan Testlar:</div>
          <div style="font-size:16px; font-weight:800; color:#8b5cf6;">${h.test_attempts || 0} (${h.passed_tests || 0} o'tdi)</div>
        </div>
      </div>

      <!-- KUNLIK BAR CHART -->
      ${daily.length > 1 ? `
        <div style="font-size:11px; color:var(--text-muted); margin-bottom:6px; font-weight:700;">Kunlik dars ko'rishlar dinamikasi:</div>
        <div class="analytics-bars-container">
          ${daily.map(d => {
            const heightPct = Math.max(8, Math.round((d.lesson_views / maxViews) * 100));
            return `
              <div class="analytics-bar-col" title="${escapeHtml(d.date)}: ${d.lesson_views} dars, ${d.new_users} yangi user">
                <span class="analytics-bar-val">${d.lesson_views}</span>
                <div class="analytics-bar-stem" style="height:${heightPct}%;"></div>
                <span class="analytics-bar-lbl">${escapeHtml(d.label || d.date.slice(5))}</span>
              </div>
            `;
          }).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

// ASOSIY ADMIN DASHBOARD
function renderAdminDashboard() {
  const s = adminData.stats || {};
  const activeUsers = adminData.activeUsers || [];

  return `
    <div>
      <!-- 1. LIVE ANALYTICS CARDS (REAL-TIME METRICS) -->
      <div class="live-stats-row" id="admin-live-stats-row">
        <div class="live-stat-card online-highlight">
          <div class="live-stat-val">
            <span class="live-pulse-dot"></span>
            <span id="adm-live-online">${s.online_now || 0}</span>
          </div>
          <div class="live-stat-lbl">Hozir Online</div>
        </div>

        <div class="live-stat-card watching-highlight">
          <div class="live-stat-val">
            <span>▶️</span>
            <span id="adm-live-watching">${s.watching_now || 0}</span>
          </div>
          <div class="live-stat-lbl">Dars Ko'rayotganlar</div>
        </div>

        <div class="live-stat-card testing-highlight">
          <div class="live-stat-val">
            <span>📝</span>
            <span id="adm-live-testing">${s.testing_now || 0}</span>
          </div>
          <div class="live-stat-lbl">Test Yechayotganlar</div>
        </div>

        <div class="live-stat-card">
          <div class="live-stat-val">
            <span>👥</span>
            <span id="adm-live-total-users">${s.total_students || 0}</span>
          </div>
          <div class="live-stat-lbl">Jami O'quvchilar</div>
        </div>

        <div class="live-stat-card">
          <div class="live-stat-val">
            <span>📅</span>
            <span id="adm-live-today-active">${s.today_active || 0}</span>
          </div>
          <div class="live-stat-lbl">Bugun Faol Bo'lgan</div>
        </div>

        <div class="live-stat-card">
          <div class="live-stat-val">
            <span>🎬</span>
            <span id="adm-live-today-views">${s.today_lesson_views || 0}</span>
          </div>
          <div class="live-stat-lbl">Bugun Ko'rilgan Dars</div>
        </div>

        <div class="live-stat-card">
          <div class="live-stat-val">
            <span>🎯</span>
            <span id="adm-live-today-tests">${s.today_test_attempts || 0}</span>
          </div>
          <div class="live-stat-lbl">Bugun Test Topshirish</div>
        </div>

        <div class="live-stat-card" style="cursor:pointer;" onclick="openStudentsDetailList('active', 'Faol Obunachilar')">
          <div class="live-stat-val">
            <span>💳</span>
            <span>${s.paid_students || 0}</span>
          </div>
          <div class="live-stat-lbl">Faol Obunachilar →</div>
        </div>
      </div>

      <!-- 2. JONLI FAOLLIK LISTI (LIVE NOW USERS) -->
      <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:14px; margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div style="font-weight:750; font-size:14.5px; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
            <span>⚡</span> Hozirgi Faol O'quvchilar <span id="admin-live-users-count" style="color:var(--accent);">(${activeUsers.length})</span>
          </div>
          <div style="font-size:11px; color:#10b981; font-weight:700; display:flex; align-items:center; gap:4px;">
            <span class="live-pulse-dot"></span> Jonli efir
          </div>
        </div>

        <div id="admin-live-users-rows">
          ${renderAdminLiveUsersHtml(activeUsers)}
        </div>
      </div>

      <!-- 3. TARIXIY TAHLILLAR VA GRAFIKLAR -->
      <div id="admin-analytics-section">
        ${renderAdminAnalyticsSectionHtml()}
      </div>

      <!-- 4. QO'SHIMCHA OBUNA VA DARS STATISTIKASI -->
      <div style="margin-top:16px;">
        <div class="admin-section-title" style="margin-bottom:10px;">Obunalar & Murojaatlar</div>
        <div class="admin-stats-grid">
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
          <div class="admin-stat-card" style="cursor:pointer;" onclick="openStudentsDetailList('expired', 'Muddati Tugaganlar')">
            <div class="admin-stat-icon">⏳</div>
            <div class="admin-stat-value">${s.unpaid_students || 0}</div>
            <div class="admin-stat-label">Muddati Tugaganlar →</div>
          </div>
          <div class="admin-stat-card">
            <div class="admin-stat-icon">🎬</div>
            <div class="admin-stat-value">${s.total_lessons || 0}</div>
            <div class="admin-stat-label">Jami Darslar</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function openAdminStudentLiveDossier(userId) {
  try {
    haptic("light");
    const data = await adminApi(`/api/admin/student/${Number(userId)}/live-dossier`);
    const st = data.student;
    if (!st) return showAlert("O'quvchi ma'lumotlari topilmadi.");

    const act = st.activity || {};
    const isOnline = act.last_seen_at && (Date.now() - new Date(act.last_seen_at).getTime()) < 75000;
    const fullName = [st.first_name, st.last_name].filter(Boolean).join(" ") || "Noma'lum O'quvchi";

    currentView = {
      html: `
        <div class="page">
          <div class="back-btn" onclick="adminSetTab('dashboard')">← Dashboardga qaytish</div>
          <div class="page-title" style="margin-bottom:6px;">👨‍🎓 O'quvchi Dosyesi</div>

          <div class="card" style="margin-bottom:14px; padding:16px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
              <div>
                <div style="font-size:18px; font-weight:800; color:var(--text-primary); margin-bottom:2px;">
                  ${escapeHtml(fullName)}
                </div>
                <div style="font-size:12.5px; color:var(--text-secondary);">
                  ${st.username ? "@" + escapeHtml(st.username) : "ID: " + escapeHtml(st.telegram_id)}
                </div>
              </div>
              <div class="tag ${isOnline ? "ok" : "warning"}" style="font-size:11px;">
                ${isOnline ? "🟢 Hozir Online" : "⚪ Offline"}
              </div>
            </div>

            <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:8px; margin-bottom:12px;">
              <div style="background:var(--bg-surface-elevated); padding:8px 10px; border-radius:8px; border:1px solid var(--border);">
                <div style="font-size:11px; color:var(--text-muted);">Telefon:</div>
                <div style="font-size:12.5px; font-weight:700;">${st.phone ? escapeHtml(st.phone) : "Kiritilmagan"}</div>
              </div>
              <div style="background:var(--bg-surface-elevated); padding:8px 10px; border-radius:8px; border:1px solid var(--border);">
                <div style="font-size:11px; color:var(--text-muted);">Ro'yxatdan o'tgan:</div>
                <div style="font-size:12.5px; font-weight:700;">${fmtDate(st.created_at)}</div>
              </div>
              <div style="background:var(--bg-surface-elevated); padding:8px 10px; border-radius:8px; border:1px solid var(--border);">
                <div style="font-size:11px; color:var(--text-muted);">Kursga kirish:</div>
                <div style="font-size:12.5px; font-weight:700; color:${st.access_until && new Date(st.access_until) > new Date() ? "var(--success)" : "var(--danger)"};">
                  ${st.access_until && new Date(st.access_until) > new Date() ? fmtDate(st.access_until) : "Muddati tugagan"}
                </div>
              </div>
              <div style="background:var(--bg-surface-elevated); padding:8px 10px; border-radius:8px; border:1px solid var(--border);">
                <div style="font-size:11px; color:var(--text-muted);">Ko'rilgan darslar:</div>
                <div style="font-size:12.5px; font-weight:700; color:var(--accent);">
                  ${st.watched_lessons} / ${st.total_lessons}
                </div>
              </div>
            </div>

            <!-- HOZIRGI JONLI FAOLLIGI -->
            <div style="background:var(--bg-secondary); border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px; margin-bottom:12px;">
              <div style="font-size:12px; font-weight:750; color:var(--text-primary); margin-bottom:6px; display:flex; align-items:center; gap:6px;">
                <span>⚡</span> Hozirgi Faollik Holati:
              </div>
              <div style="font-size:12.5px; color:var(--text-secondary); line-height:1.5;">
                Holat: <strong style="color:var(--text-primary);">${act.status === "watching" ? "▶️ Dars ko'rmoqda" : (act.status === "testing" ? "📝 Test yechmoqda" : "🌐 Platformada")}</strong><br>
                ${act.lesson_title ? `Dars: <strong>${escapeHtml(act.lesson_title)}</strong> (${escapeHtml(act.course_title || '')})<br>` : ""}
                ${act.video_progress ? `Video vaqti: <strong>${formatSeconds(act.video_progress)} / ${formatSeconds(act.video_duration)}</strong> (${Math.round((act.video_progress / (act.video_duration || 1)) * 100)}%)<br>` : ""}
                ${act.test_total_questions ? `Test: <strong>Savol ${act.test_question_index} / ${act.test_total_questions}</strong><br>` : ""}
                Oxirgi signal: <strong>${formatRelativeTime(act.last_seen_at)}</strong>
              </div>
            </div>

            <!-- TOPSHIRILGAN TESTLAR -->
            ${st.tests && st.tests.length ? `
              <div style="font-size:12.5px; font-weight:750; margin-bottom:8px; color:var(--text-secondary);">
                Topshirilgan test natijalari:
              </div>
              ${st.tests.map(t => `
                <div style="background:var(--bg-surface-elevated); border:1px solid var(--border); border-radius:6px; padding:8px 10px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <div style="font-size:12px; font-weight:700;">${escapeHtml(t.module_title || 'Modul')}</div>
                    <div style="font-size:11px; color:var(--text-muted);">${fmtDate(t.attempted_at)}</div>
                  </div>
                  <div class="tag ${t.passed ? "ok" : "warning"}" style="font-size:11px;">
                    ${t.score}% ${t.passed ? "✅ O'tdi" : "❌ O'tmadi"}
                  </div>
                </div>
              `).join("")}
            ` : ""}

            <div style="margin-top:14px; display:flex; gap:8px;">
              <button class="btn" style="flex:1; margin-bottom:0;" onclick="openAdminStudentModal(${Number(st.id)})">
                ✏️ Ruxsatni boshqarish
              </button>
            </div>
          </div>
        </div>
      `
    };
    render();
  } catch (err) {
    showAlert(err.message || "O'quvchi ma'lumotlarini yuklashda xato.");
  }
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

  const isRevoking = new Date(dateVal) <= new Date();

  const doSave = async () => {
    try {
      haptic("medium");
      await adminApi(`/api/admin/student/${Number(id)}/access`, {
        access_until: dateVal
      });
      showToast(isRevoking ? "Kirish huquqi cheklandi, o'quvchi boshlang'ich holatga qaytarildi!" : "Kirish muddati muvaffaqiyatli saqlandi!");
      adminSetTab("students");
    } catch (error) {
      showAlert(error.message || "Kirish muddatini saqlashda xato.");
    }
  };

  if (isRevoking) {
    showConfirm(
      "Kirish huquqi cheklansinmi?",
      "Diqqat: bu o'quvchining barcha darslar progressi, test natijalari va alohida modul ruxsatlari butunlay o'chiriladi — u qayta kirganida xuddi yangi (hech qachon to'lamagan) o'quvchi kabi boshlaydi. Bu amalni ortga qaytarib bo'lmaydi.",
      "Ha, cheklash",
      doSave
    );
  } else {
    await doSave();
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
function openAdminLessonEdit(lessonId) {
  return openEditLessonView(lessonId);
}

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
          <div class="section-title" style="margin-top:24px;">📁 Kerakli Manbalar va Fayllar (${files.length})</div>
          <div class="lesson-files">
            ${files.length ? files.map(f => `
              <div class="lesson-file-row">
                <div class="lesson-file-header">
                  <div class="lesson-file-title-wrap">
                    <span style="font-size:18px;">${getResourceIcon(f.file_name)}</span>
                    <span class="lesson-file-title-text">${escapeHtml(f.file_name)}</span>
                  </div>
                  <div style="display:flex; gap:6px; align-items:center;">
                    <button class="admin-small-btn" onclick="openEditLessonFileModal(${Number(f.id)}, '${escapeJsString(f.file_name)}', '${escapeJsString(f.file_url)}', ${Number(lessonId)})" title="Tahrirlash">
                      ✏️ Tahrirlash
                    </button>
                    <button class="btn danger" style="width:auto; margin:0; padding:6px 10px; font-size:12px;" onclick="deleteLessonFile(${Number(f.id)}, ${Number(lessonId)})" title="O'chirish">
                      🗑️
                    </button>
                  </div>
                </div>
                <div class="lesson-file-link-wrap">
                  <a href="${escapeHtml(f.file_url)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent); text-decoration:underline; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1;">
                    ${escapeHtml(f.file_url)}
                  </a>
                  <div style="display:flex; gap:6px; flex-shrink:0;">
                    <button class="admin-small-btn" style="padding:4px 8px; font-size:11px;" onclick="window.open('${escapeJsString(f.file_url)}', '_blank')">
                      🔗 Sinab ko'rish
                    </button>
                    <button class="admin-small-btn" style="padding:4px 8px; font-size:11px;" onclick="copyDonateCard('${escapeJsString(f.file_url)}', 'Havola nusxalandi!')">
                      📋 Nusxa
                    </button>
                  </div>
                </div>
              </div>
            `).join("") : `<div class="empty-box" style="margin-bottom:12px;">Hozircha biriktirilgan fayllar yo'q.</div>`}
          </div>

          <div class="apple-registration-form" style="background:var(--bg-surface); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border); margin-top:14px;">
            <div style="font-weight:700; font-size:13.5px; margin-bottom:10px; color:var(--accent);">
              ➕ Yangi fayl / manba biriktirish:
            </div>
            <input id="new-file-name" class="apple-input" type="text" placeholder="Fayl nomi (masalan: 2-dars_material.rar)" style="margin-bottom:8px;">
            <input id="new-file-url" class="apple-input" type="url" placeholder="Yuklab olish linki (Google Drive, Dropbox...)" style="margin-bottom:10px;">
            <button id="add-file-btn" class="btn secondary" style="margin:0;" onclick="submitAddLessonFile(${Number(lessonId)})">
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
  const nameInput = document.getElementById("new-file-name");
  const urlInput = document.getElementById("new-file-url");
  const btn = document.getElementById("add-file-btn");
  const name = nameInput?.value.trim();
  let url = urlInput?.value.trim();
  if (!name || !url) return showAlert("Fayl nomi va yuklab olish linki kiritilishi shart!");

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  if (btn) btn.classList.add("btn-loading");

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
  } finally {
    if (btn) btn.classList.remove("btn-loading");
  }
}

function openEditLessonFileModal(fileId, fileName, fileUrl, lessonId) {
  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="openEditLessonView(${Number(lessonId)})">← Ortga qaytish</div>
        <div class="page-title">Faylni tahrirlash</div>

        <div class="admin-form">
          <div class="apple-field">
            <label>Fayl nomi *</label>
            <input id="edit-fn-name" class="apple-input" type="text" value="${escapeHtml(fileName)}">
          </div>

          <div class="apple-field">
            <label>Yuklab olish linki *</label>
            <input id="edit-fn-url" class="apple-input" type="url" value="${escapeHtml(fileUrl)}">
          </div>

          <div style="margin-bottom:14px;">
            <button type="button" class="btn secondary" style="margin:0; padding:10px;" onclick="testModalUrl('edit-fn-url')">
              🔗 Havolani brauzerda sinab ko'rish
            </button>
          </div>

          <button id="save-fn-btn" class="btn" onclick="submitUpdateLessonFile(${Number(fileId)}, ${Number(lessonId)})">
            💾 O'zgarishlarni saqlash
          </button>
        </div>
      </div>
    `
  };
  render();
}

function testModalUrl(inputId) {
  let url = document.getElementById(inputId)?.value.trim();
  if (!url) return showAlert("Link kiritilmagan!");
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  window.open(url, "_blank");
}

async function submitUpdateLessonFile(fileId, lessonId) {
  const name = document.getElementById("edit-fn-name")?.value.trim();
  let url = document.getElementById("edit-fn-url")?.value.trim();
  if (!name || !url) return showAlert("Fayl nomi va linki kiritilishi shart!");
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  const btn = document.getElementById("save-fn-btn");
  if (btn) btn.classList.add("btn-loading");

  try {
    haptic("medium");
    await adminApi(`/api/admin/file/${Number(fileId)}/update`, {
      file_name: name,
      file_url: url
    });
    showToast("Material muvaffaqiyatli yangilandi!");
    openEditLessonView(lessonId);
  } catch (error) {
    showAlert(error.message || "Materialni yangilashda xato.");
  } finally {
    if (btn) btn.classList.remove("btn-loading");
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

// ======================================================
// TALAB 4: ADMIN CENTRAL KUTUBXONA BOSHQARUVI
// ======================================================

function setAdminLibraryTab(subTab, e) {
  if (e) {
    if (typeof e.preventDefault === "function") e.preventDefault();
    if (typeof e.stopPropagation === "function") e.stopPropagation();
  }
  haptic("light");
  adminData.librarySubTab = subTab;

  const contentEl = document.getElementById("admin-library-subtab-content");
  const chipsEl = document.getElementById("admin-library-subtab-chips");
  if (contentEl && chipsEl) {
    chipsEl.querySelectorAll(".chip").forEach(ch => {
      ch.classList.toggle("active", ch.getAttribute("data-subtab") === subTab);
    });
    contentEl.innerHTML = renderAdminLibrarySubTabContent(subTab);
  } else {
    const savedScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    renderAdminPanel();
    if (savedScroll > 0) {
      window.scrollTo({ top: savedScroll, left: 0, behavior: "instant" });
    }
  }
}

function renderAdminLibrarySubTabContent(subTab) {
  const files = adminData.libraryFiles || [];
  const openRes = state.open_resources || [];
  const showcases = state.showcases || [];
  const materials = state.materials || [];
  const search = (adminData.libraryFileSearch || "").toLowerCase().trim();

  const filteredFiles = search ? files.filter(f =>
    (f.file_name && f.file_name.toLowerCase().includes(search)) ||
    (f.lesson_title && f.lesson_title.toLowerCase().includes(search)) ||
    (f.course_title && f.course_title.toLowerCase().includes(search))
  ) : files;

  if (subTab === "resources_v2") return renderAdminLibraryV2Resources();
  if (subTab === "sections") return renderAdminLibrarySections();
  if (subTab === "categories") return renderAdminLibraryCategories();
  if (subTab === "support") return renderAdminSupportSettings();
  if (subTab === "files") return renderAdminLibraryFiles(filteredFiles, search);
  if (subTab === "open_res") return renderAdminLibraryOpenRes(openRes);
  if (subTab === "showcases") return renderAdminLibraryShowcases(showcases);
  if (subTab === "materials") return renderAdminLibraryMaterials(materials);
  return renderAdminLibraryV2Resources();
}

function renderAdminLibrary() {
  const subTab = adminData.librarySubTab || "resources_v2";
  const v2Res = adminData.libraryV2Resources || libraryV2Resources || [];
  const files = adminData.libraryFiles || [];
  const showcases = state.showcases || [];

  return `
    <div>
      <div class="category-chips" id="admin-library-subtab-chips" style="display:flex; gap:8px; overflow-x:auto; margin-bottom:16px; padding-bottom:4px;">
        <div class="chip ${subTab === "resources_v2" ? "active" : ""}" data-subtab="resources_v2" onclick="setAdminLibraryTab('resources_v2', event)">
          📚 Resurslar (${v2Res.length})
        </div>
        <div class="chip ${subTab === "sections" ? "active" : ""}" data-subtab="sections" onclick="setAdminLibraryTab('sections', event)">
          🗂️ Bo‘limlar (${(librarySections || []).length})
        </div>
        <div class="chip ${subTab === "categories" ? "active" : ""}" data-subtab="categories" onclick="setAdminLibraryTab('categories', event)">
          🏷️ Kategoriyalar (${(libraryV2Categories || []).length})
        </div>
        <div class="chip ${subTab === "support" ? "active" : ""}" data-subtab="support" onclick="setAdminLibraryTab('support', event)">
          💳 Qo‘llab-quvvatlash
        </div>
        <div class="chip ${subTab === "files" ? "active" : ""}" data-subtab="files" onclick="setAdminLibraryTab('files', event)">
          📁 Dars Fayllari (${files.length})
        </div>
        <div class="chip ${subTab === "showcases" ? "active" : ""}" data-subtab="showcases" onclick="setAdminLibraryTab('showcases', event)">
          🎓 Natijalar (PDF) (${showcases.length})
        </div>
      </div>

      <div id="admin-library-subtab-content">
        ${renderAdminLibrarySubTabContent(subTab)}
      </div>
    </div>
  `;
}

function renderAdminLibraryV2Resources() {
  const allRes = adminData.libraryV2Resources || libraryV2Resources || [];
  const search = (adminData.libraryV2Search || "").toLowerCase().trim();

  const filtered = allRes.filter(r => {
    return !search ||
      (r.title && r.title.toLowerCase().includes(search)) ||
      (r.category && r.category.toLowerCase().includes(search)) ||
      (r.description && r.description.toLowerCase().includes(search)) ||
      (r.author && r.author.toLowerCase().includes(search)) ||
      (r.section_slug && r.section_slug.toLowerCase().includes(search));
  });

  return `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; gap:8px;">
        <div class="admin-section-title" style="margin-bottom:0;">
          Barcha Resurslar (${filtered.length}/${allRes.length})
        </div>
        <div style="display:flex; gap:6px;">
          <button class="admin-small-btn" onclick="adminSetTab('library')" title="Yangilash">🔄</button>
          <button class="admin-small-btn" onclick="openAddLibraryV2ResourceModal()">
            ➕ Yangi Resurs
          </button>
        </div>
      </div>

      <div style="margin-bottom:12px;">
        <input id="admin-library-v2-search-input"
               class="apple-input"
               type="text"
               placeholder="🔍 Resurs nomi, bo'lim, kategoriya yoki muallif bo'yicha qidirish..."
               value="${escapeHtml(search)}"
               oninput="onAdminLibraryV2Search(this.value)">
      </div>

      <div id="admin-library-v2-rows">
        ${renderAdminLibraryV2RowsHtml(filtered)}
      </div>
    </div>
  `;
}

function renderAdminLibraryV2RowsHtml(list) {
  if (!list.length) {
    return `<div class="empty-box">Resurslar topilmadi.</div>`;
  }
  return list.map(r => {
    const badge = getLibraryTypeBadge(r.type);
    const isPublished = r.status === "published";
    const isFeatured = Boolean(r.is_featured);
    const sectionName = r.section_slug ? r.section_slug.toUpperCase() : badge.label;

    return `
      <div class="lesson-file-row" style="margin-bottom:10px;">
        <div class="lesson-file-header">
          <div class="lesson-file-title-wrap">
            <span style="font-size:22px;">${badge.icon}</span>
            <div>
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px; flex-wrap:wrap;">
                <span class="tag ${badge.className}" style="font-size:10px; padding:2px 6px;">${sectionName}</span>
                <span class="tag ${isPublished ? "passed" : "warning"}"
                      style="font-size:10px; cursor:pointer;"
                      onclick="toggleAdminLibraryV2Status(${Number(r.id)}, '${isPublished ? "draft" : "published"}')"
                      title="Statusni o'zgartirish">
                  ${isPublished ? "🟢 Ochiq" : "🔒 Qoralama"}
                </span>
                <span class="tag ${isFeatured ? "ok" : "subtle"}"
                      style="font-size:10px; cursor:pointer;"
                      onclick="toggleAdminLibraryV2Recommend(${Number(r.id)})"
                      title="Tavsiya holatini almashtirish">
                  ${isFeatured ? "⭐ Tavsiya" : "☆ Oddiy"}
                </span>
                <span style="font-size:11px; color:var(--text-muted);">👁️ ${r.view_count || 0}</span>
              </div>
              <div class="lesson-file-title-text" style="font-size:13.5px; font-weight:750;">${escapeHtml(r.title)}</div>
              <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">
                📁 ${escapeHtml(r.category || "Boshqa")} ${r.author ? `· 👤 ${escapeHtml(r.author)}` : ""} ${r.version ? `· 🏷️ ${escapeHtml(r.version)}` : ""}
              </div>
            </div>
          </div>
          <div style="display:flex; gap:6px; align-items:center;">
            <button class="admin-small-btn" onclick="openEditLibraryV2ResourceModal(${Number(r.id)})" title="Tahrirlash">
              ✏️
            </button>
            <button class="btn danger" style="width:auto; margin:0; padding:6px 10px; font-size:12px;" onclick="deleteAdminLibraryV2ResourceConfirm(${Number(r.id)})" title="O'chirish">
              🗑️
            </button>
          </div>
        </div>

        ${r.content_url ? `
          <div class="lesson-file-link-wrap">
            <a href="${escapeHtml(r.content_url)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent); text-decoration:underline; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1; font-size:12px;">
              ${escapeHtml(r.content_url)}
            </a>
            <div style="display:flex; gap:6px; flex-shrink:0;">
              <button class="admin-small-btn" style="padding:3px 7px; font-size:11px;" onclick="openLibraryV2ResourceDetail(${Number(r.id)})">
                👁️ Ko'rish
              </button>
              <button class="admin-small-btn" style="padding:3px 7px; font-size:11px;" onclick="copyDonateCard('${escapeJsString(r.content_url)}', 'Havola nusxalandi!')">
                📋 Nusxa
              </button>
            </div>
          </div>
        ` : ""}
      </div>
    `;
  }).join("");
}

function onAdminLibraryV2Search(val) {
  adminData.libraryV2Search = val;
  const container = document.getElementById("admin-library-v2-rows");
  if (container) {
    const allRes = adminData.libraryV2Resources || libraryV2Resources || [];
    const search = (adminData.libraryV2Search || "").toLowerCase().trim();
    const filtered = allRes.filter(r =>
      !search ||
      (r.title && r.title.toLowerCase().includes(search)) ||
      (r.category && r.category.toLowerCase().includes(search)) ||
      (r.description && r.description.toLowerCase().includes(search)) ||
      (r.author && r.author.toLowerCase().includes(search)) ||
      (r.section_slug && r.section_slug.toLowerCase().includes(search))
    );
    container.innerHTML = renderAdminLibraryV2RowsHtml(filtered);
  }
}

async function toggleAdminLibraryV2Status(resId, newStatus) {
  haptic("light");
  try {
    const res = await adminApi(`/api/admin/library-v2/resource/${Number(resId)}/status`, { status: newStatus });
    showToast(res.message || "Status yangilandi!");
    const item = (adminData.libraryV2Resources || []).find(r => Number(r.id) === Number(resId));
    if (item) item.status = newStatus;
    const itemV2 = (libraryV2Resources || []).find(r => Number(r.id) === Number(resId));
    if (itemV2) itemV2.status = newStatus;
    adminSetTab("library");
  } catch (err) {
    showAlert(err.message || "Statusni o'zgartirishda xatolik.");
  }
}

async function toggleAdminLibraryV2Recommend(resId) {
  haptic("light");
  try {
    const res = await adminApi(`/api/admin/library-v2/resource/${Number(resId)}/toggle-recommend`);
    showToast(res.is_featured ? "⭐ Tavsiya etilganlarga qo'shildi!" : "Tavsiyalardan olindi.");
    await loadLibraryV2Data(true);
    adminSetTab("library");
  } catch (err) {
    showAlert(err.message || "Xatolik yuz berdi.");
  }
}

function deleteAdminLibraryV2ResourceConfirm(resId) {
  showConfirm(
    "Resursni o'chirish",
    "Ushbu resursni kutubxonadan butunlay o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.",
    "Ha, o'chirish",
    async () => {
      const res = await adminApi(`/api/admin/library-v2/resource/${Number(resId)}/delete`);
      showToast(res.message || "Resurs o'chirildi!");
      if (adminData.libraryV2Resources) {
        adminData.libraryV2Resources = adminData.libraryV2Resources.filter(r => Number(r.id) !== Number(resId));
      }
      libraryV2Resources = libraryV2Resources.filter(r => Number(r.id) !== Number(resId));
      adminSetTab("library");
    }
  );
}

// ------------------------------------------------------
// ADMIN SECTION MANAGEMENT (Bo'limlar)
// ------------------------------------------------------

function renderAdminLibrarySections() {
  const sections = librarySections || [];

  return `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <div>
          <div class="admin-section-title" style="margin-bottom:2px;">Kutubxona Bo‘limlari (${sections.length})</div>
          <div style="font-size:12px; color:var(--text-secondary);">Asosiy ekrandagi 4 ta plitka va dinamik bo'limlar arxitekturasi</div>
        </div>
        <button class="admin-small-btn" onclick="openAddSectionModal()">
          ➕ Yangi Bo'lim
        </button>
      </div>

      <div class="admin-sections-list">
        ${sections.map(s => `
          <div class="lesson-file-row" style="margin-bottom:10px;">
            <div class="lesson-file-header">
              <div class="lesson-file-title-wrap">
                <span style="font-size:26px;">${s.icon || "📁"}</span>
                <div>
                  <div style="display:flex; align-items:center; gap:6px;">
                    <span style="font-size:14px; font-weight:800;">${escapeHtml(s.name)}</span>
                    <span class="tag ${s.is_active ? "ok" : "warning"}"
                          style="font-size:10px; cursor:pointer;"
                          onclick="toggleAdminSectionActive(${Number(s.id)}, ${Boolean(s.is_active)})">
                      ${s.is_active ? "👁️ Ko'rinadigan" : "🔒 Yashirin"}
                    </span>
                    <span style="font-size:11px; color:var(--text-muted);">Slug: <code>${escapeHtml(s.slug)}</code></span>
                  </div>
                  <div style="font-size:11.5px; color:var(--text-secondary); margin-top:3px;">
                    ${escapeHtml(s.description || "Tavsif mavjud emas.")}
                  </div>
                </div>
              </div>
              <div style="display:flex; gap:6px; align-items:center;">
                <button class="admin-small-btn" onclick="openEditSectionModal(${Number(s.id)})" title="Tahrirlash">
                  ✏️
                </button>
                <button class="btn danger" style="width:auto; margin:0; padding:6px 10px; font-size:12px;" onclick="deleteAdminSectionConfirm(${Number(s.id)})" title="O'chirish">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function openAddSectionModal() {
  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="adminSetTab('library')">← Ortga qaytish</div>
        <div class="page-title">Yangi Bo'lim Qo'shish</div>

        <div class="admin-form">
          <div class="apple-field">
            <label>Bo'lim nomi * (Masalan: Standartlar)</label>
            <input id="sec-name" class="apple-input" type="text" placeholder="Kitoblar, Manbalar...">
          </div>
          <div class="apple-field">
            <label>Slug (inglizcha kalit so'z) * (Masalan: standards)</label>
            <input id="sec-slug" class="apple-input" type="text" placeholder="standards, plugins...">
          </div>
          <div class="apple-field">
            <label>Ikonka (Emoji) * (Masalan: 📐)</label>
            <input id="sec-icon" class="apple-input" type="text" placeholder="📐, 📚, 📦...">
          </div>
          <div class="apple-field">
            <label>Qisqa tavsif</label>
            <textarea id="sec-desc" class="apple-input apple-textarea" placeholder="Ushbu bo'lim haqida o'quvchilarga ko'rinadigan tavsif..."></textarea>
          </div>
          <div class="apple-field">
            <label>Tartib raqami (Order Index)</label>
            <input id="sec-order" class="apple-input" type="number" value="${(librarySections.length + 1)}">
          </div>

          <button class="btn" style="margin-top:16px;" onclick="submitCreateSection()">
            💾 Bo'limni Saqlash
          </button>
        </div>
      </div>
    `
  };
  render();
}

async function submitCreateSection() {
  const name = document.getElementById("sec-name")?.value.trim();
  const slug = document.getElementById("sec-slug")?.value.trim().toLowerCase();
  const icon = document.getElementById("sec-icon")?.value.trim() || "📁";
  const desc = document.getElementById("sec-desc")?.value.trim();
  const order = parseInt(document.getElementById("sec-order")?.value || "1", 10);

  if (!name || !slug) return showAlert("Nomi va Slug majburiy!");

  try {
    haptic("medium");
    await adminApi("/api/admin/library/section/add", {
      name, slug, icon, description: desc, order_index: order
    });
    showToast("Yangi bo'lim muvaffaqiyatli yaratildi!");
    await loadLibraryV2Data(true);
    adminSetTab("library");
  } catch (err) {
    showAlert(err.message || "Xatolik yuz berdi.");
  }
}

function openEditSectionModal(secId) {
  const sec = (librarySections || []).find(s => Number(s.id) === Number(secId));
  if (!sec) return showAlert("Bo'lim topilmadi.");

  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="adminSetTab('library')">← Ortga qaytish</div>
        <div class="page-title">Bo'limni Tahrirlash</div>

        <div class="admin-form">
          <div class="apple-field">
            <label>Bo'lim nomi *</label>
            <input id="esec-name" class="apple-input" type="text" value="${escapeHtml(sec.name)}">
          </div>
          <div class="apple-field">
            <label>Slug</label>
            <input id="esec-slug" class="apple-input" type="text" value="${escapeHtml(sec.slug)}">
          </div>
          <div class="apple-field">
            <label>Ikonka</label>
            <input id="esec-icon" class="apple-input" type="text" value="${escapeHtml(sec.icon || "📁")}">
          </div>
          <div class="apple-field">
            <label>Tavsif</label>
            <textarea id="esec-desc" class="apple-input apple-textarea">${escapeHtml(sec.description || "")}</textarea>
          </div>
          <div class="apple-field">
            <label>Tartib raqami</label>
            <input id="esec-order" class="apple-input" type="number" value="${Number(sec.order_index || 1)}">
          </div>

          <button class="btn" style="margin-top:16px;" onclick="submitUpdateSection(${Number(sec.id)})">
            💾 O'zgarishlarni Saqlash
          </button>
        </div>
      </div>
    `
  };
  render();
}

async function submitUpdateSection(secId) {
  const name = document.getElementById("esec-name")?.value.trim();
  const slug = document.getElementById("esec-slug")?.value.trim().toLowerCase();
  const icon = document.getElementById("esec-icon")?.value.trim();
  const desc = document.getElementById("esec-desc")?.value.trim();
  const order = parseInt(document.getElementById("esec-order")?.value || "1", 10);

  if (!name || !slug) return showAlert("Nomi va Slug majburiy!");

  try {
    haptic("medium");
    await adminApi(`/api/admin/library/section/${Number(secId)}/update`, {
      name, slug, icon, description: desc, order_index: order
    });
    showToast("Bo'lim yangilandi!");
    await loadLibraryV2Data(true);
    adminSetTab("library");
  } catch (err) {
    showAlert(err.message || "Xatolik yuz berdi.");
  }
}

async function toggleAdminSectionActive(secId, currentActive) {
  haptic("light");
  try {
    await adminApi(`/api/admin/library/section/${Number(secId)}/update`, {
      is_active: !currentActive
    });
    showToast("Bo'lim holati yangilandi!");
    await loadLibraryV2Data(true);
    adminSetTab("library");
  } catch (err) {
    showAlert(err.message || "Xatolik yuz berdi.");
  }
}

function deleteAdminSectionConfirm(secId) {
  showConfirm(
    "Bo'limni o'chirish",
    "Ushbu bo'limni o'chirmoqchimisiz? Bo'limga tegishli resurslar saqlanib qoladi.",
    "Ha, o'chirish",
    async () => {
      await adminApi(`/api/admin/library/section/${Number(secId)}/delete`);
      showToast("Bo'lim o'chirildi.");
      await loadLibraryV2Data(true);
      adminSetTab("library");
    }
  );
}

// ------------------------------------------------------
// ADMIN CATEGORY MANAGEMENT (Kategoriyalar)
// ------------------------------------------------------

function renderAdminLibraryCategories() {
  const cats = libraryV2Categories || [];

  return `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <div>
          <div class="admin-section-title" style="margin-bottom:2px;">Kategoriyalar (${cats.length})</div>
          <div style="font-size:12px; color:var(--text-secondary);">Har bir bo'lim uchun ichki saralash kategoriyalari</div>
        </div>
      </div>

      <!-- YANGI KATEGORIYA QO'SHISH FORMASI -->
      <div class="card" style="padding:14px; margin-bottom:16px; background:var(--bg-surface-elevated);">
        <div style="font-size:13px; font-weight:750; margin-bottom:10px;">➕ Yangi Kategoriya Qo'shish</div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:8px;">
          <div>
            <label style="font-size:11px; color:var(--text-secondary);">Tegishli Bo'lim</label>
            <select id="new-cat-sec" class="apple-input">
              <option value="books">📚 Kitoblar</option>
              <option value="sources">📦 Manbalar</option>
              <option value="tests">✓ Testlar</option>
              <option value="materials">🧱 Materiallar</option>
            </select>
          </div>
          <div>
            <label style="font-size:11px; color:var(--text-secondary);">Kategoriya Nomi</label>
            <input id="new-cat-name" class="apple-input" type="text" placeholder="Masalan: Arxitektura, Mebel...">
          </div>
        </div>
        <button class="btn" style="margin-top:6px;" onclick="submitCreateCategory()">
          Kategoriyani Qo'shish
        </button>
      </div>

      <!-- KATEGORIYALAR JADVALI -->
      <div class="admin-cats-list">
        ${cats.length ? cats.map(c => `
          <div class="lesson-file-row" style="margin-bottom:8px;">
            <div class="lesson-file-header">
              <div class="lesson-file-title-wrap">
                <span style="font-size:18px;">${c.icon || "🏷️"}</span>
                <div>
                  <div style="font-size:13.5px; font-weight:750;">${escapeHtml(c.name)}</div>
                  <div style="font-size:11px; color:var(--text-muted);">
                    Bo'lim: <strong>${escapeHtml(c.section_slug || "Umumiy")}</strong>
                  </div>
                </div>
              </div>
              <button class="btn danger" style="width:auto; margin:0; padding:4px 8px; font-size:11px;" onclick="deleteAdminCategoryConfirm(${Number(c.id)})">
                🗑️
              </button>
            </div>
          </div>
        `).join("") : `<div class="empty-box">Kategoriyalar mavjud emas.</div>`}
      </div>
    </div>
  `;
}

async function submitCreateCategory() {
  const sectionSlug = document.getElementById("new-cat-sec")?.value;
  const name = document.getElementById("new-cat-name")?.value.trim();

  if (!name) return showAlert("Kategoriya nomini kiriting!");

  try {
    haptic("medium");
    await adminApi("/api/admin/library-v2/category/add", {
      name, section_slug: sectionSlug, icon: "🏷️"
    });
    showToast("Kategoriya muvaffaqiyatli qo'shildi!");
    await loadLibraryV2Data(true);
    adminSetTab("library");
  } catch (err) {
    showAlert(err.message || "Xatolik yuz berdi.");
  }
}

function deleteAdminCategoryConfirm(catId) {
  showConfirm(
    "Kategoriyani o'chirish",
    "Ushbu kategoriyani o'chirmoqchimisiz?",
    "O'chirish",
    async () => {
      await adminApi(`/api/admin/library-v2/category/${Number(catId)}/delete`);
      showToast("Kategoriya o'chirildi.");
      await loadLibraryV2Data(true);
      adminSetTab("library");
    }
  );
}

// ------------------------------------------------------
// ADMIN SUPPORT / DONATION SETTINGS (Qo'llab-quvvatlash)
// ------------------------------------------------------

function renderAdminSupportSettings() {
  const sets = state.settings || {};
  const currentCard = sets.donate_card_number || sets.support_card_number || "8600 5304 1234 5678";
  const firstName = sets.support_first_name || "";
  const lastName = sets.support_last_name || "";
  const holder = sets.donate_card_holder || sets.support_card_holder || "";
  const parsedFirst = firstName || (holder.split(" ")[0] || "Abdulloh");
  const parsedLast = lastName || (holder.split(" ").slice(1).join(" ") || "S.");
  const paymentType = sets.donate_payment_type || sets.support_payment_type || "UZCARD / HUMO";
  const tgContact = sets.support_telegram_contact || sets.contact_telegram || "@texnikuzb";
  const title = sets.support_title || "Qo'llab-quvvatlash";
  const desc = sets.support_description || sets.support_subtitle || "Platforma rivojiga o'z xohishingiz bilan hissa qo'shishingiz mumkin.";

  return `
    <div>
      <div class="admin-section-title" style="margin-bottom:4px;">💳 Qo‘llab-quvvatlash Sozlamalari</div>
      <div style="font-size:12px; color:var(--text-secondary); margin-bottom:16px;">
        Profil sahifasidagi premium Apple-style qo‘llab-quvvatlash kartasi ma'lumotlarini boshqarish
      </div>

      <div class="admin-form">
        <div class="apple-field">
          <label>1. Karta raqami (16 xonali) *</label>
          <input id="set-sup-card" class="apple-input" type="text" placeholder="8600 5304 1234 5678" value="${escapeHtml(currentCard)}">
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="apple-field">
            <label>2. Ism *</label>
            <input id="set-sup-first-name" class="apple-input" type="text" placeholder="Abdulloh" value="${escapeHtml(parsedFirst)}">
          </div>
          <div class="apple-field">
            <label>3. Familya *</label>
            <input id="set-sup-last-name" class="apple-input" type="text" placeholder="Salimov" value="${escapeHtml(parsedLast)}">
          </div>
        </div>

        <div class="apple-field">
          <label>4. Karta turi *</label>
          <select id="set-sup-type" class="apple-input">
            <option value="UZCARD / HUMO" ${paymentType === "UZCARD / HUMO" ? "selected" : ""}>UZCARD / HUMO</option>
            <option value="UZCARD" ${paymentType === "UZCARD" ? "selected" : ""}>UZCARD</option>
            <option value="HUMO" ${paymentType === "HUMO" ? "selected" : ""}>HUMO</option>
          </select>
        </div>

        <div class="apple-field">
          <label>5. Telegram username / link * (standart: @texnikuzb)</label>
          <input id="set-sup-contact" class="apple-input" type="text" placeholder="@texnikuzb" value="${escapeHtml(tgContact)}">
          <span style="font-size:11px; color:var(--text-muted); margin-top:2px;">Profil kartasida bosilganda to'g'ridan-to'g'ri Telegram chatiga olib kiradi</span>
        </div>

        <div class="apple-field">
          <label>Blok Sarlavhasi (Ixtiyoriy)</label>
          <input id="set-sup-title" class="apple-input" type="text" value="${escapeHtml(title)}">
        </div>

        <div class="apple-field">
          <label>Qisqa Tavsif (Ixtiyoriy)</label>
          <textarea id="set-sup-desc" class="apple-input apple-textarea">${escapeHtml(desc)}</textarea>
        </div>

        <button class="btn" style="margin-top:16px;" onclick="submitUpdateSupportSettings()">
          💾 Sozlamalarni Saqlash
        </button>
      </div>
    </div>
  `;
}

async function submitUpdateSupportSettings() {
  const cardNumber = document.getElementById("set-sup-card")?.value.trim() || "8600 5304 1234 5678";
  const firstName = document.getElementById("set-sup-first-name")?.value.trim() || "";
  const lastName = document.getElementById("set-sup-last-name")?.value.trim() || "";
  const paymentType = document.getElementById("set-sup-type")?.value.trim() || "UZCARD / HUMO";
  let contact = document.getElementById("set-sup-contact")?.value.trim() || "@texnikuzb";
  if (contact && !contact.startsWith("@") && !contact.startsWith("http")) {
    contact = "@" + contact;
  }
  const title = document.getElementById("set-sup-title")?.value.trim() || "Qo'llab-quvvatlash";
  const desc = document.getElementById("set-sup-desc")?.value.trim() || "Platforma rivojiga o'z xohishingiz bilan hissa qo'shishingiz mumkin.";
  const cardHolder = [firstName, lastName].filter(Boolean).join(" ") || "Abdulloh S.";

  try {
    haptic("medium");
    await adminApi("/api/admin/support/update", {
      card_number: cardNumber,
      first_name: firstName,
      last_name: lastName,
      card_holder: cardHolder,
      payment_type: paymentType,
      telegram_contact: contact,
      title: title,
      description: desc
    });
    showToast("Qo'llab-quvvatlash sozlamalari saqlandi!");
    state.settings = {
      ...state.settings,
      donate_card_number: cardNumber,
      support_card_number: cardNumber,
      support_first_name: firstName,
      support_last_name: lastName,
      donate_card_holder: cardHolder,
      support_card_holder: cardHolder,
      donate_payment_type: paymentType,
      support_payment_type: paymentType,
      support_telegram_contact: contact,
      support_title: title,
      support_subtitle: desc,
      support_description: desc
    };
    adminSetTab("library");
  } catch (err) {
    showAlert(err.message || "Xatolik yuz berdi.");
  }
}

// ------------------------------------------------------
// ADMIN SUPPORT CARDS CRUD (Qo'llab-quvvatlash kartalari)
// ------------------------------------------------------

function renderAdminSupportCards() {
  const cards = adminData.supportCards || [];

  const cardsHtml = cards.length ? cards.map(c => {
    const isAct = c.is_active !== false;
    return `
      <div class="admin-support-card-box">
        <div class="admin-support-card-header">
          <span style="font-size:14px; font-weight:800; letter-spacing:0.5px; text-transform:uppercase; color:var(--text-primary);">
            ${escapeHtml(c.card_type || "UZCARD")}
          </span>
          <span class="admin-status-pill ${isAct ? "active" : "inactive"}">
            ${isAct ? "🟢 Faol" : "⚪ Nofaol"}
          </span>
        </div>

        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700; margin-bottom:3px;">
          Karta raqami
        </div>
        <div style="font-family:var(--font-mono, monospace); font-size:15.5px; font-weight:750; color:var(--text-primary); margin-bottom:12px; letter-spacing:1px;">
          ${escapeHtml(formatCardNumber(c.card_number))}
        </div>

        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700; margin-bottom:3px;">
          Karta egasi
        </div>
        <div style="font-size:13.5px; font-weight:700; color:var(--text-secondary); margin-bottom:16px;">
          ${escapeHtml(String(c.cardholder_name || "").toUpperCase())}
        </div>

        <div style="display:flex; gap:8px;">
          <button class="btn secondary" style="margin-bottom:0; flex:1;" onclick="openAdminEditSupportCardModal(${c.id})">
            ✏️ Tahrirlash
          </button>
          <button class="btn secondary" style="margin-bottom:0; width:auto; padding:0 14px;" onclick="toggleAdminSupportCard(${c.id})" title="${isAct ? "Vaqtincha o'chirish" : "Yoqish"}">
            ${isAct ? "O'chirish" : "Yoqish"}
          </button>
        </div>
      </div>
    `;
  }).join("") : `
    <div class="support-empty-notice" style="margin-bottom:16px;">
      Hech qanday qo‘llab-quvvatlash kartasi topilmadi.
    </div>
  `;

  return `
    <div>
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
        <div>
          <div class="admin-section-title" style="margin-bottom:2px;">💳 Qo‘llab-quvvatlash kartalari</div>
          <div style="font-size:12px; color:var(--text-secondary);">Foydalanuvchilarga ko‘rinadigan UZCARD va HUMO kartalarini boshqarish</div>
        </div>
        <button class="btn" style="width:auto; margin-bottom:0; padding:8px 14px; font-size:12.5px;" onclick="openAdminAddSupportCardModal()">
          + Yangi karta
        </button>
      </div>

      <div class="admin-support-cards-grid">
        ${cardsHtml}
      </div>
    </div>
  `;
}

function openAdminEditSupportCardModal(id) {
  const card = (adminData.supportCards || []).find(c => c.id === id);
  if (!card) return showAlert("Karta topilmadi");

  showConfirm(
    `${escapeHtml(card.card_type)} kartasini tahrirlash`,
    `
      <div style="text-align:left; margin-top:12px;">
        <div class="apple-field" style="margin-bottom:12px;">
          <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Karta turi *</label>
          <select id="edit-sc-type" class="apple-input">
            <option value="UZCARD" ${card.card_type === "UZCARD" ? "selected" : ""}>UZCARD</option>
            <option value="HUMO" ${card.card_type === "HUMO" ? "selected" : ""}>HUMO</option>
          </select>
        </div>

        <div class="apple-field" style="margin-bottom:12px;">
          <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Karta raqami *</label>
          <input id="edit-sc-num" class="apple-input" type="text" value="${escapeHtml(card.card_number)}" placeholder="8600 1234 5678 9012">
        </div>

        <div class="apple-field" style="margin-bottom:12px;">
          <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Karta egasi *</label>
          <input id="edit-sc-holder" class="apple-input" type="text" value="${escapeHtml(card.cardholder_name)}" placeholder="ABDULLOH TANGIRBERGANOV">
        </div>

        <div style="display:flex; align-items:center; gap:8px; margin-top:10px;">
          <input id="edit-sc-active" type="checkbox" ${card.is_active !== false ? "checked" : ""} style="width:18px; height:18px;">
          <label for="edit-sc-active" style="font-size:13px; font-weight:600; color:var(--text-primary); cursor:pointer;">
            Ilovada ko'rsatilsin (Faol)
          </label>
        </div>
      </div>
    `,
    "Saqlash",
    async () => {
      const type = document.getElementById("edit-sc-type")?.value || "UZCARD";
      const num = document.getElementById("edit-sc-num")?.value?.trim() || "";
      const holder = document.getElementById("edit-sc-holder")?.value?.trim() || "";
      const active = Boolean(document.getElementById("edit-sc-active")?.checked);

      if (!num) return showAlert("Karta raqamini kiriting");
      if (!holder) return showAlert("Karta egasini kiriting");

      try {
        haptic("medium");
        await adminApi(`/api/admin/support-cards/${id}/update`, {
          card_type: type,
          card_number: num,
          cardholder_name: holder,
          is_active: active
        });
        showToast("Karta ma'lumotlari muvaffaqiyatli saqlindi!");
        const scData = await adminApi("/api/admin/support-cards/list");
        adminData.supportCards = scData.cards || [];
        state.support_cards = adminData.supportCards.filter(c => c.is_active);
        renderAdminPanel();
      } catch (err) {
        showAlert(err.message || "Saqlashda xatolik");
      }
    }
  );
}

function openAdminAddSupportCardModal() {
  showConfirm(
    "Yangi qo‘llab-quvvatlash kartasi qo‘shish",
    `
      <div style="text-align:left; margin-top:12px;">
        <div class="apple-field" style="margin-bottom:12px;">
          <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Karta turi *</label>
          <select id="add-sc-type" class="apple-input">
            <option value="UZCARD">UZCARD</option>
            <option value="HUMO">HUMO</option>
          </select>
        </div>

        <div class="apple-field" style="margin-bottom:12px;">
          <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Karta raqami *</label>
          <input id="add-sc-num" class="apple-input" type="text" placeholder="8600 1234 5678 9012">
        </div>

        <div class="apple-field" style="margin-bottom:12px;">
          <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Karta egasi *</label>
          <input id="add-sc-holder" class="apple-input" type="text" placeholder="ABDULLOH TANGIRBERGANOV">
        </div>

        <div style="display:flex; align-items:center; gap:8px; margin-top:10px;">
          <input id="add-sc-active" type="checkbox" checked style="width:18px; height:18px;">
          <label for="add-sc-active" style="font-size:13px; font-weight:600; color:var(--text-primary); cursor:pointer;">
            Ilovada ko'rsatilsin (Faol)
          </label>
        </div>
      </div>
    `,
    "Qo'shish",
    async () => {
      const type = document.getElementById("add-sc-type")?.value || "UZCARD";
      const num = document.getElementById("add-sc-num")?.value?.trim() || "";
      const holder = document.getElementById("add-sc-holder")?.value?.trim() || "";
      const active = Boolean(document.getElementById("add-sc-active")?.checked);

      if (!num) return showAlert("Karta raqamini kiriting");
      if (!holder) return showAlert("Karta egasini kiriting");

      try {
        haptic("medium");
        await adminApi("/api/admin/support-cards/add", {
          card_type: type,
          card_number: num,
          cardholder_name: holder,
          is_active: active
        });
        showToast("Yangi karta qo'shildi!");
        const scData = await adminApi("/api/admin/support-cards/list");
        adminData.supportCards = scData.cards || [];
        state.support_cards = adminData.supportCards.filter(c => c.is_active);
        renderAdminPanel();
      } catch (err) {
        showAlert(err.message || "Karta qo'shishda xatolik");
      }
    }
  );
}

async function toggleAdminSupportCard(id) {
  try {
    haptic("light");
    await adminApi(`/api/admin/support-cards/${id}/toggle`);
    showToast("Karta holati o'zgartirildi");
    const scData = await adminApi("/api/admin/support-cards/list");
    adminData.supportCards = scData.cards || [];
    state.support_cards = adminData.supportCards.filter(c => c.is_active);
    renderAdminPanel();
  } catch (err) {
    showAlert(err.message || "Holatni o'zgartirishda xatolik");
  }
}

// ------------------------------------------------------
// ADMIN ADD / EDIT RESOURCE MODAL
// ------------------------------------------------------

function openAddLibraryV2ResourceModal() {
  const cats = DEFAULT_LIBRARY_CATEGORIES.filter(c => c !== "Barchasi");
  const courses = libraryV2CoursesList || [];

  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="adminSetTab('library')">← Ortga qaytish</div>
        <div class="page-title">Yangi Kutubxona Resursi Qo'shish</div>

        <div class="admin-form">
          <div class="apple-field">
            <label>Bo'lim * (Qaysi asosiy bo'limga tegishli)</label>
            <select id="v2-sec" class="apple-input">
              <option value="books">📚 Kitoblar</option>
              <option value="sources">📦 Manbalar</option>
              <option value="tests">✓ Testlar</option>
              <option value="materials">🧱 Materiallar</option>
            </select>
          </div>

          <div class="apple-field">
            <label>Resurs turi *</label>
            <select id="v2-type" class="apple-input">
              <option value="book">📚 Kitob / Qo'llanma (PDF)</option>
              <option value="normative">📏 Normativ Hujjat (ShNQ, KMK)</option>
              <option value="source">📦 Revit Oilasi / Shablon (.rfa / .rte)</option>
              <option value="test">✓ Erkin Sinov Testi</option>
              <option value="material">🧱 Qurilish Materiali</option>
              <option value="video">🎬 Video Darslik</option>
            </select>
          </div>

          <div class="apple-field">
            <label>Resurs nomi *</label>
            <input id="v2-title" class="apple-input" type="text" placeholder="Masalan: Revit 2024: Rasmiy qo'llanma">
          </div>

          <div class="apple-field">
            <label>Qisqa sarlavha (Subtitle)</label>
            <input id="v2-sub" class="apple-input" type="text" placeholder="Masalan: BIM standartlari va ishchi chizmalar">
          </div>

          <div class="apple-field">
            <label>Kategoriya</label>
            <select id="v2-cat" class="apple-input">
              ${cats.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("")}
            </select>
          </div>

          <div class="apple-field">
            <label>Muallif / Manba muallifi</label>
            <input id="v2-author" class="apple-input" type="text" placeholder="Masalan: Autodesk / ShNQ">
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
            <div class="apple-field">
              <label>Revit Versiyasi (Manbalar uchun)</label>
              <input id="v2-version" class="apple-input" type="text" placeholder="2024 / 2025 / 2026">
            </div>
            <div class="apple-field">
              <label>Fayl hajmi</label>
              <input id="v2-filesize" class="apple-input" type="text" placeholder="15 MB, 450 MB...">
            </div>
          </div>

          <div class="apple-field">
            <label>Tegishli Kurs (Agar test bo'lsa)</label>
            <select id="v2-course-id" class="apple-input">
              <option value="">[ Hech qanday kursga bog'lanmagan ]</option>
              ${courses.map(c => `<option value="${Number(c.id)}">🎓 ${escapeHtml(c.title)}</option>`).join("")}
            </select>
          </div>

          <div class="apple-field">
            <label>Fayl / Havola URL (Google Drive, PDF, YouTube yoki link)</label>
            <input id="v2-url" class="apple-input" type="url" placeholder="https://drive.google.com/file/d/.../view">
          </div>

          <div class="apple-field">
            <label>Muqova (Preview) rasm havolasi</label>
            <input id="v2-cover" class="apple-input" type="url" placeholder="https://...">
          </div>

          <div class="apple-field">
            <label>Tavsif (Description)</label>
            <textarea id="v2-desc" class="apple-input apple-textarea" placeholder="Resurs haqida batafsil ma'lumot..."></textarea>
          </div>

          <div class="apple-field" style="display:flex; align-items:center; gap:8px;">
            <input id="v2-featured" type="checkbox" style="width:18px; height:18px;">
            <label for="v2-featured" style="cursor:pointer; margin:0;">⭐ Tavsiya etilgan manba sifatida ko'rsatilsin (Bosh sahifada chiqadi)</label>
          </div>

          <div class="apple-field">
            <label>Status</label>
            <select id="v2-status" class="apple-input">
              <option value="published">🟢 Ochiq (Barchaga ko'rinadi)</option>
              <option value="draft">🔒 Qoralama (Faqat adminga ko'rinadi)</option>
            </select>
          </div>

          <button class="btn" style="margin-top:16px;" onclick="submitCreateLibraryV2Resource()">
            💾 Resursni Saqlash
          </button>
        </div>
      </div>
    `
  };
  render();
}

async function submitCreateLibraryV2Resource() {
  const sectionSlug = document.getElementById("v2-sec")?.value || "books";
  const type = document.getElementById("v2-type")?.value || "book";
  const title = document.getElementById("v2-title")?.value.trim();
  const subtitle = document.getElementById("v2-sub")?.value.trim();
  const category = document.getElementById("v2-cat")?.value;
  const author = document.getElementById("v2-author")?.value.trim();
  const version = document.getElementById("v2-version")?.value.trim();
  const fileSize = document.getElementById("v2-filesize")?.value.trim();
  const courseId = document.getElementById("v2-course-id")?.value ? Number(document.getElementById("v2-course-id").value) : null;
  const contentUrl = document.getElementById("v2-url")?.value.trim();
  const previewImageUrl = document.getElementById("v2-cover")?.value.trim();
  const description = document.getElementById("v2-desc")?.value.trim();
  const isFeatured = Boolean(document.getElementById("v2-featured")?.checked);
  const status = document.getElementById("v2-status")?.value || "published";

  if (!title) return showAlert("Resurs nomi majburiy!");

  let contentType = "link";
  if (contentUrl) {
    if (contentUrl.includes("drive.google.com") || contentUrl.endsWith(".pdf")) contentType = "pdf";
    else if (contentUrl.includes("youtube.com") || contentUrl.includes("youtu.be")) contentType = "video";
  }

  try {
    haptic("medium");
    await adminApi("/api/admin/library-v2/resource/add", {
      section_slug: sectionSlug,
      type: type,
      title: title,
      subtitle: subtitle,
      category: category,
      author: author,
      version: version,
      file_size: fileSize,
      course_id: courseId,
      is_featured: isFeatured,
      content_url: contentUrl,
      content_type: contentType,
      preview_image_url: previewImageUrl,
      description: description,
      status: status
    });

    showToast("Resurs muvaffaqiyatli qo'shildi!");
    await loadLibraryV2Data(true);
    adminSetTab("library");
  } catch (err) {
    showAlert(err.message || "Resurs qo'shishda xato yuz berdi.");
  }
}

function openEditLibraryV2ResourceModal(resId) {
  const allRes = adminData.libraryV2Resources || libraryV2Resources || [];
  const item = allRes.find(r => Number(r.id) === Number(resId));
  if (!item) return showAlert("Resurs topilmadi.");

  const cats = DEFAULT_LIBRARY_CATEGORIES.filter(c => c !== "Barchasi");
  const courses = libraryV2CoursesList || [];

  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="adminSetTab('library')">← Ortga qaytish</div>
        <div class="page-title">Resursni Tahrirlash</div>

        <div class="admin-form">
          <div class="apple-field">
            <label>Bo'lim *</label>
            <select id="ev2-sec" class="apple-input">
              <option value="books" ${item.section_slug === "books" ? "selected" : ""}>📚 Kitoblar</option>
              <option value="sources" ${item.section_slug === "sources" ? "selected" : ""}>📦 Manbalar</option>
              <option value="tests" ${item.section_slug === "tests" ? "selected" : ""}>✓ Testlar</option>
              <option value="materials" ${item.section_slug === "materials" ? "selected" : ""}>🧱 Materiallar</option>
            </select>
          </div>

          <div class="apple-field">
            <label>Resurs turi *</label>
            <select id="ev2-type" class="apple-input">
              <option value="book" ${item.type === "book" ? "selected" : ""}>📚 Kitob / Qo'llanma (PDF)</option>
              <option value="normative" ${item.type === "normative" ? "selected" : ""}>📏 Normativ Hujjat</option>
              <option value="source" ${item.type === "source" ? "selected" : ""}>📦 Revit Oilasi / Shablon</option>
              <option value="test" ${item.type === "test" ? "selected" : ""}>✓ Erkin Sinov Testi</option>
              <option value="material" ${item.type === "material" ? "selected" : ""}>🧱 Material</option>
              <option value="video" ${item.type === "video" ? "selected" : ""}>🎬 Video Darslik</option>
            </select>
          </div>

          <div class="apple-field">
            <label>Resurs nomi *</label>
            <input id="ev2-title" class="apple-input" type="text" value="${escapeHtml(item.title)}">
          </div>

          <div class="apple-field">
            <label>Qisqa sarlavha (Subtitle)</label>
            <input id="ev2-sub" class="apple-input" type="text" value="${escapeHtml(item.subtitle || "")}">
          </div>

          <div class="apple-field">
            <label>Kategoriya</label>
            <select id="ev2-cat" class="apple-input">
              ${cats.map(c => `<option value="${escapeHtml(c)}" ${item.category === c ? "selected" : ""}>${escapeHtml(c)}</option>`).join("")}
            </select>
          </div>

          <div class="apple-field">
            <label>Muallif</label>
            <input id="ev2-author" class="apple-input" type="text" value="${escapeHtml(item.author || "")}">
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
            <div class="apple-field">
              <label>Revit Versiyasi</label>
              <input id="ev2-version" class="apple-input" type="text" value="${escapeHtml(item.version || "")}">
            </div>
            <div class="apple-field">
              <label>Fayl hajmi</label>
              <input id="ev2-filesize" class="apple-input" type="text" value="${escapeHtml(item.file_size || "")}">
            </div>
          </div>

          <div class="apple-field">
            <label>Tegishli Kurs</label>
            <select id="ev2-course-id" class="apple-input">
              <option value="">[ Hech qanday kursga bog'lanmagan ]</option>
              ${courses.map(c => `<option value="${Number(c.id)}" ${Number(item.course_id) === Number(c.id) ? "selected" : ""}>🎓 ${escapeHtml(c.title)}</option>`).join("")}
            </select>
          </div>

          <div class="apple-field">
            <label>Fayl / Havola URL</label>
            <input id="ev2-url" class="apple-input" type="url" value="${escapeHtml(item.content_url || "")}">
          </div>

          <div class="apple-field">
            <label>Muqova (Preview) rasm havolasi</label>
            <input id="ev2-cover" class="apple-input" type="url" value="${escapeHtml(item.preview_image_url || "")}">
          </div>

          <div class="apple-field">
            <label>Tavsif</label>
            <textarea id="ev2-desc" class="apple-input apple-textarea">${escapeHtml(item.description || "")}</textarea>
          </div>

          <div class="apple-field" style="display:flex; align-items:center; gap:8px;">
            <input id="ev2-featured" type="checkbox" style="width:18px; height:18px;" ${item.is_featured ? "checked" : ""}>
            <label for="ev2-featured" style="cursor:pointer; margin:0;">⭐ Tavsiya etilgan manba sifatida ko'rsatilsin</label>
          </div>

          <div class="apple-field">
            <label>Status</label>
            <select id="ev2-status" class="apple-input">
              <option value="published" ${item.status === "published" ? "selected" : ""}>🟢 Ochiq</option>
              <option value="draft" ${item.status === "draft" ? "selected" : ""}>🔒 Qoralama</option>
            </select>
          </div>

          <button class="btn" style="margin-top:16px;" onclick="submitUpdateLibraryV2Resource(${Number(item.id)})">
            💾 O'zgarishlarni Saqlash
          </button>
        </div>
      </div>
    `
  };
  render();
}

async function submitUpdateLibraryV2Resource(resId) {
  const sectionSlug = document.getElementById("ev2-sec")?.value;
  const type = document.getElementById("ev2-type")?.value;
  const title = document.getElementById("ev2-title")?.value.trim();
  const subtitle = document.getElementById("ev2-sub")?.value.trim();
  const category = document.getElementById("ev2-cat")?.value;
  const author = document.getElementById("ev2-author")?.value.trim();
  const version = document.getElementById("ev2-version")?.value.trim();
  const fileSize = document.getElementById("ev2-filesize")?.value.trim();
  const courseId = document.getElementById("ev2-course-id")?.value ? Number(document.getElementById("ev2-course-id").value) : null;
  const contentUrl = document.getElementById("ev2-url")?.value.trim();
  const previewImageUrl = document.getElementById("ev2-cover")?.value.trim();
  const description = document.getElementById("ev2-desc")?.value.trim();
  const isFeatured = Boolean(document.getElementById("ev2-featured")?.checked);
  const status = document.getElementById("ev2-status")?.value;

  if (!title) return showAlert("Resurs nomi majburiy!");

  let contentType = "link";
  if (contentUrl) {
    if (contentUrl.includes("drive.google.com") || contentUrl.endsWith(".pdf")) contentType = "pdf";
    else if (contentUrl.includes("youtube.com") || contentUrl.includes("youtu.be")) contentType = "video";
  }

  try {
    haptic("medium");
    await adminApi(`/api/admin/library-v2/resource/${Number(resId)}/update`, {
      section_slug: sectionSlug,
      type: type,
      title: title,
      subtitle: subtitle,
      category: category,
      author: author,
      version: version,
      file_size: fileSize,
      course_id: courseId,
      is_featured: isFeatured,
      content_url: contentUrl,
      content_type: contentType,
      preview_image_url: previewImageUrl,
      description: description,
      status: status
    });

    showToast("Resurs muvaffaqiyatli yangilandi!");
    await loadLibraryV2Data(true);
    adminSetTab("library");
  } catch (err) {
    showAlert(err.message || "Resursni yangilashda xato yuz berdi.");
  }
}

function renderAdminLibraryFilesRowsHtml(filteredFiles) {
  if (!filteredFiles.length) {
    return `<div class="empty-box">Fayllar topilmadi.</div>`;
  }
  return filteredFiles.map(f => `
    <div class="lesson-file-row">
      <div class="lesson-file-header">
        <div class="lesson-file-title-wrap">
          <span style="font-size:20px;">${getResourceIcon(f.file_name)}</span>
          <div>
            <div class="lesson-file-title-text">${escapeHtml(f.file_name)}</div>
            <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">
              ${escapeHtml(f.course_title || "Kurs")} → ${escapeHtml(f.lesson_title || "Dars")}
            </div>
          </div>
        </div>
        <div style="display:flex; gap:6px; align-items:center;">
          <button class="admin-small-btn" onclick="openEditLibraryFileDirectModal(${Number(f.id)}, '${escapeJsString(f.file_name)}', '${escapeJsString(f.file_url)}')" title="Tahrirlash">
            ✏️
          </button>
          <button class="btn danger" style="width:auto; margin:0; padding:6px 10px; font-size:12px;" onclick="deleteLibraryFileDirect(${Number(f.id)})" title="O'chirish">
            🗑️
          </button>
        </div>
      </div>
      <div class="lesson-file-link-wrap">
        <a href="${escapeHtml(f.file_url)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent); text-decoration:underline; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1;">
          ${escapeHtml(f.file_url)}
        </a>
        <div style="display:flex; gap:6px; flex-shrink:0;">
          <button class="admin-small-btn" style="padding:4px 8px; font-size:11px;" onclick="window.open('${escapeJsString(f.file_url)}', '_blank')">
            🔗 Sinab ko'rish
          </button>
          <button class="admin-small-btn" style="padding:4px 8px; font-size:11px;" onclick="copyDonateCard('${escapeJsString(f.file_url)}', 'Fayl havolasi nusxalandi!')">
            📋 Nusxa
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

function renderAdminLibraryFiles(filteredFiles, search) {
  return `
    <div style="margin-bottom:14px;">
      <input id="admin-library-file-search-input" class="apple-input" type="text" placeholder="🔍 Fayl, kurs yoki dars nomi bo'yicha qidirish..." value="${escapeHtml(search)}" oninput="onLibraryFileSearch(this.value)">
    </div>
    <div class="admin-section-header" style="margin-bottom:10px;">
      <div id="admin-library-files-count" class="admin-section-title">Barcha Dars Fayllari (${filteredFiles.length})</div>
      <button class="admin-small-btn" onclick="adminSetTab('library')" title="Yangilash">🔄 Yangilash</button>
    </div>
    <div id="admin-library-files-rows" class="lesson-files">
      ${renderAdminLibraryFilesRowsHtml(filteredFiles)}
    </div>
  `;
}

function onLibraryFileSearch(val) {
  adminData.libraryFileSearch = val;
  const container = document.getElementById("admin-library-files-rows");
  if (container) {
    const rawFiles = adminData.libraryFiles || [];
    const search = (adminData.libraryFileSearch || "").toLowerCase().trim();
    const filteredFiles = search ? rawFiles.filter(f =>
      (f.file_name && f.file_name.toLowerCase().includes(search)) ||
      (f.lesson_title && f.lesson_title.toLowerCase().includes(search)) ||
      (f.course_title && f.course_title.toLowerCase().includes(search))
    ) : rawFiles;
    container.innerHTML = renderAdminLibraryFilesRowsHtml(filteredFiles);
    const countTitle = document.getElementById("admin-library-files-count");
    if (countTitle) countTitle.textContent = `Barcha Dars Fayllari (${filteredFiles.length})`;
  } else {
    renderAdminPanel();
  }
}

function openEditLibraryFileDirectModal(fileId, fileName, fileUrl) {
  currentView = {
    html: `
      <div class="page">
        <div class="back-btn" onclick="renderAdminPanel()">← Ortga qaytish</div>
        <div class="page-title">Faylni tahrirlash</div>

        <div class="admin-form">
          <div class="apple-field">
            <label>Fayl nomi *</label>
            <input id="edit-libf-name" class="apple-input" type="text" value="${escapeHtml(fileName)}">
          </div>

          <div class="apple-field">
            <label>Yuklab olish linki *</label>
            <input id="edit-libf-url" class="apple-input" type="url" value="${escapeHtml(fileUrl)}">
          </div>

          <div style="margin-bottom:14px;">
            <button type="button" class="btn secondary" style="margin:0; padding:10px;" onclick="testModalUrl('edit-libf-url')">
              🔗 Havolani brauzerda sinab ko'rish
            </button>
          </div>

          <button id="save-libf-btn" class="btn" onclick="submitUpdateLibraryFileDirect(${Number(fileId)})">
            💾 O'zgarishlarni saqlash
          </button>
        </div>
      </div>
    `
  };
  render();
}

async function submitUpdateLibraryFileDirect(fileId) {
  const name = document.getElementById("edit-libf-name")?.value.trim();
  let url = document.getElementById("edit-libf-url")?.value.trim();
  if (!name || !url) return showAlert("Fayl nomi va havolasi majburiy!");
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  const btn = document.getElementById("save-libf-btn");
  if (btn) btn.classList.add("btn-loading");

  try {
    haptic("medium");
    await adminApi(`/api/admin/file/${Number(fileId)}/update`, {
      file_name: name,
      file_url: url
    });
    showToast("Fayl yangilandi!");
    await adminSetTab("library");
  } catch (error) {
    showAlert(error.message || "Faylni yangilashda xatolik.");
  } finally {
    if (btn) btn.classList.remove("btn-loading");
  }
}

async function deleteLibraryFileDirect(fileId) {
  showConfirm(
    "Fayl o'chirilsinmi?",
    "Ushbu manba o'chiriladi va darsda ko'rinmaydi.",
    "Ha, o'chirish",
    async () => {
      await adminApi(`/api/admin/file/${Number(fileId)}/delete`);
      showToast("Fayl o'chirildi!");
      await adminSetTab("library");
    }
  );
}

function renderAdminLibraryOpenRes(openRes) {
  return `
    <div class="admin-section-header" style="margin-bottom:12px;">
      <div class="admin-section-title">Erkin Manbalar (${openRes.length})</div>
      <button class="admin-small-btn" onclick="openAddOpenResourceModal()">➕ Manba Qo'shish</button>
    </div>
    <div class="lesson-files">
      ${openRes.length ? openRes.map(r => `
        <div class="lesson-file-row">
          <div class="lesson-file-header">
            <div class="lesson-file-title-wrap">
              <span style="font-size:22px;">${r.icon || "📚"}</span>
              <div>
                <div class="lesson-file-title-text">${escapeHtml(r.title)}</div>
                <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">
                  Turi: ${r.type === "book" ? "Kitob (PDF)" : r.type === "video" ? "Video Dars" : r.type === "test" ? "Sinov Testi" : "Manba / Shablon"} • Kategoriya: ${escapeHtml(r.category || "Umumiy")}
                </div>
              </div>
            </div>
            <button class="btn danger" style="width:auto; margin:0; padding:6px 10px; font-size:12px;" onclick="deleteOpenResourceItem(${Number(r.id)})" title="O'chirish">
              🗑️
            </button>
          </div>
          ${r.description ? `<div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">${escapeHtml(r.description)}</div>` : ""}
          ${r.link_url ? `
            <div class="lesson-file-link-wrap">
              <a href="${escapeHtml(r.link_url)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent); text-decoration:underline; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1;">
                ${escapeHtml(r.link_url)}
              </a>
              <div style="display:flex; gap:6px; flex-shrink:0;">
                <button class="admin-small-btn" style="padding:4px 8px; font-size:11px;" onclick="window.open('${escapeJsString(r.link_url)}', '_blank')">
                  🔗 Sinab ko'rish
                </button>
                <button class="admin-small-btn" style="padding:4px 8px; font-size:11px;" onclick="copyDonateCard('${escapeJsString(r.link_url)}', 'Havola nusxalandi!')">
                  📋 Nusxa
                </button>
              </div>
            </div>
          ` : ""}
        </div>
      `).join("") : `<div class="empty-box">Erkin manbalar mavjud emas.</div>`}
    </div>
  `;
}

function renderAdminLibraryShowcases(showcases) {
  return `
    <div class="admin-section-header" style="margin-bottom:12px;">
      <div class="admin-section-title">O'quvchilar Natijalari (${showcases.length})</div>
      <button class="admin-small-btn" onclick="openAddShowcaseModal()">➕ Natija Qo'shish</button>
    </div>
    <div class="lesson-files">
      ${showcases.length ? showcases.map(sc => `
        <div class="lesson-file-row">
          <div class="lesson-file-header">
            <div class="lesson-file-title-wrap">
              <span style="font-size:22px;">📜</span>
              <div>
                <div class="lesson-file-title-text">${escapeHtml(sc.title)}</div>
                <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">
                  O'quvchi: ${escapeHtml(sc.student_name || "O'quvchi")} • ${escapeHtml(sc.course_title || "Kurs")}
                  ${sc.discount_badge ? ` • <span style="color:#ffab00; font-weight:700;">${escapeHtml(sc.discount_badge)}</span>` : ""}
                </div>
              </div>
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
              <button class="admin-small-btn" onclick="openEditShowcaseModal(${Number(sc.id)})" title="Tahrirlash">
                ✏️
              </button>
              <button class="btn danger" style="width:auto; margin:0; padding:6px 10px; font-size:12px;" onclick="deleteShowcaseItem(${Number(sc.id)})" title="O'chirish">
                🗑️
              </button>
            </div>
          </div>
          <div class="lesson-file-link-wrap">
            <span style="color:var(--text-secondary); font-size:12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1;">
              📄 PDF: ${escapeHtml(sc.pdf_url)}
            </span>
            <div style="display:flex; gap:6px; flex-shrink:0;">
              <button class="admin-small-btn" style="padding:4px 8px; font-size:11px;" onclick="openPdfViewerModal('${escapeJsString(sc.pdf_url)}', '${escapeJsString(sc.title)}')">
                👁️ Ko'rish
              </button>
              <button class="admin-small-btn" style="padding:4px 8px; font-size:11px;" onclick="copyDonateCard('${escapeJsString(sc.pdf_url)}', 'PDF havolasi nusxalandi!')">
                📋 Nusxa
              </button>
            </div>
          </div>
        </div>
      `).join("") : `<div class="empty-box">Natijalar slaydlari mavjud emas.</div>`}
    </div>
  `;
}

function renderAdminLibraryMaterials(materials) {
  return `
    <div class="admin-section-header" style="margin-bottom:12px;">
      <div class="admin-section-title">Materiallar Bozori (${materials.length})</div>
      <button class="admin-small-btn" onclick="openAddMaterialModal()">➕ Material Qo'shish</button>
    </div>
    <div class="lesson-files">
      ${materials.length ? materials.map(m => `
        <div class="lesson-file-row">
          <div class="lesson-file-header">
            <div class="lesson-file-title-wrap">
              ${m.image_url ? `<img src="${escapeHtml(m.image_url)}" style="width:38px; height:38px; border-radius:8px; object-fit:cover;" onerror="this.style.display='none'">` : `<span style="font-size:22px;">🧱</span>`}
              <div>
                <div class="lesson-file-title-text">${escapeHtml(m.title)}</div>
                <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">
                  ${escapeHtml(m.category)} • ${escapeHtml(m.sub_category || "")}
                </div>
              </div>
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
              <button class="admin-small-btn" onclick="openMaterialDetailSheet(${Number(m.id)})" title="Ko'rish">
                👁️
              </button>
              <button class="admin-small-btn" onclick="openEditMaterialModal(${Number(m.id)})" title="Tahrirlash">
                ✏️
              </button>
              <button class="btn danger" style="width:auto; margin:0; padding:6px 10px; font-size:12px;" onclick="deleteMaterialItem(${Number(m.id)})" title="O'chirish">
                🗑️
              </button>
            </div>
          </div>
          ${m.short_desc ? `<div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">${escapeHtml(m.short_desc)}</div>` : ""}
        </div>
      `).join("") : `<div class="empty-box">Materiallar mavjud emas.</div>`}
    </div>
  `;
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
    { id: "tasks", label: "Kutubxona" },
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
            <svg class="nav-svg" viewBox="0 0 24 24" ${isActive ? 'fill="currentColor"' : strokeProps}>${svgInner}</svg>
          </div>
          <div class="nav-label">${t.label}</div>
        </div>
      `;
      }).join("")}
    </div>
  `;
}

function setTab(id) {
  if (!state.terms_accepted && !state.is_admin) {
    render();
    return;
  }
  haptic("light");
  if (!currentView) {
    savedTabScrolls[activeTab] = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
  }
  activeTab = id;
  currentView = null;
  render();
  const targetY = savedTabScrolls[id] || 0;
  requestAnimationFrame(() => {
    window.scrollTo({ top: targetY, left: 0, behavior: "instant" });
    setTimeout(() => {
      window.scrollTo({ top: targetY, left: 0, behavior: "instant" });
    }, 30);
  });
  if (id === "chat") {
    loadChatQuestions();
  }
  if (id === "tasks") {
    loadLibraryV2Data();
  }
  sendHeartbeat({ current_tab: id });
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

  document.querySelectorAll(".retake-countdown").forEach(el => {
    const until = el.dataset.until ? new Date(el.dataset.until) : null;
    if (!until || isNaN(until.getTime())) return;
    const diff = until.getTime() - Date.now();
    if (diff <= 0) {
      el.textContent = "🔓 Testni qayta topshirish mumkin";
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, "0");
    el.textContent = days > 0
      ? `⏳ Qayta topshirish uchun: ${days} kun ${pad(hours)}:${pad(mins)}:${pad(secs)}`
      : `⏳ Qayta topshirish uchun: ${pad(hours)}:${pad(mins)}:${pad(secs)}`;
  });
}, 1000);

function closeDetail() {
  haptic("light");
  stopAdminLivePolling();
  clearActivitySpecialState();
  if (window._quizState) {
    if (window._quizState.lockTimer) clearTimeout(window._quizState.lockTimer);
    window._quizState = null;
  }
  currentView = null;
  const targetY = lastDetailReturnScroll || savedTabScrolls[activeTab] || 0;
  render();
  requestAnimationFrame(() => {
    window.scrollTo({ top: targetY, left: 0, behavior: "instant" });
    setTimeout(() => {
      window.scrollTo({ top: targetY, left: 0, behavior: "instant" });
    }, 40);
  });
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

function updateTelegramBackButton() {
  try {
    if (!tg || !tg.BackButton) return;
    tg.BackButton.offClick(handleTelegramBackClick);
    if (currentView) {
      tg.BackButton.show();
      tg.BackButton.onClick(handleTelegramBackClick);
    } else if (activeTab === "tasks" && typeof libraryActiveSection !== "undefined" && libraryActiveSection) {
      tg.BackButton.show();
      tg.BackButton.onClick(handleTelegramBackClick);
    } else {
      tg.BackButton.hide();
    }
  } catch (e) {}
}

function handleTelegramBackClick() {
  if (currentView) {
    closeDetail();
  } else if (activeTab === "tasks" && typeof libraryActiveSection !== "undefined" && libraryActiveSection) {
    closeLibrarySection();
  }
}

function render() {
  if (!app) return;

  // Foydalanish qoidalarini qabul qilmagan foydalanuvchini bloklaymiz (Onboarding gate)
  if (!state.terms_accepted && !state.is_admin) {
    app.innerHTML = `
      <div class="screen">
        ${renderTermsOnboardingHtml()}
      </div>
    `;
    updateTelegramBackButton();
    return;
  }

  const body = currentView ? currentView.html : renderTab();
  app.innerHTML = `
    <div class="screen">
      ${body}
    </div>
    ${!currentView ? renderNav() : ""}
  `;
  updateTelegramBackButton();
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
    initHeartbeat();
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
