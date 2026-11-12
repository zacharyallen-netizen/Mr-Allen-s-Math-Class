/* Skill Builders · Unit 4 · Angle Relationships (NC.8.G.5) · Score 3 core skills */
(function () {
  var D = SB.D, C = SB.C, STD = 'NC.8.G.5', R = Math.PI / 180;

  /* parallel lines cut by a transversal: angles 1-4 at the top crossing, 5-8 at the bottom.
     th = the acute angle (degrees). Angles 2, 3, 6, 7 = th; angles 1, 4, 5, 8 = 180 − th. */
  function trans(o) {
    o = o || {}; var th = o.th || 65, W = o.w || 360, H = o.h || 230, y1 = 75, y2 = 160, cx = W / 2;
    var dx = (y2 - y1) / 2 / Math.tan(th * R), p1 = [cx + dx, y1], p2 = [cx - dx, y2];
    var ext = 60, ux = Math.cos(th * R), uy = -Math.sin(th * R);
    var s = D.arrowDefs();
    s += D.line(16, y1, W - 16, y1, { w: 2.2 }) + D.line(16, y2, W - 16, y2, { w: 2.2 });
    s += D.path('M' + (W - 46) + ',' + (y1 - 6) + ' l8,6 l-8,6', { w: 2.2 }) + D.path('M' + (W - 46) + ',' + (y2 - 6) + ' l8,6 l-8,6', { w: 2.2 });
    s += D.line(p2[0] - ux * ext, p2[1] - uy * ext, p1[0] + ux * ext, p1[1] + uy * ext, { w: 2.2, c: C.teal });
    var dirs = { 2: [0, th], 1: [th, 180], 3: [180, 180 + th], 4: [180 + th, 360] };
    function at(nb) { var base = nb > 4 ? nb - 4 : nb, P = nb > 4 ? p2 : p1, d = dirs[base]; return { P: P, d: d, mid: (d[0] + d[1]) / 2 }; }
    (o.hl || []).forEach(function (h) { var nb = h[0] || h, col = h[1] || C.gold, a = at(nb); s += D.arc(a.P[0], a.P[1], 22, a.d[0], a.d[1], { c: col, w: 3, fill: col === C.gold ? 'rgba(224,168,0,.18)' : col + '22', id: o.ids ? 'h' + nb : '', hide: !!o.ids }); });
    for (var nb = 1; nb <= 8; nb++) {
      var lab = (o.lab || {})[nb]; if (lab == null && !o.nums) continue;
      var a = at(nb), r = (lab && String(lab).length > 2) ? 40 : 34, t = D.ray(a.P[0], a.P[1], a.mid, r);
      var txt = lab != null ? lab : String(nb), col = /°|x|\?/.test(txt) ? C.navy : C.gray;
      s += D.txt(t[0], t[1] + 5, txt, { s: /°|x|\?/.test(txt) ? 15 : 13, c: col, mono: /°/.test(txt), id: o.ids ? 'n' + nb : '', w: 700 });
    }
    return D.svg(W, H, s, 'two parallel lines cut by a transversal');
  }
  /* triangle with base angles A (left) and B (right), drawn to scale */
  function tri(A, B, o) {
    o = o || {}; var W = o.w || 360, H = o.h || 210, x0 = 40, x1 = o.ext ? W - 110 : W - 40, y = H - 30;
    var tA = Math.tan(A * R), tB = Math.tan(B * R), base = x1 - x0, xa = A === 90 ? x0 : x0 + base * tB / (tA + tB), ya = A === 90 ? y - base * tB : y - (xa - x0) * tA;
    if (ya < 20) { var k = (y - 20) / (y - ya); xa = x0 + (xa - x0) * k; x1 = x0 + base * k; ya = 20; }
    var s = D.poly([[x0, y], [x1, y], [xa, ya]], { w: 2.4, fill: '#F7F9FE' });
    var lab = o.lab || [A + '°', B + '°', (180 - A - B) + '°'];
    s += D.arc(x0, y, 26, 0, A, { c: C.blue, w: 2.5 }) + D.arc(x1, y, 26, 180 - B, 180, { c: C.purple, w: 2.5 });
    var C3 = 180 - A - B, apexDirL = 180 + A, apexDirR = 360 - B;
    s += D.arc(xa, ya, 22, apexDirL > apexDirR ? apexDirR : apexDirL, apexDirL > apexDirR ? apexDirL : apexDirR, { c: C.teal, w: 2.5 });
    var pa = D.ray(x0, y, A / 2, 48), pb = D.ray(x1, y, 180 - B / 2, 48), pc = D.ray(xa, ya, 270 + (B - A) / 2, 44);
    s += D.txt(pa[0] + 6, pa[1] + 5, lab[0], { s: 15, mono: true, c: C.blue }) + D.txt(pb[0] - 6, pb[1] + 5, lab[1], { s: 15, mono: true, c: C.purple }) + D.txt(pc[0], pc[1] + 8, lab[2], { s: 15, mono: true, c: C.teal });
    if (o.ext) {
      s += D.line(x1, y, W - 14, y, { w: 2.2, dash: '0' });
      s += D.arc(x1, y, 30, 0, 180 - B, { c: C.gold, w: 3, fill: 'rgba(224,168,0,.15)' });
      var pe = D.ray(x1, y, (180 - B) / 2, 58); s += D.txt(pe[0] + 8, pe[1] + 4, o.extLab || '?', { s: 15, mono: true, c: '#8A6100' });
    }
    if (o.right) s += D.rightMark(x0, y, 0, 16);
    return D.svg(W, H, s, 'triangle');
  }
  /* two crossing lines with angle a at the right */
  function cross(a, lab) {
    var W = 340, H = 200, cx = 170, cy = 100, L = 150, s = '';
    var p = D.ray(cx, cy, a / 2, L), q = D.ray(cx, cy, -a / 2, L), p2 = D.ray(cx, cy, 180 + a / 2, L), q2 = D.ray(cx, cy, 180 - a / 2, L);
    s += D.line(p2[0], p2[1], p[0], p[1], { w: 2.4 }) + D.line(q2[0], q2[1], q[0], q[1], { w: 2.4 });
    var regs = [[-a / 2, a / 2], [a / 2, 180 - a / 2], [180 - a / 2, 180 + a / 2], [180 + a / 2, 360 - a / 2]];
    (lab || []).forEach(function (t, i) { if (t == null) return; var m = (regs[i][0] + regs[i][1]) / 2, P = D.ray(cx, cy, m, t.length > 3 ? 46 : 38); s += D.arc(cx, cy, 20, regs[i][0], regs[i][1], { c: i % 2 ? C.purple : C.gold, w: 2.5 }) + D.txt(P[0], P[1] + 5, t, { s: 15, mono: true, c: C.navy }); });
    return D.svg(W, H, s, 'two lines crossing');
  }

  /* ---- animations ---- */
  function pairsAnim() {
    var W = 640, H = 300, cx = 230, cy = 150, a = 50, L = 190, s = '';
    var p = D.ray(cx, cy, a / 2, L), q = D.ray(cx, cy, -a / 2, L), p2 = D.ray(cx, cy, 180 + a / 2, L), q2 = D.ray(cx, cy, 180 - a / 2, L);
    s += D.line(p2[0], p2[1], p[0], p[1], { w: 2.6 }) + D.line(q2[0], q2[1], q[0], q[1], { w: 2.6 });
    var regs = [[-a / 2, a / 2], [a / 2, 180 - a / 2], [180 - a / 2, 180 + a / 2]], labs = ['50°', '130°', '50°'], cols = [C.gold, C.purple, C.gold];
    regs.forEach(function (r, i) { var m = (r[0] + r[1]) / 2, P = D.ray(cx, cy, m, i === 1 ? 50 : 56); s += D.g(D.arc(cx, cy, 28, r[0], r[1], { c: cols[i], w: 3, fill: cols[i] + '26' }) + D.txt(P[0], P[1] + 6, labs[i], { s: 18, mono: true }), { id: 'a' + i, hide: true }); });
    s += D.txt(480, 70, '', { s: 17, c: C.navy, id: 't1' }) + D.txt(480, 100, '', { s: 17, c: C.navy, id: 't2' });
    // complementary corner
    var cx2 = 470, cy2 = 250;
    s += D.g(D.line(cx2, cy2, cx2 + 130, cy2, { w: 2.4 }) + D.line(cx2, cy2, cx2, cy2 - 110, { w: 2.4 }) + D.line(cx2, cy2, cx2 + 110 * Math.cos(35 * R), cy2 - 110 * Math.sin(35 * R), { w: 2.4 }) + D.rightMark(cx2, cy2, 0, 14) +
      D.txt(cx2 + 64, cy2 - 14, '35°', { s: 14, mono: true }) + D.txt(cx2 + 24, cy2 - 62, '55°', { s: 14, mono: true }) + D.txt(cx2 + 60, cy2 + 26, '35 + 55 = 90', { s: 14, c: C.green }), { id: 'comp', hide: true });
    return { w: W, h: H, svg: s, title: 'Angle pairs', frames: [
      { cap: 'Two lines cross and make <b>four angles</b>.', set: {} },
      { cap: 'This angle is <b>50°</b>.', set: { a0: { o: 1 } } },
      { cap: '<b>Vertical angles</b> are across from each other. They are <b>equal</b>: the opposite angle is also 50°.', set: { a2: { o: 1 }, t1: { txt: 'Vertical angles: equal' } } },
      { cap: 'Angles side by side on a straight line add to <b>180°</b> (supplementary): 180 − 50 = <b>130°</b>.', set: { a1: { o: 1 }, t2: { txt: 'On a line: add to 180°' } } },
      { cap: '<b>Complementary</b> angles fill a right angle: they add to <b>90°</b>. Tip: <b>C</b>omplementary = <b>C</b>orner (90°), <b>S</b>upplementary = <b>S</b>traight (180°).', set: { comp: { o: 1 } } }
    ] };
  }
  function transAnim() {
    var th = 70, fig = trans({ th: th, w: 640, h: 260, nums: true, ids: true, hl: [[2, C.gold], [6, C.gold], [3, C.blue], [5, C.purple]] });
    var svg = fig.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    svg += D.txt(320, 248, '', { s: 16, id: 'cap2', c: C.navy });
    return { w: 640, h: 260, svg: svg, title: 'Parallel lines and a transversal', frames: [
      { cap: 'Two <b>parallel</b> lines (arrows show they never meet) are cut by a <b>transversal</b>. That makes 8 angles.', set: {} },
      { cap: '<b>Corresponding angles</b> sit in the same corner at each crossing, like ∠2 and ∠6. They are <b>equal</b>.', set: { h2: { o: 1 }, h6: { o: 1 }, cap2: { txt: '∠2 = ∠6 = 70°' } } },
      { cap: '<b>Alternate interior angles</b> are between the lines, on opposite sides of the transversal, like ∠3 and ∠6. <b>Equal</b>.', set: { h3: { o: 1 }, h2: { o: .15 }, cap2: { txt: '∠3 = ∠6 = 70°' } } },
      { cap: '<b>Same-side interior angles</b>, like ∠3 and ∠5, add to <b>180°</b>: 70° + 110° = 180°.', set: { h5: { o: 1 }, h6: { o: .15 }, cap2: { txt: '∠3 + ∠5 = 180°' } } },
      { cap: 'Quick check: each angle is either <b>equal</b> to 70° or <b>adds with it to 180°</b> (110°). Small-looking angles match small ones.', set: { h2: { o: 1 }, h6: { o: 1 }, cap2: { txt: 'small = 70°, big = 110°' } } }
    ] };
  }
  function sumAnim() {
    var A = 50, B = 60, Cc = 70, s = '';
    var tri0 = tri(A, B, { w: 330, h: 230 }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    s += D.g(tri0, {});
    var px = 470, py = 200, r = 70;
    s += D.line(px - 140, py, px + 140, py, { w: 2.4, id: 'ln', hide: true });
    s += D.arc(px, py, r, 0, A, { c: C.blue, w: 2, fill: 'rgba(29,78,216,.18)', id: 'w1', hide: true });
    s += D.arc(px, py, r, A, A + Cc, { c: C.teal, w: 2, fill: 'rgba(15,118,110,.18)', id: 'w3', hide: true });
    s += D.arc(px, py, r, A + Cc, 180, { c: C.purple, w: 2, fill: 'rgba(109,40,217,.18)', id: 'w2', hide: true });
    s += D.txt(px, 60, '50 + 70 + 60 = 180', { s: 20, mono: true, c: C.green, id: 'sum', hide: true });
    return { w: 640, h: 240, svg: s, title: 'The three angles of a triangle', frames: [
      { cap: 'A triangle has three inside angles: 50°, 60° and 70°.', set: {} },
      { cap: 'Imagine tearing off the three corners and putting them side by side.', set: { ln: { o: 1 }, w1: { o: 1 } } },
      { cap: 'Add the 70° corner next to it…', set: { w3: { o: 1 } } },
      { cap: '…and the 60° corner. Together they make a <b>straight line</b>.', set: { w2: { o: 1 } } },
      { cap: 'A straight line is 180°. The three angles of <b>every</b> triangle add to <b>180°</b>.', set: { sum: { o: 1 } } }
    ] };
  }
  function extAnim() {
    var s = tri(50, 70, { w: 640, h: 250, ext: true, extLab: '' }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    s += D.txt(560, 120, '', { s: 22, mono: true, c: '#8A6100', id: 'ex' });
    s += D.txt(320, 30, '', { s: 17, c: C.green, id: 'eq' });
    return { w: 640, h: 250, svg: s, title: 'The exterior angle', frames: [
      { cap: 'Stretch one side of the triangle. The new angle outside is an <b>exterior angle</b>.', set: {} },
      { cap: 'The two <b>far</b> inside angles (not touching it) are 50° and 60°.', set: { eq: { txt: 'far angles: 50° and 60°' } } },
      { cap: 'The exterior angle <b>equals the two far angles added</b>: 50 + 60 = <b>110°</b>.', set: { ex: { txt: '110°' }, eq: { txt: 'exterior = 50 + 60 = 110°' } } },
      { cap: 'Check: the exterior angle and the 70° next to it are on a straight line: 110 + 70 = 180 ✓.', set: { eq: { txt: '110 + 70 = 180 ✓' } } }
    ] };
  }

  function num(id, q, ans, fig, hint, miss, sol, extra) { var o = { id: id, std: STD, q: q, ans: ans, unit: '°', fig: fig, hint: hint, miss: miss || [], sol: sol }; for (var k in extra || {}) o[k] = extra[k]; return o; }
  function sub180(id, q, a, fig) { return num(id, q, 180 - a, fig, 'Supplementary angles add to 180°. Subtract: 180 − ' + a + '.', [[90 - a, 'You used 90. Supplementary angles add to 180°.', 'Straight line or corner?'], [180 + a, 'You added. Subtract from 180.', 'What plus ' + a + ' makes 180?'], [a, 'These angles are not equal. They add to 180°.', 'Is the pair equal or supplementary?']], [{ ln: '180 − ' + a + ' = ' + (180 - a) + '°' }]); }

  SB.unit({
    n: 4, title: 'Angle Relationships', std: 'NC.8.G.5', std0: STD,
    lessons: [
      { id: '4a', title: 'Angle pairs', std: STD, anim: pairsAnim(),
        big: 'Angles come in pairs that follow rules. <b>Complementary</b> angles add to <b>90°</b>. <b>Supplementary</b> angles add to <b>180°</b>. <b>Vertical</b> angles (across from each other where two lines cross) are <b>equal</b>.',
        words: [['Complementary', 'two angles that add to 90° (a corner)'], ['Supplementary', 'two angles that add to 180° (a straight line)'], ['Vertical angles', 'across from each other at a crossing: equal'], ['Adjacent', 'next to each other, sharing a side']],
        fig: cross(40, ['40°', '140°', '40°', '140°']),
        watch: 'Mixing up 90 and 180? <b>C</b>omplementary = <b>C</b>orner = 90°. <b>S</b>upplementary = <b>S</b>traight = 180°.',
        walk: { prob: 'Two angles are supplementary. One is 110°. Find the other.', steps: [
          { q: 'Supplementary angles add to…', ch: ['180°', ['90°', '90° is for complementary (a corner).', 'S for supplementary, S for…?'], ['360°', '360° is a full turn.', 'What does a straight line measure?']], ln: '? + 110 = 180' },
          { q: 'How do we find the missing angle?', ch: ['Subtract: 180 − 110', ['Add: 180 + 110', 'The missing angle plus 110 makes 180. Adding makes it too big.', 'What number plus 110 is 180?'], ['Divide: 180 ÷ 110', 'Supplementary angles are added together, not multiplied.', 'Which operation undoes adding 110?']], ln: '180 − 110 = 70' },
          { q: 'The other angle is…', ch: ['70°', ['290°', 'That is 180 + 110.', 'Should it be smaller than 180?'], ['20°', 'That is 90 + ... check: 110 + 20 = 130, not 180.', 'What is 180 − 110?']], ln: 'The other angle = 70°' }] },
        checks: [
          num('u4c1', 'Find the <b>complement</b> of 62°.', 28, '', 'Complementary angles add to 90°: 90 − 62.', [[118, 'That is the supplement (180 − 62). Complement means 90.', 'Corner or straight line?'], [152, 'You added. Subtract from 90.', 'What plus 62 makes 90?']], [{ ln: '90 − 62 = 28°' }]),
          sub180('u4c2', 'Find the <b>supplement</b> of 145°.', 145, ''),
          num('u4c3', 'Two lines cross. Find <b>x</b>.', 115, cross(65, ['65°', 'x', null, '115°']), 'x is across from 115°. Vertical angles are equal.', [[65, '65° is next to x, not across from it.', 'Which angle is across from x?'], [245, 'Vertical angles are equal. You do not add or subtract.', 'Is x across from 115°?']], [{ ln: 'x and 115° are vertical angles → equal' }, { ln: 'x = 115°' }])
        ],
        can: 'find a missing angle using complementary, supplementary and vertical angles.',
        recap: ['Corner → add to 90°', 'Straight line → add to 180°', 'Across a crossing → equal'] },

      { id: '4b', title: 'Parallel lines cut by a transversal', std: STD, anim: transAnim(),
        big: 'When a transversal cuts two <b>parallel</b> lines, every angle is either <b>equal</b> to a given angle or <b>adds with it to 180°</b>. Equal pairs: <b>corresponding, alternate interior, alternate exterior, vertical</b>. Same-side interior angles add to <b>180°</b>.',
        words: [['Transversal', 'a line that crosses two other lines'], ['Corresponding', 'same corner at each crossing: equal'], ['Alternate interior', 'between the lines, opposite sides: equal'], ['Same-side interior', 'between the lines, same side: add to 180°']],
        fig: trans({ th: 60, nums: true }),
        watch: 'Look at the picture: a small-looking angle can only equal another small-looking angle.',
        walk: { prob: 'Lines are parallel. ∠2 = 65°. Find ∠5.', fig: trans({ th: 65, lab: { 2: '65°', 5: '?' }, nums: false, hl: [[2, C.gold], [5, C.purple]] }), steps: [
          { q: 'Is ∠5 small-looking (acute) or big-looking (obtuse)?', ch: ['Big (obtuse)', ['Small (acute)', 'Look at the picture: ∠5 opens wider than a right angle.', 'Is ∠5 bigger than a square corner?']], ln: '∠2 is small, ∠5 is big' },
          { q: 'So ∠5 and ∠2 are…', ch: ['Supplementary: they add to 180°', ['Equal', 'A big angle cannot equal a small angle.', 'Can 65° be the measure of a big angle?'], ['Complementary: they add to 90°', 'There is no right angle here.', 'With parallel lines, the pairs are equal or add to…?']], ln: '∠5 + 65° = 180°' },
          { q: 'Find ∠5.', ch: ['115°', ['65°', 'That would make ∠5 equal to ∠2.', 'Is ∠5 equal or supplementary to ∠2?'], ['25°', 'That uses 90.', 'Do the angles add to 90 or 180?']], ln: '∠5 = 180 − 65 = 115°' }] },
        checks: [
          num('u4c4', 'The lines are parallel. Find <b>x</b>.', 70, trans({ th: 70, lab: { 2: '70°', 6: 'x' }, hl: [[2, C.gold], [6, C.purple]] }), 'The two marked angles are in the same corner at each crossing: corresponding angles.', [[110, 'These are corresponding angles: same corner, so they are equal.', 'Are both angles small-looking?'], [20, 'There is no right angle. Corresponding angles are equal.', 'Same corner → equal or add to 180?']], [{ ln: 'corresponding angles → equal' }, { ln: 'x = 70°' }]),
          { id: 'u4c5', std: STD, q: 'What kind of pair are ∠3 and ∠6?', fig: trans({ th: 60, nums: true, hl: [[3, C.gold], [6, C.purple]] }), ch: ['Alternate interior angles', ['Corresponding angles', 'Corresponding angles are in the same corner at each crossing. ∠3 and ∠6 are on opposite sides.', 'Are they on the same side of the transversal?'], ['Same-side interior angles', '∠3 is on the left of the transversal and ∠6 is on the right.', 'Same side or opposite sides?'], ['Vertical angles', 'Vertical angles share the same crossing point. These are at different crossings.', 'Do they touch the same point?']], hint: 'Both are between the parallel lines. Are they on the same side of the transversal?' },
          sub180('u4c6', 'The lines are parallel. ∠4 = 120°. Find ∠6 (a same-side interior angle).', 120, trans({ th: 60, lab: { 4: '120°', 6: '?' }, hl: [[4, C.gold], [6, C.purple]] }))
        ],
        can: 'name angle pairs made by a transversal and find missing angles.',
        recap: ['Corresponding, alternate interior, alternate exterior, vertical → equal', 'Same-side interior, or side by side on a line → add to 180°', 'Small angles match small; small + big = 180°'] },

      { id: '4c', title: 'Angles in a triangle', std: STD, anim: sumAnim(),
        big: 'The three inside angles of <b>any</b> triangle add to <b>180°</b>. To find a missing angle: add the two you know, then subtract from 180.',
        words: [['Interior angle', 'an angle inside the triangle'], ['Right triangle', 'a triangle with one 90° angle (a square corner)']],
        fig: tri(45, 70),
        watch: 'Use 180°, not 360°. 360° is a full circle (or a four-sided shape).',
        walk: { prob: 'A triangle has angles 50° and 60°. Find the third angle.', fig: tri(50, 60, { lab: ['50°', '60°', 'x'] }), steps: [
          { q: 'The three angles of a triangle add to…', ch: ['180°', ['360°', '360° is a full circle.', 'Tear off the corners: what do they make?'], ['90°', '90° is one right angle.', 'What does a straight line measure?']], ln: '50 + 60 + x = 180' },
          { q: 'Add the angles you know.', ch: ['50 + 60 = 110', ['50 + 60 = 100', 'Check the adding: 50 + 60 = 110.', 'What is 50 + 60?'], ['50 × 60 = 3000', 'Angles are added, not multiplied.', 'Add or multiply?']], ln: '110 + x = 180' },
          { q: 'Find x.', ch: ['180 − 110 = 70°', ['180 + 110 = 290°', 'Subtract the known angles from 180.', 'What plus 110 makes 180?'], ['360 − 110 = 250°', 'Use 180 for a triangle.', 'What do the three angles add to?']], ln: 'x = 70°' }] },
        checks: [
          num('u4c7', 'A triangle has angles 45° and 55°. Find the third angle.', 80, tri(45, 55, { lab: ['45°', '55°', '?'] }), 'Add 45 + 55. Subtract the sum from 180.', [[260, 'You used 360. A triangle adds to 180.', 'What do the three angles of a triangle add to?'], [100, 'That is 45 + 55. Now subtract it from 180.', 'What is 180 − 100?']], [{ ln: '45 + 55 = 100' }, { ln: '180 − 100 = 80°' }]),
          num('u4c8', 'A right triangle has one angle of 35°. Find the other small angle.', 55, tri(90, 35, { lab: ['', '35°', '?'], right: true }), 'A right angle is 90°. 90 + 35 + ? = 180.', [[145, 'You forgot the 90° right angle.', 'What are the three angles?'], [235, 'You used 360. A triangle adds to 180.', 'What do the angles add to?']], [{ ln: '90 + 35 = 125' }, { ln: '180 − 125 = 55°' }])
        ],
        can: 'find a missing angle in a triangle.',
        recap: ['Add the two angles you know', 'Subtract from 180°'] },

      { id: '4d', title: 'The exterior angle of a triangle', std: STD, anim: extAnim(),
        big: 'An <b>exterior angle</b> is outside the triangle, made by stretching one side. It <b>equals the two far inside angles added together</b>.',
        words: [['Exterior angle', 'the angle outside the triangle, next to one inside angle'], ['Remote (far) interior angles', 'the two inside angles that do not touch the exterior angle']],
        fig: tri(40, 75, { ext: true, lab: ['40°', '75°', '65°'], extLab: '105°' }),
        watch: 'Use the two <b>far</b> angles, not the angle right next to the exterior angle.',
        walk: { prob: 'The far inside angles are 40° and 65°. Find the exterior angle.', fig: tri(40, 75, { ext: true, lab: ['40°', '', '65°'], extLab: '?' }), steps: [
          { q: 'Which angles do we use?', ch: ['The two far inside angles: 40° and 65°', ['The angle next to the exterior angle', 'The angle next to it adds to 180 with it. The rule uses the two far angles.', 'Which angles do not touch the exterior angle?'], ['All three inside angles', 'All three add to 180. The rule uses just the two far ones.', 'Which two are far away?']], ln: 'exterior = 40 + 65' },
          { q: 'Add them.', ch: ['105°', ['25°', 'That is 65 − 40. The rule adds.', 'Add or subtract?'], ['75°', '75° is the inside angle next to it.', 'What is 40 + 65?']], ln: 'exterior = 105°' }] },
        checks: [
          num('u4c9', 'The far inside angles are 40° and 65°. Find the exterior angle.', 105, '', 'Exterior angle = far angle + far angle.', [[75, '75° is the inside angle next to it (180 − 105).', 'Add the two far angles.'], [25, 'You subtracted. Add the two far angles.', 'Add or subtract?']], [{ ln: '40 + 65 = 105°' }]),
          num('u4c10', 'Find the exterior angle <b>x</b>.', 110, tri(50, 70, { ext: true, lab: ['50°', '70°', '60°'], extLab: 'x' }), 'The far angles are the two that do not touch x.', [[70, '70° is next to x. x and 70° add to 180°.', 'Which two angles are far from x?'], [120, 'That is 50 + 70. 70° touches x. Use the two far angles.', 'Which two angles do not touch x?']], [{ ln: 'far angles: 50° and 60°' }, { ln: 'x = 50 + 60 = 110°' }])
        ],
        can: 'find an exterior angle of a triangle.',
        recap: ['Find the two far inside angles', 'Add them'] }
    ],
    practice: [
      num('u4p1', 'Find the <b>complement</b> of 28°.', 62, '', 'Complementary → add to 90°.', [[152, 'That is the supplement (180 − 28).', 'Complement: corner or straight?'], [118, 'You added 90 + 28. Subtract.', 'What plus 28 makes 90?']], [{ ln: '90 − 28 = 62°' }]),
      sub180('u4p2', 'Find the <b>supplement</b> of 73°.', 73, ''),
      num('u4p3', 'Two lines cross. Find <b>x</b>.', 115, cross(65, [null, '115°', null, 'x']), 'x is across from 115°.', [[65, 'x and 115° are across from each other: equal.', 'Vertical angles are equal or add to 180?']], [{ ln: 'vertical angles → equal' }, { ln: 'x = 115°' }]),
      num('u4p4', 'The lines are parallel. Find <b>x</b>.', 70, trans({ th: 70, lab: { 3: '70°', 7: 'x' }, hl: [[3, C.gold], [7, C.purple]] }), 'Same corner at each crossing → corresponding → equal.', [[110, 'Corresponding angles are equal.', 'Are both angles small-looking?']], [{ ln: 'corresponding → equal' }, { ln: 'x = 70°' }]),
      num('u4p5', 'The lines are parallel. Find <b>x</b>.', 55, trans({ th: 55, lab: { 6: '55°', 3: 'x' }, hl: [[6, C.gold], [3, C.purple]] }), 'Between the lines, opposite sides → alternate interior → equal.', [[125, 'Alternate interior angles are equal.', 'Are both angles small-looking?']], [{ ln: 'alternate interior → equal' }, { ln: 'x = 55°' }]),
      num('u4p6', 'The lines are parallel. Find <b>x</b>.', 70, trans({ th: 70, lab: { 4: '110°', 6: 'x' }, hl: [[4, C.gold], [6, C.purple]] }), 'Same-side interior angles add to 180°.', [[110, 'One angle is big and one is small, so they are not equal.', 'Equal or add to 180°?'], [20, 'Use 180, not 90.', 'What do same-side interior angles add to?']], [{ ln: 'same-side interior → add to 180°' }, { ln: 'x = 180 − 110 = 70°' }]),
      num('u4p7', 'A triangle has angles 45° and 55°. Find the third angle.', 80, tri(45, 55, { lab: ['45°', '55°', '?'] }), '45 + 55 + ? = 180', [[100, 'That is 45 + 55. Subtract it from 180.', 'What is 180 − 100?'], [260, 'A triangle adds to 180, not 360.', 'What do the angles add to?']], [{ ln: '45 + 55 = 100' }, { ln: '180 − 100 = 80°' }],
        { steps: [{ q: 'The angles of a triangle add to…', ch: ['180°', ['360°', 'That is a full circle.', 'What do the torn corners make?']], ln: '45 + 55 + x = 180' }, { q: 'Add the known angles.', ch: ['100', ['90', '45 + 55 = 100.', 'What is 45 + 55?']], ln: '100 + x = 180' }, { q: 'Find x.', ch: ['80°', ['280°', 'Subtract from 180.', 'What plus 100 is 180?']], ln: 'x = 80°' }] }),
      num('u4p8', 'A right triangle has one angle of 35°. Find the other small angle.', 55, tri(90, 35, { lab: ['', '35°', '?'], right: true }), 'Do not forget the 90° angle.', [[145, 'Include the 90° right angle.', 'What are all three angles?'], [235, 'Use 180.', 'Triangle total?']], [{ ln: '90 + 35 = 125' }, { ln: '180 − 125 = 55°' }]),
      num('u4p9', 'The far inside angles of a triangle are 40° and 65°. Find the exterior angle.', 105, '', 'Exterior = far + far.', [[75, '75° is the inside angle next to it.', 'Add the two far angles.'], [25, 'Add, do not subtract.', 'Add or subtract?']], [{ ln: '40 + 65 = 105°' }]),
      { id: 'u4p10', std: STD, q: 'What kind of pair are ∠1 and ∠8?', fig: trans({ th: 60, nums: true, hl: [[1, C.gold], [8, C.purple]] }), ch: ['Alternate exterior angles', ['Alternate interior angles', 'Interior means between the parallel lines. ∠1 and ∠8 are outside.', 'Are they between the lines or outside?'], ['Corresponding angles', 'Corresponding angles are in the same corner. These are on opposite sides.', 'Same side of the transversal?'], ['Same-side interior angles', 'They are outside the lines and on opposite sides.', 'Inside or outside?']], hint: 'Are they inside or outside the parallel lines? Same side or opposite sides of the transversal?' },
      { id: 'u4p11', std: STD, q: '<b>Find the mistake.</b> Ava wrote: "The supplement of 40° is 50°." What went wrong?', wide: 1, ch: ['Ava used 90. Supplementary angles add to 180, so the answer is 140°.', ['Ava is right: 40 + 50 = 90.', 'Adding to 90 is complementary.', 'Supplementary: corner or straight line?'], ['It should be 320° because 360 − 40 = 320.', '360° is a full circle.', 'What does a straight line measure?'], ['It should be 40° because the angles are equal.', 'Supplementary angles add to 180. They are not always equal.', 'What do supplementary angles add to?']], hint: 'S for Supplementary, S for Straight.' }
    ]
  });
})();
