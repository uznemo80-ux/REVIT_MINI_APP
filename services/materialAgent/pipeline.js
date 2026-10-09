'use strict';
/**
 * MaterialAgent — pipeline (7 bosqich):
 *  1. Kategoriya tanlash + material qidirish        (stages.discover)
 *  2. Maydonlarni to'ldirish + validatsiya          (stages.enrich)
 *  3. 2–3 ta rasm + sifat nazorati                 (stages.collectImages)
 *  4. Matn/rasm mosligi + O'zbekistonda bormi      (stages.consistencyCheck, stages.checkUzbekistan)
 *  5. Admin botga tekshirish uchun yuborish         (review.sendForReview)
 *  6. Tasdiqlangach Kutubxonaga joylash             (store.publishCandidate — adminBot orqali)
 *  7. "Qayta ishlash" — tanlangan qismni qaytadan   (rework)
 */
var config = require('./config');
var store = require('./store');
var stages = require('./stages');
var web = require('./web');
var media = require('./media');
var review = require('./review');
var sources = require('./sources');

var deps = { pool: null, bot: null };
function init(pool, bot) { deps.pool = pool; deps.bot = bot; }
function ready() { return !!(deps.pool && deps.bot && config.enabled); }

function log() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift('🧱 MaterialAgent:');
  console.log.apply(console, args);
}

async function categoryContext(pool, category) {
  return {
    category: category,
    subcats: await store.subcategoriesOf(pool, category.id),
    existing: await store.existingNames(pool, category.id, 120)
  };
}

/** Moslik tekshiruvi: yomon rasmlarni olib tashlaydi, matn mos bo'lmasa bir marta qayta yozdiradi */
async function verifyAndFix(ctx, data, images) {
  var check = await stages.consistencyCheck(ctx, data, images);
  if (check.bad_image_indexes.length) {
    images = images.filter(function (_, i) { return check.bad_image_indexes.indexOf(i) === -1; });
  }
  if (images.length < config.MIN_IMAGES) {
    var more = await stages.collectImages(Object.assign({}, ctx, { excludeUrls: (ctx.excludeUrls || []).concat(images.map(function (i) { return i.url; })) }));
    var seen = new Set(images.map(function (i) { return i.hash; }));
    images = images.concat(more.filter(function (m) { return !seen.has(m.hash); })).slice(0, config.MAX_IMAGES);
    check = await stages.consistencyCheck(ctx, data, images);
    if (check.bad_image_indexes.length) images = images.filter(function (_, i) { return check.bad_image_indexes.indexOf(i) === -1; });
    if (images.length < config.MIN_IMAGES) throw new Error('Rasmlar moslik tekshiruvidan o\'tmadi');
  }
  if (!check.text_matches || !check.category_matches) {
    if (!check.category_matches) throw new Error('Material kategoriyaga mos emas: ' + check.issues.join('; '));
    data = await stages.enrich(Object.assign({}, ctx, { focusNote: 'QA found problems: ' + check.issues.join('; ') }));
    check = await stages.consistencyCheck(ctx, data, images);
    if (!check.text_matches) throw new Error('Matn mahsulotga mos emas: ' + check.issues.join('; '));
  }
  return { data: data, images: images, check: check };
}

async function uploadAll(cand, images) {
  var out = [];
  for (var i = 0; i < images.length; i++) {
    var img = images[i];
    var caption = '#AI_MATERIAL c' + cand.id + ' — ' + cand.brand + ' ' + cand.product_name + '\n' + img.url;
    var mediaId = await media.uploadImage(deps.pool, deps.bot, img, caption.slice(0, 1000));
    out.push({
      media_id: mediaId, source_url: img.url, width: img.width, height: img.height,
      kind: img.verdict && img.verdict.kind, quality: img.verdict && Number(img.verdict.quality)
    });
  }
  return out;
}

function checksSummary(check, data, uz) {
  return {
    images_match: check.images_match, text_matches: check.text_matches, category_matches: check.category_matches,
    issues: check.issues, specs_kept: (data.specifications || []).length, specs_dropped: (data.dropped_specs || []).length,
    uz_checked: !!uz.checked, uz_available: !!uz.available, checked_at: new Date().toISOString()
  };
}

