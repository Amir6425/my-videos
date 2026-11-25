"""Hand alignment of narr.mp3 to the narrator's real text: each phrase is pinned to a speech segment found by
silencedetect (−35 dB, 0.3 s); words share their phrase's time by length. Writes assets/audio/<shot>.mp3,
build/narration.json and build/words.json (offset 0.25 s)."""
import json, os, re, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, "..")
P = [
 ("h1", "نقشه و ساعت رو گذاشت توی کوله‌پشتیش", 0.0, 2.24), ("h1", "و آماده شد بره دوستاش رو پیدا کنه.", 2.49, 4.44),
 ("h2", "یهو صدای خِش‌خِش از کنار قفسه به گوشش رسید،", 5.02, 7.82), ("h2", "وقتی برگشت", 8.40, 9.15), ("h2", "دید یک بی‌سیم به دیوار آویزونه.", 9.42, 11.06),
 ("h3", "یه نفر توی بی‌سیم داشت حرف می‌زد،", 11.58, 13.36), ("h3", "صدای سینا بود.", 13.77, 14.76),
 ("h4", "«آرش نَیا،", 15.23, 16.0), ("h4", "این یه تَله‌س…", 16.19, 17.10), ("h4", "فرار کن!»", 17.26, 17.90),
 ("h5", "آرش ترسید و نمی‌دونست چی‌کار کنه.", 18.40, 20.35),
 ("h6", "برای قسمت بعد شما تعیین کنید آرش چی‌کار کنه؟", 21.02, 24.07), ("h6", "یک:", 24.58, 24.91), ("h6", "فرار کنه.", 25.25, 25.97), ("h6", "دو:", 26.40, 26.69), ("h6", "بره و دوستاش رو نجات بده.", 27.02, 28.53), ("h6", "تو کامنتا بنویس.", 28.88, 29.85),
]
OFF = 0.25
shots = []
for sh, ph, a, b in P:
    if not shots or shots[-1]["shot"] != sh: shots.append({"shot": sh, "words": []})
    ws = ph.split(); L = [max(1, len(re.sub(r"[^\w]", "", w))) + 1.5 for w in ws]; tot = sum(L); t = a
    for w, l in zip(ws, L): d = (b - a) * l / tot; shots[-1]["words"].append({"w": w, "start": t, "end": t + d}); t += d
DUR = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", os.path.join(ROOT, "assets/audio/narr.mp3")], capture_output=True, text=True).stdout)
scenes, words = [], {}
for i, s in enumerate(shots):
    a = 0.0 if i == 0 else (shots[i - 1]["words"][-1]["end"] + s["words"][0]["start"]) / 2
    b = DUR if i == len(shots) - 1 else (s["words"][-1]["end"] + shots[i + 1]["words"][0]["start"]) / 2
    out = f"assets/audio/{s['shot']}.mp3"
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", os.path.join(ROOT, "assets/audio/narr.mp3"), "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-c:a", "libmp3lame", "-b:a", "160k", os.path.join(ROOT, out)], check=True)
    scenes.append({"shot": s["shot"], "audio": out, "offset": OFF, "text": " ".join(w["w"] for w in s["words"])})
    words[s["shot"]] = {"words": [{"w": w["w"], "start": round(w["start"] - a, 3), "end": round(w["end"] - a, 3)} for w in s["words"]], "duration": round(b - a, 3)}
json.dump({"scenes": scenes}, open(os.path.join(HERE, "narration.json"), "w"), ensure_ascii=False, indent=1)
json.dump(words, open(os.path.join(HERE, "words.json"), "w"), ensure_ascii=False, indent=1)
for s in scenes:
    W = words[s["shot"]]; print(s["shot"], W["duration"], "last word ends", round(W["words"][-1]["end"] + OFF, 2))
