/* ───────────────────────────────────────────────────────────────
   FLUENCY LAB — "My plan" box for the Skill Checks.

   After a student checks their answers, this shows:
     • their SBG level (1–5, from the percent right),
     • the skills they've got, and
     • the skills to practice next, each with a button that opens the
       practice lab at the right level.
   The same level and "practice next" list go along with the score
   when the student sends it (fluency-submit.js picks them up).

   Each quiz page sets, before loading this file:
     window.SKILL_PLAN = { lab: 'fluency-lab-divide.html', module: 'Divide',
       skills: [ ['Division facts', 3, [0,1,2]], ... ] }   // name, lab level, question numbers (0-based)
   and calls SkillPlan.show(sel) inside check(), SkillPlan.hide() inside again().
   ─────────────────────────────────────────────────────────────── */
(function () {
  var CFG = window.SKILL_PLAN || { skills: [] };

  // SBG scale in percents (matches the student tracker)
  var SCALE = [
    [5, 'Beyond', '#15803D'], [4, 'Mastery', '#2F855A'], [3, 'Getting there', '#B45309'],
    [2, 'Partly', '#C2410C'], [1, 'Starting', '#B42318']
  ];
  function practiceLevel() {
    try { return +localStorage.getItem('fluencyLevel:' + CFG.module) || 0; } catch (e) { return 0; }
  }
  function sbg(pct) {
    if (pct >= 100) return practiceLevel() >= 6 ? 5 : 4;
    if (pct >= 80) return 4;
    if (pct >= 65) return 3;
    if (pct >= 40) return 2;
    return 1;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var css = document.createElement('style');
  css.textContent =
    '#plan{display:none;margin:0 0 18px;padding:18px;border-radius:16px;background:var(--panel,#222749);border:1px solid var(--edge,#33396b);line-height:1.45}' +
    '#plan h2{font-size:19px;margin:0 0 12px}' +
    '#plan .lvl{display:flex;align-items:center;gap:12px;margin-bottom:14px}' +
    '#plan .lvl .n{flex:none;width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#fff}' +
    '#plan .lvl b{font-size:17px}#plan .lvl small{display:block;color:var(--muted,#9aa0cf);font-size:13.5px}' +
    '#plan .hd{font-size:13px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;margin:12px 0 7px}' +
    '#plan .got .hd{color:var(--mint,#39d99a)}#plan .next .hd{color:var(--amber,#ffbb4d)}' +
    '#plan .chips{display:flex;flex-wrap:wrap;gap:7px}' +
    '#plan .chips span{font-size:14px;padding:5px 11px;border-radius:999px;background:#39d99a1a;border:1px solid #39d99a55;color:var(--ink,#f1f3ff)}' +
    '#plan .row{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:10px 12px;border-radius:12px;background:#1b1e38;border:1px solid var(--edge,#33396b);margin-bottom:8px}' +
    '#plan .row.first{border-color:var(--amber,#ffbb4d);background:#ffbb4d12}' +
    '#plan .row .t{font-size:15.5px;font-weight:650}#plan .row .t small{display:block;font-weight:500;color:var(--muted,#9aa0cf);font-size:13px}' +
    '#plan .row a{flex:none;font-size:14.5px;font-weight:700;text-decoration:none;padding:9px 14px;border-radius:10px;color:#12132a;background:var(--amber,#ffbb4d)}' +
    '#plan .row:not(.first) a{background:transparent;color:var(--amber,#ffbb4d);border:1.5px solid var(--amber,#ffbb4d)}' +
    '#plan .tip{font-size:14px;color:var(--muted,#9aa0cf);margin-top:10px}';
  document.head.appendChild(css);

  var SP = {
    last: null,
    init: function () {
      if (document.getElementById('plan')) return;
      var host = document.getElementById('score'); if (!host) return;
      var box = document.createElement('div'); box.id = 'plan';
      host.parentNode.insertBefore(box, host.nextSibling);
    },

    /** sel: {questionIndex: chosenOriginalIndex}; Q: the quiz's question list */
    show: function (sel, Q) {
      SP.init();
      var box = document.getElementById('plan'); if (!box) return;
      var right = 0; Q.forEach(function (q, i) { if (sel[i] === q[2]) right++; });
      var pct = Math.round(right / Q.length * 100), lv = sbg(pct), info = SCALE[5 - lv];

      var got = [], next = [];
      CFG.skills.forEach(function (s) {
        var qs = s[2], miss = qs.filter(function (i) { return sel[i] !== Q[i][2]; }).length;
        (miss ? next : got).push({ name: s[0], level: s[1], miss: miss, n: qs.length });
      });
      // practice the earliest level first: it is the base for the later ones
      next.sort(function (a, b) { return a.level - b.level || b.miss - a.miss; });

      var h = '<h2>My plan</h2>' +
        '<div class="lvl"><span class="n" style="background:' + info[2] + '">' + lv + '</span><div><b>My SBG level: ' + lv + ' · ' + info[1] + '</b>' +
        '<small>' + right + ' of ' + Q.length + ' right (' + pct + '%).' +
        (pct >= 100 && lv < 5 ? ' Reach Level 6 for a 5.' : '') + '</small></div></div>';
      if (got.length) h += '<div class="got"><div class="hd">✓ Got it</div><div class="chips">' +
        got.map(function (g) { return '<span>' + esc(g.name) + '</span>'; }).join('') + '</div></div>';
      if (next.length) {
        h += '<div class="next"><div class="hd">Practice next</div>' +
          next.map(function (s, k) {
            return '<div class="row' + (k ? '' : ' first') + '"><div class="t">' + esc(s.name) +
              '<small>Missed ' + s.miss + ' of ' + s.n + '</small></div>' +
              '<a href="' + CFG.lab + '?level=' + s.level + '">Practice Level ' + s.level + ' →</a></div>';
          }).join('') +
          '<div class="tip">Do one set of 10 at that level.</div></div>';
      } else {
        h += '<div class="tip">Nothing to fix. Practice Level 6 to stay sharp.</div>';
      }
      box.innerHTML = h; box.style.display = 'block';

      SP.last = { sbg: lv, practice: next.map(function (s) { return s.name + ' (L' + s.level + ')'; }).join('; ') };
      if (window.FLSubmit) window.FLSubmit.extra = SP.last;
    },

    hide: function () {
      var box = document.getElementById('plan'); if (box) box.style.display = 'none';
      SP.last = null; if (window.FLSubmit) window.FLSubmit.extra = null;
    }
  };
  window.SkillPlan = SP;
})();
