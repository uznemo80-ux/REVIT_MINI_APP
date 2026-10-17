'use strict';
/**
 * B variant (to'liq bepul, Google qidiruvisiz): material nomzodlari brendlarning o'z saytlaridan
 * va bepul veb-qidiruvdan olinadi.
 *
 * Manbalar ro'yxati:
 *   1) Admin paneldagi "Ishlab chiqaruvchilar" (material_manufacturers.website);
 *   2) Loyihadagi 85+ rasmiy brend saytlari (SEED_MANUFACTURERS — barcha 20 ta kategoriyaga bog'langan);
 *   3) MATERIAL_AGENT_SITES env (vergul bilan ajratilgan qo'shimcha saytlar).
 * Har bir saytdan:
 *   a) robots.txt → sitemap.xml orqali mahsulot sahifalari olinadi;
 *   b) Sitemap bo'lmasa yoki kam chiqsa — saytning katalog bo'limlari HTML crawler orqali aylanib chiqiladi;
 *   c) Qo'shimcha ravishda bepul veb-qidiruv (DuckDuckGo / Bing HTML) orqali rasmiy mahsulot sahifalari topiladi.
 */
var zlib = require('zlib');
var web = require('./web');
var seedModule = {};
try { seedModule = require('../../materialsSeed'); } catch (e) { seedModule = {}; }
var BUILTIN_MANUFACTURERS = Array.isArray(seedModule.SEED_MANUFACTURERS) ? seedModule.SEED_MANUFACTURERS : [];

var MAX_SITEMAP_FETCHES = 14;
var MAX_URLS = 10000;

var SKIP_PATH = /\/(news|novosti|blog|article|stati|press|events|career|vacanc|jobs|contacts?|kontakty?|about|o-kompanii|company|privacy|policy|cookie|login|register|auth|cart|basket|checkout|search|tag|author|faq|video|media|download|dokument|documents|certificat|sertifikat|dealers?|where-to-buy|gde-kupit|partner|projects|objects|kalkulyator|calculator|aksiya|promo|sale|forum| sitemap)(\/|$|-)/i;
var PRODUCTISH = /(product|produkt|produkty|produktsiya|production|catalog|katalog|tovar|goods|item|collection|kollekts|series|seriya|assortiment|range|decor|dekor|model|system|sistema|solutions|profil|plita|panel|kraska|smes|klej|germetik|dveri|okna|vanna|smesitel|keramogranit|laminat|parket|izolyats|membran|fasad|potolok|svet|treki)/i;
var MARKETPLACE_HOST = /(^|\.)(amazon|aliexpress|alibaba|ebay|ozon|wildberries|yandex|market\.yandex|avito|olx|uzum|leroymerlin|lemanapro|petrovich|vseinstrumenti|obi|castorama|homedepot|lowes|wikipedia|wikimedia|youtube|pinterest|instagram|facebook|vk|t\.me|telegram|tiktok|linkedin|twitter|x|duckduckgo|bing|google|mail\.ru|rambler|2gis|zoon|pulscen|tiu|satu|prom|blizko|stroyportal|forumhouse)\./i;

async function getText(url) {
  var r = await web.rawGetPublic(url, 4 * 1024 * 1024);
  if (!r.ok || !r.body) return '';
  var b = r.body;
  if (b[0] === 0x1f && b[1] === 0x8b) {
    try { b = zlib.gunzipSync(b); } catch (e) { return ''; }
  }
  return b.toString('utf8');
}

function locs(xml) {
  var out = [], re = /<loc>\s*(?:<!\[CDATA\[)?\s*([^<\s\]]+)\s*(?:\]\]>)?\s*<\/loc>/gi, m;
  while ((m = re.exec(xml))) out.push(m[1].replace(/&amp;/g, '&').trim());
  return out;
}

