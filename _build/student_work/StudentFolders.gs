/**
 * ════════════════════════════════════════════════════════════════════
 *  Mr. Allen's Math Class — Student Folders
 *
 *  Makes one Drive folder per student (inside the Tracker folder), each with
 *    • a Google Docs copy of every Student Self-Assessment form, and
 *    • a copy of "2627 Standards w/ Targets Tracker: Student Template",
 *  filled in with the student's name, period and the scores from
 *  "2627 Standards Progress Tracker - Teacher Version".
 *
 *  It only READS the teacher tracker. It never changes it.
 *
 *  HOW TO USE  (add this as a second file in the Student Work script project:
 *               Files  +  → Script → name it StudentFolders → paste → Save)
 *
 *   1. Run  buildStudentFolders
 *        Builds the folders. 62 students × ~24 files takes a while, so it
 *        works ~5 minutes at a time and schedules itself to continue until
 *        done. Progress shows on the "Student Folders" tab of the
 *        Student Work sheet. Nothing is shared with students yet.
 *   2. Check the Email column on that tab (guessed as firstlast@icimagine.org)
 *      and fix any that are wrong.
 *   3. Run  shareStudentFolders
 *        Shares each folder with that one student (can edit, no email sent).
 *   4. Whenever the teacher tracker changes, run  updateStudentScores
 *        Rewrites only the score lines and checks off targets you marked ✓.
 *        Anything students typed stays.
 * ════════════════════════════════════════════════════════════════════
 */

var SF = {
  TRACKER_XLSX_ID : '1gGqL4iPHK5OHiQ511SAQaDlEdobei20K',   // 2627 Standards Progress Tracker - Teacher Version.xlsx
  TEMPLATE_DOC_ID : '1F1T6sXo_pxFejkfzm0yaLg9Ctct4IGB_QRuel1-rsr0',   // Standards w/ Targets Tracker: Student Template
  FORMS_FOLDER_ID : '1CgqhfvH-Pzp2NReqTopZslD93bl4Xohi',  // 2627 Student Self Assessment Forms
  TRACKER_FOLDER  : '1_1rVzrfvl-qstStMR3kEgZ-Y13nDvA3b',  // 2627 Student Standards Data Tracker
  ROOT_NAME       : '2627 Student Folders',
  DOMAIN          : 'icimagine.org',
  LOG_TAB         : 'Student Folders',
  MAX_MS          : 4.5 * 60 * 1000
};
var LEVELS = { 1: 'Beginning', 2: 'Developing', 3: 'Approaching', 4: 'Proficient', 5: 'Mastery' };
var SCORE_LINE = "Mr. Allen's score: ";

// ───────────────────────────── public ─────────────────────────────

function buildStudentFolders()  { return runBatch_('build'); }
function updateStudentScores()  { return runBatch_('update'); }

function shareStudentFolders() {
  var log = logSheet_(), rows = log.getDataRange().getValues(), n = 0;
  for (var r = 1; r < rows.length; r++) {
    var email = String(rows[r][2]).trim(), folderId = folderIdFromLink_(rows[r][3]), shared = String(rows[r][5]);
    if (!email || !folderId || shared.indexOf('Shared') === 0) continue;
    try {
      share_(folderId, email);
      log.getRange(r + 1, 6).setValue('Shared ' + stamp_()); n++;
    } catch (e) {
      log.getRange(r + 1, 6).setValue('Could not share: ' + e.message);
    }
  }
  return n + ' folders shared';
}

// ───────────────────────────── batch runner ─────────────────────────────

