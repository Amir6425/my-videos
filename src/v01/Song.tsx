// v01 — a 15 s song clip, illustrated line by line on black. No captions (only the heart line is written, as asked).
// Timing comes from the track itself: vocals enter at 2.2 s, the beat drops at 3.76 s, then a bar every 1.26 s;
// each sung line takes two bars (3.76, 6.28, 8.80, 11.32, 13.84).
import React from "react";
import { AbsoluteFill, Audio, interpolate, random, Sequence, staticFile, useCurrentFrame, Easing } from "remotion";
import { FONT_NUM } from "../fonts";

const FPS = 30;
export const V01_FRAMES = Math.round(15.25 * FPS);
const fr = (s: number) => Math.round(s * FPS);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// interpolate over seconds, measured in the scene's own clock
const ip = (t: number, a: number[], b: number[], ease?: (x: number) => number) => interpolate(t, a, b, { ...cl, easing: ease });
const useT = () => useCurrentFrame() / FPS;
const shake = (t: number, t0: number, dur: number, amp: number) => {
  const k = ip(t, [t0, t0 + dur], [1, 0]);
  return t < t0 ? [0, 0] : [Math.sin(t * 90) * amp * k, Math.cos(t * 77) * amp * k];
};

const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, ...style }}>{children}</svg>
);
const HEART = "M 0,120 C -40,80 -220,-20 -220,-130 C -220,-230 -120,-280 -50,-250 C -20,-236 -6,-210 0,-190 C 6,-210 20,-236 50,-250 C 120,-280 220,-230 220,-130 C 220,-20 40,80 0,120 Z";
const CRACK = "M 0,-190 L -22,-130 L 18,-80 L -16,-20 L 14,40 L 0,120";
const LEFT = `M 0,-190 C -6,-210 -20,-236 -50,-250 C -120,-280 -220,-230 -220,-130 C -220,-20 -40,80 0,120 L 14,40 L -16,-20 L 18,-80 L -22,-130 Z`;
const RIGHT = `M 0,-190 C 6,-210 20,-236 50,-250 C 120,-280 220,-230 220,-130 C 220,-20 40,80 0,120 L 14,40 L -16,-20 L 18,-80 L -22,-130 Z`;
const Glow: React.FC<{ id: string; c: string }> = ({ id, c }) => (
  <radialGradient id={id}><stop offset="0" stopColor={c} stopOpacity="0.9" /><stop offset="1" stopColor={c} stopOpacity="0" /></radialGradient>
);
const Car: React.FC<{ body?: string; crushed?: number }> = ({ body = "#d8262c", crushed = 0 }) => (
  <g>
    <path d={`M -200,-20 L -190,-70 L -90,-80 L -40,-140 L 90,-140 L 150,-80 L ${200 - crushed * 60},-60 L ${200 - crushed * 70},10 L -200,10 Z`} fill={body} />
    <path d="M -30,-128 L 80,-128 L 128,-82 L -70,-82 Z" fill="#9fd4ff" opacity="0.85" />
    <path d="M 22,-128 L 30,-82" stroke={body} strokeWidth="10" />
    <rect x={186 - crushed * 66} y="-50" width="16" height="20" rx="4" fill="#fff6c0" />
    <rect x="-202" y="-56" width="14" height="22" rx="4" fill="#ff3030" />
    {[-120, 120].map((x) => (
      <g key={x} transform={`translate(${x - (x > 0 ? crushed * 30 : 0)},10)`}><circle r="44" fill="#111" stroke="#444" strokeWidth="8" /><circle r="16" fill="#888" /></g>
    ))}
  </g>
);

