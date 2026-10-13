const L = require('../lib/common.js');
const F = require('../lib/figs.js');
const { G, C, fmt, fr, fig, figHtml, two, q, mc, mistake, task, widget, page } = L;
const { Q, QV, pgraph, feats, rangeBand, poly, polyA } = require('./u7common.js');
G.prefix = 'u7p'; G.n = 0;
const out = [];
const part = (h, p) => out.push(`<div class="keyhdr"><h2>${h}</h2><p>${p}</p></div>`);
const sec = (n, t, html) => out.push(`<section class="topic"><h2><span class="num">${n}</span> ${t}</h2>\n${html}\n</section>`);
const tw = h => `<div class="table-wrap">${h}</div>`;
const ring = (P, x, y, lab, pos) => { P.add(`<circle cx="${P.X(x).toFixed(1)}" cy="${P.Y(y).toFixed(1)}" r="10" fill="none" stroke="${C.gold}" stroke-width="3"/>`); if (lab) P.lab(x, y, lab, pos || 'e', { c: C.goldT, dx: 6 }); return P; };

/* ===== Part A ===== */
{
  const A = QV(-1, 2, 5); // −x² + 4x + 1
  const v = [-2, 6, -4, 6];
  const g = () => pgraph(A.f, v, { H: 280 });
  const g1 = g();
  const g2 = ring(g(), 2, 5, 'vertex = ?', 'ne');
  const g3 = g(); g3.text(2.6, 5.5, 'axis: x = ?', { c: C.goldT, fs: 12, bold: true, anchor: 'start' });
  const g4 = ring(g(), 2, 5, 'max or min?', 'ne');
  const a2 = g(); feats(a2, A, { vertex: { c: C.green, text: '(2, 5)', pos: 'e' } });
  const a3 = g(); feats(a3, A, { axis: { c: C.green, text: 'x = 2', y: -3.4 }, vertex: { c: C.green, text: false } });
  const a4 = g(); feats(a4, A, { vertex: { c: C.green, text: 'maximum 5', pos: 'e' } });
  part('Part A · Reading Parabola Features', 'Use the graph shown to answer Questions 1–4. Each grid line is 1 unit.');
  sec('A', 'Vertex, Axis of Symmetry &amp; Direction', `
${mc('a1', { n: 1, text: 'Does the parabola shown open up or down?', fig: fig(g1.out('parabola for Part A')), opts: [
  { t: 'Down', ok: 1 }, { t: 'Up', fb: 'Look at the arms. They point down, like a hill.' }, { t: 'Left', fb: 'Parabolas of the form y = ax² + bx + c only open up or down.' }, { t: 'Right', fb: 'Parabolas of the form y = ax² + bx + c only open up or down.' }],
  why: 'The arms point downward.' })}
${q('a2', { n: 2, text: 'What is the vertex of the parabola?', fig: fig(g2.out('vertex marked with a question mark')), t: 'pt', a: [A.h, A.k], ph: '(x, y)',
  sol: 'The vertex is the turning point of the parabola, shown at → <strong>(2, 5)</strong>', after: fig(a2.out('vertex'), 'vertex (2, 5)') })}
${q('a3', { n: 3, text: 'What is the axis of symmetry?', fig: fig(g3.out('parabola')), t: 'num', a: A.h, axis: true, ph: 'x = ?', traps: [{ v: 5, m: '5 is the y-value of the vertex. The axis uses the x-value.' }],
  sol: 'The axis of symmetry is the vertical line through the vertex → <strong>x = 2</strong>', after: fig(a3.out('axis'), 'axis x = 2') })}
${mc('a4', { n: 4, text: 'Is the vertex a maximum or minimum?', fig: fig(g4.out('parabola')), opts: [
  { t: 'Maximum', ok: 1 }, { t: 'Minimum', fb: 'This parabola opens down. The vertex is the TOP of the hill.' }, { t: 'Neither', fb: 'Every parabola’s vertex is a max or a min.' }, { t: 'Both', fb: 'It can only be one. Is the vertex the highest or the lowest point?' }],
  why: 'Since the parabola opens down, the vertex is the highest point — a maximum.', after: fig(a4.out('maximum'), 'maximum value 5') })}
`);
}

