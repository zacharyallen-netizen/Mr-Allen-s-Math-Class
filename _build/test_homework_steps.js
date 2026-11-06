/* Checks grade8/homework-steps.js with the real engine (grade8/step-work.js):
   every "start" equation solves to the expected answer, every "setup" value matches the equation a student
   should write (from the homework PDF), and every "then" value is right.
   Run from the repo root with a local server:  python3 -m http.server 8766 --bind 127.0.0.1 &
   node _build/test_homework_steps.js                                                                    */
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8766/';
// expected solutions, worked by hand from the PDFs (MC choices agree where the PDF has them)
const WANT = {
  '3.1': { 1: '17', 2: '9', 3: '8', 5: '12', 7: '16', 9: '7', 10: '3' },
  '3.2': { 1: '7', 2: '20', 3: '-2', 7: '16', 9: '7/2', 10: '15' },
  '3.3': { 1: '7', 2: '5', 5: '6', 7: '4', 9: '4' },
  '3.4': { 1: '5', 2: '4', 5: '-12', 7: '22/3', 9: '6', 10: '9/2' },
  '3.5': { 1: '15', 2: '13', 5: '5', 7: '10', 8: '10', 9: '40', 10: '9' },
  '3.6': { 1: '3', 2: '2', 3: '10/3', 5: '6', 7: '12', 9: '5' },
  '3.7': { 2: '8', 4: '<7', 5: '6', 6: '≤-3', 7: 'none', 10: '≤5' },
  '3.8': { 1: 'all', 2: 'none', 4: '≥-2', 5: '3', 6: '<-3', 7: 'all', 10: '≥8' },
  '3.9': { 3: 'none', 5: '9', 9: '8' },
  '3.10': { 1: '6', 2: '15', 3: 'none', 4: '4', 5: '≥-2', 8: 'all', 10: '6' }
};
// the equation a student should write for each "setup" problem (from the PDF), with its letter
const SETUP = {
  '3.2': { 5: ['3n − 5 = 16', 'n'] }, '3.9': { 2: ['9t + 6 = 42', 't'], 4: ['5n − 4 = 31', 'n'], 6: ['25 + 0.10m = 10 + 0.15m', 'm'], 8: ['33 + 6q ≥ 75', 'q'] },
  '3.10': { 7: ['15 + 6w ≥ 69', 'w'] },
  '4.1': { 1: ['x + 73 = 180'], 2: ['x + 41 = 90'], 6: ['4x + 2x + 30 = 180'], 8: ['x + x + 18 = 90'], 10: ['4x + x = 180'] },
  '4.2': { 1: ['x + 95 + 60 + 130 = 360'], 2: ['54 + x + 41 = 180'], 6: ['x + 2x + x + 40 = 180'], 8: ['3x + x + 10 = 90'], 10: ['x + 2x + 3x + 4x = 360'] },
  '4.3': { 3: ['x + 128 = 180'], 4: ['x + 63 = 180'], 6: ['4x − 6 + 74 = 180'], 8: ['x + 2x + 60 = 180'] },
  '4.4': { 3: ['x + 101 = 180'], 4: ['129 + x = 180'], 6: ['6x − 14 = 4x + 12'], 8: ['5x − 15 = 110'], 10: ['x + 15 + 3x + 5 = 180'] },
  '4.5': { 1: ['x + 67 + 41 = 180'], 2: ['x = 48 + 77'], 3: ['65 + x = 140'], 6: ['3x + 5 + 2x + x + 25 = 180'], 8: ['4x + 2 + x + 3 = 90'] },
  '4.6': { 1: ['66 + x = 180'], 3: ['x + 28 + 90 = 180'], 6: ['4x + 12 = 6x − 8'], 7: ['4x + 10 = 2x + 34'] }
};
const THEN = { '3.4': { 9: ['8', '11'] }, '3.9': { 9: ['17'] }, '4.1': { 6: ['100', '80'], 8: ['54'], 10: ['144'] }, '4.2': { 6: ['70', '75'], 8: ['60'], 10: ['72', '108', '144'] },
  '4.3': { 6: ['106'] }, '4.4': { 6: ['64'], 10: ['55', '125'] }, '4.5': { 6: ['80', '50', '50'] }, '4.6': { 6: ['52'], 7: ['58'] } };

(async () => {
  const br = await chromium.launch(); const pg = await br.newPage();
  await pg.goto(BASE + 'grade8/units3-4.html');
  await pg.addScriptTag({ url: BASE + 'grade8/homework-steps.js' });
  await pg.addScriptTag({ url: BASE + 'grade8/step-work.js' });
  const bad = await pg.evaluate(([WANT, SETUP, THEN]) => {
    const T = StepWork._t, M = window.HW_STEPS, out = []; let n = 0;
    const res = (eq, v) => { const r = T.solve(T.parseEq(eq), v); return r.kind === 'one' ? T.qtxt(r.x) : r.kind === 'ineq' ? r.rel + T.qtxt(r.x) : r.kind; };
    Object.keys(M).forEach(id => Object.keys(M[id]).forEach(p => {
      const c = M[id][p], v = c.v || 'x'; n++;
      try {
        let x;
        if (c.start) { const g = res(c.start, v); const w = (WANT[id] || {})[p]; if (g !== w) out.push(`${id} #${p} start ${c.start}: got ${g}, want ${w}`); x = g; }
        if (c.setup != null) {
          const s = (SETUP[id] || {})[p]; if (!s) { out.push(`${id} #${p}: no setup equation in test`); return; }
          const g = res(s[0], s[1] || 'x'), want = (c.ineq ? '' : '') + String(c.setup);
          const val = g.replace(/^[<>≤≥]/, '');
          if (val !== want) out.push(`${id} #${p} setup ${s[0]}: solves to ${g}, data says ${c.setup}`);
          if ((s[1] || 'x') !== v) out.push(`${id} #${p}: letter ${s[1]} vs ${v}`);
          x = val;
        }
        if (c.then) {
          const xs = T.Q(...(x.includes('/') ? x.split('/').map(Number) : [Number(x), 1]));
          const got = c.then.map(t => T.qtxt(T.solve(T.parseEq(`${v} = 0`), v) && (function () { const P = T.poly(T.parseEq(t.expr + ' = 0').L, v); return { n: P[0].n * xs.d * P[1].d + P[1].n * xs.n * P[0].d, d: P[0].d * P[1].d * xs.d }; })()));
          const wantT = (THEN[id] || {})[p] || [];
          got.forEach((g, i) => { const [a, b] = g.split('/').map(Number); const gv = b ? a / b : a; if (Math.abs(gv - Number(wantT[i])) > 1e-9) out.push(`${id} #${p} then ${c.then[i].label}: got ${g}, want ${wantT[i]}`); });
        }
      } catch (e) { out.push(`${id} #${p}: ERROR ${e.code || e.message}`); }
    }));
    out.unshift(`checked ${n} homework problems`);
    return out;
  }, [WANT, SETUP, THEN]);
  console.log(bad.join('\n'));
  await br.close();
  process.exit(bad.length > 1 ? 1 : 0);
})();
