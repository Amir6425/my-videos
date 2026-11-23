// Part two: the walk, the scream, the vanishing, the search, the flight. Red never speaks; his lips never move.
import { scene, place, glow } from "../../forest-cabin/build/lib.mjs";
import * as C from "../../forest-cabin/build/chars.mjs";
import { pine, forestRoad, mist, mistDrift, walk, armTo, tw } from "../../forest-cabin/build/scenes.mjs";
const { RED, WHITE, BLUE } = C;

let seed = 5;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

const BEAMG = (id, op = 0.55) => `<linearGradient id="${id}" x1="0.5" y1="1" x2="0.5" y2="0"><stop offset="0" stop-color="#eef4ff" stop-opacity="${op}"/><stop offset="1" stop-color="#eef4ff" stop-opacity="0"/></linearGradient>`;
const beamUp = (gid, len = 640, w = 150) => `<path d="M -16,0 L 16,0 L ${w},${-len} L ${-w},${-len} Z" fill="url(#${gid})" style="mix-blend-mode:screen"/><circle r="8" fill="#fff"/>`;
// flashlight held in the forearm frame: the beam continues along the forearm (+y)
const torchProp = (gid) => `<rect x="-14" y="-40" width="28" height="80" rx="8" fill="#2a2d34"/><rect x="-18" y="34" width="36" height="22" rx="6" fill="#3a3e48"/>
  <path d="M -16,56 L 16,56 L 260,900 L -260,900 Z" fill="url(#${gid})" style="mix-blend-mode:screen"/>`;
const BEAMDOWN = (id) => `<linearGradient id="${id}" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#eef4ff" stop-opacity="0.6"/><stop offset="1" stop-color="#eef4ff" stop-opacity="0"/></linearGradient>`;
// handheld shake on a wrapper group, a function of time only
const shake = (sel, dur, amp, f = 1) => `(function () { const el = document.querySelector("${sel}"); const o = { t: 0 };
    tl.fromTo(o, { t: 0 }, { t: ${dur}, duration: ${dur}, ease: "none", onUpdate() { const t = o.t;
      const x = ${amp} * (Math.sin(t * 7.3 * ${f}) * 0.6 + Math.sin(t * 13.1 * ${f} + 1) * 0.4), y = ${amp} * (Math.sin(t * 9.7 * ${f} + 2) * 0.6 + Math.sin(t * 17.3 * ${f}) * 0.4), r = ${amp * 0.03} * Math.sin(t * 5.1 * ${f});
      el.setAttribute("transform", "translate(" + x.toFixed(1) + "," + y.toFixed(1) + ") rotate(" + r.toFixed(2) + " 540 960)"); } }, 0); })();`;
const forestBack = (id, n = 14) => { seed = 41; return `<rect width="1080" height="1920" fill="#04070c"/>${[...Array(n)].map((_, i) => `<g transform="translate(${-80 + i * 90 + rnd() * 40},${1500 + rnd() * 200}) scale(${0.7 + rnd() * 0.6})">${pine(i % 2 ? "#08120f" : "#0b1814", "#11241e")}</g>`).join("")}`; };
const fullAt = (pid, who, x, y, s, opts = {}) => `<g transform="translate(${x},${y}) scale(${s})"><g id="${pid}-wrap">${C.friendFull(pid, who, { back: true, bag: true, ...opts })}</g></g>`;
const headTurn = (p, dx, rot, t, d = 0.35, ease = "power2.inOut") => `tl.to("#${p}-head", { x: ${dx}, rotation: ${rot}, transformOrigin: "50% 80%", duration: ${d}, ease: "${ease}" }, ${t});`;
const runCycle = (p, t0, n, step, amp = 32) => [...Array(n)].map((_, k) => {
  const a = k % 2 ? 1 : -1, t = (t0 + k * step).toFixed(2);
  return `tl.to("#${p}-legL", { rotation: ${amp * a}, svgOrigin: "-60 600", duration: ${step}, ease: "sine.inOut" }, ${t});
    tl.to("#${p}-legR", { rotation: ${-amp * a}, svgOrigin: "60 600", duration: ${step}, ease: "sine.inOut" }, ${t});
    ${armTo(p, -1, 40 * a, -40 * a, t, step, "sine.inOut")} ${armTo(p, 1, 40 * a, 40 * a, t, step, "sine.inOut")}
    tl.to("#${p}-body", { y: -30, duration: ${(step / 2).toFixed(2)}, ease: "sine.out" }, ${t}); tl.to("#${p}-body", { y: 0, duration: ${(step / 2).toFixed(2)}, ease: "sine.in" }, ${(t0 + k * step + step / 2).toFixed(2)});`;
}).join("\n");
const sweat = (p) => `<g id="${p}-sweat"><path d="M -70,-110 C -76,-98 -78,-90 -70,-84 C -62,-90 -64,-98 -70,-110 Z" fill="#dff0ff" opacity="0.85"/><circle cx="-72" cy="-92" r="2" fill="#fff"/>
  <path id="${p}-drop" d="M 92,-20 C 86,-6 84,4 92,10 C 100,4 98,-6 92,-20 Z" fill="#dff0ff" opacity="0.85"/><path d="M 40,-128 C 36,-120 35,-114 40,-110 C 45,-114 44,-120 40,-128 Z" fill="#dff0ff" opacity="0.7"/></g>`;
const darkOver = (op) => `<rect width="1080" height="1920" fill="#02040a" opacity="${op}"/>`;

