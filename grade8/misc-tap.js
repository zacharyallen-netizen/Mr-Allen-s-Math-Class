/* TAP OR NUMBER on four pages that have their own answer boxes (Nov 11, 2026, Mr. Allen's rule: "The answer should be a
   number or a multiple choice answer"). Each part does nothing on a page that does not have that kind of box.
   A. Unit 6 notes: word blanks in the notes sentences (input.fill) become small tap choices. Number blanks stay boxes.
   B. Slope-intercept notes: the three "Reflection Questions" (typed sentences) become tap choices.
   C. Units 3-4 review tutorial: "solve the inequality" boxes become tap choices; the page's own check(id) still grades.
   D. Q1 benchmark review: the three "Simplify" boxes become tap choices; the page still grades what is in its box.
   The page's own code still checks, colors, saves and sends. MiscTap.typed lists anything that had to stay typed. */
(function () {
  "use strict";
  if (!window.TapAnswers || /[?&](paper|key)=1/.test(location.search)) return;
  var T = window.TapAnswers, typed = [], n = { fill: 0, reflect: 0, ineq: 0, mono: 0 };
  var st = document.createElement('style');
  st.textContent = '.ta-row.ta-inline{display:inline-flex;flex:0 0 auto;gap:5px;vertical-align:middle;margin:3px 4px}.ta-row.ta-inline .ta-btn{min-height:36px;min-width:44px;padding:4px 11px;font-size:15px}' +
    '.mt-fb{display:block;font:600 14px Inter,system-ui,sans-serif;margin-top:4px}.mt-fb.ok{color:#15803D}.mt-fb.no{color:#B42318}';
  document.head.appendChild(st);
  function ascii(t) { return String(t).replace(/−/g, '-').replace(/≤/g, '<=').replace(/≥/g, '>=').replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, function (m) { return '^' + m.split('').map(function (c) { return c === '⁻' ? '-' : '⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(c); }).join(''); }); }

  /* ---------- A. word blanks in the Unit 6 notes ---------- */
  var BANK = { one: ['one', 'two', 'many'], x: ['x', 'y'], y: ['x', 'y'], yes: ['yes', 'no'], no: ['yes', 'no'], once: ['once', 'twice'], rate: ['rate', 'start', 'end'], starting: ['starting', 'ending', 'biggest'],
    slope: ['slope', 'y-intercept'], 'y-intercept': ['slope', 'y-intercept'], greater: ['greater', 'smaller'], a: ['A', 'B'], b: ['A', 'B'], increasing: ['increasing', 'decreasing', 'constant'], decreasing: ['increasing', 'decreasing', 'constant'],
    constant: ['increasing', 'decreasing', 'constant'], faster: ['faster', 'slower'], slower: ['faster', 'slower'], out: ['out', 'back'], back: ['out', 'back'], rested: ['rested', 'sped up', 'turned around'], fast: ['fast', 'slowly'],
    slowly: ['fast', 'slowly'], stopped: ['stopped', 'speeding up', 'going back'] };
  [].forEach.call(document.querySelectorAll('input.fill[data-answer]'), function (inp) {
    var a = String(inp.getAttribute('data-answer')).trim(); if (T.isNumber(a)) { if (!inp.placeholder) inp.placeholder = '#'; return; }
    var list = BANK[a.toLowerCase()]; if (!list) { typed.push(['fill', inp.getAttribute('data-qid'), a]); return; }
    var ui = T.mount(inp, list, { onPick: function (t) { inp.value = t; inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('blur')); paint(); } }); if (!ui) return;
    ui.row.classList.add('ta-inline'); ui.row.classList.remove('col'); n.fill++;
    function paint() { ui.buttons.forEach(function (b) { var on = b.textContent.toLowerCase() === String(inp.value).trim().toLowerCase(); b.classList.toggle('sel', on && !inp.classList.contains('correct') && !inp.classList.contains('incorrect')); b.classList.toggle('ok', on && inp.classList.contains('correct')); b.classList.toggle('no', on && inp.classList.contains('incorrect')); }); }
    try { new MutationObserver(paint).observe(inp, { attributes: true, attributeFilter: ['class'] }); } catch (e) {}       // "show" buttons and saved answers color the blank
    paint();
  });

  /* ---------- B. reflection questions (slope-intercept notes) ---------- */
  var REF = [
    ['It flips the line. y = x goes up, but y = −x goes down.', ['It moves the line down.', 'It makes the line steeper.', 'Nothing changes.']],
    ['It moves the line up or down. The steepness stays the same.', ['It makes the line steeper or flatter.', 'It flips the line.', 'Nothing changes.']],
    ['It changes how steep the line is.', ['It moves the line up or down.', 'It flips the line.', 'It changes where the line crosses the y-axis.']]
  ];
  [].forEach.call(document.querySelectorAll('.reflection-q textarea[data-key]'), function (ta, i) {
    if (!REF[i]) { typed.push(['reflection', i]); return; }
    var right = REF[i][0], list = [right].concat(REF[i][1]), order = [[1, 0, 3, 2], [2, 3, 0, 1], [3, 1, 2, 0]][i % 3].map(function (k) { return list[k]; });
    var fb = document.createElement('span'); fb.className = 'mt-fb'; fb.setAttribute('role', 'status');
    var ui = T.mount(ta, order, { onPick: function (t) { var ok = t === right; ui.buttons.forEach(function (b) { b.classList.remove('sel'); if (b.textContent === t) b.classList.add(ok ? 'ok' : 'no'); });
      fb.className = 'mt-fb ' + (ok ? 'ok' : 'no'); fb.textContent = ok ? '✓ Correct!' : 'Not yet. Look at the graphs again and tap another one.'; if (ok) ui.lock(); } }); if (!ui) return;
    ui.row.classList.add('col'); ui.row.parentNode.insertBefore(fb, ui.row.nextSibling); n.reflect++;
  });

  /* ---------- C. inequality boxes in the Units 3-4 review tutorial ---------- */
  if (typeof QS !== 'undefined' && typeof check === 'function' && QS.some && QS.some(function (q) { return q.type === 'ineq'; })) {
    QS.forEach(function (q) { if (q.type !== 'ineq') return; var inp = document.getElementById('in' + q.id); if (!inp) return;
      var D = { '<': '<', '>': '>', '<=': '≤', '>=': '≥' }, list = T.choices('x ' + D[q.ans[0]] + ' ' + q.ans[1], { key: 'u34rev' + q.id });
      if (!list) { typed.push(['ineq', q.id]); return; }
      var ui = T.mount(inp, list, { onPick: function (t) { inp.value = ascii(t); check(q.id); } }); if (!ui) return; n.ineq++;
      var card = inp.closest('.q, .card, .prob, li, section') || inp.parentNode.parentNode, cb = card.querySelector('button[onclick="check(' + q.id + ')"]'); if (cb) cb.style.display = 'none';
      inp.removeAttribute('placeholder'); inp.removeAttribute('data-ineq');
      var hideKeys = function () { [].forEach.call(card.querySelectorAll('.ik-row'), function (r) { r.style.display = 'none'; }); }; hideKeys(); setTimeout(hideKeys, 600); setTimeout(hideKeys, 2000);
    });
  }

  /* ---------- D. "Simplify" boxes in the Q1 benchmark review ---------- */
  var MONO = { q5in: ['−15x⁷y²', '−15x⁷y³', '2x⁷y³', '−15x¹²y²'], q6in: ['4a⁴', '18a⁶', '4a⁶', '4a¹⁰'], q8in: ['12m¹⁰', '6m¹⁰', '12m⁹', '12m²⁴'] };   // wrong ones: multiplied or added the wrong parts
  Object.keys(MONO).forEach(function (id) { var inp = document.getElementById(id); if (!inp || !inp.classList.contains('mono-in')) return;
    var qb = inp.closest('.q, .question, .card, section, .q-body') , qt = qb && qb.parentNode ? qb.parentNode.textContent : '';
    var list = MONO[id];
    if (!list) { typed.push(['mono', id]); return; }
    var ui = T.mount(inp, list, { onPick: function (t) { inp.value = ascii(t); inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('change', { bubbles: true })); } }); if (ui) n.mono++;
    var pv = inp.parentNode.querySelector('.preview'); if (pv) pv.style.display = 'none';
  });

  window.MiscTap = { typed: typed, count: n };
})();
