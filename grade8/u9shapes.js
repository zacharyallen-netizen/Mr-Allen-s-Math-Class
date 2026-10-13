/* ───────────────────────────────────────────────────────────────
   UNIT 9 SHAPES — draws cylinders, cones, spheres and composite
   solids from each problem's OWN numbers (SVG, no images).

   Use in a page:
     <div class="u9fig" data-u9='{"shape":"cyl","r":3,"h":10,"unit":"cm","ask":"V = ?"}'></div>
     <script src="u9shapes.js"></script>        (draws every [data-u9] on load)

   Shapes: cyl, cone, sphere, hemi, cylhemi, twocones, conecyl, spherecyl,
           compare, cube, diam, sqcube
   Common options: r, h, unit, dia (label the diameter instead of the radius),
           ask (label under the figure, e.g. "V = ?"), water (0–1 fill level),
           cap (small caption under the figure), scale (fixed px per unit)
   Colors: navy outline · amber = radius/diameter · blue = height ·
           gold pill = what we want · green = answer (only after solving).
   ─────────────────────────────────────────────────────────────── */
(function (root) {
  var C = { ink: '#1E2D4F', body: 'rgba(0,86,179,.10)', top: 'rgba(0,86,179,.18)', r: '#B45309', h: '#0056B3',
            ask: '#7A5500', askBg: '#FFF3C4', askEdge: '#E0A800', water: 'rgba(30,144,255,.38)', waterTop: 'rgba(30,144,255,.55)',
            muted: '#6b7488', ans: '#1a7000', cone: 'rgba(224,168,0,.18)', sph: 'rgba(34,172,0,.12)' };
  var FONT = 'Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif';

  function Fig() { this.el = []; this.x0 = 1e9; this.y0 = 1e9; this.x1 = -1e9; this.y1 = -1e9; }
  Fig.prototype.ext = function (x, y) { if (x < this.x0) this.x0 = x; if (x > this.x1) this.x1 = x; if (y < this.y0) this.y0 = y; if (y > this.y1) this.y1 = y; };
  Fig.prototype.add = function (s, pts) { this.el.push(s); for (var i = 0; i < pts.length; i++) this.ext(pts[i][0], pts[i][1]); };
  Fig.prototype.text = function (x, y, t, o) {
    o = o || {}; var size = o.size || 14, a = o.anchor || 'middle', w = String(t).length * size * 0.56;
    var xa = a === 'middle' ? x - w / 2 : a === 'end' ? x - w : x;
    this.ext(xa - 2, y - size); this.ext(xa + w + 2, y + 4);
    this.el.push('<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + a + '" font-size="' + size + '" font-weight="' + (o.weight || 700) +
      '" fill="' + (o.color || C.ink) + '" font-family="' + FONT + '" paint-order="stroke" stroke="#fff" stroke-width="4" stroke-linejoin="round">' + esc(t) + '</text>');
  };
  Fig.prototype.pill = function (x, y, t, o) {
    o = o || {}; var size = 14, w = String(t).length * size * 0.58 + 18, h = 24;
    var bg = o.bg || C.askBg, edge = o.edge || C.askEdge, col = o.color || C.ask;
    this.add('<rect x="' + r1(x - w / 2) + '" y="' + r1(y - h / 2) + '" width="' + r1(w) + '" height="' + h + '" rx="12" fill="' + bg + '" stroke="' + edge + '" stroke-width="1.5"/>',
      [[x - w / 2, y - h / 2], [x + w / 2, y + h / 2]]);
    this.el.push('<text x="' + r1(x) + '" y="' + r1(y + 5) + '" text-anchor="middle" font-size="' + size + '" font-weight="800" fill="' + col + '" font-family="' + FONT + '">' + esc(t) + '</text>');
  };
  Fig.prototype.svg = function (label, maxW) {
    var p = 6, x = this.x0 - p, y = this.y0 - p, w = this.x1 - this.x0 + 2 * p, h = this.y1 - this.y0 + 2 * p;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + r1(x) + ' ' + r1(y) + ' ' + r1(w) + ' ' + r1(h) + '" width="100%" style="max-width:' +
      Math.round(maxW || w * 1.12) + 'px;height:auto;display:block;margin:0 auto" role="img" aria-label="' + esc(label) + '">' + this.el.join('') + '</svg>';
  };
  function r1(v) { return Math.round(v * 10) / 10; }
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function lineS(x1, y1, x2, y2, col, w, dash) {
    return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + col + '" stroke-width="' + (w || 2) + '"' +
      (dash ? ' stroke-dasharray="' + dash + '"' : '') + ' stroke-linecap="round"/>';
  }
  function U(o) { return o.unit ? ' ' + o.unit : ''; }
  function scaleFor(r, h, o, maxR, maxH) {
    if (o.scale) return { R: r * o.scale, H: (h || 0) * o.scale };
    var s = Math.min((maxR || 66) / r, h ? (maxH || 130) / h : 1e9);
    return { R: Math.max(r * s, 22), H: h ? Math.max(h * s, 30) : 0 };
  }
  // half ellipses: front = lower half (seen), back = upper half (hidden for bases)
  function front(cx, cy, rx, ry) { return 'M' + r1(cx - rx) + ',' + r1(cy) + ' A' + r1(rx) + ' ' + r1(ry) + ' 0 0 0 ' + r1(cx + rx) + ',' + r1(cy); }
  function back(cx, cy, rx, ry) { return 'M' + r1(cx - rx) + ',' + r1(cy) + ' A' + r1(rx) + ' ' + r1(ry) + ' 0 0 1 ' + r1(cx + rx) + ',' + r1(cy); }
  function pathS(d, stroke, fill, w, dash) {
    return '<path d="' + d + '" fill="' + (fill || 'none') + '" stroke="' + (stroke || 'none') + '" stroke-width="' + (w || 2) + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + ' stroke-linejoin="round"/>';
  }

  // ── measuring marks ────────────────────────────────────────────
  function heightMark(F, x, yt, yb, label) {
    F.add(lineS(x, yt, x, yb, C.h, 2) + lineS(x - 5, yt, x + 5, yt, C.h, 2) + lineS(x - 5, yb, x + 5, yb, C.h, 2), [[x - 5, yt], [x + 5, yb]]);
    if (label) F.text(x + 9, (yt + yb) / 2 + 5, label, { anchor: 'start', color: C.h });
  }
  // pos: 'above' (clear of the rim, ry above), 'below' (clear of the rim), or 'in' (just above the line)
  function radiusMark(F, cx, cy, R, label, pos, dia, ry) {
    var x1 = dia ? cx - R : cx; ry = ry || 0;
    F.add(lineS(x1, cy, cx + R, cy, C.r, 2.5, '5 4') + '<circle cx="' + r1(cx) + '" cy="' + r1(cy) + '" r="3" fill="' + C.r + '"/>', [[x1, cy], [cx + R, cy]]);
    if (!label) return;
    var y = pos === 'above' ? cy - ry - 8 : pos === 'below' ? cy + ry + 19 : cy - 8;
    F.text(dia ? cx : cx + R / 2, y, label, { color: C.r });
  }

  // ── solids ─────────────────────────────────────────────────────
  function cylinder(F, cx, yt, R, H, o) {
    var ry = R * 0.3, yb = yt + H;
    F.add(pathS('M' + r1(cx - R) + ',' + r1(yt) + ' L' + r1(cx - R) + ',' + r1(yb) + ' A' + r1(R) + ' ' + r1(ry) + ' 0 0 0 ' + r1(cx + R) + ',' + r1(yb) +
      ' L' + r1(cx + R) + ',' + r1(yt) + ' A' + r1(R) + ' ' + r1(ry) + ' 0 0 0 ' + r1(cx - R) + ',' + r1(yt) + 'Z', 'none', o.fill || C.body), [[cx - R, yt - ry], [cx + R, yb + ry]]);
    if (o.water) {                                   // water up to a fraction of the height
      var yw = yb - o.water * H;
      F.add(pathS('M' + r1(cx - R) + ',' + r1(yw) + ' L' + r1(cx - R) + ',' + r1(yb) + ' A' + r1(R) + ' ' + r1(ry) + ' 0 0 0 ' + r1(cx + R) + ',' + r1(yb) +
        ' L' + r1(cx + R) + ',' + r1(yw) + ' A' + r1(R) + ' ' + r1(ry) + ' 0 0 1 ' + r1(cx - R) + ',' + r1(yw) + 'Z', 'none', C.water), []);
      F.add('<ellipse cx="' + r1(cx) + '" cy="' + r1(yw) + '" rx="' + r1(R) + '" ry="' + r1(ry) + '" fill="' + C.waterTop + '" stroke="#1E78D2" stroke-width="1.5"/>', []);
    }
    if (o.bands) {                                   // 3 equal layers: each one is a cone's worth
      for (var k = 1; k < 3; k++) { var yk = yt + H * k / 3;
        F.add(pathS(front(cx, yk, R, ry), '#5b6b8c', 'none', 1.5, '4 4'), []); }
    }
    F.add(pathS(back(cx, yb, R, ry), C.ink, 'none', 1.5, '5 4') + pathS(front(cx, yb, R, ry), C.ink, 'none', 2), []);
    F.add(lineS(cx - R, yt, cx - R, yb, C.ink, 2) + lineS(cx + R, yt, cx + R, yb, C.ink, 2), []);
    if (o.openTop) F.add(pathS(back(cx, yt, R, ry), C.ink, 'none', 1.5, '5 4') + pathS(front(cx, yt, R, ry), C.ink, 'none', 2), []);
    else F.add('<ellipse cx="' + r1(cx) + '" cy="' + r1(yt) + '" rx="' + r1(R) + '" ry="' + r1(ry) + '" fill="' + C.top + '" stroke="' + C.ink + '" stroke-width="2"/>', []);
    return { yt: yt, yb: yb, ry: ry };
  }
  function cone(F, cx, yt, R, H, o) {
    var ry = R * 0.3, yb = yt + H;
    F.add(pathS('M' + r1(cx - R) + ',' + r1(yb) + ' L' + r1(cx) + ',' + r1(yt) + ' L' + r1(cx + R) + ',' + r1(yb) +
      ' A' + r1(R) + ' ' + r1(ry) + ' 0 0 1 ' + r1(cx - R) + ',' + r1(yb) + 'Z', C.ink, (o && o.fill) || C.cone, 2), [[cx - R, yt], [cx + R, yb + ry]]);
    F.add(pathS(back(cx, yb, R, ry), C.ink, 'none', 1.5, '5 4'), []);
    if (!(o && o.noAxis)) F.add(lineS(cx, yt, cx, yb, C.h, 1.5, '3 4'), []);
    return { yt: yt, yb: yb, ry: ry };
  }
  function sphere(F, cx, cy, R, o) {
    var ry = R * 0.28;
    F.add('<circle cx="' + r1(cx) + '" cy="' + r1(cy) + '" r="' + r1(R) + '" fill="' + ((o && o.fill) || C.sph) + '" stroke="' + C.ink + '" stroke-width="2"/>', [[cx - R, cy - R], [cx + R, cy + R]]);
    F.add(pathS(back(cx, cy, R, ry), C.ink, 'none', 1.2, '5 4') + pathS(front(cx, cy, R, ry), C.ink, 'none', 1.5), []);
  }
  function dome(F, cx, cy, R, fill) {           // half sphere sitting on a circle at height cy
    var ry = R * 0.3;
    F.add(pathS('M' + r1(cx - R) + ',' + r1(cy) + ' A' + r1(R) + ' ' + r1(R) + ' 0 0 1 ' + r1(cx + R) + ',' + r1(cy) +
      ' A' + r1(R) + ' ' + r1(ry) + ' 0 0 1 ' + r1(cx - R) + ',' + r1(cy) + 'Z', C.ink, fill || C.sph, 2), [[cx - R, cy - R], [cx + R, cy + ry]]);
    F.add(pathS(back(cx, cy, R, ry), C.ink, 'none', 1.2, '5 4'), []);
  }

  // ── figures ────────────────────────────────────────────────────
  var SHAPES = {
    cyl: function (o) {
      var F = new Fig(), s = scaleFor(o.r, o.h, o), cx = 0, yt = 0, g = cylinder(F, cx, yt, s.R, s.H, o);
      radiusMark(F, cx, yt, s.R, (o.dia ? 'd = ' + 2 * o.r : 'r = ' + o.r) + U(o), 'above', o.dia, g.ry);
      heightMark(F, cx + s.R + 16, yt, g.yb, 'h = ' + o.h + U(o));
      return fin(F, o, g.yb + g.ry, 'cylinder');
    },
    cone: function (o) {
      var F = new Fig(), s = scaleFor(o.r, o.h, o), cx = 0, yt = 0, g = cone(F, cx, yt, s.R, s.H, o);
      radiusMark(F, cx, g.yb, s.R, (o.dia ? 'd = ' + 2 * o.r : 'r = ' + o.r) + U(o), 'below', o.dia, g.ry);
      heightMark(F, cx + s.R + 16, yt, g.yb, 'h = ' + o.h + U(o));
      return fin(F, o, g.yb + g.ry + 20, 'cone');
    },
    sphere: function (o) {
      var F = new Fig(), s = scaleFor(o.r, 0, o, 70), cx = 0, cy = 0;
      sphere(F, cx, cy, s.R);
      radiusMark(F, cx, cy, s.R, (o.dia ? 'd = ' + 2 * o.r : 'r = ' + o.r) + U(o), 'above', o.dia, s.R * 0.28);
      return fin(F, o, cy + s.R, 'sphere');
    },
    hemi: function (o) {
      var F = new Fig(), s = scaleFor(o.r, 0, o, 70), cx = 0, cy = 0;
      dome(F, cx, cy, s.R);
      radiusMark(F, cx, cy, s.R, 'r = ' + o.r + U(o), 'below', false, s.R * 0.3);
      return fin(F, o, cy + s.R * 0.3 + 22, 'hemisphere');
    },
    cylhemi: function (o) {
      var F = new Fig(), s = scaleFor(o.r, o.h + o.r, o, 60, 150), k = s.H / (o.h + o.r), R = o.r * k, H = o.h * k, cx = 0, yt = 0;
      var g = cylinder(F, cx, yt, R, H, { openTop: true });
      dome(F, cx, yt, R);
      F.add(pathS(front(cx, yt, R, R * 0.3), C.ink, 'none', 2), []);
      radiusMark(F, cx, g.yb, R, 'r = ' + o.r + U(o), 'below', false, g.ry);
      heightMark(F, cx + R + 16, yt, g.yb, 'h = ' + o.h + U(o));
      F.text(cx, yt - R - 8, 'hemisphere on top', { size: 12, color: C.muted, weight: 600 });
      return fin(F, o, g.yb + g.ry + 22, 'cylinder with a hemisphere on top');
    },
    twocones: function (o) {
      var F = new Fig(), s = scaleFor(o.r, o.h * 2, o, 60, 160), k = s.H / (2 * o.h), R = o.r * k, H = o.h * k, cx = 0, ym = 0, ry = R * 0.3;
      F.add(pathS('M' + r1(cx - R) + ',' + r1(ym) + ' L' + r1(cx) + ',' + r1(ym - H) + ' L' + r1(cx + R) + ',' + r1(ym) + ' L' + r1(cx) + ',' + r1(ym + H) + 'Z', C.ink, C.cone, 2), [[cx - R, ym - H], [cx + R, ym + H]]);
      F.add(pathS(back(cx, ym, R, ry), C.ink, 'none', 1.2, '5 4') + pathS(front(cx, ym, R, ry), C.ink, 'none', 1.5), []);
      radiusMark(F, cx, ym, R, 'r = ' + o.r + U(o), 'above', false, ry);
      heightMark(F, cx + R + 16, ym - H, ym, 'h = ' + o.h + U(o));
      heightMark(F, cx + R + 16, ym, ym + H, 'h = ' + o.h + U(o));
      return fin(F, o, ym + H, 'two cones placed base to base');
    },
    conecyl: function (o) {                       // the 1/3 relationship
      var F = new Fig(), r = o.r || 3, h = o.h || 6, s = scaleFor(r, h, o, 46, 110), R = s.R, H = s.H, ry = R * 0.3;
      var g = cylinder(F, 0, 0, R, H, { bands: true });
      if (!o.noThirds) for (var k = 0; k < 3; k++) F.text(0, H * (k + 0.5) / 3 + 5, '⅓', { size: 15, color: C.h });
      cone(F, 2 * R + 40, 0, R, H, { noAxis: true });
      F.text(0, g.yb + ry + 22, o.cylLabel || 'cylinder', { size: 13, color: C.ink });
      F.text(2 * R + 40, g.yb + ry + 22, o.coneLabel || 'cone (same r and h)', { size: 13, color: C.ink });
      if (o.same) { radiusMark(F, 0, 0, R, 'r', 'above', false, ry); heightMark(F, 2 * R + 40 + R + 14, 0, g.yb, 'h'); }
      return fin(F, o, g.yb + ry + 30, 'a cylinder and a cone with the same radius and height');
    },
    spherecyl: function (o) {
      var F = new Fig(), R = 52, H = 2 * R, g = cylinder(F, 0, 0, R, H, { openTop: false, fill: 'rgba(0,86,179,.06)' });
      sphere(F, 0, H / 2, R * 0.985);
      radiusMark(F, 0, H / 2, R, 'r', 'in');
      heightMark(F, R + 16, 0, H, 'h = 2r');
      return fin(F, o, g.yb + g.ry, 'a sphere that fits exactly inside a cylinder');
    },
    compare: function (o) {                       // same r and h, side by side, same scale
      var F = new Fig(), sc = Math.min(30 / o.r, 100 / Math.max(o.h, 2 * o.r)), R = o.r * sc, H = o.h * sc, gap = 2 * R + 34;
      var g = cylinder(F, 0, 0, R, H, {}); cone(F, gap, 0, R, H, {}); sphere(F, 2 * gap, H - R, R);
      F.text(0, H + R * 0.3 + 20, 'cylinder', { size: 13 }); F.text(gap, H + R * 0.3 + 20, 'cone', { size: 13 }); F.text(2 * gap, H + R * 0.3 + 20, 'sphere', { size: 13 });
      F.text(gap, -18, 'r = ' + o.r + ',  h = ' + o.h + ' for all three', { size: 13, color: C.r });
      return fin(F, o, H + R * 0.3 + 30, 'a cylinder, a cone and a sphere with the same radius');
    },
    cube: function () {                           // one cubic unit
      var F = new Fig(), a = 54, d = 24;
      F.add(pathS('M0,' + d + ' L' + a + ',' + d + ' L' + a + ',' + (a + d) + ' L0,' + (a + d) + 'Z', C.ink, 'rgba(0,86,179,.16)', 2) +
            pathS('M0,' + d + ' L' + d + ',0 L' + (a + d) + ',0 L' + a + ',' + d + 'Z', C.ink, 'rgba(0,86,179,.26)', 2) +
            pathS('M' + a + ',' + d + ' L' + (a + d) + ',0 L' + (a + d) + ',' + a + ' L' + a + ',' + (a + d) + 'Z', C.ink, 'rgba(0,86,179,.08)', 2), [[0, 0], [a + d, a + d]]);
      F.text(a / 2, a + d + 18, '1 cm', { size: 13, color: C.r }); F.text(a + d + 6, a / 2 + 14, '1 cm', { size: 13, color: C.r, anchor: 'start' });
      F.text(d + a / 2, -7, '1 cm', { size: 13, color: C.r });
      F.pill(a / 2 + 10, a + d + 44, '1 cm³ = one cubic unit', { bg: '#e8f5e2', edge: '#22AC00', color: '#1a7000' });
      return F.svg('one cube, 1 cm on each edge, is 1 cubic centimeter');
    },
    diam: function (o) {                          // diameter vs radius
      var F = new Fig(), R = 62, d = o.d || 12;
      F.add('<circle cx="0" cy="0" r="' + R + '" fill="' + C.sph + '" stroke="' + C.ink + '" stroke-width="2"/>', [[-R, -R], [R, R]]);
      F.add(lineS(-R, 0, R, 0, C.r, 2.5) + '<circle cx="0" cy="0" r="3.5" fill="' + C.ink + '"/>', []);
      F.text(0, -10, 'd = ' + d + U(o) + ' (all the way across)', { size: 13, color: C.r });
      F.add(lineS(0, 0, R * 0.71, R * 0.71, C.h, 2.5, '5 4'), []);
      F.text(R * 0.42 + 6, R * 0.42 + 24, 'r = ' + d / 2 + U(o), { size: 13, color: C.h, anchor: 'start' });
      F.text(0, R + 22, 'radius = diameter ÷ 2', { size: 13, color: C.ink });
      return F.svg('a circle showing the diameter and the radius');
    },
    sqcube: function () {                         // r² is flat, r³ is solid
      var F = new Fig(), a = 46, d = 20, x2 = 110;
      F.add(pathS('M0,' + d + ' h' + a + ' v' + a + ' h-' + a + 'Z', C.ink, 'rgba(224,168,0,.25)', 2), [[0, d], [a, a + d]]);
      F.text(a / 2, a + d + 20, 'r × r = r²', { size: 13, color: C.ink }); F.text(a / 2, a + d + 38, 'flat: square units', { size: 12, color: C.muted, weight: 600 });
      F.add(pathS('M' + x2 + ',' + d + ' h' + a + ' v' + a + ' h-' + a + 'Z', C.ink, 'rgba(0,86,179,.16)', 2) +
            pathS('M' + x2 + ',' + d + ' l' + d + ',-' + d + ' h' + a + ' l-' + d + ',' + d + 'Z', C.ink, 'rgba(0,86,179,.26)', 2) +
            pathS('M' + (x2 + a) + ',' + d + ' l' + d + ',-' + d + ' v' + a + ' l-' + d + ',' + d + 'Z', C.ink, 'rgba(0,86,179,.08)', 2), [[x2, 0], [x2 + a + d, a + d]]);
      F.text(x2 + (a + d) / 2, a + d + 20, 'r × r × r = r³', { size: 13, color: C.ink }); F.text(x2 + (a + d) / 2, a + d + 38, 'solid: cubic units', { size: 12, color: C.muted, weight: 600 });
      return F.svg('a square shows r squared, a cube shows r cubed');
    }
  };
  function fin(F, o, yBottom, name) {
    var y = yBottom;
    if (o.ask) { F.pill(o.askX || 0, y + 22, o.ask); y += 34; }
    if (o.cap) F.text(0, y + 22, o.cap, { size: 12, color: C.muted, weight: 600 });
    return F.svg(o.label || ('diagram of a ' + name + (o.r ? ', radius ' + o.r : '') + (o.h ? ', height ' + o.h : '')), o.maxW);
  }

  function draw(o) { var f = SHAPES[o.shape]; return f ? f(o) : ''; }
  function drawAll(scope) {
    var els = (scope || document).querySelectorAll('[data-u9]');
    for (var i = 0; i < els.length; i++) {
      try { els[i].innerHTML = draw(JSON.parse(els[i].getAttribute('data-u9'))); }
      catch (e) { els[i].textContent = ''; }
    }
  }

  // ── explorer: change r and h, watch the three solids and their volumes ──
  function fmtPi(num, den) {                     // (num/den)π, simplified
    function g(a, b) { return b ? g(b, a % b) : a; }
    var k = g(num, den); num /= k; den /= k;
    return den === 1 ? num + 'π' : num + '/' + den + 'π';
  }
  function explorer(el) {
    el.innerHTML =
      '<div class="u9x-ctl"><label>radius r = <b id="u9xr">3</b><input id="u9xrs" type="range" min="1" max="8" value="3" aria-label="radius"></label>' +
      '<label>height h = <b id="u9xh">6</b><input id="u9xhs" type="range" min="1" max="12" value="6" aria-label="height"></label></div>' +
      '<div class="u9x-row"><div class="u9x-cell"><div id="u9xf1"></div><div class="u9x-v" id="u9xv1"></div></div>' +
      '<div class="u9x-cell"><div id="u9xf2"></div><div class="u9x-v" id="u9xv2"></div></div>' +
      '<div class="u9x-cell"><div id="u9xf3"></div><div class="u9x-v" id="u9xv3"></div></div></div>';
    var rs = el.querySelector('#u9xrs'), hs = el.querySelector('#u9xhs');
    function upd() {
      var r = +rs.value, h = +hs.value, sc = 9;
      el.querySelector('#u9xr').textContent = r; el.querySelector('#u9xh').textContent = h;
      el.querySelector('#u9xf1').innerHTML = draw({ shape: 'cyl', r: r, h: h, scale: sc });
      el.querySelector('#u9xf2').innerHTML = draw({ shape: 'cone', r: r, h: h, scale: sc });
      el.querySelector('#u9xf3').innerHTML = draw({ shape: 'sphere', r: r, scale: sc });
      var cy = r * r * h, co = r * r * h, sp = 4 * r * r * r;
      el.querySelector('#u9xv1').innerHTML = '<b>Cylinder</b><br>π(' + r + ')²(' + h + ') = ' + fmtPi(cy, 1) + ' ≈ ' + (cy * 3.14).toFixed(1);
      el.querySelector('#u9xv2').innerHTML = '<b>Cone</b><br>⅓π(' + r + ')²(' + h + ') = ' + fmtPi(co, 3) + ' ≈ ' + (co * 3.14 / 3).toFixed(1);
      el.querySelector('#u9xv3').innerHTML = '<b>Sphere</b> (uses r only)<br>⁴⁄₃π(' + r + ')³ = ' + fmtPi(sp, 3) + ' ≈ ' + (sp * 3.14 / 3).toFixed(1);
    }
    rs.addEventListener('input', upd); hs.addEventListener('input', upd); upd();
  }

  var api = { draw: draw, drawAll: drawAll, explorer: explorer, fmtPi: fmtPi };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else {
    root.U9 = api;
    var go = function () { drawAll(document); var x = document.getElementById('u9explorer'); if (x) explorer(x); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
  }
})(this);
