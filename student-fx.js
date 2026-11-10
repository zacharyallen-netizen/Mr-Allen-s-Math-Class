/* STUDENT FX (Nov 10, 2026, Mr. Allen's request) — the same feel on every practice question:
   - border flash: green = right, yellow = careful (no answer / format / almost), red = try again
   - soft, short sounds (Sound on/off at the bottom of the page, remembered on this device)
   - matching buttons: Check (navy), Hint / How (outline), Show answer (gold outline)
   Loaded by one-at-a-time.js, notes-flow.js and step-work.js (and a script tag on a few review pages).
   It only watches: right/wrong comes from ScoreSend.record() and from the feedback classes each page already sets.
   Nothing here changes checking, scoring or sending. ?paper=1, ?key=1 and print: no effects. */
(function () {
  if (window.FX) return;
  var FX = window.FX = {}, OFF = /[?&](paper|key)=1\b/.test(location.search);
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------- look ---------- */
  var css = '' +
    '@keyframes fxok{0%{box-shadow:0 0 0 0 rgba(21,128,61,0)}20%{box-shadow:0 0 0 5px rgba(21,128,61,.85)}70%{box-shadow:0 0 0 4px rgba(21,128,61,.45)}100%{box-shadow:0 0 0 0 rgba(21,128,61,0)}}' +
    '@keyframes fxwarn{0%{box-shadow:0 0 0 0 rgba(224,168,0,0)}20%{box-shadow:0 0 0 5px rgba(224,168,0,.9)}70%{box-shadow:0 0 0 4px rgba(224,168,0,.5)}100%{box-shadow:0 0 0 0 rgba(224,168,0,0)}}' +
    '@keyframes fxno{0%{box-shadow:0 0 0 0 rgba(180,35,24,0)}20%{box-shadow:0 0 0 5px rgba(180,35,24,.8)}70%{box-shadow:0 0 0 4px rgba(180,35,24,.4)}100%{box-shadow:0 0 0 0 rgba(180,35,24,0)}}' +
    '.fx-ok{animation:fxok 1s ease-out}.fx-warn{animation:fxwarn 1s ease-out}.fx-no{animation:fxno 1s ease-out}' +
    '@media (prefers-reduced-motion:reduce){.fx-ok{animation:none;outline:3px solid #15803D}.fx-warn{animation:none;outline:3px solid #E0A800}.fx-no{animation:none;outline:3px solid #B42318}}' +
    '.fx-b1,.fx-b2,.fx-b3{font:600 14.5px/1.2 Inter,system-ui,sans-serif!important;border-radius:8px!important;padding:8px 16px!important;min-height:38px;cursor:pointer;letter-spacing:0!important;text-transform:none!important;box-shadow:none!important}' +
    '.fx-b1{background:#1E2D4F!important;color:#fff!important;border:1.5px solid #1E2D4F!important}.fx-b1:hover:not(:disabled){background:#2A3D66!important}' +
    '.fx-b2{background:#fff!important;color:#1E2D4F!important;border:1.5px solid #1E2D4F!important}.fx-b2:hover:not(:disabled){background:#EEF1F7!important}' +
    '.fx-b3{background:#fff!important;color:#8A6100!important;border:1.5px solid #E0A800!important}.fx-b3:hover:not(:disabled){background:#FFF6DB!important}' +
    '.fx-b1:disabled,.fx-b2:disabled,.fx-b3:disabled{opacity:.5;cursor:default}' +
    '.fx-foot{max-width:900px;margin:28px auto 18px;padding:0 16px;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;font:500 13px Inter,system-ui,sans-serif}' +
    '.fx-foot>button{font:600 12.5px Inter,system-ui,sans-serif;color:#5B6475;background:#fff;border:1px solid #D5D9E0;border-radius:999px;padding:5px 12px;cursor:pointer}' +
    '@keyframes fxpop{0%{opacity:0;transform:translate(-50%,-14px) scale(.9)}12%{opacity:1;transform:translate(-50%,0) scale(1.04)}20%{transform:translate(-50%,0) scale(1)}85%{opacity:1}100%{opacity:0}}' +
    '.fx-toast{position:fixed;left:50%;top:76px;z-index:9999;transform:translateX(-50%);background:#1E2D4F;color:#FFC107;font:700 17px Inter,system-ui,sans-serif;padding:10px 20px;border-radius:999px;box-shadow:0 6px 20px rgba(30,45,79,.3);animation:fxpop 2.4s ease-out forwards;pointer-events:none;white-space:nowrap}' +
    '.fx-read{float:right;margin:0 0 6px 10px!important;font:600 12.5px/1 Inter,system-ui,sans-serif!important;color:#1E2D4F!important;background:#fff!important;border:1px solid #C9D0DC!important;border-radius:999px!important;padding:6px 11px!important;min-height:0!important;height:auto!important;width:auto!important;cursor:pointer;position:relative;z-index:2;box-shadow:none!important}' +
    '.fx-read.abs{position:absolute;top:8px;right:8px;float:none;margin:0!important}.fx-read.on{background:#1E2D4F!important;color:#fff!important;border-color:#1E2D4F!important}' +
    '.fx-std{font-size:11px!important;font-weight:500!important;color:#8A93A3!important;background:none!important;border-color:transparent!important;letter-spacing:.02em!important;text-transform:none!important;padding-left:2px!important;padding-right:2px!important}' +
    '.fx-tpanel{flex-basis:100%;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;background:#fff;border:1px solid #E3E5EA;border-radius:10px;padding:12px;margin-top:4px}' +
    '.fx-tpanel a{display:inline-block!important;color:#1E2D4F!important;background:#F1F3F7!important;border:1px solid #D5D9E0!important;border-radius:8px!important;padding:6px 12px!important;font:600 13px Inter,system-ui,sans-serif!important;text-decoration:none!important;box-shadow:none!important;margin:0!important}' +
    '.fx-tpanel .modebar,.fx-tpanel .pr-links{margin:0!important;border:0!important;padding:0!important;background:none!important;display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:center}' +
    '@media print{.fx-foot,.fx-toast,.fx-read{display:none!important}}';
  function addCss() { var st = document.createElement('style'); st.id = 'fx-css'; st.textContent = css; document.head.appendChild(st); }

  /* ---------- sound (Web Audio, made on the first tap) ---------- */
  var AC = null;
  FX.soundOn = function () { return ls('fx-sound') !== 'off'; };
  function tone(f, t0, dur, type, vol, f2) {
    var o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + t0;
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + dur + 0.02);
  }
  FX.play = function (kind) {
    if (!FX.soundOn() || OFF) return;
    try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) { return; }
    if (kind === 'ok') { tone(784, 0, 0.12, 'sine', 0.07); tone(1175, 0.09, 0.18, 'sine', 0.06); }
    else if (kind === 'warn') { tone(587, 0, 0.16, 'triangle', 0.05); }
    else if (kind === 'no') { tone(262, 0, 0.2, 'sine', 0.07, 196); }
    else if (kind === 'cheer') { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.07, 0.16, 'sine', 0.05); }); }
  };

  /* ---------- flash ---------- */
  var BOX = '.pr-card,.q-card,.qc,div.q,section.q,#cards > .card,.np-q,.np,.chk,.val-chk,.sa,.tw,.sw-host,.ex,.card,.problem,.prob,.question';
  FX.box = function (el) {
    var b = el && el.closest && el.closest(BOX); if (b) return b;
    for (var p = el, k = 0; p && p !== document.body && k < 7; p = p.parentElement, k++) {   // nearest framed block
      var cs = getComputedStyle(p); if (p.offsetWidth > 220 && (parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== 'none')) return p;
    }
    return el;
  };
  FX.flash = function (el, kind, quiet) {
    if (!el || OFF) return; var b = FX.box(el);
    b.classList.remove('fx-ok', 'fx-warn', 'fx-no'); void b.offsetWidth; b.classList.add('fx-' + kind);
    clearTimeout(b._fxT); b._fxT = setTimeout(function () { b.classList.remove('fx-' + kind); }, 1100);
    if (!quiet) FX.play(kind);
  };
  FX.mark = function (kind) { if (G) G.forced = kind; };       // an engine can say "careful" for the check in progress

  /* ---------- what just happened? (a tap or Enter, then the page's own check) ---------- */
  var G = null, SKIP = '.site-bar,nav,header,.oat-top,.oat-bot,.oat-end,.nf-top,.nf-bot,.nsp-bar,.fx-foot,[id^="ss"],.ss-panel';
  var OKC = /^(ok|correct|right|good|yes|success|solved|c)$/, NOC = /^(no|wrong|incorrect|bad|err|error|miss|w)$/, WARNC = /^(tip|warn|warning|careful|close|partial|almost|blank)$/;
  var WARNT = /pick an answer|choose an answer|select an answer|answer first|type (a|an|your|the|just)\b|enter (a|an|your)\b|simplest form|write it as a fraction|everything you picked is true|more right answer|fill (it|them) in|use a minus|round(ed)? to/i;
  var CHECK = /^(check|check my answer|check answers?|check it|check this line|verify( the solution)?|submit|go)$/i, REVEAL = /^(show|reveal)\b/i;
  function lab(b) { return String(b && b.textContent || '').replace(/[💡✓✔→←↻▶✏️]/g, '').replace(/\s+/g, ' ').trim(); }
  function gesture(e) {
    if (OFF) return; var t = e.target; if (!t || !t.closest || t.closest(SKIP)) return;
    var b = t.closest('button,[role=button],.opt,.ob,a,input,label,.match-item,td') || t;
    G = { t: Date.now(), el: b, rec: [], states: [], text: '', forced: null, check: CHECK.test(lab(b)) || e.type === 'keydown', reveal: REVEAL.test(lab(b)) };
    var g = G; setTimeout(function () { settle(g); }, 90);
  }
  function settle(g) {
    if (g !== G) return; G = null;
    (g.fin || []).forEach(FX.done);
    if (g.reveal) { FX.done(FX.box(g.el)); return; }
    var kind = g.forced;
    if (!kind && g.rec.length) kind = g.rec.indexOf(false) >= 0 ? (WARNT.test(g.text) ? 'warn' : 'no') : 'ok';
    if (!kind && g.states.length) kind = g.states.indexOf('no') >= 0 ? (WARNT.test(g.text) ? 'warn' : 'no') : g.states.indexOf('warn') >= 0 ? 'warn' : 'ok';
    if (!kind && g.check && g.text) kind = 'warn';
    if (!kind) return;
    var box = g.boxes && g.boxes.length === 1 ? g.boxes[0] : FX.box(g.el);
    FX.flash(box, kind); if (kind === 'ok') FX.done(box);
  }
  function watch() {
    new MutationObserver(function (ms) {
      if (!G || Date.now() - G.t > 1500) return;
      ms.forEach(function (m) {
        var el = m.target.nodeType === 1 ? m.target : m.target.parentElement; if (!el || el.closest(SKIP)) return;
        if (m.type === 'attributes') {
          var old = ' ' + (m.oldValue || '') + ' ';
          [].forEach.call(el.classList, function (c) {
            var s = OKC.test(c) ? 'ok' : NOC.test(c) ? 'no' : WARNC.test(c) ? 'warn' : null;
            if (/^(answered|done|solved|shown)$/.test(c) && old.indexOf(' ' + c + ' ') < 0) (G.fin = G.fin || []).push(FX.box(el));
            if (s && (old.indexOf(' ' + c + ' ') < 0 || /fb|feedback|msg|result/.test(el.className))) { G.states.push(s); (G.boxes = G.boxes || []).indexOf(FX.box(el)) < 0 && G.boxes.push(FX.box(el)); }
          });
        }
        if (/fb|feedback|msg|result|status/i.test(el.className + ' ' + (el.getAttribute('role') || ''))) G.text += ' ' + (el.textContent || '');
      });
    }).observe(document.body, { subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['class'], childList: true, characterData: true });
  }
  function hookSS() {
    var S = window.ScoreSend; if (!S || S.__fx) return; var o = S.record;
    S.record = function (id, ok) { if (G && Date.now() - G.t < 1500) G.rec.push(!!ok); return o.apply(this, arguments); };
    S.__fx = 1;
  }

  /* ---------- "done" counter + a cheer every 5 ---------- */
  var DONE = []; FX.count = function () { return DONE.length; };
  var CHEERS = { 5: 'Nice — 5 done!', 10: '10 done! Keep going!', 15: '15 done — awesome!', 20: '20 done! You’re on a roll!' };
  FX.toast = function (t) { var d = document.createElement('div'); d.className = 'fx-toast'; d.setAttribute('role', 'status'); d.textContent = t; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 2500); };
  FX.onDone = function (n) { if (n % 5) return; setTimeout(function () { FX.toast(CHEERS[n] || n + ' done! Great work!'); FX.play('cheer'); }, 450); };
  FX.done = function (box) { if (!box || DONE.indexOf(box) >= 0) return; DONE.push(box); if (FX.onDone) FX.onDone(DONE.length); };

  /* ---------- matching buttons ---------- */
  var B1 = /^(check|check my answer|check answers?|check it|check this line|verify the solution|submit)$/i,
      B2 = /^(hint|hide hint|how to do it|hide how to do it|see why|show steps|hide steps|show reference diagram|hide reference diagram|try a similar one|strategies|next|back|prev|next problem)$/i,
      B3 = /^(show answers?|show (the )?answer|show all answers|reveal.*|show the (graph and the )?answer|show the finished graph)$/i,
      RENAME = { 'show answer': 'Show answer', 'reveal solution': 'Show answer', 'reveal the answer': 'Show answer', 'reveal': 'Show answer', 'hint': 'Hint', 'check my answer': 'Check' };
  function styleButtons(root) {
    [].forEach.call((root || document).querySelectorAll('button'), function (b) {
      if (b._fx || b.closest(SKIP) || b.closest('.opts,.sw-moves')) return; var t = lab(b); if (!t) return;
      var k = B1.test(t) ? 'fx-b1' : B3.test(t) ? 'fx-b3' : B2.test(t) ? 'fx-b2' : null; if (!k) return;
      b._fx = 1; b.classList.add(k);
      var r = RENAME[t.toLowerCase()]; if (r && !b.children.length && b.textContent.trim() !== r) b.textContent = r;
    });
  }


  /* ---------- read aloud (Chromebook voice; says math in words) ---------- */
  var RSEL = '.pr-card,.q-card,.qc,div.q,section.q,#cards > .card,.np-q,.chk,.tw',
      RSKIP = '.fx-read,.fb,.pr-fb,.np-fb,.chk-fb,.qfb,.sw-host,.hint,.pr-hintbox,.pr-how,.np-sol,.xwrap,.reveal,.whyall,.talk,.tag,.stdtag,.np-lv,.pr-lv,.np-type,.badge,.fx-std,.btnrow,.sanote,.oat-top,.oat-bot,script,style,noscript,input,select,textarea',
      CHOICE = /(^|\s)(opt|ob|np-ch|choice|sa-btn|mc-opt)(\s|$)/;
  var SUP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '−' };
  function pw(e) { e = String(e).trim().replace(/^[−-]\s*/, 'negative '); return e === '2' ? ' squared ' : e === '3' ? ' cubed ' : ' to the power of ' + e + ' '; }
  function walk(n, root) {
    if (n.nodeType === 3) return n.nodeValue;
    if (n.nodeType !== 1) return '';
    if (n !== root && (n.matches(RSKIP) || n.matches(RSEL) || n.hidden || !n.getClientRects().length)) return '';
    var tag = n.tagName, cls = typeof n.className === 'string' ? n.className : '';
    if (tag === 'BUTTON' && !CHOICE.test(cls)) return '';
    if (tag === 'svg' || tag === 'SVG') { var al = n.getAttribute('aria-label'); return al ? ' Picture: ' + al + '. ' : ''; }
    if (tag === 'IMG') return n.alt ? ' Picture: ' + n.alt + '. ' : '';
    if (tag === 'SUP') return pw(n.textContent);
    if (tag === 'SUB') return ' sub ' + n.textContent + ' ';
    if (tag === 'BR') return '. ';
    if (/(^|\s)sf(\s|$)/.test(cls) && n.children.length === 2) { var nm = function (k) { return walk(n.children[k], n.children[k]).replace(/[.\s]+$/, '').trim(); }; return ' ' + nm(0) + ' over ' + nm(1) + ' '; }
    if (/(^|\s)let(\s|$)/.test(cls)) return ' ' + n.textContent.trim() + ': ';
    if (tag === 'TR') return [].map.call(n.children, function (c) { return walk(c, c).trim(); }).filter(Boolean).join(', ') + '. ';
    var out = ''; for (var c = n.firstChild; c; c = c.nextSibling) out += walk(c, root);
    if (/overline/.test(n.style && n.style.textDecoration || '')) out += ' repeating ';
    if (CHOICE.test(cls) && tag === 'BUTTON') return ' ' + out.trim() + '. ';
    if (/^(P|DIV|LI|H\d|TABLE|SECTION|LABEL)$/.test(tag) && out.trim() && !/[.?!:]\s*$/.test(out)) out += '. ';
    if (/^(SPAN|I|B|EM|STRONG|SMALL|A|CODE|MARK)$/.test(tag)) return getComputedStyle(n).display === 'inline' ? out : ' ' + out.trim() + (out.trim() && !/[.?!:]$/.test(out.trim()) ? '. ' : ' ');
    return ' ' + out + ' ';
  }
  FX.speakText = function (s) {
    s = s.replace(/((?:\d̅)+)/g, function (m) { return ' ' + m.replace(/̅/g, '') + ' repeating '; }).replace(/̅/g, '');
    s = s.replace(/([^\s])([⁻]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, function (m, b, e) { return b + pw(e.replace(/./g, function (c) { return SUP[c]; })); });
    s = s.replace(/([^\s]?)(\s*)[−–](?=\s*[\d.a-zA-Zπ√∛(])/g, function (m, p, sp) { return p && /[\w)\]π°]/.test(p) ? p + sp + ' minus ' : p + sp + ' negative '; });
    s = s.replace(/(\d)\s*\/\s*(\d)/g, '$1 over $2').replace(/_{2,}/g, ' blank ');
    var MAP = { '×': ' times ', '÷': ' divided by ', '·': ' times ', '•': ' times ', '=': ' equals ', '≠': ' does not equal ', '≤': ' is less than or equal to ', '≥': ' is greater than or equal to ',
      '<': ' is less than ', '>': ' is greater than ', '≈': ' is about ', 'π': ' pi ', '°': ' degrees ', '√': ' the square root of ', '∛': ' the cube root of ', '%': ' percent ', '∠': ' angle ',
      '△': ' triangle ', '′': ' prime ', '″': ' double prime ', '→': ' to ', '✓': ' ', '✗': ' ', '…': ' ', '✏': ' ', '★': ' ' };
    s = s.replace(/[×÷·•=≠≤≥<>≈π°√∛%∠△′″→✓✗…✏★]/g, function (c) { return MAP[c]; });
    return s.replace(/\s+([.,?!])/g, '$1').replace(/([.,?!])(\s*[.,])+/g, '$1').replace(/\s+/g, ' ').trim();
  };
  FX.text = function (box) { return FX.speakText(walk(box, box)); };
  var talking = null;
  function stop() { try { speechSynthesis.cancel(); } catch (e) {} if (talking) { talking.classList.remove('on'); talking.textContent = '🔊 Read'; talking = null; } }
  FX.read = function (box, btn) {
    var was = talking; stop(); if (was === btn) return;
    var u = new SpeechSynthesisUtterance(FX.speakText(walk(box, box))); u.rate = 0.92; u.lang = 'en-US';
    var v = speechSynthesis.getVoices().filter(function (x) { return /^en(-|_)US/i.test(x.lang); }); if (v.length) u.voice = v.filter(function (x) { return /Google|Natural|Samantha|Aria|Jenny/i.test(x.name); })[0] || v[0];
    u.onend = u.onerror = function () { if (talking === btn) stop(); };
    talking = btn; btn.classList.add('on'); btn.textContent = '■ Stop'; speechSynthesis.speak(u);
  };
  function readButtons() {
    if (!('speechSynthesis' in window)) return;
    [].forEach.call(document.querySelectorAll(RSEL), function (box) {
      if (box._fxr || box.closest(SKIP) || box.matches('td,th,tr')) return; box._fxr = 1;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'fx-read'; b.textContent = '🔊 Read'; b.setAttribute('aria-label', 'Read this question out loud');
      var d = getComputedStyle(box).display; if (/flex|grid/.test(d)) { b.classList.add('abs'); if (getComputedStyle(box).position === 'static') box.style.position = 'relative'; }
      b.addEventListener('click', function (e) { e.stopPropagation(); FX.read(box, b); });
      box.insertBefore(b, box.firstChild);
    });
  }


  /* ---------- standards: still shown (for admin), but small and gray ---------- */
  function stds() {
    [].forEach.call(document.body.querySelectorAll('span,div,small,p,b,em,a,li'), function (e) {
      if (e._fxs || e.closest(SKIP) || e.closest('.fx-tpanel')) return; var t = e.textContent; if (t.length > 70 || !/NC\.8\./.test(t)) return;
      if ([].some.call(e.children, function (c) { return /NC\.8\./.test(c.textContent); })) return;   // innermost only
      e._fxs = 1; e.classList.add('fx-std');
    });
  }

  /* ---------- teacher items (PDFs, answer keys, Class mode) -> one small button at the bottom ---------- */
  function teacher() {
    if (/homework_turn_in/.test(location.pathname)) return null;          // the homework PDF is the homework itself
    var items = [], cm = document.getElementById('classMode');
    if (cm) items.push(cm.closest('.modebar') || cm);
    [].forEach.call(document.querySelectorAll('.pr-links'), function (e) { items.push(e); });
    [].forEach.call(document.querySelectorAll('a[href$=".pdf"],a[href*=".pdf?"],a[href*=".pdf#"]'), function (a) {
      if (a.closest(SKIP) || a.closest('.site-footer,body > footer,.pr-links,.fx-foot,.modebar')) return; items.push(a); });
    if (!items.length) return null;
    var panel = document.createElement('div'); panel.className = 'fx-tpanel'; panel.hidden = true;
    items.forEach(function (e) {
      var par = e.parentElement; panel.appendChild(e);
      for (var k = 0; par && k < 3 && par !== document.body; k++) {               // hide wrappers left empty
        if (par.textContent.replace(/[·|•\s]/g, '') || par.querySelector('img,svg,input,button,select,canvas')) break;
        par.style.display = 'none'; par = par.parentElement;
      }
    });
    return panel;
  }


  /* ---------- progress on this device (for the "Keep going" button on unit pages) ---------- */
  FX.progKey = function () { var m = location.search.match(/[?&]hw=([^&#]+)/); return location.pathname.split('/').pop() + (m ? '?hw=' + m[1] : ''); };
  FX.prog = function (mark) {
    var all; try { all = JSON.parse(ls('fx-prog') || '{}'); } catch (e) { all = {}; }
    var k = FX.progKey(), e = all[k] || {}; if (mark === 'seen') e.s = Date.now(); if (mark === 'done') { if (e.d) return; e.d = 1; } all[k] = e; ls('fx-prog', JSON.stringify(all));
  };
  function finishedYet() {
    var sb = document.getElementById('ssbtn'), hw = document.getElementById('done');
    if ((sb && /Sent ✓/.test(sb.textContent)) || (hw && /homework_turn_in/.test(location.pathname) && hw.style.display === 'block')) FX.prog('done');
    var n = [].filter.call(document.querySelectorAll(RSEL), function (b) { return !b.closest('.tw') && !b.matches('.tw'); }).length;
    if (n && FX.count() >= n) FX.prog('done');
  }

  /* ---------- small bar at the bottom: Sound on/off ---------- */
  function foot() {
    var f = document.createElement('div'); f.className = 'fx-foot';
    var sb = document.createElement('button'); sb.type = 'button';
    function show() { sb.textContent = FX.soundOn() ? '🔊 Sound: on' : '🔇 Sound: off'; sb.setAttribute('aria-pressed', FX.soundOn()); }
    sb.addEventListener('click', function () { ls('fx-sound', FX.soundOn() ? 'off' : 'on'); show(); if (FX.soundOn()) FX.play('ok'); });
    show(); f.appendChild(sb); FX.footEl = f;
    var panel = teacher();
    if (panel) {
      var tb = document.createElement('button'); tb.type = 'button'; tb.textContent = 'Teacher & printing ▾'; tb.setAttribute('aria-expanded', 'false');
      tb.addEventListener('click', function () { panel.hidden = !panel.hidden; tb.setAttribute('aria-expanded', !panel.hidden); tb.textContent = 'Teacher & printing ' + (panel.hidden ? '▾' : '▴'); });
      f.appendChild(tb); f.appendChild(panel);
    }
    var sf = document.querySelector('.site-footer, body > footer'); if (sf) sf.parentNode.insertBefore(f, sf); else document.body.appendChild(f);
  }

  function init() {
    if (OFF) return;
    addCss(); watch(); hookSS(); setTimeout(hookSS, 800); styleButtons(); foot();
    document.addEventListener('click', gesture, true);
    document.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) gesture(e); }, true);
    readButtons(); stds(); FX.prog('seen'); window.addEventListener('pagehide', stop);
    new MutationObserver(function () { clearTimeout(init.t); init.t = setTimeout(function () { styleButtons(); readButtons(); stds(); finishedYet(); }, 120); }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
