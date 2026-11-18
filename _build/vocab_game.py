"""Vocab Flashcards + Vocab Blitz (Nov 18, 2026, Zach: "take the vocabulary word section and make an interactive
flashcard review like game").

Reads every card on grade8/vocabulary.html (term, unit, definition, picture line, tip) so the game always matches the
glossary, and writes grade8/vocab-flashcards.html:
  - Flashcards: tap / Space to flip; "Still learning" puts the card back a few cards later, "Got it!" takes it out of
    the round; a round ends when every card is "Got it"; known cards are remembered on this device (localStorage vocab-known).
  - Vocab Blitz: 10 questions, mixed "Which word matches?" and "What does ___ mean?", 4 tap choices (wrong ones from the
    same unit first). Points + speed bonus + streak; a wrong tap names the word that WAS tapped and what it means, then
    the right one glows. Missed words → "Study these" deck. Best score on this device (vocab-best).
  - Unit chips (All, U1–U8, Vol), 🔊 Read (device voice), keyboard: Space flip, ← / → learning / got it, 1–4 choices.
  - Logs plays like an Arcade game (arcade-send.js, game "Vocab Blitz"): answers + one round per Blitz with the score,
    so it counts toward the Top Students line. Not on the Arcade page, so it has no High Scores board.
Rerun after editing vocabulary.html:   python3 _build/vocab_game.py
"""
import re, json, html as H, os
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
src = open(os.path.join(ROOT, 'grade8', 'vocabulary.html'), encoding='utf-8').read()

cards = []
for blk in src.split('<div class="vcard" ')[1:]:
    unit = re.search(r'data-unit="(\w+)"', blk).group(1)
    f = dict(re.findall(r'class="vcard-(term|def|visual|ex)">(.*?)</div>', blk, re.S))
    strip = lambda s: re.sub(r'^\s*(📌|💡)\s*', '', (s or '').strip())
    cards.append({'u': unit, 't': f['term'].strip(), 'd': f['def'].strip(), 'v': strip(f.get('visual')), 'x': strip(f.get('ex'))})
assert len(cards) >= 40, len(cards)
assert len({c['t'].lower() for c in cards}) == len(cards), 'duplicate terms'
UNITS = [u for u in ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'vol'] if any(c['u'] == u for c in cards)]

