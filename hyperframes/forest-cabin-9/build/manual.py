"""Hand alignment of narr.mp3 to the narrator's real text: each phrase is pinned to a speech segment found by
silencedetect (−35 dB, 0.3 s); words share their phrase's time by length. Writes assets/audio/<shot>.mp3,
build/narration.json and build/words.json (offset 0.25 s)."""
import json, os, re, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, "..")
P = [
 ("m1", "آرش خواند:", 0.0, 1.28),
 ("m2", "«فردا با آن دو تا میریم سَرِ چاه.", 1.76, 4.08), ("m2", "اگه نترسن،", 5.02, 5.71), ("m2", "باهم رفیق میشیم.»", 6.46, 8.23),
 ("m3", "آرش با خودش گفت:", 8.83, 10.52), ("m3", "«رفیق؟…", 11.21, 12.19), ("m3", "چاه؟…", 12.66, 13.33), ("m3", "این…", 13.81, 14.31), ("m3", "همون عکسه!", 14.98, 15.97), ("m3", "اونا صورت منو خط زده بودن!»", 16.41, 17.98),
 ("m4", "ناگهان بی‌سیم روی کمرش خش‌خش کرد.", 18.52, 21.00), ("m4", "این بار، صدای پیرمرد بود.", 21.52, 23.21),
 ("m5", "پیرمرد گفت:", 23.93, 24.75), ("m5", "«آفرین پسر.", 25.22, 26.05), ("m5", "اولی رو پیدا کردی.", 26.59, 27.73), ("m5", "دوستت نزدیکه…", 28.26, 29.19), ("m5", "اما زمین همیشه اون چیزی نیست که نشون میده،", 29.70, 32.46), ("m5", "پس بهتره با نقشه حرکت کنی.»", 32.90, 34.60),
 ("m6", "آرش گفت:", 35.18, 35.80), ("m6", "«زمین؟…", 36.10, 36.72), ("m6", "یعنی چی؟»", 37.18, 37.85),
 ("m7", "کمی آن‌طرف‌تر، روی برگ‌ها،", 38.36, 39.42), ("m7", "یه ردِ پا بود.", 39.68, 40.63), ("m7", "جای پای کسی", 40.88, 41.95), ("m7", "که فقط یک کفش داشت.", 42.47, 44.88),
 ("m8", "آرش گفت:", 45.40, 46.04), ("m8", "«مهران؟…", 46.47, 46.94), ("m8", "دارم میام.»", 47.28, 47.86),
 ("m9", "برای ادامه داستان شما نظر بدید آرش چی‌کار کنه؟", 48.38, 51.53), ("m9", "به پیرمرد اعتماد کنه و طبق نقشه بره جلو،", 52.16, 55.03), ("m9", "یا نشونه‌ها رو دنبال کنه", 55.36, 56.82), ("m9", "و بره دنبال ردِ پای مهران؟", 57.20, 58.84),
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
