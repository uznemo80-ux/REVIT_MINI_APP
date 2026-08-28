const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const initData = tg.initData || "";
const app = document.getElementById('app');

let state = { has_access: false, modules: [] };

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

async function loadContent() {
  const data = await api('/api/content');
  state = data;
  renderHome();
}

function renderHome() {
  const statusText = state.has_access ? "✅ Faol obuna" : "🔒 Obuna yo'q — namuna darslarni ko'rishingiz mumkin";
  let html = `
    <div class="header">
      <h1>Revit Darsliklari</h1>
      <div class="status">${statusText}</div>
    </div>
  `;

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
          ${m.unlocked ? `<div class="lesson" style="color:#8a8a8a" onclick="openTest(${m.id})">📝 Modul testi</div>` : ''}
        </div>
      </div>
    `;
  });

  if (!state.has_access) {
    html += `<button class="btn" onclick="requestAccess()">To'liq kirish uchun murojaat qilish</button>`;
  }

  app.innerHTML = html;
}

function toggleModule(id) {
  const el = document.getElementById(`mod-${id}`);
  el.classList.toggle('open');
}

function showLockedInfo() {
  tg.showAlert("Bu dars uchun to'lov qilinishi kerak. Pastdagi tugma orqali admin bilan bog'laning.");
}

async function requestAccess() {
  await api('/api/request-access');
  tg.showAlert("So'rovingiz adminga yuborildi. Tez orada siz bilan bog'lanishadi.");
}

async function openLesson(id) {
  const lesson = await api(`/api/lesson/${id}`);
  if (lesson.error === 'locked') return showLockedInfo();

  app.innerHTML = `
    <div class="back-btn" onclick="renderHome()">← Orqaga</div>
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
  `;
}

async function openTest(moduleId) {
  const { questions } = await api(`/api/module/${moduleId}/test`);
  if (!questions.length) return tg.showAlert("Bu modul uchun test hali qo'shilmagan.");

  const answers = {};
  app.innerHTML = `
    <div class="back-btn" onclick="renderHome()">← Orqaga</div>
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
  `;
  window._answers = {};
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
  await loadContent();
}

loadContent();
