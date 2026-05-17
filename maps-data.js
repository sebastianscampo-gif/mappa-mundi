/* ============ Mappa Mundi — SVG placeholder generators ============ */
// Used as fallback artwork when a real image fails to load or is unavailable.
// Style varies by era so placeholders feel period-appropriate.


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
