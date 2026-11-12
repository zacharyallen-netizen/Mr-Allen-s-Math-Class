/* Skill Builders · Unit 8 · Transformations (NC.8.G.2, NC.8.G.3, NC.8.G.4) · Score 3 core skills */
(function () {
  var D = SB.D, C = SB.C, M = D.minus, G2 = 'NC.8.G.2', G3 = 'NC.8.G.3', G4 = 'NC.8.G.4';
  function pt(p) { return '(' + M(String(p[0])) + ', ' + M(String(p[1])) + ')'; }
  function polyOn(P, pts, o) { return D.poly(pts.map(function (q) { return P(q[0], q[1]); }), o); }
  function labels(P, pts, names, prime, col) {
    var cx = pts.reduce(function (a, q) { return a + q[0]; }, 0) / pts.length, cy = pts.reduce(function (a, q) { return a + q[1]; }, 0) / pts.length;
    return pts.map(function (q, i) { var p = P(q[0], q[1]), dx = q[0] - cx, dy = q[1] - cy, L = Math.hypot(dx, dy) || 1; return D.txt(p[0] + dx / L * 14, p[1] - dy / L * 14 + 5, names[i] + (prime ? '′' : ''), { s: 13, c: col || C.navy }); }).join('');
  }
  /* grid with a shape (and optionally its image) */
  function gridFig(o) {
    var g = D.grid({ min: o.min || -6, max: o.max || 6, size: o.size || 240, x: 24, y: 12 }), P = g.P, s = D.arrowDefs() + g.svg;
    if (o.shape) s += polyOn(P, o.shape, { fill: 'rgba(29,78,216,.18)', c: C.blue, w: 2.4 }) + (o.names ? labels(P, o.shape, o.names, false, C.blue) : '');
    if (o.image) s += polyOn(P, o.image, { fill: 'rgba(224,168,0,.22)', c: C.gold, w: 2.4 }) + (o.names ? labels(P, o.image, o.names, true, '#8A6100') : '');
    (o.pts || []).forEach(function (q) { var p = P(q[0], q[1]); s += D.circ(p[0], p[1], 5, { fill: q[3] || C.navy }) + (q[2] ? D.txt(p[0] + 7, p[1] - 7, q[2], { s: 13, a: 'start', c: q[3] || C.navy }) : ''); });
    return D.svg((o.size || 240) + 48, (o.size || 240) + 34, s, 'coordinate plane');
  }
  var TRI = [[1, 1], [4, 1], [1, 3]], NAMES = ['A', 'B', 'C'];
  function map(f) { return TRI.map(f); }

  /* one animated transformation on a grid: the shape moves to its image */
  function moveAnim(title, caps, imgFn, o) {
    o = o || {};
    var g = D.grid({ min: -6, max: 6, size: 280, x: 20, y: 10 }), P = g.P, u = g.u, s = D.arrowDefs() + g.svg;
    var img = TRI.map(imgFn);
    s += polyOn(P, TRI, { fill: 'rgba(29,78,216,.18)', c: C.blue, w: 2.4 }) + labels(P, TRI, NAMES, false, C.blue);
    if (o.mirror) s += o.mirror(P);
    s += D.g(polyOn(P, img, { fill: 'rgba(224,168,0,.25)', c: C.gold, w: 2.6 }) + labels(P, img, NAMES, true, '#8A6100'), { id: 'img', hide: true });
    if (o.ghost) s += D.g(polyOn(P, TRI, { fill: 'rgba(224,168,0,.25)', c: C.gold, w: 2.6 }), { id: 'gh', style: 'transform-origin:' + P(0, 0)[0] + 'px ' + P(0, 0)[1] + 'px;transform-box:view-box;opacity:0' });
    if (o.arrow) { var a = P(TRI[0][0], TRI[0][1]), b = P(img[0][0], img[0][1]); s += D.line(a[0], a[1], b[0], b[1], { c: C.purple, w: 2.5, arrow: 'ah', id: 'ar', draw: true, dash: '0' }); }
    var rows = TRI.map(function (q, i) { return NAMES[i] + pt(q) + ' → ' + NAMES[i] + '′' + pt(img[i]); });
    rows.forEach(function (r, i) { s += D.txt(330, 70 + i * 34, r, { s: 16, mono: true, a: 'start', id: 'r' + i, hide: true }); });
    s += D.txt(330, 200, o.rule || '', { s: 18, mono: true, a: 'start', c: C.green, id: 'rule', hide: true });
    s += D.txt(330, 236, o.after || '', { s: 14, a: 'start', c: C.gray, id: 'aft', hide: true });
    var f = [{ cap: caps[0], set: {} }];
    var mv = { img: { o: 1 } }; if (o.arrow) mv.ar = { d: 1 }; if (o.ghost) mv.gh = { o: 1, t: o.ghost };
    f.push({ cap: caps[1], set: mv });
    f.push({ cap: caps[2], set: { r0: { o: 1 }, r1: { o: 1 }, r2: { o: 1 } } });
    f.push({ cap: caps[3], set: { rule: { o: 1 }, aft: { o: 1 }, gh: { o: 0 } } });
    return { w: 640, h: 300, svg: s, title: title, frames: f };
  }
  function imgQ(id, std, p, move, right, wrongs, hint, extra) {
    var o = { id: id, std: std, q: move + ' the point <b>' + pt(p) + '</b>. Where does it land?', ch: [pt(right)].concat(wrongs.map(function (w) { return [pt(w[0]), w[1], w[2]]; })), hint: hint };
    for (var k in extra || {}) o[k] = extra[k];
    return o;
  }

  SB.unit({
    n: 8, title: 'Transformations', std: 'NC.8.G.2–4', std0: G3,
    lessons: [
      { id: '8a', title: 'Translations (slides)', std: G3,
        anim: moveAnim('Translation: slide', ['Triangle ABC. A <b>translation</b> slides every point the same way.', 'Slide it <b>right 4</b> and <b>up 1</b>. The new triangle is the <b>image</b> A′B′C′.', 'Every x goes up by 4 and every y goes up by 1.', 'Rule: <b>(x, y) → (x + 4, y + 1)</b>. Same size and shape: <b>congruent</b>.'], function (q) { return [q[0] + 4, q[1] + 1]; }, { arrow: true, rule: '(x, y) → (x + 4, y + 1)', after: 'same size and shape: congruent' }),
        big: 'A <b>translation</b> slides a figure. <b>Right/left changes x</b> (add or subtract). <b>Up/down changes y</b>. The image is <b>congruent</b> (same size and shape).',
        words: [['Pre-image', 'the original figure'], ['Image', 'the figure after the move, named with ′ (A′, "A prime")'], ['Congruent', 'same size and same shape']],
        more: '<table class="tbl"><tr><th>Move</th><td>right h</td><td>left h</td><td>up k</td><td>down k</td></tr><tr><th>Do</th><td>x + h</td><td>x − h</td><td>y + k</td><td>y − k</td></tr></table>',
        watch: 'Left and right change <b>x</b> (the first number). Up and down change <b>y</b> (the second number).',
        walk: { prob: 'Translate (1, −2) left 3 and up 5.', steps: [
          { q: 'Left 3 changes which number?', ch: ['x: 1 − 3 = −2', ['y: −2 − 3 = −5', 'Left and right move across, so they change x.', 'Which number tells across?'], ['x: 1 + 3 = 4', 'Left means subtract.', 'Does left make x bigger or smaller?']], ln: 'x: 1 − 3 = −2' },
          { q: 'Up 5 changes which number?', ch: ['y: −2 + 5 = 3', ['x: −2 + 5 = 3', 'Up and down change y.', 'Which number tells up/down?'], ['y: −2 − 5 = −7', 'Up means add.', 'Does up make y bigger or smaller?']], ln: 'y: −2 + 5 = 3' },
          { q: 'The image point is…', ch: ['(−2, 3)', ['(3, −2)', 'x comes first.', 'Which is x: −2 or 3?'], ['(4, −7)', 'Check each move again.', 'Left means subtract from x; up means add to y.']], ln: '(1, −2) → (−2, 3)' }] },
        checks: [
          imgQ('u8c1', G3, [2, 3], 'Translate right 4 and up 1:', [6, 4], [[[3, 7], 'You added 1 to x and 4 to y. Right changes x; up changes y.', 'Which number does "right 4" change?'], [[-2, 4], 'Right means add to x.', 'Does right make x bigger or smaller?'], [[6, 2], 'Up means add to y.', 'Does up make y bigger or smaller?']], 'Right 4: x + 4. Up 1: y + 1.'),
          imgQ('u8c2', G3, [2, 5], 'Translate left 2 and down 3:', [0, 2], [[[4, 8], 'Left and down mean subtract.', 'Does left make x smaller?'], [[-1, 3], 'You subtracted 3 from x and 2 from y. Left changes x; down changes y.', 'Which number does "left 2" change?'], [[0, 8], 'Down means subtract from y.', 'Does down make y smaller?']], 'Left 2: x − 2. Down 3: y − 3.')
        ],
        can: 'translate a point or figure and write the rule.',
        recap: ['Right/left → change x', 'Up/down → change y', 'The image is congruent'] },

      { id: '8b', title: 'Reflections (flips)', std: G3,
        anim: moveAnim('Reflection: flip', ['A <b>reflection</b> flips a figure over a line, like a mirror.', 'Flip triangle ABC over the <b>x-axis</b>. Each point lands the same distance on the other side.', 'x stays the same. y changes sign.', 'Over the x-axis: <b>(x, y) → (x, −y)</b>. Over the y-axis: (x, y) → (−x, y). Congruent.'], function (q) { return [q[0], -q[1]]; }, { rule: '(x, y) → (x, −y)', after: 'over the x-axis: y changes sign', mirror: function (P) { var a = P(-6, 0), b = P(6, 0); return D.line(a[0], a[1], b[0], b[1], { c: C.red, w: 3.5, dash: '8 5' }); } }),
        big: 'A <b>reflection</b> flips a figure over a line. Over the <b>x-axis</b>: y changes sign, <span class="m">(x, y) → (x, −y)</span>. Over the <b>y-axis</b>: x changes sign, <span class="m">(x, y) → (−x, y)</span>.',
        words: [['Line of reflection', 'the mirror line'], ['Opposite', 'same number, other sign: the opposite of 5 is −5']],
        more: 'Trick: you flip <b>over</b> the x-axis, so the <b>other</b> letter (y) changes sign.',
        watch: 'Only <b>one</b> coordinate changes sign in a reflection over an axis.',
        walk: { prob: 'Reflect (3, 5) over the y-axis.', steps: [
          { q: 'Over the y-axis, which coordinate changes sign?', ch: ['x', ['y', 'Over the y-axis the point moves across (left/right), so x changes.', 'Does the point move across or up/down?'], ['both', 'Changing both signs is a 180° rotation, not a flip.', 'How many coordinates change in a flip over an axis?']], ln: 'x changes sign' },
          { q: 'The image is…', ch: ['(−3, 5)', ['(3, −5)', 'That is a flip over the x-axis.', 'Which coordinate changes for the y-axis?'], ['(−3, −5)', 'Only x changes.', 'Does y change?']], ln: '(3, 5) → (−3, 5)' }] },
        checks: [
          imgQ('u8c3', G3, [3, 5], 'Reflect over the x-axis:', [3, -5], [[[-3, 5], 'That is over the y-axis. Over the x-axis, y changes sign.', 'Which number changes over the x-axis?'], [[-3, -5], 'Only one coordinate changes in a flip over an axis.', 'How many numbers change sign?'], [[5, 3], 'Switching the numbers is not a flip.', 'Which number changes sign?']], 'Over the x-axis: keep x, change the sign of y.'),
          imgQ('u8c4', G3, [-3, 4], 'Reflect over the y-axis:', [3, 4], [[[-3, -4], 'That is over the x-axis. Over the y-axis, x changes sign.', 'Which number changes over the y-axis?'], [[3, -4], 'Only x changes sign.', 'Does y change?'], [[4, -3], 'Do not switch the numbers.', 'Which number changes sign?']], 'Over the y-axis: change the sign of x, keep y.')
        ],
        can: 'reflect a point or figure over the x-axis or y-axis.',
        recap: ['Over the x-axis: (x, −y)', 'Over the y-axis: (−x, y)', 'The image is congruent'] },

      { id: '8c', title: 'Rotations (turns)', std: G3,
        anim: moveAnim('Rotation: turn about the origin', ['A <b>rotation</b> turns a figure around a point. Here the point is the origin (0, 0).', 'Turn triangle ABC <b>180°</b> (a half turn).', 'Both coordinates change sign.', '180°: <b>(x, y) → (−x, −y)</b>. 90° counterclockwise: (x, y) → (−y, x). Congruent.'], function (q) { return [-q[0], -q[1]]; }, { ghost: 'rotate(-180deg)', rule: '(x, y) → (−x, −y)', after: '180° turn: both signs change' }),
        big: 'A <b>rotation</b> turns a figure around the origin. <b>180°</b>: <span class="m">(x, y) → (−x, −y)</span>. <b>90° counterclockwise</b>: <span class="m">(x, y) → (−y, x)</span>. <b>270° counterclockwise</b> (90° clockwise): <span class="m">(x, y) → (y, −x)</span>.',
        words: [['Counterclockwise', 'the opposite way a clock’s hands turn'], ['Origin', 'the point (0, 0) where the axes cross']],
        more: '<table class="tbl"><tr><th>Turn</th><th>Rule</th><th>(4, 2) →</th></tr><tr><td>90° CCW</td><td>(−y, x)</td><td>(−2, 4)</td></tr><tr><td>180°</td><td>(−x, −y)</td><td>(−4, −2)</td></tr><tr><td>270° CCW</td><td>(y, −x)</td><td>(2, −4)</td></tr></table>',
        watch: 'For 90° and 270°, the numbers <b>switch places</b>. For 180°, they do not.',
        walk: { prob: 'Rotate (1, 5) 90° counterclockwise.', steps: [
          { q: 'Which rule is 90° counterclockwise?', ch: ['(x, y) → (−y, x)', ['(x, y) → (−x, −y)', 'That is 180°.', 'Do the numbers switch places for 90°?'], ['(x, y) → (y, −x)', 'That is 270° counterclockwise (90° clockwise).', 'Which way is counterclockwise?']], ln: '(x, y) → (−y, x)' },
          { q: 'Here x = 1 and y = 5. What is −y?', ch: ['−5', ['5', '−y means the opposite of y.', 'What is the opposite of 5?'], ['−1', 'y is 5, not 1.', 'Which number is y?']], ln: '−y = −5' },
          { q: 'The image is…', ch: ['(−5, 1)', ['(1, −5)', 'The rule puts −y first.', 'What goes first: −y or x?'], ['(−1, −5)', 'That is a 180° turn.', 'Use (−y, x).']], ln: '(1, 5) → (−5, 1)' }] },
        checks: [
          imgQ('u8c5', G3, [4, 2], 'Rotate 180° about the origin:', [-4, -2], [[[-4, 2], 'A 180° turn changes the sign of BOTH coordinates.', 'How many numbers change sign?'], [[2, 4], 'The numbers do not switch for 180°.', 'Do the numbers switch places?'], [[-2, 4], 'That is a 90° turn.', 'Which rule is 180°?']], '180°: change both signs.'),
          imgQ('u8c6', G3, [5, 5], 'Rotate 90° counterclockwise about the origin:', [-5, 5], [[[5, -5], 'That is (y, −x): a 270° turn.', 'Which rule is 90° counterclockwise?'], [[-5, -5], 'That is a 180° turn.', 'Use (−y, x).'], [[5, 5], 'The point must move.', 'What is −y here?']], '90° CCW: (x, y) → (−y, x).')
        ],
        can: 'rotate a point 90°, 180° or 270° about the origin.',
        recap: ['180°: (−x, −y)', '90° CCW: (−y, x)', '270° CCW: (y, −x)'] },

      { id: '8d', title: 'Dilations, congruent and similar', std: G4,
        anim: moveAnim('Dilation: resize', ['A <b>dilation</b> resizes a figure from the origin by a <b>scale factor</b> k.', 'Dilate triangle ABC by <b>k = 2</b>. It grows to twice the size.', 'Multiply <b>both</b> coordinates by 2.', 'Rule: <b>(x, y) → (2x, 2y)</b>. Same shape, different size: <b>similar</b>, not congruent.'], function (q) { return [2 * q[0], 2 * q[1]]; }, { rule: '(x, y) → (2x, 2y)', after: 'same shape, new size: similar' }),
        big: 'A <b>dilation</b> multiplies both coordinates by the <b>scale factor k</b>: <span class="m">(x, y) → (kx, ky)</span>. k &gt; 1 makes it bigger; k between 0 and 1 makes it smaller. The image is <b>similar</b>. Slides, flips and turns keep the image <b>congruent</b>.',
        words: [['Scale factor (k)', 'the number you multiply by'], ['Similar', 'same shape, maybe a different size'], ['Congruent', 'same shape AND same size']],
        more: '<b>Dilation = resize = similar.</b> Translation, reflection, rotation = same size = congruent.',
        watch: 'Multiply <b>both</b> numbers by k. Do not add k.',
        walk: { prob: 'Dilate (3, −4) by k = 3.', steps: [
          { q: 'What do we do with k = 3?', ch: ['Multiply both coordinates by 3', ['Add 3 to both coordinates', 'Adding is a translation. A dilation multiplies.', 'Does a dilation slide or resize?'], ['Multiply only x by 3', 'Both coordinates are multiplied.', 'How many numbers get multiplied?']], ln: '(3 · 3, −4 · 3)' },
          { q: 'Multiply.', ch: ['(9, −12)', ['(9, 12)', 'A negative times a positive is negative.', 'What is −4 × 3?'], ['(6, −1)', 'That is adding 3.', 'Multiply or add?']], ln: '(3, −4) → (9, −12)' },
          { q: 'Is the image congruent or similar?', ch: ['Similar: same shape, bigger size', ['Congruent: same size', 'k = 3 made it 3 times bigger.', 'Did the size change?']], ln: 'similar (not congruent)' }] },
        checks: [
          imgQ('u8c7', G4, [2, 3], 'Dilate by k = 2:', [4, 6], [[[4, 5], 'Multiply y by 2 too: 3 × 2 = 6.', 'Did you multiply both numbers?'], [[2, 6], 'Multiply x by 2 too.', 'Did you multiply both numbers?'], [[1, 1.5], 'k = 2 multiplies. Dividing would shrink it.', 'Multiply or divide?']], 'Multiply both numbers by 2.'),
          { id: 'u8c8', std: G4, q: 'After a <b>dilation</b> with k = 3, the image is…', keep: 1, ch: ['similar to the pre-image', ['congruent to the pre-image', 'Congruent means same size. k = 3 made it bigger.', 'Did the size change?'], ['neither congruent nor similar', 'A dilation keeps the same shape.', 'Did the shape change?']], hint: 'Dilation = resize = similar.' },
          { id: 'u8c9', std: G2, q: 'After a <b>reflection</b>, the image is…', keep: 1, ch: ['congruent to the pre-image', ['bigger than the pre-image', 'A flip does not change the size.', 'Does a mirror make things bigger?'], ['smaller than the pre-image', 'A flip does not change the size.', 'Does a mirror make things smaller?']], hint: 'Slides, flips and turns keep the same size.' }
        ],
        can: 'dilate a point by a scale factor and tell congruent from similar.',
        recap: ['Dilation: (kx, ky)', 'Dilation → similar', 'Slide, flip, turn → congruent'] }
    ],
    practice: [
      imgQ('u8p1', G3, [2, 5], 'Translate left 2 and down 3:', [0, 2], [[[4, 8], 'Left and down mean subtract.', 'Does left make x smaller?'], [[-1, 3], 'You switched which number changes.', 'Which number does left change?'], [[0, 8], 'Down means subtract from y.', 'Does down make y smaller?']], 'Left 2: x − 2. Down 3: y − 3.'),
      imgQ('u8p2', G3, [-3, 4], 'Reflect over the y-axis:', [3, 4], [[[-3, -4], 'That is over the x-axis.', 'Which number changes over the y-axis?'], [[3, -4], 'Only x changes.', 'Does y change?'], [[4, -3], 'Do not switch the numbers.', 'Which number changes sign?']], 'Over the y-axis: change the sign of x.'),
      imgQ('u8p3', G3, [6, -1], 'Reflect over the x-axis:', [6, 1], [[[-6, -1], 'That is over the y-axis.', 'Which number changes over the x-axis?'], [[-6, 1], 'Only y changes.', 'Does x change?'], [[-1, 6], 'Do not switch the numbers.', 'Which number changes sign?']], 'Over the x-axis: change the sign of y.'),
      imgQ('u8p4', G3, [2, 7], 'Rotate 180° about the origin:', [-2, -7], [[[-2, 7], 'Both signs change for 180°.', 'How many numbers change?'], [[7, 2], 'The numbers do not switch for 180°.', 'Do they switch?'], [[-7, 2], 'That is a 90° turn.', 'Which rule is 180°?']], '180°: (−x, −y).'),
      imgQ('u8p5', G4, [1, 3], 'Dilate by k = 4:', [4, 12], [[[5, 7], 'That adds 4. A dilation multiplies.', 'Multiply or add?'], [[4, 3], 'Multiply y by 4 too.', 'Did you multiply both?'], [[0.25, 0.75], 'k = 4 makes it bigger. Multiply.', 'Multiply or divide?']], 'Multiply both numbers by 4.'),
      imgQ('u8p6', G3, [5, 5], 'Rotate 90° counterclockwise about the origin:', [-5, 5], [[[5, -5], 'That is 270° counterclockwise.', 'Use (−y, x).'], [[-5, -5], 'That is 180°.', 'Use (−y, x).'], [[5, 5], 'The point must move.', 'What is −y?']], '90° CCW: (x, y) → (−y, x).'),
      imgQ('u8p7', G4, [4, -6], 'Dilate by k = 1/2:', [2, -3], [[[8, -12], 'k = 1/2 makes it smaller. Multiply by 1/2 (half).', 'What is half of 4?'], [[2, 3], 'Half of −6 is −3. Keep the sign.', 'What is −6 × 1/2?'], [[4.5, -5.5], 'That adds 1/2. A dilation multiplies.', 'Multiply or add?']], 'Multiply both numbers by 1/2 (take half).'),
      { id: 'u8p8', std: G3, q: 'Which move takes the blue triangle to the gold triangle?', fig: gridFig({ shape: TRI, image: TRI.map(function (q) { return [q[0], -q[1]]; }), names: NAMES }), ch: ['Reflection over the x-axis', ['Translation down 4', 'A slide would keep the triangle pointing the same way. This one is flipped.', 'Is the image upside down?'], ['Rotation 180°', 'A 180° turn would move it to the left side too.', 'Did x change sign?'], ['Dilation by k = 2', 'The size did not change.', 'Is the gold triangle bigger?']], hint: 'Compare the points: A(1, 1) → A′(1, −1).' },
      { id: 'u8p9', std: G2, q: 'After a translation, a reflection and a rotation, the image is…', keep: 1, ch: ['congruent: same size and shape', ['similar but smaller', 'None of these moves change the size.', 'Which move changes size?'], ['similar but bigger', 'None of these moves change the size.', 'Which move changes size?']], hint: 'Only a dilation changes the size.' },
      imgQ('u8p10', G3, [1, 2], 'First translate right 3, then reflect over the x-axis:', [4, -2], [[[4, 2], 'You did the slide but not the flip.', 'What happens to y over the x-axis?'], [[-4, -2], 'Over the x-axis only y changes sign.', 'Does x change?'], [[1, -5], 'Right 3 changes x, not y.', 'Which number does right change?']], 'Do the moves in order. (1, 2) → (4, 2) → ?',
        { steps: [{ q: 'First move: right 3.', ch: ['(4, 2)', ['(1, 5)', 'Right changes x.', 'Which number does right change?']], ln: '(1, 2) → (4, 2)' }, { q: 'Second move: reflect (4, 2) over the x-axis.', ch: ['(4, −2)', ['(−4, 2)', 'Over the x-axis, y changes sign.', 'Which number changes?']], ln: '(4, 2) → (4, −2)' }], sol: ['(1, 2) → right 3 → (4, 2)', '(4, 2) → over x-axis → (4, −2)'] }),
      { id: 'u8p11', std: G3, q: '<b>Find the mistake.</b> Mia reflected (2, 6) over the x-axis and got <span class="m">(−2, 6)</span>. What went wrong?', wide: 1, ch: ['Mia changed x. Over the x-axis, y changes sign: (2, −6).', ['Mia is right.', 'Over the x-axis the point moves up/down, so y changes.', 'Which number tells up/down?'], ['Both signs should change: (−2, −6).', 'That is a 180° rotation.', 'How many numbers change in a flip?'], ['The numbers should switch: (6, 2).', 'Switching is part of a 90° turn, not a flip.', 'Which number changes sign?']], hint: 'Over the x-axis, which coordinate changes sign?' }
    ]
  });
})();
