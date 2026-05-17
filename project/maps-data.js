/* ============ Mappa Mundi — SVG placeholder generators ============ */
// Used as fallback artwork when a real image fails to load or is unavailable.
// Style varies by era so placeholders feel period-appropriate.

const _CURATED_UNUSED = [
  {
    id: "ptolemy",
    title: "Ptolemy's Geographia",
    year: "c. 150 CE",
    period: "Classical Antiquity",
    century: "2nd c.",
    region: "Mediterranean & Known World",
    country: "Roman Egypt",
    author: "Claudius Ptolemy",
    type: "World Map",
    civilization: "Greco-Roman",
    theme: "World",
    style: "ancient",
    desc: "A reconstruction of the earliest mathematical mapping of the known world, with coordinates derived from Ptolemy's eight-book treatise on geography.",
    context: "Compiled in Alexandria during the height of the Roman Empire, Ptolemy's Geographia introduced the radical idea that places on Earth could be located by paired coordinates of latitude and longitude.",
    matters: "It was the first systematic attempt to project a spherical Earth onto a flat surface using mathematical principles. Lost to Western Europe for a millennium, its rediscovery in 15th-century Florence reshaped the Renaissance imagination.",
    reveals: "The Greco-Roman world's confidence in measurement, but also the limits of second-hand knowledge: India trails off into legend, sub-Saharan Africa fuses with East Asia, and the Indian Ocean is drawn as a landlocked sea.",
    meaning: "Scientific. A theological text was the world before Ptolemy; a calculable lattice was the world after.",
    bias: "Eurocentric coordinate origin (Canary Islands as prime meridian). Africa and the Indian Ocean are dramatically misshapen. Distances along east-west axes are systematically overestimated.",
    related: ["Roman road map", "Tabula Rogeriana", "Waldseemüller Map"],
    source: "Vatican Library — Codex Urbinas Graecus 82 (15th c. copy)",
    views: 24891,
    added: "2024-01-12",
  },
  {
    id: "tabula-rogeriana",
    title: "Tabula Rogeriana",
    year: "1154",
    period: "Medieval period",
    century: "12th c.",
    region: "Mediterranean, Africa, Asia",
    country: "Kingdom of Sicily",
    author: "Muhammad al-Idrisi",
    type: "World Map",
    civilization: "Islamic Golden Age",
    theme: "World",
    style: "medieval",
    desc: "Commissioned by Roger II of Sicily, al-Idrisi's atlas synthesized fifteen years of geographical inquiry across the Muslim and Christian worlds.",
    context: "Produced at the Norman court of Palermo, where Arabic, Greek, and Latin scholarship overlapped. The original silver planisphere was destroyed in 1160; what survives are seventy regional sheets.",
    matters: "It is the most accurate world map produced anywhere on Earth for the next three centuries — and the clearest evidence of how thoroughly Islamic cartography surpassed European work in the high Middle Ages.",
    reveals: "A Mediterranean understood as the center of trade, not Jerusalem; a careful interest in distances by traveling-day rather than mythology; and a south-up orientation that confounds modern viewers.",
    meaning: "Cultural and political — a Christian king's act of patronage toward a Muslim scholar, in a kingdom built on convivencia.",
    bias: "South-up orientation (consistent with Islamic convention). The Indian Ocean is open, but its eastern reaches dissolve into supposition. Northern Europe is sparsely detailed.",
    related: ["Ptolemy's Geographia", "Mappa Mundi of Hereford", "Silk Road map"],
    source: "Bibliothèque nationale de France — MS Arabe 2221",
    views: 18204,
    added: "2024-02-08",
  },
  {
    id: "waldseemuller",
    title: "Waldseemüller World Map",
    year: "1507",
    period: "Age of Exploration",
    century: "16th c.",
    region: "World",
    country: "Saint-Dié, Lorraine",
    author: "Martin Waldseemüller",
    type: "World Map",
    civilization: "Renaissance Europe",
    theme: "Exploration",
    style: "renaissance",
    desc: "The first map ever to label a landmass 'America', printed in twelve woodcut sheets and intended as a teaching companion to Ptolemy.",
    context: "Created in a small monastery in the Vosges mountains by a group of scholar-printers who never crossed the Atlantic. They named the new continent for Amerigo Vespucci on the strength of his published letters.",
    matters: "It is, in a literal sense, the document that named the western hemisphere. Only a single complete copy survives.",
    reveals: "How fast geographic ideas could mutate in the age of print — and how a single editorial choice in a remote scriptorium could anchor a name onto half the planet.",
    meaning: "A turning point in the European imagination: the world is no longer three continents but four.",
    bias: "South America drawn as a thin strip; the Pacific reduced to a sliver; many coastlines extrapolated from a handful of expedition reports.",
    related: ["Ptolemy's Geographia", "Mercator Projection", "Portolan Charts"],
    source: "U.S. Library of Congress — Geography & Map Division",
    views: 31402,
    added: "2024-01-22",
  },
  {
    id: "mercator",
    title: "Mercator Projection",
    year: "1569",
    period: "Age of Exploration",
    century: "16th c.",
    region: "World",
    country: "Duchy of Cleves",
    author: "Gerardus Mercator",
    type: "Projection",
    civilization: "Renaissance Europe",
    theme: "Navigation",
    style: "projection",
    desc: "The projection that became the world: rhumb lines render as straight, at the cost of grossly inflating polar latitudes.",
    context: "Designed for navigators, not classrooms. Mercator's insight — that a cylindrical projection preserving angles would let sailors plot a constant compass bearing as a straight line — was an engineering decision, not a worldview.",
    matters: "Five centuries later it is still the default projection of nearly every digital map service, despite a long, well-documented critique of the distortions it imposes on equatorial geographies.",
    reveals: "How a tool optimized for one task (sailing) can quietly become a worldview for everyone else.",
    meaning: "A piece of design infrastructure whose biases were invisible for centuries.",
    bias: "Greenland appears the size of Africa; Antarctica becomes a continent-spanning band; equatorial countries shrink relative to the global north.",
    related: ["Waldseemüller Map", "Portolan Charts", "Cold War World Map"],
    source: "Maritiem Museum Rotterdam",
    views: 42115,
    added: "2024-02-14",
  },
  {
    id: "portolan",
    title: "Portolan Chart of the Mediterranean",
    year: "c. 1380",
    period: "Medieval period",
    century: "14th c.",
    region: "Mediterranean & Black Sea",
    country: "Republic of Genoa",
    author: "Anonymous Genoese workshop",
    type: "Nautical Chart",
    civilization: "Italian Maritime Republics",
    theme: "Navigation",
    style: "portolan",
    desc: "A working sailor's chart of harbours, headlands, and compass rhumb lines, drawn on vellum and stained by salt.",
    context: "Portolans were practical objects, not scholarly ones. They emerged in the late 13th century from the combined craft of Italian shipmasters, Catalan cartographers, and the compass.",
    matters: "Among the first European maps drawn from direct observation rather than from received authority — a quiet revolution in how knowledge was made.",
    reveals: "A Mediterranean understood as a network of coasts and bearings, with the interiors of countries left almost blank because sailors did not need them.",
    meaning: "Commercial. Every named harbour was a place where money changed hands.",
    bias: "Coastlines are remarkably accurate; interiors are decorative or empty. Africa stops at the Atlas.",
    related: ["Tabula Rogeriana", "Silk Road map", "Nautical navigation chart"],
    source: "Biblioteca Marciana, Venice",
    views: 12041,
    added: "2024-03-04",
  },
  {
    id: "tenochtitlan",
    title: "Map of Tenochtitlan",
    year: "1524",
    period: "Age of Exploration",
    century: "16th c.",
    region: "Valley of Mexico",
    country: "Mexica (Aztec) Empire",
    author: "Attributed to Hernán Cortés / Indigenous draftsman",
    type: "City Map",
    civilization: "Mexica",
    theme: "Urban",
    style: "city",
    desc: "Printed in Nuremberg alongside Cortés's second letter, this is the first European image of a city that had already been destroyed before most Europeans heard of it.",
    context: "The drawing fuses two cartographic traditions: a European fortified-city plan, and an indigenous mapping convention that placed the temple precinct at the symbolic center of the cosmos.",
    matters: "It is almost certainly the work of a Mexica draftsman — making it a rare document of indigenous cartography surviving in European print.",
    reveals: "Tenochtitlan's circular form, its causeways radiating into Lake Texcoco, and the geometric precision of the ceremonial heart — a city of perhaps 200,000 people, larger than any in Europe at the time.",
    meaning: "Political. The map was published to make a conquest legible to a European audience that had no prior frame for the place.",
    bias: "Combines an idealized indigenous cosmogram with a colonial framing; scale and proportion are symbolic rather than measured.",
    related: ["Spanish colonial map of the Americas", "Indigenous territorial map"],
    source: "Newberry Library, Chicago",
    views: 9824,
    added: "2024-02-26",
  },
  {
    id: "british-empire",
    title: "The British Empire in 1886",
    year: "1886",
    period: "Colonial empires",
    century: "19th c.",
    region: "Global",
    country: "United Kingdom",
    author: "Walter Crane (for the Imperial Federation League)",
    type: "Propaganda / Empire",
    civilization: "British Empire",
    theme: "Empire",
    style: "imperial",
    desc: "Britannia enthroned over a Mercator world. Every colony shaded a hard imperial red, with allegorical figures in the margins.",
    context: "Published as a supplement to The Graphic newspaper to celebrate Queen Victoria's jubilee and to argue for tighter federal ties between Britain and her colonies.",
    matters: "The textbook example of a map as instrument of empire — designed not to inform but to flatter and to recruit.",
    reveals: "How thoroughly imperial propaganda relied on the Mercator projection's inflation of high latitudes: Canada looms, equatorial colonies vanish.",
    meaning: "Political. The visual grammar of empire — uniform red, allegorical figures, a central monarch — was being invented in real time.",
    bias: "Mercator distortion; uncritical celebration of colonial extraction; indigenous polities erased; trade routes glorified.",
    related: ["Cold War World Map", "Spanish colonial map of the Americas", "Ottoman Empire map"],
    source: "Boston Public Library — Norman B. Leventhal Map Center",
    views: 38219,
    added: "2024-01-30",
  },
  {
    id: "cold-war",
    title: "Cold War World, 1962",
    year: "1962",
    period: "Cold War",
    century: "20th c.",
    region: "Global",
    country: "United States",
    author: "C.S. Hammond & Co.",
    type: "Political Map",
    civilization: "Post-WWII Order",
    theme: "Empire",
    style: "coldwar",
    desc: "NATO blue, Warsaw Pact red, the non-aligned world a careful neutral grey. The Cuban Missile Crisis is six months away.",
    context: "Produced for American classrooms during the height of bipolar tension. The choice of which colour represented which bloc was an editorial position.",
    matters: "A reminder that geopolitical maps were, until very recently, two-colour maps — and that the world has never actually fit into two colours.",
    reveals: "The thinness of the non-aligned belt; the way decolonization is still in progress across most of Africa; the dotted lines of disputed borders.",
    meaning: "Political. To teach geography in 1962 was to teach an ideology.",
    bias: "Two-bloc framing collapses dozens of independent foreign policies into a single shade of grey.",
    related: ["British Empire Map", "Ottoman Empire map"],
    source: "David Rumsey Map Collection",
    views: 21450,
    added: "2024-03-15",
  },
  {
    id: "koppen",
    title: "Köppen Climate Classification",
    year: "1900 (rev. 1936)",
    period: "Industrial era",
    century: "20th c.",
    region: "Global",
    country: "Germany",
    author: "Wladimir Köppen",
    type: "Climate Map",
    civilization: "Modern Scientific",
    theme: "Climate",
    style: "climate",
    desc: "Five major climate zones, twenty-eight subtypes, defined by monthly temperature and precipitation thresholds.",
    context: "Köppen, trained as a botanist, built his classification on what vegetation could grow where. Climate, for him, was a question that plants answered first.",
    matters: "Still the most widely used climate classification on Earth, and the visual basis for nearly every climate-change communication map of the last fifty years.",
    reveals: "The thinness of temperate Europe; how much of Earth's surface is tropical rainforest, desert, or subarctic; the way the system is now visibly shifting under warming.",
    meaning: "Scientific. A model of how a single careful taxonomy can outlast every empire it was drawn under.",
    bias: "Boundaries are statistical, not crisp; the system encodes mid-latitude assumptions about what counts as a 'normal' year.",
    related: ["Himalayan Topographic Map", "Mercator Projection"],
    source: "Deutscher Wetterdienst",
    views: 16780,
    added: "2024-04-02",
  },
  {
    id: "himalaya-topo",
    title: "Himalayan Topographic Survey",
    year: "1956",
    period: "Contemporary world",
    century: "20th c.",
    region: "Himalayas, South Asia",
    country: "India / Nepal",
    author: "Survey of India",
    type: "Topographic Map",
    civilization: "Modern Scientific",
    theme: "Topography",
    style: "topo",
    desc: "1:250,000 contour map of the eastern Himalayas, with Everest, Lhotse, and Makalu rendered as tight concentric isolines.",
    context: "Compiled in the decade after Indian independence, when the Survey of India was remapping the subcontinent without British oversight for the first time in two centuries.",
    matters: "Topographic surveys are the substrate beneath all modern geography — the maps everything else gets drawn on top of.",
    reveals: "How fractal mountain ranges look when you draw every fifty metres of elevation: like flow patterns, or fingerprints.",
    meaning: "Scientific and infrastructural. Topographic survey is what makes roads, dams, and borders possible.",
    bias: "Coverage is dense in surveyed valleys and political borderlands; remote ranges are extrapolated from aerial photography.",
    related: ["Köppen Climate Classification", "Roman road map"],
    source: "Survey of India archive",
    views: 7204,
    added: "2024-04-20",
  },
  {
    id: "indigenous-territories",
    title: "Indigenous Territories of Turtle Island",
    year: "2018",
    period: "Contemporary world",
    century: "21st c.",
    region: "North America",
    country: "—",
    author: "Native Land Digital",
    type: "Indigenous Cartography",
    civilization: "Indigenous Nations",
    theme: "Indigenous",
    style: "indigenous",
    desc: "Overlapping polygons of indigenous territory, language, and treaty area, made by indigenous communities rather than by colonial states.",
    context: "Indigenous mapping projects refuse the cartographic conventions of the nation-state: borders are porous, multiple, and frequently disputed by their own makers.",
    matters: "It reframes the same physical landmass as a palimpsest of nations that long predate the colonial states drawn on top of them.",
    reveals: "That every modern North American state contains multiple, overlapping indigenous nations whose territories were never extinguished — only overwritten.",
    meaning: "Political and cultural. The act of mapping is a claim, and indigenous communities are claiming.",
    bias: "Designed as a starting point for conversation, not as a settled boundary atlas; territories are approximate and continuously revised.",
    related: ["Map of Tenochtitlan", "Spanish colonial map of the Americas"],
    source: "native-land.ca",
    views: 14903,
    added: "2024-05-01",
  },
  {
    id: "fantasy",
    title: "An Imagined Atlas",
    year: "1932",
    period: "Industrial era",
    century: "20th c.",
    region: "—",
    country: "—",
    author: "Anonymous illustrator",
    type: "Artistic Map",
    civilization: "Imaginary",
    theme: "Artistic",
    style: "artistic",
    desc: "A speculative archipelago of invented lands — sea monsters in the margins, ornate compass rose, no scale bar that means anything.",
    context: "Artistic maps have always existed alongside scientific ones. They borrow cartography's authority to make imagined places feel real.",
    matters: "Reminds us that the visual conventions of maps — frames, compass roses, scale bars — are persuasive even when applied to fictions.",
    reveals: "How easily a viewer extends trust to anything drawn in cartographic dress.",
    meaning: "Cultural. The map as literature.",
    bias: "Entirely.",
    related: ["Map of Tenochtitlan", "Tabula Rogeriana"],
    source: "Private collection",
    views: 6510,
    added: "2024-05-11",
  },
  {
    id: "roman-roads",
    title: "Tabula Peutingeriana (Roman Road Map)",
    year: "c. 4th c. CE (12th c. copy)",
    period: "Classical Antiquity",
    century: "4th c.",
    region: "Roman Empire",
    country: "Roman Empire",
    author: "Anonymous / Medieval copyist",
    type: "Itinerary Map",
    civilization: "Roman",
    theme: "Empire",
    style: "scroll",
    desc: "A 22-foot scroll of the Roman road network — compressed north-to-south so the cursus publicus reads as a continuous strip from Britain to India.",
    context: "An itinerary, not a survey. Distances are measured in days of travel; the goal is to plan a journey, not to depict a shape.",
    matters: "The clearest surviving artefact of how the Roman state actually moved: a logistics map, in modern terms.",
    reveals: "The unbelievable density of the imperial road network — and the Mediterranean compressed into a thin channel because, from a courier's perspective, it was.",
    meaning: "Infrastructural. The empire was the road.",
    bias: "Massively distorted north-south to fit the scroll format; coastlines are caricatured; the focus is on stations, not on shapes.",
    related: ["Himalayan Topographic Map", "Silk Road map"],
    source: "Österreichische Nationalbibliothek, Vienna",
    views: 17402,
    added: "2024-03-21",
  },
  {
    id: "ottoman",
    title: "Ottoman Empire at its Apex",
    year: "1683",
    period: "Colonial empires",
    century: "17th c.",
    region: "Mediterranean, North Africa, Middle East, Balkans",
    country: "Ottoman Empire",
    author: "Court Cartography Department, Istanbul",
    type: "Political Map",
    civilization: "Ottoman",
    theme: "Empire",
    style: "ottoman",
    desc: "The Ottoman world the year of the second siege of Vienna — three continents under one administration, drawn from the imperial center.",
    context: "Drawn at the high-water mark of Ottoman expansion, and just months before the military reversal at Vienna that began two centuries of slow retreat.",
    matters: "It centers a non-Western empire on its own terms — a useful corrective to the European cartographic record of the same period.",
    reveals: "The Mediterranean as an Ottoman lake; the Black Sea as a fully internal water; the empire's careful tolerance of religious minorities in the millet system.",
    meaning: "Political. To map from Istanbul is to flip the European mental map.",
    bias: "Provincial borders are administrative rather than ethnographic; vassal states are absorbed into the imperial color.",
    related: ["Tabula Rogeriana", "Silk Road map", "British Empire Map"],
    source: "Topkapı Palace Museum archives",
    views: 13902,
    added: "2024-04-08",
  },
  {
    id: "silk-road",
    title: "The Silk Road, c. 700–1400",
    year: "c. 1400",
    period: "Medieval period",
    century: "14–15th c.",
    region: "Eurasia",
    country: "—",
    author: "Composite (modern reconstruction)",
    type: "Trade Route",
    civilization: "Cross-civilizational",
    theme: "Trade",
    style: "route",
    desc: "Caravan routes from Chang'an to Constantinople, with maritime branches through the Indian Ocean and Red Sea.",
    context: "Never a single road. The 'Silk Road' is a 19th-century coinage describing a thousand years of overlapping commercial, religious, and microbial exchange.",
    matters: "The first sustained trans-Eurasian network — the substrate of medieval globalization.",
    reveals: "How much of Eurasian history happens in the steppe corridor that European maps tend to leave blank.",
    meaning: "Commercial and cultural. Goods, religions, and pathogens move along the same lines.",
    bias: "Imposes a coherent network on what was actually a shifting patchwork; underplays maritime trade.",
    related: ["Tabula Rogeriana", "Ottoman Empire map", "Portolan Charts"],
    source: "UNESCO Silk Roads Programme",
    views: 28341,
    added: "2024-02-19",
  },
  {
    id: "spanish-colonial",
    title: "Spanish Colonial Map of the Americas",
    year: "1562",
    period: "Age of Exploration",
    century: "16th c.",
    region: "Americas",
    country: "Spanish Empire",
    author: "Diego Gutiérrez",
    type: "Colonial Map",
    civilization: "Spanish Empire",
    theme: "Empire",
    style: "colonial",
    desc: "The largest map of the Americas printed in the 16th century — engraved in Antwerp from royal sources in Seville.",
    context: "Commissioned to assert Spanish claims against Portuguese, French, and emerging English interests in the New World.",
    matters: "It is the document that fixed 'America' in the European cartographic vocabulary, and it is also a working instrument of dispossession.",
    reveals: "Sea monsters and indigenous figures co-existing with new river systems and city names; a hybrid object that is half ethnographic atlas, half title deed.",
    meaning: "Political. The map exists to support a sovereign claim.",
    bias: "Indigenous polities are drawn as picturesque scenery; the Spanish toponymy is exhaustive; the Amazon and the Pacific are conjectural.",
    related: ["Map of Tenochtitlan", "British Empire Map", "Indigenous territorial map"],
    source: "U.S. Library of Congress",
    views: 11203,
    added: "2024-03-09",
  },
  {
    id: "nautical-chart",
    title: "North Atlantic Nautical Chart",
    year: "1856",
    period: "Industrial era",
    century: "19th c.",
    region: "North Atlantic",
    country: "United States",
    author: "U.S. Coast Survey",
    type: "Nautical Chart",
    civilization: "Industrial",
    theme: "Navigation",
    style: "nautical",
    desc: "Soundings in fathoms, lighthouse positions, magnetic declination — the working instrument of a 19th-century pilot.",
    context: "Produced by the U.S. Coast Survey, then the nation's most ambitious scientific agency, employing more PhDs than any university.",
    matters: "Modern hydrography was invented in the 19th century, and these charts are its first mature artefacts.",
    reveals: "How dense the offshore information layer became once steam, telegraphy, and reliable chronometers met systematic survey work.",
    meaning: "Infrastructural. A working chart, not a celebratory one.",
    bias: "Coverage is densest along shipping lanes; offshore depths are extrapolated by line-soundings hundreds of miles apart.",
    related: ["Portolan Charts", "Mercator Projection"],
    source: "NOAA Historical Map & Chart Collection",
    views: 8902,
    added: "2024-04-15",
  },
];

