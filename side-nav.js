/* ==========================================================================
   Mr. Allen's Math Class — side menu (PREVIEW, Nov 13, 2026)
   Zach asked for a vertical menu on the left instead of the top bar: a slim rail of icons that a
   student clicks to open; each section opens to show what it is for and its pages.
   Turned on only for a person who visits any page with ?nav=side (remembered on that browser);
   ?nav=top goes back to the top bar. site-bar.js loads this file when it is on.
   Styles live in a shadow root, so pages never change the menu and the menu never changes pages.
   ========================================================================== */
(function () {
  if (document.getElementById('side-nav')) return;
  var me = document.currentScript, root = (me && me.src || '').replace(/side-nav\.js(\?.*)?$/, '');
  var here = location.href.split('#')[0].split('?')[0], rel = here.indexOf(root) === 0 ? here.slice(root.length) : '';
  if (rel === '' || /\/$/.test(rel)) rel += 'index.html';

  // icon paths (simple line icons, 24×24)
  var I = {
    home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
    book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5M8 7h7',
    m1: 'M4 19V5h4l4 8 4-8h4v14',
    star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
    game: 'M6 9h12a4 4 0 0 1 4 4v1a3 3 0 0 1-5.4 1.8L15 14H9l-1.6 1.8A3 3 0 0 1 2 14v-1a4 4 0 0 1 4-4zM7 11v3M5.5 12.5h3M16 12h.01M18 13.5h.01',
    wave: 'M2 12c2.5-3 5-3 7.5 0s5 3 7.5 0 4-2 5-1M2 17c2.5-3 5-3 7.5 0s5 3 7.5 0 4-2 5-1M9 4v4M15 6v2',
    calc: 'M6 2h12a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM8 6h8v4H8zM8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01',
    flag: 'M5 21V4M5 4h11l-2 4 2 4H5',
    info: 'M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zM12 11v6M12 7h.01',
    note: 'M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
    puzzle: 'M10 3h4v3a2 2 0 1 0 4 0V3h3v7h-3a2 2 0 1 0 0 4h3v7h-7v-3a2 2 0 1 0-4 0v3H3v-7h3a2 2 0 1 0 0-4H3V3z',
    search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5',
    menu: 'M4 6h16M4 12h16M4 18h16', close: 'M6 6l12 12M18 6L6 18', chev: 'M9 6l6 6-6 6'
  };
  var U = [['unit1.html', 'Unit 1', 'Real Numbers'], ['unit2.html', 'Unit 2', 'Exponents & Scientific Notation'], ['unit3.html', 'Unit 3', 'Linear Equations'],
    ['unit4.html', 'Unit 4', 'Angles & Geometry'], ['units3-4.html', 'Units 3–4', 'Pre-Test & Tutorial'], ['unit5.html', 'Unit 5', 'Pythagorean Theorem'],
    ['unit6.html', 'Unit 6', 'Functions, Slope & Systems'], ['unit7.html', 'Unit 7', 'Data Analysis'], ['unit8.html', 'Unit 8', 'Transformations'], ['unit9.html', 'Unit 9', 'Volume']];
  /* Nov 18, 2026 site rebuild (Zach: students knowing what is available and where to find it): the same FOUR groups
     as the 8th Grade home page (Learn · Practice & Review · My Progress · Take a Break), then Math 1, Calculators and
     Class Info. "This unit" comes from site-config.js (thisUnit). A search box at the top of the drawer searches
     search-index.js (built by _build/search_index.py). */
  var X = function (t, h, n) { return { t: t, h: h, n: n }; };
  var S = [
    { id: 'le', icon: 'book', label: 'Learn', title: 'Learn', desc: 'Your units. Each unit page has the notes, practice, Targeted Practice (homework) and pre-test in order, plus games for that unit.',
      links: [{ t: 'This unit', h: 'grade8/index.html', tu: 1 }, { t: 'Ask Digit', dg: 1 }, X('8th Grade home', 'grade8/index.html')].concat(U.map(function (u) { return X(u[1], 'grade8/' + u[0], u[2]); }))
        .concat([X('Anchor Charts', 'grade8/anchor_charts.html', 'one chart for each unit'), X('Formula Sheet', 'grade8/formulas.html'), X('Vocabulary', 'grade8/vocabulary.html', 'key words for every unit'),
          X('Interactive Tools', 'grade8/tools.html'), X('Materials Index', 'grade8/materials_index.html', 'every PDF and answer key'),
          X('Math in Science', 'grade8/math-science/index.html'), X('Math in Financial Literacy', 'grade8/math-finlit/index.html')]),
      sec: ['grade8/unit', 'grade8/units', 'grade8/index.html', 'grade8/homework_turn_in', 'grade8/anchor', 'grade8/formulas', 'grade8/vocabulary.html', 'grade8/tools', 'grade8/materials_index', 'grade8/math-science', 'grade8/math-finlit', 'grade8/volume'] },
    { id: 'pr', icon: 'puzzle', label: 'Practice', title: 'Practice & Review', desc: 'Stuck on a skill, or getting ready for a test? Short lessons, flashcards and test practice.',
      links: [X('Skill Builders', 'grade8/skill-builders.html', 'short lessons and videos'), X('Vocab Flashcards & Blitz', 'grade8/vocab-flashcards.html', 'learn the words, then race the Blitz'),
        X('Fluency Lab', 'grade8/Fluency-Lab-Package/fluency-lab/index.html', 'math facts to automatic'), X('Graphing Practice', 'grade8/graphing.html'),
        X('Winter Break Review', 'grade8/winter-break-review.html'), X('Winter Break Review — Version 2', 'grade8/winter-break-review-v2.html'),
        X('NC Check-Ins / Benchmarks', 'grade8/benchmarks.html', 'state practice tests'), X('EOG Prep', 'grade8/8th_grade_eog_hub.html', 'the end-of-year state test')],
      sec: ['grade8/skill', 'grade8/vocab-flash', 'grade8/Fluency-Lab', 'grade8/graphing', 'grade8/winter', 'grade8/benchmark', 'grade8/checkin', 'grade8/8th_grade_eog', 'grade8/eog', 'grade8/q1_benchmark'] },
    { id: 'gr', icon: 'star', label: 'Progress', title: 'My Progress', desc: 'How grades work: the 1–5 scale, your I Can Tracker, the I Can targets, and how to raise a score.',
      links: [{ t: 'Ask Digit', dg: 1 }, X('Grading & Standards', 'grade8/grading.html'), X('Video: your folder and I Can Tracker', 'grade8/grading.html#video-trackers', '2 minutes with Digit'),
        X('Durable Skills', 'grade8/durable-skills.html', 'good work habits')], sec: ['grade8/grading', 'grade8/targets/', 'grade8/durable'] },
    { id: 'ar', icon: 'game', label: 'Break', title: 'Take a Break', desc: 'Finished your work? Math games, a calm-down room and focus music.',
      links: [X('Math Arcade', 'grade8/arcade.html', 'every math game'), X('Reset Room', 'grade8/reset-room.html', 'calm-down activities'), { t: 'Chill Math Music', n: 'small player that keeps playing', music: true }],
      sec: ['grade8/arcade', 'grade8/reset-room', 'grade8/ripples', 'grade8/drift'] },
    { id: 'm1', icon: 'm1', label: 'Math 1', title: 'NC Math 1', desc: 'For students in NC Math 1. Your teacher gives you the password.', links: [X('NC Math 1 home', 'math1/index.html')], sec: ['math1/'] },
    { id: 'ca', icon: 'calc', label: 'Calculators', title: 'Calculators', desc: 'Use these only when the problem says "Calculator OK".',
      links: [{ t: 'Desmos Scientific Calculator', n: 'new tab ↗', h: 'https://www.desmos.com/scientific', nt: 1 }, { t: 'Desmos Graphing Calculator', n: 'new tab ↗', h: 'https://www.desmos.com/calculator', nt: 1 }] },
    { id: 'ci', icon: 'info', label: 'Class Info', title: 'Class Info', desc: 'Syllabus, Google Classroom links and family resources. New here? Watch the website tour.',
      links: [X('Class Information', 'class-information.html'), X('Website tour video', 'index.html#video-tour', '2 minutes with Digit'), X('Home page', 'index.html')], sec: ['class-information'] }
  ];
  var cur = null, best = 0;
  S.forEach(function (s) { (s.links || []).forEach(function (l) { if (l.h === rel) { cur = s.id; best = 999; } }); });
  if (!cur) S.forEach(function (s) { (s.sec || []).forEach(function (p) { if (rel.indexOf(p) === 0 && p.length > best) { best = p.length; cur = s.id; } }); });

  function svg(p, sz) { return '<svg viewBox="0 0 24 24" width="' + (sz || 22) + '" height="' + (sz || 22) + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + p + '"/></svg>'; }
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function url(h) { return /^https?:/.test(h) ? h : root + h; }

  var host = document.createElement('div'); host.id = 'side-nav'; host.setAttribute('role', 'navigation'); host.setAttribute('aria-label', 'Site');
  var sr = host.attachShadow({ mode: 'open' });
  var W = 76;
  var css =
    ':host{all:initial}*{box-sizing:border-box}' +
    '.rail{position:fixed;left:0;top:0;bottom:0;width:' + W + 'px;background:#1E2D4F;color:#fff;font-family:Inter,system-ui,sans-serif;display:flex;flex-direction:column;align-items:stretch;z-index:2147483000;padding:8px 0;box-shadow:1px 0 0 rgba(0,0,0,.08)}' +
    '.rail button{background:none;border:0;color:#D9DEE8;font:600 11px Inter,system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;gap:4px;padding:9px 2px;cursor:pointer;position:relative;width:100%}' +
    '.rail button:hover{color:#fff;background:rgba(255,255,255,.06)}.rail button.cur{color:#fff}.rail button.cur::before{content:"";position:absolute;left:0;top:8px;bottom:8px;width:3px;border-radius:0 3px 3px 0;background:#FFC107}' +
    '.rail .logo{font:600 17px "Source Serif 4",Georgia,serif;color:#fff;padding:12px 2px 14px}.rail .logo small{font:500 10px Inter,sans-serif;color:#AEB7C8;letter-spacing:.04em}' +
    '.rail .sp{flex:1}.rail .mus.on{color:#FFC107}' +
    '.scrim{position:fixed;inset:0;background:rgba(15,23,42,.35);z-index:2147483001}.scrim[hidden],.drawer[hidden]{display:none}' +
    '.drawer{position:fixed;left:0;top:0;bottom:0;width:min(380px,92vw);background:#fff;color:#1E2D4F;font-family:Inter,system-ui,sans-serif;z-index:2147483002;box-shadow:8px 0 30px rgba(15,23,42,.25);display:flex;flex-direction:column}' +
    '.dh{display:flex;align-items:center;justify-content:space-between;background:#1E2D4F;color:#fff;padding:14px 16px}.dh b{font:600 19px "Source Serif 4",Georgia,serif}.dh span{font-size:12px;color:#AEB7C8;display:block}' +
    '.dh button{background:none;border:1px solid rgba(255,255,255,.3);color:#fff;border-radius:8px;width:36px;height:36px;cursor:pointer;display:flex;align-items:center;justify-content:center}' +
    '.list{overflow:auto;padding:8px 10px 20px;flex:1}' +
    '.sec{border-radius:12px;margin:4px 0}.sec.open{background:#F7F7F4}' +
    '.sh{width:100%;display:flex;align-items:center;gap:12px;background:none;border:0;text-align:left;padding:12px 10px;border-radius:12px;cursor:pointer;color:#1E2D4F;font:600 16px Inter,system-ui,sans-serif}' +
    '.sh:hover{background:#FFF6D6}.sh .ic{width:38px;height:38px;border-radius:10px;background:#EEF1F6;display:flex;align-items:center;justify-content:center;flex:none}' +
    '.sec.cur .sh .ic{background:#FFC107;color:#1E2D4F}.sh .tx{flex:1}.sh .chev{transition:transform .15s;color:#8A93A3}.sec.open .sh .chev{transform:rotate(90deg)}' +
    '.sb{padding:0 12px 12px 60px}.sb[hidden]{display:none}.sb p{margin:0 0 8px;font:400 14px/1.45 Inter,sans-serif;color:#46506A}' +
    '.sb a,.sb .lk{display:block;width:100%;text-align:left;background:#fff;border:1px solid #E3E5EA;border-radius:10px;padding:9px 12px;margin:6px 0;color:#1E2D4F;text-decoration:none;font:600 14.5px Inter,sans-serif;cursor:pointer}' +
    '.sb a:hover,.sb .lk:hover{border-color:#E0A800;background:#FFFBEB}.sb a[aria-current]{border-color:#FFC107;box-shadow:inset 3px 0 0 #FFC107}.sb small{display:block;font-weight:500;color:#6B7280;font-size:12.5px;margin-top:1px}' +
    '.mob{display:none;position:fixed;left:10px;top:10px;z-index:2147483000;background:#1E2D4F;color:#fff;border:0;border-radius:10px;height:42px;padding:0 14px;font:600 14px Inter,sans-serif;align-items:center;gap:8px;box-shadow:0 4px 14px rgba(15,23,42,.25);cursor:pointer}' +
    'button:focus-visible,a:focus-visible{outline:2px solid #FFC107;outline-offset:2px}' +
    '.srch{padding:10px 12px 4px;border-bottom:1px solid #EEF0F4}.srch input{width:100%;font:500 15px Inter,sans-serif;padding:10px 12px;border:1.5px solid #C9D1E3;border-radius:10px;color:#1E2D4F;outline:none}' +
    '.srch input:focus{border-color:#E0A800;box-shadow:0 0 0 3px rgba(255,193,7,.25)}.res{max-height:52vh;overflow:auto}.res:empty{display:none}' +
    '.res a{display:block;text-decoration:none;color:#1E2D4F;padding:9px 10px;border-radius:10px;margin:4px 0;font:600 14.5px Inter,sans-serif;border:1px solid #E3E5EA}.res a:hover,.res a:focus{border-color:#E0A800;background:#FFFBEB}' +
    '.res a small{display:block;font:500 12.5px Inter,sans-serif;color:#6B7280;margin-top:2px}.res a em{font-style:normal;font:700 10.5px Inter,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#8A6100;margin-left:6px}.res p{margin:8px 4px;font:500 14px Inter,sans-serif;color:#6B7280}' +
    '.sb a.tu{border-color:#FFC107;background:#FFF6D6}' + '.sb a.dg[hidden]{display:none}' +
    '@media (max-width:760px){.rail{display:none}.mob{display:inline-flex}}' +
    '@media print{.rail,.mob,.drawer,.scrim{display:none!important}}';
  var rail = '<div class="rail"><button type="button" class="logo" data-open="" aria-label="Open the menu">MA<small>MENU</small></button><button type="button" class="sbtn" aria-label="Search the site">' + svg(I.search) + '<span>Search</span></button>' +
    S.map(function (s) { return '<button type="button" data-open="' + s.id + '" class="' + (s.id === cur ? 'cur' : '') + '" aria-label="' + esc(s.title) + '">' + svg(I[s.icon]) + '<span>' + esc(s.label) + '</span></button>'; }).join('') +
    '<span class="sp"></span><button type="button" class="mus" aria-label="Music player">' + svg(I.note) + '<span>Music</span></button></div>';
  var drawer = '<div class="scrim" hidden></div><div class="drawer" hidden role="dialog" aria-label="Menu"><div class="dh"><div><b>Mr. Allen</b><span>Mathematics</span></div><button type="button" class="x" aria-label="Close the menu">' + svg(I.close, 18) + '</button></div><div class="srch"><input type="search" placeholder="Search: slope, exponents, games…" aria-label="Search the site"><div class="res" role="list"></div></div><div class="list">' +
    S.map(function (s) {
      return '<div class="sec' + (s.id === cur ? ' cur' : '') + '" data-id="' + s.id + '"><button type="button" class="sh" aria-expanded="false">' + '<span class="ic">' + svg(I[s.icon]) + '</span><span class="tx">' + esc(s.title) + '</span><span class="chev">' + svg(I.chev, 16) + '</span></button>' +
        '<div class="sb" hidden><p>' + esc(s.desc) + '</p>' + s.links.map(function (l) {
          if (l.music) return '<button type="button" class="lk mus2">' + esc(l.t) + (l.n ? '<small>' + esc(l.n) + '</small>' : '') + '</button>';
          if (l.dg) return '<a class="dg" hidden target="_blank" rel="noopener" href="#">\uD83E\uDD16 Ask Digit<small>what should I work on next?</small></a>';
          if (l.tu) return '<a class="tu" href="' + url(l.h) + '">★ This unit<small>the unit we are working on now</small></a>';
          return '<a href="' + url(l.h) + '"' + (l.nt ? ' target="_blank" rel="noopener"' : '') + (l.h === rel ? ' aria-current="page"' : '') + '>' + esc(l.t) + (l.n ? '<small>' + esc(l.n) + '</small>' : '') + '</a>';
        }).join('') + '</div></div>';
    }).join('') + '</div></div>';
  sr.innerHTML = '<style>' + css + '</style>' + rail + '<button type="button" class="mob" data-open="">' + svg(I.menu, 18) + 'Menu</button>' + drawer;
  document.body.insertBefore(host, document.body.firstChild);

  // make room for the rail on wide screens
  var pad = document.createElement('style'); pad.id = 'side-nav-pad';
  pad.textContent = '@media screen and (min-width:761px){html{padding-left:' + W + 'px}}@media screen and (max-width:760px){html{padding-top:58px}}@media print{html{padding:0}}';
  document.head.appendChild(pad);

  var $ = function (s) { return sr.querySelector(s); }, dr = $('.drawer'), sc = $('.scrim');
  function openSec(id) {
    [].forEach.call(sr.querySelectorAll('.sec'), function (x) { var on = x.getAttribute('data-id') === id; x.classList.toggle('open', on); x.querySelector('.sb').hidden = !on; x.querySelector('.sh').setAttribute('aria-expanded', String(on)); });
  }
  function open(id) { dr.hidden = false; sc.hidden = false; openSec(id || cur); var f = sr.querySelector('.sec.open .sh') || $('.x'); f.focus(); }
  function close() { dr.hidden = true; sc.hidden = true; }
  [].forEach.call(sr.querySelectorAll('[data-open]'), function (b) { b.addEventListener('click', function () { open(b.getAttribute('data-open')); }); });
  [].forEach.call(sr.querySelectorAll('.sh'), function (b) { b.addEventListener('click', function () { var s = b.parentNode, on = !s.classList.contains('open'); openSec(on ? s.getAttribute('data-id') : ''); }); });
  $('.x').addEventListener('click', close); sc.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !dr.hidden) close(); });

  // "This unit" (site-config.js): load it if the page did not, then point the gold link at the unit
  var UN = { 1: 'unit1.html', 2: 'unit2.html', 3: 'unit3.html', 4: 'unit4.html', 5: 'unit5.html', 6: 'unit6.html', 7: 'unit7.html', 8: 'unit8.html', 9: 'unit9.html' };
  function setTU() { var n = +((window.SITE_CONFIG || {}).thisUnit) || 0, a = sr.querySelector('a.tu'); if (a && UN[n]) { a.href = root + 'grade8/' + UN[n]; a.firstChild.textContent = '★ This unit: Unit ' + n; }
    var T = ((window.SITE_CONFIG || {}).together || []).map(Number);       // units taught at the same time (site-config.js)
    if (a && T.length > 1 && T.indexOf(n) > -1) { a.href = root + 'grade8/units' + T.join('-') + '.html';
      a.firstChild.textContent = '★ This unit: Units ' + T.join(' & '); a.querySelector('small').textContent = 'we are working on both at the same time';
      var lp = sr.querySelector('.sec[data-id="le"] .sb p'); if (lp && !lp.querySelector('b')) lp.insertAdjacentHTML('afterbegin', '<b>Right now we are working on Units ' + T.join(' and ') + ' at the same time.</b> '); }
    var du = String((window.SITE_CONFIG || {}).digitUrl || '');            // Ask Digit (Digit.gs): only a script.google.com address
    if (/^https:\/\/script\.google\.com\//.test(du)) sr.querySelectorAll('a.dg').forEach(function (d) { d.href = du + '?digit=1' + (n ? '&u=' + n : ''); d.hidden = false; }); }
  if (window.SITE_CONFIG) setTU(); else { var cs = document.createElement('script'); cs.src = root + 'site-config.js'; cs.onload = setTU; document.head.appendChild(cs); }

  // Search (search-index.js, loaded the first time the box is used)
  var sIn = sr.querySelector('.srch input'), sRes = sr.querySelector('.res'), IDX = null, waiting = false;
  function loadIdx(cb) {
    if (IDX) return cb(); if (window.SITE_SEARCH) { IDX = window.SITE_SEARCH; return cb(); }
    if (waiting) return; waiting = true; var sc2 = document.createElement('script'); sc2.src = root + 'search-index.js?v=' + (window.__SNV || '20261118a');
    sc2.onload = function () { IDX = window.SITE_SEARCH || []; waiting = false; cb(); }; document.head.appendChild(sc2);
  }
  function norm(t) { return String(t).toLowerCase().replace(/[^a-z0-9√π ]+/g, ' '); }
  function find() {
    var q = norm(sIn.value).trim(); if (!q) { sRes.innerHTML = ''; return; }
    var words = q.split(/\s+/).filter(Boolean);
    var hits = IDX.map(function (r) {
      var T = norm(r[0]), D = norm(r[1] + ' ' + (r[3] || '')), sc = 0;
      for (var i = 0; i < words.length; i++) { var w = words[i], st = w.replace(/s$/, ''); if (T.indexOf(st) >= 0) sc += T.indexOf(st) === 0 ? 4 : 3; else if (D.indexOf(st) >= 0) sc += 1; else return null; }
      if (r[4] === 'PDF' || r[4] === 'Answer key') sc -= 1.5;
      return { r: r, sc: sc };
    }).filter(Boolean).sort(function (a, b) { return b.sc - a.sc || a.r[0].length - b.r[0].length; }).slice(0, 12);
    sRes.innerHTML = hits.length ? hits.map(function (h) { var r = h.r; return '<a role="listitem" href="' + url(r[2]) + '">' + esc(r[0]) + (r[4] ? '<em>' + esc(r[4]) + '</em>' : '') + '<small>' + esc(r[1]) + '</small></a>'; }).join('')
      : '<p>No matches. Try a shorter word, like “slope” or “angle”.</p>';
  }
  sIn.addEventListener('input', function () { loadIdx(find); });
  sIn.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var a = sRes.querySelector('a'); if (a) location.href = a.href; } });
  sr.querySelector('.sbtn').addEventListener('click', function () { open(cur); setTimeout(function () { sIn.focus(); }, 30); });

  // ♪ Music: the same small pop-out player as the top bar
  function music() {
    var w = null; try { w = window.open('', 'mathmusic', 'popup,width=420,height=700'); } catch (e) { }
    if (!w) { location.href = root + 'grade8/drift.html'; return; }
    var fresh = true; try { fresh = !w.location.href || w.location.href === 'about:blank'; } catch (e) { fresh = false; }
    if (fresh) w.location.href = root + 'grade8/drift.html?mini=1'; w.focus();
  }
  $('.rail .mus').addEventListener('click', music); $('.mus2').addEventListener('click', function () { close(); music(); });
  setInterval(function () { var on = false; try { on = Date.now() - Number(localStorage.getItem('mm-beat') || 0) < 4000; } catch (e) { } $('.rail .mus').classList.toggle('on', on); $('.rail .mus span').textContent = on ? 'Playing' : 'Music'; }, 2500);
})();
