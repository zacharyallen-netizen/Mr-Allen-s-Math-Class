/* 7th Grade notes helpers (Nov 20, 2026): click-to-reveal blanks and worked-example steps,
   the same behavior as the 8th grade notes (rb / rbAll / reveal / revealAll). The answer key (?paper=1&key=1)
   shows every blank and step. */
function reveal(el) { el.classList.add('revealed'); }
function revealAll(id) { document.querySelectorAll('[data-example="' + id + '"] .step').forEach(function (s) { s.classList.add('revealed'); }); }
function rb(el) { el.classList.add('revealed'); if (el.dataset.ans !== undefined) el.textContent = el.dataset.ans; }
function rbAll(id) { document.querySelectorAll('#' + id + ' .blank').forEach(function (b) { rb(b); }); }
(function () {
  var q = new URLSearchParams(location.search);
  if (q.get('paper') === '1' && q.get('key') === '1') document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.blank').forEach(rb); document.querySelectorAll('.step').forEach(reveal);
  });
  document.addEventListener('keydown', function (e) {
    var t = e.target; if (!t || !t.classList) return;
    if ((e.key === 'Enter' || e.key === ' ') && (t.classList.contains('blank') || t.classList.contains('step'))) { e.preventDefault(); t.click(); }
  });
})();
