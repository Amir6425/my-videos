// Part ten (finale): the vote (94% follow the footprints); the scarecrow and the pit — Mehran, alive; the mill, the rope
// and the old newspaper — the fathers; Mehran pulled out; 5 a.m.; the stone well, 3-7-4, Sina out at sunrise;
// the old man: his son, thirty years ago, in this well.
import fs from "node:fs";
import { scene, place, glow } from "../../forest-cabin/build/lib.mjs";
import * as C from "../../forest-cabin/build/chars.mjs";
import { pine } from "../../forest-cabin/build/scenes.mjs";
import { shakeJs, T, warm, dark, walk, armTo, FELT, OLD_M } from "../../forest-cabin-5/build/scenes.mjs";
import { ARASH, arashFull, arashBack, hand, HC, mapArt, mapDefs, photo, pocketWatch, lcdDefs } from "../../forest-cabin-6/build/scenes.mjs";
import { straps, BAG } from "../../forest-cabin-7/build/scenes.mjs";
import { forest, rain, rainJs, torchDefs, torch, spotTo, spotSet, sneaker, FA, NASKH } from "../../forest-cabin-8/build/scenes.mjs";

const WJ = JSON.parse(fs.readFileSync(new URL("./words.json", import.meta.url), "utf8"));
const NJ = JSON.parse(fs.readFileSync(new URL("./narration.json", import.meta.url), "utf8")).scenes;
const OFF = Object.fromEntries(NJ.map((s) => [s.shot, s.offset]));
const wt = (shot, i) => +(WJ[shot].words[i].start + OFF[shot]).toFixed(2);
const IRAN = `@font-face { font-family: "IRANSans"; src: url('assets/fonts/IRANSans-Black.ttf') format('truetype'); font-weight: 900; }`;

// ── cast ─────────────────────────────────────────────────────────────────────────────────────────
const MEHRAN = (p, o = {}) => C.friend(p, { ...C.BLUE, shirt: "#3e6e3a", shirtSh: "#2c522a" }, { kind: "curly", mouth: "tense", ...o });
const SINA = (p, o = {}) => C.friend(p, { ...C.WHITE, shirt: "#e0aa1e", shirtSh: "#b8860e" }, { kind: "fade", beard: true, mouth: "tense", ...o });
const OLDH = (p, o = {}) => OLD_M(p, { headExtra: FELT, ...o });
const oldFull = (p) => `<g>${C.friendFull(p, "o").replace(/#2c3650/g, "#3a3028").replace(/#232b40/g, "#2a221c").replace(/#eceef2/g, "#2a1c14").replace(/#9aa0ac/g, "#1a120c").replace(/#4a3a2e/g, "#5a3e26").replace(/#3a2c22/g, "#46301c")}${FELT}</g>`;
const kidBoy = (p, c, kind) => C.friend(p, c, { kind, grin: true });

// ── set pieces ───────────────────────────────────────────────────────────────────────────────────
const sky = (top = "#0a1424", bot = "#04070c") => `<defs><linearGradient id="SKY" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#SKY)"/>`;
function treesRow(y, n, seed, col = "#06100e", hi = "#0a1a16", s0 = 0.5) {
  let s = seed; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return [...Array(n)].map((_, i) => `<g transform="translate(${-80 + i * (1240 / n) + r() * 40},${y + r() * 40}) scale(${s0 + r() * 0.25})">${pine(col, hi)}</g>`).join("");
}
// a side view of the dark forest floor: ground line at gy
const forestSide = (id, gy = 1500, seed = 5) => `${sky()}${treesRow(gy - 60, 12, seed, "#081410", "#0c1c18", 0.45)}<rect y="${gy - 200}" width="1080" height="300" fill="#7a8aa8" opacity="0.08"/>${treesRow(gy + 40, 6, seed + 7, "#040a08", "#06110e", 0.8)}
  <rect y="${gy}" width="1080" height="${1920 - gy}" fill="#140e08"/>${[...Array(30)].map((_, i) => `<ellipse cx="${(i * 97) % 1080}" cy="${gy + 20 + (i * 53) % (1900 - gy)}" rx="${14 + (i % 3) * 8}" ry="5" fill="#2a1e10"/>`).join("")}`;
const scarecrow = `<g><rect x="-14" y="-200" width="28" height="900" fill="#4a3220"/><rect x="-260" y="40" width="520" height="26" fill="#4a3220"/>
  <path d="M -230,40 L 230,40 L 190,380 L -190,380 Z" fill="#5a4a3a"/><path d="M -230,40 L -300,120 L -250,140 Z M 230,40 L 300,120 L 250,140 Z" fill="#c8a040"/>
  <path d="M -190,380 L -170,430 L -140,390 L -110,440 L -80,390 L -40,440 L 0,390 L 40,440 L 80,390 L 120,440 L 160,390 L 190,380 Z" fill="#5a4a3a"/>
  <path d="M -60,380 L -50,470 M 0,380 L 4,480 M 60,380 L 50,470" stroke="#c8a040" stroke-width="10"/>
  <ellipse cx="0" cy="-70" rx="120" ry="140" fill="#a88a5a"/><path d="M -120,-70 C -110,40 110,40 120,-70" fill="none" stroke="#8a6e42" stroke-width="6"/>
  <path d="M -64,-100 L -24,-60 M -24,-100 L -64,-60 M 24,-100 L 64,-60 M 64,-100 L 24,-60" stroke="#1a1008" stroke-width="10" stroke-linecap="round"/>
  <path d="M -60,0 L 60,0" stroke="#1a1008" stroke-width="6"/>${[-50, -30, -10, 10, 30, 50].map((x) => `<path d="M ${x},-12 L ${x},12" stroke="#1a1008" stroke-width="5"/>`).join("")}
  <path d="M -170,-150 L 170,-150 L 150,-176 L -150,-176 Z" fill="#2a2018"/><path d="M -100,-176 C -110,-290 90,-300 100,-176 Z" fill="#3a2a1e"/><path d="M 40,-260 L 70,-230 L 30,-220 Z" fill="#140e08"/>
  <path d="M 100,40 L 130,10 M 110,60 L 150,40 M -110,60 L -150,40" stroke="#c8a040" stroke-width="8"/></g>`;
// the cross-section of the pit: ground at gy, the hole x0..x1 down to by
function pitCut(id, { gy = 820, x0 = 400, x1 = 680, by = 1640 } = {}) {
  return `${sky()}${treesRow(gy - 40, 10, 9, "#081410", "#0c1c18", 0.4)}
    <path d="M 0,${gy} L ${x0},${gy} L ${x0 + 10},${by} L ${x1 - 10},${by} L ${x1},${gy} L 1080,${gy} L 1080,1920 L 0,1920 Z" fill="#2a1c10"/>
    ${[0, 1, 2, 3].map((i) => `<path d="M 0,${gy + 160 + i * 220} C 200,${gy + 140 + i * 220} 300,${gy + 190 + i * 220} ${x0},${gy + 170 + i * 220} M ${x1},${gy + 170 + i * 220} C 800,${gy + 150 + i * 220} 950,${gy + 190 + i * 220} 1080,${gy + 160 + i * 220}" stroke="#3a2818" stroke-width="10" fill="none"/>`).join("")}
    <path d="M ${x0},${gy} L ${x0 + 10},${by} L ${x1 - 10},${by} L ${x1},${gy} Z" fill="#0c0806"/><rect x="${x0 + 10}" y="${by - 30}" width="${x1 - x0 - 20}" height="30" fill="#2a1c10"/>
    <rect y="${gy - 14}" width="${x0}" height="20" fill="#2a3a1e"/><rect x="${x1}" y="${gy - 14}" width="${1080 - x1}" height="20" fill="#2a3a1e"/>
    <clipPath id="${id}-pc"><path d="M ${x0},${gy} L ${x0 + 10},${by} L ${x1 - 10},${by} L ${x1},${gy} Z"/></clipPath>`;
}
const beam = (id, x, y, x0, x1, by, op = 0.28) => `<path id="${id}-bm" d="M ${x - 12},${y} L ${x + 12},${y} L ${x1},${by} L ${x0},${by} Z" fill="#ffe08a" opacity="${op}"/>`;
const mill = `<g><path d="M -260,0 L -260,-420 L 0,-560 L 260,-420 L 260,0 Z" fill="#5a3a20"/>${[...Array(9)].map((_, i) => `<path d="M -260,${-40 - i * 44} L 260,${-40 - i * 44}" stroke="#3a2412" stroke-width="5"/>`).join("")}
  <path d="M -290,-410 L 0,-580 L 290,-410" stroke="#2a1a0c" stroke-width="26" fill="none"/><rect x="-70" y="-200" width="140" height="200" fill="#2a1a0c"/><rect x="120" y="-330" width="90" height="80" fill="#1a1208"/></g>`;
const wheel = (id) => `<g id="${id}-wh"><circle r="260" fill="none" stroke="#3a2412" stroke-width="30"/><circle r="40" fill="#3a2412"/>
  ${[...Array(12)].map((_, i) => { const a = i * 30; return `<g transform="rotate(${a})"><rect x="-8" y="-260" width="16" height="230" fill="#4a2e16"/><rect x="-40" y="-300" width="80" height="50" fill="#5a3a20"/></g>`; }).join("")}</g>`;
