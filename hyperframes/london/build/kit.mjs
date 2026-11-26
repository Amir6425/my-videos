// Cast, props and rooms for the London case (plans 3–19). Flat-vector style shared with the earlier films.
import * as F from "../../forest-cabin/build/chars.mjs";
import { place, glow } from "./lib.mjs";
export { place, glow };

// ── period touches drawn in head coordinates (they move with the head) ──────────────────────────────
export const HAT = {
  bowler: `<path d="M -150,-136 C -150,-166 150,-166 150,-136 C 150,-118 -150,-118 -150,-136 Z" fill="#121214"/><path d="M -104,-148 C -114,-290 114,-290 104,-148 Z" fill="#18181c"/><rect x="-104" y="-170" width="208" height="16" fill="#2a2a30"/>`,
  helmet: `<path d="M -124,-118 C -136,-340 136,-340 124,-118 Z" fill="#141a2e"/><path d="M -146,-120 L 146,-120 L 134,-98 L -134,-98 Z" fill="#0c1020"/>
    <path d="M -20,-236 L 0,-262 L 20,-236 L 14,-196 L -14,-196 Z" fill="#c0c4cc"/><circle cy="-334" r="12" fill="#c0c4cc"/><path d="M -110,-110 C -100,60 100,60 110,-110" stroke="#0c1020" stroke-width="6" fill="none"/>`,
  trilby: `<path d="M -160,-130 C -150,-156 150,-156 160,-130 C 120,-116 -120,-116 -160,-130 Z" fill="#26201a"/><path d="M -100,-144 C -110,-250 -40,-262 0,-236 C 40,-262 110,-250 100,-144 Z" fill="#2e271f"/><rect x="-100" y="-166" width="200" height="16" fill="#151210"/>`,
};
export const STACHE = (col = "#2a1e16", curl = false) => `<path d="M -46,84 C -24,70 -6,74 0,82 C 6,74 24,70 46,84 C 34,94 12,92 0,86 C -12,92 -34,94 -46,84 Z" fill="${col}"/>${curl ? `<path d="M -46,84 c -12,-2 -18,-12 -14,-20 M 46,84 c 12,-2 18,-12 14,-20" stroke="${col}" stroke-width="6" fill="none" stroke-linecap="round"/>` : ""}`;
export const GLASSES = `<g fill="none" stroke="#1a1a1a" stroke-width="5"><circle cx="-44" cy="8" r="30"/><circle cx="44" cy="8" r="30"/><path d="M -14,4 C -6,-2 6,-2 14,4"/></g>`;
const LAPELS = (lapel, shirt = "#ece9e2", tie = "#5a1a1a") => `<path d="M -62,222 L 0,370 L 62,222 Z" fill="${shirt}"/><path d="M -9,236 L 9,236 L 13,388 L 0,410 L -13,388 Z" fill="${tie}"/>
  <path d="M -64,222 L -8,372 L -96,300 Z" fill="${lapel}"/><path d="M 64,222 L 8,372 L 96,300 Z" fill="${lapel}"/>
  ${[0, 1, 2].map((i) => `<circle cx="-24" cy="${470 + i * 90}" r="9" fill="#0c0c0e"/>`).join("")}`;

