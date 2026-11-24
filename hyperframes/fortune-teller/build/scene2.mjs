// SCENE 2 – night street: she waits, a taxi stops beside her, she gets in, it drives away.
import { scene, place, glow, C } from "./lib.mjs";
const P = C.PAL;

const SKY = `<linearGradient id="SKYID" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1326"/><stop offset="1" stop-color="#26304d"/></linearGradient>`;

function buildings(seed = 0) {
  const out = [];
  const blocks = [[-40, 520, 260], [210, 380, 230], [430, 600, 200], [620, 300, 260], [870, 470, 260]];
  blocks.forEach(([x, top, w], bi) => {
    out.push(`<rect x="${x}" y="${top}" width="${w}" height="${1110 - top}" fill="${bi % 2 ? "#1a2036" : "#161b2e"}"/>`);
    for (let r = 0; r < Math.floor((1060 - top) / 90); r++) for (let c = 0; c < Math.floor(w / 70); c++) {
      const lit = ((bi * 7 + r * 3 + c * 5 + seed) % 4) === 0;
      out.push(`<rect x="${x + 22 + c * 70}" y="${top + 34 + r * 90}" width="34" height="48" fill="${lit ? "#f2c46d" : "#232a44"}" opacity="${lit ? 0.85 : 1}"/>`);
    }
  });
  return out.join("");
}

function lamp(x, id) {
  return `<rect x="${x - 7}" y="700" width="14" height="920" fill="#0e121f"/>
    <path d="M ${x - 7},710 C ${x - 7},660 ${x + 80},650 ${x + 110},670 L ${x + 110},680" stroke="#0e121f" stroke-width="12" fill="none"/>
    <path d="M ${x + 80},676 L ${x + 140},676 L ${x + 128},694 L ${x + 92},694 Z" fill="#1a1f30"/>
    <ellipse cx="${x + 110}" cy="696" rx="20" ry="6" fill="#ffe2a0"/>
    <path d="M ${x + 92},696 L ${x + 128},696 L ${x + 300},1620 L ${x - 80},1620 Z" fill="url(#${id})" opacity="0.5"/>`;
}

