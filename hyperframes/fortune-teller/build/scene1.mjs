// SCENE 1 – the fortune-teller's room. Shot-reverse-shot: the door wall is behind her, the paintings behind him.
import { scene, place, glow, C, wallBehindMan, wallBehindWoman, tableTop, ROOM, candle } from "./lib.mjs";
const P = C.PAL;

// What the old man writes on the paper (read again in scene 5). Change the text here, then rebuild.
export const NOTE = ["امشب، ساعت ۱۱", "به این شماره پیام بده", "۰۹۰۰ ۱۱۰ ۰۰۱۱"];
export const NOTE_FONT = `@font-face { font-family: "Ruqaa"; src: url('assets/fonts/ArefRuqaa-Regular.woff2') format('woff2'); }
@font-face { font-family: "Vazirmatn"; src: url('assets/fonts/Vazirmatn-SemiBold.ttf') format('truetype'); }`;

const wBust = (p, o = {}) => C.womanTorso(p, o) + C.womanHead(p, o);
const mBust = (p) => C.oldManTorso(p) + C.oldManHead(p);
const hallDefs = (s) => `<linearGradient id="${s}-hall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe2a8"/><stop offset="1" stop-color="#d9a35e"/></linearGradient>`;
const warm = (id, cx, cy, r, op = 0.5) => `<defs>${glow(id, cx, cy, r, "#ffb257", op)}</defs><rect width="1080" height="1920" fill="url(#${id})" style="mix-blend-mode:screen"/>`;

// ── Shot 1: close-up of her, looking at him ────────────────────────────────────────────────────────
function s1a() {
  const id = "s1a", w = `${id}-w`;
  return { id, dur: 3.2, html: scene({ id, dur: 3.2, fadeIn: true,
    layers: [
      { name: "bg", blur: 10, defs: hallDefs(id), svg: wallBehindWoman(id) },
      { name: "glow", svg: warm(`${id}-gl`, 120, 700, 900, 0.35) },
      { name: "char", svg: place(540, 880, 1.5, wBust(w), `${w}-all`) },
    ],
    js: `
    cam("bg", { scale: 1.08 }, { scale: 1.13 }, 0, 3.2);
    cam("char", { scale: 1.0 }, { scale: 1.06, y: -14 }, 0, 3.2);
    look("${w}", 6, 1, 0, 0.01); mouth("${w}", "W", 0, 0.01); brows("${w}", -5, -5, 0, 0.01);
    tl.fromTo("#${w}-head", { rotation: 0 }, { rotation: -2, transformOrigin: "50% 80%", duration: 3, ease: "sine.inOut" }, 0.1);
    blink("${w}", 1.25);
    look("${w}", 3, 3, 1.9, 0.3); look("${w}", 6, 1, 2.5, 0.3);
    brows("${w}", -8, -7, 2.2, 0.5);
    ` }) };
}

// ── Shot 2: close-up of him, attentive ─────────────────────────────────────────────────────────────
function manCU(id, dur, mode) {
  const m = `${id}-m`;
  const focused = mode === "focus";
  return { id, dur, html: scene({ id, dur,
    layers: [
      { name: "bg", blur: 8, svg: wallBehindMan(id) },
      { name: "glow", svg: warm(`${id}-gl`, 540, 760, 700, 0.3) },
      { name: "char", svg: place(540, focused ? 900 : 880, focused ? 1.62 : 1.45, mBust(m), `${m}-all`) },
    ],
    js: focused ? `
    cam("bg", { scale: 1.1 }, { scale: 1.14 }, 0, ${dur});
    cam("char", { scale: 1.0 }, { scale: 1.05, y: -10 }, 0, ${dur});
    look("${m}", -2, 6, 0, 0.01); brows("${m}", 5, 7, 0, 0.01); eyesOpen("${m}", 0.78, 0, 0.01);
    tl.fromTo("#${m}-head", { rotation: 0, y: 0 }, { rotation: 1.5, y: 6, transformOrigin: "50% 90%", duration: 1.2, ease: "sine.inOut" }, 0.2);
    tl.to("#${m}-head", { rotation: -0.5, y: 2, transformOrigin: "50% 90%", duration: 1.0, ease: "sine.inOut" }, 1.4);
    look("${m}", 3, 6, 0.9, 0.5); look("${m}", -3, 7, 1.6, 0.5);
    brows("${m}", 7, 9, 1.3, 0.6);
    ` : `
    cam("bg", { scale: 1.08 }, { scale: 1.12 }, 0, ${dur});
    cam("char", { scale: 1.0 }, { scale: 1.05, y: -12 }, 0, ${dur});
    look("${m}", -5, 1, 0, 0.01); brows("${m}", 2, 3, 0, 0.01);
    tl.fromTo("#${m}-head", { rotation: 0 }, { rotation: 1.8, transformOrigin: "50% 85%", duration: 2.8, ease: "sine.inOut" }, 0.1);
    blink("${m}", 1.7, 0.22);
    look("${m}", -3, 2, 2.2, 0.4);
    ` }) };
}

