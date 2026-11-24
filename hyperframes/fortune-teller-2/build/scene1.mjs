// SCENE 1 – the girl's anxiety. She sits opposite the fortune teller, worried, squeezing her hands; he listens,
// unreadable. Nobody speaks: the mouths are never animated (a narrator tells the story).
import { scene, place, glow } from "./lib.mjs";
import * as C from "./chars.mjs";
const P = C.PAL;

const R = { wall: "#3a1f2a", wallDk: "#2a1520", wood: "#4a2a1a", woodDk: "#2e1a10", woodHi: "#6a3e24", gold: "#c99a4a",
  purple: "#5a2a9a", purpleHi: "#9a5ae0", night: "#2a1650", curtain: "#7a1a1e", curtainSh: "#561014", runner: "#4a1a4a", runnerHi: "#6a2a62" };

// ── set pieces (frame coords) ───────────────────────────────────────────────────────────────────
function candle(id, x, y, h = 120, w = 34) {
  return `<g>
    <circle id="${id}-halo" cx="${x}" cy="${y - h - 30}" r="${90 + h * 0.3}" fill="url(#halo)" opacity="0.8"/>
    <rect x="${x - w / 2 - 10}" y="${y - 10}" width="${w + 20}" height="14" rx="4" fill="${R.woodDk}"/>
    <rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" rx="5" fill="#f1e2c2"/>
    <rect x="${x - w / 2}" y="${y - h}" width="${w * 0.3}" height="${h}" fill="#fff" opacity="0.35"/>
    <rect x="${x + w * 0.2}" y="${y - h}" width="${w * 0.3}" height="${h}" fill="#c9b08a" opacity="0.4"/>
    <path d="M ${x - w / 2},${y - h} C ${x - 6},${y - h + 10} ${x + 4},${y - h + 2} ${x + 8},${y - h + 16} L ${x + w / 2},${y - h} Z" fill="#e2cfa6"/>
    <path id="${id}-fl" d="M ${x},${y - h - 44} C ${x + 11},${y - h - 24} ${x + 11},${y - h - 8} ${x},${y - h - 4} C ${x - 11},${y - h - 8} ${x - 11},${y - h - 24} ${x},${y - h - 44} Z" fill="#ffc45a"/>
    <path d="M ${x},${y - h - 26} C ${x + 5},${y - h - 16} ${x + 5},${y - h - 10} ${x},${y - h - 7} C ${x - 5},${y - h - 10} ${x - 5},${y - h - 16} ${x},${y - h - 26} Z" fill="#fff4cc"/>
  </g>`;
}
function bottle(x, y, s, color) {
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M -10,-110 L 10,-110 L 10,-80 C 34,-66 40,-40 40,-20 L 40,0 L -40,0 L -40,-20 C -40,-40 -34,-66 -10,-80 Z" fill="${color}" opacity="0.75"/>
    <rect x="-12" y="-124" width="24" height="16" rx="3" fill="${R.woodHi}"/><path d="M -28,-40 C -28,-56 -20,-64 -12,-70" stroke="#fff" stroke-width="5" opacity="0.35" fill="none"/></g>`;
}
function books(x, y, w, h, seed) {
  const cols = ["#6a1c1c", "#2a3a5a", "#5a4020", "#3a2a4a", "#7a5a2a", "#2e4a3a", "#8a3a22"];
  let out = "", cx = x;
  for (let i = 0; cx < x + w - 14; i++) {
    const bw = 18 + ((i * 7 + seed) % 4) * 6, bh = h - ((i * 5 + seed) % 3) * 16;
    out += `<rect x="${cx}" y="${y - bh}" width="${bw - 3}" height="${bh}" fill="${cols[(i + seed) % cols.length]}"/>
      <rect x="${cx + 3}" y="${y - bh + 14}" width="${bw - 9}" height="5" fill="${R.gold}" opacity="0.5"/>`;
    cx += bw;
  }
  return out;
}
function shelf(x, y, w, h, rows, seed) {
  let out = `<rect x="${x - 16}" y="${y}" width="${w + 32}" height="${h}" fill="${R.woodDk}"/>`;
  const rh = h / rows;
  for (let r = 0; r < rows; r++) {
    const by = y + (r + 1) * rh - 14;
    out += `<rect x="${x}" y="${y + r * rh + 10}" width="${w}" height="${rh - 24}" fill="#1e100a"/>`;
    out += (r + seed) % 3 === 1
      ? bottle(x + w * 0.25, by, 0.8, "#4a6a5a") + bottle(x + w * 0.55, by, 0.65, "#6a3a7a") + bottle(x + w * 0.8, by, 0.9, "#7a5a2a")
      : books(x + 6, by, w - 12, rh - 46, seed + r);
    out += `<rect x="${x - 16}" y="${by}" width="${w + 32}" height="16" fill="${R.woodHi}"/>`;
  }
  return out;
}
function tapestry(x, y, w, h) {
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#2a1438"/>
    <rect x="${x + 14}" y="${y + 14}" width="${w - 28}" height="${h - 28}" fill="none" stroke="${R.gold}" stroke-width="3" opacity="0.7"/>
    <g transform="translate(${x + w / 2},${y + h * 0.45})" stroke="${R.gold}" fill="none" stroke-width="4" opacity="0.85">
      <path d="M -90,0 C -40,-56 40,-56 90,0 C 40,56 -40,56 -90,0 Z"/><circle r="30"/><circle r="12" fill="${R.gold}"/>
      <circle r="66" stroke-width="2" opacity="0.6"/><path d="M 0,-110 L 0,-80 M 0,80 L 0,110 M -120,0 L -100,0 M 100,0 L 120,0" stroke-width="3"/>
      <path d="M -60,140 L 60,140 M 0,120 L 0,170" stroke-width="3"/></g>
    <path d="M ${x},${y + h} l ${w / 8},26 l ${w / 8},-26 l ${w / 8},26 l ${w / 8},-26 l ${w / 8},26 l ${w / 8},-26 l ${w / 8},26 l ${w / 8},-26" fill="#2a1438"/></g>`;
}
function archWindow(x, y, w, h) {
  const r = w / 2;
  const vines = [...Array(9)].map((_, i) => `<ellipse cx="${x + 20 + (i % 3) * (w / 3)}" cy="${y + 60 + i * (h / 9)}" rx="16" ry="9" fill="#2a4a2a" transform="rotate(${(i * 40) % 90 - 45} ${x + 20 + (i % 3) * (w / 3)} ${y + 60 + i * (h / 9)})"/>`).join("");
  return `<g>
    <path d="M ${x - 24},${y + h} L ${x - 24},${y + r} A ${r + 24},${r + 24} 0 0,1 ${x + w + 24},${y + r} L ${x + w + 24},${y + h} Z" fill="${R.woodDk}"/>
    <path d="M ${x},${y + h} L ${x},${y + r} A ${r},${r} 0 0,1 ${x + w},${y + r} L ${x + w},${y + h} Z" fill="url(#nightsky)"/>
    ${[...Array(14)].map((_, i) => `<circle cx="${x + 30 + ((i * 53) % (w - 60))}" cy="${y + 60 + ((i * 97) % (h - 120))}" r="${1.5 + (i % 3)}" fill="#e9d8ff" opacity="0.7"/>`).join("")}
    <path d="M ${x + 40},${y + h} C ${x + 80},${y + h * 0.6} ${x + 30},${y + h * 0.4} ${x + 90},${y + h * 0.2}" stroke="#1a0e2a" stroke-width="8" fill="none" opacity="0.7"/>
    <path d="M ${x + w / 2},${y + 10} L ${x + w / 2},${y + h} M ${x},${y + h * 0.42} L ${x + w},${y + h * 0.42} M ${x},${y + h * 0.72} L ${x + w},${y + h * 0.72}" stroke="${R.woodDk}" stroke-width="14"/>
    <path d="M ${x + w / 4},${y + r * 0.3} L ${x + w / 4},${y + h} M ${x + w * 0.75},${y + r * 0.3} L ${x + w * 0.75},${y + h}" stroke="${R.woodDk}" stroke-width="8"/>
    ${vines}
  </g>`;
}
function curtain(x, y, w, h) {
  return `<g><path d="M ${x},${y} L ${x + w},${y} C ${x + w - 20},${y + h * 0.5} ${x + w + 10},${y + h * 0.8} ${x + w - 10},${y + h} L ${x},${y + h} Z" fill="${R.curtain}"/>
    ${[0.2, 0.45, 0.7].map((f) => `<path d="M ${x + w * f},${y} C ${x + w * f - 10},${y + h * 0.4} ${x + w * f + 14},${y + h * 0.7} ${x + w * f},${y + h}" stroke="${R.curtainSh}" stroke-width="16" fill="none"/>`).join("")}</g>`;
}
function crystalBall(id, x, y, r) {
  return `<g>
    <circle cx="${x}" cy="${y - r * 0.9}" r="${r * 2.6}" fill="url(#purpleGlow)" id="${id}-glow"/>
    <path d="M ${x - r * 0.9},${y + r * 0.1} L ${x + r * 0.9},${y + r * 0.1} L ${x + r * 0.7},${y + r * 0.5} L ${x + r},${y + r * 0.8} L ${x - r},${y + r * 0.8} L ${x - r * 0.7},${y + r * 0.5} Z" fill="#3a2418"/>
    <path d="M ${x - r * 0.9},${y + r * 0.1} L ${x + r * 0.9},${y + r * 0.1} L ${x + r * 0.84},${y + r * 0.22} L ${x - r * 0.84},${y + r * 0.22} Z" fill="${R.gold}" opacity="0.6"/>
    <circle cx="${x}" cy="${y - r * 0.9}" r="${r}" fill="url(#ballFill)"/>
    <path id="${id}-swirl" d="M ${x - r * 0.6},${y - r * 0.7} C ${x - r * 0.2},${y - r * 1.4} ${x + r * 0.5},${y - r * 0.4} ${x + r * 0.2},${y - r * 1.1}" stroke="#e2b8ff" stroke-width="${r * 0.08}" fill="none" opacity="0.5"/>
    <ellipse cx="${x - r * 0.35}" cy="${y - r * 1.35}" rx="${r * 0.25}" ry="${r * 0.15}" fill="#fff" opacity="0.7"/>
  </g>`;
}
function oldBooks(x, y) {
  return `<g><rect x="${x}" y="${y - 50}" width="200" height="50" rx="6" fill="#4a2a18"/><rect x="${x}" y="${y - 50}" width="200" height="10" fill="${R.gold}" opacity="0.5"/>
    <rect x="${x + 10}" y="${y - 96}" width="176" height="46" rx="6" fill="#3a2010"/><rect x="${x + 10}" y="${y - 76}" width="176" height="6" fill="${R.gold}" opacity="0.5"/></g>`;
}
function table(y) {
  return `<rect x="-40" y="${y}" width="1160" height="${1960 - y}" fill="#3a2014"/>
    <rect x="-40" y="${y}" width="1160" height="16" fill="${R.woodHi}"/>
    <path d="M 200,${y + 4} L 880,${y + 4} L 960,1960 L 120,1960 Z" fill="${R.runner}"/>
    <path d="M 200,${y + 4} L 880,${y + 4} L 960,1960 L 120,1960 Z" fill="url(#runnerPat)"/>
    <path d="M 200,${y + 4} L 880,${y + 4}" stroke="${R.gold}" stroke-width="4" opacity="0.6"/>`;
}
const DEFS = `
  <radialGradient id="halo"><stop offset="0" stop-color="#ffb24a" stop-opacity="0.55"/><stop offset="1" stop-color="#ffb24a" stop-opacity="0"/></radialGradient>
  <radialGradient id="purpleGlow"><stop offset="0" stop-color="#b46aff" stop-opacity="0.6"/><stop offset="1" stop-color="#b46aff" stop-opacity="0"/></radialGradient>
  <radialGradient id="ballFill" cx="0.4" cy="0.35" r="0.75"><stop offset="0" stop-color="#e6c2ff"/><stop offset="0.45" stop-color="#9a4ae6"/><stop offset="1" stop-color="#3a1272"/></radialGradient>
  <linearGradient id="nightsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a1a7a"/><stop offset="1" stop-color="#6a3ab4"/></linearGradient>
  <pattern id="runnerPat" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 30,6 L 54,30 L 30,54 L 6,30 Z" fill="none" stroke="${R.runnerHi}" stroke-width="3"/><circle cx="30" cy="30" r="5" fill="${R.gold}" opacity="0.4"/></pattern>`;

