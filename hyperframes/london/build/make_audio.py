"""A low, dark bed under the narration: a cello-like drone, distant church bell, wind in the fog.
Generated and seeded. Run: python3 build/make_audio.py   (then node build/build.mjs)"""
import json, os, subprocess, wave
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "..", "assets", "audio")
SR = 44100; rng = np.random.default_rng(21)
TOTAL = json.load(open(os.path.join(HERE, "timing.json")))["total"]; N = int((TOTAL + 0.5) * SR); t = np.arange(N) / SR
def band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); return np.fft.irfft(X / (1 + (lo / np.maximum(f, 1)) ** 4) / (1 + (f / hi) ** 4), len(x))
midi = lambda m: 440 * 2 ** ((m - 69) / 12)
saw = lambda f: sum(np.sin(2 * np.pi * f * h * t + h) / h for h in range(1, 9))
drone = band(saw(midi(36)) * 0.5 + saw(midi(43)) * 0.3 + saw(midi(39)) * 0.2 * np.clip((t - 3) / 3, 0, 1), 40, 900) * (0.75 + 0.25 * np.sin(2 * np.pi * 0.15 * t))
bell = np.zeros(N)
for at in (0.2, 4.6):
    i = int(at * SR); d = np.arange(N - i) / SR
    bell[i:] += sum(np.sin(2 * np.pi * midi(45) * r * d) * a for r, a in ((1, 1), (2.4, 0.5), (3.0, 0.35), (4.2, 0.2))) * np.exp(-d * 0.9)
wind = band(rng.standard_normal(N), 150, 900) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.09 * t))
x = drone / np.max(np.abs(drone)) * 0.5 + bell / np.max(np.abs(bell)) * 0.25 + wind / np.max(np.abs(wind)) * 0.12
fade = np.ones(N); a, r = int(1.0 * SR), int(1.2 * SR); fade[:a] = np.linspace(0, 1, a); fade[-r:] = np.linspace(1, 0, r)
x = x * fade / np.max(np.abs(x)) * 0.7
os.makedirs(OUT, exist_ok=True); wav = os.path.join(OUT, "bed.wav")
with wave.open(wav, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype("<i2").tobytes())
subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", wav, "-b:a", "128k", os.path.join(OUT, "bed.mp3")], check=True); os.remove(wav); print("wrote", OUT)
