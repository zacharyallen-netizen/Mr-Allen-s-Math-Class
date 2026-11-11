/* PRE-TESTS: tap or number (Nov 11, 2026, Mr. Allen: "The answer should be a number or a multiple choice answer").
   Runs after a pre-test page has drawn its questions (QS). For each question whose answer is not one number, the typed
   box becomes tap choices (tap-answers.js). The page's own checker still grades. A question keeps its typed box only if no
   rule fits or if the page's checker would not accept exactly one of the choices (then PretestTap.typed lists it).
   Mr. Allen's rules (Nov 11, 2026): every answer is graded RIGHT AWAY (a tap, or a number + Check/Enter, presses the page's
   own "Check answers", which skips blank questions); a wrong answer gets a note that NAMES the mistake; every question has
   a Hint button. Send my work still gets one try per answer: checking again without changing an answer is not a new try. */
(function () {
  "use strict";
  if (!window.TapAnswers || /[?&](paper|key)=1/.test(location.search)) return;   // printed copies keep their blank lines
  if (typeof QS === 'undefined') {                 // the Unit 1 pre-tests: "type R or IR" becomes Rational / Irrational (the card's own Check grades it)
    var U1 = [];
    [].forEach.call(document.querySelectorAll('input.answer'), function (inp) {
      var cls = false; try { cls = typeof inp._check === 'function' && (inp._check('Rational') || inp._check('Irrational')) && !inp._check('5'); } catch (e) {}
      if (!cls) { if (!inp.placeholder) inp.placeholder = 'Type a number'; return; }
      U1.push(TapAnswers.mount(inp, ['Rational', 'Irrational'], { onPick: function () { var c = inp.parentNode.parentNode, b = c && c.querySelector('.check-btn'); if (b) b.click(); } }));
      var card = inp.parentNode.parentNode, cb = card && card.querySelector('.check-btn'); if (cb) cb.hidden = true;      // a tap checks it
      if (card) [].forEach.call(card.querySelectorAll('*'), function (el) { if (!el.children.length && /R or IR/i.test(el.textContent)) el.textContent = el.textContent.replace(/type R or IR/i, 'tap one').replace(/then R or IR/i, 'then tap one'); });
    });
    [].forEach.call(document.querySelectorAll('#quiz section.q'), function (card) {
      var pr = card.querySelector('.q-prompt'), qt = pr ? pr.innerHTML : '', btn = card.querySelector('.check-btn'), fb = card.querySelector('.feedback'); if (!btn) return;
      var tapped = !!card.querySelector('.ta-row'), hb = TapAnswers.hintButton(card, TapAnswers.hint(tapped ? 'Rational' : '', qt));
      if (btn.hidden) { hb.style.marginTop = '8px'; btn.parentNode.parentNode.insertBefore(hb, btn.parentNode); } else { hb.style.marginLeft = '8px'; btn.parentNode.appendChild(hb); }
      var say = function () { TapAnswers.note(card, card.classList.contains('incorrect') ? TapAnswers.miss(tapped ? 'Rational' : '', qt) : '', 'why'); };
      btn.addEventListener('click', say); [].forEach.call(card.querySelectorAll('input'), function (i) { i.addEventListener('keydown', function (e) { if (e.key === 'Enter') setTimeout(say, 0); }); });
    });
    var rs1 = document.getElementById('reset'); if (rs1) rs1.addEventListener('click', function () { [].forEach.call(document.querySelectorAll('#quiz .ta-why'), function (n) { n.remove(); }); U1.forEach(function (u) { if (u) u.buttons.forEach(function (b) { b.classList.remove('sel', 'ok', 'no'); }); }); });
    window.PretestTap = { u1: U1, typed: [] }; return;
  }
  // the page's own checker: most pre-tests have runCheck(chk, text); the Unit 2 exponents pre-test has accepts(q) + canon(text)
  var grade = typeof runCheck === 'function' ? function (q, t) { return runCheck(q.chk, t); } : (typeof accepts === 'function' && typeof canon === 'function') ? function (q, t) { return accepts(q).has(canon(t)); } : null;
  if (!grade) return;
  var UI = {}, TYPED = [], LIST = {}, DISP = {}, page = location.pathname.split('/').pop(), checkBtn = document.getElementById('check'), last = {}, SENT = {};
  // one try per answer: checking the same answer again is not recorded again
  if (window.ScoreSend && ScoreSend.record) { var rec0 = ScoreSend.record; ScoreSend.record = function (id) { var m = /^q(\d+)$/.exec(String(id)), inp = m && document.getElementById('i' + m[1]);
    if (inp) { var v = String(id) + '=' + inp.value.trim(); if (last[id] === v) return; last[id] = v; } SENT[id] = (SENT[id] || 0) + 1; return rec0.apply(this, arguments); }; }
  function now() { if (checkBtn) checkBtn.click(); }                                   // grade right away with the page's own check
  // questions no rule covers: the page's own choices (the page's checker still decides which one is right)
  var EXTRA = {
    'unit7-pretest.html': { 3: ['Outlier', 'Cluster', 'Trend line', 'Slope'], 4: ['Scatterplot', 'Bar graph', 'Two-way table', 'Number line'], 6: ['Best fit', 'Slope', 'Symmetry', 'Outliers'], 16: ['Outlier', 'Cluster', 'Trend line', 'Slope'], 17: ['$4,000', '$50,000', '$46,000', '$400'] },
    'unit8-pretest.html': { 15: ['Larger', 'Smaller', 'The same size'] },
    'unit9-pretest.html': { 17: ['1/3', '1/2', '2/3', '3'], 18: ['The cylinder', 'The sphere', 'They are the same'] }
  }[page] || {};
  QS.forEach(function (q) {
    var inp = document.getElementById('i' + q.id); if (!inp) return;
    var disp = TapAnswers.plain(q.disp);
    if (q.chk && q.chk[0] === 'sci') disp = disp.replace(/^.*\u2192\s*/, '').replace(/\s*\(.*\)\s*$/, '').replace(/\s+[a-z]+\s*$/i, '');   // "24 × 10⁻⁸ → 2.4 × 10⁻⁷ g" → the final form
    var qt = (q.op || '') + ' ' + q.expr, list = TapAnswers.choices(disp, { q: qt, key: page + q.id, choices: q.choices || EXTRA[q.id] }), div = document.getElementById('q' + q.id), fbq = document.getElementById('fb' + q.id);
    DISP[q.id] = [disp, qt];
    if (div && fbq) { var hb = TapAnswers.hintButton(div, TapAnswers.hint(disp, qt)); hb.style.marginTop = '8px'; div.insertBefore(hb, fbq); }      // a Hint on every question
    if (list === null) { if (!inp.placeholder) inp.placeholder = 'Type a number';
      var cb = document.createElement('button'); cb.type = 'button'; cb.className = 'pt-check'; cb.textContent = 'Check'; cb.style.cssText = 'margin-left:8px;font:600 14px Inter,system-ui,sans-serif;background:#1E2D4F;color:#fff;border:1.5px solid #1E2D4F;border-radius:8px;padding:6px 14px;min-height:38px;cursor:pointer'; cb.addEventListener('click', now);
      inp.parentNode.appendChild(cb); return; }
    if (!list) { TYPED.push([q.id, 'no rule', disp]); return; }
    var pass = list.filter(function (t) { try { return grade(q, t); } catch (e) { return false; } });
    if (pass.length !== 1) { TYPED.push([q.id, 'checker', list, pass]); return; }
    if (EXTRA[q.id] && !/\d/.test(list.join(''))) list.why = { '*': 'That word means something else. Read the vocabulary list again and match the word to its meaning.' };
    LIST[q.id] = list; UI[q.id] = TapAnswers.mount(inp, list, { onPick: now });
    var lab = inp.parentNode.querySelector('label'); if (lab && /answer/i.test(lab.textContent)) lab.textContent = 'Tap one:';
  });
  // "parts of a number in scientific notation" blanks (Unit 2): tap the word
  [].forEach.call(document.querySelectorAll('input.partin[data-ans]'), function (inp, i) { UI['part' + i] = TapAnswers.mount(inp, ['Coefficient', 'Base', 'Exponent'], { onPick: now }); });
  [].forEach.call(document.querySelectorAll('#vocab select'), function (sel) { sel.addEventListener('change', now); });                 // vocabulary: graded when picked
  // after every check: color the tapped choice and name the mistake under each wrong answer
  if (checkBtn) checkBtn.addEventListener('click', function () {
    QS.forEach(function (q) { var div = document.getElementById('q' + q.id), inp = document.getElementById('i' + q.id); if (!div || !inp) return;
      var v = inp.value.trim(), bad = div.classList.contains('wrong') && v, ui = UI[q.id], d = DISP[q.id] || ['', ''];
      if (ui) ui.buttons.forEach(function (b) { b.classList.remove('ok', 'no'); if (v && b.getAttribute('data-t') === v) { b.classList.remove('sel'); b.classList.add(bad ? 'no' : 'ok'); } });
      TapAnswers.note(div, !bad ? '' : ui ? (TapAnswers.why(LIST[q.id], v) || TapAnswers.miss(d[0], d[1])) : TapAnswers.numWhy(v, d[0], d[1]), 'why'); });
  });
  var rs = document.getElementById('reset');
  if (rs) rs.addEventListener('click', function () { last = {}; Object.keys(UI).forEach(function (k) { UI[k].buttons.forEach(function (b) { b.classList.remove('sel', 'ok', 'no'); }); }); [].forEach.call(document.querySelectorAll('.q > .ta-why'), function (n) { n.remove(); }); });
  window.PretestTap = { ui: UI, typed: TYPED, grade: grade, sent: SENT };
})();