// ── 1. «میرسیم بازم بهم هرطوری» — two lights cross the dark and meet on the drop ───────────────────────
const Meet: React.FC = () => {
  const t = useT(), M = 3.76;
  const p = ip(t, [0.2, M], [0, 1], Easing.in(Easing.cubic));
  const a = { x: interpolate(p, [0, 1], [140, 540]), y: interpolate(p, [0, 1], [1700, 900]) - Math.sin(p * Math.PI) * 300 };
  const b = { x: interpolate(p, [0, 1], [940, 540]), y: interpolate(p, [0, 1], [180, 900]) + Math.sin(p * Math.PI) * 300 };
  const trail = (c: string, from: number) => Array.from({ length: 14 }, (_, i) => {
    const q = Math.max(0, p - i * 0.018);
    const x = from ? interpolate(q, [0, 1], [940, 540]) : interpolate(q, [0, 1], [140, 540]);
    const y = from ? interpolate(q, [0, 1], [180, 900]) + Math.sin(q * Math.PI) * 300 : interpolate(q, [0, 1], [1700, 900]) - Math.sin(q * Math.PI) * 300;
    return <circle key={i} cx={x} cy={y} r={18 - i} fill={c} opacity={(1 - i / 14) * 0.5} />;
  });
  const boom = ip(t, [M, M + 0.5], [0, 1], Easing.out(Easing.cubic));
  const after = t >= M;
  return (
    <Svg>
      <defs><Glow id="ga" c="#4fb6ff" /><Glow id="gb" c="#ff4f8a" /><Glow id="gw" c="#ffffff" /></defs>
      {!after && <>{trail("#4fb6ff", 0)}{trail("#ff4f8a", 1)}
        <circle cx={a.x} cy={a.y} r="90" fill="url(#ga)" /><circle cx={a.x} cy={a.y} r="22" fill="#d8f0ff" />
        <circle cx={b.x} cy={b.y} r="90" fill="url(#gb)" /><circle cx={b.x} cy={b.y} r="22" fill="#ffe0ec" /></>}
      {after && <>
        <circle cx="540" cy="900" r={60 + boom * 900} fill="none" stroke="#fff" strokeWidth={30 * (1 - boom)} opacity={1 - boom} />
        <circle cx="540" cy="900" r={300 * (1 - boom * 0.6)} fill="url(#gw)" opacity={1 - boom * 0.7} />
        <g transform={`translate(540,900) scale(${0.3 + boom * 0.3})`} opacity={boom}><path d={HEART} fill="#ff2a55" /></g></>}
    </Svg>
  );
};

// ── 2. «چرا دروغ گفتی بهم عاشقم شدی؟» — the line is written, a heart is drawn, then it breaks ─────────────
const Lie: React.FC = () => {
  const t = useT() + 3.7; // global seconds
  const draw = ip(t, [3.78, 4.7], [1, 0], Easing.inOut(Easing.cubic));
  const fill = ip(t, [4.7, 5.0], [0, 1]);
  const beat = t > 5.0 ? 1 + 0.08 * Math.max(0, Math.sin((t - 5.0) * Math.PI / 0.315)) * ip(t, [5.0, 5.6], [1, 0]) : 1;
  const crack = ip(t, [5.62, 5.8], [1, 0]);
  const split = ip(t, [5.94, 6.25], [0, 1], Easing.in(Easing.quad));
  const words = ["چرا", "دروغ", "گفتی", "بهم", "عاشقم", "شدی؟"];
  const wt = [3.8, 4.05, 4.3, 4.55, 4.9, 5.25];
  const [sx, sy] = shake(t, 5.94, 0.3, 14);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 330, width: "100%", textAlign: "center", direction: "rtl", fontFamily: FONT_NUM, fontSize: 104, color: "#fff", lineHeight: 1.35 }}>
        {words.map((w, i) => (
          <span key={i} style={{ opacity: ip(t, [wt[i], wt[i] + 0.15], [0, 1]), display: "inline-block", margin: "0 14px",
            transform: `translateY(${ip(t, [wt[i], wt[i] + 0.15], [30, 0])}px)`, color: i === 1 ? "#ff3d61" : "#fff" }}>{w}{i === 3 ? <br /> : null}</span>
        ))}
      </div>
      <Svg style={{ transform: `translate(${sx}px,${sy}px)` }}>
        <g transform={`translate(540,1180) scale(${1.6 * beat})`}>
          {split === 0 ? <>
            <path d={HEART} fill="#ff2a55" opacity={fill} />
            <path d={HEART} fill="none" stroke="#ff2a55" strokeWidth="10" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={draw} />
            {t > 5.62 && <path d={CRACK} fill="none" stroke="#000" strokeWidth="12" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={crack} />}
          </> : <>
            <path d={LEFT} fill="#ff2a55" transform={`translate(${-split * 160},${split * split * 500}) rotate(${-split * 30})`} />
            <path d={RIGHT} fill="#ff2a55" transform={`translate(${split * 160},${split * split * 500}) rotate(${split * 30})`} />
          </>}
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

