// Functional + layout test for the NC Math 1 pre-tests.
// node test_m1.js [unitNumbers]   (server: http://127.0.0.1:8794 = repo root)
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs = require('fs');
const OUT = __dirname;
const BASE = 'http://127.0.0.1:8794/math1/';
const IGN = /fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext|net::ERR/;
const UNITS = (process.argv[2] || '1,2,3,4,5,6,7,8').split(',').map(Number);

// extra accepted variants (ok) and answers that must be rejected (bad), per unit / item
const X = {
 1: {3: {ok: ['x^7', 'x⁷', 'X^7'], bad: ['x^12', 'x^3*x^4', 'x^7+0', '7x']},
     5: {ok: ['x>6', '6<x', 'x > 6', '(6, ∞)'], bad: ['x<6', 'x>14', 'x>=6']},
     8: {ok: ['x<=-3', 'x≤−3', '-3>=x', 'x =< -3', '(-∞, -3]'], bad: ['x>=-3', 'x<=3', 'x<-3']},
     9: {ok: ['(P-2w)/2', 'l = (P − 2w)/2', 'P/2 - w', 'l=P/2-w', '(p - 2w) / 2'], bad: ['P-2w', 'P/2-2w', '(P+2w)/2']},
     10: {ok: ['distributive property', 'Distributive Property', 'the distributive property', 'distribute'], bad: ['commutative', 'associative property']},
     12: {ok: ['4x^6', '4x⁶', '4*x^6'], bad: ['2x^6', '4x^5', '(2x^3)^2', '4x^9']},
     15: {ok: ['(y-b)/m', 'x = (y − b)/m', 'y/m - b/m', '(y-b)÷m'], bad: ['(y+b)/m', 'y-b/m', 'm(y-b)']},
     17: {ok: ['x^(1/3)', 'x^⅓', 'x^(1÷3)'], bad: ['x^3', 'cbrt(x)', 'x^(1/2)', '3x']},
     18: {ok: ['infinitely many', 'Infinitely many solutions', 'all real numbers', 'infinite'], bad: ['no solution', '1', 'one']}},
 2: {1: {ok: ['no', 'No'], bad: ['yes']},
     3: {ok: ['1', '(0, 1)', '(0,1)', 'y = 1'], bad: ['2', '(1, 0)']},
     6: {ok: ['y=3x-2', '3x-2', '-2+3x', 'y = 3x − 2'], bad: ['3x+2', '-2x+3', 'y=3x']},
     7: {ok: ['-3<=x<=4', '−3 ≤ x ≤ 4', '[-3, 4]', '4>=x>=-3'], bad: ['-3<x<4', '-1<=x<=6', '-3<=x<4']},
     8: {ok: ['-1<y<=2', '−1 < y ≤ 2', '2>=y>-1', '(-1, 2]'], bad: ['-1<=y<=2', '-4<=y<=2', '-1<y<2']},
     10: {ok: ['6', '(6, 0)', 'x = 6'], bad: ['4', '(0, 4)']},
     12: {ok: ['y=2x+3', '2x + 3'], bad: ['2x+5', '3x+2']},
     13: {ok: ['600-25t', 'V(t) = 600 − 25t', '-25t+600'], bad: ['25t-600', '600-25', '600t-25']},
     14: {ok: ['0<=t<=24', '0 ≤ t ≤ 24', '[0, 24]'], bad: ['0<=t<=600', '0<t<24', 't>=0']},
     16: {ok: ['x<3', '3>x', 'x < 3'], bad: ['x>3', 'x<6', 'x<=3']},
     17: {ok: ['up 5', 'shifts up 5 units', 'it moves up five', 'Up 5'], bad: ['down 5', 'up 2', 'left 5', 'up']},
     18: {ok: ['11/4', '2.75'], bad: ['2.5', '11']}},
 3: {1: {ok: ['yes', 'Yes'], bad: ['no']}, 4: {ok: ['no', 'NO'], bad: ['yes']}, 14: {ok: ['no'], bad: ['yes']},
     2: {ok: ['(1, 3)', '1,3', 'x=1, y=3'], bad: ['(3, 1)']},
     9: {ok: ['no solution', 'none', 'No solution'], bad: ['one', 'infinitely many', '1']},
     11: {ok: ['y<=-x+4', 'y ≤ −x + 4', 'x+y<=4', '-x+4>=y', 'y<=4-x'], bad: ['y>=-x+4', 'y<-x+4', 'y<=x+4', 'y<=-x+3']},
     12: {ok: ['7x=21', '7x = 21', '21 = 7x'], bad: ['7x=14', 'x=3', '5x=21']},
     13: {ok: ['infinitely many', 'infinite', 'infinitely many solutions'], bad: ['no solution', 'one']}},
 4: {4: {ok: ['1/3', '0.333', '⅓'], bad: ['3', '1/9']},
     5: {ok: ['exponential', 'Exponential'], bad: ['linear']},
     10: {ok: ['200(2)^t', '200*2^t', 'P(t)=200·2^t', '200 · 2ᵗ'.replace('ᵗ', '^t')], bad: ['200^t', '2(200)^t', '200(2t)', '400^t']},
     12: {ok: ['g', 'g(x)', 'G'], bad: ['f', 'f(x)']},
     13: {ok: ['an=4n+3', 'a_n = 7+4(n-1)', 'aₙ = 4n + 3', '4n+3'], bad: ['4n+7', '7n+4', '3n+4']},
     14: {ok: ['2(3)^(n-1)', '2*3^(n-1)', 'aₙ=2(3)^(n−1)'], bad: ['2(3)^n', '3(2)^(n-1)', '2*3n-1']},
     15: {ok: ['20000(0.88)^t', '20,000(0.88)^t', 'V(t) = 20000·0.88^t'], bad: ['20000(0.12)^t', '20000(1.12)^t', '20000-0.12t']},
     17: {ok: ['linear', 'Linear'], bad: ['exponential']}},
 5: {6: {ok: ['positive', 'Positive association'], bad: ['negative', 'none']},
     8: {ok: ['yes', 'Yes'], bad: ['no']}, 9: {ok: ['median', 'the median'], bad: ['mean', 'the mean']},
     15: {ok: ['no', 'No, it does not'], bad: ['yes']}, 16: {ok: ['B', 'class B'], bad: ['A']}, 17: {ok: ['B', 'b'], bad: ['A']},
     18: {ok: ['strong', 'Strong positive'], bad: ['weak', 'weak positive']}},
 6: {1: {ok: ['3x+12', '12+3x', '3x + 12'], bad: ['3(x+4)', '3x+4', '3x+7']},
     2: {ok: ['3x^2-2x+3', '3x²−2x+3'], bad: ['3x^2+8x+3', '3x^2-2x-5']},
     3: {ok: ['3(2x+5)', '(2x+5)3', '3*(2x+5)', '3(5+2x)'], bad: ['6x+15', '1.5(4x+10)', '3(2x+15)', 'x(6+15/x)']},
     4: {ok: ['7,-7', '±7', 'x=7 or x=-7', '-7, 7', 'x = ±7'], bad: ['7', '49', '7,7']},
     5: {ok: ['3,-5', 'x=3, x=-5', '-5 and 3'], bad: ['-3,5', '3']},
     7: {ok: ['(x+3)(x+4)', '(x+4)(x+3)'], bad: ['x^2+7x+12', '(x+3)(x-4)', '(x+2)(x+6)']},
     8: {ok: ['(x-6)(x+3)', '(x+3)(x−6)'], bad: ['(x+6)(x-3)', 'x^2-3x-18']},
     9: {ok: ['(x+7)(x-7)', '(x-7)(x+7)'], bad: ['(x-7)^2', 'x^2-49', '(x+7)^2']},
     12: {ok: ['2x^2-5x-3'], bad: ['(2x+1)(x-3)', '2x^2-7x-3']},
     13: {ok: ['(2x-1)(x+3)', '(x+3)(2x-1)'], bad: ['(2x+1)(x-3)', '2x^2+5x-3', '(2x+3)(x-1)']},
     14: {ok: ['2,-8', 'x=2 or x=-8'], bad: ['2', '-2,8']},
     15: {ok: ['-2+sqrt(5), -2-sqrt(5)', '-2±sqrt(5)', '−2 ± √5', '0.24, -4.24', 'x=-2+√5, x=-2-√5'], bad: ['-2+sqrt(3), -2-sqrt(3)', '0.24', '2±sqrt(5)']},
     17: {ok: ['x^2-3x-10', 'y=x²−3x−10'], bad: ['(x+2)(x-5)', 'x^2+3x-10']}},
 7: {1: {ok: ['down', 'Down', 'opens down'], bad: ['up']}, 6: {ok: ['minimum', 'min', 'Minimum'], bad: ['maximum']},
     3: {ok: ['x=-1', '-1', 'x = −1'], bad: ['x=1', '-4']},
     9: {ok: ['y<=6', 'y≤6', '6>=y', '(-∞, 6]'], bad: ['y>=6', 'y<=1', 'y<6']},
     10: {ok: ['g', 'g(x)'], bad: ['f']}, 16: {ok: ['g', 'G'], bad: ['f']},
     11: {ok: ['(x-2)^2-3', 'y=(x−2)²−3'], bad: ['x^2-4x+1', '(x+2)^2-3', '(x-2)^2+3']},
     12: {ok: ['x^2+2x-2'], bad: ['x^2+2x+4', '(x^2-3)+(2x+1)']},
     18: {ok: ['x<1', 'x<=1', '(-∞, 1)', '1>x'], bad: ['x>1', 'x<-1']}},
 8: {5: {ok: ['-3/2', '−1.5'], bad: ['3/2', '-2/3']}, 18: {ok: ['4/3', '1.33'], bad: ['-3/4', '3/4']},
     10: {ok: ['y=2x-2', '2x-2', 'y = 2x − 2'], bad: ['2x+2', '2x+1']}, 11: {ok: ['y=2x+1', '2x+1'], bad: ['-0.5x+6', '2x+5']},
     14: {ok: ['isosceles', 'Isosceles triangle'], bad: ['scalene', 'equilateral']},
     15: {ok: ['yes'], bad: ['no']}, 16: {ok: ['parallel', 'Parallel'], bad: ['perpendicular', 'neither']}},
};

