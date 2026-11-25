"""Hand alignment of narr.mp3 to the narrator's real text: each phrase is pinned to a speech segment found by
silencedetect (−35 dB, 0.3 s); words share their phrase's time by length. Writes assets/audio/<shot>.mp3,
build/narration.json and build/words.json (offset 0.25 s)."""
import json, os, re, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, "..")
P = [  # (shot, phrase, start, end) in the file
 ("g1", "دقیقه‌ها گذشت.", 0.0, 1.29), ("g1", "چای سرد شد.", 1.73, 2.68), ("g1", "پیرمرد برنگشت.", 3.05, 4.41),
 ("g2", "آرش با خودش گفت:", 5.07, 5.97), ("g2", "«یعنی کجا رفت؟…", 6.50, 7.60), ("g2", "نکنه اون دو تا رو…»", 8.43, 9.50),
 ("g3", "همان‌جا بود که آرش متوجه شد صدای تیک‌تاک از کشوی میز می‌آید.", 11.61, 15.05),
 ("g4", "کشو را باز کرد و دید یک ساعت جیبی قدیمی اونجا هست،", 16.04, 20.65), ("g4", "برداشت،", 21.11, 21.62), ("g4", "دید شمارش ساعت روی ساعت ۶ تنظیم شده بود.", 21.94, 25.06),
 ("g5", "زیر ساعت، کاغذی تاخورده بود.", 25.48, 27.82), ("g5", "یه یادداشت بود.", 28.24, 29.16),
 ("g6", "«دوستانت فقط تا طلوع صبح زنده‌اند…", 29.60, 32.07), ("g6", "جنگل جواب را می‌داند.»", 32.51, 34.33),
 ("g7", "آرش گفت:", 34.86, 35.48), ("g7", "«تا طلوع؟…", 35.87, 36.64), ("g7", "یعنی شش صبح؟!»", 37.28, 38.36),
 ("g8", "آرش به ساعت نگاه کرد.", 38.87, 39.75), ("g8", "دوازده شب بود.", 40.50, 41.73), ("g8", "شش ساعت وقت داشت.", 42.13, 44.80),
 ("g9", "روی دیوار، کنار قفسه، قاب عکسی کج آویزان بود.", 45.29, 48.91), ("g9", "توی عکس، سه پسر جلوی همین کلبه ایستاده بودند.", 49.32, 52.33), ("g9", "صورت یکی‌شان با مداد قرمز خط خورده بود.", 52.82, 55.62),
 ("g10", "آرش با خودش گفت:", 56.10, 57.08), ("g10", "«این…", 57.55, 57.78), ("g10", "این‌ها کی‌ان؟»", 58.26, 59.11),
 ("g11", "آرش عکس را برگرداند.", 59.62, 61.04), ("g11", "با خطی لرزان نوشته شده بود…", 61.48, 63.33), ("g11", "«درخت سوخته…", 63.87, 64.88), ("g11", "آسیاب…", 65.39, 65.93), ("g11", "چاه.»", 66.50, 66.82),
 ("g12", "«این یه مسیره…", 67.41, 68.59), ("g12", "ولی من این جنگل رو بلد نیستم.»", 69.09, 70.72),
 ("g13", "کشوی دوم کمد نیمه‌باز بود.", 71.26, 73.36), ("g13", "داخلش، تکه‌ای کاغذ پاره.", 73.68, 75.50), ("g13", "«یه تیکه نقشه!»", 76.00, 77.22),
 ("g14", "کشوی سوم", 77.71, 78.12), ("g14", "قفل نبود، ولی گیر کرده بود.", 78.54, 81.23),
 ("g15", "تکه‌ی سوم لای کتابی در قفسه بود، و چهارمی… زیر استکان چای پیرمرد.", 81.59, 86.92),
 ("g16", "آرش گفت:", 87.52, 88.07), ("g16", "«یعنی از اول همین‌جا بود…", 88.58, 90.31), ("g16", "جلوی چِشمَم.»", 90.68, 91.60),
 ("g17", "چهار تکه نقشه را می‌چرخاند و کنار هم می‌گذارد.", 92.10, 95.02), ("g17", "آرش با خودش گفت:", 95.54, 96.47), ("g17", "«نقشه کامل شد.»", 96.97, 98.10),
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
