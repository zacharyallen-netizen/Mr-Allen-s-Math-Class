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
  '4.3': { 3: ['x = 128'], 4: ['x + 63 = 180'], 6: ['4x − 6 = 74'], 8: ['x + 2x + 60 = 180'] },
  '4.4': { 3: ['x + 101 = 180'], 4: ['129 + x = 180'], 6: ['6x − 14 = 4x + 12'], 8: ['5x − 15 = 110'], 10: ['x + 15 + 3x + 5 = 180'] },
  '4.5': { 1: ['x + 67 + 41 = 180'], 2: ['x = 48 + 77'], 3: ['65 + x = 140'], 6: ['3x + 5 + 2x + x + 25 = 180'], 8: ['4x + 2 + x + 3 = 90'] },
  '4.6': { 1: ['66 + x = 180'], 3: ['x + 28 + 90 = 180'], 6: ['4x + 12 = 6x − 8'], 7: ['4x + 10 = 2x + 34'] },
  '5.1': { 1: ['8^2 + 15^2 = c^2', 'c'], 3: ['9 + 16 = c^2', 'c'], 6: ['6^2 + h^2 = 10^2', 'h'], 10: ['24^2 + w^2 = 25^2', 'w'] },
  '5.2': { 4: ['15^2 + 20^2 = c^2', 'c'], 5: ['6^2 + a^2 = 10^2', 'a'], 8: ['18^2 + 24^2 = d^2', 'd'], 10: ['6^2 + 8^2 = c^2', 'c'] },
  '5.3': { 1: ['5^2 + 8^2 = c^2', 'c'], 2: ['7^2 + b^2 = 12^2', 'b'], 3: ['12^2 + h^2 = 20^2', 'h'], 6: ['(√11)^2 + 5^2 = c^2', 'c'], 8: ['9^2 + 12^2 = d^2', 'd'], 9: ['3^2 + 6^2 = c^2', 'c'], 10: ['10^2 + 24^2 = d^2', 'd'] },
  '5.4': { 2: ['3^2 + 4^2 = d^2', 'd'], 3: ['5^2 + 12^2 = d^2', 'd'], 5: ['6^2 + 9^2 = c^2', 'c'], 6: ['8^2 + 5^2 = d^2', 'd'], 8: ['5^2 + 12^2 = d^2', 'd'], 9: ['6^2 + 3^2 = d^2', 'd'], 10: ['6^2 + 8^2 = d^2', 'd'] },
  '6.6': { 10: ['9 = 3(2) + b', 'b'] }, '6.8': { 9: ['1 = 2(2) + b', 'b'] },
  '9.2': { 6: ['98π = π 7^2 h', 'h'] }, '9.3': { 7: ['50π = 1/3 π 5^2 h', 'h'] }, '9.4': { 6: ['245π = π r^2 5', 'r'] },
  '5.5': { 1: ['20^2 + 21^2 = c^2', 'c'], 2: ['10^2 + b^2 = 26^2', 'b'], 4: ['3^2 + 4^2 = d^2', 'd'], 5: ['3^2 + 8^2 = c^2', 'c'], 6: ['30^2 + h^2 = 50^2', 'h'], 8: ['5^2 + b^2 = (√50)^2', 'b'], 10: ['(√13)^2 + 6^2 = d^2', 'd'] }
};
// Unit 2: the simplified answer for each expression (worked by hand from the PDFs)
const EXPR = { '2.2': { 1: '5^7', 2: '18a^7', 3: '5y^4', 4: 'x^3', 9: '8x^4y^5' }, '2.3': { 1: '5^6', 2: 'y^20', 3: '1/16', 4: '1', 5: 'x^7', 7: '4/x^6', 8: '14a^7' },
  '2.4': { 1: '9x^8y^4', 2: '12a^3', 3: '5/m^2', 4: '3x^7', 6: 'b^2/9a^4', 8: '48x^5y^5', 9: '2x^5' }, '2.5': { 1: '64', 2: 'x^10', 3: '32y^15', 4: '1/36', 5: '6ab^5', 6: '10m^4/n^3', 9: 'x^7/y^6' },
  '2.6': { 8: '4x^2' }, '2.7': { 1: '8*10^9', 2: '3*10^6', 3: '2*10^9', 4: '3*10^4', 8: '1.2*10^2' }, '2.8': { 2: '2.8*10^4', 3: '3*10^9' }, '2.9': { 1: '-10a^7', 4: '3*10^5', 6: 'x^7/y^4' } };
