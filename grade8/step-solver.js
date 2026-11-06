/* Step solver for the Units 3-4 Tutorial Review.
   Data (already rendered to HTML) comes from _build/u34_tut_steps.py, where every line is checked.
   StepSolver.mount(host, seq, opts)   student picks the next step from a menu; the right pick shows the work
   StepSolver.demo(host, seq, opts)    worked example: "Show next step" reveals one step at a time
   StepSolver.graph(host, spec, opts)  build a number-line graph (point, open/closed circle, direction)
   StepSolver.line(spec)               static graph SVG
   StepSolver.ref(host, kind, svg)     reference diagram with buttons that color the angles
   StepSolver.hl(prefix, groups)       color wedges: groups = [[ids...], color]...
*/
(function () {
  var COLORS = ['#2563EB', '#EA580C', '#16A34A', '#9333EA'];
  var CSS = '' +
    '.ss-open{font:600 15px Inter,system-ui,sans-serif;min-height:44px;padding:8px 14px;border-radius:8px;border:1.5px dashed #1E2D4F;background:#FFF6D6;color:#1E2D4F;cursor:pointer;margin-top:10px}' +
    '.ss-open:focus-visible,.ss-ch:focus-visible,.ss-btn:focus-visible,.ss-nl button:focus-visible,.ss-ref button:focus-visible{outline:3px solid #1D4ED8;outline-offset:2px}' +
    '.ss-panel{margin-top:8px;border:1px solid #E3E5EA;border-left:4px solid #FFC107;border-radius:8px;background:#fff;padding:10px 12px}' +
    '.ss-panel[hidden]{display:none}' +
    '.ss-trail{list-style:none;margin:0;padding:0}' +
    '.ss-trail>li{padding:8px 0;border-bottom:1px solid #EEF0F3}.ss-trail>li:last-child{border-bottom:0}' +
    '.ss-move{font:700 14px Inter,sans-serif;color:#7A5300;display:flex;gap:8px;align-items:baseline}' +
    '.ss-n{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;border-radius:50%;background:#1E2D4F;color:#FFC107;font:700 12px Inter,sans-serif;flex:none}' +
    '.ss-work{font:500 18px/1.9 "Source Serif 4",Georgia,serif;color:#3A4356;margin:2px 0 0 30px}' +
    '.ss-line{font:600 20px/1.7 "Source Serif 4",Georgia,serif;color:#1E2D4F;margin:2px 0 0 30px}' +
    '.ss-line::before{content:"→ ";color:#E0A800}' +
    '.ss-given{font:500 16px/1.5 Inter,sans-serif;color:#1E2D4F;margin:2px 0 0 30px}' +
    '.ss-concl{font:600 17px/1.7 "Source Serif 4",Georgia,serif;color:#1E2D4F;margin:4px 0 0 30px}' +
    '.ss-note{font:400 14.5px/1.45 Inter,sans-serif;color:#5B6475;margin:3px 0 0 30px}' +
    '.ss-check{margin-top:8px;background:#E7F5EC;border-radius:8px;padding:6px 10px;color:#14532D;font:500 15px/1.5 Inter,sans-serif}' +
    '.ss-ask{font:600 15.5px Inter,sans-serif;color:#1E2D4F;margin:10px 0 6px}' +
    '.ss-chs{display:flex;flex-direction:column;gap:6px}' +
    '.ss-ch{font:500 15.5px Inter,sans-serif;text-align:left;min-height:44px;padding:8px 12px;border-radius:8px;border:1.5px solid #1E2D4F;background:#fff;color:#1E2D4F;cursor:pointer}' +
    '.ss-ch.no{border-color:#B42318;background:#FBEAEA;color:#7A1A12}' +
    '.ss-fb{min-height:1px;margin-top:6px;font-size:15px;color:#B42318}' +
    '.ss-done{margin-top:10px;background:#E7F5EC;border-radius:8px;padding:8px 12px;color:#14532D;font-size:15.5px}' +
    '.ss-btn{font:600 14.5px Inter,sans-serif;min-height:44px;padding:6px 12px;border-radius:8px;border:1.5px solid #1E2D4F;background:#fff;color:#1E2D4F;cursor:pointer;margin-top:8px}' +
    '.ss-sol{margin-top:8px;border:1.5px solid #15803D;border-radius:8px;background:#fff;padding:8px 12px}' +
    '.ss-h{font:700 13px Inter,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#15803D;margin-bottom:2px}' +
    /* colored math */
    '.t-v{color:#1D4ED8;background:#E6EDFD;border-radius:4px;padding:0 3px}' +
    '.t-k{color:#7E22A8;background:#F4E8FA;border-radius:4px;padding:0 3px}' +
    '.t-o{background:#FFE58A;color:#4A3500;border-radius:4px;padding:0 3px;font-weight:700}' +
    '.t-c{text-decoration:line-through;text-decoration-color:#B42318;text-decoration-thickness:2.5px;opacity:.8}' +
    '.t-d{color:#0F766E;font-weight:800;border-bottom:2px solid #0F766E}' +
    '.t-fl{color:#C2410C;font-weight:800;border:2px solid #C2410C;border-radius:6px;padding:0 4px;margin:0 2px}' +
    '.t-T,.t-F{display:inline-block;border-radius:6px;padding:0 8px;font-weight:700}' +
    '.t-T{background:#E7F5EC;color:#14532D;border:1.5px solid #15803D}.t-F{background:#FBEAEA;color:#7A1A12;border:1.5px solid #B42318}' +
    '.fr{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;line-height:1.15;margin:0 3px;font-size:.92em}' +
    '.fr>span:first-child{border-bottom:1.6px solid currentColor;padding:0 3px}.fr>span:last-child{padding:0 3px}' +
    /* number line */
    '.ss-nl{margin-top:10px;border:1px solid #E3E5EA;border-radius:8px;padding:8px 10px;background:#FBFBF9}' +
    '.ss-nl .lbl{font:700 13px Inter,sans-serif;color:#5B6475;letter-spacing:.04em;text-transform:uppercase}' +
    '.ss-nl svg{width:100%;height:auto;display:block;touch-action:manipulation;cursor:pointer}' +
    '.ss-nlc{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin-top:6px}' +
    '.ss-grp{display:flex;align-items:center;gap:6px}.ss-grp>span{font:600 14px Inter,sans-serif;color:#1E2D4F}' +
    '.ss-nl button{font:600 15px Inter,sans-serif;min-height:44px;min-width:44px;padding:6px 10px;border-radius:8px;border:1.5px solid #1E2D4F;background:#fff;color:#1E2D4F;cursor:pointer}' +
    '.ss-nl button[aria-pressed=true]{background:#1E2D4F;color:#fff}' +
    '.ss-nl button.go{background:#1E2D4F;color:#fff}' +
    '.ss-nl output{font:600 17px "JetBrains Mono",monospace;min-width:34px;text-align:center;color:#1E2D4F}' +
    '.ss-nl.ok{border-color:#15803D;background:#F3FAF5}' +
    '.ss-nlfb{margin-top:6px;font-size:15px;min-height:1px}.ss-nlfb.no{color:#B42318}.ss-nlfb.ok{color:#15803D;font-weight:600}' +
    /* reference */
    '.ss-ref{border:1.5px solid #1E2D4F;border-radius:10px;padding:10px 12px;background:#fff;margin:10px 0}' +
    '.ss-ref .rt{font:700 13px Inter,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#7A5300}' +
    '.ss-ref .rd{text-align:center}.ss-ref .rd svg{max-width:100%;height:auto}' +
    '.ss-ref .rb{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}' +
    '.ss-ref .rb button{font:600 14px Inter,sans-serif;min-height:44px;padding:6px 10px;border-radius:8px;border:1.5px solid #1E2D4F;background:#fff;color:#1E2D4F;cursor:pointer}' +
    '.ss-ref .rb button[aria-pressed=true]{background:#1E2D4F;color:#fff}' +
    '.ss-ref .ri{margin-top:8px;font:400 15.5px/1.5 Inter,sans-serif;color:#1B2333;min-height:48px}' +
    '.ss-ref .ri .rule{font-weight:700;color:#1E2D4F}' +
    '.ss-chip{display:inline-block;border-radius:6px;padding:0 7px;margin:2px 4px 2px 0;font-weight:700;color:#fff}' +
    '@media print{.ss-open,.ss-panel,.ss-nlc{display:none!important}}';
  function css() {
    if (document.getElementById('ss-css')) return;
    var s = document.createElement('style'); s.id = 'ss-css'; s.textContent = CSS; document.head.appendChild(s);
  }
  function el(tag, cls, h) { var e = document.createElement(tag); if (cls) e.className = cls; if (h != null) e.innerHTML = h; return e; }
  function btn(cls, h) { var b = el('button', cls, h); b.type = 'button'; return b; }

  function stepLi(st, n) {
    var li = el('li');
    li.appendChild(el('div', 'ss-move', '<span class="ss-n">' + n + '</span><span>' + st.move + '</span>'));
    st.work.forEach(function (w) { li.appendChild(el('div', 'ss-work', w)); });
    if (st.res) li.appendChild(el('div', 'ss-line', st.res));
    if (st.concl) li.appendChild(el('div', 'ss-concl', st.concl));
    if (st.note) li.appendChild(el('div', 'ss-note', st.note));
    return li;
  }
  function startLi(seq) {
    var li = el('li');
    if (seq.start) { li.appendChild(el('div', 'ss-move', 'Start')); li.appendChild(el('div', 'ss-line', seq.start)); }
    else { li.appendChild(el('div', 'ss-move', 'Given')); li.appendChild(el('div', 'ss-given', seq.given)); }
    return li;
  }
  function endText(seq) {
    if (seq.after === 'type') return 'Now type your answer in the answer box.';
    if (seq.after === 'pick') return 'Now pick your answer above.';
    return '';
  }

  /* ---------- student picks each step ---------- */
  function mount(host, seq, opts) {
    css(); opts = opts || {};
    var open = btn('ss-open', 'Solve it step by step'); open.setAttribute('aria-expanded', 'false');
    var panel = el('div', 'ss-panel'); panel.hidden = true;
    host.appendChild(open); host.appendChild(panel);
    open.addEventListener('click', function () {
      panel.hidden = !panel.hidden; open.setAttribute('aria-expanded', String(!panel.hidden));
      open.textContent = panel.hidden ? 'Solve it step by step' : 'Hide step-by-step help';
      if (!panel.hidden && !panel.firstChild) start();
    });
    function start() {
      panel.innerHTML = '';
      var trail = el('ol', 'ss-trail'); trail.appendChild(startLi(seq)); panel.appendChild(trail);
      var ask = el('div'); panel.appendChild(ask);
      step(0, trail, ask);
    }
    function step(i, trail, ask) {
      ask.innerHTML = '';
      if (i >= seq.steps.length) {
        var d = el('div', 'ss-done', (seq.check ? 'Check: ' + seq.check + '<br>' : '') + endText(seq));
        d.setAttribute('role', 'status'); ask.appendChild(d);
        var r = btn('ss-btn', 'Start over'); r.onclick = start; ask.appendChild(r);
        return;
      }
      var s = seq.steps[i];
      ask.appendChild(el('div', 'ss-ask', 'Step ' + (i + 1) + ': ' + (s.ask || 'What is the best next step?')));
      var chs = el('div', 'ss-chs'); ask.appendChild(chs);
      var fb = el('div', 'ss-fb'); fb.setAttribute('aria-live', 'polite'); ask.appendChild(fb);
      s.choices.forEach(function (c) {
        var b = btn('ss-ch', c[0]);
        b.onclick = function () {
          if (c[1]) {
            trail.appendChild(stepLi(s, i + 1));
            if (i === 0 && opts.hlPrefix && seq.hl) hl(opts.hlPrefix, [[seq.hl, COLORS[0]]]);
            step(i + 1, trail, ask);
          } else {
            b.classList.add('no'); b.setAttribute('aria-disabled', 'true');
            fb.innerHTML = 'Not that one. ' + c[2];
          }
        };
        chs.appendChild(b);
      });
    }
  }

  /* ---------- worked example ---------- */
  function demo(host, seq, opts) {
    css(); opts = opts || {};
    var trail = el('ol', 'ss-trail'); trail.appendChild(startLi(seq)); host.appendChild(trail);
    var b = btn('ss-btn', 'Show next step'); host.appendChild(b);
    var i = 0;
    b.onclick = function () {
      if (i < seq.steps.length) {
        trail.appendChild(stepLi(seq.steps[i], i + 1));
        if (i === 0 && opts.hlPrefix && seq.hl) hl(opts.hlPrefix, [[seq.hl, COLORS[0]]]);
        i++;
      }
      if (i >= seq.steps.length) {
        b.remove();
        if (seq.check) host.appendChild(el('div', 'ss-check', 'Check: ' + seq.check));
        if (seq.graph) { var g = el('div', 'ss-nl ok'); g.innerHTML = '<div class="lbl">Graph</div>' + line(seq.graph, '#15803D'); host.appendChild(g); }
      }
    };
  }

  /* ---------- number line ---------- */
  var W = 560, PAD = 26, Y = 28;
  function xOf(spec, v) { return PAD + (v - spec.lo) * (W - 2 * PAD) / (spec.hi - spec.lo); }
  function draw(spec, st, col) {
    col = col || '#1E2D4F';
    var s = '<svg viewBox="0 0 ' + W + ' 66" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';
    s += '<line x1="6" y1="' + Y + '" x2="' + (W - 6) + '" y2="' + Y + '" stroke="#1E2D4F" stroke-width="2"/>';
    s += '<polyline points="16,' + (Y - 7) + ' 6,' + Y + ' 16,' + (Y + 7) + '" fill="none" stroke="#1E2D4F" stroke-width="2"/>';
    s += '<polyline points="' + (W - 16) + ',' + (Y - 7) + ' ' + (W - 6) + ',' + Y + ' ' + (W - 16) + ',' + (Y + 7) + '" fill="none" stroke="#1E2D4F" stroke-width="2"/>';
    for (var v = spec.lo; v <= spec.hi; v++) {
      var x = xOf(spec, v);
      s += '<line x1="' + x + '" y1="' + (Y - 7) + '" x2="' + x + '" y2="' + (Y + 7) + '" stroke="#1E2D4F" stroke-width="1.5"/>';
      s += '<text x="' + x + '" y="' + (Y + 30) + '" font-size="19" text-anchor="middle" font-family="Inter,sans-serif" fill="#1B2333"' + (v === 0 ? ' font-weight="700"' : '') + '>' + (v < 0 ? '−' + (-v) : v) + '</text>';
    }
    if (st.v != null) {
      var px = xOf(spec, st.v);
      if (st.dir) {
        var end = st.dir === 'left' ? 8 : W - 8;
        s += '<line x1="' + px + '" y1="' + Y + '" x2="' + end + '" y2="' + Y + '" stroke="' + col + '" stroke-width="7" stroke-linecap="round"/>';
        var a = st.dir === 'left' ? 1 : -1;
        s += '<polygon points="' + end + ',' + Y + ' ' + (end + a * 16) + ',' + (Y - 10) + ' ' + (end + a * 16) + ',' + (Y + 10) + '" fill="' + col + '"/>';
      }
      if (st.closed == null) s += '<circle cx="' + px + '" cy="' + Y + '" r="9" fill="#fff" stroke="#7A8599" stroke-width="2.5" stroke-dasharray="4 3"/>';
      else s += '<circle cx="' + px + '" cy="' + Y + '" r="9" fill="' + (st.closed ? col : '#fff') + '" stroke="' + col + '" stroke-width="3"/>';
    }
    return s + '</svg>';
  }
  function line(spec, col) { var sp = Object.assign({ lo: -8, hi: 8 }, spec); return draw(sp, { v: sp.v, closed: sp.closed, dir: sp.dir }, col); }

  function graph(host, spec, opts) {
    css(); opts = opts || {};
    spec = Object.assign({ lo: -8, hi: 8 }, spec);
    var st = { v: 0, closed: null, dir: null }, tries = 0, done = false;
    var box = el('div', 'ss-nl');
    box.appendChild(el('div', 'lbl', opts.title || 'Graph your answer'));
    var pic = el('div'); box.appendChild(pic);
    var ctl = el('div', 'ss-nlc'); box.appendChild(ctl);
    var g1 = el('div', 'ss-grp'); g1.appendChild(el('span', '', 'Point'));
    var lft = btn('', '◀'); lft.setAttribute('aria-label', 'Move point left');
    var out = el('output'); out.setAttribute('aria-live', 'polite');
    var rgt = btn('', '▶'); rgt.setAttribute('aria-label', 'Move point right');
    g1.appendChild(lft); g1.appendChild(out); g1.appendChild(rgt); ctl.appendChild(g1);
    var g2 = el('div', 'ss-grp'); g2.appendChild(el('span', '', 'Circle'));
    var bo = btn('', 'Open ○'), bc = btn('', 'Closed ●'); g2.appendChild(bo); g2.appendChild(bc); ctl.appendChild(g2);
    var g3 = el('div', 'ss-grp'); g3.appendChild(el('span', '', 'Shade'));
    var bl = btn('', '← Left'), br = btn('', 'Right →'); g3.appendChild(bl); g3.appendChild(br); ctl.appendChild(g3);
    var chk = btn('go', 'Check graph'); ctl.appendChild(chk);
    var fb = el('div', 'ss-nlfb'); fb.setAttribute('aria-live', 'polite'); box.appendChild(fb);
    host.appendChild(box);
    function fmt(v) { return v < 0 ? '−' + (-v) : String(v); }
    function paint(col) {
      pic.innerHTML = draw(spec, st, col); out.textContent = fmt(st.v);
      bo.setAttribute('aria-pressed', String(st.closed === false)); bc.setAttribute('aria-pressed', String(st.closed === true));
      bl.setAttribute('aria-pressed', String(st.dir === 'left')); br.setAttribute('aria-pressed', String(st.dir === 'right'));
      var svg = pic.querySelector('svg');
      svg.addEventListener('click', function (e) {
        if (done) return;
        var r = svg.getBoundingClientRect(), x = (e.clientX - r.left) * W / r.width;
        var v = Math.round(spec.lo + (x - PAD) * (spec.hi - spec.lo) / (W - 2 * PAD));
        st.v = Math.max(spec.lo, Math.min(spec.hi, v)); paint();
      });
    }
    lft.onclick = function () { if (!done && st.v > spec.lo) { st.v--; paint(); } };
    rgt.onclick = function () { if (!done && st.v < spec.hi) { st.v++; paint(); } };
    bo.onclick = function () { if (!done) { st.closed = false; paint(); } };
    bc.onclick = function () { if (!done) { st.closed = true; paint(); } };
    bl.onclick = function () { if (!done) { st.dir = 'left'; paint(); } };
    br.onclick = function () { if (!done) { st.dir = 'right'; paint(); } };
    chk.onclick = function () {
      if (done) return;
      if (st.closed == null || st.dir == null) { fb.className = 'ss-nlfb no'; fb.textContent = st.closed == null ? 'Choose an open or closed circle.' : 'Choose which way to shade.'; return; }
      tries++;
      var msg = [];
      if (st.v !== spec.v) msg.push('Move the point. It goes on the number in your answer.');
      if (st.closed !== spec.closed) msg.push(spec.closed ? '≤ and ≥ include the number, so use a CLOSED circle.' : '&lt; and &gt; do NOT include the number, so use an OPEN circle.');
      if (st.dir !== spec.dir) msg.push(spec.dir === 'right' ? 'Shade the other way. "Greater than" numbers are to the RIGHT.' : 'Shade the other way. "Less than" numbers are to the LEFT.');
      if (!msg.length) {
        done = true; box.classList.add('ok'); paint('#15803D');
        fb.className = 'ss-nlfb ok'; fb.innerHTML = 'Correct graph! ' + (spec.why || '');
        [lft, rgt, bo, bc, bl, br, chk].forEach(function (b) { b.disabled = true; });
        if (opts.onResult) opts.onResult(true, tries);
      } else {
        fb.className = 'ss-nlfb no'; fb.innerHTML = msg.join(' ');
        if (opts.onResult) opts.onResult(false, tries);
      }
    };
    paint();
    function lock(on) { [lft, rgt, bo, bc, bl, br, chk].forEach(function (b) { b.disabled = on; }); }
    return {
      reveal: function () { st = { v: spec.v, closed: spec.closed, dir: spec.dir }; done = true; lock(true); box.classList.add('ok'); paint('#15803D'); fb.className = 'ss-nlfb ok'; fb.innerHTML = spec.why || ''; },
      /* touched: the student chose a circle and a direction; ok: the graph matches */
      state: function () { return { touched: st.closed != null && st.dir != null, ok: st.v === spec.v && st.closed === spec.closed && st.dir === spec.dir }; },
      mark: function (ok) { fb.className = 'ss-nlfb ' + (ok ? 'ok' : 'no'); fb.innerHTML = ok ? '✓ Graph correct.' : '✗ Graph answer: ' + (spec.why || ''); },
      reset: function () { st = { v: 0, closed: null, dir: null }; done = false; tries = 0; lock(false); box.classList.remove('ok'); fb.className = 'ss-nlfb'; fb.innerHTML = ''; paint(); }
    };
  }

  /* ---------- reference diagrams ---------- */
  var n = 0;
  function hl(prefix, groups) {
    document.querySelectorAll('[id^="' + prefix + '-w"]').forEach(function (w) { w.setAttribute('fill', 'transparent'); w.removeAttribute('fill-opacity'); });
    groups.forEach(function (g) {
      g[0].forEach(function (id) { var w = document.getElementById(prefix + '-w' + id); if (w) { w.setAttribute('fill', g[1]); w.setAttribute('fill-opacity', '.5'); } });
    });
  }
  var PARA = [
    ['Corresponding', 'Same position at each crossing.', 'eq', [[1, 5], [2, 6], [3, 7], [4, 8]]],
    ['Alternate Interior', 'Between the parallel lines, on opposite sides of t.', 'eq', [[3, 6], [4, 5]]],
    ['Alternate Exterior', 'Outside the parallel lines, on opposite sides of t.', 'eq', [[1, 8], [2, 7]]],
    ['Same-Side Interior', 'Between the parallel lines, on the same side of t.', 's', [[3, 5], [4, 6]]],
    ['Same-Side Exterior', 'Outside the parallel lines, on the same side of t.', 's', [[1, 7], [2, 8]]],
    ['Vertical', 'Across from each other where two lines cross.', 'eq', [[1, 4], [2, 3], [5, 8], [6, 7]]],
    ['Linear Pair', 'Side by side on a straight line.', 's', [[1, 2], [3, 4], [5, 6], [7, 8]]]
  ];
  var TRI = [
    ['Triangle Sum', 'The three <b>interior</b> angles add to 180°.', '<i>a</i> + <i>b</i> + <i>c</i> = 180°', [[['a', 'b', 'c'], COLORS[0]]]],
    ['Exterior Angle', 'The <b>exterior</b> angle <i>d</i> equals the sum of the two <b>remote interior</b> angles (the two that do not touch it).', '<i>d</i> = <i>a</i> + <i>b</i>', [[['a', 'b'], COLORS[0]], [['d'], '#E0A800']]],
    ['Linear Pair', 'The exterior angle and the interior angle next to it are on a straight line.', '<i>c</i> + <i>d</i> = 180°', [[['c'], COLORS[2]], [['d'], '#E0A800']]]
  ];
  function ref(host, kind, svgTemplate) {
    css();
    var p = 'ref' + (++n);
    var box = el('div', 'ss-ref');
    box.appendChild(el('div', 'rt', kind === 'para' ? 'Reference: angle pairs' : 'Reference: triangle theorems'));
    var dia = el('div', 'rd', svgTemplate.replace(/__P__/g, p)); box.appendChild(dia);
    var rb = el('div', 'rb'); box.appendChild(rb);
    var info = el('div', 'ri', kind === 'para' ? 'Tap a pair type to color it on the diagram.' : 'Tap a theorem to color it on the diagram.');
    info.setAttribute('aria-live', 'polite'); box.appendChild(info);
    var list = kind === 'para' ? PARA : TRI, bs = [];
    list.forEach(function (t) {
      var b = btn('', t[0]); b.setAttribute('aria-pressed', 'false'); bs.push(b); rb.appendChild(b);
      b.onclick = function () {
        bs.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); b.setAttribute('aria-pressed', 'true');
        if (kind === 'para') {
          hl(p, t[3].map(function (pr, i) { return [pr, COLORS[i % 4]]; }));
          info.innerHTML = '<span class="rule">' + t[0] + ':</span> ' + t[1] + ' ' +
            t[3].map(function (pr, i) { return '<span class="ss-chip" style="background:' + COLORS[i % 4] + '">∠' + pr[0] + ' &amp; ∠' + pr[1] + '</span>'; }).join('') +
            '<br><span class="rule">' + (t[2] === 'eq' ? 'They are EQUAL.' : 'They ADD to 180°.') + '</span>';
        } else {
          hl(p, t[3]);
          info.innerHTML = '<span class="rule">' + t[0] + ':</span> ' + t[1] + '<br><span class="rule" style="font-family:\'Source Serif 4\',serif;font-size:19px">' + t[2] + '</span>';
        }
      };
    });
    host.appendChild(box);
    return p;
  }

  window.StepSolver = { mount: mount, demo: demo, graph: graph, line: line, ref: ref, hl: hl, COLORS: COLORS };
})();