function runBatch_(mode) {
  var t0 = Date.now(), fn = mode === 'build' ? 'buildStudentFolders' : 'updateStudentScores';
  clearTriggers_(fn);
  var props = PropertiesService.getScriptProperties();
  var key = 'sf_done_' + mode, done = JSON.parse(props.getProperty(key) || '{}');

  var data = readTracker_();                 // {students:[{key,name,period,scores:{},ticks:{}}], stds:[...]}
  var forms = mode === 'build' ? listForms_() : null;
  var root = mode === 'build' ? childFolder_(DriveApp.getFolderById(SF.TRACKER_FOLDER), SF.ROOT_NAME) : null;
  var log = logSheet_();

  for (var i = 0; i < data.students.length; i++) {
    var s = data.students[i];
    if (done[s.key]) continue;
    if (Date.now() - t0 > SF.MAX_MS) {
      props.setProperty(key, JSON.stringify(done));
      ScriptApp.newTrigger(fn).timeBased().after(60 * 1000).create();
      return 'Paused after ' + Object.keys(done).length + ' of ' + data.students.length + ' students; continues in 1 minute.';
    }
    var row = logRow_(log, s);
    var folder;
    if (mode === 'build') {
      folder = childFolder_(childFolder_(root, s.period), s.name);
      var made = buildOne_(folder, s, forms);
      writeLog_(log, row, s, folder, made + ' files', '');
    } else {
      var id = folderIdFromLink_(log.getRange(row, 4).getValue());
      if (!id) continue;
      folder = DriveApp.getFolderById(id);
      fillFolder_(folder, s);
      log.getRange(row, 5).setValue('Scores updated ' + stamp_());
    }
    done[s.key] = 1;
  }
  props.deleteProperty(key);
  return (mode === 'build' ? 'Built ' : 'Updated ') + data.students.length + ' students.';
}

// ───────────────────────────── one student ─────────────────────────────

function buildOne_(folder, s, forms) {
  var count = 0;
  var trackerName = 'Standards Tracker — ' + s.name;
  if (!folder.getFilesByName(trackerName).hasNext()) {
    DriveApp.getFileById(SF.TEMPLATE_DOC_ID).makeCopy(trackerName, folder);
  }
  count++;
  forms.forEach(function (f) {
    var name = f.std + ' Self-Assessment — ' + s.name;
    if (!folder.getFilesByName(name).hasNext()) convertCopy_(f.id, name, folder.getId());
    count++;
  });
  fillFolder_(folder, s);
  return count;
}

function fillFolder_(folder, s) {
  var it = folder.getFiles();
  while (it.hasNext()) {
    var f = it.next();
    if (f.getMimeType() !== MimeType.GOOGLE_DOCS) continue;
    var title = f.getName(), doc = DocumentApp.openById(f.getId()), body = doc.getBody();
    if (title.indexOf('Standards Tracker') === 0) fillTracker_(body, s);
    else {
      var m = title.match(/^(NC\.8\.[A-Z]+\.\d+)/);
      if (m) fillForm_(body, s, m[1]);
    }
    doc.saveAndClose();
  }
}

function fillForm_(body, s, std) {
  body.replaceText('Name: _+', 'Name: ' + s.name);
  body.replaceText('Class: _+', 'Class: ' + s.period);
  setScoreLine_(body, /^Where am I now\?/, scoreText_(s.scores[std]));
}

function fillTracker_(body, s) {
  body.replaceText('Name: _+', 'Name: ' + s.name);
  body.replaceText('Period: _+', 'Period: ' + s.period.replace('Period ', ''));
  var n = body.getNumChildren(), std = null;
  for (var i = 0; i < n; i++) {
    var el = body.getChild(i), type = el.getType();
    if (type === DocumentApp.ElementType.PARAGRAPH) {
      var m = el.asParagraph().getText().match(/^(NC\.8\.[A-Z]+\.\d+)\s+·/);
      if (m) {
        std = m[1];
        var next = i + 1 < n ? body.getChild(i + 1) : null;
        var line = SCORE_LINE + scoreText_(s.scores[std]);
        if (next && next.getType() === DocumentApp.ElementType.PARAGRAPH &&
            next.asParagraph().getText().indexOf(SCORE_LINE) === 0) {
          next.asParagraph().setText(line);
        } else {
          body.insertParagraph(i + 1, line).setHeading(DocumentApp.ParagraphHeading.NORMAL).editAsText().setBold(true);
          n++;
        }
      }
    } else if (type === DocumentApp.ElementType.TABLE && std) {
      tickTargets_(el.asTable(), std, s.ticks);
    }
  }
}

