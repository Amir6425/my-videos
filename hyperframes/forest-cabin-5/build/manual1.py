"""Hand timings for narr1.mp3 (silencedetect can't tell the narrator's panting from words). Cuts f1–f4 and merges
them into build/words.json and build/narration.json."""
import json, os, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, "..")
CUTS = {"f1": (0.0, 8.35), "f2": (8.35, 11.1), "f3": (11.1, 13.3), "f4": (13.3, 16.9)}
W = {
 "f1": [("آرش", 0.0, 0.45), ("هنوز", 0.45, 0.95), ("نَفَس‌نَفَس", 0.95, 1.65), ("می‌زد.", 1.65, 2.05), ("لباس‌هایش", 2.93, 3.6), ("خیس", 3.6, 3.95), ("بود", 3.95, 4.25), ("و", 4.25, 4.4), ("دست‌هایش", 4.4, 5.0), ("می‌لرزید.", 5.0, 5.55)],
 "f2": [("پیرمرد", 8.64, 9.05), ("گفت:", 9.05, 9.39), ("«تنها", 9.96, 10.3), ("موندی؟»", 10.3, 10.74)],
 "f3": [("آرش", 11.46, 11.64), ("گفت:", 11.64, 11.83), ("«بله…»", 12.44, 12.8)],
 "f4": [("پیرمرد", 13.76, 13.98), ("گفت:", 13.98, 14.13), ("«پس", 15.03, 15.2), ("تو", 15.2, 15.37), ("هم", 15.37, 15.55), ("انتخاب", 15.55, 15.95), ("نشدی.»", 15.95, 16.35)],
}
NJ, WJ = os.path.join(HERE, "narration.json"), os.path.join(HERE, "words.json")
scenes = [s for s in (json.load(open(NJ))["scenes"] if os.path.exists(NJ) else []) if s["shot"] not in CUTS]
words = {k: v for k, v in (json.load(open(WJ)) if os.path.exists(WJ) else {}).items() if k not in CUTS}
for sh, (a, b) in CUTS.items():
    out = f"assets/audio/{sh}.mp3"
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", os.path.join(ROOT, "assets/audio/narr1.mp3"), "-ss", f"{a}", "-to", f"{b}", "-c:a", "libmp3lame", "-b:a", "160k", os.path.join(ROOT, out)], check=True)
    scenes.append({"shot": sh, "audio": out, "offset": 0.4, "text": " ".join(w for w, _, _ in W[sh])})
    words[sh] = {"words": [{"w": w, "start": round(s - a, 3), "end": round(e - a, 3)} for w, s, e in W[sh]], "duration": round(b - a, 3)}
scenes.sort(key=lambda s: int(s["shot"][1:]))
json.dump({"scenes": scenes}, open(NJ, "w"), ensure_ascii=False, indent=1)
json.dump(dict(sorted(words.items(), key=lambda kv: int(kv[0][1:]))), open(WJ, "w"), ensure_ascii=False, indent=1)
for s in scenes: print(s["shot"], words[s["shot"]]["duration"])
