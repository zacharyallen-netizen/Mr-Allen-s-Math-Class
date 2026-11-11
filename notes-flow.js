/* loads student-fx.js (flash, sounds, matching buttons) once per page */
(function () { try { if (window.FX || document.getElementById('fx-js')) return; var s = document.createElement('script'); s.id = 'fx-js';
  s.src = new URL('student-fx.js?v=20261111b', document.currentScript.src).href; document.head.appendChild(s); } catch (e) {} })();
/* notes-flow.js — Interactive Notes, one section at a time + "try a similar one" (Nov 2026).

   1) ONE SECTION AT A TIME
      The floating topic bar is hidden. The page shows one section, a progress bar
      ("Section 3 of 9 · Distributive Property") and Back / Next. Nothing is locked:
      students can move through the notes on their own (practice at home).
      The page remembers the last section on this device (localStorage "nf:<page>").
      Paper copies (?paper=1) and printing show every section.
      Sections: section.topic (default; tutorials/reviews use { sections: 'section.part', word: 'Part', between: '.unitdiv' }). A page can set window.NF = { sections: '.tab-pane', active: true, hook: 'switchTab' }
      before this script (active: true = the page's CSS shows a section with class "active"; hook = the page's own
      tab/section function, so its in-page buttons still work).

   2) TRY A SIMILAR ONE
      A wrong answer on a checked question shows the right answer, locks that question, and opens a
      similar problem (new numbers) under it. One try on the similar problem:
        right → recorded as fixed (final = 1)      wrong → answer + steps shown, recorded as missed twice
      Twins live in grade8/twins/<page>.js as window.NOTE_TWINS = { '<question id>': {...} }.
        np-q (notes-practice.js):  { p:'prompt html', a:'6|x=6', show:'6', sol:'steps html', choices:['A','B'], tol:0.1, fig:'html' }
        chk (multiple choice):     { p, choices:['…'], a:'right choice text', fig }
        chkVal (typed):            { p, a:['5','x=5'], fig }
        chkInput (point):          { p, xy:[2,-1], fig }
      chk / chkVal / chkInput twins reuse the page's own checker, so they are checked exactly like the original.
      Figures in twins (data-geo, data-tx, data-eq, data-vw, data-fig, data-fn) are drawn by the page's own drawing scripts.
      Questions without a twin work as before.
      Recording (ScoreSend): the original's first try is kept; the similar problem sets "final".
      In the Sheet: First try 0 + Final 0 + Tries 2 = missed both (flagged). */
