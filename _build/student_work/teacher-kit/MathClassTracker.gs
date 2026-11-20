/**
 * ════════════════════════════════════════════════════════════════════
 *  Math Class Tracker — ONE Google Sheet for one teacher's classes
 *  (Nov 20, 2026: made for the 7th grade site; works for any grade that
 *   uses the same website scripts: score-send.js, arcade-send.js, save-work.js)
 *
 *  What it collects (every tab is made for you by  setup):
 *    • Notes Practice, Tutorials, Pre-Tests, Homework: one row per "Send my work"
 *    • Responses: one row per question (first-try right or not, standard, Score level)
 *    • Arcade: one row per game visit (minutes, rounds, score, accuracy)
 *    • Saved Work: lets a student pick up their work on another Chromebook
 *  What it works out by itself (formula tabs, they update on their own):
 *    • Reteach: every question, lowest % right on the first try at the top
 *    • By Standard: % right on the first try for each standard
 *    • By Student: answers, % right on the first try, pages sent, arcade minutes
 *    • Arcade by Student, Arcade by Game
 *  What the website can ask for:
 *    • <web app URL>?leaders=1   → Arcade High Scores (top 5 per game, "First L." only)
 *
 *  SETUP (about 10 minutes) — full steps are in the guide.
 *   1. Make a new Google Sheet. Extensions → Apps Script.
 *   2. Delete what is there, paste this whole file, click Save.
 *   3. Change CLASS_CODE below to your own short code (letters, numbers, dashes). Save.
 *   4. Choose  setup  in the function menu at the top and press Run. Allow the permissions.
 *   5. Deploy → New deployment → gear → Web app.  Execute as: Me.  Who has access: Anyone.
 *      Deploy, then copy the Web app URL (it ends in /exec).
 *   6. Put the URL and the class code in the website's tracker-config.js (the 7th grade block).
 *   7. Type your students on the Roster tab (Student, Period, Also typed as).
 *  After any later change to this script: Deploy → Manage deployments → pencil →
 *  Version: New version → Deploy. That keeps the same URL.
 *
 *  Privacy: the sheet is private to you. The website only ever gets back High Scores,
 *  and only as "First L." for students who are on your Roster.
 * ════════════════════════════════════════════════════════════════════
 */

var CLASS_CODE = 'math7-class';   // ← change this; it must match CLASS_CODE in tracker-config.js
var MAX_HW_Q   = 10;
var HEAD_BG    = '#3E2414', HEAD_FG = '#FFFFFF';

var TABS = {
  'Roster':         ['Student (first and last)', 'Period', 'Also typed as (commas)'],
  'Notes Practice': ['Time', 'Student', 'Period', 'Unit', 'Page', 'Questions', 'Right on first try', '% right', 'Answers shown', 'Missed on first try', 'Skipped (not answered)', 'Minutes working'],
  'Tutorials':      ['Time', 'Student', 'Period', 'Unit', 'Page', 'Questions', 'Right on first try', '% right', 'Answers shown', 'Missed on first try', 'Skipped (not answered)', 'Minutes working'],
  'Pre-Tests':      ['Time', 'Student', 'Period', 'Unit', 'Page', 'Questions', 'Right on first try', '% right', 'Answers shown', 'Missed on first try', 'Skipped (not answered)', 'Minutes working'],
  'Homework':       ['Time', 'Student', 'Period', 'Unit', 'Assignment', 'Answered'].concat(qHeads_()).concat(['Checked right', 'Missed']),
  'Responses':      ['Time', 'Student', 'Period', 'Source', 'Unit', 'Page', 'Question', 'Standard', 'Score level', 'Right on first try', 'Right in the end', 'Tries'],
  'Arcade':         ['Time', 'Student', 'Period', 'Game', 'Unit', 'Minutes played', 'Rounds finished', 'Level reached', 'Score', 'Correct', 'Tries', 'Accuracy', 'Details']
};
function qHeads_() { var a = []; for (var i = 1; i <= MAX_HW_Q; i++) a.push('Q' + i); return a; }

