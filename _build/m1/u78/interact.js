const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const IGN = /fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext|net::ERR/;
const files = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  let fails = 0;
  for (const f of files) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
    const p = await ctx.newPage();
    await p.addInitScript(() => sessionStorage.setItem('m1ok', '1'));
    const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    p.on('console', m => { if (m.type() === 'error' && !IGN.test(m.text())) errs.push(m.text()); });
    await p.goto('file:///home/claude/mr-allen-s-math-class/math1/' + f + '.html');
    const res = await p.evaluate(() => {
      const out = [];
      const M = s => String(s).replace(/-/g, '−');
      const nf = n => { const r = Math.round(n * 1e6) / 1e6; return String(r); };
      const frac = n => { for (let d = 2; d <= 12; d++) { const k = n * d; if (Math.abs(k - Math.round(k)) < 1e-9) return Math.round(k) + '/' + d; } return null; };
      const reset = (card) => { delete card.dataset.solved; delete card.dataset.miss; const i = card.querySelector('input'); i.disabled = false; i.value = ''; };
      const coef = (F) => { const c = F(0), a = (F(1) + F(-1)) / 2 - c, b = (F(1) - F(-1)) / 2; return [a, b, c]; };
      const polyS = (a, b, c, uni) => {
        const t = []; const v = uni ? 'x²' : 'x^2';
        if (a) t.push((a === 1 ? '' : a === -1 ? '-' : nf(a)) + v);
        if (b) t.push((b < 0 ? '-' : '+') + (Math.abs(b) === 1 ? '' : nf(Math.abs(b))) + 'x');
        if (c) t.push((c < 0 ? '-' : '+') + nf(Math.abs(c)));
        let s = t.join(' ').replace(/^\+/, ''); return uni ? M(s) : s;
      };
      document.querySelectorAll('.qcard').forEach(card => {
        const spec = JSON.parse(card.getAttribute('data-q')); const a = spec.a; const id = card.id;
        let right = [], wrong = [];
        if (spec.t === 'num') {
          right = [nf(a), M(nf(a))]; const fr = frac(a); if (fr) right.push(fr, M(fr));
          if (spec.sq && Math.abs(a * a - Math.round(a * a)) < 1e-9) right.push('sqrt(' + Math.round(a * a) + ')', '√' + Math.round(a * a));
          if (spec.axis) right.push('x = ' + nf(a)); else if (!spec.yint) right.push('= ' + nf(a));
          if (spec.yint) right.push('(0, ' + M(nf(a)) + ')');
          if (Math.abs(a - Math.round(a)) > 1e-9 && spec.tol) right.push(a.toFixed(2));
          wrong = [nf(a + 1)];
        } else if (spec.t === 'pt') {
          right = ['(' + nf(a[0]) + ',' + nf(a[1]) + ')', nf(a[0]) + ', ' + nf(a[1]), M('( ' + nf(a[0]) + ' , ' + nf(a[1]) + ' )')];
          const f0 = frac(a[0]), f1 = frac(a[1]); if (f0 || f1) right.push('(' + (f0 || nf(a[0])) + ', ' + (f1 || nf(a[1])) + ')');
          wrong = ['(' + nf(a[0] + 1) + ',' + nf(a[1]) + ')', '(' + nf(a[1]) + ',' + nf(a[0]) + ')'];
        } else if (spec.t === 'set') {
          const s = a.slice().sort((x, y) => x - y);
          right = [s.map(nf).join(', '), s.slice().reverse().map(nf).join(','), M('x = ' + s.map(nf).join(' and x = ')), M('x=' + s.map(nf).join(', '))];
          wrong = [[s[0] + 1].concat(s.slice(1)).map(nf).join(','), s.map(v => nf(-v)).join(',')];
        } else if (spec.t === 'expr') {
          const f = K78.parse(K78.clean(a)); const F = x => f({ x, t: x, w: x });
          const [A, B, Cc] = coef(F);
          right = [polyS(A, B, Cc), 'y = ' + polyS(A, B, Cc, true), polyS(0, 0, Cc) + ' + ' + polyS(0, B, 0) + ' + ' + polyS(A, 0, 0)];
          right = right.map(s => s.replace(/\+ -/g, '- ').replace(/^0 \+ /, ''));
          wrong = [polyS(A, B, Cc + 1)];
        } else if (spec.t === 'line') {
          const fr = frac(a.m); const ms = fr ? fr : nf(a.m);
          const bb = a.b === 0 ? '' : (a.b < 0 ? ' - ' : ' + ') + nf(Math.abs(a.b));
          right = ['y = ' + ms + 'x' + bb, M('y=' + ms + 'x' + bb), ms + 'x' + bb];
          wrong = ['y = ' + ms + 'x' + (a.b + 1 < 0 ? ' - ' : ' + ') + nf(Math.abs(a.b + 1)), 'y = ' + nf(-a.m) + 'x' + bb];
        } else if (spec.t === 'ineq') {
          right = ['y >= ' + nf(a.v), M('y ≥ ' + nf(a.v)), '[' + nf(a.v) + ', inf)', M('[' + nf(a.v) + ', ∞)'), nf(a.v) + ' <= y'];
          if (a.op === '<=') right = ['y <= ' + nf(a.v), '(-inf, ' + nf(a.v) + ']', M('y ≤ ' + nf(a.v))];
          wrong = ['y ' + (a.op === '>=' ? '<=' : '>=') + ' ' + nf(a.v), 'y > ' + nf(a.v)];
        }
        const inp = card.querySelector('input'), fb = card.querySelector('.chk-fb');
        const bad = [];
        wrong.forEach(w => { reset(card); inp.value = w; K78.check(id); if (!fb.classList.contains('x')) bad.push('WRONG accepted: ' + w); else if (/^Not yet\. Not yet/.test(fb.textContent)) bad.push('double'); });
        const wmsg = fb.textContent;
        right.forEach(r => { reset(card); inp.value = r; K78.check(id); if (!fb.classList.contains('c')) bad.push('RIGHT rejected: ' + r + ' -> ' + fb.textContent); });
        const aft = card.querySelector('.after');
        if (aft && !aft.classList.contains('show')) bad.push('after not shown');
        out.push({ id, t: spec.t, n: right.length + wrong.length, bad, wmsg: wmsg.slice(0, 90) });
      });
      document.querySelectorAll('.mc').forEach(card => {
        const btns = [...card.querySelectorAll('.chk-btn')];
        const ok = btns.filter(x => x.dataset.ok === '1'); const no = btns.filter(x => x.dataset.ok !== '1');
        const bad = [];
        if (ok.length !== 1) bad.push('correct count ' + ok.length);
        const fb = card.querySelector('.chk-fb');
        no.forEach(x => { if (!x.dataset.fb) bad.push('no feedback for ' + x.textContent); });
        if (no[0]) { no[0].click(); if (!fb.classList.contains('x')) bad.push('wrong not flagged'); }
        ok[0] && ok[0].click();
        if (!fb.classList.contains('c')) bad.push('right not accepted');
        if (!ok[0].classList.contains('correct')) bad.push('correct not highlighted');
        const aft = card.querySelector('.after'); if (aft && !aft.classList.contains('show')) bad.push('after not shown');
        out.push({ id: card.id, t: 'mc', bad, wmsg: '' });
      });
      return { out, score: (document.getElementById('score') || {}).textContent };
    });
    let n = 0;
    res.out.forEach(r => { n++; if (r.bad.length) { fails++; console.log('  FAIL', f, r.id, r.t, r.bad.join(' | ')); } });
    console.log(f, 'items tested:', n, 'score box:', res.score, errs.length ? 'ERRORS ' + errs.join('; ') : 'no errors');
    // sample wrong-answer messages
    res.out.slice(0, 50).forEach(r => { if (r.wmsg) console.log('    ', r.id, '→', r.wmsg); });
    await ctx.close();
  }
  console.log('fails', fails);
  await b.close();
})();
