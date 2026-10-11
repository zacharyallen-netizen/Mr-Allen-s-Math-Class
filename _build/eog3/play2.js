const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const file = process.argv[2], tag = process.argv[3], width = +(process.argv[4] || 900), only = process.argv[5] ? process.argv[5].split(',').map(Number) : null;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push('pageerror ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource/.test(m.text())) errs.push(m.text()); });
  await p.goto('file:///home/claude/mr-allen-s-math-class/grade8/' + file);
  await p.selectOption('#questionCount', process.env.N||'45');
  await p.click('#startBtn');
  const total = await p.evaluate(() => state.active.length);
  console.log('pool size', total);
  await p.evaluate(() => { state.active = [...questions].sort((a, b) => a.n - b.n); state.index = 0; renderQuestion(); });
  const fails = []; const boxes = {};
  const box = async () => p.evaluate(() => { const pr = document.querySelector('.main-panel').getBoundingClientRect(); const v = document.querySelector('#visual'); const an = document.querySelector('#answers'); const els=[v, an].filter(e => e && e.getClientRects().length); const r = els.map(e=>e.getBoundingClientRect()); return [Math.min(...r.map(x=>x.top))-pr.top, Math.max(...r.map(x=>x.bottom))-pr.top]; });
  for (let i = 0; i < (+process.env.N||45); i++) {
    const q = await p.evaluate(i => { state.index = i; renderQuestion(); const q = state.active[i]; return { n: q.n, type: q.type, answer: q.answer }; }, i);
    if (only && !only.includes(q.n)) continue;
    const leak = await p.evaluate(() => [...document.querySelectorAll('#game .ans')].filter(e => e.getClientRects().length && e.getBoundingClientRect().width > 0).length);
    if (leak) fails.push(`Q${q.n}: ${leak} answer elements visible before answering`);
    const bad = await p.evaluate(() => /NaN|undefined/.test(document.querySelector('#game').innerHTML));
    if (bad) fails.push(`Q${q.n}: NaN/undefined in markup`);
    boxes[q.n]={a: await box()};
    await p.locator('.main-panel').screenshot({ path: `shots/${tag}_q${String(q.n).padStart(2, '0')}_a_before.png` });
    if (q.type === 'mc' || !q.type) await p.click(`.answer-btn[data-choice="${q.answer}"]`);
    else { await p.fill('#freeInput', q.answer); await p.click('#submitFree'); }
    const good = await p.evaluate(() => document.querySelector('#feedback').classList.contains('good'));
    if (!good) fails.push(`Q${q.n}: keyed answer not marked correct`);
    const givLeft = await p.evaluate(() => [...document.querySelectorAll('#game .giv')].filter(e => e.getClientRects().length && e.getBoundingClientRect().width > 0).length);
    if (givLeft) fails.push(`Q${q.n}: ${givLeft} given-only elements still visible after answering`);
    boxes[q.n].b = await box();
    await p.locator('.main-panel').screenshot({ path: `shots/${tag}_q${String(q.n).padStart(2, '0')}_b_after.png` });
  }
  require('fs').writeFileSync(`boxes_${tag}.json`, JSON.stringify(boxes));
  console.log('errors:', errs);
  console.log('fails:', fails);
  await b.close();
})();
