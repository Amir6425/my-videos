"""Word timings for the narration: the words of build/narration.json's text are spread over the speech
segments of the audio (found from silence), in proportion to their letters, then each boundary is snapped to the
nearest dip in loudness. Writes build/words.json. Run: python3 build/align.py"""
import json, os, subprocess, re
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, "..")
ALL = json.load(open(os.path.join(HERE, "narration.json")))["scenes"]
result = {}
for cfg in ALL:
    words = [w for w in re.split(r"\s+", cfg["text"].strip()) if w]
    if not words: continue  #("narration.json has no text yet")
    pcm = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", os.path.join(ROOT, cfg["audio"]), "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(pcm, dtype="<i2").astype(np.float32) / 32768
    hop = 160; rms = np.sqrt(np.convolve(x ** 2, np.ones(400) / 400, mode="same"))[::hop]; t = np.arange(len(rms)) * hop / 16000
    db = 20 * np.log10(rms + 1e-6); speech = db > -44
    # speech segments from ffmpeg's silencedetect (quiet below -35 dB for at least 0.12 s)
    log = subprocess.run(["ffmpeg", "-nostdin", "-i", os.path.join(ROOT, cfg["audio"]), "-af", "silencedetect=noise=-35dB:d=0.12", "-f", "null", "-"], capture_output=True, text=True).stderr
    ss = [float(v) for v in re.findall(r"silence_start: ([\d.]+)", log)]; se = [float(v) for v in re.findall(r"silence_end: ([\d.]+)", log)]
    dur_a = len(x) / 16000
    edges = sorted([(v, "s") for v in ss] + [(v, "e") for v in se])
    segs, cur = [], 0.0
    for v, kind in edges:
        if kind == "s" and v - cur > 0.05: segs.append((cur, v))
        if kind == "e": cur = v
    if dur_a - cur > 0.05: segs.append((cur, dur_a))
    segs = [s for s in segs if s[1] - s[0] > 0.08]
    spoken = cfg.get("spoken", {})
    weight = lambda w: max(1, len(re.sub(r"[^\w]", "", spoken.get(w, w))))
    letters = [weight(w) for w in words]
    groups = cfg.get("groups")
    if not groups or len(groups) != len(segs) or sum(groups) != len(words):
        raise SystemExit(f"groups {groups} must list words per segment for {len(segs)} segments and {len(words)} words")
    out, wi = [], 0
    for (a, b), g in zip(segs, groups):
        take = list(range(wi, wi + g)); wi += g
        tot = sum(letters[i] for i in take); cur = a
        bounds = []; acc = 0
        for i in take[:-1]: acc += letters[i]; bounds.append(a + (b - a) * acc / tot)
        snapped = []
        for k, e in enumerate(bounds):  # snap each boundary to the quietest frame within ±0.1 s, keeping words >= 0.12 s
            lo = (snapped[-1] if snapped else a) + 0.12; hi = (bounds[k + 1] if k + 1 < len(bounds) else b) - 0.12
            m = (t > max(lo, e - 0.1)) & (t < min(hi, e + 0.1))
            snapped.append(float(t[m][np.argmin(db[m])]) if m.any() else e)
        edges = [a] + snapped + [b]
        for j, i in enumerate(take): out.append({"w": words[i], "start": round(edges[j], 3), "end": round(edges[j + 1], 3)})
    result[cfg["shot"]] = {"segments": segs, "words": out, "duration": round(len(x) / 16000, 3)}
    print(cfg["shot"]); [print(f'{w["start"]:6.2f} {w["end"]:6.2f}  {w["w"]}') for w in out]
json.dump(result, open(os.path.join(HERE, "words.json"), "w"), ensure_ascii=False, indent=1)
