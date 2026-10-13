/* vwork.js — step-by-step equation work in STEP BOXES (Mr. Allen's Math Class).

   <div class="vw" data-vw='{"eq":"2(2x + 3) = -6"}'></div>   → drawn on load.

   The work is COMPUTED from the equation, so every number in every step is right.
   Each step is its own box:  Step n: short title  →  a plain-words explanation  →
     BEFORE  the line we start with
     DO IT   the same line with the move written in red on BOTH sides (terms that cancel are crossed out;
             dividing shows full fraction bars; distributing shows each multiplication in blue;
             like terms are grouped in purple / orange)
     AFTER   the new line (the last one is boxed in green).
   x's on both sides always move to the LEFT side (teacher's rule).
   Options: eq (equation / inequality with =,<,>,<=,>=,≤,≥, or an expression to simplify),
            labels:{n:"text"} (replace step n's explanation), mode:"step" (Next step / Show all) | "all",
            note:"text" (small grey line under the work).
   <div class="vw-after" data-after="pA1"> … </div> → hidden until item pA1 has been checked, then a
   "Show the steps" button opens it. ?key=1 in the page address shows everything. */
(function (root) {
  'use strict';
  /* ---------- exact fractions ---------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function F(n, d) { d = d === undefined ? 1 : d; if (d < 0) { n = -n; d = -d; } var g = gcd(n, d); return { n: n / g, d: d / g }; }
  function fromStr(s) { var m = String(s).split('.'); if (m.length < 2) return F(parseInt(s, 10), 1); var p = Math.pow(10, m[1].length); return F(Math.round(parseFloat(s) * p), p); }
  function add(a, b) { return F(a.n * b.d + b.n * a.d, a.d * b.d); }
  function sub(a, b) { return F(a.n * b.d - b.n * a.d, a.d * b.d); }
  function mul(a, b) { return F(a.n * b.n, a.d * b.d); }
  function div(a, b) { return F(a.n * b.d, a.d * b.n); }
  function neg(a) { return F(-a.n, a.d); }
  function isZ(a) { return a.n === 0; }
  function eq(a, b) { return a.n === b.n && a.d === b.d; }
  function val(a) { return a.n / a.d; }
  var ONE = F(1), ZERO = F(0);
  var MINUS = '−';

  function terminating(d) { while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; }
  // number → HTML (absolute value unless signed)
  function num(a, signed) {
    var s = signed && a.n < 0 ? MINUS : '', n = Math.abs(a.n);
    if (a.d === 1) return s + n;
    if (terminating(a.d)) { var v = n / a.d, t = String(Math.round(v * 1e6) / 1e6); return s + t; }
    return s + '<span class="vw-fr"><span>' + n + '</span><span>' + a.d + '</span></span>';
  }
  function approx(a) { return (Math.round(val(a) * 100) / 100).toString().replace('-', MINUS); }

  /* ---------- parsing ---------- */
  function tokenize(s) {
    s = s.replace(/[−–—]/g, '-').replace(/≤/g, '<=').replace(/≥/g, '>=').replace(/[·×]/g, '*').replace(/\s+/g, '');
    var out = [], i = 0, m;
    while (i < s.length) {
      var r = s.slice(i);
      if ((m = r.match(/^\d+(\.\d+)?|^\.\d+/))) { out.push({ t: 'n', v: m[0] }); i += m[0].length; }
      else if ((m = r.match(/^(<=|>=|<|>|=)/))) { out.push({ t: 'rel', v: m[0] }); i += m[0].length; }
      else if (/[a-z]/i.test(r[0])) { out.push({ t: 'x', v: r[0] }); i++; }
      else { out.push({ t: r[0] }); i++; }
    }
    return out;
  }
  function Parser(toks) { this.t = toks; this.i = 0; this.v = 'x'; }
  Parser.prototype.peek = function () { return this.t[this.i] || { t: 'end' }; };
  Parser.prototype.next = function () { return this.t[this.i++] || { t: 'end' }; };
  Parser.prototype.side = function () {
    var terms = [], sign = 1, first = true;
    while (true) {
      var p = this.peek();
      if (p.t === '+' || p.t === '-') { this.next(); sign = p.t === '-' ? -sign : sign; continue; }
      if (p.t === 'end' || p.t === 'rel' || p.t === ')') break;
      var term = this.term(sign); terms.push(term); sign = 1; first = false;
      var q = this.peek(); if (q.t !== '+' && q.t !== '-') break;
    }
    return terms;
  };
  Parser.prototype.term = function (sign) {
    var p = this.peek(), coef = null, coefTxt = null;
    if (p.t === 'n') { this.next(); coef = fromStr(p.v); coefTxt = p.v; if (this.peek().t === '*') this.next(); }
    var q = this.peek();
    if (q.t === 'x') {
      this.next(); this.v = q.v; var k = coef || ONE, dv = null;
      if (this.peek().t === '/') { this.next(); var dn = this.next(); dv = parseInt(dn.v, 10); k = div(k, F(dv)); }
      if (sign < 0) k = neg(k);
      return { t: 'x', k: k, dv: dv };
    }
    if (q.t === '(') {
      this.next(); var inner = this.side(); this.next(); // ')'
      var f = coef || ONE; if (sign < 0) f = neg(f);
      return { t: 'g', f: f, bare: !coef, inner: inner };
    }
    var c = coef || ONE;
    if (this.peek().t === '/') { this.next(); c = div(c, fromStr(this.next().v)); }
    return { t: 'c', k: sign < 0 ? neg(c) : c };
  };
  function parse(s) {
    var p = new Parser(tokenize(s)), L = p.side(), rel = null, R = null;
    if (p.peek().t === 'rel') { rel = p.next().v; R = p.side(); }
    return { L: L, R: R, rel: rel, v: p.v };
  }

  /* ---------- display helpers ---------- */
  var REL = { '=': '=', '<': '&lt;', '>': '&gt;', '<=': '≤', '>=': '≥' };
  var FLIP = { '=': '=', '<': '>', '>': '<', '<=': '>=', '>=': '<=' };
  function abs(k) { return F(Math.abs(k.n), k.d); }
  var V = 'x';
  // body (no sign) of a term
  function body(tm, o) {
    o = o || {};
    if (tm.t === 'c') return num(abs(tm.k));
    if (tm.t === 'x') {
      var a = abs(tm.k);
      if (tm.dv && a.n === 1 && a.d === tm.dv) return '<span class="vw-fr"><span>' + V + '</span><span' + (o.xden ? ' class="vw-x on"' : '') + '>' + tm.dv + '</span></span>';
      if (eq(a, ONE)) return V;
      return '<span' + (o.xcoef ? ' class="vw-x on"' : '') + '>' + num(a) + '</span>' + V;
    }
    // group
    var fa = abs(tm.f), ft = tm.bare && eq(fa, ONE) ? '' : num(fa);
    return ft + '(' + side(tm.inner.map(function (t) { return { tm: t }; })) + ')';
  }
  function sgnOf(it) { return it.tm ? (it.tm.t === 'g' ? it.tm.f.n < 0 : it.tm.k.n < 0) : !!it.neg; }
  // items: [{tm, cls, cross, raw (html instead of body), neg}] → "−2x + 4 − 4"
  function side(items) {
    if (!items.length) return '0';
    return items.map(function (it, i) {
      var n = sgnOf(it), sg = i === 0 ? (n ? MINUS : '') : (n ? MINUS + '\u00a0' : '+\u00a0'), lead = i === 0 ? '' : ' ';
      var b = it.raw !== undefined ? it.raw : body(it.tm, it);
      var cls = (it.cls || '') + (it.cross ? ' vw-x on' : '');
      return lead + (cls.trim() ? '<span class="' + cls.trim() + '">' + sg + b + '</span>' : sg + b);
    }).join('');
  }
  function plain(terms, cls) { return terms.map(function (t) { return { tm: t, cls: cls && cls(t) }; }); }
  function tText(t) { return side([{ tm: t }]).replace(/<[^>]+>/g, ''); }
  function xTxt(k) { var a = abs(k); return (k.n < 0 ? MINUS : '') + (eq(a, ONE) ? '' : num(a)) + V; }
  function signed(k) { return (k.n < 0 ? MINUS + ' ' : '+ ') + num(abs(k)); }
  function frac(top, bot) { return '<span class="vw-bigfr"><span>' + top + '</span><span>' + bot + '</span></span>'; }

  /* ---------- the solver: a list of step boxes ---------- */
  function build(spec) {
    var P = parse(spec.eq); V = P.v;
    var rel = P.rel, L = P.L, R = P.R, steps = [], labels = spec.labels || {};
    function row(Li, Ri, r) { return [side(Li), r ? REL[r] : null, Ri ? side(Ri) : null]; }
    function cur() { return row(plain(L), R && plain(R), rel); }
    function push(st) { st.n = steps.length + 1; if (labels[st.n]) st.expl = labels[st.n]; steps.push(st); return st; }
    var start = cur();
    var hasG = function (s) { return s && s.some(function (t) { return t.t === 'g'; }); };

    // 1) distribute
    if (hasG(L) || hasG(R)) {
      var gs = [].concat(L, R || []).filter(function (t) { return t.t === 'g'; }), g0 = gs[0], ex;
      if (g0.bare && g0.f.n > 0) ex = 'A + in front of the ( ) keeps every sign the same. Just drop the ( ).';
      else if (g0.bare) ex = 'The ' + MINUS + ' in front means ' + MINUS + '1. Multiply ' + MINUS + '1 by EACH term inside the ( ). Every sign inside changes.';
      else ex = 'Multiply ' + num(g0.f, true) + ' by EACH term inside the ( ).' + (g0.f.n < 0 ? ' Watch the signs: a negative times a negative is positive.' : '');
      if (gs.length > 1) ex = gs.every(function (g) { return g.bare && g.f.n > 0; }) ? 'A + in front of a ( ) keeps every sign the same. Just drop the ( ).' : 'Multiply the number in front of each ( ) by EACH term inside it.';
      var before = cur();
      var doSide = function (s) { var o = []; (s || []).forEach(function (t) {
          if (t.t !== 'g') { o.push({ tm: t }); return; }
          var f = t.f, ft = f.n < 0 ? '(' + num(f, true) + ')' : num(f);
          if (t.bare && f.n > 0) { t.inner.forEach(function (it) { o.push({ tm: it, cls: 'vw-blue' }); }); return; }
          t.inner.forEach(function (it, j) { o.push({ raw: ft + '(' + tText(it) + ')', neg: false, cls: 'vw-blue' }); });
        }); return o; };
      var exp = function (s) { var o = []; (s || []).forEach(function (t) { if (t.t === 'g') t.inner.forEach(function (it) { var z = { t: it.t, k: mul(t.f, it.k), dist: 1 }; if (it.t === 'x' && it.dv && eq(abs(t.f), ONE)) z.dv = it.dv; o.push(z); }); else o.push(t); }); return o; };
      var doit = [side(doSide(L)), rel ? REL[rel] : null, R ? side(doSide(R)) : null];
      L = exp(L); R = R ? exp(R) : null;
      var blue = function (t) { return t.dist ? 'vw-blue' : ''; };
      var aftD = row(plain(L, blue), R && plain(R, blue), rel), strip = function (r) { return r.join('|').replace(/<[^>]+>/g, ''); };
      push({ title: gs.every(function (g) { return g.bare && g.f.n > 0; }) ? 'Drop the ( )' : 'Distribute', expl: ex, before: before, doit: strip(doit) === strip(aftD) ? null : doit, after: aftD });
      L.forEach(function (t) { delete t.dist; }); if (R) R.forEach(function (t) { delete t.dist; });
    }
    // 2) combine like terms
    function needs(s) { if (!s) return false; var nx = 0, nc = 0; s.forEach(function (t) { if (t.t === 'x') nx++; else nc++; }); return nx > 1 || nc > 1; }
    if (needs(L) || needs(R)) {
      var parts = [], before2 = cur();
      var grp = function (s) {
        if (!needs(s)) return plain(s);
        var xs = s.filter(function (t) { return t.t === 'x'; }), cs = s.filter(function (t) { return t.t === 'c'; }), o = [];
        if (xs.length > 1) { o.push({ raw: '(' + side(plain(xs)) + ')', neg: false, cls: 'vw-purple' }); var sx = xs.reduce(function (a, t) { return add(a, t.k); }, ZERO); parts.push(side(plain(xs)).replace(/<[^>]+>/g, '') + ' = ' + (isZ(sx) ? '0' : xTxt(sx))); }
        else xs.forEach(function (t) { o.push({ tm: t }); });
        if (cs.length > 1) { o.push({ raw: '(' + side(plain(cs)) + ')', neg: false, cls: 'vw-orange' }); var sc = cs.reduce(function (a, t) { return add(a, t.k); }, ZERO); parts.push(side(plain(cs)).replace(/<[^>]+>/g, '') + ' = ' + num(sc, true)); }
        else cs.forEach(function (t) { o.push({ tm: t }); });
        return o;
      };
      var doit2 = [side(grp(L)), rel ? REL[rel] : null, R ? side(grp(R)) : null];
      var comb = function (s) { if (!needs(s)) return s; var kx = ZERO, kc = ZERO, hx = false, hc = false; s.forEach(function (t) { if (t.t === 'x') { kx = add(kx, t.k); hx = true; } else { kc = add(kc, t.k); hc = true; } });
        var o = []; if (hx && !isZ(kx)) o.push({ t: 'x', k: kx, cx: 1 }); if (hc && !isZ(kc)) o.push({ t: 'c', k: kc, cc: 1 }); return o; };
      L = comb(L); if (R) R = comb(R);
      var col = function (t) { return t.cx ? 'vw-purple' : t.cc ? 'vw-orange' : ''; };
      push({ title: 'Combine like terms', expl: 'Put like terms together (x terms with x terms, numbers with numbers): ' + parts.join(' and ') + '.', before: before2, doit: doit2, after: row(plain(L, col), R && plain(R, col), rel) });
      L.forEach(function (t) { delete t.cx; delete t.cc; }); if (R) R.forEach(function (t) { delete t.cx; delete t.cc; });
    }
    if (!R) { if (steps.length) steps[steps.length - 1].final = true; return { start: start, steps: steps, solve: false }; }

    var xi = function (s) { for (var j = 0; j < s.length; j++) if (s[j].t === 'x') return j; return -1; };
    var ci = function (s) { for (var j = 0; j < s.length; j++) if (s[j].t === 'c') return j; return -1; };
    var csum = function (s) { return s.filter(function (t) { return t.t === 'c'; }).reduce(function (a, t) { return add(a, t.k); }, ZERO); };
    function truth(a, b) { a = val(a); b = val(b); return rel === '=' ? a === b : rel === '<' ? a < b : rel === '>' ? a > b : rel === '<=' ? a <= b : a >= b; }
    function verdictFor(st) {
      var a = csum(L), b = csum(R), ok = truth(a, b);
      st.verdict = { ok: ok, text: 'The ' + V + '’s are gone. ' + num(a, true) + ' ' + REL[rel] + ' ' + num(b, true) + ' is <b>' + (ok ? 'TRUE' : 'FALSE') + '</b> → ' +
        (ok ? (rel === '=' ? '<b>Infinitely many solutions</b> (every number works)' : '<b>Every number works</b>') : '<b>No solution</b>') };
      st.final = true;
      return { start: start, steps: steps, solve: true };
    }
    if (xi(L) < 0 && xi(R) < 0) {           // x's cancelled while combining
      if (steps.length) return verdictFor(steps[steps.length - 1]);
    }
    var T = (xi(L) < 0 && xi(R) >= 0) ? 'R' : 'L';   // x's go to the LEFT unless they are only on the right

    // 3) x's on both sides → move them to the left
    if (xi(L) >= 0 && xi(R) >= 0) {
      var d = R[xi(R)].k, before3 = cur(), li = xi(L), ri = xi(R), opk = neg(d);
      var opItem = function (cross) { return { tm: { t: 'x', k: opk }, cls: 'vw-red', cross: cross }; };
      var newK = sub(L[li].k, d);
      var Ld = []; L.forEach(function (t, j) { Ld.push({ tm: t, cross: j === li && isZ(newK) }); if (j === li) Ld.push(opItem(isZ(newK))); });
      var Rd = []; R.forEach(function (t, j) { Rd.push({ tm: t, cross: j === ri }); if (j === ri) Rd.push(opItem(true)); });
      var ex3 = 'There is ' + (d.n > 0 ? '+ ' : MINUS + ' ') + xTxt(abs(d)).replace(/^/, '') + ' on the right side. Do the opposite: ' + (d.n > 0 ? 'subtract ' : 'add ') + xTxt(abs(d)) + (d.n > 0 ? ' from' : ' to') + ' BOTH sides. Now the ' + V + '’s are only on the left.';
      if (isZ(newK)) L = L.filter(function (t, j) { return j !== li; }); else L = L.map(function (t, j) { return j === li ? { t: 'x', k: newK } : t; });
      R = R.filter(function (t, j) { return j !== ri; });
      var st3 = push({ title: 'Move the ' + V + '’s to the left side', expl: ex3, before: before3, doit: row(Ld, Rd, rel), after: cur() });
      if (isZ(newK)) return verdictFor(st3);
    }
    // 4) number on the x side → undo it
    var XS = T === 'L' ? L : R, OS = T === 'L' ? R : L;
    if (ci(XS) >= 0) {
      var c = XS[ci(XS)].k, before4 = cur(), opc = { tm: { t: 'c', k: neg(c) }, cls: 'vw-red' }, xc = ci(XS);
      var Xd = []; XS.forEach(function (t, j) { Xd.push({ tm: t, cross: j === xc }); if (j === xc) Xd.push({ tm: opc.tm, cls: 'vw-red', cross: true }); });
      var Od = plain(OS); if (!Od.length) Od = [{ tm: { t: 'c', k: ZERO } }]; Od.push(opc);
      var ex4 = 'The opposite of ' + signed(c) + ' is ' + signed(neg(c)) + ', so ' + (c.n > 0 ? 'subtract ' + num(abs(c)) + ' from' : 'add ' + num(abs(c)) + ' to') + ' BOTH sides.';
      var newO = sub(csum(OS), c);
      XS = XS.filter(function (t, j) { return j !== xc; }); OS = [{ t: 'c', k: newO }];
      if (T === 'L') { L = XS; R = OS; } else { R = XS; L = OS; }
      push({ title: 'Get rid of the ' + signed(c), expl: ex4, before: before4, doit: T === 'L' ? row(Xd, Od, rel) : row(Od, Xd, rel), after: cur() });
    }
    // 5) undo the multiplication / division on x
    XS = T === 'L' ? L : R; OS = T === 'L' ? R : L;
    var xt = XS[xi(XS)], k = xt.k, rv = csum(OS), flip = false;
    if (!eq(k, ONE)) {
      var before5 = cur(), doX, doO, ex5, a = abs(k);
      if (xt.dv && a.n === 1 && a.d === xt.dv && k.n > 0) {
        ex5 = V + ' is DIVIDED by ' + xt.dv + '. The opposite is multiplying, so multiply BOTH sides by ' + xt.dv + '.';
        doX = '<span class="vw-red vw-x on">' + xt.dv + '</span> · ' + body(xt, { xden: true });
        doO = num(rv, true) + ' · <span class="vw-red">' + xt.dv + '</span>';
      } else {
        flip = rel !== '=' && k.n < 0;
        ex5 = (eq(a, ONE) ? MINUS + V + ' means ' + MINUS + '1 times ' + V + '. ' : V + ' is MULTIPLIED by ' + num(k, true) + '. The opposite is dividing, so ') + (eq(a, ONE) ? 'Divide' : 'divide') + ' BOTH sides by ' + num(k, true) + '.' +
          (flip ? ' <b class="vw-redt">' + num(k, true) + ' is negative, so the inequality sign FLIPS.</b>' : '');
        var cross = !eq(a, ONE);
        doX = frac((k.n < 0 && !cross ? MINUS : '') + body({ t: 'x', k: k }, { xcoef: cross }).replace(/^/, k.n < 0 && cross ? '' : ''), '<span class="vw-red' + (cross ? ' vw-x on' : '') + '">' + num(k, true) + '</span>');
        if (cross && k.n < 0) doX = frac('<span class="vw-x on">' + MINUS + num(a) + '</span>' + V, '<span class="vw-red vw-x on">' + num(k, true) + '</span>');
        doO = frac(num(rv, true), '<span class="vw-red">' + num(k, true) + '</span>');
      }
      var res = div(rv, k), r2 = flip ? FLIP[rel] : rel;
      var doRow = T === 'L' ? [doX, REL[rel], doO] : [doO, REL[rel], doX];
      if (T === 'L') { L = [{ t: 'x', k: ONE }]; R = [{ t: 'c', k: res }]; } else { R = [{ t: 'x', k: ONE }]; L = [{ t: 'c', k: res }]; }
      rel = r2;
      var aft = cur(); if (flip) aft[1] = '<span class="vw-redt">' + REL[rel] + '</span>';
      push({ title: 'Get ' + V + ' by itself', expl: ex5, before: before5, doit: doRow, after: aft, flip: flip });
    }
    if (T === 'R') {
      var cv = csum(L), b6 = cur(); rel = FLIP[rel]; L = [{ t: 'x', k: ONE }]; R = [{ t: 'c', k: cv }];
      push({ title: 'Write it with ' + V + ' first', expl: 'Read it from the ' + V + ' side. ' + b6.join(' ').replace(/<[^>]+>/g, '') + ' means the same as ' + cur().join(' ').replace(/<[^>]+>/g, '') + '.', before: b6, doit: null, after: cur() });
    }
    var last = steps[steps.length - 1];
    if (last) { last.final = true; var rv2 = csum(R); if (!terminating(rv2.d)) last.note = '≈ ' + approx(rv2); }
    return { start: start, steps: steps, solve: true, answer: cur() };
  }

  /* ---------- layout ---------- */
  var CSS = '.vw{margin:10px 0 14px;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif}' +
    '.vw-box{display:block;width:min(100%,480px);box-sizing:border-box}' +
    '.vw-start{font-size:1.15rem;font-weight:700;color:#1E2D4F;background:#F4F7FC;border:1.5px solid #D7DCE6;border-radius:10px;padding:8px 14px;margin-bottom:8px}' +
    '.vw-start small{font-size:.8rem;color:#6B7488;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-right:8px}' +
    '.vw-step{background:#fff;border:1.5px solid #C9D3E6;border-left:5px solid #0056B3;border-radius:10px;padding:10px 14px 10px;margin:0 0 10px}' +
    '.vw-step.final{border-left-color:#15803D}' +
    '.vw-st{font-weight:800;color:#0056B3;font-size:1rem}.vw-step.final .vw-st{color:#15803D}' +
    '.vw-st i{display:inline-block;min-width:1.5em;height:1.5em;line-height:1.5em;border-radius:50%;background:#0056B3;color:#fff;font-style:normal;text-align:center;margin-right:.45em;font-size:.82rem}' +
    '.vw-step.final .vw-st i{background:#15803D}' +
    '.vw-ex{font-size:.93rem;color:#2B3650;margin:3px 0 8px;line-height:1.45}' +
    '.vw-rows{display:grid;grid-template-columns:auto 1fr auto 1fr;align-items:center;column-gap:0;row-gap:5px}' +
    '.vw-lb{font-size:.72rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#6B7488;padding-right:.4em}' +
    '.vw-L{text-align:right}.vw-R{text-align:left}.vw-L,.vw-R,.vw-rel{font-size:1.15rem;font-weight:600;color:#1E2D4F;white-space:nowrap;font-variant-numeric:tabular-nums;padding:3px 0}' +
    '.vw-rel{text-align:center;padding:3px .45em}' +
    '.vw-do .vw-L,.vw-do .vw-R,.vw-do .vw-rel{background:#FFF7F6}.vw-do .vw-L{border-radius:6px 0 0 6px}.vw-do .vw-R{border-radius:0 6px 6px 0}' +
    '.vw-ans{background:#ECFDF3!important;border-top:2.5px solid #15803D;border-bottom:2.5px solid #15803D;color:#14532D!important}' +
    '.vw-ans.vw-L{border-left:2.5px solid #15803D;border-radius:8px 0 0 8px;padding-left:.5em}.vw-ans.vw-R{border-right:2.5px solid #15803D;border-radius:0 8px 8px 0;padding-right:.5em}' +
    '.vw-fr{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;font-size:.88em;line-height:1.1;margin:0 .08em}' +
    '.vw-fr>span:first-child{border-bottom:2px solid currentColor;padding:0 .15em}' +
    '.vw-bigfr{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;line-height:1.2}' +
    '.vw-bigfr>span:first-child{border-bottom:2.5px solid #1E2D4F;padding:0 .3em 1px}.vw-bigfr>span:last-child{padding-top:1px}' +
    '.vw-x{position:relative;display:inline-block}' +
    '.vw-x{margin:0 .06em}.vw-x.on::after{content:"";position:absolute;left:-2px;right:-2px;top:52%;border-top:2.6px solid #B42318;transform:rotate(-22deg)}' +
    '.vw-red,.vw-redt{color:#B42318}.vw-redt{font-weight:800}.vw-blue{color:#0056B3}.vw-purple{color:#6D28D9}.vw-orange{color:#B45309}' +
    '.vw-ver{font-size:.95rem;font-weight:600;padding:8px 10px;margin-top:8px;border-radius:8px}' +
    '.vw-ver.ok{background:#ECFDF3;color:#14532D;border:2px solid #15803D}.vw-ver.no{background:#FEF2F2;color:#7F1D1D;border:2px solid #B42318}' +
    '.vw-note{text-align:center;font-size:.85rem;color:#6B7488;padding-top:4px}' +
    '.vw-btns{display:flex;gap:8px;flex-wrap:wrap;margin-top:4px}' +
    '.vw-btns button{font:600 .85rem Inter,system-ui,sans-serif;padding:7px 13px;border-radius:7px;border:1.5px solid #0056B3;background:#0056B3;color:#fff;cursor:pointer}' +
    '.vw-btns button.vw-sec{background:#fff;color:#0056B3}.vw-btns button:disabled{opacity:.55;cursor:default}' +
    '.vw-cap{font-size:.82rem;color:#6B7488;margin-top:4px}' +
    '.vw-after{display:none}.vw-after.ready{display:block}.vw-after .vw-afterbody{display:none}.vw-after.open .vw-afterbody{display:block}' +
    '.vw-show{font:600 .85rem Inter,system-ui,sans-serif;padding:7px 13px;border-radius:7px;border:1.5px solid #15803D;background:#fff;color:#15803D;cursor:pointer;margin-top:6px}' +
    '.vw-after.open .vw-show{display:none}' +
    '.pp-step{font-size:.92rem;color:#1E2D4F;margin-top:10px;padding-top:6px;border-top:1px dashed #C9D0DD}.pp-step b{color:#0056B3}' +
    '.pp-space{height:.82in}' +
    '.pp-ans{margin-top:10px;font-size:1rem;color:#1E2D4F;font-weight:600}.pp-line{display:inline-block;min-width:1.6in;border-bottom:2px solid #1E2D4F;padding:0 6px;color:#15803D;font-weight:700}.pp-line.wide{min-width:2.6in}' +
    '@media print{.vw-btns,.vw-show{display:none!important}.vw-step{break-inside:avoid}}';

  function rowsHTML(lb, r, cls, ans) {
    var c = ans ? ' vw-ans' : '';
    if (r[2] === null) return '<div class="vw-lb">' + lb + '</div><div class="vw-L' + c + '" style="grid-column:2/5;text-align:center">' + r[0] + '</div>';
    return '<div class="vw-lb">' + lb + '</div><div class="vw-L' + c + '">' + r[0] + '</div><div class="vw-rel' + c + '">' + r[1] + '</div><div class="vw-R' + c + '">' + r[2] + '</div>';
  }
  function render(el) {
    var spec; try { spec = JSON.parse(el.getAttribute('data-vw')); } catch (e) { return; }
    var B; try { B = build(spec); } catch (e) { if (window.console) console.warn('vwork', spec.eq, e); return; }
    var key = /[?&]key=1/.test(location.search), mode = key ? 'all' : (spec.mode || 'step');
    var h = '<div class="vw-box"><div class="vw-start"><small>' + (B.solve ? 'Solve' : 'Simplify') + '</small>' + B.start[0] + (B.start[1] ? ' ' + B.start[1] + ' ' + B.start[2] : '') + '</div>';
    B.steps.forEach(function (s) {
      h += '<div class="vw-step' + (s.final ? ' final' : '') + '" data-s="' + s.n + '">' +
        '<div class="vw-st"><i>' + s.n + '</i>Step ' + s.n + ': ' + s.title + '</div>' +
        '<div class="vw-ex">' + s.expl + '</div><div class="vw-rows">' +
        rowsHTML('Before', s.before) + (s.doit ? '<div class="vw-do" style="display:contents">' + rowsHTML('Do it', s.doit) + '</div>' : '') +
        rowsHTML('After', s.after, '', s.final && !s.verdict) + '</div>' +
        (s.verdict ? '<div class="vw-ver ' + (s.verdict.ok ? 'ok' : 'no') + '">' + s.verdict.text + '</div>' : '') +
        (s.note ? '<div class="vw-note">' + s.note + '</div>' : '') + '</div>';
    });
    h += '</div>' + (spec.note ? '<div class="vw-cap">' + spec.note + '</div>' : '') +
      (mode === 'step' && B.steps.length ? '<div class="vw-btns"><button type="button" class="vw-next">Next step ▸</button><button type="button" class="vw-sec vw-all">Show all steps</button></div>' : '');
    el.innerHTML = h;
    el.setAttribute('role', 'group'); el.setAttribute('aria-label', 'Step by step work for ' + spec.eq);
    var st = { cur: mode === 'all' ? B.steps.length : 0, max: B.steps.length };
    el._vw = st; el._vwB = B; el._vwSpec = spec;
    function show() {
      el.querySelectorAll('.vw-step').forEach(function (c) { c.style.display = +c.getAttribute('data-s') <= st.cur ? '' : 'none'; });
      var nb = el.querySelector('.vw-next'), ab = el.querySelector('.vw-all');
      if (nb) { nb.disabled = st.cur >= st.max; nb.textContent = st.cur >= st.max ? '✓ All steps shown' : 'Next step ▸ (' + (st.cur + 1) + ' of ' + st.max + ')'; }
      if (ab) ab.style.display = st.cur >= st.max ? 'none' : '';
    }
    el._vwShow = show;
    var nb = el.querySelector('.vw-next'), ab = el.querySelector('.vw-all');
    if (nb) nb.onclick = function () { if (st.cur < st.max) { st.cur++; show(); } };
    if (ab) ab.onclick = function () { st.cur = st.max; show(); };
    show();
  }
  function relayout() { }

  function afterWrap(w) {
    var q = w.getAttribute('data-after'), key = /[?&]key=1/.test(location.search);
    if (!w.querySelector('.vw-afterbody')) { var bd = document.createElement('div'); bd.className = 'vw-afterbody'; while (w.firstChild) bd.appendChild(w.firstChild); w.appendChild(bd);
      var b = document.createElement('button'); b.type = 'button'; b.className = 'vw-show'; b.textContent = 'Show the steps ▸'; w.insertBefore(b, bd);
      b.onclick = function () { w.classList.add('open'); }; }
    function ready() { w.classList.add('ready'); }
    if (key) { w.classList.add('ready', 'open'); return; }
    var fb = document.getElementById('fb-' + q), box = document.getElementById(q);
    var test = function () { return (fb && /\bshow\b/.test(fb.className)) || (box && box.classList.contains('answered')); };
    if (test()) ready();
    var obs = new MutationObserver(function () { if (test()) { ready(); obs.disconnect(); } });
    if (fb) obs.observe(fb, { attributes: true, attributeFilter: ['class'] });
    if (box) obs.observe(box, { attributes: true, attributeFilter: ['class'] });
  }

  /* ---------- paper version: start line, then Step 1, Step 2 … with room to write ---------- */
  function answerOf(B) {
    var last = B.steps[B.steps.length - 1];
    if (last && last.verdict) return last.verdict.ok ? (last.verdict.text.indexOf('Infinitely') >= 0 ? 'Infinitely many solutions' : 'Every number works') : 'No solution';
    var a = last ? last.after : B.start;
    return a[0] + (a[1] ? ' ' + a[1] + ' ' + a[2] : '');
  }
  function paper(el, o) {
    o = o || {}; var B = el._vwB; if (!B) return;
    var bt = el.querySelector('.vw-btns'); if (bt) bt.style.display = 'none';
    el.querySelectorAll('.vw-step').forEach(function (s) { s.style.display = 'none'; });
    var old = el.querySelector('.vw-paper'); if (old) old.remove();
    var h = '<div class="vw-paper">';
    if (o.labels !== false) B.steps.forEach(function (s) { h += '<div class="pp-step"><b>Step ' + s.n + ': ' + s.title + '.</b> ' + s.expl.replace(/<[^>]+>/g, '') + '</div><div class="pp-space"></div>'; });
    else h += '<div class="pp-space" style="height:' + (o.space || (0.55 + 0.45 * B.steps.length)).toFixed(2) + 'in"></div>';
    var ans = answerOf(B), wide = /solution|works/i.test(ans) || !B.solve;
    h += '<div class="pp-ans"><b>' + (o.ansLabel || 'Answer:') + '</b> <span class="pp-line' + (wide ? ' wide' : '') + '">' + (o.key ? ans : '&nbsp;') + '</span></div></div>';
    el.querySelector('.vw-box').insertAdjacentHTML('beforeend', h);
  }

  function drawAll(scope) {
    if (!document.getElementById('vw-style')) { var s = document.createElement('style'); s.id = 'vw-style'; s.textContent = CSS; document.head.appendChild(s); }
    (scope || document).querySelectorAll('.vw[data-vw]').forEach(render);
    (scope || document).querySelectorAll('.vw-after[data-after]').forEach(afterWrap);
  }
  var api = { drawAll: drawAll, build: build, parse: parse, relayout: relayout, paper: paper, answerOf: answerOf };
  root.VWORK = api;
  if (typeof document !== 'undefined' && document.querySelectorAll) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { drawAll(document); }); else drawAll(document);
  }
})(this);
