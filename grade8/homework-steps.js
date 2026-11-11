/* Step-by-step workspace data for homework_turn_in.html (read by step-work.js).
   Problems are copied from the homework PDFs (grade8/homework/HW_*.pdf). No new problems.
   start: the equation to solve        setup: the value of x; the student writes the equation first
   then:  values to find after solving (angles, side lengths)          v: the letter used in the problem
   Every answer is checked in _build/test_homework_steps.js. */
(function () {
  var H = {
    straight: 'The angles make a straight line, so they add to <b>180°</b>.',
    right: 'The angles make a right angle, so they add to <b>90°</b>.',
    comp: 'Complementary angles add to <b>90°</b>.',
    point: 'Angles all the way around a point add to <b>360°</b>.',
    vertical: '<b>Vertical angles</b> (across from each other) are <b>equal</b>.',
    neighbors: 'Neighbor angles where two lines cross make a straight line. They add to <b>180°</b>.',
    parallel: 'Use the parallel lines. Corresponding and alternate angles are <b>equal</b>. Same-side interior angles add to <b>180°</b>. Angles on a straight line add to <b>180°</b>.',
    triangle: 'The three angles of a triangle add to <b>180°</b>.',
    exterior: 'An exterior angle equals the <b>sum of the two remote interior angles</b>.'
  };
  var PY = 'Use the Pythagorean Theorem: <i>a</i><sup>2</sup> + <i>b</i><sup>2</sup> = <i>c</i><sup>2</sup>. The legs are <i>a</i> and <i>b</i>. The hypotenuse <i>c</i> is the longest side, across from the right angle.';
  var DI = 'Make a right triangle. The horizontal distance and the vertical distance between the points are the legs. Then use <i>a</i><sup>2</sup> + <i>b</i><sup>2</sup> = <i>c</i><sup>2</sup>.';
  var BOX = 'First find the diagonal across the bottom of the box (use the length and width). Then use that diagonal and the height as the legs of a second right triangle.';
  var VOL = 'Start with the volume formula. Cylinder: <i>V</i> = π<i>r</i><sup>2</sup><i>h</i>. Cone: <i>V</i> = ⅓π<i>r</i><sup>2</sup><i>h</i>. Put in the numbers you know, and use a letter for the one you don\'t.';
  function vol(ans) { return { setup: ans, any: 1, positive: 1, pi: 1, roots: 1, hint: VOL }; }
  function py(ans, hint, more) { var o = { setup: ans, any: 1, positive: 1, fig: 1, hint: hint || PY }; for (var k in more || {}) o[k] = more[k]; return o; }
  window.HW_STEPS = {
    '3.1': { 1: { start: 'x − 6 = 11' }, 2: { start: '5x = 45' }, 3: { start: '2x − 7 = 9' }, 5: { start: 'x/4 + 5 = 8' },
             7: { start: 'x/2 − 3 = 5' }, 9: { start: '2m + 3 = 17', v: 'm' }, 10: { start: '4x + 8 = 20' } },
    '3.2': { 1: { start: '−6x = −42' }, 2: { start: '3/5x = 12' }, 3: { start: '4x + 9 = 1' },
             5: { setup: 7, v: 'n', hint: '"Three times a number" is 3<i>n</i>. "Five less than" means subtract 5 from it. "Is" means =.', prompt: 'Use <i>n</i> for the number. Write an equation for “Five less than three times a number is 16.”' },
             7: { start: '−x/4 + 6 = 2' }, 9: { start: '30h + 45 = 150', v: 'h' }, 10: { start: '3/5x = 9' } },
    '3.3': { 1: { start: '4(x − 2) = 20' }, 2: { start: '6x + 5 = 3x + 20' }, 5: { start: '8x − 1 = 5x + 17' },
             7: { start: '3(2x − 1) = 2x + 13' }, 9: { start: '50 + 15w = 90 + 5w', v: 'w' } },
    '3.4': { 1: { start: '3(x − 1) + 2x = 22' }, 2: { start: '7x − 4 = 3(x + 4)' }, 5: { start: '−x/3 + 2 = 6' },
             7: { start: '6x + 2 = 3(x + 8)' },
             9: { start: 'x + (x + 2) + (2x − 1) = 25', then: [{ label: 'side x + 2', expr: 'x + 2' }, { label: 'side 2x − 1', expr: '2x − 1' }] },
             10: { start: '4(x − 1) = 2x + 5' } },
    '3.5': { 1: { start: '1/3x + 2 = 7' }, 2: { start: 'x/5 − 3/5 = 2' }, 5: { start: '9x − 4 = 5x + 16' }, 7: { start: '2/5x + 1 = 1/5x + 3' },
             8: { start: '(x − 4)/3 = x/5' }, 9: { start: '1/2m + 1/5m + 12 = m', v: 'm' }, 10: { start: '2/3(x + 6) = 10' } },
    '3.6': { 1: { start: '0.5x + 2.5 = 4' }, 2: { start: '−3(x + 2) = x − 14' }, 3: { start: 'x/2 + 1/3 = 2' }, 5: { start: '2(x + 3) − 4 = x + 8' },
             7: { start: '1/4(x + 8) = 1/2x − 1' }, 9: { start: '25 + 10m = 5 + 14m', v: 'm' } },
    '3.7': { 2: { start: 'x/4 + 3 = 5' }, 4: { start: 'x − 5 < 2' }, 5: { start: '5(x − 1) = 2x + 13' }, 6: { start: '−4x ≥ 12' },
             7: { start: '5x − 2 = 5x + 3' }, 10: { start: '10 + 8t ≤ 50', v: 't' } },
    '3.8': { 1: { start: '4x + 9 = 4x + 9' }, 2: { start: '2(x + 1) = 2x + 5' }, 4: { start: 'x + 3 ≥ 1' }, 5: { start: '−2(x + 1) = x − 11' },
             6: { start: '−4x − 3 > 9' }, 7: { start: '7x − 3(x + 2) = 4x − 6' }, 10: { start: '28 + 9h ≥ 100', v: 'h' } },
    '3.9': { 2: { setup: 4, v: 't', hint: 'Cost of <i>t</i> tickets + cost of the popcorn = the total she spent.', prompt: 'Use <i>t</i> for the number of tickets. Write an equation.' },
             3: { start: '3x + 2 = 3x + 5' },
             4: { setup: 7, v: 'n', hint: '"Five times a number" is 5<i>n</i>. "Four less than" means subtract 4. "Is" means =.', prompt: 'Use <i>n</i> for the number. Write an equation.' },
             5: { start: '2/3x + 4 = 10' },
             6: { setup: 300, v: 'm', hint: 'Write the cost of Plan A and the cost of Plan B for <i>m</i> minutes. Set them equal.', prompt: 'Use <i>m</i> for the minutes. Write an equation.' },
             8: { setup: 7, v: 'q', ineq: true, hint: '"At least" means ≥. Points he has + points from <i>q</i> quizzes ≥ points he needs.', prompt: 'Use <i>q</i> for the number of quizzes. Write an inequality.' },
             9: { start: '2(2w + 1) + 2w = 50', v: 'w', then: [{ label: 'length 2w + 1', expr: '2w + 1' }] } },
    '3.10': { 1: { start: '3(x + 2) − 2x = 4(x − 3)' }, 2: { start: '2/3x − 4 = 1/3x + 1' }, 3: { start: '3x − 7 = 3x + 2' }, 4: { start: '9 − 2x = 1' },
              5: { start: '6 − 2x ≤ 10' },
              7: { setup: 9, v: 'w', ineq: true, hint: '"At least" means ≥. Money she has + money she saves in <i>w</i> weeks ≥ money she needs.', prompt: 'Use <i>w</i> for the weeks. Write an inequality.' },
              8: { start: '4(x + 1) − x = 3x + 4' }, 10: { start: '20 − 2h = 14 − h', v: 'h' } },
    '4.1': { 1: { setup: 107, fig: 1, hint: H.straight }, 2: { setup: 49, fig: 1, hint: H.right },
             6: { setup: 25, fig: 1, hint: H.straight, then: [{ label: '4x', expr: '4x', unit: '°' }, { label: '2x + 30', expr: '2x + 30', unit: '°' }] },
             8: { setup: 36, hint: H.comp, prompt: 'Use <i>x</i> for the smaller angle. Then the larger one is <i>x</i> + 18. Write an equation.', then: [{ label: 'larger angle x + 18', expr: 'x + 18', unit: '°' }] },
             10: { setup: 36, fig: 1, hint: H.neighbors, then: [{ label: '4x', expr: '4x', unit: '°' }] } },
    '4.2': { 1: { setup: 75, fig: 1, hint: H.point }, 2: { setup: 85, fig: 1, hint: H.straight },
             6: { setup: 35, fig: 1, hint: H.straight, then: [{ label: '2x', expr: '2x', unit: '°' }, { label: 'x + 40', expr: 'x + 40', unit: '°' }] },
             8: { setup: 20, hint: H.comp, then: [{ label: '∠1 = 3x', expr: '3x', unit: '°' }] },
             10: { setup: 36, fig: 1, hint: H.point, then: [{ label: '2x', expr: '2x', unit: '°' }, { label: '3x', expr: '3x', unit: '°' }, { label: '4x', expr: '4x', unit: '°' }] } },
    '4.3': { 3: { setup: 128, fig: 1, hint: H.parallel }, 4: { setup: 117, fig: 1, hint: H.parallel },
             6: { setup: 20, fig: 1, hint: H.parallel, then: [{ label: '4x − 6', expr: '4x − 6', unit: '°' }] },
             8: { setup: 40, hint: H.straight } },
    '4.4': { 3: { setup: 79, fig: 1, hint: H.parallel }, 4: { setup: 51, fig: 1, hint: H.straight },
             6: { setup: 13, fig: 1, hint: H.parallel, then: [{ label: '6x − 14', expr: '6x − 14', unit: '°' }] },
             8: { setup: 25, fig: 1, hint: H.parallel },
             10: { setup: 40, fig: 1, hint: H.parallel, then: [{ label: 'x + 15', expr: 'x + 15', unit: '°' }, { label: '3x + 5', expr: '3x + 5', unit: '°' }] } },
    '4.5': { 1: { setup: 72, fig: 1, hint: H.triangle }, 2: { setup: 125, fig: 1, hint: H.exterior }, 3: { setup: 75, fig: 1, hint: H.exterior },
             6: { setup: 25, fig: 1, hint: H.triangle, then: [{ label: '3x + 5', expr: '3x + 5', unit: '°' }, { label: '2x', expr: '2x', unit: '°' }, { label: 'x + 25', expr: 'x + 25', unit: '°' }] },
             8: { setup: 17, hint: H.comp } },
    '4.6': { 1: { setup: 114, fig: 1, hint: H.straight }, 3: { setup: 62, fig: 1, hint: H.triangle + ' The small square marks a 90° angle.' },
             6: { setup: 10, fig: 1, hint: H.vertical, then: [{ label: '4x + 12', expr: '4x + 12', unit: '°' }] },
             7: { setup: 12, fig: 1, hint: H.parallel, then: [{ label: '4x + 10', expr: '4x + 10', unit: '°' }] } },
    '5.1': { 1: py(17), 3: py(5, PY + ' Each square\'s area is a side times itself.'), 6: py(8),
             10: py(7, PY, { prompt: 'Use a letter for the width. Write an equation for the right triangle made by the diagonal.', then: [{ label: 'perimeter 2(24 + width)', expr: '2(24 + x)', unit: ' in' }] }) },
    '5.2': { 4: py(25), 5: py(8), 8: py(30), 10: py(10, PY, { prompt: 'Use <i>c</i> for how long the longest side would need to be. Write the equation for a right triangle with legs 6 and 8.' }) },
    '5.3': { 1: py({ root: 89 }), 2: py({ root: 95 }), 3: py(16), 6: py(6), 8: py(15), 9: py({ root: 45 }), 10: py(26, BOX) },
    '5.4': { 2: py(5, DI), 3: py(13, DI), 5: py({ root: 117 }), 6: py({ root: 89 }, DI), 8: py(13, DI), 9: py({ root: 45 }, DI), 10: py(10, DI) },
    '5.5': { 1: py(29), 2: py(24), 4: py(5, DI), 5: py({ root: 73 }), 6: py(40), 8: py(5), 10: py(7, BOX) },
    '2.2': { 1: { expr: '5^3 · 5^4' }, 2: { expr: '(3a^2)(6a^5)' }, 3: { expr: '15y^6 / 3y^2' }, 4: { expr: 'x^5 / x^2' }, 9: { expr: '(4x^3y)(2xy^4)' } },
    '2.3': { 1: { expr: '(5^2)^3' }, 2: { expr: '(y^5)^4' }, 3: { expr: '4^-2' }, 4: { expr: '(-6)^0' }, 5: { expr: 'x^9 / x^2' }, 7: { expr: '(2x^-3)^2' }, 8: { expr: '(2a^4)(7a^3)' } },
    '2.4': { 1: { expr: '(3x^4y^2)^2' }, 2: { expr: '(4a^-2)(3a^5)' }, 3: { expr: '20m^3 / 4m^5' }, 4: { expr: '-6x^5y^0 / (-2x^-2)' }, 6: { expr: '(3a^2b^-1)^-2' },
             8: { expr: '(4x^2y)^2 · 3xy^3' }, 9: { expr: '(2x^3)^4 / 8x^7' } },
    '2.5': { 1: { expr: '4^3' }, 2: { expr: 'x^6 · x^4' }, 3: { expr: '(2y^3)^5' }, 4: { expr: '6^-2' }, 5: { expr: '30a^5b^7 / 5a^4b^2' }, 6: { expr: '(5m^-2n)(2m^6n^-4)' }, 9: { expr: '(x^4y^-2)^3 · x^-5' } },
    '2.6': { 8: { expr: '(2x^3)^2 · x^-4' } },
    '2.7': { 1: { expr: '(4 × 10^6)(2 × 10^3)', sci: 1 }, 2: { expr: '(9 × 10^8) / (3 × 10^2)', sci: 1 }, 3: { expr: '(5 × 10^3)(4 × 10^5)', sci: 1 },
             4: { expr: '(1.2 × 10^-4) / (4 × 10^-9)', sci: 1 }, 8: { expr: '(7.5 × 10^-6)(4 × 10^3) / (2.5 × 10^-4)', sci: 1 } },
    '2.8': { 2: { expr: '(4 × 10^5)(7 × 10^-2)', sci: 1 }, 3: { expr: '(3.6 × 10^7) / (1.2 × 10^-2)', sci: 1 } },
    '2.9': { 1: { expr: '(5a^3)(-2a^4)' }, 4: { expr: '(6 × 10^8) / (2 × 10^3)', sci: 1 }, 6: { expr: '(x^5y^-2)^2 · x^-3' } },
    '6.6': { 10: { setup: 3, any: 1, hint: 'Put the slope and one point into y = mx + b: use the point\'s x and y, and leave b as the unknown.', prompt: 'Use <i>b</i> for the y-intercept. Write an equation that matches the table.' } },
    '6.8': { 9: { setup: -3, any: 1, hint: 'Put the slope and one point into y = mx + b: use the point\'s x and y, and leave b as the unknown.', prompt: 'Use <i>b</i> for the y-intercept. Write an equation that matches the table.' } },
    '6.10': { 2: { line: '2x + y = 9' }, 3: { line: 'y − 1 = 4(x − 2)' }, 6: { ps: [-3, 8], hint: 'Point-slope form is y − y₁ = m(x − x₁). Find the slope m first, then use one point (x₁, y₁).' }, 9: { ps: [2, 4], hint: 'Point-slope form is y − y₁ = m(x − x₁). Find the slope m first, then use one point (x₁, y₁).' } },
    '6.11': { 2: { line: '3x + 4y = 8' }, 6: { ps: [3, -5], hint: 'Point-slope form is y − y₁ = m(x − x₁). Find the slope m first, then use one point (x₁, y₁).' }, 9: { ps: [20, 50], hint: 'Point-slope form is y − y₁ = m(x − x₁). Find the slope m first, then use one point (x₁, y₁).' } },
    '6.13': { 6: { line: 'y + 3 = 2(x − 4)' } },
    '9.2': { 6: vol(2) }, '9.3': { 7: vol(6) }, '9.4': { 6: vol(7) }
  };
  // Nov 10, 2026: more problems from the same PDFs — "find the mistake" items (the student solves the original
  // problem correctly), more solve / find-x / Pythagorean / exponent / scientific-notation items, the cube root
  // (9.3 #6), both intercepts (6.11 #1, one workspace per intercept) and the EOG Review homework E.1–E.7.
  var SPH = 'Sphere: <i>V</i> = ⁴⁄₃π<i>r</i><sup>3</sup>. Put in the volume and use <i>r</i> for the radius. Get <i>r</i><sup>3</sup> alone, then take the cube root.';
  var MORE = {
    '2.2': { 6: { expr: 'x^4 · x^3' } }, '2.3': { 6: { expr: '(x^3)^4' } }, '2.4': { 7: { expr: '(2x^3)(4x^5)' } }, '2.5': { 7: { expr: '(3x^2)^3' } },
    '2.8': { 5: { expr: '(1.5 × 10^5) / (3 × 10^1)', sci: 1 }, 8: { expr: '(5 × 10^6)(6 × 10^3)', sci: 1 }, 9: { expr: '(1 × 10^5)(3.65 × 10^2)', sci: 1 } },
    '2.9': { 7: { expr: '(2.5 × 10^3)(4 × 10^6)', sci: 1 }, 9: { expr: '(8 × 10^9) / (4 × 10^7)', sci: 1 } },
    '3.1': { 6: { start: '−3x + 2 = −10' } }, '3.2': { 6: { start: '2/3x = 10' } }, '3.3': { 6: { start: '2x + 9 = 5x − 3' } },
    '3.4': { 6: { start: '4(x − 2) + x = 17' } }, '3.5': { 6: { start: '2/3(x + 6) = 10' } }, '3.6': { 6: { start: '0.3x − 0.6 = 1.5' } },
    '3.7': { 8: { start: '2x + 3 = 2x + 3' } }, '3.8': { 8: { start: '2x − 5 ≥ 4x + 3' } }, '3.9': { 7: { start: '10 + 8t ≤ 50', v: 't' } },
    '3.10': { 6: { start: '−2(x − 5) = 16' } },
    '4.1': { 4: { setup: 133, hint: 'Supplementary angles add to <b>180°</b>.' }, 7: { setup: 15, hint: H.vertical } },
    '4.2': { 3: { setup: 27, hint: H.comp }, 7: { setup: 16, hint: H.vertical } },
    '4.3': { 7: { setup: 50, hint: H.parallel } }, '4.4': { 7: { setup: 30, hint: H.parallel } },
    '4.5': { 7: { setup: 45, fig: 1, hint: H.exterior } },
    '4.6': { 4: { setup: 105, hint: H.exterior }, 9: { setup: 55, fig: 1, hint: 'Use the parallel lines first: the 55° angle and the triangle\'s left angle are alternate interior angles. The 110° angle and the triangle\'s right angle make a straight line. ' + H.triangle } },
    '5.1': { 7: py(13) }, '5.3': { 7: py(8) }, '5.4': { 7: py({ root: 52 }, DI) }, '5.5': { 7: py(10, DI) },
    '6.1': { 8: { start: '3x − 7 = 20' } }, '6.3': { 6: { start: '3x + 1 = 16' } },
    '6.5': { 9: { start: '(k − 4)/(5 − 1) = 1/2', v: 'k' } }, '6.8': { 10: { start: '(k − 15)/(10 − 4) = 3', v: 'k' } },
    '6.10': { 7: { line: '6x + 2y = 8' } },
    '6.11': { 1: [{ tag: 'x-intercept', title: 'x-intercept: put in y = 0. 2x + 5(0) = 10 becomes 2x = 10', start: '2x = 10' }, { tag: 'y-intercept', title: 'y-intercept: put in x = 0. 2(0) + 5y = 10 becomes 5y = 10', start: '5y = 10', v: 'y' }], 7: { line: '5x − 3y = 9' } },
    '6.12': { 6: { start: 'x + 5 = 3x − 1', then: [{ label: 'y = x + 5', expr: 'x + 5' }] } },
    '9.3': { 6: { setup: 3, any: 1, positive: 1, pi: 1, roots: 1, hint: SPH } },
    'E.1': { 2: { expr: '6^8 / 6^3' }, 4: { start: '3(x + 2) = 5x − 8' }, 7: { expr: '12x^5y^-2 / (4x^-1y^3)' } },
    'E.2': { 3: { expr: '(6 × 10^5)(5 × 10^3)', sci: 1 }, 5: { setup: 65, fig: 1, hint: H.triangle }, 6: { expr: '(8 × 10^11) / (4 × 10^6)', sci: 1 } },
    'E.3': { 1: { start: 'x/4 + 6 = 1' }, 2: { start: '2(3x − 1) + 4x = 28' }, 3: { start: '9x + 5 = 4x − 15' }, 4: { start: '4(2x − 1) + 1 = 8x − 3' },
             5: { expr: '(8.4 × 10^6) / (2.1 × 10^2)', sci: 1 }, 6: { start: '5 − 3x < 17' }, 8: { setup: 20, fig: 1, hint: H.parallel },
             9: { setup: 6, v: 'w', hint: 'Start amount + (amount saved each week × weeks). Set Jamal\'s amount equal to Priya\'s amount.', prompt: 'Use <i>w</i> for the number of weeks. Write an equation that says they have the same amount.', then: [{ label: 'each has $', expr: '120 + 15w' }] } },
    'E.4': { 4: { start: '6x − 11 = 2x + 9' }, 8: { setup: 40, fig: 1, hint: H.exterior } },
    'E.5': { 1: { setup: 52, fig: 1, hint: H.straight }, 3: py(15), 6: { setup: 24, any: 1, hint: 'The short side grew from 5 to 15. Multiply the long side by the same scale factor.', prompt: 'Use a letter for the long side. Write an equation.' },
             7: { expr: '(2x^3)^4' }, 8: py({ root: 74 }, DI), 9: { setup: 13, fig: 1, hint: H.parallel, then: [{ label: '4x + 8', expr: '4x + 8', unit: '°' }] } },
    'E.6': { 7: py(4) },
    'E.7': { 5: { expr: '(1.5 × 10^3)(4 × 10^5)', sci: 1 }, 7: { start: '−4x + 60 = 0' }, 8: { start: '3/4(x + 8) = 15' } }
  };
  Object.keys(MORE).forEach(function (id) { var t = window.HW_STEPS[id] = window.HW_STEPS[id] || {}; Object.keys(MORE[id]).forEach(function (n) { if (t[n]) throw new Error('homework-steps: ' + id + ' #' + n + ' twice'); t[n] = MORE[id][n]; }); });
})();