// ── 3. «رو ۱۸۰ تا ترمزم برید» — needle to 180, the brake fails, the car hits the mountain ─────────────────
const Crash: React.FC = () => {
  const t = useT() + 6.2;
  const sp = ip(t, [6.28, 7.54], [0, 180], Easing.in(Easing.quad));
  const ang = -120 + (sp / 220) * 240;
  const gauge = t < 7.62;
  const brake = t > 6.9 && t < 7.62 && Math.floor(t * 10) % 2 === 0;
  // car run: 7.62 → impact 8.62
  const run = ip(t, [7.62, 8.62], [0, 1], Easing.in(Easing.quad));
  const hit = t >= 8.62;
  const carX = hit ? 640 : interpolate(run, [0, 1], [-260, 640]);
  const [sx, sy] = shake(t, 8.62, 0.35, 30);
  const fl = t < 8.62 ? 0 : ip(t, [8.62, 8.8], [1, 0]);
  return (
    <AbsoluteFill>
      {gauge ? (
        <Svg>
          <g transform="translate(540,960)">
            <circle r="380" fill="#0c0c10" stroke="#2a2a33" strokeWidth="16" />
            {Array.from({ length: 12 }, (_, i) => { const a = (-120 + i * 240 / 11) * Math.PI / 180, red = i * 20 >= 160;
              return <g key={i}><line x1={Math.sin(a) * 300} y1={-Math.cos(a) * 300} x2={Math.sin(a) * 350} y2={-Math.cos(a) * 350} stroke={red ? "#ff3030" : "#ddd"} strokeWidth="10" />
                <text x={Math.sin(a) * 245} y={-Math.cos(a) * 245 + 16} fill={red ? "#ff4040" : "#bbb"} fontFamily={FONT_NUM} fontSize="44" textAnchor="middle">{i * 20}</text></g>; })}
            <g transform={`rotate(${ang})`}><path d="M -14,0 L 0,-330 L 14,0 Z" fill="#ff2a2a" /></g><circle r="34" fill="#333" />
            <text y="190" fill="#fff" fontFamily={FONT_NUM} fontSize="150" textAnchor="middle">{Math.round(sp)}</text>
            <g transform="translate(0,-130)" opacity={brake ? 1 : 0.12}><circle r="52" fill="none" stroke="#ff2a2a" strokeWidth="10" />
              <text y="22" fill="#ff2a2a" fontFamily={FONT_NUM} fontSize="64" textAnchor="middle">!</text></g>
          </g>
        </Svg>
      ) : (
        <Svg style={{ transform: `translate(${sx}px,${sy}px)` }}>
          <path d="M 560,1300 L 820,620 L 920,800 L 1000,560 L 1200,1300 Z" fill="#3a3a44" /><path d="M 820,620 L 760,780 L 840,740 L 880,700 Z M 1000,560 L 960,670 L 1020,640 L 1060,700 L 1040,620 Z" fill="#e8e8f0" />
          <rect y="1300" width="1080" height="12" fill="#333" />
          {!hit && Array.from({ length: 10 }, (_, i) => <rect key={i} x={((i * 157 - t * 2600) % 1300 + 1300) % 1300 - 200} y={1000 + i * 26} width="160" height="5" fill="#fff" opacity="0.35" />)}
          <g transform={`translate(${carX},1250) ${hit ? "rotate(-8)" : ""}`}><Car crushed={hit ? 1 : 0} /></g>
          {hit && Array.from({ length: 18 }, (_, i) => { const k = ip(t, [8.62, 9.0], [0, 1], Easing.out(Easing.cubic)), a = random(`d${i}`) * Math.PI * 2, r = 80 + random(`r${i}`) * 300;
            return <rect key={i} x={850 + Math.cos(a) * r * k} y={1200 + Math.sin(a) * r * k - k * 100} width="22" height="14" fill={i % 3 ? "#d8262c" : "#ffcc33"} opacity={1 - k * 0.6} transform={`rotate(${i * 40} ${850 + Math.cos(a) * r * k} ${1200 + Math.sin(a) * r * k})`} />; })}
          <rect width="1080" height="1920" fill="#fff" opacity={fl} />
        </Svg>
      )}
    </AbsoluteFill>
  );
};