// Insert (or refresh) the teacher-score line right after the matching heading paragraph.
function setScoreLine_(body, headingRe, text) {
  var n = body.getNumChildren();
  for (var i = 0; i < n; i++) {
    var el = body.getChild(i);
    if (el.getType() !== DocumentApp.ElementType.PARAGRAPH) continue;
    var p = el.asParagraph();
    if (p.getText().indexOf(SCORE_LINE) === 0) { p.setText(SCORE_LINE + text); return; }
  }
  for (var j = 0; j < n; j++) {
    var e = body.getChild(j);
    if (e.getType() === DocumentApp.ElementType.PARAGRAPH && headingRe.test(e.asParagraph().getText())) {
      body.insertParagraph(j + 1, SCORE_LINE + text).setHeading(DocumentApp.ParagraphHeading.NORMAL).editAsText().setBold(true);
      return;
    }
  }
}

// Check a target's box (☐ → ☒) when the teacher marked that statement ✓. Never unchecks.
function tickTargets_(table, std, ticks) {
  var short = std.replace('NC.8.', '');
  for (var r = 0; r < table.getNumRows(); r++) {
    var row = table.getRow(r);
    if (row.getNumCells() < 2) continue;
    var m = row.getCell(1).getText().match(/Target (\d+)/);
    if (!m || !ticks[short + '-' + m[1]]) continue;
    row.getCell(0).replaceText('☐', '☒');
  }
}

function scoreText_(v) {
  if (v === undefined || v === null || v === '') return 'not scored yet';
  var k = Math.round(Number(v));
  return (Number(v) % 1 ? Number(v) : k) + (LEVELS[k] ? ' — ' + LEVELS[k] : '') + '  (updated ' + stamp_() + ')';
}

// ───────────────────────────── reading the teacher tracker ─────────────────────────────

function readTracker_() {
  var tmp = convertCopy_(SF.TRACKER_XLSX_ID, 'TEMP tracker read (safe to delete)', null, MimeType.GOOGLE_SHEETS);
  try {
    var ss = SpreadsheetApp.openById(tmp), out = [];
    ss.getSheets().forEach(function (sh) {
      var tab = sh.getName(), pm = tab.match(/^Period (\d+)/);
      if (!pm) return;
      var vals = sh.getDataRange().getValues(), head = vals[4];      // row 5 = codes
      for (var r = 6; r < vals.length; r++) {
        var full = String(vals[r][0]).trim();
        if (!full) continue;
        var s = { key: full, raw: full, name: displayName_(full), period: 'Period ' + pm[1], scores: {}, ticks: {} };
        for (var c = 1; c < head.length; c++) {
          var code = String(head[c]).trim(), v = vals[r][c];
          if (/^NC\.8\./.test(code)) { if (v !== '' && v !== null) s.scores[code] = v; }
          else if (/^[A-Z]+\.\d+-\d+$/.test(code) && String(v).trim() === '✓') s.ticks[code] = 1;
        }
        out.push(s);
      }
    });
    return { students: out };
  } finally {
    DriveApp.getFileById(tmp).setTrashed(true);
  }
}

// "Bricker, Maggie Rae M" → "Maggie Rae Bricker"
function displayName_(full) {
  var parts = full.split(','), last = parts[0].trim(), first = (parts[1] || '').trim().split(/\s+/);
  if (first.length > 1 && /^[A-Z]\.?$/.test(first[first.length - 1])) first.pop();   // drop middle initial
  return (first.join(' ') + ' ' + last).trim();
}

