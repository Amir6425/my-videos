// Character rigs, drawn as inline SVG. Every part a scene animates has its own id, prefixed per mount
// (p = prefix), so one scene can hold several copies. Local coordinates: the head's centre is (0,0).
// The same functions draw a character in every scene, which keeps faces, hair and clothes identical.

export const PAL = {
  // young woman
  wSkin: "#e2ae88", wSkinSh: "#cd9672", wSkinDeep: "#b57b5c", wBlush: "#e8867a",
  wHair: "#1f1613", wHairHi: "#3b2b25", wIris: "#5b3424",
  scarf: "#7c2d3d", scarfHi: "#963f50", scarfSh: "#5e1f2c",
  coat: "#a77b52", coatSh: "#8a6342", coatHi: "#bb9065",
  sweater: "#e7dcc6", sweaterSh: "#cbbfa6",
  trousers: "#2a2b33", shoe: "#1a1716",
  // old man
  mSkin: "#c7906c", mSkinSh: "#b07a58", mSkinHi: "#d8a582", mSkinDeep: "#9a6748",
  mHair: "#b9b5ae", mHairSh: "#9d9992", mBrow: "#dcd8d0", mBeard: "#bdb9b2", mBeardSh: "#a29e97", mStache: "#e9e6e0",
  glasses: "#1e1916", mIris: "#5a4636",
  jacket: "#5c5e3d", jacketSh: "#47492e", jacketHi: "#6d6f4a", shirt: "#35362a",
  ink: "#1b1210",
};
const P = PAL;

// ── eyes ────────────────────────────────────────────────────────────────────────────────────────
// One almond eye at (cx,cy). Iris group `${id}-iris` moves to look around; the whole `${id}` group squashes to blink.
function eye(id, cx, cy, side, o) {
  const w = o.w ?? 30, h = o.h ?? 15, r = o.r ?? 13;
  const s = side; // -1 left on screen, +1 right on screen; the outer corner is at s*w
  const almond = `M ${-w},0 C ${-w * 0.6},${-h * 1.05} ${w * 0.6},${-h * 1.05} ${w},0 C ${w * 0.6},${h * 0.72} ${-w * 0.6},${h * 0.72} ${-w},0 Z`;
  const lid = `M ${-w - 2},1 C ${-w * 0.6},${-h * 1.12} ${w * 0.6},${-h * 1.12} ${w + 2},1`;
  const flick = s > 0 ? `M ${w - 4},-2 Q ${w + 8},-6 ${w + 13},-12` : `M ${-w + 4},-2 Q ${-w - 8},-6 ${-w - 13},-12`;
  return `
  <g transform="translate(${cx},${cy})"><g id="${id}">
    <clipPath id="${id}-clip"><path d="${almond}"/></clipPath>
    <path d="${almond}" fill="#f7f1ea"/>
    <g clip-path="url(#${id}-clip)">
      <g id="${id}-iris">
        <circle r="${r}" fill="${o.iris}"/>
        <circle r="${r * 0.62}" fill="${o.iris}" opacity="0.6" stroke="#2a160e" stroke-width="1.2"/>
        <circle r="${r * 0.48}" fill="#140c09"/>
        <circle cx="${-r * 0.32}" cy="${-r * 0.36}" r="${r * 0.26}" fill="#fff"/>
        <circle cx="${r * 0.35}" cy="${r * 0.3}" r="${r * 0.11}" fill="#fff" opacity="0.8"/>
      </g>
      <path d="M ${-w},${-h} L ${w},${-h} L ${w},${-h * 0.25} C ${w * 0.5},${-h * 0.55} ${-w * 0.5},${-h * 0.55} ${-w},${-h * 0.25} Z" fill="#000" opacity="0.13"/>
    </g>
    <path d="${lid}" fill="none" stroke="${o.lash}" stroke-width="${o.lashW ?? 4.6}" stroke-linecap="round"/>
    ${o.flick ? `<path d="${flick}" fill="none" stroke="${o.lash}" stroke-width="3.2" stroke-linecap="round"/>` : ""}
    <path d="M ${-w * 0.65},${h * 0.62} C ${-w * 0.2},${h * 0.95} ${w * 0.2},${h * 0.95} ${w * 0.65},${h * 0.62}" fill="none" stroke="${o.lower ?? "#000"}" stroke-opacity="0.22" stroke-width="1.8" stroke-linecap="round"/>
  </g>
  <path d="M ${-w * 0.85},${-h - 7} C ${-w * 0.3},${-h - 15} ${w * 0.3},${-h - 15} ${w * 0.85},${-h - 7}" fill="none" stroke="${o.crease}" stroke-width="2.4" stroke-linecap="round" opacity="0.75"/>
  </g>`;
}

