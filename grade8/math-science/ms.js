/* ==========================================================================
   Math in Science — shared engine (ms.js)
   Used by lesson1.html … lesson11.html and the games in this folder.

   • MS.Q        exact fractions with BigInt (no rounding errors)
   • MS.parse    reads what a student types: 3.2x10^5, 3.2*10^5, 3.2 × 10^5,
                 320000, 1/2, 2 1/3, 10^-3, 75%, "2.7 g" …
   • MS.lesson   builds a lesson page from a plain config object
   • MS.plot     small SVG graph helper (+ draggable line of best fit)
   • MS.selfTest runs on load: every answer is checked in code; any problem
                 is reported with console.error.
   Nothing is sent anywhere. The name is kept only in this browser
   (localStorage key 'fluencyLabStudentName', shared with the Fluency Lab).
   ========================================================================== */
(function () {
  // IXL skill page: grade 8 math or science, slug = name in lowercase with punctuation removed
  function ixlUrl(subj, name) {
    var fix = { 'Interpret food webs I': 'interpret-food-webs' };
    var slug = fix[name] || name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
    return 'https://www.ixl.com/' + (subj === 'Science' ? 'science' : 'math') + '/grade-8/' + slug;
  }

  'use strict';
  var MS = window.MS = {};
  var NAME_KEY = 'fluencyLabStudentName';

  /* ---------------- storage (never throws) ---------------- */
  MS.store = function (op, k, v) {
    try {
      if (op === 'get') return localStorage.getItem(k) || '';
      if (op === 'set') localStorage.setItem(k, v);
    } catch (e) { /* private window or blocked storage */ }
    return '';
  };

  /* ---------------- exact fractions ---------------- */
  function gcd(a, b) { if (a < 0n) a = -a; if (b < 0n) b = -b; while (b) { var t = a % b; a = b; b = t; } return a; }
  function Q(n, d) {
    n = BigInt(n); d = d === undefined ? 1n : BigInt(d);
    if (d === 0n) throw new Error('divide by zero');
    if (d < 0n) { n = -n; d = -d; }
    var g = gcd(n, d); if (g > 1n) { n /= g; d /= g; }
    return { n: n, d: d };
  }
  Q.dec = function (s) {           // "1.67" → 167/100 exactly
    s = String(s).trim(); var neg = false;
    if (s[0] === '-' || s[0] === '+') { neg = s[0] === '-'; s = s.slice(1); }
    var m = /^(\d*)(?:\.(\d*))?$/.exec(s);
    if (!m || (m[1] === '' && !m[2])) return null;
    var n = BigInt((m[1] || '0') + (m[2] || '')), d = 10n ** BigInt((m[2] || '').length);
    return Q(neg ? -n : n, d);
  };
  Q.of = function (x) { return (x && typeof x === 'object') ? x : Q.dec(String(x)); };
  Q.add = function (a, b) { a = Q.of(a); b = Q.of(b); return Q(a.n * b.d + b.n * a.d, a.d * b.d); };
  Q.sub = function (a, b) { a = Q.of(a); b = Q.of(b); return Q(a.n * b.d - b.n * a.d, a.d * b.d); };
  Q.mul = function (a, b) { a = Q.of(a); b = Q.of(b); return Q(a.n * b.n, a.d * b.d); };
  Q.div = function (a, b) { a = Q.of(a); b = Q.of(b); return Q(a.n * b.d, a.d * b.n); };
  Q.neg = function (a) { a = Q.of(a); return Q(-a.n, a.d); };
  Q.abs = function (a) { a = Q.of(a); return Q(a.n < 0n ? -a.n : a.n, a.d); };
  Q.cmp = function (a, b) { a = Q.of(a); b = Q.of(b); var x = a.n * b.d - b.n * a.d; return x < 0n ? -1 : x > 0n ? 1 : 0; };
  Q.eq = function (a, b) { return Q.cmp(a, b) === 0; };
  Q.pow10 = function (k) { return k >= 0 ? Q(10n ** BigInt(k)) : Q(1n, 10n ** BigInt(-k)); };
  Q.sci = function (c, k) { return Q.mul(Q.of(c), Q.pow10(k)); };
  Q.int = function (n) { return Q(n); };
  Q.num = function (a) { a = Q.of(a); return Number(a.n) / Number(a.d); };
  Q.round = function (a, places) {            // round half up to a number of decimal places
    a = Q.of(a); var p = 10n ** BigInt(places), x = a.n * p * 2n + (a.n >= 0n ? a.d : -a.d), y = a.d * 2n;
    var q = x / y; return Q(q, p);
  };
  Q.str = function (a) {                       // short exact text (decimal when it ends)
    a = Q.of(a); var d = a.d, k = 0;
    while (d % 10n === 0n) { d /= 10n; k++; }
    var two = 0, five = 0; d = a.d;
    while (d % 2n === 0n) { d /= 2n; two++; } while (d % 5n === 0n) { d /= 5n; five++; }
    if (d !== 1n) return a.n + '/' + a.d;
    var places = Math.max(two, five), s = (a.n < 0n ? -a.n : a.n) * (10n ** BigInt(places)) / a.d, t = s.toString();
    if (places) { while (t.length <= places) t = '0' + t; t = t.slice(0, t.length - places) + '.' + t.slice(t.length - places); }
    return (a.n < 0n ? '-' : '') + t;
  };
  MS.Q = Q;

  /* ---------------- reading answers ---------------- */
  var SUP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '+' };
  var UNIT_RE = /\s*(mg\/l|g\/l|°c|°f|percent|degrees?|celsius|meters?|metres?|grams?|kilograms?|kg|km|cm|mm|nm|years?|yrs?|months?|mos?|days?|cases|units?|times|per\s+\w+|dollars?|bill|beads|birds|[%°gmu]|c)\.?\s*$/;
  MS.parse = function (raw) {
    if (raw == null) return null;
    var s = String(raw).toLowerCase().trim();
    if (!s) return null;
    s = s.replace(/[−–—‒]/g, '-').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/g, function (m) { return '^' + m.split('').map(function (c) { return SUP[c]; }).join(''); });
    s = s.replace(/^(about|approximately|approx\.?|around|≈|~)\s*/, '').replace(/^[a-z]\s*=\s*/, '').replace(/^=\s*/, '')
         .replace(/^(about|≈|~)\s*/, '').replace(/^(after\s+)?(day|month|year|element|level)s?\s+(?=[\d.-])/, '').replace(/\$/g, '');
    s = s.replace(/(\d),(?=\d{3}(\D|$))/g, '$1');
    var prev; do { prev = s; s = s.replace(UNIT_RE, ''); } while (s !== prev && s);
    var word = false;
    s = s.replace(/(\d)\s*(thousand|million|billion|trillion)$/, function (m, d, w) { word = true; return d + '*10^' + { thousand: 3, million: 6, billion: 9, trillion: 12 }[w]; });
    var mx = /^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/.exec(s);
    if (mx) {
      if (mx[4] === '0') return null;
      var mv = Q.add(Q(mx[2]), Q(mx[3], mx[4]));
      return { v: mx[1] ? Q.neg(mv) : mv, exact: true, sci: false };
    }
    s = s.replace(/\s+/g, '');
    var sq = /^(-?)(?:√|sqrt)\(?(\d+(?:\.\d+)?)\)?$/.exec(s);
    if (sq) return { f: (sq[1] ? -1 : 1) * Math.sqrt(parseFloat(sq[2])), exact: false, sci: false };
    var gp = /^(-?)(\d+(?:\.\d+)?)\^\(?([+-]?\d+)\)?$/.exec(s);          // other bases: 2^5, 1.5^2
    if (gp && gp[2] !== '10' && Math.abs(+gp[3]) <= 64) {
      var base = Q.dec(gp[2]), k = +gp[3], pv = Q(1);
      for (var bi = 0; bi < Math.abs(k); bi++) pv = Q.mul(pv, base);
      if (k < 0) { if (pv.n === 0n) return null; pv = Q.div(1, pv); }
      return { v: gp[1] ? Q.neg(pv) : pv, exact: true, sci: false };
    }
    s = s.replace(/(\d)e([+-]?\d+)$/, '$1*10^$2');
    s = s.replace(/(?:x|×|\*|·|•|⋅)10(?=\^)/, '*10');
    s = s.replace(/\^\{([^}]*)\}/, '^$1').replace(/\^\(([^)]*)\)/, '^$1');
    var m = /^([+-]?)(\d*\.?\d*)(?:\/(\d*\.?\d+))?(?:\*?10\^([+-]?\d+))?$/.exec(s);
    if (!m) return null;
    var coefS = m[2], den = m[3], ex = m[4];
    if (coefS === '' && ex === undefined) return null;
    if (coefS === '.' || (coefS === '' && den)) return null;
    var c = coefS === '' ? Q(1) : Q.dec(coefS); if (!c) return null;
    if (den) { var dd = Q.dec(den); if (!dd || dd.n === 0n) return null; c = Q.div(c, dd); }
    if (ex !== undefined && Math.abs(parseInt(ex, 10)) > 400) return null;
    var v = ex !== undefined ? Q.mul(c, Q.pow10(parseInt(ex, 10))) : c;
    if (m[1] === '-') v = Q.neg(v);
    return { v: v, exact: true, sci: ex !== undefined && !word, coef: c };
  };
  function close(p, ans, tol) {
    ans = Q.of(ans);
    if (p.exact) return tol ? Q.cmp(Q.abs(Q.sub(p.v, ans)), Q.of(tol)) <= 0 : Q.eq(p.v, ans);
    var a = Q.num(ans);
    return Math.abs(p.f - a) <= (tol ? Q.num(tol) : 1e-9 * Math.max(1, Math.abs(a)));
  }
  function isPow10(r) {          // r = a nonzero exact fraction; is it 10^k (k ≠ 0)?
    var n = r.n < 0n ? -r.n : r.n, d = r.d;
    if (n !== 1n && d !== 1n) return false;
    var x = n === 1n ? d : n; if (x === 1n) return false;
    while (x % 10n === 0n) x /= 10n; return x === 1n;
  }
  MS.parsePoint = function (raw) {
    var s = String(raw || '').replace(/[−–—]/g, '-').replace(/[()\[\]\s]/g, '');
    var parts = s.split(/[,;]/); if (parts.length !== 2) return null;
    var a = MS.parse(parts[0]), b = MS.parse(parts[1]);
    if (!a || !b || !a.exact || !b.exact) return null;
    return [a.v, b.v];
  };

  /* grade one answer → {state:'ok'|'no'|'form'|'unread', msg} */
  MS.grade = function (it, raw) {
    if (it.type === 'pt') {
      var p = MS.parsePoint(raw);
      if (!p) return { state: 'unread', msg: 'Type a point like (5, 1): x first, then y.' };
      var A = it.ans.map(Q.of);
      if (Q.eq(p[0], A[0]) && Q.eq(p[1], A[1])) return { state: 'ok' };
      var w = (it.wrong || []).find(function (w) { var q = MS.parsePoint(w[0]); return q && Q.eq(q[0], p[0]) && Q.eq(q[1], p[1]); });
      if (w) return { state: 'no', msg: w[1] };
      if (Q.eq(p[0], A[1]) && Q.eq(p[1], A[0])) return { state: 'no', msg: 'You switched x and y. Write x first, then y.' };
      if (Q.eq(p[0], A[0])) return { state: 'no', msg: 'Your x is right. Check the y.' };
      if (Q.eq(p[1], A[1])) return { state: 'no', msg: 'Your y is right. Check the x.' };
      return { state: 'no', msg: it.miss || 'Not yet. Move one step at a time: left/right changes x, up/down changes y.' };
    }
    var pr = MS.parse(raw);
    if (!pr) return { state: 'unread', msg: 'I could not read that. Type a number like 2.7, 3/4, or 3.2 x 10^5.' };
    if (close(pr, it.ans, it.tol)) {
      if (it.form === 'sci') {
        if (!pr.sci) return { state: 'form', msg: 'That is the right value. Now write it in scientific notation, like 4.5 x 10^-4.' };
        var c = Q.abs(pr.coef);
        if (Q.cmp(c, 1) < 0 || Q.cmp(c, 10) >= 0) return { state: 'form', msg: 'Right value, but the first number must be at least 1 and less than 10. Move the decimal point and change the exponent.' };
      }
      return { state: 'ok' };
    }
    var wr = it.wrong || [];
    for (var i = 0; i < wr.length; i++) {
      var hit = typeof wr[i][0] === 'function' ? wr[i][0](pr) : (function () { var q = MS.parse(wr[i][0]); return q && close(pr, q.v, it.wtol || it.tol); })();
      if (hit) return { state: 'no', msg: wr[i][1] };
    }
    if (pr.exact) {
      var ans = Q.of(it.ans);
      if (ans.n !== 0n && Q.eq(pr.v, Q.neg(ans))) return { state: 'no', msg: 'So close. Check the sign (positive or negative).' };
      if (ans.n !== 0n && pr.v.n !== 0n && isPow10(Q.div(pr.v, ans)))
        return { state: 'no', msg: 'Your digits look right, but the size is off. Check the exponent (the power of 10) or the decimal point.' };
    }
    return { state: 'no', msg: it.miss || 'Not yet. Try the hint.' };
  };

  /* ---------------- small DOM helpers ---------------- */
  function h(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]); }
    if (html != null) e.innerHTML = html;
    return e;
  }
  MS.h = h;
  MS.text = function (html) { var d = document.createElement('div'); d.innerHTML = html; return (d.textContent || '').replace(/\s+/g, ' ').trim(); };
  var SVGNS = 'http://www.w3.org/2000/svg';
  function sv(tag, attrs, parent, text) {
    var e = document.createElementNS(SVGNS, tag);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  MS.sv = sv;
  MS.fmt = function (x, places) {             // number → "12,000" / "0.25" (for display)
    var s = (places == null ? x : Number(x).toFixed(places)).toString();
    var neg = s[0] === '-'; if (neg) s = s.slice(1);
    var p = s.split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (neg ? '−' : '') + p.join('.');
  };
  MS.sup = function (k) { return String(k).replace(/-/g, '⁻').replace(/\d/g, function (d) { return '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]; }); };
  MS.sciText = function (c, k) { return c + ' × 10' + MS.sup(k); };

  /* ---------------- SVG graph ---------------- */
  MS.plot = function (host, o) {
    var W = o.w || 600, H = o.h || 360, L = o.l || 64, R = o.r || 18, T = o.t || 18, B = o.b || 54;
    var svg = sv('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'ms-svg', role: 'img', 'aria-label': o.label || 'graph' });
    var X = function (x) { return L + (x - o.x[0]) / (o.x[1] - o.x[0]) * (W - L - R); };
    var Y = function (y) { return H - B - (y - o.y[0]) / (o.y[1] - o.y[0]) * (H - T - B); };
    var ix = function (px) { return o.x[0] + (px - L) / (W - L - R) * (o.x[1] - o.x[0]); };
    var iy = function (py) { return o.y[0] + (H - B - py) / (H - T - B) * (o.y[1] - o.y[0]); };
    var g = sv('g', {}, svg), fs = o.fs || 15;
    var xf = o.xfmt || function (v) { return MS.fmt(+v.toFixed(6)); }, yf = o.yfmt || function (v) { return MS.fmt(+v.toFixed(6)); };
    if (o.xt) for (var x = o.x[0]; x <= o.x[1] + 1e-9; x += o.xt) {
      var xx = X(x); sv('line', { x1: xx, x2: xx, y1: T, y2: H - B, stroke: '#EEF0F3' }, g);
      sv('text', { x: xx, y: H - B + fs + 6, 'text-anchor': 'middle', 'font-size': fs, class: 'mono' }, g, xf(x));
    }
    if (o.yt) for (var y = o.y[0]; y <= o.y[1] + 1e-9; y += o.yt) {
      var yy = Y(y); sv('line', { x1: L, x2: W - R, y1: yy, y2: yy, stroke: '#EEF0F3' }, g);
      sv('text', { x: L - 8, y: yy + 5, 'text-anchor': 'end', 'font-size': fs, class: 'mono' }, g, yf(y));
    }
    sv('line', { x1: L, x2: W - R, y1: Y(Math.max(o.y[0], Math.min(0, o.y[1]))), y2: Y(Math.max(o.y[0], Math.min(0, o.y[1]))), stroke: '#5B6475', 'stroke-width': 1.5 }, g);
    sv('line', { x1: X(Math.max(o.x[0], Math.min(0, o.x[1]))), x2: X(Math.max(o.x[0], Math.min(0, o.x[1]))), y1: T, y2: H - B, stroke: '#5B6475', 'stroke-width': 1.5 }, g);
    if (o.xl) sv('text', { x: (L + W - R) / 2, y: H - 8, 'text-anchor': 'middle', 'font-size': fs, 'font-weight': 600 }, g, o.xl);
    if (o.yl) sv('text', { x: 16, y: (T + H - B) / 2, 'text-anchor': 'middle', 'font-size': fs, 'font-weight': 600, transform: 'rotate(-90 16 ' + (T + H - B) / 2 + ')' }, g, o.yl);
    var layer = sv('g', {}, svg);
    if (host) host.appendChild(svg);
    var P = { svg: svg, X: X, Y: Y, ix: ix, iy: iy, layer: layer, W: W, H: H, L: L, R: R, T: T, B: B, o: o };
    P.dot = function (x, y, a) { return sv('circle', Object.assign({ cx: X(x), cy: Y(y), r: 6, fill: '#1E2D4F' }, a || {}), layer); };
    P.fn = function (f, a, x0, x1) {
      x0 = x0 == null ? o.x[0] : x0; x1 = x1 == null ? o.x[1] : x1;
      var d = '', n = 160, first = true;
      for (var i = 0; i <= n; i++) {
        var xv = x0 + (x1 - x0) * i / n, yv = f(xv);
        if (!isFinite(yv)) { first = true; continue; }
        var py = Math.max(T - 4, Math.min(H - B + 4, Y(yv)));
        d += (first ? 'M' : 'L') + X(xv).toFixed(1) + ' ' + py.toFixed(1); first = false;
      }
      return sv('path', Object.assign({ d: d, fill: 'none', stroke: '#1D4ED8', 'stroke-width': 3 }, a || {}), layer);
    };
    P.text = function (x, y, t, a) { return sv('text', Object.assign({ x: X(x), y: Y(y), 'font-size': fs }, a || {}), layer, t); };
    P.pt = function (evt) {           // pointer → svg units
      var pt = svg.createSVGPoint(); pt.x = evt.clientX; pt.y = evt.clientY;
      var m = svg.getScreenCTM(); if (!m) return { x: 0, y: 0 };
      var r = pt.matrixTransform(m.inverse()); return { x: r.x, y: r.y };
    };
    return P;
  };

  /* least-squares line for [[x,y],…] */
  MS.fit = function (pts) {
    var n = pts.length, sx = 0, sy = 0, sxx = 0, sxy = 0;
    pts.forEach(function (p) { sx += p[0]; sy += p[1]; sxx += p[0] * p[0]; sxy += p[0] * p[1]; });
    var m = (n * sxy - sx * sy) / (n * sxx - sx * sx); return { m: m, b: (sy - m * sx) / n };
  };
  MS.sse = function (pts, m, b) { return pts.reduce(function (s, p) { var e = p[1] - (m * p[0] + b); return s + e * e; }, 0); };
  MS.closeness = function (pts, m, b) {   // 100 = as good as the best-fit line
    var best = MS.fit(pts), a = MS.sse(pts, best.m, best.b), u = MS.sse(pts, m, b);
    if (u <= a + 1e-12) return 100;
    return Math.max(0, Math.min(100, Math.round(100 * (a + 1e-9) / (u + 1e-9))));
  };

  /* draggable line: two handles. o = {p1:[x,y], p2:[x,y], x0, x1, color, onchange(m,b)} */
  MS.dragLine = function (P, o) {
    var col = o.color || '#E0A800', a = o.p1.slice(), b = o.p2.slice();
    var xr = [o.x0 == null ? P.o.x[0] : o.x0, o.x1 == null ? P.o.x[1] : o.x1];
    var line = sv('line', { stroke: col, 'stroke-width': 4, 'stroke-linecap': 'round' }, P.layer);
    function handle(pt) {
      var g = sv('g', { class: 'handle', tabindex: 0, role: 'slider', 'aria-label': 'Line handle. Drag, or use arrow keys.' }, P.svg);
      sv('circle', { r: 22, fill: 'transparent' }, g);
      sv('circle', { r: 11, fill: '#fff', stroke: col, 'stroke-width': 4, class: 'ring' }, g);
      g._pt = pt; return g;
    }
    var h1 = handle(a), h2 = handle(b);
    function clamp(p) {
      p[0] = Math.max(xr[0], Math.min(xr[1], p[0])); p[1] = Math.max(P.o.y[0], Math.min(P.o.y[1], p[1]));
    }
    function mb() { var dx = b[0] - a[0]; if (Math.abs(dx) < 1e-9) dx = 1e-9; var m = (b[1] - a[1]) / dx; return { m: m, b: a[1] - m * a[0] }; }
    function draw() {
      var L = mb();
      line.setAttribute('x1', P.X(xr[0])); line.setAttribute('y1', P.Y(L.m * xr[0] + L.b));
      line.setAttribute('x2', P.X(xr[1])); line.setAttribute('y2', P.Y(L.m * xr[1] + L.b));
      [h1, h2].forEach(function (g) { g.setAttribute('transform', 'translate(' + P.X(g._pt[0]) + ' ' + P.Y(g._pt[1]) + ')'); });
      if (o.onchange) o.onchange(L.m, L.b);
    }
    [h1, h2].forEach(function (g) {
      var drag = false;
      g.addEventListener('pointerdown', function (e) { drag = true; try { g.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault(); });
      g.addEventListener('pointermove', function (e) {
        if (!drag) return; var q = P.pt(e); g._pt[0] = P.ix(q.x); g._pt[1] = P.iy(q.y); clamp(g._pt);
        if (Math.abs(a[0] - b[0]) < (xr[1] - xr[0]) * 0.04) { g._pt[0] += (g === h1 ? -1 : 1) * (xr[1] - xr[0]) * 0.04; clamp(g._pt); }
        draw();
      });
      ['pointerup', 'pointercancel'].forEach(function (t) { g.addEventListener(t, function () { drag = false; }); });
      g.addEventListener('keydown', function (e) {
        var sx = (P.o.x[1] - P.o.x[0]) / 60, sy = (P.o.y[1] - P.o.y[0]) / 60;
        var k = { ArrowLeft: [-sx, 0], ArrowRight: [sx, 0], ArrowUp: [0, sy], ArrowDown: [0, -sy] }[e.key];
        if (!k) return; e.preventDefault(); g._pt[0] += k[0]; g._pt[1] += k[1]; clamp(g._pt); draw();
      });
    });
    draw();
    return { get: mb, set: function (p1, p2) { a[0] = p1[0]; a[1] = p1[1]; b[0] = p2[0]; b[1] = p2[1]; draw(); } };
  };

  /* range slider control → returns input */
  MS.slider = function (host, label, min, max, step, val, fmt, on) {
    var lab = h('label', null, '<span>' + label + ': <output></output></span>');
    var inp = h('input', { type: 'range', min: min, max: max, step: step, value: val, 'aria-label': label });
    lab.appendChild(inp); host.appendChild(lab);
    var out = lab.querySelector('output');
    function up() { out.textContent = fmt ? fmt(+inp.value) : inp.value; if (on) on(+inp.value); }
    inp.addEventListener('input', up); setTimeout(up, 0); inp._up = up;
    return inp;
  };

  /* ---------------- one question card ---------------- */
  var TYPE_LABEL = { num: 'Numeric entry', pt: 'Numeric entry', mc: 'Multiple choice', sel: 'Select all that apply', err: 'Find the error', tf: 'Multiple choice' };
  var LET = 'ABCDEFGH';
  /* mode 'try' = tutorial check (unlimited tries, not scored)
     mode 'assign' = scored: right on try 1 = 1 point, on try 2 = ½ point, then the answer is shown */
  MS.question = function (it, mode, num, onDone) {
    var card = h('div', { class: mode === 'try' ? 'ms-try' : 'ms-q', id: it.id ? 'q-' + it.id : null });
    var top = '<div class="ms-qtop">' + (mode === 'try' ? '<span class="ms-qtype">Try it</span>' :
      '<span class="ms-qn">' + num + '</span><span class="ms-qtype">' + TYPE_LABEL[it.type] + '</span>') +
      (it.std && mode !== 'try' ? '<span class="ms-qstd">' + it.std + '</span>' : '') + '</div>';
    card.innerHTML = top + '<div class="ms-prompt">' + it.q + '</div>';
    if (it.fig) { var fg = h('div', { class: 'ms-fig' }); if (typeof it.fig === 'function') it.fig(fg); else fg.innerHTML = it.fig; card.appendChild(fg); }
    if (it.type === 'err') {
      var ol = h('ol', { class: 'ms-work' }); it.steps.forEach(function (s) { ol.appendChild(h('li', null, s)); }); card.appendChild(ol);
    }
    var rec = { item: it, tries: [], correct: false, points: 0, done: false };
    var choices = [], input = null, selected = -1;
    var choiceList = it.type === 'err' ? it.steps.map(function (s, i) { return 'Step ' + (i + 1); }) : it.choices;
    if (it.type === 'mc' || it.type === 'err' || it.type === 'sel') {
      var box = h('div', { class: 'ms-choices', role: it.type === 'sel' ? 'group' : 'radiogroup' });
      choiceList.forEach(function (c, i) {
        var b;
        if (it.type === 'sel') {
          b = h('label', { class: 'ms-ch' }, '<input type="checkbox"><span>' + c + '</span>');
          b.querySelector('input').addEventListener('change', function () { b.classList.toggle('sel', this.checked); fb('', ''); });
        } else {
          b = h('button', { class: 'ms-ch', type: 'button', role: 'radio', 'aria-checked': 'false' }, '<span class="k">' + LET[i] + '</span><span>' + c + '</span>');
          b.addEventListener('click', function () {
            if (rec.done) return;
            selected = i; choices.forEach(function (x, j) { x.classList.toggle('sel', j === i); x.setAttribute('aria-checked', j === i ? 'true' : 'false'); });
            fb('', '');
            if (mode === 'try') check();
          });
        }
        choices.push(b); box.appendChild(b);
      });
      card.appendChild(box);
    }
    var row = h('div', { class: 'ms-row' });
    if (it.type === 'num' || it.type === 'pt') {
      input = h('input', { class: 'ms-in', type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false',
        'aria-label': 'Your answer', placeholder: it.ph || (it.type === 'pt' ? '(x, y)' : (it.sci ? 'e.g. 3.2 x 10^5' : 'Your answer')) });
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); });
      row.appendChild(input);
      if (it.unit) row.appendChild(h('span', { class: 'ms-unit' }, it.unit));
    }
    var checkBtn = null;
    if (!(mode === 'try' && (it.type === 'mc' || it.type === 'err'))) {
      checkBtn = h('button', { class: 'ms-btn', type: 'button' }, 'Check'); row.appendChild(checkBtn);
      checkBtn.addEventListener('click', check);
    }
    var hintBtn = h('button', { class: 'ms-btn ghost', type: 'button' }, 'Hint'); row.appendChild(hintBtn);
    var showBtn = h('button', { class: 'ms-btn ghost', type: 'button', hidden: '' }, 'Show answer');
    if (mode === 'try') row.appendChild(showBtn);
    card.appendChild(row);
    if (input && it.sci) {
      var keys = h('div', { class: 'ms-keys' });
      [['× 10^', ' x 10^'], ['^', '^'], ['−', '-'], ['/', '/']].forEach(function (k) {
        var kb = h('button', { class: 'ms-key', type: 'button', 'aria-label': 'type ' + k[0] }, k[0]);
        kb.addEventListener('click', function () {
          if (rec.done) return;
          var s = input.selectionStart == null ? input.value.length : input.selectionStart, e2 = input.selectionEnd == null ? s : input.selectionEnd;
          input.value = input.value.slice(0, s) + k[1] + input.value.slice(e2); input.focus();
          var p = s + k[1].length; try { input.setSelectionRange(p, p); } catch (x) {}
        });
        keys.appendChild(kb);
      });
      card.appendChild(keys);
    }
    var hintEl = h('div', { class: 'ms-hint', hidden: '' }, it.hint || 'Read the question again. What is it asking for?');
    var fbEl = h('div', { class: 'ms-fb', 'aria-live': 'polite' });
    var exEl = h('div', { class: 'ms-explain', hidden: '' }, it.explain || '');
    card.appendChild(hintEl); card.appendChild(fbEl); card.appendChild(exEl);
    hintBtn.addEventListener('click', function () { hintEl.hidden = false; });
    showBtn.addEventListener('click', function () { reveal(); });

    function fb(cls, msg) { fbEl.className = 'ms-fb' + (cls ? ' ' + cls : ''); fbEl.innerHTML = msg || ''; }
    function answerText() {
      if (it.type === 'num' || it.type === 'pt') return input.value.trim();
      if (it.type === 'sel') return choices.map(function (c, i) { return c.querySelector('input').checked ? LET[i] : ''; }).join('') ;
      return selected >= 0 ? LET[selected] : '';
    }
    function rightText() {
      if (it.type === 'num' || it.type === 'pt') return it.show;
      if (it.type === 'sel') return it.ans.map(function (i) { return LET[i]; }).join(', ');
      return LET[it.ans] + '. ' + MS.text(choiceList[it.ans]);
    }
    function evaluate() {
      if (it.type === 'num' || it.type === 'pt') return MS.grade(it, input.value);
      if (it.type === 'sel') {
        var picked = choices.map(function (c) { return c.querySelector('input').checked; });
        if (!picked.some(Boolean)) return { state: 'unread', msg: 'Pick at least one choice.' };
        var wrongPick = picked.map(function (p, i) { return p && it.ans.indexOf(i) < 0 ? i : -1; }).filter(function (i) { return i >= 0; });
        var missed = it.ans.filter(function (i) { return !picked[i]; });
        if (!wrongPick.length && !missed.length) return { state: 'ok' };
        var msg = '';
        if (wrongPick.length) { var wi = wrongPick[0]; msg = 'Choice ' + LET[wi] + ' is not right. ' + ((it.why && it.why[wi]) || ''); }
        else msg = 'Everything you picked is right, but you missed ' + (missed.length === 1 ? 'one' : missed.length) + '. ' + (it.missHint || 'Look at each choice again.');
        return { state: 'no', msg: msg };
      }
      if (selected < 0) return { state: 'unread', msg: 'Pick a choice first.' };
      if (selected === it.ans) return { state: 'ok' };
      return { state: 'no', msg: (it.why && it.why[selected]) || 'Not yet. Try the hint.' };
    }
    function lock() {
      rec.done = true; card.classList.add('locked');
      if (input) input.readOnly = true;
      choices.forEach(function (c) { var ci = c.querySelector('input'); if (ci) ci.disabled = true; else c.disabled = true; });
      if (checkBtn) checkBtn.disabled = true; hintBtn.disabled = true;
    }
    function markChoices() {
      if (it.type === 'mc' || it.type === 'err') choices.forEach(function (c, i) { c.classList.remove('sel'); if (i === it.ans) c.classList.add('ok'); else if (i === selected) c.classList.add('no'); });
      if (it.type === 'sel') choices.forEach(function (c, i) {
        var on = c.querySelector('input').checked, good = it.ans.indexOf(i) >= 0;
        c.classList.remove('sel'); if (good) c.classList.add('ok'); else if (on) c.classList.add('no');
      });
    }
    function reveal() {
      fb('info', 'The answer is <b>' + rightText() + '</b>.'); exEl.hidden = !it.explain; showBtn.hidden = true;
      if (it.type !== 'num' && it.type !== 'pt') markChoices();
    }
    var misses = 0;
    function check() {
      if (rec.done) return;
      var r = evaluate();
      if (r.state === 'unread' || r.state === 'form') { fb('no', r.msg); if (input) { input.classList.remove('bad'); void input.offsetWidth; input.classList.add('bad'); } return; }
      var ans = answerText();
      if (r.state === 'ok') {
        rec.tries.push({ a: ans, ok: true });
        fb('ok', (mode === 'try' ? 'Yes! ' : (rec.tries.length === 1 ? 'Correct! ' : 'Correct on your second try. ')) + (it.okMsg || ''));
        exEl.hidden = !it.explain; showBtn.hidden = true;
        if (it.type !== 'num' && it.type !== 'pt') markChoices();
        if (mode === 'try') { rec.correct = true; lockTry(); return; }
        rec.correct = true; rec.points = rec.tries.length === 1 ? 1 : 0.5; lock(); if (onDone) onDone(rec); return;
      }
      misses++;
      if (mode === 'try') {
        fb('no', r.msg); if (misses >= 2) hintEl.hidden = false; if (misses >= 3) showBtn.hidden = false;
        if (input) { input.classList.remove('bad'); void input.offsetWidth; input.classList.add('bad'); }
        return;
      }
      rec.tries.push({ a: ans, ok: false });
      if (rec.tries.length === 1) {
        fb('no', r.msg + ' <span style="font-weight:500">You have one more try.</span>'); hintEl.hidden = false;
        if (input) { input.classList.remove('bad'); void input.offsetWidth; input.classList.add('bad'); input.select && input.select(); }
        return;
      }
      fb('no', r.msg + '<br><span style="color:#1B2333;font-weight:500">The answer is <b>' + rightText() + '</b>.</span>');
      exEl.hidden = !it.explain; markChoices(); lock(); if (onDone) onDone(rec);
    }
    function lockTry() { if (input) input.readOnly = true; if (checkBtn) checkBtn.disabled = true; rec.done = true; card.classList.add('locked');
      choices.forEach(function (c) { var ci = c.querySelector('input'); if (ci) ci.disabled = true; else c.disabled = true; }); }
    card._rec = rec; card._check = check; card._right = rightText;
    return card;
  };

  /* ---------------- verification code ---------------- */
  MS.code = function (name, lesson, score, dateISO) {
    var s = String(name).trim().toLowerCase().replace(/\s+/g, ' ') + '|' + lesson + '|' + score + '|' + dateISO, x = 2166136261;
    for (var i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619) >>> 0; }
    var A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', out = '';
    for (var j = 0; j < 6; j++) { out += A[x % 32]; x = Math.floor(x / 32); if (j === 3) x ^= 0x5bd1e995 >>> 0; x >>>= 0; }
    return out;
  };
  function todayISO() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function todayLong() { return new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  MS.esc = esc;

  /* ---------------- self-test ---------------- */
  MS.fails = [];
  function fail(msg) { MS.fails.push(msg); console.error('[Math in Science self-test] ' + msg); }
  MS.assert = function (cond, msg) { if (!cond) fail(msg); };
  MS.selfTest = function (items, extra) {
    items.forEach(function (it, i) {
      var tag = (it.id || ('item ' + (i + 1)));
      if (it.type === 'num' || it.type === 'pt') {
        if (it.ans == null) return fail(tag + ': no answer');
        var acc = (it.accept || []).slice(); if (it.show) acc.unshift(it.show.split(/\s+\(|;|\s+or\s+|\s*≈/)[0]);
        acc.forEach(function (a) { var r = MS.grade(it, a); if (r.state !== 'ok') fail(tag + ': "' + a + '" should be correct but got ' + r.state); });
        (it.reject || []).forEach(function (a) { var r = MS.grade(it, a); if (r.state === 'ok') fail(tag + ': "' + a + '" should be marked wrong'); });
        (it.wrong || []).forEach(function (w) { if (typeof w[0] === 'string' && MS.grade(it, w[0]).state === 'ok') fail(tag + ': listed wrong answer "' + w[0] + '" is graded correct'); });
      } else if (it.type === 'sel') {
        if (!it.ans.length || it.ans.some(function (k) { return k < 0 || k >= it.choices.length; })) fail(tag + ': bad select-all key');
      } else {
        var n = it.type === 'err' ? it.steps.length : it.choices.length;
        if (!(it.ans >= 0 && it.ans < n)) fail(tag + ': bad answer index');
      }
      if (it.check) { var c = it.check(); if (c !== true) fail(tag + ': math check failed ' + (c || '')); }
    });
    (extra || []).forEach(function (e) { if (!e[1]) fail('check: ' + e[0]); });
    // parser sanity
    [['3.2x10^5', '320000'], ['3.2*10^5', '320000'], ['3.2 × 10^5', '320000'], ['3.2 x 10⁵', '320000'], ['1/2', '0.5'], ['2 1/3', '7/3'],
     ['10^-3', '0.001'], ['1.1 billion', '1100000000'], ['2^5', '32'], ['1.67×10^(-27)', '1.67e-27'], ['−4', '-4'], ['75%', '75'], ['$15,000', '15000'], ['2.7 g', '2.7'], ['x = 5', '5']]
      .forEach(function (p) { var a = MS.parse(p[0]), b = MS.parse(p[1]); if (!a || !b || !Q.eq(a.v, b.v)) fail('parser: ' + p[0] + ' ≠ ' + p[1]); });
    window.MS_SELFTEST = { ok: MS.fails.length === 0, fails: MS.fails.slice() };
    return MS.fails.length === 0;
  };

  /* ---------------- lesson page ---------------- */
  MS.lesson = function (C) {
    var app = document.getElementById('ms-app'); app.classList.add('ms');
    document.title = 'Lesson ' + C.num + ': ' + C.title + ' · Math in Science';
    app.innerHTML =
      '<a href="index.html" class="back-link">← Math in Science</a>' +
      '<header class="page-hdr"><div class="eyebrow">Math in Science · Lesson ' + C.num + '</div><h1>' + C.title + '</h1>' +
      '<p class="ms-question">' + C.question + '</p><p>' + C.intro + '</p>' +
      '<p class="stds">' + C.math.join(' · ') + ' · Science ' + C.sci + '</p></header>' +
      '<div class="ms-target"><b>Learning target:</b> ' + C.target + '<div class="ms-vocab">' + C.vocab.map(function (v) { return '<span>' + v + '</span>'; }).join('') + '</div></div>';
    app.appendChild(h('div', { class: 'section-label' }, 'Tutorial <span>· about ' + (C.minutes || 6) + ' minutes</span>'));
    var tryItems = [];
    C.steps.forEach(function (s, i) {
      var st = h('section', { class: 'ms-step', id: 'step' + (i + 1) });
      st.innerHTML = '<h2><span class="n">' + (i + 1) + '</span>' + s.title + '</h2><div class="body">' + s.body + '</div>';
      if (s.fig) { var f = h('div', { class: 'ms-fig' + (s.wide ? ' wide' : '') }); st.appendChild(f); s.fig(f); }
      if (s.after) st.appendChild(h('div', { class: 'body' }, s.after));
      if (s.tryit) { s.tryit.id = s.tryit.id || ('t' + (i + 1)); tryItems.push(s.tryit); st.appendChild(MS.question(s.tryit, 'try')); }
      app.appendChild(st);
    });
    if (C.desmos) app.appendChild(h('div', { class: 'ms-tip' }, '<h3>Check it in Desmos</h3>' + C.desmos +
      '<p style="margin:8px 0 0"><a href="https://www.desmos.com/calculator" target="_blank" rel="noopener">Open the Desmos calculator</a> (the same one you use on the NC EOG).</p>'));

    var A = C.assignment;
    app.appendChild(h('div', { class: 'section-label', id: 'assignment' }, 'Assignment <span>· ' + A.length + ' questions</span>'));
    app.appendChild(h('p', { class: 'intro' }, 'You get two tries on each question. Right on the first try = 1 point. Right on the second try = ½ point. Use the hint if you are stuck.'));
    var prog = h('div', { class: 'ms-progress' }, '<span class="t">0 of ' + A.length + ' done</span><span class="ms-bar"><i></i></span>');
    app.appendChild(prog);
    var recs = [], qhost = h('div'); app.appendChild(qhost);
    var finish = h('section', { class: 'ms-finish', id: 'finish', hidden: '' });
    function build() {
      qhost.innerHTML = ''; recs = []; finish.hidden = true; finish.innerHTML = '';
      A.forEach(function (it, i) {
        it.id = it.id || ('a' + (i + 1));
        var card = MS.question(it, 'assign', i + 1, function () { update(); });
        recs.push(card._rec); qhost.appendChild(card);
      });
      update();
    }
    function update() {
      var done = recs.filter(function (r) { return r.done; }).length;
      prog.querySelector('.t').textContent = done + ' of ' + A.length + ' done';
      prog.querySelector('i').style.width = (100 * done / A.length) + '%';
      if (done === A.length && finish.hidden) showFinish();
    }
    function score() { var p = recs.reduce(function (s, r) { return s + r.points; }, 0); return p; }
    function ptsText(p) { return (p % 1 ? (Math.floor(p) ? Math.floor(p) + '½' : '½') : String(p)); }
    function showFinish() {
      var saved = MS.store('get', NAME_KEY).trim(), sp = saved.indexOf(' ');
      var first = sp > 0 ? saved.slice(0, sp) : saved, last = sp > 0 ? saved.slice(sp + 1) : '';
      finish.hidden = false;
      finish.innerHTML = '<h2>You finished the assignment!</h2><p>Type your first and last name to see your results.</p>' +
        '<div class="ms-names"><label>First name<input id="ms-first" autocomplete="given-name" value="' + esc(first) + '"></label>' +
        '<label>Last name<input id="ms-last" autocomplete="family-name" value="' + esc(last) + '"></label></div>' +
        '<div class="ms-fb" id="ms-name-fb"></div><div class="ms-row"><button class="ms-btn gold" id="ms-show" type="button">Show my results</button></div><div id="ms-cert-host"></div>';
      finish.querySelector('#ms-show').addEventListener('click', showCert);
      finish.querySelectorAll('input').forEach(function (inp) { inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') showCert(); }); });
      finish.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    function showCert() {
      var f = finish.querySelector('#ms-first').value.trim().replace(/\s+/g, ' '), l = finish.querySelector('#ms-last').value.trim().replace(/\s+/g, ' ');
      var nfb = finish.querySelector('#ms-name-fb');
      if (!f || !l) { nfb.className = 'ms-fb no'; nfb.textContent = 'Please type both your first name and your last name.'; return; }
      nfb.textContent = '';
      var name = f + ' ' + l; MS.store('set', NAME_KEY, name);
      var p = score(), pct = Math.round(100 * p / A.length), iso = todayISO(), dl = todayLong();
      var code = MS.code(name, 'MS' + C.num, p + '/' + A.length, iso);
      var msg = pct >= 90 ? 'Outstanding work!' : pct >= 70 ? 'Nice job. You are getting it.' : pct >= 50 ? 'Good effort. Look at the questions you missed and try again.' : 'Keep going. Read the tutorial again, then try the assignment again.';
      finish.querySelector('#ms-cert-host').innerHTML =
        '<div class="ms-cert" id="ms-cert"><div class="who">' + esc(name) + '</div><div class="what">Math in Science · Lesson ' + C.num + ': ' + C.title + '</div>' +
        '<div class="score">' + ptsText(p) + ' / ' + A.length + ' <span style="font-size:.55em">(' + pct + '%)</span></div><div class="what">' + msg + '</div>' +
        '<div class="what" style="margin-top:6px">' + esc(dl) + '</div><div class="code" aria-label="Verification code">' + code + '</div>' +
        '<div class="small">Verification code. Take a screenshot of this box for Mr. Allen.</div></div>' +
        '<div class="ms-row"><button class="ms-btn" id="ms-print-btn" type="button">Print my results</button><button class="ms-btn ghost" id="ms-again" type="button">Try the assignment again</button></div>';
      buildPrint(name, p, pct, dl, code);
      finish.querySelector('#ms-print-btn').addEventListener('click', function () { window.print(); });
      finish.querySelector('#ms-again').addEventListener('click', function () { build(); document.getElementById('assignment').scrollIntoView({ behavior: 'smooth' }); });
    }
    function buildPrint(name, p, pct, dl, code) {
      var pr = document.getElementById('ms-print'); if (!pr) { pr = h('div', { id: 'ms-print' }); document.body.appendChild(pr); }
      var rows = recs.map(function (r, i) {
        var it = r.item, mine = r.tries.map(function (t, k) { return (k ? 'Try 2: ' : 'Try 1: ') + esc(t.a || '(blank)') + (t.ok ? ' ✓' : ' ✗'); }).join('<br>');
        var q = MS.text(it.q) + (it.type === 'mc' || it.type === 'sel' ? ' Choices: ' + it.choices.map(function (c, j) { return LET[j] + ') ' + MS.text(c); }).join('  ') : '') +
          (it.type === 'err' ? ' Work: ' + it.steps.map(function (s, j) { return 'Step ' + (j + 1) + ': ' + MS.text(s); }).join('  ') : '');
        return '<tr><td>' + (i + 1) + '</td><td>' + esc(q) + '</td><td>' + mine + '</td><td>' + (r.correct ? 'Right' : 'Wrong') + '</td><td>' + r.points + '</td></tr>';
      }).join('');
      pr.innerHTML = '<h1>Math in Science · Lesson ' + C.num + ': ' + esc(C.title) + '</h1>' +
        '<p class="meta"><b>Name:</b> ' + esc(name) + ' &nbsp; <b>Date:</b> ' + esc(dl) + ' &nbsp; <b>Score:</b> ' + ptsText(p) + ' / ' + A.length + ' (' + pct + '%)' +
        ' &nbsp; <b>Code:</b> <span class="code">' + code + '</span><br>' + C.math.join(', ') + ' · Science ' + C.sci + '</p>' +
        '<table><thead><tr><th>#</th><th>Question</th><th>My answer</th><th>Result</th><th>Points</th></tr></thead><tbody>' + rows + '</tbody></table>';
    }
    app.appendChild(finish);
    build();
    if (C.ixl) app.appendChild(h('div', { class: 'ms-tip' }, '<h3>Practice more on IXL</h3>' +
      '<ul>' + C.ixl.map(function (x) {
        return '<li>' + x[0] + ': <a href="' + ixlUrl(x[0], x[1]) + '" target="_blank" rel="noopener">' + x[1] + '</a>' + (x[2] ? ' <span class="mono" style="color:#687082;font-size:13px">(' + x[2] + ')</span>' : '') + '</li>';
      }).join('') + '</ul>'));
    app.appendChild(h('p', { class: 'ms-cap', style: 'margin-top:18px' }, (C.note || 'Numbers in the examples are approximate or made up for practice unless a source is named.')));
    MS.selfTest(tryItems.concat(A), C.checks || []);
    MS._recs = function () { return recs; };
  };

  /* ---------------- games: best score ---------------- */
  MS.best = function (key, score) {
    var b = parseInt(MS.store('get', key), 10) || 0;
    if (score != null && score > b) { MS.store('set', key, String(score)); return { best: score, isNew: true }; }
    return { best: b, isNew: false };
  };
  MS.shuffle = function (a, rnd) { a = a.slice(); rnd = rnd || Math.random; for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
})();
