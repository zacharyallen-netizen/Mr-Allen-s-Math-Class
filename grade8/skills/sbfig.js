/* Skill Builders figures + animation builders (SVG strings). Every figure is drawn from its own numbers. */
(function () {
  'use strict';
  var SB = window.SB = window.SB || {};
  var C = SB.C = { navy: '#1E2D4F', gold: '#E0A800', gold2: '#FFC107', blue: '#1D4ED8', green: '#15803D', red: '#B42318', teal: '#0F766E',
    purple: '#6D28D9', orange: '#C2410C', gray: '#5B6475', light: '#E3E5EA', soft: '#EEF1F7', ink: '#1B2333' };
  function f(n) { return Math.round(n * 10) / 10; }
  function at(o) {
    o = o || {}; var s = '';
    if (o.id) s += ' id="' + o.id + '"';
    var cls = (o.cls || '') + (o.tw || o.id ? ' tw' : '') + (o.draw ? ' draw' : '');
    if (cls.trim()) s += ' class="' + cls.trim() + '"';
    var st = (o.style || '') + (o.hide ? 'opacity:0;' : '');
    if (st) s += ' style="' + st + '"';
    if (o.draw) s += ' pathLength="1"';
    return s;
  }
  var D = SB.D = {};
  D.minus = function (s) { return String(s).replace(/(^|[\s(=,])-(?=[\d.a-zπ(√])/g, '$1−'); };
  D.txt = function (x, y, s, o) {
    o = o || {};
    return '<text x="' + f(x) + '" y="' + f(y) + '" text-anchor="' + (o.a || 'middle') + '" font-size="' + (o.s || 16) + '" font-weight="' + (o.w || 600) + '" fill="' + (o.c || C.navy) + '"' +
      (o.mono ? ' font-family="JetBrains Mono,ui-monospace,monospace"' : '') + (o.serif ? ' font-family="Source Serif 4,Georgia,serif"' : '') + (o.it ? ' font-style="italic"' : '') + at(o) + '>' + s + '</text>';
  };
  D.line = function (x1, y1, x2, y2, o) {
    o = o || {};
    return '<line x1="' + f(x1) + '" y1="' + f(y1) + '" x2="' + f(x2) + '" y2="' + f(y2) + '" stroke="' + (o.c || C.navy) + '" stroke-width="' + (o.w || 2) + '"' +
      (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + (o.cap ? ' stroke-linecap="round"' : '') + (o.arrow ? ' marker-end="url(#' + o.arrow + ')"' : '') + at(o) + '/>';
  };
  D.rect = function (x, y, w, h, o) { o = o || {}; return '<rect x="' + f(x) + '" y="' + f(y) + '" width="' + f(w) + '" height="' + f(h) + '" rx="' + (o.r || 0) + '" fill="' + (o.fill || 'none') + '" stroke="' + (o.c || 'none') + '" stroke-width="' + (o.w || 1.5) + '"' + at(o) + '/>'; };
  D.circ = function (x, y, r, o) { o = o || {}; return '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + r + '" fill="' + (o.fill || C.navy) + '" stroke="' + (o.c || 'none') + '" stroke-width="' + (o.w || 2) + '"' + at(o) + '/>'; };
  D.poly = function (pts, o) { o = o || {}; return '<polygon points="' + pts.map(function (p) { return f(p[0]) + ',' + f(p[1]); }).join(' ') + '" fill="' + (o.fill || 'none') + '" stroke="' + (o.c || C.navy) + '" stroke-width="' + (o.w || 2) + '" stroke-linejoin="round"' + at(o) + '/>'; };
  D.path = function (d, o) { o = o || {}; return '<path d="' + d + '" fill="' + (o.fill || 'none') + '" stroke="' + (o.c || C.navy) + '" stroke-width="' + (o.w || 2) + '"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + (o.arrow ? ' marker-end="url(#' + o.arrow + ')"' : '') + at(o) + '/>'; };
  D.g = function (inner, o) { return '<g' + at(o) + '>' + inner + '</g>'; };
  D.arrowDefs = function () {
    return '<defs>' + [['ah', C.navy], ['ahg', C.gold], ['ahb', C.blue], ['ahr', C.red], ['ahgr', C.green]].map(function (a) {
      return '<marker id="' + a[0] + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="' + a[1] + '"/></marker>';
    }).join('') + '</defs>';
  };
  /* arc for an angle at (cx, cy), from direction a1 to a2 (degrees, math orientation: 0 = right, 90 = up) */
  D.arc = function (cx, cy, r, a1, a2, o) {
    o = o || {}; var R = Math.PI / 180;
    var x1 = cx + r * Math.cos(a1 * R), y1 = cy - r * Math.sin(a1 * R), x2 = cx + r * Math.cos(a2 * R), y2 = cy - r * Math.sin(a2 * R);
    var sweep = ((a2 - a1) % 360 + 360) % 360, large = sweep > 180 ? 1 : 0;
    var d = 'M' + f(x1) + ',' + f(y1) + ' A' + r + ',' + r + ' 0 ' + large + ' 0 ' + f(x2) + ',' + f(y2);
    if (o.fill) d = 'M' + f(cx) + ',' + f(cy) + ' L' + f(x1) + ',' + f(y1) + ' A' + r + ',' + r + ' 0 ' + large + ' 0 ' + f(x2) + ',' + f(y2) + ' Z';
    return D.path(d, { c: o.c || C.gold, w: o.w || 2.5, fill: o.fill, id: o.id, hide: o.hide, cls: o.cls, style: o.style });
  };
  D.ray = function (cx, cy, deg, len) { var R = Math.PI / 180; return [cx + len * Math.cos(deg * R), cy - len * Math.sin(deg * R)]; };
  D.rightMark = function (x, y, a1, s, o) { // small square at corner (x,y) between directions a1 and a1+90
    var R = Math.PI / 180, u = [Math.cos(a1 * R), -Math.sin(a1 * R)], v = [Math.cos((a1 + 90) * R), -Math.sin((a1 + 90) * R)]; s = s || 14;
    return D.path('M' + f(x + u[0] * s) + ',' + f(y + u[1] * s) + ' L' + f(x + u[0] * s + v[0] * s) + ',' + f(y + u[1] * s + v[1] * s) + ' L' + f(x + v[0] * s) + ',' + f(y + v[1] * s), (o || { c: C.navy, w: 1.8 }));
  };
  /* number line */
  D.nl = function (o) {
    var x0 = o.x0 || 40, x1 = o.x1 || 600, y = o.y || 60, lo = o.lo, hi = o.hi, st = o.step || 1, lab = o.lab || function (v) { return D.minus(String(v)); };
    var X = function (v) { return x0 + (v - lo) / (hi - lo) * (x1 - x0); };
    var s = D.line(x0 - 14, y, x1 + 14, y, { w: 2 }) + D.path('M' + (x0 - 14) + ',' + y + ' l9,-6 v12 z', { fill: C.navy, w: 1 }) + D.path('M' + (x1 + 14) + ',' + y + ' l-9,-6 v12 z', { fill: C.navy, w: 1 });
    for (var v = lo; v <= hi + 1e-9; v += st) { var vv = Math.round(v * 1000) / 1000; s += D.line(X(vv), y - 7, X(vv), y + 7, { w: 1.6 }) + (o.nolab ? '' : D.txt(X(vv), y + 25, lab(vv), { s: o.fs || 14, w: 500, mono: true, c: C.ink })); }
    if (o.minor) for (var m = lo; m <= hi + 1e-9; m += o.minor) s += D.line(X(m), y - 4, X(m), y + 4, { w: 1, c: C.gray });
    return { svg: s, X: X };
  };
  /* coordinate grid, drawn with explicit lines */
  D.grid = function (o) {
    var mn = o.min, mx = o.max, sz = o.size || 300, ox = o.x || 20, oy = o.y || 20, n = mx - mn, u = sz / n;
    var P = function (x, y) { return [ox + (x - mn) * u, oy + (mx - y) * u]; };
    var s = '';
    for (var i = 0; i <= n; i++) {
      var v = mn + i, ax = v === 0;
      s += D.line(ox + i * u, oy, ox + i * u, oy + sz, { c: ax ? C.navy : '#D9DEE7', w: ax ? 2 : 1 });
      s += D.line(ox, oy + i * u, ox + sz, oy + i * u, { c: ax ? C.navy : '#D9DEE7', w: ax ? 2 : 1 });
    }
    var step = o.labStep || (n > 12 ? 2 : 1);
    for (var k = mn; k <= mx; k++) {
      if (k === 0 || k % step) continue;
      var p = P(k, 0), q = P(0, k);
      s += D.txt(p[0], p[1] + 15, D.minus(String(k)), { s: 11, w: 500, c: C.gray, mono: true });
      s += D.txt(q[0] - 7, q[1] + 4, D.minus(String(k)), { s: 11, w: 500, c: C.gray, a: 'end', mono: true });
    }
    var e = P(mx, 0), t = P(0, mx);
    s += D.txt(e[0] + 2, e[1] - 6, 'x', { s: 14, it: true, a: 'end' }) + D.txt(t[0] + 8, t[1] + 12, 'y', { s: 14, it: true, a: 'start' });
    return { svg: s, P: P, u: u };
  };
  D.svg = function (w, h, inner, label) { return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" role="img" aria-label="' + (label || 'figure') + '" xmlns="http://www.w3.org/2000/svg" font-family="Inter,system-ui,sans-serif">' + inner + '</svg>'; };

  /* ---------- equation animation (monospace, lined up on the = sign; moves sit UNDER the matching like term) ----------
     rows: [{ L, R, rel, lab, mv: { L: [under, text], R: [under, text] }, cancel: { L: [terms], R: [terms] }, div: k, cap }] */
  var A = SB.A = {};
  A.eq = function (rows, o) {
    o = o || {}; var fs = o.fs || 22, cw = fs * 0.6, W = o.w || 640, xe = o.xe || 300, top = o.top || 46, gap = o.gap || 64;
    var svg = D.arrowDefs(), frames = [], set0 = {};
    function pos(side, str, term) { var i = str.indexOf(term); if (i < 0) i = side === 'L' ? Math.max(0, str.length - term.length) : 0; return i; }
    var lx = xe - cw * 0.9, rx = xe + cw * 0.9;
    function xOf(side, str, term) { var i = pos(side, str, term); return side === 'L' ? lx - cw * str.length + cw * i : rx + cw * i; }
    rows.forEach(function (r, k) {
      var rel = r.rel || '=', L = D.minus(r.L), R = D.minus(r.R), ln = 'r' + k, y = top + k * gap;
      svg += D.g(D.txt(lx, y, L, { a: 'end', s: fs, mono: true }) + D.txt(xe, y, rel, { s: fs, mono: true, c: r.flip ? C.orange : C.navy }) + D.txt(rx, y, R, { a: 'start', s: fs, mono: true }), { id: ln, hide: k > 0 });
      if (o.labels !== false && r.lab) svg += D.txt(W - 14, y - gap / 2 + 6, '↓ ' + r.lab, { a: 'end', s: 13, w: 600, c: '#8A6100', id: ln + 'l', hide: true });
      if (k === 0) { frames.push({ cap: r.cap || ('Start with <b>' + L + ' ' + rel + ' ' + R + '</b>.'), set: {} }); return; }
      /* the move is written UNDER the line before (row k-1), under the matching like term on both sides */
      var P = rows[k - 1], PL = D.minus(P.L), PR = D.minus(P.R), py = y - gap, mvset = {}, have = false;
      if (r.mv) ['L', 'R'].forEach(function (sd) {
        var m = r.mv[sd]; if (!m) return; var str = sd === 'L' ? PL : PR, term = D.minus(m[0]), x0 = xOf(sd, str, term), t = D.minus(m[1]);
        svg += D.txt(x0 + cw * term.length / 2 - cw * t.length / 2, py + 28, t, { a: 'start', s: fs * 0.9, mono: true, c: C.gold, id: ln + 'm' + sd, hide: true });
        mvset[ln + 'm' + sd] = { o: 1 }; have = true;
      });
      if (r.div) {
        var lw = cw * PL.length, rw = cw * PR.length;
        svg += D.g(D.line(lx - lw, py + 10, lx, py + 10, { c: C.gold, w: 2.5 }) + D.txt(lx - lw / 2, py + 34, D.minus(String(r.div)), { s: fs * 0.9, mono: true, c: C.gold }) +
          D.line(rx, py + 10, rx + rw, py + 10, { c: C.gold, w: 2.5 }) + D.txt(rx + rw / 2, py + 34, D.minus(String(r.div)), { s: fs * 0.9, mono: true, c: C.gold }), { id: ln + 'dv', hide: true });
        mvset[ln + 'dv'] = { o: 1 }; have = true;
      }
      if (r.lab) mvset[ln + 'l'] = { o: 1 };
      if (have) frames.push({ cap: r.mcap || ('Do the same move to <b>both sides</b>: ' + (r.lab || '')), set: mvset });
      if (r.cancel) {
        var cset = {}, any = false;
        ['L', 'R'].forEach(function (sd) {
          (r.cancel[sd] || []).forEach(function (term, j) {
            var str = sd === 'L' ? PL : PR, tm = D.minus(term), x0 = xOf(sd, str, tm), x1 = x0 + cw * tm.length, cid = ln + 'x' + sd + j;
            svg += D.line(x0 - 2, py + 34, x1 + 2, py - fs + 4, { c: C.red, w: 2.5, id: cid, hide: true });
            cset[cid] = { o: 1 }; any = true;
          });
        });
        if (any) frames.push({ cap: r.ccap || 'These cancel: they make zero.', set: cset });
      }
      var fset = {}; fset[ln] = { o: 1 };
      frames.push({ cap: r.cap || ('Write the new line: <b>' + L + ' ' + rel + ' ' + R + '</b>'), set: fset });
    });
    var y = top + rows.length * gap;
    if (o.box) { var last = rows.length - 1; svg += D.rect(xe - 130, top + last * gap - 30, 260, 44, { c: C.green, w: 2.5, r: 8, id: 'box', hide: true }); frames.push({ cap: o.box, set: { box: { o: 1 } } }); }
    return { w: W, h: Math.max(o.h || 0, top + rows.length * gap), svg: svg, frames: frames, title: o.title };
  };
})();
