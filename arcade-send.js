/* ───────────────────────────────────────────────────────────────
   ARCADE SEND — logs arcade play to Mr. Allen's private
   "2627 Arcade Results" Google Sheet (through the Student Work script).

   Add to a game page (before site-bar.js):
     <script src="../tracker-config.js"></script>
     <script src="../arcade-send.js" data-game="UFO Blaster" data-unit="6"></script>

   Every game automatically reports minutes played (only while the game is
   on screen). A row is sent when the student leaves the page or switches tabs.
   Games can report more:
     ArcadeSend.answer(true|false)                  // one answer / shot / step checked
     ArcadeSend.round({ level:'Level 3', score:450 }) // a round, level or room finished
     ArcadeSend.set({ level:'…', score:…, details:'…' })

   The student types their name once (shared with the Fluency Lab and practice
   pages). If tracker-config.js has no ENDPOINT, nothing is sent or shown.
   ─────────────────────────────────────────────────────────────── */
(function () {
  if (window.ArcadeSend) return;
  var CFG = window.TRACKER_CONFIG || {};
  var NAME_KEY = 'fluencyLabStudentName', HIDE_KEY = 'arcadeSendMin';
  var me = document.currentScript || {};
  var ds = me.dataset || {};
  var GAME = ds.game || document.title, UNIT = ds.unit || '';

  function get(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function put(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var S = { ms: 0, since: Date.now(), on: !document.hidden, rounds: 0, correct: 0, tries: 0, level: '', score: null, details: '' };
  function tick() { var n = Date.now(); if (S.on) S.ms += n - S.since; S.since = n; }

  function flush() {
    tick();
    var name = get(NAME_KEY);
    if (!CFG.ENDPOINT || !name) return;
    var mins = S.ms / 60000;
    if (mins < 0.25 && !S.tries && !S.rounds) return;
    var body = JSON.stringify({
      code: CFG.CLASS_CODE, kind: 'arcade', name: name, game: GAME, unit: UNIT,
      minutes: Math.round(mins * 100) / 100, rounds: S.rounds, level: S.level,
      score: S.score == null ? '' : S.score, correct: S.correct, tries: S.tries, details: S.details,
      url: location.pathname.split('/').slice(-2).join('/')
    });
    var sent = false;
    try { sent = navigator.sendBeacon && navigator.sendBeacon(CFG.ENDPOINT, new Blob([body], { type: 'text/plain;charset=utf-8' })); } catch (e) {}
    if (!sent) { try { fetch(CFG.ENDPOINT, { method: 'POST', keepalive: true, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: body }); } catch (e) {} }
    S.ms = 0; S.rounds = 0; S.correct = 0; S.tries = 0; S.score = null; S.details = '';
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { flush(); S.on = false; } else { S.on = true; S.since = Date.now(); }
  });
  window.addEventListener('pagehide', flush);

  window.ArcadeSend = {
    answer: function (ok) { S.tries++; if (ok) S.correct++; },
    round: function (o) { S.rounds++; if (o) this.set(o); },
    set: function (o) {
      if (!o) return;
      if (o.level != null) S.level = String(o.level).slice(0, 40);
      if (o.score != null && !isNaN(o.score)) S.score = Math.max(S.score == null ? -Infinity : S.score, Number(o.score));
      if (o.details != null) S.details = String(o.details).slice(0, 300);
    },
    flush: flush
  };

  /* small "Playing as" tag in the corner (shadow DOM, so it never changes the game's look) */
  if (!CFG.ENDPOINT) return;
  function mount() {
    if (!document.body || document.getElementById('arcade-send')) return;
    var host = document.createElement('div'); host.id = 'arcade-send';
    host.style.cssText = 'position:fixed;left:10px;bottom:10px;z-index:2147483000';
    document.body.appendChild(host);
    var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;
    root.innerHTML = '<style>' +
      ':host{all:initial}' +
      '.t{font:600 12.5px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#E8EEFF;background:rgba(14,20,44,.88);border:1px solid rgba(160,190,255,.35);border-radius:18px;padding:6px 10px;display:flex;gap:8px;align-items:center;box-shadow:0 4px 14px rgba(0,0,0,.35);max-width:calc(100vw - 20px)}' +
      '.t.need{background:#FFF4CC;color:#3A2E00;border-color:#E0A800}' +
      'button{font:inherit;color:inherit;background:none;border:0;padding:2px 4px;cursor:pointer;text-decoration:underline}' +
      'input{font:500 13px system-ui,sans-serif;padding:4px 6px;border:1px solid #9AA4BF;border-radius:6px;width:150px}' +
      '.min{padding:6px 9px}' +
      '@media print{.t{display:none}}' +
      '</style><div class="t" role="status"></div>';
    var box = root.querySelector('.t');
    function draw(edit) {
      var name = get(NAME_KEY), min = get(HIDE_KEY) === '1' && name && !edit;
      box.className = 't' + (name ? '' : ' need') + (min ? ' min' : '');
      if (min) { box.innerHTML = '<button type="button" data-a="open" aria-label="Arcade player: ' + esc(name) + '">🎮</button>'; return; }
      if (edit || !name) {
        box.innerHTML = '<span>' + (name ? 'Your name:' : 'Type your first and last name so Mr. Allen sees your arcade play:') + '</span>' +
          '<input type="text" autocomplete="name" maxlength="60" aria-label="First and last name" value="' + esc(name) + '"><button type="button" data-a="save">Save</button>';
        var inp = box.querySelector('input');
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') save(); e.stopPropagation(); });
        inp.addEventListener('keyup', function (e) { e.stopPropagation(); });
        return;
      }
      box.innerHTML = '<span>🎮 Playing as <b>' + esc(name) + '</b></span><button type="button" data-a="edit">change</button><button type="button" data-a="min" aria-label="Hide">×</button>';
    }
    function save() {
      var v = (box.querySelector('input') || {}).value || '';
      v = v.replace(/\s+/g, ' ').trim();
      if (v.split(' ').length < 2) { var i = box.querySelector('input'); if (i) { i.style.borderColor = '#C0392B'; i.focus(); } return; }
      put(NAME_KEY, v); draw(false);
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button') : null; if (!b) return;
      var a = b.getAttribute('data-a');
      if (a === 'save') save();
      else if (a === 'edit') draw(true);
      else if (a === 'min') { put(HIDE_KEY, '1'); draw(false); }
      else if (a === 'open') { put(HIDE_KEY, ''); draw(false); }
    });
    draw(false);
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
