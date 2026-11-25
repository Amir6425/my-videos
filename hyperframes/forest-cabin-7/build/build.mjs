// Generates index.html, compositions/*.html (shots + captions) and build/timing.json. Run: node build/build.mjs [shotPrefix]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import shots from "./scenes.mjs";
const HERE = path.dirname(fileURLToPath(import.meta.url)), root = path.join(HERE, "..");
const only = process.argv[2];
const FA = `@font-face { font-family: "IRANSans"; src: url('assets/fonts/IRANSans-Black.ttf') format('truetype'); font-weight: 900; }`;
for (const f of fs.readdirSync(path.join(root, "compositions"))) if (f.endsWith(".html")) fs.unlinkSync(path.join(root, "compositions", f));
const starts = {}; let t = 0; const hosts = [];
for (const s of shots) { if (only && !s.id.startsWith(only)) continue; starts[s.id] = Math.round(t * 100) / 100;
  fs.writeFileSync(path.join(root, "compositions", `${s.id}.html`), s.html);
  hosts.push(`      <div id="${s.id}" data-composition-id="${s.id}" data-composition-src="compositions/${s.id}.html" data-start="${starts[s.id].toFixed(2)}" data-duration="${s.dur}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>`);
  t += s.dur; }
const total = Math.round(t * 100) / 100;
let audio = "";
if (!only) {
  fs.writeFileSync(path.join(HERE, "timing.json"), JSON.stringify({ total, starts }, null, 1));
  const N = JSON.parse(fs.readFileSync(path.join(HERE, "narration.json"), "utf8")).scenes, W = JSON.parse(fs.readFileSync(path.join(HERE, "words.json"), "utf8"));
  const words = N.flatMap((c) => W[c.shot].words.map((w) => ({ ...w, shot: c.shot, start: w.start + starts[c.shot] + c.offset, end: w.end + starts[c.shot] + c.offset })));
  audio = N.map((c, i) => `      <audio id="nar-${i + 1}" class="clip" src="${c.audio}" data-start="${(starts[c.shot] + c.offset).toFixed(2)}" data-duration="${W[c.shot].duration}" data-track-index="4" data-volume="1"></audio>`).join("\n")
    + (fs.existsSync(path.join(root, "assets/audio/fx.mp3")) ? `\n      <audio id="fx" class="clip" src="assets/audio/fx.mp3" data-start="0" data-duration="${total}" data-track-index="3" data-volume="0.09"></audio>` : "")
    + `\n      <div id="cap" data-composition-id="cap" data-composition-src="compositions/cap.html" data-start="0" data-duration="${total}" data-track-index="2" data-track-kind="captions" data-width="1080" data-height="1920"></div>`;
  const pages = [];
  words.forEach((w, i) => { if (!pages.length || pages[pages.length - 1].length >= 4 || w.start - words[i - 1].end > 0.4 || w.shot !== words[i - 1].shot) pages.push([]); pages[pages.length - 1].push(w); });
  let js = "";
  pages.forEach((pg, pi) => {
    const a = pg[0].start, b = pi < pages.length - 1 ? Math.min(pages[pi + 1][0].start, pg[pg.length - 1].end + 1.2) : Math.min(total - 0.2, pg[pg.length - 1].end + 0.8);
    js += `tl.fromTo("#cap-p${pi}", { opacity: 0, y: 14, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.16, ease: "power3.out" }, ${(a - 0.04).toFixed(3)});\n`;
    js += `tl.to("#cap-p${pi}", { opacity: 0, filter: "blur(6px)", duration: 0.1, ease: "power2.in" }, ${(b - 0.16).toFixed(3)});\n`;
    pg.forEach((w, wi) => { js += `tl.fromTo("#cap-w${pi}-${wi}", { color: "#ffffff", scale: 1 }, { color: "#ffd873", scale: 1.1, duration: 0.07, ease: "power2.out" }, ${w.start.toFixed(3)});\n`;
      js += `tl.to("#cap-w${pi}-${wi}", { color: "#ffffff", scale: 1, duration: 0.1, ease: "power2.in" }, ${Math.max(w.start + 0.08, w.end).toFixed(3)});\n`; });
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
}
fs.writeFileSync(path.join(root, "index.html"), `<!doctype html>
<html lang="fa" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>Forest Cabin 7</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: #000; }
      #root { position: relative; width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <!-- Generated by build/build.mjs: edit build/scenes.mjs, then run: node build/build.mjs -->
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="1080" data-height="1920">
${hosts.join("\n")}
${audio}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`);
console.log(`${hosts.length} shots, ${total}s`, starts);