// ── Over-the-shoulder: from behind her, him across the table ───────────────────────────────────────
// mode: "reach" (her hand goes out, he takes it), "release" (he lets go, she pulls back), "paper" (pen and paper).
const ARM = { sx: 470, sy: 1990, wx: 612, wy: 1338 }; // her shoulder (off-frame) and wrist on the table
const sleeve = (wx, wy) => `M ${ARM.sx - 70},${ARM.sy} L ${ARM.sx + 70},${ARM.sy} L ${wx + 44},${wy + 10} L ${wx - 40},${wy - 4} Z`;
function ots(id, dur, mode) {
  const m = `${id}-m`, w = `${id}-w`;
  const tableY = 1250;
  const restL = [455, 1268], restR = [735, 1268];
  const hands = `
    <g id="${m}-hL" transform="translate(${restL[0]},${restL[1]})"><g transform="rotate(168) scale(0.46)">${C.oldManHand(`${m}-hLd`)}</g></g>
    <g id="${m}-hR" transform="translate(${restR[0]},${restR[1]})"><g transform="rotate(192) scale(0.46)">${C.oldManHand(`${m}-hRd`)}</g></g>`;
  const paper = mode === "paper" ? `
    <g id="${id}-stack"><path d="M 200,1300 L 330,1296 L 340,1350 L 196,1356 Z" fill="#e9e1cf"/><path d="M 196,1356 L 340,1350 L 340,1358 L 196,1364 Z" fill="#c9bfa8"/></g>
    <g id="${id}-sheet" opacity="0"><path d="M 520,1300 L 680,1300 L 696,1372 L 506,1372 Z" fill="#f2ead8"/>
      <g id="${id}-scrib" opacity="0" stroke="#2b2a4a" stroke-width="2.5" fill="none"><path d="M 650,1316 C 630,1312 600,1320 560,1316"/><path d="M 660,1332 C 630,1328 590,1338 550,1332"/></g></g>
    <g id="${id}-pen" transform="translate(860,1300)"><rect x="-4" y="-46" width="9" height="56" rx="3" fill="#1d2035" transform="rotate(70)"/></g>` : "";
  const herArm = `
    <path id="${w}-sleeve" d="${mode === "release" ? sleeve(ARM.wx, ARM.wy) : sleeve(520, 2050)}" fill="${P.coat}"/>
    <g id="${w}-hand" transform="translate(${mode === "release" ? `${ARM.wx},${ARM.wy}` : "520,2050"})"><g transform="rotate(-6) scale(0.66, 0.52)">${C.womanHand(`${w}-hd`, { palm: true, sleeve: "coat" })}</g></g>`;
  let js = `
    cam("bg", { scale: 1.0 }, { scale: 1.03 }, 0, ${dur});
    cam("man", { scale: 1.0 }, { scale: 1.04 }, 0, ${dur});
    cam("table", { scale: 1.0 }, { scale: 1.045 }, 0, ${dur});
    cam("hands", { scale: 1.0 }, { scale: 1.045 }, 0, ${dur});
    cam("fg", { scale: 1.0, x: 0 }, { scale: 1.06, x: -12 }, 0, ${dur});
    flicker("#${id}-c1-halo, #${id}-c2-halo", ${dur}, 0.2, 0.06);
  `;
  if (mode === "reach") js += `
    look("${m}", -3, 4, 0, 0.01); brows("${m}", 2, 3, 0, 0.01);
    tl.fromTo("#${w}-sleeve", { attr: { d: "${sleeve(520, 2050)}" } }, { attr: { d: "${sleeve(ARM.wx, ARM.wy)}" }, duration: 1.5, ease: "power2.inOut" }, 0.3);
    tl.fromTo("#${w}-hand", { attr: { transform: "translate(520,2050)" } }, { attr: { transform: "translate(${ARM.wx},${ARM.wy})" }, duration: 1.5, ease: "power2.inOut" }, 0.3);
    look("${m}", 2, 9, 0.6, 0.5);
    tl.fromTo("#${m}-head", { rotation: 0 }, { rotation: 3, transformOrigin: "50% 90%", duration: 0.8, ease: "power2.inOut" }, 0.9);
    tl.fromTo("#${m}-hL", { attr: { transform: "translate(${restL[0]},${restL[1]})" } }, { attr: { transform: "translate(570,1318)" }, duration: 1.0, ease: "power2.inOut" }, 1.8);
    tl.fromTo("#${m}-hR", { attr: { transform: "translate(${restR[0]},${restR[1]})" } }, { attr: { transform: "translate(668,1316)" }, duration: 1.0, ease: "power2.inOut" }, 2.0);
    blink("${m}", 2.9);
  `;
  if (mode === "release") js += `
    look("${m}", 2, 9, 0, 0.01); brows("${m}", 4, 6, 0, 0.01);
    tl.set("#${m}-hL", { attr: { transform: "translate(570,1318)" } }, 0);
    tl.set("#${m}-hR", { attr: { transform: "translate(668,1316)" } }, 0);
    tl.to("#${m}-hR", { attr: { transform: "translate(${restR[0]},${restR[1]})" }, duration: 0.9, ease: "power2.inOut" }, 0.4);
    tl.to("#${m}-hL", { attr: { transform: "translate(${restL[0]},${restL[1]})" }, duration: 0.9, ease: "power2.inOut" }, 0.6);
    tl.to("#${w}-sleeve", { attr: { d: "${sleeve(520, 2050)}" }, duration: 1.3, ease: "power2.inOut" }, 1.1);
    tl.to("#${w}-hand", { attr: { transform: "translate(520,2050)" }, duration: 1.3, ease: "power2.inOut" }, 1.1);
    look("${m}", -2, 2, 1.3, 0.5); brows("${m}", 2, 3, 1.3, 0.5);
    tl.fromTo("#${m}-head", { rotation: 3 }, { rotation: 0, transformOrigin: "50% 90%", duration: 1.0, ease: "power2.inOut" }, 1.2);
    blink("${m}", 2.4);
  `;
  if (mode === "paper") js += `
    look("${m}", -6, 4, 0, 0.01); brows("${m}", 3, 4, 0, 0.01);
    tl.fromTo("#${m}-head", { rotation: 0 }, { rotation: -4, transformOrigin: "50% 90%", duration: 0.6, ease: "power2.inOut" }, 0.1);
    tl.fromTo("#${m}-hL", { attr: { transform: "translate(${restL[0]},${restL[1]})" } }, { attr: { transform: "translate(290,1320)" }, duration: 0.6, ease: "power2.inOut" }, 0.2);
    tl.to("#${m}-hL", { attr: { transform: "translate(560,1330)" }, duration: 0.6, ease: "power2.inOut" }, 0.85);
    tl.fromTo("#${id}-sheet", { opacity: 0, x: -300, y: 0 }, { opacity: 1, x: 0, y: 0, duration: 0.6, ease: "power2.inOut" }, 0.85);
    tl.set("#${id}-sheet", { opacity: 1 }, 0.85);
    tl.to("#${m}-hL", { attr: { transform: "translate(${restL[0]},${restL[1]})" }, duration: 0.5, ease: "power2.inOut" }, 1.5);
    tl.fromTo("#${m}-hR", { attr: { transform: "translate(${restR[0]},${restR[1]})" } }, { attr: { transform: "translate(850,1290)" }, duration: 0.45, ease: "power2.inOut" }, 1.3);
    tl.to("#${id}-pen", { attr: { transform: "translate(660,1300)" }, duration: 0.5, ease: "power2.inOut" }, 1.8);
    tl.to("#${m}-hR", { attr: { transform: "translate(660,1300)" }, duration: 0.5, ease: "power2.inOut" }, 1.8);
    tl.to("#${m}-head", { rotation: 3, transformOrigin: "50% 90%", duration: 0.5, ease: "power2.inOut" }, 1.6);
    look("${m}", 0, 10, 1.6, 0.4); brows("${m}", 5, 6, 1.7, 0.4);
    ${[0, 1, 2, 3].map((i) => `tl.to("#${m}-hR", { attr: { transform: "translate(${640 - i * 22},${1302 + (i % 2) * 4})" }, duration: 0.12, ease: "sine.inOut" }, ${2.32 + i * 0.12});
    tl.to("#${id}-pen", { attr: { transform: "translate(${640 - i * 22},${1302 + (i % 2) * 4})" }, duration: 0.12, ease: "sine.inOut" }, ${2.32 + i * 0.12});`).join("\n")}
    tl.to("#${id}-scrib", { opacity: 1, duration: 0.4 }, 2.35);
  `;
  return { id, dur, html: scene({ id, dur,
    layers: [
      { name: "bg", blur: 3, svg: wallBehindMan(id) },
      { name: "man", svg: place(600, 880, 0.8, mBust(m), `${m}-all`) },
      { name: "table", svg: `${tableTop(tableY)}
        <ellipse cx="300" cy="1300" rx="260" ry="60" fill="#ffb257" opacity="0.12"/>
        <g transform="translate(870,1300)"><ellipse cx="0" cy="0" rx="60" ry="14" fill="#2a1a12" opacity="0.5"/>
          <circle cx="0" cy="-58" r="56" fill="#8fb3d9" opacity="0.45"/><circle cx="0" cy="-58" r="56" fill="none" stroke="#d7e6f4" stroke-width="3" opacity="0.5"/>
          <ellipse cx="-16" cy="-78" rx="16" ry="10" fill="#fff" opacity="0.5"/><path d="M -36,-6 L 36,-6 L 28,8 L -28,8 Z" fill="${ROOM.goldDk}"/></g>
        ${mode === "paper" ? "" : `<g transform="translate(250,1310)"><path d="M -60,-10 L 40,-14 L 50,26 L -64,30 Z" fill="#e9e1cf"/></g>`}` },
      { name: "hands", svg: paper + hands },
      { name: "arm", svg: herArm },
      { name: "fg", blur: 4, svg: place(250, 1500, 1.3, C.womanTorsoBack(w) + C.womanHeadBack(w), `${w}-back`) },
    ],
    js }) };
}