// the room behind her: bookshelf and tapestry left, the arched window right, candles on the console
function roomBehindGirl(id) {
  return `<defs>${DEFS}</defs>
    <rect width="1080" height="1920" fill="${R.wall}"/>
    ${shelf(-20, 250, 300, 900, 4, 1)}
    ${tapestry(300, 160, 250, 420)}
    ${archWindow(600, 220, 360, 720)}
    ${curtain(960, 120, 160, 1060)}
    <rect x="-40" y="1060" width="1160" height="40" fill="${R.woodHi}"/><rect x="-40" y="1100" width="1160" height="300" fill="${R.woodDk}"/>
    ${books(560, 1300, 420, 160, 3)}
    ${bottle(640, 1060, 0.9, "#7a5a2a")}${bottle(780, 1060, 1.1, "#4a3a6a")}${bottle(900, 1060, 0.8, "#3a5a6a")}
    ${candle(`${id}-ca`, 130, 1060, 150)}${candle(`${id}-cb`, 700, 1060, 120)}${candle(`${id}-cc`, 1010, 1060, 140)}`;
}
// the room behind him: bookshelf, tapestry right, window left, candles
function roomBehindMan(id) {
  return `<defs>${DEFS}</defs>
    <rect width="1080" height="1920" fill="${R.wall}"/>
    ${archWindow(-120, 200, 300, 700)}
    ${shelf(260, 120, 520, 1000, 5, 0)}
    ${tapestry(820, 140, 260, 460)}
    <rect x="-40" y="1060" width="1160" height="40" fill="${R.woodHi}"/><rect x="-40" y="1100" width="1160" height="300" fill="${R.woodDk}"/>
    ${candle(`${id}-ca`, 200, 1060, 150)}${candle(`${id}-cb`, 330, 1060, 100)}${candle(`${id}-cc`, 960, 1060, 130)}`;
}
const flickers = (id, dur) => `
    flicker("#${id}-ca-halo", ${dur}, 0.75, 0.15); flicker("#${id}-cb-halo", ${dur}, 0.7, 0.18); flicker("#${id}-cc-halo", ${dur}, 0.75, 0.14);
    flicker("#${id}-light", ${dur}, 0.85, 0.08);`;