// ── young woman ────────────────────────────────────────────────────────────────────────────────
const W_FACE = "M -104,-92 C -110,-25 -110,38 -95,80 C -78,122 -38,151 0,153 C 38,151 78,122 95,80 C 110,38 110,-25 104,-92 C 98,-150 52,-178 0,-178 C -52,-178 -98,-150 -104,-92 Z";

// Head facing the camera. scarf: draw the headscarf. Parts: -head, -face (features that shift on a turn),
// -eyeL/-eyeR (+ -iris), -browL/-browR, -mouthN/-mouthW/-mouthS/-mouthO (only one visible), -hairF, -blush.
export function womanHead(p, { scarf = true, backHair = true } = {}) {
  const eo = { iris: P.wIris, lash: P.ink, crease: P.wSkinDeep, flick: true, w: 30, h: 15, r: 13.5 };
  return `
  <g id="${p}-head">
    ${scarf ? `<path d="M -150,-60 C -165,-210 -60,-262 0,-262 C 60,-262 165,-210 150,-60 C 150,40 150,120 168,210 L -168,210 C -150,120 -150,40 -150,-60 Z" fill="${P.scarfSh}"/>`
            : backHair ? `<path d="M -128,-80 C -150,-230 150,-230 128,-80 C 140,40 150,170 160,250 C 100,280 -100,280 -160,250 C -150,170 -140,40 -128,-80 Z" fill="${P.wHair}"/>` : ""}
    <path d="M -40,110 L -40,230 C -20,245 20,245 40,230 L 40,110 Z" fill="${P.wSkinSh}"/>
    <path d="M -40,128 C -20,160 20,160 40,128 L 40,150 C 20,178 -20,178 -40,150 Z" fill="${P.wSkinDeep}" opacity="0.55"/>
    ${scarf ? "" : `<ellipse cx="-106" cy="18" rx="15" ry="26" fill="${P.wSkinSh}"/><ellipse cx="106" cy="18" rx="15" ry="26" fill="${P.wSkinSh}"/>`}
    <path d="${W_FACE}" fill="${P.wSkin}"/>
    <path d="M 104,-92 C 110,-25 110,38 95,80 C 78,122 38,151 0,153 C 50,140 82,96 90,40 C 96,-10 96,-60 92,-110 Z" fill="${P.wSkinSh}" opacity="0.55"/>
    <g id="${p}-blush" opacity="0.38">
      <ellipse cx="-62" cy="58" rx="26" ry="15" fill="${P.wBlush}"/><ellipse cx="62" cy="58" rx="26" ry="15" fill="${P.wBlush}"/>
    </g>
    <g id="${p}-face">
      ${eye(`${p}-eyeL`, -46, 8, -1, eo)}
      ${eye(`${p}-eyeR`, 46, 8, 1, eo)}
      <path id="${p}-browL" d="M -78,-30 C -62,-46 -36,-48 -16,-38 C -36,-41 -60,-38 -76,-25 Z" fill="${P.wHair}"/>
      <path id="${p}-browR" d="M 78,-30 C 62,-46 36,-48 16,-38 C 36,-41 60,-38 76,-25 Z" fill="${P.wHair}"/>
      <path d="M 6,10 C 9,30 12,46 16,58" fill="none" stroke="${P.wSkinDeep}" stroke-width="3" stroke-linecap="round" opacity="0.45"/>
      <path d="M -14,62 C -8,72 8,72 14,62 C 10,56 -10,56 -14,62 Z" fill="${P.wSkinDeep}" opacity="0.7"/>
      <ellipse cx="0" cy="56" rx="11" ry="7" fill="${P.wSkinHi ?? "#eebd98"}" opacity="0.5"/>
      <g transform="translate(0,100)">
        <g id="${p}-mouthN"><path d="M -24,0 C -12,-6 -4,-4 0,-2 C 4,-4 12,-6 24,0 C 12,3 -12,3 -24,0 Z" fill="#a9524d"/>
          <path d="M -22,1 C -10,16 10,16 22,1 C 10,4 -10,4 -22,1 Z" fill="#c96e66"/>
          <path d="M -26,0 C -12,2 12,2 26,0" fill="none" stroke="#6e2c2a" stroke-width="2.2" stroke-linecap="round"/></g>
        <g id="${p}-mouthW" opacity="0"><path d="M -22,3 C -10,-3 10,-3 22,3 C 10,1 -10,1 -22,3 Z" fill="#a9524d"/>
          <path d="M -20,4 C -10,14 10,14 20,4 C 10,6 -10,6 -20,4 Z" fill="#c96e66"/>
          <path d="M -24,5 C -12,0 12,0 24,5" fill="none" stroke="#6e2c2a" stroke-width="2.2" stroke-linecap="round"/></g>
        <g id="${p}-mouthS" opacity="0"><path d="M -25,-2 C -12,-6 12,-6 25,-2 C 12,6 -12,6 -25,-2 Z" fill="#a9524d"/>
          <path d="M -22,1 C -10,15 10,15 22,1 C 10,6 -10,6 -22,1 Z" fill="#c96e66"/>
          <path d="M -27,-3 C -12,5 12,5 27,-3" fill="none" stroke="#6e2c2a" stroke-width="2.2" stroke-linecap="round"/></g>
        <g id="${p}-mouthO" opacity="0"><ellipse cx="0" cy="3" rx="13" ry="12" fill="#5a2224"/>
          <path d="M -14,0 C -10,-11 10,-11 14,0 C 8,-6 -8,-6 -14,0 Z" fill="#a9524d"/>
          <path d="M -13,6 C -8,19 8,19 13,6 C 8,12 -8,12 -13,6 Z" fill="#c96e66"/></g>
      </g>
    </g>
    <g id="${p}-hairF">
      <path d="M -112,-40 C -122,-150 -50,-196 4,-188 C 60,-196 124,-150 112,-40 C 104,-96 80,-128 40,-138 C 30,-110 0,-92 -30,-84 C -6,-104 4,-122 6,-136 C -40,-128 -86,-104 -112,-40 Z" fill="${P.wHair}"/>
      <path d="M -70,-128 C -40,-150 0,-160 30,-150" fill="none" stroke="${P.wHairHi}" stroke-width="6" stroke-linecap="round"/>
      <path d="M 40,-138 C 80,-128 104,-96 112,-40 C 114,0 108,40 100,70 C 106,20 104,-30 92,-70 C 80,-104 60,-124 40,-138 Z" fill="${P.wHair}"/>
      <path d="M -112,-40 C -116,0 -110,40 -100,70 C -104,20 -102,-30 -90,-70 Z" fill="${P.wHair}"/>
    </g>
    ${scarf ? `
    <path d="M -124,-40 C -140,-190 -50,-232 0,-232 C 50,-232 140,-190 124,-40 C 124,40 118,110 100,150 C 116,100 118,20 114,-50 C 106,-150 50,-196 0,-196 C -50,-196 -106,-150 -114,-50 C -118,20 -116,100 -100,150 C -118,110 -124,40 -124,-40 Z" fill="${P.scarf}"/>
    <path d="M -96,-176 C -60,-210 60,-210 96,-176" fill="none" stroke="${P.scarfHi}" stroke-width="7" stroke-linecap="round" opacity="0.8"/>
    <path d="M -112,120 C -80,190 80,190 112,120 C 130,170 150,200 168,212 C 80,250 -80,250 -168,212 C -150,200 -130,170 -112,120 Z" fill="${P.scarf}"/>
    <path d="M -100,150 C -60,200 60,200 100,150" fill="none" stroke="${P.scarfSh}" stroke-width="5" opacity="0.7"/>` : ""}
  </g>`;
}

