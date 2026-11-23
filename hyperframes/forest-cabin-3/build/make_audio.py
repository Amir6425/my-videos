"""Score + effects for part two, timed to build/timing.json. Generated and seeded (no samples).
Run: python3 build/make_audio.py   (then node build/build.mjs)"""
import json, os, subprocess, wave
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "..", "assets", "audio")
SR = 44100; rng = np.random.default_rng(17)
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
def hit(at, g=0.7, f=34):
    x = t_(3.2); put(music, at, np.sin(2 * np.pi * f * x * (1 - 0.1 * x)) * np.exp(-x * 1.2) + band(rng.standard_normal(len(x)), 1500, 8000) * np.exp(-((x - 0.3) ** 2) / 0.1) * 0.35, g)
def swell(at, d, f=40, g=0.5):
    x = t_(d); put(music, at, (np.sin(2 * np.pi * f * x) + band(rng.standard_normal(len(x)), 100, 1500) * 0.5) * np.linspace(0, 1, len(x)) ** 2.5, g)
def chime(at, notes, g=0.12):
    for k, m in enumerate(notes):
        x = t_(2.5); put(music, at + k * 0.18, (np.sin(2 * np.pi * midi(m) * x) + 0.3 * np.sin(2 * np.pi * midi(m) * 2 * x)) * np.exp(-x * 1.8), g)
hit(S["k1"] + 3.0, 0.8, 32)
for at in np.arange(S["k2b"], S["k3a"], 0.6):
    for k, dt in enumerate((0, 0.16)): x = t_(0.25); put(music, at + dt, np.sin(2 * np.pi * 48 * x) * np.exp(-x * 22), 0.5 - k * 0.2)
chime(S["k3a"] + 1.2, [69, 72, 76], 0.1)
# a brief warm, uneasy major pad for the "relief" in front of the cabin
pad = sum(np.sin(2 * np.pi * midi(m) * t_(5.6)) for m in [53, 57, 60, 64]) * np.sin(np.pi * t_(5.6) / 5.6) ** 2
put(music, S["k6"], band(pad, 100, 1500), 0.12)
for i, at in enumerate(np.arange(S["k7a"], S["k8"], 1.4)):
    m = [74, 77, 73, 74][i % 4]; d = t_(1.3); put(music, at, (np.sin(2 * np.pi * midi(m) * d) + 0.3 * np.sin(2 * np.pi * midi(m) * 3 * d)) * np.exp(-d * 3.5), 0.06)
for at in np.arange(S["k11"], S["k12"], 0.8):
    for k, dt in enumerate((0, 0.18)): x = t_(0.25); put(music, at + dt, np.sin(2 * np.pi * 46 * x) * np.exp(-x * 22), 0.45 - k * 0.2)
# rising dissonance under the final close-up, then the hit on red's shocked face, then silence
dur12 = S["k13"] - S["k12"]; x = t_(dur12)
dis = (np.sin(2 * np.pi * midi(74) * x) + np.sin(2 * np.pi * midi(75) * x) + np.sin(2 * np.pi * midi(62) * x * (1 + x / 40))) * np.linspace(0, 1, len(x)) ** 2
put(music, S["k12"], band(dis, 200, 4000), 0.22); swell(S["k12"] + dur12 - 2.4, 2.4, 38, 0.5)
hit(S["k13"], 1.0, 30)
music *= np.where(tt > S["k13"] + 0.05, np.exp(-(tt - S["k13"]) * 0.0), 1)
music = reverb(music, 3.0, 0.4) * env(N, 1.0, 1.2); music = norm(music, 0.85)
# the drone drops out on the final hit so only its tail rings
cut = int((S["k13"] + 0.02) * SR); music[cut:] *= np.exp(-np.arange(N - cut) / (SR * 0.9))
# ── effects ───────────────────────────────────────────────────────────────────────────────────────
sfx = np.zeros(N)
def noise(d): return rng.standard_normal(int(d * SR))
def step(g=1.0, crunch=True):
    x = t_(0.16); s = band(rng.standard_normal(len(x)), 300, 6000) * np.exp(-x * 25) + np.sin(2 * np.pi * 80 * x) * np.exp(-x * 30) * 0.5
    return s * g
