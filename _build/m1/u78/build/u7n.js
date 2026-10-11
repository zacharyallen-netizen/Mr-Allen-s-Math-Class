const L = require('../lib/common.js');
const F = require('../lib/figs.js');
const { G, C, fmt, pt, fr, rad, fig, figHtml, two, vocab, howto, example, q, mc, mistake, widget, yt, page } = L;
const { Q, QV, pgraph, feats, rangeBand, poly, vform, polyA } = require('./u7common.js');
G.prefix = 'u7n'; G.n = 0;

const S = [];
const sec = (id, n, title, html) => S.push(`<section class="topic" id="${id}">\n  <h2><span class="num">${n}</span> ${title}</h2>\n${html}\n</section>`);

/* ================= 1. Key features ================= */
{
  const q1 = QV(1, 1, -4); // y = (x−1)² − 4 = x² − 2x − 3
  const P = pgraph(q1.f, [-6, 6, -6, 4], { H: 260 });
  feats(P, q1, { axis: { c: C.blue, text: 'axis x = 1', y: 3.4 }, zeros: { c: C.blue, pos: ['nw', 'ne'] }, yint: { c: C.blue, text: 'y-int (0, −3)', pos: 'w' }, vertex: { c: C.blue, text: 'vertex (1, −4)', pos: 'e' } });
  const up = pgraph(x => x * x, [-3, 3, -4, 4], { W: 240, H: 200 }); up.dot(0, 0, { c: C.blue }); up.text(0, 1.7, 'minimum', { c: C.blue, fs: 11, bold: true, anchor: 'middle' });
  const dn = pgraph(x => -x * x, [-3, 3, -4, 4], { W: 240, H: 200 }); dn.dot(0, 0, { c: C.blue }); dn.text(0, -2.1, 'maximum', { c: C.blue, fs: 11, bold: true, anchor: 'middle' });

  const e = Q(-1, 2, 3); // y = −x² + 2x + 3
  const pe = pgraph(e.f, [-4, 6, -6, 6], { H: 260 });
  const pe2 = pgraph(e.f, [-4, 6, -6, 6], { H: 260 });
  feats(pe2, e, { axis: { c: C.green, text: 'x = 1', y: 5.3 }, zeros: { c: C.green, pos: ['nw', 'ne'] }, yint: { c: C.green, text: '(0, 3)', pos: 'w' }, vertex: { c: C.green, text: 'max (1, 4)', pos: 'e' } });

  const mq = Q(1, -4, 3);
  const pm = pgraph(mq.f, [-2, 6, -3, 6], { H: 240 });
  const pm2 = pgraph(mq.f, [-2, 6, -3, 6], { H: 240 });
  feats(pm2, mq, { axis: { c: C.green, text: 'axis x = 2', y: 5.3 }, vertex: { c: C.green, text: '(2, −1)', pos: 'e' } });

  const t = Q(1, 2, -8); // (x+4)(x−2)
  const yv = [-7, 5, -10, 6];
  const tg = () => pgraph(t.f, yv, { H: 300, ly: 2 });
  const tg0 = tg();
  const tA = tg(); feats(tA, t, { vertex: { c: C.green, text: 'vertex (−1, −9)', pos: 'e' } });
  const tB = tg(); feats(tB, t, { axis: { c: C.green, text: 'x = −1', y: 5.2 } });
  const tC = tg(); feats(tC, t, { zeros: { c: C.green, pos: ['nw', 'ne'] } });
  const tD = tg(); feats(tD, t, { yint: { c: C.green, text: '(0, −8)', pos: 'e' } });

  sec('t1', 1, 'Key Features of a Parabola', `
${vocab([
  ['quadratic function', 'a function where the biggest power of x is 2 (it has an x²). Example: y = x² − 2x − 3.'],
  ['parabola', 'the U-shaped graph of a quadratic function.'],
  ['vertex', 'the turning point of the parabola. It is the lowest point or the highest point.'],
  ['axis of symmetry', 'the vertical line through the vertex. It cuts the parabola into two mirror halves. We write it as x = (a number).'],
  ['zeros', 'the x-values where the graph crosses the x-axis. There, y = 0. Zeros are also called <b>roots</b> or <b>x-intercepts</b>.'],
  ['y-intercept', 'the point where the graph crosses the y-axis. There, x = 0.'],
  ['maximum / minimum', 'the highest / lowest y-value on the graph. The vertex is one of these.']
])}
<div class="key"><strong>📌</strong> <strong>Vertex</strong> = max or min. <strong>Axis of symmetry</strong> = vertical line through the vertex. <strong>x-intercepts</strong> = zeros. Opens up (a &gt; 0, has a min) or down (a &lt; 0, has a max).</div>
${fig(P.out('parabola y = (x − 1)² − 4 with features labelled'), 'y = (x − 1)² − 4 (same as y = x² − 2x − 3): vertex (1, −4), axis x = 1, zeros −1 &amp; 3, y-int −3')}
${two(fig(up.out('y = x squared opens up'), '<b>a &gt; 0</b> (y = x²): opens <b>up</b>, vertex is a <b>minimum</b>'), fig(dn.out('y = negative x squared opens down'), '<b>a &lt; 0</b> (y = −x²): opens <b>down</b>, vertex is a <b>maximum</b>'))}
${widget('abc')}
${howto('How to read the features from a graph', [
  'Look at the arms. Up like a cup → opens up. Down like a hill → opens down.',
  'Find the turning point. That is the <b>vertex</b>. Write it as (x, y).',
  'Opens up → the vertex is a <b>minimum</b>. Opens down → it is a <b>maximum</b>.',
  'Draw a vertical line through the vertex. That is the <b>axis of symmetry</b>: x = (x-value of the vertex).',
  'Find where the graph crosses the x-axis. Those x-values are the <b>zeros</b>.',
  'Find where the graph crosses the y-axis. That is the <b>y-intercept</b>.'
])}
${example('e71', { title: 'Worked example: read the features of y = −x² + 2x + 3', fig: fig(pe.out('graph of y = −x² + 2x + 3'), 'The graph of y = −x² + 2x + 3'),
  steps: [['Up or down?', 'a = −1 is negative, so it opens down. The vertex is a maximum.'],
    ['Vertex (turning point):', '(1, 4)'],
    ['Axis of symmetry:', 'x = 1'],
    ['Zeros (crosses the x-axis):', 'x = −1 and x = 3'],
    ['y-intercept (crosses the y-axis):', '(0, 3). Notice c = 3 in the equation!']],
  after: fig(pe2.out('features of y = −x² + 2x + 3'), 'Every feature, in green') })}
${mistake('m71', { who: 'Ava read this graph of y = x² − 4x + 3:', fig: fig(pm.out('graph of y = x² − 4x + 3')),
  work: ['Opens up, so the vertex is a minimum.', 'Vertex: (2, −1)', 'Axis of symmetry: y = 2', 'Zeros: x = 1 and x = 3'], bad: 2,
  fbs: ['Step 1 is right. The arms point up, so the vertex is the lowest point.', 'Step 2 is right. The turning point is at (2, −1).', '', 'Step 4 is right. The graph crosses the x-axis at 1 and 3.'],
  why: 'The axis of symmetry is a vertical line. Vertical lines are written “x = …”. The axis is x = 2, not y = 2.',
  after: fig(pm2.out('axis x = 2'), 'Fixed: the axis of symmetry is x = 2') })}
${yt()}
${fig(tg0.out('graph of y = x² + 2x − 8'), 'Use this graph of y = x² + 2x − 8 for Questions 1–4.')}
${q('n71a', { n: 1, text: 'What is the vertex?', t: 'pt', a: [t.h, t.k], ph: '(x, y)', traps: [{ v: [1, -9], m: 'The vertex is to the LEFT of the y-axis, so its x-value is negative.' }],
  sol: 'The turning point is 1 left and 9 down → <b>(−1, −9)</b>.', after: fig(tA.out('vertex'), 'vertex (−1, −9)') })}
${q('n71b', { n: 2, text: 'What is the axis of symmetry?', t: 'num', a: t.h, axis: true, ph: 'x = ?', traps: [{ v: -9, m: '−9 is the y-value of the vertex. The axis uses the x-value.' }, { v: 1, m: 'Check the sign. The vertex is left of the y-axis.' }],
  sol: 'Vertical line through the vertex (−1, −9) → <b>x = −1</b>.', after: fig(tB.out('axis'), 'axis x = −1') })}
${q('n71c', { n: 3, text: 'What are the zeros?', t: 'set', a: t.zeros, ph: 'x = ?, ?',
  sol: 'The graph crosses the x-axis at <b>x = −4 and x = 2</b>.', after: fig(tC.out('zeros'), 'zeros −4 and 2') })}
${q('n71d', { n: 4, text: 'What is the y-intercept?', t: 'num', a: t.c, yint: true, ph: '(0, ?)', traps: [{ v: -9, m: '−9 is the bottom of the graph (the vertex). The y-intercept is where the graph crosses the y-axis.' }],
  sol: 'The graph crosses the y-axis at <b>(0, −8)</b>. That is c = −8.', after: fig(tD.out('y-intercept'), 'y-intercept (0, −8)') })}
`);
}

