// Part three: the cabin is gone; a light in the trees; an old cabin; the old man. The narrator speaks the lines;
// nobody's lips move as if talking (only the old man's final, faint smile forms).
import { scene, place, glow } from "../../forest-cabin/build/lib.mjs";
import * as C from "../../forest-cabin/build/chars.mjs";
import { pine, forestRoad, mist, mistDrift, walk, armTo, tw } from "../../forest-cabin/build/scenes.mjs";
const { RED, OLD } = C;

let seed = 3;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const darkOver = (op) => `<rect width="1080" height="1920" fill="#02040a" opacity="${op}"/>`;
const cool = (op = 0.45) => `<rect width="1080" height="1920" fill="#0a1430" opacity="${op}" style="mix-blend-mode:multiply"/>`;
const BEAMDOWN = (id) => `<linearGradient id="${id}" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#eef4ff" stop-opacity="0.55"/><stop offset="1" stop-color="#eef4ff" stop-opacity="0"/></linearGradient>`;
const BEAMG = (id, op = 0.5) => `<linearGradient id="${id}" x1="0.5" y1="1" x2="0.5" y2="0"><stop offset="0" stop-color="#eef4ff" stop-opacity="${op}"/><stop offset="1" stop-color="#eef4ff" stop-opacity="0"/></linearGradient>`;
const torchProp = (gid) => `<rect x="-14" y="-40" width="28" height="80" rx="8" fill="#2a2d34"/><rect x="-18" y="34" width="36" height="22" rx="6" fill="#3a3e48"/>
  <path d="M -16,56 L 16,56 L 260,900 L -260,900 Z" fill="url(#${gid})" style="mix-blend-mode:screen"/>`;
const beamUp = (gid, len = 640, w = 150) => `<path d="M -16,0 L 16,0 L ${w},${-len} L ${-w},${-len} Z" fill="url(#${gid})" style="mix-blend-mode:screen"/><circle r="8" fill="#fff"/>`;
const forestBack = (n = 14, s0 = 41) => { seed = s0; return `<rect width="1080" height="1920" fill="#04070c"/>${[...Array(n)].map((_, i) => `<g transform="translate(${-80 + i * 90 + rnd() * 40},${1500 + rnd() * 200}) scale(${0.7 + rnd() * 0.6})">${pine(i % 2 ? "#08120f" : "#0b1814", "#11241e")}</g>`).join("")}`; };
const headTurn = (p, dx, rot, t, d = 0.35, ease = "power2.inOut") => `tl.to("#${p}-head", { x: ${dx}, rotation: ${rot}, transformOrigin: "50% 80%", duration: ${d}, ease: "${ease}" }, ${t});`;
const shake = (sel, dur, amp, f = 1) => `(function () { const el = document.querySelector("${sel}"); const o = { t: 0 };
    tl.fromTo(o, { t: 0 }, { t: ${dur}, duration: ${dur}, ease: "none", onUpdate() { const t = o.t;
      const x = ${amp} * (Math.sin(t * 7.3 * ${f}) * 0.6 + Math.sin(t * 13.1 * ${f} + 1) * 0.4), y = ${amp} * (Math.sin(t * 9.7 * ${f} + 2) * 0.6 + Math.sin(t * 17.3 * ${f}) * 0.4);
      el.setAttribute("transform", "translate(" + x.toFixed(1) + "," + y.toFixed(1) + ")"); } }, 0); })();`;
const tremble = (sel, dur, amp = 2) => `(function () { const el = document.querySelector("${sel}"); const o = { t: 0 };
    tl.fromTo(o, { t: 0 }, { t: ${dur}, duration: ${dur}, ease: "none", onUpdate() { const t = o.t;
      el.setAttribute("transform", "rotate(" + (${amp} * Math.sin(t * 41) + ${amp * 0.5} * Math.sin(t * 67 + 1)).toFixed(2) + ")"); } }, 0); })();`;
// breathing fast: shoulders and chest heave
const pant = (p, dur, per = 0.5, amp = 8) => `tl.fromTo("#${p}-torso", { y: 0 }, { y: ${-amp}, duration: ${per / 2}, ease: "sine.inOut", yoyo: true, repeat: ${Math.floor(dur / (per / 2)) - 1} }, 0);`;
const sweat = (p) => `<g><path d="M -70,-110 C -76,-98 -78,-90 -70,-84 C -62,-90 -64,-98 -70,-110 Z" fill="#dff0ff" opacity="0.85"/><path d="M 92,-20 C 86,-6 84,4 92,10 C 100,4 98,-6 92,-20 Z" fill="#dff0ff" opacity="0.85"/></g>`;
const RED_T = (id, extra = {}) => C.friend(id, RED, { kind: "wavy", mouth: "tense", ...extra });
const OLD_M = (id, extra = {}) => C.friend(id, OLD, { kind: "old", beard: true, wrinkles: true, mouth: "old", ...extra });

