"""Crime-mystery bed under the narration: a low cello drone, a slow pizzicato line in D minor, a ticking clock,
eerie high string harmonics, a deep piano note when the police enter, distant fog wind. It dips while the
narrator speaks (words from build/words.json). Generated and seeded. Run: python3 build/make_audio.py"""
import json, os, subprocess, wave
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "..", "assets", "audio")
SR = 44100; rng = np.random.default_rng(23)
TOTAL = json.load(open(os.path.join(HERE, "timing.json")))["total"]; N = int((TOTAL + 0.5) * SR); t = np.arange(N) / SR
cfg = json.load(open(os.path.join(HERE, "narration.json"))); OFF = cfg["offset"]
WJ = os.path.join(HERE, "words.json"); words = json.load(open(WJ))["words"] if os.path.exists(WJ) else []
def band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); return np.fft.irfft(X / (1 + (lo / np.maximum(f, 1)) ** 4) / (1 + (f / hi) ** 4), len(x))
def put(tr, at, sig, g=1.0):
    i = int(at * SR); j = min(len(tr), i + len(sig))
    if 0 <= i < len(tr): tr[i:j] += sig[: j - i] * g
midi = lambda m: 440 * 2 ** ((m - 69) / 12)
def pluck(f, dur=1.4):
    n = int(dur * SR); p = int(SR / f); buf = rng.uniform(-1, 1, p); out = np.empty(n)
    for i in range(n): out[i] = buf[i % p]; buf[i % p] = 0.994 * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return out
# cello drone with slow bowing swell
saw = lambda f: sum(np.sin(2 * np.pi * f * h * t + h) / h ** 1.2 for h in range(1, 10))
drone = band(saw(midi(38)) + 0.5 * saw(midi(45)), 50, 1200) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.12 * t - 1.5) ** 2)
# pizzicato: D minor walk, one note a beat
pizz = np.zeros(N)
for k, at in enumerate(np.arange(0.4, TOTAL - 0.6, 0.66)):
    put(pizz, at, pluck(midi([38, 41, 45, 44, 38, 41, 46, 45][k % 8]), 1.2) * (0.9 if k % 4 == 0 else 0.6))
pizz = band(pizz, 60, 2500)
# clock tick
tick = np.zeros(N)
for k, at in enumerate(np.arange(0.2, TOTAL, 0.5)):
    d = np.arange(int(0.025 * SR)) / SR; put(tick, at, band(rng.standard_normal(len(d)), 2500, 7000) * np.exp(-d * 260), 1.0 if k % 2 == 0 else 0.6)
# eerie harmonics: a high minor-second rub that breathes in during the second sentence
har = (np.sin(2 * np.pi * midi(86) * t) + 0.8 * np.sin(2 * np.pi * midi(87) * t)) * np.clip((t - 3.2) / 2.5, 0, 1) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.4 * t))
# deep piano note when "police" is said, and at the start
piano = np.zeros(N)
for at, m in ((0.15, 26), (OFF + (words[3]["start"] if len(words) > 3 else 3.5), 25)):
    d = np.arange(int(4 * SR)) / SR
    put(piano, at, sum(np.sin(2 * np.pi * midi(m) * h * d) * a for h, a in ((1, 1), (2, 0.5), (3, 0.3), (4, 0.15))) * np.exp(-d * 1.1))
wind = band(rng.standard_normal(N), 150, 800) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.08 * t))
nz = lambda v: v / (np.max(np.abs(v)) or 1)
x = nz(drone) * 0.45 + nz(pizz) * 0.5 + nz(tick) * 0.12 + nz(har) * 0.08 + nz(piano) * 0.55 + nz(wind) * 0.1
# duck under the voice
duck = np.ones(N)
for w in words:
    a, b = int((w["start"] + OFF - 0.05) * SR), int((w["end"] + OFF + 0.05) * SR); duck[a:b] = 0.6
k = int(0.08 * SR); duck = np.convolve(duck, np.ones(k) / k, mode="same")
fade = np.ones(N); a, r = int(0.8 * SR), int(1.2 * SR); fade[:a] = np.linspace(0, 1, a); fade[-r:] = np.linspace(1, 0, r)
x = x * duck * fade; x = x / np.max(np.abs(x)) * 0.75
os.makedirs(OUT, exist_ok=True); wav = os.path.join(OUT, "bed.wav")
with wave.open(wav, "wb") as wf:
    wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(SR); wf.writeframes((x * 32767).astype("<i2").tobytes())
subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", wav, "-b:a", "128k", os.path.join(OUT, "bed.mp3")], check=True); os.remove(wav); print("wrote", OUT)
