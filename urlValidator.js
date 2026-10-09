'use strict';
/**
 * Havolalarni (PDF / rasmiy sayt / manba) tekshirish moduli.
 *
 * classifyUrl(url)            — tarmoqsiz, faqat shakl bo'yicha tasnif (pdf | drive | telegram | search | home | page | invalid)
 * validateSourceUrl(url)      — rasmiy sayt/manba sahifasi: HTTPS, status, redirect, HTML sahifa ekanini tekshiradi
 * validatePdfUrl(url)         — PDF: status, content-type: application/pdf yoki "%PDF-" imzosini tekshiradi
 * buildDocLinks(doc, checks)  — foydalanuvchiga ko'rsatiladigan tugmalar (PDF / rasmiy sayt / qidiruv) — faqat haqiqiy havolalar
 *
 * Hech qanday URL "o'ylab topilmaydi": faqat bazadagi qiymat tekshiriladi.
 */
const dns = require('dns').promises;
const net = require('net');

const UA = 'Mozilla/5.0 (compatible; YoshUzbekkLinkCheck/1.0)';
const MAX_REDIRECTS = 5;
const TIMEOUT_MS = 12000;

function isPrivateIp(ip) {
  if (!ip) return true;
  if (net.isIPv6(ip)) {
    const l = ip.toLowerCase();
    return l === '::1' || l.startsWith('fc') || l.startsWith('fd') || l.startsWith('fe80') || l.startsWith('::ffff:127.') || l.startsWith('::ffff:10.') || l.startsWith('::ffff:192.168.');
  }
  const p = ip.split('.').map(Number);
  if (p.length !== 4 || p.some(function (n) { return isNaN(n); })) return true;
  return p[0] === 10 || p[0] === 127 || p[0] === 0 || (p[0] === 169 && p[1] === 254) || (p[0] === 172 && p[1] >= 16 && p[1] <= 31) || (p[0] === 192 && p[1] === 168) || (p[0] === 100 && p[1] >= 64 && p[1] <= 127);
}

async function assertPublicHost(hostname, allowPrivate) {
  if (allowPrivate) return;
  if (!hostname || hostname === 'localhost' || hostname.endsWith('.local') || hostname.endsWith('.internal')) throw new Error('private_host');
  if (net.isIP(hostname)) { if (isPrivateIp(hostname)) throw new Error('private_host'); return; }
  const addrs = await dns.lookup(hostname, { all: true });
  if (!addrs.length || addrs.some(function (a) { return isPrivateIp(a.address); })) throw new Error('private_host');
}

// ---------- tarmoqsiz tasnif ----------
function parseUrl(u) {
  try {
    const s = String(u || '').trim();
    if (!s) return null;
    const url = new URL(s);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url;
  } catch (e) { return null; }
}

function classifyUrl(raw) {
  const s = String(raw || '').trim();
  if (!s) return { kind: 'empty', host: '', https: false, valid: false };
  const url = parseUrl(s);
  if (!url) return { kind: 'invalid', host: '', https: false, valid: false };
  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  const path = decodeURIComponent(url.pathname || '/');
  const out = { kind: 'page', host: host, https: url.protocol === 'https:', valid: true };
  if (/\.pdf$/i.test(path)) { out.kind = 'pdf'; return out; }
  if (host === 'drive.google.com' || host === 'docs.google.com') { out.kind = 'drive'; return out; }
  if (host === 't.me' || host === 'telegram.me') { out.kind = 'telegram'; return out; }
  if (/\/search\b|[?&](q|query|search|number)=/i.test(url.pathname + url.search)) { out.kind = 'search'; return out; }
  if ((path === '/' || path === '') && !url.search) { out.kind = 'home'; return out; }
  return out;
}

