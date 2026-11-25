"""Ambience and effects for part five, all synthesised (deterministic). Rain on the roof, fire crackle, an occasional
gust, under the narrator; plus the cues of each shot. Writes assets/audio/fx.mp3. Run after build/build.mjs (timing.json)."""
import json, os, subprocess
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, "..")
TM = json.load(open(os.path.join(HERE, "timing.json"))); TOTAL, S = TM["total"], TM["starts"]
SR = 44100; N = int((TOTAL + 0.5) * SR); t = np.arange(N) / SR
rng = np.random.default_rng(5)

def lp(x, a):  # one-pole low-pass, a in (0,1): higher = darker
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc = a * acc + (1 - a) * x[i]; y[i] = acc
    return y
def lpf(x, fc):  # fast FFT low-pass
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X[f > fc] = 0; return np.fft.irfft(X, len(x))
def bpf(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X[(f < lo) | (f > hi)] = 0; return np.fft.irfft(X, len(x))
def at(sec): return int(sec * SR)
def add(buf, sig, sec, g=1.0):
    i = at(sec); j = min(len(buf), i + len(sig))
    if i < len(buf): buf[i:j] += g * sig[: j - i]
def env(n, a=0.005, r=0.1):
    e = np.ones(n); na, nr = min(n, int(a * SR)), min(n, int(r * SR))
    e[:na] = np.linspace(0, 1, na); e[n - nr:] *= np.linspace(1, 0, nr); return e

amb = np.zeros(N); fx = np.zeros(N)
# rain on the roof: soft wide noise + droplets
noise = rng.standard_normal(N)
rain = bpf(noise, 400, 6000) * 0.035 + lpf(rng.standard_normal(N), 900) * 0.03
drops = np.zeros(N); idx = rng.integers(0, N - 2000, int(TOTAL * 70))
for i in idx: drops[i:i + 400] += np.exp(-np.arange(400) / 60) * rng.uniform(0.01, 0.04) * np.sin(np.arange(400) * rng.uniform(0.3, 0.8))
rain += drops
# fire: low rumble + crackles
fire = lpf(rng.standard_normal(N), 200) * 0.05
for c in rng.uniform(0, TOTAL, int(TOTAL * 6)):
    n = int(rng.uniform(0.004, 0.02) * SR); add(fire, bpf(rng.standard_normal(n + 64), 1500, 8000)[:n] * np.exp(-np.arange(n) / (n / 4)) * rng.uniform(0.04, 0.12), c)
# wind: slow gusts (base), more where the shots ask
def gust_env(points):  # piecewise-linear envelope from (time, level) points
    xs, ys = zip(*points); return np.interp(t, xs, ys)
windn = bpf(rng.standard_normal(N), 150, 1200)
wmod = 0.6 + 0.4 * np.sin(2 * np.pi * 0.23 * t) * np.sin(2 * np.pi * 0.07 * t + 1)
f7, f9, f10 = S["f7"], S["f9"], S["f10"]
wlev = gust_env([(0, 0.15), (10, 0.25), (14, 0.1), (f7, 0.15), (f7 + 3.5, 0.75), (f7 + 4.8, 0.5), (f9, 0.6), (f9 + 2, 1.0), (f9 + 6, 0.9),
                 (f10 + 3.2, 0.5), (f10 + 3.4, 1.4), (f10 + 5.8, 1.4), (f10 + 6.0, 0.2), (TOTAL, 0.15)])
wind = windn * wmod * wlev * 0.06
# the ambience bed, shaped: rain dips while the old man speaks (f2), all silent after the low hit (f4), only rain at the end
bed_rain = np.ones(N); bed_fire = np.ones(N)
a2 = S["f2"] + 0.4 + 1.6; bed_rain *= np.interp(t, [0, a2 - 0.3, a2, a2 + 1.0, a2 + 1.4, TOTAL + 1], [1, 1, 0.45, 0.45, 1, 1])
HIT = S["f4"] + 3.75; SIL0, SIL1 = HIT + 0.55, HIT + 1.55
quiet = np.interp(t, [0, HIT - 0.05, HIT, SIL0 - 0.3, SIL0, SIL1, SIL1 + 0.6, TOTAL + 1], [1, 1, 0.3, 0.2, 0, 0, 1, 1])
f11 = S["f11"]; bed_fire *= np.interp(t, [0, f11 + 3.8, f11 + 4.6, TOTAL + 1], [1, 1, 0.15, 0.15])
amb = (rain * bed_rain + fire * bed_fire + wind) * quiet

# ── cues ─────────────────────────────────────────────────────────────────────────────────────────
def breath(dur, f0=600, f1=2400):
    n = int(dur * SR); x = bpf(rng.standard_normal(n + 512), f0, f1)[:n]; return x * np.sin(np.linspace(0, np.pi, n)) ** 1.5
def thud(f=70, dur=0.35, g=1.0):
    n = int(dur * SR); k = np.arange(n) / SR; return g * (np.sin(2 * np.pi * f * k * (1 - 0.3 * k)) * np.exp(-k * 12) + 0.15 * bpf(rng.standard_normal(n + 64), 200, 2000)[:n] * np.exp(-k * 40))
def plink(f=1800, dur=0.12):
    n = int(dur * SR); k = np.arange(n) / SR; return np.sin(2 * np.pi * f * k * (1 + 0.6 * k)) * np.exp(-k * 45)
def creak(dur=0.4, f=380):
    n = int(dur * SR); k = np.arange(n) / SR; ph = 2 * np.pi * np.cumsum(f * (1 + 0.15 * np.sin(2 * np.pi * 7 * k) + 0.3 * k)) / SR
    saw = 2 * ((ph / (2 * np.pi)) % 1) - 1; return bpf(saw, 200, 2500) * env(n, 0.03, 0.1) * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * k))
