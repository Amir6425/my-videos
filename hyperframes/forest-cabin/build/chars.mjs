// Three young friends, flat-vector style. Local coords: head centre = (0,0). Mouths are drawn once and never
// animated (nobody speaks); joy shows in the eyes, brows, nods and hands.

export const SHOULDER = 150, SY = 250, UA = 165, FA = 150; // shoulder x/y, upper arm, forearm

function eye(id, cx, cy, o) {
  const w = 28, h = 14, r = 12.5;
  const almond = `M ${-w},0 C ${-w * 0.6},${-h * 1.05} ${w * 0.6},${-h * 1.05} ${w},0 C ${w * 0.6},${h * 0.75} ${-w * 0.6},${h * 0.75} ${-w},0 Z`;
  return `<g transform="translate(${cx},${cy})"><g id="${id}">
    <clipPath id="${id}-clip"><path d="${almond}"/></clipPath>
    <path d="${almond}" fill="#f7f1ea"/>
    <g clip-path="url(#${id}-clip)"><g id="${id}-iris">
      <circle r="${r}" fill="${o.iris}"/><circle r="${r * 0.5}" fill="#120a07"/>
      <circle cx="${-r * 0.32}" cy="${-r * 0.36}" r="${r * 0.28}" fill="#fff"/></g>
      <path d="M ${-w},${-h} L ${w},${-h} L ${w},${-h * 0.2} C ${w * 0.5},${-h * 0.5} ${-w * 0.5},${-h * 0.5} ${-w},${-h * 0.2} Z" fill="#000" opacity="0.12"/>
      <path id="${id}-cheek" d="M ${-w},${h * 1.6} C ${-w * 0.5},${h * 0.9} ${w * 0.5},${h * 0.9} ${w},${h * 1.6} Z" fill="${o.skin}"/>
    </g>
    <path d="M ${-w - 2},1 C ${-w * 0.6},${-h * 1.12} ${w * 0.6},${-h * 1.12} ${w + 2},1" fill="none" stroke="#1b1210" stroke-width="4.4" stroke-linecap="round"/>
  </g>
  <path d="M ${-w * 0.8},${-h - 7} C ${-w * 0.3},${-h - 14} ${w * 0.3},${-h - 14} ${w * 0.8},${-h - 7}" fill="none" stroke="${o.deep}" stroke-width="2.2" opacity="0.6" stroke-linecap="round"/></g>`;
}

const FACE = "M -100,-96 C -106,-30 -104,40 -92,86 C -76,130 -40,154 0,156 C 40,154 76,130 92,86 C 104,40 106,-30 100,-96 C 94,-158 50,-180 0,-180 C -50,-180 -94,-158 -100,-96 Z";

