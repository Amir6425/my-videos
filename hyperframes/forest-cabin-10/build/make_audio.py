"""Ambience and effects for part seven, all synthesised (deterministic). Rain on the roof, fire crackle, an occasional
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
noise = rng.standard_normal(N)
rain = bpf(noise, 400, 6000) * 0.035 + lpf(rng.standard_normal(N), 900) * 0.03
drops = np.zeros(N); idx = rng.integers(0, N - 2000, int(TOTAL * 70))
for i in idx: drops[i:i + 400] += np.exp(-np.arange(400) / 60) * rng.uniform(0.01, 0.04) * np.sin(np.arange(400) * rng.uniform(0.3, 0.8))
rain += drops
fire = lpf(rng.standard_normal(N), 200) * 0.04
for c in rng.uniform(0, TOTAL, int(TOTAL * 5)):
    n = int(rng.uniform(0.004, 0.02) * SR); add(fire, bpf(rng.standard_normal(n + 64), 1500, 8000)[:n] * np.exp(-np.arange(n) / (n / 4)) * rng.uniform(0.03, 0.1), c)
windn = bpf(rng.standard_normal(N), 150, 1200)
wind = windn * (0.5 + 0.5 * np.sin(2 * np.pi * 0.05 * t) ** 2) * 0.035
amb = rain + fire + wind

def breath(dur, f0=600, f1=2400):
    n = int(dur * SR); x = bpf(rng.standard_normal(n + 512), f0, f1)[:n]; return x * np.sin(np.linspace(0, np.pi, n)) ** 1.5
def thud(f=70, dur=0.35, g=1.0):
    n = int(dur * SR); k = np.arange(n) / SR; return g * (np.sin(2 * np.pi * f * k * (1 - 0.3 * k)) * np.exp(-k * 12) + 0.15 * bpf(rng.standard_normal(n + 64), 200, 2000)[:n] * np.exp(-k * 40))
def tick(f):
    n = int(0.03 * SR); k = np.arange(n) / SR; return bpf(rng.standard_normal(n + 64), f, f * 3)[:n] * np.exp(-k * 250)
def slide(dur, lo=150, hi=1500):
    n = int(dur * SR); k = np.arange(n) / SR; return bpf(rng.standard_normal(n + 512), lo, hi)[:n] * env(n, 0.05, 0.1) * (0.7 + 0.3 * np.sin(2 * np.pi * 31 * k))
def rustle(dur):
    n = int(dur * SR); k = np.arange(n) / SR; return bpf(rng.standard_normal(n + 512), 2000, 9000)[:n] * env(n, 0.02, 0.08) * (0.4 + 0.6 * np.abs(np.sin(2 * np.pi * 9 * k)))
def heartbeat(t0, t1, bpm, g):
    p = 60 / bpm; x = t0
    while x < t1: add(fx, thud(52, 0.25, 1.0), x, g); add(fx, thud(46, 0.22, 0.7), x + 0.28, g); x += p
def low(dur=1.5, f=42, g=1.0):
    n = int(dur * SR); k = np.arange(n) / SR; return g * (np.sin(2 * np.pi * f * k) + 0.5 * np.sin(2 * np.pi * f * 1.5 * k)) * np.exp(-k * 3)

W = json.load(open(os.path.join(HERE, "words.json")))
wt = lambda sh, i: S[sh] + W[sh]["words"][i]["start"] + 0.25
def static(dur, g=1.0):
    n = int(dur * SR); k = np.arange(n) / SR; x = bpf(rng.standard_normal(n + 512), 1200, 7000)[:n]
    gate = (np.sin(2 * np.pi * 13 * k) + np.sin(2 * np.pi * 7.3 * k + 1) > 0.3).astype(float) * 0.7 + 0.3
    return g * x * gate * env(n, 0.05, 0.1)
def beep(f=1400, dur=0.12):
    n = int(dur * SR); k = np.arange(n) / SR; return np.sin(2 * np.pi * f * k) * env(n, 0.005, 0.03)
def click(f=3000):
    n = int(0.02 * SR); k = np.arange(n) / SR; return bpf(rng.standard_normal(n + 64), f, f * 2.5)[:n] * np.exp(-k * 300)
def creak(dur=0.4, f=380):
    n = int(dur * SR); k = np.arange(n) / SR; ph = 2 * np.pi * np.cumsum(f * (1 + 0.15 * np.sin(2 * np.pi * 7 * k) + 0.3 * k)) / SR
    saw = 2 * ((ph / (2 * np.pi)) % 1) - 1; return bpf(saw, 200, 2500) * env(n, 0.03, 0.1) * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * k))
def thunder(dur=3.0):
    n = int(dur * SR); k = np.arange(n) / SR; x = lpf(rng.standard_normal(n), 180) * 6 + bpf(rng.standard_normal(n + 512), 200, 1500)[:n] * 0.6
    return x * np.exp(-k * 1.2) * (0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 3 * k)))
amb = (rain + wind) * 1.4
OFF = {c["shot"]: c["offset"] for c in json.load(open(os.path.join(HERE, "narration.json")))["scenes"]}
wt = lambda sh, i: S[sh] + W[sh]["words"][i]["start"] + OFF[sh]
def step(g=1.0): n = int(0.12 * SR); k = np.arange(n) / SR; return g * lpf(rng.standard_normal(n), 500) * np.exp(-k * 35) * 4
def steps(t0, t1, per, g):
    x = t0
    while x < t1: add(fx, step(), x, g); x += per
def whoosh(dur=0.5): n = int(dur * SR); return bpf(rng.standard_normal(n + 512), 300, 3000)[:n] * np.sin(np.linspace(0, np.pi, n)) ** 2
# p0 poll
add(fx, beep(900, 0.08), S["p0"] + 0.2, 0.2); add(fx, beep(1300, 0.06), wt("p0", 9), 0.15); add(fx, beep(1300, 0.06), wt("p0", 18), 0.15)
for i in range(14): add(fx, tick(2500), wt("p0", 18) + i * 0.13, 0.25)
add(fx, beep(1568, 0.1), wt("p0", 25), 0.25); add(fx, beep(2093, 0.18), wt("p0", 25) + 0.1, 0.25); add(fx, whoosh(0.5), S["n1"] - 0.5, 0.15)
steps(S["n1"], S["n2"], 0.35, 0.18)
add(fx, low(2.0, 40, 0.8), wt("n2", 4) - 0.05, 0.4); steps(wt("n2", 4), wt("n2", 4) + 0.5, 0.25, 0.2)
add(fx, rustle(0.6), wt("n3", 5), 0.12); add(fx, rustle(0.6), wt("n3", 6), 0.12); add(fx, low(1.5, 36, 0.6), wt("n3", 9) - 0.2, 0.3)
add(fx, click(2500), wt("n4", 0) - 0.05, 0.3)
heartbeat(S["n5"] + 0.3, S["n6"], 100, 0.12)
add(fx, beep(1300, 0.05), wt("n9", 9), 0.12); add(fx, beep(1300, 0.05), wt("n9", 9) + 0.4, 0.12)
steps(wt("n10", 4) + 0.2, S["n11"], 0.22, 0.2)
n = int((S["n13"] - S["n11"]) * SR); kk = np.arange(n) / SR
add(fx, bpf(rng.standard_normal(n + 512), 200, 1200)[:n] * env(n, 0.5, 0.5), S["n11"], 0.06)  # river
for i in range(6): add(fx, creak(0.5, 200 + i * 10), S["n11"] + 0.4 + i * 0.95, 0.04)
add(fx, creak(0.7, 300), wt("n12", 4) - 0.3, 0.12); steps(wt("n12", 5), wt("n12", 5) + 1.0, 0.33, 0.18)
add(fx, slide(0.5, 800, 4000), S["n14"] + 0.1, 0.05)
add(fx, low(2.5, 34, 0.8), wt("n15", 8) - 0.15, 0.4); add(fx, low(3.0, 30, 0.8), wt("n15", 18) - 0.1, 0.5)
heartbeat(wt("n15", 18), S["n17"], 90, 0.12)
add(fx, rustle(0.4), wt("n18", 6), 0.12); steps(wt("n18", 12), S["n19"], 0.22, 0.2)
add(fx, slide(0.8, 200, 1500), wt("n19", 6), 0.1)
for i in range(5): add(fx, slide(0.3, 200, 1200), wt("n20", 8) + i * 0.3, 0.1)
for i in range(int(S["n22"] - S["n21"])): add(fx, tick(3000), S["n21"] + 0.2 + i, 0.25)
steps(wt("n22", 12), S["n23"], 0.22, 0.2)
add(fx, low(2.0, 40, 0.6), wt("n23", 6), 0.3)
n = int(4.0 * SR); add(fx, lpf(rng.standard_normal(n), 300) * env(n, 0.3, 0.5) * 3, S["n24"], 0.12)  # water
for k in range(3): add(fx, click(2200), wt("n26", 6) - 0.1 + k * 0.45, 0.35); add(fx, tick(1800), wt("n26", 6) + k * 0.45, 0.3)
add(fx, thud(220, 0.15), wt("n26", 6) + 1.35, 0.25)
add(fx, slide(0.6, 100, 800), wt("n27", 3) - 0.2, 0.25); add(fx, slide(0.8, 200, 1500), wt("n27", 8) - 0.2, 0.1)
n = int((S["n29"] - S["n28"]) * SR); add(fx, np.sin(2 * np.pi * 220 * np.arange(n) / SR) * env(n, 1.5, 1.0) * 0.3 + np.sin(2 * np.pi * 330 * np.arange(n) / SR) * env(n, 2.0, 1.0) * 0.2, S["n28"], 0.15)
steps(wt("n29", 1) - 0.3, wt("n29", 1) + 1.5, 0.45, 0.22)
add(fx, low(2.0, 38, 0.6), wt("n30", 3) - 0.1, 0.3)
add(fx, low(3.0, 32, 0.7), wt("n31", 3), 0.3); heartbeat(wt("n32", 5), S["n32"] + 7.0, 60, 0.08)

# under the narrator: the bed and the effects drop to 40%, never to nothing
NJ = json.load(open(os.path.join(HERE, "narration.json")))["scenes"]; WJ = json.load(open(os.path.join(HERE, "words.json")))
duck = np.ones(N)
for c in NJ:
    for w in WJ[c["shot"]]["words"]:
        a, b = S[c["shot"]] + c["offset"] + w["start"] - 0.15, S[c["shot"]] + c["offset"] + w["end"] + 0.15
        duck[max(0, at(a)):min(N, at(b))] = 0.4
k = int(0.15 * SR); duck = np.convolve(duck, np.ones(k) / k, mode="same")
mix = (amb + fx) * duck
fade = np.interp(t, [0, 0.4, TOTAL - 0.8, TOTAL], [0, 1, 1, 0]); mix *= fade
mix = np.tanh(mix * 1.1) / 1.1
st = np.stack([mix, mix], 1)
raw = (np.clip(st, -1, 1) * 32767).astype(np.int16).tobytes()
subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "libmp3lame", "-b:a", "192k", os.path.join(ROOT, "assets/audio/fx.mp3")], input=raw, check=True)
print("fx.mp3", TOTAL, "s")
