// Hook for the talisman video: «رفت پیش دعانویس و گفت:» — the girl and the old talisman writer in one frame, a photo
// on old paper ringed with charms and seals. Run: node build/build.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scene, place } from "../../talisman/build/lib.mjs";
import * as C from "../../fortune-teller-2/build/chars.mjs";
import { roomBehindGirl, table, candle, light } from "../../fortune-teller-2/build/scene1.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DUR = 3.4, VO = 0.3; // narration starts at 0.3 s
const WORDS = [["رفت", 0.22, 0.6], ["پیش", 0.6, 0.98], ["دعانویس", 0.98, 1.7], ["و", 1.7, 1.91], ["گفت:", 1.91, 2.29]];
const id = "h1", g = `${id}-g`, m = `${id}-m`;
const INK = "#6a1a12";
const FA = `@font-face { font-family: "IRANSans"; src: url('assets/fonts/IRANSans-Black.ttf') format('truetype'); font-weight: 900; }`;
const t = (x, y, s, str, rot = 0, op = 0.85) => `<text x="${x}" y="${y}" font-family="IRANSans" font-weight="900" font-size="${s}" fill="${INK}" text-anchor="middle" opacity="${op}" transform="rotate(${rot} ${x} ${y})">${str}</text>`;

// a seal: two rings, a hexagram, letters around
function seal(x, y, r, k) {
  const L = ["ب", "ج", "د", "ه", "و", "ز", "ح", "ط"];
  const tri = (a0) => [0, 1, 2].map((i) => { const a = a0 + i * 2.094; return `${(x + r * 0.62 * Math.sin(a)).toFixed(1)},${(y - r * 0.62 * Math.cos(a)).toFixed(1)}`; }).join(" ");
  return `<g id="${id}-s${k}"><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${INK}" stroke-width="5"/><circle cx="${x}" cy="${y}" r="${r * 0.78}" fill="none" stroke="${INK}" stroke-width="3"/>
    <polygon points="${tri(0)}" fill="none" stroke="${INK}" stroke-width="4"/><polygon points="${tri(Math.PI)}" fill="none" stroke="${INK}" stroke-width="4"/>
    <circle cx="${x}" cy="${y}" r="${r * 0.14}" fill="${INK}" opacity="0.8"/>
    ${L.map((c, i) => { const a = i * 0.785; return t((x + r * 0.89 * Math.sin(a)).toFixed(1), (y - r * 0.89 * Math.cos(a) + r * 0.07).toFixed(1), Math.round(r * 0.17), c, i * 45); }).join("")}</g>`;
}
// a 3×3 magic square of Persian digits
function square(x, y, s, k) {
  const N = ["۴", "۹", "۲", "۳", "۵", "۷", "۸", "۱", "۶"];
  return `<g id="${id}-q${k}"><rect x="${x - s * 1.5}" y="${y - s * 1.5}" width="${s * 3}" height="${s * 3}" fill="none" stroke="${INK}" stroke-width="5"/>
    <path d="M ${x - s * 0.5},${y - s * 1.5} L ${x - s * 0.5},${y + s * 1.5} M ${x + s * 0.5},${y - s * 1.5} L ${x + s * 0.5},${y + s * 1.5} M ${x - s * 1.5},${y - s * 0.5} L ${x + s * 1.5},${y - s * 0.5} M ${x - s * 1.5},${y + s * 0.5} L ${x + s * 1.5},${y + s * 0.5}" stroke="${INK}" stroke-width="3"/>
    ${N.map((n, i) => t(x + ((i % 3) - 1) * s, y + (Math.floor(i / 3) - 1) * s + s * 0.22, Math.round(s * 0.6), n)).join("")}</g>`;
}
const star = (x, y, r, k) => { const p = [0, 2, 4, 1, 3].map((i) => { const a = i * 1.2566; return `${(x + r * Math.sin(a)).toFixed(1)},${(y - r * Math.cos(a)).toFixed(1)}`; }).join(" ");
  return `<g id="${id}-st${k}"><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${INK}" stroke-width="4"/><polygon points="${p}" fill="none" stroke="${INK}" stroke-width="4"/></g>`; };
const script = (x, y, rot, k, str = "ا ب ج د ه و ز ح ط ی ک ل م ن") => `<g id="${id}-w${k}">${t(x, y, 38, str, rot, 0.7)}</g>`;

