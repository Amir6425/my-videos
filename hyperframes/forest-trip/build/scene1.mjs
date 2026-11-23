// One continuous medium shot: three friends at night; the one in red proposes a forest trip with his hands and
// body, the others smile and nod. The camera eases in. Nobody speaks: the mouths are never animated.
import { scene, place, glow } from "./lib.mjs";
import * as C from "./chars.mjs";

const D = 9.0;
const POS = { w: [212, 990, 0.8], r: [540, 955, 0.9], b: [868, 995, 0.8] };

function room(id) {
  const lights = [...Array(15)].map((_, i) => {
    const x = 40 + i * 72, y = 300 + Math.sin(i * 0.9) * 26 + (i % 2) * 10;
    return `<circle cx="${x}" cy="${y}" r="9" fill="#ffd27a"/><circle id="${id}-sl${i}" cx="${x}" cy="${y}" r="26" fill="#ffc25a" opacity="0.3"/>`;
  }).join("");
  const pines = [...Array(7)].map((_, i) => { const x = 660 + i * 50, h = 120 + (i % 3) * 40; return `<path d="M ${x},${800} L ${x + 26},${800 - h} L ${x + 52},${800} Z" fill="#0d1a1c"/>`; }).join("");
  return `
    <defs><linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e1530"/><stop offset="1" stop-color="#22305a"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="#4a3226"/>
    ${[...Array(12)].map((_, i) => `<rect x="${i * 96}" y="0" width="48" height="1920" fill="#41291f" opacity="0.5"/>`).join("")}
    <rect x="630" y="380" width="380" height="440" rx="10" fill="#2a1a12"/>
    <rect x="648" y="398" width="344" height="404" fill="url(#${id}-sky)"/>
    <circle cx="920" cy="470" r="34" fill="#f0ead2"/>${pines}
    <path d="M 820,398 L 820,802 M 648,600 L 992,600" stroke="#2a1a12" stroke-width="12"/>
    <path d="M 600,360 L 660,360 C 650,560 670,760 640,880 L 590,880 Z" fill="#8a3a2a"/><path d="M 1030,360 L 1080,360 L 1080,880 L 1040,880 C 1060,760 1030,560 1030,360 Z" fill="#8a3a2a"/>
    <rect x="90" y="450" width="170" height="130" fill="#2a1a12"/><rect x="102" y="462" width="146" height="106" fill="#6a8a7a"/><path d="M 102,568 L 160,500 L 200,540 L 248,490 L 248,568 Z" fill="#3a5a4a"/>
    <rect x="300" y="420" width="120" height="160" fill="#2a1a12"/><rect x="312" y="432" width="96" height="136" fill="#c99a6a"/><circle cx="360" cy="480" r="22" fill="#8a5a3a"/>
    <path d="M 0,280 C 300,340 700,250 1080,320" stroke="#2a1a12" stroke-width="3" fill="none"/>${lights}
    <rect x="-40" y="1500" width="1160" height="460" fill="#3a2418"/>
    <path d="M 60,1080 C 60,960 120,930 200,930 L 880,930 C 960,930 1020,960 1020,1080 L 1040,1560 L 40,1560 Z" fill="#2f5d5a"/>
    <path d="M 60,1080 C 60,960 120,930 200,930 L 880,930 C 960,930 1020,960 1020,1080" stroke="#3d7470" stroke-width="16" fill="none"/>
    <path d="M -10,1300 C -10,1200 30,1180 90,1180 L 90,1600 L -10,1600 Z M 1090,1300 C 1090,1200 1050,1180 990,1180 L 990,1600 L 1090,1600 Z" fill="#285150"/>
    <rect x="120" y="980" width="170" height="150" rx="30" fill="#c9893a" transform="rotate(-10 205 1055)"/>
    <rect x="800" y="990" width="170" height="150" rx="30" fill="#a8452e" transform="rotate(9 885 1065)"/>
    <g transform="translate(30,1100)"><rect x="-8" y="-560" width="16" height="560" fill="#2a1a12"/><path d="M -70,-640 L 70,-640 L 50,-540 L -50,-540 Z" fill="#e8c88a"/></g>`;
}
function tableFront(id) {
  const glass = (x, y) => `<g transform="translate(${x},${y})"><path d="M -26,-70 L 26,-70 C 20,-50 24,-20 18,0 L -18,0 C -24,-20 -20,-50 -26,-70 Z" fill="#f2e8dc" opacity="0.55"/>
    <path d="M -22,-50 L 22,-50 C 18,-34 21,-16 16,-2 L -16,-2 C -21,-16 -18,-34 -22,-50 Z" fill="#a8401c"/><ellipse cx="0" cy="4" rx="40" ry="10" fill="#d9cdb8"/><path d="M -16,-64 L -10,-8" stroke="#fff" stroke-width="4" opacity="0.5"/></g>`;
  return `<path d="M -60,1640 L 1140,1640 L 1140,1960 L -60,1960 Z" fill="#6a3e24"/><path d="M -60,1640 L 1140,1640" stroke="#8a5434" stroke-width="16"/>
    ${glass(200, 1700)}${glass(470, 1712)}${glass(880, 1702)}
    <g transform="translate(680,1700)"><ellipse cx="0" cy="0" rx="110" ry="36" fill="#d9b88a"/><ellipse cx="0" cy="-10" rx="96" ry="26" fill="#8a5a2a"/>
      ${[...Array(12)].map((_, i) => `<ellipse cx="${-70 + (i % 6) * 28}" cy="${-14 - Math.floor(i / 6) * 12}" rx="12" ry="8" fill="${i % 3 ? "#c99a5a" : "#a86a3a"}"/>`).join("")}</g>
    <g transform="translate(330,1760) rotate(-8)"><rect x="-40" y="-70" width="80" height="140" rx="14" fill="#1a1b20"/><rect x="-32" y="-60" width="64" height="120" rx="8" fill="#2a3a5a"/></g>`;
}
const T = (side, a, b) => C.armT(side, a, b);
function armTo(p, side, a, b, t, d, ease = "power2.inOut") {
  const x = T(side, a, b), s = side < 0 ? "L" : "R";
  return `tl.to("#${p}-arm${s}u", { attr: { transform: "${x.u}" }, duration: ${d}, ease: "${ease}" }, ${t});
    tl.to("#${p}-arm${s}f", { attr: { transform: "${x.f}" }, duration: ${d}, ease: "${ease}" }, ${t});`;
}
function nod(p, t, amt = 10) {
  return `tl.to("#${p}-head", { y: ${amt}, rotation: 0, duration: 0.18, ease: "power2.out" }, ${t}); tl.to("#${p}-head", { y: 0, duration: 0.26, ease: "power2.inOut" }, ${(t + 0.2).toFixed(2)});`;
}

function s1() {
  const id = "s1", r = `${id}-r`, w = `${id}-w`, b = `${id}-b`;
  const rest = { L: [10, -55], R: [-10, 55] };
  const js = `
    cam("room", { scale: 1.05 }, { scale: 1.12, y: -10, origin: "50% 50%" }, 0, ${D});
    cam("friends", { scale: 1.0 }, { scale: 1.12, y: -10, origin: "50% 50%" }, 0, ${D});
    cam("front", { scale: 1.0 }, { scale: 1.2, y: 20, origin: "50% 55%" }, 0, ${D});
    ${[...Array(15)].map((_, i) => `flicker("#${id}-sl${i}", ${D}, 0.3, ${0.06 + (i % 3) * 0.03});`).join(" ")}
    flicker("#${id}-lamp", ${D}, 0.9, 0.04);
    // idle breathing, offset per friend
    tl.fromTo("#${w}-torso", { y: 0 }, { y: -5, duration: 1.5, ease: "sine.inOut", yoyo: true, repeat: 5 }, 0);
    tl.fromTo("#${b}-torso", { y: 0 }, { y: -5, duration: 1.7, ease: "sine.inOut", yoyo: true, repeat: 4 }, 0.3);
    look("${w}", 6, 0, 0, 0.01); look("${b}", -6, 0, 0, 0.01); look("${r}", -3, 1, 0, 0.01);
    blink("${w}", 0.5); blink("${b}", 0.9);
    // red: the idea arrives — brows up, sits up, the hand shoots up
    brows("${r}", -10, -2, 0.6, 0.3); eyesOpen("${r}", 1.12, 0.6, 0.3); look("${r}", 0, -2, 0.6, 0.25);
    tl.fromTo("#${r}-all", { y: 0 }, { y: -18, duration: 0.45, ease: "back.out(2)" }, 0.7);
    ${armTo(r, -1, 150, 10, 0.75, 0.5, "back.out(1.6)")}
    ${[0, 1, 2].map((k) => armTo(r, -1, 150 + (k % 2 ? 5 : -5), 10 + (k % 2 ? -14 : 14), (1.3 + k * 0.22).toFixed(2), 0.2, "sine.inOut")).join("\n")}
    // he points out of the window, toward the forest
    ${armTo(r, -1, ...rest.L, 2.05, 0.5)}
    ${armTo(r, 1, -165, -6, 2.15, 0.5, "power3.out")}
    turn("${r}", 16, 2.15, 0.45); look("${r}", 8, -1, 2.15, 0.3);
    tl.to("#${r}-all", { y: -10, x: 14, duration: 0.5, ease: "power2.out" }, 2.15);
    // then opens both arms wide: "imagine it!"
    ${armTo(r, -1, 25, 155, 3.2, 0.45, "back.out(1.4)")}
    ${armTo(r, 1, -25, -155, 3.2, 0.45, "back.out(1.4)")}
    turn("${r}", 0, 3.2, 0.4); look("${r}", -2, 0, 3.2, 0.3); brows("${r}", -13, -3, 3.2, 0.3);
    tl.to("#${r}-all", { y: -22, x: 0, duration: 0.3, ease: "power2.out" }, 3.25); tl.to("#${r}-all", { y: -12, duration: 0.35, ease: "power2.inOut" }, 3.6);
    // hands come together in front, eager
    ${armTo(r, -1, 34, -112, 4.5, 0.45)}
    ${armTo(r, 1, -34, 112, 4.5, 0.45)}
    tl.to("#${r}-all", { y: -16, duration: 0.18, ease: "power2.out" }, 4.95); tl.to("#${r}-all", { y: -8, duration: 0.3 }, 5.15);
    look("${r}", -8, 1, 5.3, 0.3); look("${r}", 8, 1, 6.3, 0.35); blink("${r}", 5.9);
    ${armTo(r, -1, ...rest.L, 7.2, 0.6)}${armTo(r, 1, ...rest.R, 7.25, 0.6)}
    tl.to("#${r}-all", { y: 0, duration: 0.6, ease: "power2.inOut" }, 7.2); eyesOpen("${r}", 1, 7.2, 0.4); brows("${r}", -6, -1, 7.2, 0.4);
    look("${r}", 0, 1, 7.6, 0.3);
    // white: turns to him, follows the point, warms up, nods yes
    turn("${w}", 10, 0.9, 0.4); look("${w}", 8, -1, 0.9, 0.3);
    look("${w}", 9, -2, 2.25, 0.3); brows("${w}", -6, 0, 2.3, 0.3);
    eyesOpen("${w}", 0.82, 3.4, 0.3); brows("${w}", -4, 0, 3.4, 0.3);
    ${nod(w, 3.6)} ${nod(w, 4.1)} ${nod(w, 4.6, 8)}
    tl.to("#${w}-head", { rotation: -3, transformOrigin: "50% 90%", duration: 0.5, ease: "sine.inOut" }, 5.4);
    blink("${w}", 6.6); look("${w}", 6, 0, 7.4, 0.3);
    // blue: looks to him, out to the window, back; laughs and nods
    turn("${b}", -10, 1.2, 0.4); look("${b}", -8, -1, 1.2, 0.3);
    turn("${b}", 8, 2.4, 0.4); look("${b}", 9, -2, 2.4, 0.3);
    turn("${b}", -10, 3.3, 0.4); look("${b}", -8, 0, 3.3, 0.3); brows("${b}", -8, 0, 3.4, 0.3);
    eyesOpen("${b}", 0.8, 4.0, 0.3);
    ${nod(b, 4.3)} ${nod(b, 4.8)} ${nod(b, 5.6, 7)}
    tl.to("#${b}-head", { rotation: 4, transformOrigin: "50% 90%", duration: 0.4, ease: "power2.out" }, 5.1);
    tl.to("#${b}-head", { rotation: 0, transformOrigin: "50% 90%", duration: 0.6, ease: "sine.inOut" }, 6.2);
    blink("${b}", 6.9);
  `;
  return { id, dur: D, html: scene({ id, dur: D, fadeIn: true, fadeOut: true, bg: "#4a3226", vignette: 0.7,
    layers: [
      { name: "room", blur: 5, svg: room(id) },
      { name: "friends", svg: `
        ${place(...POS.w, C.friend(w, C.WHITE, { kind: "fade", beard: true }), `${w}-all`)}
        ${place(...POS.b, C.friend(b, C.BLUE, { kind: "curly" }), `${b}-all`)}
        ${place(...POS.r, C.friend(r, C.RED, { kind: "wavy", grin: true }), `${r}-all`)}
        <defs>${glow(`${id}-lg`, 30, 500, 1100, "#ffa850", 0.5)}${glow(`${id}-cool`, 900, 500, 700, "#6a8cff", 0.18)}</defs>
        <rect id="${id}-lamp" width="1080" height="1920" fill="url(#${id}-lg)" style="mix-blend-mode:screen"/>
        <rect width="1080" height="1920" fill="url(#${id}-cool)" style="mix-blend-mode:screen"/>` },
      { name: "front", blur: 8, svg: tableFront(id) },
    ],
    js }) };
}

export default [s1()];
