/* W78 — interactive visuals (sliders + draggable points). Mouse, pen and touch all work (pointer events). */
(function () {
  var G = window.G78, K = window.K78, C = G.C, fmt = G.fmt;
  G.prefix = 'rt'; G.n = 0;
  var W = {};
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function coef(a, first) { // coefficient text for a term (not for constants)
    if (a === 1) return first ? '' : '';
    if (a === -1) return '−';
    if (Math.abs(Math.abs(a) - 0.5) < 1e-9) return (a < 0 ? '−' : '') + '½';
    return fmt(a);
  }
  function poly(a, b, c, v) {
    v = v || 'x';
    var s = '';
    if (a !== 0) s = coef(a, true) + v + '²';
    if (b !== 0) { var bb = Math.abs(b); s += (s ? (b < 0 ? ' − ' : ' + ') : (b < 0 ? '−' : '')) + (bb === 1 ? '' : fmt(bb)) + v; }
    if (c !== 0 || !s) { s += s ? (c < 0 ? ' − ' : ' + ') + fmt(Math.abs(c)) : fmt(c); }
    return 'y = ' + s;
  }
  function vform(a, h, k) {
    var inner = h === 0 ? 'x' : '(x ' + (h > 0 ? '− ' : '+ ') + fmt(Math.abs(h)) + ')';
    var s = 'y = ' + coef(a, true) + inner + '²';
    if (k !== 0) s += (k > 0 ? ' + ' : ' − ') + fmt(Math.abs(k));
    return s;
  }
  W.poly = poly; W.vform = vform;
  function zerosOf(a, b, c) {
    var d = b * b - 4 * a * c;
    if (d < -1e-9) return [];
    if (Math.abs(d) < 1e-9) return [-b / (2 * a)];
    var r = Math.sqrt(d);
    return [(-b - r) / (2 * a), (-b + r) / (2 * a)].sort(function (p, q) { return p - q; });
  }
  function slider(name, min, max, step, val, label) {
    return '<label class="srow"><span class="sname">' + label + '</span><input type="range" data-k="' + name + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" aria-label="' + name + '"><output data-o="' + name + '"></output></label>';
  }
  function mount(host, title, svgHtml, ctlHtml) {
    host.innerHTML = '<div class="w-title">' + title + '</div><div class="w-body"><div class="w-svg">' + svgHtml + '</div><div class="w-ctl">' + ctlHtml + '</div></div>';
    return host.querySelector('svg');
  }

  /* 1) a, b, c explorer */
  W.abc = function (host) {
    var st = { a: 1, b: -2, c: -3 };
    var P;
    function draw() {
      P = G.plane({ xmin: -7, xmax: 7, ymin: -8, ymax: 8, W: 300, lx: 2, ly: 2 });
      var a = st.a, b = st.b, c = st.c;
      var f = function (x) { return a * x * x + b * x + c; };
      if (a === 0) { P.curve(f, { c: C.navy }); return P.out('graph'); }
      var h = -b / (2 * a), k = f(h);
      P.vline(h, { c: C.green, w: 1.6, dash: '5 4' });
      P.curve(f, { c: C.navy });
      zerosOf(a, b, c).forEach(function (z) { P.dot(z, 0, { c: C.green, hollow: true, r: 5 }); });
      P.dot(0, c, { c: C.blue });
      P.dot(h, k, { c: C.green, r: 5.5 });
      if (k >= -7.5 && k <= 7.5 && h >= -7 && h <= 7) P.lab(h, k, 'vertex', a > 0 ? 's' : 'n', { c: C.green, fs: 11 });
      return P.out('parabola for the chosen a, b and c');
    }
    var svg = mount(host, '🎛 Try it: move the sliders for a, b and c',
      draw(),
      slider('a', -3, 3, 0.5, st.a, 'a') + slider('b', -6, 6, 1, st.b, 'b') + slider('c', -6, 6, 1, st.c, 'c') + '<div class="readout" aria-live="polite"></div>');
    var out = host.querySelector('.readout');
    function upd() {
      K.swap(svg, draw());
      host.querySelectorAll('output').forEach(function (o) { o.textContent = fmt(st[o.dataset.o]); });
      var a = st.a, b = st.b, c = st.c;
      if (a === 0) { out.innerHTML = '<b>' + poly(a, b, c) + '</b><br><span class="warn-t">a = 0 makes the x² term disappear. The graph is a straight line, not a parabola! Move a away from 0.</span>'; return; }
      var h = -b / (2 * a), k = a * h * h + b * h + c, z = zerosOf(a, b, c);
      out.innerHTML = '<b>' + poly(a, b, c) + '</b><br>' +
        (a > 0 ? 'a &gt; 0 → opens <b>up</b> → vertex is a <b>minimum</b>' : 'a &lt; 0 → opens <b>down</b> → vertex is a <b>maximum</b>') + '<br>' +
        '<span class="g">vertex</span> (' + fmt(h) + ', ' + fmt(k) + ') · <span class="g">axis</span> x = ' + fmt(h) + '<br>' +
        '<span class="b">y-intercept</span> (0, ' + fmt(c) + ') = c<br>' +
        '<span class="g">zeros</span>: ' + (z.length ? z.map(function (v) { return 'x = ' + fmt(v); }).join(', ') : 'none — the graph never touches the x-axis');
    }
    host.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', function () { st[r.dataset.k] = parseFloat(r.value); upd(); }); });
    upd();
  };

  /* 2) vertex form: drag the vertex, slide a */
  W.vtx = function (host, o) {
    o = o || {};
    var st = { h: o.h0 != null ? o.h0 : 1, k: o.k0 != null ? o.k0 : -4, a: o.a0 != null ? o.a0 : 1 };
    var P, done = false;
    function draw() {
      P = G.plane({ xmin: -6, xmax: 6, ymin: -6, ymax: 6, W: 300 });
      var f = function (x) { return st.a * (x - st.h) * (x - st.h) + st.k; };
      P.curve(function (x) { return x * x; }, { c: '#B9C1CF', w: 1.6, dash: '4 4' });
      P.vline(st.h, { c: done ? C.green : C.gold, w: 1.5, dash: '5 4' });
      P.curve(f, { c: C.navy });
      P.add('<circle cx="' + P.X(st.h).toFixed(1) + '" cy="' + P.Y(st.k).toFixed(1) + '" r="13" fill="' + (done ? C.green : C.gold) + '" fill-opacity=".25"/>');
      P.dot(st.h, st.k, { c: done ? C.green : C.gold, r: 7 });
      P.lab(st.h, st.k, '(' + fmt(st.h) + ', ' + fmt(st.k) + ')', st.a > 0 ? 's' : 'n', { c: done ? C.green : C.goldT, dy: st.a > 0 ? 4 : -4 });
      return P.out('drag the vertex');
    }
    var ctl = slider('a', -3, 3, 0.5, st.a, 'a') + '<div class="readout" aria-live="polite"></div>' +
      (o.task ? '<div class="w-task"><button type="button" class="w-check">Check my graph</button><div class="chk-fb" aria-live="polite"></div></div>' : '') +
      '<p class="w-hint">Drag the gold vertex (or tap a grid point). The dashed grey curve is y = x².</p>';
    var svg = mount(host, o.title || '🖐 Try it: drag the vertex and slide a', draw(), ctl);
    svg.setAttribute('tabindex', '0');
    var out = host.querySelector('.readout');
    function upd() {
      K.swap(svg, draw());
      host.querySelector('output').textContent = fmt(st.a);
      if (st.a === 0) { out.innerHTML = '<span class="warn-t">a = 0 is not a parabola. Move a away from 0.</span>'; return; }
      var b = -2 * st.a * st.h, c = st.a * st.h * st.h + st.k;
      out.innerHTML = '<b>Vertex form:</b> ' + vform(st.a, st.h, st.k) + '<br><b>Standard form:</b> ' + poly(st.a, b, c) +
        '<br>vertex (h, k) = (' + fmt(st.h) + ', ' + fmt(st.k) + ') · axis x = ' + fmt(st.h) + ' · opens ' + (st.a > 0 ? 'up' : 'down');
    }
    K.drag(svg, function () { return P; }, function (p) {
      if (!p || done) return;
      var h = Math.max(-6, Math.min(6, Math.round(p[0]))), k = Math.max(-6, Math.min(6, Math.round(p[1])));
      if (h !== st.h || k !== st.k) { st.h = h; st.k = k; upd(); }
    });
    svg.addEventListener('keydown', function (e) {
      if (done) return;
      var m = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
      if (!m) return; e.preventDefault();
      st.h = Math.max(-6, Math.min(6, st.h + m[0])); st.k = Math.max(-6, Math.min(6, st.k + m[1])); upd();
    });
    host.querySelector('input[type=range]').addEventListener('input', function (e) { if (done) { e.target.value = st.a; return; } st.a = parseFloat(e.target.value); upd(); });
    if (o.task) {
      var t = o.task, fb = host.querySelector('.w-task .chk-fb');
      host.querySelector('.w-check').addEventListener('click', function () {
        if (done) return;
        var ok = st.h === t.h && st.k === t.k && st.a === t.a, msg;
        if (ok) { done = true; K.mark(host.id, true); fb.className = 'chk-fb show c'; fb.innerHTML = '✓ Correct! ' + (o.okMsg || ''); upd(); var c = host.closest('.task'); if (c) K.showAfter(c); return; }
        if (st.h === -t.h && t.h !== 0) msg = 'Look inside the parentheses. (x ' + (t.h < 0 ? '+ ' : '− ') + Math.abs(t.h) + ') means h = ' + fmt(t.h) + '. The sign flips!';
        else if (st.h !== t.h) msg = 'Your vertex is in the wrong left/right spot. h is the x-value of the vertex.';
        else if (st.k !== t.k) msg = 'Your left/right spot is right! Now check k, the number added at the end. It is the y-value of the vertex.';
        else if (st.a === -t.a) msg = 'Your vertex is right! But the graph opens the wrong way. ' + (t.a < 0 ? 'A minus sign in front means a is negative, so it opens down.' : 'No minus sign in front means a is positive, so it opens up.');
        else msg = 'Your vertex is right! Now set a. a is the number in front of the parentheses.';
        K.mark(host.id, false);
        fb.className = 'chk-fb show x'; fb.innerHTML = 'Not yet. ' + msg;
      });
    }
    upd();
  };

  /* 3) a-slider: width and direction */
  W.aslide = function (host) {
    var st = { a: 2 }, P;
    function draw() {
      P = G.plane({ xmin: -5, xmax: 5, ymin: -6, ymax: 6, W: 300 });
      P.curve(function (x) { return x * x; }, { c: '#B9C1CF', w: 1.8, dash: '4 4' });
      P.curve(function (x) { return st.a * x * x; }, { c: C.navy });
      P.text(-4.8, st.a > 0 ? -5.4 : 5.4, 'grey: y = x²', { fs: 11, c: C.muted, anchor: 'start' });
      return P.out('y = a x squared');
    }
    var svg = mount(host, '🎛 Try it: slide a and watch the width', draw(), slider('a', -4, 4, 0.25, st.a, 'a') + '<div class="readout" aria-live="polite"></div>');
    var out = host.querySelector('.readout');
    function upd() {
      K.swap(svg, draw());
      host.querySelector('output').textContent = fmt(st.a);
      var a = st.a, A = Math.abs(a);
      out.innerHTML = '<b>' + (a === 0 ? 'y = 0' : poly(a, 0, 0)) + '</b><br>' + (a === 0 ? '<span class="warn-t">a = 0 is a flat line, not a parabola.</span>' :
        (A > 1 ? '|a| &gt; 1 → <b>narrower</b> (steeper) than y = x²' : A < 1 ? '|a| &lt; 1 → <b>wider</b> (flatter) than y = x²' : 'Same width as y = x²') + '<br>' + (a > 0 ? 'a &gt; 0 → opens up' : 'a &lt; 0 → opens down (flipped)'));
    }
    host.querySelector('input').addEventListener('input', function (e) { st.a = parseFloat(e.target.value); upd(); });
    upd();
  };

  /* 4) drag two endpoints: midpoint or distance */
  W.seg = function (host, o) {
    o = o || {};
    var mode = o.mode || 'mid';
    var st = { A: o.A || [-4, -2], B: o.B || [4, 2] }, P, grab = null;
    function draw() {
      P = G.plane({ xmin: -6, xmax: 6, ymin: -5, ymax: 5, W: 300 });
      var A = st.A, B = st.B;
      if (mode === 'dist') {
        P.seg(A[0], A[1], B[0], A[1], { c: C.gold, w: 2.2, dash: '5 4' });
        P.seg(B[0], A[1], B[0], B[1], { c: C.gold, w: 2.2, dash: '5 4' });
        if (A[0] !== B[0] && A[1] !== B[1]) P.right(B[0], A[1], A[0], A[1], B[0], B[1], { c: C.gold });
        P.text((A[0] + B[0]) / 2, A[1], 'Δx = ' + fmt(Math.abs(B[0] - A[0])), { c: C.goldT, fs: 11, anchor: 'middle', bold: true, dy: (B[1] >= A[1] ? 14 : -6) });
        /* keep the Δy label off the x-axis so the axis line never strikes through it */
        var yl = (A[1] + B[1]) / 2, yHi = Math.max(A[1], B[1]);
        if (Math.abs(yl) < 0.6) yl = yHi >= 0.6 ? 0.6 : -0.6;
        P.text(B[0], yl, 'Δy = ' + fmt(Math.abs(B[1] - A[1])), { c: C.goldT, fs: 11, anchor: B[0] >= A[0] ? 'start' : 'end', bold: true, dx: B[0] >= A[0] ? 6 : -6, dy: 4, halo: true });
        /* the dashed legs run over the axis numbers they cross: put those numbers back on top */
        if (A[1] !== 0 && Math.min(A[0], B[0]) < 0 && Math.max(A[0], B[0]) > 0) P.textPx(P.X(0) - 4, P.Y(A[1]) + 3.5, fmt(A[1]), { fs: 10, c: C.muted, anchor: 'end', halo: true });
        if (B[0] !== 0 && Math.min(A[1], B[1]) < 0 && Math.max(A[1], B[1]) > 0) P.textPx(P.X(B[0]), P.Y(0) + 12, fmt(B[0]), { fs: 10, c: C.muted, anchor: 'middle', halo: true });
      }
      P.seg(A[0], A[1], B[0], B[1], { c: C.navy, w: 2.6 });
      if (mode === 'mid') {
        var M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
        P.dot(M[0], M[1], { c: C.green, r: 5.5 });
        P.lab(M[0], M[1], 'M' + G.pt(M[0], M[1]), (B[1] - A[1]) * (B[0] - A[0]) >= 0 ? 'se' : 'ne', { c: C.green, fs: 11 });
      }
      [['A', A], ['B', B]].forEach(function (q) {
        P.add('<circle cx="' + P.X(q[1][0]).toFixed(1) + '" cy="' + P.Y(q[1][1]).toFixed(1) + '" r="12" fill="' + C.navy + '" fill-opacity=".15"/>');
        P.dot(q[1][0], q[1][1], { c: C.navy, r: 6 });
      });
      var aUp = A[1] >= B[1];
      P.lab(A[0], A[1], 'A' + G.pt(A[0], A[1]), aUp ? 'n' : 's', { fs: 11 });
      P.lab(B[0], B[1], 'B' + G.pt(B[0], B[1]), aUp ? 's' : 'n', { fs: 11 });
      return P.out('drag points A and B');
    }
    var svg = mount(host, o.title || (mode === 'mid' ? '🖐 Try it: drag A and B — watch the midpoint' : '🖐 Try it: drag A and B — watch the distance'), draw(),
      '<div class="readout" aria-live="polite"></div><p class="w-hint">Drag a navy point, or tap a grid spot to move the closer point there.</p>');
    var out = host.querySelector('.readout');
    function upd() {
      K.swap(svg, draw());
      var A = st.A, B = st.B;
      if (mode === 'mid') {
        out.innerHTML = 'M = ( <span class="fr"><span>' + fmt(A[0]) + ' + ' + fmt(B[0]) + '</span><span>2</span></span> , <span class="fr"><span>' + fmt(A[1]) + ' + ' + fmt(B[1]) + '</span><span>2</span></span> ) = <b class="g">' + G.pt((A[0] + B[0]) / 2, (A[1] + B[1]) / 2) + '</b>';
      } else {
        var dx = B[0] - A[0], dy = B[1] - A[1], s = dx * dx + dy * dy, d = Math.sqrt(s);
        out.innerHTML = 'd = <span class="rad">√<span>' + fmt(Math.abs(dx)) + '² + ' + fmt(Math.abs(dy)) + '²</span></span> = <span class="rad">√<span>' + s + '</span></span> ' +
          (Math.abs(d - Math.round(d)) < 1e-9 ? '= <b class="g">' + Math.round(d) + '</b>' : '≈ <b class="g">' + d.toFixed(2) + '</b>');
      }
    }
    K.drag(svg, function () { return P; }, function (p, ev) {
      if (!p) { grab = null; return; }
      var q = [Math.max(-6, Math.min(6, Math.round(p[0]))), Math.max(-5, Math.min(5, Math.round(p[1])))];
      if (ev === 'down') { var dA = Math.hypot(p[0] - st.A[0], p[1] - st.A[1]), dB = Math.hypot(p[0] - st.B[0], p[1] - st.B[1]); grab = dA <= dB ? 'A' : 'B'; }
      if (!grab) return;
      var other = grab === 'A' ? st.B : st.A;
      if (q[0] === other[0] && q[1] === other[1]) return;
      if (q[0] !== st[grab][0] || q[1] !== st[grab][1]) { st[grab] = q; upd(); }
    });
    upd();
  };

  /* 5) slope slider: parallel and perpendicular */
  W.slope = function (host) {
    var L = [[-3, 1], [-2, 1], [-3, 2], [-1, 1], [-2, 3], [-1, 2], [-1, 3], [1, 3], [1, 2], [2, 3], [1, 1], [3, 2], [2, 1], [3, 1]];
    var st = { i: 12 }, P;
    function frs(n, d) { // fraction html
      if (d === 1) return fmt(n);
      return (n < 0 ? '−' : '') + '<span class="fr"><span>' + Math.abs(n) + '</span><span>' + d + '</span></span>';
    }
    function draw() {
      var f = L[st.i], m = f[0] / f[1], pm = -1 / m;
      P = G.plane({ xmin: -6, xmax: 6, ymin: -6, ymax: 6, W: 300 });
      P.line(m, 0, { c: C.navy, w: 2.6 });
      P.line(m, 3, { c: C.blue, w: 2.2, dash: '7 5' });
      P.line(pm, 0, { c: C.green, w: 2.6 });
      // right angle at origin
      var ux = 1 / Math.sqrt(1 + m * m), uy = m * ux, vx = 1 / Math.sqrt(1 + pm * pm), vy = pm * vx;
      if (vy < 0) { vx = -vx; vy = -vy; }
      P.right(0, 0, ux, uy, vx, vy, { c: C.green, s: 10 });
      return P.out('slope lines');
    }
    var svg = mount(host, '🎛 Try it: change the slope', draw(),
      '<label class="srow"><span class="sname">m</span><input type="range" min="0" max="' + (L.length - 1) + '" step="1" value="' + st.i + '" aria-label="slope"><output></output></label><div class="readout" aria-live="polite"></div>');
    var out = host.querySelector('.readout');
    function upd() {
      K.swap(svg, draw());
      var f = L[st.i];
      host.querySelector('output').innerHTML = frs(f[0], f[1]);
      var pn = -f[1] * Math.sign(f[0]), pd = Math.abs(f[0]);
      out.innerHTML = '<span class="n">■</span> given line: m = ' + frs(f[0], f[1]) + '<br><span class="bl">■</span> parallel line: m = ' + frs(f[0], f[1]) + ' (same)<br><span class="g">■</span> perpendicular line: m = ' + frs(pn, pd) + ' (flip + change sign)<br>Check: ' + frs(f[0], f[1]) + ' × ' + frs(pn, pd) + ' = −1 ✓';
    }
    host.querySelector('input').addEventListener('input', function (e) { st.i = parseInt(e.target.value, 10); upd(); });
    upd();
  };

  /* 6) drag D to make a parallelogram (practice task) */
  W.para = function (host, o) {
    var A = o.A, B = o.B, Cc = o.C, T = o.D, st = { D: o.D0 }, P, done = false;
    function slope(p, q) { return q[0] === p[0] ? null : (q[1] - p[1]) / (q[0] - p[0]); }
    function sTxt(p, q) {
      var n = q[1] - p[1], d = q[0] - p[0];
      if (d === 0) return 'undefined (vertical)';
      if (n === 0) return '0';
      var a = Math.abs(n), b = Math.abs(d); while (b) { var t = a % b; a = b; b = t; }
      n /= a; d /= a; if (d < 0) { n = -n; d = -d; }
      return d === 1 ? fmt(n) : (n < 0 ? '−' : '') + '<span class="fr"><span>' + Math.abs(n) + '</span><span>' + d + '</span></span>';
    }
    function draw() {
      P = G.plane({ xmin: o.view[0], xmax: o.view[1], ymin: o.view[2], ymax: o.view[3], W: 300 });
      var D = st.D, col = done ? C.green : C.gold;
      P.poly([A, B, Cc, D], { c: C.navy, fill: C.navy, op: 0.08 });
      P.seg(Cc[0], Cc[1], D[0], D[1], { c: col, w: 2.6 });
      P.seg(D[0], D[1], A[0], A[1], { c: col, w: 2.6 });
      [['A', A, 'sw'], ['B', B, 'se'], ['C', Cc, 'ne']].forEach(function (q) { P.dot(q[1][0], q[1][1]); P.lab(q[1][0], q[1][1], q[0] + G.pt(q[1][0], q[1][1]), q[2], { fs: 11 }); });
      P.add('<circle cx="' + P.X(D[0]).toFixed(1) + '" cy="' + P.Y(D[1]).toFixed(1) + '" r="13" fill="' + col + '" fill-opacity=".25"/>');
      P.dot(D[0], D[1], { c: col, r: 7 });
      P.lab(D[0], D[1], 'D' + G.pt(D[0], D[1]), 'nw', { fs: 11, c: done ? C.green : C.goldT });
      return P.out('drag point D');
    }
    var svg = mount(host, o.title || '🖐 Drag D to make ABCD a parallelogram', draw(),
      '<div class="readout" aria-live="polite"></div><div class="w-task"><button type="button" class="w-check">Check my D</button><div class="chk-fb" aria-live="polite"></div></div><p class="w-hint">Drag the gold point D (or tap a grid point).</p>');
    var out = host.querySelector('.readout'), fb = host.querySelector('.chk-fb');
    function upd() {
      K.swap(svg, draw());
      var D = st.D;
      out.innerHTML = 'Slopes of opposite sides:<br>AB: m = ' + sTxt(A, B) + ' &nbsp;·&nbsp; DC: m = ' + sTxt(D, Cc) + '<br>BC: m = ' + sTxt(B, Cc) + ' &nbsp;·&nbsp; AD: m = ' + sTxt(A, D);
    }
    K.drag(svg, function () { return P; }, function (p) {
      if (!p || done) return;
      var q = [Math.max(o.view[0], Math.min(o.view[1], Math.round(p[0]))), Math.max(o.view[2], Math.min(o.view[3], Math.round(p[1])))];
      if ([A, B, Cc].some(function (z) { return z[0] === q[0] && z[1] === q[1]; })) return;
      if (q[0] !== st.D[0] || q[1] !== st.D[1]) { st.D = q; upd(); }
    });
    host.querySelector('.w-check').addEventListener('click', function () {
      if (done) return;
      var D = st.D, ok = D[0] === T[0] && D[1] === T[1];
      if (ok) { done = true; K.mark(host.id, true); fb.className = 'chk-fb show c'; fb.innerHTML = '✓ Correct! ' + (o.okMsg || ''); upd(); var c = host.closest('.task'); if (c) K.showAfter(c); return; }
      var s1 = slope(A, B), s2 = slope(D, Cc), s3 = slope(B, Cc), s4 = slope(A, D);
      var p1 = s1 === s2, p2 = s3 === s4, msg;
      if (p1 && !p2) msg = 'AB ∥ DC now. But AD must also be parallel to BC. Make the slope of AD match BC.';
      else if (!p1 && p2) msg = 'AD ∥ BC now. But DC must also be parallel to AB. Make the slope of DC match AB.';
      else msg = 'Try this: B → C moves ' + fmt(Cc[0] - B[0]) + ' across and ' + fmt(Cc[1] - B[1]) + ' up. Make the same move starting from A.';
      K.mark(host.id, false);
      fb.className = 'chk-fb show x'; fb.innerHTML = 'Not yet. ' + msg;
    });
    upd();
  };

  W.init = function () {
    document.querySelectorAll('[data-w]').forEach(function (h) {
      try { W[h.dataset.w](h, h.dataset.o ? JSON.parse(h.dataset.o) : {}); } catch (e) { if (window.console) console.error(e); }
    });
  };
  window.W78 = W;
})();
