/* Drone Intercept — question makers (Math 1 Unit 3: systems of linear equations).
   A question carries the two lines (L1, L2) so the radar can fly the drones, and `pt` = where they cross
   (null for no solution / same line). Each choice may carry `at` (the point the net would fly to). */
(function () {
  var M = window.M1, n = M.n, rint = M.rint, pick = M.pick;
  function P(x) { return x < 0 ? '(' + n(x) + ')' : n(x); }
  function sgn(x) { return x < 0 ? ' − ' + n(-x) : ' + ' + n(x); }
  function term(c, v, first) {        // 3x, −x, + 2y …
    if (c === 0) return '';
    var a = Math.abs(c), s = (a === 1 ? '' : a) + v;
    return first ? (c < 0 ? '−' : '') + s : (c < 0 ? ' − ' : ' + ') + s;
  }
  function slopeTxt(m) { return m === 0.5 ? '½' : m === -0.5 ? '−½' : null; }
  function yEq(m, b) {                 // y = 2x − 3
    var mt = slopeTxt(m), s = mt ? mt + 'x' : m === 1 ? 'x' : m === -1 ? '−x' : m === 0 ? '' : n(m) + 'x';
    return 'y = ' + (s ? s + (b ? sgn(b) : '') : n(b));
  }
  function stdEq(A, B, C) { return term(A, 'x', true) + term(B, 'y', !A) + ' = ' + n(C); }
  function SI(m, b) { return { m: m, b: b, txt: yEq(m, b), y: function (x) { return m * x + b; }, on: function (x, y) { return Math.abs(m * x + b - y) < 1e-9; } }; }
  function ST(A, B, C) { return { m: -A / B, b: C / B, A: A, B: B, C: C, txt: stdEq(A, B, C), y: function (x) { return (C - A * x) / B; }, on: function (x, y) { return A * x + B * y === C; } }; }
  function mx(m, x) { return (m === 1 ? '' : m === -1 ? '\u2212' : n(m)) + '(' + n(x) + ')'; }
  function pt(x, y) { return '(' + n(x) + ', ' + n(y) + ')'; }
  function W(x, y, why) { return { k: x + ',' + y, h: pt(x, y), why: why, at: [x, y] }; }
  function eqs(a, b) { return '<span class="big">' + a.txt + '</span><span class="big">' + b.txt + '</span>'; }
  function ln(s) { return '<span class="ln">' + s + '</span>'; }
  var NOSOL = 'No solution (the paths never cross)', INF = 'Infinitely many (same path)';

  function pointWrongs(x0, y0, L1, extra) {
    var w = [];
    if (x0 !== y0) w.push(W(y0, x0, 'You swapped x and y. An ordered pair is (x, y): x first.'));
    if (y0 !== 0) w.push(W(x0, -y0, 'Check the sign of y. Put x = ' + n(x0) + ' back into an equation and work carefully.'));
    if (x0 !== 0) w.push(W(-x0, L1.y(-x0), 'Check the sign of x. That point is on one path but not on the other one.'));
    (extra || []).forEach(function (e) { w.unshift(e); });
    return w;
  }
  function fillers(x0, y0) { return [W(x0 + 1, y0, 'Check: put your point into BOTH equations. Both must be true.'), W(x0, y0 + 1, 'Check: put your point into BOTH equations.'), W(x0 - 1, y0 - 1, 'Check: put your point into BOTH equations.')]; }
  function goodPt(L1, L2, x0, y0) { return L1.on(x0, y0) && L2.on(x0, y0); }

  /* Radar: read the crossing from the graph (paths shown) */
  function graph() {
    var x0 = rint(-6, 6), y0 = rint(-6, 6), m1, m2;
    var ms = [1, 2, 3, -1, -2, -3, 0.5, -0.5];
    do { m1 = pick(ms); m2 = pick(ms); } while (m1 === m2 || (Math.abs(m1) === 0.5 || Math.abs(m2) === 0.5) && x0 % 2);
    var L1 = SI(m1, y0 - m1 * x0), L2 = SI(m2, y0 - m2 * x0);
    var w = [W(y0, x0, 'You swapped x and y. Go across first (x), then up or down (y).')];
    if (x0) w.push(W(-x0, y0, 'Check the sign of x: left of the center is negative, right is positive.'));
    if (y0) w.push(W(x0, -y0, 'Check the sign of y: below the center is negative, above is positive.'));
    w.push(W(x0 + 1, y0, 'Count the grid squares again from the center (0, 0).'));
    return { kind: 'graph', show: true, L1: L1, L2: L2, pt: [x0, y0],
      p: 'Read the radar. The two drone paths are shown. Where do they cross?' + eqs(L1, L2),
      ch: M.choices({ k: x0 + ',' + y0, h: pt(x0, y0) }, w, fillers(x0, y0)),
      hint: 'Find the spot where the two lines meet. Count across from the center for x, then up or down for y.',
      steps: ln('The lines meet at x = ' + n(x0) + ', y = ' + n(y0) + '.') + ln('Check in ' + L1.txt + ': ' + n(y0) + ' = ' + n(L1.y(x0)) + ' ✓'),
      yes: 'The solution of a system is where the lines cross.' };
  }
  /* Substitution: two y = lines → set them equal */
  function subst() {
    var x0 = rint(-6, 6), y0 = rint(-8, 8), m1, m2;
    do { m1 = rint(-4, 4); m2 = rint(-4, 4); } while (m1 === m2);
    var L1 = SI(m1, y0 - m1 * x0), L2 = SI(m2, y0 - m2 * x0);
    var extra = [W(x0, -m1 * x0 + L1.b === y0 ? y0 + 2 : m1 * x0 - L1.b, 'When you put x back in, keep the sign of b. y = ' + mx(m1, x0) + sgn(L1.b) + '.')];
    var bx = (L2.b - L1.b), dm = (m1 - m2);
    return { kind: 'subst', show: false, L1: L1, L2: L2, pt: [x0, y0],
      p: 'Both drones report their paths. Where do they cross?' + eqs(L1, L2),
      ch: M.choices({ k: x0 + ',' + y0, h: pt(x0, y0) }, pointWrongs(x0, y0, L1, extra).concat([{ k: 'none', h: NOSOL, why: 'The slopes are different (' + n(m1) + ' and ' + n(m2) + '), so the paths must cross exactly once.' }]), fillers(x0, y0)),
      hint: 'Both equations say "y =", so set the right sides equal: ' + L1.txt.slice(4) + ' = ' + L2.txt.slice(4) + '. Solve for x, then put x back in to find y.',
      steps: ln(L1.txt.slice(4) + ' = ' + L2.txt.slice(4)) + ln(term(dm, 'x', true) + ' = ' + n(bx)) + ln('x = ' + n(x0)) + ln('y = ' + mx(m1, x0) + sgn(L1.b) + ' = ' + n(y0)),
      yes: 'Check: ' + pt(x0, y0) + ' works in BOTH equations.' };
  }
  /* Substitution: y = line + standard-form line */
  function subst2() {
    var x0, y0, m, A, B, L1, L2;
    do { x0 = rint(-5, 5); y0 = rint(-6, 6); m = rint(-3, 3); A = rint(-4, 4); B = pick([1, 2, 3, -1, -2]); }
    while (!A || A === -B * m || Math.abs(A * x0 + B * y0) > 30);
    L1 = SI(m, y0 - m * x0); L2 = ST(A, B, A * x0 + B * y0);
    var coef = A + B * m, rhs = L2.C - B * L1.b;
    return { kind: 'subst2', show: false, L1: L1, L2: L2, pt: [x0, y0],
      p: 'Where do the drone paths cross?' + eqs(L1, L2),
      ch: M.choices({ k: x0 + ',' + y0, h: pt(x0, y0) }, pointWrongs(x0, y0, L1, [Math.abs(B) === 1 ? (A * x0 ? W(x0, B * (L2.C + A * x0), 'Moving the x-term: SUBTRACT ' + term(A, 'x', true) + ' from both sides, so its sign changes. Or put x into ' + L1.txt + '.') : null) : W(x0, (L2.C - A * x0) * B, 'To get y alone, DIVIDE by ' + n(B) + '. Easier: put x into ' + L1.txt + '.')].filter(Boolean))
        .concat([{ k: 'none', h: NOSOL, why: 'The slopes are different, so the paths cross exactly once.' }]), fillers(x0, y0)),
      hint: 'Substitute: replace y in the second equation with ' + L1.txt.slice(4) + '. Solve for x, then find y.',
      steps: ln(term(A, 'x', true) + (B === 1 ? ' + ' : B === -1 ? ' − ' : sgn(B) + '') + '(' + L1.txt.slice(4) + ') = ' + n(L2.C)) + ln(term(coef, 'x', true) + sgn(B * L1.b) + ' = ' + n(L2.C)) + ln(term(coef, 'x', true) + ' = ' + n(rhs)) + ln('x = ' + n(x0) + ',&ensp;y = ' + n(y0)),
      yes: 'Check: ' + pt(x0, y0) + ' works in BOTH equations.' };
  }
  /* Elimination: two standard-form lines */
  function elim() {
    var x0, y0, A1, B1, A2, B2, mode = pick(['add', 'sub', 'mul']);
    do {
      x0 = rint(-6, 6); y0 = rint(-6, 6); A1 = rint(-5, 5); B1 = rint(-5, 5);
      if (mode === 'add') { A2 = rint(-5, 5); B2 = -B1; }
      else if (mode === 'sub') { A2 = A1; B2 = rint(-5, 5); }
      else { A2 = rint(-5, 5); B2 = B1 * pick([2, 3, -2]); }
    } while (!A1 || !B1 || !A2 || !B2 || A1 * B2 - A2 * B1 === 0 || Math.abs(A1 * x0 + B1 * y0) > 40 || Math.abs(A2 * x0 + B2 * y0) > 40);
    var L1 = ST(A1, B1, A1 * x0 + B1 * y0), L2 = ST(A2, B2, A2 * x0 + B2 * y0);
    var how = mode === 'add' ? 'The y-terms are opposites. ADD the equations: the y’s cancel.' : mode === 'sub' ? 'The x-terms match. SUBTRACT the equations: the x’s cancel.' : 'Multiply the first equation by ' + n(B2 / B1) + ' so the y-terms match. Then subtract.';
    var st = mode === 'add' ? ln('Add: ' + term(A1 + A2, 'x', true) + ' = ' + n(L1.C + L2.C)) + ln('x = ' + n(x0))
      : mode === 'sub' ? ln('Subtract: ' + term(B1 - B2, 'y', true) + ' = ' + n(L1.C - L2.C)) + ln('y = ' + n(y0))
        : ln('×' + P(B2 / B1) + ': ' + stdEq(A1 * B2 / B1, B2, L1.C * B2 / B1)) + ln('Subtract: ' + term(A1 * B2 / B1 - A2, 'x', true) + ' = ' + n(L1.C * B2 / B1 - L2.C)) + ln('x = ' + n(x0));
    return { kind: 'elim', show: false, L1: L1, L2: L2, pt: [x0, y0],
      p: 'Where do the drone paths cross?' + eqs(L1, L2),
      ch: M.choices({ k: x0 + ',' + y0, h: pt(x0, y0) }, pointWrongs(x0, y0, L1).concat([{ k: 'none', h: NOSOL, why: 'When one variable cancels, the other one does NOT cancel here, so there is one crossing.' }]), fillers(x0, y0)),
      hint: how + ' Then put the value back into either equation.',
      steps: st + ln('Put it back in: ' + pt(x0, y0)), yes: 'Check: ' + pt(x0, y0) + ' works in BOTH equations.' };
  }
  /* How many solutions? (parallel / same line / one) */
  function count() {
    var type = pick([0, 1, 2]), m = pick(type === 2 ? [1, 2, 3, -1, -2] : [1, 2, 3, -1, -2, 0.5]), b1 = rint(-5, 5), b2, L1 = SI(m, b1), L2;
    if (type === 0) { var m2; do { m2 = pick([1, 2, 3, -1, -2, -3]); } while (m2 === m); L2 = SI(m2, rint(-5, 5)); }
    else if (type === 1) { do { b2 = rint(-6, 6); } while (b2 === b1); L2 = SI(m, b2); }
    else L2 = SI(m, b1);
    if ((type === 2 || Math.random() < 0.6) && Number.isInteger(L2.m)) { var k = pick([1, 2, 3, -2]); L2 = ST(-L2.m * k, k, L2.b * k); }   // y = mx + b → (−mk)x + ky = bk
    var x0 = type === 0 ? (L2.b - L1.b) / (L1.m - L2.m) : null;
    var ch = [
      { h: 'One solution (they cross once)', ok: type === 0, why: type === 1 ? 'Same slope, different y-intercepts: parallel paths never cross.' : 'Same slope AND same y-intercept: it is the same path, so every point works.' },
      { h: NOSOL, ok: type === 1, why: type === 0 ? 'The slopes are different, so the paths cross once.' : 'Same slope AND same y-intercept: it is the same path, so every point works.' },
      { h: INF, ok: type === 2, why: type === 0 ? 'The slopes are different, so the paths cross once.' : 'The slopes match but the y-intercepts are different, so the paths are parallel, not the same.' }
    ];
    var sl = function (L) { return 'slope ' + (slopeTxt(L.m) || n(L.m)) + ', y-intercept ' + n(L.b); };
    return { kind: 'count', show: false, L1: L1, L2: L2, pt: type === 0 ? [x0, L1.y(x0)] : null, type: type,
      p: 'Radar signal check: how many points do these paths share?' + eqs(L1, L2), ch: ch,
      hint: 'Write both as y = mx + b. Different slopes → one solution. Same slope, different b → no solution. Same slope and same b → infinitely many.',
      steps: ln('Path 1: ' + sl(L1)) + ln('Path 2: ' + sl(L2)) + ln(type === 0 ? 'Different slopes → one solution.' : type === 1 ? 'Same slope, different b → parallel → no solution.' : 'Same slope, same b → same line → infinitely many.'),
      yes: '' };
  }
  /* Word problem: two drones climbing */
  function word() {
    var t0 = rint(2, 9), r1 = rint(2, 6), r2, h1;
    do { r2 = rint(1, 7); } while (r2 === r1);
    h1 = rint(0, 12); var H = h1 + r1 * t0, h2 = H - r2 * t0;
    if (h2 < 0) return word();
    var L1 = SI(r1, h1), L2 = SI(r2, h2);
    L1.txt = 'h = ' + L1.txt.slice(4).replace(/x/g, 't'); L2.txt = 'h = ' + L2.txt.slice(4).replace(/x/g, 't');
    function tw(t, h, why) { return { k: t + ',' + h, h: t + ' min, ' + h + ' m high', why: why, at: [t, h] }; }
    return { kind: 'word', show: false, L1: L1, L2: L2, pt: [t0, H], unit: true,
      p: 'Drone A starts at <b>' + h1 + ' m</b> and climbs <b>' + r1 + ' m</b> each minute. Drone B starts at <b>' + h2 + ' m</b> and climbs <b>' + r2 + ' m</b> each minute. When are they at the same height?' + eqs(L1, L2),
      ch: M.choices({ k: t0 + ',' + H, h: t0 + ' min, ' + H + ' m high' }, [
        tw(H, t0, 'Swapped: t is the minutes and h is the height.'),
        tw(t0, h1 + r2 * t0, 'Check the height: put t = ' + t0 + ' into BOTH equations. They must match.'),
        tw(t0 + 1, h1 + r1 * (t0 + 1), 'At ' + (t0 + 1) + ' minutes the heights are different. Set the two equations equal.')
      ], [tw(t0 - 1, h1 + r1 * (t0 - 1), 'Set the two equations equal and solve for t.')]),
      hint: 'Set the heights equal: ' + h1 + ' + ' + r1 + 't = ' + h2 + ' + ' + r2 + 't. Solve for t, then find h.',
      steps: ln(h1 + ' + ' + r1 + 't = ' + h2 + ' + ' + r2 + 't') + ln(n(r1 - r2) + 't = ' + n(h2 - h1)) + ln('t = ' + t0 + ',&ensp;h = ' + h1 + ' + ' + r1 + '(' + t0 + ') = ' + H),
      yes: 'Both drones are ' + H + ' m high at ' + t0 + ' minutes.' };
  }

  function verify(q) {   // used by the tests: the right choice really is the crossing, wrong points are not
    var r = q.ch.filter(function (c) { return c.ok; })[0];
    if (q.kind === 'count') {
      var same = Math.abs(q.L1.m - q.L2.m) < 1e-9, sb = Math.abs(q.L1.b - q.L2.b) < 1e-9;
      var t = !same ? 0 : sb ? 2 : 1; return t === q.type ? '' : 'count type wrong';
    }
    var x = q.pt[0], y = q.pt[1];
    if (!(q.L1.on(x, y) && q.L2.on(x, y))) return 'pt not on both lines';
    if (r.k !== x + ',' + y) return 'right choice is not pt';
    for (var i = 0; i < q.ch.length; i++) { var c = q.ch[i]; if (!c.ok && c.at && q.L1.on(c.at[0], c.at[1]) && q.L2.on(c.at[0], c.at[1])) return 'a wrong point is a solution'; }
    if (q.L1.txt === q.L2.txt) return 'same equation';
    return '';
  }
  var MAKERS = { graph: graph, subst: subst, subst2: subst2, elim: elim, count: count, word: word };
  window.DIQ = { make: function (k) { return MAKERS[k](); }, MAKERS: MAKERS, verify: verify };
})();
