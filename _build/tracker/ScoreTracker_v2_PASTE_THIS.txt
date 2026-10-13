/**
 * ════════════════════════════════════════════════════════════════════
 *  MR. ALLEN'S SCORE TRACKER  ·  version 2
 *  Fluency Lab Skill Checks  +  Pre-Tests  +  Unit Practice
 * ════════════════════════════════════════════════════════════════════
 *
 *  This replaces the Fluency Lab Score Tracker you already have.
 *  Everything it did before still works the same way. It adds:
 *
 *    Responses    one row for every question a student sent
 *    Submissions  one row for every time a student tapped Send
 *    Standards    each student's mastery level (1–5) on each NC standard,
 *                 using your standards-based grading rules
 *    Statistics   how trustworthy each pre-test is, which questions
 *                 need a second look, and whether students are growing
 *    Settings     the numbers the reports use — you can change them
 *    Read Me      what every tab means, in plain words
 *    How I Learn (answers / results)   the "How I Learn Math" student
 *                 questionnaire from the Fluency Lab, compiled for you
 *
 *  UPDATE IT — about five minutes, the web address stays the same
 *   1. Open your existing Score Tracker project at script.google.com.
 *   2. Select everything in the editor, delete it, paste this whole file.
 *      Click the disk icon to Save.
 *   3. In the dropdown at the top choose  setup  and press  Run.
 *      Approve if Google asks (it may ask again because the script
 *      now also refreshes reports every hour).
 *   4. Deploy → Manage deployments → click the pencil ✎ on your
 *      Web app → Version: "New version" → Deploy.
 *      (Do NOT choose "New deployment" — that would change the address.)
 *
 *  Reports refresh by themselves every hour. To refresh right now,
 *  choose  refreshReports  in the dropdown and press Run.
 * ════════════════════════════════════════════════════════════════════
 */

/** Must match CLASS_CODE in fluency-config.js and tracker-config.js. */
var CLASS_CODE = 'allen-8th';

/** Fluency Lab: what counts as mastery on the Summary tab. */
var MASTERY_PCT = 80;

var SHEET_NAME  = 'Fluency Lab — Student Scores';
var LOG_TAB     = 'Scores';
var SUMMARY_TAB = 'Summary';
var RESP_TAB    = 'Responses';
var SUBS_TAB    = 'Submissions';
var STD_TAB     = 'Standards';
var STDL_TAB    = 'Standards (list)';
var STATS_TAB   = 'Statistics';
var SET_TAB     = 'Settings';
var README_TAB  = 'Read Me';

var MODULES = ['Add & Subtract','Multiply','Divide','Fractions',
               'Decimals & Percents','Integers','Ratios & Proportions',
               'Expressions & Order of Operations'];

var NAVY = '#1E2D4F';

/** Short names for the NC Math 8 standards (used as column headings). */
var STD_NAMES = {
  'NC.8.NS.1':'Rational & irrational numbers', 'NC.8.NS.2':'Estimate irrational numbers',
  'NC.8.EE.1':'Exponent rules', 'NC.8.EE.2':'Square & cube roots',
  'NC.8.EE.3':'Scientific notation: estimate', 'NC.8.EE.4':'Scientific notation: operations',
  'NC.8.EE.5':'Proportional relationships', 'NC.8.EE.6':'Slope',
  'NC.8.EE.7':'Solve linear equations', 'NC.8.EE.8':'Systems of equations',
  'NC.8.F.1':'Functions', 'NC.8.F.2':'Compare functions', 'NC.8.F.3':'Linear vs. nonlinear',
  'NC.8.F.4':'Model linear relationships', 'NC.8.F.5':'Describe graphs',
  'NC.8.G.1':'Rigid transformations', 'NC.8.G.2':'Congruence', 'NC.8.G.3':'Transformations on the plane',
  'NC.8.G.4':'Similarity & dilations', 'NC.8.G.5':'Angle relationships',
  'NC.8.G.6':'Pythagorean Theorem & converse', 'NC.8.G.7':'Use the Pythagorean Theorem',
  'NC.8.G.8':'Distance on the plane', 'NC.8.G.9':'Volume',
  'NC.8.SP.1':'Scatter plots', 'NC.8.SP.2':'Line of best fit', 'NC.8.SP.3':'Use a linear model',
  'NC.8.SP.4':'Two-way tables'
};

/** Default settings (copied to the Settings tab, where you can change them). */
var DEFAULTS = [
  ['Band met',          0.80, 'Share of a band\'s questions right (first try) to count that band as met. 0.80 = 80%.'],
  ['Partial',           0.50, 'At least this share of the Basic (3.0) band → level 2; below it → level 1.'],
  ['Practice level 4',  0.75, 'Practice pages ask Target (4.0) questions. At least this share right on the first try → level 4.'],
  ['Practice level 3',  0.25, 'At least this share of Target questions right → level 3 (basic understanding shown).'],
  ['Practice level 2',  0.10, 'At least this share right → level 2; below it → level 1. These three practice cut-offs were set so a student lands on the same level from practice as from the pre-test ladder.'],
  ['Decay',             0.65, 'Decaying average: newest evidence ×1, the one before ×0.65, then ×0.65², … (your syllabus: 100%, 65%, ≈42%, ≈27.5%).'],
  ['Minimum students',  5,    'Fewer students than this on a pre-test → the statistics say "not enough data yet".']
];

// ════════════════════════════════════════════════════════════════════
//  SETUP — run once after pasting (safe to run again any time)
// ════════════════════════════════════════════════════════════════════
function setup() {
  var ss = openOrCreate_();
  ensureLog_(ss);
  ensureTab_(ss, SUMMARY_TAB);
  ensureHeader_(ss, RESP_TAB, ['When','Student','Source','Unit','Page','Session','Question','Standard','Band',
                               'Right on first try','Right in the end','Tries','Answers shown before checking']);
  ensureHeader_(ss, SUBS_TAB, ['When','Student','Source','Unit','Page','Session','Questions',
                               'Right on first try','Percent','Answers shown before checking']);
  var set = ensureTab_(ss, SET_TAB);
  if (set.getLastRow() === 0) {
    set.getRange(1, 1, 1, 3).setValues([['Setting','Value','What it means']]);
    set.getRange(2, 1, DEFAULTS.length, 3).setValues(DEFAULTS);
    styleHeader_(set, 3); set.setColumnWidth(1, 150); set.setColumnWidth(3, 620);
  }
  ensureTab_(ss, STD_TAB); ensureTab_(ss, STDL_TAB); ensureTab_(ss, STATS_TAB);
  ensureHeader_(ss, SURVEY_TAB, SURVEY_HEAD_()); ensureTab_(ss, SURVEY_RES_TAB); rebuildSurvey_(ss);
  writeReadMe_(ss);
  var blank = ss.getSheetByName('Sheet1');
  if (blank && ss.getSheets().length > 1 && blank.getLastRow() === 0) ss.deleteSheet(blank);

  // refresh the reports every hour (only one trigger, however often setup runs)
  var have = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === 'refreshReports'; });
  if (!have) ScriptApp.newTrigger('refreshReports').timeBased().everyHours(1).create();

  rebuildSummary();
  refreshReports();
  Logger.log('✓ Ready. Your private Sheet: ' + ss.getUrl());
  Logger.log('Now: Deploy → Manage deployments → ✎ → Version: New version → Deploy.');
  return ss.getUrl();
}

