// Shared scene wrapper, runtime helpers and set pieces.
import * as C from "./chars.mjs";
export { C };

export const W = 1080, H = 1920;

// Animation helpers emitted into every scene script. All motion is a function of timeline time.
const RUNTIME = `
const tl = gsap.timeline({ paused: true });
const ids = (p, names) => names.map((n) => "#" + p + "-" + n);
function blink(p, t, d = 0.18) {
  const e = ids(p, ["eyeL", "eyeR"]);
  tl.to(e, { scaleY: 0.08, duration: d * 0.4, ease: "power2.in", transformOrigin: "50% 50%" }, t);
  tl.to(e, { scaleY: 1, duration: d * 0.6, ease: "power2.out", transformOrigin: "50% 50%" }, t + d * 0.4);
}
function look(p, x, y, t, d = 0.35, ease = "power2.inOut") {
  tl.to(ids(p, ["eyeL-iris", "eyeR-iris"]), { x, y, duration: d, ease }, t);
}
function mouth(p, name, t, d = 0.25) {
  tl.to(ids(p, ["mouthN", "mouthW", "mouthS", "mouthO"]), { opacity: 0, duration: d }, t);
  tl.to("#" + p + "-mouth" + name, { opacity: 1, duration: d }, t);
}
// brows: y shift (negative = raised), rot (positive = inner ends down = frown)
function brows(p, y, rot, t, d = 0.4, ease = "power2.inOut") {
  tl.to("#" + p + "-browL", { y, rotation: rot, transformOrigin: "50% 50%", duration: d, ease }, t);
  tl.to("#" + p + "-browR", { y, rotation: -rot, transformOrigin: "50% 50%", duration: d, ease }, t + 0.03);
}
function eyesOpen(p, s, t, d = 0.35) {
  tl.to(ids(p, ["eyeL", "eyeR"]), { scaleY: s, scaleX: 1 + (s - 1) * 0.4, transformOrigin: "50% 50%", duration: d, ease: "power2.out" }, t);
}
// turn: shift the features sideways (a 3/4 turn in a flat style), the fringe follows a little
function turn(p, dx, t, d = 0.5, ease = "power2.inOut") {
  tl.to("#" + p + "-face", { x: dx, duration: d, ease }, t);
  tl.to("#" + p + "-hairF", { x: dx * 0.35, duration: d, ease }, t + 0.04);
}
// camera move on one layer (an HTML <svg>): scale/x/y around the frame centre unless an origin is given
function cam(layer, from, to, t, d, ease = "sine.inOut") {
  const o = { transformOrigin: to.origin || "50% 50%" }; delete to.origin; delete from.origin;
  tl.fromTo("#" + S + "-" + layer, Object.assign({}, o, from), Object.assign({}, o, { duration: d, ease }, to), t);
}
function fadeIn(s, t = 0, d = 0.35) { tl.fromTo("#" + s + "-fade", { opacity: 1 }, { opacity: 0, duration: d, ease: "power1.out" }, t); }
function fadeOut(s, t, d = 0.35) { tl.fromTo("#" + s + "-fade", { opacity: 0 }, { opacity: 1, duration: d, ease: "power1.in" }, t); }
// deterministic flicker for candle and lamp light: a sum of sines of timeline time
function flicker(sel, dur, base, amp) {
  const o = { t: 0 };
  tl.to(o, { t: dur, duration: dur, ease: "none", onUpdate() {
    const v = base + amp * (Math.sin(o.t * 9.1) * 0.5 + Math.sin(o.t * 23.7 + 1.3) * 0.3 + Math.sin(o.t * 4.3) * 0.2);
    gsap.set(sel, { opacity: v });
  } }, 0);
}
`;