/* ================= 2. Graphing ================= */
{
  const e = Q(1, -2, -3);
  const box = F.boxMethod({ top: ['x', '+1'], left: ['x', '−3'], cells: [['x²', 'x'], ['−3x', '−3']] });
  const P = pgraph(e.f, [-3, 5, -5, 5], { H: 260 });
  feats(P, e, { axis: { c: C.green, text: 'x = 1', y: 4.4 }, zeros: { c: C.green, pos: ['nw', 'ne'] }, vertex: { c: C.green, text: '(1, −4)', pos: 'e' } });
  P.dot(0, -3, { c: C.green }); P.lab(0, -3, '(0, −3)', 'w', { c: C.green, fs: 11 });
  P.dot(2, -3, { c: C.green }); P.lab(2, -3, '(2, −3)', 'e', { c: C.green, fs: 11 });

  const e2 = Q(1, -4, 1);
  const dec = F.decoder([{ t: 'y = ' }, { t: 'x²', lab: 'a = 1' }, { t: ' − 4x', lab: 'b = −4' }, { t: ' + 1', lab: 'c = 1' }]);
  const P2 = pgraph(e2.f, [-2, 6, -4, 6], { H: 250 });
  feats(P2, e2, { axis: { c: C.green, text: 'x = 2', y: 5.3 }, vertex: { c: C.green, text: '(2, −3)', pos: 'e' } });
  [0, 1, 3, 4].forEach(x => P2.dot(x, e2.f(x), { c: C.green, r: 4 }));
  const tbl2 = F.vt(['x', 'y'], [[0, 1, 2, 3, 4], [0, 1, 2, 3, 4].map(x => fmt(e2.f(x)))]);

  const mq = Q(1, 6, 5);
  const pm = pgraph(mq.f, [-7, 2, -5, 6], { H: 250 });
  feats(pm, mq, { axis: { c: C.green, text: 'x = −3', y: 5.2 }, zeros: { c: C.green, pos: ['nw', 'ne'] }, vertex: { c: C.green, text: '(−3, −4)', pos: 'e' } });

  const t = Q(1, -6, 8);
  const tbox = F.boxMethod({ top: ['x', '?'], left: ['x', '?'], cells: [['x²', '?'], ['?', '8']] });
  const tg = () => pgraph(t.f, [-1, 7, -3, 9], { H: 270 });
  const gA = tg(); feats(gA, t, { zeros: { c: C.green, pos: ['nw', 'ne'] } });
  const gB = tg(); feats(gB, t, { axis: { c: C.green, text: 'x = 3', y: 8.2 } });
  const gC = tg(); feats(gC, t, { vertex: { c: C.green, text: '(3, −1)', pos: 'e' } });
  const gD = tg(); feats(gD, t, { yint: { c: C.green, text: '(0, 8)', pos: 'e' } });

  sec('t2', 2, 'Graphing Quadratics', `
${vocab([
  ['standard form', 'y = ax² + bx + c. The letters a, b and c stand for numbers, and a is not 0.'],
  ['factored form', 'y = a(x − p)(x − q). The zeros are x = p and x = q.'],
  ['midpoint', 'the number exactly halfway between two numbers. Add them and divide by 2.']
])}
<div class="key"><strong>📌</strong> From factored form: plot the <strong>zeros</strong>, find the axis = midpoint of zeros, then the <strong>vertex</strong>, then a couple of symmetric points.</div>
${howto('How to graph y = ax² + bx + c', [
  'Factor. Set each factor equal to 0. Solve. These are the <b>zeros</b>.',
  `Find the axis: x = ${fr('p + q', '2')} (halfway between the zeros). If it does not factor, use x = ${fr('−b', '2a')}.`,
  'Put that x-value into the function. The answer is the y-value of the <b>vertex</b>.',
  'The <b>y-intercept</b> is c. Plot (0, c).',
  'Mirror (0, c) across the axis to get one more point.',
  'Connect the points with a smooth U shape.'
])}
  <div class="example">
    <h4>Graph y = x² − 2x − 3</h4>
    ${fig(box, 'Box method: x² − 2x − 3 = (x − 3)(x + 1)')}
    <div class="steps" data-example="e72">
      <div class="step" onclick="reveal(this)"><strong>Step 1. Factor → zeros:</strong> (x − 3)(x + 1) →<span class="placeholder"> click to reveal</span><span class="hidden-content"> x = 3, x = −1</span></div>
      <div class="step" onclick="reveal(this)"><strong>Step 2. Axis = midpoint:</strong> ${fr('3 + (−1)', '2')} =<span class="placeholder"> click to reveal</span><span class="hidden-content"> x = 1</span></div>
      <div class="step" onclick="reveal(this)"><strong>Step 3. Vertex (plug x = 1):</strong> 1² − 2(1) − 3 =<span class="placeholder"> click to reveal</span><span class="hidden-content"> −4, so the vertex is (1, −4)</span></div>
      <div class="step" onclick="reveal(this)"><strong>Step 4. y-intercept:</strong> c = −3 →<span class="placeholder"> click to reveal</span><span class="hidden-content"> (0, −3)</span></div>
      <div class="step final" onclick="reveal(this)"><strong>✓ Step 5. Mirror point:</strong> (0, −3) is 1 left of the axis, so 1 right is<span class="placeholder"> click to reveal</span><span class="hidden-content"> (2, −3). Connect all 5 points with a smooth U.</span></div>
    </div>
    <button class="reveal-all" onclick="revealAll('e72')">Reveal all steps</button>
    <div class="after">${fig(P.out('graph of y = x² − 2x − 3'), 'The finished graph: zeros, axis, vertex, y-intercept and mirror point')}</div>
  </div>
${example('e72b', { title: 'Worked example: graph y = x² − 4x + 1 (it does not factor)', fig: fig(dec, 'Read a, b and c first'),
  steps: [['Read a, b, c:', 'a = 1, b = −4, c = 1'],
    [`Axis: x = ${fr('−b', '2a')} =`, `${fr('−(−4)', '2(1)')} = ${fr('4', '2')} = 2, so x = 2`],
    ['Vertex: put that x-value into the function:', '2² − 4(2) + 1 = 4 − 8 + 1 = −3 → (2, −3)'],
    ['y-intercept and its mirror:', '(0, 1) is 2 left of the axis, so (4, 1) is 2 right'],
    ['Make a table and connect the dots:', 'x = 1 and x = 3 both give y = −2 (mirror pair)']],
  after: figHtml(`<div class="table-wrap">${tbl2}</div>`, 'Table of values') + fig(P2.out('graph of y = x² − 4x + 1'), 'Graph of y = x² − 4x + 1') })}
${mistake('m72', { who: 'Leo is graphing y = x² + 6x + 5:', text: 'Which step has the <b>first</b> mistake?',
  work: ['Factor: (x + 1)(x + 5)', 'Zeros: x = 1 and x = 5', `Axis: x = ${fr('1 + 5', '2')} = 3`, 'Vertex: 3² + 6(3) + 5 = 32 → (3, 32)'], bad: 1,
  fbs: ['Step 1 is right: 1 × 5 = 5 and 1 + 5 = 6.', '', 'Step 3 uses the zeros from Step 2. The method is right, but the numbers came from a mistake earlier.', 'Step 4 uses the axis from Step 3. Look for the FIRST mistake.'],
  why: 'If a factor is (x + 1), then x + 1 = 0, so x = −1. The zeros are −1 and −5. Then the axis is x = −3 and the vertex is (−3, −4).',
  after: fig(pm.out('correct graph'), 'Fixed: zeros −5 and −1, axis x = −3, vertex (−3, −4)') })}
${yt('Your turn: graph y = x² − 6x + 8')}
${fig(tbox, 'Fill the box: two numbers that multiply to 8 and add to −6.')}
${q('n72a', { n: 1, text: 'What are the zeros of y = x² − 6x + 8?', t: 'set', a: t.zeros, ph: 'x = ?, ?', traps: [{ v: [-4, -2], m: '(x − 2)(x − 4) = 0 gives x = 2 and x = 4. The zero has the opposite sign of the number in the factor.' }],
  sol: 'x² − 6x + 8 = (x − 2)(x − 4). So <b>x = 2 and x = 4</b>.', after: fig(gA.out('zeros'), 'zeros 2 and 4') })}
${q('n72b', { n: 2, text: 'What is the axis of symmetry?', t: 'num', a: t.h, axis: true, ph: 'x = ?', sol: `x = ${fr('2 + 4', '2')} = <b>3</b>, so the axis is x = 3.`, after: fig(gB.out('axis'), 'axis x = 3') })}
${q('n72c', { n: 3, text: 'What is the vertex?', t: 'pt', a: [t.h, t.k], ph: '(x, y)', traps: [{ v: [3, 8], m: '8 is the y-intercept. Put x = 3 into the function to get the vertex y-value.' }],
  sol: '3² − 6(3) + 8 = 9 − 18 + 8 = −1 → <b>(3, −1)</b>.', after: fig(gC.out('vertex'), 'vertex (3, −1)') })}
${q('n72d', { n: 4, text: 'What is the y-intercept?', t: 'num', a: t.c, yint: true, ph: '(0, ?)', sol: 'c = 8 → <b>(0, 8)</b>.', after: fig(gD.out('y-intercept'), 'y-intercept (0, 8)') })}
`);
}

