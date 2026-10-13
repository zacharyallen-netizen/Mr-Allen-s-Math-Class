const L = require('../lib/common.js');
const F = require('../lib/figs.js');
const { G, C, fmt, pt, fr, rad, fig, figHtml, two, vocab, howto, example, q, mc, mistake, widget, yt, page } = L;
const { gp, labPts, ftxt, fhtml, slopeND, dist, sideLab, gcd } = require('./u8common.js');
G.prefix = 'u8n'; G.n = 0;
const S = [];
const sec = (id, n, title, html) => S.push(`<section class="topic" id="${id}">\n  <h2><span class="num">${n}</span> ${title}</h2>\n${html}\n</section>`);
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const MF = `M = ( ${fr('x₁ + x₂', '2')} , ${fr('y₁ + y₂', '2')} )`;
const DF = `d = ${rad('(x₂ − x₁)² + (y₂ − y₁)²')}`;
const SF = `m = ${fr('y₂ − y₁', 'x₂ − x₁')}`;

/* ============ 1. Midpoint ============ */
{
  const A = [-2, 1], B = [4, 5], M = mid(A, B);
  const P = gp([-4, 6, -2, 7]);
  P.seg(A[0], A[1], B[0], A[1], { c: C.blue, w: 1.6, dash: '5 4' }); P.seg(B[0], A[1], B[0], B[1], { c: C.blue, w: 1.6, dash: '5 4' });
  P.text(-0.5, 1, '+3', { c: C.blue, fs: 11, bold: true, anchor: 'middle', dy: 14 }); P.text(2.5, 1, '+3', { c: C.blue, fs: 11, bold: true, anchor: 'middle', dy: 14 });
  P.text(4, 2, '+2', { c: C.blue, fs: 11, bold: true, dx: 6 }); P.text(4, 4, '+2', { c: C.blue, fs: 11, bold: true, dx: 6 });
  P.seg(A[0], A[1], B[0], B[1], { c: C.navy });
  labPts(P, [A, B], ['A', 'B'], { pos: ['nw', 'nw'] });
  P.dot(M[0], M[1], { c: C.green, r: 5.5 }); P.lab(M[0], M[1], 'M(1, 3)', 'se', { c: C.green });

  const eA = [2, 3], eB = [8, 7], eM = mid(eA, eB);
  const e1 = gp([0, 10, 0, 9]); e1.seg(2, 3, 8, 7); labPts(e1, [eA, eB], ['', ''], { pos: ['se', 'nw'] }); e1.lab(2, 3, '(2, 3)', 'se'); e1.lab(8, 7, '(8, 7)', 'nw');
  const e1a = gp([0, 10, 0, 9]); e1a.seg(2, 3, 8, 7); labPts(e1a, [eA, eB], ['', '']); e1a.lab(2, 3, '(2, 3)', 'se'); e1a.lab(8, 7, '(8, 7)', 'nw');
  e1a.dot(eM[0], eM[1], { c: C.green, r: 5.5 }); e1a.lab(eM[0], eM[1], 'M(5, 5)', 'se', { c: C.green });

  const nA = [1, 1], nM = [3, 4], nB = [2 * nM[0] - nA[0], 2 * nM[1] - nA[1]];
  const e2 = gp([0, 7, 0, 8], { W: 260 }); e2.seg(1, 1, 3, 4); labPts(e2, [nA, nM], ['A', 'M'], { pos: ['se', 'w'] });
  e2.text(6.6, 7.4, 'B = ?', { c: C.goldT, fs: 13, bold: true, anchor: 'end' });
  const e2a = gp([0, 7, 0, 8], { W: 260 });
  e2a.seg(1, 1, 3, 1, { c: C.blue, w: 1.6, dash: '5 4' }); e2a.seg(3, 1, 3, 4, { c: C.blue, w: 1.6, dash: '5 4' });
  e2a.seg(3, 4, 5, 4, { c: C.green, w: 1.6, dash: '5 4' }); e2a.seg(5, 4, 5, 7, { c: C.green, w: 1.6, dash: '5 4' });
  e2a.text(2, 1, '+2', { c: C.blue, fs: 11, bold: true, anchor: 'middle', dy: -6 }); e2a.text(3, 2.5, '+3', { c: C.blue, fs: 11, bold: true, dx: 6 });
  e2a.text(4, 4, '+2', { c: C.green, fs: 11, bold: true, anchor: 'middle', dy: -6 }); e2a.text(5, 5.5, '+3', { c: C.green, fs: 11, bold: true, dx: 6 });
  e2a.seg(1, 1, 5, 7); labPts(e2a, [nA, nM], ['A', 'M'], { pos: ['se', 'w'] }); e2a.dot(5, 7, { c: C.green, r: 5.5 }); e2a.lab(5, 7, 'B(5, 7)', 'w', { c: C.green });

  const pA = [1, 1], pB = [9, 5], k = 1 / 4, pP = [pA[0] + k * (pB[0] - pA[0]), pA[1] + k * (pB[1] - pA[1])];
  const e3 = gp([0, 10, 0, 6]); e3.seg(1, 1, 9, 5); labPts(e3, [pA, pB], ['A', 'B'], { pos: ['se', 'nw'] }); e3.text(6.2, 1.2, 'P = ?', { c: C.goldT, fs: 13, bold: true, anchor: 'end' });
  const e3a = gp([0, 10, 0, 6]); e3a.seg(1, 1, 9, 5); [0.25, 0.5, 0.75].forEach(t => e3a.tick(1, 1, 9, 5, t, { c: C.green }));
  labPts(e3a, [pA, pB], ['A', 'B'], { pos: ['se', 'nw'] }); e3a.dot(pP[0], pP[1], { c: C.green, r: 5.5 }); e3a.lab(pP[0], pP[1], 'P(3, 2)', 'nw', { c: C.green });
  e3a.text(2, 1.5, '1 part', { c: C.green, fs: 11, bold: true, anchor: 'start', dy: 18, dx: 4 }); e3a.text(6, 3.5, '3 parts', { c: C.green, fs: 11, bold: true, anchor: 'start', dy: 18, dx: 4 });

  const mA = [-4, 2], mB = [6, 8], mM = mid(mA, mB);
  const mg = gp([-5, 7, -1, 9]); mg.seg(-4, 2, 6, 8); labPts(mg, [mA, mB], ['', ''], {}); mg.lab(-4, 2, '(−4, 2)', 'se'); mg.lab(6, 8, '(6, 8)', 'w');
  const mga = gp([-5, 7, -1, 9]); mga.seg(-4, 2, 6, 8); labPts(mga, [mA, mB], ['', '']); mga.lab(-4, 2, '(−4, 2)', 'se'); mga.lab(6, 8, '(6, 8)', 'w');
  mga.dot(mM[0], mM[1], { c: C.green, r: 5.5 }); mga.lab(mM[0], mM[1], 'M(1, 5)', 'se', { c: C.green });

  const t1A = [-6, 1], t1B = [2, 7], t1M = mid(t1A, t1B);
  const t1 = gp([-7, 3, -1, 8]); t1.seg(-6, 1, 2, 7); t1.dot(-6, 1); t1.dot(2, 7); t1.lab(-6, 1, '(−6, 1)', 'se'); t1.lab(2, 7, '(2, 7)', 'w');
  const t1a = gp([-7, 3, -1, 8]); t1a.seg(-6, 1, 2, 7); t1a.dot(-6, 1); t1a.dot(2, 7); t1a.lab(-6, 1, '(−6, 1)', 'se'); t1a.lab(2, 7, '(2, 7)', 'w'); t1a.dot(t1M[0], t1M[1], { c: C.green, r: 5.5 }); t1a.lab(t1M[0], t1M[1], 'M(−2, 4)', 'se', { c: C.green });
  const t2A = [-1, 3], t2M = [2, 1], t2B = [2 * t2M[0] - t2A[0], 2 * t2M[1] - t2A[1]];
  const t2 = gp([-2, 6, -3, 5]); t2.seg(-1, 3, 2, 1); labPts(t2, [t2A, t2M], ['A', 'M'], { pos: ['ne', 'ne'] }); t2.text(5.6, 4.3, 'B = ?', { c: C.goldT, fs: 13, bold: true, anchor: 'end' });
  const t2a = gp([-2, 6, -3, 5]); t2a.seg(-1, 3, 5, -1); labPts(t2a, [t2A, t2M], ['A', 'M'], { pos: ['ne', 'ne'] }); t2a.dot(5, -1, { c: C.green, r: 5.5 }); t2a.lab(5, -1, 'B(5, −1)', 'nw', { c: C.green });
  const t3A = [0, 0], t3B = [6, 9], t3P = [t3A[0] + (t3B[0] - t3A[0]) / 3, t3A[1] + (t3B[1] - t3A[1]) / 3];
  const t3 = gp([-1, 7, -1, 10], { W: 260 }); t3.seg(0, 0, 6, 9); labPts(t3, [t3A, t3B], ['A', 'B'], { pos: ['se', 'w'] });
  const t3a = gp([-1, 7, -1, 10], { W: 260 }); t3a.seg(0, 0, 6, 9); [1 / 3, 2 / 3].forEach(t => t3a.tick(0, 0, 6, 9, t, { c: C.green })); labPts(t3a, [t3A, t3B], ['A', 'B'], { pos: ['se', 'w'] }); t3a.dot(2, 3, { c: C.green, r: 5.5 }); t3a.lab(2, 3, 'P(2, 3)', 'e', { c: C.green });

  sec('t1', 1, 'Midpoint, Endpoint &amp; Partition', `
${vocab([
  ['segment', 'the straight piece of a line between two points. The two points are its <b>endpoints</b>.'],
  ['midpoint', 'the point exactly halfway between the endpoints.'],
  ['average', 'add the numbers and divide by how many there are. The midpoint averages the x’s and averages the y’s.'],
  ['partition', 'split a segment into parts. A ratio like 1 : 3 means 1 part to 3 parts (4 parts in all).']
])}
<div class="key"><strong>📌 Midpoint = average of the coordinates:</strong> ${MF}. To find a missing endpoint, work backward.</div>
${fig(P.out('midpoint of A and B'), 'Midpoint of A(−2, 1) and B(4, 5) is M(1, 3): go halfway across (+3 of 6) and halfway up (+2 of 4).')}
${widget('seg', { mode: 'mid', A: [-4, -2], B: [4, 2] })}
${howto('How to find a midpoint', ['Add the two x-values. Divide by 2.', 'Add the two y-values. Divide by 2.', 'Write the answer as a point (x, y).'])}
  <div class="example">
    <h4>Midpoint of (2, 3) and (8, 7)</h4>
    ${fig(e1.out('points (2,3) and (8,7)'))}
    <div class="steps" data-example="e81">
      <div class="step" onclick="reveal(this)"><strong>Step 1. Average the x’s:</strong> ${fr('2 + 8', '2')} =<span class="placeholder"> click to reveal</span><span class="hidden-content"> ${fr('10', '2')} = 5</span></div>
      <div class="step" onclick="reveal(this)"><strong>Step 2. Average the y’s:</strong> ${fr('3 + 7', '2')} =<span class="placeholder"> click to reveal</span><span class="hidden-content"> ${fr('10', '2')} = 5</span></div>
      <div class="step final" onclick="reveal(this)"><strong>✓ Average each:</strong> (${fr('2+8', '2')} , ${fr('3+7', '2')}) =<span class="placeholder"> click to reveal</span><span class="hidden-content"> (5, 5)</span></div>
    </div>
    <button class="reveal-all" onclick="revealAll('e81')">Reveal all steps</button>
    <div class="after">${fig(e1a.out('midpoint (5,5)'), 'M(5, 5) is halfway between')}</div>
  </div>
${howto('How to find a missing endpoint', ['Find the jump from the endpoint to the midpoint (change in x, change in y).', 'Make the SAME jump again, starting at the midpoint.', 'Where you land is the other endpoint.'])}
${example('e81b', { title: 'Worked example: A(1, 1) is an endpoint. M(3, 4) is the midpoint. Find B.', fig: fig(e2.out('endpoint A and midpoint M')),
  steps: [['Jump from A to M:', 'x: 1 → 3 is +2. y: 1 → 4 is +3.'], ['Same jump from M:', 'x: 3 + 2 = 5. y: 4 + 3 = 7.'], ['Other endpoint:', 'B(5, 7)']],
  after: fig(e2a.out('B found'), 'Jump +2, +3 twice: A → M → B') })}
${howto('How to partition a segment in a ratio a : b', [`Find the fraction of the way: ${fr('a', 'a + b')}.`, 'Find the change: Δx = x₂ − x₁ and Δy = y₂ − y₁.', 'Multiply each change by the fraction.', 'Add the results to the starting point A.'])}
${example('e81c', { title: 'Worked example: A(1, 1), B(9, 5). Find P so that AP : PB = 1 : 3.', fig: fig(e3.out('segment AB')),
  steps: [['Fraction of the way:', `${fr('1', '1 + 3')} = ${fr('1', '4')}`], ['Changes:', 'Δx = 9 − 1 = 8, Δy = 5 − 1 = 4'], ['Multiply by ¼:', '8 × ¼ = 2, 4 × ¼ = 1'], ['Add to A:', 'P = (1 + 2, 1 + 1) = (3, 2)']],
  after: fig(e3a.out('P found'), 'AB cut into 4 equal parts; P is 1 part from A') })}
${mistake('m81', { who: 'Dev found the midpoint of (−4, 2) and (6, 8):', fig: fig(mg.out('two points')),
  work: ['x: (6 − (−4)) ÷ 2 = 10 ÷ 2 = 5', 'y: (8 − 2) ÷ 2 = 6 ÷ 2 = 3', 'Midpoint: (5, 3)'], bad: 0,
  fbs: ['', 'Step 2 has the same problem, but find the FIRST mistake.', 'Step 3 uses the numbers from Steps 1 and 2.'],
  why: 'The midpoint is an average, so ADD: (−4 + 6) ÷ 2 = 1 and (2 + 8) ÷ 2 = 5. M = (1, 5).', after: fig(mga.out('correct midpoint'), 'Fixed: M(1, 5)') })}
${yt()}
${q('n81a', { n: 1, text: 'Find the midpoint of (−6, 1) and (2, 7).', fig: fig(t1.out('two points')), t: 'pt', a: t1M, ph: '(x, y)',
  traps: [{ v: [-4, 3], m: 'You subtracted. The midpoint ADDS: (−6 + 2) ÷ 2.' }, { v: [-4, 8], m: 'Don’t forget to divide by 2.' }],
  sol: `(${fr('−6 + 2', '2')} , ${fr('1 + 7', '2')}) = (${fr('−4', '2')} , ${fr('8', '2')}) = <b>(−2, 4)</b>`, after: fig(t1a.out('midpoint'), 'M(−2, 4)') })}
${q('n81b', { n: 2, text: 'A(−1, 3) is an endpoint and M(2, 1) is the midpoint. Find the other endpoint B.', fig: fig(t2.out('A and M')), t: 'pt', a: t2B, ph: '(x, y)',
  traps: [{ v: [0.5, 2], m: 'That is the midpoint of A and M. Instead, make the same jump from M again.' }, { v: [3, 4], m: 'Make the jump from A to M, then do it again starting from M.' }],
  sol: 'A → M: x +3, y −2. From M: (2 + 3, 1 − 2) = <b>(5, −1)</b>', after: fig(t2a.out('B'), 'B(5, −1)') })}
${q('n81c', { n: 3, text: 'A(0, 0) and B(6, 9). Find P so that AP : PB = 1 : 2.', fig: fig(t3.out('segment AB')), t: 'pt', a: t3P, ph: '(x, y)',
  traps: [{ v: [3, 4.5], m: 'That is the midpoint (½ of the way). 1 : 2 means ⅓ of the way.' }, { v: [4, 6], m: 'That is ⅔ of the way. P is closer to A: use ⅓.' }],
  sol: `${fr('1', '3')} of the way: (0 + ⅓·6, 0 + ⅓·9) = <b>(2, 3)</b>`, after: fig(t3a.out('P'), 'Three equal parts; P is 1 part from A') })}
`);
}

