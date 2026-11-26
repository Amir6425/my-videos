// Part eight: the viewers chose — Arash goes after his friends. The radio goes dead; out into the rain with a torch;
// red ribbons mark the way to the burnt tree; 7 3 4 carved in the trunk; a locked box; Mehran's muddy shoe.
import fs from "node:fs";
import { scene, place, glow } from "../../forest-cabin/build/lib.mjs";
import * as C from "../../forest-cabin/build/chars.mjs";
import { pine } from "../../forest-cabin/build/scenes.mjs";
import { shakeJs, T, warm, dark, walk, armTo } from "../../forest-cabin-5/build/scenes.mjs";
import { ARASH, arashFull, arashBack, hand, logsWall, shelfBooks, HC, faceShot, mapArt, mapDefs } from "../../forest-cabin-6/build/scenes.mjs";
import { radio, waves, wavesJs, ledJs, straps, BAG, BAGD } from "../../forest-cabin-7/build/scenes.mjs";

const WJ = JSON.parse(fs.readFileSync(new URL("./words.json", import.meta.url), "utf8"));
const wt = (shot, i) => +(WJ[shot].words[i].start + 0.25).toFixed(2);
const NASKH = `@font-face { font-family: "Naskh"; src: url('assets/fonts/NotoNaskh-Bold.woff2') format('woff2'); font-weight: 700; }`;
const FA = (n) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

// ── night forest pieces ────────────────────────────────────────────────────────────────────────────
let sd = 5; const rnd = () => ((sd = (sd * 16807) % 2147483647) / 2147483647);
function forest(id, { n = 16, seed = 11, y0 = 1500, fogY = 1100 } = {}) {
  sd = seed;
  const back = [...Array(n)].map((_, i) => `<g transform="translate(${-80 + i * 80 + rnd() * 40},${y0 - 300 + rnd() * 80}) scale(${0.45 + rnd() * 0.25})">${pine("#06100e", "#0a1a16")}</g>`).join("");
  const front = [...Array(7)].map((_, i) => `<g transform="translate(${-60 + i * 190 + rnd() * 60},${y0 + 120 + rnd() * 60}) scale(${0.9 + rnd() * 0.4})">${pine("#030807", "#06110e")}</g>`).join("");
  return `<rect width="1080" height="1920" fill="#04070c"/><rect width="1080" height="900" fill="#0a1424"/>${back}
    <rect y="${fogY}" width="1080" height="500" fill="#7a8aa8" opacity="0.1"/>${front}<rect y="${y0 + 100}" width="1080" height="${1920 - y0}" fill="#05080a"/>`;
}
const rain = (id, n = 60, op = 0.45) => `<g id="${id}-rn">${[...Array(n)].map((_, i) => `<path d="M ${(i * 53) % 1100},${(i * 97) % 1920} l -14,74" stroke="#9ab4d8" stroke-width="3" opacity="${op}"/>`).join("")}</g>`;
const rainJs = (id, dur) => `tl.fromTo("#${id}-rn", { y: -240 }, { y: 240, duration: 0.5, ease: "none", repeat: ${Math.ceil(dur / 0.5)} }, 0);`;
// darkness with a torch spot (a soft hole) whose centre can move: #id-spot (cx, cy)
const torchDefs = (id, r = 230) => `<radialGradient id="${id}-sg"><stop offset="0.55" stop-color="#000"/><stop offset="1" stop-color="#fff"/></radialGradient>
  <mask id="${id}-m"><rect width="1080" height="1920" fill="#fff"/><circle id="${id}-spot" cx="540" cy="900" r="${r}" fill="url(#${id}-sg)"/></mask>
  <radialGradient id="${id}-warm"><stop offset="0" stop-color="#fff2c0" stop-opacity="0.35"/><stop offset="1" stop-color="#fff2c0" stop-opacity="0"/></radialGradient>`;
const torch = (id, op = 0.9, r = 230) => `<rect width="1080" height="1920" fill="#000" opacity="${op}" mask="url(#${id}-m)"/><circle id="${id}-glow" cx="540" cy="900" r="${r}" fill="url(#${id}-warm)" style="mix-blend-mode:screen"/>`;
const spotTo = (id, x, y, t, d = 0.5, ease = "power2.inOut") => `tl.to(["#${id}-spot", "#${id}-glow"], { attr: { cx: ${x}, cy: ${y} }, duration: ${d}, ease: "${ease}" }, ${t});`;
const spotSet = (id, x, y) => `tl.set(["#${id}-spot", "#${id}-glow"], { attr: { cx: ${x}, cy: ${y} } }, 0);`;
const flashlight = `<g><rect x="-34" y="-120" width="68" height="200" rx="16" fill="#3a3c42"/><rect x="-46" y="-170" width="92" height="64" rx="14" fill="#5a5e66"/><circle cx="0" cy="-170" r="40" fill="#fff6d8"/>
  ${[0, 1, 2, 3].map((i) => `<rect x="-36" y="${-60 + i * 30}" width="72" height="8" fill="#2a2c30"/>`).join("")}<rect x="-14" y="-20" width="28" height="26" rx="6" fill="#c9a24a"/></g>`;
const ribbon = (id) => `<g><path d="M -10,0 L 10,0 L 8,14 L -8,14 Z" fill="#a0141a"/><g id="${id}-t1"><path d="M -4,10 C -20,40 -14,80 -26,120 L -12,124 C -2,84 -6,44 6,12 Z" fill="#d01e24"/></g>
  <g id="${id}-t2"><path d="M 4,10 C 22,46 20,86 34,112 L 20,118 C 8,90 10,50 -4,12 Z" fill="#b8181e"/></g></g>`;
const ribbonJs = (id, dur, k = 0) => `tl.fromTo("#${id}-t1", { rotation: -8 }, { rotation: 10, svgOrigin: "0 10", duration: ${0.32 + k * 0.05}, ease: "sine.inOut", yoyo: true, repeat: ${Math.ceil(dur / 0.32)} }, 0);
  tl.fromTo("#${id}-t2", { rotation: 8 }, { rotation: -10, svgOrigin: "0 10", duration: ${0.36 + k * 0.05}, ease: "sine.inOut", yoyo: true, repeat: ${Math.ceil(dur / 0.36)} }, 0.05);`;
