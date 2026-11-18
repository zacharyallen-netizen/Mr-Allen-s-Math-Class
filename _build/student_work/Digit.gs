/**
 * ═══════════════════════════════════════════════════════════════════════
 *  Mr. Allen's Math Class — "Ask Digit" (Nov 18, 2026)
 *
 *  A page where a student signs in with their SCHOOL Google account and Digit (the class robot) looks at THEIR
 *  OWN work on the Student Work and Pre-Tests sheets and the Arcade sheet, then suggests what to work on next.
 *
 *  PRIVACY / SECURITY
 *    • The student is found ONLY from the signed-in school account (Session.getActiveUser). The page never takes a
 *      name or email from the link, so nobody can look up another student by changing the address.
 *    • The email is matched to a name on the "Student Folders" tab (Email column) of the Student Work sheet, or,
 *      if it is not there, to a Roster name that is spelled the same as the part before the @ (firstlast@…).
 *    • Only that student's rows are read into the page. No answers, no other names, nothing is written anywhere.
 *    • Teacher preview: when YOU (the script owner) open the page, add &student=First Last to see a student's page.
 *
 *  HOW TO TURN IT ON (one time)
 *    1. Open the Student Work script (the one with StudentWork.gs). Files  +  → Script → name it Digit → paste → Save.
 *    2. Paste the new StudentWork.gs too (its doGet now sends ?digit=1 here).
 *    3. Deploy → NEW deployment (not "Manage deployments"):  type Web app,
 *         Execute as:  Me        Who has access:  Anyone within <your school domain>
 *       Copy the Web app URL and send it to Claude (it goes on the website as the "Ask Digit" button).
 *       Leave the old deployment as it is: the website still posts work there.
 *    4. Test: open  <new URL>?digit=1  (you will see the teacher view), then  <new URL>?digit=1&student=First Last
 * ═══════════════════════════════════════════════════════════════════════
 */

var DIGIT_SITE = 'https://zacharyallen-netizen.github.io/Mr-Allen-s-Math-Class/grade8/';

/* Topics: what a question is about → where to practice it. std = NC standard codes (without "NC.8."). hw = Targeted
   Practice numbers. Pages are on the website (grade8/…). */