function filterCandidatePageUrls(pages, rootDomain) {
  var seen = new Set();
  return pages.filter(function (u) {
    if (!u || seen.has(u)) return false;
    var host = web.hostOf(u);
    if (rootDomain && web.rootDomain(host) !== rootDomain) return false;
    var path = '';
    try { path = decodeURIComponent(new URL(u).pathname); } catch (e) { return false; }
    if (path.length < 8 || path === '/') return false;
    if (/\.(pdf|jpe?g|png|webp|gif|svg|ico|zip|rar|7z|docx?|xlsx?|pptx?|dwg|dxf|rfa|rvt|3ds|max|obj|fbx|mp4|webm|xml|json|css|js)$/i.test(path)) return false;
    if (SKIP_PATH.test(path)) return false;
    if (path.split('/').filter(Boolean).length < 2) return false; // bosh/bo'lim sahifalari emas
    seen.add(u);
    return true;
  });
}

/** Saytning sitemap'laridan sahifa URL'larini yig'adi (cheklangan hajmda) */
async function sitemapPageUrls(siteUrl) {
  var origin;
  try { origin = new URL(siteUrl).origin; } catch (e) { return []; }
  var queue = [];
  var robots = await getText(origin + '/robots.txt');
  (robots.match(/^\s*sitemap:\s*(\S+)/gim) || []).forEach(function (l) { queue.push(l.replace(/^\s*sitemap:\s*/i, '').trim()); });
  if (!queue.length) {
    queue.push(origin + '/sitemap.xml', origin + '/sitemap_index.xml', origin + '/sitemap-index.xml');
  }

  var pages = [], fetched = 0, seen = new Set();
  while (queue.length && fetched < MAX_SITEMAP_FETCHES && pages.length < MAX_URLS) {
    // Mahsulotga oid sitemap'larni birinchi o'qiymiz
    queue.sort(function (a, b) { return (PRODUCTISH.test(b) ? 1 : 0) - (PRODUCTISH.test(a) ? 1 : 0); });
    var sm = queue.shift();
    if (seen.has(sm)) continue;
    seen.add(sm);
    fetched++;
    var xml = await getText(sm);
    if (!xml) continue;
    var list = locs(xml);
    if (/<sitemapindex/i.test(xml)) {
      list.forEach(function (u) { if (!/(news|blog|article|press|image|video|post|tag|author)/i.test(u)) queue.push(u); });
    } else {
      list.forEach(function (u) { if (pages.length < MAX_URLS) pages.push(u); });
    }
  }
  var root = web.rootDomain(web.hostOf(origin));
  return filterCandidatePageUrls(pages, root);
}

/**
 * Sitemap yo'q yoki bo'sh bo'lgan saytlarda bosh sahifa va katalog bo'limlarini
 * aylanib chiqib (HTML crawler), ichki mahsulot sahifalarini yig'adi.
 */
async function crawlCatalogUrls(siteUrl) {
  var origin;
  try { origin = new URL(siteUrl).origin; } catch (e) { return []; }
  var root = web.rootDomain(web.hostOf(origin));
  var home = await web.fetchPage(siteUrl);
  if (!home.ok || !home.html) return [];

  var allLinks = web.extractLinks(home.html, home.finalUrl || siteUrl);
  var sameDomainLinks = allLinks.filter(function (u) {
    return web.rootDomain(web.hostOf(u)) === root && !SKIP_PATH.test(u);
  });

  // Katalog bo'lim sahifalari (1–2 chuqurlikdagi catalog/products bo'limlari)
  var sectionQueue = sameDomainLinks.filter(function (u) {
    try {
      var p = new URL(u).pathname;
      var segs = p.split('/').filter(Boolean);
      return segs.length >= 1 && segs.length <= 3 && PRODUCTISH.test(p);
    } catch (e) { return false; }
  });
  // Agar bosh sahifadan katalog havolasi topilmasa, standart katalog manzillarini sinab ko'ramiz
  if (!sectionQueue.length) {
    ['/catalog', '/katalog', '/products', '/produktsiya'].forEach(function (p) {
      sectionQueue.push(origin + p);
    });
  }

  var visitedSections = new Set([siteUrl, home.finalUrl]);
  var collected = sameDomainLinks.slice();

  for (var i = 0; i < sectionQueue.length && visitedSections.size < 6 && collected.length < 600; i++) {
    var secUrl = sectionQueue[i];
    if (visitedSections.has(secUrl)) continue;
    visitedSections.add(secUrl);
    var secPage = await web.fetchPage(secUrl);
    if (!secPage.ok || !secPage.html) continue;
    var subLinks = web.extractLinks(secPage.html, secPage.finalUrl || secUrl);
    subLinks.forEach(function (u) {
      if (web.rootDomain(web.hostOf(u)) !== root || SKIP_PATH.test(u)) return;
      collected.push(u);
      try {
        var sp = new URL(u).pathname;
        var segs = sp.split('/').filter(Boolean);
        if (segs.length >= 2 && segs.length <= 3 && PRODUCTISH.test(sp) && sectionQueue.length < 10) {
          sectionQueue.push(u);
        }
      } catch (e) {}
    });
  }

  return filterCandidatePageUrls(collected, root);
}