const C = (o) => ({ iris: "#2e2018", ...o });
export const CAST = {
  bobby:   { c: C({ skin: "#d6a07e", skinSh: "#bb8664", deep: "#8e5a40", hair: "#2a1e16", hairHi: "#3e2e22", shirt: "#1b2340", shirtSh: "#121830", long: true, cuff: "#1b2340" }), kind: "fade", head: HAT.helmet + STACHE("#2a1e16"),
    torso: [0, 1, 2, 3].map((i) => `<circle cx="0" cy="${300 + i * 100}" r="10" fill="#c0c4cc"/>`).join("") + `<rect x="-60" y="222" width="120" height="26" fill="#121830"/>` },
  doctor:  { c: C({ skin: "#d8a888", skinSh: "#bc8c6c", deep: "#8a5a44", hair: "#cfcac0", hairHi: "#eeeae2", shirt: "#4a4a52", shirtSh: "#38383e", long: true }), kind: "old", wrinkles: true, head: GLASSES + STACHE("#cfcac0"), torso: LAPELS("#3c3c44") },
  det:     { c: C({ skin: "#d2a07c", skinSh: "#b68460", deep: "#86563c", hair: "#2a1e16", hairHi: "#3e2e22", shirt: "#5a4632", shirtSh: "#45351f", long: true }), kind: "fade", head: HAT.bowler + STACHE("#2a1e16", true), torso: LAPELS("#4a3a28", "#e6e2da", "#2a2a3a") },
  father:  { c: C({ skin: "#c99878", skinSh: "#ab7a5c", deep: "#7a4a34", hair: "#e4e0d8", hairHi: "#ffffff", shirt: "#3a4a3a", shirtSh: "#2c382c", long: true }), kind: "old", wrinkles: true, head: STACHE("#e4e0d8") + GLASSES,
    torso: `<path d="M -50,222 L 0,330 L 50,222 Z" fill="#e6e2da"/>${[0, 1, 2, 3].map((i) => `<circle cx="0" cy="${360 + i * 80}" r="8" fill="#20281f"/>`).join("")}` },
  george:  { c: C({ skin: "#d6a684", skinSh: "#ba8a68", deep: "#8a5a40", hair: "#16100c", hairHi: "#2e221a", shirt: "#22232a", shirtSh: "#18191e", long: true }), kind: "fade", head: STACHE("#16100c", true), torso: LAPELS("#18191e") },
  bernard: { c: C({ skin: "#dcac8a", skinSh: "#c0906e", deep: "#8c5c44", hair: "#2a2016", hairHi: "#40322a", shirt: "#e6e6e0", shirtSh: "#c8c8c0", long: true, cuff: "#e6e6e0" }), kind: "fade", head: "", torso: LAPELS("#d6d6ce", "#ffffff", "#2a2a44") },
};
// a cast member as a bust (head centre at 0,0), with a serious closed mouth unless told otherwise
export function man(p, who, o = {}) {
  const k = CAST[who];
  return F.friend(p, k.c, { kind: k.kind, wrinkles: !!k.wrinkles, mouth: o.mouth ?? "tense", headExtra: k.head + (o.head || ""), torsoExtra: k.torso || "", propR: o.propR || "", arms: o.arms || [[10, -55], [-10, 55]] });
}
export const manBack = (p, who) => {
  const k = CAST[who];
  // a back view: torso, arms and the back of the head, with the hat on top
  return `<path d="M -175,330 C -170,265 -125,232 -60,222 L 60,222 C 125,232 170,265 175,330 L 200,1300 L -200,1300 Z" fill="${k.c.shirtSh}"/>
    <path d="M -40,60 L -42,236 C -20,250 20,250 42,236 L 40,60 Z" fill="${k.c.skinSh}"/>
    <path d="M -100,-60 C -100,60 -60,130 0,130 C 60,130 100,60 100,-60 C 100,-170 -100,-170 -100,-60 Z" fill="${k.c.hair}"/>
    <ellipse cx="-104" cy="14" rx="15" ry="26" fill="${k.c.skinSh}"/><ellipse cx="104" cy="14" rx="15" ry="26" fill="${k.c.skinSh}"/>
    ${k.head.includes("#121214") || who === "det" ? HAT.bowler : who === "bobby" ? HAT.helmet : ""}`;
};

// ── props ───────────────────────────────────────────────────────────────────────────────────────────
const features = (man) => `<g fill="#1e1e1e"><ellipse cx="-0.10" cy="0.05" rx="0.035" ry="0.022"/><ellipse cx="0.10" cy="0.05" rx="0.035" ry="0.022"/></g>
  <path d="M -0.16,-0.03 C -0.12,-0.06 -0.07,-0.06 -0.04,-0.04 M 0.16,-0.03 C 0.12,-0.06 0.07,-0.06 0.04,-0.04" stroke="#2a2a2a" stroke-width="${man ? 0.022 : 0.014}" fill="none"/>
  <path d="M 0.01,0.06 C 0.02,0.12 0.03,0.16 0.02,0.18" stroke="#8a8a86" stroke-width="0.016" fill="none"/>
  ${man ? "" : `<path d="M -0.06,0.27 C -0.02,0.25 0.02,0.25 0.06,0.27 C 0.03,0.30 -0.03,0.30 -0.06,0.27 Z" fill="#5a5a58"/>`}`;
