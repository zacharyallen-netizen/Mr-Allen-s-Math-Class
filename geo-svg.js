/* ───────────────────────────────────────────────────────────────
   GEO-SVG — one shared, careful way to draw math pictures on the site.
   Every figure is drawn from the problem's own numbers, as SVG.

   Use:   <div class="geo" data-geo='{"type":"rays", ...}'></div>
          <script src="../geo-svg.js"></script>      (draws every [data-geo])
   or:    GEO.draw(spec) → "<svg …>" string

   ANGLES ARE DRAWN TO THEIR TRUE MEASURE. Each marked angle gets a light
   wedge + arc, and its label sits OUTSIDE the arc on the angle's middle line,
   never on top of a line. Right angles get a square mark.

   Types
     rays      {vertex:"B", rays:[{deg:0,name:"C"},{deg:35,name:"A"}], angles:[{from:0,to:35,label:"35°",c:"blue"}], right:[[0,90]], len}
     cross     {theta:60, names:["A","B","C","D"], vertex:"E", angles:[{q:1,label:"x°",c:"gold"}]}   q: 1 upper-right,2 upper-left,3 lower-left,4 lower-right
     parallel  {theta:60, numbers:true, marks:{"1":"x°","5":"120°"}, colors:{"1":"gold","5":"blue"}, lineNames:["m","n"], tName:"t"}
               angle numbers: top crossing 1 upper-left, 2 upper-right, 3 lower-left, 4 lower-right; bottom crossing 5–8 the same
     triangle  {A:50, B:60, names:["A","B","C"], angles:{A:"50°",B:"60°",C:"x°"}, colors:{C:"gold"}, sides:{AB:"10",BC:"",CA:""},
                exterior:{at:"B", label:"110°"}, ticks:{AB:1,CA:1}, scale:1}
     similar   {A:50, B:60, k:1.5, left:{names,sides,angles,colors}, right:{names,sides,angles,colors}, angles:{A:"50°",B:"60°"}}
     righttri  {a:3, b:4, labels:{a:"3",b:"4",c:"c"}, squares:false, names:["A","B","C"]}
     numline   {min:0, max:5, step:1, points:[{x:1.414,label:"√2",c:"blue"}], minor:0.1, brace:[a,b,label]}
     plane     {xmin,xmax,ymin,ymax, step:1, labelEvery:1, points:[{x,y,label,c}], lines:[{m,b,c,label}|{p:[x1,y1],q:[x2,y2]}],
                segments:[{p,q,c,dash}], polygons:[{pts:[[x,y]...],c,fill,label}], slopeTri:{p,q}, size:300, xlabel, ylabel}
   Colors: "navy","blue","green","gold","purple","red","gray" (or any #hex)
   ─────────────────────────────────────────────────────────────── */
