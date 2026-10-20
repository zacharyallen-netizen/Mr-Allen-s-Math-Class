/* ───────────────────────────────────────────────────────────────
   FLUENCY LAB PROGRESS — shared by the 8 practice labs
   1. Remembers the student's level on THIS device (nothing is sent
      for this; it lives in the browser only).
   2. Keeps a list of the problems done this visit, and puts a
      "Send my work to Mr. Allen" panel on the "Set complete" screen.
      Sending goes ONLY to Mr. Allen's private Google Sheet (same
      address as the pre-tests and unit practice). Each problem is one
      row in Responses; Submissions shows the totals and the level reached.
      Fluency rows carry no NC standard, so they never change the
      Standards or Statistics tabs.

   Include it after the page's own script:
     <script src="../../../tracker-config.js"></script>
     <script src="../../../score-send.js"></script>
     <script src="fluency-progress.js" data-module="Multiply"></script>
   ─────────────────────────────────────────────────────────────── */
(function () {
  var me = document.currentScript;
  var MOD = (me && me.getAttribute('data-module')) || document.title.replace(/^.*—\s*/, '');
  var KEY = 'fluencyLevel:' + MOD;

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function put(v) { try { localStorage.setItem(KEY, String(v)); } catch (e) { /* private browsing: carry on */ } }
  function forget() { try { localStorage.removeItem(KEY); } catch (e) {} }

  // ── 1. remember the level ───────────────────────────────────────
  var saved = +get();
  if (saved >= 1 && saved <= 6) { level = saved; }          // `level` is the page's own variable
  // a Skill Check "Practice Level N" button opens the lab with ?level=N
  var asked = +(/[?&]level=(\d)/.exec(location.search) || [])[1];
  if (asked >= 1 && asked <= 6) { level = asked; put(level); }
  var origHUD = window.updateHUD;
  window.updateHUD = function () { origHUD(); put(level); };

  // a short "welcome back" line on the start screen, with a way to start over
  function welcome() {
    var start = document.getElementById('start'); if (!start) return;
    var btn = start.querySelector('button.btn'); if (!btn) return;
    var old = document.getElementById('flresume'); if (old) old.remove();
    if (!(level > 1)) return;
    var d = document.createElement('div');
    d.id = 'flresume';
    d.style.cssText = 'margin:0 auto 14px;max-width:390px;font-size:14px;color:#cfd3f5;line-height:1.5';
    d.innerHTML = '<b style="color:#63a8ef">Level ' + level + '</b> · ' +
      '<a href="#" id="flrestart" style="color:#9aa0cf;text-decoration:underline">Start at Level 1</a>';
    btn.parentNode.insertBefore(d, btn);
    document.getElementById('flrestart').addEventListener('click', function (e) {
      e.preventDefault(); level = 1; forget(); welcome();
    });
  }
  welcome();

  // ── 2. record every problem; send from the "Set complete" screen ──
  var setNo = 0, best = level;
  var origStart = window.startSet;
  window.startSet = function () { setNo++; origStart(); };

  function label() {
    var el = document.getElementById('prob') || document.getElementById('algo');
    var t = el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
    if (!t && typeof current !== 'undefined' && current && current.a !== undefined && current.b !== undefined) t = current.a + ' × ' + current.b;
    return t.slice(0, 80);
  }
  var origConclude = window.concludeProblem;
  window.concludeProblem = function (right, btn) {
    try {
      if (window.ScoreSend) {
        var id = 'Set ' + setNo + ' #' + (index + 1) + ' · L' + level;
        var meta = { label: label(), band: 4 };
        var guided = typeof G !== 'undefined' && G && G.steps && G.si >= G.steps.length;
        ScoreSend.record(id, !!right, meta);
        if (!right && guided) ScoreSend.record(id, true, meta);   // fixed it step by step: right in the end
      }
    } catch (e) { /* never block the lab */ }
    origConclude(right, btn);
    best = Math.max(best, level);
  };

  var origEnd = window.endSet;
  window.endSet = function () {
    origEnd();
    if (window.ScoreSend && ScoreSend.opts) {
      ScoreSend.opts.page = 'Fluency Lab · ' + MOD + ' · reached Level ' + best;
      ScoreSend.refresh();
    }
  };

  if (window.ScoreSend) {
    ScoreSend.setup({ kind: 'practice', unit: 'Fluency', page: 'Fluency Lab · ' + MOD,
                      mount: '#summary', std: '', band: 4, theme: 'dark', noun: 'problem' });
  }
})();
