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
function arm(p, c, side, a, b) {
  const sx = side * SHOULDER, t = armT(side, a, b);
  return `<g id="${p}-arm${side < 0 ? "L" : "R"}u" transform="${t.u}">
      <path d="M ${sx - 34},${SY - 10} L ${sx + 34},${SY - 10} L ${sx + 28},${SY + UA} L ${sx - 28},${SY + UA} Z" fill="${c.skin}"/>
      <path d="M ${sx - 38},${SY - 16} L ${sx + 38},${SY - 16} L ${sx + 34},${SY + 70} L ${sx - 34},${SY + 70} Z" fill="${c.shirt}"/>
      <path d="M ${sx - 34},${SY + 64} L ${sx + 34},${SY + 64} L ${sx + 34},${SY + 72} L ${sx - 34},${SY + 72} Z" fill="${c.shirtSh}"/>
      <g id="${p}-arm${side < 0 ? "L" : "R"}f" transform="${t.f}">
        <circle cx="${sx}" cy="${SY + UA}" r="28" fill="${c.skin}"/>
        <path d="M ${sx - 28},${SY + UA} L ${sx + 28},${SY + UA} L ${sx + 22},${SY + UA + FA} L ${sx - 22},${SY + UA + FA} Z" fill="${c.skin}"/>
        <path d="M ${sx + side * 14},${SY + UA} L ${sx + side * 10},${SY + UA + FA}" stroke="${c.deep}" stroke-width="10" opacity="0.25"/>
        <g transform="translate(${sx},${SY + UA + FA - 6}) scale(0.95)">${hand(c, -side)}</g>
      </g>
    </g>`;
}

// A friend: c = colours, kind = hair style, beard, grin (static open smile). arms = [[aL,bL],[aR,bR]].
export function friend(p, c, { kind = "wavy", beard = false, grin = false, arms = [[10, -55], [-10, 55]] } = {}) {
  const eo = { iris: c.iris, deep: c.deep, skin: c.skin };
  return `
  <g id="${p}-torso">
    <path d="M -175,330 C -170,265 -125,232 -60,222 L 60,222 C 125,232 170,265 175,330 L 200,1300 L -200,1300 Z" fill="${c.shirt}"/>
    <path d="M -46,222 C -30,262 30,262 46,222" fill="${c.skinSh}"/>
    <path d="M -50,222 C -32,268 32,268 50,222" fill="none" stroke="${c.shirtSh}" stroke-width="10"/>
    <path d="M 120,250 C 150,330 160,520 170,760 L 130,760 C 128,540 120,360 100,260 Z" fill="${c.shirtSh}" opacity="0.7"/>
    ${c.print ? `<g transform="translate(-10,420)" opacity="0.85">${c.print}</g>` : ""}
  </g>
  ${arm(p, c, -1, arms[0][0], arms[0][1])}${arm(p, c, 1, arms[1][0], arms[1][1])}
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
      ${grin ? `<path d="M -36,92 C -20,90 20,90 36,92 C 30,124 -30,124 -36,92 Z" fill="#5a2222"/>
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
