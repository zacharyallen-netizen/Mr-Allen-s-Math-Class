/* Skill Builders · Grade 7 · Unit 3 · Equations and Inequalities (NC.7.EE.3–4) · Score 3 core skills */
(function () {
  var D = SB.D, C = SB.C, B = SB.G7.board;
  var EE4 = 'NC.7.EE.4', EE3 = 'NC.7.EE.3';

  function solveAnim() {
    return B('Undo in reverse order', '', [
      { t: '3x + 5 = 20' }, { t: '− 5    − 5', c: C.red }, { t: '3x = 15' }, { t: '÷ 3   ÷ 3', c: C.red }, { t: 'x = 5', c: C.green, s: 26 }], [
      'Solve <b>3x + 5 = 20</b>. Think of it as a balance: both sides weigh the same.',
      'Here is the equation.',
      'Undo the <b>+ 5</b> first. Subtract 5 from <b>both</b> sides.',
      'Now <b>3x = 15</b>.',
      'x is multiplied by 3. Undo it: divide <b>both</b> sides by 3.',
      'So <b>x = 5</b>. Check: 3(5) + 5 = 20 ✓'], { gap: 38 });
  }
  function ineqAnim() {
    var nl = D.nl({ lo: -2, hi: 8, y: 70, x0: 60, x1: 580 }), X = nl.X, s = D.arrowDefs() + nl.svg;
    s += D.line(X(3), 70, 600, 70, { c: C.red, w: 6, id: 'ray', hide: true });
    s += D.circ(X(3), 70, 9, { fill: '#fff', c: C.red, w: 3, id: 'dot', hide: true });
    return B('Solve and graph an inequality', s, [{ t: '2x + 1 > 7' }, { t: '2x > 6' }, { t: 'x > 3', c: C.green }], [
      'An inequality uses <, >, ≤ or ≥. Solve it like an equation.',
      'Here is <b>2x + 1 > 7</b>.',
      'Subtract 1 from both sides: <b>2x > 6</b>.',
      'Divide both sides by 2: <b>x > 3</b>.',
      'Graph it: an <b>open circle</b> at 3 (3 is not a solution), and shade to the <b>right</b>.',
      'Watch out: if you multiply or divide by a <b>negative</b>, flip the sign.'], { th: 110, extra: { 4: { dot: { o: 1 }, ray: { o: 1 } } } });
  }

  SB.unit({
    n: 3, title: 'Equations and Inequalities', std: 'NC.7.EE.3–4', std0: EE4, sendUnit: '7-3', pagePre: 'Grade 7 · ',
    lessons: [
      { id: 'g7-3a', title: 'Solve two-step equations', std: EE4, anim: solveAnim(),
        hook: 'A puzzle: I am thinking of a number. I triple it and add 5, and I get 20. What is my number?',
        big: 'Keep the balance: do the same thing to <b>both sides</b>. Undo the + or − first. Then undo the × or ÷.',
        words: [['Equation', 'two sides that are equal'], ['Inverse operation', 'the move that undoes: − undoes +, ÷ undoes ×'], ['Solution', 'the number that makes it true']],
        watch: 'Do every move to BOTH sides. And check your answer by putting it back in.',
        walk: { prob: 'Solve: <span class="m">4x − 3 = 21</span>', steps: [
          { q: 'Which move comes first?', ch: ['Add 3 to both sides', ['Divide both sides by 4', 'Undo the − 3 first. It is not attached to x.', 'Which number is not touching x?'], ['Subtract 3 from both sides', 'Subtracting makes it − 6. Use the opposite of − 3.', 'What undoes − 3?']], ln: '4x = 24' },
          { q: 'x is multiplied by 4. What undoes that?', ch: ['Divide both sides by 4', ['Subtract 4', 'The 4 is multiplied, not added.', 'What undoes ×?'], ['Multiply by 4', 'That makes it bigger. Use the opposite.', 'What is the opposite of ×?']], ln: 'x = 6' }] },
        checks: [
          { id: 'g73c1', std: EE4, q: 'Solve: <span class="m">2x + 7 = 19</span>', ans: 6, hint: 'Subtract 7. Then divide by 2.', miss: [[13, 'You added 7. Undo + 7 by subtracting.', 'What undoes + 7?'], [12, 'You stopped. 2x = 12, so divide by 2.', 'What is x times?'], [6.5, 'Undo the + 7 first, before dividing.', 'Which comes first?']], sol: ['2x + 7 = 19', '2x = 12', 'x = 6'] },
          { id: 'g73c2', std: EE4, q: 'Solve: <span class="m">x/3 + 2 = 6</span>', ans: 12, hint: 'Subtract 2. Then multiply by 3.', miss: [[4, 'That is x/3. Undo ÷ 3 by multiplying.', 'What undoes ÷ 3?'], [24, 'Subtract the 2 first.', 'What is 6 − 2?'], [Math.round(4 / 3 * 1000) / 1000, 'Undo ÷ 3 by MULTIPLYING by 3.', 'Multiply or divide?']], sol: ['x/3 = 4', 'x = 12'] }
        ],
        can: 'solve a two-step equation.',
        recap: ['Undo + or − first', 'Then undo × or ÷', 'Same move on both sides', 'Check your answer'] },

      { id: 'g7-3b', title: 'Solve and graph inequalities', std: EE4, anim: ineqAnim(),
        hook: 'You must be at least 48 inches tall to ride. Is there just ONE height that works? No, lots of them!',
        big: 'Solve an inequality like an equation. <b>Flip the sign</b> if you multiply or divide by a negative. Graph: open circle for < or >, closed for ≤ or ≥.',
        words: [['Inequality', 'a sentence with <, >, ≤ or ≥'], ['Open circle', 'the number is NOT included'], ['Closed circle', 'the number IS included']],
        watch: 'Dividing by a NEGATIVE flips the sign: −2x > 8 becomes x < −4.',
        walk: { prob: 'Solve: <span class="m">−3x + 2 ≤ 14</span>', steps: [
          { q: 'Undo the + 2 first.', ch: ['Subtract 2: −3x ≤ 12', ['Add 2: −3x ≤ 16', 'Use the opposite of + 2.', 'What undoes + 2?']], ln: '−3x ≤ 12' },
          { q: 'Divide both sides by −3. What happens to ≤?', ch: ['It flips to ≥', ['It stays ≤', 'Dividing by a NEGATIVE flips the sign.', 'Is −3 negative?']], ln: 'x ≥ −4' }] },
        checks: [
          { id: 'g73c3', std: EE4, q: 'Solve <span class="m">5x − 4 < 16</span>. The answer is x < ?', ans: 4, hint: 'Add 4. Then divide by 5.', miss: [[2.4, 'Undo − 4 by ADDING 4.', 'What undoes − 4?'], [20, 'You stopped. Divide by 5.', 'What is x times?']], sol: ['5x < 20', 'x < 4'] },
          { id: 'g73c4', std: EE4, q: 'Solve: <span class="m">−2x > 10</span>', keep: 1, ch: ['x < −5', ['x > −5', 'You divided by −2. Flip the sign!', 'Is −2 negative?'], ['x < 5', '10 ÷ (−2) is negative.', 'What is 10 ÷ (−2)?']], hint: 'Divide by −2 and flip the sign.' }
        ],
        can: 'solve an inequality and graph it.',
        recap: ['Solve like an equation', 'Divide by a negative → flip the sign', 'Open circle: < >; closed circle: ≤ ≥'] }
    ],
    practice: [
      { id: 'g73p1', std: EE4, q: 'Solve: <span class="m">3x + 4 = 25</span>', ans: 7, hint: 'Subtract 4. Then divide by 3.', miss: [[21, 'You stopped. Divide by 3.', 'What is x times?'], [Math.round(29 / 3 * 1000) / 1000, 'Undo + 4 by subtracting.', 'What undoes + 4?']], sol: ['3x = 21', 'x = 7'] },
      { id: 'g73p2', std: EE4, q: 'Solve: <span class="m">5x − 8 = 12</span>', ans: 4, hint: 'Add 8. Then divide by 5.', miss: [[0.8, 'Undo − 8 by ADDING 8.', 'What undoes − 8?'], [20, 'You stopped. Divide by 5.', 'What is x times?']], sol: ['5x = 20', 'x = 4'] },
      { id: 'g73p3', std: EE4, q: 'Solve: <span class="m">x/4 − 1 = 3</span>', ans: 16, hint: 'Add 1. Then multiply by 4.', miss: [[4, 'That is x/4. Multiply by 4.', 'What undoes ÷ 4?'], [1, 'Undo ÷ 4 by multiplying.', 'Multiply or divide?'], [8, 'Undo − 1 by ADDING 1.', 'What is 3 + 1?']], sol: ['x/4 = 4', 'x = 16'] },
      { id: 'g73p4', std: EE4, q: 'Solve: <span class="m">2(x + 3) = 14</span>', ans: 4, hint: 'Divide by 2: x + 3 = 7.', miss: [[10, 'Undo + 3 by SUBTRACTING 3.', 'What is 7 − 3?'], [5.5, 'Divide BOTH 2x and 6, or distribute first: 2x + 6 = 14.', 'What is 2 · 3?']], sol: ['x + 3 = 7', 'x = 4'] },
      { id: 'g73p5', std: EE4, q: 'Solve: <span class="m">−4x + 1 = 13</span>', ans: -3, neg: 1, hint: 'Subtract 1. Then divide by −4.', miss: [[3, '12 ÷ (−4) is negative.', 'What sign?'], [-3.5, 'Undo + 1 by subtracting 1.', 'What undoes + 1?']], sol: ['−4x = 12', 'x = −3'] },
      { id: 'g73p6', std: EE4, q: 'Solve: <span class="m">3x + 2 ≥ 11</span>', keep: 1, ch: ['x ≥ 3', ['x ≤ 3', 'Dividing by a positive 3 does NOT flip.', 'Is 3 negative?'], ['x ≥ 9', 'You stopped. Divide by 3.', 'What is x times?'], ['x ≥ 13/3', 'Undo + 2 by SUBTRACTING 2.', 'What is 11 − 2?']], hint: 'Subtract 2. Then divide by 3.' },
      { id: 'g73p7', std: EE4, q: 'Solve: <span class="m">−5x < 20</span>', keep: 1, ch: ['x > −4', ['x < −4', 'You divided by −5. Flip the sign.', 'Is −5 negative?'], ['x > 4', '20 ÷ (−5) is negative.', 'What sign?']], hint: 'Divide by −5 and flip.' },
      { id: 'g73p8', std: EE3, q: 'A gym costs $20 to join plus $15 a month. Lee paid $95. How many months?', ans: 5, unit: 'months', hint: '15m + 20 = 95', miss: [[75, 'That is 95 − 20. Divide by 15.', 'How many 15s in 75?'], [7.67, 'Subtract the $20 first.', 'What is 95 − 20?']], sol: ['15m + 20 = 95', '15m = 75', 'm = 5'] }
    ]
  });
})();
