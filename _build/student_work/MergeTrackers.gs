/**
 * ════════════════════════════════════════════════════════════════════
 *  Mr. Allen's Math Class — ONE tracker per student
 *
 *  Merges each student's "Standards Tracker" into their tabbed
 *  "I Can Tracker", so students have one document instead of two.
 *
 *  What the merged I Can Tracker gets:
 *   • Start Here tab
 *       – "How to use this tracker" shortened to 4 steps.
 *       – NEW "My focus right now": up to 3 standards scored below 4,
 *         lowest first, each a link straight to that standard's tab.
 *       – "My progress at a glance" 1–5 scores (as before).
 *   • Every standard tab
 *       – NEW gold box at the top: "My score" and "Next step"
 *         (which level of targets to work on, e.g. "Proficient targets (Targets 5–7)").
 *       – Targets the student checked off in their old Standards Tracker are
 *         marked "✔ Checked off". Targets you marked ✓ in the teacher tracker
 *         are marked "✔ Mr. Allen checked this".
 *   • Students' own checkboxes and anything they typed are left alone.
 *   • Old Standards Trackers are MOVED (not deleted) to
 *       2627 Student Folders / Archive — old Standards Trackers
 *     Students no longer see them. Move one back any time.
 *   • It only READS the teacher tracker. It never changes it.
 *
 *  HOW TO USE  (same script project as StudentFolders and ICanTrackers:
 *               Files  +  → Script → name it MergeTrackers → paste → Save)
 *   1. (Optional) Run  testMergedTracker
 *        Makes ONE test copy of a student's merged tracker in the
 *        "2627 Student Standards Data Tracker" folder. Nothing else changes.
 *        The link is in the Execution log. Delete the copy when done.
 *   2. Run  mergeTrackers
 *        Updates the template and all 62 I Can Trackers, then archives the
 *        old Standards Trackers. Works a few minutes at a time and continues
 *        by itself. Progress: column H ("Merged tracker") of the Student
 *        Folders tab in the Student Work sheet.
 *   3. From now on, whenever the teacher tracker changes, run  updateTrackers
 *        It refreshes the 1–5 grid, the gold score boxes and the focus list.
 *        (updateStudentScores still updates the Self-Assessment forms and
 *        Fluency Results.)
 *
 *  Uses helpers from StudentFolders and ICanTrackers.
 * ════════════════════════════════════════════════════════════════════
 */

var MT = {
  ARCHIVE     : 'Archive — old Standards Trackers',
  LOG_COL     : 8,                       // column H of the Student Folders tab
  BOX_BG      : '#FFF8E1',
  BOX_BORDER  : '#E0A800',
  MARK_COLOR  : '#1B6E3A',
  FOCUS_HEAD  : 'My focus right now',
  GLANCE_HEAD : 'My progress at a glance',
  HOWTO_HEAD  : 'How to use this tracker',
  STUDENT_MARK: '✔ Checked off',
  TEACHER_MARK: '✔ Mr. Allen checked this',
  HOWTO: [
    'Pick a standard. Tap it in "My focus right now" or in the table below. You can also click ☰ at the top left and choose it from the menu.',
    'Read the gold box. It shows your score and which targets to work on next.',
    'Work on those targets. Tap "Try a practice problem →" to check yourself. When you can do a target on your own, click its box.',
    'Go back. Tap "← Back to Start Here" to pick another standard.'
  ]
};

// ───────────────────────────── public ─────────────────────────────

function mergeTrackers()  { return runMerge_(true); }
function updateTrackers() { return runMerge_(false); }