// ── 4. «بیا باهم یه شب تو جاده مست کنیم» — a night road under the moon, two glasses clink ───────────────────
const Night: React.FC = () => {
  const t = useT() + 8.8;
  const sway = Math.sin(t * 2.4) * 4;
  const g = ip(t, [9.5, 10.06], [0, 1], Easing.in(Easing.quad));
  const clink = t >= 10.06;
  const tilt = clink ? Math.sin((t - 10.06) * 12) * 4 * ip(t, [10.06, 10.8], [1, 0]) : 0;
  const glass = (side: number) => (
    <g transform={`translate(${540 + side * interpolate(g, [0, 1], [330, 70])},1150) rotate(${side * (-12 + g * 6) + tilt * side})`}>
      <path d="M -60,-130 L 60,-130 L 40,40 L -40,40 Z" fill="#fff" opacity="0.15" stroke="#fff" strokeWidth="5" />
      <path d="M -52,-60 L 52,-60 L 40,40 L -40,40 Z" fill="#ffb02e" opacity="0.85" />
      <rect x="-8" y="40" width="16" height="70" fill="#fff" opacity="0.6" /><rect x="-50" y="108" width="100" height="10" rx="5" fill="#fff" opacity="0.6" />
    </g>
  );
  const sp = ip(t, [10.06, 10.5], [0, 1]);
  return (
    <Svg style={{ transform: `rotate(${sway * 0.3}deg)` }}>
      <defs><Glow id="gm" c="#f6f0c8" /></defs>
      <circle cx="780" cy="330" r="240" fill="url(#gm)" opacity="0.5" /><circle cx="780" cy="330" r="110" fill="#f6f0c8" />
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={random(`sx${i}`) * 1080} cy={random(`sy${i}`) * 700} r={1 + random(`ss${i}`) * 3} fill="#fff" opacity={0.3 + 0.5 * Math.abs(Math.sin(t * 2 + i))} />)}
      <path d="M 480,820 L 600,820 L 1080,1920 L 0,1920 Z" fill="#141418" />
      {Array.from({ length: 8 }, (_, i) => { const z = ((i / 8 + t * 0.9) % 1), y = 820 + z * z * 1100, w = 4 + z * 26, h = 10 + z * 120;
        return <rect key={i} x={540 - w / 2} y={y} width={w} height={h} fill="#e8d860" opacity={0.3 + z * 0.7} />; })}
      <g transform={`translate(${540 + sway * 6},1560) scale(1.1)`}>
        <path d="M -220,0 L -200,-130 L -130,-210 L 130,-210 L 200,-130 L 220,0 Z" fill="#1e1e26" /><path d="M -110,-196 L 110,-196 L 160,-136 L -160,-136 Z" fill="#2c3550" />
        <rect x="-200" y="-100" width="70" height="30" rx="8" fill="#ff2a2a" /><rect x="130" y="-100" width="70" height="30" rx="8" fill="#ff2a2a" />
        <circle cx="-165" cy="-85" r="70" fill="#ff2a2a" opacity="0.18" /><circle cx="165" cy="-85" r="70" fill="#ff2a2a" opacity="0.18" />
        <rect x="-230" y="-10" width="80" height="40" rx="10" fill="#0a0a0c" /><rect x="150" y="-10" width="80" height="40" rx="10" fill="#0a0a0c" />
      </g>
      {glass(-1)}{glass(1)}
      {clink && Array.from({ length: 10 }, (_, i) => { const a = i * 36 * Math.PI / 180; return <line key={i} x1={540 + Math.cos(a) * (40 + sp * 60)} y1={1030 + Math.sin(a) * (40 + sp * 60)} x2={540 + Math.cos(a) * (60 + sp * 120)} y2={1030 + Math.sin(a) * (60 + sp * 120)} stroke="#fff6c0" strokeWidth="6" opacity={1 - sp} />; })}
    </Svg>
  );
};

