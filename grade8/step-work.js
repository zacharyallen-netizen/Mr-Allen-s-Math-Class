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
  function qtxt(a) { return a.d === 1 ? String(a.n) : a.n + '/' + a.d; }
  function err(code, extra) { var e = new Error(code); e.code = code; e.extra = extra; return e; }

  /* ===================== polynomials in one variable (degree ≤ 2) ===================== */
  function P(c0, c1, c2) { return [c0 || ZERO, c1 || ZERO, c2 || ZERO]; }
  function pconst(q) { return P(q); }
  function padd(a, b) { return [qadd(a[0], b[0]), qadd(a[1], b[1]), qadd(a[2], b[2])]; }
  function psub(a, b) { return [qsub(a[0], b[0]), qsub(a[1], b[1]), qsub(a[2], b[2])]; }
  function pscale(a, k) { return [qmul(a[0], k), qmul(a[1], k), qmul(a[2], k)]; }
  function pmul(a, b) {
    var r = [ZERO, ZERO, ZERO, ZERO, ZERO];
    for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) if (a[i].n && b[j].n) r[i + j] = qadd(r[i + j], qmul(a[i], b[j]));
    if (r[3].n || r[4].n) throw err('degree');
    return [r[0], r[1], r[2]];
  }
  function pdeg(a) { return a[2].n ? 2 : a[1].n ? 1 : 0; }
  function peq(a, b) { return qeq(a[0], b[0]) && qeq(a[1], b[1]) && qeq(a[2], b[2]); }
  function pzero(a) { return !a[0].n && !a[1].n && !a[2].n; }
  function pat(a, x) { return qadd(qadd(a[0], qmul(a[1], x)), qmul(a[2], qmul(x, x))); }

  /* ===================== reading what students type ===================== */
  var VULGAR = { '½': '(1/2)', '⅓': '(1/3)', '⅔': '(2/3)', '¼': '(1/4)', '¾': '(3/4)', '⅕': '(1/5)', '⅖': '(2/5)', '⅗': '(3/5)', '⅘': '(4/5)', '⅙': '(1/6)', '⅚': '(5/6)', '⅛': '(1/8)', '⅜': '(3/8)', '⅝': '(5/8)', '⅞': '(7/8)' };
  var SUP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' };
  function clean(s) {
    s = String(s)
      .replace(/<span class="fr"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/g, '(($1)/($2))')
      .replace(/<sup>(.*?)<\/sup>/g, '^($1)').replace(/<[^>]+>/g, '')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
      .replace(/[−–—]/g, '-').replace(/[×·∙⋅]/g, '*').replace(/÷/g, '/').replace(/°/g, '')
      .replace(/<=|=</g, '≤').replace(/>=|=>/g, '≥')
      .replace(/[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/g, function (c) { return VULGAR[c]; })
      .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, function (m) { return '^(' + m.split('').map(function (c) { return SUP[c]; }).join('') + ')'; })
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
      if ('+-*/^()'.indexOf(c) >= 0) { t.push({ k: c }); i++; continue; }
      if ('=<>≤≥'.indexOf(c) >= 0) { t.push({ k: 'rel', v: c }); i++; continue; }
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
      if (x.k === '+') { i++; return unary(); }
      return product();
    }
    function product() {
      var a = power();
      for (;;) {
        var x = peek(); if (!x) break;
        if (x.k === '*' || x.k === '/') { i++; var b = x.k === '*' ? unaryInProduct() : unaryInProduct(); a = { t: x.k === '*' ? 'mul' : 'div', a: a, b: b }; continue; }
        if (x.k === 'num' || x.k === 'var' || x.k === '(') { a = { t: 'mul', a: a, b: power(), imp: true }; continue; }
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
      case 'var': if (n.v !== v) throw err('letter', n.v); return P(ZERO, ONE);
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
      case 'pow': {
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
  var FLIP = { '<': '>', '>': '<', '≤': '≥', '≥': '≤', '=': '=' };
  function solve(e, v) {
    var s = sides(e, v), D = psub(s.L, s.R);
    if (D[2].n) return { kind: 'quad' };
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
    return true;
  }

  /* ===================== drawing math ===================== */
  function fmtQ(q, src) {
    if (src && /\./.test(src)) return src;
    if (q.d === 1) return String(Math.abs(q.n));
    return '<span class="sw-fr"><span>' + Math.abs(q.n) + '</span><span>' + q.d + '</span></span>';
  }
  function isNumLike(n) { return n.t === 'num' || (n.t === 'div' && n.a.t === 'num' && n.b.t === 'num') || (n.t === 'par' && isNumLike(n.a)); }
  function html(n, sub) {
    switch (n.t) {
      case 'num': return fmtQ(n.v, n.src);
      case 'var': return sub != null ? (/^\d+$/.test(sub) ? sub : '(' + sub + ')') : '<i>' + n.v + '</i>';
      case 'par': return (n.a.t === 'num' || n.a.t === 'var' || n.a.t === 'div' || n.a.t === 'par') && sub == null ? html(n.a, sub) : '(' + html(n.a, sub) + ')';
      case 'neg': return '−' + (n.a.t === 'add' ? '(' + html(n.a, sub) + ')' : html(n.a, sub));
      case 'add': return n.terms.map(function (t, i) {
        var h = html(t.n, sub), neg = t.s < 0;
        if (t.n.t === 'neg' && i > 0) { neg = !neg; h = h.replace(/^−/, ''); }
        return i === 0 ? (neg ? '−' : '') + h : (neg ? ' − ' : ' + ') + h;
      }).join('');
      case 'mul': {
        var A = html(n.a, sub), B = html(n.b, sub);
        if (sub == null && isNumLike(n.a) && (n.b.t === 'var' || n.b.t === 'pow' || n.b.t === 'par')) return A + B;
        if (sub == null && n.a.t === 'num' && n.b.t === 'mul') return A + B;
        return A + ' · ' + B;
      }
      case 'div': return '<span class="sw-fr"><span>' + html(n.a, sub) + '</span><span>' + html(n.b, sub) + '</span></span>';
      case 'pow': return html(n.a, sub) + '<sup>' + (n.e < 0 ? '−' + -n.e : n.e) + '</sup>';
    }
    return '';
  }
  function relHtml(r) { return { '=': '=', '<': '&lt;', '>': '&gt;', '≤': '≤', '≥': '≥' }[r]; }
  function eqHtml(e, sub) { return html(e.L, sub) + ' <span class="sw-rel">' + relHtml(e.rel) + '</span> ' + html(e.R, sub); }
  function polyHtml(p, v) {
    var parts = [];
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
    try { var p = poly(t.n, v); return p[2].n ? 'sq' : p[1].n ? 'xterm' : 'num'; } catch (e) { return 'num'; }
  }
  /* draw one side with colors: x-terms blue, numbers purple, parentheses gold; optional strike set */
  function sideHtml(n, v, mark) {
    return terms(n).map(function (t, i) {
      var h = html(t.n), k = kindOf(t, v), neg = t.s < 0;
      var cls = mark && mark.colors ? (k === 'xterm' ? 't-v' : k === 'num' ? 't-k' : k === 'paren' ? 't-p' : '') : '';
      if (mark && mark.strike && mark.strike.indexOf(i) >= 0) cls += ' t-c';
      var sign = i === 0 ? (neg ? '−' : '') : (neg ? ' − ' : ' + ');
      return sign + (cls ? '<span class="' + cls.trim() + '">' + h + '</span>' : h);
    }).join('');
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
    // changed only one side
    if (peq(a.R, b.R) && !peq(a.L, b.L)) side = 'left'; else if (peq(a.L, b.L) && !peq(a.R, b.R)) side = 'right';
    if (side) return 'Only the ' + side + ' side changed, and it is not equal to what it was. Whatever you do to one side, do to the <b>other side</b> too.';
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
      var oneTerm = [P(qmul(A[0], c), A[1], A[2]), P(A[0], qmul(A[1], c), A[2])].some(function (x) { return peq(x, B); });
      if (oneTerm) return 'You ' + (qnum(c) < 1 && qnum(c) > -1 ? 'divided' : 'multiplied') + ' only part of the ' + wrongSide + ' side. Multiply or divide <b>every term</b> on both sides.';
      return 'Check the ' + wrongSide + ' side. If you multiply or divide one side by a number, do it to <b>every term</b> on the other side too.';
    }
    if (!pzero(dL) && pdeg(dL) === 0 && !pzero(dR) && pdeg(dR) === 0) return 'You added or subtracted different amounts on the two sides. Use the <b>same</b> number on both sides.';
    return 'This line is not equal to the line before it. Check your arithmetic, one term at a time.';
  }
  function isSolved(e, v) {
    var s = sides(e, v), xL = peq(s.L, P(ZERO, ONE)) && e.L.t === 'var', xR = peq(s.R, P(ZERO, ONE)) && e.R.t === 'var';
    if (xL && pdeg(s.R) === 0) return { x: s.R[0], rel: e.rel };
    if (xR && pdeg(s.L) === 0) return { x: s.L[0], rel: FLIP[e.rel] };
    return null;
  }
  function noVar(e) { return e.vars.length === 0; }

  /* ===================== messages ===================== */
  function readErr(e, v) {
    var c = e && e.code;
    return {
      empty: 'Type the new line first.', norel: 'Your line needs an = sign (or &lt;, &gt;, ≤, ≥).', tworel: 'Use only one = sign (or one inequality sign).',
      side: 'Something is missing on one side of the sign.', paren: 'Check your parentheses. Each ( needs a ).', missing: 'Something is missing. Check for a sign with nothing after it.',
      syntax: 'I can\'t read that yet. Check the signs and numbers.', letter: 'Use the letter <i>' + v + '</i> in this problem.', divx: 'This tool can\'t divide by ' + v + '. Try another move.',
      degree: v + ' got multiplied by itself. Check your multiplying.', zero: 'You can\'t divide by 0.', char: 'I can\'t read the symbol "' + (e && e.extra) + '". Use the keys below.',
      exp: 'Exponents here must be whole numbers.', negexp: 'I can\'t use a negative exponent on ' + v + ' here.'
    }[c] || 'I can\'t read that yet. Check the signs and numbers.';
  }

  /* ===================== styles ===================== */
  var CSS = '' +
    '.sw-open{font:600 15px Inter,system-ui,sans-serif;min-height:44px;padding:8px 14px;border-radius:8px;border:1.5px dashed #1E2D4F;background:#FFF6D6;color:#1E2D4F;cursor:pointer;margin-top:10px}' +
    '.sw-open:focus-visible,.sw button:focus-visible,.sw input:focus-visible{outline:3px solid #1D4ED8;outline-offset:2px}' +
    '.sw{margin-top:8px;border:1px solid #E3E5EA;border-left:4px solid #FFC107;border-radius:10px;background:#fff;padding:12px 14px;text-align:left;color:#1E2D4F;font:400 15px/1.45 Inter,system-ui,sans-serif}' +
    '.sw[hidden]{display:none}' +
    '.sw-h{font:700 12.5px Inter,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#7A5300;margin:0 0 6px}' +
    '.sw-trail{list-style:none;margin:0 0 6px;padding:0}' +
    '.sw-trail>li{display:flex;gap:10px;align-items:baseline;padding:4px 0;border-bottom:1px solid #EEF0F3;flex-wrap:wrap}' +
    '.sw-trail>li:last-child{border-bottom:0}' +
    '.sw-n{flex:none;display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;border-radius:50%;background:#1E2D4F;color:#FFC107;font:700 12px Inter,sans-serif}' +
    '.sw-ln{font:600 20px/1.8 "Source Serif 4",Georgia,serif}' +
    '.sw-mv{font:600 13px Inter,sans-serif;color:#7A5300;background:#FFF6D6;border-radius:6px;padding:1px 8px}' +
    '.sw-ask{font:600 15px Inter,sans-serif;margin:10px 0 6px}' +
    '.sw-moves{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px}' +
    '.sw button{font:600 14.5px Inter,sans-serif;min-height:44px;padding:6px 12px;border-radius:8px;border:1.5px solid #1E2D4F;background:#fff;color:#1E2D4F;cursor:pointer}' +
    '.sw button[aria-pressed=true]{background:#1E2D4F;color:#fff}' +
    '.sw button.go{background:#1E2D4F;color:#fff}.sw button.ghost{border-style:dashed}' +
    '.sw button:disabled{opacity:.45;cursor:not-allowed}' +
    '.sw-amt{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:8px}' +
    '.sw input{font:500 18px "JetBrains Mono",ui-monospace,monospace;min-height:44px;padding:6px 10px;border:2px solid #cdd5e0;border-radius:8px;color:#1E2D4F;background:#fff;max-width:100%}' +
    '.sw input.amt{width:110px}.sw input.line{width:100%;box-sizing:border-box}' +
    '.sw-vis{margin-top:10px;background:#FBFBF9;border:1px solid #EEF0F3;border-radius:8px;padding:8px 10px;overflow-x:auto}' +
    '.sw-grid{display:grid;grid-template-columns:auto auto auto;justify-content:start;column-gap:14px;row-gap:2px;font:600 20px/1.7 "Source Serif 4",Georgia,serif;align-items:center}' +
    '.sw-grid .r{text-align:center}.sw-grid .op{color:#B45309;font-weight:700}.sw-grid .lft{text-align:right}' +
    '.sw-note{font:400 14.5px/1.45 Inter,sans-serif;color:#3A4356;margin-top:6px}' +
    '.sw-write{margin-top:10px}.sw-write label{display:block;font:600 14.5px Inter,sans-serif;margin-bottom:4px}' +
    '.sw-keys{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}.sw-keys button{min-width:44px;font:600 16px "JetBrains Mono",monospace;padding:4px 8px}' +
    '.sw-prev{font:500 15px Inter,sans-serif;color:#5B6475;margin-top:6px;min-height:1.4em}.sw-prev .sw-ln{font-size:18px;color:#1E2D4F}' +
    '.sw-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}' +
    '.sw-fb{margin-top:8px;font-size:15px;min-height:1px;border-radius:8px}.sw-fb.no{color:#7A1A12;background:#FBEAEA;padding:8px 10px}.sw-fb.ok{color:#14532D;background:#E7F5EC;padding:8px 10px}.sw-fb.tip{color:#5A3D00;background:#FFF6D6;padding:8px 10px}' +
    '.sw-done{margin-top:10px;background:#E7F5EC;border-radius:8px;padding:10px 12px;color:#14532D}' +
    '.sw-done .sw-ln{color:#14532D}' +
    '.sw-then{margin-top:10px}.sw-then .sw-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:6px 0;font:600 16px "Source Serif 4",Georgia,serif}.sw-row .sw-fb{margin-top:0}' +
    '.sw-h i{text-transform:none;font-family:"Source Serif 4",Georgia,serif;font-size:1.1em}' +
    '.sw-fr{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;line-height:1.1;margin:0 2px;font-size:.85em}' +
    '.sw-fr>span:first-child{border-bottom:1.6px solid currentColor;padding:0 3px}.sw-fr>span:last-child{padding:0 3px}' +
    '.sw .t-v{color:#1D4ED8;background:#E6EDFD;border-radius:4px;padding:0 3px}' +
    '.sw .t-k{color:#7E22A8;background:#F4E8FA;border-radius:4px;padding:0 3px}' +
    '.sw .t-p{color:#7A5300;background:#FFE58A;border-radius:4px;padding:0 3px}' +
    '.sw .t-c{text-decoration:line-through;text-decoration-color:#B42318;text-decoration-thickness:2.5px;opacity:.75}' +
    '.sw-rel{color:#1E2D4F}' +
    '.sw-legend{font:500 13px Inter,sans-serif;color:#5B6475;margin-top:4px}' +
    '.sw-wide{grid-column:1/-1}.sw-host .sw-open{width:100%}' +
    '@media (max-width:480px){.sw-ln,.sw-grid{font-size:18px}.sw{padding:10px}}' +
    '@media print{.sw,.sw-open{display:none!important}}';
  function css() { if (document.getElementById('sw-css')) return; var s = document.createElement('style'); s.id = 'sw-css'; s.textContent = CSS; document.head.appendChild(s); }
  function el(tag, cls, h) { var e = document.createElement(tag); if (cls) e.className = cls; if (h != null) e.innerHTML = h; return e; }
  function btn(label, cls) { var b = el('button', cls || '', label); b.type = 'button'; return b; }

  /* ===================== the workspace ===================== */
  var uid = 0;
  function mount(host, cfg) {
    css(); uid++;
    var v = cfg.v || 'x', original = null;
    if (cfg.start) { try { original = parseEq(cfg.start); if (original.vars.length === 1) v = cfg.v || original.vars[0]; } catch (e) { return null; } }
    var open = btn(cfg.label || 'Work it out step by step', 'sw-open'); open.setAttribute('aria-expanded', 'false');
    var box = el('div', 'sw'); box.hidden = true; box.id = 'sw' + uid; open.setAttribute('aria-controls', box.id);
    host.appendChild(open); host.appendChild(box);
    var built = false;
    open.addEventListener('click', function () {
      box.hidden = !box.hidden; open.setAttribute('aria-expanded', String(!box.hidden));
      open.textContent = box.hidden ? (cfg.label || 'Work it out step by step') : 'Hide step-by-step work';
      if (!built) { built = true; cfg.setup ? setupStage() : solveStage(original); }
    });

    /* keypad + "I read this as" preview for any input */
    function keypad(inp, opts) {
      var k = el('div', 'sw-keys'); k.setAttribute('aria-label', 'Math keys');
      var keys = [[v, v], ['(', '('], [')', ')'], ['−', '-'], ['/', '/']];
      if (opts && opts.amountOnly) keys = [[v, v], ['−', '-'], ['/', '/']];
      else keys = keys.concat([['=', '='], ['<', '<'], ['>', '>'], ['≤', '≤'], ['≥', '≥']]);
      if (opts && opts.exp) keys.push(['xⁿ', '^']);
      keys.push(['⌫', 'BS']);
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
        try { var e = parseEq(inp.value); sides(e, v); out.innerHTML = 'I read this as: <span class="sw-ln">' + eqHtml(e) + '</span>'; }
        catch (x) { out.innerHTML = '<span style="color:#9A3412">' + readErr(x, v) + '</span>'; }
      });
    }

    /* ---------- stage 1 (word and angle problems): write the equation ---------- */
    function setupStage() {
      var S = cfg.setup;
      box.innerHTML = '';
      box.appendChild(el('p', 'sw-h', 'Step 1 · Write an equation' + (S.ineq ? ' or inequality' : '')));
      box.appendChild(el('p', 'sw-note', S.prompt || ('Use <i>' + v + '</i> for the unknown. Write an equation that matches the problem' + (S.figure ? ' and the picture' : '') + '.')));
      var w = el('div', 'sw-write'), inp = el('input', 'line'); inp.type = 'text'; inp.autocomplete = 'off'; inp.spellcheck = false; inp.setAttribute('aria-label', 'Your equation');
      w.appendChild(inp); w.appendChild(keypad(inp)); var pv = el('div', 'sw-prev'); w.appendChild(pv); preview(inp, pv);
      var acts = el('div', 'sw-acts'), go = btn('Check my equation', 'go'); acts.appendChild(go); w.appendChild(acts);
      var fb = el('div', 'sw-fb'); fb.setAttribute('role', 'status'); fb.setAttribute('aria-live', 'polite'); w.appendChild(fb);
      box.appendChild(w);
      var tries = 0;
      function check() {
        var e; try { e = parseEq(inp.value); sides(e, v); } catch (x) { fb.className = 'sw-fb no'; fb.innerHTML = readErr(x, v); return; }
        if (e.vars.length !== 1 || e.vars[0] !== v) { fb.className = 'sw-fb no'; fb.innerHTML = 'Your equation needs the unknown <i>' + v + '</i> in it.'; return; }
        var sol = solve(e, v), want = Q(S.answer.n != null ? S.answer.n : Math.round(S.answer * 1e6), S.answer.n != null ? S.answer.d : 1e6);
        var ok = (sol.kind === 'one' && qeq(sol.x, want)) || (S.ineq && sol.kind === 'ineq' && qeq(sol.x, want));
        if (sol.kind === 'one' && !ok && isSolved(e, v)) { fb.className = 'sw-fb no'; fb.innerHTML = 'Write the equation first, before you solve it. Start from the facts in the problem.'; tries++; return; }
        if (ok) { fb.className = 'sw-fb ok'; fb.innerHTML = '✓ Good equation. Now solve it.'; inp.readOnly = true; go.disabled = true; setTimeout(function () { solveStage(e, true); }, 300); return; }
        tries++;
        fb.className = 'sw-fb no';
        fb.innerHTML = (sol.kind === 'all' ? 'That is true for every number, so it can\'t find one answer. ' : sol.kind === 'none' ? 'That equation has no solution. ' : 'That equation does not match the problem yet. ') +
          (tries >= 1 && S.hint ? '<br>💡 ' + S.hint : '');
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
      var legend = el('p', 'sw-legend', '<span class="t-v" style="color:#1D4ED8;background:#E6EDFD;border-radius:4px;padding:0 3px">' + v + '-terms</span> &nbsp; <span style="color:#7E22A8;background:#F4E8FA;border-radius:4px;padding:0 3px">numbers</span> &nbsp; <span style="color:#7A5300;background:#FFE58A;border-radius:4px;padding:0 3px">parentheses</span> &nbsp; <span style="text-decoration:line-through;text-decoration-color:#B42318;text-decoration-thickness:2px">crossed out</span> = cancels');
      box.appendChild(legend);
      var work = el('div'); box.appendChild(work);
      drawTrail(); step();

      function cur() { return lines[lines.length - 1].e; }
      function drawTrail() {
        trail.innerHTML = '';
        lines.forEach(function (l, i) {
          var li = el('li');
          li.appendChild(el('span', 'sw-n', String(i + 1)));
          li.appendChild(el('span', 'sw-ln', i === lines.length - 1 ? colorLine(l.e) : eqHtml(l.e)));
          if (l.mv) li.appendChild(el('span', 'sw-mv', l.mv));
          trail.appendChild(li);
        });
      }
      function colorLine(e) { return sideHtml(e.L, v, { colors: true }) + ' <span class="sw-rel">' + relHtml(e.rel) + '</span> ' + sideHtml(e.R, v, { colors: true }); }

      function step() {
        work.innerHTML = '';
        var e = cur(), done = isSolved(e, v);
        if (done || noVar(e)) return finish(e, done);
        work.appendChild(el('p', 'sw-ask', 'What will you do next?'));
        var mv = el('div', 'sw-moves'); mv.setAttribute('role', 'group'); mv.setAttribute('aria-label', 'Choose a move');
        var MOVES = [['dist', 'Distribute'], ['comb', 'Combine like terms'], ['add', 'Add to both sides'], ['sub', 'Subtract from both sides'], ['mul', 'Multiply both sides'], ['div', 'Divide both sides']];
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
          } else if (m === 'comb') {
            var info = [e.L, e.R].map(function (side) { var ts = terms(side), xs = 0, ns = 0, ps = 0; ts.forEach(function (t) { var k = kindOf(t, v); if (k === 'xterm') xs++; else if (k === 'num') ns++; else ps++; }); return { xs: xs, ns: ns, ps: ps }; });
            var can = info.some(function (s) { return s.xs > 1 || s.ns > 1; });
            if (!can) { fb.className = 'sw-fb tip'; fb.innerHTML = info.some(function (s) { return s.ps; }) ? 'Like terms can\'t combine through parentheses. Distribute first.' : 'There are no like terms on the <b>same side</b> to combine. (Terms on opposite sides of the sign don\'t combine. Move one first.)'; return; }
            vis.hidden = false;
            vis.innerHTML = '<div class="sw-ln">' + colorLine(e) + '</div><p class="sw-note">Like terms have the same color. Combine the <span class="t-v">' + v + '-terms</span> with each other and the <span class="t-k">numbers</span> with each other, <b>on each side separately</b>.</p>';
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
          if ((m === 'mul' || m === 'div') && pdeg(k) > 0) { fb.className = 'sw-fb no'; fb.innerHTML = 'Multiply or divide by a number, not by ' + v + '.'; return; }
          if ((m === 'mul' || m === 'div') && !k[0].n) { fb.className = 'sw-fb no'; fb.innerHTML = m === 'div' ? 'You can\'t divide by 0.' : 'Multiplying by 0 makes both sides 0, and you lose the equation.'; return; }
          if (pzero(k)) { fb.className = 'sw-fb no'; fb.innerHTML = 'Adding or subtracting 0 doesn\'t change anything. Pick an amount.'; return; }
          amount = { m: m, k: k, raw: raw };
          var opH = (m === 'add' ? '+ ' : m === 'sub' ? '− ' : m === 'mul' ? '× ' : '÷ ') + polyHtml(m === 'sub' || m === 'add' ? k : k, v).replace(/^−/, m === 'add' || m === 'sub' ? '' : '−');
          if ((m === 'add' || m === 'sub') && qsign(k[pdeg(k)]) < 0) opH = (m === 'add' ? '+ (' : '− (') + polyHtml(k, v) + ')';
          var change = m === 'add' ? k : m === 'sub' ? pscale(k, qneg(ONE)) : null;
          var strikeL = [], strikeR = [], notes = [];
          if (change) {
            [[e.L, strikeL, 'left'], [e.R, strikeR, 'right']].forEach(function (z) {
              terms(z[0]).forEach(function (t, i) {
                try { var tp = poly(t.n, v); if (t.s < 0) tp = pscale(tp, qneg(ONE)); if (peq(padd(tp, change), P())) { z[1].push(i); notes.push('On the ' + z[2] + ' side, ' + polyHtml(tp, v) + ' and ' + polyHtml(change, v) + ' make <b>0</b>. They cancel.'); } } catch (x) { }
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
                    notes.push(c.d !== 1 || m === 'mul'
                      ? (m === 'mul' ? qHtml(k[0]) : '1 over ' + qHtml(k[0])) + ' is the <b>reciprocal</b> of ' + qHtml(c) + '. &nbsp;' + qHtml(c) + ' · ' + qHtml(f) + ' = <b>1</b>, so ' + qHtml(c) + '<i>' + v + '</i> becomes 1<i>' + v + '</i> = <i>' + v + '</i>.'
                      : qHtml(c) + '<i>' + v + '</i> ÷ ' + qHtml(k[0]) + ' = 1<i>' + v + '</i>, because ' + qHtml(c) + ' ÷ ' + qHtml(k[0]) + ' = <b>1</b>. The ' + qHtml(c) + ' cancels.');
                  }
                } catch (x) { }
              });
            });
            if (e.rel !== '=' && qsign(f) < 0) notes.push('You are ' + (m === 'mul' ? 'multiplying' : 'dividing') + ' by a <b>negative</b> number. Think about what that does to the inequality sign.');
          }
          vis.hidden = false;
          vis.innerHTML = '<div class="sw-grid"><div class="lft">' + sideHtml(e.L, v, { colors: true, strike: strikeL }) + '</div><div class="r">' + relHtml(e.rel) + '</div><div>' + sideHtml(e.R, v, { colors: true, strike: strikeR }) + '</div>' +
            '<div class="lft op' + (strikeL.length ? ' t-c' : '') + '">' + opH + '</div><div></div><div class="op' + (strikeR.length ? ' t-c' : '') + '">' + opH + '</div></div>' +
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
          var n;
          try { n = parseEq(raw); sides(n, v); } catch (x) { fb.className = 'sw-fb no'; fb.innerHTML = readErr(x, v); return; }
          if (n.vars.some(function (z) { return z !== v; })) { fb.className = 'sw-fb no'; fb.innerHTML = readErr({ code: 'letter' }, v); return; }
          var prev = cur(), ok;
          try { ok = sameSet(solve(prev, v), solve(n, v)); } catch (x) { fb.className = 'sw-fb no'; fb.innerHTML = readErr(x, v); return; }
          if (!ok) { fb.className = 'sw-fb no'; fb.innerHTML = '✗ ' + diagnose(prev, n, v); return; }
          var d = describe(prev, n, v), label = moveLabel(d, v), note = '';
          if (d.type === 'rewrite' && sameText(prev, n)) { fb.className = 'sw-fb tip'; fb.innerHTML = 'That is the same line. Make a change first.'; return; }
          if (amount && (d.type === 'add' || d.type === 'scale')) {
            var meant = amount.m === 'add' ? amount.k : amount.m === 'sub' ? pscale(amount.k, qneg(ONE)) : null;
            if ((meant && (d.type !== 'add' || !peq(d.k, meant))) || (!meant && (d.type !== 'scale' || !qeq(d.c, amount.m === 'mul' ? amount.k[0] : qdiv(ONE, amount.k[0])))))
              note = ' (That is true, but it is not the move you picked. That\'s OK.)';
          }
          var before = countTerms(prev), after = countTerms(n);
          if (d.type === 'add' && after > before) note += '<br>💡 That move is allowed, but now there are <b>more</b> terms. Did it get <i>' + v + '</i> closer to being alone? You can undo it.';
          lines.push({ e: n, mv: label });
          drawTrail();
          step();
          var nfb = work.querySelector('.sw-fb');
          if (nfb && !isSolved(n, v) && !noVar(n)) { nfb.className = 'sw-fb ok'; nfb.innerHTML = '✓ Correct line.' + note; }
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
        if (cfg.then && info.kind === 'one') thenStage(info.x);
        else useBtn(info);
      }
      function useBtn(info) {
        if (!cfg.onAnswer) { work.appendChild(el('p', 'sw-note', 'Now type your answer in the answer box.')); return; }
        var r = el('div', 'sw-acts'), b = btn('Put this answer in the answer box', 'go');
        b.addEventListener('click', function () { cfg.onAnswer(answerText(info, v), info); b.textContent = '✓ Answer filled in'; b.disabled = true; });
        r.appendChild(b); work.appendChild(r);
      }
      function thenStage(x) {
        var t = el('div', 'sw-then');
        t.appendChild(el('p', 'sw-h', (cfg.setup ? 'Step 3 · ' : 'Next · ') + 'Use <i>' + v + '</i> = ' + qtxt(x) + ' to finish'));
        var left = cfg.then.length, vals = [];
        cfg.then.forEach(function (it, i) {
          var lab = el('div', 'sw-row', '<span>' + it.label + ' =</span>'), inp = el('input', 'amt'); inp.type = 'text'; inp.autocomplete = 'off'; inp.setAttribute('aria-label', it.label);
          var go = btn('Check'), fb = el('span', 'sw-fb'); fb.setAttribute('aria-live', 'polite');
          lab.appendChild(inp); lab.appendChild(document.createTextNode(it.unit || '')); lab.appendChild(go); lab.appendChild(fb); t.appendChild(lab);
          var want = pat(poly(parseExpr(lex(clean(it.expr))), v), x);
          var chk = function () {
            var got; try { got = pat(poly(parseExpr(lex(clean(inp.value.replace(/°/g, '')))), v), x); } catch (e) { fb.className = 'sw-fb no'; fb.textContent = 'Type a number.'; return; }
            if (qeq(got, want)) { fb.className = 'sw-fb ok'; fb.innerHTML = '✓'; inp.readOnly = true; go.disabled = true; vals[i] = qtxt(want) + (it.unit || ''); if (--left === 0) after(); }
            else { fb.className = 'sw-fb no'; fb.innerHTML = 'Put ' + v + ' = ' + qtxt(x) + ' into ' + html(parseExpr(lex(clean(it.expr)))) + ' and simplify.'; }
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
    if (info.kind === 'all') return 'infinitely many solutions';
    if (info.kind === 'none') return 'no solution';
    return info.kind === 'one' ? v + ' = ' + qtxt(info.x).replace(/^-/, '-') : v + ' ' + ({ '≤': '≤', '≥': '≥', '<': '<', '>': '>' }[info.rel]) + ' ' + qtxt(info.x);
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
  function angleHint(t) { for (var i = 0; i < ANGLE_HINTS.length; i++) if (ANGLE_HINTS[i][0].test(t)) return ANGLE_HINTS[i][1]; return 'Name the angle relationship first. Are the angles equal, or do they add to 90°, 180° or 360°?'; }
  function findEq(text) {      // pull "3(x − 1) + 2x = 22" out of "Solve: 3(x − 1) + 2x = 22 — how many solutions?"
    var s = String(text).replace(/<span class="fr"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/g, '(($1)/($2))').replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    s = s.replace(/\(careful!?\)/ig, '').replace(/[—–]\s*how many.*$/i, '').replace(/^\s*(solve( and graph)?( the inequality)?|how many solutions( does)?|simplify)\s*[:.]?\s*/i, '').replace(/\s*have\?\s*$/i, '').replace(/[?.]\s*$/, '').trim();
    if (!/[=<>≤≥]/.test(s) || /[a-z]{2,}/i.test(s.replace(/sqrt/g, ''))) return null;
    try { var e = parseEq(s); if (e.vars.length !== 1) return null; sides(e, e.vars[0]); if (solve(e, e.vars[0]).kind === 'quad') return null; return s; } catch (x) { return null; }
  }
  function numAns(a) { var m = String(a).replace(/<span class="fr"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/g, '$1/$2').replace(/<[^>]+>/g, '').replace(/[−–]/g, '-').replace(/°/g, '').replace(/^\s*[a-z]\s*=\s*/i, '').trim(); if (/^-?\d+(\.\d+)?$/.test(m)) return qdec(m.replace('-', '')).n * (m[0] === '-' ? -1 : 1) / qdec(m.replace('-', '')).d; var f = m.match(/^(-?\d+)\/(\d+)$/); return f ? { n: +f[1], d: +f[2] } : null; }
  function toQ(a) { if (a == null) return null; if (a.n != null) return Q(a.n, a.d); var s = String(a); return a < 0 ? qneg(qdec(s.slice(1))) : qdec(s); }
  function fillBox(inp, text) { inp.value = text; inp.dispatchEvent(new Event('input', { bubbles: true })); inp.focus(); }

  function autoPractice() {
    var D = window.PRACTICE; if (!D) return;
    D.data.secs.forEach(function (sec, si) {
      sec.probs.forEach(function (p) {
        var card = document.getElementById('s' + si + 'p' + p.n); if (!card || card.querySelector('.sw-open')) return;
        var inp = card.querySelector('.pr-in'), host = el('div'); card.appendChild(host);
        var start = findEq(p.q);
        var fmt = function (t, info) {
          var a = String(p.ans).replace(/<[^>]+>/g, '');
          if (info.kind === 'one' && !/[a-z]\s*=/i.test(a)) return qtxt(info.x);
          return t;
        };
        if (start) { mount(host, { start: start, onAnswer: function (t, info) { fillBox(inp, fmt(t, info)); } }); return; }
        var unit = String(D.unit), ans = numAns(p.ans);
        var angle = unit === '4' && /find x/i.test(p.q) && ans != null;
        var word = unit === '3' && /word/i.test(sec.title) && ans != null;
        if (angle || word) mount(host, {
          setup: { answer: ans, hint: angle ? angleHint(p.q + ' ' + sec.title) : 'Start amount + (rate × number of times) = total. "At most" means ≤.', ineq: word, figure: angle },
          v: angle ? 'x' : 'x',
          onAnswer: function (t, info) { fillBox(inp, info.kind === 'one' || info.kind === 'ineq' ? qtxt(info.x) : t); }
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
        if (chk[0] === 'val' || chk[0] === 'num') return fillBox(inp, info.kind === 'one' ? qtxt(info.x) : t);
        fillBox(inp, t);
      };
      var w = null;
      if (start) w = mount(host, { start: start, onAnswer: fill });
      else if (chk[0] === 'num' && /°|angle|triangle/i.test(String(q.svg || '') + q.expr + ' ' + (q.op || '')) &&
               (/<text[^>]*>[^<]*\d?x\b/.test(String(q.svg || '')) || /(^|[^a-z])x([^a-z]|$)/i.test(String(q.expr).replace(/<[^>]+>/g, ' ')))) {   // angle problems with an x
        var a = chk[1]; w = mount(host, { setup: { answer: a, hint: angleHint(q.expr + ' ' + (q.op || '')), figure: !!q.svg }, onAnswer: fill });
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
      var lab = inp.closest('label'), host = el('div', 'sw-host'); lab.appendChild(host);
      var c = map[id][num], cfg = { onAnswer: function (t) { fillBox(inp, t); } };
      if (c.start) cfg.start = c.start;
      if (c.setup != null) cfg.setup = { answer: c.setup, hint: c.hint, ineq: !!c.ineq, figure: !!c.fig, prompt: c.prompt };
      if (c.then) cfg.then = c.then;
      if (c.v) cfg.v = c.v;
      var box = mount(host, cfg), open = host.querySelector('.sw-open');
      if (box && open) open.addEventListener('click', function () { lab.classList.toggle('sw-wide', !box.hidden); });
    });
  }
  function auto() { try { autoPractice(); } catch (e) { if (window.console) console.error(e); } try { autoPretest(); } catch (e) { if (window.console) console.error(e); } try { autoHomework(); } catch (e) { if (window.console) console.error(e); } }

  window.StepWork = { mount: mount, auto: auto, _t: { parseEq: parseEq, solve: solve, sides: sides, sameSet: sameSet, diagnose: diagnose, describe: describe, isSolved: isSolved, findEq: findEq, Q: Q, qtxt: qtxt, poly: poly, eqHtml: eqHtml } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto); else auto();
})();
