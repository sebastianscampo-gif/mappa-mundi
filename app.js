/* ============ Mappa Mundi — app.js ============ */
/*
 *  Uses real dataset window.MAPS_RAW (1,559 maps) loaded from maps.js
 *  Falls back to SVG placeholders (window.mapSVG) when image fails.
 */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const fmt = (n) => n.toLocaleString(currentLocale() === 'es' ? "es-ES" : "en-US");
const MAPS = window.MAPS_RAW || [];

/* ============ i18n — interface translation (chrome only) ============
 * The map dataset stays in its source language (LoC English, Spanish for Hispanic LoC entries,
 * etc.). We translate only the application chrome (nav, buttons, section headings, common labels).
 * Locale is persisted in localStorage as "mappaLocale".
 */
const LANG = {
  en: {
    "nav.home":"Home","nav.archive":"Categories","nav.timeline":"Timeline","nav.compare":"Compare",
    "nav.atlas":"Atlas","nav.collections":"Collections","nav.learn":"Learn","nav.about":"About","nav.library":"Library",
    "nav.signin":"Sign in","nav.create":"Create account","nav.menu":"Menu","nav.search":"Search",
    "hero.eyebrow":"Est. MMXXIV — A Digital Atlas of Cartography",
    "hero.subtitle":"Explore the history of the world through maps.",
    "hero.placeholder":"Search maps, places, periods, empires, climates…",
    "hero.stat.maps":"Maps catalogued","hero.stat.cats":"Archive categories",
    "hero.stat.inst":"Source institutions","hero.stat.cents":"Centuries covered",
    "hero.surprise":"Surprise me with a curated map",
    "home.cats.eyebrow":"Explore by category","home.cats.title":"Quick access","home.cats.cta":"Open the full archive →",
    "home.coll.eyebrow":"Curated","home.coll.title":"Featured collections","home.coll.cta":"All collections →",
    "home.curated.eyebrow":"Start here","home.curated.title":"Curated essays",
    "home.curated.lede":"Forty maps with a full editorial essay on significance, what the map reveals, and the distortions that come with it. The best entry point to the archive.",
    "home.curated.seeAll":"See all 40 curated →","home.curated.browseAll":"Or browse all 1,559 maps →",
    "common.search":"Search","common.copy":"copy","common.copied":"✓ copied",
    "common.clearAll":"Clear all filters","common.shareLink":"🔗 Copy share link","common.linkCopied":"✓ link copied",
    "filter.era":"Historical era","filter.year":"Year range","filter.from":"From","filter.to":"To",
    "filter.continent":"Continent","filter.language":"Language","filter.tags":"Tags",
    "filter.quality":"Record quality","filter.curatedOnly":"Only curated fichas — maps with a full editorial essay (significance, interpretation, distortions)",
    "filter.sort":"Sort by",
    "detail.cite":"Cite this record","detail.viewSource":"View record at source institution",
    "detail.cartographer":"Cartographer","detail.contributor":"Source contributor",
    "detail.depicts":"Depicts","detail.created":"Map created","detail.date":"Date",
    "detail.century":"Century","detail.era":"Era","detail.country":"Country / Area",
    "detail.continent":"Continent","detail.maptype":"Map type","detail.language":"Language",
    "detail.category":"Category","detail.source":"Source","detail.license":"License","detail.status":"Status",
    "detail.shows":"What it shows","detail.context":"How this map came to be made",
    "detail.reveals":"What the map reveals","detail.significance":"Significance",
    "detail.meaning":"Political, cultural, or scientific stakes","detail.biases":"What this map gets wrong, or leaves out",
    "detail.save":"Save to library","detail.saved":"Saved","detail.compare":"Compare",
    "detail.fullscreen":"Open full screen","detail.note":"Add note","detail.source.btn":"View source",
    "skip.main":"Skip to main content","footer.tagline":"An independent, educational project.",
    "footer.tagline-long":"A digital archive of historical and contemporary cartography. An independent, educational project — not affiliated with any single institution.",
    "footer.explore":"Explore","footer.archive":"Full archive","footer.atlas":"Atlas (meta-map)",
    "footer.timeline":"Timeline","footer.compare":"Compare tool","footer.collections":"Collections",
    "footer.learn":"Learn","footer.articles":"Articles","footer.glossary":"Glossary",
    "footer.about-h":"About","footer.mission":"Mission","footer.stats":"Archive at a glance",
    "footer.sources":"Sources & accuracy","footer.privacy":"Privacy & data","footer.educational":"Educational use",
    "footer.open":"An open archive",
    "footer.coords":"Latitudes are decimal · Bearings are true · South is sometimes up",
    "lang.toggle":"Español",
  },
  es: {
    "nav.home":"Inicio","nav.archive":"Categorías","nav.timeline":"Cronología","nav.compare":"Comparar",
    "nav.atlas":"Atlas","nav.collections":"Colecciones","nav.learn":"Aprender","nav.about":"Acerca de","nav.library":"Biblioteca",
    "nav.signin":"Iniciar sesión","nav.create":"Crear cuenta","nav.menu":"Menú","nav.search":"Buscar",
    "hero.eyebrow":"Est. MMXXIV — Un atlas digital de cartografía",
    "hero.subtitle":"Explora la historia del mundo a través de los mapas.",
    "hero.placeholder":"Buscar mapas, lugares, periodos, imperios, climas…",
    "hero.stat.maps":"Mapas catalogados","hero.stat.cats":"Categorías del archivo",
    "hero.stat.inst":"Instituciones fuente","hero.stat.cents":"Siglos cubiertos",
    "hero.surprise":"Sorpréndeme con un mapa curado",
    "home.cats.eyebrow":"Explorar por categoría","home.cats.title":"Acceso rápido","home.cats.cta":"Abrir el archivo completo →",
    "home.coll.eyebrow":"Seleccionado","home.coll.title":"Colecciones destacadas","home.coll.cta":"Todas las colecciones →",
    "home.curated.eyebrow":"Empieza aquí","home.curated.title":"Fichas curadas",
    "home.curated.lede":"Cuarenta mapas con ensayo editorial completo sobre su importancia, lo que el mapa revela y las distorsiones que arrastra. El mejor punto de entrada al archivo.",
    "home.curated.seeAll":"Ver las 40 curadas →","home.curated.browseAll":"O explorar los 1.559 mapas →",
    "common.search":"Buscar","common.copy":"copiar","common.copied":"✓ copiado",
    "common.clearAll":"Quitar todos los filtros","common.shareLink":"🔗 Copiar enlace compartible","common.linkCopied":"✓ enlace copiado",
    "filter.era":"Era histórica","filter.year":"Rango de años","filter.from":"Desde","filter.to":"Hasta",
    "filter.continent":"Continente","filter.language":"Idioma","filter.tags":"Etiquetas",
    "filter.quality":"Calidad de la ficha","filter.curatedOnly":"Solo fichas curadas — mapas con ensayo editorial completo (importancia, interpretación, sesgos)",
    "filter.sort":"Ordenar por",
    "detail.cite":"Citar este registro","detail.viewSource":"Ver registro en la institución original",
    "detail.cartographer":"Cartógrafo","detail.contributor":"Contribuidor en la fuente",
    "detail.depicts":"Representa","detail.created":"Mapa creado","detail.date":"Fecha",
    "detail.century":"Siglo","detail.era":"Era","detail.country":"País / Área",
    "detail.continent":"Continente","detail.maptype":"Tipo de mapa","detail.language":"Idioma",
    "detail.category":"Categoría","detail.source":"Fuente","detail.license":"Licencia","detail.status":"Estado",
    "detail.shows":"Qué muestra","detail.context":"Cómo se hizo este mapa",
    "detail.reveals":"Qué revela el mapa","detail.significance":"Importancia",
    "detail.meaning":"Significado político, cultural o científico","detail.biases":"Lo que este mapa distorsiona u omite",
    "detail.save":"Guardar en la biblioteca","detail.saved":"Guardado","detail.compare":"Comparar",
    "detail.fullscreen":"Pantalla completa","detail.note":"Añadir nota","detail.source.btn":"Ver fuente",
    "skip.main":"Saltar al contenido principal","footer.tagline":"Un proyecto independiente y educativo.",
    "footer.tagline-long":"Un archivo digital de cartografía histórica y contemporánea. Un proyecto independiente y educativo, no afiliado a ninguna institución concreta.",
    "footer.explore":"Explorar","footer.archive":"Archivo completo","footer.atlas":"Atlas (meta-mapa)",
    "footer.timeline":"Cronología","footer.compare":"Herramienta de comparación","footer.collections":"Colecciones",
    "footer.learn":"Aprender","footer.articles":"Artículos","footer.glossary":"Glosario",
    "footer.about-h":"Acerca de","footer.mission":"Misión","footer.stats":"El archivo en cifras",
    "footer.sources":"Fuentes y precisión","footer.privacy":"Privacidad y datos","footer.educational":"Uso educativo",
    "footer.open":"Un archivo abierto",
    "footer.coords":"Latitudes en decimal · Rumbos verdaderos · El sur a veces va arriba",
    "lang.toggle":"English",
  },
};
function currentLocale() {
  try { return localStorage.getItem("mappaLocale") || "en"; } catch { return "en"; }
}
function setLocale(loc) {
  try { localStorage.setItem("mappaLocale", loc); } catch {}
  document.documentElement.lang = loc;
  applyStaticI18n();
  // Re-render the current page so JS-rendered strings update
  renderRoute();
  renderNavAccount();
}
function t(key) {
  const loc = currentLocale();
  return (LANG[loc] && LANG[loc][key]) || LANG.en[key] || key;
}
// Apply translations to any element with a data-i18n="key" attribute,
// or data-i18n-placeholder for inputs, or data-i18n-title for tooltips
function applyStaticI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });
}

/* ---------- maps the SVG fallback style to a category ---------- */
const CATEGORY_TO_STYLE = {
  "01_World_Maps": "renaissance",
  "02_Ancient_Maps": "ancient",
  "03_Medieval_Maps": "medieval",
  "04_Renaissance_Maps": "renaissance",
  "05_Exploration_and_Navigation": "portolan",
  "06_Colonial_Maps": "colonial",
  "07_Empires_and_Borders": "imperial",
  "08_Country_and_Regional_Maps": "renaissance",
  "09_Climate_Maps": "climate",
  "10_Topographic_Maps": "topo",
  "11_Geological_and_Scientific_Maps": "topo",
  "12_Nautical_Maps": "nautical",
  "13_Urban_Maps": "city",
  "14_Indigenous_Cartographies": "indigenous",
  "15_Artistic_and_Imaginary_Maps": "artistic",
  "16_Modern_Reference_Maps": "projection",
};
function placeholderSVG(m) {
  const style = CATEGORY_TO_STYLE[m.category] || "renaissance";
  const seed = (m.id || "x").split("").reduce((a,c)=>a + c.charCodeAt(0), 0) || 1;
  return window.mapSVG(style, seed);
}

/* ---------- per-map display overrides ---------- */
// Some archival images need rotation to display in modern orientation
// (e.g. al-Idrisi's Tabula Rogeriana is south-up in its original convention).
const ROTATION_OVERRIDES = {
  "seed_002": 180,  // Tabula Rogeriana — south-up original
};
function rotationFor(m) { return ROTATION_OVERRIDES[m.id] || 0; }

/* ---------- 16 category metadata + essays ---------- */
const CATEGORY_META = [
  { key:"01_World_Maps",                    display:"World Maps",                subtitle:"The world as a whole.",                 description:"Every attempt to draw the entire planet is also an argument for one way of looking at it — from Ptolemy's coordinate world to the Apollo-era blue marble." },
  { key:"02_Ancient_Maps",                  display:"Ancient Maps",              subtitle:"Before 500 BCE.",                       description:"Mesopotamian clay tablets, Egyptian survey papyri, the earliest known schematic representations of land and sky." },
  { key:"03_Medieval_Maps",                 display:"Medieval Maps",             subtitle:"500 – 1450.",                           description:"Christian mappae mundi, Islamic geographies, Chinese maritime atlases — three traditions that rarely consult one another." },
  { key:"04_Renaissance_Maps",              display:"Renaissance Maps",          subtitle:"1450 – 1650.",                          description:"Print, perspective, and the rediscovery of Ptolemy. European cartography reorganizes itself around mathematics — and makes errors at scale." },
  { key:"05_Exploration_and_Navigation",    display:"Exploration & Navigation",  subtitle:"The age of sail.",                      description:"Charts that guided sailors across unfamiliar oceans: rhumb lines, magnetic declinations, the slow accumulation of coastlines." },
  { key:"06_Colonial_Maps",                 display:"Colonial Maps",             subtitle:"Maps as instruments of empire.",        description:"The colonial cadastre is one of the most consequential cartographic objects ever made — a paper instrument for dispossession that outlived the empires that drew it." },
  { key:"07_Empires_and_Borders",           display:"Empires & Borders",         subtitle:"Lines drawn far from the land.",        description:"From Roman provincial divisions to the treaties of 1919, the visual grammar of political authority across two thousand years." },
  { key:"08_Country_and_Regional_Maps",     display:"Country & Regional Maps",   subtitle:"Closer than the world, larger than a city.", description:"Provincial atlases, regional surveys, national topographies — the middle scale at which most cartography happens." },
  { key:"09_Climate_Maps",                  display:"Climate Maps",              subtitle:"Drawing what cannot be seen.",          description:"Köppen's classification, isotherm charts, satellite thermography. A history of how scientists learned to draw weather." },
  { key:"10_Topographic_Maps",              display:"Topographic Maps",          subtitle:"The shape of land.",                    description:"Triangulation, plane-tabling, aerial photography, lidar. Topography is a story of measuring devices, not just of mountains." },
  { key:"11_Geological_and_Scientific_Maps",display:"Geological & Scientific Maps",subtitle:"Layers beneath the surface.",         description:"Strata, fault lines, soils. The earth as a sequence of substances rather than a sequence of places." },
  { key:"12_Nautical_Maps",                 display:"Nautical Maps",             subtitle:"Sea before land.",                      description:"Portolan charts, soundings, lighthouse atlases — the working documents of navigation, drawn with the open ocean as the central subject." },
  { key:"13_Urban_Maps",                    display:"Urban Maps",                subtitle:"Cities drawing themselves.",            description:"Plans, panoramas, and bird's-eye views — how cities have represented themselves, and how those representations shaped what was built next." },
  { key:"14_Indigenous_Cartographies",      display:"Indigenous Cartographies",  subtitle:"Pluriversal mapping.",                  description:"Songlines, wampum belts, Mexica land registers, modern counter-mapping projects — cartographic traditions the colonial archive has long misunderstood." },
  { key:"15_Artistic_and_Imaginary_Maps",   display:"Artistic & Imaginary Maps", subtitle:"Maps of nowhere.",                      description:"The compass rose, the scale bar, the frame — cartographic conventions are persuasive even when the territory is invented." },
  { key:"16_Modern_Reference_Maps",         display:"Modern Reference Maps",     subtitle:"After 1989.",                           description:"Digital cartography, OpenStreetMap, satellite mosaics, climate-change visualisation. Maps are no longer rare objects." },
];

/* ---------- 11 historical eras (covers both dated + century-tagged maps) ---------- */
const ERAS = [
  { key:"ancient",        label:"Ancient civilizations",  range:"before 500 BCE",     yearFrom:-9999, yearTo:-500,   centuries:["Pre-history"] },
  { key:"classical",      label:"Classical Antiquity",    range:"500 BCE – 500 CE",   yearFrom:-500,  yearTo:500,    centuries:["1st century","2nd century","3rd century","4th century","5th century"] },
  { key:"medieval",       label:"Medieval period",        range:"500 – 1450",         yearFrom:500,   yearTo:1450,   centuries:["6th century","7th century","8th century","9th century","10th century","11th century","12th century","13th century","14th century","15th century"] },
  { key:"renaissance",    label:"Renaissance & Exploration",range:"1450 – 1650",      yearFrom:1450,  yearTo:1650,   centuries:["15th century","16th century","17th century"] },
  { key:"colonial",       label:"Colonial era",           range:"1650 – 1830",        yearFrom:1650,  yearTo:1830,   centuries:["17th century","18th century","19th century"] },
  { key:"industrial",     label:"Industrial era",         range:"1830 – 1914",        yearFrom:1830,  yearTo:1914,   centuries:["19th century","20th century"] },
  { key:"world-wars",     label:"World Wars",             range:"1914 – 1945",        yearFrom:1914,  yearTo:1945,   centuries:["20th century"] },
  { key:"cold-war",       label:"Cold War",               range:"1945 – 1989",        yearFrom:1945,  yearTo:1989,   centuries:["20th century"] },
  { key:"contemporary",   label:"Contemporary world",     range:"after 1989",         yearFrom:1989,  yearTo:9999,   centuries:["20th century","21st century"] },
  { key:"undated",        label:"Undated",                range:"date uncertain",     yearFrom:null,  yearTo:null,   centuries:["Undated"] },
];

function eraOfMap(m) {
  if (m.yearNum !== null && m.yearNum !== undefined) {
    return ERAS.find(e => e.yearFrom !== null && m.yearNum >= e.yearFrom && m.yearNum <= e.yearTo)?.key || "undated";
  }
  if (m.century && m.century !== "Undated") {
    // Use century mapping as fallback for maps without a parseable year
    return ERAS.find(e => e.centuries.includes(m.century))?.key || "undated";
  }
  return "undated";
}

