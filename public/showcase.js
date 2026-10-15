/* ======================================================
   YOSHUZBEKK — "O'quvchilar natijalari" karuseli va to'liq ekran ko'ruvchi
   - Karusel: barmoq bilan surish (scroll-snap), yonidagi slayd chetdan ko'rinadi,
     ixcham boshqaruv: ‹ 3 / 12 › va ingichka progress chiziq
   - Eskizlar (thumbnail) bir marta chiziladi va rasm sifatida keshlanadi:
     xotirada (sessiya davomida) + Cache Storage'da (keyingi ochilishlarda darhol chiqadi)
   - PDF.js faqat kerakli qismlarni (range) yuklaydi — katta chizma albomlari tez ochiladi
   - To'liq ekran: ikki barmoq bilan kattalashtirish (pinch), ikki marta bosish, surish (pan),
     chap/o'ngga surib listni almashtirish, sichqoncha g'ildiragi (kompyuter), klaviatura ← → Esc
   app.js dagi global'lardan foydalanadi: state, initData, haptic, escapeHtml, extractGoogleDriveId,
   closeDetail, renderAdminPanel, adminView, showcaseCurrentIndex, showcaseAutoTimer, activeTab, currentView
   ====================================================== */

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
    let pageNumbers = [];
    if (sc.selected_pages) {
      pageNumbers = String(sc.selected_pages)
        .split(/[,\s]+/)
        .map(n => parseInt(n.trim(), 10))
        .filter(n => !isNaN(n) && n > 0);
    }
    if (!pageNumbers.length) pageNumbers = [1, 2, 3, 4, 5];
    pageNumbers.forEach(pageNum => {
      slides.push({ sc, scIdx, pageNum, driveId, pdfUrl: sc.pdf_url || "", slideIndex: slides.length });
    });
  });
  return slides;
}

// ----------------------------------------------------
// PDF -> RASM (keshlangan)
// ----------------------------------------------------
// app.js kutubxona o'quvchisi ham shu Map'dan foydalanadi (kalit: proxy URL)
const pdfDocPromiseCache = new Map();
const scImageMemCache = new Map();   // kalit -> Promise<objectURL>
const SC_CACHE_NAME = "yosh-showcase-v1";

function scProxyUrl(slide) {
  const authParam = initData ? `&auth=${encodeURIComponent(initData)}` : "";
  return slide.driveId
    ? `/api/pdf-proxy?id=${encodeURIComponent(slide.driveId)}${authParam}`
    : `/api/pdf-proxy?url=${encodeURIComponent(slide.pdfUrl)}${authParam}`;
}

function scSourceKey(slide) {
  return slide.driveId ? "d:" + slide.driveId : "u:" + slide.pdfUrl;
}

function scGetPdfDoc(slide) {
  const url = scProxyUrl(slide);
  let p = pdfDocPromiseCache.get(url);
  if (!p) {
    p = window.pdfjsLib.getDocument({
      url,
      cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
      cMapPacked: true,
      // Faqat kerakli baytlar (range so'rovlari): katta albomning birinchi listi butun fayl yuklanishini kutmaydi
      disableAutoFetch: true,
      disableStream: true,
      rangeChunkSize: 262144
    }).promise;
    p.catch(() => pdfDocPromiseCache.delete(url));
    pdfDocPromiseCache.set(url, p);
  }
  return p;
}

function scCanvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    if (canvas.toBlob) canvas.toBlob(b => (b ? resolve(b) : reject(new Error("toBlob"))), type, quality);
    else reject(new Error("toBlob yo'q"));
  });
}

async function scPersistentGet(key) {
  try {
    if (!("caches" in window)) return null;
    const cache = await caches.open(SC_CACHE_NAME);
    const res = await cache.match("/__sc/" + encodeURIComponent(key));
    return res ? await res.blob() : null;
  } catch (e) { return null; }
}

async function scPersistentPut(key, blob) {
  try {
    if (!("caches" in window)) return;
    const cache = await caches.open(SC_CACHE_NAME);
    await cache.put("/__sc/" + encodeURIComponent(key), new Response(blob, { headers: { "Content-Type": blob.type } }));
  } catch (e) {}
}

/**
 * Listni rasmga aylantiradi. maxDim — eng uzun tomon (px). persist — Cache Storage'ga ham yoziladi.
 * Qaytaradi: { url, w, h }
 */
