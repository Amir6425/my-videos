// SCENES 3–6 – her bedroom at night: lying in bed, the clock at 11:00, reading the paper, typing on the phone.
import { scene, place, glow, C } from "./lib.mjs";
import { NOTE, NOTE_FONT } from "./scene1.mjs";
const P = C.PAL;

// What she types, and the time on the phone's lock screen.
const MESSAGE = "سلام، شما کی هستید؟";
const LOCK_TIME = "11:01";

const B = { floor: "#161c2a", frame: "#33282a", frameHi: "#45373a", sheet: "#8e9bb2", sheetSh: "#76839b", pillow: "#aeb9cc", pillowSh: "#94a0b6",
  blanket: "#2e5866", blanketHi: "#3f707e", blanketSh: "#244753", stand: "#4a3a30", standHi: "#5c4a3e" };

// ── her lying on her back, seen from above (head at the top), local coords as the bust rig ───────────
const SH = [165, 250], L1 = 230, L2 = 220; // shoulder (screen right = her left), upper arm, forearm
// two-joint IK in local coords: angles (deg) of the upper arm and the forearm, measured from "pointing down"
export function ik([tx, ty]) {
  const dx = tx - SH[0], dy = ty - SH[1];
  const d = Math.min(Math.hypot(dx, dy), L1 + L2 - 1);
  const th = Math.atan2(dy, dx);
  const al = Math.acos((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d));
  const opts = [th - al, th + al].map((u) => {
    const ex = SH[0] + L1 * Math.cos(u), ey = SH[1] + L1 * Math.sin(u);
    const f = Math.atan2(ty - ey, tx - ex);
    return { u, f, ex };
  });
  const o = opts[0].ex > opts[1].ex ? opts[0] : opts[1]; // elbow out, away from the body
  const deg = (r) => (r * 180) / Math.PI;
  const a = deg(o.u) - 90, b = deg(o.f) - deg(o.u);
  return [Math.round(a * 10) / 10, Math.round(b * 10) / 10];
}
const armT = ([a, b]) => ({ u: `rotate(${a} ${SH[0]} ${SH[1]})`, f: `rotate(${b} ${SH[0]} ${SH[1] + L1})`, p: `rotate(${-(a + b)} ${SH[0]} ${SH[1] + L1 + L2 + 90})` });

function hairSpread() {
  // long hair fanned out on the pillow: a wavy outline with strands
  const pts = [];
  for (let i = 0; i <= 40; i++) {
    const a = Math.PI * (0.9 + (i / 40) * 1.2); // from lower left, over the top, to lower right
    const r = 245 + (i % 2 ? 12 : 0) + Math.sin(i * 0.9) * 14;
    pts.push([Math.cos(a) * r * 1.05, Math.sin(a) * r * 0.95 - 30]);
  }
  const d = "M -150,250 " + pts.map(([x, y], i) => (i % 2 ? `Q ${x.toFixed(0)},${y.toFixed(0)} ` : `${x.toFixed(0)},${y.toFixed(0)} `)).join("") + " L 150,250 Z";
  const strands = [...Array(11)].map((_, i) => {
    const a = Math.PI * (1.02 + i * 0.1), r1 = 150, r2 = 240;
    return `<path d="M ${Math.cos(a) * r1},${Math.sin(a) * r1 - 30} Q ${Math.cos(a + 0.08) * 200},${Math.sin(a + 0.08) * 200 - 30} ${Math.cos(a) * r2},${Math.sin(a) * r2 - 30}" stroke="${i % 2 ? P.wHairHi : "#140e0c"}" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.8"/>`;
  }).join("");
  return `<path d="${d}" fill="#271c18"/>${strands}`;
}
// the body under the blanket (drawn in local coords); the blanket is drawn in frame coords by the shot
function lyingBody(p) {
  return `${hairSpread()}${C.womanTorso(p, { coat: false })}${C.womanHead(p, { scarf: false, backHair: false })}`;
}
function blanket(y) {
  return `<path d="M 90,${y + 30} C 300,${y - 10} 600,${y + 10} 860,${y - 4} L 900,1960 L 60,1960 Z" fill="${B.blanket}"/>
    <path d="M 90,${y + 30} C 300,${y - 10} 600,${y + 10} 860,${y - 4} L 864,${y + 60} C 600,${y + 76} 300,${y + 56} 92,${y + 96} Z" fill="${B.sheet}"/>
    ${[...Array(9)].map((_, i) => `<path d="M ${120 + i * 86},${y + 150} l 26,26 l -26,26 l -26,-26 z" fill="none" stroke="${B.blanketHi}" stroke-width="5" opacity="0.7"/>`).join("")}
    ${[...Array(9)].map((_, i) => `<path d="M ${163 + i * 86},${y + 330} l 26,26 l -26,26 l -26,-26 z" fill="none" stroke="${B.blanketHi}" stroke-width="5" opacity="0.7"/>`).join("")}
    <path d="M 300,${y + 120} C 340,${y + 400} 320,${y + 700} 340,1960" stroke="${B.blanketSh}" stroke-width="16" fill="none" opacity="0.6"/>
    <path d="M 640,${y + 110} C 600,${y + 420} 630,${y + 700} 610,1960" stroke="${B.blanketSh}" stroke-width="16" fill="none" opacity="0.6"/>`;
}
const PAPER_BACK = (w, h) => `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#dcd6c6"/>
  <g opacity="0.13" fill="#24264a">${[0, 1, 2].map((i) => `<rect x="${-w / 2 + 30}" y="${-h / 2 + 40 + i * 40}" width="${w - 60 - (i === 2 ? 40 : 0)}" height="10" rx="5"/>`).join("")}</g>`;