// ════════════════════════════════════════════════════════════════════
//  the website posts here
// ════════════════════════════════════════════════════════════════════
function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    if (String(d.code) !== CLASS_CODE) return json_({ ok: false, error: 'bad code' });
    if (d.kind === 'survey') return handleSurvey_(d);
    if (d.v === 2) return handleEvidence_(d);
    return handleFluency_(d);
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return ContentService.createTextOutput('Score tracker v2 is running. The website posts scores here.');
}

/** Fluency Lab Skill Checks — unchanged from version 1. */
function handleFluency_(d) {
  var name = tidyName_(d.name), module = String(d.module || '').trim();
  var score = Number(d.score), total = Number(d.total);
  if (!name)                       return json_({ ok:false, error:'no name' });
  if (MODULES.indexOf(module) < 0) return json_({ ok:false, error:'unknown skill' });
  if (!(score >= 0 && score <= total && total > 0 && total <= 100)) return json_({ ok:false, error:'bad score' });
  var lock = LockService.getScriptLock(); lock.waitLock(25000);
  try {
    var log = book_().getSheetByName(LOG_TAB);
    var pct = Math.round(score / total * 100);
    log.appendRow([new Date(), name, module, score, total, pct / 100]);
    log.getRange(log.getLastRow(), 6).setNumberFormat('0%');
    rebuildSummary();
  } finally { lock.releaseLock(); }
  return json_({ ok: true, name: name, pct: Math.round(score / total * 100) });
}