function scRenderPageImage(slide, maxDim, persist) {
  const key = `${scSourceKey(slide)}|p${slide.pageNum}|${maxDim}`;
  if (scImageMemCache.has(key)) return scImageMemCache.get(key);

  const job = (async () => {
    if (persist) {
      const blob = await scPersistentGet(key);
      if (blob) {
        const dims = await scBlobDims(blob);
        return { url: URL.createObjectURL(blob), w: dims.w, h: dims.h };
      }
    }
    if (typeof window.pdfjsLib === "undefined") throw new Error("PDF.js yuklanmadi");
    const doc = await scGetPdfDoc(slide);
    const page = await doc.getPage(Math.min(Math.max(1, slide.pageNum), doc.numPages));
    const base = page.getViewport({ scale: 1 });
    let scale = maxDim / Math.max(base.width, base.height);
    // iOS canvas cheklovi: ~16.7M piksel. Xavfsiz chegara 12M.
    const maxArea = 12e6;
    if (base.width * scale * base.height * scale > maxArea) scale = Math.sqrt(maxArea / (base.width * base.height));
    const vp = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(vp.width);
    canvas.height = Math.floor(vp.height);
    const ctx = canvas.getContext("2d", { alpha: false });
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
    const blob = await scCanvasToBlob(canvas, "image/jpeg", 0.9);
    canvas.width = canvas.height = 0; // xotirani bo'shatish
    if (persist) scPersistentPut(key, blob);
    return { url: URL.createObjectURL(blob), w: Math.floor(vp.width), h: Math.floor(vp.height) };
  })();

  job.catch(() => scImageMemCache.delete(key));
  scImageMemCache.set(key, job);
  return job;
}

function scBlobDims(blob) {
  return new Promise(resolve => {
    const img = new Image();
    const u = URL.createObjectURL(blob);
    img.onload = () => { resolve({ w: img.naturalWidth, h: img.naturalHeight }); URL.revokeObjectURL(u); };
    img.onerror = () => { resolve({ w: 0, h: 0 }); URL.revokeObjectURL(u); };
    img.src = u;
  });
}

function scThumbDim() {
  const w = Math.min(window.innerWidth || 390, 720);
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  return Math.min(1600, Math.round((w * dpr) / 200) * 200 || 800);
}

