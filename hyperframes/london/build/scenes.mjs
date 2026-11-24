// London murders – shot 1: aerial over old London streets at night, thick fog drifting between Victorian houses;
// the camera eases toward one lit window. Drawn in perspective: a street runs away from the camera to a
// vanishing point; house fronts line both sides, slate roofs and chimneys above, gas lamps along the kerb.
import { scene, glow } from "./lib.mjs";
import { womanHead, PAL as WP } from "../../fortune-teller/build/chars.mjs";

let seed = 19;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

const VP = { x: 540, y: 470 };
const CAM = 1400;     // screen offset for ground height at depth 1
const H = 740;        // house height (screen units at depth 1)
const LAT = 250;      // street half-width to the house fronts
// project a point on a house front: side -1 left / +1 right, depth z, height fraction v (0 ground, 1 eaves)
const P = (side, z, v, lat = LAT) => [VP.x + side * lat / z, VP.y + (CAM - H * v) / z];
const pts = (a) => a.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
const quad = (side, z0, z1, v0, v1, lat = LAT) => pts([P(side, z0, v0, lat), P(side, z1, v0, lat), P(side, z1, v1, lat), P(side, z0, v1, lat)]);

const BRICK = ["#3a2622", "#41292a", "#33242a", "#3d2a24", "#2e2228"];
const HOUSES = (() => { const z = [1.0]; while (z[z.length - 1] < 30) z.push(z[z.length - 1] * 1.22 + 0.25); return z; })();
export const TARGET = { side: 1, k: 3, row: 1, col: 0 }; // the lit window the camera travels to

