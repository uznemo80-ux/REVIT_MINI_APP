/* ======================================================
   YOSHUZBEKK — EQUIPMENT (JIHOZLAR) UI MODULE
   ======================================================
   Alohida modul. app.js ga TEGILMAYDI — tashqi funksiyalardan
   foydalanadi (window orqali):
     api(path, body)            — mavjud POST client
     escapeHtml(value)          — mavjud
     formatImageUrl(url)        — mavjud
     haptic(style)              — mavjud
     showToast(msg)             — mavjud
     render()                   — mavjud qayta render
     openLibrarySection(slug)   — mavjud kutubxona ochish
   Bootstrap: equipmentUi.init({...}) — app.js dan chaqiriladi.

   Endpointlar (backend nomlari O'ZGARMAYDI):
     POST /api/equipment/categories
     POST /api/equipment
     POST /api/equipment/:slug
     POST /api/equipment/toggle-like
     POST /api/equipment/toggle-save
     POST /api/equipment/my-state
     POST /api/equipment/saved
   ====================================================== */
(function () {
  'use strict';

  // --- Global dan mavjud yordamchilarni olamiz ---
  function G(name) { return window[name]; }
  // Equipment i18n (public/equipmentI18n.js). Kiritilmasa o'zbekchaga qaytadi.
  function ET(key, params) { return G('ET') ? G('ET')(key, params) : key; }
  function api(p, b) { return G('api')(p, b); }
  function esc(v) { return G('escapeHtml') ? G('escapeHtml')(v) : String(v ?? ''); }
  function imgUrl(u) { return G('formatImageUrl') ? G('formatImageUrl')(u) : (u || ''); }
  function buzz(s) { if (G('haptic')) G('haptic')(s || 'light'); }

  // Analytics — mavjud trackAnalyticsEvent global'ini ishlatadi.
  // Schema o'zgartirmaydi: /api/analytics/track event_type'ni erkin qabul qiladi.
  // Mavjud dashboard va API tegilmaydi.
  function track(eventType, contentId, metadata) {
    var fn = G('trackAnalyticsEvent');
    if (!fn) return;
    try {
      var p = fn('equipment_' + eventType, 'equipment', contentId || null, metadata || {}, 0);
      if (p && typeof p.catch === 'function') p.catch(function () {});
    } catch (e) { /* telemetry — non-blocking */ }
  }
  function toast(m) { if (G('showToast')) G('showToast')(m); }

  // ======================================================
  // STATE
  // ======================================================
  const state = {
    loaded: false,
    loading: false,
    error: null,

    categories: [],
    brands: [],
    installationTypes: [],

    // ro'yxat
    items: [],
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    loadingMore: false,

    // filtrlar
    category: null,
    subcategory: null,
    filters: {},              // { param_key: value }
    search: '',
    sort: 'newest',
    savedOnly: false,

    // like/save
    liked: new Set(),
    saved: new Set(),
    pendingFlags: new Set(),  // "like:<id>" / "save:<id>" — duplicate request bloklanadi

    // detail
    detail: null,
    detailLoading: false,
    detailError: null,

    galleryIndex: 0
  };

  // Debounce uchun
  let searchTimer = null;

  // ======================================================
  // YORDAMCHILAR
  // ======================================================

  function slugify(s) {
    return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function formatDims(it) {
    const p = [];
    if (it.width_mm) p.push('W ' + it.width_mm);
    if (it.height_mm) p.push('H ' + it.height_mm);
    if (it.depth_mm) p.push('D ' + it.depth_mm);
    return p.join(' × ') || null;
  }

  // NULL qiymat — "Ishlab chiqaruvchi tomonidan ko'rsatilmagan"
  // (NOT_SPECIFIED_BY_MANUFACTURER tokeni UI'da KO'RSATILMAYDI)
  const NOT_SPEC = function () { return ET('equipment.notSpecified'); };

  function specValue(v) {
    if (v === null || v === undefined || v === '') return null;
    return String(v);
  }

  function isArchNote(noteUz) {
    return /^ARXITEKT\s+TAVSIYASI/i.test(String(noteUz || '').trim());
  }

  // Eng katta 2 ta manfaatli filter parametrini ko'rsatish (card'da)
  function cardSpecs(item) {
    return [];
  }

  // ======================================================
  // DATA LOADING
  // ======================================================

  async function loadCategories(force) {
    if (state.loaded && !force) return;
    state.loading = true;
    state.error = null;
    try {
      const r = await api('/api/equipment/categories');
      if (r && r.ok) {
        state.categories = Array.isArray(r.categories) ? r.categories : [];
        state.brands = Array.isArray(r.brands) ? r.brands : [];
        state.installationTypes = Array.isArray(r.installation_types) ? r.installation_types : [];
        state.loaded = true;
      }
    } catch (e) {
      state.error = ET('equipment.errorGeneric');
    } finally {
      state.loading = false;
    }
  }

  async function loadMyState() {
    try {
      const r = await api('/api/equipment/my-state');
      if (r && r.ok) {
        state.liked = new Set((r.liked_ids || []).map(Number));
        state.saved = new Set((r.saved_ids || []).map(Number));
      }
    } catch (e) { /* like/save optional */ }
  }

  function listPayload(extra) {
    const b = {
      page: state.page,
      limit: Math.min(state.limit, 100),
      sort: state.sort
    };
    if (state.category) b.category = state.category;
    if (state.subcategory) b.subcategory = state.subcategory;
    if (state.search) b.search = state.search;
    // NOTE: 'saved' filtri backend list endpointida YO'Q.
    // Saved ro'yxat alohida /api/equipment/saved orqali yuklanadi
    // (loadList ichida savedOnly tekshiruvi) — yolg'on parametr yubormaymiz.
    Object.keys(state.filters).forEach(function (k) {
      b['f_' + k] = state.filters[k];
    });
    if (extra) for (var k in extra) b[k] = extra[k];
    return b;
  }

  async function loadList(append) {
    if (append) {
      if (state.loadingMore) return;
      state.loadingMore = true;
    } else {
      state.loading = true;
    }
    state.error = null;
    try {
      // Saved ro'yxat — alohida endpoint (backend list'ga saved filtrini
      // qo'shmagan, shuning uchun albatta shu yo'l ishlatiladi).
      const r = state.savedOnly
        ? await api('/api/equipment/saved', { page: state.page, limit: Math.min(state.limit, 100) })
        : await api('/api/equipment', listPayload());
      if (r && r.ok) {
        const items = Array.isArray(r.items) ? r.items : [];
        state.items = append ? state.items.concat(items) : items;
        state.page = (r.pagination && r.pagination.page) || state.page;
        state.limit = (r.pagination && r.pagination.limit) || state.limit;
        state.total = (r.pagination && r.pagination.total) || 0;
        state.totalPages = (r.pagination && r.pagination.total_pages) || 0;
      } else {
        state.error = (r && r.error) || ET('equipment.errorGeneric');
      }
    } catch (e) {
      state.error = ET('equipment.errorNet');
    } finally {
      state.loading = false;
      state.loadingMore = false;
    }
  }

  async function loadDetail(slug) {
    state.detailLoading = true;
    state.detailError = null;
    state.detail = null;
    try {
      const r = await api('/api/equipment/' + slug);
      if (r && r.ok && r.item) {
        state.detail = r.item;
        state.galleryIndex = 0;
      } else {
        state.detailError = (r && r.error) || ET('equipment.notFound');
      }
    } catch (e) {
      state.detailError = ET('equipment.errorGeneric');
    } finally {
      state.detailLoading = false;
    }
  }

  // ======================================================
  // ACTIONS (like / save)
  // ======================================================

  async function toggleFlag(kind, id, btn) {
    const key = kind + ':' + id;
    if (state.pendingFlags.has(key)) return;   // duplicate request bloklanadi
    state.pendingFlags.add(key);
    if (btn) btn.classList.add('busy');

    const wasSet = kind === 'like' ? state.liked : state.saved;
    // Optimistik UI — darhol feedback
    wasSet.has(id) ? wasSet.delete(id) : wasSet.add(id);
    render();

    try {
      const r = await api('/api/equipment/toggle-' + kind, { id: id });
      if (!r || !r.ok) throw new Error('sync failed');
      // Server bilan sync
      if (r.active) wasSet.add(id); else wasSet.delete(id);
      if (btn && r.count !== undefined) {
        const c = btn.querySelector('.eq-count');
        if (c) c.textContent = r.count;
      }
    } catch (e) {
      // Rollback
      if (r_active_guess(kind, id)) wasSet.delete(id); else wasSet.add(id);
      toast(ET('equipment.errorGeneric'));
    } finally {
      state.pendingFlags.delete(key);
      render();
    }
  }

  // optimistic o'zgarishni aniqlash (rollback uchun)
  function r_active_guess(kind, id) {
    return kind === 'like' ? state.liked.has(id) : state.saved.has(id);
  }

  // ======================================================
  // RENDER — HEADER
  // ======================================================
  function renderHeaderHtml(title, subtitle, opts) {
    opts = opts || {};
    return `
      <div class="equipment-header">
        <div class="equipment-container">
          <div class="equipment-header-row">
            <button class="equipment-back-btn" onclick="equipmentUi.back()" aria-label="Orqaga">←</button>
            <div class="equipment-title-wrap">
              <h1 class="equipment-title">${esc(title)}</h1>
              ${subtitle ? `<p class="equipment-subtitle">${esc(subtitle)}</p>` : ''}
            </div>
            ${opts.extra || ''}
          </div>
        </div>
      </div>`;
  }

  // ======================================================
  // RENDER — HOME (kategoriyalar)
  // ======================================================
  function renderHomeHtml() {
    let body = '';

    if (state.loading && !state.loaded) {
      body = '<div class="equipment-container">' + skeletonCards(4) + '</div>';
    } else if (state.error && !state.loaded) {
      body = '<div class="equipment-container">' + errorHtml(state.error) + '</div>';
    } else {
      body = '<div class="equipment-container">';
      body += '<div class="equipment-cat-grid">';
      state.categories.forEach(function (c) {
        const filterCount = Array.isArray(c.filters) ? c.filters.length : 0;
        const subCount = Array.isArray(c.subcategories) ? c.subcategories.length : 0;
        body += `
          <button class="equipment-cat-card" onclick="equipmentUi.openCategory('${esc(c.slug)}')">
            <span class="equipment-cat-icon">${esc(c.icon || '⚙️')}</span>
            <p class="equipment-cat-name">${esc(c.name_uz || c.name_ru || '')}</p>
            <p class="equipment-cat-desc">${esc(c.description_uz || '')}</p>
            <div class="equipment-cat-meta">
              ${subCount ? `<span class="equipment-cat-badge">${subCount} ${esc(ET('equipment.type'))}</span>` : ''}
              ${filterCount ? `<span class="equipment-cat-badge">${filterCount} ${esc(ET('equipment.filters'))}</span>` : ''}
            </div>
          </button>`;
      });
      body += '</div>';

      // Saqlangan jihozlar
      if (state.saved.size > 0) {
        body += `<div style="margin-top:26px">
          <div class="equipment-section-title" style="margin-bottom:10px">🔖 ${esc(ET('equipment.saved'))}</div>
          <div class="equipment-grid">${state.items.length ? '' : ''}</div>
        </div>`;
      }

      if (!state.categories.length) {
        body = '<div class="equipment-container">' + emptyHtml(ET('equipment.notFound'), ET('equipment.notFoundHint')) + '</div>';
      }
      body += '</div>';
    }

    return `
      <div class="equipment-scope equipment-page-enter">
        ${renderHeaderHtml('⚙️ ' + ET('equipment.title'), ET('equipment.subtitle'))}
        ${body}
      </div>`;
  }

  // ======================================================
  // RENDER — LIST
  // ======================================================
  function renderListHtml() {
    const cat = state.categories.find(function (c) { return c.slug === state.category; });
    const catName = cat ? (cat.name_uz || cat.slug) : ET('equipment.title');

    let body = '<div class="equipment-container">';

    // Dynamic filter chips — backend'dan kelgan categories[].filters
    const chips = buildFilterChips(cat);
    if (chips) {
      body += `<div class="equipment-filters-bar">${chips}</div>`;
    }

    if (state.loading && !state.items.length) {
      body += skeletonCards(4);
    } else if (state.error && !state.items.length) {
      body += errorHtml(state.error);
    } else if (!state.items.length) {
      body += emptyHtml(
        ET('equipment.notFound'),
        state.search ? state.search + ' — ' + ET('equipment.searchEmpty')
                     : ET('equipment.notFoundHint')
      );
    } else {
      body += '<div class="equipment-grid">';
      state.items.forEach(function (it) { body += cardHtml(it); });
      body += '</div>';

      // "Yana yuklash"
      if (state.page < state.totalPages) {
        body += `<div class="equipment-load-more-wrap">
          <button class="equipment-load-more" onclick="equipmentUi.loadMore()" ${state.loadingMore ? 'disabled' : ''}>
            ${state.loadingMore ? esc(ET('equipment.loading')) : esc(ET('equipment.loadMore'))}
          </button>
        </div>`;
      }
    }

    body += '</div>';

    return `
      <div class="equipment-scope equipment-page-enter">
        ${renderHeaderHtml(
          '⚙️ ' + catName,
          state.total ? state.total + ' ' + ET('equipment.found') : '',
          { extra: `<button class="equipment-action-btn ${state.savedOnly ? 'saved' : ''}"
                      onclick="equipmentUi.toggleSavedOnly()"
                      style="min-width:38px;padding:0 10px"
                      aria-label="${esc(ET('equipment.savedBtn'))}">🔖</button>` }
        )}
        ${searchBarHtml()}
        ${body}
      </div>`;
  }

  function searchBarHtml() {
    const has = !!state.search;
    return `
      <div class="equipment-header" style="position:static;border-bottom:none;padding-top:0;background:transparent">
        <div class="equipment-container">
          <div class="equipment-search-wrap">
            <span class="equipment-search-icon">🔍</span>
            <input type="search" class="equipment-search-input" id="eq-search"
              placeholder="${esc(ET('equipment.searchPh'))}"
              value="${esc(state.search)}"
              oninput="equipmentUi.onSearch(this.value)"
              autocomplete="off" />
            <button class="equipment-search-clear ${has ? 'visible' : ''}"
              onclick="equipmentUi.clearSearch()" aria-label="${esc(ET('equipment.clearFilters'))}">✕</button>
          </div>
        </div>
      </div>`;
  }

  // Dinamik filterlar — HARDCODE YO'Q
  function buildFilterChips(cat) {
    if (!cat) return '';
    const chips = [];

    // "Barchasi"
    chips.push(`<button class="equipment-filter-chip ${!state.subcategory ? 'active' : ''}"
      onclick="equipmentUi.clearSubcategory()">${esc(ET('equipment.all'))}</button>`);

    // Subkategoriyalar
    (cat.subcategories || []).forEach(function (s) {
      const act = state.subcategory === s.slug ? 'active' : '';
      chips.push(`<button class="equipment-filter-chip ${act}"
        onclick="equipmentUi.setSubcategory('${esc(s.slug)}')">${esc(s.name_uz || s.slug)}</button>`);
    });

    // Dinamik parametrlar — faqat backend berganlar
    const filters = (cat.filters || []);
    if (filters.length) {
      chips.push(`<button class="equipment-filter-chip" onclick="equipmentUi.clearFilters()">↺ Filtrlarni tozalash</button>`);
      filters.forEach(function (f) {
        const v = state.filters[f.param_key];
        if (!v) return;
        chips.push(`<button class="equipment-filter-chip active"
          onclick="equipmentUi.setFilter('${esc(f.param_key)}','')">✕ ${esc(f.label_uz || f.param_key)}: ${esc(v)}</button>`);
      });
    }
    return chips.join('');
  }

  function cardHtml(it) {
    const id = it.id;
    const liked = state.liked.has(id);
    const saved = state.saved.has(id);
    const dims = formatDims(it);
    const cover = imgUrl(it.cover_image);

    const imgBlock = cover
      ? `<img class="equipment-card-img" src="${esc(cover)}" alt="${esc(it.name_uz || '')}"
            loading="lazy"
            onerror="this.style.display='none';this.parentNode.innerHTML='<div class=\\'equipment-img-placeholder\\'><span class=\\'eq-ph-icon\\'>📦</span><span>📦</span></div>'" />`
      : `<div class="equipment-img-placeholder"><span class="eq-ph-icon">📦</span><span>${esc(ET('equipment.noImage'))}</span></div>`;

    return `
      <div class="equipment-card" onclick="equipmentUi.openDetail('${esc(it.slug)}')">
        <div class="equipment-card-img-wrap">${imgBlock}</div>
        <div class="equipment-card-body">
          <div>
            ${it.brand || it.manufacturer ? `<div class="equipment-card-brand">${esc(it.brand || it.manufacturer)}</div>` : ''}
            <p class="equipment-card-name">${esc(it.name_uz || it.name_ru || it.name_en || '')}</p>
            ${it.model ? `<div class="equipment-card-model">${esc(it.model)}</div>` : ''}
            ${dims ? `<div class="equipment-card-specs"><span class="equipment-spec-pill">${esc(dims)} mm</span></div>` : ''}
          </div>
          <div class="equipment-card-actions">
            <button class="equipment-action-btn ${liked ? 'liked' : ''}"
              onclick="event.stopPropagation();equipmentUi.like(${id},this)"
              aria-label="${esc(ET('equipment.like'))}">${liked ? '❤️' : '🤍'}</button>
            <button class="equipment-action-btn ${saved ? 'saved' : ''}"
              onclick="event.stopPropagation();equipmentUi.save(${id},this)"
              aria-label="${esc(ET('equipment.save'))}">${saved ? '🔖' : '📑'}</button>
            ${it.source_count ? `<span class="equipment-spec-pill">${it.source_count} ${esc(ET('equipment.sources'))}</span>` : ''}
          </div>
        </div>
      </div>`;
  }

  // ======================================================
  // RENDER — DETAIL
  // ======================================================
  function renderDetailHtml() {
    let body;

    if (state.detailLoading) {
      body = '<div class="equipment-container">' + skeletonCards(2) + '</div>';
    } else if (state.detailError) {
      body = '<div class="equipment-container">' + errorHtml(state.detailError) + '</div>';
    } else if (!state.detail) {
      body = '<div class="equipment-container">' + emptyHtml(ET('equipment.notFound'), ET('equipment.delete')) + '</div>';
    } else {
      body = '<div class="equipment-container">' + detailInnerHtml(state.detail) + '</div>';
    }

    const html = `
      <div class="equipment-scope equipment-page-enter">
        ${renderHeaderHtml(ET('equipment.title'), '')}
        ${body}
      </div>`;
    // Gallery dots sinxronini ulash (DOM tayyor bo'lgandan keyin)
    if (!state.detailLoading && state.detail) setTimeout(bindGalleryScroll, 0);
    return html;
  }

  function detailInnerHtml(d) {
    const id = d.id;
    const liked = state.liked.has(id);
    const saved = state.saved.has(id);
    let h = '';

    // 1. Gallery
    h += galleryHtml(d);

    // 2. Nomi
    h += `<div class="equipment-detail-brand">${esc(d.brand || (d.manufacturer && d.manufacturer.name) || '')}</div>`;
    h += `<h2 class="equipment-detail-name">${esc(d.name_uz || d.name_ru || d.name_en || '')}</h2>`;

    // 3-4. Brand/Manufacturer + Model/SKU
    const chips = [];
    if (d.manufacturer && d.manufacturer.name) chips.push(esc(d.manufacturer.name));
    if (d.model) chips.push(esc(d.model));
    if (d.sku) chips.push('SKU: ' + esc(d.sku));
    if (chips.length) {
      h += '<div class="equipment-detail-chips">' +
           chips.map(function (c) { return `<span class="equipment-chip">${c}</span>`; }).join('') +
           '</div>';
    }

    // 5. Qisqa tavsif
    if (d.short_desc || d.description_uz) {
      h += `<p class="equipment-detail-desc">${esc(d.short_desc || d.description_uz)}</p>`;
    }

    // 6. O'lchamlar
    if (d.dimensions) {
      const dim = d.dimensions;
      h += `<div class="equipment-section">
        <div class="equipment-section-title">📏 ${esc(ET('equipment.dimensions'))}</div>
        <div class="equipment-dim-grid">
          ${dimCell(ET('equipment.width'), dim.width_mm)}
          ${dimCell(ET('equipment.height'), dim.height_mm)}
          ${dimCell(ET('equipment.depth'), dim.depth_mm)}
          ${dimCell(ET('equipment.weight'), dim.weight_kg, 'kg')}
        </div>
        ${dim.unit_note ? `<p style="font-size:11.5px;color:var(--text-muted);margin:9px 0 0;line-height:1.45">${esc(dim.unit_note)}</p>` : ''}
      </div>`;
    }

    // 7. Texnik xususiyatlar — DINAMIK
    if (d.specifications && d.specifications.length) {
      h += `<div class="equipment-section">
        <div class="equipment-section-title">⚡ ${esc(ET('equipment.specs'))}</div>
        <div class="equipment-spec-table">${d.specifications.map(specRowHtml).join('')}</div>
      </div>`;
    }

    // Afzalliklar / cheklovlar
    if ((d.advantages && d.advantages.length) || (d.limitations && d.limitations.length)) {
      h += '<div class="equipment-section">';
      if (d.advantages && d.advantages.length) {
        h += `<div class="equipment-section-title">✓ ${esc(ET('equipment.advantages'))}</div>
              <ul class="equipment-al-list">${d.advantages.map(function (a) {
                return `<li class="equipment-al-item adv"><span class="equipment-al-icon">✓</span><span>${esc(a)}</span></li>`;
              }).join('')}</ul>`;
      }
      if (d.limitations && d.limitations.length) {
        h += `<div class="equipment-section-title" style="margin-top:14px">⚠ ${esc(ET('equipment.limitations'))}</div>
              <ul class="equipment-al-list">${d.limitations.map(function (a) {
                return `<li class="equipment-al-item lim"><span class="equipment-al-icon">!</span><span>${esc(a)}</span></li>`;
              }).join('')}</ul>`;
      }
      h += '</div>';
    }

    // 8. Ulanishlar
    if (d.connections && d.connections.length) {
      h += `<div class="equipment-section">
        <div class="equipment-section-title">🔌 ${esc(ET('equipment.connections'))}</div>
        ${d.connections.map(function (c) {
          const sub = [c.spec_detail, c.diameter_mm ? '⌀' + c.diameter_mm + ' mm' : '', c.location]
            .filter(Boolean).join(' · ');
          return `<div class="equipment-list-row" style="cursor:default">
            <div class="equipment-list-icon">🔌</div>
            <div class="equipment-list-body">
              <p class="equipment-list-title">${esc(connLabel(c.conn_type))}</p>
              ${sub ? `<p class="equipment-list-sub">${esc(sub)}</p>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>`;
    }

    // 9. Montaj talablari
    if (d.installation) {
      const inst = d.installation;
      const clearance = inst.min_clearance && Object.keys(inst.min_clearance).length
        ? JSON.stringify(inst.min_clearance) : null;
      h += `<div class="equipment-section">
        <div class="equipment-section-title">🔧 ${esc(ET('equipment.installation'))}</div>
        <div class="equipment-spec-table">
          ${specRow(ET('equipment.mount'), inst.mount_type)}
          ${specRow(ET('equipment.location'), inst.location_note)}
          ${specRow('Eshik ochilish', inst.door_swing)}
          ${specRow(ET('equipment.service'), inst.service_space)}
          ${specRow('Izoh', inst.access_note)}
          ${clearance ? `<div class="equipment-spec-row"><div class="equipment-spec-label">${esc(ET('equipment.clearance'))}</div><div class="equipment-spec-value">${esc(clearance)}</div></div>` : ''}
        </div>
      </div>`;
    }

    // 10. Qo'llanish sohasi
    if (d.applications && d.applications.length) {
      h += `<div class="equipment-section">
        <div class="equipment-section-title">🏠 ${esc(ET('equipment.applications'))}</div>
        <div class="equipment-detail-chips">
          ${d.applications.map(function (a) {
            return `<span class="equipment-chip">${esc(a.room_type_ru || a.room_type)}</span>`;
          }).join('')}
        </div>
      </div>`;
    }

    // 11. Muhandislik izohlari — Arxitekt tavsiyasi ALOHIDA
    if (d.engineering_notes && d.engineering_notes.length) {
      const arch = d.engineering_notes.filter(function (n) { return isArchNote(n.note_uz); });
      const reg = d.engineering_notes.filter(function (n) { return !isArchNote(n.note_uz); });

      if (reg.length) {
        h += `<div class="equipment-section">
          <div class="equipment-section-title">📐 ${esc(ET('engineering.notes'))}</div>
          ${reg.map(function (n) {
            return `<div class="equipment-regular-note">${esc(n.note_uz)}</div>`;
          }).join('')}
        </div>`;
      }
      if (arch.length) {
        h += `<div class="equipment-section">
          <div class="equipment-section-title">💡 ${esc(ET('equipment.archAdvice'))}</div>
          ${arch.map(function (n) {
            return `<div class="equipment-arch-block">
              <div class="equipment-arch-badge">⚠️ ${esc(ET('equipment.notInSource'))}</div>
              <p class="equipment-arch-text">${esc(n.note_uz.replace(/^ARXITEKT\s+TAVSIYASI[^:]*:\s*/i, ''))}</p>
            </div>`;
          }).join('')}
        </div>`;
      }
    }

    // 12. Hujjatlar
    if (d.documents && d.documents.length) {
      h += `<div class="equipment-section">
        <div class="equipment-section-title">📄 ${esc(ET('equipment.documents'))}</div>
        ${d.documents.map(function (doc) {
          return `<a class="equipment-list-row" href="${esc(doc.url)}" target="_blank" rel="noopener">
            <div class="equipment-list-icon">📄</div>
            <div class="equipment-list-body">
              <p class="equipment-list-title">${esc(doc.title || doc.doc_type)}</p>
              <p class="equipment-list-sub">${esc(doc.file_format || '')} ${doc.verified ? '· tekshirilgan' : ''}</p>
            </div>
            <span class="equipment-list-arrow">↗</span>
          </a>`;
        }).join('')}
      </div>`;
    }

    // 13. Rasmiy manbalar
    if (d.sources && d.sources.length) {
      h += `<div class="equipment-section">
        <div class="equipment-section-title">🌐 ${esc(ET('equipment.sourcesList'))}</div>
        ${d.sources.map(function (s) {
          const badge = s.manufacturer_source ? ET('equipment.official') : ET('equipment.sources');
          const verified = s.verified ? ' · ' + ET('equipment.verified') : ' · ' + ET('equipment.unverified');
          return `<a class="equipment-list-row" href="${esc(s.source_url)}" target="_blank" rel="noopener">
            <div class="equipment-list-icon">${s.manufacturer_source ? '🏭' : '🔗'}</div>
            <div class="equipment-list-body">
              <p class="equipment-list-title">${esc(s.source_title || s.source_type)}</p>
              <p class="equipment-list-sub">${esc(badge + verified)}</p>
            </div>
            <span class="equipment-list-arrow">↗</span>
          </a>`;
        }).join('')}
      </div>`;
    }

    // Actions
    h += `<div class="equipment-detail-actions">
      <button class="equipment-detail-action ${liked ? 'liked' : ''}"
        onclick="equipmentUi.like(${id},this)">${liked ? '❤️' : '🤍'} ${esc(ET('equipment.like'))}</button>
      <button class="equipment-detail-action ${saved ? 'saved' : ''}"
        onclick="equipmentUi.save(${id},this)">${saved ? '🔖' : '📑'} ${esc(ET('equipment.save'))}</button>
    </div>`;

    return h;
  }

  function dimCell(label, val, unit) {
    const v = specValue(val);
    return `<div class="equipment-dim-cell">
      <div class="equipment-dim-label">${esc(label)}</div>
      <div class="equipment-dim-value">${v === null ? '—' : esc(v)}${v !== null && unit ? `<span class="equipment-dim-unit">${esc(unit)}</span>` : ''}</div>
    </div>`;
  }

  // Dinamik spec qatori
  function specRowHtml(s) {
    const v = specValue(s.value);
    if (v === null) {
      return `<div class="equipment-spec-row">
        <div class="equipment-spec-label">${esc(s.label_uz || s.key)}</div>
        <div class="equipment-spec-value not-specified">${esc(NOT_SPEC())}</div>
      </div>`;
    }
    return `<div class="equipment-spec-row">
      <div class="equipment-spec-label">${esc(s.label_uz || s.key)}</div>
      <div class="equipment-spec-value">${esc(v)}${s.unit ? `<span class="eq-unit">${esc(s.unit)}</span>` : ''}</div>
    </div>`;
  }

  function specRow(label, val) {
    const v = specValue(val);
    if (v === null) return '';
    return `<div class="equipment-spec-row">
      <div class="equipment-spec-label">${esc(label)}</div>
      <div class="equipment-spec-value">${esc(v)}</div>
    </div>`;
  }

  function connLabel(t) {
    const k = 'conn.' + t;
    const v = ET(k);
    return v === k ? t : v;
  }

  // Gallery scroll -> dots sinxroni (mavchi architecture'ga mos,
  // minimal va ishonchli: scrollBy da dots yangilanadi)
  function bindGalleryScroll() {
    const track = document.getElementById('eq-gal');
    const dotsWrap = document.getElementById('eq-gal-dots');
    if (!track || !dotsWrap) return;
    const dots = Array.from(dotsWrap.children);
    if (!dots.length) return;
    // Rasmlar 78% kenglik + gap bilan yotgani uchun scrollLeft ni
    // clientWidth ga bo'lish NOTO'G'RI indeks beradi.
    // getBoundingClientRect() scroll offsetni O'ZI hisobga oladi
    // (offsetLeft olmaydi — u qatlamga bog'liq), shuning uchun
    // track markaziga eng yaqin rasm topiladi.
    track.addEventListener('scroll', function () {
      const list = Array.prototype.slice.call(track.children);
      if (!list.length) return;
      const tRect = track.getBoundingClientRect();
      const center = tRect.left + tRect.width / 2;
      let best = 0, bestDist = Infinity;
      for (let i = 0; i < list.length; i++) {
        const r = list[i].getBoundingClientRect();
        const mid = r.left + r.width / 2;
        const dist = Math.abs(mid - center);
        if (dist < bestDist) { bestDist = dist; best = i; }
      }
      state.galleryIndex = Math.max(0, Math.min(best, dots.length - 1));
      dots.forEach(function (d, i) { d.classList.toggle('active', i === state.galleryIndex); });
    }, { passive: true });
  }

  function galleryHtml(d) {
    const imgs = (d.images || []).map(function (i) { return i.url; }).filter(Boolean);
    if (!imgs.length) {
      const cover = imgUrl(d.cover_image);
      if (cover) {
        return `<div class="equipment-detail-cover">
          <img src="${esc(cover)}" alt="${esc(d.name_uz || '')}" onerror="this.style.visibility='hidden'" />
        </div>`;
      }
      return `<div class="equipment-detail-cover" style="display:flex;align-items:center;justify-content:center">
        <div class="equipment-img-placeholder"><span class="eq-ph-icon">📦</span><span>${esc(ET('equipment.noImage'))}</span></div>
      </div>`;
    }
    if (imgs.length === 1) {
      return `<div class="equipment-detail-cover">
        <img src="${esc(imgUrl(imgs[0]))}" alt="${esc(d.name_uz || '')}"
          onclick="equipmentUi.lightbox('${esc(imgs[0])}')" onerror="this.style.visibility='hidden'" />
      </div>`;
    }
    return `<div class="equipment-gallery">
      <div class="equipment-gallery-track" id="eq-gal">
        ${imgs.map(function (u, i) {
          return `<div class="equipment-gallery-item">
            <img src="${esc(imgUrl(u))}" alt="${esc(d.name_uz || '')}"
              onclick="equipmentUi.lightbox('${esc(u)}')" loading="lazy" onerror="this.style.visibility='hidden'" />
          </div>`;
        }).join('')}
      </div>
      <div class="equipment-gallery-dots" id="eq-gal-dots">
        ${imgs.map(function (_, i) {
          return `<span class="equipment-gallery-dot ${i === 0 ? 'active' : ''}"></span>`;
        }).join('')}
      </div>
    </div>`;
  }

  // ======================================================
  // SKELETON / EMPTY / ERROR
  // ======================================================
  function skeletonCards(n) {
    let h = '<div class="equipment-grid">';
    for (var i = 0; i < (n || 4); i++) {
      h += `<div class="equipment-skeleton-card">
        <div class="equipment-skel equipment-skel-img"></div>
        <div class="equipment-skel-body">
          <div class="equipment-skel equipment-skel-line w45"></div>
          <div class="equipment-skel equipment-skel-line w90"></div>
          <div class="equipment-skel equipment-skel-line w70"></div>
        </div>
      </div>`;
    }
    return h + '</div>';
  }

  function emptyHtml(title, text) {
    return `<div class="equipment-empty">
      <div class="equipment-empty-icon">📦</div>
      <p class="equipment-empty-title">${esc(title)}</p>
      <p class="equipment-empty-text">${esc(text)}</p>
    </div>`;
  }

  function errorHtml(msg) {
    return `<div class="equipment-empty">
      <div class="equipment-empty-icon">⚠️</div>
      <p class="equipment-empty-title">${esc(ET('equipment.errorTitle'))}</p>
      <p class="equipment-empty-text">${esc(msg)}</p>
      <button class="equipment-retry-btn" onclick="equipmentUi.retry()">${esc(ET('equipment.retry'))}</button>
    </div>`;
  }

  // ======================================================
  // LIGHTBOX
  // ======================================================
  function lightbox(url) {
    const u = imgUrl(url);
    if (!u) return;
    const box = document.createElement('div');
    box.className = 'equipment-lightbox';
    box.innerHTML = `<button class="equipment-lightbox-close" aria-label="Yopish">✕</button>
      <img src="${esc(u)}" alt="" />`;
    box.addEventListener('click', function () { box.remove(); });
    document.body.appendChild(box);
  }

  // ======================================================
  // PUBLIC API (window.equipmentUi)
  // ======================================================
  let ctx = {
    getState: function () { return state; },
    load: function () {
      state.page = 1;
      loadCategories().then(function () { return loadList(false); });
    }
  };

  window.equipmentUi = {
    // Sahifalarni ochish (app.js routing'i chaqiradi)
    renderHome: function () {
      if (!state.loaded) ctx.load();
      return renderHomeHtml();
    },

    renderList: function () {
      if (!state.loaded) ctx.load();
      return renderListHtml();
    },

    renderDetail: function () {
      return renderDetailHtml();
    },

    isDetailOpen: function () { return !!state.detail || state.detailLoading; },
    isListOpen: function () { return !state.detail && !state.detailLoading && (!!state.category || !!state.search); },
    getDetailSlug: function () { return state.detail ? state.detail.slug : null; },

    // --- Navigatsiya ---
    openCategory: function (slug) {
      buzz();
      track('category_open', null, { category: slug });
      state.category = slug;
      state.subcategory = null;
      state.filters = {};
      state.search = '';
      state.page = 1;
      ctx.rerender();
      loadList(false).then(ctx.rerender);
    },

    openDetail: function (slug) {
      buzz();
      track('view', null, { slug: slug, category: state.category });
      state.detail = null;
      ctx.rerender();
      loadDetail(slug).then(ctx.rerender);
    },

    back: function () {
      buzz();
      if (state.detail || state.detailLoading) {
        state.detail = null;
        state.detailError = null;
        ctx.rerender();
        return;
      }
      // Bosh sahifada (kategoriya/qidiruv yo'q) — Kutubxonaga qaytamiz
      if (!state.category && !state.search && typeof window.closeLibrarySection === 'function') {
        window.closeLibrarySection();
        return;
      }
      state.category = null;
      state.subcategory = null;
      state.filters = {};
      state.search = '';
      state.page = 1;
      ctx.rerender();
      loadList(false).then(ctx.rerender);
    },

    // --- Search (debounce 350ms) ---
    onSearch: function (v) {
      const el = document.getElementById('eq-search');
      const clearBtn = el && el.parentNode.querySelector('.equipment-search-clear');
      if (clearBtn) clearBtn.classList.toggle('visible', !!v);

      if (searchTimer) clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        state.search = String(v || '').trim();
        state.page = 1;
        if (state.search) track('search', null, { query: state.search, category: state.category });
        loadList(false).then(ctx.rerender);
      }, 350);
    },

    clearSearch: function () {
      state.search = '';
      state.page = 1;
      const el = document.getElementById('eq-search');
      if (el) { el.value = ''; el.focus(); }
      const cb = el && el.parentNode.querySelector('.equipment-search-clear');
      if (cb) cb.classList.remove('visible');
      loadList(false).then(ctx.rerender);
    },

    // --- Filterlar ---
    setSubcategory: function (slug) {
      buzz();
      state.subcategory = slug;
      state.page = 1;
      ctx.rerender();
      loadList(false).then(ctx.rerender);
    },

    clearSubcategory: function () { equipmentUi.setSubcategory(null); },

    setFilter: function (key, val) {
      buzz();
      if (!val) delete state.filters[key];
      else state.filters[key] = val;
      state.page = 1;
      ctx.rerender();
      loadList(false).then(ctx.rerender);
    },

    clearFilters: function () {
      state.filters = {};
      state.page = 1;
      ctx.rerender();
      loadList(false).then(ctx.rerender);
    },

    // --- Pagination ---
    loadMore: function () {
      buzz();
      state.page = state.page + 1;
      loadList(true).then(ctx.rerender);
    },

    // --- Saved-only ro'yxat ---
    toggleSavedOnly: function () {
      buzz();
      track('saved_open', null, { enabled: !state.savedOnly });
      state.savedOnly = !state.savedOnly;
      state.page = 1;
      state.items = [];
      ctx.rerender();
      loadList(false).then(ctx.rerender);
    },

    // --- Like / Save ---
    like: function (id, btn) { buzz('light'); track('like', id); toggleFlag('like', id, btn); },
    save: function (id, btn) { buzz('light'); track('save', id); toggleFlag('save', id, btn); },

    // --- UI ---
    retry: function () {
      ctx.rerender();
      ctx.load();
    },

    lightbox: lightbox,

    // app.js routing uchun
    init: function (options) {
      ctx = Object.assign(ctx, options || {});
    },

    // Test/debug uchun
    _state: state
  };

  // Route o'zgarganda state tozalash
  window.addEventListener('equipmentUi:reset', function () {
    state.detail = null;
    state.detailError = null;
    state.category = null;
    state.subcategory = null;
    state.filters = {};
    state.search = '';
    state.page = 1;
  });
})();