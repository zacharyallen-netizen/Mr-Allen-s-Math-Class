const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const BASE = 'file:///home/claude/mr-allen-s-math-class/math1/';
async function gridPt(p, host, view, x, y) {
  // map data coords to client coords using the svg's own CTM (plane: W=300, pad 9)
  return p.evaluate(({ host, view, x, y }) => {
    const svg = document.querySelector(host + ' svg');
    const [xmin, xmax, ymin, ymax] = view; const u = (300 - 18) / (xmax - xmin);
    const pt = svg.createSVGPoint(); pt.x = 9 + (x - xmin) * u; pt.y = 9 + (ymax - y) * u;
    const q = pt.matrixTransform(svg.getScreenCTM()); return [q.x, q.y];
  }, { host, view, x, y });
}
(async () => {
  const b = await chromium.launch(); let fails = 0;
  const ok = (c, m) => { if (!c) { fails++; console.log('  FAIL', m); } else console.log('  ok', m); };
  for (const touch of [false, true]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: touch, isMobile: touch });
    const p = await ctx.newPage(); await p.addInitScript(() => sessionStorage.setItem('m1ok', '1'));
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    console.log(touch ? 'TOUCH' : 'MOUSE');
    // --- unit7 practice: vertex task
    await p.goto(BASE + 'unit7-practice.html');
    await p.locator('#e0 svg').scrollIntoViewIfNeeded();
    const move = async (host, view, from, to) => {
      const [x1, y1] = await gridPt(p, host, view, ...from), [x2, y2] = await gridPt(p, host, view, ...to);
      if (touch) await p.touchscreen.tap(x2, y2);
      else { await p.mouse.move(x1, y1); await p.mouse.down(); await p.mouse.move((x1 + x2) / 2, (y1 + y2) / 2, { steps: 4 }); await p.mouse.move(x2, y2, { steps: 4 }); await p.mouse.up(); }
    };
    // wrong first: put vertex at (2,4) with a=1
    await move('#e0', [-6, 6, -6, 6], [0, 0], [2, 4]);
    let ro = await p.textContent('#e0 .readout');
    ok(/\(2, 4\)/.test(ro), 'vertex moved to (2,4): ' + ro.slice(0, 60));
    await p.click('#e0 .w-check');
    let fb = await p.textContent('#e0 .chk-fb');
    ok(/sign flips/.test(fb), 'sign-flip feedback: ' + fb.slice(0, 70));
    await move('#e0', [-6, 6, -6, 6], [2, 4], [-2, 4]);
    await p.click('#e0 .w-check'); fb = await p.textContent('#e0 .chk-fb');
    ok(/opens the wrong way/.test(fb), 'direction feedback: ' + fb.slice(0, 60));
    await p.evaluate(() => { const r = document.querySelector('#e0 input[type=range]'); r.value = -1; r.dispatchEvent(new Event('input', { bubbles: true })); });
    await p.click('#e0 .w-check'); fb = await p.textContent('#e0 .chk-fb');
    ok(/Correct/.test(fb), 'task solved: ' + fb.slice(0, 40));
    ok(await p.evaluate(() => document.querySelector('#e0-card .after').classList.contains('show')), 'after shown for task');
    ok(/Score: 1 \/ 1/.test(await p.textContent('#score')), 'score 1/1 after task: ' + await p.textContent('#score'));
    // real typed flow: one wrong then right
    await p.fill('#a2 input', '(5,2)'); await p.press('#a2 input', 'Enter');
    ok(/switched/.test(await p.textContent('#a2 .chk-fb')), 'Enter key check + swapped feedback');
    await p.fill('#a2 input', '( 2 , 5 )'); await p.click('#a2 .val-chk button');
    ok(/Score: 2 \/ 2/.test(await p.textContent('#score')), 'score 2/2: ' + await p.textContent('#score'));
    // solution button shows after
    await p.click('#a3 .sol-btn');
    ok(await p.evaluate(() => document.querySelector('#a3 .after').classList.contains('show') && document.querySelector('#a3 .sa-ans').classList.contains('show')), 'solution reveals answer diagram');
    // a-slider
    await p.evaluate(() => { const r = document.querySelector('#f6 input[type=range]'); r.value = 0.5; r.dispatchEvent(new Event('input', { bubbles: true })); });
    ok(/wider/.test(await p.textContent('#f6 .readout')), 'a-slider readout wider');
    // --- unit7 notes: abc sliders and vertex drag + example reveal
    await p.goto(BASE + 'unit7-notes.html');
    await p.evaluate(() => { const r = document.querySelector('[data-w=abc] input[data-k=a]'); r.value = 0; r.dispatchEvent(new Event('input', { bubbles: true })); });
    ok(/straight line/.test(await p.textContent('[data-w=abc] .readout')), 'a = 0 warning');
    await p.evaluate(() => { const r = document.querySelector('[data-w=abc] input[data-k=a]'); r.value = -1; r.dispatchEvent(new Event('input', { bubbles: true })); });
    ok(/maximum/.test(await p.textContent('[data-w=abc] .readout')), 'a<0 maximum');
    await p.locator('[data-w=vtx] svg').scrollIntoViewIfNeeded();
    await p.evaluate(() => document.querySelector('[data-w=vtx]').id = 'vt');
    await move('#vt', [-6, 6, -6, 6], [1, -4], [-3, 2]);
    ro = await p.textContent('#vt .readout');
    ok(/\(x \+ 3\)² \+ 2/.test(ro) && /x² \+ 6x \+ 11/.test(ro), 'vertex form + standard form live: ' + ro.slice(0, 80));
    await p.click('[data-example=e71] .step >> nth=4');
    ok(await p.evaluate(() => document.querySelector('[data-example=e71]').closest('.example').querySelector('.after').classList.contains('show')), 'final step shows worked diagram');
    await p.click('text=Reveal all answers');
    ok(await p.evaluate(() => [...document.querySelectorAll('.after')].every(a => a.classList.contains('show'))), 'reveal-all shows every answer diagram');
    // --- unit8 notes: drag points
    await p.goto(BASE + 'unit8-notes.html');
    await p.evaluate(() => { const w = document.querySelectorAll('[data-w=seg]'); w[0].id = 'sm'; w[1].id = 'sd'; });
    await p.locator('#sm svg').scrollIntoViewIfNeeded();
    await move('#sm', [-6, 6, -5, 5], [4, 2], [2, 4]);
    ro = await p.textContent('#sm .readout'); ok(/\(−1, 1\)/.test(ro), 'midpoint live (−1,1): ' + ro.slice(-20));
    await p.locator('#sd svg').scrollIntoViewIfNeeded();
    await move('#sd', [-6, 6, -5, 5], [3, 2], [0, 2]);
    ro = await p.textContent('#sd .readout'); ok(/= 5/.test(ro), 'distance live 5: ' + ro);
    await p.evaluate(() => { const r = document.querySelector('[data-w=slope] input'); r.value = 7; r.dispatchEvent(new Event('input', { bubbles: true })); });
    ro = await p.textContent('[data-w=slope] .readout'); ok(/−1 ✓/.test(ro), 'slope slider readout');
    // --- unit8 practice: parallelogram task
    await p.goto(BASE + 'unit8-practice.html');
    await p.locator('#f0 svg').scrollIntoViewIfNeeded();
    await move('#f0', [-5, 6, -3, 5], [-3, 2], [0, 3]);
    await p.click('#f0 .w-check'); fb = await p.textContent('#f0 .chk-fb');
    ok(/Not yet/.test(fb), 'wrong D flagged: ' + fb.slice(0, 80));
    await move('#f0', [-5, 6, -3, 5], [0, 3], [-1, 3]);
    await p.click('#f0 .w-check'); fb = await p.textContent('#f0 .chk-fb');
    ok(/Correct/.test(fb), 'parallelogram solved');
    ok(errs.length === 0, 'no page errors ' + errs.join(';'));
    await ctx.close();
  }
  console.log('fails', fails); await b.close();
})();
