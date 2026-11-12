/* Skill Builders · Unit 5 · Pythagorean Theorem (NC.8.G.6, NC.8.G.7, NC.8.G.8) · Score 3 core skills */
(function () {
  var D = SB.D, C = SB.C, G6 = 'NC.8.G.6', G7 = 'NC.8.G.7', G8 = 'NC.8.G.8';
  /* right triangle drawn to scale: vertical leg a, horizontal leg b; labels {a, b, c} */
  function rt(a, b, lab, o) {
    o = o || {}; var W = o.w || 320, H = o.h || 210, maxW = W - 120, maxH = H - 60, k = Math.min(maxW / b, maxH / a);
    var x0 = 60, y0 = H - 30, x1 = x0 + b * k, y1 = y0 - a * k;
    var s = D.poly([[x0, y0], [x1, y0], [x0, y1]], { w: 2.4, fill: '#F7F9FE' }) + D.rightMark(x0, y0, 0, 14);
    s += D.line(x0, y1, x1, y0, { c: C.gold, w: 4 });
    s += D.txt(x0 - 10, (y0 + y1) / 2 + 5, lab.a, { a: 'end', s: 16, mono: true, c: C.blue });
    s += D.txt((x0 + x1) / 2, y0 + 22, lab.b, { s: 16, mono: true, c: C.blue });
    s += D.txt((x0 + x1) / 2 + 14, (y0 + y1) / 2 - 6, lab.c, { a: 'start', s: 16, mono: true, c: '#8A6100' });
    return D.svg(W, H, s, 'right triangle');
  }
  function squaresAnim() {
    var u = 26, x0 = 230, y0 = 200, s = '';   // legs 3 (vertical) and 4 (horizontal), hypotenuse 5
    var A = [x0, y0], B = [x0 + 4 * u, y0], Cc = [x0, y0 - 3 * u];
    var sq = function (pts, fill, c, id, n, lab) {
      return D.g(D.poly(pts, { fill: fill, c: c, w: 2 }) + lab, { id: id, hide: true });
    };
    var bl = '', gl = '', hl = '';
    for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) gl += D.rect(x0 + i * u, y0 + j * u, u, u, { c: C.blue, w: .8 });
    for (var i2 = 0; i2 < 3; i2++) for (var j2 = 0; j2 < 3; j2++) bl += D.rect(x0 - (i2 + 1) * u, y0 - (j2 + 1) * u, u, u, { c: C.purple, w: .8 });
    s += sq([[x0, y0], [x0 + 4 * u, y0], [x0 + 4 * u, y0 + 4 * u], [x0, y0 + 4 * u]], '#DBEAFE', C.blue, 'sb', 16, gl + D.txt(x0 + 2 * u, y0 + 2 * u + 8, '16', { s: 22, mono: true, c: C.blue }));
    s += sq([[x0, y0], [x0, y0 - 3 * u], [x0 - 3 * u, y0 - 3 * u], [x0 - 3 * u, y0]], '#EDE9FE', C.purple, 'sa', 9, bl + D.txt(x0 - 1.5 * u, y0 - 1.5 * u + 8, '9', { s: 22, mono: true, c: C.purple }));
    // hypotenuse square: outward normal from B->C
    var dx = Cc[0] - B[0], dy = Cc[1] - B[1], nx = dy, ny = -dx; // rotate (dx,dy) by -90
    var P3 = [Cc[0] - nx, Cc[1] - ny], P4 = [B[0] - nx, B[1] - ny];
    nx = -dy; ny = dx; P3 = [Cc[0] + nx, Cc[1] + ny]; P4 = [B[0] + nx, B[1] + ny];
    if (P3[1] > Cc[1]) { P3 = [Cc[0] - nx, Cc[1] - ny]; P4 = [B[0] - nx, B[1] - ny]; }
    var cxh = (B[0] + Cc[0] + P3[0] + P4[0]) / 4, cyh = (B[1] + Cc[1] + P3[1] + P4[1]) / 4;
    s += sq([B, Cc, P3, P4], '#FFF6DB', C.gold, 'sc', 25, D.txt(cxh, cyh + 8, '25', { s: 24, mono: true, c: '#8A6100' }));
    s += D.poly([A, B, Cc], { w: 3, fill: '#fff' }) + D.rightMark(A[0], A[1], 0, 12);
    s += D.txt(x0 - 10, y0 - 1.5 * u + 30, '', { s: 1 });
    s += D.txt(x0 + 2 * u, y0 - 8, '4', { s: 16, mono: true }) + D.txt(x0 + 8, y0 - 1.5 * u + 6, '3', { s: 16, mono: true, a: 'start' }) + D.txt(x0 + 2 * u + 10, y0 - 1.5 * u - 8, '5', { s: 16, mono: true, c: '#8A6100', a: 'start' });
    s += D.txt(560, 120, '9 + 16 = 25', { s: 22, mono: true, c: C.green, id: 'eq', hide: true }) + D.txt(560, 160, 'a² + b² = c²', { s: 22, mono: true, c: C.navy, id: 'f', hide: true });
    return { w: 640, h: 320, svg: s, title: 'The squares on the sides', frames: [
      { cap: 'A <b>right triangle</b> has legs 3 and 4 and a longest side of 5. The longest side, across from the square corner, is the <b>hypotenuse</b>.', set: {} },
      { cap: 'Build a square on the leg of 3: <b>3 × 3 = 9</b> tiles.', set: { sa: { o: 1 } } },
      { cap: 'Build a square on the leg of 4: <b>4 × 4 = 16</b> tiles.', set: { sb: { o: 1 } } },
      { cap: 'The square on the hypotenuse is <b>5 × 5 = 25</b>.', set: { sc: { o: 1 } } },
      { cap: 'The two small squares fill the big one: <b>9 + 16 = 25</b>. That is the Pythagorean Theorem: <b>a² + b² = c²</b>.', set: { eq: { o: 1 }, f: { o: 1 } } }
    ] };
  }
  function hypAnim(a, b, c, legMode) {
    var s = rt(a, b, legMode ? { a: '?', b: String(b), c: String(c) } : { a: String(a), b: String(b), c: '?' }, { w: 300, h: 230 }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    var lines = legMode ? ['a² + ' + b + '² = ' + c + '²', 'a² + ' + (b * b) + ' = ' + (c * c), 'a² = ' + (c * c) + ' − ' + (b * b) + ' = ' + (a * a), 'a = √' + (a * a) + ' = ' + a]
      : [a + '² + ' + b + '² = c²', (a * a) + ' + ' + (b * b) + ' = c²', (a * a + b * b) + ' = c²', 'c = √' + (c * c) + ' = ' + c];
    lines.forEach(function (l, i) { s += D.txt(330, 50 + i * 48, l, { s: 22, mono: true, a: 'start', id: 'l' + i, hide: true, c: i === 3 ? C.green : C.navy }); });
    var caps = legMode ? ['Write a² + b² = c². The 13 is the hypotenuse (c), so it stays alone.', 'Square the numbers you know.', 'The missing side is a leg, so <b>subtract</b>: 169 − 25 = 144.', 'Take the square root: <b>a = 12</b>.']
      : ['Write a² + b² = c² with the legs in place.', 'Square each leg.', 'The missing side is the hypotenuse, so <b>add</b>: 36 + 64 = 100.', 'Take the square root: <b>c = 10</b>.'];
    return { w: 640, h: 240, svg: s, title: legMode ? 'Find a missing leg' : 'Find the hypotenuse', frames: [{ cap: legMode ? 'The hypotenuse is 13 and one leg is 5. Find the other leg.' : 'The legs are 6 and 8. Find the hypotenuse.', set: {} }].concat(caps.map(function (c, i) { var o = {}; o['l' + i] = { o: 1 }; return { cap: c, set: o }; })) };
  }
  function converseAnim() {
    var s = '', rows = [['6, 8, 10', '36 + 64 = 100', '100 = 100 ✓', 'right triangle', C.green], ['4, 5, 6', '16 + 25 = 41', '41 ≠ 36 ✗', 'not a right triangle', C.red]];
    rows.forEach(function (r, i) {
      var y = 70 + i * 120;
      s += D.txt(40, y, 'Sides ' + r[0], { s: 20, a: 'start', mono: true, id: 'a' + i, hide: i > 0 });
      s += D.txt(260, y, r[1], { s: 20, a: 'start', mono: true, id: 'b' + i, hide: true });
      s += D.txt(260, y + 36, r[2], { s: 20, a: 'start', mono: true, c: r[4], id: 'c' + i, hide: true });
      s += D.txt(520, y + 18, r[3], { s: 16, c: r[4], id: 'd' + i, hide: true });
    });
    return { w: 640, h: 290, svg: s, title: 'Is it a right triangle?', frames: [
      { cap: 'Test sides 6, 8 and 10. The longest side, <b>10</b>, would be the hypotenuse.', set: {} },
      { cap: 'Square and add the two shorter sides: 36 + 64 = 100.', set: { b0: { o: 1 } } },
      { cap: 'Square the longest side: 10² = 100. They match, so it <b>is</b> a right triangle.', set: { c0: { o: 1 }, d0: { o: 1 } } },
      { cap: 'Now test 4, 5 and 6: 16 + 25 = 41.', set: { a1: { o: 1 }, b1: { o: 1 } } },
      { cap: '6² = 36. 41 is not 36, so it is <b>not</b> a right triangle.', set: { c1: { o: 1 }, d1: { o: 1 } } }
    ] };
  }
  function distAnim() {
    var g = D.grid({ min: -1, max: 7, size: 260, x: 30, y: 20 }), P = g.P, s = D.arrowDefs() + g.svg;
    var A = P(1, 1), B = P(5, 4), K = P(5, 1);
    s += D.circ(A[0], A[1], 6, { fill: C.navy }) + D.circ(B[0], B[1], 6, { fill: C.navy }) + D.txt(A[0] - 10, A[1] + 20, 'A(1, 1)', { s: 13 }) + D.txt(B[0] + 4, B[1] - 12, 'B(5, 4)', { s: 13 });
    s += D.line(A[0], A[1], B[0], B[1], { c: C.gold, w: 3.5, id: 'h', draw: true });
    s += D.line(A[0], A[1], K[0], K[1], { c: C.blue, w: 3.5, id: 'r', draw: true }) + D.line(K[0], K[1], B[0], B[1], { c: C.purple, w: 3.5, id: 'u', draw: true });
    s += D.txt((A[0] + K[0]) / 2, A[1] + 22, '4', { s: 16, c: C.blue, id: 'rl', hide: true }) + D.txt(K[0] + 14, (K[1] + B[1]) / 2 + 5, '3', { s: 16, c: C.purple, id: 'ul', hide: true });
    var lines = ['run = 5 − 1 = 4', 'rise = 4 − 1 = 3', '4² + 3² = 16 + 9 = 25', 'distance = √25 = 5'];
    lines.forEach(function (l, i) { s += D.txt(340, 70 + i * 44, l, { s: 19, mono: true, a: 'start', id: 'l' + i, hide: true, c: i === 3 ? C.green : C.navy }); });
    return { w: 640, h: 310, svg: s, title: 'Distance on the coordinate plane', frames: [
      { cap: 'How far is it from A(1, 1) to B(5, 4)?', set: { h: { d: 1 } } },
      { cap: 'Draw a right triangle under the segment. The across leg (run) is 5 − 1 = <b>4</b>.', set: { r: { d: 1 }, rl: { o: 1 }, l0: { o: 1 } } },
      { cap: 'The up leg (rise) is 4 − 1 = <b>3</b>.', set: { u: { d: 1 }, ul: { o: 1 }, l1: { o: 1 } } },
      { cap: 'The distance is the hypotenuse: 4² + 3² = 25.', set: { l2: { o: 1 } } },
      { cap: '√25 = <b>5</b>. The distance from A to B is 5 units.', set: { l3: { o: 1 } } }
    ] };
  }

  function hyp(id, a, b, std, q, extra) {
    var c = Math.sqrt(a * a + b * b), o = { id: id, std: std || G7, q: q || ('The legs of a right triangle are <b>' + a + '</b> and <b>' + b + '</b>. Find the hypotenuse.'), fig: rt(a, b, { a: String(a), b: String(b), c: 'c' }), ans: Math.round(c * 10) / 10, tol: c % 1 ? 0.051 : 1e-9,
      hint: 'Square each leg, add, then take the square root.',
      miss: [[a + b, 'You added the legs. Square them first: ' + a + '² + ' + b + '².', 'What is ' + a + '²?'], [a * a + b * b, 'That is c². One more step: take the square root.', 'What number times itself is ' + (a * a + b * b) + '?'], [Math.round(Math.sqrt(Math.abs(b * b - a * a)) * 10) / 10, 'You subtracted. For the hypotenuse, add the squares.', 'Is the missing side a leg or the hypotenuse?']],
      steps: [{ q: 'Write the theorem with the legs in place.', ch: [a + '² + ' + b + '² = c²', [a + ' + ' + b + ' = c', 'The theorem uses the SQUARES of the sides.', 'What are the little 2s for?'], ['c² + ' + a + '² = ' + b + '²', 'c is the hypotenuse, the side alone on the right.', 'Which side is across from the right angle?']], ln: a + '² + ' + b + '² = c²' },
        { q: 'Square and add.', ch: [(a * a) + ' + ' + (b * b) + ' = ' + (a * a + b * b), [(2 * a) + ' + ' + (2 * b) + ' = ' + (2 * a + 2 * b), 'Squaring means times itself, not times 2.', 'What is ' + a + ' × ' + a + '?']], ln: 'c² = ' + (a * a + b * b) },
        { q: 'c² = ' + (a * a + b * b) + '. Find c.', ch: ['c = √' + (a * a + b * b) + (c % 1 ? ' ≈ ' + (Math.round(c * 10) / 10) : ' = ' + c), ['c = ' + (a * a + b * b) / 2, 'A square root is not ÷ 2.', 'What number times itself is ' + (a * a + b * b) + '?']], ln: 'c = ' + (c % 1 ? '√' + (a * a + b * b) + ' ≈ ' + Math.round(c * 10) / 10 : c) }],
      sol: [a + '² + ' + b + '² = c²', (a * a) + ' + ' + (b * b) + ' = c²', 'c² = ' + (a * a + b * b), 'c = √' + (a * a + b * b) + (c % 1 ? ' ≈ ' + (Math.round(c * 10) / 10) : ' = ' + c)] };
    for (var k in extra || {}) o[k] = extra[k];
    return o;
  }
  function leg(id, c, b, std, q, extra) {
    var a = Math.sqrt(c * c - b * b), o = { id: id, std: std || G7, q: q || ('A right triangle has hypotenuse <b>' + c + '</b> and one leg <b>' + b + '</b>. Find the other leg.'), fig: rt(a, b, { a: 'a', b: String(b), c: String(c) }), ans: Math.round(a * 10) / 10, tol: a % 1 ? 0.051 : 1e-9,
      hint: 'The missing side is a leg, so SUBTRACT: ' + c + '² − ' + b + '².',
      miss: [[Math.round(Math.sqrt(c * c + b * b) * 10) / 10, 'You added. The missing side is a leg, so subtract the squares.', 'Is the missing side the longest side?'], [c - b, 'You subtracted the sides. Square them first.', 'What is ' + c + '²?'], [c * c - b * b, 'That is a². Take the square root.', 'What number times itself is ' + (c * c - b * b) + '?']],
      steps: [{ q: 'Which side is missing?', ch: ['A leg: subtract the squares', ['The hypotenuse: add the squares', c + ' is the longest side. It is already the hypotenuse.', 'Which side is across from the right angle?']], ln: 'a² + ' + b + '² = ' + c + '²' },
        { q: 'Square and subtract.', ch: [(c * c) + ' − ' + (b * b) + ' = ' + (c * c - b * b), [(c * c) + ' + ' + (b * b) + ' = ' + (c * c + b * b), 'Adding is for the hypotenuse.', 'Leg → add or subtract?']], ln: 'a² = ' + (c * c - b * b) },
        { q: 'Find a.', ch: ['a = √' + (c * c - b * b) + ' = ' + a, ['a = ' + (c * c - b * b) / 2, 'A square root is not ÷ 2.', 'What number times itself is ' + (c * c - b * b) + '?']], ln: 'a = ' + a }],
      sol: ['a² + ' + b + '² = ' + c + '²', 'a² = ' + (c * c) + ' − ' + (b * b) + ' = ' + (c * c - b * b), 'a = √' + (c * c - b * b) + ' = ' + a] };
    for (var k in extra || {}) o[k] = extra[k];
    return o;
  }
  function isRight(id, x, y, z) {
    var yes = x * x + y * y === z * z;
    return { id: id, std: G6, q: 'Can the sides <b>' + x + ', ' + y + ', ' + z + '</b> make a right triangle?', keep: 1, wide: 1,
      ch: yes ? ['Yes: ' + (x * x) + ' + ' + (y * y) + ' = ' + (z * z) + ', which is ' + z + '²', ['No: the numbers are not 3, 4, 5', 'Many side lengths make right triangles. Test them.', 'Is ' + x + '² + ' + y + '² equal to ' + z + '²?'], ['No: ' + x + ' + ' + y + ' is not ' + z, 'The test squares the sides first.', 'What is ' + x + '² + ' + y + '²?']]
        : ['No: ' + (x * x) + ' + ' + (y * y) + ' = ' + (x * x + y * y) + ', but ' + z + '² = ' + (z * z), ['Yes: ' + x + ' + ' + y + ' is more than ' + z, 'Any triangle has that. The right-triangle test uses squares.', 'Is ' + x + '² + ' + y + '² equal to ' + z + '²?'], ['Yes: they are in counting order', 'Counting order does not make a right angle.', 'Square the sides and compare.']],
      hint: 'Square the two short sides and add. Compare with the longest side squared.', sol: [x + '² + ' + y + '² = ' + (x * x) + ' + ' + (y * y) + ' = ' + (x * x + y * y), z + '² = ' + (z * z), yes ? 'equal → right triangle' : 'not equal → not a right triangle'] };
  }

  SB.unit({
    n: 5, title: 'Pythagorean Theorem', std: 'NC.8.G.6–8', std0: G7,
    lessons: [
      { id: '5a', title: 'Legs, hypotenuse and a² + b² = c²', std: G6, anim: squaresAnim(),
        big: 'In a <b>right triangle</b>, the two shorter sides are the <b>legs</b> (a and b). The longest side, across from the right angle, is the <b>hypotenuse</b> (c). The theorem: <span class="m">a² + b² = c²</span>.',
        words: [['Right triangle', 'a triangle with a 90° angle (a square corner)'], ['Leg', 'one of the two sides that make the square corner'], ['Hypotenuse', 'the longest side, across from the square corner']],
        fig: rt(5, 12, { a: 'a = 5', b: 'b = 12', c: 'c = 13' }),
        watch: 'The hypotenuse is <b>always</b> across from the square corner. Find it first.',
        walk: { prob: 'Which side is the hypotenuse?', fig: rt(8, 15, { a: '8', b: '15', c: '17' }), steps: [
          { q: 'Where is the right angle (square corner)?', ch: ['Between the sides 8 and 15', ['Between the sides 15 and 17', 'Look for the little square in the corner.', 'Which two sides touch the little square?']], ln: 'legs: 8 and 15' },
          { q: 'The hypotenuse is across from the right angle. Which side?', ch: ['17', ['15', '15 touches the square corner, so it is a leg.', 'Which side does NOT touch the square corner?'], ['8', '8 touches the square corner, so it is a leg.', 'Which side is the longest?']], ln: 'hypotenuse c = 17' },
          { q: 'Check with the theorem: 8² + 15² = ?', ch: ['64 + 225 = 289 = 17²', ['16 + 30 = 46', 'Squaring means times itself, not times 2.', 'What is 8 × 8?']], ln: '64 + 225 = 289 = 17² ✓' }] },
        checks: [
          { id: 'u5c1', std: G6, q: 'Which side is the <b>hypotenuse</b>?', fig: rt(6, 8, { a: 'p = 6', b: 'q = 8', c: 'r = 10' }), ch: ['r = 10', ['q = 8', 'q touches the square corner. It is a leg.', 'Which side is across from the square corner?'], ['p = 6', 'p touches the square corner. It is a leg.', 'Which side is the longest?']], hint: 'The hypotenuse is the longest side, across from the square corner.' },
          { id: 'u5c2', std: G6, q: 'A right triangle has legs a and b and hypotenuse c. Which equation is true?', ch: ['a² + b² = c²', ['a + b = c', 'The theorem uses the squares.', 'What do the little 2s mean?'], ['a² + c² = b²', 'c, the hypotenuse, goes by itself on one side.', 'Which side is alone?'], ['a² · b² = c²', 'The squares are added, not multiplied.', 'Add or multiply?']], hint: 'Leg squared plus leg squared equals hypotenuse squared.' }
        ],
        can: 'name the legs and hypotenuse of a right triangle and write a² + b² = c².',
        recap: ['Find the square corner', 'The two sides touching it are legs', 'The side across from it is the hypotenuse'] },

      { id: '5b', title: 'Find the hypotenuse', std: G7, anim: hypAnim(6, 8, 10, false),
        big: 'When the <b>hypotenuse is missing</b>: square each leg, <b>add</b>, then take the <b>square root</b>.',
        words: [['Square root (√)', 'undoes squaring: √100 = 10'], ['Round to the nearest tenth', 'one digit after the decimal point: √13 ≈ 3.6']],
        more: '<div class="m" style="line-height:2">6² + 8² = c²<br>36 + 64 = c²<br>100 = c²<br>c = √100 = 10</div>',
        watch: 'Do not add the legs (6 + 8 = 14). Square them first.',
        walk: { prob: 'Legs 3 and 4. Find the hypotenuse.', fig: rt(3, 4, { a: '3', b: '4', c: 'c' }), steps: hyp('w', 3, 4).steps },
        checks: [hyp('u5c3', 6, 8), hyp('u5c4', 5, 12)],
        can: 'find the hypotenuse of a right triangle.',
        recap: ['Square each leg', 'Add', 'Square root'] },

      { id: '5c', title: 'Find a missing leg', std: G7, anim: hypAnim(12, 5, 13, true),
        big: 'When a <b>leg is missing</b>: square the hypotenuse and the leg you know, <b>subtract</b>, then take the <b>square root</b>. <span class="m">leg² = c² − (other leg)²</span>',
        words: [['Hypotenuse → add', 'missing the long side: add the squares'], ['Leg → subtract', 'missing a short side: subtract the squares']],
        watch: 'If the missing side is a leg, the answer must be <b>shorter</b> than the hypotenuse. If it is not, you added by mistake.',
        walk: { prob: 'Hypotenuse 10, one leg 6. Find the other leg.', fig: rt(8, 6, { a: 'a', b: '6', c: '10' }), steps: leg('w', 10, 6).steps },
        checks: [leg('u5c5', 10, 6), leg('u5c6', 13, 5)],
        can: 'find a missing leg of a right triangle.',
        recap: ['Is the missing side a leg?', 'Hypotenuse² − leg²', 'Square root'] },

      { id: '5d', title: 'Is it a right triangle? (the converse)', std: G6, anim: converseAnim(),
        big: 'To test three side lengths: square the two <b>shorter</b> sides and add. If the sum <b>equals</b> the longest side squared, it <b>is</b> a right triangle. If not, it is not.',
        words: [['Converse', 'the theorem used backward, to test a triangle'], ['Longest side', 'the only side that could be the hypotenuse']],
        watch: 'Always use the <b>longest</b> side as c.',
        walk: { prob: 'Do 9, 12, 15 make a right triangle?', steps: [
          { q: 'Which side would be the hypotenuse?', ch: ['15, the longest side', ['9, the first number', 'The hypotenuse is always the longest side.', 'Which number is biggest?']], ln: 'c = 15' },
          { q: 'Square and add the two shorter sides.', ch: ['81 + 144 = 225', ['18 + 24 = 42', 'Squaring is times itself.', 'What is 9 × 9?'], ['81 + 225 = 306', 'Use the two SHORTER sides.', 'Which two are shorter than 15?']], ln: '9² + 12² = 225' },
          { q: '15² = 225. What do we decide?', ch: ['Equal, so it IS a right triangle', ['Not equal, so it is not', '225 = 225. They are equal.', 'Is 225 the same as 225?']], ln: '225 = 225 → right triangle' }] },
        checks: [isRight('u5c7', 6, 8, 10), isRight('u5c8', 4, 5, 6)],
        can: 'decide whether three side lengths make a right triangle.',
        recap: ['Longest side = c', 'a² + b²', 'Equal to c²? Yes → right triangle'] },

      { id: '5e', title: 'Distance on the coordinate plane', std: G8, anim: distAnim(),
        big: 'To find the distance between two points: draw a right triangle. The <b>across</b> change is one leg, the <b>up/down</b> change is the other leg, and the <b>distance</b> is the hypotenuse.',
        words: [['Run', 'the across change: subtract the x-values'], ['Rise', 'the up/down change: subtract the y-values']],
        watch: 'Count the length of each leg (always positive). Then use a² + b² = c².',
        walk: { prob: 'Find the distance from (2, 1) to (8, 9).', steps: [
          { q: 'Find the run (across change).', ch: ['8 − 2 = 6', ['9 − 1 = 8', 'That is the up/down change (y-values).', 'Which numbers are the x-values?'], ['8 + 2 = 10', 'Subtract to find the change.', 'Add or subtract?']], ln: 'run = 6' },
          { q: 'Find the rise (up/down change).', ch: ['9 − 1 = 8', ['8 − 2 = 6', 'That was the run.', 'Which numbers are the y-values?']], ln: 'rise = 8' },
          { q: 'Use a² + b² = c².', ch: ['36 + 64 = 100, so the distance is 10', ['6 + 8 = 14', 'Square the legs first.', 'What is 6²?'], ['36 + 64 = 100, so the distance is 100', '100 is c². Take the square root.', 'What is √100?']], ln: 'distance = √100 = 10' }] },
        checks: [
          { id: 'u5c9', std: G8, q: 'Find the distance from <b>(1, 2)</b> to <b>(4, 6)</b>.', ans: 5, hint: 'Run = 4 − 1. Rise = 6 − 2. Then a² + b² = c².', miss: [[7, 'You added the legs (3 + 4). Square them first.', 'What is 3² + 4²?'], [25, 'That is c². Take the square root.', 'What is √25?']], sol: ['run = 4 − 1 = 3, rise = 6 − 2 = 4', '3² + 4² = 9 + 16 = 25', 'distance = √25 = 5'] }
        ],
        can: 'find the distance between two points with the Pythagorean Theorem.',
        recap: ['Run = change in x', 'Rise = change in y', 'Distance = √(run² + rise²)'] }
    ],
    practice: [
      hyp('u5p1', 9, 12),
      hyp('u5p2', 5, 12),
      leg('u5p3', 15, 9),
      leg('u5p4', 17, 8),
      isRight('u5p5', 7, 24, 25),
      isRight('u5p6', 4, 5, 6),
      leg('u5p7', 10, 6, G7, 'A 10-foot ladder leans on a wall. The bottom is <b>6 feet</b> from the wall. How high up the wall does it reach?', { unit: 'ft', fig: rt(8, 6, { a: 'h', b: '6 ft', c: '10 ft' }) }),
      hyp('u5p8', 2, 3, G7, 'The legs of a right triangle are <b>2</b> and <b>3</b>. Find the hypotenuse to the nearest tenth.'),
      { id: 'u5p9', std: G8, q: 'Find the distance from <b>(−2, 1)</b> to <b>(2, 4)</b>.', ans: 5, neg: 1, hint: 'Run = 2 − (−2) = 4. Rise = 4 − 1 = 3.', miss: [[7, 'You added the legs. Square them first.', 'What is 4² + 3²?'], [25, 'That is c². Take the square root.', 'What is √25?'], [Math.round(Math.sqrt(9) * 10) / 10, 'Check the run: from −2 to 2 is 4 steps, not 0.', 'What is 2 − (−2)?']],
        steps: [{ q: 'Run (across change)?', ch: ['2 − (−2) = 4', ['2 − 2 = 0', 'The x-values are −2 and 2. Subtracting a negative adds.', 'How many steps from −2 to 2?']], ln: 'run = 4' }, { q: 'Rise (up/down change)?', ch: ['4 − 1 = 3', ['4 + 1 = 5', 'Subtract the y-values.', 'Add or subtract?']], ln: 'rise = 3' }, { q: 'Distance?', ch: ['√(16 + 9) = √25 = 5', ['4 + 3 = 7', 'Square the legs first.', 'What is 4²?']], ln: 'distance = 5' }],
        sol: ['run = 2 − (−2) = 4, rise = 4 − 1 = 3', '4² + 3² = 16 + 9 = 25', 'distance = √25 = 5'] },
      { id: 'u5p10', std: G7, q: '<b>Find the mistake.</b> A right triangle has legs 6 and 8. Max wrote: <span class="m">6 + 8 = 14, so c = 14</span>. What went wrong?', wide: 1,
        ch: ['Max added the legs. He must square them: 36 + 64 = 100, so c = 10.', ['Max is right: c = 14.', 'Check: 6² + 8² = 100, but 14² = 196.', 'Does 14² equal 6² + 8²?'], ['Max should subtract: 8 − 6 = 2.', 'We add the squares to find the hypotenuse.', 'Is the missing side a leg or the hypotenuse?'], ['Max should multiply: 6 × 8 = 48.', 'The theorem adds the squares of the legs.', 'What is a² + b²?']], hint: 'Use a² + b² = c². What did Max forget to do to 6 and 8?' }
    ]
  });
})();
