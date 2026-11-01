/* K78 — answer checking for Math 1 Units 7–8.
   Reads typed math the way students write it: 3, -3, −3, 1/2, 0.5, sqrt(2), √2, x^2, x², (3,-2), 3,-2,
   x=4, y=2x+1, f(x)=..., y>=-4, [-4,inf) ... and gives feedback that names the likely mistake. */
(function (root) {
  var K = {};
  /* ---------- clean + tokenize ---------- */
  function clean(s) {
    return String(s == null ? '' : s).toLowerCase()
      .replace(/[−‒–—﹣－]/g, '-')
      .replace(/[×·⋅∙•]/g, '*').replace(/÷/g, '/')
      .replace(/([⁰¹²³⁴⁵⁶⁷⁸⁹]+)⁄([₀₁₂₃₄₅₆₇₈₉]+)/g, function (m, a, b) {
        var sup = '⁰¹²³⁴⁵⁶⁷⁸⁹', sub = '₀₁₂₃₄₅₆₇₈₉';
        return '(' + a.split('').map(function (c) { return sup.indexOf(c); }).join('') + '/' + b.split('').map(function (c) { return sub.indexOf(c); }).join('') + ')';
      })
      .replace(/²/g, '^2').replace(/³/g, '^3')
      .replace(/√/g, 'sqrt').replace(/root/g, 'sqrt').replace(/sqrtt/g, 'sqrt')
      .replace(/≤|=<|⩽/g, '<=').replace(/≥|=>|⩾/g, '>=')
      .replace(/∞|infinity/g, 'inf')
      .replace(/½/g, '(1/2)').replace(/¼/g, '(1/4)').replace(/¾/g, '(3/4)')
      .replace(/⅓/g, '(1/3)').replace(/⅔/g, '(2/3)').replace(/⁄/g, '/')
      .replace(/₀|₁|₂|₃|₄|₅|₆|₇|₈|₉/g, function (c) { return String(c.charCodeAt(0) - 0x2080); })
      .replace(/\s+/g, '').replace(/\+-/g, '-').replace(/-\+/g, '-').replace(/--/g, '+');
  }
  K.clean = clean;
  function tok(s) {
    var t = [], i = 0, m;
    while (i < s.length) {
      var r = s.slice(i);
      if ((m = r.match(/^(\d+\.?\d*|\.\d+)/))) { t.push({ k: 'n', v: parseFloat(m[1]) }); i += m[1].length; continue; }
      if ((m = r.match(/^(sqrt|pi|inf)/))) { t.push({ k: 'i', v: m[1] }); i += m[1].length; continue; }
      if (/^[a-z]/.test(r)) { t.push({ k: 'i', v: r[0] }); i++; continue; }
      if ((m = r.match(/^(<=|>=|[+\-*\/^(),=<>\[\]])/))) { t.push({ k: 'o', v: m[1] }); i += m[1].length; continue; }
      return null;
    }
    return t;
  }
  /* recursive-descent parser -> function(env) */
  function parse(s) {
    var t = tok(s); if (!t || !t.length) return null;
    var p = 0;
    function peek() { return t[p]; }
    function isO(v) { return t[p] && t[p].k === 'o' && t[p].v === v; }
    function expr() {
      var a = term();
      while (isO('+') || isO('-')) { var op = t[p++].v, b = term(); a = (function (a, b, op) { return op === '+' ? function (e) { return a(e) + b(e); } : function (e) { return a(e) - b(e); }; })(a, b, op); }
      return a;
    }
    function startsAtom() { var q = peek(); return q && (q.k === 'n' || q.k === 'i' || (q.k === 'o' && q.v === '(')); }
    function term() {
      var a = unary();
      for (;;) {
        if (isO('*') || isO('/')) { var op = t[p++].v, b = unary(); a = (function (a, b, op) { return op === '*' ? function (e) { return a(e) * b(e); } : function (e) { return a(e) / b(e); }; })(a, b, op); }
        else if (startsAtom()) { var c = power(); a = (function (a, c) { return function (e) { return a(e) * c(e); }; })(a, c); }
        else break;
      }
      return a;
    }
    function unary() {
      if (isO('-')) { p++; var a = unary(); return function (e) { return -a(e); }; }
      if (isO('+')) { p++; return unary(); }
      return power();
    }
    function power() {
      var a = atom();
      if (isO('^')) { p++; var b = unary(); return function (e) { return Math.pow(a(e), b(e)); }; }
      return a;
    }
    function atom() {
      var q = t[p++];
      if (!q) throw 0;
      if (q.k === 'n') return function () { return q.v; };
      if (q.k === 'o' && q.v === '(') { var a = expr(); if (!isO(')')) throw 0; p++; return a; }
      if (q.k === 'i') {
        if (q.v === 'sqrt') { var g = isO('(') ? atom() : power(); return function (e) { return Math.sqrt(g(e)); }; }
        if (q.v === 'pi') return function () { return Math.PI; };
        if (q.v === 'inf') return function () { return Infinity; };
        var nm = q.v;
        if (isO('(') && t[p + 1] && t[p + 1].k === 'i' && t[p + 2] && t[p + 2].v === ')' && isO('(')) { /* f(x) as a name: treat as variable value */ }
        return function (e) { return e && nm in e ? e[nm] : NaN; };
      }
      throw 0;
    }
    try { var f = expr(); if (p !== t.length) return null; return f; } catch (e) { return null; }
  }
  K.parse = parse;
  function num(s) { var f = parse(s); if (!f) return NaN; var v = f({}); return typeof v === 'number' ? v : NaN; }
  K.num = num;
  function near(a, b, tol) { if (!isFinite(a) || !isFinite(b)) return a === b; return Math.abs(a - b) <= (tol || 1e-6) * Math.max(1, Math.abs(b)); }
  K.near = near;
  var UNITS = /(squareunits|squarefeet|squaremeters|sq\.?units|sq\.?ft|sq\.?m|units\^2|units|unit|u\^2|ft\^2|feet|foot|ft|meters|meter|m\^2|seconds|second|secs|sec|s|m)$/;
  function stripPrefix(s) {
    // remove leading labels like d=, ab=, slope=, m=, x=, vertex=, h(2)=, (f+g)(x)=
    var parts = s.split('=');
    if (parts.length > 1) return parts[parts.length - 1];
    return s;
  }
  /* ---------- readers by answer type ---------- */
  var R = {};
  R.num = function (s) { s = stripPrefix(s).replace(UNITS, ''); var v = num(s); return isFinite(v) ? v : null; };
  R.pt = function (s) {
    s = s.replace(/^[a-z]{1,8}=/, '').replace(/^[a-z]{1,2}(?=\()/, '');
    s = s.replace(/^[\(\[]/, '').replace(/[\)\]]$/, '');
    var a = s.split(/[,;]/); if (a.length !== 2) return null;
    var x = num(a[0].replace(/^x=/, '')), y = num(a[1].replace(/^y=/, ''));
    return isFinite(x) && isFinite(y) ? [x, y] : null;
  };
  R.set = function (s) {
    var pts = s.match(/\(([^(),]+),0\)/g);
    if (pts && pts.length) s = pts.map(function (p) { return p.slice(1, p.indexOf(',')); }).join(',');
    s = s.replace(/and|or|&/g, ',').replace(/[a-z]=/g, '').replace(/[\(\)\[\]\{\}]/g, '');
    var a = s.split(/[,;]/).filter(function (z) { return z !== ''; }), out = [];
    for (var i = 0; i < a.length; i++) { var v = num(a[i]); if (!isFinite(v)) return null; out.push(v); }
    return out.length ? out.sort(function (p, q) { return p - q; }) : null;
  };
  var XS = [-2.5, -1, 0, 0.5, 1, 2, 3.7];
  R.expr = function (s) {
    s = stripPrefix(s);
    var f = parse(s); if (!f) return null;
    var vals = XS.map(function (x) { return f({ x: x, t: x, w: x, n: x }); });
    if (vals.some(function (v) { return !isFinite(v); })) return null;
    return { vals: vals, paren: /\(/.test(s), raw: s };
  };
  R.line = function (s) {
    var parts = s.split('=');
    var L, Rr;
    if (parts.length === 1) { L = parse('y'); Rr = parse(parts[0]); }
    else if (parts.length === 2) { L = parse(parts[0]); Rr = parse(parts[1]); }
    else return null;
    if (!L || !Rr) return null;
    var F = function (x, y) { var e = { x: x, y: y }; return L(e) - Rr(e); };
    if (!isFinite(F(0, 0)) || !isFinite(F(1, 1))) return null;
    // vertical?
    var dy = F(0, 1) - F(0, 0);
    if (Math.abs(dy) < 1e-9) {
      var dx = F(1, 0) - F(0, 0); if (Math.abs(dx) < 1e-9) return null;
      return { vert: true, x: -F(0, 0) / dx, F: F };
    }
    var y0 = -F(0, 0) / dy, y1 = -F(1, 0) / (F(1, 1) - F(1, 0));
    return { m: y1 - y0, b: y0, F: F };
  };
  R.ineq = function (s) {
    var m;
    if ((m = s.match(/^([\[\(])(.+),(.+)([\]\)])$/))) {
      var a = num(m[2]), b = num(m[3]);
      if (b === Infinity) return { op: m[1] === '[' ? '>=' : '>', v: a };
      if (a === -Infinity) return { op: m[4] === ']' ? '<=' : '<', v: b };
      return null;
    }
    if ((m = s.match(/^[a-z](?:\([a-z]\))?(<=|>=|<|>)(.+)$/))) { var v = num(m[2]); return isFinite(v) ? { op: m[1], v: v } : null; }
    if ((m = s.match(/^(.+?)(<=|>=|<|>)[a-z](?:\([a-z]\))?$/))) { var w = num(m[1]); var flip = { '<=': '>=', '>=': '<=', '<': '>', '>': '<' }; return isFinite(w) ? { op: flip[m[2]], v: w } : null; }
    return null;
  };
  K.R = R;
  /* ---------- comparators ---------- */
  function same(type, got, ans, spec) {
    if (got == null) return false;
    var tol = spec && spec.tol;
    switch (type) {
      case 'num': return near(got, ans, tol);
      case 'pt': return near(got[0], ans[0], tol) && near(got[1], ans[1], tol);
      case 'set':
        var A = ans.slice().sort(function (p, q) { return p - q; });
        var g = got.filter(function (v, i) { return i === 0 || !near(v, got[i - 1]); });
        var a2 = A.filter(function (v, i) { return i === 0 || !near(v, A[i - 1]); });
        if (g.length !== a2.length) return false;
        return g.every(function (v, i) { return near(v, a2[i], tol); });
      case 'expr':
        var f = parse(clean(ans)); var av = XS.map(function (x) { return f({ x: x, t: x, w: x, n: x }); });
        return got.vals.every(function (v, i) { return near(v, av[i], 1e-6); });
      case 'line':
        if (ans.vert) return !!got.vert && near(got.x, ans.x);
        if (got.vert) return false;
        return near(got.m, ans.m) && (ans.b == null || near(got.b, ans.b));
      case 'ineq': return got.op === ans.op && near(got.v, ans.v);
    }
    return false;
  }
  K.same = same;
  var FORMAT = {
    num: 'Type a number, like 5, −3, 1/2 or sqrt(10).',
    pt: 'Type a point like (3, −2).',
    set: 'Type the zeros with a comma between them, like −3, 1.',
    expr: 'Type an expression, like x^2 + 2x − 3.',
    line: 'Type an equation, like y = 2x + 1.',
    ineq: 'Type an inequality like y >= −4, or an interval like [−4, inf).'
  };
  function generic(type, got, ans, spec) {
    switch (type) {
      case 'num':
        if (ans !== 0 && near(got, -ans)) return 'So close! Check the sign (+ or −).';
        if (spec.sq && near(got, ans * ans)) return 'You found the number under the square root. Take the square root as the last step.';
        if (ans !== 0 && near(got, 1 / ans)) return 'That is the reciprocal (flipped). Check whether you should flip.';
        if (Math.abs(got - ans) <= Math.max(2, Math.abs(ans) * 0.15)) return 'You are close! Redo the adding, subtracting and multiplying one step at a time.';
        return null;
      case 'pt':
        if (near(got[0], ans[1]) && near(got[1], ans[0]) && !near(ans[0], ans[1])) return 'You switched x and y. Write the point as (x, y): x first.';
        if (near(got[0], -ans[0]) && near(got[1], -ans[1])) return 'Both signs are flipped. Check your + and − signs.';
        if (near(got[0], ans[0]) && !near(got[1], ans[1])) return 'Your x-value is right! Now check the y-value.';
        if (near(got[1], ans[1]) && !near(got[0], ans[0])) return 'Your y-value is right! Now check the x-value.';
        return null;
      case 'set':
        var A = ans.slice().sort(function (p, q) { return p - q; });
        if (got.length === 1 && A.length > 1) return 'A parabola like this crosses the x-axis twice. Type both zeros with a comma between them.';
        var neg = got.map(function (v) { return -v; }).sort(function (p, q) { return p - q; });
        if (neg.length === A.length && neg.every(function (v, i) { return near(v, A[i]); })) return 'Check the signs. If a factor is (x + 3), the zero is x = −3 (the opposite sign).';
        var hits = got.filter(function (v) { return A.some(function (a) { return near(a, v); }); }).length;
        if (hits > 0) return 'One zero is right! Check the other one.';
        return null;
      case 'expr':
        var f = parse(clean(ans)), av = XS.map(function (x) { return f({ x: x, t: x, w: x, n: x }); });
        var d = got.vals.map(function (v, i) { return v - av[i]; });
        if (d.every(function (z) { return near(z, d[0]); })) return 'Close! Your x-terms are right. Check the constant (the plain number).';
        return null;
      case 'line':
        if (got.vert || ans.vert) return null;
        if (near(got.m, ans.m) && ans.b != null && !near(got.b, ans.b)) return 'Your slope is right! Now find b: put the point into y = mx + b and solve for b.';
        if (ans.m !== 0 && near(got.m, -1 / ans.m)) return 'That slope is the opposite reciprocal. Parallel lines keep the SAME slope.';
        if (ans.m !== 0 && near(got.m, -ans.m)) return 'Check the sign of your slope.';
        if (ans.m !== 0 && near(got.m, 1 / ans.m)) return 'You flipped the slope but kept the sign. Perpendicular slopes flip AND change sign.';
        return null;
      case 'ineq':
        if (near(got.v, ans.v) && got.op !== ans.op) {
          if (got.op[0] !== ans.op[0]) return 'Check the direction of the inequality. Does the graph go up or down from the vertex?';
          return 'The vertex is ON the graph, so include it: use ≥ or ≤ (or a square bracket [ ]).';
        }
        return null;
    }
    return null;
  }
  /* ---------- page wiring ---------- */
  var solved = 0, tried = 0, started = {};
  function score() { var b = document.getElementById('score'); if (b) b.innerHTML = 'Score: <b>' + solved + '</b> / ' + tried; }
  function showAfter(card) {
    card.querySelectorAll('.after').forEach(function (a) { a.classList.add('show'); });
  }
  K.showAfter = showAfter;
  function fbSet(fb, cls, html) { fb.className = 'chk-fb show ' + cls; fb.innerHTML = html; }
  K.check = function (id) {
    var card = document.getElementById(id); if (!card || card.dataset.solved) return;
    var spec = JSON.parse(card.getAttribute('data-q'));
    var inp = card.querySelector('input'), fb = card.querySelector('.chk-fb');
    var raw = inp.value, s = clean(raw);
    if (!s) { fbSet(fb, 'x', 'Type your answer in the box first.'); return; }
    var type = spec.t, ans = spec.a, got = R[type](s);
    if (got == null && spec.yint && type === 'num') { var pp = R.pt(s); if (pp && near(pp[0], 0)) got = pp[1]; else if (pp) { fbSet(fb, 'x', 'A y-intercept is on the y-axis, so its x-value is 0. Write it like (0, 5) or just 5.'); return; } }
    if (spec.axis && s.indexOf('=') >= 0 && !/^x=/.test(s)) { fbSet(fb, 'x', 'The axis of symmetry is a vertical line, so write it as x = (a number).'); return; }
    if (got == null) { fbSet(fb, 'x', 'Hmm, I can’t read that yet. ' + (spec.fmt || FORMAT[type])); return; }
    if (!started[id]) { started[id] = 1; tried++; }
    var ok = same(type, got, ans, spec);
    if (ok && spec.form === 'std' && got.paren) { fbSet(fb, 'x', 'That is equal, but it is still in factored form. Multiply it out (expand) and combine like terms.'); score(); return; }
    if (ok) {
      solved++; card.dataset.solved = '1'; inp.disabled = true;
      fbSet(fb, 'c', '✓ Correct! ' + (spec.ok || 'Nice work.'));
      showAfter(card); score(); return;
    }
    var n = (+card.dataset.miss || 0) + 1; card.dataset.miss = n;
    var msg = null;
    (spec.traps || []).some(function (tr) { var g = tr.v; if (same(type, got, g, spec)) { msg = tr.m; return true; } return false; });
    if (!msg) msg = generic(type, got, ans, spec);
    if (!msg) msg = spec.hint || 'Look back at the numbered steps and try again.';
    if (n >= 2) msg += ' <span class="tip">Stuck? Tap “Show full solution”.</span>';
    fbSet(fb, 'x', 'Not yet. ' + msg);
    score();
  };
  K.mc = function (btn) {
    var card = btn.closest('.mc'); if (!card || card.dataset.solved) return;
    var id = card.id;
    if (!started[id]) { started[id] = 1; tried++; }
    var fb = card.querySelector('.chk-fb');
    if (btn.dataset.ok === '1') {
      solved++; card.dataset.solved = '1';
      btn.classList.add('correct');
      card.querySelectorAll('.chk-btn').forEach(function (b) { b.disabled = true; });
      fbSet(fb, 'c', '✓ Correct! ' + (card.dataset.why || ''));
      showAfter(card);
    } else {
      btn.classList.add('wrong'); btn.disabled = true;
      fbSet(fb, 'x', 'Not yet. ' + (btn.dataset.fb || 'Try another choice.'));
    }
    score();
  };
  /* scoring hook for interactive tasks */
  K.mark = function (id, ok) {
    if (!started[id]) { started[id] = 1; tried++; }
    if (ok) solved++;
    score();
  };
  K.sol = function (btn) {
    var card = btn.closest('.chk, .mc, .sa, .task');
    var a = btn.parentElement.querySelector('.sa-ans'); if (a) a.classList.add('show');
    if (card) showAfter(card);
  };
  K.init = function () {
    document.querySelectorAll('.qcard input').forEach(function (inp) {
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); K.check(inp.closest('.qcard').id); } });
    });
    if (typeof window.revealPage === 'function' && !window.revealPage._k78) {
      var old = window.revealPage;
      window.revealPage = function () { old(); document.querySelectorAll('.after').forEach(function (a) { a.classList.add('show'); }); };
      window.revealPage._k78 = 1;
    }
    /* worked-example diagrams appear when the final step (or "Reveal all steps") is shown */
    if (typeof window.reveal === 'function' && !window.reveal._k78) {
      var r0 = window.reveal;
      window.reveal = function (step) { r0(step); if (step.classList.contains('final')) { var ex = step.closest('.example'); if (ex) showAfter(ex); } };
      window.reveal._k78 = 1;
    }
    if (typeof window.revealAll === 'function' && !window.revealAll._k78) {
      var ra = window.revealAll;
      window.revealAll = function (id) { ra(id); var st = document.querySelector('.steps[data-example="' + id + '"]'); var ex = st && st.closest('.example'); if (ex) showAfter(ex); };
      window.revealAll._k78 = 1;
    }
    score();
  };
  /* pointer helper for draggable SVG widgets: works for mouse, pen and touch */
  K.drag = function (svg, P, onMove) {
    var on = false;
    function pos(e) {
      var m = svg.getScreenCTM(); if (!m) return null;
      var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      var q = pt.matrixTransform(m.inverse());
      return [P().invX(q.x), P().invY(q.y)];
    }
    svg.addEventListener('pointerdown', function (e) { on = true; try { svg.setPointerCapture(e.pointerId); } catch (x) {} var p = pos(e); if (p) onMove(p, 'down'); e.preventDefault(); });
    svg.addEventListener('pointermove', function (e) { if (!on) return; var p = pos(e); if (p) onMove(p, 'move'); e.preventDefault(); });
    function end(e) { if (!on) return; on = false; try { svg.releasePointerCapture(e.pointerId); } catch (x) {} onMove(null, 'up'); }
    svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
  };
  /* swap an <svg> element's content with a freshly drawn svg string (keeps the element, so pointer capture survives) */
  K.swap = function (svg, str) {
    var d = document.createElement('div'); d.innerHTML = str; var n = d.firstChild;
    svg.setAttribute('viewBox', n.getAttribute('viewBox'));
    svg.innerHTML = n.innerHTML;
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = K; else root.K78 = K;
})(this);
