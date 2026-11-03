/**
 * ════════════════════════════════════════════════════════════════════
 *  Mr. Allen's Math Class — Student Work receiver
 *
 *  Puts website submissions into two Google Sheets:
 *    • "Mr. Allen's Math Class — Student Work": Homework, Notes Practice, Tutorials
 *    • "Pre-Tests — Student Scores": Pre-Tests
 *  The Fluency Lab keeps using its own sheet and script.
 *
 *  ONE-TIME SETUP (about 2 minutes)
 *   1. Open the Student Work sheet → Extensions → Apps Script.
 *   2. Delete what is there, paste this whole file, click Save.
 *   3. In the function menu at the top choose  setup  and press Run.
 *      Allow the permissions it asks for (it only touches your own sheets).
 *   4. Deploy → New deployment → gear icon → Web app.
 *        Execute as: Me      Who has access: Anyone
 *      Click Deploy and copy the Web app URL (it ends in /exec).
 *   5. Send that URL to Claude (or paste it into tracker-config.js as ENDPOINT).
 *
 *  Later changes to this script: Deploy → Manage deployments → pencil →
 *  Version: New version → Deploy. That keeps the same URL.
 * ════════════════════════════════════════════════════════════════════
 */

var CLASS_CODE   = 'allen-8th';
var WORK_ID      = '1vR_UoDiLDuLb8c0kg8_ReatS6bjFPnF6UngR7Vu_ULg';   // Student Work sheet
var PRETEST_ID   = '1NIxgtt4unZaROaOTujyLUI7Td0Nv9EIlaMJyiTnxlV4';   // Pre-Tests sheet
var FLUENCY_ID   = '1Vm2K9gst1UulXVWGzloohaJ3i0pMsUec01b_I9WceHA';   // Fluency Lab sheet (Roster is copied from here)
var MAX_HW_Q     = 10;

// ── setup: copy the Roster from the Fluency Lab sheet into both new sheets ──
function setup() {
  var src = SpreadsheetApp.openById(FLUENCY_ID).getSheetByName('Roster');
  var rows = src && src.getLastRow() > 1 ? src.getRange(2, 1, src.getLastRow() - 1, 3).getValues() : [];
  [WORK_ID, PRETEST_ID].forEach(function (id) {
    var sh = SpreadsheetApp.openById(id).getSheetByName('Roster');
    if (sh.getLastRow() > 1) return;                       // never overwrite a roster you already edited
    if (rows.length) sh.getRange(2, 1, rows.length, 3).setValues(rows);
  });
  return rows.length + ' students copied';
}

function doGet() {
  return ContentService.createTextOutput('Student Work receiver is running. The website posts here.');
}

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    if (String(d.code) !== CLASS_CODE) return json_({ ok: false, error: 'bad code' });
    var name = tidyName_(d.name);
    if (!name) return json_({ ok: false, error: 'no name' });
    var kind = String(d.kind || '');
    if (kind === 'homework') return homework_(d, name);
    if (kind === 'pretest' || kind === 'practice') return evidence_(d, name, kind);
    if (kind === 'arcade') return arcade_(d, name);          // ArcadeLog.gs
    return json_({ ok: false, error: 'bad kind' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// ── Homework: one row per turn-in, typed answers in Q1…Q10 ──
function homework_(d, name) {
  var ans = Array.isArray(d.answers) ? d.answers.slice(0, MAX_HW_Q) : [];
  if (!ans.length) return json_({ ok: false, error: 'no answers' });
  ans = ans.map(function (a) { return clip_(a, 300); });
  var answered = ans.filter(function (a) { return a !== ''; }).length;
  var hw = clip_(d.hw, 10), title = clip_(d.page, 140);
  var lock = LockService.getScriptLock(); lock.waitLock(25000);
  try {
    var ss = SpreadsheetApp.openById(WORK_ID), sh = ss.getSheetByName('Homework');
    var period = periodFor_(ss, name) || clip_(d.period, 6);
    while (ans.length < MAX_HW_Q) ans.push('');
    sh.appendRow([new Date(), name, period, clip_(d.unit, 6), title || ('Homework ' + hw), answered + ' of ' + Number(d.n || answered)].concat(ans));
  } finally { lock.releaseLock(); }
  return json_({ ok: true, name: name, answered: answered });
}

// ── Pre-tests, notes practice and tutorials: a summary row + one row per question ──
function evidence_(d, name, kind) {
  var items = Array.isArray(d.items) ? d.items : [];
  if (!items.length || items.length > 120) return json_({ ok: false, error: 'bad items' });
  var unit = clip_(d.unit, 12), page = clip_(d.page, 120), url = String(d.url || '');
  var shown = d.revealed ? 'yes' : '';
  var isPre = kind === 'pretest';
  var tab = isPre ? 'Pre-Tests' : (/tutorial/i.test(page + ' ' + url) ? 'Tutorials' : 'Notes Practice');
  var now = new Date(), right = 0, resp = [];
  var lock = LockService.getScriptLock(); lock.waitLock(25000);
  try {
    var ss = SpreadsheetApp.openById(isPre ? PRETEST_ID : WORK_ID);
    var period = periodFor_(ss, name) || clip_(d.period, 6);
    items.forEach(function (it, i) {
      it = it || {};
      var first = it.first ? 1 : 0; right += first;
      var band = Number(it.band); if ([2, 3, 4, 5].indexOf(band) < 0) band = 4;
      resp.push([now, name, period, tab, unit, page, clip_(it.label || it.id || (i + 1), 80), clip_(it.std, 20), band,
                 first, it.final ? 1 : 0, Math.max(1, Math.min(99, Number(it.tries) || 1))]);
    });
    var sub = ss.getSheetByName(tab);
    sub.appendRow([now, name, period, unit, page, items.length, right, right / items.length, shown]);
    sub.getRange(sub.getLastRow(), 8).setNumberFormat('0%');
    var rs = ss.getSheetByName('Responses');
    rs.getRange(rs.getLastRow() + 1, 1, resp.length, resp[0].length).setValues(resp);
  } finally { lock.releaseLock(); }
  return json_({ ok: true, name: name, n: items.length, right: right });
}

// ── helpers ──
function periodFor_(ss, name) {
  var sh = ss.getSheetByName('Roster');
  if (!sh || sh.getLastRow() < 2) return '';
  var key = norm_(name), rows = sh.getRange(2, 1, sh.getLastRow() - 1, 3).getValues();
  for (var i = 0; i < rows.length; i++) {
    var names = [rows[i][0]].concat(String(rows[i][2] || '').split(','));
    for (var j = 0; j < names.length; j++) if (norm_(names[j]) && norm_(names[j]) === key) return String(rows[i][1]);
  }
  return '';
}
function norm_(s) { return String(s || '').toLowerCase().replace(/[^a-z]/g, ''); }
function tidyName_(s) {
  s = String(s || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  return s.length >= 3 ? s.replace(/\b\w/g, function (c) { return c.toUpperCase(); }) : '';
}
function clip_(s, n) { return String(s == null ? '' : s).replace(/^[=+\-@]/, "'$&").slice(0, n); }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
