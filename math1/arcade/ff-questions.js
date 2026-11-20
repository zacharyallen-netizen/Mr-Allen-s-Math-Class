/* Firework Finale — question makers (Math 1 Unit 7: key features of quadratic functions).
   Every firework is y = a(x − h)² + k with a < 0 (it rises, bursts at the vertex, falls).
   q.f = { a, h, k } for the sky; each choice may carry `at` = what the shell aims at when that choice is tapped:
   { pt: [x, y] } a point, { y } a height, { x } an axis line, { zs: [p, q] } two landing spots. */
(function () {
  var M = window.M1, n = M.n, rint = M.rint, pick = M.pick;
  function fr(a) { return a === -0.5 ? '−½' : a === 0.5 ? '½' : a === -1 ? '−' : a === 1 ? '' : n(a); }
  function xm(h) { return h === 0 ? 'x' : '(x' + (h > 0 ? ' − ' + n(h) : ' + ' + n(-h)) + ')'; }
  function sgn(x) { return x < 0 ? ' − ' + n(-x) : ' + ' + n(x); }
  function vForm(a, h, k) { return 'y = ' + fr(a) + (h === 0 ? 'x' : xm(h)) + '<sup>2</sup>' + (k ? sgn(k) : ''); }
  function fForm(a, p, q) { return 'y = ' + fr(a) + xm(p) + xm(q); }
  function sForm(a, b, c) {
    var s = 'y = ' + fr(a) + 'x<sup>2</sup>';
    if (b) s += (b < 0 ? ' − ' : ' + ') + (Math.abs(b) === 1 ? '' : n(Math.abs(b))) + 'x';
    if (c) s += sgn(c);
    return s;
  }
  function pt(x, y) { return '(' + n(x) + ', ' + n(y) + ')'; }
  function P(x, y, why) { return { k: 'p' + x + ',' + y, h: pt(x, y), why: why, at: { pt: [x, y] } }; }
  function X(x, why) { return { k: 'x' + x, h: 'x = ' + n(x), why: why, at: { x: x } }; }
  function H(y, why) { return { k: 'h' + y, h: n(y), why: why, at: { y: y } }; }
  function Z(p, q, why) { var s = [p, q].sort(function (u, v) { return u - v; }); return { k: 'z' + s.join(','), h: s[0] === s[1] ? 'x = ' + n(s[0]) + ' only' : 'x = ' + n(s[0]) + ' and x = ' + n(s[1]), why: why, at: { zs: s } }; }
  function f(F, x) { return F.a * (x - F.h) * (x - F.h) + F.k; }
  function big(s) { return '<span class="big">' + s + '</span>'; }
  function ln(s) { return '<span class="ln">' + s + '</span>'; }

  function vGen() { var a = pick([-1, -1, -2, -0.5]), h = rint(-5, 5), k = rint(2, 9); return { a: a, h: h, k: k }; }
  function sGen() { var a = pick([-1, -1, -2]), h; do { h = rint(-4, 4); } while (!h); return { a: a, h: h, k: rint(2, 9) }; }
  function fGen() {
    var c = pick([[-1, 2], [-1, 3], [-1, 3], [-0.5, 2], [-0.5, 4], [-2, 1], [-2, 2]]), a = c[0], w = c[1], m;
    do { m = rint(-5, 5); } while (Math.abs(m) + w > 9 || m - w === 0 && Math.random() < 0.5);
    return { a: a, h: m, k: -a * w * w, p: m - w, q: m + w, w: w };
  }

  /* ----- vertex form ----- */
  function vV() {
    var F = vGen(), h = F.h, k = F.k;
    return { kind: 'vV', f: F, eq: vForm(F.a, h, k), target: { pt: [h, k] },
      p: 'Where will this firework burst? It bursts at the <b>vertex</b> (the top).' + big(vForm(F.a, h, k)),
      ch: M.choices({ k: 'p' + h + ',' + k, h: pt(h, k), at: { pt: [h, k] } }, [
        h ? P(-h, k, 'Inside the ( ) the sign flips: ' + xm(h) + ' means the vertex x is ' + n(h) + '.') : null,
        P(h, -k, 'The number outside, ' + sgn(k).trim() + ', moves the graph UP ' + k + '. So the vertex y is ' + n(k) + '.'),
        h !== k ? P(k, h, 'Swapped: the vertex is (h, k): x first, then the height.') : null,
        h ? P(-h, -k, 'Both signs are off. In y = a(x − h)² + k the vertex is (h, k).') : null
      ], [P(h + 1, k, 'Vertex form y = a(x − h)² + k has its vertex at (h, k).'), P(h, k + 1, 'Vertex form y = a(x − h)² + k has its vertex at (h, k).')]),
      hint: 'Vertex form is y = a(x − h)² + k. The vertex is (h, k). Careful: (x + 3) means h = −3.',
      steps: ln('Compare with y = a(x − h)² + k') + ln('h = ' + n(h) + ', k = ' + n(k)) + ln('Vertex ' + pt(h, k)), yes: 'Boom! Right at the vertex.' };
  }
  function vMax() {
    var F = vGen(), h = F.h, k = F.k, yi = f(F, 0);
    return { kind: 'vMax', f: F, eq: vForm(F.a, h, k), target: { y: k },
      p: 'How high will this firework go? (the <b>maximum</b> value of y)' + big(vForm(F.a, h, k)),
      ch: M.choices({ k: 'h' + k, h: n(k), at: { y: k } }, [
        h !== k ? H(h, 'That is the x of the vertex: WHERE it bursts, not how high.') : null,
        yi !== k ? H(yi, 'That is the height at x = 0 (the y-intercept). The highest point is the vertex.') : null,
        H(-k, 'Read the sign of the number outside the ( ): ' + sgn(k).trim() + ' means up ' + k + '.'),
        h && h + k !== k ? H(h + k, 'You added h and k. The height is only k, the number outside the ( ).') : null
      ], [H(k + 1, 'The maximum is the k in y = a(x − h)² + k.'), H(k + 2, 'The maximum is the k in y = a(x − h)² + k.')]),
      hint: 'a is negative, so the parabola opens DOWN and the vertex is the top. The maximum value is k.',
      steps: ln('Vertex (h, k) = ' + pt(h, k)) + ln('a &lt; 0, so it opens down') + ln('Maximum y = ' + n(k)), yes: 'The top of the path is the maximum.' };
  }
  function vAxis() {
    var F = vGen(), h = F.h, k = F.k;
    return { kind: 'vAxis', f: F, eq: vForm(F.a, h, k), target: { x: h },
      p: 'The path is a mirror image on both sides. Where is the mirror line (the <b>axis of symmetry</b>)?' + big(vForm(F.a, h, k)),
      ch: M.choices({ k: 'x' + h, h: 'x = ' + n(h), at: { x: h } }, [
        h ? X(-h, 'Inside the ( ) the sign flips: ' + xm(h) + ' means x = ' + n(h) + '.') : null,
        { k: 'y' + k, h: 'y = ' + n(k), why: 'The axis of symmetry is a VERTICAL line through the vertex, so it is x = …', at: { y: k } },
        h !== k ? X(k, 'k is the height. The axis goes through the vertex x: x = h.') : null
      ], [X(h + 1, 'The axis is x = h, the x of the vertex.'), X(h - 1, 'The axis is x = h, the x of the vertex.')]),
      hint: 'The axis of symmetry is the vertical line through the vertex: x = h.',
      steps: ln('Vertex ' + pt(h, k)) + ln('Axis: x = ' + n(h)), yes: 'Both sides of the path match across that line.' };
  }
  /* ----- factored form ----- */
  function fZ() {
    var F = fGen(), p = F.p, q = F.q, m = F.h;
    return { kind: 'fZ', f: F, eq: fForm(F.a, p, q), target: { zs: [p, q] },
      p: 'Where does this firework launch and land? (the <b>zeros</b>: where y = 0)' + big(fForm(F.a, p, q)),
      ch: M.choices(Z(p, q), [
        Z(-p, -q, 'Set each factor equal to 0. ' + xm(p) + ' = 0 gives x = ' + n(p) + '. The sign flips.'),
        p ? Z(-p, q, 'Check the first factor: ' + xm(p) + ' = 0 gives x = ' + n(p) + '.') : Z(p, -q, 'Check the second factor: ' + xm(q) + ' = 0 gives x = ' + n(q) + '.'),
        q ? Z(p, -q, 'Check the second factor: ' + xm(q) + ' = 0 gives x = ' + n(q) + '.') : null,
        Z(m, m, 'That is the axis of symmetry. A firework launches AND lands: there are two zeros.')
      ], [Z(p - 1, q + 1, 'Set each factor equal to 0 and solve.')]),
      hint: 'A product is 0 when a factor is 0. Set each ( ) equal to 0 and solve.',
      steps: ln(xm(p) + ' = 0 → x = ' + n(p)) + ln(xm(q) + ' = 0 → x = ' + n(q)), yes: 'It launches at x = ' + n(p) + ' and lands at x = ' + n(q) + '.' };
  }
  function fAxis() {
    var F = fGen(), p = F.p, q = F.q, m = F.h;
    return { kind: 'fAxis', f: F, eq: fForm(F.a, p, q), target: { x: m },
      p: 'Where is the <b>axis of symmetry</b> of this path?' + big(fForm(F.a, p, q)),
      ch: M.choices(X(m), [
        m ? X(-m, 'Use the zeros themselves: x = ' + n(p) + ' and x = ' + n(q) + '. Watch the signs in the factors.') : null,
        m ? X(p + q, 'You forgot to divide by 2. The axis is halfway: (' + n(p) + ' + ' + n(q) + ') ÷ 2.') : null,
        F.w !== m ? X(F.w, 'That is half the DISTANCE between the zeros. The axis is the MIDPOINT of the zeros.') : null
      ], [X(m + 1, 'The axis is halfway between the zeros.'), X(m - 1, 'The axis is halfway between the zeros.')]),
      hint: 'Find the zeros first (set each factor to 0). The axis is exactly halfway between them: add and divide by 2.',
      steps: ln('Zeros: x = ' + n(p) + ' and x = ' + n(q)) + ln('Axis: x = (' + n(p) + ' + ' + n(q) + ') ÷ 2 = ' + n(m)), yes: '' };
  }
  function fV() {
    var F = fGen(), p = F.p, q = F.q, m = F.h, k = F.k;
    return { kind: 'fV', f: F, eq: fForm(F.a, p, q), target: { pt: [m, k] },
      p: 'Where will this firework burst? (the <b>vertex</b>)' + big(fForm(F.a, p, q)),
      ch: M.choices(P(m, k), [
        m ? P(-m, k, 'Check the axis: the zeros are ' + n(p) + ' and ' + n(q) + ', so the vertex x is halfway between them.') : null,
        F.a !== -1 ? P(m, F.w * F.w, 'You forgot the number in front, a = ' + fr(F.a) + '. Multiply it in too.') : P(m, -k, 'Put x = ' + n(m) + ' in and watch the signs: two negatives times −1.'),
        m !== k ? P(k, m, 'Swapped: the vertex is (x, y). x is the axis, y is the height.') : null
      ], [P(m, k + 1, 'Put x = ' + n(m) + ' into the equation to find the height.'), P(m + 1, k, 'The vertex x is halfway between the zeros.')]),
      hint: 'Step 1: zeros (set each factor to 0). Step 2: the vertex x is halfway between them. Step 3: put that x into the equation to get the height.',
      steps: ln('Zeros ' + n(p) + ' and ' + n(q) + ' → x = ' + n(m)) + ln('y = ' + fr(F.a) + '(' + n(m) + (p < 0 ? ' + ' + n(-p) : ' − ' + n(p)) + ')(' + n(m) + (q < 0 ? ' + ' + n(-q) : ' − ' + n(q)) + ')') + ln('y = ' + fr(F.a) + '(' + n(m - p) + ')(' + n(m - q) + ') = ' + n(k)) + ln('Vertex ' + pt(m, k)), yes: '' };
  }
  /* ----- standard form ----- */
  function std(F) { return { b: -2 * F.a * F.h, c: F.a * F.h * F.h + F.k }; }
  function sAxis() {
    var F = sGen(), s = std(F), h = F.h, eq = sForm(F.a, s.b, s.c);
    return { kind: 'sAxis', f: F, eq: eq, target: { x: h },
      p: 'Find the <b>axis of symmetry</b>. Use x = −b ÷ (2a).' + big(eq),
      ch: M.choices(X(h), [
        X(-h, 'You lost the negative. x = −b ÷ (2a) = −(' + n(s.b) + ') ÷ ' + (2 * F.a < 0 ? '(' + n(2 * F.a) + ')' : n(2 * F.a)) + '.'),
        X(2 * h, 'You forgot the 2 in 2a. Divide by 2a = ' + n(2 * F.a) + '.'),
        s.c !== h ? X(s.c, 'c is where the path crosses the y-axis. Use x = −b ÷ (2a).') : null
      ], [X(h + 1, 'Use x = −b ÷ (2a).'), X(h - 1, 'Use x = −b ÷ (2a).')]),
      hint: 'a = ' + n(F.a) + ', b = ' + n(s.b) + '. Then x = −b ÷ (2a).',
      steps: ln('a = ' + n(F.a) + ', b = ' + n(s.b)) + ln('x = −(' + n(s.b) + ') ÷ (2·' + (F.a < 0 ? '(' + n(F.a) + ')' : n(F.a)) + ')') + ln('x = ' + n(-s.b) + ' ÷ ' + (2 * F.a < 0 ? '(' + n(2 * F.a) + ')' : n(2 * F.a)) + ' = ' + n(h)), yes: '' };
  }
  function sV(maxOnly) {
    var F = sGen(), s = std(F), h = F.h, k = F.k, eq = sForm(F.a, s.b, s.c), fm = f(F, -h);
    var stp = ln('x = −b ÷ (2a) = ' + n(h)) + ln('y = ' + n(F.a) + '(' + n(h) + ')² ' + (s.b < 0 ? '− ' : '+ ') + n(Math.abs(s.b)) + '(' + n(h) + ')' + (s.c ? sgn(s.c) : '')) + ln('y = ' + n(k));
    if (maxOnly) return { kind: 'sMax', f: F, eq: eq, target: { y: k },
      p: 'How high will this firework go? (the <b>maximum</b> value)' + big(eq),
      ch: M.choices(H(k), [
        s.c !== k ? H(s.c, 'c is the height where the path crosses the y-axis (x = 0), not the top.') : null,
        h !== k ? H(h, 'That is the x of the vertex. Put it into the equation to get the height.') : null,
        fm !== k ? H(fm, 'Check the sign of x = −b ÷ (2a). You used x = ' + n(-h) + '.') : null
      ], [H(k + 1, 'Find x = −b ÷ (2a), then put it in.'), H(k - 1, 'Find x = −b ÷ (2a), then put it in.')]),
      hint: 'First find the vertex x with x = −b ÷ (2a). Then put that x into the equation. That y is the maximum.',
      steps: stp, yes: '' };
    return { kind: 'sV', f: F, eq: eq, target: { pt: [h, k] },
      p: 'Where will this firework burst? (the <b>vertex</b>)' + big(eq),
      ch: M.choices(P(h, k), [
        P(-h, fm, 'Check the sign of x = −b ÷ (2a). The vertex x is ' + n(h) + '.'),
        s.c !== k ? P(h, s.c, 'c is where the path crosses the y-axis, not the top. Put x = ' + n(h) + ' into the equation.') : null,
        h !== k ? P(k, h, 'Swapped: the vertex is (x, y).') : null
      ], [P(h, k + 1, 'Put x = ' + n(h) + ' into the equation carefully.'), P(h, k - 1, 'Put x = ' + n(h) + ' into the equation carefully.')]),
      hint: 'Step 1: x = −b ÷ (2a). Step 2: put that x into the equation to get y.',
      steps: stp + ln('Vertex ' + pt(h, k)), yes: '' };
  }
  function sY() {
    var F = sGen(), s = std(F), eq = sForm(F.a, s.b, s.c);
    return { kind: 'sY', f: F, eq: eq, target: { pt: [0, s.c] },
      p: 'Where does the path cross the <b>y-axis</b>? (the y-intercept, where x = 0)' + big(eq),
      ch: M.choices(P(0, s.c), [
        s.b !== s.c ? P(0, s.b, n(s.b) + ' is b, the number with x. When x = 0, that term is 0.') : null,
        s.c ? P(s.c, 0, 'Swapped: on the y-axis, x = 0. The point is (0, c).') : null,
        F.k !== s.c ? P(0, F.k, 'That is the top (the vertex height). The y-intercept is where x = 0.') : null
      ], [P(0, s.c + 1, 'Put x = 0 in. Every x-term becomes 0.')]),
      hint: 'Put x = 0 into the equation. Every term with x becomes 0, so only c is left.',
      steps: ln('x = 0: y = ' + n(F.a) + '(0)² + ' + n(s.b) + '(0)' + (s.c ? sgn(s.c) : ' + 0')) + ln('y = ' + n(s.c)), yes: 'In standard form, c is the y-intercept.' };
  }

  function verify(q) {   // the right choice must match the parabola; wrong ones must not
    var F = q.f, r = q.ch.filter(function (c) { return c.ok; })[0], t = q.target, a = r.at;
    function same(u, v) { return JSON.stringify(u) === JSON.stringify(v); }
    if (!same(a, t)) return 'right choice aims wrong';
    if (t.pt) { var x = t.pt[0], y = t.pt[1]; if (Math.abs(F.a * (x - F.h) * (x - F.h) + F.k - y) > 1e-9) return 'point not on curve'; if (q.kind !== 'sY' && (x !== F.h || y !== F.k)) return 'not vertex'; if (q.kind === 'sY' && x !== 0) return 'not y-int'; }
    if (t.y != null && t.y !== F.k) return 'max wrong';
    if (t.x != null && t.x !== F.h) return 'axis wrong';
    if (t.zs) { if (t.zs.some(function (z) { return Math.abs(F.a * (z - F.h) * (z - F.h) + F.k) > 1e-9; })) return 'zero wrong'; }
    for (var i = 0; i < q.ch.length; i++) if (!q.ch[i].ok && same(q.ch[i].at, t)) return 'wrong choice equals answer';
    // the equation text is the same parabola: check 3 x values against the shown form
    return '';
  }
  var MAKERS = { vV: vV, vMax: vMax, vAxis: vAxis, fZ: fZ, fAxis: fAxis, fV: fV, sAxis: sAxis, sV: function () { return sV(false); }, sMax: function () { return sV(true); }, sY: sY };
  window.FFQ = { make: function (k) { return MAKERS[k](); }, MAKERS: MAKERS, verify: verify, forms: { vForm: vForm, fForm: fForm, sForm: sForm } };
})();