// ── Insert: top-down on the table, he reads her palm ───────────────────────────────────────────────
function woodTop(id) {
  return `<rect width="1080" height="1920" fill="${ROOM.wood}"/>
    ${[...Array(16)].map((_, i) => `<path d="M -20,${i * 124 + 30} C 300,${i * 124 + 10 + (i % 3) * 14} 700,${i * 124 + 60} 1100,${i * 124 + 26}" stroke="${ROOM.woodDk}" stroke-width="${3 + (i % 3)}" fill="none" opacity="0.55"/>`).join("")}
    ${[...Array(8)].map((_, i) => `<path d="M -20,${i * 250 + 90} C 400,${i * 250 + 80} 600,${i * 250 + 120} 1100,${i * 250 + 96}" stroke="${ROOM.woodHi}" stroke-width="2" fill="none" opacity="0.4"/>`).join("")}`;
}
function s1d() {
  const id = "s1d", dur = 4.8;
  // her palm: wrist at (560,1520), scale 3.1; the life line in hand coords runs (22,-14) → (-12,-74)
  const hx = 560, hy = 1520, hs = 3.1;
  const tip = (lx, ly) => [hx + lx * hs, hy + ly * hs];
  // his pointing hand: rotation 205, scale 2.2 → fingertip offset from wrist ≈ (-180, 396)
  const wristFor = ([x, y]) => [Math.round(x + 180), Math.round(y - 396)];
  const path = [tip(30, -6), tip(22, -14), tip(6, -28), tip(-8, -50), tip(-12, -74)].map(wristFor);
  const heart = [tip(20, -60), tip(0, -62), tip(-20, -58)].map(wristFor);
  const [x0, y0] = path[0];
  const away = [x0 + 260, y0 - 420];
  let js = `
    cam("wood", { scale: 1.04, rotation: -1.5 }, { scale: 1.1, rotation: 0.5 }, 0, ${dur});
    cam("hands", { scale: 1.04, rotation: -1.5 }, { scale: 1.1, rotation: 0.5 }, 0, ${dur});
    flicker("#${id}-glow", ${dur}, 0.55, 0.12);
    tl.fromTo("#${id}-ptr", { attr: { transform: "translate(${away[0]},${away[1]})" } }, { attr: { transform: "translate(${x0},${y0})" }, duration: 0.8, ease: "power2.out" }, 0.3);
  `;
  let t = 1.25;
  for (const [x, y] of path.slice(1)) { js += `tl.to("#${id}-ptr", { attr: { transform: "translate(${x},${y})" }, duration: 0.5, ease: "sine.inOut" }, ${t.toFixed(2)});\n`; t += 0.5; }
  t += 0.25;
  for (const [x, y] of heart) { js += `tl.to("#${id}-ptr", { attr: { transform: "translate(${x},${y})" }, duration: 0.42, ease: "sine.inOut" }, ${t.toFixed(2)});\n`; t += 0.42; }
  js += `tl.to("#${id}-ptr", { attr: { transform: "translate(${away[0]},${away[1]})" }, duration: 0.7, ease: "power2.in" }, ${(t + 0.15).toFixed(2)});
    tl.fromTo("#${id}-her", { attr: { transform: "translate(${hx},${hy + 30})" } }, { attr: { transform: "translate(${hx},${hy})" }, duration: 0.6, ease: "power2.out" }, 0);
    tl.fromTo("#${id}-her-fing", { scaleY: 1 }, { scaleY: 0.97, transformOrigin: "50% 100%", duration: 1.2, ease: "sine.inOut" }, 2.4);`;
  return { id, dur, html: scene({ id, dur, vignette: 0.8,
    layers: [
      { name: "wood", svg: woodTop(id) },
      { name: "hands", defs: glow(`${id}-g`, 200, 300, 1100, "#ffb257", 0.5), svg: `
        <rect id="${id}-glow" width="1080" height="1920" fill="url(#${id}-g)" opacity="0.55" style="mix-blend-mode:screen"/>
        <g id="${id}-her" transform="translate(${hx},${hy})"><g transform="scale(${hs})"><g id="${id}-her-fing">${C.womanHand(`${id}-hd`, { palm: true })}</g></g></g>
        <g transform="translate(395,1585)"><g transform="rotate(96) scale(2.1)">${C.oldManHand(`${id}-hold`)}</g></g>
        <path d="M 330,1500 C 360,1480 390,1490 400,1510" stroke="${P.mSkinDeep}" stroke-width="5" fill="none" opacity="0.5"/>
        <g id="${id}-ptr" transform="translate(${away[0]},${away[1]})"><g transform="rotate(205) scale(2.2)">${C.oldManHand(`${id}-pt`, { point: true })}</g></g>` },
    ],
    js }) };
}

