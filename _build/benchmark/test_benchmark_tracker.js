// Test BenchmarkTracker.gs against the strict Google Sheets stand-in used for the Score Tracker.
const { load } = require('../tracker/mockgas');
const assert = (c, m) => { if (!c) { console.error('FAIL:', m); process.exitCode = 1; } else console.log('ok  ', m); };
const G = load(__dirname + '/BenchmarkTracker.gs');
const post = d => JSON.parse(G.doPost({ postData: { contents: JSON.stringify(d) } }).s);

G.setup(); G.setup();
const ss = Object.values(G.__books)[0];
['Gradebook', 'Submissions', 'Responses', 'Question Analysis', 'Read Me'].forEach(t => assert(!!ss.getSheetByName(t), 'tab exists: ' + t));
assert(!ss.getSheetByName('Sheet1'), 'Sheet1 removed');
assert(Object.keys(G.__books).length === 1, 'setup twice makes one Sheet');

const base = { code: 'allen-8th-benchmark', kind: 'benchmark', benchmark: 'Q1 Benchmark Review' };
const items = (oks, ans) => oks.map((ok, i) => ({ id: String(i + 1), std: i < 4 ? 'NC.8.NS.' + (i < 2 ? 1 : 2) : 'NC.8.EE.1', label: 'Q' + (i + 1), answer: ans ? ans[i] : 'x', ok }));

assert(!post({ ...base, code: 'nope', name: 'A B', items: items([1]) }).ok, 'wrong code rejected');
assert(!post({ ...base, kind: 'practice', name: 'A B', items: items([1]) }).ok, 'wrong kind rejected');
assert(!post({ ...base, name: 'Ann', items: items([1]) }).ok, 'one-word name rejected');
assert(!post({ ...base, name: 'Ann Lee', items: [] }).ok, 'no answers rejected');

let r = post({ ...base, name: 'maria lopez', period: 'b5', session: 's1', items: items([1, 1, 0, 1, 1, 0], ['B, E', 'I,R,I,R', '7.5', 'ok', '-15x^7y^3', '=HYPERLINK("x")']) });
assert(r.ok && r.name === 'Maria Lopez' && r.score === 4 && r.total === 6 && r.attempt === 1, 'first submission accepted, attempt 1');
r = post({ ...base, name: 'Maria Lopez', session: 's1', items: items([1, 1, 1, 1, 1, 0]) });
assert(r.ok && r.attempt === 1, 'same session resent stays attempt 1');
r = post({ ...base, name: 'Maria Lopez', period: 'B5', session: 's2', items: items([1, 1, 1, 1, 1, 1]) });
assert(r.ok && r.attempt === 2, 'new session is attempt 2');
r = post({ ...base, name: 'Ben Ortiz', period: 'A2', session: 's9', items: items([0, 1, 0, 0, 1, 1], ['B', 'I,I,I,R', '7.5', 'x', 'y', 'z']) });
assert(r.ok, 'second student');

const resp = ss.getSheetByName('Responses').data;
assert(resp.some(row => String(row[7]).startsWith("'=HYPERLINK")), 'formula-looking answer is made safe');
const gb = ss.getSheetByName('Gradebook').data;
console.log(gb.map(r => r.join(' | ')).join('\n'));
const maria = gb.find(row => row[1] === 'Maria Lopez');
assert(maria && maria[0] === 'B5' && maria[3] === 1 && maria[4] === 1 && maria[5] === 2, 'Maria B5, best 100%, latest 100%, 2 attempts');
assert(gb[1][1] === 'Ben Ortiz' && gb[1][0] === 'A2', 'grouped by class: A2 (Ortiz) before B5 (Lopez)');
const qa = ss.getSheetByName('Question Analysis').data;
console.log(qa.map(r => r.join(' | ')).join('\n'));
const q3 = qa.find(row => row[1] === '3');
assert(q3 && q3[4] === 2 && q3[5] === 0.5 && /7\.5 \(1\)/.test(q3[6]), 'question analysis: first attempts, resend counted once, common wrong answer');
const subs = ss.getSheetByName('Submissions').data;
assert(subs.length === 5 && /NS\.1 2\/2/.test(subs[1][7]), 'submissions log with by-standard text');
G.refreshReports();
assert(ss.getSheetByName('Gradebook').data.length === gb.length, 'refreshReports rebuilds the same');