function testMergedTracker() {
  var data = readTracker_();
  checkSciNot_(data);
  var s = data.students.slice().sort(function (a, b) { return Object.keys(b.scores).length - Object.keys(a.scores).length; })[0];
  var log = logSheet_(), row = logRow_(log, s), id = folderIdFromLink_(log.getRange(row, 4).getValue());
  if (!id) throw new Error('No folder found for ' + s.name + ' on the Student Folders tab.');
  var folder = DriveApp.getFolderById(id), file = firstFile_(folder, 'I Can Tracker — ' + s.name);
  if (!file) throw new Error('No I Can Tracker in ' + s.name + "'s folder.");
  var old = firstFile_(folder, 'Standards Tracker — ' + s.name);
  var checks = old ? readChecks_(DocumentApp.openById(old.getId()).getBody()) : {};
  var copy = file.makeCopy('TEST merged tracker — ' + s.name + ' (safe to delete)', DriveApp.getFolderById(SF.TRACKER_FOLDER));
  var doc = DocumentApp.openById(copy.getId());
  var marked = mergeOne_(doc, s, checks);
  doc.saveAndClose();
  Logger.log('Test merged tracker for ' + s.name + ' (' + marked + ' targets marked): ' + copy.getUrl());
  return copy.getUrl();
}

// ───────────────────────────── batch runner ─────────────────────────────

function runMerge_(archive) {
  var t0 = Date.now(), fn = archive ? 'mergeTrackers' : 'updateTrackers';
  clearTriggers_(fn);
  var props = PropertiesService.getScriptProperties(), key = 'sf_done_' + fn;
  var done = JSON.parse(props.getProperty(key) || '{}');

  var data = readTracker_();
  checkSciNot_(data);

  if (!done.__template) {                                   // the template, so future copies match
    var td = DocumentApp.openById(SF.ICAN_DOC_ID);
    upgradeICan_(td);
    mergeOne_(td, null, {});
    td.saveAndClose();
    done.__template = 1;
    props.setProperty(key, JSON.stringify(done));
  }

  var log = logSheet_();
  if (!log.getRange(1, MT.LOG_COL).getValue()) log.getRange(1, MT.LOG_COL).setValue('Merged tracker').setFontWeight('bold');
  var archiveFolder = archive
    ? childFolder_(childFolder_(DriveApp.getFolderById(SF.TRACKER_FOLDER), SF.ROOT_NAME), MT.ARCHIVE) : null;

  for (var i = 0; i < data.students.length; i++) {
    var s = data.students[i];
    if (done[s.key]) continue;
    if (Date.now() - t0 > SF.MAX_MS) return pause_(props, key, done, fn, 1, 'Paused after ' + (Object.keys(done).length - 1) + ' of ' + data.students.length + ' students; continues in 1 minute.');
    var row = logRow_(log, s);
    try {
      var id = folderIdFromLink_(log.getRange(row, 4).getValue());
      var folder = id ? DriveApp.getFolderById(id) : null;
      var file = folder ? firstFile_(folder, 'I Can Tracker — ' + s.name) : null;
      if (!file) {
        log.getRange(row, MT.LOG_COL).setValue(folder ? 'No I Can Tracker in folder' : 'No folder');
      } else {
        var old = firstFile_(folder, 'Standards Tracker — ' + s.name);
        var checks = old ? readChecks_(DocumentApp.openById(old.getId()).getBody()) : {};
        var doc = DocumentApp.openById(file.getId());
        upgradeICan_(doc);
        fillGrid_(doc, s);
        var marked = mergeOne_(doc, s, checks);
        doc.saveAndClose();
        var note = (old ? Object.keys(checks).length + ' checks carried over' : 'no old tracker') + ' · ' + marked + ' marked';
        if (old && archiveFolder) { old.moveTo(archiveFolder); note += ' · old tracker archived'; }
        log.getRange(row, MT.LOG_COL).setValue(note + ' · ' + stamp_());
      }
    } catch (e) {
      log.getRange(row, MT.LOG_COL).setValue('Retrying: ' + String(e.message || e).slice(0, 120));
      return pause_(props, key, done, fn, 2, 'Stopped on ' + s.name + ' (' + e.message + '); retrying in 2 minutes.');
    }
    done[s.key] = 1;
    props.setProperty(key, JSON.stringify(done));
  }
  props.deleteProperty(key);
  return (archive ? 'Merged ' : 'Updated ') + data.students.length + ' trackers.';
}