// Back of her head (over-the-shoulder shots, walking away).
export function womanHeadBack(p, { scarf = true } = {}) {
  return `
  <g id="${p}-headB">
    ${scarf ? `
    <path d="M -150,-60 C -165,-215 -60,-262 0,-262 C 60,-262 165,-215 150,-60 C 150,40 150,120 168,210 L -168,210 C -150,120 -150,40 -150,-60 Z" fill="${P.scarf}"/>
    <path d="M -110,-190 C -60,-232 60,-232 110,-190" fill="none" stroke="${P.scarfHi}" stroke-width="9" stroke-linecap="round" opacity="0.75"/>
    <path d="M 0,-255 C 30,-140 40,40 30,200" fill="none" stroke="${P.scarfSh}" stroke-width="6" opacity="0.55"/>
    <path d="M -168,212 C -80,250 80,250 168,212" fill="none" stroke="${P.scarfSh}" stroke-width="6" opacity="0.6"/>`
    : `<path d="M -128,-80 C -150,-230 150,-230 128,-80 C 140,40 150,170 160,250 C 100,280 -100,280 -160,250 C -150,170 -140,40 -128,-80 Z" fill="${P.wHair}"/>
       <path d="M -60,-170 C -20,-190 30,-186 60,-170" fill="none" stroke="${P.wHairHi}" stroke-width="8" stroke-linecap="round"/>`}
  </g>`;
}

