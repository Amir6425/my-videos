"""Quiet bed for Scene 1, kept low so the narrator's voice-over sits on top: a dark ambient pad and a soft
candle crackle. Generated, seeded, reproducible. Run: python3 build/make_audio.py   (then node build/build.mjs)"""
import json, os, subprocess, wave
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "..", "assets", "audio")
SR = 44100; rng = np.random.default_rng(5)
TOTAL = json.load(open(os.path.join(HERE, "timing.json")))["total"]
N = int((TOTAL + 0.5) * SR); t = np.arange(N) / SR
def band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X / (1 + (lo / np.maximum(f, 1)) ** 4) / (1 + (f / hi) ** 4), len(x))
midi = lambda m: 440 * 2 ** ((m - 69) / 12)
pad = np.zeros(N)
for i, m in enumerate([38, 45, 50, 53, 57]):  # D minor, low and open
    for det in (-0.15, 0.15):
        pad += np.sin(2 * np.pi * midi(m) * (1 + det / 100) * t + i) * (0.5 if i < 2 else 0.25)
pad *= 0.8 + 0.2 * np.sin(2 * np.pi * 0.09 * t)
pad = band(pad, 50, 1600)
pad += band(rng.standard_normal(N), 2000, 6000) * 0.02 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.05 * t))
# candle crackle: sparse tiny clicks
crack = np.zeros(N)
for at in np.sort(rng.uniform(0.3, TOTAL, int(TOTAL * 3))):
    i = int(at * SR); n = int(0.012 * SR)
    crack[i:i + n] += rng.standard_normal(n) * np.exp(-np.arange(n) / (n / 4)) * rng.uniform(0.2, 1)
crack = band(crack, 1500, 9000)
x = pad / np.max(np.abs(pad)) * 0.5 + crack / (np.max(np.abs(crack)) or 1) * 0.12
fade = np.ones(N); a, r = int(1.2 * SR), int(1.5 * SR); fade[:a] = np.linspace(0, 1, a); fade[-r:] = np.linspace(1, 0, r)
x = x * fade / np.max(np.abs(x)) * 0.7
os.makedirs(OUT, exist_ok=True); wav = os.path.join(OUT, "bed.wav")
with wave.open(wav, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype("<i2").tobytes())
subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", wav, "-b:a", "128k", os.path.join(OUT, "bed.mp3")], check=True); os.remove(wav)
print("wrote", OUT)