PAGE = r'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Vocab Flashcards &amp; Blitz — 8th Grade Math</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&family=JetBrains+Mono:wght@600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../site.css">
<style>
:root{--navy:#1E2D4F;--gold:#FFC107;--gold2:#E0A800;--off:#F7F7F4;--green:#15803D;--red:#B42318;--muted:#5B6475}
body{background:var(--off)}
.vf{max-width:900px;margin:0 auto;padding:18px 16px 60px;font-family:Inter,system-ui,sans-serif;color:#1B2333}
.vf h1{font-family:"Source Serif 4",Georgia,serif;color:var(--navy);font-size:clamp(26px,4vw,36px);margin:6px 0 4px}
.vf .sub{color:var(--muted);margin:0 0 14px;font-size:15px}
.tabs{display:flex;gap:8px;margin:0 0 12px;flex-wrap:wrap}
.tabs button{font:700 15px Inter,sans-serif;border:2px solid var(--navy);background:#fff;color:var(--navy);border-radius:999px;padding:8px 18px;cursor:pointer}
.tabs button.on{background:var(--navy);color:var(--gold)}
.chips{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 16px}
.chips button{font:600 13px Inter,sans-serif;border:1.5px solid #C9D1E3;background:#fff;color:var(--navy);border-radius:8px;padding:5px 11px;cursor:pointer}
.chips button.on{border-color:var(--gold2);background:#FFF3C4}
.bar{display:flex;align-items:center;gap:10px;margin:0 0 10px;font:600 14px Inter,sans-serif;color:var(--navy)}
.bar .track{flex:1;height:10px;background:#E3E8F3;border-radius:99px;overflow:hidden}.bar .track i{display:block;height:100%;width:0;background:var(--green);border-radius:99px;transition:width .4s}
/* flashcard */
.stage{perspective:1400px;margin:6px 0 14px}
.card{position:relative;height:clamp(250px,42vh,340px);cursor:pointer;transform-style:preserve-3d;transition:transform .55s cubic-bezier(.3,.7,.3,1)}
.card.flip{transform:rotateY(180deg)}
.face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:18px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:22px 26px;text-align:center;box-shadow:0 6px 0 #0f1a33,0 14px 30px rgba(30,45,79,.25)}
.front{background:linear-gradient(160deg,#22355f,#1E2D4F 60%);color:#fff;border:3px solid var(--gold)}
.front .term{font:700 clamp(30px,6vw,52px)/1.1 "Source Serif 4",Georgia,serif;color:var(--gold)}
.front .tap{margin-top:18px;font-size:14px;color:#c9d3ea}
.back{background:#fff;border:3px solid var(--navy);transform:rotateY(180deg);color:#1B2333}
.back .bt{font:700 20px "Source Serif 4",serif;color:var(--navy);margin-bottom:8px}
.back .def{font:500 clamp(17px,2.4vw,21px)/1.45 Inter,sans-serif}
.back .vis{margin-top:12px;background:#FFF8E1;border-radius:10px;padding:6px 12px;font-size:15px}
.back .ex{margin-top:8px;color:var(--muted);font-size:14.5px}
.utag{position:absolute;left:14px;top:12px;font:800 11px Inter,sans-serif;letter-spacing:.1em;background:var(--gold);color:var(--navy);border-radius:6px;padding:2px 7px}
.back .utag{background:var(--navy);color:var(--gold)}
.say{position:absolute;right:12px;top:10px;border:0;background:rgba(255,255,255,.14);color:inherit;border-radius:8px;font-size:16px;padding:4px 8px;cursor:pointer}
.back .say{background:#EEF2FA}
.acts{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.acts button,.go{font:700 16px Inter,sans-serif;border-radius:12px;padding:12px 20px;cursor:pointer;border:2px solid transparent;min-width:150px}
.b-learn{background:#fff;border-color:#C2410C !important;color:#C2410C}.b-got{background:var(--green);color:#fff}
.b-flip{background:#fff;border-color:var(--navy) !important;color:var(--navy)}
.go{background:var(--gold);color:var(--navy);box-shadow:0 3px 0 var(--gold2)}
.hint{text-align:center;color:var(--muted);font-size:13px;margin-top:10px}
.done{text-align:center;background:#fff;border:2px solid var(--gold);border-radius:18px;padding:26px 18px}
.done h2{font-family:"Source Serif 4",serif;color:var(--navy);margin:0 0 6px}
.done .big{font:800 44px "JetBrains Mono",monospace;color:var(--navy)}
.done ul{list-style:none;padding:0;margin:10px auto;max-width:520px;text-align:left}.done li{padding:6px 10px;border-bottom:1px solid #EEF1F6}
/* blitz */
.hud{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:0 0 10px}
.hud div{background:#fff;border:2px solid #D5DBE8;border-radius:12px;padding:6px;text-align:center;font:600 12px Inter,sans-serif;color:var(--muted)}
.hud b{display:block;font:800 22px "JetBrains Mono",monospace;color:var(--navy)}
.timer{height:8px;background:#E3E8F3;border-radius:99px;overflow:hidden;margin:0 0 12px}.timer i{display:block;height:100%;width:100%;background:var(--gold)}
.q{position:relative;background:#fff;border:3px solid var(--navy);border-radius:16px;padding:18px 20px;margin:0 0 12px;box-shadow:0 5px 0 #0f1a33}
.q .ask{font:700 13px Inter,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--gold2);margin-bottom:6px}
.q .p{font:600 clamp(18px,2.6vw,23px)/1.4 Inter,sans-serif;color:#1B2333;padding-right:40px}
.q .p.term{font:700 clamp(26px,4.5vw,38px) "Source Serif 4",serif;color:var(--navy)}
.ch{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.ch.long{grid-template-columns:1fr}
.ch button{font:600 16px/1.35 Inter,sans-serif;text-align:left;background:#fff;border:2px solid #C9D1E3;border-radius:12px;padding:12px 14px;cursor:pointer;color:#1B2333;display:flex;gap:10px;align-items:flex-start}
.ch button .k{flex:none;width:26px;height:26px;border-radius:7px;background:var(--navy);color:var(--gold);display:flex;align-items:center;justify-content:center;font:800 13px Inter,sans-serif}
.ch button:hover:not(:disabled){border-color:var(--navy);background:#F4F6FB}
.ch button.ok{background:#E3F4E8;border-color:var(--green)}.ch button.no{background:#FDECEA;border-color:var(--red);text-decoration:line-through}
.ch button.glow{animation:glow 1s ease-in-out infinite;border-color:var(--green)}@keyframes glow{50%{box-shadow:0 0 0 6px rgba(21,128,61,.2)}}
.fb{min-height:24px;margin:10px 0;font:600 15px/1.45 Inter,sans-serif}.fb.ok{color:var(--green)}.fb.no{color:var(--red)}
.pop{position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);font:900 clamp(26px,5vw,44px) Inter,sans-serif;color:var(--gold);text-shadow:3px 3px 0 var(--navy);pointer-events:none;opacity:0;z-index:50}
.sf{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;line-height:1.1;font-size:.9em;margin:0 1px}.sf>span:first-child{border-bottom:1.5px solid currentColor;padding:0 2px}.sf>span:last-child{padding:0 2px}
.empty{padding:20px;text-align:center;color:var(--muted)}
@media (max-width:600px){.ch{grid-template-columns:1fr}.hud b{font-size:18px}.acts button{min-width:0;flex:1}}
@media (prefers-reduced-motion:reduce){.card{transition:none}.ch button.glow{animation:none}}
</style>
<script src="../brand.js"></script>
<script src="../tracker-config.js"></script>
<script src="../arcade-send.js" data-game="Vocab Blitz" data-unit="all"></script>
</head>
<body>
<script src="../site-bar.js"></script>
<div class="vf">
  <a href="vocabulary.html" class="back-link">← Vocabulary Glossary</a>
  <h1>Vocab Flashcards &amp; Blitz</h1>
  <p class="sub">Learn the words with flashcards. Then test yourself in the Blitz and beat your best score.</p>
  <div class="tabs" role="tablist"><button class="on" data-m="cards">📇 Flashcards</button><button data-m="blitz">⚡ Vocab Blitz</button></div>
  <div class="chips" id="chips"></div>
  <div id="view"></div>
</div>
<div class="pop" id="pop"></div>
<script>
var CARDS = __CARDS__, UNITS = __UNITS__;
(function () {
  'use strict';
  var NAME = { u1: 'U1', u2: 'U2', u3: 'U3', u4: 'U4', u5: 'U5', u6: 'U6', u7: 'U7', u8: 'U8', vol: 'Vol' };
  var LONG = { u1: 'Unit 1', u2: 'Unit 2', u3: 'Unit 3', u4: 'Unit 4', u5: 'Unit 5', u6: 'Unit 6', u7: 'Unit 7', u8: 'Unit 8', vol: 'Volume' };
  function $(s, r) { return (r || document).querySelector(s); }
  function get(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function put(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function plain(h) { var d = document.createElement('div'); d.innerHTML = String(h).replace(/<span class="sf"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/g, '$1/$2'); return d.textContent; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function say(t) { try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(t.replace(/√/g, 'square root of ').replace(/≤/g, ' less than or equal to ').replace(/≥/g, ' greater than or equal to ').replace(/π/g, 'pi').replace(/²/g, ' squared').replace(/³/g, ' cubed').replace(/×/g, ' times ').replace(/≠/g, ' not equal to ')); u.rate = .95; speechSynthesis.speak(u); } catch (e) {} }
  function pop(t) { var p = $('#pop'); p.textContent = t; try { p.animate([{ opacity: 0, transform: 'translate(-50%,-30%) scale(.6)' }, { opacity: 1, transform: 'translate(-50%,-50%) scale(1.1)', offset: .3 }, { opacity: 0, transform: 'translate(-50%,-80%) scale(1)' }], { duration: 900 }); } catch (e) {} }
  function AS(fn) { try { if (window.ArcadeSend) fn(window.ArcadeSend); } catch (e) {} }

  var qu = (location.search.match(/[?&]unit=(u[1-8]|vol|all)\b/) || [])[1];   // ?unit=u3 from a unit page (Nov 18, 2026)
  var unit = qu || get('vocab-unit', 'all'), mode = /[?&]mode=blitz/.test(location.search) ? 'blitz' : 'cards', known = get('vocab-known', {});
  if (mode === 'blitz') [].forEach.call(document.querySelectorAll('.tabs button'), function (x) { x.classList.toggle('on', x.dataset.m === 'blitz'); });
  function pool() { return CARDS.filter(function (c) { return unit === 'all' || c.u === unit; }); }

  /* unit chips */
  var chips = $('#chips');
  ['all'].concat(UNITS).forEach(function (u) {
    var b = document.createElement('button'); b.type = 'button'; b.dataset.u = u; b.textContent = u === 'all' ? 'All units' : NAME[u];
    b.onclick = function () { unit = u; put('vocab-unit', u); paintChips(); start(); }; chips.appendChild(b);
  });
  function paintChips() { [].forEach.call(chips.children, function (b) { b.classList.toggle('on', b.dataset.u === unit); }); }
  [].forEach.call(document.querySelectorAll('.tabs button'), function (b) {
    b.onclick = function () { mode = b.dataset.m; [].forEach.call(document.querySelectorAll('.tabs button'), function (x) { x.classList.toggle('on', x === b); }); start(); };
  });

  /* ---------------- flashcards ---------------- */
  var deck = [], total = 0, cur = null, flipped = false, focusList = null;
  function startCards(list) {
    var p = list || pool(); focusList = list || null;
    deck = shuffle(p); total = deck.length; drawCard();
  }
  function drawCard() {
    var v = $('#view');
    if (!total) { v.innerHTML = '<div class="empty">No words in this unit yet.</div>'; return; }
    if (!deck.length) {
      v.innerHTML = '<div class="done"><h2>Deck complete! 🎉</h2><p>You marked all ' + total + ' words “Got it.”</p>' +
        '<div class="acts" style="margin-top:12px"><button class="go" id="again">↻ Shuffle and go again</button><button class="go" id="toBlitz">⚡ Try the Vocab Blitz</button></div></div>';
      $('#again').onclick = function () { startCards(focusList); }; $('#toBlitz').onclick = function () { document.querySelector('.tabs button[data-m=blitz]').click(); };
      pop('DECK DONE!'); return;
    }
    cur = deck[0]; flipped = false;
    var got = total - deck.length;
    v.innerHTML = '<div class="bar"><span>' + got + ' of ' + total + ' got it</span><div class="track"><i style="width:' + Math.round(100 * got / total) + '%"></i></div><span>' + Object.keys(known).length + ' known overall</span></div>' +
      '<div class="stage"><div class="card" id="card" role="button" tabindex="0" aria-label="Flashcard. Press Space to flip.">' +
      '<div class="face front"><span class="utag">' + LONG[cur.u] + '</span><button class="say" type="button" title="Read it">🔊</button><div class="term">' + cur.t + '</div><div class="tap">Say what it means. Then tap to flip.</div></div>' +
      '<div class="face back"><span class="utag">' + LONG[cur.u] + '</span><button class="say" type="button" title="Read it">🔊</button><div class="bt">' + cur.t + '</div><div class="def">' + cur.d + '</div>' +
      (cur.v ? '<div class="vis">📌 ' + cur.v + '</div>' : '') + (cur.x ? '<div class="ex">💡 ' + cur.x + '</div>' : '') + '</div></div></div>' +
      '<div class="acts"><button class="b-learn" id="learn" type="button">↺ Still learning</button><button class="b-flip" id="flipB" type="button">Flip</button><button class="b-got" id="got" type="button">✓ Got it!</button></div>' +
      '<div class="hint">Space = flip · ← still learning · → got it</div>';
    var card = $('#card');
    card.onclick = function (e) { if (e.target.closest('.say')) return; flip(); };
    [].forEach.call(card.querySelectorAll('.say'), function (b) { b.onclick = function (e) { e.stopPropagation(); say(flipped ? cur.t + '. ' + plain(cur.d) : cur.t); }; });
    $('#flipB').onclick = flip; $('#learn').onclick = learning; $('#got').onclick = gotIt;
  }
  function flip() { flipped = !flipped; $('#card').classList.toggle('flip', flipped); }
  function learning() { var c = deck.shift(); deck.splice(Math.min(deck.length, 3), 0, c); delete known[c.t]; put('vocab-known', known); drawCard(); }
  function gotIt() { var c = deck.shift(); known[c.t] = 1; put('vocab-known', known); AS(function (A) { A.answer(true); }); drawCard(); }

  /* ---------------- blitz ---------------- */
  var B = null, tmr = null;
  var MASK_SKIP = { number: 1, numbers: 1, angle: 1, angles: 1, line: 1, data: 1, the: 1, of: 1, a: 1 };
  function mask(text, term) {   // hide the word itself inside its own definition
    var out = text, words = [term].concat(term.split(/[\s-]+/).filter(function (w) { return w.length > 3 && !MASK_SKIP[w.toLowerCase()]; }));
    words.forEach(function (w) { var stem = w.replace(/(s|es)$/i, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); out = out.replace(new RegExp('\\b' + stem + '\\w*', 'gi'), '____'); });
    return out;
  }
  function others(c, n) {
    var same = shuffle(CARDS.filter(function (o) { return o !== c && o.u === c.u; })), rest = shuffle(CARDS.filter(function (o) { return o !== c && o.u !== c.u; }));
    return same.concat(rest).slice(0, n);
  }
  function startBlitz(list) {
    var p = shuffle(list || pool());
    if (p.length < 4) p = shuffle(CARDS);
    B = { qs: p.slice(0, Math.min(10, p.length)), i: 0, score: 0, streak: 0, best: 0, right: 0, missed: [], tries: 0 };
    nextQ();
  }
  function nextQ() {
    clearInterval(tmr);
    var v = $('#view');
    if (B.i >= B.qs.length) return endBlitz();
    var c = B.qs[B.i], dir = Math.random() < .55 ? 'def' : 'term';
    var opts = shuffle([c].concat(others(c, 3)));
    B.c = c; B.dir = dir; B.miss = 0; B.t0 = Date.now();
    var prompt = dir === 'def' ? '<div class="ask">Which word matches?</div><div class="p">' + mask(plain(c.d), c.t) + '</div>'
                               : '<div class="ask">What does this word mean?</div><div class="p term">' + c.t + '</div>';
    var long = dir === 'term';
    v.innerHTML = '<div class="hud"><div>Question<b>' + (B.i + 1) + '/' + B.qs.length + '</b></div><div>Score<b>' + B.score + '</b></div><div>Streak<b>🔥' + B.streak + '</b></div><div>Best<b>' + get('vocab-best', 0) + '</b></div></div>' +
      '<div class="timer"><i id="tm"></i></div><div class="q"><span class="utag" style="position:static;display:inline-block;margin-bottom:8px">' + LONG[c.u] + '</span><button class="say" type="button" style="color:#1E2D4F;background:#EEF2FA">🔊</button>' + prompt + '</div>' +
      '<div class="ch' + (long ? ' long' : '') + '" id="ch">' + opts.map(function (o, k) {
        var txt = dir === 'def' ? o.t : mask(plain(o.d), o.t);
        return '<button type="button" data-t="' + esc(o.t) + '"><span class="k">' + (k + 1) + '</span><span>' + esc(txt) + '</span></button>'; }).join('') + '</div>' +
      '<div class="fb" id="fb"></div><div class="acts"><button class="go" id="nx" type="button" hidden>Next →</button></div>';
    $('.q .say').onclick = function () { say(dir === 'def' ? plain($('.q .p').textContent) : c.t); };
    [].forEach.call($('#ch').children, function (b) { b.onclick = function () { pick(b); }; });
    $('#nx').onclick = function () { B.i++; nextQ(); };
    var tm = $('#tm'), T = 15000; tm.style.transition = 'none'; tm.style.width = '100%'; void tm.offsetWidth; tm.style.transition = 'width ' + T + 'ms linear'; tm.style.width = '0%';
  }
  function pick(b) {
    if (b.disabled) return;
    var c = B.c, ok = b.dataset.t === c.t, fb = $('#fb');
    var first = !B.miss;
    if (first) { B.tries++; AS(function (A) { A.answer(ok); }); }
    if (ok) {
      [].forEach.call($('#ch').children, function (x) { x.disabled = true; });
      b.classList.add('ok'); b.classList.remove('glow');
      if (first) {
        var secs = (Date.now() - B.t0) / 1000, bonus = Math.max(0, Math.round(50 * (1 - secs / 15)));
        B.streak++; B.best = Math.max(B.best, B.streak); B.right++;
        var pts = 100 + bonus + (B.streak >= 3 ? 25 * Math.min(B.streak - 2, 4) : 0); B.score += pts;
        fb.className = 'fb ok'; fb.innerHTML = '✓ Yes! <b>' + c.t + '</b>. +' + pts + (bonus ? ' (speed bonus +' + bonus + ')' : '');
        if (B.streak >= 3) pop(B.streak + ' IN A ROW!');
      } else { fb.className = 'fb ok'; fb.innerHTML = '✓ That’s it: <b>' + c.t + '</b>. (Points are for first tries.)'; }
      known[c.t] = 1; put('vocab-known', known);
      $('#nx').hidden = false; $('#nx').focus();
    } else {
      B.miss++; B.streak = 0; b.classList.add('no'); b.disabled = true;
      if (B.missed.indexOf(c) < 0) B.missed.push(c);
      var o = CARDS.filter(function (x) { return x.t === b.dataset.t; })[0];
      fb.className = 'fb no';
      fb.innerHTML = '✗ Not this one. <b>' + o.t + '</b> means: ' + plain(o.d) + (B.miss >= 2 ? ' <br>The right answer is glowing.' : ' Try again.');
      if (B.miss >= 2) [].forEach.call($('#ch').children, function (x) { if (x.dataset.t === c.t) x.classList.add('glow'); });
    }
  }
  function endBlitz() {
    var best = get('vocab-best', 0), nb = B.score > best; if (nb) put('vocab-best', B.score);
    AS(function (A) { A.round({ level: unit === 'all' ? 'All units' : LONG[unit], score: B.score, details: B.right + '/' + B.qs.length + ' first try, best streak ' + B.best }); });
    var v = $('#view'), pct = Math.round(100 * B.right / B.qs.length);
    v.innerHTML = '<div class="done"><h2>' + (pct >= 90 ? 'Vocab Champion! 🏆' : pct >= 70 ? 'Nice work! ⭐' : 'Good practice! 💪') + '</h2>' +
      '<div class="big">' + B.score + '</div><p>' + B.right + ' of ' + B.qs.length + ' right on the first try · best streak 🔥' + B.best + (nb ? ' · <b>New best!</b>' : '') + '</p>' +
      (B.missed.length ? '<p><b>Words to study:</b></p><ul>' + B.missed.map(function (c) { return '<li><b>' + c.t + '</b>: ' + plain(c.d) + '</li>'; }).join('') + '</ul>' : '<p>You did not miss any words!</p>') +
      '<div class="acts" style="margin-top:12px">' + (B.missed.length ? '<button class="go" id="study">📇 Study these as flashcards</button>' : '') +
      '<button class="go" id="again">⚡ Play again</button></div></div>';
    if (nb) pop('NEW BEST!');
    var miss = B.missed.slice();
    if ($('#study')) $('#study').onclick = function () { mode = 'cards'; [].forEach.call(document.querySelectorAll('.tabs button'), function (x) { x.classList.toggle('on', x.dataset.m === 'cards'); }); startCards(miss); };
    $('#again').onclick = function () { startBlitz(); };
  }

  function start() { paintChips(); if (mode === 'cards') startCards(); else startBlitz(); }
  document.addEventListener('keydown', function (e) {
    if (/INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName || '')) return;
    if (mode === 'cards' && $('#card')) {
      if (e.key === ' ') { e.preventDefault(); flip(); }
      else if (e.key === 'ArrowLeft') learning(); else if (e.key === 'ArrowRight') gotIt();
    } else if (mode === 'blitz' && $('#ch')) {
      var n = +e.key; if (n >= 1 && n <= 4) { var b = $('#ch').children[n - 1]; if (b) pick(b); }
      else if (e.key === 'Enter' && !$('#nx').hidden) $('#nx').click();
    }
  });
  if (/[?&]debug/.test(location.search)) window.__VF = { get B() { return B; }, cards: CARDS, mask: mask, start: start };
  start();
})();
</script>
</body>
</html>
'''
out = PAGE.replace('__CARDS__', json.dumps(cards, ensure_ascii=False)).replace('__UNITS__', json.dumps(UNITS))
open(os.path.join(ROOT, 'grade8', 'vocab-flashcards.html'), 'w', encoding='utf-8').write(out)
print('ok', len(cards), 'words', UNITS)
