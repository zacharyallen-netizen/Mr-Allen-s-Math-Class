/* Skill Builders engine (Mr. Allen's Math Class, Nov 2026).
   Mini-lessons and practice sets for the Score 3 (core) skills of Units 1–8.

   A unit file (grade8/skills/uN.js) calls SB.unit({ n, title, std, lessons: [...], practice: [...] }).
   The page shell has <div id="sb" data-unit="N" data-mode="lessons|practice"></div>.

   Lesson  = { id, title, std, anim, big, words, more, watch, walk, checks, can }
             Each lesson is a short run of screens, one at a time:
             Watch (animation) → Learn → Check 1 → Walk through (one step at a time) → Check 2, 3 → Wrap up.
   Question = { id, q, fig, ch | ans, unit, hint, miss, steps, sol, ok, keep, wide }
             ch: [right, wrong, wrong, ...]; a wrong one is [text, what the mistake is, a question that steers]
             (the page shuffles the order the same way every time; keep:1 keeps it as written).
             ans: a number; miss: [[number, mistake note, steering question], ...].
   Help ladder (no loops): 1st miss = the mistake is named + a steering question.
             2nd miss = "Let's work through it together": the steps, one at a time (each step has its own ladder:
             named mistake → the good next move is shown → "Show me this step", which is recorded for Mr. Allen).
             3rd miss with no steps = "Show me". Every problem has a Hint. A wrong choice cannot be picked twice.
   Printed copies: ?paper=1 (blank) and ?paper=1&key=1 (answer key) draw the same lessons/problems for the PDFs. */