// ── 2a: medium shot, she waits and watches the traffic ─────────────────────────────────────────────
function s2a() {
  const id = "s2a", dur = 3.6, w = `${id}-w`;
  const bokeh = [[120, 560, 60, "#f2c46d"], [300, 420, 40, "#f2c46d"], [880, 520, 70, "#ffd27a"], [980, 300, 46, "#e35b4a"], [700, 640, 34, "#f2c46d"], [60, 900, 50, "#9fc4ff"], [420, 760, 30, "#ffd27a"], [960, 820, 56, "#f2c46d"]]
    .map(([x, y, r, c]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="0.55"/>`).join("");
  const strap = `<path d="M -150,230 C -60,330 60,500 150,700" stroke="#3a2420" stroke-width="22" fill="none"/>
    <path d="M -150,230 C -60,330 60,500 150,700" stroke="#55352e" stroke-width="6" fill="none" opacity="0.7"/>`;
  return { id, dur, html: scene({ id, dur, fadeIn: true, bg: "#0d1326",
    layers: [
      { name: "bg", blur: 14, defs: SKY.replace("SKYID", `${id}-sky`), svg: `<rect width="1080" height="1920" fill="url(#${id}-sky)"/>${buildings(1)}
        <rect x="0" y="1110" width="1080" height="810" fill="#1b1f2c"/>${bokeh}` },
      { name: "char", svg: place(540, 900, 1.3, C.womanTorso(w) + strap + C.womanHead(w), `${w}-all`) },
      { name: "light", defs: glow(`${id}-hl`, -100, 900, 900, "#fff1cf", 0.9), svg: `<rect id="${id}-beam" width="1080" height="1920" fill="url(#${id}-hl)" opacity="0" style="mix-blend-mode:screen"/>` },
    ],
    js: `
    cam("bg", { scale: 1.1, x: 0 }, { scale: 1.14, x: 20 }, 0, ${dur});
    cam("char", { scale: 1.0 }, { scale: 1.05, y: -10 }, 0, ${dur});
    mouth("${w}", "N", 0, 0.01); brows("${w}", -2, -3, 0, 0.01); look("${w}", 2, 0, 0, 0.01);
    tl.fromTo("#${w}-head", { rotation: 0 }, { rotation: 0, duration: 0.01 }, 0);
    blink("${w}", 0.7);
    turn("${w}", -16, 1.0, 0.6); look("${w}", -8, 1, 1.0, 0.5);
    tl.to("#${w}-head", { rotation: -3, transformOrigin: "50% 80%", duration: 0.6, ease: "power2.inOut" }, 1.0);
    tl.fromTo("#${id}-beam", { opacity: 0 }, { opacity: 0.85, duration: 1.4, ease: "power2.in" }, 2.1);
    eyesOpen("${w}", 0.86, 2.6, 0.3);
    ` }) };
}

// ── the taxi, profile facing right; local (0,0) = ground under the rear bumper, 900 long ───────────
function taxi(p) {
  const wheel = (cx, id) => `<g transform="translate(${cx},-58)"><circle r="60" fill="#121214"/><g id="${id}"><circle r="34" fill="#9aa0a8"/>
      ${[0, 72, 144, 216, 288].map((a) => `<rect x="-5" y="-32" width="10" height="28" rx="3" fill="#6d727a" transform="rotate(${a})"/>`).join("")}
      <circle r="9" fill="#d6dade"/></g></g>`;
  const checks = [...Array(30)].map((_, i) => `<rect x="${60 + i * 26}" y="${i % 2 ? -150 : -138}" width="13" height="12" fill="#1b1b1b"/>`).join("");
  return `
  <g id="${p}">
    <ellipse cx="450" cy="4" rx="470" ry="22" fill="#000" opacity="0.45"/>
    <path d="M 20,-80 C 10,-120 20,-170 60,-178 L 210,-190 C 260,-260 320,-298 420,-302 L 600,-302 C 660,-300 700,-270 750,-200 L 860,-182 C 892,-176 902,-140 898,-100 L 892,-70 L 20,-70 Z" fill="#e7b51f"/>
    <path d="M 20,-80 L 892,-80 L 890,-60 C 890,-40 870,-36 850,-36 L 40,-36 C 26,-36 18,-44 20,-60 Z" fill="#2a2a2c"/>
    <path d="M 60,-178 L 860,-182" stroke="#c9970f" stroke-width="4" fill="none"/>
    ${checks}
    <g id="${p}-interior"><path d="M 300,-286 L 505,-286 L 505,-80 L 300,-80 Z" fill="#14161d"/>
      <path d="M 320,-180 L 470,-180 L 470,-90 L 320,-90 Z" fill="#23262f"/></g>
    <g id="${p}-in" opacity="0"><g transform="translate(410,-150) scale(0.28)">${C.womanHead(`${p}-inh`)}</g></g>
    <path d="M 512,-286 L 600,-290 C 650,-288 684,-262 724,-200 L 512,-200 Z" fill="#2c3a52"/>
    <path d="M 512,-200 L 724,-200 L 736,-180 L 512,-180 Z" fill="#e7b51f"/>
    <path d="M 530,-280 L 560,-282 L 520,-206 L 514,-206 Z" fill="#fff" opacity="0.18"/>
    <g id="${p}-door">
      <path d="M 300,-292 L 505,-292 L 505,-80 L 300,-80 L 296,-180 Z" fill="#e7b51f"/>
      <path d="M 312,-286 L 498,-286 L 498,-200 L 300,-200 C 296,-230 300,-270 312,-286 Z" fill="#2c3a52" opacity="0.82"/>
      <path d="M 330,-282 L 360,-284 L 320,-206 L 312,-206 Z" fill="#fff" opacity="0.18"/>
      <path d="M 300,-180 L 505,-180" stroke="#c9970f" stroke-width="3"/>
      <rect x="320" y="-170" width="40" height="9" rx="4" fill="#3a3a3a"/>
      <path d="M 300,-292 L 300,-80" stroke="#b78a0c" stroke-width="3"/>
    </g>
    <path d="M 505,-292 L 505,-80" stroke="#b78a0c" stroke-width="4"/>
    <path d="M 210,-190 C 240,-240 270,-272 300,-284 L 300,-200 L 200,-200 Z" fill="#2c3a52"/>
    <rect x="410" y="-336" width="110" height="34" rx="6" fill="#f4f1e6"/><rect x="410" y="-312" width="110" height="10" fill="#d8d2bd"/>
    <text x="465" y="-311" font-family="Vazirmatn" font-size="22" fill="#1b1b1b" text-anchor="middle" direction="rtl">تاکسی</text>
    <path d="M 872,-160 L 898,-152 L 896,-128 L 868,-132 Z" fill="#fff6d8"/>
    <path d="M 24,-160 L 50,-166 L 52,-136 L 22,-134 Z" fill="#d93b2e"/>
    ${wheel(190, `${p}-wb`)}${wheel(730, `${p}-wf`)}
  </g>`;
}

// ── 2b: wide shot, the taxi stops, she gets in, it drives away ─────────────────────────────────────
function s2b() {
  const id = "s2b", dur = 9.0, f = `${id}-f`, t = `${id}-t`;
  const stopX = 120, carY = 1478;
  const herStart = 300, herDoor = 420;
  const T = (x, y, s) => `translate(${x},${y}) scale(${s})`;
  const wheelTurn = (dist) => Math.round((dist / (2 * Math.PI * 60)) * 360);
  let js = `
    cam("street", { scale: 1.32, origin: "45% 74%" }, { scale: 1.38, x: -14, origin: "45% 74%" }, 0, ${dur});
    cam("car", { scale: 1.32, origin: "45% 74%" }, { scale: 1.38, x: -14, origin: "45% 74%" }, 0, ${dur});
    cam("her", { scale: 1.32, origin: "45% 74%" }, { scale: 1.38, x: -14, origin: "45% 74%" }, 0, ${dur});
    tl.fromTo("#${t}-pos", { attr: { transform: "translate(-1000,${carY})" } }, { attr: { transform: "translate(${stopX},${carY})" }, duration: 2.8, ease: "power2.out" }, 0);
    tl.fromTo(["#${t}-wb", "#${t}-wf"], { rotation: 0 }, { rotation: ${wheelTurn(1000 + stopX)}, duration: 2.8, ease: "power2.out", transformOrigin: "50% 50%" }, 0);
    tl.fromTo("#${t}-beam", { opacity: 0.9 }, { opacity: 0.25, duration: 2.8, ease: "power2.out" }, 0);
    mouth("${f}-h", "N", 0, 0.01);
    turn("${f}-h", -14, 0.2, 0.5); look("${f}-h", -7, 1, 0.2, 0.4);
    turn("${f}-h", 6, 2.0, 0.6); look("${f}-h", 4, 2, 2.0, 0.5);
    tl.fromTo("#${f}-pos", { attr: { transform: "${T(herStart, 1640, 0.46)}" } }, { attr: { transform: "${T(herDoor, 1636, 0.46)}" }, duration: 1.0, ease: "power1.inOut" }, 2.9);
  `;
  for (let k = 0; k < 3; k++) {
    const a = k % 2 ? 1 : -1, tt = (2.9 + k * 0.33).toFixed(2);
    js += `tl.to("#${f}-legL", { rotation: ${12 * a}, svgOrigin: "-26 -360", duration: 0.33, ease: "sine.inOut" }, ${tt});
    tl.to("#${f}-legR", { rotation: ${-12 * a}, svgOrigin: "26 -360", duration: 0.33, ease: "sine.inOut" }, ${tt});\n`;
  }
  js += `
    tl.to(["#${f}-legL", "#${f}-legR"], { rotation: 0, duration: 0.2 }, 3.9);
    tl.to("#${f}-armR", { rotation: -50, svgOrigin: "70 -790", duration: 0.35, ease: "power2.out" }, 3.7);
    tl.fromTo("#${t}-door", { scaleX: 1 }, { scaleX: 0.2, transformOrigin: "100% 50%", duration: 0.55, ease: "power2.inOut" }, 3.95);
    tl.to("#${f}-armR", { rotation: 0, svgOrigin: "70 -790", duration: 0.3 }, 4.4);
    tl.to("#${f}-pos", { attr: { transform: "${T(herDoor + 90, 1560, 0.4)}" }, duration: 0.6, ease: "power1.in" }, 4.45);
    tl.to("#${f}", { opacity: 0, duration: 0.25 }, 4.8);
    tl.fromTo("#${t}-in", { opacity: 0 }, { opacity: 1, duration: 0.35 }, 4.85);
    tl.to("#${t}-door", { scaleX: 1, transformOrigin: "100% 50%", duration: 0.4, ease: "power3.in" }, 5.3);
    tl.to("#${t}-pos", { attr: { transform: "translate(1300,${carY})" }, duration: 2.4, ease: "power2.in" }, 6.0);
    tl.to(["#${t}-wb", "#${t}-wf"], { rotation: "+=${wheelTurn(1300 - stopX)}", duration: 2.4, ease: "power2.in", transformOrigin: "50% 50%" }, 6.0);
    tl.to("#${t}-beam", { opacity: 0.9, duration: 1.0 }, 6.0);
  `;
  return { id, dur, html: scene({ id, dur, fadeIn: true, fadeOut: true, bg: "#0d1326", extraStyle: `@font-face { font-family: "Vazirmatn"; src: url('assets/fonts/Vazirmatn-SemiBold.ttf') format('truetype'); }`,
    layers: [
      { name: "street", defs: SKY.replace("SKYID", `${id}-sky`) + glow(`${id}-lg`, 0, 0, 1, "#ffe2a0", 0.8).replace('gradientUnits="userSpaceOnUse"', "").replace(/cx="0" cy="0" r="1"/, 'cx="0.5" cy="0" r="1"'), svg: `
        <rect width="1080" height="1920" fill="url(#${id}-sky)"/>
        <circle cx="860" cy="250" r="44" fill="#e9e6d6" opacity="0.9"/>
        ${buildings(2)}
        <rect x="0" y="1100" width="1080" height="70" fill="#2a2e3b"/>
        <rect x="0" y="1166" width="1080" height="12" fill="#3a3f4f"/>
        <rect x="0" y="1178" width="1080" height="330" fill="#1c1f29"/>
        ${[...Array(6)].map((_, i) => `<rect x="${i * 220 - 40}" y="1330" width="120" height="10" fill="#c9c6b8" opacity="0.5"/>`).join("")}
        <rect x="0" y="1508" width="1080" height="18" fill="#4a4f5e"/>
        <rect x="0" y="1526" width="1080" height="400" fill="#2b2f3c"/>
        ${[...Array(8)].map((_, i) => `<path d="M ${i * 160},1526 L ${i * 160 - 60},1920" stroke="#23262f" stroke-width="4"/>`).join("")}
        ${lamp(110, `${id}-lg`)}` },
      { name: "car", defs: glow(`${id}-bm`, 0, 0, 1, "#fff1cf", 0.7).replace('gradientUnits="userSpaceOnUse"', "").replace(/cx="0" cy="0" r="1"/, 'cx="0" cy="0.5" r="1"'), svg: `
        <g id="${t}-pos" transform="translate(-1000,${carY})">
          <path id="${t}-beam" d="M 896,-140 L 1500,-260 L 1500,40 Z" fill="url(#${id}-bm)" opacity="0.9"/>
          ${taxi(t)}
        </g>` },
      { name: "her", svg: `<g id="${f}-pos" transform="${T(herStart, 1640, 0.46)}"><g id="${f}">${C.womanFull(f)}</g></g>` },
    ],
    js }) };
}

export default [s2a(), s2b()];
export { taxi, buildings, lamp };
