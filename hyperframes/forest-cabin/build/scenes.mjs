// The cabin film: packing montage → night drive → the cabin → inside, a walk is proposed → red's hidden fear →
// flashlights, into the forest. Nobody speaks; the mouths are never animated.
import { scene, place, glow } from "./lib.mjs";
import * as C from "./chars.mjs";
const { RED, WHITE, BLUE } = C;

// deterministic pseudo-random for layouts generated at build time
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

// ── shared pieces ─────────────────────────────────────────────────────────────────────────────────
function pine(fill = "#0c1c19", hi = "#14302a") {
  const tiers = [0, 1, 2, 3, 4].map((i) => {
    const y = -150 - i * 170, w = 300 - i * 50;
    return `<path d="M ${-w},${y} L 0,${y - 300} L ${w},${y} Z" fill="${fill}"/><path d="M 0,${y - 300} L ${w},${y} L ${w * 0.35},${y} Z" fill="${hi}" opacity="0.6"/>`;
  }).join("");
  return `<rect x="-26" y="-200" width="52" height="200" fill="#1a1410"/>${tiers}`;
}
function topHand(c, { flip = false } = {}) { // a hand reaching up from below (back of the hand), wrist at (0,0)
  const s = flip ? -1 : 1;
  return `<g transform="scale(${s},1)">
    <path d="M -54,0 L 54,0 L 60,700 L -60,700 Z" fill="${c.shirt}"/><path d="M 24,0 L 54,0 L 60,700 L 30,700 Z" fill="${c.shirtSh}"/>
    <path d="M -40,-10 C -46,-60 -44,-100 -36,-120 L -40,-190 C -41,-204 -24,-206 -22,-192 L -16,-130 L -14,-206 C -14,-222 4,-222 4,-206 L 6,-132 L 14,-200 C 15,-215 32,-214 32,-198 L 26,-128 L 38,-176 C 41,-190 56,-186 53,-172 L 42,-110 C 54,-96 70,-100 80,-122 C 87,-136 103,-128 96,-112 C 84,-80 64,-50 44,-30 L 44,10 L -40,10 Z" fill="${c.skin}"/>
    <path d="M -30,-60 C -10,-70 14,-70 34,-60" stroke="${c.deep}" stroke-width="3" fill="none" opacity="0.4"/></g>`;
}
const T = (side, a, b) => C.armT(side, a, b);
function armTo(p, side, a, b, t, d, ease = "power2.inOut") {
  const x = T(side, a, b), s = side < 0 ? "L" : "R";
  return `tl.to("#${p}-arm${s}u", { attr: { transform: "${x.u}" }, duration: ${d}, ease: "${ease}" }, ${t});
    tl.to("#${p}-arm${s}f", { attr: { transform: "${x.f}" }, duration: ${d}, ease: "${ease}" }, ${t});`;
}
const nod = (p, t, amt = 10, d = 0.45) => `tl.to("#${p}-head", { y: ${amt}, duration: ${(d * 0.4).toFixed(2)}, ease: "power2.out" }, ${t}); tl.to("#${p}-head", { y: 0, duration: ${(d * 0.6).toFixed(2)}, ease: "power2.inOut" }, ${(t + d * 0.42).toFixed(2)});`;
const tw = (sel, from, to, t, d, ease = "power2.inOut") => `tl.fromTo("${sel}", { attr: { transform: "${from}" } }, { attr: { transform: "${to}" }, duration: ${d}, ease: "${ease}" }, ${t});`;
const walk = (p, t0, n, step, amp = 18) => [...Array(n)].map((_, k) => {
  const a = k % 2 ? 1 : -1, t = (t0 + k * step).toFixed(2);
  return `tl.to("#${p}-legL", { rotation: ${amp * a}, svgOrigin: "-60 600", duration: ${step}, ease: "sine.inOut" }, ${t});
    tl.to("#${p}-legR", { rotation: ${-amp * a}, svgOrigin: "60 600", duration: ${step}, ease: "sine.inOut" }, ${t});
    tl.to("#${p}-body", { y: -14, duration: ${(step / 2).toFixed(2)}, ease: "sine.out" }, ${t}); tl.to("#${p}-body", { y: 0, duration: ${(step / 2).toFixed(2)}, ease: "sine.in" }, ${(t0 + k * step + step / 2).toFixed(2)});`;
}).join("\n");
const night = (id, op = 0.35) => `<rect width="1080" height="1920" fill="#0a1430" opacity="${op}" style="mix-blend-mode:multiply"/>`;

// trees in perspective that stream toward the camera (driving, walking). Built here, moved by an onUpdate.
function forestRoad(id, { n = 34, roadHalf = 520, vy = 760, speed = 6, dur, dirt = false }) {
  seed = 11;
  const trees = [...Array(n)].map((_, i) => ({ side: i % 2 ? 1 : -1, L: 1.35 + rnd() * 2.4, z0: 1.2 + (i / n) * 26, H: 5 + rnd() * 3.5, shade: rnd() }));
  const dashes = [...Array(14)].map((_, i) => ({ z0: 1.2 + i * 2 }));
  const svg = `
    <rect width="1080" height="${vy}" fill="url(#${id}-sky)"/>
    <rect y="${vy - 2}" width="1080" height="${1922 - vy}" fill="#07100e"/>
    <path d="M ${540 - 8},${vy} L ${540 + 8},${vy} L ${540 + roadHalf},1920 L ${540 - roadHalf},1920 Z" fill="${dirt ? "#2e261c" : "#1d1f24"}"/>
    ${dirt ? "" : `<path d="M ${540 - 8},${vy} L ${540 - roadHalf},1920" stroke="#5a5a52" stroke-width="5" opacity="0.6"/><path d="M ${540 + 8},${vy} L ${540 + roadHalf},1920" stroke="#5a5a52" stroke-width="5" opacity="0.6"/>`}
    <g id="${id}-dashes">${dirt ? "" : dashes.map((_, i) => `<path id="${id}-d${i}" d="M -6,0 L 6,0 L 10,120 L -10,120 Z" fill="#c9c2a0" opacity="0.7"/>`).join("")}</g>
    <rect y="${vy - 160}" width="1080" height="260" fill="url(#${id}-fogband)"/>
    <g id="${id}-trees">${trees.map((t, i) => `<g id="${id}-t${i}">${pine(t.shade > 0.5 ? "#0c1c19" : "#0f2420", "#18382f")}</g>`).join("")}</g>`;
  const defs = `<linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05080f"/><stop offset="1" stop-color="#1a2638"/></linearGradient>
    <linearGradient id="${id}-fogband" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fa4b8" stop-opacity="0"/><stop offset="0.5" stop-color="#8fa4b8" stop-opacity="0.22"/><stop offset="1" stop-color="#8fa4b8" stop-opacity="0"/></linearGradient>`;
  const js = `
    (function () {
      const TR = ${JSON.stringify(trees)}, NZ = 27, V = ${speed}, VY = ${vy}, RH = ${roadHalf};
      const els = TR.map((_, i) => document.getElementById("${id}-t" + i));
      const dsh = ${dirt ? "[]" : `${JSON.stringify(dashes)}.map((d, i) => Object.assign(d, { el: document.getElementById("${id}-d" + i) }))`};
      const parent = document.getElementById("${id}-trees");
      const o = { t: 0 };
      tl.fromTo(o, { t: 0 }, { t: ${dur}, duration: ${dur}, ease: "none", onUpdate() {
        const order = TR.map((tr, i) => {
          let z = tr.z0 - V * o.t; z = ((z - 1.2) % NZ + NZ) % NZ + 1.2;
          const ppu = RH / z, x = 540 + tr.side * (1 + tr.L) * ppu, y = VY + (1920 - VY) / z, s = (tr.H * ppu) / 1150;
          els[i].setAttribute("transform", "translate(" + x.toFixed(1) + "," + y.toFixed(1) + ") scale(" + s.toFixed(4) + ")");
          els[i].setAttribute("opacity", Math.max(0.15, Math.min(1, 1.25 - z / 22)).toFixed(3));
          return [z, els[i]];
        }).sort((a, b) => b[0] - a[0]);
        order.forEach(([, el]) => parent.appendChild(el));
        dsh.forEach((d) => {
          let z = d.z0 - V * o.t; z = ((z - 1.2) % 28 + 28) % 28 + 1.2;
          const s = 1 / z, y = VY + (1920 - VY) * s;
          d.el.setAttribute("transform", "translate(540," + y.toFixed(1) + ") scale(" + (s * 1.6).toFixed(4) + ")");
          d.el.setAttribute("opacity", Math.max(0, 0.8 - z / 30).toFixed(3));
        });
      } }, 0);
    })();`;
  return { svg, defs, js };
}
function mist(id, y, n = 5, op = 0.16) {
  return `<defs><radialGradient id="${id}-mg"><stop offset="0" stop-color="#b8c8d8" stop-opacity="1"/><stop offset="0.6" stop-color="#b8c8d8" stop-opacity="0.45"/><stop offset="1" stop-color="#b8c8d8" stop-opacity="0"/></radialGradient></defs>` +
    [...Array(n)].map((_, i) => `<ellipse id="${id}-m${i}" cx="${(i * 260) % 1200 - 60}" cy="${y + (i % 3) * 70}" rx="${460 + (i % 2) * 160}" ry="${90 + (i % 3) * 30}" fill="url(#${id}-mg)" opacity="${op * 1.6}"/>`).join("");
}
const mistDrift = (id, n, dur, dx = 80) => [...Array(n)].map((_, i) => `tl.fromTo("#${id}-m${i}", { x: 0 }, { x: ${i % 2 ? dx : -dx}, duration: ${dur}, ease: "none" }, 0);`).join("\n");

