// Plans 3–19 of the London case, each shot as long as its part of the narration (build/words_long.json).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scene } from "./lib.mjs";
import { place, glow, man, manBack, portrait, BW_DEFS, paper, FONTS, T, caseFile, deskTop, bathroom, tub, policeRoom, cobbleStreet, LAMP_DEFS, HAT } from "./kit.mjs";
import { womanHead, PAL as WP } from "../../fortune-teller/build/chars.mjs";
const HERE = path.dirname(fileURLToPath(import.meta.url));

// ── shot lengths from the alignment ──────────────────────────────────────────────────────────────────
const WL = JSON.parse(fs.readFileSync(path.join(HERE, "words_long.json"), "utf8"));
const cuts = WL.shots.map((s, i) => i === 0 ? 0 : (WL.shots[i - 1].words.at(-1).end + s.words[0].start) / 2);
export const DUR = Object.fromEntries(WL.shots.map((s, i) => {
  const a = i === 0 ? -WL.lead : cuts[i], b = i < WL.shots.length - 1 ? cuts[i + 1] : WL.duration + WL.tail;
  return [s.shot, Math.round((b - a) * 100) / 100];
}));

const cool = (op = 0.35) => `<rect width="1080" height="1920" fill="#0a1430" opacity="${op}" style="mix-blend-mode:multiply"/>`;
const dark = (op) => `<rect width="1080" height="1920" fill="#000" opacity="${op}"/>`;
const SKIN = WP.wSkinSh;
// a woman's limp hand hanging over a tub rim, pointing down from the wrist at (0,0)
const limpHand = (ring = false) => `<path d="M -26,-40 C -30,-10 -30,30 -22,60 C -16,84 16,84 22,60 C 28,30 28,-10 24,-40 Z" fill="${SKIN}"/>
  ${[-18, -6, 6, 18].map((x, i) => `<path d="M ${x},64 L ${x + (i - 1.5) * 2},${100 + (i === 0 || i === 3 ? -8 : 0)}" stroke="${SKIN}" stroke-width="12" stroke-linecap="round"/>`).join("")}
  ${ring ? `<ellipse id="RING" cx="-6" cy="82" rx="9" ry="4" fill="none" stroke="#d8b04a" stroke-width="5"/><circle cx="-4" cy="79" r="2.5" fill="#fff6c8"/>` : ""}`;
const hairOnWater = (x, y, s = 1) => [...Array(9)].map((_, i) => `<path d="M ${x + i * 6 * s},${y} C ${x - 30 * s + i * 4 * s},${y + (8 + (i % 3) * 4) * s} ${x - 70 * s - i * 6 * s},${y - 4 * s + (i % 2) * 8 * s} ${x - 110 * s - i * 10 * s},${y + (4 + (i % 3) * 5) * s}" stroke="${i % 2 ? "#2a1a14" : "#3a261c"}" stroke-width="${7 * s}" fill="none" stroke-linecap="round"/>`).join("");
const flick = (sel, dur) => `flicker("${sel}", ${dur}, 0.9, 0.1);`;

// ── 3. a second death: close on a limp hand; police and a doctor behind ──────────────────────────────
function l3(dur) {
  const id = "l3";
  return { id, dur, html: scene({ id, dur, fadeIn: true, bg: "#05070d", vignette: 0.9,
    layers: [
      { name: "bg", blur: 9, svg: `${bathroom({ wall: "#24323a", tile: "#a9b4b8" })}${tub(560, 1180, { water: "#4a5a6a" })}
        ${place(250, 820, 0.62, man(`${id}-bo`, "bobby"))}${place(820, 860, 0.62, man(`${id}-dr`, "doctor", { arms: [[20, -100], [-30, 110]] }))}${cool(0.45)}` },
      { name: "fore", svg: `<path d="M -40,1220 C 300,1180 800,1180 1120,1220 L 1120,1960 L -40,1960 Z" fill="#ecebe6"/>
        <path d="M -40,1220 C 300,1180 800,1180 1120,1220 L 1120,1270 C 800,1232 300,1232 -40,1270 Z" fill="#f8f6f0"/>
        <path d="M -40,1270 C 300,1232 800,1232 1120,1270 L 1120,1300 C 800,1262 300,1262 -40,1300 Z" fill="#5a6a7a" opacity="0.7"/>
        <g transform="translate(540,1250) scale(3.2)">${limpHand()}</g>
        <rect width="1080" height="1920" fill="url(#${id}-cold)"/>${cool(0.4)}` },
    ].map((l, i) => i === 1 ? { ...l, defs: `<linearGradient id="${id}-cold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a9ad8" stop-opacity="0.25"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/></linearGradient>` } : l),
    js: `
    cam("bg", { scale: 1.05, x: 0 }, { scale: 1.1, x: -30 }, 0, ${dur});
    cam("fore", { scale: 1.0, origin: "540px 1400px" }, { scale: 1.08, origin: "540px 1400px" }, 0, ${dur});
    tl.fromTo("#${id}-dr-head", { y: 0 }, { y: 10, duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: 3 }, 0.5);
    look("${id}-dr", 0, 8, 0, 0.01); look("${id}-bo", 6, 4, 0, 0.01);
    tl.fromTo("#${id}-bo-head", { rotation: 0 }, { rotation: 4, transformOrigin: "50% 90%", duration: 2.5, ease: "sine.inOut" }, 2.5);
    ` }) };
}