function numForms(v) {
  const s = String(+v.toFixed(10));
  const out = [s, ' ' + s + ' '];
  if (v < 0) out.push('−' + String(Math.abs(+v.toFixed(10))));
  return out;
}
function auto(q) {
  const c = q.chk, t = c[0], ok = [], bad = [];
  if (t === 'n') { ok.push(...numForms(c[1])); bad.push(String(c[1] + 1), String(c[1] === 0 ? 5 : c[1] * 10)); if (c[1] !== 0) bad.push(String(-c[1])); }
  else if (t === 'set') {
    const v = c[1].map(x => +x.toFixed(10));
    if (v.every(x => Number.isInteger(x))) { ok.push(v.join(', '), v.slice().reverse().join(' or '), v.map(x => 'x = ' + x).join(', ')); bad.push(String(v[0])); bad.push(v.map(x => x + 1).join(', ')); }
  }
  else if (t === 'pt') { ok.push('(' + c[1] + ', ' + c[2] + ')', c[1] + ',' + c[2], ('(' + c[1] + ', ' + c[2] + ')').replace(/-/g, '−'), 'x = ' + c[1] + ', y = ' + c[2]);
    if (c[1] !== c[2]) bad.push('(' + c[2] + ', ' + c[1] + ')'); bad.push('(' + (c[1] + 1) + ', ' + c[2] + ')'); }
  else if (t === 'expr') { ok.push(c[1], c[1].replace(/\*(?=[a-z(])/g, ''), c[1].replace(/\*/g, ' · ')); bad.push(c[1] + '+1', '(' + c[1] + ')*2'); }
  else if (t === 'ineq') { const fl = {'<': '>', '>': '<', '<=': '>=', '>=': '<='}; ok.push(c[1] + c[2] + c[3], c[3] + fl[c[2]] + c[1], (c[1] + ' ' + c[2] + ' ' + c[3]).replace('<=', '≤').replace('>=', '≥'));
    bad.push(c[1] + fl[c[2]] + c[3], c[1] + c[2] + (c[3] + 2)); }
  else if (t === 'ineq2') { const L = c[3] ? '<=' : '<', H = c[5] ? '<=' : '<'; ok.push(c[2] + L + c[1] + H + c[4]); bad.push(c[2] + (c[3] ? '<' : '<=') + c[1] + H + c[4], (c[2] - 1) + L + c[1] + H + c[4]); }
  else if (t === 'text') { ok.push(c[1][0], c[1][0].toUpperCase()); }
  else if (t === 'words') { ok.push(c[1].map(g => g[0]).join(' ')); }
  else if (t === 'eqn') { ok.push(...c[1]); }
  else if (t === 'any') { for (const k of c.slice(1)) { const a = auto({chk: k}); ok.push(...a.ok); } bad.push('999'); }
  else if (t === 'lineineq') { }
  return {ok, bad};
}

async function open(b, n, w) {
  const page = await b.newPage({ viewport: { width: w, height: 900 } });
  const errs = [], captured = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !IGN.test(m.text())) errs.push('console: ' + m.text()); });
  await page.route('**/script.google.com/**', async route => {
    captured.push(route.request().postData());
    await route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ ok: true, name: 'Test Student', n: 1, right: 1 }) });
  });
  await page.addInitScript(() => sessionStorage.setItem('m1ok', '1'));
  await page.goto(BASE + 'M1_Unit' + n + '_PreTest.html', { waitUntil: 'load' });
  await page.waitForTimeout(300);
  return { page, errs, captured };
}

