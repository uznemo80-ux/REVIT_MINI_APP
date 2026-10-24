'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { parseLexHtml, isLexUrl, lexDocId } = require('../services/lexText');

const html = fs.readFileSync(path.join(__dirname, 'fixtures', 'lex_sample.html'), 'utf8');

test('lexDocId / isLexUrl: hujjat havolalari', () => {
  assert.strictEqual(lexDocId('https://lex.uz/uz/docs/-7121730'), '7121730');
  assert.strictEqual(lexDocId('https://lex.uz/docs/7121730'), '7121730');
  assert.strictEqual(lexDocId('https://lex.uz/uz/search/all?search_text=SHNQ'), null);
  assert.ok(isLexUrl('https://lex.uz/uz/docs/-7121730'));
  assert.ok(!isLexUrl('http://lex.uz/docs/1'));
  assert.ok(!isLexUrl('https://evil-lex.uz.example.com/docs/1'));
});

test('parseLexHtml: sarlavha, bloklar va jadval', () => {
  const r = parseLexHtml(html);
  assert.match(r.title, /SHNQ 2\.08\.01-24/);
  const kinds = new Set(r.blocks.map((b) => b.k));
  for (const k of ['title', 'p', 'h', 'table']) assert.ok(kinds.has(k), 'blok turi yo\'q: ' + k);
  const table = r.blocks.find((b) => b.k === 'table');
  assert.ok(Array.isArray(table.rows) && table.rows.length > 1);
});

test('parseLexHtml: xavfsiz HTML (skript, hodisa, sayt paneli yo\'q)', () => {
  const r = parseLexHtml(html);
  const all = JSON.stringify(r.blocks);
  assert.ok(!/<script|onclick|onmousemove|javascript:/i.test(all));
  assert.ok(!/Hujjatga taklif yuborish|Audioni tinglash/.test(all));
});