function hair(kind, c) {
  if (kind === "wavy") return `
    <path d="M -112,-40 C -128,-150 -80,-214 -10,-214 C 70,-218 128,-170 116,-40 C 110,-80 96,-110 76,-124 C 60,-100 40,-96 20,-110 C 0,-90 -30,-92 -46,-110 C -70,-96 -96,-80 -112,-40 Z" fill="${c.hair}"/>
    <path d="M -100,-130 C -86,-170 -50,-196 -14,-200 C -40,-180 -50,-160 -54,-140 Z" fill="${c.hairHi}" opacity="0.8"/>
    <path d="M 20,-110 C 30,-80 24,-60 10,-50 C 40,-60 54,-84 50,-112 Z" fill="${c.hair}"/>
    ${[-90, -50, -6, 40, 84].map((x) => `<circle cx="${x}" cy="${-190 + Math.abs(x) * 0.3}" r="34" fill="${c.hair}"/>`).join("")}`;
  if (kind === "fade") return `
    <path d="M -106,-50 C -114,-150 -60,-196 0,-196 C 60,-196 114,-150 106,-50 C 100,-110 80,-140 40,-148 C 10,-136 -30,-136 -60,-146 C -86,-132 -100,-100 -106,-50 Z" fill="${c.hair}"/>
    <path d="M -90,-150 C -50,-186 40,-190 90,-150" stroke="${c.hairHi}" stroke-width="8" fill="none" opacity="0.7" stroke-linecap="round"/>
    <path d="M -104,-40 C -104,-10 -102,10 -100,24 M 104,-40 C 104,-10 102,10 100,24" stroke="${c.hair}" stroke-width="10" opacity="0.6"/>`;
  if (kind === "old") return `
    <ellipse cx="-20" cy="-150" rx="16" ry="10" fill="${c.deep}" opacity="0.35"/><ellipse cx="34" cy="-128" rx="10" ry="7" fill="${c.deep}" opacity="0.3"/>
    ${[-1, 1].map((sx) => `<path d="M ${sx * 92},-96 C ${sx * 120},-76 ${sx * 128},-30 ${sx * 122},10 C ${sx * 118},36 ${sx * 106},52 ${sx * 96},58 C ${sx * 104},30 ${sx * 106},-4 ${sx * 102},-36 C ${sx * 100},-60 ${sx * 96},-80 ${sx * 88},-92 Z" fill="${c.hair}"/>
      ${[-70, -40, -10, 20].map((y) => `<path d="M ${sx * 104},${y} q ${sx * 12},10 ${sx * 14},26" stroke="${c.hairSh || "#bdb8ae"}" stroke-width="3" fill="none" opacity="0.7"/>`).join("")}
      <path d="M ${sx * 118},-50 q ${sx * 10},-6 ${sx * 14},-16 M ${sx * 122},-10 q ${sx * 12},-2 ${sx * 16},-10" stroke="${c.hair}" stroke-width="5" fill="none" stroke-linecap="round"/>`).join("")}`;
  return `${[[-96, -110, 34], [-60, -160, 38], [-10, -184, 40], [44, -170, 38], [88, -126, 34], [-104, -60, 26], [104, -66, 26], [-30, -140, 30], [30, -136, 30]]
      .map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 3 === 2 ? c.hairHi : c.hair}"/>`).join("")}
    ${[[-70, -150], [0, -170], [60, -150], [-96, -96], [96, -100]].map(([x, y]) => `<path d="M ${x - 12},${y} a 12,12 0 1,1 24,0" stroke="${c.hairHi}" stroke-width="4" fill="none" opacity="0.7"/>`).join("")}`;
}

// The hand points along +y from the wrist (0,0); thumb on the side `ts` (+1/-1).
function hand(c, ts) {
  return `<g>
    <path d="M -24,-4 C -28,20 -26,40 -20,50 L 20,50 C 26,40 28,20 24,-4 Z" fill="${c.skin}"/>
    ${[-17, -6, 5, 16].map((x, i) => `<rect x="${x - 5.5}" y="${44}" width="11" height="${i === 0 || i === 3 ? 30 : 38}" rx="5.5" fill="${c.skin}"/>`).join("")}
    <path d="M ${ts * 20},10 C ${ts * 34},18 ${ts * 42},32 ${ts * 44},46 C ${ts * 44},54 ${ts * 36},54 ${ts * 32},46 C ${ts * 28},36 ${ts * 22},30 ${ts * 16},26 Z" fill="${c.skin}"/>
    <path d="M -14,30 C -4,36 6,36 14,30" stroke="${c.deep}" stroke-width="2" fill="none" opacity="0.5"/>
  </g>`;
}

// One arm: side -1 = screen-left, +1 = screen-right. Angles in degrees from "hanging down".
export function armT(side, a, b) {
  const sx = side * SHOULDER;
  return { u: `rotate(${a} ${sx} ${SY})`, f: `rotate(${b} ${sx} ${SY + UA})` };
}
function arm(p, c, side, a, b, prop = "") {
  const sx = side * SHOULDER, t = armT(side, a, b);
  return `<g id="${p}-arm${side < 0 ? "L" : "R"}u" transform="${t.u}">
      <path d="M ${sx - 34},${SY - 10} L ${sx + 34},${SY - 10} L ${sx + 28},${SY + UA} L ${sx - 28},${SY + UA} Z" fill="${c.skin}"/>
      <path d="M ${sx - 38},${SY - 16} L ${sx + 38},${SY - 16} L ${sx + 34},${SY + 70} L ${sx - 34},${SY + 70} Z" fill="${c.shirt}"/>
      <path d="M ${sx - 34},${SY + 64} L ${sx + 34},${SY + 64} L ${sx + 34},${SY + 72} L ${sx - 34},${SY + 72} Z" fill="${c.shirtSh}"/>
      <g id="${p}-arm${side < 0 ? "L" : "R"}f" transform="${t.f}">
        <circle cx="${sx}" cy="${SY + UA}" r="28" fill="${c.skin}"/>
        <path d="M ${sx - 28},${SY + UA} L ${sx + 28},${SY + UA} L ${sx + 22},${SY + UA + FA} L ${sx - 22},${SY + UA + FA} Z" fill="${c.skin}"/>
        <path d="M ${sx + side * 14},${SY + UA} L ${sx + side * 10},${SY + UA + FA}" stroke="${c.deep}" stroke-width="10" opacity="0.25"/>
        ${prop ? `<g transform="translate(${sx},${SY + UA + FA + 30})">${prop}</g>` : ""}
        <g transform="translate(${sx},${SY + UA + FA - 6}) scale(0.95)">${hand(c, -side)}</g>
      </g>
    </g>`;
}

// A friend: c = colours, kind = hair style, beard, grin (static open smile). arms = [[aL,bL],[aR,bR]].
export function friend(p, c, { kind = "wavy", beard = false, grin = false, mouth = "", propR = "", wrinkles = false, arms = [[10, -55], [-10, 55]] } = {}) {
  const eo = { iris: c.iris, deep: c.deep, skin: c.skin };
  return `
  <g id="${p}-torso">
    <path d="M -175,330 C -170,265 -125,232 -60,222 L 60,222 C 125,232 170,265 175,330 L 200,1300 L -200,1300 Z" fill="${c.shirt}"/>
    <path d="M -46,222 C -30,262 30,262 46,222" fill="${c.skinSh}"/>
    <path d="M -50,222 C -32,268 32,268 50,222" fill="none" stroke="${c.shirtSh}" stroke-width="10"/>
    <path d="M 120,250 C 150,330 160,520 170,760 L 130,760 C 128,540 120,360 100,260 Z" fill="${c.shirtSh}" opacity="0.7"/>
    ${c.print ? `<g transform="translate(-10,420)" opacity="0.85">${c.print}</g>` : ""}
  </g>
  ${arm(p, c, -1, arms[0][0], arms[0][1])}${arm(p, c, 1, arms[1][0], arms[1][1], propR)}
  <g id="${p}-head">
    <path d="M -38,110 L -40,236 C -20,250 20,250 40,236 L 38,110 Z" fill="${c.skinSh}"/>
    <path d="M -38,126 C -18,164 18,164 38,126 L 38,150 C 18,186 -18,186 -38,150 Z" fill="${c.deep}" opacity="0.45"/>
    <ellipse cx="-104" cy="14" rx="15" ry="26" fill="${c.skinSh}"/><ellipse cx="104" cy="14" rx="15" ry="26" fill="${c.skinSh}"/>
    <path d="${FACE}" fill="${c.skin}"/>
    <path d="M 100,-96 C 106,-30 104,40 92,86 C 76,130 40,154 0,156 C 50,140 80,96 88,40 C 94,-10 94,-60 90,-110 Z" fill="${c.skinSh}" opacity="0.55"/>
    ${beard ? `<path d="M -96,40 C -92,100 -50,150 0,152 C 50,150 92,100 96,40 C 90,80 70,104 40,110 C 20,100 -20,100 -40,110 C -70,104 -90,80 -96,40 Z" fill="${c.hair}" opacity="0.55"/>
      <path d="M -40,104 C -20,92 20,92 40,104 C 30,98 -30,98 -40,104 Z" fill="${c.hair}" opacity="0.8"/>` : ""}
    <g id="${p}-face">
      ${eye(`${p}-eyeL`, -44, 8, eo)}${eye(`${p}-eyeR`, 44, 8, eo)}
      <path id="${p}-browL" d="M -80,-28 C -64,-42 -36,-46 -14,-36 L -16,-28 C -36,-36 -62,-32 -78,-20 Z" fill="${c.hair}"/>
      <path id="${p}-browR" d="M 80,-28 C 64,-42 36,-46 14,-36 L 16,-28 C 36,-36 62,-32 78,-20 Z" fill="${c.hair}"/>
      <path d="M 6,12 C 9,32 13,48 17,60" fill="none" stroke="${c.deep}" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
      <path d="M -14,64 C -8,72 8,72 14,64" fill="none" stroke="${c.deep}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
      ${wrinkles ? `<g stroke="${c.deep}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6">
        <path d="M -56,-70 C -20,-78 20,-78 56,-70"/><path d="M -48,-56 C -16,-62 16,-62 48,-56"/><path d="M -20,-20 L -14,-34 M 20,-20 L 14,-34"/>
        <path d="M -78,10 l -14,-6 M -78,18 l -14,4 M 78,10 l 14,-6 M 78,18 l 14,4"/><path d="M -44,40 C -50,64 -48,84 -40,96 M 44,40 C 50,64 48,84 40,96"/>
        <path d="M -70,32 C -60,40 -40,42 -28,36 M 70,32 C 60,40 40,42 28,36"/></g>` : ""}
      ${mouth === "old" ? `<g id="${p}-mN"><path d="M -28,100 C -12,98 12,98 28,100" fill="none" stroke="#5a2a24" stroke-width="4.5" stroke-linecap="round"/></g>
        <g id="${p}-mC" opacity="0"><path d="M -26,100 C -8,101 12,99 24,94 C 30,90 34,86 36,82" fill="none" stroke="#5a2a24" stroke-width="4.5" stroke-linecap="round"/><path d="M 30,92 C 34,96 38,96 40,92" stroke="${c.deep}" stroke-width="2.5" fill="none" opacity="0.7"/></g>`
      : mouth === "scream" ? `<ellipse cx="0" cy="104" rx="30" ry="40" fill="#3a1212"/><path d="M -26,80 C -10,72 10,72 26,80 L 24,90 C 10,84 -10,84 -24,90 Z" fill="#fff"/><ellipse cx="0" cy="126" rx="16" ry="10" fill="#a8434a"/>`
      : mouth === "tense" ? `<path d="M -26,100 C -12,96 12,96 26,100" fill="none" stroke="#6e2c2a" stroke-width="4" stroke-linecap="round"/>`
      : grin ? `<path d="M -36,92 C -20,90 20,90 36,92 C 30,124 -30,124 -36,92 Z" fill="#5a2222"/>
        <path d="M -32,93 C -16,92 16,92 32,93 L 30,102 C 14,104 -14,104 -30,102 Z" fill="#fff"/>
        <path d="M -40,90 C -20,88 20,88 40,90" fill="none" stroke="#6e2c2a" stroke-width="3" stroke-linecap="round"/>`
             : `<path d="M -30,94 C -16,108 16,108 30,94" fill="none" stroke="#6e2c2a" stroke-width="4" stroke-linecap="round"/>
        <path d="M -16,104 C -6,110 6,110 16,104" fill="none" stroke="${c.deep}" stroke-width="3" stroke-linecap="round" opacity="0.4"/>`}
      <path d="M -40,88 C -44,84 -46,80 -44,76 M 40,88 C 44,84 46,80 44,76" stroke="${c.deep}" stroke-width="2.4" fill="none" opacity="0.5" stroke-linecap="round"/>
    </g>
    <g id="${p}-hairF">${hair(kind, c)}</g>
  </g>`;
}

export const RED = { skin: "#d9a07a", skinSh: "#c08562", deep: "#9a6246", iris: "#4a2a1a", hair: "#1c1411", hairHi: "#3a2a22", shirt: "#c43a36", shirtSh: "#9a2a28" };
export const WHITE = { skin: "#c88d66", skinSh: "#ad7452", deep: "#8a5638", iris: "#3a2214", hair: "#241812", hairHi: "#43302a", shirt: "#eceef2", shirtSh: "#c6cbd4" };
export const BLUE = { skin: "#e2b493", skinSh: "#c99676", deep: "#a3704f", iris: "#5a3a22", hair: "#5a3a26", hairHi: "#7a5236", shirt: "#2f63b8", shirtSh: "#234c8e",
  print: `<rect x="-40" y="-10" width="100" height="10" rx="5" fill="#fff" opacity="0.7"/>` };

// ── more rigs for the cabin film ─────────────────────────────────────────────────────────────────
const KINDS = { RED: "wavy", WHITE: "fade", BLUE: "curly" };
export const CAST = {
  r: { c: RED, kind: "wavy" },
  w: { c: WHITE, kind: "fade", beard: true },
  b: { c: BLUE, kind: "curly" },
};

// The back of a friend's head: hair over the skull, neck below. Head centre (0,0).
function headBack(c, kind) {
  const hairShape = kind === "curly"
    ? [[-96, -110, 38], [-60, -160, 40], [-10, -184, 42], [44, -170, 40], [88, -126, 36], [-108, -50, 34], [108, -56, 34], [-80, 20, 32], [80, 20, 32], [-30, 40, 34], [30, 40, 34], [0, -60, 70]]
        .map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 3 === 2 ? c.hairHi : c.hair}"/>`).join("")
    : `<path d="M -110,-30 C -126,-160 -70,-214 0,-214 C 70,-214 126,-160 110,-30 C 112,30 100,80 70,100 C 30,116 -30,116 -70,100 C -100,80 -112,30 -110,-30 Z" fill="${c.hair}"/>
       <path d="M -80,-170 C -30,-200 40,-200 90,-160" stroke="${c.hairHi}" stroke-width="10" fill="none" opacity="0.6" stroke-linecap="round"/>
       ${kind === "wavy" ? [-80, -40, 0, 40, 80].map((x) => `<circle cx="${x}" cy="${-186 + Math.abs(x) * 0.3}" r="34" fill="${c.hair}"/>`).join("") : ""}`;
  return `<path d="M -40,60 L -42,236 C -20,250 20,250 42,236 L 40,60 Z" fill="${c.skinSh}"/>
    <ellipse cx="-104" cy="14" rx="15" ry="26" fill="${c.skinSh}"/><ellipse cx="104" cy="14" rx="15" ry="26" fill="${c.skinSh}"/>
    <path d="M -100,-60 C -100,60 -60,130 0,130 C 60,130 100,60 100,-60 Z" fill="${c.skinSh}"/>
    ${hairShape}`;
}