/** Yangi material: 1–5 bosqichlar */
async function processNew(cand, catCtx) {
  var pool = deps.pool;
  var found = config.searchMode === 'google' ? await stages.discover(catCtx) : await stages.discoverFromSites(catCtx);
  var dup = await store.isDuplicate(pool, found.brand, found.product_name, found.product_url, cand.id);
  if (dup.duplicate) {
    var e = new Error('Dublikat (' + dup.where + '): ' + found.brand + ' ' + found.product_name);
    e.rejectedName = found.brand + ' ' + found.product_name;
    throw e;
  }
  cand = await store.updateCandidate(pool, cand.id, {
    stage: 'enrich', status: 'processing', product_name: found.product_name, brand: found.brand, product_url: found.product_url
  });
  var ctx = Object.assign({}, catCtx, found);

  var data = await stages.enrich(ctx);
  data.manufacturer_website = found.manufacturer_website;
  data.manufacturer_country = data.manufacturer_country || found.manufacturer_country;
  if (!data.product_code && found.product_code && web.normalize(found.page.text).indexOf(web.normalize(found.product_code)) !== -1) data.product_code = found.product_code;
  ctx.material_type = data.material_type;
  await store.updateCandidate(pool, cand.id, { stage: 'images', data: data });

  var images = await stages.collectImages(ctx);
  await store.updateCandidate(pool, cand.id, { stage: 'verify' });

  var fixed = await verifyAndFix(ctx, data, images);
  var uz = await stages.checkUzbekistan(ctx);
  fixed.data.manufacturer_website = found.manufacturer_website;

  var uploaded = await uploadAll(cand, fixed.images);
  cand = await store.updateCandidate(pool, cand.id, {
    stage: 'review', status: 'pending_review', data: fixed.data, images: uploaded, uz: uz,
    checks: checksSummary(fixed.check, fixed.data, uz), last_error: null
  });
  await review.sendForReview(pool, deps.bot, cand);
  return cand;
}

/**
 * Kunlik ishga tushish. Haftalik limit to'lgan bo'lsa hech narsa qilmaydi.
 * @param {{manual?: boolean}} opts
 */
async function runDaily(opts) {
  opts = opts || {};
  if (!ready()) return { ok: false, result: 'disabled' };
  var pool = deps.pool;
  var res = await store.withLock(pool, async function () {
    var count = await store.weeklyCount(pool);
    if (count >= config.weeklyLimit) return { ok: true, result: 'Haftalik limit to\'lgan (' + count + '/' + config.weeklyLimit + ')' };

    var categories = await store.listCategories(pool);
    var avoid = [], triedCats = [], errors = [];
    // Bepul rejim uchun: brend saytlari va oldin ko'rilgan sahifalar
    var sites = config.searchMode === 'google' ? [] : await sources.brandSites(pool);
    var usedUrls = await store.usedProductUrls(pool);
    for (var attempt = 0; attempt < config.MAX_DISCOVERY_ATTEMPTS; attempt++) {
      var category = store.pickCategory(categories, triedCats);
      if (!category) break;
      var cand = await store.createCandidate(pool, { status: 'searching', stage: 'discover', category_slug: category.slug });
      try {
        var catCtx = await categoryContext(pool, category);
        catCtx.avoid = avoid;
        catCtx.sites = sites;
        catCtx.usedUrls = usedUrls;
        var done = await processNew(cand, catCtx);
        log('yangi nomzod #' + done.id + ' adminga yuborildi:', done.brand, done.product_name);
        return { ok: true, result: 'Adminga yuborildi: #' + done.id + ' ' + done.brand + ' ' + done.product_name, candidate_id: done.id };
      } catch (e) {
        log('urinish ' + (attempt + 1) + ' muvaffaqiyatsiz:', e.message);
        errors.push(category.slug + ': ' + e.message);
        if (e.rejectedName) avoid.push(e.rejectedName);
        await store.updateCandidate(pool, cand.id, { status: 'failed', last_error: String(e.message).slice(0, 2000) }).catch(function () {});
        if (attempt >= 1) triedCats.push(category.slug); // 2-xatodan keyin boshqa kategoriyaga o'tamiz
      }
    }
    await review.notifyAdmin(deps.bot, '⚠️ <b>Material agent</b>: bugun mos material topilmadi.\n\n' +
      errors.map(function (x) { return '• ' + review.esc(x).slice(0, 400); }).join('\n'));
    return { ok: false, result: 'Topilmadi: ' + errors.join(' | ') };
  });
  if (res && res.skipped) return { ok: false, result: 'Boshqa jarayon ishlayapti' };
  return res;
}

var FOCUS_NOTES = {
  images: "Admin: rasmlar mos emas. Boshqa, mahsulotni aniq ko'rsatadigan rasmlarni tanlang.",
  text: 'Admin: the text is not suitable. Rewrite all uz/ru/en texts: clearer, accurate to this exact product, professional, no marketing, correct Uzbek Latin.',
  data: 'Admin: the facts/specifications are wrong. Re-extract ONLY what is literally on the official page; remove anything not stated there.'
};