// warm candlelight from the left, purple from the window on the right, over the characters
const light = (id, side = "left") => `<defs>${glow(`${id}-lw`, side === "left" ? -100 : 1180, 900, 1100, "#ffa04a", 0.38)}${glow(`${id}-lp`, side === "left" ? 1180 : -100, 700, 1000, "#8a4aff", 0.3)}</defs>
  <rect id="${id}-light" width="1080" height="1920" fill="url(#${id}-lw)" style="mix-blend-mode:screen"/>
  <rect width="1080" height="1920" fill="url(#${id}-lp)" style="mix-blend-mode:screen"/>
  <rect width="1080" height="1920" fill="#3a1030" opacity="0.18" style="mix-blend-mode:multiply"/>`;

// squeeze: the hands tighten and the thumbs rub, a few times, never in unison
function squeeze(g, t0, n, gap) {
  let js = "";
  for (let k = 0; k < n; k++) {
    const t = (t0 + k * gap).toFixed(2), d = (gap * 0.45).toFixed(2);
    js += `tl.to("#${g}-hands", { scaleX: 0.95, scaleY: 0.98, transformOrigin: "50% 60%", duration: ${d}, ease: "power2.inOut" }, ${t});
    tl.to("#${g}-hands", { scaleX: 1, scaleY: 1, transformOrigin: "50% 60%", duration: ${d}, ease: "power2.inOut" }, ${(+t + +d + 0.05).toFixed(2)});
    tl.to("#${g}-thumbA", { x: ${k % 2 ? 7 : -5}, y: ${k % 2 ? 3 : -2}, duration: ${(gap * 0.6).toFixed(2)}, ease: "sine.inOut" }, ${(+t + 0.08).toFixed(2)});
    tl.to("#${g}-thumbB", { x: ${k % 2 ? -4 : 5}, duration: ${(gap * 0.6).toFixed(2)}, ease: "sine.inOut" }, ${(+t + 0.2).toFixed(2)});\n`;
  }
  return js;
}

