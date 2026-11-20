/* Math 1 Arcade — shared game loop (Nov 20, 2026). Used by Function Invaders, Data Dive, Factor Forge, Island Survey.
   M1.game({
     key: 'fi-best',                         localStorage key for stars + best score per level
     title, intro, how: [[head, text] ×3],   start screen
     levels: [{ id, name, what, kinds: [8 makers] }],
     make: kind => question (see M1.ask),
     word: { item: 'Wave', thing: 'UFO', done: 'Wave cleared!' },
     notes: [href, label],                   tip on the end card when under 5/8 first try
     scene: { question(q, G), miss(q, choice, tries, G), right(q, r, G, done), level(L, G), end(G) }
   })
   The page supplies #q (question host), #chips (HUD chips) and its own scene. */
(function () {
  M1.game = function (cfg) {
    var saved = {}; try { saved = JSON.parse(M1.get(cfg.key) || '{}'); } catch (e) {}
    var G = {}, qHost = document.getElementById('q'), W = cfg.word || {};
    var chips = document.getElementById('chips');
    chips.innerHTML = '<span class="m1-chip" id="gLvl">Pick a level</span><span class="m1-chip" id="gNum"></span><span class="m1-chip">Score <b id="gScore">0</b></span><span class="m1-chip">Streak <b id="gStreak">0</b></span>';
    chips.appendChild(M1.soundButton());
    function over(id) { var d = document.createElement('div'); d.className = 'm1-over'; d.id = id; d.hidden = true; d.innerHTML = '<div class="m1-card"></div>'; document.body.appendChild(d); return d; }
    var sOv = over('startOv'), eOv = over('endOv');
    sOv.querySelector('.m1-card').innerHTML = '<h2>' + cfg.title + '</h2><p>' + cfg.intro + '</p><div class="m1-how">' + cfg.how.map(function (h) { return '<div><b>' + h[0] + '</b>' + h[1] + '</div>'; }).join('') +
      '</div><div class="m1-levels" id="levels"></div><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><button class="m1-go" id="goBtn" type="button">' + (cfg.go || 'Start →') + '</button><span style="color:var(--dim);font-size:.85rem">Keys 1–4 tap answers. Every level is open.</span></div>';
    function hud() {
      document.getElementById('gScore').textContent = (G.score || 0).toLocaleString(); document.getElementById('gStreak').textContent = G.streak || 0;
      document.getElementById('gNum').textContent = (W.item || 'Question') + ' ' + Math.min(8, (G.i || 0) + 1) + ' / 8';
    }
    function start(li) {
      var L = cfg.levels[li];
      G = { li: li, i: 0, score: 0, streak: 0, best: 0, first: 0, missed: [], L: L };
      document.getElementById('gLvl').textContent = L.name.split(':')[0];
      sOv.hidden = true; eOv.hidden = true; hud();
      if (cfg.scene.level) cfg.scene.level(L, G);
      next();
    }
    function next() {
      var q = cfg.make(G.L.kinds[G.i]); G.q = q; hud();
      if (cfg.scene.question) cfg.scene.question(q, G);
      M1.ask(qHost, q, {
        onMiss: function (c, tries) { G.streak = 0; hud(); if (tries === 1) G.missed.push(q.kind); if (cfg.scene.miss) cfg.scene.miss(q, c, tries, G); },
        onRight: function (r) {
          var pts = M1.points(r, G.streak);
          if (r.first) { G.streak++; G.first++; G.best = Math.max(G.best, G.streak); } else G.streak = 0;
          G.score += pts; hud();
          if (pts) M1.toast('+' + pts + (G.streak >= 3 && r.first ? ' · ' + G.streak + ' in a row!' : ''));
          qHost.innerHTML = '<div class="m1q" style="text-align:center;color:var(--dim)">' + (W.wait || 'Nice! Watch…') + '</div>';
          var g1 = G, go = function () { if (G !== g1) return; G.i++; if (G.i >= 8) end(); else next(); };
          if (cfg.scene.right) cfg.scene.right(q, r, G, function () { setTimeout(go, M1.RM ? 200 : 500); }); else setTimeout(go, 900);
        }
      });
    }
    function end() {
      var L = G.L, stars = G.first >= 7 ? 3 : G.first >= 5 ? 2 : 1, old = saved[L.id] || {};
      saved[L.id] = { stars: Math.max(stars, old.stars || 0), score: Math.max(G.score, old.score || 0) }; M1.put(cfg.key, JSON.stringify(saved));
      try { if (window.ArcadeSend) ArcadeSend.round({ level: L.name, score: G.score, details: G.first + '/8 first try · best streak ' + G.best + (G.missed.length ? ' · missed: ' + G.missed.join(', ') : '') }); } catch (e) {}
      M1.sfx.win(); if (cfg.scene.end) cfg.scene.end(G);
      var nx = (G.li + 1) % cfg.levels.length;
      eOv.querySelector('.m1-card').innerHTML = '<h2>' + (W.done || 'Level complete!') + '</h2><p>' + L.name + ' is done.</p>' +
        '<div class="m1-stats"><div><b>' + G.score.toLocaleString() + '</b><span>points</span></div><div><b>' + G.first + '/8</b><span>first try</span></div><div><b>' + G.best + '</b><span>best streak</span></div><div><b>' + '★'.repeat(stars) + '☆'.repeat(3 - stars) + '</b><span>stars</span></div></div>' +
        (G.first < 5 && cfg.notes ? '<p>Tip: look back at <a style="color:var(--gold)" href="' + cfg.notes[0] + '">' + cfg.notes[1] + '</a>, then play this level again.</p>' : '') +
        '<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="m1-go" id="nx" type="button">' + cfg.levels[nx].name + ' →</button><button class="m1-btn" id="ag" type="button">Play this level again</button><button class="m1-btn" id="pk" type="button">All levels</button></div>';
      var g0 = G;
      setTimeout(function () {
        if (G !== g0) return;   // a new level already started
        eOv.hidden = false;
        document.getElementById('nx').onclick = function () { start(nx); }; document.getElementById('ag').onclick = function () { start(G.li); };
        document.getElementById('pk').onclick = function () { eOv.hidden = true; picker(); };
        document.getElementById('nx').focus();
      }, M1.RM ? 100 : 900);
    }
    var pickIdx = 0;
    function picker() {
      var host = document.getElementById('levels'); host.innerHTML = '';
      cfg.levels.forEach(function (L, k) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'm1-lv' + (k === pickIdx ? ' on' : ''); var sv = saved[L.id];
        b.innerHTML = '<b>' + L.name + '</b><small>' + L.what + '</small><span class="st">' + (sv ? '★'.repeat(sv.stars) + '☆'.repeat(3 - sv.stars) + ' · best ' + sv.score.toLocaleString() : 'Not played yet') + '</span>';
        b.onclick = function () { pickIdx = k; host.querySelectorAll('.m1-lv').forEach(function (x, j) { x.classList.toggle('on', j === k); }); };
        b.ondblclick = function () { start(k); };
        host.appendChild(b);
      });
      sOv.hidden = false;
    }
    document.getElementById('goBtn').onclick = function () { start(pickIdx); };
    picker();
    if (/[?&]debug/.test(location.search)) window.__GAME = { G: function () { return G; }, start: start };
    return { start: start, G: function () { return G; } };
  };
})();
