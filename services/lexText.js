'use strict';
// lex.uz hujjat sahifasidan rasmiy matnni ajratib olish (ilova ichida o'qish uchun).
// lex.uz sahifasi: <div id="divCont"> ichida har bir element ".lx_elem" (sinf nomi turini bildiradi:
// ACT_TITLE, ACT_TEXT, TEXT_HEADER_DEFAULT, TABLE_STD2 ...). Har elementda ".lx_elem2" — saytning
// o'z asboblar paneli (taklif yuborish, audio) — u tashlab yuboriladi.
// Natija xavfsiz bloklar: { k, id, h } yoki jadval { k: 'table', id, rows: [[{ h, cs, rs }]] }.
// h — faqat ruxsat etilgan teglar (b, i, u, sup, sub, br, a) bilan tozalangan HTML.

const { parse } = require('node-html-parser');

const LEX_ORIGIN = 'https://lex.uz';
const MAX_HTML_BYTES = 12 * 1024 * 1024;
const MAX_BLOCKS = 8000;

const KIND_BY_CLASS = {
  ACT_TITLE: 'title',
  ACT_TITLE_APPL: 'title',
  ACCEPTING_BODY: 'head',
  ACT_FORM: 'head',
  DEPARTMENTAL: 'meta',
  TEXT_HEADER_DEFAULT: 'h',
  APPL_BANNER_LANDSCAPE_TITLE: 'appl',
  APPL_BANNER: 'appl',
  SIGNATURE: 'sig',
  ACT_ESSENTIAL_ELEMENTS: 'sig',
  ACT_ESSENTIAL_ELEMENTS_NUM: 'sig',
  FOOTNOTE: 'fn',
  TEXT_CENTER: 'center',
  COMMENT: 'cmt',
  CHANGES_ORIGINS: 'chg'
};
const SKIP_CLASSES = /^(INDEXES_ON_REF)$/;
const DROP_TAGS = /^(script|style|noscript|img|label|button|input|select|textarea|svg|iframe|object|embed|form)$/;
const INLINE_MAP = { b: 'b', strong: 'b', i: 'i', em: 'i', u: 'u', sup: 'sup', sub: 'sub' };
const BLOCK_TAGS = /^(p|div|li|h[1-6]|blockquote|tr|section|article)$/;

function isLexUrl(url) {
  try {
    const u = new URL(String(url || ''));
    return u.protocol === 'https:' && /(^|\.)lex\.uz$/i.test(u.hostname);
  } catch (e) { return false; }
}

