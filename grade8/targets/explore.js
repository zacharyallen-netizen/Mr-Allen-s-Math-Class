/* ==========================================================================
   I Can Targets — "Explore it" widgets (one per standard where a hands-on
   picture helps). Each panel is built the first time it is opened.
   ========================================================================== */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  function neg(v) { return v < 0 ? "−" + (-v) : "" + v; }
  function eqs(m, b) {
    var mt = m === 0 ? "" : (m === 1 ? "x" : m === -1 ? "−x" : fmt(m) + "x");
    var bt = b === 0 ? (m === 0 ? "0" : "") : (m === 0 ? neg(b) : (b > 0 ? " + " + b : " − " + (-b)));
    return "y = " + mt + bt;
  }
  function r2(v) { return Math.round(v * 100) / 100; }
  function fmt(v) { return neg(r2(v)); }
  function el(html) { var d = document.createElement("div"); d.innerHTML = html; return d.firstElementChild; }
  function slider(id, label, min, max, step, val) {
    return '<label for="' + id + '">' + label + ': <b data-v="' + id + '"></b></label>' +
      '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '">';
  }
  var uid = 0;
  function frame(box, svgW, svgH, controls, note) {
    var p = "x" + (++uid) + "-";
    controls = controls.replace(/id="/g, 'id="' + p).replace(/for="/g, 'for="' + p).replace(/data-v="/g, 'data-v="' + p);
    box.innerHTML = '<div class="exw"><svg viewBox="0 0 ' + svgW + " " + svgH + '" role="img"></svg><div class="exc">' + controls +
      '<div class="out"></div></div></div>' + (note ? '<p class="ex-note">' + note + "</p>" : "");
    var svg = box.querySelector("svg"), out = box.querySelector(".out");
    function v(id) { return +box.querySelector("#" + p + id).value; }
    function sel(id) { return box.querySelector("#" + p + id); }
    function show(id, txt) { var b = box.querySelector('[data-v="' + p + id + '"]'); if (b) b.textContent = txt; }
    return { svg: svg, out: out, v: v, sel: sel, show: show, on: function (fn) {
      box.querySelectorAll("input,select").forEach(function (i) { i.addEventListener("input", fn); i.addEventListener("change", fn); });
      fn();
    } };
  }
  /* simple coordinate grid -------------------------------------------------- */
  function grid(o) { // o: {x0,x1,y0,y1,W,H,m}
    var m = o.m || 22, ux = (o.W - 2 * m) / (o.x1 - o.x0), uy = (o.H - 2 * m) / (o.y1 - o.y0);
    var X = function (x) { return m + (x - o.x0) * ux; }, Y = function (y) { return o.H - m - (y - o.y0) * uy; };
    var s = "", step = o.step || 1, lab = o.lab || 1;
    for (var x = o.x0; x <= o.x1 + 1e-9; x += step) s += '<line class="s-grid" x1="' + X(x) + '" y1="' + Y(o.y0) + '" x2="' + X(x) + '" y2="' + Y(o.y1) + '"/>';
    for (var y = o.y0; y <= o.y1 + 1e-9; y += step) s += '<line class="s-grid" x1="' + X(o.x0) + '" y1="' + Y(y) + '" x2="' + X(o.x1) + '" y2="' + Y(y) + '"/>';
    var ay = (o.y0 <= 0 && o.y1 >= 0) ? 0 : o.y0, ax = (o.x0 <= 0 && o.x1 >= 0) ? 0 : o.x0;
    s += '<line class="s-ink" stroke-width="1.5" x1="' + X(o.x0) + '" y1="' + Y(ay) + '" x2="' + X(o.x1) + '" y2="' + Y(ay) + '"/>';
    s += '<line class="s-ink" stroke-width="1.5" x1="' + X(ax) + '" y1="' + Y(o.y0) + '" x2="' + X(ax) + '" y2="' + Y(o.y1) + '"/>';
    for (x = o.x0; x <= o.x1 + 1e-9; x += step * lab) if (x !== ax) s += '<text x="' + X(x) + '" y="' + (Y(ay) + 13) + '" font-size="10" text-anchor="middle" class="t-muted">' + neg(x) + "</text>";
    for (y = o.y0; y <= o.y1 + 1e-9; y += step * lab) if (y !== ay) s += '<text x="' + (X(ax) - 5) + '" y="' + (Y(y) + 3.5) + '" font-size="10" text-anchor="end" class="t-muted">' + neg(y) + "</text>";
    return { X: X, Y: Y, s: s, ux: ux, uy: uy, o: o };
  }
  function lineIn(g, m, b) { // clip y=mx+b to box
    var o = g.o, pts = [];
    [[o.x0, m * o.x0 + b], [o.x1, m * o.x1 + b]].forEach(function () {});
    var cand = [];
    cand.push([o.x0, m * o.x0 + b], [o.x1, m * o.x1 + b]);
    if (m !== 0) cand.push([(o.y0 - b) / m, o.y0], [(o.y1 - b) / m, o.y1]);
    cand.forEach(function (c) { if (c[0] >= o.x0 - 1e-9 && c[0] <= o.x1 + 1e-9 && c[1] >= o.y0 - 1e-9 && c[1] <= o.y1 + 1e-9) pts.push(c); });
    pts.sort(function (a, c) { return a[0] - c[0]; });
    if (pts.length < 2) return "";
    var a = pts[0], z = pts[pts.length - 1];
    return 'x1="' + g.X(a[0]) + '" y1="' + g.Y(a[1]) + '" x2="' + g.X(z[0]) + '" y2="' + g.Y(z[1]) + '"';
  }
  function svgPoint(svg, ev) {
    var pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }
  function drag(svg, handles, onMove) { // handles: elements with data-h index
    var active = null;
    svg.addEventListener("pointerdown", function (e) {
      var h = e.target.closest("[data-h]"); if (!h) return;
      active = +h.getAttribute("data-h"); svg.setPointerCapture(e.pointerId); e.preventDefault();
    });
    svg.addEventListener("pointermove", function (e) { if (active === null) return; onMove(active, svgPoint(svg, e)); });
    ["pointerup", "pointercancel"].forEach(function (t) { svg.addEventListener(t, function () { active = null; }); });
  }

  var W = {};

  /* NS.2 — square root on a number line */
  W.roots = function (box) {
    var f = frame(box, 420, 150, slider("n", "n", 2, 150, 1, 20));
    f.on(function () {
      var n = f.v("n"), r = Math.sqrt(n), lo = Math.floor(r), hi = Math.ceil(r);
      if (lo === hi) hi = lo + 1;
      var a = lo - 0.25, b = hi + 0.25, X = function (x) { return 30 + (x - a) * 360 / (b - a); };
      var s = '<line class="s-ink" stroke-width="2" x1="20" y1="80" x2="400" y2="80"/>';
      for (var t = 0; t <= 10; t++) { var x = lo + t / 10; s += '<line class="s-muted" x1="' + X(x) + '" y1="' + (t % 10 ? 74 : 68) + '" x2="' + X(x) + '" y2="' + (t % 10 ? 86 : 92) + '"/>'; if (t % 5 === 0 && t % 10) s += '<text x="' + X(x) + '" y="104" font-size="11" text-anchor="middle" class="t-muted">' + (lo + .5) + "</text>"; }
      [lo, hi].forEach(function (k) { s += '<text x="' + X(k) + '" y="110" font-size="15" font-weight="700" text-anchor="middle">' + k + '</text><text x="' + X(k) + '" y="128" font-size="11" text-anchor="middle" class="t-muted">' + k + "² = " + k * k + "</text>"; });
      s += '<circle cx="' + X(r) + '" cy="80" r="6" class="f-blue s-blue"/><text x="' + X(r) + '" y="56" font-size="15" font-weight="700" text-anchor="middle" class="t-blue">√' + n + "</text>";
      f.svg.innerHTML = s; f.show("n", n);
      var exact = Number.isInteger(r);
      f.out.innerHTML = exact ? "<b>√" + n + " = " + r + "</b> exactly — " + n + " is a perfect square, so √" + n + " is rational."
        : lo + "² = " + lo * lo + " and " + hi + "² = " + hi * hi + ", so √" + n + " is between <b>" + lo + "</b> and <b>" + hi + "</b>.<br>It is closer to " + (n - lo * lo < hi * hi - n ? lo : hi) + ". √" + n + " ≈ <b>" + r.toFixed(2) + "</b> (irrational).";
    });
  };

  /* EE.3 — powers of ten */
  W.sci = function (box) {
    var f = frame(box, 420, 120, slider("c", "Coefficient", 1, 9.9, 0.1, 3.2) + slider("e", "Exponent", -6, 9, 1, 4));
    f.on(function () {
      var c = Math.round(f.v("c") * 10) / 10, e = f.v("e");
      var digits = String(c).replace(".", ""), pointAt = 1 + e; // position of point after this many digits
      var s;
      if (pointAt <= 0) s = "0." + "0".repeat(-pointAt) + digits;
      else if (pointAt >= digits.length) s = digits + "0".repeat(pointAt - digits.length);
      else s = digits.slice(0, pointAt) + "." + digits.slice(pointAt);
      var pretty = s.indexOf(".") < 0 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : s;
      f.svg.innerHTML = '<text x="210" y="50" font-size="26" font-weight="700" text-anchor="middle" class="t-blue">' + c + ' × 10<tspan dy="-12" font-size="16">' + neg(e) + "</tspan></text>" +
        '<text x="210" y="96" font-size="' + (pretty.length > 16 ? 16 : 22) + '" font-weight="600" text-anchor="middle">= ' + pretty + "</text>";
      f.show("c", c); f.show("e", neg(e));
      f.out.innerHTML = e === 0 ? "10<sup>0</sup> = 1, so the decimal point does not move." :
        "The exponent is <b>" + neg(e) + "</b>, so the decimal point moves <b>" + Math.abs(e) + " place" + (Math.abs(e) === 1 ? "" : "s") + " to the " + (e > 0 ? "right" : "left") + "</b>." +
        (e > 0 ? " Positive exponent → a big number." : " Negative exponent → a small number (less than 1).");
    });
  };

  /* F.3 — slope-intercept sliders */
  W.slope = function (box) {
    var f = frame(box, 320, 320, slider("m", "Slope m", -4, 4, 0.5, 1) + slider("b", "y-intercept b", -6, 6, 1, 2));
    f.on(function () {
      var m = f.v("m"), b = f.v("b"), g = grid({ x0: -8, x1: 8, y0: -8, y1: 8, W: 320, H: 320, lab: 2 });
      var s = g.s + '<line class="s-blue" stroke-width="3" ' + lineIn(g, m, b) + "/>";
      if (Math.abs(b + m) <= 8) s += '<line class="s-gold" stroke-width="2.5" stroke-dasharray="5 3" x1="' + g.X(0) + '" y1="' + g.Y(b) + '" x2="' + g.X(1) + '" y2="' + g.Y(b) + '"/><line class="s-gold" stroke-width="2.5" stroke-dasharray="5 3" x1="' + g.X(1) + '" y1="' + g.Y(b) + '" x2="' + g.X(1) + '" y2="' + g.Y(b + m) + '"/>';
      s += '<circle cx="' + g.X(0) + '" cy="' + g.Y(b) + '" r="5" class="f-red s-red"/>';
      f.svg.innerHTML = s; f.show("m", fmt(m)); f.show("b", neg(b));
      var eq = "y = " + (m === 0 ? "" : (m === 1 ? "" : m === -1 ? "−" : fmt(m)) + "x") + (b === 0 ? (m === 0 ? "0" : "") : (m === 0 ? neg(b) : (b > 0 ? " + " + b : " − " + (-b))));
      f.out.innerHTML = "<b>" + eq + "</b><br>Red dot: y-intercept (0, " + neg(b) + ").<br>Gold steps: run 1, rise " + fmt(m) + ".<br>" +
        (m > 0 ? "Positive slope — the line goes up to the right." : m < 0 ? "Negative slope — the line goes down to the right." : "Zero slope — a horizontal line.");
    });
  };

  /* EE.8 — systems */
  W.systems = function (box) {
    var f = frame(box, 320, 320, slider("m1", "Blue slope", -3, 3, 0.5, 1) + slider("b1", "Blue intercept", -6, 6, 1, -1) +
      slider("m2", "Red slope", -3, 3, 0.5, -1) + slider("b2", "Red intercept", -6, 6, 1, 3));
    f.on(function () {
      var m1 = f.v("m1"), b1 = f.v("b1"), m2 = f.v("m2"), b2 = f.v("b2");
      var g = grid({ x0: -8, x1: 8, y0: -8, y1: 8, W: 320, H: 320, lab: 2 });
      var s = g.s + '<line class="s-blue" stroke-width="3" ' + lineIn(g, m1, b1) + '/><line class="s-red" stroke-width="3" ' + (m1 === m2 && b1 === b2 ? 'stroke-dasharray="8 6" ' : "") + lineIn(g, m2, b2) + "/>";
      var msg;
      if (m1 === m2 && b1 === b2) msg = "Same slope <b>and</b> same intercept: the lines are the same line. <b>Infinitely many solutions.</b>";
      else if (m1 === m2) msg = "Same slope, different intercepts: the lines are parallel and never meet. <b>No solution.</b>";
      else {
        var x = (b2 - b1) / (m1 - m2), y = m1 * x + b1;
        if (Math.abs(x) <= 8 && Math.abs(y) <= 8) s += '<circle cx="' + g.X(x) + '" cy="' + g.Y(y) + '" r="6" class="f-gold s-ink"/>';
        msg = "Different slopes: the lines cross once. <b>One solution: (" + fmt(x) + ", " + fmt(y) + ")</b>" + (Math.abs(x) > 8 || Math.abs(y) > 8 ? " — off this grid." : ".") + "<br>Check: it makes both equations true.";
      }
      f.svg.innerHTML = s;
      ["m1", "b1", "m2", "b2"].forEach(function (k) { f.show(k, fmt(f.v(k))); });
      f.out.innerHTML = '<span style="color:#1D4ED8">' + eqs(m1, b1) + '</span><br><span style="color:#C0392B">' + eqs(m2, b2) + "</span><br>" + msg;
    });
  };

  /* G.5 — parallel lines cut by a transversal */
  W.transversal = function (box) {
    var f = frame(box, 400, 300, slider("a", "Angle 1", 25, 155, 1, 60) +
      '<label>Highlight</label><select id="pair"><option value="">— none —</option><option value="corr">Corresponding (1 & 5)</option><option value="ai">Alternate interior (3 & 6)</option><option value="ae">Alternate exterior (1 & 8)</option><option value="ssi">Same-side interior (3 & 5)</option><option value="vert">Vertical (1 & 4)</option><option value="lin">Linear pair (1 & 2)</option></select>');
    f.on(function () {
      var A = f.v("a"), rad = A * Math.PI / 180, pair = f.sel("pair").value;
      var y1 = 100, y2 = 210, cx1 = 200 - (y1 - 155) / Math.tan(rad) * -1, k = 1 / Math.tan(rad);
      var P1 = [200 + (155 - y1) * k, y1], P2 = [200 + (155 - y2) * k, y2];
      var s = '<line class="s-ink" stroke-width="2.5" x1="20" y1="' + y1 + '" x2="380" y2="' + y1 + '"/><line class="s-ink" stroke-width="2.5" x1="20" y1="' + y2 + '" x2="380" y2="' + y2 + '"/>';
      s += '<text x="372" y="' + (y1 - 8) + '" font-size="13" font-style="italic" text-anchor="end">ℓ</text><text x="372" y="' + (y2 - 8) + '" font-size="13" font-style="italic" text-anchor="end">m</text>';
      var dx = Math.cos(rad), dy = -Math.sin(rad), L = 150;
      s += '<line class="s-blue" stroke-width="2.5" x1="' + (P1[0] + dx * L) + '" y1="' + (P1[1] + dy * L) + '" x2="' + (P2[0] - dx * L) + '" y2="' + (P2[1] - dy * L) + '"/>';
      // angle label positions: at each intersection, 4 angles: 1 upper-right(between +x and transversal up), 2 upper-left, 3 lower-left, 4 lower-right ... use standard numbering
      var hi = { corr: [1, 5], ai: [3, 6], ae: [1, 8], ssi: [3, 5], vert: [1, 4], lin: [1, 2] }[pair] || [];
      var B = 180 - A;
      // numbering: top intersection 1 (upper right),2 (upper left),3 (lower left),4 (lower right); bottom 5..8 same layout
      // upper-right sits between +x axis and the transversal's upward ray (angle A); upper-left = 180−A, lower-left = A, lower-right = 180−A
      // re-number so 3 & 6 are alternate interior: top: 1 UR, 2 UL, 3 LR? Keep the convention used in the note below.
      var layout = [["UR", A], ["UL", B], ["LL", A], ["LR", B]];
      // conventional names used in the dropdown: top 1=UR,2=UL,3=LR,4=LL ; bottom 5=UR,6=UL,7=LR,8=LL
      var names = { 1: ["UR", 0], 2: ["UL", 0], 3: ["LR", 0], 4: ["LL", 0], 5: ["UR", 1], 6: ["UL", 1], 7: ["LR", 1], 8: ["LL", 1] };
      function size(pos) { return (pos === "UR" || pos === "LL") ? A : B; }
      function mid(pos) { // direction angle of bisector in svg coords
        var up = -A, upRay = A; // degrees from +x, counterclockwise math
        var map = { UR: A / 2, UL: A + B / 2, LL: 180 + A / 2, LR: 180 + A + B / 2 };
        return map[pos] * Math.PI / 180;
      }
      for (var n = 1; n <= 8; n++) {
        var pos = names[n][0], P = names[n][1] ? P2 : P1, t = mid(pos), on = hi.indexOf(n) >= 0;
        var r = 44, lx = P[0] + Math.cos(t) * r, ly = P[1] - Math.sin(t) * r;
        // arc
        var start = { UR: 0, UL: A, LL: 180, LR: 180 + A }[pos] * Math.PI / 180, end = start + size(pos) * Math.PI / 180, rr = 18;
        if (on) s += '<path class="s-gold f-none" stroke-width="3" d="M' + (P[0] + rr * Math.cos(start)) + "," + (P[1] - rr * Math.sin(start)) + " A" + rr + "," + rr + " 0 0 0 " + (P[0] + rr * Math.cos(end)) + "," + (P[1] - rr * Math.sin(end)) + '"/>';
        s += '<text x="' + lx + '" y="' + (ly + 4) + '" font-size="12" text-anchor="middle" font-weight="700" class="' + (on ? "t-gold" : "t-muted") + '" paint-order="stroke" stroke="#fff" stroke-width="3">' + n + ": " + size(pos) + "°</text>";
      }
      f.svg.innerHTML = s; f.show("a", A + "°");
      var info = { corr: "Corresponding angles are in the same spot at each crossing. They are <b>congruent</b>.", ai: "Alternate interior angles are between the parallel lines, on opposite sides of the transversal. They are <b>congruent</b>.",
        ae: "Alternate exterior angles are outside the parallel lines, on opposite sides. They are <b>congruent</b>.", ssi: "Same-side interior angles are between the parallel lines, on the same side. They are <b>supplementary</b> (add to 180°).",
        vert: "Vertical angles are across from each other at one crossing. They are <b>congruent</b>.", lin: "A linear pair sits on a straight line. The angles are <b>supplementary</b>." }[pair];
      f.out.innerHTML = "Only two sizes ever appear: <b>" + A + "°</b> and <b>" + B + "°</b>, and " + A + " + " + B + " = 180." + (info ? "<br>" + info : "<br>Pick a pair to highlight it.");
    });
  };

  /* G.6 — squares on the sides */
  W.pyth = function (box) {
    var f = frame(box, 400, 400, slider("a", "Leg a", 1, 6, 1, 3) + slider("b", "Leg b", 1, 6, 1, 4));
    f.on(function () {
      var a = f.v("a"), b = f.v("b"), c2 = a * a + b * b, c = Math.sqrt(c2), u = 300 / (a + b + Math.max(a, b) + 1);
      u = Math.min(u, 34);
      var C = [130 + u * Math.max(0, 0), 250]; // right-angle vertex
      C = [70 + u * a, 70 + u * b + 0]; // leave room left for square on b and below for square on a
      C = [u * b + 30, 30 + u * b];
      var Ax = C[0] + u * a, Ay = C[1], Bx = C[0], By = C[1] - u * b; // A on x-leg (length a), B on y-leg (length b)
      // keep inside: shift
      var offx = 400 / 2 - (C[0] + u * a / 2), offy = 210 - C[1];
      function P(x, y) { return (x + offx).toFixed(1) + "," + (y + offy).toFixed(1); }
      var s = "";
      s += '<polygon class="s-gold f-goldsoft" stroke-width="2" points="' + P(C[0], C[1]) + " " + P(Ax, Ay) + " " + P(Ax, Ay + u * a) + " " + P(C[0], C[1] + u * a) + '"/>'; // square on a (below)
      s += '<polygon class="s-green f-greensoft" stroke-width="2" points="' + P(C[0], C[1]) + " " + P(Bx, By) + " " + P(Bx - u * b, By) + " " + P(C[0] - u * b, C[1]) + '"/>'; // square on b (left)
      var vx = Ax - Bx, vy = Ay - By, nx = vy, ny = -vx; // outward normal (up-right)
      s += '<polygon class="s-blue f-soft" stroke-width="2" points="' + P(Bx, By) + " " + P(Ax, Ay) + " " + P(Ax + nx, Ay + ny) + " " + P(Bx + nx, By + ny) + '"/>';
      s += '<polygon class="s-ink f-white" stroke-width="2.5" points="' + P(C[0], C[1]) + " " + P(Ax, Ay) + " " + P(Bx, By) + '"/>';
      s += '<path class="s-ink f-none" stroke-width="1.5" d="M' + P(C[0] + 9, C[1]) + " L" + P(C[0] + 9, C[1] - 9) + " L" + P(C[0], C[1] - 9) + '"/>';
      function T(x, y, t, c) { s += '<text x="' + (x + offx) + '" y="' + (y + offy) + '" font-size="14" font-weight="700" text-anchor="middle" class="' + c + '">' + t + "</text>"; }
      T(C[0] + u * a / 2, C[1] + u * a / 2 + 5, a * a, "t-gold"); T(C[0] - u * b / 2, C[1] - u * b / 2 + 5, b * b, "t-green");
      T((Bx + Ax) / 2 + nx / 2, (By + Ay) / 2 + ny / 2 + 5, Number.isInteger(c) ? c2 : c2, "t-blue");
      f.svg.innerHTML = s; f.show("a", a); f.show("b", b);
      f.out.innerHTML = '<span style="color:#8A6100">a² = ' + a * a + '</span> + <span style="color:#15803D">b² = ' + b * b + '</span> = <span style="color:#1D4ED8"><b>c² = ' + c2 + "</b></span><br>c = √" + c2 + (Number.isInteger(c) ? " = <b>" + c + "</b>" : " ≈ <b>" + c.toFixed(2) + "</b>") +
        "<br>The two smaller squares together have the same area as the big square.";
    });
  };

  /* G.8 — distance between two points */
  W.distance = function (box) {
    var f = frame(box, 320, 320, "", "Drag the blue and red points. They snap to whole-number coordinates.");
    var pts = [[-3, -2], [3, 2]];
    var g = grid({ x0: -6, x1: 6, y0: -6, y1: 6, W: 320, H: 320 });
    function draw() {
      var A = pts[0], B = pts[1], dx = Math.abs(B[0] - A[0]), dy = Math.abs(B[1] - A[1]), d2 = dx * dx + dy * dy, d = Math.sqrt(d2);
      var s = g.s + '<line class="s-gold" stroke-width="2.5" stroke-dasharray="6 4" x1="' + g.X(A[0]) + '" y1="' + g.Y(A[1]) + '" x2="' + g.X(B[0]) + '" y2="' + g.Y(A[1]) + '"/>' +
        '<line class="s-gold" stroke-width="2.5" stroke-dasharray="6 4" x1="' + g.X(B[0]) + '" y1="' + g.Y(A[1]) + '" x2="' + g.X(B[0]) + '" y2="' + g.Y(B[1]) + '"/>' +
        '<line class="s-ink" stroke-width="3" x1="' + g.X(A[0]) + '" y1="' + g.Y(A[1]) + '" x2="' + g.X(B[0]) + '" y2="' + g.Y(B[1]) + '"/>';
      if (dx) s += '<text x="' + g.X((A[0] + B[0]) / 2) + '" y="' + (g.Y(A[1]) + (B[1] > A[1] ? 16 : -7)) + '" font-size="13" font-weight="700" text-anchor="middle" class="t-gold" paint-order="stroke" stroke="#fff" stroke-width="3">' + dx + "</text>";
      if (dy) s += '<text x="' + (g.X(B[0]) + (B[0] > A[0] ? 12 : -12)) + '" y="' + g.Y((A[1] + B[1]) / 2) + '" font-size="13" font-weight="700" text-anchor="middle" class="t-gold" paint-order="stroke" stroke="#fff" stroke-width="3">' + dy + "</text>";
      s += '<circle data-h="0" cx="' + g.X(A[0]) + '" cy="' + g.Y(A[1]) + '" r="9" class="f-blue s-white" style="cursor:grab"/><circle data-h="1" cx="' + g.X(B[0]) + '" cy="' + g.Y(B[1]) + '" r="9" class="f-red" style="cursor:grab"/>';
      f.svg.innerHTML = s;
      f.out.innerHTML = '<span style="color:#1D4ED8">A(' + neg(A[0]) + ", " + neg(A[1]) + ')</span>, <span style="color:#C0392B">B(' + neg(B[0]) + ", " + neg(B[1]) + ")</span><br>Legs: " + dx + " and " + dy +
        "<br>" + dx + "² + " + dy + "² = " + d2 + "<br>AB = √" + d2 + (Number.isInteger(d) ? " = <b>" + d + "</b>" : " ≈ <b>" + d.toFixed(1) + "</b>");
    }
    drag(f.svg, null, function (i, p) {
      var x = Math.round((p.x - g.X(0)) / g.ux), y = Math.round((g.Y(0) - p.y) / g.uy);
      x = Math.max(-6, Math.min(6, x)); y = Math.max(-6, Math.min(6, y));
      if (pts[i][0] !== x || pts[i][1] !== y) { pts[i] = [x, y]; draw(); }
    });
    draw();
  };

  /* G.3 — coordinate rules */
  W.transform = function (box) {
    var f = frame(box, 320, 320, '<label>Transformation</label><select id="t">' +
      '<option value="tr">Translation (x + 3, y − 2)</option><option value="rx">Reflect across the x-axis</option><option value="ry">Reflect across the y-axis</option>' +
      '<option value="r90">Rotate 90° counterclockwise</option><option value="r270">Rotate 90° clockwise</option><option value="r180">Rotate 180°</option><option value="d2">Dilate by 2 (origin)</option><option value="dh">Dilate by ½ (origin)</option></select>');
    var P = [[1, 1], [4, 1], [1, 3]], L = ["A", "B", "C"];
    var R = { tr: ["(x, y) → (x + 3, y − 2)", function (p) { return [p[0] + 3, p[1] - 2]; }], rx: ["(x, y) → (x, −y)", function (p) { return [p[0], -p[1]]; }],
      ry: ["(x, y) → (−x, y)", function (p) { return [-p[0], p[1]]; }], r90: ["(x, y) → (−y, x)", function (p) { return [-p[1], p[0]]; }],
      r270: ["(x, y) → (y, −x)", function (p) { return [p[1], -p[0]]; }], r180: ["(x, y) → (−x, −y)", function (p) { return [-p[0], -p[1]]; }],
      d2: ["(x, y) → (2x, 2y)", function (p) { return [2 * p[0], 2 * p[1]]; }], dh: ["(x, y) → (½x, ½y)", function (p) { return [p[0] / 2, p[1] / 2]; }] };
    f.on(function () {
      var k = f.sel("t").value, rule = R[k], Q = P.map(rule[1]), g = grid({ x0: -8, x1: 8, y0: -8, y1: 8, W: 320, H: 320, lab: 2 });
      function poly(pts, cls) { return '<polygon class="' + cls + '" stroke-width="2.2" fill-opacity=".7" points="' + pts.map(function (p) { return g.X(p[0]) + "," + g.Y(p[1]); }).join(" ") + '"/>'; }
      var s = g.s + poly(P, "s-blue f-soft") + poly(Q, "s-red f-redsoft");
      P.forEach(function (p, i) { s += '<text x="' + (g.X(p[0]) - 9) + '" y="' + (g.Y(p[1]) + 4) + '" font-size="12" font-weight="700" class="t-blue">' + L[i] + "</text>"; });
      Q.forEach(function (p, i) { s += '<text x="' + (g.X(p[0]) + 5) + '" y="' + (g.Y(p[1]) - 4) + '" font-size="12" font-weight="700" class="t-red">' + L[i] + "′</text>"; });
      f.svg.innerHTML = s;
      var rigid = k[0] !== "d";
      f.out.innerHTML = "<b>" + rule[0] + "</b><br>" + P.map(function (p, i) { return L[i] + "(" + fmt(p[0]) + ", " + fmt(p[1]) + ") → " + L[i] + "′(" + fmt(Q[i][0]) + ", " + fmt(Q[i][1]) + ")"; }).join("<br>") +
        "<br>" + (rigid ? "Rigid: the image is <b>congruent</b> (same size and shape)." : "Not rigid: the image is <b>similar</b> (same shape, different size).");
    });
  };

  /* G.4 — dilation slider */
  W.dilate = function (box) {
    var f = frame(box, 340, 259, slider("k", "Scale factor k", 0.5, 3, 0.5, 2));
    var P = [[0, 0], [3, 0], [0, 2]];
    f.on(function () {
      var k = f.v("k"), g = grid({ x0: -1, x1: 10, y0: -1, y1: 7, W: 340, H: 259, lab: 1 });
      function poly(pts, cls) { return '<polygon class="' + cls + '" stroke-width="2.2" fill-opacity=".6" points="' + pts.map(function (p) { return g.X(p[0] + .0) + "," + g.Y(p[1]); }).join(" ") + '"/>'; }
      var Q = P.map(function (p) { return [p[0] * k, p[1] * k]; });
      f.svg.innerHTML = g.s + poly(Q, "s-red f-redsoft") + poly(P, "s-blue f-soft");
      f.show("k", k);
      f.out.innerHTML = "Blue legs: 3 and 2<br>Red legs: <b>" + fmt(3 * k) + "</b> and <b>" + fmt(2 * k) + "</b> (each × " + k + ")<br>Angles stay the same — the triangles are <b>similar</b>.<br>Area: 3 → <b>" + fmt(3 * k * k) + "</b> (× k² = " + fmt(k * k) + ")" +
        (k === 1 ? "<br>k = 1: the image is congruent." : k < 1 ? "<br>k &lt; 1: the image shrinks." : "<br>k &gt; 1: the image grows.");
    });
  };

  /* G.9 — volume */
  W.volume = function (box) {
    var f = frame(box, 420, 230, slider("r", "Radius r", 1, 6, 1, 3) + slider("h", "Height h (cylinder & cone)", 1, 12, 1, 6),
      "Set h = 2r to see the classic result: cone : sphere : cylinder = 1 : 2 : 3.");
    f.on(function () {
      var r = f.v("r"), h = f.v("h"), cyl = r * r * h, cone = cyl / 3, sph = 4 / 3 * r * r * r, mx = Math.max(cyl, sph), sc = 150 / mx;
      function piStr(v) { var w = Math.round(v * 3) / 3, whole = Math.floor(w), fr = Math.round((w - whole) * 3); return (fr ? (whole ? whole + " " : "") + fr + "/3" : whole) + "π"; }
      var bars = [["Cylinder", cyl, "s-blue f-soft"], ["Cone", cone, "s-gold f-goldsoft"], ["Sphere", sph, "s-green f-greensoft"]], s = "";
      bars.forEach(function (b, i) {
        var x = 40 + i * 130, bh = b[1] * sc;
        s += '<rect x="' + x + '" y="' + (190 - bh) + '" width="90" height="' + bh + '" rx="4" class="' + b[2] + '" stroke-width="2"/>';
        s += '<text x="' + (x + 45) + '" y="210" font-size="13" font-weight="700" text-anchor="middle">' + b[0] + "</text>";
        s += '<text x="' + (x + 45) + '" y="' + (184 - bh) + '" font-size="13" font-weight="700" text-anchor="middle">' + piStr(b[1]) + "</text>";
      });
      f.svg.innerHTML = s; f.show("r", r); f.show("h", h);
      f.out.innerHTML = "Cylinder: πr²h = π·" + r + "²·" + h + " = <b>" + piStr(cyl) + "</b> ≈ " + (cyl * Math.PI).toFixed(1) +
        "<br>Cone: ⅓πr²h = <b>" + piStr(cone) + "</b> ≈ " + (cone * Math.PI).toFixed(1) + "<br>Sphere: ⁴⁄₃πr³ = <b>" + piStr(sph) + "</b> ≈ " + (sph * Math.PI).toFixed(1) +
        "<br>The cone is always ⅓ of the cylinder." + (h === 2 * r ? " With h = 2r the sphere is ⅔ of the cylinder." : "");
    });
  };

  /* SP.2 — fit a line */
  W.bestfit = function (box) {
    var f = frame(box, 340, 300, "", "Data: hours studied vs. quiz score. Drag the two gold handles.");
    var D = [[1, 52], [1.5, 60], [2, 58], [2.5, 66], [3, 64], [3.5, 70], [4, 75], [4.5, 72], [5, 80], [5.5, 84], [6, 82], [6.5, 90]];
    var H = [[0.5, 50], [7, 92]];
    var g = grid({ x0: 0, x1: 8, y0: 40, y1: 100, W: 340, H: 300, m: 30, step: 1 });
    // y gridlines every 10: rebuild grid manually for this scale
    var Xs = function (x) { return 34 + x * 37; }, Ys = function (y) { return 268 - (y - 40) * 4.1; };
    function draw() {
      var s = "";
      for (var x = 0; x <= 8; x++) s += '<line class="s-grid" x1="' + Xs(x) + '" y1="' + Ys(40) + '" x2="' + Xs(x) + '" y2="' + Ys(100) + '"/><text x="' + Xs(x) + '" y="' + (Ys(40) + 14) + '" font-size="10" text-anchor="middle" class="t-muted">' + x + "</text>";
      for (var y = 40; y <= 100; y += 10) s += '<line class="s-grid" x1="' + Xs(0) + '" y1="' + Ys(y) + '" x2="' + Xs(8) + '" y2="' + Ys(y) + '"/><text x="' + (Xs(0) - 5) + '" y="' + (Ys(y) + 3) + '" font-size="10" text-anchor="end" class="t-muted">' + y + "</text>";
      s += '<line class="s-ink" stroke-width="1.5" x1="' + Xs(0) + '" y1="' + Ys(40) + '" x2="' + Xs(8) + '" y2="' + Ys(40) + '"/><line class="s-ink" stroke-width="1.5" x1="' + Xs(0) + '" y1="' + Ys(40) + '" x2="' + Xs(0) + '" y2="' + Ys(100) + '"/>';
      var m = (H[1][1] - H[0][1]) / (H[1][0] - H[0][0]), b = H[0][1] - m * H[0][0], above = 0, below = 0, err = 0;
      D.forEach(function (p) { var e = p[1] - (m * p[0] + b); err += Math.abs(e); if (e > 0.3) above++; else if (e < -0.3) below++;
        s += '<line class="s-muted" stroke-dasharray="2 2" x1="' + Xs(p[0]) + '" y1="' + Ys(p[1]) + '" x2="' + Xs(p[0]) + '" y2="' + Ys(m * p[0] + b) + '"/>'; });
      s += '<line class="s-blue" stroke-width="3" x1="' + Xs(0) + '" y1="' + Ys(b) + '" x2="' + Xs(8) + '" y2="' + Ys(m * 8 + b) + '"/>';
      D.forEach(function (p) { s += '<circle cx="' + Xs(p[0]) + '" cy="' + Ys(p[1]) + '" r="4" class="f-ink"/>'; });
      H.forEach(function (h, i) { s += '<circle data-h="' + i + '" cx="' + Xs(h[0]) + '" cy="' + Ys(h[1]) + '" r="9" class="f-gold s-ink" style="cursor:grab"/>'; });
      f.svg.innerHTML = s;
      f.out.innerHTML = "Your line: <b>y ≈ " + fmt(m) + "x + " + fmt(b) + "</b><br>Points above: " + above + " · below: " + below +
        "<br>Average miss: <b>" + (err / D.length).toFixed(1) + "</b> points<br>" + (Math.abs(above - below) <= 2 && err / D.length < 3.5 ? "Nice fit — the line runs through the middle of the data." : "Try to get about half the points above and half below, with small misses.");
    }
    drag(f.svg, null, function (i, p) {
      var x = (p.x - 34) / 37, y = 40 + (268 - p.y) / 4.1;
      x = Math.max(0, Math.min(8, x)); y = Math.max(40, Math.min(100, y));
      if (Math.abs(x - H[1 - i][0]) < 0.5) return;
      H[i] = [x, y]; draw();
    });
    draw();
  };

  /* SP.4 — two-way table */
  W.twoway = function (box) {
    var f = frame(box, 10, 10, slider("a", "Plays sport & has a pet", 0, 40, 1, 18) + slider("b", "Plays sport & no pet", 0, 40, 1, 12) +
      slider("c", "No sport & has a pet", 0, 40, 1, 8) + slider("d", "No sport & no pet", 0, 40, 1, 22));
    f.svg.style.display = "none";
    var tbl = el('<div class="tw" style="margin-top:4px"></div>'); f.svg.parentNode.insertBefore(tbl, f.svg);
    f.on(function () {
      var a = f.v("a"), b = f.v("b"), c = f.v("c"), d = f.v("d"), r1 = a + b, r2 = c + d, c1 = a + c, c2 = b + d, T = r1 + r2;
      ["a", "b", "c", "d"].forEach(function (k) { f.show(k, f.v(k)); });
      function pc(x, y) { return y ? Math.round(100 * x / y) + "%" : "—"; }
      tbl.innerHTML = '<table class="dtab"><tr><th></th><th>Pet</th><th>No pet</th><th>Total</th></tr><tr><th>Sport</th><td>' + a + "</td><td>" + b + "</td><td><b>" + r1 + "</b></td></tr><tr><th>No sport</th><td>" + c + "</td><td>" + d + "</td><td><b>" + r2 + "</b></td></tr><tr><th>Total</th><td><b>" + c1 + "</b></td><td><b>" + c2 + "</b></td><td><b>" + T + "</b></td></tr></table>";
      var p1 = r1 ? a / r1 : 0, p2 = r2 ? c / r2 : 0;
      f.out.innerHTML = "Of the sport players, <b>" + pc(a, r1) + "</b> have a pet.<br>Of the non-players, <b>" + pc(c, r2) + "</b> have a pet.<br>" +
        (Math.abs(p1 - p2) >= 0.15 ? "The percents are far apart, so there <b>is</b> an association." : "The percents are close, so there is <b>little or no</b> association.");
    });
  };

  document.querySelectorAll(".explore").forEach(function (d) {
    d.addEventListener("toggle", function () {
      var box = d.querySelector(".exb");
      if (d.open && box && !box.dataset.ready) {
        box.dataset.ready = "1";
        var fn = W[box.dataset.ex];
        if (fn) try { fn(box); } catch (e) { box.textContent = "This explorer could not load."; }
      }
    });
  });
})();