// the movable arm with a prop (paper or phone) in the hand
function lyingArm(p, pose, prop) {
  const t = armT(pose);
  const hand = C.womanHand(`${p}-hand`, { sleeve: "sweater" });
  return `<g id="${p}-armU" transform="${t.u}">
      <path d="M ${SH[0] - 40},${SH[1] - 20} L ${SH[0] + 40},${SH[1] - 20} L ${SH[0] + 34},${SH[1] + L1} L ${SH[0] - 34},${SH[1] + L1} Z" fill="${P.sweater}"/>
      <path d="M ${SH[0] + 20},${SH[1]} L ${SH[0] + 34},${SH[1] + L1}" stroke="${P.sweaterSh}" stroke-width="8"/>
      <g id="${p}-armF" transform="${t.f}">
        <circle cx="${SH[0]}" cy="${SH[1] + L1}" r="34" fill="${P.sweater}"/>
        <path d="M ${SH[0] - 34},${SH[1] + L1} L ${SH[0] + 34},${SH[1] + L1} L ${SH[0] + 30},${SH[1] + L1 + L2 - 10} L ${SH[0] - 30},${SH[1] + L1 + L2 - 10} Z" fill="${P.sweater}"/>
        <g transform="translate(${SH[0]},${SH[1] + L1 + L2}) rotate(180) scale(0.82)">${hand}</g>
        <g id="${p}-prop" transform="${t.p}"><g transform="translate(${SH[0]},${SH[1] + L1 + L2 + 90})">${prop}</g></g>
      </g>
    </g>`;
}
function restArm() { // her right arm (screen left), resting on the blanket
  return `<g transform="rotate(7 -165 250)">
      <path d="M -205,230 L -125,230 L -131,${250 + L1 + L2 - 10} L -199,${250 + L1 + L2 - 10} Z" fill="${P.sweater}"/>
      <g transform="translate(-165,${250 + L1 + L2}) rotate(180) scale(0.82)">${C.womanHand("rest", { sleeve: "sweater" }).replace('id="rest"', "")}</g></g>`;
}

// the bed and nightstand from above, in frame coords
function bedroom(id, { onStand = { paper: true, phone: true } } = {}) {
  return `
    <rect width="1080" height="1920" fill="${B.floor}"/>
    ${[...Array(12)].map((_, i) => `<path d="M ${i * 100},0 L ${i * 100},1920" stroke="#121725" stroke-width="4"/>`).join("")}
    <rect x="70" y="120" width="830" height="1900" rx="20" fill="${B.frame}"/>
    <rect x="70" y="120" width="830" height="110" rx="20" fill="${B.frameHi}"/>
    <rect x="96" y="220" width="778" height="1800" rx="16" fill="${B.sheet}"/>
    <path d="M 160,250 C 160,200 820,200 820,250 L 820,560 C 820,610 160,610 160,560 Z" fill="${B.pillow}"/>
    <path d="M 180,540 C 300,580 680,580 800,540" stroke="${B.pillowSh}" stroke-width="12" fill="none"/>
    <g id="${id}-stand">
      <rect x="840" y="300" width="250" height="420" rx="12" fill="${B.stand}"/>
      <rect x="852" y="312" width="226" height="396" rx="8" fill="${B.standHi}"/>
      <circle cx="1010" cy="420" r="70" fill="#d8ccb2"/><circle cx="1010" cy="420" r="70" fill="none" stroke="#bfb196" stroke-width="10"/><circle cx="1010" cy="420" r="18" fill="#9c8f74"/>
      <rect x="868" y="382" width="104" height="48" rx="10" fill="#151518"/><rect x="880" y="420" width="80" height="6" rx="3" fill="#ff3b30" opacity="0.6"/>
      ${onStand.paper ? `<g id="${id}-spaper" transform="translate(905,575) rotate(-8)"><rect x="-62" y="-42" width="124" height="84" fill="#e3dccb"/><path d="M -62,-42 L 62,-42" stroke="#c9bfa8" stroke-width="5"/></g>` : ""}
      ${onStand.phone ? `<g id="${id}-sphone" transform="translate(1015,610) rotate(12)"><rect x="-34" y="-66" width="68" height="132" rx="12" fill="#1c1d22"/><rect x="-20" y="-54" width="22" height="30" rx="6" fill="#2c2e36"/></g>` : ""}
    </g>`;
}
const moon = (id) => `<defs><linearGradient id="${id}-mn" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fb8ff" stop-opacity="0.13"/><stop offset="1" stop-color="#9fb8ff" stop-opacity="0"/></linearGradient></defs>
  ${[0, 1, 2, 3].map((i) => `<path d="M ${-200 + i * 190},0 L ${-60 + i * 190},0 L ${560 + i * 190},1920 L ${420 + i * 190},1920 Z" fill="url(#${id}-mn)"/>`).join("")}`;

