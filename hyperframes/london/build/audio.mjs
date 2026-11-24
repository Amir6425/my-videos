// Narration (the user's voice file), a low score and the street atmosphere, plus the word-by-word captions host.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const HERE = path.dirname(fileURLToPath(import.meta.url));
export default function audio(shots) {
  const total = Math.round(shots.reduce((a, s) => a + s.dur, 0) * 100) / 100;
  const cfg = JSON.parse(fs.readFileSync(path.join(HERE, "narration.json"), "utf8"));
  const caps = fs.existsSync(path.join(HERE, "words.json")) && cfg.text.trim();
  if (caps) writeCaptions(JSON.parse(fs.readFileSync(path.join(HERE, "words.json"), "utf8")).words, cfg.offset, total);
  return `      <audio id="narration" class="clip" src="${cfg.audio}" data-start="${cfg.offset}" data-track-index="4" data-volume="1"></audio>
      <audio id="bed" class="clip" src="assets/audio/bed.mp3" data-start="0" data-duration="${total}" data-track-index="3" data-volume="0.05"></audio>
${caps ? `      <div id="cap" data-composition-id="cap" data-composition-src="compositions/cap.html" data-start="0" data-duration="${total}" data-track-index="2" data-track-kind="captions" data-width="1080" data-height="1920"></div>` : ""}`;
}

// Word-by-word captions: pages of up to 4 words; the word being spoken turns red and grows a little.
function writeCaptions(words, offset, total) {
  // a new line at each pause of the narrator (> 0.4 s) or after 4 words
  const pages = [];
  words.forEach((w, i) => { if (!pages.length || pages[pages.length - 1].length >= 4 || w.start - words[i - 1].end > 0.4) pages.push([]); pages[pages.length - 1].push(w); });
  const html = pages.map((pg, pi) => `<div class="cap-page" id="cap-p${pi}">${pg.map((w, wi) => `<span class="cap-w" id="cap-w${pi}-${wi}">${w.w}</span>`).join(" ")}</div>`).join("");
  let js = "";
  pages.forEach((pg, pi) => {
    const a = pg[0].start + offset, b = pi < pages.length - 1 ? pages[pi + 1][0].start + offset : Math.min(total - 0.2, pg[pg.length - 1].end + offset + 0.6);
    js += `tl.fromTo("#cap-p${pi}", { opacity: 0, y: 14, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.16, ease: "power3.out" }, ${(a - 0.08).toFixed(3)});\n`;
    js += `tl.to("#cap-p${pi}", { opacity: 0, filter: "blur(6px)", duration: 0.12, ease: "power2.in" }, ${(b - 0.12).toFixed(3)});\n`;
    pg.forEach((w, wi) => {
      const s0 = w.start + offset, e0 = w.end + offset;
      js += `tl.fromTo("#cap-w${pi}-${wi}", { color: "#ffffff", scale: 1 }, { color: "#ffd873", scale: 1.1, duration: 0.07, ease: "power2.out" }, ${s0.toFixed(3)});\n`;
      js += `tl.to("#cap-w${pi}-${wi}", { color: "#ffffff", scale: 1, duration: 0.1, ease: "power2.in" }, ${Math.max(s0 + 0.08, e0).toFixed(3)});\n`;
    });
  });
  fs.writeFileSync(path.join(HERE, "..", "compositions", "cap.html"), `<template>
  <style>
    @font-face { font-family: "IRANSans"; src: url('assets/fonts/IRANSans-Black.ttf') format('truetype'); font-weight: 900; }
    #root { position: absolute; inset: 0; pointer-events: none; }
    .cap-page { position: absolute; left: 90px; right: 90px; top: 1430px; text-align: center; direction: rtl; opacity: 0;
      font-family: "IRANSans", sans-serif; font-weight: 900; font-size: 60px; line-height: 1.5; color: #fff;
      text-shadow: 0 4px 14px rgba(0,0,0,0.85), 0 0 3px rgba(0,0,0,0.9); }
    .cap-w { display: inline-block; margin: 0 8px; }
  </style>
  <div id="root" data-composition-id="cap" data-width="1080" data-height="1920">${html}</div>
  <script>
    (function () { const tl = gsap.timeline({ paused: true });
    ${js}
    tl.to({}, { duration: ${total} }, 0);
    window.__timelines["cap"] = tl; })();
  </script>
</template>
`);
}
