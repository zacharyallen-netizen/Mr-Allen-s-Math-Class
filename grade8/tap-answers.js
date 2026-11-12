/* TAP ANSWERS (Nov 11, 2026). Mr. Allen's rules: an answer is (1) a number or (2) a multiple choice whose wrong choices
   come from common mistakes; a wrong tap gets a prompt that NAMES the mistake; every problem has a Hint.
   Turns a typed answer into tap choices on the practice pages, pre-tests and notes. The page's own checker still grades:
   a tap puts the choice's text in the page's answer box and presses the page's own Check.

   TapAnswers.choices(ans, { q, key, choices })
       -> null       the answer is one number: keep the number box
       -> [strings]  tap choices, the right one included (the order is fixed for each key). The list also carries
                     list.why = { "wrong choice text": "what that mistake is", "*": "a note for any wrong choice" }
       -> undefined  no rule fits: the page must list its own choices
     ans      the right answer as the page stores it (HTML is fine)
     q        the question's text (used to build the wrong choices: multiplying instead of adding exponents, not
              flipping an inequality, swapping slope and y-intercept, a sign error ...)
     key      any text that names the question (keeps the order steady)
     choices  the page's own list (right answer anywhere in it); used as written
   TapAnswers.why(list, text)   the prompt for a wrong choice ('' if there is none)
   TapAnswers.hint(ans, q)      a short hint for the question (how to start, with the rule to remember)
   TapAnswers.miss(ans, q)      the common mistakes for this kind of question
   TapAnswers.numWhy(typed, ans, q)  a wrong typed number: names the mistake if the number gives it away (sign, upside down,
                                decimal place, no square root, 180° pair), else miss()
   TapAnswers.mount(input, list, { onPick(text) })  hides the box, shows the buttons, returns { lock(), mark(text, ok) }
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
  /* uniq(right, candidates): candidates are "text" or ["text", "what the mistake is"]; keeps the first 3 different ones */
  function uniq(right, list, n) { var seen = {}, out = [right], why = {}; seen[right.replace(/\s+/g, '')] = 1;
    list.forEach(function (x) { if (x == null) return; var t = Array.isArray(x) ? x[0] : x; if (t == null) return; t = String(t); var k = t.replace(/\s+/g, '');
      if (!seen[k] && out.length < (n || 4)) { seen[k] = 1; out.push(t); if (Array.isArray(x) && x[1]) why[t] = x[1]; } });
    out.why = why; return out; }

  /* ---------- word answers: fixed sets, shown in the same order every time. The note names the idea students mix up. ---------- */
  var SETS = [
    [['Yes', 'No'], ''], [['True', 'False'], ''],
    [['Rational', 'Irrational'], 'Rational: it can be written as a fraction, so its decimal stops or repeats. Irrational: the decimal never stops and never repeats (like π or √2).'],
    [['Linear', 'Nonlinear'], 'Linear means the rate of change stays the same, so the graph is a straight line. A curve is nonlinear.'],
    [['Function', 'Not a function'], 'A function gives each input exactly ONE output. Look for an input that shows up twice with different outputs.'],
    [['One solution', 'No solution', 'Infinitely many solutions'], 'Simplify both sides. If you get x = a number, there is one solution. A false statement like 2 = 5 means no solution. A true statement like 3 = 3 means infinitely many.'],
    [['Positive', 'Negative', 'Zero', 'Undefined'], 'Read the line left to right. Up is positive. Down is negative. Flat is zero. Straight up and down is undefined.'],
    [['Natural', 'Whole', 'Integer', 'Rational', 'Irrational'], 'Natural: 1, 2, 3 … Whole: add 0. Integer: add the negatives. Rational: fractions and decimals that stop or repeat.'],
    [['Congruent', 'Similar', 'Neither'], 'Slides, flips and turns keep the size, so the figures are congruent. A dilation changes the size, so they are only similar.'],
    [['Translation', 'Reflection', 'Rotation', 'Dilation'], 'Translation = slide. Reflection = flip. Rotation = turn. Dilation = bigger or smaller.'],
    [['Increasing', 'Decreasing', 'Constant'], 'Read the graph left to right. Going up is increasing. Going down is decreasing. Flat is constant.'],
    [['Addition', 'Subtraction', 'Multiplication', 'Division'], 'Use the inverse operation: the one that undoes what was done to x.'], [['Enlargement', 'Reduction'], 'A scale factor more than 1 makes it bigger. A scale factor between 0 and 1 makes it smaller.'],
    [['Cylinder', 'Cone', 'Sphere'], ''], [['Complementary', 'Supplementary', 'Vertical'], 'Complementary angles add to 90°. Supplementary angles add to 180°. Vertical angles are across from each other and are equal.'],
    [['Legs', 'Hypotenuse'], 'The legs make the right angle. The hypotenuse is the longest side, across from the right angle.'], [['Add', 'Subtract', 'Multiply', 'Divide'], ''],
    [['Slope', 'y-intercept'], 'The slope is the rate of change (the number with x). The y-intercept is the starting value (y when x = 0).'], [['Joint', 'Marginal'], 'A joint frequency is inside the table. A marginal frequency is a total on the edge.'],
    [['Theorem', 'Converse'], ''], [['Function A', 'Function B', 'They are the same'], 'Find the slope (rate of change) and the y-intercept (starting value) of each function first. Then compare.']
  ];
  var ALIAS = { 'non-linear': 'nonlinear', 'not linear': 'nonlinear', 'infinitely many': 'infinitely many solutions', 'infinite': 'infinitely many solutions', 'infinite solutions': 'infinitely many solutions', 'no solutions': 'no solution', 'none': 'no solution', 'the slope': 'slope', 'integers': 'integer' };
  function wordSet(a, q) {
    var low = a.toLowerCase().replace(/[.!]$/, ''); low = ALIAS[low] || low;
    if ((low === 'positive' || low === 'negative') && /associat|correlat|scatter|trend/i.test(q || '')) return [['Positive', 'Negative', 'No association'], low === 'positive' ? 'Positive' : 'Negative', 'Positive: both go up together. Negative: one goes up while the other goes down. No association: the dots show no pattern.'];
    for (var i = 0; i < SETS.length; i++) for (var j = 0; j < SETS[i][0].length; j++) if (SETS[i][0][j].toLowerCase() === low) return [SETS[i][0], SETS[i][0][j], SETS[i][1]];
    return null;
  }

  /* ---------- rules for written math answers ---------- */
  function ineq(a, q) {
    var m = asc(a).replace(/\s+/g, '').replace(/≤/g, '<=').replace(/≥/g, '>=').match(/^([a-z])(<=|>=|<|>)(-?[\d.\/]+)$/); if (!m) return null;
    var v = m[1], op = m[2], n = m[3], F = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' }, S = { '<': '<=', '>': '>=', '<=': '<', '>=': '>' }, D = { '<': '<', '>': '>', '<=': '≤', '>=': '≥' };
    var f = function (o, x) { return v + ' ' + D[o] + ' ' + neg(x); }, nn = n.charAt(0) === '-' ? n.slice(1) : '-' + n;
    var negCoef = new RegExp('[−-]\\s*\\d*\\.?\\d*\\s*' + v + '\\b').test(plain(q || ''));
    var wFlip = negCoef ? 'You did not flip the sign. When you multiply or divide by a negative number, flip the inequality sign.' : 'The sign points the wrong way. Only flip the sign when you multiply or divide by a negative number.';
    var wStrict = 'Check the sign. < and > do not include the number. ≤ and ≥ do include it.', wNum = 'Check the sign of your number. Redo the last step.';
    return uniq(f(op, n), [[f(F[op], n), wFlip], [f(S[op], n), wStrict], /^-?0+$/.test(n) ? [f(F[S[op]], n), wFlip] : [f(op, nn), wNum], [f(F[S[op]], n), wFlip]]);
  }
  function sci(a) {
    var m = unsup(asc(a)).replace(/\s+/g, '').match(/^(-?\d+(?:\.\d+)?)[×x*·]10\^?(-?\d+)(.*)$/); if (!m) return null;
    var c = m[1], n = +m[2], tail = m[3] ? ' ' + a.replace(/^.*[⁰¹²³⁴⁵⁶⁷⁸⁹\d]\s*/, '') : '', f = function (cc, e) { return neg(cc) + ' × 10' + sup(e) + tail; };
    if (m[3] && !/^[a-zA-Z³² ]+$/.test(m[3])) return null;
    var ten = String(Math.round(parseFloat(c) * 10 * 1e6) / 1e6);
    var wSign = n > 0 ? 'Check the sign of the exponent. A big number gets a positive exponent. A negative exponent makes a number less than 1.' : 'Check the sign of the exponent. A number less than 1 gets a negative exponent.';
    var wCount = 'The exponent is off by one. Count the decimal moves again (or add or subtract the exponents again).', wForm = 'That is not in scientific notation yet. The first number must be at least 1 and less than 10. Move the decimal one more place and fix the exponent.';
    return uniq(f(c, n), [n ? [f(c, -n), wSign] : [f(c, 1), wCount], [f(c, n > 0 ? n - 1 : n + 1), wCount], [f(ten, n - 1), wForm], [f(c, n + (n > 0 ? 1 : -1)), wCount]]);
  }
  function pair(a, q) {
    var m = asc(a).replace(/\s+/g, '').match(/^\((-?[\d.\/]+),(-?[\d.\/]+)\)$/); if (!m) return null;
    var x = m[1], y = m[2], f = function (p, q2) { return '(' + neg(p) + ', ' + neg(q2) + ')'; }, N = function (t) { return /^-?0+$/.test(t) ? t : t.charAt(0) === '-' ? t.slice(1) : '-' + t; };
    var bump = function (t) { return isNaN(+t) ? t : String(+t + 1); }, r = function (v) { return Math.abs(v * 10 - Math.round(v * 10)) > 1e-9 ? 'x' : String(Math.round(v * 10) / 10); }, cand = [];
    var Q = asc(plain(q || '')), o = Q.replace(/\s+/g, '').match(/\((-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)\)/);
    var wSwap = 'The order is switched. x comes first, then y: (x, y).', wSign = 'Check the signs. Which coordinate should change sign, and which should stay the same?';
    if (o && !isNaN(+x) && !isNaN(+y)) { var a0 = +o[1], b0 = +o[2], X = +x, Y = +y;                // the moves students mix up
      if (/dilat|scale factor/i.test(Q) && a0 && b0) { var k = X / a0; cand.push([f(r(a0 + k), r(b0 + k)), 'You added the scale factor. A dilation MULTIPLIES both coordinates by the scale factor.'], [f(r(a0 / k), r(b0 / k)), 'You divided. Multiply both coordinates by the scale factor.'], [f(r(X), r(b0)), 'You changed only x. Multiply BOTH coordinates by the scale factor.']); }
      else if (/translat|slide|left|right|\bup\b|\bdown\b|units/i.test(Q)) { var dx = X - a0, dy = Y - b0; cand.push([f(r(a0 - dx), r(b0 - dy)), 'You moved the wrong way. Right and up ADD. Left and down SUBTRACT.'], [f(r(a0 + dy), r(b0 + dx)), 'You changed the wrong coordinate. Left and right change x. Up and down change y.'], [f(r(a0 + dx + dy), r(b0 + dx + dy)), 'Each coordinate moves by its own amount. Left and right change only x. Up and down change only y.']); }
      else { var isT = /reflect|rotat|flip|turn|axis|image|transform|clockwise/i.test(Q), sysN = /system|solution|both|intersect|cross|equations/i.test(Q) ? 'That point does not work in BOTH equations. Put x and y into each equation to check.' : 'Check each coordinate. x comes first, then y.';
        var MV = [[a0, -b0, 'That is a flip over the x-axis (only y changes sign).'], [-a0, b0, 'That is a flip over the y-axis (only x changes sign).'], [-a0, -b0, 'That is a 180° turn (both signs change).'], [b0, a0, 'You switched x and y but did not change a sign.'], [-b0, a0, 'That is a 90° turn counterclockwise: (x, y) → (−y, x).'], [b0, -a0, 'That is a 90° turn clockwise: (x, y) → (y, −x).'], [a0, b0, 'That is the point you started with. Do the move.']];
        MV.forEach(function (pt) { cand.push([f(r(pt[0]), r(pt[1])), !isT ? sysN : pt[2] + (pt[0] === a0 && pt[1] === b0 ? '' : ' Read the question again: which move does it ask for?')]); }); }
    }
    cand = cand.filter(function (c) { return c[0].indexOf('x') < 0; });                             // untidy decimals are not offered
    return uniq(f(x, y), cand.concat([[f(y, x), wSwap], [f(N(x), y), wSign], [f(x, N(y)), wSign], [f(N(x), N(y)), wSign], f(bump(x), y), f(x, bump(y))]));
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
    var wSwap = 'You switched them. The slope is the number WITH x. The y-intercept is the number by itself.', wM = 'Check the sign of the slope. If y goes up as x goes up, the slope is positive. If y goes down, it is negative.', wB = 'Check the y-intercept. It is the value of y when x = 0 (where the line crosses the y-axis).';
    if (!z(b) && b !== mm && !frac) cand.push([f(b, mm), wSwap]);
    cand.push([f(N(mm), b), wM]); if (!z(b)) cand.push([f(mm, N(b)), wB]); else cand.push([f(mm, mm.replace('-', '') === '1' ? '1' : mm.replace(/[()\-]/g, '')), wB]);
    cand.push([f(N(mm), z(b) ? '1' : N(b)), 'Check both signs: the slope and the y-intercept.']);
    if (!frac && Math.abs(+mm) > 1) cand.push([f((+mm < 0 ? '-' : '') + '1/' + Math.abs(+mm), b), 'Slope is rise over run (change in y ÷ change in x). You wrote run over rise.']);
    return uniq(f(mm, b), cand);
  }
  function between(a) { var m = a.match(/^(\d+) and (\d+)$/); if (!m || +m[2] !== +m[1] + 1) return null; var x = +m[1];
    var l = [(x - 1) + ' and ' + x, x + ' and ' + (x + 1), (x + 1) + ' and ' + (x + 2), (x * x) + ' and ' + ((x + 1) * (x + 1))]; l.why = { '*': 'Find the two perfect squares on each side of the number. The answer is between their square roots.' };
    l.why[l[3]] = 'Those are the perfect squares. The answer is between their square ROOTS.'; return [l, x + ' and ' + (x + 1)]; }
  function piAns(a, q) {
    var m = asc(a).replace(/,/g, '').match(/^(?:[A-Za-z]\s*=\s*)?(\d+(?:\.\d+)?)\s*π(.*)$/); if (!m) return null; var k = +m[1], tail = m[2] || '', f = function (v) { return k === Math.round(k) && v !== Math.round(v) ? null : (Math.round(v * 100) / 100) + 'π' + tail; }, cand = [];   // whole-number answers get whole-number choices
    var Q = asc(plain(q || '')), rm = Q.match(/\br\s*=\s*(\d+(?:\.\d+)?)|radius\s*(?:of|is|=)?\s*(\d+(?:\.\d+)?)/i), hm = Q.match(/\bh\s*=\s*(\d+(?:\.\d+)?)|height\s*(?:of|is|=)?\s*(\d+(?:\.\d+)?)/i), dm = Q.match(/\bd\s*=\s*(\d+(?:\.\d+)?)|diameter\s*(?:of|is|=)?\s*(\d+(?:\.\d+)?)/i);
    var r = rm ? +(rm[1] || rm[2]) : dm ? +(dm[1] || dm[2]) / 2 : 0, h = hm ? +(hm[1] || hm[2]) : 0, wD = 'You used the diameter. The radius is HALF the diameter.', wSq = 'Square the radius first: r × r. Then multiply by the height.', wG = 'Check the formula. Cylinder: πr²h. Cone: ⅓πr²h. Sphere: ⁴⁄₃πr³.';
    if (r && /sphere|ball/i.test(Q)) cand.push([f(4 * r * r / 3), 'A sphere uses r CUBED: r × r × r. You squared it.'], [f(r * r * r), 'Do not forget the ⁴⁄₃. Sphere: V = ⁴⁄₃πr³.'], [f(4 * r * r * r), 'Do not forget to divide by 3. Sphere: V = ⁴⁄₃πr³.'], dm ? [f(4 * 8 * r * r * r / 3), wD] : [f(2 * r * r * r / 3), 'That is half a sphere. A whole sphere is ⁴⁄₃πr³.']);
    else if (r && h && /cone/i.test(Q)) cand.push([f(r * r * h), 'That is the cylinder. A cone holds ONE THIRD as much: multiply by ⅓.'], [f(r * h / 3), wSq], [f(2 * r * h), wG]);
    else if (r && h) cand.push([f(r * h), wSq], [f(r * r * h / 3), 'That is the cone formula. A cylinder does not use ⅓.'], [f(2 * r * h), 'You doubled the radius. Square it: r × r.'], dm ? [f(4 * r * r * h), wD] : [f(r * r * h * 2), wG]);
    cand = cand.filter(function (c) { return c[0] != null; });
    var o = uniq(f(k), cand.concat([k % 3 === 0 ? f(k / 3) : f(k * 3), f(k * 2), f(k * 4), k % 2 === 0 ? f(k / 2) : f(k * 6)])); o.why['*'] = wG; return o;
  }
  function order(a, q) { var t = a.split(/\s*,\s*/); if (t.length < 3 || t.length > 6 || t.some(function (x) { return !x || x.length > 14; })) return null;
    var j = function (x) { return x.join(',  '); }, sw = function (i, k) { var c = t.slice(); var u = c[i]; c[i] = c[k]; c[k] = u; return j(c); }, wD = 'Change each number to a decimal first. Then compare them.';
    var o = uniq(j(t), [[j(t.slice().reverse()), 'That order is backward. Read the question: least to greatest, or greatest to least?'], [sw(0, 1), wD], [sw(t.length - 2, t.length - 1), wD], [sw(1, 2), wD]]); return o; }
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
    var right = fmt(cn, cd, vars), n0 = vars[0][1], eAlt = [], eWhy = {}, cAlt = [], i, k;
    var W = { mul: 'You multiplied the exponents. Multiply exponents only for a power raised to a power, like (x²)³.', add: 'You added the exponents. Add exponents only when you MULTIPLY powers with the same base.', sub: 'You subtracted the exponents. Subtract exponents only when you DIVIDE powers with the same base.',
      one: 'Check the exponent again. A letter with no exponent has an exponent of 1.', off: 'Check the exponent again. Multiply powers → add the exponents. Divide → subtract. Power of a power → multiply.', coef: 'Check the numbers in front. Multiply or divide them like regular numbers, and raise them to the power too.', flip: 'A negative exponent moves the power to the bottom of a fraction.', negv: 'A negative exponent does NOT make the answer negative. It moves the power to the bottom of a fraction.', base: 'Keep the base the same. Only the exponents change.', v2: 'Check the exponent on the second letter.' };
    var addE = function (e, why) { if (e !== n0 && e !== 0 && Math.abs(e) < 60 && eAlt.indexOf(e) < 0) { eAlt.push(e); eWhy[e] = why; } }, addC = function (c) { if (c !== cn && c !== 0 && c === Math.round(c) && Math.abs(c) < 1000 && cAlt.indexOf(c) < 0) cAlt.push(c); };
    // a bare letter (x = x¹) in the question: the answer you get by forgetting its 1 is THAT mistake, not "you added" (review Nov 12, 2026)
    var bare = (Q.replace(/[a-z]{2,}/gi, ' ').replace(/[a-z]\^-?\d+/g, ' ').match(/[a-z]/g) || []).length, sumE = E.reduce(function (s0, e) { return s0 + e; }, 0);
    if (bare && !div && n0 === sumE + bare) addE(sumE, W.one);
    for (i = 0; i < E.length; i++) for (k = i + 1; k < E.length; k++) { addE(E[i] * E[k], W.mul); addE(E[i] + E[k], W.add); addE(Math.abs(E[i] - E[k]), W.sub); }
    [n0 + 1, n0 - 1, n0 * 2, n0 + 2].forEach(function (e) { addE(e, bare ? W.one : W.off); });
    for (i = 0; i < C.length; i++) for (k = i + 1; k < C.length; k++) { if (div) { addC(C[i] - C[k]); addC(C[i] + C[k]); } else { addC(C[i] + C[k]); addC(C[i] * C[k]); } }
    C.forEach(function (c) { E.forEach(function (e) { addC(c * e); }); }); C.forEach(addC);
    var withE = function (e) { var v = vars.map(function (p) { return p.slice(); }); v[0][1] = e; return v; }, cand = [], E_ = function (ix) { return [fmt(cn, cd, withE(eAlt[ix])), eWhy[eAlt[ix]]]; };
    if (top.num) { var b0 = +vars[0][0]; return uniq(right, [E_(0), [String(b0 * b0) + sup(n0), W.base], E_(1), E_(2)]); }
    if (vars.some(function (p) { return p[1] < 0; })) { var up = fmt(cn, 1, vars.map(function (p) { return [p[0], Math.abs(p[1])]; })); cand.push([up, W.flip]); if (cd === 1 && cn === 1) cand.push(['−' + up, W.negv]); }   // did not flip / "negative exponent means negative"
    cand.push(E_(0)); if (cAlt.length) cand.push([fmt(cAlt[0], cd, vars), W.coef]);
    if (vars.length > 1) { var v2 = vars.map(function (p) { return p.slice(); }); v2[1][1] = v2[1][1] + (v2[1][1] > 0 ? 1 : -1); cand.push([fmt(cn, cd, v2), W.v2]); }
    cand.push(E_(1)); if (cAlt.length > 1) cand.push([fmt(cAlt[1], cd, vars), W.coef]); if (cAlt.length) cand.push([fmt(cAlt[0], cd, withE(eAlt[0])), W.coef]); cand.push(E_(2));
    var o = uniq(right, cand); o.why['*'] = 'Check each exponent rule. Multiply → add exponents. Divide → subtract. Power of a power → multiply.'; return o;
  }

  function choices(ans, o) {
    o = o || {}; var key = o.key || plain(ans);
    if (o.choices && o.choices.length > 1) { var own = o.choices.map(plain); own.why = o.why || {}; return own; }
    var a = plain(ans); if (!a) return undefined;
    if (isNumber(a)) return null;
    var w = wordSet(a, plain(o.q || '')); if (w) { var ws = w[0].slice(); ws.why = w[2] ? { '*': w[2] } : {}; return ws; }
    var b = between(a); if (b) return b[0];
    if (/^[A-D]$/.test(a)) { var caps = (plain(o.q || '').match(/\b[A-D]\b/g) || []).filter(function (c, i2, arr) { return arr.indexOf(c) === i2; }).sort(); if (caps.indexOf(a) < 0) caps.push(a); if (caps.length < 2) caps = ['A', 'B']; caps.sort(); var cl = caps.length === 2 ? caps.concat(['They are the same']) : caps; cl.why = { '*': 'Find the slope (rate of change) and the y-intercept (starting value) of each one first. Then compare.' }; return cl; }
    var r = ineq(a, o.q) || sci(a) || pair(a, o.q) || linear(a) || piAns(a, o.q) || mono(a, o.q) || order(a, o.q);
    if (r && r.length >= 3) { var right = r[0]; return shuffle(r, key + '|' + right); }
    return undefined;
  }
  function why(list, t) { var w = list && list.why; return w ? (w[t] || w['*'] || '') : ''; }
  /* which choice is the page's right answer (same text after tidy-up) */
  function rightOf(list, ans) { var T = function (t) { return unsup(asc(String(t))).toLowerCase().replace(/[\s()]+/g, '').replace(/≤/g, '<=').replace(/≥/g, '>=').replace(/[×·*]/g, 'x').replace(/(^|[^\d.])1x/g, '$1x'); }, a = T(plain(ans)), w = wordSet(plain(ans), ''); if (w) a = T(w[1]);
    for (var i = 0; i < list.length; i++) if (T(list[i]) === a) return list[i]; return null; }

  /* ---------- a hint for any question: how to start, and the rule to remember ---------- */
  var HINTS = [   /* first match wins: specific topics first, inequality only with a letter next to the sign (review Nov 12, 2026) */
    [/how many solutions|no solution|infinitely/i, 'Simplify both sides first. Then look: x = a number (one solution), a false statement like 2 = 5 (no solution), or a true statement like 3 = 3 (infinitely many).', 'Common mistake: stopping too early. Simplify BOTH sides all the way. Then see if the x-terms match and if the numbers match.', 'nsol'],
    [/scientific notation|standard form|× ?10|x ?10\^/i, 'Move the decimal until ONE digit (1 to 9) is in front. Count the moves: that is the exponent. Big number → positive exponent. Small number → negative exponent. To multiply, multiply the front numbers and ADD the exponents.', 'Common mistakes: the wrong sign on the exponent, counting the decimal moves wrong, and leaving the front number bigger than 10.', 'sci'],
    [/sphere|hemisphere|\bball\b|globe/i, 'Sphere: V = ⁴⁄₃πr³. Cube the radius first (r × r × r). If you are given the diameter, cut it in half to get the radius.', 'Common mistakes: squaring the radius instead of cubing it, using the diameter, and forgetting the ⁴⁄₃.', 'sph'],
    [/cone/i, 'Cone: V = ⅓πr²h. Square the radius, multiply by the height, then take one third.', 'Common mistakes: forgetting the ⅓, using the diameter instead of the radius, and not squaring the radius.', 'cone'],
    [/cylinder|volume|holds .*π|πr|\b(in|cm|ft|m)³|\bcan\b|tank|how tall|twice as tall/i, 'Cylinder: V = πr²h. Square the radius first (r × r), then multiply by the height. The radius is half the diameter.', 'Common mistakes: using the diameter instead of the radius, and doubling the radius instead of squaring it.', 'cyl'],
    [/hypotenuse|right triangle|\bleg\b|legs|ladder|diagonal|distance between|pythag|diamond|second base|corner to corner|across the (field|square|rectangle|room)/i, 'Use a² + b² = c². c is the hypotenuse, the longest side. To find a leg, subtract: c² − a². Take the square root at the end.', 'Common mistakes: adding the sides without squaring them, forgetting the square root at the end, and adding when you should subtract to find a leg.', 'pyth'],
    [/dilat|scale factor/i, 'A dilation multiplies. Multiply every coordinate (or side) by the scale factor.', 'Common mistake: adding the scale factor. A dilation MULTIPLIES both coordinates.', 'dil'],
    [/translat|\bslides? (left|right|up|down)|\bslid (left|right|up|down)/i, 'A translation slides the point. Right and up add. Left and down subtract. Left and right change x. Up and down change y.', 'Common mistakes: moving the wrong way (left and down subtract) and changing the wrong coordinate.', 'tra'],
    [/reflect/i, 'A reflection flips the point. Over the x-axis: y changes sign. Over the y-axis: x changes sign.', 'Common mistake: changing the wrong sign. Over the x-axis, y changes. Over the y-axis, x changes.', 'ref'],
    [/rotat/i, 'A rotation turns the point about the origin. 180°: both signs change. 90° counterclockwise: (x, y) → (−y, x). 90° clockwise: (x, y) → (y, −x).', 'Common mistakes: forgetting to switch x and y on a 90° turn, and changing the wrong sign.', 'rot'],
    [/congruent|similar/i, 'Slides, flips and turns keep the size (congruent). A dilation changes the size (similar). Matching sides of similar figures use the same scale factor.', 'Common mistake: calling figures congruent after a dilation. A dilation changes the size, so they are only similar.', 'cong'],
    [/supplement|straight angle|linear pair|angles? on a (straight )?line/i, 'Angles on a straight line add to 180°. Subtract what you know from 180.', 'Common mistake: using 90 instead of 180. A straight line is 180°.', 'supp'],
    [/complement|right angle/i, 'Complementary angles add to 90°. Subtract what you know from 90.', 'Common mistake: using 180 instead of 90. A right angle is 90°.', 'comp'],
    [/vertical angle|lines cross/i, 'Vertical angles are across from each other, and they are EQUAL. Neighbor angles on a line add to 180°.', 'Common mistake: mixing up "equal" and "add to 180°". Vertical angles are EQUAL. Angles side by side on a line add to 180°.', 'vert'],
    [/parallel|transversal|corresponding|alternate|same-side/i, 'With parallel lines: corresponding, alternate interior and alternate exterior angles are EQUAL. Same-side interior angles add to 180°.', 'Common mistake: mixing up the pairs. Same-side interior angles add to 180°. The other pairs are equal.', 'par'],
    [/exterior angle|remote/i, 'An exterior angle of a triangle equals the two far (remote) inside angles added together.', 'Common mistake: subtracting from 180 when you should ADD the two far angles.', 'ext'],
    [/triangle/i, 'The three angles of a triangle add to 180°. Add the ones you know and subtract from 180.', 'Common mistakes: an adding error, or using 360 instead of 180.', 'tri'],
    [/slope.*through|through.*\(|slope of the line|find the slope|rate of change/i, 'Slope = change in y ÷ change in x. Subtract the y-values, subtract the x-values in the same order, then divide.', 'Common mistakes: putting the change in x on top, and subtracting in a different order on the top and the bottom.', 'slope'],
    [/y ?= ?mx|y ?= ?[−-]?\d*\.?\d*x|slope-intercept|equation of the line|write (an|the) equation|y-intercept|initial value/i, 'Use y = mx + b. m is the slope (the rate of change). b is the y-intercept (the value of y when x = 0).', 'Common mistakes: switching the slope and the y-intercept, and losing a negative sign.', 'line'],
    [/system of|systems of|solve the system|the system|solution \(x|where do .* (cross|intersect)|point of intersection|substitution/i, 'The solution of a system is the point where the lines cross. It must make BOTH equations true. For substitution, set the two expressions for y equal.', 'Common mistake: checking the point in only one equation. It must work in BOTH.', 'sys'],
    [/function|input|output|domain|range|f\(/i, 'A function gives each input ONE output. To evaluate f(x), put the number in for x and do the math. Domain = the inputs (x). Range = the outputs (y).', 'Common mistakes: mixing up inputs (x) and outputs (y), and thinking a repeated OUTPUT breaks a function. Only a repeated INPUT with different outputs does.', 'fn'],
    [/two-way|percent|frequency|table shows.*students|relative|of the (students|people|adults)|joint|marginal/i, 'Find the row or column the question names. Divide the part by THAT total, then change it to a percent.', 'Common mistake: dividing by the wrong total. Use the total of the group the question names.', 'two'],
    [/scatter|association|outlier|line of best fit|trend|dots/i, 'Look at the dots as a group. Up to the right is a positive association. Down to the right is negative. An outlier is a dot far from the pattern.', 'Common mistake: mixing up positive and negative. Read the dots left to right: up is positive, down is negative.', 'scat'],
    [/as a decimal|as a fraction|as a percent|to a decimal|to a fraction/i, 'Fraction → decimal: divide the top by the bottom. Decimal → fraction: put the digits over 10, 100 or 1000, then simplify. Repeating decimal: put the repeating digits over the same number of 9s.', 'Common mistakes: dividing the bottom by the top, and using the wrong place value (0.25 is 25/100, not 25/10).', 'conv'],
    [/rational|irrational|repeating|9.s rule/i, 'Rational numbers can be written as a fraction: the decimal stops or repeats. For a repeating decimal, put the repeating digits over the same number of 9s, then simplify.', 'Common mistake: thinking every square root or every long decimal is irrational. √25 = 5 is rational, and repeating decimals are rational.', 'rat'],
    [/between which|estimate|nearest tenth|√|square root|cube root|∛|perfect (square|cube)/i, 'Find the perfect squares (1, 4, 9, 16, 25, 36, 49, 64, 81, 100 …) on each side of the number. The root is between their square roots.', 'Common mistake: dividing by 2 instead of finding the square root. √36 is 6, not 18.', 'root'],
    [/inequalit|solve[^.?]*[<>≤≥]|[a-z]\s*[<>≤≥]|[<>≤≥]\s*[−-]?\s*\d*\.?\d*\s*[a-z]\b|at least|at most|no more than|no less than/i, 'Solve it like an equation: undo each step on both sides. If you multiply or divide by a NEGATIVE number, flip the sign.', 'Common mistakes: not flipping the sign after you multiply or divide by a negative, and mixing up < with ≤.', 'ineq'],
    [/least to greatest|greatest to least|in order|order from|order the|compare|number line|<, ?>|< or >|which (number )?is (greater|larger|bigger|smaller|less)/i, 'Change every number to a decimal. Then line them up and compare.', 'Common mistake: comparing the numbers by how they look. Change each one to a decimal first.', 'order'],
    [/\^|exponent|simplify|power|[⁰¹²³⁴⁵⁶⁷⁸⁹]/i, 'Same base: multiply → ADD the exponents. Divide → SUBTRACT. Power of a power → MULTIPLY. A negative exponent moves the power to the bottom. Anything to the 0 power is 1.', 'Common mistakes: multiplying exponents when you should add them, and making the answer negative because of a negative exponent.', 'exp'],
    [/speeding|slowing|steeper|faster|slower|part of the graph|graph shows|story/i, 'Read the graph left to right. A steeper line means a faster change. A flat line means no change. A line going down means the amount is getting smaller.', 'Common mistake: reading a flat part as going down. Flat means NO change. Steeper means faster.', 'story'],
    [/solve|=|equation|how many (hours|weeks|tickets|months|miles)/i, 'Undo each step in reverse order, and do the same thing to both sides. Distribute and combine like terms first. Check your answer by putting it back in.', 'Common mistakes: a sign error, doing a step to only one side, and not distributing to every term.', 'solve']
  ];
  /* prefer = skill names to try first (homework: the unit's own skills), e.g. ['ineq', 'nsol'] */
  function skill(ans, q, prefer) { var both = plain(q || '') + ' ' + plain(ans || ''), i;
    if (prefer) for (i = 0; i < HINTS.length; i++) if (prefer.indexOf(HINTS[i][3]) >= 0 && HINTS[i][0].test(both)) return HINTS[i];
    for (i = 0; i < HINTS.length; i++) if (HINTS[i][0].test(both)) return HINTS[i]; return null; }
  function hint(ans, q, prefer) {
    var a = plain(ans || ''), Q = plain(q || ''), w = wordSet(a, Q); if (w && w[2]) return w[2];
    var k = skill(a, Q, prefer); return k ? k[1] : 'Read the question again and underline what it asks for. Write down what you know. Do one step at a time, and check each step.';
  }
  /* the common mistakes for this kind of question (shown after a wrong answer when nothing more exact is known) */
  function miss(ans, q, prefer) { var a = plain(ans || ''), Q = plain(q || ''), w = wordSet(a, Q); if (w && w[2]) return w[2]; var k = skill(a, Q, prefer); return k ? k[2] : 'Check each step. Look for a sign error or a copying error.'; }
  /* a typed number that is wrong: name the mistake when the number gives it away, else the skill's common mistakes */
  function val(t) { t = asc(plain(t)).replace(/^[a-zA-Z∠][a-zA-Z0-9′]{0,3}\s*=\s*/, '').replace(/[$,%°]/g, '').replace(/\s*[a-zA-Z]+\.?[²³]?\s*$/, '').trim(); var m;
    if ((m = t.match(/^(-?)(\d+)\s+(\d+)\/(\d+)$/))) return (m[1] ? -1 : 1) * (+m[2] + m[3] / m[4]);
    if ((m = t.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/))) return +m[2] ? m[1] / m[2] : NaN;
    return /^-?(\d+\.?\d*|\.\d+)$/.test(t) ? +t : NaN; }
  function numWhy(typed, ans, q, fallback) {
    var t = val(typed), a = val(ans), Q = plain(q || ''), eq = function (x, y) { return Math.abs(x - y) < 1e-9 * Math.max(1, Math.abs(y)); };
    if (!isNaN(t) && !isNaN(a) && a !== 0) {
      if (eq(t, -a)) return 'Check your sign. The number is right, but it should be ' + (a < 0 ? 'negative' : 'positive') + '.';
      if (Math.abs(a) !== 1 && eq(t, 1 / a)) return /slope|rate of change/i.test(Q) ? 'You have it upside down. Slope is change in y ÷ change in x.' : 'You have it upside down. Check which number goes on top.';
      for (var k = 1; k <= 3; k++) if (eq(t, a * Math.pow(10, k)) || eq(t, a / Math.pow(10, k))) return 'Your digits are right, but the decimal point is in the wrong place. Count the places again.';
      if (a > 1 && eq(t, a * a)) return 'You stopped one step early. Take the square root at the end.';
      if (/angle|°|degree/i.test(Q + ' ' + plain(ans))) { if (eq(t + a, 180)) return 'Your angle and the right one add to 180°. Check: are these angles EQUAL, or do they add to 180°?'; if (eq(t + a, 90)) return 'Your angle and the right one add to 90°. Check: do these angles add to 90° or to 180°?'; }
    }
    return fallback || miss(ans, q);
  }
  function css() { if (document.getElementById('ta-css')) return; var s = document.createElement('style'); s.id = 'ta-css';
    s.textContent = '.ta-hid{position:absolute!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important;padding:0!important;border:0!important;margin:0!important;min-width:0!important}' +
      '.ta-row{display:flex;flex-wrap:wrap;gap:8px;flex:1 1 100%;margin:2px 0}.ta-row.col{flex-direction:column}' +
      '.ta-btn{font:600 16px/1.35 Inter,system-ui,sans-serif;background:#fff;color:#1E2D4F;border:1.5px solid #B9C0D0;border-radius:9px;padding:9px 16px;min-height:46px;min-width:56px;cursor:pointer;text-align:center}.ta-row.col .ta-btn{text-align:left}' +
      '.ta-btn:hover{border-color:#1E2D4F}.ta-btn.sel{border-color:#1E2D4F;box-shadow:inset 0 0 0 1.5px #1E2D4F}.ta-btn.ok{border-color:#15803D;background:#F0FAF3;color:#14532D;box-shadow:inset 0 0 0 1.5px #15803D}.ta-btn.no{border-color:#E4A8A1;background:#FEF3F2;color:#8A2A1F;box-shadow:none}' +
      '.ta-btn[disabled]{cursor:default;opacity:.85}.ta-tip{flex:1 1 100%;font:600 14px Inter,system-ui,sans-serif;color:#8A5A00}' +
      '.ta-why{display:block;margin:6px 0 2px;padding:8px 11px;border-left:4px solid #E0A800;background:#FFF8E1;border-radius:6px;font:500 14.5px/1.45 Inter,system-ui,sans-serif;color:#3B2F00}.ta-why b{font-weight:700}' +
      '.ta-hintbtn{font:600 14px Inter,system-ui,sans-serif;background:#fff;color:#1E2D4F;border:1.5px solid #B9C0D0;border-radius:8px;padding:6px 13px;min-height:38px;cursor:pointer}.ta-hintbtn:hover{border-color:#1E2D4F}' +
      '@media print{.ta-row,.ta-why,.ta-hintbtn,.pt-check,.oat-hint{display:none!important}.ta-hid{position:static!important;width:auto!important;height:auto!important;opacity:1!important}}';
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
  /* a small yellow note under a problem: the mistake that was made, or a hint. box = where to put it; kind = 'why' | 'hint' */
  function note(box, text, kind) { css(); if (!box) return null; var n = box.querySelector(':scope > .ta-why.' + kind); if (!text) { if (n) n.remove(); return null; }
    if (!n) { n = document.createElement('div'); n.className = 'ta-why ' + kind; n.setAttribute('role', 'status'); box.appendChild(n); }
    n.innerHTML = ''; var b = document.createElement('b'); b.textContent = kind === 'hint' ? 'Hint: ' : 'Look closer: '; n.appendChild(b); n.appendChild(document.createTextNode(text)); return n; }
  /* a Hint button that shows its hint in a yellow note under the problem */
  function hintButton(box, text) { css(); var b = document.createElement('button'); b.type = 'button'; b.className = 'ta-hintbtn'; b.textContent = '💡 Hint';
    b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); var has = box.querySelector(':scope > .ta-why.hint'); note(box, has ? '' : text, 'hint'); }); return b; }
  window.TapAnswers = { choices: choices, mount: mount, plain: plain, isNumber: isNumber, rightOf: rightOf, why: why, hint: hint, miss: miss, numWhy: numWhy, note: note, hintButton: hintButton };
})();