// ── shot 1: the girl, medium, over his shoulder ─────────────────────────────────────────────────
function s1a() {
  const id = "s1a", dur = 5.6, g = `${id}-g`, m = `${id}-m`;
  return { id, dur, html: scene({ id, dur, fadeIn: true, bg: R.wall, vignette: 0.78,
    layers: [
      { name: "bg", blur: 7, svg: roomBehindGirl(id) },
      { name: "char", svg: `
        <path d="M 250,560 C 250,420 330,380 540,380 C 750,380 830,420 830,560 L 840,1500 L 240,1500 Z" fill="#2a1410"/>
        <path d="M 280,560 C 280,450 350,420 540,420 C 730,420 800,450 800,560 L 800,1500 L 280,1500 Z" fill="${P.dressSh}"/>
        <path d="M 250,560 C 250,420 330,380 540,380 C 750,380 830,420 830,560" stroke="${R.woodHi}" stroke-width="16" fill="none"/>
        ${place(540, 760, 1.18, `<g id="${g}-tor">${C.girlBody(g)}</g>${C.girlHead(g)}`, `${g}-all`)}
        ${table(1470)}
        ${oldBooks(60, 1600)}
        ${crystalBall(`${id}-ball`, 160, 1580, 120)}
        ${light(id)}` },
      { name: "fg", blur: 14, svg: place(1060, 900, 1.2, C.manBackSide(m)) },
    ],
    js: `${flickers(id, dur)}
    flicker("#${id}-ball-glow", ${dur}, 0.85, 0.12);
    cam("bg", { scale: 1.06 }, { scale: 1.1 }, 0, ${dur});
    cam("char", { scale: 1.0 }, { scale: 1.05, y: -16 }, 0, ${dur});
    cam("fg", { scale: 1.0, x: 0 }, { scale: 1.04, x: 14 }, 0, ${dur});
    look("${g}", 7, 0, 0, 0.01); brows("${g}", -9, -9, 0, 0.01);
    tl.fromTo("#${g}-head", { rotation: 0, y: 0 }, { rotation: -2.5, y: 4, transformOrigin: "50% 90%", duration: 2.6, ease: "sine.inOut" }, 0.2);
    tl.to("#${g}-head", { rotation: -1, y: 0, transformOrigin: "50% 90%", duration: 2.4, ease: "sine.inOut" }, 2.9);
    tl.fromTo("#${g}-tor", { y: 0 }, { y: -6, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: 3 }, 0);
    blink("${g}", 1.5, 0.26); blink("${g}", 4.1, 0.28);
    brows("${g}", -12, -12, 2.2, 0.6); look("${g}", 6, 2, 2.6, 0.4); look("${g}", 8, 0, 3.3, 0.4);
    ${squeeze(g, 0.6, 5, 0.95)}
    ` }) };
}

