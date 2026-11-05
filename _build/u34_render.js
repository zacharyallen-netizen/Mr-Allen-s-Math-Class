// Units 3-4: print the pre-test (student PDF into grade8; key out of the repo) and the paper test (both out of the repo).
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const G = '/home/claude/mr-allen-s-math-class/grade8/';
const OUT = process.env.OUT_DIR || '/home/claude/outputs/u34/';
const jobs = [
  [G + 'Unit3_4_PreTest.html', G + 'Unit3_4_PreTest.pdf', OUT + 'Unit3_4_PreTest_AnswerKey.pdf'],
  [G + '__u34_test_tmp.html', OUT + 'Unit3_4_Test.pdf', OUT + 'Unit3_4_Test_AnswerKey.pdf'],
];
async function render(page, src, out, reveal) {
  await page.goto('file://' + src, { waitUntil: 'load' }); await page.waitForTimeout(350);
  if (reveal) { await page.evaluate(() => { const r = document.getElementById('reveal'); if (r) r.click(); }); await page.waitForTimeout(250); }
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: out, format: 'Letter', printBackground: true, margin: { top: '0.5in', bottom: '0.5in', left: '0.45in', right: '0.45in' } });
}
const fs = require('fs');
(async () => {
  fs.copyFileSync(OUT + 'Unit3_4_Test.html', G + '__u34_test_tmp.html');   // render beside brand.js / site-bar.js, then remove
  const b = await chromium.launch();
  for (const [src, t, k] of jobs) {
    const p1 = await b.newPage(); await render(p1, src, t, false); await p1.close();
    const p2 = await b.newPage(); await render(p2, src, k, true); await p2.close();
    console.log('rendered', t, k);
  }
  await b.close();
  fs.unlinkSync(G + '__u34_test_tmp.html');
})();
