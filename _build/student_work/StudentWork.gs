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
 *  Nov 11, 2026: Homework rows show right (green) / missed (red), "Checked right" and "Missed"; the summary tabs get
 *  "Missed on first try"; a "Reteach" tab lists every question by % right, lowest first.
 *
 *  Nov 11, 2026 (night): Pre-Tests / Notes Practice / Tutorials rows get a "Skipped (not answered)" column. Skips are
 *  only listed, never counted as wrong.
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
// Nov 11, 2026: the website also sends marks (1 = right, 0 = missed, '' = Mr. Allen checks / blank). Right answers are
// colored green and missed ones red, "Checked right" and "Missed" are filled in, and every checked problem also goes to
// the Responses tab (Source = Homework) so the Reteach tab counts it.
var GREEN_ = '#d9ead3', RED_ = '#f4cccc';
function homework_(d, name) {
  var ans = Array.isArray(d.answers) ? d.answers.slice(0, MAX_HW_Q) : [];
  if (!ans.length) return json_({ ok: false, error: 'no answers' });
  ans = ans.map(function (a) { return clip_(a, 300); });
  var marks = Array.isArray(d.marks) ? d.marks.slice(0, MAX_HW_Q) : [], bands = Array.isArray(d.bands) ? d.bands : [];
  var answered = ans.filter(function (a) { return a !== ''; }).length;
  var hw = clip_(d.hw, 10), title = clip_(d.page, 140), unit = clip_(d.unit, 6);
  var lock = LockService.getScriptLock(); lock.waitLock(25000);
  try {
    var ss = SpreadsheetApp.openById(WORK_ID), sh = ss.getSheetByName('Homework');
    var period = periodFor_(ss, name) || clip_(d.period, 6), now = new Date();
    while (ans.length < MAX_HW_Q) ans.push('');
    var right = 0, checked = 0, missed = [], colors = [], resp = [];
    for (var i = 0; i < MAX_HW_Q; i++) {
      var m = marks[i], isR = m === 1 || m === '1', isW = m === 0 || m === '0';
      colors.push(isR ? GREEN_ : isW ? RED_ : null);
      if (isR || isW) {
        checked++; if (isR) right++; else missed.push('Q' + (i + 1));
        var band = Number(bands[i]); if ([2, 3, 4, 5].indexOf(band) < 0) band = 4;
        resp.push([now, name, period, 'Homework', unit, title || ('Homework ' + hw), 'Problem ' + (i + 1), '', band, isR ? 1 : 0, isR ? 1 : 0, 1]);
      }
    }
    header_(sh, 7 + MAX_HW_Q, 'Checked right'); header_(sh, 8 + MAX_HW_Q, 'Missed');
    sh.appendRow([now, name, period, unit, title || ('Homework ' + hw), answered + ' of ' + Number(d.n || answered)].concat(ans)
      .concat(checked ? [right + ' of ' + checked, missed.join(', ')] : ['', '']));
    if (checked) sh.getRange(sh.getLastRow(), 7, 1, MAX_HW_Q).setBackgrounds([colors]);
    if (resp.length) { var rs = ss.getSheetByName('Responses'); rs.getRange(rs.getLastRow() + 1, 1, resp.length, resp[0].length).setValues(resp); reteach_(ss); }
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
    // Nov 11, 2026: "Missed" lists the questions that were wrong on the first try (number in the order answered + the question)
    var miss = []; resp.forEach(function (r, i) { if (!r[9]) miss.push('#' + (i + 1) + ' ' + String(r[6]).slice(0, 60)); });
    header_(sub, 10, 'Missed on first try');
    // Nov 11, 2026 ("Do not lock, but record if skipped"): problems the student moved past without answering.
    // Not counted as wrong. Blank = the page did not report skips.
    var sk = Array.isArray(d.skipped) ? d.skipped.slice(0, 60).map(function (x) { return String(x).slice(0, 60); }) : null;
    header_(sub, 11, 'Skipped (not answered)');
    sub.appendRow([now, name, period, unit, page, items.length, right, right / items.length, shown,
                   miss.length ? clip_(miss.length + ' missed: ' + miss.join(' | '), 900) : 'none',
                   sk === null ? '' : sk.length ? clip_(sk.length + ' skipped: ' + sk.join(' | '), 900) : 'none']);
    sub.getRange(sub.getLastRow(), 8).setNumberFormat('0%');
    var rs = ss.getSheetByName('Responses');
    rs.getRange(rs.getLastRow() + 1, 1, resp.length, resp[0].length).setValues(resp);
    reteach_(ss);
  } finally { lock.releaseLock(); }
  return json_({ ok: true, name: name, n: items.length, right: right });
}

// ── helpers ──
function header_(sh, col, text) { var c = sh.getRange(1, col); if (String(c.getValue()) === '') c.setValue(text).setFontWeight('bold'); }

// "Reteach" tab (made once, then it updates by itself): every question from the Responses tab with how many answers came in
// and the % right on the first try, lowest first. The top of the list is what to reteach.
function reteach_(ss) {
  if (ss.getSheetByName('Reteach')) return;
  var sh = ss.insertSheet('Reteach');
  sh.getRange('A1').setFormula('=QUERY(Responses!D2:J, "select D, F, G, H, count(J), sum(J), avg(J) where G is not null group by D, F, G, H order by avg(J) asc label D \'Source\', F \'Page\', G \'Question\', H \'Standard\', count(J) \'Answers\', sum(J) \'Right on first try\', avg(J) \'% right\'", 0)');
  sh.getRange('G2:G').setNumberFormat('0%');
  sh.getRange('I1').setValue('Lowest % right is at the top: reteach those first. This tab updates by itself.');
  sh.setFrozenRows(1);
}
// Run this once from the menu if you want the Reteach tab right away (it is also made by the next submission).
function makeReteachTabs() { [WORK_ID, PRETEST_ID].forEach(function (id) { reteach_(SpreadsheetApp.openById(id)); }); return 'Reteach tabs ready'; }
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
