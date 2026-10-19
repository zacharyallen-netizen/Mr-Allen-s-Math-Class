/* notes-practice.js — practice questions that live INSIDE each section of the guided notes,
   plus the comprehensive practice at the end. One look and one behavior on every notes page.

   Markup (write it right where the section ends):

   <div class="np" data-title="Two-Step Equations" [data-std="NC.8.EE.7"]>
     <div class="np-q" data-level="1" data-ans="4">                       ← level 1 ★ Try it, 2 ★★ On level, 3 ★★★ Challenge
       <div class="np-prompt">Solve: 2x + 3 = 11</div>
       [any figure / table / graph html]
       <div class="np-sol">2x + 3 − 3 = 11 − 3 → 2x = 8 → x = 4</div>     ← worked steps (shown after 2 misses, and in the answer key)
     </div>
     …
   </div>

   data-ans   accepted answers separated by | . Numbers are compared as numbers ("4" = "4.0" = "x = 4"),
              fractions a/b are allowed, spaces and the ° sign and units are ignored. data-tol="0.1" for rounding.
   data-choices="A|B|C"  → buttons instead of a box (data-ans = the right choice's text).
   data-hint  shown after the 1st miss (else a kind general nudge).
   no data-ans → a "Show answer" button only (explain / sketch questions).
   data-show="Answer text" → what the answer key writes on the Answer line (default: first data-ans).
   data-space="lg" → more room to work on paper.

   On paper (?paper=1, see paper.js) each question gets room to work and "Answer: ____";
   the key (&key=1) fills the answer in green and shows the worked steps.
   Results go to Mr. Allen's Sheet through ScoreSend when the page has set it up. */
