#!/usr/bin/env node
/* HOMEWORK HINTS AND "WHAT WENT WRONG" NOTES (Nov 11, 2026, Mr. Allen: a wrong answer gets a prompt that names the
   mistake, and every problem has a Hint). Called by hw_mc_build.py; it has no answers in it.

       node _build/hw_help.js JOBS.json      (JOBS.json lives in the PRIVATE folder)

   JOBS = [{ id, q, title, right, choices: [text ...] }]   right = index of the right choice, a number answer, or null
   Prints  [{ id, hint, mis, why: [text or "" per choice] }]
     hint  how to start (TapAnswers.hint, from the problem's words)
     mis   the common mistakes for this kind of problem (TapAnswers.miss): shown after a wrong number, and after a wrong tap
           that has no note of its own
     why   what the mistake in THAT wrong choice is, when comparing it with the right one shows it (flipped sign, wrong
           exponent sign, swapped slope and y-intercept, forgot the 1/3 ...). "" = no exact note (the page shows mis). */
const fs = require('fs'), path = require('path');
global.window = {}; global.document = { getElementById() { return null; } };
require(path.join(__dirname, '..', 'grade8', 'tap-answers.js'));
const T = window.TapAnswers;
const SUP = { '⁻': '-', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
const tidy = t => String(t).replace(/−/g, '-').replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, m => '^' + [...m].map(c => SUP[c]).join('')).replace(/≤/g, '<=').replace(/≥/g, '>=').trim();
const strip = t => tidy(t).replace(/\s*≈.*$/, '').replace(/\.$/, '');                       // "288π cm³ ≈ 904.3 cm³" → "288π cm³"
const neg = s => (s.charAt(0) === '-' ? s.slice(1) : '-' + s);
const val = s => { const m = String(s).match(/^(-?[\d.]+)\/([\d.]+)$/); return m ? m[1] / m[2] : +s; };
const near = (a, b) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b));
const ineq = t => { const m = strip(t).replace(/\s+/g, '').match(/^([a-z])(<=|>=|<|>)(-?[\d.\/]+)$/); return m && { v: m[1], d: m[2].charAt(0), s: m[2].length === 1, n: m[3] }; };
const sci = t => { const m = strip(t).replace(/[\s,]+/g, '').match(/^(-?\d+(?:\.\d+)?)[×x]10\^?(-?\d+)/); return m && { c: +m[1], e: +m[2] }; };
const pair = t => { const m = strip(t).replace(/\s+/g, '').match(/^\((-?[\d.\/]+),(-?[\d.\/]+)\)$/); return m && { x: m[1], y: m[2] }; };
const lin = t => { const m = strip(t).replace(/\s+/g, '').replace(/[()]/g, '').match(/^y=(-?[\d.\/]*)x(?:([+-])([\d.\/]+))?$/); return m && { m: m[1] === '' ? '1' : m[1] === '-' ? '-1' : m[1], b: m[2] ? (m[2] === '-' ? '-' : '') + m[3] : '0' }; };
const kpi = t => { const m = strip(t).replace(/,/g, '').match(/^(\d+(?:\.\d+)?)(?:π\/(\d+)|\/(\d+)\s*π|π)/); return m ? +m[1] / +(m[2] || m[3] || 1) : null; };
const mb = t => { const m = strip(t).replace(/\s+/g, '').match(/^m=(-?[\d.\/]+),?b=(-?[\d.\/]+)$/); return m && { m: m[1], b: m[2] }; };
const mono = t => { const s = strip(t).replace(/\s+/g, ''); if (!/[a-z]|\^/.test(s) || /[=<>π√,;]|[a-z]{3}/i.test(s) || !/^[-\da-z^()\/.]+$/.test(s)) return null;
  const vars = h => (h.match(/[a-z](\^-?\d+)?/g) || []).join(''), parts = s.split('/');
  if (!/[a-z]/.test(s)) return { num: true, c: s.replace(/\^.*$/, ''), e: s.replace(/^[^^]*/, ''), top: '', bot: '' };                 // a power of a number: 5^7
  return { c: s.replace(/\^-?\d+/g, '').replace(/[a-z]/g, '').replace(/\(\)/g, ''), top: vars(parts[0]), bot: vars(parts[1] || ''), e: vars(parts[0]) + '/' + vars(parts[1] || '') }; };