// A friend seen from behind, bust. Arms hang (ids -armLu/-armLf/-armRu/-armRf like the front rig).
export function friendBack(p, who, { arms = [[6, -10], [-6, 10]] } = {}) {
  const { c, kind } = CAST[who];
  const mirror = (side, a, b) => {
    const sx = side * SHOULDER, t = armT(side, a, b);
    return `<g id="${p}-arm${side < 0 ? "L" : "R"}u" transform="${t.u}">
      <path d="M ${sx - 34},${SY - 10} L ${sx + 34},${SY - 10} L ${sx + 28},${SY + UA} L ${sx - 28},${SY + UA} Z" fill="${c.skinSh}"/>
      <path d="M ${sx - 38},${SY - 16} L ${sx + 38},${SY - 16} L ${sx + 34},${SY + 70} L ${sx - 34},${SY + 70} Z" fill="${c.shirtSh}"/>
      <g id="${p}-arm${side < 0 ? "L" : "R"}f" transform="${t.f}">
        <path d="M ${sx - 28},${SY + UA} L ${sx + 28},${SY + UA} L ${sx + 22},${SY + UA + FA} L ${sx - 22},${SY + UA + FA} Z" fill="${c.skinSh}"/>
        <ellipse cx="${sx}" cy="${SY + UA + FA + 26}" rx="26" ry="34" fill="${c.skinSh}"/>
      </g></g>`;
  };
  return `<g id="${p}-torso"><path d="M -175,330 C -170,265 -125,232 -60,222 L 60,222 C 125,232 170,265 175,330 L 200,1300 L -200,1300 Z" fill="${c.shirtSh}"/>
      <path d="M -60,222 C -30,236 30,236 60,222" stroke="${c.shirt}" stroke-width="10" fill="none"/>
      <path d="M 0,260 L 0,1300" stroke="${c.shirt}" stroke-width="4" opacity="0.4"/></g>
    ${mirror(-1, ...arms[0])}${mirror(1, ...arms[1])}
    <g id="${p}-head">${headBack(c, kind)}</g>`;
}