/** 7-bosqich: admin "Qayta ishlash" bosgan nomzodni tanlangan qismdan boshlab qayta ishlaydi */
async function rework(candidateId) {
  if (!ready()) return;
  var pool = deps.pool;
  // Kunlik jarayon ishlayotgan bo'lsa navbat kutamiz (30 daqiqagacha)
  for (var wait = 0; wait < 30; wait++) {
    var r = await store.withLock(pool, function () { return reworkLocked(candidateId); });
    if (!r || !r.skipped) return r;
    await new Promise(function (ok) { setTimeout(ok, 60000); });
  }
}

async function reworkLocked(candidateId) {
  var pool = deps.pool;
  var cand = await store.getCandidate(pool, candidateId);
  if (!cand || cand.status !== 'reworking') return { ok: false };
  var focus = cand.rework_focus || 'data';
  try {
    var category = (await store.listCategories(pool)).find(function (c) { return c.slug === cand.category_slug; });
    if (!category) throw new Error('Kategoriya topilmadi');
    var page = await web.fetchPage(cand.product_url);
    if (!page.ok) throw new Error('Rasmiy sahifa ochilmadi: ' + page.error);
    var catCtx = await categoryContext(pool, category);
    var ctx = Object.assign({}, catCtx, {
      brand: cand.brand, product_name: cand.product_name, product_url: cand.product_url, page: page,
      product_code: (cand.data || {}).product_code, material_type: (cand.data || {}).material_type
    });

    var data = cand.data;
    var oldImages = cand.images || [];
    var rejectedUrls = (cand.rejected_image_urls || []).slice();
    var images;

    if (focus === 'images') {
      rejectedUrls = rejectedUrls.concat(oldImages.map(function (i) { return i.source_url; }));
      ctx.excludeUrls = rejectedUrls;
      ctx.focusNote = FOCUS_NOTES.images;
      images = await stages.collectImages(ctx);
    } else {
      data = await stages.enrich(Object.assign({}, ctx, { focusNote: FOCUS_NOTES[focus] }));
      data.manufacturer_website = (cand.data || {}).manufacturer_website;
      data.manufacturer_country = data.manufacturer_country || (cand.data || {}).manufacturer_country;
      images = [];
      for (var i = 0; i < oldImages.length; i++) {
        var m = await store.getMedia(pool, oldImages[i].media_id);
        var buf = await media.telegramFileBytes(m.file_id);
        images.push({ url: oldImages[i].source_url, buffer: buf, mime: m.mime || 'image/jpeg', hash: 'old' + i, width: m.width, height: m.height, keepMediaId: m.id, verdict: { kind: oldImages[i].kind, quality: oldImages[i].quality } });
      }
    }

    ctx.excludeUrls = rejectedUrls;
    var fixed = await verifyAndFix(ctx, data, images);
    var uz = focus === 'text' ? (cand.uz || {}) : await stages.checkUzbekistan(ctx);

    // Eski rasmlar qayta ishlatilsa qayta yuklamaymiz
    var finalImages = [];
    var toUpload = [];
    fixed.images.forEach(function (img) {
      if (img.keepMediaId) {
        var old = oldImages.find(function (o) { return o.media_id === img.keepMediaId; });
        finalImages.push(old);
      } else toUpload.push(img);
    });
    finalImages = finalImages.concat(await uploadAll(cand, toUpload));

    cand = await store.updateCandidate(pool, cand.id, {
      status: 'pending_review', stage: 'review', data: fixed.data, images: finalImages, uz: uz,
      rejected_image_urls: rejectedUrls, checks: checksSummary(fixed.check, fixed.data, uz), last_error: null
    });
    await review.sendForReview(pool, deps.bot, cand);
    return { ok: true };
  } catch (e) {
    log('qayta ishlash #' + candidateId + ' xato:', e.message);
    cand = await store.updateCandidate(pool, candidateId, { status: 'pending_review', last_error: String(e.message).slice(0, 2000) });
    await review.notifyAdmin(deps.bot, '⚠️ <b>#' + candidateId + '</b> qayta ishlanmadi: ' + review.esc(e.message).slice(0, 600) +
      '\n\nAvvalgi variant saqlandi — uni joylashingiz yoki rad etishingiz mumkin.');
    await review.sendForReview(pool, deps.bot, cand);
    return { ok: false, error: e.message };
  }
}

module.exports = { init: init, ready: ready, runDaily: runDaily, rework: rework, _deps: deps };
