/* ONE PROBLEM AT A TIME inside a part (Mr. Allen, Nov 11, 2026: "the screen should focus on one problem at a time").
   The tutorials show one PART at a time (notes-flow.js), but a part can hold several questions in a row. This script
   shows ONE of them, with "Problem 2 of 5", dots (green = answered) and Back / Next. Nothing is locked, and checking,
   scoring and sending are unchanged: it only hides and shows.
   What gets paged: a RUN of 2 or more question blocks that sit next to each other in the same box (.q, .card or .chk
   blocks, the Unit 6 .practice-block boxes or .problem blocks (Unit 6 table practice), that hold an answer: choice buttons, a typed box or a dropdown). Questions with teaching text between them are
   left alone. A "Try a similar one" box stays with its question.
   It also gives every question a Hint button if it has none (tap-answers.js writes it from the question's words).
   ?paper=1, ?key=1 and print show everything. */
(function () {
  "use strict";
  if (/[?&](paper|key)=1/.test(location.search)) return;
  var here = document.currentScript && document.currentScript.src;
  var SEL = '.q, .card, .chk, .q-card, .practice-block, .problem', WIDGET = 'input:not([type=hidden]):not([type=checkbox]), select, textarea, button.opt, button.choice, .chk-btn, .ta-row, .opts button, .choices button, .opt-btn';
  var st = document.createElement('style');
  st.textContent = '@media screen{.oip-x{display:none!important}}' +
    '.oip-bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin:12px 0 16px;padding:10px 12px;background:#fff;border:1px solid #E3E5EA;border-radius:10px;font-family:Inter,system-ui,sans-serif;color:#1E2D4F}' +
    '.oip-bar .n{font:700 15px Inter,system-ui,sans-serif}.oip-bar .sp{flex:1 1 10px}.oip-dots{display:inline-flex;gap:5px;flex-wrap:wrap}.oip-dots i{width:10px;height:10px;border-radius:50%;background:#D5D9E0;display:block}' +
    '.oip-dots i.on{background:#1E2D4F}.oip-dots i.ok{background:#15803D}.oip-dots i.on.ok{box-shadow:0 0 0 2px #1E2D4F}' +
    '.oip-btn{font:700 15px Inter,system-ui,sans-serif;min-height:44px;padding:8px 16px;border-radius:9px;cursor:pointer;border:2px solid #1E2D4F;background:#fff;color:#1E2D4F}.oip-btn.go{background:#FFC107;border-color:#FFC107}' +
    '.oip-btn:disabled{opacity:.35;cursor:default}.oip-btn:focus-visible{outline:3px solid #2747A0;outline-offset:2px}.oip-hint{margin:10px 0 0}' +
    '@media print{.oip-bar,.oip-hint{display:none!important}}';
  document.head.appendChild(st);

  function isQ(el) { return el.nodeType === 1 && el.matches(SEL) && !el.classList.contains('oip-bar') && !el.closest('.tw, .np, #scoresend, .sw-host, .oat-end') && !!el.querySelector(WIDGET); }
  function skip(el) { return el.nodeType !== 1 || /^(SCRIPT|STYLE|BR|TEMPLATE)$/.test(el.tagName) || el.classList.contains('tw') || el.classList.contains('oip-bar') || el.classList.contains('ik-row'); }
  function answered(el) {
    if (/\b(done|answered|correct|solved|right|locked)\b/.test(el.className)) return true;
    return [].some.call(el.querySelectorAll('input, select, button.opt, button.choice, .chk-btn, .opt-btn'), function (i) { return i.tagName === 'BUTTON' ? i.disabled || /\b(correct|wrong|sel|picked|chosen|ok|no)\b/.test(i.className) : (!i.closest('.sw-host') && String(i.value || '').trim() !== ''); });
  }
  function pager(items) {
    var cur = 0, bar = document.createElement('div'); bar.className = 'oip-bar'; bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', 'Problems in this part');
    bar.innerHTML = '<span class="n" aria-live="polite"></span><span class="oip-dots" aria-hidden="true">' + items.map(function () { return '<i></i>'; }).join('') + '</span><span class="sp"></span>' +
      '<button type="button" class="oip-btn back">← Back</button><button type="button" class="oip-btn go next">Next problem →</button>';
    var dots = bar.querySelectorAll('.oip-dots i'), back = bar.querySelector('.back'), next = bar.querySelector('.next');
    function extras(it) { var out = [], s = it.nextElementSibling; while (s && !isQ(s) && skip(s)) { if (s !== bar) out.push(s); s = s.nextElementSibling; } return out; }   // its "Try a similar one"
    function paint() { [].forEach.call(dots, function (d, k) { d.classList.toggle('on', k === cur); d.classList.toggle('ok', answered(items[k])); }); }
    function show(i, scroll) {
      cur = Math.max(0, Math.min(items.length - 1, i));
      items.forEach(function (it, k) { it.classList.toggle('oip-x', k !== cur); extras(it).forEach(function (e) { e.classList.toggle('oip-x', k !== cur); }); });
      var ex = extras(items[cur]), at = ex.length ? ex[ex.length - 1] : items[cur]; at.insertAdjacentElement('afterend', bar);
      bar.querySelector('.n').textContent = 'Problem ' + (cur + 1) + ' of ' + items.length; back.disabled = cur === 0; next.disabled = cur === items.length - 1; paint();
      if (scroll) { try { items[cur].scrollIntoView({ block: 'start', behavior: window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); } catch (e) {} }
    }
    back.addEventListener('click', function () { show(cur - 1, true); }); next.addEventListener('click', function () { show(cur + 1, true); });
    items[0].parentNode.addEventListener('click', function () { setTimeout(function () { var ex = extras(items[cur]), at = ex.length ? ex[ex.length - 1] : items[cur]; if (bar.previousElementSibling !== at) at.insertAdjacentElement('afterend', bar); paint(); }, 80); });
    items.forEach(function (it) { it.addEventListener('change', function () { setTimeout(paint, 50); }); });
    show(0, false);
    return { go: show, count: items.length };
  }
  var PAGERS = [], ALL = [];   // ALL: every paged problem, in page order → Send my work lists the skipped ones
  (window.__skipLists = window.__skipLists || []).push({ word: 'Problem', items: function () { return ALL.slice().sort(function (a, b) { return a.compareDocumentPosition(b) & 2 ? 1 : -1; }); }, answered: answered });
  function scan() {
    var parents = [];
    [].forEach.call(document.querySelectorAll(SEL), function (q) { var pa = q.parentElement; if (pa && parents.indexOf(pa) < 0 && !pa.__oip) parents.push(pa); });
    parents.forEach(function (pa) {
      var runs = [], run = [];
      [].forEach.call(pa.children, function (c) { if (isQ(c)) run.push(c); else if (skip(c)) return; else { if (run.length > 1) runs.push(run); run = []; } });
      if (run.length > 1) runs.push(run);
      // a page that already shows one question at a time (its own cards start hidden with style="display:none") keeps its own pager
      runs = runs.filter(function (r) { return !r.some(function (el) { return el.style.display === 'none'; }); });
      if (!runs.length) return; pa.__oip = true;
      runs.forEach(function (r) { PAGERS.push(pager(r)); });
      runs.forEach(function (r) { ALL.push.apply(ALL, r); });
    });
    hints();
  }
  function hints() {
    if (!window.TapAnswers) return;
    [].forEach.call(document.querySelectorAll(SEL), function (it) {
      if (!isQ(it) || it.getAttribute('data-hint-set')) return; it.setAttribute('data-hint-set', '1');
      var has = [].some.call(it.querySelectorAll('button, summary'), function (b) { return /hint/i.test(b.textContent) || /hint/i.test(String(b.className)); }); if (has) return;
      var q = it.querySelector('.qt, .q-text, .stem, .chk-q, .prompt') || it, row = document.createElement('div'); row.className = 'oip-hint';
      row.appendChild(TapAnswers.hintButton(row, TapAnswers.hint('', (q.textContent || '').slice(0, 400)))); it.appendChild(row);
    });
  }
  function start() {
    scan(); setTimeout(scan, 800); setTimeout(scan, 2500);
    if (!window.TapAnswers && here) { var s = document.createElement('script'); s.src = new URL('tap-answers.js?v=20261111b', here).href; s.onload = hints; document.head.appendChild(s); }
  }
  if (document.readyState === 'complete') setTimeout(start, 50); else window.addEventListener('load', function () { setTimeout(start, 50); });
  window.OneInPart = { pagers: PAGERS, scan: scan };
})();
