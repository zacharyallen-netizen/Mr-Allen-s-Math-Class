/* Skill Builders · Unit 7 · Statistics (NC.8.SP.1–4) · Score 3 core skills */
(function () {
  var D = SB.D, C = SB.C, SP1 = 'NC.8.SP.1', SP2 = 'NC.8.SP.2', SP3 = 'NC.8.SP.3', SP4 = 'NC.8.SP.4';
  /* scatter plot: pts in data units 0..10; axis labels */
  function scatter(pts, o) {
    o = o || {}; var W = o.w || 300, H = o.h || 230, x0 = 46, y0 = H - 36, w = W - 70, h = H - 56, mx = o.max || 10;
    var X = function (v) { return x0 + v / mx * w; }, Y = function (v) { return y0 - v / mx * h; };
    var s = D.arrowDefs();
    for (var i = 0; i <= mx; i += (o.step || 2)) { s += D.line(X(i), y0, X(i), y0 - h, { c: '#E6E9EF', w: 1 }) + D.line(x0, Y(i), x0 + w, Y(i), { c: '#E6E9EF', w: 1 }) + D.txt(X(i), y0 + 15, String(i), { s: 10, w: 500, c: C.gray }) + D.txt(x0 - 6, Y(i) + 4, String(i * (o.ys || 1)), { s: 10, w: 500, c: C.gray, a: 'end' }); }
    s += D.line(x0, y0, x0 + w + 8, y0, { w: 2, arrow: 'ah' }) + D.line(x0, y0, x0, y0 - h - 8, { w: 2, arrow: 'ah' });
    s += D.txt(x0 + w / 2, H - 4, o.xl || 'x', { s: 12, c: C.navy }) + '<text transform="translate(12,' + (y0 - h / 2) + ') rotate(-90)" text-anchor="middle" font-size="12" font-weight="600" fill="#1E2D4F">' + (o.yl || 'y') + '</text>';
    pts.forEach(function (p, k) { s += D.circ(X(p[0]), Y(p[1]), 5, { fill: p[2] || C.blue, id: o.ids ? 'd' + k : '', hide: !!o.ids }); if (p[3]) s += D.txt(X(p[0]) + 8, Y(p[1]) - 8, p[3], { s: 12, a: 'start', c: p[2] || C.navy }); });
    if (o.line) s += D.line(X(0), Y(o.line[1]), X(mx), Y(o.line[0] * mx + o.line[1]), { c: C.gold, w: 3, id: o.lineId, draw: !!o.lineId });
    return { svg: s, X: X, Y: Y, W: W, H: H };
  }
  function scatterSvg(pts, o) { var p = scatter(pts, o); return D.svg(p.W, p.H, p.svg, 'scatter plot'); }
  var POS = [[1, 2], [2, 2.6], [2.5, 3.8], [3.5, 4], [4, 5], [5, 5.4], [5.5, 6.6], [6.5, 7], [7, 7.8], [8, 8.4], [9, 9]];
  var NEG = [[1, 9], [2, 8.2], [3, 7.6], [3.5, 6.4], [4.5, 6], [5, 5], [6, 4.6], [7, 3.4], [7.5, 3], [8.5, 2.2], [9, 1.4]];
  var NONE = [[1, 5], [2, 8], [2.5, 2], [3.5, 6.5], [4, 3.5], [5, 8.5], [6, 1.5], [6.5, 5.5], [7.5, 7.5], [8, 3], [9, 6]];
  function twoWay(rows, cols, data, hl) {
    var t = '<table class="tbl"><tr><th></th>' + cols.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '<th>Total</th></tr>';
    var colT = cols.map(function () { return 0; }), all = 0;
    rows.forEach(function (r, i) {
      var rt = data[i].reduce(function (a, b) { return a + b; }, 0); all += rt;
      t += '<tr><th>' + r + '</th>' + data[i].map(function (v, j) { colT[j] += v; return '<td' + (hl && hl[0] === i && hl[1] === j ? ' style="background:#FFF6DB;font-weight:700"' : '') + '>' + v + '</td>'; }).join('') + '<td><b>' + rt + '</b></td></tr>';
    });
    return t + '<tr><th>Total</th>' + colT.map(function (v) { return '<td><b>' + v + '</b></td>'; }).join('') + '<td><b>' + all + '</b></td></tr></table>';
  }
  var DOGS = twoWay(['Boys', 'Girls'], ['Likes dogs', 'Does not'], [[12, 8], [15, 5]]);

  /* ---- animations ---- */
  function corrAnim() {
    var a = scatter(POS.concat([[8, 2, C.red]]), { w: 640, h: 300, ids: true, xl: 'hours practiced', yl: 'points scored' }), s = a.svg;
    s += D.line(a.X(1), a.Y(1.6), a.X(9.4), a.Y(9.4), { c: C.green, w: 3, dash: '6 6', id: 'tr', draw: true, arrow: 'ahgr' });
    s += D.circ(a.X(8), a.Y(2), 14, { fill: 'none', c: C.red, w: 2.5, id: 'ring', hide: true }) + D.txt(a.X(8) + 18, a.Y(2) + 5, 'outlier', { s: 14, c: C.red, a: 'start', id: 'ol', hide: true });
    var f = [{ cap: 'A <b>scatter plot</b> shows two things for each person: hours practiced (across) and points scored (up).', set: {} }];
    var on = {}; POS.forEach(function (p, k) { on['d' + k] = { o: 1 }; });
    f.push({ cap: 'Each dot is one person.', set: on });
    f.push({ cap: 'The dots go <b>up</b> from left to right: a <b>positive correlation</b>. More practice goes with more points.', set: { tr: { d: 1 } } });
    f.push({ cap: 'Dots close to a line = <b>strong</b>. Spread out = <b>weak</b>. These are close: strong.', set: {} });
    var o2 = { ring: { o: 1 }, ol: { o: 1 } }; o2['d' + POS.length] = { o: 1 };
    f.push({ cap: 'A dot far from the rest is an <b>outlier</b>.', set: o2 });
    f.push({ cap: 'Going <b>down</b> would be a negative correlation. No pattern means <b>no correlation</b>.', set: {} });
    return { w: 640, h: 300, svg: s, title: 'Scatter plots and correlation', frames: f };
  }
  function fitAnim() {
    var pts = [[1, 7], [2, 9.4], [3, 10.6], [4, 13.4], [5, 15], [6, 16.6]].map(function (p) { return [p[0], p[1] / 2]; });
    var a = scatter(pts, { w: 640, h: 300, ys: 2, line: [1, 2.5], lineId: 'fit', xl: 'hours studied', yl: 'quiz score' }), s = a.svg;
    // fit y = 2x + 5 in real units; chart halves y → plotted line slope 1, intercept 2.5
    s += D.line(a.X(6), a.Y(0), a.X(6), a.Y(8.5), { c: C.purple, w: 2, dash: '5 4', id: 'v', hide: true }) + D.line(a.X(0), a.Y(8.5), a.X(6), a.Y(8.5), { c: C.purple, w: 2, dash: '5 4', id: 'h', hide: true });
    s += D.txt(450, 60, 'y = 2x + 5', { s: 22, mono: true, c: '#8A6100', id: 'eq', hide: true }) + D.txt(450, 100, 'x = 6: 2(6) + 5 = 17', { s: 17, mono: true, id: 'pr', hide: true });
    return { w: 640, h: 300, svg: s, title: 'Line of best fit', frames: [
      { cap: 'Scores on a quiz and hours studied.', set: {} },
      { cap: 'Draw a <b>line of best fit</b>: a straight line through the middle of the dots, with about as many above as below.', set: { fit: { d: 1 } } },
      { cap: 'Its equation is <b>y = 2x + 5</b>. Slope 2: about 2 more points per hour. y-intercept 5: about 5 points with 0 hours.', set: { eq: { o: 1 } } },
      { cap: 'Predict for 6 hours: y = 2(6) + 5 = <b>17</b>.', set: { v: { o: 1 }, h: { o: 1 }, pr: { o: 1 } } },
      { cap: 'Predicting inside the data is <b>interpolation</b> (safer). Predicting far outside it is <b>extrapolation</b> (riskier).', set: {} }
    ] };
  }
  function tableAnim() {
    var s = '', x0 = 120, y0 = 40, cw = 120, rh = 44, data = [['', 'Likes dogs', 'Does not', 'Total'], ['Boys', '12', '8', '20'], ['Girls', '15', '5', '20'], ['Total', '27', '13', '40']];
    data.forEach(function (r, i) { r.forEach(function (v, j) { s += D.rect(x0 + j * cw - 60, y0 + i * rh, cw, rh, { fill: i === 0 || j === 0 ? '#EEF1F7' : '#fff', c: '#C9D0DC', w: 1 }) + D.txt(x0 + j * cw, y0 + i * rh + 28, v, { s: 16, mono: j > 0 && i > 0 }); }); });
    s += D.rect(x0 + cw - 60, y0 + rh, cw, rh, { c: C.gold, w: 4, id: 'j', hide: true });
    s += D.rect(x0 + 3 * cw - 60, y0 + rh, cw, rh, { c: C.blue, w: 4, id: 'm', hide: true });
    s += D.rect(x0 + 3 * cw - 60, y0 + 3 * rh, cw, rh, { c: C.purple, w: 4, id: 'g', hide: true });
    s += D.txt(320, 250, '', { s: 18, mono: true, id: 'calc', c: C.green });
    return { w: 640, h: 270, svg: s, title: 'Two-way tables', frames: [
      { cap: 'A <b>two-way table</b> sorts the same 40 students two ways: boy or girl, and likes dogs or not.', set: {} },
      { cap: 'An inside box is a <b>joint</b> count: 12 boys like dogs.', set: { j: { o: 1 } } },
      { cap: 'A total on the edge is a <b>marginal</b> count: 20 boys in all.', set: { m: { o: 1 } } },
      { cap: 'The corner is the <b>grand total</b>: 40 students.', set: { g: { o: 1 } } },
      { cap: '<b>Relative frequency</b> = count ÷ total. Boys who like dogs, out of everyone: 12 ÷ 40 = 0.30 = <b>30%</b>.', set: { calc: { txt: '12 ÷ 40 = 0.30 = 30%' } } },
      { cap: 'Out of just the boys: 12 ÷ 20 = 0.60 = <b>60%</b>. Always ask: out of which total?', set: { calc: { txt: '12 ÷ 20 = 0.60 = 60%' } } }
    ] };
  }
  function corrQ(id, pts, right, extra) {
    var all = ['Positive correlation', 'Negative correlation', 'No correlation'], notes = {
      'Positive correlation': ['Positive means the dots go UP from left to right.', 'Which way do the dots go as you read left to right?'],
      'Negative correlation': ['Negative means the dots go DOWN from left to right.', 'Which way do the dots go as you read left to right?'],
      'No correlation': ['No correlation means the dots have no up or down pattern.', 'Can you see a direction in the dots?'] };
    var o = { id: id, std: SP1, q: 'What kind of correlation does this scatter plot show?', fig: scatterSvg(pts), keep: 1, ch: [right].concat(all.filter(function (a) { return a !== right; }).map(function (a) { return [a, notes[a][0], notes[a][1]]; })), hint: 'Read the dots from left to right like a sentence.' };
    for (var k in extra || {}) o[k] = extra[k];
    return o;
  }

  SB.unit({
    n: 7, title: 'Statistics', std: 'NC.8.SP.1–4', std0: SP1,
    lessons: [
      { id: '7a', title: 'Scatter plots and correlation', std: SP1, anim: corrAnim(),
        big: 'A <b>scatter plot</b> shows two sets of data as dots. Describe it: <b>direction</b> (positive = up, negative = down, none), <b>strength</b> (close to a line = strong), and <b>outliers</b> (dots far from the rest).',
        words: [['Positive correlation', 'as x goes up, y goes up'], ['Negative correlation', 'as x goes up, y goes down'], ['Outlier', 'a dot far away from the pattern'], ['Correlation is not causation', 'two things moving together does not prove one causes the other']],
        fig: scatterSvg(NEG, { w: 260, h: 200 }) + ' ' + scatterSvg(NONE, { w: 260, h: 200 }),
        more: 'Left: negative (down). Right: no correlation (no pattern).',
        watch: 'Ice cream sales and sunburns both go up in summer. Ice cream does not <b>cause</b> sunburns: hot weather drives both.',
        walk: { prob: 'Describe this scatter plot.', fig: scatterSvg(NEG.concat([[2, 2, C.red]])), steps: [
          { q: 'Read left to right. Which way do most dots go?', ch: ['Down: negative correlation', ['Up: positive correlation', 'Follow the dots from left to right: they get lower.', 'Is the right end higher or lower than the left end?'], ['No direction: no correlation', 'Most dots follow a clear downhill path.', 'Can you trace a direction?']], ln: 'direction: negative' },
          { q: 'Are the dots close to a line or spread out?', ch: ['Close to a line: strong', ['Spread out: weak', 'Most dots stay near one straight path.', 'Could you lay a ruler near most dots?']], ln: 'strength: strong' },
          { q: 'Is there an outlier?', ch: ['Yes: the dot at (2, 2)', ['No', 'One red dot sits far from the others.', 'Which dot does not fit the pattern?'], ['Yes: the dot at (9, 1.4)', 'That dot fits the downhill pattern.', 'Which dot is far from the line of dots?']], ln: 'outlier: (2, 2)' }] },
        checks: [
          corrQ('u7c1', POS, 'Positive correlation'),
          corrQ('u7c2', NONE, 'No correlation'),
          { id: 'u7c3', std: SP1, q: 'Which point is an <b>outlier</b>?', fig: scatterSvg(POS.slice(0, 9).concat([[7, 1.5, C.navy, 'B'], [3, 3, C.navy, 'A'], [6, 6.3, C.navy, 'C']])), ch: ['B', ['A', 'A sits right with the other dots.', 'Which dot is far from the pattern?'], ['C', 'C sits right with the other dots.', 'Which dot is far from the pattern?']], keep: 1, hint: 'Look for the one dot that is far from the others.' }
        ],
        can: 'describe a scatter plot by direction, strength and outliers.',
        recap: ['Up → positive; down → negative; no pattern → none', 'Close → strong; spread out → weak', 'Far-away dot → outlier'] },

      { id: '7b', title: 'Line of best fit and predictions', std: SP2, anim: fitAnim(),
        big: 'A <b>line of best fit</b> is a straight line through the middle of the dots. It is just <span class="m">y = mx + b</span>: plug in an x to <b>predict</b> y.',
        words: [['Line of best fit', 'a line close to most dots, about as many above as below'], ['Interpolation', 'predicting inside the data (safer)'], ['Extrapolation', 'predicting outside the data (riskier)']],
        watch: 'A good fit line does not have to touch any dot. It goes through the middle of the group.',
        walk: { prob: 'Best fit: y = 3x + 4 (x = hours, y = score). Predict y for x = 5.', steps: [
          { q: 'What do we do with x = 5?', ch: ['Put 5 in for x: y = 3(5) + 4', ['Solve 3x + 4 = 5', '5 is the x-value, not the y-value.', 'Is 5 the input (x) or the output (y)?'], ['Add: 3 + 5 + 4', '3x means 3 times x.', 'What does 3x mean?']], ln: 'y = 3(5) + 4' },
          { q: '3(5) = ?', ch: ['15', ['35', '3(5) is 3 × 5.', 'What is 3 × 5?'], ['8', 'That is 3 + 5.', 'Multiply or add?']], ln: 'y = 15 + 4' },
          { q: 'Finish.', ch: ['19', ['15', 'Do not forget + 4.', 'What is 15 + 4?']], ln: 'y = 19' }] },
        checks: [
          { id: 'u7c4', std: SP3, q: 'Best fit: <span class="m">y = 2x + 5</span>. Predict y when x = 6.', ans: 17, hint: 'Put 6 in for x.', miss: [[13, '2x means 2 times x: 2(6) = 12.', 'What is 2 × 6?'], [0.5, 'x = 6 is the input. Do not solve 2x + 5 = 6.', 'Is 6 the x or the y?']], sol: ['y = 2(6) + 5', '= 12 + 5 = 17'] },
          { id: 'u7c5', std: SP2, q: 'Which line fits the data best?', fig: (function () { var a = scatter(POS, { w: 300, h: 230 }), s = a.svg;
              s += D.line(a.X(0), a.Y(1), a.X(10), a.Y(10.2), { c: C.green, w: 2.5 }) + D.txt(a.X(9.4), a.Y(9.9) - 6, 'A', { s: 14, c: C.green });
              s += D.line(a.X(0), a.Y(5), a.X(10), a.Y(5.4), { c: C.red, w: 2.5 }) + D.txt(a.X(9.6), a.Y(5.4) - 8, 'B', { s: 14, c: C.red });
              s += D.line(a.X(0), a.Y(9), a.X(10), a.Y(1), { c: C.purple, w: 2.5 }) + D.txt(a.X(9.6), a.Y(1.4) - 8, 'C', { s: 14, c: C.purple });
              return D.svg(300, 230, s, 'scatter plot with three lines'); })(),
            keep: 1, ch: ['Line A', ['Line B', 'Line B is flat, but the dots go up.', 'Does B follow the direction of the dots?'], ['Line C', 'Line C goes down, but the dots go up.', 'Which way do the dots go?']], hint: 'Pick the line that follows the direction of the dots and goes through their middle.' }
        ],
        can: 'judge a line of best fit and use its equation to predict.',
        recap: ['Line through the middle of the dots', 'y = mx + b: put in x', 'Inside the data → interpolation; outside → extrapolation'] },

      { id: '7c', title: 'Two-way tables', std: SP4, anim: tableAnim(),
        big: 'A <b>two-way table</b> counts data sorted two ways. Inside boxes are <b>joint</b> counts; the edge totals are <b>marginal</b> counts. <b>Relative frequency</b> = count ÷ total, often as a percent.',
        words: [['Joint frequency', 'one inside box'], ['Marginal frequency', 'a row or column total'], ['Relative frequency', 'a count divided by a total: 12 ÷ 40 = 30%']],
        more: DOGS,
        watch: 'Always ask "out of which total?" Out of everyone (40), or out of one row (20)?',
        walk: { prob: 'Use the table. What percent of all students are girls who like dogs?', fig: '', steps: [
          { q: DOGS + 'Find the box: girls who like dogs.', ch: ['15', ['27', '27 is all students who like dogs (boys and girls).', 'Which box is in the Girls row AND the Likes dogs column?'], ['20', '20 is the total number of girls.', 'Which box is inside the table?']], ln: 'girls who like dogs: 15' },
          { q: 'Out of which total?', ch: ['All students: 40', ['All girls: 20', 'The question says "of all students".', 'Who is the whole group?']], ln: '15 ÷ 40' },
          { q: '15 ÷ 40 = ?', ch: ['0.375 = 37.5%', ['0.15 = 15%', '15 is the count, not the percent.', 'What is 15 ÷ 40?'], ['2.67', 'That is 40 ÷ 15, upside down.', 'Which number goes on top?']], ln: '15 ÷ 40 = 0.375 = 37.5%' }] },
        checks: [
          { id: 'u7c6', std: SP4, q: DOGS + 'How many <b>boys</b> are there in all?', ans: 20, hint: 'Look at the Total at the end of the Boys row.', miss: [[12, '12 is only the boys who like dogs.', 'Where is the total for the Boys row?'], [40, '40 is everyone.', 'Which row is boys?']] },
          { id: 'u7c7', std: SP4, q: DOGS + 'What percent of <b>all</b> students do <b>not</b> like dogs?', ans: 32.5, unit: '%', hint: 'Students who do not like dogs: the column total. Divide by 40.', miss: [[13, '13 is the count. Divide by the total and make it a percent.', 'What is 13 ÷ 40?'], [67.5, 'That is the percent who DO like dogs.', 'Which column is "Does not"?'], [0.325, 'Good division. Now change 0.325 to a percent.', 'Multiply by 100.']], sol: ['does not like dogs: 13', '13 ÷ 40 = 0.325 = 32.5%'] }
        ],
        can: 'read a two-way table and find relative frequencies.',
        recap: ['Find the box (joint) or total (marginal)', 'Pick the right total', 'Count ÷ total → percent'] }
    ],
    practice: [
      corrQ('u7p1', NEG, 'Negative correlation'),
      corrQ('u7p2', POS, 'Positive correlation'),
      corrQ('u7p3', NONE, 'No correlation'),
      { id: 'u7p4', std: SP1, q: 'A single dot far away from the rest of a scatter plot is called…', keep: 1, ch: ['an outlier', ['a line of best fit', 'A line of best fit is a line, not one dot.', 'What is a far-away dot called?'], ['a correlation', 'Correlation describes the whole pattern.', 'What is one far-away dot called?']], hint: 'It lies "outside" the pattern.' },
      { id: 'u7p5', std: SP3, q: 'Best fit: <span class="m">y = 3x + 4</span>. Predict y when x = 5.', ans: 19, hint: 'Put 5 in for x: 3(5) + 4.', miss: [[12, '3x is 3 times x: 3(5) = 15.', 'What is 3 × 5?'], [15, 'Do not forget + 4.', 'What is 15 + 4?'], [1 / 3, '5 is the x-value. Do not solve 3x + 4 = 5.', 'Is 5 the x or the y?']], sol: ['y = 3(5) + 4', '= 15 + 4 = 19'] },
      { id: 'u7p6', std: SP3, q: 'A best fit line for plant height is <span class="m">y = 2x + 3</span> (x = weeks, y = cm). What does the slope 2 mean?', wide: 1, ch: ['The plant grows about 2 cm each week', ['The plant started at 2 cm', 'The start is the y-intercept, 3.', 'Which number is the start value?'], ['The plant is 2 weeks old', 'The slope is a rate, not an age.', 'What does a slope tell you?']], hint: 'Slope = rate: how much y changes for each 1 of x.' },
      { id: 'u7p7', std: SP2, q: 'Data go from x = 1 to x = 8. Using the line to predict y at x = 30 is…', keep: 1, ch: ['extrapolation (riskier)', ['interpolation (safer)', 'x = 30 is far outside the data (1 to 8).', 'Is 30 inside or outside the data?']], hint: 'Inside the data → interpolation. Outside → extrapolation.' },
      { id: 'u7p8', std: SP4, q: DOGS + 'How many <b>girls</b> like dogs?', ans: 15, hint: 'Find the box in the Girls row and the Likes dogs column.', miss: [[20, '20 is all the girls.', 'Which box is inside the table?'], [27, '27 is everyone who likes dogs.', 'Which row is girls?'], [12, '12 is boys who like dogs.', 'Which row is girls?']] },
      { id: 'u7p9', std: SP4, q: DOGS + 'Of the <b>boys</b>, what percent like dogs?', ans: 60, unit: '%', hint: 'Out of the boys only: 12 ÷ 20.', miss: [[30, 'That is out of ALL students. The question says "of the boys".', 'What is the total for boys?'], [12, '12 is the count. Divide by 20.', 'What is 12 ÷ 20?'], [0.6, 'Good. Change 0.6 to a percent.', 'Multiply by 100.']], sol: ['boys who like dogs: 12; all boys: 20', '12 ÷ 20 = 0.60 = 60%'] },
      { id: 'u7p10', std: SP1, q: '<b>Find the mistake.</b> A scatter plot shows that towns with more ice cream shops have more sunburns. Rio says: "Ice cream causes sunburns." What is wrong?', wide: 1, ch: ['A correlation does not prove cause. Hot, sunny weather can cause both.', ['Nothing. The data prove it.', 'Data that move together do not prove one causes the other.', 'Could something else cause both?'], ['The correlation must be negative.', 'Both go up together, so it is positive.', 'Do they go up together?'], ['Sunburns cause ice cream shops.', 'That is still a cause claim the data cannot prove.', 'Could a third thing explain both?']], hint: 'Correlation is not causation.' }
    ]
  });
})();
