"""Cuts the narration into one clip per shot at the pauses between sentences (from build/words_long.json, made by
align_long.py), so each shot can be as long as the brief asks while its line starts with it.
Writes assets/audio/<shot>.mp3, build/narration.json and build/words.json. Run after align_long.py."""
import json, os, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, "..")
L = json.load(open(os.path.join(HERE, "words_long.json"))); cfg = json.load(open(os.path.join(HERE, "long.json")))
src = os.path.join(ROOT, cfg["audio"]); shots = L["shots"]
scenes, words = [], {}
for i, s in enumerate(shots):
    a = 0.0 if i == 0 else (shots[i - 1]["words"][-1]["end"] + s["words"][0]["start"]) / 2
    b = L["duration"] if i == len(shots) - 1 else (s["words"][-1]["end"] + shots[i + 1]["words"][0]["start"]) / 2
    out = f"assets/audio/{s['shot']}.mp3"
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", src, "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-c:a", "libmp3lame", "-b:a", "160k", os.path.join(ROOT, out)], check=True)
    scenes.append({"shot": s["shot"], "audio": out, "offset": 0.4, "text": " ".join(w["w"] for w in s["words"])})
    words[s["shot"]] = {"words": [{"w": w["w"], "start": round(w["start"] - a, 3), "end": round(w["end"] - a, 3)} for w in s["words"]], "duration": round(b - a, 3)}
json.dump({"scenes": scenes}, open(os.path.join(HERE, "narration.json"), "w"), ensure_ascii=False, indent=1)
json.dump(words, open(os.path.join(HERE, "words.json"), "w"), ensure_ascii=False, indent=1)
os.remove(os.path.join(HERE, "words_long.json"))
for s in scenes: print(s["shot"], words[s["shot"]]["duration"], s["text"])
