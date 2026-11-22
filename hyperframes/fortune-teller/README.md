# داستان فال‌گیر · HyperFrames

انیمیشن دوبعدی عمودی (1080×1920، ۳۰ فریم، حدود ۸۶ ثانیه) که با کد ساخته شده: شخصیت‌ها SVG هستند و حرکت‌ها با GSAP روی تایم‌لاین HyperFrames.

## ساختار
- `build/chars.mjs` — شخصیت‌ها (دختر جوان، پیرمرد فال‌گیر). هر صحنه از همین تابع‌ها می‌کشد تا چهره و لباس در همه‌ی نماها یکی بماند.
- `build/lib.mjs` — قالب صحنه، دوربین، پلک‌زدن، حالت چهره، اتاق و تابلوها.
- `build/scene1.mjs` — صحنه‌ی ۱ (اتاق فال‌گیر). متن کاغذ در `NOTE` است.
- `build/scene2.mjs` — صحنه‌ی ۲ (خیابان و تاکسی).
- `build/scene3.mjs` — صحنه‌های ۳ تا ۶ (تخت، ساعت ۱۱:۰۰، خواندن کاغذ، گوشی). متن پیام در `MESSAGE` است.
- `build/make_audio.py` — موسیقی و افکت‌ها، با کد ساخته می‌شوند (بدون فایل صوتی بیرونی).
- `index.html` و `compositions/` — ساخته‌ی `build/build.mjs`؛ دستی ویرایش نکنید.

## ساخت دوباره و رندر
```bash
node build/build.mjs
python3 build/make_audio.py   # فقط اگر زمان‌بندی نماها عوض شد
node build/build.mjs
npx hyperframes check
npx hyperframes render -o renders/fortune-teller.mp4
```

فونت‌ها: Vazirmatn و Aref Ruqaa (هر دو SIL Open Font License).
