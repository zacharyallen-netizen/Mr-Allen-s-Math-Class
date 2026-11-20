/* Data Dive — question makers (Math 1 Unit 5: statistics).
   q.rep = what the sonar screen draws:
   { t:'dot', vals } | { t:'box', five:[min,q1,med,q3,max], label } | { t:'box2', A:five, B:five } | { t:'hist', lo, w, counts }
   | { t:'scatter', pts, line:{m,b} } | { t:'list', vals } | { t:'text', text } */
(function () {
  var M = window.M1, n = M.n, rint = M.rint, pick = M.pick, shuffle = M.shuffle;
  function W(k, h, why) { return { k: String(k), h: h, why: why }; }
  function num(v, why) { return W(+v.toFixed(4), n(+v.toFixed(2)), why); }
  function ln(s) { return '<span class="ln">' + s + '</span>'; }
  function sorted(a) { return a.slice().sort(function (x, y) { return x - y; }); }
  function median(a) { var s = sorted(a), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
  function mean(a) { return a.reduce(function (x, y) { return x + y; }, 0) / a.length; }
  function quart(a) { var s = sorted(a), h = s.length >> 1; return [median(s.slice(0, h)), median(s.slice(s.length % 2 ? h + 1 : h))]; }  // median of halves (NC Math 1 method)
  function fill(v, d) { d = d || 1; return [num(v + d, 'Check your arithmetic.'), num(v - d, 'Check your arithmetic.'), num(v + 2 * d, 'Check your arithmetic.')]; }
  function data(nv, lo, hi) { var a = []; for (var i = 0; i < nv; i++) a.push(rint(lo, hi)); return a; }

  /* ---------- center ---------- */
  function medDot() {
    var a, md; do { a = data(pick([7, 9, 11, 8, 10]), 1, 10); md = median(a); } while (md === mean(a) || md === (Math.min.apply(0, a) + Math.max.apply(0, a)) / 2);
    var s = sorted(a), cnt = {}, mode = s[0]; s.forEach(function (v) { cnt[v] = (cnt[v] || 0) + 1; if (cnt[v] > cnt[mode]) mode = v; });
    return { kind: 'medDot', rep: { t: 'dot', vals: a },
      p: 'Sonar counted fish at ' + a.length + ' reef spots (the dot plot). What is the <b>median</b>?',
      ch: M.choices({ k: +md.toFixed(4), h: n(md) }, [num(mean(a), 'That is the MEAN (add and divide). The median is the MIDDLE value in order.'),
        mode !== md ? num(mode, 'That is the MODE (most common). The median is the middle value.') : null,
        num((s[0] + s[s.length - 1]) / 2, 'That is halfway between the smallest and largest. Count to the middle DOT instead.')].filter(Boolean), fill(md, .5)),
      hint: 'Put the ' + a.length + ' values in order. ' + (a.length % 2 ? 'The middle one is value number ' + ((a.length + 1) / 2) + '.' : 'There are two middle values: average them.'),
      steps: ln('In order: ' + s.map(n).join(', ')) + ln('Middle: ' + n(md)), yes: '' };
  }
  function meanList() {
    var a, m; do { a = data(pick([4, 5, 6]), 2, 20); m = mean(a); } while (!Number.isInteger(m) || m === median(a));
    var sum = a.reduce(function (x, y) { return x + y; }, 0);
    return { kind: 'meanList', rep: { t: 'list', vals: a },
      p: 'Depth readings (meters): find the <b>mean</b>.',
      ch: M.choices({ k: m, h: n(m) }, [num(sum, 'That is the SUM. Divide by how many values there are (' + a.length + ').'), num(median(a), 'That is the MEDIAN (middle). The mean is the sum ÷ how many.'),
        num(+(sum / (a.length - 1)).toFixed(2), 'Divide by ' + a.length + ', the number of values, not ' + (a.length - 1) + '.')], fill(m)),
      hint: 'Mean = add all the values, then divide by how many there are.',
      steps: ln(a.map(n).join(' + ') + ' = ' + sum) + ln(sum + ' ÷ ' + a.length + ' = ' + m), yes: '' };
  }
  /* ---------- spread (box plots) ---------- */
  function five() {
    var mn = rint(0, 10), q1 = mn + rint(2, 8), md = q1 + rint(1, 7), q3 = md + rint(1, 7), mx = q3 + rint(2, 10);
    return [mn, q1, md, q3, mx];
  }
  function iqr() {
    var f = five(), I = f[3] - f[1];
    return { kind: 'iqr', rep: { t: 'box', five: f },
      p: 'The box plot shows water temperatures. What is the <b>interquartile range (IQR)</b>?',
      ch: M.choices({ k: I, h: n(I) }, [num(f[4] - f[0], 'That is the RANGE (max − min). The IQR is the width of the BOX: Q3 − Q1.'), num(f[3] - f[2], 'Use the WHOLE box: Q3 − Q1, not Q3 − median.'), num(f[3], 'That is Q3 alone. Subtract Q1 from it.')], fill(I)),
      hint: 'IQR = Q3 − Q1 (the right edge of the box minus the left edge).',
      steps: ln('Q1 = ' + f[1] + ', Q3 = ' + f[3]) + ln('IQR = ' + f[3] + ' − ' + f[1] + ' = ' + I), yes: 'The middle half of the data spans ' + I + '.' };
  }
  function boxRead() {
    var f = five(), what = pick(['median', 'range', 'Q1']), v = what === 'median' ? f[2] : what === 'range' ? f[4] - f[0] : f[1];
    var wr = what === 'median' ? [num((f[0] + f[4]) / 2, 'That is halfway between min and max. The median is the line INSIDE the box.'), num(f[1], 'That is Q1 (the left edge of the box).'), num(f[3], 'That is Q3 (the right edge of the box).')]
      : what === 'range' ? [num(f[3] - f[1], 'That is the IQR (the box). The range uses the whiskers: max − min.'), num(f[4], 'That is the max alone. Subtract the min.'), num(f[4] + f[0], 'Range = max MINUS min.')]
        : [num(f[0], 'That is the minimum (end of the left whisker). Q1 is the left edge of the box.'), num(f[2], 'That is the median.'), num(f[3], 'That is Q3, the right edge of the box.')];
    return { kind: 'boxRead', rep: { t: 'box', five: f },
      p: 'Read the box plot. What is the <b>' + (what === 'Q1' ? 'first quartile (Q1)' : what) + '</b>?', ch: M.choices({ k: v, h: n(v) }, wr, fill(v)),
      hint: 'Box plot: min, Q1 (box left), median (line in the box), Q3 (box right), max.',
      steps: ln('min ' + f[0] + ', Q1 ' + f[1] + ', median ' + f[2] + ', Q3 ' + f[3] + ', max ' + f[4]), yes: '' };
  }
  function cmpBox() {
    var A = five(), B = five(); if (B[3] - B[1] === A[3] - A[1]) B[3]++; if (B[3] >= B[4]) B[4] = B[3] + 2;
    var ia = A[3] - A[1], ib = B[3] - B[1], askMed = Math.random() < 0.4 && A[2] !== B[2];
    var right = askMed ? (A[2] > B[2] ? 'Reef A' : 'Reef B') : (ia > ib ? 'Reef A' : 'Reef B'), other = right === 'Reef A' ? 'Reef B' : 'Reef A';
    return { kind: 'cmpBox', rep: { t: 'box2', A: A, B: B },
      p: askMed ? 'Which reef has the greater <b>median</b> fish length?' : 'Which reef’s data is more <b>spread out</b> in the middle half (greater IQR)?',
      ch: [{ h: right, ok: true, why: '' }, { h: other, ok: false, why: askMed ? 'Compare the lines INSIDE the boxes: the median.' : 'Compare the WIDTH of the boxes (Q3 − Q1), not where they sit or how long the whiskers are.' },
        { h: 'They are the same', ok: false, why: askMed ? 'Look at the two median lines: they are not at the same number.' : 'IQR A = ' + ia + ', IQR B = ' + ib + '. They are different.' }],
      hint: askMed ? 'The median is the line inside each box.' : 'IQR = width of the box. Wider box = more spread in the middle half.',
      steps: askMed ? ln('Median A = ' + A[2] + ', median B = ' + B[2]) : ln('IQR A = ' + A[3] + ' − ' + A[1] + ' = ' + ia) + ln('IQR B = ' + B[3] + ' − ' + B[1] + ' = ' + ib), yes: '' };
  }
  /* ---------- outliers ---------- */
  function fence() {
    var q1 = rint(4, 20), I = pick([2, 4, 6, 8, 10]), q3 = q1 + I, up = q3 + 1.5 * I, lo = q1 - 1.5 * I, askUp = Math.random() < 0.6;
    var v = askUp ? up : lo;
    return { kind: 'fence', rep: { t: 'text', text: 'Q1 = ' + q1 + '    Q3 = ' + q3 },
      p: 'Outlier alarm! Q1 = ' + q1 + ' and Q3 = ' + q3 + '. Find the <b>' + (askUp ? 'upper' : 'lower') + ' fence</b>.<span class="lab">Upper fence = Q3 + 1.5·IQR, lower fence = Q1 − 1.5·IQR</span>',
      ch: M.choices({ k: v, h: n(v) }, [num(askUp ? q3 + I : q1 - I, 'Use 1.5 times the IQR, not just the IQR.'), num(askUp ? 1.5 * q3 : q1 / 1.5, 'Multiply 1.5 by the IQR (' + I + '), not by ' + (askUp ? 'Q3' : 'Q1') + '.'),
        num(askUp ? q1 + 1.5 * I : q3 - 1.5 * I, askUp ? 'Start from Q3 for the upper fence.' : 'Start from Q1 for the lower fence.')], fill(v)),
      hint: 'IQR = Q3 − Q1 = ' + I + '. Then 1.5 · ' + I + ' = ' + 1.5 * I + '.',
      steps: ln('IQR = ' + q3 + ' − ' + q1 + ' = ' + I) + ln('1.5 · ' + I + ' = ' + 1.5 * I) + ln(askUp ? q3 + ' + ' + 1.5 * I + ' = ' + up : q1 + ' − ' + 1.5 * I + ' = ' + n(lo)), yes: 'Any value past the fence is an outlier.' };
  }
  function isOut() {
    var q1 = rint(10, 30), I = pick([4, 6, 8, 10]), q3 = q1 + I, up = q3 + 1.5 * I, out = Math.random() < 0.5;
    var v = out ? up + rint(1, 8) : rint(q3 + 1, up - 1);
    var ch = [{ h: 'Yes, it is an outlier', ok: out, why: 'Upper fence = ' + q3 + ' + 1.5·' + I + ' = ' + up + '. ' + v + ' is NOT above it.' },
      { h: 'No, it is not an outlier', ok: !out, why: 'Upper fence = ' + q3 + ' + 1.5·' + I + ' = ' + up + '. ' + v + ' IS above it.' },
      { h: out ? 'No: it is less than Q3 + IQR' : 'Yes: it is greater than Q3', ok: false, why: 'Being bigger than Q3 is not enough. Compare with the fence: Q3 + 1.5·IQR = ' + up + '.' }];
    if (out && v <= q3 + I) ch[2].h = 'No: it is not far from Q3';
    return { kind: 'isOut', rep: { t: 'box', five: [q1 - rint(2, 6), q1, q1 + I / 2, q3, Math.max(q3 + 2, out ? q3 + rint(2, Math.floor(1.5 * I)) : v)], mark: v },
      p: 'Q1 = ' + q1 + ', Q3 = ' + q3 + '. Sonar finds a value of <b>' + v + '</b>. Is it an <b>outlier</b>?', ch: ch,
      hint: 'Find the upper fence: Q3 + 1.5·IQR. Above the fence = outlier.',
      steps: ln('IQR = ' + I + ', 1.5·IQR = ' + 1.5 * I) + ln('Upper fence = ' + up) + ln(v + (out ? ' > ' : ' ≤ ') + up + ' → ' + (out ? 'outlier' : 'not an outlier')), yes: '' };
  }
  /* ---------- histograms and shape ---------- */
  function histQ() {
    var w = pick([5, 10]), lo = pick([0, 10, 20]), counts = [rint(1, 4), rint(3, 7), rint(5, 9), rint(2, 6), rint(0, 3)], tot = counts.reduce(function (a, b) { return a + b; }, 0);
    var i = rint(0, 4), j = Math.min(4, i + 1), askTot = Math.random() < 0.4;
    var v = askTot ? tot : counts[i] + counts[j];
    var p = askTot ? 'How many fish were measured in all?' : 'How many fish were from <b>' + (lo + i * w) + ' to ' + (lo + (j + 1) * w) + '</b> cm long?';
    return { kind: 'hist', rep: { t: 'hist', lo: lo, w: w, counts: counts },
      p: 'The histogram shows fish lengths (cm). ' + p,
      ch: M.choices({ k: v, h: n(v) }, askTot ? [num(counts.length, 'That is the number of BARS. Add the heights of all the bars.'), num(Math.max.apply(0, counts), 'That is the tallest bar only. Add every bar.')]
        : [num(counts[i], 'That covers only ' + (lo + i * w) + ' to ' + (lo + (i + 1) * w) + '. The question spans two bars.'), num(counts[j], 'Include both bars.'), num(lo + (j + 1) * w - (lo + i * w), 'That is the width in cm. Add the bar HEIGHTS (how many fish).')], fill(v)),
      hint: askTot ? 'Each bar’s height is how many fish. Add all the heights.' : 'Find the bars for those lengths. Add their heights.',
      steps: askTot ? ln(counts.join(' + ') + ' = ' + tot) : ln(counts[i] + ' + ' + counts[j] + ' = ' + v), yes: '' };
  }
  function shape() {
    var t = pick([0, 1, 2]), c = t === 0 ? [1, 3, 7, 3, 1] : t === 1 ? [8, 6, 3, 2, 1] : [1, 2, 3, 6, 8];
    var L = ['Symmetric', 'Skewed right (tail to the right)', 'Skewed left (tail to the left)'];
    return { kind: 'shape', rep: { t: 'hist', lo: 0, w: 10, counts: c },
      p: 'What is the <b>shape</b> of this distribution?',
      ch: L.map(function (h, i) { return { h: h, ok: i === t, why: i === 0 ? 'Symmetric means both sides match. These sides do not.' : i === 1 ? 'Skewed RIGHT means the long thin tail points RIGHT (toward bigger values). Look where the short bars are.' : 'Skewed LEFT means the long thin tail points LEFT. Look where the short bars are.' }; }),
      hint: 'Find the long, thin tail of short bars. The skew is named for the side the TAIL is on.',
      steps: ln(t === 0 ? 'Both sides match: symmetric.' : 'The tail is on the ' + (t === 1 ? 'right' : 'left') + ': skewed ' + (t === 1 ? 'right' : 'left') + '.'), yes: t === 1 ? 'Here the mean is pulled toward the tail: mean > median.' : t === 2 ? 'Here the mean is pulled toward the tail: mean < median.' : '' };
  }
  /* ---------- scatter plots, regression, residuals, correlation ---------- */
  function regData(m, b, noise) { var pts = []; for (var x = 1; x <= 10; x++) pts.push([x, Math.round(m * x + b + (Math.random() - .5) * 2 * noise)]); return pts; }
  function r(pts) { var mx = mean(pts.map(function (p) { return p[0]; })), my = mean(pts.map(function (p) { return p[1]; })), sxy = 0, sxx = 0, syy = 0;
    pts.forEach(function (p) { sxy += (p[0] - mx) * (p[1] - my); sxx += (p[0] - mx) * (p[0] - mx); syy += (p[1] - my) * (p[1] - my); }); return syy ? sxy / Math.sqrt(sxx * syy) : 0; }
  function predict() {
    var m = pick([1.5, 2, 2.5, 3, -1.5, -2]), b = rint(20, 40), x = rint(3, 12), v = m * x + b;
    return { kind: 'predict', rep: { t: 'scatter', pts: regData(m, b, 3), line: { m: m, b: b } },
      p: 'The line of best fit is <span class="big">ŷ = ' + n(m) + 'x + ' + b + '</span>Predict y when <b>x = ' + x + '</b>.',
      ch: M.choices({ k: +v.toFixed(4), h: n(v) }, [num(m * x, 'You forgot to add the ' + b + '.'), num(m + x + b, 'Multiply ' + n(m) + ' BY ' + x + ', then add ' + b + '.'), num((x - b) / m, 'Put x = ' + x + ' INTO the equation. You solved for x instead.')], fill(v)),
      hint: 'Replace x with ' + x + ': ŷ = ' + n(m) + '(' + x + ') + ' + b + '.',
      steps: ln('ŷ = ' + n(m) + '(' + x + ') + ' + b) + ln('= ' + n(m * x) + ' + ' + b + ' = ' + n(v)), yes: '' };
  }
  function resid() {
    var m = pick([2, 3, 1.5, -2]), b = rint(10, 30), x = rint(2, 9), pr = m * x + b, act = pr + pick([-6, -4, -3, -2, 2, 3, 5, 7]), rv = act - pr;
    return { kind: 'resid', rep: { t: 'scatter', pts: regData(m, b, 3).map(function (p) { return p[0] === x ? [x, act] : p; }), line: { m: m, b: b }, mark: [x, act] },
      p: 'Line: <b>ŷ = ' + n(m) + 'x + ' + b + '</b>. The real point is <b>(' + x + ', ' + n(act) + ')</b>. Find the <b>residual</b>.<span class="lab">residual = actual − predicted</span>',
      ch: M.choices({ k: rv, h: n(rv) }, [num(-rv, 'Order matters: ACTUAL minus PREDICTED.'), num(pr, 'That is the predicted value. Subtract it from the actual value.'), num(act, 'That is the actual value. Subtract the predicted value from it.')], fill(rv)),
      hint: 'Predicted: ŷ = ' + n(m) + '(' + x + ') + ' + b + '. Residual = actual − predicted.',
      steps: ln('Predicted = ' + n(pr)) + ln('Residual = ' + n(act) + ' − ' + n(pr) + ' = ' + n(rv)), yes: rv > 0 ? 'Positive: the point is ABOVE the line.' : 'Negative: the point is BELOW the line.' };
  }
  function corr() {
    var t = pick([0, 1, 2, 3]), want = [0.9, 0.4, -0.9, -0.4][t], pts, rv, tries = 0;
    do { var m = t < 2 ? pick([2, 3]) : pick([-2, -3]); pts = regData(m, t < 2 ? 5 : 35, t % 2 ? 9 : 1.5); rv = r(pts); tries++; }
    while (!(t % 2 ? Math.abs(rv) > 0.25 && Math.abs(rv) < 0.6 && Math.sign(rv) === Math.sign(want) : Math.abs(rv) > 0.88 && Math.sign(rv) === Math.sign(want)) && tries < 400);
    if (tries >= 400) return corr();
    var labs = ['r = 0.9', 'r = 0.4', 'r = −0.9', 'r = −0.4'];
    return { kind: 'corr', rep: { t: 'scatter', pts: pts },
      p: 'Which <b>correlation coefficient r</b> best fits this scatter plot?',
      ch: labs.map(function (h, i) { return { h: h, ok: i === t, why: (Math.sign([0.9, 0.4, -0.9, -0.4][i]) !== Math.sign(want) ? 'Check the direction: points going ' + (want > 0 ? 'UP' : 'DOWN') + ' to the right means r is ' + (want > 0 ? 'positive' : 'negative') + '. ' : '') + (i % 2 !== t % 2 ? 'Check the strength: ' + (t % 2 ? 'the points are spread out, so r is closer to 0.' : 'the points hug a line, so r is close to 1 or −1.') : '') }; }),
      hint: 'Sign: up to the right = positive, down = negative. Strength: points close to a line = near 1 or −1; spread out = near 0.',
      steps: ln((want > 0 ? 'Up to the right: positive. ' : 'Down to the right: negative. ') + (t % 2 ? 'Spread out: weak.' : 'Close to a line: strong.')) + ln(labs[t]), yes: '' };
  }
  function slopeMean() {
    var c = pick([['hours of practice', 'points scored', 'points', 'hour'], ['minutes of sun', 'plant height (cm)', 'cm', 'minute'], ['dollars spent on ads', 'sales', 'sales', 'dollar']]);
    var m = pick([1.5, 2, 2.5, 4]), b = rint(10, 40);
    return { kind: 'slopeMean', rep: { t: 'text', text: 'ŷ = ' + n(m) + 'x + ' + b },
      p: 'x = ' + c[0] + ', y = ' + c[1] + '. The line of best fit is ŷ = ' + n(m) + 'x + ' + b + '. What does <b>' + n(m) + '</b> mean?',
      ch: [{ h: 'For each extra ' + c[3] + ', y is predicted to go up by ' + n(m) + ' ' + c[2], ok: true, why: '' },
        { h: 'When x = 0, y is predicted to be ' + n(m), ok: false, why: 'That describes the y-intercept, which is ' + b + '. The slope is the change in y for each 1 more x.' },
        { h: 'y is always exactly ' + n(m) + ' times x', ok: false, why: 'A line of best fit PREDICTS. The slope is the predicted change in y for each 1 more x.' },
        { h: 'For each extra ' + c[2] + ', x goes up by ' + n(m), ok: false, why: 'Backwards: slope = change in y for each 1 more x.' }],
      hint: 'Slope = predicted change in y when x goes up by 1.', steps: ln('Slope ' + n(m) + ': each 1 more ' + c[3] + ' → about ' + n(m) + ' more ' + c[2] + '.'), yes: '' };
  }
  var CAUSE = [
    ['Ice cream sales and sunburns are strongly correlated.', 'eating ice cream causes sunburn', 'hot, sunny weather'],
    ['Cities with more firefighters have more fire damage.', 'firefighters cause fire damage', 'bigger cities (more people and buildings)'],
    ['Students who own more books get higher grades.', 'owning books causes higher grades', 'reading habits and support at home'],
    ['Towns with more ice skating rinks have more hot chocolate sales.', 'skating rinks cause hot chocolate sales', 'cold weather'],
    ['Shoe size and reading level are strongly correlated for kids.', 'big feet cause better reading', 'age (older kids have bigger feet AND read better)']];
  function cause() {
    var c = pick(CAUSE);
    return { kind: 'cause', rep: { t: 'text', text: 'correlation ≠ causation' },
      p: c[0] + ' Does this prove that <b>' + c[1] + '</b>?',
      ch: [{ h: 'No. Another factor, like ' + c[2] + ', could cause both', ok: true, why: '' },
        { h: 'Yes, because the correlation is strong', ok: false, why: 'A strong correlation shows the two things move together. It does not show one CAUSES the other.' },
        { h: 'Yes, because they happen at the same time', ok: false, why: 'Happening together is correlation, not proof of cause.' },
        { h: 'No, because the correlation must be negative', ok: false, why: 'The sign does not matter here. Even a strong positive correlation does not prove cause.' }],
      hint: 'Correlation means two things move together. Causation means one MAKES the other happen. Look for a third thing behind both.',
      steps: ln('Correlation is not causation.') + ln('Lurking factor: ' + c[2] + '.'), yes: '' };
  }

  var MAKERS = { medDot: medDot, meanList: meanList, iqr: iqr, boxRead: boxRead, cmpBox: cmpBox, fence: fence, isOut: isOut, hist: histQ, shape: shape, predict: predict, resid: resid, corr: corr, slopeMean: slopeMean, cause: cause };
  function verify(q) {
    var r0 = q.ch.filter(function (c) { return c.ok; })[0];
    if (q.kind === 'medDot' && +r0.k !== +median(q.rep.vals).toFixed(4)) return 'median';
    if (q.kind === 'iqr' && +r0.k !== q.rep.five[3] - q.rep.five[1]) return 'iqr';
    if (q.kind === 'meanList' && +r0.k !== mean(q.rep.vals)) return 'mean';
    if (q.kind === 'corr') { var rv = r(q.rep.pts), t = ['r = 0.9', 'r = 0.4', 'r = −0.9', 'r = −0.4'].indexOf(r0.h); if ((t < 2) !== (rv > 0)) return 'corr sign'; }
    if (q.rep.t === 'box') { var f = q.rep.five; for (var i = 1; i < 5; i++) if (f[i] < f[i - 1]) return 'box order'; }
    return '';
  }
  window.DDQ = { make: function (k) { return MAKERS[k](); }, MAKERS: MAKERS, verify: verify };
})();
