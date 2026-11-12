/* Skill Builders · Unit 3 · Equations & Inequalities (NC.8.EE.7) · Score 3 core skills */
(function () {
  var D = SB.D, A = SB.A, C = SB.C, M = D.minus;
  var STD = 'NC.8.EE.7';
  function n(v) { return M(String(v)); }

  /* ---- ax + b = c (two-step) ---- */
  function twoStep(id, a, b, c, o) {
    o = o || {};
    var x = (c - b) / a, sb = b < 0 ? '− ' + (-b) : '+ ' + b, op = b < 0 ? 'Add ' + (-b) : 'Subtract ' + b;
    var lhs = (a === 1 ? '' : a) + 'x ' + sb, rhs = c - b;
    if (x !== Math.round(x)) throw new Error('u3 twoStep not whole ' + id);
    var miss = [[(c + b) / a, 'You ' + (b < 0 ? 'subtracted ' + (-b) : 'added ' + b) + ' to both sides. That makes the ' + Math.abs(b) + ' bigger, not zero.', 'What number cancels ' + n(sb.replace(/ /g, '')) + '?'],
      [c - b, 'You undid the ' + n(sb.replace(/ /g, '')) + ' but stopped. The x is still multiplied by ' + a + '.', 'What is x multiplied by? What undoes that?'],
      [c / a - b, 'You divided first, but only divided part of the left side.', 'Undo the + or − first. Which number is not touching x?']];
    return {
      id: id, std: STD, q: o.q || ('Solve: <span class="m">' + M(lhs) + ' = ' + n(c) + '</span>'), ans: x,
      hint: 'Undo the ' + n(sb.replace(/ /g, '')) + ' first, on both sides. Then undo the × ' + a + '.',
      miss: miss.filter(function (m) { return m[0] !== x && isFinite(m[0]); }),
      steps: [
        { q: 'Which move comes first?', ch: [op + ' on both sides', ['Divide both sides by ' + a, 'You can, but it makes fractions. Undo the number that is not touching x first.', 'Is the ' + Math.abs(b) + ' attached to x, or added on?'], [(b < 0 ? 'Subtract ' + (-b) : 'Add ' + b) + ' on both sides', 'That makes the ' + Math.abs(b) + ' bigger. Use the opposite operation.', 'What is the opposite of ' + n(sb.replace(/ /g, '')) + '?']], eq: (a === 1 ? '' : a) + 'x = ' + rhs, lab: op + ' (both sides)' },
        { q: 'x is multiplied by ' + a + '. What undoes that?', ch: ['Divide both sides by ' + a, ['Subtract ' + a + ' from both sides', 'The ' + a + ' is multiplied, not added. Subtracting will not undo it.', 'What is the opposite of multiplying?'], ['Multiply both sides by ' + a, 'That makes x even bigger. Use the opposite.', 'Which operation undoes × ' + a + '?']], eq: 'x = ' + x, lab: 'Divide by ' + a }
      ].slice(0, a === 1 ? 1 : 2),
      sol: [{ eq: lhs + ' = ' + c }, { eq: (a === 1 ? '' : a) + 'x = ' + rhs, lab: op }].concat(a === 1 ? [] : [{ eq: 'x = ' + x, lab: 'Divide by ' + a }])
    };
  }

  /* ---- balance animation for 2x + 3 = 11 ---- */
  function balance() {
    var s = D.arrowDefs();
    s += D.poly([[320, 250], [300, 290], [340, 290]], { fill: C.navy });
    s += D.g(D.line(110, 200, 530, 200, { w: 5, c: C.navy }) + D.line(150, 200, 150, 215, { w: 2 }) + D.line(490, 200, 490, 215, { w: 2 }) +
      D.path('M70,215 h160 l-14,22 h-132 z', { fill: '#EEF1F7' }) + D.path('M410,215 h160 l-14,22 h-132 z', { fill: '#EEF1F7' }), {});
    s += D.line(320, 200, 320, 250, { w: 4 });
    function xb(x, y, id) { return D.g(D.rect(x, y, 38, 38, { fill: '#DBEAFE', c: C.blue, w: 2, r: 5 }) + D.txt(x + 19, y + 26, 'x', { it: true, c: C.blue, s: 20 }), { id: id }); }
    function u(x, y, id) { return D.circ(x, y, 9, { fill: C.gold2, c: C.gold, w: 1.5, id: id }); }
    s += xb(84, 172, 'x1') + xb(126, 172, 'x2');
    for (var i = 0; i < 3; i++) s += u(182 + i * 20, 188 + 0, 'l' + i);
    for (var j = 0; j < 11; j++) s += u(426 + (j % 6) * 22, 188 - Math.floor(j / 6) * 20, 'r' + j);
    s += D.txt(160, 40, '2x + 3', { s: 24, mono: true, id: 'eqL' }) + D.txt(320, 40, '=', { s: 24, mono: true }) + D.txt(480, 40, '11', { s: 24, mono: true, id: 'eqR' });
    s += D.line(105, 168, 175, 120, { c: C.blue, w: 2, dash: '5 4', id: 'g1', hide: true }) + D.line(126, 168, 175, 120, { c: C.blue, w: 2, dash: '5 4', id: 'g2', hide: true });
    s += D.rect(416, 154, 60, 50, { c: C.blue, w: 2, r: 8, id: 'grpA', hide: true, style: 'stroke-dasharray:6 4;' }) + D.rect(482, 154, 60, 50, { c: C.blue, w: 2, r: 8, id: 'grpB', hide: true, style: 'stroke-dasharray:6 4;' });
    s += D.txt(320, 80, '', { s: 18, c: C.green, id: 'res' });
    var gone = {}; [0, 1, 2].forEach(function (i) { gone['l' + i] = { o: 0, t: 'translate(0px,-40px)' }; });
    [8, 9, 10].forEach(function (j) { gone['r' + j] = { o: 0, t: 'translate(0px,-40px)' }; });
    var after = { eqL: { txt: '2x' }, eqR: { txt: '8' } }, l = {};
    [0, 1, 2, 3, 4, 5, 6, 7].forEach(function (j) {
      var ox = 426 + (j % 6) * 22, oy = 188 - Math.floor(j / 6) * 20, k = j % 4, gx = (j < 4 ? 431 : 497) + (k % 2) * 24, gy = 190 - Math.floor(k / 2) * 22;
      l['r' + j] = { t: 'translate(' + (gx - ox) + 'px,' + (gy - oy) + 'px)' };
    });
    return {
      w: 640, h: 300, svg: s, title: 'Keep the scale balanced',
      frames: [
        { cap: 'An equation is a balance. The left side, <b>2x + 3</b>, weighs the same as the right side, <b>11</b>.', set: {} },
        { cap: 'Goal: get <b>x</b> alone. First take away the <b>3</b> loose units.', set: { l0: { stroke: C.red }, l1: { stroke: C.red }, l2: { stroke: C.red } } },
        { cap: 'To stay balanced, take <b>3</b> away from <b>both sides</b>. Now <b>2x = 8</b>.', set: Object.assign({}, gone, after) },
        { cap: 'Two x-boxes balance 8 units. Split the 8 units into <b>2 equal groups</b> (divide by 2).', set: Object.assign({ grpA: { o: 1 }, grpB: { o: 1 } }, l) },
        { cap: 'One x-box balances one group of <b>4</b>. So <b>x = 4</b>.', set: { res: { txt: 'x = 4' }, eqL: { txt: 'x' }, eqR: { txt: '4' }, x2: { o: .25 }, grpB: { o: .25 } } },
        { cap: 'Check: 2(4) + 3 = 8 + 3 = <b>11</b>. ✓ Both sides match.', set: { res: { txt: 'Check: 2(4) + 3 = 11 ✓' } } }
      ]
    };
  }

  /* ---- distribute animation: arrows from the outside number to each inside term ---- */
  function distAnim() {
    var s = D.arrowDefs(), y = 120;
    s += D.txt(250, y, '3(x + 4)', { s: 30, mono: true });
    s += D.path('M197,95 C215,40 245,40 262,92', { c: C.teal, w: 3, arrow: 'ah', id: 'a1', draw: true });
    s += D.path('M197,95 C235,10 300,10 320,92', { c: C.purple, w: 3, arrow: 'ah', id: 'a2', draw: true });
    s += D.txt(250, 200, '3 · x', { s: 26, mono: true, c: C.teal, id: 'p1', hide: true, a: 'end' }) + D.txt(268, 200, '+', { s: 26, mono: true, id: 'pl', hide: true }) + D.txt(286, 200, '3 · 4', { s: 26, mono: true, c: C.purple, id: 'p2', hide: true, a: 'start' });
    s += D.txt(250, 250, '3x', { s: 30, mono: true, c: C.teal, id: 'q1', hide: true, a: 'end' }) + D.txt(268, 250, '+', { s: 30, mono: true, id: 'ql', hide: true }) + D.txt(286, 250, '12', { s: 30, mono: true, c: C.purple, id: 'q2', hide: true, a: 'start' });
    s += D.txt(520, 160, '3x + 4', { s: 22, mono: true, c: C.red, id: 'bad', hide: true }) + D.line(470, 152, 570, 152, { c: C.red, w: 3, id: 'badx', hide: true }) + D.txt(520, 190, 'missed the 4', { s: 14, c: C.red, id: 'badt', hide: true });
    return { w: 640, h: 280, svg: s, title: 'Multiply the outside number by EACH inside term', print: { bad: { o: 0 }, badx: { o: 0 }, badt: { o: 0 } }, frames: [
      { cap: 'The 3 outside the parentheses multiplies <b>everything</b> inside.', set: {} },
      { cap: 'First arrow: 3 times <b>x</b>.', set: { a1: { d: 1 }, p1: { o: 1 } } },
      { cap: 'Second arrow: 3 times <b>4</b>. Do not skip this one.', set: { a2: { d: 1 }, pl: { o: 1 }, p2: { o: 1 } } },
      { cap: 'So <b>3(x + 4) = 3x + 12</b>.', set: { q1: { o: 1 }, ql: { o: 1 }, q2: { o: 1 } } },
      { cap: 'A common mistake is <b>3x + 4</b>. It forgets to multiply the 4.', set: { bad: { o: 1 }, badx: { o: 1 }, badt: { o: 1 } } }
    ] };
  }

  /* ---- three endings animation ---- */
  function endings() {
    var s = '', cols = [[110, 'One solution', 'x = 3', C.green, 'x = a number'], [320, 'No solution', '4 = 9', C.red, 'false: never true'], [530, 'Infinitely many', '6 = 6', C.blue, 'true: always true']];
    cols.forEach(function (c, i) {
      s += D.g(D.rect(c[0] - 95, 30, 190, 210, { fill: '#fff', c: c[3], w: 2.5, r: 12 }) + D.txt(c[0], 62, c[1], { s: 17, c: c[3] }) +
        D.txt(c[0], 130, c[2], { s: 30, mono: true, c: C.navy }) + D.txt(c[0], 175, c[4], { s: 14, w: 500, c: C.gray }), { id: 'c' + i, hide: true });
    });
    s += D.txt(320, 280, 'Look at the LAST line after the x’s are gone.', { s: 15, c: C.navy, id: 'tip', hide: true });
    return { w: 640, h: 300, svg: s, title: 'How many solutions?', frames: [
      { cap: 'Solve as usual. Look at the last line.', set: {} },
      { cap: 'If you get <b>x = a number</b>, there is <b>one solution</b>.', set: { c0: { o: 1 } } },
      { cap: 'If the x’s cancel and you get something <b>false</b> like 4 = 9, there is <b>no solution</b>.', set: { c1: { o: 1 } } },
      { cap: 'If the x’s cancel and you get something <b>true</b> like 6 = 6, there are <b>infinitely many solutions</b>.', set: { c2: { o: 1 } } },
      { cap: 'The x’s cancel when both sides have the <b>same number of x’s</b>.', set: { tip: { o: 1 } } }
    ] };
  }

  /* ---- inequality: flip + graph animation ---- */
  function ineqAnim() {
    var nl = D.nl({ x0: 70, x1: 570, y: 210, lo: -6, hi: 3 }), X = nl.X;
    var s = D.arrowDefs() + nl.svg;
    s += D.txt(320, 44, '−2x < 6', { s: 26, mono: true, id: 'e1' });
    s += D.txt(320, 92, '', { s: 22, mono: true, c: C.gold, id: 'e2' });
    s += D.txt(320, 140, '', { s: 26, mono: true, id: 'e3' });
    s += D.circ(X(-3), 210, 9, { fill: '#fff', c: C.blue, w: 3, id: 'dot', hide: true });
    s += D.line(X(-3) + 11, 210, X(3) + 12, 210, { c: C.blue, w: 7, id: 'shade', draw: true, arrow: 'ahb' });
    s += D.txt(X(-3), 250, 'open circle: −3 is not included', { s: 13, c: C.blue, id: 'oc', hide: true });
    return { w: 640, h: 270, svg: s, title: 'Solve and graph an inequality', frames: [
      { cap: 'Solve <b>−2x < 6</b> like an equation, with one special rule.', set: {} },
      { cap: 'x is multiplied by <b>−2</b>. Divide both sides by −2.', set: { e2: { txt: '÷(−2)    ÷(−2)' } } },
      { cap: 'Dividing by a <b>negative</b> number? <b>Flip the sign.</b> < becomes >.', set: { e3: { txt: 'x > −3', fill: C.orange } } },
      { cap: 'Graph it. The sign is > (not ≥), so use an <b>open circle</b> at −3.', set: { dot: { o: 1 }, oc: { o: 1 } } },
      { cap: '"Greater than" means numbers to the <b>right</b>. Shade right.', set: { shade: { d: 1 } } },
      { cap: 'Test a number: x = 0. Is −2(0) < 6? 0 < 6 ✓. Zero is shaded, so the graph is right.', set: { e3: { fill: C.green } } }
    ] };
  }

  /* number line choice for inequalities */
  function nlFig(v, dir, closed, lo, hi) {
    var nl = D.nl({ x0: 26, x1: 254, y: 30, lo: lo, hi: hi, fs: 11, lab: function (v) { return hi - lo > 9 && v % 2 ? '' : M(String(v)); } }), X = nl.X;
    var s = nl.svg + (dir > 0 ? D.line(X(v) + 8, 30, X(hi) + 10, 30, { c: C.blue, w: 6 }) : D.line(X(v) - 8, 30, X(lo) - 10, 30, { c: C.blue, w: 6 })) +
      D.circ(X(v), 30, 7, { fill: closed ? C.blue : '#fff', c: C.blue, w: 3 });
    return D.svg(280, 62, s, 'number line');
  }

  var practice = [
    twoStep('u3p1', 1, -7, 10, { q: 'Solve: <span class="m">x − 7 = 10</span>' }),
    { id: 'u3p2', std: STD, q: 'Solve: <span class="m">3x = 18</span>', ans: 6, hint: 'x is multiplied by 3. Do the opposite to both sides.',
      miss: [[15, 'You subtracted 3. The 3 is multiplied, not added.', 'What is the opposite of multiplying by 3?'], [54, 'You multiplied by 3. That makes x bigger.', 'Which operation undoes × 3?']],
      steps: [{ q: 'x is multiplied by 3. What undoes that?', ch: ['Divide both sides by 3', ['Subtract 3 from both sides', 'The 3 is multiplied. Subtracting does not undo it.', 'What is the opposite of ×?'], ['Multiply both sides by 3', 'That makes x bigger.', 'Which operation is the opposite of ×?']], eq: 'x = 6', lab: 'Divide by 3' }],
      start: [{ eq: '3x = 18' }], sol: [{ eq: '3x = 18' }, { eq: 'x = 6', lab: 'Divide by 3' }] },
    twoStep('u3p3', 2, 5, 19),
    twoStep('u3p4', 4, -3, 25),
    { id: 'u3p5', std: STD, q: 'Solve: <span class="m">4(x + 1) = 24</span>', ans: 5, hint: 'Distribute the 4 to BOTH terms inside first: 4 · x and 4 · 1.',
      miss: [[5.75, 'You wrote 4x + 1. The 4 must multiply the 1 too.', 'What is 4 times 1?'], [23 / 4, 'You wrote 4x + 1. The 4 must multiply the 1 too.', 'What is 4 times 1?'], [7, 'You subtracted 1 first and then forgot the 4 also multiplies the 1.', 'Distribute first: what is 4(x + 1)?'], [20, 'You stopped at 4x = 20.', 'x is multiplied by 4. What undoes that?']],
      start: [{ eq: '4(x + 1) = 24' }],
      steps: [
        { q: 'There are parentheses. What do we do first?', ch: ['Distribute: 4 · x and 4 · 1', ['Write 4x + 1', 'The 4 must multiply the 1 too.', 'How many terms are inside the parentheses?'], ['Subtract 1 from both sides', 'The 1 is stuck inside the parentheses. It is multiplied by 4.', 'Which comes first in our plan: parentheses or + / −?']], eq: '4x + 4 = 24', lab: 'Distribute 4' },
        { q: 'Now undo the + 4.', ch: ['Subtract 4 from both sides', ['Add 4 to both sides', 'Adding makes 8 on the left. Use the opposite.', 'What cancels + 4?'], ['Divide both sides by 4 first', 'Possible, but undo the + 4 first. It is easier.', 'Which number is not touching x?']], eq: '4x = 20', lab: 'Subtract 4' },
        { q: 'Get x alone.', ch: ['Divide both sides by 4', ['Subtract 4 from both sides', 'The 4 is multiplied by x.', 'What undoes ×?'], ['Multiply by 4', 'That makes x bigger.', 'What is the opposite of ×?']], eq: 'x = 5', lab: 'Divide by 4' }],
      sol: [{ eq: '4(x + 1) = 24' }, { eq: '4x + 4 = 24', lab: 'Distribute 4' }, { eq: '4x = 20', lab: 'Subtract 4' }, { eq: 'x = 5', lab: 'Divide by 4' }] },
    { id: 'u3p6', std: STD, q: 'Solve: <span class="m">5x − 2 = 3x + 8</span>', ans: 5, hint: 'Get the x’s on one side first: subtract 3x from both sides.',
      miss: [[0.75, 'You added 3x instead of subtracting. Then the x’s do not cancel.', 'What cancels + 3x?'], [3, 'Check the number move: −2 needs + 2, not − 2.', 'What cancels − 2?'], [10, 'You stopped at 2x = 10.', 'What is x multiplied by?']],
      start: [{ eq: '5x - 2 = 3x + 8' }],
      steps: [
        { q: 'x is on both sides. What move puts the x’s together?', ch: ['Subtract 3x from both sides', ['Add 3x to both sides', 'Then the right side has 6x. The x’s do not cancel.', 'What cancels + 3x?'], ['Subtract 5x from the left only', 'A move must happen to both sides.', 'What keeps the scale balanced?']], eq: '2x - 2 = 8', lab: 'Subtract 3x' },
        { q: 'Now undo the − 2.', ch: ['Add 2 to both sides', ['Subtract 2 from both sides', 'That makes −4 on the left.', 'What is the opposite of − 2?'], ['Divide both sides by 2 first', 'Undo the − 2 first.', 'Which number is not touching x?']], eq: '2x = 10', lab: 'Add 2' },
        { q: 'Get x alone.', ch: ['Divide both sides by 2', ['Subtract 2', '2 is multiplied by x.', 'What undoes ×?'], ['Multiply both sides by 2', 'That makes x bigger.', 'What undoes ×?']], eq: 'x = 5', lab: 'Divide by 2' }],
      sol: [{ eq: '5x - 2 = 3x + 8' }, { eq: '2x - 2 = 8', lab: 'Subtract 3x' }, { eq: '2x = 10', lab: 'Add 2' }, { eq: 'x = 5', lab: 'Divide by 2' }] },
    { id: 'u3p7', std: STD, q: 'Solve: <span class="m">3(x − 2) + x = 10</span>', ans: 4, hint: 'Distribute the 3. Then combine the x-terms: 3x and x.',
      miss: [[4.5, 'You wrote 3x − 2. The 3 multiplies the 2 too: 3 · 2 = 6.', 'What is 3(x − 2)?'], [16 / 3, 'You did not combine 3x and x. Together they make 4x.', 'How many x’s are there in 3x + x?'], [16, 'You stopped at 4x = 16.', 'What is x multiplied by?'], [1, 'Check the − 6: undo it by adding 6.', 'What cancels − 6?']],
      start: [{ eq: '3(x - 2) + x = 10' }],
      steps: [
        { q: 'What comes first?', ch: ['Distribute the 3', ['Combine 3 and x', 'The 3 is outside parentheses. It is not a like term with x.', 'What does the 3 multiply?'], ['Add 2 to both sides', 'The 2 is inside the parentheses. Distribute first.', 'What is the first step in our plan?']], eq: '3x - 6 + x = 10', lab: 'Distribute 3' },
        { q: 'Combine the like terms on the left.', ch: ['3x + x = 4x', ['3x + x = 3x²', 'Adding x-terms does not square them. 3 x’s and 1 more x is 4 x’s.', 'How many x’s are there?'], ['3x + x = 3x', 'You lost the x by itself. It counts as 1x.', 'What number is in front of a lone x?']], eq: '4x - 6 = 10', lab: 'Combine like terms' },
        { q: 'Undo the − 6.', ch: ['Add 6 to both sides', ['Subtract 6 from both sides', 'That makes −12.', 'What is the opposite of − 6?'], ['Divide by 4 first', 'Undo the − 6 first.', 'Which number is not touching x?']], eq: '4x = 16', lab: 'Add 6' },
        { q: 'Get x alone.', ch: ['Divide both sides by 4', ['Subtract 4', '4 is multiplied by x.', 'What undoes ×?'], ['Multiply by 4', 'That makes x bigger.', 'What undoes ×?']], eq: 'x = 4', lab: 'Divide by 4' }],
      sol: [{ eq: '3(x - 2) + x = 10' }, { eq: '3x - 6 + x = 10', lab: 'Distribute 3' }, { eq: '4x - 6 = 10', lab: 'Combine like terms' }, { eq: '4x = 16', lab: 'Add 6' }, { eq: 'x = 4', lab: 'Divide by 4' }] },
    { id: 'u3p8', std: STD, q: 'How many solutions does <span class="m">2x + 6 = 2x + 1</span> have?', keep: 1,
      ch: ['No solution', ['One solution', 'When you subtract 2x, the x’s are gone. There is no "x = a number".', 'What is left after you subtract 2x from both sides?'], ['Infinitely many solutions', 'The last line is 6 = 1. That is false, not true.', 'Is 6 = 1 true or false?']],
      hint: 'Subtract 2x from both sides. Is what is left true or false?',
      steps: [{ q: 'Subtract 2x from both sides. What is left?', ch: ['6 = 1', ['x = 5', 'Both sides had 2x, so the x’s cancel. No x is left.', 'What is 2x − 2x?'], ['6 = 6', 'The right side is + 1, not + 6.', 'What number is on the right side?']], eq: '6 = 1', lab: 'Subtract 2x' },
        { q: 'Is 6 = 1 true or false?', ch: ['False, so there is no solution', ['True, so every number works', '6 and 1 are not equal.', 'Is 6 the same as 1?']], ln: '6 = 1 is false → no solution' }],
      start: [{ eq: '2x + 6 = 2x + 1' }], sol: [{ eq: '2x + 6 = 2x + 1' }, { eq: '6 = 1', lab: 'Subtract 2x' }, '6 = 1 is false → no solution'] },
    { id: 'u3p9', std: STD, q: 'Solve: <span class="m">−3x ≤ 12</span>', wide: 0,
      ch: ['x ≥ −4', ['x ≤ −4', 'You divided by −3 but did not flip the sign.', 'What happens to the sign when you divide by a negative?'], ['x ≥ 4', 'Check the sign of the number: 12 ÷ (−3) = −4.', 'Positive ÷ negative = ?'], ['x ≤ −36', 'You multiplied by −3 instead of dividing.', 'What undoes × (−3)?']],
      hint: 'Divide both sides by −3. Dividing by a negative flips the sign.',
      steps: [{ q: 'x is multiplied by −3. What do we do?', ch: ['Divide both sides by −3 and flip the sign', ['Divide both sides by −3 and keep the sign', 'Dividing by a negative number always flips the sign.', 'Is −3 positive or negative?'], ['Add 3 to both sides', 'The −3 is multiplied by x, not added.', 'What undoes ×?']], ln: 'x ≥ −4', lab: 'Divide by −3, flip ≤ to ≥' }],
      sol: ['−3x ≤ 12', { ln: 'x ≥ −4', lab: 'Divide by −3 and FLIP the sign' }] },
    { id: 'u3p10', std: STD, q: 'Which graph shows <span class="m">x + 4 > 9</span>?', wide: 1,
      ch: [nlFig(5, 1, false, 0, 12) + ' x > 5', [nlFig(5, 1, true, 0, 12) + ' x ≥ 5', 'The sign is >, not ≥. 5 is not included, so the circle is open.', 'Does > include the number itself?'], [nlFig(5, -1, false, 0, 12) + ' x < 5', 'Greater than means numbers to the right.', 'Which way are the bigger numbers?'], [nlFig(9, 1, false, 0, 12) + ' x > 9', 'You did not undo the + 4. 9 − 4 = 5.', 'What cancels + 4?']],
      hint: 'Solve first: subtract 4 from both sides. Then pick the circle (open or closed) and the direction.',
      steps: [{ q: 'Undo the + 4.', ch: ['Subtract 4 from both sides: x > 5', ['Add 4 to both sides: x > 13', 'Adding makes it bigger. Use the opposite.', 'What cancels + 4?']], ln: 'x > 5', lab: 'Subtract 4' },
        { q: 'Open or closed circle at 5?', ch: ['Open: > does not include 5', ['Closed: > includes 5', 'Only ≥ and ≤ include the number.', 'Is 5 > 5 true?']], ln: 'open circle at 5' },
        { q: 'Which way do we shade?', ch: ['Right: numbers greater than 5', ['Left: numbers less than 5', 'x > 5 means bigger numbers.', 'Where are bigger numbers on a number line?']], ln: 'shade to the right' }],
      sol: ['x + 4 > 9', { ln: 'x > 5', lab: 'Subtract 4' }, 'open circle at 5, shade right'] },
    { id: 'u3p11', std: STD, q: '<b>Find the mistake.</b> Jordan solved <span class="m">2(x + 3) = 14</span>:<div class="m" style="margin:8px 0 0;line-height:1.9">Line 1: 2x + 3 = 14<br>Line 2: 2x = 11<br>Line 3: x = 5.5</div>Where is the mistake?', wide: 1,
      ch: ['Line 1: the 2 was not multiplied by 3. It should be 2x + 6 = 14.', ['Line 2: 14 − 3 is not 11.', '14 − 3 = 11 is correct. Look at the line before it.', 'Was 2(x + 3) written correctly?'], ['Line 3: 11 ÷ 2 is not 5.5.', '11 ÷ 2 = 5.5 is correct. The mistake is earlier.', 'Check Line 1: what is 2 times 3?'], ['There is no mistake.', 'Check: 2(5.5 + 3) = 2(8.5) = 17, not 14.', 'Does x = 5.5 make the equation true?']],
      hint: 'Check each line. Start with the distributing in Line 1.',
      sol: [{ eq: '2(x + 3) = 14' }, { eq: '2x + 6 = 14', lab: 'Distribute 2 to BOTH terms' }, { eq: '2x = 8', lab: 'Subtract 6' }, { eq: 'x = 4', lab: 'Divide by 2' }], full: 1 },
    twoStep('u3p12', 2, 5, 17, { q: 'Five more than twice a number is 17. The equation is <span class="m">2x + 5 = 17</span>. What is the number?' })
  ];

  SB.unit({
    n: 3, title: 'Equations & Inequalities', std: 'NC.8.EE.7', std0: STD,
    lessons: [
      { id: '3a', title: 'One- and two-step equations', std: STD, anim: balance(),
        big: 'To <b>solve</b> an equation, get <b>x alone</b>. Undo each move with its <b>opposite</b>, and do it to <b>both sides</b> so the equation stays balanced.',
        words: [['Variable', 'a letter, like x, that stands for a number'], ['Inverse (opposite) operation', 'the move that undoes another: + and − undo each other, × and ÷ undo each other'], ['Solution', 'the number that makes the equation true']],
        more: '<table class="tbl"><tr><th>To undo…</th><td>+ 5</td><td>− 4</td><td>× 3 (3x)</td><td>÷ 2</td></tr><tr><th>do this</th><td>− 5</td><td>+ 4</td><td>÷ 3</td><td>× 2</td></tr></table><b>Order:</b> undo + or − first, then × or ÷.',
        watch: 'Do the same move to <b>both sides</b>. A move on one side only breaks the balance.',
        walk: { prob: 'Solve 3x − 4 = 11', start: [{ eq: '3x - 4 = 11' }], steps: [
          { q: 'Which move comes first?', ch: ['Add 4 to both sides', ['Divide both sides by 3', 'You can, but it makes fractions (4 ÷ 3). Undo the − 4 first.', 'Which number is not touching x?'], ['Subtract 4 from both sides', 'That makes −8. It does not cancel the − 4.', 'What is the opposite of − 4?'], ['Add 4 to the left side only', 'A move on one side only breaks the balance.', 'What must happen on both sides?']], eq: '3x = 15', lab: 'Add 4' },
          { q: 'x is multiplied by 3. What undoes that?', ch: ['Divide both sides by 3', ['Subtract 3 from both sides', 'The 3 is multiplied, not added.', 'What is the opposite of ×?'], ['Multiply both sides by 3', 'That makes x bigger.', 'Which operation undoes × 3?']], eq: 'x = 5', lab: 'Divide by 3' },
          { q: 'Check: put 5 in for x. What is 3(5) − 4?', ch: ['11, so x = 5 is right', ['15, so x = 5 is wrong', 'You forgot the − 4: 15 − 4 = 11.', 'What is 15 − 4?'], ['19', '3(5) is 15, and 15 − 4 is 11, not 19.', 'Did you add or subtract the 4?']], ln: '3(5) − 4 = 15 − 4 = 11 ✓', lab: 'Check' }] },
        checks: [
          twoStep('u3c1', 1, 7, 15, { q: 'Solve: <span class="m">x + 7 = 15</span>' }),
          { id: 'u3c2', std: STD, q: 'What is the <b>first</b> move to solve <span class="m">4x + 5 = 21</span>?', wide: 1,
            ch: ['Subtract 5 from both sides', ['Divide both sides by 4', 'Possible, but it makes 5 ÷ 4. Undo the + 5 first.', 'Which number is not touching x?'], ['Add 5 to both sides', 'Adding 5 makes 10. It does not cancel + 5.', 'What is the opposite of + 5?'], ['Subtract 4 from both sides', 'The 4 is multiplied by x. Subtracting 4 does not undo it.', 'Is the 4 added or multiplied?']], hint: 'Undo + or − first. What is added to 4x?' },
          twoStep('u3c3', 2, 3, 11)
        ],
        can: 'solve one- and two-step equations by undoing each move on both sides, then check the answer.',
        recap: ['Undo + or − (both sides)', 'Undo × or ÷ (both sides)', 'Check: put the answer back in'] },

      { id: '3b', title: 'Distribute and combine like terms', std: STD, anim: distAnim(),
        big: 'The number outside the parentheses <b>multiplies every term inside</b>. <b>Like terms</b> (x-terms with x-terms, numbers with numbers) can be added together.',
        words: [['Distribute', 'multiply the outside number by each term inside the ( )'], ['Like terms', 'terms with the same variable part: 3x and 5x, or 4 and 9'], ['Coefficient', 'the number in front of a variable (in 3x, the 3)']],
        more: '<div class="m" style="font-size:18px;line-height:2">4(x − 2) = 4x − 8<br>3x + 5 + 2x = 5x + 5</div>',
        watch: '3(x + 4) is <b>not</b> 3x + 4. The 3 multiplies the 4 too: 3x + 12.',
        walk: { prob: 'Solve 2(x + 5) = 16', start: [{ eq: '2(x + 5) = 16' }], steps: [
          { q: 'There are parentheses. What is the first move?', ch: ['Distribute: 2 · x + 2 · 5', ['Write 2x + 5', 'The 2 must multiply the 5 too.', 'How many terms are inside the ( )?'], ['Subtract 5 from both sides', 'The 5 is inside the parentheses, so it is multiplied by 2.', 'What happens to terms inside ( ) first?']], eq: '2x + 10 = 16', lab: 'Distribute 2' },
          { q: 'Undo the + 10.', ch: ['Subtract 10 from both sides', ['Subtract 5 from both sides', 'After distributing, the number is 10, not 5.', 'What number is added to 2x now?'], ['Add 10 to both sides', 'That makes 20. Use the opposite.', 'What cancels + 10?']], eq: '2x = 6', lab: 'Subtract 10' },
          { q: 'Get x alone.', ch: ['Divide both sides by 2', ['Subtract 2 from both sides', 'The 2 is multiplied by x.', 'What undoes ×?'], ['Multiply both sides by 2', 'That makes x bigger.', 'What is the opposite of ×?']], eq: 'x = 3', lab: 'Divide by 2' }] },
        checks: [
          { id: 'u3c4', std: STD, q: 'Which is equal to <span class="m">3(x + 4)</span>?', ch: ['3x + 12', ['3x + 4', 'The 3 must multiply the 4 too.', 'What is 3 times 4?'], ['x + 12', 'The 3 must multiply the x too.', 'What is 3 times x?'], ['3x + 7', 'You added 3 + 4. Distributing means multiply.', 'Is it 3 + 4 or 3 × 4?']], hint: 'Multiply 3 by x, then multiply 3 by 4.' },
          { id: 'u3c5', std: STD, q: 'Combine like terms: <span class="m">5x + 2 + 3x</span>', ch: ['8x + 2', ['10x', '2 is a number, not an x-term. It cannot join the x’s.', 'Is 2 a like term with 5x?'], ['8x²', 'Adding x-terms does not square them.', 'What is 5 x’s plus 3 x’s?'], ['15x + 2', 'You multiplied 5 × 3. Like terms are added.', 'Do we add or multiply like terms?']], hint: 'Add the x-terms together: 5x + 3x. The 2 stays by itself.' },
          { id: 'u3c6', std: STD, q: 'Solve: <span class="m">4(x − 2) = 20</span>', ans: 7, hint: 'Distribute first: 4x − 8 = 20.',
            miss: [[5.5, 'You wrote 4x − 2. The 4 must multiply the 2: 4 · 2 = 8.', 'What is 4 times 2?'], [3, 'Undo − 8 by adding 8, not subtracting.', 'What cancels − 8?'], [28, 'You stopped at 4x = 28.', 'What is x multiplied by?']],
            start: [{ eq: '4(x - 2) = 20' }],
            steps: [{ q: 'First move?', ch: ['Distribute: 4x − 8', ['Write 4x − 2', 'The 4 multiplies the 2 too.', 'What is 4 · 2?']], eq: '4x - 8 = 20', lab: 'Distribute 4' },
              { q: 'Undo the − 8.', ch: ['Add 8 to both sides', ['Subtract 8 from both sides', 'That makes −16.', 'What is the opposite of − 8?']], eq: '4x = 28', lab: 'Add 8' },
              { q: 'Get x alone.', ch: ['Divide both sides by 4', ['Subtract 4', 'The 4 is multiplied.', 'What undoes ×?']], eq: 'x = 7', lab: 'Divide by 4' }],
            sol: [{ eq: '4(x - 2) = 20' }, { eq: '4x - 8 = 20', lab: 'Distribute 4' }, { eq: '4x = 28', lab: 'Add 8' }, { eq: 'x = 7', lab: 'Divide by 4' }] }
        ],
        can: 'distribute a number to every term in parentheses and combine like terms before solving.',
        recap: ['Distribute (multiply EVERY term inside)', 'Combine like terms on each side', 'Undo + or −, then × or ÷'] },

      { id: '3c', title: 'Variables on both sides', std: STD,
        anim: A.eq([
          { L: '5x + 2', R: '3x + 10', cap: 'x is on <b>both sides</b>. First, get the x-terms together.' },
          { L: '2x + 2', R: '10', lab: 'Subtract 3x', mv: { L: ['5x', '−3x'], R: ['3x', '−3x'] }, cancel: { R: ['3x'] }, mcap: 'Subtract <b>3x</b> from both sides. Each move sits under its like term.', cap: 'Now x is on one side: <b>2x + 2 = 10</b>.' },
          { L: '2x', R: '8', lab: 'Subtract 2', mv: { L: ['+ 2', '−2'], R: ['10', '−2'] }, cancel: { L: ['+ 2'] }, mcap: 'Undo the <b>+ 2</b>: subtract 2 from both sides.', cap: '<b>2x = 8</b>' },
          { L: 'x', R: '4', lab: 'Divide by 2', div: 2, cap: 'Divide both sides by 2. <b>x = 4</b>.', mcap: 'x is multiplied by 2. Divide <b>both sides</b> by 2.' }
        ], { title: 'Get the x’s on one side', box: 'Check: 5(4) + 2 = 22 and 3(4) + 10 = 22 ✓', h: 300 }),
        pfig: function () { return SB.workHtml([{ eq: '5x + 2 = 3x + 10' }, { eq: '2x + 2 = 10', lab: 'Subtract 3x' }, { eq: '2x = 8', lab: 'Subtract 2' }, { eq: 'x = 4', lab: 'Divide by 2' }]); },
        big: 'When x is on <b>both sides</b>, move the x-terms to one side first (subtract the smaller x-term from both sides). Then solve the two-step equation that is left.',
        words: [['Like terms', '5x and 3x are like terms, so 5x − 3x = 2x'], ['Both sides', 'the left of the = sign and the right of the = sign']],
        more: '<b>The 5-step plan:</b><ol style="margin:4px 0 0"><li>Distribute (if there are parentheses).</li><li>Combine like terms on each side.</li><li>Move the x-terms to one side.</li><li>Move the numbers to the other side.</li><li>Divide to get x alone.</li></ol>',
        watch: 'Subtract the x-term from <b>both</b> sides, not just the side it is on.',
        walk: { prob: 'Solve 7x + 3 = 4x + 15', start: [{ eq: '7x + 3 = 4x + 15' }], steps: [
          { q: 'x is on both sides. What move puts the x’s together?', ch: ['Subtract 4x from both sides', ['Add 4x to both sides', 'That makes 8x on the right. The x’s do not cancel.', 'What cancels + 4x?'], ['Subtract 3 from both sides', 'That is a good move later. Gather the x’s first.', 'Which step of our plan comes first: x’s or numbers?'], ['Subtract 7x from the left only', 'A move must happen to both sides.', 'What keeps the equation balanced?']], eq: '3x + 3 = 15', lab: 'Subtract 4x' },
          { q: 'Undo the + 3.', ch: ['Subtract 3 from both sides', ['Add 3 to both sides', 'That makes + 6.', 'What cancels + 3?'], ['Divide both sides by 3', 'Undo the + 3 first.', 'Which number is not touching x?']], eq: '3x = 12', lab: 'Subtract 3' },
          { q: 'Get x alone.', ch: ['Divide both sides by 3', ['Subtract 3', 'The 3 is multiplied.', 'What undoes ×?'], ['Multiply by 3', 'That makes x bigger.', 'What undoes ×?']], eq: 'x = 4', lab: 'Divide by 3' }] },
        checks: [
          { id: 'u3c7', std: STD, q: 'What is a good <b>first</b> move for <span class="m">6x − 1 = 2x + 11</span>?', wide: 1, ch: ['Subtract 2x from both sides', ['Add 2x to both sides', 'Then the right side has 4x. The x’s do not cancel.', 'What cancels + 2x?'], ['Divide both sides by 6', 'The right side has x’s too. Gather the x’s first.', 'How many sides have an x-term?'], ['Subtract 6x from the right side only', 'A move must happen to both sides.', 'What keeps the balance?']], hint: 'Gather the x-terms. Subtract the smaller x-term from both sides.' },
          { id: 'u3c8', std: STD, q: 'Solve: <span class="m">6x − 1 = 2x + 11</span>', ans: 3, hint: 'Subtract 2x from both sides. Then add 1. Then divide.',
            miss: [[2.5, 'Check the number move: undo − 1 by adding 1.', 'What cancels − 1?'], [12, 'You stopped at 4x = 12.', 'What is x multiplied by?'], [1.5, 'You added 2x instead of subtracting.', 'What cancels + 2x?']],
            start: [{ eq: '6x - 1 = 2x + 11' }],
            steps: [{ q: 'Gather the x’s.', ch: ['Subtract 2x from both sides', ['Add 2x to both sides', 'That does not cancel.', 'What cancels + 2x?']], eq: '4x - 1 = 11', lab: 'Subtract 2x' },
              { q: 'Undo the − 1.', ch: ['Add 1 to both sides', ['Subtract 1 from both sides', 'That makes −2.', 'What is the opposite of − 1?']], eq: '4x = 12', lab: 'Add 1' },
              { q: 'Get x alone.', ch: ['Divide both sides by 4', ['Subtract 4', 'The 4 is multiplied.', 'What undoes ×?']], eq: 'x = 3', lab: 'Divide by 4' }],
            sol: [{ eq: '6x - 1 = 2x + 11' }, { eq: '4x - 1 = 11', lab: 'Subtract 2x' }, { eq: '4x = 12', lab: 'Add 1' }, { eq: 'x = 3', lab: 'Divide by 4' }] }
        ],
        can: 'solve an equation with x on both sides by gathering the x-terms first.',
        recap: ['Gather x-terms (subtract the smaller one, both sides)', 'Move the numbers (both sides)', 'Divide to get x alone'] },

      { id: '3d', title: 'One, none, or infinitely many solutions', std: 'NC.8.EE.7a', anim: endings(),
        big: 'Solve as usual. If the x’s cancel, look at what is left. <b>False</b> (like 4 = 9) means <b>no solution</b>. <b>True</b> (like 6 = 6) means <b>infinitely many solutions</b>. If you get x = a number, there is <b>one solution</b>.',
        words: [['No solution', 'no number makes the equation true'], ['Infinitely many solutions', 'every number makes the equation true'], ['One solution', 'exactly one number works, like x = 3']],
        more: '<div class="m" style="line-height:2">2x + 4 = 2x + 9 → 4 = 9 (false) → no solution<br>3(x + 2) = 3x + 6 → 6 = 6 (true) → infinitely many</div>',
        watch: 'If the x’s cancel, you are not stuck. The last line tells you the answer.',
        walk: { prob: 'How many solutions? 3(x + 2) = 3x + 6', start: [{ eq: '3(x + 2) = 3x + 6' }], steps: [
          { q: 'First move?', ch: ['Distribute the 3', ['Subtract 2 from both sides', 'The 2 is inside the parentheses. Distribute first.', 'What does the 3 multiply?'], ['Divide both sides by 3x', 'We do not divide by an x-term. Distribute first.', 'What is the first step of the plan?']], eq: '3x + 6 = 3x + 6', lab: 'Distribute 3' },
          { q: 'Subtract 3x from both sides. What is left?', ch: ['6 = 6', ['x = 6', 'Both sides had 3x, so the x’s cancel.', 'What is 3x − 3x?'], ['0 = 6', 'The left side still has + 6.', 'What is left on the left side?']], eq: '6 = 6', lab: 'Subtract 3x' },
          { q: '6 = 6 is true. How many solutions?', ch: ['Infinitely many solutions', ['No solution', 'No solution comes from a FALSE line, like 6 = 7.', 'Is 6 = 6 true or false?'], ['One solution: x = 6', 'There is no x left in 6 = 6.', 'Did we get x = a number?']], ln: '6 = 6 is true → infinitely many' }] },
        checks: [
          { id: 'u3c9', std: 'NC.8.EE.7a', q: 'How many solutions does <span class="m">2x + 4 = 2x + 9</span> have?', keep: 1, ch: ['No solution', ['One solution', 'The x’s cancel. There is no x = a number.', 'What is left after subtracting 2x?'], ['Infinitely many solutions', 'The last line is 4 = 9. That is false.', 'Is 4 = 9 true?']], hint: 'Subtract 2x from both sides. Is the line that is left true or false?' },
          { id: 'u3c10', std: 'NC.8.EE.7a', q: 'A last line says <span class="m">5 = 5</span>. How many solutions?', keep: 1, ch: ['Infinitely many solutions', ['One solution', 'There is no x left, so it is not one number.', 'Is there an x in 5 = 5?'], ['No solution', 'No solution comes from a false line. 5 = 5 is true.', 'Is 5 = 5 true or false?']], hint: 'True line → every number works.' },
          { id: 'u3c11', std: 'NC.8.EE.7a', q: 'How many solutions does <span class="m">4x + 1 = 2x + 7</span> have?', keep: 1, ch: ['One solution', ['No solution', 'The x’s do not cancel: 4x and 2x are different.', 'What is 4x − 2x?'], ['Infinitely many solutions', 'The x’s do not cancel, so we get x = a number.', 'Do both sides have the same number of x’s?']], hint: 'Do both sides have the same number of x’s? If not, there is one solution.', sol: [{ eq: '4x + 1 = 2x + 7' }, { eq: '2x + 1 = 7', lab: 'Subtract 2x' }, { eq: '2x = 6', lab: 'Subtract 1' }, { eq: 'x = 3', lab: 'Divide by 2' }] }
        ],
        can: 'tell whether an equation has one solution, no solution, or infinitely many solutions.',
        recap: ['x = a number → one solution', 'False line (4 = 9) → no solution', 'True line (6 = 6) → infinitely many'] },

      { id: '3e', title: 'Inequalities: solve and graph', std: STD, anim: ineqAnim(),
        big: 'Solve an inequality like an equation, with <b>one special rule</b>: when you <b>multiply or divide by a negative number, flip the sign</b>. Then graph it on a number line.',
        words: [['< and >', 'less than, greater than: open circle (the number is not included)'], ['≤ and ≥', 'at most, at least: closed circle (the number is included)'], ['Flip', 'turn the sign around: < becomes >, ≤ becomes ≥']],
        more: '<div class="fig">' + nlFig(2, 1, false, -2, 6) + '</div><p style="text-align:center;margin:0">x > 2: open circle at 2, shade right</p>',
        watch: 'Only flip when you <b>multiply or divide by a negative</b>. Adding or subtracting never flips.',
        walk: { prob: 'Solve 2x + 1 ≥ 7 and graph it', steps: [
          { q: 'Undo the + 1.', ch: ['Subtract 1 from both sides: 2x ≥ 6', ['Add 1 to both sides: 2x ≥ 8', 'That makes it bigger. Use the opposite.', 'What cancels + 1?'], ['Flip the sign: 2x + 1 ≤ 7', 'We only flip when we multiply or divide by a negative.', 'Did we divide by a negative?']], ln: '2x ≥ 6', lab: 'Subtract 1' },
          { q: 'Undo the × 2. Do we flip?', ch: ['Divide by 2. No flip: x ≥ 3', ['Divide by 2 and flip: x ≤ 3', '2 is positive. Only a negative flips the sign.', 'Is 2 positive or negative?'], ['Subtract 2: x ≥ 4', '2 is multiplied by x.', 'What undoes ×?']], ln: 'x ≥ 3', lab: 'Divide by 2' },
          { q: 'Open or closed circle at 3?', ch: ['Closed: ≥ includes 3', ['Open: ≥ does not include 3', 'The line under ≥ means "or equal to", so 3 is included.', 'Is 3 ≥ 3 true?']], ln: 'closed circle at 3' },
          { q: 'Which way do we shade?', ch: ['Right: numbers greater than 3', ['Left: numbers less than 3', 'x ≥ 3 means 3 and bigger.', 'Where are the bigger numbers?']], ln: 'shade to the right' }],
          done: '✓ Graph: a closed circle at 3, shaded to the right.' },
        checks: [
          { id: 'u3c12', std: STD, q: 'Solve: <span class="m">x + 4 > 9</span>', ch: ['x > 5', ['x > 13', 'You added 4. Use the opposite: subtract 4.', 'What cancels + 4?'], ['x < 5', 'Subtracting does not flip the sign.', 'Did we divide by a negative?'], ['x ≥ 5', 'The sign stays >. It does not turn into ≥.', 'Did the problem have the "or equal" line?']], hint: 'Subtract 4 from both sides. No flip.' },
          { id: 'u3c13', std: STD, q: 'Solve: <span class="m">−2x < 8</span>', ch: ['x > −4', ['x < −4', 'You divided by −2 but did not flip the sign.', 'What happens when you divide by a negative?'], ['x > 4', 'Check the sign of the number: 8 ÷ (−2) = −4.', 'Positive ÷ negative = ?'], ['x < −16', 'You multiplied instead of dividing.', 'What undoes × (−2)?']], hint: 'Divide both sides by −2. A negative divisor flips the sign.' },
          { id: 'u3c14', std: STD, q: 'Which graph shows <span class="m">x ≤ 1</span>?', wide: 1, ch: [nlFig(1, -1, true, -3, 5), [nlFig(1, -1, false, -3, 5), '≤ includes 1, so the circle is closed (filled).', 'Is 1 ≤ 1 true?'], [nlFig(1, 1, true, -3, 5), '≤ means 1 and smaller: shade left.', 'Which way are smaller numbers?']], hint: 'Closed circle for ≤. Less than means shade left.' }
        ],
        can: 'solve an inequality, flip the sign only for a negative × or ÷, and graph it.',
        recap: ['Solve like an equation', 'Flip the sign when you × or ÷ by a negative', 'Open circle for < >, closed for ≤ ≥', 'Shade toward the numbers that work'] }
    ],
    practice: practice
  });
})();
