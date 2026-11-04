/* ==========================================================================
   Math in Financial Literacy — shared engine (fl.js)
   - exact money math in cents (integers; BigInt for powers)
   - SVG graph helper
   - question cards: numeric entry, multiple choice, select all, find the error
   - lesson pages: tutorial steps + assignment + completion screen + print report
   Nothing here talks to a server. The only storage is the student's name
   (localStorage 'fluencyLabStudentName', shared with the rest of the site)
   and best game scores.
   ========================================================================== */
(function () {
  'use strict';
  var FL = window.FL = {};
  var NAME_KEY = 'fluencyLabStudentName';

  /* ---------------- storage (never throws) ---------------- */
  FL.store = function (k, v) {
    try {
      if (v === undefined) return localStorage.getItem(k) || '';
      localStorage.setItem(k, v);
    } catch (e) { /* private mode or blocked: fine */ }
    return '';
  };

  /* ---------------- exact numbers ---------------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }

  // Parse what a student typed into an exact fraction {n, d}. Returns null if not a number.
  // Accepts $1,500  1500  1500.00  -3  −3  12%  52 weeks  3/4  .5
  FL.parse = function (s) {
    if (s == null) return null;
    s = String(s).trim().replace(/[−–—]/g, '-')
      .replace(/^about\s+/i, '').replace(/[$,\s]/g, '').replace(/(%|[a-z]+\.?)+$/i, '');
    if (s.charAt(0) === '+') s = s.slice(1);
    var m;
    if ((m = /^(-?)(\d+)\/(\d+)$/.exec(s))) {
      if (+m[3] === 0) return null;
      return red((m[1] ? -1 : 1) * +m[2], +m[3]);
    }
    if (!/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return null;
    var neg = s.charAt(0) === '-'; if (neg) s = s.slice(1);
    var parts = s.split('.'), whole = parts[0] || '0', frac = (parts[1] || '').replace(/0+$/, '');
    if (frac.length > 8) frac = frac.slice(0, 8);
    var d = Math.pow(10, frac.length), n = (+whole) * d + (+(frac || 0));
    return red(neg ? -n : n, d);
  };
  function red(n, d) { var g = gcd(n, d); return { n: n / g, d: d / g }; }
  FL.eq = function (a, b) { return a && b && a.n * b.d === b.n * a.d; };
  FL.cmp = function (a, b) { var x = a.n * b.d, y = b.n * a.d; return x < y ? -1 : x > y ? 1 : 0; };
  FL.val = function (a) { return a.n / a.d; };

  /* ---------------- money (cents) ---------------- */
  // round(n/d) to nearest integer, halves away from zero, integers only
  FL.rdiv = function (n, d) {
    var neg = (n < 0) !== (d < 0); n = Math.abs(n); d = Math.abs(d);
    var q = Math.floor((2 * n + d) / (2 * d));
    return neg ? -q : q;
  };
  FL.brdiv = function (n, d) { // BigInt version
    var neg = (n < 0n) !== (d < 0n); if (n < 0n) n = -n; if (d < 0n) d = -d;
    var q = (2n * n + d) / (2n * d);
    return neg ? -q : q;
  };
  // percent of cents: pct given as a fraction num/den percent (e.g. 2/1 for 2%)
  FL.pctOf = function (cents, pnum, pden) { return FL.rdiv(cents * pnum, 100 * (pden || 1)); };
  // compound: principal cents, rate percent (number with up to 2 decimals), years -> cents (rounded once at end)
  FL.compound = function (cents, ratePct, years) {
    var r = BigInt(Math.round(ratePct * 100));          // basis points
    var num = BigInt(cents) * (10000n + r) ** BigInt(years), den = 10000n ** BigInt(years);
    return Number(FL.brdiv(num, den));
  };
  FL.simple = function (cents, ratePct, years) {
    return cents + FL.rdiv(cents * Math.round(ratePct * 100) * years, 10000);
  };
  // month-by-month credit card payoff. apr in percent (e.g. 24), payment cents.
  FL.payoff = function (balCents, aprPct, payCents, maxMonths) {
    var rows = [], b = balCents, m = 0, interest = 0, max = maxMonths || 600;
    var bp = Math.round(aprPct * 100);                   // basis points per year
    while (b > 0 && m < max) {
      var i = FL.rdiv(b * bp, 12 * 10000);
      b += i; interest += i;
      var p = Math.min(payCents, b); b -= p; m++;
      rows.push({ m: m, interest: i, pay: p, bal: b });
      if (p <= i && b > 0) { return { months: Infinity, interest: interest, rows: rows, never: true }; }
    }
    return { months: b > 0 ? Infinity : m, interest: interest, rows: rows };
  };
  function commas(s) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  FL.money = function (cents, opt) {
    var neg = cents < 0; cents = Math.abs(cents);
    var d = Math.floor(cents / 100), c = cents % 100;
    var s = '$' + commas(String(d)) + ((opt === 'whole' && c === 0) || (opt === 'auto' && c === 0) ? '' : '.' + (c < 10 ? '0' : '') + c);
    return (neg ? '−' : '') + s;
  };
  FL.num = function (x, dp) {
    var neg = x < 0; x = Math.abs(x);
    var s = dp != null ? x.toFixed(dp) : String(x);
    var p = s.split('.');
    return (neg ? '−' : '') + commas(p[0]) + (p[1] ? '.' + p[1] : '');
  };

  /* ---------------- self-test ---------------- */
  var fails = 0, passes = 0;
  FL.assert = function (cond, label) {
    if (cond) passes++; else { fails++; console.error('FL self-test failed: ' + label); }
  };
  FL.assertEq = function (got, want, label) {
    FL.assert(got === want, label + ' (got ' + got + ', want ' + want + ')');
  };
  FL.selfTestReport = function () { return { pass: passes, fail: fails }; };
  // engine tests
  (function () {
    var t = FL.parse;
    FL.assert(FL.eq(t('$1,500'), t('1500.00')), 'parse $1,500');
    FL.assert(FL.eq(t('11.50'), t('23/2')), 'parse 11.5');
    FL.assert(FL.eq(t('−12'), t('-12')), 'parse minus');
    FL.assert(FL.eq(t('52 weeks'), t('52')), 'parse units');
    FL.assert(t('abc') === null, 'parse junk');
    FL.assertEq(FL.money(162889), '$1,628.89', 'money fmt');
    FL.assertEq(FL.compound(100000, 5, 10), 162889, 'compound 10y');
    FL.assertEq(FL.compound(100000, 5, 30), 432194, 'compound 30y');
    FL.assertEq(FL.simple(100000, 5, 10), 150000, 'simple 10y');
    var p = FL.payoff(120000, 24, 10000);
    FL.assertEq(p.months, 14, 'payoff months');
    FL.assertEq(p.rows[0].bal, 112400, 'payoff month 1');
    FL.assertEq(p.rows[1].bal, 104648, 'payoff month 2');
    FL.assert(Math.abs(p.interest - 18600) < 100, 'payoff interest about $186 (' + p.interest + ')');
  })();

  /* ---------------- tiny DOM helpers ---------------- */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  FL.el = el;
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  FL.esc = esc;
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  FL.praise = function () { return pick(['Yes!', 'Correct!', 'Nice work!', 'You got it!', 'Right!', 'Great thinking!']); };

  /* ---------------- SVG graph ---------------- */
  var NS = 'http://www.w3.org/2000/svg';
  function sv(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  FL.COLORS = { navy: '#1E2D4F', gold: '#C98F00', red: '#B42318', teal: '#0F766E', gray: '#8A93A3', green: '#15803D' };

  // opts: {w,h,xmin,xmax,ymin,ymax,xstep,ystep,xlabel,ylabel,xfmt,yfmt,title}
  FL.Graph = function (opts) {
    var narrow = (window.innerWidth || 800) < 600;
    var o = Object.assign(narrow ? { w: 420, h: 310, pad: [16, 26, 44, 66] } : { w: 560, h: 340, pad: [18, 30, 46, 72] }, opts); // top,right,bottom,left
    var g = this; g.o = o;
    var L = o.pad[3], R = o.w - o.pad[1], T = o.pad[0], B = o.h - o.pad[2];
    g.X = function (x) { return L + (x - o.xmin) / (o.xmax - o.xmin) * (R - L); };
    g.Y = function (y) { return B - (y - o.ymin) / (o.ymax - o.ymin) * (B - T); };
    g.box = { L: L, R: R, T: T, B: B };
    var svg = g.svg = sv('svg', { viewBox: '0 0 ' + o.w + ' ' + o.h, 'class': 'fl-graph', role: 'img', 'aria-label': o.title || 'graph' });
    var xf = o.xfmt || function (v) { return FL.num(v); }, yf = o.yfmt || function (v) { return FL.num(v); };
    var grid = sv('g', { 'class': 'grid' }, svg);
    var i, v;
    for (v = o.xmin; v <= o.xmax + 1e-9; v += o.xstep) {
      sv('line', { x1: g.X(v), x2: g.X(v), y1: T, y2: B, stroke: '#E3E5EA', 'stroke-width': 1 }, grid);
      var tx = sv('text', { x: g.X(v), y: B + 17, 'text-anchor': 'middle', 'class': 'tick' }, grid); tx.textContent = xf(v);
    }
    for (v = o.ymin; v <= o.ymax + 1e-9; v += o.ystep) {
      sv('line', { x1: L, x2: R, y1: g.Y(v), y2: g.Y(v), stroke: '#E3E5EA', 'stroke-width': 1 }, grid);
      var ty = sv('text', { x: L - 6, y: g.Y(v) + 4, 'text-anchor': 'end', 'class': 'tick' }, grid); ty.textContent = yf(v);
    }
    var y0 = Math.min(Math.max(0, o.ymin), o.ymax), x0 = Math.min(Math.max(0, o.xmin), o.xmax);
    sv('line', { x1: L, x2: R, y1: g.Y(y0), y2: g.Y(y0), stroke: '#5B6475', 'stroke-width': 1.5 }, grid);
    sv('line', { x1: g.X(x0), x2: g.X(x0), y1: T, y2: B, stroke: '#5B6475', 'stroke-width': 1.5 }, grid);
    if (o.xlabel) { var xl = sv('text', { x: (L + R) / 2, y: o.h - 6, 'text-anchor': 'middle', 'class': 'axl' }, grid); xl.textContent = o.xlabel; }
    if (o.ylabel) { var yl = sv('text', { x: 14, y: (T + B) / 2, 'text-anchor': 'middle', 'class': 'axl', transform: 'rotate(-90 14 ' + (T + B) / 2 + ')' }, grid); yl.textContent = o.ylabel; }
    var clipId = 'clip' + Math.random().toString(36).slice(2, 8);
    var cp = sv('clipPath', { id: clipId }, sv('defs', {}, svg));
    sv('rect', { x: L, y: T - 2, width: R - L, height: B - T + 4 }, cp);
    g.plot = sv('g', { 'clip-path': 'url(#' + clipId + ')' }, svg);
    g.top = sv('g', {}, svg);
  };
  var GP = FL.Graph.prototype;
  GP.layer = function (onTop) { return sv('g', {}, onTop ? this.top : this.plot); };
  GP.fn = function (f, st, parent) {
    st = st || {}; var o = this.o, pts = [], a = st.from != null ? st.from : o.xmin, b = st.to != null ? st.to : o.xmax, n = st.n || 120;
    for (var i = 0; i <= n; i++) { var x = a + (b - a) * i / n; pts.push(this.X(x).toFixed(1) + ',' + this.Y(f(x)).toFixed(1)); }
    return sv('polyline', { points: pts.join(' '), fill: 'none', stroke: st.color || FL.COLORS.navy, 'stroke-width': st.width || 3, 'stroke-dasharray': st.dash, 'stroke-linejoin': 'round' }, parent || this.plot);
  };
  GP.path = function (pts, st, parent) {
    st = st || {}; var g = this;
    return sv('polyline', { points: pts.map(function (p) { return g.X(p[0]).toFixed(1) + ',' + g.Y(p[1]).toFixed(1); }).join(' '), fill: 'none', stroke: st.color || FL.COLORS.navy, 'stroke-width': st.width || 3, 'stroke-dasharray': st.dash, 'stroke-linejoin': 'round' }, parent || this.plot);
  };
  GP.dot = function (x, y, st, parent) {
    st = st || {};
    return sv('circle', { cx: this.X(x), cy: this.Y(y), r: st.r || 5, fill: st.fill || st.color || FL.COLORS.navy, stroke: st.stroke || '#fff', 'stroke-width': st.sw || 1.5, 'class': st.cls }, parent || this.top);
  };
  GP.label = function (x, y, txt, st, parent) {
    st = st || {};
    var t = sv('text', { x: this.X(x) + (st.dx || 0), y: this.Y(y) + (st.dy || 0), 'text-anchor': st.anchor || 'start', 'class': 'lab' + (st.cls ? ' ' + st.cls : ''), fill: st.color || FL.COLORS.navy }, parent || this.top);
    t.textContent = txt; return t;
  };
  GP.vline = function (x, st, parent) {
    st = st || {}; var o = this.o;
    return sv('line', { x1: this.X(x), x2: this.X(x), y1: this.Y(st.y1 != null ? st.y1 : o.ymin), y2: this.Y(st.y2 != null ? st.y2 : o.ymax), stroke: st.color || FL.COLORS.gray, 'stroke-width': st.width || 1.5, 'stroke-dasharray': st.dash || '5 4' }, parent || this.plot);
  };
  GP.hline = function (y, st, parent) {
    st = st || {}; var o = this.o;
    return sv('line', { x1: this.X(st.x1 != null ? st.x1 : o.xmin), x2: this.X(st.x2 != null ? st.x2 : o.xmax), y1: this.Y(y), y2: this.Y(y), stroke: st.color || FL.COLORS.gray, 'stroke-width': st.width || 1.5, 'stroke-dasharray': st.dash || '5 4' }, parent || this.plot);
  };
  // convert a pointer event to data coordinates
  GP.toData = function (ev) {
    var r = this.svg.getBoundingClientRect(), o = this.o;
    var sx = (ev.clientX - r.left) / r.width * o.w, sy = (ev.clientY - r.top) / r.height * o.h;
    var b = this.box;
    return { x: o.xmin + (sx - b.L) / (b.R - b.L) * (o.xmax - o.xmin), y: o.ymin + (b.B - sy) / (b.B - b.T) * (o.ymax - o.ymin), sx: sx, sy: sy };
  };
  FL.svg = sv;

  // small sketch graph (for choices): pts in 0..10 units
  FL.sketch = function (segs, opt) {
    opt = opt || {};
    var w = 150, h = 96, s = '<svg viewBox="0 0 ' + w + ' ' + h + '" class="fl-sketch" role="img" aria-label="' + esc(opt.label || 'sketch graph') + '">';
    s += '<line x1="14" y1="84" x2="144" y2="84" stroke="#5B6475" stroke-width="1.5"/><line x1="14" y1="6" x2="14" y2="84" stroke="#5B6475" stroke-width="1.5"/>';
    if (opt.dots) opt.dots.forEach(function (p) { s += '<circle cx="' + (14 + p[0] * 13) + '" cy="' + (84 - p[1] * 7.6) + '" r="3.2" fill="#1E2D4F"/>'; });
    if (segs) s += '<polyline fill="none" stroke="#1E2D4F" stroke-width="3" stroke-linejoin="round" points="' + segs.map(function (p) { return (14 + p[0] * 13) + ',' + (84 - p[1] * 7.6); }).join(' ') + '"/>';
    if (opt.x) s += '<text x="144" y="95" text-anchor="end" font-size="10" fill="#5B6475">' + esc(opt.x) + '</text>';
    if (opt.y) s += '<text x="18" y="12" font-size="10" fill="#5B6475">' + esc(opt.y) + '</text>';
    return s + '</svg>';
  };

  /* ---------------- slider helper ---------------- */
  FL.slider = function (parent, o) {
    var wrap = el('div', 'fl-slider');
    var id = 'sl' + Math.random().toString(36).slice(2, 8);
    wrap.innerHTML = '<label for="' + id + '">' + o.label + '</label><input type="range" id="' + id + '" min="' + o.min + '" max="' + o.max + '" step="' + o.step + '" value="' + o.value + '"><output class="fl-mono"></output>';
    var inp = wrap.querySelector('input'), out = wrap.querySelector('output');
    function upd() { var v = +inp.value; out.textContent = o.fmt ? o.fmt(v) : v; o.onInput(v); }
    inp.addEventListener('input', upd);
    parent.appendChild(wrap); upd();
    return inp;
  };

  /* ---------------- question cards ---------------- */
  // item: {type:'num'|'mc'|'sel'|'err', q, fig, ans, alt, range, wrong:[{v|test,msg}], choices, why, hint, explain, money, pre, post, unit}
  // mode: {scored:bool, label:'1', onChange()}
  FL.Item = function (item, mode) {
    var it = this; it.item = item; it.mode = mode || {};
    it.tries = 0; it.right = false; it.shown = false; it.first = null; it.last = null; it.points = 0;
    var card = it.card = el('div', 'fl-card fl-' + item.type);
    if (item.id) card.id = item.id;
    card.innerHTML = (it.mode.label ? '<div class="fl-qnum">' + it.mode.label + '</div>' : '') +
      '<div class="fl-q">' + item.q + '</div>';
    if (item.fig) {
      var f = el('div', 'fl-fig');
      if (typeof item.fig === 'function') item.fig(f); else f.innerHTML = item.fig;
      card.appendChild(f);
    }
    var body = el('div', 'fl-body'); card.appendChild(body);
    var t = item.type;
    if (t === 'num') {
      var row = el('div', 'fl-row');
      var id = 'in' + Math.random().toString(36).slice(2, 8);
      row.innerHTML = '<label class="fl-sr" for="' + id + '">Your answer</label>' +
        (item.pre ? '<span class="fl-pre">' + item.pre + '</span>' : '') +
        '<input class="fl-in" id="' + id + '" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="answer">' +
        (item.post ? '<span class="fl-post">' + item.post + '</span>' : '');
      body.appendChild(row);
      it.input = row.querySelector('input');
      it.input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); it.check(); } });
    } else {
      if (t === 'err') {
        body.appendChild(el('div', 'fl-errhow', 'Tap the line with the <b>first</b> mistake.'));
      }
      if (t === 'sel') body.appendChild(el('div', 'fl-errhow', 'Select <b>all</b> that are true.'));
      var list = el('div', 'fl-choices' + (t === 'err' ? ' fl-work' : '') + (item.grid ? ' fl-cgrid' : ''));
      list.setAttribute('role', t === 'sel' ? 'group' : 'radiogroup');
      var opts = t === 'err' ? item.lines : item.choices;
      it.sel = [];
      it.btns = opts.map(function (c, i) {
        var b = el('button', 'fl-choice', (t === 'err' ? '<span class="fl-ln">Line ' + (i + 1) + '</span>' : t === 'sel' ? '<span class="fl-box" aria-hidden="true"></span>' : '<span class="fl-let">' + 'ABCDEFGH'.charAt(i) + '</span>') + '<span class="fl-ct">' + c + '</span>');
        b.type = 'button';
        b.setAttribute(t === 'sel' ? 'aria-pressed' : 'aria-checked', 'false');
        if (t !== 'sel') b.setAttribute('role', 'radio');
        b.addEventListener('click', function () {
          if (it.right || it.shown) return;
          if (t === 'sel') { var k = it.sel.indexOf(i); if (k < 0) it.sel.push(i); else it.sel.splice(k, 1); }
          else it.sel = [i];
          it.paint();
        });
        list.appendChild(b); return b;
      });
      body.appendChild(list);
    }
    var btns = el('div', 'fl-row fl-actions');
    btns.innerHTML = '<button type="button" class="fl-btn fl-check">Check</button>' +
      (item.hint ? '<button type="button" class="fl-btn fl-ghost fl-hintbtn">Hint</button>' : '') +
      '<button type="button" class="fl-btn fl-ghost fl-showbtn" hidden>Show me</button>';
    body.appendChild(btns);
    it.fb = el('div', 'fl-fb'); it.fb.setAttribute('aria-live', 'polite'); body.appendChild(it.fb);
    it.hintBox = el('div', 'fl-hint'); it.hintBox.hidden = true; it.hintBox.innerHTML = '<b>Hint:</b> ' + (item.hint || ''); body.appendChild(it.hintBox);
    btns.querySelector('.fl-check').addEventListener('click', function () { it.check(); });
    var hb = btns.querySelector('.fl-hintbtn');
    if (hb) hb.addEventListener('click', function () { it.hintBox.hidden = !it.hintBox.hidden; it.usedHint = true; });
    it.showBtn = btns.querySelector('.fl-showbtn');
    it.showBtn.addEventListener('click', function () { it.reveal(); });
  };
  var IP = FL.Item.prototype;
  IP.paint = function () {
    var it = this;
    if (!it.btns) return;
    it.btns.forEach(function (b, i) {
      var on = it.sel.indexOf(i) >= 0;
      b.classList.toggle('on', on);
      b.setAttribute(it.item.type === 'sel' ? 'aria-pressed' : 'aria-checked', on ? 'true' : 'false');
    });
  };
  IP.answerText = function () {
    var item = this.item, t = item.type;
    if (t === 'num') return (item.pre || '') + (item.ansText || FL.num(FL.val(FL.parse(item.ans)))) + (item.post ? ' ' + item.post.replace(/<[^>]+>/g, '') : '');
    var strip = function (h) { var d = document.createElement('div'); d.innerHTML = h; d.querySelectorAll('svg').forEach(function (s) { s.remove(); }); return d.textContent.trim() || '(picture)'; };
    if (t === 'mc') return 'ABCDEFGH'.charAt(item.ans) + '. ' + strip(item.choices[item.ans]);
    if (t === 'err') return 'Line ' + (item.ans + 1);
    return item.ans.map(function (i) { return 'ABCDEFGH'.charAt(i); }).join(', ');
  };
  IP.studentText = function () {
    var it = this, t = it.item.type;
    if (t === 'num') return it.input.value.trim();
    if (!it.sel.length) return '';
    if (t === 'err') return 'Line ' + (it.sel[0] + 1);
    return it.sel.slice().sort().map(function (i) { return 'ABCDEFGH'.charAt(i); }).join(', ');
  };
  // returns {ok, msg}
  IP.grade = function () {
    var it = this, item = it.item, t = item.type, msg = '';
    if (t === 'num') {
      var v = FL.parse(it.input.value);
      if (it.input.value.trim() === '') return { empty: true, msg: 'Type a number first.' };
      if (!v) return { empty: true, msg: 'Type just a number, like 1500 or 1,500.00.' };
      var ok = false;
      if (item.range) ok = FL.cmp(v, FL.parse(item.range[0])) >= 0 && FL.cmp(v, FL.parse(item.range[1])) <= 0;
      if (!ok) ok = FL.eq(v, FL.parse(item.ans)) || (item.alt || []).some(function (a) { return FL.eq(v, FL.parse(a)); });
      if (ok) return { ok: true };
      (item.wrong || []).some(function (w) {
        var hit = w.test ? w.test(FL.val(v)) : FL.eq(v, FL.parse(w.v));
        if (hit) { msg = w.msg; return true; }
      });
      if (!msg) {
        var a = FL.val(FL.parse(item.ans)), x = FL.val(v);
        if (a !== 0 && (Math.abs(x - a * 100) < 1e-9 || Math.abs(x * 100 - a) < 1e-9)) msg = 'Check the decimal point. Your number is 100 times too big or too small.';
        else if (a !== 0 && Math.abs(x + a) < 1e-9) msg = 'Check the sign. Your number has the wrong sign.';
        else msg = item.nudge || 'Not yet. Look at the numbers in the problem again.';
      }
      return { ok: false, msg: msg };
    }
    if (!it.sel.length) return { empty: true, msg: t === 'sel' ? 'Pick at least one choice.' : t === 'err' ? 'Tap a line first.' : 'Pick a choice first.' };
    if (t === 'sel') {
      var want = item.ans, missing = want.filter(function (i) { return it.sel.indexOf(i) < 0; }), extra = it.sel.filter(function (i) { return want.indexOf(i) < 0; });
      if (!missing.length && !extra.length) return { ok: true };
      if (extra.length && item.why && item.why[extra[0]]) msg = item.why[extra[0]];
      else if (extra.length) msg = 'Choice ' + 'ABCDEFGH'.charAt(extra[0]) + ' is not true. Read it again.';
      if (missing.length) msg += (msg ? ' ' : '') + 'You missed ' + (missing.length === 1 ? 'one true choice.' : missing.length + ' true choices.');
      return { ok: false, msg: msg };
    }
    var s = it.sel[0];
    if (s === item.ans) return { ok: true };
    return { ok: false, msg: (item.why && item.why[s]) || (t === 'err' ? 'That line is correct. Check each step again, one at a time.' : 'Not this one. Try again.') };
  };
  IP.check = function () {
    var it = this;
    if (it.right || it.shown) return;
    var r = it.grade();
    if (r.empty) { it.say('no', r.msg); return; }
    it.tries++;
    var txt = it.studentText();
    if (it.first == null) it.first = txt;
    it.last = txt;
    if (r.ok) {
      it.right = true;
      it.points = it.tries === 1 ? 1 : it.tries === 2 ? 0.5 : 0;
      if (!it.mode.scored) it.points = 0;
      it.say('ok', FL.praise() + ' ' + (it.item.explain || ''));
      it.lock();
    } else {
      var extra = '';
      if (it.mode.scored && it.tries === 1) extra = ' Try once more.';
      if (it.tries >= (it.mode.scored ? 2 : 1)) it.showBtn.hidden = false;
      if (it.mode.scored && it.tries >= 2) extra = ' You can try again or tap Show me.';
      it.say('no', r.msg + extra);
      if (it.btns && it.item.type !== 'sel') { it.btns[it.sel[0]].classList.add('bad'); }
    }
    if (it.mode.onChange) it.mode.onChange(it);
  };
  IP.reveal = function () {
    var it = this;
    it.shown = true; it.points = 0;
    if (it.first == null) it.first = '';
    var item = it.item;
    if (item.type === 'num') it.input.value = item.ansText || item.ans;
    else { it.sel = item.type === 'sel' ? item.ans.slice() : [item.ans]; it.paint(); }
    it.say('show', '<b>Answer:</b> ' + esc(it.answerText()) + '. ' + (item.explain || ''));
    it.lock();
    if (it.mode.onChange) it.mode.onChange(it);
  };
  IP.lock = function () {
    var it = this;
    it.card.classList.add(it.right ? 'done' : 'shown');
    if (it.input) it.input.readOnly = true;
    if (it.btns) it.btns.forEach(function (b, i) { b.classList.remove('bad'); if (it.sel.indexOf(i) >= 0) b.classList.add(it.right ? 'good' : 'ans'); b.disabled = true; });
    it.card.querySelector('.fl-check').disabled = true;
    it.showBtn.hidden = true;
  };
  IP.say = function (kind, html) { this.fb.className = 'fl-fb ' + kind; this.fb.innerHTML = html; };
  IP.done = function () { return this.right || this.shown || (this.mode.scored && this.tries >= 2); };
  IP.status = function () {
    if (this.right) return this.tries === 1 ? 'Right (1st try)' : 'Right (try ' + this.tries + ')';
    if (this.shown) return 'Not yet (answer shown)';
    if (this.tries) return 'Not yet';
    return 'Not answered';
  };

  /* ---------------- verification code ---------------- */
  FL.code = function (s) {
    var h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    var A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', out = '';
    for (var k = 0; k < 6; k++) { out += A.charAt(h & 31); h = (h >>> 5) | ((k * 7 + 3) << 27); h >>>= 0; }
    return out;
  };

  /* ---------------- lesson page ---------------- */
  FL.lesson = function (L) {
    var root = document.getElementById('fl');
    var items = [];
    var html = '';
    html += '<a href="index.html" class="back-link">← Math in Financial Literacy</a>';
    html += '<header class="page-hdr"><span class="eyebrow">Lesson ' + L.num + ' · Math in Financial Literacy</span>' +
      '<h1>' + L.title + '</h1><p>' + L.question + '</p>' +
      '<p class="stds">' + L.stds + ' · ' + L.fl + '</p></header>';
    html += '<div class="fl-target"><div><b>Learning target:</b> ' + L.target + '</div>' +
      '<div class="fl-vocab"><b>Words to know:</b> ' + L.vocab.join(', ') + '</div>' +
      '<div class="fl-made">Numbers on this page are made up for math practice' + (L.source ? ', except ' + L.source : '') + '. This is not financial advice.</div></div>';
    html += '<nav class="fl-jump" aria-label="On this page"><a href="#tutorial">Tutorial</a><a href="#assignment">Assignment</a><a href="#desmos">Desmos</a><a href="#ixl">IXL</a></nav>';
    html += '<h2 class="fl-h2" id="tutorial">Tutorial <span>about 6 minutes</span></h2><div id="fl-steps"></div>';
    html += '<h2 class="fl-h2" id="assignment">Assignment <span>' + L.assign.length + ' questions</span></h2>' +
      '<p class="fl-how">Right on the first try = 1 point. Right on the second try = ½ point. Use Hint if you are stuck.</p>' +
      '<div class="fl-asg"><div class="fl-score" aria-live="polite">Score: <span>0</span> / ' + L.assign.length + '</div><div id="fl-assign"></div></div>';
    html += '<div class="fl-finish" id="finish"><h2 class="fl-h2">Finish</h2>' +
      '<p class="fl-how" id="fl-left"></p>' +
      '<div class="fl-row"><label for="fl-name" class="fl-namelab">Your first and last name</label></div>' +
      '<div class="fl-row"><input id="fl-name" class="fl-in fl-name" autocomplete="name" placeholder="First Last" maxlength="60">' +
      '<button type="button" class="fl-btn" id="fl-done">I’m done</button></div><div class="fl-fb" id="fl-namefb"></div></div>';
    html += '<div id="fl-complete" hidden></div>';
    html += '<section class="fl-desmos" id="desmos"><h2 class="fl-h3">Desmos tip</h2>' + L.desmos +
      '<p><a class="fl-btn fl-link" href="https://www.desmos.com/calculator" target="_blank" rel="noopener">Open the Desmos calculator</a></p></section>';
    html += '<section class="fl-ixl" id="ixl"><h2 class="fl-h3">Practice more on IXL</h2><ul>' +
      L.ixl.map(function (x) { return '<li><a href="' + x[1] + '" target="_blank" rel="noopener">' + x[0] + '</a></li>'; }).join('') + '</ul></section>';
    html += '<div class="fl-report" id="fl-report"></div>';
    root.innerHTML = html;

    // tutorial steps, revealed one at a time
    var stepsEl = document.getElementById('fl-steps'), stepEls = [];
    FL.L = L; FL.tries = [];
    L.steps.forEach(function (s, si) {
      var sec = el('section', 'fl-step'); sec.id = 'step' + (si + 1);
      sec.innerHTML = '<div class="fl-stepnum">Step ' + (si + 1) + ' of ' + L.steps.length + '</div><h3 class="fl-steptitle">' + s.title + '</h3><div class="fl-stepbody">' + s.html + '</div>';
      if (s.fig) { var f = el('div', 'fl-fig'); sec.appendChild(f); s.fig(f); }
      if (s.after) sec.appendChild(el('div', 'fl-stepbody', s.after));
      var tries = (s.tries || []).map(function (t, ti) {
        var I = new FL.Item(t, { scored: false, label: 'Try it', onChange: function () { gate(); } });
        I.card.classList.add('fl-try'); FL.tries.push(I);
        sec.appendChild(I.card); return I;
      });
      var next = el('div', 'fl-next');
      if (si < L.steps.length - 1) next.innerHTML = '<button type="button" class="fl-btn">Next step →</button>';
      else next.innerHTML = '<button type="button" class="fl-btn">Go to the assignment →</button>';
      next.hidden = tries.length > 0;
      sec.appendChild(next);
      function gate() { if (tries.every(function (I) { return I.right || I.shown; })) next.hidden = false; }
      next.querySelector('button').addEventListener('click', function () {
        var target = si < L.steps.length - 1 ? stepEls[si + 1] : document.getElementById('assignment');
        if (target.hidden) target.hidden = false;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        next.hidden = true;
      });
      if (si > 0) sec.hidden = true;
      stepsEl.appendChild(sec); stepEls.push(sec);
    });
    // the jump links always reveal everything
    document.querySelectorAll('.fl-jump a').forEach(function (a) {
      a.addEventListener('click', function () { if (a.getAttribute('href') !== '#tutorial') stepEls.forEach(function (s) { s.hidden = false; }); });
    });
    FL.showAllSteps = function () { stepEls.forEach(function (s) { s.hidden = false; }); };

    // assignment
    var aEl = document.getElementById('fl-assign');
    var scoreEl = root.querySelector('.fl-score span'), leftEl = document.getElementById('fl-left');
    L.assign.forEach(function (q, i) {
      var I = new FL.Item(q, { scored: true, label: 'Question ' + (i + 1) + (q.kind ? ' · ' + q.kind : ''), onChange: update });
      aEl.appendChild(I.card); items.push(I);
    });
    function score() { return items.reduce(function (s, I) { return s + I.points; }, 0); }
    function fmtScore(s) { return String(s).replace('.5', '½'); }
    function update() {
      scoreEl.textContent = fmtScore(score());
      var left = items.filter(function (I) { return !I.done(); }).length;
      leftEl.textContent = left ? 'You have ' + left + ' question' + (left === 1 ? '' : 's') + ' left. You can still finish, but try them all first.' : 'You answered every question. Type your name and tap I’m done.';
    }
    update();

    var nameIn = document.getElementById('fl-name');
    nameIn.value = FL.store(NAME_KEY);
    document.getElementById('fl-done').addEventListener('click', function () {
      var name = nameIn.value.replace(/\s+/g, ' ').trim(), fb = document.getElementById('fl-namefb');
      if (!/\S+\s+\S+/.test(name)) { fb.className = 'fl-fb no'; fb.textContent = 'Type your first and last name, like “Jordan Lee.”'; nameIn.focus(); return; }
      fb.textContent = '';
      FL.store(NAME_KEY, name);
      complete(name);
    });

    function complete(name) {
      var s = score(), n = items.length, pct = Math.round(s / n * 100);
      var d = new Date(), iso = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
      var nice = d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
      var code = FL.code(name.toLowerCase() + '|' + L.id + '|' + s + '/' + n + '|' + iso);
      var c = document.getElementById('fl-complete');
      c.hidden = false;
      c.innerHTML = '<div class="fl-done-card"><div class="eyebrow">Lesson complete</div>' +
        '<h2 class="fl-done-name">' + esc(name) + '</h2>' +
        '<div class="fl-done-title">Lesson ' + L.num + ': ' + L.title + '</div>' +
        '<div class="fl-done-grid"><div><span>Score</span><b class="fl-mono">' + fmtScore(s) + ' / ' + n + '</b><i>' + pct + '%</i></div>' +
        '<div><span>Date</span><b>' + nice + '</b></div><div><span>Code</span><b class="fl-mono fl-code">' + code + '</b></div></div>' +
        '<p class="fl-done-msg">' + (pct >= 80 ? 'Great work! ' : pct >= 50 ? 'Good effort! Look back at the questions you missed. ' : 'Keep going! Read the hints and try the tutorial again. ') +
        'Take a screenshot of this box, or print your results.</p>' +
        '<div class="fl-row"><button type="button" class="fl-btn" id="fl-print">Print my results</button><a class="fl-btn fl-ghost fl-link" href="index.html">Back to all lessons</a></div></div>';
      document.getElementById('fl-print').addEventListener('click', function () { window.print(); });
      // print report
      var r = document.getElementById('fl-report');
      r.innerHTML = '<h1>Lesson ' + L.num + ': ' + L.title + '</h1>' +
        '<p><b>Name:</b> ' + esc(name) + ' &nbsp; <b>Date:</b> ' + nice + ' &nbsp; <b>Score:</b> ' + fmtScore(s) + ' / ' + n + ' (' + pct + '%) &nbsp; <b>Code:</b> ' + code + '</p>' +
        '<table><thead><tr><th>#</th><th>Question</th><th>My answer</th><th>Result</th></tr></thead><tbody>' +
        items.map(function (I, i) {
          var d2 = document.createElement('div'); d2.innerHTML = I.item.q; d2.querySelectorAll('svg').forEach(function (x) { x.remove(); }); d2.querySelectorAll('.fl-scroll,table').forEach(function (x) { x.replaceWith(' (table) '); });
          var qt = d2.textContent.replace(/\s+/g, ' ').trim();
          if (qt.length > 220) qt = qt.slice(0, 217) + '…';
          var mine = I.first == null || I.first === '' ? '(blank)' : I.first + (I.last && I.last !== I.first ? ' → ' + I.last : '');
          return '<tr><td>' + (i + 1) + '</td><td>' + esc(qt) + '</td><td>' + esc(mine) + '</td><td class="' + (I.right ? 'r' : 'w') + '">' + (I.right ? '✓ ' : '✗ ') + I.status() + '</td></tr>';
        }).join('') + '</tbody></table><p class="fl-made">Math in Financial Literacy · Mr. Allen’s Math Class</p>';
      document.body.classList.add('fl-has-report');
      c.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // self-test: every numeric answer must parse; every choice index must exist; lesson asserts
    L.assign.concat.apply(L.assign, L.steps.map(function (s) { return s.tries || []; })).forEach(function (q, i) {
      if (q.type === 'num') FL.assert(FL.parse(q.ans) !== null, L.id + ' item ' + i + ' answer parses');
      if (q.type === 'mc') FL.assert(q.ans >= 0 && q.ans < q.choices.length, L.id + ' mc ' + i);
      if (q.type === 'err') FL.assert(q.ans >= 0 && q.ans < q.lines.length, L.id + ' err ' + i);
      if (q.type === 'sel') FL.assert(q.ans.every(function (a) { return a < q.choices.length; }), L.id + ' sel ' + i);
    });
    if (L.test) L.test();
    FL.items = items;
    var rep = FL.selfTestReport();
    if (!rep.fail) console.log('FL self-test: ' + rep.pass + ' checks passed');
  };

  /* ---------------- games: best score ---------------- */
  FL.best = function (key, score) {
    var k = 'flGameBest:' + key, b = +FL.store(k) || 0;
    if (score != null && score > b) { FL.store(k, String(score)); return { best: score, isNew: true }; }
    return { best: b, isNew: false };
  };
})();