// One scene file. layers: [{ name, svg, blur, defs }] drawn bottom to top, each its own <svg> so the camera
// moves it as a whole (a blurred background is rasterised once). js: the timeline body.
export function scene({ id, dur, layers, js, bg = "#0c0d14", fadeIn = false, fadeOut = false, vignette = 0.72, extraStyle = "" }) {
  const L = layers.map((l) => `
    <svg id="${id}-${l.name}" class="${id}-L" viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg"${l.blur ? ` style="filter: blur(${l.blur}px)"` : ""} data-layout-allow-overflow>
      ${l.defs ? `<defs>${l.defs}</defs>` : ""}
      ${l.svg}
    </svg>`).join("");
  return `<template>
  <style>
    #root { position: absolute; inset: 0; overflow: hidden; background: ${bg}; }
    .${id}-L { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; overflow: visible; will-change: transform; }
    #${id}-top { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; pointer-events: none; }
    #${id}-tex { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; opacity: 0.16; mix-blend-mode: soft-light; pointer-events: none; }
    ${extraStyle}
  </style>
  <div id="root" data-composition-id="${id}" data-width="1080" data-height="1920">
    ${L}
    <img id="${id}-tex" src="assets/img/texture.png" alt="" data-layout-ignore />
    <svg id="${id}-top" viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
      <defs><radialGradient id="${id}-vig" cx="50%" cy="48%" r="75%">
        <stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="${vignette}"/>
      </radialGradient></defs>
      <rect width="1080" height="1920" fill="url(#${id}-vig)"/>
      <rect id="${id}-fade" width="1080" height="1920" fill="#000" opacity="0"/>
    </svg>
  </div>
  <script>
    (function () {
    ${RUNTIME}
    const S = "${id}";
    ${fadeIn ? `fadeIn(S);` : ""}
    ${js}
    ${fadeOut ? `fadeOut(S, ${dur} - 0.4, 0.38);` : ""}
    tl.to({}, { duration: ${dur} }, 0);
    window.__timelines["${id}"] = tl;
    })();
  </script>
</template>
`;
}

// Place a drawing: an untransformed-by-GSAP outer group positions it, the inner group (id) is free to animate.
export const place = (x, y, s, inner, id = "", extra = "") =>
  `<g transform="translate(${x},${y}) scale(${s})"><g${id ? ` id="${id}"` : ""} ${extra}>${inner}</g></g>`;

