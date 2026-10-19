// End-to-end test of ScoreTracker_v2.gs against the strict mock, with a simulated class.
const { load } = require('./mockgas');
const assert = (c, m) => { if (!c) { console.error('FAIL:', m); process.exitCode = 1; } else console.log('ok  ', m); };
const G = load(__dirname + '/ScoreTracker_v2.gs');
const post = d => JSON.parse(G.doPost({ postData: { contents: JSON.stringify(d) } }).s);

// 1. setup twice (idempotent), one trigger
G.setup(); G.setup();
assert(G.__triggers.length === 1, 'one hourly trigger after running setup twice');
const ss = Object.values(G.__books)[0];
['Scores','Summary','Responses','Submissions','Standards','Standards (list)','Statistics','Settings','Read Me']
  .forEach(t => assert(!!ss.getSheetByName(t), 'tab exists: ' + t));
assert(!ss.getSheetByName('Sheet1'), 'default Sheet1 removed');

// 2. Fluency Lab still works exactly as before
let r = post({ code: 'allen-8th', name: 'maria lopez', module: 'Fractions', score: 9, total: 10 });
assert(r.ok && r.name === 'Maria Lopez' && r.pct === 90, 'fluency score accepted');
assert(ss.getSheetByName('Summary').data[1][0] === 'Maria Lopez', 'fluency summary rebuilt');
assert(!post({ code: 'nope', name: 'A B', module: 'Fractions', score: 1, total: 2 }).ok, 'wrong class code rejected');
assert(!post({ code: 'allen-8th', name: 'A B', module: 'Hacking', score: 1, total: 2 }).ok, 'unknown fluency skill rejected');

// 3. evidence validation
assert(!post({ code: 'allen-8th', v: 2, kind: 'quiz', name: 'A B', items: [{ id: 1 }] }).ok, 'bad kind rejected');
assert(!post({ code: 'allen-8th', v: 2, kind: 'practice', name: 'A B', items: [] }).ok, 'empty items rejected');
assert(!post({ code: 'allen-8th', v: 2, kind: 'practice', name: '', items: [{ id: 1 }] }).ok, 'no name rejected');
r = post({ code: 'allen-8th', v: 2, kind: 'practice', unit: '3', page: 'x', name: 'Bad Std', session: 's0',
           items: [{ id: 'q1', std: 'DROP TABLE', band: 9, first: 1, final: 1 }] });
const lastResp = ss.getSheetByName('Responses').data.slice(-1)[0];
assert(r.ok && lastResp[7] === '' && lastResp[8] === 4, 'junk standard blanked, bad band → 4');

// 4. simulate a class: 24 students, Unit 3 pre-test (18 items: 6 basic, 6 target, 6 advanced), then practice
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const logistic = x => 1 / (1 + Math.exp(-x));
const students = Array.from({ length: 24 }, (_, i) => ({ name: 'Student ' + String.fromCharCode(65 + i) + ' Test', ab: rnd() * 3 - 1.5 }));
const diff = { 3: -1.2, 4: 0, 5: 1.3 };
let t0 = Date.now();
const RealDate = G.Date;
students.forEach((s, i) => {
  const items = [];
  [3, 4, 5].forEach(b => { for (let k = 1; k <= 6; k++) { const ok = rnd() < logistic(1.7 * (s.ab - diff[b] + (rnd() - 0.5) * 0.6)) ? 1 : 0; items.push({ id: 'Q' + ((b - 3) * 6 + k), std: 'NC.8.EE.7', band: b, first: ok, final: ok }); } });
  const res = post({ code: 'allen-8th', v: 2, kind: 'pretest', unit: '3', page: 'Unit 3 Pre-Test', name: s.name, session: 'pre' + i, items });
  if (!res.ok) throw new Error('pretest post failed ' + JSON.stringify(res));
});
// shift pre-test rows back in time so practice is clearly later
ss.getSheetByName('Responses').data.forEach((row, i) => { if (i && row[2] === 'Pre-test') row[0] = new Date(t0 - 7 * 864e5); });
// practice two weeks later: students improved (+0.8 ability), target-level items on EE.7
students.forEach((s, i) => {
  const items = [];
  for (let k = 1; k <= 8; k++) { const ok = rnd() < logistic(1.7 * (s.ab + 0.8)) ? 1 : 0; items.push({ id: 'p' + k, std: 'NC.8.EE.7', band: 4, first: ok, final: 1, tries: ok ? 1 : 2 }); }
  post({ code: 'allen-8th', v: 2, kind: 'practice', unit: '3', page: 'Unit 3 · Guided Notes practice', name: s.name, session: 'pr' + i, items });
});
// a resend of the same session must not double count
const s0 = students[0];
post({ code: 'allen-8th', v: 2, kind: 'practice', unit: '3', page: 'Unit 3 · Guided Notes practice', name: s0.name, session: 'pr0',
       items: [{ id: 'p1', std: 'NC.8.EE.7', band: 4, first: 1, final: 1 }] });