var DIGIT_TOPICS = [
  { k: 'rn', name: 'Real numbers and square roots', u: 1, std: ['NS.1', 'NS.2', 'EE.2'], hw: /^(1\.\d+|E\.1)$/,
    notes: 'unit1-notes.html', game: ['root-rocket.html', 'Root Rocket'] },
  { k: 'ex', name: 'Exponent rules', u: 2, std: ['EE.1'], hw: /^2\.[1-5]$/,
    notes: 'unit2-notes-exponents.html', game: null },
  { k: 'sn', name: 'Scientific notation', u: 2, std: ['EE.3', 'EE.4'], hw: /^(2\.[6-9]|E\.2)$/,
    notes: 'unit2-notes-sci-notation.html', game: null },
  { k: 'eq', name: 'Solving equations', u: 3, std: ['EE.7'], hw: /^(3\.[1-69]|3\.10|E\.3)$/,
    notes: 'unit3-notes.html', game: ['equation_master.html', 'Equation Master'] },
  { k: 'iq', name: 'Inequalities and number of solutions', u: 3, std: [], hw: /^3\.[78]$/,
    notes: 'unit3-notes.html', game: ['equation_master.html', 'Equation Master (Inequalities level)'] },
  { k: 'an', name: 'Angles and parallel lines', u: 4, std: ['G.5'], hw: /^(4\.\d+|E\.5)$/,
    notes: 'unit4-notes.html', game: ['laser-vault.html', 'Laser Vault'] },
  { k: 'py', name: 'The Pythagorean Theorem', u: 5, std: ['G.6', 'G.7', 'G.8'], hw: /^5\.\d+$/,
    notes: 'unit5-notes.html', game: ['drone_shortcut.html', 'Drone Shortcut'] },
  { k: 'fn', name: 'Functions', u: 6, std: ['F.1', 'F.2', 'F.5'], hw: /^6\.[1-3]$/,
    notes: 'unit6-notes.html', game: null },
  { k: 'sl', name: 'Slope and lines', u: 6, std: ['F.3', 'F.4'], hw: /^(6\.([4-9]|10|11|13)|E\.4)$/,
    notes: 'unit6-notes-slope-intercept.html', game: null },
  { k: 'sy', name: 'Systems of equations', u: 6, std: ['EE.8'], hw: /^6\.12$/,
    notes: 'unit6-notes-tables-systems.html', game: null },
  { k: 'st', name: 'Scatter plots and two-way tables', u: 7, std: ['SP.1', 'SP.2', 'SP.3', 'SP.4'], hw: /^(7\.\d+|E\.[67])$/,
    notes: 'unit7-notes.html', game: null },
  { k: 'tr', name: 'Transformations and dilations', u: 8, std: ['G.1', 'G.2', 'G.3', 'G.4'], hw: /^8\.\d+$/,
    notes: 'unit8-notes.html', game: ['transformation-quest.html', 'Transformation Quest'] },
  { k: 'vo', name: 'Volume', u: 9, std: ['G.9'], hw: /^9\.\d+$/,
    notes: 'volume.html', game: null }
];
/* Targeted Practice list (number → title), from the PDFs in grade8/homework/. */
var DIGIT_TP = '1.1|Real_Number_System_Review;1.2|Number_Classification;1.3|Square_Roots;1.4|Converting_Numbers_Irrational_Numbers;1.5|Ordering_Numbers;1.6|Ordering_Mixed_Numbers;1.7|RNS_Review;1.8|RNS_Review_Unit_Assessment;2.1|Introduction_to_Exponents;2.2|Exponent_Rules_Multiplication_and_Division;2.3|Power_to_a_Power_Negative_and_Zero_Exponents;2.4|Advanced_Exponent_Rule_Problems;2.5|Exponent_Rules_Review;2.6|Scientific_Notation_Intro;2.7|Operations_with_Scientific_Notation;2.8|Scientific_Notation_Practice;2.9|Unit_2_Review;3.10|Unit_3_Review;3.1|One_and_Two_Step_Equations;3.2|One_and_Two_Step_Equations_Day_2;3.3|Distributive_Property_and_Variables_on_Both_Sides;3.4|Multi_Step_Equations_Day_2;3.5|Multi_Step_Equations_Day_3;3.6|Multi_Step_Equations_Day_4;3.7|Inequalities_and_Number_of_Solutions;3.8|Inequalities_Day_2_and_Number_of_Solutions_Day_2;3.9|Word_Problems;4.1|Angle_Review;4.2|Angle_Review_Day_2;4.3|Parallel_Lines_and_Transversals_Day_1;4.4|Parallel_Lines_and_Transversals_Day_2;4.5|Triangle_Angle_Relationships;4.6|Unit_4_Review;5.1|Pythagorean_Theorem_Intro;5.2|Pythagorean_Theorem_Day_2;5.3|Pythagorean_Theorem_Day_3;5.4|Distance_Between_Two_Points;5.5|Unit_5_Review;6.10|Standard_Form_and_Point_Slope_Form;6.11|Standard_and_Point_Slope_Day_2;6.12|Systems_of_Equations_Graphing;6.13|Unit_6_Review;6.1|Functions_Intro;6.2|Functions_Day_2;6.3|Functions_Day_3;6.4|Linear_Functions_and_Slope;6.5|Slope_Day_2;6.6|Slope_Intercept_Form;6.7|Slope_Intercept_Form_Day_2;6.8|Linear_Functions_from_Tables;6.9|Linear_Functions_from_Tables_Day_2;7.1|Scatter_Plots;7.2|Scatter_Plots_Day_2;7.3|Two_Way_Frequency_Tables;7.4|Two_Way_Tables_Day_2;7.5|Unit_7_Review;8.1|Transformations_Intro;8.2|Transformations_Day_2;8.3|Dilations_Intro;8.4|Dilations_Day_2;8.5|Dilations_Day_3;8.6|Dilations_Day_4;8.7|Unit_8_Review;9.1|Volume_of_Cylinders_Cones_Spheres_Intro;9.2|Volume_Day_2;9.3|Volume_Day_3;9.4|Unit_9_Review;E.1|EOG_Review_Real_Number_System_and_exponent_rules;E.2|EOG_Review_Scientific_notation_and_operations;E.3|EOG_Review_Equations_and_inequalities;E.4|EOG_Review_Functions_and_slope;E.5|EOG_Review_Geometry;E.6|EOG_Review_Statistics_and_cumulative_mixed_practice;E.7|EOG_Review_Statistics_and_cumulative_mixed_practice_Day_2';