// ── 1. from behind: red lags, sweeping his light into the trees ──────────────────────────────────
function h1() {
  const id = "h1", dur = 6.0, r = `${id}-r`;
  const road = forestRoad(`${id}-f`, { dur, speed: 1.0, dirt: true, roadHalf: 300, vy: 820, n: 40 });
  let js = `${road.js}
    cam("path", { scale: 1.0 }, { scale: 1.05, origin: "50% 60%" }, 0, ${dur});
    cam("walkers", { scale: 1.0 }, { scale: 1.04, origin: "50% 80%" }, 0, ${dur});
    ${mistDrift(`${id}-f`, 5, dur, 50)}
    ${walk(`${id}-w`, 0, 12, 0.5, 14)} ${walk(`${id}-b`, 0.1, 12, 0.5, 14)} ${walk(r, 0.2, 9, 0.62, 12)}
    tl.fromTo("#${id}-rb", { rotation: 0 }, { rotation: -42, svgOrigin: "0 0", duration: 0.6, ease: "power2.inOut" }, 0.8);
    ${headTurn(r, -20, -8, 0.8, 0.5)}
    tl.to("#${id}-rb", { rotation: 0, svgOrigin: "0 0", duration: 0.2, ease: "power3.out" }, 1.9); ${headTurn(r, 0, 0, 1.9, 0.18, "power3.out")}
    tl.to("#${id}-rb", { rotation: 46, svgOrigin: "0 0", duration: 0.7, ease: "power2.inOut" }, 2.8); ${headTurn(r, 22, 8, 2.8, 0.6)}
    tl.to("#${id}-rb", { rotation: 0, svgOrigin: "0 0", duration: 0.2, ease: "power3.out" }, 3.8); ${headTurn(r, 0, 0, 3.8, 0.18, "power3.out")}
    tl.to("#${id}-rb", { rotation: -30, svgOrigin: "0 0", duration: 0.45, ease: "power2.inOut" }, 4.5); ${headTurn(r, -16, -6, 4.5, 0.4)}
    tl.to("#${id}-rb", { rotation: 0, svgOrigin: "0 0", duration: 0.18, ease: "power3.out" }, 5.2); ${headTurn(r, 0, 0, 5.2, 0.16, "power3.out")}
    ${[["w", -4], ["b", 4]].map(([w, a]) => `tl.fromTo("#${id}-${w}b", { rotation: ${a} }, { rotation: ${-a}, svgOrigin: "0 0", duration: 1.5, ease: "sine.inOut", yoyo: true, repeat: 3 }, 0);`).join(" ")}
  `;
  return { id, dur, html: scene({ id, dur, fadeIn: true, bg: "#020305", vignette: 0.9,
    layers: [
      { name: "path", defs: road.defs + BEAMG(`${id}-bg`), svg: `${road.svg}${mist(`${id}-f`, 840, 5, 0.1)}
        <g transform="translate(460,1225)"><g id="${id}-wb">${beamUp(`${id}-bg`, 420, 110)}</g></g>
        <g transform="translate(640,1215)"><g id="${id}-bb">${beamUp(`${id}-bg`, 420, 110)}</g></g>
        <g transform="translate(605,1660)"><g id="${id}-rb">${beamUp(`${id}-bg`, 760, 210)}</g></g>
        ${darkOver(0.35)}` },
      { name: "walkers", svg: `${fullAt(`${id}-w`, "w", 440, 1260, 0.13)}${fullAt(`${id}-b`, "b", 625, 1250, 0.13)}${fullAt(r, "r", 560, 1600, 0.21)}
        <rect width="1080" height="1920" fill="#0a1430" opacity="0.45" style="mix-blend-mode:multiply"/>` },
    ],
    js }) };
}

