/* Skill Builders · Grade 7 · Unit 2 · Expressions (NC.7.EE.1–2) · Score 3 core skills */
(function () {
  var D = SB.D, C = SB.C, B = SB.G7.board;
  var EE1 = 'NC.7.EE.1', EE2 = 'NC.7.EE.2';

  function tiles() {
    var s = '', x = 60;
    function xt(x0, id, c) { return D.g(D.rect(x0, 30, 44, 44, { fill: '#FCEBC8', c: c || C.gold, w: 2, r: 6 }) + D.txt(x0 + 22, 59, 'x', { s: 20, it: true, c: C.navy }), { id: id }); }
    function one(x0, id) { return D.g(D.rect(x0, 40, 26, 26, { fill: '#FCEEE2', c: C.red, w: 2, r: 4 }) + D.txt(x0 + 13, 59, '1', { s: 14, c: C.red }), { id: id }); }
    s += xt(40, 'a1') + xt(90, 'a2') + xt(140, 'a3') + one(200, 'b1') + one(230, 'b2') + xt(290, 'a4') + xt(340, 'a5') + one(400, 'b3') + one(430, 'b4') + one(460, 'b5');
    s += D.txt(320, 120, '3x + 2 + 2x + 3', { s: 22, id: 't0' });
    s += D.rect(34, 24, 360, 56, { c: C.blue, w: 2.5, r: 10, id: 'gx', hide: true, style: 'stroke-dasharray:6 4;' });
    s += D.txt(320, 160, 'x-tiles: 3x + 2x = 5x', { s: 18, c: C.blue, id: 'l1', hide: true });
    s += D.txt(320, 192, 'unit tiles: 2 + 3 = 5', { s: 18, c: C.red, id: 'l2', hide: true });
    s += D.txt(320, 232, '5x + 5', { s: 26, c: C.green, id: 'l3', hide: true });
    var g = { gx: { o: 1 } };
    return { w: 640, h: 250, svg: s, title: 'Combine like terms', frames: [
      { cap: 'Each square tile is one <b>x</b>. Each small tile is <b>1</b>. Here is 3x + 2 + 2x + 3.', set: {} },
      { cap: '<b>Like terms</b> are the same kind of tile. Group all the x-tiles.', set: g },
      { cap: '3 x-tiles and 2 x-tiles make <b>5x</b>.', set: Object.assign({ l1: { o: 1 } }, g) },
      { cap: 'The ones go together too: 2 + 3 = <b>5</b>.', set: Object.assign({ l1: { o: 1 }, l2: { o: 1 } }, g) },
      { cap: 'The simplified expression is <b>5x + 5</b>. Same value, fewer terms.', set: Object.assign({ l1: { o: 1 }, l2: { o: 1 }, l3: { o: 1 } }, g) }
    ] };
  }
  function distAnim() {
    var s = D.arrowDefs();
    s += D.txt(320, 70, '4(x + 3)', { s: 32 });
    s += D.path('M266,45 C290,10 310,10 316,40', { c: C.blue, w: 2.5, arrow: 'ahb', id: 'a1', hide: true });
    s += D.path('M266,45 C310,0 360,0 380,40', { c: C.red, w: 2.5, arrow: 'ahr', id: 'a2', hide: true });
    return B('Distribute', s, [{ t: '4 · x = 4x', c: C.blue }, { t: '4 · 3 = 12', c: C.red }, { t: '4x + 12', c: C.green, s: 26 }], [
      'The number outside means 4 groups of (x + 3).',
      'Multiply the 4 by the first term: <b>4 · x = 4x</b>.',
      'Then multiply the 4 by the second term too: <b>4 · 3 = 12</b>.',
      'So 4(x + 3) = <b>4x + 12</b>. Every term inside gets multiplied.'], { th: 100, extra: { 1: { a1: { o: 1 } }, 2: { a2: { o: 1 } } } });
  }

  SB.unit({
    n: 2, title: 'Expressions', std: 'NC.7.EE.1–2', std0: EE1, sendUnit: '7-2', pagePre: 'Grade 7 · ',
    lessons: [
      { id: 'g7-2a', title: 'Combine like terms', std: EE1, anim: tiles(),
        hook: 'Think of sorting socks. You put the same kind together. Like terms work the same way!',
        big: '<b>Like terms</b> have the same variable part. Add or subtract their numbers (coefficients). Keep the variable the same.',
        words: [['Term', 'a part joined by + or −'], ['Coefficient', 'the number in front of a variable: in 5x it is 5'], ['Constant', 'a number by itself'], ['Like terms', 'same variable part: 3x and −2x']],
        watch: 'x means 1x. So 4x + x = 5x, not 4x.',
        walk: { prob: 'Simplify: <span class="m">6x + 4 − 2x + 1</span>', steps: [
          { q: 'Which terms go with 6x?', ch: ['−2x', ['4', '4 has no x. It is a constant.', 'Which term has an x?'], ['1', '1 has no x.', 'Which term has an x?']], ln: '6x − 2x' },
          { q: '6x − 2x = ?', ch: ['4x', ['8x', 'The 2x is SUBTRACTED.', 'What is 6 − 2?'], ['4', 'Keep the x.', 'Does the x go away?']], ln: '4x' },
          { q: 'Now the constants: 4 + 1 = ?', ch: ['5', ['3', 'The 1 is added: + 1.', 'Is it + 1 or − 1?']], ln: '4x + 5' }] },
        checks: [
          { id: 'g72c1', std: EE1, q: 'Simplify <span class="m">5y + 3y − 2</span>. What is the coefficient of y?', ans: 8, hint: '5y + 3y', miss: [[6, 'The −2 has no y. Leave it alone.', 'Which terms have a y?'], [15, 'Add the coefficients, do not multiply.', 'What is 5 + 3?']], sol: ['5y + 3y = 8y', '8y − 2'] },
          { id: 'g72c2', std: EE1, q: 'Simplify: <span class="m">7a − 3 − 4a + 8</span>', keep: 1, ch: ['3a + 5', ['11a + 5', 'The 4a is subtracted.', 'What is 7 − 4?'], ['3a − 11', 'The + 8 is added: −3 + 8.', 'What is −3 + 8?'], ['8a', 'a-terms and numbers are not like terms.', 'Can you add 3a and 5?']], hint: 'a-terms: 7a − 4a. Numbers: −3 + 8.' }
        ],
        can: 'combine like terms.',
        recap: ['Same variable part = like terms', 'Add or subtract the coefficients', 'Keep each sign with its term'] },

      { id: 'g7-2b', title: 'Use the distributive property', std: EE1, anim: distAnim(),
        hook: 'Imagine you hand out 3 snacks AND 1 drink to each of 4 friends. How many things in all?',
        big: 'Multiply the outside number by <b>every</b> term inside the parentheses. <span class="m">a(b + c) = ab + ac</span>.',
        words: [['Distribute', 'multiply the outside number by each term inside'], ['Expand', 'write without parentheses']],
        watch: 'Multiply EVERY term. 5(x + 2) is 5x + 10, not 5x + 2. A negative outside changes every sign.',
        walk: { prob: 'Expand: <span class="m">−3(x − 5)</span>', steps: [
          { q: '−3 times x = ?', ch: ['−3x', ['3x', 'A negative times a positive is negative.', 'What sign is −3 · x?'], ['x − 3', 'Multiply, do not subtract.', 'What does −3(x) mean?']], ln: '−3x' },
          { q: '−3 times −5 = ?', ch: ['+15', ['−15', 'Negative times negative is positive.', 'Same signs give what sign?'], ['−8', 'Multiply, do not add.', 'What is 3 × 5?']], ln: '−3x + 15' }] },
        checks: [
          { id: 'g72c3', std: EE1, q: 'Expand <span class="m">6(x + 4)</span>. What is the constant?', ans: 24, hint: '6 × 4', miss: [[4, 'Multiply the 4 by 6 too.', 'What is 6 × 4?'], [10, 'Multiply, do not add.', 'What does 6(4) mean?']], sol: ['6 · x + 6 · 4', '6x + 24'] },
          { id: 'g72c4', std: EE1, q: 'Expand: <span class="m">2(3x − 7)</span>', keep: 1, ch: ['6x − 14', ['6x − 7', 'Multiply the 7 by 2 too.', 'What is 2 × 7?'], ['5x − 14', '2 · 3x is 6x.', 'What is 2 × 3?'], ['6x + 14', '2 times −7 is negative.', 'What sign is 2 · (−7)?']], hint: '2 · 3x and 2 · (−7).' }
        ],
        can: 'expand an expression with the distributive property.',
        recap: ['Outside number × every inside term', 'Watch the signs', 'Negative × negative = positive'] }
    ],
    practice: [
      { id: 'g72p1', std: EE1, q: 'Simplify <span class="m">9x − 4x + 2</span>. What is the coefficient of x?', ans: 5, hint: '9 − 4', miss: [[13, 'The 4x is subtracted.', 'What is 9 − 4?'], [7, 'The 2 has no x.', 'Which terms have an x?']], sol: ['9x − 4x = 5x', '5x + 2'] },
      { id: 'g72p2', std: EE1, q: 'Simplify <span class="m">3 + 2m + 5 − m</span>. What is the constant?', ans: 8, hint: '3 + 5', miss: [[9, 'm terms are not constants.', 'Which terms have no letter?'], [2, '3 + 5, not 5 − 3.', 'Are both added?']], sol: ['2m − m = m', '3 + 5 = 8', 'm + 8'] },
      { id: 'g72p3', std: EE1, q: 'Simplify: <span class="m">4n + 6 + n − 10</span>', keep: 1, ch: ['5n − 4', ['4n − 4', 'n means 1n: 4n + n = 5n.', 'What is 4 + 1?'], ['5n + 16', '6 − 10 is negative.', 'What is 6 − 10?'], ['1n', 'Numbers and n-terms are not like terms.', 'Can 5n and −4 combine?']], hint: 'n-terms: 4n + 1n. Numbers: 6 − 10.' },
      { id: 'g72p4', std: EE1, q: 'Expand <span class="m">5(x + 3)</span>. What is the constant?', ans: 15, hint: '5 × 3', miss: [[3, 'Multiply the 3 by 5 too.', 'What is 5 × 3?'], [8, 'Multiply, do not add.', 'What does 5(3) mean?']], sol: ['5x + 15'] },
      { id: 'g72p5', std: EE1, q: 'Expand: <span class="m">−4(x + 2)</span>', keep: 1, ch: ['−4x − 8', ['−4x + 8', '−4 times +2 is negative.', 'What sign is −4 · 2?'], ['4x − 8', '−4 times x is negative.', 'What sign is −4 · x?'], ['−4x + 2', 'Multiply the 2 by −4 too.', 'Did every term get multiplied?']], hint: '−4 · x and −4 · 2.' },
      { id: 'g72p6', std: EE1, q: 'Expand <span class="m">3(2x − 5)</span>. What is the coefficient of x?', ans: 6, hint: '3 × 2', miss: [[5, 'Multiply, do not add.', 'What is 3 × 2?'], [2, 'Multiply the 2x by 3.', 'What is 3 · 2x?']], sol: ['3 · 2x = 6x', '3 · (−5) = −15', '6x − 15'] },
      { id: 'g72p7', std: EE2, q: 'A shirt costs p dollars. With 8% tax, the total is <span class="m">p + 0.08p</span>. Which is the same?', keep: 1, ch: ['1.08p', ['0.08p', 'That is only the tax. p is 1p.', 'What is 1 + 0.08?'], ['8.08p', '8% is 0.08, not 8.', 'What is 8% as a decimal?'], ['p + 8', 'The tax is 8% of p, not $8.', 'Is it 8 dollars or 8 percent?']], hint: 'p is 1p. 1 + 0.08 = ?' },
      { id: 'g72p8', std: EE1, q: 'Simplify <span class="m">2(x + 4) + 3x</span>. What is the coefficient of x?', ans: 5, hint: '2(x + 4) = 2x + 8. Then 2x + 3x.', miss: [[3, 'Distribute first: 2 · x = 2x.', 'What is 2(x)?'], [6, 'Add the x-terms: 2x + 3x.', 'Add or multiply?']], sol: ['2x + 8 + 3x', '5x + 8'] }
    ]
  });
})();
