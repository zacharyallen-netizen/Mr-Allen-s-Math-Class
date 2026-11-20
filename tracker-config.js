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
if (/\/grade7\//.test(location.pathname)) window.TRACKER_CONFIG = window.TRACKER_CONFIG_7;

