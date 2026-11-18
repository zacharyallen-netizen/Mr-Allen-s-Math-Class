/* ARCADE PASS (Nov 18, 2026, Zach: students who finish a set of Skill Builder videos "earn some arcade time").
   Every 3 Skill Builder videos watched (each new video counts once) = 5 minutes of Arcade time.
   Honor system: nothing is locked. The pass and its timer live on this Chromebook only (localStorage):
     arcade-pass = { bank: minutes saved, end: time the running timer stops (ms) }
   API: ArcadePass.add(min) · ArcadePass.bank() · ArcadePass.left() (seconds) · ArcadePass.start()
   On the Arcade and its games (loaded by arcade-send.js and arcade.html) it shows a small chip:
     "🎟️ 5 min of Arcade time · Start" → then a countdown "🎟️ Arcade time 4:59" → at 0 a kind "Time's up" note. */
(function () {
  if (window.ArcadePass) return;
  var KEY = 'arcade-pass';
  function read() { try { var o = JSON.parse(localStorage.getItem(KEY) || '{}'); return { bank: +o.bank || 0, end: +o.end || 0, done: +o.done || 0 }; } catch (e) { return { bank: 0, end: 0 }; } }
  function write(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function left() { var o = read(); return Math.max(0, Math.round((o.end - Date.now()) / 1000)); }
  var AP = window.ArcadePass = {
    add: function (min) { var o = read(); o.bank = Math.min(60, o.bank + min); write(o); draw(); },
    bank: function () { return read().bank; },
    left: left,
    start: function () { var o = read(); if (!o.bank) return; o.end = Math.max(Date.now(), o.end) + o.bank * 60000; o.bank = 0; o.done = 0; write(o); draw(); }
  };
  var UI = !/skill-builders/.test(location.pathname);     // Skill Builders only add time; the chip shows on the Arcade and its games
  if (!UI) return;
  var chip = null, tick = null, toldEnd = false;
  function el() {
    if (chip) return chip;
    var s = document.createElement('style');
    s.textContent = '#ap-chip{position:fixed;left:90px;bottom:62px;z-index:9999;display:flex;align-items:center;gap:8px;background:#1E2D4F;color:#fff;border:2px solid #FFC107;border-radius:999px;padding:7px 8px 7px 14px;font:700 14px Inter,system-ui,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.35)}' +
      '#ap-chip b{font-family:"JetBrains Mono",monospace;color:#FFC107}#ap-chip button{border:0;border-radius:999px;background:#FFC107;color:#1E2D4F;font:800 13px Inter,sans-serif;padding:6px 12px;cursor:pointer}' +
      '#ap-chip.low{border-color:#ff8fa3}#ap-chip[hidden]{display:none}@media (max-width:760px){#ap-chip{left:10px;bottom:62px}}' +
      '#ap-end{position:fixed;inset:0;z-index:10000;background:rgba(6,10,24,.75);display:flex;align-items:center;justify-content:center}#ap-end div{background:#fff;color:#1E2D4F;border-radius:18px;padding:22px 26px;max-width:380px;text-align:center;font:500 16px/1.45 Inter,sans-serif}' +
      '#ap-end h2{margin:0 0 6px;font:700 24px "Source Serif 4",Georgia,serif}#ap-end button,#ap-end a{display:inline-block;margin:8px 4px 0;border:0;border-radius:10px;padding:10px 16px;font:800 15px Inter,sans-serif;cursor:pointer;text-decoration:none}' +
      '#ap-end a{background:#1E2D4F;color:#fff}#ap-end button{background:#eef1f7;color:#1E2D4F}';
    document.head.appendChild(s);
    chip = document.createElement('div'); chip.id = 'ap-chip'; chip.setAttribute('role', 'status');
    document.documentElement.appendChild(chip);
    return chip;
  }
  function root() { var m = location.pathname.match(/^(.*?\/)grade8\//); return m ? m[1] : '/'; }
  function draw() {
    if (!UI) return;
    var o = read(), s = left();
    if (!o.bank && !s) { if (chip) chip.hidden = true; return; }
    var c = el(); c.hidden = false;
    if (s > 0) {
      c.classList.toggle('low', s <= 60);
      c.innerHTML = '🎟️ Arcade time <b>' + Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') + '</b>' + (o.bank ? ' <span>+' + o.bank + ' min saved</span>' : '');
    } else {
      c.classList.remove('low');
      c.innerHTML = '🎟️ You earned <b>' + o.bank + ' min</b> of Arcade time <button type="button">Start</button>';
      c.querySelector('button').onclick = function () { AP.start(); toldEnd = false; };
    }
  }
  function loop() {
    var o = read(), s = left();
    if (o.end && !s && !o.done && !toldEnd) {
      toldEnd = true; o.done = 1; write(o);
      var d = document.createElement('div'); d.id = 'ap-end';
      d.innerHTML = '<div><h2>Arcade time is up!</h2><p>Great job earning it. Watch 3 more Skill Builder videos to earn more time.</p>' +
        '<a href="' + root() + 'grade8/skill-builders.html">Back to Skill Builders</a><button type="button">Close</button></div>';
      d.querySelector('button').onclick = function () { d.remove(); };
      document.documentElement.appendChild(d);
    }
    draw();
  }
  function go() { draw(); tick = setInterval(loop, 1000); if (/[?&]pass=start/.test(location.search)) AP.start(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
  window.addEventListener('storage', function (e) { if (e.key === KEY) draw(); });
})();