/* ===== Part B ===== */
{
  const B = Q(1, 2, -3);
  const v = [-5, 3, -5, 5];
  const g = () => pgraph(B.f, v, { H: 270 });
  const b1 = g();
  const b1a = g(); feats(b1a, B, { zeros: { c: C.green, pos: ['nw', 'ne'] } });
  const b2 = g(); B.zeros.forEach((z, i) => { b2.dot(z, 0, { c: C.navy, r: 5 }); b2.lab(z, 0, 'x = ' + fmt(z), i ? 'nw' : 'ne', { c: C.navy, fs: 11 }); });
  const box = F.boxMethod({ top: ['x', '+3'], left: ['x', '−1'], cells: [['?', '?'], ['?', '?']] });
  const boxA = F.boxMethod({ top: ['x', '+3'], left: ['x', '−1'], cells: [['x²', '3x'], ['−x', '−3']], green: true });
  const b4 = ring(g(), B.h, B.k, 'vertex = ?', 'sw');
  const b4a = pgraph(B.f, [-5, 3, -6, 5], { H: 280 }); feats(b4a, B, { axis: { c: C.green, text: 'x = −1', y: 4.3 }, vertex: { c: C.green, text: '(−1, −4)', pos: 'sw' }, zeros: { c: C.navy, text: false } });
  part('Part B · Factored Form &amp; the Graph', 'Use the graph shown to answer Questions 1–4. Part B uses standard and factored form. Vertex form gets its own practice in Part E.');
  sec('B', 'Factored Form ↔ Graph', `
${q('b2', { n: 1, text: 'What are the x-intercepts (zeros) of the function graphed?', fig: fig(b1.out('parabola for Part B')), t: 'set', a: B.zeros, ph: 'x = ?, ?',
  sol: 'Read directly where the curve crosses the x-axis → <strong>x = −3, 1</strong>', after: fig(b1a.out('zeros'), 'zeros −3 and 1') })}
${mc('b1', { n: 2, text: 'Which factored form matches the graph shown (zeros at x = −3 and x = 1)?', fig: fig(b2.out('parabola')), opts: [
  { t: '(x + 3)(x − 1)', ok: 1 }, { t: '(x − 3)(x + 1)', fb: 'These factors give zeros x = 3 and x = −1. The signs are flipped.' }, { t: '(x + 3)(x + 1)', fb: '(x + 1) gives x = −1, but the graph crosses at x = 1.' }, { t: '(x − 3)(x − 1)', fb: '(x − 3) gives x = 3, but the graph crosses at x = −3.' }],
  why: 'Setting each factor to 0 gives x = −3 and x = 1, matching the graph.' })}
${q('b3', { n: 3, text: 'Expand (x + 3)(x − 1) into standard form.', fig: fig(box, 'Fill the box, then combine like terms'), t: 'expr', form: 'std', a: 'x^2+2x-3', ph: 'x^2 + ... + ...',
  traps: [{ v: 'x^2-3', m: 'You multiplied only the first terms and the last terms. Fill all 4 boxes: you also get 3x and −x.' }, { v: 'x^2-2x-3', m: 'Check the middle: 3x + (−x) = +2x.' }, { v: 'x^2+2x+3', m: 'Check the last box: 3 × (−1) = −3.' }],
  sol: 'FOIL: x² − x + 3x − 3 → <strong>x² + 2x − 3</strong>', after: fig(boxA, 'x² + 3x − x − 3 = x² + 2x − 3') })}
${q('b4', { n: 4, text: 'Using the zeros, find the vertex of the parabola. (Hint: the vertex’s x-value is the <em>midpoint</em> of the zeros — no formula needed.)', fig: fig(b4.out('vertex marked')), t: 'pt', a: [B.h, B.k], ph: '(x, y)',
  traps: [{ v: [-1, 0], m: 'x = −1 is right! Now put x = −1 into the function to get the y-value.' }, { v: [1, -4], m: 'The midpoint of −3 and 1 is (−3 + 1) ÷ 2 = −1, not 1.' }],
  sol: `Midpoint of the zeros: ${fr('−3 + 1', '2')} = −1. Evaluate the function at x = −1: (−1)² + 2(−1) − 3 = 1 − 2 − 3 = −4 → <strong>(−1, −4)</strong>`, after: fig(b4a.out('vertex'), 'Halfway between the zeros: vertex (−1, −4)') })}
`);
}

/* ===== Part C ===== */
{
  const A = QV(-1, 2, 5), B = Q(1, -6, 5);
  const ga = pgraph(A.f, [-2, 6, -4, 6], { H: 280 });
  const gab = pgraph(A.f, [-2, 7, -5, 7], { H: 280 });
  gab.curve(B.f, { c: C.blue, dash: '7 5' });
  gab.dot(2, 5, { c: C.green }); gab.lab(2, 5, 'A: max 5', 'n', { c: C.green, fs: 11 });
  gab.text(5.6, 2.6, 'B', { c: C.blue, fs: 13, bold: true, dx: 6 });
  const mach = F.machine({ input: 'x = 0', rule: 'g(x) = x² − 6x + 5', output: '?' });
  const machA = F.machine({ input: 'x = 0', rule: 'g(0) = 0 − 0 + 5', output: '5' });
  const box = F.boxMethod({ top: ['x', '?'], left: ['x', '?'], cells: [['x²', '?'], ['?', '+5']] });
  const gB = pgraph(B.f, [-1, 7, -5, 7], { H: 260 }); feats(gB, B, { zeros: { c: C.green, pos: ['ne', 'nw'] }, yint: { c: C.navy, text: '(0, 5)', pos: 'e' } });
  part('Part C · Comparing Quadratic Functions', 'Function A is graphed below. Function B is given by g(x) = x² − 6x + 5.');
  sec('C', 'Graph vs. Equation', `
${mc('c1', { n: 1, text: 'Function A is graphed above. Function B is g(x) = x² − 6x + 5. Which function has the greater maximum value?', fig: fig(ga.out('Function A')), opts: [
  { t: 'Function A, maximum of 5', ok: 1 }, { t: 'Function B, maximum of 5', fb: 'B has a = 1 (positive), so B opens up. It has a minimum, not a maximum.' }, { t: 'Both have the same maximum', fb: 'B opens up, so B has no maximum at all.' }, { t: 'Neither has a maximum', fb: 'A opens down, so A does have a maximum: its top point.' }],
  why: 'Function B opens upward (no maximum), so only Function A has one — 5.', after: fig(gab.out('A and B'), 'A has a top (max 5). B (dashed) opens up, so it has no max: it goes up forever.') })}
${q('c2', { n: 2, text: 'What is the y-intercept of Function B: g(x) = x² − 6x + 5?', fig: fig(mach, 'Put in x = 0'), t: 'num', a: B.c, yint: true, ph: '(0, ?)',
  traps: [{ v: 1, m: '1 is a (the number in front of x²). The y-intercept is the plain number, c.' }, { v: -6, m: '−6 is b. When x = 0, the −6x term becomes 0.' }],
  sol: 'Plug in x = 0: g(0) = 0² − 6(0) + 5 → <strong>(0, 5)</strong>', after: fig(machA) })}
${q('c3', { n: 3, text: 'Find the zeros of Function B: g(x) = x² − 6x + 5.', fig: fig(box, 'Two numbers that multiply to 5 and add to −6'), t: 'set', a: B.zeros, ph: 'x = ?, ?',
  sol: 'Factor: x² − 6x + 5 = (x − 1)(x − 5) = 0 → <strong>x = 1, 5</strong>', after: fig(gB.out('zeros of g'), 'g crosses the x-axis at 1 and 5') })}
`);
}