/* =========================================================
   SVG generators per style
   - viewBox is normalized to 400x300; container scales.
   - Each returns an SVG string.
   ========================================================= */

function rng(seed) { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }

const palette = {
  ancient:    { paper: "#3a2f23", land: "#6e5a3a", line: "#bda270", deep: "#1f1a14" },
  medieval:   { paper: "#3d2e1f", land: "#a87446", line: "#d7b07e", deep: "#1f1810" },
  renaissance:{ paper: "#352c20", land: "#7a6440", line: "#c9a76b", deep: "#1a150f" },
  projection: { paper: "#1d2230", land: "#3b4a64", line: "#a4b6d2", deep: "#11141c" },
  portolan:   { paper: "#3b2e1d", land: "#7c5d34", line: "#d6b070", deep: "#1c160e" },
  city:       { paper: "#2b2417", land: "#8b6a3d", line: "#dbb474", deep: "#19140c" },
  imperial:   { paper: "#2a1f1c", land: "#8a2f28", line: "#d68a78", deep: "#17100e" },
  coldwar:    { paper: "#1b1d22", land: "#3e495d", line: "#9aa9c2", deep: "#12141a" },
  climate:    { paper: "#1f2820", land: "#3e6b4a", line: "#9ccba6", deep: "#0f140f" },
  topo:       { paper: "#1f2622", land: "#3b5446", line: "#a6c4ad", deep: "#0f1311" },
  indigenous: { paper: "#262017", land: "#7e6238", line: "#cda36a", deep: "#16110a" },
  artistic:   { paper: "#2c2317", land: "#74583a", line: "#d9b97a", deep: "#16100a" },
  scroll:     { paper: "#3a2d1d", land: "#8d6a3a", line: "#dab474", deep: "#1c150e" },
  ottoman:    { paper: "#2a221c", land: "#7d5a35", line: "#d6b070", deep: "#16110b" },
  route:      { paper: "#2a221b", land: "#5d4a31", line: "#c8a560", deep: "#15100b" },
  colonial:   { paper: "#2b1f17", land: "#7e3a2c", line: "#cea18a", deep: "#16100c" },
  nautical:   { paper: "#1a2230", land: "#3e6986", line: "#a6d2e4", deep: "#0e131c" },
};

