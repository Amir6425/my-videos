// Part six: alone in the cabin. The pocket watch set to 06:00, the note, the old photo, and the four pieces of the map.
import { scene, place, glow } from "../../forest-cabin/build/lib.mjs";
import * as C from "../../forest-cabin/build/chars.mjs";
import { room, roomDefs, desk, clock, glass, chair, JEANS, fireJs, rainJs, tickJs, shakeJs, T, walk, armTo, warm, dark } from "../../forest-cabin-5/build/scenes.mjs";
const { RED } = C;

// ── Arash in his wet red hoodie and jeans ────────────────────────────────────────────────────────
const HC = { ...RED, shirt: "#8e2a28", shirtSh: "#6e1e1c", hair: "#140e0b", long: true, cuff: "#6e1e1c" };
const HOOD = `<path d="M -156,252 C -182,150 -122,90 -60,112 L 60,112 C 122,90 182,150 156,252 C 104,226 -104,226 -156,252 Z" fill="${HC.shirtSh}"/>
  <path d="M -126,238 C -60,216 60,216 126,238" stroke="#5a1614" stroke-width="8" fill="none"/>
  <path d="M -34,244 L -40,390 M 34,244 L 40,390" stroke="#e8e0d8" stroke-width="7" stroke-linecap="round"/><circle cx="-40" cy="394" r="7" fill="#c8c0b8"/><circle cx="40" cy="394" r="7" fill="#c8c0b8"/>
  <path d="M -112,420 L 112,420 L 132,540 L -132,540 Z" fill="${HC.shirtSh}" opacity="0.75"/>`;
