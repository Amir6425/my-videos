"""Synthesises the film's sound: a quiet ambient score (music.mp3) and the sound effects (sfx.mp3), timed to
the shots in build/timing.json. Everything is generated here (no samples), seeded, so it is reproducible.
Run: python3 build/make_audio.py   (then node build/build.mjs)"""
import json, os, subprocess, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "assets", "audio")
SR = 44100
rng = np.random.default_rng(11)
T = json.load(open(os.path.join(HERE, "timing.json")))
TOTAL, S = T["total"], T["starts"]
N = int((TOTAL + 0.5) * SR)


def t_(dur):
    return np.arange(int(dur * SR)) / SR


def band(x, lo, hi):
    """Band-pass by FFT masking with soft edges."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    m = 1 / (1 + (lo / np.maximum(f, 1)) ** 4) / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, len(x))


def norm(x, peak=1.0):
    m = np.max(np.abs(x)) or 1
    return x / m * peak


def env(n, a, r):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e


def reverb(x, secs=2.2, mix=0.35):
    n = int(secs * SR)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / (SR * secs / 6))
    ir = band(ir, 200, 6000)
    L = len(x) + n
    y = np.fft.irfft(np.fft.rfft(x, L) * np.fft.rfft(ir, L), L)[: len(x)]
    return x * (1 - mix) + norm(y, np.max(np.abs(x)) + 1e-9) * mix


def put(track, at, sig, gain=1.0):
    i = int(at * SR)
    j = min(len(track), i + len(sig))
    if i < len(track):
        track[i:j] += sig[: j - i] * gain


# ── music: slow pad with chord changes, a sparse music-box motif, two stings ─────────────────────
def midi(m):
    return 440 * 2 ** ((m - 69) / 12)


CHORDS = [  # (start, notes) in MIDI
    (0, [45, 52, 57, 60]), (S["s1d"], [41, 48, 57, 60]), (S["s1g"], [38, 50, 53, 57]), (S["s1j"], [45, 52, 57, 60]),
    (S["s2a"], [40, 52, 55, 59]), (S["s2b"], [41, 53, 57, 60]), (S["s3"], [45, 52, 57, 60]), (S["s4"], [40, 52, 55, 59]),
    (S["s5a"], [41, 53, 57, 60]), (S["s5c"], [38, 50, 53, 58]), (S["s6a"], [45, 52, 57, 60]), (S["s6c"], [41, 52, 57, 60]),
]
music = np.zeros(N)
tt = np.arange(N) / SR
for k, (st, notes) in enumerate(CHORDS):
    en = CHORDS[k + 1][0] if k + 1 < len(CHORDS) else TOTAL + 0.5
    a, b = int(max(0, st - 1.0) * SR), int(min(TOTAL + 0.5, en + 1.0) * SR)
    seg_t = tt[a:b]
    pad = np.zeros(b - a)
    for i, m in enumerate(notes):
        f = midi(m)
        for det in (-0.12, 0.12):
            pad += np.sin(2 * np.pi * (f * (1 + det / 100)) * seg_t + i) * (0.5 if i == 0 else 0.3)
            pad += 0.12 * np.sin(2 * np.pi * 2 * f * seg_t + i * 2)
    pad *= 0.75 + 0.25 * np.sin(2 * np.pi * 0.11 * seg_t + k)
    fade = np.ones(b - a)
    nf = int(1.0 * SR)
    fade[:nf] = np.sin(np.linspace(0, np.pi / 2, nf)) ** 2
    fade[-nf:] = np.cos(np.linspace(0, np.pi / 2, nf)) ** 2
    music[a:b] += pad * fade
music = band(music, 60, 2400)
music = norm(music, 0.5)

# music box: a pentatonic motif every ~3.2 s, quieter in the street scene
motif = [69, 72, 76, 74, 72, 67, 69, 64]
for i, at in enumerate(np.arange(1.5, TOTAL - 2, 1.6)):
    if S["s2a"] <= at < S["s3"]:
        continue
    m = motif[i % len(motif)]
    d = t_(1.6)
    tone = np.sin(2 * np.pi * midi(m) * d) + 0.3 * np.sin(2 * np.pi * midi(m) * 3 * d) + 0.1 * np.sin(2 * np.pi * midi(m) * 5.1 * d)
    put(music, at, tone * np.exp(-d * 3.2) * env(len(d), 0.004, 0.05), 0.09)


def sting(at, low=33, gain=0.5):
    d = t_(4.0)
    boom = np.sin(2 * np.pi * midi(low) * d * (1 - 0.05 * d)) * np.exp(-d * 1.3)
    shimmer = band(rng.standard_normal(len(d)), 3000, 9000) * np.exp(-((d - 0.6) ** 2) / 0.3) * 0.3
    put(music, at, (boom + shimmer) * env(len(d), 0.01, 0.5), gain)


sting(S["s4"], 33, 0.55)
sting(S["s5c"] + 1.5, 36, 0.45)
music = reverb(music, 3.0, 0.4)
music *= env(N, 1.5, 2.5)
music = norm(music, 0.8)

# ── sound effects ───────────────────────────────────────────────────────────────────────────────────
sfx = np.zeros(N)


def noise(d):
    return rng.standard_normal(int(d * SR))


def rustle(d=0.45, lo=1500, hi=8000):
    x = band(noise(d), lo, hi)
    crack = np.repeat(rng.random(int(d * 200)) ** 3, SR // 200 + 1)[: len(x)]
    return norm(x * (0.3 + crack) * env(len(x), 0.02, d * 0.5), 0.8)


def scratch(d):
    x = band(noise(d), 2500, 7000)
    tt_ = t_(d)
    strokes = np.abs(np.sin(2 * np.pi * 6.5 * tt_ + 3 * np.sin(2 * np.pi * 1.3 * tt_))) ** 2
    return norm(x * strokes * env(len(x), 0.05, 0.1), 0.6)


def step(gain=1.0):
    d = t_(0.18)
    thump = np.sin(2 * np.pi * (90 - 200 * d) * d) * np.exp(-d * 35)
    click = band(rng.standard_normal(len(d)), 300, 2500) * np.exp(-d * 60) * 0.5
    return (thump + click) * gain


def thud(f=55, d=0.5):
    x = t_(d)
    return np.sin(2 * np.pi * f * x) * np.exp(-x * 9) + band(rng.standard_normal(len(x)), 80, 900) * np.exp(-x * 25) * 0.6


def creak(d=0.7):
    x = t_(d)
    f = 340 + 160 * x / d + 30 * np.sin(2 * np.pi * 23 * x)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 61 * x)))
    return band(s, 200, 3000) * env(len(x), 0.05, 0.2) * 0.4


def click(f=3000, d=0.03):
    x = t_(0.06)
    return np.sin(2 * np.pi * f * x) * np.exp(-x * (6.6 / d))


def tap():
    x = t_(0.04)
    return band(rng.standard_normal(len(x)), 1500, 6000) * np.exp(-x * 160) * 0.5 + np.sin(2 * np.pi * 1800 * x) * np.exp(-x * 300) * 0.2


def engine(d, f0, f1, g0, g1):
    x = t_(d)
    f = np.linspace(f0, f1, len(x))
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = sum(np.sin(ph * h) / h for h in range(1, 7))
    rumble = band(rng.standard_normal(len(x)), 30, 400)
    return (tone * 0.5 + norm(rumble, 0.6)) * np.linspace(g0, g1, len(x))


# room: chair scrape as she stands, footsteps, door
put(sfx, S["s1h"] + 0.5, scratch(3.0), 0.5)
s1h_fold = S["s1h"] + 0.5 + 0.85 + 0.2 + 0.85 + 0.2 + 0.9 + 0.35
put(sfx, s1h_fold, rustle(0.5), 0.55)
put(sfx, s1h_fold + 0.35, rustle(0.4), 0.45)
put(sfx, s1h_fold + 0.85, rustle(0.7, 800, 5000), 0.35)
put(sfx, s1h_fold + 2.45, rustle(0.6), 0.45)
put(sfx, S["s1g"] + 0.85, rustle(0.5, 800, 6000), 0.3)
put(sfx, S["s1i"] + 0.1, rustle(0.4), 0.25)
put(sfx, S["s1j"] + 0.6, band(noise(0.6), 400, 1600) * env(int(0.6 * SR), 0.05, 0.3) * np.linspace(0.3, 1, int(0.6 * SR)), 0.25)
for k in range(7):
    put(sfx, S["s1j"] + 2.25 + k * 3.0 / 7, step(0.9 - k * 0.07), 0.6)
put(sfx, S["s1j"] + 5.0, creak(0.7), 0.6)
put(sfx, S["s1j"] + 6.75, thud(70, 0.6), 0.55)
put(sfx, S["s1j"] + 6.78, click(1200, 0.05), 0.2)

# street: ambience, the taxi, its door
amb_d = S["s3"] - S["s2a"]
amb = band(noise(amb_d), 40, 900) * 0.5 + band(noise(amb_d), 1500, 5000) * 0.05
put(sfx, S["s2a"], norm(amb, 1) * env(len(amb), 0.4, 0.8), 0.18)
for at, d, f0, f1, g0, g1 in [(S["s2a"] + 1.5, 2.2, 40, 46, 0.0, 0.5), (S["s2b"], 2.8, 46, 30, 0.6, 0.35), (S["s2b"] + 2.8, 3.2, 30, 30, 0.35, 0.35), (S["s2b"] + 6.0, 2.6, 30, 58, 0.4, 0.0)]:
    put(sfx, at, engine(d, f0, f1, g0, g1), 0.45)
put(sfx, S["s2b"] + 2.6, band(noise(0.3), 2000, 6000) * env(int(0.3 * SR), 0.02, 0.2) * 0.15, 1)
put(sfx, S["s2b"] + 3.95, click(900, 0.06) + click(2400, 0.03), 0.4)
put(sfx, S["s2b"] + 5.68, thud(80, 0.45) + np.pad(click(700, 0.05), (0, int(0.45 * SR) - int(0.06 * SR))), 0.6)
for k in range(3):
    put(sfx, S["s2b"] + 2.9 + k * 0.33, step(0.6), 0.45)

# bedroom: paper, phone, typing
put(sfx, S["s5a"] + 1.2, rustle(0.4), 0.4)
put(sfx, S["s5a"] + 2.4, rustle(0.55, 1000, 7000), 0.55)
put(sfx, S["s5b"] + 0.2, rustle(0.6, 1200, 6000), 0.2)
put(sfx, S["s6a"] + 0.75, rustle(0.4), 0.35)
put(sfx, S["s6a"] + 1.65, click(500, 0.05), 0.25)
put(sfx, S["s6b"] + 1.05, click(2600, 0.03) + click(1800, 0.04), 0.4)
for k in range(19):
    put(sfx, S["s6b"] + 1.8 + k * 0.17, tap(), 0.5 * (0.8 + 0.4 * rng.random()))
for k in range(int((S["s6c"] and (TOTAL - S["s6c"] - 0.4)) / 0.22)):
    put(sfx, S["s6c"] + 0.2 + k * 0.22 + 0.06, tap(), 0.4 * (0.8 + 0.4 * rng.random()))

sfx = reverb(sfx, 0.9, 0.18)
sfx = norm(sfx, 0.9)


def write(name, x):
    os.makedirs(OUT, exist_ok=True)
    wav = os.path.join(OUT, name + ".wav")
    with wave.open(wav, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", wav, "-codec:a", "libmp3lame", "-b:a", "128k", os.path.join(OUT, name + ".mp3")], check=True)
    os.remove(wav)


write("music", music)
write("sfx", sfx)
print("wrote", OUT)