// ---------- tarmoq tekshiruvi ----------
async function fetchFollow(startUrl, opts) {
  opts = opts || {};
  let current = startUrl;
  const chain = [];
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    const u = parseUrl(current);
    if (!u) return { error: 'invalid_url', chain: chain };
    try { await assertPublicHost(u.hostname, opts.allowPrivate); } catch (e) { return { error: e.message === 'private_host' ? 'private_host' : 'dns_error', chain: chain }; }
    const ctrl = new AbortController();
    const timer = setTimeout(function () { ctrl.abort(); }, opts.timeout || TIMEOUT_MS);
    let res;
    try {
      res = await fetch(current, { method: opts.method || 'GET', redirect: 'manual', signal: ctrl.signal, headers: Object.assign({ 'User-Agent': UA, 'Accept': '*/*' }, opts.headers || {}) });
    } catch (e) {
      clearTimeout(timer);
      return { error: e.name === 'AbortError' ? 'timeout' : 'network_error', detail: String(e.cause && e.cause.code || e.message || ''), chain: chain };
    }
    clearTimeout(timer);
    chain.push({ url: current, status: res.status });
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      try { res.body && res.body.cancel && res.body.cancel(); } catch (e) {}
      current = new URL(res.headers.get('location'), current).toString();
      continue;
    }
    return { res: res, finalUrl: current, chain: chain };
  }
  return { error: 'too_many_redirects', chain: chain };
}

function baseResult(url) {
  const c = classifyUrl(url);
  return { url: String(url || '').trim(), kind: c.kind, host: c.host, https: c.https, ok: false, status: 'unchecked', http: 0, final_url: '', redirected: false, content_type: '', is_pdf: false, checked_at: new Date().toISOString(), note: '' };
}