// the charms around the photo (the photo spans x 130–950, y 360–1390; captions sit at y ≈ 1430)
const charms = [
  seal(180, 200, 130, 0), square(540, 210, 72, 0), seal(900, 200, 130, 1),
  script(62, 880, -90, 0), script(1018, 880, 90, 1),
  star(200, 1770, 105, 0), seal(540, 1770, 140, 2), square(880, 1770, 60, 1),
];
const charmIds = [`${id}-s0`, `${id}-q0`, `${id}-s1`, `${id}-w0`, `${id}-w1`, `${id}-st0`, `${id}-s2`, `${id}-q1`];

const PX = 130, PY = 360, PW = 820, PH = 1030, sc = PW / 1080, cy0 = 330; // content rows cy0.. are shown
const twoShot = `${roomBehindGirl(id)}
  ${place(320, 900, 0.95, `<g id="${g}-tor">${C.girlBody(g, { coat: true })}</g>${C.girlHead(g, { freckles: true })}`, `${g}-all`)}
  ${place(780, 800, 0.95, C.manBody(m) + C.manHead(m, { gem: true }), `${m}-all`)}
  ${table(1500)}${candle(`${id}-cx`, 540, 1500, 110)}${light(id)}`;
const paper = `<rect width="1080" height="1920" fill="#d9c597"/>
  <rect width="1080" height="1920" fill="url(#${id}-stain)"/>
  ${[[160, 520, 120], [930, 1180, 160], [300, 1600, 140], [820, 420, 90]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#8a6a3a" opacity="0.08"/>`).join("")}`;

const html = scene({ id, dur: DUR, bg: "#d9c597", vignette: 0.7, fadeIn: true, extraStyle: FA,
  layers: [
    { name: "paper", defs: `<radialGradient id="${id}-stain" cx="50%" cy="50%" r="70%"><stop offset="55%" stop-color="#7a5a2a" stop-opacity="0"/><stop offset="100%" stop-color="#5a3a1a" stop-opacity="0.45"/></radialGradient>
        <clipPath id="${id}-ph"><rect x="${PX}" y="${PY}" width="${PW}" height="${PH}"/></clipPath>`,
      svg: `${paper}<rect x="70" y="1428" width="940" height="128" rx="20" fill="#2a120c" opacity="0.82"/><rect x="82" y="1440" width="916" height="104" rx="14" fill="none" stroke="#c99a4a" stroke-width="3" opacity="0.7"/><g id="${id}-glowall">${charms.join("")}</g>
        <g id="${id}-photo">
          <rect x="${PX - 26}" y="${PY - 26}" width="${PW + 52}" height="${PH + 52}" fill="#000" opacity="0.3" transform="translate(10,14)"/>
          <rect x="${PX - 26}" y="${PY - 26}" width="${PW + 52}" height="${PH + 52}" fill="#efe4c8"/>
          <g clip-path="url(#${id}-ph)"><g transform="translate(${PX},${(PY - cy0 * sc).toFixed(1)}) scale(${sc.toFixed(4)})">${twoShot}</g>
            <rect x="${PX}" y="${PY}" width="${PW}" height="${PH}" fill="#7a4a1a" opacity="0.18" style="mix-blend-mode:multiply"/></g>
          <rect x="${PX}" y="${PY}" width="${PW}" height="${PH}" fill="none" stroke="#5a3a1a" stroke-width="4"/>
          ${[[PX - 10, PY - 10, -30], [PX + PW + 10, PY - 10, 30]].map(([x, y, r]) => `<rect x="${x - 50}" y="${y - 18}" width="100" height="36" fill="#e8dcb4" opacity="0.85" transform="rotate(${r} ${x} ${y})"/>`).join("")}
        </g>` },
  ],
  js: `
    cam("paper", { scale: 1.08, rotation: -1.2 }, { scale: 1.0, rotation: 0.4 }, 0, ${DUR}, "power1.out");
    ${charmIds.map((c, i) => `tl.fromTo("#${c}", { opacity: 0, scale: 0.7, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)", transformOrigin: "50% 50%" }, ${(0.15 + i * 0.12).toFixed(2)});`).join(" ")}
    ${["s0", "s1", "s2"].map((s, i) => `tl.fromTo("#${id}-${s}", { rotation: 0, transformOrigin: "50% 50%" }, { rotation: ${i % 2 ? -25 : 25}, duration: ${DUR}, ease: "none", transformOrigin: "50% 50%" }, 0);`).join(" ")}
    flicker("#${id}-glowall", ${DUR}, 0.9, 0.08);
    flicker("#${id}-cx-halo", ${DUR}, 0.8, 0.15); flicker("#${id}-light", ${DUR}, 0.85, 0.08);
    look("${g}", 9, 0, 0, 0.01); turn("${g}", 12, 0, 0.01); brows("${g}", -10, -10, 0, 0.01); eyesOpen("${g}", 1.05, 0, 0.01);
    look("${m}", -9, 2, 0, 0.01); turn("${m}", -10, 0, 0.01);
    blink("${g}", 1.2, 0.26); blink("${m}", 2.0, 0.3);
    tl.fromTo("#${g}-tor", { y: 0 }, { y: -6, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: 2 }, 0);
    tl.to("#${g}-all", { x: 10, duration: 1.2, ease: "sine.inOut" }, 1.4);
  ` });
fs.writeFileSync(path.join(root, "compositions", `${id}.html`), html.replace(/(id="|url\(#)(halo|purpleGlow|ballFill|nightsky|runnerPat)\b/g, `$1${id}-$2`));

// captions: same look as the main film
const w = WORDS.map(([s, a, b]) => ({ w: s, start: a + VO, end: b + VO }));
let js = `tl.fromTo("#cap-p0", { opacity: 0, y: 14, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.16, ease: "power3.out" }, ${(w[0].start - 0.08).toFixed(3)});\n`;
js += `tl.to("#cap-p0", { opacity: 0, filter: "blur(6px)", duration: 0.12, ease: "power2.in" }, ${(DUR + 1).toFixed(3)});\n`;
w.forEach((x, i) => {
  js += `tl.fromTo("#cap-w${i}", { color: "#ffffff", scale: 1 }, { color: "#ffd873", scale: 1.1, duration: 0.07, ease: "power2.out" }, ${x.start.toFixed(3)});\n`;
  if (i < w.length - 1) js += `tl.to("#cap-w${i}", { color: "#ffffff", scale: 1, duration: 0.1, ease: "power2.in" }, ${Math.max(x.start + 0.08, x.end).toFixed(3)});\n`;
});
fs.writeFileSync(path.join(root, "compositions", "cap.html"), `<template>
  <style>
    ${FA}
    #root { position: absolute; inset: 0; pointer-events: none; }
    .cap-page { position: absolute; left: 90px; right: 90px; top: 1430px; text-align: center; direction: rtl; opacity: 0;
      font-family: "IRANSans", sans-serif; font-weight: 900; font-size: 60px; line-height: 1.5; color: #fff;
      text-shadow: 0 4px 14px rgba(0,0,0,0.85), 0 0 3px rgba(0,0,0,0.9); }
    .cap-w { display: inline-block; margin: 0 8px; }
  </style>
  <div id="root" data-composition-id="cap" data-width="1080" data-height="1920"><div class="cap-page" id="cap-p0">${w.map((x, i) => `<span class="cap-w" id="cap-w${i}">${x.w}</span>`).join(" ")}</div></div>
  <script>
    (function () { const tl = gsap.timeline({ paused: true });
    ${js}
    tl.to({}, { duration: ${DUR} }, 0);
    window.__timelines["cap"] = tl; })();
  </script>
</template>
`);

fs.writeFileSync(path.join(root, "index.html"), `<!doctype html>
<html lang="fa" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>Talisman hook</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: #000; }
      #root { position: relative; width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <!-- Generated by build/build.mjs -->
    <div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="1080" data-height="1920">
      <div id="${id}" data-composition-id="${id}" data-composition-src="compositions/${id}.html" data-start="0" data-duration="${DUR}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>
      <audio id="vo" class="clip" src="assets/audio/hook.mp3" data-start="${VO}" data-duration="2.508" data-track-index="4" data-volume="1"></audio>
      <div id="cap" data-composition-id="cap" data-composition-src="compositions/cap.html" data-start="0" data-duration="${DUR}" data-track-index="2" data-track-kind="captions" data-width="1080" data-height="1920"></div>
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`);
console.log("built", DUR + "s");