// ── 5. «شاید آشتی کردیم و مال هم…» — the two halves drift back and join ───────────────────────────────────
const Mend: React.FC = () => {
  const t = useT() + 11.32;
  const j = ip(t, [11.4, 12.58], [1, 0], Easing.inOut(Easing.cubic));
  const joined = t >= 12.58;
  const burst = ip(t, [12.58, 13.1], [0, 1], Easing.out(Easing.cubic));
  const pulse = 1 + 0.1 * Math.max(0, Math.sin((t - 12.58) * Math.PI / 0.63)) * (joined ? 1 : 0);
  return (
    <Svg>
      <defs><Glow id="gh" c="#ff2a55" /></defs>
      {joined && <circle cx="540" cy="960" r={200 + burst * 600} fill="url(#gh)" opacity={1 - burst * 0.8} />}
      <g transform={`translate(540,960) scale(${1.7 * pulse})`}>
        {!joined ? <>
          <path d={LEFT} fill="#ff2a55" transform={`translate(${-j * 300},${Math.sin(t * 3) * 20 * j}) rotate(${-j * 25})`} />
          <path d={RIGHT} fill="#ff2a55" transform={`translate(${j * 300},${-Math.sin(t * 3) * 20 * j}) rotate(${j * 25})`} />
        </> : <><path d={HEART} fill="#ff2a55" /><path d={CRACK} fill="none" stroke="#ffb0c0" strokeWidth="4" opacity={1 - burst} /></>}
      </g>
    </Svg>
  );
};

// ── 6. «حیف ما… تو جاده چپ کنیم» — the car flips over on the road ────────────────────────────────────────
const Flip: React.FC = () => {
  const t = useT() + 13.84;
  const x = ip(t, [13.84, 14.9], [-200, 760]);
  const r = ip(t, [14.1, 14.9], [0, 540], Easing.out(Easing.quad));
  const hop = t > 14.1 && t < 14.9 ? Math.abs(Math.sin((t - 14.1) / 0.8 * Math.PI * 1.5)) * 260 : 0;
  const [sx, sy] = shake(t, 14.32, 0.5, 18);
  const fade = ip(t, [14.95, 15.25], [0, 1]);
  return (
    <Svg style={{ transform: `translate(${sx}px,${sy}px)` }}>
      <rect y="1250" width="1080" height="14" fill="#333" />
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={((i * 220 - t * 1500) % 1320 + 1320) % 1320 - 200} y="1290" width="110" height="10" fill="#555" />)}
      <g transform={`translate(${x},${1200 - hop}) rotate(${r})`}><g transform="translate(0,20)"><Car /></g></g>
      {t > 14.32 && Array.from({ length: 12 }, (_, i) => { const k = ip(t, [14.32, 14.8], [0, 1]); return <circle key={i} cx={420 + i * 30 + k * 60} cy={1250 - k * (60 + random(`f${i}`) * 140)} r={5} fill="#ffcc33" opacity={1 - k} />; })}
      <rect width="1080" height="1920" fill="#000" opacity={fade} />
    </Svg>
  );
};

const SCENES: [React.FC, number, number][] = [[Meet, 0, 3.7], [Lie, 3.7, 6.2], [Crash, 6.2, 8.8], [Night, 8.8, 11.32], [Mend, 11.32, 13.84], [Flip, 13.84, 15.25]];
export const Song: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {SCENES.map(([C, a, b], i) => (
      <Sequence key={i} from={fr(a)} durationInFrames={fr(b) - fr(a)}><C /></Sequence>
    ))}
    <Audio src={staticFile("music/v01-song.mp3")} />
  </AbsoluteFill>
);
