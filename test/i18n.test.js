'use strict';
/**
 * i18n testlari (bazasiz):  npm run test:i18n
 * public/i18n.js ni Node vm ichida (soxta window/localStorage bilan) yuklab, tarjimalarni tekshiradi.
 */
var test = require('node:test');
var assert = require('node:assert/strict');
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var ROOT = path.join(__dirname, '..');
var NS = ['common', 'navigation', 'lessons', 'library', 'profile', 'settings', 'errors', 'pages'];
var LANGS = ['uz', 'ru', 'en', 'tr', 'ar'];

function readLocale(lang) {
  var out = {};
  NS.forEach(function (ns) {
    var f = path.join(ROOT, 'public/locales', lang, ns + '.json');
    if (!fs.existsSync(f)) return;
    var o = JSON.parse(fs.readFileSync(f, 'utf8'));
    Object.keys(o).forEach(function (k) { out[ns + '.' + k] = o[k]; });
  });
  return out;
}

// server.js dagi buildI18nPayload bilan bir xil yig'ish
function payload(lang) {
  var uz = readLocale('uz');
  var chain = [lang].concat(['en', 'ru'].filter(function (x) { return x !== lang; })).map(readLocale);
  var pairs = [];
  Object.keys(uz).forEach(function (k) {
    for (var i = 0; i < chain.length; i++) if (chain[i][k]) { pairs.push([uz[k], chain[i][k]]); break; }
  });
  return { ok: true, lang: lang, dict: {}, uz: uz, pairs: pairs };
}

function loadI18n(lang) {
  var store = { yosh_lang: lang, ['yosh_i18n_v1_' + lang]: JSON.stringify(payload(lang)) };
  var attrs = {};
  var win = {
    localStorage: {
      getItem: function (k) { return k in store ? store[k] : null; },
      setItem: function (k, v) { store[k] = String(v); },
      removeItem: function (k) { delete store[k]; }
    },
    fetch: function () { return Promise.reject(new Error('offline')); },
    document: {
      documentElement: { setAttribute: function (k, v) { attrs[k] = v; } },
      body: null,
      getElementById: function () { return null; },
      createElement: function () { return {}; },
      head: { appendChild: function () {} }
    }
  };
  win.window = win;
  var ctx = vm.createContext(win);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'public/i18n.js'), 'utf8'), ctx);
  ctx.I18N.init();
  return ctx.I18N;
}

test('Sertifikat va portfolio himoyasi va\'dasi olib tashlangan', function () {
  var app = fs.readFileSync(path.join(ROOT, 'public/app.js'), 'utf8');
  assert.equal(/sertifikat va portfolio/i.test(app), false);
  LANGS.forEach(function (l) {
    var all = JSON.stringify(readLocale(l));
    assert.equal(/портфолио|portfolio defense|portfolyo savunması|ملف الأعمال|portfolio himoyasi/i.test(all), false, l);
  });
});

test('pages.json: barcha tillarda bir xil kalitlar va bo\'sh qiymat yo\'q', function () {
  var base = Object.keys(readLocale('uz')).filter(function (k) { return k.indexOf('pages.') === 0; }).sort();
  assert.ok(base.length > 100);
  LANGS.forEach(function (l) {
    var loc = readLocale(l);
    var keys = Object.keys(loc).filter(function (k) { return k.indexOf('pages.') === 0; }).sort();
    assert.deepEqual(keys, base, l);
    keys.forEach(function (k) { assert.ok(String(loc[k]).trim(), l + ' ' + k); });
  });
});

test('Emoji bilan boshlangan narx va modul qatorlari to\'g\'ri tarjima qilinadi', function () {
  var ru = loadI18n('ru');
  assert.equal(ru.tr("💰 Narxi: 1 500 000 so'm"), '💰 Цена: 1 500 000 сум');
  assert.equal(ru.tr("✅ 11 ta modul va 140 ta video darsga 1 yil to'liq kirish"), '✅ Полный доступ на 1 год к 11 модулям и 140 видеоурокам');
  assert.equal(ru.tr("1 500 000 so'm"), '1 500 000 сум');
  var en = loadI18n('en');
  assert.equal(en.tr("💰 Narxi: 1 500 000 so'm"), '💰 Price: 1 500 000 UZS');
});

test('Profil va bosh sahifadagi oldin tarjimasiz qolgan matnlar', function () {
  var cases = {
    ru: [['Xush kelibsiz, Ali!', 'Добро пожаловать, Ali!'], ['Barcha kurslar (3) →', 'Все курсы (3) →'], ['Kirish yo‘q', 'Нет доступа'], ['INTPRO — Revit Kursi (Pullik)', 'INTPRO — курс Revit (платный)'], ['💬 Adminga Telegram\'dan yozish (@texnik_uzb)', '💬 Написать админу в Telegram (@texnik_uzb)']],
    en: [['Kirish yo‘q', 'No access'], ['Umumiy qoidalar', 'General provisions']],
    tr: [['Kirish yo‘q', 'Erişim yok'], ['0/3 dars bajarildi', '0/3 ders tamamlandı']],
    ar: [['Kirish yo‘q', 'لا يوجد وصول'], ['Bizni ijtimoiy tarmoqlarda kuzating', 'تابعونا على وسائل التواصل الاجتماعي']]
  };
  Object.keys(cases).forEach(function (l) {
    var I = loadI18n(l);
    cases[l].forEach(function (c) { assert.equal(I.tr(c[0]), c[1], l + ': ' + c[0]); });
  });
});

test('Mavjud emojili shablonlar avvalgidek ishlaydi', function () {
  var uz = readLocale('uz'), ru = readLocale('ru');
  var I = loadI18n('ru');
  Object.keys(uz).forEach(function (k) {
    var src = uz[k];
    if (!/\{0\}/.test(src) || /\{1\}/.test(src)) return;
    if (!/^[^\p{L}\d{(]/u.test(src)) return; // faqat emoji/belgi bilan boshlanadiganlar
    var sample = src.replace('{0}', '7');
    var expected = String(ru[k]).replace('{0}', '7');
    assert.equal(I.tr(sample), expected, k);
  });
});
