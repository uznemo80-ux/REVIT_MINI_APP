'use strict';
/**
 * Wikimedia Commons — erkin litsenziyali fotolar qidiruvi (rasm tuzatuvchi uchun).
 * Faqat CC0 / Public domain / CC BY / CC BY-SA rasmlar qabul qilinadi; muallif va litsenziya saqlanadi
 * (Mini App'da "📷 Manba" sifatida va material_sources ichida ko'rsatiladi — atributsiya talabi).
 * Wikimedia siyosati: tushunarli User-Agent majburiy.
 */
var urlValidator = require('../../urlValidator');

var API = 'https://commons.wikimedia.org/w/api.php';
var UA = 'YoshUzbekkMaterialBot/1.0 (https://t.me/Yosh_uzbekk; materials library image check)';
var OK_LICENSE = /^(cc0|cc-zero|public domain|pd|cc by(-sa)?( \d(\.\d)?)?( [a-z]{2,})?)$/i;

var fetcher = null; // testlar uchun
function setFetcher(fn) { fetcher = fn; }

async function getJson(url) {
  if (fetcher) return fetcher(url);
  var f = await urlValidator.fetchFollow(url, { timeout: 20000, headers: { 'User-Agent': UA, 'Accept': 'application/json' } });
  if (f.error || !f.res.ok) return null;
  try { return await f.res.json(); } catch (e) { return null; }
}

function stripHtml(s) {
  return String(s || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/\s+/g, ' ').trim();
}

/**
 * @returns {Promise<Array<{url:string, pageUrl:string, title:string, license:string, artist:string, width:number, height:number}>>}
 */
async function search(query, limit) {
  var q = String(query || '').trim();
  if (!q) return [];
  var url = API + '?action=query&format=json&formatversion=2&generator=search&gsrnamespace=6' +
    '&gsrlimit=' + (limit || 12) + '&gsrsearch=' + encodeURIComponent('filetype:bitmap ' + q) +
    '&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=1280&iiextmetadatafilter=LicenseShortName|Artist|UsageTerms';
  var j = await getJson(url);
  var pages = (j && j.query && j.query.pages) || [];
  if (!Array.isArray(pages)) pages = Object.keys(pages).map(function (k) { return pages[k]; });
  return pages
    .sort(function (a, b) { return (a.index || 0) - (b.index || 0); })
    .map(function (p) {
      var ii = (p.imageinfo || [])[0] || {};
      var md = ii.extmetadata || {};
      var lic = stripHtml(md.LicenseShortName && md.LicenseShortName.value);
      return {
        url: ii.thumburl || ii.url, pageUrl: ii.descriptionurl || ('https://commons.wikimedia.org/wiki/' + encodeURIComponent(p.title || '')),
        title: String(p.title || '').replace(/^File:/, ''), license: lic,
        artist: stripHtml(md.Artist && md.Artist.value).slice(0, 120) || 'Wikimedia Commons',
        width: ii.thumbwidth || ii.width || 0, height: ii.thumbheight || ii.height || 0, mime: ii.mime || ''
      };
    })
    .filter(function (x) {
      return x.url && /^image\/(jpeg|png|webp)$/.test(x.mime) && OK_LICENSE.test(x.license) && Math.min(x.width, x.height) >= 400;
    });
}

module.exports = { search: search, setFetcher: setFetcher, _internals: { OK_LICENSE: OK_LICENSE } };
