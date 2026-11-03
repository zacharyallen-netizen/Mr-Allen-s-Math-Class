/**
 * ════════════════════════════════════════════════════════════════════
 *  Mr. Allen's Math Class — I Can Trackers: 1–5 score columns
 *
 *  Adds the 5-point scale to every student's "I Can Tracker" and fills in
 *  their scores from "2627 Standards Progress Tracker - Teacher Version".
 *
 *   • Start Here tab → "My progress at a glance" table gets two new columns,
 *     Beginning (1) and Developing (2), and the existing columns become
 *     Approaching (3), Proficient (4), Mastery (5). The student's score is
 *     written in the column that matches it (a 4 goes under Proficient (4)).
 *   • Key shows: 1 Beginning → 2 Developing → 3 Approaching → 4 Proficient → 5 Mastery
 *   • Each standard tab's level headings get their number:
 *     "Approaching (3)", "Proficient (4)", "Mastery (5)".
 *   • Students' checkboxes and anything they typed are left alone.
 *   • It only READS the teacher tracker. It never changes it.
 *
 *  HOW TO USE  (this goes in the same script project as StudentFolders:
 *               Files  +  → Script → name it ICanTrackers → paste → Save)
 *   1. Run  testICanTracker
 *        Makes ONE test copy in the "2627 Student Standards Data Tracker"
 *        folder, filled with the first student's scores. The link is in the
 *        Execution log. Open it and check the Start Here tab and a standard tab.
 *        (Delete the test copy when you're happy.)
 *   2. Run  updateICanTrackers
 *        Updates the I Can Tracker template and all 62 student copies.
 *        Works a few minutes at a time and continues by itself until done.
 *        Progress shows in column G ("I Can Tracker") of the Student Folders tab.
 *   3. Whenever the teacher tracker changes, run  updateICanTrackers  again.
 *        It only rewrites the score numbers.
 *
 *  Uses helpers from StudentFolders (readTracker_, logSheet_, pause_, …).
 * ════════════════════════════════════════════════════════════════════
 */

var ICAN = {
  NAMES   : ['Beginning', 'Developing', 'Approaching', 'Proficient', 'Mastery'],
  FIRST   : 2,                       // column index of Beginning (0 = Standard, 1 = Topic)
  SCORE_RE: /^[1-5](\.\d+)?$/,
  COLOR   : '#1a237e',
  LOG_COL : 7                        // column G of the Student Folders tab
};

// ───────────────────────────── public ─────────────────────────────

function testICanTracker() {
  var data = readTracker_();
  checkSciNot_(data);
  var s = data.students.slice().sort(function (a, b) { return Object.keys(b.scores).length - Object.keys(a.scores).length; })[0];   // someone with every score
  var f = DriveApp.getFileById(SF.ICAN_DOC_ID)
    .makeCopy('TEST I Can Tracker — ' + s.name + ' (safe to delete)', DriveApp.getFolderById(SF.TRACKER_FOLDER));
  var doc = DocumentApp.openById(f.getId());
  upgradeICan_(doc);
  fillICan_(doc, s);
  doc.saveAndClose();
  Logger.log('Test copy for ' + s.name + ' (' + scoreSummary_(s) + '): ' + f.getUrl());
  return f.getUrl();
}