def breath(d=0.32, g=1.0):
    x = t_(d); return band(rng.standard_normal(len(x)), 500, 3000) * np.sin(np.pi * x / d) ** 2 * g
def knock(g=1.0):
    x = t_(0.25); return (np.sin(2 * np.pi * 120 * x) * np.exp(-x * 30) + band(rng.standard_normal(len(x)), 200, 2500) * np.exp(-x * 60)) * g
def clink(f=2600):
    x = t_(0.4); return (np.sin(2 * np.pi * f * x) + 0.5 * np.sin(2 * np.pi * f * 2.7 * x)) * np.exp(-x * 14)
wind = band(noise(TOTAL), 150, 1100) * (0.55 + 0.45 * np.sin(2 * np.pi * 0.11 * tt[: int(TOTAL * SR)]))
wmask = np.where(tt[: len(wind)] < S["k9"], 1.0, 0.35)
put(sfx, 0, norm(wind, 1) * env(len(wind), 1.0, 1.0) * wmask, 0.12)
for at in np.sort(rng.uniform(0, S["k9"], int(S["k9"] * 1.0))): put(sfx, at, band(noise(0.5), 2000, 8000) * np.sin(np.pi * t_(0.5) / 0.5) ** 2, 0.05)
for k in range(5): put(sfx, S["k1"] + k * 0.24, step(0.9), 0.5)
put(sfx, S["k1"] + 1.2, step(1.2), 0.6)
for k in range(int(6.0 / 0.7)): put(sfx, S["k1"] + 1.4 + k * 0.7, breath(0.45, 0.8), 0.2)
for k in range(int(4.6 / 0.42)): put(sfx, S["k2b"] + k * 0.42, breath(0.3, 1.0), 0.3)
for k in range(int(1.6 / 0.26)): put(sfx, S["k3a"] + k * 0.26, step(0.8), 0.45)
for k in range(9): put(sfx, S["k4"] + k * 0.72, step(0.5), 0.3)
for k in range(6): put(sfx, S["k5"] + 0.4 + k * 0.5, step(0.4), 0.25)
for k in range(5): put(sfx, S["k6"] + 2.8 + k * 0.52, step(0.45), 0.3)
creak = lambda d: band(np.sin(2 * np.pi * np.cumsum(300 + 160 * t_(d) / d + 30 * np.sin(2 * np.pi * 23 * t_(d))) / SR) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 57 * t_(d)))), 200, 3000) * env(int(d * SR), 0.05, 0.3)
put(sfx, S["k5"] + 2.0, creak(0.8), 0.12)
for k in range(2):
    put(sfx, S["k7b"] + 0.5 + k * 2.7, clink(2600), 0.12); put(sfx, S["k7b"] + 1.85 + k * 2.7, clink(2300), 0.1)
for k in range(3): put(sfx, S["k8"] + 1.62 + k * 0.32, knock(1.0), 0.7)
put(sfx, S["k9"] + 0.7, band(noise(0.06), 1500, 6000) * np.exp(-t_(0.06) * 60), 0.5)
put(sfx, S["k9"] + 1.3, creak(2.2), 0.4)
owl = t_(1.4); hoot = np.sin(2 * np.pi * (360 - 40 * owl) * owl) * (np.exp(-((owl - 0.25) ** 2) / 0.01) + np.exp(-((owl - 0.9) ** 2) / 0.03))
put(sfx, S["k4"] + 3.0, band(hoot, 200, 2000), 0.3)
sfx = reverb(sfx, 1.6, 0.25); sfx = norm(sfx, 0.9) * env(N, 0.2, 1.0)

def write(name, x):
    os.makedirs(OUT, exist_ok=True); wav = os.path.join(OUT, name + ".wav")
    with wave.open(wav, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", wav, "-b:a", "128k", os.path.join(OUT, name + ".mp3")], check=True); os.remove(wav)
write("music", music); write("sfx", sfx); print("wrote", OUT)