/* ── setup: run once from the editor. Safe to run again (it never deletes student rows). ── */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Open this script from your Google Sheet (Extensions → Apps Script), then run setup again.');
  PropertiesService.getScriptProperties().setProperty('SHEET_ID', ss.getId());
  Object.keys(TABS).forEach(function (name) { tab_(ss, name); });
  ss.getSheetByName('Roster').setColumnWidth(1, 220).setColumnWidth(3, 260);
  ss.getSheetByName('Notes Practice').getRange('H:H').setNumberFormat('0%');
  ss.getSheetByName('Tutorials').getRange('H:H').setNumberFormat('0%');
  ss.getSheetByName('Pre-Tests').getRange('H:H').setNumberFormat('0%');
  ss.getSheetByName('Arcade').getRange('L:L').setNumberFormat('0%');
  formulas_(ss);
  readMe_(ss);
  var blank = ss.getSheetByName('Sheet1');               // a new Sheet starts with an empty "Sheet1": remove it
  if (blank && blank.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(blank);
  ss.setActiveSheet(ss.getSheetByName('Read Me'));
  return 'Ready. Next: Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).';
}

function book_() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  return id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
}
function tab_(ss, name) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    var h = TABS[name];
    if (h) {
      sh.getRange(1, 1, 1, h.length).setValues([h]).setFontWeight('bold').setBackground(HEAD_BG).setFontColor(HEAD_FG);
      sh.setFrozenRows(1);
    }
  }
  return sh;
}

/* ── formula tabs (made by setup; they update by themselves) ── */
function formulas_(ss) {
  function f(name, formula, note) {
    var sh = ss.getSheetByName(name) || ss.insertSheet(name);
    sh.clear(); sh.getRange('A1').setFormula(formula);
    sh.getRange('1:1').setFontWeight('bold'); sh.setFrozenRows(1);
    if (note) sh.getRange('J1').setValue(note).setFontStyle('italic');
    return sh;
  }
  f('Reteach', '=IFERROR(QUERY(Responses!D2:L, "select D, F, G, H, count(J), sum(J), avg(J) where G is not null group by D, F, G, H order by avg(J) asc ' +
    'label D \'Source\', F \'Page\', G \'Question\', H \'Standard\', count(J) \'Answers\', sum(J) \'Right on first try\', avg(J) \'% right\'", 0), "No answers yet")',
    'Lowest % right is at the top: reteach those first.').getRange('G:G').setNumberFormat('0%');
  f('By Standard', '=IFERROR(QUERY(Responses!E2:L, "select H, count(J), sum(J), avg(J) where H is not null and H <> \'\' group by H order by avg(J) asc ' +
    'label H \'Standard\', count(J) \'Answers\', sum(J) \'Right on first try\', avg(J) \'% right\'", 0), "No answers yet")',
    '% right on the first try for each standard, lowest first.').getRange('D:D').setNumberFormat('0%');
  f('By Student', '=IFERROR(QUERY(Responses!A2:L, "select B, C, count(J), sum(J), avg(J), max(A) where B is not null group by B, C order by C, B ' +
    'label B \'Student\', C \'Period\', count(J) \'Answers\', sum(J) \'Right on first try\', avg(J) \'% right\', max(A) \'Last sent\'", 0), "No answers yet")',
    'Every question a student sent, from all pages.').getRange('E:E').setNumberFormat('0%');
  f('Arcade by Student', '=IFERROR(QUERY(Arcade!A:L, "select B, C, D, count(A), sum(F), sum(G), max(I), sum(J), sum(K), max(A) where B is not null group by B, C, D order by C, B, D ' +
    'label count(A) \'Visits\', sum(F) \'Minutes\', sum(G) \'Rounds\', max(I) \'Best score\', sum(J) \'Correct\', sum(K) \'Tries\', max(A) \'Last played\'", 1), "No arcade play yet")');
  f('Arcade by Game', '=IFERROR(QUERY(Arcade!A:L, "select D, count(A), sum(F), sum(J), sum(K) where D is not null group by D order by count(A) desc ' +
    'label count(A) \'Visits\', sum(F) \'Minutes\', sum(J) \'Correct\', sum(K) \'Tries\'", 1), "No arcade play yet")');
}
function readMe_(ss) {
  var rm = ss.getSheetByName('Read Me') || ss.insertSheet('Read Me', 0);
  rm.clear();
  var lines = [
    ['Math Class Tracker — how this Sheet works'],
    ['Students type their first and last name once on the website. When they press Send my work, play a game or save their work, a row lands here.'],
    ['Roster: type each student (first and last), their period, and any other spellings they type (commas). The period on every row comes from here. High Scores only show students on this tab.'],
    ['Notes Practice / Tutorials / Pre-Tests: one row per Send. "Right on first try" is the score; "Missed on first try" lists the questions to look at.'],
    ['Responses: one row per question. Reteach, By Standard and By Student are made from it and update by themselves.'],
    ['Arcade: one row per game visit. Arcade by Student and Arcade by Game update by themselves.'],
    ['Saved Work is used by the website to bring back a student\'s work. You do not need to read it.'],
    ['To start a new year or semester: delete rows 2 and below on the data tabs (keep the header row). The formula tabs fix themselves.'],
    ['Nothing on this Sheet is visible to students. The website only gets High Scores as "First L.".'],
    ['Class code: ' + CLASS_CODE + '  (must match CLASS_CODE in the website\'s tracker-config.js)']
  ];
  rm.getRange(1, 1, lines.length, 1).setValues(lines);
  rm.getRange('A1').setFontWeight('bold').setFontSize(14); rm.setColumnWidth(1, 900); rm.getRange('A:A').setWrap(true);
}