function house(side, k) {
  const z0 = HOUSES[k], z1 = HOUSES[k + 1], dz = z1 - z0;
  const Z = (u) => z0 + dz * u;
  const col = BRICK[(k * 3 + (side > 0 ? 1 : 0)) % BRICK.length];
  let s = `<polygon points="${quad(side, z0, z1, 0, 1)}" fill="${col}"/>`;
  // string course and cornice
  s += `<polygon points="${quad(side, z0, z1, 0.47, 0.5)}" fill="#1e1618" opacity="0.8"/>`;
  s += `<polygon points="${quad(side, z0, z1, 0.97, 1.03)}" fill="#1a1416"/>`;
  // door
  s += `<polygon points="${quad(side, Z(0.4), Z(0.6), 0, 0.3)}" fill="#120c0c"/>`;
  s += `<polygon points="${quad(side, Z(0.38), Z(0.62), 0.3, 0.34)}" fill="#2a1e1c"/>`;
  // sash windows: 2 columns × 2 floors
  [[0.12, 0.32], [0.68, 0.88]].forEach(([u0, u1], ci) => {
    [[0.08, 0.36], [0.56, 0.86]].forEach(([v0, v1], ri) => {
      const isT = side === TARGET.side && k === TARGET.k && ri === TARGET.row && ci === TARGET.col;
      const lit = isT || rnd() < 0.16;
      const id = isT ? ` id="win-target"` : "";
      s += `<polygon points="${quad(side, Z(u0) - dz * 0.02, Z(u1) + dz * 0.02, v0 - 0.02, v1 + 0.02)}" fill="#1a1214"/>`;
      s += `<polygon${id} points="${quad(side, Z(u0), Z(u1), v0, v1)}" fill="${lit ? (isT ? "#ffc35a" : "#d89a48") : "#0d1220"}" opacity="${lit ? 1 : 0.95}"/>`;
      if (isT) { // curtains drawn half, a lamp glow inside
        s += `<polygon points="${quad(side, Z(u0), Z(u0 + (u1 - u0) * 0.28), v0, v1)}" fill="#7a2a22" opacity="0.85"/>`;
        s += `<polygon points="${quad(side, Z(u1 - (u1 - u0) * 0.24), Z(u1), v0, v1)}" fill="#7a2a22" opacity="0.85"/>`;
      }
      // glazing bars
      const um = (u0 + u1) / 2, vm = (v0 + v1) / 2;
      s += `<polyline points="${pts([P(side, Z(um), v0), P(side, Z(um), v1)])}" stroke="#1a1214" stroke-width="${(5 / Z(um)).toFixed(2)}" fill="none"/>`;
      s += `<polyline points="${pts([P(side, Z(u0), vm), P(side, Z(u1), vm)])}" stroke="#1a1214" stroke-width="${(5 / Z(um)).toFixed(2)}" fill="none"/>`;
    });
  });
  // slate roof from the eaves up to the ridge (further out, higher)
  const R = (z) => [VP.x + side * (LAT + 150) / z, VP.y + (CAM - H * 1.32) / z];
  s += `<polygon points="${pts([P(side, z0, 1), P(side, z1, 1), R(z1), R(z0)])}" fill="${k % 2 ? "#1f2633" : "#232a38"}"/>`;
  s += `<polyline points="${pts([R(z0), R(z1)])}" stroke="#2e3646" stroke-width="${(6 / z0).toFixed(2)}" fill="none"/>`;
  // party-wall line and chimney stack with pots
  s += `<polyline points="${pts([P(side, z0, 0), P(side, z0, 1), R(z0)])}" stroke="#140e10" stroke-width="${(8 / z0).toFixed(2)}" fill="none"/>`;
  const [cx, cy] = R(z0 + dz * 0.1), cw = 70 / z0, ch = 150 / z0;
  s += `<rect x="${(cx - cw / 2).toFixed(1)}" y="${(cy - ch).toFixed(1)}" width="${cw.toFixed(1)}" height="${ch.toFixed(1)}" fill="#2a1e1e"/>`;
  s += `<rect x="${(cx - cw * 0.6).toFixed(1)}" y="${(cy - ch - 10 / z0).toFixed(1)}" width="${(cw * 1.2).toFixed(1)}" height="${(12 / z0).toFixed(1)}" fill="#1e1616"/>`;
  [-0.25, 0.2].forEach((o) => { s += `<rect x="${(cx + cw * o - 8 / z0).toFixed(1)}" y="${(cy - ch - 40 / z0).toFixed(1)}" width="${(16 / z0).toFixed(1)}" height="${(30 / z0).toFixed(1)}" fill="#4a2e26"/>`; });
  return s;
}
function lamp(id, side, z) {
  const [bx, by] = P(side, z, 0, LAT - 40), [tx, ty] = P(side, z, 0.62, LAT - 40);
  const w = 6 / z;
  return `<line x1="${bx.toFixed(1)}" y1="${by.toFixed(1)}" x2="${tx.toFixed(1)}" y2="${ty.toFixed(1)}" stroke="#0c0c10" stroke-width="${(w * 1.6).toFixed(2)}"/>
    <rect x="${(tx - 14 / z).toFixed(1)}" y="${(ty - 34 / z).toFixed(1)}" width="${(28 / z).toFixed(1)}" height="${(34 / z).toFixed(1)}" fill="#ffd27a"/>
    <circle class="${id}-lamp" cx="${tx.toFixed(1)}" cy="${(ty - 17 / z).toFixed(1)}" r="${(160 / z).toFixed(1)}" fill="url(#${id}-lampG)"/>
    <ellipse cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" rx="${(180 / z).toFixed(1)}" ry="${(50 / z).toFixed(1)}" fill="#ffc060" opacity="0.13"/>`;
}
function clockTower(x, y, s) {
  return `<g transform="translate(${x},${y}) scale(${s})" opacity="0.55">
    <rect x="-40" y="-520" width="80" height="520" fill="#1c2232"/><rect x="-52" y="-600" width="104" height="90" fill="#1c2232"/>
    <circle cx="0" cy="-555" r="34" fill="#c9b27a" opacity="0.75"/><path d="M 0,-555 L 0,-578 M 0,-555 L 14,-548" stroke="#1c2232" stroke-width="4"/>
    <path d="M -52,-600 L 0,-700 L 52,-600 Z" fill="#1c2232"/><path d="M -4,-700 L 0,-780 L 4,-700 Z" fill="#1c2232"/>
    ${[-30, 0, 30].map((dx) => `<rect x="${dx - 6}" y="-470" width="12" height="380" fill="#151a28"/>`).join("")}</g>`;
}