/** Sitemap + HTML Katalog Crawler birgalikda */
async function discoverSiteUrls(siteUrl) {
  var urls = await sitemapPageUrls(siteUrl);
  if (urls.length >= 5 || web.isMocked()) return urls;
  var crawled = await crawlCatalogUrls(siteUrl);
  var combined = urls.concat(crawled);
  var seen = new Set();
  return combined.filter(function (u) {
    if (seen.has(u)) return false;
    seen.add(u);
    return true;
  });
}

/**
 * Bepul veb-qidiruv (DuckDuckGo HTML + Bing HTML):
 * Google Search grounding yoqilmagan bo'lsa ham rasmiy mahsulot sahifalarini topib beradi.
 */
async function freeWebSearch(query, maxResults) {
  if (web.isMocked()) return [];
  var q = String(query || '').trim();
  if (!q) return [];
  var limit = maxResults || 12;
  var found = [], seen = new Set();

  function addUrl(rawUrl) {
    try {
      var u = String(rawUrl || '').trim();
      if (u.indexOf('uddg=') !== -1) {
        var mUddg = u.match(/[?&]uddg=([^&]+)/);
        if (mUddg) u = decodeURIComponent(mUddg[1]);
      }
      var parsed = new URL(u);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return;
      var host = web.hostOf(parsed.toString());
      if (!host || MARKETPLACE_HOST.test(host)) return;
      if (SKIP_PATH.test(parsed.pathname)) return;
      if (/\.(pdf|zip|docx?|xlsx?|xml)$/i.test(parsed.pathname)) return;
      parsed.hash = '';
      var clean = parsed.toString();
      if (seen.has(clean)) return;
      seen.add(clean);
      found.push(clean);
    } catch (e) {}
  }

  // 1) DuckDuckGo HTML
  try {
    var ddgUrl = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q);
    var ddg = await web.fetchPage(ddgUrl);
    if (ddg.ok && ddg.html) {
      var links = web.extractLinks(ddg.html, ddgUrl);
      links.forEach(addUrl);
    }
  } catch (e) {}

  // 2) Bing HTML fallback
  if (found.length < 4) {
    try {
      var bingUrl = 'https://www.bing.com/search?q=' + encodeURIComponent(q);
      var bing = await web.fetchPage(bingUrl);
      if (bing.ok && bing.html) {
        var bLinks = web.extractLinks(bing.html, bingUrl);
        bLinks.forEach(addUrl);
      }
    } catch (e) {}
  }

  return found.slice(0, limit);
}

/** Builtin brendlar bo'yicha rootDomain → categories xaritasi */
function builtinMetaMap() {
  var byDomain = new Map(), byName = new Map();
  BUILTIN_MANUFACTURERS.forEach(function (m) {
    if (!m || !m.website) return;
    var root = web.rootDomain(web.hostOf(m.website));
    var cats = Array.isArray(m.categories) ? m.categories : [];
    if (root) byDomain.set(root, { brand: m.name, website: m.website, country: m.country || '', categories: cats });
    if (m.name) byName.set(String(m.name).toLowerCase(), { brand: m.name, website: m.website, country: m.country || '', categories: cats });
  });
  return { byDomain: byDomain, byName: byName };
}

