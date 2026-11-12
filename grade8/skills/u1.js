/* Skill Builders · Unit 1 · Real Numbers (NC.8.NS.1, NC.8.NS.2, NC.8.EE.2) · Score 3 core skills */
(function () {
  var D = SB.D, C = SB.C, M = D.minus;
  function ov(d) { return '0.<span class="ov">' + d + '</span>'; }
  function fr(a, b) { return '<span class="frac"><span>' + a + '</span><span>' + b + '</span></span>'; }
  var RI = function (id, std, num, rational, why, hint, ask) {
    return { id: id, std: std, q: 'Is <span class="m">' + num + '</span> rational or irrational?', keep: 1,
      ch: rational ? ['Rational', ['Irrational', why, ask]] : ['Irrational', ['Rational', why, ask]], hint: hint,
      ok: rational ? num + ' is rational because it can be written as a fraction.' : num + ' is irrational because its decimal never stops and never repeats.' };
  };

  /* ---- animations ---- */
  function families() {
    var s = '';
    s += D.g(D.rect(10, 10, 620, 290, { fill: '#FBFCFE', c: C.navy, w: 2, r: 14 }) + D.txt(30, 36, 'Real numbers', { a: 'start', s: 16 }), { id: 'real' });
    s += D.g(D.rect(26, 50, 400, 236, { fill: '#EEF3FE', c: C.blue, w: 2, r: 12 }) + D.txt(42, 74, 'Rational: can be a fraction', { a: 'start', s: 15, c: C.blue }), { id: 'rat', hide: true });
    s += D.g(D.rect(42, 90, 268, 182, { fill: '#E7F5EC', c: C.green, w: 1.5, r: 10 }) + D.txt(56, 112, 'Integers  …, −2, −1, 0, 1, 2, …', { a: 'start', s: 13, c: C.green }), { id: 'int', hide: true });
    s += D.g(D.rect(58, 124, 200, 136, { fill: '#F5F0FF', c: C.purple, w: 1.5, r: 10 }) + D.txt(72, 146, 'Whole  0, 1, 2, 3, …', { a: 'start', s: 13, c: C.purple }), { id: 'who', hide: true });
    s += D.g(D.rect(74, 160, 160, 86, { fill: '#FFF6DB', c: C.gold, w: 1.5, r: 10 }) + D.txt(88, 184, 'Natural  1, 2, 3, …', { a: 'start', s: 13, c: '#8A6100' }), { id: 'nat', hide: true });
    s += D.g(D.rect(440, 50, 176, 236, { fill: '#FDEDEC', c: C.red, w: 2, r: 12 }) + D.txt(528, 74, 'Irrational', { s: 15, c: C.red }) + D.txt(528, 94, 'never stops,', { s: 12, w: 500, c: C.red }) + D.txt(528, 110, 'never repeats', { s: 12, w: 500, c: C.red }), { id: 'irr', hide: true });
    s += D.txt(338, 140, '½', { s: 22, mono: true, c: C.blue, id: 'n1', hide: true }) + D.txt(358, 190, '0.75', { s: 18, mono: true, c: C.blue, id: 'n2', hide: true }) +
      D.g(D.txt(348, 240, '0.333…', { s: 18, mono: true, c: C.blue }), { id: 'n3', hide: true }) + D.txt(286, 128, '−5', { s: 18, mono: true, c: C.green, id: 'n4', hide: true });
    s += D.txt(500, 150, 'π', { s: 26, mono: true, c: C.red, id: 'i1', hide: true }) + D.txt(560, 190, '√2', { s: 22, mono: true, c: C.red, id: 'i2', hide: true }) + D.txt(500, 240, '√10', { s: 22, mono: true, c: C.red, id: 'i3', hide: true });
    s += D.txt(154, 222, '√9 = 3', { s: 17, mono: true, c: '#8A6100', id: 'n5', hide: true });
    return { w: 640, h: 310, svg: s, title: 'Number families', frames: [
      { cap: 'Every number on the number line is a <b>real number</b>.', set: {} },
      { cap: '<b>Rational</b> numbers can be written as a fraction: ½, 0.75, and repeating decimals like 0.333…', set: { rat: { o: 1 }, n1: { o: 1 }, n2: { o: 1 }, n3: { o: 1 } } },
      { cap: 'Inside the rationals live the <b>integers</b> (positive and negative whole numbers and 0), like −5.', set: { int: { o: 1 }, n4: { o: 1 } } },
      { cap: 'Then the <b>whole numbers</b> (0, 1, 2, …) and the <b>natural</b> (counting) numbers (1, 2, 3, …).', set: { who: { o: 1 }, nat: { o: 1 } } },
      { cap: '√9 = 3, a whole number. A square root of a <b>perfect square</b> is rational.', set: { n5: { o: 1 } } },
      { cap: '<b>Irrational</b> numbers cannot be a fraction. Their decimals never stop and never repeat: π, √2, √10.', set: { irr: { o: 1 }, i1: { o: 1 }, i2: { o: 1 }, i3: { o: 1 } } }
    ] };
  }
  function nines() {
    var s = '', y = 70;
    s += D.txt(60, y, '0.272727…', { s: 30, mono: true, a: 'start', id: 'd1' });
    s += D.g(D.txt(400, y, '0.27', { s: 30, mono: true, a: 'start' }) + D.line(436, y - 28, 472, y - 28, { c: C.navy, w: 2.5 }), { id: 'bar', hide: true });
    s += D.rect(400 + 36 - 4, y - 26, 44, 34, { c: C.gold, w: 2.5, r: 6, id: 'hl', hide: true });
    s += D.txt(200, 175, '27', { s: 34, mono: true, c: C.blue, id: 'top', hide: true }) + D.line(160, 188, 240, 188, { w: 3, id: 'fb', hide: true }) + D.txt(200, 228, '99', { s: 34, mono: true, c: C.gold, id: 'bot', hide: true });
    s += D.txt(330, 205, '÷ 9', { s: 20, mono: true, c: C.gray, id: 'div', hide: true }) + D.txt(390, 205, '=', { s: 30, mono: true, id: 'eq', hide: true });
    s += D.txt(460, 175, '3', { s: 34, mono: true, c: C.green, id: 't2', hide: true }) + D.line(430, 188, 490, 188, { w: 3, id: 'fb2', hide: true }) + D.txt(460, 228, '11', { s: 34, mono: true, c: C.green, id: 'b2', hide: true });
    s += D.txt(320, 280, '2 repeating digits → two 9s', { s: 16, c: '#8A6100', id: 'rule', hide: true });
    return { w: 640, h: 300, svg: s, title: 'The 9’s rule', frames: [
      { cap: 'This decimal repeats <b>27</b> forever.', set: {} },
      { cap: 'Write it with a <b>bar</b> over the digits that repeat.', set: { bar: { o: 1 } } },
      { cap: 'The repeating digits, <b>27</b>, go on top of the fraction.', set: { hl: { o: 1 }, top: { o: 1 }, fb: { o: 1 } } },
      { cap: 'The bottom is all <b>9s</b>: one 9 for each repeating digit. 2 digits → <b>99</b>.', set: { bot: { o: 1 }, rule: { o: 1 } } },
      { cap: 'Simplify. 27 and 99 can both be divided by 9: <b>27/99 = 3/11</b>.', set: { div: { o: 1 }, eq: { o: 1 }, t2: { o: 1 }, fb2: { o: 1 }, b2: { o: 1 } } }
    ] };
  }
  function roots() {
    var s = '', u = 26, x0 = 50, y0 = 40;
    for (var i = 0; i < 25; i++) s += D.rect(x0 + (i % 5) * u, y0 + Math.floor(i / 5) * u, u - 2, u - 2, { fill: '#DBEAFE', c: C.blue, w: 1, id: 't' + i, hide: true });
    s += D.txt(x0 + 65, y0 + 160, 'area = 25', { s: 17, id: 'ar', hide: true }) + D.txt(x0 + 65, y0 - 10, 'side = 5', { s: 17, c: C.green, id: 'sd', hide: true });
    var cx = 430, cy = 170, e = 34;       // 3 × 3 × 3 cube drawn as an oblique stack
    var cube = '';
    for (var z = 2; z >= 0; z--) for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) {
      var X = cx + c * e + z * 16, Y = cy - r * e - z * 16;
      cube += D.poly([[X, Y], [X + e, Y], [X + e, Y - e], [X, Y - e]], { fill: '#FFF6DB', c: C.gold, w: 1.2 });
      if (c === 2) cube += D.poly([[X + e, Y], [X + e + 16, Y - 16], [X + e + 16, Y - e - 16], [X + e, Y - e]], { fill: '#F5E3A8', c: C.gold, w: 1.2 });
      if (r === 2) cube += D.poly([[X, Y - e], [X + e, Y - e], [X + e + 16, Y - e - 16], [X + 16, Y - e - 16]], { fill: '#FFFBEA', c: C.gold, w: 1.2 });
    }
    s += D.g(cube, { id: 'cube', hide: true });
    s += D.txt(cx + 70, 240, 'volume = 27', { s: 17, id: 'vo', hide: true }) + D.txt(cx + 70, 265, 'edge = 3', { s: 17, c: C.green, id: 'ed', hide: true });
    var f = [{ cap: 'Squaring a number makes a <b>square</b>. 5 × 5 = 25 small tiles.', set: {} }];
    var on = {}; for (var k = 0; k < 25; k++) on['t' + k] = { o: 1 }; f[0].set = on;
    f.push({ cap: 'The square root goes backward: area 25 → side 5. So <b>√25 = 5</b>.', set: { ar: { o: 1 }, sd: { o: 1 } } });
    f.push({ cap: 'Cubing makes a <b>cube</b>: 3 × 3 × 3 = 27 small blocks.', set: { cube: { o: 1 }, vo: { o: 1 } } });
    f.push({ cap: 'The cube root goes backward: volume 27 → edge 3. So <b>∛27 = 3</b>.', set: { ed: { o: 1 } } });
    return { w: 640, h: 290, svg: s, title: 'Squares and square roots, cubes and cube roots', frames: f };
  }
  function estimate() {
    var nl = D.nl({ x0: 60, x1: 580, y: 150, lo: 6, hi: 7, step: 1, minor: 0.1, fs: 18 }), X = nl.X;
    var s = D.arrowDefs() + nl.svg;
    s += D.txt(X(6), 110, '√36', { s: 18, mono: true, c: C.blue, id: 'a', hide: true }) + D.txt(X(7), 110, '√49', { s: 18, mono: true, c: C.blue, id: 'b', hide: true });
    s += D.txt(320, 40, '√45 is between √36 and √49', { s: 20, id: 't1', hide: true });
    var est = 6 + 9 / 13;
    s += D.circ(X(est), 150, 8, { fill: C.gold, id: 'p', hide: true }) + D.txt(X(est), 110, '√45', { s: 18, mono: true, c: '#8A6100', id: 'pl', hide: true });
    s += D.txt(320, 230, '45 is 9 past 36, out of 13 steps to 49 → 9 ÷ 13 ≈ 0.7', { s: 15, w: 500, c: C.gray, id: 't2', hide: true });
    s += D.txt(320, 265, '√45 ≈ 6.7', { s: 22, mono: true, c: C.green, id: 't3', hide: true });
    return { w: 640, h: 285, svg: s, title: 'Estimate a square root', frames: [
      { cap: 'Estimate <b>√45</b>. 45 is not a perfect square, so √45 is irrational. We estimate it.', set: {} },
      { cap: 'Find the perfect squares around 45: <b>36 &lt; 45 &lt; 49</b>.', set: { t1: { o: 1 } } },
      { cap: '√36 = 6 and √49 = 7. So √45 is <b>between 6 and 7</b>.', set: { a: { o: 1 }, b: { o: 1 } } },
      { cap: '45 is closer to 49 than to 36, so √45 is closer to 7.', set: { p: { o: 1 }, pl: { o: 1 } } },
      { cap: 'To get the tenths: 9 ÷ 13 ≈ 0.7. <b>√45 ≈ 6.7</b>.', set: { t2: { o: 1 }, t3: { o: 1 } } }
    ] };
  }

  var STD1 = 'NC.8.NS.1', STD2 = 'NC.8.NS.2', STDE = 'NC.8.EE.2';
  SB.unit({
    n: 1, title: 'Real Numbers', std: 'NC.8.NS.1–2 · NC.8.EE.2', std0: STD1,
    lessons: [
      { id: '1a', title: 'Rational or irrational?', std: STD1, anim: families(),
        big: 'A number is <b>rational</b> if it can be written as a <b>fraction</b> of two integers. Its decimal <b>stops</b> or <b>repeats</b>. A number is <b>irrational</b> if its decimal <b>never stops and never repeats</b>, like π or √2.',
        words: [['Terminating decimal', 'a decimal that stops: 0.75'], ['Repeating decimal', 'a decimal with digits that repeat forever: 0.333…'], ['Perfect square', 'a whole number times itself: 1, 4, 9, 16, 25, 36, 49, …']],
        more: '<b>Square roots:</b> √(perfect square) is rational (√49 = 7). √(not a perfect square) is irrational (√10).<br><b>Say it this way:</b> "___ is rational because it can be written as a fraction."',
        watch: 'A long decimal is not always irrational. If it <b>repeats</b>, it is rational.',
        walk: { prob: 'Is √49 rational or irrational?', steps: [
          { q: 'Is 49 a perfect square?', ch: ['Yes: 7 × 7 = 49', ['No: 49 is odd', 'Odd numbers can be perfect squares (9, 25, 49).', 'Is there a whole number that times itself makes 49?'], ['Yes: 24.5 × 2 = 49', 'A square root uses the SAME number twice, not 2.', 'What number times ITSELF is 49?']], ln: '7 × 7 = 49', lab: '49 is a perfect square' },
          { q: 'So what is √49?', ch: ['7', ['24.5', '√ is not "divide by 2".', 'What number times itself is 49?'], ['2,401', 'That is 49 × 49. A square root goes backward.', 'Do we multiply or undo?']], ln: '√49 = 7' },
          { q: 'Can 7 be written as a fraction?', ch: ['Yes: 7 = 7/1, so √49 is rational', ['No, so √49 is irrational', 'Every integer can be a fraction: 7 = 7/1.', 'What is 7 divided by 1?']], ln: '7 = 7/1 → rational' }] },
        checks: [
          RI('u1c1', STD1, '0.333…', true, '0.333… repeats, so it is rational: it equals 1/3.', 'Does the decimal stop, repeat, or neither?', 'Does 0.333… repeat?'),
          RI('u1c2', STD1, '√10', false, '10 is not a perfect square. √10 = 3.1622776… never stops and never repeats.', 'Is 10 a perfect square?', 'Is there a whole number that times itself makes 10?'),
          { id: 'u1c3', std: STD1, q: 'Which number is <b>irrational</b>?', ch: ['π', ['−5', '−5 is an integer: −5 = −5/1.', 'Can −5 be written as a fraction?'], ['0.75', '0.75 stops. It equals 3/4.', 'Does 0.75 stop?'], ['√16', '16 is a perfect square: √16 = 4.', 'What is √16?']], hint: 'Look for the decimal that never stops and never repeats.' }
        ],
        can: 'sort numbers into rational and irrational, and explain why.',
        recap: ['Fraction, integer, stops, or repeats → rational', 'Never stops and never repeats → irrational', '√(perfect square) → rational; √(not perfect square) → irrational'] },

      { id: '1b', title: 'Repeating decimals to fractions (the 9’s rule)', std: STD1, anim: nines(),
        big: 'To change a repeating decimal into a fraction: the <b>repeating digits go on top</b>. The <b>bottom is all 9s</b>, one 9 for each repeating digit. Then <b>simplify</b>.',
        words: [['Bar notation', 'a bar over the digits that repeat: ' + ov('3') + ' = 0.333…'], ['Simplify', 'divide the top and bottom by the same number']],
        more: '<table class="tbl"><tr><th>Decimal</th><th>Repeating digits</th><th>Fraction</th><th>Simplified</th></tr><tr><td class="m">' + ov('3') + '</td><td>1 digit</td><td>3/9</td><td>1/3</td></tr><tr><td class="m">' + ov('27') + '</td><td>2 digits</td><td>27/99</td><td>3/11</td></tr><tr><td class="m">' + ov('125') + '</td><td>3 digits</td><td>125/999</td><td>125/999</td></tr></table>',
        watch: 'Count the 9s carefully: one 9 for <b>each</b> repeating digit. And always simplify.',
        walk: { prob: 'Write 0.363636… as a fraction', steps: [
          { q: 'Which digits repeat?', ch: ['36', ['3', 'Look again: the pattern is 3, 6, 3, 6, …', 'What is the shortest block that repeats?'], ['363', 'The block 36 repeats. 363 is not the repeating block.', 'Where does the pattern start over?']], ln: '0.<span class="ov">36</span>', lab: 'two repeating digits' },
          { q: 'What is the bottom of the fraction?', ch: ['99 (two 9s)', ['9 (one 9)', 'There are 2 repeating digits, so we need two 9s.', 'How many digits repeat?'], ['100', 'The 9’s rule uses 9s, not 10s. 100 is for decimals that stop.', 'What digit fills the bottom?']], ln: '36/99' },
          { q: 'Simplify 36/99. What number divides both?', ch: ['9: 36/99 = 4/11', ['3: 36/99 = 12/33, done', '12/33 can still be divided by 3. Use the biggest number, 9.', 'Can 12 and 33 both be divided again?'], ['It is already simplest', '36 and 99 are both in the 9 times table.', 'Is 36 ÷ 9 a whole number? Is 99 ÷ 9?']], ln: '36/99 = 4/11', lab: 'divide top and bottom by 9' }] },
        checks: [
          { id: 'u1c4', std: STD1, q: 'Write <span class="m">' + ov('5') + '</span> as a fraction.', ch: ['5/9', ['5/10', '5/10 = 0.5, which stops. A repeating decimal uses 9s.', 'What digit goes on the bottom?'], ['5/99', 'Only ONE digit repeats, so use one 9.', 'How many digits are under the bar?'], ['1/5', '1/5 = 0.2. That is a different number.', 'Which digit repeats? Put it on top.']], hint: 'One repeating digit → one 9 on the bottom.' },
          { id: 'u1c5', std: STD1, q: 'Write <span class="m">' + ov('12') + '</span> as a fraction in simplest form.', ch: ['4/33', ['12/99', 'Right start, but simplify: 12 and 99 can both be divided by 3.', 'What number divides 12 and 99?'], ['12/9', 'Two digits repeat, so use two 9s: 99.', 'How many digits are under the bar?'], ['3/25', '3/25 = 0.12, which stops. This decimal repeats.', 'Does 0.121212… stop?']], hint: '12 goes on top. Two 9s on the bottom. Then simplify.' }
        ],
        can: 'change a repeating decimal into a fraction with the 9’s rule.',
        recap: ['Repeating digits on top', 'One 9 for each repeating digit on the bottom', 'Simplify'] },

      { id: '1c', title: 'Square roots and cube roots', std: STDE, anim: roots(),
        big: 'A <b>square root</b> undoes squaring: √25 = 5 because 5 × 5 = 25. A <b>cube root</b> undoes cubing: ∛27 = 3 because 3 × 3 × 3 = 27.',
        words: [['Squared (²)', 'a number times itself: 6² = 6 × 6 = 36'], ['Cubed (³)', 'a number times itself 3 times: 2³ = 2 × 2 × 2 = 8'], ['√ and ∛', 'square root and cube root: they go backward']],
        more: '<table class="tbl"><tr><th>n</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td></tr><tr><th>n²</th><td>1</td><td>4</td><td>9</td><td>16</td><td>25</td><td>36</td><td>49</td><td>64</td><td>81</td><td>100</td></tr><tr><th>n³</th><td>1</td><td>8</td><td>27</td><td>64</td><td>125</td><td>216</td><td>343</td><td>512</td><td>729</td><td>1000</td></tr></table>',
        watch: '√ does <b>not</b> mean "divide by 2", and ∛ does <b>not</b> mean "divide by 3". √16 = 4, not 8.',
        walk: { prob: 'Find ∛125', steps: [
          { q: 'What does ∛125 ask?', ch: ['What number × itself × itself = 125?', ['What is 125 ÷ 3?', '∛ is not dividing by 3.', 'Does ∛8 = 8 ÷ 3? Try 2 × 2 × 2.'], ['What is 125 × 3?', 'A root goes backward, so it makes the number smaller.', 'Is the answer bigger or smaller than 125?']], ln: '? × ? × ? = 125' },
          { q: 'Try 5. What is 5 × 5 × 5?', ch: ['125', ['15', 'That is 5 + 5 + 5. We multiply.', 'What is 5 × 5? Then × 5 again?'], ['25', 'That is only 5 × 5. Multiply by 5 one more time.', 'What is 25 × 5?']], ln: '5 × 5 × 5 = 125' },
          { q: 'So ∛125 = ?', ch: ['5', ['25', '25 × 25 × 25 is much more than 125.', 'Which number did we multiply 3 times?'], ['41.7', '125 ÷ 3 ≈ 41.7. A cube root is not ÷ 3.', 'What number × itself × itself is 125?']], ln: '∛125 = 5' }] },
        checks: [
          { id: 'u1c6', std: STDE, q: 'Find <span class="m">√81</span>.', ans: 9, hint: 'What number times itself is 81?', miss: [[40.5, '√ is not "divide by 2". 40.5 × 40.5 is much more than 81.', 'What number times ITSELF is 81?'], [6561, 'That is 81 × 81. A square root goes backward.', 'Should the answer be bigger or smaller than 81?']] },
          { id: 'u1c7', std: STDE, q: 'Find <span class="m">∛8</span>.', ans: 2, hint: 'What number × itself × itself = 8?', miss: [[8 / 3, '∛ is not "divide by 3".', 'Try 2 × 2 × 2. What do you get?'], [4, '4 × 4 × 4 = 64, not 8.', 'Try a smaller number. What is 2 × 2 × 2?'], [512, 'That is 8 cubed. A cube root goes backward.', 'Bigger or smaller than 8?']] },
          { id: 'u1c8', std: STD1, q: 'Which number is a <b>perfect square</b>?', ch: ['36', ['18', '18 is 2 × 9, not a number times itself.', 'Is there a whole number n with n × n = 18?'], ['27', '27 is a perfect CUBE (3 × 3 × 3), not a perfect square.', 'Is there a whole number n with n × n = 27?'], ['50', '7 × 7 = 49 and 8 × 8 = 64. 50 is in between.', 'Is 50 on the list of squares?']], hint: 'Look for a number that is a whole number times itself.' }
        ],
        can: 'find square roots of perfect squares and cube roots of perfect cubes.',
        recap: ['√n: what number times itself is n?', '∛n: what number × itself × itself is n?', 'Check by multiplying back'] },

      { id: '1d', title: 'Estimate roots and order numbers', std: STD2, anim: estimate(),
        big: 'To estimate a square root that is not a perfect square, find the <b>perfect squares just below and just above</b>. The root is <b>between</b> their roots. To compare numbers, write them all as <b>decimals</b> first.',
        words: [['Estimate', 'a close guess you can explain'], ['Between', '√45 is between 6 and 7 because 36 &lt; 45 &lt; 49'], ['Least to greatest', 'smallest first, biggest last']],
        more: '<b>4-step estimate of √45:</b> 36 &lt; 45 &lt; 49 → (45 − 36) ÷ (49 − 36) = 9 ÷ 13 ≈ 0.7 → √45 ≈ 6.7',
        watch: 'Line up the decimals before you compare. 3.5 is bigger than 3.375 even though "375" looks long.',
        walk: { prob: 'Estimate √20 to the nearest tenth', steps: [
          { q: 'Which perfect squares are just below and just above 20?', ch: ['16 and 25', ['10 and 30', '10 and 30 are not perfect squares.', 'Which numbers on the n² list are near 20?'], ['4 and 5', '4 and 5 are the roots. First find the squares: 16 and 25.', 'What is 4²? What is 5²?']], ln: '16 &lt; 20 &lt; 25' },
          { q: 'So √20 is between…', ch: ['4 and 5', ['16 and 25', 'Those are the squares. Take the square root of each.', 'What is √16? What is √25?'], ['10 and 11', '20 ÷ 2 = 10, but √ is not ÷ 2.', 'What is √16?']], ln: '4 &lt; √20 &lt; 5' },
          { q: 'Find the tenths: (20 − 16) ÷ (25 − 16) = ?', ch: ['4 ÷ 9 ≈ 0.4', ['4 ÷ 25 ≈ 0.2', 'The bottom is the gap between the squares: 25 − 16 = 9.', 'How far is it from 16 to 25?'], ['20 ÷ 25 = 0.8', 'Use how far 20 is past 16, over the gap 25 − 16.', 'How far past 16 is 20?']], ln: '√20 ≈ 4 + 0.4 = 4.4' }] },
        checks: [
          { id: 'u1c9', std: STD2, q: '<span class="m">√30</span> is between which two whole numbers?', ch: ['5 and 6', ['15 and 16', '√ is not ÷ 2.', 'What is 5²? What is 6²?'], ['25 and 36', 'Those are the perfect squares. Take their roots.', 'What is √25? √36?'], ['6 and 7', '6² = 36, which is more than 30.', 'Which perfect square is just below 30?']], hint: '25 &lt; 30 &lt; 36. Take the square root of each.' },
          { id: 'u1c10', std: STD2, q: 'Which is greater: <span class="m">√50</span> or <span class="m">7.5</span>?', keep: 1, ch: ['7.5', ['√50', '√50 is just a little more than √49 = 7, so √50 ≈ 7.1.', 'Is 7.1 more or less than 7.5?'], ['They are equal', '7.5 × 7.5 = 56.25, not 50.', 'What is 7.5 squared?']], hint: 'Estimate √50: 49 &lt; 50 &lt; 64.' },
          { id: 'u1c11', std: STD2, q: 'Order from least to greatest: <span class="m">√5, 2.1, 7/3</span>', ch: ['2.1, √5, 7/3', ['√5, 2.1, 7/3', '√5 ≈ 2.24, which is more than 2.1.', 'What is √5 as a decimal?'], ['7/3, √5, 2.1', 'That is greatest to least. Start with the smallest.', 'Which number is the smallest?'], ['2.1, 7/3, √5', '7/3 ≈ 2.33 and √5 ≈ 2.24, so √5 comes first.', 'Which is smaller: 2.24 or 2.33?']], hint: 'Make each one a decimal: √5 ≈ 2.24, 7/3 ≈ 2.33.' }
        ],
        can: 'estimate a square root between two whole numbers and order real numbers.',
        recap: ['Find the perfect squares below and above', 'The root is between their roots', 'Make every number a decimal, then order'] }
    ],
    practice: [
      RI('u1p1', STD1, '0.1212…', true, '0.1212… repeats "12", so it is rational (it equals 12/99 = 4/33).', 'Does the decimal stop, repeat, or neither?', 'Is there a block of digits that repeats?'),
      RI('u1p2', STD1, '√144', true, '144 is a perfect square: 12 × 12 = 144. So √144 = 12, which is rational.', 'Is 144 a perfect square?', 'What is 12 × 12?'),
      RI('u1p3', STD1, '√8', false, '8 is not a perfect square (2 × 2 = 4, 3 × 3 = 9). √8 never stops and never repeats.', 'Is 8 a perfect square?', 'Is there a whole number that times itself makes 8?'),
      { id: 'u1p4', std: STD1, q: 'Write <span class="m">' + ov('7') + '</span> as a fraction.', ch: ['7/9', ['7/10', '7/10 = 0.7 stops. A repeating decimal uses 9s.', 'What goes on the bottom in the 9’s rule?'], ['7/99', 'One digit repeats, so use one 9.', 'How many digits are under the bar?'], ['1/7', '1/7 = 0.142857…, a different number.', 'Which digit repeats? Put it on top.']], hint: 'Repeating digit on top, one 9 on the bottom.' },
      { id: 'u1p5', std: STD1, q: 'Write <span class="m">' + ov('45') + '</span> as a fraction in simplest form.', ch: ['5/11', ['45/99', 'Good start. Now simplify: divide top and bottom by 9.', 'What is 45 ÷ 9? 99 ÷ 9?'], ['45/100', '45/100 = 0.45 stops. This decimal repeats.', 'Which digit fills the bottom?'], ['9/20', '9/20 = 0.45 stops. This decimal repeats.', 'Does 0.4545… stop?']], hint: '45 on top, 99 on the bottom, then simplify.',
        steps: [{ q: 'Which digits repeat?', ch: ['45', ['4', 'The block is 4, 5, 4, 5, …', 'What block repeats?']], ln: '45 repeats (2 digits)' },
          { q: 'Bottom of the fraction?', ch: ['99', ['9', 'Two digits → two 9s.', 'How many digits repeat?'], ['100', 'The 9’s rule uses 9s.', 'Which digit fills the bottom?']], ln: '45/99' },
          { q: 'Simplify 45/99.', ch: ['Divide both by 9: 5/11', ['Divide both by 5: 9/99', '99 ÷ 5 is not a whole number.', 'Which number goes into both 45 and 99?']], ln: '45/99 = 5/11' }],
        sol: ['0.<span class="ov">45</span> → 45/99', { ln: '45 ÷ 9 = 5, 99 ÷ 9 = 11', lab: 'simplify' }, '= 5/11'] },
      { id: 'u1p6', std: STDE, q: 'Find <span class="m">√121</span>.', ans: 11, hint: 'What number times itself is 121?', miss: [[60.5, '√ is not ÷ 2.', 'What number times ITSELF is 121?'], [14641, 'That is 121 × 121.', 'Should the root be bigger or smaller than 121?']], sol: ['11 × 11 = 121', '√121 = 11'] },
      { id: 'u1p7', std: STDE, q: 'Find <span class="m">∛64</span>.', ans: 4, hint: 'What number × itself × itself = 64?', miss: [[8, '8 × 8 = 64, so 8 is the SQUARE root. A cube root multiplies 3 times.', 'What is 4 × 4 × 4?'], [64 / 3, '∛ is not ÷ 3.', 'What number × itself × itself is 64?']], sol: ['4 × 4 × 4 = 64', '∛64 = 4'] },
      { id: 'u1p8', std: STD2, q: '<span class="m">√40</span> is between which two whole numbers?', ch: ['6 and 7', ['20 and 21', '√ is not ÷ 2.', 'What is 6²? 7²?'], ['36 and 49', 'Those are the perfect squares. Take their roots.', 'What is √36? √49?'], ['5 and 6', '6² = 36 and 36 &lt; 40, so √40 is more than 6.', 'Which perfect square is just below 40?']], hint: '36 &lt; 40 &lt; 49.',
        steps: [{ q: 'Perfect squares just below and just above 40?', ch: ['36 and 49', ['25 and 36', '36 is below 40, but so is 25. Which square is just ABOVE 40?', 'Is 36 more or less than 40?']], ln: '36 &lt; 40 &lt; 49' }, { q: 'Take the square root of each.', ch: ['6 and 7', ['18 and 24.5', '√ is not ÷ 2.', 'What is √36?']], ln: '6 &lt; √40 &lt; 7' }] },
      { id: 'u1p9', std: STD2, q: 'Estimate <span class="m">√50</span> to the nearest tenth.', ans: 7.1, tol: 0.051, hint: '49 &lt; 50 &lt; 64. √49 = 7. 50 is only 1 past 49.', miss: [[25, '√ is not ÷ 2.', 'What is √49?'], [7.5, '50 is very close to 49, so √50 is very close to 7.', 'Is 50 halfway between 49 and 64?']],
        steps: [{ q: 'Perfect squares around 50?', ch: ['49 and 64', ['25 and 50', '50 is not a perfect square.', 'What is 7²? 8²?']], ln: '49 &lt; 50 &lt; 64' }, { q: 'Roots of 49 and 64?', ch: ['7 and 8', ['24.5 and 32', '√ is not ÷ 2.', 'What is √49?']], ln: '7 &lt; √50 &lt; 8' }, { q: 'Tenths: (50 − 49) ÷ (64 − 49) = ?', ch: ['1 ÷ 15 ≈ 0.1', ['1 ÷ 64 ≈ 0.02', 'Divide by the gap, 64 − 49 = 15.', 'How far is it from 49 to 64?']], ln: '√50 ≈ 7 + 0.1 = 7.1' }],
        sol: ['49 &lt; 50 &lt; 64 → 7 &lt; √50 &lt; 8', '(50 − 49) ÷ (64 − 49) = 1 ÷ 15 ≈ 0.07', '√50 ≈ 7.1'] },
      { id: 'u1p10', std: STD2, q: 'Order from least to greatest: <span class="m">π, √10, 10/3, 3.5</span>', wide: 1, ch: ['π, √10, 10/3, 3.5', ['√10, π, 10/3, 3.5', 'π ≈ 3.14 and √10 ≈ 3.16, so π comes first.', 'Which is smaller: 3.14 or 3.16?'], ['3.5, 10/3, √10, π', 'That is greatest to least.', 'Which number is the smallest?'], ['π, 10/3, √10, 3.5', '10/3 ≈ 3.33 is more than √10 ≈ 3.16.', 'Which is bigger: 3.33 or 3.16?']], hint: 'Decimals: π ≈ 3.14, √10 ≈ 3.16, 10/3 ≈ 3.33, 3.5.',
        sol: ['π ≈ 3.14, √10 ≈ 3.16, 10/3 ≈ 3.33, 3.5 = 3.50', 'π &lt; √10 &lt; 10/3 &lt; 3.5'] },
      { id: 'u1p11', std: STDE, q: '<b>Find the mistake.</b> Sam wrote: <span class="m">√36 = 18</span>. What went wrong?', wide: 1, ch: ['Sam divided 36 by 2. √36 = 6 because 6 × 6 = 36.', ['Sam is right: 18 + 18 = 36.', 'A square root uses multiplication, not addition. 18 × 18 = 324.', 'What is 18 × 18?'], ['√36 = 72 because 36 × 2 = 72.', 'A square root makes the number smaller here, not bigger.', 'What number times itself is 36?'], ['√36 = 9 because 4 × 9 = 36.', 'A square root uses the SAME number twice. 4 and 9 are different.', 'What number times ITSELF is 36?']], hint: 'Check: what number times itself is 36?' }
    ]
  });
})();