def heartbeat(t0, t1, bpm, g):
    p = 60 / bpm; x = t0
    while x < t1: add(fx, thud(52, 0.25, 1.0), x, g); add(fx, thud(46, 0.22, 0.7), x + 0.28, g); x += p
def tick(f):
    n = int(0.03 * SR); k = np.arange(n) / SR; return bpf(rng.standard_normal(n + 64), f, f * 3)[:n] * np.exp(-k * 250)

f1 = S["f1"]
# 1. panting and drips at the door
for k in range(16): add(fx, breath(0.32, 500, 2200), f1 + 0.1 + k * 0.48, 0.14 if k % 2 else 0.1)
for k in range(13): add(fx, plink(1500 + (k * 211) % 900), f1 + 0.3 + k * 0.61, 0.09)
# 3. a gulp; a soft heartbeat starts (until the hit)
f3 = S["f3"]; n = int(0.14 * SR); kk = np.arange(n) / SR
add(fx, np.sin(2 * np.pi * np.cumsum(300 - 1300 * kk) / SR) * np.exp(-kk * 25) + 0.2 * bpf(rng.standard_normal(n + 64), 300, 1500)[:n] * np.exp(-kk * 40), f3 + 0.5, 0.25)
heartbeat(f3 + 1.0, HIT - 0.1, 62, 0.16)
# 4. the low hit, then a second of nothing
n = int(1.2 * SR); kk = np.arange(n) / SR
boom = (np.sin(2 * np.pi * 42 * kk) + 0.5 * np.sin(2 * np.pi * 63 * kk) + 0.3 * bpf(rng.standard_normal(n + 64), 30, 300)[:n]) * np.exp(-kk * 5.5)
add(fx, boom, HIT, 0.6)
# 5. heavy steps, floor creaks
f5 = S["f5"]
for k in range(7): add(fx, thud(80, 0.3, 1.0), f5 + 0.3 + k * 0.62 + 0.3, 0.28);
for k in (1, 3, 5): add(fx, creak(0.45, 320 + k * 30), f5 + 0.3 + k * 0.62 + 0.32, 0.05)
# 6. kettle lifted, tea poured, the glass set down hard
f6 = S["f6"]
add(fx, plink(900, 0.2) * 0.6 + plink(1300, 0.2) * 0.4, f6 + 0.95, 0.12)
n = int(1.4 * SR); kk = np.arange(n) / SR
pour = bpf(rng.standard_normal(n + 512), 700, 4000)[:n] * env(n, 0.08, 0.2) * (0.7 + 0.3 * np.sin(2 * np.pi * 11 * kk) * np.sin(2 * np.pi * 3 * kk))
add(fx, pour, f6 + 1.8 + 0.45, 0.13)
n = int(0.3 * SR); kk = np.arange(n) / SR
clack = (np.sin(2 * np.pi * 2100 * kk) * 0.6 + np.sin(2 * np.pi * 3400 * kk) * 0.4) * np.exp(-kk * 30) + thud(120, 0.3, 1.0)[:n] * 0.6
add(fx, clack, f6 + 3.9 + 0.8, 0.5)
# 8. a faster heart; a buzz during the flash
f8 = S["f8"]; heartbeat(f8 + 0.2, f8 + 5.0, 96, 0.18)
n = int(1.0 * SR); kk = np.arange(n) / SR
add(fx, (np.sin(2 * np.pi * 120 * kk) * 0.5 + np.sin(2 * np.pi * 240 * kk) * 0.25 + bpf(rng.standard_normal(n + 64), 2000, 8000)[:n] * 0.4) * env(n, 0.05, 0.15), f8 + 1.9, 0.08)
# 9. something faint and unclear, far away
n = int(2.2 * SR); kk = np.arange(n) / SR
far = bpf(rng.standard_normal(n + 512), 450, 900)[:n] * (0.5 + 0.5 * np.sin(2 * np.pi * 2.3 * kk)) * env(n, 0.6, 0.8)
add(fx, far, f9 + 3.0, 0.05)
# 10. hinge, the storm pours in, the door slams
add(fx, creak(0.6, 260), f10 + 3.15, 0.12)
n = int(2.4 * SR); add(fx, bpf(rng.standard_normal(n + 512), 300, 7000)[:n] * env(n, 0.15, 0.3), f10 + 3.3, 0.08)
for k in range(5): add(fx, thud(70, 0.3, 1.0), f10 + 2.3 + k * 0.4 + (1.5 if k > 1 else 0), 0.14)
n = int(0.8 * SR); kk = np.arange(n) / SR
slam = thud(55, 0.8, 1.0) + bpf(rng.standard_normal(n + 64), 300, 4000)[:n] * np.exp(-kk * 14) * 0.6
add(fx, slam, f10 + 5.82, 0.6)
# 11. the chair falls, running steps; then only rain and the clock
for k, d in enumerate((0.0, 0.12, 0.2, 0.33)): add(fx, thud(140 + k * 30, 0.2, 1.0) + plink(600 + k * 150, 0.2) * 0.3, f11 + 0.75 + d, 0.3 - k * 0.05)
for k in range(5): add(fx, thud(90, 0.2, 1.0), f11 + 0.75 + k * 0.25, 0.15)
for k in range(int(TOTAL - f11)): add(fx, tick(2500 if k % 2 else 1800), f11 + 0.2 + k, 0.12 if f11 + k > f11 + 3.8 else 0.06)

mix = amb + fx * np.interp(t, [0, SIL0, SIL0 + 0.01, SIL1, SIL1 + 0.01, TOTAL + 1], [1, 1, 0, 0, 1, 1])
fade = np.interp(t, [0, 0.4, TOTAL - 0.6, TOTAL], [0, 1, 1, 0]); mix *= fade
mix = np.tanh(mix * 1.1) / 1.1
st = np.stack([mix, mix], 1)
raw = (np.clip(st, -1, 1) * 32767).astype(np.int16).tobytes()
subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "libmp3lame", "-b:a", "192k", os.path.join(ROOT, "assets/audio/fx.mp3")], input=raw, check=True)
print("fx.mp3", TOTAL, "s")