/* ── the website posts here ── */
function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    if (String(d.code) !== CLASS_CODE) return json_({ ok: false, error: 'bad code' });
    var name = tidyName_(d.name);
    if (!name) return json_({ ok: false, error: 'no name' });
    var kind = String(d.kind || '');
    if (kind === 'pretest' || kind === 'practice') return evidence_(d, name, kind);
    if (kind === 'homework') return homework_(d, name);
    if (kind === 'arcade') return arcade_(d, name);
    if (kind === 'save') return saveWork_(d, name);
    if (kind === 'load') return loadWork_(d, name);
    return json_({ ok: false, error: 'bad kind' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}
function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.leaders) return leadersOut_(p);
  return ContentService.createTextOutput('Math Class Tracker is running. The website posts here.');
}

/* ── Notes practice, tutorials, pre-tests: a summary row + one row per question ── */
function evidence_(d, name, kind) {
  var items = Array.isArray(d.items) ? d.items : [];
  if (!items.length || items.length > 120) return json_({ ok: false, error: 'bad items' });
  var unit = clip_(d.unit, 12), page = clip_(d.page, 120), url = String(d.url || '');
  var tab = kind === 'pretest' ? 'Pre-Tests' : (/tutorial/i.test(page + ' ' + url) ? 'Tutorials' : 'Notes Practice');
  var now = new Date(), right = 0, resp = [];
  var lock = LockService.getScriptLock(); lock.waitLock(25000);
  try {
    var ss = book_(), period = periodFor_(ss, name) || clip_(d.period, 6);
    items.forEach(function (it, i) {
      it = it || {};
      var first = it.first ? 1 : 0; right += first;
      var band = Number(it.band); if ([2, 3, 4, 5].indexOf(band) < 0) band = 4;
      resp.push([now, name, period, tab, unit, page, clip_(it.label || it.id || (i + 1), 80), clip_(it.std, 20), band,
                 first, it.final ? 1 : 0, Math.max(1, Math.min(99, Number(it.tries) || 1))]);
    });
    var miss = []; resp.forEach(function (r, i) { if (!r[9]) miss.push('#' + (i + 1) + ' ' + String(r[6]).slice(0, 60)); });
    var sk = Array.isArray(d.skipped) ? d.skipped.slice(0, 60).map(function (x) { return String(x).slice(0, 60); }) : null;
    var mins = Math.max(0, Math.min(60, Number(d.minutes) || 0));
    var sub = tab_(ss, tab);
    sub.appendRow([now, name, period, unit, page, items.length, right, right / items.length, d.revealed ? 'yes' : '',
                   miss.length ? clip_(miss.length + ' missed: ' + miss.join(' | '), 900) : 'none',
                   sk === null ? '' : sk.length ? clip_(sk.length + ' skipped: ' + sk.join(' | '), 900) : 'none',
                   Math.round(mins * 10) / 10]);
    var rs = tab_(ss, 'Responses');
    rs.getRange(rs.getLastRow() + 1, 1, resp.length, resp[0].length).setValues(resp);
  } finally { lock.releaseLock(); }
  return json_({ ok: true, name: name, n: items.length, right: right });
}