/** Pre-tests and unit practice: one row per question. */
function handleEvidence_(d) {
  var name = tidyName_(d.name);
  var kind = String(d.kind || '');
  if (!name) return json_({ ok:false, error:'no name' });
  if (kind !== 'pretest' && kind !== 'practice') return json_({ ok:false, error:'bad kind' });
  var items = Array.isArray(d.items) ? d.items : [];
  if (!items.length || items.length > 120) return json_({ ok:false, error:'bad items' });
  var unit = String(d.unit || '').slice(0, 12), page = String(d.page || '').slice(0, 120);
  var session = String(d.session || '').replace(/[^\w-]/g, '').slice(0, 40) || String(Date.now());
  var shown = d.revealed ? 'yes' : '';
  var now = new Date(), source = kind === 'pretest' ? 'Pre-test' : 'Practice';
  var rows = [], right = 0;
  for (var i = 0; i < items.length; i++) {
    var it = items[i] || {};
    var std = String(it.std || '').trim().slice(0, 20);
    // NC Math 8 (NC.8.EE.7) or NC Math 1 (NC.M1.A-REI.3, NC.M1.F-IF.8b)
    if (std && !/^NC\.(8|M1)\.[A-Z]{1,3}(-[A-Z]{2,4})?\.\d{1,2}[a-z]?$/.test(std)) std = '';
    var band = Number(it.band); if ([2, 3, 4, 5].indexOf(band) < 0) band = 4;
    var first = it.first ? 1 : 0, fin = it.final ? 1 : 0;
    right += first;
    rows.push([now, name, source, unit, page, session, String(it.id || i + 1).slice(0, 30), std, band,
               first, fin, Math.max(1, Math.min(99, Number(it.tries) || 1)), shown]);
  }
  var lock = LockService.getScriptLock(); lock.waitLock(25000);
  try {
    var ss = book_();
    var resp = ss.getSheetByName(RESP_TAB), subs = ss.getSheetByName(SUBS_TAB);
    resp.getRange(resp.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
    subs.appendRow([now, name, source, unit, page, session, rows.length, right, right / rows.length, shown]);
    subs.getRange(subs.getLastRow(), 9).setNumberFormat('0%');
  } finally { lock.releaseLock(); }
  return json_({ ok: true, name: name, n: rows.length, right: right });
}

// ════════════════════════════════════════════════════════════════════
//  REPORTS  (hourly, or run refreshReports by hand)
// ════════════════════════════════════════════════════════════════════
function refreshReports() {
  var ss = book_();
  var S = readSettings_(ss);
  var resp = ss.getSheetByName(RESP_TAB);
  var data = resp && resp.getLastRow() > 1 ? resp.getRange(2, 1, resp.getLastRow() - 1, 13).getValues() : [];
  var rows = data.map(function (r) {
    return { when: new Date(r[0]).getTime(), student: String(r[1]), source: String(r[2]), unit: String(r[3]),
             page: String(r[4]), session: String(r[5]), item: String(r[6]), std: String(r[7]), band: Number(r[8]),
             first: Number(r[9]) ? 1 : 0, fin: Number(r[10]) ? 1 : 0, shown: String(r[12]) === 'yes' };
  });
  var A = Analytics;
  var ev = A.evidence(rows, S);                 // one level per student × standard × submission
  var mastery = A.mastery(ev, S);               // decaying average per student × standard
  writeStandards_(ss, mastery);
  writeStandardsList_(ss, mastery);
  writeStatistics_(ss, A.statistics(rows, ev, S), S);
}

// ── Standards grid: students down, standards across ──
function writeStandards_(ss, M) {
  var sh = ss.getSheetByName(STD_TAB) || ss.insertSheet(STD_TAB); sh.clear();
  var stds = M.standards, students = M.students;
  var title = [['Mastery level by standard (1–5) — formative evidence from the website. Decaying average of every pre-test and practice result, newest counts most.']];
  sh.getRange(1, 1).setValues(title).setFontStyle('italic').setFontColor('#5B6475');
  if (!students.length) { sh.getRange(3, 1).setValue('No pre-test or practice work has been sent yet.'); return; }
  var head = ['Student'].concat(stds.map(function (s) { return s + (STD_NAMES[s] ? '\n' + STD_NAMES[s] : ''); }))
                        .concat(['Standards at 4 or above']);
  sh.getRange(3, 1, 1, head.length).setValues([head]);
  styleHeaderRow_(sh, 3, head.length); sh.setRowHeight(3, 64);
  var out = [], bg = [];
  students.forEach(function (st) {
    var line = [st], colors = ['#ffffff'], at4 = 0, seen = 0;
    stds.forEach(function (s) {
      var m = M.cell[st + '|' + s];
      if (!m) { line.push(''); colors.push('#f1f3f4'); return; }
      seen++; if (m.avg >= 3.5) at4++;
      line.push(Math.round(m.avg * 10) / 10); colors.push(levelColor_(m.avg));
    });
    line.push(seen ? at4 + ' of ' + seen : ''); colors.push('#ffffff');
    out.push(line); bg.push(colors);
  });
  var rng = sh.getRange(4, 1, out.length, head.length);
  rng.setValues(out); rng.setBackgrounds(bg);
  sh.getRange(4, 2, out.length, stds.length).setNumberFormat('0.0').setHorizontalAlignment('center');
  sh.setFrozenRows(3); sh.setFrozenColumns(1); sh.setColumnWidth(1, 180);
  for (var c = 2; c <= head.length; c++) sh.setColumnWidth(c, 118);
  sh.getRange(3, 1, 1, head.length).setWrap(true);
  var key = [['Key:', '5 beyond', '4 mastered', '3 basic', '2 partial', '1 not yet', 'grey = no evidence']];
  var r = out.length + 6;
  sh.getRange(r, 1, 1, 7).setValues(key);
  sh.getRange(r, 2, 1, 6).setBackgrounds([[levelColor_(5), levelColor_(4), levelColor_(3), levelColor_(2), levelColor_(1), '#f1f3f4']]);
}

// ── Standards list: one tidy row per student × standard (filter / sort / pivot) ──
function writeStandardsList_(ss, M) {
  var sh = ss.getSheetByName(STDL_TAB) || ss.insertSheet(STDL_TAB); sh.clear();
  var head = ['Student','Standard','Standard name','Pieces of evidence','Pre-test level','Latest level',
              'Decaying average','Level (rounded)','Change since pre-test','Last evidence'];
  sh.getRange(1, 1, 1, head.length).setValues([head]); styleHeaderRow_(sh, 1, head.length);
  var out = M.list.map(function (m) {
    return [m.student, m.std, STD_NAMES[m.std] || '', m.n, m.pre == null ? '' : m.pre, m.latest,
            Math.round(m.avg * 100) / 100, Math.round(m.avg), m.pre == null ? '' : Math.round((m.latest - m.pre) * 10) / 10,
            new Date(m.lastWhen)];
  });
  if (out.length) {
    sh.getRange(2, 1, out.length, head.length).setValues(out);
    sh.getRange(2, 10, out.length, 1).setNumberFormat('mmm d, h:mm am/pm');
  }
  sh.setFrozenRows(1); sh.setColumnWidth(1, 170); sh.setColumnWidth(3, 220);
}

// ── Statistics ──
function writeStatistics_(ss, R, S) {
  var sh = ss.getSheetByName(STATS_TAB) || ss.insertSheet(STATS_TAB); sh.clear();
  var r = 1;
  function section(title, note) {
    sh.getRange(r, 1).setValue(title).setFontWeight('bold').setFontSize(13).setFontColor(NAVY); r++;
    if (note) { sh.getRange(r, 1).setValue(note).setFontStyle('italic').setFontColor('#5B6475'); r++; }
  }
  function table(head, rows, fmt) {
    sh.getRange(r, 1, 1, head.length).setValues([head]); styleHeaderRow_(sh, r, head.length); r++;
    if (rows.length) {
      sh.getRange(r, 1, rows.length, head.length).setValues(rows);
      (fmt || []).forEach(function (f) { sh.getRange(r, f[0], rows.length, 1).setNumberFormat(f[1]); });
      r += rows.length;
    } else { sh.getRange(r, 1).setValue('Not enough data yet.'); r++; }
    r++;
  }

  section('1 · Score validity — can each pre-test be trusted?',
    'Reliability (KR-20) near 0.70 or higher is good for a classroom test; below 0.50, treat scores with caution. ' +
    'Band order: a sound pre-test has students doing at least as well on Basic (3.0) as on Target (4.0), and on Target as on Advanced (5.0).');
  table(['Pre-test','Students','Questions','Average','Spread (SD)','Reliability (KR-20)','Margin of error (±)','Band order holds for','Verdict'],
        R.validity.map(function (v) { return [v.page, v.n, v.k, v.mean, v.sd, v.kr20, v.sem, v.order, v.verdict]; }),
        [[4,'0%'],[5,'0%'],[6,'0.00'],[7,'0%'],[8,'0%']]);

  section('2 · Question check — which questions need a second look?',
    '"Right on first try" is how many students got it. "Separates" (point-biserial) is whether students who did well overall got this one right: ' +
    'below 0.15 means the question may be confusing; below 0 means check the answer key.');
  table(['Pre-test','Question','Standard','Band','Students','Right on first try','Separates (point-biserial)','Flag'],
        R.items.map(function (q) { return [q.page, q.item, q.std, q.band, q.n, q.p, q.rpb, q.flag]; }),
        [[6,'0%'],[7,'0.00']]);

  section('3 · Growth — are students improving after the pre-test?',
    'Each pair is one student on one standard: their pre-test level and their latest level since. ' +
    'Wilcoxon signed-rank test. "Clear" needs both p below 0.05 (unlikely to be chance) and an effect size r of at least 0.3 (a medium change or bigger). Effect size r: 0.1 small, 0.3 medium, 0.5 large.');
  table(['Standard','Name','Pairs','Went up','Same','Went down','Median change','p-value','Effect size (r)','Reading'],
        R.growth.map(function (g) { return [g.std, STD_NAMES[g.std] || (g.std === 'All standards' ? '' : ''), g.n, g.up, g.same, g.down, g.median, g.p, g.r, g.reading]; }),
        [[8,'0.000'],[9,'0.00']]);
  sh.setColumnWidth(1, 230); for (var c = 2; c <= 10; c++) sh.setColumnWidth(c, 120);
}

// ════════════════════════════════════════════════════════════════════
//  ANALYTICS — plain math, no Google calls (tested before release)
// ════════════════════════════════════════════════════════════════════
var Analytics = (function () {

  /** Keep only the newest send for each session (a student may tap Send more than once). */
  function latestSessions(rows) {
    var newest = {};
    rows.forEach(function (r) { var k = r.student + '|' + r.session; if (!(newest[k] >= r.when)) newest[k] = r.when; });
    return rows.filter(function (r) { return r.when === newest[r.student + '|' + r.session]; });
  }

  /** Level 1–5 from first-try results grouped by band, using the teacher's scale. */
  function level(bands, S) {
    var pct = {}; [2, 3, 4, 5].forEach(function (b) { if (bands[b] && bands[b].n) pct[b] = bands[b].c / bands[b].n; });
    var met = function (b) { return pct[b] != null && pct[b] >= S.met; };
    if (pct[3] != null) {                                   // a pre-test style ladder
      if (!met(3)) return pct[3] >= S.partial ? 2 : 1;
      if (pct[4] == null) return 3;
      if (!met(4)) return 3;
      if (pct[5] != null && met(5)) return 5;
      return 4;
    }
    if (pct[4] != null) {                                   // practice at the target level
      if (pct[4] >= S.lvl4) return pct[5] != null && met(5) ? 5 : 4;
      return pct[4] >= S.lvl3 ? 3 : pct[4] >= S.lvl2 ? 2 : 1;
    }
    if (pct[5] != null) return met(5) ? 5 : pct[5] >= S.lvl3 ? 4 : 3;
    if (pct[2] != null) return pct[2] >= S.met ? 2 : 1;
    return null;
  }

  /** One piece of evidence per student × standard × send. */
  function evidence(rows, S) {
    var groups = {};
    latestSessions(rows).forEach(function (r) {
      if (!r.std) return;
      var k = r.student + '|' + r.std + '|' + r.session;
      var g = groups[k] || (groups[k] = { student: r.student, std: r.std, session: r.session, source: r.source,
                                          page: r.page, when: r.when, bands: {} });
      var b = g.bands[r.band] || (g.bands[r.band] = { n: 0, c: 0 });
      b.n++; b.c += r.first;
    });
    var out = [];
    Object.keys(groups).forEach(function (k) {
      var g = groups[k]; g.level = level(g.bands, S);
      // the highest level this piece of work CAN show (no Advanced questions → at most 4)
      g.cap = g.bands[5] ? 5 : g.bands[4] ? 4 : g.bands[3] ? 3 : 2;
      if (g.level != null) out.push(g);
    });
    out.sort(function (a, b) { return a.when - b.when; });
    return out;
  }

  /** Decaying average: newest ×1, then ×decay, ×decay², … */
  function decaying(levels, decay) {
    var num = 0, den = 0, w = 1;
    for (var i = levels.length - 1; i >= 0; i--) { num += w * levels[i]; den += w; w *= decay; }
    return den ? num / den : null;
  }

  function mastery(ev, S) {
    var by = {}, stdSet = {}, stuSet = {};
    ev.forEach(function (e) {
      var k = e.student + '|' + e.std; (by[k] = by[k] || []).push(e);
      stdSet[e.std] = 1; stuSet[e.student] = 1;
    });
    var cell = {}, list = [];
    Object.keys(by).forEach(function (k) {
      var es = by[k];                                         // already oldest → newest
      var pre = null;
      for (var i = 0; i < es.length; i++) if (es[i].source === 'Pre-test') { pre = es[i].level; break; }
      var vals = [], run = null;
      es.forEach(function (e) {
        var v = (e.level === e.cap && run != null && run > e.cap) ? run : e.level;   // full marks on what it can measure
        vals.push(v); run = decaying(vals, S.decay);
      });
      var m = { student: es[0].student, std: es[0].std, n: es.length,
                avg: run,
                latest: es[es.length - 1].level, pre: pre, lastWhen: es[es.length - 1].when };
      cell[k] = m; list.push(m);
    });
    list.sort(function (a, b) { return a.student < b.student ? -1 : a.student > b.student ? 1 : stdOrder(a.std) - stdOrder(b.std); });
    return { cell: cell, list: list, students: Object.keys(stuSet).sort(),
             standards: Object.keys(stdSet).sort(function (a, b) { return stdOrder(a) - stdOrder(b); }) };
  }

  function stdOrder(s) {
    var m = /^NC\.8\.([A-Z]+)\.(\d+)/.exec(s || '');
    if (m) return ({ NS: 1, EE: 2, F: 3, G: 4, SP: 5 }[m[1]] || 8) * 100 + Number(m[2]);
    var k = /^NC\.M1\.([A-Z]+)-([A-Z]+)\.(\d+)/.exec(s || '');          // Math 1 after Math 8
    if (k) return 10000 + ({ N: 1, A: 2, F: 3, G: 4, S: 5 }[k[1]] || 8) * 1000 + (k[2].charCodeAt(0) - 64) * 30 + Number(k[3]);
    return 99999;
  }

  // ── basic statistics ──
  function mean(a) { return a.length ? a.reduce(function (s, x) { return s + x; }, 0) / a.length : 0; }
  function pvar(a) { var m = mean(a); return a.length ? a.reduce(function (s, x) { return s + (x - m) * (x - m); }, 0) / a.length : 0; }
  function corr(x, y) {
    var mx = mean(x), my = mean(y), sxy = 0, sxx = 0, syy = 0;
    for (var i = 0; i < x.length; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) * (x[i] - mx); syy += (y[i] - my) * (y[i] - my); }
    return sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : null;
  }
  /** Standard normal CDF (Abramowitz–Stegun 7.1.26, error < 1.5e-7). */
  function phi(z) {
    var t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
    var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t *
            Math.exp(-z * z / 2);
    return z >= 0 ? (1 + y) / 2 : (1 - y) / 2;
  }
  function median(a) {
    if (!a.length) return null; var s = a.slice().sort(function (x, y) { return x - y; }), h = Math.floor(s.length / 2);
    return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2;
  }

  /** Wilcoxon signed-rank (two-sided, normal approximation with tie + continuity correction). */
  function wilcoxon(diffs) {
    var d = diffs.filter(function (x) { return x !== 0; });
    var n = d.length; if (n === 0) return { n: 0, W: 0, z: 0, p: 1, r: 0 };
    var abs = d.map(function (x, i) { return { a: Math.abs(x), s: x > 0 ? 1 : -1 }; }).sort(function (p, q) { return p.a - q.a; });
    var ranks = new Array(n), tie = 0, i = 0;
    while (i < n) {
      var j = i; while (j + 1 < n && abs[j + 1].a === abs[i].a) j++;
      var rk = (i + j + 2) / 2, t = j - i + 1; for (var k = i; k <= j; k++) ranks[k] = rk;
      tie += t * t * t - t; i = j + 1;
    }
    var Wp = 0; for (i = 0; i < n; i++) if (abs[i].s > 0) Wp += ranks[i];
    var mu = n * (n + 1) / 4, sd = Math.sqrt(n * (n + 1) * (2 * n + 1) / 24 - tie / 48);
    if (!(sd > 0)) return { n: n, W: Wp, z: 0, p: 1, r: 0 };
    var z = (Wp - mu - (Wp > mu ? 0.5 : Wp < mu ? -0.5 : 0)) / sd;
    return { n: n, W: Wp, z: z, p: Math.min(1, 2 * (1 - phi(Math.abs(z)))), r: Math.abs(z) / Math.sqrt(n) };
  }

  function statistics(rows, ev, S) {
    var latest = latestSessions(rows).filter(function (r) { return r.source === 'Pre-test'; });
    // each student's most recent attempt on each pre-test
    var lastSess = {};
    latest.forEach(function (r) { var k = r.page + '|' + r.student; if (!(lastSess[k] && lastSess[k].when >= r.when)) lastSess[k] = { when: r.when, s: r.session }; });
    var pages = {};
    latest.forEach(function (r) {
      if (lastSess[r.page + '|' + r.student].s !== r.session) return;
      var P = pages[r.page] || (pages[r.page] = { items: {}, students: {} });
      (P.students[r.student] = P.students[r.student] || {})[r.item] = r.first;
      P.items[r.item] = P.items[r.item] || { std: r.std, band: r.band };
    });
    var validity = [], items = [];
    Object.keys(pages).sort().forEach(function (pg) {
      var P = pages[pg], studs = Object.keys(P.students), its = Object.keys(P.items);
      its.sort(function (a, b) { var x = parseFloat(a.replace(/\D+/g, '')), y = parseFloat(b.replace(/\D+/g, '')); return (x - y) || (a < b ? -1 : 1); });
      var M = studs.map(function (s) { return its.map(function (q) { return P.students[s][q] ? 1 : 0; }); });
      var totals = M.map(function (row) { return row.reduce(function (a, b) { return a + b; }, 0); });
      var k = its.length, n = studs.length;
      var row = { page: pg, n: n, k: k, mean: '', sd: '', kr20: '', sem: '', order: '', verdict: '' };
      if (n >= S.minN && k >= 2) {
        var v = pvar(totals), pq = 0;
        its.forEach(function (q, j) { var p = mean(M.map(function (r) { return r[j]; })); pq += p * (1 - p); });
        var kr = v > 0 ? (k / (k - 1)) * (1 - pq / v) : null;
        row.mean = mean(totals) / k; row.sd = Math.sqrt(v) / k;
        row.kr20 = kr == null ? '' : Math.round(kr * 100) / 100;
        row.sem = kr == null ? '' : Math.sqrt(v) * Math.sqrt(Math.max(0, 1 - kr)) / k;
        // band order: Basic ≥ Target ≥ Advanced (one question of slack)
        var ok = 0;
        studs.forEach(function (s, i) {
          var b = {}; its.forEach(function (q, j) { var bd = P.items[q].band; (b[bd] = b[bd] || []).push(M[i][j]); });
          var pc = function (x) { return b[x] ? mean(b[x]) : null; };
          var slack = 1 / 6 + 1e-9, good = true;
          if (pc(3) != null && pc(4) != null && pc(4) > pc(3) + slack) good = false;
          if (pc(4) != null && pc(5) != null && pc(5) > pc(4) + slack) good = false;
          if (good) ok++;
        });
        row.order = ok / n;
        row.verdict = kr == null ? 'Everyone scored the same — no spread to measure'
          : kr >= 0.7 ? 'Trustworthy' : kr >= 0.5 ? 'Fair — use with other evidence' : 'Use with caution';
        if (row.order !== '' && row.order < 0.7) row.verdict += '; bands out of order for many students';
      } else {
        row.verdict = 'Not enough data yet (need ' + S.minN + ' students)';
      }
      validity.push(row);
      its.forEach(function (q, j) {
        var col = M.map(function (r) { return r[j]; });
        var p = n ? mean(col) : '';
        var rest = totals.map(function (t, i) { return t - M[i][j]; });
        var rpb = n >= S.minN ? corr(col, rest) : null;
        var flag = '';
        if (n >= S.minN) {
          if (rpb != null && rpb < 0) flag = 'Check the answer key';
          else if (rpb != null && rpb < 0.15) flag = 'May be confusing';
          if (p < 0.2) flag = (flag ? flag + '; ' : '') + 'Very hard';
          else if (p > 0.95) flag = (flag ? flag + '; ' : '') + 'Very easy';
        }
        items.push({ page: pg, item: q, std: P.items[q].std, band: P.items[q].band, n: n, p: p,
                     rpb: rpb == null ? '' : Math.round(rpb * 100) / 100, flag: flag });
      });
    });

    // growth: first pre-test level vs latest later level, per student × standard
    var by = {};
    ev.forEach(function (e) { var k = e.student + '|' + e.std; (by[k] = by[k] || []).push(e); });
    var pairs = {}, all = [];
    Object.keys(by).forEach(function (k) {
      var es = by[k], pi = -1;
      for (var i = 0; i < es.length; i++) if (es[i].source === 'Pre-test') { pi = i; break; }
      if (pi < 0 || pi === es.length - 1) return;
      var last = es[es.length - 1], pre = es[pi].level;
      // compare only on what the later work can measure (practice without Advanced questions tops out at 4)
      var d = (last.level === last.cap && pre > last.cap) ? 0 : last.level - Math.min(pre, last.cap);
      (pairs[es[0].std] = pairs[es[0].std] || []).push(d); all.push(d);
    });
    var growth = Object.keys(pairs).sort(function (a, b) { return stdOrder(a) - stdOrder(b); })
      .map(function (s) { return growthRow(s, pairs[s], S); });
    if (all.length) growth.push(growthRow('All standards', all, S));
    return { validity: validity, items: items, growth: growth };
  }

  function growthRow(std, d, S) {
    var up = d.filter(function (x) { return x > 0; }).length, down = d.filter(function (x) { return x < 0; }).length;
    var w = wilcoxon(d), enough = w.n >= 6;
    var med = median(d);
    var reading = !d.length ? '' :
      !enough ? 'Too few changed pairs for a test (need 6) — look at the counts' :
      (w.p < 0.05 && w.r >= 0.3) ? (up > down ? 'Clear growth' : 'Clear drop — reteach?') :
      'No clear change yet';
    return { std: std, n: d.length, up: up, same: d.length - up - down, down: down, median: med,
             p: enough ? Math.round(w.p * 1000) / 1000 : '', r: enough ? Math.round(w.r * 100) / 100 : '', reading: reading };
  }

  return { latestSessions: latestSessions, level: level, evidence: evidence, decaying: decaying, mastery: mastery,
           statistics: statistics, wilcoxon: wilcoxon, phi: phi, corr: corr, stdOrder: stdOrder };
})();