// ───────────────────────────── one tracker (safe to run more than once) ─────────────────────────────

// s = student (null for the template). checks = {'NS.1-3': 1, …} from the old Standards Tracker.
function mergeOne_(doc, s, checks) {
  var tabs = {}, order = [], marked = 0;
  allTabs_(doc).forEach(function (tab) {
    var body = tab.asDocumentTab().getBody(), head = stdHeading_(body);
    if (!head) return;
    var std = head.std;
    tabs[std] = { id: tab.getId(), title: head.text };
    order.push(std);
    var levels = levelRanges_(body);
    setScoreBox_(body, s ? s.scores[std] : undefined, levels);
    if (s) marked += markTargets_(body, std, s.ticks || {}, checks || {});
    tabs[std].levels = levels;
  });
  var start = doc.getTabs()[0].asDocumentTab().getBody();
  setHowTo_(start);
  setFocus_(start, doc.getId(), s, tabs, order);
  return marked;
}

// ───────────────────────────── standard tabs ─────────────────────────────

function stdHeading_(body) {
  var ps = paragraphs_(body);
  for (var i = 0; i < ps.length; i++) {
    if (ps[i].getHeading() === DocumentApp.ParagraphHeading.NORMAL) continue;
    var t = ps[i].getText().trim(), m = t.match(/^(NC\.8\.[A-Z]+\.\d+)\s*·/);
    if (m) return { std: m[1], text: t.replace(/\s+/g, ' ') };
  }
  return null;
}

// {Approaching: 'Targets 1–4', Proficient: 'Targets 5–7', Mastery: 'Targets 8–9'}
function levelRanges_(body) {
  var out = {};
  paragraphs_(body).forEach(function (p) {
    var m = p.getText().match(/^(Approaching|Proficient|Mastery)\s*(?:\(\d\))?\s+(Targets?\s+[\d–\-]+)/);
    if (m) out[m[1]] = m[2].replace('-', '–');
  });
  return out;
}

function nextStep_(score, levels) {
  var n = (score === undefined || score === null || score === '') ? 0 : Math.floor(Number(score));
  if (n >= 5) return 'Next step: you reached Mastery. Keep it up: review the Mastery targets or help a classmate.';
  var lvl = n >= 4 ? 'Mastery' : (n >= 3 ? 'Proficient' : 'Approaching');
  var range = levels[lvl] ? ' (' + levels[lvl] + ')' : '';
  if (!n) return 'Next step: start with the Approaching targets' + range + '.';
  return 'Next step: work on the ' + lvl + ' targets' + range + '.';
}

// Gold box under the "Practice all … / ← Back to Start Here" line. Replaced on every run.
function setScoreBox_(body, score, levels) {
  for (var i = body.getNumChildren() - 1; i >= 0; i--) {
    var el = body.getChild(i);
    if (el.getType() === DocumentApp.ElementType.TABLE && el.asTable().getText().indexOf('My score:') === 0) body.removeChild(el);
  }
  var at = -1, ps = paragraphs_(body);
  for (var k = 0; k < ps.length; k++) if (ps[k].getText().indexOf('Practice all') >= 0) { at = body.getChildIndex(ps[k]); break; }
  if (at < 0) { var h = stdHeading_(body); if (!h) return; at = 1; }
  var line1 = 'My score: ' + scoreText_(score), line2 = nextStep_(score, levels);
  var t = body.insertTable(at + 1, [[line1]]);
  t.setBorderColor(MT.BOX_BORDER).setBorderWidth(1.5);
  var cell = t.getCell(0, 0);
  cell.setBackgroundColor(MT.BOX_BG).setPaddingTop(6).setPaddingBottom(6).setPaddingLeft(10).setPaddingRight(10);
  cell.getChild(0).asParagraph().editAsText().setBold(true).setFontSize(12);
  cell.appendParagraph(line2).editAsText().setBold(false).setFontSize(11);
}

