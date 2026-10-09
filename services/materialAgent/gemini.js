'use strict';
/**
 * Gemini API klienti (generateContent).
 * - Google Search grounding: tools: [{ google_search: {} }]  (paid tarif talab qilinadi)
 * - Rasm tahlili: inline_data (base64)
 * - Model mavjud modellar ro'yxatidan avtomatik tanlanadi (eskirgan model nomi kod ichida qotib qolmaydi)
 */
var config = require('./config');

var API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
var TIMEOUT_MS = 90 * 1000;

// Testlar uchun: tarmoq o'rniga soxta transport ulash mumkin
var transport = null;
function setTransport(fn) { transport = fn; resolvedModel = null; }

var resolvedModel = null;

async function httpJson(method, url, body) {
  if (transport) return transport(method, url, body);
  var ctrl = new AbortController();
  var timer = setTimeout(function () { ctrl.abort(); }, TIMEOUT_MS);
  try {
    var res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': config.apiKey },
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal
    });
    var text = await res.text();
    var json = null;
    try { json = JSON.parse(text); } catch (e) { /* bo'sh */ }
    return { status: res.status, json: json, text: text };
  } finally {
    clearTimeout(timer);
  }
}

function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

async function resolveModel() {
  if (config.modelOverride) return config.modelOverride;
  if (resolvedModel) return resolvedModel;
  var r = await httpJson('GET', API_BASE + '/models?pageSize=200');
  if (r.status !== 200 || !r.json || !Array.isArray(r.json.models)) {
    throw new Error('Gemini modellar ro\'yxatini olib bo\'lmadi (HTTP ' + r.status + '): ' + apiErrorText(r));
  }
  var available = r.json.models
    .filter(function (m) { return (m.supportedGenerationMethods || []).indexOf('generateContent') !== -1; })
    .map(function (m) { return String(m.name || '').replace(/^models\//, ''); });
  for (var i = 0; i < config.MODEL_PREFERENCE.length; i++) {
    if (available.indexOf(config.MODEL_PREFERENCE[i]) !== -1) {
      resolvedModel = config.MODEL_PREFERENCE[i];
      console.log('🤖 MaterialAgent: Gemini modeli tanlandi →', resolvedModel);
      return resolvedModel;
    }
  }
  // Afzal ro'yxatda yo'q bo'lsa — eng yangi "flash" (preview/lite emas)
  var flash = available.filter(function (n) { return /^gemini-[\d.]+-flash$/.test(n); }).sort().reverse();
  if (flash.length) { resolvedModel = flash[0]; return resolvedModel; }
  throw new Error('Mos Gemini flash modeli topilmadi');
}

function apiErrorText(r) {
  if (r && r.json && r.json.error) return r.json.error.message || JSON.stringify(r.json.error);
  return String((r && r.text) || '').slice(0, 300);
}

/**
 * @param {object} opts
 * @param {string} opts.prompt
 * @param {boolean} [opts.search]  Google Search grounding
 * @param {Array<{mime:string,data:Buffer}>} [opts.images]
 * @param {boolean} [opts.json]    JSON javob (search bilan birga ishlatilmaydi — matndan ajratiladi)
 * @returns {Promise<{text:string, sources:Array<{uri:string,title:string}>, queries:string[], model:string}>}
 */
async function generate(opts) {
  var model = await resolveModel();
  var parts = [{ text: opts.prompt }];
  (opts.images || []).forEach(function (img) {
    parts.push({ inline_data: { mime_type: img.mime, data: Buffer.from(img.data).toString('base64') } });
  });
  var body = {
    contents: [{ role: 'user', parts: parts }],
    generationConfig: { temperature: opts.temperature == null ? 0.2 : opts.temperature }
  };
  if (opts.search) body.tools = [{ google_search: {} }];
  else if (opts.json) body.generationConfig.responseMimeType = 'application/json';

  var url = API_BASE + '/models/' + encodeURIComponent(model) + ':generateContent';
  var lastErr = null;
  for (var attempt = 0; attempt < 4; attempt++) {
    var r;
    try {
      r = await httpJson('POST', url, body);
    } catch (e) {
      lastErr = new Error('Gemini tarmoq xatosi: ' + e.message);
      await sleep(2000 * (attempt + 1));
      continue;
    }
    if (r.status === 429 || r.status >= 500) {
      lastErr = new Error('Gemini vaqtincha band (HTTP ' + r.status + '): ' + apiErrorText(r));
      await sleep(5000 * Math.pow(2, attempt));
      continue;
    }
    if (r.status !== 200) {
      var msg = apiErrorText(r);
      if (opts.search && /search|grounding|tool/i.test(msg)) {
        throw new Error('Google Search grounding ishlamadi: ' + msg + ' (AI Studio\'da billing ulanganini tekshiring)');
      }
      throw new Error('Gemini xatosi (HTTP ' + r.status + '): ' + msg);
    }
    var cand = r.json && r.json.candidates && r.json.candidates[0];
    if (!cand || !cand.content || !Array.isArray(cand.content.parts)) {
      var reason = (cand && cand.finishReason) || (r.json && r.json.promptFeedback && r.json.promptFeedback.blockReason) || 'empty';
      lastErr = new Error('Gemini bo\'sh javob qaytardi: ' + reason);
      continue;
    }
    var text = cand.content.parts.map(function (p) { return p.text || ''; }).join('').trim();
    var gm = cand.groundingMetadata || {};
    var sources = (gm.groundingChunks || [])
      .map(function (c) { return c && c.web ? { uri: c.web.uri || '', title: c.web.title || '' } : null; })
      .filter(function (s) { return s && s.uri; });
    return { text: text, sources: sources, queries: gm.webSearchQueries || [], model: model };
  }
  throw lastErr || new Error('Gemini javob bermadi');
}

/** Matn ichidagi birinchi JSON obyekt/massivni ajratib oladi (```json bloklari ham). */
function extractJson(text) {
  var s = String(text || '').trim();
  var fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) s = fence[1].trim();
  try { return JSON.parse(s); } catch (e) { /* davom */ }
  var start = -1;
  for (var i = 0; i < s.length; i++) { if (s[i] === '{' || s[i] === '[') { start = i; break; } }
  if (start === -1) throw new Error('AI javobida JSON topilmadi');
  var open = s[start], close = open === '{' ? '}' : ']';
  var depth = 0, inStr = false, esc = false;
  for (var j = start; j < s.length; j++) {
    var ch = s[j];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === open) depth++;
    else if (ch === close) { depth--; if (depth === 0) return JSON.parse(s.slice(start, j + 1)); }
  }
  throw new Error('AI javobidagi JSON to\'liq emas');
}

async function generateJson(opts) {
  var r = await generate(opts);
  return { data: extractJson(r.text), sources: r.sources, queries: r.queries, model: r.model };
}

module.exports = { generate: generate, generateJson: generateJson, extractJson: extractJson, setTransport: setTransport, resolveModel: resolveModel };