(function () {
  var LV = { 1: '★ Try it', 2: '★★ On level', 3: '★★★ Challenge' };
  var css = document.createElement('style');
  css.textContent = [
    '.np{margin:18px 0 6px;padding:14px 16px 6px;border:2px solid #0056B3;border-radius:12px;background:#F4F8FD}',
    '.np-h{font:700 1.02rem Inter,system-ui,sans-serif;color:#0056B3;margin:0 0 10px;display:flex;align-items:center;gap:8px}',
    '.np-h small{font-weight:600;color:#5a6680;font-size:.82rem}',
    '.np.final{border-color:#1E2D4F;background:#F6F7FA}.np.final .np-h{color:#1E2D4F}',
    '.np-q{background:#fff;border:1px solid #D7DCE6;border-radius:10px;padding:11px 13px;margin:0 0 10px;break-inside:avoid}',
    '.np-top{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}',
    '.np-num{font-weight:800;color:#1E2D4F}',
    '.np-lv{font:700 .74rem Inter,system-ui,sans-serif;letter-spacing:.03em;padding:2px 8px;border-radius:999px;white-space:nowrap}',
    '.np-lv.l1{background:#E7F6EC;color:#15803D}.np-lv.l2{background:#E8F0FB;color:#0056B3}.np-lv.l3{background:#FDF0E1;color:#B45309}',
    '.np-prompt{flex:1 1 220px;font-size:1rem;line-height:1.45}',
    '.np-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:9px}',
    '.np-in{font:inherit;font-size:1rem;width:150px;max-width:100%;padding:7px 10px;border:2px solid #B8C0CF;border-radius:8px}',
    '.np-in:focus{outline:none;border-color:#0056B3}',
    '.np-btn{font:600 .92rem Inter,system-ui,sans-serif;border:none;border-radius:8px;padding:8px 14px;cursor:pointer;background:#1E2D4F;color:#fff}',
    '.np-btn.ghost{background:transparent;color:#0056B3;border:1.5px solid #0056B3}',
    '.np-ch{font:inherit;font-size:.95rem;border:2px solid #B8C0CF;background:#fff;border-radius:8px;padding:7px 12px;cursor:pointer}',
    '.np-ch.ok{border-color:#15803D;background:#E7F6EC}.np-ch.no{border-color:#B42318;background:#FDECEC}',
    '.np-fb{font-size:.93rem;font-weight:600;min-height:1.2em}.np-fb.ok{color:#15803D}.np-fb.no{color:#B45309}',
    '.np-sol{display:none;margin-top:9px;padding:9px 12px;background:#ECFDF3;border-left:4px solid #15803D;border-radius:6px;font-size:.95rem;line-height:1.5}',
    '.np-q.solved .np-sol,.np-sol.show{display:block}',
    '.np-sol::before{content:"How to do it: ";font-weight:700;color:#15803D}',
    '.np-in.bad{animation:npShake .3s}@keyframes npShake{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}',
    '@media (prefers-reduced-motion:reduce){.np-in.bad{animation:none}}',
    // paper
    'body.paper .np{background:#fff;border-width:1.5px}',
    'body.paper .np-row,body.paper .np-fb{display:none!important}',
    'body.paper .np-sol{display:none!important}body.paper.paper-key .np-sol{display:block!important}',
    '.np-work{height:1.05in}.np-work.lg{height:1.9in}.np-work.sm{height:.45in}',
    '.np-ansline{font-weight:700;margin-top:4px}.np-ansline span{display:inline-block;min-width:2in;border-bottom:2px solid #1E2D4F;color:#15803D;padding:0 4px}',
    '.np-mc{list-style:none;padding:0;margin:8px 0 2px}.np-mc li{margin:4px 0}',
    '.np-mc li .o{display:inline-block;width:14px;height:14px;border:2px solid #1E2D4F;border-radius:50%;vertical-align:-2px;margin-right:8px}',
    '.np-mc li.ok{color:#15803D;font-weight:700}.np-mc li.ok .o{background:#15803D;border-color:#15803D}'
  ].join('\n');
  document.head.appendChild(css);

  function norm(s) {
    return String(s).toLowerCase().replace(/[−–—]/g, '-').replace(/\s+/g, '').replace(/(°|degrees?|squnits|sq\.?units|units?|cm²?|in²?|ft²?|m²?|inches|feet|meters)$/, '')
      .replace(/^[a-z]\s*=/, '').replace(/,(?=\d{3}\b)/g, '').replace(/^\$/, '');
  }
  function num(s) {
    var t = norm(s), m;
    if ((m = /^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/.exec(t))) return +m[2] ? +m[1] / +m[2] : NaN;
    if (/^-?\d*\.?\d+$/.test(t)) return +t;
    return NaN;
  }
  function same(given, want, tol) {
    var a = num(given), b = num(want);
    if (!isNaN(a) && !isNaN(b)) return Math.abs(a - b) <= (tol || 1e-9);
    return norm(given) === norm(want) && norm(want) !== '';
  }
  var paper = /[?&]paper=1/.test(location.search), KEY = /[?&]key=1/.test(location.search);
  var count = 0;

  function build(np, si) {
    var title = np.getAttribute('data-title') || '';
    var fin = np.classList.contains('final');
    if (!np.querySelector('.np-h')) np.insertAdjacentHTML('afterbegin', '<div class="np-h">✏ ' + (fin ? 'Comprehensive Practice' : 'Practice') +
      (title ? (fin ? ' <small>' + title + '</small>' : ': ' + title) : '') + '</div>');
    np.querySelectorAll('.np-q').forEach(function (q, k) {
      count++;
      var lv = +q.getAttribute('data-level') || 1, id = q.id || ('np' + (si + 1) + '-' + (k + 1));
      q.id = id;
      var prompt = q.querySelector('.np-prompt');
      var top = document.createElement('div'); top.className = 'np-top';
      top.innerHTML = '<span class="np-num">' + (k + 1) + '.</span><span class="np-lv l' + lv + '">' + LV[lv] + '</span>';
      q.insertBefore(top, q.firstChild); if (prompt) top.appendChild(prompt);
      var ans = q.getAttribute('data-ans'), choices = q.getAttribute('data-choices'), sol = q.querySelector('.np-sol');
      var show = q.getAttribute('data-show') || (ans ? ans.split('|')[0] : '');
      if (paper) {
        if (choices) {
          var h = '<ol class="np-mc">';
          choices.split('|').forEach(function (c) { h += '<li class="' + (KEY && same(c, ans) ? 'ok' : '') + '"><span class="o"></span>' + c + '</li>'; });
          (sol || null) ? sol.insertAdjacentHTML('beforebegin', h + '</ol>') : q.insertAdjacentHTML('beforeend', h + '</ol>');
        } else {
          var sp = q.getAttribute('data-space'), work = '<div class="np-work' + (sp ? ' ' + sp : '') + '"></div>';
          var line = '<div class="np-ansline">Answer: <span>' + (KEY ? (show || (sol ? 'see below' : '')) : '&nbsp;') + '</span></div>';
          if (sol) sol.insertAdjacentHTML('beforebegin', (KEY ? '' : work) + line); else q.insertAdjacentHTML('beforeend', (KEY ? '' : work) + line);
        }
        return;
      }
      var row = document.createElement('div'); row.className = 'np-row';
      var fb = document.createElement('span'); fb.className = 'np-fb'; fb.setAttribute('aria-live', 'polite');
      var tries = 0, done = false, std = np.getAttribute('data-std') || '';
      var label = (title ? title + ': ' : '') + (prompt ? prompt.textContent.replace(/\s+/g, ' ').trim() : 'question ' + (k + 1));
      function rec(ok) { try { if (window.ScoreSend) ScoreSend.record(id, ok, { std: std || undefined, label: label }); } catch (e) {} }
      function solved(ok, msg) {
        done = true; q.classList.add('solved'); fb.className = 'np-fb ok'; fb.textContent = msg;
      }
      function miss(el) {
        tries++; rec(false);
        if (el) { el.classList.remove('bad'); void el.offsetWidth; el.classList.add('bad'); }
        fb.className = 'np-fb no';
        if (tries === 1) fb.textContent = q.getAttribute('data-hint') || 'Not quite. Look back at the example above and try again.';
        else { fb.textContent = 'The answer is ' + show + '. Read the steps below.'; if (sol) sol.classList.add('show'); }
      }
      if (choices) {
        choices.split('|').forEach(function (c) {
          var b = document.createElement('button'); b.type = 'button'; b.className = 'np-ch'; b.textContent = c;
          b.onclick = function () {
            if (done) return;
            if (same(c, ans)) { b.classList.add('ok'); rec(true); solved(true, tries ? '✓ Yes, that\'s it.' : '✓ Correct!'); }
            else { b.classList.add('no'); miss(null); }
          };
          row.appendChild(b);
        });
        row.appendChild(fb);
      } else if (ans) {
        var inp = document.createElement('input'); inp.className = 'np-in'; inp.type = 'text'; inp.autocomplete = 'off';
        inp.setAttribute('aria-label', 'Your answer'); inp.placeholder = q.getAttribute('data-ph') || 'Your answer';
        var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'np-btn'; btn.textContent = 'Check';
        var tol = +q.getAttribute('data-tol') || 0;
        function check() {
          if (done || !inp.value.trim()) return;
          var ok = ans.split('|').some(function (a) { return same(inp.value, a, tol); });
          if (ok) { rec(true); solved(true, tries ? '✓ Yes, that\'s it.' : '✓ Correct!'); inp.disabled = true; btn.disabled = true; }
          else miss(inp);
        }
        btn.onclick = check; inp.onkeydown = function (e) { if (e.key === 'Enter') check(); };
        row.appendChild(inp); row.appendChild(btn); row.appendChild(fb);
      } else {
        var sb = document.createElement('button'); sb.type = 'button'; sb.className = 'np-btn ghost'; sb.textContent = 'Show answer';
        sb.onclick = function () { if (sol) sol.classList.toggle('show'); };
        row.appendChild(sb);
      }
      if (sol) q.insertBefore(row, sol); else q.appendChild(row);
    });
  }
  function init() { document.querySelectorAll('.np').forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.NotesPractice = { count: function () { return count; }, same: same };
})();
