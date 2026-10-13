/* paper.js — turns an interactive guided-notes page into a PAPER version for printing.
   Turned on only when the page address has ?paper=1   (add &key=1 for the answer key).
   Used by the PDF makers in _build (e.g. node _build/u3_notes_pdf.js). Students on the website never see it.

   What changes on paper:
   • no "click to reveal" boxes, buttons, inputs, or Send panel
   • worked examples: the starting equation, then "Step 1: …", "Step 2: …" each with room to write
   • practice problems: room to show work + "Answer: ____"
   • fill-in blanks become lines; multiple choice becomes ○ circles; matching becomes letter blanks
   • answer key: the same pages with the FINAL answers filled in (green)                                  */
(function () {
  var q = location.search;
  if (!/[?&]paper=1/.test(q)) return;
  var KEY = /[?&]key=1/.test(q);

  var CSS = [
    'body.paper{background:#fff!important}',
    'body.paper #site-bar,body.paper #scoresend,body.paper .back-link,body.paper .topic-nav,body.paper .reveal-all,body.paper .sa-btn,',
    'body.paper .match-reset,body.paper .vw-btns,body.paper .vw-show,body.paper .val-chk,body.paper .chk-fb,body.paper .pp-hide,body.paper .match-status{display:none!important}',
    'body.paper .topic{box-shadow:none!important;border:1.5px solid #B8C0CF!important;break-inside:auto}',
    'body.paper .chk,body.paper .sa,body.paper .vw,body.paper .pp-block,body.paper table,body.paper .eqfig,body.paper .key,body.paper .note{break-inside:avoid}',
    'body.paper h2,body.paper h3{break-after:avoid}',
    'body.paper .blank{display:inline-block;min-width:1.1in;border-bottom:2px solid #1E2D4F!important;background:transparent!important;color:transparent!important;cursor:default}',
    'body.paper.paper-key .blank{color:#15803D!important;font-weight:700}',
    'body.paper .vw-after{display:block!important}body.paper .vw-after .vw-afterbody{display:block!important}',
    'body.paper .vw-box{width:100%;border-color:#C9D0DD}',
    '.pp-name{display:flex;gap:18px;flex-wrap:wrap;font:600 14px Inter,system-ui,sans-serif;color:#1E2D4F;margin:6px 0 14px}',
    '.pp-name span{flex:1;min-width:1.4in;border-bottom:1.5px solid #1E2D4F;padding-bottom:2px}',
    '.pp-keybar{background:#15803D;color:#fff;font:700 16px Inter,system-ui,sans-serif;text-align:center;padding:8px;border-radius:8px;margin:6px 0 12px;letter-spacing:.06em}',
    '.pp-mc{list-style:none;padding:0;margin:8px 0 2px}.pp-mc li{margin:5px 0;font-size:.95em}',
    '.pp-mc li .o{display:inline-block;width:15px;height:15px;border:2px solid #1E2D4F;border-radius:50%;vertical-align:-3px;margin-right:8px}',
    '.pp-mc li.ok .o{background:#15803D;border-color:#15803D}.pp-mc li.ok{color:#15803D;font-weight:700}',
    '.pp-match{display:grid;grid-template-columns:1fr 1fr;gap:6px 24px;margin:8px 0}.pp-match div{font-size:.95em}',
    '.pp-match .bl{display:inline-block;width:.5in;border-bottom:2px solid #1E2D4F;text-align:center;color:#15803D;font-weight:700;margin-right:8px}',
    '.pp-lines{margin:8px 0 4px}.pp-lines div{height:.36in;border-bottom:1.2px solid #AEB6C6}',
    '.pp-wp div.pp-row{margin:6px 0;font-size:.95em}.pp-wp .pp-line{display:inline-block;min-width:2.4in;border-bottom:2px solid #1E2D4F;color:#15803D;font-weight:700;padding:0 4px}',
    '.pp-space-lg{height:1.4in}',
    '.pp-nl{display:block;margin:8px auto 2px;max-width:330px}',
    '.pp-cap{font-size:.85rem;color:#4a5570;font-weight:600;text-align:center}'
  ].join('\n');

  function txt(s) { return String(s).replace(/<=/g, '≤').replace(/>=/g, '≥').replace(/-/g, '−'); }
  function blankLine(n) { var h = '<div class="pp-lines">'; for (var i = 0; i < n; i++) h += '<div></div>'; return h + '</div>'; }
  function blankNumberLine() {
    var W = 320, h = '<svg class="pp-nl" viewBox="-14 0 ' + (W + 28) + ' 44" width="100%" role="img" aria-label="blank number line">';
    h += '<line x1="0" y1="20" x2="' + W + '" y2="20" stroke="#1E2D4F" stroke-width="2.5"/>';
    h += '<path d="M-8,20 L4,13 L4,27Z M' + (W + 8) + ',20 L' + (W - 4) + ',13 L' + (W - 4) + ',27Z" fill="#1E2D4F"/>';
    for (var i = 0; i <= 12; i++) { var x = 16 + i * (W - 32) / 12; h += '<line x1="' + x + '" y1="13" x2="' + x + '" y2="27" stroke="#1E2D4F" stroke-width="2"/>'; }
    return h + '</svg>';
  }
  function dropClickSentences(el) {
    if (!el) return;
    var t = el.innerHTML, parts = t.split(/(?<=[.!])\s+/);
    var keep = parts.filter(function (p) { return !/click|on screen|then check|type (just|like|the)|reveal/i.test(p.replace(/<[^>]+>/g, '')); });
    if (keep.length !== parts.length) el.innerHTML = keep.join(' ');
  }

  function run() {
    document.body.classList.add('paper'); if (KEY) document.body.classList.add('paper-key');
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    var hdr = document.querySelector('.page-hdr') || document.querySelector('h1');
    if (hdr) {
      var top = KEY ? '<div class="pp-keybar">ANSWER KEY</div>' : '<div class="pp-name"><span>Name</span><span style="flex:.5">Date</span><span style="flex:.35">Period</span></div>';
      (hdr.querySelector('h1') || hdr).insertAdjacentHTML('afterend', top);
    }
    // links to the PDFs / practice page are no use on paper
    document.querySelectorAll('a[href$=".pdf"],a[href$="Notes.html"]').forEach(function (a) { var p = a.parentElement; if (p && p.querySelectorAll('a').length === p.children.length) p.classList.add('pp-hide'); else a.classList.add('pp-hide'); });
    // instructions that talk about clicking
    document.querySelectorAll('.intro p,.blank-tip,.topic .key,.topic .note').forEach(dropClickSentences);
    var pk = document.querySelector('#practice .key'); if (pk) pk.innerHTML = '<strong>📌 Show every step on its own line.</strong> Box your final answer.';
    document.querySelectorAll('h3.sub').forEach(function (h) { h.innerHTML = h.innerHTML.replace(/\s*\((type|click)[^)]*\)/i, ''); });
    var intro = document.querySelector('.intro p');
    if (intro) intro.innerHTML = KEY ? 'Answer key: every blank and final answer is filled in green.'
      : 'Fill in the blanks as we go. For every example and problem, <b>write each step on its own line</b> in the space given, and box your final answer.';

    // fill-in blanks
    document.querySelectorAll('.blank').forEach(function (b) { b.textContent = KEY && b.dataset.ans !== undefined ? b.dataset.ans : ' '; b.removeAttribute('onclick'); });

    // multiple choice
    document.querySelectorAll('.chk-opts').forEach(function (box) {
      var btns = box.querySelectorAll('.chk-btn'), h = '<ol class="pp-mc">', ok = null;
      btns.forEach(function (b) { var m = (b.getAttribute('onclick') || '').match(/chk\('[^']*','([^']*)'/); if (m) ok = m[1]; });
      btns.forEach(function (b) { var t = b.textContent.trim(); h += '<li class="' + (KEY && t === ok ? 'ok' : '') + '"><span class="o"></span>' + t + '</li>'; });
      box.outerHTML = h + '</ol>';
    });

    // matching game → number / letter blanks
    document.querySelectorAll('.match').forEach(function (m) {
      var cols = m.children, Ls = cols[0].querySelectorAll('.match-item'), Rs = cols[1].querySelectorAll('.match-item'), letter = {}, h = '<div class="pp-match">';
      Rs.forEach(function (r, i) { var k = ((r.getAttribute('onclick') || '').match(/,'([a-z])'\)/) || [])[1]; letter[k] = String.fromCharCode(65 + i); });
      var n = Math.max(Ls.length, Rs.length);
      for (var i = 0; i < n; i++) {
        var L = Ls[i], R = Rs[i];
        h += '<div>' + (L ? '<span class="bl">' + (KEY ? letter[L.dataset.key] || '' : '') + '</span>' + (i + 1) + '. ' + L.textContent.trim() : '') + '</div>';
        h += '<div>' + (R ? '<b>' + String.fromCharCode(65 + i) + '.</b> ' + R.textContent.trim() : '') + '</div>';
      }
      m.outerHTML = h + '</div>';
    });
    document.querySelectorAll('.chk-q').forEach(function (c) { if (/Click an operation/.test(c.textContent)) c.innerHTML = c.innerHTML.replace(/Click an operation, then its inverse\./, 'Write the letter of each operation’s inverse on the line.'); });

    // short answer / error analysis / word problems
    document.querySelectorAll('.sa').forEach(function (sa) {
      var ans = sa.querySelector('.sa-ans'); if (!ans) return;
      var wp = ans.querySelector('.wp-let');
      if (wp) {
        var let_ = ans.querySelector('.wp-let'), eqn = ans.querySelector('.wp-eq'), fin = ans.querySelector('.wp-ans');
        var lv = let_.innerHTML.replace(/<b>Let<\/b>\s*/, ''), ev = eqn.innerHTML.replace(/<b>Equation:<\/b>\s*/, ''), av = fin.innerHTML.replace(/<b>Answer:<\/b>\s*/, '');
        sa.insertAdjacentHTML('beforeend', '<div class="pp-block pp-wp">' +
          '<div class="pp-row"><b>Let</b> <span class="pp-line">' + (KEY ? lv : '&nbsp;') + '</span></div>' +
          '<div class="pp-row"><b>Equation:</b> <span class="pp-line">' + (KEY ? ev : '&nbsp;') + '</span></div>' +
          '<div class="pp-row"><b>Solve (show each step):</b></div><div class="pp-space-lg"></div>' +
          '<div class="pp-row"><b>Answer:</b> <span class="pp-line">' + (KEY ? av : '&nbsp;') + '</span></div></div>');
        ans.classList.add('pp-hide');
      } else if (KEY) {
        ans.style.display = 'block'; ans.querySelectorAll('.vw').forEach(function (v) { v.classList.add('pp-hide'); });
      } else {
        ans.classList.add('pp-hide'); sa.insertAdjacentHTML('beforeend', '<div class="pp-block">' + blankLine(3) + '</div>');
      }
    });

    // worked examples and practice: vertical work → Step 1, Step 2 … with room to write
    var V = window.VWORK;
    document.querySelectorAll('.vw').forEach(function (el) {
      if (el.closest('.sa-ans')) return;
      var inPractice = !!el.closest('.vw-after');
      if (V && V.paper) V.paper(el, { key: KEY, labels: !inPractice });
      if (inPractice) { var g = el.querySelector('.vw-g'); if (g) g.style.display = 'none'; }
    });
    // practice: show the work area, drop the typed-answer box
    document.querySelectorAll('.vw-after').forEach(function (w) { w.classList.add('ready', 'open'); });
    // number lines that SHOW an answer: blank copy on the student page
    if (!KEY) {
      document.querySelectorAll('.vw-after .eqfig, .diagram .eqfig').forEach(function (f) {
        if (!f.querySelector('[data-eq*="nline"]')) return;
        if (f.closest('.diagram') && !(f.closest('.diagram').previousElementSibling || {}).classList) return;
        var prev = f.closest('.diagram') ? f.closest('.diagram').previousElementSibling : null;
        if (prev && !(prev.classList.contains('vw'))) return;   // only the number line right after a worked example
        f.innerHTML = '<div class="pp-cap">Graph the answer:</div>' + blankNumberLine();
      });
    }
    if (V && V.relayout) setTimeout(V.relayout, 50);
    document.documentElement.setAttribute('data-paper-ready', '1');
  }
  if (document.readyState === 'complete') setTimeout(run, 60); else window.addEventListener('load', function () { setTimeout(run, 60); });
})();