const REST = [-6, 2];
const POS = { x: 470, y: 470, s: 0.95 };
const toLocal = ([x, y]) => [(x - POS.x) / POS.s, (y - POS.y) / POS.s];
// wrist target ~85 units short of the object, along the line from the shoulder
function reachTo(frameXY) {
  const [x, y] = toLocal(frameXY);
  const dx = x - SH[0], dy = y - SH[1], d = Math.hypot(dx, dy);
  return ik([x - (dx / d) * 85, y - (dy / d) * 85]);
}
const HOLD = ik([70, 600]);

// ── one medium top-down shot of her in bed; kind: "think" | "paper" | "phone" ───────────────────────
function bedShot(id, dur, kind) {
  const w = `${id}-w`;
  const paperProp = `<g id="${w}-pf"><g transform="translate(0,-45)">${PAPER_BACK(240, 160)}</g><g transform="translate(0,-125)"><g id="${w}-ptop"><g transform="translate(0,-80)">${PAPER_BACK(240, 160)}</g></g></g></g>`;
  const phoneProp = `<g id="${w}-ph"><rect x="-44" y="-80" width="88" height="160" rx="16" fill="#1c1d22"/><rect x="-28" y="-66" width="28" height="38" rx="8" fill="#2c2e36"/><circle cx="-14" cy="-56" r="6" fill="#0d0d10"/></g>`;
  const start = kind === "phone" ? HOLD : REST;
  const prop = kind === "think" ? "" : `<g id="${w}-propPaper" opacity="${kind === "phone" ? 1 : 0}">${paperProp}</g><g id="${w}-propPhone" opacity="0">${phoneProp}</g>`;
  const tw = (pose, t, d, ease = "power2.inOut") => {
    const T = armT(pose);
    return `tl.to("#${w}-armU", { attr: { transform: "${T.u}" }, duration: ${d}, ease: "${ease}" }, ${t});
    tl.to("#${w}-armF", { attr: { transform: "${T.f}" }, duration: ${d}, ease: "${ease}" }, ${t});
    tl.to("#${w}-prop", { attr: { transform: "${T.p}" }, duration: ${d}, ease: "${ease}" }, ${t});`;
  };
  let js = `
    mouth("${w}", "W", 0, 0.01);
  `;
  if (kind === "think") js += `
    cam("room", { scale: 1.0, rotation: 2.5 }, { scale: 1.1, rotation: 0, y: 30 }, 0, ${dur});
    cam("her", { scale: 1.0, rotation: 2.5 }, { scale: 1.1, rotation: 0, y: 30 }, 0, ${dur});
    look("${w}", -3, -5, 0, 0.01); eyesOpen("${w}", 0.9, 0, 0.01); brows("${w}", -3, -5, 0, 0.01);
    tl.fromTo("#${w}-chest", { scaleY: 1 }, { scaleY: 1.015, transformOrigin: "50% 0%", duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: 2 }, 0);
    blink("${w}", 1.6, 0.3); look("${w}", 2, -6, 2.3, 0.9); brows("${w}", -6, -8, 2.6, 0.8);
    blink("${w}", 4.0, 0.32); look("${w}", -1, -4, 4.4, 0.6);
  `;
  if (kind === "paper") js += `
    cam("room", { scale: 1.06 }, { scale: 1.12, y: 20 }, 0, ${dur});
    cam("her", { scale: 1.06 }, { scale: 1.12, y: 20 }, 0, ${dur});
    look("${w}", -2, -4, 0, 0.01); eyesOpen("${w}", 0.92, 0, 0.01);
    tl.set("#${w}-ptop", { scaleY: 0, transformOrigin: "50% 100%" }, 0);
    turn("${w}", 10, 0.2, 0.5); look("${w}", 8, 2, 0.2, 0.4);
    ${tw(reachTo([905, 575]), 0.3, 0.9)}
    tl.set("#${id}-spaper", { opacity: 0 }, 1.2); tl.set("#${w}-propPaper", { opacity: 1 }, 1.2);
    ${tw(HOLD, 1.3, 0.9)}
    turn("${w}", 0, 1.4, 0.5); look("${w}", 2, 7, 1.4, 0.5);
    tl.to("#${w}-ptop", { scaleY: 1, transformOrigin: "50% 100%", duration: 0.5, ease: "power2.out" }, 2.4);
    look("${w}", 3, 8, 2.9, 0.4); blink("${w}", 3.3);
  `;
  if (kind === "phone") js += `
    cam("room", { scale: 1.06 }, { scale: 1.12, y: 20 }, 0, ${dur});
    cam("her", { scale: 1.06 }, { scale: 1.12, y: 20 }, 0, ${dur});
    look("${w}", 2, 7, 0, 0.01); brows("${w}", -8, -7, 0, 0.01); mouth("${w}", "O", 0, 0.01);
    mouth("${w}", "W", 1.2, 0.4);
    ${tw(ik([60, 720]), 0.2, 0.6)}
    tl.set("#${w}-propPaper", { opacity: 0 }, 0.8); tl.set("#${id}-chpaper", { opacity: 1 }, 0.8);
    turn("${w}", 10, 0.8, 0.5); look("${w}", 8, 2, 0.8, 0.4);
    ${tw(reachTo([1015, 610]), 0.85, 0.8)}
    tl.set("#${id}-sphone", { opacity: 0 }, 1.65); tl.set("#${w}-propPhone", { opacity: 1 }, 1.65);
    ${tw(HOLD, 1.75, 0.85)}
    turn("${w}", 0, 1.9, 0.5); look("${w}", 2, 7, 1.9, 0.5); brows("${w}", -4, -4, 1.9, 0.5);
    tl.fromTo("#${id}-glow", { opacity: 0 }, { opacity: 1, duration: 0.6 }, 2.4);
    blink("${w}", 3.0);
  `;
  return { id, dur, html: scene({ id, dur, fadeIn: kind === "think", bg: B.floor, vignette: 0.8,
    layers: [
      { name: "room", svg: bedroom(id, { onStand: { paper: kind === "paper", phone: kind !== "think" } }) },
      { name: "her", defs: glow(`${id}-gl`, 520, 700, 520, "#9fd0ff", 0.55), svg: `
        ${place(POS.x, POS.y, POS.s, `<g id="${w}-chest">${lyingBody(w)}</g>`)}
        ${blanket(980)}
        ${kind === "phone" ? `<g id="${id}-chpaper" opacity="0" transform="translate(520,1060) rotate(-6)">${PAPER_BACK(220, 150)}</g>` : ""}
        ${place(POS.x, POS.y, POS.s, restArm() + lyingArm(w, start, prop))}
        <rect id="${id}-glow" width="1080" height="1920" fill="url(#${id}-gl)" opacity="0" style="mix-blend-mode:screen"/>
        ${moon(id)}` },
    ],
    js }) };
}