async function validateSourceUrl(url, opts) {
  const r = baseResult(url);
  if (r.kind === 'empty') { r.status = 'missing'; return r; }
  if (r.kind === 'invalid') { r.status = 'invalid'; r.note = "URL noto'g'ri (http/https bo'lishi kerak)"; return r; }
  if (!r.https) r.note = 'HTTPS emas';
  const f = await fetchFollow(url, opts);
  if (f.error) { r.status = f.error; r.note = f.detail || ''; return r; }
  r.http = f.res.status;
  r.final_url = f.finalUrl;
  r.redirected = f.chain.length > 1;
  r.content_type = String(f.res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  try { f.res.body && f.res.body.cancel && f.res.body.cancel(); } catch (e) {}
  r.is_pdf = r.content_type === 'application/pdf';
  if (f.res.status >= 200 && f.res.status < 300) { r.ok = true; r.status = 'ok'; }
  else if (f.res.status === 404 || f.res.status === 410) r.status = 'not_found';
  else if (f.res.status === 403 || f.res.status === 401 || f.res.status === 429) { r.status = 'blocked'; r.note = 'Server so‘rovni rad etdi (bot himoyasi bo‘lishi mumkin) — qo‘lda tekshiring'; }
  else r.status = 'http_' + f.res.status;
  return r;
}

async function validatePdfUrl(url, opts) {
  const r = baseResult(url);
  if (r.kind === 'empty') { r.status = 'missing'; return r; }
  if (r.kind === 'invalid') { r.status = 'invalid'; r.note = "URL noto'g'ri (http/https bo'lishi kerak)"; return r; }
  if (r.kind === 'drive' || r.kind === 'telegram') { r.status = 'unverifiable'; r.ok = true; r.note = r.kind === 'drive' ? 'Google Drive havolasi (avtomatik tekshirib bo‘lmaydi)' : 'Telegram havolasi (avtomatik tekshirib bo‘lmaydi)'; return r; }
  const f = await fetchFollow(url, Object.assign({}, opts, { headers: { Range: 'bytes=0-1023' } }));
  if (f.error) { r.status = f.error; r.note = f.detail || ''; return r; }
  r.http = f.res.status;
  r.final_url = f.finalUrl;
  r.redirected = f.chain.length > 1;
  r.content_type = String(f.res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  let head = '';
  try { head = Buffer.from(await f.res.arrayBuffer()).subarray(0, 1024).toString('latin1'); } catch (e) {}
  const okStatus = f.res.status === 200 || f.res.status === 206;
  if (!okStatus) {
    r.status = f.res.status === 404 || f.res.status === 410 ? 'not_found' : (f.res.status === 403 || f.res.status === 401 || f.res.status === 429 ? 'blocked' : 'http_' + f.res.status);
    return r;
  }
  r.is_pdf = r.content_type === 'application/pdf' || head.indexOf('%PDF-') !== -1;
  if (r.is_pdf) { r.ok = true; r.status = 'ok'; }
  else { r.status = 'not_pdf'; r.note = 'Havola PDF faylga emas, ' + (r.content_type || 'boshqa turdagi') + ' sahifaga olib boradi'; }
  return r;
}

// Foydalanuvchiga ko'rsatiladigan tugmalar. Faqat haqiqiy va ishlaydigan havolalar qaytariladi.
//   checks: { pdf: {...validate natija...}|null, official: {...}|null }
function hostLabel(host) {
  if (!host) return 'Rasmiy sayt';
  if (host === 'lex.uz') return 'Lex.uz rasmiy sahifasi';
  if (host.indexOf('standart.uz') !== -1 || host.indexOf('standard.uz') !== -1) return 'O‘zstandart rasmiy sahifasi';
  return host + ' sahifasi';
}
const BAD = { not_found: 1, invalid: 1, dns_error: 1, network_error: 1, timeout: 0, too_many_redirects: 1, private_host: 1 };

function buildDocLinks(doc, checks) {
  checks = checks || {};
  const out = { pdf: null, official: null, search: null, issues: [] };
  const pdfRaw = String(doc.pdf_url || '').trim();
  const offRaw = String(doc.official_source_url || '').trim();
  const pc = classifyUrl(pdfRaw), oc = classifyUrl(offRaw);
  const pck = checks.pdf && checks.pdf.url === pdfRaw ? checks.pdf : null;
  const ock = checks.official && checks.official.url === offRaw ? checks.official : null;

  // --- PDF ---
  if (pdfRaw) {
    if (!pc.valid) out.issues.push({ field: 'pdf_url', code: 'invalid', text: "PDF havolasi noto'g'ri formatda" });
    else if (pck && (BAD[pck.status] || pck.status === 'not_pdf')) out.issues.push({ field: 'pdf_url', code: pck.status, text: pck.note || 'PDF havolasi ishlamayapti' });
    else if (pc.kind === 'pdf' || pc.kind === 'drive' || pc.kind === 'telegram' || (pck && pck.is_pdf)) {
      out.pdf = { url: pdfRaw, kind: pc.kind === 'page' ? 'pdf' : pc.kind, verified: !!(pck && pck.ok && pck.is_pdf), host: pc.host };
    } else if (pc.kind === 'search') {
      out.search = { url: pdfRaw, host: pc.host };
      out.issues.push({ field: 'pdf_url', code: 'search_not_pdf', text: 'PDF maydonida qidiruv sahifasi turibdi (PDF emas)' });
    } else {
      // oddiy veb-sahifa — PDF emas
      out.issues.push({ field: 'pdf_url', code: 'not_pdf', text: 'PDF maydonidagi havola PDF faylga emas, veb-sahifaga olib boradi' });
      if (!offRaw && pc.kind === 'page') out.official = { url: pdfRaw, label: hostLabel(pc.host), host: pc.host, verified: false, from: 'pdf_url' };
    }
  }

  // --- Rasmiy sayt ---
  if (offRaw && !out.official) {
    if (!oc.valid) out.issues.push({ field: 'official_source_url', code: 'invalid', text: "Rasmiy sayt havolasi noto'g'ri formatda" });
    else if (ock && BAD[ock.status]) out.issues.push({ field: 'official_source_url', code: ock.status, text: 'Rasmiy sayt havolasi ishlamayapti' });
    else if (oc.kind === 'home') out.issues.push({ field: 'official_source_url', code: 'generic_home', text: "Havola saytning bosh sahifasi — aniq hujjatga olib bormaydi" });
    else if (oc.kind === 'search') { if (!out.search) out.search = { url: offRaw, host: oc.host }; }
    else if (oc.kind === 'pdf' && !out.pdf) { out.pdf = { url: offRaw, kind: 'pdf', verified: false, host: oc.host, from: 'official_source_url' }; }
    else out.official = { url: offRaw, label: hostLabel(oc.host), host: oc.host, verified: !!(ock && ock.ok), from: 'official_source_url' };
  }
  return out;
}

module.exports = { classifyUrl, validateSourceUrl, validatePdfUrl, buildDocLinks, hostLabel, fetchFollow };
