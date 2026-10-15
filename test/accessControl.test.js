'use strict';
/**
 * Kirish huquqi (access control) integratsiya testlari.
 *   TEST_DATABASE_URL=postgres://... npm run test:access
 * Test ALOHIDA, BO'SH test bazasida ishlashi kerak (prod bazaga ulamang): jadvallar tozalanadi.
 * Server haqiqiy jarayon sifatida ishga tushiriladi va API'ga real HTTP so'rovlar yuboriladi.
 */
var test = require('node:test');
var assert = require('node:assert/strict');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

var DB = process.env.TEST_DATABASE_URL;
var BOT_TOKEN = '123:ACCESS_TEST';
var ADMIN_ID = 111;
var PORT = 3900 + Math.floor(Math.random() * 90);
var BASE = 'http://127.0.0.1:' + PORT;
var skip = !DB && 'TEST_DATABASE_URL berilmagan';

function sign(tgId) {
  var p = new URLSearchParams();
  p.set('auth_date', String(Math.floor(Date.now() / 1000)));
  p.set('user', JSON.stringify({ id: tgId, first_name: 'U' + tgId }));
  var dcs = Array.from(p.entries()).sort(function (a, b) { return a[0].localeCompare(b[0]); })
    .map(function (e) { return e[0] + '=' + e[1]; }).join('\n');
  var key = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
  p.set('hash', crypto.createHmac('sha256', key).update(dcs).digest('hex'));
  return p.toString();
}

function videoToken(userId, lessonId) {
  var b64 = Buffer.from(JSON.stringify({ user_id: userId, lesson_id: lessonId, exp: Date.now() + 60000, iat: Date.now() })).toString('base64url');
  return b64 + '.' + crypto.createHmac('sha256', BOT_TOKEN).update(b64).digest('base64url');
}