(function (root) {
  var COL = { navy: '#1E2D4F', blue: '#0056B3', green: '#15803D', gold: '#B45309', purple: '#6D28D9', red: '#B42318', gray: '#6B7488', teal: '#0F766E' };
  var FILL = { navy: 'rgba(30,45,79,.10)', blue: 'rgba(0,86,179,.13)', green: 'rgba(21,128,61,.14)', gold: 'rgba(224,168,0,.22)', purple: 'rgba(109,40,217,.12)', red: 'rgba(180,35,24,.12)', gray: 'rgba(107,116,136,.12)', teal: 'rgba(15,118,110,.13)' };
  var FONT = 'Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif';
  var LINE = '#1E2D4F';
  function col(c) { return COL[c] || c || COL.navy; }
  function fil(c) { return FILL[c] || 'rgba(30,45,79,.08)'; }
  function r1(v) { return Math.round(v * 10) / 10; }
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function rad(d) { return d * Math.PI / 180; }
  // math angle (counter-clockwise from →) to a screen point
  function P(cx, cy, r, deg) { return [cx + r * Math.cos(rad(deg)), cy - r * Math.sin(rad(deg))]; }

  // ── a figure that knows its own size, so labels are never cut off ──
  function Fig() { this.el = []; this.x0 = 1e9; this.y0 = 1e9; this.x1 = -1e9; this.y1 = -1e9; }
  Fig.prototype.ext = function (x, y) { if (x < this.x0) this.x0 = x; if (x > this.x1) this.x1 = x; if (y < this.y0) this.y0 = y; if (y > this.y1) this.y1 = y; };
  Fig.prototype.raw = function (s, pts) { this.el.push(s); (pts || []).forEach(function (p) { this.ext(p[0], p[1]); }, this); };
  Fig.prototype.line = function (a, b, o) {
    o = o || {};
    this.raw('<line x1="' + r1(a[0]) + '" y1="' + r1(a[1]) + '" x2="' + r1(b[0]) + '" y2="' + r1(b[1]) + '" stroke="' + col(o.c || 'navy') + '" stroke-width="' + (o.w || 2.5) + '"' +
      (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + ' stroke-linecap="round"/>', [a, b]);
  };
  Fig.prototype.arrowHead = function (tip, deg, c, size) {             // arrow pointing along deg (math)
    size = size || 11; var a = P(tip[0], tip[1], size, deg + 180 - 22), b = P(tip[0], tip[1], size, deg + 180 + 22);
    this.raw('<path d="M' + r1(a[0]) + ',' + r1(a[1]) + ' L' + r1(tip[0]) + ',' + r1(tip[1]) + ' L' + r1(b[0]) + ',' + r1(b[1]) + '" fill="none" stroke="' + col(c) + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>', [a, b, tip]);
  };
  Fig.prototype.dot = function (p, c, r) { this.raw('<circle cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="' + (r || 4) + '" fill="' + col(c) + '"/>', [[p[0] - 5, p[1] - 5], [p[0] + 5, p[1] + 5]]); };
  Fig.prototype.text = function (x, y, t, o) {
    o = o || {}; var size = o.size || 16, a = o.anchor || 'middle', w = String(t).length * size * 0.56;
    var xa = a === 'middle' ? x - w / 2 : a === 'end' ? x - w : x;
    this.ext(xa - 3, y - size - 1); this.ext(xa + w + 3, y + 5);
    this.el.push('<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + a + '" font-size="' + size + '" font-weight="' + (o.weight || 700) + '" fill="' + col(o.c || 'navy') +
      '" font-family="' + FONT + '"' + (o.italic ? ' font-style="italic"' : '') + ' paint-order="stroke" stroke="#fff" stroke-width="5" stroke-linejoin="round">' + esc(t) + '</text>');
  };
  // centred text: (x,y) is the middle of the label
  Fig.prototype.ctext = function (x, y, t, o) { o = o || {}; this.text(x, y + (o.size || 16) * 0.36, t, o); };
  Fig.prototype.svg = function (label, o) {
    o = o || {}; var p = 8, x = this.x0 - p, y = this.y0 - p, w = this.x1 - this.x0 + 2 * p, h = this.y1 - this.y0 + 2 * p;
    var maxW = o.maxW || Math.round(w * 1.15);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + r1(x) + ' ' + r1(y) + ' ' + r1(w) + ' ' + r1(h) + '" width="100%" style="max-width:' + maxW +
      'px;height:auto;display:block;margin:0 auto" role="img" aria-label="' + esc(label || 'diagram') + '">' + this.el.join('') + '</svg>';
  };

  // ── one marked angle at vertex V between two directions (math degrees, from → to counter-clockwise) ──
  function markAngle(F, V, from, to, o) {
    o = o || {}; var span = ((to - from) % 360 + 360) % 360; if (span === 0) return;
    var c = o.c || 'blue', R = o.r || (span < 30 ? 44 : span < 60 ? 36 : 30);
    if (o.right || Math.abs(span - 90) < 0.01 && o.square !== false && o.label === undefined) {
      var s = 14, a = P(V[0], V[1], s, from), b = P(V[0], V[1], s, to), m = [a[0] + b[0] - V[0], a[1] + b[1] - V[1]];
      F.raw('<path d="M' + r1(a[0]) + ',' + r1(a[1]) + ' L' + r1(m[0]) + ',' + r1(m[1]) + ' L' + r1(b[0]) + ',' + r1(b[1]) + '" fill="' + fil(c) + '" stroke="' + col(c) + '" stroke-width="2"/>', [a, b, m]);
      if (o.label) { var q = P(V[0], V[1], 34, from + span / 2); F.ctext(q[0], q[1], o.label, { c: c }); }
      return;
    }
    var A = P(V[0], V[1], R, from), B = P(V[0], V[1], R, to), large = span > 180 ? 1 : 0;
    F.raw('<path d="M' + r1(V[0]) + ',' + r1(V[1]) + ' L' + r1(A[0]) + ',' + r1(A[1]) + ' A' + R + ' ' + R + ' 0 ' + large + ' 0 ' + r1(B[0]) + ',' + r1(B[1]) + ' Z" fill="' + fil(c) + '" stroke="none"/>', []);
    F.raw('<path d="M' + r1(A[0]) + ',' + r1(A[1]) + ' A' + R + ' ' + R + ' 0 ' + large + ' 0 ' + r1(B[0]) + ',' + r1(B[1]) + '" fill="none" stroke="' + col(c) + '" stroke-width="2.5"/>', [A, B]);
    if (o.double) { var R2 = R + 6, A2 = P(V[0], V[1], R2, from), B2 = P(V[0], V[1], R2, to);
      F.raw('<path d="M' + r1(A2[0]) + ',' + r1(A2[1]) + ' A' + R2 + ' ' + R2 + ' 0 ' + large + ' 0 ' + r1(B2[0]) + ',' + r1(B2[1]) + '" fill="none" stroke="' + col(c) + '" stroke-width="2"/>', [A2, B2]); }
    if (o.label !== undefined && o.label !== '') {
      // label on the angle's middle line, just outside the arc (further out for thin angles)
      var mid = from + span / 2, len = String(o.label).length, out = R + 12 + len * 3.2;
      // a thin angle has no room inside: put its label just past the arc, beside the upper ray
      if (span < 28 && !o.labelR) { mid = to + 14; out = R + 6 + len * 3.2; }
      var q2 = P(V[0], V[1], o.labelR || out, mid);
      F.ctext(q2[0], q2[1], o.label, { c: c, size: o.size || 16 });
    }
  }
  function pointName(F, p, name, deg, dist) {           // a point's letter, pushed away from the figure
    if (!name) return; var q = P(p[0], p[1], dist || 16, deg); F.ctext(q[0], q[1], name, { c: 'navy', size: 15, weight: 700 });
  }

  var T = {};
  // rays from one vertex
  T.rays = function (s) {
    var F = new Fig(), V = [0, 0], L = s.len || 140;
    (s.rays || []).forEach(function (r) {
      var e = P(0, 0, L, r.deg); F.line(V, e);
      if (r.arrow !== false) F.arrowHead(e, r.deg, 'navy');
      pointName(F, P(0, 0, L + 14, r.deg), r.name, r.deg, 4);
    });
    (s.right || []).forEach(function (rr) { markAngle(F, V, rr[0], rr[1], { right: true, c: rr[2] || 'gray' }); });
    (s.angles || []).forEach(function (a) { markAngle(F, V, a.from, a.to, a); });
    F.dot(V, 'navy', 3.5);
    if (s.vertex) { // put the vertex letter where no ray goes
      var dirs = (s.rays || []).map(function (r) { return ((r.deg % 360) + 360) % 360; }).sort(function (a, b) { return a - b; });
      var best = 270, gap = -1; for (var i = 0; i < dirs.length; i++) { var a1 = dirs[i], a2 = i + 1 < dirs.length ? dirs[i + 1] : dirs[0] + 360, g = a2 - a1;
        var marked = (s.angles || []).some(function (an) { var m = (an.from + (((an.to - an.from) % 360 + 360) % 360) / 2 + 360) % 360; return m > a1 && m < a2 || m + 360 > a1 && m + 360 < a2; });
        if (!marked && g > gap) { gap = g; best = a1 + g / 2; } }
      if (gap < 0) best = 270;
      pointName(F, V, s.vertex, best, 18);
    }
    if (s.caption) F.ctext((F.x0 + F.x1) / 2, F.y1 + 20, s.caption, { size: 14, c: 'gray', weight: 600 });
    return F.svg(s.alt || 'angle diagram', s);
  };
  // two lines crossing (vertical angles)
  T.cross = function (s) {
    var th = s.theta || 60, n = s.names || [], q = { 1: [0, th], 2: [th, 180], 3: [180, 180 + th], 4: [180 + th, 360] };
    var spec = { rays: [{ deg: 0, name: n[0] }, { deg: th, name: n[1] }, { deg: 180, name: n[2] }, { deg: 180 + th, name: n[3] }], vertex: s.vertex, len: s.len || 130,
      angles: (s.angles || []).map(function (a) { var r = q[a.q]; return { from: r[0], to: r[1], label: a.label, c: a.c, double: a.double }; }), caption: s.caption, alt: s.alt || 'two lines crossing', maxW: s.maxW };
    return T.rays(spec);
  };
  // two parallel lines cut by a transversal
  T.parallel = function (s) {
    var F = new Fig(), th = s.theta || 60, d = s.gap || 62, W = s.width || 170;
    var t = d / Math.sin(rad(th)), top = [t * Math.cos(rad(th)), -d], bot = [-t * Math.cos(rad(th)), d];   // screen coords
    F.line([-W, -d], [W, -d]); F.arrowHead([W, -d], 0, 'navy'); F.arrowHead([-W, -d], 180, 'navy');
    F.line([-W, d], [W, d]); F.arrowHead([W, d], 0, 'navy'); F.arrowHead([-W, d], 180, 'navy');
    // parallel marks (">") on both lines
    [[-W * 0.55, -d], [-W * 0.55, d]].forEach(function (p) { F.raw('<path d="M' + r1(p[0] - 5) + ',' + r1(p[1] - 6) + ' L' + r1(p[0] + 4) + ',' + r1(p[1]) + ' L' + r1(p[0] - 5) + ',' + r1(p[1] + 6) + '" fill="none" stroke="' + COL.navy + '" stroke-width="2.2"/>', []); });
    var ext = d * 1.9 / Math.sin(rad(th)), A = P(0, 0, ext, th), B = P(0, 0, ext, th + 180);
    F.line(B, A); F.arrowHead(A, th, 'navy'); F.arrowHead(B, th + 180, 'navy');
    if (s.lineNames) { F.ctext(W + 18, -d, s.lineNames[0], { italic: true, size: 16 }); F.ctext(W + 18, d, s.lineNames[1], { italic: true, size: 16 }); }
    if (s.tName) { var tp = P(0, 0, ext + 16, th); F.ctext(tp[0], tp[1], s.tName, { italic: true, size: 16 }); }
    // the eight angles: at each crossing, 1/5 upper-left, 2/6 upper-right, 3/7 lower-left, 4/8 lower-right
    var spans = { ul: [th, 180], ur: [0, th], ll: [180, 180 + th], lr: [180 + th, 360] }, order = ['ul', 'ur', 'll', 'lr'];
    var marks = s.marks || {}, colors = s.colors || {};
    [top, bot].forEach(function (X, k) {
      order.forEach(function (o, i) {
        var num = k * 4 + i + 1, sp = spans[o], lab = marks[num];
        if (lab !== undefined) markAngle(F, X, sp[0], sp[1], { label: lab, c: colors[num] || 'blue', r: 26 });
        else if (s.numbers) { var mid = (sp[0] + sp[1]) / 2, q = P(X[0], X[1], 22, mid); F.ctext(q[0], q[1], String(num), { size: 14, c: 'gray' }); }
      });
      F.dot(X, 'navy', 3);
    });
    if (s.caption) F.ctext(0, F.y1 + 20, s.caption, { size: 14, c: 'gray', weight: 600 });
    return F.svg(s.alt || 'two parallel lines cut by a transversal', s);
  };
  // triangle from two angles (third is 180 − A − B), base AB along the bottom
  function triPts(Aang, Bang, L) {
    var C = 180 - Aang - Bang, AC = L * Math.sin(rad(Bang)) / Math.sin(rad(C));
    var a = [0, 0], b = [L, 0], c = P(0, 0, AC, Aang); return { A: a, B: b, C: c, angC: C };
  }
  function sideLabel(F, p, q, other, text, o) {          // label beside a side, on the side away from the third vertex
    if (text === undefined || text === '') return;
    var mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
    if ((other[0] - mx) * nx + (other[1] - my) * ny > 0) { nx = -nx; ny = -ny; }
    var off = 14 + String(text).length * 2.6; F.ctext(mx + nx * off, my + ny * off, text, { c: (o && o.c) || 'navy', size: 16 });
  }
  function ticks(F, p, q, n) {
    if (!n) return; var mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
    for (var i = 0; i < n; i++) { var o = (i - (n - 1) / 2) * 6, cx = mx + ux * o, cy = my + uy * o;
      F.line([cx - uy * 7, cy + ux * 7], [cx + uy * 7, cy - ux * 7], { w: 2 }); }
  }
  function triangle(F, s, ox, scale) {
    var L = (s.base || 230) * (scale || 1), t = triPts(s.A, s.B, L), V = {};
    ['A', 'B', 'C'].forEach(function (k) { V[k] = [t[k][0] + ox, t[k][1]]; });
    var fill = s.fill || 'rgba(0,86,179,.06)';
    F.raw('<path d="M' + r1(V.A[0]) + ',' + r1(V.A[1]) + ' L' + r1(V.B[0]) + ',' + r1(V.B[1]) + ' L' + r1(V.C[0]) + ',' + r1(V.C[1]) + 'Z" fill="' + fill + '" stroke="' + LINE + '" stroke-width="2.5" stroke-linejoin="round"/>', [V.A, V.B, V.C]);
    var dir = function (p, q) { return Math.atan2(-(q[1] - p[1]), q[0] - p[0]) * 180 / Math.PI; };
    var ang = s.angles || {}, cl = s.colors || {}, names = s.names || ['A', 'B', 'C'];
    var at = { A: [dir(V.A, V.B), dir(V.A, V.C)], B: [dir(V.B, V.C), dir(V.B, V.A)], C: [dir(V.C, V.A), dir(V.C, V.B)] };
    var meas = { A: s.A, B: s.B, C: t.angC };
    ['A', 'B', 'C'].forEach(function (k, i) {
      var a0 = at[k][0], a1 = at[k][1]; if (((a1 - a0) % 360 + 360) % 360 > 180) { var tmp = a0; a0 = a1; a1 = tmp; }
      if (ang[k] !== undefined || Math.abs(meas[k] - 90) < 0.01) {
        var isRight = Math.abs(meas[k] - 90) < 0.01 && (ang[k] === undefined || ang[k] === '90°' || ang[k] === '');
        markAngle(F, V[k], a0, a1, { label: isRight ? undefined : ang[k], right: isRight, c: cl[k] || (isRight ? 'gray' : 'blue'), r: s.arcR || 26, labelR: (s.arcR || 26) + 22 + String(ang[k] || '').length * 2.4 });
      }
      var mid = a0 + (((a1 - a0) % 360 + 360) % 360) / 2;
      pointName(F, V[k], names[i], mid + 180, 17);
    });
    var sd = s.sides || {};
    sideLabel(F, V.A, V.B, V.C, sd.AB); sideLabel(F, V.B, V.C, V.A, sd.BC); sideLabel(F, V.C, V.A, V.B, sd.CA);
    var tk = s.ticks || {}; ticks(F, V.A, V.B, tk.AB); ticks(F, V.B, V.C, tk.BC); ticks(F, V.C, V.A, tk.CA);
    if (s.exterior) {                                     // extend the base past A or B and mark the outside angle
      var e = s.exterior, at2 = e.at || 'B';
      if (at2 === 'B') { var X = [V.B[0] + 90, V.B[1]]; F.line(V.B, X, { dash: '7 5' }); F.arrowHead(X, 0, 'navy');
        markAngle(F, V.B, 0, dir(V.B, V.C), { label: e.label, c: e.c || 'gold', r: 30 }); }
      else { var Y = [V.A[0] - 90, V.A[1]]; F.line(V.A, Y, { dash: '7 5' }); F.arrowHead(Y, 180, 'navy');
        markAngle(F, V.A, dir(V.A, V.C), 180, { label: e.label, c: e.c || 'gold', r: 30 }); }
    }
    return V;
  }
  T.triangle = function (s) {
    var F = new Fig(); triangle(F, s, 0, s.scale);
    if (s.caption) F.ctext((F.x0 + F.x1) / 2, F.y1 + 20, s.caption, { size: 14, c: 'gray', weight: 600 });
    return F.svg(s.alt || 'triangle', s);
  };
  T.similar = function (s) {
    var F = new Fig(), k = s.k || 1.5, base = s.base || 150;
    var l = s.left || {}, r = s.right || {};
    triangle(F, { A: s.A, B: s.B, names: l.names || ['A', 'B', 'C'], angles: l.angles || s.angles, colors: l.colors || s.colors, sides: l.sides, ticks: l.ticks, base: base, fill: 'rgba(0,86,179,.07)' }, 0, 1);
    triangle(F, { A: s.A, B: s.B, names: r.names || ['D', 'E', 'F'], angles: r.angles || s.angles, colors: r.colors || s.colors, sides: r.sides, ticks: r.ticks, base: base, fill: 'rgba(224,168,0,.10)' }, base + 70, k);
    if (s.caption) F.ctext((F.x0 + F.x1) / 2, F.y1 + 20, s.caption, { size: 14, c: 'gray', weight: 600 });
    return F.svg(s.alt || 'two similar triangles', s);
  };
  // right triangle with legs a (across) and b (up); optional squares on each side
  T.righttri = function (s) {
    var F = new Fig(), u = s.unitPx || Math.min(200 / Math.max(s.a, s.b), 40), A = [0, 0], B = [s.a * u, 0], C = [0, -s.b * u];
    var lab = s.labels || { a: String(s.a), b: String(s.b), c: 'c' }, nm = s.names || [];
    if (s.squares) {
      var cen0 = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
      var sq = function (p, q, c) { var dx = q[0] - p[0], dy = q[1] - p[1], n = [dy, -dx];  // square on the OUTSIDE (away from the triangle)
        var mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2; if ((cen0[0] - mx) * n[0] + (cen0[1] - my) * n[1] > 0) n = [-n[0], -n[1]];
        var pts = [p, q, [q[0] + n[0], q[1] + n[1]], [p[0] + n[0], p[1] + n[1]]];
        F.raw('<path d="M' + pts.map(function (v) { return r1(v[0]) + ',' + r1(v[1]); }).join(' L') + 'Z" fill="' + fil(c) + '" stroke="' + col(c) + '" stroke-width="2"/>', pts); return pts; };
      var s1 = sq(A, B, 'blue'), s2 = sq(C, A, 'green'), s3 = sq(B, C, 'gold');
      var cen = function (pts) { return [(pts[0][0] + pts[2][0]) / 2, (pts[0][1] + pts[2][1]) / 2]; };
      if (lab.sqa) { var c1 = cen(s1); F.ctext(c1[0], c1[1], lab.sqa, { c: 'blue' }); }
      if (lab.sqb) { var c2 = cen(s2); F.ctext(c2[0], c2[1], lab.sqb, { c: 'green' }); }
      if (lab.sqc) { var c3 = cen(s3); F.ctext(c3[0], c3[1], lab.sqc, { c: 'gold' }); }
    }
    F.raw('<path d="M0,0 L' + r1(B[0]) + ',0 L0,' + r1(C[1]) + 'Z" fill="rgba(0,86,179,.07)" stroke="' + LINE + '" stroke-width="2.5" stroke-linejoin="round"/>', [A, B, C]);
    markAngle(F, A, 0, 90, { right: true, c: 'gray' });
    if (!s.squares) { sideLabel(F, A, B, C, lab.a, { c: 'blue' }); sideLabel(F, C, A, B, lab.b, { c: 'green' }); sideLabel(F, B, C, A, lab.c, { c: 'gold' }); }
    if (nm[0]) pointName(F, A, nm[0], 225, 16); if (nm[1]) pointName(F, B, nm[1], -45, 16); if (nm[2]) pointName(F, C, nm[2], 135, 16);
    if (s.caption) F.ctext((F.x0 + F.x1) / 2, F.y1 + 20, s.caption, { size: 14, c: 'gray', weight: 600 });
    return F.svg(s.alt || 'right triangle', s);
  };
  // number line
  T.numline = function (s) {
    var F = new Fig(), W = s.width || 420, a = s.min, b = s.max, X = function (v) { return (v - a) / (b - a) * W; }, step = s.step || 1;
    F.line([-14, 0], [W + 14, 0]); F.arrowHead([W + 16, 0], 0, 'navy'); F.arrowHead([-16, 0], 180, 'navy');
    if (s.minor) for (var m = a; m <= b + 1e-9; m += s.minor) F.line([X(m), -5], [X(m), 5], { w: 1.2, c: 'gray' });
    for (var v = a; v <= b + 1e-9; v += step) { var vv = Math.round(v * 1e6) / 1e6; F.line([X(vv), -10], [X(vv), 10], { w: 2 }); F.ctext(X(vv), 26, s.fmt ? s.fmt(vv) : String(vv).replace('-', '−'), { size: 14, weight: 600 }); }
    if (s.brace) { var x1 = X(s.brace[0]), x2 = X(s.brace[1]);
      F.raw('<path d="M' + r1(x1) + ',-16 L' + r1(x1) + ',-24 L' + r1(x2) + ',-24 L' + r1(x2) + ',-16" fill="none" stroke="' + COL.gold + '" stroke-width="2"/>', [[x1, -24], [x2, -16]]);
      if (s.brace[2]) F.ctext((x1 + x2) / 2, -36, s.brace[2], { c: 'gold', size: 14 }); }
    (s.points || []).forEach(function (pt, i) {
      var x = X(pt.x), up = pt.below ? 1 : -1; F.dot([x, 0], pt.c || 'blue', 6);
      if (pt.open) F.raw('<circle cx="' + r1(x) + '" cy="0" r="4" fill="#fff"/>', []);
      F.ctext(x, up * (pt.lift || (pt.below ? 46 : 22 + (i % 2) * 18)), pt.label, { c: pt.c || 'blue', size: 15 });
    });
    if (s.caption) F.ctext(W / 2, F.y1 + 20, s.caption, { size: 14, c: 'gray', weight: 600 });
    return F.svg(s.alt || 'number line', s);
  };
  // coordinate plane
  T.plane = function (s) {
    var F = new Fig(), x0 = s.xmin, x1 = s.xmax, y0 = s.ymin, y1 = s.ymax, size = s.size || 300;
    var u = Math.min(size / (x1 - x0), size / (y1 - y0)), X = function (x) { return (x - x0) * u; }, Y = function (y) { return (y1 - y) * u; };
    var st = s.step || 1, le = s.labelEvery || st;
    for (var x = Math.ceil(x0 / st) * st; x <= x1 + 1e-9; x += st) F.line([X(x), Y(y0)], [X(x), Y(y1)], { c: '#D7DCE6', w: 1 });
    for (var y = Math.ceil(y0 / st) * st; y <= y1 + 1e-9; y += st) F.line([X(x0), Y(y)], [X(x1), Y(y)], { c: '#D7DCE6', w: 1 });
    if (y0 <= 0 && y1 >= 0) { F.line([X(x0), Y(0)], [X(x1) + 8, Y(0)], { w: 2 }); F.arrowHead([X(x1) + 10, Y(0)], 0, 'navy', 9); }
    if (x0 <= 0 && x1 >= 0) { F.line([X(0), Y(y0)], [X(0), Y(y1) - 8], { w: 2 }); F.arrowHead([X(0), Y(y1) - 10], 90, 'navy', 9); }
    var ax = (x0 <= 0 && x1 >= 0) ? X(0) : X(x0), ay = (y0 <= 0 && y1 >= 0) ? Y(0) : Y(y0);
    function tickLabels() {   // drawn after the lines so their white halo keeps numbers readable
    for (x = Math.ceil(x0 / le) * le; x <= x1 + 1e-9; x += le) { var xr = Math.round(x * 1e6) / 1e6; if (xr === 0 && x0 < 0) continue; if (xr === -le && x0 < 0 && y0 <= -le && u * le < 30 && !s.labelEvery) continue; F.ctext(X(xr), ay + 16, String(xr).replace('-', '−'), { size: 12, weight: 600, c: 'gray' }); }
    for (y = Math.ceil(y0 / le) * le; y <= y1 + 1e-9; y += le) { var yr = Math.round(y * 1e6) / 1e6; if (yr === 0 && y0 < 0) continue; F.ctext(ax - 6, Y(yr), String(yr).replace('-', '−'), { size: 12, weight: 600, c: 'gray', anchor: 'end' }); }
    }
    if (s.xlabel) F.ctext(X(x1) + 4, ay + 34, s.xlabel, { size: 13, c: 'navy' });
    if (s.ylabel) F.ctext(ax, Y(y1) - 22, s.ylabel, { size: 13, c: 'navy' });
    (s.polygons || []).forEach(function (pg) {
      var pts = pg.pts.map(function (p) { return [X(p[0]), Y(p[1])]; });
      F.raw('<path d="M' + pts.map(function (v) { return r1(v[0]) + ',' + r1(v[1]); }).join(' L') + 'Z" fill="' + (pg.fill || fil(pg.c || 'blue')) + '" stroke="' + col(pg.c || 'blue') + '" stroke-width="2.5"' + (pg.dash ? ' stroke-dasharray="' + pg.dash + '"' : '') + ' stroke-linejoin="round"/>', pts);
      (pg.names || []).forEach(function (n, i) { if (!n) return; var p = pts[i], c = pts.reduce(function (a, v) { return [a[0] + v[0] / pts.length, a[1] + v[1] / pts.length]; }, [0, 0]);
        var dx = p[0] - c[0], dy = p[1] - c[1], d = Math.hypot(dx, dy) || 1; F.ctext(p[0] + dx / d * 15, p[1] + dy / d * 15, n, { size: 14, c: pg.c || 'blue' }); });
    });
    (s.lines || []).forEach(function (ln) {
      var p, q;
      if (ln.p) { p = ln.p; q = ln.q; } else { p = [x0, ln.m * x0 + ln.b]; q = [x1, ln.m * x1 + ln.b]; }
      // clip to the window
      var dx = q[0] - p[0], dy = q[1] - p[1], t0 = -1e9, t1 = 1e9;
      [[dx, x0 - p[0], x1 - p[0]], [dy, y0 - p[1], y1 - p[1]]].forEach(function (z) { if (Math.abs(z[0]) < 1e-12) return; var a = z[1] / z[0], b = z[2] / z[0]; t0 = Math.max(t0, Math.min(a, b)); t1 = Math.min(t1, Math.max(a, b)); });
      var A = [X(p[0] + dx * t0), Y(p[1] + dy * t0)], B = [X(p[0] + dx * t1), Y(p[1] + dy * t1)];
      F.line(A, B, { c: ln.c || 'blue', w: 3, dash: ln.dash });
      if (ln.label) { var lx = ln.labelAt ? [X(ln.labelAt[0]), Y(ln.labelAt[1])] : [B[0] - 4, B[1] - 12]; F.ctext(lx[0], lx[1], ln.label, { c: ln.c || 'blue', size: 14 }); }
    });
    (s.segments || []).forEach(function (sg) { F.line([X(sg.p[0]), Y(sg.p[1])], [X(sg.q[0]), Y(sg.q[1])], { c: sg.c || 'navy', w: sg.w || 2.5, dash: sg.dash }); if (sg.label) F.ctext((X(sg.p[0]) + X(sg.q[0])) / 2 + (sg.dx || 0), (Y(sg.p[1]) + Y(sg.q[1])) / 2 + (sg.dy || -10), sg.label, { c: sg.c || 'navy', size: 14 }); });
    if (s.slopeTri) {                                     // rise and run between two points
      var a = s.slopeTri.p, b = s.slopeTri.q, corner = [b[0], a[1]];
      F.line([X(a[0]), Y(a[1])], [X(corner[0]), Y(corner[1])], { c: 'green', w: 2.5, dash: '6 4' });
      F.line([X(corner[0]), Y(corner[1])], [X(b[0]), Y(b[1])], { c: 'gold', w: 2.5, dash: '6 4' });
      F.ctext((X(a[0]) + X(corner[0])) / 2, Y(a[1]) + (b[1] >= a[1] ? 16 : -14), 'run = ' + String(b[0] - a[0]).replace('-', '−'), { c: 'green', size: 13 });
      F.ctext(X(corner[0]) + 10, (Y(a[1]) + Y(b[1])) / 2, 'rise = ' + String(b[1] - a[1]).replace('-', '−'), { c: 'gold', size: 13, anchor: 'start' });
    }
    tickLabels();
    (s.points || []).forEach(function (pt) {
      var p = [X(pt.x), Y(pt.y)]; F.dot(p, pt.c || 'navy', pt.r || 5);
      if (pt.label) { var d = pt.pos || 'ne', off = { ne: [10, -12], nw: [-10, -12], se: [10, 16], sw: [-10, 16], n: [0, -14], s: [0, 18], e: [12, 4], w: [-12, 4] }[d];
        F.text(p[0] + off[0], p[1] + off[1] + 5, pt.label, { size: 13, c: pt.c || 'navy', anchor: off[0] > 0 ? 'start' : off[0] < 0 ? 'end' : 'middle' }); }
    });
    if (s.caption) F.ctext((F.x0 + F.x1) / 2, F.y1 + 20, s.caption, { size: 14, c: 'gray', weight: 600 });
    return F.svg(s.alt || 'coordinate plane', s);
  };

  function draw(s) { var f = T[s.type]; return f ? f(s) : ''; }
  function drawAll(scope) {
    var els = (scope || document).querySelectorAll('[data-geo]');
    for (var i = 0; i < els.length; i++) { try { els[i].innerHTML = draw(JSON.parse(els[i].getAttribute('data-geo'))); } catch (e) { els[i].textContent = ''; if (window.console) console.warn('geo', e); } }
  }
  var api = { draw: draw, drawAll: drawAll, markAngle: markAngle, Fig: Fig, P: P, colors: COL };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else { root.GEO = api; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { drawAll(document); }); else drawAll(document); }
})(this);
