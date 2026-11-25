// Part four opens with a recap: «آنچه گذشت» over black, then the end of part three in black and white
// (the door opens → "alone?" → the nod → "then you weren't chosen" → his shock). Run: node build/build.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import shots3 from "../../forest-cabin-3/build/scenes3.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const FA = `@font-face { font-family: "IRANSans"; src: url('assets/fonts/IRANSans-Black.ttf') format('truetype'); font-weight: 900; }`;
const T0 = 2.0; // the title card
const flash = shots3.filter((s) => ["k9", "k10a", "k10b", "k11", "k12", "k13"].includes(s.id));
const total = Math.round((T0 + flash.reduce((a, s) => a + s.dur, 0)) * 100) / 100;
const starts = {}; let acc = T0; for (const s of flash) { starts[s.id] = acc; acc += s.dur; }

fs.mkdirSync(path.join(root, "compositions"), { recursive: true });
for (const f of fs.readdirSync(path.join(root, "compositions"))) if (f.endsWith(".html")) fs.unlinkSync(path.join(root, "compositions", f));
for (const s of flash) fs.writeFileSync(path.join(root, "compositions", `${s.id}.html`), s.html);

// title card: «آنچه گذشت…» over black with a projector flicker
fs.writeFileSync(path.join(root, "compositions", "title.html"), `<template>
  <style>${FA}
    #root { position: absolute; inset: 0; background: #050505; overflow: hidden; }
    #ttl { position: absolute; left: 0; right: 0; top: 820px; text-align: center; direction: rtl; font-family: "IRANSans"; font-weight: 900; font-size: 120px; color: #ecebe6; letter-spacing: 2px; text-shadow: 0 0 30px rgba(255,255,255,0.25); }
    #line { position: absolute; left: 340px; width: 400px; top: 1010px; height: 4px; background: #ecebe6; opacity: 0.7; transform-origin: 50% 50%; }
    #tex { position: absolute; inset: 0; width: 1080px; height: 1920px; opacity: 0.07; mix-blend-mode: screen; }
  </style>
  <div id="root" data-composition-id="title" data-width="1080" data-height="1920">
    <div id="ttl">آنچه گذشت…</div><div id="line"></div>
    <img id="tex" src="assets/img/texture.png" alt="" data-layout-ignore />
  </div>
  <script>(function () { const tl = gsap.timeline({ paused: true });
    tl.fromTo("#ttl", { opacity: 0, scale: 1.08, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.6, ease: "power2.out" }, 0.15);
    tl.fromTo("#line", { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power2.out" }, 0.4);
    const o = { t: 0 }; tl.to(o, { t: ${T0}, duration: ${T0}, ease: "none", onUpdate() { gsap.set("#ttl", { opacity: (0.88 + 0.12 * Math.sin(o.t * 37)) }); } }, 0.75);
    tl.to(["#ttl", "#line"], { opacity: 0, duration: 0.3 }, ${T0 - 0.3});
    tl.to({}, { duration: ${T0} }, 0); window.__timelines["title"] = tl; })();</script>
</template>
`);

// old-film overlay over the flashback: grain, flicker, scratches, dark edges (all from timeline time)
const fdur = total - T0;
fs.writeFileSync(path.join(root, "compositions", "film.html"), `<template>
  <style>
    #root { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
    #grain { position: absolute; left: -60px; top: -60px; width: 1200px; height: 2040px; opacity: 0.2; mix-blend-mode: overlay; }
    #flk { position: absolute; inset: 0; background: #fff; opacity: 0; }
    .sc { position: absolute; top: 0; width: 3px; height: 1920px; background: rgba(240,240,230,0.5); opacity: 0; }
  </style>
  <div id="root" data-composition-id="film" data-width="1080" data-height="1920">
    <img id="grain" src="assets/img/texture.png" alt="" data-layout-ignore />
    <div id="flk"></div><div class="sc" id="sc0"></div><div class="sc" id="sc1"></div>
    <svg width="1080" height="1920" style="position:absolute;inset:0"><defs><radialGradient id="fv" cx="50%" cy="50%" r="72%"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.8"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#fv)"/></svg>
  </div>
  <script>(function () { const tl = gsap.timeline({ paused: true }); const o = { t: 0 };
    tl.to(o, { t: ${fdur.toFixed(2)}, duration: ${fdur.toFixed(2)}, ease: "none", onUpdate() {
      const t = o.t, f = Math.floor(t * 12);
      gsap.set("#grain", { x: ((f * 37) % 60) - 30, y: ((f * 53) % 60) - 30 });
      gsap.set("#flk", { opacity: 0.03 + 0.03 * Math.abs(Math.sin(f * 1.7)) });
      gsap.set("#sc0", { left: (f * 131) % 1080, opacity: (f % 7 === 0) ? 0.6 : 0 });
      gsap.set("#sc1", { left: (f * 271 + 400) % 1080, opacity: (f % 11 === 3) ? 0.45 : 0 });
    } }, 0);
    tl.to({}, { duration: ${fdur.toFixed(2)} }, 0); window.__timelines["film"] = tl; })();</script>
</template>
`);

