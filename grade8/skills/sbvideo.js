/* Skill Builders VIDEOS (Nov 16, 2026, Zach: "short animated fun videos for the Skill Builders section ... Computer voice
   and music ... begin with all units").
   Every lesson in grade8/skills/uN.js gets a short animated video, built from the lesson itself, played in the page:
     Intro (Digit, our original robot host, + a hook line) → Big idea → the lesson's animation → Worked example (the
     walk-through's right moves, line by line) → Watch out → Your turn (a check question, 5-second think, then the answer)
     → Wrap up ("You can now …").
   Voice = the device's computer voice (speechSynthesis; math is read in words by SB.say). Music = an original upbeat loop
   made with Web Audio (it gets quieter while Digit talks). Captions are always on. Voice and Music switches are remembered.
   No video files: nothing to download, works on Chromebooks.
   Open: the "Watch the video" button on a lesson's Watch screen, or skill-builders-unitN.html#video-<lesson id>
   (#video = the unit's first lesson). ?debug exposes window.__SBV. */
(function () {
  'use strict';
  var SB = window.SB = window.SB || {};
  if (SB.PAPER) return;
  var DBG = /[?&]debug/.test(location.search);
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------- hook lines (one per lesson) ---------- */
  var HOOK = {
    '1a': 'Some numbers are neat and tidy. Others go on forever and never repeat. Let’s sort them out!',
    '1b': 'A decimal that repeats forever can hide a simple fraction. Let’s find it with the 9’s rule!',
    '1c': 'What number times itself makes 49? Today we undo squares and cubes.',
    '1d': '√20 is not a whole number. But we can get really close. Let’s estimate!',
    '2a': 'Exponents are a shortcut for multiplying the same number again and again.',
    '2b': 'Multiplying powers with the same base? There is a speedy trick. Let’s learn it!',
    '2c': 'Powers of powers, zero, and negative exponents look scary. But they follow simple rules.',
    '2d': 'How do scientists write giant numbers and tiny numbers? Scientific notation!',
    '2e': 'Let’s multiply and divide huge numbers without a calculator.',
    '3a': 'An equation is like a balance. Whatever you do to one side, you do to the other.',
    '3b': 'Before we solve, we clean up. Let’s distribute and combine like terms!',
    '3c': 'x on both sides? No problem. We gather the x’s on one side.',
    '3d': 'Some equations have one answer. Some have none. Some have infinitely many!',
    '3e': 'Inequalities have lots of answers. Let’s solve them and show them on a number line.',
    '4a': 'When lines cross, angles team up. Let’s meet the angle pairs!',
    '4b': 'Two parallel lines and one line across them make eight angles, but only two sizes!',
    '4c': 'Every triangle keeps a secret: its three angles always add to 180°.',
    '4d': 'Step outside the triangle. The outside angle has a shortcut!',
    '5a': 'Right triangles have a superpower: a² + b² = c².',
    '5b': 'Know the two legs? Let’s find the long side, the hypotenuse!',
    '5c': 'Know the hypotenuse and one leg? Let’s find the missing leg.',
    '5d': 'Is that triangle really a right triangle? Let’s test it!',
    '5e': 'How far apart are two points? Draw a right triangle and find out!',
    '6a': 'A function is a rule machine. Put in an input, and you get exactly one output.',
    '6b': 'How steep is that line? Slope tells us: rise over run!',
    '6c': 'Every line has a recipe: y = mx + b. Let’s find m and b.',
    '6d': 'Where does it start, and how fast does it change? Let’s read a real story.',
    '6e': 'Two lines, one meeting point. That point solves the system!',
    '7a': 'Dots on a graph can tell a story. Let’s read scatter plots!',
    '7b': 'Draw one line through the dots and you can make predictions!',
    '7c': 'A two-way table sorts people two ways at once. Let’s read it like a pro.',
    '8a': 'A translation is a slide. Every point moves the same way.',
    '8b': 'A reflection is a flip, like a mirror image.',
    '8c': 'A rotation is a turn around the origin. Let’s spin!',
    '8d': 'A dilation makes a shape bigger or smaller, but it keeps the same shape.'
  };
  var OUTRO = ['Nice work!', 'You’ve got this!', 'Awesome job!', 'Way to go!', 'Math power: unlocked!'];
  var CHAP = { intro: 'Intro', idea: 'Big idea', anim: 'Watch', walk: 'Example', warn: 'Watch out', turn: 'Your turn', wrap: 'Wrap up' };

  /* ---------- reading math out loud ---------- */
  var SUP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' };
  function powWords(p) { return p === '2' ? ' squared' : p === '3' ? ' cubed' : p === '1' ? ' to the first power' : ' to the ' + p.replace('-', 'negative ') + ' power'; }
  function sayHtml(html) {
    var d = document.createElement('div'); d.innerHTML = html;
    [].forEach.call(d.querySelectorAll('.frac'), function (f) { var s = f.children; if (s.length === 2) f.textContent = ' ' + s[0].textContent + ' over ' + s[1].textContent + ' '; });
    [].forEach.call(d.querySelectorAll('.ov'), function (o) { o.textContent = ' ' + o.textContent.split('').join(' ') + ' repeating '; });
    [].forEach.call(d.querySelectorAll('sup'), function (s) { s.textContent = powWords(s.textContent.replace(/[−–]/g, '-').trim()); });
    return say(d.textContent || '');
  }
  function say(t) {
    t = String(t);
    t = t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, function (m) { return powWords(m.split('').map(function (c) { return SUP[c]; }).join('')); });
    t = t.replace(/√\s*\(([^)]*)\)/g, ' the square root of $1 ').replace(/∛\s*/g, ' the cube root of ').replace(/√\s*/g, ' the square root of ');
    t = t.replace(/(^|[\s(=,:])[−-](?=\d)/g, '$1negative ');
    t = t.replace(/(\d)\s*\/\s*(\d)/g, '$1 over $2');
    t = t.replace(/([A-Za-z]{3,}\)?)\s*=\s*(?=[A-Za-z]{3,})/g, '$1 means ').replace(/(\d)\(/g, '$1 times (');
    t = t.replace(/[−–]/g, ' minus ').replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/≈/g, ' is about ').replace(/≠/g, ' is not equal to ')
      .replace(/≤/g, ' is less than or equal to ').replace(/≥/g, ' is greater than or equal to ').replace(/</g, ' is less than ').replace(/>/g, ' is greater than ')
      .replace(/=/g, ' equals ').replace(/\+/g, ' plus ').replace(/°/g, ' degrees').replace(/π/g, ' pi ').replace(/→/g, ', ').replace(/…/g, ' ')
      .replace(/·/g, ', ').replace(/’/g, "'");
    return t.replace(/\s+/g, ' ').trim();
  }
  SB.say = say;
  function sentences(t) { return (String(t).match(/[^.!?]+[.!?]+["”’)]*|[^.!?]+$/g) || [t]).map(function (x) { return x.trim(); }).filter(Boolean); }
  function plain(h) { return SB._plain ? SB._plain(h) : String(h).replace(/<[^>]+>/g, ''); }

  /* ---------- styles ---------- */
  var css = '' +
    '.sbv-open{display:flex;align-items:center;gap:12px;width:100%;margin:0 0 12px;padding:12px 16px;border:0;border-radius:14px;cursor:pointer;text-align:left;background:linear-gradient(120deg,#1E2D4F,#2d4580);color:#fff;font:700 17px Inter,sans-serif;box-shadow:0 3px 0 #0f1a33}' +
    '.sbv-open:hover{filter:brightness(1.08)}.sbv-open .pl{flex:none;width:44px;height:44px;border-radius:50%;background:#FFC107;color:#1E2D4F;display:flex;align-items:center;justify-content:center;font-size:20px}' +
    '.sbv-open small{display:block;font:500 13px Inter,sans-serif;color:#cfd8f5}' +
    '#sbv{position:fixed;inset:0;z-index:9000;background:rgba(9,14,30,.92);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:14px 10px 40px}' +
    '#sbv[hidden]{display:none}.sbv-box{width:min(1100px,100%)}' +
    '.sbv-top{display:flex;gap:10px;align-items:center;color:#fff;margin:0 0 8px;flex-wrap:wrap}.sbv-top h2{flex:1;margin:0;color:#fff!important;font:700 clamp(16px,2.4vw,22px) "Source Serif 4",Georgia,serif;min-width:200px}' +
    '.sbv-top select,.sbv-btn{font:600 14px Inter,sans-serif;border-radius:10px;border:1.5px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);color:#fff;padding:8px 12px;cursor:pointer}' +
    '.sbv-top select option{color:#1E2D4F}.sbv-btn:hover{border-color:#FFC107}.sbv-btn.main{background:#FFC107;color:#1E2D4F;border-color:#FFC107;font-weight:800;min-width:96px}' +
    '.sbv-stage{position:relative;width:100%;aspect-ratio:16/9;border-radius:16px;overflow:hidden;background:linear-gradient(160deg,#16244a 0%,#2a3f78 55%,#3b2f6b 100%);box-shadow:0 10px 40px rgba(0,0,0,.45);font-size:calc(var(--u,10px)*1.9);font-family:Inter,sans-serif;color:#1E2D4F;user-select:none}' +
    '.sbv-stage:fullscreen{border-radius:0}' +
    '.sbv-sym{position:absolute;color:rgba(255,255,255,.09);font:800 calc(var(--u)*5) "JetBrains Mono",monospace;animation:sbvfloat linear infinite;pointer-events:none}' +
    '@keyframes sbvfloat{from{transform:translateY(0) rotate(0)}to{transform:translateY(calc(var(--u)*-70)) rotate(40deg)}}' +
    '.sbv-host{position:absolute;left:1.5%;bottom:12%;width:25%;height:66%;transition:transform .6s cubic-bezier(.3,.8,.3,1)}' +
    '.sbv-host svg{width:100%;height:100%;overflow:visible}' +
    '.sbv-board{position:absolute;right:2.5%;top:5%;width:68%;height:72%;background:#FFFDF7;border-radius:calc(var(--u)*1.6);box-shadow:0 calc(var(--u)*.6) 0 #c9b97a,0 calc(var(--u)*1.2) calc(var(--u)*3) rgba(0,0,0,.35);padding:calc(var(--u)*2.2) calc(var(--u)*2.6);overflow:hidden;display:flex;flex-direction:column;gap:calc(var(--u)*1)}' +
    '.sbv-board.pop{animation:sbvpop .55s cubic-bezier(.3,1.5,.5,1)}@keyframes sbvpop{from{transform:scale(.85) rotate(-2deg);opacity:0}to{transform:none;opacity:1}}' +
    '.sbv-board .k{font:800 calc(var(--u)*1.25) Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#B8860B}' +
    '.sbv-board h3{margin:0;font:700 calc(var(--u)*3.1)/1.15 "Source Serif 4",Georgia,serif;color:#1E2D4F}' +
    '.sbv-board .big{font:600 calc(var(--u)*2.15)/1.45 Inter,sans-serif;color:#1B2333}.sbv-board .big b{color:#1D4ED8}' +
    '.sbv-board .warn{border-left:calc(var(--u)*.6) solid #B42318;background:#FDEDEC;border-radius:calc(var(--u)*.8);padding:calc(var(--u)*1.4);font:600 calc(var(--u)*2.2)/1.45 Inter,sans-serif;color:#5c1410}' +
    '.sbv-board .warn b{color:#B42318}' +
    '.sbv-board .prob{font:700 calc(var(--u)*2.3)/1.3 Inter,sans-serif;background:#EEF3FE;border-radius:calc(var(--u)*.8);padding:calc(var(--u)*1) calc(var(--u)*1.4)}' +
    '.sbv-board .wq{font:600 calc(var(--u)*1.9)/1.35 Inter,sans-serif;color:#5B6475;min-height:1.4em}' +
    '.sbv-board .wk{flex:1;min-height:0;font-size:calc(var(--u)*1.9);overflow:hidden}.sbv-board .wk *{font-size:inherit!important}.sbv-board .wk .work{margin:0;padding-left:1.4em}.sbv-board .wk li{margin:.2em 0}.sbv-board .wk .lab{font-size:.7em!important;margin:0 .6em;color:#8A6100}' +
    '.sbv-board .wl{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:calc(var(--u)*.7)}' +
    '.sbv-board .wl li{font:700 calc(var(--u)*2.3)/1.3 "JetBrains Mono",monospace;color:#1E2D4F;animation:sbvin .5s ease both}.sbv-board .wl li.now{color:#15803D}' +
    '@keyframes sbvin{from{opacity:0;transform:translateX(calc(var(--u)*3))}to{opacity:1;transform:none}}' +
    '.sbv-board .fig{display:flex;justify-content:center;flex:1;min-height:0}.sbv-board .fig svg{max-width:100%;max-height:100%;height:auto}' +
    '.sbv-board .anim{flex:1;min-height:0;border:0;background:none;display:flex;justify-content:center}.sbv-board .anim svg{width:100%;height:100%;max-height:none;background:none}' +
    '.sbv-board .ch{display:grid;grid-template-columns:1fr 1fr;gap:calc(var(--u)*.9)}' +
    '.sbv-board .ch div{border:calc(var(--u)*.25) solid #C9CFDB;border-radius:calc(var(--u)*1);padding:calc(var(--u)*.8) calc(var(--u)*1.2);font:700 calc(var(--u)*2)/1.3 Inter,sans-serif;background:#fff;transition:all .4s}' +
    '.sbv-board .ch div i{font-style:normal;color:#8A93A6;margin-right:calc(var(--u)*.8)}' +
    '.sbv-board .ch div.right{border-color:#15803D;background:#E7F5EC;transform:scale(1.04)}.sbv-board .ch div.dim{opacity:.35}' +
    '.sbv-board .ans{font:800 calc(var(--u)*2.6) "JetBrains Mono",monospace;color:#15803D}' +
    '.sbv-count{position:absolute;right:4%;top:6%;width:calc(var(--u)*9);height:calc(var(--u)*9);border-radius:50%;background:#FFC107;color:#1E2D4F;display:flex;align-items:center;justify-content:center;font:900 calc(var(--u)*5) "JetBrains Mono",monospace;box-shadow:0 0 0 calc(var(--u)*.8) rgba(255,193,7,.35);animation:sbvbeat 1s infinite}' +
    '@keyframes sbvbeat{50%{transform:scale(1.12)}}' +
    '.sbv-title{position:absolute;inset:0;display:flex;flex-direction:column;align-items:flex-end;justify-content:center;padding-right:5%;color:#fff;text-align:right}' +
    '.sbv-title .k{font:800 calc(var(--u)*1.5) Inter,sans-serif;letter-spacing:.2em;color:#FFC107;text-transform:uppercase}' +
    '.sbv-title h1{margin:calc(var(--u)*1) 0;font:800 calc(var(--u)*4.6)/1.08 "Source Serif 4",Georgia,serif;max-width:68%;text-shadow:0 calc(var(--u)*.4) 0 rgba(0,0,0,.35)}' +
    '.sbv-title h1 span{display:inline-block;animation:sbvdrop .6s cubic-bezier(.3,1.6,.5,1) both}' +
    '@keyframes sbvdrop{from{opacity:0;transform:translateY(calc(var(--u)*-6)) rotate(-8deg)}to{opacity:1;transform:none}}' +
    '.sbv-title .l{font:700 calc(var(--u)*1.9) Inter,sans-serif;background:rgba(255,255,255,.14);border-radius:999px;padding:calc(var(--u)*.6) calc(var(--u)*1.6)}' +
    '.sbv-cap{position:absolute;left:0;right:0;bottom:0;min-height:12%;background:rgba(6,10,24,.82);color:#fff;font:600 calc(var(--u)*1.9)/1.35 Inter,sans-serif;padding:calc(var(--u)*.9) 4%;display:flex;align-items:center;justify-content:center;text-align:center}' +
    '.sbv-cap b{color:#FFD54F}.sbv-cap .m{color:#9ef7ff}' +
    '.sbv-big{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(6,10,24,.25);cursor:pointer}' +
    '.sbv-big span{width:calc(var(--u)*13);height:calc(var(--u)*13);border-radius:50%;background:#FFC107;color:#1E2D4F;display:flex;align-items:center;justify-content:center;font-size:calc(var(--u)*5.5);box-shadow:0 0 0 calc(var(--u)*1.5) rgba(255,193,7,.3)}' +
    '.sbv-big[hidden]{display:none}.sbv-bar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:8px}' +
    '.sbv-prog{flex:1;min-width:200px;display:flex;gap:3px}' +
    '.sbv-prog button{flex:1;height:30px;border:0;border-radius:6px;background:rgba(255,255,255,.12);color:#cfd8f5;font:700 11px Inter,sans-serif;cursor:pointer;position:relative;overflow:hidden;padding:0 4px;white-space:nowrap;text-overflow:ellipsis}' +
    '.sbv-prog button i{position:absolute;left:0;top:0;bottom:0;background:rgba(255,193,7,.45);width:0;transition:width .3s}' +
    '.sbv-prog button span{position:relative}.sbv-prog button.on{color:#fff;outline:2px solid #FFC107}' +
    '.sbv-conf{position:absolute;width:calc(var(--u)*1.1);height:calc(var(--u)*1.6);top:-5%;animation:sbvfall linear forwards}' +
    '@keyframes sbvfall{to{transform:translateY(calc(var(--u)*65)) rotate(720deg)}}' +
    /* Digit (the host) */
    '.dg-arm{transform-box:fill-box;transform-origin:10% 50%;transition:transform .5s}' +
    '.dg-l{transform-origin:90% 50%}' +
    '.sbv-host.wave .dg-r{animation:dgwave .7s ease-in-out infinite alternate}@keyframes dgwave{from{transform:rotate(-70deg)}to{transform:rotate(-120deg)}}' +
    '.sbv-host.point .dg-r{transform:rotate(-25deg)}.sbv-host.think .dg-r{transform:rotate(-140deg)}' +
    '.sbv-host.bounce{animation:dgbounce 1.1s ease-in-out infinite}@keyframes dgbounce{50%{transform:translateY(-5%)}}' +
    '.sbv-host.dance{animation:dgdance .55s ease-in-out infinite alternate}@keyframes dgdance{from{transform:rotate(-6deg) translateY(0)}to{transform:rotate(6deg) translateY(-6%)}}' +
    '.sbv-host.dance .dg-r,.sbv-host.dance .dg-l{animation:dgwave .4s ease-in-out infinite alternate}' +
    '.dg-mouth{transform-box:fill-box;transform-origin:center}.sbv-host.talk .dg-mouth{animation:dgtalk .18s ease-in-out infinite alternate}@keyframes dgtalk{from{transform:scaleY(.3)}to{transform:scaleY(1.2)}}' +
    '.dg-eye{transform-box:fill-box;transform-origin:center;animation:dgblink 4s infinite}@keyframes dgblink{0%,94%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}' +
    '.dg-sign,.dg-q{opacity:0;transition:opacity .4s}.sbv-host.warn .dg-sign{opacity:1}.sbv-host.think .dg-q{opacity:1}' +
    '.dg-ant{transform-box:fill-box;transform-origin:50% 100%;animation:dgant 2s ease-in-out infinite alternate}@keyframes dgant{from{transform:rotate(-10deg)}to{transform:rotate(10deg)}}' +
    '@media (prefers-reduced-motion:reduce){.sbv-sym,.sbv-host,.sbv-host *,.sbv-board,.sbv-title h1 span,.sbv-conf{animation:none!important}}';
  var st = el('style'); st.textContent = css; document.head.appendChild(st);

  /* Digit: an original robot host (gold body, navy screen face, antenna) */
  var DIGIT = '<svg viewBox="0 0 200 300" aria-hidden="true">' +
    '<ellipse cx="100" cy="288" rx="62" ry="9" fill="rgba(0,0,0,.3)"/>' +
    '<g class="dg-ant"><line x1="100" y1="58" x2="100" y2="22" stroke="#1E2D4F" stroke-width="5"/><circle cx="100" cy="18" r="10" fill="#ff4d6a"/></g>' +
    '<rect x="70" y="232" width="20" height="46" rx="9" fill="#1E2D4F"/><rect x="110" y="232" width="20" height="46" rx="9" fill="#1E2D4F"/>' +
    '<rect x="58" y="270" width="36" height="14" rx="7" fill="#E0A800"/><rect x="106" y="270" width="36" height="14" rx="7" fill="#E0A800"/>' +
    '<rect class="dg-arm dg-l" x="10" y="160" width="46" height="16" rx="8" fill="#E0A800" transform="rotate(30 50 168)"/>' +
    '<g class="dg-arm dg-r"><rect x="146" y="160" width="46" height="16" rx="8" fill="#E0A800"/><circle cx="194" cy="168" r="11" fill="#FFC107" stroke="#E0A800" stroke-width="3"/></g>' +
    '<rect x="40" y="56" width="120" height="186" rx="34" fill="#FFC107" stroke="#E0A800" stroke-width="4"/>' +
    '<rect x="54" y="74" width="92" height="74" rx="18" fill="#1E2D4F"/>' +
    '<g class="dg-eye"><ellipse cx="80" cy="104" rx="11" ry="13" fill="#fff"/><circle cx="82" cy="106" r="5.5" fill="#1E2D4F"/></g>' +
    '<g class="dg-eye"><ellipse cx="120" cy="104" rx="11" ry="13" fill="#fff"/><circle cx="122" cy="106" r="5.5" fill="#1E2D4F"/></g>' +
    '<ellipse class="dg-mouth" cx="100" cy="130" rx="13" ry="6" fill="#9ef7ff"/>' +
    '<circle cx="64" cy="128" r="6" fill="#ff8fa3" opacity=".7"/><circle cx="136" cy="128" r="6" fill="#ff8fa3" opacity=".7"/>' +
    '<rect x="66" y="166" width="68" height="44" rx="10" fill="#fff6d6" stroke="#E0A800" stroke-width="3"/>' +
    '<text x="100" y="197" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="24" font-weight="800" fill="#1E2D4F">+−×÷</text>' +
    '<g class="dg-sign"><rect x="128" y="20" width="62" height="62" rx="12" fill="#B42318"/><text x="159" y="68" text-anchor="middle" font-size="48" font-weight="900" fill="#fff" font-family="Inter">!</text></g>' +
    '<g class="dg-q"><text x="160" y="50" font-size="40" font-weight="900" fill="#FFC107" font-family="Inter">?</text><text x="182" y="22" font-size="26" font-weight="900" fill="#9ef7ff" font-family="Inter">?</text></g>' +
    '</svg>';

  /* ---------- music: an original upbeat loop (Web Audio) ---------- */
  var AC = null, MG = null, MT = null, NEXT = 0, STEP = 0, DUCK = 1;
  var CH = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]], BASS = [36, 31, 33, 29], ARP = [0, 1, 2, 1, 0, 2, 1, 2];
  function ctx() { try { if (!AC) { AC = new (window.AudioContext || window.webkitAudioContext)(); MG = AC.createGain(); MG.gain.value = 0; MG.connect(AC.destination); } if (AC.state === 'suspended') AC.resume(); } catch (e) {} return AC; }
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function note(t, f, len, type, vol, dec) {
    var o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + (dec || len));
    o.connect(g).connect(MG); o.start(t); o.stop(t + (dec || len) + 0.05);
  }
  var NB = null;
  function noise(t, len, vol, hp) {
    if (!NB) { NB = AC.createBuffer(1, AC.sampleRate * 0.3, AC.sampleRate); var d = NB.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    var s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); s.buffer = NB; f.type = 'highpass'; f.frequency.value = hp;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + len); s.connect(f).connect(g).connect(MG); s.start(t); s.stop(t + len + 0.02);
  }
  function kick(t) { var o = AC.createOscillator(), g = AC.createGain(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.18); g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28); o.connect(g).connect(MG); o.start(t); o.stop(t + 0.3); }
  function sched() {
    var spb = 60 / 104 / 2;   // eighth notes at 104 bpm
    while (NEXT < AC.currentTime + 0.25) {
      var t = NEXT, s = STEP % 64, bar = Math.floor(s / 16) % 4, e = s % 16, c = CH[bar];
      if (e % 8 === 0 || e === 11) kick(t);
      if (e % 8 === 4) { noise(t, 0.16, 0.22, 1500); note(t, 190, 0.08, 'triangle', 0.08); }
      if (e % 2 === 0) noise(t, 0.04, 0.05, 7000);
      if (e % 4 === 0 || e === 14) note(t, hz(BASS[bar] + (e === 14 ? 7 : 0)), 0.3, 'triangle', 0.22, 0.32);
      note(t, hz(c[ARP[e % 8]] + 12), 0.2, 'sine', 0.07, 0.25);
      note(t, hz(c[ARP[e % 8]] + 24), 0.1, 'sine', 0.018, 0.12);
      if (e === 0) c.forEach(function (m) { note(t, hz(m), 1.6, 'triangle', 0.025, 1.8); });
      NEXT += spb; STEP++;
    }
  }
  function musicOn(on) {
    if (!ctx()) return;
    var t = AC.currentTime;
    MG.gain.cancelScheduledValues(t); MG.gain.setValueAtTime(MG.gain.value, t);
    if (on) { MG.gain.linearRampToValueAtTime(0.42 * DUCK, t + 0.4); if (!MT) { NEXT = AC.currentTime + 0.05; MT = setInterval(sched, 60); sched(); } }
    else { MG.gain.linearRampToValueAtTime(0, t + 0.3); clearInterval(MT); MT = null; }
  }
  function duck(talking) { DUCK = talking ? 0.32 : 1; if (MT && AC) { var t = AC.currentTime; MG.gain.cancelScheduledValues(t); MG.gain.setValueAtTime(MG.gain.value, t); MG.gain.linearRampToValueAtTime(0.42 * DUCK, t + 0.25); } }
  function blip(kind) {
    if (!S.music || !ctx()) return; var t = AC.currentTime + 0.01;
    if (kind === 'ding') { [1047, 1319, 1568].forEach(function (f, i) { note(t + i * 0.07, f, 0.3, 'sine', 0.12, 0.5); }); }
    else if (kind === 'tick') note(t, 880, 0.05, 'square', 0.05, 0.06);
    else noise(t, 0.25, 0.08, 2500);
  }

  /* ---------- voice ---------- */
  var VOICE = null;
  function pickVoice() {
    try {
      var vs = speechSynthesis.getVoices().filter(function (v) { return /^en(-|_)?/i.test(v.lang); });
      VOICE = vs.filter(function (v) { return /Google US English|Samantha|Aria|Jenny|Natural/i.test(v.name); })[0] || vs.filter(function (v) { return /en-US/i.test(v.lang); })[0] || vs[0] || null;
    } catch (e) {}
  }
  if ('speechSynthesis' in window) { pickVoice(); try { speechSynthesis.onvoiceschanged = pickVoice; } catch (e) {} }

  /* ---------- the video: a list of beats ---------- */
  function strip(h) { return String(h || '').replace(/<[^>]+>/g, ''); }
  function beatsOf(U, li) {
    var L = U.lessons[li], B = [], n = U.n + '.' + (li + 1);
    function add(scene, cap, extra) { var b = extra || {}; b.scene = scene; b.cap = cap; B.push(b); return b; }
    add('intro', 'Hey, it’s <b>Digit</b>! ' + (HOOK[L.id] || 'Let’s learn ' + L.title + '!'), { pose: 'wave bounce' });
    sentences(plain(L.big)).length && (function () {
      var d = document.createElement('div'); d.innerHTML = L.big;
      var parts = sentencesHtml(L.big);
      parts.forEach(function (p, i) { add('idea', p, { pose: i ? 'point' : 'point bounce' }); });
    })();
    if (L.anim && L.anim.frames) L.anim.frames.forEach(function (f, i) { add('anim', f.cap || '', { frame: i, pose: 'point' }); });
    if (L.walk) {
      add('walk', 'Let’s try one together: <b>' + L.walk.prob + '</b>', { step: -1, pose: 'think' });
      L.walk.steps.forEach(function (s, i) {
        var right = s.ch && s.ch[0]; right = typeof right === 'string' ? right : (right && right[0]) || '';
        add('walk', s.q + ' ' + right + (/[.!?]$/.test(strip(right)) ? '' : '.'), { step: i, pose: i % 2 ? 'point' : 'think' });
      });
    }
    if (L.watch) add('warn', '<b>Watch out!</b> ' + L.watch, { pose: 'warn' });
    var q = (L.checks || [])[0];
    if (q) {
      add('turn', 'Your turn! ' + q.q + (q.ch ? ' Pick an answer.' : ''), { pose: 'think', q: q });
      add('turn', 'Pause and think…', { pose: 'think', q: q, count: 5 });
      var ans = q.ch ? (typeof q.ch[0] === 'string' ? q.ch[0] : q.ch[0][0]) : String(q.show || q.ans) + (q.unit || '');
      add('turn', 'The answer is <b>' + ans + '</b>. ' + (q.ok || ''), { pose: 'dance', q: q, reveal: true });
    }
    add('wrap', OUTRO[li % OUTRO.length] + ' You can now ' + (L.can || 'use this skill.') + ' Next, try the Check questions in this lesson.', { pose: 'dance', conf: true });
    B.forEach(function (b) { b.lesson = L; b.U = U; b.li = li; b.num = n; });
    return B;
  }
  function sentencesHtml(h) {   // split html at sentence ends that are not inside a tag
    var out = [], cur = '', depth = 0;
    for (var i = 0; i < h.length; i++) {
      var c = h[i]; cur += c;
      if (c === '<') depth++; else if (c === '>') depth--;
      if (depth === 0 && /[.!?]/.test(c) && (h[i + 1] === ' ' || i === h.length - 1) && !/\d/.test(h[i + 1] || '')) {
        var nx = h.slice(i + 1).match(/^\s*(<\/[^>]+>\s*)*/); if (nx && nx[0].trim()) { cur += nx[0]; i += nx[0].length; }
        if (strip(cur).trim().length > 2) { out.push(cur.trim()); cur = ''; }
      }
    }
    if (strip(cur).trim()) out.push(cur.trim());
    // join very short pieces
    var j = []; out.forEach(function (p) { if (j.length && strip(j[j.length - 1]).length < 40) j[j.length - 1] += ' ' + p; else j.push(p); });
    return j;
  }

  /* ---------- player ---------- */
  var S = { music: store('sbv-music') !== 'off', voice: store('sbv-voice') !== 'off', open: false };
  var ov, stage, board, host, cap, big, prog, playB, titleH, sel, B = [], k = 0, playing = false, T = null, token = 0, scene = '', svgEl = null, pfx = '', UNIT = null;
  function build() {
    if (ov) return;
    ov = el('div'); ov.id = 'sbv'; ov.hidden = true; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Lesson video');
    ov.innerHTML = '<div class="sbv-box"><div class="sbv-top"><h2></h2><select aria-label="Pick a lesson video"></select><button class="sbv-btn" data-a="close" type="button">✕ Close</button></div>' +
      '<div class="sbv-stage"><div class="sbv-syms"></div><div class="sbv-scene"></div><div class="sbv-host">' + DIGIT + '</div><div class="sbv-cap" aria-live="polite"></div><div class="sbv-big"><span>▶</span></div></div>' +
      '<div class="sbv-bar"><button class="sbv-btn main" data-a="play" type="button">▶ Play</button><button class="sbv-btn" data-a="back" type="button">‹ Back</button><button class="sbv-btn" data-a="next" type="button">Next ›</button>' +
      '<div class="sbv-prog"></div><button class="sbv-btn" data-a="voice" type="button"></button><button class="sbv-btn" data-a="music" type="button"></button><button class="sbv-btn" data-a="full" type="button">⛶ Full screen</button></div></div>';
    document.body.appendChild(ov);
    stage = ov.querySelector('.sbv-stage'); host = ov.querySelector('.sbv-host'); cap = ov.querySelector('.sbv-cap'); big = ov.querySelector('.sbv-big');
    prog = ov.querySelector('.sbv-prog'); playB = ov.querySelector('[data-a=play]'); titleH = ov.querySelector('.sbv-top h2'); sel = ov.querySelector('select');
    var syms = ov.querySelector('.sbv-syms'), SY = ['x', '+', '÷', 'π', '√', '=', '²', '%', '×', '7', '∠', 'y'];
    for (var i = 0; i < 14; i++) { var s = el('span', 'sbv-sym', SY[i % SY.length]); s.style.left = (i * 7.3 % 100) + '%'; s.style.top = (40 + (i * 37) % 70) + '%'; s.style.animationDuration = (14 + (i * 3) % 11) + 's'; s.style.animationDelay = (-i * 1.7) + 's'; syms.appendChild(s); }
    ov.addEventListener('click', function (e) {
      var a = e.target.closest('[data-a]'); if (!a) { if (e.target.closest('.sbv-big')) toggle(); return; }
      var w = a.dataset.a;
      if (w === 'close') close(); else if (w === 'play') toggle(); else if (w === 'back') jump(Math.max(0, k - 1)); else if (w === 'next') jump(Math.min(B.length - 1, k + 1));
      else if (w === 'voice') { S.voice = !S.voice; store('sbv-voice', S.voice ? 'on' : 'off'); labels(); if (playing) jump(k); }
      else if (w === 'music') { S.music = !S.music; store('sbv-music', S.music ? 'on' : 'off'); labels(); musicOn(S.music && playing); }
      else if (w === 'full') { try { if (document.fullscreenElement) document.exitFullscreen(); else stage.requestFullscreen(); } catch (x) {} }
    });
    sel.addEventListener('change', function () { load(UNIT, +sel.value); });
    document.addEventListener('keydown', function (e) {
      if (!S.open) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === ' ' && !/SELECT|BUTTON/.test((e.target || {}).tagName || '')) { e.preventDefault(); toggle(); }
      else if (e.key === 'ArrowRight') jump(Math.min(B.length - 1, k + 1)); else if (e.key === 'ArrowLeft') jump(Math.max(0, k - 1));
    });
    addEventListener('resize', size); document.addEventListener('fullscreenchange', size);
  }
  function size() { if (stage) stage.style.setProperty('--u', (stage.clientWidth / 100) + 'px'); }
  function labels() {
    ov.querySelector('[data-a=voice]').textContent = 'Voice: ' + (S.voice ? 'on' : 'off');
    ov.querySelector('[data-a=music]').textContent = 'Music: ' + (S.music ? 'on' : 'off');
    playB.textContent = playing ? '❚❚ Pause' : (k >= B.length - 1 && B.done ? '↻ Watch again' : '▶ Play');
    big.hidden = playing;
  }
  function open(U, li) {
    build(); UNIT = U; S.open = true; ov.hidden = false; document.documentElement.style.overflow = 'hidden';
    sel.innerHTML = U.lessons.map(function (L, i) { return '<option value="' + i + '">' + U.n + '.' + (i + 1) + ' ' + L.title + '</option>'; }).join('');
    size(); load(U, li);
  }
  function load(U, li) {
    stop(); B = beatsOf(U, li); k = 0; scene = ''; sel.value = String(li);
    titleH.textContent = 'Video · ' + U.n + '.' + (li + 1) + ' ' + U.lessons[li].title;
    var ch = [], seen = {}; B.forEach(function (b, i) { if (!seen[b.scene]) { seen[b.scene] = 1; ch.push({ s: b.scene, i: i }); } });
    prog.innerHTML = ch.map(function (c) { return '<button type="button" data-i="' + c.i + '" data-s="' + c.s + '"><i></i><span>' + CHAP[c.s] + '</span></button>'; }).join('');
    [].forEach.call(prog.children, function (b) { b.addEventListener('click', function () { jump(+b.dataset.i); }); });
    render(0); labels(); size();
  }
  function close() {
    stop(); S.open = false; ov.hidden = true; document.documentElement.style.overflow = '';
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) {}
    if (/^#video/.test(location.hash)) try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  }
  function toggle() { if (playing) stop(); else { if (B.done && k >= B.length - 1) { B.done = false; k = 0; scene = ''; } play(); } }
  function play() { playing = true; ctx(); musicOn(S.music); labels(); run(k); }
  function stop() { playing = false; token++; clearTimeout(T); try { speechSynthesis.cancel(); } catch (e) {} musicOn(false); if (host) host.classList.remove('talk'); if (ov) labels(); }
  function jump(i) { var was = playing; token++; clearTimeout(T); try { speechSynthesis.cancel(); } catch (e) {} if (host) host.classList.remove('talk'); if (B[i] && B[k] && B[i].scene !== B[k].scene) scene = ''; if (i < k) scene = ''; k = i; if (was) run(i); else render(i); }

  function est(t) { return Math.max(2600, t.length * 62 + 700); }
  function run(i) {
    var my = ++token; k = i; render(i);
    var b = B[i], text = b.say || sayHtml(b.cap);
    var after = function (extra) { if (my !== token) return; T = setTimeout(function () { if (my !== token) return; if (k + 1 < B.length) run(k + 1); else { B.done = true; playing = false; musicOn(false); labels(); } }, extra); };
    if (b.count) {   // think time: count down with the music
      var c = b.count; (function tick() { if (my !== token) return; var e = stage.querySelector('.sbv-count'); if (e) e.textContent = c; blip('tick'); if (c-- > 1) T = setTimeout(tick, 1000); else after(900); })();
      return;
    }
    var t0 = Date.now();   // a beat never goes by faster than reading speed (some devices finish speech at once when they have no voice)
    if (S.voice && 'speechSynthesis' in window) speakAll(sentences(text), my, function () { after(Math.max(550, est(text) * 0.75 - (Date.now() - t0))); }, est(text) * 2.2 + 3000);
    else { host.classList.add('talk'); T = setTimeout(function () { if (my !== token) return; host.classList.remove('talk'); after(300); }, est(text)); }
  }
  function speakAll(list, my, done, limit) {
    var i = 0, finished = false, guard = setTimeout(fin, limit);
    function fin() { if (finished) return; finished = true; clearTimeout(guard); duck(false); host.classList.remove('talk'); if (my === token) done(); }
    function next() {
      if (my !== token) { clearTimeout(guard); return; }
      if (i >= list.length) return fin();
      var u = new SpeechSynthesisUtterance(list[i++]); u.rate = 0.97; u.pitch = 1.08; u.lang = 'en-US'; if (VOICE) u.voice = VOICE;
      u.onend = function () { setTimeout(next, 120); }; u.onerror = function () { setTimeout(next, 120); };
      try { speechSynthesis.speak(u); } catch (e) { fin(); }
    }
    duck(true); host.classList.add('talk');
    try { speechSynthesis.cancel(); } catch (e) {}
    setTimeout(next, 60);
  }

  /* ---------- drawing a beat ---------- */
  function render(i) {
    var b = B[i]; if (!b) return; var L = b.lesson;
    var sc = stage.querySelector('.sbv-scene');
    host.className = 'sbv-host ' + (b.pose || '');
    host.style.transform = b.scene === 'intro' || b.scene === 'wrap' ? 'translateX(8%) scale(1.15)' : 'none';
    cap.innerHTML = '<span>' + (b.count ? 'Pause and think. What is your answer?' : b.cap) + '</span>';
    var fresh = b.scene !== scene;
    if (fresh) { scene = b.scene; sc.innerHTML = ''; blip('whoosh'); }
    if (b.scene === 'intro') {
      if (fresh) sc.innerHTML = '<div class="sbv-title"><div class="k">Skill Builders · Unit ' + b.U.n + '</div><h1>' + L.title.split(' ').map(function (w, j) { return '<span style="animation-delay:' + (0.15 + j * 0.09) + 's">' + w + '</span>'; }).join(' ') + '</h1><div class="l">Lesson ' + b.num + ' · with Digit</div></div>';
    } else if (b.scene === 'idea') {
      if (fresh) { sc.innerHTML = '<div class="sbv-board pop"><div class="k">The big idea</div><h3>' + L.title + '</h3><div class="big"></div></div>'; }
      var bigEl = sc.querySelector('.big'), parts = B.filter(function (x) { return x.scene === 'idea'; }), upto = parts.indexOf(b);
      bigEl.innerHTML = parts.slice(0, upto + 1).map(function (x, j) { return '<span style="' + (j === upto ? 'background:#FFF3C4;border-radius:6px' : '') + '">' + x.cap + '</span>'; }).join(' ');
    } else if (b.scene === 'anim') {
      if (fresh || !svgEl) {
        pfx = 'sv' + Math.floor(Math.random() * 1e6) + '-';
        sc.innerHTML = '<div class="sbv-board pop"><div class="k">Watch · ' + (L.anim.title || L.title) + '</div><div class="anim">' + SB._svgOf(L.anim, pfx) + '</div></div>';
        svgEl = sc.querySelector('svg');
        for (var j = 0; j < b.frame; j++) SB._applySet(svgEl, SB._prefSet(L.anim.frames[j].set, pfx));
        void svgEl.getBoundingClientRect();
      }
      SB._applySet(svgEl, SB._prefSet(L.anim.frames[b.frame].set, pfx));
    } else if (b.scene === 'walk') {
      if (fresh) sc.innerHTML = '<div class="sbv-board pop"><div class="k">Example</div><div class="prob">' + L.walk.prob + '</div><div class="wq"></div><div class="wk"></div></div>';
      var steps = L.walk.steps, lines = (L.walk.start || []).slice();
      sc.querySelector('.wq').innerHTML = b.step >= 0 ? steps[b.step].q : '';
      for (var s = 0; s <= b.step; s++) { var t = steps[s]; if (t.eq || t.ln) lines.push(t.eq ? { eq: t.eq, lab: t.lab, v: t.v } : { ln: t.ln, lab: t.lab }); }
      sc.querySelector('.wk').innerHTML = lines.length && SB.workHtml ? SB.workHtml(lines) : '';
      var wk = sc.querySelector('.wk'), fs = stage.clientWidth / 100 * 1.9; wk.style.fontSize = '';
      for (var g = 0; g < 8 && wk.scrollHeight > wk.clientHeight + 2 && fs > 8; g++) { fs *= 0.88; wk.style.fontSize = fs + 'px'; }
    } else if (b.scene === 'warn') {
      sc.innerHTML = '<div class="sbv-board pop"><div class="k" style="color:#B42318">Watch out</div><h3>Common mistake</h3><div class="warn">' + L.watch + '</div></div>';
    } else if (b.scene === 'turn') {
      var q = b.q;
      if (fresh) {
        var h = '<div class="sbv-board pop"><div class="k">Your turn</div><div class="big">' + q.q + '</div>' + (q.fig ? '<div class="fig">' + q.fig + '</div>' : '');
        if (q.ch) {
          var opts = q.ch.map(function (c) { return typeof c === 'string' ? c : c[0]; });
          opts = SB._shuffle ? SB._shuffle(opts, 'v' + q.id) : opts;
          h += '<div class="ch">' + opts.slice(0, 4).map(function (o, j) { return '<div data-o="' + encodeURIComponent(o) + '"><i>' + 'ABCD'[j] + '</i>' + o + '</div>'; }).join('') + '</div>';
        } else h += '<div class="ans" data-ans></div>';
        sc.innerHTML = h + '</div>';
      }
      var old = sc.querySelector('.sbv-count'); if (old) old.remove();
      if (b.count) sc.appendChild(el('div', 'sbv-count', String(b.count)));
      var right = q.ch ? (typeof q.ch[0] === 'string' ? q.ch[0] : q.ch[0][0]) : null;
      [].forEach.call(sc.querySelectorAll('.ch div'), function (d) { d.className = b.reveal ? (decodeURIComponent(d.dataset.o) === right ? 'right' : 'dim') : ''; });
      var a = sc.querySelector('[data-ans]'); if (a) a.textContent = b.reveal ? 'Answer: ' + (q.show || q.ans) + (q.unit || '') : 'Answer: ?';
      if (b.reveal) blip('ding');
    } else if (b.scene === 'wrap') {
      if (fresh) {
        sc.innerHTML = '<div class="sbv-board pop"><div class="k">Wrap up</div><h3>You can now…</h3><div class="big">' + (L.can || '') + '</div>' + (L.recap ? '<ol class="wl">' + L.recap.map(function (r) { return '<li>' + (typeof r === 'string' ? r : (r.ln || r.eq || '')) + '</li>'; }).join('') + '</ol>' : '') + '</div>';
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches) for (var c = 0; c < 40; c++) { var f = el('i', 'sbv-conf'); f.style.left = Math.random() * 100 + '%'; f.style.background = ['#FFC107', '#9ef7ff', '#ff8fa3', '#7CFC9A', '#fff'][c % 5]; f.style.animationDuration = (2 + Math.random() * 2.5) + 's'; f.style.animationDelay = Math.random() * 1.2 + 's'; sc.appendChild(f); }
        blip('ding');
      }
    }
    if (b.scene !== 'anim') svgEl = null;
    // progress
    [].forEach.call(prog.children, function (pb, j) {
      var from = +pb.dataset.i, to = prog.children[j + 1] ? +prog.children[j + 1].dataset.i : B.length;
      var on = i >= from && i < to; pb.classList.toggle('on', on);
      pb.firstChild.style.width = (i >= to ? 100 : on ? Math.round((i - from + 1) / (to - from) * 100) : 0) + '%';
    });
    ov.querySelector('[data-a=back]').disabled = i <= 0; ov.querySelector('[data-a=next]').disabled = i >= B.length - 1;
  }

  /* ---------- entry points ---------- */
  SB.video = {
    button: function (U, li) {
      var b = el('button', 'sbv-open', '<span class="pl">▶</span><span>Watch the video<small>About 2 minutes · Digit explains it with voice and music. Captions are on.</small></span>');
      b.type = 'button'; b.addEventListener('click', function () { open(U, li); });
      return b;
    },
    open: open, close: close, beatsOf: beatsOf, say: say, sayHtml: sayHtml
  };
  function fromHash() {
    var m = /^#video(?:-([\w]+))?$/.exec(location.hash); if (!m) return;
    var root = document.getElementById('sb'); if (!root) return;
    var U = SB.units && SB.units[+root.dataset.unit]; if (!U) return;
    var li = 0; if (m[1]) U.lessons.forEach(function (L, i) { if (L.id === m[1]) li = i; });
    open(U, li);
  }
  addEventListener('hashchange', fromHash);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(fromHash, 50); }); else setTimeout(fromHash, 50);
  if (DBG) window.__SBV = { get B() { return B; }, get k() { return k; }, S: S, jump: jump, render: function (i) { render(i); }, beatsOf: beatsOf, say: say, sayHtml: sayHtml, stop: stop };
})();