// ── A. packing montage ────────────────────────────────────────────────────────────────────────────
function bagTop(id, color = "#3b5d3a", dk = "#2a4429") {
  return `<g id="${id}"><ellipse cx="0" cy="40" rx="330" ry="250" fill="#000" opacity="0.35"/>
    <path d="M -300,-160 C -300,-260 300,-260 300,-160 L 310,240 C 310,300 -310,300 -310,240 Z" fill="${color}"/>
    <path d="M -240,-150 C -240,-210 240,-210 240,-150 L 246,120 C 246,160 -246,160 -246,120 Z" fill="#141a14"/>
    <path d="M -240,-150 C -240,-210 240,-210 240,-150" stroke="${dk}" stroke-width="20" fill="none"/>
    <path id="${id}-zip" d="M -246,130 C -120,160 120,160 246,130" stroke="#c9a24a" stroke-width="10" fill="none" stroke-dasharray="6 6"/>
    <rect x="-90" y="190" width="180" height="70" rx="14" fill="${dk}"/></g>`;
}
function deskShot(id, dur, who, items, { zip = false } = {}) {
  const c = { r: RED, w: WHITE, b: BLUE }[who];
  let js = `cam("all", { scale: 1.06, rotation: -1 }, { scale: 1.12, rotation: 0.5 }, 0, ${dur});`;
  // each item: carried in by the hand from below, dropped into the bag
  items.forEach((it, k) => {
    const t = 0.05 + k * 0.6;
    js += tw(`#${id}-i${k}`, `translate(${it.x},2250) rotate(${it.r})`, `translate(${it.tx},${it.ty}) rotate(${it.r / 3})`, t, 0.45, "power2.out");
    js += tw(`#${id}-h${k}`, `translate(${it.x + 30},2450)`, `translate(${it.tx + 30},${it.ty + 200})`, t, 0.45, "power2.out");
    js += `tl.to("#${id}-i${k}", { opacity: 0.0, duration: 0.15 }, ${(t + 0.55).toFixed(2)});`;
    js += `tl.to("#${id}-h${k}", { attr: { transform: "translate(${it.x + 30},2450)" }, duration: 0.35, ease: "power2.in" }, ${(t + 0.5).toFixed(2)});`;
  });
  if (zip) js += `
    tl.fromTo("#${id}-zl", { attr: { "stroke-dashoffset": 520 } }, { attr: { "stroke-dashoffset": 0 }, duration: 0.6, ease: "power1.inOut" }, ${dur - 0.8});
    ${tw(`#${id}-zp`, "translate(-246,1110)", "translate(246,1110)", dur - 0.8, 0.6, "power1.inOut")}
    ${tw(`#${id}-zh`, "translate(-216,1330)", "translate(276,1330)", dur - 0.8, 0.6, "power1.inOut")}`;
  return { id, dur, html: scene({ id, dur, bg: "#20160f", vignette: 0.85,
    layers: [{ name: "all", defs: glow(`${id}-lamp`, 820, 380, 1100, "#ffb45a", 0.45), svg: `
      <rect width="1080" height="1920" fill="#3a2618"/>
      ${[...Array(9)].map((_, i) => `<path d="M 0,${i * 230} L 1080,${i * 230 + 40}" stroke="#2e1e12" stroke-width="6"/>`).join("")}
      <g transform="translate(540,980)">${bagTop(`${id}-bag`)}</g>
      ${items.map((it, k) => `<g id="${id}-i${k}" transform="translate(${it.x},2250) rotate(${it.r})">${it.svg}</g>`).join("")}
      ${items.map((it, k) => `<g id="${id}-h${k}" transform="translate(${it.x + 30},2450)">${topHand(c, { flip: k % 2 === 1 })}</g>`).join("")}
      ${zip ? `<path id="${id}-zl" d="M -246,130 C -120,160 120,160 246,130" transform="translate(540,980)" stroke="#2a2a2a" stroke-width="14" fill="none" stroke-dasharray="520" stroke-dashoffset="520"/>
        <g id="${id}-zp" transform="translate(-246,1110)"><g transform="translate(540,0)"><rect x="-14" y="-10" width="28" height="44" rx="6" fill="#c9a24a"/></g></g>
        <g id="${id}-zh" transform="translate(-216,1330)"><g transform="translate(540,0) rotate(-20)">${topHand(c)}</g></g>` : ""}
      <rect width="1080" height="1920" fill="url(#${id}-lamp)" style="mix-blend-mode:screen"/>${night(id, 0.3)}` }],
    js }) };
}
const SWEATER = `<rect x="-150" y="-100" width="300" height="200" rx="20" fill="#6a6f7a"/><path d="M -150,-40 L 150,-40 M -150,40 L 150,40" stroke="#5a5f6a" stroke-width="8"/><path d="M -60,-100 C -30,-70 30,-70 60,-100" stroke="#5a5f6a" stroke-width="10" fill="none"/>`;
const TSHIRT = `<rect x="-130" y="-80" width="260" height="160" rx="16" fill="#e6e6ea"/><path d="M -40,-80 C -20,-56 20,-56 40,-80" stroke="#c6c8d0" stroke-width="8" fill="none"/>`;
const CHIPS = `<path d="M -90,-130 L 90,-130 L 100,130 L -100,130 Z" fill="#e0a020"/><path d="M -90,-130 L 90,-130 L 92,-100 L -92,-100 Z" fill="#c07a10"/><circle cx="0" cy="10" r="46" fill="#c0301a"/><path d="M -100,130 L 100,130 L 92,100 L -92,100 Z" fill="#c07a10"/>`;
const BOTTLE = `<rect x="-36" y="-150" width="72" height="300" rx="30" fill="#9fd0e8" opacity="0.85"/><rect x="-22" y="-180" width="44" height="40" rx="8" fill="#2a6aa0"/><rect x="-36" y="-40" width="72" height="80" fill="#2a6aa0" opacity="0.7"/>`;
const TORCH = `<rect x="-30" y="-150" width="60" height="230" rx="14" fill="#2a2d34"/><rect x="-42" y="-200" width="84" height="64" rx="12" fill="#3a3e48"/><circle cx="0" cy="-200" r="34" fill="#cfd6e0" opacity="0.6"/><rect x="-10" y="-60" width="20" height="30" rx="6" fill="#c9a24a"/>`;
const ROPE = `<circle r="90" fill="none" stroke="#b08850" stroke-width="22"/><circle r="56" fill="none" stroke="#9a7440" stroke-width="20"/>`;

function a4() {
  const id = "a4", dur = 2.8;
  return { id, dur, html: scene({ id, dur, bg: "#0b0d14", vignette: 0.7, extraStyle: `@font-face { font-family: "Vazirmatn"; src: url('assets/fonts/Vazirmatn-SemiBold.ttf') format('truetype'); }`,
    layers: [
      { name: "bg", blur: 16, svg: `<rect width="1080" height="1920" fill="#241a14"/><circle cx="200" cy="300" r="240" fill="#ffb45a" opacity="0.25"/>` },
      { name: "phone", svg: `
        <rect x="200" y="260" width="680" height="1380" rx="86" fill="#0d0e12"/><rect x="214" y="274" width="652" height="1352" rx="78" fill="#15171d"/>
        <rect x="470" y="300" width="140" height="34" rx="17" fill="#050506"/>
        <text x="820" y="420" font-family="Vazirmatn" font-size="40" fill="#eef1f6" text-anchor="start" direction="rtl">اقامتگاه‌های جنگلی</text>
        <g transform="translate(250,470)"><rect width="580" height="420" rx="30" fill="#132a2a"/>
          <rect width="580" height="420" rx="30" fill="url(#${id}-ph)"/>
          ${[...Array(9)].map((_, i) => `<g transform="translate(${30 + i * 66},${330 - (i % 2) * 30}) scale(0.2)">${pine("#0c1f1a", "#1a3a30")}</g>`).join("")}
          <g transform="translate(290,330)"><path d="M -130,0 L 130,0 L 130,-110 L -130,-110 Z" fill="#6a4226"/><path d="M -150,-110 L 0,-200 L 150,-110 Z" fill="#3a2414"/>
            <rect x="-90" y="-80" width="50" height="40" fill="#ffd27a"/><rect x="40" y="-80" width="50" height="40" fill="#ffd27a"/><rect x="-20" y="-70" width="40" height="70" fill="#3a2414"/></g></g>
        <text x="820" y="970" font-family="Vazirmatn" font-size="52" fill="#fff" text-anchor="start" direction="rtl">کلبه‌ی چوبی جنگل</text>
        <text x="820" y="1040" font-family="Vazirmatn" font-size="34" fill="#9aa4b4" text-anchor="start" direction="rtl">۳ نفر · ۲ شب · مازندران</text>
        <text x="820" y="1110" font-family="Vazirmatn" font-size="34" fill="#f2c46d" text-anchor="start" direction="rtl">★ ۴٫۹</text>
        <g id="${id}-btn"><rect x="260" y="1420" width="560" height="120" rx="60" fill="#3b82f6"/>
          <text id="${id}-bt1" x="540" y="1498" font-family="Vazirmatn" font-size="48" fill="#fff" text-anchor="middle">رزرو کن</text></g>
        <g id="${id}-ok" opacity="0"><rect x="260" y="1420" width="560" height="120" rx="60" fill="#22a05a"/>
          <text x="560" y="1498" font-family="Vazirmatn" font-size="48" fill="#fff" text-anchor="middle">رزرو شد</text>
          <path d="M 330,1480 l 24,24 l 46,-52" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
        <g id="${id}-th" transform="translate(760,2200)"><g transform="rotate(-24) scale(1.6)"><path d="M -40,10 C -44,-40 -30,-70 0,-70 C 30,-70 44,-40 40,10 L 70,300 L -60,300 Z" fill="${RED.skin}"/><path d="M -18,-56 C -8,-62 10,-62 18,-56 L 14,-30 L -14,-30 Z" fill="#f2cdb2"/></g></g>`,
        defs: `<linearGradient id="${id}-ph" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2a5a"/><stop offset="1" stop-color="#0e1c1c" stop-opacity="0"/></linearGradient>` },
    ],
    js: `
    cam("bg", { scale: 1.05 }, { scale: 1.08 }, 0, ${dur});
    cam("phone", { scale: 1.0, rotation: -1.5 }, { scale: 1.08, rotation: 0.5, origin: "50% 75%" }, 0, ${dur});
    ${tw(`#${id}-th`, "translate(760,2200)", "translate(560,1590)", 0.6, 0.45, "power2.out")}
    tl.to("#${id}-btn", { scale: 0.95, transformOrigin: "50% 50%", duration: 0.08 }, 1.1); tl.to("#${id}-btn", { scale: 1, transformOrigin: "50% 50%", duration: 0.12 }, 1.2);
    tl.to("#${id}-btn", { opacity: 0, duration: 0.15 }, 1.3);
    tl.fromTo("#${id}-ok", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, transformOrigin: "50% 50%", duration: 0.3, ease: "back.out(2)" }, 1.3);
    tl.to("#${id}-th", { attr: { transform: "translate(760,2300)" }, duration: 0.45, ease: "power2.in" }, 1.5);
    ` }) };
}
function a5() {
  const id = "a5", dur = 2.6;
  const bag = (col) => `<path d="M -110,-60 C -110,-140 110,-140 110,-60 L 120,90 C 120,130 -120,130 -120,90 Z" fill="${col}"/><path d="M -60,-130 C -60,-170 60,-170 60,-130" stroke="#2a2a2a" stroke-width="14" fill="none"/>`;
  let js = `cam("all", { scale: 1.05 }, { scale: 1.12, origin: "50% 60%" }, 0, ${dur});
    flicker("#${id}-street", ${dur}, 0.8, 0.05);`;
  [["#3b5d3a", 380], ["#7a2a2a", 560], ["#2a4a7a", 720]].forEach(([, x], k) => {
    const t = 0.1 + k * 0.42;
    js += tw(`#${id}-b${k}`, `translate(${x},2200) scale(1.3)`, `translate(${400 + k * 140},1270) scale(0.7)`, t, 0.4, "power2.out");
  });
  js += `tl.fromTo("#${id}-lid", { y: -150, scaleY: -0.5 }, { y: 0, scaleY: 1, transformOrigin: "50% 100%", duration: 0.35, ease: "power3.in" }, 1.7);
    tl.to(["#${id}-b0", "#${id}-b1", "#${id}-b2"], { opacity: 0, duration: 0.1 }, 1.95);
    tl.to("#${id}-car", { y: 6, duration: 0.06 }, 2.05); tl.to("#${id}-car", { y: 0, duration: 0.2 }, 2.11);`;
  return { id, dur, html: scene({ id, dur, bg: "#0b0f18", vignette: 0.8,
    layers: [{ name: "all", defs: glow(`${id}-sg`, 900, 300, 900, "#ffb45a", 0.45), svg: `
      <rect width="1080" height="1920" fill="#10151f"/><rect y="1100" width="1080" height="820" fill="#1b1d22"/>
      <rect x="700" y="200" width="300" height="520" fill="#1a2030"/><rect x="760" y="300" width="70" height="90" fill="#ffd27a"/><rect x="870" y="300" width="70" height="90" fill="#ffd27a" opacity="0.6"/>
      <rect id="${id}-street" width="1080" height="1920" fill="url(#${id}-sg)" style="mix-blend-mode:screen"/>
      <g transform="translate(540,1560) scale(1.5)"><g id="${id}-car">${C.carRear(`${id}-c`, { open: true }).replace(/r="70" fill="#ff3a2a" opacity="0.35"/g, 'r="40" fill="#ff3a2a" opacity="0.3"')}
        <g id="${id}-lid"><path d="M -250,-220 L 250,-220 L 262,-160 L -262,-160 Z" fill="#4a6178"/></g></g></g>
      ${["#3b5d3a", "#7a2a2a", "#2a4a7a"].map((col, k) => `<g id="${id}-b${k}" transform="translate(${380 + k * 170},2200) scale(1.3)">${bag(col)}</g>`).join("")}
      ${night(id, 0.25)}` }],
    js }) };
}
function a6() {
  const id = "a6", dur = 1.8;
  return { id, dur, html: scene({ id, dur, bg: "#0b0f18", vignette: 0.8,
    layers: [{ name: "all", svg: `
      <rect width="1080" height="1920" fill="#0e1420"/><rect y="1250" width="1080" height="670" fill="#1b1d22"/>
      <g transform="translate(-120,1560) scale(1.45)"><g id="${id}-car">${C.carSide(`${id}-c`)}
        ${[350, 450, 620].map((x) => `<path d="M ${x - 26},-200 C ${x - 26},-226 ${x - 18},-246 ${x},-250 C ${x + 18},-246 ${x + 26},-226 ${x + 26},-200 Z M ${x - 44},-200 C ${x - 40},-214 ${x + 40},-214 ${x + 44},-200 Z" fill="#06080c"/>`).join("")}</g></g>
      <path id="${id}-beam" d="M 1180,1340 L 1500,1200 L 1500,1560 Z" fill="#fff1cf" opacity="0"/>
      ${night(id, 0.25)}` }],
    js: `
    cam("all", { scale: 1.02 }, { scale: 1.07 }, 0, ${dur});
    tl.fromTo("#${id}-c-dr", { scaleX: 0.7 }, { scaleX: 1, transformOrigin: "100% 50%", duration: 0.22, ease: "power3.in" }, 0.15);
    tl.fromTo("#${id}-c-df", { scaleX: 0.72 }, { scaleX: 1, transformOrigin: "0% 50%", duration: 0.22, ease: "power3.in" }, 0.65);
    tl.to("#${id}-car", { y: 4, duration: 0.05 }, 0.37); tl.to("#${id}-car", { y: 0, duration: 0.15 }, 0.42);
    tl.to("#${id}-car", { y: 4, duration: 0.05 }, 0.87); tl.to("#${id}-car", { y: 0, duration: 0.15 }, 0.92);
    tl.fromTo("#${id}-c-hl", { attr: { fill: "#8a8670" } }, { attr: { fill: "#fffbe8" }, duration: 0.1 }, 1.2);
    ` }) };
}

