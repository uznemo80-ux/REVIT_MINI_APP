'use strict';
/**
 * Veb-sahifa va rasmlarni xavfsiz yuklab olish (SSRF himoyasi urlValidator.fetchFollow orqali).
 * AI aytgan har bir havola shu yerda haqiqatan ochilib tekshiriladi — "o'ylab topilgan" havolalar o'tmaydi.
 */
var urlValidator = require('../../urlValidator');
var imageInfo = require('./imageInfo');

var BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
var MAX_HTML_BYTES = 3 * 1024 * 1024;

// Testlar uchun: tarmoq o'rniga soxta fetcher
var fetcher = null;
function setFetcher(fn) { fetcher = fn; }

async function readLimited(res, maxBytes) {
  if (!res.body || !res.body.getReader) {
    var ab = Buffer.from(await res.arrayBuffer());
    if (ab.length > maxBytes) throw new Error('too_large');
    return ab;
  }
  var reader = res.body.getReader();
  var chunks = [], total = 0;
  while (true) {
    var r = await reader.read();
    if (r.done) break;
    total += r.value.length;
    if (total > maxBytes) { try { await reader.cancel(); } catch (e) {} throw new Error('too_large'); }
    chunks.push(Buffer.from(r.value));
  }
  return Buffer.concat(chunks);
}