/** Brend saytlari ro'yxati: admin paneldagi ishlab chiqaruvchilar + BUILTIN_MANUFACTURERS + env */
async function brandSites(pool) {
  var meta = builtinMetaMap();
  var r = await pool.query("SELECT name, website, country FROM material_manufacturers WHERE COALESCE(website, '') <> '' ORDER BY id");
  var list = r.rows.map(function (x) {
    var root = web.rootDomain(web.hostOf(x.website));
    var bm = meta.byDomain.get(root) || meta.byName.get(String(x.name || '').toLowerCase());
    return {
      brand: x.name,
      website: x.website,
      country: x.country || (bm && bm.country) || '',
      categories: (bm && bm.categories) ? bm.categories.slice() : []
    };
  });

  // Real ish rejimida (test mock o'rnatilmagan bo'lsa) 85+ o'rnatilgan brend saytlarini ham qo'shamiz
  if (!web.isMocked()) {
    BUILTIN_MANUFACTURERS.forEach(function (m) {
      if (!m || !m.website) return;
      list.push({
        brand: m.name || '',
        website: m.website,
        country: m.country || '',
        categories: Array.isArray(m.categories) ? m.categories.slice() : []
      });
    });
  }

  String(process.env.MATERIAL_AGENT_SITES || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean).forEach(function (u) {
    var siteUrl = /^https?:/i.test(u) ? u : 'https://' + u;
    var root = web.rootDomain(web.hostOf(siteUrl));
    var bm = meta.byDomain.get(root);
    list.push({
      brand: (bm && bm.brand) || '',
      website: siteUrl,
      country: (bm && bm.country) || '',
      categories: (bm && bm.categories) ? bm.categories.slice() : []
    });
  });

  var seen = new Set();
  return list.filter(function (s) {
    var root = web.rootDomain(web.hostOf(s.website));
    if (!root || seen.has(root)) return false;
    seen.add(root);
    return true;
  });
}

/** Ro'yxatni aralashtirish (har kuni boshqa brenddan boshlash uchun) */
function shuffle(arr, seed) {
  var a = arr.slice(), s = seed || Date.now();
  for (var i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    var j = Math.floor((s / 233280) * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

/**
 * Berilgan kategoriya uchun eng mos brend saytlarini birinchi o'ringa qo'yadi:
 * 1) Shu kategoriyaga biriktirilgan brend saytlari (aralashtirilgan holda)
 * 2) Kategoriyasi ko'rsatilmagan (admin qo'shgan) universal saytlar
 * 3) Qolgan brend saytlari
 */
function sitesForCategory(sites, categorySlug, seed) {
  var s = seed || Date.now();
  var slug = String(categorySlug || '').trim();
  if (!slug) return shuffle(sites || [], s);
  var matched = [], untagged = [], other = [];
  (sites || []).forEach(function (site) {
    var cats = Array.isArray(site.categories) ? site.categories : [];
    if (cats.indexOf(slug) !== -1) matched.push(site);
    else if (cats.length === 0) untagged.push(site);
    else other.push(site);
  });
  return shuffle(matched, s).concat(shuffle(untagged, s + 1)).concat(shuffle(other, s + 2));
}

/** AI ga beriladigan URL namunasi: mahsulotga o'xshaganlar oldinda, ishlatilganlar chiqarilgan */
function sampleUrls(urls, usedSet, limit, seed) {
  var fresh = urls.filter(function (u) { return !usedSet.has(u); });
  var prod = fresh.filter(function (u) { return PRODUCTISH.test(u); });
  var other = fresh.filter(function (u) { return !PRODUCTISH.test(u); });
  return shuffle(prod, seed).concat(shuffle(other, seed + 1)).slice(0, limit);
}

module.exports = {
  sitemapPageUrls: sitemapPageUrls,
  crawlCatalogUrls: crawlCatalogUrls,
  discoverSiteUrls: discoverSiteUrls,
  freeWebSearch: freeWebSearch,
  brandSites: brandSites,
  sitesForCategory: sitesForCategory,
  sampleUrls: sampleUrls,
  shuffle: shuffle,
  BUILTIN_MANUFACTURERS: BUILTIN_MANUFACTURERS,
  _internals: { locs: locs, filterCandidatePageUrls: filterCandidatePageUrls }
};