// ── B. the drive: follow from behind, then rise to an aerial view ────────────────────────────────
function b() {
  const id = "b", dur = 10.5;
  const road = forestRoad(`${id}-r`, { dur, speed: 7 });
  // aerial: a winding road through dense canopy
  seed = 23;
  const P = (t) => { const y = 2100 - t * 2400; const x = 540 + 220 * Math.sin(t * 5.2) + 80 * Math.sin(t * 11); return [x, y]; };
  const pts = [...Array(121)].map((_, i) => P(i / 120));
  const d = "M " + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ");
  const canopy = [...Array(260)].map(() => {
    const x = rnd() * 1200 - 60, y = rnd() * 2100 - 90;
    const near = pts.some(([px, py]) => Math.hypot(px - x, py - y) < 120);
    if (near) return "";
    const r = 50 + rnd() * 50, g = ["#0c2019", "#0f2a20", "#123226", "#0a1a15"][Math.floor(rnd() * 4)];
    return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(0)}" fill="${g}"/><circle cx="${(x - r * 0.25).toFixed(0)}" cy="${(y - r * 0.25).toFixed(0)}" r="${(r * 0.55).toFixed(0)}" fill="#1a3d30" opacity="0.6"/>`;
  }).join("");
  const samples = pts.map(([x, y], i) => { const [nx, ny] = pts[Math.min(i + 1, 120)], [px, py] = pts[Math.max(i - 1, 0)]; return [+x.toFixed(1), +y.toFixed(1), +(Math.atan2(ny - py, nx - px) * 180 / Math.PI + 90).toFixed(1)]; });
  const js = `
    ${road.js}
    flicker("#${id}-tlg", ${dur}, 0.4, 0.05);
    cam("road", { scale: 1.0, y: 0 }, { scale: 1.06, y: 0 }, 0, 5.2);
    tl.fromTo("#${id}-carR", { attr: { transform: "translate(540,1500) scale(0.72) rotate(0)" } }, { attr: { transform: "translate(548,1500) scale(0.72) rotate(0.6)" }, duration: 1.3, ease: "sine.inOut", yoyo: true, repeat: 3 }, 0);
    ${mistDrift(`${id}-r`, 5, dur)}
    // the camera rises: the road shot drifts down and fades, the aerial comes in from close and pulls back
    tl.to("#${S("road")}", { y: 420, scale: 1.25, duration: 2.0, ease: "power2.in" }, 4.6);
    tl.to("#${S("road")}", { opacity: 0, duration: 1.0, ease: "power1.inOut" }, 5.4);
    tl.fromTo("#${S("air")}", { opacity: 0 }, { opacity: 1, duration: 1.0, ease: "power1.inOut" }, 5.4);
    cam("air", { scale: 1.7, rotation: 8 }, { scale: 1.05, rotation: 0, origin: "50% 60%" }, 5.4, 5.1, "power2.out");
    (function () {
      const SM = ${JSON.stringify(samples)}; const car = document.getElementById("${id}-carA"); const o = { u: 0 };
      tl.fromTo(o, { u: 0.12 }, { u: 0.62, duration: ${dur}, ease: "none", onUpdate() {
        const f = o.u * (SM.length - 1), i = Math.floor(f), k = f - i, a = SM[i], b2 = SM[Math.min(i + 1, SM.length - 1)];
        const x = a[0] + (b2[0] - a[0]) * k, y = a[1] + (b2[1] - a[1]) * k, r = a[2] + (b2[2] - a[2]) * k;
        car.setAttribute("transform", "translate(" + x.toFixed(1) + "," + y.toFixed(1) + ") rotate(" + r.toFixed(1) + ")");
      } }, 0);
    })();
    ${mistDrift(`${id}-a`, 6, dur, 120)}
  `;
  return { id, dur, html: scene({ id, dur, fadeIn: true, bg: "#05080f", vignette: 0.85,
    layers: [
      { name: "road", defs: road.defs + `<radialGradient id="${id}-tg"><stop offset="0" stop-color="#ff4a3a" stop-opacity="0.8"/><stop offset="1" stop-color="#ff4a3a" stop-opacity="0"/></radialGradient><linearGradient id="${id}-beamG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff2cc" stop-opacity="0.55"/><stop offset="1" stop-color="#fff2cc" stop-opacity="0"/></linearGradient>`, svg: `
        ${road.svg}
        <path d="M 400,1400 L 680,1400 L 600,860 L 480,860 Z" fill="url(#${id}-beamG)" style="mix-blend-mode:screen"/>
        ${mist(`${id}-r`, 820, 5, 0.14)}
        <g id="${id}-carR" transform="translate(540,1500) scale(0.72)">${C.carRear(`${id}-c`).replace(/r="70" fill="#ff3a2a" opacity="0.35"/g, 'r="0"')}</g>
        <g id="${id}-tlg" style="mix-blend-mode:screen"><circle cx="373" cy="1378" r="70" fill="url(#${id}-tg)"/><circle cx="707" cy="1378" r="70" fill="url(#${id}-tg)"/></g>
        ${night(id, 0.2)}` },
      { name: "air", defs: `<radialGradient id="${id}-hb" cx="0.5" cy="1" r="1"><stop offset="0" stop-color="#fff2cc" stop-opacity="0.7"/><stop offset="1" stop-color="#fff2cc" stop-opacity="0"/></radialGradient>`, svg: `
        <rect width="1080" height="1920" fill="#081410"/>
        <path d="${d}" stroke="#1d1f24" stroke-width="110" fill="none" stroke-linejoin="round"/>
        <path d="${d}" stroke="#4a4a44" stroke-width="3" fill="none" stroke-dasharray="30 40" opacity="0.6"/>
        <g id="${id}-carA"><path d="M -60,-60 L 60,-60 L 200,-420 L -200,-420 Z" fill="url(#${id}-hb)" style="mix-blend-mode:screen"/>
          <rect x="-34" y="-62" width="68" height="124" rx="16" fill="#34485e"/><rect x="-26" y="-40" width="52" height="30" rx="6" fill="#1c2633"/><rect x="-26" y="22" width="52" height="22" rx="6" fill="#1c2633"/>
          <rect x="-30" y="56" width="16" height="6" fill="#ff3a2a"/><rect x="14" y="56" width="16" height="6" fill="#ff3a2a"/></g>
        ${canopy}
        ${mist(`${id}-a`, 500, 6, 0.12)}
        ${night(id, 0.25)}` },
    ],
    js: js.replace(/\$\{S\("(\w+)"\)\}/g, "") }) };
}
const S = (l) => `b-${l}`;

