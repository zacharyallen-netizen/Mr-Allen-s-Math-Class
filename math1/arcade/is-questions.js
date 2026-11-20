/* Island Survey — question makers (Math 1 Unit 8: coordinate geometry).
   q.rep = { pts: [{x, y, l: 'A', icon}], segs: [[i, j]], poly: [i…], line: {m, b}, show: what the right answer draws }
   Each point-answer choice carries `at` = {pt:[x,y]} or {line:{m,b}} so the map can draw a wrong aim in red. */
(function () {
  var M = window.M1, n = M.n, rint = M.rint, pick = M.pick;
  function W(k, h, why, at) { return { k: String(k), h: h, why: why, at: at }; }
  function num(v, why) { return W(v, n(v), why); }
  function pt(x, y) { return '(' + n(x) + ', ' + n(y) + ')'; }
  function P(x, y, why) { return W('p' + x + ',' + y, pt(x, y), why, { pt: [x, y] }); }
  function ln(s) { return '<span class="ln">' + s + '</span>'; }
  function nz(a, b) { var v; do { v = rint(a, b); } while (!v); return v; }
  function sq(v) { var r = Math.round(Math.sqrt(v)); return r * r === v ? n(r) : '√' + v; }
  function fr(v) { if (Number.isInteger(v)) return n(v); for (var d = 2; d <= 12; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return (v < 0 ? '−' : '') + Math.abs(Math.round(v * d)) + '/' + d; return n(+v.toFixed(2)); }
  function cf(v) { var s = fr(v); return /\//.test(s) ? s.replace(/^(\u2212?)(.*)$/, '$1($2)') : s; }   // −(2/3) for an x coefficient
  var ICON = ['tent', 'tower', 'chest', 'tree', 'flag'];
  function A(x, y, l, i) { return { x: x, y: y, l: l, icon: i || ICON[Math.floor(Math.random() * ICON.length)] }; }

  /* ---------- midpoint, endpoint, partition ---------- */
  function mid() {
    var x1 = rint(-8, 6), y1 = rint(-7, 7), x2, y2; do { x2 = rint(-8, 8); y2 = rint(-7, 7); } while ((x1 + x2) % 2 || (y1 + y2) % 2 || (x1 === x2 && y1 === y2) || Math.abs(x2 - x1) < 2);
    var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    return { kind: 'mid', rep: { pts: [A(x1, y1, 'A', 'tent'), A(x2, y2, 'B', 'tower')], segs: [[0, 1]], show: { pt: [mx, my], l: 'Camp' } },
      p: 'Set up camp exactly halfway between the tent A' + pt(x1, y1) + ' and the tower B' + pt(x2, y2) + '. Where is the <b>midpoint</b>?',
      ch: M.choices(P(mx, my), [P((x2 - x1) / 2, (y2 - y1) / 2, 'Midpoint ADDS: ((x₁ + x₂) ÷ 2, (y₁ + y₂) ÷ 2). You subtracted.'), P(x1 + x2, y1 + y2, 'You added but forgot to divide by 2.'), P(my, mx, 'Swapped: x first, then y.')], [P(mx + 1, my, 'Average the x’s and average the y’s.')]),
      hint: 'Midpoint = (average of the x’s, average of the y’s).', steps: ln('x: (' + n(x1) + ' + ' + n(x2) + ') ÷ 2 = ' + n(mx)) + ln('y: (' + n(y1) + ' + ' + n(y2) + ') ÷ 2 = ' + n(my)), yes: '' };
  }
  function endpoint() {
    var x1 = rint(-6, 4), y1 = rint(-6, 4), mx = x1 + nz(-4, 4), my = y1 + nz(-4, 4), x2 = 2 * mx - x1, y2 = 2 * my - y1;
    if (Math.abs(x2) > 9 || Math.abs(y2) > 9) return endpoint();
    var wr = [P(mx - x1, my - y1, 'That is how far it is from A to M. Go that same distance AGAIN past M.'), P(2 * mx + x1, 2 * my + y1, 'Endpoint = 2·M − A. You added A.')];
    if ((x1 + mx) % 2 === 0 && (y1 + my) % 2 === 0) wr.unshift(P((x1 + mx) / 2, (y1 + my) / 2, 'That is halfway between A and M. M is the MIDDLE, so B is past M.'));
    return { kind: 'endpoint', rep: { pts: [A(x1, y1, 'A', 'tent'), A(mx, my, 'M', 'flag')], segs: [[0, 1]], show: { pt: [x2, y2], l: 'B' } },
      p: 'The flag M' + pt(mx, my) + ' is the midpoint of a trail from A' + pt(x1, y1) + ' to B. Where is the other <b>endpoint B</b>?',
      ch: M.choices(P(x2, y2), wr, [P(x2 + 1, y2, 'From A to M, then the same jump again.'), P(x2, y2 - 1, 'From A to M, then the same jump again.')]),
      hint: 'From A to M: x changes by ' + n(mx - x1) + ' and y by ' + n(my - y1) + '. Do the same jump again from M.', steps: ln('Jump: (' + n(mx - x1) + ', ' + n(my - y1) + ')') + ln('B = ' + pt(mx, my) + ' + jump = ' + pt(x2, y2)), yes: '' };
  }
  function partition() {
    var a = pick([1, 1, 2, 1]), b = pick([1, 2, 3]); if (a === b) b = a + 1; var tot = a + b;
    var x1 = rint(-8, 0), y1 = rint(-7, 0), dx = tot * pick([1, 2, 3]), dy = tot * nz(-2, 3), x2 = x1 + dx, y2 = y1 + dy;
    if (Math.abs(x2) > 9 || Math.abs(y2) > 9) return partition();
    var px = x1 + dx * a / tot, py = y1 + dy * a / tot;
    var wr = [P(x2 - dx * a / tot, y2 - dy * a / tot, 'You measured from B. The ratio ' + a + ':' + b + ' starts at A.'), P((x1 + x2) / 2, (y1 + y2) / 2, 'That is the midpoint (1:1). Split the trail into ' + tot + ' equal parts.')];
    if (Number.isInteger(dx * a / b) && Number.isInteger(dy * a / b)) wr.push(P(x1 + dx * a / b, y1 + dy * a / b, 'Use ' + a + '/' + tot + ' of the way (part over WHOLE), not ' + a + '/' + b + '.'));
    return { kind: 'partition', rep: { pts: [A(x1, y1, 'A', 'tent'), A(x2, y2, 'B', 'chest')], segs: [[0, 1]], show: { pt: [px, py], l: 'P' } },
      p: 'Put a marker P on the trail from A' + pt(x1, y1) + ' to B' + pt(x2, y2) + ' so that AP : PB = <b>' + a + ' : ' + b + '</b>.',
      ch: M.choices(P(px, py), wr.filter(function (w) { return w.k !== 'p' + px + ',' + py; }), [P(px + 1, py, 'Go ' + a + '/' + tot + ' of the way from A.')]),
      hint: 'A ratio of ' + a + ':' + b + ' splits the trail into ' + tot + ' equal parts. P is ' + a + '/' + tot + ' of the way from A to B.',
      steps: ln('Whole jump: (' + n(dx) + ', ' + n(dy) + ')') + ln(a + '/' + tot + ' of it: (' + n(dx * a / tot) + ', ' + n(dy * a / tot) + ')') + ln('P = ' + pt(px, py)), yes: '' };
  }
  /* ---------- distance, perimeter, area ---------- */
  var TRIP = [[3, 4], [6, 8], [5, 12], [8, 6], [4, 3], [12, 5], [8, 15]];
  function dist() {
    var t = Math.random() < 0.6 ? pick(TRIP) : [rint(1, 6), rint(1, 6)], sx = pick([1, -1]), sy = pick([1, -1]), dx = t[0] * sx, dy = t[1] * sy;
    var x1 = rint(-8, 8 - Math.abs(dx)), y1 = rint(-8, 8 - Math.abs(dy)); if (dx < 0) x1 += Math.abs(dx); if (dy < 0) y1 += Math.abs(dy);
    var x2 = x1 + dx, y2 = y1 + dy; if (Math.abs(x2) > 9 || Math.abs(y2) > 9 || Math.abs(x1) > 9 || Math.abs(y1) > 9) return dist();
    var s2 = dx * dx + dy * dy, right = sq(s2);
    return { kind: 'dist', rep: { pts: [A(x1, y1, 'A', 'tower'), A(x2, y2, 'B', 'tree')], segs: [], show: { seg: [[x1, y1], [x2, y2]], legs: true } },
      p: 'How long is the zip line from A' + pt(x1, y1) + ' to B' + pt(x2, y2) + '? (the <b>distance</b>)',
      ch: M.choices(W('d' + s2, right), [W('a', n(Math.abs(dx) + Math.abs(dy)), 'That walks along the grid (' + Math.abs(dx) + ' + ' + Math.abs(dy) + '). The zip line is the straight slant: use a² + b² = c².'), W('s', n(s2), 'You forgot the square root at the end: c = √' + s2 + '.'),
        W('m', sq(Math.abs(dx * dx - dy * dy)) === '0' ? '√2' : sq(Math.abs(dx * dx - dy * dy)), 'ADD the squares: ' + dx * dx + ' + ' + dy * dy + ', not subtract.')], [W('f', sq(s2 + 1), 'Square each change, add, then take the square root.')]),
      hint: 'Make a right triangle: across ' + Math.abs(dx) + ', up/down ' + Math.abs(dy) + '. Then d = √(' + Math.abs(dx) + '² + ' + Math.abs(dy) + '²).',
      steps: ln('d = √(' + Math.abs(dx) + '² + ' + Math.abs(dy) + '²)') + ln('= √(' + dx * dx + ' + ' + dy * dy + ') = √' + s2 + (right.charAt(0) !== '√' ? ' = ' + right : '')), yes: '' };
  }
  function perimArea() {
    var t = pick(TRIP.slice(0, 5)), a = t[0], b = t[1], c = Math.sqrt(a * a + b * b), x1 = rint(-8, 8 - a), y1 = rint(-8, 8 - b), askA = Math.random() < 0.5;
    var pts = [A(x1, y1, 'A', 'flag'), A(x1 + a, y1, 'B', 'flag'), A(x1 + a, y1 + b, 'C', 'flag')], per = a + b + c, area = a * b / 2;
    return { kind: askA ? 'area' : 'perim', rep: { pts: pts, segs: [], poly: [0, 1, 2], show: { poly: true } },
      p: 'A fence goes around the triangle A' + pt(x1, y1) + ', B' + pt(x1 + a, y1) + ', C' + pt(x1 + a, y1 + b) + '. Find the <b>' + (askA ? 'area' : 'perimeter (total fence length)') + '</b>.',
      ch: askA ? M.choices({ k: area, h: n(area) + ' square units' }, [W(a * b, n(a * b) + ' square units', 'A triangle is HALF of a rectangle: ½ · base · height.'), W('p' + per, n(per) + ' square units', 'That adds the sides (perimeter). Area = ½ · base · height.'), W(a * c / 2, n(a * c / 2) + ' square units', 'Use the height that makes a right angle with the base: ' + b + ', not the slanted side.')])
        : M.choices({ k: per, h: n(per) + ' units' }, [W(a + b, n(a + b) + ' units', 'You left out the slanted side AC. Find it with the distance formula: ' + c + '.'), W(a + b + a + b, n(2 * (a + b)) + ' units', 'A triangle has 3 sides: ' + a + ', ' + b + ' and the slant ' + c + '.'), W('ar' + area, n(area) + ' units', 'That is the area. Perimeter adds the 3 side lengths.')]),
      hint: askA ? 'Base AB = ' + a + ', height BC = ' + b + '. Area = ½ · base · height.' : 'AB = ' + a + ', BC = ' + b + '. Find AC with the distance formula, then add all three.',
      steps: askA ? ln('½ · ' + a + ' · ' + b + ' = ' + area) : ln('AC = √(' + a + '² + ' + b + '²) = ' + c) + ln(a + ' + ' + b + ' + ' + c + ' = ' + per), yes: '' };
  }
  /* ---------- parallel and perpendicular ---------- */
  var MS = [1, 2, 3, -1, -2, -3, 0.5, -0.5, 1 / 3, -1 / 3, 2 / 3, -2 / 3, 1.5, -1.5];
  function slopePP() {
    var m = pick(MS), par = Math.random() < 0.45, right = par ? m : -1 / m;
    function S(v, why) { return W('s' + v.toFixed(5), fr(v), why); }
    var b = rint(-4, 4);
    return { kind: 'slopePP', rep: { pts: [], segs: [], line: { m: m, b: b }, show: { line: { m: right, b: b + (par ? 3 : 0) }, ghost: true } },
      p: 'The road is <b>y = ' + (m === 1 ? '' : m === -1 ? '−' : cf(m)) + 'x' + (b ? (b < 0 ? ' − ' + n(-b) : ' + ' + b) : '') + '</b>. What is the slope of a road <b>' + (par ? 'parallel' : 'perpendicular') + '</b> to it?',
      ch: M.choices(S(right), par ? [S(-1 / m, 'That is the PERPENDICULAR slope. Parallel lines have the SAME slope.'), S(1 / m, 'Parallel lines have the SAME slope. Don’t flip it.'), S(-m, 'Parallel means the same slope, sign and all.')]
        : [S(m, 'That is the PARALLEL slope. Perpendicular: flip it AND change the sign.'), S(1 / m, 'You flipped it but kept the sign. Change the sign too.'), S(-m, 'You changed the sign but did not flip it. Do both.')], [S(right * 2, par ? 'Parallel means the SAME slope, not double.' : 'Check: the two slopes must multiply to \u22121.'), S(right + 1, par ? 'Parallel means the SAME slope.' : 'Check: the two slopes must multiply to \u22121.')]),
      hint: par ? 'Parallel lines never meet: same steepness, same slope.' : 'Perpendicular slopes are opposite reciprocals: flip the fraction and change the sign. Their product is −1.',
      steps: ln('Slope of the road: ' + fr(m)) + ln((par ? 'Parallel: same slope = ' : 'Perpendicular: −1 ÷ ' + fr(m) + ' = ') + fr(right)), yes: par ? '' : 'Check: ' + fr(m) + ' · ' + fr(right) + ' = −1.' };
  }
  function eqPP() {
    var m = pick([1, 2, 3, -1, -2, 0.5, -0.5]), par = Math.random() < 0.5, b = rint(-4, 4), mm = par ? m : -1 / m, x0, y0, bb;
    do { x0 = rint(-6, 6); y0 = rint(-6, 6); bb = y0 - mm * x0; } while (!Number.isInteger(bb) || Math.abs(bb) > 9 || bb === b);
    function E(mv, bv) { var ms = mv === 1 ? '' : mv === -1 ? '−' : cf(mv); return 'y = ' + ms + 'x' + (bv ? (bv < 0 ? ' − ' + n(-bv) : ' + ' + n(bv)) : ''); }
    function L(mv, bv, why) { return W('l' + mv.toFixed(4) + ',' + bv, E(mv, bv), why, { line: { m: mv, b: bv } }); }
    var other = par ? -1 / m : m, bo = y0 - other * x0;
    var wr = [L(mm, b, 'That keeps the old y-intercept. The new road must pass through ' + pt(x0, y0) + ': find its own b.'), L(mm, y0 + mm * x0, 'Check: b = y − m·x = ' + n(y0) + ' − (' + fr(mm) + ')(' + n(x0) + ').')];
    if (Number.isInteger(bo)) wr.push(L(other, bo, par ? 'That road is perpendicular. Parallel uses the SAME slope, ' + fr(m) + '.' : 'That road is parallel. Perpendicular uses the opposite reciprocal, ' + fr(-1 / m) + '.'));
    return { kind: 'eqPP', rep: { pts: [A(x0, y0, 'P', 'chest')], segs: [], line: { m: m, b: b }, show: { line: { m: mm, b: bb } } },
      p: 'Build a road through P' + pt(x0, y0) + ' that is <b>' + (par ? 'parallel' : 'perpendicular') + '</b> to <b>' + E(m, b) + '</b>. Which equation?',
      ch: M.choices(L(mm, bb), wr, [L(mm, bb + 1, 'Put P into y = mx + b and solve for b.')]),
      hint: 'Slope: ' + (par ? 'the same, ' + fr(m) : 'opposite reciprocal, ' + fr(mm)) + '. Then put P' + pt(x0, y0) + ' into y = mx + b to find b.',
      steps: ln('m = ' + fr(mm)) + ln(n(y0) + ' = ' + fr(mm) + '(' + n(x0) + ') + b → b = ' + n(bb)) + ln(E(mm, bb)), yes: '' };
  }
  function rightTri() {
    var u = pick([[2, 1], [3, 1], [1, 2], [3, 2], [2, 3], [1, 3]]), k = pick([1, 2]), isR = Math.random() < 0.5;
    var bx = rint(-3, 2), by = rint(-3, 1), v = isR ? [-u[1] * k, u[0] * k] : [-u[1] * k + pick([1, -1]), u[0] * k];
    var Ap = [bx + u[0] * 2, by + u[1] * 2], Cp = [bx + v[0], by + v[1]];
    if (!v[0] || [Ap, Cp].some(function (p) { return Math.abs(p[0]) > 9 || Math.abs(p[1]) > 9; })) return rightTri();   // no vertical side: keep both slopes defined
    var m1 = u[1] / u[0], m2 = v[0] ? v[1] / v[0] : Infinity, prodv = m1 * m2;
    var isRight = Math.abs(u[0] * v[0] + u[1] * v[1]) < 1e-9;
    var ch = [{ h: 'Yes: the slopes of BA and BC multiply to −1', ok: isRight, why: 'Multiply the slopes: ' + fr(m1) + ' · ' + (isFinite(m2) ? fr(m2) : 'undefined') + (isFinite(m2) ? ' = ' + fr(prodv) : '') + '. That is not −1, so no right angle.' },
      { h: 'No: the slopes are not opposite reciprocals', ok: !isRight, why: 'Multiply the slopes: ' + fr(m1) + ' · ' + fr(m2) + ' = −1. They ARE opposite reciprocals: a right angle.' },
      { h: 'Yes: it looks like a right angle', ok: false, why: 'Looks can fool you. PROVE it: perpendicular slopes multiply to −1.' }];
    return { kind: 'rightTri', rep: { pts: [A(Ap[0], Ap[1], 'A', 'flag'), A(bx, by, 'B', 'tower'), A(Cp[0], Cp[1], 'C', 'flag')], segs: [[0, 1], [1, 2], [2, 0]], show: { ra: isRight } },
      p: 'Is the angle at B a <b>right angle</b>? A' + pt(Ap[0], Ap[1]) + ', B' + pt(bx, by) + ', C' + pt(Cp[0], Cp[1]) + '.', ch: ch,
      hint: 'Find the slope of BA and the slope of BC. Perpendicular slopes multiply to −1.',
      steps: ln('slope BA = ' + fr(m1) + ', slope BC = ' + (isFinite(m2) ? fr(m2) : 'undefined')) + ln(isRight ? 'Product = −1 → right angle' : 'Product ≠ −1 → not a right angle'), yes: '' };
  }
  function classify() {
    var t = pick([0, 1, 2, 3]), u, v;
    if (t === 0) { u = pick([[3, 1], [2, 1], [1, 2], [4, 0]]); v = [-u[1], u[0]]; }                   // square
    else if (t === 1) { u = pick([[2, 1], [3, 1], [1, 2]]); var k = 2; v = [-u[1] * k, u[0] * k]; }   // rectangle
    else if (t === 2) { var R = pick([[[3, 4], [5, 0]], [[4, 3], [0, 5]], [[3, 4], [4, -3 + 0]], [[4, 3], [5, 0]]]); u = R[0]; v = R[1]; if (u[0] * v[0] + u[1] * v[1] === 0) { u = [3, 4]; v = [5, 0]; } }   // rhombus
    else { u = pick([[4, 0], [3, 1]]); v = pick([[1, 3], [2, 2], [1, 2]]); }                              // parallelogram
    var x0 = rint(-7, -1), y0 = rint(-7, -2), pts = [[x0, y0], [x0 + u[0], y0 + u[1]], [x0 + u[0] + v[0], y0 + u[1] + v[1]], [x0 + v[0], y0 + v[1]]];
    if (pts.some(function (p) { return Math.abs(p[0]) > 9 || Math.abs(p[1]) > 9; })) return classify();
    var L1 = u[0] * u[0] + u[1] * u[1], L2 = v[0] * v[0] + v[1] * v[1], perp = u[0] * v[0] + u[1] * v[1] === 0;
    var type = perp ? (L1 === L2 ? 0 : 1) : (L1 === L2 ? 2 : 3);
    var labs = ['Square', 'Rectangle (not a square)', 'Rhombus (not a square)', 'Parallelogram (not a rectangle or rhombus)'];
    var why = function (i) { var s = []; if ((i <= 1) !== perp) s.push(perp ? 'The slopes of two sides that meet multiply to −1: there ARE right angles.' : 'Two sides that meet do not have slopes that multiply to −1: no right angles.');
      if ((i === 0 || i === 2) !== (L1 === L2)) s.push(L1 === L2 ? 'All four sides are the SAME length (√' + L1 + ').' : 'The sides are NOT all the same length (√' + L1 + ' and √' + L2 + ').'); return s.join(' '); };
    return { kind: 'classify', rep: { pts: pts.map(function (p, i) { return A(p[0], p[1], 'ABCD'.charAt(i), 'flag'); }), segs: [[0, 1], [1, 2], [2, 3], [3, 0]], show: { poly4: true } },
      p: 'Classify the field ABCD: A' + pt(pts[0][0], pts[0][1]) + ', B' + pt(pts[1][0], pts[1][1]) + ', C' + pt(pts[2][0], pts[2][1]) + ', D' + pt(pts[3][0], pts[3][1]) + '.',
      ch: labs.map(function (h, i) { return { h: h, ok: i === type, why: why(i) || 'Check both: side lengths AND right angles.' }; }),
      hint: 'Check two things. Right angles? (slopes multiply to −1). All sides equal? (distance formula).',
      steps: ln('AB = √' + L1 + ', BC = √' + L2) + ln(perp ? 'Slopes multiply to −1: right angles' : 'No right angles') + ln('So it is a ' + labs[type].split(' (')[0].toLowerCase() + '.'), yes: '' };
  }

  var MAKERS = { mid: mid, endpoint: endpoint, partition: partition, dist: dist, perim: function () { var q; do { q = perimArea(); } while (q.kind !== 'perim'); return q; }, area: function () { var q; do { q = perimArea(); } while (q.kind !== 'area'); return q; },
    slopePP: slopePP, eqPP: eqPP, rightTri: rightTri, classify: classify };
  function verify(q) {
    var r = q.ch.filter(function (c) { return c.ok; })[0], R = q.rep;
    if (q.kind === 'mid' && r.at.pt[0] * 2 !== R.pts[0].x + R.pts[1].x) return 'mid';
    if (q.kind === 'endpoint' && r.at.pt[0] !== 2 * R.pts[1].x - R.pts[0].x) return 'end';
    if (q.kind === 'eqPP') { var L = r.at.line, P0 = R.pts[0]; if (Math.abs(L.m * P0.x + L.b - P0.y) > 1e-9) return 'line misses P'; if (!(Math.abs(L.m - R.line.m) < 1e-9 || Math.abs(L.m * R.line.m + 1) < 1e-9)) return 'slope'; }
    if (q.kind === 'classify' && q.ch.filter(function (c) { return c.ok; }).length !== 1) return 'cls';
    return '';
  }
  window.ISQ = { make: function (k) { return MAKERS[k](); }, MAKERS: MAKERS, verify: verify };
})();