// captions (same look as the other films): the narrator's «آنچه گذشت» and the old man's two lines
const VO = 0.3;
const L = (words, a, b, who) => { const n = words.length, tot = words.reduce((s, w) => s + w.length + 1.5, 0); let t = a;
  return words.map((w) => { const d = (b - a) * (w.length + 1.5) / tot; const r = { w, start: t, end: t + d, who }; t += d; return r; }); };
const pages = [
  L(["آنچه", "گذشت"], VO + 0.05, VO + 1.19, "n"),
  L(["تنهایی؟"], starts.k10b + 0.6, starts.k10b + 1.5, "o"),
  L(["پس", "انتخاب", "نشدی…"], starts.k12 + 0.8, starts.k12 + 2.6, "o"),
];
const ends = [T0 - 0.15, starts.k10b + 3.3, starts.k12 + 4.4];
let js = "";
pages.forEach((pg, pi) => {
  js += `tl.fromTo("#cap-p${pi}", { opacity: 0, y: 14, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.16, ease: "power3.out" }, ${(pg[0].start - 0.08).toFixed(3)});\n`;
  js += `tl.to("#cap-p${pi}", { opacity: 0, filter: "blur(6px)", duration: 0.12, ease: "power2.in" }, ${(ends[pi] - 0.12).toFixed(3)});\n`;
  pg.forEach((w, wi) => {
    js += `tl.fromTo("#cap-w${pi}-${wi}", { color: "#ffffff", scale: 1 }, { color: "#ffd873", scale: 1.1, duration: 0.07, ease: "power2.out" }, ${w.start.toFixed(3)});\n`;
    js += `tl.to("#cap-w${pi}-${wi}", { color: "#ffffff", scale: 1, duration: 0.1, ease: "power2.in" }, ${Math.max(w.start + 0.08, w.end).toFixed(3)});\n`;
  });
});
fs.writeFileSync(path.join(root, "compositions", "cap.html"), `<template>
  <style>${FA}
    #root { position: absolute; inset: 0; pointer-events: none; }
    .cap-page { position: absolute; left: 90px; right: 90px; top: 1430px; text-align: center; direction: rtl; opacity: 0;
      font-family: "IRANSans", sans-serif; font-weight: 900; font-size: 60px; line-height: 1.5; color: #fff;
      text-shadow: 0 4px 14px rgba(0,0,0,0.85), 0 0 3px rgba(0,0,0,0.9); }
    .cap-w { display: inline-block; margin: 0 8px; }
  </style>
  <div id="root" data-composition-id="cap" data-width="1080" data-height="1920">${pages.map((pg, pi) => `<div class="cap-page" id="cap-p${pi}">${pg.map((w, wi) => `<span class="cap-w" id="cap-w${pi}-${wi}">${w.w}</span>`).join(" ")}</div>`).join("")}</div>
  <script>(function () { const tl = gsap.timeline({ paused: true });
    ${js}
    tl.to({}, { duration: ${total} }, 0); window.__timelines["cap"] = tl; })();</script>
</template>
`);

const BW = "filter: grayscale(1) contrast(1.18) brightness(1.08);";
const hosts = flash.map((s) => `      <div id="${s.id}" style="${BW}" data-composition-id="${s.id}" data-composition-src="compositions/${s.id}.html" data-start="${starts[s.id].toFixed(2)}" data-duration="${s.dur}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>`);
fs.writeFileSync(path.join(root, "index.html"), `<!doctype html>
<html lang="fa" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>Forest Cabin 4 — recap</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: #000; }
      #root { position: relative; width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <!-- Generated by build/build.mjs -->
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="1080" data-height="1920">
      <div id="title" data-composition-id="title" data-composition-src="compositions/title.html" data-start="0" data-duration="${T0}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>
${hosts.join("\n")}
      <div id="film" data-composition-id="film" data-composition-src="compositions/film.html" data-start="${T0}" data-duration="${fdur.toFixed(2)}" data-track-index="5" data-track-kind="graphics" data-width="1080" data-height="1920"></div>
      <div id="cap" data-composition-id="cap" data-composition-src="compositions/cap.html" data-start="0" data-duration="${total}" data-track-index="6" data-track-kind="captions" data-width="1080" data-height="1920"></div>
      <audio id="recap" class="clip" src="assets/audio/recap.mp3" data-start="${VO}" data-duration="1.567" data-track-index="3" data-volume="1"></audio>
      <audio id="flash" class="clip" src="assets/audio/flash.mp3" data-start="${T0}" data-duration="${fdur.toFixed(2)}" data-track-index="4" data-volume="0.9"></audio>
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`);
console.log(`recap ${total}s`, starts);
