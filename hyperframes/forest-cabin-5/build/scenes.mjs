// Part five: inside the old man's cabin. Arash (red) drips at the door; "alone?"; "then you weren't chosen either";
// tea on a torn map; "drink, it's a long night"; the old man walks out into the storm. Planted for later parts:
// the desk with drawers, the alarm clock set to 06:00 (on the desk whenever it's seen), the map scrap under the glass.
import { scene, place, glow } from "../../forest-cabin/build/lib.mjs";
import * as C from "../../forest-cabin/build/chars.mjs";
const { RED, OLD, BLUE, WHITE } = C;

let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const WET = { ...RED, shirt: "#8e2a28", shirtSh: "#6e1e1c", hair: "#140e0b" };
const RED_T = (id, extra = {}) => C.friend(id, WET, { kind: "wavy", mouth: "tense", ...extra });
const OLD_M = (id, extra = {}) => C.friend(id, OLD, { kind: "old", beard: true, wrinkles: true, mouth: "old", ...extra });
// the old man's trousers and boots instead of jeans and sneakers
const oldFix = (s) => s.replace(/#2c3650/g, "#3a3028").replace(/#232b40/g, "#2a221c").replace(/#eceef2/g, "#2a1c14").replace(/#9aa0ac/g, "#1a120c");
const OLD_FULL = (p, back = true) => oldFix(C.friendFull(p, "o", { back }).replace(/(<g id="[^"]+-head">[\s\S]*?)(<\/g>\s*<\/g>\s*<\/g>\s*$)/, (m, a) => a + DOME + "</g></g></g>"));
const DOME = `<path d="M -114,-20 C -122,-290 122,-290 114,-20 C 108,60 70,104 0,108 C -70,104 -108,60 -114,-20 Z" fill="${OLD.skin}"/><path d="M -60,120 C -20,128 20,128 60,120 M -50,140 C -16,146 16,146 50,140" stroke="${OLD.deep}" stroke-width="3" fill="none" opacity="0.5"/><path d="M 40,-180 C 90,-150 104,-90 100,-40 C 80,-30 70,-60 60,-90 Z" fill="${OLD.skinSh}" opacity="0.6"/>
  <path d="M -112,10 C -104,80 -60,110 0,114 C 60,110 104,80 112,10 C 98,58 60,84 0,86 C -60,84 -98,58 -112,10 Z" fill="${OLD.hair}"/><ellipse cx="-112" cy="10" rx="16" ry="28" fill="${OLD.skinSh}"/><ellipse cx="112" cy="10" rx="16" ry="28" fill="${OLD.skinSh}"/>`;
const OLD_BACK = (p) => C.friendBack(p, "o").replace(/<\/g>\s*$/, DOME + "</g>");
const FELT = `<path d="M -112,-112 C -118,-262 118,-262 112,-112 C 70,-128 -70,-128 -112,-112 Z" fill="#8a6a48"/><path d="M -112,-112 C -70,-128 70,-128 112,-112 L 114,-96 C 70,-112 -70,-112 -114,-96 Z" fill="#6a4e34"/>
  <path d="M -60,-220 C -20,-240 30,-238 70,-214" stroke="#a88660" stroke-width="8" fill="none" opacity="0.6" stroke-linecap="round"/>`;

// ── JS snippets ──────────────────────────────────────────────────────────────────────────────────
// fire: flames breathe with sums of sines of timeline time
const fireJs = (id, dur, n = 3) => `(function () { const o = { t: 0 }; tl.to(o, { t: ${dur}, duration: ${dur}, ease: "none", onUpdate() { const t = o.t;
  ${[...Array(n)].map((_, i) => `gsap.set("#${id}-fl${i}", { scaleY: ${0.85} + 0.18 * Math.sin(t * ${7 + i * 3.1} + ${i}) + 0.08 * Math.sin(t * ${17 + i * 5}), scaleX: 1 + 0.06 * Math.sin(t * ${5 + i * 2.3}), transformOrigin: "50% 100%" });`).join(" ")}
  gsap.set("#${id}-fglow", { opacity: 0.8 + 0.12 * Math.sin(t * 9.1) + 0.08 * Math.sin(t * 23.7 + 1.3) }); } }, 0); })();`;
// rain streaks in a window: the group slides down and wraps (repeat), deterministic
const rainJs = (id, dur, h = 420, per = 0.45) => `tl.fromTo("#${id}-rn", { y: ${-h} }, { y: 0, duration: ${per}, ease: "none", repeat: ${Math.ceil(dur / per)} }, 0);`;
// a seconds hand that ticks once a second
const tickJs = (id, dur, s0 = 20) => `(function () { const el = document.getElementById("${id}-sec"); if (!el) return; const o = { t: 0 };
  tl.to(o, { t: ${dur}, duration: ${dur}, ease: "none", onUpdate() { el.setAttribute("transform", "rotate(" + ((${s0} + Math.floor(o.t)) * 6) + ")"); } }, 0); })();`;
// shake a wrapper group (its transform attribute is ours)
const shakeJs = (sel, t0, dur, amp, f = 1) => `(function () { const el = document.querySelector("${sel}"); const o = { t: 0 };
  tl.fromTo(o, { t: 0 }, { t: ${dur}, duration: ${dur}, ease: "none", onUpdate() { const t = o.t;
    const x = ${amp} * (Math.sin(t * 7.3 * ${f}) * 0.6 + Math.sin(t * 13.1 * ${f} + 1) * 0.4), y = ${amp} * (Math.sin(t * 9.7 * ${f} + 2) * 0.6 + Math.sin(t * 17.3 * ${f}) * 0.4);
    el.setAttribute("transform", "translate(" + x.toFixed(1) + "," + y.toFixed(1) + ")"); } }, ${t0}); })();`;
const tw = (sel, from, to, t, d, ease = "power2.inOut") => `tl.fromTo("${sel}", { attr: { transform: "${from}" } }, { attr: { transform: "${to}" }, duration: ${d}, ease: "${ease}" }, ${t});`;
const T = (x, y, s = 1, r = 0) => `translate(${x},${y}) scale(${s}) rotate(${r})`;
const walk = (p, t0, n, step, amp = 16) => [...Array(n)].map((_, k) => {
  const a = k % 2 ? 1 : -1, t = (t0 + k * step).toFixed(2);
  return `tl.to("#${p}-legL", { rotation: ${amp * a}, svgOrigin: "-60 600", duration: ${step}, ease: "sine.inOut" }, ${t});
    tl.to("#${p}-legR", { rotation: ${-amp * a}, svgOrigin: "60 600", duration: ${step}, ease: "sine.inOut" }, ${t});
    tl.to("#${p}-body", { y: -12, duration: ${(step / 2).toFixed(2)}, ease: "sine.out" }, ${t}); tl.to("#${p}-body", { y: 0, duration: ${(step / 2).toFixed(2)}, ease: "sine.in" }, ${(t0 + k * step + step / 2).toFixed(2)});`;
}).join("\n");
const armTo = (p, side, a, b, t, d, ease = "power2.inOut") => { const x = C.armT(side, a, b), s = side < 0 ? "L" : "R";
  return `tl.to("#${p}-arm${s}u", { attr: { transform: "${x.u}" }, duration: ${d}, ease: "${ease}" }, ${t}); tl.to("#${p}-arm${s}f", { attr: { transform: "${x.f}" }, duration: ${d}, ease: "${ease}" }, ${t});`; };
// drops that fall from a point again and again
const drops = (id, pts) => pts.map(([x, y], i) => `<path id="${id}-dp${i}" d="M ${x},${y} c -5,8 -7,13 0,16 c 7,-3 5,-8 0,-16 Z" fill="#cfe4ff" opacity="0"/>`).join("");
const dropsJs = (id, pts, dur, fall = 260) => pts.map((_, i) => { const per = 0.7 + (i % 3) * 0.17, t0 = (i * 0.23) % per;
  return `tl.fromTo("#${id}-dp${i}", { y: 0, opacity: 0.9 }, { y: ${fall}, opacity: 0, duration: ${per.toFixed(2)}, ease: "power1.in", repeat: ${Math.ceil(dur / per)} }, ${t0.toFixed(2)});`; }).join(" ");

// ── set pieces ───────────────────────────────────────────────────────────────────────────────────
// the alarm clock: base at (0,0); time 11:47, the gold alarm hand set to 6 (06:00), red seconds hand ticks
function clock(id) {
  const cy = -96, R = 60;
  const ticks = [...Array(12)].map((_, i) => { const a = i * 30 * Math.PI / 180, r1 = i % 3 ? 50 : 44;
    return `<path d="M ${(r1 * Math.sin(a)).toFixed(1)},${(-r1 * Math.cos(a)).toFixed(1)} L ${(54 * Math.sin(a)).toFixed(1)},${(-54 * Math.cos(a)).toFixed(1)}" stroke="#2a2018" stroke-width="${i % 3 ? 2 : 4}"/>`; }).join("");
  const num = (n, a) => `<text x="${(36 * Math.sin(a)).toFixed(1)}" y="${(-36 * Math.cos(a) + 6).toFixed(1)}" font-family="Georgia, serif" font-weight="700" font-size="17" fill="#2a2018" text-anchor="middle">${n}</text>`;
  return `<g>
    <ellipse cx="0" cy="4" rx="70" ry="10" fill="#000" opacity="0.4"/>
    <path d="M -40,-40 L -56,0 M 40,-40 L 56,0" stroke="#8a6a2a" stroke-width="8" stroke-linecap="round"/>
    <path d="M -36,${cy - 62} C -50,${cy - 100} -96,${cy - 80} -74,${cy - 52} Z" fill="#c9a24a"/><path d="M 36,${cy - 62} C 50,${cy - 100} 96,${cy - 80} 74,${cy - 52} Z" fill="#c9a24a"/>
    <path d="M 0,${cy - 60} L 0,${cy - 82}" stroke="#8a6a2a" stroke-width="6"/><circle cx="0" cy="${cy - 86}" r="7" fill="#8a6a2a"/>
    <circle cx="0" cy="${cy}" r="${R + 8}" fill="#b08a3a"/><circle cx="0" cy="${cy}" r="${R + 2}" fill="#d9b45a"/><circle cx="0" cy="${cy}" r="${R - 2}" fill="#f2ead6"/>
    <g transform="translate(0,${cy})">${ticks}${num(12, 0)}${num(3, Math.PI / 2)}${num(6, Math.PI)}${num(9, Math.PI * 1.5)}
      <g transform="rotate(180)"><path d="M -2,6 L 2,6 L 1.5,-40 L -1.5,-40 Z" fill="#c9a24a"/><path d="M -7,-36 L 7,-36 L 0,-48 Z" fill="#c9a24a"/></g>
      <g transform="rotate(353.5)"><path d="M -4,6 L 4,6 L 2,-30 L -2,-30 Z" fill="#1a140e"/></g>
      <g transform="rotate(282)"><path d="M -3,8 L 3,8 L 1.5,-46 L -1.5,-46 Z" fill="#1a140e"/></g>
      <g id="${id}-sec" transform="rotate(120)"><path d="M -1,12 L 1,12 L 0.6,-50 L -0.6,-50 Z" fill="#b8282a"/></g>
      <circle r="5" fill="#2a2018"/><circle r="2" fill="#c9a24a"/></g>
    <path d="M -44,${cy - 30} C -30,${cy - 52} 0,${cy - 58} 20,${cy - 54}" stroke="#fff" stroke-width="5" fill="none" opacity="0.35" stroke-linecap="round"/>
  </g>`;
}
// the torn scrap of a forest map: local centre (0,0), about 220 × 150
function mapScrap(id) {
  return `<g><path d="M -118,-70 L -60,-80 L -40,-72 L 20,-84 L 60,-74 L 118,-82 L 112,-30 L 122,10 L 110,52 L 118,78 L 60,72 L 30,84 L -20,74 L -70,82 L -116,74 L -108,30 L -122,-10 L -110,-40 Z" fill="#d8c7a0"/>
    <path d="M -118,-70 L -60,-80 L -40,-72 L 20,-84 L 60,-74 L 118,-82 L 112,-30 L 122,10 L 110,52 L 118,78 L 60,72 L 30,84 L -20,74 L -70,82 L -116,74 L -108,30 L -122,-10 L -110,-40 Z" fill="none" stroke="#a8946a" stroke-width="3"/>
    ${[[-80, -40], [-60, -10], [-90, 20], [40, -50], [70, -30], [90, 30], [-30, 50], [60, 50]].map(([x, y]) => `<path d="M ${x},${y - 12} L ${x - 8},${y + 4} L ${x + 8},${y + 4} Z" fill="#4a6a3a"/>`).join("")}
    <path d="M -110,40 C -60,20 -20,30 10,0 C 40,-30 70,-20 110,-50" stroke="#7a2a1a" stroke-width="4" stroke-dasharray="10 8" fill="none"/>
    <path d="M -100,-60 C -50,-50 -20,-70 30,-60" stroke="#4a7aa8" stroke-width="5" fill="none" opacity="0.8"/>
    <g transform="translate(12,2)"><rect x="-10" y="-6" width="20" height="14" fill="#5a3a22"/><path d="M -13,-6 L 0,-16 L 13,-6 Z" fill="#3a2414"/></g>
    <g transform="translate(-88,58)" stroke="#5a4a32" stroke-width="2" fill="none"><circle r="12"/><path d="M 0,-16 L 0,16 M -16,0 L 16,0"/></g></g>`;
}
// the tea glass (استکان): base at (0,0)
const glass = (id, tea = 1) => `<g><ellipse cx="0" cy="2" rx="34" ry="7" fill="#000" opacity="0.35"/>
  <path d="M -26,-96 C -30,-70 -14,-58 -16,-30 C -18,-14 -24,-6 -22,0 L 22,0 C 24,-6 18,-14 16,-30 C 14,-58 30,-70 26,-96 Z" fill="#e8f2f6" opacity="0.35"/>
  <g id="${id}-tea" opacity="${tea}"><path d="M -24,-84 C -26,-66 -14,-58 -16,-30 C -18,-14 -22,-6 -21,-2 L 21,-2 C 22,-6 18,-14 16,-30 C 14,-58 26,-66 24,-84 Z" fill="#8a2a12" opacity="0.9"/><ellipse cx="0" cy="-84" rx="24" ry="5" fill="#b8481e"/></g>
  <path d="M -26,-96 C -30,-70 -14,-58 -16,-30 C -18,-14 -24,-6 -22,0 L 22,0 C 24,-6 18,-14 16,-30 C 14,-58 30,-70 26,-96" fill="none" stroke="#f4fbff" stroke-width="3" opacity="0.7"/>
  <path d="M -14,-80 C -18,-66 -8,-56 -10,-38" stroke="#fff" stroke-width="4" opacity="0.5" fill="none" stroke-linecap="round"/></g>`;
const kettle = `<g><ellipse cx="0" cy="0" rx="78" ry="12" fill="#000" opacity="0.4"/>
  <path d="M -70,-6 C -84,-60 -60,-110 0,-112 C 60,-110 84,-60 70,-6 Z" fill="#1c1c20"/><path d="M -50,-100 C -20,-118 20,-118 50,-100 L 40,-122 L -40,-122 Z" fill="#26262c"/><circle cx="0" cy="-128" r="10" fill="#2e2e34"/>
  <path d="M 64,-50 C 96,-56 110,-84 128,-108 L 136,-100 C 118,-70 104,-40 70,-28 Z" fill="#1c1c20"/>
  <path d="M -56,-100 C -60,-180 60,-180 56,-100" stroke="#2a2a30" stroke-width="10" fill="none"/>
  <path d="M -40,-80 C -44,-50 -40,-30 -32,-18" stroke="#5a5a66" stroke-width="6" fill="none" opacity="0.6" stroke-linecap="round"/></g>`;
// the desk: top front edge at local y 0; drawers in a pedestal on the left, a panel on the right; ~560 wide
function desk(id, items = "") {
  return `<g><rect x="-290" y="-70" width="580" height="54" fill="#5a3a20"/><path d="M -300,-70 L 300,-70 L 286,-90 L -286,-90 Z" fill="#6a4628"/>
    <rect x="-300" y="-20" width="600" height="22" fill="#3e2614"/>
    <rect x="-280" y="2" width="220" height="420" fill="#4a2e18"/><rect x="-60" y="2" width="330" height="420" fill="#3a2414"/>
    ${[0, 1, 2].map((i) => `<rect x="-266" y="${16 + i * 134}" width="192" height="120" rx="6" fill="#5a3a20" stroke="#2e1a0c" stroke-width="4"/><rect x="-196" y="${66 + i * 134}" width="52" height="14" rx="7" fill="#c9a24a"/>`).join("")}
    <rect x="-40" y="16" width="290" height="70" rx="6" fill="#5a3a20" stroke="#2e1a0c" stroke-width="4"/><rect x="80" y="44" width="52" height="14" rx="7" fill="#c9a24a"/>
    <path d="M -40,110 L 250,110 M -40,200 L 250,200 M -40,290 L 250,290" stroke="#2e1a0c" stroke-width="3" opacity="0.6"/>
    ${items}</g>`;
}
function chair(id) {
  return `<g><rect x="-110" y="-360" width="22" height="560" fill="#3a2414"/><rect x="88" y="-360" width="22" height="560" fill="#3a2414"/>
    ${[0, 1, 2].map((i) => `<rect x="-100" y="${-340 + i * 70}" width="200" height="22" rx="6" fill="#4a2e18"/>`).join("")}
    <rect x="-130" y="-10" width="260" height="34" rx="6" fill="#5a3a20"/><rect x="-120" y="24" width="20" height="200" fill="#3a2414"/><rect x="100" y="24" width="20" height="200" fill="#3a2414"/></g>`;
}
// the room seen from the middle of the floor: door left, window centre-left, desk, stone fireplace right
function room(id, { door = true, deskItems = "", kettleOn = true, fireGlow = true, deskOn = true } = {}) {
  seed = 11;
  const logs = [...Array(24)].map((_, i) => `<rect x="0" y="${120 + i * 54}" width="1080" height="50" rx="22" fill="${i % 2 ? "#3a2616" : "#33210f"}"/><path d="M ${(i * 137) % 900},${140 + i * 54} l 60,4" stroke="#24160a" stroke-width="3"/>`).join("");
  const stones = [...Array(60)].map((_, i) => { const c = i % 6, r = Math.floor(i / 6); const x = 650 + c * 64 + (r % 2) * 30, y = 660 + r * 72;
    return `<rect x="${x}" y="${y}" width="${58 + rnd() * 10}" height="${62 + rnd() * 8}" rx="18" fill="${["#5a5048", "#4a4038", "#6a5e52", "#544a42"][i % 4]}"/>`; }).join("");
  const chim = [...Array(20)].map((_, i) => { const c = i % 4, r = Math.floor(i / 4); return `<rect x="${716 + c * 62 + (r % 2) * 24}" y="${120 + r * 104}" width="56" height="96" rx="16" fill="${["#4a4038", "#544a42", "#5a5048"][i % 3]}"/>`; }).join("");
  const rain = [...Array(26)].map((_, i) => `<path d="M ${350 + (i * 37) % 230},${(i * 71) % 420} l -6,46" stroke="#9ab4d8" stroke-width="2.5" opacity="0.55"/>`).join("");
  return `<rect width="1080" height="1920" fill="#2a1a0e"/>${logs}
    <rect x="0" y="0" width="1080" height="130" fill="#1a1008"/>${[0, 1, 2, 3].map((i) => `<rect x="${60 + i * 280}" y="0" width="70" height="150" fill="#24160a"/>`).join("")}
    <path d="M 0,1400 L 1080,1400 L 1080,1920 L 0,1920 Z" fill="#26170c"/>
    ${[...Array(14)].map((_, i) => `<path d="M ${-300 + i * 120},1920 L ${300 + i * 37},1400" stroke="#1a0f06" stroke-width="4"/>`).join("")}
    ${[...Array(6)].map((_, i) => `<path d="M 0,${1440 + i * i * 16} L 1080,${1440 + i * i * 16}" stroke="#1a0f06" stroke-width="3" opacity="0.6"/>`).join("")}
    <ellipse cx="560" cy="1720" rx="420" ry="120" fill="#5a1e1a"/><ellipse cx="560" cy="1720" rx="380" ry="100" fill="none" stroke="#a8742a" stroke-width="8" stroke-dasharray="20 12"/>
    ${door ? `<g><rect x="20" y="700" width="230" height="710" fill="#1a1008"/><rect x="34" y="714" width="202" height="696" fill="#4a3020"/>
      ${[0, 1, 2, 3].map((i) => `<rect x="${40 + i * 50}" y="720" width="44" height="684" fill="${i % 2 ? "#52361f" : "#4a3020"}"/>`).join("")}
      <rect x="40" y="820" width="190" height="20" fill="#2a1a0e"/><rect x="40" y="1260" width="190" height="20" fill="#2a1a0e"/><circle cx="210" cy="1060" r="12" fill="#8a7040"/></g>
      <circle cx="292" cy="760" r="6" fill="#1a1008"/><g transform="translate(292,792) scale(0.42)"><g id="${id}-nailhat">${FELT}</g></g>` : ""}
    <g><rect x="320" y="520" width="290" height="400" fill="#1a1008"/><rect x="336" y="536" width="258" height="368" fill="#0b1430"/>
      <clipPath id="${id}-wclip"><rect x="336" y="536" width="258" height="368"/></clipPath><g clip-path="url(#${id}-wclip)"><g id="${id}-rn">${rain}<g transform="translate(0,420)">${rain}</g></g>
        ${[...Array(5)].map((_, i) => `<path d="M ${330 + i * 70},904 L ${360 + i * 70},760 L ${390 + i * 70},904 Z" fill="#050a14"/>`).join("")}</g>
      <path d="M 465,536 L 465,904 M 336,720 L 594,720" stroke="#1a1008" stroke-width="12"/><rect x="306" y="910" width="318" height="20" fill="#3a2414"/></g>
    <rect x="420" y="420" width="190" height="14" fill="#3a2414"/><rect x="430" y="370" width="26" height="50" fill="#7a5a3a"/><rect x="462" y="380" width="22" height="40" fill="#5a3a2a"/><ellipse cx="530" cy="404" rx="24" ry="18" fill="#6a7a5a"/><rect x="560" y="376" width="30" height="44" fill="#8a4a2a"/>
    ${chim}${stones}
    <rect x="610" y="610" width="460" height="46" fill="#3a2412"/><rect x="600" y="600" width="480" height="16" fill="#4a2e18"/>
    <rect x="660" y="560" width="22" height="44" fill="#e8dcc0"/><path d="M 671,548 C 664,556 666,562 671,566 C 676,562 678,556 671,548 Z" fill="#ffcf6a"/><rect x="980" y="540" width="40" height="64" rx="8" fill="#6a5a4a"/>
    <path d="M 720,1400 L 720,1060 C 720,960 960,960 960,1060 L 960,1400 Z" fill="#120a06"/>
    <g transform="translate(840,1380)"><rect x="-90" y="-26" width="180" height="22" rx="10" fill="#3a2010" transform="rotate(-6)"/><rect x="-80" y="-30" width="160" height="22" rx="10" fill="#2e1a0c" transform="rotate(8)"/>
      <path id="${id}-fl0" d="M -70,-20 C -80,-90 -40,-120 -30,-180 C -10,-120 10,-110 0,-20 Z" fill="#e8601e"/>
      <path id="${id}-fl1" d="M -30,-20 C -40,-110 10,-150 10,-230 C 40,-150 60,-110 40,-20 Z" fill="#f08a26"/>
      <path id="${id}-fl2" d="M 0,-20 C 0,-80 30,-100 40,-150 C 60,-100 76,-70 64,-20 Z" fill="#ffc24a"/></g>
    ${kettleOn ? `<g transform="translate(770,1386) scale(0.55)">${kettle}</g>` : ""}
    <rect x="700" y="1396" width="280" height="16" fill="#3a3430"/>
    ${fireGlow ? `<rect id="${id}-fglow" width="1080" height="1920" fill="url(#${id}-fg)" style="mix-blend-mode:screen"/>` : ""}
    ${deskOn ? `<g transform="translate(500,1500)">${desk(id, deskItems)}</g>` : ""}`;
}
const roomDefs = (id) => glow(`${id}-fg`, 840, 1250, 980, "#ff9a40", 0.42);
const deskClock = (id, x = 190) => `<g transform="translate(${x},-80) scale(0.62)">${clock(id)}</g>`;
const warm = (op = 0.25) => `<rect width="1080" height="1920" fill="#3a1a06" opacity="${op}" style="mix-blend-mode:multiply"/>`;
const dark = (op) => `<rect width="1080" height="1920" fill="#05030a" opacity="${op}"/>`;

// ── 1. at the door: his shaking hands, then up to his frightened face ─────────────────────────────
function f1(dur) {
  const id = "f1", r = `${id}-r`, aL = [4, -40], aR = [-4, 40];
  const dp = [[-150 + 0, 640], [150, 640], [-130, 660], [130, 650], [-60, -180], [80, -170]];
  return { id, dur, html: scene({ id, dur, bg: "#05060c", vignette: 0.85,
    layers: [
      { name: "bg", blur: 10, svg: `<rect width="1080" height="1920" fill="#2a1a0e"/><rect x="220" y="0" width="640" height="1920" fill="#060a14"/>
        <g id="${id}-rn">${[...Array(40)].map((_, i) => `<path d="M ${230 + (i * 53) % 620},${(i * 97) % 1920} l -10,80" stroke="#7a94c0" stroke-width="3" opacity="0.5"/>`).join("")}</g>
        <rect x="160" y="0" width="70" height="1920" fill="#1a1008"/><rect x="850" y="0" width="70" height="1920" fill="#1a1008"/>` },
      { name: "char", defs: glow(`${id}-wg`, 1100, 700, 900, "#ff9a40", 0.55), svg: `<g id="${id}-sh">${place(540, 560, 1.9, RED_T(r, { arms: [aL, aR] }) + drops(id, dp), `${r}-all`)}</g>
        <rect width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/>${warm(0.15)}` },
    ],
    js: `${rainJs(id, dur, 1920, 0.6).replace(`y: ${-1920}`, "y: -240").replace("y: 0,", "y: 240,")}
    cam("char", { y: -880, scale: 1.0 }, { y: 120, scale: 1.0 }, 0.6, 5.2, "sine.inOut"); cam("bg", { y: -200 }, { y: 40 }, 0.6, 5.2);
    eyesOpen("${r}", 1.25, 0, 0.01); brows("${r}", -14, -12, 0, 0.01); look("${r}", 0, 1, 0, 0.01);
    tl.fromTo("#${r}-torso", { y: 0 }, { y: -9, duration: 0.24, ease: "sine.inOut", yoyo: true, repeat: ${Math.floor(dur / 0.24) - 1} }, 0);
    tl.fromTo("#${r}-head", { y: 0 }, { y: -5, duration: 0.24, ease: "sine.inOut", yoyo: true, repeat: ${Math.floor(dur / 0.24) - 1} }, 0.05);
    (function () { const L = document.getElementById("${r}-armLf"), R = document.getElementById("${r}-armRf"); const o = { t: 0 };
      tl.to(o, { t: ${dur}, duration: ${dur}, ease: "none", onUpdate() { const t = o.t, j = 2.2 * Math.sin(t * 43) + 1.2 * Math.sin(t * 71 + 1);
        L.setAttribute("transform", "rotate(" + (${aL[1]} + j).toFixed(2) + " -150 415)"); R.setAttribute("transform", "rotate(" + (${aR[1]} - j).toFixed(2) + " 150 415)"); } }, 0); })();
    ${dropsJs(id, dp, dur, 300)}
    blink("${r}", 6.2, 0.2); look("${r}", 2, 0, 6.6, 0.2); look("${r}", -2, 0, 7.0, 0.2);
    ` }) };
}

// ── 2. the old man, close: half in firelight, half in the dark; he doesn't blink ────────────────────
function oldCU(id, dur, js, { y = 960, s = 2.5, focus = 0 } = {}) {
  const o = `${id}-o`;
  return scene({ id, dur, bg: "#02040a", vignette: 0.94,
    layers: [
      { name: "bg", blur: 18, defs: glow(`${id}-in`, 980, 900, 900, "#ff8a30", 0.6), svg: `<rect width="1080" height="1920" fill="#0a0604"/><rect id="${id}-fglow" width="1080" height="1920" fill="url(#${id}-in)"/>` },
      { name: "face", defs: `<linearGradient id="${id}-half" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.88"/><stop offset="0.47" stop-color="#000" stop-opacity="0.78"/><stop offset="0.56" stop-color="#000" stop-opacity="0.05"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
        ${glow(`${id}-lit`, 1000, 900, 700, "#ff9a40", 0.5)}`, svg: `
        ${place(540, y, s, OLD_M(o), `${o}-all`)}
        <rect width="1080" height="1920" fill="url(#${id}-half)"/><rect id="${id}-lt" width="1080" height="1920" fill="url(#${id}-lit)" style="mix-blend-mode:screen"/>` },
    ],
    js: `look("${o}", 0, 0, 0, 0.01); eyesOpen("${o}", 0.9, 0, 0.01); brows("${o}", 6, 6, 0, 0.01);
      flicker("#${id}-lt", ${dur}, 0.85, 0.12); flicker("#${id}-fglow", ${dur}, 0.85, 0.1);
      ${js}` });
}
function f2(dur) {
  const id = "f2";
  return { id, dur, html: oldCU(id, dur, `cam("face", { scale: 1.0 }, { scale: 1.08, origin: "50% 45%" }, 0, ${dur}, "power1.inOut");`) };
}

// ── 3. Arash from above, small; he swallows, slowly lowers his head ───────────────────────────────
function f3(dur) {
  const id = "f3", r = `${id}-r`;
  const floor = `<rect width="1080" height="1920" fill="#26170c"/>${[...Array(12)].map((_, i) => `<rect x="${i * 96}" y="0" width="92" height="1920" fill="${i % 2 ? "#2e1c0e" : "#24160a"}"/>`).join("")}
    ${[...Array(10)].map((_, i) => `<path d="M ${i * 96 + 20},${(i * 377) % 1800} l 0,120" stroke="#1a0f06" stroke-width="3"/>`).join("")}
    ${[...Array(9)].map((_, i) => `<ellipse cx="${300 + (i * 113) % 500}" cy="${1300 + (i * 61) % 400}" rx="${20 + (i % 3) * 10}" ry="${10 + (i % 2) * 5}" fill="#3a5a80" opacity="0.35"/>`).join("")}`;
  return { id, dur, html: scene({ id, dur, bg: "#05060c", vignette: 0.9,
    layers: [
      { name: "bg", blur: 6, svg: floor + warm(0.2) },
      { name: "char", defs: glow(`${id}-wg`, 1100, 600, 900, "#ff9a40", 0.5), svg: `<g id="${id}-sh">${place(540, 760, 2.05, `<g transform="scale(1,0.9)">${RED_T(r)}</g><g id="${r}-gulp"><ellipse cx="0" cy="190" rx="14" ry="10" fill="${WET.skinSh}"/></g>`, `${r}-all`)}</g>
        <rect width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/>` },
    ],
    js: `
    eyesOpen("${r}", 1.2, 0, 0.01); brows("${r}", -14, -12, 0, 0.01); look("${r}", 0, -9, 0, 0.01);
    cam("char", { scale: 1.06, y: 40 }, { scale: 1.0, y: 0 }, 0, ${dur}); cam("bg", { scale: 1.06 }, { scale: 1.0 }, 0, ${dur});
    ${shakeJs(`#${id}-sh`, 0, dur, 4, 0.6)}
    tl.fromTo("#${r}-gulp", { y: 0 }, { y: -16, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 }, 0.5);
    blink("${r}", 0.9, 0.24);
    tl.to("#${r}-head", { y: 22, rotation: 2, transformOrigin: "50% 90%", duration: 1.0, ease: "sine.inOut" }, 1.9); look("${r}", 0, 6, 2.0, 0.6); eyesOpen("${r}", 0.95, 2.0, 0.6);
    ` }) };
}

// ── 4. his mouth and beard: a crooked smile; cut to his eyes ───────────────────────────────────────
function f4(dur) {
  const id = "f4", o = `${id}-o`, o2 = `${id}-o2`, cut = 3.7;
  const half = (gid) => `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.85"/><stop offset="0.45" stop-color="#000" stop-opacity="0.7"/><stop offset="0.58" stop-color="#000" stop-opacity="0.05"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>`;
  return { id, dur, html: scene({ id, dur, bg: "#02040a", vignette: 0.95,
    layers: [
      { name: "m", defs: half(`${id}-h1`) + glow(`${id}-lit`, 1000, 900, 700, "#ff9a40", 0.45), svg: `<g id="${id}-pm"><rect width="1080" height="1920" fill="#0a0604"/>${place(540, 960 - 100 * 5.2, 5.2, OLD_M(o), `${o}-all`)}
        <rect width="1080" height="1920" fill="url(#${id}-h1)"/><rect id="${id}-lt" width="1080" height="1920" fill="url(#${id}-lit)" style="mix-blend-mode:screen"/></g>` },
      { name: "e", defs: half(`${id}-h2`), svg: `<g id="${id}-pe" opacity="0"><rect width="1080" height="1920" fill="#0a0604"/>${place(540, 960 - 8 * 5.6, 5.6, OLD_M(o2), `${o2}-all`)}
        <rect width="1080" height="1920" fill="url(#${id}-h2)"/><rect width="1080" height="1920" fill="url(#${id}-lit)" style="mix-blend-mode:screen"/></g>` },
    ],
    js: `
    flicker("#${id}-lt", ${dur}, 0.85, 0.12);
    look("${o}", 0, 0, 0, 0.01); look("${o2}", 0, 0, 0, 0.01); eyesOpen("${o2}", 0.9, 0, 0.01); brows("${o2}", 6, 6, 0, 0.01);
    cam("m", { scale: 1.0 }, { scale: 1.06 }, 0, ${cut});
    tl.fromTo("#${o}-mC", { opacity: 0 }, { opacity: 1, duration: 0.9, ease: "sine.inOut" }, 2.6); tl.to("#${o}-mN", { opacity: 0, duration: 0.9, ease: "sine.inOut" }, 2.6);
    tl.set("#${id}-pm", { opacity: 0 }, ${cut}); tl.set("#${id}-pe", { opacity: 1 }, ${cut});
    cam("e", { scale: 1.0 }, { scale: 1.04 }, ${cut}, ${(dur - cut).toFixed(2)}, "none");
    eyesOpen("${o2}", 0.8, ${cut + 0.2}, 0.8);
    ` }) };
}

// ── 5. from behind Arash: the old man walks slowly to the fireplace ─────────────────────────────────
function f5(dur) {
  const id = "f5", o = `${id}-o`, r = `${id}-r`;
  return { id, dur, html: scene({ id, dur, bg: "#0a0604", vignette: 0.85,
    layers: [
      { name: "room", defs: roomDefs(id), svg: room(id, { deskItems: deskClock(id) }) + warm(0.2) + dark(0.25) },
      { name: "old", svg: `<g id="${o}-pos" transform="${T(560, 980, 0.5)}">${OLD_FULL(o)}</g>` },
      { name: "fg", blur: 4, svg: `${place(180, 1260, 1.25, C.friendBack(r, "r").replace(/#c43a36/g, WET.shirt).replace(/#9a2a28/g, WET.shirtSh), `${r}-all`)}${dark(0.15)}` },
    ],
    js: `${fireJs(id, dur)} ${rainJs(id, dur)} ${tickJs(id, dur)}
    cam("room", { scale: 1.04 }, { scale: 1.0 }, 0, ${dur}); cam("old", { scale: 1.04 }, { scale: 1.0 }, 0, ${dur});
    tl.fromTo("#${o}-pos", { attr: { transform: "${T(560, 980, 0.5)}" } }, { attr: { transform: "${T(820, 830, 0.4)}" } , duration: ${dur - 0.6}, ease: "none" }, 0.3);
    ${walk(o, 0.3, Math.floor((dur - 0.6) / 0.62), 0.62, 12)}
    tl.fromTo("#${r}-all", { y: 0 }, { y: -5, duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: ${Math.floor(dur / 0.5) - 1} }, 0);
    ` }) };
}

// ── 6. his hands: the black kettle lifted, tea poured, the glass set down on the map scrap ─────────
function f6(dur) {
  const id = "f6", A = 1.8, B = 3.9;
  const sleeve = (flip = 1) => `<g transform="scale(${flip},1)"><rect x="-60" y="0" width="120" height="700" fill="#3a2c22"/><rect x="-64" y="0" width="128" height="30" fill="#2a2018"/>
    <path d="M -50,0 C -56,-50 -50,-90 -36,-104 L 40,-104 C 56,-84 58,-40 50,0 Z" fill="${OLD.skin}"/><path d="M -36,-104 C -40,-130 -30,-140 -18,-128 L -10,-104 Z M 0,-106 C -2,-140 14,-146 20,-120 L 22,-104 Z" fill="${OLD.skinSh}"/>
    <path d="M -30,-40 C -10,-50 20,-48 40,-36" stroke="${OLD.deep}" stroke-width="3" fill="none" opacity="0.5"/></g>`;
  return { id, dur, html: scene({ id, dur, bg: "#0a0604", vignette: 0.85,
    layers: [
      { name: "a", defs: glow(`${id}-g1`, 540, 1300, 900, "#ff9a40", 0.6), svg: `<g id="${id}-pa">
        <rect width="1080" height="1920" fill="#120a06"/>${[...Array(18)].map((_, i) => `<rect x="${(i % 6) * 190 - 40 + (Math.floor(i / 6) % 2) * 90}" y="${200 + Math.floor(i / 6) * 260}" width="170" height="230" rx="40" fill="${["#4a4038", "#3e352e", "#544a42"][i % 3]}"/>`).join("")}
        <path d="M 120,1920 L 120,900 C 120,700 960,700 960,900 L 960,1920 Z" fill="#0a0503"/>
        <g transform="translate(560,1700) scale(1.8)"><rect x="-90" y="-26" width="180" height="22" rx="10" fill="#3a2010" transform="rotate(-6)"/>
          <path id="${id}-fl0" d="M -70,-20 C -80,-90 -40,-120 -30,-180 C -10,-120 10,-110 0,-20 Z" fill="#e8601e"/><path id="${id}-fl1" d="M -30,-20 C -40,-110 10,-150 10,-230 C 40,-150 60,-110 40,-20 Z" fill="#f08a26"/><path id="${id}-fl2" d="M 0,-20 C 0,-80 30,-100 40,-150 C 60,-100 76,-70 64,-20 Z" fill="#ffc24a"/></g>
        <rect id="${id}-fglow" width="1080" height="1920" fill="url(#${id}-g1)" style="mix-blend-mode:screen"/>
        <g id="${id}-kpos" transform="${T(560, 1360, 1.5)}">${kettle}<g transform="translate(0,-170) rotate(155)">${sleeve()}</g></g></g>` },
      { name: "b", defs: glow(`${id}-g2`, 900, 1200, 900, "#ff9a40", 0.45), svg: `<g id="${id}-pb" opacity="0"><rect width="1080" height="1920" fill="#160c06"/><rect id="${id}-fg2" width="1080" height="1920" fill="url(#${id}-g2)"/>
        <g transform="translate(420,1250) scale(2.2)">${glass(`${id}-gb`, 0)}<g transform="translate(0,-40) rotate(-90)">${sleeve(-1).replace('<g transform="scale(-1,1)">', '<g transform="scale(-1,1) translate(0,60)">')}</g></g>
        <g transform="translate(470,1250) scale(2.2)"><path id="${id}-pour" d="M 4,-150 C 2,-120 -2,-100 0,-90" stroke="#8a2a12" stroke-width="7" fill="none" opacity="0"/></g>
        <g id="${id}-kb" transform="${T(640, 900, 1.6, -38)}">${kettle}<g transform="translate(0,-170) rotate(160)">${sleeve()}</g></g></g>` },
      { name: "c", defs: glow(`${id}-g3`, 1000, 700, 900, "#ff9a40", 0.4), svg: `<g id="${id}-pc" opacity="0"><rect width="1080" height="1920" fill="#4a2e18"/>
        ${[...Array(9)].map((_, i) => `<path d="M 0,${300 + i * 190} C 300,${290 + i * 190} 700,${320 + i * 190} 1080,${296 + i * 190}" stroke="#3a2212" stroke-width="5" fill="none" opacity="0.7"/>`).join("")}
        <g transform="translate(520,1190) scale(2.1) rotate(-6)">${mapScrap(id)}</g>
        <g transform="translate(860,1080) scale(2.3)">${clock(id)}</g>
        <g id="${id}-gpos" transform="${T(520, 700, 2.4)}">${glass(`${id}-gc`)}</g><g id="${id}-hpos" transform="${T(520, 700, 2.4)}"><g transform="translate(14,-56) rotate(160)">${sleeve()}</g></g>
        <rect width="1080" height="1920" fill="url(#${id}-g3)" style="mix-blend-mode:screen"/>${warm(0.2)}</g>` },
    ],
    js: `${fireJs(id, A)} ${tickJs(id, dur, 33)}
    cam("a", { scale: 1.0 }, { scale: 1.06 }, 0, ${A});
    tl.fromTo("#${id}-kpos", { attr: { transform: "${T(560, 1360, 1.5)}" } }, { attr: { transform: "${T(560, 1060, 1.5, -6)}" }, duration: 0.9, ease: "power2.inOut" }, 0.9);
    tl.set("#${id}-pa", { opacity: 0 }, ${A}); tl.set("#${id}-pb", { opacity: 1 }, ${A});
    tl.fromTo("#${id}-kb", { attr: { transform: "${T(700, 860, 1.6, -10)}" } }, { attr: { transform: "${T(640, 900, 1.6, -38)}" }, duration: 0.5, ease: "power2.inOut" }, ${A});
    tl.fromTo("#${id}-pour", { opacity: 0 }, { opacity: 1, duration: 0.1 }, ${A + 0.45}); tl.to("#${id}-pour", { opacity: 0, duration: 0.1 }, ${B - 0.4});
    tl.fromTo("#${id}-gb-tea", { opacity: 0, scaleY: 0, transformOrigin: "50% 100%" }, { opacity: 1, scaleY: 1, duration: ${(B - 0.5 - A - 0.45).toFixed(2)}, ease: "none", transformOrigin: "50% 100%" }, ${A + 0.5});
    tl.to("#${id}-kb", { attr: { transform: "${T(700, 860, 1.6, -10)}" }, duration: 0.4, ease: "power2.inOut" }, ${B - 0.35});
    tl.set("#${id}-pb", { opacity: 0 }, ${B}); tl.set("#${id}-pc", { opacity: 1 }, ${B});
    tl.fromTo("#${id}-gpos", { attr: { transform: "${T(520, 700, 2.4)}" } }, { attr: { transform: "${T(520, 1180, 2.4)}" }, duration: 0.7, ease: "power2.in" }, ${B + 0.1});
    tl.fromTo("#${id}-hpos", { attr: { transform: "${T(520, 700, 2.4)}" } }, { attr: { transform: "${T(520, 1180, 2.4)}" }, duration: 0.7, ease: "power2.in" }, ${B + 0.1});
    tl.to("#${id}-hpos", { attr: { transform: "${T(760, 300, 2.4)}" }, duration: 0.6, ease: "power2.inOut" }, ${B + 1.15});
    ${shakeJs(`#${id}-sh`, 0, 0.01, 0)}
    cam("c", { scale: 1.0 }, { scale: 1.05, origin: "540px 1150px" }, ${B}, ${(dur - B).toFixed(2)});
    ` }).replace(`<g id="${id}-gpos"`, `<g id="${id}-sh"></g><g id="${id}-gpos"`) };
}

// ── 7. low angle: the old man over the seated boy, firelight behind him ────────────────────────────
function f7(dur) {
  const id = "f7", o = `${id}-o`, r = `${id}-r`;
  return { id, dur, html: scene({ id, dur, bg: "#0a0604", vignette: 0.9,
    layers: [
      { name: "bg", blur: 8, defs: glow(`${id}-bk`, 820, 900, 800, "#ff8a30", 0.75), svg: `<rect width="1080" height="1920" fill="#1a1008"/>
        ${[0, 1, 2, 3, 4].map((i) => `<path d="M ${-200 + i * 330},0 L ${180 + i * 180},700" stroke="#0e0804" stroke-width="70"/>`).join("")}
        <rect y="700" width="1080" height="1220" fill="#2a1a0e"/><rect id="${id}-fglow" width="1080" height="1920" fill="url(#${id}-bk)"/>` },
      { name: "old", defs: `<linearGradient id="${id}-sd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.8"/><stop offset="0.6" stop-color="#000" stop-opacity="0.55"/><stop offset="1" stop-color="#000" stop-opacity="0.1"/></linearGradient>`,
        svg: `<g id="${id}-lean">${place(560, 660, 2.05, `<g transform="scale(1,1.08)">${OLD_M(o)}</g>`, `${o}-all`)}</g><rect x="0" y="0" width="1080" height="1920" fill="url(#${id}-sd)" opacity="0.85"/>
          <rect width="1080" height="1920" fill="url(#${id}-bk)" style="mix-blend-mode:screen" opacity="0.4"/>` },
      { name: "fg", svg: `<g transform="translate(560,1820) scale(1.3)">${desk(id, `<g transform="translate(120,-80) scale(0.75)">${mapScrap(id)}</g><g transform="translate(120,-74) scale(0.8)">${glass(`${id}-g`)}</g>${deskClock(id, -200)}`)}</g>
        <g style="filter: blur(5px)">${place(170, 1520, 1.35, C.friendBack(r, "r").replace(/#c43a36/g, WET.shirt).replace(/#9a2a28/g, WET.shirtSh))}</g>${warm(0.2)}` },
    ],
    js: `${tickJs(id, dur, 46)} flicker("#${id}-fglow", ${dur}, 0.85, 0.12);
    look("${o}", -3, 8, 0, 0.01); eyesOpen("${o}", 0.85, 0, 0.01); brows("${o}", 6, 6, 0, 0.01);
    cam("old", { scale: 1.0, origin: "50% 100%" }, { scale: 1.08, origin: "50% 100%" }, 0, ${dur}, "power1.inOut");
    tl.to("#${o}-all", { rotation: 4, y: 30, transformOrigin: "50% 100%", duration: 1.6, ease: "sine.inOut" }, 0.8);
    cam("fg", { y: 0 }, { y: 10 }, 0, ${dur});
    ` }) };
}

// ── 8. Arash looks up, eyes wet: "my friends… vanished"; a one-second flash of the two fading ──────
function f8(dur) {
  const id = "f8", r = `${id}-r`, b = `${id}-b`, w = `${id}-w`, F0 = 1.9, F1 = 2.9;
  const tear = (x) => `<path d="M ${x},40 C ${x - 6},52 ${x - 8},60 ${x},66 C ${x + 8},60 ${x + 6},52 ${x},40 Z" fill="#dff0ff" opacity="0.9"/>`;
  return { id, dur, html: scene({ id, dur, bg: "#05060c", vignette: 0.9,
    layers: [
      { name: "bg", blur: 14, svg: `<rect width="1080" height="1920" fill="#2a1a0e"/><rect x="600" y="0" width="480" height="1920" fill="#3a2010"/>` + warm(0.2) },
      { name: "char", defs: glow(`${id}-wg`, 1100, 700, 900, "#ff9a40", 0.5), svg: `${place(540, 900, 2.2, RED_T(r) + `<g id="${r}-tears" opacity="0">${tear(-44)}${tear(44)}</g><g id="${r}-roll" opacity="0">${tear(52)}</g>
          <path d="M -70,34 C -56,40 -32,40 -18,34 M 70,34 C 56,40 32,40 18,34" stroke="#dff0ff" stroke-width="4" fill="none" opacity="0.7"/>`, `${r}-all`)}
        <rect width="1080" height="1920" fill="url(#${id}-wg)" style="mix-blend-mode:screen"/>` },
      { name: "flash", svg: `<g id="${id}-fb" opacity="0" style="filter: grayscale(0.85) blur(5px) brightness(1.15)"><rect width="1080" height="1920" fill="#2a3a30"/>
        ${[...Array(9)].map((_, i) => `<path d="M ${i * 130 - 20},1300 L ${i * 130 + 50},300 L ${i * 130 + 120},1300 Z" fill="#14241c"/>`).join("")}
        <g id="${b}-v">${place(330, 820, 1.0, C.friend(b, BLUE, { kind: "curly", mouth: "tense" }))}</g><g id="${w}-v">${place(760, 820, 1.0, C.friend(w, WHITE, { kind: "fade", beard: true, mouth: "tense" }))}</g>
        <rect width="1080" height="1920" fill="#e8e6ff" opacity="0.18"/></g>` },
    ],
    js: `
    eyesOpen("${r}", 1.2, 0, 0.01); brows("${r}", -16, -16, 0, 0.01); look("${r}", 0, 7, 0, 0.01);
    tl.fromTo("#${r}-head", { y: 30, rotation: 3 }, { y: 0, rotation: 0, transformOrigin: "50% 90%", duration: 0.35, ease: "power3.out" }, 0.35);
    look("${r}", 0, -3, 0.4, 0.25); tl.to("#${r}-tears", { opacity: 1, duration: 0.5 }, 0.6);
    cam("char", { scale: 1.0 }, { scale: 1.08, origin: "50% 45%" }, 0, ${dur});
    tl.set("#${id}-fb", { opacity: 1 }, ${F0}); tl.set("#${id}-fb", { opacity: 0 }, ${F1});
    tl.fromTo(["#${b}-v", "#${w}-v"], { opacity: 1 }, { opacity: 0, duration: 0.6, ease: "power1.in" }, ${F0 + 0.25});
    ${[0, 1, 2, 3].map((k) => `tl.set("#${id}-fb", { x: ${k % 2 ? 8 : -8} }, ${(F0 + k * 0.2).toFixed(2)});`).join(" ")}
    tl.fromTo("#${r}-roll", { opacity: 0, y: 0 }, { opacity: 0.9, y: 70, duration: 1.4, ease: "power1.in" }, 3.1);
    brows("${r}", -20, -18, 3.2, 0.4); tl.fromTo("#${r}-torso", { y: 0 }, { y: -6, duration: 0.3, ease: "sine.inOut", yoyo: true, repeat: ${Math.floor(dur / 0.3) - 1} }, 0);
    ` }) };
}

// ── 9. at the window, back to the boy: "…but I only listen." — his head tilts at «گوش» ────────────
function f9(dur) {
  const id = "f9", o = `${id}-o`, tilt = 4.6;
  const rain = [...Array(40)].map((_, i) => `<path d="M ${140 + (i * 37) % 800},${(i * 71) % 900} l -14,70" stroke="#9ab4d8" stroke-width="3" opacity="0.55"/>`).join("");
  return { id, dur, html: scene({ id, dur, bg: "#05060c", vignette: 0.9,
    layers: [
      { name: "win", svg: `<rect width="1080" height="1920" fill="#2a1a0e"/>${[...Array(30)].map((_, i) => `<rect y="${i * 66}" width="1080" height="62" rx="26" fill="${i % 2 ? "#3a2616" : "#33210f"}"/>`).join("")}
        <rect x="110" y="300" width="860" height="1000" fill="#140c06"/><rect x="134" y="324" width="812" height="952" fill="#070d1e"/>
        <clipPath id="${id}-wc"><rect x="134" y="324" width="812" height="952"/></clipPath><g clip-path="url(#${id}-wc)">
          ${[...Array(9)].map((_, i) => `<path d="M ${100 + i * 110},1276 L ${150 + i * 110},${700 + (i % 3) * 60} L ${200 + i * 110},1276 Z" fill="#03060e"/>`).join("")}
          <g id="${id}-rn">${rain}<g transform="translate(0,900)">${rain}</g></g></g>
        <path d="M 540,324 L 540,1276 M 134,800 L 946,800" stroke="#140c06" stroke-width="18"/><rect x="90" y="1290" width="900" height="30" fill="#3a2414"/>` + warm(0.15) },
      { name: "old", defs: glow(`${id}-rim`, 1100, 1300, 900, "#ff9a40", 0.45), svg: `${place(560, 980, 1.55, OLD_BACK(o), `${o}-all`)}<rect width="1080" height="1920" fill="url(#${id}-rim)" style="mix-blend-mode:screen"/>` },
    ],
    js: `${rainJs(id, dur, 900, 0.5).replace("y: -900", "y: -900")}
    cam("win", { scale: 1.0 }, { scale: 1.05 }, 0, ${dur}); cam("old", { scale: 1.0 }, { scale: 1.04 }, 0, ${dur});
    tl.to("#${o}-head", { rotation: -9, x: -10, transformOrigin: "50% 80%", duration: 0.7, ease: "sine.inOut" }, ${tilt});
    ` }) };
}

// ── 10. the felt hat off the nail, on; the door opens on wind and rain; he walks out; it slams ─────
function f10(dur) {
  const id = "f10", o = `${id}-o`, X0 = 380, Y0 = 760, S0 = 0.62;
  const rainIn = [...Array(30)].map((_, i) => `<path d="M ${520 + (i * 31) % 330},${300 + (i * 67) % 1100} l -40,60" stroke="#9ab4d8" stroke-width="4" opacity="0.6"/>`).join("");
  return { id, dur, html: scene({ id, dur, bg: "#05060c", vignette: 0.88,
    layers: [
      { name: "wall", defs: glow(`${id}-fg`, 1100, 1300, 1000, "#ff9a40", 0.45), svg: `<rect width="1080" height="1920" fill="#2a1a0e"/>${[...Array(30)].map((_, i) => `<rect y="${i * 66}" width="1080" height="62" rx="26" fill="${i % 2 ? "#3a2616" : "#33210f"}"/>`).join("")}
        <rect y="1500" width="1080" height="420" fill="#26170c"/>
        <rect x="480" y="300" width="420" height="1210" fill="#140c06"/><rect x="500" y="320" width="380" height="1190" fill="#03050c"/>
        <g id="${id}-out" opacity="0"><g id="${id}-rn">${rainIn}<g transform="translate(0,600)">${rainIn}</g></g></g>
        <g transform="translate(500,320)"><g id="${id}-door"><rect x="0" y="0" width="380" height="1190" fill="#4a3020"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${6 + i * 62}" y="6" width="58" height="1178" fill="${i % 2 ? "#52361f" : "#4a3020"}"/>`).join("")}
          <rect x="6" y="160" width="368" height="26" fill="#2a1a0e"/><rect x="6" y="980" width="368" height="26" fill="#2a1a0e"/><circle cx="340" cy="600" r="16" fill="#8a7040"/></g></g>
        <circle cx="300" cy="540" r="8" fill="#1a1008"/>
        <rect id="${id}-fglow" width="1080" height="1920" fill="url(#${id}-fg)" style="mix-blend-mode:screen"/>` },
      { name: "old", svg: `<g id="${o}-pos" transform="${T(X0, Y0, S0)}">${OLD_FULL(o)}<g id="${id}-hat" transform="translate(${(300 - X0) / S0},${(575 - Y0) / S0}) scale(0.68)"><g transform="translate(0,0)">${FELT}</g></g></g>` },
    ],
    js: `${rainJs(id, dur, 600, 0.35)} flicker("#${id}-fglow", ${dur}, 0.85, 0.1);
    ${armTo(o, -1, -150, -20, 0.5, 0.7)}
    tl.to("#${id}-hat", { attr: { transform: "translate(0,-6) scale(1)" }, duration: 0.8, ease: "power2.inOut" }, 1.25);
    ${armTo(o, -1, -170, -40, 1.25, 0.8)} ${armTo(o, -1, 6, -10, 2.1, 0.6)}
    tl.to("#${o}-pos", { attr: { transform: "${T(560, Y0, S0)}" }, duration: 0.8, ease: "sine.inOut" }, 2.3); ${walk(o, 2.3, 2, 0.4, 10)}
    ${armTo(o, 1, -60, -20, 2.9, 0.4)}
    tl.to("#${id}-door", { scaleX: 0.12, transformOrigin: "0% 50%", duration: 0.5, ease: "power2.out" }, 3.2);
    tl.set("#${id}-out", { opacity: 1 }, 3.25);
    ${armTo(o, 1, 6, -10, 3.6, 0.4)}
    tl.to("#${o}-pos", { attr: { transform: "${T(700, 820, 0.42)}" }, duration: 1.6, ease: "sine.in" }, 3.8); ${walk(o, 3.8, 4, 0.4, 10)}
    tl.to("#${o}-pos", { opacity: 0, duration: 0.6 }, 4.9);
    tl.to("#${id}-door", { scaleX: 1, transformOrigin: "0% 50%", duration: 0.22, ease: "power3.in" }, 5.6);
    tl.set("#${id}-out", { opacity: 0 }, 5.82);
    cam("wall", { scale: 1.0, x: 0 }, { scale: 1.04, x: 6 }, 5.82, 0.08, "none"); cam("wall", { scale: 1.04, x: 6 }, { scale: 1.0, x: 0 }, 5.9, 0.3, "power2.out");
    ` }) };
}

// ── 11. he jumps up, the chair falls; he runs for the door and stops halfway ───────────────────────
function f11(dur) {
  const id = "f11", r = `${id}-r`;
  const redFull = C.friendFull(r, "r").replace(/#c43a36/g, WET.shirt).replace(/#9a2a28/g, WET.shirtSh).replace('<path d="M -30,94 C -16,108 16,108 30,94"', '<path d="M -26,104 C -12,96 12,96 26,104"').replace(/<path d="M -16,104 C -6,110 6,110 16,104"[^>]*>/, '');
  return { id, dur, html: scene({ id, dur, bg: "#0a0604", vignette: 0.85,
    layers: [
      { name: "room", defs: roomDefs(id), svg: room(id, { deskOn: false }) },
      { name: "char", svg: `<g transform="translate(700,1290)"><g id="${id}-chair">${place(0, 0, 0.75, chair(id))}</g></g>
        <g id="${r}-pos" transform="${T(640, 1090, 0.5)}">${redFull}</g>
        <g transform="translate(640,1500)">${desk(id + "x", `<g transform="translate(120,-80) scale(0.6)">${mapScrap(id + "x")}</g><g transform="translate(120,-76) scale(0.62)">${glass(`${id}-g2`)}</g>${deskClock(id + "x", -200)}`)}</g>
        ${warm(0.15)}${dark(0.15)}` },
    ],
    js: `${fireJs(id, dur)} ${rainJs(id, dur)} ${tickJs(id, dur, 50)} ${tickJs(id + "x", dur, 50)}
    look("${r}", -6, 0, 0, 0.01); eyesOpen("${r}", 1.1, 0, 0.01); brows("${r}", -12, -12, 0, 0.01);
    tl.to("#${r}-pos", { attr: { transform: "${T(640, 900, 0.5)}" }, duration: 0.25, ease: "power3.out" }, 0.3);
    tl.to("#${id}-chair", { rotation: 72, svgOrigin: "60 160", duration: 0.45, ease: "power2.in" }, 0.35);
    eyesOpen("${r}", 1.35, 0.4, 0.2); look("${r}", -9, 0, 0.4, 0.2);
    tl.to("#${r}-pos", { attr: { transform: "${T(230, 980, 0.6)}" }, duration: 1.0, ease: "power1.inOut" }, 0.7); ${C.armT ? "" : ""}
    ${walk(r, 0.7, 4, 0.25, 26)}
    tl.to("#${r}-pos", { attr: { transform: "${T(205, 990, 0.6)}" }, duration: 0.4, ease: "power2.out" }, 1.7); tl.to(["#${r}-legL", "#${r}-legR"], { rotation: 0, duration: 0.3 }, 1.72);
    tl.fromTo("#${r}-torso", { y: 0 }, { y: -8, duration: 0.26, ease: "sine.inOut", yoyo: true, repeat: ${Math.floor((dur - 2.1) / 0.26) - 1} }, 2.1);
    cam("room", { scale: 1.0 }, { scale: 1.05, origin: "260px 1300px" }, 2.2, ${(dur - 2.2).toFixed(2)}); cam("char", { scale: 1.0 }, { scale: 1.05, origin: "260px 1300px" }, 2.2, ${(dur - 2.2).toFixed(2)});
    ` }) };
}

export const DURS = { f1: 8.2, f2: 3.4, f3: 3.4, f4: 6.0, f5: 5.0, f6: 6.2, f7: 4.8, f8: 5.2, f9: 6.0, f10: 7.0, f11: 6.0 };
export default [f1(DURS.f1), f2(DURS.f2), f3(DURS.f3), f4(DURS.f4), f5(DURS.f5), f6(DURS.f6), f7(DURS.f7), f8(DURS.f8), f9(DURS.f9), f10(DURS.f10), f11(DURS.f11)];