/* ================= 3. Vertex form vs standard form ================= */
{
  const one = QV(1, 1, -4);
  const P = pgraph(one.f, [-4, 6, -6, 5], { H: 260 });
  feats(P, one, { zeros: { c: C.blue, pos: ['nw', 'ne'], texts: ['zero −1', 'zero 3'] }, yint: { c: C.gold, text: 'y-int (0, −3)', pos: 'w' }, vertex: { c: C.green, text: 'vertex (1, −4)', pos: 'e' } });
  const tbl = `<table class="vt vt-text"><tr><th>Form &amp; equation</th><th>Shows you fast</th></tr>
<tr><td><b>Standard</b><br>y = x² − 2x − 3</td><td style="color:#8A6400;font-weight:700">y-intercept (0, −3)</td></tr>
<tr><td><b>Factored</b><br>y = (x − 3)(x + 1)</td><td style="color:#0056B3;font-weight:700">zeros 3 and −1</td></tr>
<tr><td><b>Vertex</b><br>y = (x − 1)² − 4</td><td style="color:#15803D;font-weight:700">vertex (1, −4)</td></tr></table>`;

  const e = QV(2, 1, -8);
  const dec = F.decoder([{ t: 'y = ' }, { t: '2', lab: 'a = 2' }, { t: '(x − ' }, { t: '1', lab: 'h = 1' }, { t: ')²' }, { t: ' − 8', lab: 'k = −8' }]);
  const pe = pgraph(e.f, [-3, 5, -9, 6], { H: 270 });
  feats(pe, e, { vertex: { c: C.green, text: 'vertex (1, −8)', pos: 'e' }, yint: { c: C.green, text: '(0, −6)', pos: 'w' }, zeros: { c: C.green, pos: ['nw', 'ne'] } });

  const e2 = QV(-1, -2, 1);
  const dec2 = F.decoder([{ t: 'y = ' }, { t: '−', lab: 'a = −1' }, { t: '(x + ' }, { t: '2', lab: 'h = −2' }, { t: ')²' }, { t: ' + 1', lab: 'k = 1' }]);
  const pe2 = pgraph(e2.f, [-6, 3, -6, 3], { H: 240 });
  feats(pe2, e2, { axis: { c: C.green, text: 'x = −2', y: -5.4 }, vertex: { c: C.green, text: 'max (−2, 1)', pos: 'e' } });

  const mq = QV(1, -4, -2);
  const pm = pgraph(mq.f, [-8, 2, -4, 6], { H: 240 });
  feats(pm, mq, { vertex: { c: C.green, text: '(−4, −2)', pos: 'e' }, axis: { c: C.green, text: 'x = −4', y: 5.3 } });

  const t = QV(1, 3, -1);
  const tdec = F.decoder([{ t: 'y = ' }, { t: '(x − 3)', lab: 'h = ?', c: 'gold' }, { t: '²' }, { t: ' − 1', lab: 'k = ?', c: 'gold' }]);
  const tbox = F.boxMethod({ top: ['x', '−3'], left: ['x', '−3'], cells: [['?', '?'], ['?', '?']] });
  const tboxA = F.boxMethod({ top: ['x', '−3'], left: ['x', '−3'], cells: [['x²', '−3x'], ['−3x', '9']], green: true });
  const g = () => pgraph(t.f, [-1, 7, -3, 9], { H: 260 });
  const gA = g(); feats(gA, t, { vertex: { c: C.green, text: 'vertex (3, −1)', pos: 'e' } });
  const gB = g(); feats(gB, t, { vertex: { c: C.green, text: '(3, −1)', pos: 'e' }, yint: { c: C.green, text: '(0, 8)', pos: 'e' } });

  sec('t3', 3, 'Vertex Form vs. Standard Form', `
${vocab([
  ['vertex form', 'y = a(x − h)² + k. The vertex is the point (h, k).'],
  ['h', 'the x-value of the vertex. Inside the parentheses it shows with the <b>opposite sign</b>: (x − 3) means h = 3, and (x + 3) means h = −3.'],
  ['k', 'the y-value of the vertex. It is the number added at the end. Keep its sign.'],
  ['expand', 'multiply out the parentheses and combine like terms.']
])}
<div class="key"><strong>📌</strong> One parabola can be written three ways. They are all equal! Each form shows one feature fast.</div>
${figHtml(`<div class="table-wrap">${tbl}</div>`, 'Three forms of the same function')}
${fig(P.out('one parabola, three features'), 'Same graph: the <b style="color:#15803D">vertex</b> comes from vertex form, the <b style="color:#0056B3">zeros</b> from factored form, the <b style="color:#8A6400">y-intercept</b> from standard form.')}
${widget('vtx', { h0: 1, k0: -4, a0: 1 })}
${howto('How to read vertex form y = a(x − h)² + k', [
  'Find a: the number in front. a &gt; 0 opens up. a &lt; 0 opens down.',
  'Find h: look inside the parentheses and <b>flip the sign</b>. (x − 3) → h = 3. (x + 3) → h = −3.',
  'Find k: the number at the end. Keep its sign.',
  'Write the vertex as (h, k).'
])}
${howto('How to change vertex form into standard form', [
  'Write (x − h)² as (x − h)(x − h). Multiply it out (use a box).',
  'Multiply every term by a.',
  'Add k to the number term.',
  'Check: put x = 0 into both forms. You should get the same y.'
])}
${example('e73', { title: 'Worked example: y = 2(x − 1)² − 8', fig: fig(dec, 'Decode the vertex form'),
  steps: [['Vertex:', 'h = 1 and k = −8, so the vertex is (1, −8). a = 2 &gt; 0, so it opens up.'],
    ['Square the binomial:', '(x − 1)² = (x − 1)(x − 1) = x² − 2x + 1'],
    ['Multiply by a = 2:', '2x² − 4x + 2'],
    ['Add k = −8:', 'y = 2x² − 4x − 6'],
    ['Check with x = 0:', 'Vertex form: 2(0 − 1)² − 8 = 2 − 8 = −6. Standard form: c = −6. ✓ Same!']],
  after: fig(pe.out('graph of y = 2(x − 1)² − 8'), 'y = 2(x − 1)² − 8 = 2x² − 4x − 6: vertex (1, −8), y-int (0, −6), zeros −1 and 3') })}
${example('e73b', { title: 'Worked example: y = −(x + 2)² + 1', fig: fig(dec2, 'The minus sign in front means a = −1'),
  steps: [['Find a:', 'a = −1, so it opens down. The vertex is a maximum.'],
    ['Find h:', '(x + 2) means h = −2 (flip the sign).'],
    ['Find k:', 'k = 1'],
    ['Vertex and max:', 'vertex (−2, 1). The maximum value is 1.']],
  after: fig(pe2.out('graph of y = −(x + 2)² + 1'), 'Opens down, max (−2, 1), axis x = −2') })}
${mistake('m73', { who: 'Jada found the vertex of y = (x + 4)² − 2:',
  work: ['Vertex form is y = a(x − h)² + k.', '(x + 4), so h = 4.', 'The number at the end is −2, so k = −2.', 'Vertex: (4, −2)'], bad: 1,
  fbs: ['Step 1 is right. That is the pattern for vertex form.', '', 'Step 3 is right: k = −2.', 'Step 4 uses h from Step 2. Look for the first mistake.'],
  why: '(x + 4) is the same as (x − (−4)). So h = −4 and the vertex is (−4, −2).',
  after: fig(pm.out('vertex (−4, −2)'), 'Fixed: vertex (−4, −2)') })}
${yt()}
${q('n73a', { n: 1, text: 'What is the vertex of y = (x − 3)² − 1?', fig: fig(tdec), t: 'pt', a: [t.h, t.k], ph: '(h, k)', traps: [{ v: [-3, -1], m: '(x − 3) means h = +3. Inside the parentheses, the sign flips.' }, { v: [3, 1], m: 'k keeps its sign. The number at the end is −1.' }],
  sol: 'h = 3 (flip the sign of −3), k = −1 → <b>(3, −1)</b>.', after: fig(gA.out('vertex'), 'vertex (3, −1)') })}
${mc('n73b', { n: 2, text: 'Does y = (x − 3)² − 1 open up or down?', fig: '', opts: [
  { t: 'Up', ok: 1 }, { t: 'Down', fb: 'There is no minus sign in front, so a = 1. Positive a opens up.' }],
  why: 'a = 1 is positive, so the parabola opens up. The vertex (3, −1) is a minimum.' })}
${q('n73c', { n: 3, text: 'Write y = (x − 3)² − 1 in standard form.', fig: fig(tbox, 'Box for (x − 3)(x − 3)'), t: 'expr', form: 'std', a: polyA(t.a, t.b, t.c), ph: 'y = x^2 + ...',
  traps: [{ v: 'x^2+9-1', m: '(x − 3)² is not x² + 9. Multiply (x − 3)(x − 3): you also get two −3x terms.' }, { v: 'x^2-9-1', m: '(x − 3)² is not x² − 9. Use the box: x², −3x, −3x and +9.' }, { v: 'x^2-6x+9', m: 'Good squaring! Now add k = −1 to the 9.' }],
  sol: '(x − 3)² = x² − 6x + 9. Then add −1: <b>y = x² − 6x + 8</b>.', after: fig(tboxA, '(x − 3)² = x² − 6x + 9') + fig(gB.out('same graph'), 'Both forms make the same graph. y-int (0, 8) = c ✓') })}
`);
}