// Shoulders and chest, centred under the head (y from ~200). coat=false: only the sweater (at home).
export function womanTorso(p, { coat = true } = {}) {
  return `
  <g id="${p}-torso">
    <path d="M -210,330 C -205,260 -160,225 -90,212 L 90,212 C 160,225 205,260 210,330 L 240,1100 L -240,1100 Z" fill="${coat ? P.coat : P.sweater}"/>
    ${coat ? `
    <path d="M -64,214 L 0,330 L 64,214 L 50,212 L 0,300 L -50,212 Z" fill="${P.sweater}"/>
    <path d="M -90,212 L -40,214 L 0,330 L -30,1100 L -60,1100 Z" fill="${P.coatSh}"/>
    <path d="M 90,212 L 40,214 L 0,330 L 30,1100 L 60,1100 Z" fill="${P.coatSh}"/>
    <path d="M -90,212 L -44,214 L -2,330 L -70,250 Z" fill="${P.coatHi}" opacity="0.7"/>
    <path d="M 90,212 L 44,214 L 2,330 L 70,250 Z" fill="${P.coatHi}" opacity="0.7"/>
    <path d="M 0,330 L 0,1100" stroke="${P.coatSh}" stroke-width="4"/>
    <circle cx="-14" cy="420" r="7" fill="${P.coatSh}"/><circle cx="-14" cy="520" r="7" fill="${P.coatSh}"/>`
    : `<path d="M -54,214 C -30,250 30,250 54,214" fill="none" stroke="${P.sweaterSh}" stroke-width="10"/>
       <path d="M -150,260 C -140,400 -150,560 -160,700" fill="none" stroke="${P.sweaterSh}" stroke-width="5" opacity="0.6"/>
       <path d="M 150,260 C 140,400 150,560 160,700" fill="none" stroke="${P.sweaterSh}" stroke-width="5" opacity="0.6"/>`}
    <path d="M -210,330 C -200,300 -190,270 -160,240" fill="none" stroke="#000" stroke-opacity="0.12" stroke-width="8"/>
  </g>`;
}

export function womanTorsoBack(p, { coat = true } = {}) {
  return `
  <g id="${p}-torsoB">
    <path d="M -210,330 C -205,260 -160,225 -90,212 L 90,212 C 160,225 205,260 210,330 L 240,1100 L -240,1100 Z" fill="${coat ? P.coat : P.sweater}"/>
    <path d="M 0,240 L 0,1100" stroke="${coat ? P.coatSh : P.sweaterSh}" stroke-width="5" opacity="0.6"/>
    <path d="M -210,330 C -150,300 -80,290 -30,300" fill="none" stroke="#000" stroke-opacity="0.1" stroke-width="10"/>
  </g>`;
}