// ── Insert: top-down, he writes, folds the paper, she takes it ─────────────────────────────────────
function s1h() {
  const id = "s1h", dur = 6.4;
  const px = 540, py = 980, pw = 560, ph = 720;
  const lines = NOTE.map((txt, i) => ({ txt, y: py - ph / 2 + 150 + i * 120, size: i === 2 ? 64 : 56 }));
  const right = px + pw / 2 - 60, left = px - pw / 2 + 60;
  const clips = lines.map((l, i) => `<clipPath id="${id}-cl${i}"><rect id="${id}-cr${i}" x="${right}" y="${l.y - 80}" width="0" height="120"/></clipPath>`).join("");
  const text = lines.map((l, i) => `<text x="${right}" y="${l.y}" font-family="Ruqaa, Vazirmatn" font-size="${l.size}" fill="#24264a" text-anchor="start" direction="rtl" clip-path="url(#${id}-cl${i})">${l.txt}</text>`).join("");
  // pen hand: rotation 200 → pen tip offset from wrist ≈ (-120, 300) at this scale; tip rides on the reveal edge
  const off = [130, -300];
  let js = `
    cam("wood", { scale: 1.05 }, { scale: 1.1 }, 0, ${dur});
    cam("paper", { scale: 1.05 }, { scale: 1.1 }, 0, ${dur});
    flicker("#${id}-glow", ${dur}, 0.5, 0.1);
    tl.fromTo("#${id}-pen", { attr: { transform: "translate(${right + off[0] + 200},${lines[0].y + off[1] - 300})" } }, { attr: { transform: "translate(${right + off[0]},${lines[0].y + off[1]})" }, duration: 0.5, ease: "power2.out" }, 0);
  `;
  let t = 0.5;
  lines.forEach((l, i) => {
    const d = i === 2 ? 0.9 : 0.85;
    js += `tl.fromTo("#${id}-cr${i}", { attr: { x: ${right}, width: 0 } }, { attr: { x: ${left}, width: ${right - left} }, duration: ${d}, ease: "none" }, ${t.toFixed(2)});\n`;
    // the hand travels right → left with a small up-down wiggle
    const steps = 6;
    for (let k = 1; k <= steps; k++) {
      const x = right - (right - left) * (k / steps), y = l.y + (k % 2 ? -6 : 4);
      js += `tl.to("#${id}-pen", { attr: { transform: "translate(${Math.round(x + off[0])},${Math.round(y + off[1])})" }, duration: ${(d / steps).toFixed(3)}, ease: "sine.inOut" }, ${(t + (d * (k - 1)) / steps).toFixed(3)});\n`;
    }
    t += d;
    if (i < lines.length - 1) {
      js += `tl.to("#${id}-pen", { attr: { transform: "translate(${right + off[0]},${lines[i + 1].y + off[1]})" }, duration: 0.18, ease: "power2.inOut" }, ${t.toFixed(2)});\n`;
      t += 0.2;
    }
  });
  // pen lifts away, then the fold: top half collapses onto the bottom half, its back shows
  const tf = t + 0.35;
  js += `
    tl.to("#${id}-pen", { attr: { transform: "translate(${right + 420},${py - 700})" }, duration: 0.5, ease: "power2.in" }, ${t.toFixed(2)});
    tl.to("#${id}-top", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.35, ease: "power2.in" }, ${tf.toFixed(2)});
    tl.fromTo("#${id}-flap", { scaleY: 0 }, { scaleY: 1, transformOrigin: "50% 0%", duration: 0.35, ease: "power2.out" }, ${(tf + 0.35).toFixed(2)});
    tl.to("#${id}-sheet", { attr: { transform: "translate(0,560) rotate(4 ${px} ${py})" }, duration: 0.8, ease: "power2.inOut" }, ${(tf + 0.85).toFixed(2)});
    tl.fromTo("#${id}-push", { attr: { transform: "translate(${px + 360},${py - 520})" } }, { attr: { transform: "translate(${px + 140},${py + 100})" }, duration: 0.5, ease: "power2.out" }, ${(tf + 0.5).toFixed(2)});
    tl.to("#${id}-push", { attr: { transform: "translate(${px + 140},${py + 660})" }, duration: 0.8, ease: "power2.inOut" }, ${(tf + 0.85).toFixed(2)});
    tl.to("#${id}-push", { attr: { transform: "translate(${px + 420},${py - 200})" }, duration: 0.6, ease: "power2.in" }, ${(tf + 1.7).toFixed(2)});
    tl.fromTo("#${id}-take", { attr: { transform: "translate(${px - 40},2350)" } }, { attr: { transform: "translate(${px - 40},${py + 860})" }, duration: 0.6, ease: "power2.out" }, ${(tf + 1.75).toFixed(2)});
    tl.to("#${id}-take", { attr: { transform: "translate(${px - 40},2450)" }, duration: 0.7, ease: "power2.in" }, ${(tf + 2.45).toFixed(2)});
    tl.to("#${id}-sheet", { attr: { transform: "translate(0,1450) rotate(4 ${px} ${py})" }, duration: 0.7, ease: "power2.in" }, ${(tf + 2.45).toFixed(2)});
  `;
  const half = ph / 2;
  return { id, dur, html: scene({ id, dur, vignette: 0.8, extraStyle: NOTE_FONT,
    layers: [
      { name: "wood", svg: woodTop(id) },
      { name: "paper", defs: glow(`${id}-g`, 160, 200, 1200, "#ffb257", 0.5) + clips, svg: `
        <rect id="${id}-glow" width="1080" height="1920" fill="url(#${id}-g)" opacity="0.5" style="mix-blend-mode:screen"/>
        <g id="${id}-sheet" transform="translate(0,0) rotate(-3 ${px} ${py})">
          <rect x="${px - pw / 2 + 10}" y="${py + 14}" width="${pw}" height="${half}" fill="#000" opacity="0.25"/>
          <rect x="${px - pw / 2}" y="${py}" width="${pw}" height="${half}" fill="#f3ecdc"/>
          <g id="${id}-top"><rect x="${px - pw / 2 + 10}" y="${py - half + 14}" width="${pw}" height="${half - 14}" fill="#000" opacity="0.25"/><rect x="${px - pw / 2}" y="${py - half}" width="${pw}" height="${half}" fill="#f6f0e2"/>${text}</g>
          <g id="${id}-flap"><rect x="${px - pw / 2}" y="${py}" width="${pw}" height="${half}" fill="#e8dfca"/>
            <g transform="translate(${2 * px},${2 * py}) scale(-1,-1)" opacity="0.12">${text.replace(/clip-path="[^"]*"/g, "")}</g></g>
        </g>
        <g id="${id}-take" transform="translate(${px - 40},2350)"><g transform="scale(2.4)">${C.womanHand(`${id}-tk`, { sleeve: "coat" })}</g></g>
        <g id="${id}-push" transform="translate(${px + 360},${py - 520})"><g transform="rotate(195) scale(2.2)">${C.oldManHand(`${id}-ps`)}</g></g>
        <g id="${id}-pen" transform="translate(${right + 330},${lines[0].y - 600})">
          <g transform="rotate(200) scale(2.1)">${C.oldManHand(`${id}-pn`)}</g>
          <rect x="-10" y="-20" width="20" height="200" rx="8" fill="#1d2035" transform="translate(-130,300) rotate(205)"/>
          <path d="M -6,0 L 6,0 L 0,18 Z" fill="#c9a24a" transform="translate(-130,300) rotate(205)"/>
        </g>` },
    ],
    js }) };
}

