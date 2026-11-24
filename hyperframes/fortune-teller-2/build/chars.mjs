// The two characters from the reference images, drawn as SVG rigs. Local coords: head centre = (0,0).
// The mouths are drawn once and never animated: the characters do not speak.

export const PAL = {
  // the girl
  skin: "#efb48e", skinSh: "#d98e6c", skinDeep: "#bf6f52", skinHi: "#f8cfaa", blush: "#e9776a",
  hair: "#ef5a1c", hairHi: "#ff8a3d", hairSh: "#bb3a12", hairDeep: "#8e2a0e",
  liner: "#160c0a", iris: "#a0602c", irisDk: "#5e3214", brow: "#6b2a16", lip: "#a8343a", lipLo: "#c4474a",
  dress: "#9c1c22", dressSh: "#741318", dressHi: "#b72a2c",
  // the old man
  mSkin: "#bd7c52", mSkinSh: "#a0603e", mSkinHi: "#d29468", mSkinDeep: "#7f4428",
  turban: "#ad231e", turbanSh: "#7e1612", turbanHi: "#cf3b2c", white: "#efe9e0", whiteSh: "#c9c1b6", whiteDk: "#a59c92",
  robe: "#e4d0ae", robeSh: "#c2aa86", vest: "#4b2a1c", vestSh: "#341c12", shawl: "#a01e1c", shawlSh: "#741512",
  bead: "#5a2c18", beadHi: "#8a4a2a", ring: "#3a1838", gold: "#c99a4a",
};
const P = PAL;

// ── the girl ───────────────────────────────────────────────────────────────────────────────────
// Her eye: big almond with a heavy black liner and a long wing, amber iris. side: -1 screen-left, +1 screen-right.
function girlEye(id, cx, cy, side) {
  const s = side, w = 33, h = 17;
  const almond = `M ${-w},${2} C ${-w * 0.55},${-h * 1.15} ${w * 0.5},${-h * 1.2} ${w},${-4} C ${w * 0.55},${h * 0.8} ${-w * 0.55},${h * 0.85} ${-w},${2} Z`;
  // mirror so the outer corner points outward
  const mir = s < 0 ? "scale(-1,1)" : "";
  return `
  <g transform="translate(${cx},${cy}) ${mir}">
    <path d="M ${-w - 4},${-6} C ${-w * 0.5},${-h * 2.1} ${w * 0.6},${-h * 2.2} ${w + 12},${-h * 0.9} C ${w * 0.5},${-h * 1.5} ${-w * 0.5},${-h * 1.5} ${-w - 4},${-6} Z" fill="#7a3a2a" opacity="0.45"/>
    <g id="${id}">
      <clipPath id="${id}-clip"><path d="${almond}"/></clipPath>
      <path d="${almond}" fill="#fbf1e6"/>
      <g clip-path="url(#${id}-clip)">
        <g id="${id}-iris">
          <circle r="15.5" fill="${P.iris}"/>
          <circle r="15.5" fill="none" stroke="${P.irisDk}" stroke-width="2.4"/>
          <path d="M -12,-4 A 13,13 0 0,1 12,-4 L 0,0 Z" fill="${P.irisDk}" opacity="0.45"/>
          <circle r="7" fill="#120806"/>
          <circle cx="-5" cy="-6" r="4.2" fill="#fff"/>
          <circle cx="6" cy="5" r="1.8" fill="#fff" opacity="0.7"/>
        </g>
        <path d="M ${-w},${-h} L ${w},${-h} L ${w},${-2} C ${w * 0.4},${-h * 0.7} ${-w * 0.4},${-h * 0.7} ${-w},${-2} Z" fill="#5a2a1a" opacity="0.22"/>
      </g>
      <path d="M ${-w - 3},${3} C ${-w * 0.55},${-h * 1.25} ${w * 0.5},${-h * 1.32} ${w + 2},${-5} L ${w + 26},${-h * 1.3} L ${w + 4},${2} C ${w * 0.5},${-h * 0.95} ${-w * 0.5},${-h * 0.85} ${-w - 3},${3} Z" fill="${P.liner}"/>
      <path d="M ${-w * 0.4},${h * 0.72} C ${0},${h * 0.95} ${w * 0.5},${h * 0.8} ${w},${-2}" fill="none" stroke="${P.liner}" stroke-width="2" opacity="0.55"/>
    </g>
    <path d="M ${-w * 0.7},${-h - 12} C ${-w * 0.2},${-h - 22} ${w * 0.4},${-h - 22} ${w * 0.95},${-h - 9}" fill="none" stroke="${P.skinDeep}" stroke-width="2.4" opacity="0.6"/>
  </g>`;
}

