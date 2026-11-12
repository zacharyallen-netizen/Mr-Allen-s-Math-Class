// Homework help, topic by topic (review Nov 12, 2026: many hints/notes were about the wrong topic, and sphere notes said "square").
// 1) tag every note text (T) with a topic family, 2) tag every problem from its own printed words,
// 3) any hint / common-mistakes / choice note whose family does not fit the problem is replaced by that topic's own help.
const fs = require('fs');
const D = require('/home/claude/fix/hw_help_decoded.json'), TX = require('/home/claude/fix/hw_text.json');

// topic → [hint, common mistakes]. New texts are written here (plain, 5th-grade level).
const HELP = {
  ri:    ['Change the number to a decimal if you can. A decimal that stops or repeats is rational. One that never stops and never repeats is irrational.', 'Common mistake: thinking every square root or every long decimal is irrational. √25 = 5 is rational, and repeating decimals are rational.'],
  cls:   ['Natural: 1, 2, 3 … Whole: add 0. Integer: add the negatives. Rational: fractions and decimals that stop or repeat. A number can be in more than one group.', 'Common mistake: picking only one group. −5 is an integer AND rational. 4 is natural, whole, integer AND rational.'],
  dec:   ['Fraction → decimal: divide the top by the bottom. Repeating decimal → fraction: put the repeating digits over the same number of 9s (0.4 repeating = 4/9).', 'Common mistakes: dividing the bottom by the top, and using the wrong place value (0.25 is 25/100, not 25/10).'],
  sqrt:  ['Square root: find the number that times ITSELF makes it (6 × 6 = 36, so √36 = 6). To estimate, find the perfect squares on each side (1, 4, 9, 16, 25, 36, 49, 64, 81, 100).', 'Common mistake: dividing by 2 instead of finding the square root. √36 is 6, not 18.'],
  cbrt:  ['Cube root: find the number that times itself THREE times makes it (2 × 2 × 2 = 8, so ∛8 = 2). A cube with volume V has edge ∛V.', 'Common mistake: dividing by 3 instead of finding the cube root. ∛27 is 3, not 9.'],
  order: ['Change each number to a decimal first (√10 ≈ 3.16, π ≈ 3.14). Then put them in order. Read the question: least to greatest, or greatest to least?', 'Common mistakes: comparing numbers by how they look instead of as decimals, and writing the order backward.'],
  exp:   ['Same base: multiply → ADD the exponents. Divide → SUBTRACT. Power of a power → MULTIPLY. A negative exponent moves the power to the bottom. Anything to the 0 power is 1.', 'Common mistakes: multiplying exponents when you should add them, and making the answer negative because of a negative exponent.'],
  sci:   ['Move the decimal until ONE digit (1 to 9) is in front. Count the moves: that is the exponent. Big number → positive exponent. Small number → negative exponent.', 'Common mistakes: the wrong sign on the exponent, counting the decimal moves wrong, and leaving the front number 10 or bigger.'],
  eq:    ['Undo each step in reverse order, and do the same thing to both sides. Distribute and combine like terms first. Check your answer by putting it back in.', 'Common mistakes: a sign error, doing a step to only one side, and not distributing to every term.'],
  ineq:  ['Solve it like an equation: undo each step on both sides. If you multiply or divide by a NEGATIVE number, flip the sign.', 'Common mistakes: not flipping the sign after you multiply or divide by a negative, and mixing up < with ≤.'],
  nsol:  ['Simplify both sides. x = a number means one solution. A false statement like 2 = 5 means no solution. A true statement like 3 = 3 means infinitely many.', 'Common mistake: stopping too early. Simplify BOTH sides all the way, then compare the x-terms and the numbers.'],
  word:  ['Read the question again and underline what it asks for. Write an equation from the words: "each" or "per" goes with x, a one-time amount is the number by itself. Then solve.', 'Common mistakes: putting the one-time amount with x, and answering a different question than the one asked.'],
  check: ['Put the number in for x on BOTH sides. Do the math on each side. If the two sides are equal, it is a solution.', 'Common mistakes: putting the number in only one side, and a math slip with negative numbers.'],
  ang:   ['Name the angle pair first. Vertical angles are equal. Angles on a straight line add to 180°. The angles of a triangle add to 180°. With parallel lines, look for corresponding, alternate or same-side angles.', 'Common mistake: mixing up "equal" and "add to 180°". Vertical, corresponding and alternate angles are EQUAL. A straight line and same-side interior angles add to 180°.'],
  tri:   ['The three angles of a triangle add to 180°. Add the ones you know and subtract from 180. An exterior angle equals the two far inside angles added.', 'Common mistakes: an adding error, using 360 instead of 180, and subtracting when you should add the two far angles.'],
  peri:  ['Perimeter = add all the sides. Write the equation (side + side + side = perimeter), solve for x, then put x into EACH side.', 'Common mistakes: stopping at x instead of finding the sides, and a slip when you put x back in.'],
  pyth:  ['Use a² + b² = c². c is the hypotenuse, the longest side. To find a leg, subtract: c² − a². Take the square root at the end.', 'Common mistakes: adding the sides without squaring them, forgetting the square root at the end, and adding when you should subtract to find a leg.'],
  dist:  ['Draw a right triangle. Across = the difference of the x\'s. Up/down = the difference of the y\'s. Then a² + b² = c², and take the square root.', 'Common mistakes: subtracting a negative wrong (4 − (−2) = 6), adding the legs without squaring, and forgetting the square root.'],
  func:  ['A function gives each input exactly ONE output. Domain = the inputs (x). Range = the outputs (y). To evaluate f(x), put the number in for x.', 'Common mistakes: mixing up inputs (x) and outputs (y), and thinking a repeated OUTPUT breaks a function. Only a repeated INPUT with different outputs does.'],
  graph: ['Read the graph left to right. Going up means increasing, going down means decreasing, flat means no change. A steeper line means a faster change.', 'Common mistake: reading a flat part as going down. Flat means NO change. Steeper means faster.'],
  slope: ['Slope = change in y ÷ change in x. Subtract the y-values, subtract the x-values in the same order, then divide.', 'Common mistakes: putting the change in x on top, and subtracting in a different order on the top and the bottom.'],
  line:  ['Use y = mx + b. m is the slope (the rate of change). b is the y-intercept (the value of y when x = 0).', 'Common mistakes: switching the slope and the y-intercept, and losing a negative sign.'],
  sys:   ['The solution of a system is the point where the lines cross. It must make BOTH equations true. For substitution, set the two expressions for y equal.', 'Common mistake: checking the point in only one equation. It must work in BOTH.'],
  scat:  ['Look at the dots as a group. Up to the right is a positive association. Down to the right is negative. An outlier is a dot far from the pattern.', 'Common mistake: mixing up positive and negative. Read the dots left to right: up is positive, down is negative.'],
  table: ['Find the row or column the question names. Divide the part by THAT total, then change it to a percent.', 'Common mistake: dividing by the wrong total. Use the total of the group the question names.'],
  tl:    ['A translation slides the point. Right and up add. Left and down subtract. Left and right change x. Up and down change y.', 'Common mistakes: moving the wrong way (left and down subtract) and changing the wrong coordinate.'],
  rf:    ['A reflection flips the point. Over the x-axis: y changes sign. Over the y-axis: x changes sign.', 'Common mistake: changing the wrong sign. Over the x-axis, y changes. Over the y-axis, x changes.'],
  ro:    ['A rotation turns the point about the origin. 180°: both signs change. 90° counterclockwise: (x, y) → (−y, x). 90° clockwise: (x, y) → (y, −x).', 'Common mistakes: forgetting to switch x and y on a 90° turn, and changing the wrong sign.'],
  dil:   ['A dilation multiplies. Multiply every coordinate (or side) by the scale factor. More than 1 → bigger. Between 0 and 1 → smaller. Area grows by the scale factor SQUARED.', 'Common mistakes: adding the scale factor instead of multiplying, and multiplying the area by k instead of k².'],
  cong:  ['Slides, flips and turns keep the size (congruent). A dilation changes the size (similar). Matching sides of similar figures use the same scale factor.', 'Common mistake: calling figures congruent after a dilation. A dilation changes the size, so they are only similar.'],
  tr:    ['Translation = slide (add or subtract). Reflection = flip (one sign changes). Rotation = turn. Dilation = multiply by the scale factor.', 'Common mistakes: changing the wrong coordinate, changing the wrong sign, and ADDING the scale factor when you should multiply.'],
  cyl:   ['Cylinder: V = πr²h. Square the radius first (r × r), then multiply by the height. The radius is half the diameter.', 'Common mistakes: using the diameter instead of the radius, and doubling the radius instead of squaring it.'],
  cone:  ['Cone: V = ⅓πr²h. Square the radius, multiply by the height, then take one third.', 'Common mistakes: forgetting the ⅓, using the diameter instead of the radius, and not squaring the radius.'],
  sph:   ['Sphere: V = ⁴⁄₃πr³. Cube the radius first (r × r × r). If you are given the diameter, cut it in half to get the radius.', 'Common mistakes: squaring the radius instead of cubing it, using the diameter, and forgetting the ⁴⁄₃.'],
  vol:   ['Pick the formula first. Cylinder: πr²h. Cone: ⅓πr²h. Sphere: ⁴⁄₃πr³. The radius is half the diameter.', 'Common mistakes: using the wrong formula, using the diameter instead of the radius, and forgetting the ⅓ for a cone.'],
};
// families: a note fits a problem if they share a family (and for volume/transformations, the same shape/move or a general note)
const FAM = { ri: 'num', cls: 'num', dec: 'num', sqrt: 'num', cbrt: 'root', order: 'num', exp: 'exp', sci: 'exp', eq: 'eq', ineq: 'eq', nsol: 'eq', word: 'eq', check: 'eq',
  ang: 'ang', tri: 'ang', peri: 'eq', pyth: 'pyth', dist: 'pyth', func: 'fun', graph: 'fun', slope: 'fun', line: 'fun', sys: 'fun', scat: 'stat', table: 'stat',
  tl: 'tr', rf: 'tr', ro: 'tr', dil: 'tr', cong: 'tr', tr: 'tr', cyl: 'vol', cone: 'vol', sph: 'vol', vol: 'vol' };