// "Maggie Rae Bricker" + "Bricker" → maggieraebricker@icimagine.org (a guess — check the sheet)
function guessEmail_(s) {
  var parts = s.raw.split(','), last = parts[0], first = (parts[1] || '').trim().split(/\s+/);
  if (first.length > 1 && /^[A-Z]\.?$/.test(first[first.length - 1])) first.pop();
  return (first.join('') + last).toLowerCase().replace(/[^a-z]/g, '') + '@' + SF.DOMAIN;
}

// ───────────────────────────── forms ─────────────────────────────

function listForms_() {
  var out = [];
  (function walk(folder) {
    var it = folder.getFiles();
    while (it.hasNext()) {
      var f = it.next(), m = f.getName().match(/^(NC\.8\.[A-Z]+\.\d+) Student Self-Assessment/);
      if (m) out.push({ id: f.getId(), std: m[1] });
    }
    var sub = folder.getFolders();
    while (sub.hasNext()) walk(sub.next());
  })(DriveApp.getFolderById(SF.FORMS_FOLDER_ID));
  var seen = {};
  return out.filter(function (f) { if (seen[f.std]) return false; seen[f.std] = 1; return true; })
            .sort(function (a, b) { return a.std < b.std ? -1 : 1; });
}

// ───────────────────────────── Drive helpers ─────────────────────────────

// Copy a file, converting it to a Google Doc (default) or Sheet. Returns the new id.
function convertCopy_(id, name, parentId, mime) {
  var body = { name: name, mimeType: mime || MimeType.GOOGLE_DOCS };
  if (parentId) body.parents = [parentId];
  var res = UrlFetchApp.fetch('https://www.googleapis.com/drive/v3/files/' + id + '/copy?supportsAllDrives=true', {
    method: 'post', contentType: 'application/json', payload: JSON.stringify(body),
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }, muteHttpExceptions: true
  });
  if (res.getResponseCode() >= 300) throw new Error('Copy failed (' + res.getResponseCode() + '): ' + res.getContentText().slice(0, 200));
  return JSON.parse(res.getContentText()).id;
}

function share_(folderId, email) {
  var res = UrlFetchApp.fetch('https://www.googleapis.com/drive/v3/files/' + folderId +
      '/permissions?sendNotificationEmail=false&supportsAllDrives=true', {
    method: 'post', contentType: 'application/json',
    payload: JSON.stringify({ role: 'writer', type: 'user', emailAddress: email }),
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }, muteHttpExceptions: true
  });
  if (res.getResponseCode() >= 300) throw new Error(JSON.parse(res.getContentText()).error.message);
}

function childFolder_(parent, name) {
  var it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}

function folderIdFromLink_(link) {
  var m = String(link || '').match(/folders\/([\w-]+)/);
  return m ? m[1] : '';
}

function clearTriggers_(fn) {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === fn) ScriptApp.deleteTrigger(t);
  });
}

// ───────────────────────────── log tab ─────────────────────────────

function logSheet_() {
  var ss = SpreadsheetApp.openById(WORK_ID), sh = ss.getSheetByName(SF.LOG_TAB);
  if (!sh) {
    sh = ss.insertSheet(SF.LOG_TAB);
    sh.getRange(1, 1, 1, 6).setValues([['Student', 'Period', 'Email (check before sharing)', 'Folder', 'Status', 'Shared']])
      .setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function logRow_(log, s) {
  var names = log.getRange(1, 1, Math.max(log.getLastRow(), 1), 1).getValues();
  for (var r = 1; r < names.length; r++) if (names[r][0] === s.name) return r + 1;
  log.appendRow([s.name, s.period, guessEmail_(s), '', '', '']);
  return log.getLastRow();
}

function writeLog_(log, row, s, folder, status) {
  log.getRange(row, 4).setValue(folder.getUrl());
  log.getRange(row, 5).setValue(status + ' · ' + stamp_());
}

function stamp_() {
  return Utilities.formatDate(new Date(), 'America/New_York', 'M/d/yyyy');
}