// A hand seen from the back (fingers pointing up when rotation is 0), wrist at (0,0), with a sleeve below.
export function womanHand(p, { sleeve = "coat", palm = false } = {}) {
  const cuff = sleeve === "coat" ? P.coat : P.sweater, cuffSh = sleeve === "coat" ? P.coatSh : P.sweaterSh;
  return `
  <g id="${p}">
    <path d="M -34,0 C -40,-30 -42,-56 -36,-74 L -40,-128 C -41,-140 -27,-142 -25,-130 L -20,-86 L -18,-146 C -18,-160 -2,-160 -2,-146 L 0,-88 L 6,-150 C 7,-163 22,-162 22,-148 L 18,-86 L 28,-136 C 31,-148 45,-145 42,-132 L 34,-72 C 38,-60 52,-62 62,-82 C 68,-94 82,-88 76,-74 C 66,-48 50,-30 34,-14 L 34,0 Z" fill="${palm ? P.wSkin : P.wSkinSh}"/>
    ${palm ? `<path d="M -26,-30 C -10,-42 12,-40 26,-28" fill="none" stroke="${P.wSkinDeep}" stroke-width="2.5" stroke-linecap="round"/>
              <path d="M -30,-56 C -10,-64 14,-66 34,-58" fill="none" stroke="${P.wSkinDeep}" stroke-width="2.5" stroke-linecap="round"/>
              <path d="M 22,-14 C 0,-26 -14,-46 -12,-74" fill="none" stroke="${P.wSkinDeep}" stroke-width="2.5" stroke-linecap="round"/>` : ""}
    <rect x="-44" y="-4" width="88" height="140" rx="16" fill="${cuff}"/>
    <rect x="-44" y="-4" width="88" height="18" rx="9" fill="${cuffSh}"/>
  </g>`;
}

// ── old man ────────────────────────────────────────────────────────────────────────────────────
const M_HEAD = "M -118,-60 C -126,-170 -66,-218 0,-218 C 66,-218 126,-170 118,-60 C 118,30 110,110 84,160 C 60,200 30,214 0,214 C -30,214 -60,200 -84,160 C -110,110 -118,30 -118,-60 Z";