// ── C. the cabin ─────────────────────────────────────────────────────────────────────────────────
function cabin() {
  const logs = [...Array(10)].map((_, i) => `<rect x="-360" y="${-420 + i * 42}" width="720" height="38" rx="19" fill="${i % 2 ? "#6a4226" : "#5e3a22"}"/>`).join("");
  return `<g>
    <ellipse cx="0" cy="10" rx="460" ry="40" fill="#000" opacity="0.5"/>
    ${logs}
    <path d="M -420,-420 L 0,-700 L 420,-420 Z" fill="#2e1c10"/><path d="M -440,-410 L 0,-712 L 440,-410" stroke="#1e1208" stroke-width="22" fill="none"/>
    <rect x="200" y="-760" width="70" height="200" fill="#3a2a22"/>
    <g id="cabin-win"><rect x="-300" y="-330" width="150" height="130" fill="#ffd27a"/><rect x="150" y="-330" width="150" height="130" fill="#ffd27a"/>
      <path d="M -225,-330 L -225,-200 M -300,-265 L -150,-265 M 225,-330 L 225,-200 M 150,-265 L 300,-265" stroke="#3a2414" stroke-width="8"/></g>
    <rect x="-70" y="-300" width="140" height="300" fill="#3a2414"/><circle cx="40" cy="-150" r="8" fill="#c9a24a"/>
    <path d="M -400,0 L 400,0 L 420,30 L -420,30 Z" fill="#4a2e1a"/>
  </g>`;
}
function c() {
  const id = "c", dur = 8.5;
  seed = 31;
  const bgTrees = [...Array(22)].map((_, i) => `<g transform="translate(${-60 + i * 55 + rnd() * 30},${1000 + rnd() * 60}) scale(${0.55 + rnd() * 0.3})">${pine(i % 2 ? "#0a1714" : "#0d1d19", "#142c25")}</g>`).join("");
  const fgTrees = [[-40, 1960, 1.3], [1100, 1960, 1.4], [980, 1500, 0.8], [60, 1480, 0.75]].map(([x, y, s]) => `<g transform="translate(${x},${y}) scale(${s})">${pine("#050c0a", "#0a1a15")}</g>`).join("");
  const stopX = 40, carY = 1560;
  const fr = (who, k) => {
    const x0 = 230 + k * 120, y0 = 1540;
    return `<g id="${id}-${who}-pos" transform="translate(${x0},${y0}) scale(0.13)"><g id="${id}-${who}" opacity="0">${C.friendFull(`${id}-${who}`, who, { back: true, bag: true })}</g></g>`;
  };
  let js = `
    cam("bg", { scale: 1.02, x: 0 }, { scale: 1.12, x: -60, origin: "60% 70%" }, 0, ${dur});
    cam("mid", { scale: 1.02, x: 0 }, { scale: 1.22, x: -110, origin: "60% 70%" }, 0, ${dur});
    cam("fg", { scale: 1.02, x: 0 }, { scale: 1.35, x: -200, origin: "60% 70%" }, 0, ${dur});
    flicker("#cabin-win", ${dur}, 0.95, 0.05); flicker("#${id}-wg", ${dur}, 0.8, 0.08);
    ${mistDrift(id, 5, dur, 60)}
    ${tw(`#${id}-car`, `translate(-700,${carY}) scale(0.6)`, `translate(${stopX},${carY}) scale(0.6)`, 0, 2.4, "power2.out")}
    tl.fromTo(["#${id}-k-wb", "#${id}-k-wf"], { rotation: 0 }, { rotation: 620, transformOrigin: "50% 50%", duration: 2.4, ease: "power2.out" }, 0);
    tl.fromTo("#${id}-beam", { opacity: 0.8 }, { opacity: 0.0, duration: 0.6 }, 2.8);
    tl.fromTo("#${id}-k-dr", { scaleX: 1 }, { scaleX: 0.25, transformOrigin: "100% 50%", duration: 0.4, ease: "power2.out" }, 2.8);
    tl.fromTo("#${id}-k-df", { scaleX: 1 }, { scaleX: 0.25, transformOrigin: "0% 50%", duration: 0.4, ease: "power2.out" }, 2.9);
  `;
  ["r", "w", "b"].forEach((who, k) => {
    const t0 = 3.2 + k * 0.3;
    js += `tl.fromTo("#${id}-${who}", { opacity: 0 }, { opacity: 1, duration: 0.25 }, ${t0});
    ${tw(`#${id}-${who}-pos`, `translate(${230 + k * 120},1540) scale(0.13)`, `translate(${560 + k * 70},1238) scale(0.105)`, t0 + 0.3, 4.6 - k * 0.3, "power1.inOut")}
    ${walk(`${id}-${who}`, t0 + 0.3, 12 - k, 0.36)}`;
  });
  js += `tl.to(["#${id}-k-dr", "#${id}-k-df"], { scaleX: 1, duration: 0.3, ease: "power3.in" }, 4.4);`;
  return { id, dur, html: scene({ id, dur, bg: "#05080f", vignette: 0.85, fadeOut: true,
    layers: [
      { name: "bg", blur: 2, defs: `<linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#04070e"/><stop offset="1" stop-color="#16233a"/></linearGradient>`, svg: `
        <rect width="1080" height="1920" fill="url(#${id}-sky)"/>
        ${[...Array(40)].map((_, i) => `<circle cx="${(i * 137) % 1080}" cy="${(i * 89) % 700}" r="${1 + (i % 3)}" fill="#dfe6ff" opacity="${0.4 + (i % 4) * 0.12}"/>`).join("")}
        <circle cx="830" cy="330" r="60" fill="#e9e6d6"/><circle cx="830" cy="330" r="160" fill="#e9e6d6" opacity="0.08"/>
        ${bgTrees}
        <rect y="1180" width="1080" height="740" fill="#0d1a14"/>` },
      { name: "mid", defs: glow(`${id}-wgg`, 700, 950, 600, "#ffb24a", 0.5), svg: `
        <g transform="translate(700,1240) scale(0.7)">${cabin()}</g>
        <rect id="${id}-wg" width="1080" height="1920" fill="url(#${id}-wgg)" style="mix-blend-mode:screen"/>
        <path d="M 560,1260 C 520,1400 420,1500 300,1600 L 520,1600 C 600,1480 650,1380 680,1260 Z" fill="#2a2418" opacity="0.8"/>
        ${mist(id, 1180, 5, 0.12)}
        <g id="${id}-car" transform="translate(-700,${carY}) scale(0.6)">${C.carSide(`${id}-k`)}<path id="${id}-beam" d="M 896,-140 L 1600,-280 L 1600,40 Z" fill="#fff1cf" opacity="0.8"/></g>
        ${["r", "w", "b"].map(fr).join("")}
        ${night(id, 0.2)}` },
      { name: "fg", blur: 6, svg: fgTrees },
    ],
    js }) };
}

// ── D. inside the cabin ───────────────────────────────────────────────────────────────────────────
function cabinInside(id, { window = true } = {}) {
  return `<rect width="1080" height="1920" fill="#5a3820"/>
    ${[...Array(30)].map((_, i) => `<rect x="-20" y="${i * 66}" width="1120" height="60" rx="30" fill="${i % 2 ? "#6a4428" : "#5e3c22"}"/>`).join("")}
    ${window ? `<rect x="760" y="420" width="300" height="440" fill="#2a1a10"/><rect x="778" y="438" width="264" height="404" fill="#0c1426"/>
      ${[...Array(5)].map((_, i) => `<g transform="translate(${800 + i * 60},${840}) scale(0.18)">${pine("#050c0a", "#0a1a15")}</g>`).join("")}
      <path d="M 910,438 L 910,842 M 778,640 L 1042,640" stroke="#2a1a10" stroke-width="12"/>` : ""}
    <g transform="translate(130,1000)"><rect x="-130" y="-260" width="260" height="300" fill="#4a4440"/><rect x="-90" y="-180" width="180" height="200" rx="10" fill="#120a06"/>
      <path id="${id}-fire" d="M -60,20 C -60,-60 -20,-80 0,-140 C 20,-80 60,-60 60,20 Z" fill="#ffa030"/><path d="M -30,20 C -30,-30 -10,-40 0,-80 C 10,-40 30,-30 30,20 Z" fill="#ffe08a"/></g>
    <g transform="translate(540,300)"><path d="M -10,0 L 10,0 L 10,60 L -10,60 Z" fill="#2a1a10"/><rect x="-30" y="60" width="60" height="80" rx="10" fill="#ffcf6a" opacity="0.9"/></g>`;
}
function d1() {
  const id = "d1", dur = 4.0, r = `${id}-r`, w = `${id}-w`, b = `${id}-b`;
  return { id, dur, html: scene({ id, dur, bg: "#3a2414", vignette: 0.8,
    layers: [
      { name: "room", blur: 6, svg: cabinInside(id) },
      { name: "friends", defs: glow(`${id}-fg`, 100, 1000, 1000, "#ff9a40", 0.5), svg: `
        <path d="M 30,1150 C 30,1050 80,1020 160,1020 L 920,1020 C 1000,1020 1050,1050 1050,1150 L 1070,1700 L 10,1700 Z" fill="#7a2e22"/>
        ${place(230, 1040, 0.78, C.friend(w, WHITE, { kind: "fade", beard: true }), `${w}-all`)}
        ${place(540, 1030, 0.82, C.friend(r, RED, { kind: "wavy" }), `${r}-all`)}
        ${place(850, 1045, 0.78, C.friend(b, BLUE, { kind: "curly" }), `${b}-all`)}
        <path d="M -40,1640 L 1120,1640 L 1120,1960 L -40,1960 Z" fill="#4a2a18"/>
        <rect id="${id}-firelight" width="1080" height="1920" fill="url(#${id}-fg)" style="mix-blend-mode:screen"/>` },
    ],
    js: `
    cam("room", { scale: 1.04 }, { scale: 1.08 }, 0, ${dur});
    cam("friends", { scale: 1.0 }, { scale: 1.05 }, 0, ${dur});
    flicker("#${id}-firelight", ${dur}, 0.85, 0.12); flicker("#${id}-fire", ${dur}, 0.9, 0.1);
    look("${b}", 8, -3, 0.2, 0.3); turn("${b}", 10, 0.3, 0.4); brows("${b}", -8, 0, 0.4, 0.3);
    tl.to("#${b}-all", { y: -420, duration: 0.7, ease: "power2.out" }, 1.0);
    tl.to("#${b}-all", { x: 520, duration: 1.4, ease: "power1.in" }, 1.6);
    look("${w}", 9, -6, 1.1, 0.3); turn("${w}", 12, 1.2, 0.4);
    look("${r}", 9, -6, 1.2, 0.3); turn("${r}", 10, 1.3, 0.4);
    blink("${r}", 2.6); look("${r}", 10, -2, 2.8, 0.4);
    ` }) };
}
function d2() {
  const id = "d2", dur = 3.2, b = `${id}-b`;
  return { id, dur, html: scene({ id, dur, bg: "#0a1020", vignette: 0.8,
    layers: [
      { name: "inside", blur: 10, svg: cabinInside(id, { window: false }) },
      { name: "him", svg: `${place(540, 980, 1.5, C.friend(b, BLUE, { kind: "curly" }), `${b}-all`)}
        <rect width="1080" height="1920" fill="#8aa8ff" opacity="0.18" style="mix-blend-mode:screen"/>` },
      { name: "glass", svg: `
        <path d="M 0,0 L 1080,0 L 1080,1920 L 0,1920 Z M 120,250 L 960,250 L 960,1700 L 120,1700 Z" fill="#2a1a10" fill-rule="evenodd"/>
        <path d="M 540,250 L 540,1700 M 120,980 L 960,980" stroke="#2a1a10" stroke-width="26"/>
        <path d="M 200,300 L 420,300 L 200,700 Z" fill="#fff" opacity="0.06"/><path d="M 600,1050 L 900,1050 L 600,1500 Z" fill="#fff" opacity="0.05"/>
        <rect x="120" y="250" width="840" height="1450" fill="#0a1430" opacity="0.22"/>` },
      { name: "branch", blur: 12, svg: `<path d="M -60,1500 C 200,1440 360,1520 520,1700 C 380,1620 200,1600 -60,1640 Z" fill="#050c0a"/><path d="M 1140,300 C 900,340 760,420 700,520 C 820,460 960,430 1140,420 Z" fill="#050c0a"/>` },
    ],
    js: `
    cam("inside", { scale: 1.05 }, { scale: 1.08 }, 0, ${dur});
    cam("him", { scale: 1.0 }, { scale: 1.06, origin: "50% 45%" }, 0, ${dur});
    cam("glass", { scale: 1.0 }, { scale: 1.04 }, 0, ${dur});
    cam("branch", { scale: 1.0, x: 0 }, { scale: 1.05, x: 30 }, 0, ${dur});
    brows("${b}", -10, -2, 0, 0.01); eyesOpen("${b}", 1.1, 0, 0.01); look("${b}", -8, -2, 0, 0.01);
    look("${b}", 8, -3, 0.6, 0.6); turn("${b}", 8, 0.6, 0.6);
    look("${b}", 2, 2, 1.6, 0.4); brows("${b}", -14, -4, 1.7, 0.3);
    tl.to("#${b}-all", { y: -14, scale: 1.02, transformOrigin: "50% 50%", duration: 0.5, ease: "power2.out" }, 1.8);
    blink("${b}", 2.5); look("${b}", -6, 0, 2.7, 0.4); turn("${b}", -6, 2.7, 0.4);
    ` }) };
}
function d3() {
  const id = "d3", dur = 4.8, r = `${id}-r`, w = `${id}-w`, b = `${id}-b`;
  return { id, dur, html: scene({ id, dur, bg: "#3a2414", vignette: 0.8,
    layers: [
      { name: "room", blur: 7, svg: cabinInside(id) },
      { name: "people", defs: glow(`${id}-fg`, 100, 1000, 1000, "#ff9a40", 0.5), svg: `
        <path d="M -200,1250 C -200,1150 -150,1120 -70,1120 L 560,1120 C 640,1120 690,1150 690,1250 L 710,1800 L -220,1800 Z" fill="#7a2e22"/>
        ${place(90, 1140, 0.74, C.friend(w, WHITE, { kind: "fade", beard: true }), `${w}-all`)}
        ${place(400, 1130, 0.76, C.friend(r, RED, { kind: "wavy" }), `${r}-all`)}
        ${place(840, 760, 0.95, C.friend(b, BLUE, { kind: "curly" }), `${b}-all`)}
        <rect id="${id}-firelight" width="1080" height="1920" fill="url(#${id}-fg)" style="mix-blend-mode:screen"/>` },
    ],
    js: `
    cam("room", { scale: 1.5, x: -280, y: 240, origin: "50% 50%" }, { scale: 1.06, x: 0, y: 0 }, 0.9, 3.4, "power2.inOut");
    cam("people", { scale: 1.75, x: -480, y: 380, origin: "50% 50%" }, { scale: 1.06, x: 0, y: 0 }, 0.9, 3.4, "power2.inOut");
    flicker("#${id}-firelight", ${dur}, 0.85, 0.12); flicker("#${id}-fire", ${dur}, 0.9, 0.1);
    look("${b}", -8, 0, 0, 0.01); brows("${b}", -12, -3, 0, 0.01); eyesOpen("${b}", 1.12, 0, 0.01);
    look("${w}", 9, -6, 0, 0.01); turn("${w}", 12, 0, 0.01); look("${r}", 9, -6, 0, 0.01); turn("${r}", 10, 0, 0.01);
    ${armTo(b, 1, -150, -10, 0.3, 0.45, "back.out(1.4)")}
    turn("${b}", 8, 0.3, 0.3); look("${b}", 8, -4, 0.3, 0.2);
    turn("${b}", -6, 0.9, 0.3); look("${b}", -8, 0, 0.9, 0.2);
    ${armTo(b, 1, -10, 55, 1.2, 0.4)}
    ${armTo(b, -1, 70, -120, 1.3, 0.35, "power2.out")}
    ${[0, 1, 2].map((k) => armTo(b, -1, 70, -120 + (k % 2 ? 0 : 40), (1.7 + k * 0.25).toFixed(2), 0.22, "sine.inOut")).join("\n")}
    tl.to("#${b}-all", { y: -16, duration: 0.25, ease: "power2.out" }, 1.4); tl.to("#${b}-all", { y: 0, duration: 0.35 }, 1.65);
    brows("${w}", -8, 0, 2.6, 0.3); eyesOpen("${w}", 1.1, 2.6, 0.3);
    brows("${r}", -3, -6, 3.0, 0.4); blink("${r}", 3.5); look("${r}", 10, -3, 3.8, 0.4);
    ` }) };
}

// ── E. agreement, then red ───────────────────────────────────────────────────────────────────────
function e() {
  const id = "e", dur = 5.5, r = `${id}-r`, w = `${id}-w`, b = `${id}-b`;
  return { id, dur, html: scene({ id, dur, bg: "#3a2414", vignette: 0.8,
    layers: [
      { name: "room", blur: 12, svg: `<g transform="translate(-200,0) scale(1.4)">${cabinInside(id)}</g>` },
      { name: "people", defs: glow(`${id}-fg`, 100, 1000, 1000, "#ff9a40", 0.45), svg: `
        ${place(330, 1020, 1.25, C.friend(w, WHITE, { kind: "fade", beard: true, grin: true }), `${w}-all`)}
        ${place(860, 800, 1.25, C.friend(b, BLUE, { kind: "curly", grin: true }), `${b}-all`)}
        ${place(1680, 1060, 1.9, C.friend(r, RED, { kind: "wavy" }), `${r}-all`)}
        <rect x="1200" y="0" width="1100" height="1920" fill="url(#${id}-dark)"/>
        <rect id="${id}-firelight" x="-200" width="2600" height="1920" fill="url(#${id}-fg)" style="mix-blend-mode:screen"/>`,
        extra: "" },
    ],
    js: `
    flicker("#${id}-firelight", ${dur}, 0.85, 0.12);
    cam("room", { x: 0 }, { x: -260 }, 2.2, 1.4, "power2.inOut");
    cam("people", { x: 0 }, { x: -1050 }, 2.2, 1.4, "power2.inOut");
    eyesOpen("${w}", 0.75, 0, 0.01); eyesOpen("${b}", 0.75, 0, 0.01); look("${w}", 8, -3, 0, 0.01); look("${b}", -6, 2, 0, 0.01);
    brows("${w}", -8, 0, 0, 0.01); brows("${b}", -10, 0, 0, 0.01);
    ${nod(w, 0.3, 14)} ${nod(w, 0.8, 14)} ${nod(w, 1.3, 10)}
    ${armTo(b, -1, 150, 20, 0.4, 0.35, "back.out(1.6)")}
    ${armTo(b, -1, 150, -10, 0.85, 0.15, "power2.in")} ${armTo(b, -1, 150, 20, 1.0, 0.15, "power2.out")}
    ${nod(b, 1.2, 12)}
    look("${r}", -8, 0, 0, 0.01); brows("${r}", -4, -4, 0, 0.01);
    look("${r}", -6, 1, 3.6, 0.3); blink("${r}", 3.9);
    look("${r}", 9, -5, 4.3, 0.6); turn("${r}", 8, 4.3, 0.6); brows("${r}", 0, 7, 4.4, 0.6); eyesOpen("${r}", 0.88, 4.5, 0.5);
    `, }).replace("</defs>", `<linearGradient id="${id}-dark" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/></linearGradient></defs>`) };
}

// ── F. red, close-up: hidden fear, a reluctant nod ───────────────────────────────────────────────
function f() {
  const id = "f", dur = 5.5, r = `${id}-r`;
  return { id, dur, html: scene({ id, dur, bg: "#2a1a10", vignette: 0.9,
    layers: [
      { name: "room", blur: 16, svg: `<g transform="translate(-300,-200) scale(1.6)">${cabinInside(id)}</g>` },
      { name: "face", defs: glow(`${id}-fg`, 0, 900, 1100, "#ff9a40", 0.45) + glow(`${id}-cool`, 1080, 700, 900, "#5a7aff", 0.22), svg: `
        ${place(540, 860, 2.4, C.friend(r, RED, { kind: "wavy" }), `${r}-all`)}
        <rect id="${id}-firelight" width="1080" height="1920" fill="url(#${id}-fg)" style="mix-blend-mode:screen"/>
        <rect width="1080" height="1920" fill="url(#${id}-cool)" style="mix-blend-mode:screen"/>` },
    ],
    js: `
    flicker("#${id}-firelight", ${dur}, 0.85, 0.14);
    cam("face", { scale: 1.0 }, { scale: 1.03, origin: "50% 40%" }, 0, ${dur});
    look("${r}", -7, 0, 0, 0.01); brows("${r}", -3, -9, 0, 0.01); eyesOpen("${r}", 0.95, 0, 0.01);
    ${[0.3, 0.7, 1.05].map((t, k) => `look("${r}", ${-7 + (k % 2 ? 1.5 : -1)}, ${k % 2 ? 0.8 : -0.5}, ${t}, 0.12);`).join(" ")}
    look("${r}", -2, 8, 1.6, 0.45); eyesOpen("${r}", 0.8, 1.6, 0.45); brows("${r}", 0, -11, 1.6, 0.5);
    tl.to("#${r}-head", { y: 8, rotation: 1.5, transformOrigin: "50% 90%", duration: 0.5, ease: "power2.inOut" }, 1.6);
    blink("${r}", 2.5, 0.32);
    look("${r}", -7, 0, 3.0, 0.4); eyesOpen("${r}", 0.92, 3.0, 0.4); brows("${r}", -5, -7, 3.0, 0.4);
    tl.to("#${r}-head", { y: 0, rotation: 0, transformOrigin: "50% 90%", duration: 0.4, ease: "power2.inOut" }, 3.0);
    ${nod(r, 3.6, 12, 0.7)} ${nod(r, 4.4, 9, 0.7)}
    ` }) };
}

// ── G. flashlights, into the forest ──────────────────────────────────────────────────────────────
function g1() {
  const id = "g1", dur = 2.2;
  return { id, dur, html: scene({ id, dur, bg: "#020305", vignette: 0.7,
    layers: [{ name: "all", defs: `<linearGradient id="${id}-bm" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0" stop-color="#f4f8ff" stop-opacity="0.85"/><stop offset="1" stop-color="#f4f8ff" stop-opacity="0"/></linearGradient>`, svg: `
      <rect width="1080" height="1920" fill="#020305"/>
      <g id="${id}-lit" opacity="0">${[...Array(6)].map((_, i) => `<g transform="translate(${300 + i * 150},${1200 - (i % 2) * 80}) scale(0.5)">${pine("#0e1e1a", "#1e3a32")}</g>`).join("")}
        <path d="M 330,1010 L 1200,560 L 1200,1500 Z" fill="url(#${id}-bm)"/>
        ${[...Array(18)].map((_, i) => `<circle id="${id}-p${i}" cx="${500 + (i * 53) % 600}" cy="${900 + (i * 37) % 300}" r="${2 + (i % 3)}" fill="#fff" opacity="0.6"/>`).join("")}</g>
      <g transform="translate(330,1010) rotate(-27)">
        <rect x="-420" y="-34" width="400" height="68" rx="18" fill="#2a2d34"/><rect x="-40" y="-52" width="70" height="104" rx="14" fill="#3a3e48"/>
        <ellipse id="${id}-lens" cx="30" cy="0" rx="10" ry="46" fill="#5a6070"/>
        <rect id="${id}-sw" x="-220" y="-48" width="40" height="20" rx="6" fill="#c9a24a"/></g>
      <g transform="translate(80,1080) rotate(-27)"><path d="M -60,-60 C 40,-80 150,-70 180,-40 L 190,60 C 120,90 0,90 -60,70 Z" fill="${WHITE.skin}"/>
        <g id="${id}-thumb"><path d="M 60,-60 C 70,-110 110,-130 150,-110 C 170,-96 160,-74 130,-66 Z" fill="${WHITE.skinSh}"/></g>
        <rect x="-300" y="-80" width="260" height="170" fill="${WHITE.shirt}"/></g>` }],
    js: `
    cam("all", { scale: 1.05 }, { scale: 1.12, origin: "35% 55%" }, 0, ${dur});
    tl.to("#${id}-thumb", { x: 10, y: 14, duration: 0.12, ease: "power2.in" }, 0.6); tl.to("#${id}-thumb", { x: 0, y: 0, duration: 0.15 }, 0.74);
    tl.set("#${id}-lens", { attr: { fill: "#ffffff" } }, 0.72);
    tl.fromTo("#${id}-lit", { opacity: 0 }, { opacity: 1, duration: 0.12, ease: "power2.out" }, 0.72);
    ${[...Array(18)].map((_, i) => `tl.fromTo("#${id}-p${i}", { x: 0, y: 0 }, { x: ${(i % 5) * 6 - 12}, y: ${-(i % 4) * 8}, duration: 1.4, ease: "none" }, 0.72);`).join(" ")}
    ` }) };
}
function g2() {
  const id = "g2", dur = 1.4;
  const beam = (k, x, y, rot) => `<g id="${id}-b${k}" opacity="0" transform="translate(${x},${y}) rotate(${rot})"><path d="M 0,0 L 900,-260 L 900,260 Z" fill="url(#${id}-bm)"/><circle r="22" fill="#fff"/></g>`;
  return { id, dur, html: scene({ id, dur, bg: "#020305", vignette: 0.7,
    layers: [{ name: "all", defs: `<linearGradient id="${id}-bm" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0" stop-color="#f4f8ff" stop-opacity="0.6"/><stop offset="1" stop-color="#f4f8ff" stop-opacity="0"/></linearGradient>`, svg: `
      <rect width="1080" height="1920" fill="#020305"/>
      ${[...Array(9)].map((_, i) => `<g transform="translate(${-40 + i * 140},${1150 + (i % 3) * 30}) scale(0.6)">${pine("#081210", "#10221d")}</g>`).join("")}
      <rect width="1080" height="1920" fill="#020305" opacity="0.75"/>
      ${beam(0, 200, 1300, -60)}${beam(1, 880, 1340, -120)}${beam(2, 540, 1500, -90)}` }],
    js: `
    cam("all", { scale: 1.0 }, { scale: 1.05 }, 0, ${dur});
    tl.set("#${id}-b2", { opacity: 1 }, 0.0);
    tl.set("#${id}-b0", { opacity: 1 }, 0.35);
    tl.set("#${id}-b1", { opacity: 1 }, 0.7);
    ` }) };
}
function g3() {
  const id = "g3", dur = 6.5;
  const road = forestRoad(`${id}-r`, { dur, speed: 1.1, dirt: true, roadHalf: 300, vy: 820, n: 40 });
  const people = [["w", 380, 1420, 0.17], ["r", 540, 1460, 0.18], ["b", 700, 1420, 0.17]];
  let js = `${road.js}
    cam("path", { scale: 1.0 }, { scale: 1.06, origin: "50% 60%" }, 0, ${dur});
    cam("walkers", { scale: 1.0 }, { scale: 1.04, origin: "50% 80%" }, 0, ${dur});
    ${mistDrift(`${id}-r`, 5, dur, 50)}`;
  people.forEach(([who], k) => {
    js += walk(`${id}-${who}`, 0.05 * k, Math.floor((dur - 0.1) / 0.5), 0.5, 14);
    js += `tl.fromTo("#${id}-bm-${who}", { rotation: ${-3 + k * 3} }, { rotation: ${3 - k * 3}, svgOrigin: "0 0", duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: 3 }, 0);`;
  });
  return { id, dur, html: scene({ id, dur, bg: "#020305", vignette: 0.9, fadeOut: true,
    layers: [
      { name: "path", defs: road.defs + `<linearGradient id="${id}-bmg" x1="0.5" y1="1" x2="0.5" y2="0"><stop offset="0" stop-color="#eef4ff" stop-opacity="0.5"/><stop offset="1" stop-color="#eef4ff" stop-opacity="0"/></linearGradient>`, svg: `
        ${road.svg}
        ${mist(`${id}-r`, 840, 5, 0.12)}
        ${people.map(([who, x, y], k) => `<g transform="translate(${x},${y - 150})"><g id="${id}-bm-${who}"><path d="M -30,0 L 30,0 L ${110 - k * 40},-560 L ${-110 - k * 40},-560 Z" fill="url(#${id}-bmg)" style="mix-blend-mode:screen"/></g></g>`).join("")}
        <rect width="1080" height="1920" fill="#020407" opacity="0.4"/>` },
      { name: "walkers", svg: `${people.map(([who, x, y, s]) => `<g transform="translate(${x},${y}) scale(${s})"><g id="${id}-${who}-wrap">${C.friendFull(`${id}-${who}`, who, { back: true, bag: true })}</g></g>`).join("")}
        <rect width="1080" height="1920" fill="#0a1430" opacity="0.45" style="mix-blend-mode:multiply"/>` },
    ],
    js }) };
}

export { pine, forestRoad, mist, mistDrift, walk, armTo, nod, tw, night, topHand };
// SVG ids repeat across shots only where a shot draws the same set piece twice; ids are prefixed per shot.
const shots = [
  deskShot("a1", 1.6, "r", [{ x: 420, tx: 520, ty: 960, r: -20, svg: SWEATER }, { x: 640, tx: 560, ty: 940, r: 18, svg: TSHIRT }]),
  deskShot("a2", 1.4, "w", [{ x: 380, tx: 500, ty: 950, r: -14, svg: CHIPS }, { x: 700, tx: 600, ty: 960, r: 20, svg: BOTTLE }]),
  deskShot("a3", 1.8, "b", [{ x: 480, tx: 540, ty: 950, r: -30, svg: TORCH }], { zip: true }),
  a4(), a5(), a6(), b(), c(), d1(), d2(), d3(), e(), f(), g1(), g2(), g3(),
];
// the cabin's window group uses a fixed id; give it the shot's prefix
export default shots.map((s) => ({ ...s, html: s.html.replace(/cabin-win/g, `${s.id}-cabin-win`) }));