// ── Scene 4: the clock, 11:00 ──────────────────────────────────────────────────────────────────────
const SEG = { a: [[0, 0], [1, 0]], b: [[1, 0], [1, 1]], c: [[1, 1], [1, 2]], d: [[0, 2], [1, 2]], e: [[0, 1], [0, 2]], f: [[0, 0], [0, 1]], g: [[0, 1], [1, 1]] };
const DIG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
function digit(x, y, n, w = 120, h = 110, th = 22) {
  return Object.entries(SEG).map(([k, [[x1, y1], [x2, y2]]]) => {
    const on = DIG[n].includes(k);
    const X1 = x + x1 * w, Y1 = y + y1 * h, X2 = x + x2 * w, Y2 = y + y2 * h;
    const horiz = Y1 === Y2;
    const pts = horiz
      ? `${X1 + 8},${Y1} ${X1 + 8 + th / 2},${Y1 - th / 2} ${X2 - 8 - th / 2},${Y1 - th / 2} ${X2 - 8},${Y1} ${X2 - 8 - th / 2},${Y1 + th / 2} ${X1 + 8 + th / 2},${Y1 + th / 2}`
      : `${X1},${Y1 + 8} ${X1 + th / 2},${Y1 + 8 + th / 2} ${X1 + th / 2},${Y2 - 8 - th / 2} ${X1},${Y2 - 8} ${X1 - th / 2},${Y2 - 8 - th / 2} ${X1 - th / 2},${Y1 + 8 + th / 2}`;
    return `<polygon points="${pts}" fill="${on ? "#ff3b30" : "#3a1412"}" opacity="${on ? 1 : 0.55}"/>`;
  }).join("");
}
function s4() {
  const id = "s4", dur = 3.2;
  const face = `<rect x="150" y="820" width="780" height="400" rx="40" fill="#121216"/>
    <rect x="182" y="852" width="716" height="336" rx="24" fill="#0a0a0c"/>
    ${digit(220, 910, 1)}${digit(380, 910, 1)}
    <g id="${id}-colon"><circle cx="540" cy="975" r="14" fill="#ff3b30"/><circle cx="540" cy="1065" r="14" fill="#ff3b30"/></g>
    ${digit(580, 910, 0)}${digit(740, 910, 0)}
    <rect x="182" y="852" width="716" height="60" rx="24" fill="#fff" opacity="0.04"/>`;
  return { id, dur, html: scene({ id, dur, bg: "#10141f", vignette: 0.85,
    layers: [
      { name: "bg", blur: 12, svg: `<rect width="1080" height="1920" fill="#141a28"/>
        <rect x="0" y="1220" width="1080" height="700" fill="${B.stand}"/><rect x="0" y="1220" width="1080" height="26" fill="${B.standHi}"/>
        <rect x="-40" y="560" width="210" height="660" fill="#2a2c33"/><ellipse cx="65" cy="560" rx="160" ry="60" fill="#d8ccb2" opacity="0.7"/>
        <rect x="900" y="1150" width="220" height="80" rx="12" fill="#1c1d22"/>
        <path d="M 600,0 L 760,0 L 1080,700 L 1080,1000 Z" fill="#9fb8ff" opacity="0.12"/>` },
      { name: "clock", defs: glow(`${id}-rg`, 540, 1020, 560, "#ff3b30", 0.35), svg: `
        <ellipse cx="540" cy="1228" rx="420" ry="30" fill="#000" opacity="0.5"/>
        ${face}
        <rect width="1080" height="1920" fill="url(#${id}-rg)" style="mix-blend-mode:screen"/>` },
    ],
    js: `
    cam("bg", { scale: 1.0 }, { scale: 1.05 }, 0, ${dur});
    cam("clock", { scale: 1.0 }, { scale: 1.1 }, 0, ${dur});
    ${[0, 1, 2].map((i) => `tl.set("#${id}-colon", { opacity: 0.25 }, ${(0.75 + i).toFixed(2)}); tl.set("#${id}-colon", { opacity: 1 }, ${(1.0 + i).toFixed(2)});`).join("\n    ")}
    ` }) };
}