// Mark targets done in the old tracker (student) or ✓ in the teacher tracker. Never removes a mark.
function markTargets_(body, std, ticks, checks) {
  var short = std.replace('NC.8.', ''), n = 0;
  for (var i = 0; i < body.getNumChildren(); i++) {
    var el = body.getChild(i);
    if (el.getType() !== DocumentApp.ElementType.TABLE) continue;
    var table = el.asTable();
    for (var r = 0; r < table.getNumRows(); r++) {
      var row = table.getRow(r);
      if (row.getNumCells() < 2) continue;
      var cell = row.getCell(1), m = cell.getText().match(/Target (\d+)/);
      if (!m) continue;
      var key = short + '-' + m[1], mark = ticks[key] ? MT.TEACHER_MARK : (checks[key] ? MT.STUDENT_MARK : '');
      if (!mark || cell.getText().indexOf('✔') >= 0) continue;
      var p = cell.appendParagraph(mark);
      p.editAsText().setBold(true).setItalic(false).setFontSize(9).setForegroundColor(MT.MARK_COLOR).setLinkUrl(null);
      n++;
    }
  }
  return n;
}

// ───────────────────────────── Start Here tab ─────────────────────────────

function setHowTo_(body) {
  var head = findPara_(body, MT.HOWTO_HEAD);
  if (!head) return;
  var i = body.getChildIndex(head) + 1;
  var nextEl = i < body.getNumChildren() ? body.getChild(i) : null;
  if (nextEl && nextEl.getType() === DocumentApp.ElementType.LIST_ITEM &&
      nextEl.asListItem().getText().indexOf(MT.HOWTO[0].slice(0, 20)) === 0) {        // already done: just fix bold
    for (var j = i; j < body.getNumChildren() && body.getChild(j).getType() === DocumentApp.ElementType.LIST_ITEM; j++) {
      var tt = body.getChild(j).asListItem().editAsText(), str = tt.getText(), d = str.indexOf('.');
      if (d > 0 && d < str.length - 1) { tt.setBold(0, d, true); tt.setBold(d + 1, str.length - 1, false); }
    }
    return;
  }
  while (i < body.getNumChildren() && body.getChild(i).getType() === DocumentApp.ElementType.LIST_ITEM) body.removeChild(body.getChild(i));
  var first = null;
  MT.HOWTO.forEach(function (t, k) {
    var li = body.insertListItem(i + k, t);
    if (!first) { first = li; li.setGlyphType(DocumentApp.GlyphType.NUMBER); } else li.setListId(first);
    var tx = li.editAsText(), dot = t.indexOf('.');
    tx.setBold(0, dot, true);
    tx.setBold(dot + 1, t.length - 1, false);
  });
}

function setFocus_(body, docId, s, tabs, order) {
  var glance = findPara_(body, MT.GLANCE_HEAD);
  if (!glance) return;
  var old = findPara_(body, MT.FOCUS_HEAD);
  if (old) {
    var f = body.getChildIndex(old), g = body.getChildIndex(glance);
    for (var j = g - 1; j >= f; j--) body.removeChild(body.getChild(j));
  }
  var at = body.getChildIndex(glance);
  body.insertParagraph(at, MT.FOCUS_HEAD).setHeading(glance.getHeading());

  var picks = [];
  if (s) order.forEach(function (std, idx) {
    var v = s.scores[std];
    if (v === undefined || v === null || v === '' || Number(v) >= 4) return;
    picks.push({ std: std, v: Number(v), idx: idx });
  });
  picks.sort(function (a, b) { return a.v - b.v || a.idx - b.idx; });
  picks = picks.slice(0, 3);

  var scored = s ? order.filter(function (std) { var v = s.scores[std]; return v !== undefined && v !== null && v !== ''; }).length : 0;
  var intro = picks.length ? 'Start with these standards. Tap one to open it.'
    : (scored ? 'Nice work: every standard scored so far is at 4 (Proficient) or higher. Keep going with the next unit.'
              : 'When Mr. Allen scores a standard below 4, it shows up here so you know where to focus.');
  body.insertParagraph(at + 1, intro).setHeading(DocumentApp.ParagraphHeading.NORMAL).editAsText().setBold(false).setLinkUrl(null);

  var first = null;
  picks.forEach(function (p, k) {
    var t = tabs[p.std], lvl = nextStep_(p.v, t.levels || {}).replace(/^Next step: /, '').replace(/\.$/, '');
    var label = t.title.replace(/\s*·\s*/, ' · ');
    var text = label + '  —  score ' + p.v + ', ' + lvl;
    var li = body.insertListItem(at + 2 + k, text);
    if (!first) { first = li; li.setGlyphType(DocumentApp.GlyphType.BULLET); } else li.setListId(first);
    var tx = li.editAsText();
    tx.setBold(false).setLinkUrl(null);
    tx.setLinkUrl(0, label.length - 1, 'https://docs.google.com/document/d/' + docId + '/edit?tab=' + t.id);
    tx.setBold(0, label.length - 1, true);
  });
}