/* ===== Part D ===== */
{
  const am = F.areaModel({ hLab: 'x', cols: [{ w: 4, lab: 'x', inside: '?', ic: C.goldT }, { w: 3, lab: '5', inside: '?', ic: C.goldT }] });
  const amA = F.areaModel({ hLab: 'x', cols: [{ w: 4, lab: 'x', inside: 'x²', ic: C.green }, { w: 3, lab: '5', inside: '5x', ic: C.green }] });
  const f = x => x * x - 3, g = x => 2 * x + 1;
  const hd = ['x', 'f(x)', 'g(x)', '(f + g)(x)'];
  const tb = F.vt(hd, [[0, 1, 2], [0, 1, 2].map(x => fmt(f(x))), [0, 1, 2].map(x => fmt(g(x))), ['?', '?', '?']]);
  const tbA = F.vt(hd, [[0, 1, 2], [0, 1, 2].map(x => fmt(f(x))), [0, 1, 2].map(x => fmt(g(x))), [0, 1, 2].map(x => fmt(f(x) + g(x)))]);
  const h = Q(-16, 3, 0);
  const gh = pgraph(h.f, [0, 0.4, -1.5, 0.5], { H: 220, gx: 0.05, lx: 0.1, gy: 0.25, ly: 0.5, xname: 't (s)', yname: 'h (ft)' });
  gh.dot(3 / 32, h.f(3 / 32), { c: C.green }); gh.lab(3 / 32, h.f(3 / 32), 'top: only about 0.14 ft', 'ne', { c: C.green, fs: 11 });
  part('Part D · Building New Functions (F-BF.1b)', 'Combine two functions using arithmetic operations to build a new one.');
  sec('D', 'Combining Functions', `
${q('d1', { n: 1, text: 'A rectangle has length L(x) = x + 5 and width W(x) = x. Build a new function A(x) = L(x) · W(x) for its area.', fig: fig(am, 'Area model: what goes in each part?'), t: 'expr', form: 'std', a: 'x^2+5x', ph: 'A(x) = x^2 + ...',
  traps: [{ v: 'x^2+5', m: 'Distribute x to BOTH terms: x · x and x · 5. The 5 becomes 5x.' }, { v: '2x+5', m: 'That adds the sides. Area MULTIPLIES length × width.' }],
  sol: 'A(x) = L(x)·W(x) = (x+5)(x) = x² + 5x → <strong>A(x) = x² + 5x</strong>', after: fig(amA, 'x · x = x² and 5 · x = 5x') })}
${q('d2', { n: 2, text: 'Let f(x) = x² − 3 and g(x) = 2x + 1. Find (f + g)(x).', fig: figHtml(tw(tb), 'Add the outputs down each column'), t: 'expr', a: 'x^2+2x-2', ph: 'x^2 + ...',
  traps: [{ v: 'x^2+2x-4', m: 'Check the numbers: −3 + 1 = −2.' }, { v: 'x^2+2x+4', m: 'Check the numbers: −3 + 1 = −2.' }, { v: '2x^3-6x+x^2-3', m: 'That multiplies. (f + g) means ADD the two functions.' }],
  sol: '(f+g)(x) = (x² − 3) + (2x + 1) = <strong>x² + 2x − 2</strong>', after: figHtml(tw(tbA), 'Check x = 2: 4 + 4 − 2 = 6 ✓') })}
  <div class="sa"><div class="chk-q"><span class="badge">MODEL</span> A dropped ball's height from gravity alone is g(t) = −16t². Wind resistance adds a small constant upward drift, w(t) = 3t. Combine these to build the actual height function h(t) = g(t) + w(t).</div>${figHtml(tw(F.vt(['t', 'g(t) = −16t²', 'w(t) = 3t', 'h(t) = g(t) + w(t)'], [[0, 1, 2], [0, 1, 2].map(t => fmt(-16 * t * t)), [0, 1, 2].map(t => fmt(3 * t)), ['?', '?', '?']])), 'Add the two outputs in each column')}<button class="sa-btn" onclick="K78.sol(this)">Reveal</button><div class="sa-ans">h(t) = g(t) + w(t) = −16t² + 3t.<br><strong>h(t) = −16t² + 3t</strong> — adding the two functions builds a single model for the ball's real height over time (measured from where it was dropped).</div>${L.after(fig(gh.out('graph of h(t)'), 'h(t) = −16t² + 3t: the drift adds a tiny rise before the fall'))}</div>
`);
}