/* ================= 4. Domain, range, end behavior ================= */
{
  const d1 = Q(-1, 0, 4);
  const P = pgraph(d1.f, [-4, 4, -5, 6], { H: 250 });
  rangeBand(P, d1, C.green);
  feats(P, d1, { vertex: { c: C.blue, text: 'max (0, 4)', pos: 'e' }, zeros: { c: C.blue, text: false } });
  P.text(3.6, 1.5, 'range', { c: C.green, fs: 11, anchor: 'end', bold: true, dx: -6 });
  const d2 = Q(1, -2, -3);
  const P2 = pgraph(d2.f, [-3, 5, -5, 6], { H: 250 });
  rangeBand(P2, d2, C.green);
  feats(P2, d2, { vertex: { c: C.blue, text: 'min (1, −4)', pos: 'e' } });
  P2.text(4.6, 1, 'range', { c: C.green, fs: 11, anchor: 'end', bold: true, dx: -6 });
  P2.text(-2.2, 5.2, '↑ end', { c: C.blue, fs: 11, anchor: 'middle', bold: true });
  P2.text(4.1, 5.2, 'end ↑', { c: C.blue, fs: 11, anchor: 'middle', bold: true, dx: -10 });

  const e = QV(-2, 1, 3);
  const dec = F.decoder([{ t: 'y = ' }, { t: '−2', lab: 'a = −2' }, { t: '(x − 1)²' , lab: 'h = 1' }, { t: ' + 3', lab: 'k = 3' }]);
  const pe = pgraph(e.f, [-3, 5, -6, 5], { H: 250 });
  rangeBand(pe, e, C.green); feats(pe, e, { vertex: { c: C.green, text: 'max (1, 3)', pos: 'e' } });

  const mq = QV(1, 2, -5);
  const pm = pgraph(mq.f, [-3, 6, -6, 5], { H: 250 });
  rangeBand(pm, mq, C.green); feats(pm, mq, { vertex: { c: C.green, text: 'min (2, −5)', pos: 'w' } });

  const t = Q(1, 4, -1);
  const xs = [-5, -4, -3, -1, 0, 1];
  const tt = F.vt(['x', 'y'], [[-5, -4, -3, '?', -1, 0, 1], [...xs.slice(0, 3).map(x => fmt(t.f(x))), '?', ...xs.slice(3).map(x => fmt(t.f(x)))]]);
  const pt1 = pgraph(t.f, [-6, 2, -6, 5], { H: 250 });
  rangeBand(pt1, t, C.green); feats(pt1, t, { vertex: { c: C.green, text: 'min (−2, −5)', pos: 'e' } });
  const t2 = Q(-3, 1, 2);
  const tdec2 = F.decoder([{ t: 'y = ' }, { t: '−3x²', lab: 'a = −3' }, { t: ' + x + 2' }]);
  const pt2 = pgraph(t2.f, [-3, 3, -6, 4], { H: 220 });
  pt2.text(-2.4, -5, '↓', { c: C.green, fs: 16, bold: true, anchor: 'middle' }); pt2.text(2.6, -5, '↓', { c: C.green, fs: 16, bold: true, anchor: 'middle' });

  sec('t4', 4, 'Domain, Range &amp; End Behavior', `
${vocab([
  ['domain', 'all the x-values you are allowed to put in. For a quadratic, that is <b>all real numbers</b>.'],
  ['range', 'all the y-values the graph reaches. It starts at the vertex.'],
  ['end behavior', 'what the two arms do far to the left and far to the right (both up or both down).'],
  ['interval notation', 'a short way to write a range. [−4, ∞) means −4 and everything bigger. A square bracket [ ] means “include this number.” ∞ always gets a round bracket ( ).']
])}
<div class="key"><strong>📌</strong> Domain = all real numbers. Range = y ≥ min (opens up) or y ≤ max (opens down). End behavior: both ends up (a &gt; 0) or both down (a &lt; 0).</div>
${two(fig(P.out('y = −x² + 4 with its range'), 'y = −x² + 4 opens down: max (0,4), range y ≤ 4, or (−∞, 4]'), fig(P2.out('y = x² − 2x − 3 with its range'), 'y = x² − 2x − 3 opens up: min −4, range y ≥ −4, or [−4, ∞). Both ends go up.'))}
${howto('How to find the domain and range', [
  'Domain: write <b>all real numbers</b>. (You can put in any x.)',
  'Find the vertex. Its y-value is k.',
  'Opens up → range is y ≥ k. Opens down → range is y ≤ k.',
  'Interval notation: opens up → [k, ∞). Opens down → (−∞, k].',
  'End behavior: a &gt; 0 → both ends go up. a &lt; 0 → both ends go down.'
])}
${example('e74', { title: 'Worked example: y = −2(x − 1)² + 3', fig: fig(dec, 'Decode first'),
  steps: [['Domain:', 'all real numbers'], ['Vertex:', '(1, 3)'], ['Up or down?', 'a = −2 &lt; 0, so it opens down. 3 is the maximum.'],
    ['Range:', 'y ≤ 3, or (−∞, 3]'], ['End behavior:', 'both ends go down']],
  after: fig(pe.out('graph with range'), 'The green bar shows the range: 3 and below') })}
${mistake('m74', { who: 'Marcus found the range of y = (x − 2)² − 5:',
  work: ['Domain: all real numbers', 'Vertex: (2, −5)', 'Opens up, because a = 1 &gt; 0', 'Range: y ≥ 2'], bad: 3,
  fbs: ['Step 1 is right.', 'Step 2 is right: h = 2, k = −5.', 'Step 3 is right.', ''],
  why: 'Range is about y-values. Use k = −5 (the y of the vertex), not h = 2. The range is y ≥ −5, or [−5, ∞).',
  after: fig(pm.out('range'), 'Fixed: range y ≥ −5') })}
${yt()}
${figHtml(`<div class="table-wrap">${tt}</div>`, 'Table for y = x² + 4x − 1. Use the mirror pattern to find the missing middle column.')}
${q('n74a', { n: 1, text: 'What is the range of y = x² + 4x − 1? (Use y ≥ … or interval notation.)', t: 'ineq', a: { op: '>=', v: t.k }, ph: 'y >= ?',
  traps: [{ v: { op: '>=', v: -2 }, m: '−2 is the x-value of the vertex. The range uses the y-value: put x = −2 into the function.' }, { v: { op: '<=', v: -5 }, m: 'This parabola opens UP (a = 1), so the y-values go up from the minimum: use ≥.' }],
  sol: `Axis: x = ${fr('−4', '2(1)')} = −2. y = (−2)² + 4(−2) − 1 = 4 − 8 − 1 = −5. Opens up → <b>y ≥ −5</b>, or <b>[−5, ∞)</b>.`, after: fig(pt1.out('range'), 'range y ≥ −5') })}
${mc('n74b', { n: 2, text: 'What is the domain of y = x² + 4x − 1?', opts: [
  { t: 'All real numbers', ok: 1 }, { t: 'y ≥ −5', fb: 'That is the range (y-values). Domain is about x-values.' }, { t: 'x ≥ −2', fb: 'You can put in ANY x-value, even ones left of the vertex.' }, { t: 'x ≥ 0', fb: 'Negative x-values work too. Try x = −3: you get a real answer.' }],
  why: 'You can put any x into a quadratic, so the domain is all real numbers.' })}
${mc('n74c', { n: 3, text: 'Describe the end behavior of y = −3x² + x + 2.', fig: fig(tdec2), opts: [
  { t: 'Both ends go down', ok: 1 }, { t: 'Both ends go up', fb: 'Look at a. It is −3 (negative). Negative a opens down.' }, { t: 'Left end up, right end down', fb: 'A parabola is symmetric, so both arms go the same way.' }, { t: 'Left end down, right end up', fb: 'That is how a line with positive slope looks, not a parabola.' }],
  why: 'a = −3 is negative, so the parabola opens down and both ends go down.', after: fig(pt2.out('end behavior'), 'Both ends go down') })}
`);
}