var DIGIT_SVG = '<svg viewBox="0 0 200 300" aria-hidden="true"><ellipse cx="100" cy="288" rx="62" ry="9" fill="rgba(0,0,0,.3)"/><g class="dg-ant"><line x1="100" y1="58" x2="100" y2="22" stroke="#1E2D4F" stroke-width="5"/><circle cx="100" cy="18" r="10" fill="#ff4d6a"/></g><rect x="70" y="232" width="20" height="46" rx="9" fill="#1E2D4F"/><rect x="110" y="232" width="20" height="46" rx="9" fill="#1E2D4F"/><rect x="58" y="270" width="36" height="14" rx="7" fill="#E0A800"/><rect x="106" y="270" width="36" height="14" rx="7" fill="#E0A800"/><rect class="dg-arm dg-l" x="10" y="160" width="46" height="16" rx="8" fill="#E0A800" transform="rotate(30 50 168)"/><g class="dg-arm dg-r"><rect x="146" y="160" width="46" height="16" rx="8" fill="#E0A800"/><circle cx="194" cy="168" r="11" fill="#FFC107" stroke="#E0A800" stroke-width="3"/></g><rect x="40" y="56" width="120" height="186" rx="34" fill="#FFC107" stroke="#E0A800" stroke-width="4"/><rect x="54" y="74" width="92" height="74" rx="18" fill="#1E2D4F"/><g class="dg-eye"><ellipse cx="80" cy="104" rx="11" ry="13" fill="#fff"/><circle cx="82" cy="106" r="5.5" fill="#1E2D4F"/></g><g class="dg-eye"><ellipse cx="120" cy="104" rx="11" ry="13" fill="#fff"/><circle cx="122" cy="106" r="5.5" fill="#1E2D4F"/></g><ellipse class="dg-mouth" cx="100" cy="130" rx="13" ry="6" fill="#9ef7ff"/><circle cx="64" cy="128" r="6" fill="#ff8fa3" opacity=".7"/><circle cx="136" cy="128" r="6" fill="#ff8fa3" opacity=".7"/><rect x="66" y="166" width="68" height="44" rx="10" fill="#fff6d6" stroke="#E0A800" stroke-width="3"/><text x="100" y="197" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="24" font-weight="800" fill="#1E2D4F">+−×÷</text><g class="dg-sign"><rect x="128" y="20" width="62" height="62" rx="12" fill="#B42318"/><text x="159" y="68" text-anchor="middle" font-size="48" font-weight="900" fill="#fff" font-family="Inter">!</text></g><g class="dg-q"><text x="160" y="50" font-size="40" font-weight="900" fill="#FFC107" font-family="Inter">?</text><text x="182" y="22" font-size="26" font-weight="900" fill="#9ef7ff" font-family="Inter">?</text></g></svg>';

// ── entry (StudentWork.gs doGet: if (p.digit) return digitPage_(p);) ──
function digitPage_(p) {
  var html;
  try { html = digitHtml_(digitModel_(p || {})); }
  catch (err) { html = digitHtml_({ state: 'error', msg: String(err && err.message || err).slice(0, 200) }); }
  return HtmlService.createHtmlOutput(html).setTitle('Ask Digit — Mr. Allen\'s Math Class')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function digitModel_(p) {
  var email = '', owner = '';
  try { email = String(Session.getActiveUser().getEmail() || '').toLowerCase(); } catch (e) {}
  try { owner = String(Session.getEffectiveUser().getEmail() || '').toLowerCase(); } catch (e) {}
  if (!email) return { state: 'signin' };
  var unit = /^[1-9]$/.test(String(p.u || '')) ? Number(p.u) : 0;
  var teacher = owner && email === owner, name = null;
  if (teacher) {
    if (!p.student) return { state: 'teacher' };
    name = digitRosterName_(String(p.student));
    if (!name) return { state: 'teacher', msg: 'No student on the Roster tab matches "' + String(p.student).slice(0, 40) + '".' };
  } else {
    name = digitNameForEmail_(email);
    if (!name) return { state: 'unknown', email: email };
  }
  var key = 'digit:' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, name + '|' + unit));
  var cache = CacheService.getScriptCache(), hit = cache.get(key);
  if (hit) { var m = JSON.parse(hit); m.preview = teacher; return m; }
  var model = digitBuild_(name, unit);
  try { cache.put(key, JSON.stringify(model), 300); } catch (e) {}
  model.preview = teacher;
  return model;
}