// Unit 6: slope-intercept answers; for point-slope setups, an equation a student could write (from the points in the PDF)
const LINE = { '6.10': { 2: 'y = -2x + 9', 3: 'y = 4x - 7', 6: 'y = -3x + 8', 9: 'y = 2x + 4' }, '6.11': { 2: 'y = -3/4x + 2', 6: 'y = 3x - 5', 9: 'y = 20x + 50' }, '6.13': { 6: 'y = 2x - 11' } };
const PSEQ = { '6.10': { 6: 'y - 5 = -3(x - 1)', 9: 'y - 10 = 2(x - 3)' }, '6.11': { 6: 'y + 2 = 3(x - 1)', 9: 'y - 130 = 20(x - 4)' } };
const THEN = { '5.1': { 10: ['62'] }, '3.4': { 9: ['8', '11'] }, '3.9': { 9: ['17'] }, '4.1': { 6: ['100', '80'], 8: ['54'], 10: ['144'] }, '4.2': { 6: ['70', '75'], 8: ['60'], 10: ['72', '108', '144'] },
  '4.3': { 6: ['74'] }, '4.4': { 6: ['64'], 10: ['55', '125'] }, '4.5': { 6: ['80', '50', '50'] }, '4.6': { 6: ['52'], 7: ['58'] } };


// Nov 10, 2026 additions (worked by hand from the PDFs; checked against the MC choices where there are some)
Object.assign(WANT, { '3.1': Object.assign(WANT['3.1'], { 6: '4' }), '3.2': Object.assign(WANT['3.2'], { 6: '15' }), '3.3': Object.assign(WANT['3.3'], { 6: '4' }),
  '3.4': Object.assign(WANT['3.4'], { 6: '5' }), '3.5': Object.assign(WANT['3.5'], { 6: '9' }), '3.6': Object.assign(WANT['3.6'], { 6: '7' }),
  '3.7': Object.assign(WANT['3.7'], { 8: 'all' }), '3.8': Object.assign(WANT['3.8'], { 8: '≤-4' }), '3.9': Object.assign(WANT['3.9'], { 7: '≤5' }),
  '3.10': Object.assign(WANT['3.10'], { 6: '-3' }),
  '6.1': { 8: '9' }, '6.3': { 6: '5' }, '6.5': { 9: '6' }, '6.8': { 10: '33' }, '6.11': { '1.0': '5', '1.1': '2' }, '6.12': { 6: '3' },
  'E.1': { 4: '7' }, 'E.3': { 1: '-20', 2: '3', 3: '-4', 4: 'all', 6: '>-4' }, 'E.4': { 4: '5' }, 'E.7': { 7: '15', 8: '12' } });