// a black-and-white portrait of a woman (variant changes the hair), centred at (0,0), w×h
// real archive photos (cropped from the 1912–1915 originals): the three victims in order, and Smith
const REAL = ["assets/img/real/bessie.jpg", "assets/img/real/alice.jpg", "assets/img/real/margaret.jpg"];
let RP = 0;
export function portrait(w, h, v = 0, { man = false, drawn = false, blur = 0 } = {}) {
  if (!drawn) {
    const href = man ? "assets/img/real/smith.jpg" : REAL[v % 3], cid = `rp${RP++}`;
    return `<g><rect x="${-w / 2 - 10}" y="${-h / 2 - 10}" width="${w + 20}" height="${h + 20}" fill="#f2efe6"/>
      <clipPath id="${cid}"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}"/></clipPath>
      <image href="${href}" x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" preserveAspectRatio="xMidYMin slice" clip-path="url(#${cid})" style="filter: grayscale(1) contrast(1.08) brightness(1.02)${blur ? ` blur(${blur}px)` : ""}"/>
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="url(#vigBW)"/></g>`;
  }
  const hair = ["#2a2a2a", "#3e3e3e", "#1e1e1e"][v % 3];
  const face = man
    ? `<path d="M -0.30,0.05 C -0.30,-0.30 0.30,-0.30 0.30,0.05 C 0.30,0.30 0.15,0.42 0,0.42 C -0.15,0.42 -0.30,0.30 -0.30,0.05 Z" fill="#b8b8b4"/>
       <path d="M -0.32,-0.02 C -0.34,-0.36 0.34,-0.36 0.32,-0.02 C 0.26,-0.20 -0.26,-0.20 -0.32,-0.02 Z" fill="#1a1a1a"/>
       <path d="M -0.13,0.26 C -0.06,0.21 0.06,0.21 0.13,0.26 C 0.06,0.29 -0.06,0.29 -0.13,0.26 Z" fill="#2a2a2a"/>
       <path d="M -0.6,0.95 C -0.55,0.55 -0.2,0.45 0,0.45 C 0.2,0.45 0.55,0.55 0.6,0.95 Z" fill="#2c2c2e"/><path d="M -0.08,0.47 L 0,0.62 L 0.08,0.47 Z" fill="#e0e0dc"/>${features(true)}`
    : `<path d="M ${-0.40},0.10 C -0.46,-0.42 0.46,-0.42 0.40,0.10 C 0.42,0.32 0.36,0.52 0.30,0.6 L -0.30,0.6 C -0.36,0.52 -0.42,0.32 -0.40,0.10 Z" fill="${hair}"/>
       ${v === 1 ? `<circle cx="0" cy="-0.42" r="0.14" fill="${hair}"/>` : ""}
       <path d="M -0.26,0.04 C -0.26,-0.28 0.26,-0.28 0.26,0.04 C 0.26,0.28 0.13,0.40 0,0.40 C -0.13,0.40 -0.26,0.28 -0.26,0.04 Z" fill="#c4c4c0"/>
       <path d="M -0.30,-0.06 C -0.24,-0.30 0.24,-0.30 0.30,-0.06 C 0.16,-0.18 -0.16,-0.18 -0.30,-0.06 Z" fill="${hair}"/>
       <path d="M -0.6,0.95 C -0.55,0.58 -0.2,0.48 0,0.48 C 0.2,0.48 0.55,0.58 0.6,0.95 Z" fill="${["#4a4a4c", "#5a5a5c", "#3a3a3c"][v % 3]}"/>
       <path d="M -0.14,0.50 C -0.06,0.58 0.06,0.58 0.14,0.50" stroke="#e8e8e4" stroke-width="0.03" fill="none"/>${features(false)}`;
  return `<g><rect x="${-w / 2 - 10}" y="${-h / 2 - 10}" width="${w + 20}" height="${h + 20}" fill="#f2efe6"/>
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#8a8a88"/>
    <g transform="scale(${w},${h * 0.92})">${face}</g>
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="url(#vigBW)"/></g>`;
}
export const BW_DEFS = `<radialGradient id="vigBW" cx="0.5" cy="0.45" r="0.7"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></radialGradient>`;
// an old paper sheet with lines of writing, top-left at (0,0)
export function paper(w, h, { lines = 8, color = "#e9dfc4", rot = 0 } = {}) {
  return `<g transform="rotate(${rot} ${w / 2} ${h / 2})"><rect x="8" y="10" width="${w}" height="${h}" fill="#000" opacity="0.35"/><rect width="${w}" height="${h}" fill="${color}"/>
    <rect width="${w}" height="${h}" fill="#8a6a3a" opacity="0.08"/>
    ${[...Array(lines)].map((_, i) => `<rect x="${w * 0.1}" y="${h * 0.42 + i * (h * 0.5 / lines)}" width="${w * (0.8 - (i % 3) * 0.12)}" height="${Math.max(3, h * 0.012)}" fill="#3a3024" opacity="0.45"/>`).join("")}</g>`;
}
export const FONTS = `@font-face { font-family: "IRANSans"; src: url('assets/fonts/IRANSans-Black.ttf') format('truetype'); font-weight: 900; }`;
export const T = (x, y, txt, { size = 40, font = "EB Garamond", fill = "#2a2018", anchor = "middle", weight = 700, rtl = false, ls = 0 } = {}) =>
  `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${rtl ? ' direction="rtl"' : ""}${ls ? ` letter-spacing="${ls}"` : ""}>${txt}</text>`;