(async () => {
  fs.mkdirSync(OUT + '/payloads', { recursive: true }); fs.mkdirSync(OUT + '/shots', { recursive: true });
  const b = await chromium.launch();
  const report = {}; let fails = 0;
  for (const n of UNITS) {
    const r = { checks: 0 }; const problems = [];
    const { page, errs, captured } = await open(b, n, 1280);
    if (!page.url().includes('M1_Unit' + n)) problems.push('gate redirected: ' + page.url());
    const QS = await page.evaluate(() => QS);
    if (QS.length !== 18) problems.push('expected 18 items, got ' + QS.length);
    // ---- answer checker: keys, typed variants, wrong answers
    for (const q of QS) {
      const a = auto(q), x = (X[n] || {})[q.id] || {};
      const ok = [...a.ok, ...(x.ok || [])], bad = [...a.bad, ...(x.bad || [])];
      if (!ok.length) problems.push('Q' + q.id + ' has no accepted variants to test');
      for (const v of ok) { r.checks++; if (!(await page.evaluate(([c, s]) => runCheck(c, s), [q.chk, v]))) problems.push('Q' + q.id + ' REJECTED right answer: ' + JSON.stringify(v)); }
      for (const v of bad) { r.checks++; if (await page.evaluate(([c, s]) => runCheck(c, s), [q.chk, v])) problems.push('Q' + q.id + ' ACCEPTED wrong answer: ' + JSON.stringify(v)); }
      if (!bad.length) problems.push('Q' + q.id + ' has no wrong answers to test');
    }
    // ---- UI: all right -> 18/18 and bands 6/6
    const right = q => { const a = auto(q), x = (X[n] || {})[q.id] || {}; return (x.ok && x.ok[0]) || a.ok[0]; };
    for (const q of QS) await page.fill('#i' + q.id, right(q));
    await page.click('#check');
    r.allRight = (await page.textContent('#scorebox')).replace(/\s+/g, ' ').trim();
    if (!/18 \/ 18 correct/.test(r.allRight) || !/3\.0 Basic 6\/6 · 4\.0 Target 6\/6 · 5\.0 Advanced 6\/6/.test(r.allRight)) problems.push('all-right score wrong: ' + r.allRight);
    // ---- reset clears
    await page.click('#reset');
    const cleared = await page.evaluate(() => [...document.querySelectorAll('.ans input')].every(i => i.value === '') && !document.querySelector('.q.correct,.q.wrong') && ScoreSend.count().n === 0);
    if (!cleared) problems.push('reset did not clear');
    // ---- mixed: q1 wrong, q2 right, first target right, first advanced wrong, q3 blank
    const qT = QS.find(q => q.lvl === 'target'), qA = QS.find(q => q.lvl === 'advanced'), qL = QS[17];
    const wrong = q => { const a = auto(q), x = (X[n] || {})[q.id] || {}; return (x.bad && x.bad[0]) || a.bad[0]; };
    await page.fill('#i1', wrong(QS[0])); await page.fill('#i2', right(QS[1]));
    await page.fill('#i' + qT.id, right(qT)); await page.fill('#i' + qA.id, wrong(qA));
    await page.click('#check');
    r.mixed = (await page.textContent('#scorebox')).replace(/\s+/g, ' ').trim();
    if (!/3 \/ 18 correct/.test(r.mixed) && !/2 \/ 18 correct/.test(r.mixed)) problems.push('mixed score unexpected: ' + r.mixed);
    if (!/3\.0 Basic 1\/6 · 4\.0 Target 1\/6 · 5\.0 Advanced 0\/6/.test(r.mixed)) problems.push('mixed bands wrong: ' + r.mixed);
    const fb1 = await page.innerHTML('#fb1');
    if (!/✗ answer:/.test(fb1) || !/Tip:/.test(fb1)) problems.push('wrong feedback/tip missing: ' + fb1);
    if (!/correct/.test(await page.textContent('#fb2'))) problems.push('right feedback missing');
    // fix q1 and advanced, add last, Enter checks
    await page.fill('#i1', right(QS[0])); await page.fill('#i' + qA.id, right(qA)); await page.fill('#i' + qL.id, right(qL));
    await page.press('#i' + qL.id, 'Enter');
    // ---- send panel
    r.panel = await page.$('#scoresend') ? 'yes' : 'NO PANEL';
    await page.fill('#ssname', 'Test Student'); await page.click('#ssbtn'); await page.waitForTimeout(500);
    r.msg = (await page.textContent('#ssmsg')).trim();
    const body = captured[captured.length - 1];
    fs.writeFileSync(OUT + '/payloads/M1_Unit' + n + '.json', body || '{}');
    const d = JSON.parse(body || '{}');
    r.payload = { kind: d.kind, unit: d.unit, page: d.page, n: (d.items || []).length, revealed: d.revealed };
    if (d.kind !== 'pretest' || d.unit !== 'M1 U' + n || d.page !== 'Math 1 Unit ' + n + ' Pre-Test') problems.push('payload header wrong ' + JSON.stringify(r.payload));
    const want = [['q1', 0, 1], ['q2', 1, 1], ['q' + qT.id, 1, 1], ['q' + qA.id, 0, 1], ['q' + qL.id, 1, 1]];
    for (const [id, f, F] of want) { const it = (d.items || []).find(i => i.id === id); if (!it || it.first !== f || it.final !== F) problems.push('payload item ' + id + ' ' + JSON.stringify(it)); }
    if ((d.items || []).length !== 5) problems.push('expected 5 payload items, got ' + (d.items || []).length);
    for (const it of d.items || []) {
      const q = QS.find(q => 'q' + q.id === it.id);
      const want = await page.evaluate(id => PT_STD[id], q.id);
      const band = {basic: 3, target: 4, advanced: 5}[q.lvl];
      if (it.std !== want || it.band !== band) problems.push('payload std/band wrong for ' + it.id + ': ' + it.std + '/' + it.band);
    }
    r.labels = (d.items || []).slice(0, 2).map(i => i.label);
    // ---- reveal shows every key, flags revealed in the next send
    await page.click('#reset'); await page.click('#reveal');
    const shown = await page.evaluate(() => [...document.querySelectorAll('.qfb')].filter(f => /answer:/.test(f.textContent)).length);
    if (shown !== 18) problems.push('reveal showed ' + shown + ' answers');
    await page.fill('#i1', right(QS[0])); await page.click('#check'); await page.click('#ssbtn'); await page.waitForTimeout(400);
    const d2 = JSON.parse(captured[captured.length - 1]);
    if (!(d2.revealed === true && d2.items.length === 1 && d2.session !== d.session)) problems.push('reveal/reset payload wrong');
    fs.writeFileSync(OUT + '/payloads/M1_Unit' + n + '_revealed.json', captured[captured.length - 1]);
    r.errs = errs.slice(); await page.close();
    // ---- layout at both widths: no h-scroll, SVG labels inside their boxes, screenshot
    for (const w of [390, 1280]) {
      const o = await open(b, n, w);
      const lay = await o.page.evaluate(() => {
        const res = { hscroll: document.documentElement.scrollWidth > innerWidth + 1, outside: [], svgs: 0, overflowSvg: [] };
        document.querySelectorAll('.dia svg').forEach((s, si) => {
          res.svgs++;
          const vb = s.viewBox.baseVal;
          const sr = s.getBoundingClientRect(), k = sr.width / vb.width;   // screen px per user unit
          s.querySelectorAll('text').forEach(t => {
            const bb = t.getBoundingClientRect();   // includes rotate() transforms
            if (bb.left < sr.left - 0.6 * k || bb.top < sr.top - 0.6 * k || bb.right > sr.right + 0.6 * k || bb.bottom > sr.bottom + 0.6 * k)
              res.outside.push((s.closest('.q') || {}).id + ': "' + t.textContent + '" ' + [bb.left - sr.left, bb.top - sr.top, bb.right - sr.right, bb.bottom - sr.bottom].map(v => v.toFixed(1)).join(','));
          });
          const r = s.getBoundingClientRect(), qr = s.closest('.q').getBoundingClientRect();
          if (r.right > qr.right + 1 || r.left < qr.left - 1) res.overflowSvg.push(s.closest('.q').id);
        });
        const ss = document.getElementById('scoresend');
        res.panelLast = (() => { let x = document.querySelector('.sheet').nextElementSibling; while (x && (x.tagName === 'SCRIPT' || x.tagName === 'STYLE')) x = x.nextElementSibling; return x === ss; })();
        res.backLink = (document.querySelector('.sb-local a') || {}).getAttribute ? document.querySelector('.sb-local a').getAttribute('href') + ' ' + document.querySelector('.sb-local a').textContent : 'none';
        res.siteBar = !!document.querySelector('script[src="../site-bar.js"]');
        return res;
      });
      r['w' + w] = { hscroll: lay.hscroll, svgs: lay.svgs, outside: lay.outside.length, overflowSvg: lay.overflowSvg, panelLast: lay.panelLast, back: lay.backLink };
      if (lay.hscroll) problems.push('horizontal scroll at ' + w);
      if (lay.outside.length) problems.push('SVG labels outside box at ' + w + ': ' + lay.outside.slice(0, 6).join(' | '));
      if (lay.overflowSvg.length) problems.push('SVG wider than item at ' + w + ': ' + lay.overflowSvg.join(','));
      if (!lay.panelLast) problems.push('send panel not right after the sheet');
      if (!/^unit\d\.html ← Unit \d$/.test(lay.backLink) || lay.backLink.indexOf('unit' + n + '.html') !== 0) problems.push('back link wrong: ' + lay.backLink);
      await o.page.screenshot({ path: OUT + '/shots/full_u' + n + '_' + w + '.png', fullPage: true });
      await o.page.emulateMedia({ media: 'print' });
      const hid = await o.page.evaluate(() => ['#scoresend', '.controls', '.sb-local'].map(s => { const e = document.querySelector(s); return e ? getComputedStyle(e).display : 'missing'; }));
      if (hid.some(x => x !== 'none')) problems.push('not hidden in print: ' + hid.join(','));
      if (o.errs.length) problems.push(...o.errs);
      await o.page.close();
    }
    r.problems = problems; if (problems.length) fails++;
    report['U' + n] = r;
    console.log('U' + n + ': ' + r.checks + ' checker cases, ' + (problems.length ? problems.length + ' PROBLEM(S)' : 'all OK'));
    for (const p of problems) console.log('   - ' + p);
  }
  await b.close();
  fs.writeFileSync(OUT + '/test_report.json', JSON.stringify(report, null, 1));
  console.log(fails ? fails + ' unit(s) with problems' : 'ALL UNITS PASS');
  process.exitCode = fails ? 1 : 0;
})();