// Parts: -head, -face, -eyeL/-eyeR (+ -iris), -browL/-browR, -glasses. No mouth: the moustache covers it.
export function oldManHead(p) {
  const eo = { iris: P.mIris, lash: "#3a2a20", crease: P.mSkinDeep, flick: false, w: 24, h: 11, r: 10, lashW: 4 };
  const strands = Array.from({ length: 15 }, (_, i) => {
    const x = -84 + i * 12;
    const top = 92 + Math.abs(x) * 0.15, bot = 205 - Math.abs(x) * 0.55;
    return `<path d="M ${x},${top} C ${x + 2},${(top + bot) / 2} ${x - 1},${bot - 10} ${x + 1},${bot}" stroke="${i % 2 ? P.mBeardSh : "#d2cec7"}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.8"/>`;
  }).join("");
  return `
  <g id="${p}-head">
    <path d="M -46,150 L -46,260 L 46,260 L 46,150 Z" fill="${P.mSkinSh}"/>
    <ellipse cx="-122" cy="10" rx="17" ry="34" fill="${P.mSkinSh}"/><ellipse cx="122" cy="10" rx="17" ry="34" fill="${P.mSkinSh}"/>
    <path d="M -124,-6 C -130,6 -128,22 -120,30" fill="none" stroke="${P.mSkinDeep}" stroke-width="3"/>
    <path d="M 124,-6 C 130,6 128,22 120,30" fill="none" stroke="${P.mSkinDeep}" stroke-width="3"/>
    <path d="${M_HEAD}" fill="${P.mSkin}"/>
    <path d="M 118,-60 C 118,30 110,110 84,160 C 60,200 30,214 0,214 C 60,190 96,120 102,20 C 106,-60 96,-140 70,-190 C 104,-170 120,-120 118,-60 Z" fill="${P.mSkinSh}" opacity="0.6"/>
    <ellipse cx="-6" cy="-170" rx="70" ry="30" fill="${P.mSkinHi}" opacity="0.75"/>
    <g opacity="0.5" stroke="${P.mSkinDeep}" stroke-width="2.4" fill="none" stroke-linecap="round">
      <path d="M -50,-118 C -20,-126 20,-126 50,-118"/><path d="M -60,-100 C -24,-108 24,-108 60,-100"/><path d="M -44,-82 C -16,-88 16,-88 44,-82"/>
    </g>
    <path d="M -118,-70 C -128,-20 -124,30 -110,60 C -104,20 -98,-20 -98,-60 C -102,-90 -110,-96 -118,-70 Z" fill="${P.mHair}"/>
    <path d="M 118,-70 C 128,-20 124,30 110,60 C 104,20 98,-20 98,-60 C 102,-90 110,-96 118,-70 Z" fill="${P.mHair}"/>
    <path d="M -114,-50 C -108,-30 -106,-10 -108,10" stroke="${P.mHairSh}" stroke-width="3" fill="none"/>
    <path d="M 114,-50 C 108,-30 106,-10 108,10" stroke="${P.mHairSh}" stroke-width="3" fill="none"/>
    <g id="${p}-face">
      ${eye(`${p}-eyeL`, -48, 4, -1, eo)}
      ${eye(`${p}-eyeR`, 48, 4, 1, eo)}
      <path d="M -70,14 C -60,24 -36,24 -26,16" fill="none" stroke="${P.mSkinDeep}" stroke-width="2" opacity="0.5"/>
      <path d="M 70,14 C 60,24 36,24 26,16" fill="none" stroke="${P.mSkinDeep}" stroke-width="2" opacity="0.5"/>
      <path id="${p}-browL" d="M -86,-26 C -70,-42 -40,-44 -16,-32 C -30,-30 -36,-24 -46,-26 C -60,-28 -74,-24 -88,-16 Z" fill="${P.mBrow}"/>
      <path id="${p}-browR" d="M 86,-26 C 70,-42 40,-44 16,-32 C 30,-30 36,-24 46,-26 C 60,-28 74,-24 88,-16 Z" fill="${P.mBrow}"/>
      <path d="M -10,0 C -14,24 -22,44 -24,58 C -18,68 18,68 24,58 C 22,44 14,24 10,0" fill="${P.mSkinSh}" opacity="0.5"/>
      <ellipse cx="0" cy="58" rx="20" ry="15" fill="${P.mSkinDeep}" opacity="0.6"/>
      <ellipse cx="-3" cy="53" rx="10" ry="6" fill="${P.mSkinHi}" opacity="0.6"/>
      <g id="${p}-glasses">
        <rect x="-96" y="-22" width="84" height="54" rx="10" fill="#d8e4ea" fill-opacity="0.08" stroke="${P.glasses}" stroke-width="7"/>
        <rect x="12" y="-22" width="84" height="54" rx="10" fill="#d8e4ea" fill-opacity="0.08" stroke="${P.glasses}" stroke-width="7"/>
        <path d="M -12,-4 C -6,-10 6,-10 12,-4" fill="none" stroke="${P.glasses}" stroke-width="6"/>
        <path d="M -96,-12 L -116,-8" stroke="${P.glasses}" stroke-width="6"/><path d="M 96,-12 L 116,-8" stroke="${P.glasses}" stroke-width="6"/>
        <path d="M -84,-14 L -62,-14" stroke="#fff" stroke-width="3" opacity="0.25" stroke-linecap="round"/>
        <path d="M 24,-14 L 46,-14" stroke="#fff" stroke-width="3" opacity="0.25" stroke-linecap="round"/>
      </g>
    </g>
    <path d="M -110,40 C -108,110 -70,170 -40,200 C -20,214 20,214 40,200 C 70,170 108,110 110,40 C 100,70 90,86 70,92 C 40,100 20,84 0,84 C -20,84 -40,100 -70,92 C -90,86 -100,70 -110,40 Z" fill="${P.mBeard}"/>
    ${strands}
    <path d="M -62,92 C -50,74 -20,68 0,78 C 20,68 50,74 62,92 C 56,100 44,100 36,96 C 24,104 10,100 0,94 C -10,100 -24,104 -36,96 C -44,100 -56,100 -62,92 Z" fill="${P.mStache}"/>
    <path d="M -40,88 C -26,84 -12,84 -2,88" fill="none" stroke="#c9c5be" stroke-width="2"/>
  </g>`;
}

