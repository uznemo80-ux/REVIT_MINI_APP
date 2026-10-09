'use strict';
/**
 * MaterialAgent — AI bosqichlari:
 *   1. discover      — kategoriya bo'yicha yangi material topish (Google Search) + rasmiy sahifani tekshirish
 *   2. enrich        — maydonlarni uz/ru/en to'ldirish (faqat rasmiy sahifa matni asosida) + validatsiya
 *   3. collectImages — rasmiy sahifadan 2–3 ta rasm, sifat nazorati (o'lcham + AI vision)
 *   4. verify        — matn/rasm mosligi + O'zbekistonda sotuvda borligini tekshirish
 * Har bir AI javobi kod bilan qayta tekshiriladi: havola ochilmasa, raqam sahifada bo'lmasa — qabul qilinmaydi.
 */
var crypto = require('crypto');
var config = require('./config');
var gemini = require('./gemini');
var web = require('./web');

var MARKETPLACES = /(^|\.)(amazon|aliexpress|alibaba|ebay|ozon|wildberries|yandex|market\.yandex|avito|olx|uzum|leroymerlin|lemanapro|petrovich|vseinstrumenti|obi|castorama|homedepot|lowes|wikipedia|youtube|pinterest|instagram|facebook)\./i;

function sigTokens(name, brand) {
  var b = web.normalize(brand).split(' ');
  return web.normalize(name).split(' ').filter(function (t) {
    return t.length >= 3 && b.indexOf(t) === -1 && !/^(the|and|for|для|из|под|with)$/.test(t);
  });
}

function tokenCoverage(tokens, text) {
  if (!tokens.length) return 0;
  var hay = ' ' + web.normalize(text) + ' ';
  var hit = tokens.filter(function (t) { return hay.indexOf(t) !== -1; }).length;
  return hit / tokens.length;
}

function cyrRatio(s) {
  var letters = String(s || '').match(/[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳ]/g) || [];
  if (!letters.length) return 0;
  var cyr = letters.filter(function (c) { return /[А-Яа-яЁёЎўҚқҒғҲҳ]/.test(c); }).length;
  return cyr / letters.length;
}

// ======================================================
// 1. DISCOVER
// ======================================================
function discoverPrompt(category, subcats, existing, avoid) {
  return [
    'You are a research agent for an architecture & interior-design materials library used by designers in Uzbekistan.',
    'Use Google Search. Find ONE specific, real, currently manufactured building/finishing material PRODUCT for this library category:',
    '- category slug: ' + category.slug,
    '- category name: ' + category.name + (category.description ? ' — ' + category.description : ''),
    subcats.length ? '- existing subcategories in this category (prefer fitting one of them): ' + subcats.join('; ') : '',
    '',
    'Priorities:',
    '1. Prefer brands that are actually sold in Uzbekistan (Tashkent dealers, .uz sites) or produced in Uzbekistan; otherwise a well-known international/CIS brand.',
    '2. It must be a concrete product or product line (with a model/series name), NOT a generic material type.',
    '3. The manufacturer must have an OFFICIAL product page for it (on the manufacturer\'s own domain, not a marketplace/dealer).',
    '4. Do NOT suggest anything from this list (already in the library or rejected):',
    (existing.concat(avoid || [])).slice(0, 150).map(function (n) { return '   - ' + n; }).join('\n') || '   (empty)',
    '',
    'Return ONLY a JSON object, no prose:',
    '{"product_name": "official product name incl. series/model", "brand": "manufacturer brand", "product_code": "article/code or empty",',
    ' "product_url": "https://... official manufacturer product page (exact URL you found, never invented)",',
    ' "manufacturer_website": "https://... manufacturer home page", "manufacturer_country": "country",',
    ' "subcategory_hint": "short subcategory", "why": "one sentence"}'
  ].filter(function (l) { return l !== ''; }).join('\n');
}

/**
 * Sahifa haqiqatan shu mahsulotning rasmiy sahifasimi — kod bilan tekshiradi.
 * @returns {Promise<{ok:boolean, page?:object, reason?:string}>}
 */
