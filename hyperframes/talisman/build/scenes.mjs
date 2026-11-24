// The talisman: a young woman pleads with an old fortune-teller; he reads her palm, writes a few words, folds the
// paper into her hand; she leaves into the light. Nobody speaks: mouths stay closed; a narrator tells it.
import { scene, place, glow } from "./lib.mjs";
import * as C from "../../fortune-teller-2/build/chars.mjs";
import { roomBehindGirl, roomBehindMan, table, crystalBall, candle, DEFS, light, R } from "../../fortune-teller-2/build/scene1.mjs";
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

const DURS = { t2: 4.0, t3: 5.0, t4: 6.0, t5: 6.0, t6: 5.0 };
export default [t2(DURS.t2), t3(DURS.t3), t4(DURS.t4), t5(DURS.t5), t6(DURS.t6)].map(uniq);