// ── who is this? ──
function digitRoster_() {
  var out = [];                                                   // [{real, keys:{normName:1}}]
  var sh = SpreadsheetApp.openById(WORK_ID).getSheetByName('Roster'), n = sh ? sh.getLastRow() : 0;
  if (n > 1) sh.getRange(2, 1, n - 1, 3).getValues().forEach(function (r) {
    var real = String(r[0] || '').replace(/\s+/g, ' ').trim(); if (!real) return;
    var keys = {}; [real].concat(String(r[2] || '').split(',')).forEach(function (a) { var k = norm_(a); if (k.length >= 3) keys[k] = 1; });
    out.push({ real: real, keys: keys });
  });
  return out;
}
function digitRosterName_(typed) {
  var k = norm_(typed), ro = digitRoster_();
  for (var i = 0; i < ro.length; i++) if (ro[i].keys[k]) return ro[i].real;
  return null;
}
function digitNameForEmail_(email) {
  var ss = SpreadsheetApp.openById(WORK_ID), sh = ss.getSheetByName('Student Folders'), n = sh ? sh.getLastRow() : 0;
  if (n > 1) {
    var rows = sh.getRange(2, 1, n - 1, 3).getValues();
    for (var i = 0; i < rows.length; i++) if (String(rows[i][2] || '').trim().toLowerCase() === email) {
      return digitRosterName_(rows[i][0]) || String(rows[i][0]).replace(/\s+/g, ' ').trim();
    }
  }
  var local = norm_(email.split('@')[0]); if (local.length < 4) return null;   // firstlast@school.org
  var ro = digitRoster_();
  for (var j = 0; j < ro.length; j++) if (norm_(ro[j].real) === local) return ro[j].real;
  return null;
}