// ════════════════════════════════════════════════════════════════════
//  Fluency Lab Summary tab — unchanged from version 1
// ════════════════════════════════════════════════════════════════════
function rebuildSummary() {
  var ss  = book_();
  var log = ss.getSheetByName(LOG_TAB);
  var sum = ss.getSheetByName(SUMMARY_TAB) || ss.insertSheet(SUMMARY_TAB);
  sum.clear();
  var header = ['Student'].concat(MODULES).concat(['Skills mastered']);
  sum.appendRow(header);
  sum.getRange(1, 1, 1, header.length).setFontWeight('bold')
     .setBackground(NAVY).setFontColor('#ffffff').setWrap(true).setVerticalAlignment('middle');
  sum.setFrozenRows(1); sum.setFrozenColumns(1);
  sum.setRowHeight(1, 54); sum.setColumnWidth(1, 180);
  var last = log.getLastRow();
  if (last < 2) { sum.getRange(2,1).setValue('No scores submitted yet.'); return; }
  var rows = log.getRange(2, 2, last - 1, 5).getValues();
  var best = {};
  rows.forEach(function (r) {
    var n = r[0], m = r[1], pct = Math.round(Number(r[4]) * 100);
    if (!n || !m) return;
    if (!best[n]) best[n] = {};
    if (best[n][m] == null || pct > best[n][m]) best[n][m] = pct;
  });
  var names = Object.keys(best).sort();
  var out = names.map(function (n) {
    var line = [n], mastered = 0;
    MODULES.forEach(function (m) {
      var v = best[n][m];
      if (v == null) line.push(''); else { line.push(v / 100); if (v >= MASTERY_PCT) mastered++; }
    });
    line.push(mastered + ' of ' + MODULES.length);
    return line;
  });
  if (!out.length) return;
  sum.getRange(2, 1, out.length, header.length).setValues(out);
  sum.getRange(2, 2, out.length, MODULES.length).setNumberFormat('0%').setHorizontalAlignment('center');
  var bg = out.map(function (line) {
    return MODULES.map(function (m, c) {
      var v = line[c + 1];
      return v === '' ? '#f1f3f4' : v * 100 >= MASTERY_PCT ? '#d4edda' : v * 100 >= 60 ? '#fff3cd' : '#f8d7da';
    });
  });
  sum.getRange(2, 2, out.length, MODULES.length).setBackgrounds(bg);
  sum.getRange(2, header.length, out.length, 1).setFontWeight('bold');
  for (var i = 2; i <= header.length; i++) sum.setColumnWidth(i, 110);
}