// Full body: the bust cut at the waist, plus jeans and sneakers. Feet at local y = 1500 (head centre 0,0).
// Legs: -legL/-legR swing at the hip (y 600). back: seen from behind.
export function friendFull(p, who, { back = false, bag = false } = {}) {
  const { c, kind, beard } = CAST[who];
  const bust = back ? friendBack(p, who) : friend(p, c, { kind, beard, arms: [[6, -10], [-6, 10]] });
  const leg = (id, x) => `<g id="${id}"><path d="M ${x - 44},600 L ${x + 44},600 L ${x + 36},1450 L ${x - 36},1450 Z" fill="#2c3650"/>
      <path d="M ${x + (x < 0 ? -44 : 30)},620 L ${x + (x < 0 ? -30 : 44)},620 L ${x + (x < 0 ? -26 : 36)},1440 L ${x + (x < 0 ? -36 : 26)},1440 Z" fill="#232b40"/>
      <path d="M ${x - 40},1440 L ${x + 40},1440 C ${x + 56},1460 ${x + 64},1480 ${x + 64},1500 L ${x - 48},1500 C ${x - 48},1480 ${x - 46},1460 ${x - 40},1440 Z" fill="#eceef2"/>
      <rect x="${x - 48}" y="1492" width="112" height="10" rx="4" fill="#9aa0ac"/></g>`;
  return `<g id="${p}-body">
    ${leg(`${p}-legL`, -60)}${leg(`${p}-legR`, 60)}
    <path d="M -110,560 L 110,560 L 120,640 L -120,640 Z" fill="#2c3650"/><rect x="-112" y="560" width="224" height="16" fill="#3a2418"/>
    <clipPath id="${p}-waist"><rect x="-400" y="-400" width="800" height="985"/></clipPath>
    <g clip-path="url(#${p}-waist)">${bust}</g>
    ${bag ? `<g id="${p}-bag">${back
      ? `<path d="M -120,280 C -120,240 120,240 120,280 L 130,560 C 130,590 -130,590 -130,560 Z" fill="#3b5d3a"/><rect x="-90" y="420" width="180" height="100" rx="18" fill="#2f4c2f"/><path d="M -60,300 L 60,300" stroke="#c9a24a" stroke-width="6"/>`
      : `<path d="M -110,250 C -70,300 -60,420 -50,560 M 110,250 C 70,300 60,420 50,560" stroke="#2f4c2f" stroke-width="22" fill="none"/>`}</g>` : ""}
  </g>`;
}