function mapSVG(style, seed = 1) {
  const p = palette[style] || palette.ancient;
  const r = rng(seed);
  let bg = `<rect width="400" height="300" fill="${p.paper}"/>`;
  let grain = `
    <defs>
      <radialGradient id="g${seed}" cx="50%" cy="40%" r="80%">
        <stop offset="0%" stop-color="${p.paper}" stop-opacity="0"/>
        <stop offset="100%" stop-color="${p.deep}" stop-opacity="0.7"/>
      </radialGradient>
    </defs>
    <rect width="400" height="300" fill="url(#g${seed})"/>`;

  let body = "";
  switch (style) {
    case "ancient": body = svgAncient(p, r); break;
    case "medieval": body = svgMedieval(p, r); break;
    case "renaissance": body = svgRenaissance(p, r); break;
    case "projection": body = svgProjection(p, r); break;
    case "portolan": body = svgPortolan(p, r); break;
    case "city": body = svgCity(p, r); break;
    case "imperial": body = svgImperial(p, r); break;
    case "coldwar": body = svgColdWar(p, r); break;
    case "climate": body = svgClimate(p, r); break;
    case "topo": body = svgTopo(p, r); break;
    case "indigenous": body = svgIndigenous(p, r); break;
    case "artistic": body = svgArtistic(p, r); break;
    case "scroll": body = svgScroll(p, r); break;
    case "ottoman": body = svgOttoman(p, r); break;
    case "route": body = svgRoute(p, r); break;
    case "colonial": body = svgColonial(p, r); break;
    case "nautical": body = svgNautical(p, r); break;
    default: body = svgAncient(p, r);
  }
  return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${bg}${body}${grain}</svg>`;
}

function blob(r, cx, cy, scale, sides = 18) {
  let d = "";
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2;
    const rad = scale * (0.7 + r() * 0.5);
    const x = cx + Math.cos(a) * rad;
    const y = cy + Math.sin(a) * rad * 0.7;
    d += (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1) + " ";
  }
  return d + "Z";
}

function svgAncient(p, r) {
  // 3 stylized continents around a central sea
  return `
    <path d="${blob(r, 110, 110, 65)}" fill="${p.land}" stroke="${p.line}" stroke-width="0.8"/>
    <path d="${blob(r, 260, 130, 80)}" fill="${p.land}" stroke="${p.line}" stroke-width="0.8"/>
    <path d="${blob(r, 200, 230, 70)}" fill="${p.land}" stroke="${p.line}" stroke-width="0.8"/>
    ${[140,180,220].map(y=>`<path d="M30 ${y} Q200 ${y-8} 370 ${y}" stroke="${p.line}" stroke-width="0.4" fill="none" opacity="0.4"/>`).join("")}
  `;
}
function svgMedieval(p, r) {
  // T-O style: circle, T inside dividing world
  return `
    <circle cx="200" cy="150" r="120" fill="${p.land}" stroke="${p.line}" stroke-width="1.6"/>
    <circle cx="200" cy="150" r="120" fill="none" stroke="${p.line}" stroke-width="0.4" stroke-dasharray="2 3"/>
    <path d="M200 30 L200 150 M80 150 L320 150" stroke="${p.deep}" stroke-width="6"/>
    <path d="M200 30 L200 150 M80 150 L320 150" stroke="${p.line}" stroke-width="0.8"/>
    ${Array.from({length:6}).map((_,i)=>`<circle cx="${200+Math.cos(i*1.04)*60}" cy="${150+Math.sin(i*1.04)*60}" r="2.5" fill="${p.line}"/>`).join("")}
  `;
}
function svgRenaissance(p, r) {
  // dual hemispheres
  return `
    <circle cx="130" cy="150" r="95" fill="${p.land}" opacity="0.55" stroke="${p.line}" stroke-width="0.8"/>
    <circle cx="270" cy="150" r="95" fill="${p.land}" opacity="0.55" stroke="${p.line}" stroke-width="0.8"/>
    <path d="${blob(r, 105, 130, 35)}" fill="${p.land}" stroke="${p.line}" stroke-width="0.6"/>
    <path d="${blob(r, 150, 175, 30)}" fill="${p.land}" stroke="${p.line}" stroke-width="0.6"/>
    <path d="${blob(r, 250, 130, 40)}" fill="${p.land}" stroke="${p.line}" stroke-width="0.6"/>
    <path d="${blob(r, 295, 180, 30)}" fill="${p.land}" stroke="${p.line}" stroke-width="0.6"/>
    <line x1="130" y1="55" x2="130" y2="245" stroke="${p.line}" stroke-width="0.3"/>
    <line x1="270" y1="55" x2="270" y2="245" stroke="${p.line}" stroke-width="0.3"/>
  `;
}
function svgProjection(p, r) {
  // mercator grid
  let lines = "";
  for (let x = 20; x <= 380; x += 30) lines += `<line x1="${x}" y1="20" x2="${x}" y2="280" stroke="${p.line}" stroke-width="0.4" opacity="0.5"/>`;
  for (let y = 30; y <= 280; y += 20) lines += `<line x1="20" y1="${y}" x2="380" y2="${y}" stroke="${p.line}" stroke-width="0.4" opacity="0.5"/>`;
  return `
    <rect x="20" y="20" width="360" height="260" fill="${p.land}" opacity="0.18"/>
    ${lines}
    <path d="M60 120 Q90 90 130 120 T200 130 T280 110 T350 130" fill="${p.land}" stroke="${p.line}" stroke-width="0.6"/>
    <path d="M80 200 Q120 180 170 210 T260 220 T330 200" fill="${p.land}" stroke="${p.line}" stroke-width="0.6"/>
    <path d="M40 80 L380 80" stroke="${p.line}" stroke-width="0.6"/>
    <path d="M40 220 L380 220" stroke="${p.line}" stroke-width="0.6"/>
  `;
}
function svgPortolan(p, r) {
  // rhumb lines + coast
  const cx = 200, cy = 150;
  let rhumbs = "";
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    rhumbs += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(a)*220}" y2="${cy + Math.sin(a)*180}" stroke="${p.line}" stroke-width="0.3" opacity="0.55"/>`;
  }
  return `
    ${rhumbs}
    <path d="M30 80 Q120 60 200 90 T370 80 L370 120 Q280 110 200 130 T30 120 Z" fill="${p.land}" stroke="${p.line}" stroke-width="0.8"/>
    <path d="M30 200 Q140 180 220 210 T370 200 L370 270 L30 270 Z" fill="${p.land}" stroke="${p.line}" stroke-width="0.8"/>
    <circle cx="${cx}" cy="${cy}" r="6" fill="${p.line}"/>
    <circle cx="${cx}" cy="${cy}" r="18" fill="none" stroke="${p.line}" stroke-width="0.5"/>
  `;
}
function svgCity(p, r) {
  // concentric city with causeways
  return `
    <rect x="20" y="20" width="360" height="260" fill="${p.deep}" opacity="0.4"/>
    <circle cx="200" cy="150" r="100" fill="${p.land}" opacity="0.55"/>
    <circle cx="200" cy="150" r="70" fill="${p.land}" opacity="0.7" stroke="${p.line}" stroke-width="0.6"/>
    <circle cx="200" cy="150" r="40" fill="${p.land}" stroke="${p.line}" stroke-width="0.8"/>
    <rect x="190" y="140" width="20" height="20" fill="${p.line}"/>
    ${[0, 90, 180, 270].map(d=>{const a=d*Math.PI/180; return `<line x1="${200+Math.cos(a)*40}" y1="${150+Math.sin(a)*40}" x2="${200+Math.cos(a)*180}" y2="${150+Math.sin(a)*180}" stroke="${p.line}" stroke-width="2"/>`;}).join("")}
    ${Array.from({length:24}).map((_,i)=>{const a=i/24*Math.PI*2;const rr=42+r()*25;return `<circle cx="${200+Math.cos(a)*rr}" cy="${150+Math.sin(a)*rr}" r="1.6" fill="${p.line}"/>`;}).join("")}
  `;
}
function svgImperial(p, r) {
  // mercator grid with red empire shading
  let grid = "";
  for (let x = 20; x <= 380; x += 30) grid += `<line x1="${x}" y1="20" x2="${x}" y2="280" stroke="${p.line}" stroke-width="0.2" opacity="0.3"/>`;
  for (let y = 30; y <= 280; y += 20) grid += `<line x1="20" y1="${y}" x2="380" y2="${y}" stroke="${p.line}" stroke-width="0.2" opacity="0.3"/>`;
  return `
    ${grid}
    <path d="${blob(r, 80, 70, 28)}" fill="${p.land}" opacity="0.85"/>
    <path d="${blob(r, 200, 80, 38)}" fill="${p.land}" opacity="0.85"/>
    <path d="${blob(r, 100, 180, 35)}" fill="${p.land}" opacity="0.85"/>
    <path d="${blob(r, 240, 200, 50)}" fill="${p.land}" opacity="0.85"/>
    <path d="${blob(r, 320, 110, 24)}" fill="${p.land}" opacity="0.85"/>
    <path d="${blob(r, 340, 220, 30)}" fill="${p.land}" opacity="0.85"/>
  `;
}
function svgColdWar(p, r) {
  // two-block coloring
  return `
    <path d="M30 60 Q90 50 160 70 L160 220 Q90 230 30 210 Z" fill="oklch(58% 0.08 240)" opacity="0.55"/>
    <path d="M170 60 Q220 50 290 65 L290 215 Q220 225 170 210 Z" fill="oklch(55% 0.12 30)" opacity="0.55"/>
    <path d="M300 60 Q350 70 380 80 L380 210 Q350 220 300 215 Z" fill="oklch(55% 0.12 30)" opacity="0.4"/>
    <path d="M30 230 Q200 250 380 235 L380 270 L30 270 Z" fill="${p.land}" opacity="0.35"/>
    <line x1="165" y1="55" x2="165" y2="225" stroke="${p.line}" stroke-width="0.5" stroke-dasharray="3 3"/>
  `;
}
function svgClimate(p, r) {
  // climate bands
  return `
    <rect x="0" y="20" width="400" height="40" fill="oklch(70% 0.06 230)" opacity="0.55"/>
    <rect x="0" y="60" width="400" height="40" fill="oklch(60% 0.06 145)" opacity="0.55"/>
    <rect x="0" y="100" width="400" height="40" fill="oklch(72% 0.09 80)" opacity="0.55"/>
    <rect x="0" y="140" width="400" height="50" fill="oklch(68% 0.13 50)" opacity="0.55"/>
    <rect x="0" y="190" width="400" height="40" fill="oklch(60% 0.06 145)" opacity="0.55"/>
    <rect x="0" y="230" width="400" height="50" fill="oklch(70% 0.06 230)" opacity="0.55"/>
    ${Array.from({length:16}).map((_,i)=>`<line x1="0" y1="${20+i*16}" x2="400" y2="${20+i*16}" stroke="${p.line}" stroke-width="0.2" opacity="0.4"/>`).join("")}
    <path d="${blob(r,160,140,50)}" fill="${p.land}" opacity="0.4" stroke="${p.line}" stroke-width="0.4"/>
    <path d="${blob(r,260,160,40)}" fill="${p.land}" opacity="0.4" stroke="${p.line}" stroke-width="0.4"/>
  `;
}
function svgTopo(p, r) {
  // concentric contours
  let lines = "";
  const peaks = [[140,140],[240,120],[310,180],[80,200]];
  peaks.forEach(([cx,cy], idx) => {
    for (let i = 1; i < 12; i++) {
      lines += `<ellipse cx="${cx + (idx%2?2:-2)*i}" cy="${cy + (idx%2?1:-1)*i*0.4}" rx="${i*6}" ry="${i*4}" fill="none" stroke="${p.line}" stroke-width="0.3" opacity="${0.7 - i*0.04}"/>`;
    }
  });
  return `${lines}<path d="M0 250 Q100 230 200 245 T400 240 L400 300 L0 300 Z" fill="${p.land}" opacity="0.5"/>`;
}
function svgIndigenous(p, r) {
  // overlapping organic territory shapes
  const cols = ["oklch(70% 0.1 30)","oklch(70% 0.08 100)","oklch(70% 0.09 160)","oklch(70% 0.09 220)","oklch(70% 0.1 300)"];
  let s = "";
  for (let i = 0; i < 6; i++) {
    const cx = 80 + r()*240, cy = 60 + r()*180;
    s += `<path d="${blob(r, cx, cy, 50 + r()*30)}" fill="${cols[i%cols.length]}" opacity="0.32" stroke="${p.line}" stroke-width="0.4"/>`;
  }
  return s;
}
function svgArtistic(p, r) {
  // stylized island archipelago + compass
  let s = "";
  for (let i = 0; i < 8; i++) {
    const cx = 50 + r()*300, cy = 50 + r()*200;
    s += `<path d="${blob(r, cx, cy, 18+r()*22)}" fill="${p.land}" stroke="${p.line}" stroke-width="0.5"/>`;
  }
  // compass rose
  s += `<g transform="translate(330,230)">
    ${[0,45,90,135].map(a=>`<line x1="0" y1="0" x2="${Math.cos(a*Math.PI/180)*22}" y2="${Math.sin(a*Math.PI/180)*22}" stroke="${p.line}" stroke-width="0.5"/><line x1="0" y1="0" x2="${-Math.cos(a*Math.PI/180)*22}" y2="${-Math.sin(a*Math.PI/180)*22}" stroke="${p.line}" stroke-width="0.5"/>`).join("")}
    <polygon points="0,-22 4,0 0,22 -4,0" fill="${p.line}"/>
    <circle r="4" fill="${p.paper}" stroke="${p.line}" stroke-width="0.6"/>
  </g>`;
  return s;
}
function svgScroll(p, r) {
  // long horizontal compressed strip
  return `
    <path d="M10 80 Q100 70 200 80 T390 75 L390 110 Q300 105 200 115 T10 110 Z" fill="${p.land}" stroke="${p.line}" stroke-width="0.6"/>
    <path d="M10 140 Q120 130 220 140 T390 135 L390 175 Q280 170 200 180 T10 175 Z" fill="${p.land}" stroke="${p.line}" stroke-width="0.6"/>
    <path d="M10 210 Q150 200 250 210 T390 205 L390 245 Q260 240 200 250 T10 240 Z" fill="${p.land}" stroke="${p.line}" stroke-width="0.6"/>
    ${Array.from({length:24}).map((_,i)=>`<circle cx="${15+i*16}" cy="${90+(i%2)*40}" r="2" fill="${p.line}"/>`).join("")}
  `;
}
function svgOttoman(p, r) {
  return `
    <path d="${blob(r, 200, 130, 110, 22)}" fill="${p.land}" stroke="${p.line}" stroke-width="0.8"/>
    <path d="${blob(r, 100, 220, 50)}" fill="${p.land}" opacity="0.6" stroke="${p.line}" stroke-width="0.4"/>
    <path d="${blob(r, 320, 230, 40)}" fill="${p.land}" opacity="0.6" stroke="${p.line}" stroke-width="0.4"/>
    <g transform="translate(200,140)">
      <path d="M0 -22 A22 22 0 1 0 12 18 A18 18 0 1 1 0 -22 Z" fill="${p.line}" opacity="0.7"/>
    </g>
  `;
}
function svgRoute(p, r) {
  // routes as dotted curves
  let s = `<path d="${blob(r, 200, 150, 130, 18)}" fill="${p.land}" opacity="0.5" stroke="${p.line}" stroke-width="0.4"/>`;
  const stops = [[50,180],[120,140],[200,170],[260,120],[330,150],[370,200]];
  for (let i = 0; i < stops.length-1; i++) {
    const [x1,y1] = stops[i], [x2,y2] = stops[i+1];
    s += `<path d="M${x1} ${y1} Q${(x1+x2)/2} ${(y1+y2)/2 - 20} ${x2} ${y2}" stroke="${p.line}" stroke-width="1" fill="none" stroke-dasharray="3 3"/>`;
  }
  stops.forEach(([x,y]) => s += `<circle cx="${x}" cy="${y}" r="3" fill="${p.line}"/>`);
  return s;
}
function svgColonial(p, r) {
  let s = "";
  for (let i = 0; i < 5; i++) s += `<path d="${blob(r, 80+i*70, 80+r()*150, 30+r()*22)}" fill="${p.land}" stroke="${p.line}" stroke-width="0.5"/>`;
  // arrows from one side
  s += `<path d="M380 50 Q200 100 50 130" stroke="${p.line}" stroke-width="0.8" fill="none" stroke-dasharray="4 3"/>`;
  s += `<path d="M380 150 Q200 200 50 240" stroke="${p.line}" stroke-width="0.8" fill="none" stroke-dasharray="4 3"/>`;
  return s;
}
function svgNautical(p, r) {
  let grid = "";
  for (let x = 0; x <= 400; x += 25) grid += `<line x1="${x}" y1="0" x2="${x}" y2="300" stroke="${p.line}" stroke-width="0.2" opacity="0.35"/>`;
  for (let y = 0; y <= 300; y += 25) grid += `<line x1="0" y1="${y}" x2="400" y2="${y}" stroke="${p.line}" stroke-width="0.2" opacity="0.35"/>`;
  let depths = "";
  for (let i = 0; i < 40; i++) depths += `<text x="${20+r()*360}" y="${30+r()*240}" font-family="monospace" font-size="6" fill="${p.line}" opacity="0.7">${Math.floor(r()*60)+5}</text>`;
  return `
    ${grid}
    <path d="M0 220 Q80 200 160 220 T320 215 T400 230 L400 300 L0 300 Z" fill="${p.land}" opacity="0.6"/>
    ${depths}
  `;
}

window.mapSVG = mapSVG;
void _CURATED_UNUSED; // retained for reference, not used at runtime
