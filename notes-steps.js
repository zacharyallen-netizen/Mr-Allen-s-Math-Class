/* ───────────────────────────────────────────────────────────────
   notes-steps.js — Interactive Notes (Nov 10, 2026, Mr. Allen's request):
   1. "Work it out step by step" (grade8/step-work.js) under every notes question where it fits:
      solve an equation / inequality, simplify exponents or scientific notation, Pythagorean, find x,
      volume radius / height. It fills the answer box; the page's own Check still checks it.
   2. ONE PROBLEM AT A TIME inside the notes: each ✏ Practice box and each Part 2 practice section
      shows one question with "Problem 2 of 5" and Back / Next, so students don't scroll through a list.
      Nothing is locked. Print and ?paper=1 show everything. The notes text itself is not changed.
   Load after notes-practice.js / notes-flow.js and step-work.js:
      <script src="step-work.js?v=…"></script><script src="../notes-steps.js?v=…"></script>
   ─────────────────────────────────────────────────────────────── */
(function () {
  if (window.__notesSteps) return; window.__notesSteps = true;
  var PAPER = /[?&]paper=1/.test(location.search);
  var m = location.pathname.match(/unit(\d)/), UNIT = m ? m[1] : /volume/.test(location.pathname) ? '9' : '';

  var css = document.createElement('style');
  css.textContent = '@media screen{.nsp-x{display:none!important}.nsp-on .two-col{display:block!important}.nsp-on .two-col>.chk{margin-bottom:10px}}' +
    '.nsp-bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin:10px 0 4px;font:600 15px Inter,system-ui,sans-serif;color:#1E2D4F}' +
    '.nsp-bar .n{white-space:nowrap}.nsp-dots{display:flex;gap:5px;flex-wrap:wrap}.nsp-dots i{width:10px;height:10px;border-radius:50%;background:#D5DAE3;display:inline-block}' +
    '.nsp-dots i.on{background:#1E2D4F}.nsp-dots i.ok{background:#15803D}.nsp-dots i.on.ok{box-shadow:0 0 0 2px #fff,0 0 0 4px #15803D}' +
    '.nsp-bar .sp{flex:1}.nsp-b{font:700 15px Inter,system-ui,sans-serif;min-height:44px;padding:8px 16px;border-radius:9px;border:2px solid #1E2D4F;background:#fff;color:#1E2D4F;cursor:pointer}' +
    '.nsp-b.go{background:#FFC107;border-color:#FFC107}.nsp-b:disabled{opacity:.35;cursor:default}.nsp-b:focus-visible{outline:3px solid #2747A0;outline-offset:2px}' +
    '.nsp-host{margin-top:6px}@media print{.nsp-bar,.nsp-host{display:none!important}}';
  document.head.appendChild(css);

  /* ---------- 1. step-by-step workspaces ---------- */
  function chkAnswer(box) {
    var b = box.querySelector('.val-chk button'), on = b && b.getAttribute('onclick') || '', a = on.match(/\[(.*)\]/);
    if (!a) return null; try { return JSON.parse('[' + a[1] + ']')[0]; } catch (e) { return null; }
  }
  function attach() {
    if (!window.StepWork || !StepWork.forProblem || PAPER) return;
    document.querySelectorAll('.np-q').forEach(function (q) {
      if (q.closest('.tw') || q.getAttribute('data-choices') || !q.getAttribute('data-ans')) return;
      var row = q.querySelector(':scope > .np-row'), inp = row && row.querySelector('.np-in'), pr = q.querySelector('.np-prompt'); if (!inp || !pr) return;
      var host = document.createElement('div'); host.className = 'sw-host nsp-host'; row.insertAdjacentElement('afterend', host);
      var w = null; try { w = StepWork.forProblem(host, { text: pr.innerHTML, ans: q.getAttribute('data-ans').split('|')[0], unit: UNIT, figure: !!q.querySelector('svg,.geo,.graph-area,.fnfig,.pfig'), inp: inp }); } catch (e) { w = null; }
      if (!w) host.remove();
    });
    document.querySelectorAll('.chk').forEach(function (box) {
      if (box.closest('.tw') || box.closest('.np-q')) return;
      var vc = box.querySelector('.val-chk'), inp = vc && vc.querySelector('input'), qq = box.querySelector('.chk-q'); if (!inp || !qq) return;
      var ans = chkAnswer(box); if (ans == null) return;
      var host = document.createElement('div'); host.className = 'sw-host nsp-host'; vc.insertAdjacentElement('afterend', host);
      var w = null; try { w = StepWork.forProblem(host, { text: qq.innerHTML, ans: ans, unit: UNIT, figure: !!box.querySelector('svg,.vfig,.geo,.pfig'), inp: inp }); } catch (e) { w = null; }
      if (!w) host.remove();
    });
  }

  /* ---------- 2. one problem at a time ---------- */
  function isItem(el) { return el.classList.contains('np-q') || el.classList.contains('sa') || (el.classList.contains('chk') && !!el.querySelector('.val-chk,.chk-opts,.input-chk,.chk-btn')) ||
    (el.classList.contains('practice-block') && !!el.querySelector('input, select, button')); }       // Unit 6 "Try It" graph / table blocks
  function itemsIn(root) { return [].filter.call(root.querySelectorAll('.np-q, .chk, .sa, .practice-block'), function (el) { return isItem(el) && !el.closest('.tw') && !(el.parentElement && el.parentElement.closest('.np-q, .chk, .sa, .practice-block')); }); }
  function done(el) {
    if (el.classList.contains('solved')) return true;
    // a .chk-fb often holds its "✓ …" explanation from the start (hidden until answered): it counts only once it is SHOWN
    var fb = el.querySelector('.chk-fb, .np-fb'); if (!fb || !fb.textContent.trim()) return false;
    if (fb.classList.contains('chk-fb')) return fb.classList.contains('show') && /\b(c|w)\b/.test(fb.className);
    return /\b(ok|no)\b/.test(fb.className);
  }
  if (!PAPER) (window.__skipLists = window.__skipLists || []).push({ word: 'Problem', items: function () { return itemsIn(document.body).filter(function (el) { return !el.classList.contains('sa'); }); }, answered: done });   // skipped problems → Send my work

  function pager(root, items, leadFor) {
    if (items.length < 2) return;
    root.classList.add('nsp-on');
    var cur = 0, bar = document.createElement('div'); bar.className = 'nsp-bar';
    bar.innerHTML = '<span class="n" aria-live="polite"></span><span class="nsp-dots" aria-hidden="true">' + items.map(function () { return '<i></i>'; }).join('') + '</span><span class="sp"></span>' +
      '<button type="button" class="nsp-b back">← Back</button><button type="button" class="nsp-b go next">Next problem →</button>';
    var dots = bar.querySelectorAll('.nsp-dots i');
    bar.querySelector('.back').onclick = function () { show(cur - 1, true); };
    bar.querySelector('.next').onclick = function () { show(cur + 1, true); };
    var tops = leadFor ? [].slice.call(root.children) : [];
    function show(i, scroll) {
      cur = Math.max(0, Math.min(items.length - 1, i));
      items.forEach(function (it, k) {
        it.classList.toggle('nsp-x', k !== cur);
        var nx = it.nextElementSibling; if (nx && nx.classList.contains('tw')) nx.classList.toggle('nsp-x', k !== cur);   // its "similar problem"
      });
      if (leadFor) {   // Part 2 sections: show the heading / directions that lead into this problem, hide the other groups
        var keep = leadFor(items[cur]);
        tops.forEach(function (c) { if (c === bar) return; var has = items.some(function (it) { return c === it || c.contains(it); }); c.classList.toggle('nsp-x', keep.indexOf(c) < 0 && (has || c.matches('h3, .blank-tip, .np-h') || c.classList.contains('lead-hidable'))); });
      }
      // a section paged as one run (check question + ✏ Practice box): the Practice frame shows only when one of its questions is up
      items.forEach(function (x) { var np = x.parentElement && x.parentElement.closest('.np'); if (np && root.contains(np) && np !== root) np.classList.toggle('nsp-x', !np.contains(items[cur])); });
      var it = items[cur]; place();
      bar.querySelector('.n').textContent = 'Problem ' + (cur + 1) + ' of ' + items.length;
      bar.querySelector('.back').disabled = cur === 0; bar.querySelector('.next').disabled = cur === items.length - 1;
      [].forEach.call(dots, function (d, k) { d.classList.toggle('on', k === cur); d.classList.toggle('ok', done(items[k])); });
      if (scroll) { var r = it.getBoundingClientRect(); if (r.top < 70 || r.top > innerHeight * 0.6) it.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    }
    function place() { var it = items[cur], nx = it.nextElementSibling, at = nx && nx.classList.contains('tw') ? nx : it; if (bar.previousElementSibling !== at) at.insertAdjacentElement('afterend', bar); }   // below its "similar problem" too
    root.addEventListener('click', function () { setTimeout(function () { place(); [].forEach.call(dots, function (d, k) { d.classList.toggle('ok', done(items[k])); }); }, 60); });
    var first = 0; while (first < items.length - 1 && done(items[first])) first++;
    show(first, false);
  }
  function partTwo(sec) { return /^practice/.test(sec.id || '') || /Part 2/i.test((sec.querySelector('h2') || {}).textContent || ''); }
  function paginate() {
    if (PAPER) return;
    var used = [];
    // Part 2 practice sections: one problem at a time across the whole section
    document.querySelectorAll('section.topic').forEach(function (sec) {
      if (!partTwo(sec)) return;
      var items = itemsIn(sec); if (items.length < 2) return; used = used.concat(items);
      var kids = [].slice.call(sec.children);
      pager(sec, items, function (it) {
        var top = kids.filter(function (c) { return c === it || c.contains(it); })[0], i = kids.indexOf(top), keep = [top];
        for (var j = i - 1; j >= 0; j--) { var c = kids[j]; if (itemsIn(c).length || isItem(c)) break; keep.push(c); if (c.matches('h3')) break; }
        var np = it.closest('.np'); if (np) { var h = np.querySelector('.np-h'); if (h) keep.push(h); }
        return keep;
      });
    });
    // a notes section that has its own check question(s) AND a ✏ Practice box (Nov 11, 2026): one problem at a time across
    // the whole section, the check first, then the practice questions (before, both showed together)
    document.querySelectorAll((window.NF && window.NF.sections) || 'section.topic').forEach(function (sec) {
      if (partTwo(sec)) return;
      var items = itemsIn(sec).filter(function (x) { return used.indexOf(x) < 0; });
      var inNp = items.filter(function (x) { return x.closest('.np'); }), out = items.filter(function (x) { return !x.closest('.np'); });
      var blocks = out.filter(function (x) { return x.classList.contains('practice-block'); });
      if (items.length < 2 || !((inNp.length && out.length) || blocks.length >= 2)) return;
      used = used.concat(items); pager(sec, items, null);
    });
    // a run of questions side by side in the notes (e.g. Unit 8 P1–P3): one at a time
    var parents = [];
    document.querySelectorAll('.chk').forEach(function (c) { var pa = c.parentElement; if (pa && parents.indexOf(pa) < 0 && !pa.closest('.np')) parents.push(pa); });
    parents.forEach(function (pa) {
      var items = [].filter.call(pa.children, function (c) { return c.classList.contains('chk') && isItem(c) && used.indexOf(c) < 0; });
      if (items.length >= 2) { used = used.concat(items); pager(pa, items, null); }
    });
    // every other ✏ Practice box: one question at a time inside the box
    document.querySelectorAll('.np').forEach(function (np) {
      var items = [].filter.call(np.querySelectorAll(':scope > .np-q'), function (q) { return used.indexOf(q) < 0; });
      pager(np, items, null);
    });
  }
  function run() { try { attach(); } catch (e) { if (window.console) console.error(e); } try { paginate(); } catch (e) { if (window.console) console.error(e); } }
  if (document.readyState === 'complete') setTimeout(run, 0); else window.addEventListener('load', function () { setTimeout(run, 0); });
})();