// ════════════════════════════════════════════════════════════════════
//  helpers
// ════════════════════════════════════════════════════════════════════
function book_() {
  return SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID'));
}
function openOrCreate_() {
  var props = PropertiesService.getScriptProperties(), id = props.getProperty('SHEET_ID'), ss = null;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; } }
  if (!ss) { ss = SpreadsheetApp.create(SHEET_NAME); props.setProperty('SHEET_ID', ss.getId()); }
  return ss;
}
function ensureTab_(ss, name) { return ss.getSheetByName(name) || ss.insertSheet(name); }
function ensureLog_(ss) {
  var log = ensureTab_(ss, LOG_TAB);
  if (log.getLastRow() === 0) {
    log.appendRow(['When','Student','Skill','Score','Out of','Percent']);
    styleHeader_(log, 6);
    log.setColumnWidth(1,160); log.setColumnWidth(2,180); log.setColumnWidth(3,230);
  }
}
function ensureHeader_(ss, name, head) {
  var sh = ensureTab_(ss, name);
  if (sh.getLastRow() === 0) { sh.getRange(1, 1, 1, head.length).setValues([head]); styleHeader_(sh, head.length); }
  return sh;
}
function styleHeader_(sh, n) { styleHeaderRow_(sh, 1, n); sh.setFrozenRows(1); }
function styleHeaderRow_(sh, row, n) {
  sh.getRange(row, 1, 1, n).setFontWeight('bold').setBackground(NAVY).setFontColor('#ffffff').setWrap(true).setVerticalAlignment('middle');
}
function levelColor_(v) {
  return v >= 4.5 ? '#b7dfc3' : v >= 3.5 ? '#d4edda' : v >= 2.5 ? '#fff3cd' : v >= 1.5 ? '#fde2c8' : '#f8d7da';
}
function readSettings_(ss) {
  var map = {}; DEFAULTS.forEach(function (d) { map[d[0]] = d[1]; });
  var sh = ss.getSheetByName(SET_TAB);
  if (sh && sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, 2).getValues().forEach(function (r) {
    var v = Number(r[1]); if (r[0] in map && isFinite(v) && v > 0) map[r[0]] = v;
  });
  return { met: map['Band met'], partial: map['Partial'], lvl4: map['Practice level 4'], lvl3: map['Practice level 3'], lvl2: map['Practice level 2'],
           decay: map['Decay'], minN: map['Minimum students'] };
}
function writeReadMe_(ss) {
  var sh = ensureTab_(ss, README_TAB); sh.clear();
  var lines = [
    ['Mr. Allen\'s Score Tracker — what each tab shows'],
    [''],
    ['Scores / Summary — Fluency Lab Skill Checks (best score per skill, green at 80%+). Same as before.'],
    ['Responses — every question a student sent from a pre-test or practice page: first try, final answer, standard, band (3.0 / 4.0 / 5.0).'],
    ['Submissions — one row each time a student tapped Send.'],
    ['Standards — each student\'s mastery level (1–5) on each NC standard. Website work is formative (0% of the grade): use it for planning, groups and conferences.'],
    ['   How a level is set: on a pre-test, Basic (3.0) met → 3, Target (4.0) also met → 4, Advanced (5.0) also met → 5;'],
    ['   Basic not met → 2 if at least half right, otherwise 1. "Met" = 80% right on the first try (change it on Settings).'],
    ['   Practice questions are Target (4.0) questions: 75% right → 4, 25% → 3, 10% → 2 (Settings). Practice cannot show a 5, so practice at 4 never lowers an earlier 5.'],
    ['   Several pieces of evidence → your decaying average: newest ×1, the one before ×0.65, then ≈0.42, ≈0.27 …'],
    ['Standards (list) — the same numbers, one row per student and standard, ready to filter, sort or pivot.'],
    ['Statistics — 1. Is each pre-test trustworthy (reliability)? 2. Which questions need a second look? 3. Are students growing after the pre-test?'],
    ['Settings — the numbers above. Change a value and the reports use it at the next refresh.'],
    ['How I Learn (answers) — every "How I Learn Math" questionnaire a student sent from the Fluency Lab (newest at the bottom).'],
    ['How I Learn (results) — the class picture: Parts 1–2 as percents, the top picks in Parts 3–4, how students like to ask for help,'],
    ['   a support profile for each student (with a few "check in" flags), and every written answer. Uses each student\'s newest form.'],
    [''],
    ['Reports refresh every hour. To refresh now: open the script, choose refreshReports, press Run.'],
    ['Privacy: this Sheet is yours alone. The website can only add rows; it cannot read anything back.']
  ];
  sh.getRange(1, 1, lines.length, 1).setValues(lines);
  sh.getRange(1, 1).setFontWeight('bold').setFontSize(14).setFontColor(NAVY);
  sh.setColumnWidth(1, 980);
}
function tidyName_(s) {
  s = String(s || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  return s.replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); });
}
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
/** Handy: print the link to your Sheet. */
function openMySheet() { Logger.log(book_().getUrl()); }

