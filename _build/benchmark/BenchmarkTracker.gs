/**
 * ════════════════════════════════════════════════════════════════════
 *  MR. ALLEN'S BENCHMARK TRACKER
 *  Results from the interactive benchmark reviews on the website.
 *  This is separate from the Score Tracker (Fluency Lab, pre-tests,
 *  practice). Benchmarks go here and nowhere else.
 * ════════════════════════════════════════════════════════════════════
 *
 *  The Google Sheet it makes has these tabs:
 *    Gradebook          one row per student per benchmark: best score,
 *                       latest score, attempts, and % on each standard
 *    Submissions        one row every time a student taps Submit
 *    Responses          one row for every question a student answered
 *    Question Analysis  % of students right on each question (first
 *                       attempts only) and the most common wrong answer
 *    Read Me            what every tab means
 *
 *  SET IT UP — about five minutes, one time
 *  (Easiest way: make a blank Google Sheet, then Extensions → Apps Script,
 *   and paste this there. Steps 3–5 below are the same.)
 *   1. Go to script.google.com and click  New project.
 *   2. Delete what is in the editor. Paste this whole file. Click the
 *      disk icon to Save. Name the project "Benchmark Tracker".
 *   3. In the dropdown at the top choose  setup  and press  Run.
 *      Approve when Google asks. The Sheet's address appears in the
 *      Execution log. The Sheet is also in your Google Drive, named
 *      "Benchmark Results — Mr. Allen's Math Class".
 *   4. Deploy → New deployment → gear icon → Web app.
 *        Execute as:      Me
 *        Who has access:  Anyone
 *      Click Deploy and copy the Web app URL (it ends in /exec).
 *   5. Paste that URL into  benchmark-config.js  on the website
 *      (between the quote marks after ENDPOINT), or send it to Claude.
 *
 *  If you change this script later: Deploy → Manage deployments →
 *  pencil ✎ → Version: "New version" → Deploy. (A NEW deployment would
 *  change the address.)
 * ════════════════════════════════════════════════════════════════════
 */

/** Must match CODE in benchmark-config.js. */
var CLASS_CODE = 'allen-8th-benchmark';

var SHEET_NAME = "Benchmark Results — Mr. Allen's Math Class";
var GRADE_TAB  = 'Gradebook';
var SUBS_TAB   = 'Submissions';
var RESP_TAB   = 'Responses';
var QA_TAB     = 'Question Analysis';
var README_TAB = 'Read Me';
var NAVY = '#1E2D4F', GOLD = '#FFC107';

var SUBS_HEAD = ['Submitted', 'Student', 'Benchmark', 'Attempt', 'Score', 'Out of', 'Percent', 'By standard', 'Session', 'Class'];
var RESP_HEAD = ['Submitted', 'Student', 'Benchmark', 'Attempt', 'Question', 'Standard', 'Skill', 'Student answer', 'Correct', 'Class'];
var GRADE_HEAD = ['Class', 'Student', 'Benchmark', 'Best %', 'Latest %', 'Attempts', 'Last submitted'];

/** The classes students choose from on the website, in the order the Gradebook lists them. */
var CLASSES = ['A1', 'A2', 'A4', 'B5', 'B6', '8A', '8B'];

var STD_OK = /^NC\.8\.(NS\.[1-2]|EE\.[1-8]|F\.[1-5]|G\.[1-9]|SP\.[1-4])$/;

// ───────────────────────── setup ─────────────────────────
function setup() {
  var ss = book_();
  tab_(ss, GRADE_TAB, GRADE_HEAD);
  tab_(ss, SUBS_TAB, SUBS_HEAD);
  tab_(ss, RESP_TAB, RESP_HEAD);
  tab_(ss, QA_TAB, ['Benchmark', 'Question', 'Standard', 'Skill', 'Students', '% right', 'Most common wrong answer']);
  writeReadMe_(ss);
  var extra = ss.getSheetByName('Sheet1');
  if (extra && ss.getSheets().length > 1) ss.deleteSheet(extra);
  Logger.log('Benchmark Results sheet: ' + ss.getUrl());
  return ss.getUrl();
}