const ARASH = (id, extra = {}) => C.friend(id, HC, { kind: "wavy", mouth: "tense", torsoExtra: HOOD + JEANS, ...extra });
function arashFull(p, extra = {}) {
  const leg = (id, x) => `<g id="${id}"><path d="M ${x - 44},600 L ${x + 44},600 L ${x + 36},1450 L ${x - 36},1450 Z" fill="#2c3650"/>
    <path d="M ${x - 40},1440 L ${x + 40},1440 C ${x + 56},1460 ${x + 64},1480 ${x + 64},1500 L ${x - 48},1500 C ${x - 48},1480 ${x - 46},1460 ${x - 40},1440 Z" fill="#eceef2"/><rect x="${x - 48}" y="1492" width="112" height="10" rx="4" fill="#9aa0ac"/></g>`;
  return `<g id="${p}-body">${leg(`${p}-legL`, -60)}${leg(`${p}-legR`, 60)}<path d="M -110,560 L 110,560 L 120,640 L -120,640 Z" fill="#2c3650"/>
    <clipPath id="${p}-waist"><rect x="-400" y="-400" width="800" height="985"/></clipPath><g clip-path="url(#${p}-waist)">${ARASH(p, { arms: [[6, -10], [-6, 10]], ...extra })}</g></g>`;
}
function arashBack(p, arms) {
  let s = C.friendBack(p, "r", arms ? { arms } : undefined).replace(/#c43a36/g, HC.shirt).replace(/#9a2a28/g, HC.shirtSh)
    .replace(/(<path d="M -?\d+,(240|415) L[^"]*" fill=")#c08562"/g, `$1${HC.shirtSh}"`);
  const i = s.indexOf(`<g id="${p}-torso">`), j = s.indexOf("</g>", i);
  return s.slice(0, j) + JEANS + `<path d="M -142,250 C -152,186 -100,136 0,136 C 100,136 152,186 142,250 C 122,334 60,384 0,394 C -60,384 -122,334 -142,250 Z" fill="${HC.shirtSh}"/><path d="M 0,150 L 0,390" stroke="#5a1614" stroke-width="5"/>` + s.slice(j);
}

// ── props ─────────────────────────────────────────────────────────────────────────────────────────
const RUQ = `@font-face { font-family: "Ruqaa"; src: url('assets/fonts/ArefRuqaa-Bold.woff2') format('woff2'); font-weight: 700; }`;
const hand = (flip = 1, tone = HC.skin) => `<g transform="scale(${flip},1)"><rect x="-58" y="0" width="116" height="700" fill="${HC.shirtSh}"/><rect x="-62" y="0" width="124" height="34" fill="#5a1614"/>
  <path d="M -50,0 C -56,-50 -50,-90 -36,-104 L 40,-104 C 56,-84 58,-40 50,0 Z" fill="${tone}"/><path d="M -36,-104 C -40,-132 -30,-142 -18,-128 L -10,-104 Z M 2,-106 C 0,-142 16,-148 22,-120 L 24,-104 Z" fill="${HC.skinSh}"/>
  <path d="M 44,-60 C 66,-70 80,-92 74,-110 C 68,-120 56,-112 54,-100 C 50,-86 44,-78 36,-74 Z" fill="${tone}"/></g>`;
// the pocket watch: an old brass case with a digital face showing 06:00; centre (0,0), radius ~120
function pocketWatch(id) {
  return `<g><path d="M 0,-150 C -30,-200 -40,-260 0,-300 C 40,-260 30,-200 0,-150" stroke="#b08a3a" stroke-width="8" fill="none"/>
    ${[...Array(9)].map((_, i) => `<ellipse cx="${-60 - i * 26}" cy="${-170 - Math.sin(i * 0.6) * 30}" rx="12" ry="8" fill="none" stroke="#c9a24a" stroke-width="5"/>`).join("")}
    <rect x="-22" y="-176" width="44" height="40" rx="10" fill="#c9a24a"/><circle cx="0" cy="-186" r="16" fill="#b08a3a"/>
    <circle r="132" fill="#8a6a2a"/><circle r="124" fill="#c9a24a"/><circle r="112" fill="#e0bc62"/>${[...Array(24)].map((_, i) => { const a = i * 15 * Math.PI / 180; return `<circle cx="${(118 * Math.sin(a)).toFixed(1)}" cy="${(-118 * Math.cos(a)).toFixed(1)}" r="3" fill="#8a6a2a"/>`; }).join("")}
    <circle r="96" fill="#2a2418"/><rect x="-76" y="-40" width="152" height="80" rx="10" fill="#9bb07a"/><rect x="-76" y="-40" width="152" height="80" rx="10" fill="url(#${id}-lcd)"/>
    <text x="0" y="22" font-family="'Courier New', monospace" font-weight="700" font-size="44" fill="#1e2a14" text-anchor="middle" letter-spacing="1">06<tspan id="${id}-colon">:</tspan>00</text>
    <path d="M -86,-60 C -60,-92 -20,-104 20,-100" stroke="#fff" stroke-width="7" fill="none" opacity="0.35" stroke-linecap="round"/></g>`;
}
const lcdDefs = (id) => `<linearGradient id="${id}-lcd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.25"/><stop offset="1" stop-color="#000" stop-opacity="0.1"/></linearGradient>`;
const foldedNote = `<g><path d="M -150,-90 L 150,-96 L 156,92 L -146,96 Z" fill="#d6c486"/><path d="M -150,-90 L 150,-96 L 152,-4 L -148,0 Z" fill="#e2d296"/><path d="M -148,0 L 152,-4" stroke="#b8a464" stroke-width="5"/>
  <path d="M -130,-70 C -60,-74 40,-80 120,-78" stroke="#a89058" stroke-width="3" opacity="0.4" fill="none"/></g>`;

// ── the map of the forest: full art, then four torn pieces ────────────────────────────────────────
const RUQT = (x, y, s, str, fill = "#3a1a10", rot = 0) => `<text x="${x}" y="${y}" font-family="Ruqaa" font-weight="700" font-size="${s}" fill="${fill}" text-anchor="middle" transform="rotate(${rot} ${x} ${y})">${str}</text>`;
function mapArt(id, { marks = true } = {}) {
  let sd = 3; const r = () => ((sd = (sd * 16807) % 2147483647) / 2147483647);
  const trees = [...Array(70)].map(() => { const x = -380 + r() * 760, y = -380 + r() * 760; if (Math.abs(x - 10) < 60 && y > -340) return ""; return `<path d="M ${x.toFixed(0)},${(y - 16).toFixed(0)} L ${(x - 11).toFixed(0)},${(y + 6).toFixed(0)} L ${(x + 11).toFixed(0)},${(y + 6).toFixed(0)} Z" fill="#4a6a3a" opacity="0.85"/>`; }).join("");
  const burnt = `<g transform="translate(-10,-280)"><path d="M 0,40 L 0,-30 M 0,-10 L -22,-34 M 0,-20 L 20,-44 M -12,-24 L -20,-46" stroke="#1a1410" stroke-width="7" stroke-linecap="round" fill="none"/></g>`;
  const mill = `<g transform="translate(40,0)"><rect x="-18" y="-30" width="36" height="44" fill="#6a4a2a"/><path d="M -22,-30 L 0,-50 L 22,-30 Z" fill="#3a2414"/><g stroke="#3a2414" stroke-width="7"><path d="M 0,-34 L -34,-68 M 0,-34 L 34,-68 M 0,-34 L -34,0 M 0,-34 L 34,0"/></g></g>`;
  const well = `<g transform="translate(-20,270)"><ellipse cx="0" cy="10" rx="24" ry="10" fill="#5a5048"/><rect x="-24" y="-6" width="48" height="16" fill="#6a5e52"/><path d="M -20,-6 L -20,-40 M 20,-6 L 20,-40 M -28,-40 L 28,-40" stroke="#3a2414" stroke-width="6"/></g>`;
  const cabin = `<g transform="translate(-250,330)"><rect x="-18" y="-12" width="36" height="24" fill="#5a3a22"/><path d="M -24,-12 L 0,-32 L 24,-12 Z" fill="#3a2414"/></g>`;
  const mk = (x, y, k) => `<g id="${id}-mk${k}" opacity="${marks ? 1 : 0}"><circle cx="${x}" cy="${y}" r="44" fill="none" stroke="#c0141a" stroke-width="7"/><circle cx="${x}" cy="${y}" r="10" fill="#c0141a"/></g>`;
  return `<rect x="-400" y="-400" width="800" height="800" fill="#d8c7a0"/><rect x="-400" y="-400" width="800" height="800" fill="url(#${id}-mapStain)"/>${trees}
    <path d="M -400,-200 C -250,-160 -200,-60 -120,-40 C -40,-20 160,40 400,20" stroke="#4a7aa8" stroke-width="12" fill="none" opacity="0.8"/>
    <path d="M -250,330 C -180,320 -100,300 -20,270 C 60,220 70,80 40,0 C 20,-80 -40,-200 -10,-280" stroke="#7a2a1a" stroke-width="6" stroke-dasharray="16 12" fill="none"/>
    ${cabin}${well}${mill}${burnt}${mk(-10, -280, 0)}${mk(40, -12, 1)}${mk(-20, 272, 2)}
    ${RUQT(-10, -200, 34, "درخت سوخته")}${RUQT(130, 30, 34, "آسیاب")}${RUQT(70, 300, 34, "چاه")}${RUQT(-250, 380, 26, "کلبه")}
    <g transform="translate(300,-300)" stroke="#5a4a32" stroke-width="4" fill="none"><circle r="44"/><path d="M 0,-60 L 0,60 M -60,0 L 60,0"/><path d="M 0,-60 L -12,-30 L 12,-30 Z" fill="#5a4a32"/></g>`;
}
const mapDefs = (id) => `<radialGradient id="${id}-mapStain" cx="50%" cy="50%" r="70%"><stop offset="0.6" stop-color="#7a5a2a" stop-opacity="0"/><stop offset="1" stop-color="#6a4a1a" stop-opacity="0.45"/></radialGradient>`;
// torn edges: zigzag cut lines through the middle
const zig = (n, amp, sd) => { let s = sd; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647); return [...Array(n + 1)].map((_, i) => [-400 + i * 800 / n, (r() - 0.5) * amp]); };
const VZ = zig(16, 40, 5), HZ = zig(16, 40, 9); // vertical cut (x offsets along y) and horizontal cut (y offsets along x)
function piecePoly(q) { // q: 0 TL, 1 TR, 2 BL, 3 BR
  const left = q % 2 === 0, top = q < 2;
  const vx = VZ.map(([y, o]) => [o, y]).filter(([, y]) => (top ? y <= HZ[8][1] + 0 : y >= 0) || true);
  const vcut = VZ.map(([y, o]) => [o, y]).filter(([, y]) => top ? y <= 0 : y >= 0); // along x≈0
  const hcut = HZ.map(([x, o]) => [x, o]).filter(([x]) => left ? x <= 0 : x >= 0); // along y≈0
  const X = left ? -400 : 400, Y = top ? -400 : 400;
  const pts = top ? [[X, Y], ...(left ? [] : []), ...(left ? vcut : vcut.slice().reverse()).map(([x, y]) => [x, y])]
                  : [[X, Y]];
  // build: corner → along outer edges → along cut lines
  let poly;
  if (q === 0) poly = [[-400, -400], ...vcut.slice().sort((a, b) => a[1] - b[1]), ...hcut.slice().sort((a, b) => b[0] - a[0]), [-400, HZ[0][1]]];
  if (q === 1) poly = [[400, -400], [400, HZ[16][1]], ...hcut.slice().sort((a, b) => b[0] - a[0]), ...vcut.slice().sort((a, b) => b[1] - a[1])];
  if (q === 2) poly = [[-400, 400], [-400, HZ[0][1]], ...hcut.slice().sort((a, b) => a[0] - b[0]), ...vcut.slice().sort((a, b) => a[1] - b[1])];
  if (q === 3) poly = [[400, 400], ...vcut.slice().sort((a, b) => b[1] - a[1]), ...hcut.slice().sort((a, b) => a[0] - b[0]), [400, HZ[16][1]]];
  void vx; void pts;
  return "M " + poly.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ") + " Z";
}
const PIECE_C = [[-200, -200], [200, -200], [-200, 200], [200, 200]];
// one piece drawn around its own centre (so it can be moved/rotated as an object)
function piece(id, q, { marks = true } = {}) {
  const [cx, cy] = PIECE_C[q];
  return `<g transform="translate(${-cx},${-cy})"><clipPath id="${id}-pc${q}"><path d="${piecePoly(q)}"/></clipPath>
    <path d="${piecePoly(q)}" fill="#000" opacity="0.3" transform="translate(8,10)"/><g clip-path="url(#${id}-pc${q})">${mapArt(`${id}q${q}`, { marks })}</g>
    <path d="${piecePoly(q)}" fill="none" stroke="#a8946a" stroke-width="4"/></g>`;
}
const pieceDefs = (id) => [0, 1, 2, 3].map((q) => mapDefs(`${id}q${q}`)).join("");

// ── rooms and walls ───────────────────────────────────────────────────────────────────────────────
const logsWall = (n = 30) => `<rect width="1080" height="1920" fill="#2a1a0e"/>${[...Array(n)].map((_, i) => `<rect y="${i * 66}" width="1080" height="62" rx="26" fill="${i % 2 ? "#3a2616" : "#33210f"}"/><path d="M ${(i * 137) % 900},${20 + i * 66} l 60,4" stroke="#24160a" stroke-width="3"/>`).join("")}`;
const shelfBooks = (x, y, w = 320, h = 760) => { let s = 4; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const rows = 4, rh = h / rows; let out = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#2e1a0c"/><rect x="${x + 12}" y="${y + 12}" width="${w - 24}" height="${h - 24}" fill="#1a0f06"/>`;
  for (let k = 0; k < rows; k++) { let bx = x + 20; const by = y + 12 + (k + 1) * rh - 14;
    while (bx < x + w - 40) { const bw = 20 + r() * 22, bh = rh * (0.55 + r() * 0.35); out += `<rect id="${k === 1 && bx > x + 120 && bx < x + 160 ? "BOOK" : ""}" x="${bx.toFixed(0)}" y="${(by - bh).toFixed(0)}" width="${bw.toFixed(0)}" height="${bh.toFixed(0)}" fill="${["#6a2a1a", "#2a4a3a", "#5a4a2a", "#3a2a4a", "#7a5a2a"][Math.floor(r() * 5)]}"/>`; bx += bw + 3; }
    out += `<rect x="${x}" y="${by}" width="${w}" height="16" fill="#3a2414"/>`; }
  return out.replace(/ id=""/g, ""); };
