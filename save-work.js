/* ───────────────────────────────────────────────────────────────
   SAVE MY WORK (Nov 13, 2026, Zach: "find a way that students can save their work if they log out";
   the Chromebooks are shared, so the work is saved to the Student Work Google Sheet, tab "Saved Work").

   How it works
   • A thin bar at the top of each student page asks for the student's first and last name once
     (the same name Send uses). Then every answer action is saved: taps, typed answers + Check,
     Enter, Next/Back, a finished step-by-step answer.
   • The actions are kept on this Chromebook (localStorage) AND sent to the Sheet (a few seconds after
     the last change, and when the page is closed).
   • When the page opens again (any Chromebook), the newest saved copy is played back, so the page
     looks the way the student left it: same answers, same checks, same problem.
   • "Start over" clears the saved copy for this page.
   Needs ENDPOINT in tracker-config.js and the updated _build/student_work/StudentWork.gs (kind 'save' / 'load').
   Not on printed copies (?paper=1 / ?key=1) or arcade games. Targeted Practice keeps its own copy on the
   Chromebook; the Sheet copy is used there only when this Chromebook has none.
   ─────────────────────────────────────────────────────────────── */
(function () {
  if (window.SaveWork) return;
  if (/[?&](paper|key)=1\b/.test(location.search)) return;
  if (document.querySelector('script[src*="arcade-send"]')) return;
  var CFG = window.TRACKER_CONFIG || {};
  var HW = /homework_turn_in/.test(location.pathname), hwId = (/[?&]hw=([^&#]+)/.exec(location.search) || [])[1];
  if (HW && !hwId) return;
  var PAGE = location.pathname.split('/').slice(-2).join('/') + (hwId ? '?hw=' + hwId : '');
  var LKEY = 'sw-log:' + PAGE, NAME_KEY = 'fluencyLabStudentName';
  var log = [], stamp = 0, replaying = false, timer = null, sentStamp = 0, bar = null, started = false;

  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k) || ''; if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { } return ''; }
  function tidy(n) { return String(n || '').replace(/\s+/g, ' ').trim().replace(/(^|\s)([a-z])/g, function (m, sp, c) { return sp + c.toUpperCase(); }); }
  function nameOk(n) { n = tidy(n); return n.length >= 3 && n.indexOf(' ') > 0; }
  function getName() { var hn = HW && document.getElementById('nm'); var n = hn && nameOk(hn.value) ? hn.value : ls(NAME_KEY); return nameOk(n) ? tidy(n) : ''; }

  /* ---------- finding the same thing again on the next visit ---------- */
  function skip(el) { return !el || !el.closest || el.closest('#site-bar, #side-nav, .sw-host, .sv-bar, #scoresend, #ss-mount, .fx-foot, .fx-toast, .oat-fin-send') || el.id === 'ssbtn' || el.id === 'ssname' || el.id === 'nm'; }
  function anc(el) { for (var p = el.parentElement; p && p !== document.body; p = p.parentElement) if (p.id && !/^sw\d+$/.test(p.id)) return p; return document.body; }
  function lab(el) {
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) return (el.type || '') + '|' + String(el.className || '').replace(/\b(sw-filled|bad|ok|no|wrong|correct|ta-hid|blank)\b/g, '').replace(/\s+/g, ' ').trim() + '|' + (el.name || '');
    return (el.getAttribute('data-t') || el.getAttribute('data-v') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  }
  function same(a, el) { var l = lab(el); return [].filter.call(a.querySelectorAll(el.tagName), function (x) { return lab(x) === l && !x.closest('.sw-host'); }); }
  function sig(el) {
    if (el.id && !/^sw\d+$/.test(el.id) && document.querySelectorAll('#' + CSS.escape(el.id)).length === 1) return { i: el.id };
    var a = anc(el); return { a: a === document.body ? '' : a.id, g: el.tagName, x: lab(el), n: same(a, el).indexOf(el) };
  }
  function find(s) {
    if (s.i) return document.getElementById(s.i);
    var a = s.a ? document.getElementById(s.a) : document.body; if (!a) return null;
    var list = [].filter.call(a.querySelectorAll(s.g), function (x) { return lab(x) === s.x && !x.closest('.sw-host'); });
    return list[s.n] || null;
  }

  /* ---------- recording ---------- */
  function add(t, el, v) {
    if (replaying || !started) return;
    var s = sig(el), e = { t: t, s: s }; if (v !== undefined) e.v = v;
    var last = log[log.length - 1];
    if (t === 'v' && last && last.t === 'v' && JSON.stringify(last.s) === JSON.stringify(s)) log[log.length - 1] = e; else log.push(e);
    stamp = Date.now(); keep();
  }
  function keep() {
    ls(LKEY, JSON.stringify({ t: stamp, log: log }));
    show('Saving…');
    clearTimeout(timer); timer = setTimeout(function () { send(false); }, 6000);
  }
  var CLICK = 'button, [role=button], .opt, .ob, .match-item, input[type=checkbox], input[type=radio], label.opt, td[onclick], div[onclick], span[onclick]';
  document.addEventListener('click', function (ev) {
    if (!ev.isTrusted) return;
    var el = ev.target && ev.target.closest && ev.target.closest(CLICK); if (!el || skip(el)) return;
    if (/^(checkbox|radio)$/.test(el.type) || (el.tagName === 'LABEL' && el.querySelector('input[type=checkbox],input[type=radio]'))) return;   // saved by 'change' below
    var tx = (el.textContent || '').trim();
    if (/^(🔊\s*)?read\b|^sound|^printables|^print\b|^send\b|^sent\b/i.test(tx) || el.classList.contains('fx-read') || el.closest('a[href]:not([href^="#"])')) return;
    add('c', el);
  }, true);
  document.addEventListener('input', function (ev) {
    var el = ev.target; if (!ev.isTrusted || !el || !/^(INPUT|TEXTAREA)$/.test(el.tagName) || /^(checkbox|radio|button)$/.test(el.type) || skip(el)) return;
    add('v', el, el.value);
  }, true);
  document.addEventListener('change', function (ev) {
    var el = ev.target; if (!ev.isTrusted || !el || skip(el)) return;
    if (el.tagName === 'SELECT') add('v', el, el.value);
    else if (/^(checkbox|radio)$/.test(el.type)) add('x', el, !!el.checked);
  }, true);
  document.addEventListener('keydown', function (ev) {
    var el = ev.target; if (!ev.isTrusted || ev.key !== 'Enter' || !el || el.tagName !== 'INPUT' || skip(el)) return;
    add('k', el);
  }, true);
  // step-work.js calls this when a finished step-by-step answer goes into the answer box
  function note(kind, el, v) { if (kind === 'sw' && el) add('sw', el, v); }

  /* ---------- playing it back ---------- */
  function replay(list, done) {
    replaying = true; window.__swReplay = true;
    var cover = document.createElement('div'); cover.className = 'sv-cover'; cover.innerHTML = '<div>Bringing back your saved work…</div>'; document.documentElement.appendChild(cover);
    var i = 0;
    (function next() {
      if (i >= list.length) { replaying = false; window.__swReplay = false; cover.remove(); log = list.slice(); done && done(); return; }
      var a = list[i++], el = null; try { el = find(a.s); } catch (e) { el = null; }
      try {
        if (el) {
          if (a.t === 'c') el.click();
          else if (a.t === 'x') { if (!!el.checked !== !!a.v) el.click(); }
          else if (a.t === 'v') { el.value = a.v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }
          else if (a.t === 'k') { el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true })); }
          else if (a.t === 'sw' && window.StepWork && StepWork._t && StepWork._t.fillBox) StepWork._t.fillBox(el, a.v);
        }
      } catch (e) { }
      setTimeout(next, a.t === 'v' ? 5 : 45);
    })();
  }

  /* ---------- the Sheet ---------- */
  function post(body, cb) {
    if (!CFG.ENDPOINT) { cb && cb(null); return; }
    fetch(CFG.ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); }).then(function (j) { cb && cb(j); }).catch(function () { cb && cb(null); });
  }
  function payload() { return { code: CFG.CLASS_CODE, kind: 'save', name: getName(), page: PAGE, n: log.length, data: JSON.stringify({ t: stamp, log: log }) }; }
  function send(beacon) {
    clearTimeout(timer);
    var nm = getName(); if (!nm || !CFG.ENDPOINT || !stamp || sentStamp === stamp) { show(nm ? 'Saved on this Chromebook' : ''); return; }
    var p = payload(), st = stamp;
    if (beacon && navigator.sendBeacon) { try { navigator.sendBeacon(CFG.ENDPOINT, new Blob([JSON.stringify(p)], { type: 'text/plain;charset=utf-8' })); sentStamp = st; } catch (e) { } return; }
    post(p, function (j) { if (j && j.ok) { sentStamp = st; show('✓ Saved'); } else show('Saved on this Chromebook (will try again)'); });
  }
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') send(true); });
  window.addEventListener('pagehide', function () { send(true); });
  function load(cb) {
    var nm = getName(); if (!nm || !CFG.ENDPOINT) { cb(null); return; }
    var done = false, to = setTimeout(function () { if (!done) { done = true; cb(null); } }, 8000);
    post({ code: CFG.CLASS_CODE, kind: 'load', name: nm, page: PAGE }, function (j) {
      if (done) return; done = true; clearTimeout(to);
      var d = null; try { d = j && j.ok && j.data ? JSON.parse(j.data) : null; } catch (e) { d = null; }
      cb(d && d.log ? d : null);
    });
  }

  /* ---------- the bar ---------- */
  function css() {
    var s = document.createElement('style'); s.textContent =
      '.sv-bar{font:500 14px Inter,system-ui,sans-serif;color:#1E2D4F;background:#FFF8E1;border:1px solid #F2D27A;border-radius:10px;max-width:1080px;margin:10px auto;padding:8px 14px;display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;box-sizing:border-box}' +
      '.sv-bar input{font:500 15px Inter,system-ui,sans-serif;border:1px solid #C9CED8;border-radius:8px;padding:7px 10px;min-width:220px;flex:1 1 220px;max-width:340px}' +
      '.sv-bar button{font:700 14px Inter,system-ui,sans-serif;background:#1E2D4F;color:#fff;border:0;border-radius:8px;padding:8px 14px;cursor:pointer}' +
      '.sv-bar .sv-link{background:none;color:#1E2D4F;text-decoration:underline;padding:0;font-weight:600}' +
      '.sv-bar .sv-st{color:#5B6475;font-size:13px}.sv-bar.sv-on{background:#F3F7EE;border-color:#CFE3BF}' +
      '.sv-cover{position:fixed;inset:0;z-index:99999;background:rgba(247,247,244,.92);display:flex;align-items:center;justify-content:center;font:700 20px Inter,system-ui,sans-serif;color:#1E2D4F}' +
      '@media print{.sv-bar,.sv-cover{display:none!important}}';
    document.head.appendChild(s);
  }
  function show(t) { var st = bar && bar.querySelector('.sv-st'); if (st) st.textContent = t; }
  function drawBar() {
    if (HW) return;                                    // Targeted Practice already asks for the name at the top
    if (!bar) { bar = document.createElement('div'); bar.className = 'sv-bar'; var sb = document.getElementById('site-bar') || document.getElementById('side-nav'); document.body.insertBefore(bar, sb ? sb.nextSibling : document.body.firstChild); }
    var nm = getName();
    if (!nm) {
      bar.classList.remove('sv-on');
      bar.innerHTML = '<span><b>Save your work:</b> type your first and last name.</span><input type="text" autocomplete="name" placeholder="First and last name" aria-label="First and last name"><button type="button">Save my work</button><span class="sv-st"></span>';
      var inp = bar.querySelector('input'), go = bar.querySelector('button');
      var ok = function () {
        if (!nameOk(inp.value)) { show('Please type your first AND last name.'); inp.focus(); return; }
        ls(NAME_KEY, tidy(inp.value)); var ss = document.getElementById('ssname'); if (ss && !ss.value) ss.value = tidy(inp.value);
        drawBar(); resume(true);
      };
      go.addEventListener('click', ok); inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); ok(); } });
      return;
    }
    bar.classList.add('sv-on');
    bar.innerHTML = '<span>Saving your work as <b></b>.</span><span class="sv-st"></span><button type="button" class="sv-link sv-me">Not you?</button><button type="button" class="sv-link sv-over">Start over</button>';
    bar.querySelector('b').textContent = nm;
    bar.querySelector('.sv-me').addEventListener('click', function () { ls(NAME_KEY, null); drawBar(); });
    bar.querySelector('.sv-over').addEventListener('click', function () {
      if (!confirm('Start this page over? Your saved answers on this page will be cleared.')) return;
      log = []; stamp = Date.now(); ls(LKEY, null); sentStamp = 0;
      var nm2 = getName(); if (nm2 && CFG.ENDPOINT) post({ code: CFG.CLASS_CODE, kind: 'save', name: nm2, page: PAGE, n: 0, data: JSON.stringify({ t: stamp, log: [] }) }, function () { location.reload(); });
      else location.reload();
    });
  }

  /* ---------- start: play back the newest copy, then keep saving ---------- */
  function localCopy() { try { var d = JSON.parse(ls(LKEY) || 'null'); return d && d.log ? d : null; } catch (e) { return null; } }
  function hwHasOwn() { try { var d = JSON.parse(ls('hw-draft-' + hwId) || '{}'); return Object.keys(d).length > 0; } catch (e) { return false; } }
  var busy = false;
  function resume(fromBar) {
    if (busy || replaying) return; busy = true;
    var fin = function () { busy = false; };
    var mine = HW ? null : localCopy();
    if (HW && hwHasOwn()) { fin(); started = true; var m0 = localCopy(); if (m0) { log = m0.log; stamp = m0.t; } return; }   // the page brought its own copy back
    load(function (remote) {
      fin();
      var use = remote && (!mine || remote.t > mine.t) ? remote : mine;
      if (fromBar && started) {                          // name typed after working: keep this page, send it
        if (remote && remote.log.length && (!log.length || (remote.log.length > log.length && confirm('We found your saved work on this page from another Chromebook. Bring it back? (What is on this screen now will be replaced.)')))) {
          if (log.length) { ls(LKEY, JSON.stringify(remote)); location.reload(); return; }
          replay(remote.log, function () { stamp = remote.t; ls(LKEY, JSON.stringify({ t: stamp, log: log })); show('✓ Your saved work is back'); }); return; }
        if (log.length) { stamp = stamp || Date.now(); sentStamp = 0; send(false); }
        return;
      }
      if (use && use.log.length) replay(use.log, function () { stamp = use.t; started = true; ls(LKEY, JSON.stringify({ t: stamp, log: log })); show(remote === use ? '✓ Your saved work is back' : 'Saved on this Chromebook'); if (use === mine) { sentStamp = 0; send(false); } });
      else started = true;
    });
  }
  function boot() {
    css(); drawBar();
    if (HW) { var hn = document.getElementById('nm'); if (hn) hn.addEventListener('change', function () { if (nameOk(hn.value)) resume(true); }); }
    setTimeout(function () { resume(false); }, 1500);  // let the page build its problems first
  }
  window.SaveWork = { note: note, _log: function () { return log; }, _page: PAGE, send: send };
  if (document.readyState === 'complete') boot(); else window.addEventListener('load', boot);
})();