// ── 2. the two ahead stop dead; the camera rushes in; they stare off-frame and scream ────────────
function h2() {
  const id = "h2", dur = 4.2, w = `${id}-w`, b = `${id}-b`;
  const road = forestRoad(`${id}-f`, { dur, speed: 0.7, dirt: true, roadHalf: 300, vy: 820, n: 36 });
  const fw = `${id}-fw`, fb = `${id}-fb`;
  const js = `${road.js}
    ${walk(w, 0, 3, 0.45, 14)} ${walk(b, 0.08, 3, 0.45, 14)}
    tl.to(["#${w}-legL", "#${w}-legR", "#${b}-legL", "#${b}-legR"], { rotation: 0, duration: 0.12 }, 1.35);
    tl.to(["#${w}-body", "#${b}-body"], { y: 0, duration: 0.1 }, 1.35);
    ${headTurn(w, -10, -4, 1.4, 0.12, "power3.out")} ${headTurn(b, -8, -3, 1.42, 0.12, "power3.out")}
    tl.fromTo("#${S(id)}-back", { scale: 1, x: 0, y: 0 }, { scale: 1.9, y: 260, transformOrigin: "50% 60%", duration: 0.5, ease: "power3.in" }, 1.55);
    tl.set("#${S(id)}-back", { opacity: 0 }, 2.05);
    tl.fromTo("#${S(id)}-front", { opacity: 0 }, { opacity: 1, duration: 0.04 }, 2.05);
    tl.fromTo("#${id}-flash", { opacity: 0.0 }, { opacity: 0.8, duration: 0.03 }, 2.05); tl.to("#${id}-flash", { opacity: 0, duration: 0.25 }, 2.08);
    look("${fw}", -9, -1, 0, 0.01); look("${fb}", -9, -1, 0, 0.01);
    eyesOpen("${fw}", 1.3, 0, 0.01); eyesOpen("${fb}", 1.3, 0, 0.01); brows("${fw}", -18, -8, 0, 0.01); brows("${fb}", -18, -8, 0, 0.01);
    turn("${fw}", -14, 0, 0.01); turn("${fb}", -14, 0, 0.01);
    ${shake(`#${id}-shk`, dur, 10, 2)}
    cam("front", { scale: 1.0 }, { scale: 1.06 }, 2.05, ${(dur - 2.05).toFixed(2)});
  `;
  return { id, dur, html: scene({ id, dur, bg: "#020305", vignette: 0.9,
    layers: [
      { name: "back", defs: road.defs + BEAMG(`${id}-bg`), svg: `${road.svg}
        <g transform="translate(470,1290)">${beamUp(`${id}-bg`, 520, 130)}</g><g transform="translate(640,1290)">${beamUp(`${id}-bg`, 520, 130)}</g>
        ${darkOver(0.3)}${fullAt(w, "w", 450, 1330, 0.2)}${fullAt(b, "b", 630, 1330, 0.2)}
        <rect width="1080" height="1920" fill="#0a1430" opacity="0.4" style="mix-blend-mode:multiply"/>` },
      { name: "front", defs: glow(`${id}-up`, 540, 1900, 1100, "#dfe8ff", 0.55), svg: `<g id="${id}-shk">
        ${forestBack(id)}
        ${place(310, 900, 1.15, C.friend(fw, WHITE, { kind: "fade", beard: true, mouth: "scream" }), `${fw}-all`)}
        ${place(790, 930, 1.15, C.friend(fb, BLUE, { kind: "curly", mouth: "scream" }), `${fb}-all`)}
        <rect width="1080" height="1920" fill="url(#${id}-up)" style="mix-blend-mode:screen"/>
        <rect width="1080" height="1920" fill="#0a1430" opacity="0.35" style="mix-blend-mode:multiply"/></g>
        <rect id="${id}-flash" width="1080" height="1920" fill="#fff" opacity="0"/>` },
    ],
    js }).replace(`id="${id}-front"`, `id="${id}-front" style="opacity:0"`) };
}
const S = (id) => id;

// ── 3. locked wide: they are there — then gone; their flashlights drop ───────────────────────────
function h3() {
  const id = "h3", dur = 5.5;
  const road = forestRoad(`${id}-f`, { dur, speed: 0, dirt: true, roadHalf: 300, vy: 820, n: 40 });
  const T = (sel, x0, y0, r0, x1, y1, r1, t) => `tl.fromTo("${sel}", { attr: { transform: "translate(${x0},${y0}) rotate(${r0})" } }, { attr: { transform: "translate(${x1},${y1}) rotate(${r1})" }, duration: 0.42, ease: "power2.in" }, ${t});
    tl.to("${sel}", { attr: { transform: "translate(${x1 + 6},${y1}) rotate(${r1 + 8})" }, duration: 0.3, ease: "power2.out" }, ${t + 0.42});`;
  const torch = (k, x, y) => `<g id="${id}-t${k}" transform="translate(${x},${y}) rotate(0)"><g transform="rotate(180)">
      <rect x="-10" y="-60" width="20" height="60" rx="5" fill="#2a2d34"/><path d="M -10,0 L 10,0 L 160,520 L -160,520 Z" fill="url(#${id}-bd)" style="mix-blend-mode:screen"/></g></g>`;
  const js = `${road.js}
    ${mistDrift(`${id}-f`, 5, dur, 30)}
    tl.set(["#${id}-w-wrap", "#${id}-b-wrap"], { opacity: 0 }, 1.5);
    ${T(`#${id}-t0`, 470, 1180, 0, 455, 1395, 96, 1.5)}
    ${T(`#${id}-t1`, 640, 1180, 0, 660, 1400, -84, 1.52)}
    ${[...Array(6)].map((_, i) => `tl.fromTo("#${id}-lf${i}", { x: 0, y: 0, rotation: 0 }, { x: ${30 - i * 12}, y: ${300 + i * 40}, rotation: ${120 + i * 30}, duration: ${dur}, ease: "none" }, 0);`).join(" ")}
  `;
  return { id, dur, html: scene({ id, dur, bg: "#020305", vignette: 0.92,
    layers: [
      { name: "path", defs: road.defs + BEAMDOWN(`${id}-bd`), svg: `${road.svg}${mist(`${id}-f`, 840, 5, 0.1)}
        ${darkOver(0.35)}
        ${[[300, 1430], [760, 1440], [520, 1500]].map(([x, y]) => `<path d="M ${x - 80},${y} C ${x - 40},${y - 20} ${x + 40},${y - 10} ${x + 90},${y + 10}" stroke="#2a1e14" stroke-width="12" fill="none"/>`).join("")}
        ${fullAt(`${id}-w`, "w", 455, 1330, 0.2)}${fullAt(`${id}-b`, "b", 640, 1330, 0.2)}
        ${torch(0, 470, 1180)}${torch(1, 640, 1180)}
        ${[...Array(6)].map((_, i) => `<path id="${id}-lf${i}" d="M ${150 + i * 150},${200 + (i % 3) * 120} c 10,-12 26,-12 30,0 c -6,12 -22,12 -30,0 Z" fill="#6a4a22"/>`).join("")}
        <rect width="1080" height="1920" fill="#0a1430" opacity="0.4" style="mix-blend-mode:multiply"/>` },
    ],
    js }) };
}

// ── 4. red runs toward the spot; handheld chase from behind ──────────────────────────────────────
function chase(id, dur, { speed, shakeAmp, branches = false, cabinGlow = false, fadeOut = false }) {
  const r = `${id}-r`;
  const road = forestRoad(`${id}-f`, { dur, speed, dirt: true, roadHalf: 300, vy: 820, n: 44 });
  const steps = Math.floor(dur / 0.24);
  let js = `${road.js}
    ${runCycle(r, 0, steps, 0.24)}
    ${shake(`#${id}-shk`, dur, shakeAmp, 1.6)}
    ${[...Array(Math.floor(dur / 0.3))].map((_, k) => `tl.to("#${id}-rb", { rotation: ${(k % 2 ? 1 : -1) * (20 + (k * 13) % 25)}, svgOrigin: "0 0", duration: 0.3, ease: "sine.inOut" }, ${(k * 0.3).toFixed(2)});`).join(" ")}
  `;
  if (branches) js += [...Array(7)].map((_, k) => {
    const left = k % 2 === 0, t = (0.4 + k * 0.85).toFixed(2);
    return `tl.fromTo("#${id}-br${k}", { x: ${left ? -700 : 700}, opacity: 1 }, { x: ${left ? 900 : -900}, duration: 0.32, ease: "none" }, ${t});`;
  }).join(" ");
  if (cabinGlow) js += `tl.fromTo("#${id}-cab", { scale: 0.4, opacity: 0.3 }, { scale: 1.6, opacity: 1, transformOrigin: "540px 820px", duration: ${dur}, ease: "power1.in" }, 0);`;
  return { id, dur, html: scene({ id, dur, bg: "#020305", vignette: 0.92, fadeOut,
    layers: [
      { name: "all", defs: road.defs + BEAMG(`${id}-bg`, 0.6) + glow(`${id}-cg`, 540, 820, 120, "#ffc060", 0.9), svg: `<g id="${id}-shk">
        ${road.svg}
        ${cabinGlow ? `<circle id="${id}-cab" cx="540" cy="820" r="120" fill="url(#${id}-cg)"/>` : ""}
        ${darkOver(0.35)}
        <g transform="translate(600,1610)"><g id="${id}-rb">${beamUp(`${id}-bg`, 820, 240)}</g></g>
        ${fullAt(r, "r", 540, 1570, 0.24)}
        <rect width="1080" height="1920" fill="#0a1430" opacity="0.45" style="mix-blend-mode:multiply"/>
        ${branches ? [...Array(7)].map((_, k) => { const y0 = 260 + (k * 230) % 1300; return `<g id="${id}-br${k}"><path d="M -260,${y0 + 40} C -60,${y0 + 10} 160,${y0 + 30} 420,${y0}" stroke="#030604" stroke-width="18" fill="none"/>
          ${[...Array(9)].map((_, j) => `<ellipse cx="${-220 + j * 75}" cy="${y0 + 30 - j * 3 + (j % 2 ? 26 : -26)}" rx="70" ry="24" fill="${j % 2 ? "#030806" : "#06100b"}" transform="rotate(${(j % 2 ? 30 : -30)} ${-220 + j * 75} ${y0 + 30 - j * 3})"/>`).join("")}</g>`; }).join("") : ""}
      </g>` },
    ],
    js }) };
}

// ── 5. he arrives and stops; light trembling over the ground; nothing ─────────────────────────────
function h5a() {
  const id = "h5a", dur = 3.6, r = `${id}-r`;
  return { id, dur, html: scene({ id, dur, bg: "#020305", vignette: 0.9,
    layers: [
      { name: "bg", blur: 8, svg: forestBack(id) + darkOver(0.3) },
      { name: "him", defs: BEAMDOWN(`${id}-bd`) + glow(`${id}-fl`, 700, 1300, 700, "#cfe0ff", 0.35), svg: `
        ${place(540, 900, 1.05, C.friend(r, RED, { kind: "wavy", mouth: "tense", propR: torchProp(`${id}-bd`), arms: [[8, -40], [-24, 50]] }), `${r}-all`)}
        <rect width="1080" height="1920" fill="url(#${id}-fl)" style="mix-blend-mode:screen"/>
        <rect width="1080" height="1920" fill="#0a1430" opacity="0.4" style="mix-blend-mode:multiply"/>` },
    ],
    js: `
    cam("bg", { scale: 1.05, x: 60 }, { scale: 1.08, x: 0 }, 0, 0.9, "power3.out");
    tl.fromTo("#${r}-all", { x: -900, y: 0 }, { x: 30, duration: 0.8, ease: "power3.out" }, 0);
    tl.to("#${r}-all", { x: 0, duration: 0.3, ease: "power2.inOut" }, 0.8);
    tl.fromTo("#${r}-all", { y: 0 }, { y: 22, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: 4 }, 0.9);
    eyesOpen("${r}", 1.25, 0, 0.01); brows("${r}", -14, -10, 0, 0.01); look("${r}", 6, 6, 0, 0.01);
    ${[...Array(10)].map((_, k) => armTo(r, 1, -24 + ((k * 17) % 9) - 4, 50 + (k % 2 ? 36 : -6) + ((k * 7) % 5), (1.0 + k * 0.25).toFixed(2), 0.25, "sine.inOut")).join("\n")}
    look("${r}", -8, 6, 1.2, 0.2); look("${r}", 8, 7, 1.8, 0.2); look("${r}", -6, 8, 2.4, 0.2); look("${r}", 4, 4, 3.0, 0.2);
    turn("${r}", -10, 1.2, 0.3); turn("${r}", 10, 1.8, 0.3); turn("${r}", -6, 2.4, 0.3); turn("${r}", 0, 3.0, 0.3);
    blink("${r}", 2.1, 0.14);
    ` }) };
}
function groundCU(id, dur, { bushes = false, fadeIn = false } = {}) {
  seed = bushes ? 61 : 53;
  const leaves = [...Array(90)].map(() => `<path d="M 0,0 c 12,-14 30,-14 36,0 c -8,14 -26,14 -36,0 Z" fill="${["#5a3a1a", "#6a4a22", "#4a2e14", "#7a5428"][Math.floor(rnd() * 4)]}" transform="translate(${(rnd() * 1100).toFixed(0)},${(rnd() * 1920).toFixed(0)}) rotate(${(rnd() * 360).toFixed(0)}) scale(${(1 + rnd() * 1.5).toFixed(2)})"/>`).join("");
  const roots = [...Array(5)].map((_, i) => `<path d="M ${-100 + i * 260},${400 + i * 300} C ${100 + i * 200},${380 + i * 300} ${200 + i * 160},${520 + i * 300} ${500 + i * 120},${480 + i * 300}" stroke="#3a2818" stroke-width="${30 - i * 3}" fill="none" stroke-linecap="round"/>`).join("");
  const bush = bushes ? [...Array(9)].map((_, i) => `<g transform="translate(${80 + (i % 3) * 400 + rnd() * 100},${300 + Math.floor(i / 3) * 600 + rnd() * 80})">${[...Array(7)].map((_, j) => `<circle cx="${Math.cos(j) * 90}" cy="${Math.sin(j * 1.7) * 60}" r="${80 + (j % 3) * 20}" fill="${j % 2 ? "#14301f" : "#1a3a26"}"/>`).join("")}</g>`).join("")
    + [...Array(3)].map((_, i) => `<rect x="${150 + i * 330}" y="0" width="${70 + i * 10}" height="1920" fill="#1e1610"/>`).join("") : "";
  const path = [[260, 1300], [700, 1100], [420, 700], [820, 520], [380, 300]];
  return { id, dur, html: scene({ id, dur, bg: "#000", vignette: 0.6, fadeIn,
    layers: [{ name: "all", defs: `<radialGradient id="${id}-hg"><stop offset="0" stop-color="#000"/><stop offset="0.55" stop-color="#000" stop-opacity="0.6"/><stop offset="1" stop-color="#fff"/></radialGradient>
        <mask id="${id}-mask"><rect width="1080" height="1920" fill="#fff"/><circle id="${id}-hole" cx="${path[0][0]}" cy="${path[0][1]}" r="420" fill="url(#${id}-hg)"/></mask>`, svg: `
      <rect width="1080" height="1920" fill="#5a4230"/>${roots}${leaves}${bush}
      <rect width="1080" height="1920" fill="#000" opacity="0.88" mask="url(#${id}-mask)"/>
      <rect width="1080" height="1920" fill="#0a1430" opacity="0.3" style="mix-blend-mode:multiply"/>` }],
    js: `cam("all", { scale: 1.05 }, { scale: 1.1 }, 0, ${dur});
    ${path.slice(1).map(([x, y], k) => `tl.to("#${id}-hole", { attr: { cx: ${x}, cy: ${y} }, duration: ${(dur / (path.length - 1)).toFixed(2)}, ease: "sine.inOut" }, ${(k * dur / (path.length - 1)).toFixed(2)});`).join(" ")}
    ${[...Array(Math.floor(dur / 0.1))].map((_, k) => `tl.to("#${id}-hole", { attr: { r: ${410 + (k % 3) * 14} }, duration: 0.1, ease: "none" }, ${(k * 0.1).toFixed(2)});`).join(" ")}` }) };
}

// red steps around, searching, in disbelief
function h5c() {
  const id = "h5c", dur = 3.4, r = `${id}-r`;
  return { id, dur, html: scene({ id, dur, bg: "#020305", vignette: 0.9,
    layers: [
      { name: "bg", blur: 8, svg: forestBack(id) + darkOver(0.3) },
      { name: "him", defs: BEAMDOWN(`${id}-bd`), svg: `
        ${place(540, 930, 0.95, C.friend(r, RED, { kind: "wavy", mouth: "tense", propR: torchProp(`${id}-bd`), arms: [[8, -40], [-24, 50]] }), `${r}-all`)}
        <rect width="1080" height="1920" fill="#0a1430" opacity="0.45" style="mix-blend-mode:multiply"/>` },
    ],
    js: `
    cam("bg", { x: 0 }, { x: -60 }, 0, ${dur});
    eyesOpen("${r}", 1.15, 0, 0.01); brows("${r}", -12, -12, 0, 0.01);
    tl.fromTo("#${r}-all", { x: 0 }, { x: -120, duration: 1.1, ease: "power1.inOut" }, 0.1);
    tl.to("#${r}-all", { x: 90, duration: 1.3, ease: "power1.inOut" }, 1.3);
    tl.to("#${r}-all", { x: 0, duration: 0.8, ease: "power1.inOut" }, 2.6);
    ${[...Array(7)].map((_, k) => `tl.to("#${r}-all", { y: ${k % 2 ? 0 : 14}, duration: 0.22, ease: "sine.inOut" }, ${(0.1 + k * 0.45).toFixed(2)});`).join(" ")}
    turn("${r}", -14, 0.1, 0.4); look("${r}", -9, 2, 0.1, 0.3); ${armTo(r, 1, -40, 90, 0.2, 0.6)}
    turn("${r}", 14, 1.3, 0.4); look("${r}", 9, 2, 1.3, 0.3); ${armTo(r, 1, -10, 10, 1.4, 0.6)}
    brows("${r}", -8, -14, 1.9, 0.3); look("${r}", 0, 7, 2.6, 0.3); turn("${r}", 0, 2.6, 0.4); ${armTo(r, 1, -24, 50, 2.6, 0.5)}
    blink("${r}", 3.0, 0.14);
    ` }) };
}

// ── 6. close-up: calling out with a hand at his mouth, then a slow half-orbit ────────────────────
function h6() {
  const id = "h6", dur = 6.5, r = `${id}-r`;
  seed = 71;
  const wide = [...Array(26)].map((_, i) => `<g transform="translate(${-900 + i * 115 + rnd() * 40},${1500 + rnd() * 250}) scale(${0.8 + rnd() * 0.8})">${pine(i % 2 ? "#07110e" : "#0a1612", "#10221c")}</g>`).join("");
  return { id, dur, html: scene({ id, dur, bg: "#020305", vignette: 0.92,
    layers: [
      { name: "far", blur: 10, svg: `<rect x="-1000" width="3080" height="1920" fill="#03060b"/>${wide}` },
      { name: "near", blur: 4, svg: [...Array(4)].map((_, i) => `<rect x="${-600 + i * 700}" y="0" width="${110 + i * 20}" height="1920" fill="#050a08"/>`).join("") },
      { name: "face", defs: glow(`${id}-fl`, 540, 1700, 1000, "#cfe0ff", 0.4), svg: `
        ${place(540, 860, 2.1, C.friend(r, RED, { kind: "wavy", mouth: "tense" }), `${r}-all`)}
        <rect width="1080" height="1920" fill="url(#${id}-fl)" style="mix-blend-mode:screen"/>
        <rect width="1080" height="1920" fill="#0a1430" opacity="0.45" style="mix-blend-mode:multiply"/>` },
    ],
    js: `
    eyesOpen("${r}", 1.18, 0, 0.01); brows("${r}", -12, -12, 0, 0.01);
    ${[[-8, 0], [7, -2], [-6, 2], [8, 0]].map(([x, y], k) => `look("${r}", ${x}, ${y}, ${(0.2 + k * 0.28).toFixed(2)}, 0.12);`).join(" ")}
    ${armTo(r, -1, -25, 205, 1.3, 0.45, "power2.out")}
    tl.to("#${r}-head", { y: 10, rotation: -2, transformOrigin: "50% 90%", duration: 0.3, ease: "power2.out" }, 1.5);
    look("${r}", -9, -2, 1.5, 0.2);
    tl.to("#${r}-head", { y: 0, rotation: 0, transformOrigin: "50% 90%", duration: 0.3 }, 2.4);
    ${armTo(r, -1, 10, -55, 2.5, 0.4)}
    // half-orbit: the forest slides past behind him while his face turns to look over his shoulder
    cam("far", { x: 500 }, { x: -500 }, 2.6, 3.8, "sine.inOut");
    cam("near", { x: 900 }, { x: -900 }, 2.6, 3.8, "sine.inOut");
    turn("${r}", -14, 2.6, 0.9); look("${r}", -10, 0, 2.6, 0.6);
    turn("${r}", 18, 4.0, 1.2); look("${r}", 10, -1, 4.1, 0.6);
    brows("${r}", -6, -15, 4.3, 0.5); blink("${r}", 5.2, 0.16);
    ` }) };
}

// ── 7. aerial: tiny in a vast dark forest, the camera rises ──────────────────────────────────────
function h7() {
  const id = "h7", dur = 6.0;
  seed = 83;
  const canopy = [...Array(420)].map(() => {
    const x = rnd() * 1300 - 110, y = rnd() * 2120 - 100;
    if (Math.abs(x - 540 - Math.sin(y / 300) * 30) < 70) return "";
    const rr = 34 + rnd() * 40;
    return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rr.toFixed(0)}" fill="${["#061410", "#08180f", "#0a1d15", "#051009"][Math.floor(rnd() * 4)]}"/><circle cx="${(x - rr * 0.25).toFixed(0)}" cy="${(y - rr * 0.25).toFixed(0)}" r="${(rr * 0.5).toFixed(0)}" fill="#10261c" opacity="0.5"/>`;
  }).join("");
  return { id, dur, html: scene({ id, dur, bg: "#000", vignette: 0.95,
    layers: [{ name: "air", defs: `<radialGradient id="${id}-cone" cx="0.5" cy="1" r="1"><stop offset="0" stop-color="#eef4ff" stop-opacity="0.8"/><stop offset="1" stop-color="#eef4ff" stop-opacity="0"/></radialGradient>`, svg: `
      <rect width="1080" height="1920" fill="#030907"/>
      <path d="M 540,-100 ${[...Array(12)].map((_, i) => `L ${(540 + Math.sin((i * 180) / 300) * 30).toFixed(0)},${i * 180}`).join(" ")} L 540,2100" stroke="#1a1612" stroke-width="34" fill="none"/>
      <g transform="translate(540,980)"><path d="M -6,-10 L 6,-10 L 40,-150 L -40,-150 Z" fill="url(#${id}-cone)" style="mix-blend-mode:screen"/>
        <ellipse cx="0" cy="6" rx="14" ry="9" fill="${RED.shirt}"/><circle cx="0" cy="2" r="7" fill="${RED.hair}"/></g>
      ${canopy}
      <rect width="1080" height="1920" fill="#0a1640" opacity="0.5" style="mix-blend-mode:multiply"/>` }],
    js: `cam("air", { scale: 4.0, rotation: -6 }, { scale: 1.0, rotation: 4, origin: "50% 51%" }, 0, ${dur}, "power1.inOut");` }) };
}

// ── 8. his trembling hand on the flashlight, then up to his sweating face ────────────────────────
function h8() {
  const id = "h8", dur = 5.0, r = `${id}-r`;
  return { id, dur, html: scene({ id, dur, bg: "#020305", vignette: 0.9,
    layers: [
      { name: "bg", blur: 14, svg: forestBack(id) + darkOver(0.4) },
      { name: "him", defs: `<linearGradient id="${id}-bh" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0" stop-color="#eef4ff" stop-opacity="0.6"/><stop offset="1" stop-color="#eef4ff" stop-opacity="0"/></linearGradient>` + glow(`${id}-up`, 540, 1600, 900, "#cfe0ff", 0.45), svg: `
        ${place(540, 560, 1.7, C.friend(r, RED, { kind: "wavy", mouth: "tense" }) + sweat(r), `${r}-all`)}
        <g transform="translate(560,1560)"><g id="${id}-hand">
          <rect x="-260" y="-44" width="420" height="88" rx="22" fill="#2a2d34"/><rect x="150" y="-62" width="90" height="124" rx="18" fill="#3a3e48"/>
          <path d="M 240,-56 L 1000,-380 L 1000,380 L 240,56 Z" fill="url(#${id}-bh)" style="mix-blend-mode:screen"/>
          <path d="M -150,-80 C -60,-110 60,-104 110,-70 L 120,70 C 40,100 -80,100 -150,70 Z" fill="${RED.skin}"/>
          ${[-110, -60, -10, 40].map((x) => `<path d="M ${x},-70 C ${x + 4},-30 ${x + 4},30 ${x},70" stroke="${RED.deep}" stroke-width="5" fill="none" opacity="0.5"/>`).join("")}
          <path d="M 80,-70 C 120,-110 170,-100 170,-70 C 160,-50 130,-46 100,-40 Z" fill="${RED.skinSh}"/>
          <rect x="-420" y="-90" width="280" height="180" fill="${RED.shirt}"/></g></g>
        <rect width="1080" height="1920" fill="url(#${id}-up)" style="mix-blend-mode:screen"/>
        <rect width="1080" height="1920" fill="#0a1430" opacity="0.4" style="mix-blend-mode:multiply"/>` },
    ],
    js: `
    cam("him", { scale: 1.6, y: -520, origin: "50% 50%" }, { scale: 1.6, y: -520 }, 0, 1.6);
    cam("him", { scale: 1.6, y: -520 }, { scale: 1.15, y: 260 }, 1.6, 2.6, "power2.inOut");
    cam("bg", { scale: 1.05, y: -100 }, { scale: 1.05, y: 80 }, 0, ${dur});
    (function () { const el = document.getElementById("${id}-hand"); const o = { t: 0 };
      tl.fromTo(o, { t: 0 }, { t: ${dur}, duration: ${dur}, ease: "none", onUpdate() { const t = o.t;
        const a = 2.2 * Math.sin(t * 41) + 1.2 * Math.sin(t * 67 + 1), y = 4 * Math.sin(t * 53 + 2);
        el.setAttribute("transform", "translate(0," + y.toFixed(1) + ") rotate(" + a.toFixed(2) + ")"); } }, 0); })();
    eyesOpen("${r}", 1.15, 0, 0.01); brows("${r}", -10, -13, 0, 0.01);
    ${[[-8, 1], [6, -1], [-4, 3], [9, 0], [-7, -2], [3, 2]].map(([x, y], k) => `look("${r}", ${x}, ${y}, ${(1.8 + k * 0.45).toFixed(2)}, 0.1);`).join(" ")}
    tl.fromTo("#${r}-drop", { y: 0 }, { y: 60, duration: 2.6, ease: "power1.in" }, 2.0);
    blink("${r}", 3.6, 0.14);
    ` }) };
}

// ── 9. search montage ─────────────────────────────────────────────────────────────────────────────
function h9b() {
  const id = "h9b", dur = 2.2, r = `${id}-r`;
  return { id, dur, html: scene({ id, dur, bg: "#020305", vignette: 0.92,
    layers: [
      { name: "bg", blur: 3, defs: BEAMG(`${id}-bg`, 0.55), svg: `${forestBack(id, 18)}
        <g transform="translate(700,1500)"><g id="${id}-beam">${beamUp(`${id}-bg`, 1000, 300)}</g></g>${darkOver(0.25)}` },
      { name: "him", svg: `${place(540, 1250, 1.6, C.friendBack(r, "r"), `${r}-all`)}
        <rect width="1080" height="1920" fill="#0a1430" opacity="0.5" style="mix-blend-mode:multiply"/>` },
    ],
    js: `
    cam("bg", { scale: 1.0, x: 0 }, { scale: 1.05, x: -40 }, 0, ${dur});
    tl.fromTo("#${id}-beam", { rotation: -40 }, { rotation: 35, svgOrigin: "0 0", duration: 1.6, ease: "sine.inOut" }, 0.1);
    ${headTurn(r, -18, -6, 0.1, 0.6)} ${headTurn(r, 20, 7, 0.9, 0.8)}
    tl.fromTo("#${r}-all", { y: 0 }, { y: 10, duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: 3 }, 0);
    ` }) };
}
function h9c() {
  const id = "h9c", dur = 1.6;
  seed = 97;
  const leaves = [...Array(70)].map((_, i) => `<path id="${id}-l${i}" d="M 0,0 c 14,-16 34,-16 40,0 c -8,16 -30,16 -40,0 Z" fill="${["#7a5428", "#6a4422", "#8a5e2a", "#5a3a1a"][i % 4]}" transform="translate(${(rnd() * 1100).toFixed(0)},${(1250 + rnd() * 600).toFixed(0)}) rotate(${(rnd() * 360).toFixed(0)}) scale(${(1.2 + rnd()).toFixed(2)})"/>`).join("");
  const shoe = (gid, x) => `<g transform="translate(${x},1300)"><g id="${gid}"><path d="M -120,-40 L 60,-40 C 120,-36 180,-10 190,30 L 190,60 L -130,60 Z" fill="#eceef2"/><rect x="-134" y="50" width="330" height="22" rx="8" fill="#9aa0ac"/>
      <path d="M -120,-40 L -110,-260 L 40,-260 L 60,-40 Z" fill="#2c3650"/><path d="M -40,-30 L 80,-20" stroke="#c6cbd4" stroke-width="6"/></g></g>`;
  return { id, dur, html: scene({ id, dur, bg: "#000", vignette: 0.85,
    layers: [{ name: "all", defs: glow(`${id}-pool`, 540, 1350, 600, "#dfe8ff", 0.5), svg: `
      <rect width="1080" height="1920" fill="#0b0805"/><rect y="1240" width="1080" height="680" fill="#2a1c10"/>
      ${leaves}${shoe(`${id}-f1`, 330)}${shoe(`${id}-f2`, 760)}
      <rect width="1080" height="1920" fill="url(#${id}-pool)" style="mix-blend-mode:screen"/>
      <rect width="1080" height="1920" fill="#0a1430" opacity="0.4" style="mix-blend-mode:multiply"/>` }],
    js: `
    cam("all", { scale: 1.05, x: 30 }, { scale: 1.1, x: -30 }, 0, ${dur});
    tl.fromTo("#${id}-f2", { x: 0, y: 0, rotation: 0 }, { x: -120, y: -90, rotation: -8, svgOrigin: "0 60", duration: 0.35, ease: "power2.out" }, 0.1);
    tl.to("#${id}-f2", { x: -260, y: 0, rotation: 0, svgOrigin: "0 60", duration: 0.3, ease: "power2.in" }, 0.45);
    ${[0, 1, 2, 3, 4].map((i) => `tl.fromTo("#${id}-l${i * 3}", { x: 0, y: 0 }, { x: ${(i - 2) * 30}, y: -${20 + i * 8}, duration: 0.3, ease: "power2.out" }, 0.75);`).join(" ")}
    tl.fromTo("#${id}-f1", { x: 0, y: 0 }, { x: -150, y: -80, duration: 0.3, ease: "power2.out" }, 0.95);
    tl.to("#${id}-f1", { x: -290, y: 0, duration: 0.3, ease: "power2.in" }, 1.25);
    ` }) };
}
function h9d() {
  const id = "h9d", dur = 2.8, r = `${id}-r`;
  return { id, dur, html: scene({ id, dur, bg: "#020305", vignette: 0.96,
    layers: [
      { name: "bg", blur: 16, svg: forestBack(id) + darkOver(0.55) },
      { name: "face", defs: glow(`${id}-fl`, 300, 1500, 900, "#cfe0ff", 0.35), svg: `
        ${place(540, 880, 2.3, C.friend(r, RED, { kind: "wavy", mouth: "tense" }) + sweat(r), `${r}-all`)}
        <rect width="1080" height="1920" fill="url(#${id}-fl)" style="mix-blend-mode:screen"/>
        <rect width="1080" height="1920" fill="#0a1430" opacity="0.5" style="mix-blend-mode:multiply"/>` },
    ],
    js: `
    cam("face", { scale: 1.0 }, { scale: 1.1, origin: "50% 42%" }, 0, ${dur}, "power1.in");
    look("${r}", -6, 3, 0, 0.01); brows("${r}", -6, -10, 0, 0.01); eyesOpen("${r}", 1.0, 0, 0.01);
    look("${r}", 6, 3, 0.5, 0.25); look("${r}", 0, 1, 1.1, 0.3);
    eyesOpen("${r}", 1.32, 1.2, 0.6); brows("${r}", -18, -14, 1.2, 0.6);
    ${[...Array(8)].map((_, k) => `brows("${r}", ${-18 + (k % 2 ? 2 : -1)}, ${-14 + (k % 2 ? 2 : 0)}, ${(1.9 + k * 0.1).toFixed(2)}, 0.08);`).join(" ")}
    tl.fromTo("#${r}-drop", { y: 0 }, { y: 50, duration: 2.0, ease: "power1.in" }, 0.6);
    ` }) };
}

export default [
  h1(), h2(), h3(),
  chase("h4", 5.0, { speed: 4.5, shakeAmp: 16 }),
  h5a(), groundCU("h5b", 2.2), h5c(),
  h6(), h7(), h8(),
  groundCU("h9a", 1.8, { bushes: true }), h9b(), h9c(), h9d(),
  chase("h10", 7.0, { speed: 6.5, shakeAmp: 22, branches: true, cabinGlow: true, fadeOut: true }),
];
