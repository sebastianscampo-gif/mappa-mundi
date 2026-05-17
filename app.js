/* ============ Mappa Mundi — app.js ============ */
/*
 *  Uses real dataset window.MAPS_RAW (1,559 maps) loaded from maps.js
 *  Falls back to SVG placeholders (window.mapSVG) when image fails.
 */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const fmt = (n) => n.toLocaleString("en-US");
const MAPS = window.MAPS_RAW || [];

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
  // Pre-built search index: concatenate every searchable field once, lowercased.
  // Avoids reassembling the same string for 1,559 maps on every keystroke in filterMaps().
  m._searchIndex = (
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
  ).toLowerCase();
});
// Cheap local helper so the boot-time loop doesn't depend on categoryDisplay (declared later).
function categoryDisplayRaw(key) { return (key||"").replace(/^\d+_/, '').replace(/_/g,' ').replace(/and/g,'&'); }

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
function escapeAttr(s) { return String(s || "").replace(/"/g, "&quot;"); }
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
  const y = m.year && m.year !== 'Undated' ? m.year : (m.century !== 'Undated' ? m.century : 'Undated');
  const curated = !!m.significance;
  return `
    <a class="map-card${curated ? ' map-card-curated' : ''}" href="#/map/${m.id}">
      <div class="map-frame map-frame-img">
        ${imageEl(m)}
        <div class="frame-label">${y}</div>
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
          ${m.author ? `<span class="dot"></span><span class="meta">${shortText(m.author, 40)}</span>` : ''}
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
const PAGES = ["home","archive","map","timeline","compare","collections","learn","about","library","account"];
const ALL_CATS = "_all"; // sentinel for cross-category filtered view (era pills, tag chips)

function parseHash() {
  const h = location.hash.replace(/^#\/?/, "");
  const [page, ...rest] = h.split("/");
  return { page: PAGES.includes(page) ? page : "home", param: rest.join("/") };
}
function navigate(path) { location.hash = "#/" + path; }
function renderRoute() {
  const { page, param } = parseHash();
  $$(".page").forEach(p => p.classList.toggle("active", p.id === "page-" + page));
  $$(".nav-link").forEach(l => l.classList.toggle("active", l.dataset.page === page));
  window.scrollTo({ top: 0, behavior: "instant" });
  // If we're leaving the map detail page, drop the viewer's window listeners
  if (page !== "map") { _viewerCleanup?.(); _viewerCleanup = null; }
  if (page === "map") renderMapDetail(param || (MAPS[0] && MAPS[0].id));
  if (page === "archive") {
    // param could be a category key OR start with _/ for special routes
    if (param && CATEGORY_META.some(c => c.key === param)) {
      archiveState.currentCategory = param;
      archiveState.search = "";
    } else {
      archiveState.currentCategory = null;
    }
    renderArchive();
  }
  if (page === "compare") renderCompare();
  if (page === "timeline") renderTimeline();
  if (page === "home") renderHome();
  if (page === "collections") renderCollections();
  if (page === "learn") renderLearn();
  if (page === "library") renderLibrary();
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

  // Recent strip — deterministic daily rotation (matches "Map of the Day" cadence; consistent within a session)
  const seedPool = MAPS.filter(m => m.renderable && m.description);
  const day = Math.floor(Date.now() / (1000*60*60*24));
  const recent = [];
  for (let i = 0; i < 5 && seedPool.length; i++) {
    recent.push(seedPool[(day * 7 + i * 53) % seedPool.length]);
  }
  $("#home-recent").innerHTML = recent.map(smallMapTile).join("");
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
  page: 1,
  pageSize: 48,
};

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

          ${archiveState.tags.size || archiveState.era !== 'all' || archiveState.continent !== 'All' || archiveState.language !== 'All' || archiveState.search || archiveState.fichaQuality !== 'all' ? `
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
    </div>` : ''}
    <div class="archive-toolbar">
      <span class="meta"><strong style="color:var(--gold); font-weight:500">${fmt(total)}</strong> map${total===1?"":"s"} ${scope ? `in ${scope}` : ''}</span>
    </div>
    <div class="grid-cards">
      ${view.length ? view.map(mapCard).join("") : `<div class="empty-state">No maps match these filters. Try clearing some constraints, or <a class="link-underline" href="#/archive" style="color:var(--gold)">return to all categories</a>.</div>`}
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
  return chips;
}

function filterMaps(opts = {}) {
  let list = opts.category ? (MAPS_BY_CATEGORY[opts.category] || []) :
             (archiveState.currentCategory && archiveState.currentCategory !== ALL_CATS ? MAPS_BY_CATEGORY[archiveState.currentCategory] : MAPS);
  list = list.slice();

  if ((opts.search ?? archiveState.search)) {
    const q = (opts.search ?? archiveState.search).toLowerCase();
    list = list.filter(m => m._searchIndex.includes(q));
  }
  if (archiveState.era !== "all") {
    list = list.filter(m => MAP_ERA[m.id] === archiveState.era);
  }
  if (archiveState.continent !== "All") list = list.filter(m => m.continent === archiveState.continent);
  if (archiveState.language !== "All") list = list.filter(m => m.language === archiveState.language);
  if (archiveState.tags.size) list = list.filter(m => [...archiveState.tags].every(t => (m.tags||[]).includes(t)));
  if (archiveState.fichaQuality === "full") list = list.filter(m => !!m.significance);

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
}
function clearAllFilters() {
  archiveState.search = "";
  archiveState.era = "all";
  archiveState.continent = "All";
  archiveState.language = "All";
  archiveState.tags = new Set();
  archiveState.fichaQuality = "all";
  archiveState.page = 1;
  renderArchive();
}

/* ============ MAP DETAIL ============ */
let _viewerCleanup = null; // holds removal functions for the two window listeners in bindViewer

function renderMapDetail(id) {
  _viewerCleanup?.();       // remove stale window listeners from the previous map view
  _viewerCleanup = null;

  const m = MAPS.find(x => x.id === id) || MAPS[0];
  if (!m) { $("#map-detail-root").innerHTML = '<div class="container"><p>Map not found.</p></div>'; return; }

  Account.recordView(m.id); // track viewing history while user is signed in

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
            </div>
            <div class="viewer-hint">Click image for full-screen zoom · scroll to zoom · drag to pan</div>
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
            ${m.author ? `<div class="kv-row"><span>Cartographer</span><span>${m.author}</span></div>` : ''}
            <div class="kv-row"><span>Date</span><span>${m.year}</span></div>
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

function bindViewer(m) {
  const stage = $("#viewer-stage");
  const canvas = $("#viewer-canvas");
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
  $("#timeline-root").innerHTML = TIMELINE_PERIODS.map((p, i) => {
    const inEra = MAPS.filter(m => MAP_ERA[m.id] === p.eraKey && m.renderable);
    const sample = inEra.slice(0, 3);
    return `
      <article class="period">
        <div class="period-marker">
          <span class="period-number">${String(i+1).padStart(2,'0')}</span>
          <div class="period-line"></div>
        </div>
        <div class="period-content">
          <span class="meta">${p.range} · ${fmt(inEra.length)} maps in archive</span>
          <h2 style="margin-top:8px">${p.name}</h2>
          <p class="lede" style="margin-top:18px; max-width:62ch">${p.blurb}</p>
          ${sample.length ? `
            <div class="grid-cards" style="margin-top:36px">${sample.map(mapCard).join("")}</div>
            ${inEra.length > 3 ? `<a class="btn btn-ghost" href="#/archive" data-era-link="${p.eraKey}" style="margin-top:24px; padding-left:0">Browse all ${fmt(inEra.length)} maps from this era ${icons.arrow}</a>` : ''}
          ` : `<p style="margin-top:24px; color:var(--ink-muted); font-style:italic">No maps in this period are catalogued yet.</p>`}
        </div>
      </article>
    `;
  }).join("");
  $$('[data-era-link]').forEach(a => a.addEventListener("click", (e) => {
    e.preventDefault();
    archiveState.era = a.dataset.eraLink;
    archiveState.currentCategory = ALL_CATS;
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
        <div class="compare-pair">
          ${sidePanel(left)}
          ${sidePanel(right)}
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

function sidePanel(m) {
  return `
    <div class="compare-panel">
      <div class="map-frame map-frame-img" style="aspect-ratio:1.2/1">
        ${imageEl(m, {eager: true})}
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
  { title:"Why old maps are not just inaccurate versions of modern maps", status:"Draft outline", topic:"Foundations", style:"medieval", excerpt:"Treating Ptolemy as a failed Google Maps is the surest way to misread him. Old maps were answering different questions — and often answering them well." },
  { title:"How maps create political power", status:"Draft outline", topic:"Power", style:"imperial", excerpt:"A line on a map is rarely just descriptive. From the Treaty of Tordesillas onward, drawn boundaries have produced the very territories they claim to record." },
  { title:"How empires used maps", status:"Draft outline", topic:"Empire", style:"colonial", excerpt:"Cadastral surveys, treaty atlases, railway concession maps. The infrastructure of empire was, in large part, made of paper." },
  { title:"How climate maps changed science", status:"Draft outline", topic:"Science", style:"climate", excerpt:"Köppen's vegetation-derived climate classes were a quiet revolution: a way to make the atmosphere legible by treating plants as instruments." },
  { title:"The history of topographic maps", status:"Draft outline", topic:"Method", style:"topo", excerpt:"Triangulation, plane-tabling, aerial photography, lidar. Topography is a story of measuring devices, not just of mountains." },
  { title:"How artistic maps represent imagined worlds", status:"Draft outline", topic:"Imagination", style:"artistic", excerpt:"The compass rose, the scale bar, the frame — cartographic conventions are persuasive even when the territory is wholly invented." },
  { title:"Reading the silences in a colonial map", status:"Draft outline", topic:"Critique", style:"colonial", excerpt:"What a map omits is often a clearer political statement than what it includes. A short guide to reading the gaps." },
  { title:"Indigenous counter-mapping in the 21st century", status:"Draft outline", topic:"Practice", style:"indigenous", excerpt:"How communities are using GIS, GPS, and oral history to remap territories that the colonial archive has long misrepresented." },
];

function renderLearn() {
  $("#learn-root").innerHTML = ARTICLES.map((a, i) => `
    <article class="article-card">
      <div class="map-frame" style="aspect-ratio: 4/3">${window.mapSVG(a.style, a.title.length + i)}</div>
      <div class="article-body">
        <div class="meta-row">
          <span class="meta">${a.topic}</span><span class="dot"></span>
          <span class="meta">${a.status}</span>
        </div>
        <h3 style="margin-top:12px">${a.title}</h3>
        <p style="margin-top:14px; color:var(--ink-dim)">${a.excerpt}</p>
        <span class="meta" style="margin-top:18px; display:inline-block; color:var(--ink-faint); font-style:italic">Full article forthcoming</span>
      </div>
    </article>
  `).join("");
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
          <p>${escapeAttr(n.text)}</p>
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
          <h1 style="margin-top:10px">${u.name}</h1>
          <div class="meta-row" style="margin-top:10px">
            <span class="meta">${u.email}</span><span class="dot"></span>
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
        <span class="nav-avatar-name hide-mobile">${u.name.split(/\s+/)[0]}</span>
        <span class="nav-avatar-chevron">▾</span>
      </button>
      <div class="nav-avatar-menu" id="nav-avatar-menu" hidden>
        <div class="nav-avatar-menu-header">
          <span class="account-avatar account-avatar-sm" style="background:${u.avatarColor}">
            <span>${Account.initials(u.name)}</span>
          </span>
          <div style="min-width:0">
            <div class="nav-avatar-menu-name">${u.name}</div>
            <div class="nav-avatar-menu-email">${u.email}</div>
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
  const results = q ? filterMaps({ search: q }).slice(0, 12) : [];
  const eraMatches = q ? ERAS.filter(e => e.label.toLowerCase().includes(q.toLowerCase())).slice(0,3) : [];
  const catMatches = q ? CATEGORY_META.filter(c => c.display.toLowerCase().includes(q.toLowerCase()) || c.subtitle.toLowerCase().includes(q.toLowerCase())).slice(0,3) : [];
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
  $$(".nav-link").forEach(l => l.addEventListener("click", () => {
    if (l.dataset.page === "archive") {
      archiveState.currentCategory = null;
      archiveState.search = "";
    }
    navigate(l.dataset.page);
  }));
}
function init() {
  if (!window.MAPS_RAW || !window.MAPS_RAW.length) {
    document.body.innerHTML = '<div style="padding:80px 32px; font-family: var(--serif-body); color: var(--ink);"><h1>Map data failed to load.</h1><p style="margin-top:16px; color: var(--ink-muted)">The maps.js dataset (2 MB) didn\'t reach the page. This is usually a temporary network issue — try refreshing.</p></div>';
    return;
  }
  if (!window.mapSVG) {
    console.error("mapSVG helper missing; check maps-data.js");
  }
  bindNav();
  bindSearch();
  bindZoomGlobal();
  bindSearchModal();
  renderRoute();
}
window.addEventListener("DOMContentLoaded", init);
