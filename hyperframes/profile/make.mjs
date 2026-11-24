// Profile picture for the page Rarze_Dastan: the three friends (red, blue, white) under a moonlit forest.
import fs from "node:fs";
import { friend, CAST } from "../forest-cabin/build/chars.mjs";
const S = 1080;
const bust = (p, who, x, y, s, flip = false) => { const { c, kind, beard } = CAST[who];
  return `<g transform="translate(${x},${y}) scale(${flip ? -s : s},${s})">${friend(p, c, { kind, beard, grin: true, arms: [[-16, 6], [16, -6]] })}${[-1, 1].map((d) => `<path d="M ${d * 60},222 C ${d * 130},224 ${d * 186},244 ${d * 200},300 L ${d * 205},360 L ${d * 60},360 Z" fill="${c.shirt}"/>`).join("")}</g>`; };
const trees = (y, h, col, n, off) => [...Array(n)].map((_, i) => { const x = i * (S / (n - 1)) + off; const hh = h * (0.75 + ((i * 37) % 10) / 25);
  return `<path d="M ${x},${y - hh} L ${x - hh * 0.28},${y} L ${x + hh * 0.28},${y} Z" fill="${col}"/>`; }).join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}">
<defs>
  <radialGradient id="sky" cx="50%" cy="32%" r="75%"><stop offset="0" stop-color="#3a3f7a"/><stop offset="0.55" stop-color="#1b1d3e"/><stop offset="1" stop-color="#0a0b1a"/></radialGradient>
  <radialGradient id="moonGlow" cx="540" cy="300" r="380" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffe9b0" stop-opacity="0.55"/><stop offset="1" stop-color="#ffe9b0" stop-opacity="0"/></radialGradient>
  <radialGradient id="vig" cx="50%" cy="50%" r="62%"><stop offset="0.7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.75"/></radialGradient>
  <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a90c8" stop-opacity="0"/><stop offset="1" stop-color="#8a90c8" stop-opacity="0.35"/></linearGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe7a3"/><stop offset="1" stop-color="#d9a441"/></linearGradient>
  <clipPath id="circ"><circle cx="540" cy="540" r="540"/></clipPath>
</defs>
<rect width="${S}" height="${S}" fill="url(#sky)"/>
${[...Array(40)].map((_, i) => `<circle cx="${(i * 263) % S}" cy="${(i * 151) % 520}" r="${1.5 + (i % 3)}" fill="#fff" opacity="${0.3 + (i % 4) * 0.15}"/>`).join("")}
<circle cx="540" cy="300" r="380" fill="url(#moonGlow)"/>
<circle cx="540" cy="300" r="150" fill="#f6e7bf"/><circle cx="590" cy="260" r="26" fill="#e4d2a2" opacity="0.6"/><circle cx="490" cy="350" r="18" fill="#e4d2a2" opacity="0.6"/><circle cx="600" cy="360" r="12" fill="#e4d2a2" opacity="0.6"/>
${trees(720, 420, "#141634", 9, -20)}
${trees(780, 300, "#0e1028", 11, 30)}
<rect y="560" width="${S}" height="300" fill="url(#fog)"/>
${bust("b", "b", 250, 610, 0.78)}
${bust("w", "w", 830, 610, 0.78, true)}
${bust("r", "r", 540, 560, 0.9)}
<rect y="0" width="${S}" height="${S}" fill="#1a1440" opacity="0.18"/>
<rect width="${S}" height="${S}" fill="url(#vig)"/>
<g transform="translate(540,935)">
  <path d="M -380,-62 L 380,-62 L 350,0 L 380,62 L -380,62 L -350,0 Z" fill="#120c22" opacity="0.92"/>
  <path d="M -366,-50 L 366,-50 L 338,0 L 366,50 L -366,50 L -338,0 Z" fill="none" stroke="url(#gold)" stroke-width="4"/>
  <text x="0" y="22" font-family="Cinzel, 'Playfair Display', Georgia, serif" font-weight="700" font-size="64" letter-spacing="3" fill="url(#gold)" text-anchor="middle">Rarze_Dastan</text>
</g>
</svg>`;
fs.writeFileSync("profile.svg", svg);
fs.writeFileSync("profile.html", `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=block" rel="stylesheet"><style>html,body{margin:0;background:#000}</style></head><body>${svg}</body></html>`);