function burntTree(scale = 1) {
  const br = (d, w) => `<path d="${d}" stroke="#0a0806" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  return `<g transform="scale(${scale})"><path d="M -140,0 C -110,-200 -120,-500 -80,-760 L 80,-760 C 120,-500 110,-200 160,0 Z" fill="#100c0a"/>
    ${br("M -70,-700 C -180,-820 -260,-840 -340,-980 M -300,-920 C -360,-920 -400,-880 -440,-900", 34)}${br("M 60,-720 C 200,-860 220,-980 330,-1060 M 260,-990 C 320,-960 380,-980 420,-940", 30)}
    ${br("M 0,-760 C -20,-900 30,-1020 -10,-1160 M -12,-1060 C -80,-1100 -120,-1160 -170,-1150", 28)}${br("M -100,-430 C -220,-480 -280,-560 -380,-560", 22)}${br("M 110,-480 C 220,-520 260,-600 360,-620", 22)}
    <path d="M -140,0 C -200,30 -260,20 -320,50 M 160,0 C 220,30 290,24 340,56" stroke="#0a0806" stroke-width="26" fill="none"/>
    ${[...Array(9)].map((_, i) => `<path d="M ${-90 + i * 22},-60 C ${-80 + i * 22},-260 ${-100 + i * 22},-480 ${-70 + i * 18},-720" stroke="#1e1612" stroke-width="5" fill="none" opacity="0.8"/>`).join("")}</g>`;
}
function sneaker() {
  return `<g><path d="M -230,40 C -230,-20 -200,-70 -150,-90 L -40,-130 C 0,-150 60,-120 90,-80 C 140,-30 220,-20 250,10 L 260,40 Z" fill="#2f63b8"/>
    <path d="M -240,40 L 270,40 L 262,80 L -236,80 Z" fill="#e8e6e0"/><path d="M -240,62 L 266,62" stroke="#c8c4bc" stroke-width="6"/>
    <path d="M -230,40 C -230,-20 -200,-70 -150,-90 L -120,-60 C -170,-40 -190,0 -190,40 Z" fill="#234c8e"/>
    ${[0, 1, 2, 3].map((i) => `<path d="M ${-30 + i * 34},${-118 + i * 12} L ${-6 + i * 34},${-90 + i * 12} M ${-6 + i * 34},${-118 + i * 12} L ${-30 + i * 34},${-90 + i * 12}" stroke="#e8e6e0" stroke-width="7" stroke-linecap="round"/>`).join("")}
    ${[[-150, 50, 70, 26], [40, 30, 90, 30], [180, 20, 60, 22], [-60, -40, 50, 30], [120, -20, 40, 22], [-200, 0, 40, 30]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#5a3a1e" opacity="0.85"/>`).join("")}
    <path d="M 200,24 C 230,10 250,30 240,46" stroke="#5a3a1e" stroke-width="10" fill="none"/></g>`;
}
const flash = (id) => `<rect id="${id}-lt" width="1080" height="1920" fill="#dfe8ff" opacity="0" style="mix-blend-mode:screen"/>`;
const flashJs = (id, t) => `tl.fromTo("#${id}-lt", { opacity: 0 }, { opacity: 0.6, duration: 0.05 }, ${t}); tl.to("#${id}-lt", { opacity: 0.1, duration: 0.08 }, ${t + 0.06}); tl.to("#${id}-lt", { opacity: 0.7, duration: 0.04 }, ${t + 0.16}); tl.to("#${id}-lt", { opacity: 0, duration: 0.5 }, ${t + 0.22});`;

function arashFullBack(p) {
  const leg = (id, x) => `<g id="${id}"><path d="M ${x - 44},600 L ${x + 44},600 L ${x + 36},1450 L ${x - 36},1450 Z" fill="#2c3650"/><path d="M ${x - 44},1440 L ${x + 44},1440 L ${x + 48},1500 L ${x - 48},1500 Z" fill="#eceef2"/></g>`;
  return `<g id="${p}-body">${leg(`${p}-legL`, -60)}${leg(`${p}-legR`, 60)}<clipPath id="${p}-waist"><rect x="-400" y="-400" width="800" height="985"/></clipPath>
    <g clip-path="url(#${p}-waist)">${arashBack(p)}<g transform="translate(-60,240) scale(1.25)"><path d="M -150,-60 C -150,-110 150,-110 150,-60 L 170,380 C 170,420 -170,420 -170,380 Z" fill="${BAG}"/></g></g></g>`;
}
// ── 1. the poll: «بره دنبال دوستاش» wins ───────────────────────────────────────────────────────────
function k1(dur) {
  const id = "k1", X = 90, Y = 360, W = 900, H = 980, P1 = 21, P2 = 79;
  const bar = (k, y, num, text, pct) => `<g transform="translate(540,${y})"><g id="${id}-o${k}">
    <rect id="${id}-ob${k}" x="-380" y="-80" width="760" height="160" rx="30" fill="#1e2433" stroke="#3a4560" stroke-width="4"/>
    <clipPath id="${id}-bc${k}"><rect x="-380" y="-80" width="760" height="160" rx="30"/></clipPath>
    <g clip-path="url(#${id}-bc${k})"><rect id="${id}-fill${k}" x="380" y="-80" width="0" height="160" fill="${k ? "#3a5ea8" : "#3a3f50"}" opacity="0.85"/></g>
    <circle cx="300" cy="-14" r="40" fill="#2e3a5a"/><text x="300" y="4" font-family="Naskh" font-weight="700" font-size="48" fill="#fff" text-anchor="middle">${num}</text>
    <text x="230" y="4" font-family="Naskh" font-weight="700" font-size="52" fill="#f2f2f2" text-anchor="end">${text}</text>
    <text id="${id}-pc${k}" x="-330" y="10" font-family="Naskh" font-weight="700" font-size="58" fill="${k ? "#ffd873" : "#aab4cc"}" text-anchor="start">۰٪</text>
    ${k ? `<g id="${id}-ok" opacity="0" transform="translate(-200,-6)"><circle r="34" fill="#3fb46a"/><path d="M -15,0 L -4,12 L 17,-12" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>` : ""}</g></g>`;
  const counter = (k, pct, t0, d) => `(function () { const el = document.getElementById("${id}-pc${k}"); const o = { v: 0 };
    tl.fromTo(o, { v: 0 }, { v: ${pct}, duration: ${d}, ease: "power2.out", onUpdate() { el.textContent = String(Math.round(o.v)).replace(/\\d/g, (x) => "۰۱۲۳۴۵۶۷۸۹"[x]) + "٪"; } }, ${t0}); })();`;
  return { id, dur, html: scene({ id, dur, bg: "#05060c", vignette: 0.85, extraStyle: NASKH,
    layers: [
      { name: "bg", blur: 10, svg: `${forest(id)}${dark(0.55)}` },
      { name: "ui", svg: `<g transform="translate(540,${Y + H / 2})"><g id="${id}-win" opacity="0"><g transform="translate(-540,${-(Y + H / 2)})">
        <rect x="${X + 10}" y="${Y + 16}" width="${W}" height="${H}" rx="40" fill="#000" opacity="0.5"/><rect x="${X}" y="${Y}" width="${W}" height="${H}" rx="40" fill="#121726" stroke="#3a4560" stroke-width="4"/>
        <path d="M ${X},${Y + 40} A 40,40 0 0 1 ${X + 40},${Y} L ${X + W - 40},${Y} A 40,40 0 0 1 ${X + W},${Y + 40} L ${X + W},${Y + 96} L ${X},${Y + 96} Z" fill="#1e2433"/>
        <circle cx="${X + 60}" cy="${Y + 48}" r="14" fill="#ff5f57"/><circle cx="${X + 104}" cy="${Y + 48}" r="14" fill="#febc2e"/><circle cx="${X + 148}" cy="${Y + 48}" r="14" fill="#28c840"/>
        <text x="${X + W - 50}" y="${Y + 64}" font-family="Naskh" font-weight="700" font-size="40" fill="#aab4cc" text-anchor="end">نتیجه‌ی نظرسنجی</text>
        <text x="540" y="${Y + 240}" font-family="Naskh" font-weight="700" font-size="64" fill="#ffffff" text-anchor="middle">آرش در این قسمت</text>
        <text x="540" y="${Y + 330}" font-family="Naskh" font-weight="700" font-size="64" fill="#ffd873" text-anchor="middle">چه‌کار کنه؟</text>
        ${bar(0, Y + 500, "۱", "فرار کنه", P1)}${bar(1, Y + 700, "۲", "بره دنبال دوستاش", P2)}
        <g transform="translate(540,${Y + 880})"><g id="${id}-win2" opacity="0"><rect x="-260" y="-46" width="520" height="84" rx="42" fill="#ffd873"/>
          <text x="0" y="12" font-family="Naskh" font-weight="700" font-size="44" fill="#1a1410" text-anchor="middle">انتخاب شما: گزینه‌ی ۲</text></g></g>
        </g></g></g>` },
    ],
    js: `
    tl.fromTo("#${id}-win", { opacity: 0, scale: 0.85, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.6)", transformOrigin: "50% 50%" }, 0.05);
    tl.fromTo("#${id}-fill0", { attr: { x: 380, width: 0 } }, { attr: { x: ${380 - 7.6 * P1}, width: ${7.6 * P1} }, duration: 1.6, ease: "power2.out" }, 0.8); ${counter(0, P1, 0.8, 1.6)}
    tl.fromTo("#${id}-fill1", { attr: { x: 380, width: 0 } }, { attr: { x: ${380 - 7.6 * P2}, width: ${7.6 * P2} }, duration: 2.4, ease: "power2.out" }, 0.8); ${counter(1, P2, 0.8, 2.4)}
    tl.to("#${id}-ob1", { attr: { stroke: "#ffd873" }, duration: 0.2 }, ${wt("k1", 10)}); tl.to("#${id}-o1", { scale: 1.06, transformOrigin: "50% 50%", duration: 0.25, ease: "back.out(2)" }, ${wt("k1", 10)});
    tl.to("#${id}-o0", { opacity: 0.45, duration: 0.3 }, ${wt("k1", 10)});
    tl.fromTo("#${id}-ok", { opacity: 0, scale: 0.2, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.5)", transformOrigin: "50% 50%" }, ${wt("k1", 11)});
    tl.fromTo("#${id}-win2", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, ${wt("k1", 12)});
    tl.to("#${id}-win", { scale: 1.6, opacity: 0, transformOrigin: "50% 60%", duration: 0.9, ease: "power2.in" }, ${(dur - 1.0).toFixed(2)});
    cam("bg", { scale: 1.0 }, { scale: 1.2 }, 0, ${dur});
    ` }) };
}
// a close shot of Arash in the cabin with the radio near his mouth
const RADIO_IN_HAND = (id, s = 0.62) => `<g transform="translate(165,170) rotate(-12) scale(${s})">${radio(id)}<g transform="translate(0,-40)">${waves(id, 3, 100)}</g></g><g transform="translate(190,430) rotate(-8) scale(0.85)">${hand(1)}</g>`;
// 2. he presses the button and shouts
function k2(dur) {
  const id = "k2", r = `${id}-r`, r2 = `${id}-s`, S = wt("k2", 8) - 0.05;
  return { id, dur, html: scene({ id, dur, bg: "#05060c", vignette: 0.9,
    layers: [
      { name: "bg", blur: 12, svg: `${logsWall()}${warm(0.2)}` },
      { name: "char", defs: glow(`${id}-wg`, 1100, 700, 900, "#ff9a40", 0.45), svg: `<g id="${id}-sh">
        <g id="${id}-a">${place(500, 820, 2.1, ARASH(r) + straps + RADIO_IN_HAND(id), `${r}-all`)}</g>
        <g id="${id}-b" opacity="0">${place(500, 820, 2.1, ARASH(r2, { mouth: "scream" }) + straps + RADIO_IN_HAND(id + "b"), `${r2}-all`)}</g></g>
        <rect width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/>` },
    ],
    js: `
    look("${r}", 0, 2, 0, 0.01); eyesOpen("${r}", 1.25, 0, 0.01); brows("${r}", -18, -16, 0, 0.01);
    look("${r2}", 0, -2, 0, 0.01); eyesOpen("${r2}", 1.3, 0, 0.01); brows("${r2}", -26, -20, 0, 0.01);
    tl.set("#${id}-led", { fill: "#30ff60" }, ${wt("k2", 3)}); tl.set("#${id}b-led", { fill: "#30ff60" }, 0);
    tl.set("#${id}-a", { opacity: 0 }, ${S.toFixed(2)}); tl.set("#${id}-b", { opacity: 1 }, ${S.toFixed(2)});
    cam("char", { scale: 1.0 }, { scale: 1.06, origin: "50% 45%" }, 0, ${S.toFixed(2)}); cam("char", { scale: 1.12, origin: "50% 45%" }, { scale: 1.16, origin: "50% 45%" }, ${S.toFixed(2)}, ${(dur - S).toFixed(2)});
    ${shakeJs(`#${id}-sh`, S, dur - S, 6, 1.6)}
    ` }) };
}
// 3. no answer: static, then the red light dies; silence
function k3(dur) {
  const id = "k3", r = `${id}-r`;
  return { id, dur, html: scene({ id, dur, bg: "#05060c", vignette: 0.92,
    layers: [
      { name: "face", blur: 6, defs: glow(`${id}-wg`, 1100, 700, 900, "#ff9a40", 0.4), svg: `${logsWall()}${place(540, 760, 2.0, ARASH(r) + straps, `${r}-all`)}<rect width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/>${dark(0.2)}` },
      { name: "r", svg: `<g transform="translate(560,1180) scale(2.0)">${radio(id)}<g transform="translate(0,-40)">${waves(id, 3, 100)}${waves(id + "l", 3, 100, -1)}</g></g>
        <g transform="translate(330,1700) rotate(25)">${hand(1)}</g><g transform="translate(800,1700) rotate(-25)">${hand(-1, HC.skinSh)}</g>` },
    ],
    js: `
    look("${r}", 0, 7, 0, 0.01); eyesOpen("${r}", 1.2, 0, 0.01); brows("${r}", -16, -14, 0, 0.01);
    tl.set("#${id}-led", { fill: "#ff3030", opacity: 1 }, 0);
    ${wavesJs(id, wt("k3", 2) - 0.1, wt("k3", 4) - 0.1, 3, 0.4)} ${wavesJs(id + "l", wt("k3", 2) - 0.1, wt("k3", 4) - 0.1, 3, 0.4)}
    ${ledJs(id, wt("k3", 2) - 0.1, wt("k3", 4), 0.12)}
    tl.to("#${id}-led", { opacity: 0.08, duration: 0.8, ease: "power2.in" }, ${wt("k3", 4)});
    cam("r", { scale: 1.0, origin: "540px 1100px" }, { scale: 1.1, origin: "540px 1100px" }, 0, ${dur}); cam("face", { scale: 1.03 }, { scale: 1.06 }, 0, ${dur});
    ` }) };
}
// 4. torn: "a trap… but if I don't go, they'll both die"
function k4(dur) {
  const id = "k4", r = `${id}-r`;
  return { id, dur, html: faceShot(id, dur, `
    look("${r}", -9, 1, 0, 0.01); eyesOpen("${r}", 1.1, 0, 0.01); brows("${r}", -12, -14, 0, 0.01);
    cam("char", { scale: 1.0 }, { scale: 1.12, origin: "50% 42%" }, 0, ${dur}, "power1.inOut");
    look("${r}", -3, 4, ${wt("k4", 4)}, 0.3); blink("${r}", ${wt("k4", 7)}, 0.2); look("${r}", -9, 0, ${wt("k4", 8)}, 0.25);
    brows("${r}", 0, 12, ${wt("k4", 12)}, 0.35); eyesOpen("${r}", 0.95, ${wt("k4", 12)}, 0.35);`).replace(`ARASH(r)`, `ARASH(r) + straps`) };
}
// 5. quick cuts: the backpack on; the radio on his belt; the old torch off the shelf
function k5(dur) {
  const id = "k5", k = `${id}-k`, A = wt("k5", 2) - 0.1, B = wt("k5", 5) - 0.15;
  return { id, dur, html: scene({ id, dur, bg: "#05060c", vignette: 0.88,
    layers: [
      { name: "a", svg: `<g id="${id}-pa">${logsWall()}${place(540, 760, 1.5, arashBack(k), `${k}-all`)}
        <g id="${id}-bag" transform="translate(900,1300) rotate(30)"><path d="M -180,-260 C -180,-310 180,-310 180,-260 L 200,240 C 200,280 -200,280 -200,240 Z" fill="${BAG}"/><rect x="-120" y="40" width="240" height="160" rx="30" fill="${BAGD}"/><path d="M -150,-100 L 150,-100" stroke="#c9a24a" stroke-width="8" stroke-dasharray="6 6"/></g>${warm(0.15)}</g>` },
      { name: "b", svg: `<g id="${id}-pb" opacity="0"><rect width="1080" height="1920" fill="${HC.shirtSh}"/><rect y="760" width="1080" height="1160" fill="#2c3650"/><rect y="760" width="1080" height="90" fill="#3a2418"/>
        <rect x="490" y="764" width="100" height="82" rx="10" fill="#b8963a"/><g id="${id}-rad" transform="translate(1300,980) scale(1.6)">${radio(id)}<rect x="-30" y="-150" width="60" height="70" fill="#111"/></g>${warm(0.15)}</g>` },
      { name: "c", svg: `<g id="${id}-pc" opacity="0">${logsWall()}<rect x="0" y="980" width="1080" height="40" fill="#3a2414"/>${shelfBooks(620, 300, 440, 680)}
        <g id="${id}-fl" transform="translate(360,880) rotate(90) scale(1.3)">${flashlight}</g><g id="${id}-hd" transform="translate(360,2100)">${hand()}</g>${warm(0.15)}</g>` },
    ],
    js: `
    tl.fromTo("#${id}-bag", { attr: { transform: "translate(900,1300) rotate(30)" } }, { attr: { transform: "translate(540,1240) rotate(0)" }, duration: 0.45, ease: "power3.out" }, 0.2);
    tl.fromTo("#${k}-all", { y: 0 }, { y: 18, duration: 0.15, yoyo: true, repeat: 1 }, 0.6);
    tl.set("#${id}-pa", { opacity: 0 }, ${A}); tl.set("#${id}-pb", { opacity: 1 }, ${A});
    tl.fromTo("#${id}-rad", { attr: { transform: "translate(1300,980) scale(1.6)" } }, { attr: { transform: "translate(700,1060) scale(1.6)" }, duration: 0.35, ease: "power3.out" }, ${A + 0.05});
    tl.fromTo("#${id}-pb", { x: 0 }, { x: -8, duration: 0.05, yoyo: true, repeat: 3 }, ${A + 0.4});
    tl.set("#${id}-pb", { opacity: 0 }, ${B}); tl.set("#${id}-pc", { opacity: 1 }, ${B});
    tl.fromTo("#${id}-hd", { attr: { transform: "translate(360,2100)" } }, { attr: { transform: "translate(360,1020)" }, duration: 0.25, ease: "power2.out" }, ${B});
    tl.to(["#${id}-hd"], { attr: { transform: "translate(420,1500)" }, duration: 0.4, ease: "power2.in" }, ${B + 0.35}); tl.to("#${id}-fl", { attr: { transform: "translate(420,1360) rotate(80) scale(1.3)" }, duration: 0.4, ease: "power2.in" }, ${B + 0.35});
    ` }) };
}
// 6. the door opens on rain and dark trees; the torch finds a narrow path; he steps out
function k6(dur) {
  const id = "k6", k = `${id}-k`, A = 0.5, B = wt("k6", 5) - 0.2;
  return { id, dur, html: scene({ id, dur, bg: "#05060c", vignette: 0.9,
    layers: [
      { name: "out", defs: torchDefs(id, 260), svg: `<g id="${id}-o">${forest(id, { seed: 7 })}<path d="M 470,1920 C 500,1600 530,1400 540,1200 L 560,1200 C 580,1400 620,1600 660,1920 Z" fill="#1a1612"/>${rain(id)}${torch(id, 0.82, 260)}</g>` },
      { name: "door", svg: `${logsWall()}<rect x="200" y="200" width="680" height="1500" fill="#000" opacity="0"/>
        <path d="M 0,0 L 1080,0 L 1080,1920 L 0,1920 Z M 230,220 L 230,1680 L 850,1680 L 850,220 Z" fill="#2a1a0e" fill-rule="evenodd"/>
        <g transform="translate(230,220)"><g id="${id}-door"><rect width="620" height="1460" fill="#4a3020"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${6 + i * 102}" y="6" width="98" height="1448" fill="${i % 2 ? "#52361f" : "#4a3020"}"/>`).join("")}<circle cx="570" cy="740" r="22" fill="#8a7040"/></g></g>
        <rect y="1680" width="1080" height="240" fill="#26170c"/>` },
      { name: "k", svg: `<g id="${k}-pos" transform="${T(540, 1100, 1.0)}">${arashBack(k)}<g transform="translate(-60,240) scale(1.25)"><path d="M -150,-60 C -150,-110 150,-110 150,-60 L 170,380 C 170,420 -170,420 -170,380 Z" fill="${BAG}"/><rect x="-100" y="160" width="200" height="140" rx="26" fill="${BAGD}"/></g></g>
        <path id="${id}-beam" d="M 700,1050 L 760,1050 L 640,1240 L 470,1240 Z" fill="#fff2c0" opacity="0"/>` },
    ],
    js: `${rainJs(id, dur)} ${spotSet(id, 560, 1300)}
    tl.to("#${id}-door", { scaleX: 0.08, transformOrigin: "100% 50%", duration: 0.55, ease: "power2.out" }, ${A});
    cam("out", { scale: 1.0 }, { scale: 1.15, origin: "540px 1300px" }, 0, ${dur});
    ${spotTo(id, 520, 1240, 0.9, 0.6)} ${spotTo(id, 580, 1180, 1.6, 0.6)}
    tl.to("#${k}-pos", { attr: { transform: "${T(540, 1060, 0.62)}" }, duration: ${(dur - B).toFixed(2)}, ease: "power1.in" }, ${B});
    tl.to("#${id}-door", { opacity: 0, duration: 0.3 }, ${B});
    cam("door", { scale: 1.0 }, { scale: 1.25, origin: "540px 960px" }, ${B}, ${(dur - B).toFixed(2)}, "power1.in");
    ` }) };
}
// 7. the wet map in the torchlight: his finger on the first red mark (the burnt tree), north, by the river
function k7(dur) {
  const id = "k7";
  const S = 1.15, cx = 540, cy = 860; // map centre on screen; map coords × S
  const P = (x, y) => [cx + x * S, cy + y * S];
  const [tx, ty] = P(-10, -280), [nx, ny] = P(300, -300), [rx, ry] = P(160, 20);
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.92, extraStyle: `@font-face { font-family: "Ruqaa"; src: url('assets/fonts/ArefRuqaa-Bold.woff2') format('woff2'); font-weight: 700; }`,
    layers: [
      { name: "m", defs: mapDefs(id) + torchDefs(id, 300), svg: `<rect width="1080" height="1920" fill="#05080a"/>
        <g transform="translate(${cx},${cy}) scale(${S}) rotate(-3)">${mapArt(id)}
          ${[...Array(26)].map((_, i) => `<ellipse cx="${-360 + (i * 157) % 720}" cy="${-360 + (i * 233) % 720}" rx="${8 + (i % 4) * 4}" ry="${6 + (i % 3) * 3}" fill="#fff" opacity="0.18"/>`).join("")}
          <rect x="-400" y="-400" width="800" height="800" fill="#2a3a5a" opacity="0.12"/></g>
        <g id="${id}-fg" transform="translate(${tx + 20},${ty + 640})"><g transform="rotate(-6)">${hand(1)}</g></g>
        <g transform="translate(980,1720) rotate(-20)">${hand(-1, HC.skinSh)}</g>
        ${rain(id, 40, 0.3)}${torch(id, 0.85, 300)}` },
    ],
    js: `${rainJs(id, dur)} ${spotSet(id, cx, cy + 80)}
    cam("m", { scale: 1.0, origin: "540px 860px" }, { scale: 1.12, origin: "540px 860px" }, 0, ${dur});
    ${spotTo(id, tx, ty + 40, wt("k7", 2) - 0.1, 0.6)}
    tl.fromTo("#${id}-fg", { attr: { transform: "translate(${tx + 120},${ty + 1100})" } }, { attr: { transform: "translate(${tx + 20},${ty + 120})" }, duration: 0.6, ease: "power2.out" }, ${wt("k7", 3) - 0.2});
    tl.fromTo("#${id}-mk0", { scale: 1 }, { scale: 1.25, transformOrigin: "50% 50%", duration: 0.25, yoyo: true, repeat: 3 }, ${wt("k7", 5)});
    ${spotTo(id, nx - 40, ny + 40, wt("k7", 8) - 0.1, 0.5)}
    ${spotTo(id, rx, ry, wt("k7", 10) - 0.1, 0.5)} tl.to("#${id}-fg", { attr: { transform: "translate(${rx + 20},${ry + 120})" }, duration: 0.5, ease: "power2.inOut" }, ${wt("k7", 10) - 0.1});
    ` }) };
}
// 8. walking among tall dark trees; the torch bobs through the mist; a twig snaps — he flinches
function k8(dur) {
  const id = "k8", k = `${id}-k`;
  sd = 23;
  const trunks = (n, s, col) => [...Array(n)].map((_, i) => `<rect x="${(i * 260 + rnd() * 120) % 1300 - 110}" y="0" width="${(40 + rnd() * 50) * s}" height="1920" fill="${col}"/>`).join("");
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.92,
    layers: [
      { name: "far", blur: 6, svg: `<rect width="1080" height="1920" fill="#060a12"/><g id="${id}-t0">${trunks(9, 0.8, "#0c1418")}</g><rect y="900" width="1080" height="500" fill="#8090b0" opacity="0.12"/>` },
      { name: "mid", defs: torchDefs(id, 280), svg: `<g id="${id}-t1">${trunks(6, 1.6, "#081010")}</g><rect y="1500" width="1080" height="420" fill="#070a08"/>
        ${[...Array(14)].map((_, i) => `<path d="M ${(i * 89) % 1080},${1560 + (i * 37) % 300} l 40,-10" stroke="#2a2418" stroke-width="5"/>`).join("")}
        ${place(540, 1120, 0.9, arashBack(k), `${k}-all`)}${rain(id, 50, 0.35)}${torch(id, 0.72, 340)}` },
      { name: "near", blur: 10, svg: `<g id="${id}-t2">${trunks(3, 3.2, "#020403")}</g>` },
    ],
    js: `${rainJs(id, dur)} ${spotSet(id, 540, 900)}
    tl.fromTo("#${id}-t0", { x: 0 }, { x: -120, duration: ${dur}, ease: "none" }, 0); tl.fromTo("#${id}-t1", { x: 0 }, { x: -320, duration: ${dur}, ease: "none" }, 0); tl.fromTo("#${id}-t2", { x: 200 }, { x: -700, duration: ${dur}, ease: "none" }, 0);
    tl.fromTo("#${k}-all", { y: 0 }, { y: -14, duration: 0.3, ease: "sine.inOut", yoyo: true, repeat: ${Math.floor(dur / 0.3) - 1} }, 0);
    ${[...Array(Math.floor(dur / 0.6))].map((_, i) => spotTo(id, 500 + (i % 2) * 90, 820 + (i % 3) * 90, i * 0.6, 0.6, "sine.inOut")).join(" ")}
    tl.fromTo("#${id}-mid", { x: 0 }, { x: 10, duration: 0.05, yoyo: true, repeat: 3 }, ${wt("k8", 3)});
    tl.to("#${k}-head", { x: -24, rotation: -10, transformOrigin: "50% 80%", duration: 0.18, ease: "power3.out" }, ${wt("k8", 4)}); tl.to("#${k}-head", { x: 0, rotation: 0, duration: 0.4 }, ${wt("k8", 4) + 0.6});
    ` }) };
}
// 9. the torch lands on a red ribbon tied to a branch; further on, another
function k9(dur) {
  const id = "k9", R = wt("k9", 3) - 0.1;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.9,
    layers: [
      { name: "w", defs: torchDefs(id, 240), svg: `${forest(id, { seed: 19 })}
        <path d="M 1080,700 C 900,720 760,690 600,730 C 520,750 460,740 380,770" stroke="#0e0a08" stroke-width="30" fill="none"/>
        <g transform="translate(560,735) scale(1.6)">${ribbon(id + "a")}</g>
        <path d="M 0,1060 C 160,1040 260,1070 360,1050" stroke="#0e0a08" stroke-width="14" fill="none"/><g id="${id}-r2" opacity="0"><g transform="translate(300,1055) scale(0.7)">${ribbon(id + "b")}</g></g>
        ${rain(id, 50, 0.35)}${torch(id, 0.88, 240)}` },
    ],
    js: `${rainJs(id, dur)} ${ribbonJs(id + "a", dur)} ${ribbonJs(id + "b", dur, 1)} ${spotSet(id, 200, 1300)}
    ${spotTo(id, 760, 1100, 0.3, 0.7, "sine.inOut")} ${spotTo(id, 380, 900, 1.0, 0.7, "sine.inOut")} ${spotTo(id, 580, 820, R, 0.35, "power3.out")}
    cam("w", { scale: 1.0, origin: "560px 800px" }, { scale: 1.0, origin: "560px 800px" }, 0, ${R});
    cam("w", { scale: 1.0, origin: "560px 800px" }, { scale: 1.45, origin: "560px 800px" }, ${wt("k9", 6) - 0.2}, 0.6, "power2.out");
    tl.set("#${id}-r2", { opacity: 1 }, ${wt("k9", 6) + 0.3}); ${spotTo(id, 420, 900, wt("k9", 6) + 0.3, 0.6)}
    ` }) };
}
// 10. his face, cold torchlight: "someone marked the way for me…"
function k10(dur) {
  const id = "k10", r = `${id}-r`;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.92,
    layers: [
      { name: "bg", blur: 12, svg: `${forest(id, { seed: 31 })}${[[200, 700, 0.8], [420, 860, 0.6], [640, 960, 0.45], [820, 1020, 0.35]].map(([x, y, s], i) => `<g transform="translate(${x},${y}) scale(${s})">${ribbon(id + "q" + i)}</g>`).join("")}` },
      { name: "f", defs: glow(`${id}-cg`, 540, 1400, 900, "#cfe0ff", 0.45), svg: `${place(560, 860, 2.15, ARASH(r) + straps, `${r}-all`)}<rect width="1080" height="1920" fill="#0a1430" opacity="0.4" style="mix-blend-mode:multiply"/>
        <rect width="1080" height="1920" fill="url(#${id}-cg)" style="mix-blend-mode:screen"/>${rain(id, 30, 0.3)}` },
    ],
    js: `${rainJs(id, dur)}
    look("${r}", -8, -3, 0, 0.01); eyesOpen("${r}", 1.25, 0, 0.01); brows("${r}", -16, -6, 0, 0.01);
    look("${r}", -3, -3, ${wt("k10", 3)}, 0.4); look("${r}", 3, -2, ${wt("k10", 6)}, 0.4);
    cam("f", { scale: 1.0 }, { scale: 1.1, origin: "50% 42%" }, 0, ${dur}); cam("bg", { x: 0 }, { x: -60 }, 0, ${dur});
    ` }) };
}
// 11. out of the bushes: a stream, and across it, in the lightning, the black burnt tree
function k11(dur) {
  const id = "k11", L1 = wt("k11", 9) - 0.1, L2 = wt("k11", 10) + 0.1;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.9,
    layers: [
      { name: "far", svg: `<rect width="1080" height="1920" fill="#060a14"/><rect width="1080" height="1000" fill="#0c1426"/>
        ${forest(id, { seed: 41, y0: 1150, fogY: 900 }).replace('<rect width="1080" height="1920" fill="#04070c"/><rect width="1080" height="900" fill="#0a1424"/>', "")}
        <g id="${id}-tree" opacity="0.35"><g transform="translate(560,1130) scale(0.75)">${burntTree()}</g></g>
        <rect y="1180" width="1080" height="220" fill="#0e1a2a"/>${[...Array(12)].map((_, i) => `<path id="${id}-wv${i}" d="M ${(i * 97) % 1080},${1200 + (i * 17) % 180} l 120,0" stroke="#5a7aa8" stroke-width="4" opacity="0.5"/>`).join("")}
        <rect y="1400" width="1080" height="520" fill="#06090a"/>${flash(id)}` },
      { name: "bush", svg: `<g id="${id}-bl">${[...Array(6)].map((_, i) => `<circle cx="${80 + i * 50}" cy="${1500 - i * 90}" r="${220 - i * 18}" fill="#030605"/>`).join("")}</g>
        <g id="${id}-br">${[...Array(6)].map((_, i) => `<circle cx="${1000 - i * 50}" cy="${1500 - i * 90}" r="${220 - i * 18}" fill="#030605"/>`).join("")}</g>${rain(id, 50, 0.35)}` },
    ],
    js: `${rainJs(id, dur)}
    tl.to("#${id}-bl", { x: -620, duration: 1.2, ease: "power2.inOut" }, 0.2); tl.to("#${id}-br", { x: 620, duration: 1.2, ease: "power2.inOut" }, 0.2);
    ${[...Array(12)].map((_, i) => `tl.fromTo("#${id}-wv${i}", { x: 0 }, { x: 140, duration: 1.2, ease: "none", repeat: ${Math.ceil(dur / 1.2)} }, ${(i * 0.1).toFixed(2)});`).join(" ")}
    cam("far", { scale: 1.0 }, { scale: 1.12, origin: "540px 900px" }, 0, ${dur});
    ${flashJs(id, L1)} tl.to("#${id}-tree", { opacity: 1, duration: 0.05 }, ${L1}); tl.to("#${id}-tree", { opacity: 0.7, duration: 0.6 }, ${L1 + 0.3});
    ${flashJs(id, L2)} tl.to("#${id}-tree", { opacity: 1, duration: 0.05 }, ${L2});
    ` }) };
}
// 12. across the slippery stones (one slip); then at the foot of the huge trunk, looking up
function k12(dur) {
  const id = "k12", k = `${id}-k`, k2 = `${id}-k2`, A = wt("k12", 7) - 0.15;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.9,
    layers: [
      { name: "a", svg: `<g id="${id}-pa"><rect width="1080" height="1920" fill="#060a14"/><g transform="translate(560,980) scale(0.9)">${burntTree()}</g>
        <rect y="1000" width="1080" height="920" fill="#0e1a2a"/>${[[200, 1700, 120], [470, 1500, 100], [700, 1340, 84], [520, 1200, 64]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.35}" fill="#2a2e32"/>`).join("")}
        <g id="${k}-pos" transform="${T(200, 820, 0.6)}">${arashFullBack(k)}</g>${rain(id, 50, 0.35)}</g>` },
      { name: "b", svg: `<g id="${id}-pb" opacity="0"><rect width="1080" height="1920" fill="#0a1222"/><g transform="translate(540,2300) scale(2.6)">${burntTree()}</g>
        ${place(540, 1500, 0.55, arashBack(k2), `${k2}-all`)}${rain(id + "b", 50, 0.35)}</g>` },
    ],
    js: `${rainJs(id, dur)} ${rainJs(id + "b", dur)}
    tl.to("#${k}-pos", { attr: { transform: "${T(470, 700, 0.52)}" }, duration: 0.8, ease: "sine.inOut" }, 0.3); ${walk(k, 0.3, 2, 0.4, 14)}
    tl.to("#${k}-pos", { attr: { transform: "${T(470, 700, 0.52, -9)}" }, duration: 0.12, ease: "power2.out" }, 1.15); tl.to("#${k}-pos", { attr: { transform: "${T(470, 700, 0.52, 4)}" }, duration: 0.15 }, 1.28);
    ${armTo(k, -1, -70, -10, 1.15, 0.15)} ${armTo(k, 1, 70, 10, 1.15, 0.15)}
    tl.to("#${k}-pos", { attr: { transform: "${T(700, 560, 0.44)}" }, duration: 0.9, ease: "sine.inOut" }, 1.5); ${walk(k, 1.5, 2, 0.45, 12)}
    tl.set("#${id}-pa", { opacity: 0 }, ${A}); tl.set("#${id}-pb", { opacity: 1 }, ${A});
    cam("b", { scale: 1.0, origin: "540px 1500px" }, { scale: 1.08, origin: "540px 1500px" }, ${A}, ${(dur - A).toFixed(2)});
    tl.to("#${k2}-head", { y: -16, rotation: 0, transformOrigin: "50% 80%", duration: 0.5 }, ${A + 0.1});
    ` }) };
}
// 13. the torch moves over the trunk: three numbers carved, fresh: ۷ … ۳ … ۴
function k13(dur) {
  const id = "k13";
  const D = [[300, 680, 0, 8], [560, 900, 1, 9], [800, 740, 2, 10]];
  const carve = (x, y, n) => `<g transform="translate(${x},${y}) rotate(${n === 0 ? -6 : n === 1 ? 4 : -3})"><text x="4" y="8" font-family="Naskh" font-weight="700" font-size="260" fill="#050302" text-anchor="middle">${FA([7, 3, 4][n])}</text>
    <text x="0" y="0" font-family="Naskh" font-weight="700" font-size="260" fill="#c8945a" text-anchor="middle">${FA([7, 3, 4][n])}</text></g>`;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.92, extraStyle: NASKH,
    layers: [
      { name: "t", defs: torchDefs(id, 230), svg: `<rect width="1080" height="1920" fill="#14100c"/>
        ${[...Array(30)].map((_, i) => `<path d="M ${-40 + i * 40},0 C ${-20 + i * 40 + (i % 3) * 10},500 ${-50 + i * 40},1100 ${-30 + i * 40},1920" stroke="${i % 2 ? "#080605" : "#1e1814"}" stroke-width="${8 + (i % 4) * 5}" fill="none"/>`).join("")}
        ${[...Array(20)].map((_, i) => `<path d="M ${(i * 113) % 1080},${(i * 211) % 1920} l ${30 + (i % 3) * 20},${10 + (i % 2) * 14}" stroke="#2a201a" stroke-width="4"/>`).join("")}
        ${D.map(([x, y, n]) => carve(x, y, n)).join("")}${rain(id, 30, 0.25)}${torch(id, 0.9, 230)}` },
    ],
    js: `${rainJs(id, dur)} ${spotSet(id, 500, 1500)}
    ${spotTo(id, 600, 1200, 0.2, 1.0, "sine.inOut")}
    ${D.map(([x, y, n, w]) => spotTo(id, x, y - 80, wt("k13", w) - 0.35, 0.4, "power2.inOut")).join(" ")}
    cam("t", { scale: 1.05 }, { scale: 1.15, origin: "540px 900px" }, 0, ${dur});
    ` }) };
}
// 14. kneeling, he pulls the roots aside: a rusted metal box with a three-digit lock
function k14(dur) {
  const id = "k14";
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.92,
    layers: [
      { name: "g", defs: torchDefs(id, 330), svg: `<rect width="1080" height="1920" fill="#0e0c0a"/><rect y="0" width="1080" height="700" fill="#14100c"/>
        <g transform="translate(540,1150)"><rect x="-260" y="-150" width="520" height="300" rx="16" fill="#5a3a24"/><rect x="-260" y="-150" width="520" height="60" fill="#6a4a30"/>
          ${[...Array(14)].map((_, i) => `<circle cx="${-240 + (i * 71) % 480}" cy="${-130 + (i * 53) % 260}" r="${8 + (i % 3) * 6}" fill="#8a4a1e" opacity="0.6"/>`).join("")}
          <g transform="translate(0,40)"><rect x="-90" y="-50" width="180" height="100" rx="14" fill="#2a2c30"/>${[-50, 0, 50].map((x) => `<rect x="${x - 20}" y="-34" width="40" height="68" rx="6" fill="#d8d4c8"/>`).join("")}<path d="M -50,-50 C -50,-120 50,-120 50,-50" stroke="#8a8c90" stroke-width="16" fill="none"/></g></g>
        <g id="${id}-rl">${[0, 1, 2].map((i) => `<path d="M ${-100 + i * 40},${800 + i * 140} C 200,${900 + i * 100} 380,${1100 + i * 60} 600,${1400 + i * 50}" stroke="#1a1410" stroke-width="${60 - i * 12}" fill="none" stroke-linecap="round"/>`).join("")}</g>
        <g id="${id}-rr">${[0, 1, 2].map((i) => `<path d="M ${1180 - i * 40},${760 + i * 160} C 880,${880 + i * 110} 700,${1080 + i * 60} 480,${1420 + i * 40}" stroke="#16110d" stroke-width="${56 - i * 10}" fill="none" stroke-linecap="round"/>`).join("")}</g>
        <g id="${id}-h1" transform="translate(420,1900) rotate(15)">${hand(1)}</g><g id="${id}-h2" transform="translate(680,1900) rotate(-15)">${hand(-1, HC.skinSh)}</g>
        ${rain(id, 30, 0.25)}${torch(id, 0.88, 330)}` },
    ],
    js: `${rainJs(id, dur)} ${spotSet(id, 540, 1200)}
    tl.to("#${id}-h1", { attr: { transform: "translate(420,1450) rotate(15)" }, duration: 0.35, ease: "power2.out" }, 0.1); tl.to("#${id}-h2", { attr: { transform: "translate(680,1450) rotate(-15)" }, duration: 0.35, ease: "power2.out" }, 0.15);
    tl.to("#${id}-rl", { x: -360, rotation: -8, svgOrigin: "0 1000", duration: 0.7, ease: "power2.inOut" }, 0.5); tl.to("#${id}-h1", { attr: { transform: "translate(160,1500) rotate(35)" }, duration: 0.7, ease: "power2.inOut" }, 0.5);
    tl.to("#${id}-rr", { x: 360, rotation: 8, svgOrigin: "1080 1000", duration: 0.7, ease: "power2.inOut" }, 0.7); tl.to("#${id}-h2", { attr: { transform: "translate(920,1500) rotate(-35)" }, duration: 0.7, ease: "power2.inOut" }, 0.7);
    cam("g", { scale: 1.0, origin: "540px 1150px" }, { scale: 1.25, origin: "540px 1150px" }, ${wt("k14", 4) - 0.2}, ${(dur - wt("k14", 4) + 0.2).toFixed(2)}, "power2.inOut");
    ` }) };
}
// 15. the dials, one by one: ۷ — ۳ — ۴; the lock springs open
function k15(dur) {
  const id = "k15", tgt = [7, 3, 4], tt = [wt("k15", 2), wt("k15", 5), wt("k15", 7)];
  const strip = (k) => `<g id="${id}-s${k}">${[...Array(20)].map((_, i) => `<text x="0" y="${i * 140 + 50}" font-family="Naskh" font-weight="700" font-size="120" fill="#1a1a1a" text-anchor="middle">${FA(i % 10)}</text>`).join("")}</g>`;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.92, extraStyle: NASKH,
    layers: [
      { name: "l", defs: torchDefs(id, 420) + `<clipPath id="${id}-win"><rect x="-600" y="-110" width="1200" height="220"/></clipPath>`, svg: `<rect width="1080" height="1920" fill="#3a2a1e"/>
        <g transform="translate(540,620)"><path id="${id}-shk" d="M -170,0 C -170,-300 170,-300 170,0" stroke="#9a9ca2" stroke-width="54" fill="none"/></g>
        <g transform="translate(540,900)"><rect x="-430" y="-280" width="860" height="560" rx="50" fill="#2a2c30"/><rect x="-410" y="-260" width="820" height="520" rx="40" fill="#34363c"/>
          ${[-230, 0, 230].map((x, k) => `<g transform="translate(${x},0)"><rect x="-90" y="-110" width="180" height="220" rx="16" fill="#e2ded2"/>
            <clipPath id="${id}-c${k}"><rect x="-90" y="-110" width="180" height="220" rx="16"/></clipPath><g clip-path="url(#${id}-c${k})"><g transform="translate(0,-140)">${strip(k)}</g></g>
            <rect x="-90" y="-110" width="180" height="60" fill="#000" opacity="0.25"/><rect x="-90" y="50" width="180" height="60" fill="#000" opacity="0.25"/></g>`).join("")}</g>
        <g id="${id}-th" transform="translate(-200,1240)"><g transform="rotate(-20)">${hand(1)}</g></g>${torch(id, 0.55, 420)}` },
    ],
    js: `${spotSet(id, 540, 900)}
    ${[0, 1, 2].map((k) => `tl.fromTo("#${id}-s${k}", { y: ${-140 * ((k * 3 + 1) % 10)} }, { y: ${-140 * (tgt[k] + 10) + 140}, duration: 0.6, ease: "power2.out" }, ${(tt[k] - 0.3).toFixed(2)});`).join(" ")}
    ${[0, 1, 2].map((k) => `tl.to("#${id}-th", { attr: { transform: "translate(${310 + k * 230},1160)" }, duration: 0.25, ease: "power2.inOut" }, ${(tt[k] - 0.45).toFixed(2)});`).join(" ")}
    tl.to("#${id}-shk", { y: -110, duration: 0.15, ease: "back.out(3)" }, ${(dur - 0.35).toFixed(2)});
    cam("l", { scale: 1.0, origin: "540px 900px" }, { scale: 1.1, origin: "540px 900px" }, 0, ${dur});
    ` }) };
}
// 16. the lid opens: one muddy blue sneaker; he lifts it — Mehran's? He freezes.
function k16(dur) {
  const id = "k16", r = `${id}-r`, A = wt("k16", 10) - 0.15;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.92,
    layers: [
      { name: "b", defs: torchDefs(id, 380), svg: `<g id="${id}-pa"><rect width="1080" height="1920" fill="#0e0c0a"/>
        <g transform="translate(540,1100)"><rect x="-420" y="-160" width="840" height="420" rx="20" fill="#4a3220"/><rect x="-390" y="-130" width="780" height="360" rx="14" fill="#1a120c"/>
          <g id="${id}-sh" transform="translate(0,60)">${sneaker()}</g>
          <g transform="translate(0,-160)"><g id="${id}-lid"><rect x="-420" y="-40" width="840" height="60" rx="12" fill="#5a3a24"/>${[...Array(10)].map((_, i) => `<circle cx="${-380 + i * 84}" cy="-10" r="${8 + (i % 3) * 4}" fill="#8a4a1e" opacity="0.6"/>`).join("")}</g></g></g>
        <g id="${id}-hd" transform="translate(600,2200)">${hand()}</g>${rain(id, 25, 0.22)}${torch(id, 0.86, 380)}</g>` },
      { name: "f", defs: glow(`${id}-cg`, 540, 1500, 900, "#cfe0ff", 0.5), svg: `<g id="${id}-pb" opacity="0"><rect width="1080" height="1920" fill="#060a12"/><g id="${id}-fs">${place(540, 860, 2.3, ARASH(r) + straps, `${r}-all`)}</g>
        <rect width="1080" height="1920" fill="#0a1430" opacity="0.4" style="mix-blend-mode:multiply"/><rect width="1080" height="1920" fill="url(#${id}-cg)" style="mix-blend-mode:screen"/></g>` },
    ],
    js: `${rainJs(id, dur)} ${spotSet(id, 540, 1100)}
    tl.to("#${id}-lid", { scaleY: -1, transformOrigin: "50% 100%", y: -60, duration: 0.45, ease: "power2.inOut" }, ${wt("k16", 0)});
    cam("b", { scale: 1.0, origin: "540px 1160px" }, { scale: 1.3, origin: "540px 1160px" }, ${wt("k16", 3) - 0.1}, 1.2, "power2.inOut");
    tl.to("#${id}-hd", { attr: { transform: "translate(600,1300)" }, duration: 0.35, ease: "power2.out" }, ${wt("k16", 7) - 0.3});
    tl.to("#${id}-sh", { attr: { transform: "translate(0,-220) rotate(-8)" }, duration: 0.5, ease: "power2.out" }, ${wt("k16", 8)}); tl.to("#${id}-hd", { attr: { transform: "translate(600,1020)" }, duration: 0.5, ease: "power2.out" }, ${wt("k16", 8)});
    tl.set("#${id}-pa", { opacity: 0 }, ${A}); tl.set("#${id}-pb", { opacity: 1 }, ${A});
    look("${r}", 0, 4, 0, 0.01); eyesOpen("${r}", 1.6, 0, 0.01); brows("${r}", -30, -18, 0, 0.01);
    tl.fromTo("#${id}-fs", { scale: 1.0 }, { scale: 1.12, transformOrigin: "540px 760px", duration: 0.3, ease: "power3.out" }, ${A});
    ` }) };
}

export const DURS = Object.fromEntries(Object.entries(WJ).map(([k, v]) => [k, k === "k16" ? Math.round((v.duration + 0.9) * 1000) / 1000 : v.duration]));
export default [k1, k2, k3, k4, k5, k6, k7, k8, k9, k10, k11, k12, k13, k14, k15, k16].map((f) => f(DURS[f.name]));
export { forest, rain, rainJs, torchDefs, torch, spotTo, spotSet, sneaker, burntTree, flash, flashJs, flashlight, ribbon, ribbonJs, arashFullBack, FA, NASKH };
