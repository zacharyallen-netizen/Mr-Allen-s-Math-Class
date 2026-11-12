/* Skill Builders · Unit 6 · Functions (NC.8.F.1–5, NC.8.EE.8) · Score 3 core skills */
(function () {
  var D = SB.D, C = SB.C, M = D.minus;
  var F1 = 'NC.8.F.1', F2 = 'NC.8.F.2', F3 = 'NC.8.F.3', F4 = 'NC.8.F.4', F5 = 'NC.8.F.5', EE8 = 'NC.8.EE.8';
  function tbl(xs, ys) { return '<table class="tbl"><tr><th>x</th>' + xs.map(function (v) { return '<td>' + M(String(v)) + '</td>'; }).join('') + '</tr><tr><th>y</th>' + ys.map(function (v) { return '<td>' + M(String(v)) + '</td>'; }).join('') + '</tr></table>'; }
  /* grid with lines y = m x + b and points */
  function plane(o) {
    var g = D.grid({ min: o.min != null ? o.min : -2, max: o.max || 8, size: o.size || 240, x: 26, y: 14 }), P = g.P, s = D.arrowDefs() + g.svg, mn = o.min != null ? o.min : -2, mx = o.max || 8;
    (o.lines || []).forEach(function (l) {
      var pts = [], m = l[0], b = l[1];
      [mn, mx].forEach(function (x) { pts.push([x, m * x + b]); });
      // clip to the grid
      var x0 = mn, x1 = mx; if (m !== 0) { var xa = (mn - b) / m, xb = (mx - b) / m; x0 = Math.max(mn, Math.min(xa, xb)); x1 = Math.min(mx, Math.max(xa, xb)); }
      var A = P(x0, m * x0 + b), B = P(x1, m * x1 + b);
      s += D.line(A[0], A[1], B[0], B[1], { c: l[2] || C.blue, w: 3, id: l[3], draw: !!l[3] });
    });
    (o.pts || []).forEach(function (p) { var Q = P(p[0], p[1]); s += D.circ(Q[0], Q[1], 5.5, { fill: p[3] || C.navy, id: p[4], hide: !!p[4] }) + (p[2] ? D.txt(Q[0] + 8, Q[1] - 8, p[2], { s: 13, a: 'start', id: p[4] ? p[4] + 't' : '', hide: !!p[4] }) : ''); });
    return { svg: s, P: P, w: (o.size || 240) + 52, h: (o.size || 240) + 40 };
  }
  function planeSvg(o) { var p = plane(o); return D.svg(p.w, p.h, p.svg, 'coordinate plane'); }
  function mapping(ins, outs, arrows) {
    var s = D.arrowDefs() + D.rect(20, 10, 70, 30 + ins.length * 34, { r: 30, c: C.navy, fill: '#F7F9FE' }) + D.rect(190, 10, 70, 30 + outs.length * 34, { r: 30, c: C.navy, fill: '#F7F9FE' });
    s += D.txt(55, 8 + 0, '', { s: 1 });
    ins.forEach(function (v, i) { s += D.txt(55, 38 + i * 34, M(String(v)), { s: 16, mono: true }); });
    outs.forEach(function (v, i) { s += D.txt(225, 38 + i * 34, M(String(v)), { s: 16, mono: true }); });
    arrows.forEach(function (a) { s += D.line(72, 33 + a[0] * 34, 202, 33 + a[1] * 34, { w: 1.8, arrow: 'ah' }); });
    var H = 50 + Math.max(ins.length, outs.length) * 34;
    s += D.txt(55, H - 2, 'input x', { s: 12, c: C.gray }) + D.txt(225, H - 2, 'output y', { s: 12, c: C.gray });
    return D.svg(280, H + 6, s, 'mapping diagram');
  }

  /* ---- animations ---- */
  function machineAnim() {
    var s = D.arrowDefs();
    s += D.rect(230, 80, 180, 110, { fill: '#1E2D4F', r: 14 }) + D.txt(320, 125, 'RULE', { s: 14, c: C.gold2 }) + D.txt(320, 160, '× 2 + 1', { s: 26, mono: true, c: '#fff' });
    s += D.rect(214, 115, 18, 40, { fill: '#2A3D66' }) + D.rect(408, 115, 18, 40, { fill: '#2A3D66' });
    s += D.g(D.circ(0, 0, 26, { fill: '#DBEAFE', c: C.blue, w: 2 }) + D.txt(0, 9, '3', { s: 24, mono: true, c: C.blue }), { id: 'in', style: 'transform:translate(80px,135px)' });
    s += D.g(D.circ(0, 0, 26, { fill: '#E7F5EC', c: C.green, w: 2 }) + D.txt(0, 9, '7', { s: 24, mono: true, c: C.green }), { id: 'out', style: 'transform:translate(470px,135px);opacity:0' });
    s += D.txt(320, 240, '', { s: 18, mono: true, id: 'work' });
    s += D.txt(320, 40, '', { s: 17, id: 'note', c: C.navy });
    return { w: 640, h: 270, svg: s, title: 'A function is a machine', frames: [
      { cap: 'A <b>function</b> is like a machine with a rule. Here the rule is <b>× 2 + 1</b>.', set: {} },
      { cap: 'Put in the <b>input</b> x = 3.', set: { in: { t: 'translate(320px,135px)', o: 0 } } },
      { cap: 'The machine follows the rule: 2(3) + 1 = 7.', set: { work: { txt: '2(3) + 1 = 7' } } },
      { cap: 'Out comes the <b>output</b> y = 7. Each input gives <b>exactly one</b> output.', set: { out: { o: 1, t: 'translate(560px,135px)' } } },
      { cap: 'In f(x) notation: f(x) = 2x + 1, so <b>f(3) = 7</b>. "f of 3" means "put in 3".', set: { note: { txt: 'f(x) = 2x + 1  →  f(3) = 7' } } }
    ] };
  }
  function slopeAnim() {
    var p = plane({ min: -1, max: 9, size: 250, lines: [[2, 2, C.gray, 'ln']], pts: [[0, 2, '(0, 2)'], [3, 8, '(3, 8)']] }), P = p.P, s = p.svg;
    var A = P(0, 2), K = P(3, 2), B = P(3, 8);
    s += D.line(A[0], A[1], K[0], K[1], { c: C.blue, w: 4, id: 'run', draw: true, arrow: 'ahb' }) + D.line(K[0], K[1], B[0], B[1], { c: C.purple, w: 4, id: 'rise', draw: true });
    s += D.txt((A[0] + K[0]) / 2, A[1] + 22, 'run 3', { s: 14, c: C.blue, id: 'rl', hide: true }) + D.txt(K[0] + 8, (K[1] + B[1]) / 2, 'rise 6', { s: 14, c: C.purple, a: 'start', id: 'ul', hide: true });
    var L = ['slope = rise ÷ run', '= (8 − 2) ÷ (3 − 0)', '= 6 ÷ 3 = 2'];
    L.forEach(function (l, i) { s += D.txt(330, 70 + i * 42, l, { s: 19, mono: true, a: 'start', id: 'l' + i, hide: true, c: i === 2 ? C.green : C.navy }); });
    s += D.txt(330, 220, 'up 2 for every 1 across', { s: 15, c: C.gray, a: 'start', id: 'tip', hide: true });
    return { w: 640, h: 290, svg: s, title: 'Slope is rise over run', frames: [
      { cap: 'A line goes through (0, 2) and (3, 8). How steep is it?', set: { ln: { d: 1 } } },
      { cap: 'Move across from the first point: the <b>run</b> is 3 − 0 = <b>3</b>.', set: { run: { d: 1 }, rl: { o: 1 } } },
      { cap: 'Then move up to the second point: the <b>rise</b> is 8 − 2 = <b>6</b>.', set: { rise: { d: 1 }, ul: { o: 1 } } },
      { cap: '<b>Slope = rise ÷ run</b> = 6 ÷ 3 = <b>2</b>.', set: { l0: { o: 1 }, l1: { o: 1 }, l2: { o: 1 } } },
      { cap: 'A slope of 2 means the line goes <b>up 2 for every 1 across</b>. Going down left to right would make the slope negative.', set: { tip: { o: 1 } } }
    ] };
  }
  function mbAnim() {
    var s = '', xs = [0, 1, 2, 3], ys = [2, 5, 8, 11], x0 = 60, y0 = 50, cw = 70;
    s += D.rect(x0 - 50, y0 - 26, 50, 40, { fill: '#EEF1F7', c: '#D5D9E0' }) + D.txt(x0 - 25, y0, 'x', { s: 18, it: true }) + D.rect(x0 - 50, y0 + 14, 50, 40, { fill: '#EEF1F7', c: '#D5D9E0' }) + D.txt(x0 - 25, y0 + 40, 'y', { s: 18, it: true });
    xs.forEach(function (v, i) { s += D.rect(x0 + i * cw, y0 - 26, cw, 40, { c: '#D5D9E0' }) + D.txt(x0 + i * cw + cw / 2, y0, String(v), { s: 18, mono: true }) + D.rect(x0 + i * cw, y0 + 14, cw, 40, { c: '#D5D9E0' }) + D.txt(x0 + i * cw + cw / 2, y0 + 40, String(ys[i]), { s: 18, mono: true, c: i === 0 ? C.navy : C.navy, id: 'y' + i }); });
    for (var i = 0; i < 3; i++) s += D.path('M' + (x0 + i * cw + cw / 2 + 8) + ',' + (y0 + 62) + ' q' + (cw / 2 - 8) + ',22 ' + (cw - 16) + ',0', { c: C.gold, w: 2.2, id: 'a' + i, draw: true }) + D.txt(x0 + i * cw + cw, y0 + 96, '+3', { s: 15, c: '#8A6100', id: 't' + i, hide: true });
    s += D.rect(x0, y0 + 14, cw, 40, { c: C.green, w: 3, id: 'bx', hide: true });
    s += D.txt(480, 70, 'm = 3', { s: 24, mono: true, c: '#8A6100', id: 'm', hide: true }) + D.txt(480, 115, 'b = 2', { s: 24, mono: true, c: C.green, id: 'b', hide: true }) + D.txt(480, 175, 'y = 3x + 2', { s: 28, mono: true, c: C.navy, id: 'eq', hide: true });
    s += D.txt(320, 230, 'm = slope (rate)   ·   b = y-intercept (start)', { s: 15, c: C.gray, id: 'tip', hide: true });
    return { w: 640, h: 250, svg: s, title: 'From a table to y = mx + b', frames: [
      { cap: 'A table of a linear function. Every time x goes up 1…', set: {} },
      { cap: '…y goes up <b>3</b>. That steady change is the <b>slope</b>: m = 3.', set: { a0: { d: 1 }, a1: { d: 1 }, a2: { d: 1 }, t0: { o: 1 }, t1: { o: 1 }, t2: { o: 1 }, m: { o: 1 } } },
      { cap: 'When x = 0, y = 2. That is the <b>y-intercept</b> (the start): b = 2.', set: { bx: { o: 1 }, b: { o: 1 } } },
      { cap: 'Put them into <b>y = mx + b</b>: <b>y = 3x + 2</b>.', set: { eq: { o: 1 }, tip: { o: 1 } } }
    ] };
  }
  function rateAnim() {
    var p = plane({ min: 0, max: 10, size: 240, lines: [[2, 3, C.blue, 'ln']], pts: [[0, 3, 'start fee $3', C.green, 'p0']] }), P = p.P, s = p.svg;
    var A = P(1, 5), K = P(2, 5), B = P(2, 7);
    s += D.g(D.line(A[0], A[1], K[0], K[1], { c: C.gold, w: 3 }) + D.line(K[0], K[1], B[0], B[1], { c: C.gold, w: 3 }) + D.txt(K[0] + 8, (K[1] + B[1]) / 2 + 4, '+$2 per mile', { s: 13, c: '#8A6100', a: 'start' }), { id: 'st', hide: true });
    s += D.txt(330, 60, 'Taxi: y = 2x + 3', { s: 22, mono: true, a: 'start', id: 'eq' });
    s += D.txt(330, 110, '2 = rate: $2 per mile', { s: 17, a: 'start', c: '#8A6100', id: 'r', hide: true });
    s += D.txt(330, 145, '3 = start: $3 before driving', { s: 17, a: 'start', c: C.green, id: 'b', hide: true });
    s += D.txt(330, 200, '5 miles: 2(5) + 3 = $13', { s: 17, a: 'start', mono: true, id: 'ex', hide: true });
    return { w: 640, h: 290, svg: s, title: 'Rate and start value', frames: [
      { cap: 'A taxi ride costs <b>y = 2x + 3</b> dollars for x miles.', set: { ln: { d: 1 } } },
      { cap: 'The <b>3</b> is the <b>start value</b> (y-intercept): you pay $3 before the taxi moves (x = 0).', set: { p0: { o: 1 }, p0t: { o: 1 }, b: { o: 1 } } },
      { cap: 'The <b>2</b> is the <b>rate</b> (slope): each mile adds $2.', set: { st: { o: 1 }, r: { o: 1 } } },
      { cap: 'Use the rule: 5 miles costs 2(5) + 3 = <b>$13</b>.', set: { ex: { o: 1 } } }
    ] };
  }
  function systemAnim() {
    var p = plane({ min: -2, max: 6, size: 240, lines: [[1, 1, C.blue, 'l1'], [2, -1, C.purple, 'l2']], pts: [[2, 3, '(2, 3)', C.gold, 'pt']] }), s = p.svg;
    s += D.txt(330, 60, 'y = x + 1', { s: 20, mono: true, a: 'start', c: C.blue, id: 'e1', hide: true }) + D.txt(330, 95, 'y = 2x − 1', { s: 20, mono: true, a: 'start', c: C.purple, id: 'e2', hide: true });
    s += D.txt(330, 160, 'Check (2, 3):', { s: 16, a: 'start', id: 'c0', hide: true }) + D.txt(330, 190, '3 = 2 + 1 ✓', { s: 18, mono: true, a: 'start', c: C.blue, id: 'c1', hide: true }) + D.txt(330, 220, '3 = 2(2) − 1 ✓', { s: 18, mono: true, a: 'start', c: C.purple, id: 'c2', hide: true });
    return { w: 640, h: 290, svg: s, title: 'The solution of a system', frames: [
      { cap: 'A <b>system</b> is two equations at the same time. Graph the first: y = x + 1.', set: { l1: { d: 1 }, e1: { o: 1 } } },
      { cap: 'Graph the second: y = 2x − 1.', set: { l2: { d: 1 }, e2: { o: 1 } } },
      { cap: 'The lines <b>cross</b> at <b>(2, 3)</b>. That point is the solution: it is on both lines.', set: { pt: { o: 1 }, ptt: { o: 1 } } },
      { cap: 'Check it in both equations. Both are true, so <b>(2, 3)</b> is the solution.', set: { c0: { o: 1 }, c1: { o: 1 }, c2: { o: 1 } } }
    ] };
  }

  SB.unit({
    n: 6, title: 'Functions', std: 'NC.8.F.1–5 · NC.8.EE.8', std0: F1,
    lessons: [
      { id: '6a', title: 'What is a function?', std: F1, anim: machineAnim(),
        big: 'A <b>function</b> is a rule where <b>each input (x) has exactly one output (y)</b>. f(x) means "the output when the input is x." To find f(4), put 4 in for x.',
        words: [['Input (x)', 'the number you put in'], ['Output (y or f(x))', 'the number that comes out'], ['Function', 'every input has exactly one output']],
        fig: mapping([1, 2, 3], [4, 5, 6], [[0, 0], [1, 1], [2, 2]]),
        more: 'Not a function: one input with <b>two</b> outputs, like x = 2 going to both 5 and 7. On a graph, a vertical line that hits the graph twice means it is <b>not</b> a function.',
        watch: 'Two inputs with the same output is still a function. The problem is one input with two outputs.',
        walk: { prob: 'f(x) = 3x − 2. Find f(4).', steps: [
          { q: 'What does f(4) ask?', ch: ['Put 4 in for x', ['Multiply f × 4', 'f is the name of the function, not a number.', 'What does the 4 in f(4) replace?'], ['Solve 3x − 2 = 4', 'f(4) means the input is 4, not the output.', 'Is 4 the input or the output?']], ln: 'f(4) = 3(4) − 2' },
          { q: 'Multiply first: 3(4) = ?', ch: ['12', ['34', '3(4) means 3 times 4.', 'What is 3 × 4?'], ['7', 'That is 3 + 4.', 'Multiply or add?']], ln: '= 12 − 2' },
          { q: 'Finish: 12 − 2 = ?', ch: ['10', ['14', 'That adds 2.', 'The rule says − 2.']], ln: 'f(4) = 10' }] },
        checks: [
          { id: 'u6c1', std: F1, q: '<span class="m">f(x) = 2x + 5</span>. Find <span class="m">f(3)</span>.', ans: 11, hint: 'Put 3 in for x: 2(3) + 5.', miss: [[28, '2(3) is 2 × 3 = 6, not 23.', 'What is 2 × 3?'], [10, 'That is 2 + 3 + 5. Multiply 2 × 3 first.', 'What is 2 × 3?'], [-1, 'f(3) means the input is 3. Do not solve 2x + 5 = 3.', 'Is 3 the input or the output?']], sol: ['f(3) = 2(3) + 5', '= 6 + 5 = 11'] },
          { id: 'u6c2', std: F1, q: 'Is this mapping a function?', fig: mapping([1, 2, 3], [5, 7, 9], [[0, 0], [1, 1], [1, 2], [2, 2]]), keep: 1, ch: ['No: the input 2 has two outputs', ['Yes: every input has an arrow', 'Look at input 2. It has two arrows.', 'How many outputs does 2 have?'], ['Yes: two inputs share an output', 'Sharing an output is fine. The problem is one input going to two outputs.', 'Does any input have two arrows?']], hint: 'Count the arrows leaving each input.' }
        ],
        can: 'tell whether a relation is a function and find f(x) for a given x.',
        recap: ['Each input → exactly one output', 'f(a): put a in for x', 'Multiply before you add'] },

      { id: '6b', title: 'Slope: rise over run', std: F4, anim: slopeAnim(),
        big: '<b>Slope</b> tells how steep a line is. <span class="m">slope = rise ÷ run = (change in y) ÷ (change in x)</span>. Uphill (left to right) is <b>positive</b>, downhill is <b>negative</b>, flat is <b>0</b>.',
        words: [['Rise', 'the up/down change: subtract the y-values'], ['Run', 'the across change: subtract the x-values'], ['Slope (m)', 'rise ÷ run']],
        fig: planeSvg({ min: -1, max: 7, size: 200, lines: [[1, 1, C.green], [-1, 6, C.red], [0, 2, C.gray]] }),
        more: '<span style="color:#15803D;font-weight:600">Green: positive (uphill)</span> · <span style="color:#B42318;font-weight:600">Red: negative (downhill)</span> · <span style="color:#5B6475;font-weight:600">Gray: zero (flat)</span>',
        watch: 'Rise goes on <b>top</b>. Run goes on the bottom. And subtract in the same order for both.',
        walk: { prob: 'Find the slope from (1, 3) to (4, 12).', steps: [
          { q: 'Find the rise (change in y).', ch: ['12 − 3 = 9', ['4 − 1 = 3', 'That is the change in x (the run).', 'Which numbers are the y-values?'], ['12 + 3 = 15', 'Subtract to find the change.', 'Add or subtract?']], ln: 'rise = 9' },
          { q: 'Find the run (change in x).', ch: ['4 − 1 = 3', ['12 − 3 = 9', 'That was the rise.', 'Which numbers are the x-values?']], ln: 'run = 3' },
          { q: 'Slope = rise ÷ run = ?', ch: ['9 ÷ 3 = 3', ['3 ÷ 9 = 1/3', 'That is run ÷ rise, upside down.', 'Which goes on top: rise or run?'], ['9 − 3 = 6', 'Slope divides, it does not subtract.', 'Rise ___ run?']], ln: 'slope = 3' }] },
        checks: [
          { id: 'u6c3', std: F4, q: 'Find the slope of the line through <b>(0, 2)</b> and <b>(3, 8)</b>.', ans: 2, neg: 1, hint: 'Rise = 8 − 2. Run = 3 − 0.', miss: [[0.5, 'That is run ÷ rise. Rise goes on top.', 'Which goes on top?'], [6, 'That is just the rise. Divide by the run.', 'What is the run?'], [10 / 3, 'Subtract the y-values: 8 − 2, not 8 + 2.', 'What is the change in y?']], sol: ['rise = 8 − 2 = 6', 'run = 3 − 0 = 3', 'slope = 6 ÷ 3 = 2'] },
          { id: 'u6c4', std: F4, q: 'What kind of slope does this line have?', fig: planeSvg({ min: -1, max: 7, size: 200, lines: [[-2, 6, C.blue]] }), keep: 1, ch: ['Negative', ['Positive', 'Read left to right: the line goes down.', 'Does the line go up or down from left to right?'], ['Zero', 'A zero slope is flat. This line is slanted.', 'Is the line flat?']], hint: 'Read the line from left to right like a word.' }
        ],
        can: 'find the slope from two points or a graph.',
        recap: ['Rise = change in y', 'Run = change in x', 'Slope = rise ÷ run'] },

      { id: '6c', title: 'y = mx + b from a table or graph', std: F4, anim: mbAnim(),
        big: 'A line can be written <span class="m">y = mx + b</span>. <b>m</b> is the slope (how much y changes when x goes up 1). <b>b</b> is the y-intercept (the y-value when x = 0, where the line crosses the y-axis).',
        words: [['Slope-intercept form', 'y = mx + b'], ['y-intercept (b)', 'where the line crosses the y-axis; the y-value when x = 0']],
        more: tbl([0, 1, 2, 3], [5, 8, 11, 14]) + 'y goes up 3 each time → m = 3. When x = 0, y = 5 → b = 5. So y = 3x + 5.',
        watch: 'In y = 4x − 1, the slope is 4 and the y-intercept is <b>−1</b> (keep the sign).',
        walk: { prob: 'Write the equation for this table.', fig: '', steps: [
          { q: tbl([0, 1, 2, 3], [1, 3, 5, 7]) + 'How much does y change when x goes up 1?', ch: ['+2, so m = 2', ['+1, so m = 1', 'Look at y: 1, 3, 5, 7.', 'What is 3 − 1?'], ['+7, so m = 7', '7 is the last y-value, not the change.', 'How much does y go up each step?']], ln: 'm = 2' },
          { q: 'What is y when x = 0?', ch: ['1, so b = 1', ['0, so b = 0', 'Find x = 0 in the table and read its y.', 'What y sits under x = 0?'], ['3, so b = 3', '3 is the y-value when x = 1.', 'What y sits under x = 0?']], ln: 'b = 1' },
          { q: 'Write y = mx + b.', ch: ['y = 2x + 1', ['y = x + 2', 'The slope and the y-intercept are switched.', 'Which number multiplies x?'], ['y = 2x', 'Do not forget b.', 'What is the start value?']], ln: 'y = 2x + 1' }] },
        checks: [
          { id: 'u6c5', std: F3, q: 'In <span class="m">y = 4x − 1</span>, what is the <b>slope</b>?', ans: 4, neg: 1, hint: 'y = mx + b: the slope is the number multiplying x.', miss: [[-1, '−1 is the y-intercept (b).', 'Which number multiplies x?']] },
          { id: 'u6c6', std: F4, q: 'Which equation matches the table?' + tbl([0, 1, 2, 3], [4, 6, 8, 10]), ch: ['y = 2x + 4', ['y = 4x + 2', 'The slope and the y-intercept are switched.', 'How much does y go up each step?'], ['y = x + 4', 'y goes up 2 each step, not 1.', 'What is 6 − 4?'], ['y = 2x', 'When x = 0, y = 4, not 0.', 'What is y when x = 0?']], hint: 'm = how much y goes up each step. b = y when x = 0.' },
          { id: 'u6c7', std: F4, q: 'What is the y-intercept of this line?', fig: planeSvg({ min: -2, max: 8, size: 220, lines: [[1, 3, C.blue]] }), ans: 3, neg: 1, hint: 'Find where the line crosses the y-axis (the up-and-down axis).', miss: [[-3, 'The line crosses the x-axis at −3. The y-intercept is on the y-axis.', 'Which axis goes up and down?'], [1, 'That is the slope.', 'Where does the line cross the y-axis?']] }
        ],
        can: 'find m and b from a table, a graph or an equation, and write y = mx + b.',
        recap: ['m = change in y when x goes up 1', 'b = y when x = 0', 'Write y = mx + b'] },

      { id: '6d', title: 'Rate and start value', std: F2, anim: rateAnim(),
        big: 'In a real-world line, the <b>slope is the rate</b> (per hour, per mile, each day) and the <b>y-intercept is the start value</b> (the amount when x = 0, like a fee).',
        words: [['Rate of change', 'how much y changes for each 1 of x'], ['Initial (start) value', 'the amount at the start, when x = 0'], ['Increasing / decreasing', 'a graph going up / going down from left to right']],
        more: 'Phone plan: <span class="m">y = 15x + 40</span>. $40 to start, then $15 each month.',
        watch: 'The start value is the number <b>by itself</b>, not the number next to x.',
        walk: { prob: 'A gym charges y = 20x + 50 for x months. What does 50 mean?', steps: [
          { q: 'In y = 20x + 50, which number is alone (not next to x)?', ch: ['50', ['20', '20 is next to x. It changes with each month.', 'Which number does not multiply x?']], ln: 'b = 50' },
          { q: 'What does the number alone mean?', ch: ['The start fee: $50 before any months', ['The cost each month', 'The cost each month is the rate, 20.', 'What do you pay when x = 0?'], ['The total for one month', 'One month costs 20(1) + 50 = $70.', 'What do you pay when x = 0?']], ln: '$50 is the start (sign-up) fee' },
          { q: 'And 20?', ch: ['$20 per month (the rate)', ['$20 to start', 'The start is the number alone, 50.', 'Which number is next to x?']], ln: '$20 per month is the rate' }] },
        checks: [
          { id: 'u6c8', std: F2, q: 'A plant is <span class="m">h = 2w + 6</span> cm tall after w weeks. How tall was it at the start?', ans: 6, unit: 'cm', hint: 'The start is when w = 0.', miss: [[2, '2 is how much it grows each week (the rate).', 'What is h when w = 0?'], [8, 'That is the height after 1 week.', 'What is h when w = 0?']] },
          { id: 'u6c9', std: F2, q: 'A phone plan costs <span class="m">y = 15x + 40</span>. What is the cost <b>per month</b>?', ans: 15, unit: 'dollars', hint: 'The rate is the number next to x.', miss: [[40, '$40 is the start fee.', 'Which number is next to x?'], [55, 'That is the cost for 1 month (15 + 40).', 'How much is added each month?']] },
          { id: 'u6c10', std: F5, q: 'A graph of water in a tank goes <b>down</b> from left to right. What is happening?', keep: 1, ch: ['The water is decreasing', ['The water is increasing', 'Up means increasing. This graph goes down.', 'Which way does the graph go?'], ['The water stays the same', 'Staying the same is a flat graph.', 'Is the graph flat?']], hint: 'Read the graph left to right.' }
        ],
        can: 'explain what the slope and y-intercept mean in a real situation.',
        recap: ['Number next to x = rate', 'Number alone = start value', 'Up = increasing, down = decreasing, flat = constant'] },

      { id: '6e', title: 'Systems: where two lines cross', std: EE8, anim: systemAnim(),
        big: 'The <b>solution of a system</b> is the point <b>(x, y) where the two lines cross</b>. It makes <b>both</b> equations true.',
        words: [['System of equations', 'two equations used together'], ['Solution', 'the point that is on both lines']],
        watch: 'A point on only one line is not the solution. Check it in <b>both</b> equations.',
        walk: { prob: 'Is (1, 3) the solution of y = x + 2 and y = 3x?', steps: [
          { q: 'Check the first equation: y = x + 2 with x = 1.', ch: ['1 + 2 = 3 ✓ (y is 3)', ['1 + 2 = 4 ✗', '1 + 2 = 3.', 'What is 1 + 2?']], ln: 'y = x + 2: 3 = 1 + 2 ✓' },
          { q: 'Check the second equation: y = 3x with x = 1.', ch: ['3(1) = 3 ✓', ['3 + 1 = 4 ✗', '3x means 3 times x.', 'What is 3 × 1?']], ln: 'y = 3x: 3 = 3(1) ✓' },
          { q: 'Is (1, 3) the solution?', ch: ['Yes: it works in both', ['No: it only needs one', 'It works in both, so it is on both lines.', 'Did it work in both equations?']], ln: '(1, 3) is the solution' }] },
        checks: [
          { id: 'u6c11', std: EE8, q: 'What is the solution of the system shown?', fig: planeSvg({ min: -2, max: 6, size: 220, lines: [[1, 1, C.blue], [-1, 5, C.purple]] }), ch: ['(2, 3)', ['(3, 2)', 'The x and y are switched. x comes first (across).', 'How far across is the crossing point?'], ['(0, 1)', 'That point is only on the blue line.', 'Where do the two lines cross?'], ['(0, 5)', 'That point is only on the purple line.', 'Where do the two lines cross?']], hint: 'Find where the two lines cross. Read across (x) first, then up (y).' },
          { id: 'u6c12', std: EE8, q: 'Is <b>(2, 5)</b> the solution of <span class="m">y = x + 3</span> and <span class="m">y = 2x</span>?', keep: 1, wide: 1, ch: ['No: it works in y = x + 3, but 2(2) = 4, not 5', ['Yes: 2 + 3 = 5', 'It must work in BOTH equations.', 'Does 5 = 2(2)?'], ['Yes: it works in both', 'Check y = 2x: 2(2) = 4, not 5.', 'What is 2 × 2?']], hint: 'Put x = 2 in both equations. Do you get y = 5 both times?' }
        ],
        can: 'find and check the solution of a system of two linear equations.',
        recap: ['Graph both lines', 'The crossing point is the solution', 'Check it in both equations'] }
    ],
    practice: [
      { id: 'u6p1', std: F1, q: '<span class="m">f(x) = 4x + 1</span>. Find <span class="m">f(2)</span>.', ans: 9, hint: 'Put 2 in for x: 4(2) + 1.', miss: [[42, '4(2) is 4 × 2.', 'What is 4 × 2?'], [7, 'That is 4 + 2 + 1. Multiply first.', 'What is 4 × 2?'], [0.25, 'f(2) means the input is 2. Do not solve 4x + 1 = 2.', 'Is 2 the input or the output?']], sol: ['f(2) = 4(2) + 1', '= 8 + 1 = 9'] },
      { id: 'u6p2', std: F1, q: 'Which table shows a function?', wide: 1, ch: [tbl([1, 2, 3, 4], [5, 5, 6, 6]), [tbl([1, 1, 2, 3], [4, 5, 6, 7]), 'x = 1 has two outputs (4 and 5).', 'Does any x appear twice with different y’s?'], [tbl([2, 3, 2, 4], [1, 2, 3, 4]), 'x = 2 has two outputs (1 and 3).', 'Does any x appear twice with different y’s?']], hint: 'A function never gives one x two different y-values. Repeated y-values are fine.' },
      { id: 'u6p3', std: F4, q: 'Find the slope from <b>(1, 3)</b> to <b>(4, 12)</b>.', ans: 3, neg: 1, hint: 'Rise = 12 − 3. Run = 4 − 1.', miss: [[1 / 3, 'That is run ÷ rise.', 'Which goes on top?'], [9, 'That is the rise only.', 'Divide by the run.'], [5, 'Subtract the y-values: 12 − 3, not 12 + 3.', 'What is the change in y?']],
        steps: [{ q: 'Rise?', ch: ['12 − 3 = 9', ['4 − 1 = 3', 'That is the run.', 'Which numbers are y-values?']], ln: 'rise = 9' }, { q: 'Run?', ch: ['4 − 1 = 3', ['12 − 3 = 9', 'That is the rise.', 'Which numbers are x-values?']], ln: 'run = 3' }, { q: 'Slope?', ch: ['9 ÷ 3 = 3', ['3 ÷ 9', 'Rise on top.', 'Rise ÷ run or run ÷ rise?']], ln: 'slope = 3' }], sol: ['rise = 12 − 3 = 9', 'run = 4 − 1 = 3', 'slope = 9 ÷ 3 = 3'] },
      { id: 'u6p4', std: F4, q: 'Find the slope from <b>(0, 6)</b> to <b>(3, 0)</b>.', ans: -2, neg: 1, hint: 'Rise = 0 − 6. Run = 3 − 0. The line goes down, so the slope is negative.', miss: [[2, 'The line goes DOWN from left to right, so the slope is negative.', 'What is 0 − 6?'], [-0.5, 'That is run ÷ rise.', 'Which goes on top?']], sol: ['rise = 0 − 6 = −6', 'run = 3 − 0 = 3', 'slope = −6 ÷ 3 = −2'] },
      { id: 'u6p5', std: F4, q: 'Which equation matches the table?' + tbl([0, 1, 2], [5, 8, 11]), ch: ['y = 3x + 5', ['y = 5x + 3', 'The slope and y-intercept are switched.', 'How much does y go up each step?'], ['y = 3x', 'When x = 0, y = 5.', 'What is y when x = 0?'], ['y = x + 5', 'y goes up 3 each step.', 'What is 8 − 5?']], hint: 'm = change in y each step. b = y when x = 0.',
        steps: [{ q: 'How much does y change each step?', ch: ['+3', ['+5', '5 is the first y-value.', 'What is 8 − 5?']], ln: 'm = 3' }, { q: 'y when x = 0?', ch: ['5', ['0', 'Read the table under x = 0.', 'What is y when x = 0?']], ln: 'b = 5' }], sol: ['m = 3 (y goes up 3 each step)', 'b = 5 (y when x = 0)', 'y = 3x + 5'] },
      { id: 'u6p6', std: F2, q: 'A savings account has <span class="m">y = 5x + 20</span> dollars after x weeks. What is the <b>start value</b>?', ans: 20, unit: 'dollars', hint: 'The start value is the number alone (when x = 0).', miss: [[5, '5 is the amount added each week (the rate).', 'What is y when x = 0?'], [25, 'That is after 1 week.', 'What is y when x = 0?']] },
      { id: 'u6p7', std: F2, q: 'In <span class="m">y = 5x + 20</span>, what is the <b>rate</b> (amount added each week)?', ans: 5, unit: 'dollars', hint: 'The rate is the number next to x.', miss: [[20, '20 is the start value.', 'Which number is next to x?']] },
      { id: 'u6p8', std: F4, q: 'What is the slope of this line?', fig: planeSvg({ min: -2, max: 8, size: 220, lines: [[0.5, 1, C.blue]], pts: [[0, 1, '(0, 1)'], [4, 3, '(4, 3)']] }), ans: 0.5, neg: 1, hint: 'Use the two marked points: rise ÷ run.', miss: [[2, 'That is run ÷ rise (4 ÷ 2).', 'Which goes on top: rise or run?'], [1, '1 is the y-intercept.', 'Use rise ÷ run.']], sol: ['rise = 3 − 1 = 2', 'run = 4 − 0 = 4', 'slope = 2 ÷ 4 = 1/2'] },
      { id: 'u6p9', std: EE8, q: 'Solve the system: <span class="m">y = x + 2</span> and <span class="m">y = 3x</span>.', ch: ['(1, 3)', ['(3, 1)', 'x and y are switched.', 'Which number is x?'], ['(2, 4)', 'Check y = 3x: 3(2) = 6, not 4.', 'Does (2, 4) work in both?'], ['(0, 2)', 'Check y = 3x: 3(0) = 0, not 2.', 'Does (0, 2) work in both?']], hint: 'Set them equal: x + 2 = 3x. Solve for x, then find y.',
        steps: [{ q: 'Both equations say what y is. Set them equal.', ch: ['x + 2 = 3x', ['x + 2 = y', 'We want one equation with only x.', 'What does y equal in each equation?']], eq: 'x + 2 = 3x' }, { q: 'Get the x’s together.', ch: ['Subtract x from both sides', ['Add x to both sides', 'That does not cancel.', 'What cancels x on the left?']], eq: '2 = 2x', lab: 'Subtract x' }, { q: 'Find x.', ch: ['Divide by 2: x = 1', ['Subtract 2: x = 0', '2 is multiplied by x.', 'What undoes ×?']], eq: '1 = x', lab: 'Divide by 2' }, { q: 'Find y: y = 3x with x = 1.', ch: ['y = 3, so (1, 3)', ['y = 1', 'y = 3(1).', 'What is 3 × 1?']], ln: '(1, 3)' }],
        sol: [{ eq: 'x + 2 = 3x' }, { eq: '2 = 2x', lab: 'Subtract x' }, { eq: '1 = x', lab: 'Divide by 2' }, 'y = 3(1) = 3 → (1, 3)'] },
      { id: 'u6p10', std: F5, q: 'A runner’s distance-from-home graph is <b>flat</b> for a while. What is the runner doing?', keep: 1, ch: ['Stopped: the distance is not changing', ['Running faster', 'Faster would make the graph steeper.', 'Is a flat graph changing?'], ['Running home', 'Going home makes the distance smaller: the graph goes down.', 'Does a flat graph go down?']], hint: 'Flat means the y-value stays the same.' },
      { id: 'u6p11', std: F4, q: '<b>Find the mistake.</b> For (2, 1) and (4, 7), Kai wrote: <span class="m">slope = (4 − 2) ÷ (7 − 1) = 2 ÷ 6 = 1/3</span>. What went wrong?', wide: 1, ch: ['Kai put the run on top. Slope = rise ÷ run = 6 ÷ 2 = 3.', ['Kai is right.', 'Check: the line goes up 6 while going across 2.', 'Which is on top: rise or run?'], ['Kai should add: (4 + 2) ÷ (7 + 1).', 'Slope uses the changes, so subtract.', 'Add or subtract?'], ['The slope should be negative.', 'From (2, 1) to (4, 7) the line goes up.', 'Uphill or downhill?']], hint: 'Which goes on top: the change in y or the change in x?' }
    ]
  });
})();