/* ---------- precompute counts + indices ---------- */
const COUNTS = {
  byCategory: {},   // by category key
  byEra: {},        // by era key
  byContinent: {},
  byLanguage: {},
  byCentury: {},
  byTag: {},
};
const MAP_ERA = {};   // mapId → era key
const MAPS_BY_CATEGORY = {};
MAPS.forEach(m => {
  const era = eraOfMap(m);
  MAP_ERA[m.id] = era;
  COUNTS.byCategory[m.category] = (COUNTS.byCategory[m.category]||0) + 1;
  COUNTS.byEra[era] = (COUNTS.byEra[era]||0) + 1;
  if (m.continent) COUNTS.byContinent[m.continent] = (COUNTS.byContinent[m.continent]||0) + 1;
  COUNTS.byLanguage[m.language] = (COUNTS.byLanguage[m.language]||0) + 1;
  COUNTS.byCentury[m.century] = (COUNTS.byCentury[m.century]||0) + 1;
  (m.tags||[]).forEach(t => { COUNTS.byTag[t] = (COUNTS.byTag[t]||0) + 1; });
  if (!MAPS_BY_CATEGORY[m.category]) MAPS_BY_CATEGORY[m.category] = [];
  MAPS_BY_CATEGORY[m.category].push(m);
  // Pre-built search index: concatenate every searchable field once, lowercased + diacritic-normalized.
  // Avoids reassembling the same string for 1,559 maps on every keystroke in filterMaps().
  // Diacritic normalization means 'Mercator' / 'Mércator' / 'mercator' all match the same index.
  m._searchIndex = normalizeForSearch(
    (m.title || "") + " " +
    (m.original_title || "") + " " +
    (m.region || "") + " " +
    (m.country || "") + " " +
    (m.author || "") + " " +
    (m.description || "") + " " +
    (m.historical_context || "") + " " +
    (m.tags || []).join(" ") + " " +
    (m.institution || "") + " " +
    (m.continent || "") + " " +
    (m.language || "") + " " +
    (m.categoryDisplay || categoryDisplayRaw(m.category))
  );
});
// Cheap local helper so the boot-time loop doesn't depend on categoryDisplay (declared later).
function categoryDisplayRaw(key) { return (key||"").replace(/^\d+_/, '').replace(/_/g,' ').replace(/and/g,'&'); }
// Lowercase + strip combining diacritics + collapse whitespace.
// Both index and queries pass through this so search is accent-insensitive.
function normalizeForSearch(s) {
  if (!s) return "";
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

/* ---------- icons ---------- */
const icons = {
  search: '<svg class="i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  bookmark: '<svg class="i" viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
  compare: '<svg class="i" viewBox="0 0 24 24"><rect x="3" y="5" width="8" height="14" rx="1"/><rect x="13" y="5" width="8" height="14" rx="1"/><path d="M12 3v18"/></svg>',
  fullscreen: '<svg class="i" viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
  note: '<svg class="i" viewBox="0 0 24 24"><path d="M4 4h12l4 4v12H4z"/><path d="M16 4v4h4"/><path d="M8 13h8M8 17h5"/></svg>',
  source: '<svg class="i" viewBox="0 0 24 24"><path d="M14 4h6v6"/><path d="M10 14L20 4"/><path d="M18 13v6H5V6h6"/></svg>',
  arrow: '<svg class="i" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  zoomIn: '<svg class="i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M11 8v6M8 11h6M20 20l-3.5-3.5"/></svg>',
  zoomOut: '<svg class="i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M8 11h6M20 20l-3.5-3.5"/></svg>',
  close: '<svg class="i" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  ext: '<svg class="i" viewBox="0 0 24 24"><path d="M14 4h6v6"/><path d="M10 14L20 4"/><path d="M18 13v6H5V6h6"/></svg>',
};

/* ---------- shared bits ---------- */
function escapeAttr(s) { return String(s || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
// Full HTML-escape for text injected with innerHTML. Use this for any user-provided string
// (notes, annotations, profile name) and anywhere caller-supplied data needs to render as text.
function escapeHtml(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function shortTitle(t, max = 80) { return t && t.length > max ? t.slice(0, max-1).trim() + "…" : (t || "Untitled"); }
function shortText(t, max = 180) { return t && t.length > max ? t.slice(0, max-1).trim() + "…" : t || ""; }
function categoryMeta(key) { return CATEGORY_META.find(c => c.key === key); }
function categoryDisplay(key) { return categoryMeta(key)?.display || (key||"").replace(/^\d+_/, '').replace(/_/g,' ').replace(/and/g, '&'); }

function imageEl(m, opts = {}) {
  const lazy = opts.eager ? "" : 'loading="lazy"';
  const svg = placeholderSVG(m);
  const rot = rotationFor(m);
  const rotStyle = rot ? ` style="transform: rotate(${rot}deg)"` : "";
  if (!m.renderable || !m.download_url) {
    return `<div class="img-fallback">${svg}</div>`;
  }
  return `
    <div class="img-fallback">${svg}</div>
    <img ${lazy} decoding="async"
      src="${m.download_url}"
      alt="${escapeAttr(m.title)}"
      class="map-img"${rotStyle}
      onload="this.classList.add('loaded')"
      onerror="this.classList.add('failed'); this.parentElement.classList.add('img-err'); this.style.display='none'"
    />`;
}

function mapCard(m) {
  // Display year — prefer depictedYear if present (the historical date the map shows),
  // otherwise the map's own date. The yearLabel marks modern reconstructions.
  let y, yearLabel = "";
  if (m.depictedYear) {
    y = String(m.depictedYear);
    yearLabel = `depicts ${m.depictedYear}`;
  } else if (m.year && m.year !== 'Undated') {
    y = m.year;
  } else if (m.century && m.century !== 'Undated') {
    y = m.century;
  } else {
    y = 'Undated';
  }
  const curated = !!m.significance;
  return `
    <a class="map-card${curated ? ' map-card-curated' : ''}" href="#/map/${m.id}">
      <div class="map-frame map-frame-img">
        ${imageEl(m)}
        <div class="frame-label">${yearLabel || y}</div>
        ${curated ? '<div class="curated-badge" title="Curated ficha — includes editorial essay on significance, interpretation and distortions">★ Curated</div>' : ''}
      </div>
      <div class="map-card-body">
        <div class="card-meta">
          <span class="chip">${y}</span>
          <span class="chip chip-gold">${categoryDisplay(m.category)}</span>
        </div>
        <h4>${shortTitle(m.title, 70)}</h4>
        ${m.description ? `<p class="desc">${shortText(m.description, 150)}</p>` : ''}
        <div class="meta-row" style="margin-top:6px">
          ${m.region ? `<span class="meta">${m.region}</span>` : ''}
          ${m.author && !m._authorIsContributor ? `<span class="dot"></span><span class="meta">${shortText(m.author, 40)}</span>` : ''}
        </div>
      </div>
    </a>`;
}

function smallMapTile(m) {
  const y = m.year && m.year !== 'Undated' ? m.year : m.century;
  return `
    <a class="map-tile" href="#/map/${m.id}">
      <div class="map-frame map-frame-img" style="aspect-ratio:1.4/1">${imageEl(m)}</div>
      <div class="tile-body">
        <div class="meta">${y} · ${(m.region||m.continent||categoryDisplay(m.category)).split(',')[0]}</div>
        <div class="tile-title">${shortTitle(m.title, 60)}</div>
      </div>
    </a>`;
}

function categoryCoverImage(catKey) {
  const list = MAPS_BY_CATEGORY[catKey] || [];
  return list.find(m => m.renderable) || list[0];
}

/* ============ ROUTING ============ */
// Routes:
//   #/home
//   #/archive                  → Categories landing (browse 16)
//   #/archive/CAT_KEY          → Category detail (filtered grid)
//   #/archive/_all             → Cross-category filtered view (era / tag entry points)
//   #/map/ID
//   #/account                  → Profile or auth (signin/signup/recover)
//   #/account/signin / signup / recover
//   #/timeline #/compare #/collections #/learn #/about #/library
const PAGES = ["home","archive","map","timeline","compare","collections","learn","article","glossary","atlas","about","library","account"];
const ALL_CATS = "_all"; // sentinel for cross-category filtered view (era pills, tag chips)

function parseHash() {
  // Format: #/page/param?key=val&key=val
  let h = location.hash.replace(/^#\/?/, "");
  let query = "";
  const qIdx = h.indexOf("?");
  if (qIdx >= 0) {
    query = h.slice(qIdx + 1);
    h = h.slice(0, qIdx);
  }
  const [page, ...rest] = h.split("/");
  const params = {};
  if (query) {
    for (const part of query.split("&")) {
      const [k, v = ""] = part.split("=");
      if (k) params[decodeURIComponent(k)] = decodeURIComponent(v);
    }
  }
  return { page: PAGES.includes(page) ? page : "home", param: rest.join("/"), query: params };
}
function navigate(path) { location.hash = "#/" + path; }

// Serialise archiveState filters into the URL hash without triggering a re-render.
// Allows the user to copy/share a URL that restores their filter combination.
function serializeArchiveFilters() {
  const q = {};
  if (archiveState.search) q.q = archiveState.search;
  if (archiveState.era && archiveState.era !== "all") q.era = archiveState.era;
  if (archiveState.continent && archiveState.continent !== "All") q.continent = archiveState.continent;
  if (archiveState.language && archiveState.language !== "All") q.lang = archiveState.language;
  if (archiveState.tags.size) q.tags = [...archiveState.tags].join("|");
  if (archiveState.fichaQuality === "full") q.curated = "1";
  if (archiveState.yearFrom != null) q.from = archiveState.yearFrom;
  if (archiveState.yearTo != null) q.to = archiveState.yearTo;
  if (archiveState.sort && archiveState.sort !== "Oldest dated first") q.sort = archiveState.sort;
  const qs = Object.entries(q).map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&");
  return qs;
}
function applyFiltersToUrl() {
  const { page, param } = parseHash();
  if (page !== "archive") return;
  const qs = serializeArchiveFilters();
  const basePath = `#/${page}${param ? "/" + param : ""}`;
  const newHash = qs ? `${basePath}?${qs}` : basePath;
  if (location.hash !== newHash) {
    // Replace state so we don't pollute history with every keystroke
    history.replaceState(null, "", newHash);
  }
}
function restoreFiltersFromUrl(query) {
  if (!query) return;
  if (query.q != null) archiveState.search = query.q;
  if (query.era) archiveState.era = query.era;
  if (query.continent) archiveState.continent = query.continent;
  if (query.lang) archiveState.language = query.lang;
  if (query.tags) archiveState.tags = new Set(query.tags.split("|").filter(Boolean));
  if (query.curated === "1") archiveState.fichaQuality = "full";
  if (query.from) { const n = parseInt(query.from, 10); if (!isNaN(n)) archiveState.yearFrom = n; }
  if (query.to)   { const n = parseInt(query.to, 10);   if (!isNaN(n)) archiveState.yearTo = n; }
  if (query.sort) archiveState.sort = query.sort;
}
// Per-route page metadata. SEO + browser tab labelling.
const ROUTE_META = {
  home:        { title: "Mappa Mundi — A digital archive of maps", desc: "1,559 maps spanning 12 centuries. 40 curated essays. Search, compare, and read what each map reveals." },
  archive:     { title: "Categories — Mappa Mundi", desc: "Browse 1,559 maps across 16 archive categories: world maps, ancient, medieval, renaissance, colonial, climate, topographic, indigenous and more." },
  map:         { title: null, desc: null }, // set dynamically per map
  timeline:    { title: "Timeline — Mappa Mundi", desc: "Five thousand years of cartography organized by historical period. Scroll horizontally through nine eras from ancient civilizations to the contemporary world." },
  compare:     { title: "Compare maps — Mappa Mundi", desc: "Compare two maps side-by-side or in overlay. Five suggested pairings to start, or pick any two from the archive." },
  collections: { title: "Collections — Mappa Mundi", desc: "Eleven curated themed collections of maps with introductory essays — empires, colonialism, climate, indigenous cartographies and more." },
  learn:       { title: "Learn — Mappa Mundi", desc: "Essays, primers and case studies on the history of cartography. Plus a glossary of cartographic terms." },
  article:     { title: null, desc: null },
  glossary:    { title: "Glossary of cartographic terms — Mappa Mundi", desc: "Thirty definitions of cartographic terms — from mappa mundi and portolan chart to isoline, cadastre and counter-mapping. Each linked to maps that exemplify it." },
  atlas:       { title: "Atlas — Mappa Mundi", desc: "An interactive meta-map showing where the archive's 1,559 maps depict, plotted by region on a world projection. Click a pin to open the map." },
  about:       { title: "About — Mappa Mundi", desc: "About this archive: mission, sources, audiences, educational use. Honest numbers on what's actually in the collection." },
  library:     { title: "My library — Mappa Mundi", desc: "Your saved maps, viewing history, notes and personal collections." },
  account:     { title: "Account — Mappa Mundi", desc: "Sign in to save maps, take notes, and pick up where you left off." },
};

function setPageMeta(title, desc, canonicalPath) {
  if (title) document.title = title;
  const descEl = document.querySelector('meta[name="description"]');
  if (descEl && desc) descEl.setAttribute("content", desc);
  // Update Open Graph too so social sharing of inner pages works correctly
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogTitle && title) ogTitle.setAttribute("content", title);
  if (ogDesc && desc) ogDesc.setAttribute("content", desc);
  if (ogUrl && canonicalPath) ogUrl.setAttribute("content", location.origin + location.pathname + "#/" + canonicalPath);
  // Canonical link
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = location.origin + location.pathname + (canonicalPath ? "#/" + canonicalPath : "");
}

// Structured data (Schema.org) for the current map detail page.
// Helps search engines and AI crawlers understand the page as a cartographic record.
function setStructuredDataForMap(m) {
  const existing = document.getElementById("ld-map");
  if (existing) existing.remove();
  if (!m) return;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Map",
    "name": m.title,
    "description": m.description || m.historical_context || `Map from the Mappa Mundi archive.`,
    "creator": m._authorIsContributor ? undefined : (m.author || undefined),
    "dateCreated": m.year,
    "spatialCoverage": m.region || m.country || m.continent || undefined,
    "image": m.renderable ? m.download_url : undefined,
    "url": location.origin + location.pathname + "#/map/" + m.id,
    "license": m.license || undefined,
    "isAccessibleForFree": true,
    "isPartOf": { "@type":"Collection", "name":"Mappa Mundi archive", "url": location.origin + location.pathname },
    "sourceOrganization": m.institution || undefined,
  };
  Object.keys(ld).forEach(k => ld[k] === undefined && delete ld[k]);
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "ld-map";
  script.textContent = JSON.stringify(ld);
  document.head.appendChild(script);
}

function renderRoute() {
  const { page, param, query } = parseHash();
  $$(".page").forEach(p => p.classList.toggle("active", p.id === "page-" + page));
  $$(".nav-link").forEach(l => l.classList.toggle("active", l.dataset.page === page));
  window.scrollTo({ top: 0, behavior: "instant" });
  // If we're leaving the map detail page OR the compare page, drop any window listeners they registered
  if (page !== "map" && page !== "compare") { _viewerCleanup?.(); _viewerCleanup = null; }
  // Update <title>, description, canonical, OG. Per-route overrides happen below.
  const meta = ROUTE_META[page] || ROUTE_META.home;
  setPageMeta(meta.title, meta.desc, page === "home" ? "home" : page + (param ? "/" + param : ""));
  // Clear any map-specific structured data when leaving the map page
  if (page !== "map") { const ld = document.getElementById("ld-map"); if (ld) ld.remove(); }
  if (page === "map") renderMapDetail(param || (MAPS[0] && MAPS[0].id));
  if (page === "archive") {
    // Special sentinels and category keys come in via param
    if (param === ALL_CATS) {
      archiveState.currentCategory = ALL_CATS;
    } else if (param && CATEGORY_META.some(c => c.key === param)) {
      archiveState.currentCategory = param;
      if (!Object.keys(query).length) archiveState.search = "";
    } else {
      archiveState.currentCategory = null;
    }
    // Restore any filter state encoded in the URL query
    restoreFiltersFromUrl(query);
    renderArchive();
  }
  if (page === "compare") renderCompare();
  if (page === "timeline") renderTimeline();
  if (page === "home") renderHome();
  if (page === "collections") renderCollections();
  if (page === "learn") renderLearn();
  if (page === "library") renderLibrary();
  if (page === "about") {
    renderAbout();
    // If the URL has ?section=ID, scroll to that section after the page paints.
    if (query.section) {
      requestAnimationFrame(() => {
        const target = document.getElementById(query.section);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }
  if (page === "article") renderArticle(param);
  if (page === "glossary") renderGlossary();
  if (page === "atlas") renderAtlas();
  if (page === "account") renderAccount(param);
}
window.addEventListener("hashchange", renderRoute);
window.addEventListener("mappa:account-changed", () => {
  renderNavAccount();
  // re-render the current page if it depends on auth state
  const { page } = parseHash();
  if (page === "account" || page === "library" || page === "home") renderRoute();
});

/* ============ HOME ============ */
function pickFeatured() {
  const day = Math.floor(Date.now() / (1000*60*60*24));
  const rich = MAPS.filter(m => m.description && m.renderable && m.author);
  return rich[day % rich.length] || MAPS[0];
}

function renderHome() {
  const featured = pickFeatured();
  $("#home-featured").innerHTML = `
    <div class="featured-card">
      <a class="featured-img" href="#/map/${featured.id}">
        <div class="map-frame map-frame-img" style="aspect-ratio:4/3">${imageEl(featured, {eager: true})}</div>
      </a>
      <div class="featured-body">
        <span class="eyebrow">Map of the Day · ${new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</span>
        <h2 style="margin-top:14px">${featured.title}</h2>
        ${featured.original_title ? `<p style="margin-top:8px; font-style:italic; color:var(--ink-muted); font-size:14px">${shortText(featured.original_title, 140)}</p>` : ''}
        <div class="meta-row" style="margin-top:14px">
          <span class="meta">${featured.year}</span>
          ${featured.author ? `<span class="dot"></span><span class="meta">${featured.author}</span>` : ''}
          ${featured.region ? `<span class="dot"></span><span class="meta">${featured.region}</span>` : ''}
        </div>
        <p style="margin-top:22px; color:var(--ink-dim); font-size:17px; line-height:1.65; max-width:54ch">
          ${featured.historical_context || featured.description || 'Catalogued in the archive of Mappa Mundi.'}
        </p>
        <div class="row" style="margin-top:28px; gap:10px">
          <a class="btn btn-primary" href="#/map/${featured.id}">Open this map ${icons.arrow}</a>
          <a class="btn btn-ghost" href="#/archive">Browse all 16 categories</a>
        </div>
      </div>
    </div>`;

  // Featured collections — pick 4 high-count categories
  const top4 = [...CATEGORY_META]
    .map(c => ({...c, count: COUNTS.byCategory[c.key] || 0}))
    .sort((a,b) => b.count - a.count)
    .slice(0, 4);
  $("#home-collections").innerHTML = top4.map(c => {
    const cover = categoryCoverImage(c.key);
    return `
    <a class="collection-card" href="#/archive/${c.key}">
      <div class="map-frame map-frame-img" style="aspect-ratio: 5/3">${cover ? imageEl(cover) : ''}</div>
      <div class="collection-body">
        <span class="meta">${fmt(c.count)} maps · ${c.subtitle}</span>
        <h3>${c.display}</h3>
        <p>${c.description}</p>
      </div>
    </a>`;
  }).join("");

  // Quick category strip — ALL 16 categories with real counts
  const sorted = [...CATEGORY_META].map(c => ({...c, count: COUNTS.byCategory[c.key] || 0})).sort((a,b)=>b.count-a.count);
  $("#home-category-strip").innerHTML = sorted.map((c, i) => `
    <a class="category" href="#/archive/${c.key}">
      <span class="category-num">${String(i+1).padStart(2,'0')}</span>
      <span class="category-name">${c.display}</span>
      <span class="category-count">${fmt(c.count)} map${c.count===1?"":"s"} · ${c.subtitle}</span>
    </a>`).join("");

  // Curated essays strip — rotate the 40 fully-essayed maps daily so the home page surfaces different ones each day,
  // skipping the one already shown as "Map of the day" to avoid duplication.
  const curatedPool = MAPS.filter(m => m.significance && m.id !== featured.id);
  const day = Math.floor(Date.now() / (1000*60*60*24));
  const curated = [];
  for (let i = 0; i < 6 && curatedPool.length; i++) {
    curated.push(curatedPool[(day * 11 + i * 37) % curatedPool.length]);
  }
  $("#home-curated").innerHTML = curated.map(mapCard).join("");

  // "See all 40 curated" sets the ficha filter + jumps to a cross-category view
  $("#home-browse-curated")?.addEventListener("click", () => {
    archiveState.fichaQuality = "full";
    archiveState.currentCategory = ALL_CATS;
    archiveState.search = "";
    archiveState.era = "all";
    archiveState.continent = "All";
    archiveState.language = "All";
    archiveState.tags = new Set();
    archiveState.yearFrom = null;
    archiveState.yearTo = null;
    archiveState.page = 1;
    navigate("archive");
  });
}

/* ============ ARCHIVE / CATEGORIES ============ */
const archiveState = {
  currentCategory: null,    // catKey or null
  search: "",
  era: "all",               // "all" | era.key
  continent: "All",
  language: "All",
  tags: new Set(),          // selected tag strings
  sort: "Oldest dated first",
  fichaQuality: "all",      // "all" | "full" — show only maps with curated full ficha
  yearFrom: null,           // int or null
  yearTo: null,             // int or null
  page: 1,
  pageSize: 48,
};

// Effective year for filtering: prefer depictedYear (what the map shows) over yearNum (when the map was made).
// This way "The Ottoman Empire in 1710" (created 2022, depicts 1710) filters into 1700-1715 range.
function effectiveYear(m) {
  return m.depictedYear != null ? m.depictedYear : m.yearNum;
}

function renderArchive() {
  const root = $("#archive-content");
  if (!root) return;
  if (archiveState.currentCategory) {
    renderCategoryDetail(root, archiveState.currentCategory);
  } else if (archiveState.search) {
    renderSearchResults(root);
  } else {
    renderCategoryGrid(root);
  }
  // Reflect filter state in the URL so it's shareable / bookmarkable
  applyFiltersToUrl();
}

/* ----- Categories landing (16 cards) ----- */
function renderCategoryGrid(root) {
  const totalMaps = MAPS.length;
  const totalDated = MAPS.filter(m => m.yearNum !== null).length;

  // Top tags overall
  const topTags = Object.entries(COUNTS.byTag).sort((a,b)=>b[1]-a[1]).slice(0, 14);

  root.innerHTML = `
    <div class="container-wide" style="padding-top: 56px">
      <div class="archive-hero">
        <span class="eyebrow">The Archive</span>
        <h1 style="margin-top:14px; font-size:clamp(48px,5vw,82px)">Every map, indexed.</h1>
        <p class="lede" style="margin-top:18px; max-width: 64ch">
          ${fmt(totalMaps)} maps across 16 categories, from sources including the Library of Congress, the Bibliothèque nationale de France, Wikimedia Commons, and the Internet Archive. Browse by category, filter by era and region, or search.
        </p>

        <div class="archive-bigsearch" id="archive-bigsearch">
          ${icons.search}
          <input placeholder="Search by title, place, cartographer, period, language, tag…" autocomplete="off"/>
          <span class="kbd">⏎</span>
        </div>

        <div class="archive-hero-stats">
          <div><span class="num">${fmt(totalMaps)}</span><span class="lbl">maps catalogued</span></div>
          <div><span class="num">16</span><span class="lbl">archive categories</span></div>
          <div><span class="num">${ERAS.length-1}</span><span class="lbl">historical eras</span></div>
          <div><span class="num">${fmt(totalDated)}</span><span class="lbl">with dated provenance</span></div>
        </div>
      </div>

      <div class="quick-eras">
        <span class="eyebrow">Browse by era</span>
        <div class="era-pills">
          ${ERAS.map(e => `<a class="era-pill" data-era="${e.key}" href="#/archive">
            <span class="era-pill-label">${e.label}</span>
            <span class="era-pill-count">${fmt(COUNTS.byEra[e.key]||0)}</span>
          </a>`).join("")}
        </div>
      </div>

      <div class="quick-tags">
        <span class="eyebrow">Popular threads</span>
        <div class="tag-cloud">
          ${topTags.map(([t, n]) => `<a class="tag-cloud-item" data-tag="${escapeAttr(t)}" href="#/archive">${t} <span>${fmt(n)}</span></a>`).join("")}
        </div>
      </div>

      <div class="divider-ornate" style="margin: 64px 0 36px"><span class="glyph">✦ ✦ ✦</span></div>

      <div class="spread" style="margin-bottom:24px">
        <div>
          <span class="eyebrow">Browse by category</span>
          <h2 style="margin-top:14px">16 categories</h2>
        </div>
        <span class="meta">All ${fmt(totalMaps)} maps grouped</span>
      </div>

      <div class="cat-grid">
        ${CATEGORY_META.map(c => {
          const count = COUNTS.byCategory[c.key] || 0;
          const cover = categoryCoverImage(c.key);
          return `
          <a class="cat-card" href="#/archive/${c.key}">
            <div class="cat-card-img map-frame map-frame-img">${cover ? imageEl(cover) : ''}</div>
            <div class="cat-card-body">
              <div class="meta-row">
                <span class="meta">${c.key.replace(/_/g,' ').replace(/^\d+/, m => m).slice(0,2)}</span>
                <span class="dot"></span>
                <span class="meta">${fmt(count)} map${count===1?"":"s"}</span>
              </div>
              <h3>${c.display}</h3>
              <p class="cat-card-sub">${c.subtitle}</p>
              <p class="cat-card-desc">${c.description}</p>
              <span class="cat-card-cta">Browse ${c.display.toLowerCase()} ${icons.arrow}</span>
            </div>
          </a>`;
        }).join("")}
      </div>
    </div>
  `;

  // wire era pills, tag chips, search
  $$('[data-era]').forEach(el => el.addEventListener("click", (e) => {
    e.preventDefault();
    archiveState.era = el.dataset.era;
    archiveState.currentCategory = ALL_CATS;
    renderArchive();
  }));
  $$('[data-tag]').forEach(el => el.addEventListener("click", (e) => {
    e.preventDefault();
    archiveState.tags = new Set([el.dataset.tag]);
    archiveState.currentCategory = ALL_CATS;
    renderArchive();
  }));
  const big = $("#archive-bigsearch input");
  big?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      archiveState.search = e.target.value.trim();
      if (archiveState.search) {
        archiveState.currentCategory = null;
        renderArchive();
      }
    }
  });
}

/* ----- Search results view ----- */
function renderSearchResults(root) {
  const list = filterMaps({ search: archiveState.search });
  root.innerHTML = `
    <div class="container-wide" style="padding-top: 48px">
      <div class="row" style="gap:18px; align-items:baseline; margin-bottom: 16px">
        <a class="btn btn-ghost" href="#/archive" data-action="back-to-cats" style="padding-left:0">← All categories</a>
      </div>
      <div class="spread" style="align-items:flex-end; margin-bottom: 28px">
        <div>
          <span class="eyebrow">Search</span>
          <h1 style="margin-top:14px; font-size:clamp(40px,4vw,64px)">"${archiveState.search}"</h1>
          <p class="lede" style="margin-top:14px">${fmt(list.length)} map${list.length===1?"":"s"} match your search across ${fmt(MAPS.length)} records.</p>
        </div>
        <div class="search" style="max-width:480px; min-width:280px" id="archive-search-inline">
          ${icons.search}
          <input placeholder="Refine search…" value="${escapeAttr(archiveState.search)}"/>
        </div>
      </div>
      ${renderResultGrid(list, "Search results")}
    </div>
  `;
  wireResultControls();
  $("#archive-search-inline input")?.addEventListener("input", (e) => {
    archiveState.search = e.target.value.trim();
    archiveState.page = 1;
    renderSearchResults(root);
  });
}

/* ----- One-category detail view ----- */
function renderCategoryDetail(root, catKey) {
  const all = catKey === ALL_CATS ? MAPS : (MAPS_BY_CATEGORY[catKey] || []);
  const meta = catKey === ALL_CATS ? { display:"All maps", subtitle:"Every record in the archive.", description:"The complete archive across all 16 categories." } : categoryMeta(catKey);
  const cover = catKey === ALL_CATS ? MAPS.find(m => m.renderable) : categoryCoverImage(catKey);
  const filtered = filterMaps({ category: catKey === ALL_CATS ? null : catKey });

  // Build per-category filter options
  const erasInCategory = ERAS.filter(e => all.some(m => MAP_ERA[m.id] === e.key));
  const continents = [...new Set(all.map(m => m.continent).filter(v => v && v !== ""))].sort();
  const languages = [...new Set(all.map(m => m.language).filter(v => v && v !== "Unknown"))].sort();
  const topTagsInCat = Object.entries(all.reduce((m, x) => { (x.tags||[]).forEach(t => { m[t] = (m[t]||0)+1; }); return m; }, {})).sort((a,b) => b[1]-a[1]).slice(0, 14);

  root.innerHTML = `
    <div class="container-wide" style="padding-top:40px">
      <div class="breadcrumb">
        <a href="#/archive">Categories</a>
        <span>›</span>
        <span>${meta.display}</span>
      </div>

      <header class="cat-header">
        <div class="cat-header-img map-frame map-frame-img" style="aspect-ratio: 16/9">${cover ? imageEl(cover, {eager:true}) : ''}</div>
        <div class="cat-header-body">
          <span class="eyebrow">${meta.subtitle}</span>
          <h1 style="margin-top:14px; font-size:clamp(40px,4.4vw,72px)">${meta.display}</h1>
          <p class="lede" style="margin-top:18px; max-width:60ch">${meta.description}</p>
          <div class="meta-row" style="margin-top:24px">
            <span class="meta"><strong style="color:var(--gold); font-weight:500">${fmt(all.length)}</strong> map${all.length===1?"":"s"} in this category</span>
            <span class="dot"></span>
            <span class="meta">Filter below to narrow</span>
          </div>
        </div>
      </header>

      <div class="cat-search" id="cat-search">
        ${icons.search}
        <input placeholder="Search within ${meta.display.toLowerCase()}…" value="${escapeAttr(archiveState.search)}" autocomplete="off"/>
      </div>

      <div class="archive-shell">
        <aside class="archive-sidebar">
          <div class="filter-block">
            <span class="eyebrow">Historical era</span>
            <div class="era-list" style="margin-top: 10px">
              <label class="era-radio">
                <input type="radio" name="era" value="all" ${archiveState.era === 'all' ? 'checked' : ''}/>
                <span>All eras <em>(${fmt(all.length)})</em></span>
              </label>
              ${erasInCategory.map(e => {
                const c = all.filter(m => MAP_ERA[m.id] === e.key).length;
                return `<label class="era-radio">
                  <input type="radio" name="era" value="${e.key}" ${archiveState.era === e.key ? 'checked' : ''}/>
                  <span>${e.label} <em>(${fmt(c)})</em></span>
                </label>`;
              }).join("")}
            </div>
          </div>

          <div class="filter-block">
            <span class="eyebrow">Year range</span>
            <p class="meta" style="margin-top:6px; font-family:var(--serif-body); text-transform:none; letter-spacing:0; font-size:12px; color:var(--ink-muted); font-style:italic">Use negative numbers for BCE (e.g. −500 for 500 BCE). Maps with no year are excluded when this filter is set.</p>
            <div class="year-range-inputs" style="display:flex; gap:10px; margin-top:10px; align-items:center">
              <label style="flex:1; display:flex; flex-direction:column; gap:4px">
                <span class="meta" style="letter-spacing:0.08em">From</span>
                <input type="number" class="input" data-year-input="from" placeholder="any" value="${archiveState.yearFrom ?? ''}" step="1" style="width:100%"/>
              </label>
              <label style="flex:1; display:flex; flex-direction:column; gap:4px">
                <span class="meta" style="letter-spacing:0.08em">To</span>
                <input type="number" class="input" data-year-input="to" placeholder="any" value="${archiveState.yearTo ?? ''}" step="1" style="width:100%"/>
              </label>
            </div>
          </div>

          ${continents.length > 1 ? `<div class="filter-block">
            <span class="eyebrow">Continent</span>
            <select class="select" data-filter="continent" style="margin-top:8px; width:100%">
              <option value="All">All continents</option>
              ${continents.map(c => `<option ${archiveState.continent===c?'selected':''} value="${escapeAttr(c)}">${c} (${all.filter(m => m.continent===c).length})</option>`).join("")}
            </select>
          </div>` : ''}

          ${languages.length > 1 ? `<div class="filter-block">
            <span class="eyebrow">Language</span>
            <select class="select" data-filter="language" style="margin-top:8px; width:100%">
              <option value="All">All languages</option>
              ${languages.map(l => `<option ${archiveState.language===l?'selected':''} value="${escapeAttr(l)}">${l} (${all.filter(m => m.language===l).length})</option>`).join("")}
            </select>
          </div>` : ''}

          ${topTagsInCat.length ? `<div class="filter-block">
            <span class="eyebrow">Themes &amp; tags</span>
            <div class="tag-list" style="margin-top: 10px">
              ${topTagsInCat.map(([t, n]) => `<label class="tag-check ${archiveState.tags.has(t) ? 'active' : ''}" data-tag="${escapeAttr(t)}">
                <span>${t}</span><em>${n}</em>
              </label>`).join("")}
            </div>
          </div>` : ''}

          <div class="filter-block">
            <span class="eyebrow">Record quality</span>
            <label class="toggle-row" style="margin-top:10px; cursor:pointer">
              <input type="checkbox" data-filter="ficha-full" ${archiveState.fichaQuality === 'full' ? 'checked' : ''}/>
              <span style="font-family:var(--serif-body); font-size:14px; color:var(--ink-dim)">Only curated fichas — maps with a full editorial essay (significance, interpretation, distortions)</span>
            </label>
          </div>

          <div class="filter-block">
            <span class="eyebrow">Sort by</span>
            <select class="select" data-filter="sort" id="archive-sort" style="margin-top:8px; width:100%">
              <option ${archiveState.sort==='Oldest dated first'?'selected':''}>Oldest dated first</option>
              <option ${archiveState.sort==='Newest dated first'?'selected':''}>Newest dated first</option>
              <option ${archiveState.sort==='Alphabetical'?'selected':''}>Alphabetical</option>
              <option ${archiveState.sort==='Most metadata'?'selected':''}>Most metadata (curated fichas first)</option>
            </select>
          </div>

          ${archiveState.tags.size || archiveState.era !== 'all' || archiveState.continent !== 'All' || archiveState.language !== 'All' || archiveState.search || archiveState.fichaQuality !== 'all' || archiveState.yearFrom != null || archiveState.yearTo != null ? `
            <button class="btn btn-sm" id="clear-all-filters" style="margin-top:8px">Clear all filters</button>
          ` : ''}
        </aside>

        <div class="archive-main">
          ${renderResultGrid(filtered, meta.display)}
        </div>
      </div>
    </div>
  `;

  wireResultControls();
}

function renderResultGrid(list, scope) {
  const total = list.length;
  const view = list.slice(0, archiveState.page * archiveState.pageSize);
  const chips = activeFilterChips();
  return `
    ${chips.length ? `<div class="active-chips">
      ${chips.map(c => `<button class="active-chip" data-clear="${c.k}">${c.label} ${icons.close}</button>`).join("")}
      ${chips.length > 1 ? `<button class="active-chip clear-all" data-clear="*">Clear all</button>` : ''}
      <button class="active-chip share-link" id="share-filter-link" title="Copy a link that restores this filter combination">🔗 Copy share link</button>
    </div>` : ''}
    <div class="archive-toolbar">
      <span class="meta"><strong style="color:var(--gold); font-weight:500">${fmt(total)}</strong> map${total===1?"":"s"} ${scope ? `in ${scope}` : ''}</span>
    </div>
    <div class="grid-cards">
      ${view.length ? view.map(mapCard).join("") : `<div class="empty-state">
        <p style="font-style:italic">No maps match this combination of filters.</p>
        ${chips.length ? `<p style="margin-top:14px; font-style:normal; font-family:var(--serif-body)">Try removing one of:</p>
        <div class="active-chips" style="margin-top:10px; justify-content:center">
          ${chips.map(c => `<button class="active-chip" data-clear="${c.k}">${c.label} ${icons.close}</button>`).join("")}
        </div>` : ''}
        <p style="margin-top:18px; font-style:normal"><a class="link-underline" href="#/archive" style="color:var(--gold)">Or return to all 16 categories</a></p>
      </div>`}
    </div>
    ${view.length < total ? `<div class="archive-loadmore-wrap">
      <span class="meta">Showing ${fmt(view.length)} of ${fmt(total)}</span>
      <button id="archive-loadmore" class="btn">Load more maps</button>
    </div>` : (view.length ? `<div class="archive-loadmore-wrap"><span class="meta">All ${fmt(total)} maps shown</span></div>` : '')}
  `;
}

function activeFilterChips() {
  const chips = [];
  if (archiveState.search) chips.push({ k:"__search", label:`Search: "${archiveState.search}"` });
  if (archiveState.era !== "all") {
    const e = ERAS.find(x => x.key === archiveState.era);
    if (e) chips.push({ k:"__era", label:`Era: ${e.label}` });
  }
  if (archiveState.continent !== "All") chips.push({ k:"__continent", label:`Continent: ${archiveState.continent}` });
  if (archiveState.language !== "All") chips.push({ k:"__language", label:`Language: ${archiveState.language}` });
  archiveState.tags.forEach(t => chips.push({ k:`__tag:${t}`, label:`Tag: ${t}` }));
  if (archiveState.fichaQuality === "full") chips.push({ k:"__ficha", label:`Only curated fichas` });
  if (archiveState.yearFrom != null || archiveState.yearTo != null) {
    const fmtYear = (y) => y == null ? '∞' : (y < 0 ? `${-y} BCE` : String(y));
    chips.push({ k:"__year", label:`Year: ${fmtYear(archiveState.yearFrom)} – ${fmtYear(archiveState.yearTo)}` });
  }
  return chips;
}

function filterMaps(opts = {}) {
  let list = opts.category ? (MAPS_BY_CATEGORY[opts.category] || []) :
             (archiveState.currentCategory && archiveState.currentCategory !== ALL_CATS ? MAPS_BY_CATEGORY[archiveState.currentCategory] : MAPS);
  list = list.slice();

  if ((opts.search ?? archiveState.search)) {
    const raw = (opts.search ?? archiveState.search);
    const tokens = normalizeForSearch(raw).split(/\s+/).filter(Boolean);
    if (tokens.length) {
      list = list.filter(m => tokens.every(tok => m._searchIndex.includes(tok)));
    }
  }
  if (archiveState.era !== "all") {
    list = list.filter(m => MAP_ERA[m.id] === archiveState.era);
  }
  if (archiveState.continent !== "All") list = list.filter(m => m.continent === archiveState.continent);
  if (archiveState.language !== "All") list = list.filter(m => m.language === archiveState.language);
  if (archiveState.tags.size) list = list.filter(m => [...archiveState.tags].every(t => (m.tags||[]).includes(t)));
  if (archiveState.fichaQuality === "full") list = list.filter(m => !!m.significance);
  if (archiveState.yearFrom != null || archiveState.yearTo != null) {
    const lo = archiveState.yearFrom ?? -99999;
    const hi = archiveState.yearTo ?? 99999;
    list = list.filter(m => {
      const y = effectiveYear(m);
      return y != null && y >= lo && y <= hi;
    });
  }

  switch (archiveState.sort) {
    case "Oldest dated first":
      list.sort((a,b) => {
        const ay = a.yearNum, by = b.yearNum;
        if (ay === null && by === null) return a.title.localeCompare(b.title);
        if (ay === null) return 1;
        if (by === null) return -1;
        return ay - by;
      });
      break;
    case "Newest dated first":
      list.sort((a,b) => {
        const ay = a.yearNum, by = b.yearNum;
        if (ay === null && by === null) return a.title.localeCompare(b.title);
        if (ay === null) return 1;
        if (by === null) return -1;
        return by - ay;
      });
      break;
    case "Alphabetical":
      list.sort((a,b) => (a.title||"").localeCompare(b.title||""));
      break;
    case "Most metadata":
      list.sort((a,b) => metadataScore(b) - metadataScore(a));
      break;
  }
  return list;
}
function metadataScore(m) {
  // Curated fichas (with full essay set) score heavily so they surface first
  const curated = m.significance ? 10 : 0;
  return curated + (m.description?1:0) + (m.historical_context?1:0) + (m.author?1:0) + (m.region?1:0) + (m.country?1:0) + (m.continent?1:0) + (m.tags?.length?1:0) + (m.related_events?.length?1:0) + (m.yearNum!==null?2:0);
}

function wireResultControls() {
  // Filter selects
  $$('select[data-filter]').forEach(sel => {
    sel.addEventListener("change", (e) => {
      const f = e.target.dataset.filter;
      if (f === "continent") archiveState.continent = e.target.value;
      if (f === "language") archiveState.language = e.target.value;
      if (f === "sort") archiveState.sort = e.target.value;
      archiveState.page = 1;
      renderArchive();
    });
  });
  // Ficha-quality checkbox
  $$('input[data-filter="ficha-full"]').forEach(cb => cb.addEventListener("change", (e) => {
    archiveState.fichaQuality = e.target.checked ? "full" : "all";
    archiveState.page = 1;
    renderArchive();
  }));
  // Year range inputs (debounced)
  let _yearTimer;
  $$('input[data-year-input]').forEach(inp => inp.addEventListener("input", (e) => {
    clearTimeout(_yearTimer);
    _yearTimer = setTimeout(() => {
      const which = e.target.dataset.yearInput;
      const v = e.target.value.trim();
      const parsed = v === '' ? null : parseInt(v, 10);
      if (which === 'from') archiveState.yearFrom = isNaN(parsed) ? null : parsed;
      if (which === 'to') archiveState.yearTo = isNaN(parsed) ? null : parsed;
      archiveState.page = 1;
      renderArchive();
    }, 400);
  }));
  // Era radios
  $$('input[name="era"]').forEach(r => r.addEventListener("change", (e) => {
    archiveState.era = e.target.value;
    archiveState.page = 1;
    renderArchive();
  }));
  // Tag chips
  $$('[data-tag]').forEach(el => el.addEventListener("click", (e) => {
    e.preventDefault();
    const t = el.dataset.tag;
    if (archiveState.tags.has(t)) archiveState.tags.delete(t); else archiveState.tags.add(t);
    archiveState.page = 1;
    renderArchive();
  }));
  // Active chip clears
  $$('.active-chip').forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.clear;
    if (k === "*") clearAllFilters();
    else if (k === "__search") archiveState.search = "";
    else if (k === "__era") archiveState.era = "all";
    else if (k === "__continent") archiveState.continent = "All";
    else if (k === "__language") archiveState.language = "All";
    else if (k === "__ficha") archiveState.fichaQuality = "all";
    else if (k === "__year") { archiveState.yearFrom = null; archiveState.yearTo = null; }
    else if (k.startsWith("__tag:")) archiveState.tags.delete(k.slice(6));
    archiveState.page = 1;
    renderArchive();
  }));
  // Load more
  $("#archive-loadmore")?.addEventListener("click", () => {
    archiveState.page += 1;
    renderArchive();
  });
  // In-category search (debounced — every keystroke would otherwise rebuild 48 cards)
  let _catSearchTimer;
  $("#cat-search input")?.addEventListener("input", (e) => {
    clearTimeout(_catSearchTimer);
    const q = e.target.value.trim();
    _catSearchTimer = setTimeout(() => {
      archiveState.search = q;
      archiveState.page = 1;
      renderArchive();
    }, 150);
  });
  // Back-to-categories: must clear search state before the hash change renders the grid
  $('[data-action="back-to-cats"]')?.addEventListener("click", (e) => {
    e.preventDefault();
    archiveState.search = "";
    archiveState.currentCategory = null;
    archiveState.page = 1;
    navigate("archive");
  });
  // Clear all
  $("#clear-all-filters")?.addEventListener("click", clearAllFilters);
  // Share-link button
  $("#share-filter-link")?.addEventListener("click", async (e) => {
    e.preventDefault();
    const btn = e.currentTarget;
    const url = location.href;
    try {
      await navigator.clipboard.writeText(url);
      const orig = btn.innerHTML;
      btn.innerHTML = "✓ link copied";
      setTimeout(() => { btn.innerHTML = orig; }, 1600);
    } catch {
      btn.innerHTML = "× failed to copy";
      setTimeout(() => { btn.innerHTML = "🔗 Copy share link"; }, 1600);
    }
  });
}
function clearAllFilters() {
  archiveState.search = "";
  archiveState.era = "all";
  archiveState.continent = "All";
  archiveState.language = "All";
  archiveState.tags = new Set();
  archiveState.fichaQuality = "all";
  archiveState.yearFrom = null;
  archiveState.yearTo = null;
  archiveState.page = 1;
  renderArchive();
}

