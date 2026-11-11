/* HOMEWORK GRAPH CHOICES (Nov 11, 2026, Mr. Allen: "identify the better graph... would still be multiple choice").
   Draws a small graph inside a homework choice button, from data in homework/choices.js:
     { g: { k: 'xy', r: 5, lines: [[m, b]], v: [x], pts: [[x, y]], seg: [[x1, y1, x2, y2]], poly: [[[x, y], ...]], curve: [[x, y], ...] } }
     { g: { k: 'nl', lo: 2, hi: 11, at: 7, op: '<' } }                 a number line: open or closed circle and a shaded ray
     { g: { k: 'nl', lo: 0, hi: 4, step: 0.5, dots: [[1.7, '√3']] } }  a number line with labeled points
   A choice may also carry t (words shown under the graph) and d (what the sheet says for that choice).
   HWGraph.svg(g) returns the SVG text. Nothing here knows which choice is right. */
(function () {
  "use strict";
  var NAVY = '#1E2D4F', GOLD = '#C98F00', GRID = '#D9DDE6', INK = '#59627A';
  function f(n) { return (Math.round(n * 100) / 100).toString(); }
  function xy(g) {
    var r = g.r || 5, W = 170, pad = 9, s = (W - 2 * pad) / (2 * r), o = W / 2, out = '', i;
    var X = function (x) { return o + x * s; }, Y = function (y) { return o - y * s; };
    for (i = -r; i <= r; i++) out += '<path d="M' + f(X(i)) + ',' + pad + 'V' + (W - pad) + 'M' + pad + ',' + f(Y(i)) + 'H' + (W - pad) + '" stroke="' + GRID + '" stroke-width="' + (i % 5 === 0 ? 1 : .6) + '"/>';
    out += '<path d="M' + pad + ',' + o + 'H' + (W - pad) + 'M' + o + ',' + pad + 'V' + (W - pad) + '" stroke="' + NAVY + '" stroke-width="1.4"/>';
    var stepL = r > 6 ? 2 : 1;
    for (i = -r + 1; i < r; i++) if (i && i % stepL === 0) out += '<text x="' + f(X(i)) + '" y="' + f(o + 8.5) + '" font-size="6.2" text-anchor="middle" fill="' + INK + '">' + (i < 0 ? '−' + (-i) : i) + '</text><text x="' + f(o - 3) + '" y="' + f(Y(i) + 2.2) + '" font-size="6.2" text-anchor="end" fill="' + INK + '">' + (i < 0 ? '−' + (-i) : i) + '</text>';
    out += '<text x="' + (W - pad - 2) + '" y="' + (o - 4) + '" font-size="8" font-style="italic" text-anchor="end" fill="' + NAVY + '">x</text><text x="' + (o + 5) + '" y="' + (pad + 7) + '" font-size="8" font-style="italic" fill="' + NAVY + '">y</text>';
    var clip = 'hwg' + Math.random().toString(36).slice(2, 8);
    out += '<clipPath id="' + clip + '"><rect x="' + pad + '" y="' + pad + '" width="' + (W - 2 * pad) + '" height="' + (W - 2 * pad) + '"/></clipPath><g clip-path="url(#' + clip + ')">';
    (g.poly || []).forEach(function (p, k) { out += '<polygon points="' + p.map(function (q) { return f(X(q[0])) + ',' + f(Y(q[1])); }).join(' ') + '" fill="' + (k ? GOLD : NAVY) + '" fill-opacity="' + (k ? .28 : .14) + '" stroke="' + (k ? GOLD : NAVY) + '" stroke-width="1.6"' + (k ? '' : ' stroke-dasharray="3 2"') + '/>'; });
    (g.lines || []).forEach(function (l, k) { out += '<path d="M' + f(X(-r - 1)) + ',' + f(Y(l[0] * (-r - 1) + l[1])) + 'L' + f(X(r + 1)) + ',' + f(Y(l[0] * (r + 1) + l[1])) + '" stroke="' + (k ? GOLD : NAVY) + '" stroke-width="2.3" fill="none"/>'; });
    (g.v || []).forEach(function (x) { out += '<path d="M' + f(X(x)) + ',0V' + W + '" stroke="' + NAVY + '" stroke-width="2.3"/>'; });
    (g.seg || []).forEach(function (q) { out += '<path d="M' + f(X(q[0])) + ',' + f(Y(q[1])) + 'L' + f(X(q[2])) + ',' + f(Y(q[3])) + '" stroke="' + NAVY + '" stroke-width="2.3"/>'; });
    if (g.curve) out += '<path d="M' + g.curve.map(function (q) { return f(X(q[0])) + ',' + f(Y(q[1])); }).join('L') + '" stroke="' + NAVY + '" stroke-width="2.3" fill="none"/>';
    out += '</g>';
    (g.pts || []).forEach(function (q) { out += '<circle cx="' + f(X(q[0])) + '" cy="' + f(Y(q[1])) + '" r="3.2" fill="' + GOLD + '" stroke="#fff" stroke-width="1"/>'; });
    return '<svg class="hwg xy" viewBox="0 0 ' + W + ' ' + W + '" role="img" aria-hidden="true">' + out + '</svg>';
  }
  function nl(g) {
    var lo = g.lo, hi = g.hi, W = 300, H = 50, pad = 20, s = (W - 2 * pad) / (hi - lo), y = 22, out = '', i, X = function (v) { return pad + (v - lo) * s; };
    out += '<path d="M6,' + y + 'H' + (W - 6) + '" stroke="' + NAVY + '" stroke-width="1.5"/><path d="M6,' + y + 'l6,-4v8zM' + (W - 6) + ',' + y + 'l-6,-4v8z" fill="' + NAVY + '"/>';
    var step = g.step || 1, every = g.every || 1, n = Math.round((hi - lo) / step);
    for (i = 0; i <= n; i++) { var v = lo + i * step, whole = Math.abs(v - Math.round(v)) < 1e-9;
      out += '<path d="M' + f(X(v)) + ',' + (y - (whole ? 5 : 3)) + 'V' + (y + (whole ? 5 : 3)) + '" stroke="' + NAVY + '" stroke-width="' + (whole ? 1.3 : .8) + '"/>';
      if (whole && Math.round(v - lo) % every === 0) out += '<text x="' + f(X(v)) + '" y="' + (y + 18) + '" font-size="10" text-anchor="middle" fill="' + INK + '">' + (v < 0 ? '−' + (-Math.round(v)) : Math.round(v)) + '</text>'; }
    if (g.op) { var right = g.op.charAt(0) === '>', closed = g.op.length > 1, x0 = X(g.at), x1 = right ? W - 8 : 8;
      out += '<path d="M' + f(x0) + ',' + y + 'H' + x1 + '" stroke="' + GOLD + '" stroke-width="5" stroke-linecap="butt"/><path d="M' + x1 + ',' + y + (right ? 'l-9,-6v12z' : 'l9,-6v12z') + '" fill="' + GOLD + '"/>';
      out += '<circle cx="' + f(x0) + '" cy="' + y + '" r="5.5" fill="' + (closed ? GOLD : '#fff') + '" stroke="' + GOLD + '" stroke-width="2.4"/>'; }
    (g.dots || []).forEach(function (d, k) { out += '<circle cx="' + f(X(d[0])) + '" cy="' + y + '" r="4" fill="' + GOLD + '" stroke="#fff" stroke-width="1"/><text x="' + f(X(d[0])) + '" y="' + (y - 9) + '" font-size="10.5" font-weight="700" text-anchor="middle" fill="' + NAVY + '">' + String(d[1]).replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</text>'; });
    return '<svg class="hwg nl" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-hidden="true">' + out + '</svg>';
  }
  window.HWGraph = { svg: function (g) { try { return g.k === 'nl' ? nl(g) : xy(g); } catch (e) { return ''; } } };
})();