// lex.uz/uz/docs/-7121730, lex.uz/docs/7121730 -> "7121730"
function lexDocId(url) {
  const m = String(url || '').match(/lex\.uz\/(?:[a-z]{2}\/)?docs\/-?(\d{3,12})/i);
  return m ? m[1] : null;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function absUrl(href) {
  const h = String(href || '').trim();
  if (!h || /^(javascript|data|vbscript):/i.test(h)) return null;
  try {
    const u = new URL(h, LEX_ORIGIN + '/');
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    return u.toString();
  } catch (e) { return null; }
}

function nodeText(n) {
  // node-html-parser: TextNode.text — HTML entitylari ochilgan matn
  return String(n.text || '').replace(/ /g, ' ').replace(/[ \t\r\n\f]+/g, ' ');
}

// Element ichidagi kontentni xavfsiz inline HTML ga aylantiradi
function inline(node, ctx) {
  let out = '';
  for (const ch of node.childNodes || []) {
    if (ch.nodeType === 3) { out += esc(nodeText(ch)); continue; }
    if (ch.nodeType !== 1) continue;
    const tag = String(ch.rawTagName || '').toLowerCase();
    if (!tag || DROP_TAGS.test(tag)) continue;
    const cls = String(ch.getAttribute && ch.getAttribute('class') || '');
    if (/\blx_elem2\b/.test(cls)) continue; // saytning asboblar paneli
    if (tag === 'br') { out += '<br>'; continue; }
    if (tag === 'table') { continue; } // ichma-ich jadvallar alohida ko'rilmaydi
    const inner = inline(ch, ctx);
    if (tag === 'a') {
      const url = absUrl(ch.getAttribute('href'));
      if (!url || !inner.trim()) { out += inner; continue; }
      const self = ctx && ctx.docId && lexDocId(url) === ctx.docId && url.indexOf('#') !== -1 && url.indexOf('ONDATE') === -1;
      const anchor = self ? url.split('#')[1] : '';
      out += anchor
        ? `<a href="#${esc(anchor)}" data-lx-anchor="${esc(anchor)}">${inner}</a>`
        : `<a href="${esc(url)}" data-lx-ext="1" target="_blank" rel="noopener noreferrer">${inner}</a>`;
      continue;
    }
    if (INLINE_MAP[tag]) {
      out += inner.trim() ? `<${INLINE_MAP[tag]}>${inner}</${INLINE_MAP[tag]}>` : inner;
      continue;
    }
    if (BLOCK_TAGS.test(tag)) {
      const t = inner.trim();
      if (t) out += (out && !/<br>\s*$/.test(out) ? '<br>' : '') + t;
      continue;
    }
    out += inner; // span, font va h.k. — faqat ichidagi matn
  }
  return out;
}

function tidy(h) {
  return String(h || '')
    .replace(/\s+/g, ' ')
    .replace(/(\s*<br>\s*){3,}/g, '<br><br>')
    .replace(/^(\s*<br>\s*)+|(\s*<br>\s*)+$/g, '')
    .trim();
}

function plain(h) { return String(h || '').replace(/<[^>]+>/g, '').replace(/&nbsp;|\s+/g, ' ').trim(); }

function tableRows(table, ctx) {
  const rows = [];
  for (const tr of table.querySelectorAll('tr')) {
    // ichma-ich jadval qatorlarini tashqi jadvalga qo'shmaymiz
    let p = tr.parentNode, nested = false;
    while (p && p !== table) { if (String(p.rawTagName || '').toLowerCase() === 'table') { nested = true; break; } p = p.parentNode; }
    if (nested) continue;
    const cells = [];
    for (const td of tr.childNodes || []) {
      const tag = String(td.rawTagName || '').toLowerCase();
      if (tag !== 'td' && tag !== 'th') continue;
      const cs = Math.min(50, Math.max(1, parseInt(td.getAttribute('colspan'), 10) || 1));
      const rs = Math.min(200, Math.max(1, parseInt(td.getAttribute('rowspan'), 10) || 1));
      const cell = { h: tidy(inline(td, ctx)) };
      if (cs > 1) cell.cs = cs;
      if (rs > 1) cell.rs = rs;
      if (tag === 'th') cell.th = 1;
      cells.push(cell);
    }
    if (cells.length && cells.some(c => plain(c.h))) rows.push(cells);
  }
  return rows;
}

function kindOf(cls) {
  const names = String(cls || '').split(/\s+/);
  for (const n of names) {
    if (SKIP_CLASSES.test(n)) return null;
    if (/^TABLE_/.test(n)) return 'table';
    if (KIND_BY_CLASS[n]) return KIND_BY_CLASS[n];
  }
  return 'p';
}

/**
 * lex.uz HTML sahifasini bloklarga aylantiradi.
 * @returns {{ title: string, blocks: Array, chars: number }}
 */
function parseLexHtml(html, opts) {
  opts = opts || {};
  const src = String(html || '');
  if (!src) throw Object.assign(new Error('empty'), { code: 'empty' });
  const root = parse(src, { blockTextElements: { script: false, style: false, noscript: false, pre: true } });
  const cont = root.querySelector('#divCont');
  if (!cont) throw Object.assign(new Error('Hujjat matni topilmadi'), { code: 'no_content' });
  const ctx = { docId: opts.docId || null };
  const blocks = [];
  let chars = 0;
  for (const el of cont.childNodes || []) {
    if (el.nodeType !== 1) continue;
    const kind = kindOf(el.getAttribute('class'));
    if (!kind) continue;
    const style = String(el.getAttribute('style') || '');
    if (/display\s*:\s*none/i.test(style)) continue;
    // kontent tuguni: id="-123" yoki name="..." bo'lgan ichki div; topilmasa elementning o'zi
    const body = (el.childNodes || []).find(c => c.nodeType === 1 && String(c.rawTagName || '').toLowerCase() === 'div' && (c.getAttribute('id') || c.getAttribute('name')) && !/\blx_elem2\b/.test(String(c.getAttribute('class') || ''))) || el;
    const rawId = String(body.getAttribute && (body.getAttribute('id') || '') || '');
    const id = /^-?\d{3,12}$/.test(rawId) ? rawId : undefined;
    if (kind === 'table') {
      const t = body.querySelector('table');
      if (!t) continue;
      const rows = tableRows(t, ctx);
      if (!rows.length) continue;
      const b = { k: 'table', rows };
      if (id) b.id = id;
      blocks.push(b);
      chars += rows.reduce((s, r) => s + r.reduce((a, c) => a + c.h.length, 0), 0);
    } else {
      const h = tidy(inline(body, ctx));
      if (!plain(h)) continue;
      const b = { k: kind, h };
      if (id) b.id = id;
      blocks.push(b);
      chars += h.length;
    }
    if (blocks.length >= MAX_BLOCKS) break;
  }
  if (!blocks.length) throw Object.assign(new Error('Hujjat matni bo\'sh'), { code: 'no_content' });
  const titleEl = root.querySelector('title');
  const title = titleEl ? String(titleEl.text || '').replace(/\s+/g, ' ').trim() : '';
  return { title, blocks, chars };
}

async function fetchLexDocument(url, opts) {
  opts = opts || {};
  if (!isLexUrl(url)) throw Object.assign(new Error('Faqat lex.uz havolalari qo\'llab-quvvatlanadi'), { code: 'bad_url' });
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs || 30000);
  let res;
  try {
    res = await (opts.fetch || fetch)(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'uz,ru;q=0.8,en;q=0.5'
      }
    });
  } catch (e) {
    throw Object.assign(new Error(e && e.name === 'AbortError' ? 'lex.uz javob bermadi (vaqt tugadi)' : 'lex.uz bilan bog\'lanib bo\'lmadi'), { code: 'network' });
  } finally { clearTimeout(timer); }
  if (!res.ok) throw Object.assign(new Error('lex.uz xatolik qaytardi: ' + res.status), { code: 'http_' + res.status });
  const len = parseInt(res.headers.get('content-length') || '0', 10);
  if (len > MAX_HTML_BYTES) throw Object.assign(new Error('Sahifa juda katta'), { code: 'too_large' });
  const html = await res.text();
  if (html.length > MAX_HTML_BYTES) throw Object.assign(new Error('Sahifa juda katta'), { code: 'too_large' });
  return parseLexHtml(html, { docId: lexDocId(url) });
}

module.exports = { parseLexHtml, fetchLexDocument, isLexUrl, lexDocId };