/* ============ MAP DETAIL ============ */
let _viewerCleanup = null; // holds removal functions for the two window listeners in bindViewer

function renderMapDetail(id) {
  _viewerCleanup?.();       // remove stale window listeners from the previous map view
  _viewerCleanup = null;

  const m = MAPS.find(x => x.id === id);
  if (!m) {
    // Honest 404 with affordances — a missing ID is more useful than silently substituting MAPS[0]
    const sampleCurated = MAPS.find(x => x.significance);
    $("#map-detail-root").innerHTML = `
      <div class="container" style="padding: 96px 0; max-width: 720px; text-align: center">
        <span class="eyebrow" style="color:var(--terracotta)">404 · Map not found</span>
        <h1 style="margin-top:18px; font-size:clamp(40px, 4vw, 64px)">No map matches the ID <code style="font-family:var(--mono); font-size:0.7em; color:var(--ink-muted)">${escapeAttr(id || '(empty)')}</code>.</h1>
        <p class="lede" style="margin-top:24px; max-width: 56ch; margin-inline:auto">
          The link you followed may be outdated, mistyped, or the record may have been removed from the archive.
        </p>
        <div class="row" style="justify-content:center; gap:10px; margin-top:36px; flex-wrap:wrap">
          <a class="btn btn-primary" href="#/archive">Browse the archive</a>
          ${sampleCurated ? `<a class="btn" href="#/map/${sampleCurated.id}">Open a curated example</a>` : ''}
          <button class="btn btn-ghost" id="map-404-search">Search by keyword</button>
        </div>
      </div>
    `;
    $("#map-404-search")?.addEventListener("click", openSearchModal);
    return;
  }

  Account.recordView(m.id); // track viewing history while user is signed in
  // Per-map SEO metadata
  const metaTitle = `${m.title} (${m.year}) — Mappa Mundi`;
  const metaDesc = (m.description || m.historical_context || `${m.title}, a map from the Mappa Mundi archive.`).slice(0, 200);
  setPageMeta(metaTitle, metaDesc, "map/" + m.id);
  setStructuredDataForMap(m);

  const related = MAPS.filter(x => x.id !== m.id && x.category === m.category && x.renderable).slice(0, 6);
  const isSaved = Account.isSaved(m.id);
  const saveLabel = isSaved ? "Saved" : "Save to library";
  const saveOpacity = isSaved ? "0.65" : "1";
  const attribution = m.attribution_required ?
    `<div class="attribution">
       <span class="eyebrow" style="color:var(--gold)">Attribution required</span>
       <p style="margin-top:8px">Image courtesy of <strong>${m.institution}</strong>. Licensed: ${m.license}.</p>
     </div>` : '';

  $("#map-detail-root").innerHTML = `
    <div class="container-wide" style="padding-top:32px">
      <div class="breadcrumb">
        <a href="#/archive">Categories</a>
        <span>›</span>
        <a href="#/archive/${m.category}">${categoryDisplay(m.category)}</a>
        <span>›</span>
        <span>${m.century !== "Undated" ? m.century : m.year}</span>
      </div>

      <div class="detail-grid">
        <div class="detail-viewer">
          <div class="viewer-toolbar">
            <div class="row" style="gap:8px">
              <button class="icon-btn" data-zoom="out" title="Zoom out">${icons.zoomOut}</button>
              <button class="icon-btn" data-zoom="in" title="Zoom in">${icons.zoomIn}</button>
              <button class="icon-btn" data-zoom="reset" title="Reset zoom">↺</button>
            </div>
            <div class="meta">${categoryDisplay(m.category)} · ${m.year}</div>
            <div class="row" style="gap:6px">
              <button class="icon-btn" title="Compare" data-action="compare-this">${icons.compare}</button>
              <button class="icon-btn" title="${saveLabel}" data-action="save" style="opacity:${saveOpacity}">${icons.bookmark}</button>
              <button class="icon-btn" title="Fullscreen" data-action="fullscreen">${icons.fullscreen}</button>
            </div>
          </div>
          <div class="viewer-canvas" id="viewer-canvas">
            <div class="viewer-stage" id="viewer-stage">
              <div class="img-fallback">${placeholderSVG(m)}</div>
              ${m.renderable && m.download_url ?
                `<img id="viewer-img" src="${m.download_url}" alt="${escapeAttr(m.title)}" class="viewer-img"${rotationFor(m) ? ` style="transform: rotate(${rotationFor(m)}deg)"` : ''}
                   onload="this.classList.add('loaded')"
                   onerror="this.style.display='none'"/>` : ''}
              <div class="annotation-layer" id="annotation-layer"></div>
            </div>
            <div class="viewer-hint">Click image for full-screen zoom · scroll to zoom · drag to pan · <strong style="color:var(--gold)">double-click</strong> to drop a pinned annotation</div>
          </div>
          <div class="viewer-actions">
            <button class="btn btn-primary" data-action="save" style="opacity:${saveOpacity}">${icons.bookmark} ${saveLabel}</button>
            <button class="btn" data-action="compare-this">${icons.compare} Compare</button>
            ${m.source_url ? `<a class="btn" href="${m.source_url}" target="_blank" rel="noopener">${icons.source} View source</a>` : ''}
            <button class="btn" data-action="fullscreen">${icons.fullscreen} Open full screen</button>
            <button class="btn" data-action="note">${icons.note} Add note</button>
          </div>
        </div>

        <aside class="detail-panel">
          <span class="eyebrow">${categoryDisplay(m.category)}${m.map_type ? ` · ${m.map_type}` : ''}</span>
          <h1 style="font-size:clamp(36px,3.6vw,56px); margin-top:14px">${m.title}</h1>
          ${m.original_title ? `<p style="margin-top:10px; font-style:italic; color:var(--ink-muted); font-size:15px; line-height:1.5">${m.original_title}</p>` : ''}
          <div class="meta-row" style="margin-top:18px">
            <span class="meta">${m.year}</span>
            ${m.region ? `<span class="dot"></span><span class="meta">${m.region}</span>` : ''}
          </div>
          <div class="kv">
            ${m.author ? `<div class="kv-row"><span>${m._authorIsContributor ? 'Source contributor' : 'Cartographer'}</span><span>${m.author}${m._authorIsContributor ? ' <em style="color:var(--ink-muted); font-style:normal; font-family:var(--mono); font-size:10px; letter-spacing:0.06em">· Wikimedia uploader, not the historical cartographer</em>' : ''}</span></div>` : ''}
            ${m.depictedYear ? `<div class="kv-row"><span>Depicts</span><span>${m.depictedYear}</span></div>
            <div class="kv-row"><span>Map created</span><span>${m.year} <em style="color:var(--ink-muted); font-style:normal; font-family:var(--mono); font-size:10px; letter-spacing:0.06em">· modern reconstruction</em></span></div>` : `
            <div class="kv-row"><span>Date</span><span>${m.year}${m._yearIsModernCreation ? ' <em style="color:var(--ink-muted); font-style:normal; font-family:var(--mono); font-size:10px; letter-spacing:0.06em">· modern creation date, not the date of any historical map</em>' : ''}</span></div>`}
            <div class="kv-row"><span>Century</span><span>${m.century}</span></div>
            <div class="kv-row"><span>Era</span><span>${ERAS.find(e => e.key === MAP_ERA[m.id])?.label || 'Undated'}</span></div>
            ${m.country ? `<div class="kv-row"><span>Country / Area</span><span>${m.country}</span></div>` : ''}
            ${m.continent ? `<div class="kv-row"><span>Continent</span><span>${m.continent}</span></div>` : ''}
            ${m.map_type ? `<div class="kv-row"><span>Map type</span><span>${m.map_type}</span></div>` : ''}
            ${m.language && m.language !== 'Unknown' ? `<div class="kv-row"><span>Language</span><span>${m.language}</span></div>` : ''}
            <div class="kv-row"><span>Category</span><span><a href="#/archive/${m.category}" class="link-underline" style="color:var(--gold)">${categoryDisplay(m.category)}</a></span></div>
            <div class="kv-row"><span>Source</span><span>${m.institution || '—'}</span></div>
            ${m.license ? `<div class="kv-row"><span>License</span><span style="font-size:12px">${m.license}</span></div>` : ''}
            ${m.public_domain_status ? `<div class="kv-row"><span>Status</span><span style="font-size:12px">${m.public_domain_status}</span></div>` : ''}
          </div>
          ${attribution}
          ${m.source_url ? `<a class="btn btn-ghost" href="${m.source_url}" target="_blank" rel="noopener" style="margin-top:20px; padding-left:0">${icons.ext} View record at source institution</a>` : ''}
          ${renderCitations(m)}
        </aside>
      </div>

      <div class="detail-essays">
        ${m.description ? `<section>
          <span class="eyebrow">About this map</span>
          <h3>What it shows</h3>
          <p>${m.description}</p>
        </section>` : ''}
        ${m.historical_context ? `<section>
          <span class="eyebrow">Historical context</span>
          <h3>How this map came to be made</h3>
          <p>${m.historical_context}</p>
        </section>` : ''}
        ${m.interpretation ? `<section>
          <span class="eyebrow">Reading the map</span>
          <h3>What the map reveals</h3>
          <p>${m.interpretation}</p>
        </section>` : ''}
        ${m.significance ? `<section>
          <span class="eyebrow">Why it matters</span>
          <h3>Significance</h3>
          <p>${m.significance}</p>
        </section>` : ''}
        ${m.meaning ? `<section>
          <span class="eyebrow">Meaning</span>
          <h3>Political, cultural, or scientific stakes</h3>
          <p>${m.meaning}</p>
        </section>` : ''}
        ${m.biases ? `<section class="detail-bias">
          <span class="eyebrow" style="color:var(--terracotta)">Distortions &amp; limitations</span>
          <h3 style="margin-top:8px">What this map gets wrong, or leaves out</h3>
          <p style="margin-top:10px">${m.biases}</p>
        </section>` : ''}
        ${(m.tags && m.tags.length) ? `<section>
          <span class="eyebrow">Themes &amp; tags</span>
          <h3>Threads in the archive</h3>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:14px">
            ${m.tags.map(t=>`<a class="chip" href="#/archive" data-detail-tag="${escapeAttr(t)}">${t}</a>`).join("")}
          </div>
        </section>` : ''}
        ${(m.related_events && m.related_events.length) ? `<section>
          <span class="eyebrow">Related events</span>
          <h3>Historical context</h3>
          <ul class="event-list">
            ${m.related_events.map(e=>`<li><span class="event-year">—</span><span>${e}</span></li>`).join("")}
          </ul>
        </section>` : ''}
      </div>

      ${(() => {
        // "Other cartographies of this region" — curated maps depicting roughly the same place but from different eras.
        // Keying: prefer matching region/continent/country, prefer different MAP_ERA, prefer curated.
        const targetEra = MAP_ERA[m.id];
        const targetRegion = (m.region || '').toLowerCase();
        const targetCountry = (m.country || '').toLowerCase();
        const targetContinent = (m.continent || '').toLowerCase();
        const sameRegion = (x) => {
          if (x.id === m.id) return false;
          const r = (x.region || '').toLowerCase();
          const c = (x.country || '').toLowerCase();
          const cc = (x.continent || '').toLowerCase();
          return (
            (targetRegion && r === targetRegion) ||
            (targetCountry && c === targetCountry) ||
            (targetContinent && cc === targetContinent && targetContinent !== "global")
          );
        };
        const others = MAPS
          .filter(x => x.id !== m.id && sameRegion(x) && x.renderable && MAP_ERA[x.id] !== targetEra)
          .sort((a, b) => (b.significance ? 1 : 0) - (a.significance ? 1 : 0))
          .slice(0, 4);
        if (!others.length) return '';
        const regionLabel = m.region || m.country || m.continent || 'this region';
        return `
        <div class="divider-ornate" style="margin: 80px 0 40px"><span class="glyph">✦ ✦ ✦</span></div>
        <div class="spread">
          <div>
            <span class="eyebrow">In another life</span>
            <h2 style="margin-top:8px">${regionLabel}, drawn in other eras</h2>
            <p class="lede" style="margin-top:14px; max-width:60ch; font-size:16px">How other cartographers mapped this place in other times. Cross-era comparisons sit at the heart of why an archive like this exists.</p>
          </div>
        </div>
        <div class="grid-cards" style="margin-top:28px">
          ${others.map(mapCard).join("")}
        </div>`;
      })()}

      ${related.length ? `
      <div class="divider-ornate" style="margin: 80px 0 40px"><span class="glyph">✦ ✦ ✦</span></div>
      <div class="spread">
        <h2>More in ${categoryDisplay(m.category)}</h2>
        <a class="btn btn-ghost" href="#/archive/${m.category}">Browse this category ${icons.arrow}</a>
      </div>
      <div class="grid-cards" style="margin-top:28px">
        ${related.slice(0,3).map(mapCard).join("")}
      </div>` : ''}
    </div>
  `;

  bindViewer(m);
  $$('[data-detail-tag]').forEach(el => el.addEventListener("click", (e) => {
    e.preventDefault();
    archiveState.tags = new Set([el.dataset.detailTag]);
    archiveState.currentCategory = ALL_CATS;
    archiveState.search = "";
    navigate("archive");
  }));
}

