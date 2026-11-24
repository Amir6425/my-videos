// Profile picture for the page majaraStory: the talisman girl, the London detective and a butcher.
import fs from "node:fs";
import * as F from "../forest-cabin/build/chars.mjs";
import * as G from "../fortune-teller-2/build/chars.mjs";
import { man, STACHE } from "../london/build/kit.mjs";
const S = 1080;
const butcherC = { iris: "#2a1a10", skin: "#c98a68", skinSh: "#ab6e50", deep: "#7a4630", hair: "#1a1410", hairHi: "#2e241c", shirt: "#8a8f99", shirtSh: "#6e737c" };
const apron = `<path d="M -110,300 L 110,300 L 150,1300 L -150,1300 Z" fill="#ecebe6"/><path d="M -110,300 L -60,226 M 110,300 L 60,226" stroke="#ecebe6" stroke-width="18"/>
  <path d="M -110,300 L 110,300" stroke="#d6d4cc" stroke-width="8"/>
  <path d="M -60,380 C -40,370 -30,400 -50,420 C -70,440 -80,400 -60,380 Z M 40,460 c 20,-6 36,14 20,30 c -14,14 -40,4 -36,-12 Z M -20,520 c 10,-4 18,6 12,14 c -8,8 -20,0 -12,-14 Z" fill="#8e1a1e" opacity="0.85"/>
  <path d="M 50,380 L 54,440 M -80,470 L -76,520" stroke="#8e1a1e" stroke-width="6" stroke-linecap="round" opacity="0.7"/>`;
const scar = `<path d="M 50,-10 L 76,40" stroke="#8a4a3a" stroke-width="5" stroke-linecap="round"/><path d="M 56,4 L 66,0 M 62,18 L 72,14 M 68,32 L 78,28" stroke="#8a4a3a" stroke-width="3"/>`;
const cap = `<path d="M -110,-60 C -120,-200 120,-200 110,-60 C 80,-90 -80,-90 -110,-60 Z" fill="#1a1410" opacity="0.9"/>`;
const butcher = (p) => F.friend(p, butcherC, { kind: "fade", beard: true, mouth: "tense", headExtra: STACHE("#1a1410") + scar, torsoExtra: apron, arms: [[-16, 6], [16, -6]] })
  + `<g transform="translate(-170,330) rotate(-28)"><rect x="-14" y="-40" width="28" height="160" rx="10" fill="#4a2a1a"/><circle cx="0" cy="90" r="5" fill="#c0c4cc"/><circle cx="0" cy="40" r="5" fill="#c0c4cc"/>
     <path d="M -20,-40 L -20,-300 L 150,-300 C 168,-300 176,-290 176,-272 L 176,-40 Z" fill="#c7ccd4"/><path d="M 176,-300 L 176,-40" stroke="#eef0f4" stroke-width="10"/><circle cx="130" cy="-260" r="16" fill="#1a1a22"/>
     <path d="M 40,-200 l 14,30 M 90,-130 l 10,24" stroke="#8e1a1e" stroke-width="10" stroke-linecap="round" opacity="0.8"/></g>`;
const caps = (c) => [-1, 1].map((d) => `<path d="M ${d * 60},222 C ${d * 130},224 ${d * 186},244 ${d * 200},300 L ${d * 205},360 L ${d * 60},360 Z" fill="${c}"/>`).join("");
const girl = (p) => `<g transform="translate(0,-20)">${G.girlBody(p, { coat: true })}</g>${G.girlHead(p, { freckles: true })}`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}">
<defs>
  <radialGradient id="bg" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#5a1e24"/><stop offset="0.5" stop-color="#2a0e14"/><stop offset="1" stop-color="#0a0406"/></radialGradient>
  <radialGradient id="lamp" cx="540" cy="250" r="420" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffc874" stop-opacity="0.45"/><stop offset="1" stop-color="#ffc874" stop-opacity="0"/></radialGradient>
  <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9a0a0" stop-opacity="0"/><stop offset="1" stop-color="#c9a0a0" stop-opacity="0.25"/></linearGradient>
  <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05060f" stop-opacity="0"/><stop offset="1" stop-color="#05060f" stop-opacity="0.9"/></linearGradient>
  <radialGradient id="vig" cx="50%" cy="50%" r="62%"><stop offset="0.7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.75"/></radialGradient>
</defs>
<rect width="${S}" height="${S}" fill="url(#bg)"/>
<g opacity="0.55" fill="#12060a">
  <path d="M 0,600 L 0,250 L 60,250 L 60,180 L 120,180 L 120,260 L 220,260 L 220,600 Z"/><rect x="80" y="140" width="22" height="50"/>
  <path d="M 860,600 L 860,230 L 960,230 L 960,160 L 1010,160 L 1010,240 L 1080,240 L 1080,600 Z"/><rect x="975" y="120" width="22" height="50"/>
  ${[[30, 300], [150, 320], [890, 290], [1000, 300], [150, 420], [910, 420]].map(([x, y]) => `<rect x="${x}" y="${y}" width="40" height="56" fill="#e0a050" opacity="0.5"/>`).join("")}
</g>
<circle cx="540" cy="250" r="420" fill="url(#lamp)"/>
<g transform="translate(540,250)" opacity="0.8"><path d="M -40,-60 L 40,-60 L 30,40 L -30,40 Z" fill="#ffd890" opacity="0.6"/><path d="M -48,-60 L 48,-60 L 0,-100 Z M -30,40 L 30,40 L 22,56 L -22,56 Z" fill="#1a0a0c"/><rect x="-6" y="56" width="12" height="400" fill="#1a0a0c"/></g>
<rect y="520" width="${S}" height="340" fill="url(#fog)"/>
<g transform="translate(250,585) scale(0.76)">${man("dt", "det", { mouth: "tense" })}${caps("#5a4632")}</g>
<g transform="translate(825,585) scale(-0.9,0.84)">${butcher("bu")}${caps("#ecebe6")}</g>
<g transform="translate(540,575) scale(0.8)">${girl("gl")}</g>
<rect width="${S}" height="${S}" fill="#2a0a10" opacity="0.12"/>
<rect y="700" width="${S}" height="380" fill="url(#shade)"/>
<rect width="${S}" height="${S}" fill="url(#vig)"/>
<rect x="230" y="852" width="620" height="124" rx="22" fill="#000"/>
<text x="540" y="940" font-family="'Montserrat', sans-serif" font-weight="700" font-size="76" fill="#fff" text-anchor="middle">majaraStory</text>
</svg>`;
fs.writeFileSync("majara.html", `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=block" rel="stylesheet"><style>html,body{margin:0;background:#000}</style></head><body>${svg}</body></html>`);