/* ===== Part E: vertex form ===== */
{
  const T = QV(-1, -2, 4);
  const gT = pgraph(T.f, [-6, 6, -6, 6], { H: 270 }); feats(gT, T, { vertex: { c: C.green, text: '(−2, 4)', pos: 'n' } });
  const E1 = QV(1, 4, -1);
  const d1 = F.decoder([{ t: 'y = ' }, { t: '(x − 4)', lab: 'h = ?', c: 'gold' }, { t: '²' }, { t: ' − 1', lab: 'k = ?', c: 'gold' }]);
  const g1 = pgraph(E1.f, [-1, 8, -2, 8], { H: 250 }); feats(g1, E1, { vertex: { c: C.green, text: '(4, −1)', pos: 'e' } });
  const E2 = QV(-2, -1, 8);
  const d2 = F.decoder([{ t: 'y = ' }, { t: '−2', lab: 'a', c: 'navy' }, { t: '(x + 1)', lab: 'h = ?', c: 'gold' }, { t: '²' }, { t: ' + 8', lab: 'k = ?', c: 'gold' }]);
  const g2 = pgraph(E2.f, [-5, 3, -4, 10], { H: 260 }); feats(g2, E2, { vertex: { c: C.green, text: 'max (−1, 8)', pos: 'nw' } });
  const g2m = pgraph(E2.f, [-5, 3, -4, 10], { H: 260 }); g2m.seg(-1, 8, 0, 8, { c: C.green, w: 1.8, dash: '5 4' }); feats(g2m, E2, { vertex: { c: C.green, text: 'max value 8', pos: 'nw' } });
  const box = F.boxMethod({ top: ['x', '−4'], left: ['x', '−4'], cells: [['?', '?'], ['?', '?']] });
  const boxA = F.boxMethod({ top: ['x', '−4'], left: ['x', '−4'], cells: [['x²', '−4x'], ['−4x', '16']], green: true });
  const tr = F.tree({ top: '(x − 4)² = 1', left: 'x − 4 = 1', right: 'x − 4 = −1', lres: 'x = ?', rres: 'x = ?' });
  const trA = F.tree({ top: '(x − 4)² = 1', left: 'x − 4 = 1', right: 'x − 4 = −1', lres: 'x = 5', rres: 'x = 3' });
  const g5 = pgraph(E1.f, [-1, 8, -2, 8], { H: 250 }); E1.zeros.forEach((z, i) => { g5.dot(z, 0, { c: C.green, r: 5 }); g5.lab(z, 0, '(' + fmt(z) + ', 0)', i ? 'se' : 'sw', { c: C.green, fs: 11, dy: 12 }); });
  const E6 = QV(3, 2, -7);
  const g6 = pgraph(E6.f, [-2, 5, -8, 6], { H: 250 }); feats(g6, E6, { vertex: { c: C.green, text: 'vertex (2, −7)', pos: 'e' } });
  part('Part E · Vertex Form vs. Standard Form', 'Vertex form y = a(x − h)² + k shows the vertex (h, k). Remember: inside the parentheses the sign flips.');
  sec('E', 'Reading &amp; Changing Vertex Form', `
${task('e0', { n: 1, text: 'Use the graph tool. Drag the vertex and move the a-slider to make <b>y = −(x + 2)² + 4</b>. Then press “Check my graph”.', w: 'vtx',
  opts: { h0: 0, k0: 0, a0: 1, task: { h: -2, k: 4, a: -1 }, title: '🖐 Build y = −(x + 2)² + 4', okMsg: 'h = −2 (the sign flips), k = 4, and a = −1 opens down.' },
  after: fig(gT.out('target graph'), 'y = −(x + 2)² + 4: vertex (−2, 4), opens down') })}
${q('e1', { n: 2, text: 'What is the vertex of y = (x − 4)² − 1?', fig: fig(d1), t: 'pt', a: [E1.h, E1.k], ph: '(h, k)',
  traps: [{ v: [-4, -1], m: '(x − 4) means h = +4. Inside the parentheses the sign flips.' }, { v: [4, 1], m: 'k keeps its sign: the end of the equation is − 1, so k = −1.' }],
  sol: 'h = 4 and k = −1 → <b>(4, −1)</b>', after: fig(g1.out('vertex'), 'vertex (4, −1)') })}
${q('e2', { n: 3, text: 'What is the vertex of y = −2(x + 1)² + 8?', fig: fig(d2), t: 'pt', a: [E2.h, E2.k], ph: '(h, k)',
  traps: [{ v: [1, 8], m: '(x + 1) means h = −1. The sign flips.' }, { v: [-2, 8], m: '−2 is a (it tells the direction). h comes from inside the parentheses.' }],
  sol: '(x + 1) = (x − (−1)) so h = −1, k = 8 → <b>(−1, 8)</b>', after: fig(g2.out('vertex'), 'vertex (−1, 8)') })}
${mc('e3', { n: 4, text: 'For y = −2(x + 1)² + 8, is the vertex a maximum or a minimum?', fig: fig(F.cupHill({ eq: 'y = −2(x + 1)² + 8', ask: 'a = ' + fmt(E2.a) + ' → which shape?' }), 'A hill has a highest point. A cup has a lowest point.'), opts: [
  { t: 'Maximum, because a = −2 is negative', ok: 1 }, { t: 'Minimum, because a = −2 is negative', fb: 'Negative a opens DOWN, like a hill. The vertex is the top.' },
  { t: 'Maximum, because k = 8 is positive', fb: 'The direction comes from a, not k. k only tells the height of the vertex.' }, { t: 'Minimum, because h = −1', fb: 'h only moves the graph left or right. Look at a.' }],
  why: 'a = −2 &lt; 0 opens down, so the vertex (−1, 8) is a maximum: the max value is 8.', after: fig(g2m.out('the highest point is y = 8'), 'Opens down, so the vertex is the top: max value 8') })}
${q('e4', { n: 5, text: 'Write y = (x − 4)² − 1 in standard form.', fig: fig(box, 'Box for (x − 4)(x − 4)'), t: 'expr', form: 'std', a: polyA(E1.a, E1.b, E1.c), ph: 'y = x^2 + ...',
  traps: [{ v: 'x^2+15', m: '(x − 4)² is not x² + 16. Fill the box: you also get two −4x terms.' }, { v: 'x^2-17', m: '(x − 4)² is not x² − 16. Fill the box: x², −4x, −4x and +16.' }, { v: 'x^2-8x+16', m: 'Great squaring! Now add k = −1 to the 16.' }, { v: 'x^2-8x+17', m: 'k is −1, so 16 + (−1) = 15.' }],
  sol: '(x − 4)² = x² − 8x + 16. Add −1: <b>y = x² − 8x + 15</b>', after: fig(boxA, '(x − 4)² = x² − 8x + 16') })}
${q('e5', { n: 6, text: 'Find the zeros of y = (x − 4)² − 1. (Set y = 0: (x − 4)² = 1.)', fig: fig(tr, 'A square of 1 can come from +1 or −1'), t: 'set', a: E1.zeros, ph: 'x = ?, ?',
  traps: [{ v: [5], m: 'Don’t forget the negative square root: x − 4 = −1 also works.' }, { v: [-5, -3], m: 'x − 4 = 1 means x = 5 (add 4). Check your signs.' }],
  sol: 'x − 4 = 1 → x = 5, and x − 4 = −1 → x = 3. <b>x = 3 and x = 5</b>.', after: fig(trA) + fig(g5.out('zeros'), 'zeros 3 and 5 — the same as factoring x² − 8x + 15 = (x − 3)(x − 5)') })}
${mistake('e6', { n: 7, who: 'Sam found the vertex of y = 3(x − 2)² − 7:', fig: fig(F.decoder([{ t: 'y = ' }, { t: '3', lab: 'a = 3' }, { t: '(x − 2)', lab: 'h = ?', c: 'gold' }, { t: '²' }, { t: ' − 7', lab: 'k = ?', c: 'gold' }], { aria: 'equation y = 3(x − 2)² − 7' }), 'Only one of h and k flips its sign.'),
  work: ['a = 3, so it opens up.', '(x − 2), so h = 2.', 'The end is − 7, so k = 7.', 'Vertex: (2, 7)'], bad: 2,
  fbs: ['Step 1 is right: a = 3 is positive.', 'Step 2 is right: (x − 2) means h = 2.', '', 'Step 4 uses k from Step 3. Find the first mistake.'],
  why: 'Only h flips sign. k keeps its sign: k = −7. The vertex is (2, −7).', after: fig(g6.out('vertex'), 'Fixed: vertex (2, −7)') })}
`);
}

