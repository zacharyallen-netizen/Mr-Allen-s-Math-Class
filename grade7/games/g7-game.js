/* ───────────────────────────────────────────────────────────────
   7th grade arcade games (Nov 20, 2026): one shared round runner.
   Uses the Math 1 arcade question card (../math1/arcade/m1-arcade.js, M1.ask):
   Read-first wait, keys 1–4, Hint, 🔊 Read it, a wrong tap is crossed out and
   names the mistake, 2nd miss shows the hint, 3rd miss = the right one glows + steps.

   G7G.run({
     key: 'md',                       localStorage best key
     levels: [{ id, name, what, kinds: ['a', 'b', ...] }],   10 kinds per round
     make: function (kind) → { p, ch: M1.choices(...), hint, steps, kind },
     scene: { add(i, first), finale(done), reset() },
     word: 'item'                     what a right answer earns (for the HUD)
   })
   Logging: ArcadeSend.answer (in M1.ask) + one ArcadeSend.round per finished round.
   ?debug exposes window.__G7G and marks the right buttons (data-ok) for tests.
   ─────────────────────────────────────────────────────────────── */
(function () {
  var N = 10;
  function $(id) { return document.getElementById(id); }
  window.G7G = {
    /* small helpers for the question files */
    gcd: function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; },
    fr: function (n, d) { var g = G7G.gcd(n, d); n /= g; d /= g; if (d < 0) { n = -n; d = -d; } return d === 1 ? M1.n(n) : (n < 0 ? '−' : '') + Math.abs(n) + '/' + d; },
    r2: function (x) { return Math.round(x * 100) / 100; },
    money: function (x) { x = Math.round(x * 100) / 100; return '$' + (x % 1 ? x.toFixed(2) : String(x)); },
    run: function (cfg) {
      var saved = {}; try { saved = JSON.parse(M1.get(cfg.key + '-best') || '{}'); } catch (e) {}
      var G = { li: 0, i: 0, score: 0, streak: 0, best: 0, first: 0, missed: [], kinds: [] };
      var qHost = $('q'); $('sndHere').appendChild(M1.soundButton());
      function hud() {
        $('score').textContent = G.score.toLocaleString(); $('streak').textContent = G.streak;
        var d = ''; for (var k = 0; k < N; k++) d += '<i class="' + (k < G.i ? (G.res[k] ? 'done' : 'miss') : k === G.i ? 'now' : '') + '"></i>';
        $('dots').innerHTML = d; $('cNum').textContent = Math.min(G.i + 1, N) + ' of ' + N;
      }
      function start(li) {
        $('startOv').hidden = true; $('endOv').hidden = true;
        var L = cfg.levels[li];
        G = { li: li, i: 0, score: 0, streak: 0, best: 0, first: 0, missed: [], kinds: L.kinds.slice(0, N), res: [] };
        $('chipLv').textContent = L.name; $('cLv').textContent = L.name;
        cfg.scene.reset(); hud(); next();
      }
      function next() {
        hud();
        var q = cfg.make(G.kinds[G.i]);
        M1.ask(qHost, q, {
          onMiss: function (c, tries) { G.streak = 0; hud(); if (tries === 1) G.missed.push(q.kind); },
          onRight: function (r) {
            var pts = M1.points(r, G.streak);
            if (r.first) { G.streak++; G.first++; G.best = Math.max(G.best, G.streak); } else G.streak = 0;
            G.score += pts; G.res[G.i] = r.first; hud();
            if (pts) M1.toast('+' + pts + (G.streak >= 3 && r.first ? ' · ' + G.streak + ' in a row!' : ''));
            cfg.scene.add(G.i, r.first); M1.sfx.chime();
            setTimeout(function () { G.i++; if (G.i >= N) finale(); else next(); }, M1.RM ? 500 : 1400);
          }
        });
      }
      function finale() {
        hud(); qHost.innerHTML = '<div class="gg-wait"><b>' + cfg.finaleText + '</b></div>';
        cfg.scene.finale(function () { setTimeout(endCard, 400); });
      }
      function endCard() {
        var L = cfg.levels[G.li], stars = G.first >= 9 ? 3 : G.first >= 6 ? 2 : 1, old = saved[L.id] || {};
        saved[L.id] = { stars: Math.max(stars, old.stars || 0), score: Math.max(G.score, old.score || 0) }; M1.put(cfg.key + '-best', JSON.stringify(saved));
        try { if (window.ArcadeSend) ArcadeSend.round({ level: L.name, score: G.score, details: G.first + '/' + N + ' first try · best streak ' + G.best + (G.missed.length ? ' · missed: ' + G.missed.join(', ') : '') }); } catch (e) {}
        M1.sfx.win();
        var nx = (G.li + 1) % cfg.levels.length;
        $('endCard').innerHTML = '<h2>' + cfg.doneTitle + '</h2><p>' + L.name + ' is complete.</p>' +
          '<div class="m1-stats"><div><b>' + G.score.toLocaleString() + '</b><span>points</span></div><div><b>' + G.first + '/' + N + '</b><span>first try</span></div><div><b>' + G.best + '</b><span>best streak</span></div><div><b>' + '★'.repeat(stars) + '☆'.repeat(3 - stars) + '</b><span>stars</span></div></div>' +
          (G.first < 6 ? '<p>Tip: look back at the Unit ' + L.unit + ' notes, then play this level again.</p>' : '') +
          '<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="m1-go" id="nx" type="button">' + cfg.levels[nx].name + ' →</button><button class="m1-btn" id="ag" type="button">Play this level again</button><button class="m1-btn" id="pk" type="button">Pick a level</button></div>';
        $('endOv').hidden = false;
        $('nx').onclick = function () { start(nx); }; $('ag').onclick = function () { start(G.li); };
        $('pk').onclick = function () { $('endOv').hidden = true; picker(); };
      }
      var pickIdx = 0;
      function picker() {
        var host = $('levels'); host.innerHTML = '';
        cfg.levels.forEach(function (L, k) {
          var b = document.createElement('button'); b.type = 'button'; b.className = 'm1-lv' + (k === pickIdx ? ' on' : ''); var sv = saved[L.id];
          b.innerHTML = '<b>' + L.name + '</b><small>' + L.what + '</small><span class="st">' + (sv ? '★'.repeat(sv.stars) + '☆'.repeat(3 - sv.stars) + ' · best ' + sv.score.toLocaleString() : 'Not played yet') + '</span>';
          b.onclick = function () { pickIdx = k; host.querySelectorAll('.m1-lv').forEach(function (x, j) { x.classList.toggle('on', j === k); }); };
          b.ondblclick = function () { start(k); };
          host.appendChild(b);
        });
        $('startOv').hidden = false;
      }
      $('goBtn').onclick = function () { start(pickIdx); };
      cfg.scene.reset(); picker();
      if (/[?&]debug/.test(location.search)) window.__G7G = { G: function () { return G; }, start: start, make: cfg.make, levels: cfg.levels };
    }
  };
})();
