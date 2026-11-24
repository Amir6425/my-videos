const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 2 });
  await p.goto('file://' + process.argv[2]); await p.waitForTimeout(1500); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: process.argv[3] });
  await p.evaluate(() => { const s = document.querySelector('svg'); s.style.clipPath = 'circle(50%)'; document.body.style.background = '#fff'; });
  await p.screenshot({ path: process.argv[4] }); await b.close(); })();
