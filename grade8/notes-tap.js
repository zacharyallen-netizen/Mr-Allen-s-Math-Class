/* NOTES: tap or number (Nov 11, 2026, Mr. Allen: "The answer should be a number or a multiple choice answer").
   The typed "answer + Check" boxes in the notes (chkVal) become tap choices when the answer is not one number
   (tap-answers.js builds the wrong choices from common mistakes). A tap puts the answer in the page's own box and presses
   the page's own Check, so feedback, "Try a similar one" and Send my work work exactly as before.
   NotesTap.val(input, checkButton, acceptedAnswers, questionHtml, key) is also used for the similar-problem boxes
   (notes-flow.js). NotesTap.typed lists any box that had to stay typed. */
(function () {
  "use strict";
  if (!window.TapAnswers || /[?&](paper|key)=1/.test(location.search)) return;   // printed copies keep their blank lines
  var typed = [], count = { tap: 0, num: 0 };
  function N(t) { return String(t).toLowerCase().replace(/[−–—]/g, '-').replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, function (m) { return '^' + m.split('').map(function (c) { return c === '⁻' ? '-' : '⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(c); }).join(''); }).replace(/\s+/g, '').replace(/[×·*]/g, 'x').replace(/≤|=</g, '<=').replace(/≥|=>/g, '>=').replace(/\.$/, ''); }
  function val(inp, btn, answers, qHtml, key) {
    if (!inp || !btn || !answers || !answers.length || inp.dataset.taMounted) return;
    var first = String(answers[0]), own = inp.getAttribute('data-choices'), yn = first.match(/^(yes|no)\b\s*[—–-]/i);
    var gfirst = own ? inp.getAttribute('data-right') : yn ? yn[1] : first;                           // "Yes — 20² + 21² = 841 ..." is a Yes / No question
    var list = own ? own.split('|') : TapAnswers.choices(gfirst, { q: qHtml || '', key: location.pathname.split('/').pop() + key });
    var host = document.getElementById(key) || inp.parentNode, WY = null;
    // name the mistake after the page's own Check has graded it (its feedback box gets class w = wrong, c = right)
    function after(picked) { var f = document.getElementById('fb-' + key); if (!f) return;
      if (f.classList.contains('w')) TapAnswers.note(host, picked != null ? ((WY && TapAnswers.why(WY, picked)) || TapAnswers.miss(gfirst, qHtml)) : TapAnswers.numWhy(inp.value, first, qHtml), 'why');
      else if (f.classList.contains('c')) TapAnswers.note(host, '', 'why'); }
    if (list === null) { count.num++; if (!inp.placeholder || /^answer$/i.test(inp.placeholder)) inp.placeholder = 'Type a number'; btn.addEventListener('click', function () { if (inp.value.trim()) after(null); }); return; }
    if (!list) { typed.push([key, 'no rule', first]); return; }
    var right = own ? gfirst : TapAnswers.rightOf(list, gfirst), acc = answers.map(N);
    var clash = list.filter(function (t) { return t !== right && acc.indexOf(N(t)) >= 0; });
    if (!right || clash.length) { typed.push([key, 'checker', list, right]); return; }
    count.tap++;
    WY = list;
    TapAnswers.mount(inp, list, { onPick: function (t) { inp.value = t === right ? first : t; btn.click(); after(t); } });
    btn.style.display = 'none';
  }
  function scan(root) {
    [].forEach.call((root || document).querySelectorAll('button[onclick*="chkVal("]'), function (btn) {
      var m = (btn.getAttribute('onclick') || '').match(/chkVal\(\s*'([^']+)'\s*,\s*([\s\S]*)\)\s*;?\s*$/); if (!m) return;
      var ans; try { ans = (new Function('return ' + m[2]))(); } catch (e) { return; }
      var inp = document.getElementById(m[1] + '-in'), box = document.getElementById(m[1]), q = box && box.querySelector('.chk-q');
      val(inp, btn, [].concat(ans).map(String), q ? q.innerHTML : '', m[1]);
    });
  }
  /* a Hint button on every check box in the notes (tap, number, A/B/C or point boxes) */
  function hint(root) {
    [].forEach.call((root || document).querySelectorAll('.chk, .tw'), function (box) {
      if (box.closest('.np') || box.querySelector('.ta-hintbtn')) return;
      var fb = box.querySelector('.chk-fb'), q = box.querySelector('.chk-q, .np-prompt'); if (!fb || !fb.parentNode) return;
      var b = TapAnswers.hintButton(fb.parentNode, TapAnswers.hint('', q ? q.innerHTML : box.textContent.slice(0, 300))); b.style.margin = '6px 0 2px';
      fb.parentNode.insertBefore(b, fb);
    });
  }
  window.NotesTap = { val: val, scan: scan, hint: hint, typed: typed, count: count };
  function go() { scan(); hint(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