// ── 4. a rented room: close on a wedding ring; pull back to the tub; darker ─────────────────────────
function l4(dur) {
  const id = "l4";
  return { id, dur, html: scene({ id, dur, bg: "#05070d", vignette: 0.9,
    layers: [{ name: "room", defs: glow(`${id}-lamp`, 860, 760, 600, "#ffb24a", 0.45), svg: `
      <rect width="1080" height="1920" fill="#5a5042"/>${[...Array(9)].map((_, i) => `<ellipse cx="${(i * 233) % 1080}" cy="${300 + (i * 151) % 700}" rx="${60 + (i % 3) * 30}" ry="${40 + (i % 2) * 20}" fill="#4a4034" opacity="0.6"/>`).join("")}
      <rect y="1250" width="1080" height="670" fill="#3a2a1c"/>${[...Array(8)].map((_, i) => `<rect x="${i * 140}" y="1250" width="4" height="670" fill="#2a1e12"/>`).join("")}
      <g transform="translate(160,1080)"><rect x="-120" y="-260" width="12" height="300" fill="#1e1e22"/><rect x="108" y="-260" width="12" height="300" fill="#1e1e22"/>
        <rect x="-120" y="-90" width="240" height="70" fill="#d8d0bc"/><rect x="-120" y="-40" width="240" height="30" fill="#8a7a62"/></g>
      <g transform="translate(860,1150)"><rect x="-70" y="0" width="140" height="10" fill="#4a3018"/><rect x="-60" y="10" width="10" height="100" fill="#4a3018"/><rect x="50" y="10" width="10" height="100" fill="#4a3018"/>
        <path d="M -16,-70 L 16,-70 L 22,0 L -22,0 Z" fill="#9a8a5a"/><ellipse cx="0" cy="-90" rx="18" ry="26" fill="#ffd27a" opacity="0.9"/></g>
      <rect id="${id}-lampL" width="1080" height="1920" fill="url(#${id}-lamp)" style="mix-blend-mode:screen"/>
      ${tub(520, 1260, { water: "#4a5664" })}${hairOnWater(760, 1266, 1.1)}
      <g transform="translate(330,1250)">${limpHand(true)}</g>
      ${cool(0.35)}<rect id="${id}-dim" width="1080" height="1920" fill="#000" opacity="0"/>` }],
    js: `
    cam("room", { scale: 7.5, x: 0, y: 0, origin: "324px 1332px" }, { scale: 7.5, origin: "324px 1332px" }, 0, 1.4);
    cam("room", { scale: 7.5, origin: "324px 1332px" }, { scale: 1.16, x: 150, y: -300, origin: "324px 1332px" }, 1.4, ${(dur - 1.6).toFixed(2)}, "power2.inOut");
    ${flick(`#${id}-lampL`, dur)}
    tl.fromTo("#RING", { opacity: 0.7 }, { opacity: 1, duration: 0.6, yoyo: true, repeat: 1 }, 0.2);
    tl.fromTo("#${id}-dim", { opacity: 0 }, { opacity: 0.35, duration: ${(dur * 0.6).toFixed(2)}, ease: "power1.in" }, ${(dur * 0.4).toFixed(2)});
    ` }).replace(/id="RING"/, `id="${id}-ring"`).replace(/#RING/g, `#${id}-ring`) };
}

// ── 5. three case files on a desk; from above; a thin red line between the photos ───────────────────
function l5(dur) {
  const id = "l5";
  const files = [["Bessie Mundy", 0, 90, 220, -6], ["Alice Burnham", 1, 330, 700, 4], ["Margaret Lofty", 2, 570, 1180, -3]];
  const photo = (x, y, r) => { const c = Math.cos(r * Math.PI / 180), s = Math.sin(r * Math.PI / 180), px = 220, py = 580 * 0.43; return [x + px * c - py * s, y + px * s + py * c]; };
  const P = files.map(([, , x, y, r]) => photo(x, y, r));
  return { id, dur, html: scene({ id, dur, bg: "#000", vignette: 0.85, extraStyle: FONTS,
    layers: [{ name: "desk", defs: BW_DEFS + glow(`${id}-lamp`, 540, 900, 1000, "#ffcf8a", 0.35), svg: `${deskTop()}
      <rect width="1080" height="1920" fill="url(#${id}-lamp)" style="mix-blend-mode:screen"/>
      ${files.map(([n, v, x, y, r], i) => `<g transform="translate(${x},${y}) rotate(${r})"><g id="${id}-f${i}" opacity="0">${caseFile(n, "مرگ در وان حمام", v)}</g></g>`).join("")}
      <polyline id="${id}-red" points="${P.map(([x, y]) => `${x.toFixed(0)},${y.toFixed(0)}`).join(" ")}" fill="none" stroke="#d01e1e" stroke-width="4" stroke-dasharray="1400" stroke-dashoffset="1400"/>
      ${P.map(([x, y], i) => `<circle id="${id}-pin${i}" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="9" fill="#d01e1e" opacity="0"/>`).join("")}
      <rect id="${id}-black" width="1080" height="1920" fill="#000"/>` }],
    js: `
    tl.fromTo("#${id}-black", { opacity: 1 }, { opacity: 0, duration: 0.5 }, 0.3);
    ${files.map((f, i) => `tl.fromTo("#${id}-f${i}", { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, ${(0.6 + i * 0.9).toFixed(2)});`).join(" ")}
    cam("desk", { scale: 1.25, y: 120 }, { scale: 1.0, y: 0 }, 0.4, ${(dur - 1.2).toFixed(2)}, "power1.inOut");
    tl.to("#${id}-red", { attr: { "stroke-dashoffset": 0 }, duration: 1.0, ease: "power1.inOut" }, ${(dur - 1.4).toFixed(2)});
    ${P.map((_, i) => `tl.to("#${id}-pin${i}", { opacity: 1, duration: 0.1 }, ${(dur - 1.45 + i * 0.45).toFixed(2)});`).join(" ")}
    ` }) };
}

// ── 6. the father reads the newspaper; the headline; his daughter's photo on the table ─────────────
function l6(dur) {
  const id = "l6", f = `${id}-fa`;
  const news = `<g><rect x="-330" y="-430" width="660" height="860" fill="#e2dcc8"/><rect x="-330" y="-430" width="660" height="860" fill="#7a6a4a" opacity="0.1"/>
    ${T(0, -360, "THE DAILY CHRONICLE", { size: 52, font: "Playfair Display", fill: "#1a1612", weight: 900 })}<line x1="-300" y1="-330" x2="300" y2="-330" stroke="#1a1612" stroke-width="4"/>
    ${T(0, -250, "زنی در وان خانه‌اش غرق شد", { size: 50, font: "IRANSans", fill: "#141210", weight: 900, rtl: true })}
    <g transform="translate(-150,-50)">${portrait(200, 240, 2)}</g>
    ${[...Array(12)].map((_, i) => `<rect x="${i < 6 ? -20 : -300}" y="${-160 + (i % 6) * 34 + (i < 6 ? 0 : 230)}" width="${i < 6 ? 300 : 600}" height="10" fill="#4a4034" opacity="0.5"/>`).join("")}
    ${[...Array(6)].map((_, i) => `<rect x="-300" y="${230 + i * 30}" width="600" height="10" fill="#4a4034" opacity="0.45"/>`).join("")}</g>`;
  return { id, dur, html: scene({ id, dur, bg: "#100808", vignette: 0.88, extraStyle: FONTS,
    layers: [{ name: "room", defs: BW_DEFS + glow(`${id}-lamp`, 900, 700, 900, "#ffb24a", 0.5), svg: `
      <rect width="1080" height="1920" fill="#4a1e1e"/>${[...Array(10)].map((_, r) => [...Array(7)].map((_, c) => `<circle cx="${c * 160 + (r % 2) * 80}" cy="${r * 130 + 60}" r="18" fill="#5a2828"/>`).join("")).join("")}
      <rect y="1300" width="1080" height="620" fill="#2a1a12"/>
      <path d="M 140,900 C 140,760 280,720 540,720 C 800,720 940,760 940,900 L 980,1500 L 100,1500 Z" fill="#3a2a1e"/>
      ${place(540, 920, 0.92, man(f, "father", { arms: [[40, -120], [-40, 120]] }))}
      <g id="${id}-paper" transform="translate(540,1380) scale(0.55)">${news}</g>
      <g transform="translate(900,1260)"><rect x="-120" y="0" width="240" height="14" fill="#3a2414"/><rect x="-14" y="14" width="28" height="300" fill="#3a2414"/>
        <g transform="translate(0,-110)"><rect x="-80" y="-100" width="160" height="200" fill="#8a6a30"/><g transform="translate(0,0)">${portrait(130, 170, 2)}</g></g>
        <path d="M -30,-260 L 30,-260 L 46,-200 L -46,-200 Z" fill="#e8d0a0" opacity="0.9"/></g>
      <rect id="${id}-lampL" width="1080" height="1920" fill="url(#${id}-lamp)" style="mix-blend-mode:screen"/>${cool(0.25)}` }],
    js: `
    ${flick(`#${id}-lampL`, dur)}
    look("${f}", 0, 9, 0, 0.01); eyesOpen("${f}", 0.85, 0, 0.01);
    eyesOpen("${f}", 1.25, ${(dur * 0.22).toFixed(2)}, 0.3); brows("${f}", -14, -6, ${(dur * 0.22).toFixed(2)}, 0.3);
    tl.fromTo("#${id}-paper", { attr: { transform: "translate(540,1380) scale(0.55)" } }, { attr: { transform: "translate(540,1240) scale(0.75)" }, duration: 0.8, ease: "power2.out" }, ${(dur * 0.3).toFixed(2)});
    (function () { const el = document.getElementById("${id}-paper"); const o = { t: 0 };
      tl.fromTo(o, { t: 0 }, { t: ${dur}, duration: ${(dur * 0.7).toFixed(2)}, ease: "none", onUpdate() {
        const base = el.getAttribute("transform").replace(/ rotate\\([^)]*\\)/, "");
        el.setAttribute("transform", base + " rotate(" + (1.4 * Math.sin(o.t * 37) + 0.8 * Math.sin(o.t * 61)).toFixed(2) + ")"); } }, ${(dur * 0.3).toFixed(2)}); })();
    cam("room", { scale: 1.0, x: 0, y: 0 }, { scale: 1.0 }, 0, ${(dur * 0.35).toFixed(2)});
    cam("room", { scale: 1.0, x: 0, y: 0, origin: "540px 1240px" }, { scale: 1.9, x: 0, y: -260, origin: "540px 1240px" }, ${(dur * 0.38).toFixed(2)}, ${(dur * 0.25).toFixed(2)}, "power2.inOut");
    cam("room", { scale: 1.9, x: 0, y: -260, origin: "540px 1240px" }, { scale: 1.9, x: -560, y: 30, origin: "540px 1240px" }, ${(dur * 0.7).toFixed(2)}, ${(dur * 0.22).toFixed(2)}, "power2.inOut");
    look("${f}", 9, 4, ${(dur * 0.7).toFixed(2)}, 0.4);
    ` }) };
}

// ── 7. the evidence wall, red string; then three marriage certificates with different grooms ────────
const certificate = (groom, bride, v) => `<g>${paper(420, 300, { lines: 0, color: "#efe6cf" })}
  <rect x="14" y="14" width="392" height="272" fill="none" stroke="#8a6a3a" stroke-width="3"/>
  ${T(210, 62, "Certificate of Marriage", { size: 30, font: "Playfair Display", fill: "#3a2a18" })}
  ${T(60, 130, "Groom:", { size: 24, anchor: "start" })}${T(160, 132, groom, { size: 34, anchor: "start", fill: "#1a1410", font: "Playfair Display" })}
  <line x1="160" y1="140" x2="380" y2="140" stroke="#5a4a34" stroke-width="1.5"/>
  ${T(60, 190, "Bride:", { size: 24, anchor: "start" })}${T(160, 192, bride, { size: 28, anchor: "start", fill: "#1a1410" })}
  <line x1="160" y1="200" x2="380" y2="200" stroke="#5a4a34" stroke-width="1.5"/>
  ${T(60, 250, `19${10 + v}`, { size: 22, anchor: "start" })}<circle cx="350" cy="245" r="26" fill="none" stroke="#9a1a14" stroke-width="3"/></g>`;
function l7(dur) {
  const id = "l7", d = `${id}-det`, half = (dur * 0.5).toFixed(2);
  const pins = [[260, 520], [540, 420], [820, 560]];
  return { id, dur, html: scene({ id, dur, bg: "#05070d", vignette: 0.88, extraStyle: FONTS,
    layers: [
      { name: "wall", defs: BW_DEFS + glow(`${id}-lamp`, 540, 300, 900, "#ffcf8a", 0.35), svg: `${policeRoom()}
        ${pins.map(([x, y], i) => `<g transform="translate(${x},${y}) rotate(${[-4, 3, -2][i]})"><rect x="-110" y="-140" width="220" height="290" fill="#efe6cf"/><g transform="translate(0,-20)">${portrait(150, 180, i)}</g>
          ${T(0, 120, ["B. Mundy", "A. Burnham", "M. Lofty"][i], { size: 28 })}<circle cx="0" cy="-130" r="10" fill="#d01e1e"/></g>`).join("")}
        <polyline id="${id}-str" points="${pins.map(([x, y]) => `${x},${y - 130}`).join(" ")}" fill="none" stroke="#c81818" stroke-width="5" stroke-dasharray="700" stroke-dashoffset="700"/>
        <rect width="1080" height="1920" fill="url(#${id}-lamp)" style="mix-blend-mode:screen"/>
        ${place(700, 1350, 1.2, manBack(d, "det"))}${cool(0.3)}` },
      { name: "desk", svg: `<g id="${id}-certs" opacity="0">${deskTop("#3e2614")}
        ${[["Smite", "B. Mundy", 0, 120, 260, -5], ["Pep", "A. Burnham", 1, 560, 760, 4], ["Leo", "M. Lofty", 2, 160, 1260, -3]].map(([g, b, v, x, y, r]) => `<g transform="translate(${x},${y}) rotate(${r}) scale(1.6)">${certificate(g, b, v)}</g>`).join("")}${cool(0.25)}</g>` },
    ],
    js: `
    cam("wall", { scale: 1.0 }, { scale: 1.06 }, 0, ${half});
    tl.fromTo("#${S(id, "wall")}", { opacity: 1 }, { opacity: 1, duration: 0.01 }, 0);
    tl.fromTo("#${d}-wrap", { x: 0 }, { x: 0, duration: 0.01 }, 0);
    tl.to("#${id}-str", { attr: { "stroke-dashoffset": 0 }, duration: ${(dur * 0.35).toFixed(2)}, ease: "power1.inOut" }, 0.6);
    tl.set("#${id}-certs", { opacity: 1 }, ${half}); tl.set("#${S(id, "wall")}", { opacity: 0 }, ${half});
    cam("desk", { scale: 1.0, x: 0, y: 0, origin: "500px 470px" }, { scale: 2.0, x: 288, y: 428, origin: "500px 470px" }, ${half}, ${(dur * 0.17).toFixed(2)}, "power2.inOut");
    cam("desk", { scale: 2.0, x: 288, y: 428, origin: "500px 470px" }, { scale: 2.0, x: -592, y: -572, origin: "500px 470px" }, ${(dur * 0.68).toFixed(2)}, ${(dur * 0.14).toFixed(2)}, "power2.inOut");
    cam("desk", { scale: 2.0, x: -592, y: -572, origin: "500px 470px" }, { scale: 2.0, x: 208, y: -1572, origin: "500px 470px" }, ${(dur * 0.84).toFixed(2)}, ${(dur * 0.14).toFixed(2)}, "power2.inOut");
    `.replace(/tl\.fromTo\("#[^"]*-wrap".*\n/, "") }) };
}
const S = (id, l) => `${id}-${l}`;

// ── 8. a man in a hat and long coat, from behind, in the fog; into a dark alley; cut ───────────────
function l8(dur) {
  const id = "l8", m = `${id}-m`;
  const coatMan = `<g id="${m}"><path d="M -110,-760 C -150,-740 -160,-700 -160,-640 L -190,-60 L 190,-60 L 160,-640 C 160,-700 150,-740 110,-760 Z" fill="#141416"/>
    <path d="M -10,-760 L 10,-760 L 4,-60 L -4,-60 Z" fill="#0a0a0c"/>
    <g id="${m}-legL"><rect x="-80" y="-80" width="56" height="80" fill="#0c0c0e"/></g><g id="${m}-legR"><rect x="24" y="-80" width="56" height="80" fill="#0c0c0e"/></g>
    <path d="M -54,-760 L -50,-840 C -50,-900 50,-900 50,-840 L 54,-760 Z" fill="#1c1a18"/>
    <g transform="translate(0,-880) scale(0.62)">${HAT.trilby}</g></g>`;
  return { id, dur, html: scene({ id, dur, bg: "#05070d", vignette: 0.9,
    layers: [
      { name: "street", defs: LAMP_DEFS, svg: `${cobbleStreet({ fogOp: 0.22 })}
        <rect x="430" y="700" width="220" height="620" fill="#030304"/><path d="M 430,700 L 650,700 L 640,720 L 440,720 Z" fill="#1a1414"/>` },
      { name: "man", svg: `<g id="${m}-pos" transform="translate(540,1800) scale(1.3)">${coatMan}</g>` },
      { name: "fog", blur: 14, svg: [...Array(6)].map((_, i) => `<ellipse id="${id}-fg${i}" cx="${(i * 230) % 1200}" cy="${1000 + (i % 3) * 260}" rx="520" ry="110" fill="#9aa6b8" opacity="0.22"/>`).join("") },
    ],
    js: `
    cam("street", { scale: 1.0 }, { scale: 1.18, origin: "540px 1000px" }, 0, ${dur});
    tl.fromTo("#${m}-pos", { attr: { transform: "translate(540,1800) scale(1.3)" } }, { attr: { transform: "translate(540,1330) scale(0.5)" }, duration: ${(dur - 1.0).toFixed(2)}, ease: "power1.inOut" }, 0);
    ${[...Array(Math.floor((dur - 1) / 0.55))].map((_, k) => `tl.to("#${m}-legL", { y: ${k % 2 ? 0 : -16}, duration: 0.27 }, ${(k * 0.55).toFixed(2)}); tl.to("#${m}-legR", { y: ${k % 2 ? -16 : 0}, duration: 0.27 }, ${(k * 0.55).toFixed(2)}); tl.to("#${m}", { y: ${k % 2 ? 0 : -8}, duration: 0.27 }, ${(k * 0.55).toFixed(2)});`).join(" ")}
    tl.to("#${m}", { opacity: 0, duration: 0.8, ease: "power1.in" }, ${(dur - 2.0).toFixed(2)});
    ${[...Array(6)].map((_, i) => `tl.fromTo("#${id}-fg${i}", { x: 0 }, { x: ${i % 2 ? 120 : -120}, duration: ${dur}, ease: "none" }, 0);`).join(" ")}
    fadeOut(S, ${(dur - 0.35).toFixed(2)}, 0.12);
    ` }) };
}

// ── 9. the detective's hands sort bank papers, insurance, marriage records; figures and signatures ─
const bankDoc = (title, rows, sign) => `<g>${paper(460, 620, { lines: 0, color: "#ede4cc" })}
  ${T(230, 70, title, { size: 34, font: "Playfair Display", fill: "#2a1e14" })}<line x1="40" y1="92" x2="420" y2="92" stroke="#5a4a34" stroke-width="2"/>
  ${rows.map(([k, v], i) => `${T(50, 160 + i * 70, k, { size: 26, anchor: "start" })}${T(410, 160 + i * 70, v, { size: 30, anchor: "end", fill: "#1a1410" })}<line x1="50" y1="${172 + i * 70}" x2="410" y2="${172 + i * 70}" stroke="#a89878" stroke-width="1"/>`).join("")}
  ${sign ? `<path d="M 260,560 C 280,520 300,580 320,540 C 340,500 350,580 380,550 C 395,535 405,545 420,540" stroke="#1a2a5a" stroke-width="3" fill="none"/>${T(330, 590, "signature", { size: 18, fill: "#6a5a44" })}` : ""}</g>`;
const DOCS = [["Bank of England", [["Deposit", "£2,500"], ["Interest", "£125"], ["Balance", "£2,625"]], true],
  ["Life Assurance", [["Policy", "No. 4417"], ["Sum assured", "£500"], ["Beneficiary", "Husband"]], true],
  ["Marriage Register", [["Groom", "J. Lloyd"], ["Bride", "M. Lofty"], ["Date", "17 Dec 1914"]], true]];
function l9(dur) {
  const id = "l9";
  const hand = (x, y, r, side) => `<g transform="translate(${x},${y}) rotate(${r})"><g id="${id}-h${side}"><rect x="-60" y="0" width="120" height="420" fill="#45351f"/><rect x="-62" y="0" width="124" height="26" fill="#e6e2da"/>
    <path d="M -46,-10 C -54,-70 -50,-120 -40,-140 L -44,-210 C -45,-226 -26,-228 -24,-212 L -18,-150 L -14,-226 C -14,-244 6,-244 6,-226 L 8,-150 L 18,-220 C 19,-236 38,-235 38,-218 L 30,-146 L 44,-196 C 47,-212 64,-208 61,-192 L 48,-120 C 62,-104 80,-108 92,-132 C 100,-148 118,-140 110,-122 C 96,-86 72,-54 50,-32 L 50,10 L -46,10 Z" fill="#c8946e"/></g></g>`;
  return { id, dur, html: scene({ id, dur, bg: "#100a06", vignette: 0.88, extraStyle: FONTS,
    layers: [{ name: "desk", defs: glow(`${id}-lamp`, 300, 300, 1300, "#ffcf8a", 0.4), svg: `${deskTop()}
      <rect width="1080" height="1920" fill="url(#${id}-lamp)" style="mix-blend-mode:screen"/>
      ${DOCS.map(([t, r, s], i) => `<g id="${id}-d${i}" transform="translate(${80 + i * 300},${300 + i * 420}) rotate(${[-6, 3, -2][i]})">${bankDoc(t, r, s)}</g>`).join("")}
      ${hand(300, 1500, -20, "L")}${hand(820, 1560, 18, "R")}${cool(0.25)}` }],
    js: `
    ${DOCS.map((_, i) => `tl.fromTo("#${id}-d${i}", { x: ${i % 2 ? 300 : -300}, opacity: 0.0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, ${(i * 0.5).toFixed(2)});`).join(" ")}
    tl.fromTo("#${id}-hL", { y: 0 }, { y: -60, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: 3 }, 0);
    tl.fromTo("#${id}-hR", { y: 0 }, { y: -50, duration: 0.7, ease: "sine.inOut", yoyo: true, repeat: 3 }, 0.3);
    cam("desk", { scale: 1.9, x: 360, y: 500, origin: "540px 960px" }, { scale: 1.9, x: 360, y: 500, origin: "540px 960px" }, 0, 1.4);
    cam("desk", { scale: 1.9, x: 360, y: 500, origin: "540px 960px" }, { scale: 1.9, x: -40, y: 20, origin: "540px 960px" }, 1.6, ${(dur * 0.3).toFixed(2)}, "power2.inOut");
    cam("desk", { scale: 1.9, x: -40, y: 20, origin: "540px 960px" }, { scale: 1.9, x: -380, y: -560, origin: "540px 960px" }, ${(dur * 0.6).toFixed(2)}, ${(dur * 0.3).toFixed(2)}, "power2.inOut");
    ` }) };
}

// ── 10. three sheets: assets, life insurance, money to the husband; the unknown man, a red ? ────────
function l10(dur) {
  const id = "l10";
  const sheet = (n, title, lines) => `<g>${paper(300, 400, { lines: 0, color: "#ede4cc" })}
    <circle cx="40" cy="40" r="24" fill="#2a1e14"/>${T(40, 52, n, { size: 30, fill: "#ede4cc", font: "IRANSans", weight: 900 })}
    ${T(270, 120, title, { size: 30, font: "IRANSans", weight: 900, anchor: "start", rtl: true, fill: "#2a1e14" })}
    ${lines.map((l, i) => T(40, 200 + i * 56, l, { size: 30, anchor: "start", fill: "#1a1410" })).join("")}</g>`;
  return { id, dur, html: scene({ id, dur, bg: "#0c0806", vignette: 0.88, extraStyle: FONTS,
    layers: [{ name: "board", defs: BW_DEFS, svg: `<rect width="1080" height="1920" fill="#1e1a16"/><rect x="40" y="200" width="1000" height="1500" fill="#8a6a40"/>
      <g id="${id}-s0" opacity="0" transform="translate(80,300) rotate(-4)">${sheet("۱", "دارایی و ثروت قربانی", ["£2,500", "House", "Savings"])}</g>
      <g id="${id}-s1" opacity="0" transform="translate(700,330) rotate(3)">${sheet("۲", "بیمه عمر", ["Policy £500", "Paid to", "husband"])}</g>
      <g id="${id}-s2" opacity="0" transform="translate(390,1010) rotate(-2)">${sheet("۳", "انتقال منافع به شوهر", ["Will", "Transfer", "→ husband"])}</g>
      <g id="${id}-man" opacity="0" transform="translate(540,700)">${portrait(300, 380, 0, { man: true })}<rect x="-150" y="-190" width="300" height="380" fill="#000" opacity="0.35"/></g>
      <path d="M 300,500 L 450,640 M 840,520 L 640,640 M 540,1010 L 540,890" stroke="#c81818" stroke-width="4" opacity="0.8"/>
      <g id="${id}-q" opacity="0" transform="translate(540,680)">${T(0, 90, "?", { size: 300, fill: "#e01e1e", font: "Playfair Display", weight: 900 })}</g>` }],
    js: `
    ${[0, 1, 2].map((i) => `tl.fromTo("#${id}-s${i}", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, transformOrigin: "50% 50%", duration: 0.4, ease: "back.out(1.6)" }, ${(0.4 + i * dur * 0.18).toFixed(2)});`).join(" ")}
    tl.fromTo("#${id}-man", { opacity: 0 }, { opacity: 1, duration: 0.6 }, ${(dur * 0.62).toFixed(2)});
    cam("board", { scale: 1.0 }, { scale: 1.0 }, 0, ${(dur * 0.62).toFixed(2)});
    cam("board", { scale: 1.0, origin: "540px 700px" }, { scale: 2.0, origin: "540px 700px", y: 200 }, ${(dur * 0.66).toFixed(2)}, ${(dur * 0.26).toFixed(2)}, "power2.inOut");
    tl.fromTo("#${id}-q", { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, transformOrigin: "50% 50%", duration: 0.3, ease: "power3.out" }, ${(dur * 0.86).toFixed(2)});
    ` }) };
}

// ── 11. the pathologist over the files; photos of three baths; he sketches a bath plan ─────────────
function l11(dur) {
  const id = "l11", b = `${id}-be`;
  const tubPhoto = (v) => `<g><rect x="-110" y="-80" width="220" height="160" fill="#f2efe6"/><rect x="-100" y="-70" width="200" height="140" fill="#6a6a68"/>
    <path d="M -70,0 C -70,40 -50,55 -30,58 L 30,58 C 50,55 70,40 70,0 Z" fill="#d8d8d4"/><ellipse cx="0" cy="0" rx="72" ry="10" fill="#e8e8e4"/></g>`;
  return { id, dur, html: scene({ id, dur, bg: "#0c0a08", vignette: 0.9,
    layers: [{ name: "room", defs: glow(`${id}-lamp`, 760, 1100, 700, "#ffcf8a", 0.5), svg: `
      <rect width="1080" height="1920" fill="#2e3430"/><rect y="1180" width="1080" height="740" fill="#3a2a1c"/>
      ${place(420, 880, 1.0, man(b, "bernard", { arms: [[30, -110], [-22, 100]] }))}
      <path d="M -40,1420 L 1120,1420 L 1120,1960 L -40,1960 Z" fill="#4a2e18"/><path d="M -40,1420 L 1120,1420" stroke="#5e3c22" stroke-width="14"/>
      ${[0, 1, 2].map((i) => `<g transform="translate(${170 + i * 240},${1520 + (i % 2) * 30}) rotate(${[-6, 3, -4][i]})">${tubPhoto(i)}</g>`).join("")}
      <g transform="translate(820,1640) rotate(-4)">${paper(300, 220, { lines: 0, color: "#f2eee2" })}
        <path id="${id}-plan" d="M 60,70 C 60,170 90,180 120,180 L 200,180 C 230,180 250,170 250,70 L 60,70" stroke="#1a2a5a" stroke-width="4" fill="none" stroke-dasharray="560" stroke-dashoffset="560" transform="translate(-6,0)"/>
        <path id="${id}-dim" d="M 60,200 L 250,200 M 60,194 L 60,206 M 250,194 L 250,206" stroke="#9a1a14" stroke-width="3" opacity="0" transform="translate(-6,0)"/></g>
      <g transform="translate(760,1180)"><path d="M -20,-40 L 20,-40 L 40,40 L -40,40 Z" fill="#2a4a3a"/><rect x="-6" y="40" width="12" height="200" fill="#1a1a1a"/></g>
      <rect id="${id}-lampL" width="1080" height="1920" fill="url(#${id}-lamp)" style="mix-blend-mode:screen"/>${cool(0.3)}` }],
    js: `
    ${flick(`#${id}-lampL`, dur)}
    look("${b}", 4, 9, 0, 0.01); eyesOpen("${b}", 0.85, 0, 0.01); brows("${b}", 3, 5, 0, 0.01);
    cam("room", { scale: 1.0, origin: "540px 1300px" }, { scale: 1.12, origin: "540px 1300px" }, 0, ${(dur * 0.5).toFixed(2)});
    look("${b}", -6, 9, 1.2, 0.4); look("${b}", 0, 9, 2.2, 0.4); look("${b}", 6, 9, 3.2, 0.4);
    cam("room", { scale: 1.12, origin: "540px 1300px" }, { scale: 2.2, x: -330, y: -500, origin: "540px 1300px" }, ${(dur * 0.52).toFixed(2)}, ${(dur * 0.22).toFixed(2)}, "power2.inOut");
    tl.to("#${id}-plan", { attr: { "stroke-dashoffset": 0 }, duration: ${(dur * 0.22).toFixed(2)}, ease: "power1.inOut" }, ${(dur * 0.72).toFixed(2)});
    tl.to("#${id}-dim", { opacity: 1, duration: 0.3 }, ${(dur * 0.92).toFixed(2)});
    ` }) };
}

// ── 12. top view of the old bath with measurements; the victim's file beside; the mismatch ─────────
function l12(dur) {
  const id = "l12";
  return { id, dur, html: scene({ id, dur, bg: "#0c100e", vignette: 0.88, extraStyle: FONTS,
    layers: [{ name: "lab", defs: BW_DEFS, svg: `<rect width="1080" height="1920" fill="#34403a"/>${[...Array(26)].map((_, i) => `<line x1="0" y1="${i * 80}" x2="1080" y2="${i * 80}" stroke="#2a342e" stroke-width="3"/>`).join("")}
      <g transform="translate(330,960)"><rect x="-150" y="-520" width="300" height="1040" rx="150" fill="#eeece6"/><rect x="-118" y="-484" width="236" height="968" rx="118" fill="#9aaab4"/>
        <circle cx="0" cy="-440" r="16" fill="#a88a40"/></g>
      <g id="${id}-meas" opacity="0"><path d="M 520,440 L 520,1480 M 500,440 L 540,440 M 500,1480 L 540,1480" stroke="#ffd873" stroke-width="5"/>
        ${T(560, 980, "5 ft", { size: 70, fill: "#ffd873", font: "Playfair Display", anchor: "start" })}
        <path d="M 180,1530 L 480,1530 M 180,1510 L 180,1550 M 480,1510 L 480,1550" stroke="#ffd873" stroke-width="5"/></g>
      <g id="${id}-file" opacity="0" transform="translate(640,1180) rotate(4)">${caseFile("Bessie Mundy", "قد: ۱۷۰ سانتی‌متر", 0, { w: 380, h: 520 })}</g>
      <g id="${id}-diff" opacity="0"><rect x="560" y="1560" width="440" height="110" rx="12" fill="#9a1a14"/>${T(780, 1632, "5 ft 7 in  ≠  5 ft", { size: 50, fill: "#fff", font: "Playfair Display" })}</g>` }],
    js: `
    cam("lab", { scale: 1.0 }, { scale: 1.05 }, 0, ${(dur * 0.6).toFixed(2)});
    tl.fromTo("#${id}-meas", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.6);
    tl.fromTo("#${id}-file", { opacity: 0, x: 200 }, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, ${(dur * 0.35).toFixed(2)});
    tl.fromTo("#${id}-diff", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, transformOrigin: "780px 1615px", duration: 0.4, ease: "back.out(2)" }, ${(dur * 0.62).toFixed(2)});
    cam("lab", { scale: 1.05, origin: "640px 1300px" }, { scale: 1.7, origin: "640px 1300px", y: -120 }, ${(dur * 0.65).toFixed(2)}, ${(dur * 0.3).toFixed(2)}, "power2.inOut");
    ` }) };
}

// ── 13. a non-graphic reconstruction in silhouette: the legs lifted, the head slips under ───────────
function l13(dur) {
  const id = "l13", t0 = (dur * 0.45).toFixed(2);
  return { id, dur, html: scene({ id, dur, bg: "#030406", vignette: 0.95,
    layers: [{ name: "set", defs: glow(`${id}-l`, 540, 1050, 900, "#6a8ac0", 0.85), svg: `<rect width="1080" height="1920" fill="#06080c"/>
      <rect width="1080" height="1920" fill="url(#${id}-l)"/>
      <g transform="translate(540,1250) scale(1.3)">
        <g id="${id}-legs"><path d="M 140,-34 C 200,-48 260,-36 300,-24 L 304,-2 C 260,-12 200,-18 140,-12 Z" fill="#020203"/><ellipse cx="304" cy="-14" rx="16" ry="12" fill="#020203"/></g>
        <g id="${id}-head"><circle cx="-210" cy="-66" r="52" fill="#020203"/><path d="M -250,-96 C -260,-60 -250,-30 -230,-20" stroke="#020203" stroke-width="22" fill="none"/><path d="M -190,-30 C -120,-20 40,-20 150,-20 L 150,0 L -190,0 Z" fill="#020203"/></g>
        <path d="M -310,-20 C -310,100 -260,180 -180,195 L 180,195 C 260,180 310,100 310,-20 Z" fill="#14181e"/>
        <ellipse cx="0" cy="-20" rx="316" ry="34" fill="#1e242c"/><ellipse id="${id}-water" cx="0" cy="-16" rx="290" ry="22" fill="#2a3a4c" opacity="0.85"/>
        <ellipse id="${id}-ring" cx="-210" cy="-16" rx="4" ry="1" fill="none" stroke="#8aa4c8" stroke-width="3" opacity="0"/></g>
      <g id="${id}-hands" opacity="0"><path d="M 900,1050 C 840,1120 820,1180 830,1230 L 860,1230 C 860,1190 880,1140 930,1090 Z" fill="#020203"/></g>` }],
    js: `
    cam("set", { scale: 1.0, origin: "540px 1250px" }, { scale: 1.2, origin: "540px 1250px" }, 0, ${dur});
    tl.fromTo("#${id}-hands", { opacity: 0 }, { opacity: 1, duration: 0.3 }, ${(t0 - 0.4).toFixed(2)});
    tl.fromTo("#${id}-legs", { rotation: 0 }, { rotation: -55, svgOrigin: "150 -20", duration: 0.35, ease: "power3.in" }, ${t0});
    tl.fromTo("#${id}-head", { x: 0, y: 0 }, { x: 60, y: 50, duration: 0.45, ease: "power2.in" }, ${t0});
    tl.fromTo("#${id}-ring", { attr: { rx: 4, ry: 1 }, opacity: 0.9 }, { attr: { rx: 140, ry: 18 }, opacity: 0, duration: 1.6, ease: "power1.out" }, ${(+t0 + 0.4).toFixed(2)});
    tl.fromTo("#${id}-water", { opacity: 0.85 }, { opacity: 0.95, duration: 0.3 }, ${t0});
    ` }) };
}

// ── 14. the police experiment, from afar in shadow; they rush to the bath; the detective's shock ───
function l14(dur) {
  const id = "l14", d = `${id}-det`, cut = (dur * 0.62).toFixed(2);
  const sil = (x, y, s, i) => `<g transform="translate(${x},${y}) scale(${s})"><g id="${id}-p${i}"><path d="M -60,-560 C -90,-550 -100,-500 -100,-440 L -120,0 L 120,0 L 100,-440 C 100,-500 90,-550 60,-560 Z" fill="#0a0c10"/><circle cx="0" cy="-620" r="56" fill="#0a0c10"/>${i % 2 ? `<path d="M -50,-660 C -54,-760 54,-760 50,-660 Z" fill="#0a0c10"/>` : ""}</g></g>`;
  return { id, dur, html: scene({ id, dur, bg: "#05070d", vignette: 0.9,
    layers: [
      { name: "wide", svg: `${bathroom({ wall: "#1e282e", tile: "#7a8486", door: false })}${tub(540, 1180, { water: "#3a4a5a" })}
        ${sil(220, 1440, 0.62, 0)}${sil(380, 1430, 0.6, 1)}${sil(720, 1430, 0.6, 2)}${sil(880, 1440, 0.62, 3)}${dark(0.35)}${cool(0.35)}` },
      { name: "cu", svg: `<g id="${id}-cu" opacity="0"><rect width="1080" height="1920" fill="#14181e"/>${place(540, 860, 2.1, man(d, "det", { mouth: "tense" }))}${cool(0.35)}</g>` },
    ],
    js: `
    cam("wide", { scale: 1.0, origin: "540px 1250px" }, { scale: 1.15, origin: "540px 1250px" }, 0, ${cut});
    ${[0, 1, 2, 3].map((i) => `tl.fromTo("#${id}-p${i}", { x: 0 }, { x: ${[260, 150, -150, -260][i]}, duration: 0.5, ease: "power3.in" }, ${(dur * 0.4 + i * 0.05).toFixed(2)});`).join(" ")}
    tl.set("#${id}-cu", { opacity: 1 }, ${cut});
    eyesOpen("${d}", 1.4, 0, 0.01); brows("${d}", -18, -6, 0, 0.01); look("${d}", 0, 0, 0, 0.01);
    cam("cu", { scale: 1.0, origin: "540px 860px" }, { scale: 1.1, origin: "540px 860px" }, ${cut}, ${(dur - cut).toFixed(2)});
    ` }) };
}

// ── 15. the evidence assembled: victims and certificates on the wall; a man's photo in the centre ──
function l15(dur) {
  const id = "l15", d = `${id}-det`;
  return { id, dur, html: scene({ id, dur, bg: "#05070d", vignette: 0.88, extraStyle: FONTS,
    layers: [{ name: "wall", defs: BW_DEFS + glow(`${id}-lamp`, 540, 300, 900, "#ffcf8a", 0.35), svg: `${policeRoom()}
      ${[0, 1, 2].map((i) => `<g transform="translate(${230 + i * 310},470)">${portrait(170, 210, i)}</g>`).join("")}
      ${[0, 1, 2].map((i) => `<g transform="translate(${150 + i * 310},700) scale(0.55)">${certificate(["Smite", "Pep", "Leo"][i], ["B. Mundy", "A. Burnham", "M. Lofty"][i], i)}</g>`).join("")}
      <g transform="translate(540,1040)"><g id="${id}-man" opacity="0">${portrait(200, 250, 0, { man: true })}</g></g>
      ${[230, 540, 850].map((x) => `<line x1="${x}" y1="580" x2="540" y2="920" stroke="#c81818" stroke-width="4" class="${id}-str" opacity="0"/>`).join("")}
      <rect width="1080" height="1920" fill="url(#${id}-lamp)" style="mix-blend-mode:screen"/>
      ${place(250, 1500, 1.15, manBack(d, "det"))}${cool(0.3)}` }],
    js: `
    cam("wall", { scale: 1.0 }, { scale: 1.12, origin: "540px 800px" }, 0, ${dur});
    tl.fromTo("#${id}-man", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, ${(dur * 0.55).toFixed(2)});
    tl.to(".${id}-str", { opacity: 1, duration: 0.5, stagger: 0.2 }, ${(dur * 0.7).toFixed(2)});
    ` }) };
}

// ── 16. a busy street; two constables close in; a hand on his shoulder; he turns in fright ──────────
function l16(dur) {
  const id = "l16", g = `${id}-g`, b1 = `${id}-b1`, b2 = `${id}-b2`, turn = (dur * 0.55).toFixed(2);
  const passer = (x, y, s, i) => `<g id="${id}-ps${i}" transform="translate(${x},${y}) scale(${s})" opacity="0.8"><path d="M -60,-560 C -90,-550 -100,-500 -100,-440 L -120,0 L 120,0 L 100,-440 C 100,-500 90,-550 60,-560 Z" fill="${["#2a2a30", "#3a2e24", "#24302a"][i % 3]}"/><circle cx="0" cy="-620" r="56" fill="#c49a7a"/><path d="M -70,-660 C -74,-740 74,-740 70,-660 Z" fill="#1a1a1a"/></g>`;
  return { id, dur, html: scene({ id, dur, bg: "#3a3e42", vignette: 0.8,
    layers: [
      { name: "street", blur: 6, defs: LAMP_DEFS, svg: `${cobbleStreet({ day: true, fogOp: 0.15 })}${[[150, 1500, 0.55, 0], [400, 1480, 0.5, 1], [880, 1500, 0.55, 2], [700, 1470, 0.48, 0]].map((a) => passer(...a)).join("")}` },
      { name: "people", svg: `${place(540, 860, 1.1, man(g, "george", { head: HAT.bowler }), `${g}-all`)}
        <g id="${b1}-pos" transform="translate(-200,900)">${place(0, 0, 1.0, man(b1, "bobby"))}</g>
        <g id="${b2}-pos" transform="translate(1280,900)">${place(0, 0, 1.0, man(b2, "bobby", { arms: [[10, -55], [-120, 20]] }))}</g>` },
    ],
    js: `
    cam("street", { x: 0 }, { x: -80 }, 0, ${dur});
    tl.fromTo("#${g}-all", { y: 0 }, { y: -10, duration: 0.3, yoyo: true, repeat: 5 }, 0);
    look("${g}", 0, 2, 0, 0.01);
    tl.fromTo("#${b1}-pos", { attr: { transform: "translate(-200,900)" } }, { attr: { transform: "translate(150,900)" }, duration: ${(dur * 0.45).toFixed(2)}, ease: "power1.inOut" }, 0.4);
    tl.fromTo("#${b2}-pos", { attr: { transform: "translate(1280,900)" } }, { attr: { transform: "translate(930,900)" }, duration: ${(dur * 0.45).toFixed(2)}, ease: "power1.inOut" }, 0.4);
    turn("${g}", 16, ${turn}, 0.25, "power3.out"); look("${g}", 9, 0, ${turn}, 0.2);
    eyesOpen("${g}", 1.35, ${turn}, 0.2); brows("${g}", -16, -6, ${turn}, 0.2);
    cam("people", { scale: 1.0, origin: "540px 860px" }, { scale: 1.0, origin: "540px 860px" }, 0, ${turn});
    cam("people", { scale: 1.0, origin: "540px 860px" }, { scale: 1.9, origin: "540px 800px" }, ${(+turn + 0.2).toFixed(2)}, ${(dur - turn - 0.4).toFixed(2)}, "power2.inOut");
    ` }) };
}

// ── 17. black; heartbeat; his black-and-white photo; the name; slowly into his eyes ────────────────
function l17(dur) {
  const id = "l17";
  return { id, dur, html: scene({ id, dur, bg: "#000", vignette: 0.7,
    layers: [{ name: "all", defs: BW_DEFS, svg: `<rect width="1080" height="1920" fill="#000"/>
      <g id="${id}-ph" opacity="0" transform="translate(540,820)">${portrait(560, 700, 0, { man: true })}</g>
      <g id="${id}-nm" opacity="0">${T(540, 1280, "GEORGE JOSEPH SMITH", { size: 76, fill: "#ffffff", font: "Playfair Display", weight: 900, ls: 4 })}</g>` }],
    js: `
    tl.fromTo("#${id}-ph", { opacity: 0 }, { opacity: 1, duration: 0.9 }, 1.0);
    tl.fromTo("#${id}-nm", { opacity: 0 }, { opacity: 1, duration: 0.7 }, 2.0);
    cam("all", { scale: 1.0, origin: "540px 720px" }, { scale: 1.0, origin: "540px 720px" }, 0, 2.6);
    cam("all", { scale: 1.0, origin: "540px 720px" }, { scale: 2.4, origin: "540px 690px", y: 120 }, 2.8, ${(dur - 2.9).toFixed(2)}, "power1.in");
    ` }) };
}

// ── 18. the courtroom; the gavel; three files close; the camera leaves the room ─────────────────────
function l18(dur) {
  const id = "l18", g = `${id}-g`, a = (dur * 0.33).toFixed(2), b = (dur * 0.55).toFixed(2);
  return { id, dur, html: scene({ id, dur, bg: "#0c0806", vignette: 0.9, extraStyle: FONTS,
    layers: [
      { name: "court", svg: `<rect width="1080" height="1920" fill="#4a2e1a"/>${[...Array(8)].map((_, i) => `<rect x="${i * 140}" y="0" width="130" height="1920" fill="#5a3a22" opacity="0.6"/>`).join("")}
        <circle cx="540" cy="300" r="110" fill="#c9a24a" opacity="0.5"/>
        ${place(540, 900, 1.0, man(g, "george"))}
        <rect x="-20" y="1250" width="1120" height="700" fill="#3a2212"/>${[...Array(12)].map((_, i) => `<rect x="${i * 95}" y="1200" width="22" height="260" fill="#2a1608"/>`).join("")}<rect x="-20" y="1180" width="1120" height="30" fill="#5a3a22"/>${cool(0.3)}` },
      { name: "gavel", svg: `<g id="${id}-gv" opacity="0"><rect width="1080" height="1920" fill="#2a1a0e"/><rect y="1200" width="1080" height="720" fill="#4a2e18"/>
        <ellipse cx="540" cy="1260" rx="200" ry="40" fill="#3a2212"/>
        <g id="${id}-ham" transform="rotate(-40 760 1000)"><rect x="380" y="980" width="420" height="40" rx="18" fill="#5a3418"/><rect x="380" y="900" width="130" height="200" rx="22" fill="#6a4020"/></g></g>` },
      { name: "files", svg: `<g id="${id}-fl" opacity="0">${deskTop()}${[0, 1, 2].map((i) => `<g transform="translate(${100 + i * 300},${700 + (i % 2) * 120})"><path d="M 0,0 L 260,0 L 260,360 L 0,360 Z" fill="#c8a868"/>
          <g id="${id}-cv${i}"><path d="M 0,0 L 260,0 L 260,360 L 0,360 Z" fill="#b8985a"/>${T(130, 190, ["MUNDY", "BURNHAM", "LOFTY"][i], { size: 34, fill: "#3a2a18" })}</g></g>`).join("")}${cool(0.2)}</g>` },
    ],
    js: `
    look("${g}", 0, -2, 0, 0.01); eyesOpen("${g}", 0.95, 0, 0.01);
    cam("court", { scale: 1.0, origin: "540px 900px" }, { scale: 1.15, origin: "540px 900px" }, 0, ${a});
    tl.set("#${id}-gv", { opacity: 1 }, ${a});
    tl.to("#${id}-ham", { attr: { transform: "rotate(10 760 1000)" }, duration: 0.18, ease: "power4.in" }, ${(+a + 0.4).toFixed(2)});
    tl.set("#${id}-fl", { opacity: 1 }, ${b});
    ${[0, 1, 2].map((i) => `tl.fromTo("#${id}-cv${i}", { scaleX: 0 }, { scaleX: 1, transformOrigin: "0% 50%", duration: 0.35, ease: "power2.in" }, ${(+b + 0.3 + i * 0.25).toFixed(2)});`).join(" ")}
    cam("files", { scale: 1.2 }, { scale: 0.75 }, ${b}, ${(dur - b).toFixed(2)}, "power1.inOut");
    fadeOut(S, ${(dur - 0.6).toFixed(2)}, 0.5);
    ` }) };
}

// ── 19. outro: a phone, a thumb likes the video and follows ──────────────────────────────────────────
function l19(dur) {
  const id = "l19";
  return { id, dur, html: scene({ id, dur, bg: "#0b0d14", vignette: 0.7, extraStyle: FONTS,
    layers: [{ name: "phone", defs: BW_DEFS, svg: `<rect width="1080" height="1920" fill="#14100c"/>
      <rect x="200" y="260" width="680" height="1380" rx="86" fill="#0d0e12"/><rect x="214" y="274" width="652" height="1352" rx="78" fill="#15171d"/>
      <rect x="470" y="300" width="140" height="34" rx="17" fill="#050506"/>
      <rect x="234" y="360" width="612" height="900" fill="#2a2018"/><g transform="translate(540,780)">${portrait(360, 460, 0, { man: true })}</g>
      ${T(540, 1180, "GEORGE JOSEPH SMITH", { size: 34, fill: "#fff", font: "Playfair Display" })}
      <g transform="translate(540,1380)"><g id="${id}-heart"><path d="M 0,40 C -60,0 -70,-40 -40,-60 C -20,-72 -4,-60 0,-44 C 4,-60 20,-72 40,-60 C 70,-40 60,0 0,40 Z" fill="none" stroke="#fff" stroke-width="7"/>
        <path id="${id}-fill" d="M 0,40 C -60,0 -70,-40 -40,-60 C -20,-72 -4,-60 0,-44 C 4,-60 20,-72 40,-60 C 70,-40 60,0 0,40 Z" fill="#ff2d55" opacity="0"/></g></g>
      <g id="${id}-fol"><rect x="600" y="1500" width="220" height="80" rx="40" fill="#3b82f6"/>${T(710, 1552, "دنبال کردن", { size: 30, fill: "#fff", font: "IRANSans", weight: 900 })}</g>
      <g id="${id}-fol2" opacity="0"><rect x="600" y="1500" width="220" height="80" rx="40" fill="#2a2d36"/>${T(710, 1552, "دنبال شده", { size: 30, fill: "#cfd4dd", font: "IRANSans", weight: 900 })}</g>
      ${[...Array(8)].map((_, i) => `<circle id="${id}-sp${i}" cx="540" cy="1380" r="10" fill="#ff2d55" opacity="0"/>`).join("")}
      <g id="${id}-th" transform="translate(700,2200)"><g transform="rotate(-24) scale(1.6)"><path d="M -40,10 C -44,-40 -30,-70 0,-70 C 30,-70 44,-40 40,10 L 70,300 L -60,300 Z" fill="#d9a07a"/><path d="M -18,-56 C -8,-62 10,-62 18,-56 L 14,-30 L -14,-30 Z" fill="#f2cdb2"/></g></g>` }],
    js: `
    cam("phone", { scale: 1.0, rotation: -1.5 }, { scale: 1.05, rotation: 0.5 }, 0, ${dur});
    tl.fromTo("#${id}-th", { attr: { transform: "translate(700,2200)" } }, { attr: { transform: "translate(560,1470)" }, duration: 0.45, ease: "power2.out" }, 0.4);
    tl.fromTo("#${id}-heart", { scale: 1 }, { scale: 0.85, transformOrigin: "50% 50%", duration: 0.08 }, 0.9); tl.to("#${id}-heart", { scale: 1.25, transformOrigin: "50% 50%", duration: 0.15, ease: "back.out(3)" }, 0.98); tl.to("#${id}-heart", { scale: 1, transformOrigin: "50% 50%", duration: 0.2 }, 1.15);
    tl.fromTo("#${id}-fill", { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.98);
    ${[...Array(8)].map((_, i) => `tl.fromTo("#${id}-sp${i}", { attr: { cx: 540, cy: 1380 }, opacity: 1 }, { attr: { cx: ${(540 + Math.cos(i * Math.PI / 4) * 130).toFixed(0)}, cy: ${(1380 + Math.sin(i * Math.PI / 4) * 130).toFixed(0)} }, opacity: 0, duration: 0.5, ease: "power2.out" }, 0.98);`).join(" ")}
    tl.to("#${id}-th", { attr: { transform: "translate(720,1580)" }, duration: 0.4, ease: "power2.inOut" }, 1.6);
    tl.to("#${id}-fol", { scale: 0.92, transformOrigin: "710px 1540px", duration: 0.08 }, 2.05); tl.set("#${id}-fol", { opacity: 0 }, 2.15); tl.set("#${id}-fol2", { opacity: 1 }, 2.15);
    tl.to("#${id}-th", { attr: { transform: "translate(760,2300)" }, duration: 0.4, ease: "power2.in" }, 2.4);
    fadeOut(S, ${(dur - 0.6).toFixed(2)}, 0.5);
    ` }) };
}

const BUILDERS = { l3, l4, l5, l6, l7, l8, l9, l10, l11, l12, l13, l14, l15, l16, l17, l18, l19 };
// shared gradient ids get a per-shot prefix
const uniq = (shot) => ({ ...shot, html: shot.html.replace(/(id="|url\(#)(vigBW|lampG)\b/g, `$1${shot.id}-$2`) });
export default WL.shots.map((s) => uniq(BUILDERS[s.shot](DUR[s.shot])));