export function glow(id, cx, cy, r, color, op = 1) {
  return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="${color}" stop-opacity="${op}"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></radialGradient>`;
}

// ── fortune-teller's room ─────────────────────────────────────────────────────────────────────────
export const ROOM = { wall: "#2c1d24", wallDk: "#21151b", panel: "#3a2630", wood: "#5a3826", woodDk: "#432818", woodHi: "#6e4630", gold: "#b98b45", goldDk: "#8a6430" };

// Painting 1: a palmistry chart (a hand with its lines and signs) on parchment. Centre (0,0), 260x330.
export function paintingPalm() {
  return `<g>
    <rect x="-140" y="-175" width="280" height="350" rx="6" fill="${ROOM.goldDk}"/>
    <rect x="-128" y="-163" width="256" height="326" rx="3" fill="${ROOM.gold}"/>
    <rect x="-114" y="-149" width="228" height="298" fill="#d9c49a"/>
    <rect x="-114" y="-149" width="228" height="298" fill="#8a6a3a" opacity="0.18"/>
    <path d="M -46,120 C -60,60 -64,10 -58,-20 L -64,-96 C -65,-110 -48,-112 -46,-98 L -40,-40 L -38,-118 C -38,-132 -20,-132 -20,-118 L -18,-44 L -10,-124 C -9,-138 8,-137 8,-122 L 4,-44 L 16,-104 C 19,-117 34,-114 31,-100 L 22,-20 C 30,-8 48,-14 58,-34 C 66,-48 80,-40 74,-26 C 62,6 44,30 30,60 L 26,120 Z"
      fill="none" stroke="#5a3a1e" stroke-width="5" stroke-linejoin="round"/>
    <path d="M -42,40 C -20,24 6,22 22,30" fill="none" stroke="#8c2a22" stroke-width="3.5"/>
    <path d="M -50,10 C -24,-2 2,-6 24,-2" fill="none" stroke="#8c2a22" stroke-width="3.5"/>
    <path d="M 20,70 C -4,52 -18,24 -16,-14" fill="none" stroke="#8c2a22" stroke-width="3.5"/>
    <circle cx="-38" cy="-68" r="7" fill="none" stroke="#5a3a1e" stroke-width="2.5"/><circle cx="-12" cy="-82" r="7" fill="none" stroke="#5a3a1e" stroke-width="2.5"/>
    <circle cx="14" cy="-72" r="7" fill="none" stroke="#5a3a1e" stroke-width="2.5"/><path d="M -6,74 l 6,-10 l 6,10 z" fill="none" stroke="#5a3a1e" stroke-width="2.5"/>
    <path d="M -90,-120 L -70,-120 M -80,-130 L -80,-110" stroke="#5a3a1e" stroke-width="2.5"/>
    <path d="M 70,-125 a 14,14 0 1,0 14,18 a 10,10 0 1,1 -14,-18 z" fill="#5a3a1e"/>
    <path d="M -94,128 L 94,128" stroke="#5a3a1e" stroke-width="2"/>
  </g>`;
}

// Painting 2: an eye in a triangle with a crescent moon and stars, deep blue. Centre (0,0), 260x330.
export function paintingEye() {
  const stars = [[-80, -110], [70, -120], [-60, 100], [84, 90], [0, -140], [-96, 10], [96, -20]]
    .map(([x, y], i) => `<path d="M ${x},${y - 8} L ${x + 2.5},${y - 2.5} L ${x + 8},${y} L ${x + 2.5},${y + 2.5} L ${x},${y + 8} L ${x - 2.5},${y + 2.5} L ${x - 8},${y} L ${x - 2.5},${y - 2.5} Z" fill="#e6c56e" opacity="${0.6 + (i % 3) * 0.15}"/>`).join("");
  return `<g>
    <rect x="-140" y="-175" width="280" height="350" rx="6" fill="${ROOM.goldDk}"/>
    <rect x="-128" y="-163" width="256" height="326" rx="3" fill="${ROOM.gold}"/>
    <rect x="-114" y="-149" width="228" height="298" fill="#1c2346"/>
    <circle r="96" fill="#2b3566" opacity="0.7"/>
    <path d="M 0,-92 L 84,58 L -84,58 Z" fill="none" stroke="#e6c56e" stroke-width="5" stroke-linejoin="round"/>
    <path d="M -46,14 C -20,-14 20,-14 46,14 C 20,40 -20,40 -46,14 Z" fill="#efe3c4"/>
    <circle cy="14" r="15" fill="#2a4a7a"/><circle cy="14" r="7" fill="#0d1022"/><circle cx="-5" cy="9" r="3" fill="#fff"/>
    <path d="M -46,14 C -20,-14 20,-14 46,14" fill="none" stroke="#e6c56e" stroke-width="3.5"/>
    ${[...Array(9)].map((_, i) => { const a = (-150 + i * 15) * Math.PI / 180; return `<path d="M ${Math.cos(a) * 62},${14 + Math.sin(a) * 62} L ${Math.cos(a) * 80},${14 + Math.sin(a) * 80}" stroke="#e6c56e" stroke-width="3" stroke-linecap="round"/>`; }).join("")}
    <path d="M 30,-130 a 26,26 0 1,0 30,34 a 20,20 0 1,1 -30,-34 z" fill="#e6c56e"/>
    ${stars}
  </g>`;
}

// The wall behind the old man: dark panelled wall, both paintings, a shelf with candles. Full frame.
export function wallBehindMan(s) {
  return `
    <rect width="1080" height="1920" fill="${ROOM.wall}"/>
    ${[...Array(7)].map((_, i) => `<rect x="${i * 160 - 20}" y="0" width="150" height="1920" fill="${ROOM.wallDk}" opacity="0.35"/>`).join("")}
    <rect x="0" y="1180" width="1080" height="740" fill="${ROOM.panel}"/>
    <rect x="0" y="1170" width="1080" height="22" fill="${ROOM.woodHi}"/>
    <g transform="translate(250,520)">${paintingPalm()}</g>
    <g transform="translate(830,500)">${paintingEye()}</g>
    <rect x="390" y="880" width="300" height="18" rx="4" fill="${ROOM.wood}"/>
    <g transform="translate(450,880)">${candle(`${s}-c1`, 0.8)}</g>
    <g transform="translate(630,880)">${candle(`${s}-c2`, 1)}</g>
    <circle cx="540" cy="846" r="34" fill="#8fb3d9" opacity="0.35"/><circle cx="540" cy="846" r="34" fill="none" stroke="#c9dcef" stroke-width="2" opacity="0.5"/>
    <ellipse cx="530" cy="834" rx="10" ry="6" fill="#fff" opacity="0.4"/>
    <rect x="516" y="874" width="48" height="8" rx="3" fill="${ROOM.goldDk}"/>`;
}

// The wall behind the young woman: the door, a coat hook and a lamp. Full frame.
export function wallBehindWoman(s, { doorOpen = false } = {}) {
  return `
    <rect width="1080" height="1920" fill="${ROOM.wall}"/>
    ${[...Array(7)].map((_, i) => `<rect x="${i * 160 - 20}" y="0" width="150" height="1920" fill="${ROOM.wallDk}" opacity="0.35"/>`).join("")}
    <rect x="0" y="1180" width="1080" height="740" fill="${ROOM.panel}"/>
    <rect x="0" y="1170" width="1080" height="22" fill="${ROOM.woodHi}"/>
    <rect x="610" y="330" width="330" height="860" fill="${ROOM.woodDk}"/>
    <rect x="626" y="346" width="298" height="844" fill="#f3d9a4"/>
    <rect x="626" y="346" width="298" height="844" fill="url(#${s}-hall)"/>
    <g id="${s}-door"><rect x="626" y="346" width="298" height="844" fill="${ROOM.wood}"/>
      <rect x="656" y="380" width="238" height="330" rx="6" fill="none" stroke="${ROOM.woodDk}" stroke-width="10"/>
      <rect x="656" y="760" width="238" height="380" rx="6" fill="none" stroke="${ROOM.woodDk}" stroke-width="10"/>
      <circle cx="660" cy="760" r="14" fill="${ROOM.gold}"/><circle cx="656" cy="756" r="5" fill="#f2d48a"/></g>
    <rect x="140" y="560" width="120" height="14" rx="6" fill="${ROOM.wood}"/>
    <circle cx="170" cy="580" r="9" fill="${ROOM.gold}"/><circle cx="230" cy="580" r="9" fill="${ROOM.gold}"/>
    <path d="M 160,586 C 140,700 150,860 170,940 L 250,940 C 262,860 250,700 232,586 Z" fill="#3b2a3a"/>`;
}

export function candle(id, h = 1) {
  const hh = 70 * h;
  return `<g>
    <ellipse cx="0" cy="-${hh + 30}" rx="70" ry="80" fill="#ffb347" opacity="0.18" id="${id}-halo"/>
    <rect x="-14" y="-${hh}" width="28" height="${hh}" rx="4" fill="#efe2c4"/>
    <rect x="-14" y="-${hh}" width="10" height="${hh}" fill="#fff" opacity="0.3"/>
    <path d="M -14,-${hh} C -8,-${hh - 10} 0,-${hh - 4} 6,-${hh - 14} L 14,-${hh} Z" fill="#e0d0ae"/>
    <path d="M 0,-${hh + 36} C 9,-${hh + 20} 9,-${hh + 6} 0,-${hh + 2} C -9,-${hh + 6} -9,-${hh + 20} 0,-${hh + 36} Z" fill="#ffcf6a" id="${id}-flame"/>
    <path d="M 0,-${hh + 22} C 4,-${hh + 14} 4,-${hh + 8} 0,-${hh + 5} C -4,-${hh + 8} -4,-${hh + 14} 0,-${hh + 22} Z" fill="#fff3c8"/>
  </g>`;
}

// Wooden table seen from the camera side: a top surface plus front edge.
export function tableTop(y, { color = ROOM.wood } = {}) {
  return `<path d="M -40,${y} L 1120,${y} L 1120,1920 L -40,1920 Z" fill="${color}"/>
    <path d="M -40,${y} L 1120,${y}" stroke="${ROOM.woodHi}" stroke-width="10"/>
    ${[...Array(6)].map((_, i) => `<path d="M -40,${y + 60 + i * 90} C 300,${y + 50 + i * 90} 700,${y + 80 + i * 90} 1120,${y + 64 + i * 90}" stroke="${ROOM.woodDk}" stroke-width="3" fill="none" opacity="0.5"/>`).join("")}`;
}