/* ============ Citations (Chicago / APA / MLA) ============ */
function citationAuthor(m) {
  if (m._authorIsContributor || !m.author) return "[author unknown]";
  // Try to normalize "Firstname Lastname" → "Lastname, Firstname" for Chicago/MLA.
  // If already comma-separated or includes parenthetical dates, return as-is.
  const a = m.author.split(/[,;]/)[0].trim();
  if (a.includes(",") || a.includes("(")) return a;
  const parts = a.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return a;
  const last = parts.pop();
  return `${last}, ${parts.join(" ")}`;
}
function citationYear(m) {
  if (m.depictedYear && m._yearIsModernCreation) return `${m.year} [depicting ${m.depictedYear}]`;
  return m.year || "n.d.";
}
function citationTitle(m) { return m.title || "[Untitled map]"; }
function citationSource(m) {
  const inst = m.institution || "Source institution unknown";
  return inst;
}
function citationURL(m) { return m.source_url || ''; }

function chicagoCitation(m) {
  // Author. "Title." Year. Source. URL.
  return `${citationAuthor(m)}. <em>${citationTitle(m)}</em>. ${citationYear(m)}. ${citationSource(m)}. ${citationURL(m) ? `<a class="link-underline" href="${citationURL(m)}" target="_blank" rel="noopener" style="word-break:break-all">${citationURL(m)}</a>.` : ''}`;
}
function apaCitation(m) {
  // Author. (Year). Title [Map]. Source. URL
  return `${citationAuthor(m)} (${citationYear(m)}). <em>${citationTitle(m)}</em> [Map]. ${citationSource(m)}. ${citationURL(m) ? `<a class="link-underline" href="${citationURL(m)}" target="_blank" rel="noopener" style="word-break:break-all">${citationURL(m)}</a>` : ''}`;
}
function mlaCitation(m) {
  // Author. Title. Year, Source, URL.
  return `${citationAuthor(m)}. <em>${citationTitle(m)}</em>. ${citationYear(m)}, ${citationSource(m)}${citationURL(m) ? `, <a class="link-underline" href="${citationURL(m)}" target="_blank" rel="noopener" style="word-break:break-all">${citationURL(m)}</a>` : ''}.`;
}

function renderCitations(m) {
  if (!m.id) return '';
  return `
    <details class="citations">
      <summary><span class="eyebrow">Cite this record</span> <span class="cite-hint">Chicago · APA · MLA</span></summary>
      <div class="citation-block">
        <div class="citation-row">
          <span class="meta cite-style">Chicago</span>
          <div class="cite-text" data-cite="chicago">${chicagoCitation(m)}</div>
          <button class="cite-copy" data-copy-cite="chicago" title="Copy Chicago citation">copy</button>
        </div>
        <div class="citation-row">
          <span class="meta cite-style">APA</span>
          <div class="cite-text" data-cite="apa">${apaCitation(m)}</div>
          <button class="cite-copy" data-copy-cite="apa" title="Copy APA citation">copy</button>
        </div>
        <div class="citation-row">
          <span class="meta cite-style">MLA</span>
          <div class="cite-text" data-cite="mla">${mlaCitation(m)}</div>
          <button class="cite-copy" data-copy-cite="mla" title="Copy MLA citation">copy</button>
        </div>
        <p class="cite-note">Citations are generated automatically from record metadata. For academic work, verify against the source institution's own record (the "View record at source" link above).</p>
      </div>
    </details>
  `;
}

function bindViewer(m) {
  const stage = $("#viewer-stage");
  const canvas = $("#viewer-canvas");

  // ---- Pinned annotations on the map image ----
  // User double-clicks anywhere on the viewer to drop a pin. A small panel asks for
  // a note text. The pin is saved with normalized x/y coords (0–1) so it survives
  // pan/zoom. Annotations live in Account state; logged-out users can still try
  // the interaction but won't see persistence.
  const annotationLayer = $("#annotation-layer");

  function annotationsFor(mapId) {
    const u = Account.current();
    return (u?.annotations || []).filter(a => a.mapId === mapId);
  }
  function saveAnnotations(mapId, list) {
    const u = Account.current();
    if (!u) return;
    if (!u.annotations) u.annotations = [];
    u.annotations = u.annotations.filter(a => a.mapId !== mapId).concat(list);
    Account.update({ annotations: u.annotations });
  }
  function renderAnnotations() {
    if (!annotationLayer) return;
    const anns = annotationsFor(m.id);
    annotationLayer.innerHTML = anns.map(a => `
      <button class="annotation-pin" data-ann-id="${escapeAttr(a.id)}" style="left:${a.x*100}%; top:${a.y*100}%" title="${escapeAttr(a.text)}">
        <span class="annotation-num">${anns.indexOf(a)+1}</span>
      </button>
    `).join("") + anns.map((a, i) => `
      <div class="annotation-flyout" data-ann-flyout="${a.id}" hidden style="left:${a.x*100}%; top:${a.y*100}%">
        <div class="annotation-flyout-head">Note #${i+1}</div>
        <p>${escapeHtml(a.text)}</p>
        <div class="row" style="justify-content:space-between; margin-top:6px">
          <span class="meta" style="font-size:9px">${new Date(a.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span>
          <button class="annotation-remove" data-ann-remove="${a.id}">Remove</button>
        </div>
      </div>
    `).join("");
    // Toggle flyout
    $$('[data-ann-id]').forEach(btn => btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.annId;
      $$('[data-ann-flyout]').forEach(f => { f.hidden = f.dataset.annFlyout !== id; });
    }));
    $$('[data-ann-remove]').forEach(btn => btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.annRemove;
      const list = annotationsFor(m.id).filter(a => a.id !== id);
      saveAnnotations(m.id, list);
      renderAnnotations();
    }));
  }
  // Close flyouts on outside click
  document.addEventListener("click", () => {
    $$('[data-ann-flyout]').forEach(f => f.hidden = true);
  });

  if (stage && annotationLayer) {
    // Initial render
    renderAnnotations();
    // Double-click to drop a pin
    stage.addEventListener("dblclick", (e) => {
      e.preventDefault();
      if (!Account.isSignedIn()) {
        alert("Sign in to drop pinned annotations.");
        navigate("account/signin");
        return;
      }
      // Compute click position in normalized coords relative to the stage
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      const text = prompt("Add a note for this point on the map:");
      if (text && text.trim()) {
        const list = annotationsFor(m.id);
        list.push({
          id: "ann_" + Date.now().toString(36) + Math.random().toString(36).slice(2,6),
          mapId: m.id, x, y, text: text.trim(),
          createdAt: new Date().toISOString(),
        });
        saveAnnotations(m.id, list);
        renderAnnotations();
      }
    });
  }

  // Wire citation copy buttons (works even when stage isn't present)
  $$('[data-copy-cite]').forEach(btn => btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const key = btn.dataset.copyCite;
    const el = document.querySelector(`[data-cite="${key}"]`);
    if (!el) return;
    // Strip HTML for clipboard
    const text = el.textContent.trim();
    try {
      await navigator.clipboard.writeText(text);
      const orig = btn.textContent;
      btn.textContent = "✓ copied";
      btn.classList.add("copied");
      setTimeout(() => { btn.textContent = orig; btn.classList.remove("copied"); }, 1400);
    } catch (err) {
      btn.textContent = "× failed";
      setTimeout(() => { btn.textContent = "copy"; }, 1400);
    }
  }));
  if (!stage) return;
  let z = 1, tx = 0, ty = 0, dragging = false, sx = 0, sy = 0;
  function apply() { stage.style.transform = `translate(${tx}px, ${ty}px) scale(${z})`; }
  $$('[data-zoom]').forEach(b => b.addEventListener("click", () => {
    if (b.dataset.zoom === "in") z = Math.min(z * 1.4, 6);
    if (b.dataset.zoom === "out") z = Math.max(z / 1.4, 0.5);
    if (b.dataset.zoom === "reset") { z = 1; tx = 0; ty = 0; }
    apply();
  }));
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const old = z;
    z = Math.max(0.5, Math.min(6, z * (e.deltaY > 0 ? 0.92 : 1.08)));
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    tx = cx - (cx - tx) * (z / old);
    ty = cy - (cy - ty) * (z / old);
    apply();
  }, { passive: false });
  canvas.addEventListener("mousedown", (e) => { dragging = true; sx = e.clientX - tx; sy = e.clientY - ty; canvas.classList.add("dragging"); });
  const onMove = (e) => { if (!dragging) return; tx = e.clientX - sx; ty = e.clientY - sy; apply(); };
  const onUp   = ()  => { dragging = false; canvas.classList.remove("dragging"); };
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup",   onUp);
  _viewerCleanup = () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup",   onUp);
  };

  $$('[data-action]').forEach(b => b.addEventListener("click", () => {
    const a = b.dataset.action;
    if (a === "fullscreen") openZoomModal(m);
    if (a === "compare-this") { compareState.left = m.id; navigate("compare"); }
    if (a === "save") {
      if (!Account.isSignedIn()) { alert("Sign in to save maps to your library."); navigate("account/signin"); return; }
      const nowSaved = Account.toggleSaveMap(m.id);
      $$('[data-action="save"]').forEach(btn => {
        const isPrimary = btn.classList.contains("btn-primary");
        btn.innerHTML = isPrimary ? `${icons.bookmark} ${nowSaved ? 'Saved' : 'Save to library'}` : icons.bookmark;
        btn.style.opacity = nowSaved ? '0.65' : '1';
        btn.title = nowSaved ? 'Saved' : 'Save to library';
      });
    }
    if (a === "note") {
      if (!Account.isSignedIn()) { alert("Sign in to add notes to maps."); navigate("account/signin"); return; }
      const existing = Account.getNotesFor(m.id);
      const prompt_text = existing.length
        ? `Add another note for "${shortTitle(m.title, 50)}":\n\n(You already have ${existing.length} note${existing.length===1?'':'s'} on this map.)`
        : `Add a note for "${shortTitle(m.title, 50)}":`;
      const text = prompt(prompt_text, "");
      if (text && text.trim()) {
        Account.addNote(m.id, text);
        alert("Note saved. View it in your Library.");
      }
    }
  }));
  $("#viewer-img")?.addEventListener("click", () => openZoomModal(m));
}

/* ============ Zoom Modal ============ */
function openZoomModal(m) {
  const modal = $("#zoom-modal");
  $("#zoom-title").textContent = m.title;
  $("#zoom-meta").textContent = `${m.year}${m.author ? ` · ${m.author}` : ''}${m.institution ? ` · ${m.institutionShort}` : ''}`;
  $("#zoom-source").innerHTML = m.source_url ?
    `<a class="btn btn-sm" href="${m.source_url}" target="_blank" rel="noopener">${icons.ext} View at source</a>` : '';
  const stage = $("#zoom-stage");
  stage.innerHTML = m.renderable && m.download_url ?
    `<img src="${m.download_url}" alt="${escapeAttr(m.title)}" id="zoom-img" data-rotate="${rotationFor(m)}"/>` :
    `<div class="img-fallback" style="max-width:80vmin; position:relative; width:80vmin; height:60vmin">${placeholderSVG(m)}</div>`;
  modal.classList.add("open");
  bindZoomModal();
}
function closeZoomModal() { $("#zoom-modal").classList.remove("open"); }
function bindZoomModal() {
  const stage = $("#zoom-stage");
  const img = $("#zoom-img");
  if (!img) return;
  const rot = +(img.dataset.rotate || 0);
  let z = 1, tx = 0, ty = 0, dragging = false, sx = 0, sy = 0;
  function apply() { img.style.transform = `translate(${tx}px, ${ty}px) scale(${z})${rot ? ` rotate(${rot}deg)` : ''}`; }
  apply();
  stage.onwheel = (e) => {
    e.preventDefault();
    const old = z;
    z = Math.max(0.3, Math.min(8, z * (e.deltaY > 0 ? 0.9 : 1.1)));
    const rect = stage.getBoundingClientRect();
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    tx = cx - (cx - tx) * (z / old);
    ty = cy - (cy - ty) * (z / old);
    apply();
  };
  stage.onmousedown = (e) => { dragging = true; sx = e.clientX - tx; sy = e.clientY - ty; stage.classList.add("dragging"); };
  stage.onmousemove = (e) => { if (!dragging) return; tx = e.clientX - sx; ty = e.clientY - sy; apply(); };
  stage.onmouseup = () => { dragging = false; stage.classList.remove("dragging"); };
  stage.onmouseleave = () => { dragging = false; stage.classList.remove("dragging"); };
}

/* ============ TIMELINE ============ */
const TIMELINE_PERIODS = [
  { id:"ancient", name:"Ancient civilizations", range:"before 500 BCE", blurb:"Mesopotamian clay tablets, Egyptian survey papyri, the earliest schematic representations of land and sky.", eraKey:"ancient" },
  { id:"classical", name:"Classical Antiquity", range:"500 BCE – 500 CE", blurb:"Greco-Roman geography emerges as a mathematical discipline. Ptolemy's coordinates outlast every empire that drew them.", eraKey:"classical" },
  { id:"medieval", name:"Medieval period", range:"500 – 1450", blurb:"Christian mappae mundi, Islamic geographies, Chinese maritime atlases — three traditions that rarely consult one another.", eraKey:"medieval" },
  { id:"renaissance", name:"Renaissance & Exploration", range:"1450 – 1650", blurb:"Print, gunpowder, and the caravel. European maps cease to be objects of theology and become instruments of expansion.", eraKey:"renaissance" },
  { id:"colonial", name:"Colonial empires", range:"1650 – 1830", blurb:"Cadastral surveys, treaty maps, the Mercator projection as imperial infrastructure. Borders are drawn far from the land they divide.", eraKey:"colonial" },
  { id:"industrial", name:"Industrial era", range:"1830 – 1914", blurb:"Topographic survey matures. Maps become products of mass print: railway atlases, climate classifications, weather maps.", eraKey:"industrial" },
  { id:"world-wars", name:"World Wars", range:"1914 – 1945", blurb:"Aerial photography rewrites what 'survey' means. Trench maps, propaganda maps, the first global air-route diagrams.", eraKey:"world-wars" },
  { id:"cold-war", name:"Cold War", range:"1945 – 1989", blurb:"Two-bloc cartography, the rise of satellite remote sensing, decolonization redrawing half the political map of Earth.", eraKey:"cold-war" },
  { id:"contemporary", name:"Contemporary world", range:"after 1989", blurb:"Digital cartography, OpenStreetMap, indigenous counter-mapping, climate-change visualisation. Maps are no longer rare objects.", eraKey:"contemporary" },
];