// ───────────────────────── web app ─────────────────────────
function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    if (String(d.code) !== CLASS_CODE) return json_({ ok: false, error: 'bad code' });
    if (d.kind !== 'benchmark') return json_({ ok: false, error: 'bad kind' });
    var name = cleanName_(d.name);
    if (!name) return json_({ ok: false, error: 'no name' });
    var bench = clip_(d.benchmark, 80);
    var cls = String(d.period || '').toUpperCase().replace(/\s+/g, '');
    if (CLASSES.indexOf(cls) < 0) cls = '';
    if (!bench) return json_({ ok: false, error: 'no benchmark' });
    var items = (d.items || []).slice(0, 100).map(function (it, i) {
      var std = String(it.std || '');
      return {
        id: clip_(it.id, 12) || String(i + 1),
        std: STD_OK.test(std) ? std : '',
        label: clip_(it.label, 80),
        answer: clip_(it.answer, 120),
        ok: it.ok ? 1 : 0
      };
    });
    if (!items.length) return json_({ ok: false, error: 'no answers' });
    var score = items.reduce(function (s, it) { return s + it.ok; }, 0), total = items.length;

    var lock = LockService.getScriptLock(); lock.waitLock(25000);
    try {
      var ss = book_();
      var subs = tab_(ss, SUBS_TAB, SUBS_HEAD), resp = tab_(ss, RESP_TAB, RESP_HEAD);
      var session = clip_(d.session, 40);
      // attempt number: count earlier sessions by this student on this benchmark
      var prev = rows_(subs).filter(function (r) { return r[1] === name && r[2] === bench; });
      var same = prev.filter(function (r) { return r[8] === session && session; })[0];
      var attempt = same ? same[3] : prev.reduce(function (m, r) { return Math.max(m, Number(r[3]) || 0); }, 0) + 1;
      var now = new Date();
      var bySt = {};
      items.forEach(function (it) {
        if (!it.std) return;
        var b = bySt[it.std] = bySt[it.std] || { r: 0, n: 0 }; b.r += it.ok; b.n++;
      });
      var byText = Object.keys(bySt).sort().map(function (s) { return s.replace('NC.8.', '') + ' ' + bySt[s].r + '/' + bySt[s].n; }).join(' · ');
      subs.appendRow([now, name, bench, attempt, score, total, Math.round(100 * score / total) / 100, byText, session, cls]);
      subs.getRange(subs.getLastRow(), 7).setNumberFormat('0%');
      var block = items.map(function (it) { return [now, name, bench, attempt, it.id, it.std, it.label, it.answer, it.ok, cls]; });
      resp.getRange(resp.getLastRow() + 1, 1, block.length, RESP_HEAD.length).setValues(block);
      rebuild_(ss);
      return json_({ ok: true, name: name, score: score, total: total, attempt: attempt });
    } finally { lock.releaseLock(); }
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err).slice(0, 120) });
  }
}

function doGet() {
  return ContentService.createTextOutput("Mr. Allen's Benchmark Tracker is running.");
}

/** Run this any time to rebuild the Gradebook and Question Analysis tabs. */
function refreshReports() { rebuild_(book_()); }