// A sedan seen from the side, facing right; local (0,0) = ground under the rear bumper, 900 long.
export function carSide(p, { body = "#34485e", hi = "#4a6178" } = {}) {
  const wheel = (cx, id) => `<g transform="translate(${cx},-58)"><circle r="60" fill="#121214"/><g id="${id}"><circle r="34" fill="#8a9098"/>
      ${[0, 72, 144, 216, 288].map((a) => `<rect x="-5" y="-32" width="10" height="28" rx="3" fill="#5d626a" transform="rotate(${a})"/>`).join("")}<circle r="9" fill="#c6cad0"/></g></g>`;
  const door = (id, x0, x1) => `<g id="${id}"><path d="M ${x0},-292 L ${x1},-292 L ${x1},-80 L ${x0},-80 Z" fill="${body}"/>
      <path d="M ${x0 + 10},-286 L ${x1 - 8},-286 L ${x1 - 8},-200 L ${x0 + 10},-200 Z" fill="#1c2633" opacity="0.9"/>
      <path d="M ${x0},-180 L ${x1},-180" stroke="${hi}" stroke-width="3"/><rect x="${x0 + 18}" y="-170" width="40" height="9" rx="4" fill="#20262e"/></g>`;
  return `<g id="${p}">
    <ellipse cx="450" cy="4" rx="470" ry="22" fill="#000" opacity="0.5"/>
    <path d="M 20,-80 C 10,-120 20,-170 60,-178 L 210,-190 C 260,-260 320,-298 420,-302 L 600,-302 C 660,-300 700,-270 750,-200 L 860,-182 C 892,-176 902,-140 898,-100 L 892,-70 L 20,-70 Z" fill="${body}"/>
    <path d="M 20,-80 L 892,-80 L 890,-60 C 890,-40 870,-36 850,-36 L 40,-36 C 26,-36 18,-44 20,-60 Z" fill="#1d2228"/>
    <path d="M 210,-190 C 240,-240 270,-272 300,-284 L 300,-200 L 200,-200 Z" fill="#1c2633"/>
    <path d="M 512,-286 L 600,-290 C 650,-288 684,-262 724,-200 L 512,-200 Z" fill="#1c2633"/>
    ${door(`${p}-dr`, 300, 505)}${door(`${p}-df`, 508, 724)}
    <path id="${p}-hl" d="M 872,-160 L 898,-152 L 896,-128 L 868,-132 Z" fill="#fff6d8"/>
    <path d="M 24,-160 L 50,-166 L 52,-136 L 22,-134 Z" fill="#d93b2e"/>
    ${wheel(190, `${p}-wb`)}${wheel(730, `${p}-wf`)}
  </g>`;
}