// ── POV: the paper in her hands ────────────────────────────────────────────────────────────────────
function s5b() {
  const id = "s5b", dur = 3.6;
  const lines = NOTE.map((txt, i) => `<text x="830" y="${720 + i * 210}" font-family="Ruqaa, Vazirmatn" font-size="${i === 2 ? 104 : 92}" fill="#24264a" text-anchor="start" direction="rtl">${txt}</text>`).join("");
  return { id, dur, html: scene({ id, dur, bg: B.floor, vignette: 0.75, extraStyle: NOTE_FONT,
    layers: [
      { name: "bg", blur: 16, svg: `<rect width="1080" height="1920" fill="${B.blanket}"/>${[...Array(5)].map((_, i) => `<path d="M ${i * 260},0 L ${i * 260 + 200},1920" stroke="${B.blanketHi}" stroke-width="40" opacity="0.4"/>`).join("")}` },
      { name: "paper", svg: `
        <g id="${id}-sheet">
          <rect x="150" y="380" width="800" height="1100" fill="#000" opacity="0.35" transform="translate(16,20)"/>
          <rect x="150" y="380" width="800" height="1100" fill="#efe8d7"/>
          <path d="M 150,930 L 950,930" stroke="#d6ccb4" stroke-width="5"/>
          <rect x="150" y="930" width="800" height="550" fill="#000" opacity="0.04"/>
          ${lines}
        </g>
        <g transform="translate(120,1560) rotate(28) scale(1.9)">${C.womanHand(`${id}-hl`, { sleeve: "sweater" })}</g>
        <g transform="translate(980,1560) rotate(-28) scale(-1.9,1.9)">${C.womanHand(`${id}-hr`, { sleeve: "sweater" })}</g>
        <rect width="1080" height="1920" fill="#9fb8ff" opacity="0.08" style="mix-blend-mode:screen"/>` },
    ],
    js: `
    cam("bg", { scale: 1.05 }, { scale: 1.08 }, 0, ${dur});
    cam("paper", { scale: 1.0, rotation: -1.2, y: 0 }, { scale: 1.12, rotation: 0.6, y: -60, origin: "55% 60%" }, 0, ${dur}, "sine.inOut");
    ` }) };
}