/* ── Homework / Targeted Practice turn-in: typed answers in Q1…Q10, right = green, missed = red ── */
function homework_(d, name) {
  var ans = Array.isArray(d.answers) ? d.answers.slice(0, MAX_HW_Q) : [];
  if (!ans.length) return json_({ ok: false, error: 'no answers' });
  ans = ans.map(function (a) { return clip_(a, 300); });
  var marks = Array.isArray(d.marks) ? d.marks.slice(0, MAX_HW_Q) : [], bands = Array.isArray(d.bands) ? d.bands : [];
  var answered = ans.filter(function (a) { return a !== ''; }).length;
  var title = clip_(d.page, 140) || ('Homework ' + clip_(d.hw, 10)), unit = clip_(d.unit, 6);
  var lock = LockService.getScriptLock(); lock.waitLock(25000);
  try {
    var ss = book_(), sh = tab_(ss, 'Homework'), period = periodFor_(ss, name) || clip_(d.period, 6), now = new Date();
    while (ans.length < MAX_HW_Q) ans.push('');
    var right = 0, checked = 0, missed = [], colors = [], resp = [];
    for (var i = 0; i < MAX_HW_Q; i++) {
      var m = marks[i], isR = m === 1 || m === '1', isW = m === 0 || m === '0';
      colors.push(isR ? '#d9ead3' : isW ? '#f4cccc' : null);
      if (isR || isW) {
        checked++; if (isR) right++; else missed.push('Q' + (i + 1));
        var band = Number(bands[i]); if ([2, 3, 4, 5].indexOf(band) < 0) band = 4;
        resp.push([now, name, period, 'Homework', unit, title, 'Problem ' + (i + 1), '', band, isR ? 1 : 0, isR ? 1 : 0, 1]);
      }
    }
    sh.appendRow([now, name, period, unit, title, answered + ' of ' + Number(d.n || answered)].concat(ans)
      .concat(checked ? [right + ' of ' + checked, missed.join(', ')] : ['', '']));
    if (checked) sh.getRange(sh.getLastRow(), 7, 1, MAX_HW_Q).setBackgrounds([colors]);
    if (resp.length) { var rs = tab_(ss, 'Responses'); rs.getRange(rs.getLastRow() + 1, 1, resp.length, resp[0].length).setValues(resp); }
  } finally { lock.releaseLock(); }
  return json_({ ok: true, name: name, answered: answered });
}

/* ── Arcade: one row per game visit ── */
function arcade_(d, name) {
  var mins = Math.max(0, Math.min(240, Number(d.minutes) || 0));
  var correct = Math.max(0, Number(d.correct) || 0), tries = Math.max(0, Number(d.tries) || 0);
  if (mins < 0.25 && !tries && !Number(d.rounds)) return json_({ ok: true, skipped: 'too short' });
  var lock = LockService.getScriptLock(); lock.waitLock(25000);
  try {
    var ss = book_(), sh = tab_(ss, 'Arcade'), period = periodFor_(ss, name) || clip_(d.period, 6);
    sh.appendRow([new Date(), name, period, clip_(d.game, 60), clip_(d.unit, 6),
      Math.round(mins * 10) / 10, Number(d.rounds) || 0, clip_(d.level, 40),
      d.score === '' || d.score == null ? '' : Number(d.score) || 0,
      correct, tries, tries ? correct / tries : '', clip_(d.details, 300)]);
  } finally { lock.releaseLock(); }
  try { CacheService.getScriptCache().remove('arcade-leaders'); } catch (e) {}
  return json_({ ok: true });
}