export function oldManHeadBack(p) {
  return `
  <g id="${p}-headB">
    <ellipse cx="-122" cy="10" rx="17" ry="34" fill="${P.mSkinSh}"/><ellipse cx="122" cy="10" rx="17" ry="34" fill="${P.mSkinSh}"/>
    <path d="${M_HEAD}" fill="${P.mSkinSh}"/>
    <ellipse cx="10" cy="-150" rx="70" ry="40" fill="${P.mSkin}" opacity="0.8"/>
    <path d="M -118,-40 C -110,60 -60,120 0,124 C 60,120 110,60 118,-40 C 124,40 116,110 84,160 C 50,200 -50,200 -84,160 C -116,110 -124,40 -118,-40 Z" fill="${P.mHair}"/>
    <path d="M -80,80 C -40,104 40,104 80,80" stroke="${P.mHairSh}" stroke-width="4" fill="none"/>
  </g>`;
}

export function oldManTorso(p) {
  return `
  <g id="${p}-torso">
    <path d="M -230,360 C -226,280 -170,236 -96,222 L 96,222 C 170,236 226,280 230,360 L 260,1100 L -260,1100 Z" fill="${P.jacket}"/>
    <path d="M -60,222 L 0,330 L 60,222 Z" fill="${P.shirt}"/>
    <path d="M -96,222 L -50,224 L -4,340 L -40,1100 L -80,1100 Z" fill="${P.jacketSh}"/>
    <path d="M 96,222 L 50,224 L 4,340 L 40,1100 L 80,1100 Z" fill="${P.jacketSh}"/>
    <path d="M -96,222 L -54,226 L -8,336 L -86,276 Z" fill="${P.jacketHi}"/>
    <path d="M 96,222 L 54,226 L 8,336 L 86,276 Z" fill="${P.jacketHi}"/>
    <path d="M -160,250 C -170,300 -176,360 -178,420" stroke="${P.jacketSh}" stroke-width="5" fill="none" opacity="0.7"/>
    <path d="M 160,250 C 170,300 176,360 178,420" stroke="${P.jacketSh}" stroke-width="5" fill="none" opacity="0.7"/>
  </g>`;
}

export function oldManTorsoBack(p) {
  return `
  <g id="${p}-torsoB">
    <path d="M -230,360 C -226,280 -170,236 -96,222 L 96,222 C 170,236 226,280 230,360 L 260,1100 L -260,1100 Z" fill="${P.jacketSh}"/>
    <path d="M -90,222 C -40,240 40,240 90,222 L 96,240 C 40,262 -40,262 -96,240 Z" fill="${P.jacket}"/>
    <path d="M 0,260 L 0,1100" stroke="${P.shirt}" stroke-width="4" opacity="0.5"/>
  </g>`;
}

// His hand seen from the back, fingers up at rotation 0, wrist at (0,0). point: index finger extended.
export function oldManHand(p, { point = false } = {}) {
  const fingers = point
    ? `<path d="M -36,-70 C -44,-90 -40,-104 -28,-104 C -18,-104 -14,-92 -16,-80 Z" fill="${P.mSkinSh}"/>
       <path d="M -14,-74 C -14,-150 -14,-196 -2,-198 C 10,-198 12,-160 12,-76 Z" fill="${P.mSkin}"/>
       <path d="M 12,-74 C 22,-96 34,-96 38,-80 Z" fill="${P.mSkinSh}"/>`
    : `<path d="M -44,-70 L -48,-138 C -48,-152 -30,-152 -30,-138 L -26,-86 L -22,-156 C -22,-170 -4,-170 -4,-156 L -2,-90 L 6,-158 C 7,-172 24,-171 24,-156 L 20,-88 L 32,-140 C 35,-152 50,-149 47,-136 L 38,-70 Z" fill="${P.mSkin}"/>`;
  return `
  <g id="${p}">
    <path d="M -44,0 C -50,-30 -50,-56 -44,-74 L 40,-74 C 52,-60 66,-62 76,-84 C 84,-98 98,-90 92,-74 C 80,-44 60,-26 44,-10 L 44,0 Z" fill="${P.mSkin}"/>
    ${fingers}
    <path d="M -30,-40 C -10,-48 14,-48 34,-40" fill="none" stroke="${P.mSkinDeep}" stroke-width="2" opacity="0.4"/>
    <rect x="-54" y="-4" width="108" height="160" rx="18" fill="${P.jacket}"/>
    <rect x="-54" y="-4" width="108" height="20" rx="10" fill="${P.jacketSh}"/>
  </g>`;
}