/* ============ 2. Distance ============ */
{
  const P = gp([-1, 6, -1, 6]);
  P.seg(1, 1, 4, 1, { c: C.blue, w: 2.2, dash: '5 4' }); P.seg(4, 1, 4, 5, { c: C.blue, w: 2.2, dash: '5 4' }); P.right(4, 1, 1, 1, 4, 5, { c: C.blue });
  P.seg(1, 1, 4, 5, { c: C.navy, w: 2.6 });
  P.text(2.5, 1, 'Δx = 3', { c: C.blue, fs: 11, bold: true, anchor: 'middle', dy: 16 }); P.text(4, 3, 'Δy = 4', { c: C.blue, fs: 11, bold: true, dx: 7 });
  P.text(2.3, 3.4, 'd = 5', { c: C.green, fs: 12, bold: true, anchor: 'end' });
  labPts(P, [[1, 1], [4, 5]], ['', ''], { pos: ['w', 'nw'] }); P.lab(1, 1, '(1, 1)', 'w'); P.lab(4, 5, '(4, 5)', 'nw');

  const tri = (A, B, known, o = {}) => {
    const v = o.v; const R = gp(v, { W: o.W });
    R.seg(A[0], A[1], B[0], A[1], { c: known ? C.green : C.gold, w: 2, dash: '5 4' }); R.seg(B[0], A[1], B[0], B[1], { c: known ? C.green : C.gold, w: 2, dash: '5 4' });
    R.right(B[0], A[1], A[0], A[1], B[0], B[1], { c: known ? C.green : C.gold });
    R.seg(A[0], A[1], B[0], B[1], { c: C.navy, w: 2.6 });
    const dx = Math.abs(B[0] - A[0]), dy = Math.abs(B[1] - A[1]);
    const col = known ? C.green : C.goldT;
    let mx = (A[0] + B[0]) / 2; const lo = Math.min(A[0], B[0]), hi = Math.max(A[0], B[0]); if (lo < 0 && hi > 0 && Math.abs(mx) < 1.3) mx = hi >= -lo ? hi / 2 : lo / 2;
  R.text(mx, A[1], 'Δx = ' + (known ? dx : '?'), { c: col, fs: 11, bold: true, anchor: 'middle', dy: B[1] > A[1] ? (A[1] === 0 ? 27 : 16) : -6 });
    R.text(B[0], (A[1] + B[1]) / 2, 'Δy = ' + (known ? dy : '?'), { c: col, fs: 11, bold: true, anchor: B[0] > A[0] ? 'start' : 'end', dx: B[0] > A[0] ? 7 : -7, dy: 4 });
    if (known) { const d = Math.hypot(dx, dy); R.text((A[0] + B[0]) / 2, (A[1] + B[1]) / 2, 'd = ' + (Math.abs(d - Math.round(d)) < 1e-9 ? d : '√' + (dx * dx + dy * dy)), { c: C.green, fs: 12, bold: true, anchor: 'end', dx: -8, dy: -4 }); }
    R.dot(A[0], A[1]); R.dot(B[0], B[1]);
    R.lab(A[0], A[1], '(' + fmt(A[0]) + ', ' + fmt(A[1]) + ')', o.pa || 'w'); R.lab(B[0], B[1], '(' + fmt(B[0]) + ', ' + fmt(B[1]) + ')', o.pb || 'nw');
    return R.out('distance between two points');
  };
  sec('t2', 2, 'Distance Formula', `
${vocab([
  ['Δ (“delta”)', 'means “change in.” Δx is the change in x (how far across). Δy is the change in y (how far up or down).'],
  ['legs', 'the two sides of a right triangle that make the square corner.'],
  ['hypotenuse', 'the longest side of a right triangle, across from the square corner. Here it is the distance d.'],
  ['√ (square root)', 'the number that times itself gives the number inside. √25 = 5 because 5 × 5 = 25.']
])}
<div class="key"><strong>📌</strong> ${DF} — the Pythagorean Theorem on the plane: legs Δx and Δy, hypotenuse d.</div>
${fig(P.out('distance from (1,1) to (4,5)'), 'From (1,1) to (4,5): legs 3 and 4 → d = 5')}
${widget('seg', { mode: 'dist', A: [-3, -2], B: [3, 2] })}
${howto('How to find the distance between two points', ['Find Δx: subtract the x-values. (Watch for minus a negative!)', 'Find Δy: subtract the y-values.', 'Square both. Add them.', 'Take the square root. That is d.'])}
${example('e82', { title: 'Distance between (1, 2) and (4, 6)', fig: fig(tri([1, 2], [4, 6], false, { v: [-1, 6, -1, 7] })),
  steps: [['Δx = 3, Δy = 4:', '√(3² + 4²) = √(9 + 16) = √25'], ['d =', '5']],
  after: fig(tri([1, 2], [4, 6], true, { v: [-1, 6, -1, 7] }), 'Legs 3 and 4, hypotenuse 5') })}
${example('e82b', { title: 'Worked example: distance between (−2, −1) and (4, 2)', fig: fig(tri([-2, -1], [4, 2], false, { v: [-3, 6, -2, 4] })),
  steps: [['Δx:', '4 − (−2) = 4 + 2 = 6'], ['Δy:', '2 − (−1) = 3'], ['Square and add:', '6² + 3² = 36 + 9 = 45'], ['Square root:', `d = √45 ≈ 6.71`]],
  after: fig(tri([-2, -1], [4, 2], true, { v: [-3, 6, -2, 4] }), 'd = √45 ≈ 6.71 (not a whole number — that is OK)') })}
${mistake('m82', { who: 'Mia found the distance from (−1, 2) to (3, 5):', fig: fig(tri([-1, 2], [3, 5], false, { v: [-2, 4, -1, 6] })),
  work: ['Δx = 3 − 1 = 2', 'Δy = 5 − 2 = 3', 'd = √(2² + 3²) = √13'], bad: 0,
  fbs: ['', 'Step 2 is right: 5 − 2 = 3.', 'Step 3 uses Δx from Step 1. Find the first mistake.'],
  why: 'Subtracting a negative: 3 − (−1) = 3 + 1 = 4. Then d = √(16 + 9) = √25 = 5.', after: fig(tri([-1, 2], [3, 5], true, { v: [-2, 4, -1, 6] }), 'Fixed: Δx = 4, d = 5') })}
${yt()}
${q('n82a', { n: 1, text: 'Find the distance between (−3, −2) and (3, 6).', fig: fig(tri([-3, -2], [3, 6], false, { v: [-4, 4, -3, 7], W: 260 })), t: 'num', a: 10, sq: true, ph: 'd = ?',
  traps: [{ v: 14, m: 'You added Δx + Δy. Square them, add, then take the square root.' }],
  sol: 'Δx = 6, Δy = 8. d = √(36 + 64) = √100 = <b>10</b>', after: fig(tri([-3, -2], [3, 6], true, { v: [-4, 4, -3, 7], W: 260 })) })}
${q('n82b', { n: 2, text: 'Find the distance between (2, −1) and (5, 3).', fig: fig(tri([2, -1], [5, 3], false, { v: [0, 7, -2, 4] })), t: 'num', a: 5, sq: true, ph: 'd = ?',
  traps: [{ v: Math.sqrt(13), m: 'Check Δy: 3 − (−1) = 4, not 2.' }],
  sol: 'Δx = 3, Δy = 4. d = √(9 + 16) = √25 = <b>5</b>', after: fig(tri([2, -1], [5, 3], true, { v: [0, 7, -2, 4] })) })}
${q('n82c', { n: 3, text: 'Find the distance between (0, 0) and (2, 3). Give the exact answer (like sqrt(13)) or round to 2 decimals.', fig: fig(tri([0, 0], [2, 3], false, { v: [-1, 4, -1, 4], W: 240, pa: 'nw' })), t: 'num', a: Math.sqrt(13), tol: 0.002, sq: true, ph: 'd = ?',
  traps: [{ v: 5, m: 'You added 2 + 3. Square first: 2² + 3² = 4 + 9 = 13. Then take √.' }],
  sol: 'd = √(2² + 3²) = √(4 + 9) = <b>√13 ≈ 3.61</b>', after: fig(tri([0, 0], [2, 3], true, { v: [-1, 4, -1, 4], W: 240, pa: 'nw' })) })}
`);
}

