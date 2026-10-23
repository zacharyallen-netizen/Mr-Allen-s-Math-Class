// Plays Flashpoint in a real browser (endpoint intercepted), sends, and checks the page label carries level, points and stars.
// Serve the repo first: python3 -m http.server 8742 --bind 127.0.0.1   (from the repo root)
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs = require('fs');
const OUT = __dirname + '/payloads/';
const URL = 'http://127.0.0.1:8742/grade8/Fluency-Lab-Package/fluency-lab/flashpoint.html';
const IGN = /fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext|net::ERR/;
const fail = m => { console.error('FAIL:', m); process.exitCode = 1; };
const ok = (c, m) => c ? console.log('ok  ', m) : fail(m);
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };

// read the problem on screen and work out the answer
async function solve(p) {
  return p.evaluate(() => {
    const el = document.getElementById('prob'), fr = el.querySelectorAll('.fr');
    const op = el.querySelector('.op').textContent;
    if (fr.length === 2) {
      const [n1, d1] = [...fr[0].children].map(x => +x.textContent), [n2, d2] = [...fr[1].children].map(x => +x.textContent);
      return { kind: 'frac', n1, d1, n2, d2, op };
    }
    const nums = [...el.children].filter(c => !c.classList.contains('op') && !c.classList.contains('eq')).map(c => +c.textContent.replace(/[()]/g, '').replace('−', '-'));
    return { kind: 'int', a: nums[0], b: nums[1], op };
  });
}
async function waitProblem(p, seq) {
  await p.waitForFunction(s => { const e = document.getElementById('prob'); return (!document.getElementById('card').hidden && e && +e.dataset.seq > s && document.querySelector('#answer input')) ||
                                 !document.getElementById('results').hidden; }, seq, { timeout: 15000 });
  return p.evaluate(() => document.getElementById('results').hidden ? +document.getElementById('prob').dataset.seq : -1);
}
// play: plan(seq) → 'right' | 'wrong'; stopAfter = end the round early after this many problems
async function playRound(p, plan, stopAfter) {
  let seq = 0, right = 0, wrong = 0;
  for (;;) {
    seq = await waitProblem(p, seq);
    if (seq < 0) break;
    if (stopAfter && seq > stopAfter) { await p.click('#bQuit'); break; }
    const q = await solve(p), good = plan(seq) === 'right';
    if (q.kind === 'int') {
      const v = q.op === '+' ? q.a + q.b : q.op === '×' ? q.a * q.b : q.op === '÷' ? q.a / q.b : q.a - q.b;
      await p.fill('#a0', String(good ? v : v + 1)); await p.press('#a0', 'Enter');
    } else {
      const L = q.d1 * q.d2 / gcd(q.d1, q.d2), a = q.n1 * L / q.d1, b = q.n2 * L / q.d2, num = q.op === '+' ? a + b : a - b;
      await p.fill('#an', String(good ? num : num + 1)); await p.fill('#ad', String(L)); await p.press('#ad', 'Enter');
      if (good) {                                            // bonus offered? answer it in simplest form
        const bonus = await p.waitForFunction(() => !document.getElementById('bonus').hidden || !document.getElementById('results').hidden ||
                                                     +document.getElementById('prob').dataset.seq > 0 && !document.querySelector('#card.ok'), null, { timeout: 4000 }).then(() => p.evaluate(() => !document.getElementById('bonus').hidden)).catch(() => false);
        if (bonus) {
          const g = gcd(num, L), rn = num / g, rd = L / g;
          if (await p.$('#bw') && !(await p.$('#bn'))) { await p.fill('#bw', String(rn / rd)); await p.press('#bw', 'Enter'); }
          else if (await p.$('#bw')) { await p.fill('#bw', String(Math.floor(rn / rd))); await p.fill('#bn', String(rn % rd)); await p.fill('#bd', String(rd)); await p.press('#bd', 'Enter'); }
          else { await p.fill('#bn', String(rn)); await p.fill('#bd', String(rd)); await p.press('#bd', 'Enter'); }
        }
      }
    }
    good ? right++ : wrong++;
  }
  await p.waitForSelector('#results:not([hidden])');
  return p.evaluate(() => ({ points: +document.getElementById('rScore').textContent.replace(/\D/g, ''), stars: document.querySelectorAll('#rStars i.on').length,
                             right: document.getElementById('rRight').textContent, lvl: document.getElementById('rLvl').textContent }));
}
async function send(p, captured, file) {
  const n = captured.length;
  await p.fill('#ssname', 'Test Student'); await p.click('#ssbtn');
  await p.waitForFunction(() => /Sent|Got it/.test(document.getElementById('ssmsg').textContent), null, { timeout: 8000 });
  ok(captured.length === n + 1, 'one payload sent');
  const d = JSON.parse(captured[captured.length - 1]); fs.writeFileSync(OUT + file, JSON.stringify(d, null, 1)); return d;
}

