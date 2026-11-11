/* PRE-TESTS: tap or number (Nov 11, 2026, Mr. Allen: "The answer should be a number or a multiple choice answer").
   Runs after a pre-test page has drawn its questions (QS). For each question whose answer is not one number, the typed
   box becomes tap choices (tap-answers.js). A tap only picks the answer: the page's own "Check answers" button still grades
   everything at once, exactly as before, with the page's own checker. A question keeps its typed box only if no rule fits
   or if the page's checker would not accept exactly one of the choices (then PretestTap.typed lists it). */
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
    window.PretestTap = { u1: U1, typed: [] }; return;
  }
  // the page's own checker: most pre-tests have runCheck(chk, text); the Unit 2 exponents pre-test has accepts(q) + canon(text)
  var grade = typeof runCheck === 'function' ? function (q, t) { return runCheck(q.chk, t); } : (typeof accepts === 'function' && typeof canon === 'function') ? function (q, t) { return accepts(q).has(canon(t)); } : null;
  if (!grade) return;
  var UI = {}, TYPED = [], page = location.pathname.split('/').pop();
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
    var list = TapAnswers.choices(disp, { q: (q.op || '') + ' ' + q.expr, key: page + q.id, choices: q.choices || EXTRA[q.id] });
    if (list === null) { if (!inp.placeholder) inp.placeholder = 'Type a number'; return; }
    if (!list) { TYPED.push([q.id, 'no rule', disp]); return; }
    var pass = list.filter(function (t) { try { return grade(q, t); } catch (e) { return false; } });
    if (pass.length !== 1) { TYPED.push([q.id, 'checker', list, pass]); return; }
    UI[q.id] = TapAnswers.mount(inp, list, {});
    var lab = inp.parentNode.querySelector('label'); if (lab && /answer/i.test(lab.textContent)) lab.textContent = 'Tap one:';
  });
  // "parts of a number in scientific notation" blanks (Unit 2): tap the word
  [].forEach.call(document.querySelectorAll('input.partin[data-ans]'), function (inp, i) { UI['part' + i] = TapAnswers.mount(inp, ['Coefficient', 'Base', 'Exponent'], {}); });
  var rs = document.getElementById('reset');
  if (rs) rs.addEventListener('click', function () { Object.keys(UI).forEach(function (k) { UI[k].buttons.forEach(function (b) { b.classList.remove('sel', 'ok', 'no'); }); }); });
  window.PretestTap = { ui: UI, typed: TYPED, grade: grade };
})();
