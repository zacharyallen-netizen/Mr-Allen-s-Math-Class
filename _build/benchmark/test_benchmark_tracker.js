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
const r2 = JSON.parse(G2.doPost({ postData: { contents: JSON.stringify({ ...base, name: 'Ann Lee', period: '8A', session: 'q', items: items([1, 0]) }) } }).s);
assert(r2.ok && sub2.data[0][9] === 'Class' && sub2.data[1][9] === '8A', 'old Sheet header upgraded with Class');