// a police case file: folder, photo, name, cause of death
export function caseFile(name, cause, v, { w = 440, h = 580 } = {}) {
  return `<g><rect x="12" y="14" width="${w}" height="${h}" fill="#000" opacity="0.4"/>
    <path d="M 0,30 L ${w * 0.35},30 L ${w * 0.42},0 L ${w},0 L ${w},${h} L 0,${h} Z" fill="#c8a868"/>
    <rect x="22" y="44" width="${w - 44}" height="${h - 66}" fill="#efe6cf"/>
    ${T(w / 2, 100, "METROPOLITAN POLICE", { size: 26, ls: 3 })}<line x1="44" y1="118" x2="${w - 44}" y2="118" stroke="#3a3024" stroke-width="2"/>
    <g transform="translate(${w / 2},${h * 0.43})">${portrait(w * 0.48, w * 0.58, v)}</g>
    ${T(w / 2, h * 0.79, name, { size: 40 })}
    ${T(w / 2, h * 0.89, cause, { size: 34, font: "IRANSans", fill: "#7a1a14", weight: 900, rtl: true })}
    <g transform="rotate(-10 ${w - 90} ${h * 0.66})"><rect x="${w - 160}" y="${h * 0.66 - 22}" width="140" height="44" fill="none" stroke="#9a1a14" stroke-width="4"/>${T(w - 90, h * 0.66 + 10, "CLOSED", { size: 26, fill: "#9a1a14" })}</g></g>`;
}
// a desk seen from above
export const deskTop = (col = "#4a2e1a") => `<rect width="1080" height="1920" fill="${col}"/>${[...Array(18)].map((_, i) => `<path d="M -20,${i * 112 + 20} C 300,${i * 112 + 6} 700,${i * 112 + 40} 1100,${i * 112 + 16}" stroke="#3a2212" stroke-width="${3 + (i % 3)}" fill="none" opacity="0.55"/>`).join("")}`;