Object.assign(SETUP, { '4.1': Object.assign(SETUP['4.1'], { 4: ['x + 47 = 180'], 7: ['4x + 10 = 70'] }), '4.2': Object.assign(SETUP['4.2'], { 3: ['x + 63 = 90'], 7: ['5x − 12 = 3x + 20'] }),
  '4.3': Object.assign(SETUP['4.3'], { 7: ['2x + 15 = 115'] }), '4.4': Object.assign(SETUP['4.4'], { 7: ['3x + 10 + 2x + 20 = 180'] }),
  '4.5': Object.assign(SETUP['4.5'], { 7: ['2x + 10 = 40 + 60'] }), '4.6': Object.assign(SETUP['4.6'], { 4: ['x = 34 + 71'], 9: ['x + 55 + 70 = 180'] }),
  '5.1': Object.assign(SETUP['5.1'], { 7: ['5^2 + 12^2 = c^2', 'c'] }), '5.3': Object.assign(SETUP['5.3'], { 7: ['6^2 + b^2 = 10^2', 'b'] }),
  '5.4': Object.assign(SETUP['5.4'], { 7: ['6^2 + 4^2 = d^2', 'd'] }), '5.5': Object.assign(SETUP['5.5'], { 7: ['6^2 + 8^2 = d^2', 'd'] }),
  '9.3': Object.assign(SETUP['9.3'], { 6: ['36π = 4/3 π r^3', 'r'] }),
  'E.2': { 5: ['x + 47 + 68 = 180'] }, 'E.3': { 8: ['3x + 10 = 70'], 9: ['120 + 15w = 60 + 25w', 'w'] }, 'E.4': { 8: ['x + 2x = 120'] },
  'E.5': { 1: ['x + 128 = 180'], 3: ['8^2 + b^2 = 17^2', 'b'], 6: ['x = 8 · 15/5', 'x'], 8: ['5^2 + 7^2 = d^2', 'd'], 9: ['4x + 8 = 2x + 34'] }, 'E.6': { 7: ['(√7)^2 + 3^2 = c^2', 'c'] } });
Object.assign(EXPR, { '2.2': Object.assign(EXPR['2.2'], { 6: 'x^7' }), '2.3': Object.assign(EXPR['2.3'], { 6: 'x^12' }), '2.4': Object.assign(EXPR['2.4'], { 7: '8x^8' }),
  '2.5': Object.assign(EXPR['2.5'], { 7: '27x^6' }), '2.8': Object.assign(EXPR['2.8'], { 5: '5*10^3', 8: '3*10^10', 9: '3.65*10^7' }),
  '2.9': Object.assign(EXPR['2.9'], { 7: '1*10^10', 9: '2*10^2' }), 'E.1': { 2: '6^5', 7: '3x^6/y^5' }, 'E.2': { 3: '3*10^9', 6: '2*10^5' },
  'E.3': { 5: '4*10^4' }, 'E.5': { 7: '16x^12' }, 'E.7': { 5: '6*10^8' } });
Object.assign(LINE, { '6.10': Object.assign(LINE['6.10'], { 7: 'y = -3x + 4' }), '6.11': Object.assign(LINE['6.11'], { 7: 'y = 5/3x - 3' }) });
Object.assign(THEN, { '6.12': { 6: ['8'] }, 'E.3': { 9: ['210'] }, 'E.5': { 9: ['60'] } });

