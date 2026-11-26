// Part nine: under the shoe, a child's note and drawing — the old photo was of Arash; the old man on the radio;
// "the ground isn't always what it seems"; one-shoe footprints into the dark; the viewers decide again.
import fs from "node:fs";
import { scene, place, glow } from "../../forest-cabin/build/lib.mjs";
import * as C from "../../forest-cabin/build/chars.mjs";
import { pine } from "../../forest-cabin/build/scenes.mjs";
import { shakeJs, T, warm, dark, FELT } from "../../forest-cabin-5/build/scenes.mjs";
import { ARASH, arashBack, hand, HC, mapArt, mapDefs, photo } from "../../forest-cabin-6/build/scenes.mjs";
import { radio, waves, wavesJs, ledJs, straps, BAG } from "../../forest-cabin-7/build/scenes.mjs";
import { forest, rain, rainJs, torchDefs, torch, spotTo, spotSet, sneaker, burntTree, NASKH } from "../../forest-cabin-8/build/scenes.mjs";

const WJ = JSON.parse(fs.readFileSync(new URL("./words.json", import.meta.url), "utf8"));
const wt = (shot, i) => +(WJ[shot].words[i].start + 0.25).toFixed(2);
const IRAN = `@font-face { font-family: "IRANSans"; src: url('assets/fonts/IRANSans-Black.ttf') format('truetype'); font-weight: 900; }`;
const leaves = (n = 120, seed = 3) => { let s = seed; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return [...Array(n)].map(() => `<ellipse cx="${(r() * 1080).toFixed(0)}" cy="${(r() * 1920).toFixed(0)}" rx="${(18 + r() * 26).toFixed(0)}" ry="${(8 + r() * 10).toFixed(0)}" fill="${["#3a2a14", "#4a3418", "#2e2210", "#5a3a1a"][Math.floor(r() * 4)]}" transform="rotate(${(r() * 180).toFixed(0)})" transform-origin="center"/>`).join(""); };
// a child's drawing: three boys by a well (the middle one unscratched)
const kidDrawing = `<g stroke="#6a6a70" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.75">
  <ellipse cx="160" cy="70" rx="70" ry="20"/><path d="M 90,70 L 90,130 L 230,130 L 230,70 M 100,70 L 100,10 M 220,70 L 220,10 M 90,10 L 230,10"/>
  ${[-160, -80, 0].map((x, i) => `<g transform="translate(${x},0)"><circle cx="0" cy="0" r="24"/><path d="M 0,24 L 0,90 M 0,40 L -26,70 M 0,40 L 26,70 M 0,90 L -20,130 M 0,90 L 20,130"/>
    ${i === 1 ? `<path d="M -10,-4 L -6,-4 M 6,-4 L 10,-4 M -8,8 C -3,13 3,13 8,8" stroke-width="3"/>` : `<path d="M -10,-4 L -6,-4 M 6,-4 L 10,-4 M -8,8 C -3,13 3,13 8,8" stroke-width="3"/>`}</g>`).join("")}</g>`;
// the yellowed notebook page with the pencil words
function notePage(id) {
  const lines = ["فردا با آن دو تا میریم سَرِ چاه.", "اگه نترسن،", "باهم رفیق میشیم."];
  return `<g><rect x="-420" y="-520" width="840" height="1040" fill="#000" opacity="0.4" transform="translate(14,18)"/><rect x="-420" y="-520" width="840" height="1040" fill="#e4d49e"/>
    <rect x="-420" y="-520" width="840" height="1040" fill="#8a6a2a" opacity="0.12"/><path d="M -420,0 L 420,-6" stroke="#c4b07a" stroke-width="5"/>
    ${[...Array(14)].map((_, i) => `<path d="M -380,${-440 + i * 70} L 380,${-440 + i * 70}" stroke="#9ab0c8" stroke-width="2" opacity="0.45"/>`).join("")}<path d="M -320,-520 L -320,520" stroke="#d08a8a" stroke-width="3" opacity="0.5"/>
    ${lines.map((l, i) => `<g id="${id}-l${i}" opacity="0"><text x="340" y="${-330 + i * 120}" font-family="IRANSans" font-weight="900" font-size="58" fill="#6a6a70" opacity="0.7" direction="rtl" text-anchor="start" transform="rotate(-2 0 ${-330 + i * 120})">${l}</text></g>`).join("")}
    <g id="${id}-kid" transform="translate(-60,280)">${kidDrawing}</g></g>`;
}
// the old man far off in the fog, felt hat, a radio at his mouth
const oldShadow = `<g><path d="M -120,0 L -110,-520 C -110,-600 110,-600 110,-520 L 120,0 Z" fill="#0c1014"/><ellipse cx="0" cy="-650" rx="80" ry="92" fill="#0c1014"/>
  <path d="M -96,-700 C -100,-800 100,-800 96,-700 C 60,-716 -60,-716 -96,-700 Z" fill="#0a0d10"/><rect x="40" y="-660" width="34" height="80" rx="8" fill="#0a0d10"/><path d="M 74,-650 L 90,-720" stroke="#0a0d10" stroke-width="8"/>
  <path d="M 110,-500 C 150,-560 100,-620 74,-630" stroke="#0c1014" stroke-width="44" fill="none" stroke-linecap="round"/></g>`;

