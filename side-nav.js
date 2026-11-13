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
    menu: 'M4 6h16M4 12h16M4 18h16', close: 'M6 6l12 12M18 6L6 18', chev: 'M9 6l6 6-6 6'
  };
  var U = [['unit1.html', 'Unit 1', 'Real Numbers'], ['unit2.html', 'Unit 2', 'Exponents & Scientific Notation'], ['unit3.html', 'Unit 3', 'Linear Equations'],
    ['unit4.html', 'Unit 4', 'Angles & Geometry'], ['units3-4.html', 'Units 3–4', 'Pre-Test & Tutorial'], ['unit5.html', 'Unit 5', 'Pythagorean Theorem'],
    ['unit6.html', 'Unit 6', 'Functions, Slope & Systems'], ['unit7.html', 'Unit 7', 'Data Analysis'], ['unit8.html', 'Unit 8', 'Transformations'], ['unit9.html', 'Unit 9', 'Volume']];
  var S = [
    { id: 'g8', icon: 'book', label: '8th Grade', title: '8th Grade Math', desc: 'Your units. Each unit has notes, practice, Targeted Practice and a pre-test, in the order to do them.',
      links: [{ t: '8th Grade home', h: 'grade8/index.html' }].concat(U.map(function (u) { return { t: u[1], n: u[2], h: 'grade8/' + u[0] }; }))
        .concat([{ t: 'Skill Builders', n: 'short lessons on core skills', h: 'grade8/skill-builders.html' }]), sec: ['grade8/unit', 'grade8/units', 'grade8/index.html', 'grade8/skill', 'grade8/homework_turn_in'] },
    { id: 'm1', icon: 'm1', label: 'Math 1', title: 'NC Math 1', desc: 'For students in NC Math 1. Your teacher gives you the password.', links: [{ t: 'NC Math 1 home', h: 'math1/index.html' }], sec: ['math1/'] },
    { id: 'gr', icon: 'star', label: 'Grades', title: 'Grading & Standards', desc: 'How grades work: the 1–5 scale, what each score means, your I Can tracker and the I Can targets.',
      links: [{ t: 'Grading & Standards', h: 'grade8/grading.html' }, { t: 'Durable Skills', n: 'perseverance, teamwork, self-control', h: 'grade8/durable-skills.html' }], sec: ['grade8/grading', 'grade8/targets/', 'grade8/durable'] },
    { id: 'ar', icon: 'game', label: 'Arcade', title: 'Math Arcade', desc: 'Math games for integers, exponents, slope, angles and more. Play to practice.', links: [{ t: 'Enter the Arcade', h: 'grade8/arcade.html' }], sec: ['grade8/arcade'] },
    { id: 'rr', icon: 'wave', label: 'Reset', title: 'Reset Room & Music', desc: 'Take a short break, breathe, and get ready to work. Or play calm music while you work.',
      links: [{ t: 'Reset Room', n: 'calm-down activities', h: 'grade8/reset-room.html' }, { t: 'Chill Math Music', n: 'small player that keeps playing', music: true }], sec: ['grade8/reset-room', 'grade8/ripples', 'grade8/drift'] },
    { id: 'ca', icon: 'calc', label: 'Calculators', title: 'Calculators', desc: 'Use these only when the problem says "Calculator OK".',
      links: [{ t: 'Desmos Scientific Calculator', n: 'new tab ↗', h: 'https://www.desmos.com/scientific', nt: 1 }, { t: 'Desmos Graphing Calculator', n: 'new tab ↗', h: 'https://www.desmos.com/calculator', nt: 1 }] },
    { id: 'eo', icon: 'flag', label: 'Test Prep', title: 'Check-Ins & EOG Prep', desc: 'Practice for the NC Check-Ins and the End-of-Grade test.',
      links: [{ t: 'NC Check-Ins / Benchmarks', h: 'grade8/benchmarks.html' }, { t: 'EOG Prep', n: 'review, practice, study guide', h: 'grade8/8th_grade_eog_hub.html' }], sec: ['grade8/benchmark', 'grade8/checkin', 'grade8/8th_grade_eog', 'grade8/eog'] },
    { id: 'ci', icon: 'info', label: 'Class Info', title: 'Class Info', desc: 'Syllabus, Google Classroom links and family resources.', links: [{ t: 'Class Information', h: 'class-information.html' }], sec: ['class-information'] }
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
    '@media (max-width:760px){.rail{display:none}.mob{display:inline-flex}}' +
    '@media print{.rail,.mob,.drawer,.scrim{display:none!important}}';
  var rail = '<div class="rail"><button type="button" class="logo" data-open="" aria-label="Open the menu">MA<small>MENU</small></button>' +
    S.map(function (s) { return '<button type="button" data-open="' + s.id + '" class="' + (s.id === cur ? 'cur' : '') + '" aria-label="' + esc(s.title) + '">' + svg(I[s.icon]) + '<span>' + esc(s.label) + '</span></button>'; }).join('') +
    '<span class="sp"></span><button type="button" class="mus" aria-label="Music player">' + svg(I.note) + '<span>Music</span></button></div>';
  var drawer = '<div class="scrim" hidden></div><div class="drawer" hidden role="dialog" aria-label="Menu"><div class="dh"><div><b>Mr. Allen</b><span>Mathematics</span></div><button type="button" class="x" aria-label="Close the menu">' + svg(I.close, 18) + '</button></div><div class="list">' +
    S.map(function (s) {
      return '<div class="sec' + (s.id === cur ? ' cur' : '') + '" data-id="' + s.id + '"><button type="button" class="sh" aria-expanded="false">' + '<span class="ic">' + svg(I[s.icon]) + '</span><span class="tx">' + esc(s.title) + '</span><span class="chev">' + svg(I.chev, 16) + '</span></button>' +
        '<div class="sb" hidden><p>' + esc(s.desc) + '</p>' + s.links.map(function (l) {
          if (l.music) return '<button type="button" class="lk mus2">' + esc(l.t) + (l.n ? '<small>' + esc(l.n) + '</small>' : '') + '</button>';
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
