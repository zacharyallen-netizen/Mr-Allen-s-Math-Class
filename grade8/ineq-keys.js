/* ───────────────────────────────────────────────────────────────
   INEQUALITY KEYS — tap buttons for x  <  >  ≤  ≥  −
   Chromebooks have no easy way to type ≤ and ≥, so every inequality
   answer box (placeholder "e.g. x > 4", or data-ineq) gets a small row
   of buttons under it. Tapping a button types that symbol where the
   cursor is. Works for boxes the page builds later, too.
     <script src="ineq-keys.js"></script>
   ─────────────────────────────────────────────────────────────── */
(function () {
  if (window.__ineqKeys) return; window.__ineqKeys = true;
  var KEYS = [['x', 'x'], ['<', '<'], ['>', '>'], ['≤', '≤'], ['≥', '≥'], ['−', '−']];
  var css = document.createElement('style');
  css.textContent =
    '.ik-row{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 2px;align-items:center}' +
    '.ik-row .ik-l{font:600 12px/1.2 Inter,system-ui,sans-serif;color:#5B6475;margin-right:2px}' +
    '.ik-row button{min-width:44px;height:44px;padding:0 10px;border:1.5px solid #1E2D4F;border-radius:8px;background:#fff;color:#1E2D4F;' +
    'font:600 17px/1 "JetBrains Mono",ui-monospace,monospace;cursor:pointer}' +
    '.ik-row button:hover{background:#FFF6D6}.ik-row button:active{transform:translateY(1px)}' +
    '.ik-row button.ik-bs{font:600 13px/1 Inter,system-ui,sans-serif}';
  document.head.appendChild(css);

  function isIneq(inp) {
    if (inp.hasAttribute('data-ineq') || /x\s*[<>]/.test(inp.getAttribute('placeholder') || '')) return true;
    var q = inp.closest('[data-ans]');                                   // notes practice (notes-practice.js)
    if (q && /[<>≤≥]/.test(q.getAttribute('data-ans'))) return true;
    var host = inp.parentNode, b = host && host.querySelector('button[onclick]');   // notes check boxes: chkVal('id',["x>3"])
    return !!(b && /chkVal\([^)]*["'][^"']*(x\s*[<>≤≥]|[<>≤≥]\s*x)/.test(b.getAttribute('onclick')));
  }
  function put(inp, text) {
    var s = inp.selectionStart, e = inp.selectionEnd, v = inp.value;
    if (s == null || document.activeElement !== inp) { s = e = v.length; }
    if (text === null) {                       // backspace
      if (s === e && s > 0) s--;
      inp.value = v.slice(0, s) + v.slice(e); e = s;
    } else {
      var pad = (text === 'x' || text === '−') ? text : ' ' + text + ' ';
      inp.value = (v.slice(0, s) + pad + v.slice(e)).replace(/\s{2,}/g, ' ').replace(/^\s+/, '');
      e = Math.min(inp.value.length, s + pad.length);
    }
    inp.focus();
    try { inp.setSelectionRange(e, e); } catch (err) {}
    inp.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function attach(inp) {
    if (inp.__ik || !isIneq(inp)) return; inp.__ik = true;
    var row = document.createElement('div'); row.className = 'ik-row';
    row.innerHTML = '<span class="ik-l">Tap to type:</span>';
    KEYS.forEach(function (k) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = k[0];
      b.setAttribute('aria-label', 'Type ' + ({'≤': 'less than or equal to', '≥': 'greater than or equal to', '<': 'less than', '>': 'greater than', '−': 'negative sign', 'x': 'x'})[k[0]]);
      b.addEventListener('mousedown', function (ev) { ev.preventDefault(); });   // keep the cursor in the box
      b.addEventListener('click', function () { put(inp, k[1]); });
      row.appendChild(b);
    });
    var bs = document.createElement('button'); bs.type = 'button'; bs.className = 'ik-bs'; bs.textContent = '⌫ Erase'; bs.setAttribute('aria-label', 'Erase one character');
    bs.addEventListener('mousedown', function (ev) { ev.preventDefault(); });
    bs.addEventListener('click', function () { put(inp, null); });
    row.appendChild(bs);
    var host = inp.closest('.row, .ans, .val-chk, .np-row, .pr-row') || inp;
    host.parentNode.insertBefore(row, host.nextSibling); row.__inp = inp;
  }
  // One shared bar for a group of answer boxes: <div data-ineq-bar> … inputs … </div>.
  // The buttons type into the box the student tapped last (or the first box).
  function attachBar(el) {
    if (el.__ikb) return; el.__ikb = true;
    el.addEventListener('focusin', function (ev) { if (ev.target.tagName === 'INPUT') el.__last = ev.target; });
    var row = document.createElement('div'); row.className = 'ik-row';
    row.innerHTML = '<span class="ik-l">Tap a box, then tap to type:</span>';
    function target() { return el.__last || el.querySelector('input'); }
    KEYS.concat([['⌫ Erase', null]]).forEach(function (k) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = k[0];
      if (k[1] === null) b.className = 'ik-bs';
      b.addEventListener('mousedown', function (ev) { ev.preventDefault(); });
      b.addEventListener('click', function () { var t = target(); if (t) put(t, k[1]); });
      row.appendChild(b);
    });
    var h = el.querySelector('h3, h4');
    if (h) h.parentNode.insertBefore(row, h.nextSibling); else el.insertBefore(row, el.firstChild);
    el.querySelectorAll('input').forEach(function (i) { i.__ik = true; }); row.__bar = el;
  }
  // a box that became tap choices (tap-answers.js hides it) needs no typing keys (review Nov 12, 2026)
  function gone(i) { return i.classList.contains('ta-hid') || i.type === 'hidden' || i.style.display === 'none'; }
  function tidy() {
    document.querySelectorAll('.ik-row').forEach(function (r) {
      var off = r.__inp ? gone(r.__inp) : r.__bar ? [].every.call(r.__bar.querySelectorAll('input'), gone) : false;
      if (r.hidden !== off) r.hidden = off;
    });
  }
  function scan() {
    document.querySelectorAll('[data-ineq-bar]').forEach(attachBar);
    document.querySelectorAll('input').forEach(attach);
    tidy();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan); else scan();
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
})();
