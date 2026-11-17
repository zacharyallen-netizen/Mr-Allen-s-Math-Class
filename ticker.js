/* ───────────────────────────────────────────────────────────────
   TOP STUDENTS TICKER (Nov 17, 2026, Zach): a slow scrolling line at the
   top of the 8th grade hub pages with the students who spent the most time
   and finished the most activities THIS WEEK and THIS YEAR.

   Loaded by site-bar.js. Shows only on the hub pages in SHOW below (never on
   tests, practice pages, games or the calm pages), or on any page with
   ?ticker=1. The numbers come from the Student Work script
   (<ENDPOINT>?ticker=1, code in _build/student_work/ArcadeLog.gs); names
   arrive as "First L." only. If the script is not set up or has no data
   yet, nothing is shown. Pauses on hover; no motion for students whose
   computer asks for reduced motion. ✕ hides it until the tab is closed.
   ─────────────────────────────────────────────────────────────── */
(function () {
  if (window.__topTicker || /[?&](paper|key|mini)=1/.test(location.search)) return;
  var me = document.currentScript, root = me ? me.src.replace(/ticker\.js(\?.*)?$/, '') : '';
  var here = location.pathname.replace(/\/+$/, '/');
  var SHOW = /\/grade8\/(index\.html)?$|\/grade8\/(arcade|grading|skill-builders|8th_grade_eog_hub|benchmarks|unit[1-9]|units3-4)\.html$/;
  if (!SHOW.test(here) && !/[?&]ticker=1/.test(location.search)) return;
  try { if (sessionStorage.getItem('ticker-off')) return; } catch (e) {}

  function cfg() { return window.TRACKER_CONFIG || {}; }
  function ask() {
    var ep = cfg().ENDPOINT; if (!ep) return;
    window.__topTicker = draw;
    var s = document.createElement('script');
    s.src = ep + (ep.indexOf('?') < 0 ? '?' : '&') + 'ticker=1&callback=__topTicker&t=' + Math.floor(Date.now() / 600000);
    s.onerror = function () {};
    document.head.appendChild(s);
  }
  if (cfg().ENDPOINT) ask();
  else { var c = document.createElement('script'); c.src = root + 'tracker-config.js'; c.onload = ask; document.head.appendChild(c); }

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function list(a, unit) {
    return a.map(function (p, i) { return '<b>' + (i + 1) + '.</b> ' + esc(p.name) + ' <i>' + p.v + ' ' + unit(p.v) + '</i>'; }).join('<span class="tk-dot">·</span>');
  }
  function draw(d) {
    if (!d || !d.ok) return;
    var parts = [], min = function (v) { return v === 1 ? 'min' : 'min'; }, act = function (v) { return v === 1 ? 'activity' : 'activities'; };
    [['This week', d.week], ['This year', d.year]].forEach(function (g) {
      var w = g[1] || {};
      if (w.time && w.time.length) parts.push('<span class="tk-lab">' + g[0] + ' · Most time</span> ' + list(w.time, min));
      if (w.done && w.done.length) parts.push('<span class="tk-lab">' + g[0] + ' · Most activities</span> ' + list(w.done, act));
    });
    if (!parts.length) return;
    var line = '<span class="tk-seg">' + parts.join('<span class="tk-star">★</span>') + '<span class="tk-star">★</span></span>';
    var st = document.createElement('style');
    st.textContent =
      '#top-ticker{position:relative;z-index:50;display:flex;align-items:center;gap:10px;background:#1E2D4F;color:#fff;' +
      'font:500 14px/1.2 Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:0 8px 0 0;height:36px;overflow:hidden;' +
      'border-bottom:2px solid #FFC107}' +
      '#top-ticker .tk-h{flex:none;background:#FFC107;color:#1E2D4F;font:700 13px/36px "Source Serif 4",Georgia,serif;padding:0 12px;letter-spacing:.02em}' +
      '#top-ticker .tk-win{flex:1;overflow:hidden;white-space:nowrap;mask-image:linear-gradient(90deg,transparent 0,#000 24px,#000 calc(100% - 24px),transparent 100%)}' +
      '#top-ticker .tk-run{display:inline-block;white-space:nowrap;animation:tk-move var(--tk-dur,60s) linear infinite}' +
      '#top-ticker:hover .tk-run,#top-ticker:focus-within .tk-run{animation-play-state:paused}' +
      '#top-ticker .tk-seg{padding-right:28px}' +
      '#top-ticker .tk-lab{color:#FFC107;font-weight:700;margin-right:6px}' +
      '#top-ticker b{font-family:"JetBrains Mono",ui-monospace,monospace;color:#FFC107;font-weight:600}' +
      '#top-ticker i{font-style:normal;font-family:"JetBrains Mono",ui-monospace,monospace;color:#cfd6e6;font-size:12.5px}' +
      '#top-ticker .tk-dot{color:#7f8db0;margin:0 9px}#top-ticker .tk-star{color:#FFC107;margin:0 16px}' +
      '#top-ticker .tk-x{flex:none;background:none;border:0;color:#cfd6e6;font-size:16px;cursor:pointer;padding:4px 6px;border-radius:4px}' +
      '#top-ticker .tk-x:hover,#top-ticker .tk-x:focus-visible{color:#fff;outline:2px solid #FFC107}' +
      '@keyframes tk-move{from{transform:translateX(0)}to{transform:translateX(-50%)}}' +
      '@media (prefers-reduced-motion:reduce){#top-ticker{height:auto;min-height:36px}#top-ticker .tk-win{white-space:normal;mask-image:none;padding:6px 0}' +
      '#top-ticker .tk-run{animation:none;white-space:normal}#top-ticker .tk-run .tk-seg+.tk-seg{display:none}}' +
      '@media print{#top-ticker{display:none}}';
    document.head.appendChild(st);
    var bar = document.createElement('div');
    bar.id = 'top-ticker'; bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Top students this week and this year');
    bar.innerHTML = '<span class="tk-h">★ Top Students</span><div class="tk-win"><span class="tk-run">' + line + line.replace('<span class="tk-seg">', '<span class="tk-seg" aria-hidden="true">') + '</span></div>' +
      '<button class="tk-x" type="button" aria-label="Hide the Top Students line" title="Hide">✕</button>';
    bar.querySelector('.tk-x').onclick = function () { bar.remove(); try { sessionStorage.setItem('ticker-off', '1'); } catch (e) {} };
    function put() {
      document.body.insertBefore(bar, document.body.firstChild);
      var run = bar.querySelector('.tk-run');
      run.style.setProperty('--tk-dur', Math.max(30, Math.round(run.scrollWidth / 2 / 55)) + 's');   // about 55 px a second
    }
    if (document.body) put(); else document.addEventListener('DOMContentLoaded', put);
  }
})();