(function () {
  'use strict';
  var SB = window.SB = window.SB || {};
  var QS = new URLSearchParams(location.search);
  var PAPER = QS.get('paper') === '1', KEY = QS.get('key') === '1';
  SB.units = SB.units || {};
  SB.unit = function (spec) { SB.units[spec.n] = spec; };
  SB.PAPER = PAPER; SB.KEY = KEY;

  /* ---------- small helpers ---------- */
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function button(txt, cls) { var b = el('button', cls || 'btn', txt); b.type = 'button'; return b; }
  function hash(s) { var x = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; }
  function shuffle(a, seed) { a = a.slice(); var r = hash(seed) || 1; for (var i = a.length - 1; i > 0; i--) { r = Math.imul(r ^ (r >>> 15), 2246822519) >>> 0; var j = r % (i + 1); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function plain(html) { var d = document.createElement('div'); d.innerHTML = html; return (d.textContent || '').replace(/\s+/g, ' ').trim(); }
  SB.el = el;

  /* ---------- numbers students type ---------- */
  SB.num = function (s) {
    s = String(s == null ? '' : s).trim().replace(/[−–—]/g, '-').replace(/\s+/g, ' ');
    s = s.replace(/^[a-z]\s*=\s*/i, '').replace(/(\d),(\d{3})\b/g, '$1$2').replace(/\s*(°|degrees?|%|units?|feet|ft|inches|in|cm|m|miles?|mi|seconds?|sec|s|dollars?)\.?$/i, '').replace(/^\$/, '').trim();
    if (!s) return NaN;
    var m;
    if ((m = s.match(/^(-?)(\d+) (\d+)\/(\d+)$/))) return (m[1] ? -1 : 1) * (+m[2] + m[3] / m[4]);
    if ((m = s.match(/^(-?\d*\.?\d+)\/(-?\d*\.?\d+)$/))) return m[2] == 0 ? NaN : m[1] / m[2];
    if (/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return parseFloat(s);
    return NaN;
  };
  function same(a, b, tol) { return Math.abs(a - b) <= (tol || 1e-9) + 1e-12; }

  /* ---------- choices ---------- */
  function norm(q) {
    return (q.ch || []).map(function (c, i) {
      if (typeof c === 'string') return { t: c, right: i === 0 };
      return { t: c[0], right: i === 0, note: c[1] || '', ask: c[2] || '' };
    });
  }
  function order(q, seed) { var c = norm(q); return q.keep ? c : shuffle(c, seed || q.id); }
  SB.order = order;

  /* ---------- lined-up work (equations use the site's step-by-step layout, grade8/step-work.js) ---------- */
  function workHtml(lines) {
    var out = '', run = [];
    function flush() {
      if (!run.length) return;
      var done = false;
      if (window.StepWork && StepWork.alignTrail && StepWork._t && StepWork._t.parseEq) {
        try {
          var v = run[0].v || 'x';
          out += StepWork.alignTrail(run.map(function (r) { return { e: StepWork._t.parseEq(r.eq), label: r.lab || '' }; }), v); done = true;
        } catch (e) { done = false; }
      }
      if (!done) out += '<ol class="work">' + run.map(function (r) { return '<li>' + (r.lab ? '<span class="lab">' + r.lab + '</span>' : '') + '<span class="ln">' + r.eq.replace(/-/g, '−') + '</span></li>'; }).join('') + '</ol>';
      run = [];
    }
    var list = '';
    lines.forEach(function (l) {
      if (l && typeof l === 'object' && l.eq) { if (list) { out += '<ol class="work">' + list + '</ol>'; list = ''; } run.push(l); return; }
      flush();
      var t = typeof l === 'string' ? { ln: l } : l;
      list += '<li>' + (t.ln ? '<span class="ln">' + t.ln + '</span>' : '') + (t.lab ? '<span class="lab">' + t.lab + '</span>' : '') + '</li>';
    });
    flush(); if (list) out += '<ol class="work">' + list + '</ol>';
    return out;
  }
  SB.workHtml = workHtml;

  /* =====================================================================
     ANIMATION PLAYER: an SVG with ids + frames that change them (opacity, move, draw, color, text)
     frame = { cap: 'caption html', set: { id: { o, t, d, fill, stroke, txt, '@attr': v } }, dur }
     ===================================================================== */
  function applySet(svg, set) {
    Object.keys(set || {}).forEach(function (id) {
      var e = svg.querySelector('#' + id); if (!e) return; var p = set[id];
      Object.keys(p).forEach(function (k) {
        var v = p[k];
        if (k === 'o') e.style.opacity = v;
        else if (k === 't') e.style.transform = v;
        else if (k === 'd') e.style.strokeDashoffset = v ? 0 : 1;
        else if (k === 'fill') { e.style.fill = v; }
        else if (k === 'stroke') e.style.stroke = v;
        else if (k === 'txt') e.textContent = v;
        else if (k === 'html') e.innerHTML = v;
        else if (k.charAt(0) === '@') e.setAttribute(k.slice(1), v);
      });
    });
  }
  function svgOf(a, pfx) {
    var s = a.svg.replace(/id="([\w-]+)"/g, 'id="' + pfx + '$1"').replace(/url\(#([\w-]+)\)/g, 'url(#' + pfx + '$1)');
    return '<svg viewBox="0 0 ' + a.w + ' ' + a.h + '" role="img" aria-label="' + (a.label || 'animation') + '" xmlns="http://www.w3.org/2000/svg" font-family="Inter,system-ui,sans-serif">' + s + '</svg>';
  }
  function prefSet(set, pfx) { var o = {}; Object.keys(set || {}).forEach(function (k) { o[pfx + k] = set[k]; }); return o; }
  var apid = 0;
  SB.finalFrame = function (a) {          // the last picture, for printed copies
    var pfx = 'pf' + (apid++) + '-', box = el('div', 'fig', svgOf(a, pfx)), svg = box.firstChild;
    a.frames.forEach(function (f) { applySet(svg, prefSet(f.set, pfx)); });
    if (a.print) applySet(svg, prefSet(a.print, pfx));
    return box;
  };
  function player(a) {
    var pfx = 'an' + (apid++) + '-', wrap = el('div', 'anim');
    var stage = el('div', 'stage'), cap = el('div', 'anim-cap'), bar = el('div', 'anim-bar');
    stage.setAttribute('aria-hidden', 'false'); cap.setAttribute('aria-live', 'polite');
    wrap.appendChild(stage); wrap.appendChild(cap); wrap.appendChild(bar);
    var play = button('▶ Play'), back = button('‹ Back', 'btn o'), next = button('Next ›', 'btn o'), again = button('↻ Replay', 'btn o'), talk = button('Narrate: off', 'btn o');
    talk.setAttribute('aria-pressed', 'false');
    var dots = el('div', 'anim-dots'); a.frames.forEach(function () { dots.appendChild(el('i')); });
    [play, back, next, again, talk].forEach(function (b) { bar.appendChild(b); }); bar.appendChild(dots);
    var k = -1, timer = null, narrate = store('sb-narrate') === 'on';
    function setTalk() { talk.textContent = 'Narrate: ' + (narrate ? 'on' : 'off'); talk.setAttribute('aria-pressed', narrate); }
    setTalk();
    function speak(t) { if (!narrate || !('speechSynthesis' in window)) return; try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(SB.say ? SB.say(t) : t); u.rate = 0.92; u.lang = 'en-US'; speechSynthesis.speak(u); } catch (e) {} }
    function reset() { stage.innerHTML = svgOf(a, pfx); }
    function show(i, animate) {
      var svg = stage.querySelector('svg');
      if (!animate) { reset(); svg = stage.querySelector('svg'); wrap.classList.add('nomo'); for (var j = 0; j <= i; j++) applySet(svg, prefSet(a.frames[j].set, pfx)); void svg.getBoundingClientRect(); wrap.classList.remove('nomo'); }
      else applySet(svg, prefSet(a.frames[i].set, pfx));
      k = i; cap.innerHTML = a.frames[i].cap || '';
      [].forEach.call(dots.children, function (d, j) { d.className = j === i ? 'on' : j < i ? 'seen' : ''; });
      back.disabled = i <= 0; next.disabled = i >= a.frames.length - 1;
      speak(plain(a.frames[i].cap || ''));
    }
    function dur(i) { var f = a.frames[i]; return f.dur || Math.max(2800, 900 + plain(f.cap || '').length * 55); }
    function stop() { clearTimeout(timer); timer = null; play.textContent = k >= a.frames.length - 1 ? '▶ Play' : '▶ Play'; }
    function tick() {
      if (k >= a.frames.length - 1) { stop(); play.textContent = '↻ Play again'; return; }
      show(k + 1, true); timer = setTimeout(tick, dur(k));
    }
    play.addEventListener('click', function () {
      if (timer) { stop(); return; }
      if (k >= a.frames.length - 1) { reset(); k = -1; }
      play.textContent = '❚❚ Pause'; if (k < 0) { show(0, false); timer = setTimeout(tick, dur(0)); } else tick();
    });
    back.addEventListener('click', function () { stop(); if (k > 0) show(k - 1, false); });
    next.addEventListener('click', function () { stop(); if (k < a.frames.length - 1) show(k + 1, k >= 0); });
    again.addEventListener('click', function () { stop(); reset(); k = -1; play.click(); });
    talk.addEventListener('click', function () { narrate = !narrate; store('sb-narrate', narrate ? 'on' : 'off'); setTalk(); if (!narrate) try { speechSynthesis.cancel(); } catch (e) {} else if (k >= 0) speak(plain(a.frames[k].cap || '')); });
    reset(); show(0, false);
    wrap.stop = function () { stop(); try { speechSynthesis.cancel(); } catch (e) {} };
    return wrap;
  }
  SB.player = player;

  /* =====================================================================
     GUIDED STEPS ("Let's work through it together")
     step = { q, ch: [right, [wrong, note, ask], ...], eq | ln, lab, v }
     ===================================================================== */
  function walk(host, w, o) {
    o = o || {};
    var box = el('div', 'walk'); host.appendChild(box);
    if (o.title !== false) box.appendChild(el('div', 'wh', o.title || 'Let’s work through it together, one step at a time.'));
    if (w.prob) box.appendChild(el('div', 'wprob', w.prob));
    if (w.fig) box.appendChild(el('div', 'fig', w.fig));
    var lines = (w.start || []).slice(), work = el('div', 'wwork'), area = el('div');
    box.appendChild(work); box.appendChild(area);
    function draw() { work.innerHTML = workHtml(lines); }
    draw();
    var i = 0;
    function stepAt() {
      area.innerHTML = '';
      if (i >= w.steps.length) {
        area.appendChild(el('div', 'wdone', w.done || o.done || '✓ You worked through every step.'));
        if (o.onDone) o.onDone();
        return;
      }
      var s = w.steps[i], misses = 0;
      area.appendChild(el('div', 'wq', '<span class="sb-std">Step ' + (i + 1) + ' of ' + w.steps.length + '</span><br>' + s.q));
      var chs = el('div', 'chs' + (s.wide ? ' wide' : '')), fb = el('div', 'fb'), coach = el('div', 'coach'); coach.hidden = true;
      area.appendChild(chs); area.appendChild(fb); area.appendChild(coach);
      var list = order(s, (o.seed || '') + 'w' + i), rightBtn = null;
      function finish(helped) {
        [].forEach.call(chs.children, function (b) { b.disabled = true; });
        rightBtn.classList.add('right'); rightBtn.classList.remove('glow');
        fb.className = 'fb ok show'; fb.innerHTML = '<span class="h">' + (helped ? 'Here is the move.' : '✓ Yes.') + '</span>' + (s.why || '');
        if (s.eq || s.ln) lines.push(s.eq ? { eq: s.eq, lab: s.lab, v: s.v } : { ln: s.ln, lab: s.lab });
        draw();
        var nx = button(i + 1 < w.steps.length ? 'Next step →' : 'Finish →'); nx.style.marginTop = '8px';
        nx.addEventListener('click', function () { i++; stepAt(); var f = area.querySelector('button'); if (f) try { f.focus({ preventScroll: true }); } catch (e) {} });
        area.appendChild(nx);
      }
      list.forEach(function (c, j) {
        var b = button('<span class="L">' + 'ABCDEF'[j] + '</span><span>' + c.t + '</span>', 'ch');
        if (c.right) rightBtn = b;
        b.addEventListener('click', function () {
          if (b.disabled) return;
          if (c.right) { finish(false); return; }
          misses++; b.disabled = true; b.classList.add('wrong');
          fb.className = 'fb no show';
          fb.innerHTML = '<span class="h">Not this one.</span>' + (c.note || 'That move does not fit this step.') + (c.ask ? '<span class="ask">' + c.ask + '</span>' : '');
          if (misses >= 2) {
            coach.hidden = false; rightBtn.classList.add('glow');
            coach.innerHTML = '<b>Here is a good next move:</b> ' + list.filter(function (x) { return x.right; })[0].t + '. Tap it to keep going.';
            if (!coach.querySelector('button')) {
              var sm = button('Show me this step', 'btn g'); sm.style.marginTop = '6px';
              sm.addEventListener('click', function () { box.setAttribute('data-sw-helped', '1'); if (o.onHelp) o.onHelp(); finish(true); coach.hidden = true; });
              coach.appendChild(el('br')); coach.appendChild(sm);
            }
          }
        });
        chs.appendChild(b);
      });
    }
    stepAt();
    return box;
  }
  SB.walk = walk;

  /* =====================================================================
     ONE QUESTION (checks inside a lesson, and practice problems)
     ===================================================================== */
  function record(rid, ok, q, label) { if (window.ScoreSend) ScoreSend.record(rid, ok, { std: q.std || SB.std, band: 3, label: label }); }
  function solHtml(q) {
    if (!q.sol) return '';
    return workHtml(q.sol);
  }
  function qCard(q, o) {
    o = o || {};
    var rid = o.rid || q.id, card = el('div', 'q-card'); card.dataset.qid = rid;
    var top = el('div', 'q-top', '<span class="lbl">' + (o.label || '') + '</span><span class="sb-pill">Score 3</span><span class="sb-std">' + (q.std || SB.std || '') + '</span>');
    card.appendChild(top);
    card.appendChild(el('div', 'q-text', q.q));
    if (q.fig) card.appendChild(el('div', 'fig', q.fig));
    var tries = 0, misses = 0, solved = false, walked = false, helped = false, seen = {};
    var fb = el('div', 'fb'), tools = el('div', 'q-tools'), extra = el('div'), coach = el('div', 'coach'); coach.hidden = true;
    var choiceBtns = [], input = null, list = null;
    function mark() { card.dataset.done = '1'; if (o.onAnswer) o.onAnswer(solved); }
    function lock() { choiceBtns.forEach(function (b) { b.disabled = true; }); if (input) { input.disabled = true; card.querySelector('.numrow .btn').disabled = true; } }
    function right(given) {
      tries++; solved = true; record(rid, true, q, o.label); lock(); coach.hidden = true;
      fb.className = 'fb ok show';
      fb.innerHTML = '<span class="h">✓ Correct' + (tries === 1 ? '.' : ' — you fixed it.') + '</span>' + (q.ok || '') + (q.sol ? '<div class="sb-sol"><div class="t">The work</div>' + solHtml(q) + '</div>' : '');
      if (walked) { var wk = extra.querySelector('.walk'); if (wk) wk.hidden = true; }
      mark();
    }
    function wrong(given, note, ask) {
      tries++; misses++; record(rid, false, q, o.label);
      var again = seen[given]; seen[given] = 1;
      fb.className = 'fb no show';
      fb.innerHTML = '<span class="h">Not yet.</span>' + (again ? 'You tried this same answer before. ' : '') + (note || 'Check each step again.') + (ask ? '<span class="ask">' + ask + '</span>' : '');
      if (misses >= 2 && q.steps && !walked) {
        walked = true;
        fb.innerHTML += '<div style="margin-top:6px"><b>Let’s work through it together.</b> Answer one small step at a time below.</div>';
        walk(extra, { steps: q.steps, start: q.start, done: '✓ You worked through every step. Now answer the problem above.' },
          { seed: rid, title: 'Step by step', onHelp: function () { helped = true; card.setAttribute('data-sw-helped', '1'); } });
      } else if (misses >= 2 && !q.steps) {
        coach.hidden = false; coach.innerHTML = '<b>Here is a good first move:</b> ' + (q.hint2 || q.hint || 'Look at the worked example in the lesson.');
      }
      if ((misses >= 3 || (walked && misses >= 3)) && !card.querySelector('.showme')) {
        var sm = button('Show me the answer', 'btn g showme'); tools.appendChild(sm);
        sm.addEventListener('click', function () {
          helped = true; card.setAttribute('data-sw-helped', '1'); sm.remove();
          coach.hidden = false;
          if (list) { var rb = choiceBtns[list.findIndex(function (c) { return c.right; })]; rb.classList.add('glow'); coach.innerHTML = '<b>The answer is ' + 'ABCDEF'[list.findIndex(function (c) { return c.right; })] + ':</b> ' + list.filter(function (c) { return c.right; })[0].t + '. Tap it, then read the work.'; }
          else { input.value = q.show || q.ans; coach.innerHTML = '<b>The answer is ' + (q.show || q.ans) + (q.unit || '') + '.</b> Press Check, then read the work.'; }
        });
      }
    }
    if (q.ch) {
      list = order(q, rid);
      var chs = el('div', 'chs' + (q.wide ? ' wide' : ''));
      list.forEach(function (c, j) {
        var b = button('<span class="L">' + 'ABCDEF'[j] + '</span><span>' + c.t + '</span>', 'ch');
        b.addEventListener('click', function () {
          if (b.disabled || solved) return;
          if (c.right) { b.classList.add('right'); b.classList.remove('glow'); right(c.t); }
          else { b.classList.add('wrong'); b.disabled = true; wrong(c.t, c.note, c.ask); }
          mark();
        });
        choiceBtns.push(b); chs.appendChild(b);
      });
      card.appendChild(chs);
    } else {
      var row = el('div', 'numrow'), id = 'in-' + rid;
      var lab = el('label', 'sb-std', 'Your answer'); lab.htmlFor = id; lab.style.width = '100%';
      input = el('input', 'sb-in'); input.id = id; input.type = 'text'; input.inputMode = q.neg ? 'text' : 'decimal'; input.autocomplete = 'off'; input.setAttribute('spellcheck', 'false');
      var go = button('Check');
      row.appendChild(lab); row.appendChild(input); if (q.unit) row.appendChild(el('span', 'unit', q.unit)); row.appendChild(go);
      card.appendChild(row);
      var check = function () {
        if (solved) return;
        var v = SB.num(input.value);
        if (!input.value.trim()) { fb.className = 'fb tip show'; fb.innerHTML = '<span class="h">Type a number first.</span>'; return; }
        if (isNaN(v)) { fb.className = 'fb tip show'; fb.innerHTML = '<span class="h">Type just a number.</span>Use digits, a minus sign, a decimal point or a fraction like 3/4.'; return; }
        if (same(v, q.ans, q.tol)) { right(String(v)); mark(); return; }
        var m = (q.miss || []).filter(function (x) { return same(v, x[0], q.tol); })[0];
        if (m) wrong(String(v), m[1], m[2]);
        else if (q.ans !== 0 && same(v, -q.ans, q.tol)) wrong(String(v), 'Your number has the wrong sign.', 'Should the answer be positive or negative? Look at the signs again.');
        else wrong(String(v), q.why || 'That number does not match.', q.ask || '');
        mark();
      };
      go.addEventListener('click', check);
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); check(); } });
    }
    var hb = button('Hint', 'btn o'); tools.appendChild(hb);
    hb.addEventListener('click', function () { fb.className = 'fb tip show'; fb.innerHTML = '<span class="h">Hint</span>' + (q.hint || 'Look back at the lesson example.'); });
    card.appendChild(tools); card.appendChild(fb); card.appendChild(coach); card.appendChild(extra);
    card.answered = function () { return card.dataset.done === '1'; };
    card.solved = function () { return solved; };
    card.tries = function () { return tries; };
    return card;
  }
  SB.qCard = qCard;

  /* =====================================================================
     LESSONS PAGE
     ===================================================================== */
  function slidesOf(L) {
    var s = [{ k: 'watch', t: 'Watch' }, { k: 'learn', t: 'Learn' }];
    var c = L.checks || [];
    if (c[0]) s.push({ k: 'check', i: 0, t: 'Check 1' });
    if (L.walk) s.push({ k: 'walk', t: 'Walk through' });
    for (var i = 1; i < c.length; i++) s.push({ k: 'check', i: i, t: 'Check ' + (i + 1) });
    s.push({ k: 'wrap', t: 'Wrap up' });
    return s;
  }
  function learnHtml(L) {
    var h = '<div class="big">' + L.big + '</div>';
    if (L.words && L.words.length) h += '<div class="words">' + L.words.map(function (w) { return '<div class="word"><b>' + w[0] + '</b><span>' + w[1] + '</span></div>'; }).join('') + '</div>';
    if (L.more) h += '<div class="learn-more">' + L.more + '</div>';
    if (L.watch) h += '<div class="watch-out"><b>Watch out:</b> ' + L.watch + '</div>';
    return h;
  }
  function lessonsPage(root, U) {
    var KEYL = 'sb-u' + U.n + '-at', at = (store(KEYL) || '0:0').split(':').map(Number);
    var li = Math.min(at[0] || 0, U.lessons.length - 1), si = at[1] || 0;
    var chooser = el('div', 'sb-lessons'); root.appendChild(chooser);
    var card = el('div', 'sb-card'); root.appendChild(card);
    var cards = {};            // check cards stay alive across screens (answers are kept)
    var allChecks = [];
    U.lessons.forEach(function (L, a) { (L.checks || []).forEach(function (q, i) {
      var c = qCard(q, { rid: 'L' + L.id + '-' + (i + 1), label: 'Lesson ' + U.n + '.' + (a + 1) + ' · Check ' + (i + 1) + ' of ' + L.checks.length, onAnswer: function () { paintChooser(); } });
      cards[L.id + ':' + i] = c; allChecks.push(c);
    }); });
    (window.__skipLists = window.__skipLists || []).push({ word: 'Check', items: function () { return allChecks; }, answered: function (c) { return c.answered(); } });
    var player0 = null;
    function lessonDone(L) { return (L.checks || []).every(function (q, i) { return cards[L.id + ':' + i].solved(); }); }
    function paintChooser() {
      chooser.innerHTML = '';
      U.lessons.forEach(function (L, a) {
        var b = button('<span class="num">' + U.n + '.' + (a + 1) + '</span><span>' + L.title + '</span>', 'sb-lbtn' + (a === li ? ' on' : '') + (lessonDone(L) ? ' done' : ''));
        b.setAttribute('aria-current', a === li ? 'true' : 'false');
        b.addEventListener('click', function () { li = a; si = 0; render(); try { card.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) {} });
        chooser.appendChild(b);
      });
    }
    function render() {
      if (player0) { player0.stop(); player0 = null; }
      store(KEYL, li + ':' + si);
      var L = U.lessons[li], S = slidesOf(L); si = Math.max(0, Math.min(si, S.length - 1));
      paintChooser();
      card.innerHTML = '';
      var t = el('div', 'sb-ltitle', '<h2>' + U.n + '.' + (li + 1) + ' ' + L.title + '</h2><span class="sb-pill">Score 3</span><span class="sb-std">' + (L.std || '') + '</span>');
      card.appendChild(t);
      var steps = el('ol', 'sb-steps'); steps.setAttribute('aria-label', 'Parts of this lesson');
      S.forEach(function (s, j) {
        var b = button(s.t, j === si ? 'on' : j < si ? 'done' : ''); b.setAttribute('aria-current', j === si ? 'step' : 'false');
        b.addEventListener('click', function () { si = j; render(); });
        var x = el('li'); x.appendChild(b); steps.appendChild(x);
      });
      card.appendChild(steps);
      var slide = el('div', 'sb-slide'), s = S[si]; card.appendChild(slide);
      if (s.k === 'watch') {
        slide.appendChild(el('h3', '', 'Watch: ' + (L.anim.title || L.title)));
        slide.appendChild(el('p', 'sb-std', 'Press Play. Use Back and Next to go at your own speed. Turn on Narrate to hear it.'));
        player0 = player(L.anim); slide.appendChild(player0);
      } else if (s.k === 'learn') {
        slide.appendChild(el('h3', '', 'Learn: the big idea'));
        slide.appendChild(el('div', '', learnHtml(L)));
        if (L.fig) slide.appendChild(el('div', 'fig', L.fig));
      } else if (s.k === 'check') {
        slide.appendChild(el('h3', '', 'Check your understanding'));
        slide.appendChild(cards[L.id + ':' + s.i]);
      } else if (s.k === 'walk') {
        slide.appendChild(el('h3', '', 'Walk through an example'));
        slide.appendChild(el('p', '', L.walk.intro || 'Pick the best move for each step. The work builds as you go.'));
        walk(slide, L.walk, { seed: 'L' + L.id, title: false, done: L.walk.done });
      } else {
        slide.appendChild(el('h3', '', 'Wrap up'));
        var done = (L.checks || []).filter(function (q, i) { return cards[L.id + ':' + i].solved(); }).length;
        slide.appendChild(el('div', 'big', '<b>You can now:</b> ' + L.can));
        if (L.recap) slide.appendChild(el('div', '', '<b>Remember the steps:</b>' + workHtml(L.recap)));
        slide.appendChild(el('p', 'sb-std', 'Checks finished in this lesson: ' + done + ' of ' + (L.checks || []).length + '. You can go back to any check.'));
        var go = li + 1 < U.lessons.length ? button('Next lesson: ' + U.lessons[li + 1].title + ' →') : el('a', 'btn', 'Go to the Practice Set →');
        if (go.tagName === 'A') { go.href = 'skill-builders-unit' + U.n + '-practice.html'; go.style.textDecoration = 'none'; go.style.display = 'inline-block'; }
        else go.addEventListener('click', function () { li++; si = 0; render(); try { card.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) {} });
        slide.appendChild(go);
      }
      var nav = el('div', 'sb-nav'), bk = button('← Back', 'btn o'), nx = button('Next →');
      bk.disabled = si === 0 && li === 0;
      nav.appendChild(bk); nav.appendChild(el('span', 'mid', 'Lesson ' + U.n + '.' + (li + 1) + ' · ' + (si + 1) + ' of ' + S.length)); nav.appendChild(nx);
      if (si === S.length - 1 && li === U.lessons.length - 1) nx.style.visibility = 'hidden';
      bk.addEventListener('click', function () { if (si > 0) si--; else if (li > 0) { li--; si = slidesOf(U.lessons[li]).length - 1; } render(); });
      nx.addEventListener('click', function () { if (si < S.length - 1) si++; else if (li + 1 < U.lessons.length) { li++; si = 0; } render(); try { card.scrollIntoView({ block: 'nearest' }); } catch (e) {} });
      card.appendChild(nav);
    }
    render();
  }

  /* =====================================================================
     PRACTICE PAGE: one problem at a time
     ===================================================================== */
  function practicePage(root, U) {
    var P = U.practice, cards = [], at = 0;
    var bar = el('div', 'pg-bar', '<div class="track"><div class="fill"></div></div><span class="cnt"></span>');
    var stage = el('div'), nav = el('div', 'sb-nav'), dots = el('div', 'pg-dots');
    root.appendChild(bar); root.appendChild(stage); root.appendChild(nav); root.appendChild(dots);
    P.forEach(function (q, i) { cards.push(qCard(q, { rid: 'P' + (i + 1), label: 'Problem ' + (i + 1) + ' of ' + P.length, onAnswer: paint })); });
    (window.__skipLists = window.__skipLists || []).push({ word: 'Problem', items: function () { return cards; }, answered: function (c) { return c.answered(); } });
    var bk = button('← Back', 'btn o'), nx = button('Next →'); nav.appendChild(bk); nav.appendChild(el('span', 'mid')); nav.appendChild(nx);
    var fin = el('div', 'sb-card fin');
    function paint() {
      var n = cards.filter(function (c) { return c.answered(); }).length;
      bar.querySelector('.fill').style.width = (100 * n / cards.length) + '%';
      bar.querySelector('.cnt').textContent = 'Answered ' + n + ' of ' + cards.length;
      dots.innerHTML = '';
      cards.forEach(function (c, i) {
        var b = button(String(i + 1), (i === at ? 'cur ' : '') + (c.solved() ? 'ok' : c.answered() ? 'tried' : ''));
        b.setAttribute('aria-label', 'Problem ' + (i + 1) + (c.solved() ? ', correct' : c.answered() ? ', tried' : ''));
        b.addEventListener('click', function () { at = i; show(); });
        dots.appendChild(b);
      });
    }
    function show() {
      stage.innerHTML = '';
      if (at >= cards.length) {
        var right = cards.filter(function (c) { return c.solved(); }).length, skipped = cards.filter(function (c) { return !c.answered(); }).length;
        fin.innerHTML = '<h3>End of the Practice Set</h3><p>You finished ' + right + ' of ' + cards.length + ' problems' + (skipped ? '. ' + skipped + ' still need an answer: tap a number below to go back.' : '.') + '</p><p>When you are ready, send your work to Mr. Allen below.</p>';
        stage.appendChild(fin); nav.querySelector('.mid').textContent = 'Finished'; nx.disabled = true; bk.disabled = false;
      } else {
        stage.appendChild(cards[at]); nav.querySelector('.mid').textContent = 'Problem ' + (at + 1) + ' of ' + cards.length;
        bk.disabled = at === 0; nx.disabled = false; nx.textContent = at === cards.length - 1 ? 'Finish →' : 'Next →';
      }
      paint();
    }
    bk.addEventListener('click', function () { if (at > 0) { at--; show(); } });
    nx.addEventListener('click', function () { at++; show(); try { root.scrollIntoView({ block: 'nearest' }); } catch (e) {} });
    show();
  }

  /* =====================================================================
     PRINTED COPIES (?paper=1, ?paper=1&key=1)
     ===================================================================== */
  function ppHead(U, what) {
    return '<div class="pp-head"><div><div class="k">Skill Builders · Unit ' + U.n + ' · Score 3</div><h1>' + U.title + ': ' + what + '</h1></div><div class="r">' + U.std + (KEY ? '<br><b style="color:#FFC107">ANSWER KEY</b>' : '') + '</div></div>' +
      (KEY ? '' : '<div class="pp-name"><span>Name</span><span>Date</span><span style="flex:.5">Period</span></div>');
  }
  function ppQ(q, n, o) {
    o = o || {};
    var h = '<div class="pp-q' + (o.full ? ' full' : '') + '"><div class="top"><span class="n">' + n + '</span><span class="sc">Score 3</span><span>' + (q.std || '') + '</span></div>';
    h += '<div>' + q.q + '</div>';
    if (q.fig) h += '<div class="fig">' + q.fig + '</div>';
    if (q.ch) {
      var list = order(q, o.rid || q.id);
      h += '<div class="pc" style="' + (q.wide ? 'grid-template-columns:1fr' : '') + '">' + list.map(function (c, j) { return '<div class="' + (KEY && c.right ? 'k' : '') + '"><span class="L">' + 'ABCDEF'[j] + '</span>' + c.t + '</div>'; }).join('') + '</div>';
    } else {
      h += '<div class="ansl">Answer:' + (KEY ? ' <span class="pp-key">' + (q.show || q.ans) + (q.unit || '') + '</span>' : '<i></i>' + (q.unit ? ' ' + q.unit : '')) + '</div>';
    }
    if (KEY && q.sol) h += '<div class="ksol">' + workHtml(q.sol) + '</div>';
    else if (!KEY && o.space) h += '<div class="work-space"></div>';
    return h + '</div>';
  }
  function paperLessons(root, U) {
    var h = '';
    U.lessons.forEach(function (L, a) {
      if (a === 0 || L.newPage) h += (a ? '</div>' : '') + '<div class="pp-sheet">' + (a === 0 ? ppHead(U, 'Mini-Lessons') : '');
      h += '<div class="pp-sec"><h2><span class="no">' + U.n + '.' + (a + 1) + '</span>' + L.title + ' <span class="sb-std">' + (L.std || '') + '</span></h2>';
      h += '<div class="big">' + L.big + '</div>';
      h += '<div class="pp-two"><div>' + (L.words && L.words.length ? '<div class="words">' + L.words.map(function (w) { return '<div class="word"><b>' + w[0] + '</b><span>' + w[1] + '</span></div>'; }).join('') + '</div>' : '') +
        (L.more ? '<div class="learn-more">' + L.more + '</div>' : '') + (L.watch ? '<div class="watch-out"><b>Watch out:</b> ' + L.watch + '</div>' : '') + '</div><div class="figslot" data-l="' + a + '"></div></div>';
      if (L.walk) {
        h += '<h3>Walk through: ' + (L.walk.prob ? '<span class="m">' + L.walk.prob + '</span>' : '') + '</h3>';
        if (L.walk.fig) h += '<div class="fig">' + L.walk.fig + '</div>';
        h += '<ol class="pp-steps">' + L.walk.steps.map(function (s, i) {
          var r = norm(s)[0].t;
          return '<li><span class="n">' + (i + 1) + '</span><span>' + s.q + (KEY ? '<br><span class="pp-key">' + r + (s.eq ? ' → <span class="m">' + s.eq.replace(/-/g, '−') + '</span>' : s.ln ? ' → ' + s.ln : '') + '</span>' : '<span class="pp-blank"></span>') + '</span></li>';
        }).join('') + '</ol>';
      }
      if (L.checks && L.checks.length) {
        h += '<h3>Check your understanding</h3><div class="pp-qgrid">' + L.checks.map(function (q, i) { return ppQ(q, i + 1, { rid: 'L' + L.id + '-' + (i + 1) }); }).join('') + '</div>';
      }
      h += '</div>';
    });
    h += '</div><div class="pp-foot">Skill Builders · Unit ' + U.n + ' · Mr. Allen’s Math Class</div>';
    root.innerHTML = h;
    [].forEach.call(root.querySelectorAll('.figslot'), function (s) { var L = U.lessons[+s.dataset.l]; s.appendChild(L.pfig ? el('div', 'fig', typeof L.pfig === 'function' ? L.pfig() : L.pfig) : SB.finalFrame(L.anim)); });
  }
  function paperPractice(root, U) {
    var h = '<div class="pp-sheet">' + ppHead(U, 'Practice Set');
    h += '<p style="margin:0 0 8px;font-size:11pt">Do one problem at a time. Show your steps. Circle the letter or write the number.</p><div class="pp-qgrid">';
    U.practice.forEach(function (q, i) { h += ppQ(q, i + 1, { rid: 'P' + (i + 1), space: !q.ch || q.space, full: q.full }); });
    h += '</div><div class="pp-foot">Skill Builders · Unit ' + U.n + ' · Practice Set' + (KEY ? ' · Answer Key' : '') + '</div></div>';
    root.innerHTML = h;
  }

  /* =====================================================================
     START
     ===================================================================== */
  function start() {
    var root = document.getElementById('sb'); if (!root) return;
    var n = +root.dataset.unit, mode = root.dataset.mode, U = SB.units[n]; if (!U) return;
    SB.std = U.std0 || '';
    if (PAPER) { document.body.classList.add('paper'); [].forEach.call(document.querySelectorAll('.noprint'), function (e) { e.remove(); }); (mode === 'practice' ? paperPractice : paperLessons)(root, U); SB.ready = true; return; }
    if (window.ScoreSend) ScoreSend.setup({ kind: 'practice', unit: String(n), page: 'Skill Builders · Unit ' + n + (mode === 'practice' ? ' · Practice Set' : ' · Mini-Lessons'), mount: '#send', std: U.std0, band: 3, noun: mode === 'practice' ? 'problem' : 'question' });
    (mode === 'practice' ? practicePage : lessonsPage)(root, U);
    SB.ready = true;
  }
  SB.start = start;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(start, 0); });
  else setTimeout(start, 0);
})();
