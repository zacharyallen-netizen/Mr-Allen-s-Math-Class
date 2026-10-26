/**
 * ════════════════════════════════════════════════════════════════════
 *  MR. ALLEN'S BENCHMARK TRACKER
 *  Results from the interactive benchmark reviews on the website.
 *  This is separate from the Score Tracker (Fluency Lab, pre-tests,
 *  practice). Benchmarks go here and nowhere else.
 * ════════════════════════════════════════════════════════════════════
 *
 *  The Google Sheet it makes has these tabs:
 *    Roster             YOUR class lists (you paste them in, one time).
 *                       Student names live only here, in your private
 *                       Sheet — never on the website.
 *    Gradebook          every rostered student, every benchmark: done or
 *                       not submitted, best and latest score, attempts,
 *                       and % on each standard
 *    A1 A2 A4 B5 B6     the same Gradebook, one tab per class
 *    Class Summary      per class: how many submitted, who is missing,
 *                       class average, and the average on each standard
 *    Check Names        submissions whose typed name did not match the
 *                       Roster (fix with the "Other names" column)
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
 *  ROSTER (one time, then whenever a student joins or leaves)
 *   On the Roster tab, one row per student: Class (A1, A2, A4, B5, B6),
 *   Last name, First name, Student # (optional), and Other names they
 *   might type (optional, separate with commas, e.g. "Kit Stone").
 *   Then run  refreshReports  once (or wait for the next submission).
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
var ROSTER_TAB = 'Roster';
var SUMMARY_TAB = 'Class Summary';
var CHECK_TAB  = 'Check Names';
var ROSTER_HEAD = ['Class', 'Last name', 'First name', 'Student #', 'Other names they might type (separate with commas)'];
var NAVY = '#1E2D4F', GOLD = '#FFC107';

var SUBS_HEAD = ['Submitted', 'Student', 'Benchmark', 'Attempt', 'Score', 'Out of', 'Percent', 'By standard', 'Session', 'Class'];
var RESP_HEAD = ['Submitted', 'Student', 'Benchmark', 'Attempt', 'Question', 'Standard', 'Skill', 'Student answer', 'Correct', 'Class'];
var GRADE_HEAD = ['Class', 'Student', 'Benchmark', 'Best %', 'Latest %', 'Attempts', 'Last submitted'];

/** The classes students choose from on the website, in the order the Gradebook lists them. */
var CLASSES = ['A1', 'A2', 'A4', 'B5', 'B6'];

var STD_OK = /^NC\.8\.(NS\.[1-2]|EE\.[1-8]|F\.[1-5]|G\.[1-9]|SP\.[1-4])$/;

// ───────────────────────── setup ─────────────────────────
function setup() {
  var ss = book_();
  var ro = tab_(ss, ROSTER_TAB, ROSTER_HEAD);
  ro.setColumnWidth(1, 70); ro.setColumnWidth(2, 160); ro.setColumnWidth(3, 160); ro.setColumnWidth(4, 120); ro.setColumnWidth(5, 320);
  tab_(ss, GRADE_TAB, GRADE_HEAD);
  tab_(ss, SUBS_TAB, SUBS_HEAD);
  tab_(ss, RESP_TAB, RESP_HEAD);
  tab_(ss, QA_TAB, ['Benchmark', 'Question', 'Standard', 'Skill', 'Students', '% right', 'Most common wrong answer']);
  writeReadMe_(ss);
  rebuild_(ss);
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

  var roster = readRoster_(ss);
  if (roster.length) gradebookRoster_(ss, roster, subs, resp);
  else gradebookLegacy_(ss, subs, resp);

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

function gradebookLegacy_(ss, subs, resp) {
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

}

// ───────────────────────── roster ─────────────────────────
function readRoster_(ss) {
  var sh = ss.getSheetByName(ROSTER_TAB);
  if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, 5).getValues().map(function (r, i) {
    var cls = String(r[0] || '').toUpperCase().replace(/\s+/g, '');
    var last = String(r[1] || '').trim(), first = String(r[2] || '').trim();
    var aliases = String(r[4] || '').split(',').map(norm_).filter(function (a) { return a; });
    return { id: i, cls: cls, last: last, first: first, num: String(r[3] || '').trim(), aliases: aliases };
  }).filter(function (s) { return s.last && s.first && CLASSES.indexOf(s.cls) >= 0; });
}

