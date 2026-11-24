// Part 3: she opens the bot, signs up, takes a selfie, gets requests, starts chatting, dreams; then the call to action.
import { scene, place, glow } from "./lib.mjs";
import * as C from "../../fortune-teller-2/build/chars.mjs";
const P = C.PAL;

const FA = `@font-face { font-family: "IRANSans"; src: url('assets/fonts/IRANSans-Black.ttf') format('truetype'); font-weight: 900; }`;
// text: right-aligned when anchor = "end" (x is the right edge), else centred
const tx = (x, y, s, str, { fill = "#fff", anchor = "middle", op = 1, id = "" } = {}) =>
  `<text${id ? ` id="${id}"` : ""} x="${x}" y="${y}" font-family="IRANSans" font-weight="900" font-size="${s}" fill="${fill}" text-anchor="${anchor}" opacity="${op}">${str}</text>`;
const UI = { bg: "#0e1621", bar: "#17212b", inc: "#182533", out: "#2b5278", acc: "#5ea1e6", ok: "#3fb46a", grey: "#7d8b99" };

// her head with a second, smiling mouth that can be switched on
function headX(p) {
  const s = C.girlHead(p, { freckles: true }), k = '<g transform="translate(0,110)">';
  const i = s.indexOf(k) + k.length, j = s.indexOf("</g>", i);
  const smile = `<path d="M -36,-6 C -18,4 18,4 36,-6 C 28,30 -28,30 -36,-6 Z" fill="#6a1e24"/>
    <path d="M -29,-1 C -12,5 12,5 29,-1 L 26,8 C 10,12 -10,12 -26,8 Z" fill="#fff"/>
    <path d="M -36,-6 C -18,4 18,4 36,-6" stroke="${P.lip}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M -32,6 C -20,32 20,32 32,6" stroke="${P.lipLo}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M -40,-12 C -38,-6 -36,-4 -34,-4 M 40,-12 C 38,-6 36,-4 34,-4" stroke="${P.skinDeep}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  return s.slice(0, i) + `<g id="${p}-lips">` + s.slice(i, j) + `</g><g id="${p}-smile" opacity="0">${smile}</g>` + s.slice(j);
}
const smileJs = (p, t, d = 0.3) => `tl.to("#${p}-lips", { opacity: 0, duration: ${d} }, ${t}); tl.to("#${p}-smile", { opacity: 1, duration: ${d} }, ${t});`;
const smileNow = (p) => `tl.set("#${p}-lips", { opacity: 0 }, 0); tl.set("#${p}-smile", { opacity: 1 }, 0);`;

// ── her room at night, sitting up in bed with the phone in both hands (its back to us, its light on her face) ──
function roomSit() {
  return `<rect width="1080" height="1920" fill="#241e36"/>
    <rect x="70" y="200" width="330" height="480" rx="10" fill="#141a33"/><rect x="86" y="216" width="298" height="448" fill="#1c2a52"/>
    <circle cx="300" cy="320" r="46" fill="#e8e2c8"/><rect x="230" y="216" width="10" height="448" fill="#141a33"/><rect x="86" y="430" width="298" height="10" fill="#141a33"/>
    <rect x="720" y="360" width="210" height="270" rx="8" fill="#3a2f4a"/><rect x="738" y="378" width="174" height="234" fill="#5a3a5a"/><circle cx="825" cy="470" r="50" fill="#8a4a6a"/>
    <rect x="110" y="860" width="860" height="560" rx="44" fill="#4a3428"/><rect x="140" y="890" width="800" height="500" rx="30" fill="#3a281e"/>
    <rect x="0" y="1300" width="1080" height="620" fill="#cfc6d8"/>`;
}
function homeGirl(p) {
  return `<g id="${p}-tor">${C.girlBody(p)}</g>${headX(p)}
    <g id="${p}-phone"><rect x="-64" y="318" width="128" height="218" rx="18" fill="#15161b"/><rect x="-58" y="324" width="116" height="206" rx="14" fill="#25262e"/>
      <circle cx="-34" cy="350" r="10" fill="#0a0a0c"/><circle cx="-34" cy="350" r="4" fill="#3a4a6a"/><circle cx="-34" cy="378" r="7" fill="#0a0a0c"/></g>
    <g id="${p}-thL"><ellipse cx="-50" cy="470" rx="16" ry="24" fill="${P.skin}"/></g><g id="${p}-thR"><ellipse cx="50" cy="470" rx="16" ry="24" fill="${P.skinSh}"/></g>
    <circle cx="0" cy="60" r="330" fill="url(#${p}-pg)" style="mix-blend-mode:screen"/>`;
}
const quilt = (y) => `<path d="M -20,${y + 20} C 300,${y - 20} 700,${y + 10} 1100,${y - 10} L 1100,1940 L -20,1940 Z" fill="#6a2a3a"/>
  <path d="M -20,${y + 20} C 300,${y - 20} 700,${y + 10} 1100,${y - 10} L 1100,${y + 50} C 700,${y + 70} 300,${y + 30} -20,${y + 80} Z" fill="#e6e0ea"/>
  ${[...Array(11)].map((_, i) => `<circle cx="${40 + i * 100}" cy="${y + 220}" r="10" fill="#8a3a4a"/>`).join("")}`;
const nightTint = `<rect width="1080" height="1920" fill="#2a1e5a" opacity="0.32" style="mix-blend-mode:multiply"/>`;
// the sitting shot: layers and a start-up script (eyes on the phone)
function sitLayers(id, g, extra = "", y = 760, s = 1.12) {
  return [
    { name: "room", blur: 7, svg: roomSit() },
    { name: "char", defs: `<radialGradient id="${g}-pg"><stop offset="0" stop-color="#bcd4ff" stop-opacity="0.32"/><stop offset="1" stop-color="#bcd4ff" stop-opacity="0"/></radialGradient>`,
      svg: `${place(540, y, s, homeGirl(g), `${g}-all`)}${quilt(1390)}${nightTint}` },
    { name: "ui", svg: extra },
  ];
}
const sitStart = (g, t = 0) => `look("${g}", 0, 10, ${t}, 0.01); eyesOpen("${g}", 0.86, ${t}, 0.01); tl.set("#${g}-head", { y: 8 }, ${t});`;
function typing(g, t0, t1) {
  const n = Math.max(1, Math.floor((t1 - t0) / 0.26));
  return `tl.fromTo("#${g}-thL", { y: 0 }, { y: -16, duration: 0.13, ease: "sine.inOut", yoyo: true, repeat: ${n * 2 - 1} }, ${t0});
    tl.fromTo("#${g}-thR", { y: -16 }, { y: 0, duration: 0.13, ease: "sine.inOut", yoyo: true, repeat: ${n * 2 - 1} }, ${t0});`;
}
const buzz = (g, t) => `tl.fromTo("#${g}-phone", { x: -5 }, { x: 5, duration: 0.05, ease: "none", yoyo: true, repeat: 7 }, ${t}); tl.set("#${g}-phone", { x: 0 }, ${t + 0.4});`;
// a card that pops in (outer group places it, the inner id animates)
const pop = (sel, t, from = { opacity: 0, scale: 0.6 }) => `tl.fromTo("${sel}", Object.assign({ transformOrigin: "50% 50%" }, ${JSON.stringify(from)}), { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.35, ease: "back.out(1.8)", transformOrigin: "50% 50%" }, ${t});`;
const ripple = (id, x, y) => `<circle id="${id}" cx="${x}" cy="${y}" r="10" fill="#fff" opacity="0"/>`;
const rippleJs = (id, t) => `tl.fromTo("#${id}", { attr: { r: 12 }, opacity: 0.7 }, { attr: { r: 70 }, opacity: 0, duration: 0.45, ease: "power2.out", immediateRender: false }, ${t});`;
const check = (x, y, s = 1, c = UI.ok) => `<g transform="translate(${x},${y}) scale(${s})"><circle r="24" fill="${c}"/><path d="M -11,0 L -3,9 L 12,-9" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
const person = (x, y, r, c) => `<g><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x}" cy="${y - r * 0.18}" r="${r * 0.34}" fill="#fff" opacity="0.85"/><path d="M ${x - r * 0.6},${y + r * 0.62} C ${x - r * 0.5},${y + r * 0.2} ${x + r * 0.5},${y + r * 0.2} ${x + r * 0.6},${y + r * 0.62} Z" fill="#fff" opacity="0.85"/></g>`;
const heartP = "M 0,-14 C -10,-30 -36,-28 -36,-6 C -36,12 -16,24 0,38 C 16,24 36,12 36,-6 C 36,-28 10,-30 0,-14 Z";

// ── the phone, seen close, in her hands; the screen is clipped ──
const X0 = 234, X1 = 846, Y0 = 324, Y1 = 1596, SW = X1 - X0;
const phoneDefs = (id) => `<clipPath id="${id}-scr"><rect x="${X0}" y="${Y0}" width="${SW}" height="${Y1 - Y0}" rx="58"/></clipPath>`;
function phoneFrame(id, screen) {
  return `<g transform="translate(150,1700) rotate(30) scale(2.3)"><path d="M -40,0 C -46,-60 -40,-110 -30,-120 L 30,-120 C 44,-100 46,-40 40,0 Z" fill="${P.skin}"/><rect x="-48" y="0" width="96" height="300" fill="#e2d6d0"/></g>
    <g transform="translate(930,1700) rotate(-30) scale(2.3)"><path d="M -40,0 C -46,-60 -40,-110 -30,-120 L 30,-120 C 44,-100 46,-40 40,0 Z" fill="${P.skinSh}"/><rect x="-48" y="0" width="96" height="300" fill="#e2d6d0"/></g>
    <rect x="200" y="290" width="680" height="1340" rx="86" fill="#0d0e12"/><rect x="210" y="300" width="660" height="1320" rx="80" fill="#1a1b20"/>
    <g clip-path="url(#${id}-scr)"><rect x="${X0}" y="${Y0}" width="${SW}" height="${Y1 - Y0}" fill="${UI.bg}"/>${screen}</g>
    <path d="M 260,1500 C 300,1440 340,1430 380,1450 L 360,1640 L 240,1640 Z" fill="${P.skin}"/><path d="M 820,1500 C 780,1440 740,1430 700,1450 L 720,1640 L 840,1640 Z" fill="${P.skinSh}"/>
    <rect width="1080" height="1920" fill="#7a5aff" opacity="0.05" style="mix-blend-mode:screen"/>`;
}
const phoneBg = `<rect width="1080" height="1920" fill="#6a2a3a"/><rect width="1080" height="1920" fill="#0b0d14" opacity="0.55"/>`;
const screenshot = (id, y = Y0) => `<image id="${id}" href="assets/img/hamdel.jpg" x="${X0}" y="${y}" width="${SW}" height="${(SW * 2434 / 1125).toFixed(1)}" preserveAspectRatio="xMidYMin slice"/>`;
// the bot's round avatar, cut from the screenshot (circle centre 560,493 r 523 in the 1125-wide image)
const avatar = (cid, cx, cy, r) => { const s = r / 523; return `<clipPath id="${cid}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
  <image href="assets/img/hamdel.jpg" x="${(cx - 560 * s).toFixed(1)}" y="${(cy - 493 * s).toFixed(1)}" width="${(1125 * s).toFixed(1)}" height="${(2434 * s).toFixed(1)}" clip-path="url(#${cid})"/>`; };
const chatHeader = (id, title, sub) => `<rect x="${X0}" y="${Y0}" width="${SW}" height="120" fill="${UI.bar}"/>
  <path d="M 290,${Y0 + 46} L 272,${Y0 + 64} L 290,${Y0 + 82}" stroke="${UI.acc}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  ${avatar(`${id}-av`, 790, Y0 + 64, 36)}${tx(738, Y0 + 62, 26, title, { anchor: "end" })}${tx(738, Y0 + 96, 20, sub, { anchor: "end", fill: UI.grey })}`;
const bubble = (gid, x, y, w, h, str, fill, size = 26) => `<g><g id="${gid}" opacity="0"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="24" fill="${fill}"/>${tx(x + w / 2, y + h / 2 + size * 0.36, size, str)}</g></g>`;

// ── 12. she reaches the bot, opens it, signs up ─────────────────────────────────────────────────────
function t12(dur) {
  const id = "t12", g = `${id}-g`, A = 2.5;
  const chat = `<g id="${id}-chat" opacity="0">${chatHeader(id, "همدل‌گپ | چت ناشناس", "ربات")}
    ${bubble(`${id}-b1`, 262, 480, 470, 92, "سلام! به همدل‌گپ خوش اومدی", UI.inc)}
    ${bubble(`${id}-b2`, 262, 590, 400, 92, "برای شروع، ثبت‌نام کن", UI.inc)}
    <g><g id="${id}-btn" opacity="0"><rect x="262" y="702" width="556" height="84" rx="20" fill="${UI.out}"/>${tx(540, 755, 32, "ثبت‌نام")}</g></g>
    ${ripple(`${id}-rp`, 540, 744)}</g>`;
  const chip = `<g transform="translate(540,300)"><g id="${id}-chip" opacity="0"><rect x="-250" y="-52" width="500" height="104" rx="52" fill="${UI.bar}" stroke="${UI.ok}" stroke-width="4"/>
    ${check(180, 0, 1.2)}${tx(-30, 14, 36, "ثبت‌نام انجام شد")}</g></g>`;
  return { id, dur, html: scene({ id, dur, bg: "#0b0d14", vignette: 0.7, extraStyle: FA,
    layers: [
      { name: "bg", blur: 18, svg: `<g id="${id}-pbg">${phoneBg}</g>` },
      { name: "phone", defs: phoneDefs(id), svg: `<g id="${id}-pa">${phoneFrame(id, `${screenshot(`${id}-ss`)}${chat}`)}</g>` },
      ...sitLayers(id, g, chip).map((l) => ({ ...l, svg: `<g id="${id}-s-${l.name}" opacity="0">${l.svg}</g>` })),
    ],
    js: `
    cam("phone", { scale: 1.06, y: -10 }, { scale: 1.1, y: -20 }, 0, ${A});
    tl.to("#${id}-ss", { opacity: 0, duration: 0.3 }, 1.1); tl.to("#${id}-chat", { opacity: 1, duration: 0.3 }, 1.1);
    ${pop(`#${id}-b1`, 1.4, { opacity: 0, y: 20 })} ${pop(`#${id}-b2`, 1.7, { opacity: 0, y: 20 })} ${pop(`#${id}-btn`, 1.95, { opacity: 0, y: 20 })}
    ${rippleJs(`${id}-rp`, 2.25)}
    tl.set(["#${id}-pa", "#${id}-pbg"], { opacity: 0 }, ${A}); tl.set(["#${id}-s-room", "#${id}-s-char", "#${id}-s-ui"], { opacity: 1 }, ${A});
    ${sitStart(g, A)} ${typing(g, A + 0.2, dur - 0.3)}
    cam("char", { scale: 1.0 }, { scale: 1.06, y: -20 }, ${A}, ${(dur - A).toFixed(2)}); cam("room", { scale: 1.04 }, { scale: 1.07 }, ${A}, ${(dur - A).toFixed(2)});
    blink("${g}", ${A + 1.2}, 0.26);
    ${pop(`#${id}-chip`, 3.7)}
    ` }) };
}

// ── 13. a selfie, then it goes on her profile ──────────────────────────────────────────────────────
function t13(dur) {
  const id = "t13", g = `${id}-g`, g2 = `${id}-g2`, A = 1.9;
  const camUI = `<rect x="0" y="0" width="1080" height="150" fill="#000" opacity="0.85"/>
    <g fill="none" stroke="#fff" stroke-width="4" opacity="0.9"><path d="M 90,60 L 74,90 L 92,90 L 80,118"/><circle cx="990" cy="76" r="22"/></g>
    <g stroke="#fff" stroke-width="2" opacity="0.25"><path d="M 360,150 L 360,1560 M 720,150 L 720,1560 M 0,620 L 1080,620 M 0,1090 L 1080,1090"/></g>
    <g id="${id}-focus" opacity="0" stroke="#ffd873" stroke-width="5" fill="none"><path d="M 300,420 L 300,380 L 340,380 M 740,380 L 780,380 L 780,420 M 780,1000 L 780,1040 L 740,1040 M 340,1040 L 300,1040 L 300,1000"/></g>
    <rect x="0" y="1560" width="1080" height="360" fill="#000" opacity="0.85"/>
    ${tx(540, 1628, 30, "عکس", { fill: "#ffd873" })}${tx(370, 1628, 28, "ویدیو", { fill: "#fff", op: 0.6 })}${tx(720, 1628, 28, "پرتره", { fill: "#fff", op: 0.6 })}
    <circle cx="540" cy="1760" r="82" fill="none" stroke="#fff" stroke-width="8"/><g transform="translate(540,1760)"><circle id="${id}-shut" r="66" fill="#fff"/></g>
    <rect x="130" y="1715" width="90" height="90" rx="14" fill="#333"/><circle cx="910" cy="1760" r="46" fill="#333"/><path d="M 890,1748 A 24,24 0 1 1 896,1782" stroke="#fff" stroke-width="5" fill="none"/>`;
  const prof = `<g id="${id}-pb" opacity="0"><rect width="1080" height="1920" fill="${UI.bg}"/><rect width="1080" height="190" fill="${UI.bar}"/>
    ${tx(540, 120, 44, "ویرایش پروفایل")}
    <clipPath id="${id}-avc"><circle cx="540" cy="640" r="230"/></clipPath>
    <g transform="translate(540,640)"><g id="${id}-av"><g transform="translate(-540,-640)">
      <circle cx="540" cy="640" r="244" fill="${UI.acc}"/><circle cx="540" cy="640" r="234" fill="${UI.bg}"/>
      <g clip-path="url(#${id}-avc)"><rect x="300" y="400" width="480" height="480" fill="#3a3060"/><circle cx="460" cy="520" r="80" fill="#e8e2c8" opacity="0.4"/>${place(540, 640, 0.95, `<g>${C.girlBody(g2)}</g>${headX(g2)}`)}</g></g></g></g>
    ${tx(540, 960, 34, "عکس پروفایل", { fill: UI.acc })}
    <rect x="120" y="1030" width="840" height="300" rx="28" fill="${UI.bar}"/>
    ${tx(900, 1100, 30, "نام", { anchor: "end", fill: UI.grey })}${tx(900, 1150, 34, "دختری با موهای قرمز", { anchor: "end" })}
    <rect x="160" y="1180" width="760" height="3" fill="#24313f"/>
    ${tx(900, 1240, 30, "بیو", { anchor: "end", fill: UI.grey })}${tx(900, 1292, 34, "دنبال یه همدل…", { anchor: "end" })}
    <g transform="translate(540,1700)"><g id="${id}-toast" opacity="0"><rect x="-220" y="-50" width="440" height="100" rx="50" fill="${UI.bar}" stroke="${UI.ok}" stroke-width="4"/>${check(150, 0, 1.15)}${tx(-30, 14, 36, "ذخیره شد")}</g></g></g>`;
  return { id, dur, html: scene({ id, dur, bg: "#0b0d14", vignette: 0.6, extraStyle: FA,
    layers: [
      { name: "room", blur: 14, svg: `<g id="${id}-pa1">${roomSit()}${nightTint}</g>` },
      { name: "face", defs: `<radialGradient id="${g}-pg"><stop offset="0" stop-color="#bcd4ff" stop-opacity="0.3"/><stop offset="1" stop-color="#bcd4ff" stop-opacity="0"/></radialGradient>`,
        svg: `<g id="${id}-pa2">${place(540, 840, 2.4, `<g id="${g}-tor">${C.girlBody(g)}</g>${headX(g)}<circle cx="0" cy="40" r="320" fill="url(#${g}-pg)" style="mix-blend-mode:screen"/>`, `${g}-all`)}</g>` },
      { name: "camui", svg: `<g id="${id}-pa3">${camUI}</g><rect id="${id}-flash" width="1080" height="1920" fill="#fff" opacity="0"/>` },
      { name: "prof", svg: prof },
    ],
    js: `
    ${smileNow(g)} look("${g}", 0, 0, 0, 0.01); eyesOpen("${g}", 0.92, 0, 0.01); brows("${g}", -6, 0, 0, 0.01);
    tl.fromTo("#${g}-head", { rotation: 0 }, { rotation: -7, transformOrigin: "50% 80%", duration: 0.7, ease: "power2.inOut" }, 0.2);
    cam("face", { scale: 1.0 }, { scale: 1.04 }, 0, ${A}); cam("room", { scale: 1.05 }, { scale: 1.08 }, 0, ${A});
    tl.fromTo("#${id}-focus", { opacity: 0, scale: 1.15, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.3, transformOrigin: "50% 50%" }, 0.5);
    tl.to("#${id}-shut", { scale: 0.82, duration: 0.08, transformOrigin: "50% 50%" }, 1.35); tl.to("#${id}-shut", { scale: 1, duration: 0.12, transformOrigin: "50% 50%" }, 1.45);
    tl.fromTo("#${id}-flash", { opacity: 0 }, { opacity: 0.95, duration: 0.05 }, 1.42); tl.to("#${id}-flash", { opacity: 0, duration: 0.4 }, 1.48);
    tl.set(["#${id}-pa1", "#${id}-pa2", "#${id}-pa3"], { opacity: 0 }, ${A}); tl.set("#${id}-pb", { opacity: 1 }, ${A});
    ${smileNow(g2)} look("${g2}", 0, 0, 0, 0.01); eyesOpen("${g2}", 0.92, 0, 0.01); tl.set("#${g2}-head", { rotation: -7, transformOrigin: "50% 80%" }, 0);
    tl.fromTo("#${id}-av", { scale: 0.4, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.7)", transformOrigin: "50% 50%" }, ${A + 0.15});
    ${pop(`#${id}-toast`, 2.9)}
    ` }) };
}

// ── 14. a few minutes later: requests pop up; she lights up ──────────────────────────────────────────
function t14(dur) {
  const id = "t14", g = `${id}-g`;
  const cols = ["#c0507a", "#4a8ad0", "#d08a3a"];
  const cards = [0, 1, 2].map((i) => { const y = 120 + i * 120; return `<g transform="translate(0,${y})"><g id="${id}-c${i}" opacity="0">
    <rect x="160" y="0" width="760" height="104" rx="28" fill="${UI.bar}" opacity="0.96" stroke="${UI.out}" stroke-width="3"/>
    ${person(856, 52, 36, cols[i])}${tx(796, 46, 30, "درخواست چت جدید", { anchor: "end" })}${tx(796, 84, 22, "کاربر ناشناس", { anchor: "end", fill: UI.grey })}
    <circle cx="214" cy="52" r="14" fill="${UI.ok}"/></g></g>`; }).join("");
  return { id, dur, html: scene({ id, dur, bg: "#0b0d14", vignette: 0.75, extraStyle: FA,
    layers: sitLayers(id, g, cards),
    js: `
    ${sitStart(g)} ${typing(g, 0.1, 1.2)}
    cam("char", { scale: 1.04 }, { scale: 1.1, y: 10 }, 0, ${dur}); cam("room", { scale: 1.05 }, { scale: 1.08 }, 0, ${dur});
    blink("${g}", 0.7, 0.26);
    ${buzz(g, 1.3)}
    ${[0, 1, 2].map((i) => pop(`#${id}-c${i}`, 1.5 + i * 0.38, { opacity: 0, x: 80 })).join(" ")}
    eyesOpen("${g}", 1.12, 1.5, 0.25); brows("${g}", -14, 0, 1.5, 0.3); tl.to("#${g}-head", { y: 0, duration: 0.25 }, 1.5);
    ${smileJs(g, 2.2)} tl.fromTo("#${g}-all", { y: 0 }, { y: -14, duration: 0.16, ease: "sine.out", yoyo: true, repeat: 3 }, 2.3);
    eyesOpen("${g}", 0.9, 2.5, 0.25); blink("${g}", 3.3, 0.24);
    ` }) };
}

// ── 15. she accepts one and starts talking ───────────────────────────────────────────────────────────
function t15(dur) {
  const id = "t15", g = `${id}-g`, A = 1.8;
  const cols = ["#c0507a", "#4a8ad0", "#d08a3a"];
  const rows = [0, 1, 2].map((i) => { const y = 480 + i * 140; return `<g id="${id}-r${i}">
    <rect x="252" y="${y}" width="576" height="120" rx="22" fill="${UI.inc}"/>${person(776, y + 60, 38, cols[i])}
    ${tx(722, y + 54, 26, "کاربر ناشناس", { anchor: "end" })}${tx(722, y + 92, 20, "می‌خواد باهات چت کنه", { anchor: "end", fill: UI.grey })}
    <g id="${id}-acc${i}"><rect x="272" y="${y + 18}" width="120" height="44" rx="22" fill="${UI.ok}"/>${tx(332, y + 50, 22, "قبول")}</g>
    <rect x="272" y="${y + 68}" width="120" height="36" rx="18" fill="#2a3644"/>${tx(332, y + 94, 18, "رد", { fill: UI.grey })}</g>`; }).join("");
  const scr = `${chatHeader(id, "درخواست‌ها", "۳ درخواست جدید")}${rows}<g id="${id}-ok" opacity="0">${check(332, 520, 1)}</g>${ripple(`${id}-rp`, 332, 520)}`;
  const chat = `${bubble(`${id}-m1`, 120, 130, 420, 96, "سلام! خوبی؟", UI.inc, 32)}
    ${bubble(`${id}-m2`, 460, 246, 500, 96, "مرسی، تو چطوری؟", UI.out, 32)}
    <g><g id="${id}-m3" opacity="0"><rect x="120" y="362" width="200" height="90" rx="24" fill="${UI.inc}"/>
      ${[0, 1, 2].map((k) => `<circle id="${id}-d${k}" cx="${180 + k * 40}" cy="407" r="10" fill="${UI.grey}"/>`).join("")}</g></g>`;
  return { id, dur, html: scene({ id, dur, bg: "#0b0d14", vignette: 0.7, extraStyle: FA,
    layers: [
      { name: "bg", blur: 18, svg: `<g id="${id}-pbg">${phoneBg}</g>` },
      { name: "phone", defs: phoneDefs(id), svg: `<g id="${id}-pa">${phoneFrame(id, scr)}</g>` },
      ...sitLayers(id, g, chat).map((l) => ({ ...l, svg: `<g id="${id}-s-${l.name}" opacity="0">${l.svg}</g>` })),
    ],
    js: `
    cam("phone", { scale: 1.06, y: -10 }, { scale: 1.12, y: -30 }, 0, ${A});
    ${rippleJs(`${id}-rp`, 1.05)} tl.to("#${id}-acc0", { opacity: 0, duration: 0.15 }, 1.15); tl.to("#${id}-ok", { opacity: 1, duration: 0.15 }, 1.15);
    tl.to(["#${id}-r1", "#${id}-r2"], { opacity: 0.25, duration: 0.3 }, 1.3);
    tl.set(["#${id}-pa", "#${id}-pbg"], { opacity: 0 }, ${A}); tl.set(["#${id}-s-room", "#${id}-s-char", "#${id}-s-ui"], { opacity: 1 }, ${A});
    ${sitStart(g, A)} ${smileJs(g, A + 0.5)} ${typing(g, A + 0.1, dur - 0.2)}
    cam("char", { scale: 1.0 }, { scale: 1.06, y: -14 }, ${A}, ${(dur - A).toFixed(2)}); cam("room", { scale: 1.04 }, { scale: 1.07 }, ${A}, ${(dur - A).toFixed(2)});
    ${pop(`#${id}-m1`, A + 0.15, { opacity: 0, y: 30 })} ${pop(`#${id}-m2`, A + 0.8, { opacity: 0, y: 30 })} ${pop(`#${id}-m3`, A + 1.4, { opacity: 0, y: 30 })}
    ${[0, 1, 2].map((k) => `tl.fromTo("#${id}-d${k}", { y: 0 }, { y: -10, duration: 0.2, ease: "sine.inOut", yoyo: true, repeat: 3 }, ${(A + 1.5 + k * 0.1).toFixed(2)});`).join(" ")}
    blink("${g}", ${A + 1.0}, 0.24);
    ` }) };
}

// ── 16. lying in bed, happy; a daydream: the two of them in a hug ────────────────────────────────────
function t16(dur) {
  const id = "t16", g = `${id}-g`;
  const puffs = [[540, 430, 190], [370, 470, 150], [710, 470, 150], [440, 330, 150], [650, 330, 150], [260, 540, 100], [820, 540, 100], [540, 570, 150]];
  const cloud = (f, o = 1) => puffs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" opacity="${o}"/>`).join("");
  const boyHead = `<g transform="translate(600,330)"><path d="M -40,60 L -40,110 L 40,110 L 40,60 Z" fill="#c98a64"/>
    <ellipse cx="0" cy="0" rx="74" ry="86" fill="#e2a47e"/><path d="M -78,-6 C -90,-90 -20,-122 30,-108 C 80,-96 98,-50 80,-4 C 70,-40 40,-60 0,-58 C -40,-60 -64,-40 -78,-6 Z" fill="#4a2a1a"/>
    <path d="M -40,8 C -32,0 -20,0 -12,8 M 12,8 C 20,0 32,0 40,8" stroke="#2a160c" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M -20,42 C -8,54 8,54 20,42" stroke="#8a3a2a" stroke-width="5" fill="none" stroke-linecap="round"/>
    <ellipse cx="-40" cy="30" rx="14" ry="8" fill="#e9776a" opacity="0.4"/><ellipse cx="40" cy="30" rx="14" ry="8" fill="#e9776a" opacity="0.4"/></g>`;
  const couple = `<path d="M 380,520 C 400,440 480,420 600,420 C 720,420 800,440 820,520 L 840,720 L 360,720 Z" fill="#3a6ab0"/>${boyHead}
    <g transform="rotate(-6 480 480)">${place(480, 480, 0.42, C.girlBack(`${id}-gb`))}</g>
    <path d="M 360,560 C 400,600 470,620 540,600 L 548,628 C 470,650 390,630 350,590 Z" fill="#3a6ab0"/><ellipse cx="548" cy="612" rx="22" ry="18" fill="#e2a47e"/>
    <path d="M 820,540 C 760,600 680,620 610,600 L 604,628 C 690,650 770,620 830,570 Z" fill="#2f5a9a"/><ellipse cx="606" cy="612" rx="22" ry="18" fill="#d8946e"/>`;
  const hearts = [[300, 300, 0.7], [800, 280, 0.9], [760, 640, 0.6], [330, 650, 0.8]].map(([x, y, s], i) => `<g transform="translate(${x},${y}) scale(${s})"><path id="${id}-h${i}" d="${heartP}" fill="#ff5a7a" opacity="0"/></g>`).join("");
  return { id, dur, html: scene({ id, dur, fadeIn: true, bg: "#14101c", vignette: 0.8,
    layers: [
      { name: "bed", svg: `<rect width="1080" height="1920" fill="#cfc6d8"/>
        <path d="M 170,920 C 170,860 910,860 910,920 L 910,1210 C 910,1270 170,1270 170,1210 Z" fill="#e6e0ea"/>
        ${place(540, 1070, 0.9, `<path d="M -190,-90 C -220,-260 220,-260 190,-90 C 210,0 200,90 170,130 C 100,170 -100,170 -170,130 C -200,90 -210,0 -190,-90 Z" fill="${P.hair}"/><g id="${g}-tor">${C.girlBody(g)}</g>${headX(g)}`)}
        ${quilt(1440)}
        ${[0, 1, 2, 3].map((i) => `<path d="M ${-200 + i * 190},0 L ${-60 + i * 190},0 L ${560 + i * 190},1920 L ${420 + i * 190},1920 Z" fill="#9fb8ff" opacity="0.06"/>`).join("")}${nightTint}` },
      { name: "dream", defs: `<clipPath id="${id}-cc">${cloud("#fff")}</clipPath>${glow(`${id}-pk`, 540, 450, 360, "#ff9ac0", 0.55)}`, svg: `
        <g transform="translate(585,795)"><circle id="${id}-tr0" r="18" fill="#f4f0ff" opacity="0"/></g>
        <g transform="translate(615,742)"><circle id="${id}-tr1" r="28" fill="#f4f0ff" opacity="0"/></g>
        <g transform="translate(540,450)"><g id="${id}-cl" opacity="0"><g transform="translate(-540,-450)">
          ${cloud("#000", 0.25).replace(/cy="(\d+)"/g, (m, v) => `cy="${+v + 14}"`)}${cloud("#f4f0ff")}
          <g clip-path="url(#${id}-cc)"><rect x="0" y="100" width="1080" height="700" fill="url(#${id}-pk)"/>${couple}</g></g></g></g>
        ${hearts}` },
    ],
    js: `
    ${smileNow(g)} look("${g}", 0, -6, 0, 0.01); eyesOpen("${g}", 0.84, 0, 0.01); brows("${g}", -6, 0, 0, 0.01);
    cam("bed", { scale: 1.08, y: 60 }, { scale: 1.0, y: 0 }, 0, ${dur});
    tl.fromTo("#${g}-tor", { scaleY: 1 }, { scaleY: 1.015, transformOrigin: "50% 0%", duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: 3 }, 0);
    blink("${g}", 1.0, 0.3);
    tl.fromTo("#${id}-tr0", { opacity: 0, scale: 0, transformOrigin: "50% 50%" }, { opacity: 0.95, scale: 1, duration: 0.25, ease: "back.out(2)", transformOrigin: "50% 50%" }, 1.6);
    tl.fromTo("#${id}-tr1", { opacity: 0, scale: 0, transformOrigin: "50% 50%" }, { opacity: 0.95, scale: 1, duration: 0.25, ease: "back.out(2)", transformOrigin: "50% 50%" }, 1.8);
    tl.fromTo("#${id}-cl", { opacity: 0, scale: 0.3, transformOrigin: "50% 90%" }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)", transformOrigin: "50% 90%" }, 2.0);
    cam("dream", { scale: 1.0 }, { scale: 1.05, origin: "540px 450px" }, 2.0, ${(dur - 2).toFixed(2)});
    ${[0, 1, 2, 3].map((i) => `tl.fromTo("#${id}-h${i}", { opacity: 0, y: 30, scale: 0.5, transformOrigin: "50% 50%" }, { opacity: 0.9, y: -40, scale: 1, duration: 1.6, ease: "sine.out", transformOrigin: "50% 50%" }, ${(2.7 + i * 0.35).toFixed(2)}); tl.to("#${id}-h${i}", { opacity: 0, duration: 0.6 }, ${(4.3 + i * 0.35).toFixed(2)});`).join(" ")}
    look("${g}", 4, -9, 2.2, 0.6); eyesOpen("${g}", 0.7, 3.4, 0.6); blink("${g}", 4.6, 0.4);
    ` }) };
}

// ── 17. the call to action: the bot's page, the link in the bio, like and comment «گپ» ───────────────
function t17(dur) {
  const id = "t17", A = 4.5, B = 6.4;
  const s1 = `<g id="${id}-s1">${screenshot(`${id}-ss`)}<rect id="${id}-hl" x="280" y="1158" width="236" height="58" rx="14" fill="none" stroke="#ffd873" stroke-width="5" opacity="0"/></g>`;
  const s2 = `<g id="${id}-s2" opacity="0"><rect x="${X0}" y="${Y0}" width="${SW}" height="1272" fill="${UI.bg}"/>
    <circle cx="540" cy="560" r="128" fill="none" stroke="#a05aff" stroke-width="6"/>${avatar(`${id}-av2`, 540, 560, 118)}
    ${tx(540, 750, 38, "همدل‌گپ")}${tx(540, 800, 26, "چت ناشناس، پیدا کردن هم‌صحبت", { fill: UI.grey })}
    <g transform="translate(540,900)"><g id="${id}-link"><rect x="-230" y="-42" width="460" height="84" rx="42" fill="#1b2b40" stroke="${UI.acc}" stroke-width="4"/>
      <text x="16" y="12" font-family="sans-serif" font-weight="700" font-size="32" fill="${UI.acc}" text-anchor="middle">t.me/HamdelGapBot</text>
      <g transform="translate(-196,0)" stroke="${UI.acc}" stroke-width="5" fill="none"><rect x="-14" y="-8" width="20" height="16" rx="8"/><rect x="0" y="-8" width="20" height="16" rx="8"/></g></g></g>
    <g transform="translate(540,1060)"><g id="${id}-arrow">${tx(0, 70, 36, "لینک تو بایو", { fill: "#ffd873" })}<path d="M 0,-8 L -26,22 M 0,-8 L 26,22 M 0,-8 L 0,36" stroke="#ffd873" stroke-width="7" fill="none" stroke-linecap="round"/></g></g></g>`;
  const IMG = 612, sImg = IMG / 760;
  const s3 = `<g id="${id}-s3" opacity="0"><rect x="${X0}" y="${Y0}" width="${SW}" height="1272" fill="${UI.bg}"/>
    <rect x="${X0}" y="${Y0}" width="${SW}" height="96" fill="${UI.bar}"/>${tx(540, Y0 + 62, 30, "پست")}
    <clipPath id="${id}-sq"><rect x="${X0}" y="420" width="${IMG}" height="${IMG}"/></clipPath>
    <image href="assets/img/hamdel.jpg" x="${(X0 - 210 * sImg).toFixed(1)}" y="${(420 - 215 * sImg).toFixed(1)}" width="${(1125 * sImg).toFixed(1)}" height="${(2434 * sImg).toFixed(1)}" clip-path="url(#${id}-sq)"/>
    <g transform="translate(540,726)"><path id="${id}-bigh" d="${heartP}" fill="#fff" opacity="0" transform="scale(3)"/></g>
    <g transform="translate(800,1080)"><path d="${heartP}" fill="none" stroke="#fff" stroke-width="5" transform="scale(0.72)"/><g id="${id}-hr" opacity="0"><path d="${heartP}" fill="#ff3b5c" transform="scale(0.72)"/></g></g>
    <g transform="translate(720,1080)"><path d="M -22,16 A 26,26 0 1 1 -12,22 L -26,30 Z" fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="round"/></g>
    <g transform="translate(640,1080)"><path d="M 26,-22 L -26,0 L -4,6 L 4,26 Z M -4,6 L 26,-22" fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="round"/></g>
    ${tx(830, 1150, 26, "۲٬۴۸۰ لایک", { anchor: "end", id: `${id}-l0` })}${tx(830, 1150, 26, "۲٬۴۸۱ لایک", { anchor: "end", id: `${id}-l1`, op: 0 })}
    ${ripple(`${id}-rp1`, 800, 1086)}${ripple(`${id}-rp2`, 720, 1080)}
    <g id="${id}-sheet" transform="translate(0,900)"><rect x="${X0}" y="720" width="${SW}" height="900" rx="34" fill="${UI.bar}"/>
      <rect x="500" y="738" width="80" height="8" rx="4" fill="#3a4a5a"/>${tx(540, 800, 30, "کامنت‌ها")}
      ${[["#c0507a", "گپ"], ["#4a8ad0", "گپ 💛".replace(" 💛", "!")]].map(([c, t], i) => `${person(790, 870 + i * 96, 30, c)}${tx(744, 862 + i * 96, 22, "کاربر", { anchor: "end", fill: UI.grey })}${tx(744, 898 + i * 96, 30, t, { anchor: "end" })}`).join("")}
      <g id="${id}-mine" opacity="0">${person(790, 1062, 30, "#d08a3a")}${tx(744, 1054, 22, "شما · همین الان", { anchor: "end", fill: UI.grey })}${tx(744, 1092, 30, "گپ", { anchor: "end" })}
        <g transform="translate(300,1066)"><path d="${heartP}" fill="#ff3b5c" transform="scale(0.4)"/></g></g>
      <rect x="258" y="1180" width="564" height="80" rx="40" fill="${UI.bg}" stroke="${UI.out}" stroke-width="3"/>
      ${tx(760, 1232, 26, "کامنت بنویس…", { anchor: "end", fill: UI.grey, id: `${id}-ph` })}
      ${tx(760, 1234, 32, "گـ", { anchor: "end", id: `${id}-k1`, op: 0 })}${tx(760, 1234, 32, "گپ", { anchor: "end", id: `${id}-k2`, op: 0 })}
      <circle cx="302" cy="1220" r="30" fill="${UI.acc}"/><path d="M 290,1220 L 314,1220 M 304,1210 L 314,1220 L 304,1230" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      ${ripple(`${id}-rp3`, 302, 1220)}</g></g>`;
  return { id, dur, html: scene({ id, dur, bg: "#0b0d14", vignette: 0.7, fadeOut: true, extraStyle: FA,
    layers: [
      { name: "bg", blur: 18, svg: phoneBg },
      { name: "phone", defs: phoneDefs(id), svg: phoneFrame(id, `${s1}${s2}${s3}`) },
    ],
    js: `
    cam("bg", { scale: 1.04 }, { scale: 1.08 }, 0, ${dur});
    cam("phone", { scale: 1.0, y: 10 }, { scale: 1.08, y: -40 }, 0, ${dur});
    tl.fromTo("#${id}-ss", { attr: { y: ${Y0 + 30} } }, { attr: { y: ${Y0} } , duration: 0.6, ease: "power2.out" }, 0.1);
    tl.fromTo("#${id}-hl", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 3.3);
    tl.to("#${id}-hl", { opacity: 0.3, duration: 0.25, yoyo: true, repeat: 3 }, 3.6);
    tl.set("#${id}-s1", { opacity: 0 }, ${A}); tl.set("#${id}-s2", { opacity: 1 }, ${A});
    ${pop(`#${id}-link`, A + 0.2)}
    tl.fromTo("#${id}-arrow", { y: 0 }, { y: -18, duration: 0.3, ease: "sine.inOut", yoyo: true, repeat: 5 }, ${A + 0.3});
    tl.set("#${id}-s2", { opacity: 0 }, ${B}); tl.set("#${id}-s3", { opacity: 1 }, ${B});
    ${rippleJs(`${id}-rp1`, 7.3)}
    tl.fromTo("#${id}-hr", { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(3)", transformOrigin: "50% 50%" }, 7.35);
    tl.fromTo("#${id}-bigh", { opacity: 0 }, { opacity: 0.92, duration: 0.15 }, 7.35); tl.to("#${id}-bigh", { opacity: 0, duration: 0.4 }, 7.9);
    tl.set("#${id}-l0", { opacity: 0 }, 7.4); tl.set("#${id}-l1", { opacity: 1 }, 7.4);
    ${rippleJs(`${id}-rp2`, 8.45)}
    tl.fromTo("#${id}-sheet", { attr: { transform: "translate(0,900)" } }, { attr: { transform: "translate(0,0)" }, duration: 0.45, ease: "power3.out" }, 8.6);
    tl.set("#${id}-ph", { opacity: 0 }, 9.4); tl.set("#${id}-k1", { opacity: 1 }, 9.45); tl.set("#${id}-k1", { opacity: 0 }, 9.7); tl.set("#${id}-k2", { opacity: 1 }, 9.7);
    ${rippleJs(`${id}-rp3`, 10.15)}
    tl.set("#${id}-k2", { opacity: 0 }, 10.3); tl.set("#${id}-ph", { opacity: 1 }, 10.3);
    ${pop(`#${id}-mine`, 10.3, { opacity: 0, y: 20 })}
    ` }) };
}

const DURS = { t12: 5.0, t13: 4.0, t14: 4.0, t15: 4.0, t16: 6.0, t17: 11.5 };
export default [t12(DURS.t12), t13(DURS.t13), t14(DURS.t14), t15(DURS.t15), t16(DURS.t16), t17(DURS.t17)];