(async () => {
  const br = await chromium.launch(); const pg = await br.newPage();
  await pg.goto(BASE + 'grade8/units3-4.html');
  await pg.addScriptTag({ url: BASE + 'grade8/homework-steps.js' });
  await pg.addScriptTag({ url: BASE + 'grade8/step-work.js' });
  const bad = await pg.evaluate(([WANT, SETUP, THEN, EXPR, LINE, PSEQ]) => {
    const T = StepWork._t, M = window.HW_STEPS, out = []; let n = 0;
    const res = (eq, v) => { const r = T.solve(T.parseEq(eq), v); return r.kind === 'one' ? T.qtxt(r.x) : r.kind === 'ineq' ? r.rel + T.qtxt(r.x) : r.kind === 'sq' ? 'sq' + Math.sqrt(r.k.n / r.k.d) : r.kind === 'cube' ? 'sq' + Math.cbrt(r.k.n / r.k.d) : r.kind; };
    Object.keys(M).forEach(id => Object.keys(M[id]).flatMap(p0 => Array.isArray(M[id][p0]) ? M[id][p0].map((_, i) => p0 + '.' + i) : [p0]).forEach(p => {
      const c = p.includes('.') ? M[id][p.split('.')[0]][+p.split('.')[1]] : M[id][p], v = c.any ? ((SETUP[id] || {})[p] || [0, 'x'])[1] || 'x' : (c.v || 'x'); n++;
      try {
        let x;
        if (c.line || c.ps) {
          const w = (LINE[id] || {})[p], tgt = T.parseEq(w);
          if (c.line) { const d = T.withX(T.Q(0), () => T.lineDone(tgt)); if (!T.lineSame(T.parseEq(c.line), tgt)) out.push(`${id} #${p} ${c.line} is not ${w}`); if (!d || !d.simple) out.push(`${id} #${p}: ${w} not seen as solved`);
            if (T.lineTxt(d.m, d.b) !== w) out.push(`${id} #${p}: answer text ${T.lineTxt(d.m, d.b)} vs ${w}`); }
          if (c.ps) { const e = T.parseEq(`y = (${c.ps[0]})*x + (${c.ps[1]})`); if (!T.lineSame(e, tgt)) out.push(`${id} #${p} data ${c.ps} vs ${w}`);
            const pe = (PSEQ[id] || {})[p]; if (!pe || !T.lineSame(T.parseEq(pe), tgt)) out.push(`${id} #${p}: point-slope ${pe} is not ${w}`); }
          return;
        }
        if (c.expr) {
          const w = (EXPR[id] || {})[p], A = T.mono(T.parseTerm(c.expr)), Bm = T.mono(T.parseTerm(w));
          if (!T.sameMono(A, Bm)) out.push(`${id} #${p} ${c.expr} is not equal to ${w}`);
          if (!T.exSimplest(T.parseTerm(w), !!c.sci).ok) out.push(`${id} #${p}: ${w} is not accepted as simplest`);
          return;
        }
        if (c.start) { const g = res(c.start, v); const w = (WANT[id] || {})[p]; if (g !== w) out.push(`${id} #${p} start ${c.start}: got ${g}, want ${w}`); x = g; }
        if (c.setup != null) {
          const s = (SETUP[id] || {})[p]; if (!s) { out.push(`${id} #${p}: no setup equation in test`); return; }
          const g = res(s[0], s[1] || 'x'), want = c.setup.root ? Math.sqrt(c.setup.root) : Number(c.setup);
          let val = g.replace(/^[<>≤≥]/, '').replace(/^sq/, '');
          const num = val.includes('/') ? val.split('/')[0] / val.split('/')[1] : Number(val);
          if (Math.abs(num - want) > 1e-9) out.push(`${id} #${p} setup ${s[0]}: solves to ${g}, data says ${JSON.stringify(c.setup)}`);
          if (c.any && Number.isInteger(num)) val = String(num);
          if (!c.any && (s[1] || 'x') !== v) out.push(`${id} #${p}: letter ${s[1]} vs ${v}`);
          x = val;
        }
        if (c.then) {
          const xs = T.Q(...(x.includes('/') ? x.split('/').map(Number) : [Number(x), 1]));
          const got = c.then.map(t => T.qtxt(T.solve(T.parseEq(`${v} = 0`), v) && (function () { const P = T.poly(T.parseEq(t.expr.replace(/[a-z]/g, v) + ' = 0').L, v); return { n: P[0].n * xs.d * P[1].d + P[1].n * xs.n * P[0].d, d: P[0].d * P[1].d * xs.d }; })()));
          const wantT = (THEN[id] || {})[p] || [];
          got.forEach((g, i) => { const [a, b] = g.split('/').map(Number); const gv = b ? a / b : a; if (Math.abs(gv - Number(wantT[i])) > 1e-9) out.push(`${id} #${p} then ${c.then[i].label}: got ${g}, want ${wantT[i]}`); });
        }
      } catch (e) { out.push(`${id} #${p}: ERROR ${e.code || e.message}`); }
    }));
    out.unshift(`checked ${n} homework problems`);
    return out;
  }, [WANT, SETUP, THEN, EXPR, LINE, PSEQ]);
  console.log(bad.join('\n'));
  await br.close();
  process.exit(bad.length > 1 ? 1 : 0);
})();