/* ================= 5. Creating quadratic equations ================= */
{
  const model = F.areaModel({ wLab: 'w + 2', hLab: 'w', inside: 'Area = 24' });
  const modelA = F.areaModel({ wLab: 'length = 6', hLab: 'w = 4', inside: '4 × 6 = 24', wc: C.green, hc: C.green, ic: C.green });
  const pr = Q(-16, 32, 48);
  const sc = F.scene({ eq: 'h(t) = −16t² + 32t + 48' });
  const pp = pgraph(pr.f, [0, 3.5, 0, 70], { H: 250, gx: 0.5, lx: 1, gy: 10, ly: 10, xname: 't (s)', yname: 'h (ft)' });
  pp.dot(0, 48, { c: C.green }); pp.lab(0, 48, 'start 48 ft', 'e', { c: C.green, fs: 11, dy: 6 });
  pp.dot(1, 64, { c: C.green }); pp.lab(1, 64, 'max 64 ft at t = 1', 'e', { c: C.green, fs: 11, dy: 6 });
  pp.dot(3, 0, { c: C.green }); pp.lab(3, 0, 'lands t = 3', 'nw', { c: C.green, fs: 11 });

  const mArea = F.areaModel({ wLab: 'w + 3', hLab: 'w', inside: 'Area = 40' });
  const mAreaA = F.areaModel({ wLab: '8 m', hLab: '5 m', inside: '5 × 8 = 40 ✓', wc: C.green, hc: C.green, ic: C.green });

  // your turn: area
  const tw = 5; // w(w+4)=45
  const tA = F.areaModel({ wLab: 'w + 4', hLab: 'w', inside: 'Area = 45' });
  const tAA = F.areaModel({ wLab: '9', hLab: '5', inside: '5 × 9 = 45 ✓', wc: C.green, hc: C.green, ic: C.green });
  const kq = Q(-16, 64, 0);
  const ktbl = F.vt(['t (s)', 'h (ft)'], [[0, 1, 2, 3, 4], [0, fmt(kq.f(1)), '?', '?', '?']]);
  const kg = pgraph(kq.f, [0, 4.5, 0, 80], { H: 250, gx: 0.5, lx: 1, gy: 10, ly: 20, xname: 't (s)', yname: 'h (ft)' });
  kg.dot(2, 64, { c: C.green }); kg.lab(2, 64, 'max 64 ft at t = 2', 'n', { c: C.green, fs: 11 });
  kg.dot(4, 0, { c: C.green }); kg.lab(4, 0, 'lands t = 4', 'nw', { c: C.green, fs: 11 });

  sec('t5', 5, 'Creating Quadratic Equations', `
${vocab([
  ['model', 'an equation that describes a real situation.'],
  ['projectile', 'an object that is thrown or launched. It goes up, slows down, then falls back down.'],
  ['h(t)', '“h of t” = the height after t seconds. h(0) is the starting height.']
])}
<div class="key"><strong>📌</strong> Area and projectile problems are quadratic. Set up, then factor or take roots.</div>
${howto('How to solve an area problem', [
  'Draw the rectangle. Label the width w. Label the length using w.',
  'Write: length × width = area.',
  'Multiply out. Move everything to one side so it equals 0.',
  'Factor and solve.',
  'A length cannot be negative. Keep only the positive answer.'
])}
  <div class="sa"><div class="chk-q"><span class="badge">MODEL</span> A rectangle’s length is 2 more than its width and the area is 24. Find the width.</div>${fig(model, 'Label the sides with w')}<button class="sa-btn" onclick="K78.sol(this)">Reveal</button><div class="sa-ans">Let w = width → <strong>w(w + 2) = 24</strong> → w² + 2w − 24 = 0 → (w + 6)(w − 4) = 0 → <strong>w = 4</strong> (length 6). We throw out w = −6, because a width can’t be negative.</div>${L.after(fig(modelA, 'Check: 4 × 6 = 24 ✓'))}</div>
${howto('How to solve a projectile problem h(t) = at² + bt + c', [
  'Starting height: h(0) = c.',
  'Lands: set h(t) = 0. Factor and solve. Keep the positive t.',
  `Time of the top: t = ${fr('−b', '2a')} (or halfway between the zeros).`,
  'Max height: put that t into h(t).'
])}
${example('e75p', { title: 'Worked example: a ball is thrown up. h(t) = −16t² + 32t + 48 (feet, seconds)', fig: fig(sc, 'Sketch (not to scale)'),
  steps: [['Starting height:', 'h(0) = 48 ft'],
    ['Factor:', '−16(t² − 2t − 3) = −16(t − 3)(t + 1)'],
    ['When does it land? (h = 0)', 't = 3 s. (t = −1 is thrown out: time can’t be negative.)'],
    [`Time of the top: t = ${fr('−32', '2(−16)')}`, '= 1 s (also halfway between −1 and 3)'],
    ['Max height:', 'h(1) = −16 + 32 + 48 = 64 ft']],
  after: fig(pp.out('graph of the ball height'), 'Graph of h(t): starts at 48, peaks at 64 ft at 1 s, lands at 3 s') })}
${mistake('m75', { who: 'Rosa solved: “A garden’s length is 3 m more than its width. The area is 40 m². Find the width.”', fig: fig(mArea),
  work: ['w(w + 3) = 40', 'w² + 3w − 40 = 0', '(w + 8)(w − 5) = 0', 'w = −8 or w = 5', 'The width is −8 m.'], bad: 4,
  fbs: ['Step 1 is right: length × width = area.', 'Step 2 is right: subtract 40 from both sides.', 'Step 3 is right: 8 × (−5) = −40 and 8 − 5 = 3.', 'Step 4 is right: both are solutions of the equation.', ''],
  why: 'A width can’t be negative. Keep w = 5 m. The length is 8 m.', after: fig(mAreaA) })}
${yt()}
${q('n75a', { n: 1, text: 'A rectangle’s length is 4 more than its width. Its area is 45. Find the width.', fig: fig(tA), t: 'num', a: tw, ph: 'w = ?',
  traps: [{ v: -9, m: 'A width can’t be negative. Look at your other answer.' }, { v: 9, m: '9 is the length. The question asks for the width.' }, { v: 41, m: 'You can’t just subtract. Use w(w + 4) = 45 and factor.' }],
  sol: 'w(w + 4) = 45 → w² + 4w − 45 = 0 → (w + 9)(w − 5) = 0 → <b>w = 5</b> (length 9).', after: fig(tAA, 'Check: 5 × 9 = 45 ✓') })}
${figHtml(`<div class="table-wrap">${ktbl}</div>`, 'A ball is kicked from the ground: h(t) = −16t² + 64t. Use it for Questions 2–3.')}
${q('n75b', { n: 2, text: 'When does the ball land? (t in seconds)', t: 'num', a: 4, ph: 't = ?', traps: [{ v: 0, m: 't = 0 is when it was kicked. Find the OTHER time when h = 0.' }, { v: 2, m: 't = 2 is when the ball is at the top. Find when h = 0 again.' }],
  sol: '−16t² + 64t = 0 → −16t(t − 4) = 0 → t = 0 or <b>t = 4 s</b>. It lands at 4 s.', after: fig(kg.out('ball graph'), 'Lands at t = 4') })}
${q('n75c', { n: 3, text: 'What is the maximum height? (feet)', t: 'num', a: kq.k, ph: 'h = ?', traps: [{ v: 2, m: '2 is the TIME of the top. Put t = 2 into h(t) to get the height.' }],
  sol: `Top at t = ${fr('−64', '2(−16)')} = 2. h(2) = −16(4) + 64(2) = −64 + 128 = <b>64 ft</b>.`, after: fig(kg.out('ball graph'), 'Max 64 ft at t = 2') })}
`);
}

