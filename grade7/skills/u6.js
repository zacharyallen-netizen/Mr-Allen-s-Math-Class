/* Skill Builders · Grade 7 · Unit 6 · Scale Drawings, Angles and Triangles (NC.7.G.1, G.2, G.5) · Score 3 core skills */
(function () {
  var D = SB.D, C = SB.C, B = SB.G7.board;
  var G1 = 'NC.7.G.1', G5 = 'NC.7.G.5';

  function scaleAnim() {
    var s = '';
    s += D.rect(60, 40, 120, 80, { fill: '#FCEBC8', c: C.navy, w: 2 }) + D.txt(120, 136, '3 cm', { s: 15, c: C.red }) + D.txt(44, 85, '2 cm', { s: 15, c: C.red, a: 'end' });
    s += D.txt(120, 30, 'drawing', { s: 14, c: C.gray });
    s += D.g(D.rect(300, 20, 300, 200, { fill: '#F6E7C8', c: C.navy, w: 2 }) + D.txt(450, 236, '12 m', { s: 15, c: C.green }) + D.txt(612, 125, '8 m', { s: 15, c: C.green, a: 'start' }) + D.txt(450, 120, 'real room', { s: 16, c: C.gray }), { id: 'real', hide: true });
    return B('Use a scale', s, [{ t: 'scale: 1 cm = 4 m' }, { t: '3 × 4 = 12 m', c: C.green }, { t: '2 × 4 = 8 m', c: C.green }], [
      'A floor plan is a small drawing of a big room. The room is drawn 3 cm by 2 cm.',
      'The <b>scale</b> says every 1 cm on the drawing is <b>4 m</b> in real life.',
      'The long side: 3 cm stands for 3 × 4 = <b>12 m</b>.',
      'The short side: 2 × 4 = <b>8 m</b>. The real room is 12 m by 8 m.'], { th: 250, extra: { 2: { real: { o: 1 } } } });
  }
  function angleAnim() {
    var s = '', cx = 320, cy = 120, L = 150;
    s += D.line(cx - L, cy, cx + L, cy, { w: 3 });
    var p = D.ray(cx, cy, 40, L); s += D.line(cx, cy, p[0], p[1], { w: 3, id: 'r1' });
    s += D.arc(cx, cy, 40, 0, 40, { c: C.blue, w: 3 }) + D.txt(cx + 70, cy - 18, '40°', { s: 16, c: C.blue });
    s += D.g(D.arc(cx, cy, 30, 40, 180, { c: C.red, w: 3 }) + D.txt(cx - 30, cy - 46, '140°', { s: 16, c: C.red }), { id: 'sup', hide: true });
    var q = D.ray(cx, cy, 90, 110); s += D.g(D.line(cx, cy, q[0], q[1], { w: 3, c: C.green }) + D.rightMark(cx, cy, 90, 14, { c: C.green }), { id: 'rt', hide: true });
    return B('Angle pairs', s, [{ t: 'supplementary: add to 180°' }, { t: '180 − 40 = 140', c: C.red }, { t: 'complementary: add to 90°', c: C.green }], [
      'A straight line is <b>180°</b>. One ray splits it into two angles.',
      'Angles that make a straight line are <b>supplementary</b>: they add to 180°.',
      'So the other angle is 180 − 40 = <b>140°</b>.',
      'Angles that make a right angle (a square corner) are <b>complementary</b>: they add to <b>90°</b>.'], { th: 140, extra: { 2: { sup: { o: 1 } }, 3: { rt: { o: 1 } } } });
  }

  SB.unit({
    n: 6, title: 'Scale Drawings, Angles and Triangles', std: 'NC.7.G.1, G.2, G.5', std0: G1, sendUnit: '7-6', pagePre: 'Grade 7 · ',
    lessons: [
      { id: 'g7-6a', title: 'Use a scale drawing', std: G1, anim: scaleAnim(),
        hook: 'How does a whole city fit on a map in your pocket? A scale!',
        big: 'A <b>scale</b> tells how a drawing length matches a real length, like <span class="m">1 cm = 4 m</span>. Multiply by the scale to get the real length. Divide to go back to the drawing.',
        words: [['Scale', 'drawing length = real length, like 1 in = 10 ft'], ['Scale drawing', 'a picture with the same shape, bigger or smaller']],
        watch: 'Keep the units straight: cm on the drawing, m in real life.',
        walk: { prob: 'Map scale: 1 inch = 20 miles. Two towns are 3 inches apart on the map. How far apart are they?', steps: [
          { q: 'Each inch is 20 miles. What do you do with 3 inches?', ch: ['Multiply: 3 × 20', ['Divide: 20 ÷ 3', 'Each inch is 20 miles, so 3 inches is 3 groups of 20.', 'How many 20s?'], ['Add: 3 + 20', 'Each inch adds 20 miles.', 'How many groups of 20?']], ln: '3 × 20' },
          { q: '3 × 20 = ?', ch: ['60 miles', ['23 miles', 'Multiply, do not add.', 'What is 3 × 20?']], ln: '= 60 miles' }] },
        checks: [
          { id: 'g76c1', std: G1, q: 'Scale: 1 cm = 5 m. A wall is 7 cm on the drawing. How many meters long is the real wall?', ans: 35, hint: '7 × 5', miss: [[12, 'Multiply, do not add.', 'What is 7 × 5?'], [1.4, 'Going from drawing to real, multiply.', 'Bigger or smaller in real life?']], sol: ['7 × 5 = 35 m'] },
          { id: 'g76c2', std: G1, q: 'Scale: 1 in = 10 ft. A 40 ft tree. How tall on the drawing?', keep: 1, ch: ['4 in', ['400 in', 'Going from real to drawing, divide.', 'Should the drawing be big or small?'], ['30 in', 'Divide, do not subtract.', 'How many 10s in 40?']], hint: '40 ÷ 10' }
        ],
        can: 'use a scale to find real lengths.',
        recap: ['Drawing → real: multiply', 'Real → drawing: divide', 'Keep the units straight'] },

      { id: 'g7-6b', title: 'Find a missing angle', std: G5, anim: angleAnim(),
        hook: 'Look at a slice of pizza or the hands on a clock. Angles are everywhere!',
        big: '<b>Complementary</b> angles add to 90°. <b>Supplementary</b> angles add to 180° (a straight line). <b>Vertical</b> angles (across from each other where two lines cross) are equal.',
        words: [['Complementary', 'add to 90°'], ['Supplementary', 'add to 180°'], ['Vertical angles', 'across an X; they are equal']],
        watch: 'C comes before S, and 90 comes before 180: Complementary = 90, Supplementary = 180.',
        walk: { prob: 'Two angles are supplementary. One is 65°. Find the other.', steps: [
          { q: 'Supplementary angles add to…', ch: ['180°', ['90°', 'That is complementary.', 'Which one is a straight line?'], ['360°', 'That is a full circle.', 'What does a straight line measure?']], ln: '65 + ? = 180' },
          { q: '180 − 65 = ?', ch: ['115°', ['125°', 'Check: 65 + 125 = 190.', 'Subtract again carefully.'], ['25°', 'That is 90 − 65.', 'Which total do you use?']], ln: '= 115°' }] },
        checks: [
          { id: 'g76c3', std: G5, q: 'Two angles are complementary. One is 38°. What is the other, in degrees?', ans: 52, hint: '90 − 38', miss: [[142, 'Complementary adds to 90, not 180.', 'Complementary = ?'], [128, 'Subtract from 90.', 'What is 90 − 38?']], sol: ['90 − 38 = 52'] },
          { id: 'g76c4', std: G5, q: 'Two lines cross. One angle is 70°. The angle across from it is…', keep: 1, ch: ['70°', ['110°', 'That angle is NEXT to it. The one across is equal.', 'Across or next to?'], ['20°', 'That is the complement.', 'What do vertical angles do?']], hint: 'Vertical angles are equal.' }
        ],
        can: 'use angle facts to find a missing angle.',
        recap: ['Right angle: add to 90°', 'Straight line: add to 180°', 'Across an X: equal'] }
    ],
    practice: [
      { id: 'g76p1', std: G1, q: 'Scale: 1 cm = 3 m. A drawing is 8 cm long. How many meters really?', ans: 24, hint: '8 × 3', miss: [[11, 'Multiply, do not add.', 'What is 8 × 3?']], sol: ['8 × 3 = 24'] },
      { id: 'g76p2', std: G1, q: 'Map: 1 in = 50 miles. Two cities are 4 in apart. How many miles?', ans: 200, hint: '4 × 50', miss: [[54, 'Multiply, do not add.', 'What is 4 × 50?'], [12.5, 'From map to real, multiply.', 'Bigger or smaller?']], sol: ['4 × 50 = 200'] },
      { id: 'g76p3', std: G1, q: 'Scale: 1 in = 6 ft. A room is 30 ft long. How long on the plan, in inches?', ans: 5, hint: '30 ÷ 6', miss: [[180, 'From real to plan, divide.', 'Bigger or smaller on the plan?'], [24, 'Divide, do not subtract.', 'How many 6s in 30?']], sol: ['30 ÷ 6 = 5'] },
      { id: 'g76p4', std: G5, q: 'What is the supplement of 120°?', ans: 60, hint: '180 − 120', miss: [[-30, 'Supplementary adds to 180, not 90.', 'Supplementary = ?'], [240, 'Subtract from 180.', 'Add or subtract?']], sol: ['180 − 120 = 60'] },
      { id: 'g76p5', std: G5, q: 'What is the complement of 25°?', ans: 65, hint: '90 − 25', miss: [[155, 'Complementary adds to 90.', 'Complementary = ?'], [115, 'Subtract from 90.', 'What is 90 − 25?']], sol: ['90 − 25 = 65'] },
      { id: 'g76p6', std: G5, q: 'Two lines cross. One angle is 125°. What is the angle next to it on the same line?', ans: 55, hint: 'Next to it on a line: they add to 180.', miss: [[125, 'That is the angle ACROSS from it.', 'Next to or across?'], [-35, 'Use 180, not 90.', 'What does a line measure?']], sol: ['180 − 125 = 55'] },
      { id: 'g76p7', std: G5, q: 'Which pair is complementary?', keep: 1, ch: ['30° and 60°', ['30° and 150°', 'They add to 180: supplementary.', 'What do they add to?'], ['45° and 55°', 'They add to 100.', 'What do they add to?']], hint: 'Complementary angles add to 90°.' },
      { id: 'g76p8', std: G5, q: 'A triangle has angles 50° and 60°. What is the third angle?', ans: 70, hint: 'All three add to 180.', miss: [[110, 'That is 50 + 60. Subtract from 180.', 'What do the 3 angles add to?'], [-20, 'A triangle adds to 180, not 90.', 'Triangle total?']], sol: ['180 − 50 − 60 = 70'] }
    ]
  });
})();
