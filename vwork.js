/* vwork.js — vertical, step-by-step equation work (Mr. Allen's Math Class).

   <div class="vw" data-vw='{"eq":"2(2x + 3) = -6"}'></div>   → drawn on load (window.VWORK.drawAll()).

   The work is COMPUTED from the equation, so every number in every step is right.
   One line per step, equals signs lined up:
     • red row under the equation = what we do to BOTH sides
     • red slash = terms that cancel (crossed out)
     • blue arrows + blue terms = distributing
     • purple / orange underline = like terms being combined (x terms / numbers)
     • green box = the answer
   Options: eq (equation or inequality: =, <, >, <=, >=, ≤, ≥; or just an expression to simplify),
            side:"L"|"R" (where the x's are collected; default L), labels:{n:"text"} (replace step n's label),
            mode:"step" (default: Next step / Show all buttons) | "all" (everything shown, no buttons),
            note:"text" (small grey line under the work), num:"…" (number formatting: "dec" or "frac").
   <div class="vw-after" data-after="pA1"> … </div>  → hidden until item pA1 has been checked, then a
   "Show the steps" button opens it. ?key=1 in the page address (answer-key printing) shows everything. */
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

  /* ---------- term display ---------- */
  var REL = { '=': '=', '<': '&lt;', '>': '&gt;', '<=': '≤', '>=': '≥' };
  var FLIP = { '=': '=', '<': '>', '>': '<', '<=': '>=', '>=': '<=' };
  function signPart(k, first) { return first ? (k.n < 0 ? MINUS : '') : (k.n < 0 ? MINUS + ' ' : '+ '); }
  function abs(k) { return F(Math.abs(k.n), k.d); }
  function cid() { return 'v' + Math.random().toString(36).slice(2, 9); }
  // returns {html, ids:{coef, den, whole}}
  function termHTML(tm, first, v, cls) {
    var ids = { whole: cid() }, h;
    if (tm.t === 'c') h = signPart(tm.k, first) + num(abs(tm.k));
    else if (tm.t === 'x') {
      var a = abs(tm.k), sp = signPart(tm.k, first);
      if (tm.dv) { ids.den = cid(); h = sp + '<span class="vw-fr"><span>' + (a.n === 1 ? v : a.n + v) + '</span><span id="' + ids.den + '">' + tm.dv + '</span></span>'; }
      else if (eq(a, ONE)) h = sp + v;
      else { ids.coef = cid(); h = '<span id="' + ids.coef + '">' + sp + num(a) + '</span>' + v; }
    } else { // group
      ids.f = cid(); ids.in = [];
      var fa = abs(tm.f), fs = signPart(tm.f, first), ft = tm.bare && eq(fa, ONE) ? fs.trim() : fs + num(fa);
      h = '<span id="' + ids.f + '" class="vw-fac">' + ft + '</span>(';
      tm.inner.forEach(function (it, j) { var r = termHTML(it, j === 0, v); ids.in.push(r.ids.whole); h += (j ? ' ' : '') + r.html; });
      h += ')';
    }
    return { html: '<span id="' + ids.whole + '"' + (cls ? ' class="' + cls + '"' : '') + '>' + h + '</span>', ids: ids };
  }
  function termText(tm, first, v) { return termHTML(tm, first, v).html.replace(/<[^>]+>/g, ''); }
  function xTxt(k, v) { var a = abs(k); return (k.n < 0 ? MINUS : '') + (eq(a, ONE) ? '' : num(a)) + v; }

  /* ---------- the solver: builds rows ---------- */
  function build(spec) {
    var P = parse(spec.eq), v = P.v, rel = P.rel, rows = [], step = 0, labels = spec.labels || {};
    var L = P.L, R = P.R || null, marks = []; // marks: {step, type:'x'|'ux'|'uc'|'arrow', ids}
    function lab(t) { rows.push({ kind: 'label', step: step, n: step, text: labels[step] || t }); }
    function eqRow(Lt, Rt, r, o) {
      o = o || {}; var row = { kind: 'eq', step: o.step === undefined ? step : o.step, L: [], R: [], rel: r, cls: o.cls || '', relCls: o.relCls || '' };
      (Lt.length ? Lt : [{ t: 'c', k: ZERO }]).forEach(function (tm, j) { var c = (o.col && o.col(tm, 'L')) || ''; var h = termHTML(tm, j === 0, v, c); row.L.push({ html: h.html, ids: h.ids, tm: tm }); });
      if (Rt) (Rt.length ? Rt : [{ t: 'c', k: ZERO }]).forEach(function (tm, j) { var c = (o.col && o.col(tm, 'R')) || ''; var h = termHTML(tm, j === 0, v, c); row.R.push({ html: h.html, ids: h.ids, tm: tm }); });
      rows.push(row); return row;
    }
    var cur = eqRow(L, R, rel, { step: 0 });
    var hasG = function (s) { return s && s.some(function (t) { return t.t === 'g'; }); };

    // 1) distribute
    if (hasG(L) || hasG(R)) {
      step++;
      var gs = [].concat(L, R || []).filter(function (t) { return t.t === 'g'; });
      lab(gs.length === 1 ? 'Distribute: multiply ' + (gs[0].bare ? (gs[0].f.n < 0 ? 'the ' + MINUS + ' sign (' + MINUS + '1)' : '1') : num(gs[0].f, true)) + ' by EACH term inside the ( )' : 'Distribute: multiply the number outside by EACH term inside the ( )');
      [cur.L, cur.R || []].forEach(function (cells) { cells.forEach(function (c) { if (c.tm.t === 'g') marks.push({ step: step, type: 'arrow', from: c.ids.f, to: c.ids.in }); }); });
      var exp = function (s) { var o = []; (s || []).forEach(function (t) { if (t.t === 'g') t.inner.forEach(function (it) { var z = { t: it.t, k: mul(t.f, it.k), dv: null, dist: 1 }; if (it.t === 'x' && it.dv && eq(abs(t.f), ONE)) z.dv = it.dv; o.push(z); }); else o.push(t); }); return o; };
      L = exp(L); R = R ? exp(R) : null;
      cur = eqRow(L, R, rel, { col: function (tm) { return tm.dist ? 'vw-blue' : ''; } });
      L.forEach(function (t) { delete t.dist; }); if (R) R.forEach(function (t) { delete t.dist; });
    }
    // 2) combine like terms
    function needs(s) { if (!s) return false; var nx = 0, nc = 0; s.forEach(function (t) { if (t.t === 'x') nx++; else nc++; }); return nx > 1 || nc > 1; }
    function comb(s) { var kx = null, kc = null, firstX = null; s.forEach(function (t, j) { if (t.t === 'x') { kx = kx ? add(kx, t.k) : t.k; if (firstX === null) firstX = j; } else kc = kc ? add(kc, t.k) : t.k; });
      var o = []; var xFirst = firstX === 0 || firstX === null || true; if (kx && !isZ(kx)) o.push({ t: 'x', k: kx, cx: 1 }); if (kc && !isZ(kc)) o.push({ t: 'c', k: kc, cc: 1 }); return o; }
    if (needs(L) || needs(R)) {
      step++;
      var parts = [];
      [[L, cur.L], [R, cur.R]].forEach(function (pr) {
        if (!pr[0] || !needs(pr[0])) return;
        var xs = pr[0].filter(function (t) { return t.t === 'x'; }), cs = pr[0].filter(function (t) { return t.t === 'c'; });
        if (xs.length > 1) { var s = xs.reduce(function (a, t) { return add(a, t.k); }, ZERO); parts.push(xs.map(function (t, j) { return termText(t, j === 0, v); }).join(' ') + ' = ' + (isZ(s) ? '0' : xTxt(s, v))); }
        if (cs.length > 1) { var s2 = cs.reduce(function (a, t) { return add(a, t.k); }, ZERO); parts.push(cs.map(function (t, j) { return termText(t, j === 0, v); }).join(' ') + ' = ' + num(s2, true)); }
        pr[1].forEach(function (c) { if (c.tm.t === 'x' && xs.length > 1) marks.push({ step: step, type: 'ux', id: c.ids.whole }); if (c.tm.t === 'c' && cs.length > 1) marks.push({ step: step, type: 'uc', id: c.ids.whole }); });
      });
      lab('Combine like terms: ' + parts.join(' and '));
      if (needs(L)) L = comb(L); if (R && needs(R)) R = comb(R);
      cur = eqRow(L, R, rel, { col: function (tm) { return tm.cx ? 'vw-purple' : tm.cc ? 'vw-orange' : ''; } });
      L.forEach(function (t) { delete t.cx; delete t.cc; }); if (R) R.forEach(function (t) { delete t.cx; delete t.cc; });
    }
    if (!R) { cur.cls = 'vw-ans'; return { rows: rows, marks: marks, steps: step }; }
    // the x's cancelled while combining (e.g. 2x − 2x + 8 = 8): nothing left to solve
    var hasX = function (s) { return s.some(function (t) { return t.t === 'x'; }); };
    if (!hasX(L) && !hasX(R)) {
      var cs = function (s) { return s.filter(function (t) { return t.t === 'c'; }).reduce(function (a, t) { return add(a, t.k); }, ZERO); };
      var a0 = val(cs(L)), b0 = val(cs(R)), ok0 = rel === '=' ? a0 === b0 : rel === '<' ? a0 < b0 : rel === '>' ? a0 > b0 : rel === '<=' ? a0 <= b0 : a0 >= b0;
      rows.push({ kind: 'verdict', step: step, ok: ok0, text: 'The ' + v + '’s are gone. ' + num(cs(L), true) + ' ' + REL[rel] + ' ' + num(cs(R), true) + ' is <b>' + (ok0 ? 'TRUE' : 'FALSE') + '</b> → ' + (ok0 ? (rel === '=' ? '<b>Infinitely many solutions</b> (every number works)' : '<b>Every number works</b>') : '<b>No solution</b>') });
      return { rows: rows, marks: marks, steps: step };
    }

    var xi = function (s) { for (var j = 0; j < s.length; j++) if (s[j].t === 'x') return j; return -1; };
    var ci = function (s) { for (var j = 0; j < s.length; j++) if (s[j].t === 'c') return j; return -1; };
    var T = 'L';   // x's always collect on the LEFT (teacher's rule)
    if (xi(L) < 0 && xi(R) >= 0) T = 'R'; if (xi(R) < 0 && xi(L) >= 0) T = 'L';
    function sides() { return T === 'L' ? { t: L, o: R, tc: cur.L, oc: cur.R } : { t: R, o: L, tc: cur.R, oc: cur.L }; }
    function setS(t, o) { if (T === 'L') { L = t; R = o; } else { R = t; L = o; } }
    function opRow(tIdx, oIdx, txt) { // op cells placed under term index of the row above
      var r = { kind: 'op', step: step, L: [], R: [], ref: cur }, a = cur;
      var tPos = { i: tIdx, n: (T === 'L' ? a.L : a.R).length, html: txt, id: cid() }, oPos = { i: oIdx, n: (T === 'L' ? a.R : a.L).length, html: txt, id: cid() };
      if (T === 'L') { r.L.push(tPos); r.R.push(oPos); } else { r.R.push(tPos); r.L.push(oPos); }
      rows.push(r); return { t: tPos.id, o: oPos.id };
    }
    function verdict(tConst, oConst) {
      var a = val(tConst), b = val(oConst), lhs = T === 'L' ? a : b, rhs = T === 'L' ? b : a, ok;
      ok = rel === '=' ? lhs === rhs : rel === '<' ? lhs < rhs : rel === '>' ? lhs > rhs : rel === '<=' ? lhs <= rhs : lhs >= rhs;
      var stmt = num(T === 'L' ? tConst : oConst, true) + ' ' + REL[rel] + ' ' + num(T === 'L' ? oConst : tConst, true);
      rows.push({ kind: 'verdict', step: step, ok: ok, text: 'The ' + v + '’s are gone. ' + stmt + ' is <b>' + (ok ? 'TRUE' : 'FALSE') + '</b> → ' + (ok ? (rel === '=' ? '<b>Infinitely many solutions</b> (every number works)' : '<b>Every number works</b>') : '<b>No solution</b>') });
    }
    // 3) x's on both sides → collect on side T
    var S = sides();
    if (xi(S.o) >= 0) {
      step++;
      var d = S.o[xi(S.o)].k, opTxt = (d.n > 0 ? MINUS + ' ' : '+ ') + num(abs(d)) + (eq(abs(d), ONE) ? '' : '') + v;
      opTxt = (d.n > 0 ? MINUS : '+') + ' ' + (eq(abs(d), ONE) ? '' : num(abs(d))) + v;
      lab((d.n > 0 ? 'Subtract ' : 'Add ') + (eq(abs(d), ONE) ? '' : num(abs(d))) + v + (d.n > 0 ? ' from' : ' to') + ' both sides (moves the ' + v + '’s to the LEFT side)');
      var ti = xi(S.t), oi = xi(S.o);
      var ids = opRow(ti >= 0 ? ti : 0, oi, opTxt);
      marks.push({ step: step, type: 'x', id: S.oc[oi].ids.whole }); marks.push({ step: step, type: 'x', id: ids.o });
      var newK = ti >= 0 ? sub(S.t[ti].k, d) : neg(d);
      var nt = S.t.slice(), no = S.o.filter(function (t, j) { return j !== oi; });
      if (isZ(newK)) { if (ti >= 0) { marks.push({ step: step, type: 'x', id: S.tc[ti].ids.whole }); marks.push({ step: step, type: 'x', id: ids.t }); nt.splice(ti, 1); } }
      else if (ti >= 0) nt[ti] = { t: 'x', k: newK }; else nt.unshift({ t: 'x', k: newK });
      setS(nt, no); cur = eqRow(L, R, rel); S = sides();
      if (isZ(newK)) {
        var tc = S.t.filter(function (t) { return t.t === 'c'; }).reduce(function (a, t) { return add(a, t.k); }, ZERO);
        var oc = S.o.filter(function (t) { return t.t === 'c'; }).reduce(function (a, t) { return add(a, t.k); }, ZERO);
        verdict(tc, oc); return { rows: rows, marks: marks, steps: step };
      }
    }
    // 4) number on the x side → move it
    S = sides();
    if (ci(S.t) >= 0) {
      step++;
      var c = S.t[ci(S.t)].k, ot = (c.n > 0 ? MINUS : '+') + ' ' + num(abs(c));
      lab((c.n > 0 ? 'Subtract ' : 'Add ') + num(abs(c)) + (c.n > 0 ? ' from' : ' to') + ' both sides (undo the ' + (c.n > 0 ? '+ ' : MINUS + ' ') + num(abs(c)) + ')');
      var tci = ci(S.t), oci = ci(S.o);
      var ids2 = opRow(tci, oci >= 0 ? oci : S.o.length - 1, ot);
      marks.push({ step: step, type: 'x', id: S.tc[tci].ids.whole }); marks.push({ step: step, type: 'x', id: ids2.t });
      var oconst = oci >= 0 ? S.o[oci].k : ZERO, nk = sub(oconst, c);
      setS(S.t.filter(function (t, j) { return j !== tci; }), [{ t: 'c', k: nk }]); cur = eqRow(L, R, rel); S = sides();
    }
    // 5) coefficient
    S = sides();
    var xt = S.t[xi(S.t)], k = xt.k, rhs = S.o.length ? S.o[0].k : ZERO, flip = false;
    if (!eq(k, ONE)) {
      step++;
      var neg1 = k.n < 0;
      if (xt.dv && k.n === 1 && k.d === xt.dv) { // x/4 → multiply by 4
        lab('Multiply both sides by ' + xt.dv + ' (undo the ÷ ' + xt.dv + ')');
        var ids3 = opRow(xi(S.t), 0, '× ' + xt.dv);
        var xc = S.tc[xi(S.t)]; if (xc.ids.den) marks.push({ step: step, type: 'x', id: xc.ids.den }); marks.push({ step: step, type: 'x', id: ids3.t });
      } else {
        flip = rel !== '=' && neg1;
        lab('Divide both sides by ' + num(k, true) + (flip ? ' — it is NEGATIVE, so FLIP the sign!' : ''));
        var drow = { kind: 'div', step: step, ref: cur, d: num(k, true), idT: cid(), idO: cid(), T: T };
        rows.push(drow);
        var xc2 = S.tc[xi(S.t)]; if (xc2.ids.coef) { marks.push({ step: step, type: 'x', id: xc2.ids.coef }); marks.push({ step: step, type: 'x', id: drow.idT }); }
      }
      var res = div(rhs, k), r2 = flip ? FLIP[rel] : rel;
      setS([{ t: 'x', k: ONE }], [{ t: 'c', k: res }]); rel = r2;
      cur = eqRow(L, R, rel, { relCls: flip ? 'vw-flip' : '' });
    }
    if (T === 'R') { // read it with x first:  -3 = x  →  x = -3
      step++; lab('Read it with ' + v + ' first');
      var cv = (L[0] && L[0].t === 'c') ? L[0].k : ZERO;
      L = [{ t: 'x', k: ONE }]; R = [{ t: 'c', k: cv }]; rel = FLIP[rel];
      cur = eqRow(L, R, rel);
    }
    cur.cls = 'vw-ans';
    var last = cur.R[0] && cur.R[0].tm.k;
    if (last && !terminating(last.d)) rows.push({ kind: 'note', step: step, text: '≈ ' + approx(last) });
    return { rows: rows, marks: marks, steps: step };
  }

  /* ---------- layout ---------- */
  var CSS = '.vw{margin:10px 0 14px;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif}' +
    '.vw-box{position:relative;display:block;width:min(100%,460px);box-sizing:border-box;overflow-x:auto;background:#fff;border:1.5px solid #D7DCE6;border-radius:10px;padding:10px 14px 8px}' +
    '.vw-g{position:relative;display:grid;column-gap:0;align-items:center;font-size:1.18rem;font-weight:600;color:#1E2D4F;font-variant-numeric:tabular-nums}' +
    '.vw-c{text-align:center;white-space:nowrap;padding:3px .22em;line-height:1.35}' +
    '.vw-c.vw-arc{padding-top:22px}.vw-rel{padding:3px .25em}' +
    '.vw-op{color:#B42318;font-size:1.02rem;padding:0 .22em 3px;border-bottom:2px solid #9AA3B5}' +
    '.vw-lab{grid-column:1/-1;text-align:left;font-size:.84rem;font-weight:700;color:#0056B3;padding:10px 0 3px;white-space:normal;max-width:30em}' +
    '.vw-lab i{display:inline-block;min-width:1.45em;height:1.45em;line-height:1.45em;border-radius:50%;background:#0056B3;color:#fff;font-style:normal;text-align:center;margin-right:.4em;font-size:.8rem}' +
    '.vw-div{border-top:2.5px solid #1E2D4F;color:#B42318;text-align:center;padding:1px 0 2px;font-size:1.05rem}' +
    '.vw-fr{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;font-size:.9em;line-height:1.1;margin:0 .08em}' +
    '.vw-fr>span:first-child{border-bottom:2px solid currentColor;padding:0 .15em}' +
    '.vw-x{position:relative;display:inline-block}' +
    '.vw-x.on::after{content:"";position:absolute;left:-3px;right:-3px;top:50%;border-top:2.6px solid #B42318;transform:rotate(-24deg)}' +
    '.vw-ux.on{text-decoration:underline;text-decoration-color:#6D28D9;text-decoration-thickness:3px;text-underline-offset:5px}' +
    '.vw-uc.on{text-decoration:underline;text-decoration-color:#B45309;text-decoration-thickness:3px;text-underline-offset:5px}' +
    '.vw-blue{color:#0056B3}.vw-purple{color:#6D28D9}.vw-orange{color:#B45309}.vw-flip{color:#B42318;font-weight:800}' +
    '.vw-ansc{background:#ECFDF3;border-top:2.5px solid #15803D;border-bottom:2.5px solid #15803D;color:#14532D}' +
    '.vw-ansc.vw-first{border-left:2.5px solid #15803D;border-radius:8px 0 0 8px;padding-left:.35em}.vw-ansc.vw-last{border-right:2.5px solid #15803D;border-radius:0 8px 8px 0;padding-right:.35em}' +
    '.vw-ver{grid-column:1/-1;text-align:left;font-size:.95rem;font-weight:600;padding:8px 10px;margin-top:6px;border-radius:8px;white-space:normal;max-width:30em}' +
    '.vw-ver.ok{background:#ECFDF3;color:#14532D;border:2px solid #15803D}.vw-ver.no{background:#FEF2F2;color:#7F1D1D;border:2px solid #B42318}' +
    '.vw-note{grid-column:1/-1;text-align:center;font-size:.85rem;color:#6B7488;padding-top:4px}' +
    '.vw-svg{position:absolute;left:0;top:0;pointer-events:none;overflow:visible}' +
    '.vw-btns{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}' +
    '.vw-btns button{font:600 .85rem Inter,system-ui,sans-serif;padding:7px 13px;border-radius:7px;border:1.5px solid #0056B3;background:#0056B3;color:#fff;cursor:pointer}' +
    '.vw-btns button.vw-sec{background:#fff;color:#0056B3}.vw-btns button:disabled{opacity:.55;cursor:default}' +
    '.vw-cap{font-size:.82rem;color:#6B7488;margin-top:4px}' +
    '.vw-after{display:none}.vw-after.ready{display:block}.vw-after .vw-afterbody{display:none}.vw-after.open .vw-afterbody{display:block}' +
    '.vw-show{font:600 .85rem Inter,system-ui,sans-serif;padding:7px 13px;border-radius:7px;border:1.5px solid #15803D;background:#fff;color:#15803D;cursor:pointer;margin-top:6px}' +
    '.vw-after.open .vw-show{display:none}' +
    '.pp-step{font-size:.9rem;font-weight:600;color:#1E2D4F;margin-top:10px;padding-top:6px;border-top:1px dashed #C9D0DD}.pp-step b{color:#0056B3}' +
    '.pp-space{height:.82in}' +
    '.pp-ans{margin-top:10px;font-size:1rem;color:#1E2D4F;font-weight:600}.pp-line{display:inline-block;min-width:1.6in;border-bottom:2px solid #1E2D4F;padding:0 6px;color:#15803D;font-weight:700}.pp-line.wide{min-width:2.6in}' +
    '@media print{.vw-btns,.vw-show{display:none!important}.vw-box{border-color:#bbb}}';

  function render(el) {
    var spec; try { spec = JSON.parse(el.getAttribute('data-vw')); } catch (e) { return; }
    var B = build(spec), rows = B.rows, NL = 1, NR = 1;
    rows.forEach(function (r) { if (r.kind === 'eq') { NL = Math.max(NL, r.L.length); NR = Math.max(NR, r.R.length); } });
    var col = { L: function (i, n) { return NL - n + i + 2; }, R: function (i) { return NL + 3 + i; } };  // column 1 and the last column are flexible gutters
    var h = '', gr = 0, arcRows = {};
    B.marks.forEach(function (m) { if (m.type === 'arrow') arcRows[m.from] = 1; });
    rows.forEach(function (r) {
      gr++; var S = ' data-s="' + r.step + '" style="grid-row:' + gr;
      if (r.kind === 'label') { h += '<div class="vw-c vw-lab"' + S + '"><i>' + r.n + '</i>' + r.text + '</div>'; return; }
      if (r.kind === 'verdict') { h += '<div class="vw-c vw-ver ' + (r.ok ? 'ok' : 'no') + '"' + S + '">' + r.text + '</div>'; return; }
      if (r.kind === 'note') { h += '<div class="vw-c vw-note"' + S + '">' + r.text + '</div>'; return; }
      if (r.kind === 'eq') {
        var arc = r.L.concat(r.R).some(function (c) { return c.ids.f && arcRows[c.ids.f]; });
        var ans = r.cls === 'vw-ans', all = [];
        r.L.forEach(function (c, i) { all.push([col.L(i, r.L.length), c.html]); });
        if (r.rel) all.push([NL + 2, '<span class="' + (r.relCls || '') + '">' + REL[r.rel] + '</span>', 1]);
        r.R.forEach(function (c, i) { all.push([col.R(i), c.html]); });
        all.forEach(function (a, j) { h += '<div class="vw-c' + (a[2] ? ' vw-rel' : '') + (arc ? ' vw-arc' : '') + (ans ? ' vw-ansc' + (j === 0 ? ' vw-first' : '') + (j === all.length - 1 ? ' vw-last' : '') : '') + '"' + S + ';grid-column:' + a[0] + '">' + a[1] + '</div>'; });
        // answer box spans full width when the row has empty columns
        return;
      }
      if (r.kind === 'op') {
        var put = function (side, p) { var c = side === 'L' ? col.L(p.i, p.n) : col.R(p.i); h += '<div class="vw-c vw-op"' + S + ';grid-column:' + c + '"><span class="vw-x" id="' + p.id + '">' + p.html + '</span></div>'; };
        // underline the whole op row: fill empty columns too
        var used = {};
        r.L.forEach(function (p) { put('L', p); used[col.L(p.i, p.n)] = 1; }); r.R.forEach(function (p) { put('R', p); used[col.R(p.i)] = 1; });
        for (var c = 2; c <= NL + 2 + NR; c++) if (!used[c]) h += '<div class="vw-c vw-op"' + S + ';grid-column:' + c + '">&nbsp;</div>';
        return;
      }
      if (r.kind === 'div') {
        var a = r.ref, lA = col.L(0, a.L.length), lB = NL + 2, rA = NL + 3, rB = NL + 3 + a.R.length;
        var tId = r.T === 'L' ? r.idT : r.idO, oId = r.T === 'L' ? r.idO : r.idT;
        h += '<div class="vw-c vw-div"' + S + ';grid-column:' + lA + '/' + lB + '"><span class="vw-x" id="' + tId + '">' + r.d + '</span></div>';
        h += '<div class="vw-c vw-div"' + S + ';grid-column:' + rA + '/' + rB + '"><span class="vw-x" id="' + oId + '">' + r.d + '</span></div>';
      }
    });
    var key = /[?&]key=1/.test(location.search), mode = key ? 'all' : (spec.mode || 'step');
    el.innerHTML = '<div class="vw-box"><div class="vw-g" style="grid-template-columns:minmax(0,1fr) repeat(' + NL + ',auto) auto repeat(' + NR + ',auto) minmax(0,1fr)">' + h + '<svg class="vw-svg" aria-hidden="true"></svg></div></div>' +
      (spec.note ? '<div class="vw-cap">' + spec.note + '</div>' : '') +
      (mode === 'step' && B.steps ? '<div class="vw-btns"><button type="button" class="vw-next">Next step ▸</button><button type="button" class="vw-sec vw-all">Show all steps</button></div>' : '');
    el.setAttribute('role', 'group'); el.setAttribute('aria-label', 'Step by step work for ' + spec.eq);
    // marks → classes on target spans
    B.marks.forEach(function (m) {
      if (m.type === 'arrow') return; var t = el.querySelector('#' + (m.id)); if (!t) return;
      t.classList.add(m.type === 'x' ? 'vw-x' : m.type === 'ux' ? 'vw-ux' : 'vw-uc'); t.setAttribute('data-ms', m.step);
    });
    var st = { cur: mode === 'all' ? B.steps : 0, max: B.steps, marks: B.marks };
    el._vw = st;
    function show() {
      el.querySelectorAll('[data-s]').forEach(function (c) { c.style.display = +c.getAttribute('data-s') <= st.cur ? '' : 'none'; });
      el.querySelectorAll('[data-ms]').forEach(function (c) { c.classList.toggle('on', +c.getAttribute('data-ms') <= st.cur); });
      var nb = el.querySelector('.vw-next'), ab = el.querySelector('.vw-all');
      if (nb) { nb.disabled = st.cur >= st.max; nb.textContent = st.cur >= st.max ? '✓ All steps shown' : 'Next step ▸ (' + (st.cur + 1) + ' of ' + st.max + ')'; }
      if (ab) ab.style.display = st.cur >= st.max ? 'none' : '';
      arrows();
    }
    function arrows() {
      var g = el.querySelector('.vw-g'), svg = el.querySelector('.vw-svg'); if (!g || !svg) return;
      var gb = g.getBoundingClientRect(), out = '';
      svg.setAttribute('width', gb.width); svg.setAttribute('height', gb.height);
      st.marks.forEach(function (m) {
        if (m.type !== 'arrow' || m.step > st.cur) return;
        var f = el.querySelector('#' + m.from); if (!f || !f.offsetParent) return;
        var fb = f.getBoundingClientRect(), x0 = fb.left + fb.width / 2 - gb.left, y0 = fb.top - gb.top + 2;
        m.to.forEach(function (id) {
          var t = el.querySelector('#' + id); if (!t) return;
          var tb = t.getBoundingClientRect(), x1 = tb.left + tb.width / 2 - gb.left + (tb.width > 30 ? 4 : 0), y1 = tb.top - gb.top + 3;
          var hgt = 9 + Math.min(14, Math.abs(x1 - x0) * 0.16), mx = (x0 + x1) / 2, my = Math.min(y0, y1) - hgt * 2 + 6;
          out += '<path d="M' + x0.toFixed(1) + ',' + y0.toFixed(1) + ' Q' + mx.toFixed(1) + ',' + my.toFixed(1) + ' ' + x1.toFixed(1) + ',' + (y1 - 2).toFixed(1) + '" fill="none" stroke="#0056B3" stroke-width="2.2" stroke-linecap="round"/>';
          var ang = Math.atan2((y1 - 2) - my, x1 - mx), a1 = ang + 2.6, a2 = ang - 2.6;
          out += '<path d="M' + x1.toFixed(1) + ',' + (y1 - 2).toFixed(1) + ' L' + (x1 + 7 * Math.cos(a1)).toFixed(1) + ',' + (y1 - 2 + 7 * Math.sin(a1)).toFixed(1) + ' M' + x1.toFixed(1) + ',' + (y1 - 2).toFixed(1) + ' L' + (x1 + 7 * Math.cos(a2)).toFixed(1) + ',' + (y1 - 2 + 7 * Math.sin(a2)).toFixed(1) + '" fill="none" stroke="#0056B3" stroke-width="2.2" stroke-linecap="round"/>';
        });
      });
      svg.innerHTML = out;
    }
    el._vwShow = show; el._vwB = B; el._vwSpec = spec;
    var nb = el.querySelector('.vw-next'), ab = el.querySelector('.vw-all');
    if (nb) nb.onclick = function () { if (st.cur < st.max) { st.cur++; show(); } };
    if (ab) ab.onclick = function () { st.cur = st.max; show(); };
    show();
  }
  function relayout() { document.querySelectorAll('.vw').forEach(function (el) { if (el._vwShow) el._vwShow(); }); }

  function afterWrap(w) {
    var q = w.getAttribute('data-after'), key = /[?&]key=1/.test(location.search);
    if (!w.querySelector('.vw-afterbody')) { var body = document.createElement('div'); body.className = 'vw-afterbody'; while (w.firstChild) body.appendChild(w.firstChild); w.appendChild(body);
      var b = document.createElement('button'); b.type = 'button'; b.className = 'vw-show'; b.textContent = 'Show the steps ▸'; w.insertBefore(b, body);
      b.onclick = function () { w.classList.add('open'); relayout(); }; }
    function ready() { w.classList.add('ready'); }
    if (key) { w.classList.add('ready', 'open'); return; }
    var fb = document.getElementById('fb-' + q), box = document.getElementById(q);
    var test = function () { return (fb && /\bshow\b/.test(fb.className)) || (box && box.classList.contains('answered')); };
    if (test()) ready();
    var obs = new MutationObserver(function () { if (test()) { ready(); obs.disconnect(); } });
    if (fb) obs.observe(fb, { attributes: true, attributeFilter: ['class'] });
    if (box) obs.observe(box, { attributes: true, attributeFilter: ['class'] });
  }

  function drawAll(scope) {
    if (!document.getElementById('vw-style')) { var s = document.createElement('style'); s.id = 'vw-style'; s.textContent = CSS; document.head.appendChild(s); }
    (scope || document).querySelectorAll('.vw[data-vw]').forEach(render);
    (scope || document).querySelectorAll('.vw-after[data-after]').forEach(afterWrap);
  }
  /* ---------- paper version (for printing): start line, then Step 1, Step 2 … with room to write ---------- */
  function answerOf(B) {
    var v = null;
    B.rows.forEach(function (r) { if (r.kind === 'verdict') v = r.ok ? (r.text.indexOf('Infinitely') >= 0 ? 'Infinitely many solutions' : 'Every number works') : 'No solution'; });
    if (v) return v;
    var a = null; B.rows.forEach(function (r) { if (r.kind === 'eq' && r.cls === 'vw-ans') a = r; });
    if (!a) return '';
    return a.L.map(function (c) { return c.html; }).join(' ') + (a.rel ? ' ' + REL[a.rel] + ' ' : '') + a.R.map(function (c) { return c.html; }).join(' ');
  }
  function paper(el, o) {
    o = o || {}; var st = el._vw, B = el._vwB; if (!st || !B) return;
    st.cur = 0; el._vwShow();
    var bt = el.querySelector('.vw-btns'); if (bt) bt.style.display = 'none';
    var old = el.querySelector('.vw-paper'); if (old) old.remove();
    var h = '<div class="vw-paper">';
    if (o.labels !== false) B.rows.forEach(function (r) { if (r.kind === 'label') h += '<div class="pp-step"><b>Step ' + r.n + ':</b> ' + r.text + '</div><div class="pp-space"></div>'; });
    else h += '<div class="pp-space" style="height:' + (o.space || (0.55 + 0.42 * B.steps)).toFixed(2) + 'in"></div>';
    var ans = answerOf(B), wide = /solution|works/i.test(ans) || !B.rows.some(function (r) { return r.kind === 'eq' && r.R.length; });
    h += '<div class="pp-ans"><b>' + (o.ansLabel || 'Answer:') + '</b> <span class="pp-line' + (wide ? ' wide' : '') + '">' + (o.key ? ans : '&nbsp;') + '</span></div></div>';
    el.querySelector('.vw-box').insertAdjacentHTML('beforeend', h);
  }
  var api = { drawAll: drawAll, build: build, parse: parse, relayout: relayout, paper: paper, answerOf: answerOf };
  root.VWORK = api;
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { drawAll(document); }); else drawAll(document);
    var tm; window.addEventListener('resize', function () { clearTimeout(tm); tm = setTimeout(relayout, 120); });
    window.addEventListener('beforeprint', relayout);
    // re-draw arrows when a hidden area (details, tabs, reveal boxes) opens
    document.addEventListener('click', function () { setTimeout(relayout, 30); }, true);
  }
})(this);
