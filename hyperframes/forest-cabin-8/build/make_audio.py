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
OUT = S["k6"] + 0.6
# outdoors from the door on: the rain is louder and open, a river by the tree
amb = amb * np.interp(t, [0, OUT, OUT + 0.6, TOTAL + 1], [0.7, 0.7, 1.4, 1.4])
river = bpf(rng.standard_normal(N), 300, 3000) * 0.05 * np.interp(t, [0, S["k11"], S["k11"] + 1.5, S["k13"], S["k13"] + 0.5, TOTAL + 1], [0, 0, 1, 1, 0.4, 0.4])
amb = amb + river
add(fx, beep(900, 0.08), S["k1"] + 0.1, 0.2); add(fx, beep(1300, 0.06), wt("k1", 11), 0.25); add(fx, beep(1760, 0.1), wt("k1", 11) + 0.08, 0.2)
add(fx, click(2500), wt("k2", 3), 0.3); add(fx, beep(1400), wt("k2", 3) + 0.02, 0.2); add(fx, static(0.6), wt("k2", 8) - 0.6, 0.12)
add(fx, static(1.3), wt("k3", 2) - 0.1, 0.4); add(fx, beep(700, 0.25), wt("k3", 4), 0.15)
heartbeat(S["k4"], S["k5"], 80, 0.14)
add(fx, thud(90, 0.3), S["k5"] + 0.62, 0.3); add(fx, click(2000), wt("k5", 2) + 0.4, 0.4); add(fx, click(3500), wt("k5", 5) + 0.25, 0.4)
add(fx, creak(0.6, 240), S["k6"] + 0.5, 0.15)
add(fx, bpf(rng.standard_normal(int(0.6 * SR) + 512), 2000, 8000)[:int(0.6 * SR)] * env(int(0.6 * SR), 0.05, 0.2), S["k7"] + 0.2, 0.08)
for k in range(int(W["k8"]["duration"] / 0.3)): add(fx, thud(70, 0.2), S["k8"] + k * 0.3, 0.1)
add(fx, click(1500), wt("k8", 3), 0.6); add(fx, click(1800), wt("k8", 3) + 0.05, 0.5); add(fx, click(2200), wt("k8", 5), 0.5)
add(fx, thunder(3.0), wt("k11", 9) - 0.05, 0.35); add(fx, thunder(2.5), wt("k11", 10) + 0.15, 0.25)
for k in range(5): add(fx, bpf(rng.standard_normal(int(0.25 * SR) + 512), 400, 3000)[:int(0.25 * SR)] * env(int(0.25 * SR), 0.01, 0.15), S["k12"] + 0.3 + k * 0.4, 0.15)
add(fx, bpf(rng.standard_normal(int(0.5 * SR) + 512), 300, 4000)[:int(0.5 * SR)] * env(int(0.5 * SR), 0.01, 0.3), S["k12"] + 1.15, 0.3)
for w in (8, 9, 10): add(fx, low(1.2, 40, 0.7), wt("k13", w) - 0.3, 0.3)
add(fx, bpf(rng.standard_normal(int(1.0 * SR) + 512), 200, 2500)[:int(1.0 * SR)] * env(int(1.0 * SR), 0.1, 0.3), S["k14"] + 0.5, 0.12); add(fx, thud(220, 0.3), wt("k14", 4), 0.25)
for w in (2, 5, 7):
    for c in range(4): add(fx, click(3000 + c * 200), wt("k15", w) - 0.3 + c * 0.12, 0.4)
add(fx, thud(300, 0.2), S["k15"] + W["k15"]["duration"] - 0.35, 0.4)
add(fx, creak(0.5, 300), wt("k16", 0), 0.15); add(fx, low(1.6, 38, 1.0), wt("k16", 10) - 0.15, 0.45)

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