// ── close-ups of her face, lying (scene 5 reaction, scene 6 phone glow) ────────────────────────────
function faceCU(id, dur, kind) {
  const w = `${id}-w`;
  const phone = kind === "phone";
  const fore = phone
    ? `<g transform="translate(540,1880)"><rect x="-300" y="-140" width="600" height="300" rx="50" fill="#1c1d22"/><rect x="-200" y="-110" width="80" height="90" rx="20" fill="#2c2e36"/></g>
       <g transform="translate(300,1770)"><g id="${id}-thL"><ellipse cx="0" cy="0" rx="46" ry="80" fill="${P.wSkinSh}" transform="rotate(20)"/></g></g>
       <g transform="translate(780,1770)"><g id="${id}-thR"><ellipse cx="0" cy="0" rx="46" ry="80" fill="${P.wSkinSh}" transform="rotate(-20)"/></g></g>`
    : `<g transform="translate(540,1880) rotate(2)">${PAPER_BACK(900, 360)}</g>`;
  let js = `
    cam("bg", { scale: 1.0 }, { scale: 1.05 }, 0, ${dur});
    cam("face", { scale: 1.0 }, { scale: ${phone ? 1.1 : 1.07}, y: -20, origin: "50% 45%" }, 0, ${dur});
  `;
  if (!phone) js += `
    look("${w}", 6, 8, 0, 0.01); eyesOpen("${w}", 0.92, 0, 0.01); brows("${w}", -2, -2, 0, 0.01); mouth("${w}", "N", 0, 0.01);
    look("${w}", -4, 8, 0.15, 0.7, "none"); look("${w}", 6, 10, 0.9, 0.12); look("${w}", -4, 10, 1.05, 0.6, "none");
    brows("${w}", -12, -4, 1.5, 0.35, "power3.out"); eyesOpen("${w}", 1.2, 1.5, 0.3);
    look("${w}", 0, 6, 1.6, 0.3);
    tl.fromTo("#${w}-head", { y: 0 }, { y: -12, duration: 0.4, ease: "power2.out" }, 1.55);
    mouth("${w}", "O", 1.75, 0.3);
    blink("${w}", 2.3, 0.14); blink("${w}", 2.55, 0.14);
    brows("${w}", -10, -10, 2.8, 0.5); look("${w}", 2, 9, 2.9, 0.4);
  `;
  else js += `
    look("${w}", 0, 9, 0, 0.01); eyesOpen("${w}", 0.9, 0, 0.01); brows("${w}", -7, -7, 0, 0.01); mouth("${w}", "W", 0, 0.01);
    flicker("#${id}-glow", ${dur}, 0.85, 0.05);
    blink("${w}", 1.6); look("${w}", -3, 9, 2.2, 0.3); look("${w}", 2, 10, 3.0, 0.3);
  `;
  if (phone) for (let k = 0; k < Math.floor(dur / 0.22); k++) {
    const side = k % 2 ? "thL" : "thR", t = (0.2 + k * 0.22).toFixed(2);
    js += `tl.to("#${id}-${side}", { y: -16, duration: 0.08, ease: "power2.out" }, ${t}); tl.to("#${id}-${side}", { y: 0, duration: 0.1, ease: "power2.in" }, ${(+t + 0.09).toFixed(2)});\n`;
  }
  return { id, dur, html: scene({ id, dur, bg: B.floor, vignette: 0.8, fadeOut: phone,
    layers: [
      { name: "bg", blur: 10, svg: `<rect width="1080" height="1920" fill="${B.sheet}"/><path d="M -60,200 C -60,80 1140,80 1140,200 L 1140,1500 C 1140,1640 -60,1640 -60,1500 Z" fill="${B.pillow}"/>` },
      { name: "face", defs: glow(`${id}-gl`, 540, 1500, 1100, phone ? "#8fc6ff" : "#ffffff", phone ? 0.6 : 0.12), svg: `
        ${place(540, 860, 1.55, hairSpread() + C.womanTorso(w, { coat: false }) + C.womanHead(w, { scarf: false, backHair: false }))}
        <rect id="${id}-glow" width="1080" height="1920" fill="url(#${id}-gl)" opacity="${phone ? 0.85 : 1}" style="mix-blend-mode:screen"/>
        <rect width="1080" height="1920" fill="#1b2a4a" opacity="${phone ? 0.25 : 0.15}" style="mix-blend-mode:multiply"/>` },
      { name: "fore", blur: phone ? 6 : 9, svg: fore },
    ],
    js }) };
}

