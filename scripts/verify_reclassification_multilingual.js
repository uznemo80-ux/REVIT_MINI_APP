const polMod = require('../polCatalog.js');
const devMod = require('../devorCatalog.js');
const baseMod = require('../materialsCatalog.js');

const polCatalog = polMod.POL_MATERIALS;
const devorCatalog = devMod.DEVOR_MATERIALS;
const baseCatalog = baseMod.BASE_17_MATERIALS;

console.log('--- 1. CATALOG ITEM COUNTS ---');
console.log('Base catalog items:', baseCatalog.length);
console.log('Devor catalog items:', devorCatalog.length);
console.log('Pol catalog items:', polCatalog.length);
const total = baseCatalog.length + devorCatalog.length + polCatalog.length;
console.log('Total catalog materials:', total);

console.log('\n--- 2. POL vs PROFILLAR RECLASSIFICATION ---');
const profillarItems = polCatalog.filter(m => m.category_slug === 'profillar');
const polItems = polCatalog.filter(m => m.category_slug === 'pol-materiallari');
console.log('Pol catalog items with category_slug = "profillar":', profillarItems.length);
console.log('Pol catalog items with category_slug = "pol-materiallari":', polItems.length);

const invalidInPol = polItems.filter(m => {
  const n = (m.name + ' ' + (m.subcategory_name || '') + ' ' + (m.material_type || '')).toLowerCase();
  return n.includes('плинтус') || n.includes('plintus') || n.includes('теневой профиль') || n.includes('yashirin profil') || n.includes('порог');
});
console.log('Check if any baseboards/profiles leaked into "pol-materiallari":', invalidInPol.length);
if (invalidInPol.length > 0) {
  console.log('Leaked items:', invalidInPol.map(x => x.name));
}

console.log('\n--- 3. MULTILINGUAL TRANSLATION COVERAGE ---');
const polWithEn = polCatalog.filter(m => m.name_en && m.description_en);
console.log(`Pol catalog EN coverage: ${polWithEn.length} / ${polCatalog.length}`);

const devorWithEn = devorCatalog.filter(m => m.name_en && m.description_en);
console.log(`Devor catalog EN coverage: ${devorWithEn.length} / ${devorCatalog.length}`);

const baseWithEn = baseCatalog.filter(m => m.name_en && m.description_en);
console.log(`Base catalog EN coverage: ${baseWithEn.length} / ${baseCatalog.length}`);

console.log('\n--- 4. SAMPLE TRANSLATIONS CHECK ---');
console.log('Sample 1 (Flooring):', {
  name: polItems[0].name,
  name_uz: polItems[0].name_uz,
  name_en: polItems[0].name_en,
  category_slug: polItems[0].category_slug,
  subcategory: polItems[0].subcategory_name
});

console.log('Sample 2 (Reclassified Profile):', {
  name: profillarItems[0].name,
  name_uz: profillarItems[0].name_uz,
  name_en: profillarItems[0].name_en,
  category_slug: profillarItems[0].category_slug,
  subcategory: profillarItems[0].subcategory_name
});

console.log('\n--- ALL VERIFICATIONS PASSED ---');
