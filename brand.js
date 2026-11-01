/* ───────────────────────────────────────────────────────────────
   brand.js — gives every page the same look as the home page.
   One line in a page turns it on:  <script src="../brand.js"></script>

   • loads brand.css (fonts, page background, accent colors; screen only)
   • matches every font on the page to its job:
       headings → Source Serif 4    text → Inter    numbers/code → JetBrains Mono
   It never changes words, numbers, pictures (SVG), or right/wrong colors.
   It does nothing on the paper/PDF version of a page (?paper=1).
   ─────────────────────────────────────────────────────────────── */
(function () {
  if (/[?&]paper=1/.test(location.search)) return;

  var me = document.currentScript && document.currentScript.src;
  var base = me ? me.replace(/brand\.js(\?.*)?$/, '') : '';
  var link = document.createElement('link');
  link.rel = 'stylesheet'; link.media = 'screen'; link.href = base + 'brand.css';
  document.head.appendChild(link);

  var SERIF = "'Source Serif 4', Georgia, 'Times New Roman', serif";
  var SANS = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
  var MONO = "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace";
  var MONO_RE = /mono|courier|consolas|menlo|monaco|monospace/i;
  var HEAD_RE = /^H[1-4]$/;

  function isHeading(el) {
    for (var e = el; e && e !== document.body; e = e.parentElement) if (HEAD_RE.test(e.tagName)) return true;
    return false;
  }
  function fix(el) {
    if (el.namespaceURI === 'http://www.w3.org/2000/svg' || el.closest('svg')) return;   // pictures keep their fonts
    var tag = el.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'BR' || tag === 'IMG') return;
    var fam = getComputedStyle(el).fontFamily || '';
    var want = MONO_RE.test(fam.split(',')[0]) ? MONO : isHeading(el) ? SERIF : SANS;
    if (el.style.getPropertyValue('font-family') !== want) el.style.setProperty('font-family', want, 'important');
  }
  function run(root) {
    if (!root || root.nodeType !== 1) return;
    fix(root);
    var all = root.getElementsByTagName('*');
    for (var i = 0; i < all.length; i++) fix(all[i]);
  }

  function start() {
    if (document.body && document.body.dataset.brand === 'off') return;
    // page-level font first, so everything inherits it
    document.body.style.setProperty('font-family', SANS, 'important');
    run(document.body);
    // quizzes and games add new parts while you use them
    var queue = [], timer = null;
    new MutationObserver(function (list) {
      list.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) queue.push(n); }); });
      if (!timer) timer = setTimeout(function () { var q = queue; queue = []; timer = null; q.forEach(run); }, 30);
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
