'use strict';
// scripts/i18n_pages_source.json -> public/locales/<til>/pages.json
// Har bir yozuv: [uz, ru, en, tr, ar]. Kalit uz matnidan barqaror hash bilan olinadi.
// Ishga tushirish: node scripts/build_i18n_pages.js
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var ROOT = path.join(__dirname, '..');
var LANGS = ['uz', 'ru', 'en', 'tr', 'ar'];
var NS_OTHER = ['common', 'navigation', 'lessons', 'library', 'profile', 'settings', 'errors'];

function norm(s) { return String(s).replace(/[‘’ʻʼ`´]/g, "'").replace(/\s+/g, ' ').trim(); }

var rows = JSON.parse(fs.readFileSync(path.join(__dirname, 'i18n_pages_source.json'), 'utf8'));
var existing = new Set();
NS_OTHER.forEach(function (ns) {
  var f = path.join(ROOT, 'public/locales/uz', ns + '.json');
  if (!fs.existsSync(f)) return;
  var o = JSON.parse(fs.readFileSync(f, 'utf8'));
  Object.keys(o).forEach(function (k) { existing.add(norm(o[k])); });
});

var out = {}; LANGS.forEach(function (l) { out[l] = {}; });
var seen = new Set(), skipped = [];
rows.forEach(function (r, i) {
  if (!Array.isArray(r) || r.length !== 5 || r.some(function (x) { return typeof x !== 'string' || !x.trim(); })) throw new Error('Noto\'g\'ri qator #' + i);
  var src = norm(r[0]);
  if (seen.has(src)) throw new Error('Takroriy manba #' + i + ': ' + src);
  seen.add(src);
  var ph = (src.match(/\{\d+\}/g) || []).sort().join();
  r.forEach(function (v, j) { if ((norm(v).match(/\{\d+\}/g) || []).sort().join() !== ph) throw new Error('Placeholder mos emas #' + i + ' (' + LANGS[j] + ')'); });
  if (existing.has(src)) { skipped.push(src); return; }
  var key = 'p_' + crypto.createHash('sha1').update(src).digest('hex').slice(0, 10);
  LANGS.forEach(function (l, j) { out[l][key] = r[j]; });
});
LANGS.forEach(function (l) {
  fs.writeFileSync(path.join(ROOT, 'public/locales', l, 'pages.json'), JSON.stringify(out[l], null, 1) + '\n');
});
console.log('pages.json:', Object.keys(out.uz).length, 'ta kalit;', skipped.length, 'tasi mavjud lug\'atda bor, o\'tkazildi');
if (skipped.length) skipped.forEach(function (s) { console.log('  skip:', s.slice(0, 80)); });
