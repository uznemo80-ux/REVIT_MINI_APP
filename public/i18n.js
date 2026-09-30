/* ======================================================
   YOSHUZBEKK Mini App — i18n qatlami (uz, ru, en, tr, ar)
   - Tarjima fayllari: /locales/<til>/<namespace>.json  (server /api/i18n/<til> orqali birlashtirib beradi)
   - t('lessons.next_lesson')  — kalit bo'yicha tarjima (topilmasa asl matn / fallback; kalit hech qachon ko'rinmaydi)
   - Mavjud qattiq yozilgan o'zbekcha matnlar: DOM lokalizatori asl (uz) matn bo'yicha tarjimani topib almashtiradi
   - Arab tili: dir="rtl" + rtl.css
   ====================================================== */
(function () {
  "use strict";

  var LANGS = [
    { code: "uz", flag: "🇺🇿", name: "O‘zbekcha" },
    { code: "ru", flag: "🇷🇺", name: "Русский" },
    { code: "en", flag: "🇬🇧", name: "English" },
    { code: "tr", flag: "🇹🇷", name: "Türkçe" },
    { code: "ar", flag: "🇸🇦", name: "العربية" }
  ];
  var LS_LANG = "yosh_lang";
  var LS_DIRTY = "yosh_lang_dirty";
  var LS_CACHE = "yosh_i18n_v1_";

  var S = {
    lang: "uz",
    dir: "ltr",
    dict: {},          // kalit -> tarjima
    uz: {},            // kalit -> asl o'zbekcha matn
    exact: new Map(),  // normallashgan uz matn -> tarjima
    patterns: [],      // {re, tpl} — {0} kabi o'zgaruvchili matnlar
    observer: null,
    pending: new Set(),
    raf: 0,
    lastOut: new WeakMap()
  };

  // ---------- yordamchilar ----------
  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function safeDel(k) { try { localStorage.removeItem(k); } catch (e) {} }

  function normLang(l) {
    l = String(l || "").toLowerCase().slice(0, 2);
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === l) return l;
    return "uz";
  }

  // Apostrof/tirnoq variantlari va bo'shliqlarni birxillashtirish (asl matn turli belgilar bilan yozilgan)
  function norm(s) {
    return String(s == null ? "" : s).replace(/[\u2018\u2019\u02bb\u02bc\u0060\u00b4]/g, "'").replace(/\s+/g, " ").trim();
  }

  var PRE_RE = /^[\s\u200d\ufe0f\p{Extended_Pictographic}\p{S}←→↗↖▶◀›‹•·|*#]+/u;
  var SUF_RE = /[\s\u200d\ufe0f\p{Extended_Pictographic}\p{S}←→↗↖▶◀›‹•·|*]+$/u;
  var MIRROR = { "←": "→", "→": "←", "↗": "↖", "↖": "↗", "▶": "◀", "◀": "▶", "›": "‹", "‹": "›" };

  function mirrorArrows(s) {
    return s.replace(/[←→↗↖▶◀›‹]/g, function (c) { return MIRROR[c] || c; });
  }

  function interpolate(tpl, params) {
    if (!params) return tpl;
    return String(tpl).replace(/\{(\w+)\}/g, function (m, k) {
      return params[k] != null ? String(params[k]) : m;
    });
  }

  // ---------- indeks ----------
  function buildIndex(payload) {
    S.dict = payload.dict || {};
    S.uz = payload.uz || {};
    S.exact = new Map();
    S.patterns = [];
    (payload.pairs || []).forEach(function (p) {
      var src = norm(p[0]), tr = p[1];
      if (!src || !tr) return;
      if (/\{\d+\}/.test(src)) {
        var names = [];
        var re = "^" + src.replace(/[.*+?^$()|[\]\\]/g, "\\$&").replace(/\{(\d+)\}/g, function (m, n) { names.push(n); return "(.+?)"; }) + "$";
        try { S.patterns.push({ re: new RegExp(re), names: names, tpl: tr, len: src.length }); } catch (e) {}
      } else {
        S.exact.set(src, tr);
      }
    });
    S.patterns.sort(function (a, b) { return b.len - a.len; });
  }

  // ---------- tarjima ----------
  function lookup(text) {
    var n = norm(text);
    if (!n) return null;
    var hit = S.exact.get(n);
    if (hit != null) return hit;
    for (var i = 0; i < S.patterns.length; i++) {
      var m = S.patterns[i].re.exec(n);
      if (m) {
        var out = S.patterns[i].tpl;
        S.patterns[i].names.forEach(function (name, idx) {
          var val = m[idx + 1];
          var inner = lookup(val);           // ichki qism ham tarjima bo'lishi mumkin (masalan, "Modul: Revit asoslari")
          out = out.split("{" + name + "}").join(inner != null ? inner : val);
        });
        return out;
      }
    }
    return null;
  }

  function translateString(text) {
    if (S.lang === "uz" || text == null) return null;
    var raw = String(text);
    var direct = lookup(raw);
    if (direct != null) return direct;
    // Emoji / strelka / belgilar bilan o'ralgan matn: "🚀 Boshlash →"
    var pre = (raw.match(PRE_RE) || [""])[0];
    var rest = raw.slice(pre.length);
    var suf = (rest.match(SUF_RE) || [""])[0];
    var core = suf ? rest.slice(0, rest.length - suf.length) : rest;
    if (!core || (!pre && !suf)) return null;
    var tr = lookup(core);
    if (tr == null) return null;
    if (S.dir === "rtl") { pre = mirrorArrows(pre); suf = mirrorArrows(suf); }
    return pre + tr + suf;
  }

  // ---------- DOM lokalizator ----------
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, CODE: 1, PRE: 1, NOSCRIPT: 1, SVG: 1 }; // INPUT: faqat atributlari tarjima qilinadi
  var ATTRS = ["placeholder", "title", "aria-label"];

  function noI18n(el) {
    return !!(el && el.nodeType === 1 && el.hasAttribute && (el.hasAttribute("data-no-i18n") || el.isContentEditable));
  }
  function isSvgEl(el) {
    return !!(el.namespaceURI && /svg/i.test(el.namespaceURI) && String(el.tagName).toLowerCase() !== "text");
  }
  function skipEl(el) {
    if (!el || el.nodeType !== 1) return false;
    return !!(SKIP_TAGS[el.tagName] || isSvgEl(el) || noI18n(el));
  }
  function insideSkipped(el) {
    while (el && el.nodeType === 1) {
      if (skipEl(el)) return true;
      el = el.parentNode;
    }
    return false;
  }

  function translateTextNode(node) {
    var v = node.nodeValue;
    if (!v || !v.trim()) return;
    if (S.lastOut.get(node) === v) return;
    var lead = v.match(/^\s*/)[0], trail = v.match(/\s*$/)[0];
    var tr = translateString(v.trim());
    if (tr != null) {
      var out = lead + tr + trail;
      S.lastOut.set(node, out);
      node.nodeValue = out;
    }
  }

  function translateAttrs(el) {
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i];
      if (!el.hasAttribute(a)) continue;
      var v = el.getAttribute(a);
      if (!v) continue;
      var tr = translateString(v);
      if (tr != null && tr !== v) el.setAttribute(a, tr);
    }
    if (el.tagName === "INPUT" && (el.type === "button" || el.type === "submit") && el.value) {
      var tv = translateString(el.value);
      if (tv != null) el.value = tv;
    }
  }

  function translateTree(root) {
    if (S.lang === "uz" || !root) return;
    if (root.nodeType === 3) {
      if (!insideSkipped(root.parentNode)) translateTextNode(root);
      return;
    }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1) {
      if (insideSkipped(root.parentNode) || noI18n(root)) return;
      translateAttrs(root);
      if (skipEl(root)) return;
    }
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (n.nodeType === 1) {
          if (noI18n(n)) return NodeFilter.FILTER_REJECT;
          translateAttrs(n);                       // placeholder/title/aria-label (INPUT ham)
          return skipEl(n) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) translateTextNode(n);
  }

  function flush() {
    S.raf = 0;
    var items = Array.from(S.pending);
    S.pending.clear();
    items.forEach(function (n) { if (n.isConnected !== false) translateTree(n); });
  }

  function schedule(n) {
    S.pending.add(n);
    if (!S.raf) S.raf = (window.requestAnimationFrame || setTimeout)(flush, 0);
  }

  function startObserver() {
    if (S.observer || typeof MutationObserver === "undefined") return;
    S.observer = new MutationObserver(function (muts) {
      if (S.lang === "uz") return;
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === "childList") {
          for (var j = 0; j < m.addedNodes.length; j++) schedule(m.addedNodes[j]);
        } else if (m.type === "characterData") {
          schedule(m.target);
        } else if (m.type === "attributes") {
          schedule(m.target);
        }
      }
    });
    S.observer.observe(document.documentElement, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ATTRS
    });
  }

  // ---------- til / yo'nalish ----------
  function applyDirection() {
    var html = document.documentElement;
    html.setAttribute("lang", S.lang);
    html.setAttribute("dir", S.dir);
    if (document.body) {
      document.body.classList.toggle("rtl", S.dir === "rtl");
      document.body.classList.toggle("lang-ar", S.lang === "ar");
    }
    if (S.lang === "ar" && !document.getElementById("i18n-ar-font")) {
      var l = document.createElement("link");
      l.id = "i18n-ar-font";
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700;800&display=swap";
      document.head.appendChild(l);
    }
  }

  function cachePayload(lang, payload) {
    try { safeSet(LS_CACHE + lang, JSON.stringify(payload)); } catch (e) {}
  }
  function readCached(lang) {
    var raw = safeGet(LS_CACHE + lang);
    if (!raw) return null;
    try { var p = JSON.parse(raw); return p && p.pairs ? p : null; } catch (e) { return null; }
  }

  function fetchPayload(lang) {
    return fetch("/api/i18n/" + lang, { headers: { "X-App-Lang": lang } })
      .then(function (r) { if (!r.ok) throw new Error("i18n " + r.status); return r.json(); });
  }

  function useLanguage(lang, payload) {
    S.lang = lang;
    S.dir = lang === "ar" ? "rtl" : "ltr";
    if (payload) buildIndex(payload); else { S.dict = {}; S.pairs = []; S.exact = new Map(); S.patterns = []; }
    applyDirection();
    if (lang !== "uz") { startObserver(); if (document.body) translateTree(document.body); }
  }

  // ---------- ochiq API ----------
  var I18N = {
    LANGS: LANGS,
    get lang() { return S.lang; },
    get dir() { return S.dir; },
    isRTL: function () { return S.dir === "rtl"; },

    // Kalit bo'yicha tarjima. Hech qachon kalitni/undefined'ni qaytarmaydi.
    t: function (key, params, fallback) {
      var v = S.dict[key];
      if (v == null || v === "") v = S.uz[key];
      if (v == null || v === "") v = fallback != null ? fallback : "";
      return interpolate(v, params);
    },

    // Kodda qattiq yozilgan o'zbekcha matnni tarjima qiladi (topilmasa o'zini qaytaradi)
    tr: function (text) {
      if (text == null) return text;
      var r = translateString(String(text));
      return r != null ? r : text;
    },

    headers: function () { return { "X-App-Lang": S.lang }; },

    translateTree: translateTree,

    currentLanguage: function () { return LANGS.filter(function (l) { return l.code === S.lang; })[0] || LANGS[0]; },

    // Sahifa yuklanganda: local storage'dagi tilni darhol tiklash (keshdan), keyin tarmoqdan yangilash
    init: function () {
      var lang = normLang(safeGet(LS_LANG));
      var cached = lang !== "uz" ? readCached(lang) : null;
      useLanguage(lang, cached);
      I18N.ready = lang === "uz" ? Promise.resolve() :
        fetchPayload(lang).then(function (p) { cachePayload(lang, p); if (S.lang === lang) useLanguage(lang, p); })
          .catch(function () { /* keshdan yoki asl matn bilan davom etadi */ });
      return I18N.ready;
    },

    // Til tanlash: UI darhol o'zgaradi, DB'ga saqlanadi
    setLanguage: function (code, opts) {
      opts = opts || {};
      var lang = normLang(code);
      var prev = S.lang;
      var cached = lang !== "uz" ? readCached(lang) : null;
      var apply = function (p) {
        safeSet(LS_LANG, lang);
        useLanguage(lang, p);
        if (!opts.noSave) I18N.saveToServer(lang);
        if (typeof window.onI18nChanged === "function") { try { window.onI18nChanged(lang, prev); } catch (e) { console.warn(e); } }
      };
      if (lang === "uz") { apply(null); return Promise.resolve(lang); }
      if (cached) {
        apply(cached);
        fetchPayload(lang).then(function (p) { cachePayload(lang, p); if (S.lang === lang) { useLanguage(lang, p); if (typeof window.onI18nChanged === "function") window.onI18nChanged(lang, lang); } }).catch(function () {});
        return Promise.resolve(lang);
      }
      return fetchPayload(lang).then(function (p) { cachePayload(lang, p); apply(p); return lang; })
        .catch(function () { apply(null); return lang; });
    },

    saveToServer: function (lang) {
      safeSet(LS_DIRTY, lang);
      var body = { initData: (window.initData || (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) || ""), language: lang };
      return fetch("/api/user/language", { method: "POST", headers: { "Content-Type": "application/json", "X-App-Lang": lang }, body: JSON.stringify(body) })
        .then(function (r) { if (r.ok) safeDel(LS_DIRTY); })
        .catch(function () { /* keyingi ochilishda qayta uriniladi */ });
    },

    // Autentifikatsiyadan keyin: server bilan tilni moslashtirish (conflict yo'q)
    reconcile: function (serverLang) {
      var local = safeGet(LS_LANG);
      var dirty = safeGet(LS_DIRTY);
      serverLang = normLang(serverLang);
      if (dirty && local) {                      // foydalanuvchi tilni o'zgartirgan, lekin serverga yetib bormagan
        I18N.saveToServer(normLang(local));
        return false;
      }
      if (!local || normLang(local) !== serverLang) {
        if (serverLang !== S.lang) { I18N.setLanguage(serverLang, { noSave: true }); return true; }
        safeSet(LS_LANG, serverLang);
      }
      return false;
    },

    // Telegram/brauzerning native oynalari uchun
    wrapGlobals: function () {
      var w = window;
      ["showAlert", "alert"].forEach(function (n) {
        var o = w[n];
        if (typeof o !== "function" || o.__i18n) return;
        var f = function (m) { return o.call(this, I18N.tr(m)); };
        f.__i18n = true; w[n] = f;
      });
      var oc = w.confirm;
      if (typeof oc === "function" && !oc.__i18n) {
        var fc = function (m) { return oc.call(w, I18N.tr(m)); };
        fc.__i18n = true; w.confirm = fc;
      }
    },

    // Profil → Sozlamalar → Til qatori (HTML)
    renderLanguageRow: function () {
      var cur = I18N.currentLanguage();
      return '' +
        '<div class="profile-action-row lang-row" onclick="I18N.openLanguageSheet()" role="button" tabindex="0" data-no-i18n>' +
          '<div class="profile-action-left">' +
            '<div class="profile-action-icon">🌐</div>' +
            '<span class="profile-action-label">Til / Language</span>' +
          '</div>' +
          '<div class="lang-row-value"><span>' + cur.flag + '</span><span>' + cur.name + '</span>' +
            '<svg class="lang-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
          '</div>' +
        '</div>';
    },

    openLanguageSheet: function () {
      if (document.getElementById("lang-sheet")) return;
      try { if (window.haptic) window.haptic("light"); } catch (e) {}
      var overlay = document.createElement("div");
      overlay.id = "lang-sheet";
      overlay.className = "lang-sheet-overlay";
      overlay.setAttribute("data-no-i18n", "");
      overlay.innerHTML =
        '<div class="lang-sheet" role="dialog" aria-modal="true">' +
          '<div class="lang-sheet-grip"></div>' +
          '<div class="lang-sheet-title">Til / Language</div>' +
          '<div class="lang-list">' +
            LANGS.map(function (l) {
              return '<button type="button" class="lang-option ' + (l.code === S.lang ? "active" : "") + '" data-lang="' + l.code + '">' +
                '<span class="lang-flag">' + l.flag + '</span>' +
                '<span class="lang-name">' + l.name + '</span>' +
                '<span class="lang-radio"><span class="lang-radio-dot"></span></span>' +
              '</button>';
            }).join("") +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);
      requestAnimationFrame(function () { overlay.classList.add("open"); });
      var close = function () { overlay.classList.remove("open"); setTimeout(function () { overlay.remove(); }, 220); };
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) { close(); return; }
        var btn = e.target.closest ? e.target.closest(".lang-option") : null;
        if (!btn) return;
        var code = btn.getAttribute("data-lang");
        overlay.querySelectorAll(".lang-option").forEach(function (b) { b.classList.toggle("active", b === btn); });
        I18N.setLanguage(code);
        setTimeout(close, 180);
      });
    }
  };

  window.I18N = I18N;
  window.t = I18N.t;
  I18N.init();
})();
