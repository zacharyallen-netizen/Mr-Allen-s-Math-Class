/* Factor Forge — question makers (Math 1 Unit 6: polynomial operations, factoring, solving quadratics).
   A polynomial is {2: a, 1: b, 0: c}. A factoring choice carries `at` = its factors (each a list of [coef, power]) so the forge
   can pour it into the box-method mold and show which cells do not match. q.rep = { t:'box', target, f } | { t:'text', text }. */
(function () {
  var M = window.M1, n = M.n, rint = M.rint, pick = M.pick;
  function W(k, h, why, at) { return { k: String(k), h: h, why: why, at: at }; }
  function num(v, why) { return W(v, n(v), why); }
  function ln(s) { return '<span class="ln">' + s + '</span>'; }
  function nz(a, b) { var v; do { v = rint(a, b); } while (!v); return v; }
  // ---- polynomial helpers ----
  function mul(f1, f2) { var p = {}; f1.forEach(function (s) { f2.forEach(function (t) { var k = s[1] + t[1]; p[k] = (p[k] || 0) + s[0] * t[0]; }); }); return p; }
  function prod(fs) { var p = { 0: 1 }; fs.forEach(function (f) { var t = []; for (var k in p) t.push([p[k], +k]); p = mul(t, f); }); return p; }
  function same(p, q) { for (var k = 0; k <= 4; k++) if ((p[k] || 0) !== (q[k] || 0)) return false; return true; }
  function term(c, k, first) {
    if (!c) return '';
    var v = k === 0 ? '' : k === 1 ? 'x' : 'x<sup>' + k + '</sup>', a = Math.abs(c), s = (a === 1 && k ? '' : n(a)) + v;
    return first ? (c < 0 ? '−' : '') + s : (c < 0 ? ' − ' : ' + ') + s;
  }
  function ps(p) { var s = '', first = true; for (var k = 4; k >= 0; k--) if (p[k]) { s += term(p[k], k, first); first = false; } return s || '0'; }
  function fs(f) { return ps(f.reduce(function (o, t) { o[t[1]] = (o[t[1]] || 0) + t[0]; return o; }, {})); }
  function fac(list) { // list of factors → "3x(2x + 1)", "(x + 2)(x − 5)"
    return list.map(function (f) { return f.length === 1 ? fs(f) : '(' + fs(f) + ')'; }).join('');
  }
  function B(a, b) { return [[a, 1], [b, 0]]; }     // ax + b
  function FW(list, why, partial) { return W(JSON.stringify(list), fac(list), why, { f: list, partial: !!partial }); }   // partial = same product, not fully factored
  var ZERO = 'Multiply the factors back out (the mold) and compare with the problem.';

  /* ---------- Bench 1: multiply and combine ---------- */
  function mulBin() {
    var p = nz(-7, 7), q = nz(-7, 7), a = pick([1, 1, 1, 2, 3]), f = [B(a, p), B(1, q)], T = prod(f);
    var wr = [W('f', ps({ 2: a, 0: p * q }), 'You only multiplied First and Last. Don’t forget the Outer and Inner terms (the middle).'),
      W('s', ps({ 2: a, 1: p + q, 0: p * q }), a === 1 ? null : 'The x-terms are ' + n(a) + '·' + n(q) + 'x and ' + n(p) + 'x. Multiply the ' + a + ' too.'),
      W('m', ps({ 2: a, 1: p * q, 0: p + q }), 'Mixed up: the number term is the PRODUCT ' + n(p) + '·' + n(q) + '; the x-term comes from adding the outer and inner terms.'),
      W('g', ps({ 2: a, 1: -(a * q + p), 0: p * q }), 'Check the signs of the outer and inner terms.')].filter(function (w) { return w.why; });
    return { kind: 'mulBin', rep: { t: 'box', target: T, f: f, multiply: true },
      p: 'Forge it: multiply<span class="big">' + fac(f) + '</span>', ch: M.choices({ k: 'R', h: ps(T) }, wr.filter(function (w) { return w.h !== ps(T); }), [W('i', ps({ 2: a, 1: a * q - p, 0: p * q }), 'Check the sign of the inner term: ' + n(p) + ' \u00b7 x = ' + n(p) + 'x.'), W('j', ps({ 2: a, 1: a * q + p + 1, 0: p * q }), 'Combine the two x-terms carefully.')]),
      hint: 'Use the box: put ' + fs(f[0]) + ' on one side and ' + fs(f[1]) + ' on the other. Multiply each pair, then combine the x-terms.',
      steps: ln(fac(f) + ' = ' + ps(T)) + ln('x-terms: ' + n(a * q) + 'x + ' + (p < 0 ? '(' + n(p) + 'x)' : n(p) + 'x') + ' = ' + n(a * q + p) + 'x'), yes: '' };
  }
  function addSub() {
    var A = { 2: nz(-5, 6), 1: nz(-8, 8), 0: nz(-9, 9) }, Bp = { 2: nz(-5, 5), 1: nz(-8, 8), 0: nz(-9, 9) }, sub = Math.random() < 0.6, R = {}, bad = {}, k;
    for (k = 0; k <= 2; k++) { R[k] = A[k] + (sub ? -Bp[k] : Bp[k]); bad[k] = A[k] + (sub ? (k === 2 ? -Bp[k] : Bp[k]) : -Bp[k]); }
    var wr = [W('b', ps(bad), sub ? 'Subtracting a polynomial means subtracting EVERY term: distribute the − to all three terms.' : 'Adding keeps the signs of the second polynomial.'),
      W('x', ps({ 2: R[2], 1: R[1], 0: R[0] + (sub ? 2 * Bp[0] : -2 * Bp[0]) }), 'Check the number terms: ' + n(A[0]) + (sub ? ' − ' : ' + ') + '(' + n(Bp[0]) + ').'),
      W('p', ps({ 4: R[2], 2: R[1], 0: R[0] }), 'Adding or subtracting does not change the exponents. x² stays x².')];
    return { kind: 'addSub', rep: { t: 'text', text: '(' + ps(A).replace(/<sup>2<\/sup>/g, '²').replace(/<[^>]+>/g, '') + ') ' + (sub ? '−' : '+') + ' (' + ps(Bp).replace(/<sup>2<\/sup>/g, '²').replace(/<[^>]+>/g, '') + ')' },
      p: 'Simplify<span class="big">(' + ps(A) + ') ' + (sub ? '−' : '+') + ' (' + ps(Bp) + ')</span>', ch: M.choices({ k: 'R', h: ps(R) }, wr.filter(function (w) { return w.h !== ps(R); }), [W('z', ps({ 2: R[2], 1: R[1] + 1, 0: R[0] }), 'Combine like terms one at a time: x² with x², x with x, numbers with numbers.')]),
      hint: sub ? 'Change subtraction to adding the opposite: flip the sign of EVERY term in the second ( ). Then combine like terms.' : 'Combine like terms: x² with x², x with x, numbers with numbers.',
      steps: ln('x²: ' + n(A[2]) + (sub ? ' − ' : ' + ') + '(' + n(Bp[2]) + ') = ' + n(R[2])) + ln('x: ' + n(A[1]) + (sub ? ' − ' : ' + ') + '(' + n(Bp[1]) + ') = ' + n(R[1])) + ln('numbers: ' + n(A[0]) + (sub ? ' − ' : ' + ') + '(' + n(Bp[0]) + ') = ' + n(R[0])), yes: '' };
  }
  function gcf() {
    var g = pick([2, 3, 4, 5, 6]), a = pick([1, 2, 3, 5]), b = nz(-7, 7), x = Math.random() < 0.7 ? 1 : 0;
    if (a % 2 === 0 && b % 2 === 0) b += 1; if (a % 3 === 0 && b % 3 === 0) b += 1; if (!b) b = 1;
    var G = [[g, x]], f = [G, B(a, b).map(function (t) { return [t[0], t[1] + (x ? 0 : 0)]; })];
    var inner = [[a, 1], [b, 0]], T = prod([G, inner]);
    return { kind: 'gcf', rep: { t: 'box', target: T, f: [G, inner] },
      p: 'Factor out the <b>GCF</b> (greatest common factor):<span class="big">' + ps(T) + '</span>',
      ch: M.choices(FW([G, inner]), [x ? FW([[g, 0], [[a, 2], [b, 1]]], 'Not fully factored: x is in both terms too. Take out ' + n(g) + 'x.', 1) : FW([[1, 0], [[g * a, 1], [g * b, 0]]], 'Take out the biggest number that divides both: ' + g + '.', 1),
        FW([[1, x], [[g * a, 1], [g * b, 0]]], 'Not fully factored: ' + g + ' divides both numbers too.', 1),
        FW([[g, x], [[a, 1], [g * b, 0]]], 'Divide EVERY term by the GCF. ' + n(g * b) + (x ? 'x' : '') + ' ÷ ' + g + (x ? 'x' : '') + ' = ' + n(b) + '.')]),
      hint: 'Find the biggest number AND the most x’s that go into every term. Divide each term by it.', steps: ln('GCF = ' + fs(G)) + ln(ps(T) + ' = ' + fac([G, inner])), yes: 'Check: distribute to get back ' + ps(T) + '.' };
  }
  /* ---------- Bench 2: factor a = 1 ---------- */
  function fac1() {
    var p, q; do { p = nz(-9, 9); q = nz(-9, 9); } while (p === -q || p === q && Math.random() < .7);
    var f = [B(1, p), B(1, q)], T = prod(f), wr = [FW([B(1, -p), B(1, -q)], 'Check the signs: multiply it back out. The middle term comes out ' + n(-(p + q)) + 'x, not ' + n(p + q) + 'x.')];
    // a pair with the right product and the wrong sum
    for (var d = 1; d <= Math.abs(p * q); d++) if ((p * q) % d === 0) { var e = p * q / d; [[d, e], [-d, -e]].forEach(function (pr) { if (pr[0] + pr[1] !== p + q && wr.length < 3) wr.push(FW([B(1, pr[0]), B(1, pr[1])], 'Those multiply to ' + n(p * q) + ', but they add to ' + n(pr[0] + pr[1]) + '. You need two numbers that ADD to ' + n(p + q) + '.')); }); }
    wr.push(FW([B(1, p + q), B(1, 1)], 'Multiply it back out: the number term would be ' + n(p + q) + ', not ' + n(p * q) + '.'));
    return { kind: 'fac1', rep: { t: 'box', target: T, f: f },
      p: 'Factor<span class="big">' + ps(T) + '</span>', ch: M.choices(FW(f), wr.filter(function (w) { return !same(prod(w.at.f), T); })),
      hint: 'Find two numbers that MULTIPLY to ' + n(p * q) + ' and ADD to ' + n(p + q) + '.',
      steps: ln(n(p) + ' · ' + n(q) + ' = ' + n(p * q) + ' and ' + n(p) + ' + ' + n(q) + ' = ' + n(p + q)) + ln(ps(T) + ' = ' + fac(f)), yes: '' };
  }
  /* ---------- Bench 3: a > 1 and difference of squares ---------- */
  function facA() {
    var a, p, q, T, f, tries = 0;
    do { a = pick([2, 3, 5]); p = nz(-5, 5); q = nz(-5, 5); f = [B(a, p), B(1, q)]; T = prod(f); tries++; } while (p % a === 0 && tries < 50);
    var wr = [FW([B(a, q), B(1, p)], 'Swapped: multiply back out. The middle would be ' + n(a * p + q) + 'x, not ' + n(a * q + p) + 'x.'),
      FW([B(a, -p), B(1, -q)], 'Check the signs: the middle would be ' + n(-(a * q + p)) + 'x.'),
      FW([B(a, p * q), B(1, 1)], 'The numbers ' + n(p * q) + ' and 1 multiply to ' + n(p * q) + ', but the middle would be ' + n(a + p * q) + 'x.'),
      FW([B(1, p), B(a, q)], 'Multiply back out: the middle would be ' + n(a * p + q) + 'x.')];
    return { kind: 'facA', rep: { t: 'box', target: T, f: f },
      p: 'Factor<span class="big">' + ps(T) + '</span>', ch: M.choices(FW(f), wr.filter(function (w) { return !same(prod(w.at.f), T); }), [FW([B(a, p + 1), B(1, q)], ZERO)]),
      hint: 'The first terms must multiply to ' + a + 'x² and the last terms to ' + n(p * q) + '. Try each pair in the box until the x-terms add to ' + n(a * q + p) + 'x.',
      steps: ln('Box: ' + a + 'x², ' + n(a * q) + 'x, ' + n(p) + 'x, ' + n(p * q)) + ln(n(a * q) + 'x + ' + (p < 0 ? '(' + n(p) + 'x)' : n(p) + 'x') + ' = ' + n(a * q + p) + 'x ✓') + ln(ps(T) + ' = ' + fac(f)), yes: '' };
  }
  function dos() {
    var a = pick([1, 1, 1, 2, 3]), k = rint(2, 9), f = [B(a, k), B(a, -k)], T = prod(f);
    return { kind: 'dos', rep: { t: 'box', target: T, f: f },
      p: 'Factor (difference of squares)<span class="big">' + ps(T) + '</span>',
      ch: M.choices(FW(f), [FW([B(a, -k), B(a, -k)], 'That makes a middle term of ' + n(-2 * a * k) + 'x. One sign must be + and one must be − so the middle cancels.'),
        FW([B(a, k), B(a, k)], 'That makes a middle term of ' + n(2 * a * k) + 'x and + ' + k * k + '. Use one + and one −.'),
        FW([B(a, -k * k), B(a, 1)], 'Use the square roots: √' + (k * k) + ' = ' + k + '.')]),
      hint: 'a² − b² = (a + b)(a − b). What is squared to make ' + ps({ 2: a * a }) + '? What is squared to make ' + k * k + '?',
      steps: ln(ps({ 2: a * a }) + ' = (' + fs([[a, 1]]) + ')² and ' + k * k + ' = ' + k + '²') + ln(ps(T) + ' = ' + fac(f)), yes: 'The +' + k + ' and −' + k + ' make the middle cancel.' };
  }
  /* ---------- Bench 4: solve by factoring, square roots ---------- */
  function sol(a, b, why) { var s = [a, b].sort(function (u, v) { return u - v; }); return W('x' + s.join(','), s[0] === s[1] ? 'x = ' + n(s[0]) : 'x = ' + n(s[0]) + ' or x = ' + n(s[1]), why); }
  function zeros() {
    var p = nz(-8, 8), q; do { q = nz(-8, 8); } while (q === p || q === -p);
    var f = [B(1, -p), B(1, -q)];
    return { kind: 'zeros', rep: { t: 'text', text: fac(f).replace(/<[^>]+>/g, '') + ' = 0' },
      p: 'Solve<span class="big">' + fac(f) + ' = 0</span>', ch: M.choices(sol(p, q), [sol(-p, -q, 'Set each factor equal to 0: ' + fs(B(1, -p)) + ' = 0 means x = ' + n(p) + '. The sign flips.'), sol(-p, q, 'Check the first factor: ' + fs(B(1, -p)) + ' = 0 means x = ' + n(p) + '.'), sol(p, -q, 'Check the second factor: ' + fs(B(1, -q)) + ' = 0 means x = ' + n(q) + '.')]),
      hint: 'Zero Product Property: if two factors multiply to 0, one of them is 0. Set each ( ) = 0.', steps: ln(fs(B(1, -p)) + ' = 0 → x = ' + n(p)) + ln(fs(B(1, -q)) + ' = 0 → x = ' + n(q)), yes: '' };
  }
  function solveFac() {
    var p = nz(-7, 7), q; do { q = nz(-7, 7); } while (q === p || q === -p);
    var T = prod([B(1, -p), B(1, -q)]);
    return { kind: 'solveFac', rep: { t: 'box', target: T, f: [B(1, -p), B(1, -q)] },
      p: 'Solve by factoring<span class="big">' + ps(T) + ' = 0</span>', ch: M.choices(sol(p, q), [sol(-p, -q, 'You factored right but stopped too soon: ' + fs(B(1, -p)) + ' = 0 gives x = ' + n(p) + '. The sign flips.'), sol(p * q, 1, 'Factor first, then set each factor to 0.'), sol(p, -q, 'Check each factor’s sign.')]),
      hint: 'Factor ' + ps(T) + ' first. Then set each factor equal to 0.', steps: ln(ps(T) + ' = ' + fac([B(1, -p), B(1, -q)])) + ln('x = ' + n(p) + ' or x = ' + n(q)), yes: '' };
  }
  function sqrtSolve() {
    var k = rint(2, 12), c = rint(0, 20), a = pick([1, 1, 2]), rhs = a * k * k + c;
    var eq = (a > 1 ? a : '') + 'x<sup>2</sup>' + (c ? ' + ' + c : '') + ' = ' + rhs;
    return { kind: 'sqrtSolve', rep: { t: 'text', text: eq.replace(/<sup>2<\/sup>/, '²') },
      p: 'Solve with square roots<span class="big">' + eq + '</span>',
      ch: M.choices(W('pm', 'x = ' + k + ' or x = −' + k), [W('p', 'x = ' + k, 'There are TWO square roots: ' + k + ' and −' + k + '. Both work.'), W('h', 'x = ' + (k * k / 2) + ' or x = −' + (k * k / 2), 'x² means x times x. Undo it with a square ROOT, not ÷ 2.'),
        W('r', 'x = ' + rhs + ' or x = −' + rhs, 'Get x² alone first' + (c || a > 1 ? ': undo the ' + (c ? '+ ' + c : '') + (c && a > 1 ? ' and the ' : '') + (a > 1 ? '× ' + a : '') : '') + ', then take the square root.')]),
      hint: 'Get x² alone. Then take the square root of both sides. Remember ±.',
      steps: (c ? ln((a > 1 ? a : '') + 'x² = ' + (rhs - c)) : '') + (a > 1 ? ln('x² = ' + k * k) : '') + ln('x = ±√' + k * k + ' = ±' + k), yes: '' };
  }
  /* ---------- Bench 5: completing the square, discriminant, quadratic formula ---------- */
  function complete() {
    var h = nz(-6, 6), c = rint(-10, 15), b = 2 * h, k = c - h * h, T = { 2: 1, 1: b, 0: c };
    function vf(hh, kk) { return '(x ' + (hh < 0 ? '− ' + n(-hh) : '+ ' + n(hh)) + ')<sup>2</sup>' + (kk ? (kk < 0 ? ' − ' + n(-kk) : ' + ' + n(kk)) : ''); }
    return { kind: 'complete', rep: { t: 'text', text: ps(T).replace(/<sup>2<\/sup>/, '²') },
      p: 'Complete the square: rewrite<span class="big">' + ps(T) + '</span>', ch: M.choices(W('R', vf(h, k)), [W('b', vf(b, c - b * b), 'Use HALF of the x-coefficient: ' + n(b) + ' ÷ 2 = ' + n(h) + '.'), W('c', vf(h, c), 'Adding ' + h * h + ' to make the square means you must also SUBTRACT ' + h * h + ': ' + n(c) + ' − ' + h * h + ' = ' + n(k) + '.'),
        W('s', vf(h, c + h * h), 'You added ' + h * h + ' to make the square, so subtract it: ' + n(c) + ' − ' + h * h + '.'), W('n', vf(-h, k), 'Check the sign inside: ' + n(b) + 'x means (x ' + (h < 0 ? '− ' : '+ ') + Math.abs(h) + ')².')]),
      hint: 'Half of ' + n(b) + ' is ' + n(h) + ', and ' + n(h) + '² = ' + h * h + '. Add AND subtract ' + h * h + '.',
      steps: ln('x² ' + (b < 0 ? '− ' : '+ ') + Math.abs(b) + 'x + ' + h * h + ' − ' + h * h + (c < 0 ? ' − ' + n(-c) : ' + ' + c)) + ln('= ' + vf(h, k)), yes: 'The vertex is (' + n(-h) + ', ' + n(k) + ').' };
  }
  function discrim() {
    var a = nz(-3, 4), b = rint(-8, 8), c = nz(-9, 9), t = pick([0, 1, 2]);
    if (t === 1) { var r = nz(-5, 5); a = pick([1, 1, 2]); b = -2 * a * r; c = a * r * r; }
    var D = b * b - 4 * a * c, ns = D > 0 ? 2 : D === 0 ? 1 : 0, T = { 2: a, 1: b, 0: c };
    var labs = ['2 real solutions', '1 real solution', 'No real solutions'], ix = [2, 1, 0].indexOf(ns);
    return { kind: 'discrim', rep: { t: 'text', text: ps(T).replace(/<sup>2<\/sup>/, '²').replace(/<[^>]+>/g, '') + ' = 0' },
      p: 'Use the <b>discriminant</b> b² − 4ac. How many real solutions does this have?<span class="big">' + ps(T) + ' = 0</span>',
      ch: labs.map(function (h, i) { return { h: h, ok: i === ix, why: 'b² − 4ac = ' + (b < 0 ? '(' + n(b) + ')' : n(b)) + '² − 4(' + n(a) + ')(' + n(c) + '). Positive = 2, zero = 1, negative = none.' + (b * b + 4 * a * c === D ? '' : '') }; }),
      hint: 'a = ' + n(a) + ', b = ' + n(b) + ', c = ' + n(c) + '. Work out b² − 4ac. Watch the signs.',
      steps: ln('b² − 4ac = ' + b * b + ' − ' + (4 * a * c < 0 ? '(' + n(4 * a * c) + ')' : n(4 * a * c)) + ' = ' + n(D)) + ln(D > 0 ? 'Positive → 2 real solutions' : D === 0 ? 'Zero → 1 real solution' : 'Negative → no real solutions'), yes: '' };
  }
  function quadForm() {
    var a = pick([1, 2, 3]), r1 = nz(-6, 6), r2den = a, r2num; do { r2num = nz(-9, 9); } while (r2num % a !== 0 && a === 1 || r2num / a === r1);
    // a(x − r1)(x − r2num/a) → (x − r1)(ax − r2num)
    var T = prod([B(1, -r1), B(a, -r2num)]), b = T[1], c = T[0], D = b * b - 4 * a * c, s = Math.sqrt(D);
    var x1 = (-b + s) / (2 * a), x2 = (-b - s) / (2 * a);
    function fmt(v) { if (Number.isInteger(v)) return n(v); var d = 2 * a; var nn = Math.round(v * d); var g = gcd(Math.abs(nn), d); return (nn < 0 ? '−' : '') + Math.abs(nn) / g + '/' + d / g; }
    function sv(u, v, why) { var o = [u, v].sort(function (p, q) { return p - q; }); return W('q' + o.map(function (z) { return z.toFixed(4); }).join(','), 'x = ' + fmt(o[0]) + ' or x = ' + fmt(o[1]), why); }
    return { kind: 'quadForm', rep: { t: 'text', text: ps(T).replace(/<sup>2<\/sup>/, '²').replace(/<[^>]+>/g, '') + ' = 0' },
      p: 'Use the <b>quadratic formula</b> to solve<span class="big">' + ps(T) + ' = 0</span>',
      ch: M.choices(sv(x1, x2), [sv((b + s) / (2 * a), (b - s) / (2 * a), 'The formula starts with −b. Here b = ' + n(b) + ', so −b = ' + n(-b) + '.'),
        sv(-b / (2 * a) + s, -b / (2 * a) - s, 'Divide the WHOLE top (−b ± √…) by 2a, not just −b.'),
        sv((-b + s) / a, (-b - s) / a, 'The bottom is 2a = ' + 2 * a + ', not a.')], [sv(x1 + 1, x2 + 1, 'Work it one step at a time: \u2212b, then \u00b1 \u221a(b\u00b2 \u2212 4ac), then \u00f7 2a.'), sv(x1, -x1 === x2 ? x2 + 2 : -x1, 'Check the second answer: use \u2212 in place of +.')]),
      hint: 'a = ' + a + ', b = ' + n(b) + ', c = ' + n(c) + '. b² − 4ac = ' + D + ', and √' + D + ' = ' + s + '.',
      steps: ln('x = (' + n(-b) + ' ± √' + D + ') ÷ ' + 2 * a) + ln('= (' + n(-b) + ' ± ' + s + ') ÷ ' + 2 * a) + ln('x = ' + fmt(x1) + ' or x = ' + fmt(x2)), yes: '' };
  }
  function gcd(a, b) { return b ? gcd(b, a % b) : a; }

  var MAKERS = { mulBin: mulBin, addSub: addSub, gcf: gcf, fac1: fac1, facA: facA, dos: dos, zeros: zeros, solveFac: solveFac, sqrtSolve: sqrtSolve, complete: complete, discrim: discrim, quadForm: quadForm };
  function verify(q) {
    var r = q.ch.filter(function (c) { return c.ok; })[0];
    if (q.rep.t === 'box' && r.at) { if (!same(prod(r.at.f), q.rep.target)) return 'right factoring wrong'; }
    for (var i = 0; i < q.ch.length; i++) { var c = q.ch[i]; if (!c.ok && c.at && c.at.f && !c.at.partial && q.rep.target && same(prod(c.at.f), q.rep.target)) return 'wrong factoring is also right'; }
    if (q.rep.t === 'box' && !same(prod(q.rep.f), q.rep.target)) return 'mold wrong';
    return '';
  }
  window.FGQ = { make: function (k) { return MAKERS[k](); }, MAKERS: MAKERS, verify: verify, prod: prod, ps: ps, fs: fs, same: same };
})();
