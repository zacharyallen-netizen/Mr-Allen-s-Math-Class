/* loads student-fx.js (flash, sounds, matching buttons) once per page */
(function () { try { if (window.FX || document.getElementById('fx-js')) return; var s = document.createElement('script'); s.id = 'fx-js';
  s.src = new URL('../student-fx.js?v=20261111c', document.currentScript.src).href; document.head.appendChild(s); } catch (e) {} })();
/* ─────────────────────────────────────────────────────────────────────────────
   Step Work: a step-by-step workspace for solving equations and inequalities.
   The student picks a move, sees it on the equation (what cancels, which terms are alike,
   how a reciprocal turns a fraction into 1), then WRITES the next line. Every line is checked
   right away with exact fractions, and feedback names the mistake. The answer is never shown.

   StepWork.mount(host, cfg)
     cfg.start   "3(x - 1) + 2x = 22"           solve this equation / inequality
     cfg.setup   { answer: 20, hint: "...", ineq: false }  student writes the equation first
     cfg.then    [{ label: "(4x + 15)°", expr: "4x + 15", unit: "°" }]   evaluate after solving
     cfg.v       variable letter (default: found in start, else "x")
     cfg.onAnswer(text, info)   "Use this answer" fills the page's answer box
   Auto-attach: pre-test pages (QS), practice pages (window.PRACTICE), homework (window.HW_STEPS).
   Notation: type - for minus, / for fractions (2/3x means ⅔x), ^ for exponents, <= and >= or the ≤ ≥ keys.
   ───────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';
  if (window.StepWork) return;

  /* ===================== exact fractions ===================== */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function Q(n, d) { d = d == null ? 1 : d; if (d === 0) throw err('zero'); if (d < 0) { n = -n; d = -d; } var g = gcd(n, d); return { n: n / g, d: d / g }; }
  var ZERO = Q(0), ONE = Q(1);
  function qadd(a, b) { return Q(a.n * b.d + b.n * a.d, a.d * b.d); }
  function qsub(a, b) { return Q(a.n * b.d - b.n * a.d, a.d * b.d); }
  function qmul(a, b) { return Q(a.n * b.n, a.d * b.d); }
  function qdiv(a, b) { if (b.n === 0) throw err('zero'); return Q(a.n * b.d, a.d * b.n); }
  function qneg(a) { return Q(-a.n, a.d); }
  function qeq(a, b) { return a.n === b.n && a.d === b.d; }
  function qsign(a) { return a.n > 0 ? 1 : a.n < 0 ? -1 : 0; }
  function qnum(a) { return a.n / a.d; }
  function qdec(s) { var p = s.split('.'), f = (p[1] || '').length; return Q(parseInt(p[0] || '0', 10) * Math.pow(10, f) + (f ? parseInt(p[1], 10) : 0), Math.pow(10, f)); }
  function qtxt(a) { if (a.d % 113 === 0) { var r = Q(a.n * 113, a.d * 355); if (r.d <= 1000) return (r.n === 1 && r.d === 1 ? '' : r.n === -1 && r.d === 1 ? '-' : qtxt(r)) + 'π'; } return a.d === 1 ? String(a.n) : a.n + '/' + a.d; }
  function err(code, extra) { var e = new Error(code); e.code = code; e.extra = extra; return e; }

  /* ===================== polynomials in one variable (degree ≤ 3; cubes since Nov 2026 for volume) ===================== */
  function P(c0, c1, c2, c3) { return [c0 || ZERO, c1 || ZERO, c2 || ZERO, c3 || ZERO]; }
  function pconst(q) { return P(q); }
  function padd(a, b) { return [qadd(a[0], b[0]), qadd(a[1], b[1]), qadd(a[2], b[2]), qadd(a[3], b[3])]; }
  function psub(a, b) { return [qsub(a[0], b[0]), qsub(a[1], b[1]), qsub(a[2], b[2]), qsub(a[3], b[3])]; }
  function pscale(a, k) { return [qmul(a[0], k), qmul(a[1], k), qmul(a[2], k), qmul(a[3], k)]; }
  function pmul(a, b) {
    var r = [ZERO, ZERO, ZERO, ZERO, ZERO, ZERO, ZERO];
    for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) if (a[i].n && b[j].n) r[i + j] = qadd(r[i + j], qmul(a[i], b[j]));
    if (r[4].n || r[5].n || r[6].n) throw err('degree');
    return [r[0], r[1], r[2], r[3]];
  }
  function pdeg(a) { return a[3].n ? 3 : a[2].n ? 2 : a[1].n ? 1 : 0; }
  function peq(a, b) { return qeq(a[0], b[0]) && qeq(a[1], b[1]) && qeq(a[2], b[2]) && qeq(a[3], b[3]); }
  function pzero(a) { return !a[0].n && !a[1].n && !a[2].n && !a[3].n; }
  function pat(a, x) { return qadd(qadd(qadd(a[0], qmul(a[1], x)), qmul(a[2], qmul(x, x))), qmul(a[3], qmul(x, qmul(x, x)))); }

  /* ===================== reading what students type ===================== */
  var VULGAR = { '½': '(1/2)', '⅓': '(1/3)', '⅔': '(2/3)', '¼': '(1/4)', '¾': '(3/4)', '⅕': '(1/5)', '⅖': '(2/5)', '⅗': '(3/5)', '⅘': '(4/5)', '⅙': '(1/6)', '⅚': '(5/6)', '⅛': '(1/8)', '⅜': '(3/8)', '⅝': '(5/8)', '⅞': '(7/8)' };
  var SUP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' };
  function clean(s) {
    s = String(s)
      .replace(/<span class="fr"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/g, '(($1)/($2))')
      .replace(/<sup>(.*?)<\/sup>/g, '^($1)').replace(/<[^>]+>/g, '')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
      .replace(/[−–—]/g, '-').replace(/sqrt/gi, '√').replace(/pi/gi, 'π').replace(/\+\/-|\+-(?=[\d√(])/g, '±').replace(/~/g, '≈').replace(/[×·∙⋅]/g, '*').replace(/÷/g, '/').replace(/°/g, '')
      .replace(/<=|=</g, '≤').replace(/>=|=>/g, '≥')
      .replace(/[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/g, function (c) { return VULGAR[c]; })
      .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, function (m) { return '^(' + m.split('').map(function (c) { return SUP[c]; }).join('') + ')'; })
      .replace(/\^\s*(\d+)\s+(?=[\d(√π])/g, '^$1*')                 // r^2 5 means r² · 5, not r^25
      .replace(/(\d+)\s+(\d+)\s*\/\s*(\d+)/g, '($1+$2/$3)')        // mixed number 2 1/3
      .replace(/[A-Z]/g, function (c) { return c.toLowerCase(); });
    return s.replace(/\s+/g, '');
  }
  function lex(s) {
    var t = [], i = 0, m;
    while (i < s.length) {
      var c = s[i];
      if ((m = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i)))) { t.push({ k: 'num', v: m[1] }); i += m[1].length; continue; }
      if (/[a-z]/.test(c)) { t.push({ k: 'var', v: c }); i++; continue; }
      if ('+-*/^()√±'.indexOf(c) >= 0) { t.push({ k: c }); i++; continue; }
      if (c === 'π') { t.push({ k: 'pi' }); i++; continue; }
      if ('=<>≤≥≈'.indexOf(c) >= 0) { t.push({ k: 'rel', v: c }); i++; continue; }
      if (c === '[' || c === '{') { t.push({ k: '(' }); i++; continue; }
      if (c === ']' || c === '}') { t.push({ k: ')' }); i++; continue; }
      throw err('char', c);
    }
    return t;
  }
  function parseExpr(tokens) {
    var i = 0;
    function peek() { return tokens[i]; }
    function eat(k) { var x = tokens[i]; if (!x || x.k !== k) throw err(k === ')' ? 'paren' : 'syntax'); i++; return x; }
    function sum() {
      var terms = [{ s: 1, n: unary() }];
      while (peek() && (peek().k === '+' || peek().k === '-')) { var op = tokens[i++].k; terms.push({ s: op === '+' ? 1 : -1, n: unary() }); }
      return terms.length === 1 && terms[0].s === 1 ? terms[0].n : { t: 'add', terms: terms };
    }
    function unary() {
      var x = peek(); if (!x) throw err('missing');
      if (x.k === '-') { i++; return { t: 'neg', a: unary() }; }
      if (x.k === '±') { i++; return { t: 'pm', a: unary() }; }
      if (x.k === '+') { i++; return unary(); }
      return product();
    }
    function product() {
      var a = power();
      for (;;) {
        var x = peek(); if (!x) break;
        if (x.k === '*' || x.k === '/') { i++; var b = x.k === '*' ? unaryInProduct() : unaryInProduct(); a = { t: x.k === '*' ? 'mul' : 'div', a: a, b: b }; continue; }
        if (x.k === 'num' || x.k === 'var' || x.k === '(' || x.k === '√' || x.k === 'pi') { a = { t: 'mul', a: a, b: power(), imp: true }; continue; }
        break;
      }
      return a;
    }
    function unaryInProduct() { var x = peek(); if (x && x.k === '-') { i++; return { t: 'neg', a: power() }; } return power(); }
    function power() {
      var a = primary();
      if (peek() && peek().k === '^') {
        i++; var neg = false, paren = false;
        if (peek() && peek().k === '(') { paren = true; i++; }
        if (peek() && peek().k === '-') { neg = true; i++; }
        var e = eat('num'); if (/\./.test(e.v)) throw err('exp');
        if (paren) eat(')');
        a = { t: 'pow', a: a, e: (neg ? -1 : 1) * parseInt(e.v, 10) };
      }
      return a;
    }
    function primary() {
      var x = peek(); if (!x) throw err('missing');
      if (x.k === 'num') { i++; return { t: 'num', v: qdec(x.v), src: x.v }; }
      if (x.k === 'var') { i++; return { t: 'var', v: x.v }; }
      if (x.k === '√') { i++; return { t: 'sqrt', a: power() }; }
      if (x.k === 'pi') { i++; return { t: 'pi' }; }
      if (x.k === '(') { i++; var e = sum(); eat(')'); return { t: 'par', a: e }; }
      if (x.k === ')') throw err('paren');
      throw err('missing');
    }
    var out = sum();
    if (i < tokens.length) throw err(tokens[i].k === ')' ? 'paren' : 'syntax');
    return out;
  }
  function parseEq(text) {
    var s = clean(text);
    if (!s) throw err('empty');
    var tk = lex(s), rels = tk.filter(function (x) { return x.k === 'rel'; });
    if (rels.length === 0) throw err('norel');
    if (rels.length > 1) throw err('tworel');
    var k = tk.indexOf(rels[0]), L = tk.slice(0, k), R = tk.slice(k + 1);
    if (!L.length || !R.length) throw err('side');
    var e = { L: parseExpr(L), R: parseExpr(R), rel: rels[0].v };
    var vars = {}; [e.L, e.R].forEach(function (n) { walk(n, function (x) { if (x.t === 'var') vars[x.v] = 1; }); });
    e.vars = Object.keys(vars);
    return e;
  }
  function walk(n, f) { if (!n) return; f(n); if (n.t === 'add') n.terms.forEach(function (t) { walk(t.n, f); }); ['a', 'b'].forEach(function (k) { if (n[k]) walk(n[k], f); }); }

  /* ---- AST → polynomial. opt.dist: 'first' (multiply only the first term) or 'sign' (sign slip on the rest) ---- */
  function poly(n, v, opt) {
    switch (n.t) {
      case 'num': return pconst(n.v);
      case 'pi': return pconst(PI);
      case 'var': if (n.v !== v) { if (PARAM && n.v === PARAM.l) return pconst(PARAM.q); throw err('letter', n.v); } return P(ZERO, ONE);
      case 'par': return poly(n.a, v, opt);
      case 'neg': return wrongDist(qneg(ONE), n.a, v, opt) || pscale(poly(n.a, v, opt), qneg(ONE));
      case 'add': return n.terms.reduce(function (acc, t) { var p = poly(t.n, v, opt); return t.s > 0 ? padd(acc, p) : psub(acc, p); }, P());
      case 'mul': {
        if (opt && opt.dist) {
          var A = poly(n.a, v), B = poly(n.b, v);
          if (pdeg(A) === 0 && sumInside(n.b)) return wrongDist(A[0], n.b, v, opt);
          if (pdeg(B) === 0 && sumInside(n.a)) return wrongDist(B[0], n.a, v, opt);
        }
        return pmul(poly(n.a, v, opt), poly(n.b, v, opt));
      }
      case 'div': { var d = poly(n.b, v, opt); if (pdeg(d) > 0) throw err('divx'); if (!d[0].n) throw err('zero'); return pscale(poly(n.a, v, opt), qdiv(ONE, d[0])); }
      case 'sqrt': {
        var rr = poly(n.a, v, opt); if (pdeg(rr) > 0) throw err('sqrtx'); var qq = rr[0]; if (qq.n < 0) throw err('negroot');
        var sa = Math.round(Math.sqrt(qq.n)), sb = Math.round(Math.sqrt(qq.d)); if (sa * sa === qq.n && sb * sb === qq.d) return pconst(Q(sa, sb)); throw err('irr');
      }
      case 'pm': throw err('pm');
      case 'pow': {
        var sb0 = n.a.t === 'par' ? n.a.a : n.a; if (sb0.t === 'sqrt' && n.e % 2 === 0) { var inner = poly(sb0.a, v, opt), rr0 = P(ONE); for (var j0 = 0; j0 < n.e / 2; j0++) rr0 = pmul(rr0, inner); return rr0; }
        if (opt && opt.powMul) { var pb = poly(n.a, v); if (pdeg(pb) === 0) return pconst(qmul(pb[0], Q(n.e))); }
        if (n.e < 0) { var b0 = poly(n.a, v, opt); if (pdeg(b0) > 0) throw err('negexp'); var r0 = ONE; for (var j = 0; j < -n.e; j++) r0 = qmul(r0, b0[0]); return pconst(qdiv(ONE, r0)); }
        var r = P(ONE), b = poly(n.a, v, opt); for (var k = 0; k < n.e; k++) r = pmul(r, b); return r;
      }
    }
    throw err('syntax');
  }
  function sumInside(n) { while (n.t === 'par') n = n.a; return n.t === 'add' ? n : null; }
  function wrongDist(c, inner, v, opt) {
    if (!opt || !opt.dist) return null;
    var s = sumInside(inner); if (!s) return null;
    var out = P();
    s.terms.forEach(function (t, i) {
      var p = poly(t.n, v); if (t.s < 0) p = pscale(p, qneg(ONE));
      if (i === 0) out = padd(out, pscale(p, c));
      else if (opt.dist === 'first') out = padd(out, p);
      else out = padd(out, pscale(p, qneg(c)));
    });
    return out;
  }
  function sides(e, v, opt) { return { L: poly(e.L, v, opt), R: poly(e.R, v, opt) }; }

  /* ---- solution set of L rel R (linear) ---- */
  var FLIP = { '<': '>', '>': '<', '≤': '≥', '≥': '≤', '=': '=', '≈': '≈' };
  function solve(e, v) {
    if (e.rel === '≈') e = { L: e.L, R: e.R, rel: '=', vars: e.vars };
    var s = sides(e, v), D = psub(s.L, s.R);
    if (D[3].n) { if (D[1].n || D[2].n || e.rel !== '=') return { kind: 'quad' }; return { kind: 'cube', k: qdiv(qneg(D[0]), D[3]) }; }
    if (D[2].n) { if (D[1].n || e.rel !== '=') return { kind: 'quad' }; return { kind: 'sq', k: qdiv(qneg(D[0]), D[2]) }; }
    var a = D[1], b = D[0];
    if (!a.n) {
      var t = e.rel === '=' ? !b.n : e.rel === '<' ? qsign(b) < 0 : e.rel === '>' ? qsign(b) > 0 : e.rel === '≤' ? qsign(b) <= 0 : qsign(b) >= 0;
      return { kind: t ? 'all' : 'none' };
    }
    var x = qdiv(qneg(b), a), rel = e.rel;
    if (rel !== '=' && qsign(a) < 0) rel = FLIP[rel];
    return { kind: rel === '=' ? 'one' : 'ineq', x: x, rel: rel };
  }
  function sameSet(a, b) {
    if (a.kind !== b.kind) return false;
    if (a.kind === 'one') return qeq(a.x, b.x);
    if (a.kind === 'ineq') return qeq(a.x, b.x) && a.rel === b.rel;
    if (a.kind === 'sq' || a.kind === 'cube') return qeq(a.k, b.k);
    return true;
  }

  /* ---- solving for y (Unit 6). x is held as a stand-in number while y is solved for; two lines are the same
     line when they agree at three different x values (any equation linear in x and y is a line). ---- */
  var PARAM = null, LX = [Q(1013, 7), Q(-389, 11), Q(2027, 13)];
  function withX(q, f) { var old = PARAM; PARAM = { l: 'x', q: q }; try { return f(); } finally { PARAM = old; } }
  function lineSame(a, b) { return LX.every(function (q) { return withX(q, function () { return sameSet(solve(a, 'y'), solve(b, 'y')); }); }); }
  function linOf(n) { var a = withX(ZERO, function () { return poly(n, 'y'); }), b = withX(ONE, function () { return poly(n, 'y'); }); return { y: a[1], x: qsub(b[0], a[0]), c: a[0] }; }
  function linNeg(l) { return { y: qneg(l.y), x: qneg(l.x), c: qneg(l.c) }; }
  function linLead(l) { return l.y.n ? l.y : l.x.n ? l.x : l.c; }
  function linHtml(l) {
    var parts = [];
    if (l.y.n) parts.push([qsign(l.y), coefHtml(l.y) + '<i>y</i>']);
    if (l.x.n) parts.push([qsign(l.x), coefHtml(l.x) + '<i>x</i>']);
    if (l.c.n || !parts.length) parts.push([qsign(l.c), fmtQ(l.c)]);
    return parts.map(function (z, i) { return (i === 0 ? (z[0] < 0 ? '−' : '') : (z[0] < 0 ? ' − ' : ' + ')) + z[1]; }).join('');
  }
  function hasLetter(n, L) { var f = false; walk(n, function (m) { if (m.t === 'var' && m.v === L) f = true; }); return f; }
  function mbOf(side) { var b = withX(ZERO, function () { return poly(side, 'y')[0]; }), mb = withX(ONE, function () { return poly(side, 'y')[0]; }); return { m: qsub(mb, b), b: b }; }
  function lineDone(e) {      // y alone on one side; simple = the other side looks like mx + b
    var side = e.L.t === 'var' && e.L.v === 'y' && !hasLetter(e.R, 'y') ? e.R : e.R.t === 'var' && e.R.v === 'y' && !hasLetter(e.L, 'y') ? e.L : null;
    if (!side || e.rel !== '=') return null;
    var xs = 0, ns = 0, simple = true;
    terms(side).forEach(function (t) {
      var sum = false; walk(t.n, function (m) { if (m.t === 'add' || m.t === 'pow') sum = true; if (m.t === 'div' && hasLetter(m.b, 'x')) sum = true; });
      if (sum) simple = false; if (hasLetter(t.n, 'x')) xs++; else ns++;
    });
    if (xs > 1 || ns > 1) simple = false;
    var r = mbOf(side); r.side = side; r.simple = simple; r.xFirst = !(terms(side).length === 2 && !hasLetter(terms(side)[0].n, 'x'));
    return r;
  }
  function lineTxt(m, b) {
    var mx = !m.n ? '' : qeq(m, ONE) ? 'x' : qeq(m, qneg(ONE)) ? '-x' : qtxt(m) + 'x';
    if (!mx) return 'y = ' + qtxt(b);
    return 'y = ' + mx + (!b.n ? '' : b.n < 0 ? ' - ' + qtxt(qneg(b)) : ' + ' + qtxt(b));
  }
  function lineDiag(prev, next) {   // y is alone but the line is wrong: say which part (x-term or number) to check
    var d = lineDone(next), w; if (!d || !d.simple) return null;
    try { var b0 = withX(ZERO, function () { return solve(prev, 'y'); }), b1 = withX(ONE, function () { return solve(prev, 'y'); }); if (b0.kind !== 'one' || b1.kind !== 'one') return null; w = { m: qsub(b1.x, b0.x), b: b0.x }; } catch (x) { return null; }
    var s = qadd(w.m, w.b);
    if (w.m.n && w.b.n && ((qeq(d.m, s) && !d.b.n) || (qeq(d.b, s) && !d.m.n))) return 'An <i>x</i>-term and a number are <b>not</b> like terms, so they can\'t be combined. Keep them as two separate terms.';
    if (qeq(d.m, qneg(w.m)) && qeq(d.b, qneg(w.b))) return 'Both signs are flipped. Check your signs.';
    if (w.m.n && qeq(d.m, qneg(w.m)) && qeq(d.b, w.b)) return 'The number is right. Check the <b>sign</b> of the <i>x</i>-term.';
    if (w.b.n && qeq(d.b, qneg(w.b)) && qeq(d.m, w.m)) return 'The <i>x</i>-term is right. Check the <b>sign</b> of the number.';
    if (qeq(d.b, w.b)) return 'The number is right. Check the <i>x</i>-term. If you divided, divide <b>every</b> term, including the <i>x</i>-term.';
    if (qeq(d.m, w.m)) return 'The <i>x</i>-term is right. Check the number. If you divided, divide <b>every</b> term, including the number.';
    return null;
  }
  function lineLabel(prev, next, d, v) {
    if (d.type !== 'add') return moveLabel(d, v);
    var k = function (q) { return withX(q, function () { return psub(poly(next.L, 'y'), poly(prev.L, 'y')); }); }, k0 = k(ZERO), k1 = k(ONE);
    var kl = { y: k0[1], x: qsub(k1[0], k0[0]), c: k0[0] };
    return (qsign(linLead(kl)) < 0 ? 'subtracted ' + linHtml(linNeg(kl)) : 'added ' + linHtml(kl)) + ' on both sides';
  }

  /* ---- numbers that may be irrational (square roots), for the last line of a square-root problem ---- */
  function numv(n, v, xv) {
    switch (n.t) {
      case 'num': return qnum(n.v); case 'pi': return Math.PI; case 'var': return xv; case 'par': return numv(n.a, v, xv); case 'neg': return -numv(n.a, v, xv);
      case 'add': return n.terms.reduce(function (a, t) { return a + t.s * numv(t.n, v, xv); }, 0);
      case 'mul': return numv(n.a, v, xv) * numv(n.b, v, xv); case 'div': return numv(n.a, v, xv) / numv(n.b, v, xv);
      case 'pow': return Math.pow(numv(n.a, v, xv), n.e); case 'sqrt': return Math.sqrt(numv(n.a, v, xv));
      case 'pm': throw err('pm');
    }
    return NaN;
  }
  function hasVar(n) { var f = false; walk(n, function (m) { if (m.t === 'var') f = true; }); return f; }
  function aloneSide(e, v) {   // the number side when the letter is alone: x = …  or  … = x
    if (e.L.t === 'var' && e.L.v === v && !hasVar(e.R)) return e.R;
    if (e.R.t === 'var' && e.R.v === v && !hasVar(e.L)) return e.L;
    return null;
  }
  function sideVals(n, v) { return n.t === 'pm' ? [-numv(n.a, v), numv(n.a, v)].sort(function (a, b) { return a - b; }) : [numv(n, v)]; }
  function isApprox(n, e) { var d = false; walk(n, function (m) { if (m.t === 'num' && /\.\d/.test(m.src || '')) d = true; }); return d || e.rel === '≈'; }
  /* every value of the letter that makes the line true (null for inequalities and "all"/"none") */
  function valsOf(e, v) {
    var s;
    try { s = solve(e, v); }
    catch (x) {
      if (x.code !== 'irr' && x.code !== 'pm') throw x;
      var side = aloneSide(e, v); if (!side) throw err('irrmid');
      return { kind: 'num', list: sideVals(side, v), approx: isApprox(side, e) };
    }
    if (s.kind === 'one') { var side2 = aloneSide(e, v); return { kind: 'one', list: [qnum(s.x)], approx: side2 ? isApprox(side2, e) : false, s: s }; }
    if (s.kind === 'sq') { var k = qnum(s.k); return { kind: 'sq', list: k < 0 ? [] : k === 0 ? [0] : [-Math.sqrt(k), Math.sqrt(k)], s: s }; }
    if (s.kind === 'cube') return { kind: 'cube', list: [Math.cbrt(qnum(s.k))], s: s };
    return { kind: s.kind, s: s };
  }
  /* is the new line still true for the same numbers? ctx.positive: only lengths (positive values) count */
  function compareLines(prev, next, v, ctx) {
    var A = valsOf(prev, v), B = valsOf(next, v);
    if (!A.list || !B.list) return { ok: !!(A.s && B.s && sameSet(A.s, B.s)) };
    var a = A.list.slice(), b = B.list.slice(), note = '';
    if (ctx && ctx.positive) {
      if (b.length && b.every(function (z) { return z < 0; })) return { ok: false, msg: 'A length can\'t be negative. Use the <b>positive</b> square root.' };
      if (B.kind !== 'sq' && b.some(function (z) { return z < 0; })) note = ' A length can\'t be negative, so only the positive answer counts.';
      a = a.filter(function (z) { return z > 0; }); b = b.filter(function (z) { return z > 0; });
    }
    var tol = B.approx ? 0.05 : 1e-9;
    var same = a.length === b.length && a.every(function (z, i) { return Math.abs(z - b[i]) <= tol; });
    if (same) return { ok: true, note: (B.approx && Math.abs(a[0] - b[0]) > 1e-9 ? ' (rounded)' : '') + note };
    if (!(ctx && ctx.positive) && A.kind === 'sq' && b.length === 1 && a.length === 2 && a.some(function (z) { return Math.abs(z - b[0]) <= tol; }))
      return { ok: false, msg: 'Almost! ' + v + '<sup>2</sup> has <b>two</b> square roots, one positive and one negative. Write ' + v + ' = ±… .' };
    if (A.kind === 'sq' && B.kind !== 'sq' && b.length) return { ok: false, msg: 'Check your square root. What number times itself makes the other side?' };
    return { ok: false };
  }

  /* ===================== drawing math ===================== */
  // π is kept exact by a stand-in fraction (355/113): it cancels exactly, and any number that is a
  // simple multiple of it is shown with π (12π, ⅓π). Grade-8 numbers never have 113 in a denominator.
  var PI = Q(355, 113);
  function piPart(q) { if (q.d % 113 !== 0) return null; var r = qmul(q, Q(113, 355)); return r.d <= 1000 ? r : null; }
  function fmtQ(q, src) {
    if (src && /\./.test(src)) return src;
    var pp = piPart(q); if (pp) return (Math.abs(pp.n) === 1 && pp.d === 1 ? '' : fmtQ(pp)) + 'π';
    if (q.d === 1) return String(Math.abs(q.n));
    return '<span class="sw-fr"><span>' + Math.abs(q.n) + '</span><span>' + q.d + '</span></span>';
  }
  function isNumLike(n) { return n.t === 'num' || n.t === 'pi' || (n.t === 'div' && n.a.t === 'num' && n.b.t === 'num') || (n.t === 'par' && isNumLike(n.a)); }
  function html(n, sub) {
    switch (n.t) {
      case 'num': return fmtQ(n.v, n.src);
      case 'pi': return 'π';
      case 'var': return sub != null ? (/^\d+$/.test(sub) ? sub : '(' + sub + ')') : '<i>' + n.v + '</i>';
      case 'par': return (n.a.t === 'num' || n.a.t === 'var' || n.a.t === 'div' || n.a.t === 'par' || n.a.t === 'pow') && sub == null ? html(n.a, sub) : '(' + html(n.a, sub) + ')';
      case 'neg': return '−' + (n.a.t === 'add' ? '(' + html(n.a, sub) + ')' : html(n.a, sub));
      case 'add': return n.terms.map(function (t, i) {
        var h = html(t.n, sub), neg = t.s < 0;
        if (t.n.t === 'neg' && i > 0) { neg = !neg; h = h.replace(/^−/, ''); }
        return i === 0 ? (neg ? '−' : '') + h : (neg ? ' − ' : ' + ') + h;
      }).join('');
      case 'mul': {
        var A = html(n.a, sub), B = html(n.b, sub);
        if (sub == null && n.b.t === 'par' && isNumLike(n.b.a) && n.a.t !== 'pi') return A + '(' + html(n.b.a) + ')';   // 3(2), not 32
        if (isNumLike(n.a) && n.b.t === 'pi') return A + B;
        if (sub == null && n.b.t === 'pow' && n.b.a.t === 'num') return A + ' × ' + B;
        if (sub == null && isNumLike(n.a) && (n.b.t === 'var' || n.b.t === 'pow' || n.b.t === 'par' || n.b.t === 'mul')) return A + B;
        if (sub == null && n.a.t === 'num' && n.b.t === 'mul') return A + B;
        if (sub == null && (n.b.t === 'var' || (n.b.t === 'pow' && n.b.a.t === 'var')) && n.a.t !== 'div') return A + B;
        if (sub == null && n.a.t === 'par' && n.b.t === 'par') return A + B;
        return A + ' · ' + B;
      }
      case 'div': return '<span class="sw-fr"><span>' + html(n.a, sub) + '</span><span>' + html(n.b, sub) + '</span></span>';
      case 'pow': return (n.a.t === 'par' ? '(' + html(n.a.a, sub) + ')' : n.a.t === 'neg' || n.a.t === 'mul' || n.a.t === 'div' ? '(' + html(n.a, sub) + ')' : html(n.a, sub)) + '<sup>' + (n.e < 0 ? '−' + -n.e : n.e) + '</sup>';
      case 'sqrt': return '<span class="sw-sqrt">√<span>' + html(n.a.t === 'par' ? n.a.a : n.a, sub) + '</span></span>';
      case 'pm': return '±' + html(n.a, sub);
    }
    return '';
  }
  function relHtml(r) { return { '=': '=', '<': '&lt;', '>': '&gt;', '≤': '≤', '≥': '≥', '≈': '≈' }[r]; }
  function eqHtml(e, sub) { return html(e.L, sub) + ' <span class="sw-rel">' + relHtml(e.rel) + '</span> ' + html(e.R, sub); }
  function polyHtml(p, v) {
    var parts = [];
    if (p[3].n) parts.push([qsign(p[3]), coefHtml(p[3]) + '<i>' + v + '</i><sup>3</sup>']);
    if (p[2].n) parts.push([qsign(p[2]), coefHtml(p[2]) + '<i>' + v + '</i><sup>2</sup>']);
    if (p[1].n) parts.push([qsign(p[1]), coefHtml(p[1]) + '<i>' + v + '</i>']);
    if (p[0].n || !parts.length) parts.push([qsign(p[0]), fmtQ(p[0])]);
    return parts.map(function (x, i) { return (i === 0 ? (x[0] < 0 ? '−' : '') : (x[0] < 0 ? ' − ' : ' + ')) + x[1]; }).join('');
  }
  function coefHtml(q) { return Math.abs(q.n) === 1 && q.d === 1 ? '' : fmtQ(q); }
  function qHtml(q) { return (q.n < 0 ? '−' : '') + fmtQ(q); }

  /* top-level terms of one side, each with its own polynomial (for colors and cancelling) */
  function terms(n) {
    var list = [];
    (function go(m, s) {
      if (m.t === 'add') m.terms.forEach(function (t) { go(t.n, s * t.s); });
      else if (m.t === 'neg' && m.a.t !== 'add' && m.a.t !== 'par') go(m.a, -s);
      else list.push({ n: m, s: s });
    })(n, 1);
    return list;
  }
  function kindOf(t, v) {
    var hasSum = false; walk(t.n, function (m) { if (m.t === 'par' && sumInside(m)) hasSum = true; });
    if (hasSum) return 'paren';
    if (PARAM && hasLetter(t.n, PARAM.l) && !hasLetter(t.n, v)) return 'pterm';
    try { var p = poly(t.n, v); return p[2].n || p[3].n ? 'sq' : p[1].n ? 'xterm' : 'num'; } catch (e) { return 'num'; }
  }
  /* draw one side with colors: x-terms blue, numbers purple, parentheses gold; optional strike set */
  function sideHtml(n, v, mark) {
    return terms(n).map(function (t, i) {
      var h = html(t.n), k = kindOf(t, v), neg = t.s < 0;
      var cls = mark && mark.colors ? (k === 'xterm' ? 't-v' : k === 'num' ? 't-k' : k === 'paren' ? 't-p' : k === 'pterm' ? 't-x' : '') : '';
      if (mark && mark.strike && mark.strike.indexOf(i) >= 0) cls += ' t-c';
      var sign = i === 0 ? (neg ? '−' : '') : (neg ? ' − ' : ' + ');
      return sign + (cls ? '<span class="' + cls.trim() + '">' + h + '</span>' : h);
    }).join('');
  }

  /* ===================== aligned work (Nov 12, 2026, Zach) =====================
     A move on both sides is written UNDER the matching like term on each side (x under x, number
     under number). If a side has no like term, the move gets its own column (x-terms before the
     numbers, numbers at the end). Terms that cancel are crossed out with the move under them.
     Dividing draws a fraction bar under each whole side. Lines in the trail line up on the = sign. */
  var KEYS = ['sq3', 'sq2', 'xterm', 'pterm', 'num'];
  function termKey(t, v) {
    var k = kindOf(t, v);
    if (k === 'sq') { try { return 'sq' + pdeg(poly(t.n, v)); } catch (e) { return 'sq2'; } }
    return k;
  }
  function vecOf(n, s, v, line) {   // signed {key: coef} of one term or of a whole change
    var out = {};
    try {
      if (line) { var l = linOf(n); if (s < 0) l = linNeg(l); if (l.y.n) out.xterm = l.y; if (l.x.n) out.pterm = l.x; if (l.c.n) out.num = l.c; }
      else { var p = poly(n, v); if (s < 0) p = pscale(p, qneg(ONE)); if (p[3].n) out.sq3 = p[3]; if (p[2].n) out.sq2 = p[2]; if (p[1].n) out.xterm = p[1]; if (p[0].n) out.num = p[0]; }
    } catch (e) { }
    return out;
  }
  function monoHtml(key, c, v) {   // |c| with its letter
    var a = qsign(c) < 0 ? qneg(c) : c;
    if (key === 'num') return fmtQ(a);
    var L = key === 'pterm' ? 'x' : v;
    return coefHtml(a) + '<i>' + L + '</i>' + (key === 'sq2' ? '<sup>2</sup>' : key === 'sq3' ? '<sup>3</sup>' : '');
  }
  /* op parts for "add/subtract this to both sides". vec = the amount typed (preview) or the change (trail). */
  function opParts(vec, how, v) {
    return KEYS.filter(function (k) { return vec[k] && vec[k].n; }).map(function (k) {
      var c = vec[k], neg = qsign(c) < 0, h = monoHtml(k, c, v), txt;
      if (how === 'net') txt = (neg ? '− ' : '+ ') + h;
      else if (how === 'add') txt = neg ? '+ (−' + h + ')' : '+ ' + h;
      else txt = neg ? '− (−' + h + ')' : '− ' + h;
      return { key: k, html: txt, ch: how === 'sub' ? qneg(c) : c };
    });
  }
  function alignSide(n, v, line, op, colors) {
    var ts = terms(n), cells = ts.map(function (t) {
      var key = termKey(t, v), vec = vecOf(t.n, t.s, v, line), ks = Object.keys(vec);
      var cls = colors ? (key === 'xterm' ? 't-v' : key === 'num' ? 't-k' : key === 'paren' ? 't-p' : key === 'pterm' ? 't-x' : '') : '';
      return { t: t, key: key, coef: ks.length === 1 && ks[0] === key ? vec[key] : null, cls: cls, top: true };
    });
    if (op && op.kind === 'scale') return scaleSide(n, v, cells, op, colors);
    (op && op.parts || []).forEach(function (pt) {
      var j = -1; cells.forEach(function (c, i) { if (c.top && c.key === pt.key && !c.bot) j = i; });
      if (j >= 0) { cells[j].bot = pt; if (cells[j].coef && !qadd(cells[j].coef, pt.ch).n) cells[j].cancel = true; return; }
      var cell = { bot: pt, key: pt.key }, at = cells.length;
      if (pt.key !== 'num') { for (var i = 0; i < cells.length; i++) if (cells[i].key === 'num') { at = i; break; } }
      cells.splice(at, 0, cell);
    });
    var firstTop = true, hasBot = cells.some(function (c) { return c.bot; });
    var top = cells.map(function (c) {
      if (!c.top) return '<span class="sw-c"></span>';
      var neg = c.t.s < 0, sign = firstTop ? (neg ? '−' : '') : (neg ? '− ' : '+ '); firstTop = false;
      var cls = (c.cls + (c.cancel ? ' t-c' : '')).trim();
      return '<span class="sw-c">' + sign + (cls ? '<span class="' + cls + '">' + html(c.t.n) + '</span>' : html(c.t.n)) + '</span>';
    }).join('');
    var bot = hasBot ? cells.map(function (c) { return '<span class="sw-c sw-o' + (c.cancel ? ' t-c' : '') + '">' + (c.bot ? c.bot.html : '') + '</span>'; }).join('') : '';
    return '<span class="sw-sd" style="grid-template-columns:repeat(' + cells.length + ',auto)">' + top + bot + '</span>';
  }
  function scaleSide(n, v, cells, op, colors) {
    // one x-term whose number is undone by this move: cross out that number
    var one = cells.length === 1 && cells[0].coef && cells[0].key === 'xterm' ? cells[0] : null, strike = false;
    if (one) strike = op.div ? qeq(one.coef, op.k) : qeq(qmul(one.coef, op.k), ONE);
    var side;
    if (strike) {
      var c = one.coef, ch = c.d === 1 ? qHtml(c) : (qsign(c) < 0 ? '−' : '') + fmtQ(c);
      side = '<span class="' + (colors ? 't-v' : '') + '"><span class="t-c">' + ch + '</span><i>' + v + '</i></span>';
    } else {
      var first = true;
      side = cells.map(function (c) { var neg = c.t.s < 0, sign = first ? (neg ? '−' : '') : (neg ? ' − ' : ' + '); first = false; return sign + (c.cls ? '<span class="' + c.cls + '">' + html(c.t.n) + '</span>' : html(c.t.n)); }).join('');
    }
    var kh = qHtml(op.k);
    if (op.div) return '<span class="sw-fd"><span>' + side + '</span><span class="sw-o' + (strike ? ' t-c' : '') + '">' + kh + '</span></span>';
    var wrap = cells.length > 1 ? '(' + side + ')' : side;
    var kk = strike ? '<span class="t-c">' + kh + '</span>' : kh;
    return '<span class="sw-sd1"><span class="sw-o">' + (op.k.d !== 1 ? '(' + kk + ')' : kk) + ' · </span>' + wrap + '</span>';
  }
  /* the op between two lines of the trail, from what actually changed */
  function trailOp(prev, next, d, v, line) {
    if (!d) return null;
    if (d.type === 'add') {
      var vec;
      if (line) {
        var k = function (q) { return withX(q, function () { return psub(poly(next.L, 'y'), poly(prev.L, 'y')); }); }, k0 = k(ZERO), k1 = k(ONE);
        vec = {}; if (k0[1].n) vec.xterm = k0[1]; var kx = qsub(k1[0], k0[0]); if (kx.n) vec.pterm = kx; if (k0[0].n) vec.num = k0[0];
      } else { vec = {}; if (d.k[3].n) vec.sq3 = d.k[3]; if (d.k[2].n) vec.sq2 = d.k[2]; if (d.k[1].n) vec.xterm = d.k[1]; if (d.k[0].n) vec.num = d.k[0]; }
      return { kind: 'add', parts: opParts(vec, 'net', v) };
    }
    if (d.type === 'scale') {
      var c = d.c;
      if (Math.abs(c.n) === 1 && c.d !== 1) return { kind: 'scale', div: true, k: Q(c.n * c.d, 1) };   // ×(1/5) is ÷ 5
      return { kind: 'scale', div: false, k: c };
    }
    return null;
  }
  function alignedEq(e, v, line, op, colors) {   // the grid cells for one line: left, sign, right
    return '<span class="sw-L">' + alignSide(e.L, v, line, op, colors) + '</span><span class="sw-R0' + (op && op.kind === 'scale' && op.div ? ' mid' : '') + '">' + relHtml(e.rel) + '</span><span class="sw-Rt">' + alignSide(e.R, v, line, op, colors) + '</span>';
  }

  /* ===================== comparing two lines ===================== */
  function ratio(Pa, Pb) {   // constant c with Pb = c·Pa, or null
    var c = null;
    for (var i = 0; i < 3; i++) {
      if (!Pa[i].n && !Pb[i].n) continue;
      if (!Pa[i].n || !Pb[i].n) return null;
      var r = qdiv(Pb[i], Pa[i]); if (c && !qeq(c, r)) return null; c = r;
    }
    return c;
  }
  function describe(prev, next, v) {
    var a = sides(prev, v), b = sides(next, v);
    if (peq(a.L, b.L) && peq(a.R, b.R) && prev.rel === next.rel) return { type: 'rewrite' };
    if (peq(a.L, b.R) && peq(a.R, b.L) && FLIP[prev.rel] === next.rel) return { type: 'swap' };
    var dL = psub(b.L, a.L), dR = psub(b.R, a.R);
    if (peq(dL, dR) && prev.rel === next.rel) return { type: 'add', k: dL };
    var cL = ratio(a.L, b.L), cR = ratio(a.R, b.R);
    if (pzero(a.L) && pzero(b.L)) cL = cR; if (pzero(a.R) && pzero(b.R)) cR = cL;
    if (cL && cR && qeq(cL, cR)) return { type: 'scale', c: cL, flip: next.rel !== prev.rel };
    return { type: 'mixed' };
  }
  /* why a line is not equivalent: one specific, kind sentence */
  function diagnose(prev, next, v) {
    var a = sides(prev, v), b = sides(next, v), side;
    // forgot to flip the inequality
    if (prev.rel !== '=' && next.rel !== '=') {
      var flipped = { L: next.L, R: next.R, rel: FLIP[next.rel] };
      if (sameSet(solve(prev, v), solve(flipped, v))) return 'Look at the inequality sign. When you multiply or divide both sides by a <b>negative</b> number, the sign must <b>flip</b>.';
      if (sameSet(solve(prev, v), solve({ L: next.L, R: next.R, rel: next.rel === '<' || next.rel === '>' ? next.rel.replace('<', '≤').replace('>', '≥') : next.rel.replace('≤', '<').replace('≥', '>') }, v)))
        return 'Check the inequality sign. Should it include the "or equal to" line (≤ or ≥), or not?';
    }
    // distributing mistakes
    var mist = [['first', 'Check your distributing. Multiply the number outside the parentheses by <b>every</b> term inside, not just the first one.'],
                ['sign', 'Check the signs when you distribute. A negative times a negative is positive.']];
    for (var i = 0; i < mist.length; i++) {
      try {
        var w = sides(prev, v, { dist: mist[i][0] });
        if ((!peq(w.L, a.L) && peq(w.L, b.L) && peq(a.R, b.R)) || (!peq(w.R, a.R) && peq(w.R, b.R) && peq(a.L, b.L)) ||
            (!peq(w.L, a.L) && peq(w.L, b.L) && !peq(w.R, a.R) && peq(w.R, b.R))) return mist[i][1];
      } catch (e) { }
    }
    // 6² worked out as 6 · 2
    try { var pm2 = sides(prev, v, { powMul: true }); if ((!peq(pm2.L, a.L) || !peq(pm2.R, a.R)) && sameSet(solve({ L: next.L, R: next.R, rel: next.rel }, v), solve({ L: { t: 'num', v: ZERO }, R: { t: 'num', v: ZERO }, rel: '=' }, v)) === false) {
      var bL = peq(pm2.L, b.L) || peq(pm2.L, a.L), bR = peq(pm2.R, b.R) || peq(pm2.R, a.R);
      if (bL && bR) return 'Check your squares. A square means a number times <b>itself</b>. For example, 6<sup>2</sup> = 6 · 6 = 36, not 6 · 2.';
    } } catch (e) { }
    // changed only one side
    if (peq(a.R, b.R) && !peq(a.L, b.L)) side = 'left'; else if (peq(a.L, b.L) && !peq(a.R, b.R)) side = 'right';
    if (side) return 'You changed only the ' + side + ' side. Do the same thing to <b>both sides</b>.';
    // added on one side, subtracted on the other
    var dL = psub(b.L, a.L), dR = psub(b.R, a.R);
    if (!pzero(dL) && peq(dL, pscale(dR, qneg(ONE)))) return 'It looks like you added on one side and subtracted on the other. Do the <b>same</b> thing to both sides.';
    var cR = ratio(a.R, b.R), cL = ratio(a.L, b.L);
    // multiplied by the fraction instead of its reciprocal (one side × c, the other × 1/c)
    if (cL && cR && !qeq(cL, cR) && qeq(qmul(cL, cR), ONE)) return 'To undo a fraction in front of ' + v + ', multiply <b>both sides</b> by its <b>reciprocal</b> (flip the fraction). Use the same number on both sides.';
    // the answer came out with the wrong sign
    try { var s1 = solve(prev, v), s2 = solve(next, v); if (s1.kind === 'one' && s2.kind === 'one' && s1.x.n && qeq(s2.x, qneg(s1.x))) return 'Check your signs. A negative divided by a negative is <b>positive</b>, and a negative divided by a positive is <b>negative</b>.'; } catch (e) { }
    // divided (or multiplied) only one term
    var c = cR && !qeq(cR, ONE) ? cR : (cL && !qeq(cL, ONE) ? cL : null);
    if (c) {
      var wrongSide = cR && !qeq(cR, ONE) && !(cL && qeq(cL, cR)) ? 'left' : 'right';
      var A = wrongSide === 'left' ? a.L : a.R, B = wrongSide === 'left' ? b.L : b.R;
      var oneTerm = [P(qmul(A[0], c), A[1], A[2], A[3]), P(A[0], qmul(A[1], c), A[2], A[3])].some(function (x) { return peq(x, B); });
      if (oneTerm) return 'You ' + (qnum(c) < 1 && qnum(c) > -1 ? 'divided' : 'multiplied') + ' only part of the ' + wrongSide + ' side. Multiply or divide <b>every term</b> on both sides.';
      return 'Check the ' + wrongSide + ' side. If you multiply or divide one side by a number, do it to <b>every term</b> on the other side too.';
    }
    if (!pzero(dL) && pdeg(dL) === 0 && !pzero(dR) && pdeg(dR) === 0) return 'You added or subtracted different amounts on the two sides. Use the <b>same</b> number on both sides.';
    return 'This line doesn\'t match the line before it. Check the math one term at a time.';
  }
  function isSolved(e, v) {
    var side = aloneSide(e, v); if (!side) return null;
    var rel = side === e.R ? e.rel : FLIP[e.rel]; if (rel === '≈') rel = '=';
    try { var p = poly(side, v); return { x: p[0], rel: rel, approx: isApprox(side, e), text: plainNum(side) }; }
    catch (x) { if (x.code !== 'irr' && x.code !== 'pm') throw x; return { vals: sideVals(side, v), rel: '=', side: side, approx: isApprox(side, e), text: plainNum(side) }; }
  }
  function plainNum(n) { var d = document.createElement('div'); d.innerHTML = html(n); return d.textContent.replace(/\s+/g, ''); }
  function noVar(e) { return e.vars.length === 0; }

  /* ===================== messages ===================== */
  function readErr(e, v) {
    var c = e && e.code;
    return {
      empty: 'Type the new line first.', norel: 'Your line needs an = sign (or &lt;, &gt;, ≤, ≥).', tworel: 'Use only one = sign (or one inequality sign).',
      side: 'Something is missing on one side of the sign.', paren: 'Check your parentheses. Each ( needs a ).', missing: 'Something is missing. Check for a sign with nothing after it.',
      syntax: 'I can\'t read that yet. Check the signs and numbers.', letter: 'Use the letter <i>' + v + '</i> in this problem.', divx: 'This tool can\'t divide by ' + v + '. Try another move.',
      degree: v + ' got multiplied by itself. Check your multiplying.', zero: 'You can\'t divide by 0.', char: 'I can\'t read the symbol "' + (e && e.extra) + '". Use the keys below.',
      exp: 'Exponents here must be whole numbers.', sqrtx: 'Take the square root of a number, not of ' + v + '.', negroot: 'A negative number has no square root here.', irrmid: 'Keep the square root for the last step, when ' + v + ' is alone on one side.', pm: 'Use ± only in the last line, like ' + v + ' = ±7.', negexp: 'I can\'t use a negative exponent on ' + v + ' here.'
    }[c] || 'I can\'t read that yet. Check the signs and numbers.';
  }

  /* ===================== styles ===================== */
  var CSS = '' +
    '.sw-open{font:600 15px Inter,system-ui,sans-serif;min-height:44px;padding:8px 14px;border-radius:8px;border:1.5px dashed #1E2D4F;background:#FFF6D6;color:#1E2D4F;cursor:pointer;margin-top:10px}' +
    '.sw-open:focus-visible,.sw button:focus-visible,.sw input:focus-visible{outline:3px solid #1D4ED8;outline-offset:2px}' +
    '.sw{margin-top:8px;border:1px solid #E3E5EA;border-left:4px solid #FFC107;border-radius:10px;background:#fff;padding:12px 14px;text-align:left;color:#1E2D4F;font:400 15px/1.45 Inter,system-ui,sans-serif}' +
    '.sw[hidden]{display:none}' +
    '.sw-h{font:700 12.5px Inter,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#8A6100;margin:0 0 6px}' +
    '.sw-trail{list-style:none;margin:0 0 6px;padding:0}' +
    '.sw-trail>li{display:flex;gap:10px;align-items:baseline;padding:4px 0;border-bottom:1px solid #EEF0F3;flex-wrap:wrap}' +
    '.sw-trail>li:last-child{border-bottom:0}' +
    '.sw-n{flex:none;display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;border-radius:50%;background:#1E2D4F;color:#FFC107;font:700 12px Inter,sans-serif}' +
    '.sw-ln{font:500 20px/1.8 Inter,system-ui,sans-serif}' +
    '.sw-mv{font:600 13px Inter,sans-serif;color:#8A6100;background:#FFF6D6;border-radius:6px;padding:1px 8px}' +
    '.sw-ask{font:600 15px Inter,sans-serif;margin:10px 0 6px}' +
    '.sw-moves{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px}' +
    '@media (max-width:560px){.sw-moves{grid-template-columns:1fr 1fr}.sw-moves button{font-size:14px;padding:6px 8px}}' +
    '.sw button{font:600 14.5px Inter,sans-serif;min-height:44px;padding:6px 12px;border-radius:8px;border:1.5px solid #1E2D4F;background:#fff;color:#1E2D4F;cursor:pointer}' +
    '.sw button[aria-pressed=true]{background:#1E2D4F;color:#fff}' +
    '.sw button.go{background:#1E2D4F;color:#fff}.sw button.ghost{border-style:dashed}' +
    '.sw button:disabled{opacity:.45;cursor:not-allowed}' +
    '.sw-amt{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:8px}' +
    '.sw input{font:500 18px "JetBrains Mono",ui-monospace,monospace;min-height:44px;padding:6px 10px;border:2px solid #cdd5e0;border-radius:8px;color:#1E2D4F;background:#fff;max-width:100%}' +
    '.sw input.amt{width:110px}.sw input.line{width:100%;box-sizing:border-box}' +
    '.sw-vis{margin-top:10px;background:#FBFBF9;border:1px solid #EEF0F3;border-radius:8px;padding:8px 10px;overflow-x:auto}' +
    '.sw-grid{display:grid;grid-template-columns:auto auto auto;justify-content:start;column-gap:14px;row-gap:2px;font:500 20px/1.7 Inter,system-ui,sans-serif;align-items:center}' +
    '.sw-grid .sw-r{text-align:center}.sw-grid .sw-op{color:#B45309;font-weight:700}.sw-grid .sw-lft{text-align:right}' +
    '.sw-note{font:400 14.5px/1.45 Inter,sans-serif;color:#3A4356;margin-top:6px}' +
    '.sw-al,.sw-tg{display:grid;column-gap:10px;row-gap:4px;align-items:start;font:500 20px/1.7 Inter,system-ui,sans-serif}' +
    '.sw-al{grid-template-columns:auto auto auto;justify-content:start}' +
    '.sw-tg{grid-template-columns:auto auto auto auto minmax(90px,1fr);margin:0 0 6px}' +
    '.sw-tgw{overflow-x:auto}' +
    '.sw-L{justify-self:end}.sw-Rt{justify-self:start}.sw-R0{text-align:center;color:#1E2D4F}.sw-R0.mid{align-self:center}' +
    '.sw-sd{display:inline-grid;column-gap:6px;row-gap:0;white-space:nowrap;vertical-align:top}' +
    '.sw-c{text-align:center}.sw-o{color:#B45309;font-weight:700}' +
    '.sw-fd{display:inline-grid;grid-template-columns:auto;text-align:center;white-space:nowrap;vertical-align:middle}' +
    '.sw-fd>span:first-child{border-bottom:2.5px solid #B45309;padding:0 4px}' +
    '.sw-sd1{white-space:nowrap}' +
    '.sw-tg .sw-n{margin-top:6px}.sw-tg .sw-mv{align-self:center;justify-self:start}' +
    '.sw-tg .sw-row-end{grid-column:1/-1;border-bottom:1px solid #EEF0F3;height:0}' +
    '.sw-write{margin-top:10px}.sw-write label{display:block;font:600 14.5px Inter,sans-serif;margin-bottom:4px}' +
    '.sw-keys{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}.sw-keys button{min-width:44px;font:600 16px "JetBrains Mono",monospace;padding:4px 8px}' +
    '.sw-prev{font:500 15px Inter,sans-serif;color:#5B6475;margin-top:6px;min-height:1.4em}.sw-prev .sw-ln{font-size:18px;color:#1E2D4F}' +
    '.sw-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}' +
    '.sw-fb{margin-top:8px;font-size:15px;min-height:1px;border-radius:8px}.sw-fb.no{color:#7A1A12;background:#FBEAEA;padding:8px 10px}.sw-fb.ok{color:#14532D;background:#E7F5EC;padding:8px 10px}.sw-fb.tip{color:#5A3D00;background:#FFF6D6;padding:8px 10px}' +
    '.sw-done{margin-top:10px;background:#E7F5EC;border-radius:8px;padding:10px 12px;color:#14532D}' +
    '.sw-done .sw-ln{color:#14532D}' +
    '.sw-then{margin-top:10px}.sw-then .sw-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:6px 0;font:500 16px Inter,system-ui,sans-serif}.sw-row .sw-fb{margin-top:0}' +
    '.sw-h i{text-transform:none;font-size:1.05em}' +
    '.sw-fr{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;line-height:1.1;margin:0 2px;font-size:.85em}' +
    '.sw-fr>span:first-child{border-bottom:1.6px solid currentColor;padding:0 3px}.sw-fr>span:last-child{padding:0 3px}' +
    '.sw .t-v{color:#1D4ED8;background:#E6EDFD;border-radius:4px;padding:0 3px}' +
    '.sw .t-k{color:#7E22A8;background:#F4E8FA;border-radius:4px;padding:0 3px}' +
    '.sw .t-x{color:#166534;background:#E3F4E8;border-radius:4px;padding:0 3px}' +
    '.sw .t-p{color:#7A5300;background:#FFE58A;border-radius:4px;padding:0 3px}' +
    '.sw .t-c{text-decoration:line-through;text-decoration-color:#B42318;text-decoration-thickness:2.5px;opacity:.75}' +
    '.sw .t-c .sw-fr>span{text-decoration:line-through;text-decoration-color:#B42318;text-decoration-thickness:2.5px}' +
    '.sw-rel{color:#1E2D4F}' +
    '.sw-sqrt>span{border-top:1.6px solid currentColor;padding:0 2px;margin-left:1px}' +
    '.sw-legend{font:500 13px Inter,sans-serif;color:#5B6475;margin-top:4px}' +
    '.sw-wide{grid-column:1/-1}.sw-host .sw-open{width:100%}' +
    '@media (max-width:480px){.sw-ln,.sw-grid{font-size:18px}.sw{padding:10px}}' +
    '@media print{.sw,.sw-open{display:none!important}}';
  function css() { if (document.getElementById('sw-css')) return; var s = document.createElement('style'); s.id = 'sw-css'; s.textContent = CSS; document.head.appendChild(s); }
  function el(tag, cls, h) { var e = document.createElement(tag); if (cls) e.className = cls; if (h != null) e.innerHTML = h; return e; }
  function btn(label, cls) { var b = el('button', cls || '', label); b.type = 'button'; return b; }

  /* ===================== the workspace ===================== */
  var uid = 0;
  var PRAISE = ['✓ Yes! That line is right.', '✓ Correct. Keep going.', '✓ Nice move.', '✓ Right. One step closer.'], pn = 0;
  function praise() { return PRAISE[pn++ % PRAISE.length]; }
  function calm(n) { return '<br>Take a breath. Mistakes are part of learning. Try a different move' + (n > 1 ? ', or press <b>Undo my last line</b> to go back' : '') + '.'; }
  function mount(host, cfg) {
    css(); uid++;
    var v = cfg.v || 'x', original = null, line = !!cfg.line; if (line) v = 'y';
    if (cfg.start) { try { original = parseEq(cfg.start); if (original.vars.length === 1) v = cfg.v || original.vars[0]; } catch (e) { return null; } }
    var open = btn(cfg.label || 'Work it out step by step', 'sw-open'); open.setAttribute('aria-expanded', 'false');
    var box = el('div', 'sw'); box.hidden = true; box.id = 'sw' + uid; open.setAttribute('aria-controls', box.id);
    host.appendChild(open); host.appendChild(box);
    if (line) {   // while this workspace handles an event, x stands for a number
      var depth = 0, saved = null;
      ['click', 'keydown', 'input'].forEach(function (t) {
        box.addEventListener(t, function () { if (!depth++) { saved = PARAM; PARAM = { l: 'x', q: LX[0] }; } }, true);
        box.addEventListener(t, function () { if (!--depth) PARAM = saved; });
      });
    }
    var built = false;
    open.addEventListener('click', function () {
      box.hidden = !box.hidden; open.setAttribute('aria-expanded', String(!box.hidden));
      open.textContent = box.hidden ? (cfg.label || 'Work it out step by step') : 'Hide step-by-step work';
      if (!built) { built = true; var go0 = function () { cfg.setup ? setupStage() : solveStage(original); }; line ? withX(LX[0], go0) : go0(); }
    });

    /* keypad + "I read this as" preview for any input */
    function keypad(inp, opts) {
      var k = el('div', 'sw-keys'); k.setAttribute('aria-label', 'Math keys');
      // On a Chromebook, show only the keys students can't type. On a touch screen, show the basic keys too.
      var touch = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);
      var ineq = (original && original.rel !== '=') || (cfg.setup && cfg.setup.ineq);
      var keys = touch ? [[v, v], ['(', '('], [')', ')'], ['−', '-'], ['/', '/']] : [];
      if (touch && opts && opts.letters) keys = opts.letters.map(function (L) { return [L, L]; }).concat(keys.slice(1));
      if (touch && line) keys = [['x', 'x'], ['y', 'y']].concat(keys.slice(1));
      if (opts && opts.amountOnly) keys = touch ? (line ? [['x', 'x'], ['y', 'y']] : [[v, v]]).concat([['−', '-'], ['/', '/']]) : [];
      else { if (touch) keys.push(['=', '=']); if (ineq) keys = keys.concat([['<', '<'], ['>', '>'], ['≤', '≤'], ['≥', '≥']]); }
      if (opts && opts.exp) keys.push(['xⁿ', '^']);
      if (cfg.positive || cfg.roots) { keys.push(['²', '^2'], ['√', '√']); if (cfg.pi) keys.push(['³', '^3']); if (!cfg.positive) keys.push(['±', '±']); }
      if (cfg.pi) keys.push(['π', 'π']);
      if (!keys.length) { k.hidden = true; return k; }
      if (touch) keys.push(['⌫', 'BS']);
      keys.forEach(function (kk) {
        var b = btn(kk[0]); b.setAttribute('aria-label', kk[1] === 'BS' ? 'Erase' : 'Type ' + kk[0]);
        b.addEventListener('mousedown', function (e) { e.preventDefault(); });
        b.addEventListener('click', function () {
          var s = inp.selectionStart == null ? inp.value.length : inp.selectionStart, t = inp.selectionEnd == null ? s : inp.selectionEnd;
          if (kk[1] === 'BS') { if (s === t && s > 0) s--; inp.value = inp.value.slice(0, s) + inp.value.slice(t); inp.setSelectionRange(s, s); }
          else { inp.value = inp.value.slice(0, s) + kk[1] + inp.value.slice(t); inp.setSelectionRange(s + kk[1].length, s + kk[1].length); }
          inp.focus(); inp.dispatchEvent(new Event('input', { bubbles: true }));
        });
        k.appendChild(b);
      });
      return k;
    }
    function preview(inp, out) {
      inp.addEventListener('input', function () {
        if (!inp.value.trim()) { out.innerHTML = ''; return; }
        try { var e = parseEq(inp.value), vv = cfg.setup && cfg.setup.any && !inp.readOnly && e.vars.length === 1 ? e.vars[0] : v; sides(e, vv); out.innerHTML = 'I read this as: <span class="sw-ln">' + eqHtml(e) + '</span>'; }
        catch (x) { out.innerHTML = '<span style="color:#9A3412">' + readErr(x, cfg.setup && cfg.setup.any ? 'the same letter' : v) + '</span>'; }
      });
    }

    /* ---------- stage 1 (word and angle problems): write the equation ---------- */
    function setupStage() {
      var S = cfg.setup;
      box.innerHTML = '';
      box.appendChild(el('p', 'sw-h', 'Step 1 · Write an equation' + (S.ineq ? ' or inequality' : '')));
      box.appendChild(el('p', 'sw-note', S.prompt || (S.any ? 'Use a letter for the unknown (like <i>c</i>). Write an equation that matches the problem' + (S.figure ? ' and the picture' : '') + '.' : 'Use <i>' + v + '</i> for the unknown. Write an equation that matches the problem' + (S.figure ? ' and the picture' : '') + '.')));
      var w = el('div', 'sw-write'), inp = el('input', 'line'); inp.type = 'text'; inp.autocomplete = 'off'; inp.spellcheck = false; inp.setAttribute('aria-label', 'Your equation');
      w.appendChild(inp); w.appendChild(keypad(inp, S.any ? { letters: ['a', 'b', 'c', 'd'] } : null)); var pv = el('div', 'sw-prev'); w.appendChild(pv); preview(inp, pv);
      var acts = el('div', 'sw-acts'), go = btn('Check my equation', 'go'); acts.appendChild(go); w.appendChild(acts);
      var fb = el('div', 'sw-fb'); fb.setAttribute('role', 'status'); fb.setAttribute('aria-live', 'polite'); w.appendChild(fb);
      box.appendChild(w);
      var tries = 0;
      function check() {
        if (S.line) return checkLine0();
        var e; try { e = parseEq(inp.value); } catch (x) { fb.className = 'sw-fb no'; fb.innerHTML = readErr(x, v); return; }
        if (S.any && e.vars.length === 1) v = e.vars[0];
        try { sides(e, v); } catch (x) { fb.className = 'sw-fb no'; fb.innerHTML = readErr(x, v); return; }
        if (e.vars.length !== 1 || e.vars[0] !== v) { fb.className = 'sw-fb no'; fb.innerHTML = S.any ? 'Your equation needs one letter for the unknown.' : 'Your equation needs the unknown <i>' + v + '</i> in it.'; return; }
        var sol = solve(e, v), want = S.answer.n != null ? S.answer.n / S.answer.d : Number(S.answer), tol = S.tol || 1e-9;
        var val = sol.kind === 'one' || sol.kind === 'ineq' ? qnum(sol.x) : sol.kind === 'sq' && qnum(sol.k) > 0 ? Math.sqrt(qnum(sol.k)) : sol.kind === 'cube' ? Math.cbrt(qnum(sol.k)) : null;
        var ok = val != null && Math.abs(val - want) <= tol && (sol.kind !== 'ineq' || !!S.ineq);
        var only = aloneSide(e, v); if (sol.kind === 'one' && !ok && only && (only.t === 'num' || (only.t === 'neg' && only.a.t === 'num'))) { fb.className = 'sw-fb no'; fb.innerHTML = 'Write the equation first, before you solve it. Start from the facts in the problem.'; tries++; return; }
        if (ok) { fb.className = 'sw-fb ok'; fb.innerHTML = '✓ Good equation. Now solve it.'; inp.readOnly = true; go.disabled = true; setTimeout(function () { solveStage(e, true); }, 300); return; }
        tries++;
        fb.className = 'sw-fb no';
        fb.innerHTML = (sol.kind === 'all' ? 'That is true for every number, so it can\'t find one answer. ' : sol.kind === 'none' ? 'That equation has no solution. ' : 'That equation does not match the problem yet. ') +
          (tries >= 1 && S.hint ? '<br>💡 ' + S.hint : '');
      }
      function checkLine0() {
        var e; try { e = parseEq(inp.value); } catch (x) { fb.className = 'sw-fb no'; fb.innerHTML = readErr(x, v); return; }
        if (e.vars.some(function (z) { return z !== 'x' && z !== 'y'; }) || e.vars.indexOf('y') < 0) { fb.className = 'sw-fb no'; fb.innerHTML = 'Use <i>x</i> and <i>y</i> in your equation.'; return; }
        try { sides(e, 'y'); } catch (x) { fb.className = 'sw-fb no'; fb.innerHTML = readErr(x, 'y'); return; }
        var target = parseEq('y = (' + qtxt(toQ(S.line[0])) + ')*x + (' + qtxt(toQ(S.line[1])) + ')'), same = false;
        try { same = lineSame(e, target); } catch (x) { }
        if (!same) { tries++; fb.className = 'sw-fb no'; fb.innerHTML = 'That equation is not this line yet. Check the slope and the point.' + (S.hint ? '<br>💡 ' + S.hint : ''); return; }
        var ld = lineDone(e);
        if (S.ps && ld && ld.simple) { fb.className = 'sw-fb tip'; fb.innerHTML = 'That is the right line, already in slope-intercept form. The problem asks for <b>point-slope form</b> first: <i>y</i> − <i>y</i><sub>1</sub> = <i>m</i>(<i>x</i> − <i>x</i><sub>1</sub>).'; return; }
        fb.className = 'sw-fb ok'; fb.innerHTML = '✓ Good equation. Now solve it for <i>y</i>.'; inp.readOnly = true; go.disabled = true;
        setTimeout(function () { withX(LX[0], function () { solveStage(e, true); }); }, 300);
      }
      go.addEventListener('click', check);
      inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); check(); } });
    }

    /* ---------- stage 2: solve, one line at a time ---------- */
    function solveStage(start, keepSetup) {
      if (!keepSetup) box.innerHTML = '';
      original = start;
      var lines = [{ e: start, mv: null }], move = null, amount = null;
      box.appendChild(el('p', 'sw-h', (cfg.setup ? 'Step 2 · ' : '') + 'Solve it one step at a time'));
      var trail = el('ol', 'sw-trail'); box.appendChild(trail);
      var legend = el('p', 'sw-legend'); legend.dataset.all = ('<span class="t-v" style="color:#1D4ED8;background:#E6EDFD;border-radius:4px;padding:0 3px">' + v + '-terms</span> &nbsp; ' + (line ? '<span style="color:#166534;background:#E3F4E8;border-radius:4px;padding:0 3px">x-terms</span> &nbsp; ' : '') + '<span style="color:#7E22A8;background:#F4E8FA;border-radius:4px;padding:0 3px">numbers</span> &nbsp; <span style="color:#7A5300;background:#FFE58A;border-radius:4px;padding:0 3px">parentheses</span> ');
      box.appendChild(legend);
      var work = el('div'); box.appendChild(work);
      drawTrail(); step();

      function cur() { return lines[lines.length - 1].e; }
      function drawTrail() {   // every line lines up on the sign; a move sits under the like terms it changes
        trail.innerHTML = '';
        var g = '';
        lines.forEach(function (l, i) {
          var nx = lines[i + 1], op = null;
          if (nx && nx.d) { try { op = trailOp(l.e, nx.e, nx.d, v, line); } catch (x) { op = null; } }
          var row;
          try { row = alignedEq(l.e, v, line, op, i === lines.length - 1); } catch (x) { row = '<span class="sw-L"></span><span class="sw-R0"></span><span class="sw-Rt">' + eqHtml(l.e) + '</span>'; }
          var mv = nx && nx.mv ? '↓ ' + nx.mv : '';   // the label sits next to the move it names
          g += '<span class="sw-n">' + (i + 1) + '</span>' + row + '<span class="sw-mv"' + (mv ? '' : ' style="visibility:hidden"') + '>' + mv + '</span>';
          if (i < lines.length - 1) g += '<span class="sw-row-end"></span>';
        });
        var li = el('li'); li.className = 'sw-tgw'; li.innerHTML = '<div class="sw-tg">' + g + '</div>'; trail.appendChild(li);
      }
      function drawLegend(e) {   // a small color key with only the kinds of terms on this line
        var has = {}; [e.L, e.R].forEach(function (sd) { terms(sd).forEach(function (t) { has[kindOf(t, v)] = 1; }); });
        var chip = function (cls, c, bg, t) { return '<span style="color:' + c + ';background:' + bg + ';border-radius:4px;padding:0 4px">' + t + '</span>'; }, out = [];
        if (has.xterm) out.push(chip('t-v', '#1D4ED8', '#E6EDFD', v + '-terms'));
        if (has.pterm) out.push(chip('t-x', '#166534', '#E3F4E8', 'x-terms'));
        if (has.num) out.push(chip('t-k', '#7E22A8', '#F4E8FA', 'numbers'));
        if (has.paren) out.push(chip('t-p', '#7A5300', '#FFE58A', 'parentheses'));
        legend.innerHTML = out.length > 1 ? 'Colors: ' + out.join(' &nbsp;') : '';
      }
      function colorLine(e) { return sideHtml(e.L, v, { colors: true }) + ' <span class="sw-rel">' + relHtml(e.rel) + '</span> ' + sideHtml(e.R, v, { colors: true }); }

      function step() {
        work.innerHTML = ''; var tried = 0;
        var e = cur(), done = line ? null : isSolved(e, v);
        drawLegend(e);
        if (line) { var ld0 = lineDone(e); if (ld0 && ld0.simple) return lineFinish(e, ld0); }
        if (done || noVar(e)) return finish(e, done);
        work.appendChild(el('p', 'sw-ask', 'What will you do next?'));
        var mv = el('div', 'sw-moves'); mv.setAttribute('role', 'group'); mv.setAttribute('aria-label', 'Choose a move');
        var MOVES = [['dist', 'Distribute'], ['comb', 'Combine like terms'], ['add', 'Add to both sides'], ['sub', 'Subtract from both sides'], ['mul', 'Multiply both sides'], ['div', 'Divide both sides']];
        var hasSq = false, hasPow = false, hasCube = false;
        try { var sp0 = sides(e, v); hasSq = !!(sp0.L[2].n || sp0.R[2].n); hasCube = !!(sp0.L[3].n || sp0.R[3].n); } catch (x) { }
        [e.L, e.R].forEach(function (sd) { walk(sd, function (z) { if (z.t === 'pow' && !hasVar(z.a)) hasPow = true; }); });
        if (hasPow) MOVES.unshift(['squares', 'Find the squares']);
        if (hasSq) MOVES.push(['sqrt', 'Square root both sides']);
        if (hasCube) MOVES.push(['cbrt', 'Cube root both sides']);
        var mbtns = {};
        MOVES.forEach(function (m) { var b = btn(m[1]); b.setAttribute('aria-pressed', 'false'); b.addEventListener('click', function () { pick(m[0]); }); mv.appendChild(b); mbtns[m[0]] = b; });
        work.appendChild(mv);
        var amtRow = el('div', 'sw-amt'); amtRow.hidden = true; work.appendChild(amtRow);
        var vis = el('div', 'sw-vis'); vis.hidden = true; vis.setAttribute('aria-live', 'polite'); work.appendChild(vis);
        var write = el('div', 'sw-write'); write.hidden = true; work.appendChild(write);
        var fb = el('div', 'sw-fb'); fb.setAttribute('role', 'status'); fb.setAttribute('aria-live', 'polite'); work.appendChild(fb);
        var undoRow = el('div', 'sw-acts'); work.appendChild(undoRow);
        if (lines.length > 1) { var u = btn('Undo my last line', 'ghost'); u.addEventListener('click', function () { lines.pop(); drawTrail(); step(); }); undoRow.appendChild(u); }

        function pick(m) {
          move = m; amount = null; fb.className = 'sw-fb'; fb.innerHTML = '';
          Object.keys(mbtns).forEach(function (k) { mbtns[k].setAttribute('aria-pressed', String(k === m)); });
          amtRow.hidden = true; amtRow.innerHTML = ''; vis.hidden = true; write.hidden = true;
          if (m === 'dist') {
            var found = [];
            [e.L, e.R].forEach(function (side, si) { terms(side).forEach(function (t) { var p = parenProduct(t.n, t.s); if (p) found.push([si, p]); }); });
            if (!found.length) { fb.className = 'sw-fb tip'; fb.innerHTML = 'There are no parentheses to distribute in this line. Pick another move.'; return; }
            vis.hidden = false;
            vis.innerHTML = '<div class="sw-ln">' + colorLine(e) + '</div>' + found.map(function (f) {
              return '<p class="sw-note">Multiply <b>' + f[1].c + '</b> by <b>every</b> term inside the parentheses: ' + f[1].pairs.join(', ') + '.</p>';
            }).join('');
            showWrite();
          } else if (m === 'squares') {
            var pows = []; [e.L, e.R].forEach(function (sd) { walk(sd, function (z) { if (z.t === 'pow' && !hasVar(z.a) && z.e > 1) pows.push(z); }); });
            vis.hidden = false;
            vis.innerHTML = '<div class="sw-ln">' + colorLine(e) + '</div>' + pows.map(function (z) { var f = []; for (var j = 0; j < z.e; j++) f.push(html(z.a)); return '<p class="sw-note">' + html(z) + ' means ' + f.join(' · ') + '. (Not ' + html(z.a) + ' · ' + z.e + '!)</p>'; }).join('');
            showWrite();
          } else if (m === 'sqrt') {
            var spr = sides(e, v), bare = function (n) { return n.t === 'pow' && n.e === 2 && n.a.t === 'var'; };
            var vsd = bare(e.L) ? 'L' : bare(e.R) ? 'R' : null, other = vsd === 'L' ? spr.R : vsd === 'R' ? spr.L : null;
            if (!vsd || pdeg(other) > 0) { fb.className = 'sw-fb tip'; fb.innerHTML = 'First get <i>' + v + '</i><sup>2</sup> <b>alone</b> on one side, with no other terms next to it. Then take the square root.'; return; }
            var k = other[0], kn = qnum(k), rt = Math.round(Math.sqrt(kn)), perfect = k.d === 1 && rt * rt === k.n;
            var notes = ['The square root <b>undoes</b> the square: √(<i>' + v + '</i><sup>2</sup>) = <i>' + v + '</i>.'];
            if (kn < 0) notes.push('No number times itself makes a negative, so this has no solution.');
            else if (perfect) notes.push('√' + qHtml(k) + ' = ' + rt + ', because ' + rt + ' · ' + rt + ' = ' + qHtml(k) + '.');
            else notes.push(qHtml(k) + ' is not a perfect square. Write √' + qtxt(k) + ', or use a calculator and round (use ≈).');
            notes.push(cfg.positive ? 'A length is positive, so use the <b>positive</b> square root.' : 'A positive and a negative number both work. Write ± in front of the root.');
            vis.hidden = false;
            vis.innerHTML = '<div class="sw-grid"><div class="sw-lft">√( ' + sideHtml(e.L, v, { colors: true }) + ' )</div><div class="sw-r">' + relHtml(e.rel) + '</div><div>√( ' + sideHtml(e.R, v, { colors: true }) + ' )</div></div>' +
              notes.map(function (t) { return '<p class="sw-note">' + t + '</p>'; }).join('');
            showWrite();
          } else if (m === 'cbrt') {
            var spc = sides(e, v), bare3 = function (n) { return n.t === 'pow' && n.e === 3 && n.a.t === 'var'; };
            var vsc = bare3(e.L) ? 'L' : bare3(e.R) ? 'R' : null, oth = vsc === 'L' ? spc.R : vsc === 'R' ? spc.L : null;
            if (!vsc || pdeg(oth) > 0) { fb.className = 'sw-fb tip'; fb.innerHTML = 'First get <i>' + v + '</i><sup>3</sup> <b>alone</b> on one side, with no other terms next to it. Then take the cube root.'; return; }
            var kc = oth[0], kcn = qnum(kc), rc = Math.round(Math.cbrt(kcn)), perf = kc.d === 1 && rc * rc * rc === kc.n;
            var nts = ['The cube root <b>undoes</b> the cube: ∛(<i>' + v + '</i><sup>3</sup>) = <i>' + v + '</i>.'];
            if (perf) nts.push('∛' + qHtml(kc) + ' = ' + rc + ', because ' + rc + ' · ' + rc + ' · ' + rc + ' = ' + qHtml(kc) + '.');
            else nts.push(qHtml(kc) + ' is not a perfect cube. Use a calculator and round (use ≈).');
            vis.hidden = false;
            vis.innerHTML = '<div class="sw-grid"><div class="sw-lft">∛( ' + sideHtml(e.L, v, { colors: true }) + ' )</div><div class="sw-r">' + relHtml(e.rel) + '</div><div>∛( ' + sideHtml(e.R, v, { colors: true }) + ' )</div></div>' +
              nts.map(function (t) { return '<p class="sw-note">' + t + '</p>'; }).join('');
            showWrite();
          } else if (m === 'comb') {
            var info = [e.L, e.R].map(function (side) { var ts = terms(side), xs = 0, ns = 0, ps = 0, px = 0; ts.forEach(function (t) { var k = kindOf(t, v); if (k === 'xterm') xs++; else if (k === 'num') ns++; else if (k === 'pterm') px++; else ps++; }); return { xs: xs, ns: ns, ps: ps, px: px }; });
            var can = info.some(function (s) { return s.xs > 1 || s.ns > 1 || s.px > 1; });
            if (!can) { fb.className = 'sw-fb tip'; fb.innerHTML = info.some(function (s) { return s.ps; }) ? 'Like terms can\'t combine through parentheses. Distribute first.' : 'Nothing on the <b>same side</b> can combine. Terms on different sides of the = sign don\'t combine.'; return; }
            vis.hidden = false;
            vis.innerHTML = '<div class="sw-ln">' + colorLine(e) + '</div><p class="sw-note">Like terms have the same color. Combine the <span class="t-v">' + v + '-terms</span> with each other' + (line ? ', the <span class="t-x">x-terms</span> with each other,' : '') + ' and the <span class="t-k">numbers</span> with each other' + (line ? ' (an x-term and a number are <b>not</b> alike)' : '') + ', <b>on each side separately</b>.</p>';
            showWrite();
          } else {
            amtRow.hidden = false;
            var verb = { add: 'Add', sub: 'Subtract', mul: 'Multiply both sides by', div: 'Divide both sides by' }[m];
            amtRow.appendChild(el('span', '', '<b>' + verb + '</b>' + (m === 'add' ? ' this to both sides:' : m === 'sub' ? ' this from both sides:' : ':')));
            var a = el('input', 'amt'); a.type = 'text'; a.autocomplete = 'off'; a.spellcheck = false; a.setAttribute('aria-label', 'Amount'); a.placeholder = m === 'mul' ? 'e.g. 4/3' : m === 'div' ? 'e.g. 3' : 'e.g. 7 or 2' + v;
            amtRow.appendChild(a); var show = btn('Show it', 'go'); amtRow.appendChild(show);
            amtRow.appendChild(keypad(a, { amountOnly: true }));
            var run = function () { showMove(m, a.value); };
            show.addEventListener('click', run); a.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); run(); } });
            a.focus();
          }
        }
        function showMove(m, raw) {
          fb.className = 'sw-fb'; fb.innerHTML = '';
          var k;
          try { var n = parseExpr(lex(clean(raw))); k = poly(n, v); } catch (x) { fb.className = 'sw-fb no'; fb.innerHTML = raw.trim() ? readErr(x, v) : 'Type the amount first.'; return; }
          if (line && (m === 'mul' || m === 'div') && hasVar(n)) { fb.className = 'sw-fb no'; fb.innerHTML = 'Multiply or divide by a number, not by a letter.'; return; }
          var kl = line ? linOf(n) : null, lh = function (tp, t) { return line ? (t.s < 0 ? linHtml(linNeg(linOf(t.n))) : linHtml(linOf(t.n))) : polyHtml(tp, v); };
          if ((m === 'mul' || m === 'div') && pdeg(k) > 0) { fb.className = 'sw-fb no'; fb.innerHTML = 'Multiply or divide by a number, not by ' + v + '.'; return; }
          if ((m === 'mul' || m === 'div') && !k[0].n) { fb.className = 'sw-fb no'; fb.innerHTML = m === 'div' ? 'You can\'t divide by 0.' : 'Multiplying by 0 makes both sides 0, and you lose the equation.'; return; }
          if (pzero(k)) { fb.className = 'sw-fb no'; fb.innerHTML = 'Adding or subtracting 0 doesn\'t change anything. Pick an amount.'; return; }
          amount = { m: m, k: k, raw: raw };
          var opH = (m === 'add' ? '+ ' : m === 'sub' ? '− ' : m === 'mul' ? '× ' : '÷ ') + polyHtml(m === 'sub' || m === 'add' ? k : k, v).replace(/^−/, m === 'add' || m === 'sub' ? '' : '−');
          if ((m === 'add' || m === 'sub') && qsign(k[pdeg(k)]) < 0) opH = (m === 'add' ? '+ (' : '− (') + polyHtml(k, v) + ')';
          if (line && (m === 'add' || m === 'sub')) opH = (m === 'add' ? '+ ' : '− ') + (qsign(linLead(kl)) < 0 ? '(' + linHtml(kl) + ')' : linHtml(kl));
          var change = m === 'add' ? k : m === 'sub' ? pscale(k, qneg(ONE)) : null;
          var strikeL = [], strikeR = [], notes = [];
          if (change) {
            [[e.L, strikeL, 'left'], [e.R, strikeR, 'right']].forEach(function (z) {
              terms(z[0]).forEach(function (t, i) {
                try { var tp = poly(t.n, v); if (t.s < 0) tp = pscale(tp, qneg(ONE)); if (peq(padd(tp, change), P())) { z[1].push(i); notes.push('On the ' + z[2] + ' side, ' + lh(tp, t) + ' and ' + (line ? linHtml(m === 'sub' ? linNeg(kl) : kl) : polyHtml(change, v)) + ' make <b>0</b>. They cancel.'); } } catch (x) { }
              });
            });
            if (!notes.length) notes.push('Nothing cancels with this amount. Look for a term you want to get rid of, and use its <b>opposite</b>.');
          } else {
            var f = m === 'mul' ? k[0] : qdiv(ONE, k[0]);
            [[e.L, 'left'], [e.R, 'right']].forEach(function (z) {
              var ts = terms(z[0]);
              if (ts.length > 1) notes.push('The ' + z[1] + ' side has ' + ts.length + ' terms. ' + (m === 'mul' ? 'Multiply' : 'Divide') + ' <b>every</b> term.');
              ts.forEach(function (t) {
                try {
                  var tp = poly(t.n, v); if (t.s < 0) tp = pscale(tp, qneg(ONE));
                  if (pdeg(tp) === 1 && !tp[0].n && qeq(qmul(tp[1], f), ONE)) {
                    var c = tp[1];
                    notes.push((m === 'mul' || c.d !== 1) && !(m === 'div' && qeq(c, k[0]))
                      ? (m === 'mul' ? qHtml(k[0]) : '1 over ' + qHtml(k[0])) + ' is the <b>reciprocal</b> of ' + qHtml(c) + '. &nbsp;' + qHtml(c) + ' · ' + qHtml(f) + ' = <b>1</b>, so ' + qHtml(c) + '<i>' + v + '</i> becomes 1<i>' + v + '</i> = <i>' + v + '</i>.'
                      : qHtml(c) + '<i>' + v + '</i> ÷ ' + qHtml(k[0]) + ' = 1<i>' + v + '</i>, because ' + qHtml(c) + ' ÷ ' + qHtml(k[0]) + ' = <b>1</b>. The ' + qHtml(c) + ' cancels.');
                  }
                } catch (x) { }
              });
            });
            if (e.rel !== '=' && qsign(f) < 0) notes.push('You are ' + (m === 'mul' ? 'multiplying' : 'dividing') + ' by a <b>negative</b> number. Think about what that does to the inequality sign.');
          }
          vis.hidden = false;
          var aop;
          if (change) aop = { kind: 'add', parts: opParts(line ? (function (l) { var o = {}; if (l.y.n) o.xterm = l.y; if (l.x.n) o.pterm = l.x; if (l.c.n) o.num = l.c; return o; })(kl) : (function () { var o = {}; if (k[3].n) o.sq3 = k[3]; if (k[2].n) o.sq2 = k[2]; if (k[1].n) o.xterm = k[1]; if (k[0].n) o.num = k[0]; return o; })(), m, v) };
          else aop = { kind: 'scale', div: m === 'div', k: k[0] };
          var aligned;
          try { aligned = '<div class="sw-al">' + alignedEq(e, v, line, aop, true) + '</div>'; }
          catch (x) {
            aligned = '<div class="sw-grid"><div class="sw-lft">' + sideHtml(e.L, v, { colors: true, strike: strikeL }) + '</div><div class="sw-r">' + relHtml(e.rel) + '</div><div>' + sideHtml(e.R, v, { colors: true, strike: strikeR }) + '</div>' +
              '<div class="sw-lft sw-op' + (strikeL.length ? ' t-c' : '') + '">' + opH + '</div><div></div><div class="sw-op' + (strikeR.length ? ' t-c' : '') + '">' + opH + '</div></div>';
          }
          vis.innerHTML = aligned +
            notes.map(function (t) { return '<p class="sw-note">' + t + '</p>'; }).join('');
          showWrite();
        }
        function showWrite() {
          write.hidden = false; write.innerHTML = '';
          var lab = el('label', '', 'Write the new line:'), inp = el('input', 'line'); inp.type = 'text'; inp.autocomplete = 'off'; inp.spellcheck = false; inp.setAttribute('aria-label', 'Your new line');
          lab.appendChild(inp); write.appendChild(lab); write.appendChild(keypad(inp));
          var pv = el('div', 'sw-prev'); write.appendChild(pv); preview(inp, pv);
          var acts = el('div', 'sw-acts'), go = btn('Check this line', 'go'); acts.appendChild(go); write.appendChild(acts);
          var check = function () { checkLine(inp.value); };
          go.addEventListener('click', check); inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); check(); } });
          inp.focus();
        }
        function checkLine(raw) {
          var n, exact = true;
          try { n = parseEq(raw); } catch (x) { fb.className = 'sw-fb no'; fb.innerHTML = readErr(x, v); return; }
          if (n.vars.some(function (z) { return z !== v && !(line && z === 'x'); })) { fb.className = 'sw-fb no'; fb.innerHTML = readErr({ code: 'letter' }, v); return; }
          try { sides(n, v); } catch (x) {
            if ((x.code === 'irr' || x.code === 'pm') && aloneSide(n, v)) exact = false;
            else { fb.className = 'sw-fb no'; fb.innerHTML = readErr(x.code === 'irr' || x.code === 'pm' ? { code: 'irrmid' } : x, v); return; }
          }
          var prev = cur(), cmp;
          try { cmp = line ? { ok: lineSame(prev, n) } : compareLines(prev, n, v, cfg); } catch (x) { fb.className = 'sw-fb no'; fb.innerHTML = readErr(x, v); return; }
          if (!cmp.ok) { fb.className = 'sw-fb no'; tried++; fb.innerHTML = 'Not quite. ' + (cmp.msg || (line && lineDiag(prev, n)) || (exact ? diagnose(prev, n, v) : 'That is not equal to the line before. Check your square root.')) + (tried >= 3 ? calm(lines.length) : ''); return; }
          var rooted = false; try { rooted = valsOf(prev, v).kind === 'sq' && !!isSolved(n, v); } catch (x) { }
          var d = exact && !rooted ? describe(prev, n, v) : { type: 'root' }, label = d.type === 'root' ? 'square root of both sides' : line ? lineLabel(prev, n, d, v) : moveLabel(d, v), note = cmp.note || '';
          if (d.type === 'rewrite' && sameText(prev, n)) { fb.className = 'sw-fb tip'; fb.innerHTML = 'That is the same line. Make a change first.'; return; }
          if (exact && amount && (d.type === 'add' || d.type === 'scale')) {
            var meant = amount.m === 'add' ? amount.k : amount.m === 'sub' ? pscale(amount.k, qneg(ONE)) : null;
            if ((meant && (d.type !== 'add' || !peq(d.k, meant))) || (!meant && (d.type !== 'scale' || !qeq(d.c, amount.m === 'mul' ? amount.k[0] : qdiv(ONE, amount.k[0])))))
              note = ' (That is true, but it is not the move you picked. That\'s OK.)';
          }
          var before = exact ? countTerms(prev) : 0, after = exact ? countTerms(n) : 0;
          if (d.type === 'add' && after > before) note += '<br>💡 That move is allowed, but now there are <b>more</b> terms. Did it get <i>' + v + '</i> closer to being alone? You can undo it.';
          lines.push({ e: n, mv: label, d: exact && !rooted ? d : null });
          drawTrail();
          step();
          var nfb = work.querySelector('.sw-fb');
          if (line) { var ld1 = lineDone(n); if (ld1 && !ld1.simple) note += '<br><i>y</i> is alone. Now simplify the other side so it looks like <i>y</i> = <i>mx</i> + <i>b</i>.'; }
          if (nfb && (line || !isSolved(n, v)) && !noVar(n)) { nfb.className = 'sw-fb ok'; nfb.innerHTML = praise() + note; }
        }
      }
      function finish(e, done) {
        work.innerHTML = '';
        var box2 = el('div', 'sw-done'); box2.setAttribute('role', 'status');
        var o = original, info;
        if (noVar(e)) {
          var truth = solve(e, v).kind === 'all';
          box2.innerHTML = '<b>' + (truth ? 'Infinitely many solutions.' : 'No solution.') + '</b> The ' + v + '\'s cancelled and you got <span class="sw-ln">' + eqHtml(e) + '</span>, which is ' +
            (truth ? '<b>always true</b>. Every number works.' : '<b>never true</b>. No number works.');
          info = { kind: truth ? 'all' : 'none' };
        } else if (done.vals || done.approx || (done.side && done.side.t === 'pm')) {
          var list = done.vals || [qnum(done.x)];
          if (cfg.positive) list = list.filter(function (z) { return z > 0; });
          var val = list[list.length - 1], irr = !done.approx && done.vals && Math.abs(val - Math.round(val * 1e6) / 1e6) > 0 && !Number.isInteger(Math.round(val * 1e9) / 1e9);
          var shownSide = done.side && done.side.t === 'pm' && cfg.positive ? done.side.a : done.side;
          var shown = shownSide ? html(shownSide) : qHtml(done.x), r2 = function (z) { return Math.round(z * 100) / 100; };
          var lv = numv(o.L, v, val), rv = numv(o.R, v, val), pm = done.side && done.side.t === 'pm' && !cfg.positive;
          box2.innerHTML = '<b>Solved:</b> <span class="sw-ln"><i>' + v + '</i> ' + (done.approx ? '≈' : '=') + ' ' + shown + '</span>' + (irr ? ' ≈ ' + r2(val) : '') +
            '<br>Check it in the first line with ' + v + ' ≈ ' + r2(val) + ': ' + r2(lv) + ' ≈ ' + r2(rv) + ' ✓' + (done.approx ? '<br>(Rounded answers check as "about equal".)' : '');
          info = pm ? { kind: 'pm', text: plainNum(done.side) } : { kind: 'one', num: val, numText: done.approx ? done.text : String(r2(val)), approx: done.approx || irr };
        } else {
          var x = done.x, rel = done.rel;
          if (rel === '=') {
            var l = pat(poly(o.L, v), x), r = pat(poly(o.R, v), x);
            box2.innerHTML = '<b>Solved:</b> <span class="sw-ln"><i>' + v + '</i> = ' + qHtml(x) + '</span><br>Check it in the first line: <span class="sw-ln">' + eqHtml(o, qHtml(x)) + '</span> → ' + qHtml(l) + ' = ' + qHtml(r) + ' ✓';
          } else {
            var test = qadd(x, Q({ '>': 1, '≥': 1, '<': -1, '≤': -1 }[rel]));
            var l2 = pat(poly(o.L, v), test), r2 = pat(poly(o.R, v), test);
            box2.innerHTML = '<b>Solved:</b> <span class="sw-ln"><i>' + v + '</i> ' + relHtml(rel) + ' ' + qHtml(x) + '</span><br>Test one number that should work, ' + v + ' = ' + qHtml(test) + ': ' + qHtml(l2) + ' ' + relHtml(o.rel) + ' ' + qHtml(r2) + ' ✓' +
              '<br>On a number line: ' + (rel === '<' || rel === '>' ? '<b>open</b> circle' : '<b>closed</b> circle') + ' at ' + qHtml(x) + ', shade to the ' + (rel === '<' || rel === '≤' ? 'left' : 'right') + '.';
          }
          info = { kind: rel === '=' ? 'one' : 'ineq', x: x, rel: rel };
        }
        work.appendChild(box2);
        if (lines.length > 1) { var u = btn('Undo my last line', 'ghost'); u.addEventListener('click', function () { lines.pop(); drawTrail(); step(); }); var ur = el('div', 'sw-acts'); ur.appendChild(u); work.appendChild(ur); }
        if (cfg.then && info.kind === 'one' && info.x) thenStage(info.x);
        else useBtn(info);
      }
      function lineFinish(e, ld) {
        work.innerHTML = '';
        var box2 = el('div', 'sw-done'); box2.setAttribute('role', 'status');
        var shown = linHtml({ y: ZERO, x: ld.m, c: ld.b }), y1 = withX(ONE, function () { return solve(original, 'y').x; });
        box2.innerHTML = '<b>Solved for <i>y</i>:</b> <span class="sw-ln"><i>y</i> = ' + shown + '</span>' +
          (ld.xFirst ? '' : '<br>In <i>y</i> = <i>mx</i> + <i>b</i> form, the <i>x</i>-term comes first.') +
          '<br>Slope <i>m</i> = ' + qHtml(ld.m) + ', <i>y</i>-intercept <i>b</i> = ' + qHtml(ld.b) + '.' +
          '<br>Check with <i>x</i> = 1: the first line gives <i>y</i> = ' + qHtml(y1) + ', and ' + qHtml(ld.m) + ' · 1 + ' + (ld.b.n < 0 ? '(' + qHtml(ld.b) + ')' : qHtml(ld.b)) + ' = ' + qHtml(qadd(ld.m, ld.b)) + ' ✓';
        work.appendChild(box2);
        if (lines.length > 1) { var u = btn('Undo my last line', 'ghost'); u.addEventListener('click', function () { lines.pop(); drawTrail(); step(); }); var ur = el('div', 'sw-acts'); ur.appendChild(u); work.appendChild(ur); }
        useBtn({ kind: 'line', text: lineTxt(ld.m, ld.b), m: ld.m, b: ld.b });
      }
      function useBtn(info) {
        if (!cfg.onAnswer) { work.appendChild(el('p', 'sw-note', 'Now type your answer in the answer box.')); return; }
        var r = el('div', 'sw-acts'), b = btn('Put this answer in the answer box', 'go');
        b.addEventListener('click', function () { cfg.onAnswer(answerText(info, v), info); b.textContent = '✓ Answer filled in'; b.disabled = true; });
        r.appendChild(b); work.appendChild(r); keep(r);
      }
      function thenStage(x) {
        var t = el('div', 'sw-then');
        t.appendChild(el('p', 'sw-h', (cfg.setup ? 'Step 3 · ' : 'Next · ') + 'Use <i>' + v + '</i> = ' + qtxt(x) + ' to finish'));
        var left = cfg.then.length, vals = [];
        cfg.then.forEach(function (it, i) {
          var lab = el('div', 'sw-row', '<span>' + it.label + ' =</span>'), inp = el('input', 'amt'); inp.type = 'text'; inp.autocomplete = 'off'; inp.setAttribute('aria-label', it.label);
          var go = btn('Check'), fb = el('span', 'sw-fb'); fb.setAttribute('aria-live', 'polite');
          lab.appendChild(inp); lab.appendChild(document.createTextNode(it.unit || '')); lab.appendChild(go); lab.appendChild(fb); t.appendChild(lab);
          var ex = clean(it.expr).replace(/[a-z]/g, v), want = pat(poly(parseExpr(lex(ex)), v), x);
          var chk = function () {
            var got; try { got = pat(poly(parseExpr(lex(clean(inp.value.replace(/°/g, '')))), v), x); } catch (e) { fb.className = 'sw-fb no'; fb.textContent = 'Type a number.'; return; }
            if (qeq(got, want)) { fb.className = 'sw-fb ok'; fb.innerHTML = '✓'; inp.readOnly = true; go.disabled = true; vals[i] = qtxt(want) + (it.unit || ''); if (--left === 0) after(); }
            else { fb.className = 'sw-fb no'; fb.innerHTML = 'Put ' + v + ' = ' + qtxt(x) + ' into ' + html(parseExpr(lex(ex))) + ' and simplify.'; }
          };
          go.addEventListener('click', chk); inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); chk(); } });
        });
        work.appendChild(t);
        function after() {
          if (!cfg.onAnswer) return;
          var r = el('div', 'sw-acts'), b = btn('Put this answer in the answer box', 'go');
          b.addEventListener('click', function () { cfg.onAnswer(v + ' = ' + qtxt(x) + '; ' + cfg.then.map(function (it, i) { return it.label + ' = ' + vals[i]; }).join(', '), { kind: 'one', x: x }); b.textContent = '✓ Answer filled in'; b.disabled = true; });
          r.appendChild(b); work.appendChild(r);
        }
      }
    }
    return box;
  }
  function parenProduct(n, s) {   // c(…) → {c, pairs}
    var c = null, inner = null;
    if (n.t === 'mul' && isNumLike(n.a) && sumInside(n.b)) { c = qHtml(polyOf(n.a)[0]); inner = sumInside(n.b); if (s < 0) c = '−' + c; }
    else if (n.t === 'par' && sumInside(n) && s < 0) { c = '−1'; inner = sumInside(n); }
    if (!inner) return null;
    return { c: c, pairs: inner.terms.map(function (t) { return c + ' · ' + (t.s < 0 ? '(−' + html(t.n) + ')' : html(t.n)); }) };
  }
  function polyOf(n) { try { return poly(n, 'x'); } catch (e) { return P(); } }
  function countTerms(e) { return terms(e.L).length + terms(e.R).length; }
  function sameText(a, b) { return eqHtml(a) === eqHtml(b); }
  function moveLabel(d, v) {
    if (d.type === 'add') { var neg = qsign(d.k[1].n ? d.k[1] : d.k[0]) < 0; return (neg ? 'subtracted ' + polyHtml(pscale(d.k, qneg(ONE)), v) : 'added ' + polyHtml(d.k, v)) + ' on both sides'; }
    if (d.type === 'scale') { var c = d.c; return (c.n === 1 && c.d !== 1 ? 'divided both sides by ' + c.d : (c.d === 1 || Math.abs(c.n) !== 1 ? 'multiplied both sides by ' + qHtml(c) : 'divided both sides by −' + c.d)) + (d.flip ? ', flipped the sign' : ''); }
    if (d.type === 'rewrite') return 'simplified';
    if (d.type === 'swap') return 'switched sides';
    return 'more than one step';
  }
  function answerText(info, v) {
    if (info.kind === 'line') return info.text;
    if (info.kind === 'pm') return v + ' = ' + info.text;
    if (info.numText) return v + (info.approx ? ' ≈ ' : ' = ') + info.numText;
    if (info.kind === 'all') return 'infinitely many solutions';
    if (info.kind === 'none') return 'no solution';
    return info.kind === 'one' ? v + ' = ' + qtxt(info.x).replace(/^-/, '-') : v + ' ' + ({ '≤': '≤', '≥': '≥', '<': '<', '>': '>' }[info.rel]) + ' ' + qtxt(info.x);
  }

  /* ===================== EXPRESSION MODE (Unit 2: exponent rules, scientific notation) =====================
     The student simplifies one term step by step. Each line is checked by exact value and exponents;
     feedback names the rule that was misused. Numeric bases (4³, 10⁵) stay as powers. */
  function bgcd(a, b) { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { var t = a % b; a = b; b = t; } return a || 1n; }
  function B(n, d) { d = d == null ? 1n : d; if (d < 0n) { n = -n; d = -d; } var g = bgcd(n, d); return { n: n / g, d: d / g }; }
  function bmul(a, b) { return B(a.n * b.n, a.d * b.d); }
  function bdiv(a, b) { if (b.n === 0n) throw err('zero'); return B(a.n * b.d, a.d * b.n); }
  function bpow(a, e) { if (e === 0) return B(1n); var r = B(1n), k = Math.abs(e); for (var i = 0; i < k; i++) r = bmul(r, a); return e < 0 ? bdiv(B(1n), r) : r; }
  function beq(a, b) { return a.n === b.n && a.d === b.d; }
  function bdec(s) { var p = s.split('.'), f = (p[1] || '').length; return B(BigInt((p[0] || '0') + (p[1] || '')), 10n ** BigInt(f)); }
  function exClean(s) { return clean(String(s).replace(/<span class="frac"><span class="num">(.*?)<\/span><span class="den">(.*?)<\/span><\/span>/g, '(($1)/($2))')).replace(/^=/, ''); }
  /* parse one term; a "/" at the top level divides everything on the left by everything on the right */
  function parseTerm(text) {
    var s = exClean(text); if (!s) throw err('empty');
    if (/[=<>≤≥]/.test(s)) throw err('erel');
    var depth = 0, cut = -1;
    for (var i = 0; i < s.length; i++) { var ch = s[i]; if (ch === '(') depth++; else if (ch === ')') depth--; else if (ch === '/' && depth === 0) { if (cut >= 0) throw err('twoslash'); cut = i; } }
    if (cut < 0) { var one = parseExpr(lex(s)); while (one.t === 'par' && one.a.t !== 'add') one = one.a; return one; }
    var top = s.slice(0, cut), bot = s.slice(cut + 1); if (!top || !bot) throw err('missing');
    return { t: 'div', a: parseExpr(lex(top)), b: parseExpr(lex(bot)), top: true };
  }
  /* AST → {c: exact number, b: {x: 3, '#10': 5}}; f = mistake to imitate (for feedback) */
  function mono(n, f) {
    switch (n.t) {
      case 'num': return { c: bdec(n.src || qtxt(n.v)), b: {} };
      case 'var': var o = {}; o[n.v] = 1; return { c: B(1n), b: o };
      case 'par': return mono(n.a, f);
      case 'neg': var m0 = mono(n.a, f); return { c: B(-m0.c.n, m0.c.d), b: m0.b };
      case 'add': throw err('sum');
      case 'mul': case 'div': {
        var A = mono(n.a, f), C = mono(n.b, f), out = { c: n.t === 'mul' ? bmul(A.c, C.c) : bdiv(A.c, C.c), b: {} }, k;
        for (k in A.b) out.b[k] = A.b[k];
        for (k in C.b) {
          if (n.t === 'mul') out.b[k] = out.b[k] != null && f === 'mulExp' ? out.b[k] * C.b[k] : (out.b[k] || 0) + C.b[k];
          else out.b[k] = out.b[k] != null && f === 'subRev' ? C.b[k] - out.b[k] : (out.b[k] || 0) - C.b[k];
        }
        if (f === 'baseMul' && n.t === 'mul') { var ks = Object.keys(A.b).filter(function (z) { return z[0] === '#' && C.b[z] != null; }); ks.forEach(function (z) { var nb = '#' + (BigInt(z.slice(1)) ** 2n); var e = out.b[z]; delete out.b[z]; out.b[nb] = e; }); }
        return out;
      }
      case 'sqrt': throw err('erootx');
      case 'pi': throw err('erootx');
      case 'pow': {
        var e = n.e, base = n.a.t === 'par' ? n.a.a : n.a;
        if (e === 0) return { c: B(f === 'zeroIsZero' ? 0n : 1n), b: {} };
        if (base.t === 'num') { var bb = {}; bb['#' + (base.src || qtxt(base.v))] = (f === 'negSign' && e < 0) ? -e : e; return { c: B(f === 'negSign' && e < 0 ? -1n : 1n), b: bb }; }
        var m = mono(n.a, f), r = { c: m.c, b: {} }, isPP = base.t === 'pow';
        for (var key in m.b) r.b[key] = isPP && f === 'addPow' ? m.b[key] + e : m.b[key] * e;
        if (base.t === 'var' && f === 'negSign' && e < 0) { r.b[base.v] = -e; r.c = B(-1n); return r; }
        var prod = base.t !== 'var' && base.t !== 'pow';
        r.c = prod && f === 'coefNoPow' ? m.c : prod && f === 'coefTimes' ? bmul(m.c, B(BigInt(e))) : bpow(m.c, e);
        return r;
      }
    }
    throw err('syntax');
  }
  function letters(m) { var o = {}; for (var k in m.b) if (k[0] !== '#' && m.b[k]) o[k] = m.b[k]; return o; }
  function valueOf(m) { var v = m.c; for (var k in m.b) if (k[0] === '#' && m.b[k]) v = bmul(v, bpow(B(BigInt(k.slice(1).replace('.', '')), 10n ** BigInt((k.split('.')[1] || '').length)), m.b[k])); return v; }
  function sameMono(a, b) {
    var la = letters(a), lb = letters(b), ka = Object.keys(la).sort(), kb = Object.keys(lb).sort();
    if (ka.join() !== kb.join() || ka.some(function (k) { return la[k] !== lb[k]; })) return false;
    return beq(valueOf(a), valueOf(b));
  }
  var EX_MISTAKES = [
    ['mulExp', 'When you <b>multiply</b> powers with the same base, <b>add</b> the exponents and keep the base. (Multiply the exponents only for a power of a power.)'],
    ['addPow', 'For a <b>power of a power</b>, <b>multiply</b> the exponents: (x<sup>3</sup>)<sup>4</sup> = x<sup>3·4</sup>.'],
    ['coefNoPow', 'The outside exponent goes on <b>every</b> factor inside the parentheses, the number too. For example, (2x<sup>3</sup>)<sup>4</sup> = 2<sup>4</sup> · x<sup>12</sup>.'],
    ['coefTimes', 'Raise the number to the power. 2<sup>4</sup> means 2 · 2 · 2 · 2 = 16, not 2 · 4.'],
    ['subRev', 'When you divide, subtract the <b>bottom</b> exponent from the <b>top</b> exponent.'],
    ['negSign', 'A negative exponent does not make the number negative. It means <b>flip it</b>: x<sup>−2</sup> = 1/x<sup>2</sup>.'],
    ['zeroIsZero', 'Anything (except 0) to the <b>zero</b> power is <b>1</b>, not 0.'],
    ['baseMul', 'Keep the base the same. For example, 4<sup>3</sup> · 4<sup>2</sup> = 4<sup>5</sup>, not 16<sup>5</sup>.']
  ];
  function exDiagnose(prevAst, mNew) {
    for (var i = 0; i < EX_MISTAKES.length; i++) { try { var w = mono(prevAst, EX_MISTAKES[i][0]); if (sameMono(w, mNew)) return EX_MISTAKES[i][1]; } catch (x) { } }
    var mp = mono(prevAst), lp = letters(mp), ln = letters(mNew), off = [];
    Object.keys(lp).concat(Object.keys(ln)).forEach(function (k) { if (lp[k] !== ln[k] && off.indexOf(k) < 0) off.push(k); });
    if (off.length) return 'Check the exponent on <i>' + off[0] + '</i>. Which rule fits: add, subtract or multiply the exponents?';
    return 'The letters are right. Check the <b>numbers</b>: the number in front, and any number with an exponent.';
  }
  /* is this line written in simplest form (positive exponents, each base once, one number on top and bottom)? */
  function exFactors(n, out, sign) {
    if (n.t === 'mul') { exFactors(n.a, out, sign); exFactors(n.b, out, sign); return; }
    if (n.t === 'par' && n.a.t !== 'add') { exFactors(n.a, out, sign); return; }
    if (n.t === 'neg') { out.neg = !out.neg; exFactors(n.a, out, sign); return; }
    if (n.t === 'num') { out.nums.push(n); return; }
    if (n.t === 'var') { out.f.push({ base: n.v, e: 1 }); return; }
    if (n.t === 'pow' && (n.a.t === 'var' || n.a.t === 'num')) { out.f.push({ base: n.a.t === 'var' ? n.a.v : '#' + (n.a.src || qtxt(n.a.v)), e: n.e }); return; }
    out.bad = true;
  }
  function exSimplest(ast, sci) {
    var top = ast.t === 'div' ? ast.a : ast, bot = ast.t === 'div' ? ast.b : null, T = { f: [], nums: [] }, D = { f: [], nums: [] };
    exFactors(top, T); if (bot) exFactors(bot, D);
    if (T.bad || D.bad || D.neg) return { ok: false };
    var all = T.f.concat(D.f), seen = {};
    for (var i = 0; i < all.length; i++) { if (seen[all[i].base]) return { ok: false, why: 'The base ' + all[i].base.replace('#', '') + ' shows up more than once. Combine it.' }; seen[all[i].base] = 1; if (all[i].e <= 0) return { ok: false, why: all[i].e === 0 ? 'There is still a zero exponent.' : 'Write it with <b>positive</b> exponents.' }; }
    if (T.nums.length > 1 || D.nums.length > 1) return { ok: false, why: 'Multiply the numbers together.' };
    if (T.nums.length && D.nums.length) { var a = bdec(T.nums[0].src || '1'), b = bdec(D.nums[0].src || '1'); if (bgcd(a.n, b.n) !== 1n || b.n === 1n) return { ok: false, why: 'The numbers on top and bottom can still be divided.' }; }
    if (bot && !D.f.length && !D.nums.length) return { ok: false };
    if (sci) {
      var tens = all.filter(function (z) { return z.base === '#10'; }), others = all.filter(function (z) { return z.base !== '#10'; });
      var c = T.nums.length ? Math.abs(Number(T.nums[0].src)) : 1;
      if (bot || others.length || tens.length !== 1 || !(c >= 1 && c < 10)) return { ok: false, why: 'Scientific notation is (a number from 1 up to, but not including, 10) × 10<sup>n</sup>. Adjust the first number and the exponent.' };
    }
    return { ok: true };
  }
  function exMoves(ast) {   // what the current line offers, with a picture of each rule (the student still does the math)
    var top = ast.t === 'div' ? ast.a : ast, bot = ast.t === 'div' ? ast.b : null, T = { f: [], nums: [] }, D = { f: [], nums: [] };
    exFactors(top, T); if (bot) exFactors(bot, D);
    var notes = {}, groups = {};
    T.f.forEach(function (z) { (groups[z.base] = groups[z.base] || []).push(z.e); });
    var bn = function (b) { return b[0] === '#' ? b.slice(1) : '<i>' + b + '</i>'; }, en = function (e) { return e < 0 ? '(−' + -e + ')' : String(e); };
    var add = Object.keys(groups).filter(function (b) { return groups[b].length > 1; });
    if (add.length) notes.add = add.map(function (b) { return groups[b].map(function (e) { return bn(b) + '<sup>' + e + '</sup>'; }).join(' · ') + ' → ' + bn(b) + '<sup>' + groups[b].map(en).join(' + ') + '</sup>'; }).join('<br>');
    var sub = D.f.filter(function (z) { return groups[z.base]; });
    if (sub.length) notes.sub = sub.map(function (z) { return bn(z.base) + '<sup>' + groups[z.base][0] + '</sup> ÷ ' + bn(z.base) + '<sup>' + z.e + '</sup> → ' + bn(z.base) + '<sup>' + en(groups[z.base][0]) + ' − ' + en(z.e) + '</sup>'; }).join('<br>');
    var pp = [], pprod = [], zero = [], neg = [];
    walk(ast, function (m) {
      if (m.t !== 'pow') return; var base = m.a.t === 'par' ? m.a.a : m.a;
      if (m.e === 0) zero.push(html(m) + ' = 1');
      if (m.e < 0) neg.push(html(m) + ' = 1 / ' + html({ t: 'pow', a: m.a, e: -m.e }) + ' (move it across the fraction bar; the exponent becomes positive)');
      if (base.t === 'pow') pp.push(html(m) + ' → ' + html(base.a) + '<sup>' + en(base.e) + ' · ' + en(m.e) + '</sup>');
      else if (base.t === 'mul') { var fs = { f: [], nums: [] }; exFactors(base, fs); pprod.push(html(m) + ' → ' + fs.nums.map(function (q) { return html(q) + '<sup>' + m.e + '</sup>'; }).concat(fs.f.map(function (z) { return '(' + bn(z.base) + (z.e !== 1 ? '<sup>' + z.e + '</sup>' : '') + ')<sup>' + m.e + '</sup>'; })).join(' · ')); }
    });
    if (pp.length) notes.pp = pp.join('<br>'); if (pprod.length) notes.pprod = pprod.join('<br>'); if (zero.length) notes.zero = zero.join('<br>'); if (neg.length) notes.neg = neg.join('<br>');
    if (T.nums.length > 1 || (T.nums.length && D.nums.length)) notes.coef = (T.nums.length > 1 ? 'Multiply the numbers: ' + T.nums.map(html).join(' · ') : '') + (T.nums.length && D.nums.length ? (T.nums.length > 1 ? '<br>' : '') + 'Divide the numbers: ' + html(T.nums[0]) + ' ÷ ' + html(D.nums[0]) : '');
    var tens = T.f.filter(function (z) { return z.base === '#10'; });
    if (tens.length && T.nums.length === 1) {
      var cv = Math.abs(Number(T.nums[0].src || 1));
      if (cv >= 10 || (cv > 0 && cv < 1)) {
        var sh = 0, cc = cv; while (cc >= 10) { cc /= 10; sh++; } while (cc < 1) { cc *= 10; sh--; }
        notes.adjust = 'The first number must be at least 1 and less than 10. ' + html(T.nums[0]) + ' = ' + (+cc.toFixed(10)) + ' × 10<sup>' + sh + '</sup>. Then combine the powers of 10: add the exponents.';
      }
    }
    return notes;
  }
  function mountExpr(host, cfg) {
    css(); uid++;
    var start; try { start = parseTerm(cfg.start); mono(start); } catch (e) { return null; }
    var open = btn('Work it out step by step', 'sw-open'); open.setAttribute('aria-expanded', 'false');
    var box = el('div', 'sw'); box.hidden = true; box.id = 'sw' + uid; open.setAttribute('aria-controls', box.id);
    host.appendChild(open); host.appendChild(box);
    var built = false, lines = [{ a: start, mv: null }];
    open.addEventListener('click', function () {
      box.hidden = !box.hidden; open.setAttribute('aria-expanded', String(!box.hidden));
      open.textContent = box.hidden ? 'Work it out step by step' : 'Hide step-by-step work';
      if (!built) { built = true; build(); }
    });
    var trail, work;
    function build() {
      box.appendChild(el('p', 'sw-h', 'Simplify it one rule at a time'));
      trail = el('ol', 'sw-trail'); box.appendChild(trail);
      work = el('div'); box.appendChild(work);
      draw(); step();
    }
    function draw() { trail.innerHTML = ''; lines.forEach(function (l, i) { var li = el('li'); li.appendChild(el('span', 'sw-n', String(i + 1))); li.appendChild(el('span', 'sw-ln', html(l.a))); if (l.mv) li.appendChild(el('span', 'sw-mv', l.mv)); trail.appendChild(li); }); }
    function step() {
      work.innerHTML = ''; var tried = 0;
      var a = lines[lines.length - 1].a, simp = exSimplest(a, cfg.sci);
      if (lines.length > 1 && simp.ok) return finish(a);
      var notes = exMoves(a);
      work.appendChild(el('p', 'sw-ask', 'Which rule will you use next?'));
      var mv = el('div', 'sw-moves'), vis = el('div', 'sw-vis'); vis.hidden = true;
      var M = cfg.sci ? [['coef', 'Multiply or divide the numbers'], ['add', 'Same base, multiplying: add exponents'], ['sub', 'Same base, dividing: subtract exponents'], ['adjust', 'Fix the first number (1 to 10)']]
        : [['coef', 'Multiply or divide the numbers'], ['add', 'Same base, multiplying: add exponents'], ['sub', 'Same base, dividing: subtract exponents'], ['pp', 'Power of a power: multiply exponents'], ['pprod', 'Power of a product: power on every factor'], ['zero', 'Zero exponent'], ['neg', 'Negative exponent']];
      var write = el('div', 'sw-write'); write.hidden = true;
      var fb = el('div', 'sw-fb'); fb.setAttribute('role', 'status'); fb.setAttribute('aria-live', 'polite');
      M.forEach(function (m) {
        var b = btn(m[1]); b.setAttribute('aria-pressed', 'false'); mv.appendChild(b);
        b.addEventListener('click', function () {
          [].forEach.call(mv.children, function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          fb.className = 'sw-fb'; fb.innerHTML = '';
          if (!notes[m[0]]) { vis.hidden = true; write.hidden = true; fb.className = 'sw-fb tip'; fb.innerHTML = 'That rule doesn\'t fit this line. Look at it again: what is being multiplied, divided or raised to a power?'; return; }
          vis.hidden = false; vis.innerHTML = '<div class="sw-ln">' + html(a) + '</div><p class="sw-note">' + notes[m[0]] + '</p>';
          showWrite();
        });
      });
      work.appendChild(mv); work.appendChild(vis); work.appendChild(write); work.appendChild(fb);
      if (cfg.sci) work.appendChild(el('p', 'sw-note', 'To type ×, use * or x. To type an exponent, use ^. Example: 6*10^8 means 6 × 10<sup>8</sup>.'));
      if (lines.length > 1) { var u = btn('Undo my last line', 'ghost'), ur = el('div', 'sw-acts'); u.addEventListener('click', function () { lines.pop(); draw(); step(); }); ur.appendChild(u); work.appendChild(ur); }
      if (lines.length === 1 && simp.ok) { fb.className = 'sw-fb tip'; fb.innerHTML = 'This is already simplified. Type it in the answer box.'; }
      function showWrite() {
        write.hidden = false; write.innerHTML = '';
        var lab = el('label', '', 'Write the new line:'), inp = el('input', 'line'); inp.type = 'text'; inp.autocomplete = 'off'; inp.spellcheck = false; inp.setAttribute('aria-label', 'Your new line');
        lab.appendChild(inp); write.appendChild(lab);
        var k = el('div', 'sw-keys'); [['xⁿ', '^'], ['(', '('], [')', ')'], ['/', '/'], ['×', '*'], ['−', '-'], ['⌫', 'BS']].forEach(function (kk) {
          var b2 = btn(kk[0]); b2.setAttribute('aria-label', kk[1] === 'BS' ? 'Erase' : 'Type ' + kk[0]); b2.addEventListener('mousedown', function (e) { e.preventDefault(); });
          b2.addEventListener('click', function () { var s = inp.selectionStart, t = inp.selectionEnd; if (kk[1] === 'BS') { if (s === t && s > 0) s--; inp.value = inp.value.slice(0, s) + inp.value.slice(t); inp.setSelectionRange(s, s); } else { inp.value = inp.value.slice(0, s) + kk[1] + inp.value.slice(t); inp.setSelectionRange(s + kk[1].length, s + kk[1].length); } inp.focus(); inp.dispatchEvent(new Event('input', { bubbles: true })); });
          k.appendChild(b2);
        }); write.appendChild(k);
        var pv = el('div', 'sw-prev'); write.appendChild(pv);
        inp.addEventListener('input', function () { if (!inp.value.trim()) { pv.innerHTML = ''; return; } try { var t = parseTerm(cfg.sci ? inp.value.replace(/(\d)\s*[x×]\s*10/gi, '$1*10') : inp.value); mono(t); pv.innerHTML = 'I read this as: <span class="sw-ln">' + html(t) + '</span>'; } catch (x) { pv.innerHTML = '<span style="color:#9A3412">' + exErr(x) + '</span>'; } });
        var acts = el('div', 'sw-acts'), go = btn('Check this line', 'go'); acts.appendChild(go); write.appendChild(acts);
        var check = function () {
          var t, mNew;
          try { t = parseTerm(cfg.sci ? inp.value.replace(/(\d)\s*[x×]\s*10/gi, '$1*10') : inp.value); mNew = mono(t); } catch (x) { fb.className = 'sw-fb no'; fb.innerHTML = exErr(x); return; }
          var mOld = mono(a);
          if (!sameMono(mOld, mNew)) { fb.className = 'sw-fb no'; fb.innerHTML = 'Not quite. ' + exDiagnose(a, mNew) + (++tried >= 3 ? calm(lines.length) : ''); return; }
          if (html(t) === html(a)) { fb.className = 'sw-fb tip'; fb.innerHTML = 'That is the same line. Use a rule to change it.'; return; }
          lines.push({ a: t, mv: 'equal ✓' }); draw(); step();
          var nfb = work.querySelector('.sw-fb'); if (nfb && !exSimplest(t, cfg.sci).ok) { var w = exSimplest(t, cfg.sci).why; nfb.className = 'sw-fb ok'; nfb.innerHTML = praise() + (w ? ' Keep going: ' + w : ''); }
        };
        go.addEventListener('click', check); inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); check(); } });
        inp.focus();
      }
    }
    function finish(a) {
      work.innerHTML = '';
      var d = el('div', 'sw-done'); d.setAttribute('role', 'status');
      d.innerHTML = '<b>Simplified:</b> <span class="sw-ln">' + html(a) + '</span><br>Every base shows up once, and all exponents are positive.' + (cfg.sci ? ' It is in scientific notation.' : '');
      work.appendChild(d);
      var ur = el('div', 'sw-acts'), u = btn('Undo my last line', 'ghost'); u.addEventListener('click', function () { lines.pop(); draw(); step(); }); ur.appendChild(u);
      if (cfg.onAnswer) { var b = btn('Put this answer in the answer box', 'go'); b.addEventListener('click', function () { cfg.onAnswer(plainTerm(a)); b.textContent = '✓ Answer filled in'; b.disabled = true; }); ur.appendChild(b); }
      work.appendChild(ur); keep(ur);
    }
    return box;
  }
  function plainTerm(a) {
    function p(n) {
      switch (n.t) {
        case 'num': return n.src || qtxt(n.v); case 'var': return n.v; case 'par': return '(' + p(n.a) + ')'; case 'neg': return '-' + p(n.a);
        case 'mul': return p(n.a) + (n.b.t === 'pow' && n.b.a.t === 'num' ? ' × ' : '') + p(n.b);
        case 'div': return p(n.a) + '/' + (n.b.t === 'mul' ? '(' + p(n.b) + ')' : p(n.b));
        case 'pow': return p(n.a) + '^' + n.e;
      }
      return '';
    }
    return p(a);
  }
  function exErr(x) {
    var c = x && x.code;
    return { sum: 'This is for one term. There should be no + or − between parts.', erel: 'Type just the expression, with no = sign.', twoslash: 'Use one fraction bar (/). Put the whole top on its left and the whole bottom on its right.',
      erootx: 'Square roots and π don\'t belong in this problem.', empty: 'Type the new line first.' }[c] || readErr(x, 'x');
  }

  /* ===================== automatic attaching ===================== */
  var ANGLE_HINTS = [
    [/complement/i, 'Complementary angles add to <b>90°</b>.'],
    [/right angle/i, 'The angles make a right angle, so they add to <b>90°</b>.'],
    [/supplement|linear pair|straight line/i, 'Angles that make a straight line (a linear pair) add to <b>180°</b>.'],
    [/vertical|cross/i, '<b>Vertical angles</b> (across from each other) are <b>equal</b>.'],
    [/same-side|same side/i, 'Same-side interior angles add to <b>180°</b>.'],
    [/corresponding|alternate|alt\./i, 'With parallel lines, corresponding and alternate angles are <b>equal</b>.'],
    [/exterior/i, 'An exterior angle equals the <b>sum of the two remote interior angles</b>.'],
    [/around a point|all the way around/i, 'Angles all the way around a point add to <b>360°</b>.'],
    [/triangle|isosceles/i, 'The three angles of a triangle add to <b>180°</b>.']
  ];
  var VOL_HINT = 'Start with the volume formula. Cylinder: <i>V</i> = π<i>r</i><sup>2</sup><i>h</i>. Cone: <i>V</i> = ⅓π<i>r</i><sup>2</sup><i>h</i>. Put in the numbers you know, and use a letter for the one you don\'t.';
  var PYTH_RE = /hypotenuse|missing leg|other leg|find a leg|legs? \d|distance|diagonal|ladder|how high|how far|horizontal length|longest side|wire|straight line from/i;
  function pythHint(t) {
    return /distance|point|\(\s*-?\d/i.test(t)
      ? 'Make a right triangle. The horizontal distance and the vertical distance between the points are the legs. Then use <i>a</i><sup>2</sup> + <i>b</i><sup>2</sup> = <i>c</i><sup>2</sup>.'
      : 'Use the Pythagorean Theorem: <i>a</i><sup>2</sup> + <i>b</i><sup>2</sup> = <i>c</i><sup>2</sup>. The legs are <i>a</i> and <i>b</i>. The hypotenuse <i>c</i> is the longest side, across from the right angle.';
  }
  function tolFor(a, text) {        // how close a rounded answer must be
    var m = String(a).match(/\.(\d+)/);
    if (m) return m[1].length === 1 ? 0.05 : 0.006;
    return /round|nearest/i.test(text || '') ? 0.5 : 1e-6;
  }
  function angleHint(t) { for (var i = 0; i < ANGLE_HINTS.length; i++) if (ANGLE_HINTS[i][0].test(t)) return ANGLE_HINTS[i][1]; return 'Name the angle relationship first. Are the angles equal, or do they add to 90°, 180° or 360°?'; }
  var B_HINT = 'Put the slope and a point into <i>y</i> = <i>mx</i> + <i>b</i>: use the point\'s <i>x</i> and <i>y</i>, and leave <i>b</i> as the unknown.';
  function findEq(text) {      // pull "3(x − 1) + 2x = 22" out of "Solve: 3(x − 1) + 2x = 22 — how many solutions?"
    var s = String(text).replace(/<span class="fr"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/g, '(($1)/($2))').replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    s = s.replace(/\(careful!?\)/ig, '').replace(/[—–]\s*how many.*$/i, '').replace(/^\s*(solve( and graph)?( the inequality)?|how many solutions( does)?|simplify)\s*[:.]?\s*/i, '').replace(/\s*have\?\s*$/i, '').replace(/[?.]\s*$/, '').trim();
    if (!/[=<>≤≥]/.test(s) || /[a-z]{2,}/i.test(s.replace(/sqrt/g, ''))) return null;
    try { var e = parseEq(s); if (e.vars.length !== 1) return null; sides(e, e.vars[0]); if (solve(e, e.vars[0]).kind === 'quad') return null; return s; } catch (x) { return null; }
  }
  function numAns(a) { var m = String(a).replace(/<span class="fr"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/g, '$1/$2').replace(/<[^>]+>/g, '').replace(/[−–]/g, '-').replace(/°/g, '').replace(/^\s*[a-z]\s*=\s*/i, '').trim(); if (/^-?\d+(\.\d+)?$/.test(m)) return qdec(m.replace('-', '')).n * (m[0] === '-' ? -1 : 1) / qdec(m.replace('-', '')).d; var f = m.match(/^(-?\d+)\/(\d+)$/); return f ? { n: +f[1], d: +f[2] } : null; }
  function toQ(a) { if (a == null) return null; if (a.n != null) return Q(a.n, a.d); var s = String(a); return a < 0 ? qneg(qdec(s.slice(1))) : qdec(s); }
  // When a workspace finishes, it gets much shorter. Keep its last part on screen so the page does not seem to jump.
  function keep(n) { try { requestAnimationFrame(function () { var r = n.getBoundingClientRect(); if (r.bottom > innerHeight || r.top < 0) n.scrollIntoView({ block: 'center' }); }); } catch (e) {} }
  function fillBox(inp, text) { inp.value = text; try { inp.dataset.swFilled = text; } catch (e) {} inp.dispatchEvent(new Event('input', { bubbles: true })); inp.focus({ preventScroll: true }); try { inp.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); } catch (e) { inp.focus(); } }

  function autoPractice() {
    var D = window.PRACTICE; if (!D) return;
    D.data.secs.forEach(function (sec, si) {
      sec.probs.forEach(function (p) {
        var card = document.getElementById('s' + si + 'p' + p.n); if (!card || card.querySelector('.sw-open')) return;
        var inp = card.querySelector('.pr-in'), host = el('div', 'sw-host'); card.appendChild(host);
        var ex = String(D.unit) === '2' && /^\s*(simplify|multiply|divide)\s*:/i.test(String(p.q).replace(/<[^>]+>/g, ''));
        if (p.sw) { if (mountExpr(host, { start: p.sw, sci: /×/.test(p.sw), onAnswer: function (t) { fillBox(inp, t); } })) return; }
        if (ex) {
          var q2 = String(p.q).replace(/^\s*(simplify|multiply|divide)\s*:\s*/i, '').replace(/[—–]\s*[a-z][^<]*$/i, '').trim();
          var w2 = mountExpr(host, { start: q2, sci: /10\s*(<sup>|\^|[⁰¹²³⁴⁵⁶⁷⁸⁹⁻])/.test(q2) && /×/.test(q2), onAnswer: function (t) { fillBox(inp, t); } });
          if (w2) return;
        }
        var start = findEq(p.q);
        var fmt = function (t, info) {
          var a = String(p.ans).replace(/<[^>]+>/g, '');
          if (info.kind === 'one' && !/[a-z]\s*=/i.test(a)) return info.numText || qtxt(info.x);
          return t;
        };
        if (start) { mount(host, { start: start, onAnswer: function (t, info) { fillBox(inp, fmt(t, info)); } }); return; }
        var unit = String(D.unit), ans = numAns(p.ans);
        if (unit === '5' && ans != null && PYTH_RE.test(p.q + ' ' + sec.title) && !/right triangle\?/i.test(p.q)) {
          mount(host, { setup: { answer: ans, tol: tolFor(p.ans, p.q), any: true, hint: pythHint(p.q + ' ' + sec.title), figure: !!p.fig }, positive: true,
            onAnswer: function (t, info) { fillBox(inp, info.numText || (info.x ? qtxt(info.x) : t)); } });
          return;
        }
        if (unit === '6' && /solve the system/i.test(p.q) && ans != null) {
          mount(host, { setup: { answer: ans, hint: 'Both equations say what <i>y</i> equals. Set the two right sides equal to each other.' }, onAnswer: function (t, info) { fillBox(inp, info.kind === 'one' ? qtxt(info.x) : t); } });
          return;
        }
        var angle = unit === '4' && /find x/i.test(p.q) && ans != null;
        var word = unit === '3' && /word/i.test(sec.title) && ans != null;
        if (angle || word) mount(host, {
          setup: { answer: ans, hint: angle ? angleHint(p.q + ' ' + sec.title) : 'Start amount + (rate × number of times) = total. "At most" means ≤.', ineq: word, figure: angle },
          v: angle ? 'x' : 'x',
          onAnswer: function (t, info) { fillBox(inp, info.kind === 'one' || info.kind === 'ineq' ? (info.numText || qtxt(info.x)) : t); }
        });
      });
    });
  }
  function autoPretest() {
    if (typeof QS === 'undefined' || !QS || !QS.forEach) return;      // eslint-disable-line no-undef
    QS.forEach(function (q) {                                          // eslint-disable-line no-undef
      var card = document.getElementById('q' + q.id), inp = document.getElementById('i' + q.id); if (!card || !inp || card.querySelector('.sw-open')) return;
      var host = el('div', 'sw-host'), ans = card.querySelector('.ans'); (ans && ans.nextSibling ? card.insertBefore(host, ans.nextSibling) : card.appendChild(host));
      var start = findEq(q.expr), chk = q.chk || [];
      var fill = function (t, info) {
        if (chk[0] === 'val' || chk[0] === 'num') return fillBox(inp, info.kind === 'one' ? (info.numText || qtxt(info.x)) : t);
        fillBox(inp, t);
      };
      var w = null;
      if (!start && q.sw) w = mountExpr(host, { start: q.sw, sci: /×/.test(q.sw), onAnswer: function (t) { fillBox(inp, t); } });   // word problem: the expression to simplify
      else if (!start && /^(simplify|multiply|divide|multi-step)\b/i.test(q.op || '')) {
        w = mountExpr(host, { start: q.expr, sci: /10\s*<sup>/.test(q.expr) && /×/.test(q.expr), onAnswer: function (t) { fillBox(inp, t); } });
      }
      else if (!start && (chk[0] === 'val' || chk[0] === 'num') && /find the (radius|height)/i.test((q.op || '') + ' ' + q.expr)) {
        w = mount(host, { setup: { answer: chk[1], tol: 1e-6, any: true, hint: VOL_HINT, figure: !!q.svg }, positive: true, roots: true, pi: true, onAnswer: fill });
      }
      else if (!start && chk[0] === 'num' && PYTH_RE.test(q.expr + ' ' + (q.op || ''))) {
        w = mount(host, { setup: { answer: chk[1], tol: Math.max(chk[2] || 0, 1e-6), any: true, hint: pythHint(q.expr), figure: !!q.svg }, positive: true, onAnswer: fill });
      }
      else if (start) w = mount(host, { start: start, onAnswer: fill });
      else if ((chk[0] === 'num' || chk[0] === 'val') && /y-intercept/i.test((q.op || '') + ' ' + q.expr) && /slope\s+-?−?\d+.*through\s*\(\s*-?−?[1-9]/i.test(q.expr)) {
        w = mount(host, { setup: { answer: chk[1], any: true, hint: B_HINT, prompt: 'Use <i>b</i> for the y-intercept. Write an equation that matches the problem.' }, onAnswer: fill });
      }
      else if (chk[0] === 'num' && /°|angle|triangle/i.test(String(q.svg || '') + q.expr + ' ' + (q.op || '')) &&
               (/<text[^>]*>[^<]*\d?x\b/.test(String(q.svg || '')) || /(^|[^a-z])x([^a-z]|$)/i.test(String(q.expr).replace(/<[^>]+>/g, ' ')))) {   // angle problems with an x
        var a = chk[1]; w = mount(host, { setup: { answer: a, hint: angleHint(q.expr + ' ' + (q.op || '')), figure: !!q.svg }, onAnswer: fill });
      }
      if (w) {
        var ob = host.querySelector('.sw-open'); if (ob) ob.addEventListener('click', function () { card.classList.toggle('sw-wide', !w.hidden); });
      }
      if (w) {   // the older "pick the next step" helper on this card is replaced by the workspace
        var old = card.querySelectorAll('.ss-open,.ss-panel'); for (var i = 0; i < old.length; i++) old[i].hidden = true, old[i].style.display = 'none';
      }
    });
  }
  function autoHomework() {
    var map = window.HW_STEPS, id = new URLSearchParams(location.search).get('hw');
    if (!map || !id || !map[id]) return;
    Object.keys(map[id]).forEach(function (num) {
      var inp = document.getElementById('a' + num); if (!inp) return;
      var lab = inp.closest('label'), entry = map[id][num];
      var parts = Array.isArray(entry) ? entry : [entry], got = [];
      parts.forEach(function (c, pi) {   // an array = one workspace per part (e.g. both intercepts), answers joined
        var host = el('div', 'sw-host'); lab.appendChild(host);
        if (c.title) host.appendChild(el('p', 'sw-part', '<b>' + c.title + '</b>'));
        var put = function (t) { if (parts.length === 1) return fillBox(inp, t); got[pi] = (c.tag || c.title ? (c.tag || c.title) + ': ' : '') + t; fillBox(inp, got.filter(Boolean).join('; ')); };
        var cfg = { onAnswer: function (t) { put(t); } };
        if (c.expr) {
          var bx = mountExpr(host, { start: c.expr, sci: !!c.sci, onAnswer: function (t) { put(t); } }), ob = host.querySelector('.sw-open');
          if (bx && ob) ob.addEventListener('click', function () { lab.classList.toggle('sw-wide', !bx.hidden); });
          return;
        }
        if (c.line) { cfg.start = c.line; cfg.line = true; }
        if (c.ps) { cfg.setup = { line: c.ps, ps: true, hint: c.hint, prompt: 'Use <i>x</i> and <i>y</i>. Write the equation of the line in point-slope form.' }; cfg.line = true; }
        if (c.start) cfg.start = c.start;
        if (c.setup != null && !c.ps) cfg.setup = { answer: c.setup.root ? Math.sqrt(c.setup.root) : c.setup, tol: c.setup.root ? 1e-6 : c.tol, hint: c.hint, ineq: !!c.ineq, figure: !!c.fig, prompt: c.prompt, any: !!c.any };
        if (c.positive) cfg.positive = true; if (c.pi) cfg.pi = true; if (c.roots) cfg.roots = true;
        if (c.then) cfg.then = c.then;
        if (c.v) cfg.v = c.v;
        var box = mount(host, cfg), open = host.querySelector('.sw-open');
        if (box && open) open.addEventListener('click', function () { lab.classList.toggle('sw-wide', !box.hidden); });
      });
    });
  }
  function auto() { try { autoPractice(); } catch (e) { if (window.console) console.error(e); } try { autoPretest(); } catch (e) { if (window.console) console.error(e); } try { autoHomework(); } catch (e) { if (window.console) console.error(e); } }

  /* One problem anywhere (used by the Interactive Notes, notes-steps.js): pick the right workspace from the
     problem's own words. o = { text (html), ans (answer text), unit, figure (bool), inp (answer box) } → workspace or null */
  function forProblem(host, o) {
    var html0 = String(o.text || '').replace(/<span class="(?:np-lv|badge|lvb)[^"]*"[^>]*>[^<]*<\/span>/g, ' ');
    var plain = html0.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim().replace(/^\(?\d+[.)]\s*/, '');
    var unit = String(o.unit || ''), ans = numAns(o.ans), inp = o.inp;
    var fill = function (t) { if (inp) fillBox(inp, t); };
    var one = function (t, info) { return info && (info.kind === 'one' || info.kind === 'ineq') && !/[a-z]\s*=/i.test(String(o.ans || '')) ? (info.numText || qtxt(info.x)) : t; };
    var w = null;
    if (unit === '2' && !/[=<>≤≥→]/.test(plain) && (/^(simplify|multiply|divide|evaluate)\b/i.test(plain) || /^\(\s*[\d.]+\s*×\s*10/.test(plain))) {
      var ex = html0.replace(/<span class="fr"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/g, '(($1)/($2))').replace(/<(?!\/?sup)[^>]+>/g, '')
        .replace(/^\s*\(?\d+[.)]\s*/, '').replace(/^\s*(simplify|multiply|divide|evaluate)\s*[:.,]?\s*/i, '').replace(/\.\s*(write|give|use|leave)[^]*$/i, '').replace(/\s+/g, ' ').trim();
      try { w = mountExpr(host, { start: ex, sci: /×\s*10/.test(ex), onAnswer: function (t) { fill(t); } }); } catch (x) { w = null; }
      if (w) return w;
      host.innerHTML = '';
    }
    var cand = [o.text, html0.replace(/^\s*\(?\d+[.)]\s*/, '')]; var ci = plain.lastIndexOf(':'); if (ci > 0 && /[=<>≤≥]/.test(plain.slice(ci))) cand.push(plain.slice(ci + 1));
    var start = null; cand.forEach(function (c) { if (!start) start = findEq(c); });
    if (start) return mount(host, { start: start, onAnswer: function (t, info) { fill(one(t, info)); } });
    if (ans == null) return null;
    if (unit === '5' && PYTH_RE.test(plain) && !/right triangle\?|is it a right/i.test(plain))
      return mount(host, { setup: { answer: ans, tol: tolFor(o.ans, plain), any: true, hint: pythHint(plain), figure: !!o.figure }, positive: true, onAnswer: function (t, info) { fill(info.numText || (info.x ? qtxt(info.x) : t)); } });
    if (unit === '9' && /find (its|the) (radius|height)|how tall|how high|radius\?|height\?/i.test(plain) && /holds|volume (is|of)|has a volume|V\s*=/i.test(plain) && !/same (radius|height)|twice|double|times/i.test(plain))
      return mount(host, { setup: { answer: ans, tol: tolFor(o.ans, plain), any: true, hint: VOL_HINT + (/sphere|ball|hemisphere/i.test(plain) ? ' Sphere: <i>V</i> = ⁴⁄₃π<i>r</i><sup>3</sup>.' : ''), figure: !!o.figure }, positive: true, roots: true, pi: true, onAnswer: function (t, info) { fill(info.numText || (info.x ? qtxt(info.x) : t)); } });
    if (unit === '6' && /solve the system/i.test(plain))
      return mount(host, { setup: { answer: ans, hint: 'Both equations say what <i>y</i> equals. Set the two right sides equal to each other.' }, onAnswer: function (t, info) { fill(info.kind === 'one' ? qtxt(info.x) : t); } });
    if (unit === '4' && /\bfind\s+x\b|\bx\s*=\s*\?|value of x/i.test(plain) && !/\bsides?\b|scale|proportion|similar triangles —/i.test(plain))
      return mount(host, { setup: { answer: ans, hint: angleHint(plain), figure: !!o.figure }, onAnswer: function (t, info) { fill(info.kind === 'one' ? (info.numText || qtxt(info.x)) : t); } });
    return null;
  }

  window.StepWork = { forProblem: forProblem, mount: mount, mountExpr: mountExpr, auto: auto, _t: { html: html, parseTerm: parseTerm, mono: mono, sameMono: sameMono, exDiagnose: exDiagnose, exSimplest: exSimplest, exMoves: exMoves, plainTerm: plainTerm, parseEq: parseEq, solve: solve, sides: sides, sameSet: sameSet, diagnose: diagnose, describe: describe, isSolved: isSolved, findEq: findEq, lineSame: lineSame, lineDone: lineDone, withX: withX, linOf: linOf, lineTxt: lineTxt, Q: Q, qtxt: qtxt, poly: poly, eqHtml: eqHtml } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto); else auto();
})();
