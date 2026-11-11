/* ARCADE FX (Nov 11, 2026, Mr. Allen's request: "fancier graphics, bigger explosions, fancier noises").
   A small shared helper for the arcade games. It never changes a game's rules, questions or scoring: games call it
   when something already happens (a hit, a miss, a win).
     AFX.boom(x, y, {color, size, count, ring, debris})   explosion at page (client) x, y: flash, sparks, smoke, shock ring
     AFX.sparks(x, y, {color, count})                     small spark burst
     AFX.confetti(x, y, {colors, count})                  paper burst (wins)
     AFX.text(x, y, 'CRITICAL!', {color, size})           floating word
     AFX.shake(el, strength, ms)                          shake an element (the game canvas or card)
     AFX.flash(color, ms)                                 whole-screen flash
     AFX.at(el)                                           -> [x, y] center of an element, for the calls above
     AFX.fromCanvas(canvas, cx, cy)                       -> [x, y] page point for a point drawn on a canvas
     AFX.sfx.boom(size) zap() laser() clang() thud() whoosh() power() win() lose() coin() roar() toot(kind) squeak()
     AFX.muted = true                                     turn the sounds off (set it from the game's own sound button)
     AFX.soundButton()                                    a ready-made Sound: on/off button (remembered) for games without one
   Drawn on one full-screen canvas that ignores taps (pointer-events: none) and only runs while something is on screen.
   prefers-reduced-motion: fewer particles, no shake, no flash. */
