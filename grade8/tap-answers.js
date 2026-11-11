/* TAP ANSWERS (Nov 11, 2026). Mr. Allen's rule: "The answer should be a number or a multiple choice answer."
   Turns a typed answer into tap choices on the practice pages, pre-tests and notes. The page's own checker still grades:
   a tap puts the choice's text in the page's answer box and presses the page's own Check.

   TapAnswers.choices(ans, { q, key, choices })
       -> null       the answer is one number: keep the number box
       -> [strings]  tap choices, the right one included (order is fixed for each key, so a reload shows the same order)
       -> undefined  no rule fits: the page must list its own choices
     ans      the right answer as the page stores it (HTML is fine)
     q        the question's text (used to build wrong choices from common mistakes: adding instead of multiplying
              exponents, forgetting to flip an inequality, swapping slope and y-intercept, a sign error ...)
     key      any text that names the question (keeps the order steady)
     choices  the page's own list (right answer anywhere in it); used as written
   TapAnswers.mount(input, list, { onPick(text), fixed })  hides the box, shows the buttons, returns { lock(), mark(text, ok) }
   TapAnswers.plain(html)  the text a student would read */
(function () {
  "use strict";
  var SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUPMAP = { '⁻': '-' }; for (var si = 0; si < 10; si++) SUPMAP[SUPS.charAt(si)] = String(si);
  function sup(n) { n = String(n); var o = ''; for (var i = 0; i < n.length; i++) o += n.charAt(i) === '-' || n.charAt(i) === '−' ? '⁻' : SUPS.charAt(+n.charAt(i)); return o; }
  function unsup(s) { return s.replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, function (m) { return '^' + m.split('').map(function (c) { return SUPMAP[c]; }).join(''); }); }
  function plain(h) {
    var s = String(h == null ? '' : h);
    s = s.replace(/<span class="fr(?:ac)?"><span(?: class="num")?>(.*?)<\/span><span(?: class="den")?>(.*?)<\/span><\/span>/g, function (m, a, b) { return a + '/' + b; });
    s = s.replace(/<sup>\s*([−-]?\d+)\s*<\/sup>/g, function (m, n) { return sup(n); }).replace(/<[^>]+>/g, '');
    s = s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&le;/g, '≤').replace(/&ge;/g, '≥').replace(/&minus;/g, '−').replace(/&times;/g, '×').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&pi;/g, 'π');
    return s.replace(/\s+/g, ' ').trim();
  }
  function neg(t) { return String(t).replace(/-/g, '−'); }                    // show a real minus sign
  function asc(t) { return String(t).replace(/−/g, '-'); }
  var UNITS = '(?:\\s*(?:mm|cm|km|m|in|ft|yd|mi|units?|square units|inches|feet|meters|miles|degrees|dollars|cents|hours?|weeks?|days?|minutes?|months?|years?|gallons?|points?|tickets?|pounds?)\\.?[²³]?)?';
  var RE_NUM = new RegExp('^(?:[a-zA-Z∠][a-zA-Z0-9′]{0,3}\\s*=\\s*)?\\$?\\s*-?(?:\\d[\\d,]*(?:\\.\\d+)?|\\.\\d+)(?:\\s+\\d+/\\d+|/\\d+)?\\s*[%°]?' + UNITS + '$');
  function isNumber(t) { return RE_NUM.test(asc(t).trim()); }
  function h32(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function shuffle(a, key) { var s = h32(String(key)) || 1, r = function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function uniq(right, list, n) { var seen = {}, out = [right]; seen[right.replace(/\s+/g, '')] = 1;
    list.forEach(function (x) { if (x == null) return; var k = String(x).replace(/\s+/g, ''); if (!seen[k] && out.length < (n || 4)) { seen[k] = 1; out.push(String(x)); } }); return out; }

  /* ---------- word answers: fixed sets, shown in the same order every time ---------- */
  var SETS = [
    ['Yes', 'No'], ['True', 'False'], ['Rational', 'Irrational'], ['Linear', 'Nonlinear'], ['Function', 'Not a function'],
    ['One solution', 'No solution', 'Infinitely many solutions'], ['Positive', 'Negative', 'Zero', 'Undefined'],
    ['Natural', 'Whole', 'Integer', 'Rational', 'Irrational'], ['Congruent', 'Similar', 'Neither'],
    ['Translation', 'Reflection', 'Rotation', 'Dilation'], ['Increasing', 'Decreasing', 'Constant'],
    ['Addition', 'Subtraction', 'Multiplication', 'Division'], ['Enlargement', 'Reduction'], ['Cylinder', 'Cone', 'Sphere'],
    ['Complementary', 'Supplementary', 'Vertical'], ['Legs', 'Hypotenuse'], ['Add', 'Subtract', 'Multiply', 'Divide'],
    ['Slope', 'y-intercept'], ['Joint', 'Marginal'], ['Theorem', 'Converse'], ['Function A', 'Function B', 'They are the same']
  ];
  var ALIAS = { 'non-linear': 'nonlinear', 'not linear': 'nonlinear', 'infinitely many': 'infinitely many solutions', 'infinite': 'infinitely many solutions', 'infinite solutions': 'infinitely many solutions', 'no solutions': 'no solution', 'none': 'no solution', 'not a function': 'not a function', 'the slope': 'slope', 'integers': 'integer' };
  function wordSet(a, q) {
    var low = a.toLowerCase().replace(/[.!]$/, ''); low = ALIAS[low] || low;
    if ((low === 'positive' || low === 'negative') && /associat|correlat|scatter|trend/i.test(q || '')) return [['Positive', 'Negative', 'No association'], low === 'positive' ? 'Positive' : 'Negative'];
    for (var i = 0; i < SETS.length; i++) for (var j = 0; j < SETS[i].length; j++) if (SETS[i][j].toLowerCase() === low) return [SETS[i], SETS[i][j]];
    return null;
  }

  /* ---------- rules for written math answers ---------- */
  function ineq(a) {
    var m = asc(a).replace(/\s+/g, '').replace(/≤/g, '<=').replace(/≥/g, '>=').match(/^([a-z])(<=|>=|<|>)(-?[\d.\/]+)$/); if (!m) return null;
    var v = m[1], op = m[2], n = m[3], F = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' }, S = { '<': '<=', '>': '>=', '<=': '<', '>=': '>' }, D = { '<': '<', '>': '>', '<=': '≤', '>=': '≥' };
    var f = function (o, x) { return v + ' ' + D[o] + ' ' + neg(x); }, nn = n.charAt(0) === '-' ? n.slice(1) : '-' + n;
    return uniq(f(op, n), [f(F[op], n), f(S[op], n), /^-?0+$/.test(n) ? f(F[S[op]], n) : f(op, nn), f(F[S[op]], n)]);
  }
  function sci(a) {
    var m = unsup(asc(a)).replace(/\s+/g, '').match(/^(-?\d+(?:\.\d+)?)[×x*·]10\^?(-?\d+)(.*)$/); if (!m) return null;
    var c = m[1], n = +m[2], tail = m[3] ? ' ' + a.replace(/^.*[⁰¹²³⁴⁵⁶⁷⁸⁹\d]\s*/, '') : '', f = function (cc, e) { return neg(cc) + ' × 10' + sup(e) + tail; };
    if (m[3] && !/^[a-zA-Z³² ]+$/.test(m[3])) return null;
    var ten = String(Math.round(parseFloat(c) * 10 * 1e6) / 1e6);
    return uniq(f(c, n), [n ? f(c, -n) : f(c, 1), f(c, n > 0 ? n - 1 : n + 1), f(ten, n - 1), f(c, n + (n > 0 ? 1 : -1))]);
  }
  function pair(a, q) {
    var m = asc(a).replace(/\s+/g, '').match(/^\((-?[\d.\/]+),(-?[\d.\/]+)\)$/); if (!m) return null;
    var x = m[1], y = m[2], f = function (p, q2) { return '(' + neg(p) + ', ' + neg(q2) + ')'; }, N = function (t) { return /^-?0+$/.test(t) ? t : t.charAt(0) === '-' ? t.slice(1) : '-' + t; };
    var bump = function (t) { return isNaN(+t) ? t : String(+t + 1); }, r = function (v) { return Math.abs(v * 10 - Math.round(v * 10)) > 1e-9 ? 'x' : String(Math.round(v * 10) / 10); }, cand = [];
    var Q = asc(plain(q || '')), o = Q.replace(/\s+/g, '').match(/\((-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)\)/);
    if (o && !isNaN(+x) && !isNaN(+y)) { var a0 = +o[1], b0 = +o[2], X = +x, Y = +y;                // the moves students mix up
      if (/dilat|scale factor/i.test(Q) && a0 && b0) { var k = X / a0; cand.push(f(r(a0 + k), r(b0 + k)), f(r(a0 / k), r(b0 / k)), f(r(X), r(b0))); }
      else if (/translat|slide|left|right|\bup\b|\bdown\b|units/i.test(Q)) { var dx = X - a0, dy = Y - b0; cand.push(f(r(a0 - dx), r(b0 - dy)), f(r(a0 + dy), r(b0 + dx)), f(r(a0 + dx + dy), r(b0 + dx + dy))); }
      else [[a0, -b0], [-a0, b0], [-a0, -b0], [b0, a0], [-b0, a0], [b0, -a0], [a0, b0]].forEach(function (pt) { cand.push(f(r(pt[0]), r(pt[1]))); });
    }
    cand = cand.filter(function (c) { return c.indexOf('x') < 0; });                             // untidy decimals are not offered
    return uniq(f(x, y), cand.concat([f(y, x), f(N(x), y), f(x, N(y)), f(N(x), N(y)), f(bump(x), y), f(x, bump(y))]));
  }
  function linear(a) {
    var s = asc(a).replace(/\s+/g, ''), m = s.match(/^y=(.+)$/); if (!m) return null; var r = m[1], mm, b;
    var t = r.match(/^(-?(?:\d+(?:\.\d+)?|\(\d+\/\d+\)|\d+\/\d+)?)x(?:([+-])(\d+(?:\.\d+)?(?:\/\d+)?))?$/);
    if (t) { mm = t[1] === '' ? '1' : t[1] === '-' ? '-1' : t[1]; b = t[2] ? (t[2] === '-' ? '-' : '') + t[3] : '0'; }
    else { t = r.match(/^(-?\d+(?:\.\d+)?)([+-])((?:\d+(?:\.\d+)?|\(\d+\/\d+\)|\d+\/\d+)?)x$/); if (!t) return null; b = t[1]; mm = (t[2] === '-' ? '-' : '') + (t[3] === '' ? '1' : t[3]); }
    var N = function (v) { return v.charAt(0) === '-' ? v.slice(1) : '-' + v; }, z = function (v) { return /^-?0+$/.test(v); };
    var f = function (M, B) { var ms = M === '1' ? '' : M === '-1' ? '−' : neg(/\//.test(M) && M.charAt(0) !== '(' && M.charAt(0) !== '-' ? '(' + M + ')' : M.charAt(0) === '-' && /\//.test(M) && M.charAt(1) !== '(' ? '−(' + M.slice(1) + ')' : M);
      return 'y = ' + ms + 'x' + (z(B) ? '' : (B.charAt(0) === '-' ? ' − ' + B.slice(1) : ' + ' + B)); };
    var frac = /\//.test(mm) || /\./.test(mm), cand = [];
    if (!z(b) && b !== mm && !frac) cand.push(f(b, mm));
    cand.push(f(N(mm), b)); if (!z(b)) cand.push(f(mm, N(b))); else cand.push(f(mm, mm.replace('-', '') === '1' ? '1' : mm.replace(/[()\-]/g, '')));
    cand.push(f(N(mm), z(b) ? '1' : N(b)));
    if (!frac && Math.abs(+mm) > 1) cand.push(f((+mm < 0 ? '-' : '') + '1/' + Math.abs(+mm), b));
    return uniq(f(mm, b), cand);
  }
  function between(a) { var m = a.match(/^(\d+) and (\d+)$/); if (!m || +m[2] !== +m[1] + 1) return null; var x = +m[1];
    return [[(x - 1) + ' and ' + x, x + ' and ' + (x + 1), (x + 1) + ' and ' + (x + 2), (x * x) + ' and ' + ((x + 1) * (x + 1))], x + ' and ' + (x + 1)]; }
  function piAns(a, q) {
    var m = asc(a).replace(/,/g, '').match(/^(?:[A-Za-z]\s*=\s*)?(\d+(?:\.\d+)?)\s*π(.*)$/); if (!m) return null; var k = +m[1], tail = m[2] || '', f = function (v) { return k === Math.round(k) && v !== Math.round(v) ? null : (Math.round(v * 100) / 100) + 'π' + tail; }, cand = [];   // whole-number answers get whole-number choices
    var Q = asc(plain(q || '')), rm = Q.match(/\br\s*=\s*(\d+(?:\.\d+)?)|radius\s*(?:of|is|=)?\s*(\d+(?:\.\d+)?)/i), hm = Q.match(/\bh\s*=\s*(\d+(?:\.\d+)?)|height\s*(?:of|is|=)?\s*(\d+(?:\.\d+)?)/i), dm = Q.match(/\bd\s*=\s*(\d+(?:\.\d+)?)|diameter\s*(?:of|is|=)?\s*(\d+(?:\.\d+)?)/i);
    var r = rm ? +(rm[1] || rm[2]) : dm ? +(dm[1] || dm[2]) / 2 : 0, h = hm ? +(hm[1] || hm[2]) : 0;
    if (r && /sphere|ball/i.test(Q)) cand.push(f(4 * r * r / 3), f(r * r * r), f(4 * r * r * r), dm ? f(4 * 8 * r * r * r / 3) : f(2 * r * r * r / 3));      // squared, forgot 4/3, forgot ÷ 3, used the diameter
    else if (r && h && /cone/i.test(Q)) cand.push(f(r * r * h), f(r * h / 3), f(2 * r * h));                                                           // forgot 1/3, did not square
    else if (r && h) cand.push(f(r * h), f(r * r * h / 3), f(2 * r * h), dm ? f(4 * r * r * h) : f(r * r * h * 2));                                     // did not square, used the cone rule
    return uniq(f(k), cand.concat([k % 3 === 0 ? f(k / 3) : f(k * 3), f(k * 2), f(k * 4), k % 2 === 0 ? f(k / 2) : f(k * 6)]));
  }
  function order(a) { var t = a.split(/\s*,\s*/); if (t.length < 3 || t.length > 6 || t.some(function (x) { return !x || x.length > 14; })) return null;
    var j = function (x) { return x.join(',  '); }, sw = function (i, k) { var c = t.slice(); var u = c[i]; c[i] = c[k]; c[k] = u; return j(c); };
    return uniq(j(t), [j(t.slice().reverse()), sw(0, 1), sw(t.length - 2, t.length - 1), sw(1, 2)]); }
  /* monomials and powers: x⁷, 6x⁵, 1/x⁴, 8x⁴y⁵, 5⁷, 4/x⁶. Wrong choices use the numbers in the question the way students
     misuse them (multiply the exponents instead of adding, add the coefficients instead of multiplying, forget to flip ...) */
  function mono(a, q) {
    if (/[a-z]{3,}/i.test(asc(a)) || /\s[a-z]{2,}/i.test(a)) return null;                       // a word, not a monomial
    var s = unsup(asc(a)).replace(/\s+/g, '').replace(/[·*]/g, ''); if (!/^[-\d\/a-z^().]+$/.test(s) || !/\^|[a-z]/.test(s) || /=|sqrt|π/.test(s)) return null;
    var parts = s.split('/'); if (parts.length > 2) return null;
    function side(t) { t = t.replace(/^\((.*)\)$/, '$1'); var m = t.match(/^(-?\d*)((?:[a-z](?:\^-?\d+)?)*)$/), pw; if (!m) { pw = t.match(/^(-?\d+)\^(-?\d+)$/); if (!pw) return null; return { c: 1, v: [[pw[1], +pw[2]]], num: true }; }
      var v = [], re = /([a-z])(?:\^(-?\d+))?/g, x; while ((x = re.exec(m[2]))) v.push([x[1], x[2] == null ? 1 : +x[2]]); return { c: m[1] === '' ? 1 : m[1] === '-' ? -1 : +m[1], v: v }; }
    var top = side(parts[0]), bot = parts[1] ? side(parts[1]) : { c: 1, v: [] }; if (!top || !bot || (!top.v.length && !bot.v.length)) return null;
    var vars = top.v.map(function (p) { return [p[0], p[1]]; }).concat(bot.v.map(function (p) { return [p[0], -p[1]]; })), cn = top.c, cd = bot.c;
    function fmt(n, d, vs) { var t = '', b = ''; vs.forEach(function (p) { if (!p[1]) return; var e = Math.abs(p[1]), piece = p[0] + (e === 1 ? '' : sup(e)); if (p[1] > 0) t += piece; else b += piece; });
      var tn = (n === 1 && t ? '' : n === -1 && t ? '−' : neg(n)) + t, bn = (d === 1 ? '' : d) + b; if (!tn) tn = '1'; return bn ? tn + '/' + ((d !== 1 && b) || vs.filter(function (p) { return p[1] < 0; }).length > 1 ? '(' + bn + ')' : bn) : tn; }
    var Qt = plain(q || ''), Q = unsup(asc(Qt)), div = /÷|\//.test(Qt), E = (Q.match(/\^-?\d+/g) || []).map(function (x) { return +x.slice(1); });
    var C = (Q.replace(/\^-?\d+/g, ' ').match(/-?\d+(?:\.\d+)?/g) || []).map(Number).filter(function (x) { return Math.abs(x) > 1 && Math.abs(x) < 100; });
    var right = fmt(cn, cd, vars), n0 = vars[0][1], eAlt = [], cAlt = [], i, k;
    var addE = function (e) { if (e !== n0 && e !== 0 && Math.abs(e) < 60 && eAlt.indexOf(e) < 0) eAlt.push(e); }, addC = function (c) { if (c !== cn && c !== 0 && c === Math.round(c) && Math.abs(c) < 1000 && cAlt.indexOf(c) < 0) cAlt.push(c); };
    for (i = 0; i < E.length; i++) for (k = i + 1; k < E.length; k++) { addE(E[i] * E[k]); addE(E[i] + E[k]); addE(Math.abs(E[i] - E[k])); }
    [n0 + 1, n0 - 1, n0 * 2, n0 + 2].forEach(addE);
    for (i = 0; i < C.length; i++) for (k = i + 1; k < C.length; k++) { if (div) { addC(C[i] - C[k]); addC(C[i] + C[k]); } else { addC(C[i] + C[k]); addC(C[i] * C[k]); } }
    C.forEach(function (c) { E.forEach(function (e) { addC(c * e); }); }); C.forEach(addC);
    var withE = function (e) { var v = vars.map(function (p) { return p.slice(); }); v[0][1] = e; return v; }, cand = [];
    if (top.num) { var b0 = +vars[0][0]; return uniq(right, [fmt(cn, cd, withE(eAlt[0])), String(b0 * b0) + sup(n0), fmt(cn, cd, withE(eAlt[1])), fmt(cn, cd, withE(eAlt[2]))]); }
    if (vars.some(function (p) { return p[1] < 0; })) { var up = fmt(cn, 1, vars.map(function (p) { return [p[0], Math.abs(p[1])]; })); cand.push(up); if (cd === 1 && cn === 1) cand.push('−' + up); }   // did not flip / "negative exponent means negative"
    cand.push(fmt(cn, cd, withE(eAlt[0]))); if (cAlt.length) cand.push(fmt(cAlt[0], cd, vars));
    if (vars.length > 1) { var v2 = vars.map(function (p) { return p.slice(); }); v2[1][1] = v2[1][1] + (v2[1][1] > 0 ? 1 : -1); cand.push(fmt(cn, cd, v2)); }
    cand.push(fmt(cn, cd, withE(eAlt[1]))); if (cAlt.length > 1) cand.push(fmt(cAlt[1], cd, vars)); if (cAlt.length) cand.push(fmt(cAlt[0], cd, withE(eAlt[0]))); cand.push(fmt(cn, cd, withE(eAlt[2])));
    return uniq(right, cand);
  }

  function choices(ans, o) {
    o = o || {}; var key = o.key || plain(ans);
    if (o.choices && o.choices.length > 1) return o.choices.map(plain);
    var a = plain(ans); if (!a) return undefined;
    if (isNumber(a)) return null;
    var w = wordSet(a, plain(o.q || '')); if (w) return w[0].slice();
    var b = between(a); if (b) return b[0];
    if (/^[A-D]$/.test(a)) { var caps = (plain(o.q || '').match(/\b[A-D]\b/g) || []).filter(function (c, i2, arr) { return arr.indexOf(c) === i2; }).sort(); if (caps.indexOf(a) < 0) caps.push(a); if (caps.length < 2) caps = ['A', 'B']; caps.sort(); return caps.length === 2 ? caps.concat(['They are the same']) : caps; }
    var r = ineq(a) || sci(a) || pair(a, o.q) || linear(a) || piAns(a, o.q) || mono(a, o.q) || order(a);
    if (r && r.length >= 3) { var right = r[0]; return shuffle(r, key + '|' + right); }
    return undefined;
  }
  /* which choice is the page's right answer (same text after tidy-up) */
  function rightOf(list, ans) { var T = function (t) { return unsup(asc(String(t))).toLowerCase().replace(/[\s()]+/g, '').replace(/≤/g, '<=').replace(/≥/g, '>=').replace(/[×·*]/g, 'x').replace(/(^|[^\d.])1x/g, '$1x'); }, a = T(plain(ans)), w = wordSet(plain(ans), ''); if (w) a = T(w[1]);
    for (var i = 0; i < list.length; i++) if (T(list[i]) === a) return list[i]; return null; }

  function css() { if (document.getElementById('ta-css')) return; var s = document.createElement('style'); s.id = 'ta-css';
    s.textContent = '.ta-hid{position:absolute!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important;padding:0!important;border:0!important;margin:0!important;min-width:0!important}' +
      '.ta-row{display:flex;flex-wrap:wrap;gap:8px;flex:1 1 100%;margin:2px 0}.ta-row.col{flex-direction:column}' +
      '.ta-btn{font:600 16px/1.35 Inter,system-ui,sans-serif;background:#fff;color:#1E2D4F;border:1.5px solid #B9C0D0;border-radius:9px;padding:9px 16px;min-height:46px;min-width:56px;cursor:pointer;text-align:center}.ta-row.col .ta-btn{text-align:left}' +
      '.ta-btn:hover{border-color:#1E2D4F}.ta-btn.sel{border-color:#1E2D4F;box-shadow:inset 0 0 0 1.5px #1E2D4F}.ta-btn.ok{border-color:#15803D;background:#F0FAF3;color:#14532D;box-shadow:inset 0 0 0 1.5px #15803D}.ta-btn.no{border-color:#E4A8A1;background:#FEF3F2;color:#8A2A1F;box-shadow:none}' +
      '.ta-btn[disabled]{cursor:default;opacity:.85}.ta-tip{flex:1 1 100%;font:600 14px Inter,system-ui,sans-serif;color:#8A5A00}@media print{.ta-row{display:none}.ta-hid{position:static!important;width:auto!important;height:auto!important;opacity:1!important}}';
    document.head.appendChild(s); }
  function mount(inp, list, o) {
    o = o || {}; css(); if (inp.dataset.taMounted) return null; inp.dataset.taMounted = '1';
    var row = document.createElement('span'); row.className = 'ta-row' + (list.some(function (t) { return t.length > 18; }) ? ' col' : ''); row.setAttribute('role', 'group'); row.setAttribute('aria-label', 'Answer choices');
    var btns = [], picked = '', locked = false, tip = document.createElement('span'); tip.className = 'ta-tip'; tip.hidden = true;
    list.forEach(function (t) { var b = document.createElement('button'); b.type = 'button'; b.className = 'ta-btn'; b.textContent = t; b.setAttribute('data-t', t);
      b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); if (locked) return; picked = t; tip.hidden = true; btns.forEach(function (x) { x.classList.toggle('sel', x === b); });
        inp.value = t; try { delete inp.dataset.swFilled; } catch (x) {} if (o.onPick) o.onPick(t, b); });
      row.appendChild(b); btns.push(b); });
    row.appendChild(tip); inp.classList.add('ta-hid'); inp.tabIndex = -1; inp.setAttribute('aria-hidden', 'true');
    (o.after || inp).parentNode.insertBefore(row, (o.after || inp).nextSibling);
    // a finished step-by-step puts its last line in the box: keep the tap as the answer and ask the student to tap
    inp.addEventListener('input', function () { if (inp.dataset.swFilled && inp.value === inp.dataset.swFilled) { var got = inp.value; inp.value = picked; try { delete inp.dataset.swFilled; } catch (x) {} tip.textContent = 'You got ' + got + '. Now tap your answer.'; tip.hidden = false; } });
    return { row: row, buttons: btns, lock: function () { locked = true; btns.forEach(function (b) { b.disabled = true; }); },
      mark: function (t, ok) { btns.forEach(function (b) { if (b.getAttribute('data-t') === t) { b.classList.remove('sel'); b.classList.add(ok ? 'ok' : 'no'); } }); } };
  }
  window.TapAnswers = { choices: choices, mount: mount, plain: plain, isNumber: isNumber, rightOf: rightOf };
})();