// ───────────────────────── reports ─────────────────────────
function rebuild_(ss) {
  var subs = rows_(tab_(ss, SUBS_TAB, SUBS_HEAD));
  // A student who taps Submit again in the same attempt resends it: keep only the newest row
  // for each student + benchmark + attempt + question.
  var seen = {}, resp = [];
  rows_(tab_(ss, RESP_TAB, RESP_HEAD)).reverse().forEach(function (r) {
    var k = [r[1], r[2], r[3], r[4]].join('\u0001');
    if (!seen[k]) { seen[k] = 1; resp.push(r); }
  });
  resp.reverse();

  // Gradebook: best and latest per student per benchmark, % by standard on the latest attempt
  var key = function (s, b) { return s + '\u0001' + b; };
  var G = {}, stdSet = {};
  subs.forEach(function (r) {
    var k = key(r[1], r[2]), pct = Number(r[6]) || 0, a = Number(r[3]) || 0;
    var g = G[k] = G[k] || { student: r[1], bench: r[2], best: 0, latest: 0, latestA: 0, attempts: {}, when: r[0], cls: '' };
    g.best = Math.max(g.best, pct); g.attempts[a] = 1;
    if (a >= g.latestA) { g.latestA = a; g.latest = pct; g.when = r[0]; }
    if (r[9]) g.cls = r[9];
  });
  var latestStd = {};
  resp.forEach(function (r) {
    var g = G[key(r[1], r[2])]; if (!g || Number(r[3]) !== g.latestA || !r[5]) return;
    stdSet[r[5]] = 1;
    var m = latestStd[key(r[1], r[2])] = latestStd[key(r[1], r[2])] || {};
    var b = m[r[5]] = m[r[5]] || { r: 0, n: 0 }; b.r += Number(r[8]) || 0; b.n++;
  });
  var stds = Object.keys(stdSet).sort();
  var head = GRADE_HEAD.concat(stds.map(function (s) { return s + ' %'; }));
  var list = Object.keys(G).map(function (k) { return G[k]; }).sort(function (a, b) {
    var ca = clsOrder_(a.cls), cb = clsOrder_(b.cls);
    if (ca !== cb) return ca - cb;
    var la = lastName_(a.student), lb = lastName_(b.student);
    return la < lb ? -1 : la > lb ? 1 : (a.bench < b.bench ? -1 : a.bench > b.bench ? 1 : 0);
  });
  var out = list.map(function (g) {
    var m = latestStd[key(g.student, g.bench)] || {};
    return [g.cls, g.student, g.bench, g.best, g.latest, Object.keys(g.attempts).length, g.when]
      .concat(stds.map(function (s) { return m[s] ? Math.round(100 * m[s].r / m[s].n) / 100 : ''; }));
  });
  var gb = ss.getSheetByName(GRADE_TAB) || ss.insertSheet(GRADE_TAB);
  gb.clear();
  write_(gb, head, out);
  if (out.length) {
    gb.getRange(2, 4, out.length, 2).setNumberFormat('0%');
    if (stds.length) gb.getRange(2, 8, out.length, stds.length).setNumberFormat('0%');
    gb.getRange(2, 7, out.length, 1).setNumberFormat('m/d/yyyy h:mm');
    var colors = out.map(function (r) {
      return r.map(function (v, j) {
        if (j !== 4 && j < 7) return null;
        if (v === '') return null;
        return v >= 0.8 ? '#DCF2E3' : v >= 0.6 ? '#FFF4CC' : '#FADBD8';
      });
    });
    gb.getRange(2, 1, out.length, head.length).setBackgrounds(colors);
  }

  // Question Analysis: first attempts only
  var Q = {};
  resp.forEach(function (r) {
    if (Number(r[3]) !== 1) return;
    var k = r[2] + '\u0001' + r[4];
    var q = Q[k] = Q[k] || { bench: r[2], id: r[4], std: r[5], label: r[6], n: 0, right: 0, wrong: {} };
    q.n++; if (Number(r[8])) q.right++;
    else { var a = String(r[7] || '(blank)'); q.wrong[a] = (q.wrong[a] || 0) + 1; }
  });
  var qs = Object.keys(Q).map(function (k) { return Q[k]; }).sort(function (a, b) {
    return a.bench < b.bench ? -1 : a.bench > b.bench ? 1 : (parseFloat(a.id) || 0) - (parseFloat(b.id) || 0);
  });
  var qOut = qs.map(function (q) {
    var top = Object.keys(q.wrong).sort(function (a, b) { return q.wrong[b] - q.wrong[a]; })[0];
    return [q.bench, q.id, q.std, q.label, q.n, Math.round(100 * q.right / q.n) / 100, top ? top + ' (' + q.wrong[top] + ')' : ''];
  });
  var qa = ss.getSheetByName(QA_TAB) || ss.insertSheet(QA_TAB);
  qa.clear();
  write_(qa, ['Benchmark', 'Question', 'Standard', 'Skill', 'Students', '% right', 'Most common wrong answer'], qOut);
  if (qOut.length) {
    qa.getRange(2, 6, qOut.length, 1).setNumberFormat('0%');
    qa.getRange(2, 1, qOut.length, 7).setBackgrounds(qOut.map(function (r) {
      var p = r[5]; var c = p >= 0.8 ? '#DCF2E3' : p >= 0.6 ? '#FFF4CC' : '#FADBD8';
      return [null, null, null, null, null, c, null];
    }));
  }
}