function renderTimeline() {
  // Precompute samples per era
  const periods = TIMELINE_PERIODS.map(p => {
    const inEra = MAPS.filter(m => MAP_ERA[m.id] === p.eraKey && m.renderable);
    const curatedInEra = inEra.filter(m => m.significance);
    const sample = [
      ...curatedInEra.slice(0, 4),
      ...inEra.filter(m => !m.significance).slice(0, Math.max(0, 4 - curatedInEra.length))
    ].slice(0, 4);
    return { ...p, inEra, curatedInEra, sample };
  });

  // Horizontal scrollable rail (desktop) — each era is a horizontally-aligned panel.
  // On mobile it falls back to a vertical stack via CSS @media query.
  $("#timeline-root").innerHTML = `
    <div class="timeline-rail" id="timeline-rail">
      ${periods.map((p, i) => `
        <article class="period" data-era="${p.eraKey}">
          <div class="period-marker">
            <span class="period-number">${String(i+1).padStart(2,'0')}</span>
            <div class="period-line"></div>
          </div>
          <div class="period-content">
            <span class="meta">${p.range} · ${fmt(p.inEra.length)} maps${p.curatedInEra.length ? ` · ${fmt(p.curatedInEra.length)} curated` : ''}</span>
            <h2 style="margin-top:8px">${p.name}</h2>
            <p class="lede" style="margin-top:18px">${p.blurb}</p>
            ${p.sample.length ? `
              <div class="period-thumbs">${p.sample.map(m => `
                <a class="period-thumb${m.significance ? ' period-thumb-curated' : ''}" href="#/map/${m.id}" title="${escapeAttr(m.title)}">
                  <div class="map-frame map-frame-img" style="aspect-ratio:1/1">${imageEl(m, {eager:true})}</div>
                  <span class="period-thumb-title">${shortTitle(m.title, 36)}</span>
                </a>`).join("")}
              </div>
              <div class="row" style="margin-top:18px; gap:6px; flex-wrap:wrap">
                ${p.inEra.length > 4 ? `<a class="btn btn-ghost btn-sm" href="#/archive" data-era-link="${p.eraKey}" style="padding-left:0">All ${fmt(p.inEra.length)} ${icons.arrow}</a>` : ''}
                ${p.curatedInEra.length > 4 ? `<a class="btn btn-ghost btn-sm" href="#/archive" data-era-link="${p.eraKey}" data-era-curated="1">${fmt(p.curatedInEra.length)} curated ${icons.arrow}</a>` : ''}
              </div>
            ` : `<p style="margin-top:18px; color:var(--ink-muted); font-style:italic">No maps in this period are catalogued yet.</p>`}
          </div>
        </article>
      `).join("")}
    </div>
    <div class="timeline-nav">
      <button class="icon-btn" data-tl-scroll="left" aria-label="Scroll earlier">←</button>
      <div class="timeline-dots">
        ${periods.map((p, i) => `<button class="timeline-dot" data-jump="${i}" title="${p.name}"><span></span></button>`).join("")}
      </div>
      <button class="icon-btn" data-tl-scroll="right" aria-label="Scroll later">→</button>
    </div>
  `;

  // Horizontal scroll buttons
  const rail = $("#timeline-rail");
  if (rail) {
    $$('[data-tl-scroll]').forEach(b => b.addEventListener("click", () => {
      const dx = b.dataset.tlScroll === 'right' ? rail.clientWidth * 0.8 : -rail.clientWidth * 0.8;
      rail.scrollBy({ left: dx, behavior: 'smooth' });
    }));
    $$('[data-jump]').forEach(b => b.addEventListener("click", () => {
      const i = +b.dataset.jump;
      const panel = rail.querySelectorAll('.period')[i];
      if (panel) rail.scrollTo({ left: panel.offsetLeft - 24, behavior: 'smooth' });
    }));
    // Highlight active dot as you scroll
    rail.addEventListener("scroll", () => {
      const panels = rail.querySelectorAll('.period');
      const dots = $$('.timeline-dot');
      let activeIdx = 0;
      panels.forEach((p, i) => {
        if (p.offsetLeft - rail.scrollLeft < rail.clientWidth * 0.4) activeIdx = i;
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
    });
    // Trigger initial dot highlight
    rail.dispatchEvent(new Event('scroll'));
  }
  $$('[data-era-link]').forEach(a => a.addEventListener("click", (e) => {
    e.preventDefault();
    archiveState.era = a.dataset.eraLink;
    archiveState.currentCategory = ALL_CATS;
    if (a.dataset.eraCurated) archiveState.fichaQuality = "full";
    navigate("archive");
  }));
}

/* ============ COMPARE ============ */
const compareState = {
  left: null,
  right: null,
  overlay: 50,
  mode: "side-by-side",   // "side-by-side" | "overlay"
  blend: "normal",        // for overlay mode: "normal" | "multiply" | "screen" | "difference"
  pickerOpen: null,       // "left" | "right" | null
  pickerQuery: "",
};

function compareDefaults() {
  const rich = MAPS.filter(m => m.renderable && m.description);
  if (!compareState.left) compareState.left = rich[0]?.id;
  if (!compareState.right) compareState.right = rich[Math.floor(rich.length/2)]?.id || rich[1]?.id;
}

const COMPARE_PRESETS = [
  { name:"Islamic vs European world map", left:"seed_002", right:"seed_007", note:"al-Idrisi's Tabula Rogeriana (1154) vs Mercator (1569) — south-up Islamic geography against the projection that would define the modern atlas." },
  { name:"Medieval cosmology vs Renaissance science", left:"seed_003", right:"seed_008", note:"Hereford Mappa Mundi (~1300) vs Ortelius's Theatrum (1570) — theology compared with the first modern systematic atlas." },
  { name:"First America vs Earth from space", left:"seed_001", right:"seed_023", note:"Waldseemüller (1507), the map that named America, vs the NASA Blue Marble (2002)." },
  { name:"Two ages of empire", left:"seed_036", right:"seed_032", note:"Roman Empire at 117 CE vs the British Empire in 1886 — what 1,800 years of imperial cartography looks like." },
  { name:"Borders before and after Berlin", left:"seed_034", right:"seed_033", note:"Ottoman Empire at its 1683 peak vs the Berlin Conference partition of Africa (1885) — two cartographies of imperial reach." },
];

function renderCompare() {
  compareDefaults();
  const left = MAPS.find(m => m.id === compareState.left) || MAPS[0];
  const right = MAPS.find(m => m.id === compareState.right) || MAPS[1];

  $("#compare-root").innerHTML = `
    <div class="container-wide">
      <div class="compare-header">
        <div>
          <span class="eyebrow">Compare</span>
          <h1 style="margin-top:12px">Two maps, side by side</h1>
          <p class="lede" style="max-width:62ch; margin-top:18px">
            How the same place was drawn in different centuries — and what the differences reveal about who was drawing, and for whom.
          </p>
        </div>
      </div>

      <div class="compare-presets">
        <span class="eyebrow">Suggested pairings</span>
        <div class="compare-preset-list">
          ${COMPARE_PRESETS.map((p, i) => `
            <button class="compare-preset-card" data-preset="${i}" title="${escapeAttr(p.note)}">
              <span class="preset-name">${p.name}</span>
              <span class="preset-arrow">→</span>
            </button>`).join("")}
        </div>
      </div>

      <div class="compare-mode-tabs">
        <button class="compare-mode-tab ${compareState.mode==='side-by-side' ? 'active' : ''}" data-mode="side-by-side">Side by side</button>
        <button class="compare-mode-tab ${compareState.mode==='overlay' ? 'active' : ''}" data-mode="overlay">Overlay</button>
      </div>

      <div class="compare-pickers">
        ${mapPicker("left", left)}
        ${mapPicker("right", right)}
      </div>

      ${compareState.mode === 'overlay' ? `
        <div class="compare-overlay-controls">
          <label class="filter-group" style="flex:1">
            <span class="meta">Right map opacity over left — drag to blend</span>
            <div class="row" style="gap:14px; margin-top:6px">
              <span class="meta" style="width:50px">left</span>
              <input type="range" min="0" max="100" value="${compareState.overlay}" id="compare-overlay" class="slider" style="flex:1"/>
              <span class="meta" style="width:50px; text-align:right">right</span>
              <span class="meta" id="compare-overlay-pct" style="font-family:var(--mono); color:var(--gold); min-width:44px; text-align:right">${compareState.overlay}%</span>
            </div>
          </label>
          <label class="filter-group" style="min-width:180px">
            <span class="meta">Blend mode</span>
            <select class="select" id="compare-blend">
              <option value="normal" ${compareState.blend==='normal'?'selected':''}>Normal (alpha)</option>
              <option value="multiply" ${compareState.blend==='multiply'?'selected':''}>Multiply (darken)</option>
              <option value="screen" ${compareState.blend==='screen'?'selected':''}>Screen (lighten)</option>
              <option value="difference" ${compareState.blend==='difference'?'selected':''}>Difference</option>
            </select>
          </label>
        </div>
      ` : ''}

      ${compareState.mode === 'side-by-side' ? `
        <div class="compare-syncbar">
          <span class="meta">Synced zoom &amp; pan</span>
          <button class="icon-btn" data-syncpan="out" title="Zoom out (both maps)">−</button>
          <button class="icon-btn" data-syncpan="in" title="Zoom in (both maps)">+</button>
          <button class="icon-btn" data-syncpan="reset" title="Reset both">↺</button>
          <span class="meta meta-faint" style="margin-left:6px">Scroll on either map zooms both · drag to pan both</span>
        </div>
        <div class="compare-pair">
          ${sidePanel(left, 'left')}
          ${sidePanel(right, 'right')}
        </div>
      ` : `
        <div class="compare-overlay-stage">
          ${overlayPanel(left, right)}
        </div>
      `}
    </div>
  `;

  bindCompareControls();
}

function mapPicker(side, current) {
  return `
    <div class="map-picker" data-side="${side}">
      <span class="meta map-picker-label">${side === 'left' ? 'Left map' : 'Right map'}</span>
      <button class="map-picker-trigger" data-trigger="${side}">
        <div class="map-picker-current-img map-frame map-frame-img">${imageEl(current, {eager:true})}</div>
        <div class="map-picker-current-body">
          <span class="map-picker-current-meta">${current.year}${current.author ? ' · ' + shortText(current.author, 30) : ''}</span>
          <span class="map-picker-current-title">${shortTitle(current.title, 70)}</span>
          <span class="map-picker-current-cat">${categoryDisplay(current.category)}</span>
        </div>
        <span class="map-picker-chevron">▾</span>
      </button>
      <div class="map-picker-dropdown" data-dropdown="${side}" hidden>
        <div class="map-picker-search-bar">
          <svg class="i" viewBox="0 0 24 24" style="color:var(--ink-muted)"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="1.4" fill="none"/></svg>
          <input class="map-picker-search-input" data-side="${side}" placeholder="Search by title, year, region, cartographer, category, tag…" autocomplete="off"/>
        </div>
        <div class="map-picker-results" data-results="${side}"></div>
      </div>
    </div>`;
}

function renderPickerResults(side) {
  const q = compareState.pickerQuery.toLowerCase();
  const otherId = side === 'left' ? compareState.right : compareState.left;
  let list = MAPS.filter(m => m.renderable && m.id !== otherId);
  if (q) {
    list = list.filter(m =>
      (m.title + " " + (m.original_title||"") + " " + (m.year||"") + " " + (m.region||"") + " " +
       (m.country||"") + " " + (m.author||"") + " " + (m.description||"") + " " +
       (m.tags||[]).join(" ") + " " + categoryDisplay(m.category) + " " + (m.century||"")).toLowerCase().includes(q)
    );
  }
  const view = list.slice(0, 50);
  const totalLabel = q ? `${fmt(list.length)} match${list.length===1?"":"es"}` : `${fmt(MAPS.length)} maps`;
  const html = view.length ? view.map(m => `
    <button class="map-picker-row" data-pick="${m.id}" data-side="${side}">
      <div class="map-picker-row-thumb map-frame map-frame-img">${imageEl(m, {eager:true})}</div>
      <div style="flex:1; min-width:0">
        <div class="map-picker-row-title">${shortTitle(m.title, 70)}</div>
        <div class="map-picker-row-meta">${m.year} · ${categoryDisplay(m.category)}${m.region ? ' · ' + shortText(m.region, 30) : ''}${m.author ? ' · ' + shortText(m.author, 30) : ''}</div>
      </div>
    </button>
  `).join("") : `<p style="padding:18px; color:var(--ink-muted); font-style:italic; font-family:var(--serif-body)">No maps match "${compareState.pickerQuery}".</p>`;
  const resultsEl = document.querySelector(`[data-results="${side}"]`);
  if (resultsEl) resultsEl.innerHTML = `
    <div class="map-picker-results-meta meta">${totalLabel}${view.length < list.length ? ` · showing first ${view.length}` : ''}</div>
    ${html}
  `;
  // wire row picks
  document.querySelectorAll(`[data-pick][data-side="${side}"]`).forEach(b => b.addEventListener("click", () => {
    if (side === 'left') compareState.left = b.dataset.pick;
    else compareState.right = b.dataset.pick;
    closePicker();
    renderCompare();
  }));
}

function openPicker(side) {
  compareState.pickerOpen = side;
  compareState.pickerQuery = "";
  document.querySelectorAll('.map-picker-dropdown').forEach(d => d.hidden = d.dataset.dropdown !== side);
  document.querySelectorAll('.map-picker').forEach(p => p.classList.toggle('open', p.dataset.side === side));
  renderPickerResults(side);
  setTimeout(() => {
    const input = document.querySelector(`.map-picker-search-input[data-side="${side}"]`);
    if (input) { input.value = ""; input.focus(); }
    document.addEventListener("mousedown", outsideClickHandler);
  }, 30);
}
function closePicker() {
  compareState.pickerOpen = null;
  document.querySelectorAll('.map-picker-dropdown').forEach(d => d.hidden = true);
  document.querySelectorAll('.map-picker').forEach(p => p.classList.remove('open'));
  document.removeEventListener("mousedown", outsideClickHandler);
}
function outsideClickHandler(e) {
  if (!e.target.closest('.map-picker')) closePicker();
}

function sidePanel(m, side) {
  return `
    <div class="compare-panel" data-side="${side}">
      <div class="map-frame map-frame-img compare-syncpan" data-pan-target="${side}" style="aspect-ratio:1.2/1">
        <div class="compare-syncpan-inner" data-pan-inner="${side}">
          ${imageEl(m, {eager: true})}
        </div>
        <div class="frame-label">${m.year}${m.region ? ` · ${m.region.split(",")[0]}` : ''}</div>
      </div>
      <div style="padding:18px 4px 0">
        <span class="meta">${m.year}${m.author ? ` · ${m.author.split("/")[0]}` : ''}</span>
        <h3 style="margin-top:6px"><a href="#/map/${m.id}" style="color:inherit" class="link-underline-hover">${shortTitle(m.title, 70)}</a></h3>
        ${m.description ? `<p style="margin-top:10px; color:var(--ink-muted); font-size:13px; line-height:1.5">${shortText(m.description, 160)}</p>` : ''}
      </div>
    </div>`;
}

function overlayPanel(left, right) {
  return `
    <div class="compare-panel">
      <div class="map-frame map-frame-img overlay-stage" style="aspect-ratio:1.4/1">
        <!-- BASE: left map fully opaque -->
        <div class="overlay-layer overlay-base">${imageEl(left, {eager:true})}</div>
        <!-- TOP: right map at variable opacity -->
        <div class="overlay-layer overlay-top" id="overlay-top" style="opacity:${compareState.overlay/100}; mix-blend-mode:${cssBlend(compareState.blend)}">${imageEl(right, {eager:true})}</div>
        <div class="frame-label">${left.year} ↔ ${right.year}</div>
      </div>
      <div class="compare-overlay-legend">
        <div class="overlay-legend-item">
          <span class="dot-square" style="background: var(--bg-card); border:1px solid var(--gold)"></span>
          <span class="meta">Base · ${shortTitle(left.title, 50)}</span>
        </div>
        <div class="overlay-legend-item">
          <span class="dot-square" style="background: var(--gold); opacity: ${0.3 + compareState.overlay/200}"></span>
          <span class="meta">Top · ${shortTitle(right.title, 50)} · ${compareState.overlay}% opacity</span>
        </div>
      </div>
    </div>`;
}
function cssBlend(b) { return b === 'normal' ? 'normal' : b; }

function bindCompareControls() {
  // Mode tabs
  document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener("click", () => {
    compareState.mode = b.dataset.mode;
    renderCompare();
  }));
  // Preset pairings
  document.querySelectorAll('[data-preset]').forEach(b => b.addEventListener("click", () => {
    const p = COMPARE_PRESETS[+b.dataset.preset];
    if (!p) return;
    compareState.left = p.left;
    compareState.right = p.right;
    renderCompare();
  }));

  // Synced zoom/pan for side-by-side mode — both maps share one transform state.
  if (compareState.mode === 'side-by-side') {
    bindCompareSyncPan();
  }

  // Picker triggers
  document.querySelectorAll('[data-trigger]').forEach(b => b.addEventListener("click", (e) => {
    e.stopPropagation();
    const side = b.dataset.trigger;
    if (compareState.pickerOpen === side) closePicker();
    else openPicker(side);
  }));

  // Picker search inputs
  document.querySelectorAll('.map-picker-search-input').forEach(inp => {
    inp.addEventListener("input", (e) => {
      compareState.pickerQuery = e.target.value;
      renderPickerResults(e.target.dataset.side);
    });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closePicker();
      if (e.key === "Enter") {
        const firstResult = document.querySelector(`[data-pick][data-side="${e.target.dataset.side}"]`);
        if (firstResult) firstResult.click();
      }
    });
  });

  // Overlay opacity slider — directly update DOM for smoothness
  const overlayEl = document.getElementById("overlay-top");
  document.getElementById("compare-overlay")?.addEventListener("input", e => {
    compareState.overlay = +e.target.value;
    const top = document.getElementById("overlay-top");
    if (top) top.style.opacity = compareState.overlay / 100;
    document.getElementById("compare-overlay-pct").textContent = compareState.overlay + "%";
    // update legend opacity too without full re-render
    const legendDot = document.querySelectorAll('.overlay-legend-item .dot-square')[1];
    if (legendDot) legendDot.style.opacity = 0.3 + compareState.overlay/200;
  });

  // Blend mode
  document.getElementById("compare-blend")?.addEventListener("change", e => {
    compareState.blend = e.target.value;
    const top = document.getElementById("overlay-top");
    if (top) top.style.mixBlendMode = cssBlend(compareState.blend);
  });
}

// Synced zoom/pan across both Compare panels (side-by-side mode).
// Both <.compare-syncpan-inner> elements receive the same transform.
function bindCompareSyncPan() {
  const panels = $$('.compare-syncpan-inner');
  if (panels.length < 2) return;
  const wraps = $$('.compare-syncpan');
  let z = 1, tx = 0, ty = 0;
  function apply() {
    panels.forEach(p => { p.style.transform = `translate(${tx}px, ${ty}px) scale(${z})`; });
  }
  apply();
  // Wheel zoom on either panel
  wraps.forEach(wrap => {
    wrap.addEventListener("wheel", (e) => {
      e.preventDefault();
      const old = z;
      z = Math.max(0.3, Math.min(6, z * (e.deltaY > 0 ? 0.9 : 1.1)));
      const rect = wrap.getBoundingClientRect();
      const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
      tx = cx - (cx - tx) * (z / old);
      ty = cy - (cy - ty) * (z / old);
      apply();
    }, { passive: false });
  });
  // Drag-to-pan on either panel
  let dragging = false, sx = 0, sy = 0;
  wraps.forEach(wrap => {
    wrap.style.cursor = 'grab';
    wrap.addEventListener("mousedown", (e) => {
      dragging = true; sx = e.clientX - tx; sy = e.clientY - ty;
      wrap.style.cursor = 'grabbing';
    });
  });
  function onMove(e) { if (!dragging) return; tx = e.clientX - sx; ty = e.clientY - sy; apply(); }
  function onUp() { dragging = false; wraps.forEach(w => w.style.cursor = 'grab'); }
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
  // Toolbar buttons
  $$('[data-syncpan]').forEach(b => b.addEventListener("click", () => {
    const action = b.dataset.syncpan;
    if (action === 'in')  z = Math.min(z * 1.4, 6);
    if (action === 'out') z = Math.max(z / 1.4, 0.3);
    if (action === 'reset') { z = 1; tx = 0; ty = 0; }
    apply();
  }));
  // Register cleanup so renderRoute can drop the window listeners when leaving Compare
  _viewerCleanup = () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
  };
}

function overlapRegion(a, b) {
  const A = (a.region||"").toLowerCase(), B = (b.region||"").toLowerCase();
  if (A === B && A) return A;
  if (A.includes("world") || B.includes("world")) return "the world";
  return "this region";
}
function audienceFor(m) {
  const t = (categoryDisplay(m.category)||"").toLowerCase();
  if (t.includes("naut") || t.includes("explor")) return "for navigators";
  if (t.includes("empir") || t.includes("colonial")) return "for imperial administrators";
  if (t.includes("climate")) return "for scientists";
  if (t.includes("topograph") || t.includes("geolog")) return "for engineers and surveyors";
  if (t.includes("indigenous")) return "for communities reclaiming their territory";
  if (t.includes("urban")) return "for the court and the citizenry";
  if (t.includes("artistic")) return "for the imagination";
  return "for scholars and the curious";
}