// 1. the shoe comes out; a yellowed folded paper underneath; he takes it
function m1(dur) {
  const id = "m1";
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.9,
    layers: [
      { name: "b", defs: torchDefs(id, 400), svg: `<rect width="1080" height="1920" fill="#0e0c0a"/><g transform="translate(540,1300) scale(1.4)" opacity="0.8">${burntTree()}</g>
        <g transform="translate(540,1250)"><rect x="-420" y="-160" width="840" height="420" rx="20" fill="#4a3220"/><rect x="-390" y="-130" width="780" height="360" rx="14" fill="#1a120c"/>
          <g transform="translate(0,90) rotate(-4)"><g id="${id}-pp"><rect x="-200" y="-90" width="400" height="180" fill="#d6c486"/><path d="M -200,0 L 200,-4" stroke="#b8a464" stroke-width="5"/></g></g>
          <g id="${id}-sh" transform="translate(0,40)">${sneaker()}</g></g>
        <g id="${id}-hd" transform="translate(600,1700)">${hand()}</g>${rain(id, 25, 0.22)}${torch(id, 0.8, 400)}` },
    ],
    js: `${rainJs(id, dur)} ${spotSet(id, 540, 1250)}
    tl.to("#${id}-sh", { attr: { transform: "translate(900,-500) rotate(25)" }, duration: 0.6, ease: "power2.in" }, 0.25);
    tl.to("#${id}-hd", { attr: { transform: "translate(560,1460)" }, duration: 0.4, ease: "power2.out" }, ${wt("m1", 2) - 0.3});
    tl.to(["#${id}-pp"], { y: -260, scale: 1.2, duration: 0.6, ease: "power2.out" }, ${wt("m1", 3)}); tl.to("#${id}-hd", { attr: { transform: "translate(560,1200)" }, duration: 0.6 }, ${wt("m1", 3)});
    cam("b", { scale: 1.0, origin: "540px 1150px" }, { scale: 1.35, origin: "540px 1000px" }, 0, ${dur}, "power1.inOut");
    ` }) };
}
// 2. the note, very close: the pencil words appear one phrase at a time; a child's drawing in the corner
function m2(dur) {
  const id = "m2";
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.9, extraStyle: IRAN,
    layers: [
      { name: "n", defs: torchDefs(id, 560), svg: `<rect width="1080" height="1920" fill="#0e0c0a"/><g id="${id}-pg" transform="translate(540,880) rotate(-2)">${notePage(id)}</g>
        <g transform="translate(60,1500) rotate(30)">${hand(1)}</g><g transform="translate(1020,1500) rotate(-30)">${hand(-1, HC.skinSh)}</g>${rain(id, 25, 0.2)}${torch(id, 0.7, 560)}` },
    ],
    js: `${rainJs(id, dur)} ${spotSet(id, 600, 700)}
    tl.fromTo("#${id}-l0", { opacity: 0 }, { opacity: 1, duration: ${(wt("m2", 8) - wt("m2", 2) + 0.3).toFixed(2)}, ease: "none" }, ${wt("m2", 2) - 0.1});
    tl.fromTo("#${id}-l1", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "none" }, ${wt("m2", 9) - 0.1});
    tl.fromTo("#${id}-l2", { opacity: 0 }, { opacity: 1, duration: 1.0, ease: "none" }, ${wt("m2", 11) - 0.1});
    ${spotTo(id, 560, 600, wt("m2", 9) - 0.2, 0.6)} ${spotTo(id, 460, 1150, wt("m2", 12), 0.7)}
    cam("n", { scale: 1.0, origin: "540px 800px" }, { scale: 1.08, origin: "540px 800px" }, 0, ${dur});
    ${shakeJs(`#${id}-pg`, 0, 0.01, 0)}
    `.replace(/\(function \(\) \{ const el = document.querySelector\("#m2-pg"\);[\s\S]*?\}\)\(\);/, "") }) };
}
// 3. "the same photo!" — the old photo beside the drawing; the scribbled face is his; his frightened face
function m3(dur) {
  const id = "m3", r = `${id}-r`, A = wt("m3", 9) - 0.2, Z = wt("m3", 6) - 0.1;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.9, extraStyle: IRAN,
    layers: [
      { name: "p", defs: torchDefs(id, 620), svg: `<g id="${id}-pa"><rect width="1080" height="1920" fill="#0e0c0a"/>
        <g transform="translate(300,760) rotate(-3) scale(0.62)">${notePage(id + "n").replace(/opacity="0"/g, 'opacity="1"')}</g>
        <g id="${id}-ph" transform="translate(1400,1000) rotate(14) scale(0.95)"><g style="filter: drop-shadow(0 12px 14px rgba(0,0,0,0.6))">${photo(id + "p")}</g></g>
        ${rain(id, 25, 0.2)}${torch(id, 0.55, 620)}</g>` },
      { name: "f", defs: glow(`${id}-cg`, 540, 1500, 900, "#cfe0ff", 0.5), svg: `<g id="${id}-pb" opacity="0"><rect width="1080" height="1920" fill="#060a12"/><g id="${id}-fs">${place(540, 860, 2.3, ARASH(r) + straps, `${r}-all`)}</g>
        <rect width="1080" height="1920" fill="#0a1430" opacity="0.4" style="mix-blend-mode:multiply"/><rect width="1080" height="1920" fill="url(#${id}-cg)" style="mix-blend-mode:screen"/></g>` },
    ],
    js: `${spotSet(id, 600, 900)}
    tl.to("#${id}-ph", { attr: { transform: "translate(760,1000) rotate(4) scale(0.95)" }, duration: 0.5, ease: "power3.out" }, ${wt("m3", 3) - 0.2});
    cam("p", { scale: 1.0, origin: "760px 1000px" }, { scale: 1.0, origin: "760px 1000px" }, 0, 0.01);
    tl.to("#${id}-p", { scale: 2.6, transformOrigin: "760px 1010px", duration: 1.4, ease: "power2.inOut" }, ${Z});
    tl.to(".${id}p-sl", { opacity: 0.45, duration: 1.0 }, ${Z + 1.0});
    tl.set("#${id}-pa", { opacity: 0 }, ${A}); tl.set("#${id}-pb", { opacity: 1 }, ${A});
    look("${r}", 0, 2, 0, 0.01); eyesOpen("${r}", 1.55, 0, 0.01); brows("${r}", -28, -16, 0, 0.01);
    tl.fromTo("#${id}-fs", { scale: 1.0 }, { scale: 1.1, transformOrigin: "540px 760px", duration: ${(dur - A).toFixed(2)}, ease: "power1.out" }, ${A});
    ${shakeJs(`#${id}-fs`, A, dur - A, 3, 1.2)}
    ` }) };
}
// 4. the radio crackles on his belt: he jumps, the papers fall onto the leaves, he grabs it; the red light blinks
function m4(dur) {
  const id = "m4", r = `${id}-r`, A = wt("m4", 6) - 0.25;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.9,
    layers: [
      { name: "a", defs: glow(`${id}-cg`, 540, 1500, 900, "#cfe0ff", 0.45), svg: `<g id="${id}-pa"><rect width="1080" height="1920" fill="#060a12"/><g id="${id}-jump">${place(540, 760, 1.6, ARASH(r) + straps, `${r}-all`)}</g>
        <g id="${id}-p1" transform="translate(420,1400) rotate(-6)"><rect x="-150" y="-100" width="300" height="200" fill="#e4d49e"/></g><g id="${id}-p2" transform="translate(640,1420) rotate(8)"><rect x="-130" y="-100" width="260" height="200" fill="#efe6d0"/></g>
        <rect y="1700" width="1080" height="220" fill="#1a1208"/><rect width="1080" height="1920" fill="#0a1430" opacity="0.35" style="mix-blend-mode:multiply"/><rect width="1080" height="1920" fill="url(#${id}-cg)" style="mix-blend-mode:screen"/>${rain(id, 40, 0.3)}</g>` },
      { name: "b", svg: `<g id="${id}-pb" opacity="0"><rect width="1080" height="1920" fill="#0a0c10"/><g transform="translate(540,900) scale(2.4)">${radio(id)}<g transform="translate(0,-40)">${waves(id, 3, 100)}${waves(id + "l", 3, 100, -1)}</g></g>
        <g transform="translate(300,1600) rotate(25)">${hand(1)}</g><g transform="translate(800,1600) rotate(-25)">${hand(-1, HC.skinSh)}</g>${rain(id + "b", 30, 0.25)}</g>` },
    ],
    js: `${rainJs(id, dur)} ${rainJs(id + "b", dur)}
    look("${r}", 0, 6, 0, 0.01); eyesOpen("${r}", 1.2, 0, 0.01); brows("${r}", -14, -10, 0, 0.01);
    tl.to("#${id}-jump", { y: -90, duration: 0.15, ease: "power3.out" }, ${wt("m4", 1) - 0.05}); tl.to("#${id}-jump", { y: 0, duration: 0.3, ease: "power2.in" }, ${wt("m4", 1) + 0.12});
    eyesOpen("${r}", 1.6, ${wt("m4", 1) - 0.05}, 0.12); brows("${r}", -30, -14, ${wt("m4", 1) - 0.05}, 0.12); look("${r}", -2, 8, ${wt("m4", 2)}, 0.2);
    tl.to("#${id}-p1", { attr: { transform: "translate(300,1760) rotate(-40)" }, duration: 0.6, ease: "power2.in" }, ${wt("m4", 1)}); tl.to("#${id}-p2", { attr: { transform: "translate(760,1780) rotate(50)" }, duration: 0.7, ease: "power2.in" }, ${wt("m4", 1) + 0.05});
    ${shakeJs(`#${id}-pa`, wt("m4", 1), A - wt("m4", 1), 5, 1.4)}
    tl.set("#${id}-pa", { opacity: 0 }, ${A}); tl.set("#${id}-pb", { opacity: 1 }, ${A});
    ${ledJs(id, A, dur, 0.2)} ${wavesJs(id, A, dur, 3, 0.5)} ${wavesJs(id + "l", A, dur, 3, 0.5)}
    cam("b", { scale: 1.0, origin: "540px 900px" }, { scale: 1.08, origin: "540px 900px" }, ${A}, ${(dur - A).toFixed(2)});
    ` }) };
}
// 5. the old man's voice: the radio close; then pull back behind Arash — far in the fog, a still silhouette in a felt hat
function m5(dur) {
  const id = "m5", k = `${id}-k`, A = wt("m5", 8) - 0.3;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.9,
    layers: [
      { name: "r", svg: `<g id="${id}-pa"><rect width="1080" height="1920" fill="#0a0c10"/><g transform="translate(540,900) scale(2.4)">${radio(id)}<g transform="translate(0,-40)">${waves(id, 4, 100)}${waves(id + "l", 4, 100, -1)}</g></g>
        <g transform="translate(300,1600) rotate(25)">${hand(1)}</g><g transform="translate(800,1600) rotate(-25)">${hand(-1, HC.skinSh)}</g></g>` },
      { name: "w", defs: torchDefs(id, 300) + glow(`${id}-fogg`, 830, 1060, 340, "#9aa8c0", 0.32), svg: `<g id="${id}-pb" opacity="0">${forest(id, { seed: 53 })}
        <rect width="1080" height="1920" fill="url(#${id}-fogg)"/><g transform="translate(830,1180)"><g id="${id}-old" opacity="0.9"><g transform="scale(0.42)">${oldShadow}</g></g></g>
        <rect id="${id}-fog" y="800" width="1080" height="700" fill="#8090b0" opacity="0.22"/>
        ${place(380, 1250, 1.25, arashBack(k), `${k}-all`)}<g transform="translate(305,1560) scale(1.5)"><path d="M -150,-60 C -150,-110 150,-110 150,-60 L 170,380 C 170,420 -170,420 -170,380 Z" fill="${BAG}"/></g>
        ${rain(id, 50, 0.32)}${torch(id, 0.4, 300)}</g>` },
    ],
    js: `${rainJs(id, dur)} ${spotSet(id, 300, 1100)}
    ${wavesJs(id, wt("m5", 0) - 0.1, A, 4, 0.5)} ${wavesJs(id + "l", wt("m5", 0) - 0.1, A, 4, 0.5)} tl.set("#${id}-led", { fill: "#30ff60" }, 0.1);
    cam("r", { scale: 1.0, origin: "540px 900px" }, { scale: 1.1, origin: "540px 900px" }, 0, ${A.toFixed(2)});
    tl.set("#${id}-pa", { opacity: 0 }, ${A}); tl.set("#${id}-pb", { opacity: 1 }, ${A});
    cam("w", { scale: 1.5, origin: "380px 1100px" }, { scale: 1.0, origin: "380px 1100px" }, ${A}, 2.4, "power2.inOut");
    tl.to("#${id}-old", { opacity: 0, scale: 0.8, y: -20, transformOrigin: "50% 100%", duration: 1.6, ease: "power1.in" }, ${(dur - 1.7).toFixed(2)});
    ` }) };
}
// 6. "the ground?…" — he looks down; the torch over wet leaves; a patch ahead lies too neat, slightly sunken
function m6(dur) {
  const id = "m6";
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.9,
    layers: [
      { name: "g", defs: torchDefs(id, 260) + `<radialGradient id="${id}-pit"><stop offset="0" stop-color="#000" stop-opacity="0.55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>`, svg: `<rect width="1080" height="1920" fill="#1a1208"/>${leaves(140, 7)}
        <g transform="translate(560,820)"><ellipse rx="300" ry="170" fill="url(#${id}-pit)"/>${[...Array(5)].map((_, r) => [...Array(7)].map((_, c) => `<ellipse cx="${-210 + c * 70}" cy="${-110 + r * 55}" rx="34" ry="14" fill="#4a3418"/>`).join("")).join("")}</g>
        <g transform="translate(200,1700) rotate(20)"><path d="M -60,0 C -60,-60 60,-60 60,0 L 70,200 L -70,200 Z" fill="#eceef2"/></g><g transform="translate(860,1720) rotate(-15)"><path d="M -60,0 C -60,-60 60,-60 60,0 L 70,200 L -70,200 Z" fill="#eceef2"/></g>
        ${rain(id, 30, 0.25)}${torch(id, 0.85, 260)}` },
    ],
    js: `${rainJs(id, dur)} ${spotSet(id, 420, 1500)}
    ${spotTo(id, 600, 1300, 0.2, 0.8, "sine.inOut")} ${spotTo(id, 380, 1150, 1.0, 0.7, "sine.inOut")} ${spotTo(id, 560, 830, wt("m6", 3) - 0.3, 0.6, "power2.inOut")}
    cam("g", { scale: 1.0, y: 80 }, { scale: 1.08, y: 0, origin: "540px 900px" }, 0, ${dur});
    ` }) };
}
// 7. footprints: a shoe, a bare foot, again and again, off the map's way into the dark; the blue shoe matches
function m7(dur) {
  const id = "m7", A = wt("m7", 11) - 0.1;
  const shoe = `<path d="M -26,-60 C -30,-80 30,-80 26,-60 L 30,50 C 30,70 -30,70 -30,50 Z" fill="#120c06" opacity="0.8"/>${[0, 1, 2, 3].map((i) => `<path d="M -22,${-40 + i * 24} L 22,${-40 + i * 24}" stroke="#2a1e10" stroke-width="5"/>`).join("")}`;
  const foot = `<path d="M -22,-40 C -26,-60 24,-60 22,-40 L 24,50 C 24,66 -24,66 -24,50 Z" fill="#120c06" opacity="0.75"/>${[-16, -6, 4, 13, 20].map((x, i) => `<ellipse cx="${x}" cy="${-66 + Math.abs(i - 2) * 4}" rx="6" ry="8" fill="#120c06" opacity="0.75"/>`).join("")}`;
  const prints = [...Array(8)].map((_, i) => { const y = 1700 - i * 170, x = 520 + i * 40 + (i % 2 ? 50 : -40) + i * i * 4;
    return `<g id="${id}-fp${i}" transform="translate(${x},${y}) rotate(${12 + i * 3}) scale(${1 - i * 0.07})" opacity="0">${i % 2 ? foot : shoe}</g>`; }).join("");
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.9,
    layers: [
      { name: "a", defs: torchDefs(id, 280), svg: `<g id="${id}-pa"><rect width="1080" height="1920" fill="#20160a"/>${leaves(90, 11)}<rect width="1080" height="1920" fill="#2a1c0c" opacity="0.35"/>
        <path d="M 200,1920 C 220,1500 180,1100 120,700" stroke="#7a2a1a" stroke-width="6" stroke-dasharray="20 16" fill="none" opacity="0.5"/>${prints}
        <rect width="1080" height="500" fill="#000" opacity="0.6"/>${rain(id, 30, 0.25)}${torch(id, 0.86, 280)}</g>` },
      { name: "b", defs: torchDefs(id + "b", 420), svg: `<g id="${id}-pb" opacity="0"><rect width="1080" height="1920" fill="#20160a"/>${leaves(60, 17)}
        <g transform="translate(560,1180) scale(3.2) rotate(8)">${shoe}</g><g id="${id}-sn" transform="translate(560,600) rotate(-82) scale(1.05)">${sneaker()}</g>
        <g transform="translate(900,700) rotate(-60)">${hand(-1, HC.skinSh)}</g>${torch(id + "b", 0.6, 420)}</g>` },
    ],
    js: `${rainJs(id, dur)} ${spotSet(id, 520, 1700)} tl.set(["#${id}b-spot", "#${id}b-glow"], { attr: { cx: 560, cy: 1000 } }, 0);
    ${[...Array(8)].map((_, i) => { const y = 1700 - i * 170, x = 520 + i * 40 + (i % 2 ? 50 : -40) + i * i * 4, t = (wt("m7", 4) - 0.1 + i * 0.28).toFixed(2);
      return `tl.to("#${id}-fp${i}", { opacity: 1, duration: 0.2 }, ${t}); ${spotTo(id, x, y, t, 0.28, "none")}`; }).join(" ")}
    cam("a", { scale: 1.0 }, { scale: 1.05 }, 0, ${A});
    tl.set("#${id}-pa", { opacity: 0 }, ${A}); tl.set("#${id}-pb", { opacity: 1 }, ${A});
    tl.fromTo("#${id}-sn", { attr: { transform: "translate(700,300) rotate(-82) scale(1.05)" } }, { attr: { transform: "translate(560,1180) rotate(-82) scale(1.05)" }, duration: 0.8, ease: "power2.out" }, ${A + 0.1});
    cam("b", { scale: 1.0, origin: "560px 1180px" }, { scale: 1.15, origin: "560px 1180px" }, ${A}, ${(dur - A).toFixed(2)});
    ` }) };
}
// 8. "Mehran?… I'm coming."
function m8(dur) {
  const id = "m8", r = `${id}-r`;
  return { id, dur, html: scene({ id, dur, bg: "#030507", vignette: 0.92,
    layers: [
      { name: "bg", blur: 12, svg: `${forest(id, { seed: 61 })}` },
      { name: "f", defs: glow(`${id}-cg`, 540, 1500, 900, "#cfe0ff", 0.45), svg: `${place(540, 860, 2.2, ARASH(r) + straps, `${r}-all`)}<rect width="1080" height="1920" fill="#0a1430" opacity="0.4" style="mix-blend-mode:multiply"/>
        <rect width="1080" height="1920" fill="url(#${id}-cg)" style="mix-blend-mode:screen"/>${rain(id, 30, 0.3)}` },
    ],
    js: `${rainJs(id, dur)}
    look("${r}", 6, -2, 0, 0.01); eyesOpen("${r}", 1.35, 0, 0.01); brows("${r}", -22, -12, 0, 0.01);
    brows("${r}", -4, 12, ${wt("m8", 3) - 0.1}, 0.3); eyesOpen("${r}", 1.05, ${wt("m8", 3) - 0.1}, 0.3); look("${r}", 9, 0, ${wt("m8", 3)}, 0.3);
    cam("f", { scale: 1.0 }, { scale: 1.12, origin: "50% 42%" }, 0, ${dur});
    ` }) };
}
// 9. pause at the fork: the map's way, or Mehran's footprints — the viewers' vote
function m9(dur) {
  const id = "m9", k = `${id}-k`;
  const X = 70, Y = 300, W = 940, H = 1060;
  const opt = (n, y, num, l1, l2) => `<g transform="translate(540,${y})"><g id="${id}-o${n}">
    <rect id="${id}-ob${n}" x="-420" y="-74" width="840" height="148" rx="28" fill="#1e2433" stroke="#3a4560" stroke-width="4"/>
    <circle cx="350" cy="0" r="40" fill="#2e3a5a"/><text x="350" y="17" font-family="Naskh" font-weight="700" font-size="48" fill="#fff" text-anchor="middle">${num}</text>
    <text x="290" y="-8" font-family="Naskh" font-weight="700" font-size="42" fill="#f2f2f2" text-anchor="end">${l1}</text><text x="290" y="46" font-family="Naskh" font-weight="700" font-size="38" fill="#aab4cc" text-anchor="end">${l2}</text></g></g>`;
  return { id, dur, html: scene({ id, dur, bg: "#05060c", vignette: 0.85, extraStyle: NASKH + `@font-face { font-family: "Ruqaa"; src: url('assets/fonts/ArefRuqaa-Bold.woff2') format('woff2'); font-weight: 700; }`,
    layers: [
      { name: "frz", defs: mapDefs(id), svg: `<g style="filter: grayscale(0.7) brightness(0.6)">${forest(id, { seed: 71 })}
        <path d="M 540,1920 L 520,1300 L 200,900 M 540,1300 L 860,900" stroke="#2a2014" stroke-width="80" fill="none" stroke-linecap="round"/>${place(540, 1250, 0.85, arashBack(k), `${k}-all`)}</g>
        ${[...Array(96)].map((_, i) => `<rect y="${i * 20}" width="1080" height="3" fill="#000" opacity="0.25"/>`).join("")}
        <g id="${id}-pz"><rect x="70" y="120" width="26" height="80" rx="6" fill="#fff"/><rect x="112" y="120" width="26" height="80" rx="6" fill="#fff"/><text x="160" y="182" font-family="'Courier New', monospace" font-weight="700" font-size="54" fill="#fff">PAUSE</text></g>
        <rect id="${id}-dim" width="1080" height="1920" fill="#05060c" opacity="0"/>` },
      { name: "ui", svg: `<g transform="translate(540,${Y + H / 2})"><g id="${id}-win" opacity="0"><g transform="translate(-540,${-(Y + H / 2)})">
        <rect x="${X + 10}" y="${Y + 16}" width="${W}" height="${H}" rx="40" fill="#000" opacity="0.5"/><rect x="${X}" y="${Y}" width="${W}" height="${H}" rx="40" fill="#121726" stroke="#3a4560" stroke-width="4"/>
        <path d="M ${X},${Y + 40} A 40,40 0 0 1 ${X + 40},${Y} L ${X + W - 40},${Y} A 40,40 0 0 1 ${X + W},${Y + 40} L ${X + W},${Y + 96} L ${X},${Y + 96} Z" fill="#1e2433"/>
        <circle cx="${X + 60}" cy="${Y + 48}" r="14" fill="#ff5f57"/><circle cx="${X + 104}" cy="${Y + 48}" r="14" fill="#febc2e"/><circle cx="${X + 148}" cy="${Y + 48}" r="14" fill="#28c840"/>
        <text x="${X + W - 50}" y="${Y + 64}" font-family="Naskh" font-weight="700" font-size="40" fill="#aab4cc" text-anchor="end">انتخاب با شماست</text>
        <text x="540" y="${Y + 190}" font-family="Naskh" font-weight="700" font-size="62" fill="#ffd873" text-anchor="middle">آرش چه‌کار کنه؟</text>
        <g transform="translate(${X + 250},${Y + 420}) rotate(-3)"><g id="${id}-im0"><rect x="-200" y="-170" width="400" height="340" fill="#efe6d0"/><clipPath id="${id}-c0"><rect x="-184" y="-154" width="368" height="308"/></clipPath>
          <g clip-path="url(#${id}-c0)"><g transform="scale(0.5)">${mapArt(id)}</g></g></g></g>
        <g transform="translate(${X + W - 250},${Y + 420}) rotate(3)"><g id="${id}-im1"><rect x="-200" y="-170" width="400" height="340" fill="#efe6d0"/><clipPath id="${id}-c1"><rect x="-184" y="-154" width="368" height="308"/></clipPath>
          <g clip-path="url(#${id}-c1)" style="filter: sepia(0.8) contrast(1.1)"><rect x="-184" y="-154" width="368" height="308" fill="#3a2a14"/>${[...Array(5)].map((_, i) => `<g transform="translate(${-110 + i * 50},${110 - i * 60}) rotate(${20 + i * 4}) scale(0.6)"><path d="M -26,-60 C -30,-80 30,-80 26,-60 L 30,50 C 30,70 -30,70 -30,50 Z" fill="#120c06" opacity="${i % 2 ? 0.5 : 0.85}"/></g>`).join("")}</g></g></g>
        <text x="${X + 250}" y="${Y + 630}" font-family="Naskh" font-weight="700" font-size="38" fill="#aab4cc" text-anchor="middle">مسیر نقشه</text><text x="${X + W - 250}" y="${Y + 630}" font-family="Naskh" font-weight="700" font-size="38" fill="#aab4cc" text-anchor="middle">ردِ پای مهران</text>
        ${opt(0, Y + 750, "۱", "به پیرمرد اعتماد کنه", "و طبق نقشه بره جلو")}${opt(1, Y + 920, "۲", "نشونه‌ها رو دنبال کنه", "و بره دنبال ردِ پای مهران")}
        </g></g></g>
        <g id="${id}-cur" opacity="0" transform="translate(760,1500)"><path d="M 0,0 L 0,70 L 18,54 L 32,84 L 44,78 L 30,48 L 54,48 Z" fill="#fff" stroke="#111" stroke-width="4" stroke-linejoin="round"/></g>` },
    ],
    js: `
    tl.fromTo("#${id}-pz", { opacity: 1 }, { opacity: 0.3, duration: 0.3, yoyo: true, repeat: 3 }, 0);
    tl.to("#${id}-dim", { opacity: 0.6, duration: 0.35 }, 0.25);
    tl.fromTo("#${id}-win", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)" }, 0.3);
    tl.fromTo(["#${id}-im0", "#${id}-im1"], { opacity: 0, scale: 0.7, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, transformOrigin: "50% 50%", duration: 0.4, stagger: 0.15, ease: "back.out(1.8)" }, 0.75);
    tl.fromTo(["#${id}-o0", "#${id}-o1"], { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.35, stagger: 0.15, ease: "power2.out" }, 1.1);
    tl.set("#${id}-cur", { opacity: 1 }, ${wt("m9", 9) - 0.4});
    tl.fromTo("#${id}-cur", { attr: { transform: "translate(760,1500)" } }, { attr: { transform: "translate(640,${Y + 770})" }, duration: 0.4, ease: "power2.inOut" }, ${wt("m9", 9) - 0.4});
    tl.to("#${id}-ob0", { attr: { fill: "#2e4a8a", stroke: "#8fb4ff" }, duration: 0.2 }, ${wt("m9", 9)}); tl.to(["#${id}-o0", "#${id}-im0"], { scale: 1.06, transformOrigin: "50% 50%", duration: 0.2 }, ${wt("m9", 9)});
    tl.to("#${id}-ob0", { attr: { fill: "#1e2433", stroke: "#3a4560" }, duration: 0.2 }, ${wt("m9", 18) - 0.1}); tl.to(["#${id}-o0", "#${id}-im0"], { scale: 1, duration: 0.2 }, ${wt("m9", 18) - 0.1});
    tl.to("#${id}-cur", { attr: { transform: "translate(640,${Y + 940})" }, duration: 0.35, ease: "power2.inOut" }, ${wt("m9", 18) - 0.3});
    tl.to("#${id}-ob1", { attr: { fill: "#2e4a8a", stroke: "#8fb4ff" }, duration: 0.2 }, ${wt("m9", 18)}); tl.to(["#${id}-o1", "#${id}-im1"], { scale: 1.06, transformOrigin: "50% 50%", duration: 0.2 }, ${wt("m9", 18)});
    tl.to("#${id}-cur", { opacity: 0, duration: 0.2 }, ${(dur - 0.6).toFixed(2)});
    ` }) };
}

export const DURS = Object.fromEntries(Object.entries(WJ).map(([k, v]) => [k, k === "m9" ? Math.round((v.duration + 1.0) * 1000) / 1000 : v.duration]));
export default [m1, m2, m3, m4, m5, m6, m7, m8, m9].map((f) => f(DURS[f.name]));
