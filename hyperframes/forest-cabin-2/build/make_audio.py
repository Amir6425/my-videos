"""Score + effects for part two, timed to build/timing.json. Generated and seeded (no samples).
Run: python3 build/make_audio.py   (then node build/build.mjs)"""
import json, os, subprocess, wave
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "..", "assets", "audio")
SR = 44100; rng = np.random.default_rng(13)
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
def seg(a, b): return (tt >= a) & (tt < b)

# ── score ─────────────────────────────────────────────────────────────────────────────────────────
music = np.zeros(N)
drone = sum(np.sin(2 * np.pi * midi(m) * (1 + d / 100) * tt + i) for i, m in enumerate([26, 33, 38]) for d in (-0.25, 0.25))
music += band(drone, 30, 600) * 0.45 * (0.7 + 0.3 * np.sin(2 * np.pi * 0.06 * tt))
# high glassy tension from the vanishing on
gl = (np.sin(2 * np.pi * midi(86) * tt) + np.sin(2 * np.pi * midi(87) * tt)) * 0.05 * np.clip((tt - S["h3"]) / 3, 0, 1) * (tt < S["h10"])
music += gl
# music-box motif in the opening walk only
for i, at in enumerate(np.arange(0.5, S["h2"], 1.2)):
    m = [74, 77, 73, 74][i % 4]; d = t_(1.3); put(music, at, (np.sin(2 * np.pi * midi(m) * d) + 0.3 * np.sin(2 * np.pi * midi(m) * 3 * d)) * np.exp(-d * 3.5), 0.06)
def hit(at, g=0.7, f=34):
    x = t_(3.2); put(music, at, np.sin(2 * np.pi * f * x * (1 - 0.1 * x)) * np.exp(-x * 1.2) + band(rng.standard_normal(len(x)), 1500, 8000) * np.exp(-((x - 0.3) ** 2) / 0.1) * 0.35, g)
def swell(at, d, f=40, g=0.5):
    x = t_(d); put(music, at, (np.sin(2 * np.pi * f * x) + band(rng.standard_normal(len(x)), 100, 1500) * 0.5) * np.linspace(0, 1, len(x)) ** 2.5, g)
swell(S["h2"], 1.9, 42, 0.5); hit(S["h2"] + 2.05, 0.9)
hit(S["h3"] + 1.5, 0.8, 30)
swell(S["h5a"] - 0.5, 0.6, 40, 0.3)
hit(S["h9d"] + 1.2, 0.6, 36)
# heartbeat during the search (h5a → h9d)
for at in np.arange(S["h5a"], S["h10"], 0.75):
    for k, dt in enumerate((0, 0.18)):
        x = t_(0.25); put(music, at + dt, np.sin(2 * np.pi * 48 * x) * np.exp(-x * 22), 0.5 - k * 0.2)
# chase: driving low drums + rising strings-ish saw
for k, at in enumerate(np.arange(S["h4"], S["h5a"], 0.24)):
    x = t_(0.2); put(music, at, np.sin(2 * np.pi * 58 * x) * np.exp(-x * 18), 0.55 if k % 2 == 0 else 0.3)
for k, at in enumerate(np.arange(S["h10"], TOTAL - 0.6, 0.2)):
    x = t_(0.2); put(music, at, np.sin(2 * np.pi * 55 * x) * np.exp(-x * 18), 0.6 if k % 2 == 0 else 0.35)
sx = t_(TOTAL - S["h10"]); f = midi(50) * (1 + sx / 14); saw = sum(np.sin(2 * np.pi * np.cumsum(f * h) / SR) / h for h in range(1, 8))
put(music, S["h10"], band(saw, 150, 3000) * np.linspace(0.1, 1, len(sx)) * env(len(sx), 0.3, 0.8), 0.16)
music = reverb(music, 3.0, 0.4) * env(N, 1.0, 1.0); music = norm(music, 0.85)

# ── effects ───────────────────────────────────────────────────────────────────────────────────────
sfx = np.zeros(N)
def noise(d): return rng.standard_normal(int(d * SR))
def step(g=1.0, crunch=False):
    x = t_(0.16); s = band(rng.standard_normal(len(x)), 300 if crunch else 200, 6000 if crunch else 2500) * np.exp(-x * (25 if crunch else 40)) + np.sin(2 * np.pi * 80 * x) * np.exp(-x * 30) * 0.5
    return s * g
