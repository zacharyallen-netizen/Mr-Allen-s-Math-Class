/* STUDENT FX (Nov 10, 2026, Mr. Allen's request) — the same feel on every practice question:
   - border flash: green = right, yellow = careful (no answer / format / almost), red = try again
   - soft, short sounds (Sound on/off at the bottom of the page, remembered on this device)
   - matching buttons: Check (navy), Hint / How (outline), Show answer (gold outline)
   Loaded by one-at-a-time.js, notes-flow.js and step-work.js (and a script tag on a few review pages).
   It only watches: right/wrong comes from ScoreSend.record() and from the feedback classes each page already sets.
   Nothing here changes checking, scoring or sending. ?paper=1, ?key=1 and print: no effects. */
/* grade8/aligned-steps.js (lined-up written solutions) is OFF since Nov 12, 2026, 1 pm: the independent review found it
   dropped or garbled steps on some pages. Turn it back on only after it passes a check on every solution (see _build/review). */
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
    '.fx-foot>button{font:600 13px Inter,system-ui,sans-serif;color:#5B6475;background:#fff;border:1px solid #D5D9E0;border-radius:999px;padding:8px 14px;min-height:34px;cursor:pointer}' +
    '@keyframes fxpop{0%{opacity:0;transform:translate(-50%,-14px) scale(.9)}12%{opacity:1;transform:translate(-50%,0) scale(1.04)}20%{transform:translate(-50%,0) scale(1)}85%{opacity:1}100%{opacity:0}}' +
    '.fx-toast{position:fixed;left:50%;top:76px;z-index:9999;transform:translateX(-50%);background:#1E2D4F;color:#FFC107;font:700 17px Inter,system-ui,sans-serif;padding:10px 20px;border-radius:999px;box-shadow:0 6px 20px rgba(30,45,79,.3);animation:fxpop 2.4s ease-out forwards;pointer-events:none;white-space:nowrap}' +
    '.fx-streak{position:fixed;left:50%;bottom:8px;transform:translateX(-50%);z-index:9000;display:flex;align-items:center;gap:6px;background:rgba(30,45,79,.94);color:#fff;font:600 12.5px Inter,system-ui,sans-serif;padding:6px 12px;border-radius:999px;pointer-events:none;box-shadow:0 3px 12px rgba(30,45,79,.25);transition:opacity .5s}' +
    '.fx-streak i{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.22);display:block;transition:background .25s,transform .25s}.fx-streak i.on{background:#FFC107}.fx-streak i.new{transform:scale(1.5)}.fx-streak b{font-weight:700;color:#FFC107;margin-left:3px;white-space:nowrap}.fx-streak b:empty{display:none}.fx-streak.off{opacity:0}' +
    '.fx-fin{position:fixed;left:50%;top:76px;transform:translateX(-50%);z-index:9999;background:#fff;color:#1E2D4F;border:2px solid #15803D;border-radius:14px;padding:12px 20px;box-shadow:0 8px 28px rgba(30,45,79,.25);font:500 14.5px/1.4 Inter,system-ui,sans-serif;text-align:center;max-width:calc(100vw - 32px);animation:fxfin 5s ease-out forwards;pointer-events:none}' +
    '.fx-fin strong{display:block;font:600 1.25rem "Source Serif 4",Georgia,serif;color:#15803D;margin-bottom:2px}@keyframes fxfin{0%{opacity:0;transform:translate(-50%,-10px)}6%{opacity:1;transform:translate(-50%,0)}90%{opacity:1}100%{opacity:0}}' +
    '@media print{.fx-streak,.fx-fin{display:none!important}}@media (prefers-reduced-motion:reduce){.fx-streak i{transition:none}}' +
    '.fx-help{clear:both;display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:10px 0 2px;padding:10px 12px;background:#F4F6FB;border:1px solid #D5D9E0;border-radius:10px;font:600 14px Inter,system-ui,sans-serif;color:#1E2D4F}.fx-help>span{margin-right:2px}section.pg>.fx-help{margin:10px 16px 12px}' +
    '.fx-help button,.fx-help a{font:600 14px Inter,system-ui,sans-serif;color:#1E2D4F;background:#fff;border:1.5px solid #1E2D4F;border-radius:8px;padding:8px 12px;min-height:38px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center}.fx-help button:hover,.fx-help a:hover{background:#EEF1F7}@media print{.fx-help{display:none!important}}' +
    '.fx-read{float:right;margin:0 0 6px 10px!important;font:600 13px/1 Inter,system-ui,sans-serif!important;color:#1E2D4F!important;background:#fff!important;border:1px solid #C9D0DC!important;border-radius:999px!important;padding:9px 13px!important;min-height:34px!important;height:auto!important;width:auto!important;cursor:pointer;position:relative;z-index:2;box-shadow:none!important}' +
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
    if (!FX.soundOn() || OFF || window.__swReplay) return;
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
  var G = null, SKIP = '#side-nav,.site-bar,nav,header,.oat-top,.oat-bot,.oat-end,.nf-top,.nf-bot,.nsp-bar,.fx-foot,.fx-help,[id^="ss"],.ss-panel';
  var OKC = /^(ok|correct|right|good|yes|success|solved|c)$/, NOC = /^(no|wrong|incorrect|bad|err|error|miss|w)$/, WARNC = /^(tip|warn|warning|careful|close|partial|almost|blank)$/;
  var WARNT = /pick an answer|choose an answer|select an answer|answer first|type (a|an|your|the|just)\b|enter (a|an|your)\b|simplest form|write it as a fraction|everything you picked is true|more right answer|fill (it|them) in|use a minus|round(ed)? to/i;
  var CHECK = /^(check|check my answer|check answers?|check it|check this line|verify( the solution)?|submit|go)$/i, REVEAL = /^(show|reveal)\b/i;
  function lab(b) { return String(b && b.textContent || '').replace(/[💡✓✔→←↻▶✏️]/g, '').replace(/\s+/g, ' ').trim(); }
  function gesture(e) {
    if (OFF || window.__swReplay) return; var t = e.target; if (!t || !t.closest || t.closest(SKIP)) return;
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
    if (g.bs && g.bs.length > 1) {                       // one Check graded many questions (pre-tests)
      var ks = g.bs.map(function (z) { return z.s; });
      g.bs.forEach(function (z) { FX.flash(z.b, z.s, true); if (z.s === 'ok') { FX.done(z.b); FX.good(z.b); } else if (z.s === 'no') FX.help(z.b); });
      FX.play(ks.every(function (k) { return k === 'ok'; }) ? 'ok' : ks.every(function (k) { return k === 'no'; }) ? 'no' : 'warn'); return;
    }
    var box = g.bs && g.bs.length === 1 ? g.bs[0].b : FX.box(g.el);
    FX.flash(box, kind); if (kind === 'ok') { FX.done(box); FX.good(box); }
    FX.streak(kind, box);
    if (kind === 'no') FX.help(box);
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
            if (s && (old.indexOf(' ' + c + ' ') < 0 || /fb|feedback|msg|result/.test(el.className))) { G.states.push(s); var bx = FX.box(el); G.bs = G.bs || []; var hit = G.bs.filter(function (z) { return z.b === bx; })[0]; if (!hit) G.bs.push({ b: bx, s: s }); else if (s === 'no' || (s === 'warn' && hit.s === 'ok')) hit.s = s; }
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
  FX.toast = function (t) { if (window.__swReplay) return; var d = document.createElement('div'); d.className = 'fx-toast'; d.setAttribute('role', 'status'); d.textContent = t; document.documentElement.appendChild(d); setTimeout(function () { d.remove(); }, 2500); };
  var GOOD = [];
  FX.good = function (box) { if (!box || GOOD.indexOf(box) >= 0) return; GOOD.push(box); var n = GOOD.length; if (n % 5) return;
    setTimeout(function () { FX.toast(CHEERS[n] || n + ' done! Great work!'); FX.play('cheer'); }, 450); };
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
  var RSEL = '.pr-card,.q-card,div.qc,div.q,section.q,#cards > .card,div.np-q,div.chk,div.tw',
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
      if (box._fxr || box.closest(SKIP) || box.matches('td,th,tr,button,a,input,label') || box.closest('button')) return; box._fxr = 1;
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
  /* ---------- choose your help (Nov 11, 2026): after a miss on a practice page or homework, one row under the problem:
     "Stuck? Pick one:" Hint / Step by step (only if the problem has them; they press the page's own buttons) / Review the notes
     (opens that unit's Interactive Notes in a new tab). Shown once per problem. ---------- */
  // the notes page that teaches each NC standard (pre-tests, EOG sets and reviews link by the missed question's standard)
  var STD_NOTES = { 'NS.1': 'unit1-notes.html', 'NS.2': 'unit1-notes.html', 'EE.2': 'unit1-notes.html', 'EE.1': 'unit2-notes-exponents.html',
    'EE.3': 'unit2-notes-sci-notation.html', 'EE.4': 'unit2-notes-sci-notation.html', 'EE.7': 'unit3-notes.html', 'G.5': 'unit4-notes.html',
    'G.6': 'unit5-notes.html', 'G.7': 'unit5-notes.html', 'G.8': 'unit5-notes.html', 'F.1': 'unit6-notes.html', 'F.2': 'unit6-notes.html',
    'F.5': 'unit6-notes.html', 'F.3': 'unit6-notes-slope-intercept.html', 'F.4': 'unit6-notes-slope.html', 'EE.8': 'unit6-notes-tables-systems.html',
    'SP.1': 'unit7-notes.html', 'SP.2': 'unit7-notes.html', 'SP.3': 'unit7-notes.html', 'SP.4': 'unit7-notes.html',
    'G.2': 'unit8-notes.html', 'G.3': 'unit8-notes.html', 'G.4': 'unit8-notes.html', 'G.9': 'volume.html' };
  function stdOf(box) {
    var t = '', el = box; for (var k = 0; el && k < 4; k++, el = el.parentElement) { t = (el.textContent || '').slice(0, 4000); var m = t.match(/(?:NC\.)?8\.(NS|EE|F|G|SP)\.(\d)/); if (m) return m[1] + '.' + m[2]; }
    var pg = (document.body.textContent || '').match(/(?:NC\.)?8\.(NS|EE|F|G|SP)\.(\d)/); return pg ? pg[1] + '.' + pg[2] : null;
  }
  FX.notesPage = function (box) {
    var f = location.pathname.split('/').pop(), m, hw = (location.search.match(/[?&]hw=([^&#]+)/) || [])[1];
    if (/notes|volume\.html/.test(f)) return null;                                   // already on the notes
    if (/pretest|-eog|eog_|review|tutorial|unit6-practice-tables/.test(f)) { var sd = box && stdOf(box); if (sd && STD_NOTES[sd]) return STD_NOTES[sd]; }
    if (/homework_turn_in/.test(f)) {
      if (!hw || !(m = hw.match(/^(\d)\.(\d+)$/))) return null; var u = m[1], k = +m[2];
      if (u === '2') return k >= 6 && k <= 8 ? 'unit2-notes-sci-notation.html' : 'unit2-notes-exponents.html';
      if (u === '6') return k >= 12 ? 'unit6-notes-tables-systems.html' : k >= 8 && k <= 9 ? 'unit6-notes-tables-systems.html' : k >= 6 ? 'unit6-notes-slope-intercept.html' : k >= 4 ? 'unit6-notes-slope.html' : 'unit6-notes.html';
      return u === '9' ? 'volume.html' : 'unit' + u + '-notes.html';
    }
    if (/unit6-practice-tables/.test(f)) return 'unit6-notes-tables-systems.html';
    if (!/practice/.test(f)) return null;
    if (/^unit2-practice-exponents/.test(f)) return 'unit2-notes-exponents.html';
    if (/^unit2-practice-sci/.test(f)) return 'unit2-notes-sci-notation.html';
    if (/^unit6-practice-slope-intercept/.test(f)) return 'unit6-notes-slope-intercept.html';
    m = f.match(/^unit(\d)[-_]practice/); if (!m) return null;
    return m[1] === '9' ? 'volume.html' : 'unit' + m[1] + '-notes.html';
  };
  FX.help = function (box) {
    if (!box || box === document.body || box.matches('.sheet, main, .wrap, .page-wrap, section.topic, .part') ||
        box.querySelectorAll('.qgrid > .q, .pr-card, .q-card, .np-q, .chk, .qc').length > 1) return;          // one question, never the whole page
    var notes = FX.notesPage(box); if (!notes || box.querySelector('.fx-help')) return;
    var row = document.createElement('div'); row.className = 'fx-help'; row.innerHTML = '<span>Stuck? Pick one:</span>';
    function proxy(label, sel) { var o = box.querySelector(sel); if (!o || o.disabled) return; var b = document.createElement('button'); b.type = 'button'; b.textContent = label;
      b.addEventListener('click', function () { o.click(); try { o.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {} b.remove(); }); row.appendChild(b); }
    proxy('Hint', '.pr-hint'); proxy('Step by step', '.sw-open');
    var a = document.createElement('a'); a.href = notes; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Review the notes \u2197'; row.appendChild(a);
    box.appendChild(row);
  };
  /* ---------- streak dots (Nov 11, 2026): right answers in a row. Each question counts once; a miss restarts the row quietly;
     yellow (format) changes nothing. Small chip at the bottom of the screen, never in the way (pointer-events: none). ---------- */
  var STREAK = 0, BEST = 0, SBOX = [], chip = null, chipT = 0;
  FX.streak = function (kind, box) {
    if (kind === 'warn') return;
    if (kind === 'ok') { if (box && SBOX.indexOf(box) >= 0) return; if (box) SBOX.push(box); STREAK++; BEST = Math.max(BEST, STREAK); }
    else { if (!STREAK) return; STREAK = 0; }
    if (!chip) { chip = document.createElement('div'); chip.className = 'fx-streak off'; chip.setAttribute('aria-hidden', 'true'); chip.innerHTML = '<i></i><i></i><i></i><i></i><i></i><b></b>'; document.documentElement.appendChild(chip); }
    var on = STREAK ? ((STREAK - 1) % 5) + 1 : 0, dots = chip.querySelectorAll('i');
    [].forEach.call(dots, function (d, i) { d.className = i < on ? 'on' : ''; });
    if (on) { dots[on - 1].classList.add('new'); setTimeout(function () { dots[on - 1].classList.remove('new'); }, 300); }
    chip.querySelector('b').textContent = STREAK >= 2 ? STREAK + ' in a row' + (STREAK % 5 === 0 ? '!' : '') : '';
    chip.classList.remove('off'); clearTimeout(chipT);
    if (!STREAK) chipT = setTimeout(function () { chip.classList.add('off'); }, 1500);
  };
  FX.best = function () { return BEST; };
  /* ---------- finish message: once per visit when the page is finished. A plain summary, no confetti. ---------- */
  var FIN = false;
  FX.finish = function (n) {
    if (FIN) return; FIN = true;
    setTimeout(function () {
      [].forEach.call(document.querySelectorAll('.fx-toast'), function (t) { t.remove(); });
      var d = document.createElement('div'); d.className = 'fx-fin'; d.setAttribute('role', 'status');
      var st = document.createElement('strong'); st.textContent = '\u2713 Finished'; d.appendChild(st);
      d.appendChild(document.createTextNode((n ? 'You answered all ' + n + '.' : 'Your work is in.') + (BEST >= 3 ? ' Best run: ' + BEST + ' in a row.' : '')));
      document.documentElement.appendChild(d); FX.play('cheer'); setTimeout(function () { d.remove(); }, 5200);
    }, 900);
  };
  FX.progKey = function () { var m = location.search.match(/[?&]hw=([^&#]+)/); return location.pathname.split('/').pop() + (m ? '?hw=' + m[1] : ''); };
  FX.prog = function (mark) {
    var all; try { all = JSON.parse(ls('fx-prog') || '{}'); } catch (e) { all = {}; }
    var k = FX.progKey(), e = all[k] || {}; if (mark === 'seen') e.s = Date.now(); if (mark === 'done') { if (e.d) return; e.d = 1; } all[k] = e; ls('fx-prog', JSON.stringify(all));
  };
  function finishedYet() {
    var sb = document.getElementById('ssbtn'), hw = document.getElementById('done');
    if ((sb && /Sent ✓/.test(sb.textContent)) || (hw && /homework_turn_in/.test(location.pathname) && hw.style.display === 'block')) { FX.prog('done'); FX.finish(0); }
    var n = [].filter.call(document.querySelectorAll(RSEL), function (b) { return !b.closest('.tw') && !b.matches('.tw'); }).length;
    if (n && FX.count() >= n) { FX.prog('done'); FX.finish(n); }
  }

  /* ---------- pre-tests: "Show answers" opens only after every question has an answer ---------- */
  function gateReveal() {
    var rv = document.getElementById('reveal'); if (!rv || !/show answers/i.test(rv.textContent)) return;
    var note = document.createElement('span'); note.className = 'fx-gate'; note.textContent = 'Show answers opens after you answer every question.';
    note.style.cssText = 'font:500 13px Inter,system-ui,sans-serif;color:#5B6475;align-self:center;margin-left:6px';
    rv.parentNode.insertBefore(note, rv.nextSibling);
    function upd() {
      var f = [].filter.call(document.querySelectorAll('input:not([type]),input[type=text],input[type=number],select,textarea'), function (e) {
        return !e.closest(SKIP) && !e.closest('.sw-host,.fx-foot,.ss-panel') && !/^ss|^nm$|^pd$/.test(e.id || '') && !e.closest('[id^="ss"]'); });
      var ok = f.length && f.every(function (e) { return String(e.value).trim(); });
      rv.style.display = ok ? '' : 'none'; note.style.display = ok ? 'none' : '';
    }
    document.addEventListener('input', upd, true); document.addEventListener('change', upd, true); upd();
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
      var tb = document.createElement('button'); tb.type = 'button'; tb.textContent = 'Printables ▾'; tb.setAttribute('aria-expanded', 'false');
      tb.addEventListener('click', function () { panel.hidden = !panel.hidden; tb.setAttribute('aria-expanded', !panel.hidden); tb.textContent = 'Printables ' + (panel.hidden ? '▾' : '▴'); });
      f.appendChild(tb); f.appendChild(panel);
    }
    var sf = document.querySelector('.site-footer, body > footer'); if (sf) sf.parentNode.insertBefore(f, sf); else document.body.appendChild(f);
  }

  function init() {
    if (OFF) return;
    addCss(); watch(); hookSS(); setTimeout(hookSS, 800); styleButtons(); foot();
    document.addEventListener('click', gesture, true);
    document.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) gesture(e); }, true);
    readButtons(); stds(); gateReveal(); FX.prog('seen'); window.addEventListener('pagehide', stop);
    new MutationObserver(function () { clearTimeout(init.t); init.t = setTimeout(function () { styleButtons(); readButtons(); stds(); finishedYet(); }, 120); }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