(async () => {
  const b = await chromium.launch(), errors = [];
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage(), captured = [];
  p.on('pageerror', e => errors.push(String(e)));
  p.on('console', m => { if (m.type() === 'error' && !IGN.test(m.text())) errors.push(m.text()); });
  await p.route('**/script.google.com/**', async route => { captured.push(route.request().postData());
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, name: 'Test Student', n: 1, right: 1 }) }); });
  await p.goto(URL); await p.evaluate(() => localStorage.clear()); await p.goto(URL);

  // Round A: Level 1, full 20 problems: problems 3, 7, 11 wrong (each comes back once; answered right then)
  await p.click('#bPlay');
  let res = await playRound(p, s => [3, 7, 11].includes(s) ? 'wrong' : 'right');
  console.log('     round A shown:', JSON.stringify(res));
  let d = await send(p, captured, 'flash_L1_full.json');
  console.log('     label:', d.page);
  ok(d.page === `Fluency Lab · Flashpoint · Level 1 · ${res.points.toLocaleString('en-US')} points · ${res.stars} star${res.stars === 1 ? '' : 's'}`, 'label = level 1 + points + stars shown on the results screen');
  const tries = d.items.reduce((t, i) => t + i.tries, 0), fin = d.items.reduce((t, i) => t + i.final, 0);
  ok(tries === 20 && res.right === fin + '/20' && res.stars === (fin >= 19 ? 3 : fin >= 16 ? 2 : fin >= 12 ? 1 : 0),
     'full round: ' + d.items.length + ' problems + retries = 20 answered, ' + fin + ' right → ' + res.stars + ' stars (same as the results screen)');

  // Round B: "Play again", end early after 6 problems — label must describe THIS round
  await p.click('#bAgain');
  res = await playRound(p, s => s === 2 ? 'wrong' : 'right', 6);
  console.log('     round B shown:', JSON.stringify(res));
  d = await send(p, captured, 'flash_L1_again_early.json');
  console.log('     label:', d.page);
  ok(d.page === `Fluency Lab · Flashpoint · Level 1 · ${res.points.toLocaleString('en-US')} points · 0 stars` && res.stars === 0, 'after Play again + End round: label shows the new round (points, 0 stars)');

  // Round C: Level 4 (fractions, bonuses add points), full round, all right → 3 stars, points > 20 × 40
  await p.goto(URL + '?level=4');
  await p.click('#bPlay');
  res = await playRound(p, () => 'right');
  console.log('     round C shown:', JSON.stringify(res));
  d = await send(p, captured, 'flash_L4_full.json');
  console.log('     label:', d.page);
  ok(d.page === `Fluency Lab · Flashpoint · Level 4 · ${res.points.toLocaleString('en-US')} points · 3 stars` && res.points >= 800, 'level 4 label: points include bonuses, 3 stars');
  ok(/,/.test(d.page) === res.points >= 1000, 'points written with a thousands comma (as in "1,240 points")');

  // feed the three real payloads into the v3 script and read its Flashpoint tab
  const { load } = require('../mockgas');
  const G = load(__dirname + '/../ScoreTracker_v3.gs'); G.setup();
  for (const f of ['flash_L1_full.json', 'flash_L1_again_early.json', 'flash_L4_full.json'])
    ok(JSON.parse(G.doPost({ postData: { contents: fs.readFileSync(OUT + f, 'utf8') } }).s).ok, 'v3 accepts ' + f);
  G.refreshReports();
  const ss = Object.values(G.__books)[0], fp = ss.getSheetByName('Flashpoint').data;
  const row = fp.find(r => r[0] === 'Test Student');
  console.log('     v3 Flashpoint row:', JSON.stringify(row));
  ok(row && row[2] === 17 && row[3] === '★★☆' && row[8] === 20 && row[9] === '★★★' && row[12] === res.points && row[13] === 3,
     'v3 Flashpoint tab: L1 best 17 ★★☆ (the early round does not replace it), L4 20 ★★★, best points from the label, 3 rounds');
  ok(!errors.length, 'no page errors' + (errors.length ? ': ' + errors.join(' | ') : ''));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
