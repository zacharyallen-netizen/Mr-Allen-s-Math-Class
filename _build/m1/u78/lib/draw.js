/* G78 — tiny SVG drawing kit for Math 1 Units 7–8 (grids drawn with <line>, labels kept inside the box). */
(function (root) {
  var C = { navy: '#1E2D4F', gold: '#E0A800', goldT: '#8A6400', green: '#15803D', grid: '#E1E6EE',
    axis: '#5A6680', blue: '#0056B3', bg: '#FAFCFF', muted: '#5A6680', white: '#FFFFFF' };
  var G = { C: C, prefix: 'g', n: 0 };
  function nid() { G.n++; return G.prefix + G.n; }
  function r2(n) { return Math.round(n * 100) / 100; }
  function fmt(n) {
    if (typeof n === 'string') return n;
    if (Math.abs(n - Math.round(n)) < 1e-9) n = Math.round(n); else n = r2(n);
    if (Object.is(n, -0)) n = 0;
    return (n < 0 ? '−' : '') + Math.abs(n);
  }
  function pt(x, y) { return '(' + fmt(x) + ', ' + fmt(y) + ')'; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function f1(n) { return (Math.round(n * 10) / 10).toFixed(1).replace(/\.0$/, ''); }

  var proto = {
    add: function (s) { this.parts.push(s); return this; },
    /* text in pixel coords, clamped inside the viewBox */
    textPx: function (px, py, str, op) {
      op = op || {};
      var fs = op.fs || 12, txt = String(str);
      var w = txt.length * fs * (op.mono === false ? 0.56 : 0.62) + (op.halo !== false ? 3 : 0);
      var anchor = op.anchor || 'start';
      var left = anchor === 'start' ? px : anchor === 'end' ? px - w : px - w / 2;
      var M = 2;
      if (left < M) px += (M - left);
      if (left + w > this.W - M) px -= (left + w - (this.W - M));
      var top = py - fs * 0.78, bot = py + fs * 0.24;
      if (top < M) py += (M - top);
      if (bot > this.H - M) py -= (bot - (this.H - M));
      var a = '<text x="' + f1(px) + '" y="' + f1(py) + '" font-size="' + fs + '" fill="' + (op.c || C.navy) + '" text-anchor="' + anchor + '"';
      a += ' font-family="' + (op.mono === false ? 'Inter, system-ui, sans-serif' : 'JetBrains Mono, ui-monospace, Menlo, Consolas, monospace') + '"';
      if (op.bold) a += ' font-weight="700"';
      if (op.italic) a += ' font-style="italic"';
      if (op.halo !== false) a += ' paint-order="stroke" stroke="#FFFFFF" stroke-width="' + (fs >= 11 ? 4 : 3) + '" stroke-linejoin="round"';
      this.parts.push(a + '>' + esc(txt) + '</text>');
      return this;
    },
    text: function (x, y, str, op) {
      op = op || {};
      return this.textPx(this.X(x) + (op.dx || 0), this.Y(y) + (op.dy || 0), str, op);
    },
    /* label beside a point: pos one of n,s,e,w,ne,nw,se,sw */
    lab: function (x, y, str, pos, op) {
      op = Object.assign({ bold: true, fs: 12 }, op || {});
      var d = 8, dx = 0, dy = 0, an = 'middle';
      pos = pos || 'ne';
      if (pos.indexOf('e') >= 0) { dx = d; an = 'start'; }
      if (pos.indexOf('w') >= 0) { dx = -d; an = 'end'; }
      if (pos.indexOf('n') >= 0) dy = -d + 1;
      if (pos.indexOf('s') >= 0) dy = d + op.fs * 0.75;
      if (pos === 'e' || pos === 'w') dy = op.fs * 0.35;
      op.anchor = an;
      return this.textPx(this.X(x) + dx + (op.dx || 0), this.Y(y) + dy + (op.dy || 0), str, op);
    },
    dot: function (x, y, op) {
      op = op || {};
      var c = op.c || C.navy, r = op.r || 4.5;
      if (op.hollow) this.parts.push('<circle cx="' + f1(this.X(x)) + '" cy="' + f1(this.Y(y)) + '" r="' + r + '" fill="#fff" stroke="' + c + '" stroke-width="2.4"/>');
      else this.parts.push('<circle cx="' + f1(this.X(x)) + '" cy="' + f1(this.Y(y)) + '" r="' + r + '" fill="' + c + '" stroke="#fff" stroke-width="1.5"/>');
      return this;
    },
    seg: function (x1, y1, x2, y2, op) {
      op = op || {};
      this.parts.push('<line x1="' + f1(this.X(x1)) + '" y1="' + f1(this.Y(y1)) + '" x2="' + f1(this.X(x2)) + '" y2="' + f1(this.Y(y2)) + '" stroke="' + (op.c || C.navy) + '" stroke-width="' + (op.w || 2.4) + '"' + (op.dash ? ' stroke-dasharray="' + op.dash + '"' : '') + ' stroke-linecap="round" clip-path="url(#' + this.clip + ')"/>');
      return this;
    },
    line: function (m, b, op) { var o = this.o; return this.seg(o.xmin - 1, m * (o.xmin - 1) + b, o.xmax + 1, m * (o.xmax + 1) + b, op); },
    vline: function (x0, op) { var o = this.o; return this.seg(x0, o.ymin - 1, x0, o.ymax + 1, op); },
    hline: function (y0, op) { var o = this.o; return this.seg(o.xmin - 1, y0, o.xmax + 1, y0, op); },
    curve: function (f, op) {
      op = op || {};
      var o = this.o, x0 = op.x0 != null ? op.x0 : o.xmin, x1 = op.x1 != null ? op.x1 : o.xmax, n = 150, d = '', pen = false;
      var lo = o.ymin - (o.ymax - o.ymin), hi = o.ymax + (o.ymax - o.ymin);
      for (var i = 0; i <= n; i++) {
        var x = x0 + (x1 - x0) * i / n, y = f(x);
        if (!isFinite(y) || y < lo || y > hi) { pen = false; continue; }
        d += (pen ? 'L' : 'M') + f1(this.X(x)) + ' ' + f1(this.Y(y)) + ' ';
        pen = true;
      }
      this.parts.push('<path d="' + d + '" fill="none" stroke="' + (op.c || C.navy) + '" stroke-width="' + (op.w || 2.6) + '"' + (op.dash ? ' stroke-dasharray="' + op.dash + '"' : '') + ' stroke-linejoin="round" clip-path="url(#' + this.clip + ')"/>');
      return this;
    },
    poly: function (pts, op) {
      op = op || {};
      var self = this;
      var s = pts.map(function (p) { return f1(self.X(p[0])) + ',' + f1(self.Y(p[1])); }).join(' ');
      this.parts.push('<polygon points="' + s + '" fill="' + (op.fill || 'none') + '"' + (op.op != null ? ' fill-opacity="' + op.op + '"' : '') + ' stroke="' + (op.c || C.navy) + '" stroke-width="' + (op.w || 2.4) + '"' + (op.dash ? ' stroke-dasharray="' + op.dash + '"' : '') + ' stroke-linejoin="round"/>');
      return this;
    },
    rectPx: function (x, y, w, h, op) {
      op = op || {};
      this.parts.push('<rect x="' + f1(x) + '" y="' + f1(y) + '" width="' + f1(w) + '" height="' + f1(h) + '" fill="' + (op.fill || 'none') + '"' + (op.op != null ? ' fill-opacity="' + op.op + '"' : '') + ' stroke="' + (op.c || 'none') + '" stroke-width="' + (op.w || 1) + '" rx="' + (op.rx || 0) + '"/>');
      return this;
    },
    /* right-angle mark at V between directions to A and B */
    right: function (vx, vy, ax, ay, bx, by, op) {
      op = op || {};
      var X = this.X, Y = this.Y, s = op.s || 9;
      var px = X(vx), py = Y(vy);
      function u(x, y) { var dx = X(x) - px, dy = Y(y) - py, L = Math.hypot(dx, dy) || 1; return [dx / L * s, dy / L * s]; }
      var a = u(ax, ay), c = u(bx, by);
      this.parts.push('<path d="M' + f1(px + a[0]) + ' ' + f1(py + a[1]) + ' L' + f1(px + a[0] + c[0]) + ' ' + f1(py + a[1] + c[1]) + ' L' + f1(px + c[0]) + ' ' + f1(py + c[1]) + '" fill="none" stroke="' + (op.c || C.green) + '" stroke-width="1.6"/>');
      return this;
    },
    /* small tick across a segment at its middle (congruence / partition marks) */
    tick: function (x1, y1, x2, y2, t, op) {
      op = op || {};
      var px = this.X(x1 + (x2 - x1) * t), py = this.Y(y1 + (y2 - y1) * t);
      var dx = this.X(x2) - this.X(x1), dy = this.Y(y2) - this.Y(y1), L = Math.hypot(dx, dy) || 1, s = op.s || 6;
      var nx = -dy / L * s, ny = dx / L * s;
      this.parts.push('<line x1="' + f1(px - nx) + '" y1="' + f1(py - ny) + '" x2="' + f1(px + nx) + '" y2="' + f1(py + ny) + '" stroke="' + (op.c || C.navy) + '" stroke-width="2"/>');
      return this;
    },
    out: function (aria) {
      var b = this.box;
      return '<svg viewBox="0 0 ' + this.W + ' ' + this.H + '" width="' + this.W + '" height="' + this.H + '" xmlns="http://www.w3.org/2000/svg" role="img"' + (aria ? ' aria-label="' + esc(aria).replace(/"/g, '&quot;') + '"' : '') + '>' +
        '<defs><clipPath id="' + this.clip + '"><rect x="' + f1(b.x0) + '" y="' + f1(b.y0) + '" width="' + f1(b.x1 - b.x0) + '" height="' + f1(b.y1 - b.y0) + '"/></clipPath></defs>' +
        '<rect x="0" y="0" width="' + this.W + '" height="' + this.H + '" fill="' + C.bg + '"/>' + this.parts.join('') + '</svg>';
    }
  };
  /* Coordinate plane. o: {xmin,xmax,ymin,ymax,W,H?,square?,gx,gy,lx,ly,xname,yname} */
  function planeP(o) {
    var P = Object.create(proto);
    P.o = o; P.parts = []; P.W = o.W || 300;
    var xmin = o.xmin, xmax = o.xmax, ymin = o.ymin, ymax = o.ymax;
    var gx = o.gx || 1, gy = o.gy || 1;
    var lx = o.lx || ((xmax - xmin) > 14 ? 2 : 1) * gx, ly = o.ly || ((ymax - ymin) > 14 ? 2 : 1) * gy;
    var axY = (ymin <= 0 && ymax >= 0) ? 0 : ymin;
    var axX = (xmin <= 0 && xmax >= 0) ? 0 : xmin;
    var maxLbl = 0;
    for (var t = Math.ceil(ymin / ly - 1e-9) * ly; t <= ymax + 1e-9; t += ly) maxLbl = Math.max(maxLbl, fmt(t).length);
    var padL = (axX === xmin) ? (maxLbl * 6.2 + 9) : 9;
    var padB = (axY === ymin) ? 19 : 9;
    var padT = 9, padR = 9;
    if (o.padL != null) padL = o.padL;
    if (o.padB != null) padB = o.padB;
    if (o.padT != null) padT = o.padT;
    if (o.padR != null) padR = o.padR;
    var ux = (P.W - padL - padR) / (xmax - xmin);
    var uy = o.square === false ? ((o.H - padT - padB) / (ymax - ymin)) : ux;
    P.H = Math.round(padT + padB + uy * (ymax - ymin));
    P.ux = ux; P.uy = uy;
    P.X = function (x) { return padL + (x - xmin) * ux; };
    P.Y = function (y) { return padT + (ymax - y) * uy; };
    P.invX = function (px) { return xmin + (px - padL) / ux; };
    P.invY = function (py) { return ymax - (py - padT) / uy; };
    P.box = { x0: P.X(xmin), x1: P.X(xmax), y0: P.Y(ymax), y1: P.Y(ymin) };
    P.clip = nid() + 'c';
    var b = P.box, s = [], eps = 1e-9, v;
    for (v = Math.ceil(xmin / gx - eps) * gx; v <= xmax + eps; v += gx)
      s.push('<line x1="' + f1(P.X(v)) + '" y1="' + f1(b.y0) + '" x2="' + f1(P.X(v)) + '" y2="' + f1(b.y1) + '" stroke="' + C.grid + '" stroke-width="1"/>');
    for (v = Math.ceil(ymin / gy - eps) * gy; v <= ymax + eps; v += gy)
      s.push('<line x1="' + f1(b.x0) + '" y1="' + f1(P.Y(v)) + '" x2="' + f1(b.x1) + '" y2="' + f1(P.Y(v)) + '" stroke="' + C.grid + '" stroke-width="1"/>');
    s.push('<line x1="' + f1(b.x0) + '" y1="' + f1(P.Y(axY)) + '" x2="' + f1(b.x1) + '" y2="' + f1(P.Y(axY)) + '" stroke="' + C.axis + '" stroke-width="1.6"/>');
    s.push('<line x1="' + f1(P.X(axX)) + '" y1="' + f1(b.y0) + '" x2="' + f1(P.X(axX)) + '" y2="' + f1(b.y1) + '" stroke="' + C.axis + '" stroke-width="1.6"/>');
    P.parts.push(s.join(''));
    var originBoth = (axX === 0 && axY === 0);
    var below = P.Y(axY) + 12 <= P.H - 2;
    for (v = Math.ceil(xmin / lx - eps) * lx; v <= xmax + eps; v += lx) {
      if (Math.abs(v) < eps && (originBoth || axX === 0)) continue;
      if (o.noXlab) break;
      P.textPx(P.X(v), below ? P.Y(axY) + 12 : P.Y(axY) - 4, fmt(v), { fs: 10, c: C.muted, anchor: 'middle', halo: true });
    }
    for (v = Math.ceil(ymin / ly - eps) * ly; v <= ymax + eps; v += ly) {
      if (Math.abs(v) < eps && (originBoth || axY === 0)) continue;
      if (o.noYlab) break;
      P.textPx(P.X(axX) - 4, P.Y(v) + 3.5, fmt(v), { fs: 10, c: C.muted, anchor: 'end', halo: true });
    }
    if (xmin <= 0 && ymin <= 0 && !o.noXlab) P.textPx(P.X(axX) - 4, P.Y(axY) + 12, '0', { fs: 10, c: C.muted, anchor: 'end', halo: true });
    P.textPx(b.x1 - 3, P.Y(axY) - 5, o.xname || 'x', { fs: 11, c: C.muted, anchor: 'end', italic: true, halo: true, mono: false });
    P.textPx(P.X(axX) + 5, b.y0 + 11, o.yname || 'y', { fs: 11, c: C.muted, anchor: 'start', italic: true, halo: true, mono: false });
    return P;
  }

  /* Plain (non-grid) canvas for area models, flowcharts, number strips */
  function canvas(W, H) {
    var P = Object.create(proto);
    P.o = { xmin: 0, xmax: W, ymin: 0, ymax: H }; P.parts = []; P.W = W; P.H = H;
    P.X = function (x) { return x; }; P.Y = function (y) { return y; };
    P.box = { x0: 0, x1: W, y0: 0, y1: H }; P.clip = nid() + 'c';
    return P;
  }

  /* rectangle area model: sides labelled, optional split into tiles */
  function areaModel(o) {
    // o: {wLab, hLab, inside, W, cols:[{w:px,lab}], gold:{w|h}, unknown}
    var W = o.W || 300, P = canvas(W, o.H || 190);
    var x0 = 72, y0 = 18, w = W - x0 - 18, h = (o.H || 190) - y0 - 34;
    if (o.cols) {
      var tot = o.cols.reduce(function (s, c) { return s + c.w; }, 0), cx = x0;
      o.cols.forEach(function (c, i) {
        var cw = c.w / tot * w;
        P.rectPx(cx, y0, cw, h, { fill: c.fill || '#E8EEF8', c: C.navy, w: 2 });
        if (c.inside) P.textPx(cx + cw / 2, y0 + h / 2 + 5, c.inside, { fs: c.fs || 14, anchor: 'middle', bold: true, c: c.ic || C.navy });
        P.textPx(cx + cw / 2, y0 + h + 18, c.lab, { fs: 12, anchor: 'middle', bold: true, c: c.lc || C.navy });
        cx += cw;
      });
    } else {
      P.rectPx(x0, y0, w, h, { fill: '#E8EEF8', c: C.navy, w: 2.4 });
      if (o.inside) P.textPx(x0 + w / 2, y0 + h / 2 + 5, o.inside, { fs: 14, anchor: 'middle', bold: true, c: o.ic || C.navy });
      P.textPx(x0 + w / 2, y0 + h + 18, o.wLab, { fs: 13, anchor: 'middle', bold: true, c: o.wc || C.navy });
    }
    P.textPx(x0 - 8, y0 + h / 2 + 4, o.hLab, { fs: 13, anchor: 'end', bold: true, c: o.hc || C.navy });
    return P.out(o.aria || 'area model');
  }

  G.plane = planeP; G.canvas = canvas; G.areaModel = areaModel;
  G.fmt = fmt; G.pt = pt; G.esc = esc; G.r2 = r2;
  if (typeof module !== 'undefined' && module.exports) module.exports = G; else root.G78 = G;
})(this);