assert(ss.getSheetByName('Submissions').data[1][9] === 'B5' && ss.getSheetByName('Responses').data[1][9] === 'B5', 'class saved on Submissions and Responses');
r = post({ ...base, name: 'Cal Ruiz', period: 'Z9', session: 'z', items: items([1]) });
assert(r.ok && ss.getSheetByName('Submissions').data.slice(-1)[0][9] === '', 'unknown class saved blank, still accepted');
// an older Sheet made before the Class column existed gets the new header
const G2 = load(__dirname + '/BenchmarkTracker.gs'); G2.setup();
const ss2 = Object.values(G2.__books)[0]; const sub2 = ss2.getSheetByName('Submissions');
sub2.data[0] = sub2.data[0].slice(0, 9); sub2.data[0][9] = '';
const r2 = JSON.parse(G2.doPost({ postData: { contents: JSON.stringify({ ...base, name: 'Ann Lee', period: 'A4', session: 'q', items: items([1, 0]) }) } }).s);
assert(r2.ok && sub2.data[0][9] === 'Class' && sub2.data[1][9] === 'A4', 'old Sheet header upgraded with Class');

// ── Roster: made-up names only (real names live in Mr. Allen's private Sheet, never in this repo)
{
  const G3 = load(__dirname + '/BenchmarkTracker.gs'); G3.setup();
  const s3 = Object.values(G3.__books)[0];
  assert(!!s3.getSheetByName('Roster'), 'setup makes a Roster tab');
  s3.getSheetByName('Roster').getRange(2, 1, 6, 5).setValues([
    ['A1', 'Rivera', 'Ana Sofia', '111', ''], ['A1', 'Rivera', 'Mateo', '112', ''], ['A2', 'Lopez-Grant', 'Maya', '113', ''],
    ['B6', 'Stone', 'Kristopher', '114', 'Kit Stone'], ['B5', 'Ng', 'Leo', '115', ''], ['8A', 'Old', 'Class', '116', '']]);
  const p3 = (name, period, ses, oks) => JSON.parse(G3.doPost({ postData: { contents: JSON.stringify({ ...base, name, period, session: ses, items: items(oks) }) } }).s);
  p3('ana rivera', 'A1', 'r1', [1, 1, 0]); p3('Ana Sofia Rivera', 'A1', 'r2', [1, 1, 1]);
  p3('Maya Lopez', 'A2', 'r3', [1, 0, 0]); p3('Kit Stone', 'B6', 'r4', [0, 1, 1]);
  p3('Leonard Ng', 'B5', 'r5', [1, 1, 1]); p3('Zed Nobody', 'A1', 'r6', [1, 1, 1]);
  const gb3 = s3.getSheetByName('Gradebook').data;
  const row = (l, f) => gb3.find(r => r[1] === l && r[2] === f);
  assert(gb3.length === 1 + 5, 'Gradebook lists every rostered student (8A row ignored)');
  assert(row('Rivera', 'Ana Sofia')[5] === 'Done' && row('Rivera', 'Ana Sofia')[8] === 2 && row('Rivera', 'Ana Sofia')[6] === 1, 'two spellings combine into one student, 2 attempts, best 100%');
  assert(row('Rivera', 'Mateo')[5] === 'Not submitted', 'sibling not mixed up');
  assert(row('Lopez-Grant', 'Maya')[5] === 'Done', 'hyphenated last name matched from one part');
  assert(row('Stone', 'Kristopher')[5] === 'Done', 'nickname matched through Other names');
  assert(row('Ng', 'Leo')[5] === 'Done — check name', 'close match flagged to check');
  const chk = s3.getSheetByName('Check Names').data;
  assert(chk.some(r => r[0] === 'Zed Nobody') && chk.some(r => r[0] === 'Leonard Ng'), 'Check Names lists unmatched and close matches');
  assert(s3.getSheetByName('A1').data.length === 3 && s3.getSheetByName('B6').data.length === 2, 'one tab per class');
  const sum = s3.getSheetByName('Class Summary').data;
  assert(sum.some(r => r[0] === 'A1' && r[2] === 2 && r[3] === 1 && /Mateo Rivera/.test(r[4])), 'Class Summary counts and lists who is missing');
}

