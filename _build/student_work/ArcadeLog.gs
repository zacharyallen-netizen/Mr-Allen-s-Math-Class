/**
 * ════════════════════════════════════════════════════════════════════
 *  Mr. Allen's Math Class — Arcade Results
 *
 *  Arcade games send one row per play session (when the student leaves
 *  the game or switches tabs) to the separate Google Sheet
 *  "2627 Arcade Results — Mr. Allen's Math Class".
 *
 *  HOW TO USE  (add this as a new file in the Student Work script project:
 *               Files  +  → Script → name it ArcadeLog → paste → Save)
 *   1. Also paste the updated StudentWork file (it has one new line that
 *      sends arcade data here).
 *   2. Run  setupArcadeSheet  once. It builds the tabs: Sessions, By Student,
 *      By Game, Read Me.
 *   3. Deploy → Manage deployments → pencil → Version: New version → Deploy.
 *      The web app URL stays the same, so the website needs no change.
 * ════════════════════════════════════════════════════════════════════
 */
var ARCADE_ID = '1ZGo-A_sRyv4XLkfzj_AGbzO9Cm29aoYTs5Olc0T1QHU';
var ARCADE_HEAD = ['Time', 'Student', 'Period', 'Game', 'Unit', 'Minutes played', 'Rounds finished',
                   'Level reached', 'Score', 'Correct', 'Tries', 'Accuracy', 'Details'];

function arcade_(d, name) {
  var mins = Math.max(0, Math.min(240, Number(d.minutes) || 0));
  var correct = Math.max(0, Number(d.correct) || 0), tries = Math.max(0, Number(d.tries) || 0);
  if (mins < 0.25 && !tries && !Number(d.rounds)) return json_({ ok: true, skipped: 'too short' });
  var lock = LockService.getScriptLock(); lock.waitLock(25000);
  try {
    var sh = arcadeSessions_();
    var period = periodFor_(SpreadsheetApp.openById(WORK_ID), name) || clip_(d.period, 6);
    sh.appendRow([new Date(), name, period, clip_(d.game, 60), clip_(d.unit, 6),
      Math.round(mins * 10) / 10, Number(d.rounds) || 0, clip_(d.level, 40),
      d.score === '' || d.score == null ? '' : Number(d.score) || 0,
      correct, tries, tries ? correct / tries : '', clip_(d.details, 300)]);
    sh.getRange(sh.getLastRow(), 12).setNumberFormat('0%');
  } finally { lock.releaseLock(); }
  return json_({ ok: true });
}

function arcadeSessions_() {
  var ss = SpreadsheetApp.openById(ARCADE_ID), sh = ss.getSheetByName('Sessions');
  if (!sh) {
    sh = ss.getSheets()[0];
    sh.setName('Sessions');
    sh.getRange(1, 1, 1, ARCADE_HEAD.length).setValues([ARCADE_HEAD]).setFontWeight('bold').setBackground('#1E2D4F').setFontColor('#FFFFFF');
    sh.setFrozenRows(1);
  }
  return sh;
}

function setupArcadeSheet() {
  var ss = SpreadsheetApp.openById(ARCADE_ID), sh = arcadeSessions_();
  sh.getRange(1, 1, 1, ARCADE_HEAD.length).setValues([ARCADE_HEAD]).setFontWeight('bold').setBackground('#1E2D4F').setFontColor('#FFFFFF');
  sh.setFrozenRows(1); sh.setColumnWidth(1, 150); sh.setColumnWidth(2, 170); sh.setColumnWidth(4, 170); sh.setColumnWidth(13, 320);
  sh.getRange('A:A').setNumberFormat('m/d/yyyy h:mm am/pm'); sh.getRange('L:L').setNumberFormat('0%');

  function tab(name, formula, widths) {
    var t = ss.getSheetByName(name) || ss.insertSheet(name);
    t.clear(); t.getRange('A1').setFormula(formula);
    t.getRange('1:1').setFontWeight('bold').setBackground('#1E2D4F').setFontColor('#FFFFFF'); t.setFrozenRows(1);
    (widths || []).forEach(function (w, i) { t.setColumnWidth(i + 1, w); });
    return t;
  }
  tab('By Student',
    '=IFERROR(QUERY(Sessions!A:L,"select B, C, D, count(A), sum(F), sum(G), max(I), sum(J), sum(K), max(A) where B is not null group by B, C, D order by C, B, D ' +
    'label count(A) \'Sessions\', sum(F) \'Minutes\', sum(G) \'Rounds\', max(I) \'Best score\', sum(J) \'Correct\', sum(K) \'Tries\', max(A) \'Last played\'",1),"No arcade play yet")',
    [170, 70, 170, 80, 80, 80, 90, 80, 80, 150]);
  tab('By Game',
    '=IFERROR(QUERY(Sessions!A:L,"select D, count(A), sum(F), sum(J), sum(K) where D is not null group by D order by count(A) desc ' +
    'label count(A) \'Sessions\', sum(F) \'Minutes\', sum(J) \'Correct\', sum(K) \'Tries\'",1),"No arcade play yet")',
    [190, 90, 90, 90, 90]);
  var rm = ss.getSheetByName('Read Me') || ss.insertSheet('Read Me');
  rm.clear();
  rm.getRange(1, 1, 9, 1).setValues([
    ['Arcade Results — how this sheet works'],
    ['Each row on Sessions is one visit to an arcade game, sent when the student leaves the game or switches tabs.'],
    ['Students type their name once (the same name box as the Fluency Lab and practice pages). The period comes from the Roster tab of the Student Work sheet.'],
    ['Minutes played counts only time the game was on screen. Visits shorter than about 15 seconds with no answers are skipped.'],
    ['Rounds finished, Level reached, Score, Correct and Tries are filled in by games that report them (Tiles for Miles (was Zero Pair Run), UFO Blaster, Museum of Angles). Other games report time only.'],
    ['Accuracy = Correct ÷ Tries.'],
    ['By Student and By Game update by themselves.'],
    ['To start fresh, delete rows 2 and below on Sessions (keep the header row).'],
    ['Nothing here is visible to students.']
  ]);
  rm.getRange('A1').setFontWeight('bold').setFontSize(13); rm.setColumnWidth(1, 900); rm.getRange('A:A').setWrap(true);
  return 'Arcade sheet ready.';
}