// the old, worn cabin (front), base at (0,0)
function oldCabin(id) {
  const logs = [...Array(10)].map((_, i) => `<rect x="-360" y="${-420 + i * 42}" width="720" height="38" rx="19" fill="${i % 2 ? "#4a3220" : "#3e2a1a"}"/>
    <path d="M ${-300 + (i * 97) % 500},${-404 + i * 42} l 40,4" stroke="#2a1c10" stroke-width="3"/>`).join("");
  return `<g>
    <ellipse cx="0" cy="10" rx="460" ry="40" fill="#000" opacity="0.6"/>${logs}
    <path d="M -420,-420 L 0,-690 L 420,-420 Z" fill="#241610"/><path d="M -440,-410 L 0,-702 L 440,-410" stroke="#160e08" stroke-width="22" fill="none"/>
    <path d="M -260,-470 l 60,-40 l 10,14 l -60,40 Z" fill="#160e08"/>
    ${[[-380, -430], [-120, -560], [200, -500]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="60" ry="14" fill="#2a3a22" opacity="0.8"/>`).join("")}
    <rect x="200" y="-760" width="70" height="200" fill="#2e221c"/><rect x="194" y="-770" width="82" height="18" fill="#22180f"/>
    <g id="${id}-win"><rect x="-300" y="-330" width="150" height="130" fill="#ffcf6a"/><rect x="150" y="-330" width="150" height="130" fill="#ffcf6a"/>
      <path d="M -225,-330 L -225,-200 M -300,-265 L -150,-265 M 225,-330 L 225,-200 M 150,-265 L 300,-265" stroke="#2a1a10" stroke-width="8"/></g>
    <path d="M -310,-340 L -330,-190 L -300,-196 Z" fill="#2e1e12"/><path d="M 310,-340 L 336,-200 L 304,-200 Z" fill="#2e1e12" transform="rotate(8 310 -340)"/>
    <rect x="-70" y="-300" width="140" height="300" fill="#2a1a10"/><circle cx="40" cy="-150" r="8" fill="#8a7040"/>
    <path d="M -400,0 L 400,0 L 420,30 L -420,30 Z" fill="#3a2614"/><path d="M -100,30 L 100,30 L 110,60 L -110,60 Z" fill="#2e1e10"/>
  </g>`;
}
const smoke = (id, x, y, n = 6) => `<defs><radialGradient id="${id}-smg"><stop offset="0" stop-color="#9aa4b4"/><stop offset="1" stop-color="#9aa4b4" stop-opacity="0"/></radialGradient></defs>` + [...Array(n)].map((_, i) => `<circle id="${id}-sm${i}" cx="${x}" cy="${y}" r="${44 + i * 12}" fill="url(#${id}-smg)" opacity="0"/>`).join("");
const smokeJs = (id, dur, n = 6) => [...Array(n)].map((_, i) => { const t = (i * dur / n / 1.2).toFixed(2);
  return `tl.fromTo("#${id}-sm${i}", { x: 0, y: 0 }, { x: ${30 + i * 14}, y: ${-260 - i * 40}, duration: ${dur}, ease: "none" }, ${t});
  tl.fromTo("#${id}-sm${i}", { opacity: 0 }, { opacity: 0.18, duration: ${(dur * 0.3).toFixed(2)}, ease: "none" }, ${t});
  tl.to("#${id}-sm${i}", { opacity: 0, duration: ${(dur * 0.7).toFixed(2)}, ease: "none" }, ${(+t + dur * 0.3).toFixed(2)});`; }).join(" ");
const groundClearing = (seedv = 9) => { seed = seedv; return `<rect y="1150" width="1080" height="770" fill="#141a12"/>
  ${[...Array(60)].map(() => `<path d="M ${(rnd() * 1080).toFixed(0)},${(1170 + rnd() * 740).toFixed(0)} l 4,-${(10 + rnd() * 20).toFixed(0)} l 4,${(10 + rnd() * 20).toFixed(0)}" stroke="#22301c" stroke-width="3" fill="none"/>`).join("")}
  ${[...Array(9)].map(() => `<ellipse cx="${(rnd() * 1080).toFixed(0)}" cy="${(1200 + rnd() * 700).toFixed(0)}" rx="${(10 + rnd() * 18).toFixed(0)}" ry="${(6 + rnd() * 8).toFixed(0)}" fill="#2a2e2a"/>`).join("")}`; };
const treeLine = (y, s0 = 21, n = 20, dark = false) => { seed = s0; return [...Array(n)].map((_, i) => `<g transform="translate(${-60 + i * 60 + rnd() * 30},${y + rnd() * 50}) scale(${0.6 + rnd() * 0.45})">${pine(dark ? "#060e0c" : "#0a1714", "#122a22")}</g>`).join(""); };

// ── 1. he reaches the cabin's place — the camera passes his shoulder: nothing ────────────────────
function k1() {
  const id = "k1", dur = 6.5, r = `${id}-r`;
  return { id, dur, html: scene({ id, dur, fadeIn: true, bg: "#020305", vignette: 0.9,
    layers: [
      { name: "clearing", svg: `<rect width="1080" height="1920" fill="#05080f"/>${treeLine(1000, 21, 22)}${groundClearing()}${mist(`${id}-f`, 1120, 5, 0.1)}${darkOver(0.25)}${cool(0.4)}` },
      { name: "him", svg: `${place(780, 1160, 2.0, C.friendBack(r, "r"), `${r}-all`)}` },
    ],
    js: `
    ${mistDrift(`${id}-f`, 5, dur, 40)}
    tl.fromTo("#${r}-all", { y: 0 }, { y: -26, duration: 0.14, ease: "sine.inOut", yoyo: true, repeat: 7 }, 0);
    tl.to("#${r}-all", { y: 10, duration: 0.25, ease: "power3.out" }, 1.2); tl.to("#${r}-all", { y: 0, duration: 0.4, ease: "power2.inOut" }, 1.45);
    cam("clearing", { scale: 1.25, x: 0 }, { scale: 1.18, x: 0 }, 0, 1.2, "power2.out");
    cam("him", { scale: 1.0, x: 0 }, { scale: 1.0, x: 0 }, 0, 1.2);
    cam("clearing", { scale: 1.18, x: 0 }, { scale: 1.08, x: -40 }, 2.2, 3.4, "power2.inOut");
    cam("him", { scale: 1.0, x: 0, y: 0 }, { scale: 1.5, x: 900, y: 200 }, 2.2, 3.0, "power2.inOut");
    ${headTurn(r, -6, -2, 3.0, 0.8)}
    ` }) };
}

// ── 2. the empty place, slowly; then his face ────────────────────────────────────────────────────
function k2a() {
  const id = "k2a", dur = 4.2;
  return { id, dur, html: scene({ id, dur, bg: "#020305", vignette: 0.9,
    layers: [{ name: "all", defs: `<radialGradient id="${id}-pool"><stop offset="0" stop-color="#cfe0ff" stop-opacity="0.35"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></radialGradient>`, svg: `
      <rect width="1080" height="1920" fill="#05080f"/>${treeLine(820, 33, 22)}${groundClearing(13)}
      <ellipse id="${id}-spot" cx="400" cy="1500" rx="360" ry="140" fill="url(#${id}-pool)" style="mix-blend-mode:screen"/>
      ${mist(`${id}-f`, 1000, 5, 0.1)}${darkOver(0.2)}${cool(0.4)}` }],
    js: `${mistDrift(`${id}-f`, 5, dur, 40)}
    cam("all", { scale: 1.15, x: 60, y: 80 }, { scale: 1.08, x: -60, y: -40 }, 0, ${dur}, "sine.inOut");
    tl.fromTo("#${id}-spot", { attr: { cx: 300, cy: 1550 } }, { attr: { cx: 760, cy: 1400 }, duration: ${dur}, ease: "sine.inOut" }, 0);` }) };
}
function k2b() {
  const id = "k2b", dur = 4.6, r = `${id}-r`;
  return { id, dur, html: scene({ id, dur, bg: "#020305", vignette: 0.92,
    layers: [
      { name: "bg", blur: 9, defs: BEAMG(`${id}-bg`, 0.3), svg: `${forestBack(14, 55)}<path d="M 470,2000 L 610,2000 L 560,1100 L 520,1100 Z" fill="#1a1610"/>${darkOver(0.3)}` },
      { name: "face", defs: BEAMDOWN(`${id}-bd`) + glow(`${id}-fl`, 700, 1700, 900, "#cfe0ff", 0.4), svg: `
        <g id="${id}-sway">${place(540, 820, 1.6, RED_T(r, { propR: torchProp(`${id}-bd`), arms: [[8, -40], [-26, 46]] }) + sweat(r), `${r}-all`)}</g>
        <rect width="1080" height="1920" fill="url(#${id}-fl)" style="mix-blend-mode:screen"/>${cool(0.45)}` },
    ],
    js: `
    eyesOpen("${r}", 1.32, 0, 0.01); brows("${r}", -18, -12, 0, 0.01); look("${r}", 0, 1, 0, 0.01);
    ${pant(r, dur, 0.42, 10)}
    tl.fromTo("#${r}-all", { rotation: 0, x: 0 }, { rotation: 2.2, x: 18, transformOrigin: "50% 100%", duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: 4 }, 0);
    ${[...Array(18)].map((_, k) => armTo(r, 1, -26 + ((k * 7) % 5) - 2, 46 + (k % 2 ? 6 : -6), (k * 0.25).toFixed(2), 0.25, "sine.inOut")).join("\n")}
    look("${r}", -4, 1, 1.4, 0.15); look("${r}", 4, 0, 2.4, 0.15); look("${r}", 0, 1, 3.2, 0.2);
    cam("face", { scale: 1.0 }, { scale: 1.06, origin: "50% 40%" }, 0, ${dur});
    ` }) };
}

// ── 3. running; a warm light far in the trees; he slows ──────────────────────────────────────────
function k3a() {
  const id = "k3a", dur = 3.4, r = `${id}-r`;
  return { id, dur, html: scene({ id, dur, bg: "#020305", vignette: 0.92,
    layers: [
      { name: "bg", blur: 10, svg: forestBack(16, 61) + darkOver(0.3) },
      { name: "face", defs: glow(`${id}-warm`, -100, 700, 900, "#ffb24a", 0.6), svg: `<g id="${id}-shk">
        ${place(540, 860, 1.9, RED_T(r) + sweat(r), `${r}-all`)}
        ${cool(0.5)}<rect id="${id}-w" width="1080" height="1920" fill="url(#${id}-warm)" opacity="0" style="mix-blend-mode:screen"/></g>` },
    ],
    js: `
    ${shake(`#${id}-shk`, 1.6, 12, 1.6)}
    tl.fromTo("#${r}-all", { y: 0 }, { y: -20, duration: 0.13, ease: "sine.inOut", yoyo: true, repeat: 9 }, 0);
    eyesOpen("${r}", 1.15, 0, 0.01); brows("${r}", -12, -12, 0, 0.01); look("${r}", 0, -1, 0, 0.01);
    tl.fromTo("#${id}-w", { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.in" }, 1.1);
    look("${r}", -9, -1, 1.5, 0.3); turn("${r}", -14, 1.6, 0.6);
    brows("${r}", -18, -2, 1.7, 0.4); eyesOpen("${r}", 1.3, 1.7, 0.4);
    cam("bg", { x: 0 }, { x: 80 }, 1.5, 1.6);
    blink("${r}", 2.7, 0.16);
    ` }) };
}
function k3b() {
  const id = "k3b", dur = 3.2;
  return { id, dur, html: scene({ id, dur, bg: "#020305", vignette: 0.9,
    layers: [{ name: "all", defs: glow(`${id}-g`, 600, 1020, 90, "#ffc060", 1), svg: `<g id="${id}-shk">
      <rect width="1080" height="1920" fill="#04070d"/>
      ${treeLine(1300, 71, 26, true)}
      <circle id="${id}-light" cx="600" cy="1020" r="90" fill="url(#${id}-g)"/><rect x="584" y="1005" width="14" height="12" fill="#ffe08a"/><rect x="603" y="1005" width="14" height="12" fill="#ffe08a"/>
      ${[...Array(9)].map((_, i) => `<rect x="${40 + i * 120 + (i % 2) * 30}" y="0" width="${50 + (i % 3) * 20}" height="1920" fill="#020504"/>`).join("")}
      ${cool(0.35)}</g>` }],
    js: `${shake(`#${id}-shk`, dur, 5, 0.8)}
    flicker("#${id}-light", ${dur}, 0.9, 0.12);
    cam("all", { scale: 1.0 }, { scale: 1.1, origin: "56% 53%" }, 0, ${dur});` }) };
}

// ── 4. cautiously toward the light; the shape of a cabin forms ───────────────────────────────────
function k4() {
  const id = "k4", dur = 6.5, r = `${id}-r`;
  const road = forestRoad(`${id}-f`, { dur, speed: 0.7, dirt: true, roadHalf: 300, vy: 820, n: 40 });
  return { id, dur, html: scene({ id, dur, bg: "#020305", vignette: 0.92,
    layers: [
      { name: "path", defs: road.defs + BEAMG(`${id}-bg`) + glow(`${id}-cg`, 540, 790, 220, "#ffc060", 0.7), svg: `${road.svg}
        <g id="${id}-cab" transform="translate(540,820) scale(0.06)" opacity="0.2">${oldCabin(`${id}-c`)}</g>
        <circle id="${id}-glow" cx="540" cy="790" r="220" fill="url(#${id}-cg)" style="mix-blend-mode:screen"/>
        ${mist(`${id}-f`, 840, 5, 0.1)}${darkOver(0.3)}
        <g transform="translate(600,1640)"><g id="${id}-rb">${beamUp(`${id}-bg`, 700, 190)}</g></g>` },
      { name: "walker", svg: `<g transform="translate(540,1600) scale(0.22)"><g id="${r}-wrap">${C.friendFull(r, "r", { back: true, bag: true })}</g></g>${cool(0.45)}` },
    ],
    js: `${road.js}
    ${walk(r, 0, 9, 0.72, 10)}
    tl.fromTo("#${id}-cab", { attr: { transform: "translate(540,820) scale(0.06)" }, opacity: 0.15 }, { attr: { transform: "translate(540,860) scale(0.2)" }, opacity: 1, duration: ${dur}, ease: "power1.in" }, 0);
    tl.fromTo("#${id}-glow", { opacity: 0.6 }, { opacity: 1, duration: ${dur} }, 0);
    tl.fromTo("#${id}-rb", { rotation: -14 }, { rotation: 14, svgOrigin: "0 0", duration: 2.0, ease: "sine.inOut", yoyo: true, repeat: 2 }, 0);
    ${headTurn(r, -10, -4, 1.6, 0.5)} ${headTurn(r, 10, 4, 3.0, 0.6)} ${headTurn(r, 0, 0, 4.4, 0.5)}
    cam("path", { scale: 1.0 }, { scale: 1.08, origin: "50% 45%" }, 0, ${dur});
    ` }) };
}

// ── 5. the old cabin; he steps out of the trees and stops before it ──────────────────────────────
function k5() {
  const id = "k5", dur = 6.5, r = `${id}-r`;
  return { id, dur, html: scene({ id, dur, bg: "#02040a", vignette: 0.9,
    layers: [
      { name: "bg", svg: `<rect width="1080" height="1920" fill="#04070e"/>${[...Array(30)].map((_, i) => `<circle cx="${(i * 137) % 1080}" cy="${(i * 71) % 600}" r="${1 + (i % 3)}" fill="#dfe6ff" opacity="0.4"/>`).join("")}
        ${treeLine(1050, 91, 22, true)}<rect y="1180" width="1080" height="740" fill="#0c120e"/>` },
      { name: "cabin", defs: glow(`${id}-wg`, 540, 980, 600, "#ffb24a", 0.45), svg: `
        <g transform="translate(540,1260) scale(0.78)">${oldCabin(`${id}-c`)}</g>${smoke(id, 742, 640)}
        <rect id="${id}-wgl" width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/>${mist(`${id}-f`, 1220, 5, 0.1)}` },
      { name: "him", svg: `<g id="${r}-pos" transform="translate(-120,1700) scale(0.2)"><g id="${r}-wrap">${C.friendFull(r, "r", { back: true, bag: true })}</g></g>
        ${[[-30, 1960, 1.4], [1120, 1960, 1.5]].map(([x, y, s]) => `<g transform="translate(${x},${y}) scale(${s})">${pine("#020504", "#06100b")}</g>`).join("")}${cool(0.35)}` },
    ],
    js: `
    ${smokeJs(id, 4.5)}
    flicker("#${id}-wgl", ${dur}, 0.85, 0.08); flicker("#${id}-c-win", ${dur}, 0.95, 0.05);
    ${mistDrift(`${id}-f`, 5, dur, 40)}
    ${tw(`#${r}-pos`, "translate(-120,1700) scale(0.2)", "translate(470,1560) scale(0.17)", 0.4, 3.0, "power1.out")}
    ${walk(r, 0.4, 6, 0.5, 14)}
    cam("cabin", { scale: 1.0 }, { scale: 1.12, origin: "50% 62%" }, 0, ${dur});
    cam("bg", { scale: 1.0 }, { scale: 1.06, origin: "50% 62%" }, 0, ${dur});
    cam("him", { scale: 1.0 }, { scale: 1.1, origin: "50% 62%" }, 0, ${dur});
    ` }) };
}

// ── 6. a moment of relief; then careful steps toward the window ──────────────────────────────────
function k6() {
  const id = "k6", dur = 5.6, r = `${id}-r`;
  return { id, dur, html: scene({ id, dur, bg: "#02040a", vignette: 0.9,
    layers: [
      { name: "bg", blur: 8, svg: `<rect width="1080" height="1920" fill="#04070e"/><g transform="translate(940,1500) scale(1.2)">${oldCabin(`${id}-c`)}</g>${treeLine(1300, 17, 10, true)}` },
      { name: "him", defs: BEAMDOWN(`${id}-bd`) + glow(`${id}-wg`, 1200, 800, 900, "#ffb24a", 0.6), svg: `
        ${place(470, 900, 1.15, RED_T(r, { propR: torchProp(`${id}-bd`), arms: [[8, -40], [-14, 30]] }), `${r}-all`)}
        ${cool(0.5)}<rect width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/>` },
    ],
    js: `
    look("${r}", 8, -3, 0, 0.01); turn("${r}", 12, 0, 0.01); eyesOpen("${r}", 1.1, 0, 0.01); brows("${r}", -10, -8, 0, 0.01);
    eyesOpen("${r}", 0.92, 0.6, 0.6); brows("${r}", -4, -3, 0.6, 0.7);
    tl.fromTo("#${r}-torso", { y: 0 }, { y: -10, duration: 0.7, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0.5);
    blink("${r}", 1.6, 0.3);
    brows("${r}", -9, -8, 2.4, 0.4); eyesOpen("${r}", 1.05, 2.4, 0.4);
    tl.fromTo("#${r}-all", { x: 0, y: 0 }, { x: 260, duration: 2.6, ease: "power1.inOut" }, 2.8);
    ${[...Array(5)].map((_, k) => `tl.to("#${r}-all", { y: ${k % 2 ? 0 : 12}, duration: 0.26, ease: "sine.inOut" }, ${(2.8 + k * 0.52).toFixed(2)});`).join(" ")}
    cam("bg", { x: 0 }, { x: -220 }, 2.8, 2.7, "power1.inOut");
    cam("him", { x: 0 }, { x: -200 }, 2.8, 2.7, "power1.inOut");
    ` }) };
}

// ── 7. at the glass; through it: an old man eating, alone, unaware ────────────────────────────────
function k7a() {
  const id = "k7a", dur = 3.0, r = `${id}-r`;
  return { id, dur, html: scene({ id, dur, bg: "#02040a", vignette: 0.9,
    layers: [
      { name: "him", svg: `<rect width="1080" height="1920" fill="#05080f"/>${place(540, 980, 1.7, RED_T(r), `${r}-all`)}
        <rect width="1080" height="1920" fill="#ffb24a" opacity="0.22" style="mix-blend-mode:screen"/>` },
      { name: "glass", svg: `
        <path d="M 0,0 L 1080,0 L 1080,1920 L 0,1920 Z M 120,250 L 960,250 L 960,1700 L 120,1700 Z" fill="#241610" fill-rule="evenodd"/>
        <path d="M 540,250 L 540,1700 M 120,980 L 960,980" stroke="#241610" stroke-width="24"/>
        <path d="M 160,300 L 420,300 L 160,760 Z" fill="#fff" opacity="0.07"/><rect x="120" y="250" width="840" height="1450" fill="#3a2a1a" opacity="0.2"/>
        <ellipse id="${id}-fog" cx="540" cy="1150" rx="0" ry="0" fill="#dfe6ee" opacity="0.15"/>` },
    ],
    js: `
    tl.fromTo("#${r}-all", { scale: 0.86, y: 60 }, { scale: 1, y: 0, transformOrigin: "50% 50%", duration: 1.6, ease: "power2.out" }, 0);
    eyesOpen("${r}", 1.1, 0, 0.01); brows("${r}", -10, -10, 0, 0.01); look("${r}", 0, 2, 0, 0.01);
    look("${r}", -3, 5, 1.4, 0.4); eyesOpen("${r}", 1.2, 1.6, 0.4);
    tl.fromTo("#${id}-fog", { attr: { rx: 0, ry: 0 } }, { attr: { rx: 120, ry: 60 }, duration: 0.6, ease: "power2.out" }, 1.8);
    ` }) };
}
function k7b() {
  const id = "k7b", dur = 6.0, o = `${id}-o`;
  const spoon = `<rect x="-5" y="-20" width="10" height="90" rx="4" fill="#9aa0a8"/><ellipse cx="0" cy="84" rx="18" ry="12" fill="#b8bec6"/>`;
  const toMouth = (t) => `${armTo(o, 1, -6, 158, t, 0.9)} ${armTo(o, 1, -24, 80, t + 1.3, 0.9)}`;
  return { id, dur, html: scene({ id, dur, bg: "#100a06", vignette: 0.88,
    layers: [
      { name: "inside", blur: 3, defs: glow(`${id}-lamp`, 760, 640, 800, "#ffb24a", 0.6), svg: `
        <rect width="1080" height="1920" fill="#2a1a10"/>${[...Array(30)].map((_, i) => `<rect x="-20" y="${i * 66}" width="1120" height="60" rx="30" fill="${i % 2 ? "#33200f" : "#2e1d0e"}"/>`).join("")}
        <rect x="140" y="420" width="180" height="240" fill="#1e140c"/><rect x="152" y="432" width="156" height="216" fill="#3a2e22" opacity="0.6"/>
        <g transform="translate(780,520)"><path d="M -10,-140 L 10,-140 L 10,0 L -10,0 Z" fill="#1a120a"/><rect x="-40" y="0" width="80" height="90" rx="12" fill="#ffcf6a"/></g>
        ${place(540, 900, 1.05, OLD_M(o, { propR: spoon, arms: [[18, -70], [-24, 80]] }), `${o}-all`)}
        <path d="M -40,1420 L 1120,1420 L 1120,1960 L -40,1960 Z" fill="#4a2e18"/><path d="M -40,1420 L 1120,1420" stroke="#5e3c22" stroke-width="14"/>
        <g transform="translate(560,1460)"><ellipse cx="0" cy="0" rx="150" ry="36" fill="#d8ccb6"/><ellipse cx="0" cy="-8" rx="120" ry="22" fill="#8a5a2a"/></g>
        <rect x="170" y="1380" width="30" height="80" rx="6" fill="#ffcf6a" opacity="0.7"/>
        <rect id="${id}-lamp-l" width="1080" height="1920" fill="url(#${id}-lamp)" style="mix-blend-mode:screen"/>` },
      { name: "glass", blur: 6, svg: `
        <path d="M 0,0 L 1080,0 L 1080,1920 L 0,1920 Z M 70,180 L 1010,180 L 1010,1760 L 70,1760 Z" fill="#05080f" fill-rule="evenodd"/>
        <path d="M 540,180 L 540,1760 M 70,970 L 1010,970" stroke="#120c08" stroke-width="30"/>
        <path d="M 110,220 L 380,220 L 110,700 Z" fill="#fff" opacity="0.06"/><path d="M 620,1020 L 960,1020 L 620,1500 Z" fill="#fff" opacity="0.05"/>` },
    ],
    js: `
    flicker("#${id}-lamp-l", ${dur}, 0.9, 0.08);
    cam("inside", { scale: 1.0 }, { scale: 1.08, origin: "50% 45%" }, 0, ${dur});
    look("${o}", 0, 9, 0, 0.01); eyesOpen("${o}", 0.72, 0, 0.01); brows("${o}", 4, 5, 0, 0.01);
    ${toMouth(0.5)} ${toMouth(3.2)}
    tl.to("#${o}-head", { y: 8, duration: 0.6, ease: "sine.inOut" }, 0.9); tl.to("#${o}-head", { y: 0, duration: 0.6, ease: "sine.inOut" }, 1.9);
    tl.to("#${o}-head", { y: 8, duration: 0.6, ease: "sine.inOut" }, 3.6); tl.to("#${o}-head", { y: 0, duration: 0.6, ease: "sine.inOut" }, 4.6);
    blink("${o}", 2.6, 0.3);
    ` }) };
}

// ── 8. he knocks, steps back, waits ──────────────────────────────────────────────────────────────
function doorFront(id, { open = false } = {}) {
  return `<rect width="1080" height="1920" fill="#2e1e12"/>${[...Array(30)].map((_, i) => `<rect x="-20" y="${i * 66}" width="1120" height="60" rx="30" fill="${i % 2 ? "#3a2616" : "#342214"}"/>`).join("")}
    <rect x="200" y="300" width="560" height="1500" fill="#1a0f08"/>
    <rect id="${id}-gap" x="220" y="320" width="520" height="1480" fill="#ffc060" opacity="${open ? 1 : 0}"/>
    <g id="${id}-door"><rect x="220" y="320" width="520" height="1480" fill="#4a2e18"/>
      ${[0, 1, 2, 3].map((i) => `<rect x="${250 + (i % 2) * 240}" y="${360 + Math.floor(i / 2) * 700}" width="220" height="640" rx="8" fill="none" stroke="#2e1c0e" stroke-width="12"/>`).join("")}
      <circle cx="690" cy="1080" r="22" fill="#8a7040"/></g>`;
}
function k8() {
  const id = "k8", dur = 5.4, r = `${id}-r`;
  return { id, dur, html: scene({ id, dur, bg: "#02040a", vignette: 0.9,
    layers: [
      { name: "bg", blur: 4, svg: `<g transform="translate(-260,0)">${doorFront(id)}</g><rect x="560" width="520" height="1920" fill="#04070e"/>${treeLine(1500, 27, 8, true).replace(/translate\((-?[\d.]+)/g, (m, x) => `translate(${(+x * 0.5 + 560).toFixed(1)}`)}` },
      { name: "him", defs: BEAMDOWN(`${id}-bd`) + glow(`${id}-wg`, 0, 700, 800, "#ffb24a", 0.55), svg: `
        ${place(700, 920, 1.15, RED_T(r, { propR: torchProp(`${id}-bd`), arms: [[8, -40], [-14, 30]] }), `${r}-all`)}
        ${cool(0.5)}<rect width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/>` },
    ],
    js: `
    turn("${r}", -14, 0, 0.01); look("${r}", -8, -1, 0, 0.01); eyesOpen("${r}", 1.12, 0, 0.01); brows("${r}", -12, -11, 0, 0.01);
    tl.fromTo("#${r}-torso", { y: 0 }, { y: -12, duration: 0.5, ease: "power2.out" }, 0.3);
    ${armTo(r, -1, 70, -40, 0.4, 0.9, "power1.inOut")}
    ${[0, 1, 2].map((k) => `${armTo(r, -1, 76, -60, (1.5 + k * 0.32).toFixed(2), 0.12, "power2.in")} ${armTo(r, -1, 70, -40, (1.62 + k * 0.32).toFixed(2), 0.16, "power2.out")}`).join("\n")}
    ${armTo(r, -1, 10, -55, 2.6, 0.6)}
    tl.to("#${r}-all", { x: 60, y: 14, duration: 0.5, ease: "power2.out" }, 2.7);
    blink("${r}", 3.6, 0.2); look("${r}", -9, -2, 3.9, 0.3);
    ` }) };
}

// ── 9. the door opens: hand on the handle, then his face, from below ─────────────────────────────
function k9() {
  const id = "k9", dur = 5.2, o = `${id}-o`;
  return { id, dur, html: scene({ id, dur, bg: "#02040a", vignette: 0.9,
    layers: [
      { name: "door", defs: glow(`${id}-in`, 480, 900, 900, "#ffb24a", 0.6) + `<linearGradient id="${id}-side" x1="0" y1="0" x2="1" y2="0"><stop offset="0.45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></linearGradient>`, svg: `${doorFront(id)}
        <g id="${id}-man" opacity="0">${place(470, 760, 1.2, OLD_M(o), `${o}-all`)}</g>
        <rect width="1080" height="1920" fill="url(#${id}-in)" style="mix-blend-mode:screen"/>
        <rect width="1080" height="1920" fill="url(#${id}-side)"/>` },
      { name: "hand", svg: `<g transform="translate(700,1080) scale(0.7)"><g id="${id}-hand"><circle cx="-10" cy="0" r="30" fill="#8a7040"/><path d="M -50,-40 C 0,-70 60,-60 80,-30 L 84,40 C 40,60 -20,60 -50,40 Z" fill="${OLD.skinSh}"/>
        ${[-30, 0, 30].map((x) => `<path d="M ${x},-50 L ${x},40" stroke="${OLD.deep}" stroke-width="5" opacity="0.6"/>`).join("")}<rect x="-140" y="-60" width="110" height="130" fill="${OLD.shirt}"/></g></g>` },
    ],
    js: `
    cam("door", { scale: 1.5, x: -220, y: -100, origin: "50% 50%" }, { scale: 1.5, x: -220, y: -100 }, 0, 1.4);
    cam("hand", { scale: 1.5, x: -220, y: -100, origin: "50% 50%" }, { scale: 1.5, x: -220, y: -100 }, 0, 1.4);
    tl.to("#${id}-hand", { rotation: 30, svgOrigin: "0 0", duration: 0.5, ease: "power2.inOut" }, 0.6);
    tl.fromTo("#${id}-door", { scaleX: 1 }, { scaleX: 0.25, transformOrigin: "100% 50%", duration: 2.2, ease: "power1.inOut" }, 1.3);
    tl.fromTo("#${id}-gap", { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.3);
    tl.to("#${id}-hand", { opacity: 0, duration: 0.3 }, 1.5);
    tl.fromTo("#${id}-man", { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.9);
    cam("door", { scale: 1.5, x: -220, y: -100 }, { scale: 1.12, x: 0, y: 120, origin: "50% 50%" }, 1.4, 2.6, "power2.inOut");
    look("${o}", 3, 6, 0, 0.01); eyesOpen("${o}", 0.82, 0, 0.01); brows("${o}", 4, 6, 0, 0.01);
    tl.fromTo("#${o}-head", { rotation: 0 }, { rotation: -1.5, transformOrigin: "50% 90%", duration: 2.0, ease: "sine.inOut" }, 3.0);
    blink("${o}", 4.4, 0.4);
    ` }) };
}

// ── 10. two-shot in the doorway; then the old man: "alone?" — in a look, no words ────────────────
function k10a() {
  const id = "k10a", dur = 3.4, o = `${id}-o`, r = `${id}-r`;
  return { id, dur, html: scene({ id, dur, bg: "#02040a", vignette: 0.9,
    layers: [
      { name: "door", defs: glow(`${id}-in`, 700, 800, 800, "#ffb24a", 0.6), svg: `<rect width="1080" height="1920" fill="#2e1e12"/>
        <rect x="420" y="200" width="620" height="1720" fill="#ffc060" opacity="0.85"/><rect x="400" y="180" width="40" height="1740" fill="#1a0f08"/><rect x="1040" y="180" width="40" height="1740" fill="#1a0f08"/>
        ${place(740, 820, 1.05, OLD_M(o), `${o}-all`)}<rect width="1080" height="1920" fill="url(#${id}-in)" style="mix-blend-mode:screen"/>` },
      { name: "fg", blur: 3, svg: `${place(170, 1150, 1.5, C.friendBack(r, "r"), `${r}-all`)}${cool(0.5)}` },
    ],
    js: `
    look("${o}", -6, 3, 0, 0.01); eyesOpen("${o}", 0.82, 0, 0.01); brows("${o}", 5, 6, 0, 0.01); turn("${o}", -6, 0, 0.01);
    cam("door", { scale: 1.0 }, { scale: 1.05 }, 0, ${dur}); cam("fg", { scale: 1.0 }, { scale: 1.03 }, 0, ${dur});
    tl.fromTo("#${r}-all", { y: 0 }, { y: -6, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: 4 }, 0);
    ` }) };
}
function oldCU(id, dur, kind) {
  const o = `${id}-o`;
  const fin = kind === "final";
  return { id, dur, html: scene({ id, dur, bg: "#02040a", vignette: 0.94,
    layers: [
      { name: "bg", blur: 14, defs: glow(`${id}-in`, 540, 700, 900, "#ffb24a", 0.75), svg: `<rect width="1080" height="1920" fill="#3a2410"/><rect width="1080" height="1920" fill="url(#${id}-in)"/>` },
      { name: "face", defs: `<linearGradient id="${id}-shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="0.55" stop-color="#000" stop-opacity="0.05"/><stop offset="1" stop-color="#000" stop-opacity="0.65"/></linearGradient>`, svg: `
        ${place(540, 900, 2.5, OLD_M(o), `${o}-all`)}
        <rect width="1080" height="1920" fill="url(#${id}-shade)"/>
        <rect width="1080" height="1920" fill="#1a0a04" opacity="0.25" style="mix-blend-mode:multiply"/>` },
    ],
    js: fin ? `
    look("${o}", 0, 0, 0, 0.01); eyesOpen("${o}", 0.85, 0, 0.01); brows("${o}", 4, 6, 0, 0.01);
    cam("face", { scale: 1.0 }, { scale: 1.16, origin: "50% 42%" }, 0, ${dur}, "power1.inOut");
    tl.to("#${o}-head", { rotation: 7, transformOrigin: "50% 85%", duration: 2.2, ease: "sine.inOut" }, 1.4);
    eyesOpen("${o}", 0.78, 1.6, 1.0);
    tl.fromTo("#${o}-mC", { opacity: 0 }, { opacity: 1, duration: 1.4, ease: "sine.inOut" }, 3.6);
    tl.to("#${o}-mN", { opacity: 0, duration: 1.4, ease: "sine.inOut" }, 3.6);
    ` : `
    look("${o}", -2, 0, 0, 0.01); eyesOpen("${o}", 0.85, 0, 0.01); brows("${o}", 4, 6, 0, 0.01);
    cam("face", { scale: 1.0 }, { scale: 1.06, origin: "50% 42%" }, 0, ${dur});
    tl.to("#${o}-head", { rotation: 3, y: -6, transformOrigin: "50% 85%", duration: 0.9, ease: "sine.inOut" }, 0.8);
    brows("${o}", 0, 3, 0.9, 0.6); look("${o}", -1, -1, 0.9, 0.5);
    tl.to("#${o}-head", { rotation: 1, y: 0, transformOrigin: "50% 85%", duration: 0.8, ease: "sine.inOut" }, 2.6);
    ` }) };
}
// ── 11. red: fear, a pause, a slow nod ───────────────────────────────────────────────────────────
function redCU(id, dur, kind) {
  const r = `${id}-r`;
  const shock = kind === "shock";
  return { id, dur, html: scene({ id, dur, bg: "#02040a", vignette: 0.94, fadeOut: shock,
    layers: [
      { name: "bg", blur: 12, svg: forestBack(14, 77) + darkOver(0.35) },
      { name: "face", defs: glow(`${id}-wg`, -100, 800, 900, "#ffb24a", 0.6), svg: `
        ${place(540, 860, 2.3, RED_T(r) + sweat(r), `${r}-all`)}
        ${cool(0.5)}<rect width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/>` },
    ],
    js: shock ? `
    eyesOpen("${r}", 1.55, 0, 0.01); brows("${r}", -24, -10, 0, 0.01); look("${r}", -2, -1, 0, 0.01);
    tl.fromTo("#${r}-all", { scale: 1 }, { scale: 1.04, transformOrigin: "50% 45%", duration: 0.25, ease: "power3.out" }, 0);
    ` : `
    eyesOpen("${r}", 1.15, 0, 0.01); brows("${r}", -12, -12, 0, 0.01); look("${r}", -3, -2, 0, 0.01);
    ${[0.4, 0.8, 1.2].map((t, k) => `look("${r}", ${-3 + (k % 2 ? 1.2 : -0.8)}, ${-2 + (k % 2 ? 0.6 : -0.4)}, ${t}, 0.1);`).join(" ")}
    blink("${r}", 1.6, 0.2);
    tl.to("#${r}-head", { y: 16, rotation: 1, transformOrigin: "50% 90%", duration: 1.1, ease: "sine.inOut" }, 2.2);
    look("${r}", -3, 4, 2.3, 0.8);
    tl.to("#${r}-head", { y: 0, rotation: 0, transformOrigin: "50% 90%", duration: 1.0, ease: "sine.inOut" }, 3.4);
    look("${r}", -3, -2, 3.5, 0.6);
    ` }) };
}

export default [
  k1(), k2a(), k2b(), k3a(), k3b(), k4(), k5(), k6(), k7a(), k7b(), k8(), k9(), k10a(),
  oldCU("k10b", 3.6, "alone"), redCU("k11", 4.8, "nod"), oldCU("k12", 6.5, "final"), redCU("k13", 2.8, "shock"),
];