// ── Version 2 counts toward the same benchmark
{
  const G4 = load(__dirname + '/BenchmarkTracker.gs'); G4.setup();
  const s4 = Object.values(G4.__books)[0];
  s4.getSheetByName('Roster').getRange(2, 1, 2, 5).setValues([['A1', 'Rivera', 'Ana', '1', ''], ['A1', 'Park', 'Jun', '2', '']]);
  const p4 = (name, bench, ses, oks) => JSON.parse(G4.doPost({ postData: { contents: JSON.stringify({ ...base, benchmark: bench, name, period: 'A1', session: ses, items: items(oks) }) } }).s);
  p4('Ana Rivera', 'NC Check-In Benchmark Review', 'a', [1, 0]);
  p4('Jun Park', 'NC Check-In Benchmark Review — Version 2', 'b', [1, 1, 1, 0]);
  const gb4 = s4.getSheetByName('Gradebook').data;
  assert(gb4.length === 3 && gb4.every((r, i) => !i || r[4] === 'NC Check-In Benchmark Review'), 'Version 2 shares the benchmark row (no extra Not submitted rows)');
  const jun = gb4.find(r => r[1] === 'Park');
  assert(jun[5] === 'Done (Version 2)' && jun[6] === 0.75, 'Version 2 status and score');
  const qa4 = s4.getSheetByName('Question Analysis').data;
  assert(qa4.some(r => r[0] === 'NC Check-In Benchmark Review — Version 2'), 'Question Analysis keeps Version 2 questions separate');
}

// ── Time spent and the RUSHED flag
{
  const G5 = load(__dirname + '/BenchmarkTracker.gs'); G5.setup();
  const s5 = Object.values(G5.__books)[0];
  s5.getSheetByName('Roster').getRange(2, 1, 3, 5).setValues([['B5', 'Cruz', 'Eva', '1', ''], ['B5', 'Diaz', 'Omar', '2', ''], ['B5', 'Fox', 'Ivy', '3', '']]);
  const it = secs => secs.map((s, i) => ({ id: String(i + 1), std: 'NC.8.F.1', label: 'Q' + (i + 1), answer: 'A', ok: 1, secs: s }));
  const p5 = (name, ses, secs, test, study) => JSON.parse(G5.doPost({ postData: { contents: JSON.stringify({ ...base, name, period: 'B5', session: ses, items: it(secs), testSecs: test, studySecs: study }) } }).s);
  p5('Eva Cruz', 'e', [40, 55, 70, 35], 240, 300);       // careful
  p5('Omar Diaz', 'o', [3, 2, 4, 30], 45, 0);             // 3 of 4 quick
  p5('Ivy Fox', 'i', [12, 11, 13, 12], 48, 10);           // none quick, but 12 sec a question on average
  const gb5 = s5.getSheetByName('Gradebook').data, h = gb5[0];
  const r = l => gb5.find(x => x[1] === l), col = n => h.indexOf(n);
  assert(r('Cruz')[5] === 'Done' && r('Cruz')[col('Minutes on questions')] === 4 && r('Cruz')[col('Minutes on tips/notes')] === 5, 'minutes recorded (4 on questions, 5 on notes)');
  assert(r('Diaz')[5] === 'Done — RUSHED' && r('Diaz')[col('Quick answers (under 10 sec)')] === '3 of 4', 'quick answers flag RUSHED');
  assert(r('Fox')[5] === 'Done — RUSHED', 'very low average time flags RUSHED');
  const sm = s5.getSheetByName('Class Summary').data, sh = sm[0];
  assert(/Omar Diaz/.test(sm[1][sh.indexOf('Flagged RUSHED')]) && !/Eva Cruz/.test(sm[1][sh.indexOf('Flagged RUSHED')]), 'Class Summary lists who rushed');
  const qa5 = s5.getSheetByName('Question Analysis').data;
  assert(qa5[1][7] === Math.round((40 + 3 + 12) / 3), 'Question Analysis average seconds');
  const resp5 = s5.getSheetByName('Responses').data;
  assert(resp5[1][10] === 40, 'seconds saved per answer');
  // a page that does not send time (older page) is never flagged
  JSON.parse(G5.doPost({ postData: { contents: JSON.stringify({ ...base, name: 'Eva Cruz', period: 'B5', session: 'e2', items: [{ id: '1', std: 'NC.8.F.1', label: 'Q1', answer: 'A', ok: 1 }] }) } }).s);
  assert(s5.getSheetByName('Gradebook').data.find(x => x[1] === 'Cruz')[5] === 'Done', 'no time sent → not flagged');
}