// ───────────────────────────── old Standards Tracker ─────────────────────────────

// Targets checked in the old tracker: any box that is not an empty ☐ ('☒', 'X', '✓' …).
function readChecks_(body) {
  var out = {}, std = null;
  for (var i = 0; i < body.getNumChildren(); i++) {
    var el = body.getChild(i), type = el.getType();
    if (type === DocumentApp.ElementType.PARAGRAPH) {
      var m = el.asParagraph().getText().match(/^(NC\.8\.[A-Z]+\.\d+)\s+·/);
      if (m) std = m[1];
    } else if (type === DocumentApp.ElementType.TABLE && std) {
      var t = el.asTable();
      for (var r = 0; r < t.getNumRows(); r++) {
        var row = t.getRow(r);
        if (row.getNumCells() < 2) continue;
        var tm = row.getCell(1).getText().match(/Target (\d+)/);
        if (!tm) continue;
        var box = row.getCell(0).getText().replace(/\s/g, '');
        if (box && box !== '☐') out[std.replace('NC.8.', '') + '-' + tm[1]] = 1;
      }
    }
  }
  return out;
}

// Same as fillICan_ (ICanTrackers), but safe to run again: a cell that holds only
// a score is emptied without setText(''), which Google rejects.
function fillGrid_(doc, s) {
  var tbl = glanceTable_(doc.getTabs()[0].asDocumentTab().getBody());
  if (!tbl) throw new Error('Could not find the "My progress at a glance" table');
  for (var r = 1; r < tbl.getNumRows(); r++) {
    var row = tbl.getRow(r);
    if (row.getNumCells() < ICAN.FIRST + 5) continue;
    var m = row.getCell(0).getText().trim().match(/^NC\.8\.[A-Z]+\.\d+/);
    if (!m) continue;
    for (var k = 0; k < 5; k++) clearGridScore_(row.getCell(ICAN.FIRST + k));
    var v = s.scores[m[0]];
    if (v === undefined || v === null || v === '') continue;
    var n = Math.floor(Number(v));
    if (n >= 1 && n <= 5) putScore_(row.getCell(ICAN.FIRST + n - 1), Number(v));
  }
}

function clearGridScore_(cell) {
  for (var i = cell.getNumChildren() - 1; i >= 0; i--) {
    var ch = cell.getChild(i);
    if (ch.getType() !== DocumentApp.ElementType.PARAGRAPH) continue;
    if (!ICAN.SCORE_RE.test(ch.asParagraph().getText().trim())) continue;
    if (cell.getNumChildren() === 1) cell.appendParagraph('').setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    cell.removeChild(ch);
  }
}

function findPara_(body, text) {
  var ps = paragraphs_(body);
  for (var i = 0; i < ps.length; i++) if (ps[i].getText().trim() === text) return ps[i];
  return null;
}
