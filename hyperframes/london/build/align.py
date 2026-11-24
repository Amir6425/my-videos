"""Word timings for the narration: the words of build/narration.json's text are spread over the speech
segments of the audio (found from silence), in proportion to their letters, then each boundary is snapped to the
nearest dip in loudness. Writes build/words.json. Run: python3 build/align.py"""
import json, os, subprocess, re
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, "..")
cfg = json.load(open(os.path.join(HERE, "narration.json")))
words = [w for w in re.split(r"\s+", cfg["text"].strip()) if w]
if not words: raise SystemExit("narration.json has no text yet")
pcm = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", os.path.join(ROOT, cfg["audio"]), "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True, check=True).stdout
x = np.frombuffer(pcm, dtype="<i2").astype(np.float32) / 32768
hop = 160; rms = np.sqrt(np.convolve(x ** 2, np.ones(400) / 400, mode="same"))[::hop]; t = np.arange(len(rms)) * hop / 16000
db = 20 * np.log10(rms + 1e-6); speech = db > (db.max() - 32)
# speech segments: runs of speech separated by >= 0.12 s of quiet
segs, start, quiet = [], None, 0
for i, s in enumerate(speech):
    if s:
        if start is None: start = i
        quiet = 0
    elif start is not None:
        quiet += 1
        if quiet * hop / 16000 >= 0.12: segs.append((t[start], t[i - quiet])); start, quiet = None, 0
if start is not None: segs.append((t[start], t[-1]))
segs = [s for s in segs if s[1] - s[0] > 0.08]
weight = lambda w: max(1, len(re.sub(r"[^\w]", "", w)))
# give each segment a share of the words in proportion to its duration (by letters), keeping order
total_len = sum(b - a for a, b in segs); letters = [weight(w) for w in words]; L = sum(letters)
out, wi = [], 0
for si, (a, b) in enumerate(segs):
    share = L * (b - a) / total_len
    take, acc = [], 0
    while wi < len(words) and (acc + letters[wi] / 2 <= share or not take or si == len(segs) - 1):
        take.append(wi); acc += letters[wi]; wi += 1
        if si < len(segs) - 1 and acc >= share: break
    if not take: continue
    tot = sum(letters[i] for i in take); cur = a
    for j, i in enumerate(take):
        end = b if j == len(take) - 1 else cur + (b - a) * letters[i] / tot
        if j < len(take) - 1:  # snap the boundary to the quietest frame within ±0.12 s
            m = (t > end - 0.12) & (t < end + 0.12)
            if m.any():
                cand = float(t[m][np.argmin(db[m])])
                nxt = b if j + 1 == len(take) - 1 else cur + (b - a) * (letters[i] + letters[take[j + 1]]) / tot
                if cand - cur >= 0.12 and nxt - cand >= 0.12: end = cand
        out.append({"w": words[i], "start": round(cur, 3), "end": round(end, 3)}); cur = end
json.dump({"segments": segs, "words": out}, open(os.path.join(HERE, "words.json"), "w"), ensure_ascii=False, indent=1)
for w in out: print(f'{w["start"]:6.2f} {w["end"]:6.2f}  {w["w"]}')