/* ============ COLLECTIONS ============ */
function renderCollections() {
  // Use the 11 collection definitions = different cuts of the archive
  const COLLECTION_DEFS = [
    { cat: "07_Empires_and_Borders", title:"Maps of Empire", essay:"From the Tabula Peutingeriana to the imperial-red atlases of 1886, this collection traces cartography's long entanglement with conquest — and the visual conventions empires used to make extraction look like geography." },
    { cat: "03_Medieval_Maps", title:"The World Before Modern Borders", essay:"What did the world look like when nation-states were not the default unit? Medieval mappae mundi, Islamic geographies, and pre-Westphalian European maps imagine territory in other ways entirely." },
    { cat: "09_Climate_Maps", title:"Climate Through Cartography", essay:"Köppen's classification, isotherm charts, satellite thermography. A history of how scientists learned to draw what cannot be seen." },
    { cat: "06_Colonial_Maps", title:"Maps and Colonialism", essay:"The colonial cadastre is one of the most consequential cartographic objects ever made — a paper instrument for dispossession that outlived the empires that drew it." },
    { cat: "12_Nautical_Maps", title:"Charts of the Open Sea", essay:"Portolan charts, nautical surveys, container-shipping flow maps. The world drawn as a network of coasts, hazards, and exchange." },
    { cat: "10_Topographic_Maps", title:"Topography and War", essay:"The trench map, the bombing-run map, the contour survey of a contested ridge. Topography is rarely a peaceful science." },
    { cat: "14_Indigenous_Cartographies", title:"Indigenous Ways of Mapping Space", essay:"Songlines, wampum belts, Mexica land registers, modern counter-mapping projects — cartographic traditions that the colonial archive has long misunderstood." },
    { cat: "15_Artistic_and_Imaginary_Maps", title:"Artistic and Imaginary Maps", essay:"Maps of nowhere, maps of fictional worlds, maps as paintings. A reminder that the visual conventions of cartography are persuasive even when the territory is invented." },
    { cat: "13_Urban_Maps", title:"The Cities of the World", essay:"Plans, panoramas, and bird's-eye views — how cities have drawn themselves across centuries, and how those drawings shaped what was built next." },
    { cat: "01_World_Maps", title:"The World as a Whole", essay:"Every attempt to draw the entire planet is also an attempt to argue for one way of looking at it. The history of world maps is a history of those arguments." },
    { cat: "04_Renaissance_Maps", title:"The Renaissance Atlas", essay:"Print, perspective, and the rediscovery of Ptolemy. A century when European cartography reorganised itself around mathematics — and made errors at scale." },
  ];
  $("#collections-root").innerHTML = COLLECTION_DEFS.map(c => {
    const list = MAPS_BY_CATEGORY[c.cat] || [];
    const cover = list.find(m => m.renderable) || list[0];
    return `
    <article class="collection-feature">
      <a class="map-frame map-frame-img" style="aspect-ratio: 5/3; display:block" href="#/archive/${c.cat}">${cover ? imageEl(cover) : ''}</a>
      <div class="collection-feature-body">
        <div class="meta-row">
          <span class="meta">${fmt(list.length)} maps</span><span class="dot"></span>
          <span class="meta">Curated essay</span>
        </div>
        <h2 style="margin-top:14px">${c.title}</h2>
        <p style="margin-top:18px; color:var(--ink-dim); font-size:17px; line-height:1.65">${c.essay}</p>
        <a class="btn btn-ghost" style="margin-top:22px; padding-left:0" href="#/archive/${c.cat}">Open collection ${icons.arrow}</a>
      </div>
    </article>
  `;
  }).join("");
}

/* ============ LEARN ============ */
const ARTICLES = [
  { slug:"old-maps-not-inaccurate", title:"Why old maps are not just inaccurate versions of modern maps", status:"Full article", topic:"Foundations", style:"medieval", excerpt:"Treating Ptolemy as a failed Google Maps is the surest way to misread him. Old maps were answering different questions — and often answering them well." },
  { slug:"maps-political-power", title:"How maps create political power", status:"Draft outline", topic:"Power", style:"imperial", excerpt:"A line on a map is rarely just descriptive. From the Treaty of Tordesillas onward, drawn boundaries have produced the very territories they claim to record." },
  { slug:"empires-used-maps", title:"How empires used maps", status:"Draft outline", topic:"Empire", style:"colonial", excerpt:"Cadastral surveys, treaty atlases, railway concession maps. The infrastructure of empire was, in large part, made of paper." },
  { slug:"climate-maps-science", title:"How climate maps changed science", status:"Draft outline", topic:"Science", style:"climate", excerpt:"Köppen's vegetation-derived climate classes were a quiet revolution: a way to make the atmosphere legible by treating plants as instruments." },
  { slug:"topographic-history", title:"The history of topographic maps", status:"Draft outline", topic:"Method", style:"topo", excerpt:"Triangulation, plane-tabling, aerial photography, lidar. Topography is a story of measuring devices, not just of mountains." },
  { slug:"artistic-imagined", title:"How artistic maps represent imagined worlds", status:"Draft outline", topic:"Imagination", style:"artistic", excerpt:"The compass rose, the scale bar, the frame — cartographic conventions are persuasive even when the territory is wholly invented." },
  { slug:"silences-colonial-map", title:"Reading the silences in a colonial map", status:"Draft outline", topic:"Critique", style:"colonial", excerpt:"What a map omits is often a clearer political statement than what it includes. A short guide to reading the gaps." },
  { slug:"indigenous-counter-mapping", title:"Indigenous counter-mapping in the 21st century", status:"Draft outline", topic:"Practice", style:"indigenous", excerpt:"How communities are using GIS, GPS, and oral history to remap territories that the colonial archive has long misrepresented." },
];

// Full text for articles marked status:"Full article".
const ARTICLE_BODIES = {
"old-maps-not-inaccurate": `
<p class="lede" style="margin-bottom:32px">There is a familiar way of looking at old maps: you point at the misshapen coastlines, the missing continents, the mythological creatures in the margins, and you remark, with some condescension, on how little the makers knew. It is a tempting reading, and it has the virtue of being easy. It is also wrong.</p>

<h2>The wrong yardstick</h2>
<p>To call a 12th-century world map "inaccurate" is to assume the cartographer was attempting modern accuracy and failing at it. But that is almost never what they were doing. The Hereford Mappa Mundi, made around 1300 and now housed in Hereford Cathedral, places Jerusalem at the centre of the world, oriented with east at the top, and populates Africa with monstrous races copied from Pliny the Elder. Read as a road atlas, it is hopeless. Read as a visual encyclopedia of medieval Christian cosmology, it is one of the most ambitious objects of its age.</p>

<p>The Hereford map's makers had access to portolan charts that gave them better Mediterranean coastlines. They chose not to use them. The point of their map was not to navigate space but to argue a moral and theological order: salvation history at the centre, the known continents around it, Eden at the top, the world's monsters at the edges. This is not failed cartography. It is a different cartographic project entirely.</p>

<h2>Different questions, different maps</h2>
<p>The same logic applies to most pre-modern maps. The Tabula Peutingeriana — a 22-foot scroll showing the Roman road network — compresses north-to-south so dramatically that the Mediterranean appears as a thin channel. Modern viewers wince. But the map's purpose was to plan a journey along the cursus publicus, the imperial postal system, where the relevant question was not "what is the shape of Italy?" but "how many days from Aquileia to Antioch?". The shape was beside the point. The map was a logistics document, optimised for the question its users actually had.</p>

<p>al-Idrisi's Tabula Rogeriana, made for Roger II of Sicily in 1154, places south at the top — a convention drawn from Islamic geographic tradition that disorients modern readers but corresponded to no cartographic failure on al-Idrisi's part. His Mediterranean is remarkably accurate. His Indian Ocean is open to the east, fifty years before Marco Polo travelled and three centuries before Vasco da Gama proved it. Read as a navigation chart, it is unusable. Read as a synthesis of the geographic knowledge available to a 12th-century Mediterranean polymath, it surpasses anything European cartography would produce for the next three centuries.</p>

<h2>Accuracy is a constructed category</h2>
<p>Even "modern" maps are accurate only along the dimensions they choose to optimise. The Mercator projection, designed in 1569 for marine navigation, renders compass bearings as straight lines — a brilliant solution to the sailor's problem of plotting a constant course. As a side-effect, it inflates polar latitudes dramatically. Greenland appears the size of Africa. This is not Mercator failing at world geography; it is Mercator solving the sailor's problem and accepting the trade-off. It would be like criticising a subway map for not preserving the distances between stations.</p>

<p>What modern viewers call "accuracy" is usually a specific compromise: the WGS84 datum, a particular projection (often Mercator-derived), satellite-derived coordinates, decimal-degree grids. These are choices. They were made for navigation, for surveying, for state administration. They privilege some uses — geolocation, military targeting, infrastructure planning — over others. A map of indigenous territories, drawn by indigenous cartographers, might privilege oral tradition, ancestral routes, ecological zones; the result might look "inaccurate" by GIS standards while being more accurate to the question being asked.</p>

<h2>How to read an old map well</h2>
<p>If you find yourself looking at a Ptolemaic world map, or a medieval mappa mundi, or a portolan chart, here are four questions worth holding:</p>

<ul style="line-height:1.7; padding-left:24px; margin-top:14px">
  <li><strong>What question is this map trying to answer?</strong> "Where is Eden?" is a perfectly serious question for a 14th-century reader. "How many days to Antioch?" is a logistics question. "Where shall I land my ship?" is a sailor's question. Each demands a different map.</li>
  <li><strong>What conventions does it use?</strong> South-up, east-up, T-O frames, rhumb lines, hachures, contours, isolines. Each is a decision, and each was made for a reason. Knowing the conventions of an era helps you stop reading the map as a failed modern artefact.</li>
  <li><strong>What does it leave out?</strong> Silences in a map are rarely accidents. The interior of Africa in a 17th-century portolan is blank because Genoese sailors had no reason to plot it; the indigenous polities of North America are absent from a 1763 colonial map because including them would have undermined the legal claim the map was making.</li>
  <li><strong>Who made it, for whom?</strong> A merchant's map, a sovereign's map, a missionary's map, a navigator's map, and a scholar's map will all be different objects. The makers and the audience are encoded in every choice the map makes.</li>
</ul>

<h2>The harder reading</h2>
<p>None of this is to romanticise old maps. Many of them encode brutal politics — colonial dispossession, religious hierarchy, racial hierarchy, the erasure of pre-existing societies. Reading them generously does not mean accepting their claims. It means refusing the easy gesture of treating them as failed modern maps, and instead reading them as the arguments they actually are: arguments about what the world is, what matters in it, and whose questions get to count as questions.</p>

<p>The most useful word here may be the simplest one: <em>map</em> comes from the Latin <em>mappa</em>, meaning a cloth or a napkin. There is nothing in the word that demands accuracy of any kind. A map is a piece of cloth on which someone has drawn some marks. Those marks make a claim. The historian's job is to read the claim.</p>
`,
};

function renderLearn() {
  $("#learn-root").innerHTML = ARTICLES.map((a, i) => {
    const isFull = ARTICLE_BODIES[a.slug];
    const cardOpen = isFull ? `<a class="article-card article-card-link" href="#/article/${a.slug}">` : `<div class="article-card">`;
    const cardClose = isFull ? `</a>` : `</div>`;
    return `
    ${cardOpen}
      <div class="map-frame" style="aspect-ratio: 4/3">${window.mapSVG(a.style, a.title.length + i)}</div>
      <div class="article-body">
        <div class="meta-row">
          <span class="meta">${a.topic}</span><span class="dot"></span>
          <span class="meta" style="color:${isFull ? 'var(--gold)' : 'var(--ink-faint)'}">${a.status}</span>
        </div>
        <h3 style="margin-top:12px">${a.title}</h3>
        <p style="margin-top:14px; color:var(--ink-dim)">${a.excerpt}</p>
        <span class="meta" style="margin-top:18px; display:inline-block; color:${isFull ? 'var(--gold)' : 'var(--ink-faint)'}; font-style:italic">${isFull ? 'Read article →' : 'Full article forthcoming'}</span>
      </div>
    ${cardClose}`;
  }).join("");
}

/* ============ ARTICLE (single Learn article reader) ============ */
function renderArticle(slug) {
  const root = $("#article-content");
  if (!root) return;
  const article = ARTICLES.find(a => a.slug === slug);
  const body = ARTICLE_BODIES[slug];
  if (article && body) {
    setPageMeta(`${article.title} — Mappa Mundi`, article.excerpt.slice(0, 200), "article/" + slug);
  }
  if (!article || !body) {
    root.innerHTML = `
      <div class="container" style="padding: 96px 0; max-width:720px; text-align:center">
        <span class="eyebrow" style="color:var(--terracotta)">404 · Article not found</span>
        <h1 style="margin-top:18px">No article matches <code style="font-family:var(--mono); font-size:0.6em; color:var(--ink-muted)">${escapeAttr(slug || '(empty)')}</code>.</h1>
        <p class="lede" style="margin-top:24px">It may be a draft outline still — only some articles have full bodies.</p>
        <a class="btn btn-primary" href="#/learn" style="margin-top:28px">Back to all articles</a>
      </div>`;
    return;
  }
  root.innerHTML = `
    <div class="container article-reader">
      <a href="#/learn" class="meta" style="display:inline-block; margin-top:48px; color:var(--ink-muted)">← All articles</a>
      <header class="article-reader-header">
        <span class="eyebrow">${article.topic}</span>
        <h1 style="margin-top:14px">${article.title}</h1>
      </header>
      <div class="article-reader-body">
        ${body}
      </div>
      <div class="divider-ornate" style="margin: 64px 0 32px"><span class="glyph">✦ ✦ ✦</span></div>
      <div style="text-align:center">
        <a class="btn btn-ghost" href="#/learn">← Back to all articles</a>
      </div>
    </div>
  `;
}

/* ============ ATLAS — meta-map of where the archive's maps depict ============ */
// Very simplified continent outlines (Robinson-ish projection feel, kept abstract).
// Each path is a polygon in viewBox 1000x500 (equirectangular-ish, 2:1).
const ATLAS_CONTINENTS = `
  <!-- Eurasia -->
  <path d="M450 130 L560 110 L640 100 L740 110 L820 130 L880 160 L920 200 L900 240 L850 250 L780 240 L720 250 L640 260 L580 250 L520 240 L470 220 L440 190 Z" fill="#3a2d1d" opacity="0.55" stroke="#8a6f3e" stroke-width="0.5"/>
  <!-- Africa -->
  <path d="M490 230 L560 240 L600 270 L590 330 L560 380 L520 410 L490 400 L470 360 L460 310 L470 270 Z" fill="#3a2d1d" opacity="0.55" stroke="#8a6f3e" stroke-width="0.5"/>
  <!-- North America -->
  <path d="M150 130 L230 115 L290 130 L320 170 L310 220 L260 230 L210 220 L170 200 L140 170 Z" fill="#3a2d1d" opacity="0.55" stroke="#8a6f3e" stroke-width="0.5"/>
  <!-- Central America / Caribbean -->
  <path d="M240 230 L290 240 L310 260 L290 280 L260 280 L240 260 Z" fill="#3a2d1d" opacity="0.55" stroke="#8a6f3e" stroke-width="0.5"/>
  <!-- South America -->
  <path d="M280 290 L320 290 L340 330 L335 380 L310 420 L290 430 L270 410 L260 360 L270 320 Z" fill="#3a2d1d" opacity="0.55" stroke="#8a6f3e" stroke-width="0.5"/>
  <!-- Australia -->
  <path d="M820 340 L880 335 L900 360 L880 380 L830 380 L810 360 Z" fill="#3a2d1d" opacity="0.55" stroke="#8a6f3e" stroke-width="0.5"/>
  <!-- Antarctica (strip at bottom) -->
  <path d="M50 470 L950 470 L950 495 L50 495 Z" fill="#3a2d1d" opacity="0.3" stroke="#8a6f3e" stroke-width="0.5"/>
`;

const atlasState = {
  filterCurated: false,
  filterEra: "all",
};

function project(lat, lng, w = 1000, h = 500) {
  // Equirectangular projection
  const x = (lng + 180) / 360 * w;
  const y = (90 - lat) / 180 * h;
  return [x, y];
}

function renderAtlas() {
  const root = $("#atlas-content");
  if (!root) return;

  let plotted = MAPS.filter(m => m._coords);
  if (atlasState.filterCurated) plotted = plotted.filter(m => m.significance);
  if (atlasState.filterEra !== "all") plotted = plotted.filter(m => MAP_ERA[m.id] === atlasState.filterEra);

  // Group near-duplicate coordinates for clustering
  const buckets = {};
  plotted.forEach(m => {
    const [lat, lng] = m._coords;
    const k = `${Math.round(lat*2)/2}_${Math.round(lng*2)/2}`;
    if (!buckets[k]) buckets[k] = { lat, lng, maps: [] };
    buckets[k].maps.push(m);
  });
  const groups = Object.values(buckets);

  const total = MAPS.filter(m => m._coords).length;
  const undated = MAPS.length - total;

  root.innerHTML = `
    <div class="container-wide">
      <div style="padding: 56px 0 24px; max-width: 760px">
        <span class="eyebrow">Atlas</span>
        <h1 style="margin-top:18px">The archive as geography.</h1>
        <p class="lede" style="margin-top:18px">
          ${fmt(total)} of the archive's ${fmt(MAPS.length)} maps have an inferred geographic centroid — derived from their <em>region</em>, <em>country</em>, or title. World maps and the ${fmt(undated)} entries without a clear region are not pinned here.
          Centroids are approximate; this view is for navigation, not measurement.
        </p>
      </div>

      <div class="atlas-controls">
        <label class="toggle-row">
          <input type="checkbox" id="atlas-curated" ${atlasState.filterCurated ? 'checked' : ''}/>
          <span>Only curated fichas</span>
        </label>
        <select id="atlas-era" class="select">
          <option value="all">All eras</option>
          ${ERAS.map(e => `<option value="${e.key}" ${atlasState.filterEra === e.key ? 'selected' : ''}>${e.label}</option>`).join("")}
        </select>
        <span class="meta atlas-count">${fmt(plotted.length)} maps shown</span>
      </div>

      <div class="atlas-stage">
        <svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="atlas-svg">
          <!-- graticule -->
          <g stroke="#3a2d1d" stroke-width="0.5" fill="none" opacity="0.4">
            ${[-60,-30,0,30,60].map(lat => `<line x1="0" y1="${project(lat,0)[1]}" x2="1000" y2="${project(lat,0)[1]}"/>`).join("")}
            ${[-150,-120,-90,-60,-30,0,30,60,90,120,150].map(lng => `<line x1="${project(0,lng)[0]}" y1="0" x2="${project(0,lng)[0]}" y2="500"/>`).join("")}
          </g>
          ${ATLAS_CONTINENTS}
          <!-- map pins -->
          <g class="atlas-pins">
            ${groups.map(g => {
              const [x, y] = project(g.lat, g.lng);
              const curated = g.maps.some(m => m.significance);
              const r = Math.min(12, 3 + Math.log2(g.maps.length + 1) * 2);
              const cls = curated ? 'pin-curated' : 'pin';
              const labelMap = g.maps.find(m => m.significance) || g.maps[0];
              return `<g class="atlas-pin-group" data-pin="${labelMap.id}" data-count="${g.maps.length}" data-coords="${g.lat},${g.lng}">
                <circle cx="${x}" cy="${y}" r="${r+2}" class="pin-hit"/>
                <circle cx="${x}" cy="${y}" r="${r}" class="${cls}"/>
                ${g.maps.length > 1 ? `<text x="${x}" y="${y+3}" class="pin-count">${g.maps.length}</text>` : ''}
              </g>`;
            }).join("")}
          </g>
        </svg>
        <div id="atlas-tooltip" class="atlas-tooltip" hidden></div>
      </div>

      <p class="meta" style="margin-top:18px; text-transform:none; letter-spacing:0; font-family:var(--serif-body); font-size:13px; color:var(--ink-muted); font-style:italic">
        Gold pins = include at least one curated ficha. Larger pins = more maps at that location. Click a pin to open its first map; hover to see the count.
      </p>
    </div>
  `;

  // Wire controls
  $("#atlas-curated")?.addEventListener("change", (e) => { atlasState.filterCurated = e.target.checked; renderAtlas(); });
  $("#atlas-era")?.addEventListener("change", (e) => { atlasState.filterEra = e.target.value; renderAtlas(); });

  // Wire pins (hover for tooltip, click for navigation)
  const tooltip = $("#atlas-tooltip");
  $$('.atlas-pin-group').forEach(pin => {
    const id = pin.dataset.pin;
    const count = +pin.dataset.count;
    const coords = pin.dataset.coords;
    pin.addEventListener("mouseenter", (e) => {
      const m = MAPS.find(x => x.id === id);
      if (!m) return;
      tooltip.innerHTML = `
        <div class="atlas-tooltip-title">${shortTitle(m.title, 60)}${m.significance ? ' <span class="curated-mark">★</span>' : ''}</div>
        <div class="atlas-tooltip-meta">${m.year} · ${categoryDisplay(m.category)}</div>
        ${count > 1 ? `<div class="atlas-tooltip-other">+ ${count-1} more at this location</div>` : ''}
      `;
      tooltip.hidden = false;
    });
    pin.addEventListener("mousemove", (e) => {
      tooltip.style.left = (e.clientX + 14) + "px";
      tooltip.style.top  = (e.clientY + 14) + "px";
    });
    pin.addEventListener("mouseleave", () => { tooltip.hidden = true; });
    pin.addEventListener("click", () => navigate("map/" + id));
  });
}

