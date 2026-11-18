/* Laser Vault — finale cutscene (Nov 18, 2026; students asked for "a video or animation that shows the core being
   retrieved" when they finish). Plays in the page before the results screen. Wing D (The Core) = the full story
   (~22 s): blast doors open, the laser rings around the Core shut off, the agent grabs it, the alarm goes off, the
   escape run, the hover-jet lifts off over the city, then a Vault Master badge. Wings A–C = a short version (~7 s):
   doors open, the agent grabs a wing key, "next wing". Original art, made in SVG. Skip button + Enter/Space/Esc.
   Reduced motion = still pictures with the captions. Uses AFX sounds when the game is not muted.
   LVFinale.play({ full, wing, level, score, stars, gems }, done) */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var css = document.createElement('style');
  css.textContent =
    '#lvf{position:fixed;inset:0;z-index:2147483600;background:#03020c;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Inter,system-ui,sans-serif;color:#EAF0FF}' +
    '#lvf .stage{position:relative;width:min(96vw,calc(82vh*16/9));aspect-ratio:16/9;border-radius:14px;overflow:hidden;box-shadow:0 0 0 2px rgba(0,240,255,.35),0 0 60px rgba(0,240,255,.15)}' +
    '#lvf svg.sc{position:absolute;inset:0;width:100%;height:100%;display:block}' +
    '#lvf .cap{position:absolute;left:50%;bottom:6%;transform:translateX(-50%);max-width:86%;text-align:center;background:rgba(6,4,24,.82);border:1px solid rgba(0,240,255,.45);border-radius:12px;padding:10px 18px;font:800 clamp(15px,2.3vw,24px)/1.3 Inter,sans-serif;opacity:0;transition:opacity .35s}' +
    '#lvf .cap.on{opacity:1}#lvf .cap b{color:#FFC107}' +
    '#lvf .big{position:absolute;left:0;right:0;top:12%;text-align:center;font:900 clamp(28px,6vw,64px)/1 Orbitron,Inter,sans-serif;letter-spacing:.08em;color:#FFC107;text-shadow:0 0 18px rgba(255,193,7,.7);opacity:0;transform:scale(.6);transition:opacity .3s,transform .4s cubic-bezier(.2,1.6,.4,1)}' +
    '#lvf .big.on{opacity:1;transform:none}#lvf .big.red{color:#ff4466;text-shadow:0 0 18px rgba(255,68,102,.8)}' +
    '#lvf .bar{display:flex;gap:10px;margin-top:12px}' +
    '#lvf button{font:800 15px Inter,sans-serif;border-radius:10px;padding:10px 18px;cursor:pointer;border:2px solid rgba(160,170,255,.35);background:transparent;color:#fff}' +
    '#lvf button.go{background:#FFC107;color:#1E2D4F;border-color:#FFC107}' +
    '#lvf .alarm{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,transparent 45%,rgba(255,30,60,.55));opacity:0}' +
    '#lvf .alarm.on{animation:lvfAl .5s steps(2) infinite}@keyframes lvfAl{0%{opacity:.9}100%{opacity:0}}' +
    '#lvf .flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none}#lvf .flash.on{animation:lvfFl .6s ease-out}@keyframes lvfFl{0%{opacity:.95}100%{opacity:0}}' +
    '#lvf .a{transform-box:fill-box;transform-origin:center}' +
    '@keyframes lvfDoorL{to{transform:translateX(-62%)}}@keyframes lvfDoorR{to{transform:translateX(62%)}}' +
    '@keyframes lvfSpin{to{transform:rotate(360deg)}}@keyframes lvfSpinR{to{transform:rotate(-360deg)}}' +
    '@keyframes lvfOff{0%,60%{opacity:1}65%{opacity:.2}70%{opacity:1}75%{opacity:.1}80%,100%{opacity:0}}' +
    '@keyframes lvfFloat{50%{transform:translateY(-10px)}}@keyframes lvfBob{50%{transform:translateY(-4px)}}' +
    '@keyframes lvfWalk{to{transform:translateX(var(--dx))}}@keyframes lvfLift{to{transform:translateY(-70px) scale(.85)}}@keyframes lvfHand{40%{transform:translate(0,-40px)}100%{transform:translate(var(--hx),var(--hy)) scale(.4)}}' +
    '@keyframes lvfScroll{to{transform:translateX(-50%)}}@keyframes lvfSweep{0%,100%{transform:rotate(-28deg)}50%{transform:rotate(28deg)}}' +
    '@keyframes lvfJet{0%{transform:translate(0,0)}30%{transform:translate(0,-60px)}100%{transform:translate(900px,-260px) scale(.4)}}' +
    '@keyframes lvfPulse{50%{opacity:.45}}@keyframes lvfGrow{from{transform:scale(0)}to{transform:scale(1)}}@keyframes lvfSpark{0%{opacity:1;transform:scale(.2)}100%{opacity:0;transform:scale(1.6)}}' +
    '#lvf .badge{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;background:radial-gradient(ellipse at 50% 40%,#1b2a6b,#05041a 70%)}' +
    '#lvf .badge .t{font:900 clamp(26px,5vw,54px)/1 Orbitron,Inter,sans-serif;letter-spacing:.08em;color:#FFC107;text-shadow:0 0 18px rgba(255,193,7,.6)}' +
    '#lvf .badge .s{font:600 clamp(14px,2vw,20px)/1.4 Inter,sans-serif;max-width:80%;color:#EAF0FF}' +
    '#lvf .badge .st{font-size:clamp(28px,5vw,48px);letter-spacing:.2em;color:#FFC107}#lvf .badge .st i{font-style:normal;color:#3a3f66}' +
    '#lvf .badge .sc2{font:800 clamp(16px,2.4vw,24px) "JetBrains Mono",monospace;color:#00f0ff}' +
    (reduce ? '#lvf *{animation:none!important;transition:none!important}' : '');
  document.head.appendChild(css);

  var AG = '<g class="a" style="animation:lvfBob .5s ease-in-out infinite">' +
    '<rect x="-9" y="10" width="7" height="16" rx="3" fill="#0e1230"/><rect x="2" y="10" width="7" height="16" rx="3" fill="#0e1230"/>' +
    '<path d="M-14 14c0-14 6-20 14-20s14 6 14 20z" fill="#1b2050" stroke="#00f0ff" stroke-width="1.5"/>' +
    '<rect x="-18" y="0" width="6" height="14" rx="3" fill="#1b2050"/><rect x="12" y="0" width="6" height="14" rx="3" fill="#1b2050"/>' +
    '<circle cx="0" cy="-14" r="13" fill="#1d2352" stroke="#00f0ff" stroke-width="1.5"/>' +
    '<rect x="-10" y="-18" width="20" height="7" rx="3.5" fill="#00f0ff" filter="url(#lvfGlow)"/>' +
    '<circle cx="14" cy="-12" r="2.5" fill="#FFC107"/></g>';
  var DEFS = '<defs><filter id="lvfGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
    '<radialGradient id="lvfCoreG"><stop offset="0" stop-color="#fff7d0"/><stop offset=".45" stop-color="#FFC107"/><stop offset="1" stop-color="#b37400"/></radialGradient>' +
    '<radialGradient id="lvfHalo"><stop offset="0" stop-color="rgba(255,193,7,.55)"/><stop offset="1" stop-color="rgba(255,193,7,0)"/></radialGradient>' +
    '<linearGradient id="lvfSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05041a"/><stop offset="1" stop-color="#2a0f4f"/></linearGradient>' +
    '<pattern id="lvfGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="rgba(0,240,255,.12)"/></pattern></defs>';
  function core(r, color) {           // a glowing crystal (hexagon with facets)
    var p = [], q = [];
    for (var i = 0; i < 6; i++) { var a = Math.PI / 3 * i - Math.PI / 2; p.push((r * Math.cos(a)).toFixed(1) + ' ' + (r * 1.25 * Math.sin(a)).toFixed(1)); q.push((r * .5 * Math.cos(a)).toFixed(1) + ' ' + (r * .62 * Math.sin(a)).toFixed(1)); }
    return '<circle r="' + r * 2.4 + '" fill="url(#lvfHalo)"/><polygon points="' + p.join(' ') + '" fill="' + (color || 'url(#lvfCoreG)') + '" stroke="#fff3b0" stroke-width="2" filter="url(#lvfGlow)"/>' +
      '<polygon points="' + q.join(' ') + '" fill="rgba(255,255,255,.45)"/>';
  }
  function room(extra) {                // the vault room: grid wall, floor, cyan trim
    return '<rect width="960" height="540" fill="#070520"/><rect width="960" height="400" fill="url(#lvfGrid)"/>' +
      '<rect y="400" width="960" height="140" fill="#0d0a2e"/><path d="M0 400H960" stroke="#00f0ff" stroke-width="2" opacity=".6"/>' + (extra || '');
  }
  function sfx(n) { try { if (window.AFX && !AFX.muted && AFX.sfx[n]) AFX.sfx[n](); } catch (e) {} }
  function boom(x, y, opt) { try { if (window.AFX && !reduce) AFX[opt && opt.c ? 'confetti' : 'sparks'](x, y, opt || {}); } catch (e) {} }

  /* each scene: { svg, ms, cap, big, at: [[ms, fn]] } */
  function scenes(o) {
    var wingKey = o.wingName || 'this wing';
    var doors = {
      ms: 4200, cap: o.full ? 'The last laser fence is down. The <b>Core room</b> is open.' : 'Fence down! <b>' + wingKey + '</b> is open.',
      svg: room('<rect x="330" y="120" width="300" height="280" fill="#FFC107" opacity=".9" filter="url(#lvfGlow)"/>' +
        '<g transform="translate(480 300)">' + core(30) + '</g>' +
        '<g class="a" style="animation:lvfDoorL 1.6s .6s ease-in forwards"><rect x="330" y="110" width="150" height="290" fill="#1b2050" stroke="#00f0ff" stroke-width="3"/><path d="M350 130l110 250M460 130L350 380" stroke="#ff2b4e" stroke-width="3" opacity=".7"/></g>' +
        '<g class="a" style="animation:lvfDoorR 1.6s .6s ease-in forwards"><rect x="480" y="110" width="150" height="290" fill="#1b2050" stroke="#00f0ff" stroke-width="3"/><path d="M500 130l110 250M610 130L500 380" stroke="#ff2b4e" stroke-width="3" opacity=".7"/></g>' +
        '<g transform="translate(150 380) scale(2.2)">' + AG + '</g>'),
      at: [[500, function () { sfx('clang'); }], [700, function () { sfx('whoosh'); }]]
    };
    if (!o.full) {
      var grab = {
        ms: 3400, cap: 'Wing key collected. <b>' + (o.next ? o.next + ' is next' : 'On to the next wing') + '</b>, Agent!',
        svg: room('<rect x="430" y="300" width="100" height="100" fill="#1b2050" stroke="#00f0ff" stroke-width="2"/>' +
          '<g style="--dx:190px" class="a"><g style="animation:lvfWalk 1.4s ease-out forwards" class="a"><g transform="translate(200 380) scale(2.2)">' + AG + '</g></g></g>' +
          '<g class="a" style="--hx:-59px;--hy:105px;animation:lvfHand 1.1s 1.5s ease-in-out forwards"><g transform="translate(480 280)"><g class="a" style="animation:lvfSpin 3s linear infinite">' + core(18, '#00f0ff') + '</g></g></g>'),
        at: [[1500, function () { sfx('power'); }], [1700, function (st) { boom(st.x(480), st.y(220), { count: 40 }); }]]
      };
      return [doors, grab];
    }
    var rings = '', i;
    for (i = 0; i < 3; i++) rings += '<g class="a" style="animation:lvfOff 3.4s ' + (0.6 + i * 0.9) + 's forwards"><ellipse cx="480" cy="250" rx="' + (90 + i * 45) + '" ry="' + (34 + i * 16) + '" fill="none" stroke="#ff2b4e" stroke-width="4" filter="url(#lvfGlow)" class="a" style="animation:' + (i % 2 ? 'lvfSpinR' : 'lvfSpin') + ' ' + (4 + i) + 's linear infinite"/></g>';
    var lasers = {
      ms: 4600, cap: 'The Core is guarded by laser rings. Your angles power them down: <b>1… 2… 3… OFF!</b>',
      svg: room('<rect x="430" y="320" width="100" height="80" fill="#1b2050" stroke="#00f0ff" stroke-width="2"/><rect x="410" y="300" width="140" height="24" rx="6" fill="#262b66"/>' +
        '<g transform="translate(480 250)"><g class="a" style="animation:lvfFloat 2s ease-in-out infinite">' + core(36) + '</g></g>' + rings),
      at: [[1100, function () { sfx('zap'); }], [2000, function () { sfx('zap'); }], [2900, function () { sfx('zap'); }], [3400, function () { sfx('power'); }]]
    };
    var grabIt = {
      ms: 4400, cap: '<b>Core secured!</b> …Uh-oh. That set off the alarm!',
      svg: room('<rect x="430" y="320" width="100" height="80" fill="#1b2050" stroke="#00f0ff" stroke-width="2"/><rect x="410" y="300" width="140" height="24" rx="6" fill="#262b66"/>' +
        '<g style="--dx:190px" class="a"><g class="a" style="animation:lvfWalk 1.3s ease-out forwards"><g transform="translate(200 380) scale(2.2)">' + AG + '</g></g></g>' +
        '<g class="a" style="--hx:-59px;--hy:135px;animation:lvfHand 1.1s 1.5s ease-in-out forwards"><g transform="translate(480 250)">' + core(36) + '</g></g>' +
        '<g opacity=".9"><circle cx="70" cy="60" r="18" fill="#ff2b4e" class="a" style="animation:lvfPulse .5s 2.3s infinite"/><circle cx="890" cy="60" r="18" fill="#ff2b4e" class="a" style="animation:lvfPulse .5s 2.3s infinite"/></g>'),
      at: [[1500, function (st) { sfx('power'); st.flash(); boom(st.x(480), st.y(230), { count: 70 }); }],
           [2300, function (st) { st.alarm(true); st.big('ALARM!', true); sfx('laser'); }], [2800, function () { sfx('laser'); }], [3300, function () { sfx('laser'); }]]
    };
    var walls = '';
    for (i = 0; i < 16; i++) walls += '<rect x="' + (i * 120) + '" y="60" width="60" height="340" fill="#120f3d" stroke="rgba(0,240,255,.25)"/><circle cx="' + (i * 120 + 30) + '" cy="90" r="6" fill="#ff2b4e"/>';
    var sweep = '';
    for (i = 0; i < 3; i++) sweep += '<g transform="translate(' + (220 + i * 260) + ' 40)"><rect x="-3" y="0" width="6" height="380" fill="#ff2b4e" filter="url(#lvfGlow)" class="a" style="transform-origin:top center;animation:lvfSweep ' + (1.1 + i * .25) + 's ease-in-out infinite"/></g>';
    var run = {
      ms: 4400, cap: 'The vault is locking down. <b>RUN, Agent!</b> Duck the lasers!',
      svg: '<rect width="960" height="540" fill="#070520"/><g class="a" style="animation:lvfScroll 1.6s linear infinite">' + walls + '</g>' + sweep +
        '<rect y="400" width="960" height="140" fill="#0d0a2e"/><path d="M0 400H960" stroke="#00f0ff" stroke-width="2" opacity=".6"/>' +
        '<g transform="translate(300 380) scale(2.2)"><g class="a" style="animation:lvfBob .22s ease-in-out infinite">' + AG.replace('lvfBob .5s', 'lvfBob .22s') + '</g><g transform="translate(18 -2)">' + core(7) + '</g></g>',
      at: [[200, function (st) { st.alarm(true); sfx('whoosh'); }], [1400, function () { sfx('laser'); }], [2600, function () { sfx('whoosh'); }], [3600, function () { sfx('laser'); }]]
    };
    var city = '', stars = '';
    for (i = 0; i < 22; i++) { var h = 60 + ((i * 53) % 140), w = 30 + ((i * 17) % 30); city += '<rect x="' + (i * 46) + '" y="' + (440 - h) + '" width="' + w + '" height="' + (h + 100) + '" fill="#0b0930"/>' + (i % 3 ? '<rect x="' + (i * 46 + 8) + '" y="' + (452 - h) + '" width="6" height="8" fill="#FFC107" opacity=".7"/>' : ''); }
    for (i = 0; i < 40; i++) stars += '<circle cx="' + ((i * 97) % 960) + '" cy="' + ((i * 61) % 260) + '" r="' + (i % 4 ? 1.2 : 2) + '" fill="#fff" opacity=".7"/>';
    var jet = '<g transform="translate(330 330)"><g class="a" style="animation:lvfJet 3.6s .8s ease-in forwards">' +
      '<path d="M-90 10L-60 -20H70L110 10L70 30H-60z" fill="#1b2050" stroke="#00f0ff" stroke-width="3"/><path d="M-10 -20L20 -48H60L50 -20z" fill="#00f0ff" opacity=".55"/>' +
      '<g transform="translate(25 -32) scale(.9)">' + core(9) + '</g>' +
      '<rect x="-95" y="0" width="16" height="14" rx="4" fill="#FFC107"/><ellipse cx="-104" cy="7" rx="14" ry="6" fill="#ff4dd6" opacity=".8" class="a" style="animation:lvfPulse .2s infinite"/>' +
      '<ellipse cx="-30" cy="40" rx="18" ry="5" fill="#00f0ff" opacity=".7" class="a" style="animation:lvfPulse .25s infinite"/><ellipse cx="50" cy="40" rx="18" ry="5" fill="#00f0ff" opacity=".7" class="a" style="animation:lvfPulse .25s infinite"/></g></g>';
    var escape = {
      ms: 5000, cap: 'To the roof! The hover-jet lifts off with the Core. <b>Mission complete!</b>',
      svg: '<rect width="960" height="540" fill="url(#lvfSky)"/>' + stars + '<circle cx="800" cy="90" r="40" fill="#fff3b0" opacity=".85"/>' + city +
        '<rect y="440" width="960" height="100" fill="#120f3d"/><path d="M0 440H960" stroke="#00f0ff" stroke-width="2" opacity=".6"/>' + jet,
      at: [[300, function (st) { st.alarm(false); sfx('power'); }], [900, function () { sfx('whoosh'); }],
           [2600, function (st) { boom(st.x(250), st.y(150), { c: 1, count: 90 }); sfx('boom'); }], [3300, function (st) { boom(st.x(700), st.y(120), { c: 1, count: 90 }); sfx('boom'); }],
           [4000, function (st) { boom(st.x(480), st.y(90), { c: 1, count: 120 }); sfx('win'); }]]
    };
    return [doors, lasers, grabIt, run, escape];
  }

  function play(o, done) {
    o = o || {};
    var list = scenes(o), wrap = document.createElement('div'), timers = [], ended = false;
    wrap.id = 'lvf'; wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-label', o.full ? 'The Core: mission complete' : 'Wing cleared');
    wrap.innerHTML = '<div class="stage"><svg class="sc" viewBox="0 0 960 540" preserveAspectRatio="xMidYMid slice"></svg><div class="alarm"></div><div class="flash"></div><div class="big"></div><div class="cap" aria-live="polite"></div></div>' +
      '<div class="bar"><button type="button" class="skip">Skip ▸▸</button></div>';
    document.body.appendChild(wrap);
    var stage = wrap.querySelector('.stage'), svg = wrap.querySelector('svg'), cap = wrap.querySelector('.cap'), big = wrap.querySelector('.big');
    var st = {
      x: function (vx) { var r = stage.getBoundingClientRect(); return r.left + vx / 960 * r.width; },
      y: function (vy) { var r = stage.getBoundingClientRect(); return r.top + vy / 540 * r.height; },
      flash: function () { var f = wrap.querySelector('.flash'); f.classList.remove('on'); void f.offsetWidth; f.classList.add('on'); },
      alarm: function (on) { wrap.querySelector('.alarm').classList.toggle('on', !!on); },
      big: function (t, red) { big.textContent = t; big.classList.toggle('red', !!red); big.classList.add('on'); }
    };
    function later(ms, fn) { timers.push(setTimeout(fn, reduce ? Math.min(ms, 200) : ms)); }
    function show(i) {
      if (ended) return;
      if (i >= list.length) return badge();
      var s = list[i];
      big.classList.remove('on'); cap.classList.remove('on');
      svg.innerHTML = DEFS + s.svg;
      later(150, function () { cap.innerHTML = s.cap; cap.classList.add('on'); });
      (s.at || []).forEach(function (a) { later(a[0], function () { if (!ended) a[1](st); }); });
      timers.push(setTimeout(function () { show(i + 1); }, reduce ? 2600 : s.ms));
    }
    function badge() {
      st.alarm(false); big.classList.remove('on'); cap.classList.remove('on');
      var stars = Math.max(0, Math.min(3, o.stars || 0)), sx = '';
      for (var i = 0; i < 3; i++) sx += i < stars ? '★' : '<i>★</i>';
      var b = document.createElement('div'); b.className = 'badge';
      b.innerHTML = '<svg viewBox="-60 -60 120 120" width="120" height="120" style="animation:lvfGrow .6s cubic-bezier(.2,1.6,.4,1)"><defs>' + DEFS.slice(6, -7) + '</defs>' +
        '<circle r="54" fill="#1b2050" stroke="#FFC107" stroke-width="5"/>' + (o.full ? core(22) : '<g>' + core(18, '#00f0ff') + '</g>') + '</svg>' +
        '<div class="t">' + (o.full ? 'VAULT MASTER' : 'WING CLEARED') + '</div>' +
        '<div class="s">' + (o.full ? 'You cracked every lock and brought the Core home. HQ is proud of you, Agent.' : (o.wingName || 'This wing') + ' is done. ' + (o.next ? 'Next stop: ' + o.next + '.' : 'Keep going, Agent.')) + '</div>' +
        '<div class="st">' + sx + '</div><div class="sc2">' + (o.level ? o.level + ' · ' : '') + (o.score || 0) + ' pts' + (o.gems ? ' · ' + o.gems + ' bonus crystal' + (o.gems > 1 ? 's' : '') : '') + '</div>';
      stage.appendChild(b);
      sfx('win'); boom(innerWidth / 2, innerHeight / 3, { c: 1, count: o.full ? 160 : 70 });
      var bt = wrap.querySelector('.skip'); bt.textContent = 'See my results ▸'; bt.className = 'go'; bt.focus();
    }
    function end() {
      if (ended) return; ended = true;
      timers.forEach(clearTimeout); document.removeEventListener('keydown', key, true);
      wrap.remove(); if (done) done();
    }
    function key(e) { if (Date.now() - t0 < 900) return; if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); end(); } }
    wrap.querySelector('.bar button').addEventListener('click', end);
    document.addEventListener('keydown', key, true);
    var t0 = Date.now(); sfx('whoosh');
    show(0);
    return { end: end };
  }
  window.LVFinale = { play: play };
})();
