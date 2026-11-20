/* Skill Builders · Grade 7 · Unit 1 · Operations with Rational Numbers (NC.7.NS.1–3) · Score 3 core skills */
(function () {
  var D = SB.D, C = SB.C, B = SB.G7.board, M = D.minus;
  var NS1 = 'NC.7.NS.1', NS2 = 'NC.7.NS.2';

  /* number line: start, jump, land */
  function jumpAnim() {
    var nl = D.nl({ lo: -8, hi: 8, y: 150, x0: 50, x1: 590 }), X = nl.X, s = D.arrowDefs() + nl.svg;
    s += D.circ(X(3), 150, 9, { fill: C.blue, id: 'st', hide: true }) + D.txt(X(3), 120, 'start 3', { s: 15, c: C.blue, id: 'stl', hide: true });
    s += D.path('M' + X(3) + ',140 Q' + (X(3) + X(-5)) / 2 + ',40 ' + X(-5) + ',140', { c: C.red, w: 3, arrow: 'ahr', id: 'jp', hide: true });
    s += D.txt((X(3) + X(-5)) / 2, 70, 'add −8: go LEFT 8', { s: 16, c: C.red, id: 'jl', hide: true });
    s += D.circ(X(-5), 150, 9, { fill: C.green, id: 'en', hide: true }) + D.txt(X(-5), 205, 'land on −5', { s: 16, c: C.green, id: 'enl', hide: true });
    return { w: 640, h: 220, svg: s, title: 'Adding on a number line', frames: [
      { cap: 'Let\'s find <b>3 + (−8)</b> on a number line.', set: {} },
      { cap: 'Start at the first number, <b>3</b>.', set: { st: { o: 1 }, stl: { o: 1 } } },
      { cap: 'Adding a <b>negative</b> moves <b>left</b>. Jump 8 to the left.', set: { st: { o: 1 }, stl: { o: 1 }, jp: { o: 1 }, jl: { o: 1 } } },
      { cap: 'We land on <b>−5</b>. So 3 + (−8) = −5.', set: { st: { o: 1 }, stl: { o: 1 }, jp: { o: 1 }, jl: { o: 1 }, en: { o: 1 }, enl: { o: 1 } } },
      { cap: 'Shortcut: different signs, so subtract 8 − 3 = 5 and keep the sign of the bigger number (−8). <b>−5</b>.', set: { st: { o: 1 }, stl: { o: 1 }, jp: { o: 1 }, jl: { o: 1 }, en: { o: 1 }, enl: { o: 1 } } }
    ] };
  }
  function signAnim() {
    return B('Signs when you multiply or divide', '', [
      { t: '(+)(+) = +', c: C.green }, { t: '(−)(−) = +', c: C.green }, { t: '(+)(−) = −', c: C.red }, { t: '(−)(+) = −', c: C.red }, { t: '−6 × (−4) = 24', c: C.blue }], [
      'When you multiply or divide two numbers, look at the <b>signs</b> first.',
      'Positive times positive is <b>positive</b>.',
      'Negative times negative is <b>positive</b> too. Same signs give a positive.',
      'A positive and a negative give a <b>negative</b>.',
      'The order does not matter. Different signs give a negative.',
      'Example: −6 × (−4). Same signs, so positive. 6 × 4 = 24. The answer is <b>24</b>.']);
  }

  SB.unit({
    n: 1, title: 'Operations with Rational Numbers', std: 'NC.7.NS.1–3', std0: NS1, sendUnit: '7-1', pagePre: 'Grade 7 · ',
    lessons: [
      { id: 'g7-1a', title: 'Add and subtract integers', std: NS1, anim: jumpAnim(),
        hook: 'Have you ever owed a friend money and then paid some back? That is adding negatives!',
        big: 'To add, start at the first number and move: <b>right</b> for a positive, <b>left</b> for a negative. To <b>subtract</b>, add the opposite: <span class="m">5 − (−3) = 5 + 3</span>.',
        words: [['Integer', 'a whole number or its opposite: … −2, −1, 0, 1, 2 …'], ['Opposite', 'same distance from 0, other side: 4 and −4'], ['Absolute value', 'distance from 0: |−6| = 6']],
        watch: 'Subtracting a negative is like adding: <span class="m">2 − (−5) = 2 + 5 = 7</span>, not −3.',
        walk: { prob: 'Find: <span class="m">−4 − (−9)</span>', steps: [
          { q: 'Subtracting? Add the opposite. What is the new problem?', ch: ['−4 + 9', ['−4 + (−9)', 'You kept −9. The opposite of −9 is 9.', 'What is the opposite of −9?'], ['4 + 9', 'Only the number you subtract changes. −4 stays −4.', 'Which number do you change?']], ln: '−4 + 9' },
          { q: 'Different signs. Subtract the distances: 9 − 4 = ?', ch: ['5', ['13', 'Different signs means subtract, not add.', 'Are the signs the same or different?']], ln: '9 − 4 = 5' },
          { q: 'Which sign? The number farther from 0 is 9 (positive).', ch: ['5', ['−5', '9 is farther from 0 than −4, and 9 is positive.', 'Which number wins: −4 or 9?']], ln: '= 5' }] },
        checks: [
          { id: 'g71c1', std: NS1, q: 'Find: <span class="m">−7 + 3</span>', ans: -4, neg: 1, hint: 'Start at −7. Move 3 to the right.', miss: [[-10, 'Adding 3 moves RIGHT, toward 0.', 'Which way does + 3 move?'], [4, 'You landed on the wrong side of 0. −7 is farther from 0 than 3.', 'Which number is farther from 0?'], [10, 'Different signs: subtract the distances.', 'What is 7 − 3?']], sol: ['−7 + 3', '7 − 3 = 4, and −7 wins', '= −4'] },
          { id: 'g71c2', std: NS1, q: 'Find: <span class="m">6 − (−2)</span>', ans: 8, hint: 'Subtract a negative = add the opposite: 6 + 2.', miss: [[4, 'Subtracting −2 means ADDING 2.', 'What is the opposite of −2?'], [-8, 'Check the sign: 6 + 2 is positive.', 'Is 6 + 2 positive or negative?']], sol: ['6 − (−2)', '= 6 + 2', '= 8'] },
          { id: 'g71c3', std: NS1, q: 'It is −3°F. The temperature drops 5 degrees. What is the new temperature?', ans: -8, neg: 1, unit: '°F', hint: 'Drops means subtract: −3 − 5.', miss: [[2, 'A drop makes it colder, so the number goes down.', 'Should the answer be warmer or colder?'], [-2, 'From −3, going down 5 more passes −5.', 'Count down from −3: −4, −5, …']], sol: ['−3 − 5', '= −3 + (−5)', '= −8'] }
        ],
        can: 'add and subtract integers.',
        recap: ['Positive → move right; negative → move left', 'Same signs: add and keep the sign', 'Different signs: subtract, keep the sign of the farther number', 'Subtract = add the opposite'] },

      { id: 'g7-1b', title: 'Multiply and divide integers', std: NS2, anim: signAnim(),
        hook: 'Here is a math rule so simple you can say it in four words: same signs, positive!',
        big: 'Multiply or divide the numbers. Then pick the sign: <b>same signs → positive</b>, <b>different signs → negative</b>.',
        words: [['Product', 'the answer to a multiplication'], ['Quotient', 'the answer to a division']],
        more: '<span class="m">−20 ÷ 4 = −5</span> &nbsp; <span class="m">−20 ÷ (−4) = 5</span>',
        watch: 'Two negatives make a positive when you MULTIPLY or DIVIDE, not when you add: <span class="m">−3 + (−3) = −6</span>.',
        walk: { prob: 'Find: <span class="m">−36 ÷ (−4)</span>', steps: [
          { q: 'Look at the signs. Same or different?', ch: ['Same (both negative)', ['Different', 'Both numbers have a minus sign.', 'Is 4 positive or negative here?']], ln: 'same signs → positive' },
          { q: 'Now divide the numbers: 36 ÷ 4 = ?', ch: ['9', ['8', 'Check: 4 × 8 = 32.', 'What times 4 is 36?'], ['32', 'That is 36 − 4. Divide.', 'Which operation?']], ln: '36 ÷ 4 = 9' },
          { q: 'Put it together.', ch: ['9', ['−9', 'Same signs give a positive.', 'Same or different signs?']], ln: '= 9' }] },
        checks: [
          { id: 'g71c4', std: NS2, q: 'Find: <span class="m">−8 × 5</span>', ans: -40, neg: 1, hint: 'Different signs → negative. 8 × 5 = 40.', miss: [[40, 'Different signs give a negative.', 'Are the signs the same or different?'], [-3, 'That is adding. Multiply.', 'What does × mean?']], sol: ['different signs → negative', '8 × 5 = 40', '= −40'] },
          { id: 'g71c5', std: NS2, q: 'Which is <b>positive</b>?', keep: 1, ch: ['−5 × (−6)', ['−5 × 6', 'Different signs give a negative.', 'Same signs or different?'], ['5 × (−6)', 'Different signs give a negative.', 'Same signs or different?']], hint: 'Same signs give a positive.' }
        ],
        can: 'multiply and divide integers.',
        recap: ['Same signs → positive', 'Different signs → negative', 'Works for × and ÷, not for + and −'] }
    ],
    practice: [
      { id: 'g71p1', std: NS1, q: 'Find: <span class="m">−5 + (−9)</span>', ans: -14, neg: 1, hint: 'Same signs: add 5 + 9 and keep the minus.', miss: [[4, 'Same signs: add, do not subtract.', 'Are both negative?'], [14, 'Both numbers are negative, so the sum is negative.', 'Which sign do you keep?'], [-4, 'Same signs: add 5 + 9.', 'What is 5 + 9?']], sol: ['same signs: 5 + 9 = 14', '= −14'] },
      { id: 'g71p2', std: NS1, q: 'Find: <span class="m">12 + (−20)</span>', ans: -8, neg: 1, hint: 'Different signs: 20 − 12, keep the sign of −20.', miss: [[8, '−20 is farther from 0, so the answer is negative.', 'Which number is farther from 0?'], [32, 'Different signs: subtract.', 'Same or different signs?']], sol: ['20 − 12 = 8', '−20 wins', '= −8'] },
      { id: 'g71p3', std: NS1, q: 'Find: <span class="m">−3 − 7</span>', ans: -10, neg: 1, hint: 'Add the opposite: −3 + (−7).', miss: [[4, 'Subtracting 7 moves LEFT from −3.', 'Which way does − 7 move?'], [-4, '−3 + (−7) has same signs: add.', 'What is 3 + 7?'], [10, 'Moving left from −3 stays negative.', 'Is the answer left or right of 0?']], sol: ['−3 + (−7)', '= −10'] },
      { id: 'g71p4', std: NS1, q: 'Find: <span class="m">−2 − (−11)</span>', ans: 9, hint: 'Subtract a negative = add: −2 + 11.', miss: [[-13, 'Subtracting −11 means ADDING 11.', 'What is the opposite of −11?'], [-9, '11 is farther from 0 and positive.', 'Which number wins?']], sol: ['−2 + 11', '= 9'] },
      { id: 'g71p5', std: NS2, q: 'Find: <span class="m">−7 × (−6)</span>', ans: 42, hint: 'Same signs → positive.', miss: [[-42, 'Same signs give a positive.', 'Same or different signs?'], [-13, 'That is adding. Multiply.', 'What does × mean?']], sol: ['same signs → positive', '7 × 6 = 42'] },
      { id: 'g71p6', std: NS2, q: 'Find: <span class="m">54 ÷ (−9)</span>', ans: -6, neg: 1, hint: 'Different signs → negative. 54 ÷ 9 = 6.', miss: [[6, 'Different signs give a negative.', 'Same or different signs?']], sol: ['different signs → negative', '54 ÷ 9 = 6', '= −6'] },
      { id: 'g71p7', std: NS2, q: 'Which is <b>negative</b>?', keep: 1, ch: ['−48 ÷ 6', ['−48 ÷ (−6)', 'Same signs give a positive.', 'Same or different signs?'], ['48 ÷ 6', 'Both positive: positive.', 'Is there a minus sign at all?']], hint: 'Different signs give a negative.' },
      { id: 'g71p8', std: NS1, q: 'A diver is at −15 ft. She swims up 6 ft. Where is she now?', ans: -9, neg: 1, unit: 'ft', hint: 'Up means add: −15 + 6.', miss: [[-21, 'Swimming UP moves toward 0.', 'Does up add or subtract?'], [9, 'She is still under water, so the answer is negative.', 'Is she above or below 0?']], sol: ['−15 + 6', '= −9'] }
    ]
  });
})();