function updateICanTrackers() {
  var t0 = Date.now(), fn = 'updateICanTrackers';
  clearTriggers_(fn);
  var props = PropertiesService.getScriptProperties(), key = 'sf_done_ican';
  var done = JSON.parse(props.getProperty(key) || '{}');

  var data = readTracker_();
  checkSciNot_(data);

  if (!done.__template) {                                   // the template, so future copies match
    var td = DocumentApp.openById(SF.ICAN_DOC_ID);
    upgradeICan_(td);
    td.saveAndClose();
    done.__template = 1;
    props.setProperty(key, JSON.stringify(done));
  }

  var log = logSheet_();
  if (!log.getRange(1, ICAN.LOG_COL).getValue()) log.getRange(1, ICAN.LOG_COL).setValue('I Can Tracker').setFontWeight('bold');

  for (var i = 0; i < data.students.length; i++) {
    var s = data.students[i];
    if (done[s.key]) continue;
    if (Date.now() - t0 > SF.MAX_MS) return pause_(props, key, done, fn, 1, 'Paused after ' + (Object.keys(done).length - 1) + ' of ' + data.students.length + ' students; continues in 1 minute.');
    var row = logRow_(log, s);
    try {
      var id = folderIdFromLink_(log.getRange(row, 4).getValue());
      var file = id ? firstFile_(DriveApp.getFolderById(id), 'I Can Tracker — ' + s.name) : null;
      if (!file) {
        log.getRange(row, ICAN.LOG_COL).setValue(id ? 'No I Can Tracker in folder' : 'No folder');
      } else {
        var doc = DocumentApp.openById(file.getId());
        upgradeICan_(doc);
        fillICan_(doc, s);
        doc.saveAndClose();
        log.getRange(row, ICAN.LOG_COL).setValue(scoreSummary_(s) + ' · ' + stamp_());
      }
    } catch (e) {
      log.getRange(row, ICAN.LOG_COL).setValue('Retrying: ' + String(e.message || e).slice(0, 120));
      return pause_(props, key, done, fn, 2, 'Stopped on ' + s.name + ' (' + e.message + '); retrying in 2 minutes.');
    }
    done[s.key] = 1;
    props.setProperty(key, JSON.stringify(done));
  }
  props.deleteProperty(key);
  return 'Updated ' + data.students.length + ' I Can Trackers.';
}

// ───────────────────────────── layout (safe to run more than once) ─────────────────────────────

