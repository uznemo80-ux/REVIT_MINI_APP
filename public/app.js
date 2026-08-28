const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const initData = tg.initData || "";
const app = document.getElementById('app');

let state = { has_access: false, modules: [], access_until: null, first_name: '', telegram_id: '' };
let activeTab = 'home';
let currentView = null; // {type:'lesson', id} yoki {type:'test', id} — bottom nav ustida ochiladi

async function api(path, body = {}) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initData, ...body })
  });
  return res.json();
}

function ytEmbed(url) {
  const id = (url.match(/(?:v=|youtu\.be\/)([\w-]+)/) || [])[1];
  return id ? `https://www.youtube.com/embed/${id}` : '';
}

function fmtDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'long', year: 'numeric' });
}

async function loadContent() {
  const data = await api('/api/content');
  state = data;
  render();
}

// ---------- LAYOUT ----------
function render() {
  const body = currentView ? renderDetailView() : renderTab();
  app.innerHTML = `
    <div class="screen">${body}</div>
    ${!currentView ? renderNav() : ''}
  `;
}

function renderNav() {
  const tabs = [
    { id: 'home', label: 'Bosh sahifa', icon: '⌂' },
    { id: 'lessons', label: 'Darslar', icon: '▤' },
    { id: 'tasks', label: 'Vazifalar', icon: '✎' },
    { id: 'chat', label: 'Chat', icon: '◈' },
    { id: 'profile', label: 'Profil', icon: '◍' }
  ];
  return `
    <div class="nav">
      ${tabs.map(t => `
        <div class="nav-item ${activeTab === t.id ? 'active' : ''}" onclick="setTab('${t.id}')">
          <div class="nav-icon">${t.icon}</div>
          <div class="nav-label">${t.label}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function setTab(id) {
  activeTab = id;
  currentView = null;
  render();
}

function renderTab() {
  if (activeTab === 'home') return renderHome();
  if (activeTab === 'lessons') return renderLessons();
  if (activeTab === 'tasks') return renderTasks();
  if (activeTab === 'chat') return renderChat();
  if (activeTab === 'profile') return renderProfile();
  return '';
}

// ---------- BOSH SAHIFA ----------
function renderHome() {
  const totalLessons = state.modules.reduce((a, m) => a + m.lessons.length, 0);
  const availableLessons = state.modules.reduce((a, m) => a + m.lessons.filter(l => l.available).length, 0);
  const statusLine = state.has_access
    ? `Faol obuna · ${fmtDate(state.access_until)} gacha`
    : "Obunangiz yo'q — namuna darslar ochiq";

  return `
    <div class="page">
      <div class="hero">
        <div class="hero-greeting">Salom, ${state.first_name || 'do\u2019stim'} 👋</div>
        <div class="hero-sub">${statusLine}</div>
      </div>

      <div class="stat-row">
        <div class="stat-card">
          <div class="stat-num">${availableLessons}</div>
          <div class="stat-label">Ochiq dars</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${totalLessons}</div>
          <div class="stat-label">Jami dars</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${state.modules.length}</div>
          <div class="stat-label">Modul</div>
        </div>
      </div>

      <div class="section-title">Tezkor havolalar</div>
      <div class="quick-list">
        <div class="quick-item" onclick="setTab('lessons')">
          <span>▤ Darslarni ko'rish</span><span>→</span>
        </div>
        <div class="quick-item" onclick="setTab('tasks')">
          <span>✎ Vazifalarni ko'rish</span><span>→</span>
        </div>
        ${!state.has_access ? `
        <div class="quick-item" onclick="setTab('chat')">
          <span>◈ To'liq kirish uchun murojaat</span><span>→</span>
        </div>` : ''}
      </div>
    </div>
  `;
}

// ---------- DARSLAR ----------
function renderLessons() {
  let html = `<div class="page"><div class="page-title">Darslar</div>`;

  state.modules.forEach((m, i) => {
    html += `
      <div class="module ${m.unlocked ? '' : 'locked'}">
        <div class="module-head" onclick="toggleModule(${m.id})">
          <div><span class="idx">${String(i + 1).padStart(2, '0')}</span>${m.title}</div>
          <div class="tag ${m.passed_test ? 'passed' : ''}">
            ${m.unlocked ? (m.passed_test ? 'Test topshirilgan' : 'Ochiq') : 'Qulflangan'}
          </div>
        </div>
        <div class="lesson-list" id="mod-${m.id}">
          ${m.lessons.map(l => `
            <div class="lesson ${l.available ? '' : 'disabled'}"
                 onclick="${l.available ? `openLesson(${l.id})` : 'showLockedInfo()'}">
              <span>${l.title}</span>
              ${l.is_free ? '<span class="free-badge">Namuna</span>' : (l.available ? '' : '🔒')}
            </div>
          `).join('')}
          ${m.unlocked ? `<div class="lesson" onclick="openTest(${m.id})">📝 Modul testi</div>` : ''}
        </div>
      </div>
    `;
  });

  if (!state.modules.length) {
    html += `<div class="empty-box">Hozircha darslar qo'shilmagan.</div>`;
  }
  if (!state.has_access) {
    html += `<button class="btn" onclick="setTab('chat')">To'liq kirish uchun murojaat qilish</button>`;
  }
  html += `</div>`;
  return html;
}

function toggleModule(id) {
  const el = document.getElementById(`mod-${id}`);
  el.classList.toggle('open');
}

function showLockedInfo() {
  tg.showAlert("Bu dars uchun to'lov qilinishi kerak. \"Chat\" bo'limidan admin bilan bog'laning.");
}

// ---------- VAZIFALAR ----------
function renderTasks() {
  let html = `<div class="page"><div class="page-title">Vazifalar</div>`;
  const allLessons = state.modules.flatMap(m => m.lessons.map(l => ({ ...l, moduleTitle: m.title })));
  const withTasks = allLessons.filter(l => l.available && l.task_text);
  const lockedCount = allLessons.filter(l => !l.available).length;

  if (!withTasks.length) {
    html += `<div class="empty-box">Hozircha ochiq vazifalar yo'q.</div>`;
  } else {
    withTasks.forEach(l => {
      html += `
        <div class="task-card" onclick="openLesson(${l.id})">
          <div class="task-module">${l.moduleTitle}</div>
          <div class="task-title">${l.title}</div>
          <div class="task-text">${l.task_text}</div>
        </div>
      `;
    });
  }
  if (lockedCount > 0) {
    html += `<div class="empty-box">🔒 Yana ${lockedCount} ta vazifa to'lovdan keyin ochiladi</div>`;
  }
  html += `</div>`;
  return html;
}

// ---------- CHAT ----------
function renderChat() {
  return `
    <div class="page">
      <div class="page-title">Chat</div>
      <div class="chat-box">
        ${state.has_access
          ? `<p>Obunangiz faol (${fmtDate(state.access_until)} gacha). Muddatni uzaytirish yoki savolingiz bo'lsa, admin bilan bog'laning.</p>`
          : `<p>To'liq kirish uchun to'lovni tashqarida (admin bilan kelishilgan holda) amalga oshirasiz. Quyidagi tugmani bosing — so'rovingiz adminga yuboriladi, u siz bilan bog'lanadi.</p>`
        }
      </div>
      <button class="btn" onclick="requestAccess()">Adminga murojaat yuborish</button>
      <button class="btn secondary" onclick="tg.openTelegramLink('https://t.me/')">Admin profiliga o'tish</button>
    </div>
  `;
}

async function requestAccess() {
  await api('/api/request-access');
  tg.showAlert("So'rovingiz adminga yuborildi. Tez orada siz bilan bog'lanishadi.");
}

// ---------- PROFIL ----------
function renderProfile() {
  return `
    <div class="page">
      <div class="page-title">Profil</div>
      <div class="profile-card">
        <div class="profile-avatar">${(state.first_name || '?')[0].toUpperCase()}</div>
        <div class="profile-name">${state.first_name || 'Foydalanuvchi'}</div>
        <div class="profile-id">ID: ${state.telegram_id}</div>
      </div>
      <div class="info-row">
        <span>Obuna holati</span>
        <span class="${state.has_access ? 'ok' : 'warn'}">${state.has_access ? 'Faol' : 'Yo\u2019q'}</span>
      </div>
      ${state.has_access ? `
      <div class="info-row">
        <span>Muddat tugash sanasi</span>
        <span>${fmtDate(state.access_until)}</span>
      </div>` : ''}
      ${!state.has_access ? `<button class="btn" onclick="setTab('chat')">To'liq kirish uchun murojaat</button>` : `<button class="btn secondary" onclick="setTab('chat')">Muddatni uzaytirish uchun murojaat</button>`}
    </div>
  `;
}

// ---------- DARS / TEST (pastki menyusiz to'liq ekran) ----------
function renderDetailView() {
  return currentView.html;
}

async function openLesson(id) {
  const lesson = await api(`/api/lesson/${id}`);
  if (lesson.error === 'locked') return showLockedInfo();

  currentView = {
    html: `
      <div class="back-btn" onclick="closeDetail()">← Orqaga</div>
      <div class="lesson-detail">
        <iframe src="${ytEmbed(lesson.youtube_url)}" allowfullscreen></iframe>
        <h2>${lesson.title}</h2>

        <div class="section-title">Vazifa</div>
        <div class="task-box">${lesson.task_text || 'Vazifa berilmagan'}</div>

        ${lesson.files.length ? `
          <div class="section-title">Darslikda ishlatilgan fayllar</div>
          ${lesson.files.map(f => `
            <div class="file-item">
              <span>📎 ${f.file_name}</span>
              <a href="${f.file_url}" target="_blank">Yuklab olish</a>
            </div>
          `).join('')}
        ` : ''}
      </div>
    `
  };
  render();
}

function closeDetail() {
  currentView = null;
  render();
}

async function openTest(moduleId) {
  const { questions } = await api(`/api/module/${moduleId}/test`);
  if (!questions.length) return tg.showAlert("Bu modul uchun test hali qo'shilmagan.");

  window._answers = {};
  currentView = {
    html: `
      <div class="back-btn" onclick="closeDetail()">← Orqaga</div>
      <div class="section-title">Modul testi</div>
      <div id="test-body">
        ${questions.map(q => `
          <div class="test-question">
            <p>${q.question}</p>
            ${q.options.map((opt, i) => `
              <div class="option" data-q="${q.id}" data-i="${i}" onclick="selectOption(${q.id},${i})">${opt}</div>
            `).join('')}
          </div>
        `).join('')}
      </div>
      <button class="btn" onclick="submitTest(${moduleId})">Yuborish</button>
    `
  };
  render();
}

function selectOption(qId, i) {
  window._answers[qId] = i;
  document.querySelectorAll(`.option[data-q="${qId}"]`).forEach(el => el.classList.remove('selected'));
  document.querySelector(`.option[data-q="${qId}"][data-i="${i}"]`).classList.add('selected');
}

async function submitTest(moduleId) {
  const result = await api(`/api/module/${moduleId}/submit`, { answers: window._answers });
  if (result.passed) {
    tg.showAlert(`Tabriklaymiz! Natija: ${result.score}%. Keyingi modul ochildi.`);
  } else {
    tg.showAlert(`Natija: ${result.score}%. O'tish uchun kamida 70% kerak. Qayta urinib ko'ring.`);
  }
  closeDetail();
  await loadContent();
}

loadContent();