(function () {
  "use strict";
  if (window.AFX) return;
  var RM = false; try { RM = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var cv = null, cx = null, P = [], raf = 0, last = 0, DPR = Math.min(2, window.devicePixelRatio || 1);
  function ensure() {
    if (cv) return; cv = document.createElement('canvas'); cv.setAttribute('aria-hidden', 'true');
    cv.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:9998';
    document.documentElement.appendChild(cv); cx = cv.getContext('2d'); size(); window.addEventListener('resize', size);
  }
  function size() { if (!cv) return; cv.width = Math.round(innerWidth * DPR); cv.height = Math.round(innerHeight * DPR); cx.setTransform(DPR, 0, 0, DPR, 0, 0); }
  function run() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function tick(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    cx.clearRect(0, 0, innerWidth, innerHeight);
    for (var i = P.length - 1; i >= 0; i--) {
      var p = P[i]; p.t += dt; var k = p.t / p.life; if (k >= 1) { P.splice(i, 1); continue; }
      if (p.kind === 'ring') {
        cx.globalCompositeOperation = 'lighter'; cx.globalAlpha = (1 - k) * 0.9; cx.strokeStyle = p.c; cx.lineWidth = p.w * (1 - k) + 1;
        cx.beginPath(); cx.arc(p.x, p.y, p.r * (0.15 + 0.85 * (1 - Math.pow(1 - k, 3))), 0, 6.283); cx.stroke();
      } else if (p.kind === 'flash') {
        cx.globalCompositeOperation = 'lighter'; var g = cx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * (0.6 + k));
        g.addColorStop(0, 'rgba(255,255,255,' + (0.95 * (1 - k)) + ')'); g.addColorStop(0.35, p.c); g.addColorStop(1, 'rgba(0,0,0,0)');
        cx.globalAlpha = 1 - k; cx.fillStyle = g; cx.beginPath(); cx.arc(p.x, p.y, p.r * (0.6 + k), 0, 6.283); cx.fill();
      } else if (p.kind === 'smoke') {
        p.x += p.vx * dt; p.y += p.vy * dt; p.vy -= 12 * dt; cx.globalCompositeOperation = 'source-over'; cx.globalAlpha = 0.28 * (1 - k);
        cx.fillStyle = '#6b7088'; cx.beginPath(); cx.arc(p.x, p.y, p.r * (0.6 + k * 1.4), 0, 6.283); cx.fill();
      } else if (p.kind === 'text') {
        p.y -= 46 * dt; cx.globalCompositeOperation = 'source-over'; cx.globalAlpha = k < 0.15 ? k / 0.15 : 1 - Math.max(0, (k - 0.6) / 0.4);
        var sc = k < 0.15 ? 0.6 + 0.4 * (k / 0.15) * 1.15 : 1; cx.font = '900 ' + Math.round(p.s * sc) + 'px Inter,Arial,sans-serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle';
        cx.lineWidth = Math.max(3, p.s * 0.14); cx.strokeStyle = 'rgba(0,0,0,.75)'; cx.strokeText(p.txt, p.x, p.y); cx.fillStyle = p.c; cx.fillText(p.txt, p.x, p.y);
      } else {                                            // spark, debris, confetti
        p.vy += p.g * dt; p.vx *= (1 - p.drag * dt); p.vy *= (1 - p.drag * dt); p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
        cx.globalAlpha = p.kind === 'confetti' ? Math.min(1, (1 - k) * 2.5) : 1 - k * k;
        if (p.kind === 'spark') { cx.globalCompositeOperation = 'lighter'; cx.strokeStyle = p.c; cx.lineWidth = p.r; cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(p.x - p.vx * 0.035, p.y - p.vy * 0.035); cx.stroke(); }
        else { cx.globalCompositeOperation = 'source-over'; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.fillStyle = p.c;
          if (p.kind === 'confetti') cx.fillRect(-p.r, -p.r * 0.5 * Math.cos(p.t * 9 + p.rot), p.r * 2, p.r * Math.cos(p.t * 9 + p.rot)); else { cx.beginPath(); cx.moveTo(-p.r, -p.r * 0.6); cx.lineTo(p.r, -p.r * 0.3); cx.lineTo(p.r * 0.4, p.r * 0.8); cx.closePath(); cx.fill(); }
          cx.restore(); }
      }
    }
    cx.globalAlpha = 1; cx.globalCompositeOperation = 'source-over';
    if (P.length) raf = requestAnimationFrame(tick); else { raf = 0; cx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  function burst(kind, x, y, n, c, spd, o) {
    for (var i = 0; i < n; i++) { var a = rnd(0, 6.283), v = rnd(spd * 0.25, spd), col = Array.isArray(c) ? c[i % c.length] : c;
      P.push({ kind: kind, x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - (o.up || 0), g: o.g == null ? 500 : o.g, drag: o.drag == null ? 1.6 : o.drag, r: rnd(o.r0 || 1.5, o.r1 || 3.5), c: col, t: 0, life: rnd(o.l0 || 0.45, o.l1 || 0.95), rot: rnd(0, 6.283), vr: rnd(-9, 9) }); }
  }
  var AFX = window.AFX = { muted: false };
  try { AFX.muted = localStorage.getItem('afx-muted') === '1'; } catch (e) {}
  /* AFX.soundButton() -> a small "Sound: on/off" button for games that have no sound switch of their own (remembered on this device) */
  AFX.soundButton = function () {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'afx-sound';
    b.style.cssText = 'font:600 13px Inter,system-ui,sans-serif;color:#5B6475;background:#fff;border:1px solid #D5D9E0;border-radius:999px;padding:8px 14px;min-height:36px;cursor:pointer';
    function label() { b.textContent = (AFX.muted ? '\uD83D\uDD07' : '\uD83D\uDD0A') + ' Sound: ' + (AFX.muted ? 'off' : 'on'); b.setAttribute('aria-pressed', String(!AFX.muted)); }
    b.addEventListener('click', function () { AFX.muted = !AFX.muted; try { localStorage.setItem('afx-muted', AFX.muted ? '1' : '0'); } catch (e) {} label(); if (!AFX.muted) AFX.sfx.coin(); });
    label(); return b;
  };
  AFX.at = function (el) { var r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  AFX.fromCanvas = function (c, x, y) { var r = c.getBoundingClientRect(); return [r.left + x * (r.width / c.width), r.top + y * (r.height / c.height)]; };
  AFX.boom = function (x, y, o) {
    o = o || {}; ensure(); var s = o.size || 1, c = o.color || '#ffb347', n = Math.round((o.count || 34) * s * (RM ? 0.3 : 1));
    P.push({ kind: 'flash', x: x, y: y, r: 70 * s, c: c, t: 0, life: 0.28 });
    if (o.ring !== false) { P.push({ kind: 'ring', x: x, y: y, r: 130 * s, w: 7 * s, c: c, t: 0, life: 0.5 }); P.push({ kind: 'ring', x: x, y: y, r: 80 * s, w: 4 * s, c: '#ffffff', t: 0, life: 0.34 }); }
    burst('spark', x, y, n, [c, '#ffffff', o.color2 || '#ffd166'], 560 * s, { g: 260, drag: 1.9, r0: 1.5, r1: 3.4 * Math.sqrt(s), l0: 0.35, l1: 0.9 });
    if (o.debris !== false) burst('debris', x, y, Math.round(n * 0.35), [c, '#2b2f45', '#8a90a8'], 380 * s, { g: 900, drag: 0.6, r0: 3, r1: 7 * Math.sqrt(s), l0: 0.6, l1: 1.2, up: 120 });
    if (!RM) for (var i = 0; i < Math.round(7 * s); i++) P.push({ kind: 'smoke', x: x + rnd(-18, 18) * s, y: y + rnd(-14, 14) * s, vx: rnd(-26, 26), vy: rnd(-50, -10), r: rnd(12, 24) * s, t: 0, life: rnd(0.7, 1.3) });
    run();
  };
  AFX.sparks = function (x, y, o) { o = o || {}; ensure(); burst('spark', x, y, Math.round((o.count || 14) * (RM ? 0.4 : 1)), [o.color || '#ffd166', '#ffffff'], o.speed || 320, { g: 300, drag: 2.2, r0: 1.2, r1: 2.6, l0: 0.25, l1: 0.6 }); run(); };
  AFX.confetti = function (x, y, o) { o = o || {}; ensure(); burst('confetti', x, y, Math.round((o.count || 60) * (RM ? 0.3 : 1)), o.colors || ['#FFC107', '#00f0ff', '#ff4dd6', '#7CFC9A', '#ffffff'], o.speed || 520, { g: 520, drag: 1.1, r0: 3, r1: 6, l0: 1.1, l1: 2.1, up: 260 }); run(); };
  AFX.text = function (x, y, txt, o) { o = o || {}; ensure(); P.push({ kind: 'text', x: x, y: y, txt: String(txt), c: o.color || '#FFC107', s: o.size || 34, t: 0, life: o.life || 1.1 }); run(); };
  AFX.shake = function (el, strength, ms) {
    if (RM || !el || !el.animate) return; var s = strength || 8, k = [];
    for (var i = 0; i < 9; i++) { var f = 1 - i / 9; k.push({ transform: 'translate(' + (rnd(-s, s) * f).toFixed(1) + 'px,' + (rnd(-s, s) * f).toFixed(1) + 'px) rotate(' + (rnd(-0.6, 0.6) * f * s / 10).toFixed(2) + 'deg)' }); }
    k.push({ transform: 'none' }); try { el.animate(k, { duration: ms || 380, easing: 'linear' }); } catch (e) {}
  };
  AFX.flash = function (color, ms) {
    if (RM) return; var d = document.createElement('div'); d.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9997;background:' + (color || '#fff') + ';opacity:.5';
    document.documentElement.appendChild(d); try { d.animate([{ opacity: 0.5 }, { opacity: 0 }], { duration: ms || 260, easing: 'ease-out' }).onfinish = function () { d.remove(); }; } catch (e) { d.remove(); }
  };

  /* ---------- sounds (Web Audio, made here; no sound files) ---------- */
  var AC = null, NZ = null;
  function ac() { if (AFX.muted) return null; try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) { return null; } return AC; }
  function noise(a) { if (NZ) return NZ; NZ = a.createBuffer(1, a.sampleRate * 1.5, a.sampleRate); var d = NZ.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return NZ; }
  function env(a, g, t0, peak, att, dec) { g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + att); g.gain.exponentialRampToValueAtTime(0.0001, t0 + att + dec); }
  function osc(type, f0, f1, dur, vol, when) { var a = ac(); if (!a) return; var t = a.currentTime + (when || 0), o = a.createOscillator(), g = a.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur); env(a, g, t, vol, 0.008, dur); o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + dur + 0.05); }
  function nz(dur, vol, f0, f1, q, type, when) { var a = ac(); if (!a) return; var t = a.currentTime + (when || 0), s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(); s.buffer = noise(a); f.type = type || 'lowpass'; f.Q.value = q || 0.8; f.frequency.setValueAtTime(f0, t); if (f1) f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur); env(a, g, t, vol, 0.006, dur); s.connect(f); f.connect(g); g.connect(a.destination); s.start(t); s.stop(t + dur + 0.05); }
  AFX.sfx = {
    boom: function (s) { s = s || 1; nz(0.55 * s, 0.5, 2400, 90, 0.7); osc('sine', 150, 34, 0.5 * s, 0.6); osc('triangle', 90, 30, 0.35 * s, 0.3); nz(0.12, 0.25, 6000, 2000, 1, 'highpass'); },
    zap: function () { osc('sawtooth', 1400, 180, 0.16, 0.16); nz(0.08, 0.12, 5000, 1500, 2, 'bandpass'); },
    laser: function () { osc('square', 1900, 320, 0.13, 0.1); osc('sine', 2600, 500, 0.1, 0.08); },
    clang: function () { [523, 784, 1318, 2093, 2637].forEach(function (f, i) { osc('triangle', f * rnd(0.995, 1.005), f * 0.99, 0.5 - i * 0.06, 0.12 / (i * 0.6 + 1)); }); nz(0.05, 0.3, 7000, 3000, 1, 'highpass'); },
    thud: function () { osc('sine', 120, 40, 0.22, 0.5); nz(0.09, 0.25, 700, 120, 0.7); },
    whoosh: function () { nz(0.32, 0.22, 400, 3200, 1.4, 'bandpass'); },
    power: function () { [392, 523, 659, 784, 1047].forEach(function (f, i) { osc('square', f, f, 0.1, 0.09, i * 0.055); }); },
    coin: function () { osc('square', 988, 988, 0.07, 0.1); osc('square', 1319, 1319, 0.22, 0.1, 0.07); },
    win: function () { [523, 659, 784, 1047, 1319, 1568].forEach(function (f, i) { osc('triangle', f, f, 0.26, 0.16, i * 0.09); osc('sine', f * 2, f * 2, 0.2, 0.05, i * 0.09); }); nz(0.5, 0.08, 9000, 4000, 1, 'highpass', 0.5); },
    lose: function () { [330, 262, 208, 156].forEach(function (f, i) { osc('sawtooth', f, f * 0.94, 0.26, 0.1, i * 0.16); }); },
    roar: function () { osc('sawtooth', 190, 70, 0.6, 0.22); osc('sawtooth', 143, 52, 0.6, 0.18); nz(0.6, 0.2, 900, 240, 3, 'bandpass'); },
    squeak: function () { osc('sine', 900, 1900, 0.09, 0.14); osc('sine', 1900, 1200, 0.1, 0.1, 0.09); },
    /* silly raspberry sounds: 'long', 'short', 'wet', 'squeal', 'rumble', 'triple' (or pick one at random) */
    toot: function (kind) {
      var a = ac(); if (!a) return; var K = ['long', 'short', 'wet', 'squeal', 'rumble', 'triple']; kind = kind || K[Math.floor(Math.random() * K.length)];
      function one(when, dur, f0, f1, vol, flutter) { var t = a.currentTime + when, o = a.createOscillator(), g = a.createGain(), lfo = a.createOscillator(), lg = a.createGain(), f = a.createBiquadFilter();
        o.type = 'sawtooth'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
        lfo.type = 'square'; lfo.frequency.setValueAtTime(flutter, t); lfo.frequency.linearRampToValueAtTime(flutter * 0.55, t + dur); lg.gain.value = vol * 0.9;
        f.type = 'lowpass'; f.frequency.value = 700; f.Q.value = 4; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.setValueAtTime(vol, t + dur * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        lfo.connect(lg); lg.connect(g.gain); o.connect(f); f.connect(g); g.connect(a.destination); o.start(t); lfo.start(t); o.stop(t + dur + 0.05); lfo.stop(t + dur + 0.05); }
      if (kind === 'long') one(0, 1.1, 150, 70, 0.3, 38);
      else if (kind === 'short') one(0, 0.22, 210, 150, 0.3, 46);
      else if (kind === 'wet') { one(0, 0.6, 120, 60, 0.3, 24); nz(0.5, 0.12, 1800, 500, 6, 'bandpass'); }
      else if (kind === 'squeal') one(0, 0.7, 380, 900, 0.2, 60);
      else if (kind === 'rumble') { one(0, 1.3, 80, 45, 0.34, 18); osc('sine', 60, 40, 1.2, 0.2); }
      else { one(0, 0.16, 220, 170, 0.28, 48); one(0.22, 0.16, 250, 190, 0.28, 50); one(0.44, 0.5, 190, 80, 0.3, 36); }
    }
  };
})();