/* ============ 3. Perimeter & area ============ */
{
  const R = [[1, 1], [6, 1], [6, 4], [1, 4]];
  const rect = (pts, v, known, o = {}) => {
    const P = gp(v, { W: o.W }); const cen = [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
    P.poly(pts, { c: C.navy, fill: C.navy, op: 0.08 });
    pts.forEach((p, i) => { const qq = pts[(i + 1) % pts.length]; const L = o.sides ? o.sides[i] : null; if (L) sideLab(P, p, qq, L, cen, { c: String(L).includes('?') ? C.goldT : known ? C.green : C.navy }); });
    if (o.inside) P.text(cen[0], cen[1], o.inside, { c: known ? C.green : C.goldT, fs: 13, bold: true, anchor: 'middle', dy: 4 });
    labPts(P, pts, o.names || pts.map(() => ''), { coords: o.coords !== false, fs: 11 });
    if (o.right) o.right.forEach(i => { const p = pts[i], a = pts[(i + pts.length - 1) % pts.length], b = pts[(i + 1) % pts.length]; P.right(p[0], p[1], a[0], a[1], b[0], b[1], { c: known ? C.green : C.muted }); });
    return P.out('figure on the coordinate plane');
  };
  const T = [[1, 1], [7, 1], [7, 9]];
  const tA = [[0, 0], [4, 0], [4, 6]];
  const yr = [[-2, -1], [4, -1], [4, 3], [-2, 3]];
  const yt3 = [[0, 0], [4, 0], [0, 3]];
  sec('t3', 3, 'Perimeter &amp; Area on the Plane', `
${vocab([
  ['perimeter', 'the distance all the way around a figure. Add all the side lengths.'],
  ['area', 'the space inside a figure, in square units.'],
  ['base and height', 'for a triangle, the height must make a square corner with the base.']
])}
<div class="key"><strong>📌</strong> Use the distance formula for side lengths, then apply the area formula (rectangle, triangle, etc.). <b>Perimeter</b> = add all the sides.</div>
${howto('How to find perimeter and area from coordinates', ['Plot the points and connect them in order.', 'Find each side length. Count if the side is flat or straight up. Use the distance formula if it slants.', 'Perimeter: add all the sides.', `Area: rectangle = length × width. Triangle = ${fr('1', '2')} × base × height.`, 'Write square units for area.'])}
  <div class="example">
    <h4>A rectangle has width 5 and height 3. Find its area.</h4>
    ${fig(rect(R, [0, 7, 0, 5], false, { sides: ['5', '3', '', ''], names: ['A', 'B', 'C', 'D'], right: [0, 1, 2, 3] }), 'For example, the rectangle A(1, 1), B(6, 1), C(6, 4), D(1, 4)')}
    <div class="steps" data-example="e83">
      <div class="step" onclick="reveal(this)"><strong>Step 1. Count the sides:</strong> AB from x = 1 to x = 6, BC from y = 1 to y = 4 →<span class="placeholder"> click to reveal</span><span class="hidden-content"> width 5, height 3</span></div>
      <div class="step" onclick="reveal(this)"><strong>Step 2. Perimeter = 5 + 3 + 5 + 3 =</strong><span class="placeholder"> click to reveal</span><span class="hidden-content"> 16 units</span></div>
      <div class="step final" onclick="reveal(this)"><strong>✓ Area = w · h = 5 · 3 =</strong><span class="placeholder"> click to reveal</span><span class="hidden-content"> 15 square units</span></div>
    </div>
    <button class="reveal-all" onclick="revealAll('e83')">Reveal all steps</button>
    <div class="after">${fig(rect(R, [0, 7, 0, 5], true, { sides: ['5', '3', '5', '3'], names: ['A', 'B', 'C', 'D'], inside: 'Area = 15', right: [0, 1, 2, 3] }), '15 unit squares fit inside')}</div>
  </div>
${example('e83b', { title: 'Worked example: triangle A(1, 1), B(7, 1), C(7, 9). Find the perimeter and area.', fig: fig(rect(T, [0, 8, 0, 10], false, { names: ['A', 'B', 'C'], sides: ['', '', ''], right: [1] }, ), ''),
  steps: [['AB (flat): count', '7 − 1 = 6'], ['BC (straight up): count', '9 − 1 = 8'], ['AC (slants): distance formula', '√(6² + 8²) = √100 = 10'], ['Perimeter:', '6 + 8 + 10 = 24 units'], [`Area = ${fr('1', '2')} × base × height =`, '½ × 6 × 8 = 24 square units']],
  after: fig(rect(T, [0, 8, 0, 10], true, { names: ['A', 'B', 'C'], sides: ['6', '8', '10'], right: [1], inside: '' }), 'Sides 6, 8, 10') })}
${mistake('m83', { who: 'Leo found the area of the triangle (0, 0), (4, 0), (4, 6):', fig: fig(rect(tA, [-1, 5, -1, 7], false, { sides: ['', '', ''], right: [1] })),
  work: ['base = 4 − 0 = 4', 'height = 6 − 0 = 6', 'Area = 4 × 6 = 24 square units'], bad: 2,
  fbs: ['Step 1 is right.', 'Step 2 is right: the height makes a square corner with the base.', ''],
  why: `A triangle is half of a rectangle. Area = ${fr('1', '2')} × 4 × 6 = 12 square units.`, after: fig(rect(tA, [-1, 5, -1, 7], true, { sides: ['4', '6', ''], right: [1], inside: '' }), 'Half of the 4 × 6 rectangle: 12') })}
${yt()}
${fig(rect(yr, [-3, 5, -2, 4], false, { names: ['P', 'Q', 'R', 'S'], sides: ['', '', '', ''] }), 'Rectangle P(−2, −1), Q(4, −1), R(4, 3), S(−2, 3)')}
${q('n83a', { n: 1, text: 'Find the perimeter of rectangle PQRS.', t: 'num', a: 20, ph: 'perimeter = ?', traps: [{ v: 24, m: '24 is the area. Perimeter adds the sides: 6 + 4 + 6 + 4.' }, { v: 10, m: 'A rectangle has 4 sides. Add all four: 6 + 4 + 6 + 4.' }],
  sol: 'PQ = 4 − (−2) = 6, QR = 3 − (−1) = 4. Perimeter = 6 + 4 + 6 + 4 = <b>20 units</b>', after: fig(rect(yr, [-3, 5, -2, 4], true, { names: ['P', 'Q', 'R', 'S'], coords: false, sides: ['6', '4', '6', '4'] })) })}
${q('n83b', { n: 2, text: 'Find the area of rectangle PQRS.', t: 'num', a: 24, ph: 'area = ?', traps: [{ v: 20, m: '20 is the perimeter. Area multiplies: 6 × 4.' }, { v: 8, m: 'Check the width: from x = −2 to x = 4 is 6 units, not 2.' }],
  sol: '6 × 4 = <b>24 square units</b>', after: fig(rect(yr, [-3, 5, -2, 4], true, { names: ['P', 'Q', 'R', 'S'], coords: false, sides: ['6', '4', '', ''], inside: 'Area = 24' })) })}
${fig(rect(yt3, [-1, 5, -1, 4], false, { names: ['A', 'B', 'C'], sides: ['', '?', ''], right: [0] }), 'Triangle A(0, 0), B(4, 0), C(0, 3)')}
${q('n83c', { n: 3, text: 'Find the perimeter of triangle ABC. (Hint: find BC with the distance formula.)', t: 'num', a: 4 + 3 + 5, ph: 'perimeter = ?', traps: [{ v: 7, m: 'Don’t forget the slanted side BC. BC = √(4² + 3²) = 5.' }, { v: 6, m: '6 is the area. Perimeter adds the three sides.' }],
  sol: 'AB = 4, AC = 3, BC = √(16 + 9) = 5. Perimeter = 4 + 3 + 5 = <b>12 units</b>', after: fig(rect(yt3, [-1, 5, -1, 4], true, { names: ['A', 'B', 'C'], coords: false, sides: ['4', '5', '3'], right: [0] })) })}
${q('n83d', { n: 4, text: 'Find the area of triangle ABC.', t: 'num', a: 6, ph: 'area = ?', traps: [{ v: 12, m: 'A triangle is half of a rectangle. Multiply by ½.' }, { v: 10, m: 'Use base × height (the two sides that make the square corner), not the slanted side.' }],
  sol: '½ × 4 × 3 = <b>6 square units</b>', after: fig(rect(yt3, [-1, 5, -1, 4], true, { names: ['A', 'B', 'C'], coords: false, sides: ['4', '', '3'], right: [0], inside: '' })) })}
`);
}

/* ============ 4. Parallel & perpendicular slopes ============ */
{
  const P = gp([-2, 6, -2, 6]);
  P.line(2, -1, { c: C.navy }); P.line(2, 2, { c: C.blue }); P.line(-0.5, 3, { c: C.green });
  P.text(4.0, 5.3, 'm = 2', { c: C.navy, fs: 12, bold: true, anchor: 'start' });
  P.text(-1.1, 4.4, 'm = 2', { c: C.blue, fs: 12, bold: true, anchor: 'end' });
  P.text(5.9, 1.9, 'm = −½', { c: C.green, fs: 12, bold: true, anchor: 'end' });
  const rr = (A, B, known, v, o = {}) => {
    const R = gp(v, { W: o.W }); const [n, d] = slopeND(A, B);
    R.seg(A[0], A[1], B[0], A[1], { c: known ? C.green : C.gold, w: 2, dash: '5 4' }); R.seg(B[0], A[1], B[0], B[1], { c: known ? C.green : C.gold, w: 2, dash: '5 4' });
    R.seg(A[0], A[1], B[0], B[1], { c: C.navy, w: 2.6 });
    const col = known ? C.green : C.goldT;
    R.text((A[0] + B[0]) / 2, A[1], 'run = ' + (known ? fmt(d) : '?'), { c: col, fs: 11, bold: true, anchor: 'middle', dy: n > 0 ? 16 : -6 });
    R.text(B[0], (A[1] + B[1]) / 2, 'rise = ' + (known ? fmt(n) : '?'), { c: col, fs: 11, bold: true, anchor: d > 0 ? 'start' : 'end', dx: d > 0 ? 7 : -7, dy: 4 });
    R.dot(A[0], A[1]); R.dot(B[0], B[1]); R.lab(A[0], A[1], pt(A[0], A[1]), o.pa || 'w'); R.lab(B[0], B[1], pt(B[0], B[1]), o.pb || 'w');
    if (known && o.perp) { R.line(o.perp[0], o.perp[1], { c: C.green, dash: '7 5' }); }
    return R.out('slope triangle');
  };
  const sv = (m, v) => { const R = gp(v); R.line(m[0] / m[1], 0, { c: C.navy }); R.seg(0, 0, m[1], 0, { c: C.navy, w: 1.6, dash: '4 3' }); R.seg(m[1], 0, m[1], m[0], { c: C.navy, w: 1.6, dash: '4 3' }); R.text(m[1] / 2, 0, 'run ' + m[1], { fs: 11, bold: true, anchor: 'middle', dy: 16 }); R.text(m[1], m[0] / 2, 'rise ' + m[0], { fs: 11, bold: true, dx: 6 }); return R; };
  const nb = slopeND([-2, 1], [2, 3]), nbm = nb[0] / nb[1];
  const rq = F.recipe({ a: 'm', b: '?', c: '?', foot: 'Start with your slope from Question 1', aria: 'flip the slope, then change its sign' });
  const fs2 = (n, d) => { const g = Math.abs(gcd(n, d)); n /= g; d /= g; if (d < 0) { n = -n; d = -d; } return d === 1 ? fmt(n) : (n < 0 ? '−' : '') + Math.abs(n) + '/' + d; };
  const rqA = F.recipe({ a: fs2(nb[0], nb[1]), b: fs2(nb[1], nb[0]), c: fs2(-nb[1], nb[0]), foot: 'perpendicular slope = ' + fs2(-nb[1], nb[0]), aria: 'perpendicular slope steps' });
  const pc = { m: -3, b: 5 };
  const dc = F.decoder([{ t: 'y = ' }, { t: '−3x', lab: 'm = ?', c: 'gold' }, { t: ' + 5', lab: 'b = 5' }], { aria: 'equation y = −3x + 5' });
  const gc = gp([-3, 4, -2, 7]); gc.line(pc.m, pc.b, { c: C.navy }); gc.line(pc.m, 1, { c: C.green, dash: '7 5' });
  gc.text(1.1, 2.1, 'y = −3x + 5', { c: C.navy, fs: 12, bold: true, anchor: 'start', dx: 4 }); gc.text(-2.8, -1.45, 'same slope ' + fmt(pc.m), { c: C.green, fs: 12, bold: true, anchor: 'start' });
  const m1 = sv([3, 4], [-5, 5, -5, 5]);
  const m1a = sv([3, 4], [-5, 5, -5, 5]); m1a.line(-4 / 3, 0, { c: C.green }); m1a.right(0, 0, 4, 3, -3, 4, { c: C.green }); m1a.text(-4.8, 1.6, 'm = −⁴⁄₃', { c: C.green, fs: 12, bold: true, anchor: 'start' });
  sec('t4', 4, 'Parallel &amp; Perpendicular Slopes', `
${vocab([
  ['slope (m)', 'how steep a line is: rise ÷ run. ' + SF + '.'],
  ['parallel', 'lines that never meet. They have the SAME slope.'],
  ['perpendicular', 'lines that meet at a right angle (a square corner).'],
  ['opposite reciprocal', 'flip the fraction AND change the sign. The opposite reciprocal of ⅔ is −³⁄₂. Their product is −1.']
])}
<div class="key"><strong>📌 Parallel → SAME slope.</strong> <strong>Perpendicular → OPPOSITE RECIPROCAL</strong> slopes (their product is −1).</div>
${fig(P.out('parallel and perpendicular lines'), 'Two parallel lines (slope 2) and a perpendicular one (slope −½)')}
${widget('slope')}
${howto('How to find slopes', [`Slope from two points: ${SF}.`, 'Parallel slope: keep the same number.', 'Perpendicular slope: flip the fraction, then change the sign.', 'Check perpendicular: multiply the two slopes. You should get −1.'])}
${example('e84', { title: 'Worked example: the line through (1, 2) and (4, 8)', fig: fig(rr([1, 2], [4, 8], false, [-1, 6, -1, 9])),
  steps: [['Slope:', `${fr('8 − 2', '4 − 1')} = ${fr('6', '3')} = 2`], ['Parallel slope:', '2 (same)'], ['Perpendicular slope:', `flip ${fr('2', '1')} → ${fr('1', '2')}, change sign → −½`], ['Check:', '2 × (−½) = −1 ✓']],
  after: fig(rr([1, 2], [4, 8], true, [-1, 6, -1, 9]), 'rise 6, run 3: slope 2') })}
<p class="blank-tip">A line has slope 3. A line perpendicular to it has slope <span class="blank" data-ans="−1/3" onclick="rb(this)">?</span>.</p>
${mistake('m84', { who: 'Ana found the slope perpendicular to m = ¾:', fig: fig(m1.out('line with slope three fourths')),
  work: ['Given slope: ¾', 'Flip it: ⁴⁄₃', 'Perpendicular slope: ⁴⁄₃'], bad: 2,
  fbs: ['Step 1 is right.', 'Step 2 is right — flipping is half the job.', ''],
  why: 'Flip AND change the sign. ¾ is positive, so the perpendicular slope is −⁴⁄₃. Check: ¾ × (−⁴⁄₃) = −1.', after: fig(m1a.out('perpendicular'), 'The green line makes a square corner') })}
${yt()}
${q('n84a', { n: 1, text: 'Find the slope of the line through (−2, 1) and (2, 3).', fig: fig(rr([-2, 1], [2, 3], false, [-3, 3, -1, 4])), t: 'num', a: 2 / 4, ph: 'm = ?',
  traps: [{ v: 2, m: 'That is run ÷ rise. Slope is RISE ÷ run: 2 ÷ 4.' }, { v: -0.5, m: 'The line goes up from left to right, so the slope is positive.' }],
  sol: `${fr('3 − 1', '2 − (−2)')} = ${fr('2', '4')} = <b>½</b>`, after: fig(rr([-2, 1], [2, 3], true, [-3, 3, -1, 4])) })}
${q('n84b', { n: 2, text: 'What is the slope of a line perpendicular to that line?', t: 'num', a: -2, ph: 'm = ?',
  traps: [{ v: 2, m: 'You flipped ½ to 2. Now change the sign too.' }, { v: -0.5, m: 'You changed the sign. Now flip the fraction too.' }, { v: 0.5, m: '½ is the parallel slope. Perpendicular: flip and change the sign.' }],
  fig: fig(rq, 'Perpendicular: flip the fraction, then change the sign.'),
  sol: 'Flip ½ → 2. Change sign → <b>−2</b>. Check: ½ × (−2) = −1 ✓', after: fig(rqA, `${fr('1', '2')} → 2 → −2. Check: ${fr('1', '2')} × (−2) = −1`) })}
${q('n84c', { n: 3, text: 'What is the slope of a line parallel to y = −3x + 5?', t: 'num', a: -3, ph: 'm = ?',
  traps: [{ v: 5, m: '5 is the y-intercept b. The slope is the number in front of x.' }, { v: 1 / 3, m: '⅓ is the perpendicular slope. Parallel keeps the SAME slope.' }],
  fig: fig(dc, 'In y = mx + b, m is the slope.'),
  sol: 'Same slope: <b>−3</b>', after: fig(gc.out('two parallel lines with slope −3'), 'Parallel lines: same slope, they never meet') })}
`);
}

/* ============ 5. Equations ============ */
{
  const g = (lines, pts, v) => { const R = gp(v); lines.forEach(l => R.line(l.m, l.b, { c: l.c, w: l.w || 2.6, dash: l.dash })); (pts || []).forEach(p => { R.dot(p[0], p[1], { c: p[3] || C.navy }); R.lab(p[0], p[1], p[2], p[4] || 'e', { c: p[3] === C.green ? C.green : C.navy, fs: 11 }); }); return R; };
  const a = g([{ m: 2, b: -5, c: C.navy }, { m: 2, b: 1, c: C.green }], [[0, 1, '(0, 1)', C.navy, 'se']], [-4, 5, -6, 6]);
  a.text(3.8, 1.6, 'given', { c: C.navy, fs: 11, bold: true, anchor: 'start' }); a.text(2.4, 5.2, 'y = 2x + 1', { c: C.green, fs: 12, bold: true, anchor: 'start', dx: 6 });
  const b = g([{ m: 2, b: -5, c: C.navy }, { m: -0.5, b: 1, c: C.green }], [[0, 1, '(0, 1)', C.navy, 'ne']], [-4, 5, -6, 6]);
  b.right(2.4, -0.2, 0, -5, 0, 1, { c: C.green }); b.text(-3.8, 3.6, 'y = −½x + 1', { c: C.green, fs: 12, bold: true, anchor: 'start' });
  const a0 = g([{ m: 2, b: -5, c: C.navy }], [[0, 1, '(0, 1)', C.gold, 'se']], [-4, 5, -6, 6]);
  a0.seg(0.5, -4, 1.5, -4, { c: C.navy, w: 1.8, dash: '4 3' }); a0.seg(1.5, -4, 1.5, -2, { c: C.navy, w: 1.8, dash: '4 3' });
  a0.text(1.2, -4, 'run 1', { fs: 12, bold: true, anchor: 'middle', dy: 17 }); a0.text(1.5, -3, 'rise 2', { fs: 12, bold: true, dx: 6, dy: 4 });
  a0.text(3.8, 4.4, 'y = 2x − 5', { c: C.navy, fs: 12, bold: true, anchor: 'end', dx: -8 });
  const rb = F.recipe({ a: '2', b: '?', c: '?', foot: 'slope of the new line', aria: 'flip 2 and change its sign' });
  const c0 = g([{ m: 2, b: -5, c: C.navy }], [[2, 3, '(2, 3)', C.navy, 'w']], [-2, 6, -2, 6]);
  const c1 = g([{ m: 2, b: -5, c: C.navy }, { m: -0.5, b: 4, c: C.green }], [[2, 3, '(2, 3)', C.navy, 'ne']], [-2, 6, -2, 6]);
  c1.text(5.8, -1.4, 'y = −½x + 4', { c: C.green, fs: 12, bold: true, anchor: 'end' });
  const mg = g([{ m: 3, b: 1, c: C.navy }], [[1, 7, '(1, 7)', C.navy, 'w']], [-3, 4, -2, 10]);
  const mga = g([{ m: 3, b: 1, c: C.navy }, { m: 3, b: 4, c: C.green }], [[1, 7, '(1, 7)', C.navy, 'w']], [-3, 4, -2, 10]); mga.text(1.6, 9.4, 'y = 3x + 4', { c: C.green, fs: 12, bold: true, anchor: 'start' });
  const t1 = g([{ m: -2, b: 3, c: C.navy }], [[1, 4, '(1, 4)', C.navy, 'e']], [-3, 5, -3, 7]);
  const t1a = g([{ m: -2, b: 3, c: C.navy }, { m: -2, b: 6, c: C.green }], [[1, 4, '(1, 4)', C.navy, 'e']], [-3, 5, -3, 7]); t1a.text(4.8, 3.5, 'y = −2x + 6', { c: C.green, fs: 12, bold: true, anchor: 'end' });
  const t2 = g([{ m: 1 / 3, b: -2, c: C.navy }], [[1, 1, '(1, 1)', C.navy, 'nw']], [-3, 5, -4, 5]);
  const t2a = g([{ m: 1 / 3, b: -2, c: C.navy }, { m: -3, b: 4, c: C.green }], [[1, 1, '(1, 1)', C.navy, 'ne']], [-3, 5, -4, 5]); t2a.text(-0.2, 4.4, 'y = −3x + 4', { c: C.green, fs: 12, bold: true, anchor: 'end', dx: -6 });
  sec('t5', 5, 'Equations of Parallel/Perp Lines', `
${vocab([['y = mx + b', 'slope-intercept form. m is the slope. b is the y-intercept (where the line crosses the y-axis).']])}
<div class="key"><strong>📌</strong> Keep the slope (parallel) or take the opposite reciprocal (perpendicular), then write the equation through the given point.</div>
${howto('How to write the equation', ['Find the slope of the given line (the number in front of x).', 'Parallel: keep it. Perpendicular: flip it and change the sign.', 'Put the point (x, y) and the new slope into y = mx + b.', 'Solve for b.', 'Write y = mx + b with your m and b.'])}
  <div class="example">
    <h4>Line through (0, 1) parallel to y = 2x − 5</h4>
    ${fig(a0.out('the line y = 2x − 5 and the point (0, 1)'), 'Given line (slope 2) and the point (0, 1) the new line must go through')}
    <div class="steps" data-example="e85">
      <div class="step final" onclick="reveal(this)"><strong>Parallel → same slope m = 2; through (0,1) → b = 1:</strong><span class="placeholder"> click to reveal</span><span class="hidden-content"> y = 2x + 1</span></div>
    </div>
    <button class="reveal-all" onclick="revealAll('e85')">Reveal all steps</button>
    <div class="after">${fig(a.out('parallel line'), 'Same slope, so the lines never meet')}</div>
  </div>
  <div class="example">
    <h4>Line through (0, 1) perpendicular to y = 2x − 5</h4>
    ${fig(rb, 'The given slope is 2 (the number in front of x). Flip it and change the sign.')}
    <div class="steps" data-example="e85b">
      <div class="step final" onclick="reveal(this)"><strong>Perpendicular → slope = −½; through (0,1):</strong><span class="placeholder"> click to reveal</span><span class="hidden-content"> y = −½x + 1</span></div>
    </div>
    <button class="reveal-all" onclick="revealAll('e85b')">Reveal all steps</button>
    <div class="after">${fig(b.out('perpendicular line'), 'The lines meet at a square corner')}</div>
  </div>
${example('e85c', { title: 'Worked example: line through (2, 3) perpendicular to y = 2x − 5 (the point is NOT on the y-axis)', fig: fig(c0.out('given line and point')),
  steps: [['Given slope:', '2'], ['Perpendicular slope:', '−½'], ['Put in the point:', '3 = −½(2) + b → 3 = −1 + b'], ['Solve for b:', 'b = 4'], ['Equation:', 'y = −½x + 4']],
  after: fig(c1.out('perpendicular through (2,3)'), 'y = −½x + 4 goes through (2, 3)') })}
${mistake('m85', { who: 'Ben wrote the line through (1, 7) parallel to y = 3x + 1:', fig: fig(mg.out('given line and point')),
  work: ['Parallel, so m = 3.', '7 = 3(1) + b', 'b = 10', 'y = 3x + 10'], bad: 2,
  fbs: ['Step 1 is right.', 'Step 2 is right: put x = 1, y = 7 into y = mx + b.', '', 'Step 4 uses b from Step 3. Find the first mistake.'],
  why: '7 = 3 + b. Subtract 3 from both sides: b = 4. The line is y = 3x + 4.', after: fig(mga.out('fixed line'), 'Fixed: y = 3x + 4 goes through (1, 7)') })}
${yt()}
${q('n85a', { n: 1, text: 'Write the equation of the line through (1, 4) parallel to y = −2x + 3.', fig: fig(t1.out('given line and point')), t: 'line', a: { m: -2, b: 6 }, ph: 'y = mx + b',
  sol: '4 = −2(1) + b → b = 6 → <b>y = −2x + 6</b>', after: fig(t1a.out('answer line'), 'y = −2x + 6') })}
${q('n85b', { n: 2, text: 'Write the equation of the line through (1, 1) perpendicular to y = ⅓x − 2.', fig: fig(t2.out('given line and point')), t: 'line', a: { m: -3, b: 4 }, ph: 'y = mx + b',
  sol: 'Perpendicular slope: −3. 1 = −3(1) + b → b = 4 → <b>y = −3x + 4</b>', after: fig(t2a.out('answer line'), 'y = −3x + 4') })}
`);
}

/* ============ 6. Classify ============ */
{
  const quad = (pts, names, v, known, o = {}) => {
    const R = gp(v, { W: o.W }); const cen = [pts.reduce((s, p) => s + p[0], 0) / 4, pts.reduce((s, p) => s + p[1], 0) / 4];
    R.poly(pts, { c: C.navy, fill: C.navy, op: 0.08 });
    if (known && o.labels) pts.forEach((p, i) => { const qq = pts[(i + 1) % 4]; sideLab(R, p, qq, o.labels[i], cen, { c: C.green, fs: 11 }); });
    if (known && o.right) pts.forEach((p, i) => R.right(p[0], p[1], pts[(i + 3) % 4][0], pts[(i + 3) % 4][1], pts[(i + 1) % 4][0], pts[(i + 1) % 4][1], { c: C.green }));
    labPts(R, pts, names, { fs: 11, coords: o.coords !== false });
    return R.out('quadrilateral');
  };
  const sl = (p, q) => { const [n, d] = slopeND(p, q); return d === 0 ? 'undef.' : 'm = ' + require('./u8common.js').ftxt(n, d); };
  const sq = [[1, 1], [4, 1], [4, 4], [1, 4]];
  const ex = [[1, 0], [4, 1], [3, 4], [0, 3]];
  const rh = [[0, 0], [3, 1], [4, 4], [1, 3]];
  const pa = [[0, 0], [4, 0], [5, 3], [1, 3]];
  const tz = [[0, 0], [6, 0], [4, 3], [1, 3]];
  const flow = `<div class="flow">
<div class="fb">1. Find the slope of all 4 sides.</div><div class="ar">↓</div>
<div class="fb q">Are BOTH pairs of opposite sides parallel (same slope)?</div>
<div class="row"><div><div class="ar">no, only one pair ↓</div><div class="fb r">Trapezoid</div></div><div><div class="ar">yes ↓</div><div class="fb r">Parallelogram</div></div></div>
<div class="ar">then ask ↓</div>
<div class="row"><div class="fb q">Do neighbor sides multiply to −1 (right angles)?</div><div class="fb q">Are all 4 sides equal (distance formula)?</div></div>
<div class="row"><div><div class="ar">yes ↓</div><div class="fb r">Rectangle</div></div><div><div class="ar">yes ↓</div><div class="fb r">Rhombus</div></div></div>
<div class="ar">both yes ↓</div><div class="fb r">Square</div></div>`;
  sec('t6', 6, 'Classifying Polygons', `
${vocab([
  ['quadrilateral', 'a shape with 4 sides.'],
  ['parallelogram', 'both pairs of opposite sides are parallel.'],
  ['rectangle', 'a parallelogram with 4 right angles.'],
  ['rhombus', 'a parallelogram with 4 equal sides.'],
  ['square', 'a rectangle AND a rhombus: 4 right angles and 4 equal sides.'],
  ['trapezoid', 'exactly one pair of parallel sides.']
])}
<div class="key"><strong>📌</strong> Use <strong>slope</strong> (parallel/perpendicular sides) and <strong>distance</strong> (equal sides) from only the coordinates. Right angles + equal sides → square.</div>
${fig(quad(sq, ['A', 'B', 'C', 'D'], [-1, 6, -1, 6], true, { labels: ['3', '3', '3', '3'], right: true }), 'All 4 sides equal (3) and all right angles → a square')}
${figHtml(flow, 'Decision steps for classifying a quadrilateral')}
${howto('How to classify a quadrilateral from its corners', ['Find the slope of each side: AB, BC, CD, DA.', 'Opposite sides with equal slopes are parallel.', 'Neighbor sides whose slopes multiply to −1 are perpendicular (right angle).', 'Use the distance formula to compare side lengths.', 'Use the decision steps above to name it.'])}
${example('e86', { title: 'Worked example: A(1, 0), B(4, 1), C(3, 4), D(0, 3)', fig: fig(quad(ex, ['A', 'B', 'C', 'D'], [-1, 5, -1, 5], false)),
  steps: [['Slopes:', 'AB = ⅓, BC = −3, CD = ⅓, DA = −3'], ['Parallel?', 'AB ∥ CD and BC ∥ DA → parallelogram'], ['Right angles?', '⅓ × (−3) = −1 → yes, a rectangle'], ['Side lengths:', 'AB = √(9 + 1) = √10, BC = √(1 + 9) = √10 … all √10'], ['Name it:', 'right angles + equal sides → a square']],
  after: fig(quad(ex, ['A', 'B', 'C', 'D'], [-1, 5, -1, 5], true, { labels: [sl(ex[0], ex[1]), sl(ex[1], ex[2]), sl(ex[2], ex[3]), sl(ex[3], ex[0])], right: true }), 'Slopes ⅓ and −3 multiply to −1') })}
${example('e86b', { title: 'Worked example: A(0, 0), B(3, 1), C(4, 4), D(1, 3)', fig: fig(quad(rh, ['A', 'B', 'C', 'D'], [-1, 5, -1, 5], false)),
  steps: [['Slopes:', 'AB = ⅓, BC = 3, CD = ⅓, DA = 3 → parallelogram'], ['Right angles?', '⅓ × 3 = 1, not −1 → no right angles'], ['Side lengths:', 'all four are √10 → equal'], ['Name it:', 'a rhombus (not a square)']],
  after: fig(quad(rh, ['A', 'B', 'C', 'D'], [-1, 5, -1, 5], true, { labels: ['√10', '√10', '√10', '√10'] }), 'Four equal sides, no right angles: rhombus') })}
${mistake('m86', { who: 'Kim classified P(0, 0), Q(4, 0), R(5, 3), S(1, 3):', fig: fig(quad(pa, ['P', 'Q', 'R', 'S'], [-1, 6, -1, 4], false)),
  work: ['PQ: m = 0 and SR: m = 0 → parallel', 'QR: m = 3 and PS: m = 3 → parallel', 'Both pairs are parallel, so PQRS is a rectangle.'], bad: 2,
  fbs: ['Step 1 is right.', 'Step 2 is right.', ''],
  why: 'Parallel sides only prove a parallelogram. A rectangle also needs right angles, and 0 × 3 is not −1. PQRS is a parallelogram.', after: fig(quad(pa, ['P', 'Q', 'R', 'S'], [-1, 6, -1, 4], true, { coords: false, labels: ['m = 0', 'm = 3', 'm = 0', 'm = 3'] }), 'Parallel, but no right angles') })}
${yt('Your turn')}
${mc('n86', { n: 1, text: 'Classify ABCD with A(0, 0), B(6, 0), C(4, 3), D(1, 3).', fig: fig(quad(tz, ['A', 'B', 'C', 'D'], [-1, 7, -1, 4], false)), opts: [
  { t: 'Trapezoid', ok: 1 }, { t: 'Parallelogram', fb: 'Check BC and DA: slopes −³⁄₂ and 3. They are not equal, so only ONE pair is parallel.' },
  { t: 'Rectangle', fb: 'There are no right angles: no neighbor slopes multiply to −1.' }, { t: 'Rhombus', fb: 'The sides are not all equal: AB = 6 but DC = 3.' }],
  why: 'AB and DC both have slope 0 (parallel). BC has slope −³⁄₂ and DA has slope 3 (not parallel). Exactly one pair → trapezoid.',
  after: fig(quad(tz, ['A', 'B', 'C', 'D'], [-1, 7, -1, 4], true, { coords: false, labels: ['m = 0', sl(tz[1], tz[2]), 'm = 0', sl(tz[3], tz[0])] }), 'Only the top and bottom are parallel') })}
`);
}

module.exports = page({
  title: 'Unit 8 Guided Notes — Coordinate Geometry | NC Math 1',
  back: 'unit8.html', backLabel: 'Unit 8',
  h1: '📝 Unit 8 Guided Notes — Coordinate Geometry',
  sub: 'Algebra proves geometry: average for the midpoint, Pythagoras for distance, slopes for angles.',
  stds: 'Standards: G-GPE.4/5/6',
  intro: 'Fill the blanks on your printed copy first, then click any blank, step, or button to check. <strong>Print → Save as PDF</strong> for a blank student worksheet; click <em>Reveal all</em> first to print the answer key. Each topic has: new words → a picture → numbered steps → a worked example → <b>find the mistake</b> → <b>your turn</b> (type and check).',
  nav: [['t1', '① Midpoint'], ['t2', '② Distance'], ['t3', '③ Perimeter/Area'], ['t4', '④ Parallel/Perp'], ['t5', '⑤ Equations'], ['t6', '⑥ Classify']],
  revealAll: true,
  body: S.join('\n')
});