/* ================= 6. Comparing ================= */
{
  const A = QV(-1, 2, 5), B = Q(-1, 0, 3);
  const pa = pgraph(A.f, [-3, 5, -4, 6], { H: 240 });
  pa.text(3.3, 1.3, 'A', { c: C.navy, fs: 13, bold: true, anchor: 'start', dx: 6 });
  const pab = pgraph(A.f, [-3, 5, -4, 6], { H: 240 });
  pab.curve(B.f, { c: C.blue, dash: '7 5' });
  pab.dot(2, 5, { c: C.green }); pab.lab(2, 5, 'A max 5', 'e', { c: C.green, fs: 11 });
  pab.dot(0, 3, { c: C.green }); pab.lab(0, 3, 'B max 3', 'nw', { c: C.green, fs: 11 });
  pab.text(3.3, 1.3, 'A', { c: C.navy, fs: 13, bold: true, anchor: 'start', dx: 6 });
  pab.text(-2.2, -2.5, 'B', { c: C.blue, fs: 13, bold: true, anchor: 'end', dx: -6 });

  const Cf = Q(1, -4, 0), D = Q(1, 2, -1);
  const ctab = F.vt(['x', 'C(x)'], [[-1, 0, 1, 2, 3], [-1, 0, 1, 2, 3].map(x => fmt(Cf.f(x)))]);
  const pcd = pgraph(Cf.f, [-4, 5, -5, 6], { H: 250 });
  pcd.curve(D.f, { c: C.blue, dash: '7 5' });
  pcd.dot(2, -4, { c: C.green }); pcd.lab(2, -4, 'C min −4', 'e', { c: C.green, fs: 11 });
  pcd.dot(-1, -2, { c: C.green }); pcd.lab(-1, -2, 'D min −2', 'w', { c: C.green, fs: 11 });

  const g = Q(1, -4, 5);
  const pg = pgraph(g.f, [-2, 6, -2, 8], { H: 230 });
  pg.text(4.6, 6, 'g', { c: C.navy, fs: 13, bold: true, anchor: 'start', dx: 6 });
  const pg2 = pgraph(g.f, [-2, 6, -2, 8], { H: 230 });
  pg2.dot(0, 5, { c: C.green }); pg2.lab(0, 5, 'g: y-int 5', 'w', { c: C.green, fs: 11 });

  const TA = QV(-1, -1, 6), TB = Q(-1, 4, 1);
  const pta = pgraph(TA.f, [-5, 3, -4, 7], { H: 250 });
  pta.text(1.2, 2, 'A', { c: C.navy, fs: 13, bold: true, anchor: 'start', dx: 8 });
  const ptb = pgraph(TA.f, [-5, 6, -4, 7], { H: 250 });
  ptb.curve(TB.f, { c: C.blue, dash: '7 5' });
  ptb.dot(-1, 6, { c: C.green }); ptb.lab(-1, 6, 'A max 6', 'w', { c: C.green, fs: 11 });
  ptb.dot(2, 5, { c: C.green }); ptb.lab(2, 5, 'B max 5', 'e', { c: C.green, fs: 11 });
  const tbdec = F.decoder([{ t: 'B: y = ' }, { t: '−x²', lab: 'a = −1' }, { t: ' + 4x', lab: 'b = 4' }, { t: ' + 1', lab: 'c = 1' }]);

  sec('t6', 6, 'Comparing Functions', `
<div class="key"><strong>📌</strong> Compare features (max/min, intercepts) even across forms — a graph, a table, and an equation. Find the <em>same</em> feature for each, then compare.</div>
${howto('How to compare two functions', [
  'Decide which feature the question asks about (max, min, zero, y-intercept).',
  'Find it for the first function. Read the graph, scan the table, or use the equation.',
  'Find the same feature for the second function.',
  'Compare the two numbers. Answer in a full sentence.'
])}
  <div class="example">
    <h4>Function A (graph) has a max of 5. Function B: y = −x² + 3. Which has the greater max?</h4>
    ${fig(pa.out('graph of function A'), 'Function A')}
    <div class="steps" data-example="e75">
      <div class="step" onclick="reveal(this)"><strong>Step 1. A’s max (read the graph):</strong><span class="placeholder"> click to reveal</span><span class="hidden-content"> the top point is (2, 5), so the max is 5</span></div>
      <div class="step final" onclick="reveal(this)"><strong>✓ Step 2. B’s vertex is (0, 3) → max =</strong> 3.  Compare with A’s max 5 →<span class="placeholder"> click to reveal</span><span class="hidden-content"> A is greater (5 &gt; 3)</span></div>
    </div>
    <button class="reveal-all" onclick="revealAll('e75')">Reveal all steps</button>
    <div class="after">${fig(pab.out('A and B together'), 'A (solid) and B (dashed) on one grid')}</div>
  </div>
${example('e76b', { title: 'Worked example: which has the smaller minimum, C (table) or D: y = x² + 2x − 1?', fig: figHtml(`<div class="table-wrap">${ctab}</div>`, 'Function C'),
  steps: [['C’s minimum:', 'the y-values go down to −4 and back up, so the min is −4 (at x = 2)'],
    [`D’s axis: x = ${fr('−b', '2a')} =`, `${fr('−2', '2(1)')} = −1`],
    ['D’s minimum:', '(−1)² + 2(−1) − 1 = 1 − 2 − 1 = −2'],
    ['Compare:', '−4 &lt; −2, so C has the smaller minimum']],
  after: fig(pcd.out('C and D'), 'C (solid) goes lower than D (dashed)') })}
${mistake('m76', { who: 'Ty compared y-intercepts. f(x) = 2x² − 3x + 7, and g is graphed below.', fig: fig(pg.out('graph of g')),
  work: ['f’s y-intercept is the first number: 2', 'g crosses the y-axis at 5', '5 &gt; 2, so g has the bigger y-intercept'], bad: 0,
  fbs: ['', 'Step 2 is right: g crosses the y-axis at (0, 5).', 'Step 3 uses the wrong number from Step 1. Find the first mistake.'],
  why: 'The y-intercept is c, the number with no x. For f, c = 7. Since 7 &gt; 5, f has the bigger y-intercept.', after: fig(pg2.out('g y-intercept'), 'g’s y-intercept is 5; f’s is 7') })}
${yt()}
${fig(pta.out('graph of A'), 'Function A is graphed. Function B is y = −x² + 4x + 1.')}
${q('n76a', { n: 1, text: 'What is the maximum value of Function B: y = −x² + 4x + 1?', fig: fig(tbdec), t: 'num', a: TB.k, ph: 'max = ?', traps: [{ v: 2, m: '2 is the x-value of the vertex. Put x = 2 into B to get the max y-value.' }, { v: 1, m: '1 is the y-intercept, not the top of the graph.' }],
  sol: `Axis: x = ${fr('−4', '2(−1)')} = 2. B(2) = −4 + 8 + 1 = <b>5</b>.` })}
${mc('n76b', { n: 2, text: 'Which function has the greater maximum?', opts: [
  { t: 'Function A', ok: 1 }, { t: 'Function B', fb: 'B’s max is 5. Read A’s max from the top of its graph.' }, { t: 'They are equal', fb: 'Read A’s top point carefully: it is at y = 6.' }, { t: 'Neither has a maximum', fb: 'Both open down (they look like hills), so both have a maximum.' }],
  why: 'A’s max is 6 (its vertex is (−1, 6)). B’s max is 5. 6 &gt; 5, so A is greater.', after: fig(ptb.out('A and B'), 'A max 6 &gt; B max 5') })}
`);
}

