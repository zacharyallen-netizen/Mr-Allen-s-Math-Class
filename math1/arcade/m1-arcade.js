/* ───────────────────────────────────────────────────────────────
   MATH 1 ARCADE — shared game helper (Nov 19, 2026)
   Used by Number Stations, Drone Intercept and Firework Finale.

   M1.ask(host, q, cb)  one question card, the same rules everywhere:
     q = { p: prompt html, ch: [{ h: html, ok: true|false, why: html }], hint, steps, yes }
     • answer buttons wait THINK ms ("Read the problem first…")
     • a wrong tap is crossed out and NAMES the mistake (its own why)
     • 2nd miss = the hint shows too; 3rd miss = the right choice glows + the steps
     • keys 1–4 tap a choice; 🔊 reads the problem; Hint any time
     cb.onMiss(choice, tries), cb.onRight({ tries, first })
   M1.sfx.* sounds (Web Audio, original), M1.muted, M1.say(text)
   M1.n(x) number with a true minus sign, M1.pick, M1.rint, M1.shuffle
   ─────────────────────────────────────────────────────────────── */
(function () {
  if (window.M1) return;
  var THINK = 1300, RM = false; var DEBUG = false; try { DEBUG = /[?&]debug/.test(location.search); } catch (e) {}  // tests only: marks the right button
  try { RM = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---------- numbers ---------- */
  function n(x) { x = +x; return (x < 0 ? '−' : '') + Math.abs(x).toLocaleString('en-US', { maximumFractionDigits: 4 }); }
  function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  /* Build 4 choices: right + the first 3 distinct wrong ones (by their key). Fillers keep 4 when mistakes collide. */
  function choices(right, wrongs, fillers) {
    var seen = {}, out = [{ h: right.h, ok: true, why: right.why || '', k: String(right.k), at: right.at }];
    seen[right.k] = 1;
    (wrongs || []).concat(fillers || []).forEach(function (w) {
      if (out.length >= 4 || w == null || seen[w.k]) return;
      seen[w.k] = 1; out.push({ h: w.h, ok: false, why: w.why, k: w.k, at: w.at });
    });
    return out;
  }

  /* ---------- sound (original Web Audio blips) ---------- */
  var AC = null, muted = get('m1-mute') === '1';
  function ac() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (AC && AC.state === 'suspended') AC.resume(); return AC; }
  function tone(f, t0, dur, type, vol, f2) {
    var c = ac(); if (!c || muted) return;
    var o = c.createOscillator(), g = c.createGain(), t = c.currentTime + (t0 || 0);
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.05);
  }
  function noise(t0, dur, vol, hp) {
    var c = ac(); if (!c || muted) return;
    var len = Math.floor(c.sampleRate * dur), b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var s = c.createBufferSource(), g = c.createGain(), f = c.createBiquadFilter(), t = c.currentTime + (t0 || 0);
    f.type = 'highpass'; f.frequency.value = hp || 800; s.buffer = b; g.gain.value = vol || 0.15;
    s.connect(f); f.connect(g); g.connect(c.destination); s.start(t);
  }
  var sfx = {
    tap: function () { tone(660, 0, 0.06, 'square', 0.04); },
    ok: function () { tone(523, 0, 0.12, 'triangle', 0.14); tone(659, 0.09, 0.12, 'triangle', 0.14); tone(784, 0.18, 0.22, 'triangle', 0.14); },
    bad: function () { tone(220, 0, 0.22, 'sawtooth', 0.06, 150); },
    reveal: function () { tone(392, 0, 0.2, 'sine', 0.1); tone(330, 0.15, 0.3, 'sine', 0.1); },
    chime: function () { tone(1047, 0, 0.5, 'sine', 0.08); tone(1568, 0.05, 0.6, 'sine', 0.05); },
    whoosh: function () { noise(0, 0.45, 0.08, 1500); tone(300, 0, 0.45, 'sine', 0.04, 900); },
    boom: function () { noise(0, 0.9, 0.22, 120); tone(90, 0, 0.6, 'sine', 0.2, 40); noise(0.12, 0.7, 0.06, 3000); },
    crackle: function () { for (var i = 0; i < 9; i++) noise(0.25 + i * 0.07 * Math.random() * 3, 0.04, 0.05, 4000); },
    horn: function () { tone(311, 0, 0.5, 'sawtooth', 0.05); tone(370, 0, 0.5, 'sawtooth', 0.05); },
    ding: function () { tone(1319, 0, 0.35, 'sine', 0.09); tone(988, 0.22, 0.5, 'sine', 0.09); },
    win: function () { [523, 659, 784, 1047, 784, 1047].forEach(function (f, i) { tone(f, i * 0.11, 0.2, 'triangle', 0.12); }); },
    net: function () { tone(180, 0, 0.3, 'square', 0.05, 520); noise(0.05, 0.25, 0.08, 2000); }
  };
  function setMuted(m) { muted = !!m; put('m1-mute', muted ? '1' : '0'); document.querySelectorAll('.m1-snd').forEach(function (b) { b.textContent = muted ? '🔇 Sound off' : '🔊 Sound on'; }); if (muted) try { speechSynthesis.cancel(); } catch (e) {} }
  function soundButton() { var b = document.createElement('button'); b.type = 'button'; b.className = 'm1-btn m1-snd'; b.textContent = muted ? '🔇 Sound off' : '🔊 Sound on'; b.onclick = function () { setMuted(!muted); }; return b; }

  /* ---------- read aloud (math in words) ---------- */
  function words(node) {
    var c = node.cloneNode(true);
    c.querySelectorAll('.m1-noread,button').forEach(function (x) { x.remove(); });
    c.querySelectorAll('sub').forEach(function (s) { s.textContent = ' sub ' + s.textContent + ' '; });
    c.querySelectorAll('sup').forEach(function (s) { var t = s.textContent; s.textContent = t === '2' ? ' squared ' : ' to the power ' + t + ', '; });
    return c.textContent.replace(/−/g, ' minus ').replace(/·|×/g, ' times ').replace(/÷/g, ' divided by ')
      .replace(/≠/g, ' is not ').replace(/\?/g, '? ').replace(/\s+/g, ' ').trim();
  }
  function say(text) {
    try { speechSynthesis.cancel(); if (muted) return; var u = new SpeechSynthesisUtterance(text); u.rate = 0.9; u.pitch = 1; speechSynthesis.speak(u); } catch (e) {}
  }

  /* ---------- the question card ---------- */
  var live = null;
  function ask(host, q, cb) {
    cb = cb || {};
    if (live) live.off();
    var ch = shuffle(q.ch), tries = 0, done = false, t0 = Date.now();
    host.innerHTML = '';
    var box = el('div', 'm1q');
    box.innerHTML = '<div class="m1q-p">' + q.p + '</div>';
    var grid = el('div', 'm1q-c'), wait = el('div', 'm1q-wait'), note = el('div', 'm1q-note'), row = el('div', 'm1q-row');
    wait.innerHTML = '<span></span>Read the problem first…';
    var btns = ch.map(function (c, i) {
      var b = el('button', 'm1q-b'); b.type = 'button';
      b.innerHTML = '<span class="m1q-k">' + (i + 1) + '</span><span class="m1q-t">' + c.h + '</span>';
      b.disabled = true; b.onclick = function () { tapc(i); }; if (DEBUG) b.setAttribute('data-ok', c.ok ? '1' : '0'); grid.appendChild(b); return b;
    });
    var hb = el('button', 'm1-btn'); hb.type = 'button'; hb.textContent = '💡 Hint'; hb.onclick = function () { showHint(); };
    var rb = el('button', 'm1-btn'); rb.type = 'button'; rb.textContent = '🔊 Read it'; rb.onclick = function () { say(words(box.querySelector('.m1q-p')) + '. Choices: ' + ch.map(function (c, i) { var d = document.createElement('div'); d.innerHTML = c.h; return (i + 1) + ', ' + words(d); }).join('. ')); };
    row.appendChild(hb); row.appendChild(rb);
    box.appendChild(wait); box.appendChild(grid); box.appendChild(row); box.appendChild(note); host.appendChild(box);
    var hintShown = false;
    function showHint() { if (hintShown || !q.hint) return; hintShown = true; var h = el('div', 'm1q-hint'); h.innerHTML = '<b>Hint:</b> ' + q.hint; box.insertBefore(h, note); hb.disabled = true; }
    function unlock(ms) {
      wait.classList.add('on'); wait.style.setProperty('--ms', ms + 'ms');
      btns.forEach(function (b) { b.disabled = true; });
      clearTimeout(box._t); box._t = setTimeout(function () { wait.classList.remove('on'); btns.forEach(function (b) { if (!b.classList.contains('x')) b.disabled = done; }); }, ms);
    }
    unlock(q.think || THINK);
    function tapc(i) {
      if (done || btns[i].disabled) return;
      var c = ch[i];
      if (c.ok) {
        done = true; btns[i].classList.add('ok'); btns.forEach(function (b) { b.disabled = true; });
        sfx.ok();
        note.className = 'm1q-note good'; note.innerHTML = '<b>' + pick(tries ? ['Correct!', 'You got it!', 'That is it!'] : ['Correct!', 'Nice work!', 'Right on!', 'Exactly!']) + '</b> ' + (q.yes || '');
        if (tries === 0) try { if (window.ArcadeSend) ArcadeSend.answer(true); } catch (e) {}
        off();
        if (cb.onRight) cb.onRight({ tries: tries, first: tries === 0, ms: Date.now() - t0, revealed: tries >= 3 });
        return;
      }
      tries++; btns[i].classList.add('x'); btns[i].disabled = true; sfx.bad();
      if (tries === 1) try { if (window.ArcadeSend) ArcadeSend.answer(false); } catch (e) {}
      var msg = '<b>Not yet.</b> ' + (c.why || 'Check your work one more time.');
      if (tries === 2) { showHint(); msg += ' <i>Read the hint above.</i>'; }
      if (tries >= 3) {
        btns.forEach(function (b, j) { if (ch[j].ok) b.classList.add('glow'); });
        msg += '<div class="m1q-steps"><b>Here is how:</b> ' + (q.steps || '') + '</div><div class="m1q-tapit">Tap the glowing answer to keep going.</div>';
        sfx.reveal();
      }
      note.className = 'm1q-note bad'; note.innerHTML = msg;
      if (cb.onMiss) cb.onMiss(c, tries);
      unlock(tries >= 3 ? 500 : 900);
    }
    function key(e) {
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      var k = +e.key; if (k >= 1 && k <= btns.length) { e.preventDefault(); tapc(k - 1); }
    }
    function off() { document.removeEventListener('keydown', key); if (live && live.box === box) live = null; }
    document.addEventListener('keydown', key);
    live = { box: box, off: off };
    return { box: box, off: off };
  }
  function el(t, c) { var e = document.createElement(t); if (c) e.className = c; return e; }

  /* ---------- small banner + score helpers ---------- */
  function toast(text, cls) {
    var t = el('div', 'm1-toast ' + (cls || '')); t.innerHTML = text; document.body.appendChild(t);
    setTimeout(function () { t.classList.add('out'); }, 1500); setTimeout(function () { t.remove(); }, 2100);
  }
  function points(r, streak) { var base = r.first ? 100 : r.tries === 1 ? 50 : r.tries === 2 ? 25 : 0; return base ? base + Math.min(streak, 10) * 10 : 0; }
  function best(key, v) { var b = +(get(key) || 0); if (v != null && v > b) { put(key, v); return v; } return b; }

  window.M1 = { ask: ask, choices: choices, n: n, rint: rint, pick: pick, shuffle: shuffle, sfx: sfx, say: say, words: words,
    soundButton: soundButton, setMuted: setMuted, get muted() { return muted; }, toast: toast, points: points, best: best, RM: RM, el: el, get: get, put: put };
})();