def scream(d=1.6, f0=520):
    x = t_(d); f = f0 * (1 + 0.04 * np.sin(2 * np.pi * 6 * x)) * (1 + 0.1 * np.exp(-x * 3))
    src = sum(np.sin(2 * np.pi * np.cumsum(f * h) / SR) / h ** 0.8 for h in range(1, 14)) + band(rng.standard_normal(len(x)), 1000, 6000) * 0.4
    out = sum(band(src, fc * 0.8, fc * 1.25) * g for fc, g in ((900, 1.0), (1400, 0.8), (2800, 0.5)))
    return norm(out, 1) * env(len(x), 0.03, 0.6)
def breath(d=0.32, g=1.0):
    x = t_(d); return band(rng.standard_normal(len(x)), 500, 3000) * np.sin(np.pi * x / d) ** 2 * g
# wind and leaves throughout, stronger in the search
wind = band(noise(TOTAL), 150, 1100) * (0.55 + 0.45 * np.sin(2 * np.pi * 0.11 * tt[: int(TOTAL * SR)]))
put(sfx, 0, norm(wind, 1) * env(len(wind), 1.0, 1.0) * (1 + 0.8 * ((tt[: len(wind)] > S["h6"]) & (tt[: len(wind)] < S["h10"]))), 0.12)
for at in np.sort(rng.uniform(0, TOTAL, int(TOTAL * 1.2))):
    put(sfx, at, band(noise(0.5), 2000, 8000) * np.sin(np.pi * t_(0.5) / 0.5) ** 2, 0.05)
# walking
for k in range(12): put(sfx, S["h1"] + k * 0.5, step(0.5, True), 0.35)
for k in range(3): put(sfx, S["h2"] + k * 0.45, step(0.5, True), 0.35)
put(sfx, S["h2"] + 2.05, scream(1.7, 480), 0.55); put(sfx, S["h2"] + 2.1, scream(1.6, 610), 0.45)
# the vanishing: silence, then two flashlights hit the ground
put(sfx, S["h3"] + 1.92, band(noise(0.08), 1500, 7000) * np.exp(-t_(0.08) * 50) + np.sin(2 * np.pi * 900 * t_(0.08)) * np.exp(-t_(0.08) * 60), 0.5)
put(sfx, S["h3"] + 1.96, band(noise(0.08), 1500, 7000) * np.exp(-t_(0.08) * 50) + np.sin(2 * np.pi * 760 * t_(0.08)) * np.exp(-t_(0.08) * 60), 0.45)
# running + panting
for k in range(int(5.0 / 0.24)): put(sfx, S["h4"] + k * 0.24, step(0.8, True), 0.5)
for k in range(int(5.0 / 0.5)): put(sfx, S["h4"] + k * 0.5, breath(0.3, 1.0 if k % 2 else 0.7), 0.25)
for k in range(int((S["h6"] - S["h5a"]) / 0.6)): put(sfx, S["h5a"] + k * 0.6, breath(0.4, 0.8), 0.18)
for k in range(5): put(sfx, S["h5c"] + 0.1 + k * 0.45, step(0.5, True), 0.3)
put(sfx, S["h9c"] + 0.45, step(1.0, True), 0.6); put(sfx, S["h9c"] + 1.25, step(1.0, True), 0.6)
for k in range(int(7.0 / 0.2)): put(sfx, S["h10"] + k * 0.2, step(0.9, True), 0.5)
for k in range(int(7.0 / 0.4)): put(sfx, S["h10"] + k * 0.4, breath(0.26, 1.0), 0.3)
for k in range(7): put(sfx, S["h10"] + 0.4 + k * 0.85, band(noise(0.3), 1500, 8000) * env(int(0.3 * SR), 0.02, 0.2), 0.3)
owl = t_(1.4); hoot = np.sin(2 * np.pi * (360 - 40 * owl) * owl) * (np.exp(-((owl - 0.25) ** 2) / 0.01) + np.exp(-((owl - 0.9) ** 2) / 0.03))
put(sfx, S["h7"] + 2.0, band(hoot, 200, 2000), 0.3)
sfx = reverb(sfx, 1.6, 0.25); sfx = norm(sfx, 0.9) * env(N, 0.2, 1.0)

def write(name, x):
    os.makedirs(OUT, exist_ok=True); wav = os.path.join(OUT, name + ".wav")
    with wave.open(wav, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", wav, "-b:a", "128k", os.path.join(OUT, name + ".mp3")], check=True); os.remove(wav)
write("music", music); write("sfx", sfx); print("wrote", OUT)
