/* Number Stations — question makers (Math 1 Unit 4: arithmetic + geometric sequences; bonus: series).
   Every maker returns { kind, seq (terms for the board), p, ch, hint, steps, yes, label (station sign), ans }.
   Wrong choices are common mistakes and each one names its mistake. Checked by _build/math1_arcade/test.js. */
(function () {
  var M = window.M1, n = M.n, rint = M.rint, pick = M.pick;
  function P(x) { return x < 0 ? '(' + n(x) + ')' : n(x); }            // number in a product
  function sgn(x) { return x < 0 ? ' − ' + n(-x) : ' + ' + n(x); }  // "+ 4" / "− 4"
  function lin(m, b) {                                                     // 4n − 1, −n + 3, 5n
    var s = m === 1 ? 'n' : m === -1 ? '−n' : n(m) + 'n';
    return b === 0 ? s : s + sgn(b);
  }
  var an = 'a<sub>n</sub>', a1 = 'a<sub>1</sub>', anm = 'a<sub>n−1</sub>';
  function sub(k) { return 'a<sub>' + k + '</sub>'; }
  function seqText(t) { return '<span class="big">' + t.map(n).join(', ') + ', …</span>'; }
  function W(k, h, why) { return { k: String(k), h: h, why: why }; }
  function num(v, why) { return W(v, n(v), why); }
  function ln(s) { return '<span class="ln">' + s + '</span>'; }

  /* ---------- sequence makers ---------- */
  function arith(o) {
    o = o || {};
    var d = o.d || pick(o.pos ? [2, 3, 4, 5, 6, 7, 8, 9] : [2, 3, 4, 5, 6, 7, 8, 9, -2, -3, -4, -5, -6, -7]);
    var A = o.a1 != null ? o.a1 : rint(o.lo != null ? o.lo : -8, o.hi != null ? o.hi : 25);
    return { a1: A, d: d, t: function (i) { return A + (i - 1) * d; } };
  }
  /* r is {p, q} (r = p/q). Fraction r only with a first term that keeps 6 terms whole. */
  function geo(o) {
    o = o || {};
    var opts = o.frac ? [[1, 2, [64, 96, 128, 160, 192]], [1, 3, [243, 486]]] :
      [[2, 1, [1, 2, 3, 4, 5, -1, -2, -3]], [3, 1, [1, 2, 3, 4, -1, -2]], [4, 1, [1, 2, 3]], [-2, 1, [1, 2, 3, -1]], [-3, 1, [1, 2]], [5, 1, [1, 2]]];
    if (o.noNeg) opts = opts.filter(function (x) { return x[0] > 0; });
    var c = pick(opts), p = c[0], q = c[1], A = pick(c[2]);
    function t(i) { var v = A; for (var k = 1; k < i; k++) v = v * p / q; return v; }
    return { a1: A, p: p, q: q, r: p / q, t: t, rs: q === 1 ? n(p) : (p < 0 ? '−' : '') + (q === 2 ? '½' : '⅓') };
  }
  function terms(s, k) { var a = []; for (var i = 1; i <= k; i++) a.push(s.t(i)); return a; }
  function fill(v, d) { return [num(v + d, 'Check your arithmetic. Work one step at a time.'), num(v - d, 'Check your arithmetic. Work one step at a time.'), num(v + 2 * d, 'Check your arithmetic.'), num(v - 2 * d, 'Check your arithmetic.')]; }

  /* ---------- Green Line: arithmetic ---------- */
  function aNext() {
    var s = arith(), t = terms(s, 6), d = s.d;
    return { kind: 'aNext', seq: t.slice(0, 4), ans: t[4], label: n(t[4]),
      p: 'Arithmetic sequence:' + seqText(t.slice(0, 4)) + 'What number is at the next station?',
      ch: M.choices({ k: t[4], h: n(t[4]) }, [
        num(t[3] - d, 'You went the wrong way. Each station ' + (d > 0 ? 'adds ' + d : 'subtracts ' + n(-d)) + ', so keep going that way.'),
        num(t[5], 'That is two stations ahead. Find only the NEXT one: one more jump.'),
        num(t[3] * 2, 'Doubling is a geometric pattern (multiply). This one ADDS the same amount each time.')
      ], fill(t[4], 1)),
      hint: 'Find d, the common difference: subtract a term from the next one. Then add d to the last term.',
      steps: ln('d = ' + n(t[1]) + ' − ' + P(t[0]) + ' = ' + n(d)) + ln(n(t[3]) + sgn(d) + ' = ' + n(t[4])),
      yes: 'Each station ' + (d > 0 ? 'adds ' + d : 'subtracts ' + n(-d)) + '.' };
  }
  function aD() {
    var s = arith(), t = terms(s, 4), d = s.d;
    return { kind: 'aD', seq: t, ans: d, label: 'd = ' + n(d),
      p: 'Arithmetic sequence:' + seqText(t) + 'What is the common difference d?',
      ch: M.choices({ k: d, h: n(d) }, [
        num(-d, 'You subtracted backwards. Do (next term) − (the term before it).'),
        num(2 * d, 'That is the change over TWO jumps. Use two terms that are next to each other.'),
        num(t[0], 'That is the first term a₁, not the change between terms.')
      ], fill(d, 1)),
      hint: 'd = (any term) − (the term right before it). Watch the sign: going down means d is negative.',
      steps: ln('d = ' + n(t[1]) + ' − ' + P(t[0]) + ' = ' + n(d)) + ln('Check: ' + n(t[2]) + ' − ' + P(t[1]) + ' = ' + n(d)),
      yes: 'd = ' + n(d) + (d < 0 ? ': the terms go DOWN, so d is negative.' : '.') };
  }
  function aN(big) {
    var s = arith(), N = big ? rint(20, 60) : rint(8, 15), v = s.t(N), d = s.d, A = s.a1, t = terms(s, 4);
    return { kind: big ? 'eBig' : 'aN', seq: t, ans: v, label: n(v),
      p: 'Arithmetic sequence:' + seqText(t) + (big ? 'EXPRESS! Jump straight to station ' + N + '. ' : '') + 'Find ' + sub(N) + '.',
      ch: M.choices({ k: v, h: n(v) }, [
        num(A + N * d, 'That is ' + N + ' jumps. From a₁ to ' + 'a' + N + ' is only ' + N + ' − 1 = ' + (N - 1) + ' jumps.'),
        num((N - 1) * d, 'You forgot to start at a₁. Add the first term to the jumps.'),
        num(A + (N - 2) * d, 'One jump short. From a₁ to a' + N + ' is ' + (N - 1) + ' jumps.'),
        num((A + N - 1) * d, 'Order of operations: do (n − 1)·d first, then add a₁.')
      ], fill(v, d)),
      hint: 'Use ' + an + ' = ' + a1 + ' + (n − 1)d. Here ' + a1 + ' = ' + n(A) + ', d = ' + n(d) + ', n = ' + N + '.',
      steps: ln(sub(N) + ' = ' + n(A) + ' + (' + N + ' − 1)·' + P(d)) + ln('= ' + n(A) + ' + ' + (N - 1) + '·' + P(d)) + ln('= ' + n(A) + sgn((N - 1) * d) + ' = ' + n(v)),
      yes: (N - 1) + ' jumps of ' + n(d) + ', starting at ' + n(A) + '.' };
  }

  /* ---------- Gold Line: geometric ---------- */
  function gNext(frac) {
    var s = geo({ frac: frac }), t = terms(s, 6), r = s.r, v = t[4];
    var wr = [
      num(t[3] + (t[3] - t[2]), 'You added the last change. A geometric pattern MULTIPLIES by the same number r each time.'),
      num(t[5], 'That is two stations ahead. Multiply by r only once.')
    ];
    if (s.q > 1) wr.push(num(t[3] * s.q / s.p, 'Wrong way: this pattern gets smaller. Multiply by r = ' + s.rs + ' (take ' + s.rs + ' of it).'));
    else if (r < 0) wr.push(num(-v, 'Watch the sign. r is negative, so the sign flips at every station.'));
    else wr.push(num(t[3] * r * 2, 'Multiply by r = ' + n(r) + ' only. Do not double it again.'));
    if (Number.isInteger(t[3] / r) && s.q === 1) wr.push(num(t[3] / r, 'That divides. Each term is the one before TIMES r.'));
    return { kind: frac ? 'gNextF' : 'gNext', seq: t.slice(0, 4), ans: v, label: n(v),
      p: 'Geometric sequence:' + seqText(t.slice(0, 4)) + 'What number is at the next station?',
      ch: M.choices({ k: v, h: n(v) }, wr, fill(v, Math.max(1, Math.abs(t[3] - t[2])))),
      hint: 'Find r, the common ratio: divide a term by the one before it. Then multiply the last term by r.',
      steps: ln('r = ' + n(t[1]) + ' ÷ ' + P(t[0]) + ' = ' + s.rs) + ln(n(t[3]) + ' · ' + (r < 0 ? '(' + s.rs + ')' : s.rs) + ' = ' + n(v)),
      yes: 'Each station multiplies by ' + s.rs + '.' };
  }
  function gR() {
    var s = geo({ frac: Math.random() < 0.3 }), t = terms(s, 4), r = s.r;
    function rw(p, q, why) { var v = p / q, h = q === 1 ? n(p) : (p * q < 0 ? '−' : '') + Math.abs(p) + '/' + Math.abs(q); return W('r' + v, h, why); }
    var right = rw(s.p, s.q);
    return { kind: 'gR', seq: t, ans: r, label: 'r = ' + s.rs,
      p: 'Geometric sequence:' + seqText(t) + 'What is the common ratio r?',
      ch: M.choices({ k: right.k, h: right.h }, [
        W('r' + (t[1] - t[0]), n(t[1] - t[0]), 'That is the difference (subtracting). For geometric, DIVIDE: next term ÷ the term before.'),
        rw(s.q, s.p, 'Upside down. Divide the NEXT term by the term BEFORE it.'),
        rw(-s.p, s.q, 'Check the sign. ' + (r < 0 ? 'The signs flip, so r is negative.' : 'The signs stay the same, so r is positive.')),
        rw(s.p * s.p, s.q * s.q, 'That is two jumps (r²). Use terms that are next to each other.')
      ], [rw(s.p + 1, s.q, 'Divide next ÷ before, then check with another pair.')]),
      hint: 'r = (any term) ÷ (the term right before it). Check it with a second pair.',
      steps: ln('r = ' + n(t[1]) + ' ÷ ' + P(t[0]) + ' = ' + s.rs) + ln('Check: ' + n(t[2]) + ' ÷ ' + P(t[1]) + ' = ' + s.rs),
      yes: 'r = ' + s.rs + '.' };
  }
  function gN(ctx) {
    var s, N, v;
    do { s = geo({ noNeg: !!ctx }); N = rint(5, 7); v = s.t(N); } while (Math.abs(v) > 50000 || ctx && (s.a1 < 2));
    var t = terms(s, 4), A = s.a1, r = s.r;
    var wr = [num(A * Math.pow(r, N), 'That is ' + N + ' jumps. The exponent is n − 1 = ' + (N - 1) + '.')];
    if (A !== 1) wr.push(num(Math.pow(A * r, N - 1), 'Raise only r to the power. Then multiply by a₁.'));
    wr.push(num(A * r * (N - 1), 'The exponent means multiply by r again and again, not times (n − 1).'));
    wr.push(num(A + (N - 1) * r, 'That ADDS r: an arithmetic formula. Geometric multiplies.'));
    var p = ctx ? 'Station 1 has ' + A + ' lanterns. Each station has ' + r + ' times as many lanterns as the one before. How many lanterns are at station ' + N + '?' + '<span class="lab"> (' + an + ' = ' + a1 + '·r<sup>n−1</sup>)</span>'
      : 'Geometric sequence:' + seqText(t) + 'Find ' + sub(N) + '.';
    return { kind: ctx ? 'eCtxG' : 'gN', seq: ctx ? null : t, ans: v, label: n(v), p: p,
      ch: M.choices({ k: v, h: n(v) }, wr, fill(v, Math.abs(r))),
      hint: 'Use ' + an + ' = ' + a1 + '·r<sup>n−1</sup>. Here ' + a1 + ' = ' + n(A) + ', r = ' + n(r) + ', n = ' + N + '.',
      steps: ln(sub(N) + ' = ' + n(A) + '·' + P(r) + '<sup>' + (N - 1) + '</sup>') + ln('= ' + n(A) + '·' + n(Math.pow(r, N - 1))) + ln('= ' + n(v)),
      yes: 'Multiply by ' + n(r) + ' a total of ' + (N - 1) + ' times.' };
  }

  /* ---------- Blue Line: formulas ---------- */
  var KINDS = ['Arithmetic (add the same number)', 'Geometric (multiply by the same number)', 'Neither'];
  function classify() {
    var type = pick([0, 1, 2]), t, why;
    if (type === 0) t = terms(arith({ lo: 1, hi: 20 }), 5);
    else if (type === 1) t = terms(geo({ noNeg: Math.random() < 0.6 }), 5);
    else { var k = rint(1, 3); t = pick([[1, 4, 9, 16, 25], [2, 5, 10, 17, 26], [1, 2, 4, 7, 11], [3, 4, 6, 9, 13], [1, 3, 6, 10, 15], [2, 3, 5, 8, 13]]).map(function (x) { return x * k; }); }
    var df = [t[1] - t[0], t[2] - t[1], t[3] - t[2]].map(n).join(', ');
    var rt = t[0] !== 0 ? [t[1] / t[0], t[2] / t[1]].map(function (x) { return Number.isInteger(x) ? n(x) : n(+x.toFixed(2)); }).join(', ') : '';
    var whyA = 'The differences are ' + df + '. They are not all the same, so it is not arithmetic.';
    var whyG = 'The ratios (divide each term by the one before) are ' + rt + '. They are not all the same, so it is not geometric.';
    var whyN = type === 0 ? 'Look again: the differences are ' + df + '. They are all the same!' : 'Look again: divide each term by the one before: ' + rt + '. The ratios are all the same!';
    var ch = KINDS.map(function (h, i) { return { h: h, ok: i === type, why: i === 0 ? whyA : i === 1 ? whyG : whyN }; });
    return { kind: 'classify', seq: t.slice(0, 5), ans: type, label: ['Arithmetic', 'Geometric', 'Neither'][type],
      p: 'What kind of sequence is this?' + seqText(t), ch: ch,
      hint: 'Subtract each term from the next. All the same? Arithmetic. If not, divide each term by the one before. All the same? Geometric.',
      steps: ln('Differences: ' + df) + (rt ? ln('Ratios: ' + rt) : '') + ln('So it is ' + ['arithmetic', 'geometric', 'neither'][type] + '.'),
      yes: type === 2 ? 'The differences change and so do the ratios.' : '' };
  }
  function fArith(short) {
    var s, A, d;
    do { s = arith({ lo: 1, hi: 15 }); A = s.a1; d = s.d; } while (A === d || A - d === 0 || Math.abs(A) === Math.abs(d));
    var t = terms(s, 4);
    var right, wr;
    if (!short) {
      right = an + ' = ' + n(A) + ' + (n − 1)·' + P(d);
      wr = [W('sw', an + ' = ' + n(d) + ' + (n − 1)·' + P(A), 'You swapped a₁ and d. a₁ is the first term; d is the change.'),
        W('nn', an + ' = ' + n(A) + ' + n·' + P(d), 'Check n = 1: that gives ' + n(A + d) + ', not ' + n(A) + '. Use (n − 1).'),
        W('geo', an + ' = ' + n(A) + '·' + P(d) + '<sup>n−1</sup>', 'That multiplies: a geometric formula. This sequence ADDS ' + n(d) + '.')];
    } else {
      right = an + ' = ' + lin(d, A - d);
      wr = [W('b', an + ' = ' + lin(d, A), 'Check n = 1: that gives ' + n(A + d) + '. The number at the end is a₁ − d = ' + n(A - d) + '.'),
        W('sw', an + ' = ' + lin(A, d), 'Swapped: the number in front of n is d, the common difference.'),
        W('no', an + ' = ' + lin(d, 0), 'Check n = 1: you need ' + n(A) + '. Add the right number at the end.'),
        W('neg', an + ' = ' + lin(-d, A + d), 'Check the sign of d. ' + (d > 0 ? 'The terms go UP.' : 'The terms go DOWN.'))];
    }
    return { kind: short ? 'fArithS' : 'fArith', seq: t, ans: right, label: 'Formula ✓',
      p: 'Pick the explicit formula for' + seqText(t), ch: M.choices({ k: 'R', h: right }, wr),
      hint: 'a₁ = ' + n(A) + ' and d = ' + n(d) + '. Use ' + an + ' = ' + a1 + ' + (n − 1)d' + (short ? ', then simplify.' : '.') + ' Test n = 1: you must get ' + n(A) + '.',
      steps: ln(an + ' = ' + n(A) + ' + (n − 1)·' + P(d)) + (short ? ln('= ' + n(A) + sgn(d) + 'n' + sgn(-d)) + ln('= ' + lin(d, A - d)) : '') + ln('Check n = 1: ' + n(A) + ' ✓'),
      yes: 'Test it: n = 2 gives ' + n(t[1]) + '.' };
  }
  function fGeo() {
    var s; do { s = geo({}); } while (s.a1 === s.r || s.a1 === 1 && Math.random() < 0.5);
    var t = terms(s, 4), A = s.a1, r = s.r;
    var right = an + ' = ' + n(A) + '·' + P(r) + '<sup>n−1</sup>';
    return { kind: 'fGeo', seq: t, ans: right, label: 'Formula ✓',
      p: 'Pick the explicit formula for' + seqText(t),
      ch: M.choices({ k: 'R', h: right }, [
        W('sw', an + ' = ' + n(r) + '·' + P(A) + '<sup>n−1</sup>', 'Swapped: the base of the power is r, the number you multiply by. a₁ goes in front.'),
        W('n', an + ' = ' + n(A) + '·' + P(r) + '<sup>n</sup>', 'Check n = 1: that gives ' + n(A * r) + ', not ' + n(A) + '. The exponent is n − 1.'),
        W('ar', an + ' = ' + n(A) + ' + (n − 1)·' + P(r), 'That ADDS ' + n(r) + ': an arithmetic formula. This sequence multiplies.')
      ]),
      hint: 'a₁ = ' + n(A) + ' and r = ' + n(r) + '. Use ' + an + ' = ' + a1 + '·r<sup>n−1</sup>.',
      steps: ln('a₁ = ' + n(A) + ', r = ' + n(t[1]) + ' ÷ ' + P(t[0]) + ' = ' + n(r)) + ln(right) + ln('Check n = 1: ' + n(A) + '·' + P(r) + '<sup>0</sup> = ' + n(A) + ' ✓'),
      yes: '' };
  }
  function fRec(g) {
    var s, t, A, right, wr;
    if (!g) {
      do { s = arith({ lo: 1, hi: 20 }); } while (s.a1 === s.d || s.a1 === -s.d);
      t = terms(s, 4); A = s.a1;
      right = a1 + ' = ' + n(A) + ';&ensp;' + an + ' = ' + anm + sgn(s.d);
      wr = [W('sw', a1 + ' = ' + n(s.d) + ';&ensp;' + an + ' = ' + anm + sgn(A), 'Swapped. a₁ is the first term (' + n(A) + '); the change d (' + n(s.d) + ') goes after ' + 'aₙ₋₁' + '.'),
        W('x', a1 + ' = ' + n(A) + ';&ensp;' + an + ' = ' + anm + '·' + P(s.d), 'That multiplies. This sequence ADDS ' + n(s.d) + ' each time.'),
        W('sg', a1 + ' = ' + n(A) + ';&ensp;' + an + ' = ' + anm + sgn(-s.d), 'Check the sign. The terms go ' + (s.d > 0 ? 'UP' : 'DOWN') + '.'),
        W('a2', a1 + ' = ' + n(t[1]) + ';&ensp;' + an + ' = ' + anm + sgn(s.d), 'a₁ is the FIRST term, ' + n(A) + '.')];
    } else {
      do { s = geo({}); } while (s.a1 === s.r || s.a1 === 1);
      t = terms(s, 4); A = s.a1;
      right = a1 + ' = ' + n(A) + ';&ensp;' + an + ' = ' + anm + '·' + P(s.r);
      wr = [W('ad', a1 + ' = ' + n(A) + ';&ensp;' + an + ' = ' + anm + sgn(s.r), 'That adds ' + n(s.r) + '. This sequence MULTIPLIES by ' + n(s.r) + '.'),
        W('sw', a1 + ' = ' + n(s.r) + ';&ensp;' + an + ' = ' + anm + '·' + P(A), 'Swapped. a₁ is the first term (' + n(A) + '); r (' + n(s.r) + ') is what you multiply by.'),
        W('a2', a1 + ' = ' + n(t[1]) + ';&ensp;' + an + ' = ' + anm + '·' + P(s.r), 'a₁ is the FIRST term, ' + n(A) + '.'),
        W('df', a1 + ' = ' + n(A) + ';&ensp;' + an + ' = ' + anm + sgn(t[1] - t[0]), 'That adds the first difference. The differences change here; the ratio stays ' + n(s.r) + '.')];
    }
    return { kind: g ? 'fRecG' : 'fRecA', seq: t, ans: right, label: 'Recursive ✓',
      p: 'Pick the recursive formula for' + seqText(t) + '<span class="lab">(Recursive = first term + how to get each term from the one before.)</span>',
      ch: M.choices({ k: 'R', h: right }, wr),
      hint: 'Write the first term, then the rule: ' + an + ' = ' + anm + (g ? ' · r' : ' + d') + '.',
      steps: ln(a1 + ' = ' + n(A)) + ln(g ? 'r = ' + n(t[1]) + ' ÷ ' + P(t[0]) + ' = ' + n(s.r) : 'd = ' + n(t[1]) + ' − ' + P(t[0]) + ' = ' + n(s.d)) + ln(right),
      yes: '' };
  }
  function fA1() {
    var m, b;
    do { m = pick([2, 3, 4, 5, 6, 7, -2, -3, -4]); b = rint(-9, 12); } while (b === 0 || m + b === b || m + b === m || 2 * m + b === m || b === m);
    var askD = Math.random() < 0.4, v = askD ? m : m + b;
    var p = 'The explicit formula is<span class="big">' + an + ' = ' + lin(m, b) + '</span>' + (askD ? 'What is the common difference d?' : 'What is ' + a1 + ', the first term?');
    var wr = askD ? [num(b, n(b) + ' is the number added at the end. d is the number in front of n.'), num(m + b, 'That is a₁ (put n = 1). d is the change from one term to the next.'), num(-m, 'Check the sign of the number in front of n.')]
      : [num(b, n(b) + ' is what you get when n = 0. The first term uses n = 1.'), num(m, n(m) + ' is the common difference d. Put n = 1 into the formula.'), num(2 * m + b, 'That is a₂ (n = 2). The first term uses n = 1.')];
    return { kind: 'fA1', seq: null, ans: v, label: (askD ? 'd = ' : 'a₁ = ') + n(v), p: p,
      ch: M.choices({ k: v, h: n(v) }, wr, fill(v, 1)),
      hint: askD ? 'In ' + an + ' = dn + b, the number in front of n is d.' : 'Put n = 1 into the formula.',
      steps: askD ? ln('a₁ = ' + n(m + b) + ', a₂ = ' + n(2 * m + b)) + ln('d = ' + n(2 * m + b) + ' − ' + P(m + b) + ' = ' + n(m))
        : ln(a1 + ' = ' + n(m) + '(1)' + sgn(b)) + ln('= ' + n(m + b)),
      yes: '' };
  }

  /* ---------- Red Line: express ---------- */
  function eFindN() {
    var s, N, X;
    do { s = arith(); N = rint(10, 40); X = s.t(N); } while (Math.abs(X) > 400 || s.a1 === 0);
    var A = s.a1, d = s.d, t = terms(s, 4);
    var wr = [num(N - 1, 'That is the number of JUMPS. The station number is one more: jumps + 1.')];
    if (Number.isInteger(X / d) && X / d > 0) wr.push(num(X / d, 'Start from a₁: subtract ' + n(A) + ' first, then divide by d.'));
    if (Number.isInteger((X + A) / d) && (X + A) / d + 1 > 0) wr.push(num((X + A) / d + 1, 'Subtract a₁ (' + n(A) + '). Do not add it.'));
    wr.push(num(N + 1, 'Check: put your n into ' + a1 + ' + (n − 1)d. Do you get ' + n(X) + '?'));
    return { kind: 'eFindN', seq: t, ans: N, label: 'Stop ' + N,
      p: 'Arithmetic sequence:' + seqText(t) + 'Which station number n has the value <b class="num">' + n(X) + '</b>?',
      ch: M.choices({ k: N, h: 'n = ' + N }, wr.map(function (w) { return W(w.k, 'n = ' + w.h, w.why); }), [W(N - 2, 'n = ' + (N - 2), 'Check: put your n into the formula. Do you get ' + n(X) + '?'), W(N + 2, 'n = ' + (N + 2), 'Check: put your n into the formula.')]),
      hint: 'Set up ' + n(A) + ' + (n − 1)·' + P(d) + ' = ' + n(X) + '. Subtract ' + n(A) + ', divide by ' + n(d) + ', then add 1.',
      steps: ln(n(A) + ' + (n − 1)·' + P(d) + ' = ' + n(X)) + ln('(n − 1)·' + P(d) + ' = ' + n(X - A)) + ln('n − 1 = ' + (N - 1)) + ln('n = ' + N),
      yes: n(X) + ' is ' + (N - 1) + ' jumps after a₁, so it is station ' + N + '.' };
  }
  function eCtxA() {
    var A = rint(6, 30), d = rint(3, 9), N = rint(9, 20), v = A + (N - 1) * d;
    return { kind: 'eCtxA', seq: null, ans: v, label: n(v),
      p: 'A train has <b>' + A + '</b> riders at stop 1. At each stop after that, <b>' + d + '</b> more riders get on (no one gets off). How many riders are on the train at stop <b>' + N + '</b>?',
      ch: M.choices({ k: v, h: n(v) }, [
        num(A + N * d, 'That is ' + N + ' stops of new riders. From stop 1 to stop ' + N + ' there are ' + (N - 1) + ' stops where riders get on.'),
        num(N * d, 'You forgot the ' + A + ' riders who were already on at stop 1.'),
        num(A * N, 'That multiplies the first number. Riders are ADDED: ' + d + ' at each stop.')
      ], fill(v, d)),
      hint: 'This is arithmetic: a₁ = ' + A + ', d = ' + d + '. Use ' + an + ' = ' + a1 + ' + (n − 1)d.',
      steps: ln(sub(N) + ' = ' + A + ' + (' + N + ' − 1)·' + d) + ln('= ' + A + ' + ' + (N - 1) * d + ' = ' + v),
      yes: '' };
  }

  /* ---------- Purple Line: series (bonus) ---------- */
  function sArith(fromFormula) {
    var A, d, N, s;
    if (fromFormula) { var m = rint(2, 6), b = rint(-3, 6); N = pick([10, 12, 20]); A = m + b; d = m; }
    else { A = rint(1, 9); d = rint(1, 6); N = rint(6, 12); }
    var L = A + (N - 1) * d, S = N * (A + L) / 2, Sm = (N - 1) * (A + L - d) / 2;
    var p = fromFormula
      ? 'Add the first ' + N + ' terms of<span class="big">' + an + ' = ' + lin(d, A - d) + '</span>'
      : 'Riders get on at each station:' + seqText([A, A + d, A + 2 * d, A + 3 * d]) + 'for ' + N + ' stations. How many riders got on in all?';
    p += '<span class="lab">A <b>series</b> is the SUM of the terms. Shortcut: S = n(' + a1 + ' + ' + an + ') ÷ 2.</span>';
    return { kind: fromFormula ? 'sFormula' : 'sArith', seq: fromFormula ? null : [A, A + d, A + 2 * d, A + 3 * d], ans: S, label: 'Σ ' + n(S), p: p,
      ch: M.choices({ k: S, h: n(S) }, [
        num(N * (A + L), 'You forgot to divide by 2. Each pair (first + last) is counted twice that way.'),
        num(L, 'That is only the last term, ' + sub(N) + '. A series ADDS all ' + N + ' terms.'),
        num(Sm, 'You added only ' + (N - 1) + ' terms. There are ' + N + ' terms.'),
        num(A + L, 'That is one pair: first + last. Multiply by n = ' + N + ', then divide by 2.')
      ], fill(S, d)),
      hint: 'First find the last term: ' + sub(N) + ' = ' + n(A) + ' + (' + N + ' − 1)·' + n(d) + '. Then S = ' + N + '(first + last) ÷ 2.',
      steps: ln(sub(N) + ' = ' + n(A) + ' + ' + (N - 1) + '·' + n(d) + ' = ' + n(L)) + ln('S = ' + N + '(' + n(A) + ' + ' + n(L) + ') ÷ 2') + ln('= ' + N + '·' + n(A + L) + ' ÷ 2 = ' + n(S)),
      yes: 'Pair them up: ' + (N / 2 === Math.floor(N / 2) ? (N / 2) + ' pairs that each add to ' + n(A + L) + '.' : 'the average term ' + n((A + L) / 2) + ' times ' + N + ' terms.') };
  }
  function sGeo() {
    var A = rint(1, 5), r = pick([2, 3]), N = r === 2 ? rint(4, 6) : rint(4, 5), t = [], S = 0;
    for (var i = 0; i < N + 1; i++) t.push(A * Math.pow(r, i));
    for (i = 0; i < N; i++) S += t[i];
    return { kind: 'sGeo', seq: t.slice(0, 3), ans: S, label: 'Σ ' + n(S),
      p: 'Lanterns are hung at each station:' + seqText(t.slice(0, 3)) + '(each station has ' + r + ' times as many). How many lanterns at the first ' + N + ' stations in all?<span class="lab">A <b>series</b> is the SUM of the terms.</span>',
      ch: M.choices({ k: S, h: n(S) }, [
        num(t[N - 1], 'That is only the last station. Add ALL ' + N + ' stations.'),
        num(S - t[N - 1], 'You added only ' + (N - 1) + ' stations. There are ' + N + '.'),
        num(S + t[N], 'You added ' + (N + 1) + ' stations. Stop at station ' + N + '.'),
        num(A * r * N, 'That multiplies a₁·r·n. List the terms and add them.')
      ], fill(S, 1)),
      hint: 'List all ' + N + ' terms (keep multiplying by ' + r + '), then add them up.',
      steps: ln(t.slice(0, N).join(' + ')) + ln('= ' + S),
      yes: '' };
  }

  var MAKERS = { aNext: aNext, aD: aD, aN: function () { return aN(false); }, eBig: function () { return aN(true); },
    gNext: function () { return gNext(false); }, gNextF: function () { return gNext(true); }, gR: gR, gN: function () { return gN(false); },
    classify: classify, fArith: function () { return fArith(false); }, fArithS: function () { return fArith(true); }, fGeo: fGeo,
    fRecA: function () { return fRec(false); }, fRecG: function () { return fRec(true); }, fA1: fA1,
    eFindN: eFindN, eCtxA: eCtxA, eCtxG: function () { return gN(true); },
    sArith: function () { return sArith(false); }, sFormula: function () { return sArith(true); }, sGeo: sGeo };
  window.NSQ = { make: function (k) { return MAKERS[k](); }, MAKERS: MAKERS, lin: lin };
})();