const W = {
  expo: 'Check the exponent. Multiply powers → ADD the exponents. Divide → SUBTRACT. Power of a power → MULTIPLY.', coef: 'Check the number in front. Multiply or divide the front numbers like regular numbers, and raise them to the power too.',
  both: 'Check the number in front AND the exponent. Front numbers: multiply or divide like regular numbers. Exponents: add (multiply), subtract (divide) or multiply (power of a power).',
  flip: 'A negative exponent moves the power to the bottom of a fraction.', negv: 'A negative exponent does NOT make the answer negative. It moves the power to the bottom of a fraction.',
  flipNeg: 'You did not flip the sign. When you multiply or divide by a negative number, flip the inequality sign.',
  flipPos: 'The sign points the wrong way. Only flip the sign when you multiply or divide by a negative number.',
  strict: 'Check the sign. < and > do not include the number (open circle). ≤ and ≥ do include it (closed circle).',
  numSign: 'Check the sign of your number. Redo the last step.', numStep: 'Check your last step. Redo the math to get the number.',
  sciCount: 'The exponent is off by one. Count the decimal moves again (or add or subtract the exponents again).',
  sciRule: 'Check the exponent. To multiply powers of 10, ADD the exponents. To divide, SUBTRACT them.',
  sciForm: 'That is not in scientific notation. The first number must be at least 1 and less than 10.',
  sciFront: 'Check the front number. Multiply (or divide) the front numbers, then fix the exponent.',
  swapXY: 'The order is switched. x comes first, then y: (x, y).', signXY: 'Check the signs. Which coordinate should change sign, and which should stay the same?', anyXY: 'Check each coordinate. x comes first (left and right). y comes second (up and down).',
  swapMB: 'You switched them. The slope is the number WITH x. The y-intercept is the number by itself.', signM: 'Check the sign of the slope. If y goes up as x goes up, the slope is positive. If y goes down, it is negative.',
  signB: 'Check the sign of the y-intercept. It is the value of y when x = 0.', recM: 'Slope is rise over run (change in y ÷ change in x). You wrote run over rise.',
  anyM: 'Check the slope. Slope = change in y ÷ change in x.', anyB: 'Check the y-intercept. It is the value of y when x = 0 (where the line crosses the y-axis).', bothMB: 'Check the slope AND the y-intercept. Slope = change in y ÷ change in x. The y-intercept is y when x = 0.',
  third: 'Check the ⅓. A cone is ⅓πr²h. A cylinder is πr²h (no ⅓). A sphere is ⁴⁄₃πr³.', diam: 'Check the radius. The radius is HALF the diameter. Then square it: r × r.',
  dbl: 'Check the radius. Square it (r × r). Do not double it.', cube: 'Check the radius. It is half the diameter. In a sphere it is cubed: r × r × r.',
  isRight: 'There IS a mistake in the work. Do each line yourself. Find the first line that does not match yours.'
};
function classify(right, wrong, q) {
  let a, b; const R = strip(right), X = strip(wrong);
  const l = T.choices(R, { q, key: 'hw' });                                           // the same rule the practice pages use
  if (l) { const it = T.rightOf(l, X); if (it && it !== T.rightOf(l, R)) { const w = T.why(l, it); if (w) return w; } }
  if ((a = ineq(R)) && (b = ineq(X))) {
    if (a.n === b.n) { if (a.d !== b.d) return new RegExp('-\\s*\\d*\\.?\\d*\\s*' + a.v + '\\b').test(tidy(q)) ? W.flipNeg : W.flipPos; if (a.s !== b.s) return W.strict; }
    return neg(a.n) === b.n ? W.numSign : W.numStep;
  }
  if ((a = sci(R)) && (b = sci(X))) {
    if (near(a.c, b.c)) return b.e === -a.e ? (a.e > 0 ? 'Check the sign of the exponent. A big number gets a positive exponent.' : 'Check the sign of the exponent. A number less than 1 gets a negative exponent.') : Math.abs(a.e - b.e) === 1 ? W.sciCount : W.sciRule;
    return Math.abs(b.c) >= 10 || Math.abs(b.c) < 1 ? W.sciForm : W.sciFront;
  }
  if ((a = pair(R)) && (b = pair(X))) {
    if (a.x === b.y && a.y === b.x) return W.swapXY;
    if ((b.x === neg(a.x) || b.x === a.x) && (b.y === neg(a.y) || b.y === a.y)) return W.signXY;
    return /system|solution|both|cross|intersect/i.test(q) ? 'That point does not work in BOTH equations. Put x and y into each equation to check.' : W.anyXY;
  }
  if ((a = lin(R)) && (b = lin(X))) {
    const sm = a.m === b.m, sb = a.b === b.b;
    if (a.m === b.b && a.b === b.m) return W.swapMB;
    if (sb && b.m === neg(a.m)) return W.signM; if (sm && b.b === neg(a.b)) return W.signB;
    if (sb && near(val(a.m) * val(b.m), 1)) return W.recM;
    return sb ? W.anyM : sm ? W.anyB : W.bothMB;
  }
  if ((a = kpi(R)) != null && (b = kpi(X)) != null && a > 0) {
    const r = b / a, shapes = (tidy(q).match(/cylinder|cone|sphere|ball/gi) || []).map(s => s.toLowerCase()).filter((s, i, arr) => arr.indexOf(s) === i);
    if (shapes.length <= 1) {
      if (near(r, 3) || near(r, 1 / 3)) return W.third; if (near(r, 4) || near(r, 0.25)) return W.diam;
      if (near(r, 2) || near(r, 0.5)) return W.dbl; if (near(r, 8) || near(r, 0.125)) return W.cube;
    }
    return '';
  }
  if ((a = mb(R)) && (b = mb(X))) {
    if (a.m === b.b && a.b === b.m) return W.swapMB; if (a.b === b.b && b.m === neg(a.m)) return W.signM; if (a.m === b.m && b.b === neg(a.b)) return W.signB;
    return a.b === b.b ? W.anyM : a.m === b.m ? W.anyB : W.bothMB;
  }
  if ((a = mono(R)) && (b = mono(X))) {
    const sc = a.c === b.c, se = a.e === b.e, front = /\d/.test(a.c.replace(/^1?\/?$/, ''));
    if (a.num || b.num) return a.c !== b.c ? 'Keep the base the same. Only the exponents change.' : W.expo;
    if (/^-/.test(X) && !/^-/.test(R) && a.bot) return W.negv;
    if (a.bot && !b.bot && a.top + a.bot === b.top + b.bot) return W.flip;
    if (a.top && a.bot && a.top === b.bot && a.bot === b.top) return 'You have it upside down. Check which part goes on top and which goes on the bottom.';
    if (sc && !se) return (front ? 'The number in front is right. ' : '') + W.expo;
    if (!sc && se) return 'The exponents are right. ' + W.coef;
    return W.both;
  }
  if (/^[<>=]$/.test(R) && /^[<>=]$/.test(X)) return X === '=' ? 'These two numbers are not equal. Change both to decimals, then compare.' : 'The sign points the wrong way. The open side of < and > faces the BIGGER number. Change both numbers to decimals to check.';
  if (/^[A-Z][a-zA-Z]+ is (right|correct)\b/.test(X)) return W.isRight;
  // an answer with two parts ("x = 12; ∠2 = 58°"): find the part that is wrong and name its mistake
  const pr = R.split(/\s*;\s*|,\s{2,}/), px = X.split(/\s*;\s*|,\s{2,}/);
  if (pr.length > 1 && pr.length === px.length) { const d = pr.map((t, i) => i).filter(i => pr[i] !== px[i]);
    if (d.length === 1) { const sub = classify(pr[d[0]], px[d[0]], q); if (sub || d[0] > 0) return ((d[0] > 0 ? 'The first part is right. Check the next part. ' : 'Check the first part. ') + (sub || '')).trim(); } }
  const nw = T.numWhy(X, R, q, '\u0001'); if (nw !== '\u0001') return nw;
  return '';
}
const GEN = T.hint('', '');
const UNITDEF = {
  1: ['Change each number to a decimal if you can. A decimal that stops or repeats is rational. One that never stops and never repeats is irrational.', 'Common mistake: thinking every square root or every long decimal is irrational. √25 = 5 is rational, and repeating decimals are rational.'],
  2: ['Same base: multiply → ADD the exponents. Divide → SUBTRACT. Power of a power → MULTIPLY. A negative exponent moves the power to the bottom. Anything to the 0 power is 1.', 'Common mistakes: multiplying exponents when you should add them, and making the answer negative because of a negative exponent.'],
  3: ['Undo each step in reverse order, and do the same thing to both sides. Distribute and combine like terms first. Check your answer by putting it back in.', 'Common mistakes: a sign error, doing a step to only one side, and not distributing to every term.'],
  4: ['Name the angle pair first. Vertical angles are equal. Angles on a straight line add to 180°. The angles of a triangle add to 180°. With parallel lines, matching angles are equal.', 'Common mistake: mixing up "equal" and "add to 180°". Vertical, corresponding and alternate angles are EQUAL. A straight line and same-side interior angles ADD to 180°.'],
  5: ['Use a² + b² = c². c is the hypotenuse, the longest side. To find a leg, subtract: c² − a². Take the square root at the end.', 'Common mistakes: adding the sides without squaring them, forgetting the square root at the end, and adding when you should subtract to find a leg.'],
  6: ['Use y = mx + b. m is the slope (the rate of change). b is the y-intercept (the value of y when x = 0).', 'Common mistakes: switching the slope and the y-intercept, and losing a negative sign.'],
  7: ['Look at the dots as a group. Up to the right is a positive association. Down to the right is negative. For a table, divide the part by the total of the group the question names.', 'Common mistakes: mixing up positive and negative, and dividing by the wrong total.'],
  8: ['Translation = slide (add or subtract). Reflection = flip (one sign changes). Rotation = turn. Dilation = multiply by the scale factor.', 'Common mistakes: changing the wrong coordinate, changing the wrong sign, and ADDING the scale factor when you should multiply.'],
  9: ['Cylinder: V = πr²h. Cone: V = ⅓πr²h. Sphere: V = ⁴⁄₃πr³. The radius is half the diameter.', 'Common mistakes: using the diameter instead of the radius, forgetting the ⅓ on a cone, and squaring the radius on a sphere (it is cubed).']
};
// each unit's own skills are tried first (a spiral-review problem still finds its own skill after these)
const PREFER = { 1: ['conv', 'rat', 'root', 'order'], 2: ['sci', 'exp'], 3: ['ineq', 'nsol'], 4: ['par', 'ext', 'vert', 'supp', 'comp', 'tri'], 5: ['pyth', 'root'], 6: ['sys', 'fn', 'slope', 'line', 'story'], 7: ['two', 'scat'], 8: ['dil', 'tra', 'ref', 'rot', 'cong'], 9: ['sph', 'cone', 'cyl'] };
const jobs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const out = jobs.map(j => {
  const rt = typeof j.right === 'number' && j.choices ? j.choices[j.right] : (j.right == null ? '' : String(j.right)), q = j.q || '';
  const pf = PREFER[String(j.id).split('.')[0]] || null;
  let hint = T.hint(rt, q, pf), mis = T.miss(rt, q, pf);
  if (hint === GEN) { hint = T.hint(rt, q + ' ' + (j.title || ''), pf); mis = T.miss(rt, q + ' ' + (j.title || ''), pf); }
  const ud = UNITDEF[String(j.id).split('.')[0]]; if (hint === GEN && ud) { hint = ud[0]; mis = ud[1]; }                                 // still nothing: the unit's own reminder           // nothing in the words: go by the homework's topic
  const why = (j.choices || []).map((c, i) => (typeof j.right !== 'number' || i === j.right || !c) ? '' : classify(rt, c, q));
  return { id: j.id, hint, mis, why };
});
process.stdout.write(JSON.stringify(out));
