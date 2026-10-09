'use strict';
/**
 * B variant (to'liq bepul, Google qidiruvisiz): material nomzodlari brendlarning o'z saytlaridan olinadi.
 *
 * Manbalar ro'yxati:
 *   1) Admin paneldagi "Ishlab chiqaruvchilar" (material_manufacturers.website) — asosiy manba,
 *      yangi brend qo'shish uchun shu yerga sayt manzilini kiritish kifoya;
 *   2) MATERIAL_AGENT_SITES env (vergul bilan ajratilgan qo'shimcha saytlar).
 * Har bir saytdan robots.txt → sitemap.xml orqali mahsulot sahifalari ro'yxati olinadi.
 */
var zlib = require('zlib');
var web = require('./web');

var MAX_SITEMAP_FETCHES = 8;
var MAX_URLS = 6000;

var SKIP_PATH = /\/(news|novosti|blog|article|stati|press|events|career|vacanc|jobs|contacts?|kontakty?|about|o-kompanii|company|privacy|policy|cookie|login|cart|search|tag|author|faq|video|media|download|dokument|documents|certificat|sertifikat|dealers?|where-to-buy|gde-kupit)(\/|$|-)/i;
var PRODUCTISH = /(product|produkt|produkty|catalog|katalog|tovar|goods|item|collection|kollekts|series|seriya|assortiment|range|decor|dekor)/i;

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
  var out = [], re = /<loc>\s*([^<\s]+)\s*<\/loc>/gi, m;
  while ((m = re.exec(xml))) out.push(m[1].replace(/&amp;/g, '&'));
  return out;
}

/** Saytning sitemap'laridan sahifa URL'larini yig'adi (cheklangan hajmda) */
async function sitemapPageUrls(siteUrl) {
  var origin;
  try { origin = new URL(siteUrl).origin; } catch (e) { return []; }
  var queue = [];
  var robots = await getText(origin + '/robots.txt');
  (robots.match(/^\s*sitemap:\s*(\S+)/gim) || []).forEach(function (l) { queue.push(l.replace(/^\s*sitemap:\s*/i, '').trim()); });
  if (!queue.length) queue.push(origin + '/sitemap.xml', origin + '/sitemap_index.xml');

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
      list.forEach(function (u) { if (!/(news|blog|article|press|image|video)/i.test(u)) queue.push(u); });
    } else {
      list.forEach(function (u) { if (pages.length < MAX_URLS) pages.push(u); });
    }
  }
  var root = web.rootDomain(web.hostOf(origin));
  return pages.filter(function (u) {
    var host = web.hostOf(u);
    if (web.rootDomain(host) !== root) return false;
    var path = '';
    try { path = decodeURIComponent(new URL(u).pathname); } catch (e) { return false; }
    if (path.length < 8 || path === '/') return false;
    if (/\.(pdf|jpe?g|png|webp|zip|docx?|xlsx?|dwg|rfa|rvt)$/i.test(path)) return false;
    if (SKIP_PATH.test(path)) return false;
    return path.split('/').filter(Boolean).length >= 2; // bosh/bo'lim sahifalari emas
  });
}

/** Brend saytlari ro'yxati: admin paneldagi ishlab chiqaruvchilar + env */
async function brandSites(pool) {
  var r = await pool.query("SELECT name, website, country FROM material_manufacturers WHERE COALESCE(website, '') <> '' ORDER BY id");
  var list = r.rows.map(function (x) { return { brand: x.name, website: x.website, country: x.country || '' }; });
  String(process.env.MATERIAL_AGENT_SITES || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean).forEach(function (u) {
    list.push({ brand: '', website: /^https?:/i.test(u) ? u : 'https://' + u, country: '' });
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

/** AI ga beriladigan URL namunasi: mahsulotga o'xshaganlar oldinda, ishlatilganlar chiqarilgan */
function sampleUrls(urls, usedSet, limit, seed) {
  var fresh = urls.filter(function (u) { return !usedSet.has(u); });
  var prod = fresh.filter(function (u) { return PRODUCTISH.test(u); });
  var other = fresh.filter(function (u) { return !PRODUCTISH.test(u); });
  return shuffle(prod, seed).concat(shuffle(other, seed + 1)).slice(0, limit);
}

module.exports = { sitemapPageUrls: sitemapPageUrls, brandSites: brandSites, sampleUrls: sampleUrls, shuffle: shuffle, _internals: { locs: locs } };
