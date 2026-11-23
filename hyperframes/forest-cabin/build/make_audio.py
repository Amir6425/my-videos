"""Mysterious score + effects for the cabin film, timed to build/timing.json. Generated and seeded (no samples).
Run: python3 build/make_audio.py   (then node build/build.mjs)"""
import json, os, subprocess, wave
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "..", "assets", "audio")
SR = 44100; rng = np.random.default_rng(9)
TM = json.load(open(os.path.join(HERE, "timing.json"))); TOTAL, S = TM["total"], TM["starts"]
N = int((TOTAL + 0.5) * SR); tt = np.arange(N) / SR
def band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X / (1 + (lo / np.maximum(f, 1)) ** 4) / (1 + (f / hi) ** 4), len(x))
def norm(x, p=1.0): m = np.max(np.abs(x)) or 1; return x / m * p
def put(tr, at, sig, g=1.0):
    i = int(at * SR); j = min(len(tr), i + len(sig))
    if 0 <= i < len(tr): tr[i:j] += sig[: j - i] * g
def t_(d): return np.arange(int(d * SR)) / SR
def env(n, a, r):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e
midi = lambda m: 440 * 2 ** ((m - 69) / 12)
def reverb(x, secs=2.5, mix=0.4):
    n = int(secs * SR); ir = rng.standard_normal(n) * np.exp(-np.arange(n) / (SR * secs / 6)); ir = band(ir, 200, 5000)
    L = len(x) + n; y = np.fft.irfft(np.fft.rfft(x, L) * np.fft.rfft(ir, L), L)[: len(x)]
    return x * (1 - mix) + norm(y, np.max(np.abs(x)) + 1e-9) * mix

# ── score: low drone in D minor, a ticking pulse, a sparse music-box motif, tension swells ─────────
music = np.zeros(N)
drone = sum(np.sin(2 * np.pi * midi(m) * (1 + d / 100) * tt + i) for i, m in enumerate([26, 38, 45]) for d in (-0.2, 0.2))
drone *= 0.7 + 0.3 * np.sin(2 * np.pi * 0.07 * tt)
music += band(drone, 30, 700) * 0.5
# a quiet minor-second rub that grows toward the end
rub = (np.sin(2 * np.pi * midi(62) * tt) + np.sin(2 * np.pi * midi(63) * tt)) * np.clip((tt - S["e"]) / 12, 0, 1) * 0.12
music += band(rub, 200, 2000)
# ticking pulse (like a clock), faster in the montage, slower later
for at in np.concatenate([np.arange(0.1, S["b"], 0.25), np.arange(S["b"], S["g1"], 0.5)]):
    d = t_(0.03); put(music, at, band(rng.standard_normal(len(d)), 2500, 7000) * np.exp(-d * 200), 0.18)
# music-box motif (D minor, unresolved)
motif = [74, 77, 81, 80, 77, 74, 73, 74]
for i, at in enumerate(np.arange(1.0, TOTAL - 2, 1.4)):
    if S["b"] <= at < S["c"]: continue
    m = motif[i % len(motif)]; d = t_(1.5)
    tone = np.sin(2 * np.pi * midi(m) * d) + 0.3 * np.sin(2 * np.pi * midi(m) * 3 * d)
    put(music, at, tone * np.exp(-d * 3.5) * env(len(d), 0.004, 0.05), 0.07)
def swell(at, d, f=40, g=0.5):
    x = t_(d); s = np.sin(2 * np.pi * f * x) + band(rng.standard_normal(len(x)), 100, 1200) * 0.4
    put(music, at, s * np.linspace(0, 1, len(x)) ** 2 * env(len(x), 0, 0.15), g)
def hit(at, g=0.6):
    x = t_(3.0); put(music, at, (np.sin(2 * np.pi * 36 * x * (1 - 0.1 * x)) * np.exp(-x * 1.4) + band(rng.standard_normal(len(x)), 2000, 8000) * np.exp(-((x - 0.5) ** 2) / 0.2) * 0.25), g)
swell(S["d2"] - 1.5, 1.5, 44, 0.3); hit(S["d2"], 0.4)
swell(S["e"] + 2.0, 2.2, 40, 0.3)
swell(S["f"] - 1.0, 1.0, 38, 0.35); hit(S["f"] + 3.6, 0.45)
hit(S["g1"] + 0.72, 0.7)
swell(TOTAL - 4.5, 3.8, 34, 0.55)
music = reverb(music, 3.5, 0.45) * env(N, 1.0, 1.5); music = norm(music, 0.85)