(function () {
  var paper = /[?&]paper=1/.test(location.search);
  var css = document.createElement('style');
  css.textContent =
    '.nf-top,.nf-bot,.tw,.tw *{box-sizing:border-box}' +
    '.nf-top{display:flex;flex-wrap:wrap;align-items:center;gap:6px 14px;margin:6px 0 12px;scroll-margin-top:70px;font-family:Inter,system-ui,sans-serif;color:#1E2D4F}' +
    '.nf-count{font:700 16px Inter,system-ui,sans-serif;white-space:nowrap}' +
    '.nf-title{font:600 15px Inter,system-ui,sans-serif;color:#5B6576;flex:1 1 180px;min-width:0}' +
    '.nf-bar{flex:1 1 100%;height:10px;border-radius:99px;background:#E3E5EA;overflow:hidden}' +
    '.nf-bar i{display:block;height:100%;background:#FFC107;border-radius:99px;transition:width .3s}' +
    '.nf-bot{display:flex;flex-wrap:wrap;gap:10px;justify-content:space-between;align-items:center;margin:16px 0 22px}' +
    '.nf-btn{font:700 16px Inter,system-ui,sans-serif;min-height:48px;padding:10px 20px;border-radius:10px;cursor:pointer;border:2px solid #1E2D4F;background:#fff;color:#1E2D4F;max-width:100%;white-space:normal;text-align:center}' +
    '.nf-top{flex-wrap:wrap}.nf-top .nf-title{white-space:normal!important;overflow-wrap:anywhere;min-width:0;max-width:100%}' +
    '.nf-bot .nf-btn{max-width:100%!important;white-space:normal!important;overflow-wrap:anywhere;text-align:center;min-width:0}' +
    '.nf-btn.go{background:#FFC107;border-color:#FFC107}.nf-btn.go:hover{background:#E0A800;border-color:#E0A800}' +
    '.nf-btn:disabled{visibility:hidden}' +
    '.nf-btn:focus-visible{outline:3px solid #2747A0;outline-offset:2px}' +
    '.nf-done{font:600 15px Inter,system-ui,sans-serif;color:#15803D}' +
    '@media print{.nf-top,.nf-bot{display:none!important}.nf-hide{display:block!important}}' +
    /* similar problem */
    '.tw{margin:12px 0 4px;padding:12px 14px;border:2px dashed #E0A800;border-radius:12px;background:#FFFBEA;font-family:Inter,system-ui,sans-serif}' +
    '.tw-h{font:700 15px Inter,system-ui,sans-serif;color:#1E2D4F;margin:0 0 4px}' +
    '.tw-h small{font-weight:500;color:#5B6576}' +
    '.tw .chk{margin:6px 0 0;border:0;padding:0;background:transparent;box-shadow:none}' +
    '.tw-fig{margin:6px 0;text-align:center;max-width:100%;overflow-x:auto}.tw-fig svg{max-width:100%;height:auto}' +
    '.tw.done-ok{border-style:solid;border-color:#15803D;background:#F0FAF3}' +
    '.tw.done-no{border-style:solid;border-color:#B45309}' +
    'body.paper .tw{display:none!important}';
  document.head.appendChild(css);

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function draw(el) {
    try { if (window.GEO) GEO.drawAll(el); } catch (e) {}
    try { if (window.TX) TX.drawAll(el); } catch (e) {}
    try { if (window.EQV) EQV.drawAll(el); } catch (e) {}
    try { if (window.VWORK) VWORK.drawAll(el); } catch (e) {}
    try { if (window.PFIG) PFIG.drawAll(el); } catch (e) {}
    try { if (window.FNV) FNV.drawAll(el); } catch (e) {}
  }
  function twinFor(id) { var T = window.NOTE_TWINS; return T && T[id] ? T[id] : null; }
  function record(id, ok, flag) { try { if (window.ScoreSend) ScoreSend.record(id, ok, flag ? { flag: true } : {}); } catch (e) {} }
  var HEAD = '<div class="tw-h">Try a similar one <small>· one try</small></div>';

  /* ---------- 2a. chk / chkVal / chkInput (the page's own checkers) ---------- */
  var BASE = {};          // twin id → original id
  var opened = {};        // original id → twin box opened
  function lockBox(id) {
    var box = document.getElementById(id); if (!box) return;
    box.querySelectorAll('input,button.chk-btn,.val-chk button,.input-chk button').forEach(function (e) { e.disabled = true; });
  }
  function fbWrong(id) { var fb = document.getElementById('fb-' + id); return !!(fb && fb.classList.contains('w')); }
  function openTwin(id, kind) {
    var tw = twinFor(id); if (!tw || opened[id]) return;
    opened[id] = true;
    var t = id + '_t'; BASE[t] = id;
    var box = document.getElementById(id); if (!box) return;
    var h = HEAD + '<div class="chk" id="' + t + '"><div class="chk-q">' + tw.p + '</div>' + (tw.fig ? '<div class="tw-fig">' + tw.fig + '</div>' : '');
    if (kind === 'chk') {
      h += '<div class="chk-opts">' + tw.choices.map(function (c) {
        return '<button class="chk-btn" data-c="' + esc(c) + '">' + c + '</button>'; }).join('') + '</div>';
    } else if (kind === 'chkVal') {
      var oi = document.getElementById(id + '-in'), ph = tw.ph || (oi && oi.getAttribute('placeholder')) || 'answer';
      h += '<div class="val-chk"><input type="text" id="' + t + '-in" placeholder="' + esc(ph) + '" autocomplete="off"' +
        (tw.ineq ? ' data-ineq' : '') + '><button type="button" class="tw-go">Check</button></div>';
    } else {
      h += '<div class="input-chk"><span class="label">(</span><input type="text" id="' + t + '-x" placeholder="x"><span class="label">,</span>' +
        '<input type="text" id="' + t + '-y" placeholder="y"><span class="label">)</span><button type="button" class="tw-go">Check</button></div>';
    }
    h += '<div class="chk-fb" id="fb-' + t + '"' + (tw.why ? ' data-hint="' + esc(tw.why) + '"' : '') + '></div>' +
      (tw.after ? '<div class="tw-after" style="display:none">' + tw.after + '</div>' : '') + '</div>';
    var wrap = document.createElement('div'); wrap.className = 'tw'; wrap.innerHTML = h;
    var host = box.closest('.chk-graph-text') ? box : box;
    host.insertAdjacentElement('afterend', wrap);
    if (kind === 'chk') {
      wrap.querySelectorAll('.chk-btn').forEach(function (b) {
        b.onclick = function () { window.chk(t, tw.a, b.getAttribute('data-c')); };
      });
      var fb0 = wrap.querySelector('.chk-fb'); if (tw.why) fb0.textContent = tw.why;
    } else {
      var go = wrap.querySelector('.tw-go');
      go.onclick = function () { kind === 'chkVal' ? window.chkVal(t, [].concat(tw.a)) : window.chkInput(t, tw.xy); };
      wrap.querySelectorAll('input').forEach(function (i) { i.onkeydown = function (e) { if (e.key === 'Enter') go.onclick(); }; });
    }
    draw(wrap);
  }
  function twinDone(t) {
    var id = BASE[t], ok = !fbWrong(t), fb = document.getElementById('fb-' + t);
    if (fb && /Type your answer|Enter a number/.test(fb.textContent)) return;     // empty box: not a try
    lockBox(t);
    var wrap = document.getElementById(t).closest('.tw');
    wrap.classList.add(ok ? 'done-ok' : 'done-no');
    var after = wrap.querySelector('.tw-after'); if (after) { after.style.display = ''; draw(after); }
    if (ok && fb) fb.innerHTML = '✓ Correct! You fixed it. ' + fb.innerHTML.replace(/^✓\s*(Correct!)?\s*/, '');
    record(id, ok, !ok);
  }
  function wrapCheckers() {
    ['chk', 'chkVal', 'chkInput'].forEach(function (name) {
      var orig = window[name]; if (typeof orig !== 'function' || orig.__nf) return;
      var f = function (qid) {
        var a = arguments;
        if (BASE[qid]) {                                  // the similar problem: one try
          var tb = document.getElementById(qid), w = tb && tb.closest('.tw');
          if (w && (w.classList.contains('done-ok') || w.classList.contains('done-no'))) return;
          var r = orig.apply(this, a); twinDone(qid); return r;
        }
        if (opened[qid]) return;                          // original is locked once its twin is open
        if (name === 'chkVal') { var inp = document.getElementById(qid + '-in'); if (inp && !inp.value.trim()) return orig.apply(this, a); }
        if (name === 'chkInput') { var ix = document.getElementById(qid + '-x'), iy = document.getElementById(qid + '-y'); if (ix && iy && (!ix.value.trim() || !iy.value.trim())) return orig.apply(this, a); }
        var res = orig.apply(this, a);
        if (fbWrong(qid) && twinFor(qid)) {
          if (name === 'chkInput' && String(orig).indexOf('ssRec') < 0) record(qid, false);   // this page's chkInput does not record on its own
          lockBox(qid); openTwin(qid, name);
        }
        return res;
      };
      f.__nf = true; window[name] = f;
    });
    var ss = window.ssRec;                                // twins record through record() above, not ssRec
    if (typeof ss === 'function' && !ss.__nf) { var g = function (qid) { if (BASE[qid]) return; return ss.apply(this, arguments); }; g.__nf = true; window.ssRec = g; }
  }

  /* ---------- 2b. notes-practice (np-q) twins: called by notes-practice.js ---------- */
  function npTwin(q, id, tw, same, show) {
    var wrap = document.createElement('div'); wrap.className = 'tw';
    var h = HEAD + '<div class="np-prompt">' + tw.p + '</div>' + (tw.fig ? '<div class="tw-fig">' + tw.fig + '</div>' : '') + '<div class="np-row"></div>' +
      (tw.sol ? '<div class="np-sol">' + tw.sol + '</div>' : '');
    wrap.innerHTML = h; q.appendChild(wrap);
    var row = wrap.querySelector('.np-row'), sol = wrap.querySelector('.np-sol');
    var fb = document.createElement('span'); fb.className = 'np-fb'; fb.setAttribute('aria-live', 'polite');
    var answers = String(tw.a == null ? '' : [].concat(tw.a).join('|')).split('|'), shown = tw.show || answers[0], done = false;
    function finish(ok) {
      done = true; wrap.classList.add(ok ? 'done-ok' : 'done-no');
      row.querySelectorAll('input,button').forEach(function (e) { e.disabled = true; });
      if (ok) { fb.className = 'np-fb ok'; fb.textContent = '✓ Correct! You fixed it.'; }
      else { fb.className = 'np-fb no'; fb.textContent = 'Not quite. The answer is ' + shown + '. Read the steps below.'; if (sol) sol.classList.add('show'); }
      record(id, ok, !ok);
    }
    if (tw.choices) {
      tw.choices.forEach(function (c) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'np-ch'; b.innerHTML = c;
        b.onclick = function () { if (done) return; var ok = same(b.textContent, answers[0]); b.classList.add(ok ? 'ok' : 'no'); finish(ok); };
        row.appendChild(b);
      });
    } else {
      var inp = document.createElement('input'); inp.className = 'np-in'; inp.type = 'text'; inp.autocomplete = 'off';
      inp.setAttribute('aria-label', 'Your answer'); inp.placeholder = tw.ph || q.getAttribute('data-ph') || 'Your answer';
      if (tw.ineq) inp.setAttribute('data-ineq', '');
      var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'np-btn'; btn.textContent = 'Check';
      var tol = +tw.tol || 0;
      var go = function () { if (done || !inp.value.trim()) return; finish(answers.some(function (a) { return same(inp.value, a, tol); })); };
      btn.onclick = go; inp.onkeydown = function (e) { if (e.key === 'Enter') go(); };
      row.appendChild(inp); row.appendChild(btn);
    }
    row.appendChild(fb);
    draw(wrap);
  }
  window.NotesTwin = { get: twinFor, np: npTwin };

  /* ---------- 1. one section at a time ---------- */
  function sections() {
    var cfg = window.NF || {};
    return Array.prototype.slice.call(document.querySelectorAll(cfg.sections || 'section.topic'));
  }
  function titleOf(s) {
    if (s.getAttribute('data-nf-title')) return s.getAttribute('data-nf-title');
    var h = s.querySelector('h2,h3'); if (!h) return '';
    var c = h.cloneNode(true); c.querySelectorAll('.num').forEach(function (n) { n.remove(); });
    return c.textContent.replace(/\s+/g, ' ').trim();
  }
  function flow() {
    if (paper) return;
    var S = sections(); if (S.length < 2) return;
    var cfg = window.NF || {};
    document.querySelectorAll('.topic-nav,nav.topics,.section-nav,.tabs,.nf-hide-nav').forEach(function (n) { n.style.display = 'none'; });
    var KEY = 'nf:' + location.pathname, cur = 0, origHook = null;
    try { cur = Math.max(0, Math.min(S.length - 1, +localStorage.getItem(KEY) || 0)); } catch (e) {}
    var top = document.createElement('div'); top.className = 'nf-top'; top.id = 'nf-top';
    top.innerHTML = '<span class="nf-count"></span><span class="nf-title"></span><div class="nf-bar" aria-hidden="true"><i></i></div>';
    S[0].parentNode.insertBefore(top, S[0]);
    var bot = document.createElement('div'); bot.className = 'nf-bot';
    bot.innerHTML = '<button type="button" class="nf-btn nf-back">← Back</button><button type="button" class="nf-btn go nf-next">Next →</button>';
    function show(i, scroll) {
      cur = Math.max(0, Math.min(S.length - 1, i));
      S.forEach(function (s, k) {
        var on = k === cur;
        s.classList.toggle('nf-hide', !on);
        s.style.display = on ? '' : 'none';
        if (cfg.active) s.classList.toggle('active', on);
      });
      S[cur].insertAdjacentElement('afterend', bot);
      top.querySelector('.nf-count').textContent = (cfg.word || 'Section') + ' ' + (cur + 1) + ' of ' + S.length;
      top.querySelector('.nf-title').textContent = titleOf(S[cur]);
      top.querySelector('.nf-bar i').style.width = Math.round(100 * (cur + 1) / S.length) + '%';
      var back = bot.querySelector('.nf-back'), next = bot.querySelector('.nf-next');
      back.disabled = cur === 0;
      if (cur === S.length - 1) { next.disabled = true; }
      else { next.disabled = false; var t = titleOf(S[cur + 1]); next.textContent = 'Next' + (t ? ': ' + t : '') + ' →'; }
      try { localStorage.setItem(KEY, cur); } catch (e) {}
      if (origHook) {                                    // keep the page's own state in step (without its own scrolling)
        var st = window.scrollTo; window.scrollTo = function () {};
        try { origHook(cfg.hookArg === 'id' ? S[cur].id : cur); } catch (e) {}
        window.scrollTo = st;
      }
      if (cfg.between) [].forEach.call(S[0].parentNode.children, function (el) { if (S.indexOf(el) >= 0 || !el.matches(cfg.between)) return; var n = el.nextElementSibling; while (n && S.indexOf(n) < 0) n = n.nextElementSibling; el.style.display = n === S[cur] ? '' : 'none'; });
      if (cfg.onShow) try { cfg.onShow(S[cur], cur); } catch (e) {}
      try { window.dispatchEvent(new Event('resize')); } catch (e) {}
      if (scroll) top.scrollIntoView({ block: 'start' });
    }
    if (cfg.hook && typeof window[cfg.hook] === 'function') {      // the page's own tab/section switcher (e.g. switchTab, goSection)
      origHook = window[cfg.hook];
      window[cfg.hook] = function (key) {
        var r = origHook.apply(this, arguments);
        var k = typeof key === 'number' ? key : S.findIndex(function (s) { return s.id === key; });
        if (k >= 0 && k !== cur) show(k, true);
        return r;
      };
    }
    bot.querySelector('.nf-back').onclick = function () { show(cur - 1, true); };
    bot.querySelector('.nf-next').onclick = function () { show(cur + 1, true); };
    function toHash(h, scroll) {
      if (!h || h.length < 2) return false;
      var el; try { el = document.querySelector(h); } catch (e) { return false; }
      if (!el) return false;
      for (var k = 0; k < S.length; k++) if (S[k] === el || S[k].contains(el)) {
        show(k, false); if (scroll) (S[k] === el ? top : el).scrollIntoView({ block: 'start' }); return true;
      }
      return false;
    }
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
      if (toHash(a.getAttribute('href'), true)) e.preventDefault();
    });
    window.addEventListener('hashchange', function () { toHash(location.hash, true); });
    if (!toHash(location.hash, true)) show(cur, false);
    window.NotesFlow = { show: function (i) { show(i, true); }, count: S.length, current: function () { return cur; } };
  }
  function init() { wrapCheckers(); flow(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