/* ================= 7. Building ================= */
{
  const am = F.areaModel({ hLab: 'x', cols: [{ w: 4, lab: 'x', inside: 'x · x = ?', ic: C.goldT }, { w: 3, lab: '3', inside: '3 · x = ?', ic: C.goldT }] });
  const amA = F.areaModel({ hLab: 'x', cols: [{ w: 4, lab: 'x', inside: 'x²', ic: C.green }, { w: 3, lab: '3', inside: '3x', ic: C.green }] });
  const Aq = Q(1, 3, 0);
  const pA = pgraph(Aq.f, [0, 5, 0, 40], { H: 220, gy: 5, ly: 10, xname: 'x', yname: 'A(x)' });
  pA.dot(2, 10, { c: C.green }); pA.lab(2, 10, 'x = 2 → A = 10', 'e', { c: C.green, fs: 11, dy: 4 });

  const f = x => x * x - 3, g = x => 2 * x + 1;
  const tb = F.vt(['x', 'f(x) = x² − 3', 'g(x) = 2x + 1', '(f + g)(x)'], [[0, 1, 2], [0, 1, 2].map(x => fmt(f(x))), [0, 1, 2].map(x => fmt(g(x))), ['?', '?', '?']]);
  const tbA = F.vt(['x', 'f(x) = x² − 3', 'g(x) = 2x + 1', '(f + g)(x)'], [[0, 1, 2], [0, 1, 2].map(x => fmt(f(x))), [0, 1, 2].map(x => fmt(g(x))), [0, 1, 2].map(x => fmt(f(x) + g(x)))], { green: s => false });

  const mm = F.areaModel({ hLab: 'x', cols: [{ w: 4, lab: 'x', inside: 'x²', ic: C.green }, { w: 2, lab: '2', inside: '2x', ic: C.green }] });
  const tbox = F.boxMethod({ top: ['x', '+4'], left: ['x', '−1'], cells: [['?', '?'], ['?', '?']] });
  const tboxA = F.boxMethod({ top: ['x', '+4'], left: ['x', '−1'], cells: [['x²', '4x'], ['−x', '−4']], green: true });
  const f2 = x => x * x + 1, g2 = x => 3 * x - 4;
  const tb2 = F.vt(['x', 'f(x)', 'g(x)', '(f + g)(x)'], [[0, 1, 2], [0, 1, 2].map(x => fmt(f2(x))), [0, 1, 2].map(x => fmt(g2(x))), ['?', '?', '?']]);
  const tb2A = F.vt(['x', 'f(x)', 'g(x)', '(f + g)(x)'], [[0, 1, 2], [0, 1, 2].map(x => fmt(f2(x))), [0, 1, 2].map(x => fmt(g2(x))), [0, 1, 2].map(x => fmt(f2(x) + g2(x)))]);

  sec('t7', 7, 'Building Functions', `
${vocab([
  ['(f + g)(x)', 'add the two functions: f(x) + g(x).'],
  ['(f · g)(x)', 'multiply the two functions: f(x) · g(x).'],
  ['distribute', 'multiply the outside term by EVERY term inside the parentheses.']
])}
<div class="key"><strong>📌</strong> Build a new function by adding or multiplying functions. Multiplying two linear functions gives a quadratic.</div>
${howto('How to build a new function', [
  'Write each function inside parentheses.',
  'Adding? Combine like terms (x² with x², x with x, numbers with numbers).',
  'Multiplying? Distribute every term (use a box).',
  'Write the answer in standard form: ax² + bx + c.'
])}
  <div class="example">
    <h4>l(x) = x + 3 and w(x) = x. Build the area A(x) = l·w.</h4>
    ${fig(am, 'Area model: a rectangle x by (x + 3)')}
    <div class="steps" data-example="e76">
      <div class="step" onclick="reveal(this)"><strong>Step 1. Set up:</strong> A(x) = l(x) · w(x) =<span class="placeholder"> click to reveal</span><span class="hidden-content"> x(x + 3)</span></div>
      <div class="step final" onclick="reveal(this)"><strong>✓ Step 2. Multiply:</strong> x(x + 3) =<span class="placeholder"> click to reveal</span><span class="hidden-content"> x² + 3x</span></div>
    </div>
    <button class="reveal-all" onclick="revealAll('e76')">Reveal all steps</button>
    <div class="after">${fig(amA, 'x · x = x² and 3 · x = 3x, so A(x) = x² + 3x')}${fig(pA.out('graph of A(x)'), 'Graph of A(x) = x² + 3x for widths x ≥ 0')}</div>
  </div>
${example('e77b', { title: 'Worked example: f(x) = x² − 3 and g(x) = 2x + 1. Find (f + g)(x).', fig: figHtml(`<div class="table-wrap">${tb}</div>`, 'Add the outputs in each column'),
  steps: [['Write it out:', '(x² − 3) + (2x + 1)'], ['Combine like terms:', 'x² + 2x + (−3 + 1)'], ['Answer:', '(f + g)(x) = x² + 2x − 2']],
  after: figHtml(`<div class="table-wrap">${tbA}</div>`, 'Check: x = 2 → 4 + 4 − 2 = 6 ✓') })}
${mistake('m77', { who: 'Kai built A(x) for a rectangle with sides x + 2 and x:',
  work: ['A(x) = (x + 2) · x', '= x · x + 2', '= x² + 2'], bad: 1,
  fbs: ['Step 1 is right: length × width.', '', 'Step 3 follows Step 2. Find the first mistake.'],
  why: 'Distribute x to EVERY term: x · x + 2 · x = x² + 2x. So A(x) = x² + 2x.', after: fig(mm, 'Both parts of the rectangle: x² and 2x') })}
${yt()}
${q('n77a', { n: 1, text: 'l(x) = x + 4 and w(x) = x − 1. Build A(x) = l(x) · w(x) in standard form.', fig: fig(tbox, 'Fill the box'), t: 'expr', form: 'std', a: 'x^2+3x-4', ph: 'A(x) = x^2 + ...',
  traps: [{ v: 'x^2-4', m: 'You multiplied the first terms and the last terms only. Fill all 4 boxes: x², 4x, −x and −4.' }, { v: 'x^2+5x-4', m: 'Check the middle terms: 4x + (−x) = 3x.' }, { v: 'x^2+3x+4', m: 'Check the sign of the last box: 4 × (−1) = −4.' }],
  sol: '(x + 4)(x − 1) = x² − x + 4x − 4 = <b>x² + 3x − 4</b>.', after: fig(tboxA, 'x² + 4x − x − 4 = x² + 3x − 4') })}
${q('n77b', { n: 2, text: 'f(x) = x² + 1 and g(x) = 3x − 4. Find (f + g)(x).', fig: figHtml(`<div class="table-wrap">${tb2}</div>`), t: 'expr', a: 'x^2+3x-3', ph: 'x^2 + ...',
  traps: [{ v: 'x^2+3x+5', m: 'Check the numbers: 1 + (−4) = −3.' }, { v: 'x^2-3x-3', m: 'g(x) has +3x. Keep its sign.' }],
  sol: '(x² + 1) + (3x − 4) = <b>x² + 3x − 3</b>.', after: figHtml(`<div class="table-wrap">${tb2A}</div>`, 'Check: x = 1 → 1 + 3 − 3 = 1 ✓') })}
`);
}

const html = page({
  title: 'Unit 7 Guided Notes — Quadratic Functions | NC Math 1',
  back: 'unit7.html', backLabel: 'Unit 7',
  h1: '📝 Unit 7 Guided Notes — Quadratic Functions',
  sub: 'Every parabola has a vertex and an axis of symmetry. Read the form, find the features.',
  stds: 'Standards: F-IF.4/7/9 · A-CED.1/2 · F-BF.1b',
  intro: 'Fill the blanks on your printed copy first, then click any blank, step, or button to check. <strong>Print → Save as PDF</strong> for a blank student worksheet; click <em>Reveal all</em> first to print the answer key. Each topic has: new words → a picture → numbered steps → a worked example → <b>find the mistake</b> → <b>your turn</b> (type and check).',
  nav: [['t1', '① Features'], ['t2', '② Graphing'], ['t3', '③ Vertex Form'], ['t4', '④ Domain/Range'], ['t5', '⑤ Create'], ['t6', '⑥ Compare'], ['t7', '⑦ Build']],
  revealAll: true,
  body: S.join('\n')
});
module.exports = html;
