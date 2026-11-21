/**
 * Squeaky Cheeks: Class Cup — leaderboard script (5th grade, Ms. Tesnar vs. Ms. Covalt)
 *
 * Paste this into the Apps Script editor of the "Squeaky Cheeks Class Cup" Google Sheet
 * (Extensions > Apps Script). Add an HTML file named  Game  and paste the game page into it.
 * Full steps: TEACHER_SETUP.md (next to this file).
 *
 * PRIVACY: this script never reads or saves student names or emails. The game sends only
 * { homeroom, points }. The Sheet keeps class totals and a points-per-day log for each class.
 */

/* ===== Settings you may change ===== */
var CLASSES = ['Ms. Tesnar', 'Ms. Covalt'];   // homeroom names, exactly as students will see them (2 classes)
var CONTEST_NAME = 'Squeaky Cheeks Class Cup';
var MAX_POINTS_PER_SEND = 60;                  // a game sends at most this many points at once (stops cheating)
/* ==================================== */

var TOTALS = 'Totals', DAILY = 'Daily', PAST = 'Past Contests', README = 'Read Me';

/** The web app: shows the game. Add ?board=1 to the link for the big projector scoreboard. */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Game')
    .setTitle('Squeaky Cheeks: Class Cup')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

/** Called by the game: the scoreboard. */
function getBoard() {
  var cache = CacheService.getScriptCache(), hit = cache.get('board');
  if (hit) return JSON.parse(hit);
  var board = readBoard_();
  cache.put('board', JSON.stringify(board), 10);
  return board;
}

/** Called by the game: add points for one homeroom. Returns the new scoreboard. */
function addPoints(homeroom, points) {
  homeroom = String(homeroom || '');
  points = Math.floor(Number(points));
  if (CLASSES.indexOf(homeroom) < 0) throw new Error('Unknown homeroom: ' + homeroom);
  if (!(points >= 1 && points <= MAX_POINTS_PER_SEND)) throw new Error('Bad points');
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) throw new Error('Busy, try again');
  try {
    var ss = book_(), t = ss.getSheetByName(TOTALS) || setupSheets_(ss).getSheetByName(TOTALS);
    var row = findRow_(t, homeroom);
    if (!row) { t.appendRow([homeroom, 0, '']); row = t.getLastRow(); }
    var cell = t.getRange(row, 2);
    cell.setValue((Number(cell.getValue()) || 0) + points);

    var d = ss.getSheetByName(DAILY), today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    var drow = findDaily_(d, today, homeroom);
    if (drow) { var dc = d.getRange(drow, 3); dc.setValue((Number(dc.getValue()) || 0) + points); }
    else d.appendRow([today, homeroom, points]);
    SpreadsheetApp.flush();
  } finally { lock.releaseLock(); }
  CacheService.getScriptCache().remove('board');
  return getBoard();
}

/* ---------- teacher menu in the Sheet ---------- */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('Class Cup')
    .addItem('1. Set up the tabs', 'setup')
    .addItem('Start a new contest (scores back to 0)', 'newContest')
    .addToUi();
}

/** Run once (from the Class Cup menu or the editor). Makes the tabs. Safe to run again. */
function setup() {
  var ss = book_();
  PropertiesService.getScriptProperties().setProperty('SHEET_ID', ss.getId());
  setupSheets_(ss);
  try { SpreadsheetApp.getUi().alert('Class Cup is set up. Next: Deploy > New deployment > Web app (see the Read Me tab).'); } catch (e) {}
}