function upgradeICan_(doc) {
  var start = doc.getTabs()[0].asDocumentTab().getBody();

  // 1. At-a-glance table: add Beginning (1) and Developing (2), number the others
  var tbl = glanceTable_(start);
  if (!tbl) throw new Error('Could not find the "My progress at a glance" table');
  if (tbl.getRow(0).getNumCells() === 5) {
    for (var r = 0; r < tbl.getNumRows(); r++) {
      var row = tbl.getRow(r), src = row.getCell(ICAN.FIRST);
      for (var k = 1; k >= 0; k--) {
        var c = row.insertTableCell(ICAN.FIRST, src.copy());   // copy "Approaching" so borders/colors match
        if (r === 0) c.replaceText('Approaching', ICAN.NAMES[k] + ' (' + (k + 1) + ')');
        else blankCell_(c);                                   // no checkbox in Beginning/Developing
      }
    }
    var head = tbl.getRow(0);
    for (var n = 1; n <= 5; n++) {
      var hc = head.getCell(ICAN.FIRST + n - 1);
      if (n >= 3) hc.replaceText('^' + ICAN.NAMES[n - 1] + '$', ICAN.NAMES[n - 1] + ' (' + n + ')');
      hc.editAsText().setFontSize(8);
    }
    setWidths_(start, tbl);
  }

  // 2. Key line and the note under "My progress at a glance"
  paragraphs_(start).forEach(function (p) {
    var t = p.getText();
    if (/^Levels:/.test(t) && t.indexOf('1 Beginning') < 0) {
      p.setText('Levels:  1 Beginning → 2 Developing → 3 Approaching → 4 Proficient → 5 Mastery');
      p.editAsText().setBold(true);
    }
    if (/^Tap a standard to open it\. When you finish/.test(t) && t.indexOf('Mr. Allen') < 0) {
      p.appendText('  Mr. Allen writes your score (1–5) in the matching column.');
    }
  });

  // 3. Level headings on every standard tab
  allTabs_(doc).forEach(function (tab) {
    paragraphs_(tab.asDocumentTab().getBody()).forEach(function (p) {
      var m = p.getText().match(/^(Approaching|Proficient|Mastery)(?!\s*\()\s+Targets/);
      if (m) p.editAsText().insertText(m[1].length, ' (' + (ICAN.NAMES.indexOf(m[1]) + 1) + ')');
    });
  });
}

// ───────────────────────────── scores ─────────────────────────────

function fillICan_(doc, s) {
  var tbl = glanceTable_(doc.getTabs()[0].asDocumentTab().getBody());
  if (!tbl) throw new Error('Could not find the "My progress at a glance" table');
  for (var r = 1; r < tbl.getNumRows(); r++) {
    var row = tbl.getRow(r);
    if (row.getNumCells() < ICAN.FIRST + 5) continue;
    var m = row.getCell(0).getText().trim().match(/^NC\.8\.[A-Z]+\.\d+/);
    if (!m) continue;
    for (var k = 0; k < 5; k++) clearScore_(row.getCell(ICAN.FIRST + k));
    var v = s.scores[m[0]];
    if (v === undefined || v === null || v === '') continue;
    var n = Math.floor(Number(v));
    if (n >= 1 && n <= 5) putScore_(row.getCell(ICAN.FIRST + n - 1), Number(v));
  }
}

function clearScore_(cell) {
  for (var i = cell.getNumChildren() - 1; i >= 0; i--) {
    var ch = cell.getChild(i);
    if (ch.getType() !== DocumentApp.ElementType.PARAGRAPH) continue;
    if (!ICAN.SCORE_RE.test(ch.asParagraph().getText().trim())) continue;
    if (cell.getNumChildren() > 1) cell.removeChild(ch); else ch.asParagraph().setText('');
  }
}

function putScore_(cell, v) {
  var only = cell.getNumChildren() === 1 ? cell.getChild(0) : null, p;
  if (only && only.getType() === DocumentApp.ElementType.PARAGRAPH && only.asParagraph().getText().trim() === '') {
    p = only.asParagraph();
    p.setText(String(v));
  } else {
    p = cell.appendParagraph(String(v));
  }
  p.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  p.editAsText().setBold(true).setFontSize(14).setForegroundColor(ICAN.COLOR);
}

// Stop if Sci Not B is still sitting in the EE.7 column.
function checkSciNot_(data) {
  var ee7 = 0, ee4 = 0;
  data.students.forEach(function (s) { if (s.scores['NC.8.EE.7'] !== undefined) ee7++; if (s.scores['NC.8.EE.4'] !== undefined) ee4++; });
  if (ee7 && !ee4) throw new Error('The teacher tracker still has the Sci Not B scores in the EE.7 column. Upload the fixed tracker first (Manage versions → Upload new version), then run this again.');
}

// ───────────────────────────── helpers ─────────────────────────────

function glanceTable_(body) {
  for (var i = 0; i < body.getNumChildren(); i++) {
    var el = body.getChild(i);
    if (el.getType() !== DocumentApp.ElementType.TABLE) continue;
    var t = el.asTable(), head = t.getRow(0);
    if (head.getNumCells() >= 5 && head.getCell(0).getText().trim() === 'Standard' && /Approaching/.test(t.getRow(0).getText())) return t;
  }
  return null;
}

// Empty a copied cell (removes the checkbox) but keep its look.
function blankCell_(c) {
  var p = c.appendParagraph('');
  while (c.getNumChildren() > 1) c.removeChild(c.getChild(0));
  p.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
}

function setWidths_(body, tbl) {
  try {
    var usable = body.getPageWidth() - body.getMarginLeft() - body.getMarginRight();
    var std = 70, lvl = 60, topic = Math.max(90, usable - std - 5 * lvl);
    tbl.setColumnWidth(0, std);
    tbl.setColumnWidth(1, topic);
    for (var k = 0; k < 5; k++) tbl.setColumnWidth(ICAN.FIRST + k, lvl);
  } catch (e) { /* keep Google's widths */ }
}

function allTabs_(doc) {
  var out = [];
  (function walk(tabs) { tabs.forEach(function (t) { out.push(t); walk(t.getChildTabs()); }); })(doc.getTabs());
  return out;
}

function paragraphs_(body) {
  var out = [];
  for (var i = 0; i < body.getNumChildren(); i++) {
    var el = body.getChild(i);
    if (el.getType() === DocumentApp.ElementType.PARAGRAPH) out.push(el.asParagraph());
  }
  return out;
}

function scoreSummary_(s) {
  return Object.keys(s.scores).sort().map(function (k) { return k.replace('NC.8.', '') + ' ' + Number(s.scores[k]); }).join(', ');
}