// ── read only this student's rows and decide what to suggest ──
function digitBuild_(real, unit) {
  var ro = digitRoster_(), keys = {}; keys[norm_(real)] = 1;
  ro.forEach(function (r) { if (r.real === real) for (var k in r.keys) keys[k] = 1; });
  function mine(v) { return keys[norm_(v)] === 1; }
  function rows(id, tab, cols) {
    try { var sh = SpreadsheetApp.openById(id).getSheetByName(tab), n = sh ? sh.getLastRow() : 0;
          return n > 1 ? sh.getRange(2, 1, n - 1, cols).getValues().filter(function (r) { return mine(r[1]); }) : []; }
    catch (e) { return []; }
  }
  var now = new Date(), day = 864e5;
  var wk = new Date(now.getFullYear(), now.getMonth(), now.getDate()); wk.setDate(wk.getDate() - ((wk.getDay() + 6) % 7));
  function when(v) { var d = v instanceof Date ? v : new Date(v); return isNaN(d) ? null : d; }
  function topicOf(std, page) {
    var s = String(std || '').match(/(NS|EE|F|G|SP)\.(\d)/), m = String(page || '').match(/\b(\d|E)\.(\d{1,2})\b/);
    var hw = m ? m[1] + '.' + m[2] : '';
    if (/inequalit|how many solutions|number of solutions/i.test(page)) return 'iq';
    for (var i = 0; i < DIGIT_TOPICS.length; i++) {
      var t = DIGIT_TOPICS[i];
      if (s && t.std.indexOf(s[1] + '.' + s[2]) >= 0) return t.k;
      if (!s && hw && t.hw.test(hw)) return t.k;
    }
    var u = String(page || '').match(/Unit\s*(\d)/i);
    if (u) for (var j = 0; j < DIGIT_TOPICS.length; j++) if (DIGIT_TOPICS[j].u === Number(u[1])) return DIGIT_TOPICS[j].k;
    return null;
  }
  var T = {}; DIGIT_TOPICS.forEach(function (t) { T[t.k] = { n: 0, r: 0, rn: 0, rr: 0, last: 0 }; });
  var week = { n: 0, r: 0, mins: 0, plays: 0 }, total = 0, firstSeen = null;
  function addQ(r) {                                              // Responses: time,name,period,source,unit,page,question,std,band,first,final,tries
    if (/^M1\b|Math 1/.test(String(r[3]) + ' ' + String(r[4]))) return;
    var d = when(r[0]); if (!d) return;
    var k = topicOf(r[7], r[5]); var ok = Number(r[9]) === 1 ? 1 : 0;
    total++; if (!firstSeen || d < firstSeen) firstSeen = d;
    if (d >= wk) { week.n++; week.r += ok; }
    if (!k) return;
    var t = T[k], recent = now - d < 21 * day;
    t.n++; t.r += ok; if (recent) { t.rn++; t.rr += ok; } if (d > t.last) t.last = +d;
  }
  rows(WORK_ID, 'Responses', 12).forEach(addQ);
  rows(PRETEST_ID, 'Responses', 12).forEach(addQ);
  var turned = {};
  rows(WORK_ID, 'Homework', 5).forEach(function (r) { var m = String(r[4]).match(/\b(\d|E)\.(\d{1,2})\b/); if (m) turned[m[1] + '.' + m[2]] = 1; });
  ['Notes Practice', 'Tutorials'].forEach(function (tab) {
    rows(WORK_ID, tab, 12).forEach(function (r) { var d = when(r[0]); if (d && d >= wk) week.mins += Math.min(60, Number(r[11]) || 0); });
  });
  rows(PRETEST_ID, 'Pre-Tests', 12).forEach(function (r) { var d = when(r[0]); if (d && d >= wk) week.mins += Math.min(60, Number(r[11]) || 0); });
  var arcade = {};
  rows(ARCADE_ID, 'Sessions', 7).forEach(function (r) {
    var d = when(r[0]); if (!d) return; arcade[String(r[3])] = (arcade[String(r[3])] || 0) + 1;
    if (d >= wk) { week.plays++; week.mins += Math.min(60, Number(r[5]) || 0); }
  });

  // score each topic: recent work counts double; need at least 4 answers to judge
  var list = DIGIT_TOPICS.map(function (t) {
    var s = T[t.k], n = s.n + s.rn, r = s.r + s.rr;
    return { k: t.k, name: t.name, u: t.u, n: s.n, pct: n ? r / n : null, last: s.last };
  });
  var judged = list.filter(function (x) { return x.n >= 4; });
  var work = judged.filter(function (x) { return x.pct < 0.7; })
    .sort(function (a, b) { return (b.u === unit) - (a.u === unit) || a.pct - b.pct; }).slice(0, 3);
  var strong = judged.filter(function (x) { return x.pct >= 0.8; })
    .sort(function (a, b) { return b.pct - a.pct || b.n - a.n; }).slice(0, 3);

  // Targeted Practice in this unit not turned in yet (in order)
  var todo = [];
  if (unit) DIGIT_TP.split(';').forEach(function (s) {
    var p = s.split('|'); if (!p[1] || p[0].split('.')[0] !== String(unit) || turned[p[0]]) return;
    todo.push({ id: p[0], title: p[1] });
  });
  todo.sort(function (a, b) { return Number(a.id.split('.')[1]) - Number(b.id.split('.')[1]); });

  var first = real.split(' ')[0];
  return { state: 'ok', first: first, unit: unit, total: total, since: firstSeen ? firstSeen.toISOString() : '',
           week: { n: week.n, pct: week.n ? Math.round(100 * week.r / week.n) : null, mins: Math.round(week.mins), plays: week.plays },
           work: work.map(function (x) { return { k: x.k, pct: Math.round(100 * x.pct), n: x.n }; }),
           strong: strong.map(function (x) { return { k: x.k, pct: Math.round(100 * x.pct), n: x.n }; }),
           todo: todo.slice(0, 3), todoLeft: todo.length,
           updated: now.toISOString() };
}

