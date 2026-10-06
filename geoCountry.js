'use strict';
/**
 * Foydalanuvchi qaysi DAVLATdan kirganini aniqlash (faqat davlat darajasi).
 *
 * - Offlayn baza (geoip-country): hech qanday tashqi servisga so'rov ketmaydi, IP manzil hech qayerda SAQLANMAYDI.
 * - Faqat ikki harfli davlat kodi (masalan "UZ") saqlanadi.
 * - Viloyat/tuman IP orqali ishonchli aniqlanmaydi (O'zbekistonda IP'lar asosan Toshkentga bog'langan), shuning uchun u hisoblanmaydi.
 */
let geo = null;
try { geo = require('geoip-country'); } catch (e) { console.warn('[GEO] geoip-country o\'rnatilmagan:', e.message); }

let uzNames = null, enNames = null;
try { uzNames = new Intl.DisplayNames(['uz'], { type: 'region' }); } catch (e) {}
try { enNames = new Intl.DisplayNames(['en'], { type: 'region' }); } catch (e) {}

function stripIp(raw) {
  let ip = String(raw || '').trim();
  if (!ip) return '';
  ip = ip.replace(/^\[|\]$/g, '');
  if (ip.indexOf('::ffff:') === 0 && ip.indexOf('.') !== -1) ip = ip.slice(7);       // IPv6-mapped IPv4
  if (/^\d+\.\d+\.\d+\.\d+:\d+$/.test(ip)) ip = ip.split(':')[0];                    // IPv4:port
  return ip;
}

function isPrivateOrLocal(ip) {
  if (!ip) return true;
  if (ip === '::1' || ip === '::' || /^f[cd][0-9a-f]{2}:/i.test(ip) || /^fe80:/i.test(ip)) return true;
  const m = ip.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (!m) return !ip.includes(':');
  const a = +m[1], b = +m[2];
  return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
}

// Proksi ortida haqiqiy mijoz IP'sini topish. Mijoz o'zi yozishi mumkin bo'lgan chap tomonga ishonilmaydi:
// avval X-Real-IP, keyin X-Forwarded-For ning OXIRGI ommaviy manzili, keyin socket manzili.
function clientIpFromReq(req) {
  const h = (req && req.headers) || {};
  const candidates = [];
  if (h['x-real-ip']) candidates.push(stripIp(String(h['x-real-ip']).split(',')[0]));
  const xff = h['x-forwarded-for'];
  if (xff) {
    const parts = String(xff).split(',').map(stripIp).filter(Boolean);
    for (let i = parts.length - 1; i >= 0; i--) candidates.push(parts[i]);
  }
  if (req && req.socket && req.socket.remoteAddress) candidates.push(stripIp(req.socket.remoteAddress));
  for (const c of candidates) if (c && !isPrivateOrLocal(c)) return c;
  return '';
}

function flagEmoji(code) {
  if (!/^[A-Z]{2}$/.test(code || '')) return '🌐';
  return String.fromCodePoint(...[...code].map(ch => 127397 + ch.charCodeAt(0)));
}

function countryName(code) {
  if (!code) return 'Aniqlanmagan';
  let n = '';
  try { n = uzNames && uzNames.of(code); } catch (e) {}
  if (!n || n === code) { try { n = enNames && enNames.of(code); } catch (e) {} }
  return n && n !== code ? n : code;
}

// → { code: 'UZ' } yoki null (aniqlanmadi / ichki manzil)
function lookupCountry(ip) {
  const clean = stripIp(ip);
  if (!geo || !clean || isPrivateOrLocal(clean)) return null;
  try {
    const r = geo.lookup(clean);
    return r && r.country && /^[A-Z]{2}$/.test(r.country) ? { code: r.country } : null;
  } catch (e) { return null; }
}

module.exports = { lookupCountry, clientIpFromReq, countryName, flagEmoji, isPrivateOrLocal, stripIp };