async function checkOfficialPage(url, info) {
  if (!url || !/^https?:\/\//i.test(url)) return { ok: false, reason: 'url yo\'q' };
  var page = await web.fetchPage(url);
  if (!page.ok) return { ok: false, reason: 'ochilmadi (' + page.error + ')' };
  var host = web.hostOf(page.finalUrl);
  if (MARKETPLACES.test(host)) return { ok: false, reason: 'marketplace/dealer domeni: ' + host };
  if (page.text.length < 400) return { ok: false, reason: 'sahifa matni juda qisqa (JS sahifa bo\'lishi mumkin)' };
  var hay = web.normalize(page.title + ' ' + page.text);
  var brandOk = hay.indexOf(web.normalize(info.brand)) !== -1;
  var mfgRoot = web.rootDomain(web.hostOf(info.manufacturer_website || ''));
  var sameDomain = mfgRoot && web.rootDomain(host) === mfgRoot;
  if (!brandOk && !sameDomain) return { ok: false, reason: 'sahifada brend nomi yo\'q va domen mos emas' };
  var cov = tokenCoverage(sigTokens(info.product_name, info.brand), page.title + ' ' + page.text);
  if (cov < 0.5) return { ok: false, reason: 'sahifada mahsulot nomi topilmadi (moslik ' + Math.round(cov * 100) + '%)' };
  return { ok: true, page: page, coverage: cov, sameDomain: !!sameDomain };
}

async function discover(ctx) {
  var r = await gemini.generateJson({ prompt: discoverPrompt(ctx.category, ctx.subcats, ctx.existing, ctx.avoid), search: true, temperature: 0.7 });
  var info = r.data || {};
  ['product_name', 'brand'].forEach(function (k) { info[k] = String(info[k] || '').trim(); });
  if (!info.product_name || !info.brand) throw new Error('AI mahsulot nomi yoki brendini bermadi');

  // AI bergan havola + Google qidiruv manbalari (redirect orqali haqiqiy URL ga yetamiz)
  var urls = [];
  if (info.product_url) urls.push(String(info.product_url).trim());
  (r.sources || []).forEach(function (s) { urls.push(s.uri); });
  urls = urls.filter(function (u, i) { return u && urls.indexOf(u) === i; }).slice(0, 6);

  var reasons = [];
  for (var i = 0; i < urls.length; i++) {
    var chk = await checkOfficialPage(urls[i], info);
    if (chk.ok) {
      return {
        product_name: info.product_name,
        brand: info.brand,
        product_code: String(info.product_code || '').trim(),
        product_url: chk.page.finalUrl,
        manufacturer_website: String(info.manufacturer_website || '').trim() || ('https://' + web.hostOf(chk.page.finalUrl)),
        manufacturer_country: String(info.manufacturer_country || '').trim(),
        subcategory_hint: String(info.subcategory_hint || '').trim(),
        page: chk.page
      };
    }
    reasons.push(web.hostOf(urls[i]) + ': ' + chk.reason);
  }
  var err = new Error('Rasmiy sahifa tasdiqlanmadi — ' + info.brand + ' ' + info.product_name + ' (' + reasons.join('; ') + ')');
  err.rejectedName = info.brand + ' ' + info.product_name;
  throw err;
}

// ======================================================
// 1-B. DISCOVER (bepul rejim — brend saytlari sitemap'i orqali, Google qidiruvisiz)
// ======================================================
var sources = require('./sources');
var sitemapCache = new Map(); // website → {urls, exp}

async function cachedSitemap(website) {
  var hit = sitemapCache.get(website);
  if (hit && hit.exp > Date.now()) return hit.urls;
  var urls = await sources.sitemapPageUrls(website);
  sitemapCache.set(website, { urls: urls, exp: Date.now() + 24 * 3600 * 1000 });
  return urls;
}

function pickUrlsPrompt(ctx, site, urls) {
  return [
    'You help build a building-materials library. Below are page URLs from the official website of ' + (site.brand || web.hostOf(site.website)) + '.',
    'Library category: ' + ctx.category.name + ' [' + ctx.category.slug + ']' + (ctx.category.description ? ' — ' + ctx.category.description : ''),
    ctx.subcats.length ? 'Subcategories: ' + ctx.subcats.join('; ') : '',
    'Pick up to 3 URLs that most likely are the page of ONE specific product (or product series) that fits this category.',
    'Do NOT pick category listings, news, documents or anything already in the library: ' + ctx.existing.concat(ctx.avoid || []).slice(0, 80).join('; '),
    'If nothing fits the category, return an empty list.',
    'Return ONLY JSON: {"urls": ["..."]}',
    '',
    urls.join('\n')
  ].filter(Boolean).join('\n');
}

function identifyPrompt(ctx, page) {
  return [
    'Look at this web page text from a manufacturer website.',
    'Library category: ' + ctx.category.name + ' [' + ctx.category.slug + ']',
    'Answer: is this the page of ONE specific building/finishing material product or product series (not a category list, not news)? Does it fit the category?',
    'Return ONLY JSON: {"is_single_product_page": true, "fits_category": true, "product_name": "official name with series/model", "brand": "brand", "product_code": "only if on page", "manufacturer_country": "if stated", "subcategory_hint": "short"}',
    '',
    'URL: ' + page.finalUrl,
    'TITLE: ' + page.title,
    String(page.text || '').slice(0, 7000)
  ].join('\n');
}

async function discoverFromSites(ctx) {
  var sites = sources.shuffle(ctx.sites || [], Date.now());
  if (!sites.length) throw new Error('Brend saytlari ro\'yxati bo\'sh — admin panelda ishlab chiqaruvchiga sayt manzilini kiriting');
  var used = ctx.usedUrls || new Set();
  var notes = [];
  for (var si = 0; si < sites.length && si < 4; si++) {
    var site = sites[si];
    var host = web.hostOf(site.website);
    var all = await cachedSitemap(site.website);
    if (!all.length) { notes.push(host + ': sitemap topilmadi'); continue; }
    var sample = sources.sampleUrls(all, used, 150, Date.now() + si);
    if (!sample.length) { notes.push(host + ': yangi sahifa qolmadi'); continue; }
    var pick = await gemini.generateJson({ prompt: pickUrlsPrompt(ctx, site, sample), json: true, temperature: 0.4 });
    var chosen = ((pick.data && pick.data.urls) || []).filter(function (u) { return sample.indexOf(u) !== -1; }).slice(0, 3);
    if (!chosen.length) { notes.push(host + ': kategoriyaga mos sahifa yo\'q'); continue; }
    for (var ci = 0; ci < chosen.length; ci++) {
      used.add(chosen[ci]);
      var page = await web.fetchPage(chosen[ci]);
      if (!page.ok || page.text.length < 400) { notes.push(host + ': sahifa ochilmadi'); continue; }
      var idr = await gemini.generateJson({ prompt: identifyPrompt(ctx, page), json: true, temperature: 0 });
      var info = idr.data || {};
      if (info.is_single_product_page !== true || info.fits_category !== true || !info.product_name) { notes.push(host + ': mahsulot sahifasi emas'); continue; }
      info.brand = String(info.brand || site.brand || '').trim();
      info.product_name = String(info.product_name).trim();
      var avoidKey = web.normalize(info.brand + ' ' + info.product_name);
      if ((ctx.avoid || []).some(function (a) { return web.normalize(a) === avoidKey; })) continue;
      var cov = tokenCoverage(sigTokens(info.product_name, info.brand), page.title + ' ' + page.text);
      if (cov < 0.5) { notes.push(host + ': nom sahifada tasdiqlanmadi'); continue; }
      return {
        product_name: info.product_name,
        brand: info.brand,
        product_code: String(info.product_code || '').trim(),
        product_url: page.finalUrl,
        manufacturer_website: site.website,
        manufacturer_country: String(info.manufacturer_country || site.country || '').trim(),
        subcategory_hint: String(info.subcategory_hint || '').trim(),
        page: page
      };
    }
  }
  throw new Error('Brend saytlaridan mos material topilmadi (' + notes.slice(0, 6).join('; ') + ')');
}

// ======================================================
// 2. ENRICH (maydonlarni to'ldirish)
// ======================================================
var LANG_FIELDS = ['name', 'short_description', 'description', 'usage_area', 'pros', 'cons', 'architect_notes', 'mounting_instructions', 'dimensions_info'];
var REQUIRED_LANG_FIELDS = ['name', 'short_description', 'description', 'usage_area', 'pros', 'cons'];

function enrichPrompt(ctx) {
  var fields = [];
  LANG_FIELDS.forEach(function (f) { ['uz', 'ru', 'en'].forEach(function (l) { fields.push('"' + f + '_' + l + '": "..."'); }); });
  return [
    'You fill a material card for an architecture/interior materials library (audience: designers in Uzbekistan).',
    'Product: ' + ctx.brand + ' — ' + ctx.product_name + (ctx.product_code ? ' (code ' + ctx.product_code + ')' : ''),
    'Library category: ' + ctx.category.name + ' [' + ctx.category.slug + ']',
    ctx.subcats.length ? 'Existing subcategory names (subcategory_name MUST be one of these exactly if any fits, otherwise a short new name in Russian): ' + ctx.subcats.join(' | ') : 'subcategory_name: short name in Russian.',
    '',
    'STRICT RULES:',
    '- Use ONLY facts present in the OFFICIAL PAGE TEXT below. Do not invent numbers, certificates, prices, sizes or claims.',
    '- If something is not on the page, leave that field as an empty string (or omit the spec). General, well-known properties of the material type may be used in usage_area/pros/cons/architect_notes, but no invented numbers.',
    '- *_uz fields: Uzbek LATIN script (o‘, g‘, sh, ch), natural professional Uzbek, NO Cyrillic.',
    '- *_ru fields: Russian. *_en fields: English.',
    '- short_description: 1 sentence, 60–220 chars. description: 2–4 short paragraphs, 300–1200 chars, neutral (no marketing hype).',
    '- pros/cons: 3–5 items each, one per line, starting with "• ".',
    '- architect_notes: practical tips for designers/Revit documentation (e.g. what to specify on drawings). mounting_instructions: short steps if the page describes installation, else "".',
    '- specifications: ONLY parameters with values literally present on the page (copy the numbers exactly).',
    ctx.focusNote ? '\nADMIN FEEDBACK ON PREVIOUS VERSION (must fix): ' + ctx.focusNote : '',
    ctx.prevErrors && ctx.prevErrors.length ? '\nYour previous answer failed validation: ' + ctx.prevErrors.join('; ') : '',
    '',
    'Return ONLY JSON:',
    '{' + fields.join(', ') + ',',
    ' "subcategory_name": "...", "material_type": "short type in Russian", "scope": "interior|architecture|both",',
    ' "product_code": "only if on page", "manufacturer_country": "...",',
    ' "specifications": [{"parameter": "snake_case_key", "label_uz": "...", "label_ru": "...", "value": "exact value from page", "unit": "..."}]}',
    '',
    '=== OFFICIAL PAGE (' + ctx.product_url + ') ===',
    'TITLE: ' + (ctx.page.title || ''),
    String(ctx.page.text || '').slice(0, 18000)
  ].join('\n');
}

/** Raqam matnda alohida son sifatida uchraydimi ("12" → "120" ichida emas) va yonida kontekst so'zi bormi */
function numNear(n, hay, context) {
  var esc = n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  var re = new RegExp('(^|[^0-9.,])' + esc + '(?=$|[^0-9]|[.,](?![0-9]))', 'g');
  var m;
  while ((m = re.exec(hay))) {
    if (!context.length) return true;
    var win = hay.slice(Math.max(0, m.index - 70), m.index + m[0].length + 70);
    if (context.some(function (c) { return win.indexOf(c) !== -1; })) return true;
  }
  return false;
}

/** AI natijasini kod bilan tekshiradi va tozalaydi */
function validateData(raw, pageText) {
  var d = {}, errors = [];
  var hay = ' ' + web.normalize(pageText) + ' ';
  LANG_FIELDS.forEach(function (f) {
    ['uz', 'ru', 'en'].forEach(function (l) {
      var k = f + '_' + l;
      d[k] = String((raw && raw[k]) || '').trim();
    });
  });
  REQUIRED_LANG_FIELDS.forEach(function (f) {
    ['uz', 'ru', 'en'].forEach(function (l) {
      if (!d[f + '_' + l]) errors.push(f + '_' + l + ' bo\'sh');
    });
  });
  ['uz', 'ru', 'en'].forEach(function (l) {
    var sd = d['short_description_' + l];
    if (sd && (sd.length < 40 || sd.length > 320)) errors.push('short_description_' + l + ' uzunligi ' + sd.length);
    var desc = d['description_' + l];
    if (desc && desc.length < 200) errors.push('description_' + l + ' juda qisqa');
  });
  LANG_FIELDS.forEach(function (f) {
    if (d[f + '_uz'] && cyrRatio(d[f + '_uz']) > 0.05) errors.push(f + '_uz kirill yozuvida (lotin bo\'lishi kerak)');
    if (d[f + '_en'] && cyrRatio(d[f + '_en']) > 0.05) errors.push(f + '_en ingliz tilida emas');
    if (d[f + '_ru'] && d[f + '_ru'].length > 20 && cyrRatio(d[f + '_ru']) < 0.5) errors.push(f + '_ru rus tilida emas');
  });

  d.subcategory_name = String((raw && raw.subcategory_name) || '').trim().slice(0, 250);
  d.material_type = String((raw && raw.material_type) || d.subcategory_name).trim().slice(0, 250);
  d.scope = ['interior', 'architecture', 'both'].indexOf(raw && raw.scope) !== -1 ? raw.scope : 'both';
  d.manufacturer_country = String((raw && raw.manufacturer_country) || '').trim().slice(0, 100);
  if (!d.subcategory_name) errors.push('subcategory_name bo\'sh');

  // Artikul faqat sahifada bo'lsa
  var code = String((raw && raw.product_code) || '').trim();
  d.product_code = code && hay.indexOf(web.normalize(code)) !== -1 ? code.slice(0, 95) : '';

  // Texnik ko'rsatkichlar: har bir raqam sahifada uchrashi shart
  var specs = Array.isArray(raw && raw.specifications) ? raw.specifications : [];
  d.specifications = [];
  d.dropped_specs = [];
  specs.forEach(function (s) {
    if (!s || s.value === undefined || s.value === null || String(s.value).trim() === '') return;
    var val = String(s.value).trim();
    var nums = val.match(/\d+(?:[.,]\d+)?/g) || [];
    // Raqam sahifada bo'lishi yetarli emas ("AquaShield 300" → "300 sikl" emas):
    // raqam yonida (±70 belgi) o'lchov birligi yoki parametr nomi ham bo'lishi shart.
    var context = [web.normalize(s.unit)].concat(
      [s.label_ru, s.label_uz, String(s.parameter || '').replace(/_/g, ' ')].join(' ')
        .split(/\s+/).map(web.normalize).filter(function (t) { return t.length >= 4; })
    ).filter(Boolean);
    var ok = nums.length
      ? nums.every(function (n) { return numNear(n, hay, context) || numNear(n.replace(',', '.'), hay, context) || numNear(n.replace('.', ','), hay, context); })
      : hay.indexOf(web.normalize(val)) !== -1;
    if (ok && d.specifications.length < 15) {
      d.specifications.push({
        parameter: String(s.parameter || '').trim() || 'param_' + (d.specifications.length + 1),
        label_uz: String(s.label_uz || '').trim(), label_ru: String(s.label_ru || '').trim(),
        value: val, unit: String(s.unit || '').trim()
      });
    } else if (!ok) {
      d.dropped_specs.push((s.label_ru || s.parameter || '?') + '=' + val);
    }
  });
  return { ok: errors.length === 0, errors: errors, data: d };
}

async function enrich(ctx) {
  var prevErrors = [];
  for (var attempt = 0; attempt < 2; attempt++) {
    var r = await gemini.generateJson({ prompt: enrichPrompt(Object.assign({}, ctx, { prevErrors: prevErrors })), json: true, temperature: 0.3 });
    var v = validateData(r.data, (ctx.page.title || '') + '\n' + ctx.page.text);
    if (v.ok) return v.data;
    prevErrors = v.errors.slice(0, 12);
  }
  throw new Error('Ma\'lumotlar validatsiyadan o\'tmadi: ' + prevErrors.join('; '));
}

// ======================================================
// 3. RASMLAR
// ======================================================
function sha1(buf) { return crypto.createHash('sha1').update(buf).digest('hex'); }

async function downloadCandidates(urls, exclude, limit) {
  var out = [], seenHash = new Set();
  for (var i = 0; i < urls.length && out.length < limit; i++) {
    var u = urls[i];
    if ((exclude || []).indexOf(u) !== -1) continue;
    var img = await web.fetchImage(u, config.MAX_IMAGE_BYTES);
    if (!img.ok) continue;
    var minSide = Math.min(img.width, img.height), ratio = img.width / img.height;
    if (minSide < config.MIN_IMAGE_SIDE) continue;
    if (ratio > 3 || ratio < 0.33) continue; // banner / chiziq rasmlar
    var h = sha1(img.buffer);
    if (seenHash.has(h)) continue;
    seenHash.add(h);
    img.hash = h;
    out.push(img);
  }
  return out;
}

function visionPrompt(ctx, n) {
  return [
    'You are a strict photo editor for a building-materials library.',
    'Product: ' + ctx.brand + ' — ' + ctx.product_name + (ctx.material_type ? ' (' + ctx.material_type + ')' : ''),
    'You get ' + n + ' images in order (index 0..' + (n - 1) + ').',
    'For each image decide: does it actually show THIS product (the material itself, a close-up/texture, the package, or the product installed in an interior/building)?',
    'Reject: logos, icons, certificates, diagrams with mostly text, people portraits, unrelated products, heavy watermarks, collages of many different products.',
    ctx.focusNote ? 'Admin feedback on previously chosen images: ' + ctx.focusNote : '',
    'Return ONLY JSON: {"images": [{"index": 0, "shows_product": true, "kind": "product|texture|installed|package|other", "quality": 0-10, "watermark_or_text": false, "note": "short"}]}'
  ].filter(Boolean).join('\n');
}

async function rankImages(ctx, imgs) {
  // Inline so'rov hajmini cheklash: har biri ≤ 4 MB, jami ≤ 6 ta
  var batch = imgs.filter(function (i) { return i.buffer.length <= 4 * 1024 * 1024; }).slice(0, 6);
  if (!batch.length) return [];
  var r = await gemini.generateJson({
    prompt: visionPrompt(ctx, batch.length),
    images: batch.map(function (b) { return { mime: b.mime, data: b.buffer }; }),
    json: true, temperature: 0
  });
  var verdicts = (r.data && Array.isArray(r.data.images)) ? r.data.images : [];
  var ranked = [];
  verdicts.forEach(function (v) {
    var img = batch[Number(v.index)];
    if (!img) return;
    img.verdict = v;
    if (v.shows_product === true && !v.watermark_or_text && Number(v.quality) >= config.MIN_IMAGE_SCORE) ranked.push(img);
  });
  // Turli xil ko'rinishlar: avval har xil "kind", keyin sifat bo'yicha
  ranked.sort(function (a, b) { return Number(b.verdict.quality) - Number(a.verdict.quality); });
  var picked = [], kinds = new Set();
  ranked.forEach(function (img) { if (picked.length < config.MAX_IMAGES && !kinds.has(img.verdict.kind)) { picked.push(img); kinds.add(img.verdict.kind); } });
  ranked.forEach(function (img) { if (picked.length < config.MAX_IMAGES && picked.indexOf(img) === -1) picked.push(img); });
  return picked;
}

/** Rasmiy domen ichidan qo'shimcha sahifa qidirish (kolleksiya/katalog sahifalari) */
async function findExtraPages(ctx) {
  var prompt = [
    'Use Google Search. Find up to 3 OTHER official web pages on the manufacturer domain ' + web.rootDomain(web.hostOf(ctx.product_url)),
    'that show photos of the product "' + ctx.brand + ' ' + ctx.product_name + '" (collection page, gallery, catalog page).',
    'Return ONLY JSON: {"urls": ["https://..."]}'
  ].join('\n');
  var r = await gemini.generateJson({ prompt: prompt, search: true });
  var urls = ((r.data && r.data.urls) || []).concat((r.sources || []).map(function (s) { return s.uri; }));
  return urls.filter(function (u, i) { return u && urls.indexOf(u) === i; }).slice(0, 5);
}

async function collectImages(ctx) {
  var exclude = ctx.excludeUrls || [];
  var urls = web.extractImageUrls(ctx.page.html, ctx.page.finalUrl || ctx.product_url);
  var imgs = await downloadCandidates(urls, exclude, config.MAX_IMAGE_CANDIDATES);
  var picked = imgs.length ? await rankImages(ctx, imgs) : [];

  if (picked.length < config.MIN_IMAGES) {
    var root = web.rootDomain(web.hostOf(ctx.product_url));
    var extra = [];
    if (config.searchMode === 'google') {
      try { extra = await findExtraPages(ctx); } catch (e) { console.warn('MaterialAgent extra pages:', e.message); }
    } else {
      // Bepul rejim: shu saytning sitemap'idan nomi o'xshash sahifalar (kolleksiya/galereya)
      var tokens = sigTokens(ctx.product_name, ctx.brand);
      var siteUrls = sitemapCache.has(ctx.manufacturer_website) ? sitemapCache.get(ctx.manufacturer_website).urls : [];
      extra = siteUrls.filter(function (u) { return u !== ctx.product_url && tokenCoverage(tokens, decodeURIComponent(u).replace(/[-_/]/g, ' ')) >= 0.5; }).slice(0, 3);
    }
    for (var i = 0; i < extra.length && picked.length < config.MIN_IMAGES; i++) {
      var p = await web.fetchPage(extra[i]);
      if (!p.ok || web.rootDomain(web.hostOf(p.finalUrl)) !== root) continue;
      var more = await downloadCandidates(web.extractImageUrls(p.html, p.finalUrl), exclude.concat(imgs.map(function (x) { return x.url; })), config.MAX_IMAGE_CANDIDATES);
      var seen = new Set(picked.map(function (x) { return x.hash; }));
      more = more.filter(function (m) { return !seen.has(m.hash); });
      if (!more.length) continue;
      var rankedMore = await rankImages(ctx, more);
      picked = picked.concat(rankedMore).slice(0, config.MAX_IMAGES);
    }
  }
  if (picked.length < config.MIN_IMAGES) {
    throw new Error('Mos rasm topilmadi: ' + picked.length + ' ta (kamida ' + config.MIN_IMAGES + ' ta kerak; ' + imgs.length + ' ta nomzod tekshirildi)');
  }
  return picked;
}

// ======================================================
// 4. VERIFY (moslik + O'zbekiston)
// ======================================================
async function consistencyCheck(ctx, data, images) {
  var prompt = [
    'Final QA for a materials-library card. Product: ' + ctx.brand + ' — ' + ctx.product_name + '.',
    'Card text (RU): ' + data.name_ru + '. ' + data.short_description_ru,
    'Card text (UZ): ' + data.name_uz + '. ' + data.short_description_uz,
    'Category: ' + ctx.category.name + '. Images attached in order.',
    'Check: (1) every image shows this product/material; (2) the text describes this exact product; (3) the product really belongs to the category; (4) uz/ru/en texts say the same thing.',
    'Return ONLY JSON: {"images_match": true, "bad_image_indexes": [], "text_matches": true, "category_matches": true, "issues": ["short issue", "..."]}'
  ].join('\n');
  var r = await gemini.generateJson({
    prompt: prompt, json: true, temperature: 0,
    images: images.map(function (i) { return { mime: i.mime, data: i.buffer }; })
  });
  var v = r.data || {};
  return {
    images_match: v.images_match === true,
    bad_image_indexes: Array.isArray(v.bad_image_indexes) ? v.bad_image_indexes.map(Number) : [],
    text_matches: v.text_matches === true,
    category_matches: v.category_matches !== false,
    issues: Array.isArray(v.issues) ? v.issues.slice(0, 6).map(String) : []
  };
}

async function checkUzbekistan(ctx) {
  if (config.searchMode !== 'google') {
    // Bepul rejim: faqat ishonchli belgi — mahsulot ishlab chiqaruvchining O'zbekiston (.uz) saytida.
    // Boshqa holatda belgi ko'rsatilmaydi (taxmin qilinmaydi).
    var host = web.hostOf(ctx.product_url);
    if (/\.uz$/.test(host)) {
      return {
        available: true, checked: true, method: 'domain',
        dealer_url: ctx.product_url, dealer_title: ctx.brand + ' — O\'zbekiston rasmiy sayti',
        note_uz: ctx.brand + ' mahsuloti O\'zbekistondagi rasmiy saytda taqdim etilgan.'
      };
    }
    return { available: false, checked: true, method: 'domain' };
  }
  var prompt = [
    'Use Google Search. Is the product "' + ctx.brand + ' ' + ctx.product_name + '" (or this exact ' + ctx.brand + ' product line) sold in Uzbekistan?',
    'Look for an official distributor, dealer or store in Uzbekistan (Tashkent etc.), e.g. .uz websites or the brand\'s "where to buy" page for Uzbekistan.',
    'Answer false if you only find the brand in general or only foreign shops.',
    'Return ONLY JSON: {"available": true|false, "evidence": [{"url": "https://... page you actually found", "title": "seller name"}], "note_uz": "1 sentence in Uzbek Latin"}'
  ].join('\n');
  var r = await gemini.generateJson({ prompt: prompt, search: true });
  var v = r.data || {};
  if (v.available !== true) return { available: false, checked: true };
  var urls = (Array.isArray(v.evidence) ? v.evidence : []).map(function (e) { return { url: e && e.url, title: e && e.title }; })
    .concat((r.sources || []).map(function (s) { return { url: s.uri, title: s.title }; }))
    .filter(function (e) { return e.url; });
  for (var i = 0; i < urls.length && i < 6; i++) {
    var chk = await web.verifyPageMentions(urls[i].url, [ctx.brand]);
    if (!chk.ok || !chk.hits.length) continue;
    var host = web.hostOf(chk.finalUrl);
    var uzSignal = /\.uz$/.test(host) || /(ташкент|toshkent|tashkent|узбекистан|o.zbekiston|uzbekistan)/i.test(chk.title + ' ' + chk.text.slice(0, 20000));
    if (!uzSignal) continue;
    return {
      available: true, checked: true,
      dealer_url: chk.finalUrl, dealer_title: String(urls[i].title || host).slice(0, 200),
      note_uz: String(v.note_uz || "O'zbekistonda sotuvda mavjud").slice(0, 300)
    };
  }
  return { available: false, checked: true, unverified_claim: true };
}

module.exports = {
  discover: discover,
  discoverFromSites: discoverFromSites,
  enrich: enrich,
  validateData: validateData,
  collectImages: collectImages,
  consistencyCheck: consistencyCheck,
  checkUzbekistan: checkUzbekistan,
  checkOfficialPage: checkOfficialPage,
  _internals: { sigTokens: sigTokens, tokenCoverage: tokenCoverage, cyrRatio: cyrRatio, rankImages: rankImages }
};