const ropeCoil = `<g><circle cx="0" cy="-4" r="10" fill="#1a1208"/>${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="0" cy="${60 + i * 6}" rx="${80 - i * 6}" ry="${60 - i * 4}" fill="none" stroke="#b8925a" stroke-width="14"/>`).join("")}<path d="M -10,0 L -60,60 M 10,0 L 60,60" stroke="#b8925a" stroke-width="10"/></g>`;
function newspaper(id, { names = false } = {}) {
  return `<g><rect x="-330" y="-430" width="660" height="860" fill="#000" opacity="0.4" transform="translate(12,16)"/><rect x="-330" y="-430" width="660" height="860" fill="#ddcc98"/><rect x="-330" y="-430" width="660" height="860" fill="#8a6a2a" opacity="0.14"/>
    <text x="0" y="-350" font-family="IRANSans" font-weight="900" font-size="38" fill="#2a2010" text-anchor="middle">روزنامه‌ی محلی</text><path d="M -300,-325 L 300,-325" stroke="#2a2010" stroke-width="4"/>
    <text x="0" y="-250" font-family="IRANSans" font-weight="900" font-size="66" fill="#1a1208" text-anchor="middle">پسر جنگلبان گم شد</text>
    <g transform="translate(-130,-60)"><rect x="-140" y="-130" width="280" height="300" fill="#efe6cc"/><clipPath id="${id}-npc"><rect x="-128" y="-118" width="256" height="276"/></clipPath>
      <g clip-path="url(#${id}-npc)" style="filter: sepia(1) contrast(0.95)"><rect x="-128" y="-118" width="256" height="276" fill="#9a9a8a"/>${place(0, 10, 0.42, kidBoy(`${id}-kb`, { ...C.RED, shirt: "#7a7a6a", shirtSh: "#5a5a4a", hair: "#2a1a10" }, "curly"))}</g></g>
    <text x="125" y="-120" font-family="IRANSans" font-weight="900" font-size="34" fill="#2a2010" text-anchor="middle">امید، ۱۰ ساله</text>
    ${[...Array(6)].map((_, i) => `<rect x="30" y="${-80 + i * 34}" width="${250 - (i % 3) * 30}" height="10" fill="#4a3a20" opacity="0.5"/>`).join("")}
    ${[...Array(4)].map((_, i) => `<rect x="-290" y="${150 + i * 34}" width="${580 - (i % 2) * 60}" height="10" fill="#4a3a20" opacity="0.5"/>`).join("")}
    <text x="290" y="330" font-family="IRANSans" font-weight="900" font-size="30" fill="#2a2010" text-anchor="end">همراهان:</text>
    <g id="${id}-nm"${names ? "" : ' opacity="0.55"'}><text x="290" y="385" font-family="IRANSans" font-weight="900" font-size="38" fill="#1a0e06" text-anchor="end">محمود — پدر سینا</text>
      <text x="-20" y="385" font-family="IRANSans" font-weight="900" font-size="38" fill="#1a0e06" text-anchor="end">بهرام — پدر آرش</text></g></g>`;
}
const wellTop = (id) => `<g><ellipse cx="0" cy="0" rx="230" ry="70" fill="#5a5a5e"/><path d="M -230,0 L -230,180 C -230,240 230,240 230,180 L 230,0" fill="#6a6a70"/>
  ${[...Array(10)].map((_, i) => `<rect x="${-220 + (i % 5) * 88}" y="${30 + Math.floor(i / 5) * 70}" width="84" height="64" rx="12" fill="${i % 2 ? "#5e5e64" : "#727278"}"/>`).join("")}
  <g id="${id}-hatch"><ellipse cx="0" cy="0" rx="200" ry="56" fill="#3a3c42"/>${[-120, -40, 40, 120].map((x) => `<path d="M ${x},-50 L ${x},50" stroke="#2a2c30" stroke-width="10"/>`).join("")}
    <g transform="translate(0,20)"><rect x="-34" y="-20" width="68" height="50" rx="8" fill="#c9a24a"/><path d="M -20,-20 C -20,-50 20,-50 20,-20" stroke="#8a8c90" stroke-width="8" fill="none"/></g></g></g>`;
const bubble = (inner, w = 520, h = 420) => `<g><g opacity="0.95">${[[0, 0, w / 2], [-w * 0.32, 30, w * 0.3], [w * 0.32, 30, w * 0.3], [-w * 0.18, -h * 0.25, w * 0.28], [w * 0.18, -h * 0.25, w * 0.28]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#e8e4f4"/>`).join("")}</g>
  <clipPath id="BCL"><circle r="${w / 2 - 20}"/></clipPath><g clip-path="url(#BCL)">${inner}</g></g>`;
const tear = (x, y) => `<path d="M ${x},${y} C ${x - 6},${y + 12} ${x - 8},${y + 20} ${x},${y + 26} C ${x + 8},${y + 20} ${x + 6},${y + 12} ${x},${y} Z" fill="#dff0ff" opacity="0.9"/>`;
const coldFace = (id) => glow(`${id}-cg`, 540, 1500, 900, "#cfe0ff", 0.4);
const coldOver = (id) => `<rect width="1080" height="1920" fill="#0a1430" opacity="0.38" style="mix-blend-mode:multiply"/><rect width="1080" height="1920" fill="url(#${id}-cg)" style="mix-blend-mode:screen"/>`;
// a big close face in the night forest
function faceCU(id, dur, who, js, { bg = forest(id, { seed: 81 }), extra = "", y = 860, s = 2.2 } = {}) {
  return scene({ id, dur, bg: "#030507", vignette: 0.9,
    layers: [{ name: "bg", blur: 12, svg: bg }, { name: "f", defs: coldFace(id), svg: `<g id="${id}-sh">${place(540, y, s, who, `${id}-all`)}${extra}</g>${coldOver(id)}${rain(id, 30, 0.28)}` }],
    js: `${rainJs(id, dur)} cam("f", { scale: 1.0 }, { scale: 1.1, origin: "50% 42%" }, 0, ${dur}); ${js}` });
}

// ── 0. last time's vote, replayed: the footprints win with 94% ─────────────────────────────────────
function p0(dur) {
  const id = "p0", k = `${id}-k`, X = 70, Y = 300, W = 940, H = 1120, P1 = 6, P2 = 94;
  const opt = (n, y, num, l1, l2) => `<g transform="translate(540,${y})"><g id="${id}-o${n}">
    <rect id="${id}-ob${n}" x="-420" y="-80" width="840" height="160" rx="28" fill="#1e2433" stroke="#3a4560" stroke-width="4"/>
    <clipPath id="${id}-bc${n}"><rect x="-420" y="-80" width="840" height="160" rx="28"/></clipPath><g clip-path="url(#${id}-bc${n})"><rect id="${id}-fill${n}" x="420" y="-80" width="0" height="160" fill="${n ? "#3a5ea8" : "#3a3f50"}" opacity="0.85"/></g>
    <circle cx="350" cy="0" r="40" fill="#2e3a5a"/><text x="350" y="17" font-family="Naskh" font-weight="700" font-size="48" fill="#fff" text-anchor="middle">${num}</text>
    <text x="290" y="-10" font-family="Naskh" font-weight="700" font-size="42" fill="#f2f2f2" text-anchor="end">${l1}</text><text x="290" y="44" font-family="Naskh" font-weight="700" font-size="36" fill="#aab4cc" text-anchor="end">${l2}</text>
    <text id="${id}-pc${n}" x="-380" y="16" font-family="Naskh" font-weight="700" font-size="56" fill="${n ? "#ffd873" : "#aab4cc"}" text-anchor="start">۰٪</text>
    ${n ? `<g id="${id}-ok" opacity="0" transform="translate(-230,0)"><circle r="34" fill="#3fb46a"/><path d="M -15,0 L -4,12 L 17,-12" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>` : ""}</g></g>`;
  const counter = (n, pct, t0, d) => `(function () { const el = document.getElementById("${id}-pc${n}"); const o = { v: 0 };
    tl.fromTo(o, { v: 0 }, { v: ${pct}, duration: ${d}, ease: "power2.out", onUpdate() { el.textContent = String(Math.round(o.v)).replace(/\\d/g, (x) => "۰۱۲۳۴۵۶۷۸۹"[x]) + "٪"; } }, ${t0}); })();`;
  return { id, dur, html: scene({ id, dur, bg: "#05060c", vignette: 0.85, extraStyle: NASKH,
    layers: [
      { name: "frz", defs: mapDefs(id), svg: `<g style="filter: grayscale(0.7) brightness(0.6)">${forest(id, { seed: 71 })}
        <path d="M 540,1920 L 520,1300 L 200,900 M 540,1300 L 860,900" stroke="#2a2014" stroke-width="80" fill="none" stroke-linecap="round"/>${place(540, 1250, 0.85, arashBack(k), `${k}-all`)}</g>
        ${[...Array(96)].map((_, i) => `<rect y="${i * 20}" width="1080" height="3" fill="#000" opacity="0.25"/>`).join("")}
        <g id="${id}-pz"><rect x="70" y="120" width="26" height="80" rx="6" fill="#fff"/><rect x="112" y="120" width="26" height="80" rx="6" fill="#fff"/><text x="160" y="182" font-family="'Courier New', monospace" font-weight="700" font-size="54" fill="#fff">PAUSE</text></g>
        <rect width="1080" height="1920" fill="#05060c" opacity="0.6"/>` },
      { name: "ui", svg: `<g transform="translate(540,${Y + H / 2})"><g id="${id}-win"><g transform="translate(-540,${-(Y + H / 2)})">
        <rect x="${X + 10}" y="${Y + 16}" width="${W}" height="${H}" rx="40" fill="#000" opacity="0.5"/><rect x="${X}" y="${Y}" width="${W}" height="${H}" rx="40" fill="#121726" stroke="#3a4560" stroke-width="4"/>
        <path d="M ${X},${Y + 40} A 40,40 0 0 1 ${X + 40},${Y} L ${X + W - 40},${Y} A 40,40 0 0 1 ${X + W},${Y + 40} L ${X + W},${Y + 96} L ${X},${Y + 96} Z" fill="#1e2433"/>
        <circle cx="${X + 60}" cy="${Y + 48}" r="14" fill="#ff5f57"/><circle cx="${X + 104}" cy="${Y + 48}" r="14" fill="#febc2e"/><circle cx="${X + 148}" cy="${Y + 48}" r="14" fill="#28c840"/>
        <text x="${X + W - 50}" y="${Y + 64}" font-family="Naskh" font-weight="700" font-size="40" fill="#aab4cc" text-anchor="end">نتیجه‌ی نظرسنجی</text>
        <text x="540" y="${Y + 190}" font-family="Naskh" font-weight="700" font-size="62" fill="#ffd873" text-anchor="middle">آرش چه‌کار کنه؟</text>
        <g transform="translate(${X + 250},${Y + 420}) rotate(-3)"><g id="${id}-im0"><rect x="-200" y="-170" width="400" height="340" fill="#efe6d0"/><clipPath id="${id}-c0"><rect x="-184" y="-154" width="368" height="308"/></clipPath><g clip-path="url(#${id}-c0)"><g transform="scale(0.5)">${mapArt(id)}</g></g></g></g>
        <g transform="translate(${X + W - 250},${Y + 420}) rotate(3)"><g id="${id}-im1"><rect x="-200" y="-170" width="400" height="340" fill="#efe6d0"/><clipPath id="${id}-c1"><rect x="-184" y="-154" width="368" height="308"/></clipPath>
          <g clip-path="url(#${id}-c1)" style="filter: sepia(0.8) contrast(1.1)"><rect x="-184" y="-154" width="368" height="308" fill="#3a2a14"/>${[...Array(5)].map((_, i) => `<g transform="translate(${-110 + i * 50},${110 - i * 60}) rotate(${20 + i * 4}) scale(0.6)"><path d="M -26,-60 C -30,-80 30,-80 26,-60 L 30,50 C 30,70 -30,70 -30,50 Z" fill="#120c06" opacity="${i % 2 ? 0.5 : 0.85}"/></g>`).join("")}</g></g></g>
        <text x="${X + 250}" y="${Y + 630}" font-family="Naskh" font-weight="700" font-size="38" fill="#aab4cc" text-anchor="middle">مسیر نقشه</text><text x="${X + W - 250}" y="${Y + 630}" font-family="Naskh" font-weight="700" font-size="38" fill="#aab4cc" text-anchor="middle">ردِ پای مهران</text>
        ${opt(0, Y + 760, "۱", "به پیرمرد اعتماد کنه", "و طبق نقشه بره جلو")}${opt(1, Y + 940, "۲", "نشونه‌ها رو دنبال کنه", "و بره دنبال ردِ پای مهران")}
        <g transform="translate(540,${Y + 1045})"><g id="${id}-wn" opacity="0"><rect x="-300" y="-40" width="600" height="76" rx="38" fill="#ffd873"/><text x="0" y="12" font-family="Naskh" font-weight="700" font-size="40" fill="#1a1410" text-anchor="middle">انتخاب شما: دنبال کردن ردِ پاها</text></g></g>
        </g></g></g>` },
    ],
    js: `
    tl.fromTo("#${id}-pz", { opacity: 1 }, { opacity: 0.3, duration: 0.3, yoyo: true, repeat: 5 }, 0);
    tl.fromTo("#${id}-fill0", { attr: { x: 420, width: 0 } }, { attr: { x: ${420 - 8.4 * P1}, width: ${8.4 * P1} }, duration: 1.0, ease: "power2.out" }, ${wt("p0", 9)}); ${counter(0, P1, wt("p0", 9), 1.0)}
    tl.to("#${id}-ob0", { attr: { stroke: "#8fb4ff" }, duration: 0.2 }, ${wt("p0", 9)}); tl.to("#${id}-ob0", { attr: { stroke: "#3a4560" }, duration: 0.2 }, ${wt("p0", 18) - 0.2});
    tl.fromTo("#${id}-fill1", { attr: { x: 420, width: 0 } }, { attr: { x: ${420 - 8.4 * P2}, width: ${8.4 * P2} }, duration: 2.0, ease: "power2.out" }, ${wt("p0", 18)}); ${counter(1, P2, wt("p0", 18), 2.0)}
    tl.to("#${id}-ob1", { attr: { stroke: "#ffd873" }, duration: 0.2 }, ${wt("p0", 18)}); tl.to(["#${id}-o1", "#${id}-im1"], { scale: 1.06, transformOrigin: "50% 50%", duration: 0.25, ease: "back.out(2)" }, ${wt("p0", 23)});
    tl.to(["#${id}-o0", "#${id}-im0"], { opacity: 0.4, duration: 0.3 }, ${wt("p0", 23)});
    tl.fromTo("#${id}-ok", { opacity: 0, scale: 0.2, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, transformOrigin: "50% 50%", duration: 0.35, ease: "back.out(2.5)" }, ${wt("p0", 25)});
    tl.fromTo("#${id}-wn", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, ${wt("p0", 25)});
    tl.to("#${id}-win", { scale: 1.5, opacity: 0, transformOrigin: "50% 60%", duration: 0.5, ease: "power2.in" }, ${(dur - 0.35).toFixed(2)});
    ` }) };
}
// 1. the footprints lead him deep into the forest (left to right)
function n1(dur) {
  const id = "n1", k = `${id}-k`;
  const prints = [...Array(9)].map((_, i) => `<g transform="translate(${100 + i * 120},${1560 + (i % 2) * 30}) rotate(90) scale(0.5)"><path d="M -26,-60 C -30,-80 30,-80 26,-60 L 30,50 C 30,70 -30,70 -30,50 Z" fill="#050302" opacity="${i % 2 ? 0.55 : 0.85}"/></g>`).join("");
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.88,
    layers: [{ name: "w", svg: `${forestSide(id, 1500, 5)}${prints}<g id="${k}-pos" transform="${T(80, 780, 0.48)}">${arashFull(k)}<g transform="translate(0,0)">${straps}</g></g>${rain(id, 50, 0.3)}` }],
    js: `${rainJs(id, dur)}
    tl.fromTo("#${k}-pos", { attr: { transform: "${T(80, 780, 0.48)}" } }, { attr: { transform: "${T(760, 780, 0.48)}" }, duration: ${dur}, ease: "none" }, 0); ${walk(k, 0, Math.floor(dur / 0.35), 0.35, 18)}
    look("${k}", 8, 4, 0, 0.01); cam("w", { scale: 1.06, x: 30 }, { scale: 1.06, x: -30 }, 0, ${dur});
    ` }) };
}
// 2. a scarecrow — he steps back
function n2(dur) {
  const id = "n2", k = `${id}-k`;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.9,
    layers: [{ name: "w", defs: glow(`${id}-mg`, 780, 900, 500, "#9aa8c0", 0.25), svg: `${forestSide(id, 1500, 13)}<rect width="1080" height="1920" fill="url(#${id}-mg)"/>
      <g transform="translate(780,980) scale(1.0)">${scarecrow}</g><g id="${k}-pos" transform="${T(330, 780, 0.48)}">${arashFull(k)}</g>${rain(id, 50, 0.3)}` }],
    js: `${rainJs(id, dur)} look("${k}", 9, -2, 0, 0.01); eyesOpen("${k}", 1.3, ${wt("n2", 4)}, 0.2); brows("${k}", -20, -10, ${wt("n2", 4)}, 0.2);
    tl.to("#${k}-pos", { attr: { transform: "${T(250, 790, 0.48)}" }, duration: 0.5, ease: "power2.out" }, ${wt("n2", 4)});
    cam("w", { scale: 1.0, origin: "780px 900px" }, { scale: 1.12, origin: "780px 900px" }, 0, ${dur});
    ` }) };
}
// 3. under the scarecrow he pushes the branches aside: a round black hole
function n3(dur) {
  const id = "n3";
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.9,
    layers: [{ name: "g", defs: torchDefs(id, 380), svg: `<rect width="1080" height="1920" fill="#140e08"/>
      <g transform="translate(540,700) scale(1.3)"><rect x="-20" y="-600" width="40" height="760" fill="#4a3220"/></g>
      <ellipse cx="540" cy="1150" rx="250" ry="120" fill="#020101"/>
      <g id="${id}-bl">${[...Array(7)].map((_, i) => `<path d="M ${180 + i * 30},${1050 + i * 30} L ${560 + (i % 2) * 40},${1150 + (i % 3) * 20}" stroke="#3a2a14" stroke-width="${18 - i}" stroke-linecap="round"/>`).join("")}</g>
      <g id="${id}-br">${[...Array(7)].map((_, i) => `<path d="M ${900 - i * 30},${1060 + i * 28} L ${520 - (i % 2) * 40},${1160 + (i % 3) * 20}" stroke="#2e2210" stroke-width="${18 - i}" stroke-linecap="round"/>`).join("")}</g>
      <g id="${id}-h1" transform="translate(400,1900) rotate(15)">${hand(1)}</g><g id="${id}-h2" transform="translate(680,1900) rotate(-15)">${hand(-1, HC.skinSh)}</g>${rain(id, 30, 0.25)}${torch(id, 0.85, 380)}` }],
    js: `${rainJs(id, dur)} ${spotSet(id, 540, 1150)}
    tl.to("#${id}-h1", { attr: { transform: "translate(420,1420) rotate(15)" }, duration: 0.35, ease: "power2.out" }, ${wt("n3", 3) - 0.3}); tl.to("#${id}-h2", { attr: { transform: "translate(660,1420) rotate(-15)" }, duration: 0.35 }, ${wt("n3", 3) - 0.25});
    tl.to("#${id}-bl", { x: -380, rotation: -10, svgOrigin: "300 1100", duration: 0.6, ease: "power2.inOut" }, ${wt("n3", 5)}); tl.to("#${id}-h1", { attr: { transform: "translate(140,1460) rotate(35)" }, duration: 0.6 }, ${wt("n3", 5)});
    tl.to("#${id}-br", { x: 380, rotation: 10, svgOrigin: "780 1100", duration: 0.6, ease: "power2.inOut" }, ${wt("n3", 6)}); tl.to("#${id}-h2", { attr: { transform: "translate(940,1460) rotate(-35)" }, duration: 0.6 }, ${wt("n3", 6)});
    cam("g", { scale: 1.0, origin: "540px 1150px" }, { scale: 1.2, origin: "540px 1150px" }, ${wt("n3", 9) - 0.3}, 0.9, "power2.inOut");
    ` }) };
}
// the pit in cross-section, Arash kneeling on the edge with the torch; Mehran at the bottom
function pitShot(id, dur, js, { beamOn = true, mehran = true, rope = false, extra = "" } = {}) {
  const a = `${id}-a`, m = `${id}-m`;
  return scene({ id, dur, bg: "#030507", vignette: 0.88,
    layers: [{ name: "p", svg: `${pitCut(id)}${place(310, 620, 0.32, ARASH(a) + straps, `${a}-all`)}
      ${mehran ? `<g clip-path="url(#${id}-pc)"><g id="${m}-pos" transform="translate(540,1400)">${place(0, 0, 0.42, MEHRAN(m), `${m}-all`)}</g></g>` : ""}
      ${rope ? `<path id="${id}-rope" d="M 300,800 C 420,820 500,820 540,860 L 540,1500" stroke="#b8925a" stroke-width="12" fill="none"/>` : ""}
      ${beamOn ? beam(id, 420, 830, 430, 660, 1620) : ""}${extra}${rain(id, 40, 0.25)}` }],
    js: `${rainJs(id, dur)} look("${a}", 6, 8, 0, 0.01); look("${m}", 0, -8, 0, 0.01); ${js}` });
}
// 4. the torch into the pit
function n4(dur) { const id = "n4"; return { id, dur, html: pitShot(id, dur, `tl.fromTo("#${id}-bm", { opacity: 0 }, { opacity: 0.3, duration: 0.4 }, ${wt("n4", 0)}); tl.set("#${id}-m-pos", { opacity: 0 }, 0);
  cam("p", { scale: 1.05 }, { scale: 1.12, origin: "540px 1100px" }, 0, ${dur});`) }; }
// 5. at the bottom: Mehran, alive
function n5(dur) { const id = "n5", m = `${id}-m`; return { id, dur, html: pitShot(id, dur, `tl.fromTo("#${m}-pos", { opacity: 0 }, { opacity: 1, duration: 0.3 }, ${wt("n5", 2) - 0.2});
  tl.fromTo("#${m}-head", { y: 20, rotation: 6 }, { y: 0, rotation: 0, transformOrigin: "50% 90%", duration: 0.4 }, ${wt("n5", 4) - 0.1}); eyesOpen("${m}", 1.2, ${wt("n5", 4)}, 0.2);
  cam("p", { scale: 1.1, origin: "540px 1400px" }, { scale: 1.5, origin: "540px 1400px" }, 0, ${dur}, "power2.inOut");`) }; }
// 6. Mehran close, holding his leg, a tear
function n6(dur) {
  const id = "n6", m = `${id}-all`;
  const pit = `<rect width="1080" height="1920" fill="#0c0806"/>${[...Array(12)].map((_, i) => `<path d="M 0,${i * 170} C 300,${i * 170 + 30} 700,${i * 170 - 20} 1080,${i * 170 + 10}" stroke="#1e140c" stroke-width="12" fill="none"/>`).join("")}`;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.9,
    layers: [{ name: "bg", blur: 10, svg: pit }, { name: "f", defs: glow(`${id}-tl`, 540, 200, 900, "#ffe08a", 0.45), svg: `<g id="${id}-sh">${place(540, 860, 2.2, MEHRAN(`${id}-m`) + tear(52, 40), m)}</g><rect width="1080" height="1920" fill="url(#${id}-tl)" style="mix-blend-mode:screen"/>` }],
    js: `look("${id}-m", 0, -7, 0, 0.01); eyesOpen("${id}-m", 1.15, 0, 0.01); brows("${id}-m", -10, -18, 0, 0.01);
    eyesOpen("${id}-m", 1.4, ${wt("n6", 2)}, 0.2); brows("${id}-m", -22, -8, ${wt("n6", 2)}, 0.2); brows("${id}-m", -6, -22, ${wt("n6", 4)}, 0.3); eyesOpen("${id}-m", 0.9, ${wt("n6", 4)}, 0.3);
    cam("f", { scale: 1.0 }, { scale: 1.1, origin: "50% 42%" }, 0, ${dur});` }) };
}
// 7. Arash at the edge, worried: "where's Sina?"
function n7(dur) { const id = "n7", r = `${id}-r`; return { id, dur, html: faceCU(id, dur, ARASH(r) + straps, `look("${r}", 0, 8, 0, 0.01); eyesOpen("${r}", 1.15, 0, 0.01); brows("${r}", -16, -14, 0, 0.01); look("${r}", 0, 6, ${wt("n7", 2)}, 0.2);`) }; }
// 8. "the old man came, pulled him up with a rope… Sina belongs to the well" — a thought bubble
function n8(dur) {
  const id = "n8", m = `${id}-m`, B = wt("n8", 2) - 0.2;
  const scene8 = `<rect x="-300" y="-260" width="600" height="520" fill="#1a2030"/><rect x="-300" y="60" width="600" height="200" fill="#2a1c10"/><rect x="-60" y="60" width="120" height="200" fill="#0c0806"/>
    ${place(-150, -90, 0.24, oldFull(`${id}-o`))}<path id="${id}-rp" d="M -100,0 C -40,20 -10,30 0,60 L 0,180" stroke="#b8925a" stroke-width="6" fill="none"/><g id="${id}-sn" transform="translate(0,170)">${place(0, 0, 0.22, SINA(`${id}-s`))}</g>`;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.9,
    layers: [
      { name: "f", defs: glow(`${id}-tl`, 540, 200, 900, "#ffe08a", 0.4), svg: `<rect width="1080" height="1920" fill="#0c0806"/>${place(300, 1200, 1.5, MEHRAN(m) + tear(52, 40), `${m}-all`)}<rect width="1080" height="1920" fill="url(#${id}-tl)" style="mix-blend-mode:screen"/>` },
      { name: "b", svg: `<g transform="translate(700,560)"><g id="${id}-bub" opacity="0">${bubble(scene8, 620, 520)}</g></g><g id="${id}-dots" opacity="0"><circle cx="520" cy="900" r="22" fill="#e8e4f4"/><circle cx="470" cy="980" r="14" fill="#e8e4f4"/></g>` },
    ],
    js: `look("${m}", 6, -6, 0, 0.01); eyesOpen("${m}", 1.2, 0, 0.01); brows("${m}", -14, -14, 0, 0.01);
    tl.to("#${id}-dots", { opacity: 1, duration: 0.2 }, ${B}); tl.fromTo("#${id}-bub", { opacity: 0, scale: 0.4, transformOrigin: "20% 90%" }, { opacity: 1, scale: 1, transformOrigin: "20% 90%", duration: 0.45, ease: "back.out(1.6)" }, ${B + 0.1});
    tl.fromTo("#${id}-sn", { attr: { transform: "translate(0,170)" } }, { attr: { transform: "translate(-30,-10)" }, duration: 1.4, ease: "power1.inOut" }, ${wt("n8", 5) - 0.1});
    tl.fromTo("#${id}-rp", { attr: { d: "M -100,0 C -40,20 -10,30 0,60 L 0,180" } }, { attr: { d: "M -100,0 C -60,10 -40,10 -30,-10 L -30,0" } , duration: 1.4, ease: "power1.inOut" }, ${wt("n8", 5) - 0.1});
    eyesOpen("${m}", 1.45, ${wt("n8", 12)}, 0.2); brows("${m}", -24, -10, ${wt("n8", 12)}, 0.2);
    cam("f", { scale: 1.0 }, { scale: 1.06 }, 0, ${dur});` }) };
}
// 9. the map: the red dot by the mill blinks
function n9(dur) {
  const id = "n9", S = 1.15, cx = 540, cy = 880, mx = cx + 40 * S, my = cy - 12 * S;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.9, extraStyle: `@font-face { font-family: "Ruqaa"; src: url('assets/fonts/ArefRuqaa-Bold.woff2') format('woff2'); font-weight: 700; }`,
    layers: [{ name: "m", defs: mapDefs(id) + torchDefs(id, 340), svg: `<rect width="1080" height="1920" fill="#05080a"/><g transform="translate(${cx},${cy}) scale(${S}) rotate(-2)">${mapArt(id)}</g>
      <circle id="${id}-ping" cx="${mx}" cy="${my}" r="50" fill="none" stroke="#ff3a3a" stroke-width="8" opacity="0"/>
      <g transform="translate(110,1720) rotate(20)">${hand(1)}</g><g transform="translate(970,1720) rotate(-20)">${hand(-1, HC.skinSh)}</g>${rain(id, 30, 0.25)}${torch(id, 0.72, 340)}` }],
    js: `${rainJs(id, dur)} ${spotSet(id, cx, cy + 100)} ${spotTo(id, mx, my, wt("n9", 7) - 0.2, 0.5)}
    tl.fromTo("#${id}-ping", { opacity: 0.9, attr: { r: 50 } }, { opacity: 0, attr: { r: 130 }, duration: 0.6, ease: "power2.out", repeat: 3 }, ${wt("n9", 9) - 0.1});
    tl.fromTo("#${id}-mk1", { opacity: 1 }, { opacity: 0.2, duration: 0.2, yoyo: true, repeat: 7 }, ${wt("n9", 9) - 0.1});
    cam("m", { scale: 1.0, origin: "${mx}px ${my}px" }, { scale: 1.35, origin: "${mx}px ${my}px" }, ${wt("n9", 7) - 0.2}, ${(dur - wt("n9", 7) + 0.2).toFixed(2)}, "power2.inOut");` }) };
}
// 10. he waves down to Mehran, gets up and runs off right
function n10(dur) {
  const id = "n10", a = `${id}-a`;
  return { id, dur, html: pitShot(id, dur, `look("${id}-m", 0, -9, 0, 0.01);
    ${armTo(a, 1, -150, -30, 0.2, 0.3)} ${[0, 1, 2].map((k) => armTo(a, 1, k % 2 ? -150 : -120, k % 2 ? -30 : -50, 0.5 + k * 0.25, 0.25)).join(" ")}
    tl.to("#${a}-all", { x: 600, duration: 0.9, ease: "power2.in" }, ${wt("n10", 4) + 0.2});
    cam("p", { scale: 1.0 }, { scale: 1.06 }, 0, ${dur});`, { beamOn: false }) };
}
// 11. the mill by the river, its big wheel turning in the rain; Arash small beside it
function n11(dur) {
  const id = "n11", k = `${id}-k`;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.85,
    layers: [{ name: "w", svg: `${sky("#16203a", "#06080e")}${treesRow(1080, 10, 21, "#081410", "#0c1c18", 0.45)}<rect y="1240" width="1080" height="680" fill="#141a10"/>
      <g transform="translate(440,1240)">${mill}</g><g transform="translate(780,1170)">${wheel(id)}</g>
      <path d="M 0,1300 C 300,1280 700,1320 1080,1290 L 1080,1480 C 700,1500 300,1460 0,1480 Z" fill="#1e3a6a"/>${[...Array(10)].map((_, i) => `<path id="${id}-wv${i}" d="M ${(i * 113) % 1080},${1320 + (i * 17) % 140} l 120,0" stroke="#6a8ac8" stroke-width="4" opacity="0.6"/>`).join("")}
      <g transform="translate(200,1200)">${place(0, 0, 0.18, arashFull(k))}</g>${rain(id, 70, 0.4)}` }],
    js: `${rainJs(id, dur)} tl.fromTo("#${id}-wh", { rotation: 0 }, { rotation: 60, svgOrigin: "0 0", duration: ${dur}, ease: "none" }, 0);
    ${[...Array(10)].map((_, i) => `tl.fromTo("#${id}-wv${i}", { x: 0 }, { x: 160, duration: 1.2, ease: "none", repeat: ${Math.ceil(dur / 1.2)} }, ${(i * 0.1).toFixed(2)});`).join(" ")}
    cam("w", { scale: 1.12, origin: "540px 1100px" }, { scale: 1.0, origin: "540px 1100px" }, 0, ${dur});` }) };
}
// the mill's inside: brown plank walls, a door on the left, the rope coil on a nail, the clipping beside it
const millIn = (id, { door = 0 } = {}) => `<rect width="1080" height="1920" fill="#3a2414"/>${[...Array(14)].map((_, i) => `<rect x="${i * 80}" y="0" width="76" height="1920" fill="${i % 2 ? "#42291a" : "#3a2414"}"/>`).join("")}
  <rect y="1500" width="1080" height="420" fill="#2a1a0c"/>`;
function n12(dur) {
  const id = "n12", k = `${id}-k`, A = wt("n12", 6) - 0.2;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.86,
    layers: [
      { name: "a", svg: `${millIn(id)}<rect x="40" y="420" width="380" height="1090" fill="#0a0c12"/>${rain(id, 30, 0.3).replace('<g id="n12-rn">', '<g id="n12-rn" clip-path="url(#n12-dc)">')}<clipPath id="${id}-dc"><rect x="40" y="420" width="380" height="1090"/></clipPath>
        <g transform="translate(40,420)"><g id="${id}-door"><rect width="380" height="1090" fill="#5a3a20"/>${[0, 1, 2, 3].map((i) => `<rect x="${6 + i * 94}" y="6" width="90" height="1078" fill="${i % 2 ? "#62402a" : "#5a3a20"}"/>`).join("")}</g></g>
        <g transform="translate(760,700) scale(1.2)">${ropeCoil}</g>
        <g id="${k}-pos" transform="${T(230, 820, 0.52)}" opacity="0">${arashFull(k)}</g>${warm(0.15)}` },
    ],
    js: `${rainJs(id, dur)} tl.to("#${id}-door", { scaleX: 0.1, transformOrigin: "0% 50%", duration: 0.5, ease: "power2.out" }, ${wt("n12", 4) - 0.3});
    tl.set("#${k}-pos", { opacity: 1 }, ${wt("n12", 5)}); tl.to("#${k}-pos", { attr: { transform: "${T(460, 860, 0.56)}" }, duration: 1.0, ease: "sine.out" }, ${wt("n12", 5)}); ${walk(k, wt("n12", 5), 3, 0.33, 14)}
    look("${k}", 9, -3, ${A}, 0.3);
    cam("a", { scale: 1.0 }, { scale: 1.0 }, 0, ${A}); cam("a", { scale: 1.0, origin: "760px 800px" }, { scale: 1.45, origin: "760px 800px" }, ${A + 0.6}, ${(dur - A - 0.6).toFixed(2)}, "power2.inOut");` }) };
}
// 13. beside the rope: an old newspaper clipping on the wall
function n13(dur) {
  const id = "n13";
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.86, extraStyle: IRAN,
    layers: [{ name: "w", svg: `${millIn(id)}<g transform="translate(300,760) scale(1.3)">${ropeCoil}</g><g id="${id}-np" transform="translate(720,880) rotate(3) scale(0.62)">${newspaper(id)}</g>${warm(0.15)}` }],
    js: `cam("w", { scale: 1.0, origin: "300px 800px" }, { scale: 1.1, origin: "300px 800px" }, 0, ${wt("n13", 4) - 0.3});
    cam("w", { scale: 1.1, origin: "300px 800px" }, { scale: 1.5, origin: "720px 880px" }, ${wt("n13", 4) - 0.3}, 1.2, "power2.inOut");` }) };
}
// 14. the clipping, close: «پسر جنگلبان گم شد», the smiling boy
function n14(dur) {
  const id = "n14";
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.86, extraStyle: IRAN,
    layers: [{ name: "w", svg: `${millIn(id)}<g transform="translate(540,720) scale(1.2)">${newspaper(id)}</g>${warm(0.12)}` }],
    js: `cam("w", { scale: 1.0, origin: "540px 500px" }, { scale: 1.2, origin: "540px 500px" }, 0, ${wt("n14", 2)});
    cam("w", { scale: 1.2, origin: "540px 500px" }, { scale: 1.35, origin: "360px 800px" }, ${wt("n14", 2)}, ${(wt("n14", 8) - wt("n14", 2)).toFixed(2)}, "power1.inOut");
    cam("w", { scale: 1.35, origin: "360px 800px" }, { scale: 1.1, origin: "540px 700px" }, ${wt("n14", 8)}, ${(dur - wt("n14", 8)).toFixed(2)}, "power1.inOut");` }) };
}
// 15. the two names go bold — cut to Arash, frozen, mouth open
function n15(dur) {
  const id = "n15", r = `${id}-r`, A = wt("n15", 8) - 0.15;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.88, extraStyle: IRAN,
    layers: [
      { name: "w", svg: `<g id="${id}-pa">${millIn(id)}<g transform="translate(540,600) scale(1.6)">${newspaper(id)}</g>${warm(0.12)}</g>` },
      { name: "f", defs: glow(`${id}-wg`, 1100, 700, 900, "#ff9a40", 0.3), svg: `<g id="${id}-pb" opacity="0"><rect width="1080" height="1920" fill="#3a2414"/><g id="${id}-fs">${place(540, 860, 2.2, ARASH(r, { mouth: "scream" }) + straps, `${r}-all`)}</g>
        <rect width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/>${warm(0.1)}</g>` },
    ],
    js: `cam("w", { scale: 1.0, origin: "540px 1200px" }, { scale: 1.6, origin: "540px 1215px" }, 0, ${A});
    tl.set("#${id}-pa", { opacity: 0 }, ${A}); tl.set("#${id}-pb", { opacity: 1 }, ${A});
    look("${r}", 0, 0, 0, 0.01); eyesOpen("${r}", 1.55, 0, 0.01); brows("${r}", -28, -12, 0, 0.01);
    tl.set("#${id}-pa", { opacity: 1 }, ${wt("n15", 11) - 0.15}); tl.set("#${id}-pb", { opacity: 0 }, ${wt("n15", 11) - 0.15});
    tl.to("#${id}-nm", { opacity: 1, scale: 1.12, transformOrigin: "50% 50%", duration: 0.3 }, ${wt("n15", 11)}); cam("w", { scale: 2.3, origin: "760px 1215px" }, { scale: 2.4, origin: "760px 1215px" }, ${wt("n15", 11) - 0.15}, ${(wt("n15", 15) - wt("n15", 11)).toFixed(2)});
    cam("w", { scale: 2.3, origin: "300px 1215px" }, { scale: 2.4, origin: "300px 1215px" }, ${wt("n15", 15) - 0.1}, ${(wt("n15", 17) - wt("n15", 15) + 0.1).toFixed(2)});
    tl.set("#${id}-pa", { opacity: 0 }, ${wt("n15", 18) - 0.1}); tl.set("#${id}-pb", { opacity: 1 }, ${wt("n15", 18) - 0.1});
    tl.fromTo("#${id}-fs", { scale: 1.0 }, { scale: 1.12, transformOrigin: "540px 760px", duration: 0.4, ease: "power3.out" }, ${wt("n15", 18) - 0.1});` }) };
}
// 16. the photo: the red lines fade — under them, a boy who looks like Arash: his father at his age
function n16(dur) {
  const id = "n16", Z = wt("n16", 8) - 0.2;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.88,
    layers: [{ name: "w", svg: `${millIn(id)}<g transform="translate(540,880) scale(1.75) rotate(-2)">${photo(id + "p")}</g>
      <g transform="translate(110,1400) rotate(30)">${hand(1)}</g><g transform="translate(970,1400) rotate(-30)">${hand(-1, HC.skinSh)}</g>${warm(0.12)}` }],
    js: `cam("w", { scale: 1.0, y: 200 }, { scale: 1.0, y: 0 }, 0, 0.6, "power2.out");
    cam("w", { scale: 1.0, origin: "540px 920px" }, { scale: 2.6, origin: "540px 935px" }, ${Z}, 1.4, "power2.inOut");
    tl.to(".${id}p-sl", { opacity: 0, duration: 1.4, ease: "power1.in" }, ${wt("n16", 11)});` }) };
}
// 17. "dad… what did you do?" — tears
function n17(dur) { const id = "n17", r = `${id}-r`; return { id, dur, html: faceCU(id, dur, ARASH(r) + straps + `<g id="${r}-tr" opacity="0">${tear(-44, 40)}${tear(44, 40)}</g>`, `look("${r}", 0, 8, 0, 0.01); eyesOpen("${r}", 1.1, 0, 0.01); brows("${r}", -10, -22, 0, 0.01);
  tl.to("#${r}-tr", { opacity: 1, duration: 0.6 }, ${wt("n17", 3)}); eyesOpen("${r}", 0.9, ${wt("n17", 5)}, 0.4);`, { bg: millIn(id) }) }; }
// 18. rope off the wall, onto his shoulder, out of the door at a run
function n18(dur) {
  const id = "n18", k = `${id}-k`;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.86,
    layers: [{ name: "a", svg: `${millIn(id)}<rect x="40" y="420" width="380" height="1090" fill="#0a0c12"/><g id="${id}-rc" transform="translate(760,700) scale(1.2)">${ropeCoil}</g>
      <g id="${k}-pos" transform="${T(640, 860, 0.56)}">${arashFull(k)}</g>${warm(0.15)}` }],
    js: `look("${k}", 9, -3, 0, 0.01); brows("${k}", 0, 10, ${wt("n18", 4)}, 0.3);
    ${armTo(k, 1, -160, -20, wt("n18", 5) - 0.3, 0.35)} tl.to("#${id}-rc", { attr: { transform: "translate(700,780) scale(0.7)" }, duration: 0.4 }, ${wt("n18", 6)}); ${armTo(k, 1, 6, -10, wt("n18", 9), 0.3)}
    tl.to("#${k}-pos", { attr: { transform: "${T(160, 860, 0.56)}" }, duration: 0.9, ease: "power2.in" }, ${wt("n18", 12)}); ${walk(k, wt("n18", 12), 4, 0.22, 24)}
    tl.to("#${id}-rc", { attr: { transform: "translate(220,780) scale(0.7)" }, duration: 0.9, ease: "power2.in" }, ${wt("n18", 12)});` }) };
}
// 19. the rope tied round a tree by the pit; the end let down into the hole (cross-section)
function n19(dur) {
  const id = "n19", a = `${id}-a`;
  return { id, dur, html: pitShot(id, dur, `tl.fromTo("#${id}-rope", { attr: { d: "M 160,780 C 300,790 420,800 540,830 L 540,860" } }, { attr: { d: "M 160,780 C 300,790 420,800 540,830 L 540,1500" }, duration: 0.8, ease: "power2.in" }, ${wt("n19", 6)});
    cam("p", { scale: 1.0 }, { scale: 1.05 }, 0, ${dur});`, { rope: true, beamOn: false, extra: `<g transform="translate(150,820)"><rect x="-30" y="-700" width="60" height="700" fill="#2a1a0c"/><g transform="translate(0,0) scale(0.6)">${pine("#06100e", "#0a1a16").replace('<rect x="-26" y="-200" width="52" height="200" fill="#1a1410"/>', "")}</g><rect x="-34" y="-60" width="68" height="20" fill="#b8925a"/></g>` }) };
}
// 20. Mehran grips the rope, Arash hauls him up and out
function n20(dur) {
  const id = "n20", m = `${id}-m`;
  return { id, dur, html: pitShot(id, dur, `tl.set("#${id}-rope", { attr: { d: "M 300,800 C 420,820 500,820 540,860 L 540,1340" } }, 0);
    tl.fromTo("#${m}-pos", { attr: { transform: "translate(540,1400)" } }, { attr: { transform: "translate(540,700)" } }, ${wt("n20", 8)}).duration(${(dur - wt("n20", 8) - 0.2).toFixed(2)});
    tl.fromTo("#${id}-rope", { attr: { d: "M 300,800 C 420,820 500,820 540,860 L 540,1340" } }, { attr: { d: "M 300,800 C 420,820 500,820 540,700 L 540,660" }, duration: ${(dur - wt("n20", 8) - 0.2).toFixed(2)} }, ${wt("n20", 8)});
    ${[0, 1, 2, 3].map((k) => `tl.to("#${id}-a-all", { x: ${k % 2 ? 0 : -20}, rotation: ${k % 2 ? 0 : -6}, duration: 0.25 }, ${(wt("n20", 8) + k * 0.3).toFixed(2)});`).join(" ")}
    cam("p", { scale: 1.0 }, { scale: 1.06 }, 0, ${dur});`, { rope: true, beamOn: false }).replace(`<g clip-path="url(#${id}-pc)"><g id="${m}-pos"`, `<clipPath id="${id}-pc2"><rect x="400" y="0" width="280" height="1610"/></clipPath><g clip-path="url(#${id}-pc2)"><g id="${m}-pos"`) };
}
// 21. the pocket watch: 05:00 — the sky a little lighter
function n21(dur) {
  const id = "n21";
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.85,
    layers: [{ name: "w", defs: lcdDefs(id), svg: `${sky("#2a3458", "#0a1020")}${treesRow(1300, 12, 31, "#081410", "#0c1c18", 0.6)}<rect y="1400" width="1080" height="520" fill="#06080a"/>
      <g transform="translate(540,880) scale(2.6)">${pocketWatch(id).replace(">06<", ">05<")}</g>` }],
    js: `${[...Array(8)].map((_, k) => `tl.set("#${id}-colon", { opacity: ${k % 2 ? 1 : 0.15} }, ${(0.2 + k * 0.5).toFixed(2)});`).join(" ")}
    cam("w", { scale: 1.0 }, { scale: 1.12, origin: "540px 880px" }, 0, ${dur});` }) };
}
// 22. Mehran sits against a tree; Arash picks up the rope and runs
function n22(dur) {
  const id = "n22", k = `${id}-k`, m = `${id}-m`;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.88,
    layers: [{ name: "w", svg: `${forestSide(id, 1500, 41).replace('stop-color="#0a1424"', 'stop-color="#1e2a4a"')}<rect x="200" y="700" width="80" height="820" fill="#2a1a0c"/>
      <clipPath id="${id}-sit"><rect width="1080" height="1500"/></clipPath><g clip-path="url(#${id}-sit)">${place(330, 1230, 0.42, MEHRAN(m), `${m}-all`)}</g><g id="${k}-pos" transform="${T(620, 780, 0.48)}">${arashFull(k)}</g>${rain(id, 40, 0.28)}` }],
    js: `${rainJs(id, dur)} look("${m}", 6, -2, 0, 0.01); look("${k}", -9, 2, 0, 0.01); brows("${k}", 0, 10, ${wt("n22", 9)}, 0.3);
    tl.to("#${k}-pos", { attr: { transform: "${T(1180, 780, 0.48)}" }, duration: 0.9, ease: "power2.in" }, ${wt("n22", 12)}); ${walk(k, wt("n22", 12), 4, 0.22, 24)}` }) };
}
// 23. the last red dot: an old stone well in a clearing, an iron hatch with a small lock
function n23(dur) {
  const id = "n23";
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.85,
    layers: [{ name: "w", svg: `${sky("#2e3a60", "#101828")}<rect y="880" width="1080" height="400" fill="#0a1a12"/>${treesRow(1000, 12, 51, "#081410", "#0c1c18", 0.55)}<rect y="1080" width="1080" height="840" fill="#2a3a1e"/>
      ${[...Array(40)].map((_, i) => `<path d="M ${(i * 79) % 1080},${1100 + (i * 41) % 800} l 6,-20 l 6,20" stroke="#3a5028" stroke-width="4" fill="none"/>`).join("")}
      <g transform="translate(540,1240)">${wellTop(id)}</g>${rain(id, 40, 0.25)}` }],
    js: `${rainJs(id, dur)} cam("w", { scale: 1.0, origin: "540px 1240px" }, { scale: 1.4, origin: "540px 1240px" }, 0, ${dur}, "power1.inOut");` }) };
}
// the well in cross-section: Sina in the rising water
function wellCut(id) {
  return `${sky("#2e3a60", "#101828")}${treesRow(700, 10, 61, "#081410", "#0c1c18", 0.45)}<rect y="780" width="1080" height="1140" fill="#3a2a18"/>
    <rect x="340" y="560" width="60" height="1300" fill="#6a6a70"/><rect x="680" y="560" width="60" height="1300" fill="#6a6a70"/><rect x="400" y="560" width="280" height="1300" fill="#0a0c10"/>
    ${[...Array(18)].map((_, i) => `<path d="M 340,${600 + i * 70} L 400,${600 + i * 70} M 680,${600 + i * 70} L 740,${600 + i * 70}" stroke="#4a4a50" stroke-width="5"/>`).join("")}
    <clipPath id="${id}-wc"><rect x="400" y="560" width="280" height="1300"/></clipPath>`;
}
// 24. from the bottom: «آرش! آب داره میاد بالا!»
function n24(dur) {
  const id = "n24", s = `${id}-s`;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.88,
    layers: [{ name: "w", svg: `${wellCut(id)}<g clip-path="url(#${id}-wc)">${place(540, 1360, 0.4, SINA(s, { mouth: "scream" }), `${s}-all`)}<rect id="${id}-wat" x="400" y="1620" width="280" height="300" fill="#2a5aa8" opacity="0.8"/></g>
      <rect x="390" y="540" width="300" height="30" fill="#3a3c42"/>${rain(id, 30, 0.22)}` }],
    js: `${rainJs(id, dur)} look("${s}", 0, -9, 0, 0.01); eyesOpen("${s}", 1.35, 0, 0.01); brows("${s}", -22, -12, 0, 0.01);
    tl.fromTo("#${id}-wat", { attr: { y: 1620 } }, { attr: { y: 1500 }, duration: ${dur}, ease: "none" }, 0);
    cam("w", { scale: 1.0, origin: "540px 1400px" }, { scale: 1.35, origin: "540px 1400px" }, 0, ${dur}, "power1.inOut");` }) };
}
// the back of the photo with the year in the corner
const photoBackY = (id) => `<g><rect x="-260" y="-200" width="520" height="400" fill="#e4d6b0"/>${[...Array(6)].map((_, i) => `<path d="M -230,${-150 + i * 60} L 230,${-152 + i * 60}" stroke="#c8b488" stroke-width="2" opacity="0.5"/>`).join("")}
  <text x="160" y="-60" font-family="Ruqaa" font-weight="700" font-size="54" fill="#2a1810" text-anchor="middle">درخت سوخته…</text><text x="40" y="20" font-family="Ruqaa" font-weight="700" font-size="54" fill="#2a1810" text-anchor="middle">آسیاب…</text><text x="-60" y="96" font-family="Ruqaa" font-weight="700" font-size="54" fill="#2a1810" text-anchor="middle">چاه</text>
  <g id="${id}-yr"><text x="-170" y="170" font-family="Ruqaa" font-weight="700" font-size="58" fill="#2a1810" text-anchor="middle">۱۳۷۴</text></g><circle id="${id}-yc" cx="-170" cy="150" r="70" fill="none" stroke="#c0141a" stroke-width="6" opacity="0"/></g>`;
// 25. the lock: three digits — the back of the photo: a year in the corner
function n25(dur) {
  const id = "n25", A = wt("n25", 7) - 0.15;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.88, extraStyle: NASKH + `@font-face { font-family: "Ruqaa"; src: url('assets/fonts/ArefRuqaa-Bold.woff2') format('woff2'); font-weight: 700; }`,
    layers: [
      { name: "a", svg: `<g id="${id}-pa"><rect width="1080" height="1920" fill="#3a3c42"/>${[-200, 0, 200].map((x) => `<path d="M ${540 + x},0 L ${540 + x},1920" stroke="#2a2c30" stroke-width="30"/>`).join("")}
        <g transform="translate(540,900) scale(3)"><rect x="-90" y="-60" width="180" height="140" rx="16" fill="#c9a24a"/><path d="M -55,-60 C -55,-140 55,-140 55,-60" stroke="#8a8c90" stroke-width="18" fill="none"/>
          ${[-50, 0, 50].map((x) => `<rect x="${x - 20}" y="-20" width="40" height="64" rx="6" fill="#e2ded2"/><text x="${x}" y="24" font-family="Naskh" font-weight="700" font-size="36" fill="#1a1a1a" text-anchor="middle">۰</text>`).join("")}</g></g>` },
      { name: "b", svg: `<g id="${id}-pb" opacity="0"><rect width="1080" height="1920" fill="#2a2a2e"/><g transform="translate(540,880) scale(1.7) rotate(-2)">${photoBackY(id)}</g>
        <g transform="translate(110,1400) rotate(30)">${hand(1)}</g><g transform="translate(970,1400) rotate(-30)">${hand(-1, HC.skinSh)}</g></g>` },
    ],
    js: `cam("a", { scale: 1.0, origin: "540px 900px" }, { scale: 1.12, origin: "540px 900px" }, 0, ${A});
    tl.set("#${id}-pa", { opacity: 0 }, ${A}); tl.set("#${id}-pb", { opacity: 1 }, ${A});
    cam("b", { scale: 1.0, origin: "540px 880px" }, { scale: 1.0, origin: "540px 880px" }, ${A}, 0.01);
    tl.to("#${id}-b", { scale: 2.2, transformOrigin: "251px 1135px", duration: 1.0, ease: "power2.inOut" }, ${wt("n25", 13) - 0.2});
    tl.fromTo("#${id}-yc", { opacity: 0 }, { opacity: 1, duration: 0.3 }, ${wt("n25", 14)});` }) };
}
// 26. «سه رقم… ۳۷۴!» — the dials turn and the lock opens
function n26(dur) {
  const id = "n26", tgt = [3, 7, 4], tt = [wt("n26", 6) - 0.1, wt("n26", 6) + 0.35, wt("n26", 6) + 0.8];
  const strip = (k) => `<g id="${id}-s${k}">${[...Array(20)].map((_, i) => `<text x="0" y="${i * 140 + 50}" font-family="Naskh" font-weight="700" font-size="120" fill="#1a1a1a" text-anchor="middle">${FA(i % 10)}</text>`).join("")}</g>`;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.9, extraStyle: NASKH,
    layers: [{ name: "l", svg: `<rect width="1080" height="1920" fill="#3a3c42"/><g transform="translate(540,600)"><path id="${id}-shk" d="M -170,0 C -170,-300 170,-300 170,0" stroke="#9a9ca2" stroke-width="54" fill="none"/></g>
      <g transform="translate(540,900)"><rect x="-430" y="-280" width="860" height="560" rx="50" fill="#c9a24a"/><rect x="-410" y="-260" width="820" height="520" rx="40" fill="#b8902e"/>
        ${[-230, 0, 230].map((x, k) => `<g transform="translate(${x},0)"><rect x="-90" y="-110" width="180" height="220" rx="16" fill="#e2ded2"/><clipPath id="${id}-c${k}"><rect x="-90" y="-110" width="180" height="220" rx="16"/></clipPath><g clip-path="url(#${id}-c${k})"><g transform="translate(0,-140)">${strip(k)}</g></g>
          <rect x="-90" y="-110" width="180" height="60" fill="#000" opacity="0.25"/><rect x="-90" y="50" width="180" height="60" fill="#000" opacity="0.25"/></g>`).join("")}</g>
      <g id="${id}-th" transform="translate(-200,1240)"><g transform="rotate(-20)">${hand(1)}</g></g>` }],
    js: `${[0, 1, 2].map((k) => `tl.fromTo("#${id}-s${k}", { y: 0 }, { y: ${-140 * (tgt[k] + 10) + 140}, duration: 0.4, ease: "power2.out" }, ${tt[k].toFixed(2)});`).join(" ")}
    ${[0, 1, 2].map((k) => `tl.to("#${id}-th", { attr: { transform: "translate(${310 + k * 230},1160)" }, duration: 0.2 }, ${(tt[k] - 0.2).toFixed(2)});`).join(" ")}
    tl.to("#${id}-shk", { y: -110, duration: 0.15, ease: "back.out(3)" }, ${(tt[2] + 0.55).toFixed(2)});
    cam("l", { scale: 1.0, origin: "540px 900px" }, { scale: 1.08, origin: "540px 900px" }, 0, ${dur});` }) };
}
// 27. the hatch slides off; the rope goes down to Sina
function n27(dur) {
  const id = "n27", s = `${id}-s`;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.88,
    layers: [{ name: "w", svg: `${wellCut(id)}<g clip-path="url(#${id}-wc)">${place(540, 1360, 0.4, SINA(s), `${s}-all`)}<rect x="400" y="1500" width="280" height="400" fill="#2a5aa8" opacity="0.8"/></g>
      <g id="${id}-hatch"><rect x="390" y="540" width="300" height="30" fill="#3a3c42"/></g><path id="${id}-rope" d="M 540,300 L 540,320" stroke="#b8925a" stroke-width="12" fill="none"/>
      ${place(560, 420, 0.32, ARASH(`${id}-a`) + straps)}${rain(id, 30, 0.22)}` }],
    js: `${rainJs(id, dur)} look("${s}", 0, -9, 0, 0.01); look("${id}-a", 0, 9, 0, 0.01);
    tl.to("#${id}-hatch", { x: 420, duration: 0.5, ease: "power2.out" }, ${wt("n27", 3) - 0.2});
    tl.to("#${id}-rope", { attr: { d: "M 540,300 L 540,1340" }, duration: 0.8, ease: "power2.in" }, ${wt("n27", 8) - 0.2});
    ${armTo(s, 1, -160, -10, wt("n27", 10), 0.3)}` }) };
}
// 28. first sunlight over the trees; Sina climbs out; the two stand together
function n28(dur) {
  const id = "n28", a = `${id}-a`, s = `${id}-s`;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.8,
    layers: [{ name: "w", defs: `<linearGradient id="${id}-dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4a80"/><stop offset="0.6" stop-color="#e88a4a"/><stop offset="1" stop-color="#ffd27a"/></linearGradient>`,
      svg: `${sky("#1e2a4a", "#0a1020")}<rect id="${id}-dw" width="1080" height="1100" fill="url(#${id}-dawn)" opacity="0"/><circle id="${id}-sun" cx="540" cy="1150" r="130" fill="#ffd84a"/>
      <rect y="880" width="1080" height="400" fill="#0a1a12"/>${treesRow(1000, 12, 51, "#081410", "#0c1c18", 0.55)}<rect y="1080" width="1080" height="840" fill="#2a3a1e"/>
      <g transform="translate(540,1300) scale(0.8)">${wellTop(id).replace(`<g id="${id}-hatch">`, `<g id="${id}-hatch" opacity="0">`)}</g>
      <g id="${s}-pos" transform="${T(560, 1060, 0.28)}">${C.friendFull(s, "w").replace(/#eceef2/g, "#e0aa1e").replace(/#c6cbd4/g, "#b8860e")}</g><g id="${a}-pos" transform="${T(330, 920, 0.36)}">${arashFull(a)}</g>
      <rect id="${id}-gl" width="1080" height="1920" fill="#ffb060" opacity="0" style="mix-blend-mode:screen"/>` }],
    js: `tl.to("#${id}-sun", { attr: { cy: 740 }, duration: ${dur}, ease: "power1.out" }, 0); tl.to("#${id}-dw", { opacity: 1, duration: ${dur * 0.8} }, 0); tl.to("#${id}-gl", { opacity: 0.2, duration: ${dur} }, 0);
    tl.fromTo("#${s}-pos", { attr: { transform: "${T(560, 1140, 0.28)}" } }, { attr: { transform: "${T(720, 920, 0.36)}" }, duration: 1.2, ease: "power2.out" }, ${wt("n28", 10) - 0.3});
    cam("w", { scale: 1.05 }, { scale: 1.0 }, 0, ${dur});` }) };
}
// 29. footsteps behind them: the old man
function n29(dur) {
  const id = "n29", a = `${id}-a`, s = `${id}-s`, o = `${id}-o`;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.8,
    layers: [{ name: "w", defs: `<linearGradient id="${id}-dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4a80"/><stop offset="0.6" stop-color="#e88a4a"/><stop offset="1" stop-color="#ffd27a"/></linearGradient>`,
      svg: `<rect width="1080" height="1100" fill="url(#${id}-dawn)"/><circle cx="540" cy="740" r="130" fill="#ffd84a"/><rect y="880" width="1080" height="400" fill="#0a1a12"/>${treesRow(1000, 12, 51, "#081410", "#0c1c18", 0.55)}<rect y="1080" width="1080" height="840" fill="#2a3a1e"/>
      <g id="${s}-pos" transform="${T(760, 920, 0.36)}">${C.friendFull(s, "w").replace(/#eceef2/g, "#e0aa1e").replace(/#c6cbd4/g, "#b8860e")}</g><g id="${a}-pos" transform="${T(560, 920, 0.36)}">${arashFull(a)}</g>
      <g id="${o}-pos" transform="${T(-200, 880, 0.4)}">${oldFull(o)}</g>` }],
    js: `look("${a}", 6, 0, 0, 0.01); look("${s}", -6, 0, 0, 0.01);
    tl.to("#${o}-pos", { attr: { transform: "${T(180, 880, 0.4)}" }, duration: 1.8, ease: "sine.out" }, ${wt("n29", 1) - 0.3}); ${walk(o, wt("n29", 1) - 0.3, 4, 0.45, 12)}
    look("${a}", -9, 0, ${wt("n29", 5)}, 0.2); look("${s}", -9, 0, ${wt("n29", 5)}, 0.2); eyesOpen("${a}", 1.35, ${wt("n29", 6)}, 0.2); eyesOpen("${s}", 1.35, ${wt("n29", 6)}, 0.2);
    cam("w", { scale: 1.0 }, { scale: 1.06 }, 0, ${dur});` }) };
}
// 30. Arash in front of Sina, fists clenched, shouting at the old man
function n30(dur) {
  const id = "n30", r = `${id}-r`;
  const fists = `<g transform="translate(-230,560)"><circle r="60" fill="${HC.skin}"/><path d="M -40,-30 L 40,-30" stroke="${HC.skinSh}" stroke-width="6"/></g><g transform="translate(230,560)"><circle r="60" fill="${HC.skinSh}"/><path d="M -40,-30 L 40,-30" stroke="${HC.skinSh}" stroke-width="6"/></g>`;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.85,
    layers: [{ name: "bg", blur: 10, defs: `<linearGradient id="${id}-dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4a80"/><stop offset="0.6" stop-color="#e88a4a"/><stop offset="1" stop-color="#ffd27a"/></linearGradient>`, svg: `<rect width="1080" height="1920" fill="url(#${id}-dawn)"/><rect y="980" width="1080" height="940" fill="#0c1a14"/>${treesRow(1100, 10, 21, "#0c1a14", "#122a20", 0.6)}` },
      { name: "f", svg: `<g id="${id}-sh">${place(540, 760, 1.9, ARASH(r, { mouth: "scream" }) + straps, `${r}-all`)}</g>` }],
    js: `look("${r}", -6, 0, 0, 0.01); eyesOpen("${r}", 1.1, 0, 0.01); brows("${r}", 8, 22, 0, 0.01); ${shakeJs(`#${id}-sh`, wt("n30", 3) - 0.1, dur - wt("n30", 3) + 0.1, 6, 1.4)}
    cam("f", { scale: 1.0 }, { scale: 1.1, origin: "50% 40%" }, 0, ${dur});` }) };
}
// 31. the old man at the well, hand on its rim: thirty years ago… (a faint picture: two boys running from the well)
function n31(dur) {
  const id = "n31", o = `${id}-o`;
  const memory = `<g style="filter: sepia(0.9) blur(1px)"><rect x="-280" y="-200" width="560" height="400" rx="20" fill="#d8c8a0"/><g transform="translate(60,120) scale(0.4)">${wellTop(id + "w").replace(`<g id="${id}w-hatch">`, '<g opacity="0">')}</g>
    <g id="${id}-b1" transform="translate(-60,60)">${place(0, 0, 0.12, C.friendFull(`${id}-k1`, "r"))}</g><g id="${id}-b2" transform="translate(-120,70)">${place(0, 0, 0.12, C.friendFull(`${id}-k2`, "w"))}</g></g>`;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.85,
    layers: [{ name: "w", defs: `<linearGradient id="${id}-dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4a80"/><stop offset="0.6" stop-color="#e88a4a"/><stop offset="1" stop-color="#ffd27a"/></linearGradient>`,
      svg: `<rect width="1080" height="1100" fill="url(#${id}-dawn)"/><rect y="880" width="1080" height="400" fill="#0a1a12"/>${treesRow(1000, 12, 51, "#081410", "#0c1c18", 0.55)}<rect y="1080" width="1080" height="840" fill="#2a3a1e"/>
      <g transform="translate(700,1300) scale(0.9)">${wellTop(id).replace(`<g id="${id}-hatch">`, `<g id="${id}-hatch" opacity="0">`)}</g>${place(430, 900, 0.48, oldFull(o), `${o}-all`)}
      <g transform="translate(540,420)"><g id="${id}-mem" opacity="0">${memory}</g></g>` }],
    js: `look("${o}", 6, 6, 0, 0.01); eyesOpen("${o}", 0.85, 0, 0.01); brows("${o}", 6, 8, 0, 0.01);
    tl.to("#${id}-mem", { opacity: 0.85, duration: 0.6 }, ${wt("n31", 3)}); tl.to(["#${id}-b1", "#${id}-b2"], { x: -200, duration: 2.2, ease: "power1.in" }, ${wt("n31", 13)});
    tl.to("#${id}-mem", { opacity: 0, duration: 0.5 }, ${(dur - 0.5).toFixed(2)});
    cam("w", { scale: 1.0 }, { scale: 1.08, origin: "540px 900px" }, 0, ${dur});` }) };
}
// 32. the old man, close, head bowed, a tear
function n32(dur) {
  const id = "n32", o = `${id}-o`;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.88, fadeOut: true,
    layers: [{ name: "bg", blur: 12, defs: `<linearGradient id="${id}-dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4a80"/><stop offset="0.6" stop-color="#e88a4a"/><stop offset="1" stop-color="#ffd27a"/></linearGradient>`, svg: `<rect width="1080" height="1920" fill="url(#${id}-dawn)"/><rect y="980" width="1080" height="940" fill="#0c1a14"/>${treesRow(1100, 10, 21, "#0c1a14", "#122a20", 0.6)}` },
      { name: "f", svg: `${place(540, 880, 2.3, OLDH(o) + `<g id="${o}-tr" opacity="0">${tear(50, 30)}</g>`, `${o}-all`)}` }],
    js: `look("${o}", 0, 7, 0, 0.01); eyesOpen("${o}", 0.8, 0, 0.01); brows("${o}", -8, -16, 0, 0.01);
    tl.to("#${o}-head", { y: 22, rotation: 3, transformOrigin: "50% 85%", duration: 1.6, ease: "sine.inOut" }, ${wt("n32", 5)}); tl.to("#${o}-tr", { opacity: 1, duration: 0.6 }, ${wt("n32", 5)});
    tl.fromTo("#${o}-tr", { y: 0 }, { y: 80, duration: 2.2, ease: "power1.in" }, ${wt("n32", 7)});
    cam("f", { scale: 1.0 }, { scale: 1.1, origin: "50% 42%" }, 0, ${dur});` }) };
}

export const DURS = Object.fromEntries(Object.entries(WJ).map(([k, v]) => [k, k === "n32" ? Math.round((v.duration + 1.2) * 1000) / 1000 : v.duration]));
const FNS = { p0, n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12, n13, n14, n15, n16, n17, n18, n19, n20, n21, n22, n23, n24, n25, n26, n27, n28, n29, n30, n31, n32 };
export default Object.keys(WJ).map((k) => FNS[k](DURS[k]));