/** @returns {Promise<{ok:boolean,status:number,finalUrl:string,contentType:string,body:Buffer|null,error?:string}>} */
async function rawGet(url, opts) {
  opts = opts || {};
  if (fetcher) return fetcher(url, opts);
  var f = await urlValidator.fetchFollow(url, {
    timeout: opts.timeout || 20000,
    headers: { 'User-Agent': BROWSER_UA, 'Accept': opts.accept || '*/*', 'Accept-Language': 'ru,uz;q=0.9,en;q=0.8' }
  });
  if (f.error) return { ok: false, status: 0, finalUrl: url, contentType: '', body: null, error: f.error };
  var ct = String(f.res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  if (f.res.status < 200 || f.res.status >= 300) {
    try { f.res.body && f.res.body.cancel && f.res.body.cancel(); } catch (e) {}
    return { ok: false, status: f.res.status, finalUrl: f.finalUrl, contentType: ct, body: null, error: 'http_' + f.res.status };
  }
  try {
    var body = await readLimited(f.res, opts.maxBytes || MAX_HTML_BYTES);
    return { ok: true, status: f.res.status, finalUrl: f.finalUrl, contentType: ct, body: body };
  } catch (e) {
    return { ok: false, status: f.res.status, finalUrl: f.finalUrl, contentType: ct, body: null, error: e.message };
  }
}

function decodeEntities(s) {
  return String(s || '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, function (m, d) { return String.fromCodePoint(Number(d)); })
    .replace(/&#x([0-9a-f]+);/gi, function (m, h) { return String.fromCodePoint(parseInt(h, 16)); });
}

function htmlToText(html) {
  return decodeEntities(String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<(br|\/p|\/div|\/li|\/tr|\/h\d)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' '))
    .replace(/[ \t\r\f\v]+/g, ' ')
    .replace(/\n\s*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function pageTitle(html) {
  var m = String(html || '').match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? decodeEntities(m[1]).replace(/\s+/g, ' ').trim() : '';
}

/** HTML sahifani oladi va matnga aylantiradi */
async function fetchPage(url) {
  var r = await rawGet(url, { accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.5' });
  if (!r.ok) return { ok: false, url: url, finalUrl: r.finalUrl, status: r.status, error: r.error || 'fetch_failed' };
  if (r.contentType && r.contentType.indexOf('html') === -1) {
    return { ok: false, url: url, finalUrl: r.finalUrl, status: r.status, error: 'not_html:' + r.contentType };
  }
  var html = r.body.toString('utf8');
  return { ok: true, url: url, finalUrl: r.finalUrl, status: r.status, html: html, text: htmlToText(html), title: pageTitle(html) };
}

function absolutize(src, base) {
  try {
    var s = decodeEntities(String(src || '').trim());
    if (!s || s.indexOf('data:') === 0) return '';
    var u = new URL(s, base);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
    u.hash = '';
    return u.toString();
  } catch (e) { return ''; }
}

var JUNK_IMG = /(logo|icon|sprite|favicon|avatar|placeholder|banner-small|loader|spinner|flag|payment|social|facebook|instagram|telegram|youtube|vk\.|whatsapp|cart|arrow|button|pixel|blank|1x1|svg$)/i;

/**
 * Mahsulot sahifasidan rasm nomzodlarini ajratadi:
 * og:image, twitter:image, JSON-LD "image", <img src|data-src|srcset>, <a href="*.jpg">.
 */
function extractImageUrls(html, baseUrl) {
  var out = [], seen = new Set();
  function push(u, weight) {
    var abs = absolutize(u, baseUrl);
    if (!abs || seen.has(abs)) return;
    var path = abs.split('?')[0];
    if (JUNK_IMG.test(path)) return;
    if (/\.(svg|gif|ico)$/i.test(path)) return;
    seen.add(abs);
    out.push({ url: abs, weight: weight });
  }
  var h = String(html || '');
  var meta = /<meta[^>]+(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image(?::src)?)["'][^>]*>/gi, m;
  while ((m = meta.exec(h))) {
    var c = m[0].match(/content=["']([^"']+)["']/i);
    if (c) push(c[1], 10);
  }
  var ld = /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi;
  while ((m = ld.exec(h))) {
    var imgs = m[1].match(/"image"\s*:\s*(\[[^\]]*\]|"[^"]+"|\{[^}]*\})/g) || [];
    imgs.forEach(function (blk) {
      (blk.match(/https?:[^"\s]+?\.(?:jpe?g|png|webp)(?:\?[^"\s]*)?/gi) || []).forEach(function (u) { push(u.replace(/\\\//g, '/'), 9); });
    });
  }
  var img = /<img\b[^>]*>/gi;
  while ((m = img.exec(h))) {
    var tag = m[0];
    var attrs = ['data-zoom-image', 'data-large', 'data-full', 'data-src', 'data-lazy-src', 'data-original', 'src'];
    for (var i = 0; i < attrs.length; i++) {
      var a = tag.match(new RegExp('\\s' + attrs[i] + '=["\']([^"\']+)["\']', 'i'));
      if (a) { push(a[1], attrs[i] === 'src' ? 3 : 5); break; }
    }
    var ss = tag.match(/\ssrcset=["']([^"']+)["']/i);
    if (ss) {
      var parts = ss[1].split(',').map(function (p) { return p.trim().split(/\s+/)[0]; }).filter(Boolean);
      if (parts.length) push(parts[parts.length - 1], 4); // eng kattasi odatda oxirida
    }
  }
  var link = /<a\b[^>]+href=["']([^"']+\.(?:jpe?g|png|webp)(?:\?[^"']*)?)["']/gi;
  while ((m = link.exec(h))) push(m[1], 6);
  return out.sort(function (a, b) { return b.weight - a.weight; }).map(function (x) { return x.url; });
}

/** Rasmni yuklab, turini va o'lchamini tekshiradi */
async function fetchImage(url, maxBytes) {
  var r = await rawGet(url, { accept: 'image/avif,image/webp,image/jpeg,image/png,*/*;q=0.5', maxBytes: maxBytes, timeout: 20000 });
  if (!r.ok || !r.body) return { ok: false, url: url, error: r.error || 'fetch_failed' };
  var inf = imageInfo.info(r.body);
  if (!inf) return { ok: false, url: url, error: 'not_image' };
  return { ok: true, url: url, finalUrl: r.finalUrl, buffer: r.body, mime: inf.mime, ext: inf.ext, width: inf.width, height: inf.height };
}

/** Havola ishlayaptimi va sahifada kerakli so'zlar bormi */
async function verifyPageMentions(url, needles) {
  var p = await fetchPage(url);
  if (!p.ok) return { ok: false, url: url, error: p.error, status: p.status };
  var hay = normalize(p.title + ' ' + p.text);
  var hits = (needles || []).filter(function (n) { return n && hay.indexOf(normalize(n)) !== -1; });
  return { ok: true, url: url, finalUrl: p.finalUrl, title: p.title, text: p.text, html: p.html, hits: hits };
}

function normalize(s) {
  return String(s || '').toLowerCase().replace(/[ё]/g, 'е').replace(/[‘’ʻʼ`']/g, "'").replace(/[^a-zа-я0-9'.,]+/gi, ' ').replace(/\s+/g, ' ').trim();
}

function hostOf(url) {
  try { return new URL(url).hostname.toLowerCase().replace(/^www\./, ''); } catch (e) { return ''; }
}

/** a.b.example.com → example.com (oddiy registrable domen; .co.uk kabi holatlar uchun yetarli) */
function rootDomain(host) {
  var parts = String(host || '').split('.').filter(Boolean);
  if (parts.length <= 2) return parts.join('.');
  var sld = parts[parts.length - 2];
  if (/^(co|com|org|net|gov|edu|ac)$/.test(sld) && parts.length >= 3) return parts.slice(-3).join('.');
  return parts.slice(-2).join('.');
}

module.exports = {
  setFetcher: setFetcher,
  fetchPage: fetchPage,
  fetchImage: fetchImage,
  extractImageUrls: extractImageUrls,
  verifyPageMentions: verifyPageMentions,
  htmlToText: htmlToText,
  normalize: normalize,
  hostOf: hostOf,
  rootDomain: rootDomain
};
