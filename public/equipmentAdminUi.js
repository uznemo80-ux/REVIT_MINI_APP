/* ======================================================
   YOSHUZBEKK — EQUIPMENT ADMIN UI MODULE
   ======================================================
   Alohida modul (public/equipmentAdminUi.js).
   app.js dagi mavjud admin arxitekturasiga MOS:
     • adminView = "equipment"  → renderAdminPanel() shu yerga qaytadi
     • adminApi() / api()       → mavjud request helperlar
     • adminNavigate()          → boshqa modullar kabi shu orqali yuklanadi

   Global dan foydalanadi (window orqali):
     api(path, body)  escapeHtml  formatImageUrl  haptic  showToast
     confirmDialog / showFormModal  (ixtiyoriy)

   Endpointlar (backend nomlari O'ZGARMAYDI):
     POST /api/admin/equipment/list
     POST /api/admin/equipment/stats
     POST /api/admin/equipment/save
     POST /api/admin/equipment/status
     POST /api/admin/equipment/archive
     POST /api/admin/equipment/history
     POST /api/admin/equipment/validate-publish
     POST /api/admin/equipment/category/save
     POST /api/admin/equipment/subtype/save
     POST /api/admin/equipment/manufacturer/save
   ====================================================== */
(function () {
  'use strict';

  function G(n) { return window[n]; }
  function api(p, b) { return G('api')(p, b); }
  function esc(v) { return G('escapeHtml') ? G('escapeHtml')(v) : String(v ?? ''); }
  function buzz(s) { if (G('haptic')) G('haptic')(s || 'light'); }
  function toast(m) { if (G('showToast')) G('showToast')(m); }
  function ET(k, p) { return G('ET') ? G('ET')(k, p) : k; }

  // ======================================================
  // STATE
  // ======================================================
  const state = {
    loaded: false,
    loading: false,
    error: null,
    items: [],
    stats: null,
    categories: [],
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    statusFilter: 'all',
    search: '',
    busy: new Set(),        // "publish:<id>" — duplicate request bloklanadi
    validation: {}          // id -> {ready, missing}
  };

  let searchTimer = null;

  // ======================================================
  // DATA
  // ======================================================
  async function load(force) {
    if (state.loaded && !force) return;
    state.loading = true;
    state.error = null;
    try {
      const [list, stats, cats] = await Promise.all([
        api('/api/admin/equipment/list', {
          status: state.statusFilter, page: state.page,
          limit: Math.min(state.limit, 100),
          search: state.search || undefined
        }),
        api('/api/admin/equipment/stats', {}).catch(() => ({ ok: false })),
        api('/api/equipment/categories', {}).catch(() => ({ ok: false }))
      ]);
      if (list && list.ok) {
        state.items = Array.isArray(list.items) ? list.items : [];
        state.total = (list.pagination && list.pagination.total) || state.items.length;
        state.totalPages = (list.pagination && list.pagination.total_pages) || 0;
        state.loaded = true;
      } else {
        state.error = (list && list.error) || 'Ro‘yxatni yuklab bo‘lmadi';
      }
      if (stats && stats.ok) state.stats = stats;
      if (cats && cats.ok) state.categories = Array.isArray(cats.categories) ? cats.categories : [];
    } catch (e) {
      state.error = ET('equipment.errorNet');
    } finally {
      state.loading = false;
    }
  }

  // Publish oldidan tekshirish — validation kelganda tugma faollashadi
  async function validateAll() {
    const ids = state.items.map(function (i) { return i.id; });
    const out = {};
    await Promise.all(ids.map(async function (id) {
      try {
        const r = await api('/api/admin/equipment/validate-publish', { id: id });
        if (r && r.ok) out[id] = { ready: r.ready, missing: r.missing || [] };
      } catch (e) { /* validatsiya ixtiyoriy */ }
    }));
    state.validation = out;
    rerender();
  }

  // ======================================================
  // ACTIONS
  // ======================================================
  async function setStatus(id, status, verification) {
    const key = status + ':' + id;
    if (state.busy.has(key)) return;         // AGENTS.md #9 — double-click himoyasi
    state.busy.add(key);
    rerender();
    try {
      const b = { id: id };
      if (status) b.status = status;
      if (verification) b.verification_status = verification;
      const r = await api('/api/admin/equipment/status', b);
      if (r && r.ok) {
        const it = state.items.find(function (x) { return x.id === id; });
        if (it) {
          if (status) it.status = status;
          if (verification) it.verification_status = verification;
        }
        toast('Saqlandi');
        // Publish qilinganda ro'yxat qayta yuklanadi (public API darhol ko'radi)
        if (status === 'published') await load(true);
      } else {
        toast((r && r.error) || 'Xatolik yuz berdi');
        const v = await api('/api/admin/equipment/validate-publish', { id: id });
        if (v && v.ok && !v.ready) {
          toast('Yetishmaydi: ' + v.missing.join(', '));
          state.validation[id] = { ready: false, missing: v.missing };
        }
      }
    } catch (e) {
      toast(ET('equipment.errorGeneric'));
    } finally {
      state.busy.delete(key);
      rerender();
    }
  }

  async function archive(id) {
    if (state.busy.has('arch:' + id)) return;
    const ok = window.confirm ? window.confirm(ET('equipment.delete')) : true;
    if (!ok) return;
    state.busy.add('arch:' + id);
    rerender();
    try {
      const r = await api('/api/admin/equipment/archive', { id: id });
      if (r && r.ok) { toast('Arxivlandi'); await load(true); }
      else toast((r && r.error) || 'Xatolik');
    } catch (e) {
      toast(ET('equipment.errorGeneric'));
    } finally {
      state.busy.delete('arch:' + id);
      rerender();
    }
  }

  function onSearch(v) {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      state.search = String(v || '').trim();
      state.page = 1;
      state.loaded = false;
      load().then(rerender);
    }, 350);
  }

  function rerender() {
    if (G('renderAdminPanel')) G('renderAdminPanel')();
  }

  // ======================================================
  // RENDER
  // ======================================================
  function render() {
    let body;
    if (state.loading && !state.items.length) {
      body = skeleton();
    } else if (state.error && !state.items.length) {
      body = errorHtml(state.error);
    } else {
      body = listHtml();
    }

    return `
      <div class="eqa-scope">
        <div class="eqa-container">
          <div class="eqa-head">
            <button class="eqa-back" onclick="equipmentAdminUi.back()" aria-label="${esc(ET('equipment.back'))}">←</button>
            <h1 class="eqa-title">⚙️ ${esc(ET('equipment.title'))} — Admin</h1>
          </div>
          ${statsHtml()}
          ${toolbarHtml()}
          ${body}
        </div>
      </div>`;
  }

  function statsHtml() {
    if (!state.stats) return '';
    const s = state.stats;
    const by = s.by_status || {};
    return `<div class="eqa-stats">
      ${statCard(by.published, 'published', '🟢')}
      ${statCard(by.draft, 'draft', '⚪')}
      ${statCard(by.pending_review, 'pending_review', '🟡')}
      ${statCard(by.archived, 'archived', '⚫')}
    </div>`;
  }

  function statCard(n, key, dot) {
    return `<button class="eqa-stat ${state.statusFilter === key ? 'active' : ''}"
      onclick="equipmentAdminUi.setFilter('${key}')">
      <span class="eqa-stat-dot">${dot}</span>
      <span class="eqa-stat-n">${Number(n || 0)}</span>
      <span class="eqa-stat-k">${esc(key)}</span>
    </button>`;
  }

  function toolbarHtml() {
    const f = state.statusFilter;
    return `<div class="eqa-toolbar">
      <div class="eqa-search">
        <input type="search" class="eqa-search-input" placeholder="${esc(ET('equipment.searchPh'))}"
          value="${esc(state.search)}" oninput="equipmentAdminUi.onSearch(this.value)" autocomplete="off" />
      </div>
      <div class="eqa-filter-chips">
        ${chip('all', 'Barchasi', f)}
        ${chip('draft', 'draft', f)}
        ${chip('pending_review', 'pending_review', f)}
        ${chip('published', 'published', f)}
        ${chip('archived', 'archived', f)}
      </div>
    </div>`;
  }

  function chip(v, label, cur) {
    return `<button class="eqa-chip ${cur === v ? 'active' : ''}"
      onclick="equipmentAdminUi.setFilter('${v}')">${esc(label)}</button>`;
  }

  function listHtml() {
    if (!state.items.length) {
      return emptyHtml(ET('equipment.notFound'), ET('equipment.notFoundHint'));
    }
    let h = `<div class="eqa-list">`;
    state.items.forEach(function (it) { h += rowHtml(it); });
    h += '</div>';

    if (state.page < state.totalPages) {
      h += `<div class="eqa-more-wrap">
        <button class="eqa-more" onclick="equipmentAdminUi.loadMore()" ${state.loading ? 'disabled' : ''}>
          ${esc(ET('equipment.loadMore'))}
        </button></div>`;
    }
    return h;
  }

  function rowHtml(it) {
    const id = it.id;
    const st = it.status || 'draft';
    const vs = it.verification_status || 'pending';
    const v = state.validation[id];
    const busyPub = state.busy.has('published:' + id) || state.busy.has('pending_review:' + id);
    const busyArch = state.busy.has('arch:' + id);

    // Publish tugmasi: draft/pending_review/archived da, validation tekshirilgan bo'lsa
    const canPublish = st !== 'published';
    const pubLabel = st === 'draft' ? '⏩ pending_review' : (st === 'pending_review' ? '🚀 Publish' : '↩ draft');
    const pubNext = st === 'draft' ? 'pending_review' : (st === 'pending_review' ? 'published' : 'draft');

    return `<div class="eqa-row">
      <div class="eqa-row-top">
        <div class="eqa-row-main">
          <div class="eqa-row-name">${esc(it.name_uz || it.slug)}</div>
          <div class="eqa-row-meta">
            <span class="eqa-badge ${esc(st)}">${esc(st)}</span>
            <span class="eqa-badge v-${esc(vs)}">${esc(vs)}</span>
            <span class="eqa-brand">${esc(it.brand || it.manufacturer_name || '')}</span>
            ${it.model ? `<span class="eqa-model">${esc(it.model)}</span>` : ''}
          </div>
        </div>
        ${it.cover_image ? `<img class="eqa-row-img" src="${esc(it.cover_image)}" alt="" loading="lazy"
            onerror="this.style.visibility='hidden'" />` : `<div class="eqa-row-noimg">📦</div>`}
      </div>

      ${v && !v.ready ? `<div class="eqa-warn">⚠️ Yetishmaydi: ${esc(v.missing.join(', '))}</div>` : ''}
      ${v && v.ready ? `<div class="eqa-ok">✅ ${esc(ET('equipment.verified'))}</div>` : ''}

      <div class="eqa-row-actions">
        <button class="eqa-act" onclick="equipmentAdminUi.validate('${id}')"
          title="validate-publish">🔍</button>
        <button class="eqa-act" onclick="equipmentAdminUi.verify('${id}')"
          title="verification_status">${vs === 'verified' ? '✅' : '⚠️'}</button>
        <button class="eqa-act primary ${busyPub ? 'busy' : ''}"
          ${canPublish ? '' : 'disabled'}
          onclick="equipmentAdminUi.setStatus(${id},'${pubNext}')">${esc(pubLabel)}</button>
        <button class="eqa-act danger ${busyArch ? 'busy' : ''}"
          onclick="equipmentAdminUi.archive(${id})">🗄️</button>
      </div>
    </div>`;
  }

  // ======================================================
  // STATES
  // ======================================================
  function skeleton() {
    let h = '<div class="eqa-list">';
    for (let i = 0; i < 5; i++) {
      h += `<div class="eqa-row eqa-skel-row">
        <div class="eqa-skel eqa-skel-line eqa-w60"></div>
        <div class="eqa-skel eqa-skel-line eqa-w35"></div>
      </div>`;
    }
    return h + '</div>';
  }

  function emptyHtml(title, text) {
    return `<div class="eqa-empty">
      <div class="eqa-empty-icon">📦</div>
      <p class="eqa-empty-title">${esc(title)}</p>
      <p class="eqa-empty-text">${esc(text)}</p>
    </div>`;
  }

  function errorHtml(msg) {
    return `<div class="eqa-empty">
      <div class="eqa-empty-icon">⚠️</div>
      <p class="eqa-empty-title">${esc(ET('equipment.errorTitle'))}</p>
      <p class="eqa-empty-text">${esc(msg)}</p>
      <button class="eqa-retry" onclick="equipmentAdminUi.retry()">${esc(ET('equipment.retry'))}</button>
    </div>`;
  }

  // ======================================================
  // PUBLIC API
  // ======================================================
  window.equipmentAdminUi = {
    // app.js renderAdminPanel() shuni chaqiradi
    render: function () {
      if (!state.loaded && !state.loading) load().then(rerender);
      return render();
    },

    load: function (force) { return load(force); },

    back: function () {
      buzz();
      if (G('adminGoBack')) G('adminGoBack')();
    },

    setFilter: function (f) {
      buzz();
      state.statusFilter = f;
      state.page = 1;
      state.loaded = false;
      load(true).then(rerender);
    },

    onSearch: onSearch,

    loadMore: function () {
      buzz();
      state.page += 1;
      load().then(rerender);
    },

    setStatus: function (id, status) { buzz('light'); return setStatus(id, status); },

    verify: function (id) {
      buzz('light');
      const it = state.items.find(function (x) { return x.id === id; });
      const next = it && it.verification_status === 'verified' ? 'pending' : 'verified';
      return setStatus(id, null, next);
    },

    archive: function (id) { buzz(); return archive(id); },

    validate: function (id) { buzz('light'); return validateAll().then(function () { return id; }); },
    validateAll: function () { return validateAll(); },

    retry: function () {
      state.loaded = false;
      state.error = null;
      load(true).then(rerender);
    },

    reset: function () {
      state.loaded = false;
      state.page = 1;
      state.statusFilter = 'all';
      state.search = '';
      state.validation = {};
    },

    _state: state
  };
})();
