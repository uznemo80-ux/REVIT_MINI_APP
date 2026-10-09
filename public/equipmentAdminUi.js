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
          ${bulkHtml()}
          ${toolbarHtml()}
          ${body}
        </div>
      </div>`;
  }

  // Server by_status'ni [{status, verification_status, n}] massiv ko'rinishida qaytaradi —
  // UI esa { draft: 10, ... } kutardi, shuning uchun kartalar doim 0 ko'rsatardi.
  function byStatus() {
    const raw = (state.stats && state.stats.by_status) || {};
    if (!Array.isArray(raw)) return raw;
    const out = {};
    raw.forEach(function (r) { out[r.status] = (out[r.status] || 0) + Number(r.n || 0); });
    return out;
  }

  function statsHtml() {
    if (!state.stats) return '';
    const by = byStatus();
    return `<div class="eqa-stats">
      ${statCard(by.published, 'published', '🟢')}
      ${statCard(by.draft, 'draft', '⚪')}
      ${statCard(by.pending_review, 'pending_review', '🟡')}
      ${statCard(by.archived, 'archived', '⚫')}
    </div>`;
  }

  const STATUS_UZ = { all: 'Barchasi', draft: 'Qoralama', pending_review: 'Ko‘rib chiqilmoqda', published: 'Nashr qilingan', archived: 'Arxiv' };
  const VERIF_UZ = { pending: 'Tekshirilmagan', verified: 'Tekshirilgan', failed: 'Xato topilgan' };
  function stUz(k) { return STATUS_UZ[k] || k; }

  // Nashr qilinmagan (qoralama + ko'rib chiqilmoqda) va tekshiruvdan o'tganlarni bittada nashr qilish
  async function publishAllReady() {
    if (state.bulkBusy) return;
    const ids = [];
    for (const st of ['draft', 'pending_review']) {
      const r = await api('/api/admin/equipment/list', { status: st, page: 1, limit: 100 }).catch(function () { return null; });
      if (r && r.ok) r.items.forEach(function (it) { ids.push(it.id); });
    }
    if (!ids.length) { toast('Nashr qilinmagan jihoz yo‘q'); return; }
    const go = async function () {
      state.bulkBusy = true; rerender();
      let ok = 0; const skipped = [];
      for (const id of ids) {
        const v = await api('/api/admin/equipment/validate-publish', { id: id }).catch(function () { return null; });
        if (!v || !v.ok || !v.ready) { skipped.push(id); continue; }
        const r = await api('/api/admin/equipment/status', { id: id, status: 'published' }).catch(function () { return null; });
        if (r && r.ok) ok++; else skipped.push(id);
      }
      state.bulkBusy = false;
      toast(ok + ' ta jihoz nashr qilindi' + (skipped.length ? ', ' + skipped.length + ' tasi ma’lumoti to‘liq emas' : ''));
      await load(true); rerender();
    };
    const msg = ids.length + ' ta jihoz nashr qilinmagan. Tekshiruvdan o‘tganlari o‘quvchilarga ko‘rinadigan bo‘ladi.';
    if (typeof G('showConfirm') === 'function') G('showConfirm')('Nashr qilinsinmi?', msg, 'Nashr qilish', go);
    else if (window.confirm(msg)) go();
  }

  function statCard(n, key, dot) {
    return `<button class="eqa-stat ${state.statusFilter === key ? 'active' : ''}"
      onclick="equipmentAdminUi.setFilter('${key}')">
      <span class="eqa-stat-dot">${dot}</span>
      <span class="eqa-stat-n">${Number(n || 0)}</span>
      <span class="eqa-stat-k">${esc(stUz(key))}</span>
    </button>`;
  }

  function bulkHtml() {
    const by = byStatus();
    const pending = Number(by.draft || 0) + Number(by.pending_review || 0);
    if (!pending) return '';
    return `<div class="eqa-bulk">
      <div class="eqa-bulk-text"><b>${pending} ta jihoz o‘quvchilarga ko‘rinmayapti.</b> Ular nashr qilinmaguncha Kutubxona → Materiallar → Jihozlar bo‘sh chiqadi.</div>
      <button class="eqa-bulk-btn" ${state.bulkBusy ? 'disabled' : ''} onclick="equipmentAdminUi.publishAllReady()">${state.bulkBusy ? 'Nashr qilinmoqda…' : 'Tayyorlarini nashr qilish'}</button>
    </div>`;
  }

  function toolbarHtml() {
    const f = state.statusFilter;
    return `<div class="eqa-toolbar">
      <div class="eqa-search">
        <input type="search" class="eqa-search-input" placeholder="${esc(ET('equipment.searchPh'))}"
          value="${esc(state.search)}" oninput="equipmentAdminUi.onSearch(this.value)" autocomplete="off" />
      </div>
      <div class="eqa-filter-chips">
        ${chip('all', stUz('all'), f)}
        ${chip('draft', stUz('draft'), f)}
        ${chip('pending_review', stUz('pending_review'), f)}
        ${chip('published', stUz('published'), f)}
        ${chip('archived', stUz('archived'), f)}
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
    const pubLabel = st === 'archived' ? 'Qoralamaga qaytarish' : 'Nashr qilish';
    const pubNext = st === 'archived' ? 'draft' : 'published';

    return `<div class="eqa-row">
      <div class="eqa-row-top">
        <div class="eqa-row-main">
          <div class="eqa-row-name">${esc(it.name_uz || it.slug)}</div>
          <div class="eqa-row-meta">
            <span class="eqa-badge ${esc(st)}">${esc(stUz(st))}</span>
            <span class="eqa-badge v-${esc(vs)}">${esc(VERIF_UZ[vs] || vs)}</span>
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
          title="Nashrga tayyorligini tekshirish" aria-label="Tekshirish">🔍</button>
        <button class="eqa-act" onclick="equipmentAdminUi.verify('${id}')"
          title="Tekshirilgan deb belgilash" aria-label="Tekshirilgan">${vs === 'verified' ? '✅' : '⚠️'}</button>
        <button class="eqa-act primary ${busyPub ? 'busy' : ''}"
          ${canPublish ? '' : 'disabled'}
          onclick="equipmentAdminUi.setStatus(${id},'${pubNext}')">${esc(pubLabel)}</button>
        <button class="eqa-act danger ${busyArch ? 'busy' : ''}"
          onclick="equipmentAdminUi.archive(${id})" title="Arxivlash" aria-label="Arxivlash">🗄️</button>
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
    publishAllReady: function () { buzz('light'); return publishAllReady(); },

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