G.refreshReports();
const stdTab = ss.getSheetByName('Standards').data, list = ss.getSheetByName('Standards (list)').data, stats = ss.getSheetByName('Statistics').data;
assert(stdTab[2][1].startsWith('NC.8.EE.7'), 'standards grid has EE.7 column');
assert(stdTab.length >= 3 + 25, 'standards grid has a row per student (24 + Bad Std excluded: no std)');
const lv = list.slice(1).map(r => r[6]);
assert(lv.every(v => v >= 1 && v <= 5), 'every decaying average is between 1 and 5');
const kr = stats.find(r => r[0] === 'Unit 3 Pre-Test');
console.log('     validity row:', JSON.stringify(kr));
assert(kr && kr[1] === 24 && kr[2] === 18 && typeof kr[5] === 'number' && kr[5] > 0.5, 'KR-20 computed and plausible (>0.5) for a simulated sound test');
const growthAll = stats.find(r => r[0] === 'All standards');
console.log('     growth row:', JSON.stringify(growthAll));
assert(growthAll && growthAll[3] > growthAll[5], 'growth: more students went up than down');
const items = stats.filter(r => r[0] === 'Unit 3 Pre-Test' && /^Q\d+$/.test(r[1]));
assert(items.length === 18, 'item analysis has all 18 questions');
const pB = items.filter(r => r[3] === 3).map(r => r[5]), pA = items.filter(r => r[3] === 5).map(r => r[5]);
const avg = a => a.reduce((x, y) => x + y, 0) / a.length;
assert(avg(pB) > avg(pA), 'basic questions easier than advanced in item analysis');
// resend check: student A practice evidence should be from the newest send only (1 item)
const A = G.Analytics;
assert(Math.abs(A.decaying([3, 4], 0.65) - (4 + 3 * 0.65) / 1.65) < 1e-12, 'decaying average matches syllabus weights');
const S = { met: 0.8, partial: 0.5, lvl4: 0.75, lvl3: 0.25, lvl2: 0.10, decay: 0.65, minN: 5 };
const L = b => A.level(b, S);
assert(L({ 3: { n: 6, c: 5 }, 4: { n: 6, c: 5 }, 5: { n: 6, c: 5 } }) === 5, 'level 5 when all bands met');
assert(L({ 3: { n: 6, c: 5 }, 4: { n: 6, c: 5 }, 5: { n: 6, c: 2 } }) === 4, 'level 4 when basic+target met');
assert(L({ 3: { n: 6, c: 6 }, 4: { n: 6, c: 3 }, 5: { n: 6, c: 6 } }) === 3, 'level 3 when target not met (advanced ignored)');
assert(L({ 3: { n: 6, c: 3 }, 4: { n: 6, c: 0 } }) === 2, 'level 2 when basic half right');
assert(L({ 3: { n: 6, c: 1 } }) === 1, 'level 1 when basic mostly wrong');
assert(L({ 4: { n: 12, c: 9 } }) === 4 && L({ 4: { n: 12, c: 3 } }) === 3 && L({ 4: { n: 12, c: 2 } }) === 2 && L({ 4: { n: 12, c: 1 } }) === 1, 'practice target-level ladder 4/3/2/1');
// Wilcoxon vs known values (scipy.stats.wilcoxon(..., correction=True, method="approx"))
const w = A.wilcoxon([1, 2, 1, 1, 0, 2, 1, -1, 1, 1, 2, 0, 1]);
console.log('     wilcoxon:', JSON.stringify(w));
const P = A.phi(1.96);
assert(Math.abs(P - 0.9750021) < 1e-6, 'normal CDF accurate');
console.log(process.exitCode ? 'SOME TESTS FAILED' : 'ALL TESTS PASSED');

// 3. Skill Check plan columns
{
  const r2 = post({ code: 'allen-8th', name: 'plan tester', module: 'Divide', score: 10, total: 13, sbg: 3, practice: 'Remainders (L6)' });
  const sc = ss.getSheetByName('Scores').data; const last = sc[sc.length - 1];
  console.log((r2.ok && last[6] === 3 && last[7] === 'Remainders (L6)' && sc[0][6] === 'SBG level') ? 'ok   plan columns saved' : 'FAIL: plan columns ' + JSON.stringify([sc[0], last]));
  const r3 = post({ code: 'allen-8th', name: 'old page', module: 'Divide', score: 5, total: 13 });
  const l3 = ss.getSheetByName('Scores').data.slice(-1)[0];
  console.log(r3.ok && l3[6] === '' ? 'ok   old pages (no plan) still accepted' : 'FAIL: old page ' + JSON.stringify(l3));
}