const G_FACE = "M -100,-112 C -110,-40 -106,30 -86,80 C -64,128 -28,160 0,166 C 28,160 64,128 86,80 C 106,30 110,-40 100,-112 C 92,-172 50,-198 0,-198 C -50,-198 -92,-172 -100,-112 Z";

// Parts: -head, -face, -eyeL/-eyeR (+ -iris), -browL/-browR, -hairF, -hairB.
export function girlHead(p, { freckles = false } = {}) {
  return `
  <g id="${p}-head">
    <g id="${p}-hairB">
      <path d="M -150,-60 C -176,-230 176,-230 150,-60 C 156,20 170,90 196,150 C 160,176 110,178 70,166 L -70,166 C -110,178 -160,176 -196,150 C -170,90 -156,20 -150,-60 Z" fill="${P.hairSh}"/>
      <path d="M -196,150 C -150,140 -120,150 -90,166 M 196,150 C 150,140 120,150 90,166" stroke="${P.hairDeep}" stroke-width="5" fill="none"/>
    </g>
    <path d="M -34,120 L -36,300 C -14,316 14,316 36,300 L 34,120 Z" fill="${P.skinSh}"/>
    <path d="M -34,132 C -14,176 14,176 34,132 L 34,166 C 14,200 -14,200 -34,166 Z" fill="${P.skinDeep}" opacity="0.55"/>
    <ellipse cx="-102" cy="14" rx="13" ry="24" fill="${P.skinSh}"/><ellipse cx="102" cy="14" rx="13" ry="24" fill="${P.skinSh}"/>
    <path d="${G_FACE}" fill="${P.skin}"/>
    <path d="M 100,-112 C 110,-40 106,30 86,80 C 64,128 28,160 0,166 C 46,150 76,100 86,40 C 92,-10 92,-70 86,-130 Z" fill="${P.skinSh}" opacity="0.65"/>
    <path d="M -96,-60 C -100,0 -96,50 -80,86 C -86,40 -88,-10 -84,-70 Z" fill="${P.skinHi}" opacity="0.5"/>
    <ellipse cx="-58" cy="62" rx="28" ry="16" fill="${P.blush}" opacity="0.32"/><ellipse cx="58" cy="62" rx="28" ry="16" fill="${P.blush}" opacity="0.32"/>
    ${freckles ? [[-70, 50], [-56, 58], [-44, 48], [-62, 66], [-36, 60], [70, 50], [56, 58], [44, 48], [62, 66], [36, 60], [-8, 46], [8, 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#b8643e" opacity="0.6"/>`).join("") : ""}
    <g id="${p}-face">
      <g transform="translate(-56,8) scale(1.08) translate(56,-8)">${girlEye(`${p}-eyeL`, -56, 8, -1)}</g>
      <g transform="translate(56,8) scale(1.08) translate(-56,-8)">${girlEye(`${p}-eyeR`, 56, 8, 1)}</g>
      <path id="${p}-browL" d="M -96,-30 C -80,-52 -48,-58 -22,-48 C -48,-50 -74,-44 -94,-24 Z" fill="${P.brow}"/>
      <path id="${p}-browR" d="M 96,-30 C 80,-52 48,-58 22,-48 C 48,-50 74,-44 94,-24 Z" fill="${P.brow}"/>
      <path d="M 4,14 C 8,34 12,50 16,64" fill="none" stroke="${P.skinDeep}" stroke-width="2.6" stroke-linecap="round" opacity="0.5"/>
      <path d="M -12,70 C -6,78 6,78 12,70" fill="none" stroke="${P.skinDeep}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
      <ellipse cx="0" cy="62" rx="10" ry="6" fill="${P.skinHi}" opacity="0.55"/>
      <g transform="translate(0,110)">
        <path d="M -30,0 C -18,-10 -8,-12 0,-6 C 8,-12 18,-10 30,0 C 16,4 -16,4 -30,0 Z" fill="${P.lip}"/>
        <path d="M -28,1 C -14,22 14,22 28,1 C 14,6 -14,6 -28,1 Z" fill="${P.lipLo}"/>
        <path d="M -12,10 C -4,14 6,14 12,10" stroke="#e98a84" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
        <path d="M -32,0 C -14,3 14,3 32,0" fill="none" stroke="#5e1a1e" stroke-width="2.4" stroke-linecap="round"/>
      </g>
    </g>
    <g id="${p}-hairF">
      <path d="M -150,-50 C -170,-200 -40,-238 30,-220 C 120,-200 176,-120 150,-30 C 156,40 164,100 184,150 C 150,130 130,100 118,60 C 110,0 110,-60 96,-110 C 70,-150 20,-160 -30,-140 C -60,-110 -90,-60 -102,0 C -106,40 -112,90 -130,140 C -150,110 -156,40 -150,-50 Z" fill="${P.hair}"/>
      <path d="M -120,-140 C -60,-200 40,-212 110,-170" stroke="${P.hairHi}" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.85"/>
      <path d="M -140,-60 C -150,0 -146,60 -130,120" stroke="${P.hairHi}" stroke-width="6" fill="none" opacity="0.6"/>
      <path d="M 140,-60 C 146,0 150,60 170,130" stroke="${P.hairDeep}" stroke-width="6" fill="none" opacity="0.5"/>
      <path d="M 120,-150 C 170,-120 186,-60 172,0" stroke="${P.hairHi}" stroke-width="3" fill="none" opacity="0.7"/>
      <path d="M -40,-150 C 10,-170 60,-160 96,-110" stroke="${P.hairSh}" stroke-width="4" fill="none" opacity="0.6"/>
      <path d="M 150,-100 C 190,-90 210,-60 214,-30 M -150,-80 C -184,-60 -196,-20 -194,10 M 30,-222 C 60,-250 100,-246 120,-232" stroke="${P.hair}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </g>
  </g>`;
}

// Seated, hands pressed together in front of her chest, forearms resting on the table edge.
// Parts: -body, -hands (-thumbA/-thumbB/-knuck) for the squeeze, -shoulders.
export function girlBody(p, { coat = false } = {}) {
  return `
  <defs><pattern id="${p}-dam" width="46" height="46" patternUnits="userSpaceOnUse">
    <path d="M 23,6 C 30,14 30,20 23,26 C 16,20 16,14 23,6 Z M 23,26 C 30,32 36,32 40,40 C 32,40 26,36 23,30 C 20,36 14,40 6,40 C 10,32 16,32 23,26 Z" fill="${P.dressSh}" opacity="0.55"/>
  </pattern></defs>
  <g transform="translate(0,-55)"><g id="${p}-body">
    <path d="M -150,330 C -150,300 -110,286 -56,282 L 56,282 C 110,286 150,300 150,330 L 160,760 L -160,760 Z" fill="${P.dress}"/>
    <path d="M -150,330 C -150,300 -110,286 -56,282 L 56,282 C 110,286 150,300 150,330 L 160,760 L -160,760 Z" fill="url(#${p}-dam)"/>
    <path d="M -56,282 C -40,330 40,330 56,282 L 66,286 C 46,342 -46,342 -66,286 Z" fill="${P.dressSh}"/>
    <path d="M -50,284 C -30,324 30,324 50,284" fill="${P.skinSh}"/>
    <path d="M -20,300 C -10,306 10,306 20,300" stroke="${P.skinDeep}" stroke-width="2" fill="none" opacity="0.6"/>
    <path d="M 110,300 C 140,340 150,500 150,760 L 120,760 C 126,520 120,380 100,300 Z" fill="${P.dressSh}" opacity="0.7"/>
  </g>
  ${coat ? `<g transform="translate(0,-55)"><path d="M -150,330 C -150,296 -120,280 -70,276 L -40,760 L -175,760 C -180,600 -176,420 -150,330 Z" fill="#8e1a1e"/>
    <path d="M 150,330 C 150,296 120,280 70,276 L 40,760 L 175,760 C 180,600 176,420 150,330 Z" fill="#7a1418"/>
    <path d="M -70,276 L -30,340 L -60,420 Z" fill="#a8262a"/><path d="M 70,276 L 30,340 L 60,420 Z" fill="#a8262a"/></g>` : ""}
  <g id="${p}-arms">
    <path d="M -150,318 C -186,330 -200,380 -200,450 L -196,600 C -190,640 -166,654 -140,650 L -150,460 Z" fill="${P.skin}"/>
    <path d="M -150,318 C -176,326 -186,350 -190,390 C -176,370 -160,360 -146,358 Z" fill="${P.skinSh}" opacity="0.6"/>
    <path d="M 150,318 C 186,330 200,380 200,450 L 196,600 C 190,640 166,654 140,650 L 150,460 Z" fill="${P.skinSh}"/>
    ${coat ? `<path d="M -150,318 C -190,330 -206,380 -206,450 L -200,606 C -192,646 -166,660 -140,656 L -150,460 Z" fill="#8e1a1e"/><path d="M 150,318 C 190,330 206,380 206,450 L 200,606 C 192,646 166,660 140,656 L 150,460 Z" fill="#7a1418"/>` : ""}
    <path d="M -196,596 C -150,610 -80,590 -40,560 L -30,600 C -80,640 -150,660 -190,646 Z" fill="${coat ? "#8e1a1e" : P.skin}"/>
    <path d="M 196,596 C 150,610 80,590 40,560 L 30,600 C 80,640 150,660 190,646 Z" fill="${coat ? "#7a1418" : P.skinSh}"/>
    <g transform="translate(0,560)"><g id="${p}-hands">
      <path d="M -62,10 C -66,-30 -50,-56 -20,-60 L 20,-60 C 50,-56 66,-30 62,10 C 58,40 30,56 0,56 C -30,56 -58,40 -62,10 Z" fill="${P.skin}"/>
      <g id="${p}-knuck">
        ${[-44, -22, 0, 22, 44].map((x, i) => `<ellipse cx="${x}" cy="${-46 + Math.abs(x) * 0.2}" rx="12" ry="16" fill="${i % 2 ? P.skinSh : P.skin}"/>`).join("")}
        ${[-33, -11, 11, 33].map((x) => `<path d="M ${x},-60 L ${x},-24" stroke="${P.skinDeep}" stroke-width="2.4" opacity="0.6"/>`).join("")}
      </g>
      <path d="M -54,20 C -30,36 30,36 54,20" stroke="${P.skinDeep}" stroke-width="2.4" fill="none" opacity="0.5"/>
      <g id="${p}-thumbA"><path d="M -8,-4 C -12,-30 -2,-50 10,-52 C 20,-52 22,-36 16,-4 Z" fill="${P.skinHi}"/><ellipse cx="11" cy="-44" rx="5" ry="6" fill="#f6d2c0"/></g>
      <g id="${p}-thumbB"><path d="M -22,0 C -26,-26 -18,-46 -6,-48 C 4,-48 6,-30 2,0 Z" fill="${P.skin}"/><ellipse cx="-6" cy="-40" rx="5" ry="6" fill="#f6d2c0"/></g>
    </g></g>
  </g></g>`;
}

// The back of her head and a bare shoulder (over-the-shoulder shots of him).
export function girlBack(p) {
  return `<g id="${p}-back">
    <path d="M -230,420 C -220,330 -150,300 -60,290 L 60,290 C 150,300 220,330 230,420 L 250,900 L -250,900 Z" fill="${P.dress}"/>
    <path d="M 120,300 C 190,310 230,350 236,420 L 250,900 L 170,900 C 176,600 160,420 120,300 Z" fill="${P.skin}"/>
    <path d="M -34,180 L -36,300 C -14,316 14,316 36,300 L 34,180 Z" fill="${P.skinSh}"/>
    <path d="M -160,-60 C -186,-240 186,-240 160,-60 C 166,30 176,110 200,170 C 120,200 -120,200 -200,170 C -176,110 -166,30 -160,-60 Z" fill="${P.hair}"/>
    <path d="M -100,-180 C -40,-220 60,-216 120,-170" stroke="${P.hairHi}" stroke-width="14" fill="none" stroke-linecap="round" opacity="0.8"/>
    ${[-120, -70, -20, 30, 80, 130].map((x) => `<path d="M ${x},-150 C ${x + 10},-40 ${x - 6},80 ${x + 4},180" stroke="${P.hairSh}" stroke-width="4" fill="none" opacity="0.55"/>`).join("")}
  </g>`;
}

// ── the old fortune teller ─────────────────────────────────────────────────────────────────────
// Parts: -head, -face, -eyeL/-eyeR (+ -iris, -lid), -browL/-browR. No mouth is drawn (the moustache hides it).
function manEye(id, cx, cy, side) {
  const s = side, w = 30, h = 12;
  const almond = `M ${-w},2 C ${-w * 0.5},${-h * 1.1} ${w * 0.5},${-h * 1.1} ${w},2 C ${w * 0.5},${h * 0.8} ${-w * 0.5},${h * 0.8} ${-w},2 Z`;
  return `
  <g transform="translate(${cx},${cy}) ${s < 0 ? "scale(-1,1)" : ""}">
    <path d="M ${-w - 10},${-4} C ${-w * 0.4},${-h * 3.2} ${w * 0.6},${-h * 3.2} ${w + 12},${-2} Z" fill="${P.mSkinDeep}" opacity="0.45"/>
    <path d="M ${-w},${h * 0.6} C ${-w * 0.3},${h * 2.4} ${w * 0.5},${h * 2.4} ${w + 4},${h * 0.2}" fill="none" stroke="${P.mSkinDeep}" stroke-width="3" opacity="0.6"/>
    <path d="M ${-w * 0.6},${h * 2.2} C ${0},${h * 3.2} ${w * 0.5},${h * 2.8} ${w * 0.9},${h * 1.8}" fill="none" stroke="${P.mSkinDeep}" stroke-width="2" opacity="0.45"/>
    <g id="${id}">
      <clipPath id="${id}-clip"><path d="${almond}"/></clipPath>
      <path d="${almond}" fill="#efe2d0"/>
      <g clip-path="url(#${id}-clip)">
        <g id="${id}-iris"><circle cx="-2" cy="2" r="11" fill="#4a2a18"/><circle cx="-2" cy="2" r="5.5" fill="#100806"/><circle cx="-5" cy="-1" r="2.5" fill="#fff" opacity="0.8"/></g>
        <path id="${id}-lid" d="M ${-w},${-h * 1.2} L ${w},${-h * 1.2} L ${w},${1} C ${w * 0.4},${-2} ${-w * 0.4},${-2} ${-w},${1} Z" fill="${P.mSkinSh}"/>
      </g>
      <path d="M ${-w - 2},${2} C ${-w * 0.4},${-1} ${w * 0.4},${-1} ${w + 2},${2}" fill="none" stroke="#2a140c" stroke-width="3.6" stroke-linecap="round"/>
    </g>
  </g>`;
}

export function manHead(p, { gem = false } = {}) {
  const beardStrands = [...Array(26)].map((_, i) => {
    const x = -120 + i * 9.6;
    const top = 120 + Math.abs(x) * 0.25, bot = 560 - Math.abs(x) * 1.6 - (i % 3) * 14;
    return `<path d="M ${x},${top} C ${x + 6},${(top + bot) / 2} ${x * 0.8 - 4},${bot - 40} ${x * 0.5},${bot}" stroke="${i % 3 === 0 ? P.whiteDk : i % 3 === 1 ? "#fff" : P.whiteSh}" stroke-width="${2 + (i % 2)}" fill="none" stroke-linecap="round" opacity="0.85"/>`;
  }).join("");
  const wild = (sx) => {
    const puffs = [[118, -70, 26], [140, -40, 30], [150, -6, 32], [146, 30, 30], [132, 62, 26], [166, -50, 20], [176, 6, 22], [168, 50, 18]];
    return puffs.map(([x, y, r], i) => `<circle cx="${sx * x}" cy="${y}" r="${r}" fill="${i % 3 === 2 ? P.whiteSh : P.white}"/>`).join("") +
      [...Array(5)].map((_, i) => `<path d="M ${sx * 150},${-50 + i * 26} q ${sx * 30},${-6} ${sx * 46},${8}" stroke="${P.whiteDk}" stroke-width="2.4" fill="none" opacity="0.7"/>`).join("");
  };
  return `
  <g id="${p}-head">
    <path d="M -54,160 L -56,330 L 56,330 L 54,160 Z" fill="${P.mSkinSh}"/>
    <path d="M -118,-70 C -132,0 -130,60 -120,90 C -150,60 -170,0 -160,-60 Z" fill="${P.white}"/>
    <path d="M 118,-70 C 132,0 130,60 120,90 C 150,60 170,0 160,-60 Z" fill="${P.white}"/>
    ${wild(-1)}${wild(1)}
    <ellipse cx="-114" cy="10" rx="16" ry="34" fill="${P.mSkinSh}"/><ellipse cx="114" cy="10" rx="16" ry="34" fill="${P.mSkinSh}"/>
    <path d="M -104,-110 C -116,-30 -112,50 -94,110 C -76,160 -40,190 0,194 C 40,190 76,160 94,110 C 112,50 116,-30 104,-110 Z" fill="${P.mSkin}"/>
    <path d="M 104,-110 C 116,-30 112,50 94,110 C 76,160 40,190 0,194 C 50,170 80,110 86,30 C 90,-30 88,-80 80,-120 Z" fill="${P.mSkinSh}" opacity="0.7"/>
    <path d="M -84,40 C -76,80 -60,110 -44,124" stroke="${P.mSkinDeep}" stroke-width="3" fill="none" opacity="0.5"/>
    <path d="M 84,40 C 76,80 60,110 44,124" stroke="${P.mSkinDeep}" stroke-width="3" fill="none" opacity="0.5"/>
    <g opacity="0.5" stroke="${P.mSkinDeep}" stroke-width="2.6" fill="none" stroke-linecap="round">
      <path d="M -60,-82 C -20,-90 20,-90 60,-82"/><path d="M -66,-64 C -24,-72 24,-72 66,-64"/><path d="M -20,-48 C -8,-40 8,-40 20,-48"/>
    </g>
    <g id="${p}-face">
      ${manEye(`${p}-eyeL`, -44, -4, -1)}
      ${manEye(`${p}-eyeR`, 44, -4, 1)}
      <path id="${p}-browL" d="M -96,-28 C -80,-46 -46,-50 -14,-34 C -30,-30 -40,-24 -56,-26 C -70,-26 -84,-22 -100,-12 Z" fill="${P.white}"/>
      <path id="${p}-browR" d="M 96,-28 C 80,-46 46,-50 14,-34 C 30,-30 40,-24 56,-26 C 70,-26 84,-22 100,-12 Z" fill="${P.white}"/>
      <path d="M -100,-20 l -14,-6 M 100,-20 l 14,-6" stroke="${P.white}" stroke-width="4" stroke-linecap="round"/>
      <path d="M -10,-14 C -14,20 -22,50 -26,72 C -18,86 18,86 26,72 C 22,50 14,20 10,-14 Z" fill="${P.mSkinSh}" opacity="0.6"/>
      <path d="M -8,-10 C -10,20 -14,44 -18,64" stroke="${P.mSkinHi}" stroke-width="5" fill="none" opacity="0.6" stroke-linecap="round"/>
      <ellipse cx="0" cy="76" rx="24" ry="17" fill="${P.mSkinDeep}" opacity="0.55"/>
      <path d="M -22,80 C -14,90 -6,90 -4,84 M 22,80 C 14,90 6,90 4,84" stroke="${P.mSkinDeep}" stroke-width="3" fill="none"/>
    </g>
    <path d="M -110,50 C -116,150 -90,300 -50,440 C -30,520 -10,580 0,600 C 10,580 30,520 50,440 C 90,300 116,150 110,50 C 96,90 70,110 40,112 L -40,112 C -70,110 -96,90 -110,50 Z" fill="${P.white}"/>
    <path d="M 110,50 C 116,150 90,300 50,440 C 30,520 10,580 0,600 C 30,500 60,330 70,160 Z" fill="${P.whiteSh}" opacity="0.7"/>
    ${beardStrands}
    <path d="M -2,96 C -30,88 -70,92 -100,120 C -116,134 -126,150 -128,170 C -110,150 -84,140 -60,138 C -30,136 -12,124 -2,112 C 12,124 30,136 60,138 C 84,140 110,150 128,170 C 126,150 116,134 100,120 C 70,92 30,88 2,96 Z" fill="#fbf8f2"/>
    <path d="M -90,128 C -60,116 -30,116 -8,108 M 90,128 C 60,116 30,116 8,108" stroke="${P.whiteSh}" stroke-width="3" fill="none"/>
    <g id="${p}-turban">
      <path d="M -150,-80 C -190,-200 -120,-330 0,-336 C 120,-330 190,-200 150,-80 C 120,-110 60,-124 0,-124 C -60,-124 -120,-110 -150,-80 Z" fill="${P.turban}"/>
      <path d="M -150,-80 C -120,-110 -60,-124 0,-124 C 60,-124 120,-110 150,-80 L 144,-60 C 110,-92 60,-104 0,-104 C -60,-104 -110,-92 -144,-60 Z" fill="${P.turbanSh}"/>
      <path d="M -160,-130 C -80,-200 60,-250 170,-180 C 150,-160 70,-210 -10,-180 C -80,-160 -130,-120 -150,-100 Z" fill="${P.turbanHi}" opacity="0.8"/>
      <path d="M -170,-170 C -90,-250 70,-300 160,-240 C 120,-246 40,-266 -40,-232 C -100,-208 -140,-180 -162,-150 Z" fill="${P.turbanSh}" opacity="0.7"/>
      <path d="M -120,-250 C -40,-320 60,-330 120,-280 C 60,-300 -20,-296 -100,-230 Z" fill="${P.turbanHi}" opacity="0.7"/>
      <path d="M -150,-96 C -60,-170 70,-190 156,-120" stroke="${P.turbanSh}" stroke-width="6" fill="none"/>
      ${gem ? `<path d="M 0,-170 L 22,-146 L 0,-118 L -22,-146 Z" fill="#c9a24a"/><path d="M 0,-160 L 13,-146 L 0,-128 L -13,-146 Z" fill="#2a8a6a"/><circle cx="-4" cy="-150" r="3" fill="#fff" opacity="0.8"/>` : ""}
      ${[...Array(30)].map((_, i) => `<circle cx="${-130 + (i % 10) * 28 + (Math.floor(i / 10) % 2) * 14}" cy="${-150 - Math.floor(i / 10) * 50 + (i % 10) * 3}" r="3" fill="#e2603e" opacity="0.5"/>`).join("")}
    </g>
  </g>`;
}