/** Saves the current totals to "Past Contests", then sets every class back to 0. */
function newContest() {
  var ui = null; try { ui = SpreadsheetApp.getUi(); } catch (e) {}
  if (ui && ui.alert('Start a new contest?', 'Both classes go back to 0 points. The old scores are saved in the "Past Contests" tab.', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var ss = book_(); setupSheets_(ss);
    var t = ss.getSheetByName(TOTALS), p = ss.getSheetByName(PAST), d = ss.getSheetByName(DAILY);
    var when = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
    var vals = t.getLastRow() > 1 ? t.getRange(2, 1, t.getLastRow() - 1, 3).getValues() : [];
    vals.forEach(function (r) { if (r[0]) p.appendRow([when, r[0], r[1], r[2]]); });
    vals.forEach(function (r, i) { t.getRange(i + 2, 2).setValue(0); });
    if (d.getLastRow() > 1) d.getRange(2, 1, d.getLastRow() - 1, 3).clearContent();
  } finally { lock.releaseLock(); }
  CacheService.getScriptCache().remove('board');
  if (ui) ui.alert('New contest started. Good luck to both classes!');
}

/* ---------- helpers ---------- */
function book_() {
  var ss = null;
  try { ss = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) {}
  if (!ss) {
    var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
    if (!id) throw new Error('Run setup first (Class Cup menu > 1. Set up the tabs).');
    ss = SpreadsheetApp.openById(id);
  }
  return ss;
}
function setupSheets_(ss) {
  var t = ss.getSheetByName(TOTALS) || ss.insertSheet(TOTALS);
  if (t.getLastRow() < 1) t.appendRow(['Homeroom', 'Points', 'Students (optional: fill in to show points per student)']);
  t.getRange(1, 1, 1, 3).setFontWeight('bold');
  CLASSES.forEach(function (c) { if (!findRow_(t, c)) t.appendRow([c, 0, '']); });
  t.setColumnWidth(1, 160); t.setColumnWidth(3, 360);
  var d = ss.getSheetByName(DAILY) || ss.insertSheet(DAILY);
  if (d.getLastRow() < 1) { d.appendRow(['Date', 'Homeroom', 'Points that day']); d.getRange(1, 1, 1, 3).setFontWeight('bold'); }
  d.getRange('A:A').setNumberFormat('@');   // dates stay plain text like 2026-11-21
  var p = ss.getSheetByName(PAST) || ss.insertSheet(PAST);
  if (p.getLastRow() < 1) { p.appendRow(['Contest ended', 'Homeroom', 'Points', 'Students']); p.getRange(1, 1, 1, 4).setFontWeight('bold'); }
  var r = ss.getSheetByName(README) || ss.insertSheet(README);
  r.clear();
  r.getRange(1, 1, 9, 1).setValues([
    [CONTEST_NAME],
    ['Totals: points for each homeroom. Change only the Students column (optional). Points per student shows when both are filled in.'],
    ['Daily: points earned each day by each homeroom.'],
    ['Past Contests: saved when you use Class Cup > Start a new contest.'],
    ['No student names or emails are saved anywhere in this Sheet.'],
    ['To rename a homeroom: change CLASSES at the top of the script AND the name in column A of Totals, then Deploy > Manage deployments > Edit > New version.'],
    ['Game link for students: Deploy > Manage deployments > copy the Web app URL. Post it in Google Classroom.'],
    ['Projector scoreboard: the same link with ?board=1 at the end.'],
    ['Each right answer = 1 point. Clearing a room = 10 points. A game sends at most ' + MAX_POINTS_PER_SEND + ' points at a time.']]);
  r.getRange(1, 1).setFontWeight('bold').setFontSize(14); r.setColumnWidth(1, 900);
  var blank = ss.getSheetByName('Sheet1');
  if (blank && blank.getLastRow() === 0) ss.deleteSheet(blank);   // the empty starter tab
  return ss;
}
function readBoard_() {
  var ss = book_(), t = ss.getSheetByName(TOTALS), out = [];
  CLASSES.forEach(function (c) {
    var row = t ? findRow_(t, c) : 0, pts = 0, n = 0;
    if (row) { var v = t.getRange(row, 2, 1, 2).getValues()[0]; pts = Number(v[0]) || 0; n = Math.max(0, Math.floor(Number(v[1]) || 0)); }
    out.push({ name: c, points: pts, students: n });
  });
  return { contest: CONTEST_NAME, classes: out, updated: new Date().toISOString() };
}
function findRow_(sh, name) {
  var n = sh.getLastRow(); if (n < 2) return 0;
  var v = sh.getRange(2, 1, n - 1, 1).getValues();
  for (var i = 0; i < v.length; i++) if (String(v[i][0]) === name) return i + 2;
  return 0;
}
function findDaily_(sh, day, name) {
  var n = sh.getLastRow(); if (n < 2) return 0;
  var v = sh.getRange(2, 1, n - 1, 2).getDisplayValues();
  for (var i = v.length - 1; i >= 0; i--) if (v[i][0] === day && v[i][1] === name) return i + 2;
  return 0;
}