/** lowercase letters, spaces and hyphens only; single letters (middle initials) dropped */
function norm_(s) {
  return String(s || '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z\- ]/g, ' ').replace(/\s+/g, ' ').trim()
    .split(' ').filter(function (w) { return w.length > 1; }).join(' ');
}

/** Find the roster student a typed name belongs to. Returns {s, how} or null. */
function matchName_(typed, typedCls, roster) {
  var t = norm_(typed), T = t.split(' ');
  if (!t) return null;
  function lastOK(s) {
    var l = norm_(s.last);
    if (!l) return false;
    if (T.indexOf(l) >= 0 || (' ' + t + ' ').indexOf(' ' + l.replace(/-/g, ' ') + ' ') >= 0) return true;
    return l.indexOf('-') > 0 && l.split('-').some(function (p) { return T.indexOf(p) >= 0; });
  }
  function firstOK(s) {
    var f = norm_(s.first);
    return !!f && (T.indexOf(f.split(' ')[0]) >= 0 || (' ' + t + ' ').indexOf(' ' + f + ' ') >= 0);
  }
  var alias = roster.filter(function (s) { return s.aliases.indexOf(t) >= 0; });
  if (alias.length === 1) return { s: alias[0], how: 'alias' };
  var exact = roster.filter(function (s) { return firstOK(s) && lastOK(s); });
  if (exact.length > 1) exact = exact.filter(function (s) { return s.cls === typedCls; });
  if (exact.length === 1) return { s: exact[0], how: 'exact' };
  // same class + same last name + same first letter, and only one such student → match, but flag it
  var near = roster.filter(function (s) { return s.cls === typedCls && lastOK(s) && norm_(s.first).charAt(0) === T[0].charAt(0); });
  if (near.length === 1) return { s: near[0], how: 'check' };
  return null;
}

function gradebookRoster_(ss, roster, subs, resp) {
  var benches = [];
  subs.forEach(function (r) { var b = baseBench_(r[2]); if (b && benches.indexOf(b) < 0) benches.push(b); });

  // match every typed name once
  var M = {}, unmatched = {}, flagged = {};
  subs.forEach(function (r) {
    if (r[1] in M) return;
    var m = matchName_(r[1], String(r[9] || ''), roster);
    M[r[1]] = m;
  });

  // collect submissions per roster student + benchmark
  var K = function (id, b) { return id + '\u0001' + b; };
  var G = {};
  subs.forEach(function (r) {
    var m = M[r[1]];
    if (!m) {
      var u = unmatched[r[1] + '\u0001' + r[2]] = unmatched[r[1] + '\u0001' + r[2]] || { name: r[1], cls: r[9], bench: r[2], n: {}, when: r[0] };
      u.n[r[3]] = 1; if (r[0] > u.when) u.when = r[0];
      return;
    }
    if (m.how === 'check') flagged[r[1]] = m.s;
    var bb = baseBench_(r[2]);
    var g = G[K(m.s.id, bb)] = G[K(m.s.id, bb)] || { best: 0, latest: null, tries: {}, typed: {}, v2: false };
    if (bb !== r[2]) g.v2 = true;
    var pct = Number(r[6]) || 0;
    g.best = Math.max(g.best, pct);
    g.tries[r[1] + '#' + r[2] + '#' + r[3]] = 1;
    g.typed[r[1]] = 1;
    if (!g.latest || r[0] >= g.latest.when) g.latest = { when: r[0], pct: pct, name: r[1], bench: r[2], attempt: Number(r[3]) || 0 };
  });

  // % by standard on each student's latest attempt
  var stdSet = {}, latestStd = {};
  resp.forEach(function (r) {
    var m = M[r[1]]; if (!m || !r[5]) return;
    var bb = baseBench_(r[2]), g = G[K(m.s.id, bb)];
    if (!g || g.latest.name !== r[1] || g.latest.bench !== r[2] || g.latest.attempt !== Number(r[3])) return;
    stdSet[r[5]] = 1;
    var o = latestStd[K(m.s.id, bb)] = latestStd[K(m.s.id, bb)] || {};
    var b = o[r[5]] = o[r[5]] || { r: 0, n: 0 }; b.r += Number(r[8]) || 0; b.n++;
  });
  var stds = Object.keys(stdSet).sort();
  var head = ['Class', 'Last name', 'First name', 'Student #', 'Benchmark', 'Status', 'Best %', 'Latest %', 'Attempts', 'Last submitted']
    .concat(stds.map(function (s) { return s + ' %'; })).concat(['Name typed']);

  var students = roster.slice().sort(function (a, b) {
    var ca = clsOrder_(a.cls), cb = clsOrder_(b.cls);
    if (ca !== cb) return ca - cb;
    var la = (a.last + ' ' + a.first).toLowerCase(), lb = (b.last + ' ' + b.first).toLowerCase();
    return la < lb ? -1 : la > lb ? 1 : 0;
  });
  var rows = [];
  (benches.length ? benches : ['']).forEach(function (bench) {
    students.forEach(function (s) {
      var g = G[K(s.id, bench)], m = latestStd[K(s.id, bench)] || {};
      if (!g) {
        rows.push([s.cls, s.last, s.first, s.num, bench, bench ? 'Not submitted' : 'No benchmarks yet', '', '', 0, '']
          .concat(stds.map(function () { return ''; })).concat(['']));
        return;
      }
      var typed = Object.keys(g.typed), check = typed.some(function (t) { return flagged[t]; });
      var status = (g.v2 ? 'Done (Version 2)' : 'Done') + (check ? ' — check name' : '');
      rows.push([s.cls, s.last, s.first, s.num, bench, status, g.best, g.latest.pct,
        Object.keys(g.tries).length, g.latest.when]
        .concat(stds.map(function (st) { return m[st] ? Math.round(100 * m[st].r / m[st].n) / 100 : ''; }))
        .concat([typed.join(', ')]));
    });
  });

  writeGrades_(ss, GRADE_TAB, head, rows, stds.length);
  CLASSES.forEach(function (c) {
    writeGrades_(ss, c, head, rows.filter(function (r) { return r[0] === c; }), stds.length);
  });

  // Class Summary
  var sumHead = ['Class', 'Benchmark', 'On roster', 'Submitted', 'Not submitted yet', 'Class average (best %)', 'Class average (latest %)']
    .concat(stds.map(function (s) { return s + ' avg %'; }));
  var sum = [];
  benches.forEach(function (bench) {
    CLASSES.forEach(function (c) {
      var mine = rows.filter(function (r) { return r[0] === c && r[4] === bench; });
      if (!mine.length) return;
      var done = mine.filter(function (r) { return r[5] !== 'Not submitted'; });
      var avg = function (j) { var v = done.map(function (r) { return r[j]; }).filter(function (x) { return x !== ''; }); return v.length ? Math.round(100 * v.reduce(function (a, b) { return a + b; }, 0) / v.length) / 100 : ''; };
      var missing = mine.filter(function (r) { return r[5] === 'Not submitted'; }).map(function (r) { return r[2] + ' ' + r[1]; });
      sum.push([c, bench, mine.length, done.length, missing.join(', '), avg(6), avg(7)].concat(stds.map(function (s, k) { return avg(10 + k); })));
    });
  });
  var sh = ss.getSheetByName(SUMMARY_TAB) || ss.insertSheet(SUMMARY_TAB);
  sh.clear();
  write_(sh, sumHead, sum);
  if (sum.length) {
    sh.getRange(2, 6, sum.length, 2 + stds.length).setNumberFormat('0%');
    sh.getRange(2, 1, sum.length, sumHead.length).setBackgrounds(sum.map(function (r) {
      return r.map(function (v, j) { return j >= 5 && v !== '' ? pctColor_(v) : null; });
    }));
    sh.getRange(2, 5, sum.length, 1).setWrap(true);
    sh.setColumnWidth(5, 320);
  }

  // Check Names
  var chHead = ['Name typed', 'Class picked', 'Benchmark', 'Attempts', 'Last submitted', 'What happened', 'How to fix'];
  var ch = Object.keys(unmatched).map(function (k) {
    var u = unmatched[k];
    return [u.name, u.cls, u.bench, Object.keys(u.n).length, u.when, 'No match on the Roster. Not in the Gradebook yet.',
      'On the Roster tab, type "' + u.name + '" in "Other names" next to the right student. Then run refreshReports.'];
  });
  Object.keys(flagged).forEach(function (t) {
    var s = flagged[t];
    ch.push([t, s.cls, '', '', '', 'Matched to ' + s.first + ' ' + s.last + ' (same class, last name and first letter).',
      'If that is right, nothing to do. If not, add "' + t + '" in "Other names" next to the right student.']);
  });
  var cs = ss.getSheetByName(CHECK_TAB) || ss.insertSheet(CHECK_TAB);
  cs.clear();
  write_(cs, chHead, ch);
  if (ch.length) { cs.getRange(2, 5, ch.length, 1).setNumberFormat('m/d/yyyy h:mm'); cs.getRange(2, 6, ch.length, 2).setWrap(true); }
  cs.setColumnWidth(6, 300); cs.setColumnWidth(7, 380);
}

function writeGrades_(ss, name, head, rows, nStd) {
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  sh.clear();
  write_(sh, head, rows);
  sh.setFrozenColumns(3);
  if (!rows.length) return;
  sh.getRange(2, 7, rows.length, 2).setNumberFormat('0%');
  if (nStd) sh.getRange(2, 11, rows.length, nStd).setNumberFormat('0%');
  sh.getRange(2, 10, rows.length, 1).setNumberFormat('m/d/yyyy h:mm');
  sh.getRange(2, 1, rows.length, head.length).setBackgrounds(rows.map(function (r) {
    var none = r[5] === 'Not submitted';
    return r.map(function (v, j) {
      if (none) return '#F1F2F5';
      if (j === 5 && /check name/.test(r[5])) return '#FFF4CC';
      if ((j === 6 || j === 7 || (j >= 10 && j < 10 + nStd)) && v !== '') return pctColor_(v);
      return null;
    });
  }));
}

/** "X — Version 2" counts toward the same benchmark X in the Gradebook and Class Summary. */
function baseBench_(b) { return String(b || '').replace(/\s*[—–-]\s*Version 2\s*$/i, ''); }

function pctColor_(v) { return v >= 0.8 ? '#DCF2E3' : v >= 0.6 ? '#FFF4CC' : '#FADBD8'; }

function writeReadMe_(ss) {
  var sh = ss.getSheetByName(README_TAB) || ss.insertSheet(README_TAB);
  sh.clear();
  var lines = [
    ["Mr. Allen's Benchmark Tracker"],
    ['Results from the interactive benchmark reviews on the class website. Only benchmarks come here.'],
    [''],
    ['Roster — your class lists (A1, A2, A4, B5, B6). One row per student: Class, Last name, First name, Student #, and other names they might type. Student names stay in this private Sheet, never on the website.'],
    ['Gradebook — every student on the Roster, for every benchmark, grouped by class. Status says Done, Done (Version 2), or Not submitted (gray). Version 2 of a review counts toward the same benchmark. Best % and Latest % are out of 100. The NC standard columns show the % right on that standard in the latest attempt. Green = 80% or more, yellow = 60–79%, red = below 60%. "Name typed" shows what the student typed.'],
    ['A1, A2, A4, B5, B6 — the same Gradebook, one tab per class.'],
    ['Class Summary — for each class and benchmark: how many submitted, who has not submitted yet, the class average, and the class average on each standard.'],
    ['Check Names — any submission whose typed name did not match the Roster. Type that name in the Roster\'s "Other names" column next to the right student, then run refreshReports. It also lists close matches to double-check.'],
    ['Submissions — one row every time a student taps Submit. Attempt 1 is the first try. Each new try counts as a new attempt.'],
    ['Responses — every question a student answered: what they typed or chose, and whether it was right (1) or not (0).'],
    ['Question Analysis — first attempts only. % right on each question and the most common wrong answer, so you can see what to reteach.'],
    [''],
    ['Gradebook and Question Analysis rebuild every time a student submits. To rebuild by hand, run refreshReports in the script editor.'],
    ['Names are matched to the Roster by first and last name (middle names and initials are ignored). Download everything for Excel: File → Download → Microsoft Excel (.xlsx). Every tab comes along.']
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