/* ============ GLOSSARY ============ */
const GLOSSARY = [
  { term:"Mappa mundi", def:"Latin for 'map of the world'. By convention refers to medieval European world maps that placed Jerusalem at the centre and combined geography with theology, classical legend, and cosmology. Often east-up.", examples:["seed_003","seed_004","seed_026"] },
  { term:"T-O map", def:"A medieval schematic of the world as a circle (the O) divided by a T-shape into three continents: Asia at the top, Europe lower-left, Africa lower-right. The T is formed by the Don, the Mediterranean, and the Nile. Sometimes Christ or the Trinity occupy the centre.", examples:["seed_003","seed_026"] },
  { term:"Portolan chart", def:"A nautical chart of the 13th–17th centuries, drawn on vellum, characterised by rhumb-line networks radiating from compass-rose nodes. Coastlines are observationally precise; interiors are decorative or empty. Used by Italian and Catalan navigators.", examples:["seed_012","seed_024"] },
  { term:"Rhumb line", def:"A line of constant compass bearing. On a Mercator projection it is a straight line — which is the whole point of that projection. On a globe it spirals toward the poles.", examples:["seed_007"] },
  { term:"Mercator projection", def:"A cylindrical map projection devised by Gerardus Mercator in 1569 in which rhumb lines are straight. Excellent for navigation; severely distorts polar areas. Still the default projection of most digital map services.", examples:["seed_007","seed_032"] },
  { term:"Cordiform projection", def:"A heart-shaped projection used in the 16th century, notably by Mercator. Distorts in different ways than cylindrical projections; was favoured for symbolic and artistic reasons as much as mathematical ones.", examples:["seed_001"] },
  { term:"Hachure", def:"Short parallel pen-strokes used on 18th–19th-century topographic maps to indicate slope direction and steepness. Replaced over the 20th century by contour lines.", examples:[] },
  { term:"Isoline / isarithm", def:"A line on a map connecting points of equal value. Specific cases include isotherms (equal temperature), isobars (equal pressure), isohyets (equal precipitation), and contour lines (equal elevation).", examples:["seed_022","seed_050"] },
  { term:"Contour line", def:"An isoline of constant elevation. The defining convention of modern topographic mapping. Slope is encoded by line spacing: closer lines mean steeper terrain.", examples:[] },
  { term:"Cadastre / cadastral map", def:"A map of land parcels for property and taxation purposes. Cadastral mapping was a central administrative tool of European colonial states; it produced both the data and the legal fiction of clean, individuated ownership.", examples:["seed_033"] },
  { term:"T-in-O / Macrobian map", def:"A T-O variant from late antique authors (Macrobius, 5th c.) showing zonal climate bands — torrid, temperate, frigid — across both hemispheres. Influential in medieval Europe.", examples:[] },
  { term:"Itinerary map", def:"A map organised around a route rather than a region. The Tabula Peutingeriana is the classic case: distances along Roman roads are accurate, but the underlying geography is distorted to fit.", examples:["seed_010"] },
  { term:"Bird's-eye view / axonometric plan", def:"A representation of a city as if seen from an oblique angle above. Common in early-modern European city plans (16th–18th c.). Each building is drawn from the same angle, so the plan reads as a model.", examples:["seed_019"] },
  { term:"Köppen-Geiger classification", def:"A climate classification developed by Wladimir Köppen (1900, revised 1936) using monthly temperature and precipitation thresholds, organised around what vegetation grows where. Still the most widely used climate classification.", examples:["seed_022","seed_050"] },
  { term:"Treaty of Tordesillas line", def:"The 1494 meridian dividing Spanish and Portuguese claims in the New World. It first appears as a cartographic object on the Cantino Planisphere (1502). One of the earliest examples of a line on a map producing a political reality.", examples:["seed_006"] },
  { term:"Convivencia", def:"The historiographic term for the period of relative coexistence and intellectual exchange between Christians, Muslims, and Jews on the Iberian peninsula and in Norman Sicily (c. 700–1500). The Tabula Rogeriana is its outstanding cartographic product.", examples:["seed_002"] },
  { term:"Cosmogram", def:"A representation of the cosmos as a structured whole, often combining geography with cosmological or theological order. Medieval mappae mundi are cosmograms; so is the Codex Mendoza frontispiece, which presents Tenochtitlan as the centre of a four-quarter world.", examples:["seed_003","seed_015"] },
  { term:"South-up orientation", def:"A map oriented with south at the top. Standard in much of Islamic medieval cartography (e.g. al-Idrisi). Modern viewers find it disorienting, but there is no geographic reason maps should be north-up — the convention is a 15th–16th-century European choice that became universal.", examples:["seed_002"] },
  { term:"Globe gores", def:"The almond-shaped strips into which a globe's surface is divided when printed on a flat sheet and later pasted onto a sphere. A standard production method from the 16th century onward.", examples:[] },
  { term:"Toponym", def:"A place name. The history of cartography is in significant part a history of which toponyms get written in larger type, which get standardised, and which get displaced — as colonial maps repeatedly demonstrate.", examples:[] },
  { term:"Datum (geodetic)", def:"A reference system used to specify coordinates on Earth's surface. WGS84 is the most common today; older maps use a wide variety of regional and national datums. Coordinates without a stated datum are at best ambiguous.", examples:[] },
  { term:"Triangulation", def:"A surveying method that determines positions by measuring the angles of triangles whose vertices are at known points. The basis of modern national topographic surveys from the 18th century onward.", examples:["seed_021"] },
  { term:"Pluriversal mapping", def:"A category that refuses the assumption that there is one neutral 'world' to be mapped. Indigenous cartographies, counter-mapping projects, and many post-colonial cartographies are pluriversal in this sense — they insist that the world is many worlds, mapped from many positions.", examples:["seed_038"] },
  { term:"Counter-mapping", def:"Mapping by communities who refuse the cartographic conventions imposed on them by states. Includes indigenous land mapping, queer cartographies, and activist cartographies that document marginalised geographies.", examples:[] },
  { term:"Compass rose", def:"A figure on a map showing the orientation of the cardinal directions. Originally functional for portolan charts; later a decorative convention that signals 'this is a map' even when the object is fictional.", examples:["seed_012"] },
  { term:"Scale bar", def:"A graphical scale on a map, used to measure distances. Modern maps usually include one. Many medieval and early-modern maps did not, because their organising logic was not metric.", examples:[] },
  { term:"Aspect (cartographic)", def:"The shape of the parameter set that a projection optimises. The Mercator preserves angles (it is conformal); the Lambert equal-area preserves area; the Robinson is a compromise. No projection preserves both shape and area.", examples:[] },
  { term:"Geocoding", def:"The process of assigning coordinates to place names or addresses. A 20th–21st-century process; pre-modern maps generally did the inverse, attaching place names to coordinates determined astronomically.", examples:[] },
  { term:"Ground truth", def:"Direct observation in the field, used to verify or correct what appears on a map. Aerial photography and satellite imagery are constantly checked against ground truth — and frequently disagree with it.", examples:[] },
  { term:"Lidar", def:"Light Detection and Ranging: a sensing technique that uses laser pulses to measure elevations at high resolution. Now standard for topographic surveys, archaeology, and forestry. Has revealed previously unknown features under forest canopy.", examples:[] },
];

function renderGlossary() {
  const root = $("#glossary-content");
  if (!root) return;
  const entries = [...GLOSSARY].sort((a,b) => a.term.localeCompare(b.term));
  root.innerHTML = `
    <div class="container">
      <div style="padding: 72px 0 24px; max-width: 880px;">
        <span class="eyebrow">Reference</span>
        <h1 style="margin-top:18px">Glossary of cartographic terms.</h1>
        <p class="lede" style="margin-top:18px">Thirty definitions for terms that recur across the archive. Each entry links to maps that exemplify the concept.</p>
      </div>
      <div class="glossary-grid">
        ${entries.map(g => `
          <article class="glossary-entry" id="g-${escapeAttr(g.term.toLowerCase().replace(/[^a-z]+/g,'-'))}">
            <h3 class="glossary-term">${g.term}</h3>
            <p class="glossary-def">${g.def}</p>
            ${g.examples.length ? `
              <div class="glossary-examples">
                <span class="meta">See:</span>
                ${g.examples.map(id => {
                  const mp = MAPS.find(x => x.id === id);
                  return mp ? `<a class="link-underline" style="color:var(--gold); margin-left:8px" href="#/map/${mp.id}">${shortTitle(mp.title, 50)}</a>` : '';
                }).join("")}
              </div>` : ''}
          </article>
        `).join("")}
      </div>
    </div>
  `;
}

/* ============ ABOUT — archive-at-a-glance stats panel ============ */
function renderAbout() {
  const root = $("#about-stats");
  if (!root) return;

  // Aggregate stats fresh from the dataset
  const total = MAPS.length;
  const curated = MAPS.filter(m => m.significance).length;
  const dated = MAPS.filter(m => m.yearNum != null).length;
  const renderable = MAPS.filter(m => m.renderable).length;
  const withDesc = MAPS.filter(m => m.description && m.description.length >= 30).length;

  // Source breakdown — top 5
  const bySource = {};
  MAPS.forEach(m => {
    const src = m.institution ? m.institution.split(/[,;]/)[0].trim() : "(unknown)";
    bySource[src] = (bySource[src] || 0) + 1;
  });
  const topSources = Object.entries(bySource).sort((a,b) => b[1]-a[1]).slice(0, 5);

  // Era distribution
  const byEra = {};
  MAPS.forEach(m => { byEra[MAP_ERA[m.id]] = (byEra[MAP_ERA[m.id]]||0) + 1; });
  const eraRows = ERAS.map(e => ({ key:e.key, label:e.label, range:e.range, count: byEra[e.key]||0 })).filter(r => r.count > 0).sort((a,b) => b.count - a.count);

  // Category breakdown
  const catRows = CATEGORY_META.map(c => ({ key:c.key, display:c.display, count: COUNTS.byCategory[c.key]||0 })).sort((a,b)=>b.count-a.count);

  // Build HTML
  const pct = (n) => `${Math.round(n/total*100)}%`;
  root.innerHTML = `
    <p style="color:var(--ink-dim); font-size:17px; line-height:1.7; margin-bottom:24px; max-width:60ch">
      Honest numbers — what's actually in the archive today, not what we'd like to claim.
    </p>

    <div class="stats-grid">
      <div class="stat-card"><div class="stat-num">${fmt(total)}</div><div class="stat-lbl">Maps catalogued</div></div>
      <div class="stat-card"><div class="stat-num">${fmt(curated)}</div><div class="stat-lbl">With curated essay<br/><em style="font-style:normal; color:var(--ink-faint); font-size:10px">significance + biases</em></div></div>
      <div class="stat-card"><div class="stat-num">${fmt(dated)}</div><div class="stat-lbl">Dated records<br/><em style="font-style:normal; color:var(--ink-faint); font-size:10px">${pct(dated)} of total</em></div></div>
      <div class="stat-card"><div class="stat-num">${fmt(renderable)}</div><div class="stat-lbl">With renderable image<br/><em style="font-style:normal; color:var(--ink-faint); font-size:10px">${pct(renderable)} of total</em></div></div>
    </div>

    <div class="stats-twocol">
      <div>
        <span class="eyebrow">Source institutions</span>
        <ul class="stats-list">
          ${topSources.map(([name, n]) => `
            <li>
              <span class="stats-list-bar" style="width:${(n/topSources[0][1])*100}%"></span>
              <span class="stats-list-name">${name}</span>
              <span class="stats-list-count">${fmt(n)}</span>
            </li>`).join("")}
        </ul>
        <p class="meta" style="margin-top:14px; text-transform:none; letter-spacing:0; font-family:var(--serif-body); font-style:italic; color:var(--ink-muted); font-size:12px">
          Of 28 distinct institutions in total; the long tail is small.
        </p>
      </div>

      <div>
        <span class="eyebrow">By historical era</span>
        <ul class="stats-list">
          ${eraRows.map(r => `
            <li>
              <span class="stats-list-bar" style="width:${(r.count/eraRows[0].count)*100}%"></span>
              <span class="stats-list-name">${r.label} <em style="font-style:normal; color:var(--ink-faint)">${r.range}</em></span>
              <span class="stats-list-count">${fmt(r.count)}</span>
            </li>`).join("")}
        </ul>
      </div>
    </div>

    <div style="margin-top:48px">
      <span class="eyebrow">By category</span>
      <ul class="stats-list stats-list-compact" style="margin-top:14px">
        ${catRows.map(r => `
          <li>
            <span class="stats-list-bar" style="width:${(r.count/catRows[0].count)*100}%"></span>
            <a class="stats-list-name" href="#/archive/${r.key}">${r.display}</a>
            <span class="stats-list-count">${fmt(r.count)}</span>
          </li>`).join("")}
      </ul>
    </div>
  `;
}

/* ============ LIBRARY ============ */
function renderLibrary() {
  const rich = MAPS.filter(m => m.renderable && m.description);
  const u = Account.current();

  // Saved maps — prefer real account data; fall back to sample maps when not signed in
  const savedIds = u?.savedMaps || [];
  const savedMaps = savedIds.map(id => MAPS.find(m => m.id === id)).filter(Boolean);
  const saved = savedMaps.length ? savedMaps : rich.slice(0, 4);

  // Viewing history — prefer real account data; fall back to sample maps
  const histMaps = (u?.history || []).map(h => MAPS.find(m => m.id === h.mapId)).filter(Boolean);
  const recent = histMaps.length ? histMaps.slice(0, 5) : rich.slice(4, 9);

  // Update dynamic counts in the static HTML
  const savedCountEl = $("#library-saved-count");
  if (savedCountEl) savedCountEl.textContent = `${savedMaps.length} map${savedMaps.length !== 1 ? "s" : ""}`;
  const recentCountEl = $("#library-recent-count");
  if (recentCountEl) recentCountEl.textContent = histMaps.length ? `${histMaps.length} map${histMaps.length !== 1 ? "s" : ""}` : "Last 7 days";

  $("#library-saved").innerHTML = saved.map(mapCard).join("");
  $("#library-recent").innerHTML = recent.map(smallMapTile).join("");

  // Notes: prefer real account notes; fall back to demo notes when not signed in or empty
  const realNotes = u?.notes || [];
  const notesCountEl = $("#library-notes-count");
  if (notesCountEl) notesCountEl.textContent = `${realNotes.length} note${realNotes.length !== 1 ? "s" : ""}`;

  let notesHtml;
  if (realNotes.length) {
    notesHtml = realNotes.map(n => {
      const target = MAPS.find(mm => mm.id === n.mapId);
      const when = new Date(n.createdAt).toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" });
      return `
        <div class="note">
          <div class="note-anchor">
            <span class="meta">on</span>
            <a href="#/map/${n.mapId}" class="link-underline">${shortTitle(target?.title || "Unknown map", 60)}</a>
          </div>
          <p>${escapeHtml(n.text)}</p>
          <div class="row" style="justify-content:space-between">
            <span class="meta">${when}</span>
            <button class="btn-ghost" data-remove-note="${n.id}" style="background:transparent; border:0; color:var(--ink-faint); font-family:var(--mono); font-size:10px; letter-spacing:0.06em; cursor:pointer; padding:0">Remove</button>
          </div>
        </div>`;
    }).join("");
  } else {
    const noteTargets = [rich[0], rich[3], rich[7]].filter(Boolean);
    const noteTexts = [
      "Worth flagging that the original print run was tiny; only a handful of copies survive in institutional collections.",
      "Use this in lecture on visual propaganda. The framing device is the operative element; the projection is the second move.",
      "South-up. Worth noting that this disorientation is itself the point — modern viewers underestimate how recent the north-up convention is.",
    ];
    notesHtml = noteTargets.map((mm, i) => `
      <div class="note">
        <div class="note-anchor">
          <span class="meta">on</span>
          <a href="#/map/${mm.id}" class="link-underline">${shortTitle(mm.title, 60)}</a>
        </div>
        <p>${noteTexts[i]}</p>
        <span class="meta">${["12 March 2026", "04 March 2026", "22 February 2026"][i]} · sample</span>
      </div>`).join("");
  }
  $("#library-notes").innerHTML = notesHtml;
  $$("[data-remove-note]").forEach(b => b.addEventListener("click", () => {
    if (confirm("Remove this note?")) { Account.removeNote(b.dataset.removeNote); renderLibrary(); }
  }));
}

/* ============ ACCOUNT ============ */

const accountState = {
  authMode: "signin",  // "signin" | "signup" | "recover"
  section: "profile",  // dashboard section
  errors: {},
  flash: null,
  authForm: { name: "", email: "", password: "", confirm: "" },
};

function renderAccount(param) {
  const root = $("#account-content");
  if (!root) return;
  if (param === "signin" || param === "signup" || param === "recover") {
    accountState.authMode = param;
  }
  if (Account.isSignedIn()) {
    renderAccountDashboard(root);
  } else {
    renderAuth(root);
  }
}

/* ----- AUTH SCREENS (signin / signup / recover) ----- */
function renderAuth(root) {
  const mode = accountState.authMode;
  const f = accountState.authForm;
  const e = accountState.errors;

  const fieldsByMode = {
    signin: ["email", "password"],
    signup: ["name", "email", "password", "confirm"],
    recover: ["email"],
  };
  const titles = {
    signin: { eyebrow: "Welcome back", title: "Sign in to Mappa Mundi", cta: "Sign in" },
    signup: { eyebrow: "Join the archive", title: "Create your account", cta: "Create account" },
    recover: { eyebrow: "Forgot password", title: "Recover your account", cta: "Send reset link" },
  };
  const meta = titles[mode];

  root.innerHTML = `
    <div class="auth-page">
      <div class="auth-bg">
        ${window.mapSVG("renaissance", 17)}
      </div>
      <div class="auth-shell">
        <a class="auth-back" href="#/home">← Return to the archive</a>
        <div class="auth-card">
          <span class="eyebrow">${meta.eyebrow}</span>
          <h1 style="margin-top:14px">${meta.title}</h1>
          <p class="lede" style="margin-top:14px; max-width:42ch; font-size:16px">
            ${mode === "signin" ? "Sign in to access your saved maps, your notes, and your viewing history." : ""}
            ${mode === "signup" ? "An account lets you save maps to your library, take notes on them, and pick up where you left off." : ""}
            ${mode === "recover" ? "Enter the email associated with your account and we'll send you a link to choose a new password." : ""}
          </p>

          ${accountState.flash ? `<div class="auth-flash">${accountState.flash}</div>` : ''}

          <form class="auth-form" id="auth-form" novalidate>
            ${fieldsByMode[mode].includes("name") ? `
              <label class="auth-field">
                <span class="auth-label">Full name</span>
                <input type="text" name="name" autocomplete="name" value="${escapeAttr(f.name)}" placeholder="Ada Lovelace"/>
                ${e.name ? `<span class="auth-error">${e.name}</span>` : ''}
              </label>` : ''}

            ${fieldsByMode[mode].includes("email") ? `
              <label class="auth-field">
                <span class="auth-label">Email address</span>
                <input type="email" name="email" autocomplete="email" value="${escapeAttr(f.email)}" placeholder="you@example.com"/>
                ${e.email ? `<span class="auth-error">${e.email}</span>` : ''}
              </label>` : ''}

            ${fieldsByMode[mode].includes("password") ? `
              <label class="auth-field">
                <span class="auth-label">Password
                  ${mode === "signin" ? `<a class="auth-label-link" href="#/account/recover">Forgot password?</a>` : ''}
                </span>
                <input type="password" name="password" autocomplete="${mode === 'signin' ? 'current-password' : 'new-password'}" value="${escapeAttr(f.password)}" placeholder="${mode === 'signup' ? 'At least 6 characters' : '••••••••'}"/>
                ${e.password ? `<span class="auth-error">${e.password}</span>` : ''}
              </label>` : ''}

            ${fieldsByMode[mode].includes("confirm") ? `
              <label class="auth-field">
                <span class="auth-label">Confirm password</span>
                <input type="password" name="confirm" autocomplete="new-password" value="${escapeAttr(f.confirm)}" placeholder="Repeat password"/>
                ${e.confirm ? `<span class="auth-error">${e.confirm}</span>` : ''}
              </label>` : ''}

            ${e._form ? `<div class="auth-form-error">${e._form}</div>` : ''}

            <button type="submit" class="btn btn-primary auth-submit">${meta.cta} ${icons.arrow}</button>
          </form>

          <div class="auth-switch">
            ${mode === "signin" ? `
              <span>Don't have an account?</span>
              <a class="link-underline" href="#/account/signup" style="color:var(--gold)">Create one</a>
            ` : ''}
            ${mode === "signup" ? `
              <span>Already have an account?</span>
              <a class="link-underline" href="#/account/signin" style="color:var(--gold)">Sign in</a>
            ` : ''}
            ${mode === "recover" ? `
              <a class="link-underline" href="#/account/signin" style="color:var(--gold)">← Back to sign in</a>
            ` : ''}
          </div>

          <p class="auth-note">
            This is a static prototype — your account lives only in this browser. No data is sent anywhere.
          </p>
        </div>
      </div>
    </div>
  `;

  bindAuthForm(mode);
}

function bindAuthForm(mode) {
  const form = $("#auth-form");
  if (!form) return;
  // Keep form values in sync
  form.addEventListener("input", (e) => {
    if (e.target.name in accountState.authForm) {
      accountState.authForm[e.target.name] = e.target.value;
    }
  });
  // Mode-switch links → clear form errors but keep email
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    accountState.errors = {};
    accountState.flash = null;
    const f = accountState.authForm;
    if (mode === "signup") {
      const res = Account.signUp(f);
      if (res.errors) { accountState.errors = res.errors; renderAccount(); return; }
      accountState.flash = `Welcome, ${res.user.name}. Your account has been created.`;
      // Reset
      accountState.authForm = { name: "", email: "", password: "", confirm: "" };
      navigate("account");
    } else if (mode === "signin") {
      const res = Account.signIn(f);
      if (res.errors) { accountState.errors = res.errors; renderAccount(); return; }
      accountState.flash = `Welcome back, ${res.user.name.split(/\s+/)[0]}.`;
      accountState.authForm = { name: "", email: "", password: "", confirm: "" };
      navigate("account");
    } else if (mode === "recover") {
      const res = Account.recover(f);
      if (res.errors) { accountState.errors = res.errors; renderAccount(); return; }
      accountState.flash = `If an account exists for ${f.email}, a reset link has been sent. (Prototype: no email is actually delivered.)`;
      renderAccount();
    }
  });
}

/* ----- DASHBOARD (signed-in) ----- */
function renderAccountDashboard(root) {
  const u = Account.current();
  if (!u) return renderAuth(root);

  const sections = [
    { key: "profile", label: "Profile" },
    { key: "saved", label: "Saved maps" },
    { key: "history", label: "History" },
    { key: "preferences", label: "Preferences" },
    { key: "security", label: "Security" },
  ];

  root.innerHTML = `
    <div class="container-wide" style="padding-top: 48px">
      <div class="account-header">
        <div class="account-avatar account-avatar-lg" style="background:${u.avatarColor}">
          <span>${Account.initials(u.name)}</span>
        </div>
        <div>
          <span class="eyebrow">Signed in as</span>
          <h1 style="margin-top:10px">${escapeHtml(u.name)}</h1>
          <div class="meta-row" style="margin-top:10px">
            <span class="meta">${escapeHtml(u.email)}</span><span class="dot"></span>
            <span class="meta">Joined ${new Date(u.createdAt).toLocaleDateString("en-GB",{month:"short",year:"numeric"})}</span><span class="dot"></span>
            <span class="meta">${(u.savedMaps||[]).length} saved · ${(u.history||[]).length} viewed</span>
          </div>
        </div>
      </div>

      ${accountState.flash ? `<div class="auth-flash" style="max-width:600px; margin: 16px 0 0">${accountState.flash}</div>` : ''}

      <div class="account-shell">
        <aside class="account-sidebar">
          <nav class="account-nav">
            ${sections.map(s => `
              <button class="account-nav-item ${accountState.section===s.key?'active':''}" data-section="${s.key}">${s.label}</button>
            `).join("")}
            <div class="account-nav-divider"></div>
            <button class="account-nav-item account-signout" id="account-signout">Sign out</button>
          </nav>
        </aside>
        <div class="account-main" id="account-main">
          ${renderDashboardSection(u, accountState.section)}
        </div>
      </div>
    </div>
  `;

  // Wire section nav
  $$('[data-section]').forEach(b => b.addEventListener("click", () => {
    accountState.section = b.dataset.section;
    accountState.errors = {};
    accountState.flash = null;
    renderAccount();
  }));
  $("#account-signout").addEventListener("click", () => {
    if (confirm("Sign out of Mappa Mundi?")) Account.signOut();
    accountState.flash = "You have been signed out.";
    navigate("home");
  });

  bindDashboardSection(accountState.section);
}