async function post(url, body) {
  var r = await fetch(BASE + url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  var j = null; try { j = await r.json(); } catch (e) {}
  return { status: r.status, body: j };
}

var pool, server, ids = {};
var STUDENT = 501, PAID = 502, GRANTED = 503;

test.before(async function () {
  if (skip) return;
  var Pool = require('pg').Pool;
  pool = new Pool({ connectionString: DB });
  await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  await pool.query(fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8'));
  // Ustun qo'shilishidan OLDIN mavjud bo'lgan kurslar (migratsiya ularni eski qoida bo'yicha to'ldirishi kerak)
  ids.legacyMarathon = (await pool.query("INSERT INTO courses (title, price, status) VALUES ('7 kunlik marafon', '1 500 000 so''m', 'published') RETURNING id")).rows[0].id;
  ids.legacyZero = (await pool.query("INSERT INTO courses (title, price, status) VALUES ('Revit 0 dan', '', 'published') RETURNING id")).rows[0].id;

  server = spawn(process.execPath, [path.join(__dirname, '..', 'server.js')], {
    env: Object.assign({}, process.env, { DATABASE_URL: DB, BOT_TOKEN: BOT_TOKEN, ADMIN_TELEGRAM_ID: String(ADMIN_ID), PORT: String(PORT), MATERIAL_AGENT_ENABLED: 'false' }),
    stdio: ['ignore', 'ignore', 'pipe']
  });
  for (var i = 0; i < 120; i++) {
    try { var h = await fetch(BASE + '/api/health'); if (h.ok) break; } catch (e) {}
    await new Promise(function (r) { setTimeout(r, 500); });
  }
  await new Promise(function (r) { setTimeout(r, 4000); }); // fon init'lar tugashi uchun

  for (var u of [STUDENT, PAID, GRANTED]) await post('/api/auth', { initData: sign(u) });
  await pool.query("UPDATE users SET access_until = NOW() + INTERVAL '1 year' WHERE telegram_id = $1", [PAID]);
  ids.users = {};
  (await pool.query('SELECT id, telegram_id FROM users')).rows.forEach(function (r) { ids.users[String(r.telegram_id)] = r.id; });

  ids.paidCourse = (await pool.query("INSERT INTO courses (title, price, status) VALUES ('INTPRO', '1 500 000 so''m', 'published') RETURNING id")).rows[0].id;
  ids.emptyPriceCourse = (await pool.query("INSERT INTO courses (title, price, status) VALUES ('Yangi kurs', '', 'published') RETURNING id")).rows[0].id;
  ids.mod1 = (await pool.query('INSERT INTO modules (course_id, title, order_index) VALUES ($1, $2, 1) RETURNING id', [ids.paidCourse, '1-modul'])).rows[0].id;
  ids.mod5 = (await pool.query('INSERT INTO modules (course_id, title, order_index) VALUES ($1, $2, 5) RETURNING id', [ids.paidCourse, 'Jonli efirlar'])).rows[0].id;
  ids.lessonStream = (await pool.query("INSERT INTO lessons (module_id, title, order_index, youtube_url, is_free) VALUES ($1, 'Jonli efir: savol-javob', 1, 'https://youtu.be/PAIDVIDEO01', false) RETURNING id", [ids.mod5])).rows[0].id;
  ids.lessonPaid1 = (await pool.query("INSERT INTO lessons (module_id, title, order_index, youtube_url, is_free) VALUES ($1, '1-dars', 1, 'https://youtu.be/PAIDVIDEO02', false) RETURNING id", [ids.mod1])).rows[0].id;
  await pool.query('INSERT INTO module_access_grants (user_id, module_id) VALUES ($1, $2)', [ids.users[String(GRANTED)], ids.mod5]);

  ids.proBook = (await pool.query("INSERT INTO library_books (title, pdf_url, drive_file_id, access_type, status) VALUES ('PRO kitob', 'https://drive.google.com/file/d/PROFILEID1234567890/view', 'PROFILEID1234567890', 'pro', 'published') RETURNING id")).rows[0].id;
  ids.freeBook = (await pool.query("INSERT INTO library_books (title, pdf_url, access_type, status) VALUES ('Bepul kitob', 'https://drive.google.com/file/d/FREEFILEID123456789/view', 'free', 'published') RETURNING id")).rows[0].id;
  ids.draftBook = (await pool.query("INSERT INTO library_books (title, pdf_url, access_type, status) VALUES ('Qoralama', 'https://drive.google.com/file/d/DRAFTFILEID12345678/view', 'free', 'draft') RETURNING id")).rows[0].id;
});

test.after(async function () {
  if (server) server.kill();
  if (pool) await pool.end();
});

test('PRO kitob: to\'lovsiz o\'quvchiga fayl havolasi berilmaydi', { skip: skip }, async function () {
  var r = await post('/api/library/v2/book/' + ids.proBook, { initData: sign(STUDENT) });
  assert.equal(r.status, 200);
  assert.equal(r.body.book.locked, true);
  assert.equal(r.body.book.pdf_url, null);
  assert.equal(r.body.book.content_url, null);
  assert.equal(r.body.book.drive_file_id, null);
});

test('PRO kitob: faol obunachi va admin faylni oladi', { skip: skip }, async function () {
  var paid = await post('/api/library/v2/book/' + ids.proBook, { initData: sign(PAID) });
  assert.match(paid.body.book.pdf_url, /PROFILEID/);
  assert.notEqual(paid.body.book.locked, true);
  var adm = await post('/api/library/v2/book/' + ids.proBook, { initData: sign(ADMIN_ID) });
  assert.match(adm.body.book.pdf_url, /PROFILEID/);
});

test('Bepul kitob o\'zgarishsiz ochiladi', { skip: skip }, async function () {
  var r = await post('/api/library/v2/book/' + ids.freeBook, { initData: sign(STUDENT) });
  assert.match(r.body.book.pdf_url, /FREEFILEID/);
});

test('Ro\'yxat va qidiruv javoblarida ham PRO havola yashiriladi', { skip: skip }, async function () {
  var r = await post('/api/library/v2/books/search', { initData: sign(STUDENT), query: '' });
  assert.equal(r.status, 200);
  var text = JSON.stringify(r.body);
  assert.ok(text.indexOf('PRO kitob') !== -1, 'PRO kitob ro\'yxatda ko\'rinishi kerak');
  assert.equal(text.indexOf('PROFILEID'), -1, 'PRO fayl ID javobda bo\'lmasligi kerak');
});

test('Qoralama kitob o\'quvchiga 404, adminga ochiq', { skip: skip }, async function () {
  assert.equal((await post('/api/library/v2/book/' + ids.draftBook, { initData: sign(STUDENT) })).status, 404);
  var draftRes = (await pool.query("INSERT INTO library_resources (section_slug, type, title, content_url, status) VALUES ('sources', 'model', 'Qoralama model', 'https://t.me/c/123/45', 'draft') RETURNING id")).rows[0].id;
  assert.equal((await post('/api/library/v2/resource/' + draftRes, { initData: sign(STUDENT) })).status, 404);
  assert.equal((await post('/api/library/v2/resource/' + draftRes, { initData: sign(ADMIN_ID) })).status, 200);
  assert.equal((await post('/api/library/v2/book/' + ids.draftBook, { initData: sign(ADMIN_ID) })).status, 200);
});

test('pdf-proxy: PRO fayl to\'lovsiz o\'quvchiga 403', { skip: skip }, async function () {
  var r = await fetch(BASE + '/api/pdf-proxy?id=PROFILEID1234567890&auth=' + encodeURIComponent(sign(STUDENT)));
  assert.equal(r.status, 403);
  var d = await fetch(BASE + '/api/pdf-proxy?id=DRAFTFILEID12345678&auth=' + encodeURIComponent(sign(STUDENT)));
  assert.equal(d.status, 404);
});

test('Pullik kursdagi "Jonli efir" darsi to\'lovsiz o\'quvchiga yopiq', { skip: skip }, async function () {
  var r = await post('/api/lesson/' + ids.lessonStream, { initData: sign(STUDENT) });
  assert.notEqual(r.status, 200, 'dars ochilmasligi kerak');
  assert.equal(JSON.stringify(r.body || {}).indexOf('PAIDVIDEO01'), -1);
  var m = await post('/api/course/' + ids.paidCourse + '/modules', { initData: sign(STUDENT) });
  var l = m.body.modules.flatMap(function (x) { return x.lessons; }).find(function (x) { return x.id === ids.lessonStream; });
  assert.equal(l.available, false);
});

test('Narxi bo\'sh YANGI kurs bepul hisoblanmaydi', { skip: skip }, async function () {
  var m = await post('/api/course/' + ids.emptyPriceCourse + '/modules', { initData: sign(STUDENT) });
  assert.equal(m.body.course.is_free, false);
});

test('Migratsiya: avvaldan bepul bo\'lgan kurslar bepulligicha qoladi', { skip: skip }, async function () {
  var rows = (await pool.query('SELECT id, is_free FROM courses WHERE id = ANY($1)', [[ids.legacyMarathon, ids.legacyZero]])).rows;
  rows.forEach(function (r) { assert.equal(r.is_free, true, 'kurs ' + r.id); });
});

test('Admin "Bepul kurs" belgisini qo\'ya oladi', { skip: skip }, async function () {
  var r = await post('/api/admin/courses/' + ids.emptyPriceCourse + '/update', { initData: sign(ADMIN_ID), title: 'Yangi kurs', price: '', status: 'published', is_free: true });
  assert.equal(r.status, 200);
  assert.equal(r.body.course.is_free, true);
  var r2 = await post('/api/admin/courses/' + ids.emptyPriceCourse + '/update', { initData: sign(ADMIN_ID), title: 'Yangi kurs', price: '', status: 'published' });
  assert.equal(r2.body.course.is_free, true, 'is_free yuborilmasa eski qiymat saqlanadi');
});

test('Video stream: alohida ochilgan modul o\'quvchisi ruxsatdan o\'tadi, boshqasi 403', { skip: skip }, async function () {
  var denied = await fetch(BASE + '/api/video/stream?token=' + videoToken(ids.users[String(STUDENT)], ids.lessonStream));
  assert.equal(denied.status, 403);
  var granted = await fetch(BASE + '/api/video/stream?token=' + videoToken(ids.users[String(GRANTED)], ids.lessonStream));
  // Ruxsat o'tdi — keyingi qadam (Telegram fayli) test muhitida yo'q, shuning uchun 403 EMAS
  assert.notEqual(granted.status, 403);
});

test('/api/health admin ID ni oshkor qilmaydi', { skip: skip }, async function () {
  var h = await (await fetch(BASE + '/api/health')).json();
  assert.equal(h.admin_telegram_id, undefined);
});