// ── full body (wide shots) ───────────────────────────────────────────────────────────────────────
// Feet at (0,0), about 1000 units tall. Parts: -legL/-legR (swing at the knee line), -armL/-armR (swing at the
// shoulder), -body. back: seen from behind. The head is the same rig as the close-ups, scaled down.
export function womanFull(p, { back = false, scarf = true } = {}) {
  const leg = (id, x) => `<g id="${id}"><path d="M ${x - 17},-360 L ${x + 17},-360 L ${x + 14},-30 L ${x - 14},-30 Z" fill="${P.trousers}"/>
      <path d="M ${x - 16},-34 L ${x + 16},-34 C ${x + 22},-20 ${x + 30},-10 ${x + 30},0 L ${x - 18},0 C ${x - 18},-12 ${x - 18},-24 ${x - 16},-34 Z" fill="${P.shoe}"/></g>`;
  const arm = (id, x, s) => `<g id="${id}">
      <path d="M ${x - 22 * s},-790 C ${x + 6 * s},-800 ${x + 30 * s},-770 ${x + 30 * s},-740 L ${x + 26 * s},-500 L ${x - 6 * s},-500 L ${x - 22 * s},-780 Z" fill="${back ? P.coatSh : P.coat}"/>
      <path d="M ${x - 6 * s},-500 L ${x + 26 * s},-500 L ${x + 24 * s},-486 L ${x - 6 * s},-486 Z" fill="${P.coatSh}"/>
      <ellipse cx="${x + 10 * s}" cy="-462" rx="16" ry="26" fill="${back ? P.wSkinSh : P.wSkin}"/></g>`;
  return `
  <g id="${p}-body">
    ${leg(`${p}-legL`, -26)}${leg(`${p}-legR`, 26)}
    <g id="${p}-coat">
      <path d="M -60,-800 C -84,-790 -92,-760 -90,-720 L -96,-330 C -40,-316 40,-316 96,-330 L 90,-720 C 92,-760 84,-790 60,-800 Z" fill="${back ? P.coatSh : P.coat}"/>
      ${back ? `<path d="M 0,-780 L 0,-326" stroke="${P.coat}" stroke-width="3" opacity="0.6"/>
                <path d="M -90,-540 C -30,-530 30,-530 90,-540" stroke="${P.coat}" stroke-width="4" opacity="0.5" fill="none"/>`
             : `<path d="M -22,-800 L 22,-800 L 14,-560 L -14,-560 Z" fill="${P.sweater}"/>
                <path d="M -40,-800 L -10,-560 L -8,-326 L -30,-326 L -28,-560 Z" fill="${P.coatSh}"/>
                <path d="M 40,-800 L 10,-560 L 8,-326 L 30,-326 L 28,-560 Z" fill="${P.coatSh}"/>
                <circle cx="-16" cy="-500" r="5" fill="${P.coatSh}"/><circle cx="-16" cy="-430" r="5" fill="${P.coatSh}"/>`}
    </g>
    ${arm(`${p}-armL`, -78, -1)}${arm(`${p}-armR`, 78, 1)}
    <g transform="translate(0,-880) scale(0.3)">${back ? womanHeadBack(`${p}-h`, { scarf }) : womanHead(`${p}-h`, { scarf })}</g>
  </g>`;
}
