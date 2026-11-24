// London murders – shot 1: aerial over old London streets at night, thick fog drifting between Victorian houses;
// the camera eases toward one lit window. Drawn in perspective: a street runs away from the camera to a
// vanishing point; house fronts line both sides, slate roofs and chimneys above, gas lamps along the kerb.
import { scene, glow } from "./lib.mjs";

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
        svg: ROWS.map((row, i) => fog(2, row.y - 40, 80, 0.42, 10 + i)).join("").replace(/fg(\d+)-/g, (m, a) => `fg1-`).replace(/id="l1-fg1-\d+"/g, ((c) => () => `id="l1-fg1-${c++}"`)(0)) },
      { name: "fognear", blur: 10, svg: fog(8, 300, 1500, 0.4, 2) },
    ],
    js: js.replace(`${fogJs(10, 1, 140, dur)}`, fogJs(12, 1, 140, dur)) }) };
}
const S = (l) => `l1-${l}`;

export default [l1()];
