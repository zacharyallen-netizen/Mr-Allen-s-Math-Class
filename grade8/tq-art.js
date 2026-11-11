/* TRANSFORMATION QUEST ART (Nov 11, 2026, Mr. Allen: "add tessellation art").
   Original tessellations drawn here with math, the same idea the game teaches: ONE tile, repeated by slides
   (translations), with no gaps and no overlaps.
   - A banner under the title: plain squares on the left slowly bend into interlocking tiles on the right.
     Every shared edge is one curve used by both neighbors, so the tiles always fit.
   - A very faint wall of the same interlocking tile behind the whole page (in place of the star dots).
   - When a puzzle is solved, a wave of color runs across the banner (and sparks/sounds if arcade-fx.js is loaded).
   The tile shapes are this file's own curves (abstract wave-and-notch tiles). No artist's work is copied.
   Nothing here touches the puzzles, the checking or the scores. Reduced motion: no wave. */
(function () {
  "use strict";
  var RM = false; try { RM = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  function f(n) { return (Math.round(n * 10) / 10).toString(); }
  /* one bent edge from (x1,y1) to (x2,y2): a wave with a hooked notch; amp 0 = straight line. dir -1 draws it backward. */
  function edge(x1, y1, x2, y2, amp, back) {
    var dx = x2 - x1, dy = y2 - y1, nx = -dy, ny = dx;                 // normal (same length as the edge)
    var P = function (t, a) { return [x1 + dx * t + nx * a * amp, y1 + dy * t + ny * a * amp]; };
    var pts = [P(0, 0), P(.18, .0), P(.30, -.34), P(.44, -.30), P(.40, .02), P(.56, .30), P(.72, .36), P(.78, .0), P(1, 0)];
    if (back) pts.reverse();
    var d = '';
    for (var i = 1; i < pts.length; i += 2) { var c = pts[i], e = pts[Math.min(i + 1, pts.length - 1)]; d += ' Q' + f(c[0]) + ',' + f(c[1]) + ' ' + f(e[0]) + ',' + f(e[1]); }
    return d;
  }
  /* a tile whose four edges have their own bend amounts (each shared with a neighbor) */
  function tile(x, y, s, aTop, aRight, aBottom, aLeft) {
    return 'M' + f(x) + ',' + f(y) + edge(x, y, x + s, y, aTop) + edge(x + s, y, x + s, y + s, aRight) + edge(x, y + s, x + s, y + s, aBottom, true) + edge(x, y, x, y + s, aLeft, true) + 'Z';
  }
  var COLS = ['#14b8a6', '#d4a437', '#1e3a5f', '#f7f0e3'];

  function banner() {
    var header = document.querySelector('.wrap header'); if (!header || document.getElementById('tq-banner')) return;
    var W = 1200, s = 40, rows = 2, cols = W / s, H = rows * s, svg = '<svg id="tq-banner" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true">';
    var amp = function (xmid) { var t = Math.max(0, Math.min(1, (xmid / W - 0.08) / 0.72)); return t * t * (3 - 2 * t); };   // 0 at the left, 1 at the right (smooth)
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      var x = c * s, y = r * s;
      var d = tile(x, y, s, r === 0 ? 0 : amp(x + s / 2), c === cols - 1 ? 0 : amp(x + s), r === rows - 1 ? 0 : amp(x + s / 2), c === 0 ? 0 : amp(x));
      svg += '<path class="tq-t" data-c="' + c + '" d="' + d + '" fill="' + ((r + c) % 2 ? COLS[0] : COLS[1]) + '" fill-opacity="' + ((r + c) % 2 ? '.50' : '.42') + '" stroke="rgba(247,240,227,.55)" stroke-width="1.2" stroke-linejoin="round"/>';
    }
    svg += '</svg>';
    var wrap = document.createElement('div'); wrap.className = 'tq-banner'; wrap.innerHTML = svg + '<span>One tile, slid again and again: a tessellation.</span>';
    header.parentNode.insertBefore(wrap, header.nextSibling);
  }
  function wall() {
    if (document.getElementById('tq-wall')) return; var s = 64;
    var d1 = tile(0, 0, s, 1, 1, 1, 1), d2 = tile(s, 0, s, 1, 1, 1, 1), d3 = tile(0, s, s, 1, 1, 1, 1), d4 = tile(s, s, s, 1, 1, 1, 1);
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + (2 * s) + '" height="' + (2 * s) + '" viewBox="0 0 ' + (2 * s) + ' ' + (2 * s) + '">' +
      '<g stroke="#f7f0e3" stroke-opacity=".5" stroke-width="1" stroke-linejoin="round"><path d="' + d1 + '" fill="#14b8a6" fill-opacity=".55"/><path d="' + d2 + '" fill="#d4a437" fill-opacity=".45"/><path d="' + d3 + '" fill="#d4a437" fill-opacity=".45"/><path d="' + d4 + '" fill="#14b8a6" fill-opacity=".55"/></g></svg>';
    var el = document.createElement('div'); el.id = 'tq-wall'; el.setAttribute('aria-hidden', 'true');
    el.style.backgroundImage = 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
    document.body.insertBefore(el, document.body.firstChild);
  }
  function wave() {
    var ts = document.querySelectorAll('#tq-banner .tq-t'); if (!ts.length) return;
    if (!RM) [].forEach.call(ts, function (t) { var c = +t.getAttribute('data-c'), col = COLS[(c + Math.floor(Math.random() * 2)) % 2 ? 3 : 1];
      try { t.animate([{ fillOpacity: t.getAttribute('fill-opacity') }, { fill: col, fillOpacity: 1, offset: .4 }, { fillOpacity: t.getAttribute('fill-opacity') }], { duration: 700, delay: c * 28, easing: 'ease-out' }); } catch (e) {} });
    try { if (window.AFX) { var b = document.querySelector('.tq-banner').getBoundingClientRect(); AFX.sfx.power(); AFX.confetti(b.left + b.width / 2, b.top + b.height / 2, { count: 70, colors: ['#14b8a6', '#d4a437', '#f7f0e3', '#4ade80'] }); } } catch (e) {}
  }
  var css = document.createElement('style');
  css.textContent =
    '.tq-banner{position:relative;margin:10px 0 14px;border-radius:12px;overflow:hidden;border:1px solid rgba(212,164,55,.45);background:rgba(4,9,16,.55);height:64px}' +
    '.tq-banner svg{display:block;width:100%;height:100%}' +
    '.tq-banner span{position:absolute;left:12px;bottom:6px;font:600 12px "DM Sans",system-ui,sans-serif;letter-spacing:.04em;color:#f7f0e3;text-shadow:0 1px 3px #000,0 0 8px #000;pointer-events:none}' +
    '#tq-wall{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.07;background-size:128px 128px}' +
    'body::before{display:none!important}.wrap{position:relative;z-index:1}' +
    '@media (max-width:640px){.tq-banner{height:48px}.tq-banner span{font-size:11px}}@media print{.tq-banner,#tq-wall{display:none}}';
  document.head.appendChild(css);
  function init() {
    banner(); wall();
    /* a solved puzzle sets class "solved" on the shape: watch for it (no change to the game's own code) */
    var grid = document.getElementById('grid'), seen = false;
    if (grid && window.MutationObserver) new MutationObserver(function () { var s = !!grid.querySelector('.solved'); if (s && !seen) wave(); seen = s; }).observe(grid, { subtree: true, attributes: true, attributeFilter: ['class'], childList: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.TQArt = { wave: wave };
})();
