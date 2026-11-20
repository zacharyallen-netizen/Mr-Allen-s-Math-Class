/* Skill Builders · Grade 7 · Unit 9 · Probability (NC.7.SP.5–8) · Score 3 core skills */
(function () {
  var D = SB.D, C = SB.C, B = SB.G7.board;
  var SP5 = 'NC.7.SP.5', SP7 = 'NC.7.SP.7', SP8 = 'NC.7.SP.8';

  function scaleAnim() {
    var nl = D.nl({ lo: 0, hi: 1, step: 0.5, y: 80, x0: 70, x1: 570, lab: function (v) { return v === 0.5 ? '1/2' : String(v); } }), X = nl.X, s = nl.svg;
    s += D.txt(X(0), 125, 'impossible', { s: 15, c: C.red, id: 'w0', hide: true }) + D.txt(X(0.5), 125, 'as likely as not', { s: 15, c: C.gold, id: 'w1', hide: true }) + D.txt(X(1), 125, 'certain', { s: 15, c: C.green, id: 'w2', hide: true });
    s += D.circ(X(0.25), 80, 9, { fill: C.blue, id: 'pt', hide: true }) + D.txt(X(0.25), 50, 'P = 1/4', { s: 16, c: C.blue, id: 'ptl', hide: true });
    return B('The probability scale', s, [{ t: 'P(event) = good outcomes ÷ all outcomes' }, { t: 'P(red) = 1/4: unlikely', c: C.blue }], [
      'Probability is a number from <b>0</b> to <b>1</b>.',
      '<b>0</b> means impossible. <b>1</b> means certain. <b>1/2</b> means as likely as not.',
      'To find it: count the good outcomes and divide by all the outcomes.',
      'A spinner has 4 equal parts and 1 is red. P(red) = <b>1/4</b>. That is near 0, so it is <b>unlikely</b>.'], { th: 140, extra: { 1: { w0: { o: 1 }, w1: { o: 1 }, w2: { o: 1 } }, 3: { pt: { o: 1 }, ptl: { o: 1 } } } });
  }
  function treeAnim() {
    var s = D.arrowDefs(), x0 = 80, y0 = 120;
    s += D.circ(x0, y0, 6, { fill: C.navy });
    [['H', 70], ['T', 170]].forEach(function (a, i) {
      s += D.g(D.line(x0, y0, 250, a[1], { w: 2 }) + D.txt(268, a[1] + 6, a[0], { s: 20, c: C.blue }), { id: 'c' + i, hide: true });
      [0, 1, 2].forEach(function (j) {
        var yy = a[1] - 30 + j * 30;
        s += D.g(D.line(285, a[1], 430, yy, { w: 1.6, c: C.gray }) + D.txt(446, yy + 5, String(j + 1), { s: 16, c: C.red }) + D.txt(510, yy + 5, a[0] + (j + 1), { s: 16, c: C.ink }), { id: 'n' + i + j, hide: true });
      });
    });
    var all = {}; [0, 1].forEach(function (i) { [0, 1, 2].forEach(function (j) { all['n' + i + j] = { o: 1 }; }); });
    return B('Tree diagram', s, [{ t: '2 × 3 = 6 outcomes' }, { t: 'P(H and 1) = 1/6', c: C.green }], [
      'Flip a coin and spin a 3-part spinner (1, 2, 3). What can happen?',
      'The coin: H or T.',
      'For EACH coin side, the spinner can land on 1, 2 or 3. That makes <b>6 outcomes</b>: 2 × 3.',
      'Only one outcome is H1. So P(H and 1) = <b>1/6</b>.'], { th: 230, extra: { 1: { c0: { o: 1 }, c1: { o: 1 } }, 2: all } });
  }

  SB.unit({
    n: 9, title: 'Probability', std: 'NC.7.SP.5–8', std0: SP5, sendUnit: '7-9', pagePre: 'Grade 7 · ',
    lessons: [
      { id: 'g7-9a', title: 'Find a probability', std: SP7, anim: scaleAnim(),
        hook: 'What are the chances it rains today? Probability puts a number on it!',
        big: '<b>P(event) = good outcomes ÷ all outcomes</b> (when all outcomes are equally likely). It is always from 0 (impossible) to 1 (certain).',
        words: [['Outcome', 'one possible result'], ['Probability', 'a number from 0 to 1'], ['Equally likely', 'each outcome has the same chance']],
        watch: 'A probability can not be more than 1. Put the good outcomes on TOP.',
        walk: { prob: 'A bag has 3 red and 7 blue marbles. Find P(red).', steps: [
          { q: 'How many marbles in all?', ch: ['10', ['7', '7 is just the blue ones.', 'Red + blue?'], ['3', '3 is just the red ones.', 'Red + blue?']], ln: 'all = 10' },
          { q: 'P(red) = red ÷ all = ?', ch: ['3/10', ['3/7', 'Divide by ALL the marbles.', 'How many in all?'], ['10/3', 'That is more than 1. Red goes on top.', 'Which goes on top?']], ln: 'P(red) = 3/10' }] },
        checks: [
          { id: 'g79c1', std: SP7, q: 'Roll a number cube (1–6). What is P(rolling a 4)? (Type a fraction.)', ans: 1 / 6, hint: '1 good outcome out of 6', miss: [[4 / 6, 'Only ONE side shows a 4.', 'How many sides show a 4?'], [6, 'That is more than 1. Good outcomes on top.', 'Which goes on top?']], sol: ['1 ÷ 6 = 1/6'] },
          { id: 'g79c2', std: SP5, q: 'P(event) = 0.9. The event is…', keep: 1, ch: ['likely', ['unlikely', '0.9 is close to 1.', 'Near 0 or near 1?'], ['impossible', 'Impossible is 0.', 'Is 0.9 equal to 0?']], hint: 'Close to 1 = likely.' }
        ],
        can: 'find the probability of an event.',
        recap: ['Good ÷ all', '0 = impossible, 1 = certain', 'Never more than 1'] },

      { id: 'g7-9b', title: 'Compound events', std: SP8, anim: treeAnim(),
        hook: 'Flip a coin AND roll a cube. How many things can happen at once?',
        big: 'For two events together, list all the outcomes with a <b>tree diagram</b>, a list or a table. Count: (choices for the 1st) × (choices for the 2nd). Then P = good ÷ all.',
        words: [['Compound event', 'two or more things happen together'], ['Sample space', 'the list of all outcomes'], ['Tree diagram', 'branches that show every outcome']],
        watch: 'Multiply the choices, do not add: a coin and a cube make 2 × 6 = 12 outcomes, not 8.',
        walk: { prob: 'Flip 2 coins. Find P(both heads).', steps: [
          { q: 'How many outcomes? (HH, HT, TH, TT)', ch: ['4', ['3', 'HT and TH are different outcomes.', 'Count each one.'], ['2', 'Each coin has 2 sides: 2 × 2.', 'What is 2 × 2?']], ln: '2 × 2 = 4' },
          { q: 'How many are both heads?', ch: ['1 (HH)', ['2', 'Only HH has two heads.', 'Which ones are HH?']], ln: 'P = 1/4' }] },
        checks: [
          { id: 'g79c3', std: SP8, q: 'A pizza: 3 crusts and 4 toppings. How many choices with 1 crust and 1 topping?', ans: 12, hint: '3 × 4', miss: [[7, 'Multiply, do not add.', 'What is 3 × 4?']], sol: ['3 × 4 = 12'] },
          { id: 'g79c4', std: SP8, q: 'Flip a coin and roll a cube. P(T and 6)?', keep: 1, ch: ['1/12', ['1/8', 'There are 2 × 6 = 12 outcomes, not 2 + 6.', 'Multiply or add?'], ['1/6', 'The coin must also be tails.', 'How many outcomes in all?']], hint: '2 × 6 = 12 outcomes. Only 1 is T6.' }
        ],
        can: 'find the probability of a compound event.',
        recap: ['Tree, list or table', 'Outcomes: multiply the choices', 'P = good ÷ all'] }
    ],
    practice: [
      { id: 'g79p1', std: SP7, q: 'A spinner has 8 equal parts. 3 are blue. P(blue) as a decimal?', ans: 0.375, hint: '3 ÷ 8', miss: [[Math.round(8 / 3 * 1000) / 1000, 'Blue on top.', 'Which goes on top?'], [0.3, '3 ÷ 8, not 3 ÷ 10.', 'How many parts in all?']], sol: ['3 ÷ 8 = 0.375'] },
      { id: 'g79p2', std: SP7, q: 'A bag: 2 red, 5 green, 3 yellow. P(green) as a decimal?', ans: 0.5, hint: '5 ÷ 10', miss: [[0.2, 'That is red.', 'How many green?'], [2, 'Green on top, all on the bottom.', 'Which goes on top?']], sol: ['5 ÷ 10 = 0.5'] },
      { id: 'g79p3', std: SP5, q: 'P(sun) = 0.05. Which word fits?', keep: 1, ch: ['very unlikely', ['likely', '0.05 is close to 0.', 'Near 0 or 1?'], ['certain', 'Certain is 1.', 'Is 0.05 equal to 1?']], hint: 'Near 0 = unlikely.' },
      { id: 'g79p4', std: SP7, q: 'Roll a number cube. P(even) as a decimal?', ans: 0.5, hint: 'Even: 2, 4, 6', miss: [[Math.round(1 / 6 * 1000) / 1000, 'There are 3 even numbers.', 'Which are even?'], [3, 'Divide by 6.', 'Good ÷ all?']], sol: ['3 ÷ 6 = 0.5'] },
      { id: 'g79p5', std: SP8, q: 'A shirt: 4 colors and 3 sizes. How many choices?', ans: 12, hint: '4 × 3', miss: [[7, 'Multiply, do not add.', 'What is 4 × 3?']], sol: ['4 × 3 = 12'] },
      { id: 'g79p6', std: SP8, q: 'Flip 3 coins. How many outcomes?', ans: 8, hint: '2 × 2 × 2', miss: [[6, 'Multiply 2 × 2 × 2.', 'Add or multiply?'], [3, 'Each coin has 2 sides.', '2 × 2 × 2 = ?']], sol: ['2 × 2 × 2 = 8'] },
      { id: 'g79p7', std: SP8, q: 'Flip 2 coins. P(one head and one tail)?', keep: 1, ch: ['1/2', ['1/4', 'HT and TH both work.', 'How many outcomes have one of each?'], ['1/3', 'There are 4 outcomes, not 3.', 'List them: HH, HT, TH, TT.']], hint: 'Outcomes: HH, HT, TH, TT.' },
      { id: 'g79p8', std: SP7, q: 'P(win) = 0.3. What is P(not win)?', ans: 0.7, hint: '1 − 0.3', miss: [[0.3, 'That is P(win).', 'Not win = everything else.'], [1.3, 'Subtract from 1.', 'Add or subtract?']], sol: ['1 − 0.3 = 0.7'] }
    ]
  });
})();
