"""Hand alignment of narr.mp3 to the narrator's real text: each phrase is pinned to a speech segment found by
silencedetect (−35 dB, 0.3 s); words share their phrase's time by length. Writes assets/audio/<shot>.mp3,
build/narration.json and build/words.json (offset 0.25 s)."""
import json, os, re, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, "..")
P = [
 ("k1", "تو قسمت قبلی، توی نظرسنجی آخر گفتین که آرش باید بره دنبال دوستاش.", 0.0, 5.07), ("k1", "پس بیاید بریم برای ادامه‌ی ماجرا…", 5.56, 7.43),
 ("k2", "آرش دکمه را فشار داد و فریاد زد: «سینا! کجایی؟ مهران پیشته؟»", 8.12, 12.86),
 ("k3", "جوابی نیامد.", 13.43, 14.48), ("k3", "فقط خش‌خش…", 14.99, 16.23), ("k3", "و بعد،", 16.75, 17.18), ("k3", "سکوت.", 17.58, 18.16),
 ("k4", "آرش با خودش گفت:", 18.83, 19.76), ("k4", "«اون گفت یه تله‌ست…", 20.19, 21.38), ("k4", "ولی اگه من نَرَم دنبالشون، دوتاشون می‌میرن.»", 21.79, 24.24),
 ("k5", "کوله‌پشتی رو انداخت روی دوشش و رفت.", 24.78, 27.07),
 ("k6", "در رو باز کرد", 27.52, 28.48), ("k6", "و وارد جنگل تاریک شد.", 28.83, 30.53),
 ("k7", "طبق نقشه، اولین نقطه‌ی قرمز درخت سوخته بود.", 31.19, 34.49), ("k7", "سمت شمال،", 34.79, 35.53), ("k7", "کنار رودخونه.", 35.79, 36.62),
 ("k8", "زیر پایش شاخه‌ها می‌شکستند.", 37.12, 39.02), ("k8", "هر صدایی، او را بیشتر می‌ترساند.", 39.44, 41.81),
 ("k9", "ناگهان، روی شاخه‌ای، چیزی قرمز دید.", 42.33, 45.17), ("k9", "یک روبان!", 45.52, 46.32),
 ("k10", "آرش گفت:", 46.76, 47.26), ("k10", "«یکی تو راه برام علامت گذاشته…»", 47.81, 49.96),
 ("k11", "صدای آب آمد.", 50.52, 51.63), ("k11", "رودخونه نزدیک بود.", 51.99, 53.18), ("k11", "و آن‌طرف نهر، سایه‌ای سیاه و بزرگ.", 53.53, 56.52),
 ("k12", "آرش از روی سنگ‌های رودخونه گذشت و به درخت رسید.", 57.04, 60.43),
 ("k13", "روی تنه‌ی درخت، سه عدد کنده شده بود:", 60.98, 63.68), ("k13", "هفت…", 64.09, 64.55), ("k13", "سه…", 65.51, 65.86), ("k13", "چهار.", 66.51, 67.23),
 ("k14", "پای درخت، میان ریشه‌ها،", 67.43, 68.36), ("k14", "جعبه‌ای فلزی با قفل رمزی بود.", 68.61, 70.76),
 ("k15", "آرش گفت:", 71.29, 71.87), ("k15", "«سه تا عدد… سه رقم رمز.»", 72.0, 74.52),
 ("k16", "قفل باز شد.", 74.91, 75.81), ("k16", "داخل جعبه، یه لنگه کفش گِلی بود…", 76.40, 78.92), ("k16", "کفشِ مهران؟!", 79.30, 80.22),
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
