/**
 * ════════════════════════════════════════════════════════════════════
 *  Mr. Allen's Math Class — Student Folders
 *
 *  2627 Student Folders → Period → Student, each student folder holding:
 *    • Standards Tracker (scores from "2627 Standards Progress Tracker - Teacher Version")
 *    • I Can Tracker (Tabbed) with name and period
 *    • Fluency Results — their own Fluency Lab Skill Checks and Flashpoint (view only)
 *    • Fluency Lab Tracker (printable PDF)
 *    • Self-Assessments/ — a Google Docs copy of every Student Self-Assessment form
 *
 *  It only READS the teacher tracker. It never changes it.
 *
 *  HOW TO USE  (add this as a second file in the Student Work script project:
 *               Files  +  → Script → name it StudentFolders → paste → Save)
 *   0. Left sidebar: Services  +  → choose "Drive API" → Add   (one time)
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
  FLUENCY_PDF_ID  : '1gWWEIUsyXFhZKk5NNQlSr4PcLOHYyTd-',  // 2627 Fluency Lab Tracker .pdf (printable)
  ICAN_DOC_ID     : '1gttB95Szivg3uf4ZKjtsdFFgG1TvaVuUFROZ1oD4peA',  // 2627 I Can Tracker (Tabbed): Student Template
  ROOT_NAME       : '2627 Student Folders',
  FORMS_SUB       : 'Self-Assessments',
  DOMAIN          : 'icimagine.org',
  LOG_TAB         : 'Student Folders',
  MAX_MS          : 3.5 * 60 * 1000   // leaves room under Google's 6-minute limit
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

  var data = readTracker_();                 // {students:[{key,name,period,scores:{},ticks:{}}]}
  var fl = readFluency_();
  var forms = mode === 'build' ? listForms_() : null;
  var root = mode === 'build' ? childFolder_(DriveApp.getFolderById(SF.TRACKER_FOLDER), SF.ROOT_NAME) : null;
  var log = logSheet_();

  for (var i = 0; i < data.students.length; i++) {
    var s = data.students[i];
    if (done[s.key]) continue;
    if (Date.now() - t0 > SF.MAX_MS) return pause_(props, key, done, fn, 1, 'Paused after ' + Object.keys(done).length + ' of ' + data.students.length + ' students; continues in 1 minute.');
    var row = logRow_(log, s), status = String(log.getRange(row, 5).getValue());
    try {
      var folder;
      if (mode === 'build') {
        if (/v2/.test(status)) { done[s.key] = 1; continue; }                  // already complete
        folder = childFolder_(childFolder_(root, s.period), s.name);
        var made = buildOne_(folder, s, forms, fl, /files/.test(status));
        writeLog_(log, row, s, folder, made + ' files v2');
      } else {
        var id = folderIdFromLink_(log.getRange(row, 4).getValue());
        if (!id) continue;
        folder = DriveApp.getFolderById(id);
        fillFolder_(folder, s);
        fluencySheet_(folder, s, fl);
        log.getRange(row, 5).setValue('Scores updated ' + stamp_() + ' v2');
      }
    } catch (e) {                                           // a Google hiccup: note it and try again in 2 minutes
      log.getRange(row, 5).setValue('Retrying: ' + String(e.message || e).slice(0, 120));
      return pause_(props, key, done, fn, 2, 'Stopped on ' + s.name + ' (' + e.message + '); retrying in 2 minutes.');
    }
    done[s.key] = 1;
    props.setProperty(key, JSON.stringify(done));   // save progress after every student
  }
  props.deleteProperty(key);
  return (mode === 'build' ? 'Built ' : 'Updated ') + data.students.length + ' students.';
}

function pause_(props, key, done, fn, minutes, msg) {
  props.setProperty(key, JSON.stringify(done));
  ScriptApp.newTrigger(fn).timeBased().after(minutes * 60 * 1000).create();
  return msg;
}

// ───────────────────────────── one student ─────────────────────────────

// Student folder:  Standards Tracker · I Can Tracker · Fluency Results · Fluency Lab Tracker (PDF)
//                  Self-Assessments/  (one form per standard)
function buildOne_(folder, s, forms, fl, alreadyFilled) {
  var sub = childFolder_(folder, SF.FORMS_SUB), count = 0;
  // Standards Tracker (filled with scores)
  var tName = 'Standards Tracker — ' + s.name, t = firstFile_(folder, tName);
  if (!t) t = DriveApp.getFileById(SF.TEMPLATE_DOC_ID).makeCopy(tName, folder);
  if (!alreadyFilled) { var td = DocumentApp.openById(t.getId()); fillTracker_(td.getBody(), s); td.saveAndClose(); }
  count++;
  // Self-assessment forms → Self-Assessments subfolder
  forms.forEach(function (f) {
    var name = f.std + ' Self-Assessment — ' + s.name, top = firstFile_(folder, name), inSub = firstFile_(sub, name), id = null;
    if (top) { top.moveTo(sub); if (!alreadyFilled) id = top.getId(); }
    else if (!inSub) id = withRetry_(function () { return convertCopy_(f.id, name, sub.getId()); });
    else if (!alreadyFilled) id = inSub.getId();
    if (id) { var d = DocumentApp.openById(id); fillForm_(d.getBody(), s, f.std); d.saveAndClose(); }
    count++;
  });
  // I Can Tracker (Tabbed) with name and period
  var iName = 'I Can Tracker — ' + s.name;
  if (!firstFile_(folder, iName)) {
    var ic = DriveApp.getFileById(SF.ICAN_DOC_ID).makeCopy(iName, folder), idoc = DocumentApp.openById(ic.getId()), b = idoc.getBody();
    b.replaceText('Name: _+', 'Name: ' + s.name); b.replaceText('Period: _+', 'Period: ' + s.period.replace('Period ', ''));
    idoc.saveAndClose();
  }
  count++;
  // Printable Fluency Lab tracker
  var pName = 'Fluency Lab Tracker (printable) — ' + s.name + '.pdf';
  if (!firstFile_(folder, pName)) DriveApp.getFileById(SF.FLUENCY_PDF_ID).makeCopy(pName, folder);
  count++;
  // Fluency results from the Fluency Lab sheet
  fluencySheet_(folder, s, fl);
  return count + 1;
}

function fillFolder_(folder, s) {
  [folder, childFolder_(folder, SF.FORMS_SUB)].forEach(function (fd) {
    var it = fd.getFiles();
    while (it.hasNext()) {
      var f = it.next();
      if (f.getMimeType() !== MimeType.GOOGLE_DOCS) continue;
      var title = f.getName(), m = title.match(/^(NC\.8\.[A-Z]+\.\d+) Self-Assessment/);
      if (title.indexOf('Standards Tracker') !== 0 && !m) continue;
      var doc = DocumentApp.openById(f.getId()), body = doc.getBody();
      if (m) fillForm_(body, s, m[1]); else fillTracker_(body, s);
      doc.saveAndClose();
    }
  });
}

function firstFile_(folder, name) { var it = folder.getFilesByName(name); return it.hasNext() ? it.next() : null; }

function withRetry_(fn) {
  for (var k = 0; k < 4; k++) {
    try { return fn(); } catch (e) { if (k === 3) throw e; Utilities.sleep(2000 * (k + 1)); }
  }
}

// ───────────────────────────── Fluency results ─────────────────────────────

var MODULES = ['Add & Subtract', 'Multiply', 'Divide', 'Fractions', 'Decimals & Percents', 'Integers', 'Ratios & Proportions', 'Expressions & Order of Operations'];

function readFluency_() {
  var ss = SpreadsheetApp.openById(FLUENCY_ID), out = { scores: [], flash: {}, flashHead: [], alias: {} };
  var r = ss.getSheetByName('Roster'), rv = r ? r.getDataRange().getValues() : [];
  for (var i = 1; i < rv.length; i++) {
    var n = String(rv[i][0]).trim(); if (!n) continue;
    out.alias[n] = [n].concat(String(rv[i][2] || '').split(',').map(function (x) { return x.trim(); }).filter(String));
  }
  var sc = ss.getSheetByName('Scores'), sv = sc ? sc.getDataRange().getValues() : [];
  for (var j = 1; j < sv.length; j++) if (sv[j][1]) out.scores.push({ when: sv[j][0], who: String(sv[j][1]), skill: String(sv[j][2]), score: sv[j][3], of: sv[j][4], pct: sv[j][5] });
  var fp = ss.getSheetByName('Flashpoint'), fv = fp ? fp.getDataRange().getValues() : [];
  if (fv.length) out.flashHead = fv[0].map(function (h) { return String(h).replace(/\s+/g, ' '); });
  for (var k = 1; k < fv.length; k++) if (fv[k][0]) out.flash[String(fv[k][0]).trim()] = fv[k];
  return out;
}

function isStudent_(typed, s, fl) {
  var t = String(typed).toLowerCase().replace(/\s+/g, ' ').trim(), names = fl.alias[s.name] || [s.name];
  for (var i = 0; i < names.length; i++) if (t === names[i].toLowerCase()) return true;
  var parts = s.name.toLowerCase().split(' '), first = parts[0], last = parts[parts.length - 1];
  return t.indexOf(first) >= 0 && t.indexOf(last) >= 0;
}

function sbg_(p) { return p >= 1 ? '4–5 (5 if you reached Level 6)' : p >= .8 ? '4 Mastery' : p >= .65 ? '3 Getting there' : p >= .4 ? '2 Partly' : '1 Starting'; }

function fluencySheet_(folder, s, fl) {
  var name = 'Fluency Results — ' + s.name, f = firstFile_(folder, name), ss;
  if (f) ss = SpreadsheetApp.openById(f.getId());
  else { ss = SpreadsheetApp.create(name); DriveApp.getFileById(ss.getId()).moveTo(folder); }
  var sh = ss.getSheets()[0]; sh.clear(); sh.setName('My Fluency');
  var mine = fl.scores.filter(function (r) { return isStudent_(r.who, s, fl); });
  var rows = [['Fluency Lab — My Results', '', '', '', '', ''], [s.name + ' · ' + s.period + ' · updated ' + stamp_(), '', '', '', '', ''], ['', '', '', '', '', ''],
              ['Module', 'Skill', 'Skill Check tries', 'Best %', 'SBG level (best)', 'Last try']];
  MODULES.forEach(function (m, i) {
    var t = mine.filter(function (r) { return r.skill === m; }), best = null, last = '';
    t.forEach(function (r) { var p = Number(r.pct) || (r.of ? r.score / r.of : 0); if (best === null || p > best) best = p; if (!last || r.when > last) last = r.when; });
    rows.push([i + 1, m, t.length || '', best === null ? '' : best, best === null ? 'not yet' : sbg_(best), last]);
  });
  rows.push(['', '', '', '', '', ''], ['Flashpoint', '', '', '', '', '']);
  var fr = null; Object.keys(fl.flash).forEach(function (k) { if (isStudent_(k, s, fl)) fr = fl.flash[k]; });
  for (var L = 1; L <= 5; L++) {
    var c = 2 + (L - 1) * 2;
    rows.push(['Level ' + L, 'Best right (of 20)', fr ? fr[c] : '', 'Stars', fr ? fr[c + 1] : '', '']);
  }
  rows.push(['Best points', fr ? fr[12] : '', 'Rounds played', fr ? fr[13] : '', 'Last played', fr ? fr[14] : '']);
  rows.push(['', '', '', '', '', ''], ['All my Skill Checks', '', '', '', '', ''], ['Date', 'Skill', 'Score', 'Out of', 'Percent', '']);
  mine.sort(function (a, b) { return a.when < b.when ? 1 : -1; }).forEach(function (r) { rows.push([r.when, r.skill, r.score, r.of, r.pct, '']); });
  if (!mine.length) rows.push(['No Skill Checks sent yet.', '', '', '', '', '']);
  sh.getRange(1, 1, rows.length, 6).setValues(rows);
  sh.getRange('A1').setFontSize(16).setFontWeight('bold'); sh.getRange('A4:F4').setFontWeight('bold').setBackground('#1E2D4F').setFontColor('#FFFFFF');
  sh.getRange(5, 4, 8, 1).setNumberFormat('0%');
  [14, 22, 23].forEach(function (r) { if (r <= rows.length) sh.getRange(r, 1, 1, 6).setFontWeight('bold'); });
  sh.setColumnWidth(2, 240); sh.setColumnWidth(5, 220); sh.setFrozenRows(4);
  sh.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(function (x) { x.remove(); });
  var pr = sh.protect().setDescription('Filled in by Mr. Allen');            // students can look, not change
  pr.removeEditors(pr.getEditors()); if (pr.canDomainEdit()) pr.setDomainEdit(false);
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
// Uses the Drive API service (left sidebar: Services + → Drive API → Add).
function convertCopy_(id, name, parentId, mime) {
  var body = { name: name, mimeType: mime || MimeType.GOOGLE_DOCS };
  if (parentId) body.parents = [parentId];
  return Drive.Files.copy(body, id, { supportsAllDrives: true }).id;
}

function share_(folderId, email) {
  Drive.Permissions.create({ role: 'writer', type: 'user', emailAddress: email }, folderId,
    { sendNotificationEmail: false, supportsAllDrives: true });
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