// ── rooms ───────────────────────────────────────────────────────────────────────────────────────────
export function bathroom({ wall = "#2a3a44", tile = "#bfc6c8", floorA = "#1a1a1e", floorB = "#9aa0a2", tubX = 560, tubY = 1180, door = true } = {}) {
  const tiles = [...Array(9)].map((_, r) => [...Array(14)].map((_, c) => `<rect x="${c * 80 - (r % 2) * 40}" y="${900 + r * 50}" width="78" height="48" fill="${(r + c) % 5 ? tile : "#a8b0b2"}"/>`).join("")).join("");
  const floor = [...Array(10)].map((_, r) => { const y0 = 1360 + r * r * 6 + r * 34, y1 = 1360 + (r + 1) * (r + 1) * 6 + (r + 1) * 34, sh = (y) => (y - 1360) * 0.25;
    return [...Array(12)].map((_, c) => { const q = (y, k) => -sh(y) + k * (1080 + 2 * sh(y)) / 12; return `<polygon points="${q(y0, c).toFixed(0)},${y0} ${q(y0, c + 1).toFixed(0)},${y0} ${q(y1, c + 1).toFixed(0)},${y1} ${q(y1, c).toFixed(0)},${y1}" fill="${(r + c) % 2 ? floorA : floorB}"/>`; }).join(""); }).join("");
  return `<rect width="1080" height="1920" fill="${wall}"/><rect y="880" width="1080" height="24" fill="#2a1a10"/>${tiles}<rect y="1340" width="1080" height="22" fill="#8a9092"/>${floor}
    ${door ? `<rect x="70" y="560" width="260" height="880" fill="#1a120c"/><rect x="88" y="578" width="224" height="862" fill="#2a2018"/>` : ""}
    <rect x="700" y="300" width="300" height="460" fill="#d8dcdc"/><rect x="718" y="318" width="264" height="424" fill="#7f92a8"/><path d="M 850,318 L 850,742 M 718,530 L 982,530" stroke="#d8dcdc" stroke-width="12"/>`;
}
export function tub(x = 560, y = 1180, { water = "#56687a" } = {}) {
  return `<ellipse cx="${x}" cy="${y + 260}" rx="360" ry="34" fill="#000" opacity="0.35"/>
    <path d="M ${x - 310},${y} C ${x - 310},${y + 120} ${x - 260},${y + 200} ${x - 180},${y + 215} L ${x + 180},${y + 215} C ${x + 260},${y + 200} ${x + 310},${y + 120} ${x + 310},${y} Z" fill="#eeece6"/>
    <path d="M ${x - 290},${y + 20} C ${x - 280},${y + 120} ${x - 240},${y + 180} ${x - 170},${y + 195}" stroke="#d0ccc2" stroke-width="14" fill="none"/>
    <ellipse cx="${x}" cy="${y}" rx="316" ry="34" fill="#f6f4ee"/><ellipse cx="${x}" cy="${y + 4}" rx="290" ry="24" fill="${water}"/>
    ${[[x - 250, y + 245], [x + 250, y + 245]].map(([fx, fy]) => `<path d="M ${fx - 26},${fy - 40} C ${fx - 30},${fy - 10} ${fx - 20},${fy + 6} ${fx},${fy + 8} C ${fx + 20},${fy + 6} ${fx + 30},${fy - 10} ${fx + 26},${fy - 40} Z" fill="#a88a40"/>`).join("")}`;
}
export function policeRoom() {
  return `<rect width="1080" height="1920" fill="#2a332e"/><rect y="1180" width="1080" height="740" fill="#3a2a1c"/><rect y="1170" width="1080" height="20" fill="#4a3624"/>
    <rect x="80" y="300" width="920" height="760" fill="#6a4a2a"/><rect x="100" y="320" width="880" height="720" fill="#a07848"/>
    ${[...Array(40)].map((_, i) => `<circle cx="${120 + (i * 97) % 840}" cy="${340 + (i * 61) % 680}" r="2" fill="#7a5a34"/>`).join("")}
    <rect x="860" y="80" width="160" height="200" fill="#1a2028"/>${[...Array(8)].map((_, i) => `<rect x="860" y="${90 + i * 24}" width="160" height="10" fill="#3a4450"/>`).join("")}`;
}
export function cobbleStreet({ day = false, fogOp = 0.25 } = {}) {
  const sky = day ? "#8a8e92" : "#0a0e18", wall = day ? "#5a4a40" : "#241c1c", win = day ? "#3a4048" : "#d89a48";
  const facades = [...Array(7)].map((_, i) => { const x = -40 + i * 170, h = 900 + (i % 3) * 120; return `<rect x="${x}" y="${1300 - h}" width="168" height="${h}" fill="${i % 2 ? wall : day ? "#4e4038" : "#2a2020"}"/>
      ${[0, 1, 2, 3].map((r) => [0, 1].map((c) => `<rect x="${x + 28 + c * 70}" y="${1300 - h + 80 + r * 200}" width="44" height="110" fill="${(i + r + c) % 4 === 0 && !day ? win : day ? "#2e343c" : "#121620"}"/>`).join("")).join("")}`; }).join("");
  return `<rect width="1080" height="1920" fill="${sky}"/>${facades}<rect y="1300" width="1080" height="620" fill="${day ? "#4a4a4c" : "#16171c"}"/>
    ${[...Array(10)].map((_, i) => `<path d="M 0,${1320 + i * i * 7 + i * 20} L 1080,${1320 + i * i * 7 + i * 20}" stroke="${day ? "#3a3a3c" : "#0e0f12"}" stroke-width="3"/>`).join("")}
    ${[160, 900].map((x) => `<rect x="${x - 6}" y="760" width="12" height="560" fill="#0a0a0c"/><rect x="${x - 22}" y="720" width="44" height="50" fill="${day ? "#9a9a8a" : "#ffd27a"}"/>${day ? "" : `<circle cx="${x}" cy="745" r="160" fill="url(#lampG)"/>`}`).join("")}
    <rect width="1080" height="1920" fill="#9aa6b8" opacity="${fogOp}"/>`;
}
export const LAMP_DEFS = `<radialGradient id="lampG"><stop offset="0" stop-color="#ffc874" stop-opacity="0.5"/><stop offset="1" stop-color="#ffc874" stop-opacity="0"/></radialGradient>`;
