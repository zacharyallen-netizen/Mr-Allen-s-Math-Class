/* Function Invaders — question makers (Math 1 Unit 2: functions, notation, key features, domain & range, rate of change).
   q.rep tells the screen what to draw: { t:'graph', lines:[{m,b,x0,x1,c0,c1}], pts:[[x,y]] } | { t:'table', xs, ys }
   | { t:'map', ins, outs, arrows:[[i,j]] } | { t:'pairs', pairs } | { t:'eq', text }. */
(function () {
  var M = window.M1, n = M.n, rint = M.rint, pick = M.pick, shuffle = M.shuffle;
  function W(k, h, why) { return { k: String(k), h: h, why: why }; }
  function num(v, why) { return W(v, n(v), why); }
  function ln(s) { return '<span class="ln">' + s + '</span>'; }
  function fx(m, b, v) { v = v || 'x'; var s = m === 1 ? v : m === -1 ? '−' + v : n(m) + v; return b === 0 ? s : s + (b < 0 ? ' − ' + n(-b) : ' + ' + n(b)); }
  function pt(x, y) { return '(' + n(x) + ', ' + n(y) + ')'; }
  function P(x, y, why) { return W('p' + x + ',' + y, pt(x, y), why); }
  function fill(v) { return [num(v + 1, 'Check your arithmetic.'), num(v - 1, 'Check your arithmetic.'), num(v + 2, 'Check your arithmetic.')]; }
  function line(range) { // a line with whole-number points on a −8..8 grid
    var m, b; do { m = pick([1, 2, 3, -1, -2, -3, 0.5, -0.5]); b = rint(-5, 5); } while (Math.abs(m) === 0.5 && false);
    return { m: m, b: b, f: function (x) { return m * x + b; } };
  }
  var YES = 'Yes, it is a function', NOT = 'No, it is not a function';

  /* ---------- Wave 1: is it a function? ---------- */
  function relation(isF) {
    var ins = shuffle([-3, -2, -1, 0, 1, 2, 3, 4, 5]).slice(0, 4).sort(function (a, b) { return a - b; });
    var outs = ins.map(function () { return rint(-4, 8); });
    if (isF && Math.random() < 0.6) outs[2] = outs[0];            // a repeated OUTPUT is fine
    var pairs = ins.map(function (x, i) { return [x, outs[i]]; }), dup = null;
    if (!isF) { var j = rint(0, 3), o; do { o = rint(-4, 8); } while (o === outs[j]); dup = ins[j]; pairs.splice(j + 1, 0, [ins[j], o]); }
    return { pairs: pairs, dup: dup, rep: outs.length !== new Set(outs).size };
  }
  function isFn(form) {
    var isF = Math.random() < 0.5, R = relation(isF), ps = R.pairs;
    var rep;
    if (form === 'map') {
      var ins = [], outs = []; ps.forEach(function (p) { if (ins.indexOf(p[0]) < 0) ins.push(p[0]); if (outs.indexOf(p[1]) < 0) outs.push(p[1]); });
      outs.sort(function (a, b) { return a - b; });
      rep = { t: 'map', ins: ins, outs: outs, arrows: ps.map(function (p) { return [ins.indexOf(p[0]), outs.indexOf(p[1])]; }) };
    } else if (form === 'table') rep = { t: 'table', xs: ps.map(function (p) { return p[0]; }), ys: ps.map(function (p) { return p[1]; }) };
    else if (form === 'graph') rep = { t: 'graph', lines: [], pts: ps };
    else rep = { t: 'pairs', pairs: ps };
    var where = { map: 'mapping diagram', table: 'table', graph: 'graph', pairs: 'set of ordered pairs' }[form];
    var dupTxt = R.dup != null ? 'Input ' + n(R.dup) + ' goes to TWO outputs.' : '';
    var ch = [
      { h: YES, ok: isF, why: 'Look again. ' + dupTxt + ' A function gives each input exactly ONE output.' },
      { h: NOT + (isF && R.rep ? ': two inputs share an output' : ': an input has two outputs'), ok: !isF,
        why: isF && R.rep ? 'Two inputs CAN share the same output. Only one input with two outputs breaks the rule.' : 'Check each input (x). Does any x appear with two different outputs?' },
      { h: NOT + ': the outputs are not in order', ok: false, why: 'Order does not matter. Only ask: does each input have exactly ONE output?' }
    ];
    if (form === 'graph') ch.push({ h: 'Yes: no two points share a y-value', ok: false, why: 'Points CAN share a y-value. Use the VERTICAL line test: no two points on the same vertical line.' });
    return { kind: 'is' + form, rep: rep,
      p: 'Is this ' + where + ' a <b>function</b>?' + (form === 'pairs' ? '<span class="big">{ ' + ps.map(function (p) { return pt(p[0], p[1]); }).join(', ') + ' }</span>' : ''),
      ch: ch, hint: 'A function gives each input (x) exactly ONE output (y).' + (form === 'graph' ? ' Vertical line test: no vertical line touches two points.' : ''),
      steps: isF ? ln('Every input appears once (or always with the same output).') + ln('So it IS a function.') : ln(dupTxt) + ln('So it is NOT a function.'), yes: '' };
  }

  /* ---------- Wave 2: function notation ---------- */
  function evalEq() {
    var m = pick([2, 3, 4, 5, -2, -3]), b = rint(-9, 9), k = pick([-4, -3, -2, -1, 2, 3, 4, 5]), v = m * k + b;
    return { kind: 'evalEq', rep: { t: 'eq', text: 'f(x) = ' + fx(m, b) },
      p: 'The UFO sends <span class="big">f(x) = ' + fx(m, b) + '</span>Find <b>f(' + n(k) + ')</b>.',
      ch: M.choices({ k: v, h: n(v) }, [
        num(m * -k + b, 'Put in x = ' + n(k) + ', sign and all: ' + n(m) + '(' + n(k) + ').'),
        num(m * k, 'You forgot the ' + (b < 0 ? '− ' + n(-b) : '+ ' + n(b)) + ' at the end.'),
        num(m + k + b, 'f(' + n(k) + ') means MULTIPLY ' + n(m) + ' by ' + n(k) + ', not add.'),
        num((v - b) / m === k ? k : k, 'f(' + n(k) + ') is the OUTPUT when x = ' + n(k) + '. The answer is not ' + n(k) + ' itself.')
      ], fill(v)),
      hint: 'f(' + n(k) + ') means: replace every x with ' + n(k) + ', then work it out.',
      steps: ln('f(' + n(k) + ') = ' + n(m) + '(' + n(k) + ')' + (b < 0 ? ' − ' + n(-b) : ' + ' + n(b))) + ln('= ' + n(m * k) + (b < 0 ? ' − ' + n(-b) : ' + ' + n(b)) + ' = ' + n(v)), yes: '' };
  }
  function evalGraph() {
    var L; do { L = line(); } while (Math.abs(L.m) === 0.5);
    var k, v, tries = 0; do { k = rint(-4, 4); v = L.f(k); if (++tries > 40) return evalGraph(); } while (Math.abs(v) > 7 || k === v);
    var inv = (k - L.b) / L.m;
    var wr = [num(-v, 'Check the sign: above the x-axis is positive, below is negative.'), num(L.f(k + 1), 'Count again: go to x = ' + n(k) + ' on the x-axis first.')];
    if (Number.isInteger(inv) && inv !== v) wr.unshift(num(inv, 'That is the x where the OUTPUT is ' + n(k) + '. f(' + n(k) + ') means the INPUT is ' + n(k) + '.'));
    return { kind: 'evalGraph', rep: { t: 'graph', lines: [{ m: L.m, b: L.b }], pts: [] },
      p: 'The graph shows y = f(x). What is <b>f(' + n(k) + ')</b>?',
      ch: M.choices({ k: v, h: n(v) }, wr, fill(v)),
      hint: 'Find x = ' + n(k) + ' on the x-axis. Go straight up or down to the line. Read the y-value.',
      steps: ln('At x = ' + n(k) + ', the line is at y = ' + n(v) + '.') + ln('f(' + n(k) + ') = ' + n(v)), yes: '' };
  }
  function evalTable() {
    var xs = shuffle([-2, -1, 0, 1, 2, 3, 4]).slice(0, 5).sort(function (a, b) { return a - b; }), ys = xs.map(function () { return rint(-6, 12); });
    var i = rint(0, 4), k = xs[i], v = ys[i], j = ys.indexOf(k);
    var wr = [];
    if (j >= 0 && xs[j] !== v) wr.push(num(xs[j], 'That is the x whose OUTPUT is ' + n(k) + '. f(' + n(k) + ') means the INPUT is ' + n(k) + '.'));
    wr.push(num(ys[(i + 1) % 5], 'That is the output for x = ' + n(xs[(i + 1) % 5]) + '. Use the column where x = ' + n(k) + '.'));
    if (i > 0) wr.push(num(ys[i - 1], 'That is the output for x = ' + n(xs[i - 1]) + '. Use the column where x = ' + n(k) + '.'));
    wr.push(num(k, 'f(' + n(k) + ') asks for the OUTPUT when x = ' + n(k) + '.'));
    return { kind: 'evalTable', rep: { t: 'table', xs: xs, ys: ys, fx: true },
      p: 'Use the table. What is <b>f(' + n(k) + ')</b>?', ch: M.choices({ k: v, h: n(v) }, wr, fill(v)),
      hint: 'Find ' + n(k) + ' in the x row. The number under it is f(' + n(k) + ').',
      steps: ln('x = ' + n(k) + ' → f(x) = ' + n(v)), yes: '' };
  }
  function solveFx() {
    var m = pick([2, 3, 4, 5, -2, -3]), b = rint(-9, 9), x = rint(-5, 7), c = m * x + b;
    return { kind: 'solveFx', rep: { t: 'eq', text: 'f(x) = ' + fx(m, b) },
      p: 'The UFO sends <span class="big">f(x) = ' + fx(m, b) + '</span>For what x is <b>f(x) = ' + n(c) + '</b>?',
      ch: M.choices({ k: x, h: 'x = ' + n(x) }, [
        W(m * c + b, 'x = ' + n(m * c + b), 'That is f(' + n(c) + '). Here ' + n(c) + ' is the OUTPUT. Solve ' + fx(m, b) + ' = ' + n(c) + '.'),
        Number.isInteger((c + b) / m) ? W((c + b) / m, 'x = ' + n((c + b) / m), 'Undo ' + (b < 0 ? '− ' + n(-b) : '+ ' + n(b)) + ' with the OPPOSITE operation.') : null,
        W(-x, 'x = ' + n(-x), 'Check the sign when you divide by ' + n(m) + '.')
      ].filter(Boolean), [W(x + 1, 'x = ' + n(x + 1), 'Check: put your x into f. Do you get ' + n(c) + '?'), W(x - 2, 'x = ' + n(x - 2), 'Check: put your x into f.')]),
      hint: 'Set ' + fx(m, b) + ' = ' + n(c) + ' and solve for x.',
      steps: ln(fx(m, b) + ' = ' + n(c)) + ln(n(m) + 'x = ' + n(c - b)) + ln('x = ' + n(x)), yes: 'Check: f(' + n(x) + ') = ' + n(c) + '.' };
  }

  /* ---------- Wave 3: key features ---------- */
  function yInt() {
    var L; do { L = line(); } while (L.b === 0);
    var xi = -L.b / L.m;
    var wr = [P(L.b, 0, 'Swapped. The y-intercept is ON the y-axis, so x = 0: (0, ' + n(L.b) + ').'), P(0, -L.b, 'Check the sign: is the crossing above or below the origin?')];
    if (Number.isInteger(xi)) wr.push(P(xi, 0, 'That is where the line crosses the x-AXIS. The y-intercept is on the y-axis.'));
    return { kind: 'yInt', rep: { t: 'graph', lines: [{ m: L.m, b: L.b }], pts: [] },
      p: 'Where does the line cross the <b>y-axis</b>? (the y-intercept)', ch: M.choices(P(0, L.b), wr, [P(0, L.b + 1, 'Count the grid again.')]),
      hint: 'The y-axis is the up-and-down line. On it, x = 0.', steps: ln('The line crosses the y-axis at ' + pt(0, L.b) + '.'), yes: '' };
  }
  function xInt() {
    var m = pick([1, 2, -1, -2, 0.5, -0.5]), r = m === 0.5 || m === -0.5 ? pick([-4, -2, 2, 4, 6]) : rint(-5, 5), b = -m * r;
    if (r === 0 || b === 0 || Math.abs(b) > 7) return xInt();
    return { kind: 'xInt', rep: { t: 'graph', lines: [{ m: m, b: b }], pts: [] },
      p: 'Where does the line cross the <b>x-axis</b>? (the x-intercept, a zero of the function)',
      ch: M.choices(P(r, 0), [P(0, r, 'Swapped. On the x-axis, y = 0: (' + n(r) + ', 0).'), P(0, b, 'That is the y-intercept. The x-intercept is on the x-axis.'), P(-r, 0, 'Left of the center is negative x, right is positive.')], [P(r + 1, 0, 'Count the grid again.')]),
      hint: 'The x-axis is the side-to-side line. On it, y = 0.', steps: ln('The line crosses the x-axis at ' + pt(r, 0) + '.'), yes: 'That x is a zero: f(' + n(r) + ') = 0.' };
  }
  function slopeG() {
    var L; do { L = line(); } while (false);
    var m = L.m, ms = function (v) { if (Number.isInteger(v)) return n(v); for (var d = 2; d <= 6; d++) if (Number.isInteger(v * d)) return (v < 0 ? '−' : '') + Math.abs(v * d) + '/' + d; return n(v); };
    var inv = 1 / m;
    return { kind: 'slope', rep: { t: 'graph', lines: [{ m: m, b: L.b }], pts: [] },
      p: 'What is the <b>slope</b> (rate of change) of this line?',
      ch: M.choices(W('s' + m, ms(m)), [W('s' + inv, ms(inv), 'Upside down. Slope is RISE over RUN: up-or-down change ÷ across change.'), W('s' + -m, ms(-m), 'Check the sign: a line going ' + (m > 0 ? 'UP' : 'DOWN') + ' from left to right has a ' + (m > 0 ? 'positive' : 'negative') + ' slope.'),
        L.b !== m ? W('s' + L.b, n(L.b), 'That is the y-intercept. Slope is how steep the line is.') : null].filter(Boolean), [W('s' + (2 * m), ms(2 * m), 'Pick two points ONE run apart and count the rise again.')]),
      hint: 'Pick two points on the line. Slope = rise ÷ run. Going down means negative.', steps: ln('From ' + pt(0, L.b) + ' to ' + pt(2, L.f(2)) + ': rise ' + n(L.f(2) - L.b) + ', run 2') + ln('slope = ' + n(L.f(2) - L.b) + ' ÷ 2 = ' + ms(m)), yes: '' };
  }
  function incDec() {
    var t = pick([0, 1, 2]), m = t === 0 ? pick([2, 3, 0.5]) : t === 1 ? pick([-2, -3, -1]) : 0, b = rint(-3, 4), xs = [0, 1, 2, 3, 4], ys = xs.map(function (x) { return m * x + b; });
    var labs = ['Increasing', 'Decreasing', 'Constant'];
    return { kind: 'incDec', rep: { t: 'table', xs: xs, ys: ys, fx: true },
      p: 'As x gets bigger, is f <b>increasing</b>, <b>decreasing</b> or <b>constant</b>?',
      ch: labs.map(function (h, i) { return { h: h, ok: i === t, why: i === 0 ? 'Increasing means the outputs go UP as x goes up. Look at the f(x) row.' : i === 1 ? 'Decreasing means the outputs go DOWN as x goes up. Look at the f(x) row.' : 'Constant means the outputs never change. Look at the f(x) row.' }; }),
      hint: 'Read the f(x) row from left to right. Going up, going down, or staying the same?',
      steps: ln('f(x): ' + ys.map(n).join(', ')) + ln('So it is ' + labs[t].toLowerCase() + '.'), yes: '' };
  }

  /* ---------- Wave 4: domain & range ---------- */
  function domRange(which) {
    var x0 = rint(-6, 0), x1 = x0 + rint(3, 8), m = pick([1, -1, 0.5, -0.5, 2]), b;
    if (Math.abs(m) === 0.5 && (x0 % 2)) x0 -= 1;
    if (Math.abs(m) === 0.5 && (x1 % 2)) x1 += 1;
    var tries = 0; do { b = rint(-4, 4); if (++tries > 40) return domRange(which); } while (Math.abs(m * x0 + b) > 7 || Math.abs(m * x1 + b) > 7);
    var c0 = Math.random() < 0.6, c1 = Math.random() < 0.6, y0 = m * x0 + b, y1 = m * x1 + b;
    var lo = Math.min(y0, y1), hi = Math.max(y0, y1), cl = y0 < y1 ? c0 : c1, ch = y0 < y1 ? c1 : c0;
    function s(a, ca, v, z, cz) { return n(a) + (ca ? ' ≤ ' : ' < ') + v + (cz ? ' ≤ ' : ' < ') + n(z); }
    var D = s(x0, c0, 'x', x1, c1), Rg = s(lo, cl, 'y', hi, ch);
    var right = which === 'D' ? D : Rg;
    var wr = which === 'D' ? [W('r', Rg, 'That uses the y-values: the RANGE. The domain is the x-values (left to right).'),
      W('o', s(x0, !c0, 'x', x1, !c1), 'Check the ends: a filled dot is included (≤); an open dot is not (<).'),
      W('a', 'all real numbers', 'The graph stops at both ends, so only some x-values are used.')]
      : [W('d', D, 'That uses the x-values: the DOMAIN. The range is the y-values (bottom to top).'),
        W('o', s(lo, !cl, 'y', hi, !ch), 'Check the ends: a filled dot is included (≤); an open dot is not (<).'),
        W('a', 'all real numbers', 'The graph stops at both ends, so only some y-values are used.')];
    return { kind: which === 'D' ? 'domain' : 'range', rep: { t: 'graph', lines: [{ m: m, b: b, x0: x0, x1: x1, c0: c0, c1: c1 }], pts: [] },
      p: 'What is the <b>' + (which === 'D' ? 'domain (all the x-values used)' : 'range (all the y-values used)') + '</b> of this graph?',
      ch: M.choices({ k: 'R', h: right }, wr),
      hint: which === 'D' ? 'Domain = x-values: read the graph from its LEFT end to its RIGHT end. Filled dot = ≤, open dot = <.' : 'Range = y-values: read the graph from its LOWEST point to its HIGHEST point. Filled dot = ≤, open dot = <.',
      steps: ln('Ends: ' + pt(x0, y0) + (c0 ? ' filled' : ' open') + ' and ' + pt(x1, y1) + (c1 ? ' filled' : ' open')) + ln((which === 'D' ? 'Domain: ' : 'Range: ') + right), yes: '' };
  }
  function domPts() {
    var xs = shuffle([-3, -2, -1, 0, 1, 2, 3, 4]).slice(0, 4).sort(function (a, b) { return a - b; }), ys = xs.map(function () { return rint(-3, 6); });
    var dom = '{' + xs.map(n).join(', ') + '}', rng = '{' + Array.from(new Set(ys)).sort(function (a, b) { return a - b; }).map(n).join(', ') + '}';
    if (dom === rng) return domPts();
    var askD = Math.random() < 0.5;
    return { kind: 'domPts', rep: { t: 'graph', lines: [], pts: xs.map(function (x, i) { return [x, ys[i]]; }) },
      p: 'The graph is just these points. What is the <b>' + (askD ? 'domain' : 'range') + '</b>?',
      ch: M.choices({ k: 'R', h: askD ? dom : rng }, [W('s', askD ? rng : dom, askD ? 'Those are the y-values (the range). The domain lists the x-values.' : 'Those are the x-values (the domain). The range lists the y-values.'),
        W('i', askD ? n(xs[0]) + ' ≤ x ≤ ' + n(xs[3]) : n(Math.min.apply(0, ys)) + ' ≤ y ≤ ' + n(Math.max.apply(0, ys)), 'The graph is only separate points, so list just those values. The numbers in between are not used.'),
        W('a', 'all real numbers', 'Only a few points are used. List their ' + (askD ? 'x' : 'y') + '-values.')]),
      hint: 'Domain = list of x-values. Range = list of y-values. Only the dots count.',
      steps: ln('Points: ' + xs.map(function (x, i) { return pt(x, ys[i]); }).join(', ')) + ln((askD ? 'Domain: ' + dom : 'Range: ' + rng)), yes: '' };
  }

  /* ---------- Wave 5: rate of change + parameters ---------- */
  function aroc() {
    var kind = pick(['sq', 'exp', 'mix']), xs = [0, 1, 2, 3, 4, 5], a = pick([1, 2, 3]), c = rint(-3, 5);
    var ys = xs.map(function (x) { return kind === 'sq' ? a * x * x + c : kind === 'exp' ? a * Math.pow(2, x) : x * x - 3 * x + c; });
    var i, j; do { i = rint(0, 3); j = rint(i + 1, 5); } while ((ys[j] - ys[i]) % (j - i) !== 0 || j - i < 2);
    var r = (ys[j] - ys[i]) / (j - i), d = ys[j] - ys[i];
    return { kind: 'aroc', rep: { t: 'table', xs: xs, ys: ys, fx: true },
      p: 'Find the <b>average rate of change</b> of f from x = ' + xs[i] + ' to x = ' + xs[j] + '.',
      ch: M.choices({ k: r, h: n(r) }, [num(d, 'That is only the change in f(x). Divide by the change in x: ' + xs[j] + ' − ' + xs[i] + ' = ' + (j - i) + '.'),
        Number.isInteger((j - i) / d) && d ? num((j - i) / d, 'Upside down. Rate of change = change in f(x) ÷ change in x.') : null,
        num(-r, 'Subtract in the same order: f(' + xs[j] + ') − f(' + xs[i] + ').'),
        Number.isInteger(ys[j] / xs[j]) ? num(ys[j] / xs[j], 'Use BOTH points: (f(' + xs[j] + ') − f(' + xs[i] + ')) ÷ (' + xs[j] + ' − ' + xs[i] + ').') : null].filter(Boolean), fill(r)),
      hint: 'Average rate of change = (f(' + xs[j] + ') − f(' + xs[i] + ')) ÷ (' + xs[j] + ' − ' + xs[i] + ').',
      steps: ln('(' + n(ys[j]) + ' − ' + (ys[i] < 0 ? '(' + n(ys[i]) + ')' : n(ys[i])) + ') ÷ (' + xs[j] + ' − ' + xs[i] + ')') + ln('= ' + n(d) + ' ÷ ' + (j - i) + ' = ' + n(r)), yes: '' };
  }
  function params() {
    var m = pick([1, 2, 3, -1, -2]), b = rint(-3, 3), ch, k = pick(['up', 'down', 'steep', 'flat']), m2 = m, b2 = b, d = rint(2, 5);
    if (k === 'up') b2 = b + d; else if (k === 'down') b2 = b - d; else if (k === 'steep') m2 = m * 2; else m2 = m / 2;
    var opts = { up: 'Moves UP ' + d, down: 'Moves DOWN ' + d, steep: 'Gets steeper', flat: 'Gets less steep' };
    var right = opts[k];
    var wr = [];
    if (k === 'up' || k === 'down') {
      wr.push(W('w', (k === 'up' ? 'Moves DOWN ' : 'Moves UP ') + d, 'b went from ' + n(b) + ' to ' + n(b2) + '. Bigger b moves the line UP.'));
      wr.push(W('r', 'Moves RIGHT ' + d, 'Changing b slides the line up or down, not sideways.'));
      wr.push(W('s', 'Gets steeper', 'The slope (number with x) did not change, so the steepness is the same.'));
    } else {
      wr.push(W('w', k === 'steep' ? 'Gets less steep' : 'Gets steeper', 'The slope went from ' + n(m) + ' to ' + (m2 === 0.5 ? '1/2' : m2 === -0.5 ? '−1/2' : n(m2)) + '. A slope farther from 0 is steeper.'));
      wr.push(W('u', 'Moves UP ' + d, 'b (the number added) did not change, so the line does not move up or down.'));
      wr.push(W('f', 'Flips upside down', 'The sign of the slope stayed the same, so it still goes the same way.'));
    }
    var gtxt = 'g(x) = ' + (m2 === 0.5 ? '½x' : m2 === -0.5 ? '−½x' : fx(m2, 0)) + (b2 ? (b2 < 0 ? ' − ' + n(-b2) : ' + ' + n(b2)) : '');
    return { kind: 'params', rep: { t: 'graph', lines: [{ m: m, b: b }], pts: [] },
      p: 'The graph shows <b>f(x) = ' + fx(m, b) + '</b>. It changes to<span class="big">' + gtxt + '</span>What happens to the line?',
      ch: M.choices({ k: 'R', h: right }, wr),
      hint: 'In y = mx + b, m (the number with x) sets the steepness. b slides the line up or down.',
      steps: ln('m: ' + n(m) + ' → ' + (m2 === 0.5 ? '1/2' : m2 === -0.5 ? '−1/2' : n(m2)) + ',  b: ' + n(b) + ' → ' + n(b2)) + ln(right), yes: '' };
  }

  var MAKERS = { ismap: function () { return isFn('map'); }, istable: function () { return isFn('table'); }, isgraph: function () { return isFn('graph'); }, ispairs: function () { return isFn('pairs'); },
    evalEq: evalEq, evalGraph: evalGraph, evalTable: evalTable, solveFx: solveFx, yInt: yInt, xInt: xInt, slope: slopeG, incDec: incDec,
    domain: function () { return domRange('D'); }, range: function () { return domRange('R'); }, domPts: domPts, aroc: aroc, params: params };
  function verify(q) {   // tests: graph questions read off whole-number points; function test agrees with the pairs
    var r = q.ch.filter(function (c) { return c.ok; })[0];
    if (/^is/.test(q.kind)) {
      var ps = q.rep.pairs || q.rep.pts || (q.rep.xs && q.rep.xs.map(function (x, i) { return [x, q.rep.ys[i]]; })) || q.rep.arrows.map(function (a) { return [q.rep.ins[a[0]], q.rep.outs[a[1]]]; });
      var seen = {}, fn = true; ps.forEach(function (p) { if (seen[p[0]] != null && seen[p[0]] !== p[1]) fn = false; seen[p[0]] = p[1]; });
      if ((r.h === YES) !== fn) return 'function answer wrong';
    }
    if (q.kind === 'evalGraph' || q.kind === 'evalTable') { if (!/^[−\d]/.test(r.h)) return 'bad'; }
    return '';
  }
  window.FNQ = { make: function (k) { return MAKERS[k](); }, MAKERS: MAKERS, verify: verify };
})();
