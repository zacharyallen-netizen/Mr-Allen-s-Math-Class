/* Site videos (Nov 17, 2026, Zach: "A video on the website that basically is a tour and shows its different features" and
   "A video for the student tracker folders and how they work ... explain the different trackers and encourage students to
   practice and improve their score. They should be short, friendly, and match the aesthetics of the website.")
   On-page videos like the Skill Builders videos (grade8/skills/sbvideo.js): Digit (the gold robot host), the device's
   computer voice, an original Web Audio music loop that ducks under the voice, captions always on, chapters, Back/Next,
   Space/arrows/Esc, Full screen. The styles, Digit, music and voice are copied from sbvideo.js (classes renamed sbv → stv).
   Scenes: title, shot (a screenshot of the site in a browser frame; the camera glides to the part being talked about and a
   gold ring marks it), board (a card with lines that appear one at a time), wrap (confetti).
   Screenshots: images/videos/tour/*.jpg (taken with Playwright, no student data) and images/trackers/merged-*.jpg (blank samples).
   Open: a button with data-site-video="tour|trackers", SiteVideo.open(id), or #video-tour / #video-trackers in the address.
   ?debug exposes window.__STV. Rule J4. */
(function () {
  'use strict';
  var SV = window.SiteVideo = window.SiteVideo || {};
  var DBG = /[?&]debug/.test(location.search);
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var ROOT = (function () { var s = document.currentScript && document.currentScript.src; return s ? s.replace(/site-video\.js.*$/, '') : '/'; })();
  /* ---------- styles ---------- */
  var css = '' +
    '.stv-open{display:flex;align-items:center;gap:12px;width:100%;margin:0 0 12px;padding:12px 16px;border:0;border-radius:14px;cursor:pointer;text-align:left;background:linear-gradient(120deg,#1E2D4F,#2d4580);color:#fff;font:700 17px Inter,sans-serif;box-shadow:0 3px 0 #0f1a33}' +
    '.stv-open:hover{filter:brightness(1.08)}.stv-open .pl{flex:none;width:44px;height:44px;border-radius:50%;background:#FFC107;color:#1E2D4F;display:flex;align-items:center;justify-content:center;font-size:20px}' +
    '.stv-open small{display:block;font:500 13px Inter,sans-serif;color:#cfd8f5}' +
    '#stv{position:fixed;inset:0;z-index:2147483000;background:rgba(9,14,30,.92);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:14px 10px 40px}' +
    '#stv[hidden]{display:none}.stv-box{width:min(1100px,100%)}' +
    '.stv-top{display:flex;gap:10px;align-items:center;color:#fff;margin:0 0 8px;flex-wrap:wrap}.stv-top h2{flex:1;margin:0;color:#fff!important;font:700 clamp(16px,2.4vw,22px) "Source Serif 4",Georgia,serif;min-width:200px}' +
    '.stv-top select,.stv-btn{font:600 14px Inter,sans-serif;border-radius:10px;border:1.5px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);color:#fff;padding:8px 12px;cursor:pointer}' +
    '.stv-top select option{color:#1E2D4F}.stv-btn:hover{border-color:#FFC107}.stv-btn.main{background:#FFC107;color:#1E2D4F;border-color:#FFC107;font-weight:800;min-width:96px}' +
    '.stv-stage{position:relative;width:100%;aspect-ratio:16/9;border-radius:16px;overflow:hidden;background:linear-gradient(160deg,#16244a 0%,#2a3f78 55%,#3b2f6b 100%);box-shadow:0 10px 40px rgba(0,0,0,.45);font-size:calc(var(--u,10px)*1.9);font-family:Inter,sans-serif;color:#1E2D4F;user-select:none}' +
    '.stv-stage:fullscreen{border-radius:0}' +
    '.stv-sym{position:absolute;color:rgba(255,255,255,.09);font:800 calc(var(--u)*5) "JetBrains Mono",monospace;animation:stvfloat linear infinite;pointer-events:none}' +
    '@keyframes stvfloat{from{transform:translateY(0) rotate(0)}to{transform:translateY(calc(var(--u)*-70)) rotate(40deg)}}' +
    '.stv-host{position:absolute;left:1.5%;bottom:12%;width:25%;height:66%;transition:transform .6s cubic-bezier(.3,.8,.3,1)}' +
    '.stv-host svg{width:100%;height:100%;overflow:visible}' +
    '.stv-board{position:absolute;right:2.5%;top:5%;width:68%;height:72%;background:#FFFDF7;border-radius:calc(var(--u)*1.6);box-shadow:0 calc(var(--u)*.6) 0 #c9b97a,0 calc(var(--u)*1.2) calc(var(--u)*3) rgba(0,0,0,.35);padding:calc(var(--u)*2.2) calc(var(--u)*2.6);overflow:hidden;display:flex;flex-direction:column;gap:calc(var(--u)*1)}' +
    '.stv-board.pop{animation:stvpop .55s cubic-bezier(.3,1.5,.5,1)}@keyframes stvpop{from{transform:scale(.85) rotate(-2deg);opacity:0}to{transform:none;opacity:1}}' +
    '.stv-board .k{font:800 calc(var(--u)*1.25) Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#B8860B}' +
    '.stv-board h3{margin:0;font:700 calc(var(--u)*3.1)/1.15 "Source Serif 4",Georgia,serif;color:#1E2D4F}' +
    '.stv-board .big{font:600 calc(var(--u)*2.15)/1.45 Inter,sans-serif;color:#1B2333}.stv-board .big b{color:#1D4ED8}' +
    '.stv-board .warn{border-left:calc(var(--u)*.6) solid #B42318;background:#FDEDEC;border-radius:calc(var(--u)*.8);padding:calc(var(--u)*1.4);font:600 calc(var(--u)*2.2)/1.45 Inter,sans-serif;color:#5c1410}' +
    '.stv-board .warn b{color:#B42318}' +
    '.stv-board .prob{font:700 calc(var(--u)*2.3)/1.3 Inter,sans-serif;background:#EEF3FE;border-radius:calc(var(--u)*.8);padding:calc(var(--u)*1) calc(var(--u)*1.4)}' +
    '.stv-board .wq{font:600 calc(var(--u)*1.9)/1.35 Inter,sans-serif;color:#5B6475;min-height:1.4em}' +
    '.stv-board .wk{flex:1;min-height:0;font-size:calc(var(--u)*1.9);overflow:hidden}.stv-board .wk *{font-size:inherit!important}.stv-board .wk .work{margin:0;padding-left:1.4em}.stv-board .wk li{margin:.2em 0}.stv-board .wk .lab{font-size:.7em!important;margin:0 .6em;color:#8A6100}' +
    '.stv-board .wl{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:calc(var(--u)*.7)}' +
    '.stv-board .wl li{font:700 calc(var(--u)*2.3)/1.3 "JetBrains Mono",monospace;color:#1E2D4F;animation:stvin .5s ease both}.stv-board .wl li.now{color:#15803D}' +
    '@keyframes stvin{from{opacity:0;transform:translateX(calc(var(--u)*3))}to{opacity:1;transform:none}}' +
    '.stv-board .fig{display:flex;justify-content:center;flex:1;min-height:0}.stv-board .fig svg{max-width:100%;max-height:100%;height:auto}' +
    '.stv-board .anim{flex:1;min-height:0;border:0;background:none;display:flex;justify-content:center}.stv-board .anim svg{width:100%;height:100%;max-height:none;background:none}' +
    '.stv-board .ch{display:grid;grid-template-columns:1fr 1fr;gap:calc(var(--u)*.9)}' +
    '.stv-board .ch div{border:calc(var(--u)*.25) solid #C9CFDB;border-radius:calc(var(--u)*1);padding:calc(var(--u)*.8) calc(var(--u)*1.2);font:700 calc(var(--u)*2)/1.3 Inter,sans-serif;background:#fff;transition:all .4s}' +
    '.stv-board .ch div i{font-style:normal;color:#8A93A6;margin-right:calc(var(--u)*.8)}' +
    '.stv-board .ch div.right{border-color:#15803D;background:#E7F5EC;transform:scale(1.04)}.stv-board .ch div.dim{opacity:.35}' +
    '.stv-board .ans{font:800 calc(var(--u)*2.6) "JetBrains Mono",monospace;color:#15803D}' +
    '.stv-count{position:absolute;right:4%;top:6%;width:calc(var(--u)*9);height:calc(var(--u)*9);border-radius:50%;background:#FFC107;color:#1E2D4F;display:flex;align-items:center;justify-content:center;font:900 calc(var(--u)*5) "JetBrains Mono",monospace;box-shadow:0 0 0 calc(var(--u)*.8) rgba(255,193,7,.35);animation:stvbeat 1s infinite}' +
    '@keyframes stvbeat{50%{transform:scale(1.12)}}' +
    '.stv-title{position:absolute;inset:0;display:flex;flex-direction:column;align-items:flex-end;justify-content:center;padding-right:5%;color:#fff;text-align:right}' +
    '.stv-title .k{font:800 calc(var(--u)*1.5) Inter,sans-serif;letter-spacing:.2em;color:#FFC107;text-transform:uppercase}' +
    '.stv-title h1{margin:calc(var(--u)*1) 0;font:800 calc(var(--u)*4.6)/1.08 "Source Serif 4",Georgia,serif;max-width:68%;text-shadow:0 calc(var(--u)*.4) 0 rgba(0,0,0,.35)}' +
    '.stv-title h1 span{display:inline-block;animation:stvdrop .6s cubic-bezier(.3,1.6,.5,1) both}' +
    '@keyframes stvdrop{from{opacity:0;transform:translateY(calc(var(--u)*-6)) rotate(-8deg)}to{opacity:1;transform:none}}' +
    '.stv-title .l{font:700 calc(var(--u)*1.9) Inter,sans-serif;background:rgba(255,255,255,.14);border-radius:999px;padding:calc(var(--u)*.6) calc(var(--u)*1.6)}' +
    '.stv-cap{position:absolute;left:0;right:0;bottom:0;min-height:12%;background:rgba(6,10,24,.82);color:#fff;font:600 calc(var(--u)*1.9)/1.35 Inter,sans-serif;padding:calc(var(--u)*.9) 4%;display:flex;align-items:center;justify-content:center;text-align:center}' +
    '.stv-cap b{color:#FFD54F}.stv-cap .m{color:#9ef7ff}' +
    '.stv-big{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(6,10,24,.25);cursor:pointer}' +
    '.stv-big span{width:calc(var(--u)*13);height:calc(var(--u)*13);border-radius:50%;background:#FFC107;color:#1E2D4F;display:flex;align-items:center;justify-content:center;font-size:calc(var(--u)*5.5);box-shadow:0 0 0 calc(var(--u)*1.5) rgba(255,193,7,.3)}' +
    '.stv-big[hidden]{display:none}.stv-bar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:8px}' +
    '.stv-prog{flex:1;min-width:200px;display:flex;gap:3px}' +
    '.stv-prog button{flex:1;height:30px;border:0;border-radius:6px;background:rgba(255,255,255,.12);color:#cfd8f5;font:700 11px Inter,sans-serif;cursor:pointer;position:relative;overflow:hidden;padding:0 4px;white-space:nowrap;text-overflow:ellipsis}' +
    '.stv-prog button i{position:absolute;left:0;top:0;bottom:0;background:rgba(255,193,7,.45);width:0;transition:width .3s}' +
    '.stv-prog button span{position:relative}.stv-prog button.on{color:#fff;outline:2px solid #FFC107}' +
    '.stv-conf{position:absolute;width:calc(var(--u)*1.1);height:calc(var(--u)*1.6);top:-5%;animation:stvfall linear forwards}' +
    '@keyframes stvfall{to{transform:translateY(calc(var(--u)*65)) rotate(720deg)}}' +
    /* Digit (the host) */
    '.dg-arm{transform-box:fill-box;transform-origin:10% 50%;transition:transform .5s}' +
    '.dg-l{transform-origin:90% 50%}' +
    '.stv-host.wave .dg-r{animation:dgwave .7s ease-in-out infinite alternate}@keyframes dgwave{from{transform:rotate(-70deg)}to{transform:rotate(-120deg)}}' +
    '.stv-host.point .dg-r{transform:rotate(-25deg)}.stv-host.think .dg-r{transform:rotate(-140deg)}' +
    '.stv-host.bounce{animation:dgbounce 1.1s ease-in-out infinite}@keyframes dgbounce{50%{transform:translateY(-5%)}}' +
    '.stv-host.dance{animation:dgdance .55s ease-in-out infinite alternate}@keyframes dgdance{from{transform:rotate(-6deg) translateY(0)}to{transform:rotate(6deg) translateY(-6%)}}' +
    '.stv-host.dance .dg-r,.stv-host.dance .dg-l{animation:dgwave .4s ease-in-out infinite alternate}' +
    '.dg-mouth{transform-box:fill-box;transform-origin:center}.stv-host.talk .dg-mouth{animation:dgtalk .18s ease-in-out infinite alternate}@keyframes dgtalk{from{transform:scaleY(.3)}to{transform:scaleY(1.2)}}' +
    '.dg-eye{transform-box:fill-box;transform-origin:center;animation:dgblink 4s infinite}@keyframes dgblink{0%,94%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}' +
    '.dg-sign,.dg-q{opacity:0;transition:opacity .4s}.stv-host.warn .dg-sign{opacity:1}.stv-host.think .dg-q{opacity:1}' +
    '.dg-ant{transform-box:fill-box;transform-origin:50% 100%;animation:dgant 2s ease-in-out infinite alternate}@keyframes dgant{from{transform:rotate(-10deg)}to{transform:rotate(10deg)}}' +
    '@media (prefers-reduced-motion:reduce){.stv-sym,.stv-host,.stv-host *,.stv-board,.stv-title h1 span,.stv-conf{animation:none!important}}';
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

  /* ---------- extra styles for site videos ---------- */
  var css2 = '' +
    '.stv-open{max-width:760px}' +
    '.stv-win{position:absolute;right:2.5%;top:5%;width:68%;height:72%;border-radius:calc(var(--u)*1.2);overflow:hidden;background:#F7F7F4;box-shadow:0 calc(var(--u)*.6) 0 #0f1a33,0 calc(var(--u)*1.2) calc(var(--u)*3) rgba(0,0,0,.45);display:flex;flex-direction:column}' +
    '.stv-win.pop{animation:stvpop .55s cubic-bezier(.3,1.5,.5,1)}' +
    '.stv-wbar{flex:none;height:calc(var(--u)*3.4);background:#1E2D4F;display:flex;align-items:center;gap:calc(var(--u)*.7);padding:0 calc(var(--u)*1.2)}' +
    '.stv-wbar i{width:calc(var(--u)*1);height:calc(var(--u)*1);border-radius:50%;background:#ff6b6b}.stv-wbar i:nth-child(2){background:#FFC107}.stv-wbar i:nth-child(3){background:#4ade80}' +
    '.stv-wbar span{margin-left:calc(var(--u)*1);flex:1;background:rgba(255,255,255,.12);border-radius:999px;color:#dfe6f7;font:600 calc(var(--u)*1.15) Inter,sans-serif;padding:calc(var(--u)*.3) calc(var(--u)*1.2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.stv-vp{position:relative;flex:1;overflow:hidden;background:#F7F7F4}' +
    '.stv-pan{position:absolute;left:0;top:0;transform-origin:0 0;transition:transform 1.5s cubic-bezier(.45,.05,.25,1)}' +
    '.stv-pan img{display:block;max-width:none}' +
    '.stv-ring{position:absolute;border-style:solid;border-color:#FFC107;border-radius:12px;box-shadow:0 0 0 9999px rgba(15,26,51,.28);opacity:0;transition:opacity .5s .9s,left .9s,top .9s,width .9s,height .9s;pointer-events:none}' +
    '.stv-ring.on{opacity:1;animation:stvring 1.6s ease-in-out 1.4s infinite}@keyframes stvring{50%{border-color:#ffe08a}}' +
    '.stv-tag{position:absolute;left:4%;top:4%;background:#FFC107;color:#1E2D4F;font:800 calc(var(--u)*1.35) Inter,sans-serif;padding:calc(var(--u)*.4) calc(var(--u)*1.1);border-radius:999px;box-shadow:0 2px 0 #b8860b;z-index:2}' +
    '.stv-board .stv-li{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:calc(var(--u)*1)}' +
    '.stv-board .stv-li li{display:flex;gap:calc(var(--u)*1.2);align-items:center;font:600 calc(var(--u)*2.15)/1.35 Inter,sans-serif;color:#1B2333;animation:stvin .5s ease both;border-radius:calc(var(--u)*.8);padding:calc(var(--u)*.5) calc(var(--u)*.9)}' +
    '.stv-board .stv-li li .n{flex:none;width:calc(var(--u)*3.4);height:calc(var(--u)*3.4);border-radius:calc(var(--u)*.9);background:#1E2D4F;color:#FFC107;display:flex;align-items:center;justify-content:center;font:800 calc(var(--u)*1.7) Inter,sans-serif}' +
    '.stv-board .stv-li li.now{background:#FFF3C4}.stv-board .stv-li li small{display:block;font:500 calc(var(--u)*1.55)/1.3 Inter,sans-serif;color:#5B6475}' +
    '.stv-folder{display:flex;flex-direction:column;gap:calc(var(--u)*.8)}' +
    '.stv-folder .fh{display:flex;align-items:center;gap:calc(var(--u)*1);font:700 calc(var(--u)*1.9) Inter,sans-serif;color:#1E2D4F;border-bottom:2px solid #E5E7EB;padding-bottom:calc(var(--u)*.8)}' +
    '.stv-folder .fh svg{width:calc(var(--u)*3.6);height:calc(var(--u)*3)}' +
    '.stv-folder .fr{display:flex;align-items:center;gap:calc(var(--u)*1.2);padding:calc(var(--u)*.7) calc(var(--u)*1);border-radius:calc(var(--u)*.8);border:2px solid transparent;transition:all .4s;font:600 calc(var(--u)*1.85) Inter,sans-serif;color:#1B2333}' +
    '.stv-folder .fr .ic{flex:none;width:calc(var(--u)*3);height:calc(var(--u)*3);border-radius:calc(var(--u)*.6);display:flex;align-items:center;justify-content:center;color:#fff;font:800 calc(var(--u)*1.3) Inter,sans-serif}' +
    '.stv-folder .fr small{display:block;font:500 calc(var(--u)*1.4) Inter,sans-serif;color:#5B6475}' +
    '.stv-folder .fr.now{border-color:#FFC107;background:#FFF8E1;transform:scale(1.02)}.stv-folder .fr.dim{opacity:.45}' +
    '.stv-scale{display:flex;flex-direction:column;gap:calc(var(--u)*.6)}' +
    '.stv-scale div{display:flex;align-items:center;gap:calc(var(--u)*1.2);border-radius:calc(var(--u)*.8);padding:calc(var(--u)*.5) calc(var(--u)*1);font:600 calc(var(--u)*1.8) Inter,sans-serif;color:#1B2333;transition:all .4s}' +
    '.stv-scale b{flex:none;width:calc(var(--u)*3.4);height:calc(var(--u)*3.4);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font:800 calc(var(--u)*1.9) "JetBrains Mono",monospace}' +
    '.stv-scale div.now{background:#E7F5EC;outline:3px solid #15803D;transform:scale(1.03)}' +
    '.stv-bars{display:flex;align-items:flex-end;gap:calc(var(--u)*2.4);height:calc(var(--u)*20);padding:0 calc(var(--u)*2);border-bottom:3px solid #1E2D4F}' +
    '.stv-bars div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;font:700 calc(var(--u)*1.5) Inter,sans-serif;color:#1E2D4F}' +
    '.stv-bars i{display:block;width:100%;border-radius:calc(var(--u)*.6) calc(var(--u)*.6) 0 0;background:#C9D3EA;animation:stvgrow 1s ease both}.stv-bars div:last-child i{background:#FFC107}' +
    '@keyframes stvgrow{from{transform:scaleY(0);transform-origin:bottom}to{transform:scaleY(1);transform-origin:bottom}}' +
    '.stv-bl{display:flex;gap:calc(var(--u)*2.4);padding:calc(var(--u)*.6) calc(var(--u)*2) 0;font:600 calc(var(--u)*1.3) Inter,sans-serif;color:#5B6475}.stv-bl span{flex:1;text-align:center}' +
    '@keyframes stvpop{from{transform:scale(.85) rotate(-2deg);opacity:0}to{transform:none;opacity:1}}@keyframes stvin{from{opacity:0;transform:translateX(calc(var(--u)*3))}to{opacity:1;transform:none}}' +
    '@media (prefers-reduced-motion:reduce){.stv-pan,.stv-ring,.stv-win,.stv-bars i,.stv-board .stv-li li{transition:none!important;animation:none!important}}';
  var st2 = el('style'); st2.textContent = css2; document.head.appendChild(st2);

  /* ---------- the two videos ---------- */
  var I = function (n) { return ROOT + 'images/videos/' + n + '.jpg'; };
  var T = function (n) { return ROOT + 'images/trackers/' + n + '.jpg'; };
  var FOLDER = [
    ['I Can Tracker', 'Your scores and every I can target', '#1E2D4F', 'DOC'],
    ['Fluency Results', 'Your Fluency Lab skill checks and Flashpoint', '#15803D', 'XLS'],
    ['Fluency Lab Tracker', 'A chart you can print to track your facts', '#B42318', 'PDF'],
    ['Self-Assessments', 'A copy of each self-check you turn in', '#8A6100', '▤']
  ];
  var SCALE = [[5, 'Mastery', 'You went beyond the standard', '#15803D'], [4, 'Proficient', 'The goal for everyone', '#1D4ED8'],
               [3, 'Approaching', 'You can do the basic parts', '#B8860B'], [2, 'Developing', 'You can do some parts with help', '#C2410C'], [1, 'Beginning', 'You are just getting started', '#6B7280']];
  var VIDS = SV.vids = {
    tour: {
      title: 'Website Tour', kicker: 'Mr. Allen’s Math Class', line: 'A quick tour with Digit · about 2 minutes',
      beats: [
        { chap: 'Hello', scene: 'title', pose: 'wave bounce', cap: 'Hi! I’m <b>Digit</b>. Welcome to Mr. Allen’s Math Class! Let’s take a quick tour of our website.' },
        { chap: 'Home', scene: 'shot', img: I('tour/home'), url: 'Home', focus: [0, 0, 1280, 800], pose: 'point', cap: 'This is the home page. Everything for class starts here.' },
        { scene: 'shot', img: I('tour/home'), url: 'Home', focus: [100, 230, 1160, 300], ring: [138, 274, 532, 220], pose: 'point', cap: 'Tap <b>8th Grade Math</b> to find your units, practice and games.' },
        { chap: 'Menu', scene: 'shot', img: I('tour/nav'), url: 'The menu', focus: [0, 0, 900, 800], ring: [4, 4, 372, 792], pose: 'point', cap: 'The <b>menu</b> on the left is on every page. Open it to jump to a unit, the Arcade, calculators and more.' },
        { chap: 'Units', scene: 'shot', img: I('tour/g8'), url: '8th Grade Math', focus: [100, 300, 1160, 880], ring: [138, 376, 1080, 758], pose: 'point', cap: 'Each unit has its own page. Pick the unit we are working on in class.' },
        { scene: 'shot', img: I('tour/unit'), url: 'Unit 3 · Linear Equations', focus: [100, 0, 1160, 800], ring: [138, 528, 1080, 212], pose: 'think', cap: 'A unit page starts with <b>what you will learn</b>. Then come the notes, practice, Targeted Practice and the pre-test.' },
        { chap: 'Notes', scene: 'shot', img: I('tour/notes'), url: 'Unit 3 · Guided Notes', focus: [150, 380, 1060, 700], ring: [204, 421, 948, 36], pose: 'point', cap: 'Interactive notes show <b>one section at a time</b>. Press Next when you are ready for more.' },
        { chap: 'Practice', scene: 'shot', img: I('tour/practice'), url: 'Unit 3 · Practice', focus: [120, 470, 1120, 380], ring: [155, 600, 480, 90], pose: 'point', cap: 'Practice pages show one problem at a time. Tap <b>Check</b>, and you know right away if you got it.' },
        { scene: 'shot', img: I('tour/practice'), url: 'Unit 3 · Practice', focus: [120, 470, 1120, 380], ring: [155, 688, 1046, 46], pose: 'think', cap: 'Stuck? Tap <b>Hint</b>. A wrong answer tells you what the mistake was, and you get three tries.' },
        { scene: 'shot', img: I('tour/steps'), url: 'Unit 3 · Practice', focus: [120, 480, 1120, 420], ring: [155, 604, 1046, 265], pose: 'point', cap: 'For equations, use <b>Step by step</b>. You pick each move, and it helps you find your mistake.' },
        { chap: 'Targeted Practice', scene: 'shot', img: I('tour/hw'), url: 'Targeted Practice 3.1', focus: [100, 250, 1160, 560], ring: [150, 342, 894, 60], pose: 'point', cap: '<b>Targeted Practice</b> is your homework. Type your first and last name, then press Start.' },
        { scene: 'shot', img: I('tour/hw'), url: 'Targeted Practice 3.1', focus: [100, 500, 1160, 330], ring: [138, 542, 1080, 245], pose: 'point', cap: 'Do one problem at a time. Then press <b>Send</b> to turn it in to Mr. Allen. Your work saves as you go.' },
        { chap: 'Extra help', scene: 'shot', img: I('tour/skills'), url: 'Skill Builders', focus: [100, 0, 1160, 800], pose: 'point', cap: '<b>Skill Builders</b> have short lessons and videos for each unit. Use them when you want to see it again.' },
        { scene: 'shot', img: I('tour/eog'), url: 'EOG Prep', focus: [100, 0, 1160, 800], ring: [138, 384, 1080, 79], pose: 'point', cap: '<b>EOG Prep</b> gets you ready for the end-of-grade test, one step at a time.' },
        { chap: 'Arcade', scene: 'shot', img: I('tour/arcade'), url: 'Math Arcade', focus: [80, 420, 1200, 640], ring: [94, 454, 1168, 554], pose: 'dance', cap: 'Done with your work? The <b>Math Arcade</b> has games that build your math skills. Try to beat your best score!' },
        { chap: 'Calm', scene: 'shot', img: I('tour/reset'), url: 'Reset Room', focus: [100, 300, 1160, 760], ring: [138, 605, 760, 213], pose: 'point', cap: 'Need a calm minute? The <b>Reset Room</b> helps you breathe and get ready to learn.' },
        { scene: 'shot', img: I('tour/music'), url: 'Chill Math Music', focus: [100, 120, 1160, 680], ring: [314, 278, 728, 322], pose: 'dance', cap: 'You can also play <b>chill music</b> while you work. Find it in the menu.' },
        { chap: 'Grades', scene: 'shot', img: I('tour/grading'), url: 'Grading & Standards', focus: [100, 0, 1160, 800], pose: 'point', cap: '<b>Grading and Standards</b> shows how grades work and how to use your tracker. Your newest work counts the most.' },
        { chap: 'Wrap up', scene: 'board', k: 'Your game plan', h: 'Every day:', items: ['Open your unit page.', 'Do a little practice.', 'Stuck? Use Hint or Step by step.', 'Ask Mr. Allen for help anytime.'], upto: 3, pose: 'dance', conf: true,
          cap: 'That’s the tour! Work a little every day, and ask Mr. Allen when you need help. You’ve got this!' }
      ]
    },
    trackers: {
      title: 'Your Student Folder & I Can Tracker', kicker: 'Grading & Standards', line: 'With Digit · about 2 minutes',
      beats: [
        { chap: 'Hello', scene: 'title', pose: 'wave bounce', cap: 'Hi, it’s <b>Digit</b>! Let’s look at your <b>student folder</b> and your <b>I Can Tracker</b>. They show where you are, and how to grow.' },
        { chap: 'Your folder', scene: 'folder', hl: -1, pose: 'point', cap: 'Your <b>student folder</b> is in Google Drive. Open it with your school account. It is just for you and Mr. Allen.' },
        { scene: 'folder', hl: 0, pose: 'point', cap: 'Your <b>I Can Tracker</b> has your scores and every I can target. It is the most important one.' },
        { scene: 'folder', hl: 1, pose: 'point', cap: '<b>Fluency Results</b> shows your Fluency Lab skill checks and Flashpoint scores.' },
        { scene: 'folder', hl: 2, pose: 'point', cap: 'The <b>Fluency Lab Tracker</b> is a chart you can print to track your facts.' },
        { scene: 'folder', hl: 3, pose: 'point', cap: '<b>Self-Assessments</b> keeps a copy of each self-check you turn in.' },
        { chap: 'Scores', scene: 'scale', hl: -1, pose: 'think', cap: 'Every standard gets a score from <b>1 to 5</b>.' },
        { scene: 'scale', hl: 1, pose: 'point', cap: 'A <b>4</b> means you can do grade-level problems on your own. That is the goal for everyone.' },
        { scene: 'scale', hl: 0, pose: 'dance', cap: 'A <b>5</b> means you went beyond. And a 3 means you are close. Keep going!' },
        { chap: 'Start Here', scene: 'shot', img: T('merged-1'), url: 'My I Can Tracker · Start Here', focus: [0, 0, 789, 520], pose: 'point', cap: 'Open your I Can Tracker. The <b>Start Here</b> tab shows you how to use it.' },
        { scene: 'shot', img: T('merged-1'), url: 'My I Can Tracker · Start Here', focus: [0, 500, 789, 300], ring: [26, 532, 734, 70], pose: 'point', cap: '<b>My focus right now</b> lists any standard scored below a 4. That is where to start.' },
        { scene: 'shot', img: T('merged-1'), url: 'My I Can Tracker · Start Here', focus: [0, 610, 789, 405], ring: [30, 716, 730, 270], pose: 'point', cap: '<b>My progress at a glance</b> shows your score for every standard. Tap a standard to open it.' },
        { chap: 'A standard', scene: 'shot', img: T('merged-3'), url: 'My I Can Tracker · NC.8.NS.1', focus: [0, 0, 791, 420], ring: [32, 130, 728, 84], pose: 'point', cap: 'Each standard has a <b>gold box</b>. It shows your score and your next step.' },
        { scene: 'shot', img: T('merged-3'), url: 'My I Can Tracker · NC.8.NS.1', focus: [0, 225, 791, 470], ring: [32, 232, 728, 450], pose: 'point', cap: 'Below it are the targets. <b>Approaching</b> targets are for a 3, <b>Proficient</b> for a 4, and <b>Mastery</b> for a 5.' },
        { scene: 'shot', img: T('merged-3'), url: 'My I Can Tracker · NC.8.NS.1', focus: [0, 270, 791, 220], ring: [36, 278, 720, 104], pose: 'think', cap: 'Tap <b>Try a practice problem</b> to check yourself. When you can do a target on your own, check its box.' },
        { scene: 'shot', img: T('merged-4'), url: 'My I Can Tracker · NC.8.NS.1', focus: [0, 120, 789, 372], ring: [30, 430, 190, 40], pose: 'point', cap: 'Then tap <b>Back to Start Here</b> to pick another standard.' },
        { chap: 'Grow', scene: 'bars', pose: 'think', cap: 'Your <b>newest</b> score counts the most. Older scores fade. So when you learn more, your grade goes up to show it.' },
        { scene: 'board', k: 'Raise your score', h: 'Four steps', items: ['Read your gold box.', 'Practice those targets on our website.', 'Check off what you can do on your own.', 'Ask Mr. Allen about a retest.'], upto: 0, pose: 'point', cap: 'Here is how to raise a score. First, read your <b>gold box</b>.' },
        { scene: 'board', upto: 1, pose: 'point', cap: 'Next, practice those targets. Every target has a practice problem on our website.' },
        { scene: 'board', upto: 2, pose: 'point', cap: 'Check off each target you can do on your own.' },
        { scene: 'board', upto: 3, pose: 'point', cap: 'Ready to show what you learned? Talk to <b>Mr. Allen</b> about a retest.' },
        { chap: 'Wrap up', scene: 'board', k: 'You’ve got this', h: 'Every bit of practice helps your score grow.', items: ['Start with one target today.'], upto: 0, pose: 'dance', conf: true, fresh: true,
          cap: 'Every bit of practice helps your score grow. Start with one target today. You’ve got this!' }
      ]
    }
  };
  // boards that only change "upto" keep the list of the board before them
  Object.keys(VIDS).forEach(function (id) { var last = null; VIDS[id].beats.forEach(function (b) { if (b.scene === 'board') { if (b.items && (b.fresh || !last || b.items !== last.items)) last = b; else { b.k = last.k; b.h = last.h; b.items = last.items; b.grp = last; } b.grp = b.grp || b; } }); });

  /* ---------- voice text ---------- */
  function plainOf(h) { var d = document.createElement('div'); d.innerHTML = h; return (d.textContent || '').replace(/∠/g, 'angle ').replace(/NC\.8\.NS\.1/g, 'N S 1').replace(/Mr\. Allen/g, 'Mister Allen'); }
  function sentences(t) { return (String(t).match(/[^.!?]+[.!?]+["”’)]*|[^.!?]+$/g) || [t]).map(function (x) { return x.trim(); }).filter(Boolean); }

  /* ---------- player ---------- */
  var S = { music: store('sbv-music') !== 'off', voice: store('sbv-voice') !== 'off', open: false };
  var ov, stage, host, cap, big, prog, playB, titleH, V = null, B = [], k = 0, playing = false, Tm = null, token = 0, scene = '', curImg = '';
  function build() {
    if (ov) return;
    ov = el('div'); ov.id = 'stv'; ov.hidden = true; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Video');
    ov.innerHTML = '<div class="stv-box"><div class="stv-top"><h2></h2><button class="stv-btn" data-a="close" type="button">✕ Close</button></div>' +
      '<div class="stv-stage"><div class="stv-syms"></div><div class="stv-scene"></div><div class="stv-host">' + DIGIT + '</div><div class="stv-cap" aria-live="polite"></div><div class="stv-big"><span>▶</span></div></div>' +
      '<div class="stv-bar"><button class="stv-btn main" data-a="play" type="button">▶ Play</button><button class="stv-btn" data-a="back" type="button">‹ Back</button><button class="stv-btn" data-a="next" type="button">Next ›</button>' +
      '<div class="stv-prog"></div><button class="stv-btn" data-a="voice" type="button"></button><button class="stv-btn" data-a="music" type="button"></button><button class="stv-btn" data-a="full" type="button">⛶ Full screen</button></div></div>';
    document.body.appendChild(ov);
    stage = ov.querySelector('.stv-stage'); host = ov.querySelector('.stv-host'); cap = ov.querySelector('.stv-cap'); big = ov.querySelector('.stv-big');
    prog = ov.querySelector('.stv-prog'); playB = ov.querySelector('[data-a=play]'); titleH = ov.querySelector('.stv-top h2');
    var syms = ov.querySelector('.stv-syms'), SY = ['x', '+', '÷', 'π', '√', '=', '²', '%', '×', '7', '∠', 'y'];
    for (var i = 0; i < 14; i++) { var s = el('span', 'stv-sym', SY[i % SY.length]); s.style.left = (i * 7.3 % 100) + '%'; s.style.top = (40 + (i * 37) % 70) + '%'; s.style.animationDuration = (14 + (i * 3) % 11) + 's'; s.style.animationDelay = (-i * 1.7) + 's'; syms.appendChild(s); }
    ov.addEventListener('click', function (e) {
      var a = e.target.closest('[data-a]'); if (!a) { if (e.target.closest('.stv-big')) toggle(); return; }
      var w = a.dataset.a;
      if (w === 'close') close(); else if (w === 'play') toggle(); else if (w === 'back') jump(Math.max(0, k - 1)); else if (w === 'next') jump(Math.min(B.length - 1, k + 1));
      else if (w === 'voice') { S.voice = !S.voice; store('sbv-voice', S.voice ? 'on' : 'off'); labels(); if (playing) jump(k); }
      else if (w === 'music') { S.music = !S.music; store('sbv-music', S.music ? 'on' : 'off'); labels(); musicOn(S.music && playing); }
      else if (w === 'full') { try { if (document.fullscreenElement) document.exitFullscreen(); else stage.requestFullscreen(); } catch (x) {} }
    });
    document.addEventListener('keydown', function (e) {
      if (!S.open) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === ' ' && !/BUTTON/.test((e.target || {}).tagName || '')) { e.preventDefault(); toggle(); }
      else if (e.key === 'ArrowRight') jump(Math.min(B.length - 1, k + 1)); else if (e.key === 'ArrowLeft') jump(Math.max(0, k - 1));
    });
    addEventListener('resize', function () { size(); if (S.open) render(k, true); });
    document.addEventListener('fullscreenchange', function () { size(); if (S.open) setTimeout(function () { render(k, true); }, 60); });
  }
  function size() { if (stage) stage.style.setProperty('--u', (stage.clientWidth / 100) + 'px'); }
  function labels() {
    ov.querySelector('[data-a=voice]').textContent = 'Voice: ' + (S.voice ? 'on' : 'off');
    ov.querySelector('[data-a=music]').textContent = 'Music: ' + (S.music ? 'on' : 'off');
    playB.textContent = playing ? '❚❚ Pause' : (k >= B.length - 1 && B.done ? '↻ Watch again' : '▶ Play');
    big.hidden = playing;
  }
  function open(id) {
    var v = VIDS[id]; if (!v) return;
    build(); V = v; B = v.beats; B.done = false; k = 0; scene = ''; curImg = ''; S.open = true; ov.hidden = false; document.documentElement.style.overflow = 'hidden';
    titleH.textContent = 'Video · ' + v.title;
    var ch = []; B.forEach(function (b, i) { if (b.chap) ch.push({ t: b.chap, i: i }); });
    prog.innerHTML = ch.map(function (c) { return '<button type="button" data-i="' + c.i + '"><i></i><span>' + c.t + '</span></button>'; }).join('');
    [].forEach.call(prog.children, function (b) { b.addEventListener('click', function () { jump(+b.dataset.i); }); });
    B.forEach(function (b) { if (b.img) { var im = new Image(); im.src = b.img; } });   // warm the cache
    size(); render(0); labels();
  }
  function close() {
    stop(); S.open = false; ov.hidden = true; document.documentElement.style.overflow = '';
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) {}
    if (/^#video/.test(location.hash)) try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  }
  function toggle() { if (playing) stop(); else { if (B.done && k >= B.length - 1) { B.done = false; k = 0; scene = ''; } play(); } }
  function play() { playing = true; ctx(); musicOn(S.music); labels(); run(k); }
  function stop() { playing = false; token++; clearTimeout(Tm); try { speechSynthesis.cancel(); } catch (e) {} musicOn(false); if (host) host.classList.remove('talk'); if (ov) labels(); }
  function jump(i) { var was = playing; token++; clearTimeout(Tm); try { speechSynthesis.cancel(); } catch (e) {} if (host) host.classList.remove('talk'); if (i < k) scene = ''; k = i; if (was) run(i); else render(i); }
  function est(t) { return Math.max(2800, t.length * 62 + 900); }
  function run(i) {
    var my = ++token; k = i; render(i);
    var b = B[i], text = plainOf(b.cap);
    var after = function (extra) { if (my !== token) return; Tm = setTimeout(function () { if (my !== token) return; if (k + 1 < B.length) run(k + 1); else { B.done = true; playing = false; musicOn(false); labels(); } }, extra); };
    var t0 = Date.now();
    if (S.voice && 'speechSynthesis' in window) speakAll(sentences(text), my, function () { after(Math.max(700, est(text) * 0.75 - (Date.now() - t0))); }, est(text) * 2.2 + 3000);
    else { host.classList.add('talk'); Tm = setTimeout(function () { if (my !== token) return; host.classList.remove('talk'); after(400); }, est(text)); }
  }
  function speakAll(list, my, done, limit) {
    var i = 0, finished = false, guard = setTimeout(fin, limit);
    function fin() { if (finished) return; finished = true; clearTimeout(guard); duck(false); host.classList.remove('talk'); if (my === token) done(); }
    function next() {
      if (my !== token) { clearTimeout(guard); return; }
      if (i >= list.length) return fin();
      var u = new SpeechSynthesisUtterance(list[i++]); u.rate = 0.98; u.pitch = 1.08; u.lang = 'en-US'; if (VOICE) u.voice = VOICE;
      u.onend = function () { setTimeout(next, 120); }; u.onerror = function () { setTimeout(next, 120); };
      try { speechSynthesis.speak(u); } catch (e) { fin(); }
    }
    duck(true); host.classList.add('talk');
    try { speechSynthesis.cancel(); } catch (e) {}
    setTimeout(next, 60);
  }

  /* ---------- drawing a beat ---------- */
  function camera(b) {   // fit b.focus (image px) into the window, never showing past the picture's edges
    var vp = stage.querySelector('.stv-vp'), pan = stage.querySelector('.stv-pan'), img = pan && pan.querySelector('img'); if (!vp || !img) return;
    var vw = vp.clientWidth, vh = vp.clientHeight, iw = img.naturalWidth || 1280, ih = img.naturalHeight || 800;
    var f = b.focus || [0, 0, iw, Math.min(ih, iw * vh / vw)];
    var s = Math.min(vw / f[2], vh / f[3]); s = Math.max(s, vw / iw);
    var tx = vw / 2 - (f[0] + f[2] / 2) * s, ty = vh / 2 - (f[1] + f[3] / 2) * s;
    tx = Math.min(0, Math.max(vw - iw * s, tx)); ty = ih * s <= vh ? (vh - ih * s) / 2 : Math.min(0, Math.max(vh - ih * s, ty));
    pan.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) scale(' + s.toFixed(4) + ')';
    var r = pan.querySelector('.stv-ring');
    if (b.ring) { var p = 8 / s; r.style.left = (b.ring[0] - p) + 'px'; r.style.top = (b.ring[1] - p) + 'px'; r.style.width = (b.ring[2] + 2 * p) + 'px'; r.style.height = (b.ring[3] + 2 * p) + 'px'; r.style.borderWidth = (4 / s) + 'px'; r.style.borderRadius = (12 / s) + 'px'; r.classList.add('on'); }
    else r.classList.remove('on');
  }
  function confetti(sc) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (var c = 0; c < 40; c++) { var f = el('i', 'stv-conf'); f.style.left = Math.random() * 100 + '%'; f.style.background = ['#FFC107', '#9ef7ff', '#ff8fa3', '#7CFC9A', '#fff'][c % 5]; f.style.animationDuration = (2 + Math.random() * 2.5) + 's'; f.style.animationDelay = Math.random() * 1.2 + 's'; sc.appendChild(f); }
  }
  function render(i, again) {
    var b = B[i]; if (!b) return;
    var sc = stage.querySelector('.stv-scene');
    host.className = 'stv-host ' + (b.pose || '');
    host.style.transform = b.scene === 'title' ? 'translateX(8%) scale(1.15)' : 'none';
    cap.innerHTML = '<span>' + b.cap + '</span>';
    var key = b.scene + '|' + (b.img || '') + '|' + (b.grp ? B.indexOf(b.grp) : '');
    var fresh = key !== scene; if (fresh && !again) blip('whoosh');
    scene = key;
    if (b.scene === 'title') {
      if (fresh) sc.innerHTML = '<div class="stv-title"><div class="k">' + V.kicker + '</div><h1>' + V.title.split(' ').map(function (w, j) { return '<span style="animation-delay:' + (0.15 + j * 0.09) + 's">' + w + '</span>'; }).join(' ') + '</h1><div class="l">' + V.line + '</div></div>';
    } else if (b.scene === 'shot') {
      if (fresh || !sc.querySelector('.stv-pan')) {
        sc.innerHTML = '<div class="stv-win pop"><div class="stv-wbar"><i></i><i></i><i></i><span></span></div><div class="stv-vp"><div class="stv-pan"><img alt=""><div class="stv-ring"></div></div></div></div>';
        var img = sc.querySelector('img'); img.onload = function () { if (B[k] === b || B[k].img === b.img) camera(B[k]); }; img.src = b.img;
      }
      sc.querySelector('.stv-wbar span').textContent = (b.url || '') ;
      var im2 = sc.querySelector('img'); if (im2.complete && im2.naturalWidth) camera(b);
    } else if (b.scene === 'folder') {
      if (fresh) {
        sc.innerHTML = '<div class="stv-board pop"><div class="k">Google Drive</div><div class="stv-folder"><div class="fh"><svg viewBox="0 0 36 30"><path d="M2 5a3 3 0 0 1 3-3h9l4 4h13a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" fill="#FFC107" stroke="#E0A800" stroke-width="2"/></svg>Your Name · Student Folder</div>' +
          FOLDER.map(function (f) { return '<div class="fr"><span class="ic" style="background:' + f[2] + '">' + f[3] + '</span><span>' + f[0] + '<small>' + f[1] + '</small></span></div>'; }).join('') + '</div></div>';
      }
      [].forEach.call(sc.querySelectorAll('.fr'), function (r, j) { r.className = 'fr' + (b.hl < 0 ? '' : j === b.hl ? ' now' : ' dim'); });
    } else if (b.scene === 'scale') {
      if (fresh) sc.innerHTML = '<div class="stv-board pop"><div class="k">The 1–5 scale</div><h3>Every standard gets a score</h3><div class="stv-scale">' +
        SCALE.map(function (s) { return '<div><b style="background:' + s[3] + '">' + s[0] + '</b><span><strong>' + s[1] + '</strong> · ' + s[2] + '</span></div>'; }).join('') + '</div></div>';
      [].forEach.call(sc.querySelectorAll('.stv-scale div'), function (r, j) { r.className = j === b.hl ? 'now' : ''; });
    } else if (b.scene === 'bars') {
      if (fresh) sc.innerHTML = '<div class="stv-board pop"><div class="k">The decaying average</div><h3>Your newest score counts the most</h3><div class="stv-bars">' +
        [[27.5, '27.5%'], [42, '42%'], [65, '65%'], [100, '100%']].map(function (x, j) { return '<div>' + x[1] + '<i style="height:' + x[0] + '%;animation-delay:' + (0.2 + j * 0.25) + 's"></i></div>'; }).join('') +
        '</div><div class="stv-bl"><span>Oldest</span><span>Older</span><span>Newer</span><span>Newest</span></div></div>';
    } else if (b.scene === 'board') {
      if (fresh) sc.innerHTML = '<div class="stv-board pop"><div class="k">' + b.k + '</div><h3>' + b.h + '</h3><ul class="stv-li"></ul></div>';
      sc.querySelector('.stv-li').innerHTML = b.items.slice(0, b.upto + 1).map(function (t, j) { return '<li class="' + (j === b.upto && !b.conf ? 'now' : '') + '"><span class="n">' + (j + 1) + '</span><span>' + t + '</span></li>'; }).join('');
      if (b.conf && fresh) { confetti(sc); if (!again) blip('ding'); }
    }
    [].forEach.call(prog.children, function (pb, j) {
      var from = +pb.dataset.i, to = prog.children[j + 1] ? +prog.children[j + 1].dataset.i : B.length;
      var on = i >= from && i < to; pb.classList.toggle('on', on);
      pb.firstChild.style.width = (i >= to ? 100 : on ? Math.round((i - from + 1) / (to - from) * 100) : 0) + '%';
    });
    ov.querySelector('[data-a=back]').disabled = i <= 0; ov.querySelector('[data-a=next]').disabled = i >= B.length - 1;
  }

  /* ---------- entry points ---------- */
  SV.open = open; SV.close = close;
  SV.button = function (id, label, sub) {
    var b = el('button', 'stv-open', '<span class="pl">▶</span><span>' + label + '<small>' + sub + '</small></span>');
    b.type = 'button'; b.addEventListener('click', function () { open(id); }); return b;
  };
  function wire() {
    [].forEach.call(document.querySelectorAll('[data-site-video]'), function (h) {
      if (h.__stv) return; h.__stv = 1;
      var b = SV.button(h.dataset.siteVideo, h.dataset.label || 'Watch the video', h.dataset.sub || 'About 2 minutes · Digit explains it with voice and music. Captions are on.');
      h.appendChild(b);
    });
    var m = /^#video-(\w+)$/.exec(location.hash); if (m && VIDS[m[1]]) open(m[1]);
  }
  addEventListener('hashchange', function () { var m = /^#video-(\w+)$/.exec(location.hash); if (m && VIDS[m[1]]) open(m[1]); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
  if (DBG) window.__STV = { get B() { return B; }, get k() { return k; }, S: S, jump: jump, render: function (i) { render(i); }, open: open, stop: stop, vids: VIDS };
})();
