/* loads student-fx.js (flash, sounds, matching buttons) once per page */
(function () { try { if (window.FX || document.getElementById('fx-js')) return; var s = document.createElement('script'); s.id = 'fx-js';
  s.src = new URL('../student-fx.js?v=20261112b', document.currentScript.src).href; document.head.appendChild(s); } catch (e) {} })();
/* One problem at a time (Nov 2026) for every practice page and pre-test.
   Shows the current problem with the headings and directions that lead into it, a "Problem 3 of 22" bar,
   Back / Next buttons and a finish screen. Everything after the last problem (Send my work, typing tips)
   waits for the finish screen. "Show all problems" switches back to the long page. Printing shows everything.
   Nothing about the problems, checking, scoring or sending changes: this script only hides and shows. */
(function () {
  if (window.__oat) return; window.__oat = true;

  // Each page format: where its problems live and what counts as one problem.
  var FORMATS = [
    { root: '#practice', items: '.pr-card' },                                          // practice engine pages
    { root: '#doMode', items: '#pages > section.pg', need: '#pages > section.pg' },     // homework: one printed page at a time
    { root: '.sheet', items: '.qgrid > .q, .vq, table.vocab:not(.vq-hide), .fillparts', need: '.qgrid' },  // pre-tests
    { root: '#quiz', items: 'section.q' },                                              // Unit 1 pre-tests
    { root: '.container', items: '#cards > .card', need: '#cards' },                    // Unit 6 slope-intercept practice
    { root: '.tab-pane.active', items: '.qc', tabs: '.tab-btn' },                       // Unit 7/8 practice 1 and 2 (tabs)
    { root: '.wrap', items: '.part .q', need: '.part' },                                // EOG practice
    { root: '.wrap', items: '.q-card' }                                                 // Unit 7/8/9 practice
  ];
  var WORD = /pretest/.test(location.pathname) ? 'Question' : /homework_turn_in/.test(location.pathname) && !document.querySelector('section.pg.prob') ? 'Page' : 'Problem';
  var KEY = 'oat-mode';

  var css = document.createElement('style');
  css.textContent =
    '@media screen{.oat-on .oat-x{display:none!important}.oat-q #scoresend,.oat-q #ss-mount{display:none!important}.oat-on .oat-flat{display:block!important}}' +
    '.oat-top,.oat-bot,.oat-end,.oat-mode{font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1E2D4F;box-sizing:border-box}' +
    '.oat-top{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;margin:6px 0 10px;scroll-margin-top:72px}' +
    '.oat-count{font:700 16px Inter,system-ui,sans-serif;white-space:nowrap}.oat-lbl{font-weight:500;color:#5B6576;margin-right:2px}' +
    '.oat-bar{flex:1 1 140px;height:10px;border-radius:99px;background:#E3E5EA;overflow:hidden;min-width:100px}' +
    '.oat-bar i{display:block;height:100%;background:#FFC107;border-radius:99px;transition:width .3s}' +
    '.oat-link{background:none;border:0;color:#2747A0;font:600 14px Inter,system-ui,sans-serif;text-decoration:underline;cursor:pointer;padding:6px 2px;min-height:36px}' +
    '.oat-bot{display:flex;flex-wrap:wrap;gap:10px;justify-content:space-between;align-items:center;margin:14px 0 8px}' +
    '.oat-btn{font:700 16px Inter,system-ui,sans-serif;min-height:48px;padding:10px 20px;border-radius:10px;cursor:pointer;border:2px solid #1E2D4F;background:#fff;color:#1E2D4F}' +
    '.oat-btn.go{background:#FFC107;border-color:#FFC107;color:#1E2D4F}' +
    '.oat-btn.go:hover{background:#E0A800;border-color:#E0A800}' +
    '.oat-btn:disabled{opacity:.35;cursor:default}' +
    '.oat-btn:focus-visible,.oat-link:focus-visible,.oat-num:focus-visible{outline:3px solid #2747A0;outline-offset:2px}' +
    '.oat-end{scroll-margin-top:72px;background:#fff;border:1px solid #E3E5EA;border-top:5px solid #FFC107;border-radius:12px;padding:18px;margin:10px 0 18px}' +
    '.oat-end h2{font:600 1.4rem/1.2 "Source Serif 4",Georgia,serif;margin:0 0 6px;color:#1E2D4F}' +
    '.oat-end p{margin:0 0 12px;font-size:16px;line-height:1.5}' +
    '.oat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(46px,1fr));gap:6px;margin:0 0 14px}' +
    '.oat-num{min-height:44px;border-radius:8px;border:1.5px solid #CBD2DC;background:#fff;font:600 15px "JetBrains Mono",ui-monospace,monospace;color:#1E2D4F;cursor:pointer}' +
    '.oat-num.has{background:#E7F5EC;border-color:#15803D;color:#14532D}' +
    '.oat-key{font-size:13.5px;color:#5B6576;margin:-6px 0 12px}' +
    '.oat-mode{display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;background:#FFF6D6;border:1px solid #F2D27A;border-radius:10px;padding:8px 14px;margin:8px 0 14px;font-size:15px}' +
    '@media print{.oat-top,.oat-bot,.oat-end,.oat-mode{display:none!important}}';
  document.head.appendChild(css);

  var F = null, root = null, items = [], idx = 0, on = true, top, bot, end, mode, flats = [];
  try { on = localStorage.getItem(KEY) !== 'all'; } catch (e) {}

  function sig(el) { return el.tagName + '.' + (typeof el.className === 'string' ? el.className.replace(/\b(active|done|shown|oat-[a-z]+|sw-wide|correct|wrong)\b/g, '').trim().split(/\s+/).sort().join('.') : ''); }
  function hasItem(el) { return items.some(function (it) { return el === it || el.contains(it); }); }
  function skip(el) { return /^(SCRIPT|STYLE|LINK|TEMPLATE)$/.test(el.tagName) || el.id === 'site-bar' || /\boat-(top|bot|end|mode)\b/.test(el.className); }

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function build() {
    top = el('div', 'oat-top');
    top.innerHTML = '<span class="oat-count" aria-live="polite"></span><span class="oat-bar" aria-hidden="true"><i></i></span><button type="button" class="oat-link">Show all ' + WORD.toLowerCase() + 's</button>';
    top.querySelector('.oat-link').addEventListener('click', function () { setMode(false); });
    bot = el('div', 'oat-bot');
    bot.innerHTML = '<button type="button" class="oat-btn back">← Back</button><button type="button" class="oat-btn go next"></button>';
    bot.querySelector('.back').addEventListener('click', function () { go(idx - 1); });
    bot.querySelector('.next').addEventListener('click', function () { go(idx + 1); });
    end = el('section', 'oat-end'); end.setAttribute('aria-labelledby', 'oatEndH');
    mode = el('div', 'oat-mode', '<span>Showing all ' + WORD.toLowerCase() + 's on one page.</span><button type="button" class="oat-link">Show one at a time</button>');
    mode.querySelector('button').addEventListener('click', function () { setMode(true); });
  }

  function answered(it) {
    if (/\b(done|shown|correct|answered|ok)\b/.test(it.className)) return true;
    return [].some.call(it.querySelectorAll('input, select, textarea'), function (i) {
      if (i.closest('.sw')) return false;
      if (i.type === 'radio' || i.type === 'checkbox') return i.checked;
      return i.type !== 'button' && i.type !== 'hidden' && String(i.value || '').trim() !== '';
    });
  }

  function clear() {
    [].forEach.call(document.querySelectorAll('.oat-x'), function (e) { e.classList.remove('oat-x'); });
    flats.forEach(function (e) { e.classList.remove('oat-flat'); }); flats = [];
    [top, bot, end].forEach(function (e) { if (e && e.parentNode) e.parentNode.removeChild(e); });
  }
  function hideAround(node, show) {          // hide every sibling (at every level up to the root) that is not on the path or in "show"
    while (node && node !== root) {
      var par = node.parentElement; if (!par) break;
      [].forEach.call(par.children, function (c) { if (c !== node && !show.has(c) && !skip(c)) c.classList.add('oat-x'); });
      node = par;
    }
  }
  function hideAfterRoot() {                 // things after the problem area (Send my work, worked examples) wait for the finish screen
    var node = root;
    while (node && node !== document.body) {
      for (var s = node.nextElementSibling; s; s = s.nextElementSibling) if (!skip(s) && !/oat-/.test(s.className)) s.classList.add('oat-x');
      node = node.parentElement;
    }
  }
  function lead(C) {                          // the headings and directions that lead into C
    var show = new Set(), node = C;
    while (node && node !== root) {
      var s = node.previousElementSibling, me = sig(node), seen = {};
      while (s) {
        if (!skip(s)) {
          if (hasItem(s)) { if (sig(s) !== me) break; }
          else { var k = sig(s); if (!seen[k]) { seen[k] = 1; show.add(s); } }
        }
        s = s.previousElementSibling;
      }
      node = node.parentElement;
    }
    return show;
  }

  function render(scroll) {
    clear();
    if (!on) { root.insertBefore(mode, root.firstChild); document.body.classList.remove('oat-on', 'oat-q'); return; }
    if (mode.parentNode) mode.parentNode.removeChild(mode);
    document.body.classList.add('oat-on'); document.body.classList.toggle('oat-q', idx < items.length);
    var N = items.length;
    if (idx < N) {
      var C = items[idx];
      hideAround(C, lead(C)); hideAfterRoot();
      var par = C.parentElement; if (par !== root || getComputedStyle(par).display !== 'block') { par.classList.add('oat-flat'); flats.push(par); }
      par.insertBefore(top, C); par.insertBefore(bot, C.nextSibling);
      top.querySelector('.oat-count').innerHTML = '<span class="oat-lbl">Progress</span> ' + (idx + 1) + ' of ' + N;
      top.querySelector('.oat-bar i').style.width = Math.round((idx + 1) / N * 100) + '%';
      bot.querySelector('.back').disabled = idx === 0;
      bot.querySelector('.next').textContent = idx === N - 1 ? 'Finish ✓' : 'Next ' + WORD.toLowerCase() + ' →';
      if (scroll) top.scrollIntoView({ block: 'start', behavior: reduce() ? 'auto' : 'smooth' });
    } else finishScreen(scroll);
  }
  function finishScreen(scroll) {
    // hide the problems; keep what comes before the first one and after the last one (Send my work, tips)
    var first = items[0], last = items[items.length - 1];
    var kids = [].slice.call(root.children), fi = -1, li = -1;
    kids.forEach(function (c, i) { if (hasItem(c)) { if (fi < 0) fi = i; li = i; } });
    kids.forEach(function (c, i) { if (i >= fi && i <= li && !skip(c)) c.classList.add('oat-x'); });
    var done = items.filter(answered).length, sendBox = /send my work/i.test(root.textContent) || document.getElementById('scoresend');
    end.innerHTML = '<h2 id="oatEndH" tabindex="-1">You reached the end</h2>' +
      '<p>You put an answer in <b>' + done + ' of ' + items.length + '</b>. Tap a box to go back to it.</p>' +
      '<div class="oat-grid" role="group" aria-label="Go to a ' + WORD.toLowerCase() + '"></div>' +
      '<p class="oat-key">Green = you put an answer in.</p>' +
      (sendBox ? '<p><b>Last step:</b> send your work to Mr. Allen below.</p>' : '') +
      '<button type="button" class="oat-btn back">← Back to the last one</button>';
    // tabbed pages (Nov 11, 2026): the end of one topic leads to the next topic, so no tab is missed
    if (F.tabs) {
      var tabs = [].filter.call(document.querySelectorAll(F.tabs), function (t) { return t.offsetParent !== null; }),
        cur = tabs.findIndex(function (t) { return t.classList.contains('active') || t.getAttribute('aria-selected') === 'true'; }), nt = cur >= 0 ? tabs[cur + 1] : null;
      if (nt) {
        var nb = el('button', 'oat-btn go oat-nexttab', 'Next topic: ' + nt.textContent.replace(/[^\w\s\-’'&]/g, '').trim() + ' →'); nb.type = 'button';
        nb.addEventListener('click', function () { nt.click(); setTimeout(function () { var t = document.querySelector('.oat-top') || nt; t.scrollIntoView({ block: 'start', behavior: reduce() ? 'auto' : 'smooth' }); }, 120); });
        end.querySelector('p').insertAdjacentHTML('afterend', '<p><b>Topic ' + (cur + 1) + ' of ' + tabs.length + ' done.</b> Keep going with the next topic.</p>');
        end.appendChild(nb); nb.style.marginLeft = '10px';
      } else if (tabs.length > 1) end.querySelector('p').insertAdjacentHTML('afterend', '<p><b>That was the last topic.</b></p>');
    }
    var grid = end.querySelector('.oat-grid');
    items.forEach(function (it, i) {
      var b = el('button', 'oat-num' + (answered(it) ? ' has' : ''), String(i + 1)); b.type = 'button';
      b.setAttribute('aria-label', (i + 1) + ' of ' + items.length + (answered(it) ? ', answered' : ', no answer yet'));
      b.addEventListener('click', function () { go(i); }); grid.appendChild(b);
    });
    end.querySelector('.back').addEventListener('click', function () { go(items.length - 1); });
    var after = kids[li + 1];
    if (after) root.insertBefore(end, after); else root.appendChild(end);
    if (scroll) { end.scrollIntoView({ block: 'start', behavior: reduce() ? 'auto' : 'smooth' }); end.querySelector('h2').focus({ preventScroll: true }); }
  }
  function go(i) { idx = Math.max(0, Math.min(items.length, i)); render(true); }
  // "jump to Part 3" links (#p3) on a paged page go to the first problem of that part
  document.addEventListener('click', function (e) {
    var l = e.target.closest && e.target.closest('a[href^="#"]'); if (!l || !on || !root || l.closest('.oat-end')) return;
    var t; try { t = document.getElementById(l.getAttribute('href').slice(1)); } catch (x) { return; } if (!t) return;
    for (var k = 0; k < items.length; k++) if (t === items[k] || t.contains(items[k])) { e.preventDefault(); go(k); return; }
  });
  function setMode(v) {
    on = v; try { localStorage.setItem(KEY, v ? 'one' : 'all'); } catch (e) {}
    render(false); (v ? top : mode).scrollIntoView({ block: 'start' });
  }
  function reduce() { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; }

  function start() {
    for (var i = 0; i < FORMATS.length; i++) {
      var f = FORMATS[i], r = document.querySelector(f.root);
      if (!r || (f.need && !document.querySelector(f.need))) continue;
      var list = [].slice.call(r.querySelectorAll(f.items)).filter(function (it, k, a) { return !a.some(function (o) { return o !== it && o.contains(it); }); });
      if (list.length < 2) continue;
      F = f; root = r; items = list; break;
    }
    if (F && !start.reg) { start.reg = true; (window.__skipLists = window.__skipLists || []).push({ word: WORD, items: function () { return F && F.tabs ? [].slice.call(document.querySelectorAll('.tab-pane ' + F.items)) : items; }, answered: answered }); }   // Send my work lists skipped problems (score-send.js)
    if (!F) return false;
    if (!top) build();
    idx = 0; render(false);
    if (F.tabs && !start.tabbed) {          // tabbed pages: start over on the tab the student picks
      start.tabbed = true;
      [].forEach.call(document.querySelectorAll(F.tabs), function (t) {
        t.addEventListener('click', function () { setTimeout(function () { clear(); document.body.classList.remove('oat-on', 'oat-q'); F = null; start(); }, 60); });
      });
    }
    return true;
  }
  // pages draw their problems with script; wait until they are there
  var tries = 0;
  (function wait() { if (start() || ++tries > 40) return; setTimeout(wait, 150); })();
  window.OneAtATime = { go: go, state: function () { return { on: on, idx: idx, n: items.length, root: root && (root.id || root.className) }; } };
})();
/* A HINT ON EVERY PROBLEM (Mr. Allen, Nov 11, 2026). A problem that has no Hint button of its own gets one here
   (tap-answers.js writes the hint from the question's words: how to start, and the rule to remember). Homework has its own
   hints (homework/help.js). Printed copies are unchanged. */
(function () {
  if (/[?&](paper|key)=1/.test(location.search) || /homework_turn_in/.test(location.pathname)) return;
  var here = document.currentScript && document.currentScript.src;
  var SEL = '.pr-card, .qgrid > .q, #quiz section.q, #cards > .card, .tab-pane .qc, .part .q, .q-card';
  function add() {
    if (!window.TapAnswers) return;
    [].forEach.call(document.querySelectorAll(SEL), function (it) {
      if (it.getAttribute('data-hint-set')) return; it.setAttribute('data-hint-set', '1');
      var has = [].some.call(it.querySelectorAll('button, summary'), function (b) { return /hint/i.test(b.textContent) || /hint/i.test(String(b.className)); }); if (has) return;
      var q = it.querySelector('.qt, .q-text, .q-prompt, .stem, .expr') || it, row = document.createElement('div'); row.className = 'oat-hint'; row.style.cssText = 'margin:10px 0 0';
      row.appendChild(TapAnswers.hintButton(row, TapAnswers.hint('', (q.textContent || '').slice(0, 400)))); it.appendChild(row);
    });
  }
  function go() { if (window.TapAnswers) return add(); if (!here || !document.querySelector(SEL)) return;
    var s = document.createElement('script'); s.src = new URL('tap-answers.js?v=20261112a', here).href; s.onload = add; document.head.appendChild(s); }
  function soon() { setTimeout(go, 600); setTimeout(add, 2500); }
  if (document.readyState === 'complete') soon(); else window.addEventListener('load', soon);
})();
/* TRY AGAIN ON UNITS 7–9 PRACTICE (review fix, Nov 12, 2026). These pages used to lock after one tap and show the answer.
   Now: a wrong tap is marked and turned off, the note names the mistake (the button's data-why, or the common mistakes for
   that skill); the 2nd miss opens the hint; the answer and the worked explanation show after the 3rd miss (or when only the
   right one is left). Every tap is sent (first try / final), as before. */
(function () {
  if (!/unit[789]-practice/.test(location.pathname) || /[?&](paper|key)=1/.test(location.search)) return;
  function start() {
    if (typeof window.mc !== 'function' || window.mc.__retry) return;
    var old = window.mc;
    var re = function (btn, id, correct) {
      var card = document.getElementById(id); if (!card || card.classList.contains('answered')) return;
      var A = !!card.querySelector('.opt-btn'), bs = card.querySelectorAll(A ? '.opt-btn' : '.ob'), fb = card.querySelector(A ? '.feedback' : '.fb');
      if (!fb) return old(btn, id, correct);
      if (card.dataset.expl == null) card.dataset.expl = fb.textContent || '';
      var right = btn.textContent.trim() === String(correct).trim(), miss = Number(card.dataset.miss || 0);
      try { if (window.ScoreSend) ScoreSend.record(id, right, { std: window.ssStd ? ssStd(id) : '', label: window.ssLabel ? ssLabel(card) : id }); } catch (e) { }
      var left = [].filter.call(bs, function (b) { return !b.disabled && b !== btn && b.textContent.trim() !== String(correct).trim(); }).length;
      var finish = function (ok) {
        card.classList.add('answered'); [].forEach.call(bs, function (b) { b.disabled = true; });
        if (A) { try { if (ok) window.ts = (window.ts || 0) + 1; window.ta = (window.ta || 0) + 1; var s1 = document.getElementById('score'), s2 = document.getElementById('answered'); if (s1) s1.textContent = window.ts; if (s2) s2.textContent = window.ta; } catch (e) { } }
        else { var tab = card.closest('.tab-pane'), sc = tab && tab.querySelector('.sv'); if (sc) { try { /* global lexical `scores` on these pages */ scores[sc.id] = (scores[sc.id] || 0) + 1; sc.textContent = scores[sc.id]; } catch (e) { } } }
      };
      if (right) {
        btn.classList.add('correct'); finish(true);
        fb.className = (A ? 'feedback' : 'fb') + ' show c'; fb.textContent = '✓ Correct!' + (miss ? ' (on try ' + (miss + 1) + ')' : '') + ' ' + card.dataset.expl;
        return;
      }
      miss++; card.dataset.miss = miss; btn.classList.add('wrong'); btn.disabled = true;
      var q = card.querySelector('.qt, .q-text, .q-prompt, .stem') || card, qt = (q.textContent || '').slice(0, 400);
      var why = btn.getAttribute('data-why') || (window.TapAnswers ? TapAnswers.miss(String(correct), qt) : '') || 'Read the question again. What is it asking for?';
      if (miss >= 3 || left === 0) {
        [].forEach.call(bs, function (b) { if (b.textContent.trim() === String(correct).trim()) b.classList.add('reveal'); }); finish(false);
        fb.className = (A ? 'feedback' : 'fb') + ' show w'; fb.textContent = 'Not this time. The answer is ' + correct + '. ' + card.dataset.expl + ' Read this, then try the next one.';
        return;
      }
      var hb = miss >= 2 && [].filter.call(card.querySelectorAll('button'), function (b) { return /hint/i.test(b.textContent); })[0], hbox = card.querySelector('.ta-hint, .oat-hint .ta-note, .hintbox');
      if (hb && !(hbox && hbox.offsetParent)) hb.click();
      fb.className = (A ? 'feedback' : 'fb') + ' show w';
      fb.textContent = (miss === 1 ? 'Not yet. ' : 'Still not it. ') + why + (miss >= 2 ? ' The hint is open. Read it, then try once more.' : ' Try again.');
    };
    re.__retry = true; window.mc = re;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  setTimeout(start, 50);
})();