// topic of each existing note text (by its words); null = topic-neutral ("check your sign", "the first part is right"…)
function noteTopic(t) {
  if (!t) return null;
  const s = t.toLowerCase();
  if (/sphere|⁴⁄₃|cubed: r × r × r|cube the radius/.test(s)) return 'sph';
  if (/cone|⅓/.test(s)) return 'cone';
  if (/cylinder|square the radius|square it \(r × r\)|doubled the radius|radius/.test(s)) return 'cyl';
  if (/translation|slide|left and down|wrong coordinate/.test(s)) return 'tl';
  if (/reflection|over the x-axis/.test(s)) return 'rf';
  if (/rotation|90° turn|switch x and y/.test(s)) return 'ro';
  if (/dilation|scale factor/.test(s)) return 'dil';
  if (/congruent|similar/.test(s)) return 'cong';
  if (/which coordinate should change sign/.test(s)) return 'tr';
  if (/dots|association|outlier/.test(s)) return 'scat';
  if (/total|percent/.test(s)) return 'table';
  if (/both equations|system|lines cross/.test(s)) return 'sys';
  if (/y = mx \+ b|y-intercept|switched them\. the slope/.test(s)) return 'line';
  if (/slope|rise over run|change in y/.test(s)) return 'slope';
  if (/graph left to right|flat part|steeper/.test(s)) return 'graph';
  if (/linear means/.test(s)) return 'line';
  if (/function|input|domain/.test(s)) return 'func';
  if (/x comes first, then y|each coordinate/.test(s)) return 'tr';
  if (/a² \+ b²|hypotenuse|square root at the end|stopped one step early/.test(s)) return 'pyth';
  if (/triangle add to 180|360 instead of 180|exterior|far .*angles/.test(s)) return 'tri';
  if (/angle|vertical|90°|180°|straight line|parallel/.test(s)) return 'ang';
  if (/one solution|no solution|infinitely|false statement|stopping too early/.test(s)) return 'nsol';
  if (/flip|inequality|< with ≤|do not include the number/.test(s)) return 'ineq';
  if (/scientific notation|decimal moves|decimal until|front number|powers of 10|exponent is off by one|big number gets|less than 1 gets/.test(s)) return 'sci';
  if (/exponent|same base|base the same|negative exponent|number in front|numbers in front|upside down/.test(s) && !/both sides/.test(s)) return 'exp';
  if (/distribut|both sides|undo each step|reverse order/.test(s)) return 'eq';
  if (/√36|square root|perfect squares/.test(s)) return 'sqrt';
  if (/natural: 1, 2, 3/.test(s)) return 'cls';
  if (/rational|irrational/.test(s)) return 'ri';
  if (/fraction|decimal|place value/.test(s)) return 'dec';
  if (/order is backward|compare|bigger number|not equal/.test(s)) return 'order';
  return null;
}
// topic of a problem, from its printed words (+ homework title)
const TITLE = {};
for (const f of fs.readdirSync('/home/claude/mr-allen-s-math-class/grade8/homework')) { const m = f.match(/^HW_([\dE]+\.\d+)_(.*)\.pdf$/); if (m) TITLE[m[1]] = m[2].replace(/_/g, ' '); }
function probTopic(hw, n, q, choices) {
  const t = ((TX[hw] && TX[hw][n]) || '') + ' ' + q + ' ' + (Array.isArray(choices) ? choices : []).join(' ');
  const s = t.toLowerCase(), title = (TITLE[hw] || '').toLowerCase();
  if (/hemisphere|sphere|ball|globe/.test(s)) return 'sph';
  if (/\bcone/.test(s)) return 'cone';
  if (/cylinder|can\b|tank|pipe/.test(s) && /volume|πr|holds|radius|height/.test(s)) return 'cyl';
  if (/cube-shaped|cube root|∛|edge/.test(s)) return 'cbrt';
  if (/volume/.test(s)) return 'vol';
  if (/translat|slide/.test(s) && !/ladder/.test(s)) return 'tl';
  if (/reflect/.test(s)) return 'rf';
  if (/rotat|turn/.test(s)) return 'ro';
  if (/dilat|scale factor|k =/.test(s)) return 'dil';
  if (/congruent|similar/.test(s)) return 'cong';
  if (/transform|image|maps/.test(s)) return 'tr';
  if (/scatter|association|outlier|line of fit|trend/.test(s)) return 'scat';
  if (/two-way|frequency|relative|survey|table shows/.test(s) && /percent|%|total|frequency/.test(s)) return 'table';
  if (/system|both equations|intersect/.test(s)) return 'sys';
  if (/distance|between the points|between \(/.test(s) && /\(/.test(s)) return 'dist';
  if (/hypotenuse|right triangle|pythag|a² \+ b²|ladder|diagonal|\bleg/.test(s)) return 'pyth';
  if (/domain|range|function|input|output|mapping|f\(/.test(s)) return 'func';
  if (/increas|decreas|graph shows|describe the graph|nonlinear|linear\?/.test(s) && !/slope/.test(s)) return 'graph';
  if (/slope|rate of change|rise|run/.test(s) && !/y-intercept|y = |point-slope|initial value/.test(s)) return 'slope';
  if (/y-intercept|y ?= ?−?\d*x|point-slope|standard form|initial value|slope-intercept|equation of the line/.test(s)) return 'line';
  if (/perimeter/.test(s)) return 'peri';
  if (/exterior|triangle/.test(s) && /angle|°/.test(s)) return 'tri';
  if (/angle|°|parallel|transversal|vertical|supplement|complement|linear pair/.test(s)) return 'ang';
  if (/how many solutions|no solution|infinitely|one solution/.test(s)) return 'nsol';
  if (/is .* a solution|is x = .* a solution|check .*solution/.test(s)) return 'check';
  if (/[<>≤≥]|inequalit|at least|at most|no more than/.test(s) && /[a-z]/.test(s) && /solve|inequalit|at least|at most|no more|graph/.test(s)) return 'ineq';
  if (/scientific notation|× ?10|standard form/.test(s)) return 'sci';
  if (/exponent|power|[a-z][⁰¹²³⁴⁵⁶⁷⁸⁹⁻]|\d[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]/.test(s) && !/√/.test(s)) return 'exp';
  if (/solve|equation|x =|find x/.test(s)) return /each|per|cost|plan|weeks|months|hours|members|tickets/.test(s) ? 'word' : 'eq';
  if (/rational|irrational/.test(s)) return 'ri';
  if (/least|greatest|order|number line|compare|circle the sign|>|</.test(s)) return 'order';
  if (/√|square root|perfect square|estimate/.test(s)) return 'sqrt';
  if (/natural|whole|integer/.test(s)) return 'cls';
  if (/rational|irrational/.test(s)) return 'ri';
  if (/repeating|decimal|fraction/.test(s)) return 'dec';
  // fall back to the homework title
  for (const [re, tp] of [[/scientific/, 'sci'], [/exponent/, 'exp'], [/equation/, 'eq'], [/inequal/, 'ineq'], [/angle|parallel|triangle/, 'ang'], [/pythag|distance/, 'pyth'], [/function/, 'func'], [/slope|linear|standard|point/, 'line'], [/scatter/, 'scat'], [/two way/, 'table'], [/transform|dilation/, 'tr'], [/volume/, 'vol'], [/real number|rns|number/, 'ri']])
    if (re.test(title)) return tp;
  return null;
}
const fits = (noteTp, probTp) => {
  if (!noteTp || !probTp) return true;                       // neutral note, or unknown problem: leave it
  if (noteTp === probTp) return true;
  if (FAM[noteTp] !== FAM[probTp]) {
    if (FAM[probTp] === 'ang' && FAM[noteTp] === 'eq') return false;     // angle problems get angle help
    if (probTp === 'peri' && FAM[noteTp] === 'eq') return true;
    if ((probTp === 'word' || probTp === 'check') && FAM[noteTp] === 'eq') return true;
    return false;
  }
  if (FAM[probTp] === 'vol') return noteTp === 'vol' || probTp === 'vol';    // a cylinder note never on a sphere problem
  if (FAM[probTp] === 'tr') return noteTp === 'tr' || probTp === 'tr' || (probTp === 'cong' && noteTp === 'dil');
  if (FAM[probTp] === 'root') return false;                                 // square-root help is not cube-root help
  if (FAM[probTp] === 'fun') return !(noteTp === 'sys' || probTp === 'sys') && !(noteTp === 'graph' && probTp !== 'graph') && !(probTp === 'graph' && noteTp !== 'graph');
  return true;
};
module.exports = { HELP, FAM, noteTopic, probTopic, fits, D, TX };

if (require.main === module) {
  let bad = 0, rows = [];
  for (const hw in D) for (const n in D[hw]) {
    const o = D[hw][n], tp = probTopic(hw, n, o.q, o.choices);
    const hT = noteTopic(o.h), mT = noteTopic(o.m);
    const wb = (o.w || []).map((t, k) => (o.right || []).includes('ABCDEF'[k]) ? null : (fits(noteTopic(t), tp) ? null : 'ABCDEF'[k] + ':' + noteTopic(t)));
    const issues = [!fits(hT, tp) && 'hint:' + hT, !fits(mT, tp) && 'mist:' + mT].concat(wb).filter(Boolean);
    if (issues.length) { bad++; rows.push(`${hw} #${n} [${tp}] ${issues.join(' ')} | ${((TX[hw] || {})[n] || '').slice(0, 70)}`); }
  }
  console.log(rows.join('\n')); console.log('problems with a mismatch:', bad);
}
