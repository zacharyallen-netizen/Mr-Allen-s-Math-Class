const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 800 } });
  await p.goto('file:///home/claude/mr-allen-s-math-class/grade8/eog_math_review_game.html');
  await p.click('#startBtn');
  await p.evaluate(() => { state.index = 0; renderQuestion(); });
  await p.click('.answer-btn >> nth=0').catch(async()=>{ await p.fill('#freeInput','1'); await p.click('#submitFree'); });
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.screenshot({ path: 'shots/bottom390g.png' });
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  console.log('scrollWidth', sw);
  // free-response variants
  const r = await p.evaluate(() => {
    const t = (n, vals) => vals.map(v => [n, v, freeMatches(v, questions.find(q => q.n === n))]);
    return [...t(17, ['-12','−12','x = -12',' − 12','12']), ...t(11, ['0.1','.1','1/10','10^-1','10⁻¹','0.01']), ...t(12, ['3.5','7/2','3 1/2','3.4']), ...t(19,['67','67°','67 degrees']), ...t(18,['$10','10.00','10']), ...t(14,['81','3^4','3⁴']), ...t(15,['20']), ...t(13,['13']), ...t(16,['1']), ...t(20,['13 units'])];
  });
  console.log(r.map(x => x.join(' ')).join('\n'));
  await b.close();
})();