/* ── Save my work: one row per student + page on the "Saved Work" tab ── */
var SAVE_CHUNK = 45000;                                   // a cell holds 50,000 characters
function savedSheet_() {
  var ss = book_(), sh = ss.getSheetByName('Saved Work');
  if (!sh) {
    sh = ss.insertSheet('Saved Work');
    sh.getRange(1, 1, 1, 5).setValues([['Saved', 'Student', 'Page', 'Actions', 'Saved work (used by the website)']]).setFontWeight('bold');
    sh.setFrozenRows(1); sh.setColumnWidth(5, 220);
  }
  return sh;
}
function savedRow_(sh, name, page) {
  var n = sh.getLastRow() - 1; if (n < 1) return 0;
  var v = sh.getRange(2, 2, n, 2).getValues(), key = name.toLowerCase() + '|' + page;
  for (var i = n - 1; i >= 0; i--) if (String(v[i][0]).toLowerCase() + '|' + v[i][1] === key) return i + 2;
  return 0;
}
function saveWork_(d, name) {
  var page = String(d.page || '').slice(0, 200), data = String(d.data || '');
  if (!page) return json_({ ok: false, error: 'no page' });
  if (data.length > SAVE_CHUNK * 8) return json_({ ok: false, error: 'too big' });
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var sh = savedSheet_(), r = savedRow_(sh, name, page), parts = data.match(new RegExp('[\\s\\S]{1,' + SAVE_CHUNK + '}', 'g')) || [''];
    var row = [new Date(), name, page, Number(d.n) || 0].concat(parts);
    if (!r) r = sh.getLastRow() + 1;
    var old = sh.getLastColumn(); if (old > 4) sh.getRange(r, 5, 1, old - 4).clearContent();
    sh.getRange(r, 5, 1, parts.length).setNumberFormat('@');
    sh.getRange(r, 1, 1, row.length).setValues([row]);
  } finally { lock.releaseLock(); }
  return json_({ ok: true, name: name });
}
function loadWork_(d, name) {
  var page = String(d.page || '').slice(0, 200), sh = savedSheet_(), r = savedRow_(sh, name, page);
  if (!r) return json_({ ok: true, name: name, data: '' });
  var w = sh.getLastColumn(), v = sh.getRange(r, 5, 1, Math.max(w - 4, 1)).getValues()[0];
  return json_({ ok: true, name: name, data: v.join('') });
}

/* ────────────────────────────────────────────────────────────────
   ARCADE HIGH SCORES (leaderboard)
   The Arcade page asks:  <web app URL>?leaders=1&callback=fn
   Top 5 per game, each student's best score. A name shows ONLY if it
   matches a student on the Roster tab (Student or "Also typed as"), and
   only as "First L." (the website is public). If the Roster is empty,
   full names (first + last, letters only) are used and a short list of
   rude words is blocked. Cached 5 minutes.
   ──────────────────────────────────────────────────────────────── */