// ── She glances at the folded paper ────────────────────────────────────────────────────────────────
function s1i() {
  const id = "s1i", dur = 2.6, w = `${id}-w`;
  const paper = `<g transform="translate(0,560)"><rect x="-150" y="-80" width="300" height="160" rx="3" fill="#ece3cf"/>
      <path d="M -150,-80 L 150,-80" stroke="#cfc4aa" stroke-width="4"/></g>
    <g transform="translate(-250,610) rotate(62) scale(0.95)">${C.womanHand(`${w}-hl`, { sleeve: "coat" })}</g>
    <g transform="translate(250,610) rotate(-62) scale(-0.95,0.95)">${C.womanHand(`${w}-hr`, { sleeve: "coat" })}</g>`;
  return { id, dur, html: scene({ id, dur,
    layers: [
      { name: "bg", blur: 9, defs: hallDefs(id), svg: wallBehindWoman(id) },
      { name: "glow", svg: warm(`${id}-gl`, 120, 700, 900, 0.35) },
      { name: "char", svg: place(540, 760, 1.12, wBust(w) + paper, `${w}-all`) },
    ],
    js: `
    cam("bg", { scale: 1.08 }, { scale: 1.12 }, 0, ${dur});
    cam("char", { scale: 1.0 }, { scale: 1.05, y: -12 }, 0, ${dur});
    look("${w}", 0, 8, 0, 0.01); eyesOpen("${w}", 0.85, 0, 0.01); mouth("${w}", "N", 0, 0.01); brows("${w}", -2, -3, 0, 0.01);
    tl.fromTo("#${w}-head", { rotation: 0, y: 0 }, { rotation: 2, y: 8, transformOrigin: "50% 80%", duration: 0.6, ease: "power2.out" }, 0);
    brows("${w}", -6, -6, 1.0, 0.4);
    tl.to("#${w}-head", { rotation: 0, y: 0, transformOrigin: "50% 80%", duration: 0.5, ease: "power2.inOut" }, 1.6);
    eyesOpen("${w}", 1, 1.6, 0.3); look("${w}", 6, 1, 1.65, 0.35); mouth("${w}", "W", 1.7);
    blink("${w}", 2.15);
    ` }) };
}

