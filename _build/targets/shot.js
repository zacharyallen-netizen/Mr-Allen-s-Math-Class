// node shot.js in.html out.png [--answer] [--width 760]
// Screenshots a page. --answer clicks the correct choice on every card so the worked steps show.
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const [inp, out] = process.argv.slice(2);
  const answer = process.argv.includes('--answer');
  const wi = process.argv.indexOf('--width'); const width = wi > 0 ? +process.argv[wi + 1] : 760;
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(inp.startsWith('http') ? inp : 'file://' + require('path').resolve(inp), { waitUntil: 'load' });
  await p.waitForTimeout(400);
  if (answer) await p.evaluate(() => document.querySelectorAll('.ch[data-ok="1"]').forEach(b => b.click()));
  await p.waitForTimeout(150);
  await p.screenshot({ path: out, fullPage: true });
  if (errs.length) console.log('PAGE ERRORS:', errs.join(' | ').slice(0, 500));
  await b.close();
})();