/* ===== Part F: features from a, b, c ===== */
{
  const P = Q(1, -4, -5);
  const dec = F.decoder([{ t: 'y = ' }, { t: 'x²', lab: 'a = 1' }, { t: ' − 4x', lab: 'b = −4' }, { t: ' − 5', lab: 'c = −5' }]);
  const g = () => pgraph(P.f, [-3, 7, -10, 6], { H: 290, ly: 2 });
  const g1 = g(); feats(g1, P, { axis: { c: C.green, text: 'x = 2', y: 5 } });
  const xs = [-1, 0, 1, 3, 4, 5];
  const tb = F.vt(['x', 'y'], [[-1, 0, 1, '?', 3, 4, 5], [...xs.slice(0, 3).map(x => fmt(P.f(x))), '?', ...xs.slice(3).map(x => fmt(P.f(x)))]]);
  const g2 = g(); feats(g2, P, { vertex: { c: C.green, text: 'vertex (2, −9)', pos: 'e' } });
  const mach = F.machine({ input: 'x = 0', rule: 'y = x² − 4x − 5', output: '?' });
  const g3 = g(); feats(g3, P, { yint: { c: C.green, text: '(0, −5)', pos: 'w' } });
  const box = F.boxMethod({ top: ['x', '?'], left: ['x', '?'], cells: [['x²', '?'], ['?', '−5']] });
  const g4 = g(); feats(g4, P, { zeros: { c: C.green, pos: ['nw', 'ne'] } });
  const g5 = g(); rangeBand(g5, P, C.green); feats(g5, P, { vertex: { c: C.green, text: 'min −9', pos: 'e' } });
  const M = Q(2, 8, 1);
  const gm = pgraph(M.f, [-5, 2, -8, 4], { H: 250 }); feats(gm, M, { axis: { c: C.green, text: 'x = −2', y: 3.2 }, vertex: { c: C.green, text: '(−2, −7)', pos: 'e' } });
  part('Part F · Features from Standard Form', `Use y = x² − 4x − 5 for Questions 1–5. Axis of symmetry: x = ${fr('−b', '2a')}.`);
  sec('F', 'From a, b and c to the Graph', `
${q('f1', { n: 1, text: 'What is the axis of symmetry of y = x² − 4x − 5?', fig: fig(dec, `x = ${'−b ÷ (2a)'}`), t: 'num', a: P.h, axis: true, ph: 'x = ?',
  traps: [{ v: -2, m: '−b means “the opposite of b.” b = −4, so −b = +4. Then 4 ÷ 2 = 2.' }, { v: 4, m: 'You found −b = 4. Now divide by 2a = 2.' }],
  sol: `x = ${fr('−(−4)', '2(1)')} = ${fr('4', '2')} = <b>2</b>`, after: fig(g1.out('axis'), 'axis x = 2') })}
${q('f2', { n: 2, text: 'What is the vertex?', fig: figHtml(tw(tb), 'The y-values mirror around the missing middle column'), t: 'pt', a: [P.h, P.k], ph: '(x, y)',
  traps: [{ v: [2, -5], m: 'x = 2 is right. Now compute y: 2² − 4(2) − 5.' }, { v: [2, 7], m: 'Check: 2² − 4(2) − 5 = 4 − 8 − 5 = −9.' }],
  sol: 'x = 2. y = 2² − 4(2) − 5 = 4 − 8 − 5 = −9 → <b>(2, −9)</b>', after: fig(g2.out('vertex'), 'vertex (2, −9)') })}
${q('f3', { n: 3, text: 'What is the y-intercept?', fig: fig(mach, 'Put in x = 0'), t: 'num', a: P.c, yint: true, ph: '(0, ?)',
  sol: 'x = 0: y = 0 − 0 − 5 → <b>(0, −5)</b>. It is always c.', after: fig(g3.out('y-intercept'), 'y-intercept (0, −5)') })}
${q('f4', { n: 4, text: 'What are the zeros?', fig: fig(box, 'Two numbers that multiply to −5 and add to −4'), t: 'set', a: P.zeros, ph: 'x = ?, ?',
  traps: [{ v: [-5, 1], m: '(x − 5)(x + 1) = 0 gives x = 5 and x = −1. The zero has the opposite sign of the number in the factor.' }],
  sol: 'x² − 4x − 5 = (x − 5)(x + 1) → <b>x = −1 and x = 5</b>', after: fig(g4.out('zeros'), 'zeros −1 and 5 (and the axis x = 2 is halfway between them!)') })}
${q('f5', { n: 5, text: 'What is the range? (y ≥ … or interval notation)', fig: fig(F.sketch({ up: P.a > 0, eq: 'y = x² − 4x − 5  (a = ' + fmt(P.a) + ')', vlab: 'vertex (?, ?)', rlab: 'y ≥ ?' }), 'Sketch (not to scale): it opens up from the vertex. Use your vertex from Question 2.'), t: 'ineq', a: { op: '>=', v: P.k }, ph: 'y >= ?',
  traps: [{ v: { op: '>=', v: 2 }, m: '2 is the x-value of the vertex. The range uses the y-value, −9.' }, { v: { op: '<=', v: -9 }, m: 'a = 1 is positive, so the graph opens up from −9: use ≥.' }],
  sol: 'Opens up from the vertex (2, −9): <b>y ≥ −9</b>, or <b>[−9, ∞)</b>', after: fig(g5.out('range'), 'range y ≥ −9') })}
${mc('f6', { n: 6, text: 'Use the a-slider. Which parabola is <b>narrower</b>: y = 3x² or y = ½x²?', fig: widget('aslide'), opts: [
  { t: 'y = 3x²', ok: 1 }, { t: 'y = ½x²', fb: 'Slide a to 0.5. The graph gets WIDER (flatter). Now try a = 3.' }, { t: 'They are the same width', fb: 'Different a-values give different widths. Try both on the slider.' }],
  why: '|a| = 3 is bigger than 1, so y = 3x² is narrower (steeper). |a| = ½ is less than 1, so y = ½x² is wider.' })}
${mistake('f7', { n: 7, who: 'Marcus found the axis of symmetry of y = 2x² + 8x + 1:', fig: fig(F.decoder([{ t: 'y = ' }, { t: '2x²', lab: 'a = ' + fmt(M.a) }, { t: ' + 8x', lab: 'b = ' + fmt(M.b) }, { t: ' + 1', lab: 'c = ' + fmt(M.c) }], { aria: 'equation y = 2x² + 8x + 1' }), 'axis: x = −b ÷ (2a). Watch the sign of −b.'),
  work: ['a = 2, b = 8', `x = ${fr('−b', '2a')}`, `x = ${fr('8', '4')}`, 'x = 2'], bad: 2,
  fbs: ['Step 1 is right.', 'Step 2 is the right formula.', '', 'Step 4 just divides Step 3. Find the first mistake.'],
  why: `He dropped the negative. −b = −8, so x = ${fr('−8', '4')} = −2.`, after: fig(gm.out('axis'), 'Fixed: axis x = −2, vertex (−2, −7)') })}
`);
}