// ── Wide reverse: from behind him, she stands, turns and leaves through the door ───────────────────
function s1j() {
  const id = "s1j", dur = 7.5, f = `${id}-f`, b = `${id}-b`, m = `${id}-m`;
  const seat = { x: 430, y: 1700, s: 0.8 };
  const T = (x, y, s) => `translate(${x},${y}) scale(${s})`;
  const door = { x: 775, y: 1196, s: 0.6 };
  let js = `
    cam("room", { scale: 1.02 }, { scale: 1.06, x: -10 }, 0, ${dur});
    cam("fg", { scale: 1.02 }, { scale: 1.08, x: -20 }, 0, ${dur});
        tl.fromTo("#${f}-pos", { attr: { transform: "${T(seat.x, seat.y + 250, seat.s)}" } }, { attr: { transform: "${T(seat.x, seat.y, seat.s)}" }, duration: 0.9, ease: "power2.inOut" }, 0.6);
    tl.fromTo("#${f}", { rotation: 0 }, { rotation: -3, transformOrigin: "50% 100%", duration: 0.45, ease: "power2.out" }, 0.6);
    tl.to("#${f}", { rotation: 0, transformOrigin: "50% 100%", duration: 0.45, ease: "power2.inOut" }, 1.05);
    look("${f}-h", 0, 6, 0.4, 0.3);
    // the turn: squash the front view out, the back view in
    tl.to("#${f}", { scaleX: 0.05, transformOrigin: "50% 100%", duration: 0.2, ease: "power2.in" }, 1.75);
    tl.set("#${f}", { opacity: 0 }, 1.95);
    tl.set("#${b}", { opacity: 1 }, 1.95);
    tl.fromTo("#${b}", { scaleX: 0.05 }, { scaleX: 1, transformOrigin: "50% 100%", duration: 0.22, ease: "power2.out" }, 1.95);
    tl.fromTo("#${b}-pos", { attr: { transform: "${T(seat.x, seat.y, seat.s)}" } }, { attr: { transform: "${T(door.x, door.y + 10, door.s)}" }, duration: 3.0, ease: "power1.inOut" }, 2.2);
  `;
  // walk cycle: legs and arms in opposition, a small bob
  const steps = 7, st = 2.25, sd = 3.0 / steps;
  for (let k = 0; k < steps; k++) {
    const a = k % 2 ? 1 : -1, t = (st + k * sd).toFixed(3);
    js += `tl.to("#${b}-legL", { rotation: ${16 * a}, svgOrigin: "-26 -360", duration: ${sd.toFixed(3)}, ease: "sine.inOut" }, ${t});
    tl.to("#${b}-legR", { rotation: ${-16 * a}, svgOrigin: "26 -360", duration: ${sd.toFixed(3)}, ease: "sine.inOut" }, ${t});
    tl.to("#${b}-armL", { rotation: ${-10 * a}, svgOrigin: "-70 -790", duration: ${sd.toFixed(3)}, ease: "sine.inOut" }, ${t});
    tl.to("#${b}-armR", { rotation: ${-10 * a}, svgOrigin: "70 -790", duration: ${sd.toFixed(3)}, ease: "sine.inOut" }, ${t});
    tl.to("#${b}-body", { y: -10, duration: ${(sd / 2).toFixed(3)}, ease: "sine.out" }, ${t});
    tl.to("#${b}-body", { y: 0, duration: ${(sd / 2).toFixed(3)}, ease: "sine.in" }, ${(st + k * sd + sd / 2).toFixed(3)});\n`;
  }
  js += `
    tl.to(["#${b}-legL", "#${b}-legR", "#${b}-armL"], { rotation: 0, duration: 0.25 }, 5.26);
    tl.to("#${b}-armR", { rotation: -40, svgOrigin: "70 -790", duration: 0.3, ease: "power2.out" }, 5.26);
    tl.fromTo("#${id}-door", { scaleX: 1 }, { scaleX: 0.14, transformOrigin: "0% 50%", duration: 0.6, ease: "power2.inOut" }, 5.0);
    tl.to("#${b}-armR", { rotation: 0, svgOrigin: "70 -790", duration: 0.3 }, 5.6);
    tl.set("#${id}-dclip", { attr: { x: 640, y: 346, width: 284, height: 852 } }, 5.5);
    tl.to("#${b}-pos", { attr: { transform: "${T(door.x + 40, door.y - 16, door.s * 0.94)}" }, duration: 0.7, ease: "power1.in" }, 5.5);
    tl.to("#${b}", { opacity: 0, duration: 0.45, ease: "power1.in" }, 5.7);
    tl.to("#${id}-door", { scaleX: 1, transformOrigin: "0% 50%", duration: 0.55, ease: "power2.inOut" }, 6.25);
    tl.fromTo("#${m}-hd", { rotation: 0, x: 0 }, { rotation: 6, x: 14, transformOrigin: "50% 90%", duration: 3.2, ease: "sine.inOut" }, 2.4);
  `;
  const chair = `<path d="M 300,1080 L 560,1080 L 560,1110 L 300,1110 Z" fill="${ROOM.woodDk}"/>
    <rect x="310" y="1080" width="26" height="380" fill="${ROOM.woodDk}"/><rect x="524" y="1080" width="26" height="380" fill="${ROOM.woodDk}"/>`;
  return { id, dur, html: scene({ id, dur, fadeOut: true,
    layers: [
      { name: "room", defs: hallDefs(id) + `<clipPath id="${id}-dc"><rect id="${id}-dclip" x="-200" y="-200" width="1500" height="2400"/></clipPath>`, svg: `
        ${wallBehindWoman(id)}
        <rect x="0" y="1190" width="1080" height="730" fill="#2b1c16"/>
        ${[...Array(8)].map((_, i) => `<path d="M 0,${1230 + i * 70} L 1080,${1230 + i * 70}" stroke="#1f140f" stroke-width="3"/>`).join("")}
        <rect x="0" y="1170" width="1080" height="22" fill="${ROOM.woodHi}"/>
        ${chair}
        <g clip-path="url(#${id}-dc)">
          <g id="${f}-pos" transform="${T(seat.x, seat.y + 250, seat.s)}"><g id="${f}">${C.womanFull(f)}</g></g>
          <g id="${b}-pos" transform="${T(seat.x, seat.y, seat.s)}"><g id="${b}" opacity="0">${C.womanFull(b, { back: true })}</g></g>
        </g>
        ${tableTop(1440)}
        <g transform="translate(250,1470)">${candle(`${id}-c1`, 1.2)}</g>` },
      { name: "fg", blur: 5, svg: `<g transform="translate(830,1720) scale(1.25)"><g id="${m}-hd">${C.oldManTorsoBack(m)}${C.oldManHeadBack(m)}</g></g>` },
    ],
    js }) };
}

export default [
  s1a(),
  manCU("s1b", 3.0, "attentive"),
  ots("s1c", 3.6, "reach"),
  s1d(),
  manCU("s1e", 2.6, "focus"),
  ots("s1f", 3.2, "release"),
  ots("s1g", 2.8, "paper"),
  s1h(),
  s1i(),
  s1j(),
];
