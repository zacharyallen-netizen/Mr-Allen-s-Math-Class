/* Skill Builders · Unit 2 · Exponents & Scientific Notation (NC.8.EE.1, NC.8.EE.3, NC.8.EE.4) · Score 3 core skills */
(function () {
  var D = SB.D, C = SB.C;
  var E1 = 'NC.8.EE.1', E3 = 'NC.8.EE.3', E4 = 'NC.8.EE.4';
  function p(b, e) { return b + '<sup>' + String(e).replace('-', '−') + '</sup>'; }
  function sci(a, e) { return a + ' × 10<sup>' + String(e).replace('-', '−') + '</sup>'; }
  function sup(e) { return { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }[e]; }
  function s(b, e) { return b + String(e).split('').map(sup).join(''); }   // SVG text superscripts

  /* ---- animations ---- */
  function meaning() {
    var g = '', x0 = 70;
    g += D.txt(320, 60, s('2', 5), { s: 40, mono: true, id: 'p' });
    g += D.txt(300, 30, 'base', { s: 13, c: C.blue, id: 'lb', hide: true }) + D.txt(352, 26, 'exponent', { s: 13, c: C.gold, id: 'le', hide: true });
    for (var i = 0; i < 5; i++) {
      g += D.g(D.rect(x0 + i * 104, 110, 70, 56, { fill: '#DBEAFE', c: C.blue, r: 8 }) + D.txt(x0 + 35 + i * 104, 147, '2', { s: 26, mono: true, c: C.blue }), { id: 'b' + i, hide: true });
      if (i < 4) g += D.txt(x0 + 87 + i * 104, 147, '×', { s: 24, mono: true, id: 'm' + i, hide: true });
    }
    g += D.txt(320, 215, '= 32', { s: 30, mono: true, c: C.green, id: 'r', hide: true });
    g += D.txt(320, 260, 'NOT 2 × 5 = 10', { s: 16, c: C.red, id: 'no', hide: true });
    var f = [{ cap: 'Read <b>2⁵</b> as "2 to the 5th power."', set: {} }, { cap: 'The <b>base</b> (2) is the number being multiplied. The <b>exponent</b> (5) says how many times.', set: { lb: { o: 1 }, le: { o: 1 } } }];
    var st = {}; for (var k = 0; k < 5; k++) { st['b' + k] = { o: 1 }; if (k < 4) st['m' + k] = { o: 1 }; }
    f.push({ cap: 'Write 2 five times, with × between them: 2 × 2 × 2 × 2 × 2.', set: st });
    f.push({ cap: 'Multiply: 2 → 4 → 8 → 16 → <b>32</b>.', set: { r: { o: 1 } } });
    f.push({ cap: 'An exponent is <b>not</b> base × exponent. 2⁵ is 32, not 10.', set: { no: { o: 1 } } });
    return { w: 640, h: 280, svg: g, title: 'What an exponent means', frames: f };
  }
  function product() {
    var g = '';
    g += D.txt(320, 50, 'x³ · x⁴', { s: 34, mono: true, id: 'q' });
    g += D.g(D.txt(170, 120, '(x · x · x)', { s: 26, mono: true, c: C.blue }) + D.txt(320, 120, '·', { s: 26, mono: true }) + D.txt(470, 120, '(x · x · x · x)', { s: 26, mono: true, c: C.purple }), { id: 'ex', hide: true });
    g += D.txt(320, 175, '7 x’s multiplied', { s: 18, c: C.gray, id: 'cnt', hide: true });
    g += D.txt(320, 225, 'x³ · x⁴ = x³⁺⁴ = x⁷', { s: 28, mono: true, c: C.green, id: 'r', hide: true });
    g += D.txt(320, 268, 'Multiply same base → ADD the exponents', { s: 16, c: '#8A6100', id: 'rule', hide: true });
    var h = '';
    h += D.txt(320, 50, 'x⁵ ÷ x²', { s: 34, mono: true });
    return { w: 640, h: 285, svg: g, title: 'Product rule', frames: [
      { cap: 'Multiply <b>x³ · x⁴</b>. Both have the same base, x.', set: {} },
      { cap: 'Write each one out: x³ is three x’s, and x⁴ is four x’s.', set: { ex: { o: 1 } } },
      { cap: 'Count them: <b>3 + 4 = 7</b> x’s.', set: { cnt: { o: 1 } } },
      { cap: 'So x³ · x⁴ = <b>x⁷</b>.', set: { r: { o: 1 } } },
      { cap: 'Shortcut: same base, multiplying → <b>add the exponents</b>. (For dividing, subtract them.)', set: { rule: { o: 1 } } }
    ] };
  }
  function pattern() {
    var g = '', rows = [[3, '8'], [2, '4'], [1, '2'], [0, '1'], [-1, '1/2'], [-2, '1/4']];
    rows.forEach(function (r, i) {
      g += D.g(D.txt(230, 40 + i * 42, s('2', r[0]), { s: 26, mono: true, a: 'end' }) + D.txt(260, 40 + i * 42, '=', { s: 26, mono: true }) + D.txt(290, 40 + i * 42, r[1], { s: 26, mono: true, a: 'start', c: r[0] <= 0 ? C.green : C.navy }), { id: 'r' + i, hide: i > 0 });
      if (i > 0) g += D.txt(420, 22 + i * 42, '÷ 2', { s: 16, c: C.gold, id: 'd' + i, hide: true });
    });
    var f = [{ cap: 'Start with <b>2³ = 8</b>. Watch what happens when the exponent goes down by 1.', set: {} }];
    rows.slice(1).forEach(function (r, k) {
      var i = k + 1, o = {}; o['r' + i] = { o: 1 }; o['d' + i] = { o: 1 };
      f.push({ cap: i === 3 ? 'Keep dividing by 2: <b>2⁰ = 1</b>. Any nonzero number to the 0 power is 1.' : i === 4 ? 'Keep going: <b>2⁻¹ = 1/2</b>. A negative exponent means a fraction (the reciprocal).' : i === 5 ? '<b>2⁻² = 1/2² = 1/4</b>. Flip it and make the exponent positive.' : 'Each step down divides by 2: <b>' + s('2', r[0]) + ' = ' + r[1] + '</b>.', set: o });
    });
    return { w: 640, h: 290, svg: g, title: 'Zero and negative exponents', frames: f };
  }
  function sciAnim() {
    var g = D.arrowDefs(), y = 80, digits = '45000000', x0 = 140, cw = 30;
    for (var i = 0; i < digits.length; i++) g += D.txt(x0 + i * cw, y, digits[i], { s: 30, mono: true });
    g += D.circ(x0 + 8 * cw - 12, y + 2, 4, { fill: C.red, id: 'dot0' });
    g += D.circ(x0 + 1 * cw - 12, y + 2, 4, { fill: C.green, id: 'dot1', hide: true });
    var hops = '';
    for (var k = 0; k < 7; k++) { var xa = x0 + (8 - k) * cw - 12, xb = x0 + (7 - k) * cw - 12; hops += D.path('M' + xa + ',' + (y + 12) + ' Q' + ((xa + xb) / 2) + ',' + (y + 40) + ' ' + xb + ',' + (y + 12), { c: C.gold, w: 2.2, arrow: 'ahg', id: 'h' + k, draw: true }); }
    g += hops;
    g += D.txt(320, 160, '7 hops left', { s: 18, c: '#8A6100', id: 'n', hide: true });
    g += D.txt(320, 215, '4.5 × 10⁷', { s: 34, mono: true, c: C.green, id: 'r', hide: true });
    g += D.txt(320, 262, 'front number 4.5 is between 1 and 10 ✓', { s: 15, c: C.gray, id: 'ok', hide: true });
    var f = [{ cap: 'Write <b>45,000,000</b> in scientific notation. The decimal point is at the end.', set: {} }];
    var st = { dot1: { o: 1 }, dot0: { o: .2 } }; for (var j = 0; j < 7; j++) st['h' + j] = { d: 1 };
    f.push({ cap: 'Move the decimal point until the front number is <b>between 1 and 10</b>: right after the 4.', set: st });
    f.push({ cap: 'Count the hops: <b>7</b>. A big number gets a <b>positive</b> exponent.', set: { n: { o: 1 } } });
    f.push({ cap: '<b>45,000,000 = 4.5 × 10⁷</b>', set: { r: { o: 1 }, ok: { o: 1 } } });
    f.push({ cap: 'For a small number like 0.00032, the point hops <b>right</b> 4 times: 3.2 × 10⁻⁴. Small number → <b>negative</b> exponent.', set: { r: { txt: '0.00032 = 3.2 × 10⁻⁴' } } });
    return { w: 640, h: 280, svg: g, title: 'Scientific notation', frames: f };
  }
  function sciOps() {
    var g = '';
    var L = [['(3 × 10⁴)(2 × 10⁵)', C.navy], ['= (3 × 2) × 10⁴⁺⁵', C.navy], ['= 6 × 10⁹', C.green]];
    L.forEach(function (l, i) { g += D.txt(320, 60 + i * 60, l[0], { s: 28, mono: true, c: l[1], id: 'l' + i, hide: i > 0 }); });
    g += D.txt(320, 245, 'front numbers: multiply · tens: add exponents', { s: 15, c: '#8A6100', id: 'tip', hide: true });
    return { w: 640, h: 270, svg: g, title: 'Multiply in scientific notation', frames: [
      { cap: 'Multiply <b>(3 × 10⁴)(2 × 10⁵)</b>.', set: {} },
      { cap: 'Group the front numbers together and the powers of 10 together.', set: { l1: { o: 1 } } },
      { cap: '3 × 2 = 6, and 10⁴ · 10⁵ = 10⁹ (add the exponents). Answer: <b>6 × 10⁹</b>.', set: { l2: { o: 1 } } },
      { cap: 'Dividing works the same way: divide the front numbers and <b>subtract</b> the exponents. Then make sure the front number is between 1 and 10.', set: { tip: { o: 1 } } }
    ] };
  }

  function rule(id, std, q, right, wrongs, hint, extra) { var o = { id: id, std: std, q: q, ch: [right].concat(wrongs), hint: hint }; for (var k in extra || {}) o[k] = extra[k]; return o; }

  SB.unit({
    n: 2, title: 'Exponents & Scientific Notation', std: 'NC.8.EE.1, 3–4', std0: E1,
    lessons: [
      { id: '2a', title: 'What an exponent means', std: E1, anim: meaning(),
        big: 'An <b>exponent</b> is a shortcut for multiplying the same number over and over. <span class="m">' + p(2, 5) + ' = 2 × 2 × 2 × 2 × 2 = 32</span>.',
        words: [['Base', 'the number being multiplied (in ' + p(2, 5) + ', the 2)'], ['Exponent', 'how many times the base is multiplied (the 5)'], ['Expanded form', 'written out the long way: 2 × 2 × 2 × 2 × 2']],
        more: '<b>Parentheses matter:</b> <span class="m">(−3)<sup>2</sup> = (−3)(−3) = 9</span>, but <span class="m">−3<sup>2</sup> = −(3 × 3) = −9</span>.',
        watch: p(2, 5) + ' is <b>not</b> 2 × 5. Write it out to check.',
        walk: { prob: 'Find (−2)³', steps: [
          { q: 'Write (−2)³ in expanded form.', ch: ['(−2)(−2)(−2)', ['(−2)(3)', 'The exponent is not multiplied by the base.', 'How many times is −2 written?'], ['−2 − 2 − 2', 'An exponent means multiply, not subtract.', 'Which operation does an exponent repeat?']], ln: '(−2)(−2)(−2)' },
          { q: 'Multiply the first two: (−2)(−2) = ?', ch: ['4', ['−4', 'A negative times a negative is positive.', 'Same signs → positive or negative?'], ['0', 'That is adding −2 + 2. We multiply.', 'What is 2 × 2?']], ln: '= 4 · (−2)' },
          { q: 'Now 4 · (−2) = ?', ch: ['−8', ['8', 'A positive times a negative is negative.', 'Different signs → positive or negative?'], ['2', 'That is adding 4 + (−2). We multiply.', 'What is 4 × 2? Then the sign?']], ln: '= −8' }] },
        checks: [
          { id: 'u2c1', std: E1, q: 'Find the value of <span class="m">' + p(3, 4) + '</span>.', ans: 81, hint: 'Write it out: 3 × 3 × 3 × 3.', miss: [[12, 'That is 3 × 4. The exponent says how many 3s to multiply.', 'How many 3s do you write?'], [64, 'That is 4 × 4 × 4 = 4³. The base is 3.', 'Which number is the base?'], [27, 'That is only three 3s.', 'How many 3s does the exponent 4 ask for?']] },
          rule('u2c2', E1, 'Which is the same as <span class="m">' + p(5, 3) + '</span>?', '5 × 5 × 5', [['5 × 3', 'The exponent is not a factor.', 'How many 5s does the exponent ask for?'], ['3 × 3 × 3 × 3 × 3', 'The base and exponent are switched. The base is 5.', 'Which number gets multiplied?'], ['5 + 5 + 5', 'An exponent repeats multiplication, not addition.', 'Which operation?']], 'The base (5) is written 3 times, with × between.'),
          { id: 'u2c3', std: E1, q: 'Find the value of <span class="m">(−4)<sup>2</sup></span>.', ans: 16, neg: 1, hint: '(−4)(−4). Same signs give a positive answer.', miss: [[-16, 'With parentheses, the negative is part of the base: (−4)(−4) = 16.', 'Negative × negative = ?'], [-8, 'That is −4 × 2. Write it out: (−4)(−4).', 'How many −4s are multiplied?'], [8, 'That is 4 × 2. Write it out: (−4)(−4).', 'How many −4s are multiplied?']] }
        ],
        can: 'write a power in expanded form and find its value, including negative bases.',
        recap: ['Write the base as many times as the exponent says', 'Multiply', 'Watch the parentheses with negatives'] },

      { id: '2b', title: 'Multiply and divide powers', std: E1, anim: product(),
        big: 'Same base: when you <b>multiply</b>, <b>add</b> the exponents. When you <b>divide</b>, <b>subtract</b> the exponents. <span class="m">x<sup>a</sup> · x<sup>b</sup> = x<sup>a+b</sup></span> and <span class="m">x<sup>a</sup> ÷ x<sup>b</sup> = x<sup>a−b</sup></span>.',
        words: [['Same base', 'the numbers or letters being raised to powers match: ' + p(2, 3) + ' and ' + p(2, 4)], ['Coefficient', 'the number in front: in 3' + p('x', 2) + ', the 3']],
        more: '<div class="m" style="line-height:2">' + p(2, 3) + ' × ' + p(2, 4) + ' = ' + p(2, '3+4') + ' = ' + p(2, 7) + '<br>' + p('x', 5) + ' ÷ ' + p('x', 2) + ' = ' + p('x', '5−2') + ' = ' + p('x', 3) + '<br>(3' + p('x', 2) + ')(2' + p('x', 4) + ') = 6' + p('x', 6) + ' <span style="font-family:Inter;font-weight:500;color:#5B6475">(multiply the numbers, add the exponents)</span></div>',
        watch: 'Do <b>not</b> multiply the bases. ' + p(2, 3) + ' × ' + p(2, 4) + ' is ' + p(2, 7) + ', not ' + p(4, 7) + '.',
        walk: { prob: 'Simplify (4x³)(2x⁵)', steps: [
          { q: 'First, the numbers in front. 4 × 2 = ?', ch: ['8', ['6', 'That is 4 + 2. The numbers in front are multiplied.', 'Do we add or multiply the coefficients?'], ['42', 'Multiply 4 by 2.', 'What is 4 × 2?']], ln: '4 × 2 = 8' },
          { q: 'Next, the x’s: x³ · x⁵. What do we do with the exponents?', ch: ['Add them: 3 + 5 = 8', ['Multiply them: 3 × 5 = 15', 'Multiplying exponents is for a power of a power, like (x³)⁵.', 'How many x’s are there in all?'], ['Subtract them: 5 − 3 = 2', 'Subtract when you divide.', 'Are we multiplying or dividing?']], ln: 'x³ · x⁵ = x⁸' },
          { q: 'Put it together.', ch: ['8x⁸', ['6x⁸', 'Multiply 4 × 2, do not add.', 'What is 4 × 2?'], ['8x¹⁵', 'Add the exponents: 3 + 5.', 'Multiply → add exponents. What is 3 + 5?']], ln: '(4x³)(2x⁵) = 8x⁸' }] },
        checks: [
          rule('u2c4', E1, 'Simplify: <span class="m">' + p(5, 2) + ' × ' + p(5, 5) + '</span>', p(5, 7), [[p(5, 10), 'You multiplied the exponents. When multiplying powers, add them.', 'How many 5s are there in all?'], [p(25, 7), 'Keep the base the same. Do not multiply 5 × 5.', 'What happens to the base?'], [p(5, 3), 'Subtract only when dividing.', 'Are we multiplying or dividing?']], 'Same base, multiplying → add the exponents.'),
          rule('u2c5', E1, 'Simplify: <span class="m">' + p('a', 7) + ' ÷ ' + p('a', 3) + '</span>', p('a', 4), [[p('a', 10), 'You added. When dividing, subtract the exponents.', 'Multiplying or dividing?'], [p('a', 21), 'Multiplying exponents is for a power of a power.', 'Dividing → add, subtract, or multiply?'], [p('a', '7/3'), 'Subtract the exponents. Do not divide them.', 'What is 7 − 3?']], 'Same base, dividing → subtract: 7 − 3.')
        ],
        can: 'multiply and divide powers with the same base.',
        recap: ['Multiply → add exponents', 'Divide → subtract exponents', 'Multiply or divide the numbers in front'] },

      { id: '2c', title: 'Power of a power, zero and negative exponents', std: E1, anim: pattern(),
        big: '<b>Power of a power:</b> multiply the exponents, ' + '<span class="m">(' + p('x', 3) + ')<sup>2</sup> = ' + p('x', 6) + '</span>. <b>Zero exponent:</b> any nonzero number to the 0 power is <b>1</b>. <b>Negative exponent:</b> flip it to a fraction, <span class="m">' + p(2, -3) + ' = 1/' + p(2, 3) + ' = 1/8</span>.',
        words: [['Reciprocal', 'the flip of a number: the reciprocal of 5 is 1/5'], ['Power of a power', 'a power raised to another power, like (' + p('x', 3) + ')<sup>2</sup>']],
        more: '<table class="tbl"><tr><th>Rule</th><th>Example</th></tr><tr><td>(x<sup>a</sup>)<sup>b</sup> = x<sup>a·b</sup></td><td>(' + p(3, 2) + ')<sup>3</sup> = ' + p(3, 6) + '</td></tr><tr><td>x<sup>0</sup> = 1</td><td>' + p(9, 0) + ' = 1</td></tr><tr><td>x<sup>−a</sup> = 1/x<sup>a</sup></td><td>' + p(10, -2) + ' = 1/100</td></tr></table>',
        watch: 'A negative exponent does <b>not</b> make the number negative. ' + p(2, -3) + ' = 1/8, not −8.',
        walk: { prob: 'Write 5⁻² as a fraction', steps: [
          { q: 'The exponent is negative. What does that tell us?', ch: ['Flip it: 5⁻² = 1/5²', ['Make it negative: 5⁻² = −5²', 'A negative exponent means a reciprocal, not a negative number.', 'Look at the pattern: 2⁻¹ = 1/2. Is that negative?'], ['Multiply: 5 × (−2)', 'An exponent is not multiplied by the base.', 'What does a negative exponent mean?']], ln: '5⁻² = 1/5²', lab: 'flip, make the exponent positive' },
          { q: 'What is 5²?', ch: ['25', ['10', 'That is 5 × 2.', 'What is 5 × 5?'], ['7', 'That is 5 + 2.', 'What is 5 × 5?']], ln: '= 1/25' }] },
        checks: [
          rule('u2c6', E1, 'Simplify: <span class="m">(' + p('x', 4) + ')<sup>2</sup></span>', p('x', 8), [[p('x', 6), 'You added. A power of a power multiplies the exponents.', 'How many x⁴ are multiplied together?'], [p('x', 16), 'That is 4 × 4. The exponents are 4 and 2.', 'What is 4 × 2?'], [p('x', 2), 'You subtracted. Multiply the exponents.', 'What is 4 × 2?']], 'Power of a power → multiply the exponents: 4 × 2.'),
          { id: 'u2c7', std: E1, q: 'Find the value of <span class="m">' + p(9, 0) + '</span>.', ans: 1, hint: 'Any nonzero number to the 0 power is 1.', miss: [[0, 'Look at the pattern: 2¹ = 2, 2⁰ = 1. Divide by the base each step.', 'What is 9¹ ÷ 9?'], [9, 'That is 9¹. The exponent is 0.', 'What is any nonzero number to the 0 power?']] },
          { id: 'u2c8', std: E1, q: 'Find the value of <span class="m">' + p(2, -3) + '</span>. (Type a fraction like 1/4.)', ans: 1 / 8, show: '1/8', neg: 1, hint: 'Flip it: 1/2³.', miss: [[-8, 'A negative exponent is not a negative number. It is a fraction.', 'What is the reciprocal of 2³?'], [-6, 'That is 2 × (−3). Flip it: 1/2³.', 'What does a negative exponent mean?'], [8, 'Right number, but flip it: 1/8.', 'Is 2⁻³ bigger or smaller than 1?']] }
        ],
        can: 'use the power-of-a-power, zero-exponent and negative-exponent rules.',
        recap: ['Power of a power → multiply exponents', 'Exponent 0 → 1', 'Negative exponent → 1 over the positive power'] },

      { id: '2d', title: 'Scientific notation', std: E3, anim: sciAnim(),
        big: 'Scientific notation writes a number as <span class="m">a × 10<sup>n</sup></span>, where <b>a is at least 1 and less than 10</b>. Big numbers get a <b>positive</b> exponent. Small numbers (less than 1) get a <b>negative</b> exponent.',
        words: [['Front number (a)', 'must be 1 or more, and less than 10: 4.5 ✓, 45 ✗, 0.45 ✗'], ['Power of 10', 'the exponent counts how many places the decimal point moves']],
        more: '<table class="tbl"><tr><th>Standard form</th><th>Hops</th><th>Scientific notation</th></tr><tr><td class="m">45,000,000</td><td>7 left</td><td class="m">' + sci(4.5, 7) + '</td></tr><tr><td class="m">0.00032</td><td>4 right</td><td class="m">' + sci(3.2, -4) + '</td></tr><tr><td class="m">6,020,000</td><td>6 left</td><td class="m">' + sci(6.02, 6) + '</td></tr></table>',
        watch: '<span class="m">45 × 10<sup>3</sup></span> is not finished: 45 is not less than 10. Fix it to ' + '<span class="m">' + sci(4.5, 4) + '</span>.',
        walk: { prob: 'Write 0.0061 in scientific notation', steps: [
          { q: 'Where should the decimal point go so the front number is between 1 and 10?', ch: ['After the 6: 6.1', ['After the 1: 61', '61 is more than 10.', 'Is 61 less than 10?'], ['Before the 6: 0.61', '0.61 is less than 1.', 'Is 0.61 at least 1?']], ln: '6.1' },
          { q: 'How many places did the point hop?', ch: ['3 places to the right', ['2 places to the right', 'Count every hop: 0.0061 → 0.061 → 0.61 → 6.1.', 'Count the hops one at a time.'], ['3 places to the left', 'Moving from 0.0061 to 6.1 goes right.', 'Did the number get bigger? Then which way?']], ln: '3 hops right' },
          { q: 'Positive or negative exponent?', ch: ['Negative: 6.1 × 10⁻³', ['Positive: 6.1 × 10³', '0.0061 is a small number (less than 1).', 'Is 0.0061 big or small?']], ln: '0.0061 = 6.1 × 10⁻³' }] },
        checks: [
          rule('u2c9', E3, 'Write <span class="m">32,000</span> in scientific notation.', sci(3.2, 4), [[sci(3.2, -4), '32,000 is a big number, so the exponent is positive.', 'Is 32,000 bigger or smaller than 1?'], [sci(32, 3), '32 is not less than 10. Move the point one more place.', 'Is the front number between 1 and 10?'], [sci(3.2, 3), 'Count the hops: 32,000 → 3.2 is 4 hops.', 'Count the hops one at a time.']], 'Put the point after the 3. Count the hops.'),
          { id: 'u2c10', std: E3, q: 'Write <span class="m">' + sci(5, 3) + '</span> in standard form.', ans: 5000, hint: 'Move the decimal point 3 places to the right.', miss: [[500, 'Count the hops: 5 → 50 → 500 → 5000.', 'How many places does 10³ move the point?'], [15, 'That is 5 × 3. The exponent counts places.', 'What is 10³?'], [0.005, 'A positive exponent makes a big number.', 'Bigger or smaller than 5?']] }
        ],
        can: 'write numbers in scientific notation and in standard form.',
        recap: ['Move the point so the front number is between 1 and 10', 'Count the hops', 'Big number → positive exponent; small → negative'] },

      { id: '2e', title: 'Multiply and divide in scientific notation', std: E4, anim: sciOps(),
        big: '<b>Multiply:</b> multiply the front numbers and <b>add</b> the exponents. <b>Divide:</b> divide the front numbers and <b>subtract</b> the exponents. Then check that the front number is between 1 and 10.',
        words: [['Adjust', 'if the front number is 10 or more, move the point and fix the exponent: 15 × 10⁷ = 1.5 × 10⁸']],
        more: '<div class="m" style="line-height:2">(8 × 10<sup>7</sup>) ÷ (4 × 10<sup>3</sup>) = (8 ÷ 4) × 10<sup>7−3</sup> = 2 × 10<sup>4</sup></div>',
        watch: 'After multiplying, check the front number. ' + sci(15, 7) + ' must be fixed to ' + sci(1.5, 8) + '.',
        walk: { prob: 'Multiply (5 × 10³)(3 × 10⁴)', steps: [
          { q: 'Multiply the front numbers.', ch: ['5 × 3 = 15', ['5 + 3 = 8', 'Front numbers are multiplied.', 'Multiply or add?'], ['5 × 3 = 1.5', '5 × 3 = 15. We fix the size at the end.', 'What is 5 × 3?']], ln: '15' },
          { q: 'Now the powers of 10: 10³ · 10⁴ = ?', ch: ['10⁷ (add 3 + 4)', ['10¹² (multiply 3 × 4)', 'Multiplying powers → add the exponents.', 'How many 10s in all?'], ['10¹ (subtract)', 'Subtract only when dividing.', 'Multiplying or dividing?']], ln: '15 × 10⁷' },
          { q: '15 is not less than 10. Fix it.', ch: ['1.5 × 10⁸', ['1.5 × 10⁷', 'Moving the point one place left adds 1 to the exponent.', '15 = 1.5 × 10. Where does that extra 10 go?'], ['15 × 10⁷ is done', 'The front number must be less than 10.', 'Is 15 less than 10?']], ln: '= 1.5 × 10⁸' }] },
        checks: [
          rule('u2c11', E4, 'Multiply: <span class="m">(2 × 10<sup>3</sup>)(4 × 10<sup>2</sup>)</span>', sci(8, 5), [[sci(8, 6), 'Add the exponents: 3 + 2 = 5, not 3 × 2.', 'Multiplying powers → add or multiply exponents?'], [sci(6, 5), 'Multiply the front numbers: 2 × 4.', 'What is 2 × 4?'], [sci(8, 1), 'Subtract only when dividing.', 'Multiplying or dividing?']], 'Front numbers: 2 × 4. Exponents: 3 + 2.'),
          rule('u2c12', E4, 'Divide: <span class="m">(9 × 10<sup>8</sup>) ÷ (3 × 10<sup>2</sup>)</span>', sci(3, 6), [[sci(3, 10), 'When dividing, subtract the exponents.', 'What is 8 − 2?'], [sci(3, 4), 'Subtract the exponents, do not divide them: 8 − 2 = 6.', 'What is 8 − 2?'], [sci(6, 6), 'Divide the front numbers: 9 ÷ 3.', 'What is 9 ÷ 3?']], 'Front numbers: 9 ÷ 3. Exponents: 8 − 2.')
        ],
        can: 'multiply and divide numbers in scientific notation.',
        recap: ['Multiply or divide the front numbers', 'Add (×) or subtract (÷) the exponents', 'Fix the front number to be between 1 and 10'] }
    ],
    practice: [
      rule('u2p1', E1, 'Simplify: <span class="m">' + p(4, 3) + ' × ' + p(4, 2) + '</span>', p(4, 5), [[p(4, 6), 'You multiplied the exponents. Multiplying powers → add.', 'How many 4s are there in all?'], [p(16, 5), 'Keep the base. Do not multiply 4 × 4.', 'What happens to the base?'], [p(4, 1), 'Subtract only when dividing.', 'Multiplying or dividing?']], 'Same base, multiplying → add the exponents.'),
      rule('u2p2', E1, 'Simplify: <span class="m">' + p('x', 7) + ' ÷ ' + p('x', 4) + '</span>', p('x', 3), [[p('x', 11), 'Dividing → subtract the exponents.', 'Multiplying or dividing?'], [p('x', 28), 'Multiply exponents only for a power of a power.', 'Dividing → add, subtract, or multiply?'], [p('x', '7/4'), 'Subtract the exponents. Do not divide them.', 'What is 7 − 4?']], 'Dividing → subtract: 7 − 4.'),
      rule('u2p3', E1, 'Simplify: <span class="m">(' + p(2, 3) + ')<sup>2</sup></span>', p(2, 6), [[p(2, 5), 'You added. A power of a power multiplies.', 'What is 3 × 2?'], [p(4, 3), 'The base stays 2.', 'What happens to the base?'], [p(2, 9), 'That is 3 × 3. The exponents are 3 and 2.', 'What is 3 × 2?']], 'Power of a power → multiply the exponents.'),
      { id: 'u2p4', std: E1, q: 'Find the value of <span class="m">' + p(5, 0) + '</span>.', ans: 1, hint: 'Any nonzero number to the 0 power is 1.', miss: [[0, 'Look at the pattern 5² = 25, 5¹ = 5, 5⁰ = 1: divide by 5 each step.', 'What is 5 ÷ 5?'], [5, 'That is 5¹.', 'What is any nonzero number to the 0 power?']] },
      { id: 'u2p5', std: E1, q: 'Find the value of <span class="m">' + p(3, -2) + '</span>. (Type a fraction like 1/4.)', ans: 1 / 9, show: '1/9', neg: 1, hint: 'Flip it: 1/3².', miss: [[-9, 'A negative exponent makes a fraction, not a negative number.', 'What is the reciprocal of 3²?'], [-6, 'That is 3 × (−2).', 'What does a negative exponent mean?'], [9, 'Right number, but flip it.', 'Is 3⁻² bigger or smaller than 1?'], [1 / 6, 'The bottom is 3², which is 9, not 6.', 'What is 3 × 3?']],
        steps: [{ q: 'Negative exponent: what do we do?', ch: ['Flip it: 1/3²', ['Make it negative: −3²', 'A negative exponent means a reciprocal.', 'Is 2⁻¹ = 1/2 negative?']], ln: '3⁻² = 1/3²' }, { q: '3² = ?', ch: ['9', ['6', 'That is 3 × 2.', 'What is 3 × 3?']], ln: '= 1/9' }], sol: ['3⁻² = 1/3²', '= 1/9'] },
      { id: 'u2p6', std: E1, q: 'Find the value of <span class="m">(−3)<sup>2</sup></span>.', ans: 9, neg: 1, hint: '(−3)(−3). Same signs → positive.', miss: [[-9, 'The parentheses make −3 the base: (−3)(−3) = 9.', 'Negative × negative = ?'], [-6, 'That is −3 × 2.', 'How many −3s are multiplied?'], [6, 'That is 3 × 2.', 'How many −3s are multiplied?']], sol: ['(−3)² = (−3)(−3)', '= 9'] },
      rule('u2p7', E3, 'Write <span class="m">0.00056</span> in scientific notation.', sci(5.6, -4), [[sci(5.6, 4), '0.00056 is a small number, so the exponent is negative.', 'Is 0.00056 bigger or smaller than 1?'], [sci(56, -5), '56 is not less than 10.', 'Is the front number between 1 and 10?'], [sci(5.6, -3), 'Count the hops: 0.00056 → 5.6 is 4 hops.', 'Count each hop.']], 'Put the point after the 5. Count the hops. Small number → negative exponent.',
        { steps: [{ q: 'Where does the point go?', ch: ['After the 5: 5.6', ['After the 6: 56', '56 is more than 10.', 'Is 56 less than 10?']], ln: '5.6' }, { q: 'How many hops?', ch: ['4 to the right', ['3 to the right', 'Count: 0.0056, 0.056, 0.56, 5.6.', 'Count each hop.']], ln: '4 hops right' }, { q: 'Sign of the exponent?', ch: ['Negative: small number', ['Positive', '0.00056 is less than 1.', 'Big or small number?']], ln: '5.6 × 10⁻⁴' }] }),
      { id: 'u2p8', std: E3, q: 'Write <span class="m">' + sci(7.2, 6) + '</span> in standard form.', ans: 7200000, hint: 'Move the decimal point 6 places to the right.', miss: [[720000, 'Count the hops: 6 places, not 5.', 'Count each hop.'], [72000000, 'That is 7 places. The exponent is 6.', 'Count each hop.'], [43.2, 'That is 7.2 × 6. The exponent counts places.', 'What is 10⁶?']], sol: ['7.2 × 10⁶: move the point 6 places right', '= 7,200,000'] },
      rule('u2p9', E4, 'Multiply: <span class="m">(5 × 10<sup>3</sup>)(3 × 10<sup>4</sup>)</span>', sci(1.5, 8), [[sci(15, 7), 'Good work, but 15 is not less than 10. Fix it.', 'What is 15 in scientific notation?'], [sci(1.5, 7), '15 → 1.5 moves the point, so the exponent goes up by 1.', '15 × 10⁷ = 1.5 × 10 × 10⁷. What is 10 × 10⁷?'], [sci(8, 7), 'Multiply the front numbers: 5 × 3.', 'What is 5 × 3?']], 'Multiply 5 × 3, add 3 + 4, then fix the front number.',
        { steps: [{ q: 'Front numbers?', ch: ['5 × 3 = 15', ['5 + 3 = 8', 'Multiply the front numbers.', 'Multiply or add?']], ln: '15' }, { q: 'Powers of 10?', ch: ['10³⁺⁴ = 10⁷', ['10³ˣ⁴ = 10¹²', 'Multiplying powers → add.', 'Add or multiply exponents?']], ln: '15 × 10⁷' }, { q: 'Fix the front number.', ch: ['1.5 × 10⁸', ['1.5 × 10⁷', 'Moving the point one place left adds 1 to the exponent.', 'What is 10 × 10⁷?']], ln: '1.5 × 10⁸' }] }),
      rule('u2p10', E4, 'Divide: <span class="m">(8 × 10<sup>7</sup>) ÷ (4 × 10<sup>3</sup>)</span>', sci(2, 4), [[sci(2, 10), 'Dividing → subtract the exponents.', 'What is 7 − 3?'], [sci(4, 4), 'Divide the front numbers: 8 ÷ 4.', 'What is 8 ÷ 4?'], [sci(32, 4), 'Divide the front numbers, do not multiply them.', 'What is 8 ÷ 4?']], 'Divide 8 ÷ 4. Subtract 7 − 3.'),
      rule('u2p11', E1, '<b>Find the mistake.</b> Lee wrote: <span class="m">' + p('x', 3) + ' · ' + p('x', 4) + ' = ' + p('x', 12) + '</span>. What went wrong?', 'Lee multiplied the exponents. Multiplying powers adds them: x⁷.', [['Lee is right.', 'Write it out: (x·x·x)(x·x·x·x) is 7 x’s.', 'How many x’s are there?'], ['It should be x¹ because 4 − 3 = 1.', 'Subtract only when dividing.', 'Multiplying or dividing?'], ['It should be 2x⁷.', 'The x’s do not make a 2. x³ · x⁴ = x⁷.', 'Is there a number in front?']], 'Write out the x’s and count them.', { wide: 1 })
    ]
  });
})();
