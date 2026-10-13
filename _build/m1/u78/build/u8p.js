const L = require('../lib/common.js');
const { G, C, fmt, pt, fr, rad, fig, q, mc, mistake, task, page } = L;
const { gp, labPts, ftxt, fhtml, slopeND, dist, sideLab } = require('./u8common.js');
G.prefix = 'u8p'; G.n = 0;
const out = [];
const part = (h, p) => out.push(`<div class="keyhdr"><h2>${h}</h2><p>${p}</p></div>`);
const sec = (n, t, html) => out.push(`<section class="topic"><h2><span class="num">${n}</span> ${t}</h2>\n${html}\n</section>`);
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const want = (P, x, y, s, anchor) => P.text(x, y, s, { c: C.goldT, fs: 13, bold: true, anchor: anchor || 'start' });

/* segment with endpoints; o.M shows midpoint (green) */
function segFig(A, B, v, o = {}) {
  const P = gp(v, { W: o.W });
  if (o.guides) { P.seg(A[0], A[1], B[0], A[1], { c: C.green, w: 1.6, dash: '5 4' }); P.seg(B[0], A[1], B[0], B[1], { c: C.green, w: 1.6, dash: '5 4' }); }
  P.seg(A[0], A[1], B[0], B[1]);
  (o.ticks || []).forEach(t => P.tick(A[0], A[1], B[0], B[1], t, { c: C.green }));
  P.dot(A[0], A[1]); P.dot(B[0], B[1]);
  P.lab(A[0], A[1], (o.na || '') + pt(A[0], A[1]), o.pa || 'se'); P.lab(B[0], B[1], (o.nb || '') + pt(B[0], B[1]), o.pb || 'nw');
  if (o.M) { P.dot(o.M[0], o.M[1], { c: C.green, r: 5.5 }); P.lab(o.M[0], o.M[1], (o.nm || 'M') + pt(o.M[0], o.M[1]), o.pm || 'se', { c: C.green }); }
  if (o.want) want(P, o.want[0], o.want[1], o.want[2], o.want[3]);
  return P.out('segment on the coordinate plane');
}
function tri(A, B, known, v, o = {}) {
  const R = gp(v, { W: o.W });
  const col = known ? C.green : C.gold, tcol = known ? C.green : C.goldT;
  R.seg(A[0], A[1], B[0], A[1], { c: col, w: 2, dash: '5 4' }); R.seg(B[0], A[1], B[0], B[1], { c: col, w: 2, dash: '5 4' });
  R.right(B[0], A[1], A[0], A[1], B[0], B[1], { c: col });
  R.seg(A[0], A[1], B[0], B[1], { c: C.navy, w: 2.6 });
  const dx = Math.abs(B[0] - A[0]), dy = Math.abs(B[1] - A[1]);
  let mx = (A[0] + B[0]) / 2; const lo = Math.min(A[0], B[0]), hi = Math.max(A[0], B[0]); if (lo < 0 && hi > 0 && Math.abs(mx) < 1.3) mx = hi >= -lo ? hi / 2 : lo / 2;
  R.text(mx, A[1], 'Δx = ' + (known ? dx : '?'), { c: tcol, fs: 11, bold: true, anchor: 'middle', dy: B[1] > A[1] ? (A[1] === 0 ? 27 : 16) : -6 });
  R.text(B[0], (A[1] + B[1]) / 2, 'Δy = ' + (known ? dy : '?'), { c: tcol, fs: 11, bold: true, anchor: B[0] > A[0] ? 'start' : 'end', dx: B[0] > A[0] ? 7 : -7, dy: 4 });
  const d = Math.hypot(dx, dy);
  const neg = (B[1] - A[1]) * (B[0] - A[0]) < 0;
  R.text((A[0] + B[0]) / 2, (A[1] + B[1]) / 2, 'd = ' + (known ? (Math.abs(d - Math.round(d)) < 1e-9 ? d : '√' + (dx * dx + dy * dy)) : '?'), { c: tcol, fs: 12, bold: true, anchor: neg ? 'start' : 'end', dx: neg ? 8 : -8, dy: -4 });
  R.dot(A[0], A[1]); R.dot(B[0], B[1]);
  R.lab(A[0], A[1], pt(A[0], A[1]), o.pa || 'w'); R.lab(B[0], B[1], pt(B[0], B[1]), o.pb || 'nw');
  return R.out('distance');
}
function rr(A, B, known, v, o = {}) {
  const R = gp(v, { W: o.W }); const [n, d] = slopeND(A, B);
  const col = known ? C.green : C.gold, tcol = known ? C.green : C.goldT;
  R.seg(A[0], A[1], B[0], A[1], { c: col, w: 2, dash: '5 4' }); R.seg(B[0], A[1], B[0], B[1], { c: col, w: 2, dash: '5 4' });
  R.seg(A[0], A[1], B[0], B[1], { c: C.navy, w: 2.6 });
  R.text((A[0] + B[0]) / 2, A[1], 'run = ' + (known ? fmt(d) : '?'), { c: tcol, fs: 11, bold: true, anchor: 'middle', dy: n > 0 ? 16 : -6 });
  R.text(B[0], (A[1] + B[1]) / 2, 'rise = ' + (known ? fmt(n) : '?'), { c: tcol, fs: 11, bold: true, anchor: d > 0 ? 'start' : 'end', dx: d > 0 ? 7 : -7, dy: 4 });
  R.dot(A[0], A[1]); R.dot(B[0], B[1]); R.lab(A[0], A[1], pt(A[0], A[1]), o.pa || 'w'); R.lab(B[0], B[1], pt(B[0], B[1]), o.pb || 'w');
  return R.out('slope triangle');
}
/* polygon figure: o.sides labels, o.hi = index of gold side, o.diag, o.right, o.inside */
function poly(pts, names, v, o = {}) {
  const R = gp(v, { W: o.W }); const cen = [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  R.poly(pts, { c: C.navy, fill: C.navy, op: 0.08 });
  if (o.hi != null) { const a = pts[o.hi], b = pts[(o.hi + 1) % pts.length]; R.seg(a[0], a[1], b[0], b[1], { c: o.known ? C.green : C.gold, w: 4 }); }
  if (o.diag) { const [a, b] = o.diag; R.seg(pts[a][0], pts[a][1], pts[b][0], pts[b][1], { c: o.known ? C.green : C.gold, w: 3, dash: '7 5' }); if (o.diagLab) R.text((pts[a][0] + pts[b][0]) / 2, (pts[a][1] + pts[b][1]) / 2, o.diagLab, { c: o.known ? C.green : C.goldT, fs: 12, bold: true, anchor: 'end', dx: -6, dy: -4 }); }
  if (o.sides) pts.forEach((p, i) => { const L = o.sides[i]; if (L) sideLab(R, p, pts[(i + 1) % pts.length], L, cen, { c: String(L).includes('?') ? C.goldT : o.known ? C.green : C.navy, fs: 11 }); });
  if (o.right) o.right.forEach(i => { const p = pts[i], a = pts[(i + pts.length - 1) % pts.length], b = pts[(i + 1) % pts.length]; R.right(p[0], p[1], a[0], a[1], b[0], b[1], { c: C.green }); });
  if (o.inside) R.text(cen[0], cen[1], o.inside, { c: o.known ? C.green : C.goldT, fs: 13, bold: true, anchor: 'middle', dy: 4 });
  labPts(R, pts, names, { fs: 11, coords: o.coords !== false, pos: o.pos });
  return R.out('figure on the coordinate plane');
}
const slTxt = (p, q) => { const [n, d] = slopeND(p, q); return d === 0 ? 'm undef.' : 'm = ' + ftxt(n, d); };
const slopes4 = pts => pts.map((p, i) => slTxt(p, pts[(i + 1) % 4]));

/* ===== Part A: midpoint & partition ===== */
{
  const A1 = [[-3, 2], [5, 6]], A2 = [[2, -5], [8, 3]], A4 = [[-2, -4], [6, 4]], A5 = [[-3, 4], [2, -1]];
  const M1 = mid(...A1), M2 = mid(...A2), M5 = mid(...A5);
  const a3A = [1, 2], a3M = [4, 6], a3B = [2 * a3M[0] - a3A[0], 2 * a3M[1] - a3A[1]];
  const P4 = [A4[0][0] + (A4[1][0] - A4[0][0]) / 4, A4[0][1] + (A4[1][1] - A4[0][1]) / 4];
  const m6 = [[1, 7], [5, -3]], M6 = mid(...m6);
  part('Part A · The Midpoint Formula &amp; Partitioning a Segment', `Type coordinates like <span class="coord">(1,4)</span>. Midpoint: M = ( ${fr('x₁ + x₂', '2')} , ${fr('y₁ + y₂', '2')} ).`);
  sec('A', 'Finding the Midpoint &amp; Partition Points', `
${q('a1', { n: 1, text: 'Find the midpoint of the segment shown, connecting (−3, 2) and (5, 6).', fig: fig(segFig(A1[0], A1[1], [-5, 7, -1, 8], { pa: 'se', pb: 'nw', want: [-4.6, 7.2, 'M = ?'] })), t: 'pt', a: M1, ph: '(x, y)',
  traps: [{ v: [4, 2], m: 'You subtracted. The midpoint ADDS: (−3 + 5) ÷ 2 and (2 + 6) ÷ 2.' }, { v: [2, 8], m: 'Almost! Now divide each sum by 2.' }, { v: [-4, 2], m: 'You subtracted. The midpoint ADDS the coordinates.' }],
  sol: `Midpoint = (${fr('x₁ + x₂', '2')} , ${fr('y₁ + y₂', '2')}) = (${fr('−3 + 5', '2')} , ${fr('2 + 6', '2')}) = (${fr('2', '2')} , ${fr('8', '2')}) → <strong>(1, 4)</strong>`,
  after: fig(segFig(A1[0], A1[1], [-5, 7, -1, 8], { pa: 'se', pb: 'nw', M: M1, guides: true }), 'M(1, 4): halfway across and halfway up') })}
${q('a2', { n: 2, text: 'Find the midpoint between (2, −5) and (8, 3).', fig: fig(segFig(A2[0], A2[1], [0, 9, -6, 4], { pa: 'e', pb: 'w', want: [4.2, 2.2, 'M = ?'] })), t: 'pt', a: M2, ph: '(x, y)',
  traps: [{ v: [5, -4], m: 'Check the y-value: (−5 + 3) ÷ 2 = −2 ÷ 2 = −1.' }, { v: [3, 4], m: 'You subtracted. The midpoint ADDS the coordinates.' }],
  sol: `Midpoint = (${fr('2 + 8', '2')} , ${fr('−5 + 3', '2')}) = (${fr('10', '2')} , ${fr('−2', '2')}) → <strong>(5, −1)</strong>`, after: fig(segFig(A2[0], A2[1], [0, 9, -6, 4], { pa: 'e', pb: 'w', M: M2, pm: 'se' })) })}
${q('a3', { n: 3, text: 'One endpoint of a segment is (1, 2) and the midpoint is (4, 6). Find the other endpoint.', fig: fig(segFig(a3A, a3M, [0, 9, 0, 11], { W: 260, na: 'A', nb: 'M', pa: 'e', pb: 'w', want: [8.6, 10.3, 'B = ?', 'end'] })), t: 'pt', a: a3B, ph: '(x, y)',
  traps: [{ v: [2.5, 4], m: 'That is the midpoint of A and M. M is already the middle — jump past it.' }, { v: [3, 4], m: 'That is the jump from A to M. Add the same jump to M.' }],
  sol: 'Midpoint formula in reverse: 4 = (1+x)/2 → x = 7. 6 = (2+y)/2 → y = 10 → <strong>(7, 10)</strong>. Or: A → M is +3, +4, so do it again from M.',
  after: fig(segFig(a3A, a3B, [0, 9, 0, 11], { W: 260, na: 'A', nb: 'B', pa: 'e', pb: 'w', M: a3M, pm: 'se' }), 'M is halfway from A to B(7, 10)') })}
${q('a4', { n: 4, text: 'Point P lies on segment AB, where A(−2, −4) and B(6, 4), such that AP:PB = 1:3. Find the coordinates of P.', fig: fig(segFig(A4[0], A4[1], [-3, 7, -5, 5], { na: 'A', nb: 'B', pa: 'e', pb: 'w', want: [2.5, -3.4, 'P = ?'] })), t: 'pt', a: P4, ph: '(x, y)',
  traps: [{ v: [2, 0], m: 'That is the midpoint (½ of the way). 1 : 3 means 1 part out of 4, so ¼ of the way.' }, { v: [0.67, -1.33], m: '1 : 3 is 1 part out of 1 + 3 = 4 parts, so use ¼, not ⅓.' }, { v: [4, 2], m: 'That is ¾ of the way. P is closer to A: use ¼.' }],
  sol: 'P is 1/(1+3) = ¼ of the way from A to B.<br>Px = −2 + ¼(6−(−2)) = −2 + 2 = 0<br>Py = −4 + ¼(4−(−4)) = −4 + 2 = −2 → <strong>(0, −2)</strong>',
  after: fig(segFig(A4[0], A4[1], [-3, 7, -5, 5], { na: 'A', nb: 'B', pa: 'e', pb: 'w', ticks: [0.25, 0.5, 0.75], M: P4, nm: 'P', pm: 'nw' }), '4 equal parts; P is 1 part from A') })}
${q('a5', { n: 5, text: 'Find the midpoint of (−3, 4) and (2, −1). (Decimals or fractions are fine.)', fig: fig(segFig(A5[0], A5[1], [-4, 3, -2, 5], { W: 260, pa: 'ne', pb: 'sw', want: [0.6, 4.3, 'M = ?'] })), t: 'pt', a: M5, ph: '(x, y)',
  traps: [{ v: [-1, 3], m: 'Don’t forget to divide by 2: (−1 ÷ 2, 3 ÷ 2).' }, { v: [-0.5, 2.5], m: 'Check the y-value: (4 + (−1)) ÷ 2 = 3 ÷ 2 = 1.5.' }],
  sol: `(${fr('−3 + 2', '2')} , ${fr('4 + (−1)', '2')}) = (${fr('−1', '2')} , ${fr('3', '2')}) = <b>(−0.5, 1.5)</b>`, after: fig(segFig(A5[0], A5[1], [-4, 3, -2, 5], { W: 260, pa: 'ne', pb: 'sw', M: M5, pm: 'e' })) })}
${mistake('a6', { n: 6, who: 'Rae found the midpoint of (1, 7) and (5, −3):', fig: fig(segFig(m6[0], m6[1], [0, 6, -4, 8], { W: 260, pa: 'e', pb: 'w' })),
  work: ['x: (1 + 5) ÷ 2 = 6 ÷ 2 = 3', 'y: (7 + (−3)) ÷ 2 = 10 ÷ 2 = 5', 'M = (3, 5)'], bad: 1,
  fbs: ['Step 1 is right.', '', 'Step 3 uses the y-value from Step 2. Find the first mistake.'],
  why: '7 + (−3) means 7 − 3 = 4, not 10. So y = 4 ÷ 2 = 2 and M = (3, 2).', after: fig(segFig(m6[0], m6[1], [0, 6, -4, 8], { W: 260, pa: 'e', pb: 'w', M: M6, pm: 'e' }), 'Fixed: M(3, 2)') })}
`);
}

/* ===== Part B: distance ===== */
{
  const B4d = Math.hypot(3, 6);
  part('Part B · The Distance Formula', `Type the distance as a number, like 5 or sqrt(13). d = ${rad('(x₂ − x₁)² + (y₂ − y₁)²')}`);
  sec('B', 'Finding the Distance', `
${q('b1', { n: 1, text: 'Find the distance between the two points shown, (1, 1) and (4, 5).', fig: fig(tri([1, 1], [4, 5], false, [0, 6, 0, 6])), t: 'num', a: 5, sq: true, ph: 'distance = ?',
  traps: [{ v: 7, m: 'You added the legs 3 + 4. Square them first, add, then take the square root.' }],
  sol: 'd = √[(4−1)² + (5−1)²] = √[9 + 16] = √25 → <strong>d = 5</strong> (a 3-4-5 right triangle)', after: fig(tri([1, 1], [4, 5], true, [0, 6, 0, 6])) })}
${q('b2', { n: 2, text: 'Find the distance between (0, 0) and (6, 8).', fig: fig(tri([0, 0], [6, 8], false, [-2.5, 8, -1.6, 9], { W: 260, pa: 'nw' })), t: 'num', a: 10, sq: true, ph: 'distance = ?',
  traps: [{ v: 14, m: 'You added 6 + 8. Square them first: 36 + 64.' }],
  sol: 'd = √[(6−0)² + (8−0)²] = √[36 + 64] = √100 → <strong>d = 10</strong>', after: fig(tri([0, 0], [6, 8], true, [-2.5, 8, -1.6, 9], { W: 260, pa: 'nw' })) })}
${q('b3', { n: 3, text: 'Find the distance between (−2, 3) and (2, 0).', fig: fig(tri([-2, 3], [2, 0], false, [-3, 4, -1, 4], { pa: 'n', pb: 'ne' })), t: 'num', a: 5, sq: true, ph: 'distance = ?',
  traps: [{ v: 3, m: 'Check Δx: 2 − (−2) = 4, not 0.' }, { v: 7, m: 'You added 4 + 3. Square, add, then take the square root.' }],
  sol: 'd = √[(2−(−2))² + (0−3)²] = √[16 + 9] = √25 → <strong>d = 5</strong>', after: fig(tri([-2, 3], [2, 0], true, [-3, 4, -1, 4], { pa: 'n', pb: 'ne' })) })}
${q('b4', { n: 4, text: 'Find the distance between (1, −2) and (4, 4). Give the exact answer, like sqrt(45), or round to 2 decimals.', fig: fig(tri([1, -2], [4, 4], false, [0, 6, -3, 5], { W: 260, pa: 'w' })), t: 'num', a: B4d, tol: 0.003, sq: true, ph: 'distance = ?',
  traps: [{ v: 9, m: 'You added 3 + 6. Square first: 9 + 36 = 45. Then take √.' }, { v: Math.sqrt(13), m: 'Check Δy: 4 − (−2) = 6, not 2.' }],
  sol: 'Δx = 3, Δy = 4 − (−2) = 6. d = √(9 + 36) = <b>√45 ≈ 6.71</b>', after: fig(tri([1, -2], [4, 4], true, [0, 6, -3, 5], { W: 260, pa: 'w' })) })}
${mistake('b5', { n: 5, who: 'Jon found the distance from (−1, −1) to (5, 7):', fig: fig(tri([-1, -1], [5, 7], false, [-2, 7, -2, 8], { W: 260, pa: 'w' })),
  work: ['Δx = 5 − (−1) = 6, Δy = 7 − (−1) = 8', '6² + 8² = 36 + 64 = 100', 'd = 100'], bad: 2,
  fbs: ['Step 1 is right: subtracting a negative adds.', 'Step 2 is right.', ''],
  why: 'He forgot the last step: take the square root. d = √100 = 10.', after: fig(tri([-1, -1], [5, 7], true, [-2, 7, -2, 8], { W: 260, pa: 'w' }), 'd = √100 = 10') })}
`);
}

/* ===== Part C: slopes ===== */
{
  const two = (l1, l2, v, known) => {
    const P = gp(v); P.line(l1.m, l1.b, { c: C.navy }); P.line(l2.m, l2.b, { c: C.blue });
    P.text(l1.lx, l1.ly, l1.t, { c: C.navy, fs: 12, bold: true, anchor: l1.an || 'start' });
    P.text(l2.lx, l2.ly, l2.t, { c: C.blue, fs: 12, bold: true, anchor: l2.an || 'start' });
    if (known && known.right) P.right(known.right[0], known.right[1], known.right[2], known.right[3], known.right[4], known.right[5], { c: C.green });
    return P.out('two lines');
  };
  const c1a = { m: 3, b: 1, t: 'y = 3x + 1', lx: -2.9, ly: 3.2 }, c1b = { m: 3, b: -4, t: 'y = 3x − 4', lx: 2.6, ly: -1.2 };
  const c2a = { m: 2, b: -1, t: 'y = 2x − 1', lx: 2.7, ly: 5.4, an: 'end' }, c2b = { m: -0.5, b: 3, t: 'y = −½x + 3', lx: 4.9, ly: -1.3, an: 'end' };
  // intersection of c2 lines: 2x − 1 = −½x + 3 → x = 1.6, y = 2.2
  const sv = (n, d, v, extra) => { const R = gp(v); R.line(n / d, 0, { c: C.navy }); R.seg(0, 0, d, 0, { c: C.navy, w: 1.6, dash: '4 3' }); R.seg(d, 0, d, n, { c: C.navy, w: 1.6, dash: '4 3' }); R.text(d / 2, 0, 'run ' + fmt(d), { fs: 11, bold: true, anchor: 'middle', dy: -6 }); R.text(d, n / 2, 'rise ' + fmt(n), { fs: 11, bold: true, dx: 6 }); if (extra) extra(R); return R.out('line with its slope triangle'); };
  const c3 = sv(4, 5, [-6, 6, -5, 6], R => { R.text(-5.7, 4.9, 'perpendicular', { c: C.goldT, fs: 12, bold: true }); R.text(-5.7, 4.0, 'm = ?', { c: C.goldT, fs: 12, bold: true }); });
  const c3a = sv(4, 5, [-6, 6, -5, 6], R => { R.line(-5 / 4, 0, { c: C.green }); R.right(0, 0, 5, 4, -4, 5, { c: C.green }); R.text(-5.8, 2.6, 'm = −⁵⁄₄', { c: C.green, fs: 12, bold: true }); });
  const c4 = sv(-2, 3, [-4, 5, -4, 4], R => R.text(0.4, 3.1, 'parallel m = ?', { c: C.goldT, fs: 12, bold: true }));
  const c4a = sv(-2, 3, [-4, 5, -4, 4], R => { R.line(-2 / 3, 3, { c: C.green }); R.text(0.9, 3.4, 'parallel: m = −⅔', { c: C.green, fs: 12, bold: true }); });
  const g = (lines, pts, v, labs) => { const R = gp(v); lines.forEach(l => R.line(l[0], l[1], { c: l[2] })); pts.forEach(p => { R.dot(p[0], p[1]); R.lab(p[0], p[1], pt(p[0], p[1]), p[2] || 'w', { fs: 11 }); }); (labs || []).forEach(t => R.text(t[0], t[1], t[2], { c: t[3], fs: 12, bold: true, anchor: t[4] || 'start' })); return R.out('lines'); };
  part('Part C · Slope: Parallel &amp; Perpendicular', `Use each graph to answer the question, then apply the rule yourself. Slope m = ${fr('rise', 'run')} = ${fr('y₂ − y₁', 'x₂ − x₁')}.`);
  sec('C', 'Comparing Slopes', `
${mc('c1', { n: 1, text: 'What is true about the slopes of these two lines?', fig: fig(two(c1a, c1b, [-4, 4, -6, 6])), opts: [
  { t: 'They are equal — the lines are parallel', ok: 1 }, { t: 'Their product is −1 — perpendicular', fb: '3 × 3 = 9, not −1. Look: the lines never cross.' }, { t: 'One is zero', fb: 'A slope of 0 is a flat line. Both lines are steep: slope 3.' }, { t: 'They are opposite reciprocals', fb: 'The opposite reciprocal of 3 is −⅓. Both slopes here are 3.' }],
  why: 'Both lines have slope 3, so they are parallel.' })}
${mc('c2', { n: 2, text: 'What is true about the slopes of these two lines?', fig: fig(two(c2a, c2b, [-3, 5, -3, 6])), opts: [
  { t: 'They are equal — the lines are parallel', fb: 'The slopes are 2 and −½. They are not equal, and the lines cross.' }, { t: 'Their product is −1 — perpendicular', ok: 1 }, { t: 'One is zero', fb: 'Neither line is flat. The slopes are 2 and −½.' }, { t: 'They are equal in value', fb: '2 and −½ are different numbers.' }],
  why: '2 × (−½) = −1, so the lines are perpendicular.', after: fig(two(c2a, c2b, [-3, 5, -3, 6], { right: [1.6, 2.2, 3, 5, 0, 3] }), 'They meet at a square corner') })}
${q('c3', { n: 3, text: `A line has slope ${fr('4', '5')}. What is the slope of a line perpendicular to it?`, fig: fig(c3), t: 'num', a: -5 / 4, ph: 'slope = ?',
  traps: [{ v: 5 / 4, m: 'You flipped it. Now change the sign too.' }, { v: -4 / 5, m: 'You changed the sign. Now flip the fraction too.' }, { v: 4 / 5, m: 'That is the parallel slope. Perpendicular: flip and change the sign.' }],
  sol: `Perpendicular slopes are opposite reciprocals: flip ${fr('4', '5')} to get ${fr('5', '4')}, then negate → <strong>−${fr('5', '4')}</strong>`, after: fig(c3a, 'The green line meets the given line at a right angle') })}
${q('c4', { n: 4, text: `A line has slope −${fr('2', '3')}. What is the slope of a line parallel to it?`, fig: fig(c4), t: 'num', a: -2 / 3, tol: 0.01, ph: 'slope = ?',
  traps: [{ v: 3 / 2, m: 'That is the perpendicular slope. Parallel lines keep the SAME slope.' }, { v: 2 / 3, m: 'Keep the negative sign. Parallel means exactly the same slope.' }],
  sol: `Parallel lines have the exact same slope → <strong>−${fr('2', '3')}</strong>`, after: fig(c4a, 'Same slope: the lines never meet') })}
${q('c5', { n: 5, text: 'Find the slope of the line through (−1, −3) and (3, 5).', fig: fig(rr([-1, -3], [3, 5], false, [-2, 5, -4, 6], { pa: 'nw', pb: 'w' })), t: 'num', a: 2, ph: 'm = ?',
  traps: [{ v: 0.5, m: 'That is run ÷ rise. Slope is RISE ÷ run: 8 ÷ 4.' }, { v: -2, m: 'The line goes UP from left to right, so the slope is positive.' }],
  sol: `${fr('5 − (−3)', '3 − (−1)')} = ${fr('8', '4')} = <b>2</b>`, after: fig(rr([-1, -3], [3, 5], true, [-2, 5, -4, 6], { pa: 'nw', pb: 'w' })) })}
${q('c6', { n: 6, text: 'Write the equation of the line through (2, 3) that is parallel to y = 2x − 5.', fig: fig(g([[2, -5, C.navy]], [[2, 3, 'w']], [-2, 5, -3, 6], [[4.9, -2.4, 'y = 2x − 5', C.navy, 'end']])), t: 'line', a: { m: 2, b: -1 }, ph: 'y = mx + b',
  sol: 'Same slope m = 2. 3 = 2(2) + b → b = −1 → <b>y = 2x − 1</b>', after: fig(g([[2, -5, C.navy], [2, -1, C.green]], [[2, 3, 'w']], [-2, 5, -3, 6], [[-1.8, 5.4, 'y = 2x − 1', C.green]]), 'y = 2x − 1 goes through (2, 3)') })}
${q('c7', { n: 7, text: 'Write the equation of the line through (3, 4) that is perpendicular to y = −3x + 2.', fig: fig(g([[-3, 2, C.navy]], [[3, 4, 'e']], [-2, 6, -3, 6], [[1.9, -2.4, 'y = −3x + 2', C.navy]])), t: 'line', a: { m: 1 / 3, b: 3 }, ph: 'y = mx + b',
  sol: 'Perpendicular slope: ⅓. 4 = ⅓(3) + b → 4 = 1 + b → b = 3 → <b>y = ⅓x + 3</b>', after: fig(g([[-3, 2, C.navy], [1 / 3, 3, C.green]], [[3, 4, 'se']], [-2, 6, -3, 6], [[5.9, 5.4, 'y = ⅓x + 3', C.green, 'end']]), 'y = ⅓x + 3 makes a right angle with y = −3x + 2') })}
${mistake('c8', { n: 8, who: 'Eli found the slope of the line through (2, 5) and (6, 3):', fig: fig(rr([2, 5], [6, 3], false, [0, 7, 0, 6], { pa: 'n', pb: 'n' })),
  work: [`m = ${fr('y₂ − y₁', 'x₂ − x₁')}`, `m = ${fr('6 − 2', '3 − 5')}`, `m = ${fr('4', '−2')} = −2`], bad: 1,
  fbs: ['Step 1 is the right formula.', '', 'Step 3 just simplifies Step 2. Find the first mistake.'],
  why: `He put the x’s on top. The y’s go on top: ${fr('3 − 5', '6 − 2')} = ${fr('−2', '4')} = −½.`, after: fig(rr([2, 5], [6, 3], true, [0, 7, 0, 6], { pa: 'n', pb: 'n' }), 'rise −2, run 4: m = −½') })}
`);
}

/* ===== Part D: rectangle ===== */
{
  const R = [[0, 0], [4, 0], [4, 3], [0, 3]], N = ['A', 'B', 'C', 'D'], v = [-2, 6, -1.5, 4];
  part('Part D · Classifying Polygons on the Coordinate Plane', 'Use the figure ABCD to answer Questions 1–5. Each question has its own copy of the grid.');
  sec('D', 'Using Slope &amp; Distance to Classify', `
${mc('d1', { n: 1, text: 'Using slope, what type of quadrilateral is ABCD?', fig: fig(poly(R, N, v)), opts: [
  { t: 'Rectangle — adjacent sides are perpendicular', ok: 1 }, { t: 'Rhombus — all sides equal', fb: 'Count the sides: AB = 4 but BC = 3. They are not all equal.' },
  { t: 'Trapezoid — only one pair of parallel sides', fb: 'AB ∥ DC (both flat) AND BC ∥ AD (both vertical). That is two pairs.' }, { t: 'Parallelogram, but not a rectangle', fb: 'Flat sides and vertical sides meet at right angles, so it IS a rectangle.' }],
  why: 'AB and DC have slope 0 (flat). BC and AD are vertical (undefined slope). Flat and vertical lines are perpendicular, so every angle is 90° — ABCD is a rectangle.',
  after: fig(poly(R, N, v, { known: true, coords: false, sides: ['m = 0', 'vertical', 'm = 0', 'vertical'], right: [0, 1, 2, 3] }), 'All four angles are right angles') })}
${q('d2', { n: 2, text: 'Find the length of side AB.', fig: fig(poly(R, N, v, { hi: 0, sides: ['AB = ?'] })), t: 'num', a: dist(R[0], R[1]), ph: 'AB = ?',
  traps: [{ v: 3, m: '3 is BC (the height). AB goes from x = 0 to x = 4.' }],
  sol: 'A(0,0) to B(4,0): d = √[(4−0)² + (0−0)²] = √16 → <strong>AB = 4</strong>', after: fig(poly(R, N, v, { hi: 0, known: true, coords: false, sides: ['AB = 4'] })) })}
${q('d3', { n: 3, text: 'Find the length of side BC.', fig: fig(poly(R, N, v, { hi: 1, sides: ['', 'BC = ?'] })), t: 'num', a: dist(R[1], R[2]), ph: 'BC = ?',
  traps: [{ v: 4, m: '4 is AB. BC goes from y = 0 up to y = 3.' }],
  sol: 'B(4,0) to C(4,3): d = √[(4−4)² + (3−0)²] = √9 → <strong>BC = 3</strong>', after: fig(poly(R, N, v, { hi: 1, known: true, coords: false, sides: ['', 'BC = 3'] })) })}
${q('d4', { n: 4, text: 'Find the length of the diagonal AC.', fig: fig(poly(R, N, v, { diag: [0, 2], diagLab: 'AC = ?' })), t: 'num', a: dist(R[0], R[2]), sq: true, ph: 'AC = ?',
  traps: [{ v: 7, m: 'You added 4 + 3. Use the distance formula: √(16 + 9).' }],
  sol: 'A(0,0) to C(4,3): d = √[(4−0)² + (3−0)²] = √[16+9] = √25 → <strong>AC = 5</strong>', after: fig(poly(R, N, v, { diag: [0, 2], diagLab: 'AC = 5', known: true, coords: false, sides: ['4', '3', '', ''] })) })}
  <div class="sa"><div class="chk-q"><span class="badge">5</span> Explain how the distance formula shows that ABCD is NOT a rhombus (a rhombus has 4 equal sides).</div>${fig(poly(R, N, v, { coords: false, sides: ['AB = ?', 'BC = ?', '', ''] }))}<button class="sa-btn" onclick="K78.sol(this)">Reveal</button><div class="sa-ans">AB = 4 and BC = 3.<br>Since 4 ≠ 3, not all sides are equal, so <strong>ABCD is not a rhombus</strong> — it's a rectangle (only opposite sides equal, all right angles).</div>${L.after(fig(poly(R, N, v, { known: true, coords: false, sides: ['4', '3', '4', '3'], right: [0, 1, 2, 3] }), '4 ≠ 3: not a rhombus'))}</div>
`);
}

/* ===== Part E: perimeter & area ===== */
{
  const T = [[1, 1], [5, 1], [5, 4]], TN = ['A', 'B', 'C'], tv = [0, 6, 0, 5];
  const Rr = [[-3, -2], [2, -2], [2, 4], [-3, 4]], RN = ['P', 'Q', 'R', 'S'], rv = [-4, 3, -3, 5];
  const M = [[-2, 0], [4, 0], [1, 5]];
  part('Part E · Perimeter &amp; Area on the Plane', `Perimeter = add all the sides. Area of a rectangle = length × width. Area of a triangle = ${fr('1', '2')} × base × height.`);
  sec('E', 'Perimeter &amp; Area from Coordinates', `
${q('e1', { n: 1, text: 'Find the perimeter of triangle ABC with A(1, 1), B(5, 1), C(5, 4).', fig: fig(poly(T, TN, tv, { sides: ['?', '?', '?'] })), t: 'num', a: dist(T[0], T[1]) + dist(T[1], T[2]) + dist(T[2], T[0]), ph: 'perimeter = ?',
  traps: [{ v: 7, m: 'Don’t forget the slanted side AC. AC = √(4² + 3²) = 5.' }, { v: 6, m: '6 is the area. Perimeter adds the three sides.' }],
  sol: 'AB = 4, BC = 3, AC = √(16 + 9) = 5. Perimeter = 4 + 3 + 5 = <b>12 units</b>', after: fig(poly(T, TN, tv, { known: true, coords: false, sides: ['4', '3', '5'], right: [1] })) })}
${q('e2', { n: 2, text: 'Find the area of triangle ABC.', fig: fig(poly(T, TN, tv, { inside: '' , sides: ['base', 'height', ''] })), t: 'num', a: 0.5 * 4 * 3, ph: 'area = ?',
  traps: [{ v: 12, m: 'A triangle is half of a rectangle. Multiply by ½.' }, { v: 10, m: 'Use the base and height (the sides that make the square corner), not the slanted side.' }],
  sol: '½ × 4 × 3 = <b>6 square units</b>', after: fig(poly(T, TN, tv, { known: true, coords: false, sides: ['4', '3', ''], right: [1] })) })}
${q('e3', { n: 3, text: 'Find the area of rectangle PQRS with P(−3, −2), Q(2, −2), R(2, 4), S(−3, 4).', fig: fig(poly(Rr, RN, rv, { pos: ['sw', 'se', 'ne', 'nw'] })), t: 'num', a: dist(Rr[0], Rr[1]) * dist(Rr[1], Rr[2]), ph: 'area = ?',
  traps: [{ v: 22, m: '22 is the perimeter. Area multiplies length × width.' }, { v: 12, m: 'Check the side lengths: from x = −3 to x = 2 is 5 units, from y = −2 to y = 4 is 6 units.' }],
  sol: 'PQ = 2 − (−3) = 5, QR = 4 − (−2) = 6. Area = 5 × 6 = <b>30 square units</b>', after: fig(poly(Rr, RN, rv, { known: true, coords: false, sides: ['5', '6', '', ''], inside: 'Area = 30' })) })}
${q('e4', { n: 4, text: 'Find the perimeter of rectangle PQRS.', fig: fig(poly(Rr, RN, rv, { pos: ['sw', 'se', 'ne', 'nw'], sides: ['?', '?', '?', '?'] })), t: 'num', a: 2 * (5 + 6), ph: 'perimeter = ?',
  traps: [{ v: 30, m: '30 is the area. Perimeter adds all 4 sides.' }, { v: 11, m: 'A rectangle has 4 sides: 5 + 6 + 5 + 6.' }],
  sol: '5 + 6 + 5 + 6 = <b>22 units</b>', after: fig(poly(Rr, RN, rv, { known: true, coords: false, sides: ['5', '6', '5', '6'] })) })}
${mistake('e5', { n: 5, who: 'Nia found the area of the triangle (−2, 0), (4, 0), (1, 5):', fig: fig(poly(M, ['', '', ''], [-3, 5, -1, 6])),
  work: ['base = 4 − (−2) = 6', 'height = 5 − 0 = 5', 'Area = 6 × 5 = 30 square units'], bad: 2,
  fbs: ['Step 1 is right.', 'Step 2 is right: the top point is 5 above the base.', ''],
  why: `A triangle is half of a rectangle: ${fr('1', '2')} × 6 × 5 = 15 square units.`, after: fig((() => { const R = gp([-3, 5, -1, 6]); R.poly(M, { c: C.navy, fill: C.green, op: 0.15 }); R.seg(1, 0, 1, 5, { c: C.green, w: 2, dash: '5 4' }); R.right(1, 0, 4, 0, 1, 5, { c: C.green }); R.text(1, 2.5, 'h = 5', { c: C.green, fs: 12, bold: true, dx: 6 }); R.text(1, 0, 'base 6', { c: C.green, fs: 12, bold: true, anchor: 'middle', dy: 16, dx: -40 }); M.forEach(p => R.dot(p[0], p[1])); return R.out('triangle'); })(), 'Area = ½ × 6 × 5 = 15') })}
`);
}

/* ===== Part F: classify quadrilaterals ===== */
{
  const rh = [[0, 0], [5, 0], [8, 4], [3, 4]], pg = [[1, 1], [5, 1], [6, 4], [2, 4]], sq = [[2, 0], [5, 2], [3, 5], [0, 3]], tz = [[0, 0], [5, 0], [4, 3], [2, 3]], re = [[0, 1], [2, -1], [5, 2], [3, 4]];
  const N = ['A', 'B', 'C', 'D'];
  const after = (pts, v, extra) => fig(poly(pts, N, v, Object.assign({ known: true, coords: false, sides: slopes4(pts) }, extra || {})));
  const opts = (ok, fbs) => ['Square', 'Rectangle', 'Rhombus', 'Parallelogram', 'Trapezoid'].map(t => ({ t, ok: t === ok, fb: fbs[t] || '' }));
  // check the classification keys in code
  const classify = p => {
    const s = p.map((a, i) => slopeND(a, p[(i + 1) % 4])); const eq = (u, w) => u[1] * w[0] === u[0] * w[1];
    const par1 = eq(s[0], s[2]), par2 = eq(s[1], s[3]);
    if (par1 !== par2) return 'Trapezoid';
    const perp = s[0][0] * s[1][0] + s[0][1] * s[1][1] === 0;
    const L = p.map((a, i) => dist(a, p[(i + 1) % 4])); const allEq = L.every(x => Math.abs(x - L[0]) < 1e-9);
    return perp && allEq ? 'Square' : perp ? 'Rectangle' : allEq ? 'Rhombus' : 'Parallelogram';
  };
  const K = { rh: classify(rh), pg: classify(pg), sq: classify(sq), tz: classify(tz), re: classify(re) };
  if (K.rh !== 'Rhombus' || K.pg !== 'Parallelogram' || K.sq !== 'Square' || K.tz !== 'Trapezoid' || K.re !== 'Rectangle') throw new Error('classification key mismatch ' + JSON.stringify(K));
  const sAB = slopeND(sq[0], sq[1]), sBC = slopeND(sq[1], sq[2]);
  part('Part F · Classify Quadrilaterals by Coordinates', 'Find the slope of every side (parallel? perpendicular?) and the length of every side (equal?). Many shapes fit more than one name. A square is also a rectangle, a rhombus and a parallelogram. Always choose the <b>most specific</b> name: the one that tells the most about the shape.');
  sec('F', 'Name the Shape', `
${task('f0', { n: 1, text: 'A(−3, −1), B(2, −1) and C(4, 3) are fixed. Drag D so that ABCD is a <b>parallelogram</b>. Then press “Check my D”.', w: 'para',
  opts: { A: [-3, -1], B: [2, -1], C: [4, 3], D: [-1, 3], D0: [-3, 2], view: [-5, 6, -3, 5], okMsg: 'D(−1, 3): B → C is +2 across, +4 up, and so is A → D.' },
  after: fig(poly([[-3, -1], [2, -1], [4, 3], [-1, 3]], N, [-5, 6, -3, 5], { known: true, coords: false, sides: slopes4([[-3, -1], [2, -1], [4, 3], [-1, 3]]) }), 'Opposite sides have equal slopes') })}
${mc('f1', { n: 2, text: 'ABCD has A(0, 0), B(5, 0), C(8, 4), D(3, 4). What is the <b>most specific</b> name for ABCD?', fig: fig(poly(rh, N, [-1, 9, -1, 5])), opts: opts('Rhombus', { Square: 'Check the angles: slopes 0 and ⁴⁄₃ do not multiply to −1, so there are no right angles.', Rectangle: 'Slopes 0 and ⁴⁄₃ are not perpendicular. No right angles.', Parallelogram: 'True, it IS a parallelogram. But we want the most specific name. Check the side lengths: all are 5.', Trapezoid: 'Both pairs of opposite sides are parallel (0 and 0, ⁴⁄₃ and ⁴⁄₃).' }),
  why: 'Slopes: AB = 0, BC = ⁴⁄₃, CD = 0, DA = ⁴⁄₃ → parallelogram. No right angles. All sides = 5 (BC = √(9 + 16) = 5) → rhombus.', after: after(rh, [-1, 9, -1, 5]) })}
${mc('f2', { n: 3, text: 'ABCD has A(1, 1), B(5, 1), C(6, 4), D(2, 4). What is the <b>most specific</b> name for ABCD?', fig: fig(poly(pg, N, [0, 7, 0, 5])), opts: opts('Parallelogram', { Square: 'The sides are not equal (4 and √10) and there are no right angles.', Rectangle: 'Slopes 0 and 3 are not perpendicular, so no right angles.', Rhombus: 'AB = 4 but BC = √10 ≈ 3.16. Not all equal.', Trapezoid: 'BOTH pairs are parallel: AB ∥ DC (slope 0) and BC ∥ AD (slope 3).' }),
  why: 'AB ∥ DC (slope 0), BC ∥ AD (slope 3) → parallelogram. Not perpendicular, sides 4 and √10 → just a parallelogram.', after: after(pg, [0, 7, 0, 5]) })}
${mc('f3', { n: 4, text: 'ABCD has A(2, 0), B(5, 2), C(3, 5), D(0, 3). What is the <b>most specific</b> name for ABCD?', fig: fig(poly(sq, N, [-1, 6, -1, 6])), opts: opts('Square', { Rectangle: 'It has right angles, but check the lengths: all four are √13. Equal sides + right angles has a more specific name.', Rhombus: 'All sides are equal, but check the angles: ⅔ × (−³⁄₂) = −1, so they are right angles.', Parallelogram: 'True, it IS a parallelogram. But we want the most specific name. Check for right angles and equal sides.', Trapezoid: 'Both pairs of opposite sides are parallel.' }),
  why: 'Slopes ⅔ and −³⁄₂ alternate → parallelogram with right angles (⅔ × −³⁄₂ = −1). All sides √13 → square.', after: after(sq, [-1, 6, -1, 6], { right: [0, 1, 2, 3] }) })}
${q('f4', { n: 5, text: 'In Question 4, multiply the slope of AB by the slope of BC. What do you get?', fig: fig(poly(sq, N, [-1, 6, -1, 6], { sides: ['m = ?', 'm = ?', '', ''] })), t: 'num', a: (sAB[0] / sAB[1]) * (sBC[0] / sBC[1]), ph: 'product = ?',
  traps: [{ v: 1, m: 'Check the sign of BC’s slope: from B(5, 2) to C(3, 5), the run is −2.' }],
  sol: `AB: ${fr('2', '3')}, BC: ${fr('3', '−2')} = −${fr('3', '2')}. Product: ${fr('2', '3')} × (−${fr('3', '2')}) = <b>−1</b> → perpendicular.`, after: after(sq, [-1, 6, -1, 6], { right: [1] }) })}
${mc('f5', { n: 6, text: 'ABCD has A(0, 0), B(5, 0), C(4, 3), D(2, 3). What is the <b>most specific</b> name for ABCD?', fig: fig(poly(tz, N, [-1, 6, -1, 4])), opts: opts('Trapezoid', { Square: 'The sides are not equal and the angles are not right angles.', Rectangle: 'There are no right angles here.', Rhombus: 'AB = 5 but DC = 2. Not all equal.', Parallelogram: 'Check BC and DA: slopes −3 and ³⁄₂ are not equal. Only ONE pair is parallel.' }),
  why: 'AB and DC both have slope 0 (parallel). BC (−3) and DA (³⁄₂) are not parallel. Exactly one pair → trapezoid.', after: after(tz, [-1, 6, -1, 4]) })}
${mc('f6', { n: 7, text: 'ABCD has A(0, 1), B(2, −1), C(5, 2), D(3, 4). What is the <b>most specific</b> name for ABCD?', fig: fig(poly(re, N, [-1, 6, -2, 5])), opts: opts('Rectangle', { Square: 'It has right angles, but AB = √8 and BC = √18. The sides are not all equal.', Rhombus: 'The sides are not all equal: √8 and √18.', Parallelogram: 'True, it IS a parallelogram. But we want the most specific name: −1 × 1 = −1, so it also has right angles.', Trapezoid: 'Both pairs of opposite sides are parallel.' }),
  why: 'Slopes −1, 1, −1, 1 → parallelogram, and −1 × 1 = −1 → right angles. AB = √8, BC = √18 (not equal) → rectangle, not a square.', after: after(re, [-1, 6, -2, 5], { right: [0, 1, 2, 3] }) })}
`);
}

module.exports = page({
  title: 'Unit 8 Practice — Coordinate Geometry | NC Math 1',
  back: 'unit8.html', backLabel: 'Unit 8',
  h1: '✏️ Unit 8 Practice — Coordinate Geometry',
  sub: 'Work each problem on your printed copy, then check it on screen.',
  stds: 'Standards: G-GPE.4/5/6',
  score: true,
  intro: 'Every problem has its own grid. Type your answer and press <b>Check</b> (or Enter). You can type <span class="coord">(1, 4)</span>, <span class="coord">1,4</span>, <span class="coord">-5/4</span>, <span class="coord">-1.25</span>, <span class="coord">sqrt(45)</span> or <span class="coord">y = 2x - 1</span>. Stuck? Tap <b>📖 Show full solution</b>.',
  body: out.join('\n'),
  tail: '<div style="text-align:center;margin-top:18px"><a href="unit8.html" class="plink gold" style="padding:12px 24px;font-family:Arvo">← Back to Unit 8</a></div>'
});