// the old photo: three boys in front of this cabin, sepia; the middle face scribbled out in red pencil
function photo(id, { scribble = true } = {}) {
  const boy = (p, x, c, kind) => place(x, 30, 0.34, C.friend(p, c, { kind, mouth: "tense" }));
  const A = { ...C.WHITE, shirt: "#8a8a80", shirtSh: "#6a6a60" }, B = { ...C.BLUE, shirt: "#5a5a6a", shirtSh: "#4a4a58" }, D = { ...RED, shirt: "#7a6a5a", shirtSh: "#5a4a3a", hair: "#2a1a10" };
  const cab = `<g transform="translate(0,-60) scale(0.5)"><rect x="-360" y="-420" width="720" height="420" fill="#4a3220"/>${[...Array(10)].map((_, i) => `<rect x="-360" y="${-420 + i * 42}" width="720" height="38" rx="19" fill="${i % 2 ? "#4a3220" : "#3e2a1a"}"/>`).join("")}
    <path d="M -420,-420 L 0,-690 L 420,-420 Z" fill="#241610"/><rect x="-70" y="-300" width="140" height="300" fill="#2a1a10"/><rect x="-300" y="-330" width="150" height="130" fill="#6a5a40"/><rect x="150" y="-330" width="150" height="130" fill="#6a5a40"/></g>`;
  return `<g><rect x="-260" y="-200" width="520" height="400" fill="#efe6d0"/><g style="filter: sepia(1) contrast(0.9) brightness(0.95)">
    <clipPath id="${id}-ph"><rect x="-230" y="-170" width="460" height="320"/></clipPath><g clip-path="url(#${id}-ph)">
      <rect x="-230" y="-170" width="460" height="320" fill="#8a9a8a"/>${cab}<rect x="-230" y="80" width="460" height="80" fill="#5a6a4a"/>
      ${boy(`${id}-b0`, -140, A, "fade")}${boy(`${id}-b1`, 0, D, "wavy")}${boy(`${id}-b2`, 140, B, "curly")}</g></g>
    <rect x="-230" y="-170" width="460" height="320" fill="#a8803a" opacity="0.18"/>
    ${scribble ? `<g id="${id}-scr">${[...Array(9)].map((_, i) => `<path class="${id}-sl" d="M ${-34 + (i % 3) * 4},${-10 + i * 7} C -10,${-30 + i * 7} 10,${10 + i * 7} ${38 - (i % 2) * 6},${-14 + i * 7}" stroke="#c0141a" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="90" stroke-dashoffset="0"/>`).join("")}</g>` : ""}</g>`;
}
const photoBack = (id) => `<g><rect x="-260" y="-200" width="520" height="400" fill="#e4d6b0"/><rect x="-260" y="-200" width="520" height="400" fill="url(#${id}-pbs)"/>
  ${[...Array(6)].map((_, i) => `<path d="M -230,${-150 + i * 60} L 230,${-152 + i * 60}" stroke="#c8b488" stroke-width="2" opacity="0.5"/>`).join("")}
  <g id="${id}-w0" opacity="0">${RUQT(80, -40, 62, "درخت سوخته…", "#2a1810", -4)}</g><g id="${id}-w1" opacity="0">${RUQT(-40, 50, 62, "آسیاب…", "#2a1810", 3)}</g><g id="${id}-w2" opacity="0">${RUQT(-140, 140, 62, "چاه", "#2a1810", -6)}</g></g>`;

// ── the shots ───────────────────────────────────────────────────────────────────────────────────
const DESK_ITEMS = (id, { glassOn = true, scrap = true } = {}) => `${scrap ? `<g transform="translate(120,-80) scale(0.27) rotate(-6)">${piece(id + "s", 3)}</g>` : ""}${glassOn ? `<g transform="translate(120,-76) scale(0.62)">${glass(`${id}-g`)}</g>` : ""}<g transform="translate(-200,-80) scale(0.62)">${clock(id, { h: 0, m: 0, s0: 0 })}</g>`;
const DESK_DEFS = (id) => pieceDefs(id + "s");

// 1. minutes pass: wide; the cold tea; the shut door
function g1(dur) {
  const id = "g1", r = `${id}-r`, A = 1.8, B = 3.1;
  return { id, dur, html: scene({ id, dur, bg: "#0a0604", vignette: 0.85,
    layers: [
      { name: "room", defs: roomDefs(id) + DESK_DEFS(id), svg: `<g id="${id}-pa">${room(id, { deskOn: false, hat: false })}
        <g transform="translate(700,1290)">${place(0, 0, 0.75, chair(id))}</g><g transform="${T(640, 1090, 0.5)}">${arashFull(r)}</g>
        <g transform="translate(640,1500)">${desk(id, DESK_ITEMS(id))}</g>${warm(0.15)}${dark(0.15)}</g>` },
      { name: "tea", defs: glow(`${id}-tg`, 900, 600, 900, "#ff9a40", 0.35) + pieceDefs(id + "t"), svg: `<g id="${id}-pb" opacity="0"><rect width="1080" height="1920" fill="#4a2e18"/>
        ${[...Array(9)].map((_, i) => `<path d="M 0,${300 + i * 190} C 300,${290 + i * 190} 700,${320 + i * 190} 1080,${296 + i * 190}" stroke="#3a2212" stroke-width="5" fill="none" opacity="0.7"/>`).join("")}
        <g transform="translate(540,1200) scale(0.85) rotate(-6)">${piece(id + "t", 3)}</g><g transform="translate(540,1180) scale(2.6)">${glass(`${id}-gt`)}<ellipse cx="0" cy="-84" rx="22" ry="4" fill="#5a1a08" opacity="0.6"/></g>
        <rect width="1080" height="1920" fill="url(#${id}-tg)" style="mix-blend-mode:screen"/>${dark(0.3)}</g>` },
      { name: "door", svg: `<g id="${id}-pc" opacity="0">${logsWall()}<rect x="300" y="240" width="480" height="1320" fill="#140c06"/><g transform="translate(320,260)"><rect width="440" height="1290" fill="#4a3020"/>
        ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${6 + i * 72}" y="6" width="68" height="1278" fill="${i % 2 ? "#52361f" : "#4a3020"}"/>`).join("")}<rect x="6" y="180" width="428" height="28" fill="#2a1a0e"/><rect x="6" y="1060" width="428" height="28" fill="#2a1a0e"/><circle cx="400" cy="660" r="18" fill="#8a7040"/></g>
        <rect y="1560" width="1080" height="360" fill="#26170c"/>${warm(0.2)}${dark(0.35)}</g>` },
    ],
    js: `${fireJs(id, dur)} ${rainJs(id, dur)} ${tickJs(id, dur, 0)}
    look("${r}", -9, 0, 0, 0.01); eyesOpen("${r}", 1.0, 0, 0.01); brows("${r}", -6, -8, 0, 0.01);
    cam("room", { scale: 1.0 }, { scale: 1.06, origin: "560px 1200px" }, 0, ${A});
    tl.set("#${id}-pa", { opacity: 0 }, ${A}); tl.set("#${id}-pb", { opacity: 1 }, ${A}); cam("tea", { scale: 1.0 }, { scale: 1.06, origin: "540px 1000px" }, ${A}, ${B - A});
    tl.set("#${id}-pb", { opacity: 0 }, ${B}); tl.set("#${id}-pc", { opacity: 1 }, ${B}); cam("door", { scale: 1.0 }, { scale: 1.05 }, ${B}, ${(dur - B).toFixed(2)});
    ` }) };
}
// close on his face
function faceShot(id, dur, js, { y = 860, s = 2.25, bg = "room" } = {}) {
  const r = `${id}-r`;
  return scene({ id, dur, bg: "#05060c", vignette: 0.9,
    layers: [
      { name: "bg", blur: 14, svg: `<rect width="1080" height="1920" fill="#2a1a0e"/><rect x="${bg === "room" ? 620 : 0}" y="0" width="460" height="1920" fill="#3a2010"/><rect x="80" y="300" width="300" height="420" fill="#0b1430"/>` + warm(0.2) },
      { name: "char", defs: glow(`${id}-wg`, 1100, 700, 900, "#ff9a40", 0.5), svg: `<g id="${id}-sh">${place(540, y, s, ARASH(r), `${r}-all`)}</g><rect width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/>` },
    ],
    js });
}
// 2. "where did he go?… what if those two…"
function g2(dur) {
  const id = "g2", r = `${id}-r`;
  return { id, dur, html: faceShot(id, dur, `
    look("${r}", -8, 0, 0, 0.01); eyesOpen("${r}", 1.0, 0, 0.01); brows("${r}", -8, -10, 0, 0.01);
    cam("char", { scale: 1.0 }, { scale: 1.12, origin: "50% 42%" }, 0, ${dur}, "power1.inOut");
    look("${r}", -3, 1, 1.9, 0.4); blink("${r}", 2.9, 0.2);
    eyesOpen("${r}", 1.45, 3.9, 0.35); brows("${r}", -22, -14, 3.9, 0.35); look("${r}", 0, 0, 4.0, 0.2);
    tl.fromTo("#${r}-torso", { y: 0 }, { y: -6, duration: 0.3, ease: "sine.inOut", yoyo: true, repeat: ${Math.floor((dur - 3.9) / 0.3) - 1} }, 3.9);
    ${shakeJs(`#${id}-sh`, 3.9, dur - 3.9, 3, 0.8)}`) };
}
// 3. the ticking comes from the drawer: he turns, leans, listens; then the drawer
function g3(dur) {
  const id = "g3", r = `${id}-r`, A = 3.1;
  const waves = [0, 1, 2].map((k) => `<path id="${id}-wv${k}" d="M -60,${-20 - k * 30} C -20,${-50 - k * 34} 20,${-50 - k * 34} 60,${-20 - k * 30}" stroke="#ffd890" stroke-width="5" fill="none" opacity="0"/>`).join("");
  return { id, dur, html: scene({ id, dur, bg: "#0a0604", vignette: 0.85,
    layers: [
      { name: "a", defs: glow(`${id}-wg`, 1100, 800, 900, "#ff9a40", 0.45) + DESK_DEFS(id), svg: `<g id="${id}-pa">${logsWall()}<rect x="0" y="1400" width="1080" height="520" fill="#26170c"/>
        <g transform="translate(560,640)">${place(0, 0, 1.4, ARASH(r), `${r}-all`)}</g>
        <g transform="translate(520,1470) scale(1.6)">${desk(id, DESK_ITEMS(id))}</g><rect width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/>${dark(0.15)}</g>` },
      { name: "b", svg: `<g id="${id}-pb" opacity="0"><rect width="1080" height="1920" fill="#2a180a"/><g transform="translate(700,700) scale(3.2)">${desk(id + "b")}</g>
        <g transform="translate(260,860)">${waves}</g>${warm(0.2)}${dark(0.2)}</g>` },
    ],
    js: `${tickJs(id, dur, 0)}
    look("${r}", -8, 0, 0, 0.01); eyesOpen("${r}", 1.1, 0, 0.01); brows("${r}", -10, -10, 0, 0.01);
    look("${r}", -4, 9, 1.0, 0.6); tl.to("#${r}-head", { rotation: -8, x: -12, y: 14, transformOrigin: "50% 85%", duration: 1.0, ease: "sine.inOut" }, 1.0);
    tl.to("#${r}-all", { rotation: -4, x: -20, y: 30, transformOrigin: "50% 100%", duration: 1.2, ease: "sine.inOut" }, 1.6);
    cam("a", { scale: 1.0 }, { scale: 1.08, origin: "540px 1000px" }, 0, ${A});
    tl.set("#${id}-pa", { opacity: 0 }, ${A}); tl.set("#${id}-pb", { opacity: 1 }, ${A}); cam("b", { scale: 1.0 }, { scale: 1.08, origin: "260px 880px" }, ${A}, ${(dur - A).toFixed(2)});
    ${[0, 1, 2].map((k) => [0, 1].map((n) => `tl.fromTo("#${id}-wv${k}", { opacity: 0.8 }, { opacity: 0, duration: 0.7 }, ${(A + 0.15 + n * 0.75 + k * 0.08).toFixed(2)});`).join(" ")).join(" ")}
    ` }) };
}
// 4. the drawer opens: a pocket watch beside the old man's glass; its face: 06:00
function g4(dur) {
  const id = "g4", A = 2.6, B = 6.3;
  const top = `<rect width="1080" height="1920" fill="#3a2414"/>${[...Array(8)].map((_, i) => `<path d="M 0,${60 + i * 120} C 300,${50 + i * 120} 700,${80 + i * 120} 1080,${56 + i * 120}" stroke="#2a180a" stroke-width="5" fill="none" opacity="0.7"/>`).join("")}`;
  return { id, dur, html: scene({ id, dur, bg: "#0a0604", vignette: 0.85,
    layers: [
      { name: "a", defs: pieceDefs(id + "s") + lcdDefs(id) + glow(`${id}-wg`, 1000, 300, 900, "#ff9a40", 0.4), svg: `${top}
        <g transform="translate(700,420) scale(0.5) rotate(-6)">${piece(id + "s", 3)}</g><g transform="translate(700,470) scale(1.8)">${glass(`${id}-g`)}</g>
        <rect x="0" y="880" width="1080" height="40" fill="#2a1608"/>
        <g id="${id}-dr" transform="translate(0,0)"><rect x="140" y="760" width="800" height="560" fill="#2a1a0c"/><rect x="170" y="790" width="740" height="500" fill="#1a0f06"/>
          <g transform="translate(420,1020) scale(1.15) rotate(8)">${foldedNote}</g><g transform="translate(470,1010) scale(1.25)">${pocketWatch(id)}</g>
          <rect x="120" y="1300" width="840" height="200" rx="10" fill="#5a3a20" stroke="#2e1a0c" stroke-width="8"/><rect x="460" y="1380" width="160" height="34" rx="17" fill="#c9a24a"/></g>
        <g id="${id}-hd" transform="translate(540,1500)">${hand()}</g>
        <rect width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/>${warm(0.2)}` },
    ],
    js: `
    tl.fromTo("#${id}-dr", { attr: { transform: "translate(0,-520)" } }, { attr: { transform: "translate(0,0)" }, duration: 1.4, ease: "power2.inOut" }, 0.5);
    tl.fromTo("#${id}-hd", { attr: { transform: "translate(540,980)" } }, { attr: { transform: "translate(540,1500)" }, duration: 1.4, ease: "power2.inOut" }, 0.5);
    tl.to("#${id}-hd", { attr: { transform: "translate(540,2400)" }, duration: 0.6, ease: "power2.in" }, 2.0);
    cam("a", { scale: 1.0 }, { scale: 1.0 }, 0, 0.01);
    tl.to("#${id}-a", { scale: 1.55, transformOrigin: "470px 1010px", duration: 1.0, ease: "power2.inOut" }, ${A});
    tl.to("#${id}-a", { scale: 2.6, transformOrigin: "470px 1010px", duration: 0.8, ease: "power2.inOut" }, ${B});
    ${[...Array(10)].map((_, k) => `tl.set("#${id}-colon", { opacity: ${k % 2 ? 1 : 0.15} }, ${(B + 0.4 + k * 0.5).toFixed(2)});`).join(" ")}
    ` }) };
}
// 5. the watch lifted; a folded yellow note underneath; he takes it
function g5(dur) {
  const id = "g5";
  return { id, dur, html: scene({ id, dur, bg: "#0a0604", vignette: 0.85,
    layers: [
      { name: "a", defs: lcdDefs(id), svg: `<rect width="1080" height="1920" fill="#1a0f06"/><rect x="40" y="200" width="1000" height="1500" fill="#140b05"/>
        <g id="${id}-np" transform="${T(540, 1040, 2.3, 8)}">${foldedNote}</g>
        <g id="${id}-wp" transform="${T(560, 960, 2.4)}">${pocketWatch(id)}</g>
        <g id="${id}-hd" transform="${T(560, 2300, 1.6)}">${hand()}</g>${warm(0.25)}` },
    ],
    js: `
    tl.fromTo("#${id}-hd", { attr: { transform: "${T(560, 2300, 1.6)}" } }, { attr: { transform: "${T(560, 1130, 1.6)}" }, duration: 0.6, ease: "power2.out" }, 0.1);
    tl.to("#${id}-wp", { attr: { transform: "${T(860, 300, 2.0, -20)}" }, duration: 0.9, ease: "power2.inOut" }, 0.75);
    tl.to("#${id}-hd", { attr: { transform: "${T(860, 470, 1.6)}" }, duration: 0.9, ease: "power2.inOut" }, 0.75);
    tl.set("#${id}-wp", { opacity: 0 }, 1.7); tl.to("#${id}-hd", { attr: { transform: "${T(560, 2300, 1.6)}" }, duration: 0.5, ease: "power2.in" }, 1.7);
    cam("a", { scale: 1.0 }, { scale: 1.12, origin: "540px 1040px" }, 0, ${dur});
    tl.to("#${id}-hd", { attr: { transform: "${T(540, 1260, 1.6)}" }, duration: 0.5, ease: "power2.out" }, 2.6);
    tl.to(["#${id}-hd", "#${id}-np"], { attr: { transform: "${T(540, 700, 2.3, -4)}" }, duration: 0.6, ease: "power2.inOut" }, 3.2);
    ` }) };
}
// 6. the note: «دوستانت تا طلوع زنده‌اند… جنگل جواب را می‌داند»
function g6(dur) {
  const id = "g6";
  return { id, dur, html: scene({ id, dur, bg: "#0a0604", vignette: 0.85, extraStyle: RUQ,
    layers: [
      { name: "bg", blur: 18, svg: `<rect width="1080" height="1920" fill="#2a1a0e"/><rect x="600" width="480" height="1920" fill="#4a2a10"/>` },
      { name: "note", defs: `<radialGradient id="${id}-ns" cx="50%" cy="50%" r="70%"><stop offset="0.5" stop-color="#7a5a2a" stop-opacity="0"/><stop offset="1" stop-color="#6a4a1a" stop-opacity="0.5"/></radialGradient>`, svg: `<g id="${id}-sh"><g transform="translate(540,900) rotate(-3)">
        <path d="M -440,-330 L 430,-350 L 446,330 L -430,350 Z" fill="#000" opacity="0.4" transform="translate(16,20)"/>
        <path d="M -440,-330 L 430,-350 L 446,330 L -430,350 Z" fill="#dccb8e"/><path d="M -440,-330 L 430,-350 L 446,330 L -430,350 Z" fill="url(#${id}-ns)"/><path d="M -436,0 L 440,-10" stroke="#b8a464" stroke-width="6"/>
        <g id="${id}-l0" opacity="0">${RUQT(20, -90, 92, "دوستانت تا طلوع زنده‌اند…", "#1e120c", -3)}</g>
        <g id="${id}-l1" opacity="0">${RUQT(-10, 140, 92, "جنگل جواب را می‌داند", "#1e120c", 2)}</g></g>
        <g transform="translate(60,1300) rotate(35)">${hand(1)}</g><g transform="translate(1020,1300) rotate(-35)">${hand(-1, HC.skinSh)}</g></g>${warm(0.15)}` },
    ],
    js: `
    ${shakeJs(`#${id}-sh`, 0, dur, 3, 0.7)}
    cam("note", { scale: 1.0 }, { scale: 1.08, origin: "540px 900px" }, 0, ${dur});
    tl.fromTo("#${id}-l0", { opacity: 0 }, { opacity: 1, duration: 1.4, ease: "none" }, 0.45);
    tl.fromTo("#${id}-l1", { opacity: 0 }, { opacity: 1, duration: 1.3, ease: "none" }, 3.35);
    ` }) };
}
// 7. he looks up from the note, terrified
function g7(dur) {
  const id = "g7", r = `${id}-r`;
  return { id, dur, html: faceShot(id, dur, `
    look("${r}", 0, 9, 0, 0.01); eyesOpen("${r}", 1.1, 0, 0.01); brows("${r}", -10, -12, 0, 0.01);
    tl.fromTo("#${r}-head", { y: 36, rotation: 4 }, { y: 0, rotation: 0, transformOrigin: "50% 90%", duration: 0.3, ease: "power3.out" }, 0.1);
    look("${r}", 0, 0, 0.12, 0.2); eyesOpen("${r}", 1.55, 0.15, 0.2); brows("${r}", -26, -14, 0.15, 0.2);
    cam("char", { scale: 1.0 }, { scale: 1.1, origin: "50% 42%" }, 0, ${dur}, "power2.out");`) };
}
// 8. he looks at the clock: midnight. Six hours.
function g8(dur) {
  const id = "g8", r = `${id}-r`, A = 2.3;
  const R = 220, arc = `M 0,${-R} A ${R},${R} 0 0 1 0,${R}`;
  return { id, dur, html: scene({ id, dur, bg: "#0a0604", vignette: 0.88,
    layers: [
      { name: "f", defs: glow(`${id}-wg`, 1100, 700, 900, "#ff9a40", 0.5), svg: `<g id="${id}-pa"><rect width="1080" height="1920" fill="#2a1a0e"/>${place(540, 860, 2.2, ARASH(r), `${r}-all`)}<rect width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/></g>` },
      { name: "c", svg: `<g id="${id}-pb" opacity="0"><rect width="1080" height="1920" fill="#3a2414"/>${[...Array(8)].map((_, i) => `<path d="M 0,${200 + i * 200} C 300,${190 + i * 200} 700,${220 + i * 200} 1080,${196 + i * 200}" stroke="#2a180a" stroke-width="5" fill="none" opacity="0.7"/>`).join("")}
        <g transform="translate(540,1280) scale(3.6)">${clock(id, { h: 0, m: 0, s0: 0 })}</g>
        <g transform="translate(540,${1280 - 96 * 3.6})"><path id="${id}-arc" d="${arc}" stroke="#c0141a" stroke-width="16" fill="none" opacity="0.75" stroke-dasharray="${(Math.PI * R).toFixed(0)}" stroke-dashoffset="${(Math.PI * R).toFixed(0)}"/></g>${warm(0.2)}</g>` },
    ],
    js: `${tickJs(id, dur, 0)}
    look("${r}", -2, -2, 0, 0.01); eyesOpen("${r}", 1.3, 0, 0.01); brows("${r}", -18, -12, 0, 0.01);
    look("${r}", 8, 7, 0.4, 0.4); tl.to("#${r}-head", { rotation: 5, x: 10, transformOrigin: "50% 85%", duration: 0.5 }, 0.4);
    tl.set("#${id}-pa", { opacity: 0 }, ${A}); tl.set("#${id}-pb", { opacity: 1 }, ${A});
    cam("c", { scale: 1.0 }, { scale: 1.1, origin: "540px 940px" }, ${A}, ${(dur - A).toFixed(2)});
    tl.to("#${id}-arc", { attr: { "stroke-dashoffset": 0 }, duration: 1.6, ease: "power1.inOut" }, 5.2);
    ` }) };
}
// 9. on the wall by the bookshelf, a crooked frame; the photo; the scribbled face
function g9(dur) {
  const id = "g9", A = 6.0, B = 10.8;
  const frame = (pid) => `<g transform="rotate(9)"><rect x="-300" y="-240" width="600" height="480" fill="#3a2010"/><rect x="-282" y="-222" width="564" height="444" fill="#5a3418"/><g transform="scale(1.0)">${photo(pid)}</g></g>`;
  return { id, dur, html: scene({ id, dur, bg: "#0a0604", vignette: 0.88,
    layers: [
      { name: "w", defs: glow(`${id}-wg`, 1100, 1200, 1000, "#ff9a40", 0.45), svg: `<g id="${id}-pa">${logsWall()}${shelfBooks(620, 420, 400, 1000)}
        <path d="M 330,330 L 300,520 M 330,330 L 380,520" stroke="#1a1008" stroke-width="3"/><circle cx="330" cy="330" r="7" fill="#1a1008"/>
        <g transform="translate(330,690) scale(0.5)">${frame(id + "a")}</g>
        <rect y="1500" width="1080" height="420" fill="#26170c"/><rect width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/>${dark(0.15)}</g>` },
      { name: "p", svg: `<g id="${id}-pb" opacity="0">${logsWall()}<g transform="translate(540,880) scale(1.65)">${frame(id + "b")}</g>${warm(0.2)}</g>` },
    ],
    js: `
    cam("w", { scale: 1.0 }, { scale: 1.5, origin: "330px 690px" }, 0, ${A}, "power1.inOut");
    tl.set("#${id}-pa", { opacity: 0 }, ${A}); tl.set("#${id}-pb", { opacity: 1 }, ${A});
    cam("p", { scale: 1.0, origin: "540px 880px" }, { scale: 1.15, origin: "540px 880px" }, ${A}, ${(B - A).toFixed(2)});
    tl.to("#${id}-p", { scale: 3.2, transformOrigin: "${540 + 0}px ${880 + 30 * 1.65}px", duration: 1.0, ease: "power2.inOut" }, ${B});
    tl.fromTo(".${id}b-sl", { attr: { "stroke-dashoffset": 90 } }, { attr: { "stroke-dashoffset": 0 }, duration: 0.25, stagger: 0.12, ease: "none" }, ${B + 0.6});
    tl.set(".${id}a-sl", { attr: { "stroke-dashoffset": 0 } }, 0);
    ` }) };
}
// 10. "who… who are they?" — his face; then over his shoulder he takes the frame off the wall
function g10(dur) {
  const id = "g10", r = `${id}-r`, k = `${id}-k`, A = 1.6;
  return { id, dur, html: scene({ id, dur, bg: "#0a0604", vignette: 0.88,
    layers: [
      { name: "f", defs: glow(`${id}-wg`, 1100, 700, 900, "#ff9a40", 0.5), svg: `<g id="${id}-pa"><rect width="1080" height="1920" fill="#2a1a0e"/>${place(540, 860, 2.2, ARASH(r), `${r}-all`)}<rect width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/></g>` },
      { name: "o", svg: `<g id="${id}-pb" opacity="0">${logsWall()}${shelfBooks(700, 300, 400, 1000)}
        <g id="${id}-fr" transform="translate(470,560) scale(0.62) rotate(9)"><rect x="-300" y="-240" width="600" height="480" fill="#3a2010"/><rect x="-282" y="-222" width="564" height="444" fill="#5a3418"/>${photo(id + "p")}</g>
        ${place(380, 1000, 1.5, arashBack(k), `${k}-all`)}${warm(0.2)}</g>` },
    ],
    js: `
    look("${r}", 4, -6, 0, 0.01); eyesOpen("${r}", 1.3, 0, 0.01); brows("${r}", -16, -6, 0, 0.01);
    look("${r}", -3, -6, 0.6, 0.3); look("${r}", 5, -5, 1.1, 0.3); cam("f", { scale: 1.0 }, { scale: 1.06, origin: "50% 42%" }, 0, ${A});
    tl.set("#${id}-pa", { opacity: 0 }, ${A}); tl.set("#${id}-pb", { opacity: 1 }, ${A});
    ${armTo(k, 1, -150, -10, A + 0.2, 0.8)}
    tl.to("#${id}-fr", { attr: { transform: "translate(500,760) scale(0.62) rotate(0)" }, duration: 0.8, ease: "power2.inOut" }, ${A + 1.1});
    ${armTo(k, 1, -110, -30, A + 1.1, 0.8)}
    cam("o", { scale: 1.0 }, { scale: 1.05 }, ${A}, ${(dur - A).toFixed(2)});
    ` }) };
}
// 11. he turns the photo over: «درخت سوخته… آسیاب… چاه»
function g11(dur) {
  const id = "g11", F = 1.3;
  return { id, dur, html: scene({ id, dur, bg: "#0a0604", vignette: 0.85, extraStyle: RUQ,
    layers: [
      { name: "bg", blur: 18, svg: `<rect width="1080" height="1920" fill="#2a1a0e"/><rect x="600" width="480" height="1920" fill="#4a2a10"/>` },
      { name: "ph", defs: `<radialGradient id="${id}-pbs" cx="50%" cy="50%" r="70%"><stop offset="0.5" stop-color="#7a5a2a" stop-opacity="0"/><stop offset="1" stop-color="#6a4a1a" stop-opacity="0.5"/></radialGradient>`, svg: `<g id="${id}-sh"><g transform="translate(540,880) scale(1.75) rotate(-2)">
        <g id="${id}-flip"><g id="${id}-front">${photo(id + "f")}</g><g id="${id}-back" opacity="0">${photoBack(id)}</g></g></g>
        <g transform="translate(90,1320) rotate(30)">${hand(1)}</g><g transform="translate(990,1320) rotate(-30)">${hand(-1, HC.skinSh)}</g></g>${warm(0.15)}` },
    ],
    js: `
    ${shakeJs(`#${id}-sh`, 0, dur, 2.5, 0.7)}
    tl.to("#${id}-flip", { scaleX: 0, transformOrigin: "50% 50%", duration: 0.3, ease: "power2.in" }, ${F});
    tl.set("#${id}-front", { opacity: 0 }, ${F + 0.3}); tl.set("#${id}-back", { opacity: 1 }, ${F + 0.3});
    tl.to("#${id}-flip", { scaleX: 1, transformOrigin: "50% 50%", duration: 0.3, ease: "power2.out" }, ${F + 0.3});
    cam("ph", { scale: 1.0 }, { scale: 1.1, origin: "540px 880px" }, 0, ${dur});
    tl.fromTo("#${id}-w0", { opacity: 0 }, { opacity: 1, duration: 0.6 }, 4.7); tl.fromTo("#${id}-w1", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 6.2); tl.fromTo("#${id}-w2", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 7.3);
    ` }) };
}
// 12. "it's a route… but I don't know this forest" — he walks to the window, looks out
function g12(dur) {
  const id = "g12", k = `${id}-k`;
  const rain = [...Array(40)].map((_, i) => `<path d="M ${140 + (i * 37) % 800},${(i * 71) % 900} l -14,70" stroke="#9ab4d8" stroke-width="3" opacity="0.55"/>`).join("");
  return { id, dur, html: scene({ id, dur, bg: "#05060c", vignette: 0.9,
    layers: [
      { name: "win", svg: `${logsWall()}<rect x="110" y="300" width="860" height="1000" fill="#140c06"/><rect x="134" y="324" width="812" height="952" fill="#070d1e"/>
        <clipPath id="${id}-wc"><rect x="134" y="324" width="812" height="952"/></clipPath><g clip-path="url(#${id}-wc)">
          ${[...Array(9)].map((_, i) => `<path d="M ${100 + i * 110},1276 L ${150 + i * 110},${700 + (i % 3) * 60} L ${200 + i * 110},1276 Z" fill="#03060e"/>`).join("")}<g id="${id}-rn">${rain}<g transform="translate(0,900)">${rain}</g></g></g>
        <path d="M 540,324 L 540,1276 M 134,800 L 946,800" stroke="#140c06" stroke-width="18"/><rect x="90" y="1290" width="900" height="30" fill="#3a2414"/>${warm(0.15)}` },
      { name: "k", svg: `<g id="${id}-pos" transform="${T(540, 1240, 1.1)}">${arashBack(k)}<g transform="translate(200,690) rotate(-8)"><rect x="-70" y="-56" width="140" height="112" fill="#3a2010"/><rect x="-62" y="-48" width="124" height="96" fill="#e4d6b0"/></g></g>${dark(0.1)}` },
    ],
    js: `${rainJs(id, dur, 900, 0.5)}
    tl.fromTo("#${id}-pos", { attr: { transform: "${T(540, 1240, 1.1)}" } }, { attr: { transform: "${T(540, 1060, 1.4)}" }, duration: 2.2, ease: "sine.inOut" }, 0);
    tl.fromTo("#${id}-pos", { y: 0 }, { y: -10, duration: 0.35, ease: "sine.inOut", yoyo: true, repeat: 5 }, 0);
    tl.to("#${k}-head", { y: 14, rotation: 2, transformOrigin: "50% 80%", duration: 1.0, ease: "sine.inOut" }, 2.6);
    cam("win", { scale: 1.0 }, { scale: 1.06 }, 0, ${dur});
    ` }) };
}
// the desk pedestal, close, with three drawers; d = which drawer is open how far
function drawerShot(id, dur, js, { which, extra = "" }) {
  const drawer = (k, y) => `<g id="${id}-d${k}"><rect x="160" y="${y}" width="760" height="300" rx="10" fill="#5a3a20" stroke="#2e1a0c" stroke-width="10"/><rect x="420" y="${y + 120}" width="240" height="50" rx="25" fill="#c9a24a"/><circle cx="540" cy="${y + 145}" r="10" fill="#8a6a2a"/></g>`;
  return scene({ id, dur, bg: "#0a0604", vignette: 0.88,
    layers: [
      { name: "a", defs: pieceDefs(id + "m") + glow(`${id}-wg`, 1100, 400, 1000, "#ff9a40", 0.4), svg: `<rect width="1080" height="1920" fill="#3a2414"/><rect x="100" y="80" width="880" height="1760" fill="#2a180a"/>
        <g id="${id}-box"><rect x="170" y="${which === 2 ? 880 : 1220}" width="740" height="300" fill="#140b05"/></g>
        ${[1, 2].map((k) => drawer(k, k === 1 ? 900 : 1240)).join("")}${drawer(0, 560)}
        ${extra}<rect width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/>${warm(0.2)}` },
    ],
    js });
}
// 13. the second drawer, half open: a torn scrap — a piece of a map!
function g13(dur) {
  const id = "g13";
  const extra = `<g id="${id}-mp" transform="${T(560, 1040, 0.5, -14)}">${piece(id + "m", 0)}</g><g id="${id}-hd" transform="${T(540, 2300, 1.5)}">${hand()}</g>`;
  return { id, dur, html: drawerShot(id, dur, `
    tl.set("#${id}-d1", { y: 90, scale: 1.04, transformOrigin: "540px 1050px" }, 0);
    cam("a", { scale: 1.0 }, { scale: 1.08, origin: "540px 1050px" }, 0, 2.4);
    tl.to("#${id}-hd", { attr: { transform: "${T(540, 1320, 1.5)}" }, duration: 0.6, ease: "power2.out" }, 2.3);
    tl.to("#${id}-d1", { y: 300, scale: 1.1, duration: 0.7, ease: "power2.inOut" }, 2.8); tl.to("#${id}-hd", { attr: { transform: "${T(540, 1620, 1.5)}" }, duration: 0.7, ease: "power2.inOut" }, 2.8);
    tl.to("#${id}-d1", { opacity: 0, duration: 0.01 }, 3.55); tl.to("#${id}-hd", { attr: { transform: "${T(540, 2300, 1.5)}" }, duration: 0.4, ease: "power2.in" }, 3.55);
    tl.to("#${id}-a", { scale: 1.35, transformOrigin: "560px 1040px", duration: 0.8, ease: "power2.inOut" }, 3.6);
    tl.to("#${id}-hd", { attr: { transform: "${T(560, 1240, 1.5)}" }, duration: 0.4, ease: "power2.out" }, 4.6);
    tl.to(["#${id}-mp"], { attr: { transform: "${T(560, 700, 0.9, -4)}" }, duration: 0.6, ease: "back.out(1.6)" }, 5.1); tl.to("#${id}-hd", { attr: { transform: "${T(560, 900, 1.5)}" }, duration: 0.6, ease: "back.out(1.6)" }, 5.1);
    `, { which: 1, extra }) };
}
// 14. the third drawer sticks; two hands tug; it bursts open; another piece
function g14(dur) {
  const id = "g14";
  const extra = `<g id="${id}-mp" transform="${T(560, 1380, 0.5, 12)}">${piece(id + "m", 1)}</g>
    <g id="${id}-hds" transform="translate(0,0)"><g transform="translate(470,1560) rotate(-10)">${hand(1)}</g><g transform="translate(610,1560) rotate(10)">${hand(-1, HC.skinSh)}</g></g>`;
  return { id, dur, html: drawerShot(id, dur, `
    ${[...Array(8)].map((_, k) => `tl.to(["#${id}-d2", "#${id}-hds"], { x: ${k % 2 ? 10 : -10}, y: ${k % 2 ? 8 : 0}, duration: 0.1, ease: "none" }, ${(0.4 + k * 0.22).toFixed(2)});`).join(" ")}
    tl.to(["#${id}-d2"], { x: 0, y: 330, scale: 1.12, transformOrigin: "540px 1390px", duration: 0.18, ease: "power4.out" }, 2.3);
    tl.to("#${id}-hds", { x: 0, y: 520, duration: 0.25, ease: "power3.out" }, 2.3);
    tl.to("#${id}-a", { scale: 0.92, y: 40, transformOrigin: "540px 1300px", duration: 0.2, ease: "power3.out" }, 2.3); tl.to("#${id}-a", { scale: 1.2, y: 0, duration: 0.8, ease: "power2.inOut" }, 2.6);
    tl.to("#${id}-d2", { opacity: 0, duration: 0.01 }, 2.6);
    tl.to("#${id}-hds", { y: 140, duration: 0.5, ease: "power2.out" }, 3.6);
    tl.to("#${id}-mp", { attr: { transform: "${T(560, 900, 0.9, 4)}" }, duration: 0.6, ease: "back.out(1.6)" }, 4.0); tl.to("#${id}-hds", { y: -340, duration: 0.6, ease: "back.out(1.6)" }, 4.0);
    `, { which: 2, extra }) };
}
// 15. a book from the shelf: the third piece between the pages; then the cold tea lifted: the fourth under it
function g15(dur) {
  const id = "g15", A = 3.0;
  return { id, dur, html: scene({ id, dur, bg: "#0a0604", vignette: 0.88,
    layers: [
      { name: "a", defs: pieceDefs(id + "m") + pieceDefs(id + "n") + glow(`${id}-wg`, 1100, 600, 900, "#ff9a40", 0.45), svg: `<g id="${id}-pa">${logsWall()}<g transform="translate(-200,-300) scale(1.6)">${shelfBooks(120, 300, 560, 900)}</g>
        <g id="${id}-bk" transform="${T(540, 1100, 1.0)}"><rect x="-140" y="-200" width="280" height="400" fill="#6a2a1a"/><rect x="-140" y="-200" width="30" height="400" fill="#4a1a10"/></g>
        <g id="${id}-open" opacity="0" transform="translate(540,1000)"><path d="M 0,-300 C -120,-330 -300,-320 -440,-290 L -440,300 C -300,270 -120,280 0,310 Z" fill="#e4d6b0"/><path d="M 0,-300 C 120,-330 300,-320 440,-290 L 440,300 C 300,270 120,280 0,310 Z" fill="#ecdfba"/>
          <path d="M 0,-300 L 0,310" stroke="#a8946a" stroke-width="6"/>${[...Array(9)].map((_, i) => `<path d="M -400,${-220 + i * 56} L -60,${-226 + i * 56} M 60,${-226 + i * 56} L 400,${-220 + i * 56}" stroke="#9a8a6a" stroke-width="4" opacity="0.5"/>`).join("")}
          <g id="${id}-pg" transform="translate(0,0)"><path d="M 0,-300 C 120,-330 300,-320 440,-290 L 440,300 C 300,270 120,280 0,310 Z" fill="#f2e6c4"/></g>
          <g id="${id}-mp" transform="${T(150, 20, 0.62, 8)}">${piece(id + "m", 2)}</g></g>
        <rect width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/>${warm(0.2)}</g>` },
      { name: "b", defs: glow(`${id}-tg`, 900, 500, 900, "#ff9a40", 0.35), svg: `<g id="${id}-pb" opacity="0"><rect width="1080" height="1920" fill="#4a2e18"/>
        ${[...Array(9)].map((_, i) => `<path d="M 0,${300 + i * 190} C 300,${290 + i * 190} 700,${320 + i * 190} 1080,${296 + i * 190}" stroke="#3a2212" stroke-width="5" fill="none" opacity="0.7"/>`).join("")}
        <g transform="translate(540,1180) scale(0.95) rotate(-6)">${piece(id + "n", 3)}</g>
        <g id="${id}-gl" transform="${T(560, 1150, 2.6)}">${glass(`${id}-g`)}</g><g id="${id}-hd" transform="${T(600, 2400, 2.0)}">${hand()}</g>
        <rect width="1080" height="1920" fill="url(#${id}-tg)" style="mix-blend-mode:screen"/>${dark(0.2)}</g>` },
    ],
    js: `
    tl.fromTo("#${id}-bk", { attr: { transform: "${T(540, 1100, 1.0)}" } }, { attr: { transform: "${T(540, 1000, 1.6)}" }, duration: 0.6, ease: "power2.out" }, 0.1);
    tl.set("#${id}-bk", { opacity: 0 }, 0.8); tl.set("#${id}-open", { opacity: 1 }, 0.8);
    ${[0, 1, 2].map((k) => `tl.fromTo("#${id}-pg", { scaleX: 1 }, { scaleX: -1, transformOrigin: "0% 50%", duration: 0.28, ease: "power1.inOut" }, ${(0.9 + k * 0.3).toFixed(2)});`).join(" ")}
    tl.set("#${id}-pg", { opacity: 0 }, 1.8);
    tl.to("#${id}-mp", { attr: { transform: "${T(0, -60, 0.8, -4)}" }, duration: 0.6, ease: "back.out(1.6)" }, 2.1);
    tl.set("#${id}-pa", { opacity: 0 }, ${A}); tl.set("#${id}-pb", { opacity: 1 }, ${A});
    tl.to("#${id}-hd", { attr: { transform: "${T(600, 1300, 2.0)}" }, duration: 0.6, ease: "power2.out" }, ${A + 0.6});
    tl.to("#${id}-gl", { attr: { transform: "${T(860, 420, 2.6)}" }, duration: 0.8, ease: "power2.inOut" }, ${A + 1.5}); tl.to("#${id}-hd", { attr: { transform: "${T(900, 570, 2.0)}" }, duration: 0.8, ease: "power2.inOut" }, ${A + 1.5});
    cam("b", { scale: 1.0 }, { scale: 1.12, origin: "540px 1180px" }, ${A}, ${(dur - A).toFixed(2)});
    ` }) };
}
// 16. "it was here from the start… right in front of me"
function g16(dur) {
  const id = "g16", r = `${id}-r`;
  return { id, dur, html: faceShot(id, dur, `
    look("${r}", 0, 9, 0, 0.01); eyesOpen("${r}", 1.25, 0, 0.01); brows("${r}", -16, -8, 0, 0.01); tl.set("#${r}-head", { y: 16 }, 0);
    cam("char", { scale: 1.0 }, { scale: 1.12, origin: "50% 45%" }, 0, ${dur}, "power1.inOut");
    blink("${r}", 1.4, 0.2); brows("${r}", -10, -16, 2.2, 0.5); tl.to("#${r}-head", { rotation: -3, duration: 1.4, ease: "sine.inOut", transformOrigin: "50% 85%" }, 2.0);`) };
}
// 17. from above: four pieces turned and slid together; the full map; three red marks; watch and photo beside
function g17(dur) {
  const id = "g17";
  const start = [[-310, -470, -40, 0.62], [330, -430, 30, 0.62], [-300, 470, 25, 0.62], [300, 420, -20, 0.62]];
  return { id, dur, html: scene({ id, dur, bg: "#0a0604", vignette: 0.85, extraStyle: RUQ,
    layers: [
      { name: "t", defs: pieceDefs(id + "m") + lcdDefs(id) + glow(`${id}-wg`, 1000, 300, 1000, "#ff9a40", 0.4), svg: `<rect width="1080" height="1920" fill="#4a2e18"/>
        ${[...Array(10)].map((_, i) => `<path d="M 0,${100 + i * 190} C 300,${90 + i * 190} 700,${120 + i * 190} 1080,${96 + i * 190}" stroke="#3a2212" stroke-width="5" fill="none" opacity="0.7"/>`).join("")}
        <g transform="translate(860,1640) scale(0.55) rotate(-14)">${photo(id + "p")}</g><g transform="translate(200,1650) scale(0.55) rotate(10)">${pocketWatch(id)}</g>
        <g transform="translate(540,880)">${[0, 1, 2, 3].map((q) => `<g id="${id}-q${q}" transform="${T(start[q][0], start[q][1], 1, start[q][2])}">${piece(id + "m", q)}</g>`).join("")}</g>
        <g transform="translate(540,880)" id="${id}-rings">${[[-10, -280], [40, -12], [-20, 272]].map(([x, y], k) => `<circle id="${id}-rg${k}" cx="${x}" cy="${y}" r="44" fill="none" stroke="#ff3a3a" stroke-width="8" opacity="0"/>`).join("")}</g>
        <rect width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/>${warm(0.15)}` },
    ],
    js: `
    tl.set("#${id}-t", { scale: 1.0 }, 0);
    ${[0, 1, 2, 3].map((q) => `tl.to("#${id}-q${q}", { attr: { transform: "${T(...[[-200, -200], [200, -200], [-200, 200], [200, 200]][q], 1, 0)}" }, duration: 0.9, ease: "power2.inOut" }, ${(0.4 + q * 0.6).toFixed(2)});`).join(" ")}
    cam("t", { scale: 1.08, origin: "540px 880px" }, { scale: 0.98, origin: "540px 880px" }, 0, 3.2);
    ${[0, 1, 2].map((k) => `tl.fromTo("#${id}-rg${k}", { opacity: 0.9, attr: { r: 44 } }, { opacity: 0, attr: { r: 110 }, duration: 0.9, ease: "power2.out", repeat: 2 }, ${(5.4 + k * 0.25).toFixed(2)});`).join(" ")}
    tl.to("#${id}-t", { scale: 1.06, transformOrigin: "540px 880px", duration: ${(dur - 5.3).toFixed(2)}, ease: "sine.inOut" }, 5.3);
    ` }) };
}

export const DURS = { g1: 4.9, g2: 6.1, g3: 4.6, g4: 10.0, g5: 4.4, g6: 5.5, g7: 1.3, g8: 7.6, g9: 14.2, g10: 3.8, g11: 8.0, g12: 4.1, g13: 6.7, g14: 5.0, g15: 6.0, g16: 4.9, g17: 8.0 };
export default [g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12, g13, g14, g15, g16, g17].map((f) => f(DURS[f.name]));
