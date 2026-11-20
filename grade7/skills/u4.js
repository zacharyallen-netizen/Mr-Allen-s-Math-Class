/* Skill Builders · Grade 7 · Unit 4 · Proportional Relationships (NC.7.RP.1–2) · Score 3 core skills */
(function () {
  var D = SB.D, C = SB.C, B = SB.G7.board;
  var RP1 = 'NC.7.RP.1', RP2 = 'NC.7.RP.2';

  function rateAnim() {
    var s = '', x0 = 90, x1 = 570, X = function (i) { return x0 + i * (x1 - x0) / 4; };
    s += D.line(x0, 50, x1, 50, { w: 2 }) + D.line(x0, 110, x1, 110, { w: 2 }) + D.txt(40, 55, 'miles', { s: 14, a: 'middle' }) + D.txt(40, 115, 'hours', { s: 14 });
    var top = ['0', '1/2', '1', '3/2', '2'], bot = ['0', '1/4', '1/2', '3/4', '1'];
    for (var i = 0; i < 5; i++) {
      s += D.line(X(i), 43, X(i), 57, { w: 2 }) + D.line(X(i), 103, X(i), 117, { w: 2 });
      var hide = i > 1;
      s += D.txt(X(i), 34, top[i], { s: 16, id: 't' + i, hide: hide }) + D.txt(X(i), 138, bot[i], { s: 16, id: 'b' + i, hide: hide });
    }
    s += D.rect(X(4) - 30, 18, 60, 130, { c: C.green, w: 3, r: 10, id: 'box', hide: true });
    function show(n) { var o = {}; for (var j = 2; j <= n; j++) { o['t' + j] = { o: 1 }; o['b' + j] = { o: 1 }; } return o; }
    return B('Unit rate with fractions', s, [{ t: '(1/2) ÷ (1/4) = (1/2) × 4' }, { t: '= 2 miles per hour', c: C.green }], [
      'A turtle walks <b>1/2 mile</b> in <b>1/4 hour</b>. How far in 1 whole hour?',
      'Keep going on the double number line. Each 1/4 hour adds 1/2 mile.',
      'At 1 hour, the turtle has gone <b>2 miles</b>. Or divide: (1/2) ÷ (1/4) is (1/2) × 4.',
      'The unit rate is <b>2 miles per hour</b>.'], { th: 160, extra: { 1: show(4), 2: { box: { o: 1 } } } });
  }
  function kAnim() {
    var s = '', cols = [['x (hours)', '2', '3', '5'], ['y (dollars)', '18', '27', '45'], ['y ÷ x', '9', '9', '9']];
    cols.forEach(function (r, i) { r.forEach(function (v, j) {
      s += D.rect(120 + j * 110, 20 + i * 42, 110, 42, { fill: j === 0 ? '#FBF3E6' : '#fff', c: '#DCCAA9', w: 1 });
      s += D.txt(175 + j * 110, 48 + i * 42, v, { s: j ? 18 : 14, c: i === 2 && j ? C.green : C.ink, id: i === 2 && j ? 'k' + j : undefined, hide: i === 2 && j > 0 });
    }); });
    return B('The constant of proportionality', s, [{ t: 'k = 9' , c: C.green}, { t: 'y = 9x', c: C.green, s: 26 }], [
      'A table of hours worked and dollars earned.',
      'Divide y by x in every row: 18 ÷ 2, 27 ÷ 3, 45 ÷ 5. They are all <b>9</b>. Same every time: it is proportional!',
      'That number is <b>k</b>, the constant of proportionality. It is the unit rate: $9 per hour.',
      'The equation is <b>y = kx</b>, so <b>y = 9x</b>.'], { th: 150, extra: { 1: { k1: { o: 1 }, k2: { o: 1 }, k3: { o: 1 } } } });
  }

  SB.unit({
    n: 4, title: 'Proportional Relationships', std: 'NC.7.RP.1–2', std0: RP1, sendUnit: '7-4', pagePre: 'Grade 7 · ',
    lessons: [
      { id: 'g7-4a', title: 'Find a unit rate', std: RP1, anim: rateAnim(),
        hook: 'Which is faster: 1/2 mile in 1/4 hour, or 3 miles in 2 hours? A unit rate tells you!',
        big: 'A <b>unit rate</b> is the amount for ONE unit. Divide the first amount by the second. To divide by a fraction, multiply by its <b>reciprocal</b> (flip it).',
        words: [['Rate', 'compares two different units: miles and hours'], ['Unit rate', 'the amount for 1 unit'], ['Reciprocal', 'a fraction flipped over: 1/4 → 4']],
        watch: 'Put the units in order. Miles per hour means miles ÷ hours.',
        walk: { prob: 'A snail goes <span class="m">3/4</span> foot in <span class="m">1/2</span> minute. How many feet per minute?', steps: [
          { q: 'Feet per minute means…', ch: ['feet ÷ minutes: (3/4) ÷ (1/2)', ['minutes ÷ feet: (1/2) ÷ (3/4)', '"Per minute" means divide by minutes.', 'Which unit comes after "per"?'], ['(3/4) × (1/2)', 'A rate divides.', 'Divide or multiply?']], ln: '(3/4) ÷ (1/2)' },
          { q: 'Flip the second fraction and multiply.', ch: ['(3/4) × 2', ['(4/3) × (1/2)', 'Flip only the SECOND fraction.', 'Which fraction do you divide by?']], ln: '(3/4) × 2 = 6/4' },
          { q: '6/4 in simplest form?', ch: ['1 1/2 feet per minute', ['1 1/4 feet per minute', '6/4 = 1 2/4.', 'What is 2/4 simplified?'], ['2/3 foot per minute', 'That is upside down.', 'Is 6/4 more or less than 1?']], ln: '1 1/2 feet per minute' }] },
        checks: [
          { id: 'g74c1', std: RP1, q: 'A car goes 180 miles in 3 hours. How many miles per hour?', ans: 60, hint: '180 ÷ 3', miss: [[540, 'Divide, do not multiply.', 'What is 180 ÷ 3?'], [177, 'Divide, do not subtract.', 'Which operation finds a unit rate?']], sol: ['180 ÷ 3 = 60'] },
          { id: 'g74c2', std: RP1, q: 'You read <span class="m">2/3</span> of a page in <span class="m">1/6</span> minute. How many pages per minute?', ans: 4, hint: '(2/3) ÷ (1/6) = (2/3) × 6', miss: [[0.25, 'That is minutes per page. Put pages on top.', 'Which unit is "per"?'], [Math.round(1 / 9 * 1000) / 1000, 'You multiplied the fractions. Divide.', 'What does "per" mean?']], sol: ['(2/3) ÷ (1/6)', '= (2/3) × 6', '= 4'] }
        ],
        can: 'find a unit rate, even with fractions.',
        recap: ['Unit rate = amount for 1', 'Divide first amount ÷ second', 'Divide by a fraction: multiply by its reciprocal'] },

      { id: 'g7-4b', title: 'Find k and write y = kx', std: RP2, anim: kAnim(),
        hook: 'You earn the same pay every hour. Can one short equation tell your pay for ANY number of hours? Yes!',
        big: 'In a proportional relationship, <b>y ÷ x</b> is the same every time. That number is <b>k</b>, the constant of proportionality. The equation is <b>y = kx</b>.',
        words: [['Proportional', 'y ÷ x is always the same'], ['k', 'the constant of proportionality (the unit rate)'], ['y = kx', 'the equation of a proportional relationship']],
        watch: 'k is y ÷ x, not x ÷ y. Check every row: one row is not enough.',
        walk: { prob: 'Cost: 4 pounds of apples cost $10. Write y = kx.', steps: [
          { q: 'k = y ÷ x. Which division?', ch: ['10 ÷ 4', ['4 ÷ 10', 'y (dollars) goes on top.', 'Which is y?']], ln: 'k = 10 ÷ 4' },
          { q: '10 ÷ 4 = ?', ch: ['2.5', ['0.4', 'That is 4 ÷ 10.', 'Which is on top?'], ['6', 'Divide, do not subtract.', 'What is 10 ÷ 4?']], ln: 'k = 2.5' },
          { q: 'Write the equation.', ch: ['y = 2.5x', ['y = 4x', '4 is the number of pounds.', 'What is k?'], ['y = 10x', '10 is the cost of 4 pounds, not 1.', 'What is k?']], ln: 'y = 2.5x' }] },
        checks: [
          { id: 'g74c3', std: RP2, q: 'A table has (3, 21), (5, 35), (8, 56). What is k?', ans: 7, hint: 'y ÷ x', miss: [[Math.round(1 / 7 * 1000) / 1000, 'That is x ÷ y. Use y ÷ x.', 'Which goes on top?'], [18, 'Divide, do not subtract.', 'What is 21 ÷ 3?']], sol: ['21 ÷ 3 = 7', '35 ÷ 5 = 7', '56 ÷ 8 = 7'] },
          { id: 'g74c4', std: RP2, q: 'Which table is proportional?', keep: 1, ch: ['(1, 5), (2, 10), (4, 20)', ['(1, 5), (2, 7), (4, 11)', '7 ÷ 2 is not 5.', 'Is y ÷ x the same in every row?'], ['(0, 3), (1, 5), (2, 7)', 'A proportional table has (0, 0).', 'What is y when x = 0?']], hint: 'Find y ÷ x in every pair.' }
        ],
        can: 'find k and write y = kx.',
        recap: ['Divide y ÷ x in every row', 'Same every time → proportional', 'k is the unit rate', 'y = kx'] }
    ],
    practice: [
      { id: 'g74p1', std: RP1, q: 'A pump fills 48 gallons in 6 minutes. How many gallons per minute?', ans: 8, hint: '48 ÷ 6', miss: [[288, 'Divide, do not multiply.', 'What is 48 ÷ 6?'], [42, 'Divide, do not subtract.', 'Which operation?']], sol: ['48 ÷ 6 = 8'] },
      { id: 'g74p2', std: RP1, q: '5 pounds of rice cost $7.50. What is the price per pound in dollars?', ans: 1.5, hint: '7.50 ÷ 5', miss: [[Math.round(5 / 7.5 * 1000) / 1000, 'That is pounds per dollar.', 'Which goes on top?'], [37.5, 'Divide, do not multiply.', 'What is 7.50 ÷ 5?']], sol: ['7.50 ÷ 5 = 1.50'] },
      { id: 'g74p3', std: RP1, q: 'A bug crawls <span class="m">1/3</span> yard in <span class="m">1/2</span> minute. Yards per minute?', keep: 1, ch: ['2/3', ['3/2', 'That is minutes per yard.', 'Which goes on top?'], ['1/6', 'You multiplied. Divide.', 'What does "per" mean?']], hint: '(1/3) ÷ (1/2) = (1/3) × 2' },
      { id: 'g74p4', std: RP1, q: 'A recipe uses <span class="m">3/4</span> cup of sugar for <span class="m">1/2</span> batch. Cups per batch?', ans: 1.5, hint: '(3/4) ÷ (1/2) = (3/4) × 2', miss: [[0.375, 'You multiplied. Divide.', 'What does "per" mean?'], [Math.round(2 / 3 * 1000) / 1000, 'That is batches per cup.', 'Which goes on top?']], sol: ['(3/4) × 2 = 6/4', '= 1 1/2'] },
      { id: 'g74p5', std: RP2, q: 'y = kx goes through (6, 24). What is k?', ans: 4, hint: '24 ÷ 6', miss: [[0.25, 'That is x ÷ y.', 'Which goes on top?'], [18, 'Divide, do not subtract.', 'What is 24 ÷ 6?']], sol: ['k = 24 ÷ 6 = 4'] },
      { id: 'g74p6', std: RP2, q: 'Tickets: y = 12x (x tickets, y dollars). How much for 7 tickets?', ans: 84, hint: '12 × 7', miss: [[19, 'Multiply, do not add.', 'What does 12x mean?'], [Math.round(7 / 12 * 1000) / 1000, 'Put 7 in for x: 12 × 7.', 'Multiply or divide?']], sol: ['y = 12(7) = 84'] },
      { id: 'g74p7', std: RP2, q: 'Which graph is proportional?', keep: 1, ch: ['A straight line through (0, 0)', ['A straight line through (0, 4)', 'It must go through (0, 0).', 'Where does it start?'], ['A curve through (0, 0)', 'It must be a straight line.', 'Straight or curved?']], hint: 'Straight, and through the origin.' },
      { id: 'g74p8', std: RP2, q: 'A proportional graph goes through (1, 3.5). What does it mean for hours (x) and miles (y)?', keep: 1, ch: ['3.5 miles in 1 hour', ['1 mile in 3.5 hours', 'x is hours, y is miles.', 'Which number is the hours?'], ['3.5 hours in all', '3.5 is the y-value: miles.', 'What does y stand for?']], hint: 'x = hours, y = miles.' }
    ]
  });
})();