// ════════════════════════════════════════════════════════════════════
//  "HOW I LEARN MATH" questionnaire (Fluency Lab → how-i-learn.html)
//  The website sends one form per student. Nothing is graded.
// ════════════════════════════════════════════════════════════════════
var SURVEY_TAB     = 'How I Learn (answers)';
var SURVEY_RES_TAB = 'How I Learn (results)';
var SCALE = ['Never', 'Sometimes', 'Often', 'Always'];
var SURVEY = {
  think: [
    ['m1', 'I can tell when I understand a math problem and when I don\'t.'],
    ['m2', 'Before I start a problem, I think about what it is asking me to do.'],
    ['m3', 'When I get stuck, I have a plan for what to try next.'],
    ['m4', 'I check my work to see if my answer makes sense.'],
    ['m5', 'I know which math skills are hardest for me right now.'],
    ['m6', 'I can explain my thinking to someone else.']],
  help: [
    ['h7',  'When I don\'t understand, I ask my teacher for help.'],
    ['h8',  'When I don\'t understand, I ask a classmate for help.'],
    ['h9',  'I know what to say or ask when I need help.'],
    ['h10', 'I wait until I am really lost before I ask for help.'],
    ['h11', 'I worry about what others will think if I ask for help.']],
  barriers: [
    ['b1', 'I don\'t know what to ask.'], ['b2', 'I get frustrated and shut down.'],
    ['b3', 'I don\'t want to look silly or embarrassed.'], ['b4', 'I would rather skip it than ask.'],
    ['b5', 'The teacher looks busy.'], ['b6', 'I\'m not sure who to ask.'],
    ['b7', 'I think I should figure it out on my own.'], ['b8', 'I don\'t think the help will make sense.'],
    ['b9', 'I don\'t realize I\'m lost until a quiz or test.'], ['bo', 'Other']],
  helps: [
    ['s1', 'A step-by-step worked example'], ['s2', 'A checklist or steps to follow'],
    ['s3', 'Drawings, diagrams, or number lines'], ['s4', 'Notes or a reference sheet'],
    ['s5', 'Hands-on tools (tiles, counters, etc.)'], ['s6', 'Watching a video'],
    ['s7', 'The teacher explaining it a different way'], ['s8', 'Practicing similar problems'],
    ['s9', 'A classmate explaining it'], ['s10', 'Talking it out loud'],
    ['s11', 'Working in a small group'], ['s12', 'Quiet space with fewer distractions'],
    ['s13', 'Extra time'], ['s14', 'A quick check-in from the teacher'],
    ['s15', 'Breaking a problem into smaller parts'], ['so', 'Other']],
  ask: [['raise', 'Raise my hand'], ['card', 'Signal card or cup'], ['note', 'Private note'],
        ['after', 'Talk after class'], ['friend', 'Ask a friend first']],
  open: ['Think of a time in math when something clicked or went well. What helped?',
         'When I get stuck on a problem, I usually…',
         'The best way my teacher could help me is…']
};
/** Items where "Often / Always" is a worry, not a strength. */
var SURVEY_REVERSED = { h10: 1, h11: 1 };

