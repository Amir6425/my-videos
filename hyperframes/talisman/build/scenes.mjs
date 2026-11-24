// The talisman: a young woman pleads with an old fortune-teller; he reads her palm, writes a few words, folds the
// paper into her hand; she leaves into the light. Nobody speaks: mouths stay closed; a narrator tells it.
import { scene, place, glow } from "./lib.mjs";
import * as C from "../../fortune-teller-2/build/chars.mjs";
import { roomBehindGirl, roomBehindMan, table, crystalBall, candle, DEFS, light, R } from "../../fortune-teller-2/build/scene1.mjs";
import { taxi, buildings } from "../../fortune-teller/build/scene2.mjs";
const P = C.PAL;

const girl = (p) => `<g id="${p}-tor">${C.girlBody(p, { coat: true })}</g>${C.girlHead(p, { freckles: true })}`;
const oldMan = (p) => C.manBody(p) + C.manHead(p, { gem: true });
const flick = (sel, dur) => `flicker("${sel}", ${dur}, 0.75, 0.15);`;
const flickers = (id, dur) => `flicker("#${id}-ca-halo", ${dur}, 0.75, 0.15); flicker("#${id}-cb-halo", ${dur}, 0.7, 0.18); flicker("#${id}-cc-halo", ${dur}, 0.75, 0.14); flicker("#${id}-light", ${dur}, 0.85, 0.08);`;
const uniq = (shot) => ({ ...shot, html: shot.html.replace(/(id="|url\(#)(halo|purpleGlow|ballFill|nightsky|runnerPat)\b/g, `$1${shot.id}-$2`) });

// hands seen from above: hers (pale, red coat sleeve) reach up from the bottom; his (old, dark robe) come down from the top
const herHand = (palmUp = false) => `<g><rect x="-60" y="0" width="120" height="520" fill="#8e1a1e"/><rect x="-62" y="0" width="124" height="26" fill="#7a1418"/>
  <path d="M -44,-6 C -50,-60 -48,-104 -38,-124 L -42,-196 C -43,-212 -24,-214 -22,-198 L -16,-136 L -14,-212 C -14,-230 6,-230 6,-212 L 8,-136 L 16,-206 C 17,-222 36,-221 36,-204 L 28,-132 L 40,-182 C 43,-198 60,-194 57,-178 L 46,-112 C 58,-98 76,-102 88,-126 C 96,-142 114,-134 106,-116 C 92,-82 68,-50 46,-28 L 46,10 L -44,10 Z" fill="${palmUp ? P.skin : P.skinSh}"/>
  ${palmUp ? `<g stroke="${P.skinDeep}" stroke-width="3" fill="none" stroke-linecap="round" id="LINES"><path d="M -30,-40 C -10,-52 14,-50 30,-38"/><path d="M -34,-70 C -12,-78 14,-80 36,-72"/><path d="M 26,-14 C 0,-30 -16,-54 -14,-90"/></g>` : ""}</g>`;
const hisHand = (palmUp = true) => `<g><rect x="-66" y="-560" width="132" height="560" fill="#3a2214"/><rect x="-70" y="-40" width="140" height="40" fill="#e4d0ae"/>
  <path d="M -50,0 C -58,60 -56,110 -46,132 L -50,212 C -51,230 -30,232 -28,214 L -20,146 L -18,228 C -18,248 4,248 4,228 L 6,148 L 16,222 C 17,240 38,239 38,220 L 30,144 L 44,198 C 47,216 66,212 63,194 L 50,120 C 64,106 84,110 98,136 C 106,154 126,146 118,126 C 102,88 76,52 52,28 L 52,-10 L -50,-10 Z" fill="${palmUp ? P.mSkin : P.mSkinSh}"/>
  ${palmUp ? `<g stroke="${P.mSkinDeep}" stroke-width="3" fill="none" opacity="0.6"><path d="M -34,50 C -10,62 16,60 34,48"/><path d="M 30,20 C 4,36 -14,64 -12,100"/></g>` : ""}
  <circle cx="34" cy="186" r="14" fill="#c9a24a"/><circle cx="34" cy="186" r="8" fill="#5a1a4a"/></g>`;

// ── shot 2: close on her, pleading; he watches, silent ──────────────────────────────────────────────
function t2(dur) {
  const id = "t2", g = `${id}-g`, m = `${id}-m`;
  return { id, dur, html: scene({ id, dur, fadeIn: true, bg: R.wall, vignette: 0.8,
    layers: [
      { name: "bg", blur: 9, svg: roomBehindGirl(id) },
      { name: "char", svg: `${place(540, 840, 1.45, girl(g), `${g}-all`)}${table(1560)}${crystalBall(`${id}-ball`, 150, 1720, 110)}${light(id)}` },
      { name: "fg", blur: 14, svg: place(1080, 980, 1.25, C.manBackSide(m)) },
    ],
    js: `${flickers(id, dur)} flicker("#${id}-ball-glow", ${dur}, 0.85, 0.12);
    cam("bg", { scale: 1.06 }, { scale: 1.1 }, 0, ${dur}); cam("char", { scale: 1.0 }, { scale: 1.06, y: -14 }, 0, ${dur}); cam("fg", { scale: 1.0 }, { scale: 1.04, x: 14 }, 0, ${dur});
    look("${g}", 8, 1, 0, 0.01); brows("${g}", -13, -12, 0, 0.01); eyesOpen("${g}", 1.08, 0, 0.01);
    tl.fromTo("#${g}-tor", { y: 0 }, { y: -7, duration: 1.0, ease: "sine.inOut", yoyo: true, repeat: ${Math.floor(dur) - 1} }, 0);
    tl.fromTo("#${g}-head", { rotation: 0 }, { rotation: -3, transformOrigin: "50% 90%", duration: ${(dur * 0.8).toFixed(2)}, ease: "sine.inOut" }, 0.2);
    blink("${g}", 1.4, 0.28); brows("${g}", -16, -14, 2.0, 0.5); blink("${g}", 3.2, 0.3);
    ${[0, 1, 2, 3].map((k) => `tl.to("#${g}-hands", { scaleX: 0.95, transformOrigin: "50% 60%", duration: 0.35, ease: "power2.inOut" }, ${(0.5 + k * 0.9).toFixed(2)}); tl.to("#${g}-hands", { scaleX: 1, transformOrigin: "50% 60%", duration: 0.35 }, ${(0.9 + k * 0.9).toFixed(2)});`).join(" ")}
    ` }) };
}

// ── shot 3: his open palm comes over the table; she hesitates, then lays her hand on it ─────────────
function t3(dur) {
  const id = "t3";
  return { id, dur, html: scene({ id, dur, bg: "#1a0c14", vignette: 0.85,
    layers: [{ name: "table", defs: DEFS + glow(`${id}-cg`, 900, 380, 700, "#ffb24a", 0.55), svg: `
      <rect width="1080" height="1920" fill="${R.runner}"/><rect width="1080" height="1920" fill="url(#runnerPat)"/>
      <rect id="${id}-cglow" width="1080" height="1920" fill="url(#${id}-cg)" style="mix-blend-mode:screen"/>
      <g transform="translate(900,420) scale(1.3)">${candle(`${id}-cn`, 0, 0, 160, 44)}</g>
      <g transform="translate(560,0)"><g id="${id}-his" transform="translate(0,-400)">${hisHand(true)}</g></g>
      <g transform="translate(520,0)"><g id="${id}-her" transform="translate(0,2300)">${herHand(false)}</g></g>
      <rect width="1080" height="1920" fill="#2a0a20" opacity="0.25" style="mix-blend-mode:multiply"/>` }],
    js: `
    flicker("#${id}-cglow", ${dur}, 0.85, 0.15); flicker("#${id}-cn-halo", ${dur}, 0.8, 0.15);
    cam("table", { scale: 1.0, origin: "540px 1000px" }, { scale: 1.12, origin: "540px 1000px" }, 0, ${dur});
    tl.fromTo("#${id}-his", { attr: { transform: "translate(0,-400)" } }, { attr: { transform: "translate(0,760)" }, duration: 1.4, ease: "power2.out" }, 0.3);
    tl.fromTo("#${id}-her", { attr: { transform: "translate(0,2300)" } }, { attr: { transform: "translate(0,1560)" }, duration: 0.9, ease: "power2.out" }, 1.7);
    tl.to("#${id}-her", { attr: { transform: "translate(0,1680)" }, duration: 0.5, ease: "sine.inOut" }, 2.6);
    tl.to("#${id}-her", { attr: { transform: "translate(-10,1140) rotate(4)" }, duration: 1.1, ease: "power2.inOut" }, 3.2);
    ` }) };
}

// ── shot 4: the brass magnifying glass over her palm; then his brows slowly knit ────────────────────
function t4(dur) {
  const id = "t4", m = `${id}-m`, cut = (dur * 0.5).toFixed(2);
  const palm = `<g transform="translate(540,1350) scale(2.4)">${herHand(true).replace('id="LINES"', `id="${id}-lines"`)}</g>`;
  return { id, dur, html: scene({ id, dur, bg: "#1a0c14", vignette: 0.85,
    layers: [
      { name: "palm", defs: DEFS + glow(`${id}-cg`, 900, 380, 700, "#ffb24a", 0.5) + `<clipPath id="${id}-lens"><circle id="${id}-lc" cx="560" cy="1150" r="150"/></clipPath>`, svg: `
        <rect width="1080" height="1920" fill="${R.runner}"/><rect width="1080" height="1920" fill="url(#runnerPat)"/>
        <rect id="${id}-cglow" width="1080" height="1920" fill="url(#${id}-cg)" style="mix-blend-mode:screen"/>
        <g transform="translate(560,1700)">${hisHand(true).replace('<rect x="-66" y="-560"', '<rect x="-66" y="-560" opacity="0"')}</g>
        ${palm}
        <g clip-path="url(#${id}-lens)"><g id="${id}-zoom" transform="translate(560,1150) scale(1.6) translate(-560,-1150)">${palm}</g><rect width="1080" height="1920" fill="#fff8e0" opacity="0.08"/></g>
        <g id="${id}-mag"><circle id="${id}-ring" cx="560" cy="1150" r="150" fill="none" stroke="#b8902e" stroke-width="22"/><circle cx="560" cy="1150" r="138" fill="none" stroke="#e6c46a" stroke-width="4" opacity="0.6"/>
          <path d="M 666,1256 L 860,1450" stroke="#5a3418" stroke-width="40" stroke-linecap="round"/><path d="M 666,1256 L 700,1290" stroke="#b8902e" stroke-width="44"/>
          <path d="M 470,1060 C 500,1030 540,1020 580,1024" stroke="#fff" stroke-width="8" fill="none" opacity="0.4" stroke-linecap="round"/></g>` },
      { name: "face", svg: `<g id="${id}-cu" opacity="0">${roomBehindMan(id)}${place(540, 820, 1.7, oldMan(m), `${m}-all`)}${light(id, "right")}</g>` },
    ],
    js: `
    flicker("#${id}-cglow", ${dur}, 0.85, 0.15);
    cam("palm", { scale: 1.0, origin: "540px 1150px" }, { scale: 1.1, origin: "540px 1150px" }, 0, ${cut});
    (function () { const lc = document.getElementById("${id}-lc"), mg = document.getElementById("${id}-mag"), zm = document.getElementById("${id}-zoom"); const o = { t: 0 };
      tl.fromTo(o, { t: 0 }, { t: 1, duration: ${cut}, ease: "sine.inOut", onUpdate() {
        const x = 560 - 90 * Math.sin(o.t * 3.1), y = 1150 + 80 * Math.sin(o.t * 2.2 + 0.5);
        lc.setAttribute("cx", x.toFixed(1)); lc.setAttribute("cy", y.toFixed(1));
        mg.setAttribute("transform", "translate(" + (x - 560).toFixed(1) + "," + (y - 1150).toFixed(1) + ")");
        zm.setAttribute("transform", "translate(" + x.toFixed(1) + "," + y.toFixed(1) + ") scale(1.6) translate(" + (-x).toFixed(1) + "," + (-y).toFixed(1) + ")"); } }, 0); })();
    tl.set("#${id}-cu", { opacity: 1 }, ${cut});
    ${flickers(id, dur)}
    look("${m}", -2, 7, 0, 0.01); brows("${m}", 0, 0, 0, 0.01);
    cam("face", { scale: 1.0, origin: "540px 760px" }, { scale: 1.12, origin: "540px 760px" }, ${cut}, ${(dur - cut).toFixed(2)});
    brows("${m}", 10, 12, ${(+cut + 0.4).toFixed(2)}, 1.8, "sine.inOut");
    tl.to(["#${m}-eyeL-lid", "#${m}-eyeR-lid"], { y: 4, duration: 1.6, ease: "sine.inOut" }, ${(+cut + 0.5).toFixed(2)});
    look("${m}", 1, 9, ${(+cut + 1.2).toFixed(2)}, 0.6);
    ` }) };
}

// ── shot 5: he writes on a small aged paper turned away from us, folds it twice, hands it over ──────
function t5(dur) {
  const id = "t5", m = `${id}-m`;
  return { id, dur, html: scene({ id, dur, bg: R.wall, vignette: 0.82,
    layers: [
      { name: "bg", blur: 7, svg: roomBehindMan(id) },
      { name: "char", svg: `${place(560, 640, 0.98, oldMan(m), `${m}-all`)}${table(1600)}
        <g transform="translate(560,1480)"><g id="${id}-paper">
          <path id="${id}-sheet" d="M -170,-150 L 170,-150 L 200,120 L -200,120 Z" fill="#c8b48a"/>
          <path d="M -170,-150 L 170,-150 L 200,120 L -200,120 Z" fill="#6a4a2a" opacity="0.15"/>
          <g id="${id}-quill"><path d="M 120,-120 C 160,-260 230,-360 300,-420 C 250,-330 200,-230 140,-110 Z" fill="#efe8da"/><path d="M 120,-120 L 300,-420" stroke="#a89a84" stroke-width="3"/><path d="M 112,-104 L 124,-128 L 132,-116 Z" fill="#1a1a1a"/></g>
          <g transform="translate(150,-60) rotate(-20)"><path d="M -40,0 C -50,-40 -40,-70 -10,-74 L 40,-60 C 54,-40 50,10 30,24 L -20,24 Z" fill="${P.mSkin}"/><rect x="-40" y="20" width="80" height="140" fill="#3a2214"/></g>
        </g></g>
        <g id="${id}-take" transform="translate(560,2300)"><g transform="scale(1.4)">${herHand(false)}</g></g>
        ${light(id, "right")}` },
    ],
    js: `${flickers(id, dur)}
    cam("bg", { scale: 1.06 }, { scale: 1.09 }, 0, ${dur}); cam("char", { scale: 1.0, origin: "540px 1300px" }, { scale: 1.1, origin: "540px 1300px" }, 0, ${dur});
    look("${m}", 0, 9, 0, 0.01); tl.set(["#${m}-eyeL-lid", "#${m}-eyeR-lid"], { y: 3 }, 0);
    ${[...Array(8)].map((_, k) => `tl.to("#${id}-quill", { x: ${-100 + (k % 4) * 60}, y: ${(k % 2) * 10 + Math.floor(k / 4) * 50}, rotation: ${(k % 2) * 4}, svgOrigin: "120 -120", duration: 0.22, ease: "sine.inOut" }, ${(0.4 + k * 0.24).toFixed(2)});`).join(" ")}
    tl.to("#${id}-quill", { opacity: 0, duration: 0.2 }, 2.4);
    tl.to("#${id}-sheet", { attr: { d: "M -170,-150 L 170,-150 L 185,-15 L -185,-15 Z" }, duration: 0.35, ease: "power2.inOut" }, 2.6);
    tl.to("#${id}-sheet", { attr: { d: "M -85,-150 L 85,-150 L 92,-15 L -92,-15 Z" }, duration: 0.35, ease: "power2.inOut" }, 3.05);
    tl.to("#${id}-paper", { y: 260, scale: 1.25, duration: 0.8, ease: "power2.inOut" }, 3.6);
    tl.fromTo("#${id}-take", { attr: { transform: "translate(560,2300)" } }, { attr: { transform: "translate(560,1900)" }, duration: 0.6, ease: "power2.out" }, 4.0);
    look("${m}", -4, 4, 3.6, 0.4);
    ` }) };
}

// ── shot 6: she holds the paper, stands, glances back once, and walks out through the door into light
function t6(dur) {
  const id = "t6", g = `${id}-g`, b = `${id}-b`;
  return { id, dur, html: scene({ id, dur, bg: R.wall, vignette: 0.82, fadeOut: true,
    layers: [{ name: "room", defs: DEFS + `<linearGradient id="${id}-day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4d6"/><stop offset="1" stop-color="#ffd890"/></linearGradient>` + glow(`${id}-spill`, 540, 900, 900, "#ffe8b0", 0.0), svg: `
      ${roomBehindGirl(id)}
      <g transform="translate(540,0)"><path d="M -170,1300 L -170,620 C -170,500 170,500 170,620 L 170,1300 Z" fill="#1a0e08"/>
        <path d="M -150,1300 L -150,630 C -150,530 150,530 150,630 L 150,1300 Z" fill="url(#${id}-day)"/>
        <g id="${id}-door"><path d="M -150,1300 L -150,630 C -150,530 150,530 150,630 L 150,1300 Z" fill="#5a3418"/>
          <path d="M -120,1270 L -120,650 C -120,570 120,570 120,650 L 120,1270 Z" fill="none" stroke="#3a2010" stroke-width="10"/><circle cx="110" cy="960" r="12" fill="#c9a24a"/></g></g>
      <rect id="${id}-dlight" width="1080" height="1920" fill="#ffe8b0" opacity="0" style="mix-blend-mode:screen"/>
      <g id="${g}-pos" transform="translate(540,1300) scale(1.05)"><g id="${g}-wrap">${girl(g)}
        <g transform="translate(150,460)"><rect x="-44" y="-30" width="88" height="60" fill="#c8b48a"/><path d="M -44,-30 L 44,-30" stroke="#a8946a" stroke-width="4"/></g></g></g>
      <g id="${b}-pos" opacity="0" transform="translate(540,1300) scale(1.05)">${C.girlBack(b)}</g>
      ${table(1640)}
      <rect id="${id}-white" width="1080" height="1920" fill="#fff6e0" opacity="0"/>` }],
    js: `${flickers(id, dur)}
    look("${g}", 2, 6, 0, 0.01); brows("${g}", -8, -8, 0, 0.01);
    tl.fromTo("#${g}-pos", { attr: { transform: "translate(540,1300) scale(1.05)" } }, { attr: { transform: "translate(540,1060) scale(1.05)" }, duration: 0.9, ease: "power2.inOut" }, 0.3);
    look("${g}", 9, 0, 1.2, 0.3); tl.to("#${g}-head", { rotation: -4, transformOrigin: "50% 90%", duration: 0.4 }, 1.2);
    blink("${g}", 1.7, 0.24);
    tl.set("#${g}-pos", { opacity: 0 }, 2.1); tl.set("#${b}-pos", { opacity: 1 }, 2.1);
    tl.fromTo("#${b}-pos", { attr: { transform: "translate(540,1060) scale(1.05)" } }, { attr: { transform: "translate(540,1000) scale(0.42)" }, duration: ${(dur - 3.0).toFixed(2)}, ease: "power1.inOut" }, 2.1);
    tl.fromTo("#${id}-door", { scaleX: 1 }, { scaleX: 0.08, transformOrigin: "0% 50%", duration: 0.7, ease: "power2.inOut" }, 2.3);
    tl.to("#${id}-dlight", { opacity: 0.12, duration: 0.8 }, 2.4);
    tl.to("#${b}-pos", { opacity: 0, duration: 0.5 }, ${(dur - 1.3).toFixed(2)});
    tl.to("#${id}-white", { opacity: 0.6, duration: 0.6 }, ${(dur - 1.0).toFixed(2)});
    ` }) };
}

// ── her full figure (wide shots): red coat to the knee, dark tights, the same head as the close-ups ────
function girlFull(p, { paper = true } = {}) {
  const leg = (id, x) => `<g id="${id}"><path d="M ${x - 15},-330 L ${x + 15},-330 L ${x + 12},-30 L ${x - 12},-30 Z" fill="#1c1a20"/><path d="M ${x - 14},-34 L ${x + 14},-34 C ${x + 22},-20 ${x + 28},-8 ${x + 28},0 L ${x - 16},0 Z" fill="#141216"/></g>`;
  return `<g id="${p}-body">${leg(`${p}-legL`, -24)}${leg(`${p}-legR`, 24)}
    <path d="M -58,-800 C -82,-790 -90,-760 -88,-720 L -100,-320 C -40,-306 40,-306 100,-320 L 88,-720 C 90,-760 82,-790 58,-800 Z" fill="#8e1a1e"/>
    <path d="M -22,-800 L 22,-800 L 12,-560 L -12,-560 Z" fill="${P.dress}"/><path d="M -40,-800 L -10,-560 L -8,-320 L -30,-320 Z" fill="#7a1418"/><path d="M 40,-800 L 10,-560 L 8,-320 L 30,-320 Z" fill="#7a1418"/>
    <g id="${p}-armL"><path d="M -86,-790 C -110,-770 -112,-700 -108,-640 L -100,-480 L -72,-480 L -66,-760 Z" fill="#8e1a1e"/><ellipse cx="-86" cy="-458" rx="15" ry="24" fill="${P.skin}"/></g>
    <g id="${p}-armR"><path d="M 86,-790 C 110,-770 112,-700 108,-640 L 100,-480 L 72,-480 L 66,-760 Z" fill="#7a1418"/><ellipse cx="86" cy="-458" rx="15" ry="24" fill="${P.skinSh}"/>
      ${paper ? `<rect x="66" y="-470" width="30" height="20" fill="#c8b48a"/>` : ""}</g>
    <g transform="translate(0,-880) scale(0.3)">${C.girlHead(`${p}-h`, { freckles: true })}</g></g>`;
}
const FONTS2 = `@font-face { font-family: "Caveat"; src: url('assets/fonts/Caveat.woff2') format('woff2'); }`;

// ── 7. the street, a taxi stops, she gets in; then inside, the paper in her hand, her mind elsewhere ─
function t7(dur) {
  const id = "t7", f = `${id}-f`, t = `${id}-t`, g = `${id}-g`, cut = 4.3;
  const stopX = 120, carY = 1478;
  const T = (x, y, s) => `translate(${x},${y}) scale(${s})`;
  return { id, dur, html: scene({ id, dur, bg: "#0d1326", vignette: 0.85,
    layers: [
      { name: "street", defs: `<linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2a4a"/><stop offset="1" stop-color="#e09a6a"/></linearGradient>`, svg: `<g id="${id}-wide">
        <rect width="1080" height="1920" fill="url(#${id}-sky)"/>${buildings(3)}
        <rect x="0" y="1100" width="1080" height="70" fill="#2a2e3b"/><rect x="0" y="1178" width="1080" height="330" fill="#1c1f29"/>
        ${[...Array(6)].map((_, i) => `<rect x="${i * 220 - 40}" y="1330" width="120" height="10" fill="#c9c6b8" opacity="0.5"/>`).join("")}
        <rect x="0" y="1508" width="1080" height="18" fill="#4a4f5e"/><rect x="0" y="1526" width="1080" height="400" fill="#2b2f3c"/>
        <g id="${t}-pos" transform="translate(-1000,${carY})">${taxi(t)}</g>
        <g id="${f}-pos" transform="${T(300, 1650, 0.46)}"><g id="${f}">${girlFull(f)}</g></g></g>` },
      { name: "inside", defs: `<linearGradient id="${id}-win" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1a1e2e"/><stop offset="1" stop-color="#2a2a44"/></linearGradient>`, svg: `<g id="${id}-in" opacity="0">
        <rect width="1080" height="1920" fill="#14141a"/>
        <rect x="560" y="300" width="560" height="900" rx="40" fill="url(#${id}-win)"/>
        ${[...Array(8)].map((_, i) => `<rect id="${id}-st${i}" x="${600 + (i * 67) % 480}" y="${380 + (i * 113) % 760}" width="${120 + (i % 3) * 60}" height="10" rx="5" fill="${i % 3 ? "#ffd27a" : "#ff8a5a"}" opacity="0.6"/>`).join("")}
        <rect x="540" y="280" width="40" height="940" fill="#0e0e12"/>
        ${place(420, 900, 1.25, `<g id="${g}-tor">${C.girlBody(g, { coat: true })}</g>${C.girlHead(g, { freckles: true })}`, `${g}-all`)}
        <g transform="translate(420,1580)"><rect x="-90" y="-50" width="180" height="100" fill="#c8b48a"/><path d="M -90,-50 L 90,-50" stroke="#a8946a" stroke-width="6"/></g>
        <rect width="1080" height="1920" fill="#3a2a5a" opacity="0.25" style="mix-blend-mode:multiply"/></g>` },
    ],
    js: `
    cam("street", { scale: 1.3, origin: "45% 74%" }, { scale: 1.36, x: -14, origin: "45% 74%" }, 0, ${cut});
    tl.fromTo("#${t}-pos", { attr: { transform: "translate(-1000,${carY})" } }, { attr: { transform: "translate(${stopX},${carY})" }, duration: 2.0, ease: "power2.out" }, 0);
    tl.fromTo(["#${t}-wb", "#${t}-wf"], { rotation: 0 }, { rotation: 590, duration: 2.0, ease: "power2.out", transformOrigin: "50% 50%" }, 0);
    look("${f}-h", -8, 1, 0, 0.01);
    tl.fromTo("#${f}-pos", { attr: { transform: "${T(300, 1650, 0.46)}" } }, { attr: { transform: "${T(420, 1646, 0.46)}" }, duration: 0.8, ease: "power1.inOut" }, 2.0);
    tl.fromTo("#${t}-door", { scaleX: 1 }, { scaleX: 0.2, transformOrigin: "100% 50%", duration: 0.45, ease: "power2.inOut" }, 2.6);
    tl.to("#${f}-pos", { attr: { transform: "${T(510, 1560, 0.4)}" }, duration: 0.5, ease: "power1.in" }, 3.0);
    tl.to("#${f}", { opacity: 0, duration: 0.2 }, 3.35);
    tl.to("#${t}-door", { scaleX: 1, transformOrigin: "100% 50%", duration: 0.3, ease: "power3.in" }, 3.7);
    tl.to("#${t}-pos", { attr: { transform: "translate(500,${carY})" }, duration: 0.6, ease: "power2.in" }, 3.9);
    tl.set("#${id}-in", { opacity: 1 }, ${cut}); tl.set("#${id}-wide", { opacity: 0 }, ${cut});
    ${[...Array(8)].map((_, i) => `tl.fromTo("#${id}-st${i}", { x: 0 }, { x: ${-700 - (i % 3) * 200}, duration: ${(dur - cut).toFixed(2)}, ease: "none" }, ${cut});`).join(" ")}
    look("${g}", 2, 9, ${cut}, 0.01); brows("${g}", -8, -8, ${cut}, 0.01); eyesOpen("${g}", 0.9, ${cut}, 0.01);
    tl.fromTo("#${g}-all", { y: 0 }, { y: 4, duration: 0.25, ease: "sine.inOut", yoyo: true, repeat: ${Math.floor((dur - cut) / 0.25) - 1} }, ${cut});
    blink("${g}", ${(cut + 1.4).toFixed(2)}, 0.3); look("${g}", 8, 0, ${(cut + 2.2).toFixed(2)}, 0.5);
    cam("inside", { scale: 1.0, origin: "420px 1000px" }, { scale: 1.08, origin: "420px 1000px" }, ${cut}, ${(dur - cut).toFixed(2)});
    ` }) };
}

// her lying on her back, from above (head at the top): bob hair spread on the pillow, the coat off
function lying(p, { armReach = false } = {}) {
  return `<path d="M -190,-90 C -220,-260 220,-260 190,-90 C 210,0 200,90 170,130 C 100,170 -100,170 -170,130 C -200,90 -210,0 -190,-90 Z" fill="${P.hair}"/>
    <path d="M -150,-200 C -80,-250 80,-250 150,-200" stroke="${P.hairHi}" stroke-width="12" fill="none" opacity="0.8"/>
    <g id="${p}-tor">${C.girlBody(p)}</g>${C.girlHead(p, { freckles: true })}`;
}
function bedTop(id, { paperOn = true } = {}) {
  return `<rect width="1080" height="1920" fill="#1a1626"/>
    <rect x="70" y="120" width="830" height="1900" rx="20" fill="#3a2a2a"/><rect x="96" y="220" width="778" height="1800" rx="16" fill="#cfc6d8"/>
    <path d="M 160,250 C 160,200 820,200 820,250 L 820,560 C 820,610 160,610 160,560 Z" fill="#e6e0ea"/>
    <rect x="840" y="300" width="250" height="420" rx="12" fill="#4a3a30"/>
    ${paperOn ? `<g id="${id}-spaper" transform="translate(905,560) rotate(-8)"><rect x="-56" y="-38" width="112" height="76" fill="#c8b48a"/><path d="M -56,-38 L 56,-38" stroke="#a8946a" stroke-width="5"/></g>` : ""}
    <circle cx="1010" cy="420" r="62" fill="#d8ccb2"/>`;
}
const blanket = (y) => `<path d="M 90,${y + 30} C 300,${y - 10} 600,${y + 10} 860,${y - 4} L 900,1960 L 60,1960 Z" fill="#6a2a3a"/>
  <path d="M 90,${y + 30} C 300,${y - 10} 600,${y + 10} 860,${y - 4} L 864,${y + 60} C 600,${y + 76} 300,${y + 56} 92,${y + 96} Z" fill="#e6e0ea"/>
  ${[...Array(9)].map((_, i) => `<circle cx="${130 + i * 86}" cy="${y + 200}" r="10" fill="#8a3a4a"/>`).join("")}`;
const moon = (id) => `<defs><linearGradient id="${id}-mn" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fb8ff" stop-opacity="0.16"/><stop offset="1" stop-color="#9fb8ff" stop-opacity="0"/></linearGradient></defs>
  ${[0, 1, 2, 3].map((i) => `<path d="M ${-200 + i * 190},0 L ${-60 + i * 190},0 L ${560 + i * 190},1920 L ${420 + i * 190},1920 Z" fill="url(#${id}-mn)"/>`).join("")}`;

// ── 8. night; lying in bed, eyes on the ceiling, lost in thought ─────────────────────────────────────
function t8(dur) {
  const id = "t8", g = `${id}-g`;
  return { id, dur, html: scene({ id, dur, fadeIn: true, bg: "#14101c", vignette: 0.85,
    layers: [{ name: "bed", svg: `${bedTop(id)}${place(470, 470, 0.9, lying(g))}${blanket(1000)}${moon(id)}<rect width="1080" height="1920" fill="#1a1440" opacity="0.35" style="mix-blend-mode:multiply"/>` }],
    js: `
    cam("bed", { scale: 1.0, rotation: 2 }, { scale: 1.1, rotation: 0, y: 30 }, 0, ${dur});
    look("${g}", -2, -6, 0, 0.01); eyesOpen("${g}", 0.92, 0, 0.01); brows("${g}", -6, -6, 0, 0.01);
    tl.fromTo("#${g}-tor", { scaleY: 1 }, { scaleY: 1.015, transformOrigin: "50% 0%", duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: 2 }, 0);
    blink("${g}", 1.6, 0.34); look("${g}", 3, -7, 2.4, 0.9); blink("${g}", 3.8, 0.34);
    ` }) };
}

// 7-segment digits for the wall clock
const SEG = { a: [[0, 0], [1, 0]], b: [[1, 0], [1, 1]], c: [[1, 1], [1, 2]], d: [[0, 2], [1, 2]], e: [[0, 1], [0, 2]], f: [[0, 0], [0, 1]], g: [[0, 1], [1, 1]] };
const DIG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd" };
const digit = (x, y, n, w = 110, h = 100, th = 20) => Object.entries(SEG).map(([k, [[x1, y1], [x2, y2]]]) => {
  const on = DIG[n].includes(k), X1 = x + x1 * w, Y1 = y + y1 * h, X2 = x + x2 * w, Y2 = y + y2 * h, hz = Y1 === Y2;
  const pts = hz ? `${X1 + 8},${Y1} ${X1 + 8 + th / 2},${Y1 - th / 2} ${X2 - 8 - th / 2},${Y1 - th / 2} ${X2 - 8},${Y1} ${X2 - 8 - th / 2},${Y1 + th / 2} ${X1 + 8 + th / 2},${Y1 + th / 2}`
                 : `${X1},${Y1 + 8} ${X1 + th / 2},${Y1 + 8 + th / 2} ${X1 + th / 2},${Y2 - 8 - th / 2} ${X1},${Y2 - 8} ${X1 - th / 2},${Y2 - 8 - th / 2} ${X1 - th / 2},${Y1 + 8 + th / 2}`;
  return `<polygon points="${pts}" fill="${on ? "#ff3b30" : "#3a1412"}" opacity="${on ? 1 : 0.5}"/>`;
}).join("");

// ── 9. she looks at the wall clock: 23:00; she grabs the paper, opens it, stares ─────────────────────
function t9(dur) {
  const id = "t9", g = `${id}-g`, g2 = `${id}-g2`, g3 = `${id}-g3`;
  const A = 2.3, B = 4.0, Cc = 7.1; // phase cuts: look → clock → open → reaction
  const held = `<g id="${id}-held" opacity="0"><g transform="translate(470,1060) rotate(-4)"><rect x="-130" y="-60" width="260" height="120" fill="#c8b48a"/><g id="${id}-flap"><rect x="-130" y="-180" width="260" height="120" fill="#d8c69c"/></g>
    <path d="M -130,-60 L 130,-60" stroke="#a8946a" stroke-width="4"/></g></g>`;
  return { id, dur, html: scene({ id, dur, bg: "#14101c", vignette: 0.85,
    layers: [
      { name: "a", svg: `<g id="${id}-pa">${bedTop(id)}${place(470, 470, 0.9, lying(g))}${blanket(1000)}${moon(id)}<rect width="1080" height="1920" fill="#1a1440" opacity="0.35" style="mix-blend-mode:multiply"/></g>` },
      { name: "b", svg: `<g id="${id}-pb" opacity="0"><rect width="1080" height="1920" fill="#1e1a2a"/><rect x="0" y="0" width="1080" height="1920" fill="#2a2440"/>
        <rect x="140" y="760" width="800" height="400" rx="40" fill="#121216"/><rect x="172" y="792" width="736" height="336" rx="24" fill="#0a0a0c"/>
        ${digit(220, 860, 2)}${digit(380, 860, 3)}<g id="${id}-colon"><circle cx="540" cy="915" r="13" fill="#ff3b30"/><circle cx="540" cy="1005" r="13" fill="#ff3b30"/></g>${digit(580, 860, 0)}${digit(740, 860, 0)}
        <rect width="1080" height="1920" fill="url(#${id}-rg)" style="mix-blend-mode:screen"/></g>`, defs: glow(`${id}-rg`, 540, 960, 600, "#ff3b30", 0.3) },
      { name: "c", svg: `<g id="${id}-pc" opacity="0">${bedTop(id)}${place(470, 470, 0.9, lying(g2))}${blanket(1000)}${held}
        <g id="${id}-arm" transform="translate(0,0)"><path id="${id}-armp" d="M 610,700 L 700,700 L 900,560 L 860,520 Z" fill="${P.skinSh}" opacity="0"/></g>${moon(id)}<rect width="1080" height="1920" fill="#1a1440" opacity="0.3" style="mix-blend-mode:multiply"/></g>` },
      { name: "d", svg: `<g id="${id}-pd" opacity="0"><rect width="1080" height="1920" fill="#cfc6d8"/><path d="M -60,200 C -60,80 1140,80 1140,200 L 1140,1500 C 1140,1640 -60,1640 -60,1500 Z" fill="#e6e0ea"/>
        ${place(540, 820, 2.2, lying(g3))}<g transform="translate(540,1840) rotate(2)"><rect x="-420" y="-180" width="840" height="360" fill="#c8b48a"/></g>
        <rect width="1080" height="1920" fill="#1a1440" opacity="0.3" style="mix-blend-mode:multiply"/></g>` },
    ],
    js: `
    look("${g}", -2, -6, 0, 0.01); eyesOpen("${g}", 0.92, 0, 0.01);
    look("${g}", 9, -2, 0.5, 0.4); turn("${g}", 10, 0.5, 0.5);
    cam("a", { scale: 1.05 }, { scale: 1.12 }, 0, ${A});
    tl.set("#${id}-pa", { opacity: 0 }, ${A}); tl.set("#${id}-pb", { opacity: 1 }, ${A});
    cam("b", { scale: 1.0 }, { scale: 1.1 }, ${A}, ${(B - A).toFixed(2)});
    tl.set("#${id}-colon", { opacity: 0.3 }, ${(A + 0.8).toFixed(2)}); tl.set("#${id}-colon", { opacity: 1 }, ${(A + 1.05).toFixed(2)});
    tl.set("#${id}-pb", { opacity: 0 }, ${B}); tl.set("#${id}-pc", { opacity: 1 }, ${B});
    look("${g2}", 9, 2, ${B}, 0.01); turn("${g2}", 10, ${B}, 0.01); eyesOpen("${g2}", 1.1, ${B}, 0.01);
    tl.fromTo("#${id}-armp", { opacity: 0 }, { opacity: 1, duration: 0.2 }, ${(B + 0.2).toFixed(2)});
    tl.set("#${id}-spaper", { opacity: 0 }, ${(B + 0.7).toFixed(2)}); tl.to("#${id}-armp", { opacity: 0, duration: 0.2 }, ${(B + 0.75).toFixed(2)});
    tl.set("#${id}-held", { opacity: 1 }, ${(B + 0.8).toFixed(2)});
    turn("${g2}", 0, ${(B + 0.8).toFixed(2)}, 0.4); look("${g2}", 0, 8, ${(B + 0.9).toFixed(2)}, 0.3);
    tl.fromTo("#${id}-flap", { scaleY: 0 }, { scaleY: 1, transformOrigin: "50% 100%", duration: 0.5, ease: "power2.out" }, ${(B + 1.6).toFixed(2)});
    cam("c", { scale: 1.05 }, { scale: 1.14, y: 20 }, ${B}, ${(Cc - B).toFixed(2)});
    tl.set("#${id}-pc", { opacity: 0 }, ${Cc}); tl.set("#${id}-pd", { opacity: 1 }, ${Cc});
    look("${g3}", 0, 8, ${Cc}, 0.01); eyesOpen("${g3}", 1.0, ${Cc}, 0.01); brows("${g3}", -4, -4, ${Cc}, 0.01);
    eyesOpen("${g3}", 1.32, ${(Cc + 0.4).toFixed(2)}, 0.35); brows("${g3}", -16, -6, ${(Cc + 0.4).toFixed(2)}, 0.35);
    tl.fromTo("#${g3}-head", { y: 0 }, { y: -10, duration: 0.35, ease: "power2.out" }, ${(Cc + 0.4).toFixed(2)});
    blink("${g3}", ${(Cc + 1.4).toFixed(2)}, 0.14); blink("${g3}", ${(Cc + 1.65).toFixed(2)}, 0.14);
    brows("${g3}", -14, -12, ${(Cc + 2.0).toFixed(2)}, 0.4);
    cam("d", { scale: 1.0, origin: "540px 760px" }, { scale: 1.08, origin: "540px 760px" }, ${Cc}, ${(dur - Cc).toFixed(2)});
    ` }) };
}

// ── 10. the paper: «HamdelGapBot» in his hand ─────────────────────────────────────────────────────
function t10(dur) {
  const id = "t10";
  return { id, dur, html: scene({ id, dur, bg: "#14101c", vignette: 0.75, extraStyle: FONTS2,
    layers: [
      { name: "bg", blur: 16, svg: `<rect width="1080" height="1920" fill="#6a2a3a"/>${[...Array(5)].map((_, i) => `<path d="M ${i * 260},0 L ${i * 260 + 200},1920" stroke="#8a3a4a" stroke-width="40" opacity="0.4"/>`).join("")}` },
      { name: "paper", svg: `<g transform="translate(540,960) rotate(-3)">
        <rect x="-430" y="-320" width="860" height="640" fill="#000" opacity="0.35" transform="translate(16,20)"/>
        <rect x="-430" y="-320" width="860" height="640" fill="#e2d2a6"/><rect x="-430" y="-320" width="860" height="640" fill="#7a5a2a" opacity="0.12"/>
        <path d="M -430,0 L 430,0 M 0,-320 L 0,320" stroke="#c4b086" stroke-width="5"/>
        <text id="${id}-txt" x="0" y="40" font-family="Caveat" font-size="150" font-weight="600" fill="#2a1e3a" text-anchor="middle">HamdelGapBot</text>
        <rect id="${id}-mask" x="-420" y="-90" width="840" height="200" fill="#e2d2a6"/></g>
        <g transform="translate(120,1500) rotate(28) scale(1.9)"><path d="M -40,0 C -46,-60 -40,-110 -30,-120 L 30,-120 C 44,-100 46,-40 40,0 Z" fill="${P.skin}"/><rect x="-48" y="0" width="96" height="300" fill="#e2d6d0"/></g>
        <g transform="translate(960,1500) rotate(-28) scale(1.9)"><path d="M -40,0 C -46,-60 -40,-110 -30,-120 L 30,-120 C 44,-100 46,-40 40,0 Z" fill="${P.skinSh}"/><rect x="-48" y="0" width="96" height="300" fill="#e2d6d0"/></g>` },
    ],
    js: `
    cam("bg", { scale: 1.05 }, { scale: 1.08 }, 0, ${dur});
    cam("paper", { scale: 1.0, rotation: -1 }, { scale: 1.12, rotation: 0.6, origin: "50% 50%" }, 0, ${dur}, "sine.inOut");
    tl.fromTo("#${id}-mask", { attr: { x: -420, width: 840 } }, { attr: { x: 420, width: 0 }, duration: 0.9, ease: "power1.inOut" }, 0.2);
    ` }) };
}

// ── 11. she searches the name: her phone, the bot's page on screen ───────────────────────────────────
function t11(dur) {
  const id = "t11";
  const X0 = 234, X1 = 846, Y0 = 324, Y1 = 1596;
  return { id, dur, html: scene({ id, dur, bg: "#0b0d14", vignette: 0.7, fadeOut: false,
    layers: [
      { name: "bg", blur: 18, svg: `<rect width="1080" height="1920" fill="#6a2a3a"/><rect width="1080" height="1920" fill="#0b0d14" opacity="0.55"/>` },
      { name: "phone", defs: `<clipPath id="${id}-scr"><rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${Y1 - Y0}" rx="58"/></clipPath>`, svg: `
        <g transform="translate(150,1700) rotate(30) scale(2.3)"><path d="M -40,0 C -46,-60 -40,-110 -30,-120 L 30,-120 C 44,-100 46,-40 40,0 Z" fill="${P.skin}"/><rect x="-48" y="0" width="96" height="300" fill="#e2d6d0"/></g>
        <g transform="translate(930,1700) rotate(-30) scale(2.3)"><path d="M -40,0 C -46,-60 -40,-110 -30,-120 L 30,-120 C 44,-100 46,-40 40,0 Z" fill="${P.skinSh}"/><rect x="-48" y="0" width="96" height="300" fill="#e2d6d0"/></g>
        <rect x="200" y="290" width="680" height="1340" rx="86" fill="#0d0e12"/><rect x="210" y="300" width="660" height="1320" rx="80" fill="#1a1b20"/>
        <g clip-path="url(#${id}-scr)"><image id="${id}-shot" href="assets/img/hamdel.jpg" x="${X0}" y="${Y0}" width="${X1 - X0}" height="${(X1 - X0) * 2434 / 1125}" preserveAspectRatio="xMidYMin slice"/></g>
        <path d="M 260,1500 C 300,1440 340,1430 380,1450 L 360,1640 L 240,1640 Z" fill="${P.skin}"/><path d="M 820,1500 C 780,1440 740,1430 700,1450 L 720,1640 L 840,1640 Z" fill="${P.skinSh}"/>
        <rect width="1080" height="1920" fill="#7a5aff" opacity="0.06" style="mix-blend-mode:screen"/>` },
    ],
    js: `
    cam("bg", { scale: 1.04 }, { scale: 1.07 }, 0, ${dur});
    cam("phone", { scale: 1.0, rotation: -1, y: 20 }, { scale: 1.06, rotation: 0.4, y: -10 }, 0, ${dur});
    tl.fromTo("#${id}-shot", { attr: { y: ${Y0 + 40} } }, { attr: { y: ${Y0} }, duration: 0.6, ease: "power2.out" }, 0.2);
    ` }) };
}

const DURS = { t2: 4.0, t3: 5.0, t4: 6.0, t5: 6.0, t6: 5.0, t7: 8.0, t8: 5.0, t9: 10.6, t10: 3.5, t11: 5.0 };
export default [t2(DURS.t2), t3(DURS.t3), t4(DURS.t4), t5(DURS.t5), t6(DURS.t6), t7(DURS.t7), t8(DURS.t8), t9(DURS.t9), t10(DURS.t10), t11(DURS.t11)].map(uniq);
