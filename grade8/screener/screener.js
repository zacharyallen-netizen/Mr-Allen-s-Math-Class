/* Quick Check screener (Nov 19, 2026). Data: window.SCREENER = { unit, title, qs: [{ skill, q, right, wrong: [{t, why}], hint, review: {h, t} }] }
   Built by _build/screener/make.py. One question at a time, tap choices, Hint on every question, a wrong tap names the
   mistake (no answer on the first two misses), the answer shows after the 3rd miss. The end screen sorts the skills into
   "Ready" (right on the first try) and "Warm up on these first" (with a practice link). Results: ScoreSend (Send my work). */
(function () {
  var D = window.SCREENER, host = document.getElementById('scr'); if (!D || !host) return;
  var N = D.qs.length, cur = -1, st = D.qs.map(function () { return { miss: 0, done: false, first: null, out: {} }; });
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function shuffle(a, seed) { a = a.slice(); var s = seed + 7; for (var i = a.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; var j = Math.floor(s / 233280 * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var ORDER = D.qs.map(function (q, i) { return shuffle([{ t: q.right, ok: true }].concat(q.wrong.map(function (w) { return { t: w.t, why: w.why }; })), i + D.unit * 11); });   /* same order every time, so Save my work can play taps back */
  window.__skipLists = (window.__skipLists || []).concat([{ word: 'question', items: D.qs.map(function (q, i) { return i; }), answered: function (i) { return st[i].done || st[i].miss > 0; } }]);

  var KEY = 'scr-u' + D.unit;              /* this Chromebook keeps the answers, so a reload does not lose them */
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function load() { try { var a = JSON.parse(localStorage.getItem(KEY) || 'null'); if (a && a.length === N) return a; } catch (e) {} return null; }
  function replay() {           /* put the saved answers back into Send my work */
    if (!window.ScoreSend) return;
    st.forEach(function (s, i) { if (s.first === null) return; ScoreSend.record('q' + (i + 1), !!s.first, { band: 3 });
      if (!s.first && s.got) ScoreSend.record('q' + (i + 1), true, { band: 3 }); });
  }
  function dots() {
    return '<div class="scr-dots" aria-hidden="true">' + D.qs.map(function (q, i) {
      var c = st[i].done ? (st[i].first ? ' ok' : ' no') : ''; return '<span class="d' + c + (i === cur ? ' on' : '') + '"></span>'; }).join('') + '</div>';
  }
  function intro() {
    var old = load();
    if (old && old.some(function (s) { return s.first !== null; })) {
      host.innerHTML = '<div class="scr-card scr-intro"><div class="scr-k">Unit ' + D.unit + ' · Quick Check</div><h1>Welcome back!</h1>' +
        '<p>Your answers are saved on this Chromebook.</p><button class="scr-go" id="scr-keep">Keep going →</button> ' +
        '<button class="scr-nb" id="scr-over">Start over</button></div>';
      document.getElementById('scr-keep').onclick = function () { st = old; replay();
        var i = 0; while (i < N - 1 && st[i].done) i++; if (st.every(function (s) { return s.done; })) results(); else show(i); };
      document.getElementById('scr-over').onclick = function () { try { localStorage.removeItem(KEY); } catch (e) {} intro(); };
      return;
    }
    host.innerHTML = '<div class="scr-card scr-intro"><div class="scr-k">Unit ' + D.unit + ' · Quick Check</div><h1>Ready for ' + esc(D.title) + '?</h1>' +
      '<p>' + N + ' quick questions on skills you will use in this unit. It takes about 5 minutes.</p>' +
      '<p>At the end you will see which skills are ready and which ones to warm up on first.</p>' +
      '<button class="scr-go" id="scr-start">Start the Quick Check →</button></div>';
    document.getElementById('scr-start').onclick = function () { show(0); };
  }
  function show(i) {
    cur = i; var q = D.qs[i], s = st[i];
    var h = '<div class="scr-card"><div class="scr-top"><span class="scr-k">Question ' + (i + 1) + ' of ' + N + '</span>' + dots() + '</div>' +
      '<div class="scr-skill">' + esc(q.skill) + '</div><h2 class="scr-q">' + esc(q.q) + '</h2><div class="scr-ch" role="group" aria-label="Answer choices">';
    ORDER[i].forEach(function (c, k) {
      var cls = s.out[c.t] ? ' x' : (s.done && c.ok ? ' right' : '');
      h += '<button class="scr-b' + cls + '" data-k="' + k + '"' + (s.out[c.t] || s.done ? ' disabled' : '') + '>' + esc(c.t) + '</button>';
    });
    h += '</div><div class="scr-fb" id="scr-fb" aria-live="polite"></div><div class="scr-row"><button class="scr-hint" id="scr-hint">Hint</button></div>' +
      '<div class="scr-nav"><button class="scr-nb" id="scr-back"' + (i === 0 ? ' disabled' : '') + '>← Back</button>' +
      '<button class="scr-nb go" id="scr-next">' + (i === N - 1 ? 'See my results →' : 'Next →') + '</button></div></div>';
    host.innerHTML = h;
    if (s.done) fb(s.got ? '<b>Correct!</b>' : '<b>The answer is ' + esc(q.right) + '.</b>', s.got ? 'ok' : 'show');
    [].forEach.call(host.querySelectorAll('.scr-b'), function (b) { b.onclick = function () { pick(i, ORDER[i][+b.dataset.k], b); }; });
    document.getElementById('scr-hint').onclick = function () { fb('<b>Hint:</b> ' + esc(q.hint), 'hint'); };
    document.getElementById('scr-back').onclick = function () { if (i > 0) show(i - 1); };
    document.getElementById('scr-next').onclick = function () { if (i < N - 1) show(i + 1); else results(); };
  }
  function fb(html, kind) { var f = document.getElementById('scr-fb'); f.className = 'scr-fb ' + kind; f.innerHTML = html; }
  function pick(i, c, btn) {
    var s = st[i]; if (s.done || s.out[c.t]) return;
    if (window.ScoreSend) ScoreSend.record('q' + (i + 1), !!c.ok, { band: 3 });
    if (c.ok) { s.done = true; s.got = true; if (s.first === null) s.first = true; save(); show(i); return; }
    if (s.first === null) s.first = false;
    s.miss++; s.out[c.t] = 1; btn.classList.add('x'); btn.disabled = true; save();
    if (s.miss >= 3) { s.done = true; show(i); fb('<b>Not yet.</b> ' + esc(c.why) + '<br><b>The answer is ' + esc(D.qs[i].right) + '.</b>', 'show'); return; }
    fb('<b>Not yet.</b> ' + esc(c.why) + ' Try again.', 'no');
    host.querySelector('.scr-dots').outerHTML = dots();
  }
  function results() {
    cur = -1;
    var ready = [], warm = [], skipped = 0;
    var bySkill = {}, order = [];       /* one line per skill: ready only if every question on it was right the first time */
    D.qs.forEach(function (q, i) { var s = st[i], ok = !!s.first && s.done; if (!s.done && !s.miss) skipped++;
      if (!bySkill[q.skill]) { bySkill[q.skill] = { q: q, ok: true }; order.push(q.skill); } if (!ok) { bySkill[q.skill].ok = false; bySkill[q.skill].q = q; } });
    order.forEach(function (k) { (bySkill[k].ok ? ready : warm).push(bySkill[k].q); });
    var seen = {}, h = '<div class="scr-card scr-res"><div class="scr-k">Unit ' + D.unit + ' · Quick Check results</div>' +
      '<h1>' + (warm.length ? 'Here is your plan' : 'You are ready for Unit ' + D.unit + '!') + '</h1>';
    if (ready.length) h += '<h3 class="rh ok">Ready</h3><ul class="rl">' + ready.map(function (q) { return '<li>' + esc(q.skill) + '</li>'; }).join('') + '</ul>';
    if (warm.length) h += '<h3 class="rh warm">Warm up on these first</h3><ul class="rl warm">' + warm.map(function (q) {
      var link = seen[q.review.h] ? '' : ' <a href="' + esc(q.review.h) + '">' + esc(q.review.t) + ' →</a>'; seen[q.review.h] = 1;
      return '<li><b>' + esc(q.skill) + '</b>' + link + '</li>'; }).join('') + '</ul>';
    if (skipped) h += '<p class="scr-note">You skipped ' + skipped + (skipped === 1 ? ' question' : ' questions') + '. You can go back and answer ' + (skipped === 1 ? 'it' : 'them') + '.</p>';
    h += '<p class="scr-note">Send your results to Mr. Allen below, then start the unit.</p><div class="scr-nav">' +
      '<button class="scr-nb" id="scr-again">← Go back to the questions</button><a class="scr-nb go" href="unit' + D.unit + '.html#notes">Start Unit ' + D.unit + ' →</a></div></div>';
    host.innerHTML = h;
    document.getElementById('scr-again').onclick = function () { show(0); };
  }
  if (/[?&]key=1/.test(location.search)) {        // teacher view: every question with its answer
    host.innerHTML = '<div class="scr-card"><h1>Unit ' + D.unit + ' Quick Check · answers</h1><ol>' + D.qs.map(function (q) {
      return '<li><b>' + esc(q.q) + '</b> → ' + esc(q.right) + ' <span class="scr-skill">(' + esc(q.skill) + ')</span></li>'; }).join('') + '</ol></div>';
  } else intro();
})();