function renderDashboardSection(u, key) {
  if (key === "profile") return renderProfileSection(u);
  if (key === "saved") return renderSavedSection(u);
  if (key === "history") return renderHistorySection(u);
  if (key === "preferences") return renderPreferencesSection(u);
  if (key === "security") return renderSecuritySection(u);
  return "";
}

function renderProfileSection(u) {
  const e = accountState.errors;
  return `
    <header class="account-section-header">
      <h2>Profile</h2>
      <p>Update your name, email, and avatar. These are visible only to you in this browser.</p>
    </header>

    <form class="dashboard-form" id="profile-form">
      <div class="account-avatar-row">
        <div class="account-avatar account-avatar-xl" style="background:${u.avatarColor}">
          <span>${Account.initials(u.name)}</span>
        </div>
        <div>
          <span class="meta">Avatar is generated from your initials and email. A photo upload would live here in a full build.</span>
        </div>
      </div>

      <label class="auth-field">
        <span class="auth-label">Full name</span>
        <input type="text" name="name" value="${escapeAttr(u.name)}"/>
        ${e.name ? `<span class="auth-error">${e.name}</span>` : ''}
      </label>

      <label class="auth-field">
        <span class="auth-label">Email address</span>
        <input type="email" name="email" value="${escapeAttr(u.email)}"/>
        ${e.email ? `<span class="auth-error">${e.email}</span>` : ''}
      </label>

      <div class="dashboard-form-actions">
        <button type="submit" class="btn btn-primary">Save changes</button>
      </div>
    </form>
  `;
}

function renderSavedSection(u) {
  const saved = (u.savedMaps || []).map(id => MAPS.find(m => m.id === id)).filter(Boolean);
  return `
    <header class="account-section-header">
      <h2>Saved maps</h2>
      <p>${saved.length ? `${fmt(saved.length)} map${saved.length===1?"":"s"} in your personal library.` : 'You haven\'t saved any maps yet.'}</p>
    </header>
    ${saved.length ? `<div class="grid-cards">${saved.map(mapCard).join("")}</div>` : `
      <div class="empty-state">
        Browse the <a class="link-underline" href="#/archive" style="color:var(--gold)">archive</a> and click <strong>Save to library</strong> on any map's detail page to add it here.
      </div>`}
  `;
}

function renderHistorySection(u) {
  const history = (u.history || []).map(h => ({ ...h, map: MAPS.find(m => m.id === h.mapId) })).filter(h => h.map);
  return `
    <header class="account-section-header">
      <h2>Viewing history</h2>
      <p>${history.length ? `Your last ${history.length} viewed map${history.length===1?"":"s"}.` : "You haven't opened any maps yet."}</p>
    </header>
    ${history.length ? `<div class="history-list">
      ${history.map(h => `
        <a class="history-row" href="#/map/${h.map.id}">
          <div class="history-thumb map-frame map-frame-img">${imageEl(h.map, {eager:true})}</div>
          <div class="history-body">
            <span class="meta">${new Date(h.viewedAt).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</span>
            <h4 style="margin-top:4px">${shortTitle(h.map.title, 90)}</h4>
            <span class="meta">${h.map.year} · ${categoryDisplay(h.map.category)}${h.map.region ? ' · ' + h.map.region : ''}</span>
          </div>
          <span class="history-arrow">→</span>
        </a>
      `).join("")}
    </div>` : `
      <div class="empty-state">
        Open any map from the <a class="link-underline" href="#/archive" style="color:var(--gold)">archive</a> and it'll appear here.
      </div>
    `}
    ${history.length ? `<div style="margin-top:24px; text-align:center"><button class="btn btn-sm" id="clear-history">Clear history</button></div>` : ''}
  `;
}

function renderPreferencesSection(u) {
  const p = u.preferences || {};
  return `
    <header class="account-section-header">
      <h2>Preferences</h2>
      <p>Adjust how Mappa Mundi looks and behaves for you. (Prototype — toggles persist locally.)</p>
    </header>
    <form class="dashboard-form" id="prefs-form">
      <label class="auth-field">
        <span class="auth-label">Card density</span>
        <select name="density" class="select">
          <option value="comfortable" ${p.density==='comfortable'?'selected':''}>Comfortable (default)</option>
          <option value="compact" ${p.density==='compact'?'selected':''}>Compact</option>
          <option value="spacious" ${p.density==='spacious'?'selected':''}>Spacious</option>
        </select>
      </label>
      <label class="auth-field">
        <span class="auth-label">Interface language</span>
        <select name="language" class="select">
          <option value="en" ${p.language==='en'?'selected':''}>English</option>
          <option value="es" ${p.language==='es'?'selected':''}>Español</option>
          <option value="fr" ${p.language==='fr'?'selected':''}>Français</option>
          <option value="pt" ${p.language==='pt'?'selected':''}>Português</option>
        </select>
        <span class="auth-helper">Most archive content remains in its source language. Interface labels only.</span>
      </label>
      <label class="toggle-row">
        <input type="checkbox" name="showFallback" ${p.showFallback!==false?'checked':''}/>
        <span><strong>Show stylized fallback</strong> while images load — keeps the page from flashing empty.</span>
      </label>
      <div class="dashboard-form-actions">
        <button type="submit" class="btn btn-primary">Save preferences</button>
      </div>
    </form>
  `;
}

function renderSecuritySection(u) {
  const e = accountState.errors;
  return `
    <header class="account-section-header">
      <h2>Security</h2>
      <p>Change your password or delete your account.</p>
    </header>
    <form class="dashboard-form" id="password-form">
      <h4 style="font-family:var(--serif-display); font-size:20px; font-weight:500">Change password</h4>
      <label class="auth-field">
        <span class="auth-label">Current password</span>
        <input type="password" name="current" autocomplete="current-password"/>
        ${e.current ? `<span class="auth-error">${e.current}</span>` : ''}
      </label>
      <label class="auth-field">
        <span class="auth-label">New password</span>
        <input type="password" name="next" autocomplete="new-password" placeholder="At least 6 characters"/>
        ${e.next ? `<span class="auth-error">${e.next}</span>` : ''}
      </label>
      <label class="auth-field">
        <span class="auth-label">Confirm new password</span>
        <input type="password" name="confirm" autocomplete="new-password"/>
        ${e.confirm ? `<span class="auth-error">${e.confirm}</span>` : ''}
      </label>
      <div class="dashboard-form-actions">
        <button type="submit" class="btn btn-primary">Update password</button>
      </div>
    </form>

    <div class="danger-zone">
      <h4 style="font-family:var(--serif-display); font-size:20px; font-weight:500; color:var(--terracotta)">Delete account</h4>
      <p style="color:var(--ink-muted); margin-top:8px; font-size:14px">Removes your profile, saved maps, history, and preferences from this browser. This can't be undone.</p>
      <button class="btn btn-danger" id="delete-account" style="margin-top:14px">Delete my account</button>
    </div>
  `;
}

function bindDashboardSection(key) {
  if (key === "profile") {
    $("#profile-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const res = Account.update({ name: fd.get("name")?.trim(), email: fd.get("email")?.trim() });
      if (res?.errors) { accountState.errors = res.errors; accountState.flash = null; }
      else { accountState.errors = {}; accountState.flash = "Profile updated."; }
      renderAccount();
    });
  }
  if (key === "preferences") {
    $("#prefs-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      Account.update({ preferences: {
        density: fd.get("density"),
        language: fd.get("language"),
        showFallback: fd.get("showFallback") === "on",
      }});
      accountState.flash = "Preferences saved.";
      renderAccount();
    });
  }
  if (key === "security") {
    $("#password-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const res = Account.changePassword({ current: fd.get("current"), next: fd.get("next"), confirm: fd.get("confirm") });
      if (res.errors) { accountState.errors = res.errors; accountState.flash = null; }
      else { accountState.errors = {}; accountState.flash = "Password updated."; }
      renderAccount();
    });
    $("#delete-account")?.addEventListener("click", () => {
      if (confirm("Delete your account? This removes all saved maps, notes, and history from this browser.")) {
        Account.deleteAccount();
        accountState.flash = "Your account has been deleted.";
        navigate("home");
      }
    });
  }
  if (key === "history") {
    $("#clear-history")?.addEventListener("click", () => {
      if (confirm("Clear your entire viewing history?")) {
        Account.update({ history: [] });
        renderAccount();
      }
    });
  }
}

/* ----- NAV ACCOUNT SLOT ----- */
function renderNavAccount() {
  const slot = $("#nav-account-slot");
  if (!slot) return;
  const u = Account.current();
  if (!u) {
    slot.innerHTML = `
      <a class="nav-signin-btn" href="#/account/signin">Sign in</a>
      <a class="btn btn-sm btn-primary hide-mobile" href="#/account/signup" style="margin-left:8px">Create account</a>
    `;
  } else {
    slot.innerHTML = `
      <button class="nav-avatar-btn" id="nav-avatar-btn" aria-haspopup="true" aria-expanded="false">
        <span class="account-avatar account-avatar-sm" style="background:${u.avatarColor}">
          <span>${Account.initials(u.name)}</span>
        </span>
        <span class="nav-avatar-name hide-mobile">${escapeHtml(u.name.split(/\s+/)[0])}</span>
        <span class="nav-avatar-chevron">▾</span>
      </button>
      <div class="nav-avatar-menu" id="nav-avatar-menu" hidden>
        <div class="nav-avatar-menu-header">
          <span class="account-avatar account-avatar-sm" style="background:${u.avatarColor}">
            <span>${Account.initials(u.name)}</span>
          </span>
          <div style="min-width:0">
            <div class="nav-avatar-menu-name">${escapeHtml(u.name)}</div>
            <div class="nav-avatar-menu-email">${escapeHtml(u.email)}</div>
          </div>
        </div>
        <a class="nav-avatar-menu-item" href="#/account" data-close-menu>My account</a>
        <a class="nav-avatar-menu-item" href="#/library" data-close-menu>My library <span class="badge">${(u.savedMaps||[]).length}</span></a>
        <a class="nav-avatar-menu-item" href="#/account" data-section-jump="history" data-close-menu>Viewing history</a>
        <a class="nav-avatar-menu-item" href="#/account" data-section-jump="preferences" data-close-menu>Preferences</a>
        <div class="nav-avatar-menu-divider"></div>
        <button class="nav-avatar-menu-item nav-avatar-menu-signout" id="nav-signout">Sign out</button>
      </div>
    `;
    $("#nav-avatar-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const menu = $("#nav-avatar-menu");
      const btn = $("#nav-avatar-btn");
      const open = menu.hidden;
      menu.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) setTimeout(() => document.addEventListener("click", closeAvatarMenu), 0);
    });
    $("#nav-signout")?.addEventListener("click", () => {
      Account.signOut();
      accountState.flash = "You have been signed out.";
      closeAvatarMenu();
      navigate("home");
    });
    $$('[data-section-jump]').forEach(a => a.addEventListener("click", () => {
      accountState.section = a.dataset.sectionJump;
    }));
    $$('[data-close-menu]').forEach(a => a.addEventListener("click", closeAvatarMenu));
  }
}
function closeAvatarMenu() {
  const menu = $("#nav-avatar-menu");
  const btn = $("#nav-avatar-btn");
  if (menu) menu.hidden = true;
  if (btn) btn.setAttribute("aria-expanded", "false");
  document.removeEventListener("click", closeAvatarMenu);
}

/* ============ Global search & search modal ============ */
function bindSearch() {
  // Hero search → routes to /archive with search query
  $$('#hero-search input').forEach(input => {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        archiveState.search = e.target.value.trim();
        archiveState.currentCategory = null;
        if (archiveState.search) navigate("archive");
      }
    });
  });
  // Random curated map button
  $("#random-map-btn")?.addEventListener("click", () => {
    const curated = MAPS.filter(m => m.significance);
    if (!curated.length) return;
    const pick = curated[Math.floor(Math.random() * curated.length)];
    navigate("map/" + pick.id);
  });

  // Global search button → opens search modal
  $("#global-search-btn")?.addEventListener("click", openSearchModal);
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearchModal(); }
  });
}

function openSearchModal() {
  $("#search-modal").classList.add("open");
  setTimeout(() => $("#search-modal-input").focus(), 30);
}
function closeSearchModal() { $("#search-modal").classList.remove("open"); }
function runSearchModal(q) {
  const nq = normalizeForSearch(q || "");
  const results = q ? filterMaps({ search: q }).slice(0, 12) : [];
  const eraMatches = q ? ERAS.filter(e => normalizeForSearch(e.label).includes(nq)).slice(0,3) : [];
  const catMatches = q ? CATEGORY_META.filter(c => normalizeForSearch(c.display).includes(nq) || normalizeForSearch(c.subtitle).includes(nq)).slice(0,3) : [];
  const totalCount = q ? filterMaps({ search: q }).length : 0;
  $("#search-modal-results").innerHTML = q ? `
    ${catMatches.length ? `<div class="sm-section">
      <span class="eyebrow">Categories</span>
      ${catMatches.map(c => `<a class="sm-row" href="#/archive/${c.key}" data-close>
        <span class="sm-row-title">${c.display}</span>
        <span class="sm-row-meta">${fmt(COUNTS.byCategory[c.key]||0)} maps</span>
      </a>`).join("")}
    </div>` : ''}
    ${eraMatches.length ? `<div class="sm-section">
      <span class="eyebrow">Eras</span>
      ${eraMatches.map(e => `<button class="sm-row" data-era-jump="${e.key}">
        <span class="sm-row-title">${e.label}</span>
        <span class="sm-row-meta">${fmt(COUNTS.byEra[e.key]||0)} maps</span>
      </button>`).join("")}
    </div>` : ''}
    <div class="sm-section">
      <div class="row" style="justify-content:space-between; margin-bottom:8px">
        <span class="eyebrow">Maps</span>
        <button class="sm-link" data-search-all>${fmt(totalCount)} total match${totalCount===1?"":"es"} →</button>
      </div>
      ${results.length ? results.map(m => `
        <a class="sm-row" href="#/map/${m.id}" data-close>
          <div class="sm-row-thumb">${imageEl(m, {eager:true})}</div>
          <div style="flex:1; min-width:0">
            <span class="sm-row-title">${shortTitle(m.title, 70)}</span>
            <span class="sm-row-meta">${m.year} · ${categoryDisplay(m.category)}${m.region ? ` · ${m.region}` : ''}</span>
          </div>
        </a>
      `).join("") : `<p class="sm-empty">No maps match "${q}".</p>`}
    </div>
  ` : `<p class="sm-empty">Start typing to search across all 1,559 maps — by title, place, cartographer, era, language, or tag.</p>`;
  $$('[data-close]').forEach(el => el.addEventListener("click", closeSearchModal));
  $$('[data-era-jump]').forEach(el => el.addEventListener("click", () => {
    archiveState.era = el.dataset.eraJump;
    archiveState.currentCategory = ALL_CATS;
    navigate("archive");
    closeSearchModal();
  }));
  $$('[data-search-all]').forEach(el => el.addEventListener("click", () => {
    archiveState.search = q;
    archiveState.currentCategory = null;
    navigate("archive");
    closeSearchModal();
  }));
}

/* ============ Zoom modal bindings ============ */
function bindZoomGlobal() {
  $("#zoom-close").addEventListener("click", closeZoomModal);
  $("#zoom-modal").addEventListener("click", (e) => { if (e.target.id === "zoom-modal") closeZoomModal(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeZoomModal(); closeSearchModal(); }
  });
}

function bindSearchModal() {
  $("#search-modal-close")?.addEventListener("click", closeSearchModal);
  $("#search-modal")?.addEventListener("click", (e) => { if (e.target.id === "search-modal") closeSearchModal(); });
  let timeout;
  $("#search-modal-input")?.addEventListener("input", (e) => {
    clearTimeout(timeout);
    const q = e.target.value.trim();
    timeout = setTimeout(() => runSearchModal(q), 80);
  });
  $("#search-modal-input")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const q = e.target.value.trim();
      if (q) { archiveState.search = q; archiveState.currentCategory = null; navigate("archive"); closeSearchModal(); }
    }
  });
  runSearchModal("");
}

/* ============ init ============ */
function bindNav() {
  const navLinks = $("#nav-links");
  const menuBtn = $("#nav-menu-btn");
  $$(".nav-link").forEach(l => l.addEventListener("click", () => {
    if (l.dataset.page === "archive") {
      archiveState.currentCategory = null;
      archiveState.search = "";
    }
    navigate(l.dataset.page);
    // Close mobile menu after navigating
    navLinks?.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  }));
  // Mobile menu toggle
  menuBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!navLinks?.classList.contains("open")) return;
    if (e.target.closest("#nav-links") || e.target.closest("#nav-menu-btn")) return;
    navLinks.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
}
// ============ Boot-time smoke tests ============
// Lightweight assertions that catch regressions in core data and helpers.
// Failures log to console with a clear prefix; the page still loads.
// Open the console (Cmd+Opt+J on Mac) to see results.
function runSmokeTests() {
  const failures = [];
  const assert = (cond, msg) => { if (!cond) failures.push(msg); };

  // 1. Dataset shape
  assert(Array.isArray(window.MAPS_RAW), "MAPS_RAW is not an array");
  assert(window.MAPS_RAW.length >= 1500, `Expected at least 1500 maps, got ${window.MAPS_RAW.length}`);

  // 2. Each map has required fields
  const sample = window.MAPS_RAW[0];
  ["id","title","category"].forEach(f => assert(f in sample, `MAPS_RAW[0] missing required field "${f}"`));

  // 3. SVG helper is callable and returns markup
  if (typeof window.mapSVG === "function") {
    const svg = window.mapSVG("ancient", 1);
    assert(typeof svg === "string" && svg.startsWith("<svg"), "mapSVG('ancient', 1) did not return an SVG string");
  } else {
    failures.push("window.mapSVG is missing");
  }

  // 4. Search index was pre-built and is lowercased
  const m0 = window.MAPS_RAW[0];
  assert(typeof m0._searchIndex === "string", "_searchIndex was not pre-built at boot");
  assert(m0._searchIndex === m0._searchIndex.toLowerCase(), "_searchIndex should be lowercased");

  // 5. ERAS classification is wired up
  assert(typeof eraOfMap === "function", "eraOfMap is missing");
  const era = eraOfMap({ yearNum: 1500 });
  assert(era === "renaissance", `eraOfMap(1500) should be 'renaissance', got '${era}'`);

  // 6. parseHash handles query strings
  const orig = location.hash;
  location.hash = "#/archive/01_World_Maps?era=renaissance&from=1500";
  const parsed = parseHash();
  assert(parsed.page === "archive", `parseHash page wrong: ${parsed.page}`);
  assert(parsed.param === "01_World_Maps", `parseHash param wrong: ${parsed.param}`);
  assert(parsed.query.era === "renaissance", `parseHash query.era wrong: ${parsed.query.era}`);
  assert(parsed.query.from === "1500", `parseHash query.from wrong: ${parsed.query.from}`);
  location.hash = orig;

  // 7. metadataScore weights curated maps heavily
  const scoreCurated = metadataScore({ significance: "x", description: "x", yearNum: 1500 });
  const scoreUncurated = metadataScore({ description: "x", yearNum: 1500 });
  assert(scoreCurated >= scoreUncurated + 10, "metadataScore should weight curated entries by at least +10");

  // 8. Account API is exposed and has key methods
  ["isSignedIn","saveMap","unsaveMap","isSaved","recordView","addNote","getNotesFor"].forEach(m => {
    assert(typeof window.Account?.[m] === "function", `Account.${m}() is missing`);
  });

  // 9. Curated essay coverage matches AUDIT expectations
  const curatedCount = window.MAPS_RAW.filter(m => m.significance).length;
  assert(curatedCount === 40, `Expected exactly 40 curated essays; got ${curatedCount}`);

  if (failures.length) {
    console.group("%c[Mappa Mundi smoke tests] FAILED", "color: oklch(60% 0.15 25); font-weight: bold");
    failures.forEach(f => console.warn("✗", f));
    console.groupEnd();
  }
  // No log on success — keep the console clean in production.
  // Inspect window.__mappaSmoke to see counts and timestamps if needed.
  window.__mappaSmoke = { passed: failures.length === 0, failures, ranAt: new Date().toISOString() };
  return failures.length === 0;
}

function bindLangToggle() {
  document.getElementById("lang-toggle")?.addEventListener("click", () => {
    setLocale(currentLocale() === "es" ? "en" : "es");
  });
}

function currentTheme() {
  try { return localStorage.getItem("mappaTheme") || "dark"; } catch { return "dark"; }
}
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const sun = document.querySelector(".theme-icon-sun");
  const moon = document.querySelector(".theme-icon-moon");
  if (sun && moon) {
    if (theme === "light") { sun.hidden = true; moon.hidden = false; }
    else { sun.hidden = false; moon.hidden = true; }
  }
  // Update the theme-color meta to match
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) themeColorMeta.setAttribute("content", theme === "light" ? "#f5efe0" : "#15110b");
}
function bindThemeToggle() {
  applyTheme(currentTheme());
  document.getElementById("theme-toggle")?.addEventListener("click", () => {
    const next = currentTheme() === "light" ? "dark" : "light";
    try { localStorage.setItem("mappaTheme", next); } catch {}
    applyTheme(next);
  });
}

function init() {
  if (!window.MAPS_RAW || !window.MAPS_RAW.length) {
    document.body.innerHTML = '<div style="padding:80px 32px; font-family: var(--serif-body); color: var(--ink);"><h1>Map data failed to load.</h1><p style="margin-top:16px; color: var(--ink-muted)">The maps.js dataset (2 MB) didn\'t reach the page. This is usually a temporary network issue — try refreshing.</p></div>';
    return;
  }
  if (!window.mapSVG) {
    console.error("mapSVG helper missing; check maps-data.js");
  }
  // Apply persisted locale before first render
  document.documentElement.lang = currentLocale();
  applyStaticI18n();
  bindNav();
  bindLangToggle();
  bindThemeToggle();
  bindSearch();
  bindZoomGlobal();
  bindSearchModal();
  renderRoute();
  // Register service worker (silently — only on http(s) origins, not file://)
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("./sw.js").then(reg => {
      // If a new SW takes control while this page is open, reload once so the
      // user sees fresh JS/CSS instead of the previously-cached versions.
      let reloaded = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (reloaded) return;
        reloaded = true;
        location.reload();
      });
    }).catch(err => console.warn("[SW] registration failed:", err));
  }
  // Run smoke tests after the first render (so the hash is whatever the user landed on)
  setTimeout(runSmokeTests, 100);
}
window.addEventListener("DOMContentLoaded", init);
