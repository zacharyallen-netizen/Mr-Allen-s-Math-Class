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


/* ───────────────────────────────────────────────────────────────
   ARCADE LEADERBOARD (Nov 16, 2026, Zach: top 5 scores for each game on
   the Arcade page; ignore any entry without a full student name).
   The Arcade page asks:  <web app URL>?leaders=1&callback=fn
   Only rows with a score and a FULL name (first and last, letters only,
   2+ letters each) count. Each student's best score per game; top 5.
   Names leave the sheet as "First L." only (the website is public).
   Cached for 5 minutes.
   ─────────────────────────────────────────────────────────────── */
function fullName_(s) {
  var w = String(s || '').replace(/\s+/g, ' ').trim().split(' ');
  if (w.length < 2) return null;
  for (var i = 0; i < w.length; i++) if (!/^[A-Za-z][A-Za-z'\-]+$/.test(w[i])) return null;
  var cap = function (x) { return x.charAt(0).toUpperCase() + x.slice(1).toLowerCase(); };
  return { key: w.join(' ').toLowerCase(), show: cap(w[0]) + ' ' + w[w.length - 1].charAt(0).toUpperCase() + '.' };
}
/* Nov 17, 2026 (Zach: "a safeguard to make sure students do not enter anything offensive"): a name shows on the
   High Scores boards and the Top Students line ONLY if it matches a student on the Roster tab of the Student Work
   sheet (Student, or a name in "Also typed as"). The roster's spelling is what shows, as "First L.". Anything else
   (made-up, rude or misspelled names, the teacher) never appears. Misspelled real names: add the spelling to
   "Also typed as". If the Roster tab is empty, full names are used, and a short word list blocks rude ones. */
var ROSTER_ = null;
function rosterMap_() {
  if (ROSTER_) return ROSTER_;
  ROSTER_ = { n: 0, map: {} };
  try {
    var sh = SpreadsheetApp.openById(WORK_ID).getSheetByName('Roster'), n = sh ? sh.getLastRow() : 0;
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
            'aGl0bGVy', 'bmF6aQ', 'a2lsbA', 'ZGllZA', 'ZHVtYg', 'c3R1cGlk', 'aWRpb3Q', 'bG9zZXI', 'dWdseQ', 'ZmF0'];   // base64 so the list is not readable on the public site
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
  var sh = arcadeSessions_(), n = sh.getLastRow(), best = {}, games = {};
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

/* ───────────────────────────────────────────────────────────────
   TOP STUDENTS TICKER (Nov 17, 2026, Zach: "students that spent the most
   time or achieved the most in the current week and ... the entire year").
   The website asks:  <web app URL>?ticker=1&callback=fn
   For THIS WEEK (since Monday) and THIS YEAR (since Aug 1), top 5 by:
     • Most time      = minutes in Arcade games (up to 60 per play) +
                        minutes working on practice, notes, tutorials and
                        pre-tests (sent with Send my work, up to 60 each)
     • Most activities = Targeted Practice turned in + practice / notes /
                        tutorial / pre-test pages sent (one per page per day)
                        + Arcade rounds finished (up to 20 per play)
                        + Fluency Lab tests finished
   Only students on the Roster tab count (see who_ above); names leave the
   sheet as "First L.". To keep a student off the ticker, type their name on the
   "Hide from ticker" tab of the Student Work sheet. Cached 10 minutes.
   Run  setupTicker  once to make that tab (it is also made the first time
   the ticker runs).
   ─────────────────────────────────────────────────────────────── */
function setupTicker() { hideList_(); CacheService.getScriptCache().remove('ticker'); return 'Ticker ready: ' + tickerData_(); }
function hideList_() {
  var ss = SpreadsheetApp.openById(WORK_ID), sh = ss.getSheetByName('Hide from ticker');
  if (!sh) {
    sh = ss.insertSheet('Hide from ticker');
    sh.getRange(1, 1, 1, 2).setValues([['Name (first and last)', 'Students typed here never show on the website ticker.']]).setFontWeight('bold');
    sh.setFrozenRows(1); sh.setColumnWidth(1, 220);
  }
  var out = {}, n = sh.getLastRow();
  if (n > 1) sh.getRange(2, 1, n - 1, 1).getValues().forEach(function (r) { var w = who_(r[0]) || fullName_(r[0]); if (w) out[w.key] = 1; });
  return out;
}
function tickerData_() {
  var now = new Date(), wk = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  wk.setDate(wk.getDate() - ((wk.getDay() + 6) % 7));                     // Monday 12:00 am
  var yr = new Date(now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1, 7, 1);   // Aug 1
  var hide = hideList_(), P = {};                                          // P[key] = {show, wt, wd, yt, yd}
  function add(when, who, mins, done) {
    when = when instanceof Date ? when : new Date(when); if (isNaN(when) || when < yr) return;
    var w = who_(who); if (!w || hide[w.key]) return;
    var p = P[w.key] || (P[w.key] = { show: w.show, wt: 0, wd: 0, yt: 0, yd: 0 });
    p.yt += mins; p.yd += done; if (when >= wk) { p.wt += mins; p.wd += done; }
  }
  function rows(id, tab, cols) {
    try { var sh = SpreadsheetApp.openById(id).getSheetByName(tab), n = sh ? sh.getLastRow() : 0;
          return n > 1 ? sh.getRange(2, 1, n - 1, cols).getValues() : []; } catch (e) { return []; }
  }
  var seen = {};
  function m1(r) { return /^M1\b/.test(String(r[3])) || /Math 1/.test(String(r[4])); }   // Math 1 work is not on the 8th grade line
  function once(r, page) { var d = r[0] instanceof Date ? r[0] : new Date(r[0]); var k = String(r[1]).toLowerCase() + '|' + page + '|' + d.toDateString(); if (seen[k]) return 0; seen[k] = 1; return 1; }
  rows(WORK_ID, 'Homework', 5).forEach(function (r) { add(r[0], r[1], 0, once(r, 'HW ' + r[4])); });
  ['Notes Practice', 'Tutorials'].forEach(function (t) {
    rows(WORK_ID, t, 12).forEach(function (r) { if (!m1(r)) add(r[0], r[1], Math.min(60, Number(r[11]) || 0), once(r, r[4])); });
  });
  rows(PRETEST_ID, 'Pre-Tests', 12).forEach(function (r) { if (!m1(r)) add(r[0], r[1], Math.min(60, Number(r[11]) || 0), once(r, r[4])); });
  rows(ARCADE_ID, 'Sessions', 7).forEach(function (r) { add(r[0], r[1], Math.min(60, Number(r[5]) || 0), Math.min(20, Number(r[6]) || 0)); });
  rows(FLUENCY_ID, 'Scores', 2).forEach(function (r) { add(r[0], r[1], 0, 1); });
  function top(f) {
    return Object.keys(P).map(function (k) { return P[k]; }).filter(function (p) { return p[f] > 0; })
      .sort(function (a, b) { return b[f] - a[f]; }).slice(0, 5)
      .map(function (p) { return { name: p.show, v: Math.round(p[f]) }; });
  }
  return JSON.stringify({ ok: true, updated: now.toISOString(),
    week: { time: top('wt'), done: top('wd') }, year: { time: top('yt'), done: top('yd') } });
}
function tickerOut_(p) {
  var cache = CacheService.getScriptCache(), s = cache.get('ticker');
  if (!s) { s = tickerData_(); try { cache.put('ticker', s, 600); } catch (e) {} }
  var cb = String(p.callback || '');
  if (/^[A-Za-z_$][\w$.]{0,40}$/.test(cb)) return ContentService.createTextOutput(cb + '(' + s + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.JSON);
}
