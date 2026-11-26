// Archive photo cards laid over the animation at chosen moments: an old print in a worn paper frame, film grain,
// a slow push-in, and a typed label under it (name — year). Each card is its own composition on the main timeline.
import fs from "node:fs";
import path from "node:path";
const NASKH = `@font-face { font-family: "Naskh"; src: url('assets/fonts/NotoNaskh-Bold.woff2') format('woff2'); font-weight: 700; }`;
// t0/t1: seconds on the film's clock; x,y: card centre; w,h: the photo window; paper: keep the print's own colour (newspapers)
export const CARDS = [
  { id: "a1", href: "bessie.jpg", label: "بسی ماندی — ۱۹۱۲", t0: 11.35, t1: 17.5, x: 500, y: 470, w: 330, h: 420, rot: -3 },
  { id: "a2", href: "alice.jpg", label: "آلیس برنهام — ۱۹۱۳", t0: 24.95, t1: 27.95, x: 760, y: 440, w: 320, h: 400, rot: 3 },
  { id: "a3", href: "margaret.jpg", label: "مارگارت لافتی — ۱۹۱۴", t0: 32.45, t1: 40.0, x: 330, y: 450, w: 320, h: 420, rot: -2.5 },
  { id: "a4", href: "burnham.jpg", label: "چارلز برنهام، پدر آلیس", t0: 47.8, t1: 50.85, x: 780, y: 470, w: 250, h: 520, rot: 2.5 },
  { id: "a6", href: "spilsbury.jpg", label: "سر برنارد اسپیلزبری — پزشک قانونی", t0: 109.35, t1: 115.6, x: 540, y: 460, w: 560, h: 446, rot: -2 },
];
function card(c) {
  const { id, w = 0, h = 0 } = c, d = +(c.t1 - c.t0).toFixed(2);
  const fw = w + 44, fh = h + 44;
  const edge = (W, H) => { let s = 7; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647) * 5; // a slightly uneven paper edge
    const pts = []; for (let i = 0; i <= 10; i++) pts.push([-W / 2 + (W * i) / 10, -H / 2 + r()]); for (let i = 0; i <= 10; i++) pts.push([W / 2 - r(), -H / 2 + (H * i) / 10]);
    for (let i = 0; i <= 10; i++) pts.push([W / 2 - (W * i) / 10, H / 2 - r()]); for (let i = 0; i <= 10; i++) pts.push([-W / 2 + r(), H / 2 - (H * i) / 10]);
    return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" "); };
  const ty = c.tagOnly ? 0 : h / 2 + 64, tw = Math.max(380, c.label.length * 26);
  const tag = `<g transform="translate(0,${ty}) rotate(${c.tagOnly ? 0 : -c.rot * 0.6})"><rect x="${-tw / 2 + 6}" y="-30" width="${tw}" height="64" fill="#000" opacity="0.35" transform="translate(6,8)"/>
      <rect x="${-tw / 2}" y="-34" width="${tw}" height="64" fill="#efe7d2"/><rect x="${-tw / 2}" y="-34" width="${tw}" height="64" fill="#7a5a2a" opacity="0.08"/>
      <clipPath id="${id}-tc"><rect id="${id}-tr" x="${tw / 2}" y="-34" width="0" height="64"/></clipPath>
      <text x="0" y="10" clip-path="url(#${id}-tc)" font-family="Naskh" font-weight="700" font-size="34" fill="#1a1410" text-anchor="middle">${c.label}</text></g>`;
  const body = c.tagOnly ? tag : `<polygon points="${edge(fw, fh)}" fill="#000" opacity="0.45" transform="translate(12,16)"/>
      <polygon points="${edge(fw, fh)}" fill="#e9e0c8"/><polygon points="${edge(fw, fh)}" fill="#8a6a3a" opacity="0.12"/>
      <clipPath id="${id}-pc"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}"/></clipPath>
      <g clip-path="url(#${id}-pc)"><g id="${id}-z"><image href="assets/img/real/${c.href}" x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" preserveAspectRatio="xMidYMin slice"
        style="filter: ${c.paper ? "sepia(0.35) contrast(1.05)" : "grayscale(1) sepia(0.28) contrast(1.1) brightness(1.03)"}"/></g>
        <image href="assets/img/texture.png" x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" opacity="0.35" style="mix-blend-mode: multiply"/>
        <rect id="${id}-flk" x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#fff" opacity="0"/>
        <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="url(#${id}-vg)"/></g>
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="none" stroke="#3a2e20" stroke-width="2" opacity="0.6"/>
      <rect x="${-56}" y="${-fh / 2 - 16}" width="112" height="34" fill="#d8ccb0" opacity="0.85" transform="rotate(${-4 + c.rot})"/>${tag}`;
  const flick = [...Array(Math.floor(d * 6))].map((_, k) => `tl.set("#${id}-flk", { opacity: ${(0.02 + 0.03 * Math.abs(Math.sin(k * 2.3))).toFixed(3)} }, ${(k / 6).toFixed(2)});`).join(" ");
  return `<template>
  <style>${NASKH} #root { position: absolute; inset: 0; pointer-events: none; }</style>
  <div id="root" data-composition-id="${id}" data-width="1080" data-height="1920">
    <svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0">
      <defs><radialGradient id="${id}-vg" cx="50%" cy="45%" r="70%"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/></radialGradient></defs>
      <g transform="translate(${c.x},${c.y}) rotate(${c.rot})"><g id="${id}-card" opacity="0">${body}</g></g>
    </svg>
  </div>
  <script>(function () { const tl = gsap.timeline({ paused: true });
    tl.fromTo("#${id}-card", { opacity: 0, scale: 1.12, rotation: 3, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, rotation: 0, transformOrigin: "50% 50%", duration: 0.5, ease: "power3.out" }, 0);
    ${c.tagOnly ? "" : `tl.fromTo("#${id}-z", { scale: 1.0, transformOrigin: "50% 40%" }, { scale: 1.09, transformOrigin: "50% 40%", duration: ${d}, ease: "none" }, 0); ${flick}`}
    tl.fromTo("#${id}-tr", { attr: { x: ${tw / 2}, width: 0 } }, { attr: { x: ${-tw / 2}, width: ${tw} }, duration: ${Math.min(1.2, c.label.length * 0.05).toFixed(2)}, ease: "steps(${c.label.length})" }, ${c.tagOnly ? 0.15 : 0.55});
    tl.to("#${id}-card", { opacity: 0, duration: 0.35, ease: "power2.in" }, ${(d - 0.35).toFixed(2)});
    tl.to({}, { duration: ${d} }, 0); window.__timelines["${id}"] = tl; })();</script>
</template>
`;
}
export default function archive(root) {
  return CARDS.map((c) => { fs.writeFileSync(path.join(root, "compositions", `${c.id}.html`), card(c));
    return `      <div id="${c.id}" data-composition-id="${c.id}" data-composition-src="compositions/${c.id}.html" data-start="${c.t0}" data-duration="${(c.t1 - c.t0).toFixed(2)}" data-track-index="5" data-track-kind="graphics" data-width="1080" data-height="1920"></div>`; }).join("\n");
}