function fullName_(s) {
  var w = String(s || '').replace(/\s+/g, ' ').trim().split(' ');
  if (w.length < 2) return null;
  for (var i = 0; i < w.length; i++) if (!/^[A-Za-z][A-Za-z'\-]+$/.test(w[i])) return null;
  var cap = function (x) { return x.charAt(0).toUpperCase() + x.slice(1).toLowerCase(); };
  return { key: w.join(' ').toLowerCase(), show: cap(w[0]) + ' ' + w[w.length - 1].charAt(0).toUpperCase() + '.' };
}
var ROSTER_ = null;
function rosterMap_() {
  if (ROSTER_) return ROSTER_;
  ROSTER_ = { n: 0, map: {} };
  try {
    var sh = book_().getSheetByName('Roster'), n = sh ? sh.getLastRow() : 0;
    if (n > 1) sh.getRange(2, 1, n - 1, 3).getValues().forEach(function (r) {
      var real = String(r[0] || '').replace(/\s+/g, ' ').trim(); if (!real) return;
      ROSTER_.n++;
      [real].concat(String(r[2] || '').split(',')).forEach(function (a) { var k = norm_(a); if (k.length >= 3) ROSTER_.map[k] = real; });
    });
  } catch (e) {}
  return ROSTER_;
}
var BAD_ = ['YXNz', 'YnV0dA', 'ZnVjaw', 'c2hpdA', 'Yml0Y2g', 'ZGFtbg', 'ZGljaw', 'Y29jaw', 'cHVzcw', 'cGVuaXM', 'dmFnaW4', 'Ym9vYg',
            'dGl0cw', 'c2V4', 'cG9vcA', 'cGVl', 'ZmFydA', 'aG9l', 'c2x1dA', 'd2hvcmU', 'Y3JhcA', 'aGVsbA', 'bmln', 'ZmFn', 'cmV0YXJk',
            'aGl0bGVy', 'bmF6aQ', 'a2lsbA', 'ZGllZA', 'ZHVtYg', 'c3R1cGlk', 'aWRpb3Q', 'bG9zZXI', 'dWdseQ', 'ZmF0'];   // base64 so the list is not readable
var BADW_ = null;
function bad_(name) {
  if (!BADW_) BADW_ = BAD_.map(function (b) { return Utilities.newBlob(Utilities.base64Decode(b + '==='.slice((b.length + 3) % 4))).getDataAsString(); });
  return String(name || '').toLowerCase().split(/[^a-z]+/).some(function (w) {
    return w && BADW_.some(function (b) { return w === b || (b.length >= 4 && w.indexOf(b) === 0); });
  });
}
function who_(typed) {
  var r = rosterMap_();
  if (r.n) { var real = r.map[norm_(typed)]; return real ? fullName_(real) : null; }
  var f = fullName_(typed);
  return f && !bad_(typed) ? f : null;
}
function arcadeLeaders_() {
  var cache = CacheService.getScriptCache(), hit = cache.get('arcade-leaders');
  if (hit) return hit;
  var sh = tab_(book_(), 'Arcade'), n = sh.getLastRow(), best = {}, games = {};
  if (n > 1) {
    sh.getRange(2, 1, n - 1, 9).getValues().forEach(function (r) {
      var game = String(r[3] || '').trim(), sc = r[8], who = who_(r[1]);
      if (!game || !who || sc === '' || sc === null || isNaN(Number(sc)) || Number(sc) <= 0) return;
      var k = game + '|' + who.key;
      if (!best[k] || Number(sc) > best[k].score) best[k] = { game: game, name: who.show, score: Number(sc) };
    });
  }
  Object.keys(best).forEach(function (k) { var b = best[k]; (games[b.game] = games[b.game] || []).push({ name: b.name, score: b.score }); });
  Object.keys(games).forEach(function (g) { games[g] = games[g].sort(function (a, b) { return b.score - a.score; }).slice(0, 5); });
  var out = JSON.stringify({ ok: true, updated: new Date().toISOString(), games: games });
  try { cache.put('arcade-leaders', out, 300); } catch (e) {}
  return out;
}
function leadersOut_(p) {
  var s = arcadeLeaders_(), cb = String(p.callback || '');
  if (/^[A-Za-z_$][\w$.]{0,40}$/.test(cb)) return ContentService.createTextOutput(cb + '(' + s + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.JSON);
}
/* Run this from the editor to check the High Scores: it lists what the website will show. */
function checkHighScores() {
  CacheService.getScriptCache().remove('arcade-leaders');
  var s = arcadeLeaders_(); Logger.log(s); return s;
}

/* ── helpers ── */
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
