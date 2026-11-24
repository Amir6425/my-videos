// Shared scene wrapper, runtime helpers and set pieces.

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