// ── shot 2: the fortune teller, over her shoulder ────────────────────────────────────────────────
function s1b() {
  const id = "s1b", dur = 4.6, m = `${id}-m`, g = `${id}-g`;
  return { id, dur, html: scene({ id, dur, bg: R.wall, vignette: 0.78,
    layers: [
      { name: "bg", blur: 6, svg: roomBehindMan(id) },
      { name: "char", svg: `
        <path d="M 230,480 C 230,330 330,290 540,290 C 750,290 850,330 850,480 L 860,1500 L 220,1500 Z" fill="#2a1410"/>
        <path d="M 270,480 C 270,360 350,330 540,330 C 730,330 810,360 810,480 L 810,1500 L 270,1500 Z" fill="${R.curtain}"/>
        <path d="M 230,480 C 230,330 330,290 540,290 C 750,290 850,330 850,480" stroke="${R.woodHi}" stroke-width="18" fill="none"/>
        ${place(560, 640, 0.98, C.manBody(m) + C.manHead(m), `${m}-all`)}
        ${table(1600)}
        ${crystalBall(`${id}-ball`, 940, 1720, 120)}
        ${light(id, "right")}` },
      { name: "fg", blur: 14, svg: place(40, 1000, 1.4, C.girlBack(g)) },
    ],
    js: `${flickers(id, dur)}
    flicker("#${id}-ball-glow", ${dur}, 0.85, 0.12);
    cam("bg", { scale: 1.06 }, { scale: 1.09 }, 0, ${dur});
    cam("char", { scale: 1.0 }, { scale: 1.045, y: -12 }, 0, ${dur});
    cam("fg", { scale: 1.0, x: 0 }, { scale: 1.04, x: -14 }, 0, ${dur});
    look("${m}", -4, 1, 0, 0.01);
    tl.fromTo(["#${m}-eyeL-lid", "#${m}-eyeR-lid"], { y: 3 }, { y: 3, duration: 0.01 }, 0);
    tl.fromTo("#${m}-head", { rotation: 0 }, { rotation: 1.2, transformOrigin: "50% 80%", duration: 4.4, ease: "sine.inOut" }, 0.1);
    tl.fromTo("#${m}-body", { y: 0 }, { y: -4, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0.2);
    blink("${m}", 2.0, 0.5);
    look("${m}", -3, 2, 3.2, 0.8);
    ` }) };
}

