// Part seven: he packs the map and the watch; a radio crackles on the wall: Sina's voice — "don't come, it's a trap";
// then the film pauses and asks the viewer what Arash should do.
import fs from "node:fs";
import { scene, place, glow } from "../../forest-cabin/build/lib.mjs";
import { shakeJs, T, warm, dark } from "../../forest-cabin-5/build/scenes.mjs";
import { ARASH, pocketWatch, lcdDefs, hand, logsWall, shelfBooks, foldedNote, HC, faceShot } from "../../forest-cabin-6/build/scenes.mjs";

const WJ = JSON.parse(fs.readFileSync(new URL("./words.json", import.meta.url), "utf8"));
const wt = (shot, i) => WJ[shot].words[i].start + 0.25; // a word's time inside its shot
const NASKH = `@font-face { font-family: "Naskh"; src: url('assets/fonts/NotoNaskh-Bold.woff2') format('woff2'); font-weight: 700; }`;
const BAG = "#3b5d3a", BAGD = "#2a4429";

// the radio: centre (0,0), ~160 × 340, antenna up
function radio(id) {
  return `<g><rect x="34" y="-300" width="26" height="150" rx="10" fill="#141518"/><rect x="38" y="-300" width="8" height="140" fill="#2a2c32"/>
    <rect x="-80" y="-160" width="160" height="330" rx="26" fill="#1c1e22"/><rect x="-72" y="-152" width="144" height="314" rx="20" fill="#24272c"/>
    <circle cx="-44" cy="-180" r="14" fill="#2a2c32"/><circle id="${id}-led" cx="50" cy="-136" r="9" fill="#ff3030"/>
    <rect x="-56" y="-128" width="112" height="56" rx="8" fill="#9bb07a"/><text x="0" y="-90" font-family="'Courier New', monospace" font-weight="700" font-size="30" fill="#1e2a14" text-anchor="middle">CH 3</text>
    ${[...Array(7)].map((_, i) => `<rect x="-52" y="${-40 + i * 18}" width="104" height="8" rx="4" fill="#111214"/>`).join("")}
    <rect x="-84" y="-60" width="10" height="70" rx="4" fill="#3a3c42"/><rect x="-40" y="110" width="80" height="34" rx="10" fill="#33363c"/></g>`;
}
const waves = (id, n = 3, x = 110, side = 1) => [...Array(n)].map((_, k) => `<path id="${id}-wv${k}" d="M ${x * side},${-60 - k * 10} C ${(x + 30 + k * 40) * side},${-20} ${(x + 30 + k * 40) * side},${40} ${x * side},${80 + k * 10}" stroke="#bfe0ff" stroke-width="7" fill="none" stroke-linecap="round" opacity="0"/>`).join("");
const wavesJs = (id, t0, t1, n = 3, per = 0.6) => { let js = "", t = t0; while (t < t1) { for (let k = 0; k < n; k++) js += `tl.fromTo("#${id}-wv${k}", { opacity: 0.9, scale: 0.8, transformOrigin: "0% 50%" }, { opacity: 0, scale: 1.2, transformOrigin: "0% 50%", duration: ${per}, ease: "power1.out" }, ${(t + k * 0.12).toFixed(2)});`; t += per; } return js; };
const ledJs = (id, t0, t1, per = 0.25) => [...Array(Math.max(0, Math.floor((t1 - t0) / per)))].map((_, k) => `tl.set("#${id}-led", { opacity: ${k % 2 ? 1 : 0.25} }, ${(t0 + k * per).toFixed(2)});`).join(" ");
const straps = `<path d="M -150,238 C -150,330 -136,460 -120,600 L -86,600 C -100,460 -112,330 -110,236 Z" fill="${BAG}"/><path d="M 150,238 C 150,330 136,460 120,600 L 86,600 C 100,460 112,330 110,236 Z" fill="${BAGD}"/>
  <rect x="-132" y="420" width="44" height="22" rx="4" fill="#c9a24a"/><rect x="88" y="420" width="44" height="22" rx="4" fill="#c9a24a"/>`;