function writeReadMe_(ss) {
  var sh = ss.getSheetByName(README_TAB) || ss.insertSheet(README_TAB);
  sh.clear();
  var lines = [
    ["Mr. Allen's Benchmark Tracker"],
    ['Results from the interactive benchmark reviews on the class website. Only benchmarks come here.'],
    [''],
    ['Gradebook — one row per student per benchmark, grouped by class (A1, A2, A4, B5, B6, 8A, 8B). Best % and Latest % are out of 100. The NC standard columns show the % right on that standard in the latest attempt. Green = 80% or more, yellow = 60–79%, red = below 60%.'],
    ['Submissions — one row every time a student taps Submit. Attempt 1 is the first try. Each new try counts as a new attempt.'],
    ['Responses — every question a student answered: what they typed or chose, and whether it was right (1) or not (0).'],
    ['Question Analysis — first attempts only. % right on each question and the most common wrong answer, so you can see what to reteach.'],
    [''],
    ['Gradebook and Question Analysis rebuild every time a student submits. To rebuild by hand, run refreshReports in the script editor.'],
    ['Names are whatever the student typed. If a student typed their name two ways, fix it on the Submissions and Responses tabs, then run refreshReports.']
  ];
  sh.getRange(1, 1, lines.length, 1).setValues(lines);
  sh.getRange(1, 1).setFontWeight('bold').setFontSize(14).setFontColor(NAVY);
  sh.getRange(1, 1, lines.length, 1).setWrap(true);
  sh.setColumnWidth(1, 760);
}

// ───────────────────────── helpers ─────────────────────────
function book_() {
  var props = PropertiesService.getScriptProperties(), id = props.getProperty('SHEET_ID'), ss = null;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; } }
  // Pasted into a Sheet (Extensions → Apps Script)? Use that Sheet.
  if (!ss && SpreadsheetApp.getActiveSpreadsheet) { try { ss = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) { ss = null; } }
  if (!ss) ss = SpreadsheetApp.create(SHEET_NAME);
  if (ss.getId() !== id) props.setProperty('SHEET_ID', ss.getId());
  return ss;
}

function tab_(ss, name, head) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, head.length).setValues([head]);
    style_(sh, head.length);
  } else if (sh.getRange(1, head.length).getValue() !== head[head.length - 1]) {
    sh.getRange(1, 1, 1, head.length).setValues([head]);        // add new columns (e.g. Class) to an older Sheet
    style_(sh, head.length);
  }
  return sh;
}

function write_(sh, head, rows) {
  sh.getRange(1, 1, 1, head.length).setValues([head]);
  style_(sh, head.length);
  if (rows.length) sh.getRange(2, 1, rows.length, head.length).setValues(rows);
}

function style_(sh, n) {
  sh.getRange(1, 1, 1, n).setBackground(NAVY).setFontColor('#FFFFFF').setFontWeight('bold').setWrap(true);
  sh.setFrozenRows(1);
}

function rows_(sh) {
  var last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, 10).getValues();
}

function cleanName_(s) {
  s = String(s || '').replace(/[<>=+@"]/g, '').replace(/\s+/g, ' ').trim().slice(0, 60);
  if (s.length < 3 || s.indexOf(' ') < 0) return '';
  return s.split(' ').map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }).join(' ');
}

function clsOrder_(c) { var i = CLASSES.indexOf(c); return i < 0 ? 99 : i; }

function lastName_(s) { var p = String(s).split(' '); return (p[p.length - 1] + ' ' + s).toLowerCase(); }

function clip_(s, n) {
  s = String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  if (/^[=+@-]/.test(s)) s = "'" + s;          // never let a typed answer become a formula
  return s.slice(0, n);
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