// Seated behind the table, hands clasped on it. Parts: -body, -beads, -hands, -thumbs.
export function manBody(p) {
  const beads = [];
  for (let i = 0; i <= 26; i++) {
    const t = i / 26, a = Math.PI * (0.08 + t * 0.84);
    const x = -Math.cos(a) * 150, y = 330 + Math.sin(a) * 520;
    beads.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="15" fill="${P.bead}"/><circle cx="${(x - 4).toFixed(1)}" cy="${(y - 5).toFixed(1)}" r="5" fill="${P.beadHi}"/>`);
  }
  return `
  <defs><pattern id="${p}-shp" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 20,4 L 36,20 L 20,36 L 4,20 Z" fill="none" stroke="#c8402c" stroke-width="2" opacity="0.5"/><circle cx="20" cy="20" r="3" fill="#c8402c" opacity="0.5"/></pattern></defs>
  <g id="${p}-body">
    <path d="M -270,460 C -260,370 -190,330 -80,320 L 80,320 C 190,330 260,370 270,460 L 300,1100 L -300,1100 Z" fill="${P.robe}"/>
    <path d="M -270,460 C -250,600 -260,800 -300,1100 L -230,1100 C -210,800 -220,600 -236,470 Z" fill="${P.robeSh}" opacity="0.7"/>
    <path d="M -200,350 C -150,330 -110,326 -80,324 L -60,1100 L -200,1100 C -190,800 -190,560 -200,350 Z" fill="${P.vest}"/>
    <path d="M 200,350 C 150,330 110,326 80,324 L 60,1100 L 200,1100 C 190,800 190,560 200,350 Z" fill="${P.vest}"/>
    <path d="M -80,324 C -40,360 40,360 80,324 L 70,420 C 40,440 -40,440 -70,420 Z" fill="${P.robeSh}"/>
    <path d="M 110,320 C 200,330 250,380 260,460 L 240,1100 L 120,1100 C 140,800 150,560 110,320 Z" fill="${P.shawl}"/>
    <path d="M 110,320 C 200,330 250,380 260,460 L 240,1100 L 120,1100 C 140,800 150,560 110,320 Z" fill="url(#${p}-shp)"/>
    <path d="M 150,340 C 180,500 186,700 176,1100" stroke="${P.shawlSh}" stroke-width="8" fill="none" opacity="0.7"/>
  </g>
  <g id="${p}-beads">${beads.join("")}</g>
  <g id="${p}-hands" transform="translate(0,920)">
    <path d="M -260,-80 C -200,-60 -130,-30 -80,-10 L -90,40 C -150,30 -220,10 -270,-10 Z" fill="${P.robe}"/>
    <path d="M 260,-80 C 200,-60 130,-30 80,-10 L 90,40 C 150,30 220,10 270,-10 Z" fill="${P.robeSh}"/>
    <path d="M -100,-30 C -60,-60 60,-60 100,-30 C 110,0 90,40 60,48 L -60,48 C -90,40 -110,0 -100,-30 Z" fill="${P.mSkin}"/>
    ${[-60, -30, 0, 30, 60].map((x, i) => `<path d="M ${x - 14},-30 C ${x - 14},-50 ${x + 14},-50 ${x + 14},-30 L ${x + 12},20 L ${x - 12},20 Z" fill="${i % 2 ? P.mSkinSh : P.mSkin}"/>`).join("")}
    ${[-45, -15, 15, 45].map((x) => `<path d="M ${x},-40 L ${x},20" stroke="${P.mSkinDeep}" stroke-width="2.4" opacity="0.6"/>`).join("")}
    <g id="${p}-thumbs"><path d="M -40,-34 C -30,-70 -6,-74 4,-60 L 0,-30 Z" fill="${P.mSkinHi}"/><path d="M 40,-34 C 30,-66 10,-70 2,-58 L 4,-30 Z" fill="${P.mSkin}"/></g>
    <g transform="translate(42,-6)"><rect x="-14" y="-8" width="28" height="16" rx="6" fill="${P.gold}"/><ellipse cx="0" cy="-4" rx="11" ry="9" fill="${P.ring}"/><ellipse cx="-3" cy="-7" rx="3" ry="2" fill="#a07ab0" opacity="0.8"/></g>
    <path d="M -80,30 C -40,40 40,40 80,30" stroke="${P.mSkinDeep}" stroke-width="3" fill="none" opacity="0.5"/>
  </g>`;
}

// Foreground: the blurred side of his turban, white hair and shoulder (over-the-shoulder shots of her).
export function manBackSide(p) {
  return `<g id="${p}-side">
    <path d="M -140,-60 C -180,-240 120,-300 200,-160 C 240,-80 220,40 160,80 Z" fill="${P.turban}"/>
    <path d="M -150,-120 C -60,-200 80,-220 190,-150" stroke="${P.turbanHi}" stroke-width="22" fill="none" opacity="0.6"/>
    <path d="M -130,-20 C -150,80 -120,240 -60,400 C 0,480 120,460 160,360 L 170,60 Z" fill="${P.white}"/>
    ${[...Array(9)].map((_, i) => `<path d="M ${-110 + i * 26},40 C ${-100 + i * 26},200 ${-80 + i * 24},320 ${-40 + i * 20},420" stroke="${P.whiteSh}" stroke-width="5" fill="none" opacity="0.6"/>`).join("")}
    <path d="M -60,380 C -20,340 60,330 140,340 L 260,420 L 260,1200 L -140,1200 C -160,900 -120,560 -60,380 Z" fill="${P.vest}"/>
    <path d="M 40,360 C 120,350 200,380 260,420 L 260,1200 L 120,1200 C 140,900 120,560 40,360 Z" fill="${P.shawl}"/>
    <path d="M -140,700 C -100,640 -40,620 20,640 L 0,1200 L -160,1200 Z" fill="${P.robe}"/>
  </g>`;
}