// ── POV: the phone, unlock, type ───────────────────────────────────────────────────────────────────
const KEYS = [["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج"], ["ش", "س", "ی", "ب", "ل", "ا", "ت", "ن", "م", "ک", "گ"], ["ظ", "ط", "ز", "ر", "ذ", "د", "پ", "و", "؟"], ["،", " "]];
function s6b() {
  const id = "s6b", dur = 5.4;
  const X0 = 234, X1 = 846, Y0 = 324, Y1 = 1596, KW = 55, KH = 92;
  const kb0 = 1150;
  const keyPos = {};
  const keys = KEYS.map((row, r) => {
    if (r === 3) {
      keyPos["،"] = [X1 - 30 - 60, kb0 + 3 * (KH + 14) + KH / 2];
      keyPos[" "] = [540, kb0 + 3 * (KH + 14) + KH / 2];
      return `<rect x="${X1 - 150}" y="${kb0 + 3 * (KH + 14)}" width="120" height="${KH}" rx="12" fill="#3a3c44"/><text x="${X1 - 90}" y="${kb0 + 3 * (KH + 14) + 62}" font-family="Vazirmatn" font-size="40" fill="#eee" text-anchor="middle">،</text>
        <rect x="350" y="${kb0 + 3 * (KH + 14)}" width="380" height="${KH}" rx="12" fill="#55575f"/><text x="540" y="${kb0 + 3 * (KH + 14) + 58}" font-family="Vazirmatn" font-size="30" fill="#ccc" text-anchor="middle">فاصله</text>
        <rect x="${X0 + 20}" y="${kb0 + 3 * (KH + 14)}" width="90" height="${KH}" rx="12" fill="#3a3c44"/>`;
    }
    const n = row.length, rowW = n * KW, start = X1 - (X1 - X0 - rowW) / 2;
    return row.map((k, i) => {
      const x = start - (i + 1) * KW, y = kb0 + r * (KH + 14);
      keyPos[k] = [x + KW / 2, y + KH / 2];
      return `<rect x="${x + 3}" y="${y}" width="${KW - 6}" height="${KH}" rx="10" fill="#55575f"/><text x="${x + KW / 2}" y="${y + 60}" font-family="Vazirmatn" font-size="38" fill="#f2f2f2" text-anchor="middle">${k}</text>`;
    }).join("");
  }).join("");
  const highlights = [...new Set(MESSAGE)].map((ch) => {
    const [x, y] = keyPos[ch] || keyPos[" "];
    return `<rect id="${id}-k${ch.charCodeAt(0)}" x="${x - 30}" y="${y - KH / 2 - 60}" width="60" height="${KH + 60}" rx="14" fill="#8a8c96" opacity="0"/>`;
  }).join("");
  const number = NOTE[2];
  const lock = `<g id="${id}-lock">
      <rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${Y1 - Y0}" rx="58" fill="url(#${id}-wall)"/>
      <text x="540" y="620" font-family="Vazirmatn" font-size="170" fill="#f4f0ff" text-anchor="middle" letter-spacing="2">${LOCK_TIME}</text>
      <path d="M 520,430 L 520,412 C 520,392 560,392 560,412 L 560,430" stroke="#f4f0ff" stroke-width="6" fill="none"/><rect x="510" y="428" width="60" height="44" rx="8" fill="#f4f0ff"/>
      <rect x="440" y="1540" width="200" height="10" rx="5" fill="#f4f0ff" opacity="0.8"/>
    </g>`;
  const chat = `<g id="${id}-chat" opacity="0">
      <rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${Y1 - Y0}" rx="58" fill="#14161d"/>
      <rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="190" rx="58" fill="#1f222c"/><rect x="${X0}" y="${Y0 + 130}" width="${X1 - X0}" height="60" fill="#1f222c"/>
      <circle cx="${X1 - 90}" cy="${Y0 + 110}" r="42" fill="#5a6273"/><circle cx="${X1 - 90}" cy="${Y0 + 98}" r="14" fill="#cfd4dd"/><path d="M ${X1 - 116},${Y0 + 134} C ${X1 - 110},${Y0 + 112} ${X1 - 70},${Y0 + 112} ${X1 - 64},${Y0 + 134} Z" fill="#cfd4dd"/>
      <text x="${X1 - 150}" y="${Y0 + 124}" font-family="Vazirmatn" font-size="40" fill="#eef1f6" text-anchor="start" direction="rtl">${number}</text>
      <path d="M ${X0 + 50},${Y0 + 110} l 24,-22 M ${X0 + 50},${Y0 + 110} l 24,22" stroke="#8fb6ff" stroke-width="6" stroke-linecap="round"/>
      ${[...Array(9)].map((_, i) => `<circle cx="${X0 + 60 + (i % 3) * 230}" cy="${Y0 + 330 + Math.floor(i / 3) * 210}" r="18" fill="#1d2029"/>`).join("")}
      <rect x="${X0 + 20}" y="${kb0 - 120}" width="${X1 - X0 - 120}" height="90" rx="45" fill="#262a35"/>
      <circle cx="${X0 + 60 + X1 - X0 - 120 + 10}" cy="${kb0 - 75}" r="38" fill="#3b82f6"/><path d="M ${X1 - 60},${kb0 - 75} l -26,-14 l 0,28 z" fill="#fff" transform="rotate(180 ${X1 - 66} ${kb0 - 75})"/>
      <text id="${id}-typed" x="${X1 - 140}" y="${kb0 - 62}" font-family="Vazirmatn" font-size="40" fill="#eef1f6" text-anchor="start" direction="rtl"></text>
      <rect id="${id}-cursor" x="${X1 - 146}" y="${kb0 - 100}" width="4" height="50" fill="#8fb6ff"/>
      <rect x="${X0}" y="${kb0 - 20}" width="${X1 - X0}" height="${Y1 - kb0 + 20}" fill="#2a2c33"/>
      ${highlights}
      ${keys}
    </g>`;
  // typing schedule
  const t0 = 1.8, step = 0.17;
  let js = `
    cam("bg", { scale: 1.04 }, { scale: 1.07 }, 0, ${dur});
    cam("phone", { scale: 1.0, rotation: -1, y: 10 }, { scale: 1.04, rotation: 0.5, y: -10 }, 0, ${dur});
    tl.fromTo("#${id}-thR", { attr: { transform: "translate(700,1500)" } }, { attr: { transform: "translate(560,1400)" }, duration: 0.3, ease: "power2.out" }, 0.7);
    tl.to("#${id}-thR", { attr: { transform: "translate(560,1000)" }, duration: 0.35, ease: "power2.inOut" }, 1.0);
    tl.fromTo("#${id}-lock", { y: 0, opacity: 1 }, { y: -500, opacity: 0, duration: 0.4, ease: "power2.in" }, 1.05);
    tl.fromTo("#${id}-chat", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1.3);
    tl.to("#${id}-thR", { attr: { transform: "translate(700,1500)" }, duration: 0.3, ease: "power2.inOut" }, 1.4);
    const typed = document.getElementById("${id}-typed"), cursor = document.getElementById("${id}-cursor");
    const full = ${JSON.stringify(MESSAGE)};
    const prog = { n: 0 };
    tl.fromTo(prog, { n: 0 }, { n: full.length, duration: ${(MESSAGE.length * step).toFixed(2)}, ease: "none", onUpdate() {
      const k = Math.floor(prog.n + 0.0001);
      typed.textContent = full.slice(0, k);
      const wpx = k ? typed.getComputedTextLength() : 0;
      cursor.setAttribute("x", ${X1 - 146} - wpx);
    } }, ${t0});
  `;
  [...MESSAGE].forEach((ch, i) => {
    const [x, y] = keyPos[ch] || keyPos[" "];
    const side = x < 540 ? "thL" : "thR";
    const t = t0 + i * step;
    js += `tl.to("#${id}-${side}", { attr: { transform: "translate(${Math.round(x)},${Math.round(y + 26)})" }, duration: ${(step * 0.6).toFixed(3)}, ease: "power2.out" }, ${(t - step * 0.6).toFixed(3)});
    tl.to("#${id}-k${ch.charCodeAt(0)}", { opacity: 1, duration: 0.03 }, ${t.toFixed(3)}); tl.to("#${id}-k${ch.charCodeAt(0)}", { opacity: 0, duration: 0.08 }, ${(t + 0.08).toFixed(3)});\n`;
  });
  return { id, dur, html: scene({ id, dur, bg: "#0b0d14", vignette: 0.7, extraStyle: `@font-face { font-family: "Vazirmatn"; src: url('assets/fonts/Vazirmatn-SemiBold.ttf') format('truetype'); }`,
    layers: [
      { name: "bg", blur: 18, svg: `<rect width="1080" height="1920" fill="${B.blanket}"/><rect width="1080" height="1920" fill="#0b0d14" opacity="0.5"/>` },
      { name: "phone", defs: `<linearGradient id="${id}-wall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b1f52"/><stop offset="0.6" stop-color="#1a2c5a"/><stop offset="1" stop-color="#0f1630"/></linearGradient>
          <clipPath id="${id}-scr"><rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${Y1 - Y0}" rx="58"/></clipPath>`, svg: `
        <g transform="translate(150,1700) rotate(30) scale(2.3)">${C.womanHand(`${id}-hl`, { sleeve: "sweater" })}</g>
        <g transform="translate(930,1700) rotate(-30) scale(-2.3,2.3)">${C.womanHand(`${id}-hr`, { sleeve: "sweater" })}</g>
        <rect x="200" y="290" width="680" height="1340" rx="86" fill="#0d0e12"/>
        <rect x="210" y="300" width="660" height="1320" rx="80" fill="#1a1b20"/>
        <g clip-path="url(#${id}-scr)">${lock}${chat}</g>
        <rect x="470" y="340" width="140" height="36" rx="18" fill="#050506"/>
        <g id="${id}-thL" transform="translate(380,1520)"><path d="M -40,10 C -44,-40 -30,-70 0,-70 C 30,-70 44,-40 40,10 L 60,260 L -70,260 Z" fill="${P.wSkin}" transform="rotate(22)"/><path d="M -18,-56 C -8,-62 10,-62 18,-56 L 14,-30 L -14,-30 Z" fill="#f2cdb2" transform="rotate(22)"/></g>
        <g id="${id}-thR" transform="translate(700,1500)"><path d="M -40,10 C -44,-40 -30,-70 0,-70 C 30,-70 44,-40 40,10 L 70,260 L -60,260 Z" fill="${P.wSkin}" transform="rotate(-22)"/><path d="M -18,-56 C -8,-62 10,-62 18,-56 L 14,-30 L -14,-30 Z" fill="#f2cdb2" transform="rotate(-22)"/></g>` },
    ],
    js }) };
}

export default [
  bedShot("s3", 5.4, "think"),
  s4(),
  bedShot("s5a", 4.2, "paper"),
  s5b(),
  faceCU("s5c", 3.8, "paper"),
  bedShot("s6a", 3.6, "phone"),
  s6b(),
  faceCU("s6c", 4.4, "phone"),
];
