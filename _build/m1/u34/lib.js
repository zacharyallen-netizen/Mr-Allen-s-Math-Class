/* ==== Unit 3/4 visuals + answer checker (page-local; drawn from each problem's own numbers) ==== */
var M1 = (function () {
  'use strict';
  var C = { navy: '#1E2D4F', gold: '#E0A800', goldTx: '#7a5a00', green: '#15803D', grid: '#E3E7EE',
    axis: '#5a6680', red: '#B42318', purple: '#7C3AED', muted: '#6b7488', bg: '#fafcff', ink: '#1a1a24' };
  var MONO = "'JetBrains Mono',ui-monospace,Menlo,Consolas,monospace";
  var uid = 0;

  /* ---------- small helpers ---------- */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function r1(v) { return Math.round(v * 10) / 10; }
  function fmt(n, dp) {
    if (typeof n === 'string') return n;
    if (Math.abs(n) < 1e-9) n = 0;
    var p = Math.pow(10, dp == null ? 3 : dp);
    var s = String(Math.round(n * p) / p);
    return s.replace('-', '−');
  }
  function money(n, dp) {
    var v = Math.round(n * Math.pow(10, dp || 0)) / Math.pow(10, dp || 0);
    var s = v.toFixed(dp || 0).split('.');
    s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return '$' + s.join('.');
  }
  function commas(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  /* rich text: a^b or a^{..} superscript, a_{..} subscript */
  function rich(s) {
    s = String(s); var out = [], cur = '', i = 0;
    function push(t, k) { if (t) out.push({ t: t, k: k }); }
    while (i < s.length) {
      var ch = s[i];
      if ((ch === '^' || ch === '_') && i + 1 < s.length) {
        push(cur, 'n'); cur = '';
        var k = ch === '^' ? 'sup' : 'sub', t = '';
        if (s[i + 1] === '{') { var j = s.indexOf('}', i + 2); t = s.slice(i + 2, j); i = j + 1; }
        else { var m = /^[A-Za-z0-9.−\-]+/.exec(s.slice(i + 1)); t = m ? m[0] : ''; i += 1 + t.length; }
        push(t, k);
      } else { cur += ch; i++; }
    }
    push(cur, 'n');
    return out;
  }
  function tw(s, fs) { var w = 0; rich(s).forEach(function (p) { w += p.t.length * (p.k === 'n' ? 0.6 : 0.45) * fs; }); return w; }
  function text(x, y, s, o) {
    o = o || {}; var fs = o.fs || 11, parts = rich(s), h = '', base = 0;
    parts.forEach(function (p) {
      var dy = 0, size = '';
      if (p.k === 'sup') { dy = -0.42 * fs - base; base = -0.42 * fs; size = ' font-size="' + r1(fs * 0.75) + '"'; }
      else if (p.k === 'sub') { dy = 0.25 * fs - base; base = 0.25 * fs; size = ' font-size="' + r1(fs * 0.75) + '"'; }
      else { dy = -base; base = 0; }
      h += '<tspan' + (dy ? ' dy="' + r1(dy) + '"' : '') + size + '>' + esc(p.t) + '</tspan>';
    });
    var halo = o.halo === false ? '' : ' stroke="' + (o.haloC || '#fff') + '" stroke-width="3.2" stroke-linejoin="round" paint-order="stroke"';
    return '<text x="' + r1(x) + '" y="' + r1(y) + '" font-size="' + fs + '" fill="' + (o.c || C.navy) + '" text-anchor="' + (o.a || 'middle') +
      '" font-family="' + (o.fam || MONO) + '"' + (o.b ? ' font-weight="700"' : '') + (o.it ? ' font-style="italic"' : '') + halo +
      (o.cls ? ' class="' + o.cls + '"' : '') + '>' + h + '</text>';
  }
  function pill(cx, cy, s, o) {
    o = o || {}; var fs = o.fs || 11, w = tw(s, fs) + 10, h = fs + 6;
    return '<rect x="' + r1(cx - w / 2) + '" y="' + r1(cy - h / 2) + '" width="' + r1(w) + '" height="' + r1(h) + '" rx="' + r1(h / 2) +
      '" fill="' + (o.bg || C.gold) + '" stroke="' + (o.st || '#b38600') + '" stroke-width="1"/>' +
      text(cx, cy + fs * 0.36, s, { fs: fs, c: o.c || C.ink, b: true, halo: false });
  }
  function svgOpen(W, H, label) {
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' +
      esc(label || 'diagram') + '" style="max-width:100%;height:auto">';
  }
  function arrowDef(id, c) {
    return '<marker id="' + id + '" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L7,3 L0,6 Z" fill="' + c + '"/></marker>';
  }

  /* ---------- label placement ---------- */
  function Placer(bounds) { this.b = bounds; this.r = []; this.segs = []; }
  function segHit(s, q) {
    var x1 = s[0], y1 = s[1], dx = s[2] - x1, dy = s[3] - y1, t0 = 0, t1 = 1, p = [-dx, dx, -dy, dy], qq = [x1 - q.x + 1, q.x + q.w + 1 - x1, y1 - q.y + 1, q.y + q.h + 1 - y1];
    for (var i = 0; i < 4; i++) {
      if (p[i] === 0) { if (qq[i] < 0) return false; continue; }
      var t = qq[i] / p[i];
      if (p[i] < 0) { if (t > t1) return false; if (t > t0) t0 = t; } else { if (t < t0) return false; if (t < t1) t1 = t; }
    }
    return true;
  }
  Placer.prototype.ok = function (q, strict) {
    var b = this.b;
    if (strict) for (var j = 0; j < this.segs.length; j++) if (segHit(this.segs[j], q)) return false;
    if (q.x < b.x || q.y < b.y || q.x + q.w > b.x + b.w || q.y + q.h > b.y + b.h) return false;
    for (var i = 0; i < this.r.length; i++) { var p = this.r[i];
      if (q.x < p.x + p.w && q.x + q.w > p.x && q.y < p.y + p.h && q.y + q.h > p.y) return false; }
    return true;
  };
  Placer.prototype.add = function (q) { this.r.push(q); };
  Placer.prototype.pick = function (cands, w, h) {
    for (var pass = 0; pass < 2; pass++) for (var i = 0; i < cands.length; i++) {
      var q = { x: cands[i][0] - w / 2, y: cands[i][1] - h / 2, w: w, h: h };
      if (this.ok(q, pass === 0)) { this.add(q); return [cands[i][0], cands[i][1]]; }
    }
    var b = this.b, c = cands[0] || [b.x + b.w / 2, b.y + b.h / 2];
    var x = Math.min(Math.max(c[0], b.x + w / 2), b.x + b.w - w / 2), y = Math.min(Math.max(c[1], b.y + h / 2), b.y + b.h - h / 2);
    this.add({ x: x - w / 2, y: y - h / 2, w: w, h: h });
    return [x, y];
  };

  /* ---------- line / half-plane math ---------- */
  function toLine(it) {
    if (it.vx != null) return { vx: it.vx };
    if (it.A != null) { if (it.B === 0) return { vx: it.C / it.A }; return { m: -it.A / it.B, b: it.C / it.B }; }
    return { m: it.m, b: it.b };
  }
  function hpVal(h, x, y) {
    var L = toLine(h);
    if (L.vx != null) return h.s === '>' || h.s === '>=' ? x - L.vx : L.vx - x;
    var d = y - (L.m * x + L.b);
    return (h.s === '>' || h.s === '>=') ? d : -d;
  }
  function clipPoly(poly, h) {
    var out = [];
    for (var i = 0; i < poly.length; i++) {
      var P = poly[i], Q = poly[(i + 1) % poly.length], gp = hpVal(h, P[0], P[1]), gq = hpVal(h, Q[0], Q[1]);
      if (gp >= 0) out.push(P);
      if ((gp >= 0) !== (gq >= 0)) { var t = gp / (gp - gq); out.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]); }
    }
    return out;
  }
  function solve2(a1, b1, c1, a2, b2, c2) {
    var D = a1 * b2 - a2 * b1;
    if (Math.abs(D) < 1e-12) {
      var same = Math.abs(a1 * c2 - a2 * c1) < 1e-9 && Math.abs(b1 * c2 - b2 * c1) < 1e-9;
      return { type: same ? 'inf' : 'none' };
    }
    return { type: 'one', x: (c1 * b2 - c2 * b1) / D, y: (a1 * c2 - a2 * c1) / D };
  }

  /* ---------- coordinate plane ---------- */
  function plane(o) {
    var W = o.w || 300, H = o.h || W, tfs = o.tfs || 10, fs = o.fs || 11;
    var x0 = o.x[0], x1 = o.x[1], y0 = o.y[0], y1 = o.y[1];
    var xs = o.xs || 1, ys = o.ys || 1, xl = o.xl || xs, yl = o.yl || ys;
    var tick = o.tick || function (v) { return fmt(v); };
    var ylabs = [], v;
    for (v = Math.ceil(y0 / yl - 1e-9) * yl; v <= y1 + 1e-9; v += yl) ylabs.push(+v.toFixed(6));
    var maxYW = 0; ylabs.forEach(function (q) { maxYW = Math.max(maxYW, tw(tick(q), tfs)); });
    var yEdge = x0 >= 0, xEdge = y0 >= 0;
    var L = (yEdge ? maxYW + 9 : 10) + (o.ytitle ? 16 : 0);
    var B = H - ((xEdge ? 17 : 10) + (o.xtitle ? 15 : 0));
    var T = 10, R = W - 10;
    function sx(x) { return L + (x - x0) / (x1 - x0) * (R - L); }
    function sy(y) { return B - (y - y0) / (y1 - y0) * (B - T); }
    var id = 'cp' + (++uid), mk = 'mk' + uid;
    var s = svgOpen(W, H, o.label);
    s += '<defs><clipPath id="' + id + '"><rect x="' + r1(L) + '" y="' + r1(T) + '" width="' + r1(R - L) + '" height="' + r1(B - T) + '"/></clipPath>' +
      arrowDef(mk + 'n', C.navy) + arrowDef(mk + 'g', C.gold) + arrowDef(mk + 'G', C.green) + '</defs>';
    s += '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="' + C.bg + '"/>';
    // grid
    for (v = Math.ceil(x0 / xs - 1e-9) * xs; v <= x1 + 1e-9; v += xs) s += '<line x1="' + r1(sx(v)) + '" y1="' + T + '" x2="' + r1(sx(v)) + '" y2="' + r1(B) + '" stroke="' + C.grid + '" stroke-width="1"/>';
    for (v = Math.ceil(y0 / ys - 1e-9) * ys; v <= y1 + 1e-9; v += ys) s += '<line x1="' + r1(L) + '" y1="' + r1(sy(v)) + '" x2="' + r1(R) + '" y2="' + r1(sy(v)) + '" stroke="' + C.grid + '" stroke-width="1"/>';
    var bounds = { x: L + 1, y: T + 1, w: R - L - 2, h: B - T - 2 };
    var P = new Placer(bounds), PV = new Placer({ x: 1, y: 1, w: W - 2, h: H - 2 });
    PV.segs = P.segs;
    function both(q) { P.add(q); PV.add(q); }
    var items = o.items || [];
    // shaded regions
    var g = '';
    items.forEach(function (it) {
      if (it.t !== 'region') return;
      var poly = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
      it.hp.forEach(function (h) { if (poly.length) poly = clipPoly(poly, h); });
      if (poly.length > 2) g += '<polygon points="' + poly.map(function (p) { return r1(sx(p[0])) + ',' + r1(sy(p[1])); }).join(' ') + '" fill="' + (it.c || C.navy) + '" fill-opacity="' + (it.op || 0.16) + '" stroke="none"/>';
    });
    s += '<g clip-path="url(#' + id + ')">' + g + '</g>';
    // axes
    var ax = (y0 <= 0 && y1 >= 0) ? 0 : y0, ay = (x0 <= 0 && x1 >= 0) ? 0 : x0;
    s += '<line x1="' + r1(L) + '" y1="' + r1(sy(ax)) + '" x2="' + r1(R) + '" y2="' + r1(sy(ax)) + '" stroke="' + C.axis + '" stroke-width="1.6"/>';
    s += '<line x1="' + r1(sx(ay)) + '" y1="' + T + '" x2="' + r1(sx(ay)) + '" y2="' + r1(B) + '" stroke="' + C.axis + '" stroke-width="1.6"/>';
    P.segs.push([L, sy(ax), R, sy(ax)], [sx(ay), T, sx(ay), B]);
    var inside = (x0 < 0 && x1 > 0 && y0 < 0 && y1 > 0);
    var tl = '';
    for (v = Math.ceil(x0 / xl - 1e-9) * xl; v <= x1 + 1e-9; v += xl) {
      v = +v.toFixed(6); if (inside && v === 0) continue; if (!inside && v === x0 && yEdge && xEdge && v === 0) { /* shared corner 0 */ }
      var lab = tick(v), w = tw(lab, tfs), X = sx(v), Y = sy(ax) + tfs + 3, an = 'middle';
      if (X + w / 2 > W - 2) { an = 'end'; X = W - 2; } else if (X - w / 2 < 2) { an = 'start'; X = 2; }
      var bx = an === 'middle' ? X - w / 2 : an === 'end' ? X - w : X;
      both({ x: bx, y: Y - tfs, w: w, h: tfs + 2 });
      tl += text(X, Y, lab, { fs: tfs, c: C.axis, a: an });
    }
    for (var k = 0; k < ylabs.length; k++) {
      v = ylabs[k]; if (inside && v === 0) continue; if (xEdge && yEdge && v === y0 && ax === y0) continue;
      var labY = tick(v), wy = tw(labY, tfs), Yy = sy(v) + tfs * 0.35;
      if (Yy - tfs < 1) Yy = tfs + 1;
      both({ x: sx(ay) - 4 - wy, y: Yy - tfs, w: wy, h: tfs + 2 });
      tl += text(sx(ay) - 4, Yy, labY, { fs: tfs, c: C.axis, a: 'end' });
    }
    if (inside) { tl += text(sx(0) - 4, sy(0) + tfs + 2, '0', { fs: tfs, c: C.axis, a: 'end' }); both({ x: sx(0) - 12, y: sy(0) + 2, w: 9, h: tfs + 2 }); }
    s += tl;
    var xn = o.xname == null ? 'x' : o.xname, yn = o.yname == null ? 'y' : o.yname;
    if (xn) { s += text(R - 2, sy(ax) - 5, xn, { fs: 11, c: C.axis, a: 'end', it: true }); both({ x: R - 2 - tw(xn, 11), y: sy(ax) - 16, w: tw(xn, 11), h: 12 }); }
    if (yn) { s += text(sx(ay) + 5, T + 10, yn, { fs: 11, c: C.axis, a: 'start', it: true }); both({ x: sx(ay) + 5, y: T, w: tw(yn, 11), h: 12 }); }
    if (o.xtitle) s += text((L + R) / 2, H - 4, o.xtitle, { fs: 10.5, c: C.axis, fam: 'Inter,system-ui,sans-serif' });
    if (o.ytitle) s += '<g transform="rotate(-90 11 ' + r1((T + B) / 2) + ')">' + text(11, (T + B) / 2 + 4, o.ytitle, { fs: 10.5, c: C.axis, fam: 'Inter,system-ui,sans-serif' }) + '</g>';
    // lines, curves, segments (clipped)
    var cl = '', labels = [];
    items.forEach(function (it) {
      if (it.t === 'line') {
        var Ln = toLine(it), col = it.c || C.navy, dash = it.dash ? ' stroke-dasharray="' + (it.dash === true ? '7 5' : it.dash) + '"' : '';
        var p1, p2;
        if (Ln.vx != null) { p1 = [Ln.vx, y0 - 1]; p2 = [Ln.vx, y1 + 1]; }
        else { var ex = (x1 - x0); p1 = [x0 - ex, Ln.m * (x0 - ex) + Ln.b]; p2 = [x1 + ex, Ln.m * (x1 + ex) + Ln.b]; }
        cl += '<line x1="' + r1(sx(p1[0])) + '" y1="' + r1(sy(p1[1])) + '" x2="' + r1(sx(p2[0])) + '" y2="' + r1(sy(p2[1])) + '" stroke="' + col + '" stroke-width="' + (it.w || 2.6) + '"' + dash + ' stroke-linecap="round"/>';
        var seg = visSeg(Ln);
        if (seg) { P.segs.push([seg[0][0], seg[0][1], seg[1][0], seg[1][1]]); }
        if (it.label && seg) labels.push({ s: it.label, c: it.lc || col, seg: seg, fr: it.at, pill: it.pill });
      } else if (it.t === 'fn') {
        var dom = it.dom || [x0, x1], N = 260, d = '', pen = false, pts = [], span = y1 - y0;
        for (var i = 0; i <= N; i++) {
          var xx = dom[0] + (dom[1] - dom[0]) * i / N, yy = it.f(xx);
          if (!isFinite(yy) || yy > y1 + 3 * span || yy < y0 - 3 * span) { pen = false; continue; }
          d += (pen ? 'L' : 'M') + r1(sx(xx)) + ',' + r1(sy(yy)); pen = true;
          if (yy >= y0 && yy <= y1 && xx >= x0 && xx <= x1) pts.push([sx(xx), sy(yy)]);
        }
        cl += '<path d="' + d + '" fill="none" stroke="' + (it.c || C.navy) + '" stroke-width="' + (it.w || 2.6) + '"' + (it.dash ? ' stroke-dasharray="7 5"' : '') + ' stroke-linejoin="round"/>';
        for (var pi = 0; pi + 3 < pts.length; pi += 3) P.segs.push([pts[pi][0], pts[pi][1], pts[pi + 3][0], pts[pi + 3][1]]);
        if (it.label && pts.length > 2) labels.push({ s: it.label, c: it.lc || it.c || C.navy, pts: pts, fr: it.at, pill: it.pill });
      } else if (it.t === 'seg') {
        var cc = it.c || C.navy, mkr = it.arrow ? ' marker-end="url(#' + mk + (cc === C.gold ? 'g' : cc === C.green ? 'G' : 'n') + ')"' : '';
        cl += '<line x1="' + r1(sx(it.x1)) + '" y1="' + r1(sy(it.y1)) + '" x2="' + r1(sx(it.x2)) + '" y2="' + r1(sy(it.y2)) + '" stroke="' + cc + '" stroke-width="' + (it.w || 2) + '"' + (it.dash ? ' stroke-dasharray="4 4"' : '') + mkr + '/>';
      }
    });
    s += '<g clip-path="url(#' + id + ')">' + cl + '</g>';
    function visSeg(Ln) {
      if (Ln.vx != null) { if (Ln.vx < x0 || Ln.vx > x1) return null; return [[sx(Ln.vx), sy(y1)], [sx(Ln.vx), sy(y0)]]; }
      var a = x0, b = x1;
      if (Math.abs(Ln.m) > 1e-12) {
        var xa = (y0 - Ln.b) / Ln.m, xb = (y1 - Ln.b) / Ln.m, lo = Math.min(xa, xb), hi = Math.max(xa, xb);
        a = Math.max(a, lo); b = Math.min(b, hi);
      } else if (Ln.b < y0 || Ln.b > y1) return null;
      if (a >= b) return null;
      return [[sx(a), sy(Ln.m * a + Ln.b)], [sx(b), sy(Ln.m * b + Ln.b)]];
    }
    // points (draw), register rects
    var pt = '';
    items.forEach(function (it) {
      if (it.t !== 'pt') return;
      var X = sx(it.x), Y = sy(it.y), col = it.c || C.navy, r = it.r || 4.5;
      pt += '<circle cx="' + r1(X) + '" cy="' + r1(Y) + '" r="' + r + '" fill="' + (it.hollow ? '#fff' : col) + '" stroke="' + (it.st || (col === C.gold ? '#8a6500' : col)) + '" stroke-width="2"' + (it.id ? ' id="' + it.id + '"' : '') + '/>';
      both({ x: X - r - 1, y: Y - r - 1, w: 2 * r + 2, h: 2 * r + 2 });
      if (it.label) labels.unshift({ s: it.label, c: it.lc || col, at: [X, Y], pill: it.pill, pt: true, id: it.lid });
    });
    items.forEach(function (it) { if (it.t === 'txt') labels.push({ s: it.s, c: it.c || C.navy, fixed: [sx(it.x), sy(it.y)], pill: it.pill, fs: it.fs, a: it.a }); });
    // labels
    var lt = '';
    labels.forEach(function (lb) {
      var lfs = lb.fs || fs, w = tw(lb.s, lfs) + (lb.pill ? 10 : 2), h = lfs + (lb.pill ? 6 : 3), cands = [], pos;
      if (lb.pt) {
        var X = lb.at[0], Y = lb.at[1], ox = w / 2 + 8, oy = h / 2 + 6;
        cands = [[X + ox, Y - oy], [X - ox, Y - oy], [X + ox, Y + oy], [X - ox, Y + oy], [X, Y - oy - 4], [X, Y + oy + 4], [X + ox + 4, Y], [X - ox - 4, Y]];
        pos = PV.pick(cands, w, h); P.add({ x: pos[0] - w / 2, y: pos[1] - h / 2, w: w, h: h });
      } else if (lb.fixed) {
        pos = PV.pick([lb.fixed], w, h); P.add({ x: pos[0] - w / 2, y: pos[1] - h / 2, w: w, h: h });
      } else {
        var fr = lb.fr != null ? [lb.fr] : [], base = [0.86, 0.14, 0.7, 0.3, 0.5, 0.94, 0.06, 0.6, 0.4];
        fr = fr.concat(base);
        fr.forEach(function (f) {
          var A, Bp, ux, uy;
          if (lb.seg) { A = lb.seg[0]; Bp = lb.seg[1]; ux = Bp[0] - A[0]; uy = Bp[1] - A[1]; var px = A[0] + ux * f, py = A[1] + uy * f; }
          else { var n = lb.pts.length, ii = Math.min(n - 2, Math.max(1, Math.round(f * (n - 1)))); px = lb.pts[ii][0]; py = lb.pts[ii][1]; ux = lb.pts[ii + 1][0] - lb.pts[ii - 1][0]; uy = lb.pts[ii + 1][1] - lb.pts[ii - 1][1]; }
          var len = Math.sqrt(ux * ux + uy * uy) || 1, nx = -uy / len, ny = ux / len, dd = Math.abs(nx) * w / 2 + Math.abs(ny) * h / 2 + 5;
          cands.push([px + nx * dd, py + ny * dd]); cands.push([px - nx * dd, py - ny * dd]);
        });
        pos = P.pick(cands, w, h); PV.add({ x: pos[0] - w / 2, y: pos[1] - h / 2, w: w, h: h });
      }
      if (lb.pill) lt += pill(pos[0], pos[1], lb.s, { fs: lfs });
      else lt += text(pos[0], pos[1] + lfs * 0.36, lb.s, { fs: lfs, c: lb.c, b: true });
    });
    s += pt + lt + '</svg>';
    return s;
  }

  /* ---------- system graph: lines (navy, purple), crossing point ? -> green ---------- */
  function sys(o) {
    var cols = [C.navy, C.purple], items = (o.regions || []).slice();
    o.lines.forEach(function (L, i) {
      var it = { t: 'line', c: L.c || cols[i % 2], label: L.label, dash: L.dash, at: L.at, w: L.w };
      ['m', 'b', 'A', 'B', 'C', 'vx'].forEach(function (k) { if (L[k] != null) it[k] = L[k]; });
      items.push(it);
    });
    (o.pts || []).forEach(function (p) { items.push(p); });
    if (o.sol) {
      if (o.done) items.push({ t: 'pt', x: o.sol[0], y: o.sol[1], c: C.green, label: o.solLabel || '(' + fmt(o.sol[0]) + ', ' + fmt(o.sol[1]) + ')' });
      else items.push({ t: 'pt', x: o.sol[0], y: o.sol[1], c: C.gold, label: o.qLabel || '?', pill: true });
    }
    var q = {}; for (var k in o) q[k] = o[k]; q.items = items;
    return plane(q);
  }

  /* ---------- equation rows (substitution / elimination) ---------- */
  // rows: [{y, items:[{s, st, x?, a?}], cx?}]   st: n|box|tgt|gold|q|ans|x|mut|tag
  function eqrows(o) {
    var W = o.w || 300, H = o.h || 160, fs = o.fs || 15, s = svgOpen(W, H, o.label), id = 'ea' + (++uid), pos = {};
    s += '<defs>' + arrowDef(id + 'g', C.gold) + arrowDef(id + 'n', C.navy) + '</defs>';
    s += '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="' + C.bg + '"/>';
    var body = '';
    (o.rows || []).forEach(function (row, ri) {
      var f = row.fs || fs, ws = row.items.map(function (it) { return tw(it.s, it.fs || f) + (it.st && /box|tgt|gold|q/.test(it.st) ? 8 : 0); });
      var total = ws.reduce(function (a, b) { return a + b; }, 0), x = row.x != null ? row.x : (W - total) / 2;
      row.items.forEach(function (it, ii) {
        var w = ws[ii], f2 = it.fs || f, cx, left;
        if (it.x != null) { left = it.a === 'end' ? it.x - w : it.a === 'middle' ? it.x - w / 2 : it.x; } else left = x;
        cx = left + w / 2; x = left + w;
        pos[ri + ':' + ii] = { x: left, w: w, cx: cx, y: row.y, h: f2 + 8 };
        var y = row.y, st = it.st || 'n', top = y - f2 * 0.8 - 3, hh = f2 + 7;
        if (st === 'box') body += '<rect x="' + r1(left) + '" y="' + r1(top) + '" width="' + r1(w) + '" height="' + r1(hh) + '" rx="5" fill="#fff" stroke="' + C.navy + '" stroke-width="1.6"/>';
        if (st === 'tgt') body += '<rect x="' + r1(left) + '" y="' + r1(top) + '" width="' + r1(w) + '" height="' + r1(hh) + '" rx="5" fill="#fff8e1" stroke="' + C.gold + '" stroke-width="2" stroke-dasharray="4 3"/>';
        if (st === 'gold') body += '<rect x="' + r1(left) + '" y="' + r1(top) + '" width="' + r1(w) + '" height="' + r1(hh) + '" rx="5" fill="#ffe9a8" stroke="' + C.gold + '" stroke-width="1.6"/>';
        if (st === 'q') { body += pill(cx, y - f2 * 0.3, it.s, { fs: f2 - 1 }); return; }
        var col = st === 'ans' ? C.green : st === 'mut' ? '#8a93a6' : st === 'x' ? '#6b7488' : st === 'tag' ? C.goldTx : st === 'red' ? C.red : C.navy;
        body += text(cx, y, it.s, { fs: f2, c: col, b: st === 'ans' || st === 'tag' || st === 'gold', halo: false });
        if (st === 'x') body += '<line x1="' + r1(left - 1) + '" y1="' + r1(y + 2) + '" x2="' + r1(left + w + 1) + '" y2="' + r1(y - f2 * 0.75) + '" stroke="' + C.red + '" stroke-width="1.6" stroke-opacity="0.85"/>';
      });
    });
    (o.rules || []).forEach(function (r) { body += '<line x1="' + r.x1 + '" y1="' + r.y + '" x2="' + r.x2 + '" y2="' + r.y + '" stroke="' + C.navy + '" stroke-width="1.6"/>'; });
    (o.arrows || []).forEach(function (a) {
      var A = pos[a.from], Bq = pos[a.to]; if (!A || !Bq) return;
      var x1 = A.cx, y1 = A.y + 6, x2 = Bq.cx, y2 = Bq.y - Bq.h + 4, my = (y1 + y2) / 2;
      body += '<path d="M' + r1(x1) + ',' + r1(y1) + ' C' + r1(x1) + ',' + r1(my + 6) + ' ' + r1(x2) + ',' + r1(my - 6) + ' ' + r1(x2) + ',' + r1(y2) + '" fill="none" stroke="' + (a.c || C.gold) + '" stroke-width="2" marker-end="url(#' + id + 'g)"/>';
      if (a.s) body += text((x1 + x2) / 2 + (a.dx || 0), my + 4, a.s, { fs: 11, c: C.goldTx, b: true });
    });
    (o.notes || []).forEach(function (n) { body += text(n.x, n.y, n.s, { fs: n.fs || 11, c: n.c || C.muted, a: n.a || 'middle', fam: n.fam || 'Inter,system-ui,sans-serif', halo: false }); });
    return s + body + '</svg>';
  }
  function term(c, v, lead) {
    var a = Math.abs(c), core = (a === 1 && v ? '' : fmt(a)) + v;
    if (lead) return (c < 0 ? '−' : '') + core;
    return core;
  }
  function eqStd(A, B, Cc) {
    var s = '';
    if (A) s += term(A, 'x', true);
    if (B) s += (s ? (B < 0 ? ' − ' : ' + ') + term(B, 'y', false) : term(B, 'y', true));
    return s + ' = ' + fmt(Cc);
  }
  function eqSI(m, b, v) {
    v = v || 'y'; var s = v + ' = ';
    if (m) s += (m === 1 ? '' : m === -1 ? '−' : fmt(m)) + 'x';
    if (b || !m) s += m ? (b < 0 ? ' − ' + fmt(-b) : ' + ' + fmt(b)) : fmt(b);
    return s;
  }
  /* elimination diagram: e=[[A,B,C],[D,E,F]], k=[k1,k2] multipliers */
  function elim(o) {
    var e = o.e, k = o.k || [1, 1], done = o.done, fs = 15, W = 300;
    var cA = 92, cS = 110, cB = 160, cE = 184, cC = 246, rows = [], y = 26, rules = [], notes = [];
    function row(A, B, Cc, extra, st) {
      st = st || {};
      var it = [];
      it.push({ s: A ? term(A, 'x', true) : '', x: cA, a: 'end', st: st.a || 'n' });
      if (B) { it.push({ s: B < 0 ? '−' : '+', x: cS, a: 'middle', st: 'n' }); it.push({ s: term(B, 'y', false), x: cB, a: 'end', st: st.b || 'n' }); }
      it.push({ s: '=', x: cE, a: 'middle' }); it.push({ s: fmt(Cc), x: cC, a: 'end' });
      if (extra) it.push(extra);
      return { y: y, items: it };
    }
    var mult = (k[0] !== 1 || k[1] !== 1);
    var S = [k[0] * e[0][0] + k[1] * e[1][0], k[0] * e[0][1] + k[1] * e[1][1], k[0] * e[0][2] + k[1] * e[1][2]];
    var gone = Math.abs(S[1]) < 1e-12 ? 'y' : Math.abs(S[0]) < 1e-12 ? 'x' : null;
    var stc = gone === 'y' ? { b: 'x' } : gone === 'x' ? { a: 'x' } : {};
    if (mult) {
      rows.push(row(e[0][0], e[0][1], e[0][2], k[0] !== 1 ? { s: '×(' + fmt(k[0]) + ')', x: 254, a: 'start', st: 'tag', fs: 12 } : null)); y += 28;
      rows.push(row(e[1][0], e[1][1], e[1][2], k[1] !== 1 ? { s: '×(' + fmt(k[1]) + ')', x: 254, a: 'start', st: 'tag', fs: 12 } : null)); y += 24;
      notes.push({ x: 150, y: y + 2, s: 'multiply every term ↓', c: C.goldTx, fs: 11 }); y += 26;
    }
    rows.push(row(k[0] * e[0][0], k[0] * e[0][1], k[0] * e[0][2], null, stc)); y += 28;
    var r2 = row(k[1] * e[1][0], k[1] * e[1][1], k[1] * e[1][2], { s: '+', x: 18, a: 'middle', st: 'n' }, stc); rows.push(r2); y += 12;
    rules.push({ x1: 24, x2: 254, y: y }); y += 24;
    var q = function (v, st) { return done ? { s: v, st: 'ans' } : { s: '?', st: 'q' }; };
    var sum = [];
    if (gone === 'y') {
      sum.push(done ? { s: term(S[0], 'x', true), x: cA, a: 'end', st: 'ans' } : { s: '?x', x: cA, a: 'end', st: 'q' });
      sum.push({ s: '0', x: cB, a: 'end', st: 'mut' });
    } else if (gone === 'x') {
      sum.push({ s: '0', x: cA, a: 'end', st: 'mut' });
      sum.push(done ? { s: term(S[1], 'y', true), x: cB, a: 'end', st: 'ans' } : { s: '?y', x: cB, a: 'end', st: 'q' });
    }
    sum.push({ s: '=', x: cE, a: 'middle' });
    sum.push(done ? { s: fmt(S[2]), x: cC, a: 'end', st: 'ans' } : { s: '?', x: cC, a: 'end', st: 'q' });
    rows.push({ y: y, items: sum }); y += 20;
    if (gone) { notes.push({ x: 150, y: y, s: (gone === 'y' ? 'The y-terms' : 'The x-terms') + ' add to 0, so they cancel.', c: C.red, fs: 10.5 }); y += 4; }
    y += 22;
    var sol = solve2(e[0][0], e[0][1], e[0][2], e[1][0], e[1][1], e[1][2]);
    var v1 = gone === 'x' ? 'y' : 'x';
    if (done) rows.push({ y: y, items: [{ s: v1 + ' = ' + fmt(sol[v1]) + '   →   (x, y) = (' + fmt(sol.x) + ', ' + fmt(sol.y) + ')', st: 'ans', fs: 13 }] });
    else rows.push({ y: y, items: [{ s: v1 + ' = ', fs: 13 }, { s: '?', st: 'q', fs: 13 }, { s: '   →   (x, y) = (', fs: 13 }, { s: '?', st: 'q', fs: 13 }, { s: ', ', fs: 13 }, { s: '?', st: 'q', fs: 13 }, { s: ')', fs: 13 }] });
    y += 14;
    return eqrows({ w: W, h: y, rows: rows, rules: rules, notes: notes, label: o.label || 'elimination diagram' });
  }
  /* substitution diagram */
  function subst(o) {
    // o: eq1 [pieces], k1 index of expression, eq2 [pieces], k2 index of variable to replace, res: [pieces rows before], resDone
    var done = o.done, rows = [], y = 28, arrows = [];
    rows.push({ y: y, items: o.eq1.map(function (p, i) { return { s: p, st: i === o.k1 ? 'box' : 'n' }; }) }); y += 52;
    rows.push({ y: y, items: o.eq2.map(function (p, i) { return { s: p, st: i === o.k2 ? 'tgt' : 'n' }; }) });
    arrows.push({ from: '0:' + o.k1, to: '1:' + o.k2, s: 'swap in', dx: 34 });
    y += 40;
    rows.push({ y: y, items: o.eq2.map(function (p, i) { return { s: i === o.k2 ? '(' + o.eq1[o.k1] + ')' : p, st: i === o.k2 ? 'gold' : 'n' }; }) });
    y += 34;
    (done ? o.resDone : o.res).forEach(function (r) {
      rows.push({ y: y, items: r.map(function (p) { return typeof p === 'string' ? (p === '?' ? { s: '?', st: 'q', fs: 13 } : { s: p, fs: 13, st: done ? 'ans' : 'n' }) : p; }) }); y += 26;
    });
    return eqrows({ w: 300, h: y - 8, rows: rows, arrows: arrows, label: o.label || 'substitution diagram' });
  }

  /* ---------- tables with arrows ---------- */
  // o: {heads:['x','y'], rows:[[...],[...]], ops:[...], opsQ:bool, hide:[[r,c]..], done, opC}
  function tbl(o) {
    var n = o.rows[0].length, hw = o.hw || 44, cw = o.cw || Math.min(56, Math.floor((296 - hw) / n)), rh = 30, fs = o.fs || 12.5;
    var W = Math.max(hw + n * cw + 8, o.w || 0), top = 6, H = top + o.rows.length * rh + (o.ops ? 40 : 6), id = 'tb' + (++uid);
    var s = svgOpen(W, H, o.label || 'table') + '<defs>' + arrowDef(id, C.navy) + arrowDef(id + 'g', '#8a6500') + arrowDef(id + 'G', C.green) + '</defs>';
    s += '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="#fff"/>';
    var x0 = (W - (hw + n * cw)) / 2;
    o.rows.forEach(function (row, ri) {
      var y = top + ri * rh;
      s += '<rect x="' + r1(x0) + '" y="' + y + '" width="' + hw + '" height="' + rh + '" fill="' + C.navy + '" stroke="#fff"/>';
      s += text(x0 + hw / 2, y + rh / 2 + 4.5, o.heads[ri], { fs: 12.5, c: '#fff', b: true, halo: false });
      row.forEach(function (v, ci) {
        var cx = x0 + hw + ci * cw, hidden = (o.hide || []).some(function (h) { return h[0] === ri && h[1] === ci; });
        s += '<rect x="' + r1(cx) + '" y="' + y + '" width="' + cw + '" height="' + rh + '" fill="' + (ri % 2 ? '#f8faff' : '#fff') + '" stroke="#cdd5e0"/>';
        if (hidden && !o.done) s += pill(cx + cw / 2, y + rh / 2, '?', { fs: 12 });
        else s += text(cx + cw / 2, y + rh / 2 + fs * 0.36, typeof v === 'number' ? fmt(v) : v, { fs: v && String(v).length > 5 ? fs - 2 : fs, c: hidden ? C.green : C.navy, b: hidden, halo: false });
      });
    });
    if (o.ops) {
      var yb = top + o.rows.length * rh + 2;
      o.ops.forEach(function (op, i) {
        var xa = x0 + hw + i * cw + cw / 2 + 4, xb = x0 + hw + (i + 1) * cw + cw / 2 - 4, my = yb + 16;
        var q = o.opsQ && !o.done, col = q ? '#8a6500' : (o.opsQ ? C.green : (o.opC || C.navy));
        s += '<path d="M' + r1(xa) + ',' + yb + ' Q' + r1((xa + xb) / 2) + ',' + r1(my + 8) + ' ' + r1(xb) + ',' + yb + '" fill="none" stroke="' + col + '" stroke-width="1.6" marker-end="url(#' + id + (q ? 'g' : o.opsQ ? 'G' : '') + ')"/>';
        if (q) s += pill((xa + xb) / 2, my + 14, '?', { fs: 11 });
        else s += text((xa + xb) / 2, my + 18, op, { fs: 11, c: col, b: true });
      });
    }
    return s + '</svg>';
  }

  /* ---------- bar model of a sequence, with +d / ×r arrows ---------- */
  function bars(o) {
    var v = o.vals, n = v.length, W = o.w || 300, H = o.h || 220, L = 10, R = W - 8, base, top = 62, bot = 24, id = 'br' + (++uid);
    var vmax = Math.max.apply(null, v.concat([0])), vmin = Math.min.apply(null, v.concat([0]));
    if (o.max) vmax = Math.max(vmax, o.max);
    if (vmin < 0) bot += 20;
    var span = vmax - vmin || 1, ph = H - top - bot, slot = (R - L) / n, bw = Math.min(46, slot * 0.62);
    function Y(val) { return top + (vmax - val) / span * ph; }
    base = Y(0);
    var s = svgOpen(W, H, o.label || 'bar model') + '<defs>' + arrowDef(id, C.navy) + arrowDef(id + 'g', '#8a6500') + arrowDef(id + 'G', C.green) + '</defs>';
    s += '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="' + C.bg + '"/>';
    s += '<line x1="' + L + '" y1="' + r1(base) + '" x2="' + R + '" y2="' + r1(base) + '" stroke="' + C.axis + '" stroke-width="1.4"/>';
    v.forEach(function (val, i) {
      var cx = L + slot * (i + 0.5), hid = (o.hide || []).indexOf(i) >= 0, y1 = Y(Math.max(val, 0)), y2 = Y(Math.min(val, 0));
      var col = hid ? (o.done ? C.green : C.gold) : (o.c || C.navy);
      s += '<rect x="' + r1(cx - bw / 2) + '" y="' + r1(y1) + '" width="' + r1(bw) + '" height="' + r1(Math.max(1.5, y2 - y1)) + '" fill="' + col + '" fill-opacity="' + (hid && !o.done ? 0.35 : 0.85) + '"' + (hid && !o.done ? ' stroke="#8a6500" stroke-dasharray="4 3"' : '') + '/>';
      var lab = o.fmt ? o.fmt(val) : fmt(val), ly = val >= 0 ? y1 - 6 : y2 + 14;
      if (hid && !o.done) s += pill(cx, val >= 0 ? y1 - 12 : y2 + 12, '?', { fs: 11 });
      else s += text(cx, ly, lab, { fs: tw(lab, 11) > slot - 2 ? 9.5 : 11, c: hid ? C.green : C.navy, b: true });
      s += text(cx, H - 7, o.labs ? o.labs[i] : 'a_{' + (i + 1) + '}', { fs: 11, c: C.axis });
    });
    if (o.ops) o.ops.forEach(function (op, i) {
      var xa = L + slot * (i + 0.5) + 6, xb = L + slot * (i + 1.5) - 6, y = 32, q = op === '?';
      var col = q ? '#8a6500' : o.opC || C.navy;
      s += '<path d="M' + r1(xa) + ',' + (y + 8) + ' Q' + r1((xa + xb) / 2) + ',' + (y - 8) + ' ' + r1(xb) + ',' + (y + 8) + '" fill="none" stroke="' + col + '" stroke-width="1.6" marker-end="url(#' + id + (q ? 'g' : col === C.green ? 'G' : '') + ')"/>';
      if (q) s += pill((xa + xb) / 2, y - 12, '?', { fs: 11 }); else s += text((xa + xb) / 2, y - 7, op, { fs: 11, c: col, b: true });
    });
    return s + '</svg>';
  }

  /* ---------- number-line hops ---------- */
  function hops(o) {
    var W = o.w || 300, H = o.h || (o.note ? 134 : 116), L = 16, R = W - 16, y = H - (o.note ? 44 : 30), id = 'hp' + (++uid);
    function X(v) { return L + (v - o.min) / (o.max - o.min) * (R - L); }
    var s = svgOpen(W, H, o.label || 'number line') + '<defs>' + arrowDef(id, C.navy) + arrowDef(id + 'g', '#8a6500') + '</defs><rect x="0" y="0" width="' + W + '" height="' + H + '" fill="' + C.bg + '"/>';
    s += '<line x1="' + L + '" y1="' + y + '" x2="' + R + '" y2="' + y + '" stroke="' + C.axis + '" stroke-width="1.6"/>';
    for (var v = o.min; v <= o.max + 1e-9; v += o.tick) {
      var big = Math.abs(v / o.lab - Math.round(v / o.lab)) < 1e-9;
      s += '<line x1="' + r1(X(v)) + '" y1="' + (y - (big ? 6 : 3)) + '" x2="' + r1(X(v)) + '" y2="' + (y + (big ? 6 : 3)) + '" stroke="' + C.axis + '" stroke-width="1.2"/>';
      if (big) s += text(X(v), y + 19, fmt(v), { fs: 10, c: C.axis });
    }
    var cur = o.start, hopC = o.c || C.navy;
    for (var i = 0; i < o.count; i++) {
      var a = X(cur), b = X(cur + o.step), h = Math.min(30, Math.abs(b - a) * 0.9 + 8);
      s += '<path d="M' + r1(a) + ',' + (y - 3) + ' Q' + r1((a + b) / 2) + ',' + r1(y - 3 - h) + ' ' + r1(b) + ',' + (y - 3) + '" fill="none" stroke="' + hopC + '" stroke-width="1.6" marker-end="url(#' + id + ')"/>';
      if (o.every || i === 0) s += text((a + b) / 2, y - h / 2 - 8, (o.step > 0 ? '+' : '−') + fmt(Math.abs(o.step)), { fs: 10, c: hopC, b: true });
      cur += o.step;
    }
    s += '<circle cx="' + r1(X(o.start)) + '" cy="' + y + '" r="5" fill="' + C.navy + '"/>';
    var sl = o.startLab || fmt(o.start), sw = tw(sl, 11) / 2 + 2;
    s += text(Math.min(Math.max(X(o.start), sw), W - sw), 14, sl, { fs: 11, c: C.navy, b: true });
    var end = o.start + o.step * o.count;
    s += '<circle cx="' + r1(X(end)) + '" cy="' + y + '" r="5" fill="' + (o.done ? C.green : C.gold) + '" stroke="#8a6500" stroke-width="1"/>';
    var ex = Math.min(Math.max(X(end), 30), W - 30);
    if (o.done) s += text(ex, 14, o.endLab || fmt(end), { fs: 11, c: C.green, b: true }); else s += pill(ex, 11, o.endQ || '?', { fs: 11 });
    if (o.note) s += text(W / 2, H - 6, o.note, { fs: 10.5, c: C.muted, fam: 'Inter,system-ui,sans-serif', halo: false });
    return s + '</svg>';
  }

  /* ---------- mapping diagram (sequence = function) ---------- */
  function mapping(o) {
    var n = o.inp.length, W = 300, H = 40 + n * 30 + 10, id = 'mp' + (++uid);
    var s = svgOpen(W, H, o.label || 'mapping diagram') + '<defs>' + arrowDef(id, C.navy) + '</defs><rect x="0" y="0" width="' + W + '" height="' + H + '" fill="' + C.bg + '"/>';
    s += '<rect x="30" y="30" width="70" height="' + (n * 30 + 6) + '" rx="30" fill="#eef3fb" stroke="' + C.navy + '"/>';
    s += '<rect x="200" y="30" width="70" height="' + (n * 30 + 6) + '" rx="30" fill="#fff8e1" stroke="' + C.gold + '"/>';
    s += text(65, 18, o.h1 || 'n (term #)', { fs: 11, c: C.navy, b: true }); s += text(235, 18, o.h2 || 'a_n (term)', { fs: 11, c: C.goldTx, b: true });
    o.inp.forEach(function (v, i) {
      var y = 52 + i * 30;
      s += text(65, y, fmt(v), { fs: 13, c: C.navy, b: true, halo: false }); s += text(235, y, fmt(o.out[i]), { fs: 13, c: C.navy, b: true, halo: false });
      s += '<line x1="80" y1="' + (y - 4) + '" x2="214" y2="' + (y - 4) + '" stroke="' + C.navy + '" stroke-width="1.4" marker-end="url(#' + id + ')"/>';
    });
    return s + '</svg>';
  }

  /* ---------- balance scale ---------- */
  function balance(cx, cy, l, r, w) {
    w = w || 120; var s = '';
    s += '<polygon points="' + cx + ',' + (cy + 4) + ' ' + (cx - 10) + ',' + (cy + 26) + ' ' + (cx + 10) + ',' + (cy + 26) + '" fill="' + C.navy + '"/>';
    s += '<line x1="' + (cx - w / 2) + '" y1="' + cy + '" x2="' + (cx + w / 2) + '" y2="' + cy + '" stroke="' + C.navy + '" stroke-width="3" stroke-linecap="round"/>';
    [[-1, l], [1, r]].forEach(function (p) {
      var px = cx + p[0] * (w / 2 - 20);
      s += '<line x1="' + px + '" y1="' + cy + '" x2="' + px + '" y2="' + (cy - 8) + '" stroke="' + C.navy + '" stroke-width="1.5"/>';
      s += '<rect x="' + (px - 23) + '" y="' + (cy - 30) + '" width="46" height="22" rx="4" fill="#fff" stroke="' + C.navy + '" stroke-width="1.4"/>';
      s += text(px, cy - 14.5, p[1], { fs: 12, c: C.navy, b: true, halo: false });
    });
    return s;
  }

  /* ================= checker ================= */
  var SUP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '+', '⁽': '(', '⁾': ')', 'ⁿ': 'n', 'ˣ': 'x', 'ᵗ': 't' };
  var SUB = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', 'ₙ': 'n', '₋': '-', '₊': '+' };
  function norm(s) {
    s = String(s == null ? '' : s).trim(); var out = '', run = '';
    for (var i = 0; i < s.length; i++) { var ch = s[i];
      if (SUP[ch] !== undefined) { run += SUP[ch]; continue; }
      if (run) { out += '^(' + run + ')'; run = ''; }
      out += SUB[ch] !== undefined ? SUB[ch] : ch; }
    if (run) out += '^(' + run + ')';
    return out.toLowerCase().replace(/[−–—‒‐]/g, '-').replace(/[×✕⋅·∙]/g, '*').replace(/÷/g, '/')
      .replace(/√/g, 'sqrt').replace(/≤/g, '<=').replace(/≥/g, '>=').replace(/=</g, '<=').replace(/=>/g, '>=').replace(/\*\*/g, '^')
      .replace(/∞/g, 'inf').replace(/≈/g, '').replace(/\s+/g, '');
  }
  function parseExpr(str, vars) {
    var s = str, i = 0; vars = vars || [];
    function isVar(c) { return c && vars.indexOf(c) >= 0; }
    function atom() {
      var c = s[i];
      if (c === '(' || c === '[') { i++; var e = expr(); if (s[i] !== ')' && s[i] !== ']') throw 'paren'; i++; return e; }
      var m = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i));
      if (m) { i += m[0].length; var v = parseFloat(m[0]); return function () { return v; }; }
      if (s.substr(i, 4) === 'sqrt') { i += 4; var a = power(); return function (en) { return Math.sqrt(a(en)); }; }
      if (isVar(c)) { i++; return function (en) { return en[c]; }; }
      throw 'bad';
    }
    function power() { var a = atom(); if (s[i] === '^') { i++; var b = unary(); return function (en) { return Math.pow(a(en), b(en)); }; } return a; }
    function unary() { if (s[i] === '-') { i++; var a = unary(); return function (en) { return -a(en); }; } if (s[i] === '+') { i++; return unary(); } return power(); }
    function termP() {
      var a = unary();
      for (;;) {
        var c = s[i];
        if (c === '*' || c === '/') { i++; var b = unary(); a = (function (a, b, c) { return c === '*' ? function (e) { return a(e) * b(e); } : function (e) { return a(e) / b(e); }; })(a, b, c); }
        else if (c && (/[\d.(\[]/.test(c) || isVar(c) || s.substr(i, 4) === 'sqrt')) { var b2 = power(); a = (function (a, b) { return function (e) { return a(e) * b(e); }; })(a, b2); }
        else break;
      }
      return a;
    }
    function expr() { var a = termP(); while (s[i] === '+' || s[i] === '-') { var c = s[i++], b = termP(); a = (function (a, b, c) { return c === '+' ? function (e) { return a(e) + b(e); } : function (e) { return a(e) - b(e); }; })(a, b, c); } return a; }
    var f = expr(); if (i !== s.length) throw 'trail'; return f;
  }
  var PREFIX = /^([a-z]{1,2}(_?\(?[a-z0-9]{1,3}\)?)?)=/;
  function stripPrefix(s) { return s.replace(PREFIX, ''); }
  function parseNum(raw) {
    var s = norm(raw).replace(/\$/g, '').replace(/^(about|approximately|approx\.?)/, '');
    s = stripPrefix(s);
    if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g, '');
    s = s.replace(/%$/, '');
    var t = s.replace(/[a-z]+$/, '');
    try { var v = parseExpr(s, [])({}); if (isFinite(v)) return v; } catch (e) {}
    try { if (t && t !== s) { if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(t)) t = t.replace(/,/g, ''); var w = parseExpr(t, [])({}); if (isFinite(w)) return w; } } catch (e2) {}
    return null;
  }
  function parsePt(raw) {
    var s = norm(raw), mx = /x=([-+]?[\d.\/]+)/.exec(s), my = /y=([-+]?[\d.\/]+)/.exec(s), a, b;
    try {
      if (mx && my) { a = parseExpr(mx[1], [])({}); b = parseExpr(my[1], [])({}); return [a, b]; }
      s = s.replace(/^[(\[{]/, '').replace(/[)\]}]$/, '');
      var parts = s.split(/,|;|and/);
      if (parts.length !== 2 || !parts[0] || !parts[1]) return parts.length === 1 && parts[0] ? 'one' : null;
      a = parseExpr(parts[0], [])({}); b = parseExpr(parts[1], [])({});
      if (isFinite(a) && isFinite(b)) return [a, b];
    } catch (e) {}
    return null;
  }
  function parseIneq(raw, v) {
    var s = norm(raw), m = /^(.+?)(<=|>=|<|>)(.+)$/.exec(s), FL = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };
    if (m) {
      try {
        if (m[1] === v) return { op: m[2], n: parseExpr(m[3], [])({}) };
        if (m[3] === v) return { op: FL[m[2]], n: parseExpr(m[1], [])({}) };
      } catch (e) {}
      return null;
    }
    var iv = /^([(\[])(-?[\d.\/]+),(\+?inf(inity)?)\)$/.exec(s);
    if (iv) return { op: iv[1] === '(' ? '>' : '>=', n: parseFloat(iv[2]) };
    return null;
  }
  function near(a, b, tol) { return Math.abs(a - b) <= (tol != null ? tol : 1e-6 * Math.max(1, Math.abs(b))); }
  function exprEq(f, g, vars) {
    var samples = [0, 1, 2, 3, 0.5, 4, 1.7], ok = true;
    for (var i = 0; i < samples.length; i++) {
      var en = {}; vars.forEach(function (v) { en[v] = samples[i]; });
      var a = f(en), b = g(en);
      if (!isFinite(a) || !isFinite(b) || Math.abs(a - b) > 1e-6 * Math.max(1, Math.abs(b))) { ok = false; break; }
    }
    return ok;
  }

  var S = { items: {}, tried: {}, solved: {}, first: 0, V: {} };
  function reg(id, sp) { S.items[id] = sp; }
  function fbSay(id, cls, html) { var fb = document.getElementById('fb-' + id); if (fb) { fb.innerHTML = html; fb.className = 'chk-fb ' + cls + ' show'; } }
  function score() {
    var b = document.getElementById('score'); if (!b) return;
    var t = Object.keys(S.tried).length, d = Object.keys(S.solved).length;
    b.innerHTML = 'Score: <b>' + d + '</b> / ' + t + ' &nbsp;·&nbsp; right on the first try: <b>' + S.first + '</b>';
  }
  function judge(sp, raw) {
    var k = sp.kind, i, m;
    if (k === 'pt') {
      var p = parsePt(raw), a = sp.ans;
      if (p === 'one') return 'Type both numbers, like (2, 3): x first, then a comma, then y.';
      if (!p) return 'Type a point like (2, 3): the x-value, a comma, then the y-value.';
      if (near(p[0], a[0]) && near(p[1], a[1])) return true;
      for (i = 0; sp.miss && i < sp.miss.length; i++) { m = sp.miss[i]; if (near(p[0], m.v[0]) && near(p[1], m.v[1])) return m.m; }
      if (!near(a[0], a[1]) && near(p[0], a[1]) && near(p[1], a[0])) return 'So close! You switched x and y. The x-value always comes first: (x, y).';
      if (near(p[0], a[0])) return near(Math.abs(p[1]), Math.abs(a[1])) ? 'Your x-value is right. Your y-value has the wrong sign (+ or \u2212).' : 'Your x-value is right! Now put it back into one of the equations to find y.';
      if (near(p[1], a[1])) return near(Math.abs(p[0]), Math.abs(a[0])) ? 'Your y-value is right. Your x-value has the wrong sign (+ or \u2212).' : 'Your y-value is right. Check the step where you found x.';
      if (near(Math.abs(p[0]), Math.abs(a[0])) && near(Math.abs(p[1]), Math.abs(a[1]))) return 'The numbers are right, but a sign (+ or −) is off. Check your negatives.';
      return sp.hint || 'Not quite. Put your point into BOTH equations. Both must come out true.';
    }
    if (k === 'num') {
      var v = parseNum(raw);
      if (v === null) return 'Type a number, like 12, −3, 2.5 or 1/2.';
      if (near(v, sp.ans, sp.tol)) return true;
      for (i = 0; sp.alts && i < sp.alts.length; i++) if (near(v, sp.alts[i], sp.tol)) return true;
      for (i = 0; sp.miss && i < sp.miss.length; i++) { m = sp.miss[i]; if (near(v, m.v, m.tol != null ? m.tol : sp.tol)) return m.m; }
      if (sp.ans !== 0 && near(v, -sp.ans, sp.tol)) return 'Check the sign. Your number should be ' + (sp.ans > 0 ? 'positive' : 'negative') + '.';
      return sp.hint || 'Not quite. Go back through the steps one at a time.';
    }
    if (k === 'expr') {
      var vars = sp.vars || ['x'], f;
      var s = stripPrefix(norm(raw).replace(/^a_?n=|^a\(n\)=/, '')).replace(/(\d),(?=\d{3}(?!\d))/g, '$1');
      try { f = parseExpr(s, vars); } catch (e) { return 'I could not read that. Type it like ' + (sp.eg || '3(2)^x') + '. Use ^ for a power.'; }
      var g = parseExpr(norm(sp.ans), vars);
      if (exprEq(f, g, vars)) return true;
      for (i = 0; sp.miss && i < sp.miss.length; i++) { m = sp.miss[i]; if (exprEq(f, parseExpr(norm(m.v), vars), vars)) return m.m; }
      return sp.hint || 'Not quite. Check your starting value and what you add or multiply by each time.';
    }
    if (k === 'ineq') {
      var q = parseIneq(raw, sp.v);
      if (!q) return 'Type it like ' + sp.v + ' > 0 (use <, >, <= or >=).';
      if (q.op === sp.op && near(q.n, sp.n)) return true;
      if (near(q.n, sp.n) && q.op.charAt(0) === sp.op.charAt(0)) return sp.eqMsg || 'Close! Check if the end number itself is included. Use > or <, not ≥ or ≤, when it is not.';
      for (i = 0; sp.miss && i < sp.miss.length; i++) { m = sp.miss[i]; if (q.op === m.op && near(q.n, m.n)) return m.m; }
      return sp.hint || 'Not quite. Think about which y-values the graph reaches.';
    }
    if (k === 'text') {
      var t = norm(raw).replace(/[^a-z0-9()]/g, '');
      for (i = 0; i < sp.ans.length; i++) if (new RegExp('^(' + sp.ans[i] + ')$').test(t)) return true;
      for (i = 0; sp.miss && i < sp.miss.length; i++) { m = sp.miss[i]; if (new RegExp('^(' + m.v + ')$').test(t)) return m.m; }
      return sp.hint || 'Not quite. Try again.';
    }
    return 'Not quite.';
  }
  function solvedViz(sp) {
    var ids = sp.viz ? [].concat(sp.viz) : [];
    ids.forEach(function (v) { document.querySelectorAll('[data-v="' + v + '"]').forEach(function (el) { draw(el, true); }); });
    if (sp.reveal) [].concat(sp.reveal).forEach(function (r) { var el = document.getElementById(r); if (el) el.classList.remove('hide'); });
  }
  function check(id) {
    var sp = S.items[id], inp = document.getElementById(id + '-in');
    if (!sp || !inp || S.solved[id]) return;
    if (!inp.value.trim()) { fbSay(id, 'x', 'Type your answer in the box first.'); return; }
    var r = judge(sp, inp.value);
    if (!S.tried[id]) { S.tried[id] = 1; if (r === true) S.first++; }
    if (r === true) { S.solved[id] = 1; inp.disabled = true; fbSay(id, 'c', '✓ ' + (sp.ok || 'Correct!')); solvedViz(sp); }
    else fbSay(id, 'x', r);
    score();
  }
  function pick(id, btn, val) {
    var sp = S.items[id]; if (!sp || S.solved[id]) return;
    var ok = String(val) === String(sp.ans);
    if (!S.tried[id]) { S.tried[id] = 1; if (ok) S.first++; }
    var card = document.getElementById(id);
    if (ok) {
      S.solved[id] = 1; btn.classList.add(sp.kind === 'fix' ? 'found' : 'correct');
      if (card) card.querySelectorAll('.chk-btn,.fix-step').forEach(function (b) { b.disabled = true; b.style.pointerEvents = 'none'; });
      fbSay(id, 'c', '✓ ' + (sp.ok || 'Correct!')); solvedViz(sp);
    } else {
      btn.classList.add(sp.kind === 'fix' ? 'okstep' : 'wrong');
      fbSay(id, 'x', (sp.why && sp.why[val]) || sp.hint || 'Not quite. Try another choice.');
    }
    score();
  }
  function show(id) { var sp = S.items[id]; if (sp) solvedViz(sp); }
  function revealAll() {
    Object.keys(S.items).forEach(function (id) {
      var sp = S.items[id]; if (S.solved[id]) return;
      var card = document.getElementById(id), bt = card && card.querySelector('[data-o="' + sp.ans + '"]');
      fbSay(id, 'c', 'Answer: ' + (sp.show || (sp.kind === 'pt' ? '(' + fmt(sp.ans[0]) + ', ' + fmt(sp.ans[1]) + ')' : bt ? bt.textContent : sp.ans)) + (sp.ok && sp.kind !== 'pt' ? '<br>' + sp.ok : ''));
      if (card && (sp.kind === 'mc' || sp.kind === 'fix')) card.querySelectorAll('[data-o]').forEach(function (b) { if (b.getAttribute('data-o') === String(sp.ans)) b.classList.add(sp.kind === 'fix' ? 'found' : 'correct'); });
      solvedViz(sp);
    });
    document.querySelectorAll('[data-v]').forEach(function (el) { draw(el, true); });
  }
  function draw(el, done) {
    var f = S.V[el.getAttribute('data-v')]; if (!f) return;
    try { el.innerHTML = f(!!done); } catch (e) { el.textContent = ''; if (window.console) console.error(e); }
    el.setAttribute('data-done', done ? '1' : '0');
  }
  function syncEx() {
    document.querySelectorAll('[data-ex]').forEach(function (el) {
      var ex = el.getAttribute('data-ex'), fin = document.querySelector('.steps[data-example="' + ex + '"] .step.final');
      if (fin && fin.classList.contains('revealed') && el.getAttribute('data-done') !== '1') draw(el, true);
    });
  }
  function init() {
    document.querySelectorAll('[data-v]').forEach(function (el) { draw(el, el.hasAttribute('data-static')); });
    if (typeof window.reveal === 'function') { var r0 = window.reveal; window.reveal = function (s) { r0(s); syncEx(); }; }
    if (typeof window.revealAll === 'function') { var r1_ = window.revealAll; window.revealAll = function (id) { r1_(id); syncEx(); }; }
    if (typeof window.revealPage === 'function') { var r2 = window.revealPage; window.revealPage = function () { r2(); revealAll(); }; }
    document.querySelectorAll('.val-chk input').forEach(function (inp) {
      if (inp.dataset.m1) return; inp.dataset.m1 = '1';
      inp.setAttribute('autocomplete', 'off'); inp.setAttribute('autocapitalize', 'off'); inp.setAttribute('spellcheck', 'false');
    });
    score();
  }

  /* ---------- interactive: drag a point (mouse + touch) ---------- */
  function dragPoint(el, o) {
    // o: {render(x,y) -> svg string, x, y, x0,x1,y0,y1, onMove(x,y)}
    var st = { x: o.x, y: o.y };
    function paint() { el.innerHTML = o.render(st.x, st.y); if (o.onMove) o.onMove(st.x, st.y); }
    paint();
    var dragging = false;
    function toData(evt) {
      var svg = el.querySelector('svg'); if (!svg) return null;
      var pt = svg.createSVGPoint(); pt.x = evt.clientX; pt.y = evt.clientY;
      var m = svg.getScreenCTM(); if (!m) return null; var p = pt.matrixTransform(m.inverse());
      return o.fromPx(p.x, p.y);
    }
    function move(evt) {
      var d = toData(evt); if (!d) return;
      var nx = Math.max(o.x0, Math.min(o.x1, Math.round(d[0]))), ny = Math.max(o.y0, Math.min(o.y1, Math.round(d[1])));
      if (nx !== st.x || ny !== st.y) { st.x = nx; st.y = ny; paint(); }
    }
    el.addEventListener('pointerdown', function (e) { dragging = true; try { el.setPointerCapture(e.pointerId); } catch (x) {} move(e); e.preventDefault(); });
    el.addEventListener('pointermove', function (e) { if (dragging) { move(e); e.preventDefault(); } });
    el.addEventListener('pointerup', function () { dragging = false; });
    el.addEventListener('pointercancel', function () { dragging = false; });
    el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', function (e) {
      var k = e.key, dx = k === 'ArrowRight' ? 1 : k === 'ArrowLeft' ? -1 : 0, dy = k === 'ArrowUp' ? 1 : k === 'ArrowDown' ? -1 : 0;
      if (!dx && !dy) return; e.preventDefault();
      st.x = Math.max(o.x0, Math.min(o.x1, st.x + dx)); st.y = Math.max(o.y0, Math.min(o.y1, st.y + dy)); paint();
    });
    return st;
  }
  // pixel <-> data for a plane with default padding (mirror of plane())
  function planeMap(o) {
    var W = o.w || 300, H = o.h || W, tfs = o.tfs || 10, x0 = o.x[0], x1 = o.x[1], y0 = o.y[0], y1 = o.y[1];
    var yl = o.yl || o.ys || 1, maxYW = 0, tick = o.tick || function (v) { return fmt(v); };
    for (var v = Math.ceil(y0 / yl - 1e-9) * yl; v <= y1 + 1e-9; v += yl) maxYW = Math.max(maxYW, tw(tick(+v.toFixed(6)), tfs));
    var L = (x0 >= 0 ? maxYW + 9 : 10) + (o.ytitle ? 16 : 0), B = H - ((y0 >= 0 ? 17 : 10) + (o.xtitle ? 15 : 0)), T = 10, R = W - 10;
    return function (px, py) { return [x0 + (px - L) / (R - L) * (x1 - x0), y0 + (B - py) / (B - T) * (y1 - y0)]; };
  }

  return { C: C, fmt: fmt, money: money, commas: commas, plane: plane, sys: sys, planeMap: planeMap, eqrows: eqrows, elim: elim, subst: subst, tbl: tbl, bars: bars,
    hops: hops, mapping: mapping, balance: balance, svgOpen: svgOpen, text: text, pill: pill, tw: tw, solve2: solve2, eqStd: eqStd, eqSI: eqSI, term: term,
    reg: reg, check: check, pick: pick, show: show, revealAll: revealAll, init: init, draw: draw, V: S.V, S: S, dragPoint: dragPoint,
    parseNum: parseNum, parsePt: parsePt, parseExpr: parseExpr, norm: norm, judge: judge };
})();