function SURVEY_HEAD_() {
  var h = ['When', 'Student', 'Period'];
  SURVEY.think.concat(SURVEY.help).forEach(function (q, i) { h.push((i + 1) + '. ' + q[1]); });
  return h.concat(['Part 3: hard to ask (3 picks)', 'Part 3: other', 'Part 4: helped me (3 picks)', 'Part 4: other',
                   'Clicked when…', 'When stuck I…', 'Best way to help me…', 'Best way to ask for help']);
}
function label_(list, id) { for (var i = 0; i < list.length; i++) if (list[i][0] === id) return list[i][1]; return null; }
function clip_(s, n) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim().slice(0, n); }

function handleSurvey_(d) {
  var name = tidyName_(d.name), period = clip_(d.period, 12);
  if (!name || name.indexOf(' ') < 0) return json_({ ok: false, error: 'first and last name' });
  if (!period) return json_({ ok: false, error: 'no period' });
  var L = d.likert || {}, row = [new Date(), name, period];
  var items = SURVEY.think.concat(SURVEY.help);
  for (var i = 0; i < items.length; i++) {
    var v = Number(L[items[i][0]]);
    if (!(v >= 1 && v <= 4)) return json_({ ok: false, error: 'missing answer ' + (i + 1) });
    row.push(SCALE[v - 1]);
  }
  function picks(list, ids, other, part) {
    ids = (ids || []).map(String).filter(function (x, k, a) { return a.indexOf(x) === k && label_(list, x); });
    if (ids.length !== 3) throw new Error('pick exactly 3 in ' + part);
    if (ids.indexOf(list[list.length - 1][0]) >= 0 && !clip_(other, 120)) throw new Error('write your "Other" in ' + part);
    return ids;
  }
  var b, s;
  try { b = picks(SURVEY.barriers, d.barriers, d.barrierOther, 'Part 3'); s = picks(SURVEY.helps, d.helps, d.helpOther, 'Part 4'); }
  catch (err) { return json_({ ok: false, error: err.message }); }
  var ask = label_(SURVEY.ask, String(d.ask || ''));
  if (!ask) return json_({ ok: false, error: 'best way to ask' });
  var open = (d.open || []).map(function (t) { return clip_(t, 600); });
  row.push(b.map(function (x) { return label_(SURVEY.barriers, x); }).join(' | '), b.indexOf('bo') >= 0 ? clip_(d.barrierOther, 120) : '',
           s.map(function (x) { return label_(SURVEY.helps, x); }).join(' | '), s.indexOf('so') >= 0 ? clip_(d.helpOther, 120) : '',
           open[0] || '', open[1] || '', open[2] || '', ask);
  var lock = LockService.getScriptLock(); lock.waitLock(25000);
  try {
    var ss = book_();
    var sh = ensureHeader_(ss, SURVEY_TAB, SURVEY_HEAD_());
    sh.appendRow(row);
    rebuildSurvey_(ss);
  } finally { lock.releaseLock(); }
  return json_({ ok: true, name: name });
}

