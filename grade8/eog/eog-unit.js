/* Unit EOG Practice (Nov 2026). One page per unit and version: unitN-eog.html and unitN-eog-v2.html.
   The questions come from Mr. Allen's "EOG Unit Practice" sets (Version 1 = EOG style, Version 2 = read the box first).
   The engine is the one from eog_practice.html: tap a choice or type a number, Check, a Hint button, feedback that
   names the mistake for every wrong choice, Show answer after a miss, step-by-step explanation, Send my work.
   one-at-a-time.js (loaded by the page) shows one question at a time. ?key=1 shows every answer (teacher view).
   Question data lives in eog/uN.js: EOGU.add(N, {v1:{parts:[...]}, v2:{parts:[...]}}). Every figure is drawn from its own numbers. */
(function () {
"use strict";
var EOGU = window.EOGU = { data: {}, h: {} };
EOGU.add = function (n, d) { EOGU.data[n] = d; };

/* ---------------- text helpers ---------------- */
function M(n) { return n < 0 ? "−" + Math.abs(n) : String(n); }                 // true minus
function SF(n, d) { return '<span class="sf"><span>' + n + '</span><span>' + d + '</span></span>'; }
function P(p) { return "(" + M(p[0]) + ", " + M(p[1]) + ")"; }
function RT(n) { return '√<span class="rad">' + n + '</span>'; }
function CRT(n) { return '∛<span class="rad">' + n + '</span>'; }
function E(b, e) { return b + '<sup>' + e + '</sup>'; }
function MO(s) { return '<span class="mono">' + s + '</span>'; }
function BAR(s) { return '<span style="text-decoration:overline">' + s + '</span>'; }   // repeating digits
function I(s) { return '<i>' + s + '</i>'; }
var C = { navy: "#1E2D4F", muted: "#5B6475", line: "#E3E5EA", axis: "#5B6475", gold: "#E0A800", goldT: "#8A6100", blue: "#1D4ED8", red: "#B42318", green: "#15803D", fill: "rgba(29,78,216,.07)" };
function f1(n) { return Math.round(n * 10) / 10; }
var FONT = 'font-family="Inter,system-ui,sans-serif"', MONO = 'font-family="JetBrains Mono,ui-monospace,monospace"';
function T(x, y, s, o) { o = o || {}; s = String(s).replace(/<i>(.*?)<\/i>/g, '<tspan font-style="italic">$1</tspan>').replace(/<sup>(.*?)<\/sup>/g, '<tspan baseline-shift="super" font-size="75%">$1</tspan>'); return '<text x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (o.a || "middle") + '" font-size="' + (o.size || 13) + '" font-weight="' + (o.w || 600) + '" fill="' + (o.col || C.navy) + '" ' + (o.mono ? MONO : FONT) + (o.halo ? ' paint-order="stroke" stroke="#fff" stroke-width="4"' : '') + (o.it ? ' font-style="italic"' : '') + '>' + s + '</text>'; }
function svg(w, h, inner, label, cls) { return '<svg class="' + (cls || "fig") + '" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '">' + inner + '</svg>'; }
function L(x1, y1, x2, y2, col, w, extra) { return '<line x1="' + f1(x1) + '" y1="' + f1(y1) + '" x2="' + f1(x2) + '" y2="' + f1(y2) + '" stroke="' + (col || C.navy) + '" stroke-width="' + (w || 2) + '"' + (extra || '') + '/>'; }
function PG(pts, fill, col, w) { return '<polygon points="' + pts.map(function (p) { return f1(p[0]) + "," + f1(p[1]); }).join(" ") + '" fill="' + (fill || C.fill) + '" stroke="' + (col || C.navy) + '" stroke-width="' + (w || 2) + '" stroke-linejoin="round"/>'; }
function rad(d) { return d * Math.PI / 180; }

/* ---------------- coordinate grid (any range) ---------------- */
function Grid(x0, x1, y0, y1, o) { o = o || {};
  var pad = o.pad || 22, span = Math.max(x1 - x0, y1 - y0), u = (340 - 2 * pad) / span;
  this.u = u; this.W = 2 * pad + (x1 - x0) * u; this.H = 2 * pad + (y1 - y0) * u; this.x0 = x0; this.x1 = x1; this.y0 = y0; this.y1 = y1;
  this.X = function (x) { return pad + (x - x0) * u; }; this.Y = function (y) { return pad + (y1 - y) * u; };
  var s = "", i, step = o.step || (span > 12 ? 2 : 1), fs = o.fs || 10;
  for (i = x0; i <= x1; i++) s += L(this.X(i), this.Y(y0), this.X(i), this.Y(y1), C.line, 1);
  for (i = y0; i <= y1; i++) s += L(this.X(x0), this.Y(i), this.X(x1), this.Y(i), C.line, 1);
  var ax = (y0 <= 0 && y1 >= 0) ? 0 : y0, ay = (x0 <= 0 && x1 >= 0) ? 0 : x0;
  s += L(this.X(x0), this.Y(ax), this.X(x1), this.Y(ax), C.axis, 1.6) + L(this.X(ay), this.Y(y0), this.X(ay), this.Y(y1), C.axis, 1.6);
  for (i = Math.ceil(x0 / step) * step; i <= x1; i += step) { if (i === ay) continue; s += T(this.X(i), this.Y(ax) + fs + 3, M(i), { size: fs, w: 500, col: C.muted, halo: true }); }
  for (i = Math.ceil(y0 / step) * step; i <= y1; i += step) { if (i === ax) continue; s += T(this.X(ay) - 4, this.Y(i) + fs * 0.36, M(i), { size: fs, w: 500, col: C.muted, a: "end", halo: true }); }
  s += '<text x="' + f1(this.X(x1) + 2) + '" y="' + f1(this.Y(ax) - 5) + '" font-size="' + (fs + 2) + '" font-style="italic" text-anchor="end" fill="' + C.navy + '" font-family="Georgia,serif">x</text>';
  s += '<text x="' + f1(this.X(ay) + 6) + '" y="' + f1(this.Y(y1) + 10) + '" font-size="' + (fs + 2) + '" font-style="italic" fill="' + C.navy + '" font-family="Georgia,serif">y</text>';
  this.base = s; }
Grid.prototype.dot = function (p, col, r) { return '<circle cx="' + f1(this.X(p[0])) + '" cy="' + f1(this.Y(p[1])) + '" r="' + (r || 5) + '" fill="' + (col || C.navy) + '" stroke="#fff" stroke-width="1.5"/>'; };
Grid.prototype.poly = function (pts, col, closed, dash) { var g = this; return '<' + (closed ? "polygon" : "polyline") + ' points="' + pts.map(function (p) { return f1(g.X(p[0])) + "," + f1(g.Y(p[1])); }).join(" ") + '" fill="' + (closed ? (col === C.goldT ? "rgba(224,168,0,.14)" : "rgba(29,78,216,.10)") : "none") + '" stroke="' + (col || C.blue) + '" stroke-width="2.6" stroke-linejoin="round"' + (dash ? ' stroke-dasharray="6 4"' : '') + '/>'; };
Grid.prototype.line = function (m, b, col) { var lo = this.x0, hi = this.x1, g = this;   // y = mx + b clipped to the grid
  if (m !== 0) { var a1 = (this.y0 - b) / m, a2 = (this.y1 - b) / m; lo = Math.max(lo, Math.min(a1, a2)); hi = Math.min(hi, Math.max(a1, a2)); }
  return L(g.X(lo), g.Y(m * lo + b), g.X(hi), g.Y(m * hi + b), col || C.blue, 2.8); };
Grid.prototype.lab = function (p, s, dx, dy, col) { return T(this.X(p[0]) + (dx || 0), this.Y(p[1]) + (dy || -9), s, { col: col || C.navy, size: 13, halo: true }); };
Grid.prototype.svg = function (inner, label, cls) { return svg(f1(this.W), f1(this.H), this.base + inner, label, cls || "grid"); };

/* ---------------- first-quadrant chart (scatter plots, bars) ---------------- */
function chart(o) { var W = o.W || 340, H = o.H || 250, Lm = o.L || 50, R = 14, Tp = 14, B = o.xlab ? 44 : 26, pw = W - Lm - R, ph = H - Tp - B;
  function X(x) { return Lm + x / o.xmax * pw; } function Y(y) { return Tp + ph - y / o.ymax * ph; }
  var s = '', v, fs = o.fs || 11;
  for (v = 0; v <= o.xmax + 1e-9; v += o.xstep) s += L(X(v), Tp, X(v), Tp + ph, C.line, 1) + T(X(v), Tp + ph + fs + 3, M(v), { size: fs, w: 500, col: C.muted });
  for (v = 0; v <= o.ymax + 1e-9; v += o.ystep) s += L(Lm, Y(v), Lm + pw, Y(v), C.line, 1) + T(Lm - 5, Y(v) + fs * 0.36, M(v), { size: fs, w: 500, col: C.muted, a: "end" });
  s += L(Lm, Tp + ph, Lm + pw, Tp + ph, C.axis, 1.6) + L(Lm, Tp, Lm, Tp + ph, C.axis, 1.6);
  if (o.xlab) s += T(Lm + pw / 2, H - 6, o.xlab, { size: fs + 1, col: C.navy });
  if (o.ylab) s += '<text transform="translate(13 ' + f1(Tp + ph / 2) + ') rotate(-90)" text-anchor="middle" font-size="' + (fs + 1) + '" font-weight="600" fill="' + C.navy + '" ' + FONT + '>' + o.ylab + '</text>';
  (o.lines || []).forEach(function (l) { s += L(X(l[0]), Y(l[1]), X(l[2]), Y(l[3]), l[4] || C.blue, 2.4); if (l[5]) s += T(X(l[2]) - 6, Y(l[3]) + (l[3] > l[1] ? -8 : 16), l[5], { a: "end", size: fs + 2, w: 700, col: l[4] || C.blue, halo: true }); });
  (o.pts || []).forEach(function (p) { s += '<circle cx="' + f1(X(p[0])) + '" cy="' + f1(Y(p[1])) + '" r="' + (o.r || 4.5) + '" fill="' + C.navy + '" stroke="#fff" stroke-width="1.2"/>';
    if (p[2]) s += T(X(p[0]) + (p[3] || 0), Y(p[1]) + (p[4] || -9), p[2], { size: fs + 2, w: 700, col: C.goldT, halo: true }); });
  (o.bars || []).forEach(function (b, i) { var bw = pw / o.bars.length * 0.55, cx = Lm + pw * (i + 0.5) / o.bars.length;
    s += '<rect x="' + f1(cx - bw / 2) + '" y="' + f1(Y(b[1])) + '" width="' + f1(bw) + '" height="' + f1(Tp + ph - Y(b[1])) + '" fill="' + C.navy + '"/>' + T(cx, Tp + ph + fs + 3, b[0], { size: fs, w: 600 }); });
  return svg(W, H, s, o.label, o.cls || "fig"); }

/* ---------------- tables ---------------- */
function tbl(xs, ys, o) { o = o || {}; var hx = o.hx || I("x"), hy = o.hy || I("y");
  function cell(v) { return v === "?" ? '<td class="q">?</td>' : "<td>" + (typeof v === "number" ? M(v) : v) + "</td>"; }
  if (o.vert) return '<table class="xy"><tr><th>' + hx + '</th><th>' + hy + '</th></tr>' + xs.map(function (x, i) { return "<tr>" + cell(x) + cell(ys[i]) + "</tr>"; }).join("") + '</table>';
  return '<div class="tablewrap"><table class="xy"><tr><th>' + hx + '</th>' + xs.map(cell).join("") + '</tr><tr><th>' + hy + '</th>' + ys.map(cell).join("") + '</tr></table></div>'; }
function center(h) { return '<div class="qtabs">' + h + '</div>'; }
function tway(r, rows, cols) { var th = '<tr><th></th>' + cols.map(function (c) { return '<th>' + c + '</th>'; }).join("") + '</tr>';
  return '<div class="tablewrap"><table class="xy tw">' + th + rows.map(function (x, i) { return '<tr><th>' + x + '</th>' + r[i].map(function (v) { return "<td>" + v + "</td>"; }).join("") + '</tr>'; }).join("") + '</table></div>'; }

/* ---------------- angles: parallel lines cut by a transversal ----------------
   labels: { "1ul": "1", "2lr": "(3x + 8)°" } -> intersection 1 (line m) or 2 (line n), and the corner:
   ul = above the line, left of t; ur = above, right; ll = below, left; lr = below, right. */
function chev(x, y) { return '<path d="M' + f1(x - 4) + ' ' + f1(y - 4) + ' l4 4 l-4 4 M' + f1(x + 2) + ' ' + f1(y - 4) + ' l4 4 l-4 4" fill="none" stroke="' + C.gold + '" stroke-width="2"/>'; }
function transversal(labels, o) { o = o || {};
  var W = 340, H = 220, ym = 72, yn = 150, xm = 150, xn = 198, dx = xn - xm, dy = yn - ym, s = "";
  var ext = 0.75, tx1 = xm - dx * ext, ty1 = ym - dy * ext, tx2 = xn + dx * ext, ty2 = yn + dy * ext;
  s += L(30, ym, 310, ym, C.navy, 2) + L(30, yn, 310, yn, C.navy, 2) + L(tx1, ty1, tx2, ty2, C.navy, 2);
  s += chev(268, ym) + chev(268, yn);
  s += T(318, ym + 5, "m", { it: true, a: "start", size: 14 }) + T(318, yn + 5, "n", { it: true, a: "start", size: 14 }) + T(tx2 + 8, ty2 + 2, "t", { it: true, a: "start", size: 14 });
  var tang = Math.atan2(-dy, dx) * 180 / Math.PI + 180;          // math angle of the ray going up-left (about 121°)
  var bis = { ur: tang / 2, ul: (tang + 180) / 2, ll: (180 + tang + 180) / 2, lr: (tang + 180 + 360) / 2 };
  Object.keys(labels || {}).forEach(function (k) { var at = k.charAt(0) === "1" ? [xm, ym] : [xn, yn], q = k.slice(1), a = bis[q], txt = labels[k];
    var r = (q === "ul" || q === "lr") ? 30 : 22, x = at[0] + r * Math.cos(rad(a)), y = at[1] - r * Math.sin(rad(a));
    var long = txt.length > 3, anchor = long ? (q.charAt(1) === "l" ? "end" : "start") : "middle";
    if (long) x = at[0] + (q.charAt(1) === "l" ? -12 : 12) + (q === "ul" ? -6 : 0);
    s += T(x, y + 5, txt, { size: long ? 14 : 15, a: anchor, halo: true }); });
  return svg(W, H, s, o.label || "Parallel lines m and n cut by transversal t", "fig"); }

/* two lines that cross; a1 and a2 are the math angles (degrees) of the two lines; labels by region: up, down, left, right */
function xlines(a1, a2, labels, label) { var cx = 170, cy = 105, R = 100, s = "";
  [a1, a2].forEach(function (a) { s += L(cx - R * Math.cos(rad(a)), cy + R * Math.sin(rad(a)), cx + R * Math.cos(rad(a)), cy - R * Math.sin(rad(a)), C.navy, 2); });
  var rays = [a1, a1 + 180, a2, a2 + 180].map(function (a) { return ((a % 360) + 360) % 360; }).sort(function (p, q) { return p - q; });
  var bis = rays.map(function (a, i) { var b = i < 3 ? rays[i + 1] : rays[0] + 360; return (a + b) / 2; });
  var want = { right: 0, up: 90, left: 180, down: 270 };
  Object.keys(labels).forEach(function (k) { var best = bis.reduce(function (p, q) { function dd(z) { var d = Math.abs(((z - want[k]) % 360 + 540) % 360 - 180); return d; } return dd(q) < dd(p) ? q : p; });
    var r = labels[k].replace(/<[^>]+>/g, "").length > 4 ? 64 : 30; s += T(cx + r * Math.cos(rad(best)), cy - r * Math.sin(rad(best)) + 5, labels[k], { size: 14, halo: true }); });
  return svg(340, 210, s, label || "Two lines that cross", "fig"); }

/* triangle from its base angles; labels: left, right, top; ext = label of the outside angle at the right end */
function tri(aL, aR, labels, ext, label) { var base = 210, x0 = 40, yb = 175, tl = Math.tan(rad(aL)), tr = Math.tan(rad(aR)), xa = base * tr / (tl + tr), h = xa * tl;
  var A = [x0, yb], B = [x0 + xa, yb - h], Cc = [x0 + base, yb], sc = 1;
  if (h > 150) { sc = 150 / h; B = [x0 + xa * sc, yb - 150]; Cc = [x0 + base * sc, yb]; }
  var s = PG([A, B, Cc]);
  if (ext) s += L(Cc[0], yb, Cc[0] + 90, yb, C.navy, 2);
  function at(V, P, Q, txt) { var ux = P[0] - V[0], uy = P[1] - V[1], vx = Q[0] - V[0], vy = Q[1] - V[1], lu = Math.hypot(ux, uy), lv = Math.hypot(vx, vy);
    var bx = ux / lu + vx / lv, by = uy / lu + vy / lv, lb = Math.hypot(bx, by), ang = Math.acos((ux * vx + uy * vy) / lu / lv), d = Math.min(70, 16 + txt.replace(/<[^>]+>/g, "").length * 3.2 / Math.sin(ang / 2) * 0.9);
    return T(V[0] + bx / lb * d, V[1] + by / lb * d + 5, txt, { size: 14 }); }
  if (labels.left) s += at(A, B, Cc, labels.left);
  if (labels.right) s += at(Cc, A, B, labels.right);
  if (labels.top) s += at(B, A, Cc, labels.top);
  if (ext) s += T(Cc[0] + 14, yb - 14, ext, { a: "start", size: 14, halo: true });
  return svg(Math.max(340, Cc[0] + 110), 200, s, label || "Triangle", "fig"); }

/* right triangle: right angle at the bottom left. a = vertical leg, b = bottom leg (numbers set the shape) */
function rtri(a, b, la, lb, lc, label) { var k = Math.min(140 / a, 220 / b), x0 = 70, yb = 170, A = [x0, yb - a * k], Bp = [x0, yb], Cp = [x0 + b * k, yb];
  var s = PG([A, Bp, Cp]) + '<path d="M' + x0 + ' ' + (yb - 12) + ' h12 v12" fill="none" stroke="' + C.navy + '" stroke-width="1.5"/>';
  s += T(x0 - 10, (A[1] + yb) / 2 + 5, la, { a: "end", size: 15 }) + T((x0 + Cp[0]) / 2, yb + 20, lb, { size: 15 }) + T((A[0] + Cp[0]) / 2 + 12, (A[1] + yb) / 2 - 6, lc, { a: "start", size: 15, halo: true });
  return svg(340, 200, s, label || "Right triangle", "fig"); }

/* ladder against a wall: lad = ladder label, base = ground label, h = height label */
function ladder(lad, base, hl, ratio, label) { var g = 240, wx = 230, yb = 175, run = 70, rise = run * (ratio || 3), s = "";
  if (rise > 150) rise = 150;
  s += L(40, yb, 300, yb, C.navy, 2) + '<rect x="' + wx + '" y="' + (yb - 160) + '" width="20" height="160" fill="#F1F3F7" stroke="' + C.navy + '" stroke-width="1.5"/>';
  s += '<path d="M' + (wx - 12) + ' ' + yb + ' v-12 h12" fill="none" stroke="' + C.navy + '" stroke-width="1.5"/>';
  s += L(wx - run, yb, wx, yb - rise, C.gold, 4);
  s += T(wx - run / 2 - 14, yb - rise / 2, lad, { a: "end", size: 14, halo: true }) + T(wx - run / 2, yb + 18, base, { size: 14 }) + T(wx + 26, yb - rise / 2 + 5, hl, { a: "start", size: 14 });
  return svg(340, 200, s, label || "A ladder leaning against a wall", "fig"); }

/* box (rectangular prism) with three edge labels */
function box(lw, ld, lh, w, d, h, label) { var k = Math.min(160 / w, 90 / h, 999), W2 = Math.max(60, w * k), H2 = Math.max(40, h * k), D = Math.min(50, Math.max(26, d * k * 0.6)), x0 = 90, yb = 170, s = "";
  var f = [[x0, yb], [x0 + W2, yb], [x0 + W2, yb - H2], [x0, yb - H2]], ox = D * 0.8, oy = D * 0.6;
  s += PG(f, "#F1F3F7") + PG([[x0, yb - H2], [x0 + ox, yb - H2 - oy], [x0 + W2 + ox, yb - H2 - oy], [x0 + W2, yb - H2]], "#E8ECF3") + PG([[x0 + W2, yb], [x0 + W2 + ox, yb - oy], [x0 + W2 + ox, yb - H2 - oy], [x0 + W2, yb - H2]], "#DCE2EC");
  s += T(x0 + W2 / 2, yb + 20, lw, { size: 14 }) + T(x0 + W2 + ox / 2 + 8, yb - oy / 2 + 8, ld, { a: "start", size: 14 }) + T(x0 - 8, yb - H2 / 2 + 5, lh, { a: "end", size: 14 });
  return svg(340, 200, s, label || "A rectangular prism", "fig"); }

/* solids: cylinder, cone, sphere (radius line in gold, height dashed) */
function cyl(rl, hl, o) { o = o || {}; var cx = 170, rx = 56, ry = 14, top = 30, bot = 160, s = "";
  s += '<path d="M' + (cx - rx) + ' ' + top + ' V' + bot + ' A' + rx + ' ' + ry + ' 0 0 0 ' + (cx + rx) + ' ' + bot + ' V' + top + '" fill="#F1F3F7" stroke="' + C.navy + '" stroke-width="2"/>';
  s += '<ellipse cx="' + cx + '" cy="' + top + '" rx="' + rx + '" ry="' + ry + '" fill="#E8ECF3" stroke="' + C.navy + '" stroke-width="2"/>';
  s += '<path d="M' + (cx - rx) + ' ' + bot + ' A' + rx + ' ' + ry + ' 0 0 1 ' + (cx + rx) + ' ' + bot + '" fill="none" stroke="' + C.navy + '" stroke-width="1.4" stroke-dasharray="4 4"/>';
  if (o.diam) s += L(cx - rx, top, cx + rx, top, C.gold, 3) + T(cx, top - 20, rl, { size: 14, halo: true });
  else s += L(cx, top, cx + rx, top, C.gold, 3) + '<circle cx="' + cx + '" cy="' + top + '" r="3" fill="' + C.navy + '"/>' + T(cx + rx / 2, top - 20, rl, { size: 14, halo: true });
  s += L(cx + rx + 16, top, cx + rx + 16, bot, C.gold, 2.5) + T(cx + rx + 26, (top + bot) / 2 + 5, hl, { a: "start", size: 14 });
  return svg(340, 190, s, o.label || "A cylinder", "fig"); }
function cone(rl, hl, o) { o = o || {}; var cx = 170, rx = 58, ry = 14, top = 22, bot = 165, s = "";
  s += '<path d="M' + cx + ' ' + top + ' L' + (cx + rx) + ' ' + bot + ' A' + rx + ' ' + ry + ' 0 0 1 ' + (cx - rx) + ' ' + bot + ' Z" fill="#F1F3F7" stroke="' + C.navy + '" stroke-width="2"/>';
  s += '<path d="M' + (cx - rx) + ' ' + bot + ' A' + rx + ' ' + ry + ' 0 0 1 ' + (cx + rx) + ' ' + bot + '" fill="none" stroke="' + C.navy + '" stroke-width="1.4" stroke-dasharray="4 4"/>';
  s += L(cx, top, cx, bot, C.gold, 2, ' stroke-dasharray="5 4"') + L(cx, bot, cx + rx, bot, C.gold, 3) + '<circle cx="' + cx + '" cy="' + bot + '" r="3" fill="' + C.navy + '"/>';
  s += T(cx - 8, (top + bot) / 2 + 10, hl, { a: "end", size: 14, halo: true }) + T(cx + rx / 2, bot + 26, rl, { size: 14 });
  return svg(340, 200, s, o.label || "A cone", "fig"); }
function sphere(rl, o) { o = o || {}; var cx = 170, cy = 95, r = 70, s = "";
  s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#F1F3F7" stroke="' + C.navy + '" stroke-width="2"/>';
  s += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + r + '" ry="16" fill="none" stroke="' + C.navy + '" stroke-width="1.3" stroke-dasharray="4 4"/>';
  s += L(cx, cy, cx + r, cy, C.gold, 3) + '<circle cx="' + cx + '" cy="' + cy + '" r="3" fill="' + C.navy + '"/>' + T(cx + r / 2, cy - 10, rl, { size: 14, halo: true });
  return svg(340, 190, s, o.label || "A sphere", "fig"); }

/* distance-time sketch (no numbers): pts on a 0..10 square */
function story(pts, o) { o = o || {}; var W = 220, H = 150, Lm = 30, Tp = 12, pw = 176, ph = 106, s = "";
  function X(x) { return Lm + x / 10 * pw; } function Y(y) { return Tp + ph - y / 10 * ph; }
  s += L(Lm, Tp + ph, Lm + pw, Tp + ph, C.axis, 1.8) + L(Lm, Tp, Lm, Tp + ph, C.axis, 1.8);
  s += T(Lm + pw / 2, H - 8, "Time", { size: 12, w: 500 }) + '<text transform="translate(16 ' + (Tp + ph / 2) + ') rotate(-90)" text-anchor="middle" font-size="12" font-weight="500" fill="' + C.navy + '" ' + FONT + '>Distance</text>';
  s += '<polyline points="' + pts.map(function (p) { return f1(X(p[0])) + "," + f1(Y(p[1])); }).join(" ") + '" fill="none" stroke="' + C.gold + '" stroke-width="3.2" stroke-linejoin="round"/>';
  (o.labs || []).forEach(function (l) { s += T(X(l[0]), Y(l[1]), l[2], { size: 13, w: 700, halo: true }); });
  return svg(W, H, s, o.label || "Distance-time graph", o.cls || "cmini"); }

EOGU.h = { M: M, SF: SF, P: P, RT: RT, CRT: CRT, E: E, MO: MO, BAR: BAR, I: I, C: C, T: T, svg: svg, L: L, PG: PG, Grid: Grid, chart: chart, tbl: tbl, center: center, tway: tway,
  transversal: transversal, xlines: xlines, tri: tri, rtri: rtri, ladder: ladder, box: box, cyl: cyl, cone: cone, sphere: sphere, story: story };

/* ================= ENGINE (same as eog_practice.html, plus a Hint button and Version 2 "read this first" boxes) ================= */
EOGU.run = function (unit, ver) {
  var D = EOGU.data[unit], V = D["v" + ver], wrap = document.getElementById("eogwrap");
  var KEY = /[?&]key=1\b/.test(location.search), parts = V.parts, TOTAL = 0, anyCalc = false;
  parts.forEach(function (p) { TOTAL += p.qs.length; if (p.calc) anyCalc = true; });
  var other = ver === 1 ? '<a href="unit' + unit + '-eog-v2.html">Version 2</a>' : '<a href="unit' + unit + '-eog.html">the EOG-style set</a>';
  var h = '<a class="back-link" href="' + D.back + '">← Unit ' + unit + '</a>' +
    '<div class="std">EOG Practice · Unit ' + unit + (ver === 2 ? ' · Version 2' : '') + ' · ' + D.std + '</div>' +
    '<h1>' + D.title + (ver === 2 ? ' — Version 2' : '') + '</h1>' +
    '<p class="lede" id="lede">' + (ver === 1
      ? TOTAL + ' questions in the style of the NC End-of-Grade test. Part 1 is <b>no calculator</b>. Part 2 lets you use a calculator. Pick an answer or type a number, then tap <b>Check</b>. Stuck? Tap <b>Hint</b>.'
      : TOTAL + ' questions. <b>Read the box first.</b> It shows you how. Then pick A, B or C and tap <b>Check</b>.') + '</p>' +
    '<p class="keynote" id="keynote">Teacher answer key: answers and steps for every question.</p>' +
    '<div class="card howto" id="howto"><div class="modebar"><button id="classMode" aria-pressed="false">Turn on Class mode</button><span class="small-note">For the board: bigger text, talk prompts, and a Show answer button.</span></div>' +
    '<p class="small-note" style="margin:0">On your own device, work alone. A wrong answer tells you what went wrong, so try again. At the end, send your work to Mr. Allen.</p></div>';
  parts.forEach(function (p, i) {
    h += '<section class="part" id="p' + (i + 1) + '"><div class="part-head"><div class="std">' + (parts.length > 1 ? 'Part ' + (i + 1) + ' · ' : '') + p.std + '</div><h2>' + p.title + '</h2>' +
      (p.calc == null ? '' : '<span class="calcnote ' + (p.calc ? 'yes">You may use a calculator. Tap <b>Desmos</b> at the bottom right.' : 'no">Do not use a calculator.') + '</span>') + '</div><div id="qs' + (i + 1) + '"></div></section>';
  });
  h += '<section class="card" id="summary" aria-live="polite"></section><div id="send"></div>' +
    '<div class="score" id="score">First-try score: <span class="mono" id="scoreN">0</span> of <span class="mono">' + TOTAL + '</span> · Answered <span class="mono" id="doneN">0</span></div>' +
    '<p class="small-note" style="text-align:center;margin-top:14px">Also try ' + other + '.</p>';
  wrap.innerHTML = h;
  if (anyCalc) document.body.insertAdjacentHTML("beforeend", '<button id="dFab" class="dfab off" aria-expanded="false" aria-controls="dPanel">Desmos</button>' +
    '<div id="dPanel" class="dpanel" role="dialog" aria-label="Desmos calculator" hidden><div class="dbar"><b>Desmos calculator</b><a class="dlink" href="https://www.desmos.com/calculator" target="_blank" rel="noopener">Open in a new tab</a><button id="dClose" class="small" aria-label="Close calculator">✕</button></div><div class="dslot"></div></div>');

  var stats = {}, qnum = 0;
  function upd() { var n = 0, d = 0; Object.keys(stats).forEach(function (k) { if (stats[k].done) d++; if (stats[k].first) n++; });
    document.getElementById("scoreN").textContent = n; document.getElementById("doneN").textContent = d; if (d === TOTAL) summary(n); }
  function summary(n) { var miss = [];
    parts.forEach(function (p, i) { var m = p.qs.filter(function (q) { return !stats[q.id].first; }).length; if (m) miss.push('<a href="#p' + (i + 1) + '">' + p.title + "</a> (" + m + " missed on the first try)"); });
    var el = document.getElementById("summary"); el.classList.add("show");
    el.innerHTML = '<h3 style="margin-top:0">Nice work. You finished!</h3><p>You got <b>' + n + ' of ' + TOTAL + '</b> right on the first try.</p>' +
      (miss.length ? '<p>Look at these once more:</p><ul class="steps">' + miss.map(function (m) { return "<li>" + m + "</li>"; }).join("") + '</ul>' : '<p>You got every one on the first try!</p>') +
      '<p class="small-note">Now send your work to Mr. Allen below.</p>'; }
  function num(s) { s = String(s).replace(/[−–—]/g, "-").replace(/[$°,%]/g, "").trim().replace(/^[a-z]+\s*=\s*/i, "").replace(/\s*(units?|feet|ft|inches|in|cm|m|degrees|months|buckets)\.?$/i, "");
    var mx = s.match(/^([-+]?)(\d+)\s+(\d+)\/(\d+)$/); if (mx) { var dd = Number(mx[4]); if (dd === 0) return NaN; var v = Number(mx[2]) + Number(mx[3]) / dd; return mx[1] === "-" ? -v : v; }
    s = s.replace(/\s+/g, ""); var fr = s.match(/^([-+]?\d*\.?\d+)\/([-+]?\d*\.?\d+)$/); if (fr) { var dn = Number(fr[2]); return dn === 0 ? NaN : Number(fr[1]) / dn; }
    if (!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(s)) return NaN; return Number(s); }
  function gcd(a, b) { return b ? gcd(b, a % b) : a; }
  function same(a, b) { return Math.abs(a - b) < 1e-9; }
  function rec(q, ok) { if (window.ScoreSend) ScoreSend.record(q.id, ok, { std: q.std, band: 4, label: q.text.replace(/<[^>]+>/g, "").slice(0, 80) }); }
  function fracText(v) { for (var d = 1; d <= 12; d++) { var n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return d === 1 ? M(n) : M(n) + "/" + d; } return M(v); }
  function ansText(q) { if (q.type === "num") return (q.pre ? q.pre + " " : "") + (q.show || (q.frac ? fracText(q.ans) : M(q.ans))) + (q.post ? " " + q.post : "");
    return q.opts.map(function (o, j) { return o.ok ? "ABCDE"[j] : null; }).filter(Boolean).join(", "); }
  function explain(q) { return (q.steps ? '<div class="xwrap"><b>Step by step</b><ol class="xsteps">' + q.steps.map(function (s) { return "<li>" + s + "</li>"; }).join("") + '</ol>' : '<div class="xwrap">') +
    (q.mist ? '<div class="mist1"><b>Common mistake:</b> ' + q.mist + '</div>' : '') + '</div>'; }
  function whyAll(q) { return q.type !== "num" ? '<ul class="whyall">' + q.opts.map(function (o, j) { return o.ok ? "" : "<li><b>" + "ABCDE"[j] + " is wrong:</b> " + o.why + "</li>"; }).join("") + '</ul>' : ""; }

  function render(p, box) { p.qs.forEach(function (q) {
    qnum++; q.type = q.type || "mc"; q.std = q.std || p.std; q.calc = (q.calc != null ? q.calc : p.calc); stats[q.id] = { done: false, first: false, tries: 0 };
    var d = document.createElement("div"); d.className = "q"; d.id = "q-" + q.id; if (q.calc) d.dataset.calc = "1";
    var tag = q.tag || (q.type === "num" ? "Numeric entry" : q.type === "sa" ? "Select all" : "Multiple choice");
    var h = '<div class="qn">Question ' + qnum + (q.calc == null ? '' : '<span class="tag ' + (q.calc ? "calc" : "nocalc") + '">' + (q.calc ? "Calculator OK" : "No calculator") + '</span>') + '<span class="tag">' + tag + '</span><span class="tag stdtag">' + q.std + '</span></div>';
    if (q.box) h += '<div class="vbox"><span class="vl">Read this first</span>' + q.box + '</div>';
    h += '<div class="qt">' + q.text + '</div>';
    if (q.fig) h += '<div class="qfig">' + q.fig() + '</div>';
    if (q.type === "num") h += '<div class="entry one"><label for="' + q.id + 'n" style="display:inline;font:600 20px var(--mono);color:var(--navy)">' + (q.pre || "") + '</label> <input id="' + q.id + 'n" inputmode="' + (q.frac ? "text" : "decimal") + '" autocomplete="off"' + (q.pre ? '' : ' aria-label="Your answer"') + '>' + (q.post ? ' <span style="font:500 17px var(--sans);color:var(--muted)">' + q.post + '</span>' : '') + '</div>';
    else { h += '<div class="opts' + (q.cls ? " " + q.cls : (q.opts.length === 3 ? " three" : "")) + '">' + q.opts.map(function (o, j) { return '<button class="opt" data-j="' + j + '" aria-pressed="false"><span class="let">' + "ABCDE"[j] + '</span><span class="optin">' + o.h + '</span></button>'; }).join("") + '</div>';
      if (q.type === "sa") h += '<div class="small-note sanote">More than one answer may be right.</div>'; }
    if (q.hint) h += '<div class="hint"><b class="hl-s">Hint:</b><b class="hl-c">Talk it over:</b> ' + q.hint + '</div>';
    h += '<div class="btnrow"><button class="primary chk">Check</button>' + (q.hint ? '<button class="hintbtn" aria-expanded="false">Hint</button>' : '') + '<button class="reveal">Show answer</button></div><div class="fb" role="status"></div>';
    d.innerHTML = h; box.appendChild(d);
    var fb = d.querySelector(".fb"), choice = q.type !== "num";
    if (KEY) { fb.className = "fb ok"; fb.innerHTML = "<b>Answer: " + ansText(q) + ".</b> " + q.ok + explain(q) + whyAll(q);
      if (choice) [].forEach.call(d.querySelectorAll(".opt"), function (o, j) { o.classList.toggle("right", !!q.opts[j].ok); }); return; }
    if (choice) d.querySelector(".opts").addEventListener("click", function (e) {
      var b = e.target.closest(".opt"); if (!b || stats[q.id].done) return;
      if (q.type === "mc") [].forEach.call(d.querySelectorAll(".opt"), function (o) { o.classList.remove("sel"); o.setAttribute("aria-pressed", "false"); });
      var on = !b.classList.contains("sel"); b.classList.toggle("sel", on); b.setAttribute("aria-pressed", on); });
    var hb = d.querySelector(".hintbtn");
    if (hb) hb.addEventListener("click", function () { var on = !d.classList.contains("hint-on"); d.classList.toggle("hint-on", on); hb.setAttribute("aria-expanded", on); hb.textContent = on ? "Hide hint" : "Hint"; });
    function showAll() { var st = stats[q.id];
      if (q.type === "num") d.querySelector("#" + q.id + "n").value = q.frac ? fracText(q.ans) : M(q.ans);
      else [].forEach.call(d.querySelectorAll(".opt"), function (o, j) { o.classList.toggle("sel", !!q.opts[j].ok); o.classList.toggle("right", !!q.opts[j].ok); o.setAttribute("aria-pressed", !!q.opts[j].ok); });
      fb.className = "fb ok"; fb.innerHTML = "<b>Answer: " + ansText(q) + ".</b> " + q.ok + explain(q) + whyAll(q);
      d.querySelector(".chk").disabled = true;
      d.classList.add("done"); if (!st.done) { st.done = true; if (window.ScoreSend) ScoreSend.revealed(); if (!st.tries) rec(q, false); upd(); } }
    d.querySelector(".reveal").addEventListener("click", showAll);
    d.querySelector(".chk").addEventListener("click", function () {
      var st = stats[q.id]; if (st.done) return; var good = false, msg = "";
      if (q.type === "num") { var raw = d.querySelector("#" + q.id + "n").value, v = num(raw);
        if (isNaN(v)) { fb.className = "fb no"; fb.innerHTML = q.frac ? "Type a number or a fraction, like 3/4. Use a minus sign for negatives, like −2." : "Type a number. Use a minus sign for negatives, like −2."; return; }
        good = same(v, q.ans);
        var fm = String(raw).replace(/[−–—]/g, "-").replace(/\s+/g, "").match(/^-?(\d+)\/(\d+)$/);
        if (good && q.simplest && fm && gcd(+fm[1], +fm[2]) !== 1) { good = false; msg = "That fraction is equal, but it is not in simplest form. Divide the top and bottom by the same number."; }
        else if (good && q.simplest && !fm) { good = false; msg = "Write it as a fraction, like 3/4."; }
        else if (!good) msg = (q.wrong && q.wrong(v)) || q.redo || "Check your work and try again. Tap <b>Hint</b> if you are stuck."; }
      else { var sel = [].map.call(d.querySelectorAll(".opt.sel"), function (o) { return +o.dataset.j; });
        if (!sel.length) { fb.className = "fb no"; fb.innerHTML = "Pick an answer first."; return; }
        if (q.type === "mc") { good = !!q.opts[sel[0]].ok; if (!good) msg = q.opts[sel[0]].why; }
        else { var wrongSel = sel.filter(function (j) { return !q.opts[j].ok; }), need = q.opts.filter(function (o) { return o.ok; }).length, got = sel.filter(function (j) { return q.opts[j].ok; }).length;
          good = !wrongSel.length && got === need;
          if (!good) msg = wrongSel.length ? q.opts[wrongSel[0]].why : "Everything you picked is true. But there " + (need - got === 1 ? "is 1 more right answer." : "are " + (need - got) + " more right answers."); } }
      st.tries++; rec(q, good);
      if (good) { st.done = true; d.classList.add("done"); st.first = (st.tries === 1); fb.className = "fb ok"; fb.innerHTML = "<b>Yes!</b> " + q.ok + explain(q);
        d.querySelector(".chk").disabled = true; if (choice) [].forEach.call(d.querySelectorAll(".opt.sel"), function (o) { o.classList.add("right"); }); upd(); }
      else { fb.className = "fb no"; fb.innerHTML = "<b>Not yet.</b> " + msg + (st.tries >= 2 ? ' <span class="small-note">Answer: ' + ansText(q) + '. Tap <b>Show answer</b> for every step.</span>' : " Try again.");
        if (st.tries >= 2) d.querySelector(".reveal").style.display = "inline-flex"; }
    });
  }); }
  if (KEY) document.body.classList.add("key-mode");
  parts.forEach(function (p, i) { render(p, document.getElementById("qs" + (i + 1))); });
  if (!KEY && window.ScoreSend) ScoreSend.setup({ kind: 'practice', unit: String(unit), page: 'Unit ' + unit + ' · EOG Practice' + (ver === 2 ? ' · Version 2' : ''), mount: '#send', std: D.std.split(' ')[0], band: 4 });
  var cm = document.getElementById("classMode");
  cm.addEventListener("click", function () { var on = !document.body.classList.contains("class-mode"); document.body.classList.toggle("class-mode", on);
    cm.setAttribute("aria-pressed", on); cm.textContent = on ? "Turn off Class mode" : "Turn on Class mode"; cm.classList.toggle("on", on); });

  /* Desmos: one shared iframe; the button shows only while a Calculator OK question is on screen */
  if (!anyCalc) return;
  var dFrame = null, dPanel = document.getElementById("dPanel"), dFab = document.getElementById("dFab");
  function frame() { if (!dFrame) { dFrame = document.createElement("iframe"); dFrame.src = "https://www.desmos.com/calculator?embed"; dFrame.title = "Desmos graphing calculator"; dFrame.loading = "lazy";
    dFrame.setAttribute("style", "width:100%;height:100%;border:1px solid var(--line);border-radius:10px"); } return dFrame; }
  function setPanel(on) { dPanel.hidden = !on; dFab.setAttribute("aria-expanded", on); dFab.style.display = on ? "none" : ""; if (on) { var sl = dPanel.querySelector(".dslot"), f = frame(); if (f.parentNode !== sl) sl.appendChild(f); } }
  dFab.addEventListener("click", function () { setPanel(true); });
  document.getElementById("dClose").addEventListener("click", function () { setPanel(false); dFab.focus(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !dPanel.hidden) { setPanel(false); dFab.focus(); } });
  function sync() { var calcOn = [].some.call(document.querySelectorAll('.q[data-calc="1"]'), function (q) { return !q.classList.contains("oat-x") && q.offsetParent !== null; });
    dFab.classList.toggle("off", !calcOn); if (!calcOn && !dPanel.hidden) setPanel(false); }
  new MutationObserver(function () { clearTimeout(sync.t); sync.t = setTimeout(sync, 60); }).observe(wrap, { subtree: true, attributes: true, attributeFilter: ["class", "style", "hidden"] });
  window.addEventListener("load", sync); setTimeout(sync, 300);
};
})();
