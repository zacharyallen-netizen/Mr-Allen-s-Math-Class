/* ───────────────────────────────────────────────────────────────
   Interactive practice sets (Units 1–6)
   Same problems as the printed Practice PDFs. Each problem:
   type an answer → Check (instant feedback) · Hint · after 2 misses, Show answer.
   Every check is recorded with ScoreSend (score-send.js) so the
   "Send my work" panel can post results to Mr. Allen's sheet.

   Page needs:  window.PRACTICE = { unit, page, sets:{title,sub,secs:[{title,std,hint,probs:[{n,q,ans,fig?,size?}]}]} }
   ─────────────────────────────────────────────────────────────── */
(function () {
  var ENGINE_SRC = document.currentScript && document.currentScript.src;
  var D = window.PRACTICE; if (!D) return;
  var data = D.data, root = document.getElementById('practice');

  /* ---------- answer normalising ---------- */
  var SUP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' };
  function stripHtml(s) {
    return String(s)
      .replace(/<span class="fr"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/g, '($1)/($2)')
      .replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
  }
  function base(s) {
    s = stripHtml(s).toLowerCase()
      .replace(/[−–—]/g, '-')
      .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, function (m) { return '^' + m.split('').map(function (c) { return SUP[c]; }).join(''); })
      .replace(/sqrt\s*\(?\s*(\d+)\s*\)?/g, '√$1').replace(/root\s*(\d+)/g, '√$1')
      .replace(/\bpi\b/g, 'π')
      .replace(/≤|<=|=</g, '≤').replace(/≥|>=|=>/g, '≥')
      .replace(/(\d),(?=\d{3}\b)/g, '$1')
      .replace(/\s+/g, '').replace(/([^.])\.$/, '$1');
    s = s.replace(/\((\w+)\)\/\((\w+(\^\d+)?)\)/g, '$1/$2');          // (1)/(9) → 1/9
    return s;
  }
  function frac(s) {                                             // "22/3", "7 1/3", "-2", "6.5" → number
    s = String(s).trim();
    var m = s.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
    if (m) return (Number(m[1]) < 0 ? -1 : 1) * (Math.abs(Number(m[1])) + Number(m[2]) / Number(m[3]));
    m = s.match(/^\(?(-?\d+(?:\.\d+)?)\)?\/\(?(\d+(?:\.\d+)?)\)?$/);
    if (m) return Number(m[1]) / Number(m[2]);
    if (/^-?\d*\.?\d+$/.test(s)) return Number(s);
    return NaN;
  }
  function sci(s) {                                              // "3.2*10^4", "3.2x10^4", "3.2e4"
    var m = s.match(/^(-?\d+(?:\.\d+)?)(?:\*|x|×|·)10\^?\(?(-?\d+)\)?$/) || s.match(/^(-?\d+(?:\.\d+)?)e(-?\d+)$/);
    return m ? { c: Number(m[1]), e: Number(m[2]) } : null;
  }
  function stripVar(s) { return s.replace(/^[a-z]=(?=[-\d(√π])/, ''); }
  var SYN = [
    ['infinitelymanysolutions', 'infinitelymany', 'infinite', 'infinitesolutions', 'infinitelymanysolution', 'manysolutions', 'allrealnumbers', 'infinitenumberofsolutions'],
    ['nosolution', 'nosolutions', 'none', '0solutions', 'zerosolutions'],
    ['functionb', 'b'], ['functiona', 'a'],
    ['stopped', 'notmoving', 'stop', 'carstopped', 'thecarstopped', 'thecarisstopped', 'itstopped', 'stoppedmoving', 'parked', 'stayedstill', 'notmovingstopped'],
    ['constant', 'staysthesame', 'thesame', 'flat', 'nochange'],
    ['yes', 'y', 'yesitis', 'true'], ['no', 'n', 'noitisnot', 'false'],
    ['integer', 'integers', 'aninteger'], ['rational', 'rationalnumber'], ['irrational', 'irrationalnumber']
  ];
  function syn(a) { for (var i = 0; i < SYN.length; i++) if (SYN[i].indexOf(a) >= 0) return SYN[i]; return [a]; }

  function linear(s) {                                           // y=mx+b in either order → {m,b}
    s = s.replace(/^y=/, ''); if (s === s.replace(/x/g, '')) return null;
    var terms = s.replace(/-/g, '+-').split('+').filter(Boolean), m = 0, b = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i];
      if (/x$/.test(t)) { var c = t.slice(0, -1); m += c === '' ? 1 : c === '-' ? -1 : frac(c); }
      else b += frac(t);
    }
    return isNaN(m) || isNaN(b) ? null : { m: m, b: b };
  }

  function check(input, ans) {
    var a = base(ans), s = base(input);
    if (!s) return false;
    if (s === a) return true;
    // repeating decimal with an overline (0.83̅): accept 0.8(3), 0.8333, 0.83..., 0.83repeating
    var rep = stripHtml(ans).match(/^(-?\d*\.\d*)(\d)\u0305$/);
    if (rep) {
      var fixed = rep[1], r = rep[2];
      if (s.replace('repeating', '').replace(/\.\.\.$/, '') === fixed + r) return /\.\.\.|repeating/.test(s);
      if (s === fixed + '(' + r + ')' || s === fixed + r + '̅') return true;
      var t = s.replace(/\.\.\.$|repeating$|bar$/, '');
      if (t.indexOf(fixed) === 0) { var tail = t.slice(fixed.length); if (tail.length >= r.length * 2 && new RegExp('^(' + r + ')+' + r.slice(0, (tail.length % r.length)) + '$').test(tail)) return true; }
      return false;
    }
    // scientific notation: must be written in scientific notation, same value
    var as = sci(a); if (as) { var ss = sci(s); return !!ss && Math.abs(ss.c - as.c) < 1e-9 && ss.e === as.e; }
    // equations y = mx + b
    if (/^y=/.test(a)) { var la = linear(a), ls = linear(s.replace(/^f\(x\)=/, 'y=')); return !!(la && ls && la.m === ls.m && la.b === ls.b); }
    // inequalities: x>5 also as 5<x
    var iq = a.match(/^([a-z])([<>≤≥])(-?[\d./]+)$/);
    if (iq) { var flip = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' }; return s === iq[3] + flip[iq[2]] + iq[1]; }
    // ordered points / lists
    if (/^\(?-?\d+,-?\d+\)?$/.test(a)) return s.replace(/[()]/g, '').replace(/^x=(-?\d+),?y=/, '$1,') === a.replace(/[()]/g, '');
    if (a.indexOf(',') > 0) return s.split(/,|<|;/).join(',') === a;
    var between = a.match(/^(\d+)and(\d+)$/);
    if (between) { var m = s.replace(/^between/, '').match(/^(\d+)(?:and|,|-|&|to)(\d+)$/); return !!m && m[1] === between[1] && m[2] === between[2]; }
    // numbers (allow "x = 18"; fractions compared by value)
    var na = frac(a), ns = frac(stripVar(s)), mixed = frac(String(input).replace(/^\s*[a-z]\s*=\s*/i, '').replace(/[\u2212]/g, '-'));
    if (!isNaN(na) && !isNaN(mixed) && /\d\s+\d+\/\d/.test(input) && Math.abs(na - mixed) < 1e-9) return true;
    if (!isNaN(na) && !isNaN(ns)) {
      if (/\//.test(a) && !/\//.test(stripVar(s)) && !/\d\s\d/.test(input)) return false;   // "write as a fraction" stays a fraction
      var fm = stripVar(s).match(/^-?(\d+)\/(\d+)$/);
      if (fm && /\//.test(a)) { var g = function (x, y) { return y ? g(y, x % y) : x; }; if (g(+fm[1], +fm[2]) !== 1) return false; }   // simplest form
      return Math.abs(na - ns) < 1e-9;
    }
    if (stripVar(s) === a) return true;
    if (s.replace(/\^/g, '') === a.replace(/\^/g, '')) return true;                     // x7 for x^7
    return syn(a).indexOf(s) >= 0;
  }
  window.PracticeCheck = check;   // exposed for testing

  /* ---------- render ---------- */
  var html = ['<div class="hero"><h1>' + data.title + '</h1><p>' + data.sub + '</p>' +
    '<p class="pr-links"><a href="' + D.pdf + '" target="_blank" rel="noopener">🖨️ Printable PDF of this practice</a>' +
    (D.key ? ' &nbsp;·&nbsp; <a href="' + D.key + '" target="_blank" rel="noopener">✅ Answer key (PDF)</a>' : '') + '</p></div>',
    '<p class="pr-how"><b>Tap</b> your answer. If there is a box, type a <b>number</b> and press <b>Check</b>. Stuck? Tap <b>Hint</b>. After two tries you can see the answer. Do the work on paper first.</p>',
    '<div class="pr-score" aria-live="polite">Answered <span id="prScore">0</span> of <span id="prTotal">0</span></div>'];
  var total = 0, TAP = {};   // id -> { list, right, ui }: problems answered by tapping a choice (tap-answers.js). A number answer keeps its box.
  data.secs.forEach(function (sec, si) {
    html.push('<h2 class="pr-sec">' + sec.title + '</h2>');
    sec.probs.forEach(function (p) {
      var id = 's' + si + 'p' + p.n; total++;
      var ch = window.TapAnswers ? TapAnswers.choices(p.ans, { q: p.q, key: (D.unit || '') + id, choices: p.choices, why: p.why }) : null, rt = ch ? TapAnswers.rightOf(ch, p.ans) : null;
      if (ch && rt) TAP[id] = { list: ch, right: rt };
      html.push('<div class="pr-card" id="' + id + '" data-si="' + si + '">' +
        '<div class="pr-num">' + (data.qlabel ? data.qlabel + p.n + '.' : 'Problem ' + p.n) + (p.lv ? ' <span class="pr-lv l' + p.lv + '">Score ' + p.lv + '</span>' : '') + '</div><div class="pr-q">' + p.q + '</div>' +
        (p.fig ? '<img class="pr-fig" src="' + p.fig + '" alt="Figure for problem ' + p.n + '" loading="lazy"' +
          (p.size ? ' width="' + Math.round(p.size[0] / 2) + '" height="' + Math.round(p.size[1] / 2) + '"' : '') + '>' : '') +
        '<div class="pr-row"><input class="pr-in" type="text" autocomplete="off" autocapitalize="off" spellcheck="false"' + (!TAP[id] && /[<>≤≥]/.test(stripHtml(p.ans).replace(/&lt;/g, '<').replace(/&gt;/g, '>')) ? ' data-ineq' : '') + ' aria-label="Answer to ' + sec.title.replace(/"/g, '') + ' problem ' + p.n + '">' +
        '<button class="pr-btn pr-check" type="button"' + (TAP[id] ? ' hidden' : '') + '>Check</button>' +
        '<button class="pr-btn pr-ghost pr-hint" type="button">Hint</button>' +
        '<button class="pr-btn pr-ghost pr-show" type="button" hidden>Show answer</button></div>' +
        '<div class="pr-fb" role="status" aria-live="polite"></div><div class="pr-hintbox" hidden>💡 ' + sec.hint + '</div></div>');
    });
  });
  html.push('<div class="pr-tips"><b>Typing a number:</b> fractions with / (1/9 or 2 1/3), negatives with - (-4), decimals with a point (6.5).</div>');
  html.push('<div id="ss-mount"></div>');
  root.innerHTML = html.join('');
  document.getElementById('prTotal').textContent = total;
  // tap choices: a tap puts the choice in the (hidden) box and presses Check
  Object.keys(TAP).forEach(function (id) { var card = document.getElementById(id), inp = card.querySelector('.pr-in');
    TAP[id].ui = TapAnswers.mount(inp, TAP[id].list, { onPick: function () { card.querySelector('.pr-check').click(); } }); });
  window.PracticeEngine = { check: check, tap: TAP };

  function answered() { document.getElementById('prScore').textContent = root.querySelectorAll('.pr-card.done, .pr-card.shown').length; }
  function find(si, n) { var s = data.secs[si]; for (var i = 0; i < s.probs.length; i++) if (String(s.probs[i].n) === String(n)) return s.probs[i]; }
  root.addEventListener('click', function (e) {
    var b = e.target.closest('.pr-btn'); if (!b) return;
    var card = b.closest('.pr-card'), si = Number(card.dataset.si), n = card.id.split('p')[1], sec = data.secs[si], p = find(si, n);
    var fb = card.querySelector('.pr-fb'), inp = card.querySelector('.pr-in');
    if (b.classList.contains('pr-hint')) { card.querySelector('.pr-hintbox').hidden = false; return; }
    if (b.classList.contains('pr-show')) {
      fb.className = 'pr-fb show'; fb.innerHTML = 'Answer: <b>' + p.ans + '</b>';
      if (TAP[card.id] && TAP[card.id].ui) { TAP[card.id].ui.mark(TAP[card.id].right, true); TAP[card.id].ui.lock(); }
      card.classList.add('shown'); b.hidden = true; answered();
      try { if (window.ScoreSend) ScoreSend.revealed(); } catch (x) {}
      return;
    }
    if (card.classList.contains('done')) return;
    var v = inp.value.trim(); if (!v) { if (!TAP[card.id]) inp.focus(); fb.className = 'pr-fb tip'; fb.textContent = TAP[card.id] ? 'Tap your answer first.' : 'Type your answer first.'; if (window.FX) FX.mark('warn'); return; }
    var tap = TAP[card.id], ok = tap ? v === tap.right : (check(v, p.ans) || (p.alt || []).some(function (x) { return check(v, x); })), tries = Number(card.dataset.tries || 0) + 1;
    if (tap && tap.ui) { tap.ui.mark(v, ok); if (ok) tap.ui.lock(); }
    card.dataset.tries = tries;
    try { if (window.ScoreSend) ScoreSend.record(card.id, ok, { std: sec.std, band: 3, label: sec.title.replace(/^[A-Z]\.\s*/, '') + ' #' + p.n }); } catch (x) {}
    if (ok) {
      card.classList.add('done'); inp.readOnly = true;
      fb.className = 'pr-fb ok'; fb.innerHTML = '✓ Correct!' + (tries === 1 ? '' : ' (on try ' + tries + ')');
      answered();
      card.querySelector('.pr-show').hidden = true;
    } else {
      var TA = window.TapAnswers, wy = !TA ? '' : tap ? (TA.why(tap.list, v) || TA.miss(p.ans, p.q)) : TA.numWhy(v, p.ans, p.q);   // name the mistake
      fb.className = 'pr-fb no'; fb.textContent = (tries === 1 ? 'Not yet. ' : 'Still not it. ') + (wy || 'Check your work and try again.') + (tries === 1 ? '' : ' Try the hint, or show the answer.');
      if (tries >= 2) card.querySelector('.pr-show').hidden = false;
      if (!tap) inp.select();
    }
  });
  root.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.classList.contains('pr-in')) e.target.closest('.pr-card').querySelector('.pr-check').click();
  });
  // step-by-step workspace (pick a move, write the next line, instant feedback) for equations, inequalities,
  // word problems (Unit 3) and angle problems (Unit 4); see ../step-work.js
  if (!window.StepWork) {
    var sw = document.createElement('script'); sw.src = (ENGINE_SRC || '').replace(/practice\/practice-engine\.js.*$/, 'step-work.js?v=20261111a'); document.body.appendChild(sw);
  } else window.StepWork.auto();
  // one problem at a time, with Back / Next (see ../one-at-a-time.js)
  if (!window.__oat) { var oat = document.createElement('script'); oat.src = (ENGINE_SRC || '').replace(/practice\/practice-engine\.js.*$/, 'one-at-a-time.js?v=20261111b'); document.body.appendChild(oat); }
  // tap buttons for x < > ≤ ≥ − (Chromebooks can't type ≤ and ≥)
  if (document.querySelector('.pr-in[data-ineq]') && !window.__ineqKeys) {
    var ik = document.createElement('script'); ik.src = (ENGINE_SRC || '').replace(/practice\/practice-engine\.js.*$/, 'ineq-keys.js'); document.body.appendChild(ik);
  }
})();