/** The results tab: class picture + one profile per student (newest form per student). */
function rebuildSurvey_(ss) {
  var src = ss.getSheetByName(SURVEY_TAB), sh = ensureTab_(ss, SURVEY_RES_TAB);
  sh.clear();
  var head = SURVEY_HEAD_(), W = head.length;
  var data = src && src.getLastRow() > 1 ? src.getRange(2, 1, src.getLastRow() - 1, W).getValues() : [];
  var newest = {};
  data.forEach(function (r) { var k = String(r[1]).toLowerCase(); if (!newest[k] || new Date(r[0]) >= new Date(newest[k][0])) newest[k] = r; });
  var rows = Object.keys(newest).map(function (k) { return newest[k]; })
    .sort(function (a, b) { return String(a[2]).localeCompare(String(b[2])) || String(a[1]).localeCompare(String(b[1])); });
  var n = rows.length, r0 = 1;
  function put(vals, bold, bg, color) {
    var w = Math.max.apply(null, vals.map(function (v) { return v.length; }));
    var block = vals.map(function (v) { var x = v.slice(); while (x.length < w) x.push(''); return x; });
    var rg = sh.getRange(r0, 1, block.length, w); rg.setValues(block);
    if (bold) sh.getRange(r0, 1, 1, w).setFontWeight('bold');
    if (bg) sh.getRange(r0, 1, 1, w).setBackground(bg).setFontColor(color || '#ffffff');
    r0 += block.length; return r0 - block.length;
  }
  function title(t, note) {
    r0++; sh.getRange(r0, 1).setValue(t).setFontWeight('bold').setFontSize(13).setFontColor(NAVY); r0++;
    if (note) { sh.getRange(r0, 1).setValue(note).setFontStyle('italic').setFontColor('#6B7488'); r0++; }
  }
  function pct(c) { return n ? c / n : 0; }
  function bar(p, col) { return '=SPARKLINE(' + (Math.round(p * 1000) / 1000) + ',{"charttype","bar";"max",1;"color1","' + col + '"})'; }

  sh.getRange(1, 1).setValue('How I Learn Math — class results').setFontWeight('bold').setFontSize(15).setFontColor(NAVY);
  sh.getRange(2, 1).setValue(n + ' student' + (n === 1 ? '' : 's') + ' (newest form for each). Updated ' + new Date().toLocaleString() + '.').setFontColor('#6B7488');
  r0 = 3;
  if (!n) { sh.getRange(4, 1).setValue('No forms yet. Students fill it in on the Fluency Lab page: "How I Learn Math".'); return; }

  // Parts 1–2: agreement table
  title('Parts 1–2 · How students see their learning', 'Percent of students choosing each answer. "Often + Always" is the strength column — except items 10 and 11, where Often/Always is a warning sign (red).');
  var t = [['#', 'Statement', 'Never', 'Sometimes', 'Often', 'Always', 'Often + Always', '']];
  SURVEY.think.concat(SURVEY.help).forEach(function (q, i) {
    var cnt = [0, 0, 0, 0];
    rows.forEach(function (r) { var k = SCALE.indexOf(String(r[3 + i])); if (k >= 0) cnt[k]++; });
    var oa = pct(cnt[2] + cnt[3]);
    t.push([i + 1, q[1] + (SURVEY_REVERSED[q[0]] ? '  ⚠' : ''), pct(cnt[0]), pct(cnt[1]), pct(cnt[2]), pct(cnt[3]), oa, bar(oa, SURVEY_REVERSED[q[0]] ? '#B42318' : '#15803D')]);
  });
  var at = put(t, true, NAVY);
  sh.getRange(at + 1, 3, t.length - 1, 5).setNumberFormat('0%');

  // Parts 3–4: ranked picks
  function ranked(list, col, colOther, ttl, note, color) {
    title(ttl, note);
    var cnt = {}; list.forEach(function (x) { cnt[x[1]] = 0; });
    var others = [];
    rows.forEach(function (r) { String(r[col]).split(' | ').forEach(function (l) { if (cnt[l] != null) cnt[l]++; }); if (r[colOther]) others.push(r[1] + ': ' + r[colOther]); });
    var tt = [['Choice', 'Students', 'Percent', '']];
    list.map(function (x) { return x[1]; }).sort(function (a, b) { return cnt[b] - cnt[a]; })
      .forEach(function (l) { tt.push([l, cnt[l], pct(cnt[l]), bar(pct(cnt[l]), color)]); });
    var s0 = put(tt, true, NAVY);
    sh.getRange(s0 + 1, 3, tt.length - 1, 1).setNumberFormat('0%');
    if (others.length) { sh.getRange(r0, 1).setValue('"Other" answers: ' + others.join(' · ')).setWrap(true); r0++; }
  }
  var c3 = 3 + 11;
  ranked(SURVEY.barriers, c3, c3 + 1, 'Part 3 · What makes it hard to ask for help', 'Each student picked 3. Highest first.', '#B45309');
  ranked(SURVEY.helps, c3 + 2, c3 + 3, 'Part 4 · What has helped students learn math', 'Each student picked 3. Highest first.', '#0056B3');

  // best way to ask
  title('Best way to ask for help', null);
  var ac = {}; SURVEY.ask.forEach(function (a) { ac[a[1]] = 0; });
  rows.forEach(function (r) { if (ac[r[W - 1]] != null) ac[r[W - 1]]++; });
  var tA = [['Way', 'Students', 'Percent', '']];
  SURVEY.ask.map(function (a) { return a[1]; }).sort(function (a, b) { return ac[b] - ac[a]; }).forEach(function (l) { tA.push([l, ac[l], pct(ac[l]), bar(pct(ac[l]), '#6D28D9')]); });
  var a0 = put(tA, true, NAVY); sh.getRange(a0 + 1, 3, tA.length - 1, 1).setNumberFormat('0%');

  // student profiles
  title('Student support profiles', 'Check-in flags: no plan when stuck (3 = Never/Sometimes) · rarely asks the teacher (7 = Never) · waits until lost (10 = Often/Always) · worries about asking (11 = Often/Always) · shuts down (picked in Part 3).');
  var P = [['Period', 'Student', 'Check in?', 'Hard to ask (Part 3)', 'Helps me (Part 4)', 'Best way to ask']];
  rows.forEach(function (r) {
    var f = [];
    if (/Never|Sometimes/.test(r[3 + 2])) f.push('no plan when stuck');
    if (r[3 + 6] === 'Never') f.push('rarely asks teacher');
    if (/Often|Always/.test(r[3 + 9])) f.push('waits until lost');
    if (/Often|Always/.test(r[3 + 10])) f.push('worries about asking');
    if (String(r[c3]).indexOf('I get frustrated and shut down.') >= 0) f.push('shuts down');
    P.push([r[2], r[1], f.join(', '), String(r[c3]).replace(/ \| /g, '; ') + (r[c3 + 1] ? ' (' + r[c3 + 1] + ')' : ''),
            String(r[c3 + 2]).replace(/ \| /g, '; ') + (r[c3 + 3] ? ' (' + r[c3 + 3] + ')' : ''), r[W - 1]]);
  });
  var p0 = put(P, true, NAVY);
  for (var i = 1; i < P.length; i++) if (P[i][2]) sh.getRange(p0 + i, 3).setBackground('#FDECEC').setFontColor('#7F1D1D');

  // written answers
  title('Part 5 · In their own words', null);
  var O = [['Period', 'Student'].concat(SURVEY.open)];
  rows.forEach(function (r) { O.push([r[2], r[1], r[c3 + 4], r[c3 + 5], r[c3 + 6]]); });
  put(O, true, NAVY);

  sh.setColumnWidth(1, 70); sh.setColumnWidth(2, 360); [3, 4, 5, 6].forEach(function (c) { sh.setColumnWidth(c, 230); }); sh.setColumnWidth(7, 120); sh.setColumnWidth(8, 160);
  sh.getRange(1, 1, r0, 8).setWrap(true).setVerticalAlignment('top');
}