# ── effects ───────────────────────────────────────────────────────────────────────────────────────
sfx = np.zeros(N)
def noise(d): return rng.standard_normal(int(d * SR))
def rustle(d=0.35, lo=1500, hi=8000):
    x = band(noise(d), lo, hi); crack = np.repeat(rng.random(int(d * 200)) ** 3, SR // 200 + 1)[: len(x)]
    return norm(x * (0.3 + crack) * env(len(x), 0.02, d * 0.5), 0.8)
def thud(f=60, d=0.45):
    x = t_(d); return np.sin(2 * np.pi * f * x) * np.exp(-x * 10) + band(rng.standard_normal(len(x)), 80, 900) * np.exp(-x * 25) * 0.6
def click(f=2500, d=0.05):
    x = t_(0.06); return np.sin(2 * np.pi * f * x) * np.exp(-x * (6.6 / d))
def step(g=1.0):
    x = t_(0.16); return (band(rng.standard_normal(len(x)), 200, 3000) * np.exp(-x * 40) + np.sin(2 * np.pi * 80 * x) * np.exp(-x * 30) * 0.5) * g
def engine(d, f0, f1, g0, g1):
    x = t_(d); f = np.linspace(f0, f1, len(x)); ph = 2 * np.pi * np.cumsum(f) / SR
    return (sum(np.sin(ph * h) / h for h in range(1, 6)) * 0.5 + norm(band(rng.standard_normal(len(x)), 30, 400), 0.6)) * np.linspace(g0, g1, len(x))
# packing
for k in range(2): put(sfx, S["a1"] + 0.3 + k * 0.6, rustle(0.4), 0.5)
for k in range(2): put(sfx, S["a2"] + 0.3 + k * 0.6, rustle(0.35, 2500, 9000), 0.5)
put(sfx, S["a3"] + 0.4, rustle(0.3), 0.4)
zx = t_(0.6); put(sfx, S["a3"] + 1.0, band(noise(0.6), 2000, 8000) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 60 * zx))) * env(len(zx), 0.02, 0.1), 0.35)
put(sfx, S["a4"] + 1.1, click(2400, 0.03), 0.4); put(sfx, S["a4"] + 1.3, click(1500, 0.08) * 0.6 + click(2200, 0.08) * 0.4, 0.35)
for k in range(3): put(sfx, S["a5"] + 0.5 + k * 0.42, thud(70, 0.3), 0.4)
put(sfx, S["a5"] + 2.05, thud(55, 0.5), 0.7)
put(sfx, S["a6"] + 0.37, thud(80, 0.4), 0.6); put(sfx, S["a6"] + 0.87, thud(75, 0.4), 0.6)
put(sfx, S["a6"] + 1.2, engine(1.0, 20, 32, 0.0, 0.4), 0.5)
# drive
put(sfx, S["b"], engine(S["c"] - S["b"], 32, 34, 0.45, 0.35) * env(int((S["c"] - S["b"]) * SR), 0.5, 1.0), 0.5)
wind = band(noise(TOTAL - S["b"]), 200, 1200) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.13 * t_(TOTAL - S["b"])))
put(sfx, S["b"], norm(wind, 1) * env(len(wind), 1.0, 1.5), 0.08)
# cabin arrival
put(sfx, S["c"], engine(2.6, 34, 18, 0.45, 0.0), 0.5)
gravel = band(noise(2.4), 800, 5000) * np.repeat(rng.random(480) ** 2, SR // 200 + 1)[: int(2.4 * SR)]
put(sfx, S["c"], norm(gravel, 1) * np.linspace(1, 0, len(gravel)), 0.12)
put(sfx, S["c"] + 2.8, click(900, 0.06), 0.3); put(sfx, S["c"] + 4.4, thud(80, 0.4), 0.5)
for k in range(12): put(sfx, S["c"] + 3.5 + k * 0.36, step(0.6 - k * 0.03), 0.4)
owl = t_(1.4); hoot = np.sin(2 * np.pi * (380 - 40 * owl) * owl) * (np.exp(-((owl - 0.25) ** 2) / 0.01) + np.exp(-((owl - 0.9) ** 2) / 0.03))
put(sfx, S["c"] + 6.0, band(hoot, 200, 2000), 0.25); put(sfx, S["g3"] + 2.5, band(hoot, 200, 2000), 0.3)
# inside: fire crackle
for at in np.sort(rng.uniform(S["d1"], S["g1"], int((S["g1"] - S["d1"]) * 4))):
    d = t_(0.015); put(sfx, at, band(rng.standard_normal(len(d)), 1500, 9000) * np.exp(-d * 300), rng.uniform(0.05, 0.2))
put(sfx, S["d1"] + 1.0, rustle(0.5, 300, 2500), 0.3)
for k in range(4): put(sfx, S["d1"] + 1.6 + k * 0.35, step(0.5), 0.3)
# flashlights
put(sfx, S["g1"] + 0.68, click(3200, 0.02) + click(1800, 0.04), 0.6)
for k, dt in enumerate([0.0, 0.35, 0.7]): put(sfx, S["g2"] + dt, click(3000 - k * 300, 0.02) + click(1700, 0.04), 0.5)
for k in range(int(6.4 / 0.25)): put(sfx, S["g3"] + 0.1 + k * 0.25 + rng.uniform(0, 0.05), rustle(0.12, 600, 5000), 0.18)
sfx = reverb(sfx, 1.2, 0.2); sfx = norm(sfx, 0.9)

def write(name, x):
    os.makedirs(OUT, exist_ok=True); wav = os.path.join(OUT, name + ".wav")
    with wave.open(wav, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", wav, "-b:a", "128k", os.path.join(OUT, name + ".mp3")], check=True); os.remove(wav)
write("music", music); write("sfx", sfx); print("wrote", OUT)
