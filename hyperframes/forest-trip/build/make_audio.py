"""Warm bed for the scene: a soft plucked-guitar progression (Karplus-Strong) and crickets outside.
Generated, seeded, reproducible. Run: python3 build/make_audio.py   (then node build/build.mjs)"""
import json, os, subprocess, wave
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "..", "assets", "audio")
SR = 44100; rng = np.random.default_rng(3)
TOTAL = json.load(open(os.path.join(HERE, "timing.json")))["total"]
N = int((TOTAL + 0.5) * SR); x = np.zeros(N)
def pluck(f, dur=2.5, gain=0.5):
    n = int(dur * SR); p = int(SR / f); buf = rng.uniform(-1, 1, p); out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % p]; buf[i % p] = 0.996 * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return out * gain
midi = lambda m: 440 * 2 ** ((m - 69) / 12)
chords = [[43, 47, 50, 55, 59], [40, 47, 52, 55, 59], [36, 48, 52, 55, 60], [38, 50, 54, 57, 62]]  # G Em C D
beat = 0.6
for k, at in enumerate(np.arange(0.3, TOTAL - 1.0, beat * 4)):
    ch = chords[k % 4]
    for j, m in enumerate(ch):  # gentle down-strum
        s = pluck(midi(m), 2.6, 0.32 - j * 0.03); i = int((at + j * 0.018) * SR); e = min(N, i + len(s))
        if i < N: x[i:e] += s[: e - i]
    for b, idx in enumerate([3, 4, 2, 4]):  # light picking between strums
        s = pluck(midi(ch[idx] + 12), 1.2, 0.12); i = int((at + beat * (b + 0.5)) * SR); e = min(N, i + len(s))
        if i < N: x[i:e] += s[: e - i]
t = np.arange(N) / SR
cr = np.zeros(N)
for at in np.arange(0.5, TOTAL, 0.9):
    for c in range(3):
        i = int((at + c * 0.06 + rng.uniform(0, 0.05)) * SR); n = int(0.035 * SR)
        cr[i:i + n] += np.sin(2 * np.pi * 4300 * np.arange(n) / SR) * np.hanning(n)
x = x / np.max(np.abs(x)) * 0.6 + cr * 0.03
fade = np.ones(N); a, r = int(0.8 * SR), int(1.2 * SR); fade[:a] = np.linspace(0, 1, a); fade[-r:] = np.linspace(1, 0, r)
x = x * fade / np.max(np.abs(x)) * 0.75
os.makedirs(OUT, exist_ok=True); wav = os.path.join(OUT, "bed.wav")
with wave.open(wav, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype("<i2").tobytes())
subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", wav, "-b:a", "128k", os.path.join(OUT, "bed.mp3")], check=True); os.remove(wav)
print("wrote", OUT)