// ── shot 3: closer on her, the anxiety holds ─────────────────────────────────────────────────────
function s1c() {
  const id = "s1c", dur = 4.0, g = `${id}-g`;
  return { id, dur, html: scene({ id, dur, fadeOut: true, bg: R.wall, vignette: 0.82,
    layers: [
      { name: "bg", blur: 12, svg: roomBehindGirl(id) },
      { name: "char", svg: `
        <path d="M 120,560 C 120,360 260,300 540,300 C 820,300 960,360 960,560 L 980,1920 L 100,1920 Z" fill="#2a1410" opacity="0.9"/>
        <path d="M 170,560 C 170,400 300,350 540,350 C 780,350 910,400 910,560 L 910,1920 L 170,1920 Z" fill="${P.dressSh}"/>
        ${place(540, 860, 1.6, `<g id="${g}-tor">${C.girlBody(g)}</g>${C.girlHead(g)}`, `${g}-all`)}
        ${light(id)}` },
    ],
    js: `${flickers(id, dur)}
    cam("bg", { scale: 1.08 }, { scale: 1.12 }, 0, ${dur});
    cam("char", { scale: 1.0 }, { scale: 1.06, y: -20, origin: "50% 40%" }, 0, ${dur});
    look("${g}", 8, 0, 0, 0.01); brows("${g}", -12, -12, 0, 0.01);
    tl.fromTo("#${g}-tor", { y: 0 }, { y: -8, duration: 1.3, ease: "sine.inOut", yoyo: true, repeat: 2 }, 0);
    look("${g}", 2, 9, 0.8, 0.35);
    tl.fromTo("#${g}-head", { rotation: -1, y: 0 }, { rotation: 1.5, y: 8, transformOrigin: "50% 90%", duration: 0.6, ease: "power2.inOut" }, 0.8);
    blink("${g}", 1.6, 0.3);
    look("${g}", 8, 0, 2.0, 0.4);
    tl.to("#${g}-head", { rotation: -1.5, y: 0, transformOrigin: "50% 90%", duration: 0.7, ease: "power2.inOut" }, 1.95);
    brows("${g}", -15, -14, 2.2, 0.5);
    ${squeeze(g, 0.3, 4, 0.9)}
    ` }) };
}

// gradient and pattern ids are shared by the set pieces: make them unique per shot
const uniq = (shot) => ({ ...shot, html: shot.html.replace(/(id="|url\(#)(halo|purpleGlow|ballFill|nightsky|runnerPat)\b/g, `$1${shot.id}-$2`) });
export default [s1a(), s1b(), s1c()].map(uniq);

export { roomBehindGirl, roomBehindMan, table, crystalBall, candle, DEFS, light, oldBooks, R };
