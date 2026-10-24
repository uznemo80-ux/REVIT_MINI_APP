// ======================================================
// NORMATIV HUJJAT MATNINI ILOVA ICHIDA O'QISH
// Matn serverda lex.uz rasmiy sahifasidan olinadi va tozalanadi (/api/normatives/text/:id).
// Pastda har doim lex.uz saytidagi asl sahifaga havola qoladi.
// app.js dagi umumiy funksiyalardan foydalanadi: api, render, escapeHtml, haptic, safeOpenExternal.
// ======================================================
(function () {
  "use strict";

  const cache = new Map();          // docId -> server javobi
  const FONT_KEY = "yosh_nrd_font";
  const POS_KEY = "yosh_nrd_pos_";
  const FONT_STEPS = [14, 15, 16, 17, 18, 20, 22];

  const st = {
    docId: null,
    data: null,
    error: null,
    loading: false,
    prevView: null,
    prevScroll: 0,
    font: 16,
    query: "",
    hits: [],
    hitIndex: -1,
    tocOpen: false
  };

  try {
    const f = parseInt(localStorage.getItem(FONT_KEY), 10);
    if (FONT_STEPS.indexOf(f) !== -1) st.font = f;
  } catch (e) {}

  const esc = (s) => (typeof escapeHtml === "function" ? escapeHtml(s) : String(s == null ? "" : s));
  const jsq = (s) => (typeof escapeJsString === "function" ? escapeJsString(s) : String(s).replace(/'/g, "\\'"));

  function fmtDate(v) {
    try {
      const d = new Date(v);
      if (isNaN(d)) return "";
      const z = (n) => String(n).padStart(2, "0");
      return `${z(d.getDate())}.${z(d.getMonth() + 1)}.${d.getFullYear()}`;
    } catch (e) { return ""; }
  }

  function blockHtml(b, i) {
    const idAttr = b.id ? ` data-bid="${esc(b.id)}"` : "";
    if (b.k === "table") {
      const rows = (b.rows || []).map((r) => `<tr>${r.map((c) => {
        const tag = c.th ? "th" : "td";
        return `<${tag}${c.cs ? ` colspan="${Number(c.cs)}"` : ""}${c.rs ? ` rowspan="${Number(c.rs)}"` : ""}>${c.h || ""}</${tag}>`;
      }).join("")}</tr>`).join("");
      return `<div class="nrd-b nrd-table"${idAttr} data-i="${i}"><div class="nrd-table-scroll"><table>${rows}</table></div></div>`;
    }
    // b.h serverda tozalangan (faqat b, i, u, sup, sub, br, a teglar)
    return `<div class="nrd-b nrd-${esc(b.k)}"${idAttr} data-i="${i}">${b.h || ""}</div>`;
  }

  function tocItems(blocks) {
    const out = [];
    (blocks || []).forEach((b, i) => {
      if (b.k !== "h" && b.k !== "title" && b.k !== "appl") return;
      const t = String(b.h || "").replace(/<br>/g, " · ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      if (t) out.push({ i, t: t.length > 140 ? t.slice(0, 137) + "…" : t, k: b.k });
    });
    return out;
  }

  function headerHtml() {
    const d = st.data;
    const num = d ? (d.document_number || "") : "";
    return `
      <div class="nrd-top">
        <button type="button" class="nrd-icon-btn" onclick="closeNormTextReader()" aria-label="Orqaga">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div class="nrd-top-title" data-no-i18n>
          <div class="nrd-top-num">${esc(num || "Rasmiy matn")}</div>
          <div class="nrd-top-sub">lex.uz · rasmiy matn</div>
        </div>
        <button type="button" class="nrd-icon-btn" onclick="nrdToggleSearch()" aria-label="Matndan qidirish" ${d ? "" : "disabled"}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
        </button>
        <button type="button" class="nrd-icon-btn" onclick="nrdToggleToc()" aria-label="Mundarija" ${d ? "" : "disabled"}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg>
        </button>
      </div>
      <div class="nrd-search" id="nrd-search" hidden>
        <input type="search" id="nrd-search-input" placeholder="Matndan qidirish: masalan, balandlik" autocomplete="off"
          oninput="nrdSearchInput(this.value)" onkeydown="if(event.key==='Enter'){event.preventDefault();nrdSearchStep(event.shiftKey?-1:1)}">
        <span class="nrd-search-count" id="nrd-search-count" data-no-i18n></span>
        <button type="button" class="nrd-icon-btn sm" onclick="nrdSearchStep(-1)" aria-label="Oldingi">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 15l-6-6-6 6"/></svg>
        </button>
        <button type="button" class="nrd-icon-btn sm" onclick="nrdSearchStep(1)" aria-label="Keyingi">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </div>`;
  }

  function sourceFooterHtml() {
    const d = st.data;
    const url = (d && d.source_url) || st.fallbackUrl || "";
    if (!url) return "";
    return `
      <div class="nrd-source">
        <div class="nrd-source-title">Manba</div>
        <div class="nrd-source-text">
          <span>${d && d.fetched_at
            ? `Matn O‘zbekiston Respublikasi Qonunchilik ma’lumotlari milliy bazasidan (lex.uz) olingan, ${esc(fmtDate(d.fetched_at))} holatiga ko‘ra.`
            : "Matn O‘zbekiston Respublikasi Qonunchilik ma’lumotlari milliy bazasidan (lex.uz) olingan."}</span>
          <span>Rasmiy kuchga ega matnni saytning o‘zida tekshirishingiz mumkin.</span>
        </div>
        <button type="button" class="nrd-source-btn" onclick="safeOpenExternal('${jsq(url)}')">
          <span>lex.uz saytida ochish</span><span aria-hidden="true">↗</span>
        </button>
        <div class="nrd-source-url" data-no-i18n>${esc(url)}</div>
      </div>`;
  }

  function bodyHtml() {
    if (st.loading && !st.data) {
      return `<div class="nrd-loading"><div class="nrd-spinner"></div><div>Rasmiy matn yuklanmoqda…</div><div class="nrd-loading-hint">Katta hujjatlar birinchi marta 5–15 soniyada ochiladi</div></div>
        ${[1, 2, 3, 4, 5, 6].map((n) => `<div class="nrd-skel" style="width:${[92, 100, 84, 96, 70, 88][n - 1]}%"></div>`).join("")}`;
    }
    if (st.error && !st.data) {
      return `<div class="nrd-error">
          <div class="nrd-error-icon">📄</div>
          <div class="nrd-error-title">Matnni ilovada ochib bo‘lmadi</div>
          <div class="nrd-error-text">${esc(st.error)}</div>
          <button type="button" class="nrd-retry-btn" onclick="openNormTextReader(${Number(st.docId)}, true)">Qayta urinish</button>
        </div>`;
    }
    const d = st.data;
    const blocks = d.blocks || [];
    return `
      ${d.stale ? `<div class="nrd-stale">Saytga hozir ulanib bo‘lmadi — oldin saqlangan nusxa ko‘rsatilmoqda.</div>` : ""}
      <div class="nrd-doc" id="nrd-doc" data-no-i18n style="--nrd-fs:${st.font}px" onclick="nrdOnDocClick(event)">
        ${blocks.map(blockHtml).join("")}
      </div>`;
  }

  function tocHtml() {
    if (!st.data) return "";
    const items = tocItems(st.data.blocks);
    return `
      <div class="nrd-toc-overlay" id="nrd-toc" ${st.tocOpen ? "" : "hidden"} onclick="if(event.target===this)nrdToggleToc(false)">
        <div class="nrd-toc-sheet" role="dialog" aria-label="Mundarija">
          <div class="nrd-toc-head">
            <div class="nrd-toc-title">Mundarija</div>
            <div class="nrd-font-ctl">
              <button type="button" class="nrd-font-btn" onclick="nrdFont(-1)" aria-label="Kichikroq shrift">A−</button>
              <button type="button" class="nrd-font-btn" onclick="nrdFont(1)" aria-label="Kattaroq shrift">A+</button>
            </div>
          </div>
          <div class="nrd-toc-list" data-no-i18n>
            ${items.length ? items.map((it) => `<button type="button" class="nrd-toc-item nrd-toc-k-${it.k}" onclick="nrdJump(${it.i})">${esc(it.t)}</button>`).join("")
              : `<div class="nrd-toc-empty">Bo‘limlar topilmadi</div>`}
          </div>
        </div>
      </div>`;
  }

  function pageHtml() {
    return `
      <div class="nrd-page" id="nrd-page">
        ${headerHtml()}
        <div class="nrd-content">
          ${bodyHtml()}
          ${sourceFooterHtml()}
        </div>
        ${tocHtml()}
      </div>`;
  }

  function paint() {
    if (!currentView || currentView.type !== "normative_text") return;
    currentView.html = pageHtml();
    render();
  }

  function savePos() {
    if (!st.docId || !st.data) return;
    try { localStorage.setItem(POS_KEY + st.docId, String(Math.round(window.scrollY || 0))); } catch (e) {}
  }

  window.openNormTextReader = async function (docId, force, fallbackUrl) {
    docId = Number(docId);
    if (!docId) return;
    if (typeof haptic === "function") haptic("light");
    const reopening = currentView && currentView.type === "normative_text";
    if (!reopening) {
      st.prevView = currentView;
      st.prevScroll = window.scrollY || 0;
    }
    st.docId = docId;
    st.fallbackUrl = fallbackUrl || (st.prevView && typeof normativesState !== "undefined" && normativesState.selectedDoc && normativesState.selectedDoc.official_source_url) || "";
    st.data = force ? null : (cache.get(docId) || null);
    st.error = null;
    st.query = ""; st.hits = []; st.hitIndex = -1; st.tocOpen = false;
    st.loading = !st.data;
    currentView = { type: "normative_text", isNormText: true, html: "" };
    paint();
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    if (st.data) { restorePos(); return; }
    try {
      const res = await api(`/api/normatives/text/${docId}`);
      if (!res || !res.ok || !Array.isArray(res.blocks)) throw new Error((res && res.error) || "Matn topilmadi");
      cache.set(docId, res);
      if (st.docId !== docId) return;
      st.data = res;
    } catch (err) {
      if (st.docId !== docId) return;
      st.error = (err && err.message) || "Rasmiy matnni yuklab bo‘lmadi. Pastdagi tugma orqali lex.uz saytida o‘qing.";
    } finally {
      if (st.docId === docId) st.loading = false;
    }
    paint();
    if (st.data) restorePos();
  };

  function restorePos() {
    let y = 0;
    try { y = parseInt(localStorage.getItem(POS_KEY + st.docId), 10) || 0; } catch (e) {}
    if (y > 200) requestAnimationFrame(() => window.scrollTo({ top: y, left: 0, behavior: "auto" }));
  }

  window.closeNormTextReader = function () {
    if (typeof haptic === "function") haptic("light");
    savePos();
    const prev = st.prevView;
    const y = st.prevScroll;
    st.docId = null;
    currentView = prev || null;
    st.prevView = null;
    render();
    requestAnimationFrame(() => window.scrollTo({ top: y, left: 0, behavior: "auto" }));
  };

  window.isNormTextReaderOpen = function () {
    return !!(currentView && currentView.type === "normative_text");
  };

  // Matn ichidagi havolalar: shu hujjatdagi bandga o'tish yoki tashqi sahifani ochish
  window.nrdOnDocClick = function (e) {
    const a = e.target && e.target.closest ? e.target.closest("a") : null;
    if (!a) return;
    e.preventDefault();
    const anchor = a.getAttribute("data-lx-anchor");
    if (anchor) {
      const el = document.querySelector(`#nrd-doc [data-bid="${CSS && CSS.escape ? CSS.escape(anchor) : anchor}"]`);
      if (el) { scrollToEl(el); flash(el); return; }
    }
    const href = a.getAttribute("href");
    if (href && /^https?:\/\//i.test(href)) safeOpenExternal(href);
  };

  function scrollToEl(el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 118;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  function flash(el) {
    el.classList.remove("nrd-flash");
    void el.offsetWidth;
    el.classList.add("nrd-flash");
  }

  window.nrdJump = function (i) {
    st.tocOpen = false;
    const t = document.getElementById("nrd-toc");
    if (t) t.hidden = true;
    const el = document.querySelector(`#nrd-doc [data-i="${Number(i)}"]`);
    if (el) { scrollToEl(el); flash(el); }
  };

  window.nrdToggleToc = function (force) {
    st.tocOpen = typeof force === "boolean" ? force : !st.tocOpen;
    const t = document.getElementById("nrd-toc");
    if (t) t.hidden = !st.tocOpen;
    if (typeof haptic === "function") haptic("light");
  };

  window.nrdFont = function (dir) {
    let i = FONT_STEPS.indexOf(st.font);
    if (i === -1) i = 2;
    i = Math.max(0, Math.min(FONT_STEPS.length - 1, i + dir));
    st.font = FONT_STEPS[i];
    try { localStorage.setItem(FONT_KEY, String(st.font)); } catch (e) {}
    const doc = document.getElementById("nrd-doc");
    if (doc) doc.style.setProperty("--nrd-fs", st.font + "px");
    if (currentView && currentView.type === "normative_text") currentView.html = pageHtml();
  };

  // ---------- Matndan qidirish ----------
  window.nrdToggleSearch = function () {
    const box = document.getElementById("nrd-search");
    if (!box) return;
    box.hidden = !box.hidden;
    if (!box.hidden) {
      const inp = document.getElementById("nrd-search-input");
      if (inp) { inp.value = st.query; inp.focus(); }
    } else {
      clearMarks();
      st.query = ""; st.hits = []; st.hitIndex = -1;
    }
  };

  function clearMarks() {
    document.querySelectorAll("#nrd-doc mark.nrd-hit").forEach((m) => {
      const p = m.parentNode;
      if (!p) return;
      p.replaceChild(document.createTextNode(m.textContent), m);
      p.normalize();
    });
  }

  function normalizeQ(s) { return String(s || "").replace(/[‘’ʻʼ`´']/g, "'").toLowerCase(); }

  let searchTimer = null;
  window.nrdSearchInput = function (v) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => runSearch(v), 220);
  };

  function runSearch(v) {
    clearMarks();
    st.query = String(v || "").trim();
    st.hits = []; st.hitIndex = -1;
    const counter = document.getElementById("nrd-search-count");
    const doc = document.getElementById("nrd-doc");
    if (!doc || st.query.length < 2) { if (counter) counter.textContent = ""; return; }
    const q = normalizeQ(st.query);
    const walker = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    const LIMIT = 500;
    for (const node of nodes) {
      if (st.hits.length >= LIMIT) break;
      const text = node.nodeValue;
      const low = normalizeQ(text);
      let from = 0, idx = low.indexOf(q, from);
      if (idx === -1) continue;
      const frag = document.createDocumentFragment();
      while (idx !== -1 && st.hits.length < LIMIT) {
        frag.appendChild(document.createTextNode(text.slice(from, idx)));
        const m = document.createElement("mark");
        m.className = "nrd-hit";
        m.textContent = text.slice(idx, idx + q.length);
        frag.appendChild(m);
        st.hits.push(m);
        from = idx + q.length;
        idx = low.indexOf(q, from);
      }
      frag.appendChild(document.createTextNode(text.slice(from)));
      node.parentNode.replaceChild(frag, node);
    }
    if (counter) counter.textContent = st.hits.length ? `1/${st.hits.length}${st.hits.length >= LIMIT ? "+" : ""}` : "0";
    if (st.hits.length) { st.hitIndex = 0; focusHit(); }
  }

  function focusHit() {
    st.hits.forEach((m, i) => m.classList.toggle("is-current", i === st.hitIndex));
    const m = st.hits[st.hitIndex];
    if (m) {
      const top = m.getBoundingClientRect().top + window.scrollY - 160;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
    const counter = document.getElementById("nrd-search-count");
    if (counter && st.hits.length) counter.textContent = `${st.hitIndex + 1}/${st.hits.length}`;
  }

  window.nrdSearchStep = function (dir) {
    if (!st.hits.length) {
      const inp = document.getElementById("nrd-search-input");
      if (inp && inp.value.trim().length >= 2) runSearch(inp.value);
      return;
    }
    st.hitIndex = (st.hitIndex + dir + st.hits.length) % st.hits.length;
    focusHit();
  };

  // O'qish joyini saqlab borish
  let posTimer = null;
  window.addEventListener("scroll", () => {
    if (!window.isNormTextReaderOpen()) return;
    clearTimeout(posTimer);
    posTimer = setTimeout(savePos, 400);
  }, { passive: true });
})();
