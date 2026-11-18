/* Skill Builders CALCULATOR (Nov 18, 2026, Zach: "embed a basic calculator on the screen for students to use").
   A "Calculator" button sits at the bottom right of every Skill Builder page (lessons, practice and the video player).
   It opens a small + − × ÷ calculator that can be dragged and closed. Times and divide happen before plus and minus,
   like on a real calculator. Keys work only while the calculator itself has focus, so typing in answer boxes is never
   changed. No eval: the math is done by a tiny parser. Off on printed copies (?paper=1). */
(function () {
  'use strict';
  if (/[?&]paper=1/.test(location.search) || window.SBCalc) return;
  var css = '#sbc-btn{position:fixed;right:14px;bottom:14px;z-index:9500;display:flex;align-items:center;gap:6px;background:#1E2D4F;color:#fff;border:2px solid #FFC107;border-radius:999px;padding:9px 16px;font:800 15px Inter,system-ui,sans-serif;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.3)}' +
    '#sbc-btn:hover,#sbc-btn:focus-visible{background:#FFC107;color:#1E2D4F}' +
    '#sbc{position:fixed;right:14px;bottom:66px;z-index:9501;width:244px;background:#1E2D4F;border-radius:18px;padding:10px;box-shadow:0 12px 34px rgba(0,0,0,.45);font-family:Inter,system-ui,sans-serif;touch-action:none}' +
    '#sbc[hidden]{display:none}#sbc .bar{display:flex;align-items:center;justify-content:space-between;color:#FFC107;font:800 13px Inter,sans-serif;letter-spacing:.06em;cursor:move;padding:0 2px 8px;user-select:none}' +
    '#sbc .bar button{background:none;border:0;color:#fff;font:800 18px Inter,sans-serif;cursor:pointer;padding:0 4px}' +
    '#sbc .scr{background:#F7F7F4;border-radius:12px;padding:8px 10px;text-align:right;margin-bottom:8px}' +
    '#sbc .ex{font:600 13px "JetBrains Mono",monospace;color:#5B6475;min-height:18px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;direction:rtl}' +
    '#sbc .out{font:800 26px "JetBrains Mono",monospace;color:#1E2D4F;overflow:hidden;white-space:nowrap}' +
    '#sbc .keys{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}' +
    '#sbc .keys button{height:44px;border:0;border-radius:10px;background:#2d3f6b;color:#fff;font:800 19px "JetBrains Mono",monospace;cursor:pointer}' +
    '#sbc .keys button:active{transform:scale(.95)}#sbc .keys .op{background:#3d5590;color:#FFC107}#sbc .keys .eq{background:#FFC107;color:#1E2D4F}#sbc .keys .fn{background:#46506d;font-size:15px}' +
    '@media (max-width:560px){#sbc-btn{padding:8px 12px;font-size:14px}}@media print{#sbc,#sbc-btn{display:none!important}}';
  var KEYS = [['C', 'fn'], ['⌫', 'fn'], ['±', 'fn'], ['÷', 'op'], ['7'], ['8'], ['9'], ['×', 'op'], ['4'], ['5'], ['6'], ['−', 'op'], ['1'], ['2'], ['3'], ['+', 'op'], ['0'], ['.'], ['=', 'eq', 2]];
  var expr = '', last = '', justEq = false, box, out, ex;

  /* ---- math: numbers and + − × ÷ with the usual order ---- */
  function calc(s) {
    var t = s.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').match(/(\d+\.?\d*|\.\d+)|[-+*/]/g) || [];
    var nums = [], ops = [], i = 0, sign = 1;
    function num() { var n = 1; while (t[i] === '-' || t[i] === '+') { if (t[i] === '-') n = -n; i++; } var v = parseFloat(t[i++]); return isNaN(v) ? NaN : n * v; }
    nums.push(num());
    while (i < t.length) { var o = t[i++]; var v = num(); if (o === '*' || o === '/') { var a = nums.pop(); nums.push(o === '*' ? a * v : a / v); } else { ops.push(o); nums.push(v); } }
    var r = nums[0]; for (var j = 0; j < ops.length; j++) r = ops[j] === '+' ? r + nums[j + 1] : r - nums[j + 1];
    return r;
  }
  function show(v) {
    if (!isFinite(v)) return 'Can’t divide by 0';
    var r = Math.round(v * 1e10) / 1e10, s = String(r);
    if (s.length > 12) s = r.toPrecision(10).replace(/\.?0+(e|$)/, '$1');
    return s.replace(/^-/, '−');
  }
  function paint() { ex.textContent = last || ' '; out.textContent = expr || '0'; }
  function press(k) {
    if (justEq && (/^[\d.]$/.test(k))) { expr = ''; last = ''; }
    justEq = false;
    if (k === 'C') { expr = ''; last = ''; }
    else if (k === '⌫') expr = expr.slice(0, -1);
    else if (k === '=') { if (!expr) return; var v = calc(expr); last = expr + ' ='; expr = show(v); if (/[A-Za-z]/.test(expr)) { last = expr; expr = ''; } else justEq = true; }
    else if (k === '±') { var m = expr.match(/(.*?)(−?)(\d*\.?\d*)$/); if (m && m[3]) expr = m[1] + (m[2] ? '' : '−') + m[3]; else expr += '−'; }
    else if (/[+−×÷]/.test(k)) { if (!expr && k !== '−') expr = '0'; if (/[+×÷]$/.test(expr) || (/−$/.test(expr) && k !== '−')) expr = expr.slice(0, -1); expr += k; }
    else if (k === '.') { var tail = expr.split(/[+−×÷]/).pop(); if (tail.indexOf('.') < 0) expr += tail ? '.' : '0.'; }
    else expr += k;
    if (expr.length > 40) expr = expr.slice(0, 40);
    paint();
  }
  function build() {
    if (box) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var b = document.createElement('button'); b.id = 'sbc-btn'; b.type = 'button'; b.setAttribute('aria-expanded', 'false');
    b.innerHTML = '<span aria-hidden="true">🧮</span> Calculator';
    box = document.createElement('div'); box.id = 'sbc'; box.hidden = true; box.tabIndex = -1; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Calculator');
    box.innerHTML = '<div class="bar"><span>CALCULATOR</span><button type="button" aria-label="Close the calculator">✕</button></div>' +
      '<div class="scr" aria-live="polite"><div class="ex"></div><div class="out">0</div></div><div class="keys">' +
      KEYS.map(function (k) { return '<button type="button" class="' + (k[1] || '') + '"' + (k[2] ? ' style="grid-column:span 2"' : '') + ' data-k="' + k[0] + '">' + k[0] + '</button>'; }).join('') + '</div>';
    document.documentElement.appendChild(b); document.documentElement.appendChild(box);
    ex = box.querySelector('.ex'); out = box.querySelector('.out');
    function toggle(on) { box.hidden = !on; b.setAttribute('aria-expanded', String(on)); if (on) box.focus(); }
    b.addEventListener('click', function () { toggle(box.hidden); });
    box.querySelector('.bar button').addEventListener('click', function () { toggle(false); b.focus(); });
    box.querySelector('.keys').addEventListener('click', function (e) { var k = e.target.closest('button'); if (k) press(k.dataset.k); });
    box.addEventListener('keydown', function (e) {
      var m = { '*': '×', 'x': '×', '/': '÷', '-': '−', '+': '+', 'Enter': '=', '=': '=', 'Backspace': '⌫', 'Escape': 'C', 'Delete': 'C', '.': '.' }, k = /^\d$/.test(e.key) ? e.key : m[e.key];
      if (!k) return; e.preventDefault(); e.stopPropagation(); press(k);
    });
    // drag by the title bar
    var bar = box.querySelector('.bar'), sx, sy, ox, oy;
    bar.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; var r = box.getBoundingClientRect(); sx = e.clientX; sy = e.clientY; ox = r.left; oy = r.top; bar.setPointerCapture(e.pointerId); });
    bar.addEventListener('pointermove', function (e) { if (sx == null) return; var x = Math.max(0, Math.min(innerWidth - box.offsetWidth, ox + e.clientX - sx)), y = Math.max(0, Math.min(innerHeight - box.offsetHeight, oy + e.clientY - sy)); box.style.left = x + 'px'; box.style.top = y + 'px'; box.style.right = 'auto'; box.style.bottom = 'auto'; });
    bar.addEventListener('pointerup', function () { sx = null; });
    paint();
  }
  window.SBCalc = { open: function () { build(); var b = document.getElementById('sbc-btn'); if (box.hidden) b.click(); }, calc: calc, press: function (k) { build(); press(k); return out.textContent; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