/* ===== Part G: word problems ===== */
{
  const H = Q(-16, 64, 80);
  const eq = 'h(t) = −16t² + 64t + 80';
  const sc = k => F.scene({ eq, hi: k });
  const gg = () => pgraph(H.f, [0, 6, 0, 180], { H: 270, gx: 0.5, lx: 1, gy: 20, ly: 40, xname: 't (s)', yname: 'h (ft)' });
  const gA = gg(); gA.dot(0, 80, { c: C.green }); gA.lab(0, 80, 'start 80 ft', 'e', { c: C.green, fs: 11, dy: 8 });
  const gB = gg(); gB.vline(2, { c: C.green, dash: '5 4', w: 1.6 }); gB.dot(2, 144, { c: C.green }); gB.lab(2, 144, 'top at t = 2', 'ne', { c: C.green, fs: 11 });
  const gC = gg(); gC.dot(2, 144, { c: C.green }); gC.seg(0, 144, 2, 144, { c: C.green, w: 1.6, dash: '5 4' }); gC.lab(2, 144, 'max 144 ft', 'ne', { c: C.green, fs: 11 });
  const gD = gg(); gD.dot(5, 0, { c: C.green }); gD.lab(5, 0, 'lands t = 5', 'nw', { c: C.green, fs: 11 });
  const am = F.areaModel({ wLab: 'w + 3', hLab: 'w', inside: 'Area = 54 m²' });
  const amA = F.areaModel({ wLab: '9 m', hLab: '6 m', inside: '6 × 9 = 54 ✓', wc: C.green, hc: C.green, ic: C.green });
  const pen = F.areaModel({ wLab: '20 − x', hLab: 'x', inside: 'A(x) = x(20 − x)' });
  const A = Q(-1, 20, 0);
  /* Question 7 shows the best WIDTH, Question 8 the largest AREA */
  const gpp = () => pgraph(A.f, [0, 20, 0, 130], { H: 250, gx: 1, lx: 4, gy: 10, ly: 20, xname: 'x (m)', yname: 'A (m²)' });
  const gp = gpp(); gp.seg(10, 0, 10, 100, { c: C.green, dash: '5 4', w: 1.6 }); gp.dot(10, 100, { c: C.green }); gp.lab(10, 100, 'top at x = 10', 'ne', { c: C.green, fs: 11 });
  const gpA = gpp(); gpA.seg(0, 100, 10, 100, { c: C.green, dash: '5 4', w: 1.6 }); gpA.dot(10, 100, { c: C.green }); gpA.lab(10, 100, 'max A = 100', 'ne', { c: C.green, fs: 11 });
  const mm = F.areaModel({ wLab: 'w + 2', hLab: 'w', inside: 'Area = 48' });
  const mmA = F.areaModel({ wLab: '8', hLab: '6', inside: '6 × 8 = 48 ✓', wc: C.green, hc: C.green, ic: C.green });
  part('Part G · Word Problems (A-CED.1/2)', 'Projectile and area problems. Draw a picture first, then write the equation.');
  sec('G', 'Projectiles &amp; Area', `
<div class="note">A ball is thrown upward from the top of a cliff. Its height in feet after t seconds is <b>h(t) = −16t² + 64t + 80</b>. Use it for Questions 1–4.</div>
${q('g1', { n: 1, text: 'How high is the cliff? (the starting height, in feet)', fig: fig(sc('start'), 'Sketch (not to scale)'), t: 'num', a: H.f(0), ph: 'h(0) = ?',
  traps: [{ v: 64, m: '64 is b. At t = 0, the 64t term becomes 0. Put t = 0 into h(t).' }, { v: -16, m: '−16 is a. Put t = 0 into h(t): only the plain number is left.' }],
  sol: 'h(0) = −16(0)² + 64(0) + 80 = <b>80 ft</b>', after: fig(gA.out('graph'), 'Start: (0, 80)') })}
${q('g2', { n: 2, text: 'After how many seconds does the ball reach its highest point?', fig: fig(sc('tmax'), 'Sketch (not to scale)'), t: 'num', a: H.h, ph: 't = ?',
  traps: [{ v: -2, m: `Careful with signs: t = ${fr('−64', '2(−16)')} = ${fr('−64', '−32')} = +2.` }, { v: 144, m: '144 is the max HEIGHT. The question asks for the TIME.' }],
  sol: `t = ${fr('−b', '2a')} = ${fr('−64', '2(−16)')} = ${fr('−64', '−32')} = <b>2 s</b>`, after: fig(gB.out('graph'), 'Top at t = 2') })}
${q('g3', { n: 3, text: 'What is the maximum height of the ball? (feet)', fig: fig(sc('max'), 'Sketch (not to scale)'), t: 'num', a: H.k, ph: 'h = ?',
  traps: [{ v: 2, m: '2 is the TIME of the top. Put t = 2 into h(t) to get the height.' }, { v: 80, m: '80 is the starting height. The ball goes higher than that.' }],
  sol: 'h(2) = −16(4) + 64(2) + 80 = −64 + 128 + 80 = <b>144 ft</b>', after: fig(gC.out('graph'), 'Max height 144 ft') })}
${q('g4', { n: 4, text: 'When does the ball hit the ground? (seconds)', fig: fig(sc('land'), 'Sketch (not to scale)'), t: 'num', a: 5, ph: 't = ?',
  traps: [{ v: -1, m: 't = −1 solves the equation, but time can’t be negative. Use the other answer.' }, { v: 2, m: 't = 2 is the top. The ground is where h(t) = 0.' }],
  sol: '−16t² + 64t + 80 = 0 → divide by −16: t² − 4t − 5 = 0 → (t − 5)(t + 1) = 0 → <b>t = 5 s</b> (t = −1 is thrown out)', after: fig(gD.out('graph'), 'Lands at t = 5') })}
${mc('g5', { n: 5, text: 'A garden’s length is 3 m more than its width w. Its area is 54 m². Which equation models the garden?', fig: fig(am), opts: [
  { t: 'w(w + 3) = 54', ok: 1 }, { t: 'w + (w + 3) = 54', fb: 'That adds two sides. Area means length × width.' }, { t: '2w + 2(w + 3) = 54', fb: 'That is the perimeter (distance around). Area means length × width.' }, { t: 'w² + 3 = 54', fb: 'Distribute w to both terms: w · w + w · 3 = w² + 3w.' }],
  why: 'Area = width × length = w(w + 3).' })}
${q('g6', { n: 6, text: 'Solve w(w + 3) = 54. What is the width of the garden? (m)', fig: fig(F.boxMethod({ top: ['w', '?'], left: ['w', '?'], cells: [['w²', '?'], ['?', '−54']], aria: 'box for w² + 3w − 54' }), 'w² + 3w − 54 = 0: two numbers that multiply to −54 and add to 3'), t: 'num', a: 6, ph: 'w = ?',
  traps: [{ v: -9, m: 'A width can’t be negative. Use your other answer.' }, { v: 9, m: '9 is the length (w + 3). The question asks for the width.' }, { v: 18, m: 'Area is not width × 3. Write w² + 3w − 54 = 0 and factor.' }],
  sol: 'w² + 3w − 54 = 0 → (w + 9)(w − 6) = 0 → <b>w = 6 m</b> (length 9 m)', after: fig(amA) })}
${q('g7', { n: 7, text: 'A pen has a perimeter of 40 m. Its area is A(x) = x(20 − x), where x is the width. What width gives the <b>largest</b> area? (m)', fig: fig(pen, 'width x, length 20 − x'), t: 'num', a: A.h, ph: 'x = ?',
  traps: [{ v: 20, m: 'At x = 20 the length is 0, so the area is 0. The max is halfway between the zeros 0 and 20.' }, { v: 100, m: '100 is the largest AREA. The question asks for the width.' }],
  sol: 'A(x) = −x² + 20x. Zeros: x = 0 and x = 20. Halfway: <b>x = 10 m</b>', after: fig(gp.out('area graph'), 'The top of the area graph is at x = 10') })}
${q('g8', { n: 8, text: 'What is that largest area? (m²)', fig: fig(F.machine({ input: 'x = ? (from Q7)', rule: 'A(x) = x(20 − x)', output: '?', aria: 'put the best width into A(x)' }), 'Put your width from Question 7 into A(x).'), t: 'num', a: A.k, ph: 'A = ?', traps: [{ v: 10, m: '10 is the width. Put x = 10 into A(x).' }],
  sol: 'A(10) = 10(20 − 10) = 10 · 10 = <b>100 m²</b> (a 10 by 10 square)', after: fig(gpA.out('area graph with its largest area'), 'Max area 100 m² (at x = 10)') })}
${mistake('g9', { n: 9, who: 'Lena solved: “A rectangle’s length is 2 more than its width. The area is 48. Find the width.”', fig: fig(mm),
  work: ['width = w, length = w + 2', 'w + (w + 2) = 48', '2w + 2 = 48', 'w = 23'], bad: 1,
  fbs: ['Step 1 is right.', '', 'Step 3 follows from Step 2. Find the first mistake.', 'Step 4 follows from Step 3. Find the first mistake.'],
  why: 'Area means MULTIPLY: w(w + 2) = 48 → w² + 2w − 48 = 0 → (w + 8)(w − 6) = 0 → w = 6.', after: fig(mmA) })}
`);
}

module.exports = page({
  title: 'Unit 7 Practice — Quadratic Functions | NC Math 1',
  back: 'unit7.html', backLabel: 'Unit 7',
  h1: '✏️ Unit 7 Practice — Quadratic Functions',
  sub: 'Work each problem on your printed copy, then check it on screen.',
  stds: 'Standards: F-IF.4/7/9 · A-CED.1/2 · F-BF.1b',
  score: true,
  intro: 'Type your answer and press <b>Check</b> (or Enter). You can type answers like <span class="coord">(2, 5)</span>, <span class="coord">x = 2</span>, <span class="coord">-3, 1</span>, <span class="coord">x^2+2x-3</span> or <span class="coord">y &gt;= -9</span>. If you are stuck, tap <b>📖 Show full solution</b>.',
  body: out.join('\n'),
  tail: '<div style="text-align:center;margin-top:18px"><a href="unit7.html" class="plink gold" style="padding:12px 24px;font-family:Arvo">← Back to Unit 7</a></div>'
});