// Rows of terraces stacked in depth (far at the top), each: roofs and chimneys, house fronts, then the street.
const ROWS = [0, 1, 2, 3, 4, 5].map((r) => { const sc = 0.32 + r * 0.17; return { r, sc, y: 560 + r * 230 + r * r * 28 }; });
export const TGT = { row: 4, house: 3, win: 0 };
function terrace(id, row) {
  const { r, sc, y } = row;
  const hw = 190 * sc, fh = 300 * sc, rh = 130 * sc; // house width, front height, roof depth
  const n = Math.ceil(1180 / hw) + 1, x0 = -60 - ((r * 37) % hw);
  let s = "", target = null;
  // street in front of this row
  s += `<rect x="-40" y="${(y + fh).toFixed(1)}" width="1160" height="${(110 * sc).toFixed(1)}" fill="#14161c"/>`;
  s += `<rect x="-40" y="${(y + fh).toFixed(1)}" width="1160" height="${(10 * sc).toFixed(1)}" fill="#22242c"/>`;
  for (let i = 0; i < n; i++) {
    const x = x0 + i * hw, col = BRICK[(i * 7 + r * 3) % BRICK.length], tall = (i * 5 + r) % 4 === 0 ? 1.12 : 1;
    const top = y - (tall - 1) * fh;
    // roof (seen from above): a slate band behind the front, ridge line, chimney stack with pots
    s += `<polygon points="${pts([[x, top], [x + hw, top], [x + hw - 6 * sc, top - rh], [x + 6 * sc, top - rh]])}" fill="${i % 2 ? "#1f2633" : "#252c3a"}"/>`;
    s += `<line x1="${(x + 6 * sc).toFixed(1)}" y1="${(top - rh).toFixed(1)}" x2="${(x + hw - 6 * sc).toFixed(1)}" y2="${(top - rh).toFixed(1)}" stroke="#36404f" stroke-width="${(5 * sc).toFixed(1)}"/>`;
    const cx = x + hw * (i % 2 ? 0.78 : 0.2);
    s += `<rect x="${(cx - 16 * sc).toFixed(1)}" y="${(top - rh - 50 * sc).toFixed(1)}" width="${(32 * sc).toFixed(1)}" height="${(70 * sc).toFixed(1)}" fill="#3a2622"/>
      <rect x="${(cx - 20 * sc).toFixed(1)}" y="${(top - rh - 56 * sc).toFixed(1)}" width="${(40 * sc).toFixed(1)}" height="${(8 * sc).toFixed(1)}" fill="#24181a"/>
      <rect x="${(cx - 12 * sc).toFixed(1)}" y="${(top - rh - 70 * sc).toFixed(1)}" width="${(8 * sc).toFixed(1)}" height="${(16 * sc).toFixed(1)}" fill="#5a3426"/><rect x="${(cx + 4 * sc).toFixed(1)}" y="${(top - rh - 70 * sc).toFixed(1)}" width="${(8 * sc).toFixed(1)}" height="${(16 * sc).toFixed(1)}" fill="#5a3426"/>`;
    // front
    s += `<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${hw.toFixed(1)}" height="${(fh * tall).toFixed(1)}" fill="${col}"/>`;
    s += `<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${hw.toFixed(1)}" height="${(10 * sc).toFixed(1)}" fill="#1a1416"/>`;
    s += `<rect x="${(x + hw - 4 * sc).toFixed(1)}" y="${top.toFixed(1)}" width="${(4 * sc).toFixed(1)}" height="${(fh * tall).toFixed(1)}" fill="#140e10"/>`;
    s += `<rect x="${x.toFixed(1)}" y="${(top + fh * tall * 0.5).toFixed(1)}" width="${hw.toFixed(1)}" height="${(6 * sc).toFixed(1)}" fill="#1e1618"/>`;
    // door with fanlight and steps
    const dx = x + hw * 0.42, dw = hw * 0.18;
    s += `<rect x="${dx.toFixed(1)}" y="${(top + fh * tall - 90 * sc).toFixed(1)}" width="${dw.toFixed(1)}" height="${(90 * sc).toFixed(1)}" fill="#0e0a0a"/>
      <rect x="${(dx - 4 * sc).toFixed(1)}" y="${(top + fh * tall - 4 * sc).toFixed(1)}" width="${(dw + 8 * sc).toFixed(1)}" height="${(8 * sc).toFixed(1)}" fill="#3a3436"/>`;
    // sash windows: two per floor, two floors
    [[0.1, 0.32], [0.66, 0.88]].forEach(([u0, u1], ci) => [[0.1, 0.42], [0.58, 0.9]].forEach(([v0, v1], ri) => {
      if (ri === 0 && ci === 0 && false) return;
      const wx = x + hw * u0, ww = hw * (u1 - u0), wy = top + fh * tall * (ri === 0 ? 0.12 : 0.6), wh = fh * tall * 0.26;
      const isT = r === TGT.row && i === TGT.house && ri === TGT.win && ci === 0;
      const lit = isT || rnd() < 0.12;
      s += `<rect x="${(wx - 3 * sc).toFixed(1)}" y="${(wy - 3 * sc).toFixed(1)}" width="${(ww + 6 * sc).toFixed(1)}" height="${(wh + 8 * sc).toFixed(1)}" fill="#1a1214"/>`;
      s += `<rect${isT ? ' id="win-target"' : ""} x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="${ww.toFixed(1)}" height="${wh.toFixed(1)}" fill="${lit ? (isT ? "#ffc35a" : "#c98a44") : "#0d1220"}"/>`;
      if (isT) {
        s += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="${(ww * 0.26).toFixed(1)}" height="${wh.toFixed(1)}" fill="#7a2a22"/><rect x="${(wx + ww * 0.76).toFixed(1)}" y="${wy.toFixed(1)}" width="${(ww * 0.24).toFixed(1)}" height="${wh.toFixed(1)}" fill="#7a2a22"/>`;
        target = [wx + ww / 2, wy + wh / 2];
      }
      s += `<line x1="${(wx + ww / 2).toFixed(1)}" y1="${wy.toFixed(1)}" x2="${(wx + ww / 2).toFixed(1)}" y2="${(wy + wh).toFixed(1)}" stroke="#1a1214" stroke-width="${(3 * sc).toFixed(1)}"/>
        <line x1="${wx.toFixed(1)}" y1="${(wy + wh / 2).toFixed(1)}" x2="${(wx + ww).toFixed(1)}" y2="${(wy + wh / 2).toFixed(1)}" stroke="#1a1214" stroke-width="${(3 * sc).toFixed(1)}"/>`;
    }));
  }
  // gas lamps along this street
  for (let i = 0; i < 4; i++) {
    const lx = 120 + i * 280 + (r % 2) * 120, ly = y + fh + 90 * sc;
    s += `<line x1="${lx}" y1="${ly.toFixed(1)}" x2="${lx}" y2="${(ly - 170 * sc).toFixed(1)}" stroke="#0a0a0e" stroke-width="${(5 * sc).toFixed(1)}"/>
      <rect x="${(lx - 9 * sc).toFixed(1)}" y="${(ly - 192 * sc).toFixed(1)}" width="${(18 * sc).toFixed(1)}" height="${(22 * sc).toFixed(1)}" fill="#ffd27a"/>
      <circle class="${id}-lamp" cx="${lx}" cy="${(ly - 181 * sc).toFixed(1)}" r="${(110 * sc).toFixed(1)}" fill="url(#${id}-lampG)"/>
      <ellipse cx="${lx}" cy="${ly.toFixed(1)}" rx="${(90 * sc).toFixed(1)}" ry="${(18 * sc).toFixed(1)}" fill="#ffc060" opacity="0.18"/>`;
  }
  return { s, target };
}

function l1() {
  const id = "l1", dur = 9.0;
  seed = 19;
  let city = "", tgt = null;
  ROWS.forEach((row) => { const t = terrace(id, row); city += t.s; if (t.target) tgt = t.target; });
  const [tx, ty] = tgt;
  const far = [...Array(18)].map((_, i) => { const x = -60 + i * 70, h = 50 + (i * 37) % 80; return `<path d="M ${x},430 L ${x},${430 - h} L ${x + 34},${400 - h} L ${x + 68},${430 - h} L ${x + 68},440 Z" fill="#141a28"/>`; }).join("");
  const fog = (n, y0, dy, op, sid) => { seed = sid; return [...Array(n)].map((_, i) => `<ellipse id="${id}-fg${sid}-${i}" cx="${(rnd() * 1300 - 110).toFixed(0)}" cy="${(y0 + rnd() * dy).toFixed(0)}" rx="${(420 + rnd() * 300).toFixed(0)}" ry="${(60 + rnd() * 60).toFixed(0)}" fill="url(#${id}-fogG)" opacity="${op}"/>`).join(""); };
  const fogJs = (n, sid, dx, d) => [...Array(n)].map((_, i) => `tl.fromTo("#${id}-fg${sid}-${i}", { x: 0 }, { x: ${(i % 2 ? 1 : -1) * dx * (0.6 + (i % 3) * 0.3)}, duration: ${d}, ease: "none" }, 0);`).join(" ");
  const O = `${tx.toFixed(0)}px ${ty.toFixed(0)}px`, X = (540 - tx).toFixed(0), Y = (900 - ty).toFixed(0);
  const js = `
    cam("city", { scale: 1.0, x: 0, y: 0, origin: "${O}" }, { scale: 3.4, x: ${X}, y: ${Y}, origin: "${O}" }, 0, ${dur}, "power2.inOut");
    cam("fogfar", { scale: 1.0, x: 0, y: 0, origin: "${O}" }, { scale: 2.9, x: ${X}, y: ${Y}, origin: "${O}" }, 0, ${dur}, "power2.inOut");
    cam("fognear", { scale: 1.0, x: 0, y: 0, origin: "${O}" }, { scale: 4.4, x: ${X}, y: ${Y}, origin: "${O}" }, 0, ${dur}, "power2.inOut");
    tl.fromTo("#l1-fognear", { opacity: 1 }, { opacity: 0.15, duration: ${dur * 0.85}, ease: "power1.in" }, 0);
    ${fogJs(10, 1, 140, dur)} ${fogJs(8, 2, 220, dur)}
    flicker(".${id}-lamp", ${dur}, 0.85, 0.08);
    flicker("#win-target", ${dur}, 0.95, 0.05);
  `;
  return { id, dur, html: scene({ id, dur, fadeIn: true, bg: "#05070d", vignette: 0.85,
    layers: [
      { name: "city", defs: `<linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070d"/><stop offset="1" stop-color="#1c2436"/></linearGradient>
          ${glow(`${id}-lampG`, 0, 0, 1, "#ffc874", 0.5).replace('gradientUnits="userSpaceOnUse"', "").replace(/cx="0" cy="0" r="1"/, 'cx="0.5" cy="0.5" r="0.5"')}
          <radialGradient id="${id}-winG"><stop offset="0" stop-color="#ffb04a" stop-opacity="0.6"/><stop offset="1" stop-color="#ffb04a" stop-opacity="0"/></radialGradient>
          <linearGradient id="${id}-haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7f8ba0" stop-opacity="0"/><stop offset="0.5" stop-color="#7f8ba0" stop-opacity="0.4"/><stop offset="1" stop-color="#7f8ba0" stop-opacity="0"/></linearGradient>`, svg: `
        <rect width="1080" height="1920" fill="url(#${id}-sky)"/>
        ${[...Array(30)].map((_, i) => `<circle cx="${(i * 149) % 1080}" cy="${(i * 53) % 330}" r="${1 + (i % 2)}" fill="#cfd8ef" opacity="0.35"/>`).join("")}
        ${clockTower(760, 440, 0.5)}${far}
        <rect y="300" width="1080" height="300" fill="url(#${id}-haze)"/>
        ${city}
        <circle cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" r="90" fill="url(#${id}-winG)" style="mix-blend-mode:screen"/>
        <rect width="1080" height="1920" fill="#0a1430" opacity="0.3" style="mix-blend-mode:multiply"/>` },
      { name: "fogfar", defs: `<radialGradient id="${id}-fogG"><stop offset="0" stop-color="#9aa6b8" stop-opacity="0.85"/><stop offset="0.6" stop-color="#9aa6b8" stop-opacity="0.35"/><stop offset="1" stop-color="#9aa6b8" stop-opacity="0"/></radialGradient>`,
        svg: ROWS.map((row, i) => fog(2, row.y - 40, 80, 0.26, 10 + i)).join("").replace(/fg(\d+)-/g, (m, a) => `fg1-`).replace(/id="l1-fg1-\d+"/g, ((c) => () => `id="l1-fg1-${c++}"`)(0)) },
      { name: "fognear", blur: 10, svg: fog(8, 300, 1500, 0.22, 2) },
    ],
    js: js.replace(`${fogJs(10, 1, 140, dur)}`, fogJs(12, 1, 140, dur)) }) };
}
const S = (l) => `l1-${l}`;


// ── shot 2: the bathroom. Non-graphic: only hair on the water and a limp hand over the rim. ─────────
// The maid, full figure, feet at (0,0), ~1000 tall: black dress, white apron and cap, hands at her face.
function maid(p) {
  const skin = WP.wSkin, skinSh = WP.wSkinSh;
  return `<g id="${p}-body">
    <path d="M -70,-800 C -96,-790 -104,-760 -102,-720 L -150,-20 C -60,10 60,10 150,-20 L 102,-720 C 104,-760 96,-790 70,-800 Z" fill="#141418"/>
    <path d="M -60,-560 L 60,-560 L 96,-120 C 40,-100 -40,-100 -96,-120 Z" fill="#e8e6e0"/><path d="M -60,-560 L 60,-560 L 56,-530 L -56,-530 Z" fill="#cfccc4"/>
    <path d="M -46,-800 L 46,-800 L 30,-760 L -30,-760 Z" fill="#f2f0ea"/>
    <path d="M -150,-20 L 150,-20 L 156,0 L -156,0 Z" fill="#0c0c10"/>
    <g id="${p}-arms">
      <path d="M -70,-790 C -110,-780 -124,-720 -120,-660 L -96,-640 C -94,-700 -84,-740 -64,-760 Z" fill="#1c1c22"/>
      <path d="M -120,-660 L -96,-640 L -50,-840 L -74,-850 Z" fill="#1c1c22"/>
      <path d="M 70,-790 C 110,-780 124,-720 120,-660 L 96,-640 C 94,-700 84,-740 64,-760 Z" fill="#1c1c22"/>
      <path d="M 120,-660 L 96,-640 L 50,-840 L 74,-850 Z" fill="#1c1c22"/>
    </g>
    <g transform="translate(0,-880) scale(0.3)">
      <circle cx="0" cy="-150" r="90" fill="${WP.wHair}"/>
      ${womanHead(`${p}-h`, { scarf: false })}
      <path d="M -120,-150 C -80,-230 80,-230 120,-150 C 80,-170 -80,-170 -120,-150 Z" fill="#f4f2ec"/>
      ${[-100, -60, -20, 20, 60, 100].map((x) => `<circle cx="${x}" cy="${-160 - (100 - Math.abs(x)) * 0.35}" r="18" fill="#f4f2ec"/>`).join("")}
      <ellipse id="${p}-handL" cx="-92" cy="80" rx="36" ry="52" fill="${skinSh}"/><ellipse id="${p}-handR" cx="92" cy="80" rx="36" ry="52" fill="${skin}"/>
    </g>
  </g>`;
}
function l2() {
  const id = "l2", dur = 8.8;
  const tiles = [...Array(9)].map((_, r) => [...Array(14)].map((_, c) => `<rect x="${c * 80 - (r % 2) * 40}" y="${900 + r * 50}" width="78" height="48" fill="${(r + c) % 5 ? "#d8d2c0" : "#cfc8b4"}"/>`).join("")).join("");
  const floorRows = [...Array(10)].map((_, r) => { const y0 = 1360 + r * r * 6 + r * 34, y1 = 1360 + (r + 1) * (r + 1) * 6 + (r + 1) * 34, n = 12; const sh = (y) => (y - 1360) * 0.25;
    return [...Array(n)].map((_, c) => { const x0 = -sh(y0) + c * (1080 + 2 * sh(y0)) / n, x1 = -sh(y0) + (c + 1) * (1080 + 2 * sh(y0)) / n, x2 = -sh(y1) + (c + 1) * (1080 + 2 * sh(y1)) / n, x3 = -sh(y1) + c * (1080 + 2 * sh(y1)) / n;
      return `<polygon points="${x0.toFixed(0)},${y0} ${x1.toFixed(0)},${y0} ${x2.toFixed(0)},${y1} ${x3.toFixed(0)},${y1}" fill="${(r + c) % 2 ? "#1a1a1e" : "#bdb8ac"}"/>`; }).join(""); }).join("");
  const paper = [...Array(8)].map((_, r) => [...Array(7)].map((_, c) => `<path d="M ${c * 160 + (r % 2) * 80},${r * 115 + 40} l 14,-22 l 14,22 l -14,22 Z" fill="#2a4a42" opacity="0.6"/>`).join("")).join("");
  const hair = [...Array(9)].map((_, i) => `<path d="M ${770 + i * 6},1188 C ${740 + i * 4},${1196 + (i % 3) * 4} ${700 - i * 6},${1184 + (i % 2) * 8} ${660 - i * 10},${1192 + (i % 3) * 5}" stroke="${i % 2 ? "#2a1a14" : "#3a261c"}" stroke-width="7" fill="none" stroke-linecap="round"/>`).join("");
  const js = `
    cam("room", { scale: 1.0, x: 0, y: 0, origin: "560px 1250px" }, { scale: 1.42, x: 40, y: -40, origin: "560px 1250px" }, 0, ${dur}, "power1.inOut");
    flicker("#${id}-sconce", ${dur}, 0.9, 0.12);
    mouth("${id}-m-h", "O", 0, 0.01); eyesOpen("${id}-m-h", 1.35, 0, 0.01); brows("${id}-m-h", -16, -8, 0, 0.01); look("${id}-m-h", 8, 4, 0, 0.01);
    tl.fromTo("#${id}-maid", { attr: { transform: "translate(205,1450) scale(0.74)" } }, { attr: { transform: "translate(190,1438) scale(0.72)" }, duration: 0.5, ease: "power3.out" }, 0.2);
    (function () { const el = document.getElementById("${id}-m-body"); const o = { t: 0 };
      tl.fromTo(o, { t: 0 }, { t: ${dur}, duration: ${dur}, ease: "none", onUpdate() { const t = o.t;
        el.setAttribute("transform", "translate(" + (2.2 * Math.sin(t * 37) + 1.2 * Math.sin(t * 59)).toFixed(2) + ",0)"); } }, 0); })();
    blink("${id}-m-h", 3.4, 0.14);
    ${[0, 1, 2, 3, 4].map((k) => `tl.fromTo("#${id}-drop", { attr: { cy: 1158 }, opacity: 1 }, { attr: { cy: 1190 }, opacity: 0.2, duration: 0.3, ease: "power2.in" }, ${(0.8 + k * 1.6).toFixed(2)});
    tl.fromTo("#${id}-ring", { attr: { rx: 2, ry: 1 }, opacity: 0.6 }, { attr: { rx: 46, ry: 7 }, opacity: 0, duration: 1.0, ease: "power1.out" }, ${(1.1 + k * 1.6).toFixed(2)});`).join(" ")}
  `;
  return { id, dur, html: scene({ id, dur, bg: "#06080d", vignette: 0.88,
    layers: [
      { name: "room", defs: glow(`${id}-sg`, 470, 520, 520, "#ffb24a", 0.5) + glow(`${id}-wg`, 860, 520, 700, "#7a9ad8", 0.35) + glow(`${id}-hall`, 200, 1000, 500, "#ffb24a", 0.45), svg: `
        <rect width="1080" height="1920" fill="#1f3a34"/>${paper}
        <rect y="880" width="1080" height="24" fill="#3a2414"/>${tiles}<rect y="1340" width="1080" height="22" fill="#a8a294"/>
        ${floorRows}
        <rect x="70" y="560" width="260" height="880" fill="#2a1a10"/><rect x="88" y="578" width="224" height="862" fill="#3a2a1c"/>
        <rect x="88" y="578" width="224" height="862" fill="url(#${id}-hall)"/>
        <path d="M 312,578 L 360,560 L 360,1460 L 312,1440 Z" fill="#4a2e18"/>
        <rect x="700" y="300" width="300" height="460" fill="#e8e4da"/><rect x="718" y="318" width="264" height="424" fill="#9fb2c8"/>
        <path d="M 850,318 L 850,742 M 718,530 L 982,530" stroke="#e8e4da" stroke-width="12"/>
        <rect x="718" y="318" width="264" height="424" fill="#d0dcea" opacity="0.35"/>
        <g transform="translate(470,600)"><rect x="-10" y="-20" width="20" height="60" fill="#8a6a30"/><path d="M -36,-20 L 36,-20 L 26,-90 L -26,-90 Z" fill="#f0d8a0" opacity="0.9"/></g>
        <rect id="${id}-sconce" width="1080" height="1920" fill="url(#${id}-sg)" style="mix-blend-mode:screen"/>
        <rect width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/>
        <rect x="560" y="700" width="120" height="16" rx="6" fill="#8a6a30"/><path d="M 580,716 L 580,840 L 660,840 L 660,716 Z" fill="#e6e2d8"/>
        <g id="${id}-maid" transform="translate(205,1450) scale(0.74)">${maid(`${id}-m`)}</g>
        <ellipse cx="560" cy="1440" rx="360" ry="34" fill="#000" opacity="0.35"/>
        <path d="M 250,1180 C 250,1300 300,1380 380,1395 L 740,1395 C 820,1380 870,1300 870,1180 Z" fill="#f2f0ea"/>
        <path d="M 270,1200 C 280,1300 320,1360 390,1375" stroke="#d6d2c8" stroke-width="14" fill="none"/>
        <ellipse cx="560" cy="1180" rx="316" ry="34" fill="#f8f6f0"/><ellipse cx="560" cy="1184" rx="290" ry="24" fill="#6a7a8a"/>
        <ellipse cx="560" cy="1186" rx="280" ry="18" fill="#8a9aaa" opacity="0.6"/>
        ${hair}
        <ellipse id="${id}-ring" cx="830" cy="1188" rx="2" ry="1" fill="none" stroke="#cfd8e0" stroke-width="2" opacity="0"/>
        <path d="M 360,1176 C 352,1200 350,1230 356,1256 C 360,1270 372,1272 376,1258 C 380,1236 382,1210 378,1180 Z" fill="${WP.wSkinSh}" opacity="0.95"/>
        <path d="M 352,1250 l -4,22 M 360,1256 l -2,24 M 368,1256 l 0,22 M 376,1252 l 2,18" stroke="${WP.wSkinSh}" stroke-width="7" stroke-linecap="round"/>
        <g transform="translate(850,1130)"><rect x="-8" y="-40" width="16" height="44" fill="#a88a40"/><path d="M -8,-40 L 30,-40 L 30,-28 L -8,-28 Z" fill="#a88a40"/><rect x="24" y="-28" width="10" height="20" fill="#8a6a30"/></g>
        <ellipse id="${id}-drop" cx="879" cy="1158" rx="3.5" ry="5" fill="#cfe0ef"/>
        ${[[330, 1430], [800, 1430]].map(([x, y]) => `<path d="M ${x - 26},${y - 40} C ${x - 30},${y - 10} ${x - 20},${y + 6} ${x},${y + 8} C ${x + 20},${y + 6} ${x + 30},${y - 10} ${x + 26},${y - 40} Z" fill="#a88a40"/>`).join("")}
        <rect width="1080" height="1920" fill="#0a1430" opacity="0.3" style="mix-blend-mode:multiply"/>` },
    ],
    js }) };
}

export default [l1(), l2()];
