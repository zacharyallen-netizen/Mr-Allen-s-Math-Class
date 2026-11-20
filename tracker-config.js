/* ───────────────────────────────────────────────────────────────
   SCORE TRACKING — settings for pre-tests, notes practice,
   tutorials and homework turn-in.

   Sends to the "Student Work" script (Tracker folder in Drive):
     homework, notes practice, tutorials → Student Work sheet
     pre-tests                           → Pre-Tests sheet
   The Fluency Lab keeps its own address in
   grade8/Fluency-Lab-Package/fluency-lab/fluency-config.js.
   ─────────────────────────────────────────────────────────────── */
window.TRACKER_CONFIG = {
  ENDPOINT:   'https://script.google.com/macros/s/AKfycbwu8DzCtVZtbpBTqmdJDD4yuOquYRmTGjf6-EI_kNrOshn6aG-uilk_5NUKiwDJTlFd_g/exec',
  CLASS_CODE: 'allen-8th'
};

/* ── 7th GRADE (Nov 20, 2026, Zach: 7th grade data goes to the 7th grade teacher's OWN Google Sheet) ──
   Pages under grade7/ use the settings below instead of the ones above.
   Paste the teacher's Web app URL (ends in /exec) into ENDPOINT and make CLASS_CODE match the
   CLASS_CODE line in their MathClassTracker script (_build/student_work/teacher-kit/).
   While ENDPOINT is empty, 7th grade pages send nothing: "Send my work" and High Scores stay hidden. */
window.TRACKER_CONFIG_7 = {
  ENDPOINT:   '',
  CLASS_CODE: 'math7-class'
};
/* Borrowed 8th grade games (Nov 20, 2026, Zach: 7th grade plays must not go to the 8th grade Sheet or leaderboard):
   the 7th grade Arcade opens them with ?g=7. A 7th grade page or ?g=7 marks this browser tab as 7th grade
   (sessionStorage 'site-g7'), so a game's "play again" or next screen still sends to the 7th grade Sheet.
   Opening the 8th grade home or 8th grade Arcade clears the mark. The same test is in side-nav.js (isG7). */
window.SITE_G7 = (function () {
  var p = location.pathname, ss = null, on = /\/grade7\//.test(p) || /[?&]g=7(&|$)/.test(location.search);
  try { ss = window.sessionStorage; } catch (e) {}
  try {
    if (on) ss && ss.setItem('site-g7', '1');
    else if (/\/grade8\/(index\.html|arcade\.html)?$/.test(p)) ss && ss.removeItem('site-g7');
    else if (/\/grade8\//.test(p) && ss && ss.getItem('site-g7') === '1') on = true;
  } catch (e) {}
  return on;
})();
if (window.SITE_G7) {
  window.TRACKER_CONFIG = window.TRACKER_CONFIG_7;
  if (/\/grade8\//.test(location.pathname)) document.addEventListener('DOMContentLoaded', function () {
    // "Back to the Arcade" inside a borrowed game goes to the 7th grade Arcade
    [].forEach.call(document.querySelectorAll('a[href]'), function (a) {
      if (/\/grade8\/arcade\.html(#.*)?$/.test(a.href.split('?')[0])) a.href = a.href.replace(/\/grade8\/arcade\.html/, '/grade7/arcade.html');
    });
  });
}

