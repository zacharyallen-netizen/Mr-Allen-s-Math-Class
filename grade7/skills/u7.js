/* Skill Builders · Grade 7 · Unit 7 · Circles, Area, Surface Area and Volume (NC.7.G.4, G.6) · Score 3 core skills */
(function () {
  var D = SB.D, C = SB.C, B = SB.G7.board;
  var G4 = 'NC.7.G.4', G6 = 'NC.7.G.6';

  function circAnim() {
    var s = '', cx = 140, cy = 110, R = 80;
    s += D.circ(cx, cy, R, { fill: '#FCEBC8', c: C.navy, w: 3 }) + D.circ(cx, cy, 4, { fill: C.navy });
    s += D.g(D.line(cx, cy, cx + R, cy, { c: C.red, w: 3 }) + D.txt(cx + R / 2, cy - 10, 'r = 5', { s: 16, c: C.red }), { id: 'rad', hide: true });
    s += D.g(D.line(cx - R, cy + 30, cx + R, cy + 30, { c: C.blue, w: 3 }) + D.txt(cx, cy + 52, 'd = 10', { s: 16, c: C.blue }), { id: 'dia', hide: true });
    s += D.g(D.circ(cx, cy, R + 8, { fill: 'none', c: C.green, w: 4 }), { id: 'rim', hide: true, style: 'stroke-dasharray:8 6;' });
    return B('Circumference and area', s, [{ t: 'C = πd = 3.14 × 10 = 31.4' }, { t: 'A = πr² = 3.14 × 5 × 5 = 78.5', c: C.green }], [
      'A circle with <b>radius 5</b>: from the center to the edge.',
      'The <b>diameter</b> goes all the way across: 2 × 5 = <b>10</b>.',
      'The distance around is the <b>circumference</b>: C = π × d = 3.14 × 10 = <b>31.4</b>.',
      'The space inside is the <b>area</b>: A = π × r × r = 3.14 × 25 = <b>78.5</b> square units.'], { th: 210, extra: { 0: { rad: { o: 1 } }, 1: { dia: { o: 1 } }, 2: { rim: { o: 1 } } } });
  }
  function volAnim() {
    var s = '', u = 26, ox = 220, oy = 170;
    function cube(x, y, id) { return D.g(D.rect(x, y, u, u, { fill: '#FCEBC8', c: C.navy, w: 1.2 }), { id: id }); }
    for (var r = 0; r < 3; r++) for (var c = 0; c < 4; c++) s += cube(ox + c * u, oy - r * u, 'l0');
    var layer2 = ''; for (var r2 = 0; r2 < 3; r2++) for (var c2 = 0; c2 < 4; c2++) layer2 += D.rect(ox + 14 + c2 * u, oy - 14 - r2 * u, u, u, { fill: '#F6D28C', c: C.navy, w: 1.2 });
    s = D.g(layer2, { id: 'l2', hide: true }) + s;
    s += D.txt(320, 30, 'base: 4 × 3 = 12 cubes', { s: 16, c: C.blue, id: 'bl', hide: true });
    return B('Volume of a prism', s, [{ t: 'V = B × h' }, { t: 'V = 12 × 2 = 24 cubic units', c: C.green }], [
      'Volume counts the <b>cubes</b> that fit inside. Here is one layer: 4 by 3.',
      'The <b>base</b> has 4 × 3 = <b>12</b> cubes. That is B, the area of the base.',
      'Stack another layer. The height is 2 layers. V = B × h.',
      '12 × 2 = <b>24 cubic units</b>.'], { th: 200, extra: { 1: { bl: { o: 1 } }, 2: { l2: { o: 1 } } } });
  }

  SB.unit({
    n: 7, title: 'Circles, Area, Surface Area and Volume', std: 'NC.7.G.4, G.6', std0: G4, sendUnit: '7-7', pagePre: 'Grade 7 · ',
    lessons: [
      { id: 'g7-7a', title: 'Circumference and area of a circle', std: G4, anim: circAnim(),
        hook: 'How far does a bike wheel roll in one turn? Circles have the answer!',
        big: '<b>Circumference</b> (around): C = πd. <b>Area</b> (inside): A = πr². Use 3.14 for π. The diameter is 2 times the radius.',
        words: [['Radius (r)', 'center to edge'], ['Diameter (d)', 'across through the center, 2r'], ['π', 'about 3.14']],
        watch: 'r² means r × r, not r × 2. And the area uses the RADIUS.',
        walk: { prob: 'A circle has diameter 6 cm. Find its area.', steps: [
          { q: 'Area uses the radius. r = ?', ch: ['3 cm', ['6 cm', '6 is the diameter.', 'Radius is half of what?'], ['12 cm', 'That is 2 × 6. Take half.', 'Half or double?']], ln: 'r = 3' },
          { q: 'r² = ?', ch: ['9', ['6', 'r² is 3 × 3, not 3 × 2.', 'What is 3 × 3?']], ln: 'A = 3.14 × 9' },
          { q: '3.14 × 9 = ?', ch: ['28.26 cm²', ['18.84 cm²', 'That is 3.14 × 6, the circumference.', 'Which formula?']], ln: 'A = 28.26 cm²' }] },
        checks: [
          { id: 'g77c1', std: G4, q: 'Find the circumference: diameter 10 in. Use 3.14.', ans: 31.4, unit: 'in', hint: '3.14 × 10', miss: [[78.5, 'That is the area. Use C = πd.', 'Around or inside?'], [62.8, 'Use the diameter once: πd.', 'Did you double it?']], sol: ['C = 3.14 × 10 = 31.4'] },
          { id: 'g77c2', std: G4, q: 'Find the area: radius 10 m. Use 3.14.', ans: 314, unit: 'm²', hint: '3.14 × 10 × 10', miss: [[62.8, 'That is 3.14 × 20. Square the radius: 10 × 10.', 'What is r²?'], [31.4, 'Square the radius.', 'What is 10 × 10?']], sol: ['A = 3.14 × 100 = 314'] }
        ],
        can: 'find the circumference and area of a circle.',
        recap: ['C = πd (around)', 'A = πr² (inside)', 'd = 2r', 'π ≈ 3.14'] },

      { id: 'g7-7b', title: 'Volume of a prism', std: G6, anim: volAnim(),
        hook: 'How many sugar cubes fit in a box? Let\'s count them the smart way!',
        big: '<b>Volume = B × h</b>: the area of the base times the height. For a box, V = length × width × height. Volume is in <b>cubic units</b>.',
        words: [['Volume', 'space inside, in cubic units'], ['Base (B)', 'the area of the bottom shape'], ['Prism', 'a 3-D shape with the same shape all the way through']],
        watch: 'Volume is cubic units (cm³). Area is square units (cm²).',
        walk: { prob: 'A box is 5 cm long, 4 cm wide and 3 cm tall. Find its volume.', steps: [
          { q: 'Find B, the base area: 5 × 4.', ch: ['20 cm²', ['9 cm²', 'Multiply, do not add.', 'What is 5 × 4?']], ln: 'B = 20' },
          { q: 'V = B × h = 20 × 3', ch: ['60 cm³', ['23 cm³', 'Multiply, do not add.', 'What is 20 × 3?'], ['60 cm²', 'Volume uses CUBIC units.', 'Square or cubic?']], ln: 'V = 60 cm³' }] },
        checks: [
          { id: 'g77c3', std: G6, q: 'A box is 6 × 2 × 5. What is its volume?', ans: 60, hint: '6 × 2 × 5', miss: [[13, 'Multiply, do not add.', 'What is 6 × 2 × 5?'], [12, 'Multiply by the height too.', 'Did you use all 3 numbers?']], sol: ['6 × 2 = 12', '12 × 5 = 60'] },
          { id: 'g77c4', std: G6, q: 'A prism has base area 15 in² and height 4 in. Its volume is…', keep: 1, ch: ['60 in³', ['19 in³', 'Multiply B × h.', 'Add or multiply?'], ['60 in²', 'Volume is cubic units.', 'Square or cubic?']], hint: 'V = B × h' }
        ],
        can: 'find the volume of a prism.',
        recap: ['V = B × h', 'Box: l × w × h', 'Cubic units'] }
    ],
    practice: [
      { id: 'g77p1', std: G4, q: 'Circumference: diameter 4 cm. Use 3.14.', ans: 12.56, hint: '3.14 × 4', miss: [[50.24, 'That squares 4. Use C = πd.', 'Around or inside?'], [25.12, 'Use the diameter once.', 'Did you double it?']], sol: ['3.14 × 4 = 12.56'] },
      { id: 'g77p2', std: G4, q: 'Circumference: radius 5 ft. Use 3.14.', ans: 31.4, hint: 'd = 10. C = 3.14 × 10', miss: [[15.7, 'Double the radius to get the diameter.', 'd = ?'], [78.5, 'That is the area.', 'Around or inside?']], sol: ['d = 10', 'C = 31.4'] },
      { id: 'g77p3', std: G4, q: 'Area: radius 3 in. Use 3.14.', ans: 28.26, hint: '3.14 × 3 × 3', miss: [[18.84, 'That is 3.14 × 6. Square the radius.', 'What is 3 × 3?'], [9.42, 'Square the radius.', 'What is r²?']], sol: ['3.14 × 9 = 28.26'] },
      { id: 'g77p4', std: G4, q: 'Area: diameter 4 m. Use 3.14.', keep: 1, ch: ['12.56 m²', ['50.24 m²', 'Use the radius (2), not the diameter.', 'r = ?'], ['6.28 m²', 'Square the radius: 2 × 2.', 'What is 2²?']], hint: 'r = 2. A = 3.14 × 4.' },
      { id: 'g77p5', std: G6, q: 'A box is 3 × 4 × 5. Volume?', ans: 60, hint: '3 × 4 × 5', miss: [[12, 'Multiply by the height too.', 'Used all 3?'], [47, 'Multiply, do not add.', 'What does volume do?']], sol: ['3 × 4 × 5 = 60'] },
      { id: 'g77p6', std: G6, q: 'A cube has 3 cm edges. Volume in cm³?', ans: 27, hint: '3 × 3 × 3', miss: [[9, 'Use 3 three times.', '3 × 3 × 3 = ?'], [18, 'Multiply, not 6 × 3.', 'What is 3 × 3 × 3?']], sol: ['3 × 3 × 3 = 27'] },
      { id: 'g77p7', std: G6, q: 'A prism has base area 12 ft² and height 7 ft. Volume in ft³?', ans: 84, hint: '12 × 7', miss: [[19, 'Multiply, do not add.', 'B × h?']], sol: ['12 × 7 = 84'] },
      { id: 'g77p8', std: G6, q: 'A rectangle is 8 m by 5 m. What is its area?', keep: 1, ch: ['40 m²', ['26 m²', 'That is the perimeter.', 'Area or distance around?'], ['13 m²', 'Multiply, do not add.', 'What is 8 × 5?']], hint: 'A = l × w' }
    ]
  });
})();