// ----------------------------------------------------
// KARUSEL (bosh sahifa)
// ----------------------------------------------------
function renderShowcaseCarousel() {
  const slides = getShowcaseSlides();
  if (!slides.length) return "";
  if (showcaseCurrentIndex >= slides.length) showcaseCurrentIndex = 0;

  setTimeout(scMountCarousel, 0);

  const cur = slides[showcaseCurrentIndex];
  return `
    <section class="showcase-section sc2">
      <div class="sc2-head">
        <div class="section-title sc2-title">O'quvchilar natijalari va rabochka loyihalari</div>
        ${state.is_admin ? `<button class="admin-small-btn" onclick="openAddShowcaseModal()">➕ Natija qo'shish</button>` : ""}
      </div>
      <p class="sc2-sub">Kurs bitiruvchilari erishgan natijalar va to'liq tayyorlangan ishchi loyiha chizmalari:</p>

      <div class="sc2-viewport">
        <div class="sc2-track" id="sc2-track" dir="ltr" role="region" aria-roledescription="carousel" aria-label="O'quvchilar natijalari">
          ${slides.map((item, i) => `
            <div class="sc2-slide" data-idx="${i}" role="group" aria-label="${i + 1} / ${slides.length}">
              <button type="button" class="sc2-sheet" onclick="openShowcaseFullscreenModal(${i})" aria-label="${item.pageNum}-list — kattalashtirib ko'rish">
                <span class="sc2-skeleton" aria-hidden="true"></span>
                <img class="sc2-img" id="sc2-img-${i}" alt="" decoding="async" draggable="false">
                <span class="sc2-sheet-label" aria-hidden="true">${item.pageNum}-list</span>
                <span class="sc2-expand" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
                </span>
              </button>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="sc2-bar">
        <div class="sc2-meta">
          <span class="sc2-course" id="sc2-course">${escapeHtml(cur.sc.course_title || "Revit kursi")}</span>
          ${cur.sc.discount_badge ? `<span class="sc2-badge" id="sc2-badge">${escapeHtml(cur.sc.discount_badge)}</span>` : `<span class="sc2-badge" id="sc2-badge" hidden></span>`}
        </div>
        ${slides.length > 1 ? `
          <div class="sc2-nav" data-no-i18n>
            <button type="button" class="sc2-arrow" onclick="prevShowcaseSlide(event)" aria-label="Oldingi list">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <span class="sc2-count" id="sc2-count">${showcaseCurrentIndex + 1} / ${slides.length}</span>
            <button type="button" class="sc2-arrow" onclick="nextShowcaseSlide(event)" aria-label="Keyingi list">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>` : ""}
      </div>
      ${slides.length > 1 ? `<div class="sc2-progress" aria-hidden="true"><span id="sc2-progress-fill" style="width:${((showcaseCurrentIndex + 1) / slides.length) * 100}%"></span></div>` : ""}

      ${state.is_admin ? `
        <div class="carousel-admin-row" id="sc2-admin" data-sc-id="${Number(cur.sc.id)}">
          <button class="admin-small-btn" onclick="openEditShowcaseModal(Number(document.getElementById('sc2-admin').dataset.scId))">✏️ Tahrirlash</button>
          <button class="admin-small-btn" style="background:rgba(235,59,59,0.2); color:#eb3b3b;" onclick="deleteShowcaseItem(Number(document.getElementById('sc2-admin').dataset.scId))">🗑️ O'chirish</button>
        </div>` : ""}
    </section>
  `;
}

let scScrollRaf = 0;
let scUserInteracted = false;

function scMountCarousel() {
  const track = document.getElementById("sc2-track");
  if (!track || track.dataset.mounted === "1") return;
  track.dataset.mounted = "1";
  const slides = getShowcaseSlides();

  // Avvalgi joyiga (re-render'dan keyin) sakramasdan qaytish
  const target = track.children[showcaseCurrentIndex];
  if (target) track.scrollLeft = target.offsetLeft - track.offsetLeft;

  track.addEventListener("scroll", () => {
    if (scScrollRaf) return;
    scScrollRaf = requestAnimationFrame(() => {
      scScrollRaf = 0;
      const idx = scIndexFromScroll(track);
      if (idx !== showcaseCurrentIndex) {
        showcaseCurrentIndex = idx;
        scUpdateMeta(slides);
        scLoadAround(slides);
      }
    });
  }, { passive: true });

  const stopAuto = () => { scUserInteracted = true; if (showcaseAutoTimer) { clearInterval(showcaseAutoTimer); showcaseAutoTimer = null; } };
  track.addEventListener("pointerdown", stopAuto, { passive: true });
  track.addEventListener("touchstart", stopAuto, { passive: true });
  track.addEventListener("wheel", stopAuto, { passive: true });

  scLoadAround(slides);
}

function scIndexFromScroll(track) {
  const first = track.children[0];
  if (!first) return 0;
  const step = (track.children[1] ? track.children[1].offsetLeft - first.offsetLeft : first.offsetWidth) || 1;
  return Math.max(0, Math.min(track.children.length - 1, Math.round(track.scrollLeft / step)));
}

function scUpdateMeta(slides) {
  const cur = slides[showcaseCurrentIndex];
  if (!cur) return;
  const count = document.getElementById("sc2-count");
  if (count) count.textContent = `${showcaseCurrentIndex + 1} / ${slides.length}`;
  const fill = document.getElementById("sc2-progress-fill");
  if (fill) fill.style.width = `${((showcaseCurrentIndex + 1) / slides.length) * 100}%`;
  const course = document.getElementById("sc2-course");
  if (course) course.textContent = cur.sc.course_title || "Revit kursi";
  const badge = document.getElementById("sc2-badge");
  if (badge) { badge.textContent = cur.sc.discount_badge || ""; badge.hidden = !cur.sc.discount_badge; }
  const adm = document.getElementById("sc2-admin");
  if (adm) adm.dataset.scId = String(Number(cur.sc.id));
}

function scLoadAround(slides) {
  const n = slides.length;
  const cur = showcaseCurrentIndex;
  // Avval joriy, so'ng qo'shnilar — ketma-ket (bir vaqtda bitta PDF chizish)
  const order = [cur, (cur + 1) % n, (cur - 1 + n) % n, (cur + 2) % n];
  const dim = scThumbDim();
  order.reduce((chain, idx) => chain.then(() => scFillThumb(slides, idx, dim)), Promise.resolve());
}

function scFillThumb(slides, idx, dim) {
  const img = document.getElementById(`sc2-img-${idx}`);
  const slide = slides[idx];
  if (!img || !slide || img.dataset.state === "ok") return Promise.resolve();
  const sheet = img.parentElement;
  return scRenderPageImage(slide, dim, true).then(res => {
    const el = document.getElementById(`sc2-img-${idx}`);
    if (!el) return;
    el.onload = () => { el.parentElement && el.parentElement.classList.add("is-loaded"); };
    el.src = res.url;
    el.dataset.state = "ok";
  }).catch(err => {
    console.warn("Natija listini chizib bo'lmadi:", err);
    if (sheet) sheet.classList.add("is-error");
  });
}

function scScrollTo(idx, smooth) {
  const track = document.getElementById("sc2-track");
  const slides = getShowcaseSlides();
  if (!slides.length) return;
  showcaseCurrentIndex = (idx + slides.length) % slides.length;
  if (track && track.children[showcaseCurrentIndex]) {
    const el = track.children[showcaseCurrentIndex];
    track.scrollTo({ left: el.offsetLeft - track.offsetLeft, behavior: smooth ? "smooth" : "auto" });
  }
  scUpdateMeta(slides);
  scLoadAround(slides);
}

function initShowcaseTimer() {
  if (showcaseAutoTimer) clearInterval(showcaseAutoTimer);
  showcaseAutoTimer = null;
  if (scUserInteracted) return; // foydalanuvchi o'zi surgandan keyin avtomatik aylantirish to'xtaydi
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  showcaseAutoTimer = setInterval(() => {
    if (document.hidden || activeTab !== "home" || currentView) return;
    if (document.getElementById("showcase-fullscreen-modal")) return;
    const track = document.getElementById("sc2-track");
    if (!track) return;
    const r = track.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return; // ekranda ko'rinmasa aylantirmaymiz
    scScrollTo(showcaseCurrentIndex + 1, true);
  }, 6000);
}

function nextShowcaseSlide(e) {
  if (e) e.stopPropagation();
  haptic("light");
  scUserInteracted = true;
  if (showcaseAutoTimer) { clearInterval(showcaseAutoTimer); showcaseAutoTimer = null; }
  scScrollTo(showcaseCurrentIndex + 1, true);
}

function prevShowcaseSlide(e) {
  if (e) e.stopPropagation();
  haptic("light");
  scUserInteracted = true;
  if (showcaseAutoTimer) { clearInterval(showcaseAutoTimer); showcaseAutoTimer = null; }
  scScrollTo(showcaseCurrentIndex - 1, true);
}

function setShowcaseSlide(idx, e) {
  if (e) e.stopPropagation();
  haptic("light");
  scScrollTo(idx, true);
}

// Orqaga moslik (eski nomlar)
function updateShowcaseDom() { scScrollTo(showcaseCurrentIndex, true); }
function renderCurrentAndAdjacentPdfSlides() { const s = getShowcaseSlides(); if (s.length) scLoadAround(s); }

// ----------------------------------------------------
// TO'LIQ EKRAN KO'RUVCHI (faqat ko'rish, ulashishsiz)
// ----------------------------------------------------
const SV = {
  idx: 0,
  slides: [],
  scale: 1, tx: 0, ty: 0,
  baseW: 0, baseH: 0,          // ekranga sig'gan o'lcham (scale=1 da)
  pointers: new Map(),
  pinch: null, pan: null, swipe: null, down: null,
  lastTap: 0,
  animating: false,
  hiResFor: -1,
  keyHandler: null
};

function openShowcaseFullscreenModal(slideIdx) {
  haptic("light");
  if (showcaseAutoTimer) { clearInterval(showcaseAutoTimer); showcaseAutoTimer = null; }
  const slides = getShowcaseSlides();
  if (!slides.length) return;
  SV.slides = slides;
  SV.idx = Math.max(0, Math.min(slideIdx, slides.length - 1));

  let el = document.getElementById("showcase-fullscreen-modal");
  if (el) el.remove();
  el = document.createElement("div");
  el.id = "showcase-fullscreen-modal";
  el.className = "sv-overlay";
  el.setAttribute("dir", "ltr");
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.innerHTML = `
    <div class="sv-top">
      <button type="button" class="sv-icon-btn" onclick="closeShowcaseFullscreenModal()" aria-label="Yopish">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <div class="sv-title">
        <div class="sv-title-main" id="sv-title-main"></div>
        <div class="sv-title-sub" id="sv-title-sub"></div>
      </div>
      <button type="button" class="sv-icon-btn sv-reset" id="sv-reset" onclick="svResetZoom(true)" aria-label="Asl o'lcham" hidden>
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/><path d="M8 11h6"/></svg>
      </button>
    </div>
    <div class="sv-stage" id="sv-stage">
      <div class="sv-strip" id="sv-strip">
        <div class="sv-pane" data-slot="-1"></div>
        <div class="sv-pane" data-slot="0"></div>
        <div class="sv-pane" data-slot="1"></div>
      </div>
    </div>
    ${slides.length > 1 ? `
      <button type="button" class="sv-side sv-side-prev" onclick="svGo(-1)" aria-label="Oldingi list">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button type="button" class="sv-side sv-side-next" onclick="svGo(1)" aria-label="Keyingi list">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>` : ""}
    <div class="sv-bottom">
      <span class="sv-count" id="sv-count" data-no-i18n></span>
      <span class="sv-hint" id="sv-hint">${(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) ? "Kattalashtirish: sichqoncha g'ildiragi yoki ikki marta bosing" : "Ikki barmoq bilan kattalashtiring"}</span>
    </div>
  `;
  document.body.appendChild(el);
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => el.classList.add("is-open"));

  svBindGestures();
  SV.keyHandler = (e) => {
    if (e.key === "Escape") closeShowcaseFullscreenModal();
    else if (e.key === "ArrowRight") svGo(1);
    else if (e.key === "ArrowLeft") svGo(-1);
  };
  document.addEventListener("keydown", SV.keyHandler);
  window.addEventListener("resize", svOnResize);

  svFillPanes();
  try {
    if (!localStorage.getItem("sv_hint_seen")) { localStorage.setItem("sv_hint_seen", "1"); }
    else { const h = document.getElementById("sv-hint"); if (h) h.hidden = true; }
  } catch (e) {}
}

function closeShowcaseFullscreenModal() {
  haptic("light");
  const el = document.getElementById("showcase-fullscreen-modal");
  if (SV.keyHandler) document.removeEventListener("keydown", SV.keyHandler);
  window.removeEventListener("resize", svOnResize);
  SV.keyHandler = null;
  document.body.style.overflow = "";
  // Karuselni ko'rilgan listga moslash
  showcaseCurrentIndex = SV.idx;
  scScrollTo(SV.idx, false);
  if (el) {
    el.classList.remove("is-open");
    el.classList.add("is-closing");
    setTimeout(() => el.remove(), 220);
  }
}

function svPane(slot) {
  const strip = document.getElementById("sv-strip");
  return strip ? strip.querySelector(`.sv-pane[data-slot="${slot}"]`) : null;
}

function svViewerDim() {
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const longest = Math.max(window.innerWidth, window.innerHeight);
  return Math.min(2800, Math.round((longest * dpr) / 400) * 400 || 1600);
}

function svFillPanes() {
  const n = SV.slides.length;
  [-1, 0, 1].forEach(slot => {
    const pane = svPane(slot);
    if (!pane) return;
    if (n < 2 && slot !== 0) { pane.innerHTML = ""; return; }
    const idx = (SV.idx + slot + n) % n;
    svRenderPane(pane, idx);
  });
  svUpdateHeader();
  svResetZoom(false);
}

function svRenderPane(pane, idx) {
  const slide = SV.slides[idx];
  pane.dataset.idx = String(idx);
  pane.innerHTML = `
    <div class="sv-loading"><span class="sv-spinner"></span><span>${slide.pageNum}-list yuklanmoqda...</span></div>
    <img class="sv-img" alt="" draggable="false">
  `;
  const img = pane.querySelector(".sv-img");
  // Avval tayyor eskizni ko'rsatamiz (darhol), so'ng sifatli versiyani
  const thumbKey = scImageMemCache.get(`${scSourceKey(slide)}|p${slide.pageNum}|${scThumbDim()}`);
  const showRes = (res) => {
    if (pane.dataset.idx !== String(idx)) return;
    img.onload = () => {
      pane.classList.add("is-loaded");
      if (pane.dataset.slot === "0") svLayoutCurrent();
    };
    img.dataset.w = res.w; img.dataset.h = res.h;
    img.src = res.url;
  };
  if (thumbKey) thumbKey.then(showRes).catch(() => {});
  scRenderPageImage(slide, svViewerDim(), false).then(showRes).catch(err => {
    if (pane.dataset.idx !== String(idx)) return;
    console.warn("To'liq ekran listini chizib bo'lmadi:", err);
    pane.innerHTML = `
      <div class="sv-error">
        <div class="sv-error-title">Chizmani yuklab bo'lmadi</div>
        <div class="sv-error-sub">Tarmoq yoki fayl ulanishida uzilish bo'ldi</div>
        <button type="button" class="sv-retry" onclick="svRetry(${idx})">Qayta urinish</button>
      </div>`;
  });
}

function svRetry(idx) {
  haptic("medium");
  const slide = SV.slides[idx];
  if (!slide) return;
  for (const k of Array.from(scImageMemCache.keys())) if (k.startsWith(scSourceKey(slide))) scImageMemCache.delete(k);
  pdfDocPromiseCache.delete(scProxyUrl(slide));
  svFillPanes();
}

function svUpdateHeader() {
  const slide = SV.slides[SV.idx];
  if (!slide) return;
  const t = document.getElementById("sv-title-main");
  const s = document.getElementById("sv-title-sub");
  const c = document.getElementById("sv-count");
  if (t) t.textContent = `${slide.pageNum}-list`;
  if (s) s.textContent = slide.sc.course_title || "Revit kursi";
  if (c) c.textContent = `${SV.idx + 1} / ${SV.slides.length}`;
}

// ---- Joylashuv va transform ----
function svLayoutCurrent() {
  const pane = svPane(0);
  const stage = document.getElementById("sv-stage");
  if (!pane || !stage) return;
  const img = pane.querySelector(".sv-img");
  if (!img || !img.naturalWidth) return;
  const sw = stage.clientWidth;
  const pad = window.innerWidth < 640 ? 8 : 32;
  // Yuqori sarlavha va pastki hisoblagich ustiga chiqmasin
  const topEl = document.querySelector("#showcase-fullscreen-modal .sv-top");
  const botEl = document.querySelector("#showcase-fullscreen-modal .sv-bottom");
  const insetTop = topEl ? topEl.offsetHeight - 12 : 70;
  const insetBottom = botEl ? (window.innerHeight - botEl.getBoundingClientRect().top) + 8 : 70;
  document.querySelectorAll("#sv-strip .sv-pane").forEach(pn => { pn.style.paddingTop = insetTop + "px"; pn.style.paddingBottom = insetBottom + "px"; });
  const sh = stage.clientHeight - insetTop - insetBottom + pad * 2;
  const ratio = Math.min((sw - pad * 2) / img.naturalWidth, (sh - pad * 2) / img.naturalHeight);
  SV.baseW = Math.round(img.naturalWidth * ratio);
  SV.baseH = Math.round(img.naturalHeight * ratio);
  // Barcha panellar bir xil o'lchamda (o'tish paytida sakrash bo'lmasin)
  document.querySelectorAll("#sv-strip .sv-img").forEach(im => {
    if (!im.naturalWidth) return;
    const r = Math.min((sw - pad * 2) / im.naturalWidth, (sh - pad * 2) / im.naturalHeight);
    im.style.width = Math.round(im.naturalWidth * r) + "px";
    im.style.height = Math.round(im.naturalHeight * r) + "px";
  });
  svApply(false);
}

function svOnResize() {
  svLayoutCurrent();
  svClamp();
  svApply(false);
}

function svApply(animate) {
  const img = svPane(0) && svPane(0).querySelector(".sv-img");
  if (!img) return;
  img.style.transition = animate ? "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)" : "none";
  img.style.transform = `translate3d(${SV.tx}px, ${SV.ty}px, 0) scale(${SV.scale})`;
  const reset = document.getElementById("sv-reset");
  if (reset) reset.hidden = SV.scale <= 1.01;
  const ov = document.getElementById("showcase-fullscreen-modal");
  if (ov) ov.classList.toggle("is-zoomed", SV.scale > 1.01);
  if (SV.scale > 1.6) svMaybeHiRes();
}

function svClamp() {
  const stage = document.getElementById("sv-stage");
  if (!stage) return;
  const maxX = Math.max(0, (SV.baseW * SV.scale - stage.clientWidth) / 2);
  const maxY = Math.max(0, (SV.baseH * SV.scale - stage.clientHeight) / 2);
  SV.tx = Math.max(-maxX, Math.min(maxX, SV.tx));
  SV.ty = Math.max(-maxY, Math.min(maxY, SV.ty));
}

function svResetZoom(animate) {
  SV.scale = 1; SV.tx = 0; SV.ty = 0;
  svApply(animate);
}

// Nuqta atrofida kattalashtirish (cx, cy — stage markaziga nisbatan)
function svZoomAt(newScale, cx, cy) {
  const s = Math.max(1, Math.min(6, newScale));
  const k = s / SV.scale;
  SV.tx = cx - (cx - SV.tx) * k;
  SV.ty = cy - (cy - SV.ty) * k;
  SV.scale = s;
  svClamp();
}

// Kattalashtirilganda yuqori aniqlikdagi versiyani chizish (bir marta)
function svMaybeHiRes() {
  if (SV.hiResFor === SV.idx) return;
  SV.hiResFor = SV.idx;
  const idx = SV.idx;
  const slide = SV.slides[idx];
  scRenderPageImage(slide, 4096, false).then(res => {
    const pane = svPane(0);
    if (!pane || pane.dataset.idx !== String(idx)) return;
    const img = pane.querySelector(".sv-img");
    if (img) img.src = res.url; // o'lcham CSS'da qat'iy — almashtirishda sakrash yo'q
  }).catch(() => {});
}

// ---- Listlar orasida o'tish (silliq surish animatsiyasi) ----
function svGo(dir) {
  const n = SV.slides.length;
  if (n < 2 || SV.animating) return;
  haptic("light");
  const strip = document.getElementById("sv-strip");
  if (!strip) return;
  SV.animating = true;
  if (SV.scale > 1.01) svResetZoom(true);
  const w = (document.getElementById("sv-stage") || {}).clientWidth || window.innerWidth;
  strip.style.transition = "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)";
  strip.style.transform = `translate3d(${-dir * w}px, 0, 0)`;
  const done = () => {
    strip.removeEventListener("transitionend", done);
    clearTimeout(fallback);
    SV.idx = (SV.idx + dir + n) % n;
    SV.hiResFor = -1;
    // Panellarni aylantirish: tayyor rasmlar qayta chizilmaydi
    const panes = { "-1": svPane(-1), "0": svPane(0), "1": svPane(1) };
    if (dir > 0) {
      panes["-1"].dataset.slot = "1"; panes["0"].dataset.slot = "-1"; panes["1"].dataset.slot = "0";
      strip.appendChild(panes["-1"]);
      strip.insertBefore(panes["0"], panes["1"]);
    } else {
      panes["1"].dataset.slot = "-1"; panes["0"].dataset.slot = "1"; panes["-1"].dataset.slot = "0";
      strip.insertBefore(panes["1"], strip.firstChild);
    }
    strip.style.transition = "none";
    strip.style.transform = "translate3d(0, 0, 0)";
    const fresh = svPane(dir > 0 ? 1 : -1);
    if (fresh) svRenderPane(fresh, (SV.idx + (dir > 0 ? 1 : -1) + n) % n);
    svUpdateHeader();
    SV.scale = 1; SV.tx = 0; SV.ty = 0;
    svLayoutCurrent();
    SV.animating = false;
  };
  const fallback = setTimeout(done, 420);
  strip.addEventListener("transitionend", done);
}

// ---- Imo-ishoralar: pinch, pan, swipe, double-tap, wheel ----
function svBindGestures() {
  const stage = document.getElementById("sv-stage");
  if (!stage) return;

  const center = (x, y) => {
    const r = stage.getBoundingClientRect();
    return { x: x - r.left - r.width / 2, y: y - r.top - r.height / 2 };
  };

  stage.addEventListener("pointerdown", (e) => {
    if (SV.animating) return;
    stage.setPointerCapture && stage.setPointerCapture(e.pointerId);
    SV.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (SV.pointers.size === 2) {
      const [a, b] = Array.from(SV.pointers.values());
      const m = center((a.x + b.x) / 2, (a.y + b.y) / 2);
      SV.pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale: SV.scale, tx: SV.tx, ty: SV.ty, mx: m.x, my: m.y };
      SV.pan = null; SV.swipe = null;
      svHideHint();
    } else if (SV.pointers.size === 1) {
      SV.down = { x: e.clientX, y: e.clientY, t: performance.now(), moved: 0 };
      if (SV.scale > 1.01) SV.pan = { x: e.clientX, y: e.clientY, tx: SV.tx, ty: SV.ty };
      else SV.swipe = { x: e.clientX, y: e.clientY, dx: 0, dy: 0, t: performance.now(), axis: null };
    }
  });

  stage.addEventListener("pointermove", (e) => {
    if (!SV.pointers.has(e.pointerId)) return;
    SV.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (SV.down) SV.down.moved = Math.max(SV.down.moved, Math.hypot(e.clientX - SV.down.x, e.clientY - SV.down.y));
    if (SV.pinch && SV.pointers.size >= 2) {
      const [a, b] = Array.from(SV.pointers.values());
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const m = center((a.x + b.x) / 2, (a.y + b.y) / 2);
      const s = Math.max(1, Math.min(6, SV.pinch.scale * (dist / (SV.pinch.dist || 1))));
      const k = s / SV.pinch.scale;
      SV.scale = s;
      SV.tx = m.x - (SV.pinch.mx - SV.pinch.tx) * k;
      SV.ty = m.y - (SV.pinch.my - SV.pinch.ty) * k;
      svClamp();
      svApply(false);
    } else if (SV.pan) {
      SV.tx = SV.pan.tx + (e.clientX - SV.pan.x);
      SV.ty = SV.pan.ty + (e.clientY - SV.pan.y);
      svClamp();
      svApply(false);
    } else if (SV.swipe && SV.slides.length > 1) {
      const sw = SV.swipe;
      sw.dx = e.clientX - sw.x; sw.dy = e.clientY - sw.y;
      if (!sw.axis && Math.hypot(sw.dx, sw.dy) > 8) sw.axis = Math.abs(sw.dx) > Math.abs(sw.dy) ? "x" : "y";
      if (sw.axis === "x") {
        const strip = document.getElementById("sv-strip");
        if (strip) { strip.style.transition = "none"; strip.style.transform = `translate3d(${sw.dx}px, 0, 0)`; }
      }
    }
  });

  const end = (e) => {
    if (!SV.pointers.has(e.pointerId)) return;
    SV.pointers.delete(e.pointerId);
    const down = SV.down; SV.down = null;
    const isTap = !SV.pinch && down && down.moved < 10 && performance.now() - down.t < 300;
    if (SV.pinch && SV.pointers.size < 2) {
      SV.pinch = null;
      if (SV.scale < 1.03) svResetZoom(true);
      // Bitta barmoq qolsa — davom ettirib surish
      if (SV.pointers.size === 1 && SV.scale > 1.01) {
        const p = Array.from(SV.pointers.values())[0];
        SV.pan = { x: p.x, y: p.y, tx: SV.tx, ty: SV.ty };
      }
      return;
    }
    if (SV.pan) { SV.pan = null; if (isTap) svHandleTap(e); return; }
    if (SV.swipe) {
      const sw = SV.swipe; SV.swipe = null;
      const strip = document.getElementById("sv-strip");
      const dt = performance.now() - sw.t;
      if (sw.axis === "x") {
        const w = (document.getElementById("sv-stage") || {}).clientWidth || window.innerWidth;
        const fast = Math.abs(sw.dx) / Math.max(dt, 1) > 0.5;
        if (Math.abs(sw.dx) > w * 0.18 || (fast && Math.abs(sw.dx) > 30)) {
          // joriy surilgan holatdan davom ettiramiz (chizmalar matn emas — yo'nalish har doim chapdan o'ngga)
          svGo(sw.dx < 0 ? 1 : -1);
        } else if (strip) {
          strip.style.transition = "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)";
          strip.style.transform = "translate3d(0, 0, 0)";
        }
        return;
      }
      if (isTap) svHandleTap(e);
    }
  };
  stage.addEventListener("pointerup", end);
  stage.addEventListener("pointercancel", end);

  // Kompyuter: g'ildirak bilan kattalashtirish (sichqoncha joylashgan nuqta atrofida)
  stage.addEventListener("wheel", (e) => {
    e.preventDefault();
    const c = center(e.clientX, e.clientY);
    const factor = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0025));
    svZoomAt(SV.scale * factor, c.x, c.y);
    svApply(false);
    svHideHint();
  }, { passive: false });

  // iOS Safari "gesturestart" — sahifa o'zi zoom qilmasin
  stage.addEventListener("gesturestart", (e) => e.preventDefault());
}

function svHandleTap(e) {
  const now = performance.now();
  const stage = document.getElementById("sv-stage");
  if (now - SV.lastTap < 300 && stage) {
    SV.lastTap = 0;
    const r = stage.getBoundingClientRect();
    const cx = e.clientX - r.left - r.width / 2;
    const cy = e.clientY - r.top - r.height / 2;
    if (SV.scale > 1.01) svResetZoom(true);
    else { svZoomAt(2.5, cx, cy); svApply(true); }
    svHideHint();
    haptic("light");
  } else {
    SV.lastTap = now;
  }
}

function svHideHint() {
  const h = document.getElementById("sv-hint");
  if (h && !h.hidden) { h.classList.add("is-hidden"); setTimeout(() => { h.hidden = true; }, 250); }
}

// Orqaga moslik: eski tugmalar/chaqiruvlar
function nextFullscreenSlide(e) { if (e) e.stopPropagation(); svGo(1); }
function prevFullscreenSlide(e) { if (e) e.stopPropagation(); svGo(-1); }
function resetFullscreenShowcaseZoom() { svResetZoom(true); }
function retryFullscreenRender() { svRetry(SV.idx); }