// The same car from behind, centred at (0,0) = ground centre, 560 wide. -lid is the trunk lid.
export function carRear(p, { body = "#34485e", hi = "#4a6178", open = false } = {}) {
  return `<g id="${p}">
    <ellipse cx="0" cy="4" rx="320" ry="26" fill="#000" opacity="0.55"/>
    <rect x="-250" y="-90" width="70" height="90" rx="14" fill="#121214"/><rect x="180" y="-90" width="70" height="90" rx="14" fill="#121214"/>
    <path d="M -280,-80 C -290,-150 -280,-200 -250,-220 L 250,-220 C 280,-200 290,-150 280,-80 Z" fill="${body}"/>
    <path d="M -200,-220 C -180,-300 -150,-330 -100,-336 L 100,-336 C 150,-330 180,-300 200,-220 Z" fill="${body}"/>
    <path d="M -170,-226 C -150,-290 -130,-314 -90,-318 L 90,-318 C 130,-314 150,-290 170,-226 Z" fill="#1c2633"/>
    <rect x="-280" y="-90" width="560" height="40" rx="10" fill="#1d2228"/>
    <rect x="-60" y="-120" width="120" height="34" rx="4" fill="#e8e6dc"/><rect x="-60" y="-120" width="18" height="34" fill="#2a50a0"/>
    <g id="${p}-tl"><path d="M -270,-190 L -190,-190 L -194,-150 L -272,-150 Z" fill="#d42a22"/><path d="M 270,-190 L 190,-190 L 194,-150 L 272,-150 Z" fill="#d42a22"/></g>
    <circle id="${p}-tlg1" cx="-232" cy="-170" r="70" fill="#ff3a2a" opacity="0.35"/><circle id="${p}-tlg2" cx="232" cy="-170" r="70" fill="#ff3a2a" opacity="0.35"/>
    <g id="${p}-trunk" opacity="${open ? 1 : 0}"><path d="M -230,-216 L 230,-216 L 250,-96 L -250,-96 Z" fill="#14181e"/><path d="M -210,-200 L 210,-200 L 226,-110 L -226,-110 Z" fill="#20262e"/></g>
    <g id="${p}-lid"><path d="M -250,-220 L 250,-220 L 262,-160 L -262,-160 Z" fill="${hi}"/></g>
  </g>`;
}

export const OLD = { skin: "#c48e70", skinSh: "#a3705a", deep: "#6e4232", iris: "#2e2018", hair: "#e4e0d8", hairHi: "#ffffff", shirt: "#4a3a2e", shirtSh: "#3a2c22" };
CAST.o = { c: OLD, kind: "old", beard: true };