// ── the page ──
function digitEsc_(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function digitTopic_(k) { for (var i = 0; i < DIGIT_TOPICS.length; i++) if (DIGIT_TOPICS[i].k === k) return DIGIT_TOPICS[i]; return null; }
function digitA_(path, text, cls) {
  return '<a class="' + (cls || 'go') + '" target="_blank" rel="noopener" href="' + digitEsc_(/^https?:/.test(path) ? path : DIGIT_SITE + path) + '">' + digitEsc_(text) + '</a>';
}
function digitHtml_(m) {
  var say = [], body = '';
  if (m.state === 'signin') {
    say = ['Hi! I am Digit.', 'Sign in with your school Google account, then open this page again.'];
  } else if (m.state === 'unknown') {
    say = ['Hi! I am Digit.', 'I could not find your name on Mr. Allen\'s class list for ' + m.email + '.', 'Ask Mr. Allen to check your school email on his list.'];
  } else if (m.state === 'teacher') {
    say = ['Hi, Mr. Allen!', m.msg || 'This is the teacher view.', 'Add &student=First Last to the address to see what a student sees.'];
  } else if (m.state === 'error') {
    say = ['Oops. Something went wrong on my end.', 'Try again in a minute. (' + m.msg + ')'];
  } else {
    var w = m.week;
    if (!m.total) {
      say = ['Hi ' + m.first + '! I am Digit.', 'I do not see any work from you yet.', 'Start with your notes and Targeted Practice. Press Send my work when you finish, and I can help more!'];
    } else {
      say = ['Hi ' + m.first + '! I looked at your work.'];
      if (w.n) say.push('This week you answered ' + w.n + ' question' + (w.n === 1 ? '' : 's') + (w.pct != null ? ' and got ' + w.pct + '% right on the first try.' : '.'));
      else say.push('I do not see work from you this week yet. Let\'s get started!');
      if (m.strong.length) say.push('You are strong in ' + digitTopic_(m.strong[0].k).name.toLowerCase() + '. Nice work!');
      if (m.work.length) say.push('Here is what I think will help you most.');
      else say.push('Nothing is below 70% right now. Keep it up and try some Score 5 problems!');
    }
    if (m.preview) say.unshift('(Teacher preview)');
    var cards = '';
    m.work.forEach(function (x, i) {
      var t = digitTopic_(x.k); if (!t) return;
      var steps = '<li>' + digitA_(t.notes, 'Review the notes') + '</li>' +
        '<li>' + digitA_('skill-builders-unit' + Math.min(8, t.u) + '.html', 'Watch a Skill Builder lesson') + (t.u === 9 ? '' : '') + '</li>' +
        '<li>' + digitA_('skill-builders-unit' + Math.min(8, t.u) + '-practice.html', 'Do the Skill Builder practice') + '</li>' +
        (t.game ? '<li>' + digitA_(t.game[0], 'Play ' + t.game[1]) + '</li>' : '');
      if (t.u === 9) steps = '<li>' + digitA_(t.notes, 'Review the notes') + '</li><li>' + digitA_('unit9.html', 'Go to Unit 9 practice') + '</li>';
      cards += '<div class="card ' + (i ? '' : 'top') + '"><div class="lab">' + (i ? 'Next' : 'Start here') + '</div>' +
        '<h2>' + digitEsc_(t.name) + '</h2><p class="pct"><b>' + x.pct + '%</b> right on the first try (' + x.n + ' answers)</p>' +
        '<ol>' + steps + '</ol></div>';
    });
    if (m.todo.length) {
      cards += '<div class="card"><div class="lab">Unit ' + m.unit + '</div><h2>Targeted Practice to turn in</h2><ul>' +
        m.todo.map(function (t) { return '<li>' + digitA_('homework_turn_in.html?hw=' + encodeURIComponent(t.id), 'Targeted Practice ' + t.id + ' — ' + t.title.replace(/_/g, ' ')) + '</li>'; }).join('') +
        '</ul>' + (m.todoLeft > m.todo.length ? '<p class="small">+ ' + (m.todoLeft - m.todo.length) + ' more in Unit ' + m.unit + '.</p>' : '') + '</div>';
    }
    if (m.strong.length) {
      cards += '<div class="card good"><div class="lab">You are good at</div><ul>' +
        m.strong.map(function (x) { return '<li><b>' + digitEsc_(digitTopic_(x.k).name) + '</b> · ' + x.pct + '%</li>'; }).join('') + '</ul></div>';
    }
    if (m.total) {
      cards += '<div class="stats"><div><b>' + w.n + '</b><span>questions this week</span></div>' +
        '<div><b>' + (w.pct == null ? '–' : w.pct + '%') + '</b><span>right on first try</span></div>' +
        '<div><b>' + w.mins + '</b><span>minutes working</span></div>' +
        '<div><b>' + w.plays + '</b><span>Arcade games</span></div></div>';
    }
    body = cards + '<p class="small">Digit only sees your own work. It updates about every 5 minutes. ' +
      digitA_('index.html', 'Back to the class website', 'plain') + '</p>';
  }
  var bubble = say.map(function (s) { return '<p>' + digitEsc_(s) + '</p>'; }).join('');
  return '<!DOCTYPE html><html><head><meta charset="utf-8"><base target="_blank">' +
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Source+Serif+4:wght@700&display=swap" rel="stylesheet">' +
    '<style>' +
    'body{margin:0;background:#F7F7F4;color:#1E2D4F;font:17px/1.5 Inter,system-ui,sans-serif}' +
    '.top{max-width:860px;margin:0 auto;padding:18px 16px 40px}' +
    'header.bar{background:#1E2D4F;color:#fff;padding:10px 16px;font:700 18px "Source Serif 4",Georgia,serif}header.bar span{color:#FFC107}' +
    '.hello{display:flex;gap:14px;align-items:flex-end;margin:10px 0 18px}.bot{width:110px;flex:0 0 110px}.bot .dg-sign,.bot .dg-q{display:none}' +
    '.bot svg{width:100%;height:auto;animation:bob 3s ease-in-out infinite}@keyframes bob{50%{transform:translateY(-6px)}}' +
    '@media (prefers-reduced-motion:reduce){.bot svg{animation:none}}' +
    '.say{position:relative;background:#fff;border:2px solid #1E2D4F;border-radius:16px;padding:12px 16px;flex:1}.say p{margin:.2em 0}.say p:first-child{font-weight:800;font-size:19px}' +
    '.say:before{content:"";position:absolute;left:-12px;bottom:22px;border:10px solid transparent;border-right-color:#1E2D4F;border-left:0}' +
    '.card{background:#fff;border:1px solid #d9dce3;border-radius:14px;padding:14px 18px;margin:12px 0;box-shadow:0 2px 6px rgba(30,45,79,.06)}' +
    '.card.top{border:2px solid #E0A800}.card.good{border-left:6px solid #2e8540}' +
    '.lab{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#8a6d00}' +
    'h2{font:700 22px "Source Serif 4",Georgia,serif;margin:2px 0 4px}.pct{margin:0 0 6px;color:#44506b}.pct b{font-family:"JetBrains Mono",monospace}' +
    'ol,ul{margin:6px 0;padding-left:22px}li{margin:6px 0}' +
    'a.go{display:inline-block;background:#1E2D4F;color:#fff;text-decoration:none;font-weight:600;padding:7px 14px;border-radius:9px}a.go:hover,a.go:focus{background:#E0A800;color:#1E2D4F}' +
    'a.plain{color:#1E2D4F}.small{font-size:14px;color:#5a6378}' +
    '.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:14px 0}.stats div{background:#1E2D4F;color:#fff;border-radius:12px;padding:10px;text-align:center}' +
    '.stats b{display:block;font:800 24px "JetBrains Mono",monospace;color:#FFC107}.stats span{font-size:13px}' +
    '@media (max-width:560px){.stats{grid-template-columns:repeat(2,1fr)}.bot{width:80px;flex-basis:80px}}' +
    '</style></head><body><header class="bar">Mr. Allen\'s Math Class · <span>Ask Digit</span></header><main class="top">' +
    '<div class="hello"><div class="bot">' + DIGIT_SVG + '</div><div class="say" role="status">' + bubble + '</div></div>' +
    body + '</main></body></html>';
}