const folded = `<g><rect x="-110" y="-70" width="220" height="140" fill="#d8c7a0"/><path d="M -110,0 L 110,0 M 0,-70 L 0,70" stroke="#a8946a" stroke-width="4"/>
  <path d="M -80,-40 L -60,-52 L -40,-40 Z M 40,30 L 56,20 L 72,30 Z" fill="#4a6a3a"/><circle cx="30" cy="-30" r="12" fill="none" stroke="#c0141a" stroke-width="4"/></g>`;

// 1. the map and the watch into the backpack; then he's ready, straps on
function h1(dur) {
  const id = "h1", r = `${id}-r`, A = wt("h1", 7) - 0.15;
  return { id, dur, html: scene({ id, dur, bg: "#0a0604", vignette: 0.85,
    layers: [
      { name: "a", defs: lcdDefs(id) + glow(`${id}-wg`, 1000, 300, 1000, "#ff9a40", 0.4), svg: `<g id="${id}-pa"><rect width="1080" height="1920" fill="#4a2e18"/>
        ${[...Array(10)].map((_, i) => `<path d="M 0,${100 + i * 190} C 300,${90 + i * 190} 700,${120 + i * 190} 1080,${96 + i * 190}" stroke="#3a2212" stroke-width="5" fill="none" opacity="0.7"/>`).join("")}
        <g transform="translate(540,1000)"><path d="M -360,-300 C -380,-380 380,-380 360,-300 L 380,420 C 380,470 -380,470 -380,420 Z" fill="${BAGD}"/>
          <ellipse cx="0" cy="-250" rx="320" ry="120" fill="#141a12"/></g>
        <g id="${id}-map" transform="${T(540, 300, 1.3, -8)}">${folded}</g><g id="${id}-wat" transform="${T(560, 200, 0.75, 10)}">${pocketWatch(id)}</g>
        <g transform="translate(540,1000)"><path d="M -330,-250 C -330,-150 330,-150 330,-250 L 380,420 C 380,470 -380,470 -380,420 Z" fill="${BAG}"/><path d="M -300,-60 L 300,-60" stroke="#c9a24a" stroke-width="10" stroke-dasharray="6 6"/>
          <rect x="-200" y="60" width="400" height="260" rx="40" fill="${BAGD}"/><path d="M -180,90 L 180,90" stroke="#c9a24a" stroke-width="8" stroke-dasharray="6 6"/></g>
        <g id="${id}-hd" transform="${T(540, 2300, 1.5)}">${hand()}</g>
        <rect width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/>${warm(0.15)}</g>` },
      { name: "b", defs: glow(`${id}-bg`, 1100, 700, 900, "#ff9a40", 0.5), svg: `<g id="${id}-pb" opacity="0">${logsWall()}${place(540, 860, 2.0, ARASH(r) + straps, `${r}-all`)}<rect width="1080" height="1920" fill="url(#${id}-bg)" style="mix-blend-mode:screen"/>${dark(0.1)}</g>` },
    ],
    js: `
    tl.fromTo("#${id}-map", { attr: { transform: "${T(540, 300, 1.3, -8)}" } }, { attr: { transform: "${T(520, 780, 1.1, 4)}" }, duration: 0.6, ease: "power2.in" }, 0.4);
    tl.to("#${id}-map", { opacity: 0, duration: 0.12 }, 0.95);
    tl.fromTo("#${id}-wat", { attr: { transform: "${T(560, 200, 0.75, 10)}" } }, { attr: { transform: "${T(560, 760, 0.6, -10)}" }, duration: 0.6, ease: "power2.in" }, 1.3);
    tl.to("#${id}-wat", { opacity: 0, duration: 0.12 }, 1.85);
    tl.fromTo("#${id}-hd", { attr: { transform: "${T(540, 2300, 1.5)}" } }, { attr: { transform: "${T(560, 1500, 1.5)}" }, duration: 0.4, ease: "power2.out" }, 1.95);
    tl.to("#${id}-hd", { attr: { transform: "${T(720, 1500, 1.5)}" }, duration: 0.4, ease: "power1.inOut" }, 2.15);
    cam("a", { scale: 1.0 }, { scale: 1.05, origin: "540px 900px" }, 0, ${A.toFixed(2)});
    tl.set("#${id}-pa", { opacity: 0 }, ${A.toFixed(2)}); tl.set("#${id}-pb", { opacity: 1 }, ${A.toFixed(2)});
    look("${r}", 0, 0, 0, 0.01); eyesOpen("${r}", 0.92, 0, 0.01); brows("${r}", 4, 10, 0, 0.01);
    tl.fromTo("#${r}-all", { y: 20 }, { y: 0, duration: 0.35, ease: "power2.out" }, ${A.toFixed(2)});
    cam("b", { scale: 1.0 }, { scale: 1.08, origin: "50% 42%" }, ${A.toFixed(2)}, ${(dur - A).toFixed(2)});
    ` }) };
}
// 2. a crackle by the shelf; he turns: a radio hanging on the wall
function h2(dur) {
  const id = "h2", r = `${id}-r`, A = wt("h2", 9) - 0.1;
  return { id, dur, html: scene({ id, dur, bg: "#05060c", vignette: 0.9,
    layers: [
      { name: "f", defs: glow(`${id}-wg`, 1100, 700, 900, "#ff9a40", 0.5), svg: `<g id="${id}-pa"><rect width="1080" height="1920" fill="#2a1a0e"/><rect x="620" width="460" height="1920" fill="#3a2010"/>
        <g id="${id}-sh">${place(540, 860, 2.25, ARASH(r) + straps, `${r}-all`)}</g><rect width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/></g>` },
      { name: "w", defs: glow(`${id}-rg`, 400, 760, 500, "#9ad0ff", 0.25), svg: `<g id="${id}-pb" opacity="0">${logsWall()}${shelfBooks(560, 300, 440, 1100)}
        <circle cx="330" cy="520" r="8" fill="#1a1008"/><path d="M 330,520 L 290,600 M 330,520 L 370,600" stroke="#111" stroke-width="6"/>
        <g transform="translate(330,800) rotate(-4)">${radio(id)}<g transform="translate(0,-40)">${waves(id, 3, 100)}</g><g transform="translate(0,-40)">${waves(id + "l", 3, 100, -1)}</g></g>
        <rect width="1080" height="1920" fill="url(#${id}-rg)" style="mix-blend-mode:screen"/>${warm(0.15)}${dark(0.1)}</g>` },
    ],
    js: `
    look("${r}", 0, 2, 0, 0.01); eyesOpen("${r}", 0.95, 0, 0.01); brows("${r}", 2, 8, 0, 0.01);
    look("${r}", 9, -1, ${wt("h2", 2).toFixed(2)}, 0.15); eyesOpen("${r}", 1.3, ${wt("h2", 2).toFixed(2)}, 0.2); brows("${r}", -16, -6, ${wt("h2", 2).toFixed(2)}, 0.2);
    ${shakeJs(`#${id}-sh`, wt("h2", 2), A - wt("h2", 2), 2, 1.2)}
    tl.to("#${r}-head", { x: 14, rotation: 4, transformOrigin: "50% 85%", duration: 0.4, ease: "power2.inOut" }, ${(wt("h2", 8)).toFixed(2)});
    cam("f", { scale: 1.0 }, { scale: 1.06, origin: "50% 42%" }, 0, ${A.toFixed(2)});
    tl.set("#${id}-pa", { opacity: 0 }, ${A.toFixed(2)}); tl.set("#${id}-pb", { opacity: 1 }, ${A.toFixed(2)});
    cam("w", { scale: 1.0, origin: "330px 800px" }, { scale: 1.35, origin: "330px 800px" }, ${A.toFixed(2)}, ${(dur - A).toFixed(2)}, "power1.inOut");
    ${ledJs(id, A, dur, 0.3)} ${wavesJs(id, A + 0.1, dur - 0.3, 3, 0.7)} ${wavesJs(id + "l", A + 0.1, dur - 0.3, 3, 0.7)}
    ` }) };
}
// 3. the radio in his hands; someone is talking — Sina
function h3(dur) {
  const id = "h3", r = `${id}-r`;
  return { id, dur, html: scene({ id, dur, bg: "#05060c", vignette: 0.9,
    layers: [
      { name: "f", defs: glow(`${id}-wg`, 1100, 700, 900, "#ff9a40", 0.45) + glow(`${id}-bl`, 540, 1300, 500, "#9ad0ff", 0.25), svg: `${logsWall()}
        ${place(540, 640, 1.65, ARASH(r, { arms: [[30, -100], [-30, 100]] }) + straps + `<g transform="translate(0,380) scale(0.7)">${radio(id)}<g transform="translate(0,-40)">${waves(id, 3, 100)}</g></g>`, `${r}-all`)}
        <rect width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/><rect width="1080" height="1920" fill="url(#${id}-bl)" style="mix-blend-mode:screen"/>` },
    ],
    js: `
    look("${r}", 0, 9, 0, 0.01); eyesOpen("${r}", 1.25, 0, 0.01); brows("${r}", -14, -4, 0, 0.01);
    eyesOpen("${r}", 1.55, ${wt("h3", 7).toFixed(2)}, 0.2); brows("${r}", -26, -8, ${wt("h3", 7).toFixed(2)}, 0.2); look("${r}", 0, 4, ${wt("h3", 7).toFixed(2)}, 0.2);
    cam("f", { scale: 1.0 }, { scale: 1.08, origin: "50% 45%" }, 0, ${dur});
    ${ledJs(id, 0.2, dur, 0.25)} ${wavesJs(id, 0.4, dur - 0.2, 3, 0.6)}
    ` }) };
}
// 4. the radio, close: «آرش نیا، این یه تله‌س… فرار کن!»
function h4(dur) {
  const id = "h4";
  return { id, dur, html: scene({ id, dur, bg: "#05060c", vignette: 0.9,
    layers: [
      { name: "bg", blur: 16, svg: `<rect width="1080" height="1920" fill="#2a1a0e"/><rect x="0" width="420" height="1920" fill="#3a2010"/>${warm(0.2)}` },
      { name: "r", defs: glow(`${id}-bl`, 540, 860, 700, "#9ad0ff", 0.3), svg: `<g id="${id}-sh"><rect width="1080" height="1920" fill="url(#${id}-bl)" style="mix-blend-mode:screen"/>
        <g transform="translate(540,880) scale(2.6)">${radio(id)}<g transform="translate(0,-40)">${waves(id, 4, 100)}${waves(id + "l", 4, 100, -1)}</g></g>
        <g transform="translate(250,1500) rotate(28)">${hand(1)}</g><g transform="translate(830,1500) rotate(-28)">${hand(-1, HC.skinSh)}</g></g>` },
    ],
    js: `
    ${shakeJs(`#${id}-sh`, 0, dur, 4, 1.4)}
    cam("r", { scale: 1.0 }, { scale: 1.06, origin: "540px 880px" }, 0, ${dur});
    tl.set("#${id}-led", { fill: "#30ff60" }, 0.3);
    ${wavesJs(id, wt("h4", 0) - 0.05, dur - 0.1, 4, 0.45)} ${wavesJs(id + "l", wt("h4", 0) - 0.05, dur - 0.1, 4, 0.45)}
    ` }) };
}
// 5. fear: he doesn't know what to do
function h5(dur) {
  const id = "h5", r = `${id}-r`;
  return { id, dur, html: faceShot(id, dur, `
    look("${r}", 0, 0, 0, 0.01); eyesOpen("${r}", 1.5, 0, 0.01); brows("${r}", -26, -16, 0, 0.01);
    cam("char", { scale: 1.0 }, { scale: 1.14, origin: "50% 42%" }, 0, ${dur}, "power1.inOut");
    look("${r}", -6, 1, 0.6, 0.15); look("${r}", 6, 1, 1.1, 0.15); look("${r}", 0, 2, 1.6, 0.15);
    tl.fromTo("#${r}-torso", { y: 0 }, { y: -6, duration: 0.25, ease: "sine.inOut", yoyo: true, repeat: ${Math.floor(dur / 0.25) - 1} }, 0);
    ${shakeJs(`#${id}-sh`, 0, dur, 3, 1.0)}`) };
}
// 6. pause — and the question for the viewer
function h6(dur) {
  const id = "h6", r = `${id}-r`;
  const W = 900, H = 880, X = 90, Y = 380;
  const opt = (k, y, num, text) => `<g transform="translate(540,${y})"><g id="${id}-o${k}">
    <rect id="${id}-ob${k}" x="-380" y="-70" width="760" height="140" rx="30" fill="#1e2433" stroke="#3a4560" stroke-width="4"/>
    <circle cx="300" cy="0" r="44" fill="#2e3a5a"/><text x="300" y="20" font-family="Naskh" font-weight="700" font-size="54" fill="#fff" text-anchor="middle">${num}</text>
    <text x="230" y="20" font-family="Naskh" font-weight="700" font-size="56" fill="#f2f2f2" text-anchor="end">${text}</text></g></g>`;
  return { id, dur, html: scene({ id, dur, bg: "#05060c", vignette: 0.85, extraStyle: NASKH,
    layers: [
      { name: "frz", defs: glow(`${id}-wg`, 1100, 700, 900, "#ff9a40", 0.5), svg: `<g style="filter: grayscale(0.8) brightness(0.7)"><rect width="1080" height="1920" fill="#2a1a0e"/><rect x="620" width="460" height="1920" fill="#3a2010"/>
        ${place(540, 860, 2.25 * 1.14, ARASH(r), `${r}-all`)}</g>
        ${[...Array(96)].map((_, i) => `<rect y="${i * 20}" width="1080" height="3" fill="#000" opacity="0.25"/>`).join("")}
        <g id="${id}-pz"><rect x="70" y="120" width="26" height="80" rx="6" fill="#fff"/><rect x="112" y="120" width="26" height="80" rx="6" fill="#fff"/>
          <text x="160" y="182" font-family="'Courier New', monospace" font-weight="700" font-size="54" fill="#fff">PAUSE</text></g>
        <rect id="${id}-dim" width="1080" height="1920" fill="#05060c" opacity="0"/>` },
      { name: "ui", svg: `<g transform="translate(540,${Y + H / 2})"><g id="${id}-win" opacity="0"><g transform="translate(-540,${-(Y + H / 2)})">
        <rect x="${X + 10}" y="${Y + 16}" width="${W}" height="${H}" rx="40" fill="#000" opacity="0.5"/>
        <rect x="${X}" y="${Y}" width="${W}" height="${H}" rx="40" fill="#121726" stroke="#3a4560" stroke-width="4"/>
        <path d="M ${X},${Y + 40} A 40,40 0 0 1 ${X + 40},${Y} L ${X + W - 40},${Y} A 40,40 0 0 1 ${X + W},${Y + 40} L ${X + W},${Y + 96} L ${X},${Y + 96} Z" fill="#1e2433"/>
        <circle cx="${X + 60}" cy="${Y + 48}" r="14" fill="#ff5f57"/><circle cx="${X + 104}" cy="${Y + 48}" r="14" fill="#febc2e"/><circle cx="${X + 148}" cy="${Y + 48}" r="14" fill="#28c840"/>
        <text x="${X + W - 50}" y="${Y + 64}" font-family="Naskh" font-weight="700" font-size="40" fill="#aab4cc" text-anchor="end">انتخاب با شماست</text>
        <text x="540" y="${Y + 250}" font-family="Naskh" font-weight="700" font-size="68" fill="#ffffff" text-anchor="middle">آرش در قسمت بعدی</text>
        <text x="540" y="${Y + 345}" font-family="Naskh" font-weight="700" font-size="68" fill="#ffd873" text-anchor="middle">چه‌کار کنه؟</text>
        ${opt(0, Y + 500, "۱", "فرار کنه")}${opt(1, Y + 670, "۲", "بره دنبال دوستاش")}
        <g id="${id}-ft" opacity="0"><text x="540" y="${Y + H - 50}" font-family="Naskh" font-weight="700" font-size="44" fill="#aab4cc" text-anchor="middle">تو کامنت‌ها بنویس: ۱ یا ۲</text></g>
        </g></g></g>
        <g id="${id}-cur" opacity="0" transform="translate(760,1500)"><path d="M 0,0 L 0,70 L 18,54 L 32,84 L 44,78 L 30,48 L 54,48 Z" fill="#fff" stroke="#111" stroke-width="4" stroke-linejoin="round"/></g>` },
    ],
    js: `
    look("${r}", 0, 2, 0, 0.01); eyesOpen("${r}", 1.5, 0, 0.01); brows("${r}", -26, -16, 0, 0.01);
    tl.fromTo("#${id}-pz", { opacity: 1 }, { opacity: 0.3, duration: 0.3, yoyo: true, repeat: 3 }, 0);
    tl.to("#${id}-dim", { opacity: 0.6, duration: 0.4 }, 0.5);
    tl.fromTo("#${id}-win", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)" }, 0.55);
    tl.fromTo(["#${id}-o0", "#${id}-o1"], { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.35, stagger: 0.2, ease: "power2.out" }, 1.1);
    tl.set("#${id}-cur", { opacity: 1 }, ${(wt("h6", 9) - 0.4).toFixed(2)});
    tl.fromTo("#${id}-cur", { attr: { transform: "translate(760,1500)" } }, { attr: { transform: "translate(700,${Y + 520})" } , duration: 0.4, ease: "power2.inOut" }, ${(wt("h6", 9) - 0.4).toFixed(2)});
    tl.to("#${id}-ob0", { attr: { fill: "#2e4a8a", stroke: "#8fb4ff" }, duration: 0.2 }, ${wt("h6", 9).toFixed(2)}); tl.to("#${id}-o0", { scale: 1.05, transformOrigin: "50% 50%", duration: 0.2 }, ${wt("h6", 9).toFixed(2)});
    tl.to("#${id}-ob0", { attr: { fill: "#1e2433", stroke: "#3a4560" }, duration: 0.2 }, ${(wt("h6", 12) - 0.1).toFixed(2)}); tl.to("#${id}-o0", { scale: 1, duration: 0.2 }, ${(wt("h6", 12) - 0.1).toFixed(2)});
    tl.to("#${id}-cur", { attr: { transform: "translate(700,${Y + 690})" }, duration: 0.35, ease: "power2.inOut" }, ${(wt("h6", 12) - 0.3).toFixed(2)});
    tl.to("#${id}-ob1", { attr: { fill: "#2e4a8a", stroke: "#8fb4ff" }, duration: 0.2 }, ${wt("h6", 12).toFixed(2)}); tl.to("#${id}-o1", { scale: 1.05, transformOrigin: "50% 50%", duration: 0.2 }, ${wt("h6", 12).toFixed(2)});
    tl.to("#${id}-ob1", { attr: { fill: "#1e2433", stroke: "#3a4560" }, duration: 0.2 }, ${(wt("h6", 19) - 0.1).toFixed(2)}); tl.to("#${id}-o1", { scale: 1, duration: 0.2 }, ${(wt("h6", 19) - 0.1).toFixed(2)});
    tl.to("#${id}-cur", { opacity: 0, duration: 0.2 }, ${(wt("h6", 19) - 0.1).toFixed(2)});
    tl.fromTo("#${id}-ft", { opacity: 0 }, { opacity: 1, duration: 0.3 }, ${(wt("h6", 19) - 0.1).toFixed(2)});
    tl.to("#${id}-ft", { opacity: 0.4, duration: 0.4, yoyo: true, repeat: 3 }, ${(wt("h6", 19) + 0.6).toFixed(2)});
    ` }) };
}

export const DURS = Object.fromEntries(Object.entries(WJ).map(([k, v]) => [k, k === "h6" ? Math.round((v.duration + 1.5) * 1000) / 1000 : v.duration]));
export default [h1, h2, h3, h4, h5, h6].map((f) => f(DURS[f.name]));
export { radio, waves, wavesJs, ledJs, straps, folded, BAG, BAGD };
